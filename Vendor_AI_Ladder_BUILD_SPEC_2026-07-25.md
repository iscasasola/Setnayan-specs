# Vendor AI Chatbot — Basic/Advanced LADDER · BUILD SPEC (2026-07-25)

> ## ⚠ CORRECTION APPLIED 2026-07-25 — verify before you trust this doc
>
> Two of this spec's security claims were checked empirically against a replayed database. **One was real, one was wrong.**
>
> 1. ✅ **REAL — `vendor_profiles` add-on columns are vendor-self-writable.** Reproduced: with the fix removed, 6 of 9 DB tests fail, i.e. a vendor can PATCH themselves a free Vendor AI window, a free branded 3D booth, and re-arm the one-time trial. Fixed in **PR #3705** (migration `20271002456914`).
> 2. ❌ **WRONG — "`orders.service_key` is vendor-PATCHable".** It is **already guarded**: `guard_orders_protected_columns` (migration `20270226279630:51`) has covered `service_key` since 2026-02. The reviewer checked `20260513150000` and `20270920010000` but missed that one. **No migration was shipped for it** — §1 part 4 of this spec (the `guard_orders_service_key_immutable` trigger) is REDUNDANT; do not build it.
>
> Lesson worth keeping: an adversarial agent asserting a vulnerability is a lead, not a finding. Both claims looked equally credible on paper; only running the exploit separated them.

> Produced by an 9-agent design + 3-lens adversarial review (money · RLS/trust · rollback) against origin/main on 2026-07-25. Companion to `Vendor_Monetization_BUILD_PLAN_2026-07-25.md`. Capability line is owner-locked in `Vendor_Front_Desk_Chatbot_Build_Plan_2026-07-18.md` § 8.

# BUILD SPEC (FINAL) — Vendor AI Chatbot **Basic / Advanced ladder** (flag-dark)

Repo: `/Users/icecasasola/Documents/Claude/Projects/setnayan-platform-wt-first5` · branch `claude/vendor-addon-band-foundation` @ `c9ef96159`

**One-line summary:** one entitlement window (`vendor_profiles.ai_addon_expires_at`) + one new **server-written** level marker (`vendor_profiles.ai_addon_level`) + one new `vendor_`-prefixed SKU seeded **inactive**. Ships as **two PRs** (migration first, verified; code second). Sells nothing, changes no live behaviour.

**What the three lenses changed (headline):**
1. **Ships as two PRs** — the "code + migration in one PR" shape was the root cause of a whole-fleet outage class. **[hardened: rollback]**
2. **Every `ai_addon_level` read/write is flag-gated**, so flag-off emits byte-identical SQL. **[hardened: rollback / rls-trust]**
3. **Activation re-asserts the sale locks** — `orders.service_key` is vendor-writable, so buy-action-only locks were never locks. **[hardened: rls-trust]**
4. **One in-flight AI order per vendor** — closes the free-cycle-after-Advanced and double-submit money leaks. **[hardened: money]**
5. **Refund reversal no longer destroys a prior paid cycle**, and the level reset no longer hides behind an early return. **[hardened: money / rls-trust / rollback]**

---

## 0 · Constraint compliance map

| # | Constraint | How this spec satisfies it |
|---|---|---|
| C1 | One window + server-written level marker | Advanced stacks into the SAME `ai_addon_expires_at`; `sku-activation.ts:1326` union **untouched**. Level lives in a new column written only by the service-role client. |
| C2 | `vendor_bot_config.mode` is vendor-writable → gate, don't trust | `mode` is **not read and not written** by this PR (zero readers today — `inbox-hook.ts:110-113`, `shop/page.tsx:886-889`, `autoreply-actions.ts:70`). Verified independently by the rls lens (grep: only comments + a negative test at `config.test.ts:89`). |
| C3 | New SKU starts `vendor_` | `vendor_ai_addon_advanced` → `isVatInclusiveServiceKey` (`apps/web/lib/orders.ts:201-203`, confirmed a literal `startsWith('vendor_')`) → no shortfall strand. |
| C4 | `price_php > 0` | Catalog row seeded at `3000.00` (CHECK at `20260631000000:76`); ₱0 stays a resolver output (`vendor-addon-pricing.ts:66-69`). |
| C5 | Band price behind the flag | Advanced reuses `resolveVendorAddonPricePhp('ai_chatbot_advanced', tier)` (`vendor-addon-tier-pricing.ts:64` — ₱3,000/₱2,500) behind `isVendorAddonTieredPricingEnabled()`. |
| C6 | Pure libs stay pure | New level resolver is pure (injected `nowMs`, no env, no I/O); flag lives in a separate 3-line module. |
| C7 | ROOT `changelog.d/` | `changelog.d/vendor-ai-ladder.md` (repo root). |
| **C8** | **Locks must survive a hostile client** *(new — [hardened: rls-trust])* | Every lock is re-asserted on the **activation** path (service-role, post-approval), not only in the buy action, because `orders.service_key` is vendor-PATCHable. |
| **C9** | **Flag-off ⇒ byte-identical SQL, not just byte-identical logic** *(new — [hardened: rollback])* | Column lists and update payloads are built from `isVendorAiLadderEnabled()`; a pre-migration DB with the flag off is indistinguishable from today. |

---

## 0a · Ship order — **two PRs, not one** **[hardened: rollback]**

The original spec merged the migration and its readers together. `MEMORY.md` records that migrations on this repo *auto-apply unreliably on bursty merges* while Vercel deploys on every push — and PostgREST answers an unknown column with `42703`, returning `{ data: null }` for the **entire row**, not `undefined` for one field. That combination silences the assistant for every paying vendor and deadlocks activation (see §5b). Splitting removes the ordering hazard entirely.

**PR-A — schema only.** §1 in full (column + backfill + CHECK + comment, inactive Advanced SKU row, entitlement-guard hardening, `orders.service_key` immutability trigger, Basic title rename). No `apps/web` change except the root changelog fragment. **Merge, then explicitly verify:**

```bash
gh workflow run supabase-migrations.yml --ref main   # do not assume auto-apply
# then run the three VERIFICATION selects at the foot of §1b
```

**PR-B — code only.** §2–§3, flag-dark. Do **not** open PR-B until the three verification selects return the expected rows on prod.

Belt-and-braces: PR-B is *still* written so that flag-off never names the new column (§0 C9), so even a rollback of PR-A cannot brick PR-B.

---

## 1 · The migration (PR-A)

### 1a · Exact filename

Highest prefix on disk: **`20271002100000`** (`supabase/migrations/20271002100000_live_studio_wave2_extras.sql`) — re-verified. `scripts/check-migration-timestamps.mjs` RULE 2 rejects only a hand-typed round `\d{8}000000` prefix (`:41-43`), so the allocator-shaped name below passes (both reviewers independently confirmed).

```
supabase/migrations/20271002418327_vendor_ai_level_and_advanced_sku.sql
```

Canonical generator: `pnpm migration:new "vendor_ai_level_and_advanced_sku"` (takes the `maxExisting + 1 + nudge` branch at `scripts/new-migration.mjs:96-103`).

### 1b · Full SQL

