-- ============================================================================
-- Iteration 0012 — Papic V1 (Pro Camera Bridge + face detection + metadata)
-- Migration: 0012_papic_dslr_face_metadata.sql
-- Last revised: 2026-05-10
-- Target: Supabase Postgres 15+
-- Depends on:
--   - 0000 (events, users, event_members, event_join_tokens)
--   - 0001 (guests, guest_roles, guest_role_assignments)
--   - 0003 (token_wallets, service_catalog, wallet_spend RPC)
--   - 0008 (tables, table_assignments) for table-tag fan-out
--   - existing 0012 webapp slice (papic_seats, photos, photo_tags, templates,
--     personal_reels, event_template_unlocks)
--
-- This migration adds:
--   1. New columns on `photos` for capture metadata + face inference state
--   2. New columns on `events` for the geolocation toggle
--   3. New `dslr_pairings` table tracking phone↔DSLR pairings per seat / LS slot
--   4. New `face_enrollments` table holding per-event face vectors for guests
--   5. Updates `photo_tags.source` enum to include `auto_face` and `manual_pick`
--   6. Indexes for the queries the matcher and gallery filters perform
--   7. Foreign keys with cascade rules tied to event lifecycle
--   8. Supabase RLS policies enforcing event-scoped access
--   9. Service-catalog seed for `pro_camera_bridge_addon` (shared with 0011)
--
-- Reversible: yes (see ROLLBACK section at bottom; do not commit live)
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. EVENTS — add couple-level geolocation toggle
-- ----------------------------------------------------------------------------
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS geolocation_enabled BOOLEAN NOT NULL DEFAULT TRUE;

COMMENT ON COLUMN events.geolocation_enabled IS
  'When false, all papic captures for this event stamp null geo. Default true (wedding venues are public locations); couples flip to false for private home weddings.';


-- ----------------------------------------------------------------------------
-- 2. PHOTOS — new metadata columns
-- ----------------------------------------------------------------------------
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
UPDATE photos
SET captured_at = created_at
WHERE captured_at IS NULL;

ALTER TABLE photos
  ALTER COLUMN captured_at SET NOT NULL;

ALTER TABLE photos
  ADD CONSTRAINT photos_paired_camera_brand_chk
    CHECK (paired_camera_brand IS NULL
           OR paired_camera_brand IN ('canon','nikon','sony','fujifilm')),
  ADD CONSTRAINT photos_paired_camera_pair_chk
    CHECK ((paired_camera_brand IS NULL  AND paired_camera_model IS NULL)
        OR (paired_camera_brand IS NOT NULL AND paired_camera_model IS NOT NULL));

CREATE INDEX IF NOT EXISTS photos_event_captured_at_idx
  ON photos (event_id, captured_at DESC);

CREATE INDEX IF NOT EXISTS photos_event_paired_brand_idx
  ON photos (event_id, paired_camera_brand)
  WHERE paired_camera_brand IS NOT NULL;

COMMENT ON COLUMN photos.captured_at IS
  'NTP-synced device clock at shutter-release. Stamped on the phone, not on upload. Required.';
COMMENT ON COLUMN photos.geo_lat IS
  'WGS84 latitude. Null when no GPS fix was available within 60s of capture, or when events.geolocation_enabled = false.';
COMMENT ON COLUMN photos.geo_unavailable IS
  'True when capture had no GPS fix; distinct from null-because-couple-disabled.';
COMMENT ON COLUMN photos.paired_camera_brand IS
  'Set when this photo was captured via a paired DSLR. Null on phone-internal captures.';
COMMENT ON COLUMN photos.auto_face_attempted IS
  'True after the on-device face inference pass has run. False means inference is still pending or failed; UI surfaces this as "still tagging" in the couple gallery.';


-- ----------------------------------------------------------------------------
-- 3. PHOTO_TAGS — extend source enum
-- ----------------------------------------------------------------------------
-- Existing source enum: ('individual_qr', 'table_qr', 'auto_face')
-- Add: 'manual_pick' for the Pick-button manual selector flow
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'photo_tags_source_check'
  ) THEN
    -- No prior CHECK exists; create one (column is plain TEXT in webapp slice)
    ALTER TABLE photo_tags
      ADD CONSTRAINT photo_tags_source_check
        CHECK (source IN ('individual_qr','table_qr','auto_face','manual_pick'));
  ELSE
    -- Drop and recreate to add manual_pick
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

CREATE INDEX IF NOT EXISTS photo_tags_event_source_idx
  ON photo_tags (photo_id, source);

