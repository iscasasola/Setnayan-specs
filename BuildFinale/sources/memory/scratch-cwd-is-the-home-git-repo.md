---
name: scratch-cwd-is-the-home-git-repo
description: "A bare git command from a Claude scratch workspace operates on /Users/icecasasola/.git, which tracks ~/.claude — always use `git -C <the real worktree>`"
metadata: 
  node_type: memory
  type: project
  originSessionId: 6fb97916-7e77-409d-9802-6e036ea53c32
  modified: 2026-09-09T11:04:55.194Z
---

`/Users/icecasasola` is itself a git checkout of setnayan-platform (HEAD `671865e31`, ~2,900
behind), and it **tracks `.claude/`** — the live Claude config, skills and memory directory.

🚨 The Claude scratch workspaces (`~/Library/Application Support/Claude/scratch-workspaces/…/
scratch-*`) are empty dirs **under `~`**, so from inside one, `git rev-parse --show-toplevel`
resolves to `/Users/icecasasola` and `--absolute-git-dir` to `/Users/icecasasola/.git`. Verified
live, 2026-09-09. **A bare `git add -A`, `git checkout .`, `git clean -fd`, `git stash` or
`git worktree prune` run from a scratch cwd silently operates on the home repo — and could destroy
the Claude setup with no "tidy the repo" intent at all.**

✅ **Rule: from a scratch workspace never run a bare `git` command — always
`git -C <the real worktree>`.** Confirm which repo answered before trusting output (a `worktree add`
that prints the active main's SHA went to the right place).

**Owner ruling 2026-09-09: the `~` checkout stays exactly as it is.** Do not delete it, do not
`rm -rf ~/.git`, do not rename `~/CLAUDE.md`. Recorded in the corpus DECISION_LOG; do not re-ask.
Renaming `~/CLAUDE.md` is not a free win either — it is a stale *subset* of the platform repo's
CLAUDE.md, but it is the only file that states RULE 0 verbatim for corpus/scratch sessions (the
corpus CLAUDE.md only points at it).

See [[a-survival-measurement-has-three-hiding-places]] and
[[setnayan-shared-checkout-is-switched-by-other-sessions]].
