# The Event Hub — the complete listing, and why it does not feel like one thing

> **Owner, 2026-08-17:** *"session 1 was for the event hub. but the event hub still doesn't look
> properly fixed… the goal of the event hub will be a universal design that can apply to all types
> of event from wedding to any event. it should be able to easily access all the different parts…
> this also connects to other sessions?"*
>
> **All three instincts are correct. Measured below, from the shipped code.**

---

## 1 · Why Session 1 did not fix this — and was never going to

**Session 1 was not an Event Hub design session.** It was two access fixes:
a booked supplier could not get through a private event's front door, and the booking did not
record which business it was. Both shipped. **Neither of them touches how the Hub looks, reads, or
navigates.**

🔑 **So "the Event Hub still doesn't look properly fixed" is not a failed fix — it is work nobody
has started.** No session in the register covers the Hub as a designed whole.

---

## 2 · The complete listing — 13 addresses

Everything living under the event's one public address. Measured on `origin/main`.

| # | Address | What a person does there | Who it is for |
|---|---|---|---|
| 1 | `/{slug}` | **The hub itself** — the story, the details, RSVP, the photo rail, the livestream block, the supplier strip | everyone |
| 2 | `/{slug}/welcome` | A plus-one confirms their own name after scanning | guest |
| 3 | `/{slug}/invite` | The invitation view | guest |
| 4 | `/{slug}/redeem` | Turns a scanned personal QR into a session *(redirect)* | guest |
| 5 | `/{slug}/seat` | Their seat | guest |
| 6 | `/{slug}/seat/claim` | Claims a seat *(redirect)* | guest |
| 7 | `/{slug}/find-seat` | Finds which seat is theirs | guest |
| 8 | `/{slug}/find-my-table` | Walks them to the table | guest |
| 9 | `/{slug}/venue` | Getting there | guest |
| 10 | `/{slug}/hub` | **Live hub** — the fullscreen day-of view | guest, day only |
| 11 | `/{slug}/live-wall` | The photo wall feed *(data)* | screens |
| 12 | `/{slug}/pabuya` | Gifts | guest |
| 13 | `/{slug}/recap` | The story and album afterwards | everyone |
| 14 | `/{slug}/print` | The printable pack | host |
| 15 | `/{slug}/sign-out` | Leaves the event *(redirect)* | guest |

---

## 3 · 🔴 THE UNIVERSALITY PROBLEM, MEASURED

**The product supports 15 event types:** wedding · birthday · debut · christening · baptism ·
gender reveal · anniversary · graduation · reunion · celebration · corporate · tournament ·
travel · funeral · simple.

**The Event Hub says "couple", "wedding", "bride" or "groom" 103 times.**

| screen | wedding-specific words |
|---|---|
| the hub itself | **31** |
| Live hub | 16 |
| recap | 13 |
| seat | 12 |
| find my table | 8 |
| find seat | 5 |
| pabuya | 4 |
| venue | 3 |
| welcome | 1 |

⇒ **A birthday, a graduation and a funeral all open a page that calls them a wedding.** That is the
single biggest reason it does not read as universal, and it is not a design opinion — it is a word
count.

⚠ **This is the same defect the Live Studio camera door had** — *"one of the couple"* on a screen
used by 15 of 16 event types — found only because the owner pushed back. **It is systemic, not
local.**

---

## 4 · ⚠ THE STRUCTURE IS BETTER THAN IT FEELS — do not rebuild it

**There IS a shared shell** (`app/[slug]/layout.tsx`). The Hub is not 13 unrelated pages bolted
together, and **a session that "unifies the Event Hub" by building a new shell would be rebuilding
something that ships.**

🔑 **What is actually missing is not a shell — it is a WAY BETWEEN THE ROOMS.** A guest who lands
on the seat screen has no listed way to reach the venue directions, the gift page or the recap.
⚠ **I have NOT measured the navigation between these 13 screens.** That is the first thing the
session must do, and it must not be assumed from this document.

---

## 5 · Why it feels stitched together — it was

Each screen was last touched by a different session on a different day, for a different reason:

| screen | last touched by |
|---|---|
| the hub itself | the supplier access fix · 17 Aug |
| welcome | the doors session · 17 Aug |
| seat · find-seat · find-my-table · venue · pabuya · Live hub | a **copy** pass · 17 Aug |
| recap | a **contrast** sweep · 8 Aug |
| invite | a security fix · 6 Aug |
| print | a feature PR · **5 July** |

🔑 **Not one of those was a design pass on the Hub as a whole.** Every recent change was a
correct, narrow fix landing on one room of a house nobody has looked at end to end.

---

## 6 · ✅ YES — IT CONNECTS TO OTHER SESSIONS. Four of them.

| session | how it connects |
|---|---|
| **S11 · who is in this event** | ⚠ **Shares the Hub's body file.** Must never run beside a Hub design session. |
| **S5 · the couple's four screens** | The *organiser's* side of the same event. The Hub is what guests see; these are what the host controls. They should not be redesigned to two different registers. |
| **S4 · eight small things** | Three of its items are day-of surfaces that face the same guests. |
| **S2 · the doors** ✅ done | Already set the register the Hub should extend — paper card, one action, the wordmark as the way out. **The Hub should inherit that, not invent a second look.** |
| **S9 · the seat-photo consent** | Governs whether the Hub's photo rail can ever show anything publicly. |

---

## 7 · What the session should be — and what it must not be

**IT IS A LANGUAGE AND NAVIGATION SESSION, NOT A REBUILD.**

1. **Make the words fit any event.** 103 wedding-specific words, on a product with 15 event types.
   The vocabulary already exists — the product knows every event's type and its own words for the
   people in it. **This is the whole job and it is most of the value.**
2. **Give the 13 rooms a way between them** — measured first, then designed.
3. **Inherit the door register.** Do not invent a second look for the Hub.

**MUST NOT:**
- ⛔ Rebuild the shell. It ships.
- ⛔ Rebuild any of the 13 screens. Every one works.
- ⛔ Run beside S11 — they share the body file.
- ⛔ Turn the Hub into a control panel. The host's ribbon is **read-only** by owner ruling; every
  real control lives in the organiser's dashboard.

⚖ **ONE THING THAT IS THE OWNER'S:** the Hub's four stages are save-the-date → invitation and RSVP
→ the day → the story afterwards. **A funeral has no RSVP and no gift page; a corporate event has
no seat plan.** Which rooms simply do not exist for which event types is a product ruling, not an
engineering one.
