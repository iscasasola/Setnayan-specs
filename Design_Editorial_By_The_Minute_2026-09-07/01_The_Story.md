# 01 · The Story — the public page

`/[slug]` · prototype: `prototypes/story.html`

---

## 1 · The spine

The page is the event's clock. Three segments, left to right:

```
THE ROAD ──────────────┃ DAY 1 ┊ DAY 2 ─────────────┃ AFTER
195 days of making it  ┃ one segment per calendar day┃ what came after
```

* **The road** — from the day the date was set to the night before. Weekly resolution.
* **The days** — **one segment per calendar day** the event covers (`events.event_date` →
  `events.event_end_date`; NULL = one day). Each day carries **its own clock**, so a day-2
  capture can never be drawn on a day-1 bar. Five-minute bins. **[review]**
* **After** — the morning after, the edition, and any later chapter.

### The dial

A sticky bar chart of captures over time, the height of each bin = captures in that bin.

| Rule | Detail |
|---|---|
| **Every bar opens** | Tapping any bar — written-up or not — opens a sheet with that minute's captures, how many phones, where the event was, and the nearest written moment. Owner lock 4. |
| **Tap target** | The whole strip is one hit area; the nearest bin wins. A 1.3px bar is not a tap target. **[review]** |
| **Keyboard** | The dial is focusable; ←/→ walk bins, Enter opens. |
| **Labels** | HTML positioned in percent, **never SVG text inside a stretched viewBox** — that squashed every label to 35% width on a phone. **[review]** |
| **Needle** | Marks where the reader is; moves by transform, not by attribute rewrite. |
| **Future bins** | Before publish, bins after "now" are a baseline tick with no height — **a bar's height is data about a minute that has not happened yet.** **[review]** |

### The light

Six stages — *before · morning · afternoon · dusk · night · after* — derived from the host's saved
palette (§4). The ground crossfades between stages as the reader scrolls; **the ink is chosen each
frame** as whichever of the two stages' inks reads better on the ground actually present.

> 🔴 **Never lerp ground and ink together.** Doing so passed through a ~1.05:1 illegible midpoint
> for a full screen of scrolling, twice per page. **[review, major]**

---

## 2 · The three layers (owner lock 1)

| Layer | What it holds | Public when |
|---|---|---|
| **The host's own** | date set · saved theme · team booked · prenup · save-the-date page · invitation page · 3D room · the live broadcasts | **as it happens** |
| **The guests'** | Papic captures · Kwento · challenge answers · letters · the photo wall | **QR / seat holders and the host only**, until publish |
| **The edition** | all of the above, curated, closed, with the host's last word | **once**, on publish |

**A written minute does not exist until the host writes it.** So during the day nobody — guest or
stranger — sees day-of chapters; a guest sees their captures through the dial and the sheet.

### Implementation rule

Every guest-made unit carries `data-layer="guest"`. In the build, exclusion is **server-side**,
keyed on the viewer classes `/[slug]` already resolves (`holdsGuestPass`, `isSeatHolder`,
`isSignedInHost`) and on `storyAudienceAdmits(status, viewer)` — with the guest layer mapped to the
`event` audience until `published`.

> 🔴 It is not enough to hide the entries. The first review pass found the index, the dial's bar
> **heights**, the minute sheet, the cover counts, the Relive player and the closing words all still
> public in a pre-publish stranger view. **[review, blocker]**

### What each viewer sees

| | Host | Guest with the QR | Stranger |
|---|---|---|---|
| Before the day | Story Maker; the page shows the invitation | invitation, RSVP, the stream | the invitation |
| On the day | as guest, plus everything | the stream + their captures filling in | the stream, and a note that the rest is guests-only |
| Untold (day passed) | Story Maker | their own captures | graceful fallback |
| Told | everything | everything | everything |
| Taken back | Story Maker | fallback | fallback |

---

## 3 · Anatomy, top to bottom

### 3.1 Cover
Monogram · *SETNAYAN · Vol. I* · names set very large in the condensed face · one sentence · four
facts that are the story's unit of measure (captures · films · voices · days told).
**The edition number appears only at publish** — before that the masthead reads "Vol. I" alone.
**[review]** Sample stories carry a *Sample story — not a real ⟨host⟩* pill on the cover, not buried
in the colophon. **[review]**

Controls in the cover: **▶ Relive it** · **Share** · **Print** · *(host)* **Host view**.

### 3.2 The road — entries
Each is a dated entry with the same grammar as a minute. The shipped sample runs:

| Stamp | Entry | Carries |
|---|---|---|
| 2019 → 2024 | How they got here | the love story |
| Aug 3 | Set na 'yan — the date | Setnayan AI · Event Hub |
| Sep 21 | The look they chose | the saved theme |
| Oct | The team comes together | #1-match counts, hours saved |
| Nov 16 | The prenup shoot | **Papic opens** |
| Dec 20 | **The save-the-date** | the page as guests saw it + the film |
| Jan 5 | **The invitation** | the page's second life: RSVP, schedule, dress code |
| Jan 12 | The room, in 3D | the design of the room — **not** the seating plan |
| Feb 7 | Live, the week before | broadcast 1 · the first Kwento · question 1 |

> The save-the-date and the invitation are rendered **as pages**, in a phone frame, exactly as
> guests saw them — with *"Open it exactly as it was →"*. The shipped site's own lifecycle
> (save-the-date → invitation → the day → the story) is the story's first two chapters.

