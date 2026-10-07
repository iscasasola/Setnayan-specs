# Budget page — one list, totals derived from it

**2026-10-08 · designer BU (Fable) · design + prototype only, no app code.**
✅ **Owner, 2026-10-08, on the prototype in the browser: *"budget looks good!"* — approved; recorded in DECISION_LOG the same day.**
Owner, verbatim: *"we need a properly arrange budget page"* · *"opening budget will show all your booked vendors, and expenses and they can add more manually"* · *"including purchased in setnayan"* · on the category-estimates list: *"not this one"* · *"on the suppliers budget, we will have a button to open budget eventhough it already have a budget on the screen (which is the summary and the next payment dues)"*.

Prototype: `prototypes/budget_page_2026-10-08_fable.html` (gallery of 6 phone frames; `?state=summary|list|add|owing|failed|suppliers`).
Screenshots (375 px): `prototypes/budget-page-2026-10-08/01…07-*.jpg`.

Code read from `origin/main` only (detached worktree), never from `~`. Readers: Sonnet ×3. Memory read: *a-budget-line-item-replaces-the-headline*, *a-payment-method-is-not-a-payment-plan*, *vendor-plan-prices-live-in-vendor-billing-catalog*. DECISION_LOG rows read: 2026-07-27 three-bucket model · 2026-09-02 BA2 "finalized money only" · 2026-09-03 BA3 ledger · 2026-09-20 (h) payment plan.

---

## Verdict

**Almost all of it exists. The page is wrong in ARRANGEMENT, not in data.** The three buckets the owner described are already one resolver (`lib/budget-truth.ts` · `resolveEventMoney`): booked suppliers (`event_vendors` + line items + `event_vendor_payments`), Setnayan purchases (`orders`, couple-payer only, already in a `setnayan_services` bucket), and hand-added expenses (`event_costs`, BA7 — a vendor-less table with `label · amount_php · paid_php · plan_group_id · due_date`). The build is: delete five blocks, re-arrange the summary as rows, render the resolver's `lines` as ONE grouped list, and add the one thing that is genuinely missing — an honest-read shape, because today a failed select becomes `[]` and paints ₱0.

---

## 1 · Today's blocks — keep / move / remove

Route: `vendors?part=budget` → `vendors/page.tsx` renders `PageMasthead "Suppliers"` + `PillarPartPicker` + `<BudgetPage>` (`app/dashboard/[eventId]/budget/page.tsx`). Blocks top-to-bottom today:

| # | Block today (component) | Fate |
|---|---|---|
| 1 | Masthead "Budget" with **Export upcoming dates (.ics)** · Budget (.csv) · Print | **Move**: .ics → Schedule; CSV/Print → the ⋯ menu. Two mastheads ("Suppliers" then "Budget") become one title row with ‹ back. |
| 2 | `BudgetSetter` — "What's your total **wedding** budget?" + paragraph + "Update my budget" button, `font-mono` | **Remove** as a block. Target becomes the first summary cell, editable in place, saves as you type (debounced `setEventBudget`). Explanation behind ⓘ. |
| 3 | `BudgetTopSummary` (`sn-tile`) — eyebrow "Your budget", 4 stats in `font-mono` with sub-lines ("Your stated budget", "Agreed minus paid"…) + `BudgetLiveSummaryCard` (progress %, "Next payments" h3 list, pinned bar) | **Keep the four numbers, re-arrange**: two-by-two rows, no box, 1-word labels, app font tabular numerals, one meter (paid / agreed / target) and ONE "Next" line. The pinned bar goes. |
| 4 | `MahrInfoCard` / `ChineseTraditionInfoCard` | **Keep**, as a quiet ⓘ beside Target for those event types; not a card. |
| 5 | "Suggested budget split" + `BudgetAllocationPlanner` (the category ESTIMATES: "rough estimate", "Range ₱x–₱y", "N% of budget") + `ShareBudgetBandToggle` | **Remove from this page** (owner: *"not this one"*). The readers stay — see §3. Share-bands toggle moves to the ⋯ menu or event settings. |
| 6 | `BudgetLedgerTable` — "Category by category": Planned · Agreed · Paid · Owed per category + `DueRollup` | **Remove from this page**. Category subtotals are a *filter* of the one list, not a second table. (Its guard `the-plan-meets-the-ledger.test.ts` must be retired with it, not weakened.) |
| 7 | `CostsWithNoSupplier` — "Costs you pay yourself" (writes `event_costs`) | **Keep as data; re-skin as "Your expenses"** group + ＋ Add expense sheet. Its "with supplier" branch (mints a manual `event_vendors` row) stays reachable from Suppliers › Add your own, not from here. |
| 8 | "Per-supplier itemization" + `VendorItemizationCard` list (collapsing supplier ledger, `logPayment` form) | **Keep the behaviour, re-skin**: each booked supplier is one row; tap → payments sheet (history + Record a payment). Same action (`logPayment`). |
| 9 | `MiniTour tourKey="customer_budget_v1"` | **Keep the mechanism, rewrite the slides** — today's three describe the estimates split that is leaving. |

