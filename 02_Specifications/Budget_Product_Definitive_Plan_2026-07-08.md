# Budget Planner + Budget Health — Definitive Product Plan

**Authored:** 2026-07-08 (owner: "best research and a definitive plan… on the budget planner and budget health")
**Axis:** product DEPTH (what the planner + health experience should BE). The same-day [`Budget_Genericization_Design_2026-07-08.md`](Budget_Genericization_Design_2026-07-08.md) covers the orthogonal axis (event-type BREADTH). Cross-sequencing in § 5.
**Grounded in:** (1) feature research — Zola's budget-tool design case study · Aisle Planner · Planning Pod · HoneyBook · Honeydue · Monarch/YNAB/PocketGuard · The Knot's budgeter *retirement* post-mortem · r/weddingplanning spreadsheet canon; (2) a file-precise inventory of our shipped budget surface on `origin/main`.

---

## 0. TL;DR — we own the hard part; we're missing the parts whose absence kills budget tools

**The Knot literally retired its budgeter (July 2025)** because it was estimate-only — couples defect to spreadsheets at month 4 when real quotes, deposits, and balances arrive. **We already have what they lacked:** a real per-vendor ledger (`event_vendor_line_items` + `event_vendor_payments`) with logged payments, R2 proof screenshots, due dates, an `.ics` export, and a realtime summary. That's the moat.

But we have, verified in code, **exactly the four abandonment gaps** the research identifies:
1. **No payment-due reminders** — due dates are display-only (no `payment_due` notification type exists; no cron; `.ics` is opt-in pull). Research: reminders were Zola's #1 most-requested "dream feature"; *a ledger without due-date pushes is a prettier spreadsheet*.
2. **Three competing "budget" numbers on three surfaces** — the strip (stated target vs committed), the live card (itemized total vs paid — a *different* total), and the checklist health card (benchmark projection). No unified planned → agreed → paid model.
3. **Planner ↔ ledger fully disconnected** — the planner's "variance" compares the couple's *slider value* to the benchmark, never to what they actually committed/paid. No "you planned ₱90k for photography, you agreed ₱120k" anywhere.
4. **No income/contributions side** — PH weddings are co-funded (families + sponsors + cash gifts), our own checklist ships `who_pays` and `cash_envelopes` tasks that deep-link to /budget… where no such feature exists.

The plan: four phases — **Unify the numbers → Cash-flow + reminders → Close the planner↔ledger loop → Contributions** — each independently shippable, wedding-first, and consistent with the genericization schema so nothing is rebuilt later.

## 1. Verified current state (inventory digest)

| Feature | Status | Evidence |
|---|---|---|
| Per-vendor ledger: add line (label+amount+due), log payment (amount/date/method/ref/notes), R2 proof, delete | ✅ | `vendor-itemization-card.tsx` · `budget/actions.ts:184,393,448` |
| 50/50 Deposit+Balance seeder (off-platform vendors) | ✅ | `actions.ts:245` |
| Due dates + "Next payments" list (overdue-first) + `.ics` export | ✅ | `lib/budget.ts:149-189,721-779` · `api/budget/[eventId]/ics` |
| Realtime live summary (payments/line-items subscription) | ✅ | `budget-live-summary.tsx:48-92` |
| Payment-due reminder/notification | ❌ | no `payment_due` in `NotificationType` (`lib/notifications.ts:143-146`); only cron = anniversary digest |
| Unified planned/agreed/paid | ❌ | strip (`page.tsx:393-449`) vs live card (`lib/budget.ts:677` — itemized total ≠ stated target) vs checklist projection |
| Planner ↔ actual variance | ❌ | planner `actualPhp` = slider value (`budget-allocation-planner.tsx:143-158`); never reads payments/contracted cost |
| Setnayan order spend in the ledger | ⚠ | summed into the Committed stat only (`page.tsx:161-177`); invisible in itemized/paid views |
| Income / contributions / who-pays | ❌ | expense-only; `who_pays` + `cash_envelopes` are orphan checklist links (`lib/checklist.ts:121,208`) |
| Line-item edit-in-place · CSV/PDF export | ❌ | delete+re-add only; `.ics` is the only export |
| Vendor-facing budget-band share (rounded range, opt-in) | ✅ | `setShareBudgetBand` (`actions.ts:126-159`) |
| Payment lifecycle notifications (logged/confirmed/cleared) | ✅ | `payment_logged` emitted at `actions.ts:503-511` |

