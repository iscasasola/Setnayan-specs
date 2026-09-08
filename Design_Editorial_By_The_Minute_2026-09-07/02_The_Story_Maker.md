# 02 · The Story Maker — the host's desk

`/dashboard/[eventId]/story` (was `/website/editorial`) · prototype: `prototypes/story-maker.html`

---

## 0 · Why it changes

The host must visit **four separate screens** today to decide what their own story shows:

| Today | For |
|---|---|
| `dashboard/[eventId]/studio/guest-columns` | letters |
| `dashboard/[eventId]/studio/papic/moderation` | the Kwento queue |
| `vendor-dashboard/clients/[eventId]/editorial-media` | what a supplier sent (host hides via `hidden_by_couple`) |
| `dashboard/[eventId]/website/editorial` | the editor itself |

**One desk replaces the deciding.** The four editors stay where they are; the desk is the single
queue that decides what reaches the story.

Entry point: the dashboard's **Untold** shelf already links here — *"Write the story of ⟨name⟩."*
Keep the shelf words; they are already right.

---

## 1 · Six steps

`The desk · The story · Theme · Cover · What's next (optional) · Publish`

A progress meter on the rail reads **"n% of the desk decided"**, and **Publish is disabled** until
the desk is empty, a state is chosen and consent is ticked.

---

## 2 · THE DESK

One queue over four sources. Filters: *Everything · We made · Guests · Suppliers · Still waiting
on you*, each with a live count.

### Card anatomy

```
[thumb]  [SOURCE] who made it · when            → where it lands
         TITLE
         the content (editable in place)
         ⚑ the one thing the host must know about this item
                                        [✓ Accept] [✎ Edit] [✕ Reject]
```

### The three sources

**① We made** — written from the event, not by the host. Every card says how we knew:
> *"We found this minute because 41 phones fired within four minutes of your coordinator tapping
> 'processional'. The title and the write-up are ours; the minute is yours."*

Cards: the opening paragraphs · each minute we found · By the Numbers. The ≈44-hours card states
plainly that it is **a calculation, not a measurement**.
**Clearing a generated field lets us rewrite it** — carried from the shipped editor.

**② Guests** — Kwento wishes · challenge answers · letters · capture sets. Every card carries its
consent state (`04`):
* *"She asked to be named."* / *"Not named, by choice."*
* the five yeses on a challenge answer — ✅ and the fifth (**named only if they asked**) now covers
  photo messages too, owner/DPO ruling 2026-09-09
* **held-back items are shown as held back**: *"One of the twelve shows a guest who opted out of
  photos. That one is already held back — you cannot accept it, and it is not counted above."*

**③ Suppliers** — their day-of frames and their note to the host.
> *"You can turn a supplier's note down without turning the supplier down — their credit on your
> day is free and stays either way."*

### Accept · Edit · Reject

| Action | Meaning |
|---|---|
| **Accept** | it enters the named section. Nothing enters without this. |
| **Edit** | in-place. On **our** words: free. On a **guest's** words: *"Trim for length freely; if you change what she meant, we ask her before it publishes."* |
| **Reject** | silent. **Nobody is told.** Undo any time. |

Accepting a capture set may be **partial** ("Open the set" → keep some, drop others).

---

## 3 · THE STORY

Section list with on/off and drag order. Carried from the shipped editor's *What shows* + *Section
order*, extended:

* Each row shows **what is in it** (`3 waiting · 1 accepted`).
* **A section with nothing accepted does not render at all** — no empty headings, ever.
* Two locked rows: **the masthead and lead always show**; **your last word, then your song** closes
  the paper and never moves.

---

## 4 · THE WORDS  *(carried from the shipped editor — do not drop)*

Two boxes first, four behind a fold. The split is **by who the field belongs to**:

| Up front | Behind the fold ("magazine furniture") |
|---|---|
| **Headline** | **Eyebrow** — the small line above |
| **Your story** — the front-page write-up; blank keeps it photo-led | **Sub-headline** — the italic line under |
| | **Pull quote** — one line, set large |
| | **Byline** |

> The shipped file's own reasoning, kept: *"Six equal boxes made the page read as a form to
> complete rather than a story to correct."* Eyebrow / deck / byline are a newsroom's words, not a
> host's.

**Clear any field → we rewrite it.**

---

## 5 · THEME

Three modes:

| Mode | Behaviour |
|---|---|
| **Follow my mood board** | the story tracks `role_palette.reception`. Change the board, the story follows. Swatches are shown, **not editable here** — two editable sources is how a board and a story drift apart. |
| **Make my own** | starts *from* the board; the story stops following it from then on. |
| **Neutral** | warm paper and ink. A real choice, not a fallback. |

