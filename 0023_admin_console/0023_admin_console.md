# 0023 — Admin Console (Setnayan Operations Dashboard)

> **Purpose.** The Setnayan internal admin surface — what Setnayan Team operators see and use to run the marketplace. Mirror of 0021 (couple) and 0022 (vendor) for the third role-routed doorway. Concrete answers to: how do we manage vendors, approve verification, confirm payments, set prices, give freebies, resolve disputes, run the Guarantee?
>
> **Status:** drafted 2026-05-11
> **Companions:** `0023_admin_console.html` · `0023_admin_console.docx`
> **Admin in scenario:** Cara Aquino · Setnayan Operations Lead · joined 2026-04 · responsible for verification + payments + disputes

---

## 1. The 8 admin surfaces

The admin logs in at `setnayan.com` → role-router sends them to `/admin/...`.

| # | Surface | URL section | What it does |
|---|---|---|---|
| 1 | **Home** | `/admin` | Queue overview · today's actions · alerts · platform health metrics · Team Pool widget (for team members) |
| 2 | **Verification Queues** | `/admin/verify` | Vendor identity verification + service approval + custom-category review — three queues, one screen |
| 3 | **Payments &amp; Activations** | `/admin/payments` | Customer payment confirmation → service activation hook fires. Refund processing too. |
| 4 | **Users** | `/admin/users` | All customers + vendors + agents · search · per-user detail with actions (suspend, refund, comp, audit log) · 🟣 internal-account + 🟢 team-member badges |
| 5 | **Pricing &amp; Catalog** | `/admin/pricing` | SKU price control · comp / freebie tooling · promo codes · price-history audit · internal accounts (§ 3.5b) · payment-receiving accounts (§ 3.5c) |
| 6 | **Disputes &amp; Refunds** | `/admin/disputes` | Dispute claim queue · mediation flow · refund + replacement-vendor process |
| 7 | **Settings** | `/admin/settings` | Platform-wide config · brand-mark management · feature flags · two-admin approval queue · admin role provisioning |
| 8 | **Website editor** | `/admin/website` | Marketing-site widget management — enable/disable + drag-drop reorder per page (home · /for-vendors · /features · /about). See § 3.10. |

Mobile uses a 5-tab bottom nav: **Home · Queues · Payments · Users · More**. The "More" tab houses Pricing, Disputes, Settings, and Website editor.

---

## 2. The data model · admin actions audit-logged everywhere

Every admin action writes to `admin_audit_log`:

```
admin_audit_log(
  log_id, admin_user_id, action_type, target_table, target_id,
  before_state_json, after_state_json,
  reason, two_admin_approval_id?,
  ip_address, created_at
)
```

Sensitive actions (large refunds, vendor suspensions, brand-mark changes, comp grants &gt; ₱5,000) require **two-admin approval** — another admin must approve before the action executes.

```
two_admin_approvals(
  approval_id, requested_by_admin_id, approving_admin_id,
  action_type, target, payload_json,
  status enum('pending','approved','rejected','expired'),
  requested_at, resolved_at?
)
```

---

## 3. Per-surface mechanics

### 3.1 Home — queue overview

Six summary cards at the top showing how many items are waiting in each queue:

- **Verification queue** — 3 vendors awaiting identity verification, 2 services awaiting approval, 1 custom category proposed
- **Payments awaiting confirmation** — 4 customers paid externally; admin verifies + activates
- **Disputes &amp; Refunds** — 1 active dispute requiring mediation
- **Two-admin approvals pending** — 1 admin is waiting on a second approver
- **New user signups today** — 14 couples, 6 vendors (informational, not actionable)
- **Platform alerts** — anything urgent (Cloudflare R2 quota approaching, Supabase RLS failure, Daily.co outage, etc.)

