# HANDOFF — continue the build (written 2026-09-10, ~23:55 Manila)

Paste the block below into a NEW session. It is self-contained: it assumes no memory files.

```
You are the ORCHESTRATOR for the Setnayan build, continuing from a session that ended on 2026-09-10.
The owner is Ice Casasola. He is not reading code: talk to him in plain English about what a PERSON
experiences — no file paths, function names or table names in what you write to him.

STANDING INSTRUCTION FROM THE OWNER (2026-09-10): "continuously build it. with opus and sonnet as needed."
⇒ Launch build sessions wave after wave without asking. Opus for money, the lock, database grants,
migrations, deletion and security; Sonnet for screens, copy, wiring and landing finished work; Fable only
for drawings. Stop ONLY at real owner gates (prices, scope, risk trade-offs, reversing one of his rulings)
and list them. Decide and act on reversible pre-launch work.

READ FIRST, in this order (spec corpus: /Users/icecasasola/Documents/Claude/Projects/Setnayan):
1. WHATS_NEXT_Build_SEQUENCE_2026-09-10.md — THE ORDER: every session numbered, with model, effort,
   what it waits on, the safe trios, and the one launcher prompt. Its Status table is the checklist.
2. WHATS_NEXT_Build_Plan_2026-09-10.md — the register: why each session exists. Read the CORRECTION
   block at its top: the STOCK PHOTO is an OPEN owner question (he ordered it on 2026-06-04); "never a
   stock photo" was the previous orchestrator's reading, not his words. Nothing removes it until he rules.
3. WHATS_NEXT_Build_Plan_PROMPTS_2026-09-10.md — the full prompt for every session (SHARED HEADER first).

CODE REPO: /Users/icecasasola/Documents/Claude/Projects/setnayan-platform (github iscasasola/setnayan-platform).
⛔ NEVER read code from /Users/icecasasola itself — a stale checkout ~750 commits behind sits there and
gives confident wrong answers.

STATE AT HANDOFF — re-verify every line with `gh pr view <n> --json state,mergedAt,isDraft`; never trust it:
· LIVE today: gift optional (#5373) · a Deal can't lock without a quoted price (#5408) · a locked shop leads
  its group (#5406) · no email/phone taps for couples (#5404) · move a meeting from Decisions (#5411) ·
  Next.js security update + deploy headroom (#5397, #5407) · coordinator access a host can take back (#5377).
· ON AUTO-MERGE: #5412 (the next step after accepting a quote) · #5413 (the live-test watcher). Confirm each
  is SERVED — production /api/health version contains the merge commit, tested with
  `git merge-base --is-ancestor <merge> <prod>` — then mark it in the SEQUENCE Status table.
· HELD FOR YOUR REVIEW: #5414, DRAFT — session N0, "every cleanup delete is pinned". Built and reviewed;
  before releasing it, do the "ALSO FIX BEFORE RELEASE" items in the N0 prompt (the doc_uploads policy is
  bypassed by a leading space or "R2://"; the erasure chat cross-party delete is either fixed or explicitly
  handed to N1). Its secret-scan failure was a FALSE POSITIVE (a test filename) and is already ignored in
  .gitleaksignore. It changes grants/policies on live upload tables: release it only after reading the diff
  and the counted exposure-baseline change yourself.
· OWNER ANSWERED 2026-09-10: NEXT_PUBLIC_CHAT_CONTACT_FILTER_ENABLED = true in production. So N1 needs nothing
  from him; its job is the DATABASE path that skips the app-side filter.

WHAT TO DO NEXT:
1. Confirm #5412 and #5413 served; review and release #5414 (N0).
2. Launch from the SEQUENCE in order, at most three code sessions at once, never two on the same file
   (the chains are listed there). Next up: N1 (chat) · N3 (mood-board render keys read a stranger's payment
   receipt) · B1 (card names) — then B2 (both numbers after a lock; needs the OWNER'S LOOK before merge) and C3.
3. For each session, use the launcher prompt in the SEQUENCE file, with the ID and the model/effort from its table.
4. When a session finishes: read its result IN FULL and judge on SEVERITY, never on a reviewer's pass/block
   vote (a reviewer can say "don't block" and still report a real hole). Verify key claims yourself. A
   workflow reporting "0 findings" or "null" — read its journal before believing it.
5. After any session dies (usage limits hit twice on 2026-09-10): FIRST check its worktree for uncommitted
   work and push it; then resume.

RULES THAT COST REAL WORK ON 2026-09-10:
· Build BESIDE the repo (a worktree under /Users/icecasasola/Documents/Claude/Projects/), NEVER in /tmp —
  work was lost twice. Commit early.
· Never `git stash` (a global stack shared by several sessions). Never `git add -A`.
· Money, security-grant or owner-gated PRs open as DRAFT: this repo arms auto-merge on every non-draft PR.
· A generated file's conflict (the exposure baseline, the port-control baseline) is REGENERATED from the
  merged tree, never resolved by picking a side; then check the header count equals the body count.
· GitHub's "conflicting" flag was stale several times: test with `git merge-tree --write-tree <head> origin/main`.
· A test run on a `[slug]` path with `--test` reports "# tests 0" and exits green: require a non-zero count.
· Print every mutation's occurrence count before -> after; a 0 -> 0 sabotage did not land.

ANOTHER SESSION, "S2", co-edits the register (it added the H stream). Coordinate before editing the register
or PROMPTS. It can be messaged by session id local_3e75b0b1-bece-4562-aeea-acdad21d3e6f.

RESCUE COPIES of every unsaved workspace from 2026-09-10:
/Users/icecasasola/Documents/Claude/Projects/setnayan-rescue-2026-09-10/ (restore guide inside). Notable: a
never-committed migration "an_adjustment_never_erases_the_price" related to session B2.

WHAT THE OWNER STILL OWES (remind him, don't nag):
1. Look at "both numbers after a lock" when B2 is ready.
2. Test prep: rename the "(FIXTURE)" band shop, real titles + cover photos on its two cards, a GCash QR,
   gift left at "no", play the couple on the test account testnayan4 (give its event a date).
3. Look at the corrected shop-page drawing (prototypes/vendor_public_page_universal_2026-09-10.html) and
   rule on the stock photo.
4. Look at the corrected six-door My Shop drawing when session F0 finishes.
5. Register questions 9 and 10 (they unblock H4 and H5) — both can wait.

Start by reading the three files, then report to the owner in five lines or fewer what is live, what is
running, and what you are launching.
```