**The picker is the mood board's own** (`swatch-popover.tsx`), not a second one: tap the chip →
a native colour input, a hex field, the colour's **name** (`lib/color-names`), **search by colour
name** (`lib/color-search`), and a **"from your mood board"** row to pull a saved colour back.

Under it, **the six light stages repaint live** as colours change, so the host sees morning→night
before publishing. A line states that every colour is contrast-corrected.

---

## 6 · COVER

**New.** There is no story-cover concept today — the shelf card inherits the living hero.

One picture, three jobs, **all three previewed live**:
1. the top of the story
2. the card on `setnayan.com/realstories`
3. the 1200×630 thumbnail when the link is shared

Candidates: the living hero · any accepted capture from a written minute · a supplier frame ·
the animated monogram · upload another.
**A capture can only be a cover if it passed the same checks as everything else** — screened, and
nobody in it opted out.

---

## 7 · WHAT'S NEXT  *(optional — owner ruling)*

> **A story is finished on its own. Most end here, and that is a whole story.**

Nothing is pre-selected. The resting card is **"Nothing yet — the story ends on your words"**, and
the back-cover preview is quiet and dashed until the host chooses otherwise.

Candidates are **derived, never created** — `lib/event-anchor.ts` already does this, and its own
owner lock governs the screen: *"Recurrence is DERIVED at read time, never an auto-created row —
an event exists only on the user's go-signal tap."*

| Candidate | Why we can offer it |
|---|---|
| **The first anniversary · in 350 days** | `anniversary` anchors on `union_date` = this day. Badged **⟳ Derived, not created**. |
| **A christening** | anchors on `person_birthdate` — a date we do not have. Badged **◇ Waiting on a date**: *"We will not ask you for one, and we will not guess."* |
| **A reunion / trip / company day** | `fixed_date` — the host picks. |

Then: **what No. 2 inherits** (names + monogram, colours, guest list as a starting point,
"Previously · No. 1"), a **live preview of this story's back cover**, and two clearly different
actions — **Announce it only** (back cover, creates nothing) vs **Start it now** (opens a new
event pre-filled and linked).

---

## 8 · PUBLISH

Three states, each naming **who can see it**:

| State | Who |
|---|---|
| **Draft** | the host. The desk fills before, during and after the day. |
| **Guests only** | everyone holding the Papic QR. Not searchable, not shareable outside the day. |
| **Published** | anyone with the link; may appear on setnayan.com. **The edition number is stamped here.** |
| **Taken back** ✅ | ✅ **RULED 2026-09-09 — BUILD IT** (`07` Q6), together with the full revalidation set and a version stamp on the printed edition. It has no implementation today; **S14** is the session. |

Plus:
* **Your last word** — always the host's own words; nobody writes it for them.
* **The consent tick** — *"I want this story to be public, and I understand it will carry our
  names, our photos, and the words our guests agreed to share."* Under it: guests keep their own
  say either way, and the host can go back to guests-only whenever.
* **"Feature our story in Stories"** — a **separate** opt-in from publishing, carried from the
  shipped editor, with its guard: *"Set your Event Hub link first"* / *"Your Event Hub is Private."*

---

## 9 · Also carried from the shipped editor — do not drop

| Piece | Detail |
|---|---|
| **What goes in** | deep links to Living hero · Photos · Thank-you note, with **save-the-draft-before-you-navigate** on a plain click (modifier-clicks pass through) |
| **Your own columns** | the host writes a section of their own: name + body, *"leave a blank line between paragraphs"*, removable; *"Needs a name and something written before it shows"* |
| **What they said** | add a wish **by hand** — Author · Role (guest · supplier · couple) · Wish · Stars · reorder · remove. For words said out loud, or a guest with no phone. |
| **Your photos** | upload a cover and favourites directly — **no Papic needed**; optimised on upload |
| **Share your story** | copy link · a pre-written share title |

### Caps (shipped values — keep)

| Cap | Value |
|---|---|
| Moment write-up | 400 chars soft |
| Wish quote | 280 soft (server hard-caps) |
| Wishes | 12 max |
| Gallery uploads | 30 max |
| Canonical moments offered | 10 (datalist, not a constraint) |

### Editorial PRO gating (shipped — keep unless repriced)

PRO today: **naming/writing the moments · section order · placing your own columns · featuring
guest wishes.** The prototype shows them ungated; that was an omission, not a decision.

> ✅ **RULED 2026-09-09 — THE GATE STAYS EXACTLY AS SHIPPED. DO NOT RE-ASK.** Port the SCREENS
> from the prototype and the GATE from the shipped editor. A prototype drawn without a gate is not
> a decision to remove one, and shipping four paid abilities as free is a repricing nobody chose.
