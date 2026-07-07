# Database_Schema_Master.sql — Companion Index

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main)
> **This doc is HISTORICAL/REFERENCE.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. The consolidated `Database_Schema_Master.sql` was a 2026-05-14 paper merge of the `0000–0035` specs; the **real schema is the applied migrations in `supabase/migrations/`** (~200+ files at origin/main), which advanced well past this index. Deltas:
> - **Use `supabase/migrations/` as the schema of record, NOT this index.** Base objects (`is_admin`, `generate_public_id`, `current_*` helpers) live in `20260512000000_setnayan_base.sql`; the platform now has many tables this 104-table list never anticipated.
> - **0034 table names DRIFTED:** shipped tables are **`orders`** + **`payments`** (apply-then-pay; `reference_code` column; admin-approval reconciliation), NOT `service_orders`/`service_order_items`/`service_order_payments`/`payment_inbox_messages`. See `20260513150000_iteration_0034_payments.sql`.
> - **0003 customer token wallet stays RETIRED** (correctly excluded here) — but a **vendor token economy is now LIVE** (e.g. `vendor_token_grants`, burn-on-answer in `20260908000000_vendor_token_burn_on_answer.sql`, admin-editable `token_burn_bands`); none of those tables appear in this index.
> - **BIR (0026) is RETIRING** (owner-authorized 2026-06-07) — `official_receipts`/`or_sequence_state`/`setnayan_tax_config`/`form_2307_issuances` are historical, not a live tax surface. **Video meetings (0019)** `video_meetings`/`video_meeting_participants` reflect a retired feature.
> - Commission is **0%** (any "Setnayan Pay 3%/5% reconciliation" intent in `service_order_items` notes is moot); vendor↔customer money is **OFF-PLATFORM**; the planner ships as "Setnayan AI" ₱3,999 (no `concierge` schema is canonical).
>
> When this body disagrees with the above, **the above wins.**

Generated 2026-05-14 from feature specs `0000_*` through `0035_*` under
`/Users/icecasasola/Documents/Claude/Projects/Setnayan/`.

This file is the table-of-contents and audit trail for
`Database_Schema_Master.sql`. It lists every extracted table with its source
feature folder, every conflict the consolidation flagged, every spec that
contained no DDL, and the total table count.

## How the master schema was assembled

1. Each `0NNN_*` folder's `.md` was grepped for DDL keywords
   (`CREATE TABLE|ALTER TABLE|CREATE INDEX|CREATE TYPE|CREATE EXTENSION|`
   `CREATE POLICY|CREATE FUNCTION|CREATE TRIGGER|CREATE MATERIALIZED VIEW|`
   `CREATE OR REPLACE|CREATE UNIQUE|CREATE SCHEMA|CREATE VIEW`).
2. Matched lines were read in context (with 30–100 lines of surrounding spec)
   and DDL preserved verbatim wherever the source used real SQL.
3. Where a spec used pseudo-DDL shorthand (e.g., 0022's
   `vendors(vendor_id, owner_user_id, ...)` column lists or 0023's
   `service_categories(...)`), the consolidation converted it to real DDL and
   flagged each conversion with a `-- ⚠ Pseudo→SQL:` comment.
4. The 0012 papic migration ships a real `.sql` file
   (`0012_papic_migration.sql`); its content was preserved verbatim except for
   one trim (the `NOTIFY tayo_schema_change` line — out of brand, retired
   alongside 0003 token wallet). The migration's references to retired-0003
   `wallet_spend(...)` and `token_transactions` were preserved with
   `-- ⚠ RETIRED-REF` callouts.
5. `0003_token_wallet/*` is RETIRED per `RETIRED_ITEMS.md` and `CLAUDE.md`
   decision log; no DDL from that folder is included.
6. Folders under `02_Specifications/` (e.g., `07_V1_Developer_Specification.md`)
   are NOT extracted — they live outside the `0000_*…0035_*` range per task
   instructions.

## Total table count

**104** tables created in the consolidated schema, broken down by source
feature (some features contribute multiple tables):

