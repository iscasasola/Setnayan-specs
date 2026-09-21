# Event overview — redesign prototype (2026-09-22)

**Route:** `/dashboard/[eventId]` — the couple's event Home / Overview.
Not the Event Hub Controller (`GO LIVE` in the rail), not the public event page.

Built with the method in `REDESIGN_PAGE_PROMPT_2026-09-21.md`, copying the shape of
`prototypes/papic_controller_redesign_2026-09-21/papic-controller-prototype.html`.

**File:** `event-overview-prototype.html` — one file, opens in any browser, phone and desktop.
Prototype bar at the top switches the moment: **Planning · On the day · After**.

## What it is measured against

Live page, `www.setnayan.com/dashboard/044f7e64-95aa-4dcb-84c1-7263bf494eaa`, read 2026-09-22
signed in as the host of *Indalecio & Claire* — 87 days out, Setnayan AI **active**.

| | Live | Redesign |
|---|---|---|
| Words in `<main>` | 662 | 323 |
| Controls | 40 | 50 (14 of them inside panels/expanded rows) |
| Phone height @375 | 5,204px ≈ **6.2 screens** | 2,305px ≈ **2.8 screens** |
| Desktop height @1440 | 3,165px | ~1,350px |
| Blocks before the first action | 5 | 2 |

## The scatter it fixes (all measured on the live page, not asserted)

- **"Lock your coordinator" renders three times** — the digest preview, "Today's one thing",
  and the Decisions board — all three linking to the same `/explore?tile=coordinator&from=plan`.
- **"Papic Guest 500 · ₱350 pending" renders three times** — digest, Decisions board, and again
  inside *Your services* when expanded.
- **The digest panel is a preview of the section immediately below it.** "All 9 decisions ↗" is
  a jump-anchor to a list already on screen.
- **The same two schedule blocks render three times** — the `SCHEDULE · NEXT` mini, the
  "Dates coming up" rows, and the *Schedule* band card.
- **"9 open decisions" is inflated by six recommended deadlines.** A date is not a decision:
  nothing is resolved by reading it. Here they are their own block, `Coming up · 6 dates`,
  and the count the page leads with is **4** — the four things only the couple can close.
- ~180 of the 662 words are description carrying no fact.

## Rulings honoured (found before designing — do not re-ask)

- **2026-07-13, owner override:** *"when cells are clicked it loads the whole SCREEN instead of
  expanding the place where it should only load"* → dashboard cells **expand in place**
  (`<ExpandCard>`, PR #3214). This **reversed** the 2026-07-12 council's "depth = navigation, no
  accordion" finding. The band in this prototype expands inline — it is not a stretched link and
  not a drawer. *(Nothing after 2026-07-13 reverses this; the log was swept to 2026-09-21.)*
- **2026-07-12 council** (`Event_Overview_Council_Verdict_2026-07-12.md`), still standing on every
  other point: STATUS → ACT → NAVIGATE; decisions above, journey rail below the band; inbox is not
  a decision; one global supplier-masking note, not per-card legalese; endowed states, never 0%;
  amber for urgency, never gold; **no inline checkout or AI paywall teaser on the free Overview**.
- **`CLAUDE_DESIGN_02_Event_Dashboard_2026-08-07.md` §3B** — the posture ladder (just started /
  deep in planning / last week / the day / after) is why the prototype ships three moments rather
  than one.

## Order

**Planning** — The day → Needs you → Coming up → Your numbers → Around your event → Progress.
**On the day** — Right now → The day → *(planning folds to one line each)* → Around your event.
**After** — That's a wrap → Around your event → Budget → Progress → *(planning folds)*.

Desktop keeps the flow in the wide left column and pins **The day + Your numbers + Sai's watch**
in a sticky right column, so status is in view at every scroll position.

## Placeholders

Everything in `[SQUARE BRACKETS]`. All of it belongs to the day-of and after states, which this
event cannot show — it is 87 days out: what's happening now, the head table, the live wall, the
coordinator broadcast, same-day suppliers, the photo count, check-ins, the story state, the slug.
Structure and copy for those come from the shipped components
(`_components/day-of-mode/grid.tsx`, `_components/after/finished-event-summary.tsx`).

## One bug found on the live page while measuring

The Papic tile prints **`100050`** with no thousands separator, while every other figure on the
page is formatted (`₱26,499`, `₱2,250,000`). The prototype shows `100,050`.
