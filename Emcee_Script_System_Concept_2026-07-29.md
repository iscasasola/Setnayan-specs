# THE EMCEE SCRIPT SYSTEM — the full concept

> **2026-07-29.** Written in answer to *"we want to help the emcees be able to help creating
> their scripts, and plotting of the planned scripts for each part of the event... do you have
> the full concept of this?"* Companion to
> [`Whats_Next_Day_Of_Desks_And_Emcee_Catalogue_2026-07-29.md`](Whats_Next_Day_Of_Desks_And_Emcee_Catalogue_2026-07-29.md),
> which holds the build list and the traps.

---

## 0 · The whole thing in one sentence

**The emcee does not write a document. He fills in a LAYER over the couple's night, and the
script assembles itself** — on paper while he prepares, on his phone while he works.

Everything below is in service of that. Today he writes his script in Word, retyping names and
times the app already holds, and it goes stale the moment the couple moves dinner.

---

## 1 · The rule that makes the roles fit together

The apparent contradiction — *"only the coordinator can alter"* (2026-07-29) versus *"the
schedule will be handled by coordinator, emcee, hosts"* — dissolves once you separate two
different things that both look like "the schedule":

| | **PLANNING** the night | **RUNNING** the night |
|---|---|---|
| When | any time before | on the day |
| What it touches | which blocks exist, their order and length | `run_state` — which block is LIVE right now |
| Who | **couple · coordinator · emcee** | **coordinator; the event owner if there is no coordinator** |
| Why | three people hold different pieces of the plan | every screen in the building follows this pointer — two hands make the night flicker |

**Many may plan. One may run.** Both decisions stand, unchanged; they were never in conflict.

---

## 2 · One timeline, three planners

`event_schedule_blocks` stays the single shared truth — one night, one list, everyone looking
at the same thing. What differs is how each role reaches it:

- **Couple / host** — owns it outright.
- **Coordinator** — asks the host for the `schedule` area; the host approves. **Ships today**
  (`event_moderators` + `moderator_area_level(event,'schedule') === 'edit'`, surfaced by
  `ask-access.tsx` on the floor-command desk).
- **Emcee** — **the same mechanism, nothing new.** `FLOOR_REQUESTABLE_AREAS` already contains
  `schedule`, and the ask/approve flow is vendor-generic. He asks; the host approves; he can
  place his segments. Withdraw it and he is read-only again the same minute.

> This is the whole access answer: **one grant model, two vendor trades.** No new permission
> concept, no new table — the emcee reuses the coordinator's door.

---

## 3 · What the emcee prepares, and when

### A · Once — and it follows him to every wedding after

| | State |
|---|---|
| **His activity catalogue** — his segments, each with a real length | ✅ **BUILT** (`/vendor-dashboard/activities`) |
| **His question template** — the things only a couple can tell him | ⛔ not built (§3.C of the handoff) |

This is his **craft**, and it is the reason to stay on the platform: after twenty weddings his
catalogue and his questions are sharper than any competitor's blank page. Per the owner's
2026-07-29 split, **these travel; nothing about a past couple travels with them.**

### B · Per booking — the gathering

1. **Read the brief.** He already gets, free: both names · ceremony type · venue · headcount ·
   the mood · the love story · how long they have been together · their special message · their
   onboarding answers about vibe, court, entertainment, food.
2. **Ask only what is missing.** A questionnaire that asks for the venue is insulting. The real
   gaps — none of which the app can ever infer:
   - **how to pronounce these names** (the single most valuable field for a PH emcee)
   - **titles and honorifics** — Atty. · Dr. · Engr. · Hon. · Bishop
   - **who to acknowledge, in what order** — this is where sponsor names arrive, and it is why
     he never needs the guest list
   - **what he must NOT say** — the estranged parent, the ex, the unannounced pregnancy, the
     surprise. ⚠ **The highest-value question in the whole system, and unknowable by any other
     means.**
   - **who speaks, in what order**
   - **language and register** — English · Tagalog · Bisaya · mixed; formal or warm
3. **The couple picks** from his catalogue. ✅ **BUILT** (on their schedule page).
4. **They answer** in the working folder they already share with him — ✅ the mechanism ships
   (`vendor_working_notes`, private-vs-shared, couple can write). No new inbox.

### C · Plotting — the part being asked for

Two motions, and they are different:

- **Placing** — a picked segment becomes a real block. Today it appends after everything
  scheduled and the couple drags it home (✅ built, deliberately never reflows their day). **With
  the `schedule` grant, the emcee places and retimes it himself.**
- **Scripting** — for each block, what he will actually SAY. This is the layer, and it is the
  missing centre of the whole feature:

| The block gives him | His layer adds |
|---|---|
| what happens, when, how long | his opening line for it |
| the couple's `notes` (their instruction) | pronunciations, the names to read |
| the shared `BLOCK_CUE` prompt | what to skip, what to stretch if they are late |

⚠ **"My notes" is therefore not a scratchpad — it IS the script**, pinned per moment. That
raises its priority: it is the artefact, not a convenience. (Corrected 2026-07-29: an earlier
log entry wrongly recorded it as superseded by the questionnaire. They are different jobs —
notes are what he says; questions are what he needs to know.)

