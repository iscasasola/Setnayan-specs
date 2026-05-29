# 0023 — Admin Console (Setnayan Operations Dashboard)

> **Purpose.** The Setnayan internal admin surface — what Setnayan Team operators see and use to run the marketplace. Mirror of 0021 (couple) and 0022 (vendor) for the third role-routed doorway. Concrete answers to: how do we manage vendors, approve verification, confirm payments, set prices, give freebies, resolve disputes, run the Guarantee?
>
> **Status:** drafted 2026-05-11
> **Companions:** `0023_admin_console.html` · `0023_admin_console.docx`
> **Admin in scenario:** Cara Aquino · Setnayan Operations Lead · joined 2026-04 · responsible for verification + payments + disputes

---

## 1. The 28 admin surfaces

The admin logs in at `setnayan.com` → role-router sends them to `/admin/...`. Surface count refreshed 2026-05-23 to enumerate ALL shipped admin routes — the prior 11-surface table (2026-05-18) listed only the speced surfaces and silently missed the 12 operational surfaces that shipped during the V1 build burst (Funnels, Payouts, Receipts, BIR 2307, Ads, Demo vendors, Events, Help inbox, Force majeure, Moodboard library, Operations & Hiring, Taxonomy, plus Reviews). The 4 missing-from-code surfaces from the prior table (Disputes, Pricing, Add-on Management, Concierge Brain) all shipped in the 2026-05-23 admin alignment batch ([PRs #419 · #420 · #421 · #423](https://github.com/iscasasola/setnayan-platform/pulls?q=is%3Apr+merged%3A2026-05-23)). Table below is grouped by the actual `apps/web/app/admin/_components/admin-nav.tsx` structure so spec readers see what an admin sees on the left rail.

| Group | # | Surface | URL section | What it does |
|---|---|---|---|---|
| — | 1 | **Overview** | `/admin` | Queue summary · today's actions · alerts · platform health · Team Pool widget (§ 10b · 🟢 team-member accounts) |
| Queues | 2 | **Verification** | `/admin/verify` | Vendor identity verification + service approval + custom-category review · 12-doc checklist (§ 3.2) |
| Queues | 3 | **Payments** | `/admin/payments` | Manual BDO/GCash reconciliation → activation hook · refund processing (§ 3.3) |
| Queues | 4 | **Reviews** | `/admin/reviews` | Review moderation queue · self-review gate appeals (per 2026-05-15 dual-role lock — single-admin override-publish authority) |
| Queues | 5 | **Help inbox** | `/admin/help` | Customer + vendor support tickets · topic-routed (per 0029 Help Center) · structured contact-form intake |
| Queues | 6 | **Force majeure** | `/admin/force-majeure` | Force-majeure mediation escalations from chat threads · couple-side & vendor-side date/venue change flows (per 0019 § force majeure) |
| Queues | 7 | **Concierge abuse** | `/admin/concierge-abuse` | Multi-account trial-cycling review · tiered enforcement (warning → trial ban → full ban) per § 3.11 · added 2026-05-17 |
| Queues | 8 | **Disputes** | `/admin/disputes` | Dispute claim queue reading `vendor_disputes` · status + category filters · stats banner · V1 read-only list; detail + resolve actions V1.x · TIER 2 venue-scan self-claim sub-queue (per 2026-05-22 unified QR lock — § 3.6 + cross-ref) · added 2026-05-23 |
| Directory | 9 | **Users** | `/admin/users` | All customers + vendors + agents · search · per-user detail with actions (suspend, refund, comp, audit log) · 🟣 internal-account + 🟢 team-member badges |
| Directory | 10 | **Events** | `/admin/events` | All events directory · admin actions (force-end, delete, archive, lifecycle-phase override) |
| Directory | 11 | **Vendors** | `/admin/vendors` | Vendor profiles directory · per-vendor edit form at `/admin/vendors/[vendorProfileId]/edit` |
| Directory | 12 | **Venues** | `/admin/venues` | Venue directory · new venue CTA at `/admin/venues/new` · detail at `/admin/venues/[id]` |
| Directory | 13 | **Demo vendors** | `/admin/demo-vendors` | Demo vendor management for pre-launch + pilot mode (§ pilot scope per [[project_setnayan_pilot_timeline]]) |
| Money | 14 | **Payouts** | `/admin/payouts` | Vendor payout dispatch + Maya Bulk Fund Transfer batches (V1.5+) · manual reconciliation · 3-stage milestone tracking for coming_soon vendors (per 2026-05-17 disbursement lock) |
| Money | 15 | **Pricing** | `/admin/pricing` | Read-only SKU catalog reading `service_catalog` · category + active-state + billing-model filters · stats banner · V1 read-only; edit form + Cost Watch + price-history audit ship V1.x (per 2026-05-22 read-mostly admin pattern) · added 2026-05-23 |
| Money | 16 | **Receipts** | `/admin/receipts` | BIR-compliant Official Receipts per order · per-order audit (per 0026 BIR compliance) |
| Money | 17 | **BIR 2307** | `/admin/bir/2307` | Quarterly Form 2307 PDFs for vendor EWT reporting (per 0026 BIR compliance) |
| Money | 18 | **Ads** | `/admin/ads` | Boosted Ads + Sponsored Boost vendor management (per 0022 § 5b vendor marketing tiers) |
| Money | 19 | **Payment methods** | `/admin/settings/payment-methods` | Per-method config (rates · eligibility per account type · active flag) · read-only V1 banner pattern · also reachable from Settings group below |
| Content | 20 | **Taxonomy** | `/admin/taxonomy` | Vendor canonical_services taxonomy management — 192-row v11 taxonomy across 12 wedding folders (per 2026-05-20 marketplace remap) |
| Content | 21 | **Website editor** | `/admin/website` | Marketing-site widget management — enable/disable + drag-drop reorder per page (home · /for-vendors · /features · /about) · see § 3.10 |
| Content | 22 | **Add-ons** | `/admin/addons` | App Store-style card view of customer SKUs reading `service_catalog` + `feature_policy` · Pricing Report download generates `Pricing.md` snapshot from live DB · per-card eligibility dots · vendor add-ons tab Coming soon · added 2026-05-23 (V1 single tab; V1.x adds per-SKU drawer + vendor tab + edit affordances) |
| Content | 23 | **Concierge brain** | `/admin/brain` | Browse `concierge_brain_chunks` grouped by 8 topic files (Filipino Cultural Reference · Regional Pricing Benchmarks · Seasonal Weather · Planning Timelines · Legal BIR · Setnayan Feature Reference · Vendor Decision Logic · Budget Allocation) · paid-tier-only badge · is_stale flag · hit_count_30d · pilot banner ("Concierge is OFF for pilot — content authoring lands ahead of post-pilot launch") · V1 read-only browse; Unanswered Questions queue + Cost Watch + per-chunk re-embed land V1.x · added 2026-05-23 |
| Content | 24 | **Moodboard library** | `/admin/moodboard-library` | Higgsfield-generated asset library + Color Range Manipulator + treatment specializations (ceiling · wall · surroundings · tunnel) per 2026-05-21 Visual preview pillars lock |
| Operations | 25 | **Hiring & Growth** | `/admin/operations-hiring` | Owner-only growth cockpit · hiring forecasts · bottleneck signals (verification backlog · support response time · engineering blockers · marketing pipeline · disputes volume · founder time) · pulse model state (per 2026-05-20 hiring predictive guide lock) |
| — | 26 | **Funnels** | `/admin/funnels` | PostHog funnel deep-links · conversion analytics · ext-link to PostHog dashboard for cohort + retention views |
| Settings | 27 | **Platform settings** | `/admin/settings` | Brand-mark management · feature flags · two-admin approval queue · admin role provisioning · internal accounts (§ 3.5b) · payment-receiving accounts (§ 3.5c) · BIR config (§ 3.5d) · feature-policy grid (§ 3.5e — V1.x) · payment-method policy matrix (§ 3.5f — V1.x) · brand-active UI theme picker (per 2026-05-15 theme system lock) · Setnayan Pay convenience-fee rate config (per 2026-05-17 row 16) |
| Settings | 28 | **Demo mode** | `/admin/settings/demo-mode` | Demo-mode toggle for pre-launch + pilot · feeds `NEXT_PUBLIC_PILOT_MODE_FREE_UNTIL` env-derived state |

**Sub-routes accessible via parent list pages** (not standalone nav entries):
- `/admin/disputes/[disputeId]` — dispute detail + resolve actions (V1.x)
- `/admin/force-majeure/[flagId]` — force-majeure flag detail
- `/admin/vendors/[vendorProfileId]/edit` — vendor profile edit form
- `/admin/venues/[id]` — venue detail · `/admin/venues/new` — create form
- `/admin/pricing/[skuCode]` — SKU detail + edit form (V1.x)
- `/admin/addons?sku=<sku_code>` — expanded card via URL state (Finder-column pattern per PR #367)
- `/admin/addons/pricing-report` — `Pricing.md` snapshot download route handler

Mobile uses a 5-tab bottom nav: **Home · Queues · Directory · Money · More**. The "More" tab houses Content + Operations + Funnels + Settings.

> **Vendor TIER 2 self-claim moderation · cross-reference (2026-05-22):** The vendor scan-at-venue flow locked 2026-05-22 (per [0002 § Unified QR Code Lifecycle Model](../0002_qr_invitation_system/0002_qr_invitation_system.md) + [0006 § Vendor scan at venue · TIER 1 / TIER 2](../0006_vendors_management/0006_vendors_management.md)) routes TIER 2 self-claims into the existing 4-layer moderation pipeline locked 2026-05-20 (vendor verified + canonical service coverage + active-in-city + couple veto + admin). Admin review queue lives on surface 6 (Disputes & Refunds) as a new sub-queue alongside the existing dispute claim queue — claims tagged `claim_source = 'venue_qr_scan'` get a +5% bump in auto-approval probability (physical presence at the venue at event-time is a strong legitimacy signal). The 48-hr SLA from the 2026-05-20 lock applies. Anti-spam caps (5 claims/day · 3 rejections in 30 days = 30-day ban · couple permanent block) inherited from 2026-05-20.

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

**SKU price editor — full grid (locked 2026-05-17 update).** The full `service_catalog` table editable inline. Every SKU row shows:

| Column | Source | Notes |
|---|---|---|
| SKU code | `service_catalog.sku_code` | Read-only after creation |
| Name | `service_catalog.name` | Editable |
| Category | `service_catalog.category` | Editable; drives admin filter chips |
| Current PHP price | `service_catalog.price_php_centavos` | Editable; 24-hour delay |
| Time recurrence | `service_catalog.time_recurrence` | Editable dropdown: One-time / Weekly / Quarterly / Annual / Lifetime |
| Event scope | `service_catalog.event_scope` | Editable dropdown: Per event / All events |
| Multi-purchase | `service_catalog.is_multi_purchase` | Toggle |
| Active | `service_catalog.is_active` | Toggle |
| **Highest render** | `service_catalog_cost_watch.highest_single_render_centavos` | Read-only · Cost Watch · 90-day window |
| **Avg render** | `service_catalog_cost_watch.avg_render_centavos` | Read-only |
| **p95 render** | `service_catalog_cost_watch.p95_render_centavos` | Read-only |
| **Cost / Price** | `highest_render ÷ price` | Health flag: 🟢 &lt;30% · 🟡 30–50% · 🔴 &gt;50% |

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ SKU Pricing &amp; Catalog · with Cost Watch                                                  [Period: 90d ▾]      │
│                                                                                                                │
│ SKU                            Price       Time-rec   Event-scope     Highest Render   Cost/Price   Health     │
│ ──────────────────────────────────────────────────────────────────────────────────────────────────            │
│ panood_daily_broadcast         ₱2,499      One-time   Per event       ₱180 (1d ago)    7%          🟢         │
│ panood_annual_streaming        ₱19,999     Annual     All events      ₱180 (1d ago)    1%          🟢         │
│ panood_template_pack_daily     ₱799        One-time   Per event       ₱45 (2d ago)     6%          🟢         │
│ panood_template_pack_annual    ₱7,999      Annual     All events      ₱45 (2d ago)     0.6%        🟢         │
│ panood_cam_bridge_slot_day     ₱199        One-time   Per event       ₱30 (1d ago)     15%         🟢         │
│ papic_cam_bridge_slot_day      ₱99         One-time   Per event       ₱30 (1d ago)     30%         🟡         │
│ papic_cam_bridge_all_slots_day ₱249        One-time   Per event       ₱90 (3d ago)     36%         🟡         │
│ papic_cam_bridge_all_slots_annual ₱2,499   Annual     All events      ₱90             3.6%         🟢         │
│ patiktok_cam_bridge_day        ₱49         One-time   Per event       ₱15 (4d ago)     31%         🟡         │
│ patiktok_cam_bridge_annual     ₱249        Annual     All events      ₱15             6%          🟢         │
│ save_the_date_video_render     ₱199        One-time   Per event       ₱45 (3d ago)     23%         🟢         │
│ ai_video_highlight_60s         ₱1,999      One-time   Per event       ₱185 (90d ago)   9%          🟢         │
│ ai_edited_highlight_3min       ₱3,499      One-time   Per event       ₱825 (12d ago)   24%         🟢         │
│ concierge_complete             ₱4,999      One-time   Per event       ₱1,250 (5d ago)  25%         🟢         │
│ vendor_pro_weekly              ₱499        Weekly     All events      —                —           —          │
│ ...                                                                                                            │
│                                                                                                                │
│ Click a row → edit drawer with all fields · Click "Highest Render" value → cost_breakdown drilldown modal     │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Edit drawer fields:** SKU code (read-only) · Name · Description · Category · PHP Price · Time recurrence dropdown · Event scope dropdown · Multi-purchase toggle · Active toggle. Edit a price OR a frequency dimension → 24-hour delay before taking effect (gives admin time to roll back) · `service_catalog_price_history` records every change including `prior_time_recurrence` / `new_time_recurrence` / `prior_event_scope` / `new_event_scope` columns.

**Frequency-change two-admin approval:** changing a SKU's `time_recurrence` or `event_scope` post-launch is higher-impact than a price tweak (a customer who bought "Annual / all_events" expecting yearly billing for every event won't accept a silent switch to "Quarterly / per_event"). Frequency changes require **two-admin approval per § 9.1**, same gate as mid-quarter price changes >₱500. Existing active subscriptions / multi-event passes **keep their old frequency until natural expiry** — no retroactive billing change (mirrors the 2026-05-12 cart-snapshot principle in 0034 § 3.3).

**Cost Watch drilldown** — clicking the Highest Render value on a SKU row opens:

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ Highest render — AI Edited Highlight (3-min) · ₱825 · 12d ago             [Close]  │
│                                                                                    │
│  Anthropic Claude Sonnet (vision + edit decisions):  ₱680   (82%)                 │
│  FFmpeg compute (Cloudflare Worker):                  ₱95    (12%)                 │
│  R2 storage write (output MP4 ~120MB):                ₱30    (4%)                  │
│  Bandwidth (couple downloads + dashboard preview):    ₱15    (2%)                  │
│  Music license (Setnayan-owned):                      ₱0     (0%)                  │
│  ────────────────────────────────────────────────────────────                     │
│  Total:                                               ₱825                         │
│                                                                                    │
│  Order: SET-A4F2K9R7BX     User: maria@example.com   Event: Maria &amp; Juan          │
│  Render trigger: vision-heavy footage (24 input clips · 6 face-detection passes)   │
│                                                                                    │
│  [ View all 90d renders for this SKU →   View order →   View user → ]              │
└────────────────────────────────────────────────────────────────────────────────────┘
```

**Pricing-recommendation rule of thumb surfaced inline** on each SKU row: keep `highest_single_render_centavos / price_php_centavos < 30%` for healthy margin. Yellow at 30–50%, red >50%. Admin sees at-a-glance which SKUs may need a reprice.

**Schema reminder** (defined in 0034):
- `service_catalog` extended with `time_recurrence TEXT CHECK (one_time/weekly/quarterly/annual/lifetime)` + `event_scope TEXT CHECK (per_event/all_events)` columns
- `service_render_costs` table — per-render cost ledger (cost_centavos + cost_breakdown JSONB)
- `service_catalog_cost_watch` materialized view — 90-day MAX/AVG/p95 aggregations refreshed hourly

**Instrumentation phasing (locked 2026-05-17):** V1 ships table + materialized view + admin UI columns as read-only with the 3 highest-COGS SKUs instrumented first — **AI Edited Highlight 3-min** (highest), **AI Video Highlight 60s**, **Setnayan Concierge** (Claude Sonnet calls). Remaining SKUs (Save-the-Date Video, Panood, Custom Monogram, Patiktok, Cam Bridge tiers) get instrumentation in V1.5+ as the engineering catches up.

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
│ Maya QR Ph              5.0%          1.5%         98.0%         ★ default  ✅          │
│ GCash direct            5.0%          1.5%         98.0%                    ✅          │
│ Bank transfer (BDO/etc) 5.0%          0% (manual)  99.5%                    ✅          │
│ Maya eWallet            5.0%          2.0%         97.5%                    ✅          │
│ Credit card (Mastercard/│                                                                │
│  Visa)                  5.0%          3.0%         96.5%                    ✅          │
│ OTC (7-Eleven, M Lhuill │                                                                │
│  ier, etc.)             5.0%          1.5%         98.0%                    ✅          │
│                                                                                         │
│ * Vendor net = 100% − gateway fee − BIR Withholding 0.5%                                │
│   Setnayan keeps the flat 5.0% convenience fee gross; pays own taxes from that          │
│   (Option B — vendor absorbs gateway, Setnayan does NOT)                                │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

**Editable per row:** Setnayan convenience fee % · gateway fee % · preferred-rail flag · active toggle. Changes are single-admin authority (light-touch) but logged in `payment_method_config_history` for audit.

**Schema:**

```sql
CREATE TABLE payment_method_config (
    method_key            TEXT PRIMARY KEY,    -- 'maya_qr','gcash_direct','bdo_transfer','maya_ewallet','credit_card','otc'
    display_label         TEXT NOT NULL,
    setnayan_fee_bps      INT NOT NULL,        -- 500 = 5.0% flat default; admin-configurable per method, basis points (was 550/650 dual-rate pre-2026-05-16 evening lock)
    gateway_fee_bps       INT NOT NULL,        -- 150 = 1.5%; 300 = 3.0% (Option B — vendor absorbs)
    min_fee_centavos      INT NOT NULL DEFAULT 5000,    -- ₱50 floor, locked 2026-05-17 · fees_centavos = MAX(subtotal × bps / 10000, min_fee_centavos)
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

### 3.5f Payment Options Policy Matrix (locked 2026-05-17)

Admin-configurable matrix controlling which payment methods are available **per account-type scope**. Each method defined in `payment_method_config` (per § 3.5d) can be independently enabled or disabled for four scopes:

- **Customers** (couples paying Setnayan)
- **Vendors** (un-certified / coming_soon)
- **Certified Vendors** (verified vendors — Setnayan Pay payee side)
- **Events** (per-event override that supersedes the account-type default)

The cart logic in [0034 § 3.3 Checkout](Documents/Claude/Projects/Setnayan/0034_payments_and_cart/0034_payments_and_cart.md) reads the policy for the active customer's scope before rendering available rails. Per-event override (if set) takes precedence over account-type defaults.

**Admin grid view:**

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Payment Options Policy · per account-type scope                                                  │
│                                                                                                   │
│ Method                  Customers   Vendors   Certified Vendors   Notes                          │
│ ────────────────────────────────────────────────────────────────────────────────────             │
│ BDO QR (V1 manual)         [✓]       [✓]            [✓]           V1 active                      │
│ GCash QR (V1 manual)       [✓]       [✓]            [✓]           V1 active                      │
│ Maya QR Ph (V1.5+)         [✓]       [✗]            [✓]           Verified-only Setnayan Pay     │
│ GCash direct (V1.5+)       [✓]       [✗]            [✓]                                          │
│ Maya eWallet (V1.5+)       [✓]       [✗]            [✓]                                          │
│ Credit card (V1.5+)        [✓]       [✗]            [✓]           Premium rail                   │
│ OTC (V1.5+)                [✓]       [✗]            [✓]                                          │
│ Bank transfer manual       [✓]       [✓]            [✓]                                          │
│                                                                                                   │
│ Per-event overrides: 3 active · [View overrides table]                                           │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Schema extension** (extends `payment_method_config` from § 3.5d):

```sql
ALTER TABLE payment_method_config ADD COLUMN enabled_for_customers BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE payment_method_config ADD COLUMN enabled_for_vendors_coming_soon BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE payment_method_config ADD COLUMN enabled_for_vendors_certified BOOLEAN NOT NULL DEFAULT TRUE;

-- Per-event override: a specific event can override the account-type default
CREATE TABLE event_payment_options_override (
    event_id          UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    method_key        TEXT NOT NULL REFERENCES payment_method_config(method_key),
    enabled           BOOLEAN NOT NULL,
    set_by_admin_id   UUID NOT NULL REFERENCES users(user_id),
    reason            TEXT,                        -- e.g., "VIP wedding · enable all rails"
    set_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (event_id, method_key)
);

CREATE INDEX idx_event_payment_options_event ON event_payment_options_override(event_id);
```

**Resolution order at checkout** (read by the cart logic in 0034 § 3.3):

1. If the cart belongs to a specific event AND that event has rows in `event_payment_options_override`, use those rows for any methods listed.
2. For methods not overridden at the event level, fall back to the account-type default from `payment_method_config.enabled_for_*`.
3. Customer scope: read `enabled_for_customers`.
4. Vendor-payee scope (used by the payouts side, not checkout): read `enabled_for_vendors_coming_soon` or `enabled_for_vendors_certified` depending on `verification_state`.

**Why single-admin authority for policy toggles:** consistent with § 3.5d — these are business-policy levers, not security-critical fields. Changes are logged in the standard admin audit log (`admin_audit_log` per § 365). A separate `payment_options_policy_history` table is not needed — `payment_method_config_history` already snapshots the full row on every change including the new scope columns.

**V1 vs V1.5+ scope:** schema lands in V1 (matrix is sparse — only BDO QR, GCash QR, and bank-transfer-manual are populated). When Maya Business is approved at V1.5+, the matrix expands automatically as the new method rows insert via § 3.5d migration. No code change needed to onboard new methods; the admin just flips toggles on the new rows.

### 3.6 Disputes &amp; Refunds

The dispute resolution queue. Each claim shows:

- Couple + vendor + service + amount paid (if any · 5.0% Setnayan Pay convenience fee customers may seek refund of, per 0034 § 6 locked 2026-05-16 PM)
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

### 3.11 Concierge Abuse review queue (locked 2026-05-17)

New tab in the admin console (alongside Users · Verification · Payments · Disputes · Funnels · Reviews · Website Editor) for reviewing multi-account trial-cycling flags raised by the iteration 0016 Setnayan Concierge anti-abuse framework. See iteration 0016 § 0 Anti-abuse subsection for the detection signals + tiered-enforcement model.

**Tab visibility:** all admin roles. **Action authority:** single-admin per § 4.3 (review decisions are reversible — admin can lift enforcement via the appeal flow without two-admin approval).

#### 3.11.1 Queue view (default)

Default filter: `status = 'pending_review'` flags, sorted by `similarity_score DESC` then `created_at ASC` (highest-confidence + oldest-pending at top so admin doesn't get distracted by recent low-score noise). Top of the page shows three metric chips: **{N} pending** · **{N} cleared (last 7d)** · **{N} confirmed (last 7d)**.

Each row displays:

| Column | Source | Notes |
|---|---|---|
| Flagged account | `concierge_abuse_flags.flagged_user_id` + `users.full_name` + `users.email` | Click → opens admin Users surface for that account |
| Event | `events.event_name` + `events.wedding_date` + `events.venue_name` for the event that triggered the flag | The event the couple was attempting to start a trial on |
| Similarity score | `concierge_abuse_flags.similarity_score` (NUMERIC 0–1) | Visual: a small horizontal bar (red ≥ 0.85, amber 0.7–0.85, green < 0.7) — V1 threshold for trial-block is ≥ 0.7 |
| Signals fired | `concierge_abuse_flags.signals` (JSONB) | Compact chip row: 📅 same-date · 🏛 same-venue · 📍 same-address · 👫 name-overlap · 📞 same-phone · 💳 same-payment · 🌐 same-IP. Critical signals (phone / payment) styled in red |
| Matched accounts | `concierge_abuse_flags.matched_user_ids` | Stack of small avatars + count chip "+N matches"; click expands per-match comparison panel (see 3.11.2) |
| Account strikes | `users.concierge_abuse_strike_count` | "0 strikes" / "1 strike (warning)" / "2 strikes (trial banned)" pill — colored by current enforcement level |
| Created | `concierge_abuse_flags.created_at` | Relative timestamp ("3 min ago" / "yesterday") |
| Actions | inline buttons | [Clear (false positive)] · [Confirm abuse] · [⋯] (View full account · Open audit log · Compare side-by-side) |

#### 3.11.2 Per-match comparison panel (drilldown)

Clicking a row expands into a side-by-side comparison of the flagged account's event vs each matched trial-used account's event. Three columns: signal type / flagged-account value / matched-account value, with the matching signals highlighted. Admin can scan and decide: is this the same person on a new account (abuse) or a different couple at the same venue/date (false positive — common for popular Tagaytay venues on Saturday afternoons).

#### 3.11.3 Admin actions

**Clear (false positive)** — calls `adminClearConciergeFlag(flag_id, admin_user_id, notes)`:
- `concierge_abuse_flags.status` → `'cleared'`
- No strike incremented on the flagged account
- Flagged user receives in-app notification: *"Your account was flagged for review and cleared. Your 3-day Setnayan Concierge trial is available."*
- Required: free-form `admin_notes` (≥ 10 chars) explaining why this was a false positive (audit-trail input)

**Confirm abuse** — calls `adminConfirmConciergeAbuse(flag_id, admin_user_id, notes)`:
- `concierge_abuse_flags.status` → `'confirmed_abuse'`
- `users.concierge_abuse_strike_count` increments by 1
- `users.concierge_enforcement_level` auto-bumps per the tier table: strike 1 → `'warning'` · strike 2 → `'trial_banned'` · strike 3+ → `'full_banned'`
- `users.concierge_enforcement_at` + `_by` + `_reason` stamped
- Flagged user receives in-app + email notification (per 0028) with the new state + appeal-ticket CTA
- Required: free-form `admin_notes` (≥ 20 chars) — this is the audit-trail justification for the strike; surfaces in the user's audit log + the appeal review if the user contests
- Side-effect: any in-flight `concierge_abuse_flags` rows for the same `flagged_user_id` still in `'pending_review'` are auto-cleared (single-flag-per-strike to prevent double-counting bulk-flag bursts)

**Decline-to-decide (defer)** — admin can leave the flag in `'pending_review'` and come back to it. No state change. Flagged account remains trial-blocked while in `'pending_review'` (the trial-start UI shows the under-review modal).

#### 3.11.4 Appeal-driven enforcement reversal

When a banned account submits a 0029 help-center ticket via the in-app appeal CTA, the ticket routes to the abuse-review admin role. Reviewing admin opens the user's account in this 3.11 surface (linked from the ticket) and can call `adminLiftConciergeEnforcement(user_id, admin_user_id, notes)`:
- `users.concierge_abuse_strike_count` decrements by 1 (clamps at 0)
- `users.concierge_enforcement_level` re-derives from the new strike count per the tier table (typically resets to `'warning'` if strike count drops to 1, or `'none'` if drops to 0)
- All historical `concierge_abuse_flags` rows for this user with `status = 'confirmed_abuse'` are flagged with `admin_notes` referencing the appeal ticket ID + the reviewing admin's notes — they are NOT deleted (audit trail preserved)
- User receives in-app + email notification: *"Your appeal was reviewed and your Setnayan Concierge access has been restored. Reason: {admin_notes}."*

#### 3.11.5 Mobile

The queue is admin-only and tablet/desktop-first. On mobile (admin opens from phone), the queue renders as a stacked-card list — each card shows the flagged account header, similarity score chip, signals row, and a single primary action ("Review"); tapping "Review" opens the per-match comparison panel as a full-screen sheet with the Clear / Confirm / Defer actions at the bottom.

#### 3.11.6 Schema (defined canonically in iteration 0016 § 0)

```sql
-- Restated here for surface readability; canonical definition lives in iteration 0016 § 0.
CREATE TABLE concierge_abuse_flags (
  flag_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flagged_user_id   UUID NOT NULL REFERENCES users(user_id),
  matched_user_ids  UUID[] NOT NULL,
  similarity_score  NUMERIC NOT NULL,
  signals           JSONB NOT NULL,
  status            TEXT NOT NULL DEFAULT 'pending_review'
                    CHECK (status IN ('pending_review', 'cleared', 'confirmed_abuse')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at       TIMESTAMPTZ,
  reviewed_by       UUID REFERENCES users(user_id),
  admin_notes       TEXT
);
CREATE INDEX idx_concierge_abuse_flags_status ON concierge_abuse_flags(status, created_at DESC);
```

**RLS:** admin-only read/write via `is_admin()` predicate. Couples MUST NOT be able to query this table directly — flag visibility to the flagged user is exclusively through the in-app notification + appeal-ticket flow, not via a direct RLS-readable surface.

**Cross-references:** iteration 0016 § 0 Anti-abuse subsection (detection signals · tiered enforcement model · server-action signatures); iteration 0025 § 3.7.2 Enforcement-state overlay (customer-side surface); iteration 0029 (appeal-ticket category + routing).

---

### 3.12 Add-on Management · card-view mirror of customer add-ons (locked 2026-05-17)

A new top-level admin surface at `/admin/addons` that mirrors the customer-facing add-ons grid visually, with each tile opening into an admin-only settings drawer. Complements (does NOT replace) the existing § 3.5 Pricing & Catalog tabular grid — § 3.5 is the engineering / audit view (all SKUs, spreadsheet density); § 3.12 is the product / strategy view (customer-parity tiles, richer per-SKU drill-down). Both edit the same underlying tables (`service_catalog`, `feature_policy`, `event_feature_policy_override`).

**Purpose.** Single admin surface where every purchasable thing (couple-side + vendor-side + admin-only SKUs like Concierge) is configurable from one place: who can buy it, what it costs, who's using it right now, and how it's performing. Output: generates the consolidated `Pricing.md` report (corpus root) on demand from live database state.

#### 3.12.1 Layout · two-tab card grid

URL: `/admin/addons`. Tabs at top:

| Tab | What it shows |
|---|---|
| **Customer Add-ons** | Card grid mirroring `/dashboard/[event_id]/add-ons` (per iteration 0021 § 4.4) — same tile order, same icons, same visual chrome — PLUS admin-only tiles for SKUs not in the customer grid (Setnayan Concierge, Same-Day Edit, Pakanta tiers, Bespoke Monogram, custom Save-the-Date Video, etc.) |
| **Vendor Add-ons** | Card grid of vendor-purchasable SKUs (Vendor Pro Weekly · Extended Pin · Boosted Ads 5/10/20km · Sponsored Boost Quarterly/Annual · 5 tool integrations · All Tools Unlock Bundle · QR Retrieval drop-in). No customer-side parallel — this IS the canonical visualization of vendor SKUs |

Each card displays:

- SKU icon (sourced from the customer surface for visual parity)
- SKU name
- Current price + 2D billing chip (e.g., "₱2,499 · per_event · one_time" or "₱19,999 · all_events · annual")
- Eligibility state indicator at a glance — small dots: 🟢 enabled for couples · 🟢 enabled for vendors_certified · ⚫ disabled for vendors_coming_soon (one dot per account type per `feature_policy`)
- Lifetime purchase count
- Cost Watch health flag (🟢/🟡/🔴 per iteration 0023 § 3.5 instrumentation) when available

Tile order matches the customer surface as closely as possible so admin's mental model maps cleanly. Admin-only tiles (Concierge etc.) appear at the END of the Customer Add-ons grid in a separate "Admin-only / hidden from grid" sub-section so they don't disrupt visual parity above.

#### 3.12.2 Per-SKU settings drawer

Click any tile → opens a right-side drawer (full height, 480 px wide) with 4 tabs:

##### Tab 1 · Eligibility

Per-account-type toggles backed by `feature_policy`:

- `enabled_for_couples` (boolean toggle)
- `enabled_for_vendors_coming_soon` (boolean toggle)
- `enabled_for_vendors_certified` (boolean toggle)

For each disabled tier, the corresponding `block_reason_*` text field becomes editable (free text shown to the user as the disabled-CTA tooltip on customer / vendor surfaces).

Below the matrix: **Per-event override table** sourced from `event_feature_policy_override` — rows of `(event_id, enabled, reason, set_by_admin_id, set_at)`. Admin can search by event_id, add a new override row, or remove an existing one. Useful when an admin needs to disable a specific feature for a specific account in dispute / abuse-review / contractual-exception scenarios.

Save action writes a new `admin_audit_log` row with `before_state_json` + `after_state_json` per the iteration 0023 § 2 audit pattern.

##### Tab 2 · Pricing

Read-only summary plus an edit panel:

- **SKU code** (read-only; from `service_catalog.feature_key`)
- **Current price** (₱ + centavos)
- **`time_recurrence`** dropdown — one_time / weekly / quarterly / annual / lifetime
- **`event_scope`** dropdown — per_event / all_events
- **Effective from** (when this price became active)
- **Last edited by** (admin name + timestamp)

**Edit panel** — admin clicks "Edit price" → form opens:

- New price field (with charm-ladder helper showing nearest valid value)
- Delta calculation (e.g., "+₱500" or "-₱200") with auto-flag if > ₱500 (triggers two-admin gate per § 4)
- Frequency edit — if `time_recurrence` or `event_scope` changes, **mandatory two-admin approval** (per the 2026-05-17 frequency-change rule). Existing active subscriptions keep the old frequency until natural expiry (cart-snapshot principle).
- Reason field (free text, required, min 30 chars · written to `service_catalog_price_history.reason`)
- Save → either applies immediately (small delta · no frequency change) or routes to two-admin queue (large delta or frequency change)

**Price-history table inline** — last 10 changes from `service_catalog_price_history` with prior price · new price · prior frequency · new frequency · admin · reason · timestamp.

##### Tab 3 · Current users

List of accounts with active orders for this SKU:

- Account name · account type (couple / vendor / certified vendor) · purchase date · order status · order amount
- For recurring SKUs (weekly / quarterly / annual): subscription state (active · paused · expired) + days remaining
- Filter chips: Couples · Vendors · All
- Search box: by event_id, user_id, or account email
- Each row clickable → opens the user detail page in § 3.4

For one-time SKUs (e.g., Papic 5-seat), shows lifetime purchases (one per event). For recurring SKUs (e.g., Vendor Pro Weekly), shows currently-active subscriptions only with a separate count for lifetime purchases.

##### Tab 4 · Statistics

Usage + revenue + Cost Watch metrics:

- **Total purchases (lifetime)** — count from `orders` joined to `order_lines`
- **Active subscriptions** (recurring SKUs only) — count of orders in `'paid'` or `'fulfilled'` state with `time_recurrence != 'one_time'` and no expiry yet
- **Total revenue (lifetime)** — sum of order_line amounts for this SKU
- **Revenue this month / quarter / year** — windowed
- **Conversion rate** — purchases ÷ unique-event-id-views (when funnel analytics § 3.8 has captured the tile-view event)
- **Distinct events using this SKU** — count of unique `event_id` values
- **Cost Watch metrics** (from `service_catalog_cost_watch` materialized view):
  - Highest single render cost
  - Average render cost
  - p95 render cost
  - Cost-to-price ratio + 🟢/🟡/🔴 health flag
  - Drilldown link → opens cost_breakdown JSONB modal per § 3.5
- **Time series chart** — purchases per week / month (bar chart, last 12 weeks default, year selector)

For SKUs without enough volume yet, individual metrics render as *"Not enough data yet"* rather than `0`.

#### 3.12.3 Pricing Report Generation (Pricing.md regeneration)

Button in the panel header (top-right): **"Generate Pricing Report"**. Action:

1. Server queries current `service_catalog` + `feature_policy` + `service_catalog_price_history` + `service_catalog_cost_watch` state
2. Renders a templated Markdown matching the structure of the existing [corpus-root `Pricing.md`](../Pricing.md) (§ 1 rules · § 2 couple-side SKUs · § 3 Concierge · § 4 vendor-side · § 5 vendor-to-couple fee structures · § 6 cost-per-event reference · § 7 drift notes · § 8 retired SKUs · § 9 companion artifacts · § 10 cross-references · § 11 update protocol)
3. Writes to two locations:
   - **Snapshot:** `/admin/addons/reports/{ISO_timestamp}.md` — immutable audit copy, never overwritten
   - **Canonical:** corpus-root `Pricing.md` — overwritten with the latest snapshot (the "always current" reference)
4. Triggers pandoc regeneration: `Pricing.docx` mirror updates from `Pricing.md`
5. Shows a confirmation toast: *"Pricing report generated · 47 active SKUs · 23 retired · last regenerated 2026-05-17 14:32 by Maria"*

The button is single-admin authority — generation is a read-only-from-DB operation, no state mutations. Only writes the report files.

#### 3.12.4 Future automation (V1.5+ deferred)

- **Nightly auto-regeneration** — pg_cron job runs `Generate Pricing Report` action at 02:00 Asia/Manila daily so `Pricing.md` is never more than 24 hours stale even if admins forget to manually trigger
- **Slack / email notification on SKU change** — whenever a `service_catalog` row is edited (price or frequency), a webhook fires to owner's Slack + email with a diff
- **Pricing report `.pdf` mirror** — same generation flow but also outputs PDF (via pandoc) for owner deck-embedding
- **External read API** — `GET /api/v1/pricing` returns the current pricing JSON for partners / press / integrations (vendor agreements may eventually reference this endpoint instead of a frozen contract appendix)

All four deferred to V1.5+; V1 ships with manual button-triggered regeneration.

#### 3.12.5 Mobile parity

Card grid renders as 2-column on phone (1-column on narrow viewports). Drawer becomes a bottom sheet (full-height swipe-up) per the existing 0023 mobile pattern. All 4 tabs in the drawer remain accessible — no feature gating on mobile.

#### 3.12.6 Schema · no new tables, leverages existing

This surface is a UI layer over existing tables. No schema additions required:

- `service_catalog` — SKU definitions + prices + 2D billing
- `service_catalog_price_history` — price-change audit
- `feature_policy` + `event_feature_policy_override` — eligibility (from 2026-05-17 App Store hero-CTA row)
- `service_render_costs` + `service_catalog_cost_watch` — Cost Watch
- `orders` + `order_lines` — purchases / users / revenue
- `admin_audit_log` — admin-action audit

The "Pricing Report Generation" output writes new files to disk (`/admin/addons/reports/{ts}.md` snapshots + corpus-root `Pricing.md`) but no new DB tables.

#### 3.12.7 Cross-references

- Iteration 0021 § 4.4 — the customer add-ons surface this admin view mirrors
- Iteration 0021 App Store hero-CTA model (locked 2026-05-17) — the 5-state CTA resolver (`add` / `request_sent` / `launch` / `blocked` / `expired`) drives the customer tile state; admin sees aggregate state ("85% of couples in `add` state for Panood; 12% `request_sent`; 3% `launch`") in the Statistics tab
- Iteration 0023 § 3.5 — engineering / audit Pricing & Catalog grid (tabular alternative)
- Iteration 0023 § 3.5d — Payment Method fee table (admin-edited similar pattern)
- Iteration 0023 § 3.5e — Vendor Tier Perks Management (admin-edited similar pattern)
- Iteration 0023 § 3.5f — Payment Options Policy Matrix (per-account-type policy primitive, same conceptual model)
- Corpus root [`Pricing.md`](../Pricing.md) — generated report output

---

### 3.13 Concierge Brain admin surface (locked 2026-05-18)

**Purpose.** The single admin tab where the Setnayan Concierge brain's content (the curated Filipino-wedding knowledge base) is **viewed**, **edited**, **grown**, and **monitored**. Four subviews under one route `/admin/brain`. Cross-references the brain architecture in `02_Specifications/18_Concierge_Brain/00_Architecture.md` (locked 2026-05-18 row 2) and the wizard architecture in 0016 § 0b (this same-day lock).

**Governance.** Single-admin authority for brain edits (mirrors 0006 review-gate appeal pattern). Every edit is audit-logged in `admin_audit_log` with `target_table = 'concierge_brain_chunks'`. Quality compounds over time — admin reviews top-hit cached Q&A answers (sorted by `hit_count`) and hand-tweaks for accuracy / brand voice; hand-edits propagate to every future couple in that combination via the cache-forever architecture.

#### 3.13a Subview 1 — Brain Editor (the primary surface)

The markdown editor for `concierge_brain_chunks`. Lists all chunks across the 8 topic files (`01_Filipino_Cultural_Reference.md` · `02_Regional_Pricing_Benchmarks.md` · `03_Seasonal_Weather_Reference.md` · `04_Planning_Timelines.md` · `05_Legal_BIR_Reference.md` · `06_Setnayan_Feature_Reference.md` · `07_Vendor_Decision_Logic.md` · `08_Budget_Allocation_Reference.md`) plus any custom chunks created post-launch.

**List view columns:**
- Topic file (sortable / filterable)
- Chunk title
- Tags (chip-rendered)
- Applies to (audience filter)
- Paid-tier-only flag (🔒 chip when TRUE)
- Tier visibility (DIY / Trial / Active dots)
- Last verified date + reviewer
- Hit count (how many times retrieved by Q&A in last 30 days)
- Embedding status (✅ current / ⚠ stale-flagged for regenerate)
- Active toggle

**Edit drawer (right side, 720px wide, 5 tabs):**

1. **Content** — markdown editor with live preview (50/50 split). Renders the chunk exactly as the LLM will see it when retrieved. Saves to `concierge_brain_chunks.body`.
2. **Metadata** — tags (autocomplete from existing tags + free-input new tags), applies-to selector, cross-ref linker (autocompletes iteration paths + other brain chunks), paid-tier-only checkbox, tier visibility toggles (DIY / Trial / Active), source citation field (required — "no anonymous common knowledge" per brain README governance).
3. **Embedding** — current embedding status, `embedding_generated_at` timestamp, manual "Regenerate now" button (fires `regenerate_chunk_embedding(chunk_id, admin_user_id)` — single Cloudflare neuron call, idempotent). Auto-flags as `stale` when body changes; next nightly sweep regenerates.
4. **Retrieval stats** — last-30-day retrieval count, average rank position when retrieved, top 5 query embeddings that matched, top 5 cached responses derived from this chunk. Helps admin identify high-leverage chunks for quality review.
5. **Audit log** — chronological list of edits with admin user, before/after diff, timestamp. Read-only.

**Bulk operations** (top toolbar):
- "Regenerate all stale embeddings" (admin-triggered nightly sweep fallback)
- "Export all chunks as `.md` archive" (for Cowork sync — see § 3.13d)
- "Bulk flag for review" (when a brain content audit is needed)

#### 3.13b Subview 2 — Unanswered Questions queue

Lists `concierge_unanswered_questions` rows — questions that retrieved zero chunks above similarity threshold OR returned the canned "I'm not sure about that yet" fallback. These represent **real demand for brain content that doesn't exist yet**, so they drive brain growth from couple usage patterns.

**Queue columns:**
- Question text (truncated)
- Frequency (count of similar questions in last 30 days)
- First asked / last asked
- Couple tier when asked (DIY / Trial / Active)
- Admin action status (pending / authored / out-of-scope)

**Per-row admin actions:**
- **Author chunk** → opens the Brain Editor drawer pre-filled with the question as the prompt context; admin writes the chunk that answers this question; saves into the appropriate `topic_file`. The cached Q&A response for similar queries auto-regenerates on next access.
- **Mark out-of-scope** → flags the question as "intentionally not in the brain" (e.g., gift recommendations · jokes · off-topic). Future similar questions return a polite "Setnayan Concierge can't help with that — try the help center" response.
- **Merge with existing chunk** → if the question is answered by an existing chunk but the embedding didn't surface it, admin can re-tag / re-embed the existing chunk to capture this query pattern.

Queue sorts by frequency descending — admin triages high-leverage chunks first.

#### 3.13c Subview 3 — Concierge Cost Watch

Aggregates `concierge_messages.cost_centavos` + plan-generation costs + ad-hoc Q&A costs broken down by synthesis model, tier, and time window. Feeds the existing `service_catalog_cost_watch` pattern from § 3.5.

**Surface charts:**
- Daily inference spend (Llama free / Haiku paid) with the Cloudflare 10K-neurons/day cap as a reference line
- Cache hit rate over time (target 95%+ at steady state)
- Cost per active concierge couple (target ~₱1/year at steady state)
- Top 10 most-cached responses by hit count
- Top 10 most-expensive un-cached queries (admin reviews to add to the brain or improve retrieval)

**Alerts:**
- Cloudflare free-tier 80%+ daily usage → admin notification
- Anthropic spend > ₱X/day → admin notification
- Cache hit rate drops below 80% → admin investigates (likely brain edit invalidated too many cached responses; admin can do a planned regenerate sweep)

#### 3.13d Subview 4 — Cowork sync lane

The secondary authoring path for non-Setnayan-team content contributors (cultural consultants, regional pricing analysts, legal advisors). Workflow:

1. Admin generates a Cowork share link for a specific topic file or set of chunks
2. External author opens the link in Cowork (markdown editing in a separate workspace)
3. Author writes / edits chunks following the README authoring template
4. On save, Cowork posts back to Setnayan via a webhook
5. The new/edited chunks land in this subview as **pending review**
6. Admin reviews each pending chunk → approve (lands in `concierge_brain_chunks`, embedding generated) or reject (sends feedback to the Cowork doc for revision)

**Cowork sync rules:**
- All Cowork-authored chunks default to `is_active = FALSE` until admin approves
- Embedding generation only fires on admin approval (saves cost during draft cycles)
- Cowork access is per-topic-file scoped (a cultural consultant doesn't get edit access to legal/BIR chunks)
- Single-admin-authority discipline still applies — Cowork authors *propose*, Setnayan admin *approves*

**V1.5+:** GitHub Actions-style "request-changes" workflow with inline diff comments back to Cowork. V1 ships approve / reject with text feedback.

#### Schema

No new tables required. Uses existing infrastructure:
- `concierge_brain_chunks` (locked in brain architecture 2026-05-18 row 2 — see `18_Concierge_Brain/00_Architecture.md` § 5)
- `concierge_unanswered_questions` (locked in brain architecture row 2)
- `concierge_response_cache` (cache-forever per this same-day row 6 supersedes the 24h TTL)
- `concierge_messages` (per row 2, with `synthesis_model` + `cost_centavos` columns feeding Cost Watch)
- New columns on `concierge_brain_chunks` for Cowork pending state: `cowork_authored_by TEXT NULL · cowork_pending_review BOOLEAN NOT NULL DEFAULT FALSE`

#### Mobile placement

Concierge Brain joins the "More" tab on mobile (alongside Pricing, Disputes, Settings, Website editor, Concierge Abuse, Add-on Management). Mobile UI is read-only for content (admin reviews chunks on phone) — editing happens on desktop where the markdown editor + drawer fit.

#### V1 vs V1.5+ scope

**V1 ships:**
- Brain Editor (subview 1) — full CRUD
- Unanswered Questions queue (subview 2) — basic queue + author-chunk flow
- Cost Watch (subview 3) — basic charts + alerts
- Cowork sync lane (subview 4) — manual share-link + webhook-back

**V1.5+ defers:**
- Real-time collaborative editing in the Brain Editor itself
- GitHub Actions-style inline diff comments in Cowork
- Automated chunk-quality scoring (LLM-generated quality scores for cached answers)
- Multi-language chunk variants (mirroring 0025 EN/TL/CEB locale toggle)
- A/B testing infrastructure for cached Q&A responses

---

### 3.14 Operations & Hiring — Growth Cockpit (locked 2026-05-20, shipped PR #211 + #212)

Owner-facing dashboard at `/admin/operations-hiring`, accessible only to internal/admin users per the existing admin layout auth gate. Tracks bottleneck signals + milestone forecasts + hiring roadmap tied to the Jan 30, 2027 launch-promo sunset. Routes alerts to `iscasasolaii@gmail.com` via the existing Resend infra in [[0028]].

**Dashboard panels (server-rendered on every load):**

| Panel | Surfaces |
|---|---|
| **NOW** | Verified active vendors · signups last week · signups prior week · refresh timestamp |
| **NEXT MILESTONE** | 3 forecasts (100 / 1,000 / 5,000 vendor targets) with projected dates from 4-week moving average × growth-rate adjustment |
| **Bottleneck signals** | Live traffic-light (green/yellow/red) on 6 signals — vendor verification backlog · customer support response · marketing pipeline w-o-w · open disputes · engineering blockers (manual) · founder time on one function (manual self-report) |
| **Hiring roadmap** | 4 seeded Jan 30, 2027 sunset deadlines (Sep 30 CS Lead · Oct 31 Marketing Lead · Nov 30 Verification Lead · Dec 30 CSM) with days-until countdowns (rose-700 highlight when <30 days) |
| **Unacknowledged alerts banner** | Top-of-page rose-50 banner showing recent unacknowledged alerts |
| **Sweep footer** | Per-page-load summary of alerts fired + emails sent/failed |

**Signal thresholds (green / yellow / red):**

| Signal | Green | Yellow | Red |
|---|---|---|---|
| Vendor verification backlog | < 10 / week | 10–25 / week | > 25 / week |
| Customer support response | < 2h avg | 2–24h avg | > 24h avg |
| Engineering blockers | 0 critical | 1 critical | > 1 critical for 2+ weeks |
| Marketing pipeline | growing w-o-w | flat 2 weeks | declining 2 weeks |
| Open disputes | < 2 / week | 2–5 / week | > 5 / week |
| Founder time on one function | < 30% | 30–50% | > 50% |

**Schema** (`supabase/migrations/20260523000000_hiring_guide_owner_alerts.sql`):

- `owner_alerts` — fired alert log with acknowledgement workflow
- `founder_time_log` — weekly self-report for the "founder time" signal
- `hiring_roadmap` — seeded with 4 Pulse 2 deadlines (admin updates status: not_open → sourcing → interviewing → offer_extended → hired)
- `bottleneck_signals_current` materialized view — refresh-on-access pattern (no `pg_cron` per [[reference_setnayan_cron_strategy]])
- RLS: admin + internal-only

**On-access alert sweep** (`apps/web/lib/hiring-guide/alert-engine.ts`):

Every page load of `/admin/operations-hiring` triggers `runHiringAlertSweep()`:

1. Refresh stale signals if `refreshed_at` is >1 hour old
2. Detect signal flips (red-level fires email + 7-day suppression to prevent fatigue)
3. Detect milestone hits (deduped per milestone; 1,000-vendor hit emails note marketing-SKU unlock per [[CLAUDE.md]] decision log row)
4. Detect hiring countdowns (T-30/T-14/T-7 days from each hire-by date, deduped per role+threshold)
5. Insert into `owner_alerts` + dispatch email (best-effort — email failure doesn't roll back the alert log)

**4 email templates** (`apps/web/lib/hiring-guide/emails.ts`, dispatched via [[0028]] Resend infra):

- `sendHiringWeeklyDigestEmail` — recurring Mon 8am PHT (caller wires schedule)
- `sendBottleneckAlertEmail` — fires on signal flip to red
- `sendMilestoneHitEmail` — fires when verified-vendor count crosses 100 / 1,000 / 5,000 / 25,000
- `sendHiringCountdownEmail` — fires T-30 / T-14 / T-7 days before each hire-by date

Owner email resolved via `process.env.OWNER_NOTIFICATION_EMAIL` (fallback `iscasasolaii@gmail.com` per [[reference_setnayan_owner_email]]).

**Admin nav placement:** new "Operations · Hiring & Growth" entry in `apps/web/app/admin/_components/admin-nav.tsx`, sitting between Content and Funnels.

**Bumps admin surface count: 11 → 12** (per § 1 admin surface list).

**Out of scope at V1 (separate follow-ons):**
- HTML email rendering (templates remain plain-text per existing 0028 pattern)
- Weekly digest scheduling (manual trigger via dashboard load for now)
- Founder time-log entry form (currently DB insert via SQL)
- Engineering blockers signal automated wiring (manual for now)
- `refresh_bottleneck_signals` RPC (queries.ts falls back gracefully)

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
