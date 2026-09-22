# Your Team — build plan (2026-09-22)

**Status: PLAN ONLY. Nothing is built. Nothing may be built until the REDESIGN CONTROLLER
launches a slice, and the controller will not launch until the owner approves.**

Session: Event Your Team · route `/dashboard/[eventId]/vendors` · prototype
`prototypes/your_team_redesign_v2_2026-09-22.html`.

Measured against `origin/main` on 2026-09-22. ⚠ `shortlist-categories.tsx` is **3,643 lines** —
it was 2,125 when this redesign started. Re-measure every size and path below with
`git show origin/main:<path> | wc -l` before acting; main moves under this plan.

---

## What the owner has actually said

Approval matters more than the design here, so it is recorded first and verbatim.

**Instructions already carried out and shipped** (grandfathered PRs, both merged):
- *"fix the coordinator overdue number"* → #5860
- *"fix the misc category so self-added suppliers have a real home"* → #5871

**Design direction on the prototype — NOT approval to build the page:**
- *"create a prototype first"*
- *"finding service cards on the different categories seem lost now"*
- *"the most valuable part here is to find different service cards from different vendors, compare
  them, lock them, check if it fits the budget, and check all notifications related to actions from
  the different vendors"*
- *"of course we value all the locked vendors more. since that is what we already paid for. and
  that is what we also find here."*
- *"how about a counter badge instead on the category/ cards?"*
- *"yes. but overview will give me instructions on what to do and what you showed a while ago are
  instructions and tasks on what i need to respond to"*
- *"just move them to their cards and make a badge counter on the category/ cards"*
- *"now that this is already at the overview, fix the page"* (said of the prototype)

🔑 **He has never said the page may go to code.** Slices 1–4 below need that sentence. Slice 0 does
not — see why in its own section.

---

## The slices, in launch order

One commit per slice, named for the slice, never squashed — so a slice that turns out wrong after
merge can be reverted surgically.

### SLICE 0 · The uncapped strips — a DEFECT, launchable without design approval

**What is wrong.** `waiting-for-quotes.tsx` and `pending-lock-proposals.tsx` each render a bare
`items.map(...)` with **no cap and no "…and N more"** (confirm:
`git show origin/main:apps/web/app/dashboard/\[eventId\]/vendors/_components/waiting-for-quotes.tsx | grep -cE "slice\(0|…and"` → 0),
and `vendors/page.tsx` renders **both above `<ShortlistCategories>`**. `waitingForQuotes` is
`push`ed once per pending inquiry with no limit upstream either. At 100 pending inquiries,
production puts 100 rows between the top of the page and the bench.

**Why it needs no design approval:** the owner found this himself — *"if i have 100 vendors and i am
inquire to all… i will not be able to see the bench anymore"* — and the fix restores intended
behaviour rather than changing a design. It is also independent of every other slice.

**The rule it encodes:** a list that grows without bound may never sit between the top of the page
and something the reader needs. Page height must not depend on how busy the couple has been.

- **Pure module:** `lib/capped-rows.ts` — `capRows(items, ceiling) → { shown, hiddenCount }`.
  Total, ordered, no DOM.
- **Files:** `lib/capped-rows.ts` (new) · `_components/waiting-for-quotes.tsx` ·
  `_components/pending-lock-proposals.tsx` · `lib/capped-rows.test.ts` (new).
- **Proof:** the test EXECUTES `capRows` at 0 / 1 / ceiling / ceiling+1 / 100 items, and a source
  guard asserts neither component contains a bare `.map(` over its full input.
- **Sabotage to watch go red:** remove the cap from one component → the source guard fires; return
  `items` unchanged from `capRows` → the unit test fires.

### SLICE 1 · Badge counters — his explicit instruction

Per-card unread, rolled up to category and folder, from **one** stored source. Never a second
count: two stored counts disagree within a week and each passes its own test.

