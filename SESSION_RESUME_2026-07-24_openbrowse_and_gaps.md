# ▶▶ RESUME HANDOFF — Open-Browse PR6–11 + Gap-Audit tail (2026-07-24)

> **COLD-START (paste into the new session):** *"Read `~/Documents/Claude/Projects/Setnayan/SESSION_RESUME_2026-07-24_openbrowse_and_gaps.md` end-to-end, verify the state it describes against `origin/main`, then continue — gogogo."*
>
> This one doc carries the whole state. A fresh session (even a different Claude account) can resume from it alone.

---

## ✅ PROGRESS UPDATE — session 2 (2026-07-24, later) — 7 PRs

**Shipped this session (6 merged + 1 armed):**
- **#3614** — guest-capture UGC gates: was BLOCKED (its restored terms-gate broke `lib/papic-pool-metering.test.ts`, which still expected `'ok'` where the gate returns `'terms_required'`). Fixed the `createGuest` fixture to stamp `ugc_terms_accepted_at`. ✅ merged.
- **#3621 — PR6b (guest tree):** ✅ merged. Extends the §A PR6 menu shell from the anon tree to the GUEST tree in `site-body.tsx` (`guestTree`) — same 5 tabs. Refinement: markers gated on `menuOn` so flag-off DOM stays byte-identical. **§A "PR6" is now FULLY done (anon #3619 + guest #3621).** GuestHubBar QR modal stays (coexist until PR11) per the shipped `site-menu-bar.tsx` contract.
- **#3623 — B3 consent veto:** ✅ merged. The §B `editorial/data.ts` consent gap was REAL (recap gated on `moderation_state='clean'` only, not consent). New `editorial/consent-veto.ts` + veto applied to all 8 public papic-image reads across `loadEditorialData` + `loadEditorialChaptersForEditor`; fails closed; consent beats curation. 5-case unit test. The audit's "and the teaser" is covered transitively (magazine PDF + OG hero go through `loadEditorialData`). Account **library** is the owner's private view → correctly out of scope.
- **#3624 — route 404:** ✅ merged. Bare `/dashboard/[eventId]/vendors/[vendorId]` had no page → 404 at sub-xl. Added a redirect page → `/workspace` + pointed `shortlist-taxonomy.ts` href directly. (`video-guestbook /gallery→/galleries` was already on main.)
- **#3626 — fullres-drop cursor:** ✅ merged. Migration `20270923187654` adds `full_res_drop_deferred_at` to `papic_photos` + `papic_guest_captures`; sweep orders `(deferred_at ASC NULLS FIRST, captured_at ASC)` + re-stamps deferred rows → Drive-deferred photos stop starving the oldest-N window. Inert.
- **#3627 — anon-draft-sweep cursor:** ✅ merged. Migration `20270924201580` adds `anon_sweep_skipped_at` to `public.users`; sweep orders by it NULLS FIRST + stamps all 5 skip paths → the RA-10173 deletion sweep can't wedge on a converted-account-with-lingering-email. Inert.
- **#3628 — Live Studio cameras/print:** 🟡 armed. Built `studio/panood/cameras/print/page.tsx` mirroring `studio/papic/crew/print` (owner chose "build, don't drop the button"). Prints UNCLAIMED cameras only (claimed QR = live credential).

