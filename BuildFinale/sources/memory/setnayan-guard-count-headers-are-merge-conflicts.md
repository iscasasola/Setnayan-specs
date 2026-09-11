---
name: setnayan-guard-count-headers-are-merge-conflicts
description: two branches touching one guarded surface collide only on its COUNT header — or merge it silently wrong when both made the same bump; recompute from the merged body, never pick a side
metadata:
  type: project
---

Several Setnayan guards state a **count** about a list they also contain — the
contrast guard's `assert.equal(PAIRINGS.length, N)`, the exposure baseline's
`# facts: N` header. When two branches each add rows, git auto-merges the **list**
and conflicts only on the **number**. Both sides of that conflict are wrong.

**How to apply:** never take either side and never regenerate the file to go green —
regeneration is what drops the other branch's rows silently. Delete the conflict block,
**count the merged body**, and write the header from that. Then prove it:
`node scripts/lint-exposure-baseline.mjs` checks header-vs-body and canonical order,
and `exposure-freeze.db.test.ts` re-derives the surface from a real PGlite replay — so
a computed header that survives the replay is verified, not assumed. Arithmetic is a
good cross-check (base + mine + theirs), never the evidence.

⚠ **It can also merge SILENTLY WRONG, with no conflict.** When both branches make the
SAME header edit (each bumps `# facts: 6635` → `6636` for a different row), git sees
identical changes and takes one: the result reads 6636 while the body holds 6637
(H6, 2026-09-11). So after every merge from main, recount (or, for the exposure
baseline, regenerate from the replay and check that `git diff origin/main` shows
only your own rows), then run `node scripts/lint-exposure-baseline.mjs`.

Same shape in the component itself: when both branches append a block under one shared
`/**`, a naive union leaves the second block's docblock dangling — give it its own.

⚠ Related trap: `scripts/lint-port-no-lost-controls.mjs` lives under **`apps/web/scripts/`**,
not the repo root, and its baseline must stay untouched. Several bench guards are also
unrunnable from the repo root — `npx tsx --test` needs cwd `apps/web` or the `@/lib/...`
alias fails as MODULE_NOT_FOUND, which looks like `pass 0 / fail 1` and reads as a real
failure. See [[setnayan-local-ci-parity-traps]].
