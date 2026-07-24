-- =============================================================================
--  SETNAYAN · RLS + entitlement-guard VERIFICATION  (self-contained, NON-DESTRUCTIVE)
--  PRs #3604 (RLS guest-scope) + #3605 (entitlement triggers).
--
--  HOW TO RUN:  paste this whole script into the Supabase SQL editor and Run.
--  It wraps EVERYTHING in one transaction and ROLLS BACK at the end, so it
--  changes nothing permanently. It applies the two migrations inside the txn,
--  discovers REAL rows to test against, checks that an attacker is BLOCKED and
--  a legitimate path still WORKS, prints a PASS/FAIL grid, then rolls back.
--
--  Prefer a quiet moment: for ~1s the new triggers/policies exist inside the
--  open transaction, so a concurrent write in that window would see them.
--  Nothing persists. Read the final result grid: every row must say PASS.
-- =============================================================================
BEGIN;

-- ---- 1. Apply migration #3605 (entitlement triggers) -------------------------
-- ============================================================================
-- Entitlement write-guard triggers — a paying party must never self-grant a
-- paid tier (AUTHZ hardening).
--
-- ROOT CAUSE: three entitlement columns sit behind FOR-ALL / permissive RLS
-- policies scoped to the ENTITLED party, so the owner can grant their own paid
-- flag through a plain PostgREST write — RLS lets the row through, and nothing
-- checked the column. Both the UPDATE and the INSERT path are reachable:
--   • vendor_profiles.tier_state / tier_expires_at
--        (policy vendor_profiles_owner · migration 20260513120000 · FOR ALL,
--         USING/CHECK user_id = auth.uid(), no column/tier constraint). tier_state
--         is the whole subscription ladder; a self-write = a free
--         Enterprise/Custom tier. INSERT vector: DELETE the (UNIQUE user_id) row
--         and re-INSERT it with an elevated tier_state.
--   • vendor_custom_plans.status / composition
--        (policy vendor_custom_plans_vendor_access · migration 20270512705572 ·
--         FOR ALL, USING/CHECK vendor owns the row, no status constraint).
--         Moving a row to 'active' with a self-authored composition unlocks
--         arbitrary caps + paid /api/v1 (lib/vendor-effective-caps.ts +
--         lib/enterprise-vendor-gate.ts gate on an ACTIVE plan). INSERT vector:
--         POST a fresh row already at status='active' (the one-active partial
--         unique index does not block a vendor with no active plan yet).
--   • events.setnayan_ai_active
--        (UPDATE policy couple_can_update_event · migration 20260512000000 · FOR
--         UPDATE to couple|admin; INSERT policy authenticated_can_create_event ·
--         same migration · FOR INSERT WITH CHECK (TRUE)). The boolean IS the paid
--         Setnayan AI entitlement; a couple PATCH — or a couple POST of a fresh
--         event with the flag true — = free AI (read gate lib/setnayan-ai.ts
--         trusts the boolean, no paid-order cross-check).
--
-- FIX: BEFORE INSERT OR UPDATE row triggers that RAISE when a DIRECT end-user
-- write sets/changes a guarded column. INSERT coverage is load-bearing: every
-- guarded column sits behind a FOR-ALL (or WITH CHECK(TRUE)) RLS policy, so an
-- UPDATE-only guard is trivially bypassed by writing the entitlement at INSERT
-- time instead — e.g. a couple POSTing a fresh event with setnayan_ai_active=true
-- (authenticated_can_create_event · WITH CHECK(TRUE)), a vendor POSTing a
-- vendor_custom_plans row already at status='active', or a vendor
-- DELETE+re-INSERTing their vendor_profiles row with an elevated tier_state.
-- The triggers are SECURITY INVOKER (the default) so `current_user` reflects the
-- EFFECTIVE Postgres role of the write:
--
--   • Direct PostgREST PATCH from a browser  → current_user = 'authenticated'
--     (or 'anon')                            → BLOCKED (unless is_admin()).
--   • Service-role admin client
--     (lib/supabase/admin.ts · the paid       → current_user = 'service_role'
--     activation path lib/sku-activation.ts)  → ALLOWED.
--   • SECURITY DEFINER server RPCs that       → current_user = the function
--     legitimately move the tier — e.g.          owner (NOT a PostgREST role)
--     public.sweep_vendor_tier_expiry (the    → ALLOWED.
--     login-driven lapse sweep, invoked by
--     an AUTHENTICATED vendor from
--     app/vendor-dashboard/layout.tsx) and
--     public._apply_subscription_credit
--     (subscription checkout family,
--     migration 20261010000000).
--   • An admin acting from their own          → is_admin() = TRUE → ALLOWED.
--     authenticated session.
--
-- WHY current_user AND NOT auth.role(): auth.role() reads the JWT `role` claim,
-- which STAYS 'authenticated' inside a SECURITY DEFINER function — so gating on
-- auth.role() would break sweep_vendor_tier_expiry (a live authenticated-invoked
-- SECURITY DEFINER writer of tier_state, called on every vendor dashboard load)
-- and lock vendors out of the auto-lapse. current_user is elevated to the
-- function owner under SECURITY DEFINER, so it distinguishes "raw end-user
-- PATCH" from "vetted server path" exactly. Verified: every legitimate writer of
-- these columns is either the service-role client, a SECURITY DEFINER RPC, or an
-- admin — see the WHY block above and the code audit in the PR.
--
-- vendor_custom_plans is TRANSITION-AWARE, not a blanket block: the vendor path
-- app/vendor-dashboard/subscription/custom/actions.ts (requestCustomPlan)
-- LEGITIMATELY updates its OWN non-active row's composition + status to
-- 'pending_payment' via the authenticated client. Only two moves are forbidden
-- to a non-privileged writer: (1) moving a plan INTO 'active' (the entitlement
-- grant), and (2) mutating the composition/status of an ALREADY-active plan (the
-- live caps overlay). Both are admin/service/definer-only.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. vendor_profiles.tier_state / tier_expires_at
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.guard_vendor_profiles_entitlement()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF current_user IN ('authenticated', 'anon') AND NOT public.is_admin() THEN
    IF TG_OP = 'INSERT' THEN
      -- A non-privileged writer may only create a row at the 'free' default with
      -- no expiry. Legitimate registration (app/open-shop/actions.ts) inserts
      -- {user_id} only via the service-role admin client, so this never fires on
      -- the real path; it closes the DELETE+re-INSERT self-elevation vector.
      IF NEW.tier_state IS DISTINCT FROM 'free'::public.vendor_tier_state
         OR NEW.tier_expires_at IS NOT NULL
      THEN
        RAISE EXCEPTION
          'vendor_profiles.tier_state/tier_expires_at is not writable by the vendor (self-grant blocked)'
          USING ERRCODE = 'insufficient_privilege',
                HINT = 'Tier changes go through the admin console or the paid activation path (service_role).';
      END IF;
    ELSE  -- UPDATE
      IF NEW.tier_state IS DISTINCT FROM OLD.tier_state
         OR NEW.tier_expires_at IS DISTINCT FROM OLD.tier_expires_at
      THEN
        RAISE EXCEPTION
          'vendor_profiles.tier_state/tier_expires_at is not writable by the vendor (self-grant blocked)'
          USING ERRCODE = 'insufficient_privilege',
                HINT = 'Tier changes go through the admin console or the paid activation path (service_role).';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_vendor_profiles_entitlement ON public.vendor_profiles;
