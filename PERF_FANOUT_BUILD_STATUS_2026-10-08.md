# Perf fan-out fix (builder P1) — status, 2026-10-08

Production incident: one person in the Event Hub Maker took Supabase from ~200 to 3,000–11,000
requests per 5 minutes; PostgREST ran out of pooled connections (PGRST003, 504s) while Postgres
itself was idle. Branch `rd/one-question-per-render`, worktree `~/Documents/Claude/Projects/wt-perf`.

## Measured (local `next dev` against a counting stand-in for Supabase — never production)
One event, internal host, nothing bought, no guests (so data-dependent reads are a LOWER bound).

| One server render | Before | After (a)+(b) |
|---|---|---|
| Maker `/dashboard/<id>/launch` — all requests | 180 | 148 |
| …of which entitlement shapes (orders · basket · comp · internal · bundles) | 37 | 4 |
| Guest canvas `/<slug>?phase=rsvp&editor=1&tabs=1` — all requests | 63 | 35 |
| …of which entitlement shapes | 32 | 4 |
| Plain guest page `/<slug>` | 65 | 34 |

## Done
1. MEASURE — harness (stub PostgREST + auth, request log, per-render summary) in
   `~/Documents/Claude/Projects/wt-perf-scratch/harness/`. Before/after logs beside it.
2. (a)+(b) — `lib/request-once.ts` (one question once per render, keyed authority + question +
   event/SKU) and `lib/entitlements.ts` (in a render: ONE orders read per event, ONE comp batch,
   ONE internal, ONE founder, ONE bundle read — whatever the number of products). Outside a render
   (actions, route handlers, jobs) the per-product queries are unchanged.
3. Honest failure — the new-Maker gate (`users.is_internal` via `viewAsFreeSwitch`) read "no" on a
   failed read and drew the OLD Maker. Now: flag off + read failed → neither Maker; the house
   "Reconnecting…" error (`schemaBlipError('LaunchPage.makerChoice')`). Verified in the harness
   with the `users` read returning 504 PGRST003.

## In progress / left
- (c) the Maker's speculative warm canvases (up to 3 extra full guest renders per open, re-warmed
  after every save).
- Guards (count, no-sharing across events/users, failed gate), changelog, tsc, lint, PR.

## Found, not fixed here (next targets, with numbers)
- One Maker render reads the same `events` row with 32 different column lists; `users` 7;
  `event_members` 12. The Maker page server-renders five other pages inside itself.