```sql
-- vendor_ai_level_and_advanced_sku
-- ============================================================================
-- Vendor AI (the AI Chatbot) — BASIC / ADVANCED ladder (owner-locked
-- 2026-07-25 vendor monetization model). Prices live in the code SSOT:
-- apps/web/lib/vendor-addon-tier-pricing.ts:63-64 —
--   ai_chatbot_basic    { entry 2000, growth 1500 }   (per 28-day cycle)
--   ai_chatbot_advanced { entry 3000, growth 2500 }   (per 28-day cycle)
--
-- SHAPE (constraint-driven, do not "improve"):
--   • ONE entitlement window. Both variants stack into the EXISTING
--     vendor_profiles.ai_addon_expires_at.
--   • The LEVEL is a SEPARATE, SERVER-WRITTEN marker (column 1 below). It is NOT
--     vendor_bot_config.mode — that column is vendor-writable under policy
--     vendor_bot_config_write (20270822679405:36-40).
--   • The new SKU code starts with 'vendor_' — REQUIRED (orders.ts:201-203).
--   • The row is seeded is_active = FALSE ON PURPOSE. Every ADVANCED capability
--     is UNBUILT (see §4). is_active is now enforced in TWO places: the buy
--     action AND the activation hook (a vendor can PATCH orders.service_key, so
--     the buy action alone was never a lock).
--
-- ⚠ SHIP ORDER: this migration merges and is VERIFIED APPLIED before any code
--   that names ai_addon_level. See the build spec §0a.
--
-- ⚠ REVERT ORDER (there is no down-migration; if you must roll back, do it in
--   THIS order): (1) restore the 3-column body of
--   guard_vendor_profiles_entitlement() from 20270920020000:83-124, THEN
--   (2) DROP COLUMN vendor_profiles.ai_addon_level. The guard below is written
--   drop-TOLERANT (jsonb field access, not NEW.<col>), so even the wrong order
--   no longer raises 'record "new" has no field ai_addon_level' on every vendor
--   profile UPDATE — but do it in order anyway.
--
-- KEEP IDEMPOTENT: IF NOT EXISTS everywhere; ON CONFLICT DO UPDATE that never
-- stomps price_php or is_active (both admin-managed at /admin/pricing).
-- ============================================================================

BEGIN;

-- ── 1 · the SERVER-WRITTEN level marker on the ONE entitlement window ────────
ALTER TABLE public.vendor_profiles
  ADD COLUMN IF NOT EXISTS ai_addon_level TEXT;

UPDATE public.vendor_profiles
   SET ai_addon_level = 'basic'
 WHERE ai_addon_level IS NULL;

ALTER TABLE public.vendor_profiles ALTER COLUMN ai_addon_level SET DEFAULT 'basic';
ALTER TABLE public.vendor_profiles ALTER COLUMN ai_addon_level SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'vendor_profiles_ai_addon_level_check'
       AND conrelid = 'public.vendor_profiles'::regclass
  ) THEN
    ALTER TABLE public.vendor_profiles
      ADD CONSTRAINT vendor_profiles_ai_addon_level_check
      CHECK (ai_addon_level IN ('basic', 'advanced'));
  END IF;
END$$;

COMMENT ON COLUMN public.vendor_profiles.ai_addon_level IS
  'Vendor AI ladder (owner 2026-07-25): which LEVEL the vendor''s single AI add-on window (ai_addon_expires_at) currently grants — ''basic'' (today''s deterministic front desk) or ''advanced''. SERVER-WRITTEN ONLY: stamped by the paid-order activation hook (apps/web/lib/sku-activation.ts) and the free-first-cycle claim (ai-addon-actions.ts), both on the service-role client, and blocked for vendor self-writes by trg_guard_vendor_profiles_entitlement. NOT vendor_bot_config.mode (a vendor-writable PREFERENCE, never an entitlement). Defaults to ''basic'' — least privilege, byte-identical to today''s engine. Reading code must also default ''basic'' (coerceVendorAiLevel). App code only NAMES this column while NEXT_PUBLIC_VENDOR_AI_LADDER is on, so a schema/deploy skew can never null a whole vendor_profiles read. Lapse is automatic at read time via ai_addon_expires_at — no cron.';

-- ── 2 · seed the ADVANCED SKU · INACTIVE ────────────────────────────────────
-- display_order 87 continues the add-on block (80..86 taken).
-- price_php 3000.00 = the ENTRY (Free/Solo) band figure — the HIGHER of the two,
-- so a catalog fallback can never under-charge.
INSERT INTO public.vendor_billing_catalog
  (sku_code, title, price_php, offering_type, token_grant_count, max_categories, max_sub_seats, is_active, display_order)
VALUES
  ('vendor_ai_addon_advanced', 'Vendor AI — AI Chatbot Advanced (28-day)', 3000.00, 'vendor_addon_recurring', NULL, NULL, NULL, FALSE, 87)
ON CONFLICT (sku_code) DO UPDATE SET
  title             = EXCLUDED.title,
  offering_type     = EXCLUDED.offering_type,
  token_grant_count = EXCLUDED.token_grant_count,
  max_categories    = EXCLUDED.max_categories,
  max_sub_seats     = EXCLUDED.max_sub_seats,
  display_order     = EXCLUDED.display_order,
  updated_at        = NOW();
  -- price_php AND is_active intentionally NOT overwritten: admin-managed, and
  -- is_active is the launch switch. A re-applied migration must never re-lock a
  -- SKU the owner turned on.

UPDATE public.vendor_billing_catalog
   SET title = 'Vendor AI — AI Chatbot Basic (28-day)', updated_at = NOW()
 WHERE sku_code = 'vendor_ai_addon'
   AND title <> 'Vendor AI — AI Chatbot Basic (28-day)';

-- ── 3 · close the self-grant hole on the new marker ─────────────────────────
-- guard_vendor_profiles_entitlement (20270920020000:83-124) guards only
-- tier_state / tier_expires_at / extra_agent_seats. vendor_profiles carries a
-- FOR ALL owner policy (20260513120000:62-67) with no column scoping, so any
-- un-guarded column is vendor-self-writable via PostgREST. Same edit closes the
-- pre-existing hole on the four addon window / trial columns (every legitimate
-- writer is the service-role client: ai-addon-actions.ts:177,
-- booth-addon-actions.ts:244/254, sku-activation.ts:346/434 — audited).
--
-- [hardened: rollback] ai_addon_level is compared through to_jsonb(NEW/OLD) so
-- this function does NOT raise if the column is later dropped.
CREATE OR REPLACE FUNCTION public.guard_vendor_profiles_entitlement()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  new_level TEXT := to_jsonb(NEW) ->> 'ai_addon_level';
  old_level TEXT := CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ->> 'ai_addon_level' END;
BEGIN
  IF current_user IN ('authenticated', 'anon') AND NOT public.is_admin() THEN
    IF TG_OP = 'INSERT' THEN
      IF NEW.tier_state IS DISTINCT FROM 'free'::public.vendor_tier_state
         OR NEW.tier_expires_at IS NOT NULL
         OR NEW.extra_agent_seats IS DISTINCT FROM 0
         OR (new_level IS NOT NULL AND new_level <> 'basic')
         OR NEW.ai_addon_expires_at IS NOT NULL
         OR NEW.ai_addon_trial_used_at IS NOT NULL
         OR NEW.booth_addon_expires_at IS NOT NULL
         OR NEW.booth_addon_trial_used_at IS NOT NULL
      THEN
        RAISE EXCEPTION
          'vendor_profiles tier/seat/add-on entitlement columns are not writable by the vendor (self-grant blocked)'
          USING ERRCODE = 'insufficient_privilege',
                HINT = 'Tier, paid seat and paid add-on changes go through the admin console or the paid activation path (service_role).';
      END IF;
    ELSE  -- UPDATE
      IF NEW.tier_state IS DISTINCT FROM OLD.tier_state
         OR NEW.tier_expires_at IS DISTINCT FROM OLD.tier_expires_at
         OR NEW.extra_agent_seats IS DISTINCT FROM OLD.extra_agent_seats
         OR new_level IS DISTINCT FROM old_level
         OR NEW.ai_addon_expires_at IS DISTINCT FROM OLD.ai_addon_expires_at
         OR NEW.ai_addon_trial_used_at IS DISTINCT FROM OLD.ai_addon_trial_used_at
         OR NEW.booth_addon_expires_at IS DISTINCT FROM OLD.booth_addon_expires_at
         OR NEW.booth_addon_trial_used_at IS DISTINCT FROM OLD.booth_addon_trial_used_at
      THEN
        RAISE EXCEPTION
          'vendor_profiles tier/seat/add-on entitlement columns are not writable by the vendor (self-grant blocked)'
          USING ERRCODE = 'insufficient_privilege',
                HINT = 'Tier, paid seat and paid add-on changes go through the admin console or the paid activation path (service_role).';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_vendor_profiles_entitlement ON public.vendor_profiles;
CREATE TRIGGER trg_guard_vendor_profiles_entitlement
  BEFORE INSERT OR UPDATE ON public.vendor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_vendor_profiles_entitlement();

-- ── 4 · orders.service_key is IMMUTABLE for non-admin writers ───────────────
-- [hardened: rls-trust] orders_owner_write (20260513150000:76-81) is FOR ALL with
-- no column scoping, and the only restrictive guard (20270920010000:63-97) pins
-- STATUS, not service_key. So a vendor could buy Basic, then
--   PATCH /rest/v1/orders?order_id=eq.<own> {"service_key":"vendor_ai_addon_advanced"}
-- and receive Advanced at the Basic price — while the SKU is switched off.
-- RLS cannot express "column unchanged" (WITH CHECK sees NEW only) → trigger.
-- SAFE: grepped apps/web — no code path updates orders.service_key after insert
-- (only SELECT lists reference it: lib/orders.ts:103,
-- lib/vendor-booking-fees.server.ts:25).
CREATE OR REPLACE FUNCTION public.guard_orders_service_key_immutable()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF current_user IN ('authenticated', 'anon') AND NOT public.is_admin() THEN
    IF NEW.service_key IS DISTINCT FROM OLD.service_key THEN
      RAISE EXCEPTION 'orders.service_key is immutable (SKU swap blocked)'
        USING ERRCODE = 'insufficient_privilege',
              HINT = 'Cancel this order and place a new one for the other SKU.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_orders_service_key_immutable ON public.orders;
CREATE TRIGGER trg_guard_orders_service_key_immutable
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_orders_service_key_immutable();

COMMIT;

-- ============================================================================
-- VERIFICATION — run all three before opening PR-B (§0a).
--
-- SELECT sku_code, price_php, offering_type, is_active, display_order
--   FROM vendor_billing_catalog WHERE sku_code LIKE 'vendor_ai_addon%';
-- -- Expected: vendor_ai_addon 1500.00 t 82 · vendor_ai_addon_advanced 3000.00 f 87
--
-- SELECT ai_addon_level, count(*) FROM vendor_profiles GROUP BY 1;
-- -- Expected: exactly one row — basic | <every vendor>
--
-- SELECT count(*) FROM vendor_profiles
--  WHERE ai_addon_expires_at > now() AND ai_addon_level <> 'basic';
-- -- Expected: 0
-- ============================================================================
```

