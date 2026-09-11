---
name: setnayan-story-guest-pages-s5-landed
description: "Story step 5 (guests see arranged pages) merged as PR #5428 on 2026-09-11; what step 7 must reuse and the traps hit"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0bd0872b-8211-46c0-84bb-22bd7a5e951b
  modified: 2026-09-10T21:42:36.565Z
---

Step 5 of the Story series merged 2026-09-11 (PR #5428, merge d295b3e, prod verified via /api/health). The public story draws each by-hand moment as a read-only sheet on the day's spine; Automatic draws nothing (unchanged page).

**Why:** step 7 (prints) must reuse this render, never a second one; builds on [[setnayan-story-arrangement-s3-landed]].

**How to apply:**
- Render = `ArrangedSheet` (`app/[slug]/_components/story/arranged-sheet.tsx`, `stills` prop for paper). Lengths are `calc(var(--sn-u)*N)`, `--sn-u = 100cqw/660` — scaling is pure CSS, no JS.
- Read = `loadStoryPages(admin, eventId, viewer, sign)` in `lib/story-pages.ts`; a guard fails if anything under app/[slug], app/api, app/realstories reads the arrangement another way (print route included).
- Owner-flagged calls: a minute drops media a sheet shows; host-added moments get no time stamp. Small word sizes are ~6.5px on a phone (fixed-sheet design call) — possible editor size floor.
- Traps: `tsx --test 'app/[slug]/…'` runs 0 tests — use `app/?slug?/**/*.test.ts`; rendering a component in a tsx test needs `globalThis.React = React` and a dynamic import inside an async fn (top-level await fails); no local service-role key, so /[slug] cannot render locally — prove the sheet with a static render + Playwright.