**Owner decisions made this session (via plain-English ask):**
- Force-majeure stale-flag sweep → **escalate, not auto-close** — but this was **ALREADY SHIPPED** in a prior session (migration `20270920601523_force_majeure_escalated_status.sql` + `sweepEscalateStaleFlags` sets `'escalated'` + admin filter admits it + help/tour copy fixed). Verified closed; no PR needed. The audit entry predated the fix.
- Live Studio "Print QR sheet" 404 → **build the page** (shipped #3628).

**Migration max after this session:** `20270924201580` (allocate strictly above; re-check `origin/main`).

## ▶ REMAINING (start here next session)
- **Gap-tail — NOW CLEARED except owner-gated copy** (later 2026-07-24, session 2 cont.):
  - ✅ **`nsfw-screen.ts` poster-less-clip starvation — ALREADY FIXED** (sweep at :345 already excludes poster-less clips via `.or('…poster_r2_key.not.is.null')` + `.order('created_at')`, and the fleet sweep too). Verified closed; the audit predated it. No PR.
  - ✅ **`photo-delivery` Drive stall past ~240 — FIXED #3629** (`lib/photo-delivery-drain.ts` — a CRON-FREE `claimPeriodicJob` drainer wired into `admin/layout.tsx`, calls the existing `processBatchForEvent` (no re-enqueue → no dup jobs; note `enqueueRelease` INSERTS a fresh job each call, so widening its gate was the wrong lever). No migration.).
  - ✅ **`llms.txt` Setnayan-AI ₱1,499 — RESOLVED, NOT a bug (owner 2026-07-24).** Setnayan AI is priced **per event type** (weddings highest); **₱1,499 is the WEDDING price**, and llms.txt is wedding-first, so the figure is correct — the `₱499` in the corpus footer was the retired FLAT model. Leave llms.txt as-is.
  - ✅ **Per-type ladder IS BUILT + wired + tested (verified in code 2026-07-24 — my earlier "not built" was WRONG).** Owner-locked 2026-07-22 "go". Modules: `lib/setnayan-ai-type-pricing.ts` (event_type→tier map) + `lib/setnayan-ai-event-pricing.ts` (charge resolver); WIRED into `checkout/actions.ts:433` + `studio/setnayan-ai/page.tsx:125`; tests `setnayan-ai-per-event-gate.test.ts`. **Real ladder (NOT the ₱899/₱199 in the stale memory): A ₱1,499 Wedding · B ₱999 Debut/Corporate/Gala · C ₱499 Christening/Birthday/Celebration/Travel/Anniversary/Graduation/Reunion+default · D ₱99 Tournament/Gender-reveal/Date/Hangout · E ₱0 Simple/no-vendors.** GATED OFF by tri-state `platform_settings.setnayan_ai_per_event_pricing_enabled` (default OFF → flat `SETNAYAN_AI` catalog price charges today, byte-identical). **To go live: owner flips it from `/admin/integrations`** (prereqs per code: buy-flow copy + Wave-1 guard). Claude must NOT flip a live pricing flag. See [[project_setnayan_ai_per_type_pricing]] line 15.
  - **Copy (DPO gate = B4):** `help.ts`/privacy vs code — **parts DPO-gated → ask owner.**
- **Open-browse PR7–11.** PR8 empty-states **(OWNER COPY)** · PR9 couple manager mirror **(must ship+communicate before ANY flip)** · PR10 writer dedup · PR11 rollout **(OWNER WALKTHROUGH + flag flip `NEXT_PUBLIC_WEBSITE_MENU_ENABLED`)**.

### ▶▶ PR7 "open-everything" — SCOPED + PLANNED (re-mapped against #3629, 2026-07-24). ⚠ IN PROGRESS IN A SEPARATE SESSION (owner launched PR7 elsewhere 2026-07-24) — do NOT start a competing PR7; coordinate/check for its branch first. Plan below is the reference.
Spec: council verdict `Guest_Event_Website_Open_Browse_Council_Verdict_2026-07-22.md` §1.1 (five-tab content+degraded-state table) · §1.2 (3-tier identity, PII firewall) · §1.3 (phase-as-emphasis, `WIDGET_SPOTLIGHT`, `hasContent`, terminal states) · §2 (editorial ending) · §3 line 79 (build row) · §5 item 1 (menu-below-editorial **OWNER SIGN-OFF — handoff says "keep the menu below," treat as decided**).
**Already built (verified #3629):** schema `events.website_open_browse` BOOL default FALSE (mig `20270919912384`), `invitation_widgets.mode` auto/shown/hidden (same mig, backfill `is_visible=false→'hidden'`), `invitation_widgets.audience` public/guests_only (mig `20270920050000`) — ALL inert, ZERO app readers · `PUBLIC_WIDGET_ALLOWLIST` exported+tested (`lib/public-widget-allowlist.ts`, 10 types) · single plan builder `lib/site-body-plan.ts` `resolveSiteBodyPlan` (publicSafeWidgets ~L156-160) · `live_media_public` reader LIVE (the pattern to mirror) · byte-lock goldens `lib/site-body-plan.test.ts` (4 phases × identities) + `anonymous-zero-guest.test.ts` (`publicSafeWidgets.length===PUBLIC_WIDGET_ALLOWLIST.length`, zero guest bytes).
**NOT built (PR7 delivers):** `WIDGET_SPOTLIGHT` (ordering weight + Home spotlight pick + per-widget degraded-state renderer — NEVER a boolean; lands ALONGSIDE `WIDGET_PHASES` @ `invitation-widgets.ts:343` — exhaustive Record, can't partial-delete) · shared `hasContent()` (emptiness; `widgetShouldRender` only checks is_visible/is_always_on) consumed by BOTH menu + renderer · render branch on `events.website_open_browse` inside/around `resolveSiteBodyPlan` (flag-off = today verbatim = goldens byte-identical; flag-on = phases→spotlights) · widen `qr_card`+`greeting` (today `['rsvp']`/`['rsvp','event']`) to all 4 phases · capability object replacing inline allow-list USAGE (keep exported constant as firewall) · read `audience` AND-ed with `mode` in the plan · NEW public `event_details` variant (event-level fields ONLY — today renders guest role+side) · terminal states (RSVP status-aware, Countdown "Married [date]", what_to_bring/photo_moments archive-tense) · identity-aware Home spotlight (anon rsvp-phase = "Invited? Find your invite", never an RSVP imperative).
**⚠ KEY IMPLEMENTATION INSIGHT (verified by reading `resolveSiteBodyPlan` L129-164 + §1.3):** the surgical site is `resolveSiteBodyPlan` — its widget lists (`hideableInOrder`, `publicSafeWidgets`) + the `qr_card`/`greeting`/`hero`/`rsvp` gates are all fenced by `(!phasesEnabled || widgetInPhase(T, phase))`. Open-browse drops that fence (phases → emphasis). **BUT §1.3 is explicit that blanket-open WITHOUT per-widget degraded TERMINAL STATES is "the finding that sank the Monolith" — the REJECTED design.** So the render branch, `WIDGET_SPOTLIGHT` ordering, and the degraded terminal states are TIGHTLY COUPLED — shipping the branch alone would put the rejected design behind the flag. **There is no small, correct, byte-safe first slice; PR7's minimum-correct unit is large.** To keep goldens byte-identical: make the new `resolveSiteBodyPlan` input `openBrowse?: boolean` OPTIONAL (default false) so `site-body-plan.test.ts` compiles + the FALSE path is verbatim; the goldens exercise the flag-off path only.
**Build approach:** one focused slice = `openBrowse` input (fed from `event.website_open_browse` in site-body.tsx) + `WIDGET_SPOTLIGHT` (ordering weight + spotlight pick) + `hasContent()` + degraded terminal-state renderers + `qr_card`/`greeting` widen + capability object + `audience`/`mode` read — all gated on `openBrowse===true` (dormant in prod, default FALSE). Then a second slice for the public `event_details` variant + menu-below-editorial (§5 visible change). **Gate: `pnpm --filter web test:unit` (site-body-plan.test.ts + anonymous-zero-guest.test.ts green) + `test:db`.** Migration max after session 2 = `20270924201580`. PR7 worktree: `scratchpad/wt-pr7` off #3629 (prune if stale before resuming). Best built FRESH — it's a large coupled change needing full context for the byte-lock work.
- **Three owner gates still pending:** PR8 copy · PR11 walkthrough+flip · B4 privacy/legal copy (DPO).

**Workflow reminders that held up all session:** canonical checkout `/Users/icecasasola` (git root; migrations at repo root `supabase/migrations/`, code at `apps/web/`); one task = one worktree off latest `origin/main` = one PR + `gh pr merge --auto --merge`; PRUNE each worktree the moment its PR is pushed/merged (branch is safe on origin); symlink the hoisted `node_modules` (`ln -sfn /Users/icecasasola/node_modules $WT/node_modules` + `.../apps/web/node_modules`) to run `tsc`/`tsx` locally — `@electric-sql/pglite` is NOT in the stale local install so `test:db`/pglite tests only run in CI; verify (`tsc` on touched files + relevant unit tests) BEFORE arming; CI's `typecheck + lint` (runs `test:unit`+`test:db`) is the real gate and holds a red PR (it did for #3614).

---

## Repo + workflow (non-negotiable — battle-tested this session)
- **Canonical checkout = `/Users/icecasasola`** (git root; `apps/web/` + `supabase/migrations/` both under it). NEVER use the stale `~/Documents/.../setnayan-platform` clone.
- **One task = one worktree off latest `origin/main` = one branch = one PR**, then `gh pr merge <#> --auto --merge`. `git fetch origin main` first.
- **⚠ PRUNE EACH WORKTREE THE MOMENT ITS PR MERGES** (`git worktree remove <path> --force` → `git worktree prune`; clear `.next`). Worktrees are ~1–2 GB each; letting them pile up filled the disk to 100% mid-session and ENOSPC-deadlocked the shell. Prune as you go, never batch.
- **Migrations auto-apply on merge** (`supabase db push` via `supabase-migrations.yml`). Ship INERT: `DEFAULT`/flag-off IS the go-live hold. Allocate stamps STRICTLY ABOVE `origin/main`'s current max (was `20270921698789` at handoff — re-check). Non-round only. CI `migration-timestamp-guard` enforces.
- **CI now runs the FULL `test:db` (102+) + `test:unit` (lib/** AND app/**)** — my #3609 fix. So every db + unit test gates PRs.
- **Verify before arming:** `tsc --noEmit` · `next lint` · `next build` (public-page changes) · `test:db` replay · relevant unit tests · migration timestamp-guard. changelog.d fragment per PR.
- **When a decision is genuinely the owner's, ASK — in plain English, real-world trade-offs, no jargon** (owner instruction 2026-07-24). Surface anything reversing an owner-locked decision.

## What shipped this session — 18 PRs (17 merged, #3614 armed)
- **Security (prod-verified live):** #3601 public-media fail-closed · #3602 biometric erasure + temp-pw-out-of-URL · #3603 money-write-guard · #3604 RLS guest-scope (guests/orders → **couple+coordinator**, owner-decided) · #3605 self-grant tier guard.
- **Open-browse:** #3599 PR4 inert schema (`events.website_open_browse`, `invitation_widgets.mode`) · #3600 PR5a analytics scrub + noindex · #3607 seat-finder exact-match · #3608 PR5 live-media gate + `invitation_widgets.audience` · **#3619 PR6 menu shell (flag-dark, anonymous tree only)**.
- **Gaps:** #3598 widget-seed 16-reconcile · #3609 CI full test suites · #3611 Batch-B correctness (email joins, `/gallery`→`/galleries`, `/settings`→`/date-selection`, papic points-release, vendor-meter fail-closed) · #3612 nsfw-sweep poster-less-clip starvation · #3613 force-majeure ESCALATE-not-resolve (new `escalated` status) · #3614 guest-cap UGC block+terms gates (armed) · #3615 purge-chat FK CASCADE · #3617 dead guest-photo recap reads removed.
- **Prod DB verified 4×:** all migrations applied; seat-lookup exact-match, guests/orders couple+coordinator, entitlement guard, open-browse + live-media + audience columns all live.

## Owner decisions already made (do NOT re-ask)
- Invite/name-claim "identity-takeover" is **owner-LOCKED (2026-06-25 name-as-answer-key)** — NOT a bug; do not reverse.
- Seat-finder: **exact/prefix, own seat only** (shipped #3607).
- `orders` read scope: **couple + coordinator** (shipped #3604).
- Guest-PHOTO public showcase: **removed the empty section** (shipped #3617) — photos are not publicly showcasable.
- Prioritization: **do both tracks in parallel** (gap-tail + open-browse PR6–11).

## ▶ REMAINING WORK (resume here)

### A. Open-browse PR6–11 (the guest-website program) — council `Guest_Event_Website_Open_Browse_Council_Verdict_2026-07-22.md §3`
- **PR6 guest-tree slice (NEXT):** PR6 landed the ANONYMOUS menu only. Add `SiteMenuBar` to the GUEST tree in `apps/web/app/[slug]/_components/site-body.tsx` (`guestTree`, ~line 605) with the same `SITE_MENU_ANCHORS` stamped on the guest sections, and absorb the GuestHubBar QR-modal (the `useModalA11y` block) into the "Me" tab. Model + component already exist: `app/[slug]/_lib/site-menu.ts` + `_components/site-menu-bar.tsx`. Flag stays `NEXT_PUBLIC_WEBSITE_MENU_ENABLED` (off; sample-on).
- **PR7 open-everything** (dual-path `WIDGET_SPOTLIGHT` + `hasContent()` alongside `WIDGET_PHASES`, branched on `events.website_open_browse`; consumes `invitation_widgets.audience`; keeps the 15 goldens as the flag-off byte-lock). **Owner: editorial keeps the menu below it (§5 item 1).**
- **PR8 empty states** — ⚠ **OWNER COPY PASS** (send the copy as one read-through).
- **PR9 couple manager mirror** (`/dashboard/[eventId]/website` — Auto/Shown/Hidden via `mode`, audience dial, live-media + pool toggles). **MUST ship + be communicated before ANY flip.**
- **PR10 writer dedup** (`lib/host-gate.ts`, `revalidateGuestSite`).
- **PR11 rollout** — ⚠ **OWNER WALKTHROUGH** (4 phases × 3 identities) then flip `NEXT_PUBLIC_WEBSITE_MENU_ENABLED` + default new events on; retire GuestHubBar + PublicEventDayBar.

### B. Gap-audit Batch-B tail (`0012_papic/Verified_Gap_Audit_2026-07-23.md` — Batch A + most of B done)
Each is a self-contained fix (locations in the audit):
- **Sweep cursors (migrations):** `papic-fullres-drop.ts:211` Drive-deferred starvation; `anon-draft-sweep.ts:49` unordered 50-row wedge — add a cursor column + `.order()`.
- **`photo-delivery/actions.ts:166`** — Drive delivery stalls past ~240; needs a **new `claimPeriodicJob` drainer** (bigger).
- **`editorial/data.ts` consent filter** — verify against #3601 first (may already be closed by the `moderation_state='clean'` gate); if still open, add the `photo_tags → guests.photo_consent=FALSE` NOT-EXISTS veto.
- **Copy:** `llms.txt` retired SKUs/prices; `help.ts`/privacy vs code (**parts DPO-gated** — ask owner).
- **Routes:** `shortlist-taxonomy.ts:350` → `/vendors/${vendorId}/workspace` (service-scoped; 3 emitters — verify); Live-Studio `studio/panood/cameras/print` page (build mirroring `studio/papic/crew/print`, or drop the button).

## Recommended first move for the new session
1. `gh pr view 3614` — confirm merged (guest-cap gates). Re-fetch main.
2. **PR6 guest-tree slice** (fast — model + component exist), then **PR7**.
3. Interleave the migration-bearing gap-tail (cursors, then the consent-filter verify).
4. Ask the owner (plain English) at: PR8 copy · PR11 walkthrough · B4 legal copy · the two `/vendors/[vendorId]` + `cameras/print` route calls if ambiguous.
