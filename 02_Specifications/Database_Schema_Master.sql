-- ============================================================================
-- Setnayan V1 — Master Database Schema
-- Consolidated from feature specs 0000–0035
-- Generated 2026-05-14
-- Apply to a fresh Supabase Postgres database in order.
--
-- This file is derived from the .md (and 0012_papic_migration.sql) feature
-- specifications. DDL was extracted verbatim where the spec used real SQL,
-- and converted from shorthand pseudo-schema notation to real DDL only where
-- the spec used pseudo-syntax (e.g., several 0022 vendor-dashboard tables and
-- 0023 service_categories — clearly marked with `-- ⚠ Pseudo→SQL:` comments).
--
-- IF NOT EXISTS / IF EXISTS guards are preserved verbatim where the source
-- spec included them. CREATE TABLE order roughly follows dependency:
-- 1) Extensions
-- 2) Custom types & enums
-- 3) Tables (ordered by FK dependency, grouped by feature)
-- 4) Indexes (non-PK, non-unique helpers)
-- 5) Row-Level Security policies
-- 6) Functions & triggers
-- 7) Materialized views
--
-- RETIRED IN V1: 0003 token wallet — its tables (token_wallets,
-- token_transactions, wallet_spend etc.) are NOT included. The 0012 papic
-- migration that references `wallet_spend()` and `token_transactions` is
-- preserved verbatim for archeology; flagged with -- ⚠ RETIRED-REF.
-- ============================================================================


-- ─── Extensions ─────────────────────────────────────────────────────────────
-- Source: 0034_payments_and_cart/0034_payments_and_cart.md (pg_trgm in § 11.5)
-- Source: 0029_help_center/0029_help_center.md (FTS index uses to_tsvector)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- gen_random_uuid(), gen_random_bytes()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- fuzzy similarity() for payment reconciliation
-- Note: no explicit CREATE EXTENSION for tsvector — the `english` dictionary is built-in.


-- ─── Custom types & enums ──────────────────────────────────────────────────
-- No specs declare CREATE TYPE / CREATE DOMAIN — every enumerated value is
-- expressed as a CHECK constraint on a TEXT column (per project convention).


-- ─── Tables (ordered by dependency) ────────────────────────────────────────

