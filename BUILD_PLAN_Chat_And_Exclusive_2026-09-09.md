# BUILD PLAN — the conversation, the bench, and the Setnayan Exclusive

> Everything decided with the owner on **2026-09-09**, ordered into buildable sessions.
> Design is **BINDING**: [`prototypes/chat_interface_v4_2026-09-09.html`](prototypes/chat_interface_v4_2026-09-09.html)
> (+ its `.md`). Port it; never redraw it. Economics:
> [`Setnayan_Exclusive_Study_2026-09-09.md`](Setnayan_Exclusive_Study_2026-09-09.md).
> Decisions: `DECISION_LOG.md` 2026-09-09 (three rows).

---

## 🛑 THE RULE THAT GOVERNS EVERY BENCH SESSION

Owner: *"make sure that we are adding value and not deleting feature on the pages that
will be edited (bench)."*

The bench (`shortlist-categories.tsx`) is the densest surface in this product. v3 of the
design drew a card from scratch and **silently lost the vendor photograph, the ★ Chosen /
Asked corner, city, rating, the Setnayan and Verified badges, the fit badges, the price,
the free-dates line, Find, and Add manually** — and it took the owner's eye, not a
review, to catch it.

**Three mechanical defences, all of which already exist:**

1. **`lint-port-no-lost-controls` is exactly this guard, and it already ships.** Every
   bench PR keeps it green. ⛔ **Regenerating the baseline to quiet it is forbidden in
   this stream** — the tempting fix records a removal that never happened. If it fires,
   the answer is to put the control back.
2. **v4's § "element table" is the checklist.** 44 rows: every element the shipped card
   renders and where it lives. A bench PR states which rows it touched.
3. **A new guard pins the card's element set** (session B0), so a future edit that drops
   the rating or the photograph fails a test rather than a person's memory.

🔑 **Additive by construction.** Every bench change in this plan adds ONE line and
relabels ONE control. Nothing is removed from a bench card, ever.

---

## STREAM A · THE CONVERSATION

