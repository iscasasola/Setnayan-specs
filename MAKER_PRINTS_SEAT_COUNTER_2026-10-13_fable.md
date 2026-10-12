# Prints' six controls + the seat counter — on the approved templates

**2026-10-13 · Fable (designer) · design only, no app code.** Two Event Hub Maker pieces a builder skipped on 2026-10-12/13 ("no clear record / Counter not built" — `controller-2026-10-08/CONTROLLER-NOTES.md`, 23:05 and 01:00 PHT). This is the record.

**Open it:** `prototypes/maker_prints_seat_counter_2026-10-13.html` — tappable; Prints | Seats · Phone | Computer · Light | Dark. Every press answers at once (dip + pulse), ↺ takes back one press, ✓ counts only what waits for Apply.
**Pictures (375 px):** `prototypes/maker_prints_seat_counter_2026-10-13/01-…23` — one per state, plus Dark and Computer.

## What exists (Rule 0, measured on `origin/main` 2026-10-13)

- **Studio › Prints** is the eleventh Studio tile (owner 2026-10-06). Commit `72ce56e6b` ("Prints part one", 2026-10-09) put the Save buttons, size rows, the twelve include switches, the seat-plan kind and the words' Save on the templates. Its own message names what it did **not** move: *"Menu editor, poster photo, pass card look, Changed-since-printed, Kindly reply, parents' cards"* — those are "the six".
- Where each lives today: `launch/_components/maker-prints.tsx` (`PrintPieceEditor`, `PassCardsPanel`, `PrintSetDownloads`), `print-save-button.tsx` (`ChangedSincePrinted` — a bordered line "Changed since you printed on … — save it again"), `pass-card-design-picker.tsx` (one `PickMenu` Classic · Ticket · Photo poster + the card; **a pick waits for Apply**, owner 2026-10-02 Q7), `poster-photo-picker.tsx` (a `PickMenu` The theme's picture / My photo + `FileUpload` 30 MB; the server measures the pixels and says "may print soft"; saves live), `print-menu-editor.tsx` (bare inputs, ⋯ with Earlier/Later/Remove, a **native POST to `/api/hub-print/menu` and a 303 — a full page load**), `maker-details.tsx` (`KindlyReplyField` = a native `<select>` of hosts + "Type it in…" and a bare input; **one field, two doors** — Words › Kindly reply and the Finer Details switch, both `data-same-field`), `parent-cards.tsx` (`ParentCards`: each parent's shipped guest card, ＋ add with a bride/groom side).
- Saving: the switches, the menu and the poster photo write `events.print_details` **live**; the ticket style and the opening line go to the Event Hub **draft** (Apply publishes).
- **The seat counter** = the seats stepper in the Seat plan's table sheet (`seating-editor.tsx` `dockSeatsStepper`, drawn by `PhoneTableDock` in `seat-plan-phone.tsx`): `− 8/10 +`, 32 px buttons, mono text. The sheet went onto the templates on 2026-10-09 (S2, `4214aaa72e` + `6f6537653f`) with the stepper "left as it was: the app has no counter template". The Counter is kind 17 of the approved gallery (2026-10-08) — its demo row is literally "Seats at this table". Rules kept from the shipped code: − removes the highest EMPTY chair and is refused when every chair left is taken; + brings back the lowest removed chair; "Seat N removed · Undo" is the inline notice; saves at once (`toggleSeat`), not drafted.
- Tonight's rulings, drawn in: **printouts are always light** (DECISION_LOG 2026-10-13 dark-mode call 9) — the paper pictures on the Prints page stay light in Dark; **the printed Details programme lists only moments for Everyone** (controller 01:00 PHT) — the Schedule switch's ⓘ and its sub-line say so.

## What I drew — each control → its kind

