# Budget build status — 2026-10-08 (builder B · Opus)

Contract: `BUDGET_PAGE_2026-10-08_fable.md` · prototype `prototypes/budget_page_2026-10-08_fable.html` · rows **B0, B1, B2** only (B3–B5 are not this builder's).
Worktree `~/Documents/Claude/Projects/wt-budget` · base `origin/main` 9b2065225 · every PR is DRAFT + `do-not-auto-merge`, auto-merge OFF.
Updated after every item. A handoff is not evidence: re-measure with the commands given.

| Row | Branch | PR | Head | State |
|---|---|---|---|---|
| B0 honest read | `rd/budget-read-is-honest` | #6439 | 2de606a2a | PUSHED — tsc clean, lint 0 errors, 13/13 guard, 6 sabotages red |
| B1 summary rows | `rd/budget-summary-rows` (on B0) | #6441 | 8a6ccf270 | PUSHED — tsc clean, lint 0 errors, guards rewritten, 12 sabotages red, side-by-sides in `prototypes/budget-built-2026-10-08/B1-*` |
| B2 one list | `rd/budget-one-list` (on B1) | — | — | in progress |

## B0 — done
- `EventMoney.reads: MoneyReadStatus` (`suppliers | orders | costs` → `ok | failed`) set inside `resolveEventMoney`; `rowsOrRefused()` replaces every `res.data ?? []`.
- `knownMoneyTotals()` (agreed/paid `null` when partial, owed = floor) · `resolveEventMoneySettled()` (never rejects).
- `budget/page.tsx` no longer `.catch(() => null)`; a partial ledger is treated as an absent one was. No pixel change.
- Guard `apps/web/lib/budget-read-is-honest.test.ts` (13). Server actions 1199 → 1199.
- Not covered: `buildVendorPricingLookup` swallows its own refusals; the target read is logged, not a key.

## Rule 0 findings (what already existed on main, 9b2065225)
- `components/action-button.tsx` (ActionButton) and `components/count.tsx` (Count · Fill) ARE on main — the contract said they arrive with Suppliers.
- `app/_components/info-tip.tsx` (`InfoTip`) IS the ⓘ — the contract said none exists. No new `InfoHint` is needed.
- `app/_components/sheet.tsx` (`Sheet`) and `website/editor/_components/pick-menu.tsx` (`PickMenu`) are the sheet and the dropdown.
- `resolveEventMoneyMeasured()` named in DECISION_LOG 2026-09-02 is NOT on main (grep empty) — B0 is new, not a rebuild.

## B1 — done
- `budget/_components/budget-summary.tsx` + `budget-page.module.css`; `lib/budget-page-view.ts` (`pickNextPayment`, `budgetMeter`).
- Deleted: `budget-setter.tsx`, `budget-live-summary.tsx`, `budget-summary-ids.ts`, `getBudgetLiveSummary` (server actions 1199 → 1198), every `font-mono` under `budget/`, "wedding" in the page copy.
- Guards rewritten: `money-wears-the-ledger-face.test.ts` (app font + tabular-nums), `the-skeleton-matches-the-page.test.ts`. Registries updated: `budget-one-core`, `flag-chokepoint-scan`.
- `/dev/budget-lab` (404 in production) — the lab the side-by-sides are taken from.
- Open, by design: masthead + its three export links stay until B4; refused read draws "—" until B3; the kill-switch (`NEXT_PUBLIC_BUDGET_TRUTH_ENABLED` off) still falls back to legacy figures.

## B2 — built, verifying (not yet pushed)
- `lib/budget-page-view.ts` `buildBudgetList()` — three groups from `EventMoney.lines`; a refused group is `null`, never `[]`.
- `budget/_components/budget-screen.tsx` (summary + list + ＋ Add expense) · `budget-sheets.tsx` (four sheets, dynamic import).
- Edit-an-expense rides `recordEventCost` on `cost_id` — server actions stay 1198 (+0 for B2).
- Bought-on-Setnayan date = `orders.created_at` (Manila day) → `MoneyLine.bookedOn`.
- Deleted: `budget-ledger-table.tsx`, `costs-with-no-supplier.tsx`, `the-plan-meets-the-ledger.test.ts`; planner + share toggle + itemization card unmounted.

## Needs another stream (found while building B2)
1. **Suppliers › `vendors/_components/plan-budget-accordion.tsx`** has "Suggested for … · Adjust" → `?part=budget#budget-allocate`. B2 removes that section (owner: "not this one"). The Suppliers stream must re-point or drop the link. Re-measure: `grep -n "budget-allocate" apps/web/app/dashboard/[eventId]/vendors/_components/plan-budget-accordion.tsx`.
2. **Share-my-budget toggle** (`share-budget-band-toggle.tsx`, action `setShareBudgetBand`) has no door between B2 and B4's ⋯ menu.
3. **Tour `customer_budget_v1`** still describes the estimates split until B5.
4. **Payment-plan instalments** (`event_vendor_payment_plan.instances_json`) are not `EventMoney` lines — a supplier on Setnayan shows "owed" with no date on the Budget list; its dates live under Amount to pay. Feeding them into the resolver changes every money surface: its own PR.
5. **Two exported server actions have no caller after B2**: `saveAllocationSnapshot` (the unmounted planner) and — until B4 — `setShareBudgetBand`. Deleting the planner file + its action would free one route.
6. `buildVendorPricingLookup` (`lib/budget.ts`) still swallows its own refused selects (B0 note).