CREATE TRIGGER trg_guard_vendor_profiles_entitlement
  BEFORE INSERT OR UPDATE ON public.vendor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_vendor_profiles_entitlement();

-- ----------------------------------------------------------------------------
-- 2. vendor_custom_plans.status / composition  (transition-aware)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.guard_vendor_custom_plans_entitlement()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF current_user IN ('authenticated', 'anon') AND NOT public.is_admin() THEN
    IF TG_OP = 'INSERT' THEN
      -- A non-privileged writer may never CREATE an already-active plan — that is
      -- the same paid-tier grant as an active-transition, just via INSERT. The
      -- one-active partial-unique index does NOT block a vendor who holds no
      -- active plan yet, so it cannot substitute for this guard. Legitimate
      -- requestCustomPlan (subscription/custom/actions.ts) inserts
      -- status='pending_payment', never 'active', so this never fires on the real
      -- path.
      IF NEW.status = 'active' THEN
        RAISE EXCEPTION
          'vendor_custom_plans cannot be self-activated (self-grant blocked)'
          USING ERRCODE = 'insufficient_privilege',
                HINT = 'A Custom plan goes active only via the admin activation / paid approval path.';
      END IF;
    ELSE  -- UPDATE
      -- (1) Self-activation: a non-privileged writer may never move a plan INTO
      --     'active' (that is the paid-tier grant read by the caps overlay + the
      --     /api/v1 gate).
      IF NEW.status = 'active' AND OLD.status IS DISTINCT FROM 'active' THEN
        RAISE EXCEPTION
          'vendor_custom_plans cannot be self-activated (self-grant blocked)'
          USING ERRCODE = 'insufficient_privilege',
                HINT = 'A Custom plan goes active only via the admin activation / paid approval path.';
      END IF;
      -- (2) Tampering with a LIVE plan: never mutate the composition or status of
      --     an already-active plan (would rewrite live caps or silently demote it).
      IF OLD.status = 'active'
         AND (NEW.composition IS DISTINCT FROM OLD.composition
               OR NEW.status IS DISTINCT FROM OLD.status)
      THEN
        RAISE EXCEPTION
          'an active vendor_custom_plan is not vendor-writable (composition/status locked)'
          USING ERRCODE = 'insufficient_privilege',
                HINT = 'Adjust a Custom plan by requesting a NEW plan; the admin re-quotes and re-activates.';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_vendor_custom_plans_entitlement ON public.vendor_custom_plans;
