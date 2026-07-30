/**
 * SEC-4b · vendor-surface service keys — the guard, and the thing that keeps it
 * complete.
 *
 * The risk this file manages is DRIFT, not logic. `isVendorSurfaceServiceKey`
 * is four `startsWith` calls; the way it fails is by someone adding a FIFTH
 * `vendor_*__<id>` PREFIX_HOOK to lib/sku-activation.ts and not adding it here.
 * The new family would then be sellable from couple checkout at the browser's
 * price, and would provision a vendor-owned object on approval — silently, with
 * every test green.
 *
 * So the load-bearing test is the last one: it re-derives the prefix list from
 * the ACTIVATION HOOKS themselves and fails when the two disagree.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  VENDOR_SURFACE_SERVICE_KEY_PREFIXES,
  isVendorSurfaceServiceKey,
  assertVendorSurfaceKeyNotSoldToCouple,
  VendorSurfaceKeyRefused,
} from './vendor-surface-service-keys';

const HERE = dirname(fileURLToPath(import.meta.url));

test('every vendor-surface family is recognised', () => {
  for (const prefix of VENDOR_SURFACE_SERVICE_KEY_PREFIXES) {
    assert.ok(
      isVendorSurfaceServiceKey(`${prefix}b3f1c0de-0000-4000-8000-000000000000`),
      `${prefix} is not recognised as a vendor-surface key`,
    );
  }
});

test('ordinary couple SKUs are untouched', () => {
  // A false positive here would BLOCK a real purchase, so name the live ones.
  for (const key of [
    'PAPIC_GUEST',
    'PAPIC_CAMERAS',
    'SETNAYAN_AI',
    'SETNAYAN_AI_SUB',
    'SETNAYAN_AI_RENEW',
    'save-the-date:veil',
    'GUIDED_PACK',
    'MEDIA_PACK',
  ]) {
    assert.equal(isVendorSurfaceServiceKey(key), false, `${key} must stay sellable`);
  }
});

test('the bare prefix with no id is still refused', () => {
  // Fail closed: `vendor_extra_seat__` with an empty suffix parses to null in
  // the hook (so it would no-op) but there is no reason to let it be SOLD.
  for (const prefix of VENDOR_SURFACE_SERVICE_KEY_PREFIXES) {
    assert.equal(isVendorSurfaceServiceKey(prefix), true, `${prefix} (bare) must be refused`);
  }
});

test('assertVendorSurfaceKeyNotSoldToCouple throws only for vendor keys', () => {
  assert.throws(
    () => assertVendorSurfaceKeyNotSoldToCouple('vendor_extra_seat__abc'),
    (e: unknown) => e instanceof VendorSurfaceKeyRefused,
  );
  assert.doesNotThrow(() => assertVendorSurfaceKeyNotSoldToCouple('PAPIC_GUEST'));
});

test('the refusal message does not leak whether the target exists', () => {
  const a = new VendorSurfaceKeyRefused().message;
  assert.ok(!/vendor|branch|charge|seat|plan|[0-9a-f]{8}-/i.test(a), `leaky message: ${a}`);
});

/* ── THE ONE THAT MATTERS — no drift against the activation hooks ──────────── */

test('the prefix list covers every vendor_*__ PREFIX_HOOK in sku-activation', () => {
  const activation = readFileSync(resolve(HERE, 'sku-activation.ts'), 'utf8');

  // Each vendor family is identified by its `<name>FromServiceKey`-style parser
  // inside a `match:` line. Collect the prefixes those parsers are built from by
  // reading the constants out of their own modules, then compare as sets.
  const matchLines = [...activation.matchAll(/match:\s*\(serviceKey\)\s*=>\s*([^\n]+)/g)].map(
    (m) => m[1]!,
  );
  assert.ok(matchLines.length >= 4, 'the PREFIX_HOOKS block moved — this test is not reading it');

  // `<something>From<Family>ServiceKey(` — covers branchIdFromServiceKey,
  // chargeIdFromBookingFeeLockServiceKey, vendorProfileIdFromSeatServiceKey and
  // vendorProfileIdFromCustomPlanServiceKey without naming any of them.
  // `<something>From<Family>ServiceKey(` — no leading \b, because these names
  // are mid-identifier (`chargeIdFrom…`) where \b does not match.
  const vendorParsers = matchLines.filter((l) => /From[A-Za-z]*ServiceKey\s*\(/.test(l));
  assert.equal(
    vendorParsers.length,
    VENDOR_SURFACE_SERVICE_KEY_PREFIXES.length,
    'the number of key-parsing PREFIX_HOOKS no longer matches ' +
      'VENDOR_SURFACE_SERVICE_KEY_PREFIXES. A new vendor_*__<id> family must be added to ' +
      'lib/vendor-surface-service-keys.ts — otherwise it is sellable from couple checkout at ' +
      'the browser’s price and provisions a vendor-owned object on approval.',
  );

  // …and every hook that parses a key must also assert target ownership.
  // `await …(` so the function's own declaration is not counted as a call site.
  const guarded = [...activation.matchAll(/await\s+assertOrderOwnsVendorTarget\(/g)].length;
  assert.equal(
    guarded,
    VENDOR_SURFACE_SERVICE_KEY_PREFIXES.length,
    'a vendor_*__<id> activation hook provisions without assertOrderOwnsVendorTarget(). ' +
      'The order that paid must own the branch / charge / profile it is activating.',
  );
});