Also removed: every `font-mono` on money (and the guard that enforces it — `money-wears-the-ledger-face.test.ts` pins the OPPOSITE of what the owner asked; it must be rewritten to assert the app font + `tabular-nums`, never deleted silently); the word "wedding" (use the event's own kind from the event row — the prototype's "Wedding" caption is that value, not a constant); boxed `sn-tile`s.

## 2 · The design, in plain English (375 first)

**Title row.** ‹ back · **Budget** · the event's kind in grey on the right.

**Summary, two by two, no box.** Target (dashed underline — tap, type, it saves; ⓘ holds "what you plan to spend in all") · Agreed (ⓘ: "everything booked, bought or added below, at the agreed price") · Paid (green) · Owed (wine). Under it one 6 px meter: green = paid, gold = agreed, track = target, red tail if agreed > target; a legend and "₱X left of target" / "₱X over target". Then one line: **Next ₱528,000 · Seda Vertis North · Oct 5 · Pay ›** — the earliest due instalment across the list.

**One list, three groups**, hairline rows, 40 px logo circle, name + one grey sub-line, amount right-aligned with a second line (owed in wine with its date, or "paid ✓" in green):

1. **Booked suppliers** — agreed · paid · owed per supplier. Tap → bottom sheet: every payment (Paid · date · how / Due · date), **Chat** and **Record a payment** (amount pre-filled with the next due, date, "How" dropdown: GCash · Bank transfer · Cash · Card). Recording moves Owed at once.
2. **Bought on Setnayan** — read-only paid lines: name · date · "receipt" · amount · paid ✓. An `awaiting_payment` order renders as owed; `submitted`/`draft`/`cancelled`/`refunded` do not appear (resolver rule, unchanged).
3. **Your expenses** — name · category (optional) · paid so far · amount. Tap → sheet with Amount and Paid so far that save on blur, plus Remove. Empty copy: "Nothing added yet. Use ＋ Add expense for anything paid outside Setnayan."

**Frosted thumb row** (glass: the controls blur what is behind them, no bar background): **＋ Add expense** (brand fill, icon + word) · **All ▾** dropdown (All · Owing · Paid — a dropdown, never pills) · search icon. Filter applies to all three groups; an emptied group says why ("Everything bought here is paid.").

**Add expense sheet**: Name · Amount · Paid so far (ⓘ) · Category (optional, dropdown). One **＋ Add** — creation is the only button; editing afterwards has no Save.

**Honest reads.** Each of the three groups is its own read. A failed group renders a red dot + "Couldn't load your purchases." + **Retry** in its place; the summary shows **—** for Agreed and Paid, **₱994,400+** for Owed (at least this), and the legend line says "part of this couldn't load". Never ₱0, never an empty group that looks like a new event.