CREATE TRIGGER trg_guard_vendor_custom_plans_entitlement
  BEFORE INSERT OR UPDATE ON public.vendor_custom_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_vendor_custom_plans_entitlement();

-- ----------------------------------------------------------------------------
-- 3. events.setnayan_ai_active
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.guard_events_ai_entitlement()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF current_user IN ('authenticated', 'anon') AND NOT public.is_admin() THEN
    -- On INSERT (OLD is NULL) the flag must arrive false — only a set-to-TRUE is
    -- a self-grant. On UPDATE, any change is blocked. Normal authenticated event
    -- creation (create-event / onboarding) never sets this column, so an ordinary
    -- POST (flag defaults false) passes; the paid activation path writes it as
    -- service_role and is unaffected.
    IF TG_OP = 'INSERT' THEN
      IF NEW.setnayan_ai_active THEN
        RAISE EXCEPTION
          'events.setnayan_ai_active is a paid entitlement and is not writable by the couple (self-grant blocked)'
          USING ERRCODE = 'insufficient_privilege',
                HINT = 'The flag is set only by the paid SETNAYAN_AI activation path (service_role).';
      END IF;
    ELSE  -- UPDATE
      IF NEW.setnayan_ai_active IS DISTINCT FROM OLD.setnayan_ai_active THEN
        RAISE EXCEPTION
          'events.setnayan_ai_active is a paid entitlement and is not writable by the couple (self-grant blocked)'
          USING ERRCODE = 'insufficient_privilege',
                HINT = 'The flag is set only by the paid SETNAYAN_AI activation path (service_role).';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_events_ai_entitlement ON public.events;
CREATE TRIGGER trg_guard_events_ai_entitlement
  BEFORE INSERT OR UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_events_ai_entitlement();

-- ----------------------------------------------------------------------------
-- 4. Post-conditions — assert the guard actually attached (fail loudly rather
--    than half-apply, mirroring 20270828140000_papic_one_tiers.sql).
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  v_missing TEXT[] := ARRAY[]::TEXT[];
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE NOT tgisinternal
      AND tgname = 'trg_guard_vendor_profiles_entitlement'
      AND tgrelid = 'public.vendor_profiles'::regclass
  ) THEN
    v_missing := array_append(v_missing, 'vendor_profiles');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE NOT tgisinternal
      AND tgname = 'trg_guard_vendor_custom_plans_entitlement'
      AND tgrelid = 'public.vendor_custom_plans'::regclass
  ) THEN
    v_missing := array_append(v_missing, 'vendor_custom_plans');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE NOT tgisinternal
      AND tgname = 'trg_guard_events_ai_entitlement'
      AND tgrelid = 'public.events'::regclass
  ) THEN
    v_missing := array_append(v_missing, 'events');
  END IF;

  IF array_length(v_missing, 1) IS NOT NULL THEN
    RAISE EXCEPTION
      'entitlement write-guard failed to attach on: %', array_to_string(v_missing, ', ');
  END IF;
