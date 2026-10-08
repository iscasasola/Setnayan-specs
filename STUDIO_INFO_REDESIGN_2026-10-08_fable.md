# Studio › Info — redesign · 2026-10-08 · Fable

**Design + prototype only. Nothing here is built.** Prototype: `prototypes/studio_info_2026-10-08_fable.html` (the map card is at its top; `?shot=<id>` isolates a frame). Captures: `prototypes/studio-info-2026-10-08/` (01–10 at 375 × 812, 11 at 900 × 700). Rules followed: `INTERACTION_RULES.md` (read end to end), `BUTTON_RULE_2026-10-07_fable.md`, the Look amendment's row rhythm. Code read on `origin/main` and `origin/rd/background-source-cards` (`maker-details.tsx` Studio branch, `studio-tools.tsx`, `studio-event-name.tsx`, `opening-line-field.tsx`, `special-message-field.tsx`, `lib/hub-draft.ts`, `lib/maker-details-items.ts`, `lib/name-style.ts`, `lib/opening-lines.ts`) — never the dev server.

Owner, verbatim: *"so first, Info. redesign it based on our rules similar to look? no preview needed since info is just form. but how each row is presented there and create a selector if needed."* · *"prioritize only what they need to input here"* · *"on studio look - when we enter, you see that their is no more look title there. make this same to the other studio pages"*.

## 0 · For the owner to decide (three things)

1. **Who can view** (Private · Unlisted · Public) is drawn in Info today and the owner said on 2026-10-08 that access lives inside Event Details. Recommendation: it stays in Event Details only and leaves Info; the prototype keeps it under "Your Event Hub" until he says so. One setting, one place (INTERACTION_RULES § 6).
2. **Two ways of saving on one page.** "Your event" rows ride the draft and ✓ Apply; the **Event Hub address, Go live, Who can view, Event Bar and the QR's look save LIVE**, and so do E-Gifts' *ways to give* (rows of `event_egift_methods`, which the `events`-only draft cannot hold). The owner locked "address and access stay live". Recommendation: the page shows ONE way for everything a guest *reads* (draft), and the live group says so once in one amber line at its head ("These change your live Event Hub right away — not on ✓ Apply"). Alternative: move the whole "Your Event Hub" group out of Info into Event Details with access, leaving Info 100 % draft.
3. **The Opening line has two doors.** The Studio form posts it LIVE through the print-words `Save` ("Guests see this right away", `SaveWords` + `HubSavesImmediately`), while `lib/hub-draft.ts` already carries `HUB_DRAFT_OPENING_LINE_KEY` for the same `print_details.opening_line`. The design removes the Save button and drafts it like the Special message. The builder must retire the live post for this field (or the row is a lie). This is a real finding, not a design choice.

## 1 · The map (also the map card at the top of the prototype)

Order as drawn today in Studio › Info (`DETAILS_ITEM_GROUPS` group `event`, then `StudioTool part="hub"`):

| # | Row today | Control | Stored | Typed here? | Saves today | Guest reader | Redesign |
|---|---|---|---|---|---|---|---|
| — | "INFO ▾" title pill | the tool's own head | — | — | — | — | **removed** |
| 1 | Event name · Maria & Jose ▾ | opens in place: each person's first + last, Name style ▾ (Full · Middle initial · Surname first) | `events.display_name` (`coupleNameColumns`), `print_details.name_style` | typed | **draft** (`AutoDraft`) | hero names, prints, passes | first row, open; Name style = ▾ |
| 2 | Date | fact line "Set when you book your venue in Suppliers" | `events.event_date` (from the booking) | shown only | — | hero, countdown, prints | one quiet line with Venue |
| 3 | Venue | fact line | `resolveEventVenues(bookings, row)` | shown only | — | hero, directions | same line |
| 4 | E-Gifts | the answer + the E-Gifts manager in place | `events.gifts_on` (draft); `event_egift_methods` rows + registry link (**live**) | typed | mixed | the E-Gifts scene | below the break, folded |
| 5 | Thank-you message | textarea | `events.pabuya_message` | typed | **draft** since "draft 1-3" | `pabuya/page.tsx` | inside E-Gifts |
| 6 | Opening line | Start from ▾ (5) + field + **Save** | `events.print_details.opening_line` | typed | **live** (print-words form) — and a draft key exists | hero, prints | open on entry; Start from ▾; **no Save** → draft |
| 7 | Special message | textarea | `events.special_message` | typed | **draft** | `editorial/compose.ts` | open on entry; a field |
| 8 | What to bring ⓘ | textarea | `events.what_to_bring` | typed | **draft** after a pause | `guest-welcome.tsx` Reminders | open on entry; a field |
| 9 | Event Hub address | `SlugField` + Save | `events.slug` | typed | **live** (owner lock) | every link, print, pass | under "Your Event Hub", live, said once |
| 10 | Go live | ▾ (`LaunchStdButton`) | the live stage | a pick | **live** | which stage opens | ▾ |
| 11 | Who can view | ▾ Private · Unlisted · Public | the event's access | a pick | **live** | the gate | ▾ — recommend it leaves Info (§ 0.1) |
| 12 | Which version guests see | a pick | the published stage | a pick | **live** | — | folds into Go live's sheet |
| 13 | Event Bar | switch | `maker.eventBar` | a pick | **live** | the sticky bar | switch |
| 14 | Show the event QR | switch | `events.qr_shown` | a pick | **draft** | `print/page.tsx` | switch, the QR under it |
| 15 | QR code | image + Copy · Share · Download + its look | `/api/website/qr/<slug>`; look via `qrStyleAction` | a pick | look **live** | prints, passes | under the switch; look = ▾ |
| 16 | Restore draft · Reset… | the draft bar's quiet rows | — | — | — | — | last, unchanged |

