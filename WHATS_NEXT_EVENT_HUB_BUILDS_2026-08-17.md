# S13 – S16 · The Event Hub builds, combined into the S register — 17 August 2026 (evening)

> **This supersedes the "EH1–EH4" numbering I used earlier today.** The Event Hub already had a
> slot in the S register — **S12**, the design session — so its builds are **S13 · S14 · S15 ·
> S16**, not a parallel scheme. One register, one numbering.
>
> **Read with:** [`WHATS_NEXT_SESSION_PROMPTS_2026-08-17.md`](WHATS_NEXT_SESSION_PROMPTS_2026-08-17.md)
> (S1–S11 · the shared header) · [`WHATS_NEXT_EVENT_HUB_DESIGN_2026-08-17.md`](WHATS_NEXT_EVENT_HUB_DESIGN_2026-08-17.md) (S12) ·
> [`EVENT_HUB_UNIVERSAL_DESIGN_2026-08-17.md`](EVENT_HUB_UNIVERSAL_DESIGN_2026-08-17.md) (the written half) ·
> [`prototypes/event_hub_universal_2026-08-17.html`](prototypes/event_hub_universal_2026-08-17.html) ·
> [`prototypes/event_hub_three_widths_2026-08-17.html`](prototypes/event_hub_three_widths_2026-08-17.html).

---

## ✅ Already closed — do not re-run

| | | |
|---|---|---|
| **S12** | The Event Hub drawn as one universal place | **DONE.** Two prototypes + the written half. Four events at one design; the same page at three widths. |
| **S12-B0** | The guest rooms speak the event's own word | **PR #4508.** 11 sentences across the side rooms. A wedding reads byte-identically **and it is asserted** — 10 frozen literals + a pinned count, mutation-proved three ways with occurrence counts printed. |

🔑 **S12-B0 created `app/[slug]/_lib/event-words.ts` — the guest tree's ONE reader of the
per-type organiser noun. Every session below imports it. DO NOT WRITE A SECOND.** A third
vocabulary was already being born in `recap/page.tsx` (a hand-typed `!== 'wedding' ? 'event' :
'wedding'`) and S12-B0 absorbed it. **One vocabulary, never three.**

---

## 🛑 THE CROSS-SESSION MATRIX — COMPUTED TODAY, and it corrects two standing claims

**Scopes at `origin/main`, 2026-08-17.**

| Pair | Shared | Verdict |
|---|---|---|
| **S13 ↔ S14 ↔ S15 ↔ S16** | `_components/site-body.tsx` (1,889 lines) + `page.tsx` (980) | 🛑 **NEVER two of these together.** Every one of them edits both. |
| **S3 ↔ S13 / S14** | the invitation page's empty + refused states | 🛑 **Never together.** S3 already says "run alone"; this is why. |
| **S11 ↔ S13–S16** | `_components/owner-ribbon.tsx` only | ⚠ **CORRECTED — the standing claim is overstated.** |
| **S4 · S5 · S6 · S7 · S8 · S9 · S10 ↔ S13–S16** | **0** | ✅ **Free to run alongside.** Different trees entirely. |

### ⚠ Correction 1 — S11 does NOT share the Hub's body file
`WHATS_NEXT_EVENT_HUB_DESIGN_2026-08-17.md` says S12 "must NEVER run beside S11 — they share the
Hub's body file." **Measured: it does not.** S11 lives in `app/dashboard/[eventId]/**` (guests ·
hosts · vendors · manpower · access-requests). Its ONLY Event Hub footprint is the host ribbon's
coordinator dead-end — *"Edit this site"* at `app/[slug]/_components/owner-ribbon.tsx:53` — and
the ribbon's model is built in `lib/owner-ribbon.ts`, so **S11 can close that dead end without
opening `site-body.tsx` at all.** Downgraded from *never* to *coordinate on one file*.
🔑 **Measure a collision before escalating it** — the same lesson that cost a needless owner
decision on the "Event Hub means three things" scare.

### ⚠ Correction 2 — S3's app-wide footprint reaches the Event Hub, and that was not spelled out
S3's own text names *"the invitation page"* as one of its two starting surfaces. That is this
tree. S3 is already marked "run alone"; **the reason is now recorded** rather than left to be
rediscovered by whoever runs it beside a Hub session.

---

## The order

**One Event Hub session at a time. Any non-Hub session may run beside it.**

| Wave | Hub session | May run beside |
|---|---|---|
| **1** | **S13** the rest of the words | S4 · S5 · S6 · S7 · S8 · S9 · S10 |
| **2** | **S14** the way between the rooms | same (S11 only with the ribbon note) |
| **3** | **S15** the wedding-only parts stay home | same · 🔴 needs the grid |
| **4** | **S16** one measure, three widths | same · 🔴 needs "port it" |
| **later** | **S3** the failed-vs-empty states | 🛑 **alone, and after S13/S14** |

S3 lands after the Hub's words and navigation have settled, so it adopts the states kit on a
tree that has stopped moving. Sequencing it, not re-scoping it.