END $$;


-- ---- 2. Apply migration #3604 (RLS guest-scope) ------------------------------
-- ============================================================================
-- RLS guest-scope hardening — re-scope sensitive policies off current_event_ids
-- ============================================================================
-- ROOT CAUSE: public.current_event_ids() = SELECT event_id FROM event_members
-- WHERE user_id = auth.uid() — with NO member_type filter. A plain GUEST
-- (member_type='guest', seeded when someone joins via app/join/[eventId]) is
-- therefore returned as a full event "member". Every policy scoped on
-- current_event_ids() thus leaks to any guest who joined the event.
--
-- Owner decision (2026-07-23): a plain guest gets a read-only BENIGN event view
-- (schedule / seat plan / the event row) but must NEVER reach tokens, orders,
-- payments, biometric data, vendor payment schedules, or other guests' secrets.
--
-- This migration DROP/CREATEs each sensitive policy below, changing ONLY the
-- scope helper and keeping every other clause. RLS stays ENABLED on every
-- table; no policy is widened; no blanket allow-all predicate is introduced.
-- Benign
-- event-context tables (schedule / run-of-show / seat plan / the event row)
-- are deliberately left on current_event_ids() — guests keep those.
--
-- Scoped helpers reused (already shipped — see their defining migrations):
--   current_couple_event_ids()                 — member_type='couple' only
--     (20260513040000)
--   current_couple_or_coordinator_event_ids()  — couple + coordinator
--     (20270206186005)
--
-- Idempotent: DROP POLICY IF EXISTS + CREATE for every policy.
-- ============================================================================


-- ── oauth_grants · event_member_reads_oauth_grants (SELECT) ──────────────────
-- Plaintext Google/YouTube OAuth refresh tokens. Couple only — not even
-- coordinators. (was: current_event_ids — 20260516261000)
DROP POLICY IF EXISTS event_member_reads_oauth_grants ON public.oauth_grants;
CREATE POLICY event_member_reads_oauth_grants ON public.oauth_grants
  FOR SELECT TO authenticated
  USING (event_id IN (SELECT public.current_couple_event_ids()));

-- ── guests · event_member_can_read_guest (SELECT) ───────────────────────────
-- Exposes every guest's qr_token (→ ephemeral session mint). Co-hosts manage
-- the list, so couple + coordinator. The separate guest_reads_own_row policy
-- (20260513010000) is UNTOUCHED, so a guest still sees THEIR own row.
-- (was: current_event_ids — 20260513010000; keeps the deleted_at guard)
DROP POLICY IF EXISTS event_member_can_read_guest ON public.guests;
CREATE POLICY event_member_can_read_guest ON public.guests
  FOR SELECT TO authenticated
  USING (
    event_id IN (SELECT public.current_couple_or_coordinator_event_ids())
    AND deleted_at IS NULL
  );

-- ── orders · orders_owner_read (SELECT) ─────────────────────────────────────
-- The money ledger. Co-host (spouse) read was the intent; a guest must not read
-- it. Coordinators are deliberately NOT added (money-wall). The direct-owner
-- (user_id = auth.uid()) and admin arms are preserved verbatim.
-- (was: current_event_ids — 20270129279924)
DROP POLICY IF EXISTS orders_owner_read ON public.orders;
CREATE POLICY orders_owner_read ON public.orders
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR event_id IN (SELECT public.current_couple_event_ids())
    OR public.is_admin()
  );

-- ── guest_face_enrollments · event_member_can_read_face_enrollment (SELECT) ──
-- Biometric face vectors + selfie references. Couple only.
-- (was: current_event_ids — 20260901000000)
DROP POLICY IF EXISTS event_member_can_read_face_enrollment ON public.guest_face_enrollments;
CREATE POLICY event_member_can_read_face_enrollment ON public.guest_face_enrollments
  FOR SELECT TO authenticated
  USING (event_id IN (SELECT public.current_couple_event_ids()));