| # | what | state |
|---|---|---|
| A1 | Tools become a list; panels mount once | ✅ **MERGED** [#5327](https://github.com/iscasasola/setnayan-platform/pull/5327) |
| A2 | A closed tool takes no space; one open at a time | ✅ **MERGED** [#5336](https://github.com/iscasasola/setnayan-platform/pull/5336) |
| A3 | The ladder gains **Completed** and **Cancelled** | ✅ **MERGED** [#5328](https://github.com/iscasasola/setnayan-platform/pull/5328) |
| A4 | Chat files private + compressed | ⏳ **OPEN** [#5339](https://github.com/iscasasola/setnayan-platform/pull/5339) |

⚠ Verify each with `gh pr view <n> --json state,mergedAt` — this corpus has been wrong
about a PR's state more than once.

### A5 · The Message button opens the conversation *(small, no dependency)*
A booked supplier's card sends the couple to the **whole list** with a *"pre-filled from
vendor profile · just tap Start thread"* pill and a form — **even when the thread already
exists**. Open that thread. Also retire the two other prefill paths (the budget page and
the follow gate); the shortlist's own *Inquire* already does it correctly.

### A6 · Previews are written short *(no dependency)*
Measured in v4: the desktop list gives **~32 characters**, the phone **~50**. The old
*"Guest count changed — now planning for 170"* is 42 and could never fit. Generated lines
become fact-first — *Guests → 170 (was 150)* · *You: ₱40,000 deposit received* · *You:
Quote ₱112,500 sent*. Only a **typed** message is ever truncated with "…". A service tag
renders only when it is not the shop's only service; a date tag only within 60 days.
⚠ v3 also proved the preview element could not ellipsis at all (inline span, `clientWidth`
0) — fix the element, not just the words.

### A7 · The change / adjustment card *(BLOCKS A8)*
🔴 A message can carry four markers — quote, meeting, **change**, adjustment — and **the
change marker has no renderer at all**. Decisions built now would silently omit changes,
and a filter that silently omits is worse than none, because it is trusted.

### A8 · Decisions *(depends on A7)*
The **All · Decisions · Files** switch. Each card ends with a **NOW** line — the quote
still says what it said when sent, then *"Booked · accepted 1 Sep"*. One standing line
above. ⛔ Only the five ladder words may wear a stage pill; the standing line is built
from the same NOW sentences so it cannot disagree with the badge above it. ⚠ Three
sources must merge into one timeline: chat messages, the guest-count card and the
couple's payment card are page sections, not messages.

### A9 · The conversation column *(a branch is parked)*
`claude/parked-conversation-column` holds a working list column with the filter chips and
a batched row builder. **Reconcile with v4 before shipping** — the couple's filters differ
(All · Has a quote · Booked · Waiting · Closed).

### A10 · A service offered in chat arrives as a CARD
🔴 Today *Offer another service* sends `{ id, label }` and the couple gets **a word added
to a chip row**. A service card carries a **cover photo (required to publish)**, a
**showcase clip ≤30s** and showcase photos — none of it travels. The pitch is the card;
send the card.

---

## STREAM B · THE BENCH — additive only

### B0 · The element guard *(do FIRST — it protects every session after it)*
A test that pins the bench card's element set from v4's table, so dropping the photo, the
rating, the corner state, Find or Add manually fails a test.

### B1 · A booked supplier can be messaged from the bench
🔴 **Verified in the code:** `if (vendor.status === 'locked') return NO_ACTIONS;` — a
locked card renders **no controls at all**. Correct for *Add to build* and *Lock this*;
wrong for the conversation, so **a couple cannot open a thread with the supplier they
actually booked** — the one card most likely to have something waiting. Narrow the rule
to withhold build and lock only. **Adds a control; removes none.**

### B2 · The standing sentence on a bench card
One line under the meta block: *Quoted ₱187,500 · waiting on you*. ⚠ **Derived once**
(`resolveThreadStage` + `rowReadsCompleted`, shipped in #5328) and rendered in three
places — the bench card, the Picks column and the conversation. Owner: *"yes, it is fine
to show it twice."* Never three derivations, and never two controls doing one job.

### B3 · "2 suppliers replied" at the top of the page + the Picks chip

### B4 · The bench's own AA failures
Gold-on-gold below the floor in two shipped places (`● N locked` ≈ 4.25, *In your plan* ≈
4.39). Pure fix, no behaviour.

### B5 · "Check inquiry" → "Open conversation" *(relabel only, after B2)*
Only once the row above says what is waiting; the label alone is not the improvement.

---

## STREAM C · THE SETNAYAN EXCLUSIVE

**Model, settled:** no booking fee → no gift · the gift is **added** to the lock bill,
never deducted · **no cap**, sized as a share of the **fee** (proposed **40%**) · granted
when the **money clears** · **mandatory** (an optional gift is a race to the bottom).

### C1 · The shelf, and the publish gate
The Exclusive stops being free text and becomes a **pick from five**: Papic credits ·
Setnayan AI · Event Hub Pro · Live Studio · Mood Board Render Pack. The gate today holds
only **price** and **exclusive**; add **cover photo** (its own comment already calls it
required and nothing enforces it), **title** (both live cards have none, so they render as
their category) and **what's included**.

### C2 · Availability + fallback
🔒 **Show what is GIFTABLE, never what the couple OWNS** — the shelf omits what is taken;
it never displays their purchases. Papic credits and Mood Board renders are **unlimited**;
Setnayan AI and Event Hub Pro are **once**; ⚠ **Live Studio is sold per event-DAY —
confirm before treating it as once.** The pick is a **preference, not a reservation**:
resolved at grant time, automatically, and **the fallback matches the VALUE, not the
item**.

### C3 · The grant
Use the shipped `comp_grants` / `source='vendor_self_comp'` — event-scoped, SKU-scoped,
expiring, with a per-quarter quota trigger and an admin cap table. **Zero rows of any
source exist.** Build the link, not a mechanism.

### C4 · The billing line
The gift rides the lock bill beside the fee. ⚠ Where a second (onboarding) price exists —
Papic rungs, Setnayan AI — **charge the supplier the lower price and hand the couple the
retail product**, so a supplier giving cash instead is knowingly giving their couple less.
**Event Hub Pro, Live Studio and the Mood Board pack have no second price** and need one.

### C5 · "Starts at" becomes the bottom rung
Nothing today compares a quote to the card's own *"from ₱X"*. Make it the floor for
earning a gift — ⛔ **never a block on quoting lower**, which would push the conversation
off the platform.

---

## GATES — owner's, and each one blocks its session

| # | gate | blocks |
|---|---|---|
| G1 | **40%** of the fee — the number, not the shape | C1 · C4 |
| G2 | Do the **first five free bookings** carry a gift? | C4 |
| G3 | Measured cost of the **Mood Board pack** and **Live Studio** — the only two on the shelf that cost per unit, and neither has a figure | C1 |
| G4 | A **supplier price** for Event Hub Pro · Live Studio · Mood Board pack | C4 |
| G5 | Is **Live Studio** once-per-event or per event-day? | C2 |
| G6 | `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED` — the whole bench sits behind it and its value is not readable from a session | B1–B5 |

⚠ **The Exclusive cannot be PROVEN until the booking fee charges anybody.** It is
flag-dark and prod holds zero real shop bookings. Build it; test it with the fee's own
first live round.

---

## ORDER

**Now, unblocked:** A5 · A6 · B0 · B1 · B4
**Then:** A7 → A8 · B2 → B3 → B5 · A9 · A10
**Behind gates:** C1–C5

🔑 **B0 before any other bench session.** The guard that stops a feature being lost is
worth more than the feature being added.