| Source feature                                       | Tables                                                                                                                                                                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0000 — app shell                                     | `events` (skeleton — see flags), `users`, `event_join_tokens`, `event_members`                                                                                                                          |
| 0001 — guest list                                    | `households`, `guests`                                                                                                                                                                                  |
| 0002 — QR invitation                                 | `scan_events`, `slug_change_log`, `guest_rsvp_extras`                                                                                                                                                   |
| 0004 — invitation widgets                            | `invitation_widgets`, `pro_widget_purchases`                                                                                                                                                            |
| 0005 — LED background maker                          | `led_background_configs`, `led_background_renders`                                                                                                                                                      |
| 0006 — vendors management                            | `event_vendor_relationships`, `vendor_services` (per-event), `event_custom_services`, `event_service_coverage_status`, `vendor_inclusions`, `vendor_payment_milestones`, `vendor_crew`, `vendor_meetings`, `vendor_contracts`, `vendor_reviews` |
| 0008 — seating chart editor                          | `tables`, `event_floor_plan`                                                                                                                                                                            |
| 0009 — photo delivery                                | `photos` (skeleton — see flags), `photo_delivery_jobs`                                                                                                                                                  |
| 0011 — panood                                        | `highlight_markers`, `sde_renders`                                                                                                                                                                      |
| 0012 — papic                                         | `dslr_pairings`, `face_enrollments`, `face_enrollment_audit`, `photo_tags` (skeleton — see flags)                                                                                                       |
| 0015 — main website                                  | `vendor_registrations`                                                                                                                                                                                  |
| 0019 — communications                                | `chat_threads`, `chat_thread_participants`, `chat_messages`, `chat_attachments`, `chat_reactions`, `video_meetings`, `video_meeting_participants`, `thread_join_authorizations`, `vendor_users` (skeleton — see flags), `force_majeure_flags` |
| 0022 — vendor dashboard                              | `vendors`, `service_categories`, `vendor_marketplace_services`, `vendor_calendar_blocks`, `vendor_bookings`, `vendor_plans`, `vendor_team_members`, `vendor_service_agents`                             |
| 0023 — admin console                                 | `unlimited_use_grants`, `team_shared_monthly_allowance`, `team_allowance_consumptions`, `admin_approval_requests`, `payment_receiving_accounts`, `funnel_events`                                       |
| 0025 — profile settings                              | `data_export_requests`, `notification_preferences`, `customer_payment_methods`                                                                                                                          |
| 0026 — BIR tax compliance                            | `official_receipts`, `or_sequence_state`, `setnayan_tax_config`, `or_replacements`, `vendor_payouts`, `form_2307_issuances`                                                                            |
| 0028 — email notifications                           | `email_dispatches`, `email_suppressions`, `email_unsubscribe_tokens`                                                                                                                                    |
| 0029 — help center                                   | `help_articles`, `article_feedback`, `help_search_synonyms`, `support_tickets`, `ticket_messages`, `support_canned_responses`, `support_routing_config`                                                  |
| 0030 — guided tour                                   | `tour_completions`, `tour_step_views`                                                                                                                                                                   |
| 0031 — day-of guest                                  | `event_schedule_segments` (skeleton — see flags), `event_broadcasts`, `broadcast_acknowledgments`, `video_guestbook_entries`, `guest_photo_hides`, `event_guestbook_prompts`                            |
| 0032 — contract intelligence                         | `contract_drafts`, `contract_signatures`, `contract_clause_library`, `contract_purchases`                                                                                                               |
| 0033 — public API foundation                         | `oauth_applications`, `oauth_authorizations`, `api_tokens`, `api_request_log`, `webhook_subscriptions`, `webhook_deliveries`                                                                            |
| 0034 — payments & cart                               | `service_catalog`, `service_catalog_price_history`, `carts`, `cart_items`, `service_orders`, `service_order_items`, `service_order_payments`, `comp_grants`, `payment_inbox_messages`                  |

In addition, **2 views**:

- `vendor_crew_meal_totals` (0006)
- (no plain views from other features)

And **2 materialized views**:

- `vendor_review_stats` (0006)
- `email_metrics_daily` (0028)

## Features with no DDL (UI-only specs)

These folders were scanned and confirmed to contain no `CREATE TABLE`,
`ALTER TABLE`, `CREATE INDEX`, `CREATE TYPE`, `CREATE EXTENSION`,
`CREATE POLICY`, `CREATE FUNCTION`, `CREATE TRIGGER`, or
`CREATE MATERIALIZED VIEW` statements:

- **0007** — Budget & Expenses — consumes existing tables, no schema additions
- **0010** — Mood Board — UI-only; storage handled via R2 outside Postgres
- **0016** — Step-by-step plan builder — UI-only
- **0017** — Patiktok — UI-only spec
- **0018** — Supplies marketplace — UI-only spec
- **0020** — Interaction prototype — UI prototype, no schema
- **0021** — Couple dashboard (fully purchased) — UI-only; reuses upstream tables
- **0024** — Save-the-Date — UI-only spec; reuses `service_catalog.save_the_date_render`
- **0035** — Observability — covers tracing, logs, metrics; no Postgres schema

(0003 — token wallet — is **retired** per `RETIRED_ITEMS.md`; excluded from
extraction entirely.)

## Schemas not fully specified by 0000–0035

The following tables are **referenced by FKs or ALTER TABLE statements** in
0000–0035 but never **formally CREATE TABLEd** within the 0000–0035 range.
The master schema file provides minimum skeletons (clearly marked) so the
ALTERs apply on a fresh database. Bring these in line with
`02_Specifications/07_V1_Developer_Specification.md` (out of task scope)
before production deployment:

- **`events`** — declared in 07_V1_Developer_Specification.md; 0000–0034
  ALTER it 30+ times. Skeleton in master schema covers `event_id, couple_id,
  wedding_date, archived, created_at, updated_at` plus all the ALTER columns.
- **`photos`** — declared in 07_V1_Developer_Specification.md; 0009 + 0012 +
  0031 extend it. Skeleton in master schema covers the columns 0009 reads/
  writes per `0009_photo_delivery_result.md`.
- **`photo_tags`** — referenced by 0012; baseline (`tag_id, photo_id,
  guest_id, source, created_at`) inferred from 0012's ALTER + the migration
  comments.
- **`papic_seats`** — referenced by 0012 (`dslr_pairings.papic_seat_id` FK);
  declared in the 0012 webapp slice, not in any 0000–0035 spec file.
- **`panood_cameras`** — referenced by 0011 broadcaster control + by 0012
  RLS; never formally CREATE TABLEd in 0000–0035.
- **`event_schedule_segments`** — referenced by 0031 ALTER; never CREATE
  TABLEd. Skeleton in master schema covers `segment_id, event_id, name,
  starts_at, ends_at, status, actual_started_at, actual_ended_at,
  cancellation_reason`.
- **`vendor_users`** — referenced by 0019 ALTER; never CREATE TABLEd. The
  canonical team table is 0022's `vendor_team_members`; the master schema
  provides a minimum `vendor_users(vendor_user_id, vendor_id, user_id,
  team_label, created_at)` so 0019's `ALTER TABLE vendor_users` resolves.

## Conflicts flagged

The consolidation flagged the following inconsistencies between specs.
All are marked with `-- ⚠ CONFLICT:` comments in `Database_Schema_Master.sql`.

1. **`vendor_services` name collision** (0006 vs 0022)
   - 0006 declares `vendor_services(relationship_id, service_kind, ...)` as
     the per-event-relationship link table
   - 0022 declares `vendor_services(service_id, vendor_id, title, ...)` as
     the marketplace authoring table
   - **Resolution in master schema:** renamed 0022's variant to
     `vendor_marketplace_services` so both shapes coexist. Downstream code
     that joined to `vendor_services.service_id` must update its references.

2. **`face_enrollments` column-set drift** (0012 spec .md vs 0012 .sql migration)
   - 0012's .md (lines 316–326) declares `face_enrollments` without
     `vector_dim`, `qa_breakdown_json`, `revocation_reason`, the 512-byte
     vector-size CHECK, and the per-source UNIQUE constraint.
   - 0012's .sql migration file declares the canonical, richer shape.
   - **Resolution:** master schema uses the .sql migration form
     (idempotent, safe to re-run).

3. **`photos.captured_at` NOT-NULL approach drift** (0012 spec .md vs .sql)
   - 0012's .md (lines 517–525) adds the column as plain `NOT NULL` with no
     backfill — fails on any pre-existing photos rows.
   - 0012's .sql migration uses `ADD COLUMN IF NOT EXISTS` (nullable) +
     backfill + post-add `SET NOT NULL`.
   - **Resolution:** master schema uses the .sql migration form (idempotent).

4. **`sde_renders.order_id` FK target column-name** (0011 vs 0034)
   - 0011's `sde_renders.order_id` REFERENCES `service_orders(service_order_id)`.
   - 0034's `service_orders` PK column is `order_id`, not `service_order_id`.
   - **Resolution:** master schema uses 0034's canonical column name
     `service_orders(order_id)`. Migration writers should verify this is the
     right FK target.