-- ── event_vendor_payment_plan · host SELECT + host FOR ALL ──────────────────
-- Frozen per-booking vendor payment schedule (money-wall). A guest could
-- previously not only read it but DELETE it (the FOR ALL policy). Couple only.
-- (was: current_event_ids — 20270202160005)
DROP POLICY IF EXISTS event_vendor_payment_plan_host_select
  ON public.event_vendor_payment_plan;
CREATE POLICY event_vendor_payment_plan_host_select
  ON public.event_vendor_payment_plan FOR SELECT
  TO authenticated
  USING (
    event_id IN (SELECT public.current_couple_event_ids())
    OR public.is_admin()
  );

DROP POLICY IF EXISTS event_vendor_payment_plan_host_write
  ON public.event_vendor_payment_plan;
CREATE POLICY event_vendor_payment_plan_host_write
  ON public.event_vendor_payment_plan FOR ALL
  TO authenticated
  USING (
    event_id IN (SELECT public.current_couple_event_ids())
    OR public.is_admin()
  )
  WITH CHECK (
    event_id IN (SELECT public.current_couple_event_ids())
    OR public.is_admin()
  );

-- The table comment asserted "Host-scoped RLS via current_event_ids()." — now
-- couple-scoped. Fix the invariant claim in the same commit.
COMMENT ON TABLE public.event_vendor_payment_plan IS
  'Vendor Transaction Lifecycle Phase 2 PR-B — per-booking PAYMENT PLAN frozen at lock from the booked service''s vendor_service_payment_schedules template. instances_json = [{seq,label,amount_php,due_date,percent_bps?,amount_kind?}]; empty = no schedule (pay vendor directly). cleared_at/by set in PR-D. Couple-scoped RLS via current_couple_event_ids() (money-wall — re-scoped 20270831174208 off current_event_ids so guests can no longer read or delete it).';

-- ── budget_allocation_decisions · SELECT (+ DELETE companion) ───────────────
-- The table comment already says "Couple-own-only". It was not true: both the
-- SELECT read AND the DELETE (RA 10173 erase) were scoped on current_event_ids,
-- so a guest could read every budget snapshot AND erase them. Re-scope both to
-- couple-only to make the comment true. The INSERT policy is already
-- member_type='couple'-gated and is left untouched.
-- (was: current_event_ids — 20260824000000)
DROP POLICY IF EXISTS couple_reads_budget_allocation_decisions ON public.budget_allocation_decisions;
CREATE POLICY couple_reads_budget_allocation_decisions ON public.budget_allocation_decisions
  FOR SELECT TO authenticated
  USING (event_id IN (SELECT public.current_couple_event_ids()));

DROP POLICY IF EXISTS couple_deletes_budget_allocation_decisions ON public.budget_allocation_decisions;
CREATE POLICY couple_deletes_budget_allocation_decisions ON public.budget_allocation_decisions
  FOR DELETE TO authenticated
  USING (event_id IN (SELECT public.current_couple_event_ids()));

-- ── event_appointments · couple INSERT + couple UPDATE ──────────────────────
-- A guest could previously cancel/move the couple's vendor appointments. Day-of
-- ops belong to couple + coordinator. The couple READ policy is deliberately
-- LEFT on current_event_ids() — appointment visibility is benign event context
-- (like the schedule) and guests keep it. Only the writes are re-scoped.
-- (was: current_event_ids — 20270713200000)
DROP POLICY IF EXISTS event_appointments_couple_insert ON public.event_appointments;
CREATE POLICY event_appointments_couple_insert
  ON public.event_appointments FOR INSERT TO authenticated
  WITH CHECK (event_id IN (SELECT public.current_couple_or_coordinator_event_ids()));

DROP POLICY IF EXISTS event_appointments_couple_update ON public.event_appointments;
CREATE POLICY event_appointments_couple_update
  ON public.event_appointments FOR UPDATE TO authenticated
  USING (event_id IN (SELECT public.current_couple_or_coordinator_event_ids()))
  WITH CHECK (event_id IN (SELECT public.current_couple_or_coordinator_event_ids()));

