---
name: setnayan-local-ci-parity-traps
description: "Traps when reproducing setnayan CI locally — a clean root `pnpm lint` does NOT mean the typecheck+lint job passes (34 further blocking guards run separately, most with working-directory apps/web); root lint also hides its one Error above a tail of warnings; suites run 5x slower when other sessions share the Mac; a `never` closure must be a function declaration (TS2534); and per-FILE test runs miss every repo-wide guard, while grep on a [bracketed] path silently finds nothing"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: ce9a5854-bbd1-4e5f-aa6a-74b5924aed55
  modified: 2026-09-10T22:19:10.714Z
---

Measured 2026-09-05 (G4, PR claude/vendor-deals-cohort-windows):

- **CI's lint step is the ROOT `pnpm lint` (= `turbo run lint`)**, not `apps/web`'s `next lint`.
  Both print the same warnings, but the ONE real `Error:` line (a raw `<a href="/admin/…">`
  that must be `<Link>`) sat above four pre-existing warnings, so `tail` showed only warnings
  and the exit code looked like noise. Grep the output for `Error:` before deciding it is
  pre-existing.
- **Full suites are not 6 / 25 min when other sessions are running theirs.** With wt-w1 and
  wt-s8-stream-key also running `tsx --test`, unit took ~34 min and db 40+ min. A quiet
  output file for 15 min is NOT a hang — check `ps` for fresh child pids before killing.
- **TS2534 on a `never`-returning closure**: `const back = (...): never => backTo(...)` and
  the block-bodied arrow both fail; only a nested `function back(...): never { backTo(...); }`
  is credited as terminating. Same shape as the module-level `backWith` that already compiled.

