# Event Details — Event · Access · Settings, the Suppliers / Guests shape (design, 2026-10-07, Fable)

**Owner, verbatim (2026-10-07):** *"this simply means we have to fix and arrange the Event Details."* · *"they are different"* (People with access under the last supplier row) · *"finding these different parts is to deep inside."* · *"why is there a check on this if it is not event hub maker. and just event details"* · **the direction:** *"redesign it following the concept of suppliers, and guests where there is a toggle. then accordion that opens and has toggles for toggle based, and data that is just derived from outside is just a direct link to jump there."*

**Verdict: the page is not wrong, it is folded too deep.** Four folds hold sections that hold rows and one card. "People with access" is three levels down — open *Guests & money*, scroll past guests, budget and three supplier rows, and it appears boxed under *Host / MC · Kuya Mike Events*, so it reads as that supplier's thing. The fix is the shape Suppliers and Guests already have: **one segmented control on top — Event · Access · Settings — one body, and only three kinds of row.** A **jump** row for data owned elsewhere (its summary, and › straight to its home). An **accordion** row for an on/off thing, which unfolds in place to its switches (a choice inside is one dropdown). A **dropdown** row for the few facts this page owns. Everything is one tap from the top; nothing writes the Event Hub draft, so Undo / Apply go; Put this away stays at the very bottom.

This designs **around** the EA build (People with access → Hosts · Helpers · Suppliers with per-area Edit · View · Off dropdowns): EA's groups and dropdowns become the **Access** segment as they are; this doc only changes the frame they sit in (a segment, each person an accordion) — said plainly so EA is not contradicted by surprise.

Prototype: `prototypes/event_details_arranged_2026-10-07_fable.html` (375, all states: `?seg=event|access|settings`, `&open=<accordion>`, `&dark=1`). Screenshots: `prototypes/event-details-2026-10-07/1-event.png` · `2-access.png` · `3-access-helper-open.png` · `4-settings.png` · `5-settings-rsvp-open.png` · `6-put-away-open.png` · `7-dark-access-open.png`.

---

## (a) Every block on the page today — where its editing lives now · depth · what happens to it

Measured on `origin/main` `apps/web/app/dashboard/[eventId]/details/page.tsx` + `_components/` (fold = `record-fold.tsx`, one open at a time). **Depth** = how far down the part sits: *today* as "fold › section › row" levels plus the rows you scroll past inside the open fold; *proposed* always **top level, one tap**. Owner rulings cited by date.

