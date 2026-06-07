# Row-Level Security (RLS) — Canonical Policy Pattern

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main)
> **This doc is HISTORICAL/REFERENCE.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas (or "still accurate"):
> - **Core contract is STILL ACCURATE and SHIPPED.** The base migration `supabase/migrations/20260512000000_setnayan_base.sql` defines all four helpers — `is_admin()`, `current_event_ids()`, `current_vendor_ids(min_role)`, `current_thread_ids()` — as `SECURITY DEFINER STABLE SET search_path=public`, with `GRANT EXECUTE` to `authenticated` (+ `anon` for `is_admin`), exactly as documented. Default-deny + ENABLE-RLS-at-create and the 8-pattern A–H taxonomy are followed in code (policy comments cite the patterns).
> - **Table names in the §5 mapping table DRIFTED for the 0034 payment spine.** Live tables are **`orders`** + **`payments`** (Pattern G), NOT `service_orders`/`service_order_items`/`service_order_payments`. `reference_code` is a column on `orders`. The reconciliation/inbox table also differs from `payment_inbox_messages` here. Treat the mapping rows for 0026/0032/0033/0034 as spec-era names; cross-check actual table names in `supabase/migrations/` before relying on them.
> - **Pattern names for retired/changed scopes:** the customer **token wallet (0003) is RETIRED** (no `token_wallets` RLS); the **vendor token economy is LIVE** (`vendor_token_*` tables added later, e.g. `20260821000000_vendor_role_aware_rls.sql`, `20260908000000_vendor_token_burn_on_answer.sql`). **BIR (0026) tables are retiring** — the `official_receipts`/`form_2307`/`setnayan_tax_config` rows are historical. Pattern E `video_meetings`/`meeting_recordings` reflect a retired video-meeting feature.
>
> When this body disagrees with the above, **the above wins.**

**Locked:** 2026-05-12
**Scope:** Every Setnayan V1 iteration that declares a Postgres table
**Backend:** Supabase Postgres (per `0013_platform_stack_and_sync`)
**Memory reference:** `project_setnayan_platform_stack.md` · `Setnayan_Privacy_and_Security_Policy.md`

---

## 1. Why this document exists

Supabase Postgres Row-Level Security is the only thing standing between Alice's
wedding photos and Bob's curiosity. The platform spec (`0013`) promises "RLS
policies for every table," but until now only the Papic (`0012`) tables had
their policies fully written out. Every other iteration's schema needs the
same protection — without it, a malformed query from the Next.js client (or a
leaked anon key) is a direct data breach against PH Data Privacy Act (RA 10173)
guest, vendor, and couple records.

This document closes that gap. It defines:

1. The Setnayan RLS contract (default-deny, scoped by user/event/vendor,
   service-role bypass).
2. **Eight canonical policy patterns** that cover ~85 V1 tables.
3. **Four security-definer helper functions** that keep policies fast and DRY.
4. A **per-iteration mapping table** that pins every table to a pattern.
5. Edge cases, testing strategy, migration order, and a CI verification query.

Every iteration's schema migration MUST apply one of the eight patterns to
each new table. Tables without a documented pattern are an audit failure.

---

## 2. The Setnayan RLS contract

Three non-negotiable principles:

1. **Default-deny.** Every public-schema table runs
   `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` at creation time. With RLS
   enabled and zero policies, no row is accessible by `authenticated` or
   `anon` roles. Explicit policies are required to open access.
2. **Scoped by `user_id`, `event_id`, or `vendor_id`.** Almost every Setnayan
   table has at least one of these three columns (or derives them via a join
   table such as `event_members` or `vendor_team_members`). Policies use those
   columns to define row visibility. Tables without any of the three are
   either static reference data (Pattern H) or admin-only operational data
   (Pattern F).
3. **Service-role bypass.** Supabase Edge Functions and server-side jobs run
   under the `service_role` JWT, which bypasses RLS entirely. Application-tier
   code — the Next.js server actions and client components querying with the
   end-user's JWT — is fully RLS-gated. Service-role use is logged and
   reviewed; it is NOT the default execution context.

A direct consequence: if a feature requires logic that RLS cannot express
cleanly (e.g., conditional admin-impersonation), the work moves into an Edge
Function with service-role access plus its own application-level
authorization check. RLS is the floor, not the ceiling.

