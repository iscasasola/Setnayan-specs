---
name: setnayan-full-tsc-oom-when-concurrent
description: "On this Mac exit 144 + an empty log means a run was KILLED, not passed — applies to full tsc AND to concurrent tsx --test suites; run suites serially, and never read a background output file before it has flushed"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0c2ad91d-67d2-4ff7-9128-605e73f22fc4
  modified: 2026-09-05T02:22:04.987Z
---

In `setnayan-platform/apps/web`, a full-project typecheck (`pnpm typecheck`, which sets
`NODE_OPTIONS=--max-old-space-size=7168`) was killed three times in a row on 2026-09-05 with
**exit code 144 and an empty log** — even with the heap flag — while another Claude session was
running its own `tsc` from a `/tmp/wt-*` worktree. Zero errors logged + no exit line means
*killed*, not *passed*; do not report it as a pass.

**Why:** two concurrent multi-GB `tsc` processes exhaust memory; the harness's background job
dies before tsc finishes. Multiple sessions on this machine share worktrees under `/tmp/wt-*`
(check with `pgrep -fl "typescript/bin/tsc"`).

**How to apply:** for a change confined to one route, typecheck just its import graph — a temp
tsconfig extending `apps/web/tsconfig.json` with `"include": []` and
`"files": ["<the page>", "next-env.d.ts"]`, run with the same heap flag, then delete it. That
completed cleanly in minutes and is conclusive for the touched file. Also: `next lint --file
<path>` is the real CI linter (there is no flat `eslint.config.*`; bare `npx eslint` errors out).

🛑 **ORDER THE RUN AFTER YOUR LAST EDIT, AND END IT WITH A SENTINEL.** On
2026-09-05 a scoped tsc was launched, then the file was edited while it ran, and
its `exit=0` was reported as verification — of code the run never saw. CI then
failed on exactly that edit (`error TS2345` from `noUncheckedIndexedAccess`:
`src[i]` is `string | undefined`, so `RegExp.test(src[i])` will not compile —
use `src.charAt(i)`). Re-run tsc as the LAST thing before committing, and make
the command print a literal sentinel (`echo SENTINEL_DONE`) so a truncated or
empty output file can never be mistaken for a pass.

**Two more traps in that recipe, both hit 2026-09-05:** write the temp tsconfig *inside*
`apps/web/` — from `/tmp` it fails `TS2688: Cannot find type definition file for 'node'`
because typeRoots resolve relative to the config, not to `baseUrl`. And it still takes
**over 120s**, so run it with `run_in_background` and read the output file; a foreground
call is moved to the background mid-run and the exit code is easy to lose. Confirm success
by the literal `exit=0` you echoed, not by empty grep output.

A fresh `git worktree` has **no `node_modules`** — symlink the main checkout's
`node_modules` and `apps/web/node_modules` in (deps are identical when `pnpm-lock.yaml`
matches), run `tsx`/`tsc` from the main checkout's `.bin`, then `rm` the symlinks before
`git add -A`. Run `tsx --test` from `apps/web`, and note `[eventId]` in a path is a glob
character class: `tsx --test "app/dashboard/*/guests/_components/*.test.ts"` matches, the
literal bracketed path silently matches **zero** files and reports `# tests 0` as success.

## 2026-09-06 (RV2, PR #5273) — the same kill hits TEST SUITES, and two new ways to misread it

**It is not only `tsc`.** With 17 peer sessions on this Mac the load hit **72**, and
**five concurrent `tsx --test` runs all died at once with exit 144 and 24-byte
outputs**. Suites are as OOM-prone as tsc. Run them **strictly one at a time**;
`uptime` before starting is worth the second it costs.

🪤 **A 24-BYTE OUTPUT FILE IS NOT PROOF OF A KILL — IT MAY NOT HAVE FLUSHED YET.**
I read three of those five files, saw only `[exited with code 144]`, and reported
all five as killed. Two had in fact **completed and passed** (a db test 7/7 and
both Ugat guards 6/6); their TAP output landed in the file *after* the harness
wrote the exit line. **Re-read the file before concluding either way**, and treat
"exit 144" and "no totals" as two separate facts: only *both together* mean
killed. Grep for `^# fail` / `^# pass`, not for the exit code.

🪤 **A STALE BACKGROUND JOB'S TRAILING COMMAND CAN REWRITE A FILE UNDER A LATER
RUN.** A sabotage job that had been "moved to the background" on timeout was
still alive; when it finally finished it executed its trailing
`cp <backup> <source>` — restoring the file **in the middle of a second job's
test of a second sabotage**. The result came from a tree that changed underneath
it and was worthless. **Never leave a restore inside a long-running background
command**: sabotage, run, and restore as separate foreground steps, and
`git status` between them. `TaskStop` the old job before starting a new one that
touches the same file.

✅ **What a monitor must distinguish.** "Finished green" and "died without
finishing" both look like silence. Give the watcher an explicit second branch:
```
if grep -qE "^# fail" LOG; then echo "TOTALS: ..."; 
elif grep -q "^EXIT=" TASKFILE; then echo "ENDED WITHOUT TOTALS — killed, not passed"; fi
```
See [[setnayan-guards-must-test-the-claim]] — silence is not success there either.

## 2026-09-08 (S3, PR #5331) — exit **134** is a different kill, and the bracket workaround does not work

🪤 **EXIT 134 ≠ EXIT 144, AND ITS LOG IS NOT EMPTY.** A fresh worktree's full
`npx tsc --noEmit` died at **134** with a **104-line** log — a real V8
`FATAL ERROR: Ineffective mark-compacts near heap limit` stack, at the **4 GB
default**. Cause: `npx tsc` directly does **not** pick up the
`NODE_OPTIONS=--max-old-space-size=7168` that `pnpm typecheck` sets, and no other
tsc was running (`pgrep` said 0 peers). Fix that worked: run it as
`NODE_OPTIONS=--max-old-space-size=10240 npx tsc --noEmit -p tsconfig.json`.
It then finished with `TSC_EXIT=0 / LOG_LINES=0`.
🔑 **So "empty log" is only damning next to a non-zero exit.** `exit 0` + empty
log is genuinely clean; `exit 134` + a stack is an OOM; `exit 144` + empty is a
harness kill. Always print `TSC_EXIT` beside `ERROR_LINES` **and** `LOG_LINES`.

🪤 **ESCAPING THE BRACKETS DOES NOT RESCUE `tsx --test`.** Measured on one file,
three ways: literal `app/[slug]/_lib/three-states.test.ts` → `# tests 0`;
*escaped* `app/[[]slug[]]/_lib/three-states.test.ts` → **also `# tests 0`**; the
quoted double-star form `"app/**/three-states.test.ts"` → `# tests 7`. So the
general recipe for any file under a bracketed route is
**`"app/**/<basename>.test.ts"`, quoted so tsx (not the shell) expands it.**
To run a whole set, build a zsh array and call `noglob npx tsx --test "${GLOBS[@]}"` —
an unquoted `$VAR` of globs is passed as ONE argument (zsh does not word-split),
which silently yields `# tests 0` again.

✅ **A fresh worktree does not need the node_modules symlink dance.**
`pnpm install --frozen-lockfile` in the new worktree took **12.6s** (the store is
shared) and left a working tree. Simpler and less fragile than symlinking, and it
cannot leave a symlink inside a `git add -A`.