**First-visit tour** (`customer_budget_v1`, rewritten, 3 slides): "One list, one truth" · "Tap a supplier" · "Add anything else".

**Suppliers › Booked tab keeps a small Budget block** (owner add): **Paid · Owed** as two cells, the same meter, the same "Next" line, and an **Open budget ›** ActionButton (icon + word, wine outline). It renders from the **same `resolveEventMoney` result** the Budget page renders — one reader, one call per request; the two surfaces cannot disagree (this is the BUD-8 rule of 2026-08-14 restated for a new surface).

Rules honoured: minimal words · help behind ⓘ · dropdowns for choices · no boxes · icon + word buttons · "supplier" never "vendor" · event kind never "wedding" · no Save buttons · phone first · dark mode tokens.

## 3 · Data — what exists vs NEW

| Need | Exists on `origin/main` | NEW |
|---|---|---|
| Target | `events.estimated_budget_centavos` via `events_host`; writer `setEventBudget` (`budget/actions.ts`). A second writer in `dashboard/[eventId]/actions.ts` — fine, same column. | — |
| Booked suppliers: agreed / paid / owed | `resolveEventMoney` → `EventMoney.lines` + `byBucket`; agreed = `resolveAgreedTotal` (headline / breakdown / package / deltas); paid = `paidToVendorCentavos` (payment log beats `deposit_paid_php`); owed floored at 0 per supplier. Booked = `CONFIRMED_VENDOR_STATUSES` (`contracted` · `deposit_paid` · `delivered` · `complete`). | — |
| Next due | `event_vendor_payment_plan.instances_json` → `computePlanInstances`; `paymentDueState` (one clock, guarded by `the-ledger-reads-one-clock.test.ts`). | — |
| Record a payment | `logPayment` / `logScheduledPayment` (`budget/actions.ts`) → `event_vendor_payments`. | — |
| Bought on Setnayan | `orders` folded by the resolver into bucket `setnayan_services` as `readOnly` `setnayan_order` lines; couple-payer only (`isVendorPayerOrder` excludes `vendor_*` keys); paid = status `paid`/`fulfilled`. ⚠ `orders` has no `paid_at`; the date comes from the matched row in `payments` (`status='matched'`) or `orders.updated_at` — builder must pick one and say which. | — (a date read, not a column) |
| Your expenses | **`event_costs`** (migration `20271193967957_money_a_couple_spends_with_no_supplier.sql`): `label · amount_php · paid_php · plan_group_id · due_date · note`; RLS couple read/write; folded by the resolver as `source:'event_cost'`. Writers `recordEventCost` / `deleteEventCost` (`budget/cost-actions.ts`). | An **update** action (`updateEventCost`: amount, paid_php) — today there is record + delete only. Not schema. |
| Honest read | **None.** `resolveEventMoney` turns an errored select into `?? []`; `page.tsx` does `.catch(() => null)` and the strip falls back to legacy figures. A refused `orders` read paints "₱0" and an empty group. | **NEW: `EventMoney.reads: { suppliers: ok\|failed, orders: ok\|failed, costs: ok\|failed }`** (name: `MoneyReadStatus`), set per source inside `resolveEventMoney`, following `lib/guests.ts` (`isMissingRelationError` / `logQueryError`). The render switches on it. The measurement must reach the pixels. |
| ⓘ help | No `InfoHint` component exists; the only help is the MiniTour. | **NEW, small: `InfoHint`** (a 18 px circle, tap → popover; reuse `PickMenu`'s portal). |
| ActionButton | **Not on `origin/main`** (grep empty). It is the Suppliers stream's new primitive (last night's prototype) — build order below puts it first. | arrives with Suppliers PR |
| Fonts | No "Count" font exists. App = Hanken Grotesk (`--font-hanken`); numerals today = Space Mono (`font-mono`). | Money set in Hanken + `tabular-nums`; rewrite `money-wears-the-ledger-face.test.ts` |
| Estimates readers | `resolveAllocationInputs` / `computeBudgetAllocation` are ALSO read by `vendors/page.tsx` (budget-fit), `category-search.ts`, `explore/page.tsx`, the CSV export route, admin budget-planner, `checklist-budget.ts`, `budget-ledger.ts`. | Only the **component** `BudgetAllocationPlanner` leaves this page; the readers stay. Nothing else breaks. |

