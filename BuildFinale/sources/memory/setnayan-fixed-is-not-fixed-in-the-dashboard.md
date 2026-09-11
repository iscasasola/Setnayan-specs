---
name: setnayan-fixed-is-not-fixed-in-the-dashboard
description: "position:fixed inside any Setnayan dashboard page is relative to the page, not the screen — portal it to body; stand-in harness pages hide this"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 444932b7-6d6a-48b3-9602-16b2cca797f1
  modified: 2026-09-11T08:49:55.449Z
---

Inside `/dashboard/**`, `/admin/**` and `/vendor-dashboard/**`, the template wrapper
`.sn-page-enter` keeps an identity `transform` from its entrance animation, which makes it the
containing block for every `position: fixed` descendant — and any ancestor with
`container-type` (the Story Maker root uses it for `cqw`) does the same. A "fixed" toast then
draws below or above the screen.

**Why:** step 8's live drive found the Make-it-yours hint at y=924 on an 860 screen (phone: −564);
the step 4/6 stand-in page had neither wrapper, so 254 harness checks passed with the bug live.
canvas-maker.tsx, category-search-overlay.tsx and team-summary-chip.tsx already portal for this.

**How to apply:** any new fixed overlay/toast in a dashboard page → `createPortal(…, document.body)`
(mount-gated), carrying its CSS tokens on the portal's own class. And a harness page must mount the
real page chrome, or it cannot see this class of bug. Fixed in PR #5461.

Related: [[setnayan-buttons-have-a-44px-floor]], [[a-hidden-browser-pane-fakes-a-dead-page]].
