# 10a "Make it yours": evidence for every item (2026-09-11, updated after PR #5461)

On 2026-09-11 the step-4/6 Playwright drive, re-pointed at the LIVE site (`live-mky-drive.cjs` + `live-mky-step6.cjs`, plus `live-10a-gaps.cjs` for the items the first pass had not reached), ran against www.setnayan.com as the signed-in test host on "Song Desk Test Night" (10 captures; only the image bytes are drawn stand-ins). It runs at 1280 mouse ("desk") and 390 touch ("phone"). Part 4 is the photo half; part 6 is words, the toolbar, moments and sets; "gaps" is everything else it could reach. Each of the **155** items in `10a_MAKE_IT_YOURS_TEST_PLAN_2026-09-10.md` (61 in round 1, 20 in the round-1 critic, 74 in round 3) has exactly one status. **Totals: PASS · live 116 (2 of them "light-locked") · FAIL · live 0 · N/A · stickers 12 · N/A · prototype-only 7 · COVERED · harness/unit only 14 · NOT RE-DRIVEN 6.**

**The one defect, now fixed.** The first pass (`run-desk-part4.log` 114 PASS · 1 FAIL · 1 SKIP; `run-phone-part4.log` 102 · 1 · 1; both part-6 logs clean) failed one check: "…where the person is looking: fully on screen". The refusal/Undo message is `position: fixed`, but it sat inside a containing block on the dashboard. It drew at top 924 on an 860-high desk screen, and at top −564 on the phone. That one defect was behind all five FAIL rows. PR #5461 portals the message to `<body>` and is deployed. The same check now reads top 804–840 of 860 (desk) and 14–50 of 844 (phone). After the portal, the drive's hint selector was narrowed to the Story Maker's own toast (`[class*="make-it-yours_hint"]`), because an unrelated app toast now came first in the DOM.

**Primary evidence** (all in `out/`, all run on the fixed production site):
- desk-4 = `run-desk-part4-after5461.log`: 115 PASS · 0 FAIL · 1 SKIP.
- phone-4 = `run-phone-part4-after5461.log`: 103 · 0 · 1.
- desk-6 = `run-desk-part6-after5461.log`: 133 · 0.
- phone-6 = `run-phone-part6-after5461.log`: 119 · 0.
- desk-gaps = `run-desk-gaps-r2.log`: 48 · 0. It supersedes `run-desk-gaps.log`, whose one FAIL (chaos-r3-09, "hit HEADER") measured a point under the site's fixed header. r2 scrolls the words clear of the header first.
- phone-gaps = `run-phone-gaps2.log`: 35 · 0.
- Three phone monkeys, `run-phone-monkey-777.log`, `-4242.log` and `-99.log`: 150 actions each, 0 violations, 0 errors.

Every one of these logs has zero dialogs, zero console errors and zero CSP reports. The only exception is the superseded first phone gaps run, `run-phone-gaps.log` (see chaos-02). Every check quoted below passes in these logs. The first-pass logs are kept only for the "before" numbers. The SKIP in each part-4 log is the unreadable pool + no run of show, which this event cannot show (see M-NS-03).

**Dark.** The same four parts ran again with the device set to dark (`DARK=1`):
- `run-desk-dark-part4.log`: 115 · 0.
- `run-phone-dark-part4.log`: 103 · 0.
- `run-desk-dark-part6.log`: 133 · 0.
- `run-phone-dark-part6.log`: 119 · 0.

These are the same checks with the same results as the light runs; only object ids differ. The tray screenshots are byte-identical to the light ones, and a new box's words are still ink `rgb(44, 42, 41)`. The app has been light-locked since the owner's ruling of 2026-06-04 ("just always keep it light theme"). In `apps/web/app/globals.css` (~line 92), dark is disabled and there is no `prefers-color-scheme` rule. So these runs prove that the device setting changes nothing, and the dark-mode items are judged on the light theme's measured contrast.

Key:
- Check names are quoted without their `[1280 mouse]` or `[390 touch]` tag, and without the "gaps" prefix.
- "guard" is a rule in `apps/web/app/dashboard/[eventId]/story/make-it-yours-keeps-what-the-browser-found.test.ts`.
- "unit" is a test name in `lib/make-it-yours.test.ts` or `lib/make-it-yours-words-and-moments.test.ts`. "story-arrangement" is a test name in `lib/story-arrangement.test.ts`.
- "harness" is the step-4/6 drive over the stand-in database (`step4_make_it_yours_drive/`). It is the same drive, plus two checks the live event cannot run: an unreadable pool, and no run of show.
- "(partial)" marks a PASS row where part of the item was not driven. No row is "(unasserted)" any more: the three that were (R5-reload, F2, chaos-r3-02) are now asserted by the gaps run.
- **The live monkey** (`live-10a-gaps.cjs`) chooses from these actions: moment taps, tray taps, the photo ×, photo drags, Put all back, Undo or Cmd+Z, + Words, the toolbar's Bigger text or Turn right, and the mode switch. After every action it checks three things: pages + tray = 10, the open page draws its pill, and nothing scrolls sideways. It also counts new errors and dialogs, and it reloads every 50 actions. It never presses handles, grip reorders or inline names, never resizes or scrolls, and does not check whether each × can be reached.
- **A caveat about contrast measurements:** the drive's contrast helper (`CONTRAST` in `live-10a-gaps.cjs`) skips any background under 50% opacity and measures against the first opaque background behind it. That is exact on opaque grounds (the name field, small print on white or `--sunk`), but it misses the 10% terracotta tint (`--act-soft`) painted by hover and selection. See R13-start-over-and-mini-hover.