-- ── guest_message_blocks · guest_message_blocks_manage (FOR ALL) ────────────
-- The Kwento harassment lever. Its USING already restricts moderation to
-- couple/coordinator (member_type gate), but its WITH CHECK was
-- `is_admin() OR event_id IN current_event_ids()` — and current_event_ids()
-- admits a plain guest. Because WITH CHECK (not USING) governs INSERT, ANY
-- authenticated guest could INSERT a block row over PostgREST (anon-key browser
-- client) and silence any other guest — bypassing the blockKwentoGuest server
-- action's own gate entirely. Tighten WITH CHECK to MIRROR the USING clause so
-- the DB is the real gate. (was WITH CHECK: current_event_ids — 20261113000972)
DROP POLICY IF EXISTS guest_message_blocks_manage ON public.guest_message_blocks;
CREATE POLICY guest_message_blocks_manage ON public.guest_message_blocks FOR ALL
  TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.event_members em
      WHERE em.event_id = guest_message_blocks.event_id
        AND em.user_id = auth.uid()
        AND em.member_type IN ('couple','coordinator')
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.event_members em
      WHERE em.event_id = guest_message_blocks.event_id
        AND em.user_id = auth.uid()
        AND em.member_type IN ('couple','coordinator')
    )
  );

-- ── patiktok_oauth_grants · re-scope the guest-readable OAuth SELECT ─────────
-- Same leak class as oauth_grants above: this table stores plaintext TikTok
-- access_token + refresh_token (both NOT NULL) and its SELECT policy
-- event_member_reads_oauth_grants was `USING (current_event_ids())` — so any
-- plain guest on the event could read the couple's TikTok refresh tokens. The
-- table is DORMANT today (gated behind unset TIKTOK_CLIENT_KEY/SECRET/REDIRECT
-- env, so no rows), which is the only reason it wasn't already exploited. Rename
-- the SELECT policy to a couple-scoped one (the old name was reused across two
-- tables — disambiguate it here). admin_writes_oauth_grants is left untouched.
-- (was: current_event_ids — 20270331200000)
DROP POLICY IF EXISTS event_member_reads_oauth_grants ON public.patiktok_oauth_grants;
DROP POLICY IF EXISTS couple_reads_patiktok_oauth_grants ON public.patiktok_oauth_grants;
CREATE POLICY couple_reads_patiktok_oauth_grants ON public.patiktok_oauth_grants
  FOR SELECT TO authenticated
  USING (event_id IN (SELECT public.current_couple_event_ids()));

-- ── Post-condition assert ───────────────────────────────────────────────────
-- Every re-scoped policy must (a) still exist and (b) no longer reference the
-- guest-admitting current_event_ids() helper in USING or WITH CHECK. The LIKE
-- pattern matches ONLY current_event_ids — current_couple_event_ids and
-- current_couple_or_coordinator_event_ids do not contain it as a substring.
-- (Mirrors the assert style in 20270828140000_papic_one_tiers.sql.)
DO $$
DECLARE
  r RECORD;
  v_bad INT;
BEGIN
  FOR r IN
    SELECT * FROM (VALUES
      ('oauth_grants',                'event_member_reads_oauth_grants'),
      ('guests',                      'event_member_can_read_guest'),
      ('orders',                      'orders_owner_read'),
      ('guest_face_enrollments',      'event_member_can_read_face_enrollment'),
      ('event_vendor_payment_plan',   'event_vendor_payment_plan_host_select'),
      ('event_vendor_payment_plan',   'event_vendor_payment_plan_host_write'),
      ('budget_allocation_decisions', 'couple_reads_budget_allocation_decisions'),
      ('budget_allocation_decisions', 'couple_deletes_budget_allocation_decisions'),
      ('event_appointments',          'event_appointments_couple_insert'),
      ('event_appointments',          'event_appointments_couple_update'),
      ('guest_message_blocks',        'guest_message_blocks_manage'),
      ('patiktok_oauth_grants',       'couple_reads_patiktok_oauth_grants')
    ) AS t(tbl, pol)
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public' AND tablename = r.tbl AND policyname = r.pol
    ) THEN
      RAISE EXCEPTION 'RLS guest-scope: policy %.% is missing after re-scope', r.tbl, r.pol;
    END IF;

    SELECT count(*) INTO v_bad
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = r.tbl
      AND policyname = r.pol
      AND (
        coalesce(qual, '')       LIKE '%current_event_ids%'
        OR coalesce(with_check, '') LIKE '%current_event_ids%'
      );
    IF v_bad > 0 THEN
      RAISE EXCEPTION 'RLS guest-scope: policy %.% still references current_event_ids()', r.tbl, r.pol;
    END IF;
  END LOOP;
