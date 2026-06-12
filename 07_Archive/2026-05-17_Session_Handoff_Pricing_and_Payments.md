# Setnayan — 2026-05-17 Session Handoff (Pricing & Payments Architecture)

> **For:** the next Claude account picking up this work.
> **Scope:** all pricing, payment-fee, Cam Bridge, Panood, Papic, Patiktok, Save-the-Date, frequency-schema, and Cost-Watch work in the 2026-05-16 evening + 2026-05-17 sessions.
> **Companion handoff:** `2026-05-17_Session_Handoff.md` covers the parallel event-change-flow work (iteration 0021 §§ 10–13). They are independent.
> **Net result:** 8 spec files updated · ~15 new SKU definitions · 7+ new CLAUDE.md decision-log rows · 2 new schema primitives (2-D billing model + Cost Watch) · 2 new memory files (carry over to the new account).

---

## How to use this document (for the new Claude)

1. **Read this file first** — it summarizes everything decided in the 2026-05-16/17 pricing-architecture sessions.
2. **Then read the corpus status anchors** in this order:
   - `V1_Gap_Analysis_Status.md` — what's spec-locked
   - `App_Build_Status.md` — what's shipped vs spec
   - `Installed_Stack_Inventory.md` — wired infra
   - `API_Integration_Checklist.md` — owner admin punch list
3. **Then read `CLAUDE.md`** decision log — every row dated 2026-05-16 or 2026-05-17 was added in this session period. **Latest rows win over earlier ones** (per the explicit owner directive on 2026-05-17).
4. **For pricing specifics**, the canonical source is `0034_payments_and_cart/0034_payments_and_cart.md` — specifically the `service_catalog` seed section (lines ~65–155) which contains every active SKU + its locked price.
5. **Before recommending ANY pricing change, re-check the `service_catalog` seed** to confirm the SKU is still active and the price hasn't moved. Do NOT trust stale session context — this is a locked discipline; see "Memory files" section at the bottom.

---

## Session context

- **Dates:** 2026-05-16 evening + 2026-05-17 (all-day pricing/payments session)
- **Owner request that kicked it off:** "Deep study of paid services + market competitive analysis"
- **Outcome:** Full V1 + V1.5+ payments architecture lock across Setnayan Pay convenience fee + vendor disbursement + payment-options policy + 19 paid feature SKUs + admin tooling (Cost Watch primitive + frequency picker).
- **Discipline established mid-session:** "latest spec wins" — if a SKU got repriced 3× in one session, only the last reprice counts. Earlier session context is historical, not load-bearing.
- **What we didn't get to:** the per-SKU "1 by 1" walkthrough originally requested at the top of the session. The architecture work consumed the time. **However**, the top-4 mispriced SKUs from the original deep-study (`save_the_date_video_render`, `panood_daily_broadcast`, `panood_annual_streaming`, `ai_edited_highlight_3min`) all got repriced anyway during the architecture work, so the original deep study is effectively closed.

---

## Locked decisions (dependency order — read top to bottom)

### 1. Setnayan Pay convenience fee — flat 5.0% on top of vendor price · ₱50 minimum · Option B (vendor absorbs gateway)