---

## Paste the SHARED HEADER from `WHATS_NEXT_SESSION_PROMPTS_2026-08-17.md` at the top of every block below, plus these three lines:

```
🪤 A FRESH WORKTREE HAS NO node_modules — symlink the main checkout's or nothing runs.
🪤 `npx tsx --test "app/[slug]/_lib/x.test.ts"` prints "# tests 0" AND EXITS GREEN — the
   [slug] brackets are a glob character class. Run it from inside its own directory.
🔒 THE OWNER'S RULING, 2026-08-17, verbatim: "of course there are parts that is dedicated for
   weddings but there are parts that should also work for non wedding/other events."
   IT IS A SORT, NOT A STRIP. Five things exist BECAUSE it is a wedding and keep every wedding
   word they have — the two-name masthead, the love story, the bride's and groom's sides, the
   five cinematic reveals, the tea ceremony. Never neutralise one of them.
   PROD: every launched event is a wedding, so no non-wedding behaviour can be validated
   against real data. Say that plainly rather than implying you saw it work.
```

---

# S13 · The rest of the words

**WHAT A PERSON GETS:** a graduation, a birthday, a corporate day and a trip open an event page
that speaks to THEM. S12-B0 fixed the side rooms; this fixes the page itself, where ~7 in 10 of
the words are.

**ALREADY SHIPS — DO NOT REBUILD:** `app/[slug]/_lib/event-words.ts` (import it — five cased
forms plus the event word, degrades to "the host", React-cached). All 16 event types already
carry full wording **in production**. You are WIRING, not authoring. `resolveProfile` is already
called on the page for its surface gate — reuse that profile rather than resolving twice.

**SCOPE:** `page.tsx`, `_components/site-body.tsx`, and about ten widget components. **Re-count
first** — S12-B0 found two sentences no earlier count had caught, including *"Pin your cash on
the couple"*.

🛑 **THREE COMPONENTS ARE BUCKET 1 AND MUST NOT BE TOUCHED:** `our-love-story-widget.tsx` ·
`tea-ceremony-card.tsx` · `save-the-date-film.tsx`. Rewording them is the defect, not the fix.

⚠ `_components/empty-states.tsx`'s `photos` plate is **UNREACHABLE** — nothing passes
`kind="photos"` (S12-B0 left a comment saying so). Leave it and say so; do not claim a fix
nobody can see. **Its real owner is S3.**

**GATE:** none. **GUARD:** extend `event-words.test.ts` — pin every newly-rewritten wedding
sentence against a FROZEN literal (duplicated on purpose; an imported string agrees with any
edit) and pin the count. Mutation-prove with occurrence counts printed.

---

# S14 · The way between the rooms

**WHAT A PERSON GETS:** a guest standing in the venue gets from their seat to the directions to
the gifts without going back to a link somebody sent them months ago.

**THE DEFECT, MEASURED — CONFIRM, DO NOT RE-DERIVE:** zero of the 11 sub-rooms mount the bottom
bar (`SiteMenuBar` has exactly ONE importer) · seat · find-seat · find-my-table · venue · gifts ·
recap link ONLY back to the event page · welcome · invite · live-wall · print have **no outbound
links at all** · no room links to any other room. **A hub and spoke with no rim.**

**ALREADY SHIPS:** `_lib/site-nav.ts` is the rules engine and its comments are owner rulings —
**read all 540 lines first.** `app/[slug]/layout.tsx` is **NOT a shell**: `display: contents`,
its own docblock says *"Purely a CSS-variable scope — zero behavior"*. Do not scope a shell
rebuild off it, and do not repeat the claim that one exists.

**BUILD:** the contents index from the prototypes — a printed list under the masthead, resolved
by the SAME rules engine as the bar, listing only what THIS event has. Plus the bar travelling
into the rooms.

🔒 **Five slots stays five. No sixth destination, at any width, ever.**
🔒 **Announce features, hide content.** A part the host kept private is NOT drawn greyed; a part
merely not open yet stays visible with its reason.

**GATE:** none for the phone. **Do NOT build its desktop form — that is S16.**

---

# S15 · The wedding-only parts stay home

✅ **UNBLOCKED 2026-08-17 — THE GRID IS CLOSED.** Owner: *"yes to all four."* All 16 rows of §4
in `event_hub_universal_2026-08-17.html` are now decided; zero cells left open. The four he
called: a **corporate day GETS the 3D room** · a **tournament lists fixtures and does NOT seat
spectators** · a **wake MAY accept money, with gentler wording** · **funeral and baptism are
approved as new event types**. Full row in `DECISION_LOG.md` 2026-08-17.
⚠ **They were answered as a block, not individually — if one reads wrong, it is one word to
correct. Do not treat any single cell as separately confirmed.**
🔴 **THE FUNERAL TYPE IS NOT PART OF S15 AND MUST NOT RIDE ALONG — see S17 below.**