---

## 3. The 8 canonical policy patterns

### Pattern A — Per-user private data (`users`-scoped)

**Applies to:** Personal preferences and per-account artifacts. The row's
owner is the only consumer.
**Examples:** `notification_preferences`, `data_export_requests`,
`tour_completions`, `api_tokens`, `user_devices`, `marketing_consents`.

```sql
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_owns_row ON notification_preferences
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin override (read + write any row) for support flows
CREATE POLICY admin_full_access ON notification_preferences
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

### Pattern B — Per-event collaborative data (`event_members`-scoped)

**Applies to:** Anything that belongs to a wedding/event and is shared across
members of that event.
**Examples:** `guests`, `seating_tables`, `vendor_meetings`,
`event_vendor_relationships`, `event_milestones`, `event_budget_items`,
`mood_board_palettes`, `templates_unlocked`.

The rule: any event member (couple OR guest OR vendor) can `SELECT`. Only
couples (and admin) can `INSERT` / `UPDATE` / `DELETE`. A handful of
guest-writable tables (e.g. `rsvps`) override the write rule.

```sql
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Anyone on the event can read
CREATE POLICY event_member_can_read ON guests
  FOR SELECT TO authenticated
  USING (event_id IN (SELECT current_event_ids()));

-- Couples + admin can write
CREATE POLICY couple_can_insert ON guests
  FOR INSERT TO authenticated
  WITH CHECK (
    event_id IN (
      SELECT event_id FROM event_members
      WHERE user_id = auth.uid() AND member_type = 'couple'
    )
    OR is_admin()
  );

CREATE POLICY couple_can_update ON guests
  FOR UPDATE TO authenticated
  USING (
    event_id IN (
      SELECT event_id FROM event_members
      WHERE user_id = auth.uid() AND member_type = 'couple'
    )
    OR is_admin()
  );

CREATE POLICY couple_can_delete ON guests
  FOR DELETE TO authenticated
  USING (
    event_id IN (
      SELECT event_id FROM event_members
      WHERE user_id = auth.uid() AND member_type = 'couple'
    )
    OR is_admin()
  );
```

### Pattern C — Vendor-team-scoped (`vendor_team_members`-scoped)

**Applies to:** Anything owned by a vendor business and worked by their staff.
**Examples:** `vendor_services`, `vendor_packages`, `vendor_contracts`,
`contract_drafts`, `vendor_payouts`, `vendor_team_members` (itself),
`vendor_calendar_blocks`.

Granularity by `vendor_team_members.role`:
- `owner` — full read/write incl. team management
- `admin` — full read/write except team management
- `agent` — read/write scoped to services they're assigned to
- `viewer` — read-only

```sql
ALTER TABLE vendor_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY team_can_read ON vendor_services
  FOR SELECT TO authenticated
  USING (vendor_id IN (SELECT current_vendor_ids()));

CREATE POLICY admin_or_owner_can_write ON vendor_services
  FOR INSERT TO authenticated
  WITH CHECK (vendor_id IN (SELECT current_vendor_ids('admin')));

CREATE POLICY admin_or_owner_can_update ON vendor_services
  FOR UPDATE TO authenticated
  USING (vendor_id IN (SELECT current_vendor_ids('admin')));

CREATE POLICY admin_or_owner_can_delete ON vendor_services
  FOR DELETE TO authenticated
  USING (vendor_id IN (SELECT current_vendor_ids('owner')));

CREATE POLICY setnayan_admin_override ON vendor_services
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

### Pattern D — Public-read, vendor-write (marketplace listings)

**Applies to:** Listings published to the public marketplace at
`setnayan.com/vendors/...`.
**Examples:** `vendors` (marketplace entity), `vendor_reviews` (published
only), `vendor_portfolio_items`, `vendor_landing_pages`.

