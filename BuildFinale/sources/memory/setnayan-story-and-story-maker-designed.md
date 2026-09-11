---
name: setnayan-story-and-story-maker-designed
description: "The public editorial was redesigned as \"the story\" on a time spine, plus a \"Story Maker\" host desk; full build docs are a branch on the specs repo, not in main"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2d486673-b42d-4baf-abc1-d9158e731a17
  modified: 2026-09-07T16:04:27.175Z
---

2026-09-07: the public editorial surface was redesigned and locked. "Editorial" is retired
from customer language — the page is **the story**, the tool is **the Story Maker**
(`/dashboard/[eventId]/story`, was `/website/editorial`). The spine is the event's clock:
every capture, voice, supplier credit, film timecode and table filed under the minute it
happened, coloured from the host's saved mood board, light moving morning→night.

**Where the work is:** branch `design/story-and-story-maker` on
`github.com/iscasasola/Setnayan-specs` — 10 files under
`Design_Editorial_By_The_Minute_2026-09-07/`, including both working prototypes as HTML.
**It is NOT on the corpus main branch.** The corpus working copy could not be rebased
because `DECISION_LOG.md` carries ~44 uncommitted rows from other sessions (2026-09-04 →
09-07) and the remote had moved. The design's own decision row is carried as
`DECISION_LOG_ROW.md` in that folder so it survives if the shared file is reverted.

**Six owner locks + five in-session rulings** are in `00_BUILD_README.md`. The two that bite
hardest: a person's day is exclusive to their own account (**no name field anywhere, ever** —
a stranger could type any first name and learn who attended and where they sat), and assigned
seats exist only while the reception venue is in use.

**Seven data things do not exist yet** (`03_Data_Requirements.md`). The blocker: a capture's
minute is the **upload** minute — `papic_record_guest_capture` has no `p_captured_at` and
`papic-sink.ts` drops `capturedAtMs`. Also `EDITORIAL_TIMELINE_PHOTO_CAP = 48` with no date
bound, so pre-day captures starve the day's buckets.

**Eight questions are the owner's**, listed in `07_Open_Questions.md` — including whether the
solemn register (a wake) gets the quiet arm or is refused outright, and whether today's
PRO-gated capabilities stay gated.

Related: [[setnayan-shared-checkout-is-switched-by-other-sessions]] ·
[[setnayan-guards-must-test-the-claim]]
