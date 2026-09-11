# Repo sweep — what's unfinished in `setnayan-platform` itself

READ-ONLY sweep. Nothing in this repo was modified, merged, closed, or commented on to produce
this file. All code claims are against `origin/main` (fetched tip `9663550cb8819a295c55091831fc6fae1bbd3623`,
2026-09-11) via `git show`/`git grep`, never the local working tree (per house rule — other
sessions switch it). All PR/branch data is live from `gh` as of 2026-09-11, ~18:15–19:10 local.

This machine was heavily shared by other sessions during this sweep (a dozen-plus background
shells from parallel work were observed running concurrently), which made every multi-step `git`/`gh`
loop time out or stall — not a data problem, a scheduling one. Where that cost real coverage, it's
flagged inline rather than papered over.

---

## 1. Every open pull request

**6 open PRs total.** Per the caller's brief, #5464–#5467 (live-test-round-1 fixes) and #5463
(draft, deliberately held) are **in flight** — not defects to chase, just captured for completeness.

| # | Draft? | Age | What it does | Stale (7d+)? | CI | Blocker |
|---|---|---|---|---|---|---|
| #5467 | No | <1 day (09-11) | Chat: an open tool panel no longer covers the conversation body/tabs on the 3-column quote-builder layout | No | 16/17 checks pass, `typecheck + lint` **pending** | **IN FLIGHT** — test-round-1 fix, `mergeStateStatus=BLOCKED` only because the required check is still running |
| #5466 | No | <1 day (09-11) | Vendor chat: the mobile "Tools" access point was an unlabeled 36px circle; now a visible "Tools" pill (44px floor) | No | all but `typecheck + lint` pass (pending) | **IN FLIGHT** |
| #5465 | No | <1 day (09-11) | Chat composer: plain Enter sends, Shift/Alt/Ctrl/Meta+Enter and IME composition don't | No | all but `typecheck + lint` pass (pending) | **IN FLIGHT** |
| #5464 | No | <1 day (09-11) | Quote builder: a 200-guest pax value failed native HTML number validation (`min=1 step=10` only allows 1,11,21…) | No | all but `typecheck + lint` pass (pending) | **IN FLIGHT** |
| #5463 | **Yes** | <1 day (09-11) | Bench/card save + thread/perk-line naming fixes from owner's live test round 1 | No | all pass incl. `typecheck+lint` (39m35s) | **IN FLIGHT — deliberately held as DRAFT** until the owner's test round ends (per caller's brief); `mergeStateStatus=CLEAN`, ready the moment it's undrafted |
| #5405 | No | 1 day (09-10) | Docs: points `build-sessions/PROVE-THE-FLOW.md` at the round-1 test plan and names 5 blockers | **No** (created 09-10, still same-day updates) but **not** on the in-flight list | **`typecheck + lint` FAILS** (48m21s run, all other 15 checks pass) | Failing required check — **not accounted for by the "in flight" note; genuinely stuck** |

**Only real action item here:** #5405 is a plain docs PR failing the required `typecheck + lint`
check and isn't one of the five PRs the caller said to treat as in-flight noise. It's one day old,
not yet "stale" by the 7-day bar, but it is the one open PR in this repo that is neither moving
nor explained.

---

## 2. PRs closed without merging in the last 30 days

**Caveat on method:** `gh pr list --search "is:unmerged closed:>=2026-08-12"` (the command the brief
suggested) **silently under-reports** — GitHub's search API returns wrong results when `is:unmerged`
is combined with a `closed:` date range in the same query (verified: the combined query returns 4
hits; fetching all `is:unmerged` PRs unfiltered — 118 of them, repo-wide — and filtering by
`closed_at` locally returns 18). The correct method used here: `gh api search/issues` with
`is:unmerged` alone, paginated, filtered locally for `closed_at >= 2026-08-12`.

**18 PRs closed-without-merging in the last 30 days.** All but two have a traceable disposition:

| PR | Closed | Title | Disposition | Evidence |
|---|---|---|---|---|
| #5357 | 09-09 | "Message" on a supplier public card opens the conversation | **Superseded** → #5358 (merged 09-09, 08:41) | Owner comment names it explicitly |
| #5013 | 08-29 | SEO: scope vendor JSON-LD areaServed to city | **Superseded** → #5016 (merged 08-29) | Owner comment: "clean cherry-pick, original conflicted" |
| #5012 | 09-10 | Stories switch reaches every kind of day | **Superseded** → #5378 (merged 09-09) | Owner comment names commit hashes carried forward |
| #5272 | 09-06 | A booked supplier suggests its reception zone, never writes it (Q9) | **Superseded** → #5273 (merged) | Owner comment: "strict superset of this PR's six shared files" |
| #5023 | 08-30 | docs(register): retire two false constraints | **Superseded** → #5027 (merged) | Owner comment names it |
| #5004 | 08-29 | Price list clusters by what a thing is | **Superseded** → #5005 (merged) | Owner: "single-commit rebuild, gitleaks forced it" |
| #4883 | 08-26 | Papic shot ladder 16 rungs (rebuild of #4882) | **Superseded** → #4884 (merged 08-26) | Owner comment names it |
| #4882 | 08-26 | Papic shot ladder 16 rungs (original) | **Superseded** → #4883 → #4884 | Chain confirmed |
| #4830 | 08-25 | Loading screens stop promising a deleted header | **Superseded** → #4833 (merged, landed in parallel) | Owner comment |
| #4763 | 08-24 | A refused read stops blaming somebody | **Superseded** → #4764 (merged) | Owner comment |
| #4535 | 08-22 | Unblock the put-away change | **Not missing** — "everything this branch carries is already on `main`" | Owner comment, no separate PR needed |
| #4630 | 08-20 | An unpaid order expires in 15 days | **Owner-rejected, not abandoned** — owner ruled 08-20 the 15-day-hold model is wrong for in-app orders | Owner comment quotes the ruling |
| #4475 | 08-17 | A put-away celebration still counts on the supplier record | **Superseded** → #4492 (merged) | Owner comment |
| #4413 | 08-13 | Retire the ELN cinematic homepage | **Superseded** → #4410 (merged 13 min after this branch was cut) | Owner comment |
| #4394 | 08-12 | Front-door guard rails | **Superseded** → #4396 (merged) | Owner comment |
| #4465 | 08-15 | Nine sample stories → twenty, one per event kind | **Superseded** → #4466 (merged) | Owner comment |
| #4471 | 08-17 | Vendors may write about a day they worked; host decides what shows | **UNCLEAR — possibly still missing.** Closed by owner with **no comment**. No merged PR with matching title/scope found. A related-but-narrower feature exists (`vendor-dashboard/clients/[eventId]/editorial-media/` — vendor day-of photos/clips, but gated to `selection_match_rank=1` "recommended pick" only, not any vendor on the event, and it's photos/clips not the "column"/text piece #4471 described). Not confirmed as the same work. | `git log origin/main --oneline --diff-filter=A -- 'apps/web/app/vendor-dashboard/clients/[eventId]/editorial-media/actions.ts'` → `85793a2e27 feat(editorial): vendor day-of media write path (Inc2)` — different scope |
| #4472 | 08-17 | Opening a shop no longer takes away the events you already made | **UNCLEAR — possibly still missing.** Closed by owner with **no comment**. `open-shop/actions.ts` (current `origin/main`) **still self-heals `account_type` to `'vendor'`** on shop-open — the exact mechanism this PR complained about. STATUS.md documents a *separate* 2026-08-10 fix making dashboard routing derive vendor access from `vendor_profiles` ownership rather than the `account_type` label (so the redirect-loop symptom may be moot), but whether the couple's personal-side pages/events stay reachable after the flip was not independently re-verified here. | `git grep -n "account_type" origin/main -- apps/web/app/open-shop/actions.ts` → still flips to `'vendor'`, comment calls it "self-heal" |

**Net: 16 of 18 are accounted for (superseded, already-on-main, or an explicit owner rejection —
none of that work is missing). #4471 and #4472 are the two genuine open questions from this
section** — closed silently, no confirmed equivalent landed. Worth a direct owner/engineering check
before assuming either is done.

---

## 3. Remote branches with commits not on main and no PR, updated since 2026-08-01