**No `offering_type` / `vendor_billing_shape` CHECK surgery** — `vendor_addon_recurring` with `token_grant_count IS NULL` is already admitted (`20270907924171_vendor_deep_search_sku.sql:62-70`, re-verified by the money lens) and is already in `V2VendorSku['offering_type']` (`v2-catalog.ts:86-92`). **No RLS work on `vendor_billing_catalog`** — public-select / service-role-write (`20260631000000:127-133`), which is *why* the inactive row is still readable by the buy action and still listed at `/admin/pricing` (`pricing-surface.tsx:158-164` has no `is_active` filter).

---

## 2 · The level resolver (new PURE lib — PR-B)

Location and rationale unchanged: **`apps/web/lib/vendor-ai-level.ts`** beside (not inside) `vendor-addon-pricing.ts`; flag in **`apps/web/lib/vendor-ai-ladder-flag.ts`**; flag-aware wrapper in **`apps/web/lib/vendor-ai-level-gate.ts`** (copy `vendor-addon-tiered-pricing-flag.ts` ↔ `booth-branding-tier-gate.ts` verbatim).

> **Why a NEW flag, not `NEXT_PUBLIC_VENDOR_ADDON_TIERED_PRICING`:** that one governs price bands and is expected to flip at monetization launch; the ladder must not ride along, because Advanced's capabilities are unbuilt.

```ts
// apps/web/lib/vendor-ai-level.ts
// PURE — no I/O, no env, no ambient clock (nowMs injected). Runs under tsx --test.

export type VendorAiLevel = 'basic' | 'advanced';
export const VENDOR_AI_LEVELS: readonly VendorAiLevel[] = ['basic', 'advanced'] as const;

/** orders.service_key + vendor_billing_catalog.sku_code for the ADVANCED cycle.
 *  MUST start 'vendor_' (orders.ts:201-203 — VAT-inclusive detection). */
export const VENDOR_AI_ADVANCED_SKU_CODE = 'vendor_ai_addon_advanced';

/** [hardened: money] Last-resort Advanced cycle price. Deliberately the ENTRY
 *  band figure, and deliberately NOT VENDOR_AI_ADDON_FALLBACK_PHP (₱1,500 —
 *  vendor-addon-pricing.ts:36), which would sell Advanced at the Basic price if
 *  the catalog row were missing. Callers must still refuse Advanced when the
 *  catalog row is absent (see §3.1); this constant is the second net. */
export const VENDOR_AI_ADVANCED_FALLBACK_PHP = 3000;

export const VENDOR_AI_BASIC_REPLY_CAP_CEILING = 30;      // = vendor_bot_config.daily_reply_cap DEFAULT (20270822679405:17)
export const VENDOR_AI_ADVANCED_REPLY_CAP_CEILING = 200;  // = DAILY_REPLY_CAP_MAX (vendor-autoreply/config.ts:25)

/** Fail-closed narrowing. 'basic' is least-privilege AND byte-identical to
 *  today's shipped engine, so every unknown input reproduces pre-PR behaviour. */
export function coerceVendorAiLevel(raw: unknown): VendorAiLevel {
  return raw === 'advanced' ? 'advanced' : 'basic';
}

export type VendorAiLevelInput = {
  addonActive: boolean;   // isVendorAiAddonActive(ai_addon_expires_at)
  storedLevel: unknown;   // raw ai_addon_level, untrusted
  ladderEnabled: boolean; // isVendorAiLadderEnabled()
};

/** The level in force RIGHT NOW, or null when no live window at all.
 *  Ladder OFF ⇒ always 'basic' while live, whatever is stored. */
export function resolveVendorAiLevel(input: VendorAiLevelInput): VendorAiLevel | null {
  if (!input.addonActive) return null;
  if (!input.ladderEnabled) return 'basic';
  return coerceVendorAiLevel(input.storedLevel);
}

/** Ladder OFF ⇒ +Infinity, so Math.min(cap, ceiling) === cap (engine applies no
 *  ceiling today: inbox-hook.ts:143 passes the stored cap straight through). */
export function vendorAiReplyCapCeiling(level: VendorAiLevel | null, ladderEnabled: boolean): number {
  if (!ladderEnabled) return Number.POSITIVE_INFINITY;
  return level === 'advanced' ? VENDOR_AI_ADVANCED_REPLY_CAP_CEILING : VENDOR_AI_BASIC_REPLY_CAP_CEILING;
}

export type ActivatedAiLevelInput = {
  purchased: VendorAiLevel;
  currentLevel: unknown;
  currentExpiresAt: string | null | undefined;
  nowMs: number;
};

/** The level to WRITE on activation. Never downgrades a live window (the vendor
 *  already paid for those days); once dead, a Basic purchase resets to 'basic'. */
export function resolveActivatedAiLevel(input: ActivatedAiLevelInput): VendorAiLevel {
  if (input.purchased === 'advanced') return 'advanced';
  const cur = input.currentExpiresAt ? Date.parse(input.currentExpiresAt) : NaN;
  const windowLive = Number.isFinite(cur) && cur > input.nowMs;
  return windowLive ? coerceVendorAiLevel(input.currentLevel) : 'basic';
}

/**
 * [hardened: money · rls-trust] TRUE when a Basic activation would land on a
 * live ADVANCED window — i.e. the vendor is about to receive 28 more Advanced
 * days for a Basic payment. The buy action rejects this at submit; because
 * submit-time and approve-time are days apart and unserialised, the ACTIVATION
 * hook re-checks it and throws (→ reportActivationFault, manual refund) rather
 * than silently granting.
 */
export function isSilentAdvancedUpgrade(input: ActivatedAiLevelInput): boolean {
  if (input.purchased !== 'basic') return false;
  const cur = input.currentExpiresAt ? Date.parse(input.currentExpiresAt) : NaN;
  const windowLive = Number.isFinite(cur) && cur > input.nowMs;
  return windowLive && coerceVendorAiLevel(input.currentLevel) === 'advanced';
}
```