## 2 · The row pattern (for the other nine Studio pages)

**Label left (15 px, sentence case) with ⓘ beside it · the value or control right · one hairline between rows · helper text one short line or none · 44-px targets · no boxes, no cards-in-cards.** Three kinds of right side, and nothing else:
- **a ▾** (white pill, 40 px) for a value with **3 or more** choices — it OPENS its choices in the bottom sheet (current ticked, one tap applies and closes), never cycles (INTERACTION_RULES § 2: *"3+ options → ONE dropdown (PickMenu). Never a row of pills."*);
- **a switch** for yes/no (§ 2: *"Yes/No settings → a switch"*);
- **a field** for free words — a short one inline on the right; a long one opens UNDER its row with a "Done" button, the row showing the first words (or "Add" in terracotta) when shut.
A value with exactly **2** choices would be a two-way pill toggle whose thumb slides (today's selector ruling changes only its shape and adds the slide) — **Info has none**. A **3-segment sliding pill** is for SECTIONS of a page only (§ 8: *"never used to pick a value"*) — **Info has no sections, so it has no selector**; adding one would be decoration. The two folds and the open rows obey **one open at a time** (§ 8 auto-collapse): opening E-Gifts closes Your Event Hub; opening a text row closes the names.

Where a line of the rules file collided with the brief: the brief's "pill selector among 2–4 fixed things" vs § 2 — **§ 2 wins** (Name style and Who can view are ▾). One line worth the controller's eye, not decided here: § 8 says *"a record edits in place … on a phone in the half sheet over the page"*; Studio › Info has no page beneath it (no preview), so the prototype opens a long field **under its row** as the shipped Studio › Info already does (`studio-event-name.tsx`: "opens, right there"). If the half sheet is meant for every form, say so and the open rows move into the sheet.

## 3 · What moved, what left, and why

- **No title row** — the page opens on the first input (owner).
- **What they must type is open on entry:** Event name · Opening line · Special message · What to bring. Prefilled where known (§ 1: "we pre-fill whatever we already know").
- **Date and Venue** shrink to one quiet line ("Saturday, December 12, 2026 / Seda Vertis North, Quezon City · set when you book"). Recommendation: keep the line (a couple opening "Info" expects to see the date, and the line answers "where do I change it") rather than leave the page; no link out (§ 3: no "go edit elsewhere" — the Suppliers page is where booking happens anyway).
- **Below a break "More for guests", folded, one line each on what it does for a guest:** E-Gifts ("Lets guests send a gift, and thanks them after", with its switch, ways to give and the thank-you inside) · Your Event Hub ("The address, who can view, the QR — changes right away").
- **Gone from the row:** the per-field black Save and "Guests see this right away" on the Opening line (§ 0.3); the "Which version guests see" row folds into Go live's sheet.
- **Saving:** the press answers at once (the words are on the row); "Saving to your draft…" appears only past 300 ms; when it lands the ✓ count bumps and a small toast says "Saved to your draft · 4 to apply" (§ 5: success = a small toast); a failure says "Could not save." with ↻ Retry (terracotta, icon + word), never silent. Live rows (the Hub group) say so once at the group's head and toast "— live" on change.
- **At 900 wide:** one column at a reading width (560 px), centred — a form gets no three columns.

## 4 · Build note — small PRs, in order

1. **`rd/info-no-title-first-input`** — remove the Studio tool's "INFO ▾" head on Info (and, per the owner, on every Studio page the way Look has none); the first row is the names. Guard: `studio-pages-open-on-their-first-input`.
2. **`rd/info-row-pattern`** — the shared row primitive (`StudioRow`: label + ⓘ · right side = ▾ | switch | field; long field opens under with Done; one open at a time) used by Info first; the date/venue fact line; the "More for guests" break with the two folds. No data change.
3. **`rd/opening-line-drafts`** — the finding of § 0.3: the Studio's Opening line writes through the hub draft (`HUB_DRAFT_OPENING_LINE_KEY`) and the print-words live post stops carrying it from the Studio; the Save button and `HubSavesImmediately` go from this row; guard: `the-opening-line-has-one-door`. **Needs the owner's nod on § 0.2 first.**
4. **`rd/info-hub-group`** — Who can view → Event Details (if § 0.1 is yes) · "Which version guests see" into Go live's sheet · the amber "changes right away" line once at the group head. No migration.
5. **Nothing here needs a migration.** Every value already has a column or a draft key; the only data change is which DOOR the Opening line uses.
