# WHAT'S NEXT — Open-Browse Program Handoff (2026-07-23)

> **COLD-START:** paste into the new session: *"Read `~/Documents/Claude/Projects/Setnayan/WHATS_NEXT_Open_Browse_Handoff_2026-07-23.md` end-to-end, verify the in-flight state it describes, then continue the program."* Written at session end while wave-4 agents were IN FLIGHT — § 2 is your first action.

## § 0 · Ground rules (non-negotiable, all battle-tested today)

- **Repo:** the HOME-ROOTED checkout `/Users/icecasasola` (git-dir `.git`; worktrees under `.claude/worktrees/`). **NEVER** read `/Users/icecasasola/Documents/Claude/Projects/setnayan-platform` or `/Users/icecasasola/setnayan-wt-seo-geo` — both stale (the latter ~112+ migrations behind; caused wrong conclusions twice).
- **Migrations AUTO-APPLY on merge to main.** Everything ships INERT: default-FALSE columns / 'inactive' controls / dark env flags ARE the go-live holds. Mint stamps with the ALLOCATOR: `pnpm migration:new` — never hand-stamp (CI `migration-timestamp-guard` + cross-lane collisions).
- **Arm discipline (best pattern found):** open the PR as **DRAFT** (the repo's `enable-automerge` workflow skips drafts) → run every gate → `gh pr ready` → the workflow arms → poll to the merge outcome. Never let auto-arm precede verification.
- **The behavioral merge gate (proven recipe):** no local env exists (keys live only in Vercel) — diff **prod vs the PR's Vercel preview**: `https://www.setnayan.com/maria-and-jose` bare + `?phase=save_the_date|rsvp|event|editorial`, strip scripts/normalize (prove the normalizer zero-noise on prod-vs-prod first), require byte-identical bodies. PR3 extended it to the GUEST identity via a seeded `is_sample` demo guest (never a real token).
- Verify-before-arm always: tsc · lint · prod build (retry once on contention) · full unit suite (~2,851) · migration replay via `npx tsx --test apps/web/tests/db/photo-tag-cap.db.test.ts` · adversarial re-read of the full diff. Guest labels ≥ `text-xs` (the legibility guard bit twice). `// gitleaks:allow` or `.gitleaksignore` fingerprints for R2-key false positives (both precedents exist).
- changelog.d fragment per PR; NEVER edit CHANGELOG.md/STATUS.md; corpus DECISION_LOG.md gets a row per landing (append-only, bottom).
- Guests are ZERO-ACCOUNT (cookie `setnayan_guest_session`; SECURITY DEFINER RPCs; Kwento/`photo_messages` is the guest-text canon; `papic_complete_mission` the guest-write canon).

## § 1 · Program state at handoff

**MERGED today (all inert/flag-dark unless noted):** #3565 Papic-Challenges rename · #3566 tag cap 20 + ghost fix (LIVE) · #3568 love-story editor (LIVE) · #3581 pool gallery · #3583 guest columns · #3584 QR rotation (host rotation LIVE; kill switch dark) · #3585 retake + Story reward (LIVE — Papic is flag-on) · #3587 schedule trigger (coordinator advance LIVE; guest read dark) · #3589 chibi foundation · #3590 pool meter · #3594 DPO console registration (verify merged: `gh pr view 3594`) · **open-browse #3595 (PR1) · #3596 (PR2) · #3597 (PR3)** — page.tsx 4,351→608, SiteBody + `lib/site-body-plan.ts` + three-layer anonymous firewall (`PUBLIC_WIDGET_ALLOWLIST` + `Leak extends never` + preview-diff).

## § 2a · SECOND HANDOFF UPDATE (later 2026-07-23) — widget-seed fix READY TO SHIP + PR4/PR5 status confirmed

**CONFIRMED at second handoff: PR4/PR5 were never pushed** — the wave-4 agents died with the first session; `gh pr list` shows no open-browse-pr4/pr5 PRs. Their worktrees hold UNVERIFIED WIP (§ 2 audit applies). Note: PR4's `open-browse-schema.db.test.ts` exists only in that unmerged worktree — do not assume it's on main.

**WIDGET-SEED DRIFT FIX — work is DONE and VERIFIED, only the ship steps remain.** Worktree `.claude/worktrees/widget-seed-reconcile` (branch `claude/widget-seed-reconcile`, base #3597) contains, already written:
- `supabase/migrations/20270919679722_invitation_widget_seed_16_reconcile.sql` — allocator-minted; 16-row seed (what_to_bring 14 · our_photos 15 · our_love_story 16); guarded UPDATE renumbering stale our_love_story rows 14→16 (the collision the stale rebuild created); defensive full-16 backfill ON CONFLICT DO NOTHING; deliberately mode-column-free so it's order-independent with PR4.
- `apps/web/tests/db/invitation-widget-seed.db.test.ts` — **2/2 GREEN on full replay** (16/16 canonical seed, zero order collisions; backfill heals a simulated 14-row drift).
- `apps/web/changelog.d/widget-seed-reconcile.md` — done.

**TO SHIP (30 min):** in that worktree: `npx tsc --noEmit` · `npx next lint` · `npx next build` · re-run the seed test + `tests/db/photo-tag-cap.db.test.ts` → commit (Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>) → push → **DRAFT PR** → gates green → `gh pr ready` → auto-merge arms → poll to merge. Merge auto-applies the heal to prod's 4 events (each gains what_to_bring + our_photos; our_love_story reorders 14→16).

> ✅ **SHIPPED 2026-07-23** — committed (`0f2afbcda`), pushed, and opened as **PR [#3598](https://github.com/iscasasola/setnayan-platform/pull/3598)**, auto-merge armed (waiting on required CI). Full `test:db` green (91/91, incl. the 2 new seed tests). The prior session had written all three files but never committed them — this closes that. **Do not re-ship.**

## § 2 · FIRST ACTION — the two in-flight wave-4 lanes

At session end, two agents were building in parallel. **Check, then resume or finish:**

```bash
gh pr list --repo iscasasola/setnayan-platform --state all --limit 6 \
  --json number,state,headRefName --jq '.[] | select(.headRefName|test("open-browse-pr[45]"))'
git -C /Users/icecasasola/.claude/worktrees/open-browse-pr4 status --short 2>/dev/null | wc -l
git -C /Users/icecasasola/.claude/worktrees/open-browse-pr5 status --short 2>/dev/null | wc -l
```

- PRs exist + merged → log DECISION_LOG rows, proceed to § 4.
- PRs exist + open → verify checks, finish per § 0 discipline.
- No PR + dirty worktree → **the WIP is UNVERIFIED: read every dirty file end-to-end before trusting it** (this recovery ran once today and worked), finish per the briefs in § 3.
- No worktree/empty → rebuild from the § 3 briefs.

## § 3 · The remaining briefs (PR4-PR11)

Canonical: council verdict **`Guest_Event_Website_Open_Browse_Council_Verdict_2026-07-22.md` § 3** (the 11-row table) + the handover chains in the MERGED PR bodies (#3595→#3596→#3597 on GitHub — durable, read them). Condensed deltas + owner decisions:

- **PR4 (in flight):** one inert migration — `events.website_open_browse BOOLEAN NOT NULL DEFAULT FALSE` + `invitation_widgets.mode ('auto'|'shown'|'hidden') DEFAULT 'auto'` **with backfill `is_visible=FALSE → 'hidden'` in the same migration** (never un-hide a couple's choice). Zero readers.
- **PR5 (in flight):** privacy hardening, mostly LIVE + DPO checklist in the PR body. (a) seat-lookup: durable rate limit, no other-guest echo, plan+date-window gate. (b) name-claim: **email-OTP else couple-review-queue** (owner ③); non-confirming no-match copy; rate limits. (c) `invitation_widgets.audience ('public'|'guests_only') DEFAULT 'public'` — **NO guests-only backfill (owner ① overrode: public for everyone; per-couple dial)**; inert until PR7. (d) `events.live_media_public DEFAULT FALSE` + gate the ANONYMOUS watch-live/live-wall render on it, LIVE (owner ②: guests-only default, couple opt-in; toggle UI waits for PR9); wire inside `resolveSiteBodyPlan`; update goldens, document the delta. (e) strip dietary/meal/notes from guest-facing loads (keep the guest's own RSVP inputs working). (f) scrub `?invite=/?t=/?g=` from analytics; robots noindex on `/papic/me/[token]`.
- **PR6 menu shell (flag `NEXT_PUBLIC_WEBSITE_MENU_ENABLED`, off; demo events forced on):** `SiteMenuBar` grown from `guest-hub-bar.tsx` (props-only, zero new DB reads, `useModalA11y` QR modal kept); anchor ids stamped **in SiteBody (single site)**; the anonymous menu variant may consume ONLY `AnonymousSiteIdentity` fields (the firewall test catches violations); preserve one-shot params (`?save ?invite_error ?phase ?film`); absorb GuestHubBar slots (guest) + PublicEventDayBar actions (anonymous) before either retires; `/hub` stays its own route. Tab labels: Home · Details · Story · **Gallery** (owner-renamed, NOT "Photos") · Me; Papic-related copy says **"Papic Challenges"**.
- **PR7 open-everything (dual-path, no deletions):** `WIDGET_SPOTLIGHT` + shared `hasContent()` land ALONGSIDE `WIDGET_PHASES`, branched on `website_open_browse` **inside `resolveSiteBodyPlan`** (PR3's rule); existing 15 goldens = the flag-off byte-lock; `qr_card` + `greeting` widened to all phases; degraded terminal states (RSVP status-aware; countdown → "Married" stamp; archive tenses); capability object replaces allow-list USAGE while the exported constant stays the firewall; **editorial keeps the MENU below it (owner ④ — the site lives on as the archive)**; new public `event_details` variant = event-level fields only; audience dial (`audience` column) consumed here; STD film: seen-flag + deep-link suppression + **"Chapter one · The reveal" permanently in Story (owner: replayable any phase — needs `?film=` force-replay; prod today only has `?film=0`)**. Guest columns close at the editorial date-gate (already server-enforced in the RPC — mirror client-side).
- **PR8 empty states:** entitlement-derived, null-date-safe, post-event-tense teaser plates; find-mode invite card w/ error-aware variants + phase ceiling. **OWNER APPOINTMENT: copy voice pass** — send the copy as one read-through.
- **PR9 mirror manager:** rebuild `/dashboard/[eventId]/website` as five rows in the guest's order (Auto/Shown/Hidden via `mode`; Shown disabled while source empty; auto-populate chips; deep-links incl. the NEW `/website/our-story` editor from #3568); board header: Launch · Privacy/visibility (audience dial + `live_media_public` + `pool_gallery_open` toggles land here) · Appearance · per-event "Open browsing" toggle · post-event archive-visibility control (v1 per accepted default). Home + Me never holdable. **Must ship + be communicated before ANY flip.**
- **PR10 writer dedup:** `lib/host-gate.ts` (`requireCouple` stays only on launch + STD studio); `revalidateGuestSite(slug)` helper; delete site-editor's duplicate hero actions; fix site-chrome's video null-clobber; declare music ownership. Independent — any time after PR1.
- **PR11 rollout:** flip `NEXT_PUBLIC_WEBSITE_MENU_ENABLED` → demo events on → **OWNER WALKTHROUGH (4 phases × 3 identities: incognito / demo-guest QR / logged-in host on a demo slug)** → new events default-on at creation; existing events opt in via the board — **no backfill of in-flight weddings**. After soak: delete `WIDGET_PHASES` + dead branches, retire PublicEventDayBar, fix stale flag comments, DECISION_LOG + corpus notes (stale `[Token]`/₱1,499-Custom-QR lines). Rollback at every stage = a toggle.

## § 4 · Owner ledger (all decided — do not re-ask)

DECISION_LOG rows of 2026-07-22/23 carry everything; headlines: 5-tab site LOCKED · tab = "Gallery" · "Papic Challenges" naming · cap 20 live-only · QR rotation = guests + host/coordinator · Papic One = DEDICATED points + own QR (**needs seat-scoped ledger — PARKED with the money sitting**) · challenges pool-metered, select→commence→retake w/ per-photo consent re-ask · Story reward download-only · pool gallery couple-toggle default-OFF, self-link photos-only V1 · guest columns 1/guest, couple-approved, close at editorial date-gate (late approvals allowed) · schedule: host+coordinator set now, RSVP shows "Estimated" · **finish-line four: schedule/venue PUBLIC-for-everyone (per-couple dial) · live media guests-only + couple opt-in · claim = email-OTP-else-queue · editorial keeps the menu** · defaults: per-browser seen-flag + `?film=` replay, archive-visibility in v1, area-edit moderators edit content (launch/STD couple-only).

## § 5 · Owner appointments + flip levers

**Appointments:** ① DPO pass = review PR5's "DPO review checklist" body section + activate/hold controls at `/admin/data-privacy` (after #3594: `guest_columns` + `papic_pool_gallery` sit inactive; coverage shows honest drift until `/privacy` + ROPA cover them — tracked owner to-do). ② Copy pass at PR8. ③ Walkthrough at PR11.

**Flip levers (env in Vercel + console approves):** `GUEST_SESSION_TOKEN_CHECK` → then `GUEST_QR_SELF_ROTATE` (order matters) · `GUEST_COLUMNS_ENABLED` + console · `NEXT_PUBLIC_PAPIC_POOL_GALLERY` + console + per-event toggle · `NEXT_PUBLIC_GUEST_NOW_TRIGGER` · `NEXT_PUBLIC_PAPIC_POOL_BAR` · later: `NEXT_PUBLIC_WEBSITE_MENU_ENABLED` (PR11) · `NEXT_PUBLIC_FIGURE_CHIBI` (after chibi PR2+).

## § 6 · Parked / next programs

- **Money sitting (owner-scheduled):** top-up charge path (trust-first bounds `trust_topup_max_open`), Papic-One seat-scoped ledger, kill the ≥10k top-up unlock?, `extra-cameras-picker` stale copy, reconcile meter amber vs `soft_stop_at`, `papic_event_pool_status` anon GRANT → privacy queue.
- **Chibi PR2-7** (maker UI imports `lib/chibi-config.ts` — no second catalog; head tilt via `userData.headGroup`; crowd contract in `lib/chibi-geometry.ts` header; store-of-record divergence: `guests.avatar_config` vs rig-spec §11.4 — copy-on-claim future work).
- **Story clips end-to-end** ride the clip-web-copy pipeline (also urgent for 10s/7pt storage). **Memory-linked milestones** (Setnayan-collected only, text-only otherwise) wait on the Life Story flag call. **QR noindex/analytics leftovers** partially land in PR5(f).
- **Roadmap after the guest site:** coordinator day-of page (rides the schedule trigger + run-of-show) → vendor day-of pages (launcher #3290 + capture controller #3388 flag-dark + brief RPC + delivery-scan plan in `0031_day_of_guest/`). Same day-of grammar, role-scoped panels.
- **Unsigned:** the URL-lock reversal (`Event_URL_Scheme_Competitor_Research_2026-07-22.md`) — events stay flat `/{slug}`; sign or veto.

## § 7 · Artifacts + design references

The interactive prototype's hosted artifact is **account-bound (old account — unreachable from the new one)**. Canonical copy: **`Guest_Event_Website_5Tab_Prototype_2026-07-22.html`** (corpus root, standalone — double-click to open; v3.9: Gallery tab, Papic Challenges, retake flow, Story-reward CTA, host pool bar, pool gallery, columns deadline). Republish it as a new artifact from the new account if a hosted link is wanted. Design docs: the council verdict + `OnTheDay_App_Build_Studies_2026-07-23.md` (six studies + §6.2 sign-off list) + `0012_papic/Papic_Challenge_Story_Reward_Build_Brief_2026-07-23.md`.

**Memory note:** the old session's memory lives at `~/.claude/projects/-Users-icecasasola-Documents-Claude-Projects-Setnayan/memory/` (machine-local). If the new account reads it, trust-but-reverify per its own headers; if not, THIS doc + DECISION_LOG (bottom ~30 rows, 2026-07-22/23) are the complete record.
