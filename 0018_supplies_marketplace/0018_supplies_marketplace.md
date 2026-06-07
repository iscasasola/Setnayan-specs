# 0018 — Setnayan Supplies (Curated Reseller)

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - **0018 is a DEFERRED MOCK, not a live reseller.** The shipped surface (`app/dashboard/[eventId]/add-ons/supplies-marketplace/`) renders a **mock catalog** (`_data/products.ts`); **checkout is intentionally NOT built** — the cart's old `/orders/new` link was neutralized into a disabled "Checkout opens soon" affordance (PR per `CONNECTION_MATRIX.md`).
> - **The supplier-vendor schema is orphaned (data-without-UI):** `supplier_vendor_skus`, `supplier_vendor_sku_pricing`, `supplies_orders`, `supplies_order_line_items` exist but no live flow writes them. The 50%-markup curated-reseller business model is not operational.
> - **No live BIR / OR-issuance chain.** The 0026 BIR tax surface this iteration depends on is itself **being retired (2026-06-07)**; the Setnayan-as-seller-of-record OR chain described here is unbuilt.
> - **Payment = apply-then-pay + manual admin approval** when it does ship; customer token wallet (0003) is RETIRED. Real money never moves on a click.
>
> When this body disagrees with the above, **the above wins.**

**Status:** drafted 2026-05-11 · **V1 promotion 2026-05-18** · **business-model pivot 2026-05-19** (marketplace-commission → Setnayan-sourced resale with 50% markup)
**Iteration:** 0018
**Surface:** Cross-platform curated-reseller surface for physical goods + rentals + print fulfillment. **Setnayan is the seller of record** — couples buy from Setnayan, never directly from supplier vendors.
**Dependencies:** 0000 App Shell, 0006 Vendors Management (supplier-vendor classification added 2026-05-19), 0026 BIR Tax Compliance (Setnayan OR-issuance chain), 0034 Payments & Cart (wholesale-payout flow added), 0017 Patiktok, 0005 LED Background, 0008 Seating Chart, 0009 Photo Delivery, all keepsake SKUs.
**Author:** Ice

---

## ⚠️ 2026-05-19 BUSINESS MODEL PIVOT — read this first

The original 2026-05-11 draft framed this iteration as a "Supplies Marketplace" with vendors setting their own retail prices and Setnayan taking a 10-15% commission off the top. **This is no longer the model.** Per owner decision 2026-05-19 (CLAUDE.md decision log):

- **Setnayan is the curated reseller**, not a marketplace operator.
- **Vendors give Setnayan wholesale prices per area.** Different areas of Metro Manila (and eventually nationwide) have different supplier vendors with different wholesale costs.
- **Setnayan marks up 50% on wholesale.** Retail price = wholesale × 1.5. This is roughly equivalent to a 33% take rate on retail.
- **Couples buy from Setnayan, not from vendors.** The supplier vendor identity may not be surfaced to the couple at all (or only post-order for support cases).
- **Setnayan owns the customer relationship**, support, returns, and disputes.
- **Vendors fulfill** the actual physical product (delivered direct or via Setnayan logistics depending on agreement).
- **Setnayan pays vendors at wholesale** after the order completes. Vendors do NOT receive retail-minus-commission.

This is a higher-margin model than the original commission framing, but requires owner-side ops work to build supplier-vendor relationships per area before launch.

---

## What this is

Setnayan Supplies is the physical-side complement to Setnayan's software features. It connects couples (and the coordinators they hire) to a curated set of supplier vendors who provide:

- **Print fulfillment** — backgrounds, signage, place cards, QR cards, banners, save-the-date physical mailers, photo books
- **Equipment rentals** — HDMI dongles, monitors, projectors, tripods, ring lights, backdrops, props, lighting kits, AV gear
- **Specialty items** — NFC pieces, QR-engraved arras coins, NFC pendants, NFC table cards, custom-designed QR cards
- **Standard wedding goods** — anything coordinators normally source externally that Setnayan wants to bring under one billing system

The surface is the bridge between "Setnayan provides the soft copy (digital design)" and "physical product exists at the venue." Couples + coordinators see Setnayan-branded products; Setnayan handles sourcing + pricing + fulfillment coordination behind the scenes.

## Why this iteration exists