```sql
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Public can read active + verified rows
CREATE POLICY public_can_read_active ON vendors
  FOR SELECT TO anon, authenticated
  USING (is_active = TRUE AND verification_status = 'verified');

-- Vendor team can read their own row even if unverified
CREATE POLICY team_can_read_own ON vendors
  FOR SELECT TO authenticated
  USING (vendor_id IN (SELECT current_vendor_ids()));

-- Vendor admin can write
CREATE POLICY team_admin_can_write ON vendors
  FOR UPDATE TO authenticated
  USING (vendor_id IN (SELECT current_vendor_ids('admin')));

-- Setnayan admin override
CREATE POLICY setnayan_admin_override ON vendors
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

### Pattern E — Chat thread-scoped (`chat_thread_participants`-scoped)

**Applies to:** Conversation surfaces in iteration 0019.
**Examples:** `chat_threads`, `chat_messages`, `chat_attachments`,
`chat_thread_participants` (itself), `video_meetings`, `meeting_recordings`.

Membership in the participant table is the access primitive. Coordinator-join
(per the 0019 spec) is implemented as an additional participant row, so the
RLS policy doesn't need a coordinator-specific branch.

```sql
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY participant_can_read ON chat_messages
  FOR SELECT TO authenticated
  USING (thread_id IN (SELECT current_thread_ids()));

CREATE POLICY participant_can_send ON chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    thread_id IN (SELECT current_thread_ids())
    AND sender_id = auth.uid()
  );

-- Message sender can delete their own message within 5 minutes
CREATE POLICY sender_can_delete_recent ON chat_messages
  FOR DELETE TO authenticated
  USING (
    sender_id = auth.uid()
    AND created_at > NOW() - INTERVAL '5 minutes'
  );

CREATE POLICY admin_full_access ON chat_messages
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

### Pattern F — Admin-only (`account_type = 'admin'`-scoped)

**Applies to:** Internal Setnayan operational tables consumed only by the
admin console (0023).
**Examples:** `admin_audit_log`, `admin_approval_requests`,
`payment_receiving_accounts`, `support_tickets` (admin side),
`vendor_registrations` (verification queue), `team_shared_monthly_allowance`,
`team_allowance_consumptions`, `dispute_cases`.

```sql
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_only ON admin_audit_log
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

The `is_admin()` helper (see §4) keeps the lookup cheap; without it every row
check would join `users` inline.

### Pattern G — Per-order-scoped (`service_orders.user_id`-scoped, mixed)

**Applies to:** Orders, line items, and payments under the 0034 payment
spine.
**Examples:** `service_orders`, `service_order_items`, `service_order_payments`,
`comp_grants`, `payment_proofs`, `refund_requests`.

Three-way visibility:
- Customer can read/manage their own orders.
- Setnayan admin can read/manage all orders.
- Vendor can read order *items* that reference their vendor services (for
  payout tracking + Setnayan Pay reconciliation), but cannot read the parent
  order's PII (customer billing details).

```sql
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

-- Customer reads + writes own orders
CREATE POLICY customer_owns_order ON service_orders
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin full access
CREATE POLICY admin_all_orders ON service_orders
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Vendor scoped to the line items only (separate table)
ALTER TABLE service_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY customer_reads_own_items ON service_order_items
  FOR SELECT TO authenticated
  USING (
    order_id IN (SELECT order_id FROM service_orders WHERE user_id = auth.uid())
  );

CREATE POLICY vendor_reads_own_item_lines ON service_order_items
  FOR SELECT TO authenticated
  USING (vendor_id IN (SELECT current_vendor_ids()));

CREATE POLICY admin_all_items ON service_order_items
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

### Pattern H — Static reference data (read-only for everyone)

**Applies to:** Catalogs and lookup tables.
**Examples:** `service_catalog`, `service_categories`, `setnayan_tax_config`,
`help_articles`, `template_library`, `music_catalogue`, `vendor_taxonomy_canonical`.

```sql
ALTER TABLE service_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON service_catalog
  FOR SELECT TO anon, authenticated
  USING (is_active = TRUE);

CREATE POLICY admin_can_write ON service_catalog
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

---

## 4. Security-definer helper functions

To avoid expensive `IN (SELECT ...)` joins on every row evaluation, declare
four `SECURITY DEFINER STABLE` functions. They run with elevated privilege
against the source tables, return small ID sets, and let RLS policies stay
short and uniform.

```sql
-- Is the current user a Setnayan admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid()
      AND account_type = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Which events is the current user a member of (any role)?
CREATE OR REPLACE FUNCTION current_event_ids()
RETURNS SETOF UUID AS $$
  SELECT event_id FROM event_members
  WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Which vendors does the current user belong to, at min_role or above?
