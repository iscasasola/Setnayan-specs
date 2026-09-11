---
name: a-survival-measurement-has-three-hiding-places
description: "Before calling a checkout safe to delete, ask three questions — local-only commits, stashes, worktrees; `rev-list origin/main..HEAD` = 0 is a one-branch tip check, not a survival measurement"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6fb97916-7e77-409d-9802-6e036ea53c32
  modified: 2026-09-09T11:05:05.292Z
---

I told the owner a stale checkout held "zero commits main lacks — nothing unique to rescue", on the
strength of `git rev-list --count origin/main..HEAD` = 0. **That was false.** It asks about ONE
branch's tip. The same repo actually held **30 commits on local refs no remote has** (across 16 of
670 local branches), **13 stashes** (unreachable from HEAD by construction), and **9 worktrees, three
with uncommitted work** (18 dirty files in one). Deleting `.git` on my measurement would have
destroyed all of it.

**Why:** "does anything unique live here" has three independent hiding places, and the branch-tip
diff can see none of them.

**How to apply:** before ever calling a checkout disposable, run all three and report all three —
```
git -C <path> rev-list --count --all --not --remotes   # local-only commits
git -C <path> stash list                               # stashes
git -C <path> worktree list                            # worktrees (check each for dirty files)
```
Same family as [[setnayan-postgrest-embeds-need-the-fk-name]] (an FK census is not an ambiguity
measurement) and [[setnayan-guards-must-test-the-claim]]: a cheaper proxy answered a neighbouring
question, and I reported it as the answer to the real one. When the consequence is irreversible,
name which question the measurement actually answered.