5. **`service_catalog` column-set drift** (0011/0012 INSERTs vs 0034 CREATE)
   - 0011 INSERTs into `service_catalog` using legacy columns `sku_key,
     customer_price_php_centavos, description`.
   - 0012 INSERTs into `service_catalog` using legacy columns `service_key,
     display_name_en, display_name_fil, token_display, ref_type,
     one_time_per_event, iteration_origin, active`.
   - 0034 declares the canonical schema with `sku_code, name, description,
     category, price_php_centavos, is_multi_purchase, is_active,
     effective_from, effective_until, created_at`.
   - **Resolution:** master schema uses 0034's canonical schema and rewrites
     the 0011 + 0012 INSERTs against the canonical column names. Token
     display values dropped (companion 0003 wallet retired). 0012's SKU
     `'pro_camera_bridge_addon'` renamed to 0034's `'pro_camera_bridge_seat'`
     (same product, single canonical name).

6. **`wallet_spend()` reference inside 0012's RPC** (RETIRED-REF)
   - 0012's `wallet_spend_pro_camera_bridge()` function PERFORMs
     `wallet_spend(p_event_id, 'pro_camera_bridge_addon', ...)` which is
     defined in the retired 0003 token wallet.
   - **Resolution:** function preserved verbatim with `-- ⚠ RETIRED-REF`
     callout. Will fail on a fresh DB without 0003. Replace the
     `wallet_spend` PERFORM call with a `service_orders` INSERT against the
     canonical 0034 catalog before deploying.

7. **0013 example RLS column-name drift** (`guests.id` vs `guests.guest_id`)
   - 0013's documentation example uses `WHERE id IN (...)` against `guests`,
     but the 0001 schema's PK column is `guest_id`.
   - **Resolution:** master schema preserves the example verbatim with a
     `-- ⚠ NOTE: replace 'id' with 'guest_id'` callout above it.

8. **0034 `match_inbox_to_order` references `users.full_name`**
   - 0034's reconciliation function joins on `u.full_name`, but the 0000
     `users` schema has `display_name`, not `full_name`.
   - **Resolution:** master schema preserves the function verbatim with a
     `-- ⚠ NOTE: replace u.full_name with u.display_name` callout.

9. **Duplicate `idx_users_account_type` index** (0000 spec)
   - 0000's "Schema changes" block writes the index twice — once as
     `CREATE INDEX idx_users_account_type` (no IF NOT EXISTS), once with
     `CREATE INDEX IF NOT EXISTS idx_users_account_type` "for existing
     deployments."
   - **Resolution:** master schema preserves both statements (second is a
     no-op when the first ran), per task instruction to preserve
     `IF NOT EXISTS` guards verbatim.

10. **Duplicate `events.archived` ALTER** (0000 spec)
    - 0000's "Schema changes" block adds `archived BOOLEAN NOT NULL
      DEFAULT FALSE` as if events doesn't have it, but the canonical events
      table (in 07_V1_Developer_Specification.md and the column references
      throughout 0009 + 0015) treats `archived` as a pre-existing column.
    - **Resolution:** master schema declares `archived` in the events
      skeleton (since 0000–0035 doesn't have a canonical events CREATE
      TABLE) and notes in a comment that the original spec line is
      effectively a no-op.

## Notes for future readers

- **Apply in order top-to-bottom.** Tables are declared in approximate
  dependency order. The few intentional forward-references (`events`,
  `vendors`, `photos`, `papic_seats`, `panood_cameras`) are forward-declared
  as minimum skeletons (where the dependency target lives outside 0000–0035)
  or are simply declared later (where Postgres tolerates the forward FK).
- **The schema is "complete" for the 0000–0035 feature set,** but not for
  V1 production. Per § "Schemas not fully specified," about half a dozen
  base tables (`events`, `photos`, `photo_tags`, `papic_seats`,
  `panood_cameras`, `event_schedule_segments`, `vendor_users`) live partly
  or entirely in the older `02_Specifications/07_V1_Developer_Specification.md`
  spec or in webapp-slice code — outside this task's scope. Reconcile those
  before production deploy.
- **The brand is "Setnayan."** No "Tayo" naming was introduced. One legacy
  `NOTIFY tayo_schema_change` line in 0012_papic_migration.sql was excluded
  from the consolidated master (replace with a proper Setnayan notify channel
  before deploy).
