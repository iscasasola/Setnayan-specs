# Papic — a supplier's own credits (owner rulings 2026-09-05)

> Corpus mirror of the build that landed the 2026-09-05 📸 rulings
> (`setnayan-platform` PR `claude/vendor-portfolio-papic-ledger`, fragment
> `changelog.d/vendor-portfolio-papic-ledger.md`). The DECISION_LOG row of the
> same date is the decision; this note is the mirror the 📸 row deferred to the
> build session. Verify against `origin/main`, not against this page.

## The rule, in the owner's words

*"vendors get 5% of the amount they paid for on booking fee. so if they paid
1000 pesos for the booking fee, they get 50 papic credits for that event. if they
import a user and get to sync with them for free. they pay 500 pesos for 25
papic credits. since they did not pay for booking fee, they only pay for the
photo importation fee for their portfolio."*

| Question | Owner's answer | How it is built |
|---|---|---|
| Cap: 1,000 or 2,000? | *"minimum of 1000"* → confirmed: *"yes. that is the maximum from booking fee."* | `floor(fee ÷ ₱20)`, never more than 1,000 per event. |
| When do credits land? | *"when we approve the payment"* | Written by the admin-approval activation hook, never at submission. |
| Coexist with, or replace, the 2026-08-26 ₱5/point allowance? | *"replace it."* | ₱5/point, the 50 floor and the 2,000 ceiling are retired. **A reversal of the 2026-08-26 row, recorded as one.** |
| Does the host-visible lane survive on the new credits? | *"base it all from the supplier's shots per event not from what the host gives them."* | One meter per (vendor, event), the supplier's own. The couple's pool (`papic_event_point_grants`) is a different ledger and cannot see it. |

No floor: a ₱0 fee earns 0. The crumbs still land (₱20 → 1 credit) and the
₱500 pack is the call-to-action beside any grant under a pack's worth.

> **⚠ SUPERSEDED 2026-09-06 — the pack grants 100 credits, not 25.** The price
> did not move; what ₱500 buys did. A couple pays ₱0.70/credit
> (`platform_retail_catalog_v2`) and our cost is ₱0.024/credit flat, so at 25 a
> supplier paid **₱20/credit — 29× the couple's price** — and ₱500 bought them
> three ten-second clips. At 100 they pay ₱5: still 7× a couple's rate, still a
> 99.5% margin, and worth buying. The 5% rebate, the 1,000 cap and
> `VENDOR_PAPIC_PHP_PER_CREDIT` are unchanged — the rebate and the purchase are
> deliberately no longer the same rate per credit.

## What exists after the build

- **Rate** — `apps/web/lib/vendor-papic-credits.ts` · `vendorPortfolioCreditsForFee`.
- **Ledger** — `vendor_papic_portfolio_credit_grants` (migration slug
  `vendor_papic_portfolio_credits_ledger_and_pack_sku`): per vendor × event,
  append-only, positive, `source ∈ {booking_fee, pack_order, admin, comp,
  migration}`, idempotent per (order, source). Vendor reads own; nobody writes
  from a session. Spend side = the supplier's captures (`vendor_papic_captures`),
  the meter the capture route already charges.
- **Price** — `vendor_billing_catalog.sku_code = 'vendor_papic_portfolio_pack'`,
  ₱500.00, `vendor_addon_per_event`, admin-managed. Read the table, never a doc.
- **Doors** — `apps/web/lib/sku-activation.ts`: inside the booking-fee approval
  hook (only a `status = 'paid'` charge earns; waived = ₱0 = nothing) and an
  exact hook for the pack SKU (100 since 2026-09-06; read the constant).
- **Allowance** — `allowancePointsFor(tier, creditsGranted)` = MAX(tier gift,
  ledger). Credits raise, never lower; an unread ledger grants nothing.
- **For the surface (G3)** — `fetchVendorPapicPortfolioCredits` returns
  `{ credits, spent, left, packSkuCode, packPricePhp, packCredits, offerPack }`.

## Answered by the owner, 2026-09-06 — nothing here is open

1. **Video stays at 800 credits.** It was priced against the retired ₱5/point
   rate — a ₱4,000 spend — and 5%-of-fee silently made it ₱16,000: four times
   harder, decided by nobody. Re-pricing the pack to ₱500/100 makes 800 credits
   ₱4,000 again, **exactly**. 🔑 **The threshold was never the wrong number; the
   credit under it got four times dearer.** Unchanged.
2. **The 50-point Lite gift stays.** *"No floor"* was said of the 5% formula,
   which the ledger honours exactly (₱0 → 0 rows). The older gift is a different
   thing: the on-the-day documentation floor that lets a supplier who paid no
   booking fee document the event at all, and the only reason the feature is
   discoverable to them. It costs ₱1.20 per vendor per event.
3. **The host-visible lane reading is confirmed** — one meter per
   (vendor, event), the supplier's own; the couple's pool is a separate ledger;
   host approval and per-photo guest consent untouched.
4. **The buy action, album and CTA shipped as G3** (PR #5267): a private
   portfolio album in its own third table, `vendor_papic_portfolio_photos`,
   distinct from `papic_photos` (the host gallery) and `vendor_papic_captures`
   (the on-the-day lane the host CAN see with consent). A db test proves the
   host's own session reads none of it — and the test was mutation-checked:
   opening its RLS read policy to TRUE turns it red.
