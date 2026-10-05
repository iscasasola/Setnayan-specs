# Wedding March — drag-and-drop march maker · prototype · 2026-10-06

**File:** `wedding_march_drag_maker_2026-10-06_fable.html` (self-contained; Google Fonts only).
**Screenshots:** `…-phone.jpg` (375, mid-drag) · `…-desktop.jpg` (1440 Maker with its right panel).
**Decisions it draws:** DECISION_LOG 2026-10-06 "THE WEDDING MARCH ITEM IS A DRAG-AND-DROP MARCH MAKER — NOT A LIST OF NAMES" ·
2026-10-01 "A WALK AND A COUPLE ARE INDEPENDENT" · 2026-10-01 "THE GUEST LIST IS ONE PERSON PER ROW".
Owner refinements folded in the same night: *"wedding should be the 2 columns that can drag names on both sides"* ·
*"walk alone will separate the 2 guests"* · the word is **walk alone** (never "solo").

## What it shows

- **The navigator holds ONE item, "Wedding March."** It never expands into names (phone: the collapsed column in the
  lower third; desktop: one row in the Details list, with a note). Opening it shows the maker.
- **The march is two columns — the left and the right of the aisle.** Every walk is one numbered row with a LEFT
  slot and a RIGHT slot. Two names = they walk together. One name + an empty slot = that person **walks alone**.
  Sections span both columns: **The Groom & his parents** (groom's parents, then the groom) · Immediate Family ·
  Maid of Honor & Best Man · Principal Sponsors · Secondary Sponsors · Bearers · Flower Girls · **The Bride & her
  parents** (her mother, then her father with the bride — LAST). Owner: *"wedding march handles everyone including
  the groom and the bride … and the parents."* The groom and the bride are ordinary draggable names (gold-edged,
  role under the name). 22 walks, 37 names with titles (Hon. · Atty. · USec. · Dr. · Engr. · Mr./Mrs./Ms.), never
  truncated (chips wrap).
- **"Not walking"** — people with an entourage role who are not yet in the march. Phone: the tray is the tool in the
  lower third (thumb zone), the march is the workspace. Desktop: the tray is the right panel; the march is the page.
- **No toolbar, no buttons, no ↑/↓.** Everything is a drag of a name. Apply badge counts the changes.
- Walking together says nothing about being a couple; no couple language anywhere.

## The gestures (all verified by script at 375 touch and 1440 mouse)

| drag a name… | what happens | toast |
|---|---|---|
| onto another name (same column or across the aisle) | they trade places | "A and B traded places" |
| into the line between two walks — left half or right half | it becomes its own walk there, on that side; a partner left behind now walks alone | "A moved to step N, left · B now walks alone" |
| into the line **right above or below its own pair** | the pair **splits into two rows, one after the other** (owner: "walk alone will separate the 2 guests") | "A and B now walk alone" |
| onto the empty slot beside someone walking alone | they walk together (the row closes) | "A and B walk together" |
| down/over to **Not walking** (anywhere on the tray, even onto a name there) | out of the march; a partner left behind walks alone | "A is not walking · B now walks alone" |
| from Not walking into a gap / an empty slot | added — walks alone / walks with that person | "A added · walks alone at step N, left" |
| from Not walking onto a name in the march | takes their place; that person is not walking | "A takes B's place · B is not walking" |
| onto itself, or an alone walker onto its own adjacent gap on the same side | nothing (no target shown) | — |

Feedback: gold ring on the target name / slot / tray; a gold line on the targeted half of the gap; the lifted name
follows the finger as a raised ghost and lands with a 220 ms settle; rows re-flow with a 260 ms FLIP; every toast has
**Undo** (one level).

Touch: **long-press ~250 ms lifts** a name (a short haptic where supported); a plain swipe still scrolls. Auto-scroll
when the finger nears the top/bottom edge of the list. `touch-action: pan-y` on names; `touchmove` is blocked only
while a name is lifted.

## Build notes (for the Opus builder)

- Every move maps to the shipped march actions: swap → `swapEntouragePlaces`; gap → `setEntourageLineOrder`
  (+ `unpairGuestAction` when leaving a pair); empty slot → `joinEntourageLine`; tray → remove from the line /
  `joinEntourageLine` to add. The **side** (left/right) is new state the two-column layout needs — confirm where it
  lives before building (sponsor pairs today are index-paired on the Sponsors page).
- Reuse the Maker's lower-third chrome from `maker_lower_third_interactive_2026-10-05_fable.html`; this file reuses
  its tokens, radii and pills.
- Copy rules honoured: "event" never "celebration"; never "website"; "walk alone" never "solo"; no "couple".
