# Your Team — build plan (2026-09-22, rev 2)

**Approved drawing:** `prototypes/your_team_FINAL_2026-09-22.html` — owner, verbatim: **"that is good enough"**.

**Status: PLAN ONLY. The prototype is approved; the WAVE IS NOT OPEN.** Two of seven prototypes are
undelivered and four are being rebuilt JavaScript-free. Nothing here is built until the REDESIGN
CONTROLLER launches a slice.

Route: `/dashboard/[eventId]/vendors` · session: Event Your Team.
Measured against `origin/main` 2026-09-22. Re-measure every path and size before acting — the bench
grew from 2,125 to 3,643 lines during this redesign.

---

## Branch and wave rules

- **Branch `rd/…`, never `claude/…`.** `apps/web/vercel.json`'s `ignoreCommand` skips previews for
  `claude/*` **by name**, so a `claude/` branch produces no preview the owner can open. The
  controller proved an `rd/` branch reaches READY.
- One worktree per slice, off `origin/main`: `git worktree add ../wt-rd-<slug> -b rd/<slug> origin/main`.
- **One commit per slice, named for the slice.** Never squashed — a slice that turns out wrong after
  merge must be revertable on its own.
- No push, no PR, no auto-merge. The controller bundles.

## 🔑 MIGRATIONS: NONE. Not one slice needs one.

Stated as its own line because two other sessions have migrations queued and cannot share a wave
without allocating forward. **This plan adds no migration and touches no file under
`supabase/`**, so it can ride any wave in any order without a prefix collision.

Everything the plan needs already exists in the schema:

| need | already shipped |
|---|---|
| per-event notices | `notifications.event_id` — merged today (#5857) |
| a price on a self-added supplier | the writer in `vendors/actions.ts`, guarded by `price-only-leaves-the-rest-alone.test.ts` and `agreed-total-and-its-changes.test.ts` |
| a home for an unclassifiable supplier | `everything_else` — merged today (#5871) |
| per-thread unread | `unreadThreadIds` / `unread` in `lib/conversation-list.ts` |

---

## The slices, in launch order

### SLICE 0 · Cap the two uncapped lists — launch this first

`waiting-for-quotes.tsx` and `pending-lock-proposals.tsx` each render a bare `items.map(...)` with
**no cap and no "…and N more"**, and `vendors/page.tsx` renders **both above**
`<ShortlistCategories>`. `waitingForQuotes` is `push`ed once per pending inquiry with no upstream
limit either.

**Measured in the approved drawing, phone width:** the bench starts at **4,806px** today against
**757px** capped; page height **8,449px** against **4,400px**. About five screens before a couple
can look for anybody.

A defect the owner found himself. **Needs nothing from his desk.**

- **Pure module:** `lib/capped-rows.ts` — `capRows(items, ceiling) → { shown, hiddenCount }`. Total, ordered, no DOM.
- **Files:** `lib/capped-rows.ts` (new) · `_components/waiting-for-quotes.tsx` ·
  `_components/pending-lock-proposals.tsx` · `lib/capped-rows.test.ts` (new).
- **Proof:** the test EXECUTES `capRows` at 0 / 1 / ceiling / ceiling+1 / 100; a source guard
  asserts neither component maps over its full input.
- **Sabotage to watch go red:** return `items` unchanged from `capRows` → unit test fires. Remove
  the cap from one component → source guard fires.

### SLICE 1 · Badge counters — **BLOCKED on open question 1**

Per-card unread, rolled up to category and folder, from **one** stored source. Two stored counts
disagree within a week and each passes its own test.

⛔ **Do not start until the owner says what the badge counts.** See question 1 below — the answer
decides which table it reads, what the action says, and what clearing it does.

- **Pure module:** `lib/bench-unread.ts` — `cardUnread` / `tileUnread` / `folderUnread` from one
  `Map`, with the roll-up as a function.
- **Files:** `lib/bench-unread.ts` (new) · `_components/shortlist-categories.tsx` ·
  `vendors/page.tsx` · `lib/bench-unread.test.ts` (new).
- **Proof:** folder total === Σ category totals === Σ card counts over a 100+ fixture; opening one
  thread clears exactly one card.
- **Sabotage:** store a second count at category level and let it drift → the invariant fires.

### SLICE 2 · A supplier is their card — the biggest slice

The roster folds into the bench card, which carries the full state: price or "No price recorded",
locked / mid-handshake / candidate, the next step, the actions. Owner: *"just move them to their
cards"*.

**Copy is the contract.** From `lib/explore-info-copy.ts`, not paraphrased: `Add to build` (no `＋`),
`Adding…`, `In your build`, `Remove`, `Ask for a price to add this to your build`, `Inquire`,
`Open conversation`, `Lock this`, `Requesting…`, `Waiting on them`, `Take it back`,
`In your build — can't lock right now`. From `build-locked.tsx`: `Locked in`, `Pay your deposit`,
`Deposit sent · waiting for them to confirm`, `Deposit confirmed`, `Send it again`.

- **Files:** `_components/shortlist-categories.tsx` · `_components/build-locked.tsx` ·
  `_components/services-takeover.tsx` · `lib/your-team.ts` · tests.
- **Proof:** a test EXECUTING `buildShortlistFolders` asserting every supplier the roster used to
  render is present on a card **by id, not by count**.
- 🪤 A supplier whose category has no tile would have no card and vanish — which is why #5871 landed
  first. Two of this couple's four suppliers are `category = 'misc'`.

### SLICE 3 · The money split — **BLOCKED on open question 2**

"Paid to suppliers" and "Setnayan orders" become separate figures, and the buffer refuses to compute
while any locked or candidate row has no price.

- **Files:** `_components/merkado-budget-lens.tsx` · `lib/your-team.ts` (`teamMoney`, `bufferTile`) · tests.
- **Proof:** `bufferTile` returns the refusal state whenever any input price is null, executed with
  the real production shape (2 locked unpriced, 2 candidates unpriced, ₱2,250,000).
- **Sabotage:** make `teamMoney` treat a null price as 0 → the refusal test fires.

### SLICE 4 · Remove the two task surfaces — sequence AFTER Overview

"Decide next" and "From your suppliers" come off. Overview already owns both.

⛔ **Not before Overview settles what its counts are called.** Removing this door while Overview
still says "23 categories still open" leaves one number with nothing saying which set it names.

- **Files:** `_components/services-takeover.tsx` · `_components/build-locked.tsx` ·
  `vendors/page.tsx` · tests.
- Also in passing, said in the commit rather than smuggled: the stale CSS comment in
  `shortlist-categories.tsx` describing pills that no longer render that way.

---

## Open questions — TWO are load-bearing. Three are not.

The controller asked which are genuinely load-bearing, meaning **the build is wrong if he answers
the other way**. These two:

### 1 · What does the badge count? · blocks SLICE 1

Three different mechanisms could power "1 new" on a supplier's card, and they are not the same fact:

- **unread messages in that supplier's thread** — `unreadThreadIds` in `lib/conversation-list.ts`,
  "something was said here after you last opened it";
- **unread notifications about them** — `notifications` rows scoped by `event_id`, which includes
  `payment_info_sent`, `order_paid`, `payment_matched`;
- **unanswered** — a distinct fact the same file is careful to separate: *"a supplier who has
  replied still has an unread row when the couple wrote back; a conversation the supplier owes a
  reply to may be perfectly well read."*

**Recommendation: unread messages in the thread.** The badge's job is wayfinding on the bench, the
action beside it reads "Read their reply", and opening the conversation is a clearing act the couple
performs deliberately. Notifications are Overview's job.

**Cost of getting it wrong:** every number on the page counts the wrong thing, the action label lies,
and clearing does not clear. It is not a copy fix — it reads a different table, so it is the whole
slice.

⚠ **And it makes an honest admission due.** I justified `notifications.event_id` (#5857, merged) by
the "From your suppliers" feed — and then removed that feed from the design. The column is not
wasted: Overview's activity tile needs it and event deletion can finally cascade. But **my page
probably does not use it**, and the record should not imply otherwise.

### 2 · The money split · blocks SLICE 3

Separate "paid to suppliers" from "Setnayan orders", and let the buffer refuse to compute while
anyone is unpriced.

**Recommendation: yes.** Today the page says "₱26,499 paid · 100% of what you have committed is
paid" beside "LOCKED ₱0" and "₱2,250,000 to spare", while both locked suppliers carry
`total_cost_php = NULL` and `deposit_paid_php = NULL` and the ₱26,499 is platform order money.

**Cost of getting it wrong:** it governs a figure the couple reads as money. If he wants one
combined "paid", `teamMoney` and `bufferTile` have a different shape and the section is built
differently — so it cannot be retrofitted as copy.

### The three that can ship on my recommendation

- **Slice 0 first, alone.** Sequencing, and the controller has already directed it. Cost of being
  wrong: near zero.
- **Does the roster really go?** He instructed it verbatim — *"just move them to their cards"* — so
  it is answered, not open. Cheapest reversal in the plan: one section, restorable in an hour.
- **The Messages nav row.** **Not in this plan at all.** It would reverse his 2026-07-10 ruling, and
  it belongs to the chatbox session's slice, not mine. It should not occupy a line on his desk from me.

---

## What the approved prototype still cannot prove

- **That comparison is useful.** The marketplace holds **one published vendor with two service
  cards**; every priced venue in the drawing is `is_demo = true` and **zero** non-demo directory rows
  carry a price. Find-and-compare is the right build with almost nothing to work on.
- **Touch and scroll**, on the real 3,643-line bench, on his phone.
- **The failure state** — drawn, never seen refuse.
- **Fit badges** — they need distance, allotment and calendar reads only the server has.
