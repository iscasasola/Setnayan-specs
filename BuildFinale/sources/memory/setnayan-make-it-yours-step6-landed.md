---
name: setnayan-make-it-yours-step6-landed
description: "Story step 6 (words, toolbar, moments, sets, 'More settings' fold) is PR #5451, merged + verified live 2026-09-11 (6407ebd); step 8 must drive the live path; the drive now has a step-6 module and a data-harness-doc hook"
metadata: 
  node_type: memory
  type: project
  originSessionId: 305d8925-2b7c-44aa-8e2d-a5d286f6f205
  modified: 2026-09-11T05:07:01.549Z
---

Step 6 of the Story plan (`10_WHAT_IS_LEFT_SESSIONS_2026-09-10.md`) is PR #5451 — merged 2026-09-11T05:59Z and
verified live (`/api/health` → `6407ebd`). No migration — step 3's arrangement shape already held words/looks/names/order/sets.

- Moves: `apps/web/lib/make-it-yours.ts` (addWords/editWords/styleWords/clampWords/measureWords,
  addMoment/renameMoment/removeMoment/reorderMoments/moveMoment, nameSet/forgetSet/placeSet).
  Tests: `lib/make-it-yours-words-and-moments.test.ts` (3,000-move monkey).
- The older editor's sections sit under ONE closed `<details data-more-settings>` in
  `editorial-editor.tsx`; guard `story/more-settings-keeps-every-control.test.ts`.
  `the-story-maker-is-simple.test.ts` now finds its fold by "The smaller lines", not first `<details`.
- `OBJECTS_PER_MOMENT_MAX` raised 400 → 2,000 (above the 1,000 pool cap) — a busy moment could
  never save after "I choose".
- Drive: corpus `step4_make_it_yours_drive/mky-step6.cjs`, run by `mky-drive.cjs`; env `MKY_WT` +
  `MKY_BASE`; the harness page exposes the stand-in store as `[data-harness-doc]`.

**Why:** step 8 (end-to-end on a real phone) builds on this; four calls are flagged to the owner in
the 2026-09-11 DECISION_LOG row (headline/story now behind the fold, phone grip grows outward,
toolbar below when above covers a control, no PRO gate on naming here).

**How to apply:** the local harness folder `app/mky-harness` trips `lib/reserved-slugs.test.ts`
(2 fails) in a full unit run — move it aside before judging the suite. Related:
[[setnayan-make-it-yours-step4-landed]], [[react19-inline-html-object-identity]],
[[setnayan-buttons-have-a-44px-floor]].
