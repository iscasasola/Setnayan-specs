# The Maker's Animate, ▶ preview and Scrub — owner rulings, 2026-10-09 (day session)

Continues `Maker_Two_Bars_LOCKED_2026-10-09.md`. Every sentence in quotes is the owner's (Ice Casasola), said while
trying the real toolbar on the local review copy and two clickable prototypes:
`prototypes/maker_scrub_2026-10-09.html` (Scrub — approved with its DEFAULT switches) and
`prototypes/maker_background_tiles_2026-10-09.html` (Background's choices row — option A chosen).
Nothing here is on GitHub or in production yet; the build is local (branch `rd/the-toolbar-is-four-rows`).

## 1. Background › the choices row (row 2)
- "not nice" (of small swatches with the name in a white sticker, a double dashed ring, striped Opaque / Frosted).
- "A- picture tiles": the name is written ON the tile; ONE ring on the picked tile, never cut; "None" a white tile with a
  thin stroke; Opaque flat, Frosted a soft haze — no stripes. Colour tiles have no fade; photo tiles a light foot fade
  (controller: needed so a name is readable on a photo). Built.

## 2. Animate › Movement
- "movement independent from each. not universal for all"
- "so we remove movement? i thought this would be like how does the effect execute its effect, calmly, cinematic, etc"
- RULING: Movement is the FEEL of how a phase's effect plays, and Build in and Build out each hold their own. It never
  chooses which effect plays (the chips do) and never sets the drive.
- FOUND (code, 2026-10-09): the only thing that separates the old presets as a feel is TEMPO (0.6 / 1.1 / 1.8 s and the
  gap between parts); easing and travel are fixed. So Movement = Quick · Calm · Cinematic per end, for now. Action has
  nothing to vary and shows no Movement. A richer feel (curve, travel) is new guest-page motion work — not built.
- The old bundles (Still / Calm / Editorial / Cinematic as one preset for everything) leave the toolbar; stored ones
  keep playing untouched.

## 3. Animate › the drive
- "build out is as you leave the screen. or as scrub out. or auto scroll"
- Build out's row 4: Movement ◆ + **Leaves ◆** — As it scrolls away · Scrub out ◆ · Auto scroll ◆ (the stored
  `transition`, renamed in his words). Build in's row 4: Movement ◆ + **Plays** (On arrival | On scroll) + Delay or Rows.
- Honest limit (not changed): "Plays" is one switch for both ends — On arrival means no Build out.

## 4. The ▶ button
- "preview button allow preview the animate on where they are. if they are on buil…" — TAP plays the phase on screen
  (Build in / Action / Build out) on the picked element.
- "long press will preview that whole page (they can scroll, tap around, and an exit preview button should show)" —
  HOLD = the whole page as a guest, with **Exit preview**; exit returns to the same part and tool.
- "remove this during preview" (the Maker's own top bar) — it slides away during the preview.
- Controller: links that leave and form sends are refused in preview with a toast; the hold's twin is a first-tap toast
  and Shift + Enter.

## 5. Scrub — the rules
- "do you understand the difference of scrub and scroll?" — Scroll: the page moves, the element leaves the screen.
  Scrub: the page stands still, the thumb drives the animation.
- "if there is a build out, with scrub, the idea is, scrub is the element at the center of the screen. so it means it
  will scrub out. the page will not scroll, the element scrubs out on the center, meaning that element is gone and the
  next element takes its place since it scrubbed out. build out from current element and build in on next element under
  it applies at the same time on scrub like a cross fade for both."
- "just when it is at the center"
- LONG ITEMS: "then it should build part by part as you scrub or buildin the same time. so it will be centered, from the
  top of that element, build in as you show the rest of the long item (table/schedule/wedding march) as you scrub it
  scrolls to show the other parts. it only scrubs out after the bottom part of the element is at the center of the screen"
- NO BUILD OUT: "if no build out, element stay permanent on the screen" → corrected: "on the page not the screen" →
  "if no build out, then animation will be under it. since no build out."
- BACKWARDS: "if we scroll backwards effect is just reversed it is still build out but reveresed and build in will be
  the one that looks like build out."
- THE PRINCIPLE: "element run completely normal. we only control the effect"
- Choice put to him — A (leave the element alone, the next appears below) or B (hold at the centre, replace in place):
  **"B"**.
- SAME POSITION: "maybe a better twist. my issue maria jose must build out and until we say i do should be where maria
  jose build out" · "them must be on the same position to create that keynote like transistion."
- TIMING: "let it enter on the last 20% of the build out"
- STRICT ORDER: "it entered when the previous element is not yet done" (a fault he photographed) → an element may not
  begin to enter until the one before it is done. Also photographed and now rules: no text through text; "long one is
  still an issue" / "it never completed the schedule" → a list is ALWAYS scrolled through and every row completes;
  "this is the last scrub" → the last hand-over must be able to finish before the page ends; "scroll back up:" → going
  back equals going down at every window size.
- APPROVAL: "localhost:3480/review/scrub-prototype.html is correct that can do" (first version) → after the fixes:
  "centered and at the line both looks good. what do you think?" (controller: Centred) → "ok we are done".

## 6. Scrub — the approved behaviour (the prototype's default switches)
Arrives in the same place · Held centred (a list is always scrolled through and hands over at bottom-at-centre; a long
arrival tops together; a shorter one centres together) · the arrival enters at 80 % of the Build out · rows per the
scene's Rows setting · a rest of ~30 % of a screen between two back-to-back centred hand-overs · no Build out → the next
builds in below it · strict order · the page is always long enough for the last row and the last hand-over · going back
rewinds exactly. Numbers in the prototype (55 % of a screen per Build out, 22 % per Build in, a row ≈ 90 px) are the
builder's and may be tuned.

## 7. Controller's rules for the real build (not the owner's words)
Native scrolling only (no scroll-jacking; a hold is extra scroll length); a plain page before the script, with reduced
motion, and if it fails; the seven photographed faults as behavioural guards at 890 × 1548, 940 × 1608, 1280 × 770,
375 × 812, 375 × 667; the guest script loads only on a page with a Scrub scene. Production held ZERO Scrub / Auto scroll
scenes on 2026-10-09 (read-only count), so the stacked run can be replaced without a compatibility path.

## 8. Not built / open
A richer Movement feel; each end with its own drive (arrive on a clock AND build out on leaving); a single PART scrubbing
out by itself (Scrub is scene to scene; a part shows "Scene leaves ◆"); Auto scroll's speed control; uploads' name
contrast on tiles (needs the foot colour stored at upload); iOS Safari — to be tried by the owner on his phone.