| # | Block today (copy as shipped) | What it is | Where editing really lives now | Depth today → proposed | Keep · move · remove |
|---|---|---|---|---|---|
| 1 | Masthead "Event Details" + sticky bar (names · kind · date · region · **Undo / Apply**) | the record's head; the dock is the Maker's | here — the dock exists only because 13 editors below write the Hub draft (see (e)) | top → top | **keep** the bar; **remove** Undo / Apply (owner: *"why is there a check on this if it is not event hub maker"*) |
| 2 | "Finish your Event Hub · 9 of 18 · Next: … · **Pick a stage**" (boxed `sn-tile`) | the stage picker's door | Maker › Stages (`/launch?tool=details&guide=1`) | top, a card → the *Event Hub* jump row's summary | **move** into the *Event Hub* row's summary; the box goes (owner: no boxes) |
| 3 | Fold **How it looks** › Font · Colours · Buttons | theme fields (open in place) | Maker › Studio › Look (10-06 "approve all"; 10-07 Maker owns Hub editing) | 2 levels (fold › row) → gone; the *Event Hub* row shows the look as its summary | **remove** from here (not duplicated) |
| 4 | How it looks › Cover photo · Logo / monogram · Music | doors to Maker tools | Studio › Look (Background · Music) · Studio › Logo | 2 → gone | **remove** (the Maker is the one door) |
| 5 | Fold **How it works** › How guests get in · What to ask · Guests reply by | the RSVP setting | **Guests › Setup** (10-07 "the third segment is Setup") — Studio › RSVP is its second door | 2 → **top**: Settings › *RSVP* accordion (How guests get in ▾ · the ask switches · Reply by) | **move** to Settings as an accordion (owner's direction names RSVP as toggle-based) — the same `GUESTS_GET_IN_CHOICES` setting Guests › Setup edits; ⚠ a third door, flagged below |
| 6 | How it works › Papic answer · Gifts answer · Logo answer · Cover answer | the "shown on each stage" answers | Studio › E-Gifts, Studio › Info, Stages (Reveal/Cover switches, 10-06) | 2 → gone | **remove** (Maker owns) |
| 7 | How it works › Event Hub address (read) | the link | Studio › Info › Your Event Hub | 2 → in the *Event Hub* row summary | **move** |
| 8 | Fold **Your event** › basics: Names · Kind of wedding · Area | the governed facts | Kind · Area: here (save live). Names: the hub draws them → **Studio › Info** "Event name · Maria & Jose" (10-07 "yes") | 2 levels, first section → **top**: Event segment | **keep** Kind · Area; Names becomes a read row with one door to Studio › Info (it writes the draft — see (e)) |
| 9 | Your event › key dates: The wedding (date) · Ceremony time | the date | **Suppliers** owns date + venue (10-06 *"suppliers"*; Suppliers handoff: the only place, drafted + Apply there) — the Suppliers sheets are not built yet | 2 → top (*The event*) | **keep** as read rows with one door to Suppliers — PR-B lands **after** Suppliers PR5 so the door is never dead |
| 10 | Your event › Guests arrive · Reception (time) | doors to Schedule | Studio › Schedule | 2 → gone | **remove** |
| 11 | Your event › Supplier payments (read) | money | Budget | 2 → the *Money* jump row | **move** |
| 12 | Your event › venues: Ceremony · Reception (venue) | the places | Suppliers (as #9) | 2 → top (*The event*) | **keep** as #9 |
| 13 | Your event › Love Story · Special message | words | Studio › Love Story · Studio › Info | 2 → gone | **remove** |
| 14 | Your event › Dress code / Mood Board rows | door to Mood Board | Studio › Mood Board & Dress Code | 2 → gone | **remove** |
| 15 | Fold **Guests & money** › guests: Your estimate · On your list · Guest list closes · How you see costs | guest settings | here (estimate, cost view); "list closes" = Reply by → Guests › Setup | 2 levels, 1st section → **top**: Event segment (jump row *Guests*) · Settings (How you see costs) | **keep** estimate + cost view; "list closes" shown read-only (set in Setup) |
| 16 | Guests & money › budget: Target · Agreed · Paid · Still owed + "Open Budget ›" | money | Budget | 2 levels, 2nd section (~5 rows down) → **top**: Event segment, jump row *Money* | **move** up a level |
| 17 | Guests & money › suppliers: one locked row per booked supplier + "Open Suppliers ›" | the booked list | Suppliers › Booked | 2 levels, 3rd section (~10 rows down) → **top**: Event segment, jump row *Suppliers* | **move** up a level |
| 18 | **People with access** (boxed card, after the last supplier row) | access | here (EA is lifting it to its own fold) | **3 levels** (fold › after 3 sections › card), ~14 rows down → **top**: the **Access** segment | **move** — becomes the Access segment; EA's groups and per-area dropdowns unchanged |
| 19 | Guests & money › services: Event Hub Pro · Setnayan AI · Plan it myself · Papic + "Open Services ›" | what the event has | here (10-06 (4): Plan it myself → the event's settings = here) | 2 levels, 5th section (~18 rows down) → **top**: Event segment, jump row *Services*; the Plan-it-myself and Papic switches → Settings | **move** up a level |
| 20 | Guests & money › purchases: 6 orders · Total paid + "Open Purchases ›" | receipts | Orders | 2 levels, last section (~22 rows down) → **top**: Event segment, jump row *Purchases* | **move** up a level |
| 21 | **Put this away** (boxed, last) | archive | here | top, a card → top **row** (last), opens its sentence + button | **keep**, un-boxed |

What the shipped tests pin and what moves: `the-record-is-four-folds-on-the-phone.test.ts` pins the four names and order; `every-fact-has-one-editor.test.ts` pins 14 editors, six studio rows and five "Open … ›" sections. Both are rewritten in PR-A/B below, never weakened — the properties they hold (one editor per fact · a row opens, never writes · a saved row waits for Apply) all survive.

## (b) The proposed shape — plain English

Under the shell bar: the couple's line (*Maria & Jose · Wedding · Fri 18 Dec 2026 · Quezon City*) and the segmented control, both pinned while you scroll — exactly the Suppliers (Find · Build · Booked) and Guests (List · Map · Setup) shape. No title row on the phone. One body under it.

**Event** — what the event *is*. Six rows this page owns or shows: Event name (drawn on the Hub → jump to Studio › Info) · Kind of wedding ▾ · Area ▾ · Date (→ Suppliers) · Venue (→ Suppliers) · Your estimate. Then, under a small "Where the rest lives" eyebrow, six jump rows whose summaries carry the numbers: Event Hub (*Classic · Cormorant · 9 of 18 in place* → the Maker) · Guests (*180 on your list · 214 with plus-ones · 96 replied* → Guests) · Suppliers (*3 booked · names* → Suppliers › Booked) · Money (*₱62,000 paid · ₱84,000 still owed · ₱180,000 target* → Budget) · Purchases (→ Orders) · Services (→ the Services hub). Nothing here is edited twice; a › means "it lives there".

**Access** — who may do what. The owner's expected "Event Access" area, as its own segment, badge = people count. Three eyebrows — Hosts · every part / Helpers · some parts / Suppliers · their part — and under each, one accordion per person: closed it reads *Kuya Ben · Guests · Seat plan*; open it shows one dropdown per area (Edit · View · Off, EA's control) and the on/off switches that are truly on/off (Access on/off for a helper; "Every part" for a co-host; "Make them your coordinator" for a supplier). One open at a time. "Add a person" is one dropdown of the guest list, at the bottom. Nothing supplier-shaped sits above or below it, so it can never read as part of a supplier again.

**Settings** — how it behaves. The toggle-based things, each an accordion that opens to its switches: **RSVP** (How guests get in ▾ · Guests reply · Ask for dietary needs · plus-ones · a song · Reply by · Headcount → Guests › Setup) · **Event Hub** (Live · Which stages guests see ▾ · Music plays on open · Photos from guests · How it looks → the Maker). Then three plain rows: How you see costs ▾ · Plan it myself (switch) · Papic (switch, credits in the sub-line).

**Put this away** — the very bottom of every segment, an accordion that opens to the shipped sentence and the one button.

Why these three segments: they are the three questions a couple brings to this page — *what is my event* (look it up, or jump to where the number lives) · *who can touch it* (the people) · *how does it behave* (the switches). Each is one word, each holds one kind of thing, and the owner's three row kinds map onto them without a fourth. Two segments (Event · Settings) would bury Access inside Settings again — the very thing he came to the page and could not find.

## (c) Recommendations — one word each

1. **Three segments.** Event · Access · Settings, the shipped `ISegmented` pinned under the shell bar, one body, no title row on the phone (the Suppliers / Guests shape, universal per the owner).
2. **Three row kinds only.** Jump (owned elsewhere: summary + ›) · accordion (on/off things: unfolds to switches, choices inside are one dropdown) · dropdown (a fact owned here). Nothing else — no cards, no sections inside sections.
3. **No Undo / Apply.** Event Details never writes the Event Hub draft: the 17 rows that do today (listed in (e)) leave for the Maker, Suppliers or Guests › Setup; what stays saves at once, as access already does.
4. **Access is a segment.** EA's Hosts · Helpers · Suppliers and per-area dropdowns, unchanged, each person an accordion — its own segment, never under a supplier row.
5. **RSVP and Event Hub are the two Settings accordions.** RSVP's switches here are the same `GUESTS_GET_IN_CHOICES` + asks + Reply by that Guests › Setup edits — one setting, one more door. ⚠ Owner call below on whether this third door is wanted.
6. **Put this away at the very bottom** of every segment, as an accordion — one quiet row, never a card.

## (d) Build plan — PR-sized, for a later Opus build (phone 375/390 first; guards from `apps/web`; changelog fragment + check card per PR; side-by-side + owner OK before merge)

**Sequence with EA:** EA merges first. PR-B lifts EA's groups and controls into the Access segment without touching their internals.

**PR-A · `rd/event-details-three-segments`** — the frame and the Event segment.
- `details/page.tsx`: the four `<RecordFold>` + Finish card + sticky slim bar → the shipped shell + the couple's line + `ISegmented` (`website/editor/_components/inspector-kit.tsx`, tone wine, pinned like Suppliers) with Event · Access · Settings (`?view=` in the URL, like Guests' `?gview=`); `record-fold.tsx` and `Section` retire; the Event body = six owned rows + six jump rows, each a `<Link>` with its summary from the facts (`readHomeGuide` feeds the Event Hub row; the money formatter feeds Money). `HubDraftDock`, `overlayHubDraftEvent` and "Waiting for Apply" leave the page. `names` · `date` · `venues` become jump rows (Studio › Info · Suppliers); `kind` · `area` · `estimate` keep the live `settings` editor, opened in place.
- Guards: `the-record-is-four-folds-on-the-phone.test.ts` → `the-record-is-three-segments.test.ts`: the three segment words in order; **no `<RecordFold`, no `Section`, no `sn-tile` inside the body** (depth ≤ 1); every jump row is a `<Link>` with an `href` outside `/details`; **no file under `details/` imports `hubDraftAction`, `HubDraftField` or `HubDraftDock`** (sabotage: re-import the dock → red). `every-fact-has-one-editor.test.ts` re-measured: editors = `settings` only; zero `RECORD_ROW_TOOL`; zero "Open … ›" headers.
- Check card: open Event Details on the phone → Event · Access · Settings under your names → tap *Money* → the Budget opens → back → tap *Kind of wedding* → the dropdown is right there.

**PR-B · `rd/event-details-access-segment`** — Access.
- `people-with-access.tsx` (EA's version) mounts as the Access body: its three groups under eyebrows, each person wrapped in the Guests `.fold`-style accordion (grid-rows, one open at a time — `useOneOpen` ships), the per-area `PickMenu`s and the shipped actions (`setGuestAccess` · `setDelegateArea` · `removeHost`) unchanged; the segment badge = people count; "Add a person" stays EA's dropdown.
- Guards: Access is reachable in one tap from the segment (a test that the Access body renders `<PeopleWithAccess` directly under the segment, with no supplier row as a sibling); EA's own tests untouched.
- Check card: tap *Access* → Hosts · Helpers · Suppliers → tap Kuya Ben → his areas unfold, one dropdown each → set Seat plan to Edit → it saves at once.

**PR-C · `rd/event-details-settings-segment`** — Settings.
- RSVP accordion = the shipped `GuestsGetIn` dropdown (`lib/who-can-reply.ts`) + the asks as switches (`rsvp-ask.ts` `sanitizeRsvpAskConfig`) + Reply by (`events.guest_list_edit_deadline`) + a Headcount jump to Guests › Setup — saving **live**, the same writer Guests › Setup uses (one setting, not a second store). Event Hub accordion = Live (`launch_mode`/`manual_phase` from `website/editor/actions.ts`), Which stages guests see ▾ (`website_open_browse`), Music on open, Photos from guests, a jump to the Maker. Plain rows: How you see costs ▾ (`settings`), Plan it myself (`PlanMyselfSwitch`), Papic (shipped switch). Put this away = `put-away-card.tsx` as the last accordion in every segment, same copy, same `setEventArchived`.
- Guards: every switch in Settings maps to a boolean column or a two-value setting (sabotage: render a 5-choice setting as switches → red); the RSVP writer is the same function Guests › Setup calls (assert by import, not by name); first-visit `MiniTour` (`lib/tours.ts`) with three stops: the segments · a › · Access.
- Check card: Settings → RSVP → switch "Ask for a song" on → Guests › Setup shows it on too → Put this away at the bottom of every segment.

**Not in scope:** EA's internals · the Suppliers date / venue sheets (Suppliers PR5 — until it lands, the Date / Venue jump rows open the shipped `DateEditor` / `VenuesEditor` dialogs, as the Suppliers handoff stubs them) · the Maker.

## (e) Every row that writes the Event Hub draft today → where it goes

Measured on `origin/main`: `lib/event-details-record.ts` `RECORD_ROW_EDITOR` maps 22 rows to 14 editors; `every-fact-has-one-editor.test.ts` ("a saved row lands in the draft and counts in Apply") asserts that **every editor except `settings` saves through `hubDraftAction` / `HubDraftField`**, and that the page carries `<HubDraftDock>` for that reason. So the dock is not decoration — 17 of the 22 tappable rows write the draft. The owner's question is answered by moving those rows out, after which the dock has nothing to count.

| Rows (as shipped) | Editor | Writes | Goes to |
|---|---|---|---|
| Font · Colours · Buttons | `font` · `colours` · `buttons` | draft | Maker › Studio › Look (door: the *Event Hub* row) |
| How guests get in · What to ask · Guests reply by | `rsvp` | draft | Guests › Setup (door: the *RSVP* row); Studio › RSVP is its second door |
| Papic answer · Gifts answer · Logo answer · Cover answer | `papic` · `gifts` · `logo-answer` · `cover-answer` | draft | Maker › Stages (Reveal / Cover switches) · Studio › E-Gifts · Studio › Logo (door: *Event Hub*) |
| Names | `names` | draft | Studio › Info "Event name · Maria & Jose" (door: the *Event name* row in *The event*) |
| The wedding (date) · Ceremony time | `date` | draft | Suppliers › date sheet (door: the *Date* / *Ceremony* rows) — ships in Suppliers PR5 |
| Ceremony venue · Reception venue | `venues` | draft | Suppliers › venue sheet (door: the venue rows) — Suppliers PR5 |
| Love Story | `love-story` | draft | Studio › Love Story (door: *Event Hub*) |
| Special message | `special-message` | draft | Studio › Info (door: *Event Hub*) |
| Kind of wedding · Area · Your estimate · Guest list closes · How you see costs | `settings` | **live** (on purpose) | **stay** — save at once |
| Cover photo · Logo / monogram · Music · Guests arrive · Reception · Dress code (`RECORD_ROW_TOOL`) | none (doors) | nothing | leave (the Maker is the door) |
| People with access · Plan it myself · Put this away | own actions | **live** | **stay** |

After the move, Event Details holds no draft writer, `HubDraftDock` and `overlayHubDraftEvent` / "Waiting for Apply" leave `page.tsx`, and the test's clause 5 is rewritten to its opposite: **no file under `details/` imports `hubDraftAction`, `HubDraftField` or `HubDraftDock`** (sabotage: re-import the dock → red).

## Owner questions (recommendation first)

1. The Finish card folds into the *Event Hub* jump row's summary (*9 of 18 in place*) — this changes the 10-04 ruling that it stays as a card on top. **Recommend: yes** — same door, same count, no box.
2. RSVP as a Settings accordion here is a **third door** to the one setting Guests › Setup and Studio › RSVP already edit (recommendation 5). Your direction names RSVP as toggle-based, so it is drawn; **recommend: keep it** only if Settings is where you would look for it — otherwise it becomes one jump row *RSVP › Guests › Setup* and the Settings segment holds Event Hub · costs · Plan it myself · Papic.
3. Undo / Apply leave Event Details, which means Event name, Date, Ceremony time and the venues become jump rows (Studio › Info · Suppliers) rather than fields here. **Recommend: yes** — they draw on the Hub, so they draft and Apply where the Hub is edited; Event Details keeps only what saves at once.
4. Three segments, not two (Event · Access · Settings). **Recommend: three** — two would put Access back inside Settings, one level down, which is the complaint.

## What was checked (re-measure before acting)

`git show origin/main:apps/web/app/dashboard/[eventId]/details/page.tsx` and `_components/{record-fold,people-with-access,put-away-card}.tsx`; `the-record-is-four-folds-on-the-phone.test.ts`; `every-fact-has-one-editor.test.ts`; memory `suppliers-one-screen-brief-2026-10-07.md` (the universal segmented control, pinned, no title row, accordion unfolds in place); `prototypes/home_and_guests_2026-10-07_fable.html` (`.seg` · `.row` · `.switch` · `.fold` — copied); `EVENT_DETAILS_STUDY_2026-10-04_fable.md` §6 rows 4 · 5 · 19; `DECISION_LOG.md` 2026-10-04 "FOUR FIXES BEFORE BUILD", PR #6341 row, 2026-10-06 "EVENT DETAILS IS REBUILT", 2026-10-06 "DATE AND VENUE LIVE IN SUPPLIERS", 2026-10-07 "STUDIO REDRAW ANSWERS" (bands · hosts are access) and "EVENT NAME · MARIA & JOSE"; `EVENT_HUB_MAKER_STAGES_STUDIO_BUILD_PLAN_2026-10-06.md` Studio › Info and › RSVP rows; `HOME_AND_GUESTS_CHECK_2026-10-07_fable.md` G31 (Reply by); `SUPPLIERS_HANDOFF_2026-10-07_fable.md` (date · venue sheets, PR5).
