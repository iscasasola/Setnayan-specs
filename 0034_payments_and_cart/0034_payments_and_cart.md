# Iteration 0034 — Payments & Cart Flow

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
-- ============================================================

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
  fees_centavos           INT NOT NULL DEFAULT 0, -- Setnayan Pay convenience fee (5.5%/6.5% per method, admin-configurable 2026-05-16); on vendor-booking orders only
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
- Applicable fees (Setnayan Pay convenience fee — 5.5% / 6.5% per method, admin-configurable per 2026-05-16 lock — appears only when at least one cart_item is a vendor booking; none in pure in-app SKU carts)
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
   - `fees_centavos` = applicable convenience fee (3% if Setnayan Pay; 0 otherwise)
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
| `guided_planner_1week`  | Call `activate_guided_planner(event_id, '1week', order_id)` — sets `events.guided_planner_status='active'`, `guided_planner_tier='1week'`, `guided_planner_expires_at = NOW() + INTERVAL '7 days'` (extends existing expiry if already active) |
| `guided_planner_3month` | Same handler with `'3month'` tier; expires_at = NOW() + INTERVAL '13 weeks'    |
| `guided_planner_12month`| Same handler with `'12month'` tier; expires_at = NOW() + INTERVAL '52 weeks'   |

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

## 6. Setnayan Pay convenience fee — 5.5% on top of vendor price (locked 2026-05-16)

When the order is a vendor booking routed through Setnayan Pay (not an in-app SKU), a **5.5% convenience fee** is added **on top of** the vendor's listed price. The vendor receives their list price (less terminal/gateway fee + BIR Withholding); Setnayan keeps the 5.5% convenience fee as gross revenue.

**The previous 3% figure is RETIRED 2026-05-16.** All references to `fees_centavos = subtotal × 3%` in this document should be read as `fees_centavos = subtotal × convenience_fee_bps_for_method / 10000` (admin-configurable per payment method via 0023 § 3.5d).

### 6.1 Couple-facing cart math

**Example A — Maya QR Ph (preferred default rail · 5.5% Setnayan fee):**

Vendor's listed price is ₱100,000.

```
Subtotal (vendor list price)              ₱100,000.00
Setnayan Pay convenience fee (5.5%)         ₱5,500.00
──────────────────────────────────────────────────────
Total                                     ₱105,500.00
```

In centavos:
- `subtotal_centavos = 10000000`
- `fees_centavos = 550000` (5.5% of 10,000,000 centavos)
- `total_centavos = 10550000`

**Example B — Credit card (premium rail · 6.5% Setnayan fee):**

```
Subtotal (vendor list price)              ₱100,000.00
Setnayan Pay convenience fee (6.5%)         ₱6,500.00
──────────────────────────────────────────────────────
Total                                     ₱106,500.00
```

### 6.2 Vendor side of the ledger

The vendor's net payout is the vendor list price minus (a) gateway/terminal fee + (b) BIR Marketplace Withholding 0.5%. **Setnayan does NOT deduct any commission from the vendor side** — the 5.5%/6.5% convenience fee is paid by the couple on top.

| Rail | Gateway fee | BIR Withholding | Vendor net on ₱100K | Effective burden |
|---|---|---|---|---|
| Maya QR Ph (preferred) | 1.5% | 0.5% | ₱98,000 | 2.0% |
| GCash direct | 1.5% | 0.5% | ₱98,000 | 2.0% |
| Bank transfer (BDO/etc) | 0% (manual) | 0.5% | ₱99,500 | 0.5% |
| Maya eWallet | 2.0% | 0.5% | ₱97,500 | 2.5% |
| Credit card | 3.0% | 0.5% | ₱96,500 | 3.5% |
| OTC | 1.5% | 0.5% | ₱98,000 | 2.0% |

Setnayan absorbs the **₱15-25 outbound disbursement fee** per payout — the vendor sees the nominal "net of gateway + BIR" figure on their dashboard without an additional disbursement deduction.

### 6.3 Setnayan's gross / net at V1 tax tier

For a ₱100K booking via Maya QR Ph:

- **Setnayan gross:** ₱5,500 (the 5.5% convenience fee)
- **Setnayan pays its own taxes** from this gross: Percentage Tax 3% (NIRC § 116, non-VAT under ₱3M annual gross threshold) + LBT 1% + Income Tax 25%
- **Setnayan V1 tax tier net:** ~₱3,960 (3.96% effective)
- **Setnayan worst-case V2 tax tier net** (12% VAT + 35% IT): ~₱3,143 (3.14% effective)

### 6.4 BIR Marketplace Withholding (per RMC No. 8-2024)

Setnayan acts as the **withholding agent** for the 0.5% BIR Marketplace Withholding (1% × 50% under RMC 8-2024). For each vendor payout:

1. Setnayan computes BIR withholding = `vendor_subtotal_centavos × 50 / 10000` (0.5%)
2. Setnayan remits the withheld amount to BIR each month (BIR Form 1601-EQ)
3. Setnayan issues the vendor a **BIR Form 2307** quarterly — creditable against the vendor's own income-tax liability
4. The withholding line appears on the vendor's payout breakdown in 0022 Vendor Dashboard

### 6.5 Verified-only Setnayan Pay gate (locked 2026-05-16)

**Couples can ONLY use Setnayan Pay with verified vendors.** Coming_soon vendors are paid direct off-platform (couple pays the vendor's own BDO / GCash account, Setnayan tracks the milestone via 3-stage release per 0006 Payout model). The Setnayan Pay rail is the verification flow's primary unlock.

### 6.6 Payment gateway sequencing

- **V1 launch:** manual reconciliation — current 0034 flow (BDO / GCash QR + screenshot upload + admin approve). No automated gateway.
- **V1.5+:** **Maya Business** as the primary gateway. Maya QR Ph (1.5% gateway fee) is the **preferred default rail** at checkout. Per-method admin config (0023 § 3.5d) controls: Maya QR / Bank transfer / GCash direct / Maya eWallet / Credit card / OTC.
- **Daily.co video meetings retired** as part of the same 2026-05-16 lock — no longer a billing line item.

### 6.7 Schema updates

```sql
ALTER TABLE service_orders ADD COLUMN setnayan_fee_bps INT DEFAULT 550;
ALTER TABLE service_orders ADD COLUMN gateway_fee_centavos INT DEFAULT 0;
ALTER TABLE service_orders ADD COLUMN bir_withholding_centavos INT DEFAULT 0;
ALTER TABLE service_orders ADD COLUMN vendor_net_centavos INT DEFAULT 0;
ALTER TABLE service_orders ADD COLUMN disbursement_fee_centavos INT DEFAULT 0;   -- absorbed by Setnayan, tracked for finance
ALTER TABLE service_orders ADD COLUMN payment_method_key TEXT;   -- FK to payment_method_config.method_key

CREATE TABLE vendor_payouts (
    payout_id              UUID PRIMARY KEY,
    vendor_id              UUID NOT NULL REFERENCES vendors(vendor_id),
    order_id               UUID NOT NULL REFERENCES service_orders(order_id),
    payout_stage           TEXT CHECK (payout_stage IN ('immediate','reservation_20','pre_event_60','post_event_20')),
    gross_centavos         INT NOT NULL,
    gateway_fee_centavos   INT NOT NULL,
    bir_withholding_centavos INT NOT NULL,
    net_centavos           INT NOT NULL,
    disbursement_method    TEXT CHECK (disbursement_method IN ('maya','gcash','bdo_transfer')),
    disbursement_fee_centavos INT NOT NULL DEFAULT 0,    -- absorbed by Setnayan
    initiated_at           TIMESTAMPTZ,
    completed_at           TIMESTAMPTZ,
    bir_form_2307_r2_key   TEXT
);
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
| 14 | Setnayan Pay vendor-booking orders show the convenience fee (5.5% / 6.5% per method per 2026-05-16 lock) as a transparent cart line item; vendor receives list price minus gateway fee minus BIR Withholding 0.5%; verified vendors get immediate full payout, coming_soon vendors get the 3-stage milestone release (20/60/20). |
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
| 2026-05-12 | **Setnayan Pay 3% fee is a transparent line item.** ~~3% rate~~ **superseded 2026-05-16 — see next row.** | Hidden fees damage trust. The breakdown surfaces the fee as a separate cart row so customers see exactly what they're paying for. Mirrors how Stripe/PayMongo surface processing fees in their B2C-direct UIs. |
| 2026-05-16 | **Setnayan Pay convenience fee repriced 3% → 5.5% on top of vendor price (admin-configurable per payment method · cheap rails 5.5% / premium rails 6.5%) · BIR Marketplace Withholding 0.5% pass-through per RMC 8-2024 · Maya Business as V1.5+ primary gateway with Maya QR Ph (1.5%) preferred rail · Setnayan absorbs ₱15-25 outbound disbursement fee per payout · Setnayan Pay gated to verified vendors only (coming_soon vendors pay direct off-platform with Setnayan-managed 3-stage milestone release per 0006).** | The 3% figure was a placeholder during the manual-reconciliation V1 launch and didn't account for the actual tax wedge (Percentage Tax 3% + LBT 1% + Income Tax 25% = ~28% wedge → 3% gross fee × 72% = 2.16% net which is below operating breakeven once admin time per booking is counted). 5.5% lands at ~3.96% net at V1 tax tier — actually profitable per booking. The on-top model preserves vendor pricing autonomy (vendor sets list price without absorbing platform commission); the BIR withholding pass-through delegates BIR's marketplace withholding agent role to Setnayan cleanly; Maya Business unlocks the gateway automation. |
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
