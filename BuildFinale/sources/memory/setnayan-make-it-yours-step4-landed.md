---
name: setnayan-make-it-yours-step4-landed
description: "Story step 4 \"Make it yours\" photo half landed (PR #5430, 2026-09-11); step 6 must extend its moves module and its real-browser drive, and the drive runs over a stand-in DB because no session can hold the prod service role"
metadata: 
  node_type: memory
  type: project
  originSessionId: dd7f46ad-a795-4d9c-bb3d-1f1c824134a3
  modified: 2026-09-10T23:13:42.696Z
---

Step 4 of the Story plan (`10_WHAT_IS_LEFT_SESSIONS_2026-09-10.md`) merged as PR #5430 and was
verified live 2026-09-11 (`/api/health` → `13b8ae7`).

- Editor: `app/dashboard/[eventId]/story/_components/make-it-yours.tsx` + `.module.css`, slotted at
  the top of the Story Maker's "The story" panel (the old sections stay below — flagged call).
- Every move is a pure function in `apps/web/lib/make-it-yours.ts` ending in `resolveArrangement`
  (via `settle`) — step 6's word moves belong there too, not in the component.
- The real-browser drive + local test page live in the corpus at
  `Design_Editorial_By_The_Minute_2026-09-07/step4_make_it_yours_drive/`; step 6 extends it.

**Why:** the prod service role is marked sensitive in Vercel — `vercel env pull` returns it EMPTY,
along with R2 keys — there is no Docker for a local Supabase, and typing a testnayan password is
off-limits. So the drive feeds the REAL component through step 3's REAL read/save over an
in-memory stand-in (`harness/store.ts`, mirroring `save_story_arrangement`'s compare-and-set).

**How to apply:** don't burn time trying to run `/dashboard/...` locally with prod data; use the
stand-in page. Ten fixture captures sit on testnayan1's "Song Desk Test Night"
(`device_model = 'story-step4-fixture'`) for step 8's live drive. Related:
[[setnayan-story-arrangement-s3-landed]], [[setnayan-local-ci-parity-traps]].
