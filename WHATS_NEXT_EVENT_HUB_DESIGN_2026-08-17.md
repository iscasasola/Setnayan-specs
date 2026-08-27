> ⏩ **SUPERSEDED 2026-08-28: S12 is done and this paste-block carries pre-correction numbers (15 types · 103 words · a shared shell) that must not be quoted — read [`EVENT_HUB_UNISON_2026-08-28.md`](EVENT_HUB_UNISON_2026-08-28.md) instead.**

# S12 · The Event Hub, drawn as one universal place — ready to paste, 17 August 2026

> 📄 **COPY-PASTE PAGE:** <https://claude.ai/code/artifact/2f24f879-3f9c-41b7-9193-0372d39f96e7>

> A **DESIGN** session. It produces drawings and a written delta for the owner to look at.
> **It opens no pull request against the app.**
>
> 🛑 **It may run alongside S4 · S8 · S10** — they touch the supplier's day-of screens, the admin
> console and documents. None of them touches the Event Hub.
> ⚠ **CORRECTED 2026-08-17 (evening) — this line said "It must NEVER run beside S11 — they share
> the Hub's body file." MEASURED: THEY DO NOT.** S11 lives in `app/dashboard/[eventId]/**`; its
> ONLY Event Hub footprint is the host ribbon's coordinator dead-end (*"Edit this site"*,
> `app/[slug]/_components/owner-ribbon.tsx:53`), whose model is built in `lib/owner-ribbon.ts` —
> so S11 can close it **without opening `site-body.tsx` at all**. Downgraded from *never* to
> *coordinate on one file*. 🔑 **Measure a collision before escalating it.**
>
> ✅ **S12 IS DONE.** Its outputs: [`prototypes/event_hub_universal_2026-08-17.html`](prototypes/event_hub_universal_2026-08-17.html)
> (four events at one design) · [`prototypes/event_hub_three_widths_2026-08-17.html`](prototypes/event_hub_three_widths_2026-08-17.html)
> (phone · tablet · desktop) · [`EVENT_HUB_UNIVERSAL_DESIGN_2026-08-17.md`](EVENT_HUB_UNIVERSAL_DESIGN_2026-08-17.md).
> **The builds that follow it are S13–S16** — see
> [`WHATS_NEXT_EVENT_HUB_BUILDS_2026-08-17.md`](WHATS_NEXT_EVENT_HUB_BUILDS_2026-08-17.md).
>
> Companion listing (hand this over too):
> [`EVENT_HUB_COMPLETE_LISTING_2026-08-17.md`](EVENT_HUB_COMPLETE_LISTING_2026-08-17.md).

Paste the **shared header** from
[`WHATS_NEXT_SESSION_PROMPTS_2026-08-17.md`](WHATS_NEXT_SESSION_PROMPTS_2026-08-17.md) first.

---

