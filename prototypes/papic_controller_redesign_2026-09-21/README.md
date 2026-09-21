# Papic controller redesign — interactive prototype (2026-09-21)

**Status: PROPOSAL, owner-reviewed, not built.** No code changed. Owner said the method was done
correctly and asked to save it for later, on a different Claude Code account.

**Page:** the Papic **controller** = `/dashboard/[eventId]/studio/papic`, where a couple sets up
and buys Papic. It is NOT the Papic section on the Event Hub.

**Method:** [`../../REDESIGN_PAGE_PROMPT_2026-09-21.md`](../../REDESIGN_PAGE_PROMPT_2026-09-21.md)
— use it for every future page redesign.

## Files
| File | What it is |
|---|---|
| `Main.dc.html` | The redesign, phone 390×844, fully interactive (every row works) |
| `Today.dc.html` | The live page as measured 2026-09-21: 1,149 words · 56 buttons · 17 blocks |
| `canvas.json` | The Design-canvas index (board positions, titles, the order note) |

**To reopen it on any account:** ask Claude to create a new Design canvas Artifact and publish
these three files under `project/` (`project/Main.dc.html`, `project/Today.dc.html`,
`project/canvas.json`). The original artifact
(`claude.ai/artifact/PgdPC2SdJGGQ332tFNXVsG`) is private to the first account.

## What the prototype shows (top to bottom, as built)
1. **Dates**: folds to one line once saved
2. **Credits**: − / + over the 17 live price rungs (₱70 / 100 → ₱24,000 / 100,000, read off prod
   2026-09-21; in code from `platform_retail_catalog_v2`), Buy → GCash/BDO → "I've paid" → pending
3. **Guests' shots**: when guests shoot · limit per guest · crew cameras (own credits per camera)
4. **Filter**: the 5 real looks from `lib/papic-photo-styles.ts`, previewed with their CSS
5. **Challenges**: real prompts from the challenge library, pick up to 9
6. **Gallery**: filters · tap to keep full size · download · review guest photos · guests can browse
7. **Kwento**: guest messages (show on wall / hide) · Kwento Magazine PDF
8. **Live wall**: style · on guests' phones · screen code
9. **More**: finding people · adding by hand · Google Drive · DSLR & help

## Agreed correction to the order (NOT yet applied to `Main.dc.html`)
The owner asked "is the order correct?" and the answer was no, for two reasons. **Apply this first when
picking it back up:**

| Before the event (setting up) | On the day and after (using it) |
|---|---|
| 1 Dates | 1 Gallery |
| 2 Guests' shots | 2 Kwento |
| 3 Credits (sized by the choices above) | 3 Live wall |
| 4 Filter | 4 Credits (top-ups) |
| 5 Challenges | 5 Guests' shots, Filter, Challenges, collapsed to one line each |
| 6 Gallery, Kwento, Live wall | 6 More |
| 7 More | |

- Credits must come after Guests' shots, because a couple can't size a purchase before deciding
  who shoots. It also follows the approved design's rule to put money beside the cameras that spend it.
- The order flips on the capture dates, matching the approved date-aware drawing
  `prototypes/papic_control_center_2026-08-25.html` (one page, NO tabs; tabs ruled out
  DECISION_LOG 2026-08-27).

## Still to do
- **Desktop board** (owner: "also consider desktop view"; deferred "not now"): 1440×900 inside
  the real shell, flow in a wide left column, status + credits + Buy in a sticky right column,
  sheets → side drawers, gallery 6 across.
- **Placeholders:** guest messages, review photos, photo tiles, screen code `[CODE]`. The payment
  sheet is a guess: prod's "Continue to payment" was deliberately not pressed.

## Open owner decisions
1. "Credits" (approved drawing) vs "shots" (live stepper): pick one word everywhere.
2. Confirm the before/after order above.
