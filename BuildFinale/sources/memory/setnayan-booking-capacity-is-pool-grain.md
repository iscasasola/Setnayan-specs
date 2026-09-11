---
name: setnayan-booking-capacity-is-pool-grain
description: "What actually refuses a booking on a full day: acquire_schedule_pools (pool cap, closures, locked day-states) + the Enterprise slot RPC; the per-card daily_capacity gate is blind under the couple's RLS; vendors_blocked_on_date is broader than the booking verdict"
metadata:
  type: project
---

Measured 2026-09-11 from LIVE function bodies (`pg_get_functiondef`), `pg_policies`
and app call sites, while building H6 (hide full cards from bench search).

**Enforced (SECURITY DEFINER, so they see every booking):**
- `acquire_schedule_pools` — THE main capacity gate. Called at the couple's lock
  (`vendors/actions.ts` ~317/~4398), at deposit acknowledge
  (`acquireSchedulePoolsForBooking`), and by the locked-QR claim. Per pool on a
  day-precise date it refuses on: a `manual`/`synced_calendar` block (pool or
  shop-wide) · day state `locked` (`whitelist` = held for approval) · live
  `vendor_schedule_pool_bookings` + `external_client` blocks ≥
  `daily_booking_capacity`. Prod 2026-09-11: 3 active pools, 1 live pool booking.
- `acquire_service_time_slot` (Enterprise slots) — day-state gate + per-slot
  capacity, day-precision events only, `contracted·deposit_paid·delivered·complete`.

**NOT effectively enforced:**
- `vendors/actions.ts` #2 `vendor_services.daily_capacity` gate runs on
  `createClient()` (couple session). `event_vendors_couple_read` only shows the
  couple's own events, so the "other bookings that day" count is always 0. It
  never refuses. Also returns `soft_hold_limit_reached` though it counts confirmed.

**Traps:**
- ⚠ `vendor_agree_to_lock`'s comment says "daily_booking_capacity was never built".
  TRUE OF THAT FUNCTION ONLY. S2 repeated it as "pools are not enforced anywhere"
  and it reached DECISION_LOG before being corrected. A comment describing one
  function is not a claim about the system — find every caller.
- `vendors_blocked_on_date` (the bench search's busy check) flags ANY block,
  including one `external_client` job in a multi-place pool — broader than the
  booking verdict. Fine for a demote badge; wrong for HIDING.

**The mirror (H6, PR #5434, SERVED 2026-09-11 at fcc2bc3; service_role-only, called with
the admin client):** `service_cards_unbookable_on(uuid[], date[], bool)` restates both
gates read-only for the bench search. The N5 session owns LOCK-PATH CAPACITY: it makes the
per-card daily_capacity gate real, teaches the mirror, and removes the tripwire. Any change to
the booking path must keep it in step. `tests/db/a-full-card-leaves-bench-search.db.test.ts`
runs the REAL acquire functions per card × day × flag in rolled-back transactions
and compares them. `lib/h6-mirrors-the-booking-path.test.ts` fails on a new acquire
status or a lost predicate. A booking-path change that adds a refusal must also
reach the mirror. Pool resolution must stay read-only: `resolve_schedule_pool`
INSERTs a pool on first resolve.

Related: [[setnayan-guards-must-test-the-claim]] (same disease: a cheaper proxy
that agrees with you today), [[setnayan-decisions-view-merges-three-sources]].