-- min_role precedence: owner > admin > agent > viewer
CREATE OR REPLACE FUNCTION current_vendor_ids(min_role TEXT DEFAULT 'viewer')
RETURNS SETOF UUID AS $$
  SELECT vendor_id FROM vendor_team_members
  WHERE user_id = auth.uid()
    AND CASE min_role
      WHEN 'owner'  THEN role = 'owner'
      WHEN 'admin'  THEN role IN ('owner','admin')
      WHEN 'agent'  THEN role IN ('owner','admin','agent')
      ELSE TRUE
    END;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Which chat threads is the current user actively participating in?
CREATE OR REPLACE FUNCTION current_thread_ids()
RETURNS SETOF UUID AS $$
  SELECT thread_id FROM chat_thread_participants
  WHERE user_id = auth.uid()
    AND left_at IS NULL;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;
```

With these in place, policies stay one-liners:

```sql
CREATE POLICY can_read ON guests
  FOR SELECT TO authenticated
  USING (event_id IN (SELECT current_event_ids()));
```

`STABLE` (not `IMMUTABLE`) lets PostgreSQL cache the result within a single
statement, so a 200-row SELECT against `guests` resolves `current_event_ids()`
exactly once. `SECURITY DEFINER` runs the function with the function-owner's
permissions, so the helpers can read `event_members` / `vendor_team_members`
even though the calling role would otherwise be RLS-gated against them.

Owner of these functions must be a dedicated Postgres role (not `postgres`
superuser) — the Supabase pattern `supabase_admin` works. Grant `EXECUTE` on
each function to `authenticated` and `anon` where the function is referenced
from public-read policies.

---

## 5. Per-iteration mapping table

| Iteration | Table | Pattern | Notes |
|---|---|---|---|
| 0000 | `users` | A + admin override | Self-update profile; admin can update any (support flow) |
| 0000 | `events` | B | Couples + admin write; all event members read |
| 0000 | `event_members` | B (couples write) | Couples + admin manage; members read own row only |
| 0000 | `event_join_tokens` | B (couples write) | Couples rotate; anyone-with-token redeems via Edge Function (service-role) |
| 0001 | `guests` | B | Standard event-scoped collaborative |
| 0001 | `guest_roles` | B | Reference data per event |
| 0001 | `guest_plus_ones` | B | Cascades from `guests` |
| 0002 | `invitation_sites` | B + public slug read | Anon read by slug; couples write |
| 0002 | `invitation_widgets` | B | Couples customize; members read |
| 0002 | `scan_events` | B (append-only) | Any event member may INSERT; couples + admin SELECT |
| 0004 | `widget_pro_purchases` | B + G hybrid | Order on G, widget unlock on B |
| 0004 | `widget_configurations` | B | Couples write; members read |
| 0005 | `led_background_projects` | B | Couples write; members read |
| 0005 | `led_background_renders` | B | Cascades from project |
| 0006 | `event_vendor_relationships` | B | Couple's vendor list; couples write, members read |
| 0006 | `vendor_milestones` | B (couples write) | Payment milestones — couple-encoded only in V1 |
| 0006 | `vendor_meetings` | B | `created_by_actor` for forward-compat with Din |
| 0006 | `crew_meals` | B | Computed total — couples write |
| 0007 | `event_budget_items` | B | Three lines per vendor (Package / Crew Meal / Transport) |
| 0007 | `event_budget_payments` | B | Payment log with proof screenshots |
| 0007 | `misc_expenses` | B | Free-form couple expenses |
| 0008 | `seating_tables` | B | Floor plan tables |
| 0008 | `seating_elements` | B | Stage / band / dancefloor / doors |
| 0008 | `seating_assignments` | B | Guest ↔ chair |
| 0008 | `seating_publishes` | B | Publish snapshots with QR tokens |
| 0008 | `table_qr_tokens` | B | Minted at publish — anyone-with-token redeems via Edge Function |
| 0009 | `photo_deliveries` | B | Drive folder ↔ event mapping |
| 0009 | `photo_compression_jobs` | F | Background job records — admin-only |
| 0010 | `mood_board_palettes` | B | Couple writes; saved palettes |
| 0010 | `mood_board_themes` | H | 20 pre-template themes — static reference |
| 0010 | `mood_board_color_library` | H | ~300 named colors — static reference |
| 0011 | `live_stream_sessions` | B | Couples write; members read |
| 0011 | `live_stream_cameras` | B | Camera slots per session |
| 0011 | `live_stream_broadcasts` | B | Active broadcast state |
| 0011 | `broadcast_style_presets` | H | News / Cinematic / Sports / Royalty — static |
| 0011 | `ai_highlight_renders` | B | Couples request; members view |
| 0012 | `paparazzi_seats` | B | Seats per event; couples manage |
| 0012 | `photos` | B | All event members read; couples + paparazzi write |
| 0012 | `photo_tags` | B | Same scope as photos |
| 0012 | `personal_reels` | B (guest writable) | Guest writes own reel; couples read all |
| 0012 | `template_library` | H | ~400 templates — static reference |
| 0012 | `event_template_unlocks` | B | Which templates are unlocked per event |
| 0012 | `dslr_pairings` | B | Phone ↔ DSLR pair records |
| 0012 | `face_enrollments` | B | Per-event vector store — never cross-event |
| 0019 | `chat_threads` | E | Thread-scoped |
| 0019 | `chat_messages` | E | Thread-scoped; sender_id append-only |
| 0019 | `chat_thread_participants` | E | Self-managed via couples/vendor admin |
| 0019 | `chat_attachments` | E | R2 keys; access gates via Edge Function signed-URL |
| 0019 | `video_meetings` | E | Daily.co room records |
| 0019 | `meeting_recordings` | E | Cascades from `video_meetings` |
| 0022 | `vendors` | D | Public marketplace + private vendor edit |
| 0022 | `vendor_services` | C | Vendor-team-scoped |
| 0022 | `vendor_packages` | C | Vendor-team-scoped |
| 0022 | `vendor_team_members` | C (owner-only write) | Owner manages team |
| 0022 | `vendor_calendar_blocks` | C | Availability calendar |
| 0022 | `vendor_portfolio_items` | D | Public-read on published items |
| 0022 | `vendor_reviews` | D | Public-read on published only; customer-write on own review |
| 0022 | `vendor_payouts` | C + admin | Vendor team + admin read; admin write |
| 0023 | `admin_audit_log` | F | Admin-only |
| 0023 | `admin_approval_requests` | F | Two-admin approval queue |
| 0023 | `payment_receiving_accounts` | F | Static BDO + GCash account numbers |
| 0023 | `vendor_registrations` | F | Verification queue intake |
| 0023 | `dispute_cases` | F | Dispute mediation |
| 0023 | `team_shared_monthly_allowance` | F | § 10b shared pool ledger |
| 0023 | `team_allowance_consumptions` | F | § 10b per-spend ledger |
| 0024 | `save_the_date_projects` | B | Couples write; members read |
| 0024 | `engagement_clips` | B | 3–8 input clips per project |
| 0024 | `save_the_date_renders` | B + G | Render record on B, order on G |
| 0024 | `save_the_date_templates` | H | 30 templates — static reference |
| 0025 | `notification_preferences` | A | Per-user private |
| 0025 | `data_export_requests` | A + admin | User initiates; admin processes |
| 0025 | `account_deletion_requests` | A + admin | RA 10173 soft/hard delete queue |
| 0025 | `marketing_consents` | A | RA 10173 marketing-consent ledger |
| 0025 | `user_payment_methods` | A | Per-user stored cards / bank refs (tokenized) |
| 0025 | `face_data_revocations` | A + service-role | Revocation log; vector deletion via Edge Function |
| 0026 | `setnayan_tax_config` | H | VAT vs Percentage Tax + effective-dating |
| 0026 | `official_receipts` | G (read-only owner) | Customer reads own; admin writes; immutable post-issue |
| 0026 | `vendor_form_2307_records` | C + admin | Vendor reads own; admin writes |
| 0026 | `efps_report_exports` | F | Admin-only |
| 0028 | `email_templates` | H | 10 V1 templates — static reference |
| 0028 | `email_send_log` | F | Admin-only deliverability log |
| 0028 | `email_unsubscribes` | A + anon (token-resolved) | RFC 8058 one-click unsubscribe via Edge Function |
| 0029 | `help_articles` | H | Public-read FAQ corpus |
| 0029 | `help_search_index` | H | Cached search index |
| 0029 | `support_tickets` | A (customer) + F (admin) | Customer reads own; admin reads all |
| 0029 | `support_ticket_messages` | A (customer) + F (admin) | Threaded under ticket |
| 0030 | `tour_completions` | A | Per-user tour progress |
| 0030 | `tour_definitions` | H | Per-role scripts — static reference |
| 0031 | `day_of_event_states` | B | Live-event mode lifecycle |
| 0031 | `guest_video_guestbook_entries` | B (guest writable) | Guest writes own entry; couples + admin read all |
| 0031 | `coordinator_broadcasts` | B (coordinator/admin write) | Coordinator and couple write; members read |
| 0032 | `contracts` | C + customer-read | Vendor team writes; counterparty customer reads |
| 0032 | `contract_drafts` | C | Vendor-team-scoped draft area |
| 0032 | `contract_analyses` | C + customer | AI analysis per contract |
| 0032 | `contract_signatures` | C + customer | E-signature evidence (V1.5 capability) |
| 0032 | `setnayan_clause_library` | H | ~50 canonical clauses — static reference |
| 0033 | `api_tokens` | A | Per-user OAuth2 PKCE issued tokens |
| 0033 | `api_oauth_clients` | F | Admin-curated app registry |
| 0033 | `api_rate_limit_buckets` | F + service-role write | Service-role increments; admin reads |
| 0033 | `api_webhook_subscriptions` | C | Vendor-team-scoped webhooks |
| 0033 | `api_webhook_deliveries` | C + admin | Delivery log |
| 0034 | `service_catalog` | H | Master SKU list |
| 0034 | `service_catalog_price_history` | H | Effective-dated price log |
| 0034 | `carts` | A | Per-customer cart |
| 0034 | `cart_items` | A | Per-customer cart items |
| 0034 | `service_orders` | G | Customer + admin + vendor (item-only) |
| 0034 | `service_order_items` | G | Three-way visibility |
| 0034 | `service_order_payments` | G | Customer reads own; admin reconciles |
| 0034 | `comp_grants` | F | Admin-managed comp records |

---

## 6. Edge cases + gotchas

- **Anonymous public reads.** Marketplace vendor pages, save-the-date public
  links, slug-resolved couple landing pages all require `TO anon` in the
  SELECT policy. Scope tightly: `is_published = TRUE` AND `is_active = TRUE`
  AND any role-specific visibility rule. Anonymous reads must never expose
  PII (customer email, phone, address). When a public page needs richer
  data (e.g., a vendor's calendar availability), route it through an Edge
  Function that returns a sanitized projection — don't widen the RLS policy.
- **Service-role bypass.** Edge Functions running as `service_role` bypass
  RLS entirely. Use this for: token-resolved redemption flows
  (`event_join_tokens`, `table_qr_tokens`, email unsubscribe), cron jobs
  (monthly pool reset per § 10b, photo-compression sweep, vector-cache
  refresh), webhook handlers (Daily.co recording-ready, Resend bounce),
  background renders. Every service-role Edge Function MUST perform its own
  application-level authorization check before mutating data — service-role
  is "trust the function," not "trust the request."
- **Cascade deletes.** RA 10173 hard-delete (per 0025) is implemented as a
  cascade from `users`. RLS does NOT run on cascade, so FK `ON DELETE`
  behavior is the only line of defense for related rows. Use
  `ON DELETE CASCADE` for personal-data tables (Pattern A); use
  `ON DELETE SET NULL` for tables where the row should survive the user
  (e.g., `photos.uploaded_by_user_id` survives so the photo remains in
  the event gallery).
- **Cross-event leaks.** The most common bug class. Guest A on Event 1 must
  never see Guest B on Event 2 even though both rows live in `guests`.
  Pattern B's `event_id IN (SELECT current_event_ids())` is the canonical
  defense. Every new event-scoped table must include `event_id` as a NOT
  NULL column and the matching policy.
- **Internal accounts (§ 10a).** Owner and spouse have `users.is_internal =
  TRUE` and an unlimited comp grant. They do NOT get RLS-elevated access.
  They see exactly what a customer sees, with the same `event_members` /
  `vendor_team_members` requirements. The `is_internal` flag only routes
  the comp-grant resolver to skip the payment-pending state; it does not
  unlock other people's data.
- **Setnayan team-pool (§ 10b).** Same RLS rule as internal accounts —
  `is_team_member` is irrelevant to row visibility. Pool consumption is
  audited through `team_allowance_consumptions`, which is admin-only.
- **Admin impersonation ("View as user").** When an admin opens a support
  ticket and clicks "View as user," the front-end performs a brief JWT
  swap via Supabase Auth Admin API and a new short-TTL JWT impersonates the
  user. RLS then runs as that user — admin's "elevated" perspective is
  bounded by the user's natural row visibility. Every impersonation
  start/end is logged to `admin_audit_log` with reason code.
- **`WITH CHECK` vs `USING`.** `USING` filters rows visible to SELECT /
  UPDATE / DELETE. `WITH CHECK` validates rows produced by INSERT / UPDATE.
  Patterns A through H all include `WITH CHECK` where INSERT or UPDATE is
  permitted — otherwise a user could SELECT-restrict to their own rows but
  INSERT a row claiming `event_id = 'someone_elses_event'`.
- **Helper-function ownership.** The `SECURITY DEFINER` helpers run as the
  function owner, NOT the caller. If we deploy them as `postgres` superuser,
  any sloppy invariant inside the function bypasses every check. Deploy
  helpers as `supabase_admin` and audit them quarterly.

---

## 7. Testing strategy

Per 0013 Section C, every RLS pattern requires **four test cases**:

1. **Happy path** — Authorized user can perform the action.
2. **Wrong user** — A different authenticated user gets blocked.
3. **Wrong role** — An event member with the wrong `member_type` (e.g.,
   guest trying to delete from the guest list) gets blocked.
4. **Wrong event/vendor/thread** — A user with rows on Event 1 / Vendor X /
   Thread α tries to access Event 2 / Vendor Y / Thread β data and gets
   blocked.

Across the 8 patterns: ~32 baseline cases. Add coverage for:
- Anonymous reads on Pattern D (anon can read published, can't read drafts).
- Service-role bypass on every Pattern (sanity check that Edge Function
  paths still work).
- Admin override on Patterns A / B / C / G (admin can do what the resource
  owner can do).
- Cascade-delete propagation on Patterns A / B / E.

**Total RLS-specific integration tests: ~50 cases.** Live in
`apps/web/tests/rls/` and run on every PR.

A common harness:

```ts
test('Pattern B — wrong event blocked', async () => {
  const userA = await signInTestUser('alice@test.local');
  const eventB = await seedEvent({ owner: 'bob@test.local' });
  const result = await userA.from('guests').select('*').eq('event_id', eventB.id);
  expect(result.data).toEqual([]);    // RLS returns 0 rows, not an error
  expect(result.error).toBeNull();
});
```

Note: RLS denies by returning zero rows on SELECT, not by raising an
error. Tests must assert on result shape, not on thrown exceptions.

---

## 8. Migration order

Every schema migration follows this sequence:

1. **Create tables** with `ENABLE ROW LEVEL SECURITY` immediately after
   `CREATE TABLE`. Don't defer — a table created without RLS is briefly
   wide-open even on staging.
2. **Create/refresh the four helper functions.** Re-running
   `CREATE OR REPLACE FUNCTION ...` for the four helpers is idempotent and
   keeps the signatures current.
3. **Create policies per table** in the order: SELECT → INSERT → UPDATE →
   DELETE → admin override. Naming convention:
   `<scope>_can_<action>` (e.g., `event_member_can_read`,
   `couple_can_update`).
4. **Run the verification query** (§9) at the end of every migration. If it
   returns rows, the migration fails before being marked applied.

For the initial database build (Supabase project bootstrap per 0013), run
the helper-function migration *first*, then iterate through each iteration's
table-creation + policy migration in numeric order (0000 → 0001 → 0002 → ...
→ 0034). The order matters because some helper functions read tables defined
in 0000 (`users`, `event_members`).

---

## 9. Verification query

CI runs this on every deploy. Non-empty result fails the deploy.

```sql
-- A) Tables with RLS disabled (security gap)
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = pg_tables.tablename
      AND n.nspname = pg_tables.schemaname
      AND c.relrowsecurity = TRUE
  );

