# Setnayan — brief 04 · The admin console
### The Setnayan team's own workspace. Internal only. Desktop-first.

> Read **brief 00 · Foundation** first. Colour, type, voice and the shared rules all live
> there and are not repeated here.

---

## 1 · What this surface is

**Around 114 pages**, all internal, none of them ever seen by a customer or a vendor.

This is where the Setnayan team verifies a supplier's government ID, confirms that a bank
transfer matches an order, settles a dispute between a couple and a caterer, reviews a photo
that got flagged, approves a price change, and answers a person exercising their legal right
to have their data erased.

**It is the lowest-glamour and highest-consequence surface in the product.** A wrong tap here
takes real money from a real small business, or publishes something that should not have been
published, or deletes something that cannot come back.

**Design for a tired person at 11pm doing the fortieth one of these today.**

---

## 2 · What is already built — do not rebuild it

Two things shipped in August 2026 and are settled:

- **A ranked work list** — the single screen that says what needs the team today, ordered by
  urgency, with lanes and a triage strip. It expands the top few items of a queue inline so a
  simple decision does not require opening another page.
- **A map of every surface** — the "everything else" index.

**Do not redesign either.** Extend them.

Also settled, and load-bearing — **the rule for what shape an action takes**:

| The decision is… | It gets… | Examples |
|---|---|---|
| **a fact** — the system already knows the answer | **one button**, settled inline | confirming a payment, verifying an ID, approving a queued item |
| **needs details** — the action genuinely cannot run without typed input | **a small form**, inline | publishing a review override (a reason is required), recording a payout (method and reference of a real bank transfer) |
| **a judgement** — a human has to weigh something | **no button at all** — a sentence where the buttons would be | disputes, fraud, user reports, erasure requests, integrity watch, abuse, force majeure |

**That third row is the important one and it is deliberate.** A fast button invites a wrong
call at speed on exactly the queues where being wrong costs most. Silence alone would read as
an unfinished feature — so the sentence is there to teach the rule.

**The shape is decided by what the action genuinely requires, never by taste.** If you are
unsure which row something belongs in, that is a question about the action, not the design.

---

## 3 · What lives here — grouped by what the person is doing

**Money** — payments coming in and matching them to orders, refunds, receipts, payouts,
booking fees owed, pricing and the catalogue of what is sold, discount codes, subscriptions,
tax paperwork.

**Trust and safety** — supplier verification and their submitted documents, disputes, fraud
watch, user reports, flagged chat, content that reposts someone else's work, abuse of the
concierge, integrity checks.

**Legal and privacy** — data-privacy controls, requests to delete an account, erasure
requests, regulator readiness, consent records.

**Content** — the journal and editorial review, real stories, spotlight awards, songs,
background videos, media stored on the website, help articles, the search-and-AI surface.

**Operations** — the ranked work list, queues, approvals, event types and taxonomy, venues,
wedding traditions, demo accounts, integrations, secrets, settings, app performance, the
offline state.

**Insight** — growth, demand, funnels, insights, intelligence, the internal map of how the
system fits together.

---

## 4 · The design problem, stated honestly

Around **95 of these 114 pages are the same page**: a dense table of things, with filters, a
search, and one or two actions per row.

**So the work is not 114 designs. It is one excellent table, and about a dozen exceptions.**

Make that table genuinely good and the entire console improves at once:

- Dense by choice — this is the one place in the product where tabular density beats
  whitespace. A person is comparing rows, not reading.
- Sorting, filtering and searching that survive a page reload and can be sent to a colleague
  as a link.
- Bulk selection where it is safe, and **conspicuously absent where it is not** — there is
  deliberately no bulk delete on media, and that kind of restraint should look intentional.
- Row-level state readable at a glance without reading the words — a stripe, a chip, a weight.
- An honest row count, including *"we could not measure this"* as a distinct state from zero.

---

## 5 · The traps this surface has actually fallen into — design against them

These are real failures from this console, not hypotheticals. Each one should shape a
component.

1. **A queue that could not be measured was filed under "all clear."** Putting an unmeasured
   thing in the one place a person has been told they need not look. **Design a distinct
   "could not tell" state** and make it impossible to confuse with zero.
2. **A refusal happened silently.** An action declined to run, said nothing, and the row
   simply vanished from the list — so it looked like success. **Every refusal needs somewhere
   to be seen**, on the screen where it happened.
3. **A safety check ran, found nothing, and reported "all good"** — because the check itself
   was broken. **Design the difference between "we checked and it is fine" and "we did not
   manage to check."**
4. **A live file sat under the heading "probably left over" with a delete button switched on.**
   Prose is not a safety mechanism. **If a thing might be in use, the destructive control must
   be off, not merely accompanied by a warning.**

---

## 6 · Deliverables

Desktop is primary here; give each a phone view only where a person genuinely acts on the move
(approvals, verification, the work list).

1. **The one great table** — filters, search, sort, selection, row state, pagination, and its
   empty / loading / could-not-measure / error states. This is the centrepiece.
2. **The ranked work list, extended** — with the three action shapes from §2 shown side by
   side, including a judgement queue with its sentence instead of buttons.
3. **A money screen** — matching an incoming payment to an order, including a short payment
   and a suspected duplicate.
4. **A verification screen** — a supplier's submitted documents, with the approve / reject
   decision and what the rejection tells them.
5. **A judgement screen** — a dispute, designed to be slow on purpose.
6. **A record page** — one of anything, shown in full, with its history.
7. **A destructive action** — the confirm pattern, and the rule for when a control is simply
   disabled instead.
8. **The component set** — table row, filter bar, status chip, severity stripe, inline form,
   audit trail, the four honest states from §5.

---

## 7 · Also include, in words

- Every **empty, loading, error and could-not-measure state** as real copy.
- A **ranked build list** — each item *extends something that exists* or *new*.
- **"What I deliberately did not change, and why."**
- One line on **which of the three action shapes** each screen you designed uses, and why.

---

## 8 · Do not

- Do not rebuild the ranked work list or the surface map. Extend them.
- Do not put a fast button on a judgement queue.
- Do not show a confident zero for something that failed to load.
- Do not add bulk destructive actions.
- Do not sacrifice density for prettiness here — this is the one surface where density wins.
- Do not use gold as a button colour. Do not design a dark mode.

---

## 9 · Priority, stated plainly

**This surface ships last.** It is internal, no customer or vendor ever sees it, and its ~114
pages collapse into roughly one pattern. Design the table well, design the dozen exceptions,
and stop. Do not spend on polish here that belongs on the pages a couple actually sees.