Setnayan's existing model is "apparatus pricing rule" — Setnayan charges for the software tool, couple/coordinator brings the hardware. That works, but it leaves the couple/coordinator to source 10+ vendors separately. Setnayan Supplies consolidates this into:

- **One brand, one bill** — couple/coordinator pays Setnayan; Setnayan handles all supplier coordination behind the scenes
- **One vetted supply chain** — Setnayan negotiates directly with reliable suppliers per area; couples never have to vet a vendor themselves
- **One inventory dashboard** — coordinator sees what's been ordered, what's shipped, what's pending — all in Setnayan
- **Higher-margin revenue for Setnayan** — 50% markup on wholesale = ~33% of retail = substantially higher than marketplace commission
- **Better couple experience** — uniform service quality + uniform pricing + uniform support; no "marketplace vendor that's never replied to my message" failure mode

## Categories + indicative wholesale ranges + Setnayan retail markup

| Category | Examples | Indicative wholesale range (Metro Manila V1) | Setnayan retail (wholesale × 1.5) |
|---|---|---|---|
| **Print fulfillment** | Patiktok backgrounds · signage cards · place cards · photo books · banners | ₱200 – ₱2,500 per item | ₱300 – ₱3,750 |
| **Equipment rentals** | HDMI dongles · monitors · projectors · tripods · ring lights | ₱100 – ₱5,000 per day | ₱150 – ₱7,500 per day |
| **Backdrop + decor rentals** | Backdrops · props · lighting kits · table linens | ₱500 – ₱15,000 per event | ₱750 – ₱22,500 per event |
| **NFC + QR keepsakes** | NFC pendants · NFC table cards · arras coins · QR save-the-date | ₱150 – ₱2,000 per piece | ₱225 – ₱3,000 |
| **Specialty merch** | QR wristbands · custom-designed QR cards · premium QR pieces | ₱50 – ₱800 per piece | ₱75 – ₱1,200 |

Wholesale ranges are illustrative — actual wholesale prices are negotiated per supplier-vendor + per area + per SKU + per volume tier.

## Supplier vendor model

**Important:** supplier vendors are a DIFFERENT classification than the marketplace-vendor model in 0006 (where vendors are discoverable by couples and set their own retail prices). Supplier vendors:

- Sign a wholesale supply agreement with Setnayan per SKU category + per service area
- Provide wholesale price quotes per SKU
- Commit to fulfillment SLA (turn-around time, defect rate, replacement policy)
- Are NOT discoverable by couples directly
- Do NOT set their own retail prices (Setnayan does, at wholesale × 1.5)
- Are paid wholesale after order completes (not retail-minus-commission)

Supplier vendors can ALSO be marketplace vendors on 0006 if they want both relationships — but the supplies channel is separate.

**Onboarding flow for supplier vendors:**

1. Vendor expresses interest (via owner outreach OR via inbound from 0006 vendor pool)
2. Setnayan ops contacts vendor to scope SKUs + areas + wholesale pricing
3. Wholesale supply agreement signed (template stored at `01_Contracts/Setnayan_Supplier_Vendor_Agreement.md` — to be drafted)
4. Vendor's wholesale prices entered into `supplier_vendor_skus` schema
5. Vendor's SKUs appear in couple-facing Setnayan Supplies surface at retail = wholesale × 1.5
6. Vendor receives orders via 0022 vendor dashboard (supplier-vendor variant) OR via direct email/SMS notification
7. Vendor fulfills; Setnayan tracks delivery status
8. Vendor invoices Setnayan at wholesale at end of fulfillment; Setnayan pays out per agreed terms

## Buyer workflows

### Couple workflow (primary use case)

1. Couple opens Setnayan dashboard for their event.
2. Couple sees the **Supplies tab** (new add-ons surface) with relevant supplies for this event:
   - "You bought Patiktok — recommended supplies: HDMI dongle (₱150) · monitor rental (₱3,750/day) · background print (₱899)"
   - "You bought 30-day Papic — recommended supplies: tripod mount (₱900) · extra cam batteries (₱1,800)"
   - "Standard recommendations: QR cards (₱2,999 for 100) · place cards print (₱1,199)"
3. Couple adds items to cart, checks out via apply-then-pay flow (0034 cart + payments).
4. Setnayan Team confirms payment → routes order to supplier vendor(s) per area.
5. Supplier vendors fulfill — Setnayan tracks delivery status.
6. Couple dashboard shows pending / shipped / delivered for each item.

### Coordinator workflow

