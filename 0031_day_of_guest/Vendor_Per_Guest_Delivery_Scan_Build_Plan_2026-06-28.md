# Vendor Per-Guest Delivery Scanning (pax-based services) — Build Plan

> Created 2026-06-28. Cold-start brief. Owner asked: vendors with pax-based
> services should scan a guest's QR to confirm per-guest delivery (souvenir,
> meal, etc.). Companion to the souvenir-station PR (#2361) — this generalizes
> it to the VENDOR side. **Code is canonical** — verify every name below against
> `apps/web` @ origin/main before building.

## Owner-locked decisions (2026-06-28)

1. **Who scans:** vendors — specifically vendors whose **service is toggled
   "per-guest delivery tracking."**
2. **Toggle:** an **explicit per-service toggle** (vendor opts a service in;
   NOT auto-derived from the pricing model).
3. **What the vendor sees:** **operational only** — "delivered ✓" + a running
   count (e.g. 142/200). **NO guest name or details.** (RA 10173-safe; matches
   the souvenir-table model.)

## The model it plugs into (confirmed in code)

- A booking = a row in **`event_vendors`** (`vendor_id`, `marketplace_vendor_id`,
  `service_id`, `event_id`).
- Vendor-scoped RLS precedent = **`current_vendor_event_vendor_ids()`**
  (`supabase/migrations/20270315091571_vendor_read_payment_ledger_rls.sql`) —
  SECURITY DEFINER, returns the `event_vendors.vendor_id` rows the caller's
  vendor org owns (via `current_vendor_profile_ids()`) or is an agent for. Reuse
  this pattern; you'll want a sibling that also yields `event_id` +
  `event_vendor_id`.
- Pax pricing lives as `vendor_services.added_pax_price_php` (marketplace) and
  `is_pax_priced` in `lib/v2-catalog.ts` (platform SKUs) — informational only;
  per decision #2 the delivery toggle is its OWN flag, independent of pricing.
- Souvenir precedent (couple/coordinator side): `guest_souvenir_claims` +
  `/dashboard/[eventId]/guests/souvenirs` (#2361). Mirror its shape.

## Build

### 1. Migration (schema lands first; apply to prod + ledger per the workflow)
- **Toggle column:** `per_guest_delivery boolean NOT NULL DEFAULT false` on the
  vendor service definition (or `event_vendors` for per-booking control — decide;
  per-service is the literal ask). Vendor flips it in their dashboard.
- **Deliveries table** `event_service_deliveries`:
  `delivery_id, event_id, event_vendor_id, guest_id,
   UNIQUE (event_vendor_id, guest_id), delivered_at, delivered_by_user_id,
   method CHECK ('qr_scan','manual_search'),
   FK (event_id,guest_id)->guests`.
  RLS: **vendor** manages rows whose `event_vendor_id` resolves to their bookings
  (sibling of `current_vendor_event_vendor_ids` returning `event_vendor_id`);
  **couple+coordinator** read for their event; admin all. RLS at CREATE time.
- **No-PII QR resolver** `resolve_guest_for_delivery(p_event_vendor_id uuid,
   p_qr_token text) RETURNS uuid` — SECURITY DEFINER, STABLE, pinned search_path.
  Asserts (a) caller owns the `event_vendor_id` booking, (b) `p_qr_token` belongs
  to a guest on that booking's `event_id`, then returns **only `guest_id`** (never
  name/meal/etc.). This is what keeps the vendor "operational only" — the vendor
  never SELECTs `guests`.

### 2. Vendor scan station (vendor-dashboard)
- New surface under `/vendor-dashboard/...` (e.g. `.../deliveries/[eventVendorId]`),
  visible only when the booking's service has `per_guest_delivery = true`.
- Reuse the jsQR scanner from the souvenir desk
  (`app/dashboard/[eventId]/guests/souvenirs/_components/souvenir-desk.tsx`),
  but on scan call `resolve_guest_for_delivery` then insert into
  `event_service_deliveries`. Show **only** "Delivered ✓" + live `count / pax`.
  No name, no search-by-name list (search would imply roster access — keep it
  scan-only, or a count-only manual "+1 delivered" if scanning fails).
- Actions mirror `markSouvenirReceived` / `undoSouvenirReceived`.

### 3. Couple-side progress view
- On the couple's vendor/booking surface (e.g. the booking card or the souvenir
  area), show "<vendor> delivered N / <pax>" so the couple can see progress.

## Constraints
- Operational-only is a HARD privacy boundary — the vendor path must never read
  `guests` PII. Enforce via the DEFINER resolver, not client trust.
- RLS at `CREATE TABLE` time; reuse the canonical resolver pattern, invent none.
- Prices admin-catalog-driven; V1 scope locked (flag expansion). Lint guards
  (nav-icon, bottom-nav, radius). tsc + lint + prod `next build` to ship.
- Migration prefix: use `pnpm migration:new` (the pre-push hook rejects
  hand-typed round `YYYYMMDD000000` prefixes — see PR #2361 lineage).

## Done
Migration applied to prod (table + RLS + resolver + toggle; ledger synced) ·
vendor station + couple view shipped · tsc/lint/build green · changelog fragment
· DECISION_LOG row · PR + auto-merge.
