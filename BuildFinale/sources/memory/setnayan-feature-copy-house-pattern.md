---
name: setnayan-feature-copy-house-pattern
description: "Setnayan's house pattern for \"describe a feature\" is _spotlights.tsx — never build a new feature-row layout; the owner wants it on every studio page"
metadata: 
  node_type: memory
  type: project
  originSessionId: cc4f01c7-6abf-4431-a9ff-6def03c4f6ac
  modified: 2026-09-07T16:15:51.824Z
---

Any Setnayan request phrased as "too wordy · more image · simple impact · like
<rival>/features" is asking for the **existing** `apps/web/app/_components/marketing/_spotlights.tsx`
kit (`Spotlights` / `SpotlightSection` / `SpotlightExtras`), not a new layout.
Owner directives 2026-08-29 ("simple, easy to understand, clean output"),
2026-09-05 ("deliver the same concept across the rest of the studio description
pages") and 2026-09-07 (the same complaint aimed at the in-app buy page).

**Why:** the layout has been re-drawn from scratch more than once. The kit is the
archetype; a page supplies only content (chip · 4–8 word title · 1–2 sentences ·
one picture). Public doorways already use it; PR #5300 brought it to
`/dashboard/[eventId]/studio/setnayan-ai`. Remaining studio pages are the
owner's stated next target.

**How to apply:**
- Pictures come from three real roots only — `/add-ons/demo/stills/<slug>-N.jpg`
  (frames of the product's own `studio-card-demo.tsx` scenes), a `film` slug, or
  a `/demo/` photograph. `spotlights-are-real.test.ts` fails on a path with no
  file, and it scans `app/(shell)` plus an explicit `EXTRA_SOURCES` list — **add
  your in-app file to that list or it is unguarded**.
- **Open every image before naming it.** A still can print text that contradicts
  the page: `stills/setnayan-ai-2.jpg` renders "3 couples inquired for your date"
  inside the JPEG, which is false on 14 of 15 event types and invisible to every
  copy test. Choose the picture the way the copy is chosen — derived from
  `EventTypeProfile` terminology, never named by type.
- Shortening must never drop a promise. Map each capability id to exactly one
  spotlight in data, and assert both the mapping **and** that the sentence
  actually says it — a `caps` list alone is a declaration, not a check.
- The stills are captured at 460×972 but most scenes fill only the top third, so
  they render with a large empty area. Open owner question, not yet fixed.

Related: [[setnayan-shared-checkout-is-switched-by-other-sessions]],
[[setnayan-guards-must-test-the-claim]]