END $$;


-- ---- 3. Discover REAL fixtures (no seeding of auth.users) --------------------
CREATE TEMP TABLE _fx ON COMMIT DROP AS
SELECT
  em.event_id AS couple_event,
  em.user_id  AS couple_user,
  (SELECT u.user_id FROM public.users u
     WHERE u.account_type <> 'admin'
       AND u.user_id <> em.user_id
       AND u.user_id NOT IN (SELECT user_id FROM public.event_members WHERE event_id = em.event_id)
     LIMIT 1) AS guest_user,
  (SELECT vp.user_id FROM public.vendor_profiles vp
     JOIN public.users u2 ON u2.user_id = vp.user_id
     WHERE u2.account_type <> 'admin' AND vp.tier_expires_at IS NULL
     LIMIT 1) AS vendor_owner
FROM public.event_members em
JOIN public.users cu ON cu.user_id = em.user_id AND cu.account_type <> 'admin'
WHERE em.member_type = 'couple'
LIMIT 1;

DO $chk$
DECLARE f record;
BEGIN
  SELECT * INTO f FROM _fx;
  IF f.couple_event IS NULL THEN RAISE EXCEPTION 'No non-admin couple event_member found — cannot test.'; END IF;
  IF f.guest_user   IS NULL THEN RAISE EXCEPTION 'No spare non-admin user to act as guest — cannot test S1.'; END IF;
  IF f.vendor_owner IS NULL THEN RAISE WARNING  'No non-admin vendor_profiles owner (tier_expires_at NULL) — S3 vendor check will be skipped.'; END IF;
END $chk$;

-- a throwaway oauth_grant + guest membership to make S1 visibility testable
INSERT INTO public.oauth_grants(event_id, provider, refresh_token)
  SELECT couple_event, 'youtube', 'TEST_TOKEN_ROLLED_BACK' FROM _fx;
INSERT INTO public.event_members(event_id, user_id, member_type)
  SELECT couple_event, guest_user, 'guest' FROM _fx
  ON CONFLICT (event_id, user_id) DO NOTHING;

CREATE TEMP TABLE _res(check_name text, pass boolean, detail text) ON COMMIT DROP;

-- ---- 4a. S1-RED: a GUEST must NOT see the couple's oauth_grants ---------------
DO $b$
DECLARE f record; n int;
BEGIN
  SELECT * INTO f FROM _fx;
  PERFORM set_config('request.jwt.claims', json_build_object('sub',f.guest_user,'role','authenticated')::text, true);
  SET LOCAL ROLE authenticated;
  SELECT count(*) INTO n FROM public.oauth_grants WHERE event_id = f.couple_event;
  RESET ROLE;
  INSERT INTO _res VALUES ('S1-RED  guest cannot read oauth_grants', n = 0, format('guest saw %s rows (want 0)', n));
END $b$;

-- ---- 4b. S1-GREEN: the COUPLE must still see their oauth_grants ---------------
DO $b$
DECLARE f record; n int;
BEGIN
  SELECT * INTO f FROM _fx;
  PERFORM set_config('request.jwt.claims', json_build_object('sub',f.couple_user,'role','authenticated')::text, true);
  SET LOCAL ROLE authenticated;
  SELECT count(*) INTO n FROM public.oauth_grants WHERE event_id = f.couple_event;
  RESET ROLE;
  INSERT INTO _res VALUES ('S1-GREEN couple can still read oauth_grants', n >= 1, format('couple saw %s rows (want >=1)', n));
END $b$;

-- ---- 4c. S3-RED: a COUPLE cannot self-grant setnayan_ai_active ---------------
DO $b$
DECLARE f record; blocked boolean := false;
BEGIN
  SELECT * INTO f FROM _fx;
  PERFORM set_config('request.jwt.claims', json_build_object('sub',f.couple_user,'role','authenticated')::text, true);
  SET LOCAL ROLE authenticated;
  BEGIN
    UPDATE public.events SET setnayan_ai_active = NOT setnayan_ai_active WHERE event_id = f.couple_event;
  EXCEPTION WHEN insufficient_privilege THEN blocked := true;
  END;
  RESET ROLE;
  INSERT INTO _res VALUES ('S3-RED  couple cannot self-grant setnayan_ai', blocked, CASE WHEN blocked THEN 'blocked as expected' ELSE 'PATCH was NOT blocked' END);