Below: recent admin activity feed (other admins' actions), platform metrics (DAU, conversion, payments processed today).

### 3.2 Verification Queues

Three sub-queues stacked on one screen:

**3.2a Vendor identity verification** (V1 launch-critical — full flow locked 2026-05-16, see 0006 Verification spec)
- New vendor registers → `vendor_registrations.status = pending_verification`
- Vendor uploads **12-document checklist** (DTI, BIR 2303, Mayor's Permit, gov ID via Persona/Veriff/Onfido, bank micro-deposit proof, 5-10 portfolio samples, 3-5 client references, live selfie + ID liveness, social media presence, AMLC sanctions screening). Category-specific extras for venues / catering / coordinators / high-value vendors.
- Admin reviews: 12-doc checklist completion, Persona/Veriff/Onfido result, AMLC screening, reverse image search on portfolio, schedules the 15-min Google Meet
- Approve → `verification_state = 'verified'`, `last_verified_at = NOW()`, `next_renewal_due_at = NOW() + INTERVAL '1 year'`, Setnayan Pay unlocks for couples, Pro Weekly access granted, Boosted Ads / Sponsored Boost / All Tools Unlock eligibility activates, welcome email sent
- Reject → email vendor with specific document/check that failed
- **Three application types** in queue (color-tagged): initial (FREE), annual renewal (₱1,500), post-demotion (₱2,500)
- 3-5 business-day SLA · auto-page Setnayan Team at 96h
- **Auto-demotion handler:** cron flags any vendor with 3+ disputes within rolling 30 days → `verification_state = 'demoted'` · email vendor with re-verification fee + apply link
- Documents stored in R2 bucket `setnayan-vendor-verification` (90-day rolling raw uploads · 7-year audit-trail retention per BIR § 235)

**3.2b Vendor service approval**
- Vendor publishes a new service → admin reviews per existing 2026-05-09 admin curation decision
- Admin checks: photos are real, pricing isn't predatory, inclusions match the service category
- First service: approval required · subsequent edits: auto-approved unless heuristic triggers (price drops 50%+, new event type added, category change)

**3.2c Custom category review**
- Vendor proposes a new service category (per 0022 §2.1a)
- Admin decides: promote to global canonical taxonomy, keep as private label, or reject
- "First vendor" credit attaches if promoted to global

Each queue item has standard actions: Approve · Reject · Request more info · Flag for senior admin.

### 3.3 Payments &amp; Activations

The activation-hook console from 0020 Phase 5c. For each pending application:

- Customer's application code · package · amount
- Their payment screenshot + order confirmation message
- Side-by-side: Setnayan's BDO + GCash account inboxes (admin clicks to verify the deposit arrived)
- Decision: Verified → activate · Mismatch → contact customer

Activation hook fires per SKU (insert paparazzi_seats × N, flip event-wide monogram flag, etc.). Idempotency enforced at DB level (per MC-07 from 0020).

Refund processing also lives here:
- Customer requests refund (within 14 days of payment per 0003 rules) OR Setnayan dispute resolution triggers a refund
- Admin processes refund: external bank transfer back to customer (no auto-credit) · update `service_applications.status = 'refunded'`

**Dual-role flags (locked 2026-05-15).** Each order row in the queue surfaces two new badge slots when applicable:

- **🟡 Self-purchase** — order's `user_id` equals the SKU's `vendor.owner_user_id` OR sits in `vendor_service_agents.member_id`. The vendor bought their own service via § 3.1a confirm modal and chose **"Pay full price."** Money moves normally; admin reviews like any other payment.
- **🟢 Self-comp** — order's `comp_grant_id` resolves to a `comp_grants` row with `source='vendor_self_comp'`. The vendor self-comped at checkout. No payment to reconcile; admin sees the row only for audit visibility. Filter chip "Self-comp orders" at the top of the queue toggles these in/out of view (default: out).

Both badges are visual only — they do not change the activation hook or the refund mechanics. They exist so an admin reviewing a payment can see at a glance "this is the vendor buying their own product, not a customer purchase."

### 3.4 Users

Master list of every account on the platform. Filterable by account_type (customer / vendor / admin) + verification status + city + spend tier + last-active. **Account-lifecycle filter** (locked 2026-05-13 via PR #9): toggle between **Active users** (default table) and **🚫 Blacklisted** (separate table reading from the new `blacklisted_emails` table).

Per-user detail:
- Identity + contact info
- Wallet / spend history
- Active events / bookings
- Audit log (every action this user has taken)
- Actions:
  - **Reset password**
  - **Issue comp** (see §3.5)
  - **View as user** (impersonation for support)
  - **Send broadcast email**
  - **Suspend account** (two-admin approval required — short-term soft hold; does NOT touch `auth.users` or `blacklisted_emails`)
  - **🗑 Delete** (locked 2026-05-13 · PR #9 · single-admin authority gated by confirmation modal) — **hard-deletes** the `auth.users` row (cascades to `public.users` via FK). Result: the email is **free** for re-signup, even as a different `account_type` (e.g. a former vendor can come back as a customer). The user's audit log + historical orders + comp grants stay in place because those tables reference `user_id` as a FK with `ON DELETE SET NULL` (or are pinned via the iteration 0035 audit-retention pattern). **Self-protection:** the action errors with `"You cannot delete your own account"` if the admin attempts it on themselves; errors with `"Cannot delete an internal account"` for any user flagged `is_internal=TRUE`.
  - **🚫 Blacklist** (locked 2026-05-13 · PR #9 · single-admin authority gated by confirmation modal) — **hard-deletes** the `auth.users` row (same cascade as Delete) **AND** inserts the email into the new `blacklisted_emails` table. Result: the email is **locked** — the signup gate (`apps/web/lib/blacklist.ts` → `isEmailBlacklisted(email)`) intercepts any `auth.signUp` call and redirects to `/signup?error=blacklisted`. Same self-protection + internal-account guard as Delete.
  - **↩ Unblacklist** (visible only on the 🚫 Blacklisted filter table) — removes the row from `blacklisted_emails`. The email becomes free for re-signup (no auth.users row is restored — the original account was hard-deleted at Blacklist time and the user signs up fresh).

**Why two verbs instead of one (PR #9 rationale):** the prior model (PR #7) coupled "occupy the email" with "block sign-in" via a permanent 100-year `auth.users.banned_until` + a soft-delete `users.deleted_at` flag. That fit a banlist use case but blocked the much more common "the user wants to re-register fresh" path the owner spotted — e.g., a vendor wanting to come back as a customer. Splitting into Delete (email free for re-signup) + Blacklist (email locked) matches the user's mental model and gives the admin two clean choices instead of one overloaded verb.

**Vendor-account-only fields (locked 2026-05-15).** When `account_type='vendor'`, the per-user detail page exposes one additional stepper:

- **Self-comp quarterly cap** — read/write integer, default 12, lower-bounded at 0. Backed by the `vendor_self_comp_caps` table from iteration 0034 § 3.1a. Stepper has `Raise` / `Lower` / `Reset to default` actions; every change writes an `admin_audit_log` row with action `vendor_self_comp_cap_changed`, the old and new cap, and a required free-text reason ("vendor in grand-opening period — raised to 40 for Q2"). Single-admin authority. Lowering below current-quarter usage does NOT retroactively revoke grants; it just blocks new ones until the next quarter starts.

**Account-lifecycle schema (locked 2026-05-13 · PR #9):**

```sql
CREATE TABLE public.blacklisted_emails (
  email                    TEXT PRIMARY KEY,
  reason                   TEXT NOT NULL,
  blacklisted_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  blacklisted_by_user_id   UUID NOT NULL REFERENCES public.users(user_id)
);

CREATE INDEX idx_blacklisted_emails_lower
  ON public.blacklisted_emails (LOWER(email));
-- Used by the signup gate's case-insensitive lookup.
```

**RLS:** admin-only via `is_admin()`. No public read; no user-side write.

**Deprecated columns:** `users.deleted_at` (PR #7's soft-delete flag) and `auth.users.banned_until` (PR #7's 100-year ban) are **no longer written to** under the new model. PR #9's migration includes a one-time cleanup that clears any existing `deleted_at` values + lifts any `banned_until` values set by PR #7. The `deleted_at` column stays on the schema for now (deprecated; drop in a future migration once the audit window has passed).

### 3.5 Pricing &amp; Catalog

**SKU price editor.** The full `service_catalog` table editable inline. Every SKU shows: SKU code, name, current PHP price, prior prices (history), is_active. Edit a price → 24-hour delay before taking effect (gives admin time to roll back) · `service_catalog_price_history` records every change.

**Comp / freebie tool.** Admin can grant any SKU free to any user:

```
admin_comps(
  comp_id, granted_by_admin_id, recipient_user_id, sku_code,
  reason enum('customer_support','beta_tester','promotional','dispute_remedy','goodwill'),
  reason_text, expires_at?, redeemed_at?,
  approval_required, two_admin_approval_id?,
  created_at
)
```

Comps &gt; ₱5,000 require two-admin approval. All comps logged in audit + visible on user detail. Beta-tester comps can be batch-issued (CSV upload of email addresses).

**Promo codes.** Admin can create promo codes that any customer can redeem at checkout:

```
promo_codes(
  code, discount_pct? OR discount_fixed_php?,
  applies_to_sku_codes[], max_uses, used_count,
  starts_at, expires_at, is_active
)
```

E.g., LAUNCH50 = 50% off Papic 5-seat for the first 100 redemptions, expires 2026-12-31.

### 3.5b Internal accounts + Team Shared Pool (locked 2026-05-12)

Per Vendor Agreement § 10a + § 10b, Setnayan has two tiers of internal accounts. The admin console surfaces both with distinct badges and management surfaces.

**Tier 1 — Owner / Internal Accounts (§ 10a · 🟣 badge):**

- Owner + spouse ONLY operate as regular customer accounts with `users.is_internal = TRUE`
- Permanent `unlimited_use_grant` covers all in-app SKUs forever (no monthly cap, no expiry)
- 🟣 badge appears next to the user's name everywhere in the admin console (user list, audit log entries, dispute queue, etc.) so any admin reviewing a record knows it's internal
- Excluded from customer-pipeline analytics filters by default (toggle "Include internal" to override)
- **Add internal account:** Settings → Internal Accounts → "Add internal account" button → form (email, role assignment, rationale text). Submission creates a pending two-admin approval request; second admin approves before the `is_internal` flag is set.

**Tier 2 — Setnayan Team Members (§ 10b · 🟢 badge):**

- All other team members (admins + ops staff who are NOT owner / spouse) carry `users.is_team_member = TRUE`
- Draw from a **single shared monthly pool** of in-app credit — see Team Pool widget below
- 🟢 badge ("Team Member · Shared Pool Access") on user records
- Included in customer-pipeline analytics (bounded pool, represents real engagement signal)
- **Add team member to pool eligibility:** Settings → Team Pool → "Add eligible team member" → two-admin approval required

**The Team Pool widget** appears at the top of every team-member's admin dashboard and in Settings → Team Pool:

```
┌─────────────────────────────────────────────────────────────┐
│ Team Shared Pool · May 2026                                 │
│                                                             │
│ Allocated this month     ₱10,000.00                         │
│ Consumed                  ₱3,498.00  (35%)                  │
│ Remaining                 ₱6,502.00                         │
│                                                             │
│ ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  35% │
│                                                             │
│ Forfeited on June 1 if unused. Resets to fresh allocation. │
│                                                             │
│ Recent consumption:                                         │
│   Ana Cruz       Paparazzi 3-seat       ₱1,499  · May 10   │
│   Ben Reyes      AI Edited Highlight    ₱1,999  · May 8    │
└─────────────────────────────────────────────────────────────┘
```

The widget surfaces real-time state so team members can check what's left before placing an in-app order. When `remaining_php = 0`, the widget renders gray with "Pool exhausted for May — fresh ₱X,XXX allocates June 1" copy.

**Pool allocation cadence:**

- Scheduled job runs on the 1st of each month at 00:00 PHT
- Computes prior-month gross platform sales (gross in-app SKU revenue + Setnayan Pay convenience-fee revenue)
- Pool size = `min(0.005 × prior_month_sales_php, 10000)`
- Writes a fresh row in `team_shared_monthly_allowance` (period_month YYYY-MM as PK)
- Closes the prior month's row (`closed_at` stamped), archives for finance audit
- Unused balance is forfeited; never carries over

**Per-consumption ledger:** every order placed by a team-member that draws from the pool writes a row to `team_allowance_consumptions (consumption_id, period_month, user_id, order_id, amount_php, created_at)` — surfaces in the audit log and the widget's "Recent consumption" panel.

**Schema additions for the two internal-account tiers (canonical declaration · referenced by Vendor Agreement § 10a + § 10b, Privacy Policy, and downstream iterations):**

```sql
-- Owner / Internal Accounts (§ 10a) and Team Member pool eligibility (§ 10b) flags
ALTER TABLE users
  ADD COLUMN is_internal     BOOLEAN NOT NULL DEFAULT FALSE,  -- § 10a · owner + spouse only
  ADD COLUMN is_team_member  BOOLEAN NOT NULL DEFAULT FALSE,  -- § 10b · non-owner team eligible for shared pool
  ADD CONSTRAINT users_internal_xor_team CHECK (
    NOT (is_internal = TRUE AND is_team_member = TRUE)  -- mutually exclusive: owners use § 10a unlimited grant, team uses § 10b shared pool
  );

CREATE INDEX idx_users_is_internal     ON users(is_internal)    WHERE is_internal = TRUE;
CREATE INDEX idx_users_is_team_member  ON users(is_team_member) WHERE is_team_member = TRUE;

-- Permanent unlimited-use grant rows (§ 10a — auto-issued at owner/spouse account creation)
CREATE TABLE unlimited_use_grants (
  grant_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(user_id),
  scope         TEXT NOT NULL DEFAULT 'all_services'
                CHECK (scope IN ('all_services','specific_skus')),
  scoped_skus   TEXT[],   -- nullable; populated only when scope = 'specific_skus' (used by VIP external-customer grants, NOT owner/spouse)
  expiry        TIMESTAMPTZ,  -- NULL means lifetime
  retail_value_php INT,     -- nullable; estimated retail value at grant time, used for two-admin gate (> ₱10K)
  rationale     TEXT NOT NULL,
  granted_by    UUID NOT NULL REFERENCES users(user_id),
  approved_by   UUID REFERENCES users(user_id),  -- nullable if internal grant (auto-issued at signup)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at    TIMESTAMPTZ
);

CREATE INDEX idx_unlimited_grants_user ON unlimited_use_grants(user_id) WHERE revoked_at IS NULL;

-- Singleton table — one row per calendar month covering the whole team (§ 10b)
CREATE TABLE team_shared_monthly_allowance (
  period_month   TEXT PRIMARY KEY,  -- 'YYYY-MM'
  allocated_php  INT NOT NULL,
  consumed_php   INT NOT NULL DEFAULT 0,
  remaining_php  INT GENERATED ALWAYS AS (allocated_php - consumed_php) STORED,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at      TIMESTAMPTZ
);

-- Per-spend ledger for team pool draws (§ 10b)
CREATE TABLE team_allowance_consumptions (
  consumption_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_month    TEXT NOT NULL REFERENCES team_shared_monthly_allowance(period_month),
  user_id         UUID NOT NULL REFERENCES users(user_id),
  order_id        UUID NOT NULL,   -- references service_orders(order_id)
  amount_php      INT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_team_consumptions_period ON team_allowance_consumptions(period_month, created_at DESC);
CREATE INDEX idx_team_consumptions_user   ON team_allowance_consumptions(user_id, period_month);
```

The pool-allocation scheduled job (1st of each month at 00:00 PHT) computes `LEAST(prior_month_total_sales_php * 0.005, 1000000)` (₱10K cap in centavos) and inserts a fresh row in `team_shared_monthly_allowance`. The `users_internal_xor_team` CHECK constraint enforces the mutual exclusivity locked in § 10a + § 10b — owners can never accidentally be flagged as team-pool eligible (which would create double-comping ambiguity).

### 3.5c Payment Methods (BDO + GCash receiving account upload)

Setnayan's V1 payment rail is apply-then-pay with static receiving accounts — every customer who applies for an in-app SKU receives a payment-instructions email pointing them at one of these accounts. The accounts are managed in Settings → Payment Methods:

```
┌─────────────────────────────────────────────────────────────┐
│ Payment Methods · receiving accounts                        │
│                                                             │
│  [BDO Bank Transfer]                          🔒 Active     │
│  Account name      Setnayan Ventures Inc.                  │
│  Account number    1234-5678-9012                          │
│  QR code           [view] [replace] [download]              │
│  Last updated      2026-04-12 · by Cara Aquino · approved  │
│                    by Ben Reyes (two-admin)                 │
│                                                             │
│  [GCash]                                       🔒 Active    │
│  Account name      Setnayan Ventures                        │
│  Mobile number     0917-123-4567                            │
│  QR code           [view] [replace] [download]              │
│  Last updated      2026-04-10 · by Cara Aquino · approved  │
│                    by Ben Reyes (two-admin)                 │
│                                                             │
│  [+ Add additional payment method] (V1.5: Maya, UnionBank) │
└─────────────────────────────────────────────────────────────┘
```

**Upload flow:**

1. Admin clicks "Replace QR code" on the BDO or GCash row
2. File upload dialog: PNG or JPG, ≤ 2 MB, must contain a scannable QR code (client-side QR-decode validation runs to confirm)
3. Form asks for: account name, account number / mobile number, optional notes (e.g., "Use this for GCash transfers only · for over-the-counter deposits use the BDO branch ref")
4. **Submission triggers a two-admin approval request** (changing payment-receiving account numbers is a major decision per § 9.1 — fraud risk)
5. Second admin reviews the proposed QR code + account details + initiating admin's rationale
6. On approval, the new QR replaces the active one; the old one is archived with `archived_at` timestamp in `payment_receiving_accounts_history`
7. Customer-facing payment-instructions emails update within 5 minutes (CDN purge on the email template asset)

**Schema:**

```sql
CREATE TABLE payment_receiving_accounts (
    account_id        UUID PRIMARY KEY,
    method            TEXT NOT NULL CHECK (method IN ('bdo_bank','gcash','maya','unionbank')),
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    account_name      TEXT NOT NULL,
    account_number    TEXT NOT NULL,    -- BDO account number OR GCash mobile number
    qr_code_r2_key    TEXT NOT NULL,
    notes             TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by_admin  UUID NOT NULL REFERENCES users(user_id),
    approved_by_admin UUID NOT NULL REFERENCES users(user_id),
    two_admin_approval_id UUID NOT NULL REFERENCES admin_approval_requests(request_id),
    archived_at       TIMESTAMPTZ,
    CHECK (created_by_admin != approved_by_admin)
);
```

**Why this is two-admin gated:** changing the receiving account numbers is the single highest-leverage fraud vector in the V1 payment system. If a compromised admin account silently swaps the BDO account number for an attacker-controlled one, every customer payment for 24 hours could route to the attacker. Two-admin approval makes this attack require simultaneous compromise of two admins, which is dramatically harder. The 24-hour reconciliation SLA means the attack window is bounded even if both admins are compromised — finance sees the diversion the next day.

### 3.5d Payment Method Configuration · admin-configurable per-method fee table (locked 2026-05-16)

V1.5+ when Maya Business goes live as the primary gateway (per 0034 § Setnayan Pay), the admin console exposes a per-payment-method configuration table that controls (a) which rails are visible to couples at checkout, (b) the Setnayan convenience fee charged on top of vendor price, (c) the gateway fee passed through to the vendor, and (d) the preferred-rail flag (Maya QR Ph defaulted).

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Payment Method Configuration · Setnayan Pay rails                                       │
│                                                                                         │
│ Method                  Setnayan fee  Gateway fee  Vendor net*  Preferred  Active       │
│ ───────────────────────────────────────────────────────────────────────────────────     │
│ Maya QR Ph              5.5%          1.5%         97.5%         ★ default  ✅          │
│ GCash direct            5.5%          1.5%         97.5%                    ✅          │
│ Bank transfer (BDO/etc) 5.5%          0% (manual)  99.5%                    ✅          │
│ Maya eWallet            5.5%          2.0%         97.0%                    ✅          │
│ Credit card (Mastercard/│                                                                │
│  Visa)                  6.5%          3.0%         96.5%                    ✅          │
│ OTC (7-Eleven, M Lhuill │                                                                │
│  ier, etc.)             5.5%          1.5%         97.5%                    ✅          │
│                                                                                         │
│ * Vendor net = 100% − gateway fee − BIR Withholding 0.5%                                │
│   Setnayan keeps the 5.5%/6.5% convenience fee gross; pays own taxes from that          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

**Editable per row:** Setnayan convenience fee % · gateway fee % · preferred-rail flag · active toggle. Changes are single-admin authority (light-touch) but logged in `payment_method_config_history` for audit.

**Schema:**

```sql
CREATE TABLE payment_method_config (
    method_key            TEXT PRIMARY KEY,    -- 'maya_qr','gcash_direct','bdo_transfer','maya_ewallet','credit_card','otc'
    display_label         TEXT NOT NULL,
    setnayan_fee_bps      INT NOT NULL,        -- 550 = 5.5%; 650 = 6.5% (basis points)
    gateway_fee_bps       INT NOT NULL,        -- 150 = 1.5%; 300 = 3.0%
    is_preferred_default  BOOLEAN NOT NULL DEFAULT FALSE,
    is_active             BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by_admin      UUID REFERENCES users(user_id)
);

CREATE TABLE payment_method_config_history (
    history_id UUID PRIMARY KEY,
    method_key TEXT NOT NULL,
    snapshot   JSONB NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    changed_by_admin UUID NOT NULL REFERENCES users(user_id),
    change_reason TEXT
);
```

**Why single-admin (not two-admin):** unlike the receiving account number (which is a fraud vector), the per-method fee % is a business-policy lever. Setnayan ops adjust these for promotional periods (e.g., "0% Setnayan fee on Maya QR for Q3 launch push") or to align with renegotiated gateway contracts. Changes ripple to the customer-facing checkout fee calculator (0034 § Setnayan Pay) within 1 minute via cache TTL.

### 3.5e Vendor Tier Perks Management (locked 2026-05-16)

Admin surface to inspect and override per-vendor tier perks (verified vs coming_soon). Per-vendor row in Users surface filters by `verification_state` and exposes:

- **Force tier change** (verified ↔ coming_soon) — single-admin authority for verified → coming_soon (demotion) · two-admin gate for coming_soon → verified outside the normal verification queue (bypass-approval safeguard)
- **Toggle individual perks** — e.g., revoke Setnayan Pay access for a verified vendor without full demotion (used when dispute pattern is borderline)
- **Override 3-stage payout milestones** — admin can manually advance/hold a coming_soon vendor's stage if a couple confirms early or files a dispute
- **View tier history** — `vendor_tier_history` table logs every state change with reason

```sql
CREATE TABLE vendor_tier_history (
    history_id UUID PRIMARY KEY,
    vendor_id  UUID NOT NULL REFERENCES vendors(vendor_id),
    from_state TEXT,
    to_state   TEXT NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    changed_by_admin UUID,           -- nullable for system auto-demotions
    change_reason TEXT,
    related_application_id UUID REFERENCES vendor_verification_applications(application_id),
    related_dispute_count INT         -- for auto-demotions: count of disputes in window
);
```

### 3.6 Disputes &amp; Refunds

The dispute resolution queue. Each claim shows:

- Couple + vendor + service + amount paid (if any · 3% Setnayan Pay convenience fee customers may seek refund of)
- What stage the vendor was at when the breach was reported
- Couple's claim narrative + evidence (chat history, screenshots, file uploads)
- Vendor's response (if provided)
- Recommended refund per dispute resolution policy
- Force majeure flag if applicable

Admin decision:
- **Refund couple** (per dispute resolution policy) — auto-process
- **Find replacement vendor** — opens vendor-search dialog filtered to same city + service + availability
- **Vendor wins dispute** (couple breach) — the disputed amount is released to the vendor (or retained if customer paid directly)
- **Mutual resolution** — partial refund + partial disbursement, manual amounts

All actions log to `dispute_resolutions` + `admin_audit_log`. High-value disputes (&gt; ₱20,000 refund) require two-admin approval.

### 3.6b Force majeure escalation queue (locked 2026-05-12)

When a customer ↔ vendor force-majeure flag exceeds 7 days without auto-resolution, it lands in the Disputes Handler's queue.

**Queue card shows:**
- Flag type + date occurred
- Customer + vendor names + booking amount
- The 4 resolution options each party preferred (if any)
- Chat history snippet (last 10 messages)
- Evidence attachments
- Suggested outcome (Setnayan's policy default for the FM type)

**Disputes Handler actions:**
- Approve one of the 4 outcomes the parties already discussed (auto-applies that resolution)
- Override with a custom resolution (amount + reasoning)
- Reject the FM claim (force majeure not deemed valid — booking proceeds as originally agreed)

All decisions logged with admin attribution. Refunds &gt; ₱25K still require two-admin approval per § 9.1.

### 3.7 Settings

Platform-wide config divided into sections:

- **Brand & marketing** — logo, wordmark, tagline, **active UI Theme (Setnayan Default / Victorian / Classy / iOS / Forest Theme) + color tokens**, all versioned in `brand_config_versions` per memory. **The primary admin's active UI Theme propagates to the public marketing site palette** per 0015 § Voice (accent inheritance via `brand_config_versions.active_theme_id`). New customer / vendor accounts that haven't picked a personal `users.theme_preference` inherit the platform's brand-active theme on first dashboard load. Theme switches at the platform level are subject to the **two-admin approval gate** per § 9.1 (same gate as logo / wordmark / tagline changes — they all move the brand surface).
- **SKU defaults** — default pricing model, default Setnayan Pay convenience fee %, default vendor Pro pricing, default density gates
- **Feature flags** — kill-switch any service (Papic disabled / Panood disabled / etc.) for ops emergencies. Some flags require two-admin approval.
- **Geographic radii** — adjust the 10km marketplace visibility radius, 20km boost density gate, 5km free-transport zone, 30km boosted reach
- **Admin role provisioning** — add/remove admins (two-admin approval required for adding new admins per memory)
- **Audit log viewer** — searchable view of `admin_audit_log` for compliance / post-incident review

### 3.8 Funnel analytics (new 2026-05-12)

The existing admin analytics dashboard tracks revenue / vendor pipeline / customer pipeline / service adoption (W/M/A/Total) — those are aggregate counters. **Funnel analytics** adds a layer answering "where do customers drop off, what's working in conversion."

**V1 funnels tracked:**

1. **Customer signup → first booking:**
   `signed_up → created_event → added_first_vendor → first_payment_confirmed → first_completed_booking`. Drop-off percentage at each step.
2. **Vendor signup → first booking:**
   `submitted_registration → verified → first_service_published → first_inquiry → first_booking_confirmed`. Drop-off at each step.
3. **Guided mode adoption:**
   `entered_guided → set_preferences → received_recommendations → accepted_recommendation → completed_booking`.
4. **DIY mode browse:**
   `opened_browse → applied_filter → clicked_vendor_card → opened_vendor_profile → started_inquiry`.
5. **Save-the-Date funnel:**
   `opened_std_picker → previewed_template → uploaded_clips → purchased_render → shared_render`.
6. **Paparazzi adoption:**
   `viewed_papic_sku → applied_for_papic → paid → seats_claimed → first_photo_uploaded`.
7. **Pro subscription upgrade:**
   `viewed_pro_promo → opened_pro_page → started_checkout → completed_purchase`.

**Implementation:**

```sql
CREATE TABLE funnel_events (
  event_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(user_id),
  session_id      TEXT NOT NULL,
  funnel_key      TEXT NOT NULL,  -- 'customer_signup_to_booking', 'vendor_signup_to_booking', etc.
  step_key        TEXT NOT NULL,  -- 'signed_up', 'created_event', etc.
  step_index      INT NOT NULL,   -- the position in the funnel
  metadata        JSONB,          -- step-specific context (e.g., which vendor was clicked)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_funnel_events_user_funnel ON funnel_events(user_id, funnel_key, created_at);
CREATE INDEX idx_funnel_events_funnel_step ON funnel_events(funnel_key, step_key, created_at);
```

**Admin dashboard surface:**

New tab in 0023 → "Funnels":
- Funnel selector dropdown
- Visual funnel diagram (bar widths proportional to step volume)
- Per-step: count, percentage of prior step, drop-off rate, period filter (W/M/A/Total)
- Cohort breakdowns: by signup date, by event date band, by city
- CSV export
- Compare two periods side-by-side (e.g., "Last week vs prior week")

**Instrumentation responsibility:** each iteration is responsible for emitting funnel events at its key surfaces. Iteration 0001 emits `created_event`; 0006 emits `added_first_vendor`; 0028 emits `first_payment_confirmed`; etc. Spec each iteration's funnel-event emissions in its own .md doc when next touched.

### 3.9 Review moderation queue (locked 2026-05-15)

Companion to the dual-role customer ↔ vendor decision (CLAUDE.md 2026-05-15 + 0006 § "Dual-role customer ↔ vendor — review gate"). Two queues sit here:

**A. Flagged reviews** — existing community-standards moderation. Each row shows the review body, the flagger's reason, vendor name, reviewer name, and three actions: **Unflag & publish** · **Keep flagged (hidden)** · **Permanently strike** (community standards violation, replaces the body with a takedown notice while preserving the rating in vendor stats per § "review permanence" in 0006 Vendor Agreement).

**B. Self-review appeals** — NEW. When `POST /api/v1/reviews` returns `403 SELF_REVIEW_BLOCKED`, the reviewer can submit an appeal via the 0023 Help inbox; the appeal lands here. Each row shows:

| Column | Content |
|---|---|
| **Matched signal** | `owner_self` / `team_member` / `payment_match` / `device_match` / `household_match` (badge color-coded — red for owner/team, amber for payment/device/household) |
| **Reviewer** | name + account_type + link to user detail |
| **Vendor** | name + owner + link to vendor profile |
| **Booking** | event date + service + amount paid |
| **Review payload** | rating + body text + photo thumbnails (the would-be review row, held in a `vendor_review_appeals` staging table — never inserted into `vendor_reviews` until override-published) |
| **Match details** | the specific shared payer reference / device hash / address that triggered the gate (admin can sanity-check whether it's a legit coincidence) |
| **Appeal reason** | reviewer's free-text appeal ("My GCash is also the GCash my mother-in-law uses; she runs a flower shop on Setnayan but I'm not part of her team") |

**Actions:**

- **Override-publish** — insert the review into `vendor_reviews` with a server-side `BYPASS_RELATED_ACCOUNT_GATE` session GUC set on the same transaction. The trigger reads the GUC and skips the related-account check (it still enforces the owner/team CHECK constraint — those gates are NEVER overridable). Admin's user_id + reason is recorded in `vendor_reviews.override_admin_id` + `vendor_reviews.override_reason` (new columns added in this iteration). Single-admin authority — falls below the two-admin threshold per § 9.1 since the worst-case harm (one fake review slips through) is reversible via the existing "Permanently strike" action.
- **Reject appeal** — the appeal row is closed with `decision='rejected'`. Reviewer sees a notification: *"Your appeal was reviewed. The block remains. If you believe this is a mistake, you can email dpo@setnayan.com."*
- **Escalate to two-admin** — admin who feels unsure routes to the two-admin approval flow (§ 4) instead of deciding alone. Soft-routes the same row into the two-admin queue.

**Schema additions:**

```sql
-- Holding pen for would-be reviews awaiting appeal decision.
CREATE TABLE vendor_review_appeals (
  appeal_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id        UUID NOT NULL REFERENCES vendors(vendor_id),
  reviewer_user_id UUID NOT NULL REFERENCES users(user_id),
  event_id         UUID NOT NULL REFERENCES events(event_id),
  booking_id       UUID NOT NULL,
  matched_signal   TEXT NOT NULL CHECK (matched_signal IN ('owner_self','team_member','payment_match','device_match','household_match')),
  review_payload   JSONB NOT NULL,   -- the full review row (rating, body, photos) held for override-publish
  appeal_reason    TEXT NOT NULL,
  submitted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  decided_at       TIMESTAMPTZ,
  decided_by_admin UUID REFERENCES users(user_id),
  decision         TEXT CHECK (decision IN ('override_published','rejected','escalated')),
  decision_reason  TEXT
);

CREATE INDEX idx_review_appeals_pending ON vendor_review_appeals(submitted_at)
  WHERE decided_at IS NULL;

-- New columns on vendor_reviews to track admin override-publishes.
ALTER TABLE vendor_reviews
  ADD COLUMN override_admin_id UUID REFERENCES users(user_id),
  ADD COLUMN override_reason   TEXT;
```

**Audit log.** Every override-publish writes an `admin_audit_log` row with action `review_override_published`, target_id = `review_id`, metadata = `{ vendor_id, matched_signal, appeal_id, reason }`. Reject and escalate decisions log similarly with their own action names.

**Volume expectation.** Filipino dual-account households share payment methods often enough that this queue will see real flow — Setnayan's working estimate is ~5% of all submitted reviews will hit the gate, of which ~80% will be legitimate appeals (couples sharing a GCash with an unrelated vendor). Admin SLA: 48-hour decision target.

---

### 3.10 Website editor (locked 2026-05-15)

Marketing-site widget management surface. Lists every widget in `site_widgets` (iteration 0015 § Widget architecture), grouped by page (Home · For vendors · Features · About). Admin actions in V1:

**Per-widget actions:**
- **Toggle on/off** (`is_enabled`). Disabling a widget hides it from the public site immediately on next page render (cache TTL 60s).
- **Drag-drop reorder** within a page. Saves on drop; reorders affected `display_order` rows in one transaction.

**NOT in V1** (deferred to V1.1):
- Editing per-widget config (stats thresholds · platform store URLs · copy overrides) — these stay code-locked.
- Cross-page widget moves (a widget belongs to one page).
- Widget content/copy editing — the iteration spec is source of truth.
- Per-locale variant overrides — locked to the spec's TL / Sugbuanon translations.

**UI:**

```
┌────────────────────────────────────────────────────────────┐
│  Website editor                              [Home ▾]      │
├────────────────────────────────────────────────────────────┤
│  ⋮⋮  1.  Announcement bar              [✓ enabled]         │
│  ⋮⋮  2.  Hero                          [✓ enabled]         │
│  ⋮⋮  3.  Real numbers                  [✓ enabled] gated   │
│  ⋮⋮  4.  The chaos we're fixing        [○ disabled]        │
│  ⋮⋮  5.  Built for both sides          [✓ enabled]         │
│  ...                                                       │
└────────────────────────────────────────────────────────────┘
```

Each row: drag handle · order # · widget label · enabled toggle · gate-type badge (if any). Tap a widget to expand a detail panel showing its locked config (read-only in V1).

**Authority:** Single-admin authority per § 4.3 (not in the two-admin-approval scope). Reversible — re-enable / reorder is trivial.

**Audit log:** Every toggle and reorder writes an `admin_audit_log` row. Toggle: action `site_widgets_toggle`, target_id = widget_id, before/after `is_enabled` in JSON. Reorder: action `site_widgets_reorder`, target_id = widget_id, before/after `display_order` for affected rows in JSON.

**Mobile:** Lives under "More" tab. Single-column list with drag handles operable via long-press; toggle column on the right.

**Cross-references:** iteration 0015 § Widget architecture; CLAUDE.md decision-log entry 2026-05-15 widget refactor + vendor public_visibility.

---

## 4. Two-admin approval pattern (locked scope per Vendor Agreement § 9.1)

The "four-eyes" two-admin pattern applies ONLY to high-stakes, irreversible, or fraud-adjacent actions. Routine operational work — payment reconciliation, vendor verification, comp gifts within bounds, standard refunds, tier moves within policy — is **single-admin authority** so the team can run the day-to-day at speed.

### 4.1 Mechanics

1. Admin A initiates the action via the admin console UI (e.g., "Add internal account: jane@setnayan.com")
2. Request lands in `admin_approval_requests` with status `pending`, free-form rationale captured
3. Other admins see it in their Home queue under "Two-admin approvals pending" + receive in-app notification
4. Admin B (must be a different person, enforced by `CHECK (approver_id != initiated_by)`) reviews and either:
   - **Approves** → status `approved`, action executes, full audit log entry written with both admin IDs
   - **Rejects** → status `rejected` with Admin B's reason; Admin A is notified
   - **Requests changes** → comments; Admin A revises and re-submits
5. **Expiry:** 7-day decision window. Un-decided requests auto-expire and must be re-initiated.
6. **Bootstrap exception:** when the platform has fewer than 2 admins, the founding Owner can self-promote one additional admin (typically the spouse) without two-admin approval — logged with a `bootstrap=true` audit tag. Single-use; no further exceptions after the second admin exists.

### 4.2 Required for (the "major decisions" list)

| Action | Why two-admin |
|---|---|
| Promote a user to any admin role | Privilege escalation — irreversible damage potential |
| Add an internal account (`users.is_internal = TRUE`, § 10a · 🟣) | Bypasses all billing permanently |
| Add a team member to shared-pool eligibility (`users.is_team_member = TRUE`, § 10b · 🟢) | Grants ongoing pool draw rights |
| Issue an `unlimited_use_grant` worth > ₱10,000 retail to an external customer | Material giveaway |
| Modify Setnayan's static BDO / GCash payment-receiving account numbers (§ 3.5c) | Payment redirection = fraud risk |
| Mid-quarter price change on any in-app SKU | Pricing governance per Vendor Agreement § 8 |
| Vendor force-delisting (revoke tier without due-process timeline) | Vendor protection |
| Refund any single transaction > ₱25,000 | Financial control |
| Re-publish a previously rejected vendor application | Verification integrity |
| Brand-mark version flips (logo, wordmark, tagline) | Marketing governance |
| Platform kill-switch toggles (disable Papic / Panood / etc. globally) | Operational blast radius |
| Bulk price updates affecting > 100 active accounts | Bulk impact |

### 4.3 Single-admin authority (the "lighter decisions" list — NO approval gate)

| Action | Authorized role(s) |
|---|---|
| Accept / reconcile a payment (match BDO inbox or GCash transaction to a `service_orders` reference code, flip `pending_payment → paid`) | Transactions Handler · Payments Handler |
| Approve a vendor verification queue item → Standard Verified | Verification Handler |
| Schedule a Certified on-site visit | Verification Handler |
| Issue a comp gift worth ≤ ₱10,000 retail | Customer Accounts Handler · Vendor Accounts Handler |
| Process a refund ≤ ₱25,000 | Disputes Handler · Payments Handler |
| Suspend / restore a customer account | Customer Accounts Handler |
| Vendor tier upgrade / downgrade within normal policy (Standard → Certified after on-site visit · Certified → Boosted after Boost purchase confirmation) | Vendor Accounts Handler |
| Send a dispute mediation message | Disputes Handler |
| Tag a vendor inquiry / triage inbox routing | Any role with inbox access |
| Adjust customer-pipeline analytics filters | Ops Lead |
| Export an audit log slice | Ops Lead |

### 4.4 Why this scope is right for V1

- **Payment reconciliation is the team's busiest activity.** A 24-hr SLA on dozens of daily payment matches × two-admin per match would mathematically miss the SLA and create a permanent backlog. Single-admin authority with full audit logging captures the fraud-mitigation value without the throughput cost.
- **Vendor verification is queue-grindy.** Verification Handler clears dozens of vendors a week; gating each on a second admin would build a permanent backlog.
- **Comp gifts ≤ ₱10K are forgiving.** Worst case of an over-issued comp at this scale costs less than the throughput hit. Above ₱10K (where the dollar value gets material) flips to two-admin via `unlimited_use_grant` policy.
- **Major decisions are infrequent.** New admin promotions, internal-account creation, payment-account changes, mid-quarter pricing moves happen weekly or less — friction is a feature, not a bug, on those.

### 4.5 Schema

```sql
CREATE TABLE admin_approval_requests (
    request_id          UUID PRIMARY KEY,
    initiated_by        UUID NOT NULL REFERENCES users(user_id),
    action_type         TEXT NOT NULL,  -- 'promote_admin' | 'add_internal_account' | 'change_payment_account' | etc.
    payload_json        JSONB NOT NULL, -- the proposed change details
    rationale           TEXT NOT NULL,  -- Admin A's free-form reason
    status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','approved','rejected','expired')),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    approver_id         UUID REFERENCES users(user_id),
    decided_at          TIMESTAMPTZ,
    decision_reason     TEXT,
    CHECK (approver_id IS NULL OR approver_id != initiated_by)
);

CREATE INDEX idx_approval_requests_pending ON admin_approval_requests(status) WHERE status = 'pending';
CREATE INDEX idx_approval_requests_expires ON admin_approval_requests(expires_at) WHERE status = 'pending';
```

---

## 5. Mobile vital-info rule (inherited)

Mobile admin is for **urgent approvals on the go**, not detailed work:

- Home shows queue counts and the top 3 urgent items
- Queues stack vertically with quick-approve buttons
- Per-user / per-dispute detail opens as a full-screen sheet
- Settings is mostly desktop-only (config work is detail-heavy)

---

## 6. Cross-iteration handoffs

- **0000** — admin sees couples + vendors created via 0000's account flow
- **0015** — vendor_registrations form data lands in admin verification queue
- **0006** — vendor catalog edits flow through admin service approval
- **0020** — admin payment confirmation queue is the activation rail (Phase 5c)
- **0021** — admin can impersonate couples for support
- **0022** — admin sees vendor side; can approve / reject custom category proposals; processes dispute claims
- **All iterations** — admin_audit_log captures every action across the platform

---

## 8. Navigation entry points for V1 features (locked 2026-05-12)

Iterations 0024–0035 + CLAUDE.md decisions (§ 9.1 / § 10a / § 10b) were drafted after the admin console's 7 surfaces were locked. This table closes the gap — every admin-side feature has one canonical entry point.

| Feature | Iteration | UI entry point |
|---|---|---|
| Profile & account settings | 0025 | Top-right profile avatar → dropdown → "Settings" |
| Email notification preferences | 0028 | Settings → "Notifications" tab |
| Help & FAQ | 0029 | Top-right profile avatar → dropdown → "Help" · also a `?` icon in every surface header |
| Replay guided tour | 0030 | Settings → "Tour" tab → "Replay first-time tour" button |
| Help Center content management | 0029 | Pricing & Catalog surface adds a "Help Articles" panel; admins can edit FAQ entries |
| Observability dashboard | 0035 | Home surface adds an "Operations" card linking to status.setnayan.com (Better Stack); also direct deep-link from Settings |
| Two-admin approval queue | CLAUDE.md § 9.1 | Home surface "Two-admin approvals pending" card opens the queue |
| Internal accounts management | CLAUDE.md § 10a | Settings → "Internal Accounts" tab (purple-badge) |
| Team Pool widget | CLAUDE.md § 10b | Settings → "Team Pool" tab (green-badge), or quick widget on admin Home surface |
| Public API admin | 0033 | Settings → "Public API" tab → OAuth client management |
| Sign out | — | Top-right profile avatar → dropdown → "Sign out" |

**Canonical profile-avatar dropdown layout.** The top-right avatar opens a single consistent menu across all three V1 dashboards (couple · vendor · admin): **Settings · Notifications · Help · Tour replay · Sign out**. Admin-specific affordances (Internal Accounts, Team Pool, Public API) surface inside Settings tabs rather than as top-level menu items, so the menu stays short and the pattern recognizable when an admin with multiple roles switches views.

---

## 7. Companions and next steps

- `0023_admin_console.html` — interactive 7-surface walkthrough
- `0023_admin_console.docx` — stakeholder mirror
- The admin console is operationally critical for Setnayan launch · ships alongside 0015 (marketing site)