Same as couple workflow, just from the coordinator's account. Coordinators get coordinator-specific features layered on (see § Coordinator-specific features).

### Supplier vendor workflow (fulfilling)

- Supplier vendor sees incoming Setnayan orders (via 0022 supplier-vendor dashboard variant OR direct notification)
- Marks order accepted → in production → shipped → delivered
- Gets paid wholesale by Setnayan after delivery confirms (per agreed payment terms — likely T+7 to T+14)
- Reviews/ratings from couples + coordinators inform Setnayan's internal supplier rating (not surfaced to couples)

## Pricing rule — lowest-available-wholesale wins (locked 2026-05-19)

For any SKU in any service area, Setnayan offers the couple the **lowest available wholesale × 1.5 retail**. The pricing engine resolves like this at add-to-cart time:

1. Query `supplier_vendor_sku_pricing` rows for this `(sku_id, service_area_code)` where `effective_from ≤ today AND (effective_to IS NULL OR effective_to ≥ today)`.
2. Filter to vendors where `vendors.is_supplier_vendor = TRUE`, `vendors.status = 'active'`, the SKU's `supplier_vendor_skus.is_active = TRUE`, and (V1.5+ once capacity tracking lands) the vendor has remaining fulfillment capacity for the requested quantity + delivery window.
3. Order by `wholesale_centavos ASC` (cheapest first).
4. Pick the first available vendor → that's the wholesale used.
5. Retail snapshot = wholesale × 1.5, rounded to nearest peso. Snapshotted into `supplies_order_line_items.wholesale_centavos_at_order` + `retail_centavos_at_order` for price-change protection.
6. If NO vendor in the area satisfies the filters → surface "Coming to your area soon — join waitlist" empty state.

**Vendor doesn't see competitor pricing in V1.** Vendors quote wholesale independently; Setnayan resolves the cheapest at order time. V1.5+ candidate: surface "you're X% above the area median; consider repricing" signal in the 0022 supplier-vendor dashboard variant to encourage competitive wholesale.

**Stale-price-resolution behavior:** If the chosen vendor becomes unavailable BETWEEN add-to-cart and checkout (status flips to inactive, stock runs out, etc.), the cart re-resolves to the next-cheapest available vendor at checkout. Couple gets a notification before payment confirms: "Your supplier was updated — your total changed from ₱X to ₱Y." Order then snapshots at the new wholesale + retail.

**Quality floor mitigation.** Pure lowest-price selection risks supplier quality race-to-bottom. V1 mitigation:
- Wholesale agreement enforces fulfillment SLA + defect rate ceiling; vendor missing SLA gets suspended → falls out of the available pool
- Couple ratings + dispute counts feed an internal vendor reliability score (not surfaced to couples)
- Setnayan ops can manually suspend a vendor whose quality drops without going through the dispute process
- V1.5+ candidate: composite ranking that weights wholesale price by reliability score (e.g., 90%-of-the-time-cheapest wins, but 10%-of-the-time-rotates-to-higher-quality vendor to keep them in the pool)

For V1: pure lowest-price-wins with SLA-enforced suspension on quality misses.

## Pricing model — how Setnayan earns

The model is **resale margin**, not marketplace commission.

| Revenue mechanic | How it works |
|---|---|
| **Wholesale-to-retail markup** | Setnayan negotiates wholesale price with supplier vendor. Setnayan retail = wholesale × 1.5. Markup = 50% of wholesale = ~33% of retail. Net margin after support cost ~25-30%. |
| **Volume discount capture** | Bulk supplier pricing tiers (e.g., 100+ place cards at lower wholesale) — Setnayan may pass some discount to bulk-ordering couples, retain the rest as margin. |
| **Negotiated category pricing** | Some high-volume SKUs (Patiktok backgrounds, QR cards) get further negotiated wholesale once Setnayan demonstrates consistent monthly volume — margin improves over time. |
| **Couple-side bundle pricing** | Setnayan can bundle multiple supplies into a "Patiktok kit" or "Papic kit" at a slight discount vs individual purchase, while still keeping margin healthy. |

**Indicative revenue model (illustrative — not a forecast):**
- 1,000 supplies orders/month × ₱1,500 avg retail × 33% net margin = **₱495K/month gross margin**
- Minus support cost (~₱30-50 per order) = ~₱465K/month net
- Substantially higher than the original commission model (₱180K/month at the same volume)