## Round 1 (61)

| 10a item | status | evidence |
|---|---|---|
| `[place-remove/R2-phone-x-offscreen-when-tray-has-5-plus]` | PASS · live | phone-4 "everything in the tray · no sideways scroll" (tray 10) + "a photo dragged to the bottom is not cut off". (partial: the × at the right edge was never pressed) |
| `[place-remove/R2-desktop-covered-corner-x-vanishes]` | PASS · live | desk-4 "a × under a neighbour is still on top where it shows" + "pressing it takes off THAT photo, not the neighbour" (also phone-4). |
| `[place-remove/R10-double-Enter-duplicates-photo]` | PASS · live | desk-4 "a double Enter adds ONE photo". |
| `[place-remove/R10-phone-keyboard-double-Enter-duplicates]` | PASS · live | phone-4 "a double Enter adds ONE photo". |
| `[place-remove/R10-click-then-Enter-duplicates]` | COVERED · harness/unit only | Click then Enter was never driven. unit "ONE PHOTOGRAPH, ONE PLACE — a second Enter, a held key or a double tap adds it once". |
| `[place-remove/R12-escape-from-typing-then-backspace-deletes-words]` | PASS · live | desk-6 + phone-6 "Escape stops typing and lets go of the words (R12)" + "…so a Backspace after it deletes nothing (R12)". |
| `[place-remove/R11-phone-page-wider-than-screen-when-tray-5-plus]` | PASS · live | phone-4 "everything in the tray · no sideways scroll — 390 vs 390" with 10 in the tray. |
| `[place-remove/R11-bottom-edge-drag-leaves-photo-clipped]` | PASS · live | desk-4 + phone-4 "the sheet grows downward to meet it" + "a photo dragged to the bottom is not cut off". |
| `[reach-layout/RL-10]` | PASS · live | desk-4 + phone-4 "a resize moves nothing" (700 → 360 → 1280 → back; every position unchanged). |
| `[reach-layout/RL-11]` | PASS · live | desk-4 + phone-4 "a × under a neighbour is still on top where it shows" / "pressing it takes off THAT photo"; guard "the × has no invisible halo". |
| `[reach-layout/RL-12]` | PASS · live | desk-6 + phone-6 "…placed BELOW every photo, on none of them (RL-12)". |
| `[reach-layout/RL-13]` | PASS · live | desk-4 + phone-4 "the sheet grows downward to meet it" (360 → 586 / 626) + "…not cut off". |
| `[reach-layout/RL-14]` | PASS · live | desk-gaps + phone-gaps "four-line words dragged to the bottom are not cut off — the page grows to hold them (RL-14 · chaos-13)". On desk, words at 592–648 sit inside the page at 346–662 (184 → 316px tall). On the phone, words at 435–479 sit inside 220–490 (147 → 270). |
| `[reach-layout/RL-15]` | PASS · live | desk-gaps + phone-gaps "a 60-character hashtag stays inside the page (RL-15 · chaos-09)" + "…and nothing scrolls sideways, the page or the desk" (0px, 0px). desk-gaps "…and its × is on screen (RL-16)". On the phone the words have no ×; it gives way to the toolbar (RL-16). |
| `[reach-layout/RL-16]` | PASS · live | phone-6 "on a phone the handle and the words' × give way to the toolbar" + the toolbar "…on screen" (8–369 of 390). desk-gaps "…and its × is on screen (RL-16)" on the 60-character hashtag. |
| `[reach-layout/RL-17]` | PASS · live | desk-gaps "narrowing the window while typing leaves nothing outside the page (RL-17 · chaos-12)": narrowed 1280 → 390 mid-typing, 0 outside. Plus "…and moves nothing, once it is wide again": every position is identical before and after. The window narrowing was driven; a phone rotation was not. |
| `[reach-layout/RL-18]` | PASS · live | phone-4 "put all back" and "everything in the tray" · no sideways scroll (390 vs 390). |
| `[reach-layout/RL-19]` | PASS · live | phone-6 "Automatic deals no photo under the host's words (M-R3-17 · M-R5-08)", 0 under words (after a reload, not on first open). |
| `[reach-layout/RL-20]` | PASS · live | desk-4 + phone-4 "…where the person is looking: fully on screen". Before #5461 the hint's top was at 924 on an 860-high screen (desk) and at −564 (phone). After #5461 it spans 804–840 of 860 (desk) and 14–50 of 844 (phone). The message is now pinned to the screen, so a tall moment can no longer carry it off the bottom. |
| `[drag-words/DW-08]` | PASS · live | desk-4 "a 3px drift is a tap, not a move"; phone-4 "a 7px drift is a tap". Guard "a drag starts past 4px, or 10px for a finger". |
| `[drag-words/DW-09]` | N/A · prototype-only | The port does not re-render after a delay when the tray is tapped (React renders at once; the tray only has a 220ms quiet window). |
| `[drag-words/DW-10]` | PASS · live | desk-4 + phone-4 "a photo dragged to the bottom is not cut off". For the words half, desk-gaps + phone-gaps "four-line words dragged to the bottom are not cut off" (see RL-14). |
| `[drag-words/DW-11]` | PASS · live | desk-4 + phone-4 "a resize moves nothing" (narrowed to 360, then widened back). |
| `[drag-words/DW-17]` | PASS · live | desk-6 + phone-6 "empty box then another moment — it opens (DW-17)". |
| `[drag-words/DW-18]` | PASS · live | desk-6 + phone-6 "…and that same tap still places the photo (DW-18 · R7)". |
| `[drag-words/DW-19]` | COVERED · harness/unit only | Not driven: the drive only ever has one box. Guard "the layout holds still while a press that removed something lifts" (DW-17…22). |
| `[drag-words/DW-20]` | COVERED · harness/unit only | Only the × press was driven (the DW-21 check: 0 boxes). A click or drag on the photo body was not. Guard: the layout-freeze rule. |
| `[drag-words/DW-21]` | PASS · live | desk-6 + phone-6 "empty box then a photo's × — the photo goes (DW-21)". |
| `[drag-words/DW-22]` | PASS · live | desk-gaps "a press on a photo takes the caret out of the words (DW-22 · chaos-17)" + "…so Backspace takes the photo off and leaves the words as they were" (photos 2 → 1, words unchanged). phone-gaps drives only the first half. |
| `[modes/M-R3-14]` | PASS · live | desk-4 "Delete on a photo in Automatic says why and removes nothing". Since #5461 the message is drawn on screen (see RL-20). |
| `[modes/M-R3-15]` | PASS · live | phone-4 "a tap on a photo in Automatic says why" + "…where the person is looking: fully on screen". The top was at −564 before #5461; it is at 14–50 of 844 after. (partial: the position was measured after the photo tap only. The words tap, phone-6 "a tap on words in Automatic says why", is checked on its text; it uses the same message element) |
| `[modes/M-R3-16]` | COVERED · harness/unit only | unit "Automatic without a run of show is refused, not silently empty (10a M-R3-16)"; story-arrangement "back to Automatic brings back a run-of-show moment the host REMOVED by hand". |
| `[modes/M-R3-17]` | PASS · live | desk-6 + phone-6 "Automatic deals no photo under the host's words (M-R3-17 · M-R5-08)". |
| `[modes/M-R4-07]` | PASS · live | phone-4 "put all back · no sideways scroll" + "everything in the tray · no sideways scroll"; phone-6 "…and + New too (P12)". |
| `[modes/M-R5-08]` | PASS · live | desk-6 + phone-6 "Automatic deals no photo under the host's words", 0 under words. |
| `[modes/M-NS-03]` | COVERED · harness/unit only | harness "the note links to the schedule" (the href ends in /schedule). The live event has a run of show (the SKIP line in desk-4 and phone-4), so this item has not run live. It will be driven live tomorrow (2026-09-12) on a new celebration that has no schedule. |
| `[moments-sets/B6]` | PASS · live | desk-6 "…its row × stays on screen (B6 · P11)" after a 60-character one-word rename. |
| `[moments-sets/F12]` | PASS · live | desk-6 + phone-6 "chip × forgets the name, with Undo, and every photo stays put". (partial: there is no in-place rename; you forget the name and name the photos again) |
| `[moments-sets/G1-Enter]` | PASS · live | desk-4 + phone-4 "a double Enter adds ONE photo". |
| `[moments-sets/G1-Space]` | PASS · live | desk-4 + phone-4 "a double Space adds ONE photo". |
| `[moments-sets/H1]` | PASS · live | desk-4 "arrow keys walk the moments" + "Enter opens a moment". |
| `[moments-sets/H2]` | PASS · live | desk-6 "Alt+ArrowDown moves the moment down one (H2)" + "…and the keyboard stays on it". |
| `[moments-sets/I1]` | COVERED · harness/unit only | story-arrangement "back to Automatic brings back a run-of-show moment the host REMOVED by hand"; unit M-R3-16 refusal. |
| `[moments-sets/P9]` | PASS · live | phone-6 "the grip reorders moments (finger) (P9)". It is a plain touch drag, with no long-press. |
| `[moments-sets/P11]` | PASS · live | phone-6 "…its row × stays on screen (B6 · P11)" + "…and + New too (P12)". |
| `[moments-sets/P12]` | PASS · live | phone-6 "…and + New too (P12)"; phone-4 "everything in the tray · no sideways scroll". |
| `[chaos/chaos-01]` | PASS · live | desk-gaps "a strict 150-action monkey on the LIVE page…": 0 violations, 0 new errors, 0 dialogs. 20260910 is the desk's default seed in `live-10a-gaps.cjs`; the log does not print the seed. (partial: the live monkey chooses from a narrower set of actions than the prototype's; see Key) |
| `[chaos/chaos-02]` | PASS · live | phone-gaps ran a 200-action monkey, and `run-phone-monkey-777.log`, `-4242.log` and `-99.log` ran 150 actions each: 0 violations, 0 errors, 0 dialogs. **Caveat:** in the first phone gaps run (`run-phone-gaps.log`, 33/35), the 150-action monkey found 0 violations but logged one pair of page errors: React #418 (a hydration mismatch) and "Cannot read properties of null (reading 'parentNode')". The pair did not come back in the 650 monkey actions run since (the 200 plus 3 × 150 above), nor in 20 plain reloads (`probe-reloads.cjs`; that output was not kept in `out/`). **Root cause found and fixed 2026-09-12 (PR #5473)** for the public story page, where #418 appeared in 6 of 32 loads (`probe-hydration-after5462.log`): the root layout's first `<head>` script took a plain string from a `'use client'` module, so the payload carried a client reference; when that file had not loaded, React paused inside `<head>`, replayed it, and lost its body cursor. The value moved to a plain module and a guard (`lib/a-server-file-never-takes-a-value-from-a-client-module.test.ts`) keeps it that way. ⚠ **This chaos-02 pair is a DIFFERENT page and is still unexplained** — the Story Maker shares the root layout's `<head>`, so it is SUSPECTED to be the same cause, but that is a suspicion, not a measurement. Re-drive it once #5473 is served. |
| `[chaos/chaos-04]` | N/A · prototype-only | The port has no 140ms delayed tray redraw (see DW-09). Emptying words and then tapping the tray is driven: DW-18 PASS. |
| `[chaos/chaos-05]` | PASS · live | desk-4 + phone-4 "a double Enter adds ONE photo" + "a held Enter adds ONE photo". |
| `[chaos/chaos-06]` | COVERED · harness/unit only | A photo cannot be doubled: unit "ONE PHOTOGRAPH, ONE PLACE"; story-arrangement "a save that puts one photo TWICE on one page is refused". |
| `[chaos/chaos-08]` | PASS · live | desk-4 + phone-4 "the sheet grows downward to meet it" + "a photo dragged to the bottom is not cut off". |
| `[chaos/chaos-09]` | PASS · live | desk-gaps + phone-gaps "a 60-character hashtag stays inside the page (RL-15 · chaos-09)" + "…and nothing scrolls sideways, the page or the desk": the page 0px and the desk 0px wider than its box, so there is nothing for the caret to slide. |
| `[chaos/chaos-10]` | PASS · live | phone-4 "everything in the tray · no sideways scroll — 390 vs 390". |
| `[chaos/chaos-11]` | PASS · live | phone-4: a full tray never makes the page too wide; phone-6 "pressing the chip places its free photos on this page". (partial: where they landed was not measured) |
| `[chaos/chaos-12]` | PASS · live | desk-gaps "narrowing the window while typing leaves nothing outside the page (RL-17 · chaos-12)": 1280 → 390 mid-typing, 0 outside. Plus "…and moves nothing, once it is wide again". |
| `[chaos/chaos-13]` | PASS · live | desk-gaps + phone-gaps "four-line words dragged to the bottom are not cut off — the page grows to hold them (RL-14 · chaos-13)" (see RL-14). |
| `[chaos/chaos-14]` | PASS · live | phone-6 "[s6 a 60-character one-word name] no sideways scroll" + "row × stays on screen". (partial: the renamed moment had no start time) |
| `[chaos/chaos-15]` | PASS · live | desk-4 + phone-4 "a resize moves nothing" in I choose, through narrowing and widening again. desk-gaps "…and moves nothing, once it is wide again (RL-17 · chaos-12 · chaos-15)", this time narrowed while typing. |
| `[chaos/chaos-16]` | PASS · live | desk-6 + phone-6: DW-18 "…that same tap still places the photo", DW-17 "it opens", DW-21 "the photo goes". |
| `[chaos/chaos-17]` | PASS · live | desk-gaps "a press on a photo takes the caret out of the words (DW-22 · chaos-17)" + "…so Backspace takes the photo off and leaves the words as they were"; phone-gaps drives the first half. (partial: the photo was clicked, not dragged) |

