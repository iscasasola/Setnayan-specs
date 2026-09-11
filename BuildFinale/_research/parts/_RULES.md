# Shared rules for every research sub-agent (READ-ONLY sweep for the Setnayan "BuildFinale" pack)

CONTEXT: The owner wants a final pack documenting EVERYTHING still missing from the product. The orchestrator
ALREADY OWNS the current build plan: /Users/icecasasola/Documents/Claude/Projects/Setnayan/WHATS_NEXT_Build_SEQUENCE_2026-09-10.md
(bundles D1->F1->F2 "new shop page", G1->G3 "six-door My Shop", TEST ROUND 1/2 and its findings list, and the small
follow-ups "gift snapshot at lock" and "vendor-date-demand precision"). Do NOT re-list those. Your job is everything ELSE
in your assigned slice that is still open, VERIFIED against code.

WHERE
- Spec corpus (read files directly, it is fine): /Users/icecasasola/Documents/Claude/Projects/Setnayan/
- Code repo: /Users/icecasasola/Documents/Claude/Projects/setnayan-platform — read code ONLY through git against origin/main
  (already fetched; tip 9663550cb, 2026-09-11):
    git -C /Users/icecasasola/Documents/Claude/Projects/setnayan-platform grep -n "<pattern>" origin/main -- apps/web/lib apps/web/app
    git -C /Users/icecasasola/Documents/Claude/Projects/setnayan-platform show origin/main:<path>
    git -C /Users/icecasasola/Documents/Claude/Projects/setnayan-platform log origin/main --oneline -- <path>
  For paths containing [brackets] add `--literal-pathspecs` right after `git`:  git --literal-pathspecs -C <repo> show 'origin/main:apps/web/app/[slug]/recap/page.tsx'
  NEVER read the platform working tree (other sessions switch it). NEVER read code from /Users/icecasasola itself (stale checkout).
  Use /usr/bin/grep (the bare `grep` is a wrapper that can silently return nothing). Never use `2>/dev/null` on a git show
  whose failure you would then read as "absent" — check the exit code instead.
- Memory notes (LEADS, not evidence): /Users/icecasasola/.claude/projects/-Users-icecasasola/memory/*.md
- DECISION_LOG.md in the corpus is ~3,900 very long lines; never Read it whole. Grep it and print only the matching rows'
  first ~600 chars, e.g.:  /usr/bin/grep -n "pattern" DECISION_LOG.md | cut -c1-600
  Later rows (bottom of file) supersede earlier ones. Rows dated 2026-09-10 and 2026-09-11 are at lines ~3830-3891.
- Do NOT modify any existing file, do not commit, do not push, do not open PRs, do not run the app, do not touch prod or Vercel.
  The ONLY file you may create is your own part file named in your task.

EVIDENCE STANDARD
- Never state something is missing without a code grep (on origin/main) showing it isn't there — grep for the STORE
  (table/column/migration) AND the UI/route, not just a PR title or branch name. Quote the grep you ran in the Evidence cell
  when claiming absence (e.g. `git grep -n "updater" origin/main -- apps/desktop` → 0 hits).
- When claiming presence, cite file path + line (from git grep -n on origin/main) or a merge commit / PR number.
- A register's "remaining" claim is NOT evidence; a handoff is NOT evidence. Registers go stale in hours.
- If you cannot settle it, mark it UNVERIFIED and say exactly why.

STATE vocabulary (use exactly one per row):
  NOT STARTED · PARTLY BUILT · BUILT-NOT-LIVE (merged/built but behind an OFF flag, a draft PR, or not deployed) ·
  BLOCKED ON OWNER · BLOCKED ON DEVICE · UNVERIFIED
  (Items that are fully done go to the SUPERSEDED / ALREADY DONE section, not the tables.)

OUTPUT FILE FORMAT (markdown) — exactly these four H2 headings, in this order, so they can be merged by script:

## WORKSTREAM: <name>
(one or more; each gets a short 2-4 line intro naming its plan doc(s) and whether they are current or superseded, then a table)
| Item | What a person would get (plain English) | State | Evidence | What's needed to finish | Owner question (if any) + choices the docs already list |
|---|---|---|---|---|---|

## OPEN OWNER QUESTIONS
- Each still-open question VERBATIM (quote the doc's own words), then — Source: <absolute file path>:<line>. Then "Checked
  DECISION_LOG: <what you grepped> → no ruling" (or the row date if partially ruled). Include the choices the doc lists.

## SUPERSEDED / ALREADY DONE
- Items that a register still lists as open but the code/decision log shows done or retired, with evidence (commit/PR/file:line
  or DECISION_LOG row date), so the pack does not re-list them.

## FILES THE PACK SHOULD INCLUDE
- Absolute paths of source docs, prototypes/drawings, plan files a future builder needs, one per line with a 5-10 word note.

Be exact and concise in cells (no essays). Plain English in the "What a person would get" column (what a couple/supplier/
guest/admin actually sees). When done, reply with a SHORT summary (counts per State, the 3-5 most important open items)
— the full content lives in your part file.