Trade-off: requires Setnayan to carry cash-flow risk (pay vendor wholesale even if couple disputes; manage refunds; own quality control). The higher margin compensates.

## Cost basis for Setnayan

- Surface infrastructure: ₱0 marginal per transaction (pure software margin)
- Customer support: ~₱30-50 per order (dispute handling, returns coordination)
- Setnayan Team manual order routing: ~₱10-30 per order (matching incoming payment to vendor + dispatching)
- Cash-flow risk reserve: Setnayan may need to pay vendor wholesale before couple's refund window closes — minor working capital requirement
- Vendor sourcing ops: ongoing cost to negotiate + maintain wholesale agreements per area (~5-15% of leadership/ops time as the supplier base grows)

## Integrations across iterations

| Iteration | Integration |
|---|---|
| **0005 LED Background** | Setnayan provides soft copy; Setnayan Supplies handles USB-delivery print + courier to venue (supplier vendor route) |
| **0006 Vendors Management** | NEW: supplier-vendor classification added to `vendors` table (column `is_supplier_vendor BOOLEAN`). Supplier vendors do NOT appear in the discoverable couples-facing marketplace; they are sourcing-channel only. A vendor CAN be both marketplace + supplier (e.g., a print shop that markets directly via 0006 AND supplies Setnayan Supplies). |
| **0008 Seating Chart** | Print pack (place cards + table signs) auto-routes to Setnayan Supplies; couple sees one-click "Order place cards for ₱1,199" CTA |
| **0009 Photo Delivery** | Photo book printing (digital/soft/hard cover) flows through Setnayan Supplies print partners |
| **0017 Patiktok** | Background prints · HDMI dongles · monitors · tripods · backdrops — primary Supplies driver; one-click "Print my Patiktok background" CTA in Patiktok confirmation flow |
| **0026 BIR Tax Compliance** | Setnayan is the OR-issuer for the full retail (not just commission). Vendor invoices Setnayan at wholesale separately. Different VAT / Percentage Tax chain than 0034's marketplace commission model. Form 2307 obligations: Setnayan generates 2307 to supplier vendor (treating them as a supplier, not a marketplace seller). |
| **0034 Payments & Cart** | NEW wholesale-payout flow on `vendor_payouts` table (alongside existing commission-payout flow for 0006 marketplace bookings). `vendor_payouts.payout_type` enum gains `'wholesale'`. |
| **All physical SKUs** | NFC pendants · arras coins · QR cards · save-the-date physical mailers — moved from "one-off SKUs" to Setnayan Supplies fulfilled |

## Public browse pages (SEO-indexable · per Playbook §5.1, §4.4) — added 2026-06-04