```
WHAT A PERSON GETS: a birthday, a graduation, a corporate day and a funeral each open an event
page that speaks to THEM — not one that calls everybody a couple at a wedding — and a guest
standing in the venue can get from their seat to the directions to the gifts without going back to
a link somebody sent them months ago.

═══ THIS IS A DESIGN SESSION ═══
DELIVERABLE: drawings + a written delta, for the OWNER TO LOOK AT. Save prototypes to
prototypes/event_hub_universal_2026-08-17.html (one file, all states). DO NOT open a PR against
app code. DO NOT port anything. The owner looks first; porting is a later session.

Your reply must answer exactly two questions, in his words:
  1. WHAT IS EXPECTED — what the Event Hub should be, drawn.
  2. WHAT CAN BE IMPROVED — the delta from what ships today, itemised, with the reason for each.

═══ THE PROBLEM, MEASURED — DO NOT RE-DERIVE, DO CONFIRM ═══
The product supports FIFTEEN event types: wedding · birthday · debut · christening · baptism ·
gender reveal · anniversary · graduation · reunion · celebration · corporate · tournament ·
travel · funeral · simple.

The Event Hub says "couple", "wedding", "bride" or "groom" ONE HUNDRED AND THREE times:
  the hub page 31 · Live hub 16 · recap 13 · seat 12 · find-my-table 8 · find-seat 5 ·
  pabuya (gifts) 4 · venue 3 · welcome 1.
⇒ A funeral opens a page that calls the family a couple at a wedding.
🔑 THIS IS THE JOB. It is not a taste problem, it is a word count, and it is most of the value.

═══ ALREADY SHIPS — DO NOT REDRAW ANY OF IT ═══
Four things today were reported as missing while shipped. Do not make it five.

1. THERE IS ALREADY A SHARED SHELL for these screens (app/[slug]/layout.tsx). The Hub is NOT 13
   unrelated pages. A "unify the Event Hub" design that invents a shell redraws something live.
2. THE DOOR REGISTER IS DECIDED AND BINDING — paper card, 3px terracotta top edge, terracotta
   eyebrow, ONE terracotta action, the wordmark as the way out. TWENTY-TWO screens wear it as of
   today (app/_components/door/door-shell.tsx, with a guard that fails the build on a hand-made
   copy). THE HUB INHERITS IT. It does not get a second look.
3. THE 19 ARCHETYPES in prototypes/archetype_*_2026-08-01.html are OWNER-APPROVED AND BINDING
   (2026-08-04, no changes requested). PORT, NEVER REDRAW. A difference between your drawing and
   its archetype is a defect in your drawing.
4. THE DAY-OF IS ALREADY SCOPED BY ROLE, AND PHASES 1+2 ARE BUILT AND MERGED —
   Role_Scoped_Day_Of_DESIGN_2026-08-01.md. One supplier can be stylist AND emcee at one event and
   each ROLE has its own run of day; a person enters a role by scanning its QR. THE LIVE HUB SITS
   INSIDE THAT DECISION. A day-of drawing that contradicts it contradicts shipped code.
5. THE VOCABULARY MECHANISM ALREADY EXISTS — `event_type_vocab` is an admin-managed table
   (/admin/event-types) that the marketplace already reads, and lib/create-subjects.ts already
   returns an HONOREE LABEL per subject. So "make the words fit the event" is WIRING AN EXISTING
   VOCABULARY INTO THE HUB, not inventing one. Confirm this before drawing around it.

🔒 AND THE HUB IS A PLACE, NOT A CONTROL PANEL — owner-locked. The host's ribbon on it is
READ-ONLY; every real control lives in /dashboard/[eventId]. A drawing that adds editing to the
Hub reverses an owner ruling. Draw the host as a visitor with a ribbon, not as an administrator.

═══ MEASURE THIS FIRST — I HAVE NOT, AND YOU MUST NOT INFER IT ═══
HOW DOES A GUEST GET FROM ONE ROOM TO ANOTHER TODAY? Walk all 13 addresses and write down every
link out of each. My claim is that a guest on the seat screen has no listed way to reach the venue
directions, the gifts or the recap — I DID NOT VERIFY IT. If it turns out they can, say so
plainly and drop that half of the brief. That is a better outcome than drawing a fix for a problem
that is not there, which is how the largest wasted scope of today began.

═══ THE THIRTEEN ROOMS ═══
  the hub page · welcome (a plus-one confirms their name) · invite · redeem (redirect) ·
  seat · seat/claim (redirect) · find-seat · find-my-table · venue · Live hub (day only) ·
  live-wall (the photo feed) · pabuya (gifts) · recap · print (host) · sign-out (redirect)

═══ WHAT TO DRAW ═══
- The hub page as the SAME design filled with FOUR different events: a wedding, a child's
  birthday, a corporate day, and a funeral. Same structure, right words each time. This is the
  single most important drawing and it is what proves the design is universal.
- The way between the rooms, in the shape your measurement says it should take.
- The four stages one address passes through: save-the-date → invitation and RSVP → the day
  itself → the story and album afterwards. THE GUEST KEEPS ONE LINK ACROSS ALL FOUR — that is
  owner-settled vocabulary and the reason the Hub is one product, not four.
- Both themes. A light-only check has waved a real contrast failure through twice.

🎨 THE COLOUR TRAP, MEASURED — IT HAS BITTEN THREE TIMES:
The Tailwind slot named `terracotta` is the atelier GOLD #A9834B; the CTA terracotta #C24E25 lives
in the slot named `mulberry`. Inherited and BACKWARDS, so `text-terracotta` LOOKS safe and is the
unsafe one at 3.37:1 on cream, under the 4.5:1 floor. Use `text-mulberry` (4.61:1) or `text-link`
(8.22:1). Gold on an ICON is fine; NEVER on text. Gold has ~0.29 of headroom on cream, so ANY tint
under it fails — hover must move the border or the shadow, never add a fill.

⚖ ONE RULING IS THE OWNER'S — SURFACE IT, DO NOT ANSWER IT, AND DO NOT DESIGN AROUND IT SILENTLY:
WHICH ROOMS EXIST FOR WHICH EVENT TYPE? A funeral has no RSVP and no gift page. A corporate day
has no seat plan in the wedding sense. A travel event may have no venue at all. Put the question
to him as a SHORT GRID — 15 types down, the rooms across, your RECOMMENDED answer filled in — so
he is correcting a proposal rather than filling in a blank. That is the one decision that changes
how much of this is even a design problem.

═══ PRODUCTION, SO NOTHING IS DRAWN FOR AN IMAGINARY SCALE ═══
6 events (4 private, 2 public) · 39 guests · 14 photos · 0 orders ever. Every event in production
today is a wedding. So the universal design CANNOT be validated against real data — say that
plainly rather than implying you saw it work.

═══ HOW TO REPORT ═══
Plain English, what a PERSON experiences. No file paths, table names or flag names in the reply to
the owner. Lead with the four-event drawing, because that is the answer to "can it apply to all
types of event". Then the improvement list, shortest true version of each.
```

---

## Why this is a separate session and not part of any other

- **S11 shares the Hub's body file** and must never run beside it.
- **S5** is the same event's *organiser* side — the Hub is what guests see, S5 is what the host
  controls. They must not end up in two different registers, so whichever runs second inherits the
  first's decisions.
- **S2 (done)** already set the register this session inherits.
- **S9's consent gate** decides whether the Hub's photo rail can ever show anything publicly —
  and that one needs the owner's ruling first.
