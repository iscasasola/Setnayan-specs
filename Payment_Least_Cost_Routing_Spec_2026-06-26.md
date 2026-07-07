# Payment Least-Cost Routing (LCR) — Spec

> Drafted 2026-06-26. Status: **DEFINITION ONLY — not built.** Slots into the V1.5 payments-automation work (iteration 0034 → automated reconciliation), alongside the chosen processor (HitPay or PayMongo — see the 2026-06-26 decision-log rows). Owner picked **Option A (recommend the cheapest method; absorb fees into margin; do NOT surcharge).**

## 1. Purpose

For any given bill, the cheapest payment method differs by amount because rails mix percentage and flat fees. Showing the customer a method that quietly costs us ₱20 on a ₱150 order (QR Ph floor) when GCash would cost ₱3.45 is pure margin leak. LCR computes the real cost of every eligible method per order and **steers the customer to the cheapest one**, while absorbing the fee into margin (our digital SKUs run ~90%+ margin and the tax-aware price floor already includes processor cost).

This is **deterministic arithmetic, not "Setnayan AI"** — a pure function over an admin-managed fee table.

## 2. The engine

`cheapestMethod(amountCentavos, feeTable) → { method, feeCentavos, ranked[] }`

- For each eligible method, compute `fee = max(amount × pct, flatFloor) + flatAdd` per that method's schedule.
- Rank ascending by fee. Return the full ranked list (UI decides how much to show) + the winner.
- Pure, side-effect-free, identical on web + in-app. One implementation, imported by both.

**Crossover is emergent, never hardcoded.** Example with current HitPay rates (GCash 2.3%; QR Ph `max(1%, ₱20)`; card `3% + ₱15`): GCash wins below ~₱870, QR Ph wins above it, cards almost always lose on fee. If rates change in admin, the crossover moves automatically.

## 3. Fee table — admin-managed (per the "prices are admin-managed" rule)

The schedule is **config, not code** — when HitPay/PayMongo reprice, no deploy is needed.

```
payment_method_fees(
  id, processor,                 -- 'hitpay' | 'paymongo'
  method,                        -- 'gcash' | 'maya' | 'qrph' | 'card' | 'instapay' | ...
  pct_bps,                       -- e.g. 230 = 2.3%
  flat_floor_centavos,           -- e.g. 2000 = ₱20 floor (QR Ph)
  flat_add_centavos,             -- e.g. 1500 = ₱15 fixed add (cards)
  foreign_card_surcharge_bps,    -- e.g. 100 = +1% (PayMongo foreign cards)
  enabled, min_amount, max_amount,
  updated_by, updated_at
)
```

Seed both processors' published rates; the engine reads only `enabled` rows for the active processor.

## 4. Surfaces (admin + customer + vendor + the connections)

**Admin (iteration 0023 / 0034):**
- CRUD on `payment_method_fees` (amounts admin-set; method list predefined).
- A "cost preview" tool: enter an amount → see the ranked methods + our absorbed fee. Lets ops sanity-check a rate change before saving.
- A toggle per method for the **suppression threshold** (e.g. hide QR Ph below ₱870) so punitive-floor methods don't even render on small bills.

**Customer (checkout — web + in-app):**
- At checkout, all eligible methods render, with the cheapest marked **"Recommended."** Methods below their suppression threshold are hidden.
- **No price changes between methods** — same total regardless of tap (Option A: absorb, don't surcharge). The recommendation is a nudge, not a fee.
- Same component/logic on the Capacitor shell; subject to the app-store digital-goods rule (digital SKUs stay web-purchase, real-world/vendor bookings can pay in-app).

**Vendor (iteration 0022):**
- **LCR does NOT apply to vendor bookings.** Vendor↔customer money settles **off-platform** (direct GCash / bank / cash) at **0% fee · 0% commission** — Setnayan is never in the money path, so there is no rail for LCR to optimize. (The old assumption that vendor bookings carried a uniform Setnayan Pay 3% convenience fee was RETIRED to 0% at the 2026-06-07 reset.) LCR therefore governs **only first-party Setnayan SKU checkout** (the couple section above).

**Connections:** one shared engine + one admin fee table feed both the couple checkout and the vendor-booking checkout; admin owns the rates; the BIR official-receipt (iteration 0026) records the actual method + our absorbed cost for reconciliation.

## 5. Constraints / guardrails

- **Do NOT surcharge.** Card-network rules and e-wallet merchant terms broadly prohibit passing the processor fee (flat or %) to the customer. LCR only *steers*; it never adds a per-method fee. (The only sanctioned customer-facing fee remains the uniform Setnayan Pay 3%.)
- **Fee table is admin config**, never hardcoded — stale hardcoded rates are a known anti-pattern to avoid.
- **Deterministic, not AI** — keep it out of the "Setnayan AI" paywall framing.
- **Suppression is a UX kindness, not a lock** — never hide the *only* available method; always leave at least one payable rail.

## 6. Open items (owner / V1.5)

1. Confirm QR Ph fee structure with the chosen processor (`max(1%, ₱20)` floor vs `min(1%, ₱20)` cap changes the crossover materially).
2. Final processor pick (HitPay vs PayMongo) — gates which rates seed the table.
3. Whether to expose the "you're saving us X by paying via QR Ph" framing to customers as a soft incentive (out of scope for v1 of LCR; flagged for UX review).