### 3.3 A day — entries ("minutes")
Big time stamp · title · media · the desk's write-up with a drop cap · then **the layers**:

| Layer | Content |
|---|---|
| **Said** | who spoke about *this* minute, each declaring its **source** (Kwento · challenge · letter · the host's own) and its **naming consent** |
| **Asked** | challenge answers taken at this minute |
| **Made by** | the suppliers who made this minute, plus Papic with shot and phone counts |
| **In the film** | `0:44:00` → the timecode in *that session's* broadcast |
| **In the room** | which tables the photos came from — **reception only** (§5) |

Between minutes, gaps are drawn as gaps: *"4 h 8 m — golden hour · 5:30 the reception opens · six
courses · the toasts run long."* The day keeps its real proportions.

### 3.4 The lens (desktop)
A sticky floor plan. It has four states and **derives them from the schedule block in use**, never
from a clock constant:

* **not built yet** — before the room was drawn
* **designed** — the 3D plan exists; still no seating
* **ceremony** — rows facing the arch, tables hidden
* **reception** — tables, lit by captures per minute; gold = loudest table
* **no venue** — a day with no reception venue, or a roaming event: says so

### 3.5 After
The morning after (the reviews) · **Their edition** (monogram, letters, suppliers they loved, the
A3 keepsake) · any later chapter.

### 3.6 The whole story, at once
Eleven index tabs, each an honest index of one layer, every item linking back to its minute:
captures (filtered by hour / before the day / from the suppliers) · voices · asked · letters · the
team · films · photo wall · the room · the look · made with · by the numbers.

### 3.7 Were you there?
**Guest's own account only.** No name field, for anyone. Shows the minutes they appear in, what
they shot, what they said, their table — and ends in the **9:16 share card**. Also the only place a
guest can act on their own consent: *"Something of yours here you'd rather not show? Hide it, or
ask to be unnamed."*

### 3.8 The locked close
**The host's last word, then their song. Nothing after it.** Non-negotiable
(`EDITORIAL_LOCKED_CLOSE_KEYS`).

### 3.9 The back cover
*After* the colophon, the way a series page sits after The End. Announces a next edition **only if
the host named one in the Story Maker**; otherwise absent. Never offers a reader a menu of event
kinds. Three doors by viewer: the host → *Open the story maker*; a guest → *Tell me when there's
more*; a stranger → *Start your story · free*.

---

## 4 · Colour

* **Source:** `sanitizeRolePalette(events.role_palette).reception` — 3–5 swatches. "Saved" = that
  palette is non-empty. Slot labels are the shipped `PALETTE_LIMITS.reception` ones
  (*Dominant · Supporting · Accent · Neutral · Accent 2*) — **never invented names.** **[review]**
* **Derivation:** sort by lightness → six stage grounds.
* **Correction is mandatory.** Every colour is contrast-checked before use: body ink ≥ 12:1,
  muted text ≥ 4.6:1, accent-as-text ≥ 4.5:1, and nudged toward black/white until it passes.
  **A colour taken from a mood board is never trusted to be legible.** **[review, major]**
* **Fallback:** neutral, when no theme was saved. Framed as a choice, not a failure.

## 5 · Seating (owner lock 6)

Assigned seats exist **only while the reception venue is in use**. Derived from a `BLOCKS` array
mirroring `event_schedule_blocks` — `{label, type, start, end, place, seated}` — never a clock
threshold. Before the reception: no plan at all, and the copy says when it opens.
**The public plan carries table numbers and photo-heat. Never names.** **[review, blocker]**

## 6 · Films

**One card per broadcast session**, not one film. A single 2h48 file cannot span 2:38 → 9:47 PM.
A minute's timecode is **its clock time minus that session's went-live time**.

## 7 · Motion

Bars grow in on load · the needle eases · the big clock ticks only when the minute changes ·
each minute's stamp counts up to its time and **lands exactly** · entries rise (never fade — the
page is fully legible at rest, in a screenshot and with JS off) **[review]** · photos drift slowly
with a living grain · the monogram ring turns · Relive crossfades.
**`prefers-reduced-motion` is honoured by the script as well as the stylesheet** — the count-up,
Relive's autoplay and every smooth scroll. **[review]**

## 8 · Find in this day

One search over every layer the **current viewer** may see — the index is rebuilt from the live DOM
so a stranger cannot search what a stranger cannot read. Groups: minutes · voices · captures ·
suppliers · letters · questions. **Understands a time** (`7:12`, `9:47`, `3 hapon`) and offers
"jump to that minute". Non-matching minutes dim.

## 9 · Print and share

* **Print** — the A3 keepsake broadsheet (front + back, QR returns to the living page) · PDF ·
  A4 one-minute-per-page.
* **Share** — Facebook · Messenger · Pinterest · copy link · the 9:16 story card.

## 10 · Metadata

Canonical URL · `og:type=article` · `og:locale=en_PH` · a per-story 1200×630 card at
`/api/og/realstory/<slug>` · `twitter:summary_large_image` · three JSON-LD blocks
(`Organization`, `BreadcrumbList`, `Article` with `inLanguage: en-PH` and `locationCreated`).
Headings are real: `h1` names, `h2` per part, `h3` per entry.

## 11 · Accessibility floor

44px minimum on every control · focus moves into and back out of both overlays · the Relive
prev/next are invisible but never invisible to the keyboard · the dial is operable by keyboard ·
no body-level horizontal scroll at 390px · wide content scrolls in its own container.