Also verified: line items are **free-text labels**, not the 0007 Package/Crew-Meal/Transportation triad (those survive only as `event_vendors` columns feeding the checklist projection); `BudgetSummaryStrip` and the checklist health card are per-render (not live).

## 2. Research rules we adopt (feature depth)

1. **Three-number data model, two-number display.** Every ledger line: *estimated → agreed (contracted) → paid-to-date* (balance derived). Zola user-tested the summary down to two figures (total cost + still owed) — keep depth on tap, not on every row. (Cvent negotiated/expected/actual · Planning Pod · every beloved spreadsheet.)
2. **Auto-computed balance.** Enter the deposit, the system breaks out the remainder as the next payment (Aisle Planner's "edit payment #1 → payment #2 computes"). We half-have this (50/50 seeder) — generalize it.
3. **Cash-flow calendar is the most-wanted, least-built feature in the category.** "What leaves my account this month / next 60 days" as a first-class view; ≤30-day payments pinned on the dashboard. The booking→final-payment "dead zone" is where couples get ambushed (Zola research).
4. **Reminder set: 7-days-before + day-of + 2-days-overdue, default-ON per payment (toggleable), sent to BOTH partners, each with a one-tap action** (HoneyBook × Honeydue). Never a bare alert: YNAB's lesson — an over-allocation prompts a *decision* ("cover from: cushion / category"), not a notification.
5. **Booking writes the ledger.** A confirmed vendor's contracted cost auto-creates/updates its ledger line + schedule — budget and vendors must never be double entry (the #1 spreadsheet-defection driver after reminders).
6. **Actuals reconciliation: never silently rebalance.** Agreed-under-estimate → variance stays visible ("₱8k under on flowers") and the surplus flows to the **cushion** with an *offered* "reallocate?" — never auto-redistribute (destroys pins + trust). Agreed-over → cover-from picker.
7. **Projection-first health:** "if everything lands as agreed/estimated, you finish at ₱X vs your ₱Y" + per-category over/under flags + the existing best/worst buffer. (PocketGuard "Leftover" / Monarch forecast — structurally our formula already.)
8. **Contributions: pledged ≠ received.** Family/sponsor money enters as income rows with a pledge→received state; funds-source assignable per category with line override; cash gifts offset. Per-item privacy + in-context comments (Honeydue) are cheap and high-value for co-funded PH weddings — V2.
9. **Avoid:** estimate-only budgeting (The Knot's fate) · silent rebalancing · alerts without actions / recurring check-in nudges · budget-vs-vendor double entry · locked schemas · treating pledges as cash in the buffer.

## 3. The plan — four phases, each shippable alone

### P1 · One truth (unify the numbers) — refactor + small features
- **Introduce the three-number line model.** Ledger lines gain `estimated_php` (nullable) alongside amount(=agreed) + paid (derived from payments). The vendor's contracted `total_cost_php` becomes the *agreed* anchor for its ledger; benchmark/allocation values are *estimated*.
- **One header, two numbers:** "Total cost ₱X · Still owed ₱Y" replacing the strip/live-card split; the stated target + buffer become the *health* line under it. Setnayan **paid orders enter the ledger as read-only rows** (they're real spend; today they're invisible below the Committed stat).
- Line-item **edit-in-place**; **CSV export** (cheap, spreadsheet-refugees' safety blanket).
- Make the summary strip read from the same computation as the live card (one source function).
- *Files:* `lib/budget.ts` (unified summary math), `budget/page.tsx` (strip/card merge), `vendor-itemization-card.tsx` (edit + estimated field), new export route. Migration: `estimated_php` on line items.

### P2 · Cash flow + payment reminders — the killer gap
- **`payment_due` + `payment_overdue` NotificationTypes** + email/push allowlist entries; emitted **cron-free** via Resend `scheduledAt` stamped when a due-dated line lands, re-stamped on edit (the exact pattern already specced in [`Setnayan_AI_Realtime_Notifications_2026-07-02.md`](../Setnayan_AI_Realtime_Notifications_2026-07-02.md) PR-3 / GRD-01).
- **Design decision (owner default): basic due-date reminders are FREE transactional** — they concern the couple's own logged obligations (reactive = free floor). The AI watch-guard layer adds the *smart* money coaching (negotiation room, trim suggestions) — paid. This ships GRD-01's trigger as free plumbing the AI later enriches.
- Reminder set per research: 7-day + day-of + 2-day-overdue, default-ON per line (toggle), to both couple members; each deep-links to the vendor's ledger card with the log-payment form open.
- **Cash-flow view:** extend the "Next payments" list into a month-bucketed "Due this month / next 60 days" section on the budget page; surface ≤30-day dues on the event home (the countdown header already exists there).
- *Files:* `lib/notifications.ts`, `notification-emit.ts` allowlists, `budget/actions.ts` (stamp/re-stamp on line write), new cash-flow section in `budget-live-summary.tsx` or sibling, home card. No cron.

### P3 · Close the planner ↔ ledger loop
- When a vendor is **confirmed**, its plan-group's allocation line flips to *agreed* (real ₱), variance vs the planner target shown ("₱30k over your photography plan").
- **Surplus → cushion, offered reallocation** ("₱8k freed from flowers — add to cushion or boost a pinned category?"). **Over-agreed → cover-from picker** (cushion / unpinned categories) — the YNAB forcing function, and precisely the checklist §15 over-budget prompt design (Basic tier = manual options; the AI tier's "help me stay within budget" plugs in here later).
- Checklist health card + budget page health line become the same computation (and go live via the existing realtime subscription).
- *Files:* `budget-allocation-planner.tsx` (consume real agreed ₱), `lib/checklist-budget.ts` ↔ `lib/budget.ts` unification, prompt components. Depends on P1's model.

### P4 · Contributions (the PH differentiator; no major tool does it)
- New `event_budget_contributions` table: contributor label ("Groom's family", "Ninong Ramon"), pledged ₱, received ₱ (state), optional funds-source assignment per category with line-level override; cash-gift rows.
- Buffer math counts **received** only; pledged shows as "expected" (pledged ≠ received — the classic buffer-killer).
- `who_pays` and `cash_envelopes` checklist tasks finally land on a real feature.
- V2 within P4: per-item privacy (yours/mine/ours) + in-context payment comments (Honeydue); change-log on allocation edits (multi-funder trust).

## 4. Owner decision points
1. **Free vs paid line for money notifications** — plan assumes basic due-date reminders FREE (transactional, own-data), AI watch-guard = the paid smart layer on top. Confirm (it interacts with the Setnayan AI value story).
2. **P1's header simplification** replaces the current strip/live-card pair — sign off on the two-number header + health line direction (it changes the budget page's face).
3. **Contributions visibility** (P4): couple-only at launch, or contributor-scoped views later (a parent sees the lines they fund)? Recommend couple-only V1.
4. Phase order confirmation — P2 (reminders) could ship before P1 if speed matters; P3 depends on P1.

## 5. Sequencing vs the genericization plan (the other axis)
- **P1 (one truth) should land before or with genericization B3** — B3's tracker-only degradation mode is trivial once one summary computation exists.
- **P2 is independent** of event type entirely (due dates are due dates) — can ship any time.
- **P3 consumes the benchmarks** — for weddings now; picks up per-type rows automatically once B2–B4 land (planner client is row-driven).
- **P4 is type-agnostic** by construction (contributions exist for debuts and christenings too — ninong/ninang culture).
- PR-B1 (checklist health card wedding gate, #2894) already shipped and holds until B3.