## Round 1 critic (20)

| 10a item | status | evidence |
|---|---|---|
| `[critic-1]` | PASS · live | desk-6 + phone-6 "row × removes the moment and says its photos are back" + "…Undo brings the moment, its photos AND its words back (critic-1)". |
| `[critic-2]` | COVERED · harness/unit only | story-arrangement "back to Automatic brings back a run-of-show moment the host REMOVED by hand"; unit "row × takes the moment away…". |
| `[critic-3]` | N/A · prototype-only | The port never opens a browser pop-up: guard "no browser pop-up anywhere". Every log, including the monkeys, shows "zero dialogs", and the name fields are inline (desk-6, phone-6). |
| `[critic-4]` | PASS · live | desk-6 + phone-6 "the toolbar's remove takes the words off, with Undo" + "…and Undo puts them back". (partial: pressing the grip then Backspace, and the desk words ×, were not driven) |
| `[critic-5]` | PASS · live | desk-4 + phone-4 "every change is saved without pressing Save", after "Saved", then "reload gives back exactly what was arranged". The port has no Save button. |
| `[critic-6]` | PASS · live | desk-gaps "a moment row dropped on the words types nothing into them (critic-6)": a real mouse drag of a row's ⋮⋮ grip, released over the words, leaves the text unchanged. Rows reorder by pointer capture (guard "the grip reorder captures the pointer on the LIST"). Desk only. |
| `[critic-7]` | PASS · live | desk-6 + phone-6 "…with a drawn placeholder, not typed text (critic-7)" + "an empty box left by a tray tap goes quietly". |
| `[critic-8]` | COVERED · harness/unit only | This item is about a spec example. story-arrangement "Automatic sorts every capture into the run-of-show moment that had ALREADY STARTED" pins the rule. |
| `[critic-9]` | PASS · live | desk-6 + phone-6 "+ Words in Automatic says why (critic-9)" + "Name these photos in Automatic says why (critic-9)". (partial: the one-photo case in I choose was not pressed) |
| `[critic-10]` | PASS · live | desk-4 "focus stays on the page after a keyboard removal — photo". |
| `[critic-11]` | PASS · live | desk-gaps "the moment-row × is ≥ 28px, with no invisible halo" measures 28×28. phone-gaps runs the same check at ≥ 36px and measures 36×36, up from the prototype's 26. Neither reaches the 44px the item compares against. The photo × no longer has a 44px halo either (round 3 removed halos because they stole presses), so the two now match. |
| `[critic-12]` | PASS · live | desk-gaps + phone-gaps "the small print is ≥ 4.5:1 (critic-12 · r3 R13)": 14 texts measured, none below 4.5. The probes cover the lede, moment times, photo-count pills, tray labels, the mode note and the tray/page texts, where they are shown. (partial: the log gives the count, not which texts were measured; the empty-page instruction only exists on an empty page) |
| `[critic-13]` | PASS · live | desk-6 + phone-6 "a paste is plain text only (critic-13)"; guard "a paste into words is plain text only". |
| `[critic-14]` | PASS · live | desk-6 "arrow keys move focused words (critic-14)"; desk-4 "arrows move the focused photo". |
| `[critic-15]` | PASS · live | desk-6 + phone-6 "the chip shows what is still free to place (critic-15)" + "naming again with the same name keeps ONE chip". (partial: a photo in two sets, and duplicate moment names, were not tried) |
| `[critic-16]` | N/A · prototype-only | The port parses no time strings: run-of-show starts are millisecond timestamps (`startMs`). |
| `[critic-17]` | PASS · live | desk-6 + phone-6 "a tap on words in Automatic says why — Tap “I choose” to change words." (partial: the opening instruction text is not checked) |
| `[critic-18]` | PASS · live | phone-4 "a swipe on a photo in Automatic scrolls the page — scrollY 663 → 833". |
| `[critic-19]` | PASS · live | desk-4 + phone-4 "the tray keeps its place after a tap (does not snap back to the start)". |
| `[critic-20]` | PASS · live | desk-gaps + phone-gaps "a repeated refusal is a NEW message node, so a screen reader says it again (critic-20)". Also "with reduced motion the nudge on "I choose" is still, and still visible": no animation, and a 2px terracotta ring. (partial: no screen reader was run; the check proves the mechanism a screen reader relies on) |

