# Step 7 — Story — the prints carry the arrangement

**Model:** Sonnet 5 · **Effort:** medium · **Starts:** after steps 2 and 5

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

FOR THIS STEP ALSO:
- THE DESIGN: ~/Documents/Claude/Projects/Setnayan/prototypes/story_make_it_yours_2026-09-10.html
  (owner-approved 2026-09-10) and the DECISION_LOG.md rows dated 2026-09-10 about it (the 🧩 row,
  the stickers-off row, the toolbar row). ⛔ NO STICKERS — owner, "for now".
- DRIVE IT IN A REAL BROWSER BEFORE CALLING IT DONE. Testing the prototype found 61 defects in
  round 1 and ~40 more in round 3 that reading the code could not see. Playwright is installed:
  node_modules/.pnpm/playwright@1.60.0/node_modules/playwright. Every item in
  Design_Editorial_By_The_Minute_2026-09-07/10a_MAKE_IT_YOURS_TEST_PLAN_2026-09-10.md that touches
  your step must be re-driven against the app.
- Test paywalls and entitlements on a testnayan account, NEVER the owner's (it is internal and every
  gate silently passes) — see TEST_SCRIPT_E2E_2026-07-27.md.

---

YOUR STEP:

GOAL: the A3 keepsake and the A4 booklet print each hand-arranged moment exactly as the host laid it
out; Automatic moments print as today.
REUSE step 5's sheet render (never a second renderer) and step 2's A4 seam. The edition stamp, the
QR and S14's taken-back rules apply unchanged.
DONE WHEN: print-to-PDF of a celebration with one hand-arranged moment matches the on-screen sheet,
and a test fails if a taken-back photo reaches a printed page.