**Lock date:** 2026-05-16 evening (supersedes morning's 5.5%/6.5% dual-rate lock).

**The math owner ratified:** **3% net to Setnayan after all taxes at worst-case tax tier.** Required gross = 3% / (1 − tax_wedge):
- V1 28% wedge → 4.17% gross
- V2 35% wedge (VAT-reg + LBT 2%) → 4.62% gross
- Extreme 40% wedge → 5.00% gross

**Flat 5.0% is the minimum gross that holds the 3% net floor under every plausible tax scenario** with cushion for chargebacks, failed transactions, disbursement-fee absorption.

**Formula at checkout:**
```
fees_centavos = (vendor booking)
              ? MAX(subtotal_centavos × 500 / 10000, 5000)
              : 0
-- i.e., MAX(5% of subtotal, ₱50)
```

The ₱50 minimum activates only on vendor bookings below ₱1,000 (~1–2% of bookings — supplies/micro-add-ons).

**Option B (vendor absorbs gateway) confirmed** over Option A:
- Stripe Connect / Airbnb / Lazada Marketplace pattern — vendors expect it
- Insulates Setnayan from gateway rate risk forever
- Customer-facing headline stays clean at flat 5.0%

**Canonical spec:** `0034_payments_and_cart/0034_payments_and_cart.md` § 6 (full rewrite).

**Decision-log rows in CLAUDE.md:** 2026-05-16 evening (3 epochs: 3% retired → morning 5.5%/6.5% retired → evening flat 5.0% LIVE) · 2026-05-17 V1 manual scope confirmation · 2026-05-17 ₱50 floor.

### 2. V1 vs V1.5+ payment-system boundary

**V1 ships with manual QR + screenshot reconciliation flow** — no automated gateway. Customer scans Setnayan-provided BDO/GCash QR, pays vendor list + 5% (e.g., ₱105,000 on a ₱100K booking), uploads screenshot, admin approves manually.

- BDO-to-BDO and GCash-to-GCash transfers are free via InstaPay rails
- Setnayan keeps full ₱5,000 with zero gateway absorption in V1
- V1 net at 5.0% = 3.60% (V1 28% tax wedge) — exceeds 3% net target by 0.6pp

**V1.5+ shifts to Maya Business automated gateway.** Gateway absorption Path A/B/C/D discussion was implicitly V1.5+ — explicitly deferred to V1.5+ Maya merchant-approval milestone.

**Canonical spec:** `0034_payments_and_cart/0034_payments_and_cart.md` § 6 preamble (V1-vs-V1.5+ boundary banner) + § 6.7 Payment gateway sequencing.

### 3. V1.5+ vendor disbursement — Maya Business Bulk Fund Transfer with three-rail routing

**Lock date:** 2026-05-17 (first row of the day).

**Three rails by destination:**

| Rail | Vendor sees money | Setnayan absorbs | Used for |
|---|---|---|---|
| **Intra-Maya** (vendor has Maya Bank account) | Instant · 24/7 · free | ₱0 | All payout types when vendor's disbursement bank is Maya Bank |
| **InstaPay** (Maya → any PH bank) | < 1 min · 24/7 incl. weekends | ~₱10 per payout (bulk rate) | Verified vendor immediate payout to non-Maya destinations |
| **PESONet** (Maya → any PH bank) | EOD same banking day · T+1 weekends | ~₱15 per payout (bulk rate) | Coming_soon vendor 3-stage milestone releases · payouts < ₱500 or > ₱500K |

**Vendor override** in 0022 Vendor Dashboard payout preferences:
- Verified vendor downgrades to PESONet → ₱5/payout rebate credit
- Coming_soon vendor upgrades to InstaPay → vendor absorbs ₱5 difference

**Maya Bank vendor-recruiting copy** (canonical, surfaces in verification approval email + 0022 onboarding tour + payout-preferences settings):

> "Get paid instantly, free, 24/7 — open a Maya Bank business account.
> Or get paid in under a minute to any PH bank, including weekends (InstaPay).
> Standard payout settles end of business day (PESONet) — default for milestone releases."

**Annual disbursement cost absorbed by Setnayan:** ₱2,500/yr at 200 couples → ₱65K/yr at 5,000 couples — under 0.3% of platform revenue at every scale. **Real value isn't fee savings but operational efficiency** (per-payout admin time collapses from ~5 min to ~5 sec).

**Schema additions** (in 0034 § 6.9):
- New `disbursement_batches` table
- New columns on `vendor_payouts`: `rail` enum, `rail_chosen_by` enum, `batch_id` FK, `status` enum

**Canonical spec:** `0034_payments_and_cart/0034_payments_and_cart.md` § 6.7 Outbound + § 6.9 Schema · `0006_vendors_management/0006_vendors_management.md` Vendor Payout model § Disbursement rail tiers.

### 4. Payment Options Policy Matrix — admin per-account-type policy

**Lock date:** 2026-05-17 (with **"always remember"** weight from owner).

**Four scopes** admin can enable/disable methods for:
- **Customers** (couples paying Setnayan)
- **Vendors** (un-certified / coming_soon)
- **Certified Vendors** (verified vendor-payee side)
- **Events** (per-event override that supersedes account-type default)

**Schema** (in 0023 § 3.5f):
```sql
ALTER TABLE payment_method_config
  ADD COLUMN enabled_for_customers BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN enabled_for_vendors_coming_soon BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN enabled_for_vendors_certified BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE event_payment_options_override (
  event_id UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  method_key TEXT NOT NULL REFERENCES payment_method_config(method_key),
  enabled BOOLEAN NOT NULL,
  set_by_admin_id UUID NOT NULL REFERENCES users(user_id),
  reason TEXT,
  set_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (event_id, method_key)
);
```

**Resolution order at checkout:** per-event override (if any) → fall back to account-type default.

**V1/V1.5+:** schema lands in V1 with sparse matrix (BDO QR + GCash QR + manual transfer only); V1.5+ Maya Business approval auto-expands as new method rows insert.

**Canonical spec:** `0023_admin_console/0023_admin_console.md` § 3.5f Payment Options Policy Matrix.

### 5. Vendor convenience-fee absorption opt-in — "No Convenience Fee" badge

**Lock date:** 2026-05-16 PM.

**The toggle:** vendor can opt to absorb the 5.0% convenience fee out of their own listed price, earning a public-facing "No Convenience Fee" badge.

**Cart math change** when `vendor.absorbs_convenience_fee = TRUE`:
- Customer sees vendor list price flat (no fee row)
- Setnayan revenue: unchanged (5% × subtotal, comes out of vendor's payout)
- Vendor effective revenue: 95% of listed price

**Worked example at ₱100K booking:**
- Option A (vendor absorbs): vendor net ₱93,100 (Maya QR Ph) / ₱92,150 (max 2.5% rail)
- Option B (default): vendor net ₱98,000 / ₱97,000
- Vendor sacrifices ~₱4,900 (~5%) for the badge

**Schema:**
- `vendors.absorbs_convenience_fee BOOLEAN DEFAULT FALSE`
- `service_orders.vendor_absorbed_fee BOOLEAN DEFAULT FALSE` (snapshot at order time)

**Canonical spec:** `0034_payments_and_cart/0034_payments_and_cart.md` § 6.8 · `0006_vendors_management/0006_vendors_management.md` Convenience-fee absorption opt-in section.

### 6. Panood always-multi-cam pivot · max 6 cameras

**Lock date:** 2026-05-17.

- Panood is always multi-cam in V1 (no more single-cam vs multi-cam tier)
- Max 6 cameras enforced via Cloudflare Stream Live SFU room config `max_publishers: 6`
- Six is the safe operating ceiling with stability headroom for phone-broadcaster + average internet
- 7–12 cams technically possible but UX degrades; reserved as V1.5+ industry-event tier

**Locked Panood lineup:**

| SKU | Price · Frequency | Description |
|---|---|---|
| `panood_daily_broadcast` | **₱2,499/day** · one_time + per_event + multi-purchase | Multi-cam (up to 6) broadcast for one event-day · couple BYO YouTube via OAuth |
| `panood_annual_streaming` | **₱19,999/year** · annual + all_events | Multi-cam (up to 6) unlimited days for one year · ALL events on the account |
| `panood_template_pack_daily` | **₱799/day** · one_time + per_event + multi-purchase | Overlays + titles + transitions on the broadcast output, one day |
| `panood_template_pack_annual` | **₱7,999/year** · annual + all_events | Overlays + titles + transitions, unlimited days for one year · ALL events |
| `panood_cam_bridge_slot_day` | **₱199/slot/day** · one_time + per_event + multi-purchase | DSLR-paired camera slot for the Panood broadcast feed |

**Retired same-day:**
- `panood_camera_sync_daily` (₱99/day) — multi-cam now built into base
- `panood_annual_streaming_plus` (₱3,999/yr) — multi-cam now built into base

**Canonical spec:** `0011_panood/0011_panood.md` SKU table.

### 7. Papic reactivated to V1 — HTML-based capture · tiered seat structure

**Lock date:** 2026-05-17 (lifts the 2026-05-16 V1.5+ deferral).

**Rationale:** Papic capture is HTML/browser-based — no native-app gating per seat. Seat count is the "official paparazzi" UX limit the couple sets; guests can still upload via QR without consuming seats.

**Locked Papic V1 lineup:**

| SKU | Price · Frequency |
|---|---|
| `paparazzi_3_seats` | **₱1,499** · one_time + per_event |
| `paparazzi_5_seats` | **₱2,499** · one_time + per_event |
| `paparazzi_camera_addon` (+1 seat) | **₱999** · one_time + per_event + multi-purchase |
| `papic_cam_bridge_slot_day` | **₱99/slot/day** · one_time + per_event + multi-purchase |
| `papic_cam_bridge_all_slots_day` | **₱249/day** · one_time + per_event + multi-purchase |
| `papic_cam_bridge_all_slots_annual` | **₱2,499/year** · annual + all_events |

**Stays V1.5+ deferred** (architecture locked but build still pending):
- `paparazzi_credits_addon` (₱299) · `premium_guest_camera_pack` (₱1,499) · `personal_album_per_guest` (₱49) · `memory_book_per_guest` (₱249) · `template_unlock` (₱199 — original Papic Reel templates, **distinct from the new Panood Template Pack**)

**Canonical spec:** `0012_papic/0012_papic.md` V1 SKU table (reactivated 2026-05-17 section).

### 8. Patiktok Cam Bridge added

**Lock date:** 2026-05-17.

| SKU | Price · Frequency |
|---|---|
| `patiktok_cam_bridge_day` | **₱49/day** · one_time + per_event + multi-purchase |
| `patiktok_cam_bridge_annual` | **₱249/year** · annual + all_events |

**Canonical spec:** `0017_patiktok/0017_patiktok.md` SKU table.

### 9. Save-the-Date Video repriced ₱99 → ₱199

**Lock date:** 2026-05-17.

**Rationale anchored in the new Cost Watch primitive:**
- COGS per render: ~₱5–10 (FFmpeg + R2 storage + Setnayan-owned music = ~₱0 licensing)
- Highest observed render so far: ~₱45 (vision-heavy footage, full template library)
- At ₱99 the worst-case cost-to-price ratio is **45% (yellow zone)**
- At ₱199 it drops to **23% (green)**
- Still under ₱200 impulse-buy threshold; still a social-share-traffic play

**Canonical spec:** `0024_save_the_date/0024_save_the_date.md` § Product spec + "Why ₱199" subsection.

### 10. AI Edited Highlight 3-min — no change at ₱3,499

Locked 2026-05-16 (was ₱4,999). Confirmed at ₱3,499 in this session. Cost Watch ratio = 24% (green) — pricing is safe.

### 11. Two-dimensional billing schema — `time_recurrence` + `event_scope`

**Lock date:** 2026-05-17.

Replaces the prior single `billing_frequency` enum with two orthogonal columns:

```sql
ALTER TABLE service_catalog
  ADD COLUMN time_recurrence TEXT NOT NULL DEFAULT 'one_time'
    CHECK (time_recurrence IN ('one_time','weekly','quarterly','annual','lifetime')),
  ADD COLUMN event_scope TEXT NOT NULL DEFAULT 'per_event'
    CHECK (event_scope IN ('per_event','all_events'));
```

**Maps the owner's mental model exactly** — "per day for single event" vs "annual for all events on the account" are distinct combinations rather than a single enum value.

- **Most active SKUs** = `one_time + per_event` (default).
- **Annual subscriptions** (Panood Annual · Panood Template Pack Annual · Papic Cam Bridge Annual · Patiktok Cam Bridge Annual · Vendor Verification renewal · All Tools Unlock) = `annual + all_events`.
- **Vendor recurring** (Vendor Pro Weekly · Sponsored Boost Weekly) = `weekly + all_events`.
- **Concierge** = `one_time + per_event` (single purchase, 12-month wedding-anchored access, no recurring billing).

**Audit:** `service_catalog_price_history` extended with `prior_time_recurrence` + `new_time_recurrence` + `prior_event_scope` + `new_event_scope` columns.

**Two-admin approval** required for `time_recurrence` or `event_scope` post-launch changes (same gate as mid-quarter price changes >₱500). Existing active subscriptions keep their old frequency until natural expiry.

**Canonical spec:** `0034_payments_and_cart/0034_payments_and_cart.md` § service_catalog seed section (h) + `0023_admin_console/0023_admin_console.md` § 3.5.

### 12. Cost Watch primitive — admin sees per-SKU render-cost reality

**Lock date:** 2026-05-17.

**The principle the owner stated:** "we want to see the highest single render spent on that so that can be our basis for the cost of the service."

**Schema** (in 0034):
```sql
CREATE TABLE service_render_costs (
  render_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_code TEXT NOT NULL REFERENCES service_catalog(sku_code),
  order_id UUID REFERENCES service_orders(order_id),
  user_id UUID REFERENCES users(user_id),
  event_id UUID REFERENCES events(event_id),
  cost_centavos INT NOT NULL,
  cost_breakdown JSONB NOT NULL,  -- { ai_api, ffmpeg, storage, bandwidth, music_license, ... }
  rendered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  succeeded BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_render_costs_sku ON service_render_costs(sku_code, rendered_at DESC);
CREATE INDEX idx_render_costs_event ON service_render_costs(event_id);

CREATE MATERIALIZED VIEW service_catalog_cost_watch AS
SELECT
  sku_code,
  COUNT(*)                                                          AS renders_count,
  MAX(cost_centavos)                                                AS highest_single_render_centavos,
  ROUND(AVG(cost_centavos))                                         AS avg_render_centavos,
  ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY cost_centavos))::INT AS p95_render_centavos,
  MAX(rendered_at)                                                  AS latest_render_at,
  (SELECT cost_breakdown FROM service_render_costs s2
   WHERE s2.sku_code = s1.sku_code AND s2.succeeded = TRUE
   ORDER BY cost_centavos DESC LIMIT 1)                             AS highest_render_breakdown
FROM service_render_costs s1
WHERE succeeded = TRUE AND rendered_at > NOW() - INTERVAL '90 days'
GROUP BY sku_code;
```

**Admin UI in 0023 § 3.5** shows for each SKU:
- Highest single render cost (90-day max)
- Average + p95
- Cost-to-Price ratio with health flag (🟢 <30% · 🟡 30–50% · 🔴 >50%)
- Click-through to cost_breakdown drilldown modal

**Instrumentation phasing** (V1 ships table + view + admin UI; 3 highest-COGS SKUs instrumented first):
1. AI Edited Highlight 3-min (highest)
2. AI Video Highlight 60s
3. Setnayan Concierge (Claude Sonnet calls)

Remaining SKUs get instrumentation in V1.5+.

**Pricing-recommendation rule of thumb:** keep `highest_single_render_centavos / price_php_centavos < 30%` for healthy margin.

**Canonical spec:** `0034_payments_and_cart/0034_payments_and_cart.md` § service_catalog seed section (o-p) · `0023_admin_console/0023_admin_console.md` § 3.5.

---

## V1 paid-feature catalog — complete locked state

### Couple-side per-event SKUs (one_time + per_event)

| SKU | Price |
|---|---|
| `pro_widget_hero` · `pro_widget_story` · `pro_widget_schedule` | ₱99 each |
| `pro_widget_bundle` | ₱199 |
| `custom_monogram_pack` | ₱1,999 |
| `ai_video_highlight_60s` | ₱1,999 |
| `ai_edited_highlight_3min` | ₱3,499 |
| `contract_intelligence_upgrade` | ₱199 |
| `concierge_complete` | ₱4,999 (12-mo wedding-anchored access, 24-mo cap) |
| `save_the_date_video_render` | ₱199 (repriced from ₱99) |
| `patiktok_setnayan_daily` | ₱999/day |
| `patiktok_personal_daily` | ₱1,999/day |
| `patiktok_video_overage` | ₱49 |
| `paparazzi_3_seats` | ₱1,499 |
| `paparazzi_5_seats` | ₱2,499 |
| `paparazzi_camera_addon` (+1 seat) | ₱999 |
| `panood_daily_broadcast` | ₱2,499/day |
| `panood_template_pack_daily` | ₱799/day |
| `panood_cam_bridge_slot_day` | ₱199/slot/day |
| `papic_cam_bridge_slot_day` | ₱99/slot/day |
| `papic_cam_bridge_all_slots_day` | ₱249/day |
| `patiktok_cam_bridge_day` | ₱49/day |

### Annual / all-events subscriptions (annual + all_events)

| SKU | Price |
|---|---|
| `panood_annual_streaming` | ₱19,999/year |
| `panood_template_pack_annual` | ₱7,999/year |
| `papic_cam_bridge_all_slots_annual` | ₱2,499/year |
| `patiktok_cam_bridge_annual` | ₱249/year |

### Vendor-side recurring

| SKU | Price |
|---|---|
| `vendor_pro_weekly` | ₱499/week |
| `sponsored_boost_weekly` | ₱1,499/week |
| Vendor Verification annual renewal | ₱1,500/year |
| All Tools Unlock bundle | ₱9,999/year |
| Boosted Ads (weekly tiers 5km/10km/20km) | ₱5,000 / ₱8,000 / ₱15,000 per week |
| Sponsored Boost Quarterly long-commit | ₱250,000 (30km, verified-only) |
| Sponsored Boost Annual long-commit | ₱800,000 (30km, verified-only) |

### Transaction-level

- **Setnayan Pay convenience fee:** 5.0% on top of vendor price · ₱50 minimum · Option B (vendor absorbs gateway)
- **Vendor opt-in** to absorb convenience fee → earns "No Convenience Fee" badge
- **BIR Marketplace Withholding** 0.5% pass-through per RMC 8-2024

### Retired permanently this session

- `panood_camera_sync_daily` — multi-cam now built into Daily Broadcast
- `panood_annual_streaming_plus` — multi-cam now built into Annual Streaming
- `pro_camera_bridge_seat` (the original shared SKU) — replaced by 6 product-scoped Cam Bridge SKUs

### V1.5+ deferred (architecture locked, build pending)

- `paparazzi_credits_addon` (₱299) · `premium_guest_camera_pack` (₱1,499) · `personal_album_per_guest` (₱49) · `memory_book_per_guest` (₱249) · `template_unlock` (₱199 — Papic Reel templates, distinct from new Panood Template Pack) · `concierge_essentials` (₱2,499 — retired same-week as introduction, single-SKU model adopted)

---

## Engineering implementation pending

Tracked in the relevant decision-log rows + `App_Build_Status.md` + the new Owner Admin Punch List in `API_Integration_Checklist.md`.

### Database migrations needed (V1-deployable now)

```sql
-- 1. Two-dimensional billing schema
ALTER TABLE service_catalog
  ADD COLUMN time_recurrence TEXT NOT NULL DEFAULT 'one_time'
    CHECK (time_recurrence IN ('one_time','weekly','quarterly','annual','lifetime')),
  ADD COLUMN event_scope TEXT NOT NULL DEFAULT 'per_event'
    CHECK (event_scope IN ('per_event','all_events'));

ALTER TABLE service_catalog_price_history
  ADD COLUMN prior_time_recurrence TEXT,
  ADD COLUMN new_time_recurrence TEXT,
  ADD COLUMN prior_event_scope TEXT,
  ADD COLUMN new_event_scope TEXT;

-- 2. Cost Watch
CREATE TABLE service_render_costs ( /* ... see spec ... */ );
CREATE INDEX idx_render_costs_sku ON service_render_costs(sku_code, rendered_at DESC);
CREATE INDEX idx_render_costs_event ON service_render_costs(event_id);
CREATE MATERIALIZED VIEW service_catalog_cost_watch AS /* ... see spec ... */;

-- 3. service_catalog seed updates — run sections (h)–(o) of 0034 as a single transaction

-- 4. Payment Options Policy Matrix
ALTER TABLE payment_method_config
  ADD COLUMN enabled_for_customers BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN enabled_for_vendors_coming_soon BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN enabled_for_vendors_certified BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE event_payment_options_override ( /* ... see spec ... */ );

-- 5. Setnayan Pay minimum-fee floor
ALTER TABLE payment_method_config
  ADD COLUMN min_fee_centavos INT NOT NULL DEFAULT 5000;

-- 6. Vendor opt-in absorb fee
ALTER TABLE vendors ADD COLUMN absorbs_convenience_fee BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE service_orders ADD COLUMN vendor_absorbed_fee BOOLEAN NOT NULL DEFAULT FALSE;
```

### V1.5+ database migrations (gated on Maya Business merchant approval)

```sql
CREATE TABLE disbursement_batches ( /* ... see spec ... */ );
ALTER TABLE vendor_payouts
  ADD COLUMN rail TEXT CHECK (rail IN ('intra_maya','instapay','pesonet')) DEFAULT 'pesonet',
  ADD COLUMN rail_chosen_by TEXT CHECK (rail_chosen_by IN ('default','vendor_preference','admin_override')) DEFAULT 'default',
  ADD COLUMN batch_id UUID REFERENCES disbursement_batches(batch_id),
  ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','batched','disbursed','failed','manual_reconciliation'));
```

### Infrastructure config

- **Cloudflare Stream Live SFU room config** — `max_publishers: 6` (Panood camera cap enforcement)
- **Maya Business merchant account** — owner admin task, 2–4 week SLA per Owner Admin Punch List

### Frontend / server-action work

- **Cart math** — read `time_recurrence` + `event_scope` for invoice/receipt copy
- **Cart drawer UI** — "₱50 minimum" suffix when floor is active; "Convenience fee ✓ covered by vendor" muted row when `vendor_absorbed_fee = TRUE`
- **Marketplace badge + filter chip** — "No Convenience Fee" rendering when `vendor.absorbs_convenience_fee = TRUE`
- **0022 Vendor Dashboard** — payout-preferences UI (rail picker), Settings toggle for absorb-fee + financial preview
- **0022 onboarding tour** — Maya Bank pitch step
- **Verification approval email template (Resend)** — Maya Bank pitch
- **0023 admin console** — pricing grid with frequency dropdowns + Cost Watch columns + cost-breakdown drilldown modal + Payment Options Policy Matrix grid + Bulk Fund Transfer "Today's payouts" queue + Generate-batch-CSV button
- **0015 marketing site `/pricing` page** — ₱5,000 / ₱105,000 worked example (currently showing 5.5%/₱5,500 in production per WebFetch)
- **Bulk-batch failure-handling worker** — rejected rows revert to pending + rejoin next-day batch; 3-consecutive-failure admin alert

### Vendor agreement copy

- 01_Contracts — language describing vendor opt-in absorb-fee + Maya Bank vendor-recruiting pitch + new annual all-events subscription model. Not gating but recommended for the next 01_Contracts pass.

### .docx mirror regeneration

All `.md` updates this session were NOT mirrored to `.docx` because pandoc was unavailable at edit time. Per established convention, flagged for the next Cowork pass that has pandoc.

**Files needing `.docx` regen:**
- `0034_payments_and_cart/0034_payments_and_cart.docx`
- `0023_admin_console/0023_admin_console.docx`
- `0011_panood/0011_panood.docx`
- `0012_papic/0012_papic.docx`
- `0017_patiktok/0017_patiktok.docx`
- `0024_save_the_date/0024_save_the_date.docx`
- `0006_vendors_management/0006_vendors_management.docx`
- `0015_main_website/0015_main_website.docx`
- `CLAUDE.docx`

*Note:* the companion 2026-05-17 handoff (`2026-05-17_Session_Handoff.md`) notes "pandoc installed locally" — if that landed before this handoff was written, the .docx regen blocker may already be lifted. Verify before starting the next session.

---

## Open items / next steps for the new Claude

### Original "deep market study" — effectively closed

The session started with the owner asking for a "deep study of paid services" with the intent to walk through every SKU "1 by 1". The architecture work consumed the session, but the **top 4 mispriced SKUs from the original deep-study all got resolved during the architecture work:**

1. `save_the_date_video_render` — ₱99 → ₱199 (done)
2. `panood_daily_broadcast` — ₱499 → ₱2,499 (done)
3. `panood_annual_streaming` — ₱2,999 → ₱19,999 (done)
4. `ai_edited_highlight_3min` — held at ₱3,499 (confirmed)

The remaining 13 deep-study items were lower-impact and most are also in their final state.

**Suggested first action for next session:** ask the owner if they want to spot-check any remaining SKU, or move on to a different topic.

### V1.5+ planning items deferred

- **Gateway absorption cap Path A/B/C/D** — owner-proposed "Setnayan covers gateway up to 2.5%" rule needs Path A (accept lower net) / B (raise gross to 7.5%) / C (reduce cap to 1.5%) / D (7.0% midpoint). Deferred until Maya Business merchant approval lands.
- **Cost Watch instrumentation rollout** — remaining SKUs (Save-the-Date Video, Panood, Custom Monogram, Patiktok, Cam Bridge tiers) need cost-emission wiring in V1.5+ once the V1 top-3-COGS instrumentation validates the pattern.
- **0023 admin grid UI components** — the Payment Options Policy Matrix grid + Cost Watch columns + Frequency picker drawer all need engineering. Schema is V1-deployable; admin UI is V1.5+ catch-up.
- **Maya Bulk Fund Transfer integration** — gated on Maya Business merchant approval (Owner Admin Punch List item #1, 2–4 week SLA).

### Owner administrative tasks blocking V1.5+

See `API_Integration_Checklist.md` Owner Admin Punch List — top of file. Critical-path items including Maya Business merchant signup, BIR Form 2303, Google Cloud + YouTube verified-app OAuth, DPO/NPC registration, BDO + GCash business accounts.

---

## Reference index — where each decision lives

### Spec corpus files modified this session

| File | What changed |
|---|---|
| `0034_payments_and_cart/0034_payments_and_cart.md` | § 6 full rewrite (5.0% flat + Option B + ₱50 floor + V1/V1.5+ banner + vendor opt-in + Bulk Fund Transfer routing + Cost Watch schema) · service_catalog seed sections h–p · in-file decision log new rows |
| `0023_admin_console/0023_admin_console.md` | § 3.5 full rewrite (Cost Watch + Frequency picker + drilldown) · § 3.5d (rate table flat 5.0% + min_fee_centavos column) · § 3.5f new (Payment Options Policy Matrix) · § 3.6 stale 3% fee corrected to 5.0% |
| `0011_panood/0011_panood.md` | SKU table refreshed (always-multi-cam, max 6, retirements logged) |
| `0012_papic/0012_papic.md` | V1.5+ deferral header marked partially superseded · V1 SKU table inserted with reactivation rationale + 3 Cam Bridge tiers |
| `0017_patiktok/0017_patiktok.md` | SKU table extended with 2 Patiktok Cam Bridge SKUs |
| `0024_save_the_date/0024_save_the_date.md` | Price ₱99 → ₱199 + "Why ₱199" subsection rewritten |
| `0006_vendors_management/0006_vendors_management.md` | Vendor Payout model § Disbursement rail tiers added · Convenience-fee absorption opt-in section added · decision log rows added |
| `0015_main_website/0015_main_website.md` | § 8.5 worked example updated 5.5%/₱5,500 → 5.0%/₱5,000 |
| `API_Integration_Checklist.md` | Setnayan Pay reprice punch-list item updated |
| `V1_Gap_Analysis_Status.md` | Row #1 Setnayan Pay commission model reframed to flat 5.0% + Option B |
| `App_Build_Status.md` | Row 0034 2026-05-16 entry reframed to flat 5.0% + Option B |
| `CLAUDE.md` | 7+ new decision-log rows for all session decisions |

### CLAUDE.md decision-log rows added this session (chronological)

Search the CLAUDE.md decision log for these dates to find the full row text:

- **2026-05-16 evening** — Setnayan Pay convenience fee 5.5%/6.5% → flat 5.0% + Option B confirmed (3 epochs: 3% retired → 5.5%/6.5% retired → flat 5.0% LIVE)
- **2026-05-16 PM** — Vendor convenience-fee absorption opt-in ("No Convenience Fee" badge)
- **2026-05-17** (first row of day) — V1.5+ vendor disbursement via Maya Bulk Fund Transfer
- **2026-05-17** — V1 launch payment-system scope confirmed (manual QR)
- **2026-05-17** — Payment Options Policy Matrix locked
- **2026-05-17** — Setnayan Pay convenience fee minimum floor ₱50
- **2026-05-17** — V1 SKU lock batch (Panood multi-cam + Papic reactivated + 6 Cam Bridge SKUs + 2 Panood Template Pack SKUs + Save-the-Date Video reprice + 2D billing model + Cost Watch primitive)

---

## Memory files to recreate on the new account

These are user-preference / context files I created in `/Users/icecasasola/.claude/projects/-Users-icecasasola/memory/`. **They won't transfer to a new Claude account automatically. Recreate them on the new account so the new Claude inherits the same disciplines.**

### `project_setnayan_payment_options_policy.md`

```markdown
---
name: Setnayan payment-options policy matrix
description: Admin console must have per-account-type payment-options settings — 4 scopes (Customers / Vendors / Certified Vendors / per-Event override). Surface as a grid in 0023.
type: project
---

Setnayan admin must have a payment-options settings matrix where the admin can enable/disable specific payment methods per account-type scope:

- Customers (couples)
- Vendors (un-certified / coming_soon)
- Certified Vendors (verified)
- Events (per-event override that supersedes the account-type default)

Why: Different account types need different payment options (e.g. premium rails like cards may be off for coming_soon vendors but on for verified vendors; per-event overrides handle special VIP / B2B / industry-event cases that need a non-default rail set). Owner directive 2026-05-17 with "always remember" weight.

How to apply: When working on payment flows, cart options, or the admin console (iteration 0023), surface the policy matrix as a grid view. Schema extends `payment_method_config` with `enabled_for_customers` / `enabled_for_vendors_coming_soon` / `enabled_for_vendors_certified` BOOLEAN columns plus an `event_payment_options_override` join table for per-event scope overrides. V1 has few rails (BDO/GCash QR + Maya QR if active) so the matrix is sparse but the schema is forward-compatible for V1.5+ when Maya Business adds the full rail set.
```

### `feedback_setnayan_latest_spec_priority.md`

```markdown
---
name: Setnayan latest spec state takes priority
description: Always re-check the current service_catalog seed + decision log + Iteration files BEFORE discussing pricing or features. Latest spec wins over earlier session context.
type: feedback
---

When the owner asks about Setnayan pricing or features, do NOT trust earlier-in-session analysis (like a deep-study table from 100 messages ago) — pull the current state from the spec corpus first:

- `0034_payments_and_cart/0034_payments_and_cart.md` → `service_catalog` seed (lines ~65-155) shows the active SKUs + their locked prices + which SKUs are retired (is_active=FALSE)
- `CLAUDE.md` decision log → most-recent date entries supersede earlier ones; pricing changes are typically logged here with "repriced" or "locked" keywords
- The matching iteration folder for the feature being discussed has the canonical narrative

Why: Owner directive 2026-05-17 — "the latest will always be the priority." Prior session deep-study from the Pricing_Magazine.docx anchored on the old one-time-tier model; the V1 reality is now the focused service_catalog SKU set with continuous repricing happening throughout sessions.

How to apply: Before recommending a price change, grep the 0034 service_catalog seed for the SKU code, confirm is_active=TRUE, note the current centavos value, and check CLAUDE.md decision log for any same-session reprices that haven't hit the seed yet.
```

### Other existing memory files (already established before this session)

These were already in place; document them so the new account can recreate them too:

- `project_setnayan.md` — Filipino-first wedding/life-events platform; live at www.setnayan.com; V1 scope locked in spec corpus
- `reference_setnayan_resources.md` — at session start: load spec corpus folder + live site, cross-reference both
- `reference_setnayan_repos.md` — ONE repo (iscasasola/setnayan-platform) holds full monorepo; worktrees under `~/Setnayan/.claude/worktrees/` + `~/.claude/worktrees/agent-*/`
- `feedback_setnayan_pr_auto_merge.md` — always `gh pr merge <num> --auto --merge` right after creating any Setnayan PR; ship-on-green is the standing instruction
- `feedback_responsive_default.md` — always design for both desktop + mobile, use platform-appropriate patterns, don't re-ask
- `feedback_setnayan_edit_first_and_safety.md` — default to direct app edits not spec-corpus churn; never run destructive commands without explicit one-shot confirm
- `project_setnayan_no_wallet.md` — payment is order-and-pay; never surface wallet/balance/tokens UI; iteration 0000's wallet pill is spec drift
- `project_setnayan_event_lifecycle.md` — no self-serve event delete (admin-only via support); adding events IS supported via 0000 event switcher; V1 = Wedding only
- `project_setnayan_dual_role.md` — one users row, multiple roles; self-purchase OK with confirm modal, self-review hard-gated, public stats exclude vendor's own team
- `feedback_setnayan_customer_initiates_chat.md` — only couples can open a thread with a vendor; vendor surfaces only Reply, never cold-DM
- `reference_setnayan_cron_strategy.md` — LOCKED 2026-05-14 (PR #47): no cron for new triggers, use DB state + on-access sweeps; 2 grandfathered pg_cron jobs

---

## Locked guardrails (from session-start hook — still in force)

- **V1 scope is locked.** Flag any feature expansion explicitly and ask the owner to confirm before producing code.
- **Pricing is PHP centavos** in `service_catalog` (iteration 0034 service_catalog seed). In-app tokens render at 30/₱1. Do not quote USD or invent prices.
- **NO wallet UI.** Payment is order-and-pay only (per iteration 0034). The "Token wallet pill" referenced in iteration 0000 is spec drift — do not implement.
- **Responsive by default** — design for desktop AND mobile with platform-appropriate patterns.
- **Edit-first over spec-corpus churn** — default to direct app edits not spec-corpus expansion.
- **Never run destructive commands** (rm, reset --hard, branch -D, session delete) without explicit one-shot confirm.

---

## End of handoff

This document is the single source of truth for what happened in the pricing/payments session 2026-05-16 evening + 2026-05-17. The new Claude should treat the spec corpus + this document as canonical and only ask the owner about NEW work going forward — every decision listed here is locked.

The companion handoff `2026-05-17_Session_Handoff.md` covers the parallel event-change-flow work (iteration 0021 §§ 10–13) — read both for complete context if the user is picking up from anywhere in the broader 2026-05-17 day.

If the new Claude has questions about anything in this doc, the canonical references are listed inline. **Always re-check the live spec state before recommending changes — latest wins.**
