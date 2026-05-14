# 0018 — Supplies Marketplace

**Status:** drafted 2026-05-11
**Iteration:** 0018
**Surface:** Cross-platform marketplace for physical goods + rentals + print fulfillment
**Dependencies:** 0000 App Shell, 0003 Billing Rail, 0006 Vendors Management, 0017 Patiktok, 0005 LED Background, 0008 Seating Chart, 0009 Photo Delivery, all keepsake SKUs
**Author:** Ice

---

## What this is

Supplies Marketplace is the physical-side complement to Setnayan's software features. It connects couples (and the coordinators they hire) to vendors who provide:

- **Print fulfillment** — backgrounds, signage, place cards, QR cards, banners, save-the-date physical mailers, photo books
- **Equipment rentals** — HDMI dongles, monitors, projectors, tripods, ring lights, backdrops, props, lighting kits, AV gear
- **Specialty items** — NFC pieces, QR-engraved arras coins, NFC pendants, NFC table cards, custom-designed QR cards
- **Standard wedding goods** — anything coordinators normally source externally that Setnayan wants to bring under one billing system

The marketplace is the bridge between "Setnayan provides the soft copy (digital design)" and "physical product exists at the venue."

## Why this iteration exists

Setnayan's existing model is "apparatus pricing rule" — Setnayan charges for the software tool, couple/coordinator brings the hardware. That works, but it leaves the couple/coordinator to source 10+ vendors separately. Supplies Marketplace consolidates this into:

- **One billing surface** — couple/coordinator pays Setnayan, Setnayan distributes to vendors
- **One vetted vendor pool** — Setnayan only lists verified, reliable suppliers (Verified Badge from 0006 carries over)
- **One inventory dashboard** — coordinator sees what's been ordered, what's shipped, what's pending
- **Commission revenue for Setnayan** — typical marketplace take rate of 10-15% on each transaction
- **Vendor demand engine** — Din vendors (Phase 3) get pre-qualified leads from couples who already bought Setnayan features

## Marketplace categories

| Category | Examples | Setnayan's take rate |
|---|---|---|
| **Print fulfillment** | Patiktok backgrounds, signage cards, place cards, photo books, banners | 10% |
| **Equipment rentals** | HDMI dongles, monitors, projectors, tripods, ring lights | 15% |
| **Backdrop + decor rentals** | Backdrops, props, lighting kits, table linens | 15% |
| **NFC + QR keepsakes** | NFC pendant, NFC table cards, NFC save-the-date, QR-engraved arras coins | 10% |
| **Specialty merch** | QR wristbands, custom-designed QR cards, premium material QR pieces | 10% |

## Vendor onboarding

Reuses iteration 0006 vendor onboarding model:

1. Vendor signs up to Setnayan (or invited via Din Phase 3)
2. Setnayan Team admin verifies legitimacy (Verified Badge)
3. Vendor adds inventory/services with prices
4. Vendor's listings appear in marketplace
5. Vendor receives orders, fulfills, gets paid (minus Setnayan commission)

Vendor pricing is set by the vendor; Setnayan's commission is a flat % on top, transparently shown to the buyer.

## Buyer workflows

### Coordinator workflow (primary use case)

1. Coordinator opens Setnayan app for one of their client events.
2. Coordinator sees the **Supplies tab** with relevant marketplace items for this event:
   - "You bought Patiktok — recommended supplies: HDMI dongle (₱899), monitor rental (₱2,500), background print (₱599)"
   - "You bought 30-day Papic — recommended supplies: tripod mount (₱599), extra cam batteries (₱1,200)"
   - "Standard recommendations: QR cards (₱1,999 for 100), place cards print (₱799)"
3. Coordinator adds items to cart, checks out via apply-then-pay flow (PayMongo / bank transfer / GCash).
4. Setnayan Team confirms payment → routes order to vendor(s).
5. Vendors fulfill — Setnayan tracks delivery status.
6. Coordinator dashboard shows pending / shipped / delivered for each item.

### Couple workflow (DIY couples without a coordinator)

Same as coordinator workflow, just from the couple's account. Setnayan Premium subscription unlocks more supply recommendations (e.g., AI-suggested supplies based on event mood board).

### Vendor workflow (selling)

- Vendor sees incoming orders in their Vendor Dashboard (Din Phase 3)
- Marks order accepted → in production → shipped → delivered
- Gets paid via PayMongo after Setnayan deducts commission
- Reviews/ratings from couples + coordinators inform Verified Badge

## Pricing model — how Setnayan earns