```ts
// apps/web/lib/vendor-ai-level-gate.ts — the ONLY place the flag meets the resolver.
import { isVendorAiLadderEnabled } from './vendor-ai-ladder-flag';
import { resolveVendorAiLevel, vendorAiReplyCapCeiling, type VendorAiLevel } from './vendor-ai-level';

export function resolveVendorAiLevelNow(addonActive: boolean, storedLevel: unknown): VendorAiLevel | null {
  return resolveVendorAiLevel({ addonActive, storedLevel, ladderEnabled: isVendorAiLadderEnabled() });
}
export function vendorAiReplyCapCeilingNow(level: VendorAiLevel | null): number {
  return vendorAiReplyCapCeiling(level, isVendorAiLadderEnabled());
}

/** [hardened: rollback · C9] The vendor_profiles column list to SELECT, and the
 *  level patch to merge into an UPDATE. Flag OFF ⇒ the new column is never named,
 *  so a pre-migration DB behaves exactly like today (PostgREST answers an unknown
 *  column with 42703 and nulls the WHOLE row — not just that field). */
export function aiLevelSelect(base: string): string {
  return isVendorAiLadderEnabled() ? `${base}, ai_addon_level` : base;
}
export function aiLevelPatch(level: VendorAiLevel): Record<string, string> {
  return isVendorAiLadderEnabled() ? { ai_addon_level: level } : {};
}
```

---

## 3 · File-by-file change list (PR-B)

### 3.0 The six sites that must use `aiLevelSelect` / `aiLevelPatch` **[hardened: rollback]**

| # | File · line | Read/Write |
|---|---|---|
| 1 | `lib/vendor-autoreply/inbox-hook.ts:121-125` | select |
| 2 | `lib/vendor-addon-pricing.ts:143` (`fetchVendorAiAddonState`) | select |
| 3 | `app/vendor-dashboard/subscription/ai-addon-actions.ts:129-133` | select |
| 4 | `app/vendor-dashboard/subscription/ai-addon-actions.ts:179` (free claim) | update |
| 5 | `lib/sku-activation.ts:330-339` | select |
| 6 | `lib/sku-activation.ts:341-346` | update |

There is no seventh — do not name `ai_addon_level` anywhere else without the helper.

### 3.1 Buy action — `apps/web/app/vendor-dashboard/subscription/ai-addon-actions.ts`

| Where | Change |
|---|---|
| `:14-19` imports | add `VENDOR_AI_ADVANCED_SKU_CODE`, `VENDOR_AI_ADVANCED_FALLBACK_PHP`, `coerceVendorAiLevel`, `type VendorAiLevel`; `isVendorAiLadderEnabled`; `aiLevelSelect`, `aiLevelPatch`; `isVendorAiAddonActive`. |
| after `:74` | `function parseLevel(raw): VendorAiLevel { return coerceVendorAiLevel(String(raw ?? '').trim()); }` — **defaults `'basic'`**. |
| after `:107` | **ladder gate:** `const level = parseLevel(formData.get('level')); if (level === 'advanced' && !isVendorAiLadderEnabled()) return err('AI Chatbot Advanced isn’t available yet. You won’t be charged.');` |
| **NEW, after the tier/verification gate (`:126`)** | **[hardened: money] one AI add-on order in flight per vendor.** Closes the free-cycle-after-Advanced leak (a submitted Advanced order writes nothing to `vendor_profiles`, so the ₱0 free path stayed claimable) and the buy-Basic-and-Advanced-together leak: <br>`const { count: inFlight } = await supabase.from('orders').select('order_id', { count: 'exact', head: true }).eq('vendor_profile_id', vendorProfileId).in('service_key', [VENDOR_AI_ADDON_SKU_CODE, VENDOR_AI_ADVANCED_SKU_CODE]).in('status', ['submitted', 'awaiting_payment']).gte('created_at', new Date(Date.now() - 7 * 864e5).toISOString());`<br>`if (inFlight) return err('You already have a Vendor AI order awaiting confirmation. Cancel it first, or wait for it to be approved.');`<br>The 7-day floor matches the `pending_payment` expiry so an abandoned order can never permanently lock the vendor out. |
| `:129-135` | `.select(aiLevelSelect('ai_addon_trial_used_at, ai_addon_expires_at'))` (still one query). Derive `currentExpiry`, `currentLevel`, `windowActive = isVendorAiAddonActive(currentExpiry)`. |
| new, after that read | **no-silent-downgrade rejection — gated on the flag [hardened: rollback]:** `if (isVendorAiLadderEnabled() && level === 'basic' && windowActive && coerceVendorAiLevel(currentLevel) === 'advanced') return err(...)`. Without the flag guard, flipping the ladder OFF as a rollback would leave every Advanced holder unable to buy *any* cycle (the card stops emitting `level`, so `parseLevel` → `'basic'` → rejected; and `'advanced'` is rejected by the ladder gate). With the guard, a flag-off Basic top-up stacks and `resolveActivatedAiLevel` preserves the stored `'advanced'`, so the level survives the flag round-trip. |
| `:140-153` catalog re-read | key off the chosen SKU (`skuCode = level === 'advanced' ? VENDOR_AI_ADVANCED_SKU_CODE : VENDOR_AI_ADDON_SKU_CODE`), then **[hardened: money] make a missing row FATAL for Advanced**: the shipped guard is `if (skuRow && …is_active === false)` — a **null** row passes it, `catalogCyclePricePhp` becomes `null`, and `resolveVendorAiAddonPricePhp` falls back to `VENDOR_AI_ADDON_FALLBACK_PHP` = **₱1,500** (`vendor-addon-pricing.ts:36,52-55`), i.e. Advanced sold at the Basic price with the §4 "hard sale lock" not applied at all. Add:<br>`if (level === 'advanced' && (!skuRow \|\| (skuRow as {is_active?:boolean}).is_active !== true)) return err('AI Chatbot Advanced isn’t available yet. You won’t be charged.');` |
| `:160-162` | `const bandSku = level === 'advanced' ? 'ai_chatbot_advanced' : 'ai_chatbot_basic';` → `resolveVendorAddonPricePhp(bandSku, tier)` as the **input** to the resolver (the `:155-159` warning applies verbatim). |
| `:163` | **[hardened: money] Advanced is never free and never falls back to ₱1,500:**<br>`const pricePhp = level === 'advanced' ? Math.max(Number(cyclePricePhp) > 0 ? Number(cyclePricePhp) : VENDOR_AI_ADVANCED_FALLBACK_PHP, VENDOR_AI_ADVANCED_FALLBACK_PHP === 0 ? 0 : 0) : resolveVendorAiAddonPricePhp({ trialUsed, cyclePricePhp });`<br>— written plainly: for Advanced, `pricePhp = Number.isFinite(cyclePricePhp) && cyclePricePhp > 0 ? cyclePricePhp : VENDOR_AI_ADVANCED_FALLBACK_PHP`, and the free-cycle short-circuit is bypassed entirely (`trialUsed` is irrelevant to Advanced). Keep `renewalPricePhp` for Basic copy as today. |
| `:170-239` free path | reachable for Basic only. Merge `...aiLevelPatch('basic')` into the atomic claim's update object (`:179`); order `description` → `'Vendor AI — AI Chatbot Basic (first cycle · free)'`; add `level: 'basic'` to ledger metadata (`:223-228`). |
| `:245-256` paid path | `service_key: skuCode`; `description: level === 'advanced' ? 'Vendor AI — AI Chatbot Advanced (28-day)' : 'Vendor AI — AI Chatbot Basic (28-day)'`. |
| `:21-45` header | document the two variants, the one shared window, the in-flight rule, and that Advanced never consumes/uses the free cycle. |

