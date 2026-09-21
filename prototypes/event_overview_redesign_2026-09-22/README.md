# Event overview — redesign prototype (2026-09-22)

> ✅ **OWNER APPROVED 2026-09-22 — "yes to all" on the three rulings** (a date is not a decision ·
> one rank mark, not two · after the day the stale vitals go). Recorded in `DECISION_LOG.md`.
> The price discrepancy at the bottom of this file is **still open** — it is money, and it was
> not one of the three.

**Route:** `/dashboard/[eventId]` — the couple's event Home / Overview.
Not the Event Hub Controller (`GO LIVE` in the rail), not the public event page.

Built with the method in `REDESIGN_PAGE_PROMPT_2026-09-21.md`, copying the shape of
`prototypes/papic_controller_redesign_2026-09-21/papic-controller-prototype.html`.

**File:** `event-overview-prototype.html` — one file, opens in any browser, phone and desktop.

The prototype bar carries four controls, none of them part of the app:

| Control | What it shows |
|---|---|
| **Planning · On the day · After** | the three moments; the same DOM re-ordered by CSS `order` |
| **Setnayan AI** on/off | the page's **two states**. The live event is AI-on only, so the free state had never been seen. |
| **Show Sai's path** | outlines and numbers the **7** places Sai changes the page (+1 that appears only when Sai is **off**) |
| **States…** | **11** conditional blocks the live event does not meet the condition for — flip one on and it lands where it belongs |

Every "Needs you", "Coming up" and watch row opens a real sub-screen in the shipped
inspector shape (`overview-inspector-body.tsx`): eyebrow · title · chips · copy · **one** action.
On a phone it is full screen; from 1024px a drawer; from 1280px it docks as a column and the
page makes room, standing in for the Overview's shipped third inspector column.

## Where Sai roams (7 + 1)

1. the briefing sentence + two chips, inside the day card
2. **the watch** — guard/secretary rows, inside the day card
3. `· ranked` appended to the open count
4. the wording under *Needs you* — Sai on: *"Ranked by what closes soonest"*; off: *"Choices only you can make"*
5. the ranking itself — the gold numbers (the live page's `PRIORITY n` chips, folded into one mark)
6. the wording and order of *Coming up* — *"In the order Sai would take them"* vs *"By date"*
7. the note under your current stage on the rail
8. **only when Sai is OFF** — *"Let Sai find your first venue shortlist — free"*, the free sample

## The 11 conditional blocks (States…)

access request waiting · prepare for event day (T-3d→T+1d) · a refused read (said, not shown as
empty) · no date set · a supplier handover (**"Meanwhile"**) · free camera not used yet · Muslim
wedding track · Chinese tea ceremony · recurring event · Setnayan AI not owned · no venue booked.

When **no date** is set, *"Set your wedding date"* takes rank ① of *Needs you* — everything on
the page dates itself from it.

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

## Three things found on the live page while measuring

1. **`100050`** — the Papic tile prints the shot count with no thousands separator, while every
   other figure on the page is formatted (`₱26,499`, `₱2,250,000`). The prototype shows `100,050`.
2. **"about 1 months before the wedding"** — the Crew Meals deadline copy does not singularise.
   Reproduced verbatim in the prototype's sub-screen, with a marker.
3. 💰 **A price on the free Overview disagrees with the live catalogue.** The free
   first-venue-shortlist card prints, from a code constant
   (`FIRST_VENUE_SHORTLIST_UPSELL`, pinned by a test):
   *"the full Sai is ₱499 first 28 days → ₱799 per 28 days"*.
   `platform_retail_catalog_v2`, read 2026-09-22, says the active SKU is **`SETNAYAN_AI`
   ₱2,499 one-time** (onboarding ₱1,499); the ₱799/28d SKU (`SETNAYAN_AI_RENEW`) is
   **`is_active = false`**. The prototype shows the card with the price line **removed** and a
   marker in its place. **Owner call — not changed here.**
   Re-measure: `select service_code, retail_price_php, onboarding_price_php, billing_period,
   is_active from platform_retail_catalog_v2 where service_code like 'SETNAYAN_AI%';`