## Round 3 (74)

| 10a item | status | evidence |
|---|---|---|
| `[r3/place-reach/R1-held-enter]` | PASS · live | desk-4 + phone-4 "a held Enter adds ONE photo" (real key auto-repeat); guard "a held key acts once". |
| `[r3/place-reach/R1-empty-new-moment-field-swallows-tray-tap]` | PASS · live | desk-6 + phone-6 "+ New left empty, then ONE tap on the tray: the moment is cancelled…" + "…and the tap still places the photo (R8)". |
| `[r3/place-reach/R2-neighbour-x-stolen-by-selected-photo]` | PASS · live | desk-4 + phone-4: a just-dragged photo sits over a neighbour's corner, then "a × under a neighbour is still on top…" + "pressing it takes off THAT photo". |
| `[r3/place-reach/R2-handle-swallows-x]` | PASS · live | phone-6 "on a phone the handle and the words' × give way to the toolbar" (the caption half; the sticker half is N/A). |
| `[r3/place-reach/R2-phone-tap-near-x-removes-photo]` | PASS · live | phone-4 "a tap beside the × selects the photo and keeps it — 5 → 5". |
| `[r3/place-reach/R2-turned-x-reads-plus]` | PASS · live | desk-6 "a turned caption's × is turned back upright" (the caption half; the phone has no words ×). |
| `[r3/place-reach/R11-turned-words-cut-off]` | PASS · live | desk-6 "the round handle resizes the words" / "snaps straight within 5°" / "…and keeps the words on the sheet"; unit "turning a caption near the top re-clamps it". |
| `[r3/place-reach/R11-turned-sticker-outline-cut]` | N/A · stickers | Stickers only; guard "no stickers". |
| `[r3/place-reach/R11-long-name-toast-offscreen]` | NOT RE-DRIVEN | This was FAIL · live because every toast was drawn off-screen. Since #5461 the toast is on screen (desk-4 + phone-4 "…fully on screen", see RL-20). But no run removes a moment with a long one-word name, and the gaps run does not either: its 60-character hashtag is words, not a moment. The source gives the toast `max-width: calc(100vw - 32px)` and `overflow-wrap: anywhere`, but no guard checks either. |
| `[r3/place-reach/R13-dark-accent-fill-text]` | PASS · live (light-locked) | Dark cannot render (owner light-lock 2026-06-04; the four `DARK=1` runs match the light runs). In the one theme, white on the terracotta fill (#C24E25, as on the open moment's photo-count pill) is 4.76:1. desk-gaps measured exactly that colour pair from the live colours, in "the terracotta mini buttons are ≥ 4.5:1 while hovered". R13-start-over-and-mini-hover explains why that number is the pair, not the hover. |
| `[r3/place-reach/R13-dark-placeholders]` | PASS · live (light-locked) | desk-gaps + phone-gaps "the name field's placeholder is ≥ 4.5:1 (r3 R13-dark-placeholders, in the only theme)": 5.44:1 (`--mute` on the field's own opaque white). Dark cannot render (owner light-lock 2026-06-04). |
| `[r3/place-reach/R13-selected-words-on-tint]` | NOT RE-DRIVEN | Nothing measures words while they are selected, and the gaps run does not either. This is not a dark-only item, so the light-lock does not settle it. Using the source's colours, Terracotta words on the selection tint (`--act-soft`, 10% terracotta over white) come to about 4.16:1 and Gold words to about 4.33:1. Both are under 4.5 for 19px text. This is arithmetic, not a live measurement. |
| `[r3/place-reach/R13-start-over-and-mini-hover]` | NOT RE-DRIVEN | The port has no 'Start over'. desk-gaps "the terracotta mini buttons are ≥ 4.5:1 while hovered" reads 4.76:1 for + New, ✎ and Put all back. But that number is terracotta on white: the helper skips any background under 50% opacity, so it ignored the 10% terracotta tint that `.mini:hover` paints. With the tint included, the same colours come to about 4.16:1, under 4.5 for 12px text. This is likely a real (cosmetic) defect, and it needs a measurement that includes the tint. |
| `[r3/place-reach/R6-phone-words-grip-press-goes-to-text]` | PASS · live | phone-6 "the ⋮⋮ grip drags the words (R6 grip press)", 20,130 → 170,44; guard grip rule. |
| `[r3/words-drag-looks/R6-phone-words-grip-press-becomes-caret]` | PASS · live | phone-6 "the ⋮⋮ grip drags the words" + "…and the caret is not left in the text". |
| `[r3/words-drag-looks/R6-phone-new-sticker-cannot-be-dragged]` | N/A · stickers | Stickers only. |
| `[r3/words-drag-looks/R6-phone-tap-photo-removes-it]` | PASS · live | phone-4 "a tap beside the × selects the photo and keeps it". |
| `[r3/words-drag-looks/R6-arrows-just-added-sticker]` | N/A · stickers | Stickers only. |
| `[r3/words-drag-looks/R6-keyboard-only-words]` | PASS · live | desk-6 "arrow keys move focused words (critic-14)". The drive set focus by script, not with Tab. |
| `[r3/words-drag-looks/R6-fonts-arrive-mid-drag]` | NOT RE-DRIVEN | No run uses slow-loading fonts, and the gaps run does not either. In the source, `fonts.ready` only re-measures words and does not redraw. |
| `[r3/words-drag-looks/R7-phone-tap-short-caption-removes-it]` | PASS · live | phone-6 "tapping into a caption places the caret, never removes it (R7-phone-tap)". |
| `[r3/words-drag-looks/R7-lowest-empty-box-swallows-press]` | PASS · live | desk-6 + phone-6 "an empty box that made the page tall leaves, and the press near a tray photo's edge still lands (R7)". |
| `[r3/words-drag-looks/R7-tab-from-empty-box]` | PASS · live | desk-6 "Tab from an empty new box moves to the next control, not the page top (R7)". |
| `[r3/words-drag-looks/R14-empty-box-own-grip-handle-x-throws]` | PASS · live | desk-6 + phone-6 "pressing a new empty box's own grip keeps it (R14)" + "zero console errors". (partial: the empty box's handle was not pressed) |
| `[r3/words-drag-looks/R16-stale-look-row]` | PASS · live | desk-gaps + phone-gaps "(a new empty box brings its toolbar)" + "the empty box leaves and its toolbar goes with it (r3 R16-stale-look-row)": after a press on another moment, the toolbar is hidden and 0 boxes remain. |
| `[r3/words-drag-looks/R16-keyboard-reach-looks]` | PASS · live | desk-6 "the keyboard reaches the toolbar and Enter resizes (critic test 5)". (partial: colour and background were not operated by keyboard) |
| `[r3/words-drag-looks/R11-turned-objects-leave-sheet]` | PASS · live | desk-6 + phone-6 "turned words stay on the sheet (R11 · chaos-r3-08)"; desk-6 "…and keeps the words on the sheet" (handle). |
| `[r3/modes-moments/R5-undo-eaten-by-refusal]` | PASS · live | desk-4 + phone-4 "a refusal message keeps the live Undo" (the moment-× variant was not driven). |
| `[r3/modes-moments/R5-reload-forgets-hand-changes]` | PASS · live | desk-gaps + phone-gaps "after a reload, Back to Automatic still offers Undo for the hand-made pages (r3 R5-reload · F2 · chaos-r3-02)" + "…and that Undo brings the hand arrangement back". The drive moved a photo by hand, waited for the save, then reloaded. |
| `[r3/modes-moments/R17-undo-discards-later-work]` | PASS · live | desk-4 + phone-4 "a later change retires the Undo" + "…so Cmd+Z then does nothing". |
| `[r3/modes-moments/R8-new-empty-swallows-tap]` | PASS · live | desk-6 + phone-6 "+ New left empty, then ONE tap on the tray…" + "…and the tap still places the photo (R8)". |
| `[r3/modes-moments/R8-new-moment-id-collision-after-reload]` | COVERED · harness/unit only | unit "+ New adds a moment … with a random id (10a F11)"; story-arrangement "a repeated moment or object id is refused". |
| `[r3/modes-moments/R9-backspace-after-naming-removes-photo]` | PASS · live | desk-6 + phone-6 "…and a Backspace right after naming takes nothing off (R9)". |
| `[r3/modes-moments/R9-name-field-outlives-its-context]` | PASS · live | desk-gaps + phone-gaps "the set-name field closes when the mode switches" + "…closes on + New" + "…closes when fewer than 2 photos are left" (all three tagged r3 R9-name-field-outlives-its-context). desk-6 + phone-6 "the set-name field closes when the moment changes". |
| `[r3/modes-moments/R18-saved-stays-after-add-schedule]` | N/A · prototype-only | In the port, 'Add your schedule' is a link to the schedule page. It adds nothing in place, and the port has no Save button. |
| `[r3/modes-moments/R3-delete-hint-wording-sticker]` | N/A · stickers | Stickers only. The words version passes: desk-6 "Delete on words in Automatic says why and removes nothing (r3 R3-delete-hint)". |
| `[r3/stickers-undo/F1]` | PASS · live | desk-4 + phone-4 "a later change retires the Undo" + "…so Cmd+Z then does nothing". |
| `[r3/stickers-undo/F2]` | PASS · live | Same as R5-reload-forgets-hand-changes: desk-gaps + phone-gaps "after a reload, Back to Automatic still offers Undo…" + "…and that Undo brings the hand arrangement back". |
| `[r3/stickers-undo/F3]` | PASS · live | desk-4 "a held Delete removes ONE photo — 5 → 4" (the photo half); guard "a held key acts once". |
| `[r3/stickers-undo/F4]` | PASS · live | desk-4 + phone-4 "a refusal message keeps the live Undo". |
| `[r3/stickers-undo/F5]` | COVERED · harness/unit only | Undo with the name field open was never driven. unit "a set needs two photos on the page, and one chip per name". desk-gaps + phone-gaps "the set-name field closes when fewer than 2 photos are left" shows live that the field cannot stay open to save a one-photo set. |
| `[r3/stickers-undo/F6]` | N/A · stickers | Stickers only. |
| `[r3/stickers-undo/F7]` | N/A · stickers | Stickers only. |
| `[r3/stickers-undo/F8]` | N/A · stickers | Stickers only (a sticker's targets over a photo's ×). |
| `[r3/stickers-undo/F13]` | N/A · stickers | Stickers only. |
| `[r3/stickers-undo/F10]` | N/A · stickers | Stickers only (a double tap on a sticker). |
| `[r3/stickers-undo/F11]` | COVERED · harness/unit only | unit "+ New adds a moment … with a random id (10a F11)"; story-arrangement "…the reload collision of 10a R8 / F11". |
| `[r3/stickers-undo/F9]` | N/A · stickers | Stickers only. |
| `[r3/stickers-undo/F12]` | N/A · stickers | Stickers only. |
| `[r3/stickers-undo/F14]` | PASS · live | desk-gaps + phone-gaps "a dropped photo does not replay its landing animation — no blink (r3 F14)": 60ms after the drop, no landing animation is running and opacity is 1. This covers the photo half; stickers are off. |
| `[r3/chaos/chaos-r3-01]` | PASS · live | The desk-gaps 150-action monkey, the phone-gaps 200-action monkey and the three 150-action phone monkeys: 0 violations, 0 errors, 0 dialogs, with a reload every 50 actions. (partial: each run is 150–200 actions, not 500, drawn from a narrower set of controls, with no × reachability check; see Key. For the one error in the first phone run, see chaos-02) |
| `[r3/chaos/chaos-r3-02]` | PASS · live | Same as R5-reload-forgets-hand-changes: desk-gaps + phone-gaps, now asserted. |
| `[r3/chaos/chaos-r3-03]` | COVERED · harness/unit only | Same as R8-new-moment-id-collision: ids are random `own:` ids, and a repeated id is refused. |
| `[r3/chaos/chaos-r3-04]` | PASS · live | desk-6 + phone-6 "pressing a new empty box's own grip keeps it (R14)" + "zero console errors". (partial: the handle was not pressed) |
| `[r3/chaos/chaos-r3-05]` | PASS · live | desk-4 + phone-4 "pressing it takes off THAT photo, not the neighbour", with the moved photo selected; guard "the × has no invisible halo". |
| `[r3/chaos/chaos-r3-06]` | PASS · live | phone-6 "…handle and the words' × give way to the toolbar" + "the toolbar's remove takes the words off, with Undo". |
| `[r3/chaos/chaos-r3-07]` | N/A · stickers | Stickers only. |
| `[r3/chaos/chaos-r3-08]` | PASS · live | desk-6 + phone-6 "turned words stay on the sheet (R11 · chaos-r3-08)"; unit "a TURNED caption stays on the sheet by its TURNED box". |
| `[r3/chaos/chaos-r3-09]` | PASS · live | desk-gaps "a turned caption's × stays on top of a photo laid over it (chaos-r3-09)": the caption is turned 30°, a photo is dragged over its × corner, and the × centre still hit-tests to the words. The FAIL in `run-desk-gaps.log` ("hit HEADER") came from the point sitting under the site's fixed header; r2 scrolls clear of it first. The phone has no words × (RL-16). |
| `[r3/chaos/chaos-r3-10]` | PASS · live | desk-6 "Cmd/Ctrl+Z during a grip drag never lists a moment twice (chaos-r3-10)". |
| `[r3/chaos/chaos-r3-11]` | PASS · live | desk-4 + phone-4 "a later change retires the Undo" + "…so Cmd+Z then does nothing". |
| `[r3/chaos/chaos-r3-12]` | PASS · live | desk-4 + phone-4 "a refusal message keeps the live Undo". |
| `[r3/chaos/chaos-r3-14]` | NOT RE-DRIVEN | This was FAIL · live because the toast was drawn off-screen. Since #5461 it is on screen (see RL-20). The 60-character moment is named in desk-6 and phone-6 but never removed (the row × is pressed on "Dinner"), and no gaps check removes it. So how its toast wraps has not been driven. In the source, the toast has `overflow-wrap: anywhere` and `max-width: calc(100vw - 32px)`, and no guard checks either. |
| `[r3/critic] CRITIC TEST 1` | N/A · prototype-only | The port has no 'Start over' control (0 hits in `make-it-yours.tsx`). |
| `[r3/critic] CRITIC TEST 2` | PASS · live | desk-4 + phone-4 "every change is saved without pressing Save" + "reload gives back exactly what was arranged". |
| `[r3/critic] CRITIC TEST 3` | PASS · live | desk-6 + phone-6 "clearing a caption and leaving it removes it WITH Undo" + "…and Undo brings the words back as they were". |
| `[r3/critic] CRITIC TEST 4` | PASS · live | phone-gaps "with the Undo toast up, a tap on the tray still lands (r3 CRITIC TEST 4)". The toast takes no press (pointer-events none) and sits at 14–74, at the top of the screen, and the tray tap places the photo (tray 1 → 0). Also desk-4 + phone-4 "a tap on the tray lands while the Undo toast is up and the page just shrank". |
| `[r3/critic] CRITIC TEST 5` | PASS · live | desk-6 "the keyboard reaches the toolbar and Enter resizes (critic test 5)". |
| `[r3/critic] CRITIC TEST 6` | PASS · live | desk-gaps + phone-gaps "a host-added moment in Automatic says Automatic leaves it alone — never "no photo falls in it" (r3 CRITIC TEST 6)". The page says: "Automatic leaves moments you added alone — tap I choose to put photos here." (partial: removing that moment while in Automatic was not tried; the message sends the host to I choose, where its row × is) |
| `[r3/critic] NOT RUN — Switching away from the window…` | COVERED · harness/unit only | guard "leaving the window is not leaving the words or the name field". |
| `[r3/critic] NOT RUN — A ?noschedule page…` | N/A · prototype-only | The port has no `?noschedule` parameter; whether there is a run of show comes from the real schedule. |
| `[r3/critic] NOT RUN — Set-name messages…` | NOT RE-DRIVEN | This was FAIL · live because the toast was drawn off-screen. Since #5461 it is on screen (see RL-20). desk-6 + phone-6 show "Named “The entourage”" and "Name “The entourage” removed · the photos stay put". But no run tried a long set name, the gaps run included, so the wrapping this item is about has not been driven. The source has `overflow-wrap: anywhere`, unguarded. |
| `[r3/critic] NOT RUN — A named-set chip reads 'Name · N'…` | PASS · live | desk-6 + phone-6 "the chip shows what is still free to place (critic-15)", "The entourage · 2". |
| `[r3/critic — OPEN] NOT RUN — Accessibility structure` | PASS · live | desk-6 + phone-6 "no row is a button, and no button sits inside another". The handle is aria-hidden, not a slider. |
