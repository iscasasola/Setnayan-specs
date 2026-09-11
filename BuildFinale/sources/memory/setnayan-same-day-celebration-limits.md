---
name: setnayan-same-day-celebration-limits
description: A Setnayan celebration created on its own day has a locked guest list and a 1-point Papic pool; the Story opens the next morning — plan live test timelines around it
metadata: 
  node_type: memory
  type: project
  originSessionId: 444932b7-6d6a-48b3-9602-16b2cca797f1
  modified: 2026-09-11T08:50:03.203Z
---

Measured 2026-09-11 (step 8, "Tala & Migo", testnayan1): an event dated TODAY
- has its guest list already finalized — `/guests/new` → `?error=finalized` ("the guest count is
  locked"); the inline quick-add row just does nothing on Enter;
- gets a Papic free pool of `base_points` from guests (0 guests → total **1 point**), so the
  seat camera takes ONE photo then refuses "used today's shots" — though the setup wizard says
  "50 pts included free" (NEEDS_THE_OWNER item 12);
- opens the Story Maker only the next day (or when archived), and the public story's editorial
  phase only from 06:00 Manila the day after.

**Why:** a live end-to-end test that "creates a celebration, captures, then publishes" cannot
finish on one calendar day, and cannot shoot more than one photo on a same-day event.

**How to apply:** for real captures, date the test event today but expect one photo; do the
Story/publish/public half the next morning. Fixture captures on testnayan1's "Song Desk Test
Night" (past-dated) cover the rest, with image bytes stubbed in Playwright.

Related: [[setnayan-live-drive-needs-a-person-signin]], [[setnayan-s13-rehearsal-blocked]].
