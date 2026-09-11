---
name: setnayan-shared-checkout-is-switched-by-other-sessions
description: Other Claude sessions run git checkout/commit in the main setnayan-platform working copy while you work; never edit there — make your own worktree BESIDE the repo (~/Documents/Claude/Projects/wt-*), never /tmp
metadata: 
  node_type: memory
  type: project
  originSessionId: 0c2ad91d-67d2-4ff7-9128-605e73f22fc4
  modified: 2026-09-05T06:25:04.119Z
---

On 2026-09-05, while I was editing files in `~/Documents/Claude/Projects/setnayan-platform`,
another session checked out a different branch there (`claude/front-door-drops-hero-for-anchor`,
122 commits behind `origin/main`, missing the Mood Board page) and committed on it. My
uncommitted edits survived the switch but were now sitting on a stale base; a subagent then
"correctly" reported that a page did not exist.

**Why:** the main checkout is shared by several concurrent sessions on this machine (see
`git worktree list`). It is nobody's stable base, and its branch
and uncommitted pile change without warning.

**⚠ HOUSE RULE (orchestrator, 2026-09-11): worktrees go BESIDE the repo, under
`~/Documents/Claude/Projects/wt-<slug>`, NEVER `/tmp` or `/private/tmp`.** Work in /tmp
was lost twice on 2026-09-10. An existing /tmp worktree can be relocated with
`git worktree move /private/tmp/wt-x ~/Documents/Claude/Projects/wt-x`. That is the same
volume, so it is instant and keeps node_modules working (verified for H6).

**How to apply:** before the first edit, `git fetch` and
`git worktree add -b claude/<slug> ~/Documents/Claude/Projects/wt-<slug> origin/main`, `pnpm install
--frozen-lockfile --prefer-offline` there (fast, ~11 s from the warm store; `tsx` is hoisted to the
root `node_modules`), copy `apps/web/.env.local` in (untracked, git-ignored), and run a dev server on
its own port (3463 was free). If work already landed in the shared checkout, port it with
`git diff HEAD -- <file> | git -C <wt> apply --3way`, verify markers in the worktree, then
`git checkout -- <files>` in the shared checkout.

**⚠ A SIBLING WORKTREE DIRECTORY MAY ALREADY BE ANOTHER LIVE SESSION'S — CHECK BEFORE YOU CD.**
On 2026-09-09 `git worktree add -b <branch> ~/Documents/Claude/Projects/wt-s10-light` failed with
`fatal: ... already exists` — but the shell had `&&`-chained a `cd` and a `git merge`, and BOTH ran
against the existing directory, leaving another running session's worktree in a conflicted merge
state mid-task. `git merge --abort` restored it fully (their branch, commit and untracked files
were intact), but nothing warned me first. Note the failed `add` still CREATED the branch, which
then had to be deleted. Two habits: run `git worktree list` and `ls` the intended path BEFORE
choosing it, and never chain `cd <new-worktree> && <mutating command>` behind a `worktree add`
— the `add` failing does not stop the rest of the chain. `ListAgents` / `list_sessions` names the
owning session (the sidebar group and title match the worktree slug), so a collision can be handed
over rather than guessed at. Related: [[setnayan-full-tsc-oom-when-concurrent]].
