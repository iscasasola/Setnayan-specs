# Crew-Meal Line Discovery & Booking — Couple Side (2026-07-08)

> **Owner-defined 2026-07-08 (this session).** How a couple discovers and books a nearby crew-meal provider from inside the Budget & Expenses surface. Companion to `../0006_vendors_management/0006_Crew_Meal_Provider_Marketplace_2026-07-08.md` (the supply side + proximity match). This file is the **demand side + the booking flow**. It does **not** re-expand the archived `0007_budget_expenses.md` stub — it is a newer dated sibling.

---

> **⚠ SUPERSEDED IN PART — shipped-code reconciliation 2026-07-08 (see `../DECISION_LOG.md` same-day "Crew-Meal Marketplace — shipped-code reconciliation" row).** Phase-1's "one connection token at a low crew-meal rate" is superseded: the shipped gate has **no per-category rate** and **FREE-tier vendors can't accept**, so **crew-meal providers use the STANDARD vendor connect gate** (Verified+, region-band burn via `acceptInquiry`→`unlock_vendor_event`) — owner-locked Option 1. Also: the crew-count auto-aggregation this surface assumes is **greenfield** (built new; `crew_size` lives on `vendor_services`, the couple's crew-meal line is the hand-entered `event_vendors.food_allowance_php`).

## 1. Where it surfaces — 3 entry points, one primary

**Primary — the Crew Meal budget line.** This is the highest-intent moment: the couple is already looking at "~18 crew meals · ₱7,200" (the auto-aggregated estimate). A one-line nudge — *"Providers near your venue can supply these for less"* — expands into a **nearest-first list** of crew-meal providers whose service area covers the reception venue. Each result shows distance-from-venue, ₱/meal, and the concrete **peso savings vs. the current estimate**. The savings number is the pitch.

**Secondary — a "Crew Meals" filter in the Feast marketplace category** (0006). Couples browsing food vendors can filter to crew-meal-capable providers; cards already show `Xkm from reception`, so it's a tag + match filter, no new card UI.

**Tertiary — a Setnayan AI planning nudge.** Since the planner already aggregates crew count from booked vendors' `crew_size`, it can proactively surface: *"You'll have ~18 crew. 3 providers near [venue] can feed them for ~₱1,400 less."*

---

## 2. The source selector — anti-double-count guardrail

Many couples' **main caterer already includes crew meals**. To stop a nearby provider from double-counting meals the caterer already covers, the Crew Meal line gets a **source selector**:

| Source | Meaning |
|---|---|
| **Included in caterer's package** | Crew meals ride the main caterer; the line is informational (₱0 incremental) — no nearby-provider booking. |
| **Separate provider** | The couple is sourcing crew meals from a nearby crew-meal provider (this feature). Booking flow below applies. |
| **Manual** | The couple enters a manual estimate/number, today's default behavior — no provider attached. |

Choosing a nearby provider automatically sets the source to **Separate provider**.

---

## 3. Crew count — derived, and it firms up late

The meal count is **not** a number the couple invents — it's `Σ crew_size` across the couple's booked vendors (photo team, video team, HMUA, coordinator, lights/sound, band/DJ, etc.), which keeps changing as they lock more vendors. That's why the booking flow has to let them **reserve early on an estimate** and **confirm the real headcount late**. The live estimate pre-fills the reservation quantity.

---

## 4. The booking flow — Reserve → Confirm → Settle

Reuses the vendor-booking + budget-ledger + chat (0019) rails. It does **NOT** use the SKU/payment spine (0034) — there is no in-app checkout, no `service_orders` row, no reconciliation queue. Settlement is off-platform like every other vendor.

### Phase 1 · Reserve (early)
Couple taps a provider → its **₱/meal locks**, **quantity pre-fills from the live crew estimate**, the provider is added to the Crew Meal line and **notified**. The **provider accepts** — and **accepting is where the one connection token is spent** (the universal connect gate; low crew-meal rate — see `0006` sibling § 5). A chat thread opens (0019, same hybrid-anonymity masking: screen name until first reply) for menu/dietary/logistics. If the crew estimate is below the provider's `min_order_qty`, warn here.

### Phase 2 · Confirm (at the cutoff)
At **`event_date − provider.lead_time_days`**, the app nudges: *"Confirm your final crew count."* The couple locks the final N **and picks from the provider's menu** — one meal for everyone or a simple split ("12× adobo, 6× menudo"). That N + menu selection **becomes the order** the provider cooks. (Couples who already know their count can satisfy Confirm immediately — the two-phase collapses to one step for the simple case; it's not friction.)

### Phase 3 · Settle (after)
The couple **pays the provider directly** and logs proof of payment on the Crew Meal line — exactly like every other vendor's 3-line ledger. **Setnayan holds no money · 0% commission** on the food.

### Booking states
`Reserved → Confirmed → Fulfilled → Paid` — tracked on the Crew Meal line as a linked provider (unit price + qty + confirm-by date + menu pick + status). No payment primitive; it's a vendor booking, not an in-app SKU order.

---

## 5. What it deliberately does NOT do

- **No quotation step** — the provider lists a fixed ₱/meal, so it's pick-and-reserve, not negotiate.
- **No in-app checkout / `service_orders` / reconciliation** — settlement is off-platform.
- **No per-crew-member meal selection** — the couple/coordinator chooses for the crew (V2 at most).
- **No new money flow** — it rides existing vendor-booking + budget + chat rails.

---

## Cross-references

- `../0006_vendors_management/0006_Crew_Meal_Provider_Marketplace_2026-07-08.md` — provider offer object, micro-category, geocoded match, token gate detail.
- `0007_budget_expenses.md` — archived stub (original budget-ledger spec; recover full body via `git show 573a96c:0007_budget_expenses/0007_budget_expenses.md`).
- `../0019_communications/` — the chat threads the booking reuses.
- `DECISION_LOG.md` 2026-07-08 — the 5 locked decisions.
