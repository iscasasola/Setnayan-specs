# Setnayan — Sunday-account CLOUD CONTROLLER session, Sat 3 Oct 2026 (summary to continue from)

You are continuing the Setnayan CONTROLLER work started in a cloud session on 3 Oct 2026. Read this first, then `HANDOFF_STATE_2026-10-03.md` (newest block on top) and the 2026-10-03 rows at the bottom of `DECISION_LOG.md` in iscasasola/Setnayan-specs. Owner is phone-only: plain English, verdict first, one-line why, recommendation; every build ships with a check card (where · 3 steps · what you should see). Test events only: maria-and-jose, birthday-salubong — never cale-ice.

## 1 · LIVE NOW
- Production = **777cf8f** (train b, PR #6314), deployed 3 Oct 10:50 UTC via `deploy-prod.yml` (success); Vercel prod deployment READY on 777cf8f; migration `20271261953500_a_wipe_says_where` confirmed in the prod ledger.
- Train b members (all merged): #6312 background jobs fixed (refresh_demand_radar_rollups, recompute_market_price_bands, recompute_market_funnel_bands: bare DELETE → `DELETE … WHERE true`; db guard scans every function body) · #6307 slim phone top bar (one row at 375/360, incl. HQ admin; HQ role tag hidden on phone) · #6295 guest-flow fixes (a guest at a host address lands on the Event Hub; one shared guest column list) · #6311 guest list (one search matcher for everything incl. "bestman"/"VIP"; every heading folds; tap card white space opens it; row ⋯ menu stays on screen; delete takes song requests and Undo restores them) · #6306 Home = approved first screen + one "What's next" row opening a sheet (journey rail + "% booked" deleted; new /dashboard/[eventId]/nikah page).
- Independent Sonnet audit of #6314: no blockers. Owner told: plan-phase Home no longer shows set-date / Papic-ready nudges, "Plan next year", tea-ceremony tile (still on the day/after; tea ceremony in Paperwork).
- Owner check cards were sent (guest list · Home · top bar · admin Price bands Recompute · guest lands on Event Hub). Owner asked what "Recompute" is — answered (it rebuilds the typical price ranges; it was failing).

## 2 · WORK IN FLIGHT (stopped by the weekly usage limit ~11:30 UTC; limit said it resets 18:00 UTC)
- **C2 People with access** — branch `rd/people-with-access` @ 35afc47 (pushed by controller; NO PR yet; 43 files; migration `20271262573732_an_area_set_to_off_is_closed.sql`). Next: open DRAFT PR, label do-not-auto-merge, full local checks (typecheck, lint, every ci.yml guard, full unit suite non-zero count, db tests), CI to green. Brief = "## C2" in `CLOUD_PROMPTS_SUN_2026-10-03.md`.
- **Review follow-ups (not started; re-launch)** — branch `rd/train-b-follow-ups`: (a) security: `restoreDeletedGuests` must only restore really-deleted guests and must not take `decided_by_vendor_profile_id`/`decided_at` from the client (song-request supplier-attribution forge, own event only); (b) /nikah `redirect('/login')` → `loginRedirectPath`; (c) flaky unit test — suspect `lib/supabase/session-budget.test.ts` wall-clock assert; make robust, never skip.
- **Fable plan: supplier page Follow + Add to an event (not started; re-launch)** — replace "Plan with Setnayan" (a /signup button that looks like Inquire). Rule 0: shipped Save/Saved (`explore/_components/save-vendor-button.tsx`), Discover follows (`front-door-discover.tsx`, `follow-gate.tsx`); decide whether Follow = Save renamed (no second mechanism). Prototype + plan + owner questions.
- **GREEN DRAFTS for train c:** #6308 event-hub-calm @ eb68ea89 (owner approved, "1. A") · #6310 Discover card @ 1fda1411 (other session `session_01Hh1HXxFvpBvv5BcYe63RkS`; controller asked it to remove the +15.7 KB `/` JS growth before it rides — check its reply).
- **ON HOLD — do NOT build as first briefed:** moving guest columns/3D/keepsake into the Story tab. The Story tab exists only in Save the Date + Invitation (`app/[slug]/_lib/stage-bar.ts`); The Day = Live · Welcome · Camera · Gallery · Me; Post Event = Recap · Film · Suppliers · Gallery · Me. Corrected proposal awaiting owner "yes": "Write a column" in **Camera** on the day + **Recap** after; "Walk the room in 3D" on **Welcome** on the day; "Your keepsake reel" on **Recap**; remove "Everything else". Amend DECISION_LOG once answered.

## 3 · QUEUE (after C2)
1. Host approval setting (Event Details › Privacy): ONE choice "Auto-agree" · "I check and approve / reject", covering ALL supplier requests (sponsored Papic Challenges + supplier schedule add/edit/delete); default "I check and approve / reject". Guest's own Share tap unaffected.
2. S1 supplier schedule/card fixes (from `SUPPLIER_SIDE_REPORT_2026-10-03.md`): Script tab in flag-ON card · notify coordinator · accepted supplier item tagged to supplier · delete requests on OWN items only (migration kind 'remove') · remove the always-padlocked "Who's received theirs" tile.
3. S2 supplier scan (approved prototype `prototypes/supplier_scan_2026-10-03_fable.html`): five modes in one dropdown, console tile + desk shortcut, many guests per number, refused guest = count only, Your numbers → Add photo, guest's "Your number #0042" card, Ordered → Received.
4. S3 Papic → supplier's page (prototype `prototypes/papic_to_supplier_page_2026-10-03b_fable.html`): own Papic shots + imported album go public automatically after a 7-day guest notice; tagged guests get a line on Me with Remove; nobody tagged → every guest one line "See them"; Remove = shipped takedown; no couple Allow (couple keeps Hide); Challenge photos public only when the Share tap says "They may show it on their Setnayan page."; "Yours to use" → "Yours to keep".
5. S4 supplier page "Their work" (prototype `prototypes/supplier_page_2026-10-03_fable.html` + `SUPPLIER_PAGE_REVIEW_2026-10-03_fable.md`): albums per event "Type · venue · Mon YYYY" (no names; venue hidden if private), own uploads last, Track record merged in, calling card on top (no stock banner), one Details fold, no "Back to home", Pro rail copy fix. After S3.
6. Follow + Add to an event (after Fable plan + owner yes).

## 4 · OWNER RULINGS TODAY (all in DECISION_LOG 2026-10-03, verbatim there)
- Supplier scan: all five modes · console + desk shortcut · build after C2 · prototype approved ("yes create their prototype").
- Supplier photos: only (1) photos they took (auto after 7-day guest notice) and (2) Challenge photos guests shared — never the couple's gallery (RA 10173). Every guest gets the one-line notice when no faces are tagged ("keep our decision about every guests").
- Discover card: Classic → paper invitation card; a custom main background shows on the card.
- Supplier page: "Their work" by event (type·venue·month, uploads last, one list); "Plan with Setnayan" → Follow + Add to an event.
- #6308 approved (both design diffs). One approval setting for all supplier requests; default "I check".
- Guest Columns exist (d6 approved 2 Oct) but need owner to set `GUEST_COLUMNS_ENABLED=true` in Vercel (cloud cannot read Vercel env: 403). 0 columns ever written.

## 5 · OWNER-VIEWABLE ARTIFACTS (private, claude.ai)
- Supplier scan: https://claude.ai/artifact/REnPMEGjGpp2fAwaogjhpc
- Papic to supplier page (v2, 7-day notice): https://claude.ai/artifact/V3u4FnBgVCdnhZ2j5nY9rC
- Supplier page today vs proposed: https://claude.ai/artifact/WeVBx7LtmgEVZqYfkXrsbj
- Event Hub calm before/after (#6308): https://claude.ai/artifact/97CzwxpNXKHzVZoZuP1B2q

## 6 · TRAPS MEASURED TODAY (cloud environment)
- `gh` CLI is unauthenticated in the cloud → use GitHub MCP tools (create PR, issue_write labels, disable_pr_auto_merge, actions_run_trigger for deploy-prod).
- setnayan.com and *.vercel.app are egress-blocked → verify deploys with Vercel MCP `list_deployments` (githubCommitSha + READY) and Supabase MCP SELECTs; the owner does the phone checks.
- ⛔ Every NON-draft PR gets auto-merge re-armed (5 of 5 measured, despite label + earlier disable). Keep member PRs as DRAFTS; only the train is marked ready, immediately merged with `merge_pull_request` (merge, expectedHeadSha) after all checks green.
- Builders share 4 CPU / 15 GB: heavy jobs under `flock /home/user/.heavy.lock`. Builder rules file lived in the cloud scratchpad (ENV_RULES.md) — re-create it in a new session.
- A train is folded by an agent (merge --no-ff, regenerate port-control baseline with `gen-port-baseline.mjs` and `pnpm ugat:screens`, union check, full local checks), audited by an independent Sonnet agent, then merged by the controller.
- The weekly usage limit kills subagents mid-task without warning → push work early; write the handoff before the limit.

## 7 · PROBLEMS LOG (app_fault_issues) notes
- Pre-batch-7 leftovers to re-check: /api/guest/pass-card BUTTON_TIMEOUT ×6 + an HTTP error on the guests page; GET events "invalid input syntax for uuid" ×2. After train b: confirm the DELETE WHERE rows get no new hits.
