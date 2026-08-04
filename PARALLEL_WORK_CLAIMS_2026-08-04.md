# PARALLEL WORK — the claim register

**Date opened:** 2026-08-04 · **Purpose:** let several sessions run at once without building the same thing twice.

> ## 🚨 READ THIS FIRST — WHY THIS FILE EXISTS
>
> On 2026-08-04 **two sessions built the identical slice seven minutes apart** (#4082 and #4083).
> Both were armed to auto-merge. One would have reverted the other's money fix. It was caught by
> luck, not by process.
>
> **The lesson, and the reason a claim register is the fix:**
> **AUTHORSHIP CANNOT DISTINGUISH SESSIONS.** Every session pushes as the owner's GitHub account,
> so `gh pr list` shows one author for all of them. **Only the BRANCH NAME identifies who did what.**
> A third session's PR was invisible to the session-listing tool entirely.
>
> ## THE FOUR RULES — every session, no exceptions
>
> 1. **CLAIM BEFORE YOU BUILD.** Add your session + branch to the table below and commit that line
>    *before* writing code. One commit, ten seconds. An unclaimed stream is fair game for anyone.
> 2. **CHECK `gh pr list` AND RECENT BRANCHES FIRST** —
>    `git for-each-ref --sort=-committerdate --format='%(committerdate:relative) %(refname:short)' refs/remotes/origin | head -20`.
>    A branch pushed in the last hour with no PR is someone mid-flight, not abandoned work.
> 3. **NEVER TOUCH ANOTHER STREAM'S OWNED FILES.** If you must, say so on the PR and in a message
>    to that session *before* branching.
> 4. **VERIFY BEFORE ARMING AUTO-MERGE, AND COUNT THE CHECKS.** A normal PR here runs **~25 checks**.
>    If yours shows 3, CI did not fire — a branch pushed by another session often does not trigger the
>    suite when a PR is opened over it. **Armed ≠ will merge**, and armed-with-no-CI is how a
>    regression lands.

---

## Streams — claim a row before starting

| # | Stream | Owns these files | Needs owner? | Claimed by |
|---|---|---|---|---|
| **S1** | **Empty / not-allowed screens — the SAFE four + guest list** | the 4 single-arm surfaces, the guests read helper, a new per-table permission map | no | *(unclaimed)* |
| **S2** | ~~Two small security holes~~ ✅ **DONE — PR #4087** | — | no | *(complete)* |
| **S3** | **"Download my data" gap — 90 tables** | `lib/export-*`, the export guardrail | no | *(unclaimed)* |
| **S4** | **Rebase + land the guest-site nav PR (#4086)** | `app/[slug]/_components/*`, `_lib/site-nav.ts` | no | *(unclaimed)* |
| **S5** | **3D room: every guest shows as "Guest"** | the shared-room presence path | no | *(unclaimed)* |
| **S6** | **Vendor verification uploads don't sweep what they replace** | the vendor verification upload call site | no | *(unclaimed)* |
| **S7** | **PR-H — the vendor-agrees step** | `event_vendors` migration, both dashboards, 3 lock sites | ✅ **all 4 answered** | **REASSIGNED by the owner 2026-08-04** (*"PR-H was not done there. can we do it here instead?"*) — moved OFF the `Explore_Replan_BUILD_SPEC_2026-07-27.md` session. Spec now carries the answers; **build still not started** (14 HIGH plan defects open — see §9). |
| **S8** | **Design port** — 12 archetypes + 7 overlays across ~40 screen families | app-wide UI | ✅ **APPROVED 2026-08-04 — all 19, no changes** | *(unclaimed — the biggest stream on the board)* |

---

## ⛔ DO NOT BUILD — settled today, with reasons

- **A guard on `event_vendors.status`.** Refuted at the premise (the owner's rule forbids repurposing
  that column, so its meaning is not changing) and it would break booking on day one — **seven**
  legitimate couple-facing writers set a confirmed status as `authenticated`. It also deletes a
  package booking on rollback, is bypassed by a couple-callable SECURITY DEFINER lane, and with the
  deposit flow on could leave a couple **paid with no booking**. Prod has **zero** forged rows.
  → Ship it as PR-H's LAST commit, keyed on the vendor's real stamp. Full reasoning:
  `Six_State_Mount_and_Forgery_Guard_SCOPE_2026-08-04.md`.
- **Converting the other four empty-state surfaces.** The resolver has no partial-permission concept
  and `denied` outranks `count`, so on a multi-arm policy it would **hide rows the reader is entitled
  to see** — worse than the bug being fixed.
- **Anything under `/budget`.** Mid-flight in the flag-dark BUD stream; it shipped twice today.

## 🪤 Traps that cost time today

- **A handoff is evidence, not truth.** Verifying the 20-item register found **7 items already done
  or never true** — including "a real couple could be charged the booking fee", which was false twice
  over (the bill is always addressed to the vendor, and nothing can bill at all yet).
- **The local checkout was 99 commits behind.** Searching it reported shipped features as missing —
  the exact mistake that made the owner pay twice for one page. `git fetch && git merge --ff-only`
  before believing any search.
- **Read the LIVE function, never the migration text.** They have diverged. Copying a migration file
  forward silently reverted a shipped bug fix — caught only by reading `pg_get_functiondef` from prod.
- **Facts survive, consequences get invented.** A billing claim built on three individually-true
  facts was wrong because the guard sat one layer below where the trace stopped. **Trace to the
  bottom layer that could refuse before naming a consequence.**

---

## Who owns `Explore_Replan_BUILD_SPEC_2026-07-27.md`

**One session owns that whole spec** and has shipped from it today: **BUD-2** (#4079), **BUD-3** (#4080)
and **PR-I** (#4083), plus the **PR-H design + adversarial review**. PR-H stays with it — assigned by
the owner 2026-08-04 on the reasoning that it is the session already holding the context.

⚠ **PR-H HAS SINCE BEEN MOVED OFF THAT SESSION** by the owner (2026-08-04) — see the S7 row. The rest
of this section still stands.

⚠ **PR-H is NOT the last unbuilt slice in that file.** Also still open there: **PR-G2** (the hard
grey-out tier), **PR-J** (found-you attribution + the dispute ladder), and **BUD-4 … BUD-10** of the
budget programme (§18.6 — BUD-1/2/3 are done, 4 onward are not). Worth knowing before anyone treats
the spec as finished when PR-H lands.
