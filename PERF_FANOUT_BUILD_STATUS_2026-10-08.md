# Perf fan-out fix (builder P1) — status, 2026-10-08

Production incident: one person in the Event Hub Maker took Supabase from ~200 to 3,000–11,000
requests per 5 minutes; PostgREST ran out of pooled connections (PGRST003, 504s) while Postgres
itself was idle. Branch `rd/one-question-per-render`, worktree `~/Documents/Claude/Projects/wt-perf`.
No migration. Nothing was run against production.

## Measured (local `next dev` against a counting stand-in for Supabase — never production)
One wedding, internal host, nothing bought, no guests (data-dependent reads are a LOWER bound).

| One server render | Before | After |
|---|---|---|
| Maker `/dashboard/<id>/launch` — all requests | 180 | 148 |
| …entitlement shapes (orders · basket · comp · internal · bundles) | 36 | 4 |
| Guest canvas `/<slug>?phase=rsvp&editor=1&tabs=1` — all requests | 63 | 35 |
| …entitlement shapes | 32 | 4 |
| Plain guest page `/<slug>` | 65 | 34 |
| Guest pages fetched per Maker open (and again per canvas-reloading save) | 2–4 | 1 |
| One Maker open — all requests | 306–432 | 183 |
| One Maker open — entitlement requests | 100–164 | 8 |

Order of magnitude reached for the entitlement shapes; NOT for all requests (1.7–2.4×).

## Done
1. MEASURE — harness (stub PostgREST + auth, request log, per-render summary) in
   `~/Documents/Claude/Projects/wt-perf-scratch/harness/`; before/after logs beside it.
2. (a)+(b) `lib/request-once.ts` + `lib/entitlements.ts`: in a render ONE orders read per event,
   ONE comp batch (`event_comp_active_skus`, already existed), ONE internal, ONE founder, ONE bundle
   map — whatever the number of products. Outside a render the per-product queries are unchanged.
3. Honest failure: flag off + the `users.is_internal` read failed → neither Maker is drawn; the house
   "Reconnecting…" error (`LaunchPage.makerChoice`). Verified in the harness with `users` → 504.
4. (c) The Maker fetches only the stage on screen. An opened stage stays loaded (instant switch back);
   an unopened one is no longer fetched ahead or re-fetched after every save.
   ⚠ OWNER CALL: narrows his 2026-09-28 "load everything so it runs smoothly" — first visit to another
   stage now loads (~0.6 s healthy). Recommendation: ship; bring back warm-once-per-open later.
5. Guards: `lib/entitlements-ask-once.test.ts` (15 tests), `lib/the-maker-choice-is-never-a-failed-read.test.ts`
   (5), `lib/switching-stage-or-page-never-navigates.test.ts` (rewritten section 2). 14 sabotages, all red.
6. Changelog fragment `changelog.d/rd-one-question-per-render.md`.

## (d) Static config — measured, NOT changed
Already one read per render each (bundle_components 1 · event_type_profiles 1 · promo_free_windows 1 ·
platform_settings 3 distinct selects on the Maker). Cross-request caching needs each one's admin writer
to invalidate; saves 3–4 of 35 per guest render.

## Left / next targets
- One Maker render = 148 requests: the same `events` row through 32 column lists, `event_members` 12,
  `users` 7 — the Maker page server-renders five other pages inside itself. Restructuring, not a memo.
- Migration-backed `event_entitlement_facts(p_event_id)` → 4 entitlement requests per render become 1.
- `lib/guest-stages-on.ts`: a failed `event_host_is_internal` reads as "the shipped guest page" (its
  docblock says deliberate; internal-hosted test events only).
- Background load with nobody present: `claim_periodic_job` from `after()` on page traffic, throttled
  5 min per job key PER SERVER INSTANCE; the dashboard writes `setnayan_ai_guard_log` on every open.

## Checks / PR
See the PR (number added when opened).