| Revenue line | Mechanic |
|---|---|
| **Transaction commission** | 10-15% on every marketplace order (taken from the vendor's payout, transparent to buyer) |
| **Featured listings** | Vendors pay extra to appear in "Recommended for Patiktok" sections (Vendor Studio subscription perk) |
| **Print-on-demand markup** | If Setnayan runs its own print partner (e.g., for Patiktok backgrounds), Setnayan earns the print markup directly |
| **Bulk vendor pricing pass-through** | Setnayan negotiates volume discounts with key vendors; some discount passes to buyer, some retained as margin |
| **Verified Badge premium** | Vendors pay subscription (already covered in vendor tier pricing) for verified status |

This is purely additive revenue on top of existing Setnayan SKUs. Couples who buy Patiktok still pay ₱2,499 for the app; they ALSO spend on marketplace supplies. Setnayan earns commission on the supplies.

## Cost basis for Setnayan

- Marketplace infrastructure: ₱0 marginal per transaction (pure software margin)
- Customer support for marketplace orders: ~₱20-50 per order (call resolution, dispute handling)
- Setnayan Team manual order routing (until automated): ~₱10-30 per order (matching incoming payment to vendor)
- Commission revenue per ₱1,000 of marketplace transaction: ₱100-150

At 1,000 marketplace orders/month × avg ₱1,500 order × 12% commission = ₱180,000/month Setnayan revenue. Pure margin minus support cost.

## Integrations across iterations

| Iteration | Integration with marketplace |
|---|---|
| **0005 LED Background** | Setnayan provides soft copy; marketplace sources USB delivery to venue tech |
| **0006 Vendors Management** | Existing vendor records become marketplace sellers |
| **0008 Seating Chart** | Print pack (place cards + table signs) auto-routes to marketplace print fulfillment |
| **0009 Photo Delivery** | Photo book printing (digital/soft/hard cover) flows through marketplace print partners |
| **0017 Patiktok** | Background prints, HDMI dongles, monitors, tripods, backdrops — primary marketplace driver |
| **All physical SKUs** | NFC pendants, arras coins, QR cards — moved from "one-off SKUs" to marketplace fulfilled |

## Coordinator-specific features

Coordinators (paid wedding planners) are power users of the marketplace. New features specifically for coordinators:

- **Bulk ordering** — coordinator manages 5-15 weddings simultaneously, can batch orders across events
- **Margin markup** — coordinator can mark up vendor prices to their clients (Setnayan + coordinator both earn)
- **Saved supply templates** — coordinator builds a "standard Patiktok kit" or "standard Papic kit" template, applies to every client
- **Vendor preferences** — coordinator marks favorite vendors, gets priority recommendations
- **Single bill across clients** — coordinator pays Setnayan once per billing cycle (matches Planner Studio subscription mechanic)

## Anti-abuse + quality controls

| Risk | Mitigation |
|---|---|
| Bad-actor vendors selling low-quality goods | Verified Badge required; reviews from couples flag bad sellers; Setnayan Team can de-list |
| Vendor pricing gouging | Setnayan Team monitors price benchmarks; flags outliers; suggests typical price range to coordinators |
| Refund disputes | Setnayan Team mediates; if Setnayan finds vendor at fault, marketplace refund + vendor penalty |
| Inventory misrepresentation | Setnayan Team spot-checks listings; verified-vendor commitment includes accurate inventory |

## Future considerations

- **Setnayan-branded print partner** — Setnayan runs its own print-on-demand for high-volume SKUs (Patiktok backgrounds, QR cards, place cards). Higher margin than commission.
- **Vendor advertising** — vendors pay for featured placement beyond Vendor Studio subscription tier
- **International expansion** — when Setnayan expands beyond PH, marketplace adapts to local vendors per region
- **Reverse marketplace** — coordinators can post "I need X for an event in Cebu, May 2027" requests; vendors bid

## Open questions

- **Coordinator marketplace access**: requires Planner Studio subscription? Or open to anyone with a Setnayan account?
- **Commission rate**: flat 12.5% across all categories, or category-tiered (10% on prints, 15% on rentals)?
- **Print fulfillment**: Setnayan's own partner network OR vendor-by-vendor marketplace listings?
- **Patiktok background design**: bundled free with Patiktok ₱2,499 — but does the print fulfillment come from Setnayan print partner or a marketplace vendor?
- **Couple direct access**: should non-coordinator couples see the marketplace too, or only via Setnayan Premium?

## Companion docs

- `0018_supplies_marketplace.html` — mockup of marketplace browse, cart, checkout
- `0018_supplies_marketplace.docx` — stakeholder-readable version

---

*Drafted 2026-05-11. Builds on apparatus pricing rule by adding a commission-based revenue layer for the physical/fulfillment side. Pair with 0006 Vendors (vendor records become marketplace sellers) and Din Phase 3 (vendor dashboard for incoming orders).*
