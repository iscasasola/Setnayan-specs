---
name: a-silenced-git-show-reads-as-a-real-zero
description: "In zsh `git show $rev:path` unquoted is mangled by the `:a` modifier, and `2>/dev/null` then turns the fatal into a confident count of 0 — I nearly used one to contradict a correct peer measurement"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f8da23fc-1bf6-42c3-917d-72e124cd54a5
  modified: 2026-09-09T11:53:29.265Z
---

**Measured 2026-09-09 (S7, PR #5370).** Verifying a peer's git archaeology, I ran

```zsh
for r in ca1bffb38 ca1bffb38^1; do git show $r:apps/web/lib/auto-recap.ts 2>/dev/null | grep -c loadEditorialData; done
```

and got `0` for both — which read as "the peer's 4 is wrong". It was not. zsh consumed
`:a` as a **history/glob modifier**, so the path became `ca1bffb38pps/web/lib/auto-recap.ts`;
`git show` exited **128** with `fatal: ambiguous argument`, and `2>/dev/null` threw the
message away. `grep -c` then counted an empty stream and printed a clean, confident **0**.

Quoted — `git show "${r}:apps/web/lib/auto-recap.ts"` — the real answer is **4**, at that
commit, at its parent, and on `origin/main`. The peer was right in every digit.

**Why it matters beyond zsh:** this is the house disease in miniature — *a failure that
renders identically to emptiness*. A refused query, a killed typecheck and a mangled
`git show` all present as zero, and zero is the most quotable number there is. I was one
message away from publishing a false contradiction of a correct measurement, which is
exactly how the false line we were both correcting got written in the first place.

**How to apply**
- Never `2>/dev/null` a command whose output you are about to treat as evidence. Bind the
  error: print `exit=$?` and the byte count beside the number, and read all three.
- Always quote the whole `<rev>:<path>` argument in zsh — `git show "${rev}:${path}"`.
- A count of 0 needs a positive control before you believe it: run the same command at a
  revision where you KNOW the string exists. If that also says 0, the harness is lying,
  not the tree.
- When your measurement contradicts a peer's, suspect your own command first — they had to
  run theirs to write the number down; you have only run yours once.

See [[bare-grep-is-silent-in-a-worktree]] (same shape: a wrapper returning zero matches)
and [[setnayan-full-tsc-oom-when-concurrent]] (exit 134/144 + empty log ≠ clean).
