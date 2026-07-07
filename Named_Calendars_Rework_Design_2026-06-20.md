# Named Calendars Rework — Design & Migration Plan (2026-06-20)

> Owner-chosen 2026-06-20: shift vendor scheduling from auto **per-category** pools to **vendor-named calendars** where the vendor creates + names a calendar, picks **which services** it covers, and sets its limit. The service card becomes simple (no availability). Source: code-grounded design workflow (5 readers over schema / acquire RPCs / resolution lib / Calendar surface / bundles+slots → synthesis).

## The key safety property

The rework is **entirely upstream of the `acquire_schedule_pools` boundary.** A "calendar" *is* a `vendor_schedule_pools` row (unchanged). What changes:
- **How a pool is created** — the vendor names it (today: auto-spawned per category, labeled by category).
- **How membership resolves** — service→calendar (new join table) instead of category→pool (`vendor_schedule_pool_categories`).

Because **`pool_id`s never move** in the migration:
- **No booking row is touched** (`vendor_schedule_pool_bookings` keys on `pool_id`).
- **Double-booking stays impossible** — the `FOR UPDATE` lock + count-then-insert + live partial-unique index in `acquire_schedule_pools` are unchanged.
- **Rollback is just flipping the flag** until the final retirement phase.

## What stays exactly the same
- `vendor_schedule_pools` (the schedulable resource), `daily_booking_capacity` (1–50 grain), RLS.
- `vendor_schedule_pool_bookings` — byte-identical (live partial-unique index, status-flip release).
- The three double-booking mechanisms + `acquire_schedule_pools` / `release_schedule_pools` (ZERO changes).
- `vendor_calendar_blocks` (manual closures + external clients), `hard_single` double-lock guard, and the Enterprise per-service time-slots path (already service-keyed — the precedent).

## Schema changes (Phase A — purely additive, reversible)
1. **`vendor_schedule_pools`** + `calendar_name TEXT` (vendor-entered, ≤80) + `is_vendor_created BOOLEAN DEFAULT FALSE`. Keep `pool_label` as legacy fallback. `ADD COLUMN IF NOT EXISTS`, idempotent.
2. **New `vendor_schedule_calendar_services`** join table (`pool_id`, `vendor_service_id`, `vendor_profile_id`, `created_at`) — the explicit service→calendar link (service membership has no home today). RLS enabled at create, mirroring `vendor_schedule_pool_categories` policies. **PK choice = owner fork** (see Decisions): `PK(vendor_service_id)` = one calendar per service (recommended); `PK(pool_id, vendor_service_id)` = many-to-many.
3. **Leave `vendor_schedule_pool_categories` + `daily_booking_capacity` untouched** in Phase A — the old path stays live behind the flag.

## Backfill (no booking loss)
1. `calendar_name` ← derived label (joined `Cat A · Cat B` for merged pools) where NULL. Idempotent.
2. For each service, resolve its **current** pool via the existing category map and write the `service→calendar` row (`ON CONFLICT DO NOTHING`) — so service→calendar returns the **identical** `pool_id` the category path returns today.
3. Bundle "comes with" legs (`vendor_service_links.linked_canonical_service` is a *category*) stay **category-resolved** even flag-on, so a bundle's lock footprint never silently narrows.
4. Fallback: a service with no calendar row resolves on demand to its category pool (and writes the row) — never left without a capacity anchor.
5. **Conservation assertion** before flipping: every live booking's `pool_id` must stay reachable from a calendar-service or category row for that vendor; orphans block the flag for that vendor.

## The single load-bearing code swap
`resolvePoolIdsForService` (`apps/web/lib/schedule-pools.ts`) gets a flag branch:
- **OFF** (today): category → `resolve_schedule_pool` per category → dedupe `pool_id[]`.
- **ON**: read `vendor_schedule_calendar_services` for the service; bundle legs still expand by category; dedupe; **return the same `UUID[]` shape**. Downstream `acquire` is byte-identical. Log a warning (never silently `[]`) if no calendar row is found.

## App changes
- **Calendar surface** — new `createCalendar(name, service_ids[], capacity)` + `editCalendar` + a **service-picker** (multi-select of the vendor's services) writing the join table. Replace "each category gets its own schedule automatically" copy with a **Create a calendar** CTA; tabs show `calendar_name`.
- **Merge UI** — the category-merge block is the old model; under named calendars, "merge" = attach multiple services to one calendar via the picker (owner fork: replace vs keep as legacy).
- **Service card** — no availability/capacity controls (already done in the service-wizard PR); links to "assign to a calendar".
- **Couple booking flow** — no callsite change; only `resolvePoolIdsForService` internals change behind the flag.

## Rollout — `NEXT_PUBLIC_NAMED_CALENDARS_ENABLED` (default OFF)
- **A.** Ship additive schema + backfill, flag OFF — prod identical, new table populated + asserted.
- **B.** Enable for the internal/test vendor + Maria & Jose sample only (per-vendor allowlist); exercise create/edit/book/cancel/bundle/external-client/downgrade; assert flag-on returns the **same `pool_id`s** as flag-off for each service.
- **C.** Flip globally once vendors' services have backfilled calendar rows.
- **D.** (separate later PR, after prod soak) retire category auto-create + merge UI; optionally collapse `vendor_schedule_pool_categories`.

## Risks (top)
- **HIGH — unresolvable booking after cutover** (`[]` → degrade-open → no capacity gate). Mitigated by backfill step 2 + the fallback (step 4, never silent `[]`) + the step 5 assertion.
- **HIGH — `vendor_packages` true-bundle SKU already bypasses ALL capacity gates today** (inserts contracted `event_vendors` with no `acquire`). Named calendars don't fix this — **flag as a pre-existing gap, track separately, do not silently change here.**
- **HIGH — many-to-many membership breaks acquire semantics** (all-or-nothing: one full calendar blocks a booking another calendar could take). → default to one-calendar-per-service.
- **MED** — bundle leg footprint narrows if the category map is retired before a service→service link exists (keep Option A through Phase D). Two non-unified capacity gates (per-service lock vs per-pool deposit) persist — unchanged, out of scope.
- **LOW** — new-calendar capacity DEFAULT 1 surprises (require explicit capacity input); 2-char tag collisions.

## Effort
~4 Claude-Code sessions for Phases A–C (UI is the bulk ~1.5), + ~1 for Phase D retirement after prod soak. No external/calendar-bound dependencies.

## Open decisions for the owner
1. **One calendar per service, or a service in multiple calendars?** Recommend ONE (clean resolution; avoids the all-or-nothing acquire trap).
2. **A service not assigned to any calendar** → default to its category pool (always bookable, recommended) vs must-assign-before-bookable (safer, more friction).
3. **The old "merge categories" feature** → replace with the service-picker (recommended) vs keep both.
4. Category auto-create retirement = Phase D (recommend keep as fallback, stop as primary). Capacity stays on the calendar (scope discipline). `vendor_packages` bypass = separate task. Multi-profile orgs = out of scope for V1.