END $b$;

-- ---- 4d. S3-GREEN(ordinary): a COUPLE can still edit a non-guarded events col -
DO $b$
DECLARE f record; ok boolean := false;
BEGIN
  SELECT * INTO f FROM _fx;
  PERFORM set_config('request.jwt.claims', json_build_object('sub',f.couple_user,'role','authenticated')::text, true);
  SET LOCAL ROLE authenticated;
  BEGIN
    UPDATE public.events SET updated_at = now() WHERE event_id = f.couple_event;
    ok := true;
  EXCEPTION WHEN OTHERS THEN ok := false;
  END;
  RESET ROLE;
  INSERT INTO _res VALUES ('S3-GREEN couple can still edit non-guarded col', ok, CASE WHEN ok THEN 'ordinary edit allowed' ELSE 'ordinary edit WRONGLY blocked' END);
END $b$;

-- ---- 4e. S3-GREEN(service): the paid activation path still works --------------
DO $b$
DECLARE f record; ok boolean := false;
BEGIN
  SELECT * INTO f FROM _fx;
  SET LOCAL ROLE service_role;
  BEGIN
    UPDATE public.events SET setnayan_ai_active = true WHERE event_id = f.couple_event;
    ok := true;
  EXCEPTION WHEN OTHERS THEN ok := false;
  END;
  RESET ROLE;
  INSERT INTO _res VALUES ('S3-GREEN service_role CAN set setnayan_ai', ok, CASE WHEN ok THEN 'activation path works' ELSE 'activation path WRONGLY blocked' END);
END $b$;

-- ---- 4f. S3-RED(vendor): a VENDOR cannot self-set tier_expires_at ------------
DO $b$
DECLARE f record; blocked boolean := false;
BEGIN
  SELECT * INTO f FROM _fx;
  IF f.vendor_owner IS NULL THEN
    INSERT INTO _res VALUES ('S3-RED  vendor cannot self-set tier', NULL, 'skipped — no fixture'); RETURN;
  END IF;
  PERFORM set_config('request.jwt.claims', json_build_object('sub',f.vendor_owner,'role','authenticated')::text, true);
  SET LOCAL ROLE authenticated;
  BEGIN
    UPDATE public.vendor_profiles SET tier_expires_at = now() WHERE user_id = f.vendor_owner;
  EXCEPTION WHEN insufficient_privilege THEN blocked := true;
  END;
  RESET ROLE;
  INSERT INTO _res VALUES ('S3-RED  vendor cannot self-set tier', blocked, CASE WHEN blocked THEN 'blocked as expected' ELSE 'self-set was NOT blocked' END);
END $b$;

-- ---- 4g. S3-GREEN(vendor/service): admin path can set vendor tier ------------
DO $b$
DECLARE f record; ok boolean := false;
BEGIN
  SELECT * INTO f FROM _fx;
  IF f.vendor_owner IS NULL THEN
    INSERT INTO _res VALUES ('S3-GREEN service_role CAN set vendor tier', NULL, 'skipped — no fixture'); RETURN;
  END IF;
  SET LOCAL ROLE service_role;
  BEGIN
    UPDATE public.vendor_profiles SET tier_expires_at = now() WHERE user_id = f.vendor_owner;
    ok := true;
  EXCEPTION WHEN OTHERS THEN ok := false;
  END;
  RESET ROLE;
  INSERT INTO _res VALUES ('S3-GREEN service_role CAN set vendor tier', ok, CASE WHEN ok THEN 'admin/service path works' ELSE 'admin/service path WRONGLY blocked' END);
END $b$;

-- ---- 5. RESULT GRID (read this) then throw everything away -------------------
SELECT
  CASE WHEN pass IS NULL THEN '— SKIP' WHEN pass THEN '✅ PASS' ELSE '❌ FAIL' END AS result,
  check_name,
  detail
FROM _res
ORDER BY check_name;

ROLLBACK;