-- ┌─ Feature 0000 — App shell & navigation ─────────────────────────────────┐
-- Source: 0000_app_shell_and_navigation/0000_app_shell_and_navigation.md
--
-- Note: `events` is referenced widely throughout the spec set but never
-- formally CREATE TABLEd in any 0000–0035 spec. The closest formal declaration
-- lives in 02_Specifications/07_V1_Developer_Specification.md (out of scope
-- per task instructions). Below is a MINIMUM `events` skeleton derived from
-- all FK references and ALTER TABLE column additions across 0000–0034; bring
-- it in line with 07_V1_Developer_Specification.md before production deploy.
-- ⚠ Schema not fully specified by 0000–0035 — see INDEX.
CREATE TABLE IF NOT EXISTS events (
  event_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id           UUID,                       -- pre-0000 column, target of UNIQUE INDEX events_one_primary_per_couple
  wedding_date        DATE,
  archived            BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 0000 §3 — event-type tag added during onboarding (also restated in §"Schema changes")
ALTER TABLE events ADD COLUMN event_type TEXT NOT NULL DEFAULT 'wedding'
  CHECK (event_type IN ('wedding', 'birthday', 'celebration', 'travel', 'corporate', 'burial'));

-- 0000 §"Schema changes" — primary-event picker columns
ALTER TABLE events ADD COLUMN is_primary BOOLEAN NOT NULL DEFAULT FALSE;
-- NOTE: archived already present in events skeleton above; original spec line:
-- ALTER TABLE events ADD COLUMN archived BOOLEAN NOT NULL DEFAULT FALSE;

CREATE UNIQUE INDEX events_one_primary_per_couple
  ON events (couple_id) WHERE is_primary = TRUE;


-- Universal Setnayan account identity (separate from per-event role)
-- Source: 0000_app_shell_and_navigation/0000_app_shell_and_navigation.md
CREATE TABLE users (
  user_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL UNIQUE,
  phone        TEXT,
  display_name TEXT,
  profile_photo_url TEXT,
  account_type TEXT NOT NULL DEFAULT 'customer'
                 CHECK (account_type IN ('customer','vendor','admin')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- For existing deployments where the users table was created before account_type existed:
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS account_type TEXT NOT NULL DEFAULT 'customer'
              CHECK (account_type IN ('customer','vendor','admin'));


-- Per-event QR (one row per event, generated when event is created)
-- Source: 0000_app_shell_and_navigation/0000_app_shell_and_navigation.md
CREATE TABLE event_join_tokens (
  event_id    UUID PRIMARY KEY REFERENCES events,
  token       TEXT NOT NULL UNIQUE,           -- 32-hex
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at  TIMESTAMPTZ                      -- couple can rotate the QR if it leaks
);


-- ┌─ Feature 0001 — Guest list ──────────────────────────────────────────────┐
-- Source: 0001_creating_guest_list/0001_creating_guest_list.md
--
-- NOTE on circular FK between guests↔households and guests↔tables:
-- the spec lists FOREIGN KEY in the column definitions; in this consolidated
-- file we declare `households` and `tables` first where possible, but
-- `guests.pair_with_guest_id` is intentionally self-referential so the table
-- creation order is guests-after-households-and-tables. `guests.table_assignment_id`
-- references `tables`, which is created in 0008.

-- Households declared first since guests references household_id
CREATE TABLE households (
  household_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
    -- Display label, e.g., "Reyes household", "De la Cruz household".
  address       JSONB,
    -- Shared mailing address for the household — used by the invitation system.
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- guests — primary master list (paired with 0008's `tables` table FK)
CREATE TABLE guests (
  guest_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  household_id        UUID REFERENCES households(household_id) ON DELETE SET NULL,
  pair_with_guest_id  UUID REFERENCES guests(guest_id) ON DELETE SET NULL,
  first_name          TEXT NOT NULL,
  last_name           TEXT NOT NULL,
  display_name        TEXT,
  side                TEXT NOT NULL CHECK (side IN ('bride', 'groom', 'both')),
  group_category      TEXT NOT NULL CHECK (group_category IN
                        ('family', 'friends', 'work', 'school', 'officiant', 'other')),
  role                TEXT NOT NULL DEFAULT 'guest',
    -- 18-value role taxonomy enforced separately; see role enum values list in
    -- 0001 spec § Role taxonomy (CHECK constraint left to migration writer).
  plus_one_allowed    BOOLEAN NOT NULL DEFAULT FALSE,
  plus_one_name       TEXT,
  plus_one_of_guest_id UUID REFERENCES guests(guest_id) ON DELETE SET NULL,
  plus_one_mode       TEXT CHECK (plus_one_mode IN ('full', 'limited')) DEFAULT NULL,
  email               TEXT,
  mobile              TEXT,
  address             JSONB,
  meal_preference     TEXT CHECK (meal_preference IN
                        ('beef', 'chicken', 'fish', 'vegetarian', 'vegan', 'kids', 'no_preference')),
  dietary_restrictions TEXT,
  photo_consent       BOOLEAN NOT NULL DEFAULT TRUE,
  table_assignment_id UUID REFERENCES tables(table_id) ON DELETE SET NULL,
    -- FK target `tables` is declared in feature 0008 below; this works under
    -- the standard Postgres "create later, FK validated at runtime" pattern,
    -- but apply migrations in feature order so `tables` exists first OR defer
    -- this FK to a follow-up ALTER TABLE if your migration runner is strict.
  invited_to_blocks   TEXT[] NOT NULL DEFAULT ARRAY['ceremony', 'reception']::TEXT[],
  custom_tags         TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  rsvp_status         TEXT NOT NULL DEFAULT 'pending'
                        CHECK (rsvp_status IN ('pending', 'attending', 'declined', 'maybe')),
  rsvp_responded_at   TIMESTAMPTZ,
  invitation_sent_at  TIMESTAMPTZ,
  notes               TEXT,
  qr_token            TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 0000 — link table between users and events (depends on guests + vendors)
-- Source: 0000_app_shell_and_navigation/0000_app_shell_and_navigation.md
-- Note: vendors table is created in 0006/0022 — this FK forward-references it.
CREATE TABLE event_members (
  member_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     UUID NOT NULL REFERENCES events,
  user_id      UUID NOT NULL REFERENCES users,
  member_type  TEXT NOT NULL CHECK (member_type IN ('couple', 'guest', 'vendor')),
  role         TEXT,                           -- 18-value role for guests; service slug for vendors
  guest_id     UUID REFERENCES guests,
  vendor_id    UUID REFERENCES vendors,        -- declared in 0006/0022
  joined_via   TEXT,                           -- 'qr_scan' | 'invited' | 'created_event'
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, user_id, member_type)
);


-- ┌─ Feature 0002 — QR invitation system ───────────────────────────────────┐
-- Source: 0002_qr_invitation_system/0002_qr_invitation_system.md

-- TBA +1 onboarding flag
ALTER TABLE guests ADD COLUMN plus_one_name_confirmed_at TIMESTAMPTZ;

-- Customer slug — real-time availability check
-- Slug column + format CHECK constraint
ALTER TABLE events
  ADD COLUMN slug TEXT UNIQUE NOT NULL,
  ADD CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]{3,32}$');

CREATE UNIQUE INDEX events_slug_lower_idx ON events (LOWER(slug));

-- Monogram source (auto-generated vs uploaded by couple)
ALTER TABLE events ADD COLUMN monogram_source TEXT NOT NULL DEFAULT 'auto_generated'
  CHECK (monogram_source IN ('auto_generated', 'uploaded'));
ALTER TABLE events ADD COLUMN monogram_svg TEXT;            -- auto-generated SVG
ALTER TABLE events ADD COLUMN monogram_uploaded_url TEXT;   -- R2 signed URL of couple-uploaded asset
ALTER TABLE events ADD COLUMN monogram_uploaded_format TEXT
  CHECK (monogram_uploaded_format IN ('svg', 'png') OR monogram_uploaded_format IS NULL);
ALTER TABLE events ADD COLUMN monogram_uploaded_at TIMESTAMPTZ;

-- Couple palette finalization → QR color lock-in
ALTER TABLE events ADD COLUMN palette_finalized_at TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN qr_color_dark TEXT;        -- cached derived value
ALTER TABLE events ADD COLUMN qr_color_light TEXT;       -- cached derived value

-- Guests — auto-set profile photo from first paparazzi capture
ALTER TABLE guests ADD COLUMN profile_photo_url TEXT;
ALTER TABLE guests ADD COLUMN profile_photo_set_at TIMESTAMPTZ;
ALTER TABLE guests ADD COLUMN profile_photo_segment TEXT;  -- 'ceremony' | 'cocktails' | 'reception' | manually set

-- First-rule of event-day scan (capture-portrait-before-anything-else)
ALTER TABLE guests ADD COLUMN first_rule_completed_at TIMESTAMPTZ;
ALTER TABLE guests ADD COLUMN first_rule_captured_by_user_id UUID REFERENCES users(user_id);

-- scan_events — every QR scan, regardless of surface
CREATE TABLE scan_events (
  scan_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  guest_id       UUID NOT NULL REFERENCES guests(guest_id) ON DELETE CASCADE,
  scanned_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source         TEXT NOT NULL CHECK (source IN ('browser', 'setnayan_native', 'setnayan_din', 'coordinator')),
  scanner_user_id UUID REFERENCES users(user_id),
  context        JSONB,
  user_agent     TEXT,
  ip_anon        TEXT
);

-- Vendor slugs share the same namespace; the v/ prefix on vendor URLs is purely cosmetic
ALTER TABLE vendors
  ADD COLUMN slug TEXT UNIQUE NOT NULL,
  ADD CONSTRAINT vendor_slug_format CHECK (slug ~ '^[a-z0-9-]{3,32}$');

CREATE UNIQUE INDEX vendors_slug_lower_idx ON vendors (LOWER(slug));

-- Optional: slug change history for SEO 301 redirects (90-day window)
CREATE TABLE slug_change_log (
  change_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type    TEXT NOT NULL CHECK (entity_type IN ('event','vendor')),
  entity_id      UUID NOT NULL,
  old_slug       TEXT NOT NULL,
  new_slug       TEXT NOT NULL,
  changed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by     UUID REFERENCES users(user_id),
  redirect_until TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '90 days')
);

-- guest_rsvp_extras — extra RSVP fields for registered guests
CREATE TABLE guest_rsvp_extras (
  guest_id          UUID PRIMARY KEY REFERENCES guests(guest_id) ON DELETE CASCADE,
  song_request      TEXT,
  dance_style       TEXT,
  photo_challenges_opt_in BOOLEAN DEFAULT TRUE,
  freeform_note     TEXT,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ┌─ Feature 0004 — Invitation widgets ─────────────────────────────────────┐
-- Source: 0004_invitation_widgets/0004_invitation_widgets.md

CREATE TABLE invitation_widgets (
  widget_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id         UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  widget_type      TEXT NOT NULL CHECK (widget_type IN (
    'hero_monogram','greeting','our_story','countdown','qr_code','rsvp',
    'event_details','venue','schedule','dress_code','photo_moments'
  )),
  tier             TEXT NOT NULL DEFAULT 'basic' CHECK (tier IN ('basic','pro')),
  position         INT NOT NULL,
  is_visible       BOOLEAN NOT NULL DEFAULT TRUE,
  config_json      JSONB NOT NULL DEFAULT '{}',
  pro_purchased_at TIMESTAMPTZ,
  pro_price_paid_centavos INT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, widget_type)
);

-- pro_widget_purchases — the upgrade record (FK to service_orders, created in 0034)
CREATE TABLE pro_widget_purchases (
  purchase_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id           UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  widget_id          UUID NOT NULL REFERENCES invitation_widgets(widget_id),
  purchase_type      TEXT NOT NULL CHECK (purchase_type IN ('individual','bundle')),
  php_price_centavos INT NOT NULL,
  order_id           UUID NOT NULL REFERENCES service_orders(order_id),
  refunded_at        TIMESTAMPTZ,
  refund_order_id    UUID REFERENCES service_orders(order_id),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ┌─ Feature 0005 — LED background maker ───────────────────────────────────┐
-- Source: 0005_led_background_maker/0005_led_background_maker.md

CREATE TABLE led_background_configs (
  config_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id           UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  template_id        TEXT NOT NULL CHECK (template_id IN (
    'filigree_bloom', 'capiz_shimmer', 'sampaguita_drift', 'gold_particles',
    'ethereal_mist', 'bokeh_lights', 'watercolor_wash', 'slow_pulse',
    'constellation', 'velvet_sweep'
  )),
  config_json        JSONB NOT NULL,
  is_default         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE led_background_renders (
  render_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id          UUID NOT NULL REFERENCES led_background_configs(config_id) ON DELETE CASCADE,
  status             TEXT NOT NULL CHECK (status IN ('queued','rendering','complete','failed')),
  progress_pct       INT NOT NULL DEFAULT 0,
  output_resolution  TEXT NOT NULL,
  output_duration_s  INT NOT NULL,
  loop_seam_validated BOOLEAN DEFAULT FALSE,
  photo_rotation_seed INT,
  output_r2_key      TEXT,
  output_size_bytes  BIGINT,
  error_message      TEXT,
  started_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at       TIMESTAMPTZ
);


-- ┌─ Feature 0006 — Vendors management ─────────────────────────────────────┐
-- Source: 0006_vendors_management/0006_vendors_management.md
--
-- Note: the marketplace `vendors` table itself is declared in 0022 (per the
-- locked 2026-05-12 decision log entry). 0006 only creates the per-event
-- relationship row + its supporting tables. We forward-declare `vendors` here
-- as a stub so 0006's FKs resolve, and merge the 0022 columns at that section.

-- ⚠ Pseudo→SQL: vendors row from 0022 § 2.1 (originally column-list shorthand)
CREATE TABLE vendors (
  vendor_id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id                   UUID REFERENCES users(user_id),
  business_name                   TEXT NOT NULL,
  service_category_primary        TEXT,
  service_category_secondary      TEXT[],
  city                            TEXT,
  verified_at                     TIMESTAMPTZ,
  is_active                       BOOLEAN NOT NULL DEFAULT TRUE,
  logo_r2_key                     TEXT NOT NULL,          -- 0022 § 2.1b — MANDATORY at registration
  hero_image_r2_key               TEXT,
  profile_description             TEXT,
  years_operating                 INT,
  travel_area_primary             TEXT,
  base_travel_fee_php             INT,
  pro_subscription_status         TEXT CHECK (pro_subscription_status IN ('inactive','active','paused'))
                                  DEFAULT 'inactive',
  pro_subscription_renews_at      TIMESTAMPTZ,
  show_team_labels_in_chat        BOOLEAN NOT NULL DEFAULT FALSE,   -- 0019 vendor identity masking
  created_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at                  TIMESTAMPTZ
);

-- 0006 — per-event vendor relationship
CREATE TABLE event_vendor_relationships (
  relationship_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  marketplace_vendor_id UUID REFERENCES vendors(vendor_id),
  business_name       TEXT NOT NULL,
  contact_name        TEXT,
  phone               TEXT,
  email               TEXT,
  website             TEXT,
  notes               TEXT,
  day_of_arrival_at   TIMESTAMPTZ,
  status              TEXT NOT NULL DEFAULT 'lead'
                        CHECK (status IN ('lead', 'booked', 'completed', 'cancelled')),
  package_name        TEXT,
  package_total_centavos BIGINT NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE vendor_services (
  relationship_id     UUID NOT NULL REFERENCES event_vendor_relationships(relationship_id) ON DELETE CASCADE,
  service_kind        TEXT NOT NULL CHECK (service_kind IN ('canonical', 'custom')),
  canonical_key       TEXT,
  custom_service_id   UUID,
  PRIMARY KEY (relationship_id, service_kind, COALESCE(canonical_key, custom_service_id::text))
);

-- Crew size extension (locked 2026-05-12)
ALTER TABLE vendor_services
  ADD COLUMN crew_size INT NOT NULL DEFAULT 1 CHECK (crew_size >= 1),
  ADD COLUMN crew_meal_required BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE event_custom_services (
  custom_service_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE event_service_coverage_status (
  event_id            UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  canonical_key       TEXT NOT NULL,
  status              TEXT NOT NULL CHECK (status IN ('not_needed')),
  PRIMARY KEY (event_id, canonical_key)
);

CREATE TABLE vendor_inclusions (
  inclusion_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id     UUID NOT NULL REFERENCES event_vendor_relationships(relationship_id) ON DELETE CASCADE,
  label               TEXT NOT NULL,
  quantity            TEXT,
  sort_order          INT NOT NULL DEFAULT 0
);

CREATE TABLE vendor_payment_milestones (
  milestone_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id     UUID NOT NULL REFERENCES event_vendor_relationships(relationship_id) ON DELETE CASCADE,
  label               TEXT NOT NULL,
  due_date            DATE,
  amount_centavos     BIGINT NOT NULL,
  paid_at             TIMESTAMPTZ,
  paid_amount_centavos BIGINT,
  payment_method      TEXT CHECK (payment_method IN
                        ('cash', 'gcash', 'bank_transfer', 'check', 'card', 'other')),
  payment_reference   TEXT,
  notes               TEXT,
  sort_order          INT NOT NULL DEFAULT 0
);

CREATE TABLE vendor_crew (
  relationship_id     UUID PRIMARY KEY REFERENCES event_vendor_relationships(relationship_id) ON DELETE CASCADE,
  crew_count          INT NOT NULL DEFAULT 0,
  vendor_provides_meals BOOLEAN NOT NULL DEFAULT FALSE,
  meal_cost_each_centavos BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE vendor_meetings (
  meeting_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id     UUID NOT NULL REFERENCES event_vendor_relationships(relationship_id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  starts_at           TIMESTAMPTZ NOT NULL,
  duration_minutes    INT,
  mode                TEXT NOT NULL CHECK (mode IN ('in_person', 'video', 'phone')),
  location            TEXT,
  agenda              TEXT,
  attendees           TEXT[],
  status              TEXT NOT NULL DEFAULT 'scheduled'
                        CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  post_notes          TEXT,
  created_by_actor    TEXT NOT NULL DEFAULT 'couple'
                        CHECK (created_by_actor IN ('couple', 'vendor', 'setnayan_staff')),
  created_by_user_id  UUID NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE vendor_contracts (
  contract_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id     UUID NOT NULL REFERENCES event_vendor_relationships(relationship_id) ON DELETE CASCADE,
  filename            TEXT NOT NULL,
  r2_object_key       TEXT NOT NULL,
  byte_size           BIGINT NOT NULL,
  mime_type           TEXT NOT NULL,
  uploaded_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  uploaded_by_user_id UUID NOT NULL
);

-- Reviews schema (locked 2026-05-12)
-- Note: `booking_id` here is intentionally not FK-constrained because the
-- canonical `vendor_bookings` table is shorthand-only in 0022 § 2.3 and lives
-- under ⚠ Pseudo→SQL below; declare the FK in a follow-up migration after
-- the canonical bookings shape is locked.
CREATE TABLE vendor_reviews (
  review_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id        UUID NOT NULL REFERENCES vendors(vendor_id),
  reviewer_user_id UUID NOT NULL REFERENCES users(user_id),
  event_id         UUID NOT NULL REFERENCES events(event_id),
  booking_id       UUID NOT NULL,
  rating_overall   INT NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
  rating_communication INT CHECK (rating_communication BETWEEN 1 AND 5),
  rating_quality       INT CHECK (rating_quality BETWEEN 1 AND 5),
  rating_value         INT CHECK (rating_value BETWEEN 1 AND 5),
  rating_punctuality   INT CHECK (rating_punctuality BETWEEN 1 AND 5),
  body_text        TEXT,
  photo_keys       TEXT[],
  vendor_response  TEXT,
  is_published     BOOLEAN NOT NULL DEFAULT FALSE,
  is_flagged       BOOLEAN NOT NULL DEFAULT FALSE,
  flagged_reason   TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at    TIMESTAMPTZ,
  edited_at        TIMESTAMPTZ
);


-- ┌─ Feature 0008 — Seating chart editor ───────────────────────────────────┐
-- Source: 0008_seating_chart_editor/0008_seating_chart_editor.md

CREATE TABLE tables (
  table_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  table_type          TEXT NOT NULL CHECK (table_type IN
                        ('round_8', 'round_10', 'round_12',
                         'long_6', 'long_8', 'long_10',
                         'family_head_12', 'family_head_14', 'family_head_16',
                         'sweetheart_2',
                         'serpentine_6', 'serpentine_12', 'serpentine_18')),
  capacity            SMALLINT NOT NULL,
  label               TEXT NOT NULL,
  position_x          REAL NOT NULL,
  position_y          REAL NOT NULL,
  rotation_deg        SMALLINT NOT NULL DEFAULT 0,
  qr_token            TEXT UNIQUE,
  qr_published_at     TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);

CREATE TABLE event_floor_plan (
  event_id            UUID PRIMARY KEY REFERENCES events(event_id) ON DELETE CASCADE,

  -- Stage
  stage_x             REAL NOT NULL DEFAULT 500,
  stage_y             REAL NOT NULL DEFAULT 95,
  stage_width         REAL NOT NULL DEFAULT 220,
  stage_height        REAL NOT NULL DEFAULT 80,
  stage_label         TEXT NOT NULL DEFAULT 'Stage',

  -- Band platform (optional, adjacent to or on stage)
  band_present        BOOLEAN NOT NULL DEFAULT FALSE,
  band_x              REAL,
  band_y              REAL,
  band_width          REAL,
  band_height         REAL,
  band_label          TEXT NOT NULL DEFAULT 'Band',

  -- Dancefloor (optional)
  dancefloor_present  BOOLEAN NOT NULL DEFAULT FALSE,
  dancefloor_x        REAL,
  dancefloor_y        REAL,
  dancefloor_width    REAL,
  dancefloor_height   REAL,

  -- Doors — at least one (main entrance) is required at publish.
  doors               JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Venue dimensions (OPTIONAL).
  venue_known         BOOLEAN NOT NULL DEFAULT FALSE,
  venue_width_m       REAL,
  venue_length_m      REAL,

  -- Editor preferences (persisted across sessions)
  alignment_lock      BOOLEAN NOT NULL DEFAULT TRUE,
  grid_snap           BOOLEAN NOT NULL DEFAULT TRUE,

  canvas_width        REAL NOT NULL DEFAULT 1000,
  canvas_height       REAL NOT NULL DEFAULT 900,

  published_at        TIMESTAMPTZ,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ┌─ Feature 0009 — Photo delivery ─────────────────────────────────────────┐
-- Source: 0009_photo_delivery/0009_photo_delivery.md
--
-- Note: 0009 also extends `photos` table — `photos` itself is defined in
-- 02_Specifications/07_V1_Developer_Specification.md (out of scope per task).
-- Below we provide a MINIMUM photos skeleton derived from the columns 0009
-- and 0012 (and 0011/0031) ALTER and reference, then apply the spec ALTERs.
-- ⚠ Schema not fully specified by 0000–0035 — see INDEX.
CREATE TABLE IF NOT EXISTS photos (
  photo_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  r2_key              TEXT NOT NULL,
  filename            TEXT,
  size_bytes          BIGINT,
  is_video            BOOLEAN NOT NULL DEFAULT FALSE,
  segment             TEXT,
  photographer_label  TEXT,
  tagged_guest_names  TEXT[],
  photo_consent       BOOLEAN NOT NULL DEFAULT TRUE,
  status              TEXT,
  taken_at            TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 0009 — Extensions to events for delivery state
ALTER TABLE events ADD COLUMN photo_delivery_provider TEXT
  CHECK (photo_delivery_provider IN ('google_drive', 'dropbox', 'onedrive', 'icloud') OR photo_delivery_provider IS NULL);
ALTER TABLE events ADD COLUMN photo_delivery_oauth_token_encrypted TEXT;
ALTER TABLE events ADD COLUMN photo_delivery_oauth_expires_at TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN photo_delivery_folder_id TEXT;
ALTER TABLE events ADD COLUMN photo_delivery_folder_name TEXT;
ALTER TABLE events ADD COLUMN photo_delivery_account_email TEXT;
ALTER TABLE events ADD COLUMN photo_delivery_status TEXT NOT NULL DEFAULT 'idle'
  CHECK (photo_delivery_status IN ('idle', 'connected', 'releasing', 'uploading', 'paused', 'complete', 'failed'));
ALTER TABLE events ADD COLUMN photo_delivery_progress_pct INT NOT NULL DEFAULT 0;
ALTER TABLE events ADD COLUMN photo_delivery_started_at TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN photo_delivery_completed_at TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN photo_delivery_failed_count INT NOT NULL DEFAULT 0;
ALTER TABLE events ADD COLUMN photos_released_at TIMESTAMPTZ;

-- 0009 — Extensions to photos for delivery tracking
ALTER TABLE photos ADD COLUMN delivered_to_drive_at TIMESTAMPTZ;
ALTER TABLE photos ADD COLUMN drive_file_id TEXT;
ALTER TABLE photos ADD COLUMN delivery_attempts INT NOT NULL DEFAULT 0;
ALTER TABLE photos ADD COLUMN delivery_last_error TEXT;

CREATE TABLE photo_delivery_jobs (
  job_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id         UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  triggered_by_user_id UUID NOT NULL REFERENCES users(user_id),
  status           TEXT NOT NULL CHECK (status IN ('queued', 'running', 'paused', 'complete', 'failed', 'cancelled')),
  total_files      INT NOT NULL,
  uploaded_files   INT NOT NULL DEFAULT 0,
  failed_files     INT NOT NULL DEFAULT 0,
  total_bytes      BIGINT NOT NULL,
  uploaded_bytes   BIGINT NOT NULL DEFAULT 0,
  current_file     TEXT,
  current_segment  TEXT,
  started_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at     TIMESTAMPTZ,
  notification_sent_at TIMESTAMPTZ
);


-- ┌─ Feature 0011 — Panood (live stream broadcaster) ───────────────────────┐
-- Source: 0011_panood/0011_panood.md
--
-- Note: 0011 references a `panood_cameras(camera_id, operator_user_id, ...)`
-- table (used by 0012_papic_migration.sql FK + RLS) but the spec does NOT
-- explicitly CREATE TABLE for it — only camera operators / addons are
-- described in prose. Listed as ⚠ Schema not fully specified in INDEX.

-- highlight_markers — broadcaster taps a marker during big moments
CREATE TABLE highlight_markers (
  marker_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID NOT NULL REFERENCES events,
  active_camera_id INT,
  broadcast_ts  INTERVAL NOT NULL,
  marked_by_user_id UUID REFERENCES users,
  note          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Same-Day Edit render record (Panood SDE flagship purchase)
-- Note: `generate_public_id()` is referenced but not defined inside 0000-0035.
-- The renderer/spec author left it to migration writers; replace with a
-- concrete sequence + format helper before deploy.
CREATE TABLE sde_renders (
    sde_render_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id          TEXT UNIQUE NOT NULL,  -- spec uses DEFAULT generate_public_id('S'); helper undefined in specs
    event_id           UUID NOT NULL REFERENCES events(event_id),
    order_id           UUID NOT NULL REFERENCES service_orders(order_id),  -- 0034 service_orders
    -- ⚠ CONFLICT: 0011 spec uses `service_orders(service_order_id)` while
    -- 0034 declares the PK column as `service_orders(order_id)`. Using 0034's
    -- canonical column name; verify your migration.
    template_id        TEXT NOT NULL,
    feel_category      TEXT NOT NULL,
    target_duration_s  INTEGER NOT NULL,
    storyboard_json    JSONB NOT NULL,
    r2_output_key      TEXT,
    render_started_at  TIMESTAMPTZ,
    render_finished_at TIMESTAMPTZ,
    render_status      TEXT NOT NULL DEFAULT 'queued',
    error_details      JSONB,
    custom_monogram_applied BOOLEAN NOT NULL DEFAULT FALSE
);

-- 0011 also seeds a `service_catalog` row; the canonical catalog table is in
-- 0034. The seed INSERT is preserved at the bottom of this file under
-- "Seeds" so the table dependency resolves first.


-- ┌─ Feature 0012 — Papic (pro-camera bridge + face detection) ─────────────┐
-- Source: 0012_papic/0012_papic.md  +  0012_papic/0012_papic_migration.sql
-- Preserved IF NOT EXISTS guards.

-- events.geolocation_enabled — couple-level toggle (default TRUE per spec)
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS geolocation_enabled BOOLEAN NOT NULL DEFAULT TRUE;

-- Photos — capture metadata + face inference state
ALTER TABLE photos
  ADD COLUMN IF NOT EXISTS captured_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS geo_lat               DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS geo_lon               DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS geo_accuracy_m        REAL,
  ADD COLUMN IF NOT EXISTS geo_unavailable       BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS device_model          TEXT,
  ADD COLUMN IF NOT EXISTS paired_camera_brand   TEXT,
  ADD COLUMN IF NOT EXISTS paired_camera_model   TEXT,
  ADD COLUMN IF NOT EXISTS auto_face_attempted   BOOLEAN NOT NULL DEFAULT FALSE;

-- Backfill captured_at for existing rows from created_at so the NOT NULL
-- constraint below can be applied without breaking the webapp slice's data.
-- (Comment-only — actual DML omitted from the consolidated schema.)
-- ⚠ Migration runner: run `UPDATE photos SET captured_at = created_at WHERE captured_at IS NULL;` before next ALTER.
ALTER TABLE photos
  ALTER COLUMN captured_at SET NOT NULL;

ALTER TABLE photos
  ADD CONSTRAINT photos_paired_camera_brand_chk
    CHECK (paired_camera_brand IS NULL
           OR paired_camera_brand IN ('canon','nikon','sony','fujifilm')),
  ADD CONSTRAINT photos_paired_camera_pair_chk
    CHECK ((paired_camera_brand IS NULL  AND paired_camera_model IS NULL)
        OR (paired_camera_brand IS NOT NULL AND paired_camera_model IS NOT NULL));

-- ⚠ CONFLICT: 0012's .md spec adds the geo / device columns as plain
-- NOT NULL on captured_at without IF NOT EXISTS and without backfill (lines
-- 517–525). The .sql migration uses IF NOT EXISTS + backfill + post-add SET
-- NOT NULL. We follow the .sql migration form (idempotent, safe to re-run).

-- photo_tags — pre-existing in the webapp slice; 0012 extends source enum
-- and adds confidence column. We declare a baseline photo_tags here so the
-- ALTER/CHECKs work even on a fresh database.
-- ⚠ Schema not fully specified by 0000–0035 — see INDEX (photo_tags baseline
-- inferred from 0012 column references).
CREATE TABLE IF NOT EXISTS photo_tags (
  tag_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id   UUID NOT NULL REFERENCES photos(photo_id) ON DELETE CASCADE,
  guest_id   UUID REFERENCES guests(guest_id) ON DELETE CASCADE,
  source     TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 0012 SQL migration — photo_tags source enum extension + confidence column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'photo_tags_source_check'
  ) THEN
    ALTER TABLE photo_tags
      ADD CONSTRAINT photo_tags_source_check
        CHECK (source IN ('individual_qr','table_qr','auto_face','manual_pick'));
  ELSE
    ALTER TABLE photo_tags DROP CONSTRAINT photo_tags_source_check;
    ALTER TABLE photo_tags
      ADD CONSTRAINT photo_tags_source_check
        CHECK (source IN ('individual_qr','table_qr','auto_face','manual_pick'));
  END IF;
END$$;

ALTER TABLE photo_tags
  ADD COLUMN IF NOT EXISTS confidence REAL;

ALTER TABLE photo_tags
  ADD CONSTRAINT photo_tags_confidence_chk
    CHECK (confidence IS NULL OR (confidence >= 0.0 AND confidence <= 1.0)),
  ADD CONSTRAINT photo_tags_auto_face_confidence_chk
    CHECK (source <> 'auto_face' OR confidence IS NOT NULL);

-- dslr_pairings — phone↔DSLR pairing records
-- ⚠ References papic_seats (not in 0000-0035 — webapp slice) and
-- panood_cameras (referenced by 0011 but not formally CREATE TABLEd).
CREATE TABLE IF NOT EXISTS dslr_pairings (
  pairing_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id                UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  papic_seat_id           UUID REFERENCES papic_seats(seat_id) ON DELETE CASCADE,  -- ⚠ papic_seats not in 0000-0035
  panood_camera_id        UUID,                          -- ⚠ FK target panood_cameras not formally declared
  brand                   TEXT NOT NULL CHECK (brand IN ('canon','nikon','sony','fujifilm')),
  model                   TEXT NOT NULL,
  serial_number           TEXT,
  capabilities_json       JSONB,
  bridge_unlock_id        UUID,                          -- ⚠ RETIRED-REF: was token_transactions FK pre-0003-retirement
  status                  TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','disconnected','retired')),
  paired_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_paired_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  disconnected_at         TIMESTAMPTZ,
  retired_at              TIMESTAMPTZ,
  CONSTRAINT dslr_pairings_one_target_chk
    CHECK ((papic_seat_id IS NOT NULL AND panood_camera_id IS NULL)
        OR (papic_seat_id IS NULL  AND panood_camera_id IS NOT NULL))
);

-- face_enrollments — per-event face vector store
CREATE TABLE IF NOT EXISTS face_enrollments (
  enrollment_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id                UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  guest_id                UUID NOT NULL REFERENCES guests(guest_id) ON DELETE CASCADE,
  source                  TEXT NOT NULL CHECK (source IN ('rsvp_profile','guest_portal','checkin_kiosk')),
  vector_blob             BYTEA NOT NULL,                 -- 128-d float32 = 512 bytes
  vector_dim              SMALLINT NOT NULL DEFAULT 128 CHECK (vector_dim = 128),
  quality_score           REAL NOT NULL CHECK (quality_score >= 0.0 AND quality_score <= 1.0),
  qa_breakdown_json       JSONB,
  captured_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at              TIMESTAMPTZ,
  revocation_reason       TEXT,
  CONSTRAINT face_enrollments_one_per_source UNIQUE (event_id, guest_id, source),
  CONSTRAINT face_enrollments_vector_size_chk
    CHECK (octet_length(vector_blob) = 512)
);

-- ⚠ CONFLICT: 0012 spec .md (lines 316-326) declares face_enrollments WITHOUT
-- vector_dim, qa_breakdown_json, revocation_reason, the size check, or the
-- 128-byte vector-size CHECK. The .sql migration form (above) is canonical.

-- face_enrollment_audit — small audit table for enrollment + revocation
CREATE TABLE IF NOT EXISTS face_enrollment_audit (
  audit_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES face_enrollments(enrollment_id) ON DELETE SET NULL,
  event_id      UUID NOT NULL,
  guest_id      UUID NOT NULL,
  action        TEXT NOT NULL CHECK (action IN ('enroll','revoke','re_enroll','retention_purge')),
  source        TEXT,
  actor_user_id UUID,
  reason        TEXT,
  occurred_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ┌─ Feature 0015 — Main website ────────────────────────────────────────────┐
-- Source: 0015_main_website/0015_main_website.md

ALTER TABLE vendors ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE events ADD COLUMN psgc_city_code TEXT;
ALTER TABLE events ADD COLUMN psgc_province_code TEXT;

CREATE TABLE vendor_registrations (
  registration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  service_category_codes TEXT[] NOT NULL,
  service_area_psgc_city_codes TEXT[] NOT NULL,
  sample_work_urls TEXT[],
  legitimacy_doc_url TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review'
    CHECK (status IN ('pending_review','approved','rejected','needs_info')),
  reviewed_by UUID REFERENCES users (user_id),
  reviewed_at TIMESTAMPTZ,
  approved_vendor_id UUID REFERENCES vendors (vendor_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ┌─ Feature 0019 — Communications (chat + video meetings) ──────────────────┐
-- Source: 0019_communications/0019_communications.md

CREATE TABLE chat_threads (
  thread_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events (event_id),
  vendor_id UUID NOT NULL REFERENCES vendors (vendor_id),
  created_by UUID NOT NULL REFERENCES users (user_id),
  topic TEXT,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chat_thread_participants (
  thread_id UUID NOT NULL REFERENCES chat_threads (thread_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users (user_id),
  role TEXT NOT NULL CHECK (role IN ('couple','vendor','coordinator')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  invited_by UUID REFERENCES users (user_id),
  last_read_message_id UUID,
  notification_pref TEXT NOT NULL DEFAULT 'all'
    CHECK (notification_pref IN ('all','mentions','none')),
  PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE chat_messages (
  message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES chat_threads (thread_id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users (user_id),
  body TEXT,
  reply_to_message_id UUID REFERENCES chat_messages (message_id),
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chat_attachments (
  attachment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES chat_messages (message_id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('image','pdf','doc','spreadsheet','voice')),
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  r2_object_key TEXT NOT NULL,
  bytes BIGINT NOT NULL,
  duration_sec INT,
  preview_r2_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chat_reactions (
  message_id UUID NOT NULL REFERENCES chat_messages (message_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users (user_id),
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (message_id, user_id, emoji)
);

CREATE TABLE video_meetings (
  meeting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES chat_threads (thread_id),
  scheduled_for TIMESTAMPTZ,
  daily_room_url TEXT NOT NULL,
  daily_room_name TEXT NOT NULL,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  recording_consent BOOLEAN NOT NULL DEFAULT FALSE,
  recording_r2_key TEXT,
  created_by UUID NOT NULL REFERENCES users (user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE video_meeting_participants (
  meeting_id UUID NOT NULL REFERENCES video_meetings (meeting_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users (user_id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  left_at TIMESTAMPTZ,
  PRIMARY KEY (meeting_id, user_id, joined_at)
);

CREATE TABLE thread_join_authorizations (
  authorization_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES chat_threads (thread_id),
  authorized_user_id UUID NOT NULL REFERENCES users (user_id),
  authorized_role TEXT NOT NULL DEFAULT 'coordinator',
  authorized_by UUID NOT NULL REFERENCES users (user_id),
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 0019 § "vendor logo + team labels" — additions to vendors + vendor_users.
-- ⚠ CONFLICT: 0022 § 2.1 already declares `logo_r2_key` as NOT NULL on the
-- vendors row at creation. 0019's ALTER below repeats the column non-idempotently.
-- We skip the duplicate vendors.logo_r2_key ALTER and keep only the
-- show_team_labels_in_chat add (already in canonical vendors). Skipping is
-- safe; the only additive column from 0019 alone is duplicated by 0022.
-- ALTER TABLE vendors
--   ADD COLUMN logo_r2_key TEXT NOT NULL,                  -- already on vendors (0022)
--   ADD COLUMN show_team_labels_in_chat BOOLEAN NOT NULL DEFAULT FALSE;  -- already on vendors (0022)

-- 0019 vendor_users.team_label — vendor_users itself is referenced but not
-- formally CREATE TABLEd in 0000-0035 (the canonical team table is
-- `vendor_team_members` per 0022, declared with shorthand). We provide a
-- minimal vendor_users shim here in case the migration runner needs it.
-- ⚠ Schema not fully specified by 0000–0035 — see INDEX.
CREATE TABLE IF NOT EXISTS vendor_users (
  vendor_user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id      UUID NOT NULL REFERENCES vendors(vendor_id),
  user_id        UUID NOT NULL REFERENCES users(user_id),
  team_label     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE vendor_users
  ADD COLUMN IF NOT EXISTS team_label TEXT;

-- 0019 § Force-majeure flag flow
CREATE TABLE force_majeure_flags (
  flag_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id       UUID NOT NULL,
  flagged_by_user_id UUID NOT NULL REFERENCES users(user_id),
  flagged_role     TEXT NOT NULL CHECK (flagged_role IN ('customer','vendor')),
  fm_type          TEXT NOT NULL,
  fm_description   TEXT,
  occurred_at      DATE NOT NULL,
  evidence_r2_keys TEXT[],
  resolution_type  TEXT CHECK (resolution_type IN ('reschedule','partial_refund','full_refund','switch_vendor','admin_mediated','rejected')),
  resolution_details JSONB,
  resolution_amount_php INT,
  agreed_by_customer_at TIMESTAMPTZ,
  agreed_by_vendor_at   TIMESTAMPTZ,
  resolved_at      TIMESTAMPTZ,
  escalated_to_admin_at TIMESTAMPTZ,
  admin_decision_user_id UUID REFERENCES users(user_id),
  admin_decision_notes   TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ┌─ Feature 0022 — Vendor dashboard ───────────────────────────────────────┐
-- Source: 0022_vendor_dashboard/0022_vendor_dashboard.md
-- The vendors row itself is already created above (under 0006 section) using
-- 0022's full column list. Below: the supporting tables for marketplace
-- vendors that 0022 declares.

-- ⚠ Pseudo→SQL: service_categories — from 0022 § 2.1a
CREATE TABLE service_categories (
  category_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                     TEXT NOT NULL,
  parent_family            TEXT,
  scope                    TEXT NOT NULL CHECK (scope IN ('canonical','private')),
  proposed_by_vendor_id    UUID REFERENCES vendors(vendor_id),
  proposed_at              TIMESTAMPTZ,
  reviewed_at              TIMESTAMPTZ,
  reviewed_by_admin_id     UUID REFERENCES users(user_id),
  description              TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ⚠ Pseudo→SQL: vendor_services (the marketplace canonical service definitions
-- from 0022 § 2.2) — NAMING CONFLICT with 0006's per-event-relationship
-- `vendor_services` table (which has the same name but different schema).
-- This is the marketplace authoring shape; renamed to vendor_marketplace_services
-- to disambiguate.
-- ⚠ CONFLICT: 0006 declares `vendor_services` keyed on (relationship_id),
--    0022 declares `vendor_services` keyed on (service_id) with full
--    columns. Renaming 0022's variant to vendor_marketplace_services so
--    both schemas can coexist.
CREATE TABLE vendor_marketplace_services (
  service_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id               UUID NOT NULL REFERENCES vendors(vendor_id),
  title                   TEXT NOT NULL,
  service_category        TEXT,
  event_types             TEXT[],
  cover_image_r2_key      TEXT,
  gallery_image_r2_keys   TEXT[],
  gallery_video_r2_keys   TEXT[],
  description_md          TEXT,
  pricing_model           TEXT CHECK (pricing_model IN ('flat','per_pax_tiers','custom_quote')),
  flat_price_php          INT,
  per_pax_tiers_json      JSONB,
  min_pax                 INT,
  max_pax                 INT,
  inclusions_md           TEXT,
  lead_time_days          INT,
  travel_area             TEXT,
  travel_fee_php          INT,
  is_published            BOOLEAN NOT NULL DEFAULT FALSE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ⚠ Pseudo→SQL: vendor_calendar_blocks (0022 § 2.3)
CREATE TABLE vendor_calendar_blocks (
  block_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id       UUID NOT NULL REFERENCES vendors(vendor_id),
  service_id      UUID REFERENCES vendor_marketplace_services(service_id),
  blocked_at      TIMESTAMPTZ NOT NULL,
  blocked_until   TIMESTAMPTZ NOT NULL,
  reason          TEXT
);

-- ⚠ Pseudo→SQL: vendor_bookings (0022 § 2.3)
CREATE TABLE vendor_bookings (
  booking_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id       UUID NOT NULL REFERENCES vendors(vendor_id),
  service_id      UUID REFERENCES vendor_marketplace_services(service_id),
  event_id        UUID REFERENCES events(event_id),
  couple_user_id  UUID REFERENCES users(user_id),
  status          TEXT NOT NULL CHECK (status IN ('inquiry','proposal_sent','accepted','active','completed','cancelled')),
  booking_date    TIMESTAMPTZ,
  package_name    TEXT,
  total_php       INT,
  paid_php        INT,
  accepted_by_user_id UUID REFERENCES users(user_id),  -- 0022 § 4c agent attribution
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ⚠ Pseudo→SQL: vendor_plans (0022 § 2.5)
CREATE TABLE vendor_plans (
  plan_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id        UUID NOT NULL REFERENCES vendors(vendor_id),
  client_user_id   UUID REFERENCES users(user_id),
  base_service_id  UUID REFERENCES vendor_marketplace_services(service_id),
  custom_json      JSONB,
  total_php        INT,
  valid_until      TIMESTAMPTZ,
  status           TEXT,
  sent_at          TIMESTAMPTZ
);

-- ⚠ Pseudo→SQL: vendor_team_members (0022 § 2.6) — base form
CREATE TABLE vendor_team_members (
  member_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id        UUID NOT NULL REFERENCES vendors(vendor_id),
  user_id          UUID NOT NULL REFERENCES users(user_id),
  -- Role + permissions extended by the ALTER below (0022 § 2.6a).
  permissions_json JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 0022 § 2.6a — team member role assignment (locked 2026-05-12)
ALTER TABLE vendor_team_members
  ADD COLUMN role TEXT NOT NULL CHECK (role IN ('owner','admin','agent','viewer')),
  ADD COLUMN scoped_service_ids UUID[],
  ADD COLUMN team_label TEXT,
  ADD COLUMN role_changed_at TIMESTAMPTZ,
  ADD COLUMN role_changed_by UUID REFERENCES users(user_id);

-- ⚠ Pseudo→SQL: vendor_service_agents (0022 § 2.6)
CREATE TABLE vendor_service_agents (
  service_id UUID NOT NULL REFERENCES vendor_marketplace_services(service_id) ON DELETE CASCADE,
  member_id  UUID NOT NULL REFERENCES vendor_team_members(member_id) ON DELETE CASCADE,
  PRIMARY KEY (service_id, member_id)
);


-- ┌─ Feature 0023 — Admin console ──────────────────────────────────────────┐
-- Source: 0023_admin_console/0023_admin_console.md

-- Internal accounts + team-member pool flags
ALTER TABLE users
  ADD COLUMN is_internal     BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN is_team_member  BOOLEAN NOT NULL DEFAULT FALSE,
  ADD CONSTRAINT users_internal_xor_team CHECK (
    NOT (is_internal = TRUE AND is_team_member = TRUE)
  );

-- § 10a — Permanent unlimited-use grants (auto-issued at owner/spouse signup)
CREATE TABLE unlimited_use_grants (
  grant_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(user_id),
  scope         TEXT NOT NULL DEFAULT 'all_services'
                CHECK (scope IN ('all_services','specific_skus')),
  scoped_skus   TEXT[],
  expiry        TIMESTAMPTZ,
  retail_value_php INT,
  rationale     TEXT NOT NULL,
  granted_by    UUID NOT NULL REFERENCES users(user_id),
  approved_by   UUID REFERENCES users(user_id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at    TIMESTAMPTZ
);

-- § 10b — Singleton table — one row per calendar month covering the whole team
CREATE TABLE team_shared_monthly_allowance (
  period_month   TEXT PRIMARY KEY,
  allocated_php  INT NOT NULL,
  consumed_php   INT NOT NULL DEFAULT 0,
  remaining_php  INT GENERATED ALWAYS AS (allocated_php - consumed_php) STORED,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at      TIMESTAMPTZ
);

-- § 10b — Per-spend ledger for team pool draws
CREATE TABLE team_allowance_consumptions (
  consumption_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_month    TEXT NOT NULL REFERENCES team_shared_monthly_allowance(period_month),
  user_id         UUID NOT NULL REFERENCES users(user_id),
  order_id        UUID NOT NULL,    -- references service_orders(order_id) — declared in 0034
  amount_php      INT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- § 4.5 — Two-admin approval requests (must precede payment_receiving_accounts FK)
CREATE TABLE admin_approval_requests (
    request_id          UUID PRIMARY KEY,
    initiated_by        UUID NOT NULL REFERENCES users(user_id),
    action_type         TEXT NOT NULL,
    payload_json        JSONB NOT NULL,
    rationale           TEXT NOT NULL,
    status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','approved','rejected','expired')),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    approver_id         UUID REFERENCES users(user_id),
    decided_at          TIMESTAMPTZ,
    decision_reason     TEXT,
    CHECK (approver_id IS NULL OR approver_id != initiated_by)
);

-- § 3.5c — BDO + GCash receiving account uploads
CREATE TABLE payment_receiving_accounts (
    account_id        UUID PRIMARY KEY,
    method            TEXT NOT NULL CHECK (method IN ('bdo_bank','gcash','maya','unionbank')),
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    account_name      TEXT NOT NULL,
    account_number    TEXT NOT NULL,
    qr_code_r2_key    TEXT NOT NULL,
    notes             TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by_admin  UUID NOT NULL REFERENCES users(user_id),
    approved_by_admin UUID NOT NULL REFERENCES users(user_id),
    two_admin_approval_id UUID NOT NULL REFERENCES admin_approval_requests(request_id),
    archived_at       TIMESTAMPTZ,
    CHECK (created_by_admin != approved_by_admin)
);

-- § 3.8 — Funnel analytics events
CREATE TABLE funnel_events (
  event_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(user_id),
  session_id      TEXT NOT NULL,
  funnel_key      TEXT NOT NULL,
  step_key        TEXT NOT NULL,
  step_index      INT NOT NULL,
  metadata        JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ┌─ Feature 0025 — Profile settings ───────────────────────────────────────┐
-- Source: 0025_profile_settings/0025_profile_settings.md

-- Asynchronous data-export job tracking (RA 10173 § 18)
CREATE TABLE data_export_requests (
  request_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id),
  requested_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','generating','ready','expired','downloaded','failed')),
  r2_export_key   TEXT,
  ready_at        TIMESTAMPTZ,
  downloaded_at   TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  failure_reason  TEXT
);

-- Per-user per-category notification preferences
CREATE TABLE notification_preferences (
  user_id           UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  category          TEXT NOT NULL
                    CHECK (category IN ('payments','vendors','events','account','marketing','internal_accounts')),
  in_app_enabled    BOOLEAN NOT NULL DEFAULT TRUE,
  email_enabled     BOOLEAN NOT NULL DEFAULT TRUE,
  quiet_hours_start TIME,
  quiet_hours_end   TIME,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, category)
);

-- Forward-reserved (V1.5): saved payment methods
CREATE TABLE customer_payment_methods (
  method_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  method_type     TEXT NOT NULL CHECK (method_type IN ('card','gcash','maya','bdo_account')),
  brand           TEXT,
  last4           TEXT,
  masked_account  TEXT,
  is_default      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

-- Soft + hard delete tracking (RA 10173 § 16(e))
ALTER TABLE users ADD COLUMN deleted_at             TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN hard_deleted_at        TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN deletion_reason        TEXT;
ALTER TABLE users ADD COLUMN deletion_initiated_by  UUID REFERENCES users(user_id);

-- Appearance preferences
ALTER TABLE users ADD COLUMN theme_preference  TEXT DEFAULT 'setnayan_default'
  CHECK (theme_preference IN ('setnayan_default','victorian','classy','ios'));
ALTER TABLE users ADD COLUMN locale_preference TEXT DEFAULT 'en'
  CHECK (locale_preference IN ('en','tl','ceb'));
ALTER TABLE users ADD COLUMN density_preference TEXT DEFAULT 'comfortable'
  CHECK (density_preference IN ('compact','comfortable'));

-- Marketing consent (Privacy Policy § 6.2)
ALTER TABLE users ADD COLUMN marketing_consent_event_features  BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN marketing_consent_product_updates BOOLEAN NOT NULL DEFAULT FALSE;


-- ┌─ Feature 0026 — BIR tax compliance ─────────────────────────────────────┐
-- Source: 0026_bir_tax_compliance/0026_bir_tax_compliance.md
-- The 0026 spec has both an inline schema block (§ 4.1, § 4.4, § 4.6, § 5.2,
-- § 5.4, § 7.2) and a summary block (§ 9). Both are identical — preserving
-- only one copy here.

-- § 4.1 Official receipts
CREATE TABLE official_receipts (
  receipt_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number          TEXT UNIQUE NOT NULL,
  service_order_id        UUID NOT NULL REFERENCES service_orders(order_id),
  customer_user_id        UUID NOT NULL REFERENCES users(user_id),
  customer_tin            TEXT,
  customer_business_name  TEXT,
  customer_address        TEXT,
  issued_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  line_items_json         JSONB NOT NULL,
  gross_php               NUMERIC(12,2) NOT NULL,
  vat_php                 NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_php                 NUMERIC(12,2) NOT NULL,
  payment_method          TEXT NOT NULL,
  payment_reference       TEXT NOT NULL,
  pdf_r2_key              TEXT NOT NULL,
  is_void                 BOOLEAN NOT NULL DEFAULT FALSE,
  voided_at               TIMESTAMPTZ,
  voided_by_admin         UUID REFERENCES users(user_id),
  void_reason             TEXT,
  bir_permit_number       TEXT NOT NULL,
  bir_tax_type_at_issue   TEXT NOT NULL,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- § 4.2 OR sequence allocator
CREATE TABLE or_sequence_state (
  year                INT PRIMARY KEY,
  next_sequence       INT NOT NULL DEFAULT 1,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- § 4.4 Setnayan tax configuration (versioned over time)
CREATE TABLE setnayan_tax_config (
  config_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  effective_from      DATE NOT NULL,
  effective_to        DATE,
  business_name       TEXT NOT NULL,
  business_address    TEXT NOT NULL,
  tin                 TEXT NOT NULL,
  bir_permit_number   TEXT NOT NULL,
  rdo_code            TEXT NOT NULL,
  tax_type            TEXT NOT NULL CHECK (tax_type IN ('percentage_tax','vat')),
  percentage_tax_rate NUMERIC(5,2),
  vat_rate            NUMERIC(5,2) DEFAULT 12.00,
  is_top_withholding_agent BOOLEAN NOT NULL DEFAULT FALSE,
  ewt_default_rate_individual_pct NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  ewt_default_rate_corporate_pct NUMERIC(5,2) NOT NULL DEFAULT 2.00,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- § 4.6 Voided-then-replaced OR linkage
CREATE TABLE or_replacements (
  replacement_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voided_receipt_id    UUID NOT NULL REFERENCES official_receipts(receipt_id),
  replacement_receipt_id UUID NOT NULL REFERENCES official_receipts(receipt_id),
  reason               TEXT NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- § 5.2 — Vendor tax fields
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS tin TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS vendor_tax_type TEXT
  CHECK (vendor_tax_type IN ('individual_low', 'individual_high', 'corporate', 'twa_individual', 'twa_corporate'));
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS ewt_rate_pct NUMERIC(5,2);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS registered_business_name TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS registered_business_address TEXT;

-- § 5.2 — Vendor payouts
CREATE TABLE vendor_payouts (
  payout_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id              UUID NOT NULL REFERENCES vendors(vendor_id),
  service_order_id       UUID REFERENCES service_orders(order_id),
  vendor_invoice_amount  NUMERIC(12,2) NOT NULL,
  ewt_rate_pct           NUMERIC(5,2) NOT NULL,
  ewt_php                NUMERIC(12,2) NOT NULL,
  setnayan_fee_php       NUMERIC(12,2) NOT NULL,
  payout_net_php         NUMERIC(12,2) NOT NULL,
  payout_status          TEXT NOT NULL DEFAULT 'pending'
                         CHECK (payout_status IN ('pending','scheduled','sent','failed','clawed_back')),
  payout_method          TEXT NOT NULL,
  payout_reference       TEXT,
  scheduled_for          DATE,
  sent_at                TIMESTAMPTZ,
  failed_reason          TEXT,
  form_2307_quarter      TEXT,
  form_2307_pdf_r2_key   TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- § 5.4 — Quarterly Form 2307 issuance log
CREATE TABLE form_2307_issuances (
  issuance_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id            UUID NOT NULL REFERENCES vendors(vendor_id),
  quarter              TEXT NOT NULL,
  total_gross_php      NUMERIC(12,2) NOT NULL,
  total_ewt_php        NUMERIC(12,2) NOT NULL,
  payout_ids           UUID[] NOT NULL,
  pdf_r2_key           TEXT NOT NULL,
  issued_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  emailed_to_vendor    BOOLEAN NOT NULL DEFAULT FALSE,
  emailed_at           TIMESTAMPTZ,
  UNIQUE (vendor_id, quarter)
);

-- § 7.2 — Customer tax-doc fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS tin_optional TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_business_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_address TEXT;


-- ┌─ Feature 0028 — Email notifications ────────────────────────────────────┐
-- Source: 0028_email_notifications/0028_email_notifications.md

CREATE TABLE email_dispatches (
  dispatch_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES users(user_id),
  category             TEXT NOT NULL CHECK (category IN ('payments','vendors','events','account','marketing')),
  template_key         TEXT NOT NULL,
  template_data        JSONB NOT NULL,
  subject              TEXT NOT NULL,
  to_email             TEXT NOT NULL,
  scheduled_for        TIMESTAMPTZ,
  sent_at              TIMESTAMPTZ,
  delivered_at         TIMESTAMPTZ,
  opened_at            TIMESTAMPTZ,
  clicked_at           TIMESTAMPTZ,
  bounced_at           TIMESTAMPTZ,
  bounce_reason        TEXT,
  unsubscribe_at       TIMESTAMPTZ,
  provider             TEXT NOT NULL DEFAULT 'resend' CHECK (provider IN ('resend','sendgrid')),
  provider_message_id  TEXT,
  status               TEXT NOT NULL DEFAULT 'queued'
                         CHECK (status IN ('queued','sent','delivered','bounced','complained','failed','suppressed')),
  suppression_reason   TEXT,
  retry_count          INT NOT NULL DEFAULT 0,
  next_retry_at        TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE email_suppressions (
  email_address  TEXT PRIMARY KEY,
  reason         TEXT NOT NULL CHECK (reason IN ('hard_bounce','spam_complaint','unsubscribe','admin_block')),
  category       TEXT CHECK (category IN ('payments','vendors','events','account','marketing')),
  suppressed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  override_at    TIMESTAMPTZ,
  override_by    UUID REFERENCES users(user_id),
  notes          TEXT
);

CREATE TABLE email_unsubscribe_tokens (
  token        TEXT PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(user_id),
  category     TEXT NOT NULL CHECK (category IN ('payments','vendors','events','account','marketing')),
  dispatch_id  UUID REFERENCES email_dispatches(dispatch_id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  consumed_at  TIMESTAMPTZ
);


-- ┌─ Feature 0029 — Help center ────────────────────────────────────────────┐
-- Source: 0029_help_center/0029_help_center.md

CREATE TABLE help_articles (
  article_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT UNIQUE NOT NULL,
  role              TEXT NOT NULL CHECK (role IN ('customer','vendor','guest','admin','multi_role')),
  section           TEXT NOT NULL,
  title             TEXT NOT NULL,
  tldr              TEXT NOT NULL,
  body_md           TEXT NOT NULL,
  tags              TEXT[],
  related_article_ids UUID[],
  is_published      BOOLEAN NOT NULL DEFAULT FALSE,
  view_count        INT NOT NULL DEFAULT 0,
  helpful_count     INT NOT NULL DEFAULT 0,
  unhelpful_count   INT NOT NULL DEFAULT 0,
  last_reviewed_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE article_feedback (
  feedback_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id     UUID NOT NULL REFERENCES help_articles(article_id),
  user_id        UUID REFERENCES users(user_id),
  helpful        BOOLEAN NOT NULL,
  comment        TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE help_search_synonyms (
  term     TEXT PRIMARY KEY,
  alias    TEXT NOT NULL
);

CREATE TABLE support_tickets (
  ticket_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number       SERIAL UNIQUE NOT NULL,
  user_id             UUID NOT NULL REFERENCES users(user_id),
  role                TEXT NOT NULL,
  category            TEXT NOT NULL,
  subcategory         TEXT,
  subject             TEXT NOT NULL,
  description         TEXT NOT NULL,
  attachment_keys     TEXT[],
  status              TEXT NOT NULL DEFAULT 'open'
                      CHECK (status IN ('open','in_progress','waiting_user','resolved','closed','overdue')),
  assigned_admin_role TEXT NOT NULL,
  assigned_admin_id   UUID REFERENCES users(user_id),
  sla_due_at          TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  resolved_at         TIMESTAMPTZ,
  closed_at           TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ticket_messages (
  message_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id       UUID NOT NULL REFERENCES support_tickets(ticket_id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES users(user_id),
  sender_role     TEXT NOT NULL CHECK (sender_role IN ('user','admin')),
  body_md         TEXT NOT NULL,
  attachment_keys TEXT[],
  internal_note   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE support_canned_responses (
  canned_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  category     TEXT NOT NULL,
  body_md      TEXT NOT NULL,
  created_by   UUID NOT NULL REFERENCES users(user_id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE support_routing_config (
  config_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rules_json  JSONB NOT NULL,
  updated_by  UUID NOT NULL REFERENCES users(user_id),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ┌─ Feature 0030 — Guided tour ────────────────────────────────────────────┐
-- Source: 0030_guided_tour/0030_guided_tour.md

CREATE TABLE tour_completions (
  user_id          UUID NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  tour_key         TEXT NOT NULL,
  completed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  skipped_at_step  INT,
  total_steps      INT NOT NULL,
  dont_show_again  BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (user_id, tour_key)
);

CREATE TABLE tour_step_views (
  view_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  tour_key     TEXT NOT NULL,
  step_number  INT NOT NULL,
  viewed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  action       TEXT NOT NULL CHECK (action IN ('next','back','skip','complete'))
);


-- ┌─ Feature 0031 — Day-of guest ───────────────────────────────────────────┐
-- Source: 0031_day_of_guest/0031_day_of_guest.md
--
-- Note: 0031 ALTERs `event_schedule_segments` — that table is referenced by
-- multiple specs but never formally CREATE TABLEd in 0000-0035. Listed as
-- ⚠ Schema not fully specified in INDEX. A minimum skeleton is provided here
-- so the ALTER below resolves.
CREATE TABLE IF NOT EXISTS event_schedule_segments (
  segment_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  starts_at    TIMESTAMPTZ,
  ends_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE event_broadcasts (
  broadcast_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id         UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  sent_by_user_id  UUID NOT NULL REFERENCES users(user_id),
  message_text     TEXT NOT NULL CHECK (char_length(message_text) <= 280),
  scheduled_for    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at       TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '2 hours'),
  audience         TEXT NOT NULL DEFAULT 'all'
                   CHECK (audience IN ('all','table','principal_sponsors','entourage','custom')),
  audience_targets JSONB,
  delivered_count  INT NOT NULL DEFAULT 0,
  ack_count        INT NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE broadcast_acknowledgments (
  broadcast_id  UUID NOT NULL REFERENCES event_broadcasts(broadcast_id) ON DELETE CASCADE,
  guest_id      UUID REFERENCES guests(guest_id),
  user_id       UUID REFERENCES users(user_id),
  acknowledged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (broadcast_id, COALESCE(guest_id, user_id))
);

CREATE TABLE video_guestbook_entries (
  entry_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id          UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  guest_id          UUID REFERENCES guests(guest_id),
  user_id           UUID REFERENCES users(user_id),
  prompt_text       TEXT,
  video_r2_key      TEXT NOT NULL,
  duration_sec      INT NOT NULL CHECK (duration_sec BETWEEN 1 AND 60),
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','approved','rejected','user_deleted')),
  submitted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_by_couple_at TIMESTAMPTZ,
  reviewed_by_user_id   UUID REFERENCES users(user_id),
  user_deleted_at   TIMESTAMPTZ,
  r2_purged_at      TIMESTAMPTZ
);

CREATE TABLE guest_photo_hides (
  guest_id   UUID NOT NULL REFERENCES guests(guest_id) ON DELETE CASCADE,
  photo_id   UUID NOT NULL REFERENCES photos(photo_id) ON DELETE CASCADE,
  hidden_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (guest_id, photo_id)
);

-- 0031 — Mode override + couple live-location + photo wall visibility
ALTER TABLE events
  ADD COLUMN live_mode_override TEXT
    CHECK (live_mode_override IN ('coming_soon','pre_event','live','recap','archive')),
  ADD COLUMN live_location_shared     BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN couple_live_lat          NUMERIC(9,6),
  ADD COLUMN couple_live_lon          NUMERIC(9,6),
  ADD COLUMN couple_live_updated_at   TIMESTAMPTZ,
  ADD COLUMN live_photo_wall_visibility TEXT NOT NULL DEFAULT 'tagged_only'
    CHECK (live_photo_wall_visibility IN ('tagged_only','all_with_consent','off')),
  ADD COLUMN venue_wifi_hint          TEXT,
  ADD COLUMN rehearsal_mode_until     TIMESTAMPTZ;

-- 0031 — Segment lifecycle tracking
ALTER TABLE event_schedule_segments
  ADD COLUMN status              TEXT NOT NULL DEFAULT 'upcoming'
    CHECK (status IN ('upcoming','active','completed','cancelled')),
  ADD COLUMN actual_started_at   TIMESTAMPTZ,
  ADD COLUMN actual_ended_at     TIMESTAMPTZ,
  ADD COLUMN cancellation_reason TEXT;

-- 0031 — Default video-guestbook prompts
CREATE TABLE event_guestbook_prompts (
  prompt_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  prompt_text TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ┌─ Feature 0032 — Contract intelligence ──────────────────────────────────┐
-- Source: 0032_contract_intelligence/0032_contract_intelligence.md

CREATE TABLE contract_drafts (
  contract_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id            UUID NOT NULL REFERENCES vendors(vendor_id),
  customer_user_id     UUID NOT NULL REFERENCES users(user_id),
  booking_id           UUID,
  thread_id            UUID REFERENCES chat_threads(thread_id),
  title                TEXT NOT NULL,
  source_pdf_r2_key    TEXT,
  entry_path           TEXT NOT NULL CHECK (entry_path IN ('upload','template','duplicate')),
  source_contract_id   UUID REFERENCES contract_drafts(contract_id),
  status               TEXT NOT NULL DEFAULT 'draft'
                       CHECK (status IN ('draft','sent','customer_signed','both_signed','rejected','expired','cancelled')),
  detected_elements    JSONB,
  contract_body        JSONB NOT NULL DEFAULT '{}'::jsonb,
  compliance_score     INT,
  compliance_badge     TEXT CHECK (compliance_badge IN ('not_compliant','compliant_minimum','compliant_recommended')),
  generated_pdf_r2_key TEXT,
  signed_pdf_r2_key    TEXT,
  signed_pdf_sha256    TEXT,
  rejection_reason     TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at              TIMESTAMPTZ,
  customer_signed_at   TIMESTAMPTZ,
  vendor_signed_at     TIMESTAMPTZ,
  expires_at           TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE TABLE contract_signatures (
  signature_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id            UUID NOT NULL REFERENCES contract_drafts(contract_id) ON DELETE CASCADE,
  signer_user_id         UUID NOT NULL REFERENCES users(user_id),
  signer_role            TEXT NOT NULL CHECK (signer_role IN ('vendor','customer')),
  signature_method       TEXT NOT NULL CHECK (signature_method IN ('signature_pad','typed','drawn')),
  signature_image_r2_key TEXT NOT NULL,
  signer_full_name       TEXT NOT NULL,
  ip_address             INET NOT NULL,
  user_agent             TEXT NOT NULL,
  geo_lat                NUMERIC,
  geo_lon                NUMERIC,
  geo_consented          BOOLEAN NOT NULL DEFAULT FALSE,
  signed_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (contract_id, signer_role)
);

CREATE TABLE contract_clause_library (
  clause_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  element_type          TEXT NOT NULL,
  title                 TEXT NOT NULL,
  plain_english         TEXT NOT NULL,
  legal_text_en         TEXT NOT NULL,
  legal_text_tl         TEXT,
  applicable_categories TEXT[] NOT NULL DEFAULT ARRAY['*'],
  clause_version        INT NOT NULL DEFAULT 1,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_by_legal_at  TIMESTAMPTZ,
  reviewed_by_legal_id  TEXT,
  retired_at            TIMESTAMPTZ
);

CREATE TABLE contract_purchases (
  purchase_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id           UUID NOT NULL REFERENCES contract_drafts(contract_id) ON DELETE CASCADE,
  vendor_id             UUID NOT NULL REFERENCES vendors(vendor_id),
  sku                   TEXT NOT NULL CHECK (sku IN ('contract_builder_single','pro_inclusion')),
  amount_php            INT NOT NULL,
  service_order_id      UUID REFERENCES service_orders(order_id),
  pro_subscription_id   UUID,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (contract_id)
);


-- ┌─ Feature 0033 — Public API foundation ──────────────────────────────────┐
-- Source: 0033_public_api_foundation/0033_public_api_foundation.md

CREATE TABLE oauth_applications (
  app_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id       UUID NOT NULL REFERENCES users(user_id),
  name                TEXT NOT NULL,
  description         TEXT,
  logo_r2_key         TEXT,
  redirect_uris       TEXT[] NOT NULL,
  client_id           TEXT UNIQUE NOT NULL,
  client_secret_hash  TEXT NOT NULL,
  client_secret_last4 TEXT NOT NULL,
  scopes_requested    TEXT[] NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending_review'
                      CHECK (status IN ('pending_review','approved','rejected','suspended')),
  tier                TEXT NOT NULL DEFAULT 'free'
                      CHECK (tier IN ('free','pro','enterprise')),
  is_first_party      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at         TIMESTAMPTZ,
  approved_by         UUID REFERENCES users(user_id),
  suspended_at        TIMESTAMPTZ,
  suspended_reason    TEXT
);

CREATE TABLE oauth_authorizations (
  authorization_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id           UUID NOT NULL REFERENCES oauth_applications(app_id),
  user_id          UUID NOT NULL REFERENCES users(user_id),
  scopes_granted   TEXT[] NOT NULL,
  authorized_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at       TIMESTAMPTZ,
  UNIQUE(app_id, user_id, authorized_at)
);

CREATE TABLE api_tokens (
  token_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  authorization_id UUID NOT NULL REFERENCES oauth_authorizations(authorization_id),
  token_hash       TEXT UNIQUE NOT NULL,
  token_last4      TEXT NOT NULL,
  type             TEXT NOT NULL CHECK (type IN ('access','refresh')),
  scopes           TEXT[] NOT NULL,
  expires_at       TIMESTAMPTZ NOT NULL,
  revoked_at       TIMESTAMPTZ,
  last_used_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE api_request_log (
  request_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id         UUID REFERENCES oauth_applications(app_id),
  user_id        UUID REFERENCES users(user_id),
  token_id       UUID REFERENCES api_tokens(token_id),
  method         TEXT NOT NULL,
  path           TEXT NOT NULL,
  status_code    INT NOT NULL,
  duration_ms    INT NOT NULL,
  ip_address     INET,
  user_agent     TEXT,
  rate_limit_hit BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE webhook_subscriptions (
  subscription_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id           UUID NOT NULL REFERENCES oauth_applications(app_id),
  event_type       TEXT NOT NULL,
  delivery_url     TEXT NOT NULL,
  hmac_secret_hash TEXT NOT NULL,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  strike_count     INT NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE webhook_deliveries (
  delivery_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id    UUID NOT NULL REFERENCES webhook_subscriptions(subscription_id),
  event_payload      JSONB NOT NULL,
  attempt_count      INT NOT NULL DEFAULT 0,
  next_attempt_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at       TIMESTAMPTZ,
  last_response_code INT,
  last_response_body TEXT,
  status             TEXT NOT NULL DEFAULT 'queued'
                     CHECK (status IN ('queued','delivered','failed','expired')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ┌─ Feature 0034 — Payments & cart ────────────────────────────────────────┐
-- Source: 0034_payments_and_cart/0034_payments_and_cart.md
--
-- Note: comp_grants needs to exist before service_orders references it. We
-- declare comp_grants first, even though 0034 lists it as table 8.

-- 0034.8 — comp_grants
CREATE TABLE comp_grants (
  grant_id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES users(user_id),
  scope                   TEXT NOT NULL DEFAULT 'all_services'
                          CHECK (scope IN ('all_services','specific_skus','single_order')),
  scoped_skus             TEXT[],
  expiry                  TIMESTAMPTZ,
  retail_value_centavos   INT,
  rationale               TEXT NOT NULL,
  granted_by              UUID NOT NULL REFERENCES users(user_id),
  approved_by             UUID REFERENCES users(user_id),
  two_admin_approval_id   UUID,
  source                  TEXT NOT NULL CHECK (source IN ('owner_internal','team_pool','external_promo','dispute_remedy')),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at              TIMESTAMPTZ
);

-- 0034.1 — service_catalog
CREATE TABLE service_catalog (
  sku_code            TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  description         TEXT NOT NULL,
  category            TEXT NOT NULL,
  price_php_centavos  INT NOT NULL,
  is_multi_purchase   BOOLEAN NOT NULL DEFAULT FALSE,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  effective_from      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_until     TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT price_positive CHECK (price_php_centavos >= 0)
);

-- 0034.2 — service_catalog_price_history (audit trail)
CREATE TABLE service_catalog_price_history (
  history_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_code              TEXT NOT NULL REFERENCES service_catalog(sku_code),
  prior_price_centavos  INT NOT NULL,
  new_price_centavos    INT NOT NULL,
  changed_by_admin      UUID NOT NULL REFERENCES users(user_id),
  changed_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_from        TIMESTAMPTZ NOT NULL,
  two_admin_approval_id UUID,
  rationale             TEXT NOT NULL
);

-- 0034.3 — carts
CREATE TABLE carts (
  cart_id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES users(user_id),
  event_id                UUID REFERENCES events(event_id),
  status                  TEXT NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active','checking_out','converted_to_order','abandoned')),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  converted_to_order_id   UUID
);

-- 0034.4 — cart_items
CREATE TABLE cart_items (
  cart_item_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id                 UUID NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
  sku_code                TEXT NOT NULL REFERENCES service_catalog(sku_code),
  quantity                INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_centavos     INT NOT NULL,
  metadata                JSONB,
  added_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 0034.5 — service_orders
CREATE TABLE service_orders (
  order_id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code          TEXT UNIQUE NOT NULL,
  user_id                 UUID NOT NULL REFERENCES users(user_id),
  event_id                UUID REFERENCES events(event_id),
  cart_id                 UUID NOT NULL REFERENCES carts(cart_id),
  subtotal_centavos       INT NOT NULL,
  fees_centavos           INT NOT NULL DEFAULT 0,
  total_centavos          INT NOT NULL,
  payment_method          TEXT NOT NULL CHECK (payment_method IN ('bdo_bank','gcash','setnayan_pay','comp_grant')),
  status                  TEXT NOT NULL DEFAULT 'pending_payment'
                          CHECK (status IN (
                            'pending_payment',
                            'proof_submitted',
                            'verification_in_progress',
                            'paid',
                            'rejected',
                            'cancelled',
                            'refunded',
                            'expired'
                          )),
  comp_grant_id           UUID REFERENCES comp_grants(grant_id),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  checked_out_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at                 TIMESTAMPTZ,
  rejected_at             TIMESTAMPTZ,
  expires_at              TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  CONSTRAINT order_total_consistent CHECK (total_centavos = subtotal_centavos + fees_centavos)
);

-- 0034.6 — service_order_items
CREATE TABLE service_order_items (
  order_item_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                UUID NOT NULL REFERENCES service_orders(order_id) ON DELETE CASCADE,
  sku_code                TEXT NOT NULL REFERENCES service_catalog(sku_code),
  quantity                INT NOT NULL,
  unit_price_centavos     INT NOT NULL,
  metadata                JSONB
);

-- 0034.7 — service_order_payments
CREATE TABLE service_order_payments (
  payment_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                UUID NOT NULL REFERENCES service_orders(order_id),
  method                  TEXT NOT NULL CHECK (method IN ('bdo_bank','gcash')),
  amount_centavos         INT NOT NULL,
  reference_code          TEXT,
  proof_screenshot_r2_key TEXT NOT NULL,
  submitter_notes         TEXT,
  submitted_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_by_admin       UUID REFERENCES users(user_id),
  reviewed_at             TIMESTAMPTZ,
  decision                TEXT CHECK (decision IN ('approved','rejected','needs_more_proof')),
  decision_reason         TEXT,
  resubmission_count      INT NOT NULL DEFAULT 0
);

-- 0034.9 — payment_inbox_messages (raw inbox arrivals from BDO/GCash)
CREATE TABLE payment_inbox_messages (
  message_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source                  TEXT NOT NULL CHECK (source IN ('bdo_sms','bdo_email','gcash_api','gcash_csv','manual')),
  source_message_id       TEXT,
  received_at             TIMESTAMPTZ NOT NULL,
  raw_body                TEXT NOT NULL,
  parsed_amount_centavos  INT,
  parsed_reference_code   TEXT,
  parsed_sender_name      TEXT,
  parsed_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  matched_order_id        UUID REFERENCES service_orders(order_id),
  matched_payment_id      UUID REFERENCES service_order_payments(payment_id),
  match_confidence        TEXT CHECK (match_confidence IN ('exact','high','medium','low','none')),
  match_method            TEXT CHECK (match_method IN ('reference_code','amount_plus_sender','admin_manual','unmatched')),
  reviewed_by_admin       UUID REFERENCES users(user_id),
  reviewed_at             TIMESTAMPTZ
);


-- ─── Indexes (non-PK, non-unique) ──────────────────────────────────────────

-- 0000
CREATE INDEX idx_users_account_type ON users(account_type);
CREATE INDEX IF NOT EXISTS idx_users_account_type ON users(account_type);
-- ⚠ Note: the above two are identical (one with IF NOT EXISTS), preserved as
-- in the source spec. The second is a no-op when the first ran.

-- 0001
CREATE INDEX idx_guests_event ON guests(event_id);
CREATE INDEX idx_guests_event_rsvp ON guests(event_id, rsvp_status);
CREATE INDEX idx_guests_household ON guests(household_id);
CREATE INDEX idx_guests_qr_token ON guests(qr_token);

-- 0002
CREATE INDEX idx_scan_events_guest ON scan_events(guest_id, scanned_at DESC);
CREATE INDEX idx_scan_events_event ON scan_events(event_id, source, scanned_at DESC);
CREATE INDEX idx_slug_change_old ON slug_change_log(LOWER(old_slug)) WHERE redirect_until > NOW();

-- 0004
CREATE INDEX idx_invitation_widgets_event_pos ON invitation_widgets(event_id, position);

-- 0005
CREATE INDEX idx_led_bg_configs_event ON led_background_configs(event_id);

-- 0006
CREATE INDEX event_vendor_relationships_event_idx ON event_vendor_relationships (event_id);
CREATE INDEX event_vendor_relationships_marketplace_idx ON event_vendor_relationships (marketplace_vendor_id);
CREATE INDEX vendor_payment_milestones_due_idx ON vendor_payment_milestones (due_date)
  WHERE paid_at IS NULL;
CREATE INDEX vendor_meetings_vendor_starts_idx
  ON vendor_meetings (relationship_id, starts_at)
  WHERE status = 'scheduled';
CREATE UNIQUE INDEX vendor_reviews_one_per_booking ON vendor_reviews(booking_id);
CREATE INDEX idx_vendor_reviews_vendor ON vendor_reviews(vendor_id, published_at DESC) WHERE is_published = TRUE;

-- 0008
CREATE INDEX idx_tables_event ON tables(event_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_tables_qr_token ON tables(qr_token) WHERE qr_token IS NOT NULL;

-- 0009
CREATE INDEX idx_photo_delivery_jobs_event ON photo_delivery_jobs(event_id, started_at DESC);

-- 0012 (papic migration)
CREATE INDEX IF NOT EXISTS photos_event_captured_at_idx
  ON photos (event_id, captured_at DESC);
CREATE INDEX IF NOT EXISTS photos_event_paired_brand_idx
  ON photos (event_id, paired_camera_brand)
  WHERE paired_camera_brand IS NOT NULL;
CREATE INDEX IF NOT EXISTS photo_tags_event_source_idx
  ON photo_tags (photo_id, source);
CREATE INDEX IF NOT EXISTS photo_tags_guest_event_idx
  ON photo_tags (guest_id);
CREATE INDEX IF NOT EXISTS dslr_pairings_event_status_idx
  ON dslr_pairings (event_id, status);
CREATE INDEX IF NOT EXISTS dslr_pairings_seat_idx
  ON dslr_pairings (papic_seat_id)
  WHERE papic_seat_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS dslr_pairings_ls_camera_idx
  ON dslr_pairings (panood_camera_id)
  WHERE panood_camera_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS face_enrollments_event_active_idx
  ON face_enrollments (event_id, guest_id)
  WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS face_enrollments_event_quality_idx
  ON face_enrollments (event_id, quality_score DESC)
  WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS face_enrollment_audit_event_idx
  ON face_enrollment_audit (event_id, occurred_at DESC);

-- 0015
CREATE INDEX events_city_code_idx ON events (psgc_city_code) WHERE archived = FALSE;
CREATE INDEX vendor_registrations_status_idx ON vendor_registrations (status, created_at);

-- 0019
CREATE INDEX chat_messages_thread_idx ON chat_messages (thread_id, created_at DESC);
CREATE INDEX chat_thread_participants_user_idx ON chat_thread_participants (user_id);
CREATE INDEX video_meetings_thread_idx ON video_meetings (thread_id, scheduled_for);

-- 0023
CREATE INDEX idx_users_is_internal     ON users(is_internal)    WHERE is_internal = TRUE;
CREATE INDEX idx_users_is_team_member  ON users(is_team_member) WHERE is_team_member = TRUE;
CREATE INDEX idx_unlimited_grants_user ON unlimited_use_grants(user_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_team_consumptions_period ON team_allowance_consumptions(period_month, created_at DESC);
CREATE INDEX idx_team_consumptions_user   ON team_allowance_consumptions(user_id, period_month);
CREATE INDEX idx_funnel_events_user_funnel ON funnel_events(user_id, funnel_key, created_at);
CREATE INDEX idx_funnel_events_funnel_step ON funnel_events(funnel_key, step_key, created_at);
CREATE INDEX idx_approval_requests_pending ON admin_approval_requests(status) WHERE status = 'pending';
CREATE INDEX idx_approval_requests_expires ON admin_approval_requests(expires_at) WHERE status = 'pending';

-- 0025
CREATE INDEX idx_data_export_user_status ON data_export_requests (user_id, status);
CREATE INDEX idx_data_export_expires ON data_export_requests (expires_at) WHERE status = 'ready';
CREATE INDEX idx_users_pending_hard_delete
  ON users (deleted_at)
  WHERE deleted_at IS NOT NULL AND hard_deleted_at IS NULL;

-- 0026
CREATE INDEX idx_or_customer ON official_receipts (customer_user_id, issued_at DESC);
CREATE INDEX idx_or_order ON official_receipts (service_order_id);
CREATE UNIQUE INDEX idx_or_number ON official_receipts (receipt_number);
CREATE INDEX idx_tax_config_effective ON setnayan_tax_config (effective_from DESC);
CREATE INDEX idx_payouts_vendor_quarter ON vendor_payouts (vendor_id, form_2307_quarter);
CREATE INDEX idx_payouts_status ON vendor_payouts (payout_status);
CREATE INDEX idx_payouts_scheduled ON vendor_payouts (scheduled_for) WHERE payout_status = 'scheduled';

-- 0028
CREATE INDEX idx_dispatches_user        ON email_dispatches(user_id, scheduled_for DESC);
CREATE INDEX idx_dispatches_status      ON email_dispatches(status) WHERE status IN ('queued','failed');
CREATE INDEX idx_dispatches_scheduled   ON email_dispatches(scheduled_for) WHERE status = 'queued' AND scheduled_for IS NOT NULL;
CREATE INDEX idx_dispatches_provider_id ON email_dispatches(provider_message_id);
CREATE INDEX idx_unsub_user_category ON email_unsubscribe_tokens(user_id, category);

-- 0029
CREATE INDEX idx_help_articles_role ON help_articles(role) WHERE is_published = TRUE;
CREATE INDEX idx_help_articles_section ON help_articles(role, section) WHERE is_published = TRUE;
CREATE INDEX idx_help_articles_fts ON help_articles
  USING gin(to_tsvector('english', title || ' ' || tldr || ' ' || body_md));
CREATE INDEX idx_article_feedback_article ON article_feedback(article_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_assigned ON support_tickets(assigned_admin_id, status);
CREATE INDEX idx_support_tickets_sla ON support_tickets(sla_due_at) WHERE status IN ('open','in_progress');
CREATE INDEX idx_ticket_messages_ticket ON ticket_messages(ticket_id, created_at);

-- 0030
CREATE INDEX tour_step_views_tour_idx ON tour_step_views (tour_key, viewed_at DESC);
CREATE INDEX tour_step_views_user_idx ON tour_step_views (user_id, viewed_at DESC);

-- 0031
CREATE INDEX event_broadcasts_event_window_idx
  ON event_broadcasts (event_id, scheduled_for, expires_at);
CREATE INDEX video_guestbook_event_status_idx
  ON video_guestbook_entries (event_id, status, submitted_at DESC);
CREATE INDEX event_guestbook_prompts_event_order_idx
  ON event_guestbook_prompts (event_id, active, display_order);

-- 0032
CREATE INDEX contract_drafts_vendor_status_idx ON contract_drafts (vendor_id, status, created_at DESC);
CREATE INDEX contract_drafts_customer_idx ON contract_drafts (customer_user_id, created_at DESC);
CREATE INDEX contract_drafts_expires_idx ON contract_drafts (expires_at) WHERE status = 'sent';
CREATE INDEX contract_signatures_contract_idx ON contract_signatures (contract_id);
CREATE INDEX contract_clause_library_element_active_idx
  ON contract_clause_library (element_type, is_active);
CREATE INDEX contract_purchases_vendor_idx ON contract_purchases (vendor_id, created_at DESC);

-- 0033
CREATE INDEX idx_oauth_apps_owner ON oauth_applications(owner_user_id);
CREATE INDEX idx_oauth_apps_status ON oauth_applications(status) WHERE status != 'approved';
CREATE INDEX idx_oauth_authz_user ON oauth_authorizations(user_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_oauth_authz_app ON oauth_authorizations(app_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_api_tokens_hash ON api_tokens(token_hash) WHERE revoked_at IS NULL;
CREATE INDEX idx_api_tokens_auth ON api_tokens(authorization_id);
CREATE INDEX idx_request_log_app_time ON api_request_log(app_id, created_at DESC);
CREATE INDEX idx_request_log_user_time ON api_request_log(user_id, created_at DESC);
CREATE INDEX idx_request_log_status ON api_request_log(status_code, created_at DESC)
  WHERE status_code >= 400;
CREATE INDEX idx_webhook_subs_event ON webhook_subscriptions(event_type) WHERE is_active = TRUE;
CREATE INDEX idx_webhook_deliveries_queued ON webhook_deliveries(next_attempt_at)
  WHERE status = 'queued';
CREATE INDEX idx_webhook_deliveries_sub ON webhook_deliveries(subscription_id, created_at DESC);

-- 0034
CREATE INDEX idx_service_catalog_active ON service_catalog(is_active, category) WHERE is_active = TRUE;
CREATE INDEX idx_price_history_sku ON service_catalog_price_history(sku_code, effective_from DESC);
CREATE UNIQUE INDEX idx_carts_one_active_per_user
  ON carts(user_id)
  WHERE status = 'active';
CREATE INDEX idx_carts_user_updated ON carts(user_id, updated_at DESC);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_orders_user_status ON service_orders(user_id, status, created_at DESC);
CREATE INDEX idx_orders_status_pending ON service_orders(status) WHERE status IN ('proof_submitted','verification_in_progress');
CREATE INDEX idx_orders_reference ON service_orders(reference_code);
CREATE INDEX idx_orders_expiry ON service_orders(expires_at) WHERE status = 'pending_payment';
CREATE INDEX idx_order_items_order ON service_order_items(order_id);
CREATE INDEX idx_payments_order ON service_order_payments(order_id, submitted_at DESC);
CREATE INDEX idx_payments_pending_review ON service_order_payments(reviewed_at) WHERE reviewed_at IS NULL;
CREATE INDEX idx_payments_by_admin ON service_order_payments(reviewed_by_admin, reviewed_at DESC);
CREATE INDEX idx_comp_grants_user ON comp_grants(user_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_comp_grants_source ON comp_grants(source, created_at DESC);
CREATE INDEX idx_inbox_unmatched ON payment_inbox_messages(matched_order_id) WHERE matched_order_id IS NULL;
CREATE INDEX idx_inbox_received  ON payment_inbox_messages(received_at DESC);
CREATE UNIQUE INDEX uq_inbox_source_message_id ON payment_inbox_messages(source, source_message_id) WHERE source_message_id IS NOT NULL;


-- ─── Row-Level Security policies ──────────────────────────────────────────
-- Source: 0013_platform_stack_and_sync (template) + 0012_papic_migration.sql

-- 0013 — example RLS pattern for `guests`
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "couples_full_access" ON guests
  FOR ALL
  USING (event_id IN (
    SELECT event_id FROM event_members
    WHERE user_id = auth.uid() AND member_type = 'couple'
  ));

CREATE POLICY "guests_read_own" ON guests
  FOR SELECT
  USING (id IN (
    -- ⚠ NOTE: 0013 example uses `id` but the guests PK is `guest_id`.
    -- Replace `id` with `guest_id` before applying.
    SELECT guest_id FROM event_members
    WHERE user_id = auth.uid() AND member_type = 'guest'
  ));

-- 0012 — RLS on dslr_pairings + face_enrollments
ALTER TABLE dslr_pairings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE face_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS dslr_pairings_select ON dslr_pairings;
CREATE POLICY dslr_pairings_select
  ON dslr_pairings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM event_members em
      WHERE em.event_id = dslr_pairings.event_id
        AND em.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS dslr_pairings_insert ON dslr_pairings;
CREATE POLICY dslr_pairings_insert
  ON dslr_pairings
  FOR INSERT
  WITH CHECK (
    (papic_seat_id IS NOT NULL AND EXISTS (
       SELECT 1 FROM papic_seats ps
       WHERE ps.seat_id = papic_seat_id
         AND ps.claimer_user_id = auth.uid()
    ))
    OR
    (panood_camera_id IS NOT NULL AND EXISTS (
       SELECT 1 FROM panood_cameras lsc
       WHERE lsc.camera_id = panood_camera_id
         AND lsc.operator_user_id = auth.uid()
    ))
  );

DROP POLICY IF EXISTS dslr_pairings_update ON dslr_pairings;
CREATE POLICY dslr_pairings_update
  ON dslr_pairings
  FOR UPDATE
  USING (
    (papic_seat_id IS NOT NULL AND EXISTS (
       SELECT 1 FROM papic_seats ps
       WHERE ps.seat_id = papic_seat_id
         AND ps.claimer_user_id = auth.uid()
    ))
    OR
    (panood_camera_id IS NOT NULL AND EXISTS (
       SELECT 1 FROM panood_cameras lsc
       WHERE lsc.camera_id = panood_camera_id
         AND lsc.operator_user_id = auth.uid()
    ))
  );

DROP POLICY IF EXISTS face_enrollments_select ON face_enrollments;
CREATE POLICY face_enrollments_select
  ON face_enrollments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM guests g
      WHERE g.guest_id = face_enrollments.guest_id
        AND g.user_id = auth.uid()
        -- ⚠ NOTE: `guests.user_id` is not in the 0001 schema. This policy
        -- assumes a future ALTER TABLE guests ADD COLUMN user_id UUID — or
        -- replace the predicate with the equivalent event_members lookup.
    )
    OR
    EXISTS (
      SELECT 1 FROM event_members em
      WHERE em.event_id = face_enrollments.event_id
        AND em.user_id = auth.uid()
        AND em.member_type = 'couple'
    )
  );

DROP POLICY IF EXISTS face_enrollments_revoke ON face_enrollments;
CREATE POLICY face_enrollments_revoke
  ON face_enrollments
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM guests g
      WHERE g.guest_id = face_enrollments.guest_id
        AND g.user_id = auth.uid()
    )
  )
  WITH CHECK (
    revoked_at IS NOT NULL
  );


-- ─── Functions & triggers ─────────────────────────────────────────────────

-- 0026 § 4.2 — Gap-free OR sequence allocator
CREATE OR REPLACE FUNCTION allocate_or_sequence(p_year INT) RETURNS INT AS $$
DECLARE
  next_seq INT;
BEGIN
  INSERT INTO or_sequence_state (year, next_sequence) VALUES (p_year, 2)
    ON CONFLICT (year) DO UPDATE SET next_sequence = or_sequence_state.next_sequence + 1
    RETURNING or_sequence_state.next_sequence - 1 INTO next_seq;
  RETURN next_seq;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 0012 RPC — wallet_spend_pro_camera_bridge()
-- ⚠ RETIRED-REF: This function PERFORMs wallet_spend(...) and references
-- token_transactions, both of which are part of the retired 0003 token
-- wallet. Function preserved verbatim from 0012_papic_migration.sql for
-- archeology; it WILL FAIL on a database that doesn't have wallet_spend.
-- Replace the wallet_spend PERFORM call with a service_orders insert against
-- 0034.service_catalog SKU `pro_camera_bridge_seat` before deploying.
CREATE OR REPLACE FUNCTION wallet_spend_pro_camera_bridge(
  p_event_id              UUID,
  p_papic_seat_id         UUID,
  p_panood_camera_id      UUID
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_pairing_id UUID;
BEGIN
  IF (p_papic_seat_id IS NULL AND p_panood_camera_id IS NULL)
     OR (p_papic_seat_id IS NOT NULL AND p_panood_camera_id IS NOT NULL) THEN
    RAISE EXCEPTION 'Provide exactly one of papic_seat_id or panood_camera_id';
  END IF;

  PERFORM wallet_spend(   -- ⚠ RETIRED-REF: 0003 wallet function
    p_event_id,
    'pro_camera_bridge_addon',
    COALESCE(p_papic_seat_id::TEXT, p_panood_camera_id::TEXT)
  );

  INSERT INTO dslr_pairings (event_id, papic_seat_id, panood_camera_id, brand, model, status)
  VALUES (
    p_event_id,
    p_papic_seat_id,
    p_panood_camera_id,
    'canon',
    'pending',
    'disconnected'
  )
  RETURNING pairing_id INTO v_pairing_id;

  RETURN v_pairing_id;
END;
$$;

-- 0034 § 11.5 — match_inbox_to_order() fuzzy reconciliation function
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
  IF msg.parsed_reference_code IS NOT NULL THEN
    SELECT o.order_id INTO exact_match
    FROM service_orders o
    WHERE LOWER(o.reference_code) = LOWER(msg.parsed_reference_code)
      AND o.status IN ('pending_payment','proof_submitted')
      AND ABS(o.total_centavos - msg.parsed_amount_centavos) < 100
    LIMIT 1;

    IF exact_match IS NOT NULL THEN
      RETURN QUERY SELECT exact_match, 'exact'::TEXT, 'reference_code'::TEXT;
      RETURN;
    END IF;
  END IF;

  -- Tier 2: Amount + recent + sender-name fuzzy (pg_trgm similarity > 0.6)
  SELECT o.order_id INTO amount_match
  FROM service_orders o
  JOIN users u ON u.user_id = o.user_id
  WHERE o.total_centavos = msg.parsed_amount_centavos
    AND o.status IN ('pending_payment','proof_submitted')
    AND o.created_at > NOW() - INTERVAL '48 hours'
    AND msg.parsed_sender_name IS NOT NULL
    AND similarity(u.full_name, msg.parsed_sender_name) > 0.6
    -- ⚠ NOTE: 0000 users schema has display_name not full_name. Replace
    -- `u.full_name` with `u.display_name` (or COALESCE) before applying.
  ORDER BY o.created_at DESC
  LIMIT 1;

  IF amount_match IS NOT NULL THEN
    RETURN QUERY SELECT amount_match, 'high'::TEXT, 'amount_plus_sender'::TEXT;
    RETURN;
  END IF;

  -- Tier 3: Amount-only fallback (medium confidence — manual review needed)
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

  -- Tier 4: No match — surfaces to the "Unmatched inbox" queue
  RETURN QUERY SELECT NULL::UUID, 'none'::TEXT, 'unmatched'::TEXT;
END;
$$ LANGUAGE plpgsql STABLE;

-- 0006 — vendor_crew_meal_totals VIEW (per-vendor crew-meal computation)
CREATE VIEW vendor_crew_meal_totals AS
SELECT
  c.relationship_id,
  v.event_id,
  CASE WHEN c.vendor_provides_meals THEN 0
       ELSE c.crew_count * c.meal_cost_each_centavos
  END AS crew_meal_total_centavos
FROM vendor_crew c
JOIN event_vendor_relationships v USING (relationship_id);


-- ─── Materialized views ───────────────────────────────────────────────────

-- 0006 — vendor review aggregates (refresh on review publish/edit)
CREATE MATERIALIZED VIEW vendor_review_stats AS
SELECT
  vendor_id,
  COUNT(*) AS review_count,
  AVG(rating_overall)::numeric(3,2) AS avg_rating,
  AVG(rating_communication)::numeric(3,2) AS avg_communication,
  AVG(rating_quality)::numeric(3,2) AS avg_quality,
  AVG(rating_value)::numeric(3,2) AS avg_value,
  AVG(rating_punctuality)::numeric(3,2) AS avg_punctuality
FROM vendor_reviews
WHERE is_published = TRUE
GROUP BY vendor_id;

-- 0028 — daily aggregated email metrics
CREATE MATERIALIZED VIEW email_metrics_daily AS
SELECT
  DATE(sent_at)  AS day,
  category,
  template_key,
  COUNT(*)                                                 AS sent,
  COUNT(*) FILTER (WHERE delivered_at IS NOT NULL)         AS delivered,
  COUNT(*) FILTER (WHERE opened_at IS NOT NULL)            AS opened,
  COUNT(*) FILTER (WHERE clicked_at IS NOT NULL)           AS clicked,
  COUNT(*) FILTER (WHERE bounced_at IS NOT NULL)           AS bounced,
  COUNT(*) FILTER (WHERE status = 'complained')            AS complained,
  COUNT(*) FILTER (WHERE status = 'suppressed')            AS suppressed
FROM email_dispatches
WHERE sent_at IS NOT NULL
GROUP BY 1, 2, 3;

CREATE UNIQUE INDEX idx_metrics_day_template ON email_metrics_daily(day, category, template_key);


-- ─── Seeds (canonical reference data) ─────────────────────────────────────
-- Source: 0034 § 0034.1 + 0011 § sde_renders schema additions

-- 0034 service_catalog seed values
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
  ('ai_edited_highlight_3min',    'AI Edited Highlight (3-min)','Themed multi-segment 3-minute polished reel',          'ai_highlight',     499900, TRUE),
  ('contract_intelligence_upgrade','Contract Intelligence (per contract)', 'Per-contract AI analysis + e-sig flow',     'contract',          19900, TRUE),
  ('vendor_pro_weekly',           'Vendor Pro Weekly',          'Vendor analytics + custom plan builder + branding',    'vendor_subscription', 49900, FALSE),
  ('sponsored_boost_weekly',      'Sponsored Boost (per week)', 'Marketplace ranking boost (Certified vendors only)',   'vendor_subscription',149900, TRUE);

-- 0011 — Same-Day Edit SKU (declared in spec text via plain INSERT)
-- ⚠ CONFLICT: 0011 uses sku_key + customer_price_php_centavos + description
-- column names, but 0034 declares the table with sku_code + name + description
-- + category + price_php_centavos. Below uses 0034's canonical columns.
INSERT INTO service_catalog (sku_code, name, description, category, price_php_centavos, is_multi_purchase)
VALUES ('same_day_edit', 'Same-Day Edit', 'Same-Day Edit · flagship · 3-5 min · T-30min delivery', 'panood', 899900, FALSE)
ON CONFLICT (sku_code) DO NOTHING;

-- 0012 — Pro Camera Bridge add-on seed (spec includes an UPSERT; we keep its
-- effect against the canonical 0034 service_catalog. The 0012 INSERT uses
-- legacy column names (service_key, display_name_en/_fil, token_display,
-- ref_type, one_time_per_event, iteration_origin, active) that do not exist
-- in 0034's schema, so the INSERT is rewritten to the canonical shape and the
-- token_display field is dropped — its companion token wallet was retired.
-- ⚠ CONFLICT (resolved): 0012 SKU keyed as 'pro_camera_bridge_addon' but
-- 0034 catalog uses 'pro_camera_bridge_seat'. They are the same product;
-- we keep 0034's name and let 0012's RPC reference it after rename.
INSERT INTO service_catalog (sku_code, name, description, category, price_php_centavos, is_multi_purchase)
VALUES ('pro_camera_bridge_seat', 'Pro Camera Bridge (per DSLR seat)',
        'WiFi-SDK pairing for Canon/Nikon/Sony/Fujifilm — ₱1,500 / seat',
        'paparazzi', 150000, TRUE)
ON CONFLICT (sku_code) DO UPDATE
  SET price_php_centavos = EXCLUDED.price_php_centavos,
      description        = EXCLUDED.description,
      category           = EXCLUDED.category,
      is_multi_purchase  = EXCLUDED.is_multi_purchase;


-- ─── End of master schema ─────────────────────────────────────────────────
