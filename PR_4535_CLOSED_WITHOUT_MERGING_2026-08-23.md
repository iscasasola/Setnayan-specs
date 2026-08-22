# PR #4535 — CLOSED WITHOUT MERGING (2026-08-23)

> **Do not reopen it, do not rebase it, and do not cherry-pick from it.** Everything it was
> genuinely carrying is already on `main`, and `main`'s version of the one non-trivial piece is
> **measurably better**. This file exists so nobody re-derives that.

## What it looked like

`fix(events): unblock the put-away change, and close a guard the merge left decorative` ·
branch `claude/archive-has-a-button-fix` · opened 2026-08-18, untouched since ·
**507 files · +29,246 / −7,376 · 15 migrations.**

## Why that size was an illusion — and why it was dangerous

The branch is **one commit (`05914464d`) whose single parent is `c8823bec`, a `main` snapshot from
2026-08-18.** It is not a merge commit; it is a *flattened* merge of that day's `main` into a
feature branch. So every one of those 507 files and 15 migrations is **`main`'s own work of five
days ago, replayed**.

`origin/main` is now `c984e0caf` — roughly 200 commits further on. Merging #4535 would have
re-laid a 2026-08-18 tree over all of it.

🔑 **This is the exact shape of the 2026-08-21 incident** — the merge that deleted 24 files,
reverted 42, and stopped production deploying for a day. A file the branch never re-touched merges
**cleanly, in favour of the stale side**. Git reports no conflict, because only one side changed it.

**Measured before closing:** all 15 migrations (`20271142658298_repeat_cadence` through
`20271148681647_revoke_anon_unreachable_batch4`) are present on `main` **by filename, checked one
at a time — 0 missing.**

## What it was genuinely carrying — both already on main

The commit message names exactly two real fixes. Neither is missing:

1. **`table: 'events'` on the `archived` switch register entry.** Already on `main` at
   `apps/web/lib/gates-have-handles.test.ts:156`, with a comment that records the history
   explicitly: *"Table-scoping landed on main independently (`gateWritersOf`); this entry is the
   instance it was next asked to hold."* `archived` exists on both `events` and `communities`, and
   a table-blind detector had called it written for two years while nothing wrote `events.archived`.

2. **A confined span for the chain-anchored write assertion.** Already on `main` at
   `apps/web/lib/gate-writers.ts:250-275` — **and `main` went further and proved #4535's version
   wrong.** #4535 narrowed `[\s\S]{0,600}` to `[^}]{0,400}`. `main` measured that correction and
   recorded it: it stops at the **first** `}`, which any nested object or closure in the payload
   supplies early — **41 columns flagged against the older form's 31, a strict superset, ten real
   writers silently lost.** `main` replaced it with a span bounded by the update call's own
   parentheses, which the syntax guarantees, and additionally handles the ternary-payload case
   (`.update(cond ? {a} : {b})`) that brace-matching misses.

   ⚠ So merging #4535 would have **regressed a guard**, not restored one.

The archive feature itself (*"Put this away"* / *"Bring it back"*) shipped on `main` on 2026-08-16;
`changelog.d/archive-has-a-button.md` is on `main` already. The only thing #4535 added to that
fragment was a note *about its own merge resolution*.

## The transferable rule

🔑 **A one-commit branch with a five-figure diff is a stale snapshot, not a large feature.** Check
`git rev-list --parents -n1 <tip>` first. If the parent is an old `main` commit and the diff is
enormous, the size is the age, and the correct question is not *"how do I merge this?"* but
*"what does it carry that main lacks?"* — answered by grepping `main` for the fix the commit
message names, never by reading the diff.

SPEC IMPACT: None — no code, schema or product change. Register hygiene only.
