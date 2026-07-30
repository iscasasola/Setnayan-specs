/**
 * SEC-4b · VENDOR-SURFACE SERVICE KEYS ARE NOT SELLABLE FROM COUPLE CHECKOUT.
 *
 * # The hole this closes
 *
 * Four SKU families encode their TARGET OBJECT in the service_key itself:
 *
 *     vendor_booking_fee__<charge_id>        → settles a booking-fee charge
 *     vendor_additional_branch__<branch_id>  → flips a branch subscription live
 *     vendor_extra_seat__<vendor_profile_id> → recomputes paid team seats
 *     vendor_custom_plan__<vendor_profile_id>→ promotes a negotiated Custom plan
 *
 * `activateOrderSku`'s PREFIX_HOOKS provision straight off that string on admin
 * approval. Meanwhile `submitOrderAction` (the COUPLE checkout drawer) accepts
 * any service_key, and — because none of these four has a row in
 * platform_retail_catalog_v2 or platform_package_catalog — `resolveServiceSellability`
 * returns 'unknown' and ALLOWS, and the charge falls back to the browser's
 * `original_centavos`.
 *
 * Composed, that is a cross-TENANT hole, not merely a cross-price one: any
 * authenticated user could check out `vendor_additional_branch__<a stranger's
 * branch_id>` for ₱1 against their OWN event (so the membership check passes),
 * pay ₱1 for real, and on approval activate a branch subscription — or settle a
 * booking fee, or promote a Custom plan — belonging to a vendor they have
 * nothing to do with.
 *
 * # Two independent gates, both fail-closed
 *
 *  1. `assertVendorSurfaceKeyNotSoldToCouple` — the front door. Couple checkout
 *     refuses these prefixes outright. Nothing legitimate is lost: each family
 *     is minted by its OWN vendor-dashboard action (branches / team / custom /
 *     the booking-fee lock), never by the couple drawer.
 *  2. `assertOrderOwnsVendorTarget` (lib/sku-activation.ts) — the back door.
 *     At activation, the ORDER's `vendor_profile_id` must own the object being
 *     provisioned. Couple checkout pins `vendor_profile_id` to NULL, so even a
 *     row minted some other way cannot provision a vendor's object.
 *
 * Gate 2 is the load-bearing one — it holds for any origin, including a comp
 * grant or a hand-inserted row. Gate 1 exists so the failure is a clean
 * "can't buy that here" at checkout rather than money taken and provisioning
 * refused later.
 *
 * Pure and dependency-light on purpose so it is unit-testable and safe to import
 * from both a server action and the activation library.
 */

import { BOOKING_FEE_LOCK_SERVICE_PREFIX } from './booking-fee-lock';
import { BRANCH_SERVICE_KEY_PREFIX } from './vendor-branches';
import { SEAT_SERVICE_KEY_PREFIX } from './vendor-seats';
import { CUSTOM_PLAN_SERVICE_KEY_PREFIX } from './vendor-custom-catalog';

/**
 * Every service-key prefix whose suffix names an object owned by a vendor.
 *
 * Imported from each feature module rather than re-typed, so renaming a prefix
 * cannot silently drop it out of this guard. `lib/vendor-surface-service-keys.test.ts`
 * additionally pins this list against the PREFIX_HOOKS in lib/sku-activation.ts.
 */
export const VENDOR_SURFACE_SERVICE_KEY_PREFIXES: readonly string[] = Object.freeze([
  BOOKING_FEE_LOCK_SERVICE_PREFIX,
  BRANCH_SERVICE_KEY_PREFIX,
  SEAT_SERVICE_KEY_PREFIX,
  CUSTOM_PLAN_SERVICE_KEY_PREFIX,
]);

/** Does this key target a vendor-owned object (and therefore need an owner)? */
export function isVendorSurfaceServiceKey(serviceKey: string): boolean {
  return VENDOR_SURFACE_SERVICE_KEY_PREFIXES.some((p) => serviceKey.startsWith(p));
}

/**
 * Gate 1. Throw when a couple-side checkout is handed a vendor-surface key.
 *
 * The message is deliberately generic — it must not confirm whether the
 * referenced charge / branch / profile exists.
 */
export class VendorSurfaceKeyRefused extends Error {
  constructor() {
    super('That service is not available from this checkout.');
    this.name = 'VendorSurfaceKeyRefused';
  }
}

export function assertVendorSurfaceKeyNotSoldToCouple(serviceKey: string): void {
  if (isVendorSurfaceServiceKey(serviceKey)) {
    throw new VendorSurfaceKeyRefused();
  }
}
