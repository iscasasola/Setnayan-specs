# 05 · Occasions, registers, and days

The story template must hold for **all sixteen live event kinds**, not weddings. The shipped
showcase already admits every kind (owner, 2026-08-15: *"each event they create will have an
editorial not just wedding"*).

---

## 1 · The words follow the occasion

Source: `event_type_profiles.terminology`, seeded by
`20271163083797_the_words_follow_the_occasion.sql`, read through `lib/…/event-words.ts`.

| Key | Wedding | Debut | Wake | Reunion |
|---|---|---|---|---|
| `organizer_noun` | couple | celebrant | family | family |
| `person_a` / `person_b` | both set | one set | null | null |
| `seat_word` | table | table | table | table |
| `event_word` | wedding | debut | wake | reunion |
| `register` | celebratory | celebratory | **solemn** | celebratory |

**Every "couple" in the page chrome is a template**, resolved from the profile:

| Was | Becomes |
|---|---|
| "a note to the couple" | `a note to {theHost}` |
| "future couples" | `future {hosts}` |
| "with the couple's consent" | `with {hostPos} consent` |
| "when the couple approves them" | `when {theHost} approves them` |
| "Sample story · not a real couple" | `not a real {host}` |

The masthead renders one name when `person_b` is null.

## 2 · The solemn register

Shipped code **already refuses** the joyful recap for a wake — `event-words.ts`: *"the post-event
recap is auto-composed in a joyful voice … a wake keeps its ordinary page after the day"* — and the
anniversary mail selector excludes it
(`COALESCE(p.terminology->>'register','celebratory') <> 'solemn'`).

**The solemn arm renders none of this:**

| Never | Instead |
|---|---|
| **▶ Relive it** | — |
| **Papic challenges** ("What we asked") | — |
| **The anniversary** entry, its dial bar, and the back-cover No. 2 card | the fortieth day, if the family name one |
| **"🔔 Tell me when it's live"** | *"The vigil schedule"* |
| the celebratory gap copy | plain |

⚠ **`07` Q3 is open:** does by-the-minute **refuse** the solemn register outright, as the shipped
recap does — or ship this quiet arm?

## 3 · Multi-day

`events.event_end_date` exists ("Last day of a multi-day event (inclusive)") and
`multi_day = TRUE` for **wedding, travel, reunion, corporate** — *a wedding itself may span days;
"segments like a rehearsal dinner are schedule blocks, never separate events."*

**The editorial loader never selects `event_end_date`.** It must.

* **One dial segment per Manila calendar day**, each with its own clock and hour ticks.
  Compute the day from `manilaDate` (`lib/papic-window.ts`), **never from wrapped clock time** —
  a day-2 capture must never land on a day-1 bar.
* The **night before is a DAY, not a road milestone** — the despedida gets its own segment with
  five-minute bins, so its bars open like any other. Real planning milestones (date set, theme
  saved, team booked, prenup) stay on the road.
* Label segments `Day N` via `tripDayChapter(dayNumber)` (`lib/papic-chapters.ts`) when there is
  more than one.

## 4 · Roaming and no-venue events

Travel is `layer_mode = 'roaming'`, and the seeded profile **withdraws the seating surface** — no
`event_tables`, no reception switch, no single lawn.

* Gate the room lens and "The room" tab on `enabledSurfaces` including `'seating'` **and** at least
  one `event_tables` row.
* Absent → drop the lens, or show a place/day card from the schedule block's location
  (*"Day 2 · Kyoto"*).
* Venue phases derive from **the schedule block in use** (`labelForCapture` over
  `scheduleWindows`), never a clock constant. `"5:30 PM"` is rendered from that block's
  `start_at`, never as a literal.

## 5 · Zero suppliers

A hangout, a date, a family wake, or any event whose suppliers were hired off-platform has no
`event_vendors` rows. Mirror the theme's honesty:

* the road entry reads *"The team — shown only because suppliers were booked on Setnayan"*
* hide the team tab, the #1-match tile and the tier legend when the set is empty
* drop the "Made by" layer on a minute with no credit (keep "Made with" for Papic / Live Studio)
* show "Vendors we loved" only when `vendor_recommendations` has rows

## 6 · Localisation

`events.story_language` exists (renamed from `editorial_language`) and is **selected but never
consumed**. `lib/i18n` covers dashboard chrome only, `en` + `tl`, with `ceb` reserved — and
*"guest-entered or vendor-entered content is NEVER translated"*, so Taglish quotes are correct as
content. The story adds ~150 English chrome strings with no locale path. **Not in scope for this
build; recorded so it is not discovered late.**