### 3.2 Activation hooks — `apps/web/lib/sku-activation.ts`

| Where | Change |
|---|---|
| `:305` signature | `async function activateVendorAiAddonOrder(ctx, level: VendorAiLevel = 'basic')`. |
| **NEW, after `:327`** (`assertVendorAddonActivationEligible`) | **[hardened: rls-trust] re-assert the sale locks at activation.** `orders.service_key` is vendor-writable (`orders_owner_write` `20260513150000:76-81` is `FOR ALL`, and `20270920010000:63-97` pins only `status`; verified no app code updates it) — so a vendor could buy Basic and PATCH the key to `vendor_ai_addon_advanced`, and the hook would happily stamp `'advanced'` while the flag is off and the SKU inactive. The PR-A trigger blocks the *PATCH*; this is the in-app twin (and the only defence against a **forged** order inserted at `requested_total_php: 1`):<br>```ts\nif (level === 'advanced') {\n  if (!isVendorAiLadderEnabled()) throw new Error('vendor_ai_addon_advanced activation blocked: ladder flag off');\n  const { data: sku } = await ctx.admin.from('vendor_billing_catalog').select('is_active, price_php').eq('sku_code', VENDOR_AI_ADVANCED_SKU_CODE).maybeSingle();\n  if ((sku as {is_active?: boolean} | null)?.is_active !== true) throw new Error('vendor_ai_addon_advanced activation blocked: SKU is not active');\n  const { data: ord } = await ctx.admin.from('orders').select('requested_total_php').eq('order_id', ctx.orderId).maybeSingle();\n  const paid = Number((ord as {requested_total_php?: number} | null)?.requested_total_php ?? 0);\n  const floor = Math.min(resolveVendorAddonPricePhp('ai_chatbot_advanced', 'pro'), Number((sku as {price_php?: number}).price_php ?? VENDOR_AI_ADVANCED_FALLBACK_PHP));\n  if (!(paid >= floor)) throw new Error(`vendor_ai_addon_advanced activation blocked: underpriced order (${paid} < ${floor})`);\n}\n```<br>`throw`, not `return`, so the order stays `paid` + recoverable and surfaces via `reportActivationFault` (`:1275`) — same convention as `:110`. The price floor is the **growth-band** figure (₱2,500), the lowest legitimate Advanced charge. |
| **NEW, before the write** | **[hardened: money] approve-order race.** `if (isSilentAdvancedUpgrade({ purchased: level, currentLevel, currentExpiresAt: currentExpiry, nowMs: Date.now() })) throw new Error('vendor_ai_addon activation blocked: a Basic cycle would extend a live Advanced window');` — the §3.1 submit-time rejection cannot cover a Basic and an Advanced order submitted while the window was dead and approved in either order (that path bought 56 Advanced days for ₱5,000 against a ₱6,000 entry list). Fault → manual refund. |
| `:330-339` | `.select(aiLevelSelect('ai_addon_expires_at, ai_addon_trial_used_at'))`; read `currentLevel`. |
| `:341-346` | `const update = { ai_addon_expires_at: newExpiry, ...aiLevelPatch(resolveActivatedAiLevel({ purchased: level, currentLevel, currentExpiresAt: currentExpiry, nowMs: Date.now() })) };` Keep the defensive trial stamp at `:343-344` unchanged. |
| `:362-372` ledger | **keep the metadata key `ai_addon_expires_at` for BOTH variants** — `deactivateVendorAddonWindow` looks up exactly that key (`:1351-1356`). Add `ai_addon_level: <written level>`. |
| `:618-640` `EXACT_HOOKS` | add `[VENDOR_AI_ADVANCED_SKU_CODE]: (ctx) => activateVendorAiAddonOrder(ctx, 'advanced'),`. Without it the order flips to `paid` and activates nothing (`:1267-1269` silent no-op default). |
| `:1323-1327` | `expiryColumn` union **unchanged** (C1). Add `levelResetColumn?: 'ai_addon_level'`. |
| `:1368-1376` | **[hardened: money · rls-trust · rollback] hoist the level reset ABOVE the early return.** As designed, the reset lived inside the `newExpiry !== currentExpiry` update — but `:1368` is `if (newExpiry === currentExpiry) return;`, which is exactly the case where the level is stale: refund the Advanced order after a Basic cycle stacked on top → `resolveAddonDeactivationExpiry` returns `currentExpiry` (a later cycle owns the window) → early return → the vendor keeps `ai_addon_level='advanced'` on a Basic payment, indefinitely renewable at the Basic price. Replace with: <br>```ts\nlet levelReset: Record<string, string> = {};\nif (opts.levelResetColumn && isVendorAiLadderEnabled()) {\n  const { count } = await ctx.admin.from('orders').select('order_id', { count: 'exact', head: true })\n    .eq('vendor_profile_id', vendorProfileId)\n    .eq('service_key', VENDOR_AI_ADVANCED_SKU_CODE)\n    .eq('status', 'paid').neq('order_id', ctx.orderId);\n  if ((count ?? 0) === 0) levelReset = { [opts.levelResetColumn]: 'basic' };\n}\nconst expiryPatch = newExpiry !== currentExpiry ? { [opts.expiryColumn]: newExpiry } : {};\nif (!Object.keys(expiryPatch).length && !Object.keys(levelReset).length) return;\nconst { error } = await ctx.admin.from('vendor_profiles').update({ ...expiryPatch, ...levelReset }).eq('vendor_profile_id', vendorProfileId);\n```<br>Still one write, no extra round-trip on the common path. |
| `:1512-1530` | widen to `ctx.serviceKey === VENDOR_AI_ADDON_SKU_CODE \|\| ctx.serviceKey === VENDOR_AI_ADVANCED_SKU_CODE`, and **pass `levelResetColumn: 'ai_addon_level'` on BOTH branches** **[hardened: money]** — the Basic key can legitimately own a window whose level is `'advanced'` (no-downgrade rule), so restricting the reset to the Advanced key leaves the marker stuck. It is a no-op for a correctly-Basic row (the count query finds no other paid Advanced order and writes `'basic'` over `'basic'`). Fault tag: `'deactivate:vendor_ai_addon_advanced'` for the new key. |

### 3.2b `apps/web/lib/vendor-addon-deactivation.ts` **[hardened: money]**

Shipped behaviour (`:44-46`): when the reversed order's stamp equals the current window, the window is set to **now** — killing the *whole* window, including days funded by an earlier, still-paid order. Today that is rare; §5 makes stacking the normal case (Basic → Advanced mid-window), so a refunded ₱3,000 Advanced order would also confiscate the 27 remaining days of a ₱2,000 Basic cycle. Fix — reverse **this order's period only**:

```ts
export function resolveAddonDeactivationExpiry(
  currentExpiry: string | null | undefined,
  orderStampedExpiry: string | null | undefined,
  nowMs: number = Date.now(),
  periodDays: number = 0,           // NEW · 0 preserves today's behaviour for any caller that omits it
): string | null {
  const current = currentExpiry ?? null;
  if (!current) return current;
  if (!orderStampedExpiry) return current;
  if (current !== orderStampedExpiry) return current;   // a later cycle owns it → keep
  const stamped = Date.parse(current);
  const back = Number.isFinite(stamped) ? stamped - periodDays * 86_400_000 : NaN;
  return new Date(Number.isFinite(back) ? Math.max(nowMs, back) : nowMs).toISOString();
}
```

Both call sites pass their period (`VENDOR_AI_ADDON_PERIOD_DAYS` = 28; the 3D Booth caller its own). This is a **pre-existing** defect, not one this ladder introduces — but the ladder is what makes it routine, so it is fixed here with its own tests (§6 case 8). ⚠ It changes 3D Booth reversal behaviour too; call that out in the PR body.

### 3.3 Admin payment path — `apps/web/app/admin/payments/actions.ts`

**No code change required** (re-verified on all three lenses):

- `:235` / `:461` / `:705` route through `isVatInclusiveServiceKey` (`orders.ts:201-203`, a literal `startsWith('vendor_')`) → correct VAT-inclusive treatment, shortfall math, BIR split.
- `:404` — the only hard SKU literal (Deep Search `after()` deferral). **Do not** add the Advanced key; its hook is a fast DB stamp and belongs on the synchronous branch.
- `:601-603` money-direction guard: add-on orders carry `vendor_profile_id` and no `event_id` → the `!row.event_id` arm already blocks a wrong-direction payout.
- `:807-815` / `:1128-1134` pass `service_key` into `deactivateOrderSku`; the literal test lives in `sku-activation.ts:1512` (changed above).
- `/admin/pricing` needs no registration (`pricing-surface.tsx:158-165`, `actions.ts:373-393` generic, no `is_active` filter). **Flip `is_active` there to launch.**
- ⚠ The shortfall guard reconciles against `orders.requested_total_php`, a vendor-written column — which is precisely why §3.2's activation-time price floor exists. **[hardened: rls-trust]**

**One cosmetic edit elsewhere:** `apps/web/lib/daily-email-jobs.ts:284-289` — add `if (serviceKey === 'vendor_ai_addon_advanced') return 'Vendor AI Advanced';`. Not a pure lib (imports `createAdminClient`/`sendEmail`), so C6 doesn't bind. The renewal RPC (`20270712400100:29-59`) is service-key-agnostic and needs nothing.

### 3.4 Subscription page + card

**`page.tsx`** — `fetchVendorAiAddonState` now returns `level` (§3.6, flag-gated); after `:189` add `aiAddonAdvancedPricePhp` from the band resolver (never from `fetchVendorAiAddonPricePhp`, which filters `is_active=true` and would hand back the ₱1,500 Basic fallback for the inactive row); fold one extra `vendor_billing_catalog` read (`sku_code='vendor_ai_addon_advanced'`, `is_active`) into the existing `Promise.all` at `:181-184`; `const aiLadderLive = isVendorAiLadderEnabled() && aiAddonAdvancedPricePhp != null && advancedSkuIsActive;` — **three conditions, all true**, so the card can never offer what the action (and now the activation hook) will reject. Pass `ladderLive`, `advancedPricePhp`, `currentLevel` at `:492-500`.

**`ai-addon-card.tsx`** — props default-safe (`ladderLive = false`); level chip beside the Active chip at `:100-108`; a `level` radio inside the existing `<form>` above the `channel` fieldset **only when `ladderLive`** (reuse the `channel` radio idiom; `basic` `defaultChecked`); CTA price follows the selected radio; header note per `:19-22`. When `!ladderLive` **no `level` input is emitted** → server parser defaults `'basic'` → byte-identical POST.

**Deliberately NOT a second card** — two cards imply two windows; C1 forbids it.

### 3.5 Config card gate — `/vendor-dashboard/shop`

- `lib/vendor-autoreply/config.ts` — `parseAutoReplyConfigForm(form, opts?: { dailyReplyCapMax?: number })`; `:81-111` uses `opts?.dailyReplyCapMax ?? DAILY_REPLY_CAP_MAX`. Stays pure; `DAILY_REPLY_CAP_MAX = 200` at `:25` unchanged, so an omitted `opts` is byte-identical.
- `shop/autoreply-actions.ts:52-71` and `shop/page.tsx:877-924` — soft-probe with `aiLevelSelect('ai_addon_expires_at')`, derive the level, pass `{ dailyReplyCapMax: vendorAiReplyCapCeilingNow(level) }` (coerce `Infinity → DAILY_REPLY_CAP_MAX` for the form message). **UX clamp only** — the security boundary is §3.7. The section's existing lack of an entitlement check (`page.tsx:866`) is unchanged by this PR (§7.7).
- `shop/_components/autoreply-card.tsx:12-13` — take `dailyCapMax` as a prop; when the ladder is live at `basic`, one muted line: *"Basic replies up to 30 a day. Advanced raises it to 200."*
- `vendor_bot_config.mode` / `voice_profile` / `reply_in_couple_language` are **not** added to any select, patch type, or form.

### 3.6 Shared state reader — `apps/web/lib/vendor-addon-pricing.ts`

`VendorAiAddonState` gains `level: VendorAiLevel`; `:143` uses `aiLevelSelect('ai_addon_trial_used_at, ai_addon_expires_at')`; `:149-152` `level: coerceVendorAiLevel(row?.ai_addon_level)`; the `catch` returns `{ trialUsedAt: null, expiresAt: null, level: 'basic' }`. ⚠ Note for the implementer: that `catch` **cannot** fire on a missing column — `supabase-js` returns `{ data: null, error }` without throwing, so the row degrades to "no add-on". That is exactly why `aiLevelSelect` exists.

### 3.7 Engine — `apps/web/lib/vendor-autoreply/inbox-hook.ts`

- `:121-125` — `.select(aiLevelSelect('ai_addon_expires_at'))`. **Zero extra round-trips**, and it preserves the two-`vendor_profiles`-reads shape `inbox-hook.test.ts:159-164` assumes (the stub returns one canned single per table; a *third* read would break it, a wider select will not). Flag-gating matters most here: the read is soft (`const { data } = …`), so a `42703` yields `addonActive = false` → `evaluateAutoReplyGate`'s `no_addon` branch → **every entitled vendor's assistant goes silent, with no log**.
- after `:128` — `const aiLevel = resolveVendorAiLevelNow(addonActive, (addonRow as {...})?.ai_addon_level);`
- `:143` — `dailyReplyCap: Math.min(Number(config.daily_reply_cap ?? 0), vendorAiReplyCapCeilingNow(aiLevel))`. Ladder OFF → `Infinity` → identity.
- **`inbox-decision.ts` is NOT modified.** The level is a clamp input, not a run/no-run factor.

### 3.8 Plumbing

`.env.example` gains `NEXT_PUBLIC_VENDOR_AI_LADDER=` (default OFF). **`changelog.d/vendor-ai-ladder.md` at the REPO ROOT** (C7 — the CI "lint changelog fragment dir" guard checks this), dated `## 2026-07-25 · feat(vendor-ai): Basic/Advanced ladder (flag-dark)` with `SPEC IMPACT:` → `Vendor_Monetization_Model_LOCKED_2026-07-25.md` + `Vendor_Front_Desk_Chatbot_Build_Plan_2026-07-18.md §8`. Do not touch `STATUS.md` / `CHANGELOG.md`.

---

## 4 · What ships DARK vs LIVE

### Ships LIVE