**Locked (Cowork 2026-06-04 · resolves SEO-pending item #1):** the `/supplies/*` browse tree is **public and indexable** — no login to browse; **auth gates only cart + checkout**. Without these public URLs, no `/supplies` page can rank (Playbook §1, §5.1, §7).

| Page | URL | Schema | Min depth |
|---|---|---|---|
| Supplies hub | `/supplies` | `ItemList` + `BreadcrumbList` + `FAQPage` | 800 words + category grid |
| Category | `/supplies/[category]` | `ItemList` + `BreadcrumbList` + `FAQPage` | 600 words + product grid |
| Category × city | `/supplies/[category]/[city]` | `ItemList` + `BreadcrumbList` | 400 words + city-filtered grid |
| Product detail | `/supplies/p/[id]/[slug]` | `Product` + `Offer` (priceCurrency `PHP`) + `AggregateRating`/`Review` (real reviews only) | 250 words + spec data |

- **Titles / meta** follow Playbook §5.2 patterns (e.g. `Wedding Supplies Philippines — Print, Rentals & Keepsakes | Setnayan`).
- **Indexable** in `sitemap.xml`; canonical self-references; cart/checkout/state URLs blocked in `robots.txt` (Playbook §4.3).
- **Auth boundary:** browse = public; add-to-cart, checkout, order history = login-required.
- Full SEO substance (content depth, hub-and-spoke internal linking, JSON-LD shapes) lives in **Playbook §4.4 / §5.1–5.3 / §4.8** — not duplicated here.

## Schema additions (new + extends existing)

```sql
-- Extend 0006 vendors table
ALTER TABLE vendors ADD COLUMN is_supplier_vendor BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE vendors ADD COLUMN supplier_categories TEXT[] DEFAULT '{}';
  -- ['print_fulfillment', 'equipment_rental', 'decor_rental', 'nfc_qr_keepsake', 'specialty_merch']

-- Supplier vendor SKU + wholesale pricing per area
CREATE TABLE supplier_vendor_skus (
  sku_id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id             uuid NOT NULL REFERENCES vendors (vendor_id),
  category              text NOT NULL CHECK (category IN ('print_fulfillment','equipment_rental','decor_rental','nfc_qr_keepsake','specialty_merch')),
  sku_code              text NOT NULL,   -- canonical SKU identifier
  display_name          text NOT NULL,
  description           text,
  unit_of_measure       text NOT NULL,   -- 'per_piece', 'per_day', 'per_event', etc.
  is_active             boolean NOT NULL DEFAULT TRUE,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (vendor_id, sku_code)
);

CREATE TABLE supplier_vendor_sku_pricing (
  pricing_id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id                uuid NOT NULL REFERENCES supplier_vendor_skus (sku_id) ON DELETE CASCADE,
  service_area_code     text NOT NULL,   -- 'METRO_MANILA', 'CEBU', 'DAVAO', etc. (V1: Metro Manila only)
  wholesale_centavos    bigint NOT NULL CHECK (wholesale_centavos > 0),
  min_order_quantity    int NOT NULL DEFAULT 1,
  volume_tiers          jsonb,           -- optional volume discounts: [{min_qty, wholesale_centavos}, ...]
  effective_from        date NOT NULL DEFAULT CURRENT_DATE,
  effective_to          date,
  created_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (sku_id, service_area_code, effective_from)
);

-- Setnayan Supplies orders (separate from 0006 vendor bookings)
CREATE TABLE supplies_orders (
  order_id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id              uuid NOT NULL REFERENCES events (event_id) ON DELETE CASCADE,
  buyer_user_id         uuid NOT NULL REFERENCES users (user_id),
  delivery_service_area_code text NOT NULL,
  delivery_address      jsonb NOT NULL,
  delivery_window_start timestamptz,
  delivery_window_end   timestamptz,
  status                text NOT NULL DEFAULT 'pending_payment' CHECK (status IN (
    'pending_payment','paid','accepted','in_production','shipped','delivered','completed','refunded','cancelled'
  )),
  total_retail_centavos bigint NOT NULL,
  total_wholesale_centavos bigint NOT NULL,   -- sum of line-item wholesale (used for vendor payout calc)
  total_markup_centavos bigint NOT NULL,      -- total_retail - total_wholesale (Setnayan gross margin)
  payment_status        text NOT NULL DEFAULT 'pending',
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE supplies_order_line_items (
  line_item_id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              uuid NOT NULL REFERENCES supplies_orders (order_id) ON DELETE CASCADE,
  sku_id                uuid NOT NULL REFERENCES supplier_vendor_skus (sku_id),
  supplier_vendor_id    uuid NOT NULL REFERENCES vendors (vendor_id),
  quantity              int NOT NULL CHECK (quantity > 0),
  wholesale_centavos_at_order bigint NOT NULL,   -- snapshot of wholesale at order time (price change protection)
  retail_centavos_at_order bigint NOT NULL,       -- snapshot of retail (wholesale × 1.5) at order time
  status                text NOT NULL DEFAULT 'queued',
  shipped_at            timestamptz,
  delivered_at          timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- Wholesale payouts to supplier vendors (alongside existing commission payouts in 0034)
-- This extends 0034's vendor_payouts table:
ALTER TABLE vendor_payouts
  ADD COLUMN payout_type TEXT NOT NULL DEFAULT 'commission' CHECK (payout_type IN ('commission','wholesale')),
  ADD COLUMN supplies_order_id UUID REFERENCES supplies_orders (order_id);
-- Existing commission payouts get payout_type='commission'; new supplies wholesale payouts get payout_type='wholesale'
```

## Coordinator-specific features

Coordinators (paid wedding planners) are power users of Setnayan Supplies. Features specifically for coordinators:

- **Bulk ordering across events** — coordinator manages 5-15 weddings simultaneously, can batch orders across events
- **Margin markup on top of Setnayan retail** — coordinator can mark up Setnayan's retail price to their clients (Setnayan retail + coordinator markup = couple's total). Coordinator dashboard shows their take separately.
- **Saved supply templates** — coordinator builds a "standard Patiktok kit" or "standard Papic kit" template, applies to every client
- **Supplier preferences** — coordinator marks preferred SKUs per category; gets priority recommendations when those vendors have stock
- **Single bill across clients** — coordinator pays Setnayan once per billing cycle (consolidated invoice across all their events that month)