**WHAT A PERSON GETS:** a birthday stops being handed a wedding.

**THE LEAK, AND IT IS LIVE:** the event-type profile RECORDS that Save-the-Date and monogram are
wedding-only — and the guest tree never reads those answers; it consults exactly two surfaces
(`website`, `seating`). So a non-wedding created far enough ahead renders the **wedding
Save-the-Date film**, and a typeless event gets a **wedding-style lettered monogram**. Confirm
both **by the object** before building.

**WHY IT IS THE LARGEST:** per-block, per-event-type gating **does not exist**. All 16 registry
blocks are seeded type-blind and the body-plan resolver never reads the event type.

**DO NOT INVENT THE SHAPE — the repo holds it twice.** `WIDGET_PHASES` and `WIDGET_SPOTLIGHT` in
`lib/invitation-widgets.ts` are compile-time-exhaustive matrices, so a new block is a TYPE ERROR
rather than a silent gap. **One matrix, in the shared body-plan chokepoint — not a check in
three places.** Three surfaces each asking separately is exactly how the photo-wall defect
happened.

**REGISTER AT MINIMUM:** the Save-the-Date film + its reveal openings · the monogram fallback ·
the love story · the bride's/groom's side labels · the wedding-song credit · the tea ceremony.

---

# S16 · One measure, three widths

🔴 **BLOCKED until the owner says "port it."** The drawings are approved **as drawings**. Moving
where the controls live at every screen size is expensive to reverse; *"looks good"* on a
prototype is not that authorisation.

**MEASURED — CONFIRM:** the Event Hub uses `sm:` **124**, `lg:` **23**, `md:` **ZERO** (app-wide
`md:` is 65 against 2,318 `sm:` and 625 `lg:` — **the tablet breakpoint is an orphan in the whole
product**) · the guest tree has **EIGHT different content widths** · **the bottom bar is `fixed`
at ALL widths**, so on 1440px it stripes the full screen with five tabs clustered in the middle.
That is shipped behaviour, not a hypothetical.

**PORT, DO NOT REDRAW:** three measures replace eight; the tablet costs **no new breakpoint**
(portrait is the 640 form with proper margins, landscape already crosses 1024 and takes the
desktop arrangement); above 1024 the five slots stand up as a left rail — same five, same order —
and the pinned bar does not render there.

🎨 **THE COLOUR TRAP — it has bitten three times.** The Tailwind slot named `terracotta` is the
atelier GOLD `#A9834B`; the action terracotta `#C24E25` lives in the slot named `mulberry`.
Backwards, so `text-terracotta` LOOKS safe and is the unsafe one at **3.37:1 on cream**, under
the 4.5:1 floor. Use `text-mulberry` (4.61) or `text-link` (8.22). Gold on an ICON is fine, never
on text; it has ~0.29 headroom on cream so ANY tint under it fails — **hover moves the border or
the shadow, never adds a fill.** Check BOTH themes on every tinted block.

---

---

# S17 · A wake is not a celebration

✅ **Approved 2026-08-17** (owner: *"yes to all four"*). 🛑 **Its own session. Do NOT fold it into
S15 — it is not a row in a table.**

**WHY IT IS BIGGER THAN IT LOOKS, and this was flagged the hour it was approved:** the other 15
types are all celebrations and share one voice. The Event Hub says *celebration · party · guests ·
countdown · photo wall · the digital money dance* throughout. **A countdown to a funeral** is the
clearest example of a shipped mechanism that is not merely mis-worded but actively wrong. Adding a
wake is a **tone build across the whole guest tree**, and it lands on a family on the worst week
of their life — the one audience where getting the voice wrong is unforgivable.

**Scope it as: which parts a wake gets** (grid row already decided: the page · getting there ·
messages · watch the service · the album · money, gently — **no RSVP, no seating, no camera in the
middle of the bar, no countdown**) · **then its voice.** The drawn wake in §1 of
`event_hub_universal_2026-08-17.html` is the reference.

⚖ **BAPTISM IS THE OPPOSITE — cheap, and possibly nothing.** `christening` already covers the
occasion in practice and already carries the right vocabulary (its VIP tier reads *"Godparents"*).
So baptism is a **naming and discoverability** question — does a family searching "baptism" find
"christening"? — not a new voice. **Measure that before building anything.** An add-an-event-type
checklist already exists in the project notes; the mechanical cost is known and small.

---

## Deliberately NOT in S13–S16

- **Adding funeral and baptism as event types.** Neither exists. The drawn wake is a proposal,
  not a repair. `OWNER_DECISION`.
- **Anything that makes the Event Hub editable.** It is a PLACE, not a control panel
  (owner-locked). The host keeps a read-only ribbon.
- **Re-drawing the July "Pahina" look.** Seven merged changes already rebuilt this page's
  appearance and **it has never been looked at on a phone.** Two owner wording decisions from
  that wave are still open (the RSVP option labels; whether the ask disappears once answered).
  Looking at it costs nothing and may close items that read as unfinished.