**PR-A (unconditional):** the column + backfill + CHECK + comment; the inactive catalog row; the entitlement-guard hardening; the `orders.service_key` immutability trigger; the Basic title rename. Behaviour-neutral: nothing reads the column yet, and both triggers only block writes nothing legitimate makes (every `vendor_profiles` entitlement writer is service-role — `ai-addon-actions.ts:177`, `booth-addon-actions.ts:244/254`, `sku-activation.ts:346/434`; no `apps/web` code updates `orders.service_key`, verified by grep).

**PR-B (unconditional):** the `daily-email-jobs.ts` title branch (unreachable until an Advanced order exists); the pure lib + its tests; the `vendor-addon-deactivation.ts` period-aware reversal (a *correction* — it stops confiscating already-paid days).

### Ships DARK (five locks, each independently sufficient)

| Lock | Where | Flips how |
|---|---|---|
| 1. `NEXT_PUBLIC_VENDOR_AI_LADDER` unset | card gate · buy-action reject · **activation reject** · cap clamp · every column reference | Vercel env |
| 2. `vendor_billing_catalog.vendor_ai_addon_advanced.is_active = FALSE` | seeded by PR-A; enforced in the buy action **and re-asserted in the activation hook** **[hardened: rls-trust]** | `/admin/pricing`, no deploy |
| 3. Activation price floor ≥ ₱2,500 | `sku-activation.ts` §3.2 | code |
| 4. `NEXT_PUBLIC_VENDOR_AUTOREPLY_V1` off | pre-existing master switch (`vendor-autoreply-flag.ts:14-17`) | Vercel env |
| 5. DPO control `vendor_ai_autoreply` | `inbox-hook.ts:93`, fail-closed | `/admin/data-privacy` |

### This PR sells nothing new

Every Advanced-only capability in the owner-locked line (`Vendor_Front_Desk_Chatbot_Build_Plan_2026-07-18.md:235 §8`) is unbuilt: `vendor_bot_config.mode` (zero readers/writers; `config.test.ts:87-92` proves `mode:'smart'` is discarded), `voice_profile`, `reply_in_couple_language`, `learn_from_past_messages` (zero references), `vendor_reply_templates` (zero references in `apps/web`; admin-only write policy `20270822679405:66-69`), lead analytics (`vendor_bot_replies` has only two `head:true` cap counters). The only Advanced capability with a live consumer is the daily reply cap — and that is a *clamp on Basic*, not a new Advanced feature. Launching Advanced is a deliberate **two-hand** operation (env flag + admin `is_active`) taken after at least one Advanced capability ships.

---

## 5 · Existing-holder migration

### 5a · At migration time (PR-A, no flags flipped)

| Thing | What happens |
|---|---|
| `ai_addon_level` | `'basic'` on every row (nullable-add → `UPDATE … WHERE IS NULL` → `SET DEFAULT` → `SET NOT NULL`). |
| `ai_addon_expires_at` / `ai_addon_trial_used_at` | **Untouched.** No holder gains or loses a day; an unused free cycle stays available (Basic only). |
| Engine / cards / pricing / orders | Unchanged — PR-A ships no `apps/web` code. |
| Self-write attempts | A vendor PATCHing `ai_addon_level` — or, newly, the four addon window/trial columns, or `orders.service_key` — gets `insufficient_privilege`. |

### 5b · The skew case the two-PR split eliminates **[hardened: rollback]**

If code that names `ai_addon_level` reached prod before the migration applied, PostgREST would `42703` the **whole** read/write, not one field. Concretely: the free-cycle claim fails (`"Could not activate Vendor AI right now."`), the paid path is never reached (`"Your free cycle was just used."`), the subscription card tells an active holder they have no add-on, and the assistant goes silent for everyone. §0a (migrate first, verify) plus §3.0 (flag-gated column names) closes this from both ends.

> **Rebuttal — one reviewer claim is half wrong.** The rollback lens also asserted that in this skew `sku-activation.ts` would "silently drop the stacked remainder" and "burn a still-unused free cycle". It would not: `currentExpiry`/`trialUsedAt` are only *computed* there; the single `.update()` carrying the unknown column is rejected wholesale and `:346-347` **throws before any write** (`if (error) throw new Error('vendor_ai_addon activation write failed…')`). Nothing is dropped or burned — the order simply stays `paid` with the entitlement ungranted, which is the (still serious) half that stands.

### 5c · At flag-flip (`NEXT_PUBLIC_VENDOR_AI_LADDER=1`)

Every existing holder resolves to `'basic'` — same engine, same builders, same intents. Exactly one observable change:

| Stored `daily_reply_cap` | Before | After flip |
|---|---|---|
| 30 (schema default — the overwhelming majority) | 30 | 30 |
| 0 ("paused") | never replies | never replies |
| 1–30 | as set | as set |
| 31–200 (settable via the UI, ceiling `config.ts:25`) | as set | **clamped to 30** |
| >200 (only via direct PostgREST — the CHECK has no ceiling) | as set | **clamped to 30** |

The column is **not rewritten**; the clamp is applied at read time (`inbox-hook.ts:143`), so an upgrade restores the vendor's number instantly and a lapse re-clamps on the next message. No cron, no cleanup, downgrade-safe by construction.

Card-side at flip: holders see the `Advanced` radio and level chip **only if** `is_active` is also on. Until then the card is byte-identical.

---

## 6 · Test plan

New **`apps/web/lib/vendor-ai-level.test.ts`**, styled on `booth-branding-gate.test.ts` (`node:test` + `node:assert/strict`), run by `pnpm --filter web test:unit` → `tsx --test "lib/**/*.test.ts"`.

**Required cases** (all present or the PR is not done):

1. **`coerceVendorAiLevel` fails closed** — `'advanced' → 'advanced'`; a loop over `[null, undefined, '', 'basic', 'Advanced', 'ADVANCED', 'smart', 'pro', 0, 1, true, {}, []]` → everything but the literal `'advanced'` → `'basic'`.
2. **FLAG-OFF byte-identity (headline)** — every stored value × `addonActive ∈ {true,false}` with `ladderEnabled:false` → `addonActive ? 'basic' : null`.
3. **FLAG-OFF cap ceiling is the identity** — every level ∈ `[...VENDOR_AI_LEVELS, null]` × cap ∈ `[0,1,29,30,31,200,3000]`: `Math.min(cap, vendorAiReplyCapCeiling(level,false)) === cap`.
4. **FLAG-ON ladder** — `'advanced'` → `'advanced'`; `'basic'`/garbage → `'basic'`; `addonActive:false` → `null` **even with `storedLevel:'advanced'`** (pins "the window is the entitlement").
5. **FLAG-ON cap ceiling** — `advanced → 200`, `basic → 30`, `null → 30`; `Math.min(200, ceiling('basic',true)) === 30`.
6. **`resolveActivatedAiLevel` never downgrades a live window** — table-driven: purchased `advanced` → always `'advanced'` (4 current-state combos); purchased `basic` + live `'advanced'` → `'advanced'`; + expired `'advanced'` → `'basic'`; + `null` expiry → `'basic'`; + garbage `currentLevel` + live → `'basic'`; unparseable `currentExpiresAt` → treated dead → `'basic'`.
7. **`isSilentAdvancedUpgrade`** *(new)* — true only for `purchased:'basic'` + live window + stored `'advanced'`; false for a dead window, for garbage stored levels, and for `purchased:'advanced'`. **[hardened: money]**
8. **`resolveAddonDeactivationExpiry` reverses ONE period** *(new, in `vendor-addon-deactivation.test.ts`)* — stamped == current with `periodDays: 28` → `stamped − 28d` when that is still in the future (a prior paid cycle survives); → `now` when `stamped − 28d` is in the past; unchanged when a later cycle owns the window; unchanged for a null stamp; `periodDays` omitted → today's `now` behaviour. **[hardened: money]**
9. **Constant guards** — `VENDOR_AI_ADVANCED_SKU_CODE.startsWith('vendor_')` (pins C3 — this assertion is what stops a future rename stranding orders in the payments shortfall guard); `VENDOR_AI_ADVANCED_FALLBACK_PHP !== VENDOR_AI_ADDON_FALLBACK_PHP` **and** `> VENDOR_AI_ADDON_FALLBACK_PHP` (pins "Advanced never falls back to the Basic price"); `VENDOR_AI_BASIC_REPLY_CAP_CEILING === 30`; `VENDOR_AI_ADVANCED_REPLY_CAP_CEILING === DAILY_REPLY_CAP_MAX`.

