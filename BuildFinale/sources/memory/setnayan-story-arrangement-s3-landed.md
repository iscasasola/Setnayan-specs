---
name: setnayan-story-arrangement-s3-landed
description: "Step 3 \"Make it yours\" storage — PR #5419; event_editorial.arrangement column (NOT draft_json), one versioned save, loadStoryArrangement is the read steps 4/5/7 must use"
metadata: 
  node_type: memory
  type: project
  originSessionId: bdfb0e35-4c6c-4440-a870-9a21950d57c2
  modified: 2026-09-10T20:30:58.309Z
---

Step 3 of `10_WHAT_IS_LEFT_SESSIONS_2026-09-10.md` (Story "Make it yours" data layer), PR #5419 — merged 2026-09-11 and verified in prod by the object (rolled-back transaction on testnayan3's event).

- Stored in `event_editorial.arrangement` + `arrangement_version`, NOT a `draft_json` key: saveEditorial, the cover step and What's Next all rewrite the whole draft_json from an earlier read, so an autosaving key would be put back.
- One write: `save_story_arrangement` (service_role only, compare-and-set; outcomes saved/unchanged/conflict/no_story). Trigger `tg_the_arrangement_has_one_door` refuses browser-role writes (authenticated has TABLE-level grants on event_editorial).
- Shape + resolver: `apps/web/lib/story-arrangement.ts` (pure). Reads: `lib/story-arrangement-store.ts` `loadStoryArrangement(admin, eventId, viewer)` — applies S3 guest layer + S14 consent veto itself. Host: `story/_lib/load-arrangement.ts`; action `story/arrangement-actions.ts`.
- Mode is ONE switch for the story (the prototype), not per moment — flagged to owner. Automatic is derived on every read.
- Editor (step 4) must save `storedFromResolved(...)`, and must NOT save while `unreadable` is non-empty.

**Why:** steps 4/5/7 all build on this shape; a second reader would skip the gates.
**How to apply:** new viewer objects must use `belongsToThisEvent(...)` never a literal `true` (the-keepsake-is-not-a-way-around guard); a new event_editorial column needs an exposure-baseline regen on a tree merged with origin/main (header counts conflict — see [[setnayan-guard-count-headers-are-merge-conflicts]]). Run repo-wide guards locally, not only your own suites — both bit in CI. Related: [[setnayan-story-layer-gate-s3-landed]].