Depends on `notifications.event_id` (#5857, **merged**) — that column is what lets an unread count
be scoped to one wedding at all. Before it, scoping was a substring match on `related_url` that
found 21 of the latest 100 rows.

- **Pure module:** `lib/bench-unread.ts` — `cardUnread` / `tileUnread` / `folderUnread` derived
  from one `Map<cardId, count>`, with the roll-up invariant as a function.
- **Files:** `lib/bench-unread.ts` (new) · `_components/shortlist-categories.tsx` ·
  `vendors/page.tsx` (supply the map) · `lib/bench-unread.test.ts` (new).
- **Proof:** the test asserts folder total === Σ category totals === Σ card counts over a fixture
  with 100+ unread spread across folders, and that opening a thread clears exactly one card.
- **Sabotage:** store a second count at category level and let it drift → the invariant test fires.

### SLICE 2 · A supplier is their card — *"just move them to their cards"*

The roster in `build-locked.tsx` folds into the bench card, which then carries the full state:
price or "No price recorded", locked / mid-handshake / candidate, the next step, and the actions.

**Highest-risk slice.** It touches the 3,643-line bench and removes a section other things link to.

- **Files:** `_components/shortlist-categories.tsx` · `_components/build-locked.tsx` ·
  `_components/services-takeover.tsx` · `lib/your-team.ts` · tests.
- **Proof:** a test that EXECUTES `buildShortlistFolders` and asserts every row the roster used to
  render is present on a card — by supplier id, not by count.
- 🪤 **The trap this slice must not fall into:** a supplier whose category has no bench tile would
  have no card and simply vanish. That is why #5871 (the `misc` → "Everything else" home) landed
  first. Re-check it still holds before starting: two of the four suppliers on the owner's event are
  `category = 'misc'`.

### SLICE 3 · The money split — needs its own sentence of approval

The page currently reads **"₱26,499 paid · 100% of what you have committed is paid"** beside
**"LOCKED ₱0"** and **"₱2,250,000 to spare"**. Measured cause: both locked suppliers have
`total_cost_php = NULL` **and** `deposit_paid_php = NULL`, and the ₱26,499 is Setnayan **order**
money (₱24,000 of it order `SNYQAVP292`, "Papic — adds 100000 credits"), not a peso paid to any
supplier.

The change: show "Paid to suppliers" and "Setnayan orders" as separate figures, and make the buffer
**refuse to compute** while any locked or candidate row has no price, instead of calling the whole
budget "to spare".

⚠ **This one governs a number the couple reads as money, so it needs the owner's explicit yes** —
not inference from the prototype.

- **Files:** `_components/merkado-budget-lens.tsx` · `lib/your-team.ts` (`teamMoney`,
  `bufferTile`) · tests.
- **Proof:** `bufferTile` returns the refusal state whenever any input price is null; the test
  executes it with the real production shape (2 locked unpriced, 2 candidates unpriced, budget
  ₱2,250,000).
- **Sabotage:** make `teamMoney` treat a null price as 0 → the refusal test fires.

### SLICE 4 · Remove the two task surfaces — BLOCKED on Overview

"Decide next" and "From your suppliers" come off the page because Overview already owns them
(measured: `✦Decisions waiting on you · 9 open`, PRIORITY 1–4, and `Conversations · 1 unread`).

**Do not launch this before Overview settles what its counts are called.** Removing the door here
while Overview still says "23 categories still open" and this page said 27 leaves the couple with
one number and no way to tell which set it names. See the next section.

- **Files:** `_components/services-takeover.tsx` · `_components/build-locked.tsx` ·
  `vendors/page.tsx` · tests.

---

## The counts — corrected, and NOT a reconciliation job

I first reported 23-vs-27 as "two surfaces counting one fact". **That was wrong and is withdrawn.**
Measured on `origin/main`:

- **12 plan groups carry `countsTowardLockable: false`** (`grep -c "countsTowardLockable: false"`
  on `lib/wedding-plan-groups.ts` → 12) — the entry-point cards.
- **Overview excludes those AND scopes per event type**: `countUnlockedCategories(...)` over
  `planGroupsForEventType(eventType, planGroupScope)`, then
  `.filter((g) => g.countsTowardLockable !== false).length`. That is 25 and 23.
- **Your Team counts a different set**: `stillNeedsDecision()` in `lib/your-team.ts` takes groups
  that are ENGAGED (≥1 shortlisted vendor or ≥1 build pick) **or** inside their action window
  (`start_now` / `due_soon` / `overdue`), minus locked, minus `covered`. That is 27.

**Both are right. They answer different questions.** Forcing them to agree would break one of two
legitimate measures. The defect is that a couple is shown both wearing the same word — "open",
"to decide" — with nothing saying which set. **A naming fix, owned by Overview.**

The coordinator case was genuinely different and is why the distinction matters: 278 vs 113 was
**one** fact (the date of the coordinator's floor) computed two ways, one of which read an aim as a
floor. #5860 pointed both at `lockLeadDaysFor`. 🔑 **An aim read as a floor will be wrong elsewhere
too** — `upcoming-items.ts` also dates from `monthsBefore`, and there it is CORRECT because it is
forward-looking and drops passed deadlines, so it never says "overdue". Anything new that says
"overdue" or "late" must read the floor.

---

## Collision forecast for the controller

| slice | files | known overlap |
|---|---|---|
| 0 | `waiting-for-quotes.tsx`, `pending-lock-proposals.tsx`, `lib/capped-rows.ts` | none in flight today |
| 1 | `shortlist-categories.tsx`, `vendors/page.tsx`, `lib/bench-unread.ts` | overlaps slice 2 on both files — **sequence, do not parallelise** |
| 2 | `shortlist-categories.tsx`, `build-locked.tsx`, `services-takeover.tsx`, `lib/your-team.ts` | overlaps slices 1 and 4 |
| 3 | `merkado-budget-lens.tsx`, `lib/your-team.ts` | overlaps slice 2 on `your-team.ts` |
| 4 | `services-takeover.tsx`, `build-locked.tsx`, `vendors/page.tsx` | overlaps slice 2; blocked on Overview |

Outside this plan but on my expect-to-touch list, so worth knowing: a **Messages nav row** would
touch `lib/customer-menu.ts` and `lib/nav-registry-defaults.ts`. I also named those for a rail
label. If the chatbox session is launched on the nav row, sequence us.

---

## Explicitly NOT in this plan

- **The notification copy rewrite** (the five rules, the grouped "SEDA VERTIS NORTH → Ready for your
  deposit" wording). The notices moved to Overview, so the copy moved with them. The rules and the
  worked example are in `OVERVIEW-SESSION-PROMPT-2026-09-22.md`.
- **The chatbox access** — the "Event chatbox between users and vendors" slice. Measurement relayed
  to the controller: the inbox page and its door both exist; nobody should pay to rebuild them.

  🛑 **CORRECTED 2026-09-22, by the controller.** I first called the missing named nav row a "gap"
  and "a small, low-risk build". **It is not a gap, it is a dated ruling, and building it would
  reverse the owner.** `nav-registry-defaults.ts` (around the string
  `customer.sidebar.messages + customer.sidebar.contracts REMOVED 2026-07-10`) records that those
  slots were flattened by #3004 because they had zero consumers, and that "Messages stays reachable
  from the Conversations card + topbar bell". `customer-menu.ts` carries his own words from the same
  day: *"the menu doesn't need checklist/schedule/messages/contracts."*

  🔑 **An accurate absence plus an inferred cause is a false finding.** The row really is gone; it
  was taken out deliberately. My grep asked for the ROUTE string, and the removal had taken the
  route string with it — the evidence that a thing was removed does not contain the thing. Worse,
  the `customer-menu.ts` line WAS in my own grep output and I read past it. He may well want the row
  back, having just asked for this access, but that is a reversal for his desk, not a build.

  **What survives, and it is the better half:** the inbox lists THREADS, so a supplier the couple
  shortlisted but never messaged has no row — and he said "inquiries **and vendors**". That is a
  real build with no decision attached. Also live: below 1280px the thread page has no list column
  beside it (`ConversationColumn` is `xl`-only by the 2026-09-08 three-column decision, so changing
  it is a decision too, not a gap).
- **`PLAN_GROUPS.logistics.catalogFolder`** still reading `'transport'`, and **`security → escort`**.
  Both are owner calls left deliberately untouched by #5871.

---

## What is needed to launch

1. **From the owner, in words the controller can cite:** may the Your Team page go to code? And
   separately, yes/no on SLICE 3's money split.
2. **From the controller:** a launch for a specific slice, and a landing order if more than one.
3. Slice 0 needs only (2) — it is a defect fix the owner already identified.
