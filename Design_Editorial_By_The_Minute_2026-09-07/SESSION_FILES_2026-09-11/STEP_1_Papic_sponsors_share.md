# Step 1 — Papic — sponsors get a bigger share

**Model:** Opus 5 · **Effort:** high · **Starts:** now

Upload this file to a new session, or paste everything below the line.

---

Read /Users/icecasasola/CLAUDE.md and ~/Documents/Claude/Projects/Setnayan/CLAUDE.md first,
then this folder: ~/Documents/Claude/Projects/Setnayan/Design_Editorial_By_The_Minute_2026-09-07/
  00_BUILD_README.md · 01_The_Story.md · 02_The_Story_Maker.md · 03_Data_Requirements.md
  04_Consent_And_Privacy.md · 05_Occasions_Registers_MultiDay.md · 06_Supplier_Tiers.md
  07_Open_Questions.md · 08_Build_Order.md · 10_WHAT_IS_LEFT_SESSIONS_2026-09-10.md
The prototypes are the DESIGN, not decoration. Open them. PORT THEM, NEVER REDRAW THEM — a delta
between your screen and the prototype is a defect in the port, not a fresh design decision.

RULES THAT OVERRIDE YOUR DEFAULTS:
- RULE 0 — FIND IT BEFORE YOU BUILD IT. This project is ~2 years old. Assume what you are asked
  for already exists and your job is to locate and extend it. The "already ships" lines below were
  measured on 2026-09-10 — confirm them against origin/main before changing anything.
- A DOCUMENT IS NOT EVIDENCE — including this file. Verify against shipped code and the live
  production database before acting.
- A rejected query is not a thrown error. A phantom column, enum value, function argument, a
  missing grant or a blocked iframe all fail the same way: the only symptom is an absence.
- SERVICE-ROLE READS ARE OUTSIDE EVERY RLS RULE. /[slug] renders with an admin client, so the
  app-side gate is the whole fence there. Authorization may use the service role scoped by a
  session-proved id; EVENT CONTENT NEVER DOES.
- Branch FIRST, then `git worktree add` beside the repo (never /tmp, never the shared checkout).
  Commit before your first mutation run. Prune the worktree the moment your PR merges.
- Add a changelog fragment in changelog.d/. Do NOT edit CHANGELOG.md or STATUS.md.
- `gh pr merge <PR#> --auto --merge` immediately after `gh pr create`. Standing default.
- After merge, VERIFY THE CHANGE REACHED PRODUCTION BY QUERYING THE OBJECT — not
  schema_migrations, not a migration comment. Prod deploys have silently stopped migrating.
- A guard must be able to FAIL. Sabotage the thing it protects and PRINT THE OCCURRENCE COUNT
  before and after; an unmeasured mutation proves nothing. Assume one of your guards is decoration.
- Require `# tests` to be NON-ZERO before believing any pass. `npx tsx --test` on a path containing
  [brackets] runs zero tests and exits 0. So does a typo'd path.
- Print TSC_EXIT beside ERROR_LINES. An empty tsc log is not a clean one.
- Reply to the owner in plain English: what a PERSON experiences. No file paths, function names,
  table names, SQL or flag names in your answer to him.
- When you finish, update this step's row in 10_WHAT_IS_LEFT_SESSIONS_2026-09-10.md (PR number,
  merged, verified in prod) in the same corpus commit as your DECISION_LOG row.

---

YOUR STEP:

GOAL: on a celebration with sponsors, a sponsor's guests start with a bigger share of shots by
default — the owner's 2026-08-29 addition.
READ FIRST: WHATS_NEXT_Papic_Items_3_7_HANDOFF_2026-08-29.md § 3 ("One addition made 2026-08-29:
sponsors default to a bigger share") and WHATS_NEXT_Shots_Per_Guest_2026-08-28.md.
ALREADY SHIPS — DO NOT REBUILD (read out of prod 2026-09-10): the per-guest ceiling is LIVE.
papic_record_guest_capture asks papic_guest_spend_ceiling() first (named · equal share · release);
a guest's own purchase is exempt. PRs #5014 #5017 #5019 #5024 #5028 #5034 #5052. Missing: nothing in
Papic knows about sponsors (lib/event-sponsors.ts is imported by nothing in Papic).
DELTA: a sponsor guest's default share is larger, derived at spend time inside
papic_guest_spend_ceiling (a named guest's own number still wins; release still applies). Show it
where the couple sets the numbers and on the guest's counter.
TRAPS: CREATE OR REPLACE is a time machine — start from prod's live body (pg_get_functiondef), never
an old migration, or you silently revert #5052 and #5034. Prove the ceiling BINDS on a real pool event.
DONE WHEN: a sponsor guest's ceiling beats a plain guest's on the same event, proven by a db test
that fails when the sponsor arm is removed; migration verified in prod by the object.