### D · The output, twice

- **While preparing** — `buildEmceeScript` already compiles blocks into a readable, printable
  script (✅ ships, on the couple's schedule page). **Extend it** to fold in his layer and the
  answers, and give him his own copy.
- **On the night** — the **Script & cues** desk (✅ built): cue card from `run_state`, the
  running script, the couple's announcements, and the emergency notice.

**Nothing is retyped, and nothing goes stale** — move dinner and both outputs move with it.

---

## 3.5 · WHERE IT LIVES — the Customer Card, not chat

Owner asked: *"we have a page for this? this is basically on their chat. a special function for
the emcee?"* **Yes to the page, no to chat, and yes to a per-trade function — because that
pattern already ships three times over.**

### The Customer Card is the vendor's per-booking home

`/vendor-dashboard/clients/[eventId]` already has tabs — **Overview · Quote & Payments · Files ·
Schedule · Activity** (`customer-card-nav.tsx`) — and, crucially, **every trade already has its
own working sub-page hanging off it:**

| Trade | Their page | State |
|---|---|---|
| Caterer | `clients/[eventId]/production-sheet` | ✅ ships |
| Bar | `clients/[eventId]/cocktail` | ✅ ships |
| Photographer | `clients/[eventId]/editorial-media` | ✅ ships |
| Seating | `clients/[eventId]/seat-plan` | ✅ ships |
| Stylist | `clients/[eventId]/mood-board` | ✅ ships |
| **Emcee** | **`clients/[eventId]/script`** | ⛔ **the only trade without one** |

So this is not a new concept to invent — it is **the one missing instance of a pattern the
product already commits to.** A caterer opens their client and gets portion maths; an emcee
opens theirs and should get his script.

There is even a **Schedule tab already on the card**, which is where plotting belongs once he
holds the `schedule` grant (§2).

### Why NOT chat

Chat is for the conversation — asking, agreeing, chasing. It is the wrong home for a script for
one plain reason: **you cannot read a script out of a chat log at 9pm with a microphone in your
hand.** A script needs to be ordered by the night, not by when things were said, and it must
still be correct after the couple moves dinner. A thread is neither.

He still *asks* through the channels that exist — the shared thread and the working folder —
but the **artefact** lives on his page.

### What is already there vs what is new

- `vendor_client_notes` ✅ **ships** — private, team-shared CRM notes on the card, vendor-org-only
  RLS (off-limits to the couple **and** to Setnayan admins). This is the right shape and the
  right privacy for "his own notes"… but it is **per-client, not per-block**, so it cannot hold
  the script layer. Keep it for "what I know about this couple"; the script layer stays separate
  and per-block.
- The `script` sub-page, the per-block layer, and the questionnaire are the new parts.

---

## 4 · What is actually missing

Only three things. Everything else in this concept already ships.

| # | Missing | Size |
|---|---|---|
| 1 | **The script layer** — his line per block. The centre of the feature. | new table (`vendor_block_scripts`), per-event, per-block, vendor-private |
| 2 | **The question template + answers** — his reusable set; answers per event | `vendor_questions` (travels) + answers (per-event) |
| 3 | **Wire the emcee into the existing `schedule` ask/approve flow** | reuse `ask-access` — no new access model |
| 4 | **The `script` sub-page** on the Customer Card | one route + a nav entry — the same shape as `production-sheet` |

Then extend `buildEmceeScript` to include 1 + 2, and surface them on the desk that already
exists.

---

## 4.5 · The three lenses — see it

**[`0022_vendor_dashboard/Three_Lenses_Prototype_2026-07-29.html`](0022_vendor_dashboard/Three_Lenses_Prototype_2026-07-29.html)**
· artifact <https://claude.ai/code/artifact/7349e085-1b79-484b-9bc5-0c95bf869b65>

One wedding, one timeline, switchable between **the couple · the emcee · the coordinator** —
with a per-role control ledger and the full capability matrix. Verified in-browser: the emcee's
script layer renders **only** in his view (0 elsewhere), the advance control renders **only**
for the coordinator, and "Remove" renders **only** for the couple.

What the prototype makes obvious, and prose does not:

- The couple's **instruction** on a block and the emcee's **script** for it are two different
  layers sitting on the same moment. Everyone working the night reads the first; only he reads
  the second.
- The emcee's edit rights are **on loan** — the banner at the top of his screen says the couple
  shared the schedule and can take it back, which is the honest way to render a grant.
- The coordinator's screen is the only one that says **"live"**. The other two say *planning*.
  That single word is the planning/running split made visible.

---

## 5 · Open — needs the owner

- ⚠ **"activities which GUESTS can pick"** — everything built assumes the **couple** picks.
  Guests choosing what happens at the reception is a different, much larger feature (a
  guest-facing surface). **Asked twice, still unanswered.** Do not build either reading on a
  guess.
- Emergency notice wording: presets vs free text (recommendation on record: presets; explicitly
  non-blocking).