Added 2026-09-09 (S5, the story desk, PR #5338 — both cost a CI round-trip):

- **RUNNING TESTS FILE BY FILE MISSES EVERY REPO-WIDE GUARD, and those are the ones that find
  real bugs.** Per-file runs were all green; the full `pnpm test:unit` failed on three
  whole-repo scanners at once — `select-column-scan` T1/T23 and `reads-are-honest`. T1 caught a
  select naming **`guests.full_name`, a column that does not exist** (the columns are
  `display_name` / `first_name` / `last_name`): PostgREST fails the WHOLE query with `42703`,
  so `data` is null and `?? []` renders it as "none" — **every byline would have been null
  forever, with nothing thrown**. T1 could only see it once `.from(variableTable)` was replaced
  with literals, because an unresolvable table name is a select T1 cannot check.
- **`grep` ON A PATH CONTAINING `[brackets]` SILENTLY RETURNS NOTHING** — this machine's `grep`
  is `ugrep`, which reads `[slug]` as a character class even when the argument is quoted. It
  reported 0 occurrences of strings that were definitely in `app/[slug]/…/data.ts`, which reads
  exactly like "my merge deleted my changes". Same family as the `tsx --test` bracket trap in
  [[setnayan-full-tsc-oom-when-concurrent]], and a fresh instance of *a search that cannot
  match is not a negative result*. Read such files with `python3` (or `cd` into the directory
  and pass a bare filename) before believing an absence.

Added 2026-09-09 (S6, the Story Maker, PR #5346 — cost a CI round-trip):

- **🔴 A CLEAN ROOT `pnpm lint` SAYS NOTHING ABOUT THE `typecheck + lint` JOB PASSING.** That job
  additionally runs **34 separate blocking guard scripts** (`.github/workflows/ci.yml`, each a
  `continue-on-error` step collected by a final "Every blocking guard must pass"), and NONE of
  them is part of `pnpm lint`. Root lint was clean and `lint radius tokens` still failed the PR.
  Extract and run them all before pushing:
  `grep -E "^\s+run: .*scripts/.*\.mjs" .github/workflows/ci.yml`.
  ⚠ **Honour each step's `working-directory:`** — most are `apps/web`, so the same `run:` line
  fails with `MODULE_NOT_FOUND` from the repo root, which reads exactly like a real guard
  failure. That is *a command that cannot run is not a failing check* — the same family as the
  bracket traps above.
- **`lint-radius.mjs` reads the RAW SOURCE and does NOT use `lib/strip-comments.ts`**, so it
  fails on an ad-hoc pixel radius written inside a COMMENT — including a comment explaining why
  the pixel value was replaced. Describe such a value in words, never in the literal class form.
  (Repo rule is "one comment stripper"; this guard predates or bypasses it.)
- **A prototype's literal value loses to an owner-locked token scale.** The by-the-minute
  prototype draws a ten-pixel corner; "softer corners" (2026-06-20) locks radii to
  4 · 8 · 14 · 22 · 36. Port the SHAPE, tokenise the number, and record the departure — a port
  is not faithful when it reproduces something a lock forbids.

**Why:** the G4 brief said the last two PRs each cost two CI round-trips because local checks
were a subset of CI's; these would each have cost one more.

**How to apply:** run root `pnpm lint` and grep `Error:`; then run all 34 blocking guards from
`ci.yml`, each from its own `working-directory`; run the FULL `pnpm test:unit` and
`pnpm test:db` before pushing, never a per-file subset; budget 40+ min for the two suites and
don't run tsc concurrently with them (see [[setnayan-full-tsc-oom-when-concurrent]]); write
nested function declarations for redirect-wrapping helpers; never conclude "not found" from a
grep whose path contains brackets.

Added 2026-09-09 (S10, the light + the room, PRs #5349 / #5352):

- **🔴 A FRESH `git worktree` HAS NO `node_modules`, AND `tsc` THERE IS NOT A TYPECHECK.**
  `git worktree add` checks out source only. `npx tsc` still *runs* — it resolves TypeScript
  from a stray `~/node_modules` — and it produced an **empty log** for 20 minutes with no
  `react`, no `next` and no path aliases loaded. An empty tsc log reads exactly like a clean
  one.
  🔴 **IT HAS TWO FACES AND BOTH ARE MISLEADING — I HIT THIS TWICE IN ONE SESSION, the second
  time on two fresh worktrees AFTER writing this note.** Sometimes it hangs and writes nothing
  (looks clean); sometimes it emits **~90,000** `TS2307: Cannot find module 'react'` /
  `TS7026: JSX element implicitly has type 'any'` lines (looks like a catastrophe you caused).
  Neither says anything about your code. **The tell is `TS2307` on `react`/`next` — if the
  framework itself is "missing", the environment is missing, not your change.** Check
  `[ -d apps/web/node_modules ]` FIRST, before reading a single error line.
  ⚠ **Small changes are exactly when it bites**, because a one-line edit does not feel like it
  needs a real check — and CI then catches something a working `tsc` would have caught in
  seconds (a `number[] as Rgb` cast, TS2352). `npx tsx --test` misleads the same way: it happily runs pure `lib/` tests, so the suite
  looks healthy while nothing that imports the framework has been checked at all. **Run
  `pnpm install --frozen-lockfile` in the worktree first** (~3 min, ~1.4 GB) and confirm
  `apps/web/node_modules` exists before believing any local check. Same family as the bracket
  traps: *a check that cannot run is not a passing check.*
- **The Mac can be saturated past the point where any local typecheck is trustworthy.** Measured
  this session: **load average 183**, with ~18 concurrent `tsc` processes from other sessions'
  worktrees. Three of my runs were killed at exit 144 without ever writing a result, and
  `next dev` sat on one route for 25+ minutes. Check `uptime` before starting a long local
  check — over ~50 it is not worth beginning. **Push and let CI decide instead**: `typecheck +
  lint` and `production build` are required checks and run on unloaded hardware, and a failure
  pauses auto-merge rather than merging something broken.
- ⚠ **`.prettierrc` names `prettier-plugin-tailwindcss`, which is installed NOWHERE** (not at
  the root, not in `apps/web`), so `npx prettier --write` dies on every file. Formatting is not
  a CI check, so this is invisible until you try. Use `--no-config` with the repo's options
  spelled out (`--semi --single-quote --trailing-comma all --print-width 100 --tab-width 2
  --arrow-parens always`); you only lose class sorting.
- **Auto-merge fires the moment the last required check goes green** — often while you are still
  working. #5349 merged mid-session; a follow-up ruling had to become its own PR. If more edits
  are coming, finish them before `gh pr create`, not after.

Added 2026-09-11 (step 4 "Make it yours", PR #5430 — one CI round-trip, the radius guard AGAIN):

- **Copy CI's `run:` line WHOLE, env prefix included.** I looped `node scripts/lint-*.mjs` and
  checked exit codes: all 0. CI runs `RADIUS_LINT_STRICT=1 node …lint-radius.mjs`; without the
  env the guard only PRINTS its finding and exits 0 — an exit code that could not fail. A new
  `.module.css` ported from a prototype is the likely trigger (the prototype's px corners).
  `grep -B2 -A3 "scripts/lint-" .github/workflows/ci.yml` shows each step's env.

Added 2026-09-10 (#5409/#5410 — cost two CI round-trips despite this note):

- **I ran root lint + the full suite and skipped the guard list again.** The list is now 36
  entries, extracted by walking `ci.yml` steps with their `working-directory` (python split on
  `- name:`). Includes three `node --test scripts/*.test.mjs` and `lint-exposure-baseline.mjs`.
- **A clean merge can still fail `lint exposure baseline`.** Main and my branch each added ONE
  column fact; git merged the two lines without a conflict and kept one side's header
  (6616), so the merged body (6617) no longer matched. CI lints the PR MERGED INTO MAIN, so it
  fails even though the branch alone is valid. Before pushing a branch that touched the
  baseline, merge origin/main and recount the header from the body — see
  [[setnayan-guard-count-headers-are-merge-conflicts]].