Not the couple's budget (do not read): `vendor_billing_catalog` (supplier plans), `platform_retail_catalog_v2` (SKU prices — the orders row already carries the charged amount).

## 4 · Recommendations (one word each)

1. **Rows.** — no tiles, no boxes, hairlines only.
2. **Hanken.** — money in the app font, tabular; retire the mono-ledger guard by rewriting it.
3. **Honest.** — `MoneyReadStatus` per source before any of the UI; it is the only new data.
4. **Derive.** — summary = sum(list); Suppliers' block reads the same object.
5. **Subtract.** — five blocks leave; nothing is added that the resolver does not already return.

## 5 · PR-sized build plan (Opus builds; each PR with a 375 side-by-side before merge)

| PR | Scope | Guard |
|---|---|---|
| **B0** | `MoneyReadStatus` on `EventMoney` (`lib/budget-truth.ts`): per-source ok/failed, no `?? []` on an errored select; `page.tsx` stops `.catch(() => null)`. No UI change yet. | `budget-read-is-honest.test.ts` (copy of `guests-read-is-honest` shape): a refused `orders` read must not yield `committed = 0`. |
| **B1** | Summary as rows: Target in place (debounced `setEventBudget`, ⓘ), Agreed · Paid · Owed two-by-two, meter, one Next line. Delete `BudgetSetter`, pinned bar, eyebrows, `font-mono`. Rewrite `money-wears-the-ledger-face.test.ts`; retire `the-skeleton-matches-the-page.test.ts`'s stale "three stats" docblock with the new `loading.tsx`. | numerals = `tabular-nums`, no `font-mono` in `budget/`; "wedding" absent. |
| **B2** | The one list from `EventMoney.lines`: three groups, row shape, supplier payments sheet (`logPayment`), Setnayan lines with date, expenses sheet (new `updateEventCost`, `deleteEventCost`). Delete `BudgetAllocationPlanner` mount, `ShareBudgetBandToggle` (→ ⋯ menu), `BudgetLedgerTable` + its guard, `VendorItemizationCard` mount, `CostsWithNoSupplier` block. | `the-supplier-ledger-collapses.test.ts` rewritten for the sheet; `the-ledger-reads-one-clock` kept. |
| **B3** | Frosted thumb row: ＋ Add expense (ActionButton) · All/Owing/Paid `PickMenu` · search. Failed-group render ("Couldn't load … Retry") wired to `MoneyReadStatus`; summary "—" / "+" states. | filter is a `PickMenu`, never a pill row; failed state renders text, not ₱0. |
| **B4** | Suppliers › Booked: small Budget block (Paid · Owed · meter · Next) + **Open budget ›**, reading the SAME `resolveEventMoney` result as the page (pass it down; no second call). Move .ics to Schedule; CSV/Print to ⋯. | one `resolveEventMoney` call per request on `vendors?part=…`; the two numbers are the same object. |
| **B5** | Tour `customer_budget_v1` slides rewritten; ⓘ `InfoHint`; Mahr/Chinese notes become ⓘ. Copy sweep: "supplier", event kind. | `every-feature-gets-a-first-visit-tour`. |

Depends on: the Suppliers stream's `ActionButton` (B3/B4 use it; B0–B2 do not).

Open owner calls (not re-asked, just listed): none new. The 2026-09-02 "finalized money only" rule holds — un-booked suppliers never enter this list.
