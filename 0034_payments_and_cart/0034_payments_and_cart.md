# Iteration 0034 — Payments & Cart Flow

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - **Apply-then-pay core is REAL and shipped — but on a leaner schema/flow.** Couple add-on checkout: `app/dashboard/[eventId]/checkout/actions.ts` `submitOrderAction` writes an `orders` row at `status='submitted'` + a `payments` row at `status='pending'` with screenshot upload. Admin approves at `/admin/payments` (`approvePayment`, `promote_order`) → `payments='matched'` + `orders='paid'`. That admin click is the only "paid" lever — **zero real money moves**. The canonical tables in code are `orders` / `payments` (not the spec's 8-table `service_orders` / `service_order_payments` / `carts` / `cart_items` set verbatim; statuses are `submitted`/`pending`/`matched`/`paid`, not the § 2.5 `pending_payment`/`proof_submitted`/… enum).
> - **Setnayan Pay convenience fee is RETIRED (2026-05-28 V2 cutover).** Per `app/admin/payments/actions.ts`: the 5% (and earlier 3%/5.5%/6.5%) Setnayan Pay convenience-fee dispatcher is retired; vendor↔customer money is **off-platform with 0% commission**. The § 2 `fees_centavos` / `setnayan_fee_bps` 5% line item and the "Setnayan Pay 3% fee" framing are dead. Vendor↔customer money never flows through the cart (RA 11967).
> - **No fixed in-app SKU price list in the DB the way § 2 seeds it.** SKUs/catalog live in `lib/v2-catalog.ts` with build states (`live`/`in_build`/`coming_soon`/`not_built`); prices/SKUs match the live site (e.g. Animated Monogram ₱2,499, Papic ₱2,999, Pakanta single ₱2,499 `not_built`), NOT the retired charm-ladder INSERT batches (paparazzi_3/5_seats, Concierge, Guided Planner ladder, live_stream_*) that dominate this spec.
> - **Vendor token economy is LIVE and is the live-checkout's main "wallet"** — burn-on-answer wired (1–3 tokens / ₱100–₱300, `token_burn_bands`, PR #1057). The customer token wallet (0003) stays **retired**. The 2026-06-04 reconciliation block below correctly flags the vendor tokens but predates the burn-on-answer wiring.
> - **Comp/self-comp:** comp grants + internal/team flags exist but do **not** auto-pay an add-on order (the inline drawer ignores them); only `createSelfCompOrder` (vendor team owners) mints a comp'd paid order. The § 3.1a 12-per-quarter self-comp trigger is not the shipped mechanism.
>
> When this body disagrees with the above, **the above wins.**

> **⚠ LIVE-SITE RECONCILIATION 2026-06-04.** A **vendor-side token economy is now LIVE on setnayan.com** — this iteration's "token wallet fully retired / PHP-only everywhere" assumption is no longer complete. Vendors buy token packs (4/₱1,000 · 10/₱2,400 · 25/₱5,500 · 50/₱10,000 · 100/₱18,000), receive 100 complimentary tokens on verification, and redeem them against any "Token Worthy" couple SKU at a dashboard-set rate. Customer-side stays apply-then-pay PHP (no customer wallet). The cart/reconciliation schema must accommodate vendor token balances + token-redemption as a payment path. See `Pricing.md § 0.C`. ⚠ Site also contradicts itself on vendor commission (0% vs flat 5% Setnayan Pay) — `Pricing.md § 0.1`.

- **Surface:** Customer cart (lives inside 0021 services launcher) + Admin reconciliation (lives inside 0023 § 3.3 Payments & Activations)
- **Status:** drafted 2026-05-12
- **Builds on:** 0000 (users + auth) · 0006 (vendor records via `event_vendor_relationships`) · 0013 (platform stack — Supabase + R2)
- **Provides to downstream iterations:**
  - 0021 (cart drawer UI + customer order-status page)
  - 0022 (vendor-side pricing display + Setnayan Pay convenience fee surfacing)
  - 0023 (admin reconciliation queue + decision buttons)
  - 0026 (Official Receipts triggered on `status = 'paid'`)
  - 0028 (`payment_instructions`, `payment_confirmed`, `payment_proof_rejected`, `refund_processed` email templates)
  - 0032 (`contract_purchases` rows link via `order_id` FK)
  - § 9.1 admin role authority — references `service_orders.status` transitions
  - § 10a internal-account comp routing
  - § 10b team-pool consumption

---

## 1. Why this iteration exists

V1 ships with **no automated payment processing**. The token wallet (the previous iteration 0003) is retired as of 2026-05-11. PayMongo evaluation and GCash Merchant API automation are V1.5 candidates, not V1. Every paid SKU in V1 — Save-the-Date renders, Paparazzi seat packs, Pro Camera Bridge, Custom Monogram Pack, Live Stream base + add-ons, AI Highlight rendering, Pro widgets, contract intelligence upgrades, Vendor Pro Weekly subscriptions, and Setnayan Pay-routed vendor bookings — flows through one canonical loop:

1. **Customer adds items to cart** (cart bubble in the chrome of every dashboard surface)
2. **Customer reviews cart and taps Checkout**
3. **Setnayan displays a payment screen** with two QR code tabs (BDO Bank Transfer · GCash) + a unique reference code + the order total
4. **Customer scans the QR with their bank or GCash app**, completes the transfer outside Setnayan, includes the reference code in the transfer note
5. **Customer returns to Setnayan and uploads a screenshot** of the payment-confirmation screen
6. **Admin (Transactions Handler or Payments Handler role per § 9.1 single-admin authority)** receives the submission in the reconciliation queue
7. **Admin opens their own Setnayan BDO/GCash inbox side-by-side with the customer's screenshot**, matches the amount + reference code + timestamp
8. **Admin presses one of three buttons:**
   - **Approve** → order activates, service-activation hooks fire (insert paparazzi_seats × N, set event-wide monogram flag, etc.), Official Receipt PDF generated per 0026, `payment_confirmed` email sent per 0028
   - **Reject — needs more proof** → customer's order stays open, they can resubmit a clearer screenshot
   - **Reject permanently** → order closes, customer must start a new order if they still want the service

24-hour SLA target for admin reconciliation. V1.5 may collapse this to minutes via automated bank-API integration.

The token wallet is gone. Charm pricing is the new convention (decision 2026-05-12). Every SKU is PHP-denominated, stored as centavos to dodge float arithmetic, and displayed as `₱X,XXX` everywhere. Token math is not part of V1.

---

## 2. The 8-table canonical schema

The full payment + cart spine is 8 tables. They are declared here as the single source of truth; references from other iterations (0021 cart UI, 0023 reconciliation queue, 0026 OR generation) link back to this iteration.

```sql
-- ============================================================
-- 0034.1: service_catalog — master price list for every in-app SKU
-- ============================================================
CREATE TABLE service_catalog (
  sku_code            TEXT PRIMARY KEY,           -- 'paparazzi_3_seats', 'save_the_date_render', etc.
  name                TEXT NOT NULL,
  description         TEXT NOT NULL,
  category            TEXT NOT NULL,              -- 'paparazzi', 'panood', 'save_the_date', 'contract', 'pro_widget', etc.
  price_php_centavos  INT NOT NULL,               -- price stored in centavos to avoid float
  is_multi_purchase   BOOLEAN NOT NULL DEFAULT FALSE,  -- e.g., per-template add-ons can be bought multiple times
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  effective_from      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_until     TIMESTAMPTZ,                -- nullable; null = currently active
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT price_positive CHECK (price_php_centavos >= 0)
);

CREATE INDEX idx_service_catalog_active ON service_catalog(is_active, category) WHERE is_active = TRUE;

-- Seed values (charm-priced 2026-05-12; centavos = pesos × 100):
INSERT INTO service_catalog (sku_code, name, description, category, price_php_centavos, is_multi_purchase) VALUES
  ('paparazzi_3_seats',           '3 Paparazzi Pack',           '3 app seats per event',                              'paparazzi',         149900, FALSE),
  ('paparazzi_5_seats',           '5 Paparazzi Pack',           '5 app seats per event',                              'paparazzi',         249900, FALSE),
  ('template_unlock',             'Template Unlock (per template)', 'Unlocks one Personal Reel template',             'template',           19900, TRUE),
  ('save_the_date_render',        'Save-the-Date Render',       'One render in all 3 formats (16:9 / 1:1 / 9:16)',     'save_the_date',       4900, TRUE),
  ('pro_camera_bridge_seat',      'Pro Camera Bridge (per DSLR seat)', 'WiFi-SDK pairing for Canon/Nikon/Sony/Fujifilm', 'paparazzi',     149900, TRUE),
  ('pro_widget_hero',             'Pro Widget — Hero',          'Pro tier for Hero invitation widget',                'pro_widget',          9900, FALSE),
  ('pro_widget_story',            'Pro Widget — Our Story',     'Pro tier for Our Story invitation widget',           'pro_widget',          9900, FALSE),
  ('pro_widget_schedule',         'Pro Widget — Schedule',      'Pro tier for Schedule invitation widget',            'pro_widget',          9900, FALSE),
  ('pro_widget_bundle',           'Pro Bundle (all 3 widgets)', 'All three Pro widgets in one purchase',              'pro_widget',         19900, FALSE),
  ('live_stream_base',            'Live Stream — Base',         '1 broadcaster + 3 cameras + 3 hours',                 'panood',           249900, FALSE),
  ('live_stream_camera_addon',    'Live Stream — +1 Camera',    'One additional camera slot (max +2)',                 'panood',            99900, TRUE),
  ('live_stream_hour_addon',      'Live Stream — +1 Hour',      'One additional hour of stream capacity',              'panood',            99900, TRUE),
  ('custom_monogram_pack',        'Custom Monogram Pack',       'Remove Setnayan watermark — event-wide',              'monogram',         199900, FALSE),
  ('broadcast_style_pack',        'Broadcast Style Pack',       '4 modes: News / Cinematic / Sports / Royalty',        'panood',           299900, FALSE),
  ('ai_video_highlight_60s',      'AI Video Highlight (60s)',   'AI-generated 60-second highlight reel',                'ai_highlight',     199900, TRUE),
  ('ai_edited_highlight_3min',    'AI Edited Highlight (3-min)','Themed multi-segment 3-minute polished reel',          'ai_highlight',     349900, TRUE),  -- ₱3,499 locked 2026-05-16 (was ₱4,999)
  ('contract_intelligence_upgrade','Contract Intelligence (per contract)', 'Per-contract AI analysis + e-sig flow',     'contract',          19900, TRUE),
  ('vendor_pro_weekly',           'Vendor Pro Weekly',          'Vendor analytics + custom plan builder + branding',    'vendor_subscription', 49900, FALSE),
  ('sponsored_boost_weekly',      'Sponsored Boost (per week)', 'Marketplace ranking boost (Certified vendors only)',   'vendor_subscription',149900, TRUE),
  -- Guided Planner — added 2026-05-14 per CLAUDE.md decision log entry
  ('guided_planner_1week',        'Guided Planner — 1-Week Pass','7-day access to the Guided Planner assistant',         'guided_planner',      9900, TRUE),
  ('guided_planner_3month',       'Guided Planner — 3-Month Plan','13-week access · saves 22% vs week-by-week',          'guided_planner',     99900, TRUE),
  ('guided_planner_12month',      'Guided Planner — 12-Month Plan','52-week access · saves 61% vs week-by-week · BEST VALUE','guided_planner',199900, TRUE);

-- ============================================================
-- 2026-05-16 V1 SKU lock batch — Papic V1.5+ architecture lock · Panood BYO YouTube ·
-- Save-the-Date Video reintroduction · Patiktok dual-tier (per CLAUDE.md decision log
-- 2026-05-16 rows 3-6). Marketplace commission SKUs INTENTIONALLY EXCLUDED from this
-- batch — separate commit pending. Run as ALTER + INSERT in a single transaction:
-- ============================================================

-- (a) Panood — Cloudflare-composite SKUs retired (architecture pivoted to BYO YouTube)
UPDATE service_catalog SET is_active = FALSE WHERE sku_code IN (
  'live_stream_base',          -- ₱2,499 (retired 2026-05-16 · Cloudflare composite gone)
  'live_stream_camera_addon',  -- ₱999 (retired 2026-05-16 · replaced by panood_camera_sync_daily ₱99/day)
  'live_stream_hour_addon',    -- ₱999 (retired 2026-05-16 · hour-based pricing replaced by per-day)
  'broadcast_style_pack'       -- ₱2,999 (retired 2026-05-16 · ffmpeg-overlay composites gone with composite step)
);

-- (b) Pro Camera Bridge folded into 5-Paparazzi pack capability (no longer standalone SKU)
UPDATE service_catalog SET is_active = FALSE WHERE sku_code = 'pro_camera_bridge_seat';

-- (c) New SKU rows from the 2026-05-16 batch:
INSERT INTO service_catalog (sku_code, name, description, category, price_php_centavos, is_multi_purchase, is_active) VALUES
  -- Panood — V1 (locked 2026-05-16 · BYO YouTube via OAuth)
  ('panood_daily_broadcast',         'Panood — Daily Broadcast',         'One day of broadcasting to couple''s own YouTube · single-cam by default',    'panood',         49900, TRUE,  TRUE),
  ('panood_camera_sync_daily',       'Panood — Camera Sync (per day)',   'Multi-cam switching add-on for one day · pairs with Daily Broadcast',         'panood',          9900, TRUE,  TRUE),
  ('panood_annual_streaming',        'Panood — Annual Streaming',        'Single-cam unlimited days for one year · vendor-friendly',                    'panood',        299900, TRUE,  TRUE),
  ('panood_annual_streaming_plus',   'Panood — Annual Streaming Plus',   'Multi-cam unlimited days for one year · includes Camera Sync built-in',        'panood',        399900, TRUE,  TRUE),

  -- Save-the-Date Video — V1 (reintroduced 2026-05-16 · DIFFERENT product from retired save_the_date_render)
  ('save_the_date_video_render',     'Save-the-Date Video',              'AI-auto-edit 30-60s vertical MP4 from 5-10 engagement photos · Setnayan-owned music · landing-page end-card', 'save_the_date_video', 9900, TRUE, TRUE),

  -- Patiktok — V1 (locked 2026-05-16 · dual-tier per-day model)
  ('patiktok_setnayan_daily',        'Patiktok — Setnayan TikTok (per day)','Per-day Patiktok booth · auto-post to @SetnayanWeddings · Setnayan keeps ad-revenue upside', 'patiktok', 99900, TRUE, TRUE),
  ('patiktok_personal_daily',        'Patiktok — Personal TikTok (per day)','Per-day Patiktok booth · BYO TikTok via OAuth · couple owns videos + ad revenue',    'patiktok',       199900, TRUE,  TRUE),
  ('patiktok_video_overage',         'Patiktok — Video Overage (+10)',   'In-event +10 video allotment on top of 40/day soft cap · multi-stack',         'patiktok',        4900, TRUE,  TRUE),

  -- Papic — V1.5+ (architecture locked 2026-05-16; SKUs deferred to V1.5+ via is_active=FALSE)
  ('paparazzi_camera_addon',         'Papic — Camera Add-on (per seat)', 'One additional paid paparazzi seat · multi-purchase · DSLR-capable',           'paparazzi',      99900, TRUE,  FALSE),
  ('paparazzi_credits_addon',        'Papic — Credits Add-on (+1,000)',  '+1,000 pool credits · multi-purchase · in-event upsell at 80% pool warning',    'paparazzi',      29900, TRUE,  FALSE),
  ('premium_guest_camera_pack',      'Papic — Premium Guest Camera Pack','Event-wide · every guest gets Lifetime Archive + Drive sync + Auto-Recap + watermark-free downloads + HD video upload', 'paparazzi', 149900, FALSE, FALSE),
  ('personal_album_per_guest',       'Papic — Personal Album (per guest)','Per-guest digital album · opt-in per guest · multi-purchase per event',         'paparazzi',       4900, TRUE,  FALSE),
  ('memory_book_per_guest',          'Papic — Memory Book (per guest)',  'Per-guest printable hardcover memory book PDF · opt-in per guest · multi-purchase', 'paparazzi',     24900, TRUE,  FALSE);

-- (d) Papic existing seats also deferred to V1.5+ (architecture locked, build deferred)
UPDATE service_catalog SET is_active = FALSE WHERE sku_code IN (
  'paparazzi_3_seats',         -- ₱1,499 · 5K pool · architecture locked 2026-05-16, build V1.5+
  'paparazzi_5_seats',         -- ₱2,499 · 10K pool · architecture locked 2026-05-16, build V1.5+
  'template_unlock'            -- ₱49 · gated to Papic native build; deferred with Papic V1.5+
);

-- (e) Save-the-Date Render (retired 2026-05-16 · DIFFERENT product from new save_the_date_video_render)
UPDATE service_catalog SET is_active = FALSE WHERE sku_code = 'save_the_date_render';

-- (f) Guided Planner 3-tier ladder retired 2026-05-16 · replaced by Setnayan Concierge 2-tier premium model
--     (CLAUDE.md decision log fifteenth 2026-05-16 row · iteration 0016 § 0)
UPDATE service_catalog SET is_active = FALSE WHERE sku_code IN (
  'guided_planner_1week',      -- ₱99 (retired 2026-05-16 · ₱99 floor anchored brand as "cheap app"; replaced by card-less 7-day preview)
  'guided_planner_3month',     -- ₱999 (retired 2026-05-16 · replaced by concierge_essentials ₱2,499)
  'guided_planner_12month'     -- ₱1,999 (retired 2026-05-16 · replaced by concierge_complete ₱4,999 → ₱2,499 since 2026-05-18 sixth row)
);

-- (g) Setnayan Concierge V1 SKUs (originally seeded 2026-05-16 as 2-tier; simplified 2026-05-17 to single-SKU · Essentials retired same-week · card-less 3-day trial is NOT an SKU, handled by server action)
INSERT INTO service_catalog (sku_code, name, description, category, price_php_centavos, is_multi_purchase, is_active) VALUES
  ('concierge_essentials',           'Setnayan Concierge — Essentials',  '6-month access · core 9-step roadmap · weekly nudges · standard vendor matching',                            'concierge',     249900, TRUE,  FALSE),  -- retired 2026-05-17 · single-SKU model adopted (Essentials projected to under-convert vs Complete; "save face" tier diluted premium framing)
  ('concierge_complete',             'Setnayan Concierge',               'Wedding-anchored access (12mo floor · 24mo cap · per event) · active wizard with intake/foundation-first/saturation-aware vendor recs · Next Actions feed · vendor share packs · coordinator delegation · honeymoon planning · unlimited brain Q&A · free if you book any Pro Weekly vendor (per 0016 § 0c)',     'concierge',     249900, TRUE,  TRUE);
-- ============================================================
-- price_centavos updated 2026-05-18 sixth decision-log row: 499900 → 249900 (₱4,999 → ₱2,499)
-- supersedes the 2026-05-17 ₱4,999 lock; rationale = "always helping" north-star · architecture commoditized inference cost to ~₱1/couple steady-state · Pro Weekly bundle aligns vendor + platform incentives · description rewritten to reflect wizard architecture (was "9-step roadmap" framing)
-- ============================================================
-- ============================================================

-- ============================================================
-- 2026-05-17 vendor SKU catch-up batch — seeds the vendor-side SKUs locked in
-- CLAUDE.md decision-log eighth 2026-05-16 row but not seeded at the time.
-- All prices charm-corrected to -1 ending per COWORK.md line 75 (rule supersedes
-- the round-number values in the row-8 prose; row 8 amended in place same-day to
-- match the charm prices below).
-- ============================================================

-- (h) Retire the weekly Sponsored Boost (superseded by quarterly/annual long-commit tiers)
UPDATE service_catalog SET is_active = FALSE WHERE sku_code = 'sponsored_boost_weekly';
-- ₱1,499/wk (retired 2026-05-16 per 8th row · replaced by sponsored_boost_quarterly + sponsored_boost_annual below)

-- (i) New vendor-side SKUs (2026-05-17 catch-up · all charm-corrected -1)
INSERT INTO service_catalog (sku_code, name, description, category, price_php_centavos, is_multi_purchase, is_active) VALUES
  -- All Tools Unlock (capability bundle · open to all paying vendors · not verified-only)
  ('all_tools_unlock_annual',        'All Tools Unlock (per year)',        'Annual bundle · Mood Board + Palette + Seating Arrangement + QR Reader + Advanced Pricing Tier · saves ~61% vs à-la-carte ₱99/wk × 5 tools × 52 weeks',                                                  'vendor_subscription',   999900, FALSE, TRUE),

  -- Boosted Ads — weekly · verified-only · stacks with Pro Weekly · cancel anytime
  ('boosted_ads_5km_weekly',         'Boosted Ads — 5km radius (per week)','Marketplace ranking boost within 5km radius · verified-only · stacks with Pro Weekly',                  'vendor_subscription',   499900, TRUE,  TRUE),
  ('boosted_ads_10km_weekly',        'Boosted Ads — 10km radius (per week)','Marketplace ranking boost within 10km radius · verified-only · stacks with Pro Weekly',                'vendor_subscription',   799900, TRUE,  TRUE),
  ('boosted_ads_20km_weekly',        'Boosted Ads — 20km radius (per week)','Marketplace ranking boost within 20km radius · verified-only · stacks with Pro Weekly',                'vendor_subscription',  1499900, TRUE,  TRUE),

  -- Sponsored Boost long-commit · 30km radius · verified-only · stacks with everything (Quarterly = 3 months · Annual = 12 months · ~20% savings vs Quarterly × 4)
  ('sponsored_boost_quarterly',      'Sponsored Boost — Quarterly',        'Premium marketplace placement · 30km radius · verified-only · 3-month commit',                          'vendor_subscription', 24999900, FALSE, TRUE),
  ('sponsored_boost_annual',         'Sponsored Boost — Annual',           'Premium marketplace placement · 30km radius · verified-only · 12-month commit · ~20% savings vs Quarterly × 4', 'vendor_subscription', 79999900, FALSE, TRUE),

  -- Vendor Verification fees (initial = FREE absorbed by Setnayan · annual renewal + post-demotion re-verification)
  ('vendor_verification_annual_renewal',     'Vendor Verification — Annual Renewal',         'Annual re-verification fee (initial verification is free · renews per Vendor Agreement § 3.1)',          'vendor_verification',  149900, FALSE, TRUE),
  ('vendor_verification_reverification',     'Vendor Verification — Re-verification (post-demotion)', 'Re-verification fee after demotion (3+ disputes in rolling 30 days · multi-purchase across lifecycle)', 'vendor_verification',  249900, TRUE,  TRUE);
-- ============================================================

-- ============================================================
-- 2026-05-17 V1 SKU lock batch — Pricing & Frequency overhaul
-- Adds two-dimensional billing model (time × event scope), reactivates Papic
-- seats + Pro Camera Bridge under product-scoped pricing, pivots Panood to
-- always-multi-cam (max 6) with collapsed SKU set, adds Cam Bridge across all
-- three production products (Papic / Panood / Patiktok), adds Panood Template
-- Pack, reprices Save-the-Date Video. See CLAUDE.md 2026-05-17 decision log.
-- ============================================================

-- (h) Schema additions: two-dimensional billing model
--     time_recurrence — how often money flows (one-time vs recurring cadence)
--     event_scope     — whether the SKU applies to one event or all events on the account
ALTER TABLE service_catalog
  ADD COLUMN time_recurrence TEXT NOT NULL DEFAULT 'one_time'
    CHECK (time_recurrence IN ('one_time','weekly','quarterly','annual','lifetime')),
  ADD COLUMN event_scope TEXT NOT NULL DEFAULT 'per_event'
    CHECK (event_scope IN ('per_event','all_events'));

-- (i) Reactivate Papic seats + +1 seat add-on (HTML-based capture, unlimited guests behind the scenes; seat count = official paparazzi UX limit)
UPDATE service_catalog SET is_active = TRUE
  WHERE sku_code IN ('paparazzi_3_seats','paparazzi_5_seats','paparazzi_camera_addon');

-- (j) Panood always-multi-cam pivot — max 6 cameras enforced via Cloudflare Stream Live SFU room config max_publishers=6
UPDATE service_catalog
SET is_active = TRUE,
    price_php_centavos = 249900,                          -- ₱2,499/day (was ₱499)
    description = 'Multi-cam (up to 6) broadcast for one event-day · couple BYO YouTube via OAuth'
  WHERE sku_code = 'panood_daily_broadcast';

UPDATE service_catalog
SET is_active = TRUE,
    price_php_centavos = 1999900,                         -- ₱19,999/year (was ₱2,999)
    description = 'Multi-cam (up to 6) unlimited days for one year · ALL events on the account · vendor / competition-organizer / multi-event subscription',
    time_recurrence = 'annual',
    event_scope = 'all_events'
  WHERE sku_code = 'panood_annual_streaming';

-- (k) Retire Panood SKUs collapsed by always-multi-cam pivot
UPDATE service_catalog SET is_active = FALSE
  WHERE sku_code IN ('panood_camera_sync_daily','panood_annual_streaming_plus');

-- (l) Save-the-Date Video reprice (₱99 → ₱199 · per Cost Watch math, see § 6.X cost-basis discussion)
UPDATE service_catalog
SET price_php_centavos = 19900                            -- ₱199/render (was ₱99)
  WHERE sku_code = 'save_the_date_video_render';

-- (m) Backfill time_recurrence + event_scope for existing recurring SKUs (vendor subscriptions)
UPDATE service_catalog
SET time_recurrence = 'weekly', event_scope = 'all_events'
  WHERE sku_code IN ('vendor_pro_weekly','sponsored_boost_weekly');

-- All other previously-active SKUs default to ('one_time','per_event') via ALTER DEFAULT — no UPDATE needed.

-- (n) New Cam Bridge SKUs — 6 product-scoped tiers (DSLR pairing via WiFi-SDK in the Papic-binary native app)
INSERT INTO service_catalog (sku_code, name, description, category, price_php_centavos, is_multi_purchase, is_active, time_recurrence, event_scope) VALUES
  -- Panood Cam Bridge — single tier, premium per-slot pricing (live-broadcast quality)
  ('panood_cam_bridge_slot_day',       'Panood — Cam Bridge (per slot/day)',     'DSLR-paired camera slot for Panood broadcast, one event-day · WiFi-SDK via Papic-binary native app',           'panood',     19900, TRUE,  TRUE, 'one_time', 'per_event'),

  -- Papic Cam Bridge — 3 tiers (per-slot/day, flat all-slots/day, all-slots annual)
  ('papic_cam_bridge_slot_day',        'Papic — Cam Bridge (per slot/day)',      'DSLR-paired Papic seat, one event-day',                                                                       'paparazzi',   9900, TRUE,  TRUE, 'one_time', 'per_event'),
  ('papic_cam_bridge_all_slots_day',   'Papic — Cam Bridge (all slots/day)',     'DSLR pairing for all Papic seats, one event-day · flat rate · breaks even vs per-slot at ≥3 DSLRs',           'paparazzi',  24900, TRUE,  TRUE, 'one_time', 'per_event'),
  ('papic_cam_bridge_all_slots_annual','Papic — Cam Bridge (all slots/year)',    'DSLR pairing for all Papic seats, unlimited events for one year · vendor / wedding-photographer subscription','paparazzi',  249900, FALSE, TRUE, 'annual',   'all_events'),

  -- Patiktok Cam Bridge — 2 tiers (flat daily, annual)
  ('patiktok_cam_bridge_day',          'Patiktok — Cam Bridge (per day)',        'DSLR pairing for Patiktok booth, one event-day · flat rate',                                                  'patiktok',    4900, TRUE,  TRUE, 'one_time', 'per_event'),
  ('patiktok_cam_bridge_annual',       'Patiktok — Cam Bridge (per year)',       'DSLR pairing for Patiktok booth, unlimited events for one year',                                              'patiktok',   24900, FALSE, TRUE, 'annual',   'all_events');

-- (o) New Panood Template Pack SKUs — overlays / titles / transitions for the broadcast output (applies to phone-cam AND Cam-Bridge-DSLR feeds equally)
INSERT INTO service_catalog (sku_code, name, description, category, price_php_centavos, is_multi_purchase, is_active, time_recurrence, event_scope) VALUES
  ('panood_template_pack_daily',  'Panood — Template Pack (per day)',  'Overlays + titles + transitions on the Panood broadcast output, one event-day',                                  'panood',  79900, TRUE,  TRUE, 'one_time', 'per_event'),
  ('panood_template_pack_annual', 'Panood — Template Pack (per year)', 'Overlays + titles + transitions, unlimited days for one year · ALL events on the account · pro-broadcaster pack', 'panood', 799900, FALSE, TRUE, 'annual',   'all_events');

-- (p) service_catalog_price_history extended for frequency audit (separate from price changes)
ALTER TABLE service_catalog_price_history
  ADD COLUMN prior_time_recurrence TEXT,
  ADD COLUMN new_time_recurrence   TEXT,
  ADD COLUMN prior_event_scope     TEXT,
  ADD COLUMN new_event_scope       TEXT;

-- ============================================================
-- 0034.X: service_render_costs — Cost Watch feature (locked 2026-05-17)
-- Tracks actual per-render Setnayan-incurred cost (AI API + FFmpeg + storage +
-- bandwidth) for every SKU consumption. Drives the admin Pricing & Catalog
-- Cost Watch UI: highest single render / avg / p95 / cost-to-price ratio /
-- health flag. Pricing decisions take "highest single render" as the floor.
-- ============================================================
CREATE TABLE service_render_costs (
    render_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku_code         TEXT NOT NULL REFERENCES service_catalog(sku_code),
    order_id         UUID REFERENCES service_orders(order_id),     -- NULL for failed renders or free/comp grants
    user_id          UUID REFERENCES users(user_id),
    event_id         UUID REFERENCES events(event_id),
    cost_centavos    INT NOT NULL,                                  -- actual Setnayan-incurred cost for this single render
    cost_breakdown   JSONB NOT NULL,                                -- e.g. { ai_api: 500, ffmpeg: 200, storage: 100, bandwidth: 50, music_license: 0 }
    rendered_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    succeeded        BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_render_costs_sku ON service_render_costs(sku_code, rendered_at DESC);
CREATE INDEX idx_render_costs_event ON service_render_costs(event_id);

-- Aggregation for admin UI (refreshed hourly via pg_cron or on-access sweep)
CREATE MATERIALIZED VIEW service_catalog_cost_watch AS
SELECT
  sku_code,
  COUNT(*)                                                                          AS renders_count,
  MAX(cost_centavos)                                                                AS highest_single_render_centavos,
  ROUND(AVG(cost_centavos))                                                         AS avg_render_centavos,
  ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY cost_centavos))::INT           AS p95_render_centavos,
  MAX(rendered_at)                                                                  AS latest_render_at,
  (SELECT cost_breakdown FROM service_render_costs s2
   WHERE s2.sku_code = s1.sku_code AND s2.succeeded = TRUE
   ORDER BY cost_centavos DESC LIMIT 1)                                             AS highest_render_breakdown
FROM service_render_costs s1
WHERE succeeded = TRUE AND rendered_at > NOW() - INTERVAL '90 days'
GROUP BY sku_code;

-- ============================================================
-- 0034.2: service_catalog_price_history — audit trail for price changes
-- ============================================================
-- Mid-quarter SKU price changes require two-admin approval per § 9.1.
-- This table is the audit record for those changes, plus it backs Official Receipt
-- voiding/replacement per 0026 (an OR generated when the SKU was ₱4,900 must be
-- voided + reissued if the price changes before the customer pays).
CREATE TABLE service_catalog_price_history (
  history_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_code              TEXT NOT NULL REFERENCES service_catalog(sku_code),
  prior_price_centavos  INT NOT NULL,
  new_price_centavos    INT NOT NULL,
  changed_by_admin      UUID NOT NULL REFERENCES users(user_id),
  changed_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_from        TIMESTAMPTZ NOT NULL,
  two_admin_approval_id UUID,  -- references admin_approval_requests(approval_id) when applicable
  rationale             TEXT NOT NULL
);

CREATE INDEX idx_price_history_sku ON service_catalog_price_history(sku_code, effective_from DESC);

-- ============================================================
-- 0034.3: carts — pre-checkout state, one active cart per user
-- ============================================================
CREATE TABLE carts (
  cart_id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES users(user_id),
  event_id                UUID REFERENCES events(event_id),  -- nullable; carts can be event-scoped or account-scoped
  status                  TEXT NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active','checking_out','converted_to_order','abandoned')),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  converted_to_order_id   UUID  -- FK to service_orders.order_id, set when cart converts
);

-- One active cart per user. The partial unique index enforces this.
CREATE UNIQUE INDEX idx_carts_one_active_per_user
  ON carts(user_id)
  WHERE status = 'active';

CREATE INDEX idx_carts_user_updated ON carts(user_id, updated_at DESC);

-- ============================================================
-- 0034.4: cart_items — line items in an active cart
-- ============================================================
CREATE TABLE cart_items (
  cart_item_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id                 UUID NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
  sku_code                TEXT NOT NULL REFERENCES service_catalog(sku_code),
  quantity                INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_centavos     INT NOT NULL,  -- snapshot at add-to-cart time (protects against mid-shopping price changes)
  metadata                JSONB,         -- e.g., per-Save-the-Date template_id, per-Papic seat assignments
  added_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

-- ============================================================
-- 0034.5: service_orders — locked-in order at checkout
-- ============================================================
CREATE TABLE service_orders (
  order_id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code          TEXT UNIQUE NOT NULL,  -- 10-char Crockford base 32, e.g., 'S89O-A4F2K9R7BX'
  user_id                 UUID NOT NULL REFERENCES users(user_id),
  event_id                UUID REFERENCES events(event_id),
  cart_id                 UUID NOT NULL REFERENCES carts(cart_id),
  subtotal_centavos       INT NOT NULL,           -- sum of cart_items.unit_price_centavos * quantity
  fees_centavos           INT NOT NULL DEFAULT 0, -- Setnayan Pay convenience fee (flat 5.0%, admin-configurable per method, 2026-05-16 lock supersedes earlier same-day 5.5%/6.5%); on vendor-booking orders only
  total_centavos          INT NOT NULL,           -- subtotal + fees
  payment_method          TEXT NOT NULL CHECK (payment_method IN ('bdo_bank','gcash','setnayan_pay','comp_grant')),
  status                  TEXT NOT NULL DEFAULT 'pending_payment'
                          CHECK (status IN (
                            'pending_payment',         -- customer has checked out, hasn't uploaded proof yet
                            'proof_submitted',         -- screenshot uploaded, awaiting admin review
                            'verification_in_progress',-- admin is actively reviewing
                            'paid',                    -- admin approved, services unlocked
                            'rejected',                -- admin rejected; customer can resubmit if not permanent
                            'cancelled',               -- customer cancelled before payment
                            'refunded',                -- post-paid refund processed
                            'expired'                  -- 7-day expiry on pending_payment with no submission
                          )),
  comp_grant_id           UUID REFERENCES comp_grants(grant_id),  -- populated for § 10a internal or § 10b team-pool comps
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  checked_out_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at                 TIMESTAMPTZ,
  rejected_at             TIMESTAMPTZ,
  expires_at              TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  CONSTRAINT order_total_consistent CHECK (total_centavos = subtotal_centavos + fees_centavos)
);

CREATE INDEX idx_orders_user_status ON service_orders(user_id, status, created_at DESC);
CREATE INDEX idx_orders_status_pending ON service_orders(status) WHERE status IN ('proof_submitted','verification_in_progress');
CREATE INDEX idx_orders_reference ON service_orders(reference_code);
CREATE INDEX idx_orders_expiry ON service_orders(expires_at) WHERE status = 'pending_payment';

-- ============================================================
-- 0034.6: service_order_items — immutable line items locked at checkout
-- ============================================================
-- Snapshots cart_items at checkout time. After order conversion, cart_items
-- are read-only; service_order_items become the authoritative billing record
-- and feed Official Receipt generation per 0026.
CREATE TABLE service_order_items (
  order_item_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                UUID NOT NULL REFERENCES service_orders(order_id) ON DELETE CASCADE,
  sku_code                TEXT NOT NULL REFERENCES service_catalog(sku_code),
  quantity                INT NOT NULL,
  unit_price_centavos     INT NOT NULL,
  metadata                JSONB
);

CREATE INDEX idx_order_items_order ON service_order_items(order_id);

-- ============================================================
-- 0034.7: service_order_payments — payment-proof submissions
-- ============================================================
-- One order can have multiple payment rows if rejected + resubmitted.
-- resubmission_count = 0 for first attempt; increments on each resubmission.
CREATE TABLE service_order_payments (
  payment_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                UUID NOT NULL REFERENCES service_orders(order_id),
  method                  TEXT NOT NULL CHECK (method IN ('bdo_bank','gcash')),
  amount_centavos         INT NOT NULL,
  reference_code          TEXT,  -- bank/GCash transaction reference shown on the screenshot
  payer_account_number    TEXT,  -- normalized GCash mobile or bank account number, populated by § 11 reconciliation matcher; used by 0006 self-review gate
  proof_screenshot_r2_key TEXT NOT NULL,  -- R2 path: 'payment_proofs/{order_id}/{payment_id}.jpg'
  submitter_notes         TEXT,
  submitted_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_by_admin       UUID REFERENCES users(user_id),
  reviewed_at             TIMESTAMPTZ,
  decision                TEXT CHECK (decision IN ('approved','rejected','needs_more_proof')),
  decision_reason         TEXT,
  resubmission_count      INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_payments_order ON service_order_payments(order_id, submitted_at DESC);
CREATE INDEX idx_payments_pending_review ON service_order_payments(reviewed_at) WHERE reviewed_at IS NULL;
CREATE INDEX idx_payments_by_admin ON service_order_payments(reviewed_by_admin, reviewed_at DESC);

-- ============================================================
-- 0034.8: comp_grants — permanent + per-grant comp records
-- ============================================================
-- Already partly declared in 0023 § 3.5b; restated here for completeness.
-- Used by § 10a (Owner Internal Accounts — permanent, all_services, unlimited),
-- § 10b (Setnayan Team Shared Pool — monthly consumption ledger drives
-- single_order grants), and § 5.4 (Vendor self-comp, audit-logged, rate-limited).
CREATE TABLE comp_grants (
  grant_id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES users(user_id),
  scope                   TEXT NOT NULL DEFAULT 'all_services'
                          CHECK (scope IN ('all_services','specific_skus','single_order')),
  scoped_skus             TEXT[],
  expiry                  TIMESTAMPTZ,                 -- NULL = lifetime
  retail_value_centavos   INT,                         -- estimated retail value at grant time
  rationale               TEXT NOT NULL,
  granted_by              UUID NOT NULL REFERENCES users(user_id),
  approved_by             UUID REFERENCES users(user_id),
  two_admin_approval_id   UUID,                        -- required for grants > ₱10,000 retail per § 9.1
  source                  TEXT NOT NULL CHECK (source IN ('owner_internal','team_pool','external_promo','dispute_remedy','vendor_self_comp')),
  vendor_id               UUID REFERENCES vendors(vendor_id),  -- populated when source='vendor_self_comp'; null otherwise
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at              TIMESTAMPTZ
);

CREATE INDEX idx_comp_grants_user ON comp_grants(user_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_comp_grants_source ON comp_grants(source, created_at DESC);
CREATE INDEX idx_comp_grants_vendor_self_comp ON comp_grants(vendor_id, created_at DESC)
  WHERE source = 'vendor_self_comp';

-- ============================================================
-- 0034.9 (auxiliary): identity tables for the self-review gate (locked 2026-05-15)
-- ============================================================
-- These two structures support iteration 0006's review-time related-account gate.
-- They live in 0034 because checkout is where the platform first captures device
-- and billing-address signals.

CREATE TABLE user_devices (
  user_id        UUID NOT NULL REFERENCES users(user_id),
  device_hash    TEXT NOT NULL,           -- opaque hash of UA + canvas/audio fingerprint; computed client-side, salted server-side
  last_seen_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, device_hash)
);

CREATE INDEX idx_user_devices_by_hash ON user_devices(device_hash);

-- users.address_normalized is a computed column (lowercased + whitespace-collapsed)
-- maintained by trigger on the existing address fields. NULL when no address on file.
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_normalized TEXT;
CREATE INDEX IF NOT EXISTS idx_users_address_normalized ON users(address_normalized)
  WHERE address_normalized IS NOT NULL AND length(address_normalized) > 0;
```

---

## 3. The customer flow (lives in 0021 services launcher + 0022 vendor dashboard)

End-to-end customer journey, screen-by-screen:

### 3.1 Add to cart

Every SKU tile on the services grid (0021 Services launcher) has an **Add to cart** CTA. Tap inserts a `cart_items` row, bumps `carts.updated_at`. If no active cart exists for the user (no row where `status = 'active'`), one is created on the fly.

A small **cart badge** in the top chrome shows the active cart's item count and updates in real time via Supabase Realtime subscription on the `cart_items` table filtered to the user's active cart.

### 3.1a Self-purchase confirm modal (locked 2026-05-15)

The dual-role customer ↔ vendor rule (CLAUDE.md decision log 2026-05-15) requires a confirm step when a vendor — or a member of the vendor's team — is about to check out their own service. Detection runs at the **Checkout** boundary, not at **Add to cart**, so adding-then-removing your own SKU is friction-free; the gate fires only when the customer is about to commit.

**Detection.** Before § 3.3 Checkout locks the cart, run:

```sql
SELECT 1
FROM cart_items ci
JOIN service_catalog sc ON sc.sku_id = ci.sku_id
WHERE ci.cart_id = :cart_id
  AND (
    sc.vendor_id IN (SELECT vendor_id FROM vendors WHERE owner_user_id = auth.uid())
    OR sc.vendor_id IN (
      SELECT vendor_id FROM vendor_service_agents WHERE member_id = auth.uid()
    )
  )
LIMIT 1;
```

If at least one row matches, the cart shows a modal instead of jumping to the payment screen.

**Modal copy (EN canonical; TL/CEB resolved per 0015 locale loader):**

```
─────────────────────────────────────
  This is your own vendor account.

  One or more items in your cart are services your
  vendor account offers. Do you want to:

  [ Pay full price ]
        Standard payment — same price as any
        customer. Counts toward vendor revenue and
        sales analytics.

  [ Comp for myself ]
        Skip payment for this order. Audit-logged.
        12 self-comps per quarter; cap raised by admin.

  [ Cancel ]
─────────────────────────────────────
```

**Pay full price.** Standard § 3.3 Checkout flow continues unchanged. Order appears in vendor analytics as a normal customer purchase (no special tagging).

**Comp for myself.** Skips § 3.4 Payment screen entirely. The flow is:

1. Insert a `service_orders` row with `status='paid'`, `total_centavos=0` (no money moves), `payment_method='comp'`, and `comp_grant_id` populated.
2. Insert a `comp_grants` row with `source='vendor_self_comp'`, `vendor_id=<this vendor>`, `user_id=auth.uid()`, `scope='single_order'`, `rationale='Vendor self-comp at checkout (cart=<cart_id>)'`, `granted_by=auth.uid()`, `approved_by=auth.uid()`. (Self-approval is allowed because the grant is self-scoped and rate-limited — see below. Two-admin approval per § 9.1 is NOT required for self-comp.)
3. Excluded from vendor-side conversion analytics: any `service_orders` row whose `comp_grant_id` resolves to a `comp_grants.source='vendor_self_comp'` row is filtered out of the vendor dashboard's conversion / revenue cards.
4. Audit-log entry written to `admin_audit_log` for the 0023 review surface (see § 5.4 below).

**Rate limit.** Vendor self-comp is capped at **12 grants per (vendor_id, calendar quarter)** by default. The cap is enforced at insert time:

```sql
-- Reject the insert if the quarter's count would exceed the cap.
CREATE OR REPLACE FUNCTION enforce_vendor_self_comp_quota()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  q_count   INT;
  q_cap     INT;
BEGIN
  IF NEW.source <> 'vendor_self_comp' THEN RETURN NEW; END IF;

  -- Per-vendor override read from a small config table maintained in 0023;
  -- falls back to the default 12 when no override row exists.
  SELECT COALESCE(quarterly_cap, 12) INTO q_cap
    FROM vendor_self_comp_caps
    WHERE vendor_id = NEW.vendor_id;

  SELECT COUNT(*) INTO q_count
    FROM comp_grants
    WHERE source = 'vendor_self_comp'
      AND vendor_id = NEW.vendor_id
      AND date_trunc('quarter', created_at) = date_trunc('quarter', NEW.created_at)
      AND revoked_at IS NULL;

  IF q_count >= q_cap THEN
    RAISE EXCEPTION 'VENDOR_SELF_COMP_QUOTA_EXCEEDED: cap=% used=%', q_cap, q_count
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER comp_grants_enforce_self_comp_quota
  BEFORE INSERT ON comp_grants
  FOR EACH ROW EXECUTE FUNCTION enforce_vendor_self_comp_quota();

CREATE TABLE vendor_self_comp_caps (
  vendor_id       UUID PRIMARY KEY REFERENCES vendors(vendor_id),
  quarterly_cap   INT NOT NULL CHECK (quarterly_cap >= 0),
  raised_by_admin UUID REFERENCES users(user_id),
  raised_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason          TEXT NOT NULL
);
```

When the quota is hit, the modal renders the "Comp for myself" CTA disabled with hint *"You've used all 12 self-comps for this quarter — pay full price or contact admin to raise the cap"* and a link to 0023 Help inbox.

### 3.2 Cart drawer

Tapping the cart badge slides up a bottom-sheet drawer (mobile) or a right-side panel (desktop) showing:

- One row per `cart_items` line: SKU name, quantity stepper, line subtotal, remove button
- Computed subtotal of all line items
- Applicable fees (Setnayan Pay convenience fee — flat 5.0%, admin-configurable per method per 2026-05-16 lock — appears only when at least one cart_item is a vendor booking; none in pure in-app SKU carts)
- Total in large PHP type
- **Checkout** CTA

The drawer is the only place a customer modifies cart contents before checkout. After checkout, cart_items are read-only.

### 3.3 Checkout

Pressing Checkout:
1. Locks the cart: `UPDATE carts SET status = 'checking_out' WHERE cart_id = $1`
2. Generates a fresh 10-char Crockford base 32 reference code (alphabet `0123456789ABCDEFGHJKMNPQRSTVWXYZ` — Crockford base32, ambiguous chars removed). Format displayed to user: `S89O-XXXXXXXXXX`. Collision-check on insert; retry on duplicate.
3. Inserts a `service_orders` row with:
   - `status = 'pending_payment'`
   - `subtotal_centavos` = SUM(cart_items.unit_price_centavos × cart_items.quantity)
   - `fees_centavos` = applicable convenience fee for vendor bookings via Setnayan Pay, computed as `MAX(subtotal_centavos × setnayan_fee_bps / 10000, min_fee_centavos)` — i.e., 5.0% of subtotal OR ₱50 floor, whichever is higher (per 0023 § 3.5d admin config); 0 for pure in-app SKU carts
   - `total_centavos` = subtotal + fees
   - `payment_method` = customer's choice (BDO or GCash; for Setnayan Pay vendor bookings, fixed)
   - `expires_at` = NOW() + 7 days
4. Inserts `service_order_items` rows mirroring each `cart_items` row at the snapshot price
5. Updates `carts.status = 'converted_to_order'`, `carts.converted_to_order_id = new_order_id`
6. Sends the `payment_instructions` email per 0028, including the reference code, total, and QR-code instructions

### 3.4 Payment screen

Full-screen on mobile; centered modal on desktop. Layout:

```
─────────────────────────────────────
  Total to pay
  ₱4,997
─────────────────────────────────────
  Reference code (include in transfer note)
  ┌────────────────────────────────┐
  │  S89O-A4F2K9R7BX                │  [copy]
  └────────────────────────────────┘
─────────────────────────────────────
  [ BDO Bank Transfer ] [ GCash ]
  ┌────────────────────────────────┐
  │                                │
  │      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓         │
  │      ▓ ▓  QR CODE  ▓ ▓         │
  │      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓         │
  │                                │
  └────────────────────────────────┘
  Setnayan Pay Inc.
  Account #: 0123-4567-8901
─────────────────────────────────────
  [ I've paid — upload screenshot ]
─────────────────────────────────────
```

The two QR code tabs load Setnayan-owned receiving-account QRs from `payment_receiving_accounts.qr_code_r2_key` (the receiving accounts catalog is admin-managed per § 3.5c). The QR encodes the bank/GCash account info — customer's bank app reads it and pre-fills the transfer recipient. Customer manually enters the **amount** and **reference code** into the transfer note.

Below the QRs: fallback plaintext account name + account/mobile number for customers whose bank app doesn't support QR.

### 3.5 Screenshot upload

Tapping "I've paid — upload screenshot" opens a file picker (camera or gallery on mobile; file picker on desktop). Customer selects the screenshot of their bank/GCash payment confirmation.

On upload:
1. Image is sent to R2 at key `payment_proofs/{order_id}/{payment_id}.jpg`
2. A `service_order_payments` row is inserted with:
   - `method` = matches the QR tab they paid through
   - `amount_centavos` = customer-typed (defaults to order.total_centavos; they can adjust if they paid a different amount)
   - `reference_code` = customer-typed (the bank's own transaction ref from the screenshot)
   - `proof_screenshot_r2_key` populated
   - `submitter_notes` = optional free-text
   - `resubmission_count` = 0 for first attempt
3. `service_orders.status` flips from `pending_payment` → `proof_submitted`
4. Admin reconciliation queue (0023 § 3.3) picks it up

### 3.6 Confirmation screen

After upload, customer sees:

```
✓ Submitted!
Setnayan Team will verify your payment within 24 hours.
We'll email you when approved.

Order: S89O-A4F2K9R7BX
Total: ₱4,997
Status: Awaiting verification

[ View order ]
```

The `payment_instructions` email is followed by either `payment_confirmed` (on approve) or `payment_proof_rejected` (on reject) per 0028.

### 3.7 Order status page

Customers can revisit the order at `/dashboard/[event-id]/orders/[order-id]` (or `/dashboard/orders/[order-id]` for account-scoped orders) at any time. The page shows:

- Current `status` with a friendly label
- Full line-item breakdown from `service_order_items`
- All submitted payment proofs (each with its decision + reason, if reviewed)
- If `status = 'rejected'` and `decision = 'needs_more_proof'` on the latest payment: a **Submit new proof** CTA that opens the upload screen again (creates a new `service_order_payments` row with `resubmission_count += 1` against the same `order_id`)
- If `status = 'rejected'` (permanently): a "Start a new order" CTA that creates a fresh cart with the same line items

---

## 4. The admin flow (lives in 0023 § 3.3 Payments & Activations)

Already documented in 0023 § 3.3. This section extends and clarifies the workflow.

### 4.1 Queue view

Admin sees a list of all `service_orders` where the latest `service_order_payments.reviewed_at IS NULL`, sorted by `submitted_at ASC` (oldest first — FIFO). Each row shows:

- Reference code
- Customer name + email
- Total amount
- Submitted at (with elapsed time — green < 12hr, amber 12–20hr, red > 20hr against the 24-hr SLA)
- Method (BDO / GCash badge)
- **Open** button

### 4.2 Detail view

Splits into two columns:

**Left column — customer's submission:**
- Screenshot displayed at full size (R2 signed URL, 1-hour TTL)
- Customer-typed amount + reference code + notes
- Order line items
- Customer's prior order history (count of paid / rejected / pending orders)

**Right column — Setnayan's reconciliation tools:**
- Quick-link to BDO online banking dashboard
- Quick-link to GCash merchant dashboard
- Search field pre-filled with the customer's reference code (admin pastes it into the bank's transaction search)
- The order's `total_centavos` displayed for easy comparison

### 4.3 Three decision buttons

**Approve** (single-admin authority per § 9.1)
- `service_order_payments.decision = 'approved'`
- `service_order_payments.reviewed_by_admin = current_admin_user_id`
- `service_order_payments.reviewed_at = NOW()`
- `service_orders.status = 'paid'`
- `service_orders.paid_at = NOW()`
- Service-activation hooks fire per SKU (see § 5)
- Official Receipt PDF generated per 0026
- `payment_confirmed` email sent per 0028 with OR attached

**Reject — needs more proof**
- `service_order_payments.decision = 'needs_more_proof'`
- `service_order_payments.decision_reason` = admin-typed (e.g., "Screenshot is blurry, please retake")
- `service_orders.status` stays `pending_payment` (customer can resubmit on the same order)
- `payment_proof_rejected` email sent per 0028 with the reason

**Reject permanently**
- `service_order_payments.decision = 'rejected'`
- `service_order_payments.decision_reason` populated
- `service_orders.status = 'rejected'`
- `service_orders.rejected_at = NOW()`
- `payment_proof_rejected` email sent per 0028 with the reason and a note that the customer must start a new order

### 4.4 Service-activation hooks per SKU

When `service_orders.status` transitions to `paid`, a per-SKU activation hook fires for each `service_order_items` row. Implemented as a Postgres trigger that dispatches to per-SKU stored procedures (or Edge Functions for complex logic):

| SKU prefix              | Activation action                                                              |
|-------------------------|--------------------------------------------------------------------------------|
| `paparazzi_*_seats`     | Insert `paparazzi_seats` rows for the event (N rows, status = 'unclaimed')      |
| `template_unlock`       | Insert `event_template_unlocks` row binding template_id to event_id            |
| `save_the_date_render`  | Insert `save_the_date_render_credits` row (one credit, consumed on render)     |
| `pro_camera_bridge_seat`| Insert `pro_camera_bridge_seats` row (1 phone:1 DSLR, multi-purchase)          |
| `pro_widget_*`          | Set `event_widget_pro_tier` flag for the specific widget                       |
| `live_stream_base`      | Insert `live_stream_event_config` row with 3-cam, 3-hr defaults                |
| `live_stream_camera_addon` | Increment `live_stream_event_config.max_cameras` (cap at 5)                |
| `live_stream_hour_addon`| Increment `live_stream_event_config.max_hours` (no cap)                        |
| `custom_monogram_pack`  | Set `events.custom_monogram_unlocked = TRUE`                                   |
| `broadcast_style_pack`  | Set `events.broadcast_style_pack_unlocked = TRUE`                              |
| `ai_video_highlight_60s`| Insert `ai_highlight_credits` row (one 60s credit)                             |
| `ai_edited_highlight_3min`| Insert `ai_highlight_credits` row (one 3min credit)                          |
| `contract_intelligence_upgrade` | Insert `contract_purchases` row tied to a specific `contracts.contract_id` |
| `vendor_pro_weekly`     | Insert `vendor_subscriptions` row with 7-day duration                          |
| `sponsored_boost_weekly`| Insert `vendor_sponsored_boost` row with 7-day duration                        |
| `guided_planner_1week`  | **RETIRED 2026-05-16** — SKU is `is_active=FALSE` in service_catalog. Card-less 3-day trial now handled by `start_concierge_trial(event_id)` server action (no order, no payment); see `concierge_complete` row below.                       |
| `guided_planner_3month` | **RETIRED 2026-05-16** — replaced by `concierge_complete` row below.          |
| `guided_planner_12month`| **RETIRED 2026-05-16** — replaced by `concierge_complete` row below.          |
| `concierge_essentials`  | **RETIRED 2026-05-17** (same-week as introduction) — single-SKU model adopted; Essentials tier dropped. `is_active=FALSE` in service_catalog. Couples who were already on Essentials at the time of retirement keep their access until natural expiry; renewal CTAs route to `concierge_complete`. |
| `concierge_complete`    | Call `activate_concierge(event_id, order_id)` — sets `events.concierge_status='active'`, `concierge_tier='complete'`, stamps `concierge_activated_at = NOW()`, computes `concierge_expires_at` per the **wedding-anchored formula** `LEAST(GREATEST(events.wedding_date + INTERVAL '30 days', NOW() + INTERVAL '12 months'), NOW() + INTERVAL '24 months')` — defaults to `NOW() + INTERVAL '12 months'` if `wedding_date IS NULL` at activation. Recomputes via `recompute_concierge_expiry(event_id)` when wedding_date is later set (extend-only — couple keeps the runway they paid for if wedding moves earlier). Cleanly overwrites `'trial'` state if couple buys mid-trial. Fails if `users.concierge_enforcement_level = 'full_banned'`. Fires the long-engagement advisory + stamps `events.concierge_long_engagement_advised_at` if `wedding_date > activation + 24 months` at activation time OR at wedding-date-change time. See iteration 0016 § 0 for the full duration table + extend-only rule + advisory de-dup. |

---

## 5. Internal accounts + team pool integration

### 5.1 Owner Internal Accounts (§ 10a)

Users with `users.is_internal = TRUE` (owner + spouse only, two-admin approved at account creation) skip the payment-pending state entirely. The cart flow short-circuits at checkout:

```
IF user.is_internal = TRUE THEN
  service_orders.payment_method = 'comp_grant'
  service_orders.status = 'paid'
  service_orders.paid_at = NOW()
  service_orders.total_centavos = total_centavos  -- retail value preserved for reporting
  service_orders.comp_grant_id = user's permanent grant_id (scope='all_services', expiry=NULL)
  -- No payment screen shown; customer sees "Comped via internal grant ✓"
  -- Service-activation hooks fire immediately
END
```

A `service_order_payments` row is NOT created — there's no proof to review. The audit trail is in `comp_grants` + `service_orders.comp_grant_id`.

### 5.2 Setnayan Team Shared Monthly Pool (§ 10b)

Users with `users.is_team_member = TRUE` (all non-owner team) check the singleton `team_shared_monthly_allowance` table at checkout:

```
SELECT remaining_php FROM team_shared_monthly_allowance
WHERE period_month = TO_CHAR(NOW(), 'YYYY-MM')
FOR UPDATE;
```

Three branches:

**(a) Full comp** — `remaining_php >= total_php`: behaves like internal accounts. Order goes directly to `paid`. A `comp_grants` row is created with `source = 'team_pool'`, `scope = 'single_order'`. A `team_allowance_consumptions` row records the spend. `team_shared_monthly_allowance.consumed_php += total_php`, `remaining_php -= total_php`.

**(b) Partial comp** — `0 < remaining_php < total_php`: the customer pays the difference via standard flow. The order's `total_centavos` shows the full retail; a separate `comp_grants` row with `scope = 'single_order'` and `retail_value_centavos = remaining_php × 100` accompanies. The displayed price on the payment screen is `total_centavos - (remaining_php × 100)`.

**(c) Exhausted** — `remaining_php = 0`: standard flow at full price. No comp.

Both (a) and (b) update the pool ledger atomically (FOR UPDATE lock prevents race conditions when two team members check out simultaneously).

### 5.3 Pool reset on month boundary

Scheduled Edge Function runs at 00:00 PHT on the 1st of each month:
1. Closes the prior month's row (`closed_at = NOW()`)
2. Computes new pool: `LEAST(0.005 * prior_month_total_sales_php, 10000)`
3. Inserts a new `team_shared_monthly_allowance` row for the current month

Unused balance is NOT carried forward (use-it-or-lose-it per § 10b).

### 5.4 Vendor self-comp (locked 2026-05-15)

Captures the third comp-grant source after § 5.1 (Owner Internal) and § 5.2 (Team Shared Pool). Triggered at cart checkout by the § 3.1a Self-purchase confirm modal when a vendor (or a member of the vendor's team) picks **"Comp for myself"** on a self-purchased service.

**Grant shape:**

| Field | Value |
|---|---|
| `source` | `'vendor_self_comp'` |
| `vendor_id` | the vendor being self-comped (NEW column on `comp_grants`) |
| `scope` | `'single_order'` (never `all_services` for vendor self-comp) |
| `user_id` | the vendor's owner or team-member buying the service |
| `rationale` | auto-filled `'Vendor self-comp at checkout (cart=<cart_id>)'` plus any user-typed note |
| `granted_by` + `approved_by` | both = `auth.uid()` (self-approval allowed — see below) |
| `retail_value_centavos` | snapshot of cart total at grant time |
| `two_admin_approval_id` | always NULL (rate-limit replaces two-admin approval) |
| `expiry` | NULL (single-order grants don't carry expiry; they activate the order immediately) |

**Self-approval allowed (departs from § 9.1).** The two-admin pattern protects against fraud or abuse on grants that move material value to **other** users. A vendor self-comping a service their own catalog offers moves no money externally — the comped order is invisible to the vendor's reported analytics and the vendor's retail-value loss is their own. The rate-limit (12/quarter default, admin-raisable) replaces the two-admin gate.

**Vendor analytics exclusion.** Any `service_orders.comp_grant_id` resolving to a `comp_grants.source='vendor_self_comp'` row is filtered out of the vendor dashboard's conversion / revenue cards (iteration 0022 surface). The owner still sees the order in their own customer-side order history (it's their purchase, after all); they just don't see it in their vendor-side sales numbers.

**Comparison to § 10a internal accounts.**

| Dimension | § 10a Owner Internal | § 5.4 Vendor self-comp |
|---|---|---|
| Who | Owner + spouse only (2 users) | Any vendor's owner or team member |
| Eligible SKUs | All Setnayan in-app SKUs | Only services in that vendor's own catalog |
| Cap | Unlimited | 12 per (vendor, quarter); admin-raisable |
| Approval | Two-admin required at account creation | Self-approval; rate-limit is the gate |
| Analytics | Excluded from customer-pipeline analytics | Excluded from that vendor's sales analytics |
| Surface | 🟣 badge in admin console | Audit-log entry in `admin_audit_log` + 0023 review queue |

**Admin override.** Admins can raise the quarterly cap per vendor via the `vendor_self_comp_caps` table (declared in § 3.1a). The 0023 admin console exposes this as a small "Self-comp cap" stepper on the vendor detail page, with reason logged. Lowering the cap below current quarter usage does NOT retroactively revoke past grants; it just blocks new ones until the next quarter.

**Audit log entry.** Every `comp_grants` insert with `source='vendor_self_comp'` writes to `admin_audit_log` with:

```
actor_id = grant.granted_by
action = 'vendor_self_comp_issued'
target_type = 'comp_grant'
target_id = grant.grant_id
metadata = { vendor_id, sku_ids, retail_value_centavos, quarterly_count_after }
```

The 0023 admin console surfaces these in the audit-log viewer (§ 365 of 0023) with a "Vendor self-comp" filter chip.

---

## 6. Setnayan Pay convenience fee — 5.0% flat on top of vendor price (locked 2026-05-16, supersedes earlier same-day 5.5%/6.5% lock)

> **V1 vs V1.5+ boundary (clarified 2026-05-17):** V1 ships with the **manual QR + screenshot reconciliation flow** specced in § 3.3 Checkout — customers scan a Setnayan-provided BDO/GCash QR, pay the full vendor list + 5% convenience fee, upload a screenshot, admin manually approves. **V1 has no automated gateway, so no gateway-fee absorption math applies.** Setnayan keeps the full 5% (₱5,000 per ₱100K booking) at ~3.60% net under V1 28% tax wedge — above the 3% net design target by 0.6pp. The gateway-absorption / Option-A-vs-Option-B / Path-A-B-C-D discussion below activates only at **V1.5+ when Maya Business goes live as the automated gateway** per § 6.7 Inbound.

When the order is a vendor booking routed through Setnayan Pay (not an in-app SKU), a **flat 5.0% convenience fee** is added **on top of** the vendor's listed price — same rate for every rail (Maya QR Ph, Maya eWallet, GCash, credit card, OTC, bank transfer). The vendor receives their list price (less terminal/gateway fee + BIR Withholding); Setnayan keeps the 5.0% convenience fee as gross revenue. **Setnayan does not absorb the gateway fee** — it passes through to the vendor on payout (Option B in the 2026-05-16 architecture decision).

**Two prior fee rates are RETIRED 2026-05-16:**
- The original 3% figure (placeholder during manual-reconciliation V1 design) — below operating breakeven at any tax tier
- The morning 2026-05-16 5.5%/6.5% dual-rate lock — over-collected against the 3% net target the owner ratified

All references to `fees_centavos = subtotal × 3%` or `subtotal × 5.5%/6.5%` in this document should be read as `fees_centavos = subtotal × 500 / 10000` (flat 5.0%, admin-configurable per payment method via 0023 § 3.5d for future rail-cost shocks but defaults uniform).

### 6.1 Couple-facing cart math

**Single example — flat across every rail (Maya QR Ph, GCash, cards, OTC, bank transfer):**

Vendor's listed price is ₱100,000.

```
Subtotal (vendor list price)              ₱100,000.00
Setnayan Pay convenience fee (5.0%)         ₱5,000.00
──────────────────────────────────────────────────────
Total                                     ₱105,000.00
```

In centavos:
- `subtotal_centavos = 10000000`
- `fees_centavos = 500000` (5.0% of 10,000,000 centavos)
- `total_centavos = 10500000`

The customer sees one line item, one rate, no rail-specific math.

**Minimum fee floor — ₱50 (locked 2026-05-17):** the convenience fee never goes below **₱50** even when 5% × subtotal would be smaller. Formula at checkout is `fees_centavos = MAX(subtotal_centavos × setnayan_fee_bps / 10000, min_fee_centavos)` where `min_fee_centavos = 5000` (₱50) is the default in `payment_method_config` per 0023 § 3.5d (admin-configurable per method).

The floor only activates on vendor bookings below ₱1,000 (the 5%-meets-₱50 crossover). In practice this is rare — most wedding-vendor bookings are ₱8K+. Affects mostly small supply purchases and micro add-ons through the supplies marketplace.

**Worked example — small booking at the floor (₱500 vendor item):**

```
Subtotal (vendor list price)                ₱500.00
Setnayan Pay convenience fee (₱50 minimum)   ₱50.00      ← floor (5% × ₱500 = ₱25, floor wins)
──────────────────────────────────────────────────────
Total                                       ₱550.00
```

In centavos:
- `subtotal_centavos = 50000`
- `fees_centavos = 5000` (₱50 floor, not the ₱25 percentage)
- `total_centavos = 55000`

**Crossover point:** the floor stops applying at vendor list price ≥ ₱1,000 (where 5% = ₱50 = floor). At ₱1,000 and above, the standard 5% takes over.

**Vendor opt-in interaction (per § 6.8):** if the vendor absorbs the convenience fee for a small booking, the ₱50 floor still applies — the vendor absorbs ₱50 (not ₱25). The floor protects Setnayan's per-transaction operating cost regardless of which side pays it.

**Customer-facing copy** (cart drawer, marketing site, vendor agreement):

> Setnayan Pay convenience fee — 5% per booking, **₱50 minimum**.

### 6.2 Vendor side of the ledger (Option B — vendor absorbs gateway)

The vendor's net payout is the vendor list price minus (a) gateway/terminal fee + (b) BIR Marketplace Withholding 0.5%. **Setnayan does NOT deduct any commission from the vendor side** — the 5.0% convenience fee is paid by the couple on top. The gateway fee passes through to the vendor as a transparent line item on the payout breakdown.

| Rail | Gateway fee | BIR Withholding | Vendor net on ₱100K | Effective burden |
|---|---|---|---|---|
| Maya QR Ph (preferred) | 1.5% | 0.5% | ₱98,000 | 2.0% |
| GCash direct | 1.5% | 0.5% | ₱98,000 | 2.0% |
| Bank transfer (BDO/etc) | 0% (manual) | 0.5% | ₱99,500 | 0.5% |
| Maya eWallet | 2.0% | 0.5% | ₱97,500 | 2.5% |
| Credit card | 3.0% | 0.5% | ₱96,500 | 3.5% |
| OTC | 1.5% | 0.5% | ₱98,000 | 2.0% |

Setnayan absorbs the **₱15-25 outbound disbursement fee** per payout — the vendor sees the nominal "net of gateway + BIR" figure on their dashboard without an additional disbursement deduction. The vendor agreement names the gateway pass-through explicitly so vendors understand the deduction is the rail's cost, not Setnayan's commission. Vendor Studio subscribers (per iteration 0022) may gain a "gateway-absorbed" perk in V1.5 once subscription rails mature; not in V1.

### 6.3 Setnayan's gross / net under both tax tiers

For a ₱100K booking at flat 5.0% (any rail):

- **Setnayan gross:** ₱5,000 (the 5.0% convenience fee)
- **Setnayan pays its own taxes** from this gross. Gateway fee does NOT touch Setnayan's books under Option B (vendor-side deduction)
- **V1 small-business tax tier** (Pct Tax 3% + LBT 1% + Income Tax 25% = 28% wedge): net = ₱5,000 × 72% = **₱3,600 (3.60% effective)** — 0.60pp above the 3% net design target
- **V2 worst-case tax tier** (12% VAT + LBT 2% + Income Tax 25% = ~35% wedge, after Setnayan crosses ₱3M annual gross threshold and VAT-registers): net = ₱5,000 × 65% = **₱3,250 (3.25% effective)** — 0.25pp above the 3% net design target
- **Extreme worst-case** (37–40% wedge with LBT 3% city + edge-case cost drag): net = ₱5,000 × 60–63% = **₱3,000–₱3,150 (3.00–3.15% effective)** — exactly at or just above the design target

The 5.0% flat rate is the **minimum gross that holds the 3% net floor under every plausible tax scenario.** It supersedes the morning's 5.5%/6.5% lock, which over-collected by ~0.5pp net at V2 tax and was tuned for a higher net target than the owner's actual 3% goal.

### 6.4 Operating headroom and breakeven

The 2.16% net operating-breakeven figure (below which a booking loses money once admin time is counted) is preserved from the retired 5.5% lock. At 5.0% flat:

| Tax tier | Setnayan net | Headroom above 2.16% breakeven |
|---|---|---|
| V1 (28% wedge) | 3.60% | +1.44pp (1.67× breakeven) |
| V2 realistic (35% wedge) | 3.25% | +1.09pp (1.50× breakeven) |
| Extreme worst (40% wedge) | 3.00% | +0.84pp (1.39× breakeven) |

Even in the extreme-worst tax scenario the rate clears 1.39× operating breakeven — comfortably profitable per booking, with margin for chargebacks (refund-as-loss ~0.5% of gross volume industry-typical), failed transactions, and disbursement-fee absorption.

### 6.5 BIR Marketplace Withholding (per RMC No. 8-2024)

Setnayan acts as the **withholding agent** for the 0.5% BIR Marketplace Withholding (1% × 50% under RMC 8-2024). For each vendor payout:

1. Setnayan computes BIR withholding = `vendor_subtotal_centavos × 50 / 10000` (0.5%)
2. Setnayan remits the withheld amount to BIR each month (BIR Form 1601-EQ)
3. Setnayan issues the vendor a **BIR Form 2307** quarterly — creditable against the vendor's own income-tax liability
4. The withholding line appears on the vendor's payout breakdown in 0022 Vendor Dashboard

### 6.6 Verified-only Setnayan Pay gate (locked 2026-05-16)

**Couples can ONLY use Setnayan Pay with verified vendors.** Coming_soon vendors are paid direct off-platform (couple pays the vendor's own BDO / GCash account, Setnayan tracks the milestone via 3-stage release per 0006 Payout model). The Setnayan Pay rail is the verification flow's primary unlock.

### 6.7 Payment gateway sequencing

#### Inbound — customer pays Setnayan Pay (couple → Setnayan)

- **V1 launch:** manual reconciliation — current 0034 flow (BDO / GCash QR + screenshot upload + admin approve). No automated gateway.
- **V1.5+:** **Maya Business** as the primary gateway. Maya QR Ph (1.5% gateway fee) is the **preferred default rail** at checkout. Per-method admin config (0023 § 3.5d) controls: Maya QR / Bank transfer / GCash direct / Maya eWallet / Credit card / OTC.
- **Daily.co video meetings retired** as part of the same 2026-05-16 lock — no longer a billing line item.

#### Outbound — Setnayan pays vendor (Setnayan → vendor) (locked 2026-05-17)

V1.5+ vendor disbursement runs through **Maya Business Bulk Fund Transfer**. All vendor payouts due each day batch into one CSV upload via Maya Business Manager. Per-recipient rail is determined at batch-generation time by the routing rule below; vendors can override their default in the 0022 Vendor Dashboard payout preferences.

**Default rail routing:**

| Payout type | Default rail | Vendor sees money | Per-payout cost Setnayan absorbs |
|---|---|---|---|
| Verified vendor with Maya Bank account | **Intra-Maya** | **Instant · 24/7** | **₱0** |
| Verified vendor immediate payout (non-Maya destination) | **InstaPay** | < 1 minute · 24/7 incl. weekends | ~₱10 (bulk rate, est.) |
| Coming_soon vendor 3-stage milestone (any non-Maya destination) | **PESONet** | EOD same banking day · T+1 weekends/holidays | ~₱15 (bulk rate, est.) |
| Any payout < ₱500 (uneconomic to InstaPay) | **PESONet** | EOD same banking day | ~₱15 |
| Any payout > ₱500,000 (above InstaPay cap) | **PESONet** | EOD same banking day | ~₱15 |

**Vendor override** (per 0022 Vendor Dashboard payout preferences):

| Vendor's choice | Cost handling |
|---|---|
| Verified vendor downgrades to PESONet | Setnayan saves ₱5/payout · vendor earns a ₱5 monthly rebate credit (or admin-config equivalent incentive) |
| Coming_soon vendor upgrades milestone to InstaPay | Vendor absorbs the ₱5 difference per payout (deducted from that milestone's payout) |
| Vendor switches default disbursement bank to Maya Bank | Both parties win: vendor gets instant + free; Setnayan saves the disbursement fee entirely |

**Per-recipient cost source:** Maya Business does not publish bulk pricing — quote-based per business. Published individual rates: intra-Maya FREE · InstaPay outbound ₱15/recipient · PESONet typical ₱15–25/recipient. Bulk products typically discount 30–40% off individual rates → estimated ₱10/recipient InstaPay bulk · ~₱15/recipient PESONet bulk. The numbers in the routing table are the V1.5+ planning assumptions; reconciled to the actual Maya Business quote once the business account is approved per the API Integration Checklist Owner Admin Punch List.

**Annual aggregate cost at scale** (Setnayan's absorbed disbursement fees per year, assuming 70% verified / 30% coming_soon mix, ~30% of vendors on Maya Bank by Year 2):

| Couples/yr | Total payouts/yr | Annual disbursement cost (Setnayan absorbs) |
|---|---|---|
| 200 (V1 conservative) | ~320 | ~₱2,500 |
| 500 (V2 mid-target) | ~800 | ~₱6,500 |
| 1,000 (Y2 aggressive) | ~1,600 | ~₱13,000 |
| 5,000 (Y3 scaled) | ~8,000 | ~₱65,000 |

Even at 5,000-couple scale the annual disbursement cost stays under 0.3% of platform revenue — operationally insignificant compared to the labor savings from batching.

**Vendor-recruiting copy** (canonical, lives in 0006 Vendor Verification flow + 0022 onboarding):

> **Get paid instantly, free, 24/7 — open a Maya Bank business account.**
> Or get paid in under a minute to any PH bank, including weekends (InstaPay).
> Standard payout settles end of business day (PESONet) — default for milestone releases.

**Failure handling for bulk batches:** if Maya rejects any row in a bulk transfer (invalid account number, KYC mismatch, frozen account, etc.), that row's `vendor_payouts.status` reverts to `pending` and rejoins the next day's batch. Partial-success batches are logged with per-row outcomes in `disbursement_batches.row_outcomes` JSONB. Three consecutive batch failures for the same vendor trigger an admin alert + automatic move to manual reconciliation for that vendor until they update their disbursement details.

### 6.8 Vendor opt-in: cover the convenience fee for customers (locked 2026-05-16 PM)

Vendors may opt in to **absorb the 5.0% convenience fee out of their own listed price** rather than have it shown on the customer's receipt. Vendors who opt in receive a public-facing **"No Convenience Fee" badge** on their marketplace profile, and the customer sees the listed price flat at checkout with no convenience-fee line. Setnayan's revenue is unchanged either way — only the visibility of the fee at the cart shifts.

**Vendor-side flag:** `vendors.absorbs_convenience_fee BOOLEAN NOT NULL DEFAULT FALSE` (defined in 0006 Vendor Management). Vendor toggles in the 0022 Vendor Dashboard settings panel; toggle changes apply only to NEW bookings (existing cart snapshots are frozen per the 2026-05-12 "price snapshot at add-to-cart time" decision).

**Cart math change** for vendor bookings where `vendor.absorbs_convenience_fee = TRUE`:

| Field | Default (Option B) | Vendor absorbs (Option A) |
|---|---|---|
| Customer-facing subtotal | ₱100,000 (vendor list) | ₱100,000 (vendor list, unchanged) |
| Customer-facing convenience fee line | ₱5,000 (5%) | **₱0 (hidden, absorbed)** |
| Customer-facing total | ₱105,000 | **₱100,000 (all-in)** |
| Setnayan revenue (gross) | ₱5,000 | ₱5,000 (identical) |
| Vendor's effective service revenue | ₱100,000 | ₱95,000 (₱5K absorbed) |

**Worked example — ₱100,000 vendor booking, Option A (vendor absorbs):**

```
Customer's receipt (Option A — No Convenience Fee badge)
────────────────────────────────────────────────────────
Service                                   ₱100,000.00
────────────────────────────────────────────────────────
You pay                                   ₱100,000.00     ← flat, no fee line
```

```
Vendor's payout breakdown (Option A)
─────────────────────────────────────────────────────────
Listed price                              ₱100,000.00
Convenience fee absorbed (5%)              −₱5,000.00     → Setnayan revenue
─────────────────────────────────────────────────────────
Service base                               ₱95,000.00

Less: BIR Marketplace Withholding 0.5%       −₱475.00     (creditable via BIR Form 2307)
Less: Terminal fee — Maya QR Ph 1.5%       −₱1,425.00
─────────────────────────────────────────────────────────
Vendor net (best case · Maya QR Ph)        ₱93,100.00

Less: Terminal fee — max 2.5% (worst case) −₱2,375.00
─────────────────────────────────────────────────────────
Vendor net (worst case)                    ₱92,150.00
```

**Side-by-side at ₱100K booking:**

| Rail | Option A — vendor absorbs (badge) | Option B — customer pays (default) | Vendor sacrifices for the badge |
|---|---|---|---|
| Maya QR Ph 1.5% (preferred) | ₱93,100 | ₱98,000 | ₱4,900 (~4.9%) |
| Maya eWallet 2.0% | ₱92,625 | ₱97,500 | ₱4,875 (~4.88%) |
| Cards / max-2.5% rail | ₱92,150 | ₱97,000 | ₱4,850 (~4.85%) |

**Setnayan's economics are unchanged:** ₱5,000 gross / ~₱3,250 net per ₱100K booking regardless of vendor's choice. The opt-in is purely a vendor-side marketing lever — Filipino couples strongly prefer "all-in" pricing, so the badge can drive measurable conversion lift for vendors whose competitors charge the fee on top.

**Snapshot at order time (immutable for audit):** `service_orders.vendor_absorbed_fee BOOLEAN NOT NULL DEFAULT FALSE` records whether the vendor's flag was TRUE when the cart converted to an order. The order's `fees_centavos` is set to 0 if the vendor absorbed, or `subtotal × 500 / 10000` otherwise. Setnayan's revenue ledger derives the platform cut as `subtotal × 500 / 10000` in both cases — `vendor_absorbed_fee` only changes who is on the hook for it.

**Customer-facing surfaces:**
- **Vendor marketplace profile (per 0006 / 0022):** "No Convenience Fee" badge renders next to the vendor's name when `vendors.absorbs_convenience_fee = TRUE`. Tap reveals tooltip: "This vendor covers the platform convenience fee. The price you see is the price you pay."
- **Search results / filter:** filter chip "No convenience fee" available in the marketplace search per 0022
- **Cart drawer:** when vendor absorbs, the convenience-fee row renders as `"Convenience fee ✓ covered by vendor"` in muted text with `₱0.00`. Customer still sees one line item but understands the math.
- **Worked-example block on `/pricing`:** an alternate worked example appears next to the default Option B example showing "Some vendors cover the convenience fee — look for the badge."

**Vendor-side surface (per 0022 dashboard settings):**
- Toggle: "Cover the Setnayan Pay convenience fee for customers (No Convenience Fee badge)"
- Financial preview: dynamic ₱-amount calculator showing vendor net on a sample booking under both options, side-by-side, with the vendor's actual listed prices
- Conversion-lift estimate: "Vendors who cover the fee see X% more bookings on average" (sourced from analytics once population data exists; placeholder copy in V1)
- Toggle change is single-admin authority for the vendor (their own account); logged in `vendor_audit_log` per 0006

### 6.9 Schema updates

```sql
ALTER TABLE service_orders ADD COLUMN setnayan_fee_bps INT DEFAULT 500;
ALTER TABLE service_orders ADD COLUMN gateway_fee_centavos INT DEFAULT 0;
ALTER TABLE service_orders ADD COLUMN bir_withholding_centavos INT DEFAULT 0;
ALTER TABLE service_orders ADD COLUMN vendor_net_centavos INT DEFAULT 0;
ALTER TABLE service_orders ADD COLUMN disbursement_fee_centavos INT DEFAULT 0;   -- absorbed by Setnayan, tracked for finance
ALTER TABLE service_orders ADD COLUMN vendor_absorbed_fee BOOLEAN NOT NULL DEFAULT FALSE;   -- snapshot of vendor.absorbs_convenience_fee at order time (locked 2026-05-16 PM, per § 6.8)
ALTER TABLE service_orders ADD COLUMN payment_method_key TEXT;   -- FK to payment_method_config.method_key

-- New column on vendors (defined formally in 0006 vendors_management):
-- ALTER TABLE vendors ADD COLUMN absorbs_convenience_fee BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE vendor_payouts (
    payout_id              UUID PRIMARY KEY,
    vendor_id              UUID NOT NULL REFERENCES vendors(vendor_id),
    order_id               UUID NOT NULL REFERENCES service_orders(order_id),
    payout_stage           TEXT CHECK (payout_stage IN ('immediate','reservation_20','pre_event_60','post_event_20')),
    gross_centavos         INT NOT NULL,
    gateway_fee_centavos   INT NOT NULL,
    bir_withholding_centavos INT NOT NULL,
    net_centavos           INT NOT NULL,
    disbursement_method    TEXT CHECK (disbursement_method IN ('maya','gcash','bdo_transfer','other_bank')),
    rail                   TEXT CHECK (rail IN ('intra_maya','instapay','pesonet')) DEFAULT 'pesonet',  -- locked 2026-05-17 per § 6.7 outbound routing
    rail_chosen_by         TEXT CHECK (rail_chosen_by IN ('default','vendor_preference','admin_override')) DEFAULT 'default',
    batch_id               UUID REFERENCES disbursement_batches(batch_id),  -- NULL until included in a Maya Bulk Fund Transfer batch
    disbursement_fee_centavos INT NOT NULL DEFAULT 0,    -- absorbed by Setnayan
    status                 TEXT NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending','batched','disbursed','failed','manual_reconciliation')),
    initiated_at           TIMESTAMPTZ,
    completed_at           TIMESTAMPTZ,
    bir_form_2307_r2_key   TEXT
);

-- Maya Bulk Fund Transfer batches (V1.5+ disbursement automation, locked 2026-05-17)
CREATE TABLE disbursement_batches (
    batch_id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generated_by_admin_id  UUID NOT NULL REFERENCES users(user_id),
    rail                   TEXT NOT NULL CHECK (rail IN ('instapay','pesonet','mixed')),
    csv_r2_key             TEXT NOT NULL,                              -- the uploaded CSV file
    recipient_count        INT NOT NULL,
    total_centavos         INT NOT NULL,                                -- sum across all rows
    status                 TEXT NOT NULL DEFAULT 'pending_upload'
                           CHECK (status IN ('pending_upload','uploaded','partial_success','complete','failed')),
    maya_batch_reference   TEXT,                                        -- Maya's returned batch ID once uploaded
    row_outcomes           JSONB,                                       -- per-row results: { payout_id: 'success'|'failed', reason: '...' }
    generated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    uploaded_at            TIMESTAMPTZ,
    completed_at           TIMESTAMPTZ
);

CREATE INDEX idx_vendor_payouts_status_batch ON vendor_payouts(status, batch_id);
CREATE INDEX idx_disbursement_batches_status ON disbursement_batches(status, generated_at);
```

`payment_method = 'setnayan_pay'` flags this as a vendor booking; service-activation hook on Approve releases vendor-side notification (vendor sees "Booking confirmed by Setnayan" in their 0022 dashboard) instead of activating Setnayan-side services. The payout stage is determined by the vendor's `verification_state`: `verified` → `immediate`; `coming_soon` → `reservation_20` → `pre_event_60` → `post_event_20`.

---

## 7. Receipts (per 0026)

After `service_orders.status` transitions to `paid`, an Official Receipt is auto-generated per 0026 BIR compliance. The OR PDF is:
- Stored at R2 key `receipts/{order_id}/OR_{or_number}.pdf`
- Attached to the `payment_confirmed` email per 0028
- Available in the customer's order status page for re-download
- Listed in 0026's tax-document download surface

Internal-account comp orders (`comp_grant_id IS NOT NULL`, `total_centavos > 0`) DO generate an OR (for the retail value), but the OR is marked "Comped — no actual payment received" and is NOT included in BIR sales totals (0026 § VAT calculation excludes comp-grant orders).

---

## 8. Refunds

When an admin processes a refund (per 0023 Disputes & Refunds flow, post-2026-05-12 pivot):

- Per § 9.1: refunds ≤ ₱25K = single-admin authority (Transactions Handler or Disputes Handler). Refunds > ₱25K = two-admin approval required.
- `service_orders.status = 'refunded'`
- A new `refunds` table row (declared in 0023) records:
  - `order_id`
  - `refund_amount_centavos`
  - `reason` (admin-typed)
  - `processed_by_admin`
  - `refund_payout_method` ('bdo_bank' / 'gcash')
  - `refund_payout_reference` (the Setnayan-side bank/GCash transaction reference for the outbound transfer)
  - `processed_at`
- OR-replacement protocol per 0026 fires: original OR is voided, a credit note PDF is generated
- Setnayan Team initiates the outbound transfer **externally** (out-of-app) using the customer's payout details captured at refund-request time
- `refund_processed` email sent per 0028 (NOT the `payment_confirmed` template)
- Service-deactivation hooks reverse the original activation (revoke paparazzi seats, clear monogram flag, etc.)

Partial refunds are V1.5; V1 supports full-order refunds only.

---

## 9. Reference code uniqueness + retry

Reference codes are generated as 8-char Crockford base32 (alphabet `0123456789ABCDEFGHJKMNPQRSTVWXYZ` — ambiguous chars 0/O/1/I/L removed for human readability). Total namespace: `32^8 = 1.099 × 10^12` (~1 trillion).

Generation flow:
1. Generate random 8 chars from the alphabet (40 bits of entropy)
2. Attempt insert into `service_orders` with that code
3. On unique-constraint violation, retry up to 5 times
4. After 5 retries, surface a server error (statistically impossible at any realistic transaction volume)

Codes are case-insensitive in admin search but stored uppercase. The full reference shown to customers includes the `SET-` prefix for visual branding; the prefix is NOT stored in the DB (just the 8-char tail).

---

## 10. Acceptance criteria

| # | Criterion |
|---|-----------|
| 1  | Customer can add multiple SKUs to their cart and the badge in the chrome reflects the count in real time. |
| 2  | Customer can remove or change quantity of any cart_item before checkout; price snapshot is taken at add-to-cart time, not checkout time. |
| 3  | Pressing Checkout creates a `service_orders` row with a unique 10-char Crockford base 32 reference code and 7-day expiry. |
| 4  | Payment screen displays both BDO and GCash QR codes loaded from `payment_receiving_accounts.qr_code_r2_key`. |
| 5  | Customer can upload a payment proof screenshot; `service_order_payments.proof_screenshot_r2_key` resolves to a valid R2 object. |
| 6  | After upload, `service_orders.status` flips from `pending_payment` to `proof_submitted` and the order appears in the admin queue within 5 seconds. |
| 7  | Admin can view the customer's screenshot and the order details side-by-side. |
| 8  | Admin pressing **Approve** transitions order to `paid`, fires the per-SKU service-activation hooks, generates an OR per 0026, and triggers the `payment_confirmed` email per 0028. |
| 9  | Admin pressing **Reject — needs more proof** leaves `service_orders.status` at `pending_payment`, allows the customer to submit a new `service_order_payments` row with `resubmission_count = previous + 1` against the same `order_id`. |
| 10 | Admin pressing **Reject permanently** transitions order to `rejected`; customer can only start a new order. |
| 11 | Internal account checkout (`users.is_internal = TRUE`) skips payment screen, order goes directly to `paid` with `comp_grant_id` populated and no `service_order_payments` row. |
| 12 | Team-pool member with sufficient balance (`team_shared_monthly_allowance.remaining_php >= total`) is fully comped; pool ledger decrements atomically. |
| 13 | Team-pool member with partial balance pays only the difference via standard flow; comp covers the comped portion. |
| 14 | Setnayan Pay vendor-booking orders show the convenience fee (flat 5.0% per 2026-05-16 lock, supersedes earlier same-day 5.5%/6.5%) as a transparent cart line item; vendor receives list price minus gateway fee minus BIR Withholding 0.5% (Option B — vendor absorbs gateway, Setnayan does NOT); verified vendors get immediate full payout, coming_soon vendors get the 3-stage milestone release (20/60/20). |
| 15 | Refund (≤ ₱25K, single admin) transitions order to `refunded`, voids the OR per 0026, fires deactivation hooks, sends `refund_processed` email per 0028. |
| 16 | Reference codes are unique across the entire `service_orders` table; collision retry succeeds within 5 attempts at all realistic transaction volumes. |
| 17 | Orders in `pending_payment` for > 7 days transition to `expired` via scheduled job; expired orders cannot be paid (customer must re-checkout). |

---

## 11. Payment reconciliation module (the cron that helps admin verify payments)

### 11.1 Purpose

Setnayan owns **1 BDO business bank account + 1 GCash business account** (per § 3.5c — the `payment_receiving_accounts` catalog). Every customer payment lands in one of these inboxes as either an SMS notification (BDO Alert), an email notification (BDO-Mail), or a bank/GCash app transaction record. The Transactions Handler / Payments Handler admin's job (§ 9.1 single-admin authority) is to match each inbox arrival to a `service_orders.reference_code` and approve the order.

This module **automates the matching** to save the admin time and to surface high-confidence suggestions alongside every pending order. The FINAL approve / reject decision stays with admin per § 9.1 — the matcher never auto-approves on its own. The matcher only proposes; admin disposes.

### 11.2 Architecture

Three components:

| # | Component | Where it runs |
|---|-----------|---------------|
| 1 | **Inbox ingestion job** | Scheduled Supabase Edge Function · every 5 minutes |
| 2 | **Reference-code matcher** | Postgres SQL function · invoked per parsed message |
| 3 | **Admin matching UI** | Extends 0023 § 3.3 Payments & Activations · React panel beside the customer screenshot |

The flow:

```
BDO/GCash inbox  →  ingestion job  →  payment_inbox_messages row  →  match_inbox_to_order()  →  matched_order_id populated
                                                                          ↓
                                          admin sees suggestion in 0023 § 3.3 alongside customer screenshot
                                                                          ↓
                                              admin clicks Approve / Override / Reject (§ 9.1 single-admin)
```

### 11.3 Inbox ingestion sources (V1)

Three sources are wired in V1; a fourth (GCash for Business API) is queued for V1.5 once Setnayan is granted access.

| Source | Method | Cadence | Notes |
|---|---|---|---|
| **BDO Business Banking SMS** | Forward SMS to a dedicated inbox parser email address (e.g., `bdo-inbox@setnayan.com`) via a phone-based SMS-to-email gateway (Twilio · Globe Labs) **OR** subscribe to BDO's email-notification feature (BDO-Mail) that sends one email per credit transaction | Real-time (push) | ~₱500/month for SMS gateway capacity at V1 volume |
| **GCash transaction history** | GCash for Business has an API in limited beta. V1 fallback: admin manually exports the daily transaction history CSV from the GCash for Business dashboard and uploads it through a Setnayan admin upload form in 0023 § 3.3 | Daily manual CSV upload in V1 · automated polling in V1.5 once API access is granted | The CSV upload form parses each row into a `payment_inbox_messages` insert |
| **Manual override** | Admin can hand-create a `payment_inbox_messages` row from anything they see in their own bank / GCash app (e.g., a payment that arrived during an SMS-gateway outage, or a corporate-name transfer that the SMS parser couldn't parse) | On-demand | `source = 'manual'` · `reviewed_by_admin` populated immediately |

The fourth source (GCash for Business API push) is intentionally NOT in V1. V1.5 adds it as a `source = 'gcash_api'` row type with the same matching pipeline.

### 11.4 Schema additions to 0034

The reconciliation module adds one new table and two indexes. It does NOT alter the 8 canonical tables in § 2; it links to them via FK only.

```sql
-- ============================================================
-- 0034.9: payment_inbox_messages — raw inbox arrivals from BDO/GCash
-- ============================================================
CREATE TABLE payment_inbox_messages (
  message_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source                  TEXT NOT NULL CHECK (source IN ('bdo_sms','bdo_email','gcash_api','gcash_csv','manual')),
  source_message_id       TEXT,                                    -- the BDO/GCash native message ID for dedup
  received_at             TIMESTAMPTZ NOT NULL,                    -- when the inbox message originally landed
  raw_body                TEXT NOT NULL,                           -- the original SMS/email/CSV-row text, unmodified
  parsed_amount_centavos  INT,                                     -- extracted amount, null if parse failed
  parsed_reference_code   TEXT,                                    -- extracted reference code if any
  parsed_sender_name      TEXT,                                    -- the payer's name as the bank/GCash reported it
  parsed_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  matched_order_id        UUID REFERENCES service_orders(order_id),
  matched_payment_id      UUID REFERENCES service_order_payments(payment_id),
  match_confidence        TEXT CHECK (match_confidence IN ('exact','high','medium','low','none')),
  match_method            TEXT CHECK (match_method IN ('reference_code','amount_plus_sender','admin_manual','unmatched')),
  reviewed_by_admin       UUID REFERENCES users(user_id),
  reviewed_at             TIMESTAMPTZ
);

CREATE INDEX idx_inbox_unmatched ON payment_inbox_messages(matched_order_id) WHERE matched_order_id IS NULL;
CREATE INDEX idx_inbox_received  ON payment_inbox_messages(received_at DESC);
CREATE UNIQUE INDEX uq_inbox_source_message_id ON payment_inbox_messages(source, source_message_id) WHERE source_message_id IS NOT NULL;
```

The unique index on `(source, source_message_id)` is the dedup gate — replays of the same BDO SMS or GCash CSV row are rejected at INSERT time, so the ingestion job is naturally idempotent.

### 11.5 The matching algorithm — fuzzy SQL function

When a new `payment_inbox_messages` row lands (either via the ingestion job or a manual admin insert), the Edge Function calls `match_inbox_to_order(message_id)` which runs four tiers of matching from strongest to weakest:

```sql
CREATE OR REPLACE FUNCTION match_inbox_to_order(p_message_id UUID)
RETURNS TABLE (order_id UUID, confidence TEXT, method TEXT)
AS $$
DECLARE
  msg          payment_inbox_messages%ROWTYPE;
  exact_match  UUID;
  amount_match UUID;
BEGIN
  SELECT * INTO msg FROM payment_inbox_messages WHERE message_id = p_message_id;

  -- Tier 1: Exact reference-code match (auto-resolvable)
  -- The customer included our reference code in their transfer note and the amount lines up within ₱1.
  IF msg.parsed_reference_code IS NOT NULL THEN
    SELECT o.order_id INTO exact_match
    FROM service_orders o
    WHERE LOWER(o.reference_code) = LOWER(msg.parsed_reference_code)
      AND o.status IN ('pending_payment','proof_submitted')
      AND ABS(o.total_centavos - msg.parsed_amount_centavos) < 100   -- within ₱1 rounding tolerance
    LIMIT 1;

    IF exact_match IS NOT NULL THEN
      RETURN QUERY SELECT exact_match, 'exact'::TEXT, 'reference_code'::TEXT;
      RETURN;
    END IF;
  END IF;

  -- Tier 2: Amount + recent + sender-name fuzzy (high confidence, admin still reviews)
  -- Customer forgot to add the reference code, but the amount matches an order created within
  -- the last 48 hours AND the bank-reported sender name fuzzy-matches the order's customer name
  -- with pg_trgm similarity > 0.6.
  SELECT o.order_id INTO amount_match
  FROM service_orders o
  JOIN users u ON u.user_id = o.user_id
  WHERE o.total_centavos = msg.parsed_amount_centavos
    AND o.status IN ('pending_payment','proof_submitted')
    AND o.created_at > NOW() - INTERVAL '48 hours'
    AND msg.parsed_sender_name IS NOT NULL
    AND similarity(u.full_name, msg.parsed_sender_name) > 0.6
  ORDER BY o.created_at DESC
  LIMIT 1;

  IF amount_match IS NOT NULL THEN
    RETURN QUERY SELECT amount_match, 'high'::TEXT, 'amount_plus_sender'::TEXT;
    RETURN;
  END IF;

  -- Tier 3: Amount-only fallback (medium confidence — manual review needed)
  -- Same amount could legitimately come from any customer. Surface as a candidate only.
  SELECT o.order_id INTO amount_match
  FROM service_orders o
  WHERE o.total_centavos = msg.parsed_amount_centavos
    AND o.status IN ('pending_payment','proof_submitted')
    AND o.created_at > NOW() - INTERVAL '7 days'
  ORDER BY o.created_at DESC
  LIMIT 1;

  IF amount_match IS NOT NULL THEN
    RETURN QUERY SELECT amount_match, 'medium'::TEXT, 'amount_plus_sender'::TEXT;
    RETURN;
  END IF;

  -- Tier 4: No match — surfaces to the "Unmatched inbox" queue for admin attention
  RETURN QUERY SELECT NULL::UUID, 'none'::TEXT, 'unmatched'::TEXT;
END;
$$ LANGUAGE plpgsql STABLE;
```

`pg_trgm` is enabled cluster-wide for fuzzy name matching. The 0.6 threshold catches "JUAN DELA CRUZ" ↔ "Juan dela Cruz" ↔ "JUAN DELACRUZ" but rejects "JUAN" vs "MARIA".

The Edge Function writes the returned `(order_id, confidence, method)` back into the `payment_inbox_messages` row's `matched_order_id`, `match_confidence`, and `match_method` columns. From there the admin UI takes over.

### 11.6 Parsing regexes (V1 starter set)

The parser lives in the Edge Function (TypeScript), not in SQL. The function takes the raw SMS / email body / CSV row, extracts the three fields (`parsed_amount_centavos`, `parsed_sender_name`, `parsed_reference_code`), and INSERTs into `payment_inbox_messages`.

**BDO SMS — typical format:**

```
BDO ALERT: PHP 2,499.00 deposited to ACCT ****1234. Sender: JUAN DELA CRUZ.
Ref: S89O-A4F2K9R7BX. Bal: PHP X,XXX.XX. Time: 14:32 12/05/26.
```

Extraction:

```ts
const amount    = /PHP ([\d,]+\.\d{2})/.exec(body)?.[1];              // "2,499.00"
const sender    = /Sender:\s+(.+?)\./.exec(body)?.[1];                 // "JUAN DELA CRUZ"
const refCode   = /Ref:\s+(SET-[A-Z0-9]{6,12}|[A-Z0-9]{6,12})/.exec(body)?.[1];
```

**GCash transaction line — typical format:**

```
You received PHP 2,499.00 from Juan Dela Cruz on May 12, 2026 at 2:32 PM.
Ref No.: 1234567890. Note: S89O-A4F2K9R7BX
```

Extraction:

```ts
const amount    = /PHP ([\d,]+\.\d{2})/.exec(body)?.[1];               // "2,499.00"
const sender    = /from (.+?) on /.exec(body)?.[1];                    // "Juan Dela Cruz"
const refCode   = /Note:\s+(.+)$/.exec(body)?.[1]
                ?? /Ref No\.?:\s+([A-Z0-9]{6,12})/.exec(body)?.[1];
```

Parsing failures (e.g., a corporate-pay format we haven't seen) still produce a `payment_inbox_messages` row with `parsed_amount_centavos = NULL` — the row surfaces in the "Unparseable" admin view so the admin can hand-correct and so we can extend the regexes for the next deploy.

### 11.7 Admin reconciliation UI (extends 0023 § 3.3)

The Payments & Activations surface gains a left-rail filter and a right-side suggestion panel.

**Left-rail filter — three sub-views:**

| Tab | Filter | Count badge |
|---|---|---|
| **Pending orders** (existing) | `service_orders.status = 'proof_submitted'` | open orders awaiting admin review |
| **Inbox matches** (NEW) | `payment_inbox_messages` rows with `matched_order_id IS NOT NULL AND reviewed_by_admin IS NULL` | matcher proposed; admin hasn't decided |
| **Unmatched inbox** (NEW) | `payment_inbox_messages` rows with `matched_order_id IS NULL AND reviewed_at IS NULL` older than 1 hour | inbox arrivals that couldn't be matched — admin must investigate |

**Per-order detail view — adds a "Matched inbox messages" panel beside the customer screenshot:**

The panel shows zero, one, or many matched messages with a colored badge per confidence tier:

| Confidence | Badge | Copy template |
|---|---|---|
| `exact` | green check | "Exact reference-code match — JUAN DELA CRUZ paid ₱2,499 at 14:32 via BDO" |
| `high` | amber warn | "Likely match — amount + sender name fuzzy. Review carefully." |
| `medium` | red warn | "Amount-only match — manual review needed; same amount could be a different customer." |
| `none` (no inbox row) | gray | "No matching inbox message yet — customer may not have paid, or admin needs to forward the bank notification." |

**Admin actions per matched suggestion:**

- **Approve with this match** — atomically:
  - `service_orders.status` → `paid`
  - `service_order_payments.reviewed_by_admin` populated
  - `payment_inbox_messages.matched_payment_id` populated (links the inbox message to the specific payment row)
  - `payment_inbox_messages.reviewed_by_admin` + `reviewed_at` populated
  - Service-activation hooks per § 4.4 fire
  - OR generated per 0026
  - `payment_confirmed` email sent per 0028
- **Override match** — opens a picker of other `payment_inbox_messages` rows (e.g., the matcher got it wrong; admin can hand-pick a different inbox message)
- **Reject screenshot — needs more proof** — existing § 4.3 flow; inbox message stays unlinked
- **Reject permanently** — existing § 4.3 flow; inbox message stays unlinked
- **Mark inbox unrelated** — the matcher's suggestion is dismissed; `payment_inbox_messages.matched_order_id` is nulled and `reviewed_by_admin` is populated with a "dismissed" note. The inbox row then re-enters the Unmatched queue for further investigation.

### 11.8 Escalation rules

| Rule | Trigger | Action |
|---|---|---|
| **No-match-for-48-hours** | A `payment_inbox_messages` row has `matched_order_id IS NULL` for > 48 hours | Alert Ops Lead in the admin Home queue (0023 § 3.1). Either a customer paid but never uploaded a screenshot, or admin needs to investigate a fraudulent screenshot, or a corporate transfer with an unrecognizable format needs hand-parsing. |
| **Multiple-matches** | `match_inbox_to_order()` finds 2+ candidates at the same confidence tier | The admin UI shows all candidates as a list with their order summaries; admin picks one. The matcher only auto-fills the most recent at each tier. |
| **Stale order** | `service_orders.status = 'proof_submitted'` for > 48 hours without admin decision | Daily admin reminder banner in 0023 § 3.3 listing the stale orders with elapsed time. |
| **Suspicious-pattern fraud flag** | The same `reference_code` appears in 2+ inbox messages (e.g., a customer screenshotted someone else's confirmation) OR an `exact` match resolves to an order whose `users.user_id` is on the fraud-watch list | Order auto-flagged `fraud_review_pending`; payment activation blocked until two-admin approval per § 9.1. Admin Home queue surfaces a red banner. |
| **Parser failure rate** | > 10% of inbox rows in a rolling 24-hour window land with `parsed_amount_centavos IS NULL` | Engineering alert. A new bank-message format has likely shown up; regex set needs an update. |

### 11.9 Cost

| Line item | Cost | Notes |
|---|---|---|
| Edge Function execution | ~₱0 | Supabase free tier covers 500K invocations/month. Cron runs ~12×/hour × 24 × 30 = ~9,000/month. |
| SMS-to-email gateway (Twilio or Globe Labs) | ~₱500/month at V1 volume | One-way SMS forwarding from a dedicated SIM. Twilio inbound SMS in PH is ~₱0.50/msg; 1,000 BDO alerts/month = ₱500. |
| Storage (`payment_inbox_messages`) | negligible | ~1 KB per row · ~3,000 rows/month · ~3 MB/month. Postgres handles trivially. |
| pg_trgm extension | ₱0 | Comes free with Supabase Postgres. |
| **Total marginal cost** | **~₱500/month for V1** | Scales to ~₱2K/month at 10× volume before the Edge Function tier matters. |

Compared with the labor cost of manual matching (~5 minutes × ~50 orders/day × ~₱200/hr admin loaded cost = ~₱830/day, ~₱25K/month), the module pays for itself many times over.

### 11.10 Build sequence

1. Provision the SMS-to-email gateway (Twilio number or Globe Labs SIM forwarding to `bdo-inbox@setnayan.com`) **OR** activate BDO-Mail email-per-credit notifications on the Setnayan BDO business account.
2. Implement the Edge Function parser (`functions/inbox_ingestion.ts`) — handles SMS / email / CSV row body extraction with the V1 regexes from § 11.6.
3. Implement `match_inbox_to_order()` SQL function in a migration; enable `pg_trgm` extension.
4. Build the admin reconciliation UI panel in 0023 § 3.3 — three left-rail tabs, the matched-messages panel beside the screenshot, the Approve-with-match / Override / Mark-unrelated actions.
5. Seed-test with synthetic inbox messages — generate mock BDO SMS and GCash CSV rows for every confidence tier and confirm the matcher tags them correctly.
6. Run a live test — one Setnayan admin makes a real ₱49 Save-the-Date purchase end-to-end and confirms the full loop fires.
7. Roll out to production behind the `admin_reconciliation_v1` feature flag in 0023; flip on once green for 7 consecutive days.

### 11.11 Acceptance tests

| # | Criterion |
|---|-----------|
| 1  | Exact reference-code match (Tier 1) populates `matched_order_id` with `match_confidence = 'exact'` and `match_method = 'reference_code'`. |
| 2  | Amount + sender fuzzy match (Tier 2) populates with `match_confidence = 'high'`; admin must still click Approve — never auto-approved. |
| 3  | Amount-only match (Tier 3) populates with `match_confidence = 'medium'`; surfaces with red warning in the admin UI. |
| 4  | Tier-4 unmatched produces `matched_order_id = NULL` and `match_confidence = 'none'`; row appears in the Unmatched Inbox tab. |
| 5  | An inbox message older than 48 hours with `matched_order_id IS NULL` triggers an Ops Lead alert in the admin Home queue. |
| 6  | When `match_inbox_to_order()` finds 2+ candidates at the same confidence tier, the admin UI shows all candidates as a list; the matcher auto-fills only the most recent. |
| 7  | Duplicate `(source, source_message_id)` insert is rejected by the unique index; the ingestion job logs the duplicate and continues. |
| 8  | Fraudulent reuse of the same reference code across 2+ inbox messages flags the order `fraud_review_pending`; activation blocked until two-admin approval per § 9.1. |
| 9  | Admin can override the matcher's suggestion and hand-pick a different inbox message via the Override flow. |
| 10 | Approve-with-match atomically populates `service_orders.status = 'paid'`, `service_order_payments.reviewed_by_admin`, `payment_inbox_messages.matched_payment_id`, fires service-activation hooks, generates OR, sends `payment_confirmed` email — all inside a single transaction with rollback-on-failure. |
| 11 | Mark-inbox-unrelated nulls `matched_order_id` and populates `reviewed_by_admin`; the row re-enters the Unmatched Inbox tab. |
| 12 | Parser failure (`parsed_amount_centavos IS NULL`) still produces a `payment_inbox_messages` row; surfaces in an Unparseable filter for admin hand-correction. |
| 13 | pg_trgm `similarity(u.full_name, msg.parsed_sender_name) > 0.6` correctly accepts "JUAN DELA CRUZ" ↔ "Juan Dela Cruz" ↔ "JUAN DELACRUZ" and rejects unrelated names. |
| 14 | Audit log captures admin decision + matcher confidence + match method for every Approve / Override / Reject — full forensic trail per § 9.1. |
| 15 | Parser-failure-rate > 10% in 24h triggers an engineering alert. |

---

## 12. Decision log (iteration-local)

| Date | Decision | Why |
|------|----------|-----|
| 2026-05-12 | **Cart is required pre-checkout state** (not optional). | Every SKU goes through `cart → cart_items → service_orders` even if it's a single-item purchase. Uniform flow simplifies frontend logic and gives users a consistent "review before pay" moment. The cart abstraction also future-proofs bundle discounts and multi-SKU promotions in V1.5. |
| 2026-05-12 | **Price snapshot at add-to-cart time, not checkout.** | Customer adds item at ₱4,999. Admin changes price mid-shopping to ₱5,499 (two-admin approved per § 9.1). Customer pays the snapshotted ₱4,999 because that's what their cart showed. Prevents "bait and switch" customer experience. Trade-off: prices can be stale for hours. Acceptable because cart abandonment timeout is 30 days for active carts; mid-quarter price changes are rare events anyway. |
| 2026-05-12 | **Resubmission stays on the same order_id.** | When admin rejects "needs more proof," the customer doesn't have to re-add items to their cart. Better UX, same order tracking. `resubmission_count` increments for analytics. |
| 2026-05-12 | **10-char Crockford base 32 reference codes (no `SET-` prefix in DB).** | 1 trillion namespace is comfortable for V1; collision math gives a 50% chance of collision at ~1M codes — well beyond realistic V1 volume. Crockford alphabet (no 0/O/1/I/L) eliminates customer-typed errors in transfer notes. Prefix shown to customer only, not stored. |
| 2026-05-12 | **7-day order expiry on `pending_payment`.** | Filipino bank transfers settle within 1–2 business days; 7 days covers weekends + holidays + customer hesitation. After expiry, the customer must re-checkout (which generates a fresh reference code, useful because the prior code may now be polluted with confused customer transfers). |
| 2026-05-12 | **Setnayan Pay 3% fee is a transparent line item.** ~~3% rate~~ **superseded 2026-05-16 — see next rows.** | Hidden fees damage trust. The breakdown surfaces the fee as a separate cart row so customers see exactly what they're paying for. Mirrors how Stripe/PayMongo surface processing fees in their B2C-direct UIs. |
| 2026-05-16 | **Setnayan Pay convenience fee repriced 3% → 5.5%/6.5% on top of vendor price.** ~~5.5%/6.5% dual-rate~~ **superseded same-day — see next row.** | The 3% figure was a placeholder during the manual-reconciliation V1 launch and didn't account for the actual tax wedge (Percentage Tax 3% + LBT 1% + Income Tax 25% = ~28% wedge → 3% gross fee × 72% = 2.16% net which is below operating breakeven once admin time per booking is counted). The morning 5.5%/6.5% lock fixed the breakeven problem but over-collected against the owner's 3% net design target once worst-case tax was considered. |
| 2026-05-16 | **Setnayan Pay convenience fee repriced to flat 5.0% (supersedes morning 5.5%/6.5%) · Option B vendor-absorbs-gateway confirmed · admin-configurable per method but uniform by default · BIR Marketplace Withholding 0.5% pass-through per RMC 8-2024 unchanged · Maya Business as V1.5+ primary gateway with Maya QR Ph (1.5%) preferred rail unchanged · Setnayan absorbs ₱15-25 outbound disbursement fee per payout unchanged · Setnayan Pay gated to verified vendors only (coming_soon vendors pay direct off-platform with Setnayan-managed 3-stage milestone release per 0006) unchanged.** | Owner-ratified design target: **3% net to Setnayan after all taxes at worst-case tier**. Math: 3% / (1 − tax_wedge) → V1 28% wedge needs 4.17% gross; V2 realistic 35% wedge (VAT-registered + LBT 2%) needs 4.62% gross; extreme 40% wedge needs 5.00% gross. 5.0% flat is the minimum gross that holds the 3% net floor under every plausible tax scenario with cushion for chargebacks/failed-transactions/disbursement-fee absorption. Yields by tier: V1 → 3.60% net (1.67× operating breakeven); V2 realistic → 3.25% net (1.50×); extreme → 3.00% net (1.39×). **Option B (vendor-absorbs-gateway) confirmed** over Option A (Setnayan-absorbs-gateway) because (a) Stripe Connect / Airbnb / Lazada Marketplace / every PH marketplace works this way so vendors expect it, (b) it insulates Setnayan from gateway rate risk forever (if Maya raises QR Ph from 1.5% → 2%, vendor absorbs not Setnayan), (c) it lets the headline stay at a clean flat 5.0% without rail-specific math at the cart, and (d) Vendor Studio subscribers can be offered a gateway-absorbed perk in V1.5 as a subscription conversion lever without disturbing V1 economics. The dual-rate 5.5%/6.5% from this morning would have netted ~3.58% V1 and ~3.25% V2 — over-collecting by 0.58pp / 0.25pp against the actual target. Flat 5.0% is the disciplined answer. **Annual revenue impact** vs the morning lock at 500 paying couples × ₱300K avg booking through Setnayan Pay: −₱750K gross / −₱540K net per year — accepted because the 3% net target is achieved exactly and the round-number headline strengthens marketing. |
| 2026-05-17 | **V1.5+ vendor disbursement via Maya Bulk Fund Transfer locked — three-rail routing (Intra-Maya instant+free · InstaPay <1min+₱10 · PESONet EOD+₱15) · default rail per payout type · vendor override in 0022 with ₱5 rebate/upgrade pricing · `disbursement_batches` table + `vendor_payouts.{rail, rail_chosen_by, batch_id, status}` columns added to § 6.9 · failure handling: rejected rows revert to pending + rejoin next-day batch; 3 consecutive failures for same vendor trigger admin alert.** Maya Bank vendor-recruiting copy lives in 0006 Vendor Payout model — "Get paid instantly, free, 24/7 — open a Maya Bank business account" is the canonical onboarding pitch. Setnayan's absorbed disbursement cost stays under 0.3% of platform revenue at every realistic V1.5–V2 scale (₱2,500/yr at 200 couples → ₱65K/yr at 5,000 couples). | Three drivers. **First, operational efficiency vastly outweighs fee savings** — batched disbursement collapses ~5 min/payout click-through to ~5 sec/CSV row; at the 500-couple scale that's ~37 hours/year saved, at 5,000 couples it's ~370 hours/year. **Second, the three-tier rail structure maps to vendor segments cleanly:** Maya Bank vendors win on both sides (instant + free for vendor AND zero cost for Setnayan); InstaPay verified vendors get sub-minute gratification (Setnayan absorbs ₱10); coming_soon milestone releases default to cheap-and-reliable PESONet. **Third, the Maya Bank vendor pitch is structurally aligned** — every account opened benefits both parties forever. Per-recipient bulk pricing is estimated (Maya doesn't publish bulk rates publicly — quote-based per business); locked numbers reconcile to actual Maya Business quote once the merchant account is approved (2-4 week SLA per API Integration Checklist Owner Admin Punch List). |
| 2026-05-17 | **V1 launch payment-system scope confirmed — V1 ships with the manual QR + screenshot reconciliation flow already specced in § 3.3 + § 6.7 Inbound · Maya Business + automated gateway = V1.5+ only · gateway-absorption cap discussion (Path A/B/C/D from 2026-05-16 PM) deferred to V1.5+ Maya merchant-approval milestone · V1/V1.5+ boundary banner added to § 6 preamble.** V1 economics at flat 5.0% with no gateway absorption: ₱5,000 gross × 72% (V1 28% tax wedge) = ₱3,600 net = 3.60% effective → exceeds the 3% net design target by 0.6pp. BDO-to-BDO and GCash-to-GCash transfers are free via InstaPay rails so Setnayan keeps the full convenience fee in V1. | The prior day's Path A/B/C/D conversation was implicitly V1.5+ because it depended on Maya Business gateway fees being live; the spec didn't surface that boundary clearly. Owner's "V1 = manual QR" confirmation closes the thread — V1 ships with the already-specced manual flow at 3.60% net (above target with zero design tension); the V1.5+ gateway-absorption decision waits for the actual Maya quote + production data. No V1 engineering work pending — manual reconciliation flow already shipped (PR #5 + V1 spec locked 2026-05-12). |
| 2026-05-17 | **Setnayan Pay convenience fee minimum floor locked at ₱50 — `fees_centavos = MAX(subtotal_centavos × setnayan_fee_bps / 10000, min_fee_centavos)` where `min_fee_centavos` defaults to 5000 (₱50) in `payment_method_config` per 0023 § 3.5d (admin-configurable per method).** Floor activates only on vendor bookings below ₱1,000 (the 5%-meets-₱50 crossover). Customer-facing copy: "Setnayan Pay convenience fee — 5% per booking, ₱50 minimum." Vendor opt-in (per § 6.8) interaction: if vendor absorbs the fee for a small booking, the ₱50 floor still applies to vendor — protects Setnayan's per-transaction operating cost regardless of which side pays. | Owner pick: ₱50 over ₱150/₱200 alternatives. ₱50 × 72% (V1 28% tax wedge) = ₱36 net per small booking — below the V1 ₱80-130 operating cost band (admin time + disbursement absorption), so Setnayan loses ~₱50-90 on each booking below ₱1,000 in V1. **Accepted trade-off:** sub-₱1K vendor bookings are rare in the wedding category (estimated 1-2% of all bookings; supplies/micro-add-ons only); aggregate annual loss is ~₱720 at 200 couples → ~₱3,600 at 1,000 couples — negligible against platform revenue (rounding error). V1.5+ rebalances cleanly: Bulk Fund Transfer drops admin cost to ₱30-50, so ₱36 net at the floor moves to roughly breakeven. ₱50 anchors close to PH payment-processor flat-fee norms (PayMongo ₱5-15, Stripe ~₱17 equivalent) — feels fair to customers · ₱150 felt punitive on small purchases. **Worked example in § 6.1:** ₱500 booking → ₱50 floor (5% × ₱500 = ₱25, floor wins) → customer pays ₱550 total. Crossover at ₱1,000 booking. |
| 2026-05-16 | **Vendor opt-in to cover the convenience fee — `vendors.absorbs_convenience_fee BOOLEAN DEFAULT FALSE` · "No Convenience Fee" badge when TRUE · cart hides the fee row + customer sees vendor's listed price flat · Setnayan revenue unchanged · snapshot at order-creation onto `service_orders.vendor_absorbed_fee`.** Full vendor-side toggle + financial-preview UI lives in 0022 dashboard; marketplace badge + filter chip in 0006/0022; customer-side cart treatment + worked example in § 6.8 above. | Filipino couples strongly prefer "all-in" pricing — many wedding vendors already absorb platform fees informally. Surfacing this as a first-class opt-in: (a) lets price-competitive vendors compete on transparency without negotiating with Setnayan, (b) gives Setnayan a search-filter chip couples actually use, (c) preserves the canonical 5.0% flat rate regardless of vendor choice (Setnayan's revenue is identical in both options). Worked example at ₱100K booking: Option A (vendor covers) → vendor receives ₱93,100 / ₱92,150 depending on rail; Option B (default) → vendor receives ₱98,000 / ₱97,000. Vendor sacrifices ~5% revenue for the badge — only opt in if conversion lift exceeds ~5%. Toggle financial-preview UI in 0022 makes the cost obvious upfront. Snapshot discipline (flag applies to NEW cart_items only) matches the 2026-05-12 price-snapshot decision. |
| 2026-05-12 | **Service-activation hooks are Postgres triggers + Edge Function dispatchers.** | Triggers handle the simple cases (insert N seats, flip a boolean flag). Edge Functions handle the complex cases (OR generation per 0026, email send per 0028). All hooks are idempotent so re-running on retry is safe. |
| 2026-05-12 | **No automated bank-API integration in V1.** | Manual reconciliation is the V1 design constraint. PayMongo evaluation and GCash Merchant API integration are V1.5 candidates only. The schema is ready to support automation drop-in: `service_order_payments.reviewed_by_admin` becomes nullable for auto-approved payments, and a new `auto_approved_at` column can be added without breaking the manual flow. |
| 2026-05-12 | **Reconciliation matcher proposes; admin disposes.** | The matcher never auto-approves a payment — even at Tier 1 exact-match, admin must click Approve. § 9.1 single-admin authority is preserved end-to-end. Two reasons: (1) PH bank message formats can be spoofed in a forwarded SMS, so an exact-reference-code match alone isn't proof of payment receipt; (2) the V1 manual flow already meets the 24-hr SLA — automation that bypasses admin would skip the human fraud-check layer for a marginal speed gain. The Tier 1 case ends up being a one-click confirmation for admin, which captures ~90% of the labor savings without the trust cost. |
| 2026-05-12 | **Four-tier match cascade (exact → high → medium → none).** | Maps directly to the three legitimate failure modes of customer payment behavior: (Tier 1) customer follows instructions correctly · (Tier 2) customer transferred the right amount but forgot the reference code · (Tier 3) two different customers happened to pay identical amounts within the same week · (Tier 4) no inbox message arrived yet. Each tier has a clear admin-facing affordance — green / amber / red / gray — so the admin reviews the easy cases in seconds and spends real attention only on the medium-confidence ones. |
| 2026-05-12 | **pg_trgm similarity threshold 0.6 for sender-name fuzzy match.** | Calibrated against real PH name variation patterns: "JUAN DELA CRUZ" ↔ "Juan dela Cruz" ↔ "JUAN DELACRUZ" ↔ "J. DELA CRUZ" all score ~0.65–0.85 against the canonical full name. Threshold 0.6 catches all of these without admitting "MARIA SANTOS" vs "JUAN DELA CRUZ" (which scores ~0.15). Tunable later — store as a config row if real-data calibration shifts. |
| 2026-05-12 | **Unique index on `(source, source_message_id)` is the idempotence gate.** | Replays of the same BDO SMS or GCash CSV row are rejected at INSERT time. This means the ingestion job can be safely re-run on failure, the Edge Function cron can overlap a previous invocation, and a CSV upload can be retried by the admin without producing duplicate inbox rows. Cheaper than building dedup logic in application code. |
| 2026-05-12 | **Suspicious-pattern rule — same reference code in 2+ inbox messages flags fraud_review_pending.** | The single highest-value abuse vector for V1 manual reconciliation is screenshotting someone else's confirmation. If the matcher sees the same reference code on two different inbox arrivals (different senders, different amounts, different sources), one of them is fraudulent. Auto-flagging the order escalates to two-admin approval per § 9.1; the legitimate customer pays again, the impostor is investigated. |
| 2026-05-12 | **Parser lives in TypeScript (Edge Function), matcher lives in Postgres (SQL function).** | Two reasons. (1) The regex set will need iteration as new BDO / GCash message formats appear; TypeScript is the right tool for that kind of code churn (better tooling, easier testing, faster deploy). (2) The matching logic touches multiple service-orders rows with similarity / interval queries; Postgres-native SQL is far faster than round-tripping each candidate to the Edge Function. Each tool used where it's strongest. |
| 2026-05-12 | **No GCash Merchant API in V1.** | Limited beta access only; we don't yet have credentials. The schema includes `source = 'gcash_api'` as a placeholder enum value so V1.5 can drop it in without a migration. Daily CSV upload covers V1; it's a 1-minute manual task for the admin in exchange for the same matching pipeline. |

---

## 13. Companion docs

- `0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md` — cart drawer UI lives here on the customer-side Services launcher
- `0022_vendor_dashboard/0022_vendor_dashboard.md` — vendor-side pricing display + Setnayan Pay convenience fee surfacing
- `0023_admin_console/0023_admin_console.md` — § 3.3 Payments & Activations reconciliation queue (consumes this schema)
- `0023_admin_console/0023_admin_console.md` — § 3.5b comp_grants surface (shared with this iteration)
- `0023_admin_console/0023_admin_console.md` — § 3.5c payment_receiving_accounts catalog (QR sources)
- `0026_bir_tax_compliance/0026_bir_tax_compliance.md` — OR generation, voiding, replacement; VAT decision
- `0028_email_notifications/0028_email_notifications.md` — `payment_instructions` / `payment_confirmed` / `payment_proof_rejected` / `refund_processed` templates
- `0032_contract_intelligence/0032_contract_intelligence.md` — `contract_purchases.order_id` FK links contract upgrades to this schema
- `CLAUDE.md` § 9.1 — admin role authority matrix (single-admin vs two-admin approval scope)
- `CLAUDE.md` § 10a — Owner Internal Accounts (permanent comps; payment short-circuit)
- `CLAUDE.md` § 10b — Setnayan Team Shared Monthly Pool (capped consumption pool; first-come-first-served)
- `Setnayan_Vendor_Agreement.md` Refund Rules section — refund policy summary
- `Setnayan_Privacy_and_Security_Policy.md` — payment proof screenshots are PII; retention follows the events 5-year window

---

## V1.2 Amendment — Multi-Payer Cart (added 2026-05-19)

Per [0049 Multi-Payer Cart](../0049_multi_payer_cart/0049_multi_payer_cart.md) and its dependency on [0048 Multi-Moderator Event Access](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md), the cart + checkout flow extends to support multiple payers in V1.2.

### Schema additions to `service_order_line_items`

```sql
ALTER TABLE service_order_line_items
  ADD COLUMN paid_by_role TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN payment_split_percentages JSONB,
  ADD COLUMN added_to_cart_by_user_id UUID NOT NULL REFERENCES users(user_id),
  ADD COLUMN payment_status_per_role JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN private_to_role TEXT[],
  ADD COLUMN hidden_from_role TEXT[],
  ADD COLUMN surprise_for_role TEXT,
  ADD COLUMN visibility_set_by_user_id UUID;
```

Plus new `vendor_order_receipts` table (one row per payer per line item) — see [0049 § Schema](../0049_multi_payer_cart/0049_multi_payer_cart.md) for full definition.

### Cart UX changes

- **Add-to-cart modal** gains payer-attribution picker ("Who's paying for this? Bride / Parent of Bride / Parent of Groom / Ninang Lita / Custom split") + visibility picker (Visible to all / Private / Hide from / Surprise for).
- **Cart view** splits into "Your items" (viewer's tagged items) + "Other moderators' items (FYI)" (read-only). See [0049 § Cart view per role](../0049_multi_payer_cart/0049_multi_payer_cart.md).
- **Checkout button** changes from "Check out" to "Check out my items" — filters to current moderator's tagged items only.
- **Parallel checkout sessions** supported — multiple moderators can be in checkout simultaneously without race conditions (disjoint item sets per moderator).

### Receipt formatting changes

Vendor receipts now show couple name + ceremony date as primary, payer name as secondary line per PH cultural norm. BIR Form 2307 generation extends to per-payer scope per [0026 BIR tax compliance](../0026_bir_tax_compliance/0026_bir_tax_compliance.md).

### Backwards compat

Pattern A (single-payer, whoever checks out pays everything) preserved. Cart items with empty `paid_by_role` array fall back to Pattern A. Existing V1.1 single-couple checkout flow unchanged.

### Phasing

- **V1.2:** Pattern A (preserved) + Pattern B (per-item attribution)
- **V1.3:** Pattern C (split-cost per item with percentage split) + per-role default attribution templates + international card payment for foreign moderators
- **V1.5+:** Cross-payer settlement view (informational; couple settles externally)

---

## Vendor Payment Options — off-platform direct rail (added 2026-06-04)

> Shipped 2026-06-04 (PR #969, merged). Lets a vendor publish their OWN payment destinations so couples pay them **directly, off-platform** — Setnayan takes 0% and never holds the money (RA 11967 non-party-publisher posture). This is the operational UI for the `direct` payment path, distinct from Setnayan Pay (the +3% Setnayan-processed path). Built against the real shipped schema (`vendor_profiles` / `event_vendors` / `event_vendor_payments`), not the earlier draft tables.

### Locked rules (owner, 2026-06-04)
1. **Payment links are Pro & Enterprise only.** QR + bank/e-wallet details are open to all vendor tiers (Free/Verified included). Links are the most-abused surface, so they're reserved for paid, accountable tiers. Enforced server-side (active paid `vendor_pro_weekly`/`all_tools_unlock_annual` order); the couple never sees a non-pro vendor's link.
2. **Standing platform-wide vigilance disclosure.** Anywhere a payment to a vendor is shown or notified, Setnayan must state it does NOT control or hold that money and caution the customer to verify the details + only pay vendors they trust (Setnayan can't reverse/mediate an off-platform payment).

### Schema — `vendor_payment_methods` (migration 20260820000000)
- `payment_method_id` uuid PK · `vendor_profile_id` -> `vendor_profiles` (ON DELETE CASCADE) · `method_type` in {bank, qr, link} · `label` · bank fields (`provider`, `account_name`, `account_number`) · qr (`qr_r2_key`, `decoded_destination`) · link (`link_url`, `link_domain`) · `note` · `is_primary` · `is_shown` · `moderation_status` in {approved, pending_review, held, removed} · `moderation_note` · timestamps.
- RLS at CREATE TABLE: **Pattern A owner** — a vendor CRUDs only rows under their own `vendor_profiles` row. Couples never query this table directly; they read a booked vendor's published methods through a server action (admin client, server-filtered to booked + shown + approved + tier-allowed). Admin moderates via the service role.
- Guards: per-type payload CHECK; partial-unique **one-primary-per-vendor** index; moderation-queue index.
- Plus additive nullable `event_vendor_payments.proof_r2_key` (couple's receipt screenshot in the 0007 budget log).

### Link allowlist + moderation
- Allowlisted provider domains (maya.me · maya.ph · paypal.me · paypal.com · stripe.com · buy.stripe.com · gcash.com · bpi.com.ph · unionbankph.com · qrph.org) publish instantly (`approved`). Off-allowlist links -> `pending_review` (admin clears). URL shorteners (bit.ly, tinyurl, etc.) are blocked outright.
- Admin moderation surface `/admin/payment-options` shows the decoded destination + domain/allowlist check per entry; approve / hold / remove, audit-logged.

### Surfaces (one feature, three actors)
- **Vendor** (`/vendor-dashboard/payment-options`, see 0022): the "How clients pay you" editor.
- **Couple** (per-vendor budget card, see 0007): the `VendorDirectPay` settlement rail — disclosure banner, copyable bank details, QR modal with decoded destination, "leaving Setnayan" interstitial before any link, optional receipt upload.
- **Admin** (`/admin/payment-options`, see 0023): the moderation queue.

### V1 scope notes
- QR **decoded destination is read server-side** (PR #1019, 2026-06-05): on save, Setnayan fetches the uploaded image from R2, rasterises it via `sharp`, and runs `jsQR` to extract the actual payload — so the stored `decoded_destination` is what the QR truly encodes (anti-swap), not a vendor claim. An unreadable image falls back to the vendor's typed note AND routes the method to `pending_review` for admin verification.
- The couple settlement rail is mounted on **both** the per-vendor budget card AND the per-vendor **workspace page** (`.../vendors/[vendorId]/workspace`) — the latter wired in main alongside this feature.
- No email currently notifies an off-platform vendor payment, so the vigilance disclosure lives in-app; if such an email is added, the line goes there.

## First-Party Setnayan Services — inline order-and-pay on the per-service workspace (added 2026-06-05)

> Shipped 2026-06-05 (setnayan-platform PR #981, merged). When a couple opens a finalized **first-party Setnayan service** (an `event_vendors` pick whose marketplace profile is `is_setnayan_service`), the per-service workspace (`/dashboard/[eventId]/vendors/[vendorId]/workspace`) now lets them **pay inline**, and a Setnayan **admin accepts** the payment at `/admin/payments`. This is the **interim** mechanism until the automated payment system goes live **2027-01-01**. Owner directive: *"can we apply this vendor direct-pay to our services as well, and admin will accept the payments?"*

### Distinct from the Vendor Payment Options rail above
This is **not** the off-platform vendor rail. The two are deliberately opposite:

| | Vendor Payment Options (2026-06-04) | First-party Setnayan services (this section) |
|---|---|---|
| Who receives the money | the **third-party vendor**, off-platform | **Setnayan** (its own service) |
| Setnayan's role | 0%, never holds the money (RA 11967) | merchant — Setnayan IS the payee |
| Disclosure | non-custody vigilance banner ("you're paying the vendor directly… Setnayan can't reverse it") | first-party — *"You're paying Setnayan, not a third-party vendor … our team confirms each transfer by hand"* |
| Spine | `vendor_payment_methods` + `event_vendor_payments` | the canonical **apply-then-pay** `orders` + `payments` flow (this iteration) |

Applying the vendor non-custody banner to a first-party Setnayan service would be **wrong** — the money does go to Setnayan — so the copy is the inverse.

### Reuse, not new infra
The whole apply-then-pay spine already shipped; this is purely wiring it onto the workspace for service picks:
- **Couple pays** Setnayan's own BDO/GCash receiving accounts from `platform_settings` (§ 3.4 / § 3.5).
- The existing **`InlineCheckoutDrawer`** (the single-surface pay + screenshot + reference drawer used on the 7 add-on SKU pages) is mounted on the workspace, pre-filled with the service's price + name + the `platform_settings` accounts. Submit lands a real `orders` + `payments` row via the shipped `submitOrderAction`.
- **Admin accepts** at `/admin/payments` (§ 4) — `approvePayment` → payment `matched` (+ optional order `paid`) / reject / request-resubmit, unchanged.
- No schema change, no new payment store, no FK bridge from `event_vendors` to `orders`.

### Order keying + status
- Orders are keyed by a stable `service_key = setnayan_service__{category}`. It won't collide with any pax-priced SKU, so `submitOrderAction` trusts the pick's plan price (no voucher matches — correct, these are plan-priced not promo SKUs). The same key drives the workspace **live status strip** (latest non-terminal order → status pill + reference + amount + Track/upload-proof deep-link), so a couple who already paid sees status instead of re-paying.
- Price precedence mirrors the workspace hero: package locked centavos → snapshot itemized (pesos×100) → host `total_cost_php` (pesos×100). Unpriced picks fall back to a "we'll email instructions" message.
- **V1 limitation:** the per-category key means two distinct Setnayan services in the *same* category on one event share a status lookup. Acceptable for V1 (one-per-category is the norm; the consequence is a slightly-broad status hint, never a money error). A precise per-pick key/link is a fast-follow.

### Surfaces (one feature, three actors)
- **Couple** — the per-service workspace pay panel (this section).
- **Admin** — `/admin/payments` acceptance (§ 4), unchanged; first-party-service orders appear in the same queue as add-on SKU orders.
- **Setnayan ops** — the order carries `service_key = setnayan_service__{category}` + the service name as its description for legibility in the queue.

### Cross-references
- Completes the locked **"in-app services = vendor listings · always-on · add-and-pay via 0034"** model (couple-side memory). Related spec homes: **0006** (vendors management — the service pick), **0021** (couple dashboard — the per-service workspace).
- See `DECISION_LOG.md` 2026-06-05 row.
