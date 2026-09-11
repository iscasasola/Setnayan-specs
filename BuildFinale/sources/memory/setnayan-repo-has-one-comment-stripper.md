---
name: setnayan-repo-has-one-comment-stripper
description: setnayan-platform has exactly ONE comment stripper (lib/strip-comments.ts) and a required CI guard that fails any hand-rolled second one; the obvious two-regex version silently blanks real code
metadata:
  type: feedback
---

Any guard/test in `setnayan-platform` that reads source text and matches a pattern must strip
comments with `stripComments` from `apps/web/lib/strip-comments.ts` (its JS twin is
`apps/web/scripts/port-controls.mjs`). A hand-rolled
`src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')` fails the **required**
`typecheck + lint` check via `apps/web/scripts/lint-one-comment-stripper.mjs`
(`ONE_STRIPPER` in `.github/workflows/ci.yml`) — measured 2026-09-05 on PR #5224.

**Why:** the two-regex shape strips BLOCK comments first, so a `//` line containing `/*`
(this codebase writes `video/*` and `accept="image/*"` constantly) opens a comment that never
existed and blanks everything to the next real close. The guard then asserts against nothing
and **passes** — the silent direction. 293 files already carry a private copy; the baseline
may only shrink.

**How to apply:** import the canonical `stripComments`, then re-sabotage the guard through it
to prove it can still go red — swapping the stripper changes what the guard SEES, so a green
run afterwards is not evidence on its own. Related: [[setnayan-local-ci-parity-traps]].

**Happened again 2026-09-10 (#5409), in a CSS guard.** A test stripping a `.module.css` file's
comments with a one-line block-comment regex counts as a private stripper too — the lint scans
the TEST file's code, not what it reads. Root `pnpm lint` was clean and the full unit suite was
green; only CI's separate guard step caught it. `stripComments` is safe on CSS (it is
string-aware; CSS has no `//` comments outside `url()`).