**Existing tests — deliberate no-changes, must pass unedited:** `vendor-addon-tier-pricing.test.ts:43-49` (already pins `ai_chatbot_advanced { entry 3000, growth 2500 }` — cite, don't touch); `vendor-addon-first5-free.test.ts:46-47` (neither AI variant is in `ADDONS_FREE_DURING_FIRST5`); `inbox-decision.test.ts` (if it needs an edit, the gate shape changed → out of scope); `inbox-hook.test.ts:159-164` (widening a select is safe — the stub returns one canned object per table regardless of select-list; a third `vendor_profiles` read is not); `config.test.ts:87-92` (proves `mode`/`voice_profile` still dropped). Add the Advanced key to `booking-fee-lock.test.ts:29` / `vendor-booking-fees.test.ts:38/:81` negative-classification lists if they enumerate keys.

**Manual, before arming auto-merge on PR-B:** with the flag off, run one `pnpm --filter web build` and diff the generated SQL-bearing paths by inspection at the six §3.0 sites — none may contain the string `ai_addon_level`.

---

## 7 · Explicit NON-goals for this PR

1. **No Advanced capability is implemented.** No `mode='smart'` reader/writer, no `voice_profile`, no `vendor_reply_templates` generator or lookup, no `reply_in_couple_language`, no lead analytics, no `learn_from_past_messages`. No fake doors.
2. **No RLS/policy change on `vendor_bot_config`.** `mode` stays vendor-writable and unread — harmless precisely because nothing reads it.
3. **No second expiry column.** `sku-activation.ts:1326`'s union stays two-valued.
4. **No change to `evaluateAutoReplyGate`'s signature, success shape, rule order, or `AutoReplySkipReason` union.**
5. **No change to the Solo+/verified gate** (`ai-addon-actions.ts:121-126`, `sku-activation.ts:327`). ⚠ The band matrix prices an `entry` tier that includes **Free**, but Free vendors still cannot buy — no `allTiersAllowed` treatment. Owner question, not this PR.
6. **No Basic reprice**, no catalog price edits, no per-SKU admin code, no admin UI for viewing or setting a vendor's level.
7. **No entitlement gate on the `/vendor-dashboard/shop` Auto-Reply config card** (`shop/page.tsx:866`). The pre-ladder gap (no-add-on vendors can open and toggle the card) is left as-is.
8. **No proration.** A mid-window Basic→Advanced upgrade converts the *whole* remaining window to Advanced (see §8.6 — owner call).
9. **No `orders` schema/CHECK/FK work** beyond the `service_key` immutability trigger. A `service_key` FK to `vendor_billing_catalog` is a separate, wider change.
10. **No `.docx` regeneration / five-file corpus churn.** One `DECISION_LOG.md` row + the root changelog fragment.
11. **No auto-merge before self-review.** Commit locally, re-read the diff, then push and arm auto-merge (`gh pr merge <PR#> --auto --merge`); after each merge, re-verify the touched files on `origin/main` (stale-tree merges have silently clobbered shipped work on this repo).

---

## 8 · Owner sign-offs this PR needs (plain English)

1. **Basic gets a 30-a-day reply ceiling.** Today anyone with the add-on can set 200. Turning the ladder on cuts those vendors back to 30 unless we grandfather them. (Grandfathering = seeding `advanced` for `daily_reply_cap > 30` holders — deliberately *not* in this spec; it hands out a paid level for free.) OK?
2. **Advanced is never free, and it does not use up the free month.** ~~Buying Advanced burns the free cycle~~ — that claim was **false** in the first draft (the trial is only stamped at admin approval, so an Advanced buyer could still grab the free Basic cycle in the meantime). Corrected: Advanced is always charged, and the new one-order-in-flight rule stops a vendor holding a pending Advanced order while claiming the free Basic cycle. A vendor who never used their free cycle keeps it for a future Basic month. OK? **[hardened: money]**
3. **You can't buy Basic while Advanced is running** — the action rejects it rather than granting 28 more Advanced days at the Basic price, and the activation hook re-checks at approval time (orders can be submitted days apart and approved out of order). If the ladder flag is switched back off, this rejection switches off with it, so Advanced holders can always renew. OK?
4. **Advanced's catalog list price is ₱3,000** (Free/Solo band); Pro/Enterprise are charged ₱2,500 by the band resolver. The catalog number is the fallback and what admins see at `/admin/pricing`.
5. **Advanced does not go on sale in this PR** — catalog row off, flag off, and the approval path now refuses it too. Launching is a deliberate two-step after at least one Advanced capability exists.
6. **NEW — upgrading mid-month is generous on purpose.** A vendor 1 day into a paid Basic month who buys Advanced gets Advanced for the *whole* remaining window (up to ~27 bonus days, worth ≈ ₱1,000) instead of a prorated top-up. Simple and upgrade-friendly, but it is money we don't collect. Alternative: charge the difference for the remaining days (needs a proration rule + a new order shape). Which? **[hardened: money]**
7. **NEW — a refund now returns 28 days, not the whole window.** Today, refunding an add-on order wipes the vendor's *entire* remaining window even if an earlier month is still paid for. We're changing it to reverse only that order's 28 days. This also changes 3D Booth refunds the same way. OK? **[hardened: money]**

---

## Residual risks / owner calls

1. **Whole-window upgrade leak (bounded ≈ ₱1,000/vendor/upgrade)** — accepted by design pending §8.6. Not a hole, a pricing policy.
2. **Advanced's stale-marker risk activates the day the first Advanced capability ships.** Today a stray `'advanced'` grants nothing (nothing reads it). Once a reader exists, §3.2's hoisted level reset is the only thing between a refund and a live capability leak — do not "simplify" it away.
3. **`vendor_reply_templates` has no downgrade purge.** Whoever builds the generator must add one in the same PR, or the first Advanced→Basic lapse leaves Pro phrasings queryable under `vendor_reply_templates_read` (`20270822679405:62-65`).
4. **`orders.requested_total_php` is vendor-written and the payments shortfall guard trusts it.** The §3.2 activation price floor covers the Advanced SKU only. A general "order total must match the catalog/band" assert across all SKUs is a separate, larger job — worth spawning.
5. **`orders.service_key` has no FK to `vendor_billing_catalog`.** The new trigger blocks *mutation*; a forged INSERT with an unknown key is still possible (it simply activates nothing). A FK + `CHECK` is a follow-up.
6. **Free-tier vendors are priced by the band (`entry` includes Free) but cannot buy** (§7.5). Owner call: either give AI the `allTiersAllowed` treatment (`vendor-photo-challenge.ts:87/:108`, `seating-3d.ts:1244`) or drop Free from the entry band copy.
7. **The `/vendor-dashboard/shop` Auto-Reply card still has no entitlement check** (§7.7). Pre-existing; the engine is the real gate; worth its own small PR.
8. **Migration application remains the single biggest operational risk on this repo.** PR-A is only safe if the three verification selects are actually run against prod before PR-B merges — do not skip that step because the workflow said green.