CREATE INDEX IF NOT EXISTS photo_tags_guest_event_idx
  ON photo_tags (guest_id);

COMMENT ON COLUMN photo_tags.confidence IS
  'Cosine similarity for source=auto_face (required for that source); null otherwise.';


-- ----------------------------------------------------------------------------
-- 4. DSLR_PAIRINGS — phone↔DSLR pairing records
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dslr_pairings (
  pairing_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id                UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  papic_seat_id       UUID REFERENCES papic_seats(seat_id) ON DELETE CASCADE,
  panood_camera_id   UUID,    -- references panood_cameras when 0011 schema lands
  brand                   TEXT NOT NULL CHECK (brand IN ('canon','nikon','sony','fujifilm')),
  model                   TEXT NOT NULL,
  serial_number           TEXT,
  capabilities_json       JSONB,                          -- max_resolution, raw_format, video_modes, flash_available
  bridge_unlock_id        UUID,                           -- references token_transactions for the pro_camera_bridge_addon spend
  status                  TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','disconnected','retired')),
  paired_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_paired_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  disconnected_at         TIMESTAMPTZ,
  retired_at              TIMESTAMPTZ,

  CONSTRAINT dslr_pairings_one_target_chk
    CHECK ((papic_seat_id IS NOT NULL AND panood_camera_id IS NULL)
        OR (papic_seat_id IS NULL  AND panood_camera_id IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS dslr_pairings_event_status_idx
  ON dslr_pairings (event_id, status);

CREATE INDEX IF NOT EXISTS dslr_pairings_seat_idx
  ON dslr_pairings (papic_seat_id)
  WHERE papic_seat_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS dslr_pairings_ls_camera_idx
  ON dslr_pairings (panood_camera_id)
  WHERE panood_camera_id IS NOT NULL;

COMMENT ON TABLE dslr_pairings IS
  'One row per phone↔DSLR pairing. Bound to either a papic seat OR a panood camera slot (never both). Spawned by a successful spend of pro_camera_bridge_addon and a successful WiFi pairing handshake.';
COMMENT ON COLUMN dslr_pairings.capabilities_json IS
  'Snapshot of the body capabilities at pairing time. {max_resolution, raw_format, video_modes, flash_available, lens_model_at_pair}.';
COMMENT ON COLUMN dslr_pairings.bridge_unlock_id IS
  'Forward FK to token_transactions when 0003 catalog naming is finalized. Identifies which spend financed this pairing.';


-- ----------------------------------------------------------------------------
-- 5. FACE_ENROLLMENTS — per-event face vector store
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS face_enrollments (
  enrollment_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id                UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  guest_id                UUID NOT NULL REFERENCES guests(guest_id) ON DELETE CASCADE,
  source                  TEXT NOT NULL CHECK (source IN ('rsvp_profile','guest_portal','checkin_kiosk')),
  vector_blob             BYTEA NOT NULL,                 -- 128-d float32 = 512 bytes
  vector_dim              SMALLINT NOT NULL DEFAULT 128 CHECK (vector_dim = 128),
  quality_score           REAL NOT NULL CHECK (quality_score >= 0.0 AND quality_score <= 1.0),
  qa_breakdown_json       JSONB,                          -- {face_count, fill_pct, sharpness, frontal_pose}
  captured_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at              TIMESTAMPTZ,                    -- guest revocation timestamp
  revocation_reason       TEXT,                           -- nullable; 'guest_request' | 'rsvp_consent_off' | 'event_retention_end'

  CONSTRAINT face_enrollments_one_per_source UNIQUE (event_id, guest_id, source),
  CONSTRAINT face_enrollments_vector_size_chk
    CHECK (octet_length(vector_blob) = 512)
);

CREATE INDEX IF NOT EXISTS face_enrollments_event_active_idx
  ON face_enrollments (event_id, guest_id)
  WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS face_enrollments_event_quality_idx
  ON face_enrollments (event_id, quality_score DESC)
  WHERE revoked_at IS NULL;

COMMENT ON TABLE face_enrollments IS
  'Per-event guest face vectors for on-device matching during papic capture. Vectors are scoped to one event; never reused across weddings; deleted at the 5-year event retention boundary.';
COMMENT ON COLUMN face_enrollments.vector_blob IS
  '128-dimensional float32 face embedding. Exactly 512 bytes. Computed by Apple Vision (iOS), ML Kit (Android), or the kiosk webapp (TFLite WASM).';
COMMENT ON COLUMN face_enrollments.qa_breakdown_json IS
  '{face_count, fill_pct, sharpness, frontal_pose}. Used for diagnostics when a guest reports tagging failures.';
COMMENT ON COLUMN face_enrollments.revoked_at IS
  'Set by the "Delete my face data" flow. The matcher cache picks up revocation on next 5-min refresh. vector_blob is zeroed in the same transaction.';


-- ----------------------------------------------------------------------------
-- 6. SERVICE_CATALOG — register pro_camera_bridge_addon (shared SKU 0011 + 0012)
-- ----------------------------------------------------------------------------
INSERT INTO service_catalog (
  service_key,
  display_name_en,
  display_name_fil,
  php_price_centavos,
  token_display,
  ref_type,
  one_time_per_event,
  iteration_origin,
  active
) VALUES (
  'pro_camera_bridge_addon',
  'Pro Camera Bridge (per DSLR seat)',
  'Pro Camera Bridge (bawat DSLR seat)',
  150000,                        -- ₱1,500
  45000,                         -- 45,000 tokens
  '(event_id, papic_seat_id | panood_camera_id)',
  FALSE,                         -- multi-purchase, bound to a specific slot at spend-time
  '0011 (shared with 0012)',
  TRUE
)
ON CONFLICT (service_key) DO UPDATE
  SET php_price_centavos = EXCLUDED.php_price_centavos,
      token_display      = EXCLUDED.token_display,
      ref_type           = EXCLUDED.ref_type,
      one_time_per_event = EXCLUDED.one_time_per_event,
      iteration_origin   = EXCLUDED.iteration_origin,
      active             = EXCLUDED.active;


-- ----------------------------------------------------------------------------
-- 7. ROW-LEVEL SECURITY (Supabase)
-- ----------------------------------------------------------------------------
ALTER TABLE dslr_pairings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE face_enrollments ENABLE ROW LEVEL SECURITY;

-- Helper: a logged-in user can SELECT a row scoped to event X iff they have an
-- event_members row for X with member_type IN ('couple','guest','vendor').
-- Couples have full access; guests can only see/revoke their own face_enrollments.

-- DSLR pairings: read access for any event member; write only by the seat's claimer
-- (or by service_role for the backend pairing flow).
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
    -- The user must be the claimer of the targeted seat or LS camera
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

-- Face enrollments: SELECT restricted to the owning guest + event couple + service_role.
-- INSERT via service_role only (the kiosk webapp uses the service_role key inside an
-- Edge Function; the RSVP / guest-portal flows go through Edge Functions too).
-- UPDATE for the revocation flow: the guest (or event couple) can set revoked_at.
DROP POLICY IF EXISTS face_enrollments_select ON face_enrollments;
CREATE POLICY face_enrollments_select
  ON face_enrollments
  FOR SELECT
  USING (
    -- Guest sees their own
    EXISTS (
      SELECT 1 FROM guests g
      WHERE g.guest_id = face_enrollments.guest_id
        AND g.user_id = auth.uid()
    )
    OR
    -- Couple sees all enrollments for their event (read-only; for diagnostics)
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
    -- The only column a guest can update via RLS is revoked_at + revocation_reason
    revoked_at IS NOT NULL
  );

-- INSERT goes through service_role (Edge Functions) — no client-direct INSERT policy.


-- ----------------------------------------------------------------------------
-- 8. SUPABASE STORAGE — buckets for face vectors and DSLR pairing assets
-- ----------------------------------------------------------------------------
-- Bucket creation is normally done via the Supabase dashboard or SQL extension
-- 'supabase_storage'. Documenting expected buckets here for the migration runner:
--
--   bucket: face_vectors_cache
--     - r2-mirrored. Phones download a snapshot of vectors per event on seat claim.
--     - public: false; access via signed URLs scoped to (event_id, papic_seat_id).
--     - retention: per-event, deleted at retention boundary.
--
--   bucket: dslr_pairing_capabilities
--     - holds the JSON capability descriptors per pairing for diagnostics.
--     - public: false; service_role read/write; couple read.
--
-- The DDL for these is environment-specific; see infra/supabase/storage.sql in
-- iteration 0013's section B output.


-- ----------------------------------------------------------------------------
-- 9. AUDIT — small audit table for face enrollment + revocation operations
-- ----------------------------------------------------------------------------
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

CREATE INDEX IF NOT EXISTS face_enrollment_audit_event_idx
  ON face_enrollment_audit (event_id, occurred_at DESC);


-- ----------------------------------------------------------------------------
-- 10. RPC — wallet_spend_pro_camera_bridge() helper
-- ----------------------------------------------------------------------------
-- Wraps the generic 0003 wallet_spend() with the bridge-specific binding step
-- that creates a placeholder dslr_pairings row in 'pre_pair' state. The phone
-- pairing flow then UPDATE-s the row with brand/model/capabilities once the
-- WiFi handshake completes.
CREATE OR REPLACE FUNCTION wallet_spend_pro_camera_bridge(
  p_event_id              UUID,
  p_papic_seat_id     UUID,
  p_panood_camera_id UUID
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_pairing_id UUID;
BEGIN
  -- Exactly one of seat / camera must be provided
  IF (p_papic_seat_id IS NULL AND p_panood_camera_id IS NULL)
     OR (p_papic_seat_id IS NOT NULL AND p_panood_camera_id IS NOT NULL) THEN
    RAISE EXCEPTION 'Provide exactly one of papic_seat_id or panood_camera_id';
  END IF;

  -- Spend 45,000 tokens via the generic wallet primitive (defined in 0003).
  -- This raises if the wallet has insufficient balance.
  PERFORM wallet_spend(
    p_event_id,
    'pro_camera_bridge_addon',
    COALESCE(p_papic_seat_id::TEXT, p_panood_camera_id::TEXT)
  );

  -- Insert a placeholder pairing row to bind the unlock to a slot at spend-time.
  INSERT INTO dslr_pairings (event_id, papic_seat_id, panood_camera_id, brand, model, status)
  VALUES (
    p_event_id,
    p_papic_seat_id,
    p_panood_camera_id,
    'canon',         -- placeholder; updated on WiFi pairing
    'pending',       -- placeholder; updated on WiFi pairing
    'disconnected'
  )
  RETURNING pairing_id INTO v_pairing_id;

  RETURN v_pairing_id;
END;
$$;

COMMENT ON FUNCTION wallet_spend_pro_camera_bridge IS
  'Spends 45k tokens on pro_camera_bridge_addon and creates a placeholder dslr_pairings row bound to one slot. The phone pairing flow updates brand/model/capabilities/status once the WiFi handshake completes.';


-- ----------------------------------------------------------------------------
-- 11. NOTIFY — surface schema-change event to the application layer
-- ----------------------------------------------------------------------------
NOTIFY tayo_schema_change, '{"iteration":"0012","added":["dslr_pairings","face_enrollments","face_enrollment_audit","photos.captured_at","photos.geo_*","photos.paired_camera_*","events.geolocation_enabled"]}';

COMMIT;


-- ============================================================================
-- ROLLBACK (do not execute against production without explicit owner sign-off)
-- ============================================================================
--
-- BEGIN;
--   DROP FUNCTION IF EXISTS wallet_spend_pro_camera_bridge(UUID, UUID, UUID);
--   DROP TABLE   IF EXISTS face_enrollment_audit;
--   DROP TABLE   IF EXISTS face_enrollments;
--   DROP TABLE   IF EXISTS dslr_pairings;
--
--   DELETE FROM service_catalog WHERE service_key = 'pro_camera_bridge_addon';
--
--   ALTER TABLE photo_tags
--     DROP COLUMN IF EXISTS confidence;
--   ALTER TABLE photo_tags
--     DROP CONSTRAINT IF EXISTS photo_tags_source_check,
--     DROP CONSTRAINT IF EXISTS photo_tags_confidence_chk,
--     DROP CONSTRAINT IF EXISTS photo_tags_auto_face_confidence_chk;
--   -- Recreate prior CHECK if applicable
--   ALTER TABLE photo_tags
--     ADD CONSTRAINT photo_tags_source_check
--       CHECK (source IN ('individual_qr','table_qr','auto_face'));
--
--   ALTER TABLE photos
--     DROP COLUMN IF EXISTS auto_face_attempted,
--     DROP COLUMN IF EXISTS paired_camera_model,
--     DROP COLUMN IF EXISTS paired_camera_brand,
--     DROP COLUMN IF EXISTS device_model,
--     DROP COLUMN IF EXISTS geo_unavailable,
--     DROP COLUMN IF EXISTS geo_accuracy_m,
--     DROP COLUMN IF EXISTS geo_lon,
--     DROP COLUMN IF EXISTS geo_lat,
--     DROP COLUMN IF EXISTS captured_at;
--
--   ALTER TABLE events
--     DROP COLUMN IF EXISTS geolocation_enabled;
-- COMMIT;