38 branches updated since 2026-08-01 are unmerged into `origin/main`. Six are the open-PR heads
already covered in §1 (`chat-enter-sends`, `mobile-tools-button`, `quote-pax-step`,
`thread-tool-overflow`, `bench-test-round-1`, `t1-prove-the-flow-script`). Of the remaining 32,
**29 turned out to have a PR after all** (the naive `gh pr list --search "head:<name>"` check
initially returned false "NO PR" for all 32 — the search head qualifier needs the full ref
including its prefix, e.g. `head:claude/foo`, not just `head:foo`; re-run correctly, 29 of 32
matched a closed or merged PR already listed or superseded per §2's logic, e.g.
`papic-ladder-16-rungs` → #4883 → #4884).

**Only 3 branches, updated since 2026-08-01, truly have no PR of any kind and are not merged:**

| Branch | Ahead | Last touched | Last commit subject | What it actually is |
|---|---|---|---|---|
| `claude/date-lock-grant` | 1 | 2026-08-13 | `wip(date-lock): grant events.date_forced_by_lock_of + a guard for the whole class` | **Not missing work.** Commit body says outright: *"PARKED at the owner's request — NOT shipped, no PR, nothing deploys from this."* The column it was fixing (`events.date_forced_by_lock_of`) **already exists on `origin/main`** (5 files reference it) — the real grant fix landed some other way. This branch is a dead, superseded draft. |
| `claude/encoder-actually-runs` | 1 | 2026-09-09 | `measure: every encoder stage is built and nothing calls any of them` | **A diagnostic note, not code.** Single file, `build-sessions/encoder/ENC1-RULE0.md` (62 lines), never merged. It's a measurement finding — confirms in writing what STATUS.md already says about the Encoder S-series ("actively landing, not finished... end-to-end rehearsal has not started"). Worth pulling into the final pack as corroborating evidence, not as missing code. |
| `claude/handoff-hardening` | 2 | 2026-09-08 | `docs(handoff): fix what a completeness critic caught, incl. a false-green` | **Genuinely lost work.** Fixes two real gaps in the onboarding handoff: (1) the couple account used to "prove the flow" is `is_internal=TRUE`, so completing it proves nothing about entitlements/paywalls/payment gates — exactly the false-green pattern this repo's `CLAUDE.md` warns about; (2) step-ownership in the handoff was ambiguous ("steps 1-3 are the owner's" read as "4-7 are yours"). `HANDOFF.md` on `origin/main` hasn't been touched since **2026-08-07** — a month before this branch — so these two fixes never reached the doc future sessions read first. |

---

## 4. The repo's own registers — STATUS.md and COWORK_INBOX.md

### STATUS.md (`origin/main`, self-dated "Refreshed 2026-09-09")

Spot-checked three of its own numeric/factual claims against live `gh`/code, since the file's own
banner warns "a snapshot's age is part of its content":

| Claim in STATUS.md | Spot-check | Result |
|---|---|---|
| "Dependabot: 10 open alerts today (3 high · 6 moderate · 1 low)" | `gh api repos/iscasasola/setnayan-platform/dependabot/alerts` (state=open), counted by severity | **Drifted, not stale-wrong**: now **13 open (5 high · 7 moderate · 1 low)**, two days later. Trend is worsening, not static. |
| "PayMongo is still not one of them [owner actions] — PR #3146 is CLOSED, unmerged" | `gh pr view 3146` | **Confirmed still true**: `state: CLOSED, mergedAt: null`. |
| "brand.config.ts... does not exist in the repo" | `git show origin/main:apps/web/lib/brand.config.ts` | **Confirmed**: `fatal: path does not exist`. |

STATUS.md's own "What's next" section (dated 2026-09-09) points to `WHAT_IS_LEFT.md` at the repo
root (87 claims checked, 58 survived a refute pass, 15 need the owner) as the canonical register —
**but that file is self-dated 2026-08-07**, over a month stale relative to today, written explicitly
"for a session on a different account or machine," and carries its own warning: *"A HANDOFF IS NOT
EVIDENCE. Verify every line below against shipped code and the live database before acting on it."*
Its section headers (for orientation, not re-verified line-by-line here — that's a separate,
larger effort than this sweep's scope):

1. Armed to go wrong the first time a real customer arrives (7 items, 1 owner)
2. What we've put in writing is not what the product does (7 items, 1 owner)
3. Nothing can move until you sign, or someone outside replies (4 items, 4 owner)
4. Security: one lock deep (4 items, 0 owner)
5. Half-built: reads a setting nobody can set (10 items, 2 owner)
6. Livestreaming: built, never used, shows the retired version (10 items, 3 owner)
7. Shipped, but the person who needs it can't reach it (8 items, 1 owner)
8. The public site: three calls only the owner can make (3 items, 3 owner)
9. The redesign stopped after the colours (7 items, 0 owner)
10. One story per day — the board pointed at the wrong product

Given ~890 PRs merged since the 2026-08-19 refresh alone (per STATUS.md itself), treat every count
in `WHAT_IS_LEFT.md` as a lead to re-verify, not a current fact — it predates the last month of
work entirely.

### COWORK_INBOX.md (`origin/main`)

**76 items still marked `[PENDING]`, only 3 marked `[DONE]`.** But every single `[PENDING]` header
is dated between **2026-05-14 and 2026-06-04** — none newer. This matches the file's own banner:
*"⚠ 2026-06-04 — winding down... New spec deltas now land directly in the corpus... not as
`[PENDING]` rows here. No new items are appended."* `CLAUDE.md` confirms: this file is retained
**only as a historical worklist**, superseded by the owner's 2026-06-04 direct-corpus-edit
authorization.

**These are NOT missing engineering work** — they are shipped code whose spec-corpus documentation
was never written back. Spot-checked 4 at random against `origin/main`, all confirmed the
underlying code genuinely shipped (so the [PENDING] rows are real doc-debt, not stale/wrong
claims):

- `agent_assigned_service_ids` (vendor agent RLS scoping) → present in `apps/web/tests/db/lock-handshake-wiring.db.test.ts`
- `vendor_service_agents` table → `supabase/migrations/20260816000000_vendor_service_agents.sql`
- `events.monogram_style` column → referenced across 5+ files including `app/[slug]/hub/page.tsx`
- `pickTodaysOneThing` (Home cockpit resolver) → `apps/web/lib/todays-one-thing.ts`

**Conclusion for the final pack:** COWORK_INBOX.md's 76 open items are a spec-corpus writing
backlog (owner-side documentation debt from 3+ months ago), not a code-repo "still missing" list.
If the final pack wants them, they belong in a documentation-debt section, not an engineering-gap
one.

---

## 5. Code explicitly waiting on an owner decision

`git grep -n -E "TODO\(owner\)|OWNER GATE|🔑 .*owner|owner decision|NEEDS THE OWNER" origin/main --
apps/web` returns 130 hits, but most are **historical records of decisions already made** (e.g.
"🔑 SHOWN TO A STRANGER TOO (owner 2026-08-13: 'show it')" — that's a settled ruling, not an open
gate). Filtering for language that signals the decision is still **open** narrows to these,
grouped by feature:

| Feature | File | What's blocked | Evidence |
|---|---|---|---|
| **Vendor Custom pricing tier** | `apps/web/VENDOR_TIERS_AND_BENEFITS.md:255` | The Custom-tier rate card (base ₱14,999/28d + per-location/brand add-ons) is fully specified but has **6 unsigned sign-off items** in its own §11; separately, a **seat-price conflict** between an open PR's ₱250/28d and the doc's recorded ₱500/28d for "the same owner decision" is still unresolved | Doc quote: "All numbers PROPOSED... do not publish or wire until the owner signs" |
| **Marketplace shell navigation** | `apps/web/app/(shell)/marketplace/page.tsx:18` | Whether the shell's own "Marketplace" destination row (→ `/explore`) should change now that this page describes a *different*, Studio-row marketplace entry is unresolved | Doc quote: "is an open owner decision recorded in the corpus DECISION_LOG, not made here" |
| **AI-assisted planner pricing for funerals ("wake")** | `apps/web/lib/setnayan-ai-type-pricing.ts:72` | Whether the assisted planner should even offer itself for a funeral event, and at what price tier, is unresolved — currently silently defaults to Tier C (₱499) via the unmapped-type fallback, not a considered ruling | Code comment: "Whether the assisted planner should offer itself for a funeral at all, or at a different rung, is flagged as an open owner decision" |
| **Package credit downgrades** | `apps/web/lib/package-credit.test.ts:1487` | Whether a negative per-head credit rate (i.e., a package "downgrade" that gives money back) should ever be allowed is unresolved; the engine currently hard-refuses it on both bases as a guard, not a considered feature | Code comment: "Downgrade credits remain an open owner decision" |
| **Moodboard mood-tag coverage** | `apps/web/lib/moodboard-theme-generator.ts:64,94` | `festive_celebratory` was added to the app's mood vocabulary but the generator doesn't produce it — closing the gap means regenerating **2,500 committed seed rows** (migration `20271196372720`), which the owner hasn't authorized | Code comment: "an owner decision that has not been made" |
| **In-chat change-order retirement** | `apps/web/lib/the-change-marker-is-retired.test.ts:136` | A guard test explicitly blocks anyone from un-retiring `createChangeRequestFromChat`/`counterChangeRequestFromChat` (deleted 2026-07-24 in favor of the bundled Deal) without a fresh owner sign-off | Guard's own failure message: "This is an owner decision, not a build. Get sign-off, then update this file." |
| **Compliance/DPO gates** (cross-reference, not new) | `apps/web/lib/env-flag.test.ts:402` | Confirms in code the same 3 owner-signature gates `WHAT_IS_LEFT.md` §3 names (DPO sign-off on guest-photography consent wording, CSAM-provider enrollment, the anti-fraud control's missing approval record) | Code comment names "DPO sign-off, CSAM enrolment" explicitly as compliance/owner gates |

---

## LIKELY STILL MISSING — shortlist with evidence

1. **#5405 (docs PR) is failing required CI and isn't covered by the "in-flight" exemption.**
   `typecheck + lint` fails (48m21s run); it's the one open PR in the repo that's neither moving
   nor explained. — `gh pr checks 5405`

2. **Two 08-17 owner-closed PRs (#4471 "vendors may write about a day they worked", #4472 "opening
   a shop no longer loses your events") have no confirmed successor and no closing comment.**
   #4472 in particular: the exact mechanism it complained about (`account_type` flips to `'vendor'`
   on shop-open) is still live in `open-shop/actions.ts` on `origin/main` today. — `git grep -n
   "account_type" origin/main -- apps/web/app/open-shop/actions.ts`; `gh pr view 4471/4472 --json comments`

3. **The handoff-hardening fixes (branch `claude/handoff-hardening`, 2026-09-08) never reached
   `HANDOFF.md`.** The doc every fresh session reads first still has the false-green risk this
   branch identified: an `is_internal=TRUE` test account can "prove the flow" while proving nothing
   about entitlements, paywalls, or payment gates. `HANDOFF.md` last changed 2026-08-07. —
   `git log origin/main -1 --format=%ad -- HANDOFF.md`; `git show origin/claude/handoff-hardening -1`

4. **The Encoder S-series is built but not wired together — confirmed twice over.** STATUS.md says
   so in prose; a never-merged diagnostic branch (`claude/encoder-actually-runs`, 09-09) says the
   same thing as a measured finding: "every encoder stage is built and nothing calls any of them."
   End-to-end rehearsal has not started (needs a device separate from the coding machine — an
   owner-scheduling constraint per STATUS.md and prior memory, not an engineering one).

5. **Dependabot alerts are trending worse, not flat.** 10 → 13 open alerts in two days (5 now
   high-severity, up from 3). STATUS.md flagged this as needing "another triage pass" on
   2026-09-09; it has not had one since, and the gap has widened. — `gh api
   repos/iscasasola/setnayan-platform/dependabot/alerts`

6. **Owner sign-off is the sole blocker on the Vendor Custom pricing tier** — fully spec'd, 6-item
   sign-off list untouched, plus an unreconciled ₱250-vs-₱500 seat-price conflict blocking a
   separate open PR. — `apps/web/VENDOR_TIERS_AND_BENEFITS.md:255`

7. **COWORK_INBOX.md's 76 pending rows are real but are documentation debt, not code debt** — every
   spot-checked item's underlying code already shipped; what's missing is the write-back to the
   spec corpus, which is owner/Cowork work, not engineering. Flagging here only so the final pack
   doesn't mistakenly count these as 76 open build items.

**Explicitly NOT missing (verified, don't re-flag in the final pack):** all Papic-ladder,
front-door, ELN-homepage-retirement, put-away/loading-screen, price-list-clustering, and
supplier-reception-suggestion threads from §2 — every one has a confirmed merged successor. The
15-day unpaid-order-expiry idea (#4630) was an owner *rejection*, not abandoned work — do not
resurrect it without a fresh ruling.

---

*Compiled 2026-09-11 from `origin/main` @ `9663550cb8819a295c55091831fc6fae1bbd3623`, live `gh`
data, and STATUS.md/COWORK_INBOX.md/WHAT_IS_LEFT.md as committed on `origin/main`. Section 3's
per-branch commit-ahead counts and §5's owner-gate grep were completed despite repeated background-shell
timeouts on this shared machine; where a check could not be completed reliably it is stated as such
rather than guessed.*