| # | Control | Kind(s) | As drawn |
|---|---|---|---|
| 1 | **Changed since you printed** | **12** Messages · status line (amber) | Under the piece's Save buttons, one quiet "Save again". Gone once that piece is saved. Never a bare bordered note. |
| 2 | **Parents' cards** | **3** Switch → **15** List rows · **9** Action · **1** Pill · **10** open box · **16** empty state | One hairline row per parent (initials · name · "Bride's mother · on your guest list" · terracotta arrow → the shipped guest card opens as a sheet). "＋ Add a parent" (quiet) opens Bride's \| Groom's + the name box already open + Add; Enter adds. No parents → "No parents on your guest list yet" + the add. |
| 3 | **Kindly reply (two doors)** | **3** Switch → **2** Dropdown · **6** Form row | "Who guests reply to" = the dropdown (phone: a sheet; each host with their number or "no number on their account"; last choice "Type it in…"). Only "Type it in…" shows a second row, "Reply line", the typed pill with a pencil. The ⓘ says it is the same line Studio › RSVP shows — **no link out** (owner 2026-09-28). |
| 4 | **Menu editor** | **18/34** Reorder · **10** open boxes · **11** chips · **9** quiet · **12** toast | Each moment: dots (hold to lift) · its name in an open box · ✕; dishes as open boxes under it; "＋ Add a dish". Arrows live behind **Arrange** on a phone, shown on a computer (ruling 34). "Add a moment" chips come from the Schedule's food moments + "A moment of your own". **Saves as you go** — the "Save menu" button and the page reload are gone; a save is the terracotta toast from the top. |
| 5 | **Pass card look** | **5** Style cards · **20** Pro mark · **9** Action | Classic · Ticket · Photo poster as 3:4 cards, picture edge to edge, picked one ringed terracotta and centred. A pick **waits for Apply** (✓ counts it; ↺ takes it back). "Save all tickets" wears the ◆ PRO pill; on Free a tap opens the centred note "See Pro / Keep it", never a page jump. "Printed ticket · Save" is the plain second button. |
| 6 | **Poster photo** | **1** two-way Pill · **21** Upload · **12** problem line | "Background: Theme's picture \| My photo". My photo shows the upload square: 0–100 pie while it uploads, then the photo with ✕. Too small for A3 → the red plain-words line with "Change" (words, not colour alone). Saves live, as today. |
| 7 | **Seat counter** | **17** Counter · **12** status line | In the table sheet after Table name and Shape: "Seats at this table · 6 seated · of 10 chairs" and `− 7 +`. The number ticks; − greys when every chair left is taken; + greys when all 10 are out. "Chair 8 removed · Undo" is the status line; ↺ in the top bar does the same one step. Saves at once (the seat plan is live; guests see seats only from the day). |

Everything else on the page is "as built" (unchanged by this design): the pieces' size dropdowns, Save PDF / Sample, the other switches, "For the day", "Download".

**Computer:** Prints = two columns — the current piece's paper (light, always) on the left, the rows on the right, dropdowns 220 px. Seat plan = the canvas with the table sheet as the right column (400 px).

## The owner's questions — each with my recommendation

| # | Question | Recommend | Why |
|---|---|---|---|
| 1 | **Kindly reply — keep two doors (Studio › RSVP and Prints' switch), or one?** | **Keep two.** One stored line, drawn in both places; the ⓘ says so. | The 2026-09-28 rule: edit it where you are, never "go edit it over there". Both doors already write the same field (`data-same-field`); nothing to migrate. |
| 2 | **Menu — save as you go (no Save button, no reload)?** | **Yes.** | It is print-only (`events.print_details.menu`), like the switches that already save at once. Today's native POST reloads the whole Maker — the one full-page load left on the page. Builder: same endpoint, posted quietly per change (debounced), toast on success, red status with Try again on failure. |
| 3 | **Seat counter — should chair changes wait for Apply?** | **No — keep it live, with Undo.** | The seat plan is live today and guests only see seats from the day; drafting it would give one sheet two save rules. ↺ + "Undo" in the line cover a slip. |
| 4 | **Parents' rows — open the shipped guest card, or a short name-only form?** | **The shipped guest card, as a sheet.** | The card posts every column; a names-only field would erase a parent's side, role, RSVP and contact on the first keystroke (`parent-cards.tsx` docblock). |
| 5 | **Ticket style on Free — tap the ◆ zip = the centred Pro note (See Pro / Keep it), or jump to the Pro page at once?** | **The note.** | Kind 20's rule: shown, tappable, tried, never applied; one tap to See Pro from the note. No page jump from a row. |
| 6 | **Poster photo under the A3 minimum — allow and warn (as today), or refuse?** | **Allow and warn**, with "Change" right there. | The couple may want it anyway; the words say it may print soft. Refusing hides a choice that is theirs. |

## For the builder

- One PR for the six (files above + `studio-tools.tsx`), one small PR for the counter (`seat-plan-phone.tsx` + `dockSeatsStepper` → the shared Counter). The Counter becomes the ONE shared component (`Counter`, kind 17) with the kind's watch; the menu's reorder reuses `useHoldToLift` (kind 34).
- Guards that must stay green: `studio-prints-posts-the-same`, `studio-prints-money-is-unchanged`, `studio-prints-are-the-templates`, `the-card-posts-every-column`, `a-label-controls-its-switch`, `a-sheet-button-always-shows-its-word`. The menu's quiet save needs its own: the posted `menu_json` is byte-identical to the old form's.
- No schema change anywhere.
