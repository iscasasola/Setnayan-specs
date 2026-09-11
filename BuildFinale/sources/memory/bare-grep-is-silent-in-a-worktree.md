---
name: bare-grep-is-silent-in-a-worktree
description: "on this machine `grep` is a ugrep wrapper with --ignore-files that returns ZERO matches inside a git worktree; use /usr/bin/grep"
metadata: 
  node_type: memory
  type: reference
  originSessionId: fb08bb4a-6426-4423-8aa9-e53c227d63eb
  modified: 2026-09-08T22:08:40.405Z
---

On this machine `grep` in Bash is a **shell function**, not the binary — a wrapper that runs
`ugrep -G --ignore-files --hidden -I --exclude-dir=.git …` (defined in
`~/.claude/shell-snapshots/snapshot-zsh-*.sh`).

**Inside a `git worktree` it returns nothing at all.** `grep -c "export" data.ts` answered `0`
on a 3,754-line TypeScript module while `wc -l` on the same quoted path worked fine. A worktree's
`.git` is a *file*, not a directory, and `--ignore-files` behaves as if everything is ignored.

🔑 **The symptom is an empty result, not an error** — so it reads as "the file doesn't contain
that", and it cost several minutes of debugging a phantom. Use **`/usr/bin/grep`** for anything
under `/Users/icecasasola/Documents/Claude/Projects/wt-*` (and any other worktree).

Unrelated but same shell: `cd ~/…` inside a Bash call moves the session's working directory, so
prefix every command with the absolute path rather than relying on a previous `cd`. A path
containing `[slug]` must be quoted, and zsh globbing will otherwise eat it.

See also [[setnayan-shared-checkout-is-switched-by-other-sessions]] (why you are in a worktree
in the first place) and [[setnayan-local-ci-parity-traps]].