-- B) Tables with RLS enabled but no policies (default-deny on everyone,
--    including the admin — also a security gap because it locks legitimate
--    access too)
SELECT t.schemaname, t.tablename
FROM pg_tables t
WHERE t.schemaname = 'public'
  AND EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = t.tablename
      AND n.nspname = t.schemaname
      AND c.relrowsecurity = TRUE
  )
  AND NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = t.tablename
      AND n.nspname = t.schemaname
  );

-- C) Public-schema tables granted to anon without a corresponding
--    SELECT policy that scopes the read (catches over-broad GRANTs)
SELECT table_name
FROM information_schema.role_table_grants
WHERE grantee = 'anon'
  AND table_schema = 'public'
  AND privilege_type = 'SELECT'
  AND table_name NOT IN (
    SELECT c.relname FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
  );
```

Add the three queries to `apps/web/scripts/rls-audit.sql` and wire it into
the Vercel + Supabase deploy hook. A clean output on all three is the
pre-merge floor.

---

## 10. Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-05-12 | **Eight canonical patterns lock the V1 RLS architecture.** Every new table maps to A / B / C / D / E / F / G / H or is rejected at review. | Constrains the surface area an engineer has to reason about. New iterations can't invent novel scoping rules without explicit owner sign-off. |
| 2026-05-12 | **Four security-definer helpers (`is_admin`, `current_event_ids`, `current_vendor_ids`, `current_thread_ids`) own the cross-table lookups.** | `STABLE` caching makes ~85-table RLS coverage performant. Policies become one-liners; auditing the helpers once is cheaper than auditing every inlined subquery. |
| 2026-05-12 | **Default-deny + ENABLE RLS at CREATE TABLE time.** No table is briefly open even on staging. | Closes the staging-window leak class where a developer forgets to apply the policy after creating the table. |
| 2026-05-12 | **Service-role usage is whitelisted, not implicit.** Each Edge Function declaring `service_role` must justify it in code review. | Service-role is the keys to the kingdom; we want the surface visible and reviewable. |
| 2026-05-12 | **Cross-event leak is the canonical bug class.** Pattern B's `event_id IN (SELECT current_event_ids())` is required on every event-scoped table. | This is the single highest-impact privacy bug for the platform; the helper function makes the right answer also the easiest one. |
| 2026-05-12 | **Internal accounts (§ 10a) and team-pool members (§ 10b) get NO RLS elevation.** Their flags only affect the comp-grant resolver, not row visibility. | Privilege creep is how internal-tool accounts become attack vectors. The team-pool perk is a billing concept, not an access concept. |
| 2026-05-12 | **CI verification query (§ 9) is a merge floor, not an alert.** Non-empty result fails the deploy. | The whole point of canonical patterns is that "no RLS coverage" is mechanically detectable; making it a hard fail prevents drift. |
| 2026-05-12 | **Tests assert on result shape, not exceptions.** RLS denies by returning zero rows; PostgREST returns 200 with `[]`. | Test authors coming from RBAC-style backends instinctively `expect.toThrow()`; RLS doesn't behave that way. Documenting the assertion shape prevents false-confidence tests. |
| 2026-05-12 | **Helper-function owner is `supabase_admin`, not `postgres`.** | Reduces the blast radius if a helper has a logic bug. `supabase_admin` already has the privileges the helpers need without being a full superuser. |

---

## Follow-up items

- **Per-attachment R2 signed-URL gating.** Pattern E covers the
  `chat_attachments` row, but the actual file bytes live in R2. R2 access is
  gated by a Setnayan Edge Function that re-validates `chat_thread_participants`
  before issuing the signed URL. This is application-tier, not RLS — keep the
  pattern documented next to the Edge Function code.
- **Photo storage R2 keys.** Same pattern as chat attachments — the `photos`
  row is RLS-gated (Pattern B), but the R2 object itself needs a signed-URL
  resolver. Move to a shared `r2-signed-url` Edge Function so both Papic and
  chat share the access-check pathway.
- **Read replica RLS divergence.** Supabase managed replicas run with the
  same policies, but if we ever introduce a self-managed read replica for
  analytics, the helper functions need re-grant. Document at that time.
