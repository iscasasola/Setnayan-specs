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
Draft PR **#6448** (`rd/one-question-per-render`), label `do-not-auto-merge`, auto-merge OFF.
Local: 1,595 unit tests that pin the touched files pass · new guards 15 + 5 + rewritten section pass ·
2 DB tests pinning the RPCs pass (13 + 9) · 40 of ci.yml's node guards pass (the 2 that need a
production build run in CI) · dup-rule lint clean · 14 sabotages each seen red.
Full tsc + next lint: queued on the heavy lock at the time of writing — CI runs both on the PR.

---

# Builder P2 — continuing the speed work, 2026-10-08 (after #6448 merged, main `482a671b3`)

Four draft PRs, all `do-not-auto-merge`, auto-merge off, no migration, nothing run against production.
Harness: `~/Documents/Claude/Projects/wt-perf2-scratch/harness/` (P1's counting stand-in, plus a
per-request delay `STUB_DELAY_MS`, a headless-browser drive `warm-drive.mjs`, `session.sh` which
holds the heavy lock with an EXIT trap).

## #6451 `rd/stage-warms-once` @ c5e352615 — the 1-second bar, and the double canvas fetch
- The other stages are warmed ONCE per Maker open (idle, after the stage on screen is up, tab
  visible, one at a time; 0 on save-data / a ≤ 4 GB phone). The first write of the open ends it.
- A save's redraw (a server render) goes to the page on screen only; a kept stage pays when shown
  (was 1 + n guest renders per redraw save).
- **The double fetch found:** the server's HTML carried `<iframe src>` inside a streamed Suspense
  segment; React moves the segment, and a moved iframe loads again. Frames are now client-mounted.
  Phone: 2 canvas documents per open → 1. Desktop (dev harness, real browser): 4 → 2 — the one left
  is `maker-shell.tsx` asking for the phone's address first (L2's lane).
- Cost to decide: a phone open = 1 + up to 3 warmed guest renders (once). Controller: keep the warm ON.
- Guard `lib/the-other-stages-are-warmed-once.test.ts` (16 tests, counts fetches per open and per
  save, counts iframes in server HTML = 0). 14 sabotages red. 856 pinned tests green.
- Not verified: a clean three-stage warm in a browser (dev server restarted under memory pressure;
  the warm fired once, a redraw cost exactly 1 render); production timings.

## #6452 `rd/app-preload-renders-nothing` @ 4745e1deb — THE MULTIPLIER
- Cause of "eleven routes nobody tapped": `app/_components/app-preload.tsx` fetched every page in the
  account's plan as an RSC payload — a FULL server render each — only to read chunk file names.
  Plan (`appPreloadPlan`, counted): host 5 · supplier 9 · host with a shop **14**, on every hard load
  of any signed-in page. Not `<Link>` prefetch.
- One constant off: 14 → 0 renders per load. Awaits the owner's word (sets aside the mechanism of
  DECISION_LOG 2026-10-02 "A HOST'S WHOLE APP LOADS ONCE, IN THE BACKGROUND").
- What a person could notice: first tap on a section downloads its code (≤ 99–263 KB gz per section).

## #6456 `rd/app-preload-reads-no-data` @ 9a271aa27 — the proper fix (stacked on #6452)
- Chunk names from the build: `scripts/write-app-code-map.mjs` (after `next build`) writes
  `.next/static/app-code/<build version>.json`; `lib/app-code-map.ts`; the preload asks the CDN once
  and the server nothing. No map → nothing (never a render). `routeChunkUrls` removed.
- Guard `lib/app-preload-renders-nothing.test.ts` (8 tests, counting fetch over the real queue and
  plan): 0 app-route requests · 1 map · chunks. 7 sabotages red.
- NOT VERIFIED: that Vercel serves a file written into `.next/static` after the build — check the
  preview (one `app-code/<sha>.json` 200, no `?_rsc=preload`). `<Link>` prefetch not measured.

## #6454 `rd/guest-page-reads-are-cached` @ 82d57db0f — parallel starts, named time, the caching map
- `lib/start-ahead.ts`: start a read now, await the same promise where it always was. Guest body with
  a 30 ms database round trip: 861–937 ms → 596–629 ms; requests 35 → 35 (no read added).
- `ServerTimer.mark` + `unnamed`: the guest body's whole time is named in `[server-timing]`.
- Remaining time: live-layer ≈ 260 ms, media ≈ 210 ms (still in single file inside those loaders).
- **Read map** (signed-in render, 34): per-event public 19 (of which the SAME `events` row is read 9
  times) · ownership 3 · platform config 5 · per-viewer 7. Stranger on the empty fixture: 11.
- **Cross-request caching NOT built — owner decision needed.** Nothing in the database says "this
  event changed" (no trigger on `events.updated_at`), 137 files write `events`, and Next serves a
  time-expired entry stale first. Options in the PR: **A (recommended)** one migration — a per-event
  `public_rev` stamp bumped by triggers; cache keyed by `(event, rev)`; repeat view 19 → 1 ·
  B an accepted delay · C tag every writer (cannot be proven complete).
- Guard `lib/the-guest-page-starts-its-reads-together.test.ts` (9 tests). 7 sabotages red. 1,334
  pinned tests green.

## NOT DONE (in priority order)
1. **One `events` row per render** — the 8 extra single-column reads (`event_date`, `rsvp_backdrop`,
   `panood_watch_url`, `papic_on`, `event_date_precision`, `entourage_section_order`, `role_names`,
   `print_details`): 34 → 26 per signed-in guest view, no cache needed. Six feature modules.
2. **`event_entitlement_facts(p_event_id)` migration** — production still fires ~7 per-product
   basket/comp RPCs on a guest page for an event WITH orders (controller, `/cale-ice`: 23 requests,
   no improvement from #6448). Not started: it is money-adjacent, needs `pnpm migration:new`, the
   Ugat map, the RPC rosters and db tests — its own careful PR.
3. **The request-budget ratchet** — not started. Finding that shapes it: a unit test CANNOT count a
   page faithfully (plain node's React `cache()` never memoizes — `lib/request-once.ts` says so —
   and a page needs Next's request scope), so the honest ratchet is a real `next start` against the
   counting stand-in in its own CI job, with a realistic fixture (≈30 guests, ≈12 suppliers, orders).
   Measured so far (EMPTY fixture, per server render): Maker 148 · guest page signed-in 35 · a Maker
   stage 36 · stranger 11. Home, Guests, Suppliers, supplier Today: not measured.
4. `live-layer` and `media` still read in single file inside (`loadLiveLayer`, `lib/entitlements.ts`).
5. The desktop Maker's phone-first canvas address (`maker-shell.tsx`), and Details' page frames
   loading the guest page on open — seen in the harness, other builders' lanes.

Helper names for the shared rules: `startAhead` (`lib/start-ahead.ts`) · `ServerTimer.mark`
(`lib/server-timing.ts`) · `askedOnce` (`lib/request-once.ts`, P1) · `appCodeMap` / `chunksForRoute`
(`lib/app-code-map.ts`, in #6456) · `warmOnce` / `canvasPosts` (`buffered-canvas-frame.tsx`, in #6451).