## Anti-abuse + quality controls

| Risk | Mitigation |
|---|---|
| Supplier vendor failing to deliver | Setnayan ops monitors delivery SLA; if vendor misses, Setnayan eats the refund + finds backup supplier in the same area; vendor's wholesale agreement allows Setnayan to suspend / terminate |
| Wholesale price drift after order placed | `wholesale_centavos_at_order` snapshot protects the couple — order ships at the snapshot price even if vendor raises wholesale mid-fulfillment |
| Couple refund disputes | Setnayan owns customer relationship; Setnayan refunds couple from gross margin; recovers from vendor only if vendor was at fault per quality SLA |
| Coordinator margin abuse | Coordinator can mark up but cap is implicit at industry-normal (~10-25% over Setnayan retail); flagging if coordinator marks up >50% triggers couple-side disclosure |
| Vendor sub-contracting | Wholesale agreement requires vendor to disclose sub-contractors; Setnayan retains right to inspect; Setnayan brand stays on the order regardless |
| Stale wholesale prices | `effective_from` + `effective_to` date columns enforce rolling pricing; vendor must reaffirm prices quarterly or pricing becomes stale → SKU auto-deactivates |
| Area-coverage gaps | If a couple's delivery area has no supplier vendor for a SKU, Setnayan surfaces a "not yet available in your area" message + waitlist signup; ops uses waitlist data to prioritize next supplier negotiation |

## Pre-launch owner-side gate

**Setnayan Supplies cannot launch to couples without signed wholesale agreements with supplier vendors.** Before V1 production traffic:

- [ ] At least 1-3 supplier vendors signed per SKU category per service area (V1 = Metro Manila)
  - [ ] Print fulfillment supplier (e.g., 1 city-center + 1 north + 1 south)
  - [ ] Equipment rental supplier (HDMI / monitors / projectors / tripods / ring lights)
  - [ ] Backdrop + decor rental supplier
  - [ ] NFC + QR keepsake supplier
  - [ ] Specialty merch supplier
- [ ] `01_Contracts/Setnayan_Supplier_Vendor_Agreement.md` template drafted (legal review pending)
- [ ] Wholesale prices entered into `supplier_vendor_sku_pricing` table for each signed vendor
- [ ] Service area mapping defined (which barangays / cities map to which supplier vendor)
- [ ] Backup-vendor fallback for each category (if primary supplier misses delivery)

Without these, the engineering can ship but the surface stays gated behind a "Coming to your area soon — join waitlist" empty state.

## Future considerations

- **Setnayan-owned print partner.** Setnayan may negotiate exclusive arrangements with 1-2 print shops at deeper wholesale discounts (e.g., 30-40% off list) by guaranteeing volume — even better margin than 50% markup.
- **Vendor advertising / featured placement.** Even in a resale model, vendors can pay to be featured (with "Featured by Setnayan" badge) when their SKU appears in recommendations.
- **International expansion.** When Setnayan expands beyond PH, supplier vendor model adapts to local suppliers per region.
- **Reverse marketplace.** Coordinators can post "I need X for an event in Cebu, May 2027" requests; Setnayan ops sources via partner network.
- **Subscription bundles for high-volume customers.** Wedding planners doing 5+ weddings/month could pre-buy a "kit subscription" at deeper discount.

## Companion docs

- `0018_supplies_marketplace.html` — mockup of supplies browse, cart, checkout (will need refresh to drop "marketplace" framing)
- `0018_supplies_marketplace.docx` — stakeholder-readable version (also needs refresh)
- `01_Contracts/Setnayan_Supplier_Vendor_Agreement.md` — wholesale supply agreement template (TO BE DRAFTED)

---

*Drafted 2026-05-11 · pivoted to Setnayan-sourced resale model 2026-05-19 per owner directive. Higher-margin curated reseller pattern with per-area wholesale + 50% markup. Pair with 0006 Vendors (supplier-vendor classification added) and 0034 Payments & Cart (wholesale-payout flow added on `vendor_payouts.payout_type`).*
