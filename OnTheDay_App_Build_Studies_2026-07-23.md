> **Provenance:** six parallel build studies, 2026-07-23 — five via a study workflow + build ⑥ via a dedicated agent, ALL grounded against a fresh `origin/main` fetch (the local seo-geo worktree is ~112 migrations stale — its refs were NOT trusted). Owner green-light: "turn them on — study the builds" (DECISION_LOG 2026-07-23). Consolidated sign-off list in § 6.2 + build ⑥'s own questions at the end; the QR-rotation authority question blocks build ④.

# On-the-Day App — Five Build Studies (2026-07-23)

> Scribe record of five parallel build studies for the on-the-day guest/host program. All code refs = `origin/main` (fetched 2026-07-23, HEAD `cd6b75416`); the local `setnayan-wt-seo-geo` worktree predates all of this — do not trust it. Standing rules that govern every build below: **migrations AUTO-APPLY on merge** (memory `project_setnayan_migrations_autoapply`) — every schema PR ships INERT and every go-live hold is a flag/env/`is_active` shipped OFF, never "hold the push"; and `app/[slug]/page.tsx` is the repo's hottest file (~7 WIP worktrees + the open-browse 11-PR council plan, `Guest_Event_Website_Open_Browse_Council_Verdict_2026-07-22.md`). Owner sign-off list consolidated in § 6.2 — **the QR-rotation authority question is first and blocks Build ④.**

---

## § 0 · Program summary — five builds, ranked by risk

| Rank | Build | Size | Risk | Verdict in one line | Go-live hold |
|---|---|---|---|---|---|
| 1 🔴 | **② Chibi Avatar** (Me-tab builder + venue walk) | 7 PRs · ~2–3 wks | **HIGH** | Really TWO builds stacked: the owner-locked whole-character rig swap (the real cost, phone-budget-gated) + a thin product layer (`guests.avatar_config` + maker + `public_venue_scene` v8). Geometry recipes exist verbatim in the corpus prototypes. ⚠ Stale-doc trap: memory's "fix joints by OVERLAP" was owner-retired 2026-07-21. | `NEXT_PUBLIC_FIGURE_CHIBI` + `NEXT_PUBLIC_GUEST_AVATAR_MAKER`, both off |
| 2 🟠 | **③ Papic Pool Bar** (live meter + Top up + Add-a-camera) | 5 PRs · ~1 wk | **MED-HIGH** | ~90% of the machinery is shipped (ledger, anon pool reader, `PAPIC_GUEST_TOPUP` seeded inactive, per-camera grants, EXACT_HOOKS + reversal). The killer is latency: apply-then-pay is human-speed, the pool drains at reception-speed → bounded trust-first provisional grants. Maya cannot rescue this (sandbox-gated, no paid webhook). | env `NEXT_PUBLIC_PAPIC_POOL_BAR` + `PAPIC_GUEST_TOPUP is_active` flip (last) + `trust_topup_max_open=0` DB kill switch |
| 3 🟡 | **④ Guest QR Token Rotation** (verdict § 5.11) | 6 PRs · ~1 wk | **MED** | A naked rotation primitive already ships (`reissueGuestToken`) and every QR artifact renders on-demand from the current token — DB-side rotation is already clean. The real work: the 60-day guest-session JWT is never re-validated against the DB (leaked-QR sessions survive rotation), plus day-of bricking guards. | `GUEST_SESSION_TOKEN_CHECK` + `GUEST_QR_SELF_ROTATE`, off |
| 4 🟢 | **① Guest Columns** (zero-account op-eds → Story + editorial) | 4–5 PRs · ~3–4 d | **LOW-MED** | Near-clone of Kwento (`photo_messages`), which already solved every hard part: service-role-only submit RPC, Tier-1 sync text moderation, couple-review status machine, fail-closed editorial read. Riskiest part is render-PR contention on `app/[slug]/page.tsx`. | `GUEST_COLUMNS_ENABLED`, off |
| 5 🟢 | **⑤ Run-of-Show Trigger** ("Happening Now" → guest Now panel) | 4 PRs · ~2–3 d | **LOW** | ~70% already shipped and **LIVE, not flag-dark** (memory note on #3412 is stale): `run_state` on `event_schedule_blocks`, single-winner `advance_schedule_block()`, Realtime publication, `RunOfShowHeader` on 3 surfaces. Missing: guest surfaces still infer "now" from the wall clock; delegate coordinators see the button but 403; no jump/rewind; no estimated-vs-live labels. | `NEXT_PUBLIC_GUEST_NOW_TRIGGER` (guest read only), off |

**Cheapest wins first by effort-to-payoff:** ⑤ then ①. **Highest leverage on the day itself:** ③ and ⑤. **Security debt being paid:** ④. **Longest pole:** ② — start its rig PRs early, they run flag-dark in parallel with everything else. Full collision map + sequencing in § 6.1.

---

## § 1 · BUILD ① — Guest Columns

Zero-account guest op-eds with couple approval, publishing into the Story tab + the editorial ("the paper").

### 1.1 Verdict

Near-clone of Kwento (`photo_messages`), which already solved every hard part: zero-account text submission via a service-role-only SECURITY DEFINER RPC, Tier-1 synchronous text moderation (`moderateKwentoText`), couple-review status machine with CHECK interlocks, edit-resets-moderation upsert, and a fail-closed editorial read (`status='approved' AND moderation_state='clean'`). Build = one inert migration (table + 2 guest RPCs + RLS) + a guest form + a review queue cloned from `kwento-queue` + two render blocks (Story-tab section, new reorderable editorial section key — the registry appends unknown keys safely). **4 PRs, ~3–4 days.** Riskiest part: the render PRs collide with the open-browse rebuild of `app/[slug]/page.tsx` (council PR1–3 restructure exactly the lines we'd touch) — sequence render PRs after the extraction PRs or land them as `_components`-only additions.

### 1.2 Grounding

- Guest identity = signed JWT cookie `{guest_id, event_id, qr_token}`, never `auth.uid`: `apps/web/lib/guest-session.ts:4-49` (`COOKIE_NAME 'setnayan_guest_session'`; `readGuestSession` validates all 3 fields).
- Anon-granted SECURITY DEFINER precedent: `papic_record_guest_capture` — `supabase/migrations/20260718000000_papic_guest_seats_provisioning.sql:322-391` (SET `search_path=public`, resolves event via `guests WHERE deleted_at IS NULL`, `pg_advisory_xact_lock` per guest, GRANT to authenticated + anon).
- **The closer precedent** — Kwento is guest TEXT ≤280 with couple review: `supabase/migrations/20261113000972_kwento_p0_photo_messages.sql:29-66` — `photo_messages(body_text CHECK 1..280, status CHECK pending/approved/rejected/user_deleted, moderation_state CHECK unscreened/clean/flagged/blocked, UNIQUE(source_table,source_id,guest_id), CHECK approved_needs_screen, consent_captured_at NOT NULL)`.
- Kwento RPC is service-role-ONLY (tighter than papic): `20261113000972:359-360` REVOKE ALL FROM PUBLIC, anon, authenticated — route validates the cookie then calls via `createAdminClient`; upsert with edit-resets-moderation + advisory lock + burst guard at `:152-250`.
- Kwento submit route: `apps/web/app/api/papic/kwento/route.ts:1-60` — `readGuestSession` → entitlement gates → Tier-1 `moderateKwentoText` SYNCHRONOUSLY before the RPC (`blocked` never stored; `flagged` stores couple-only); `moderateKwentoText` at `apps/web/lib/kwento-moderation.ts:84`.
- NSFW `after()` screening is IMAGE-only (nsfwjs): `apps/web/lib/nsfw-screen.ts:368-401`, fired from `after()` at `apps/web/app/vendor-dashboard/clients/[eventId]/editorial-media/actions.ts:104-107` — NOT needed for text; Tier-1 sync moderation is the text path.
- Couple-approval RLS canon: `photo_messages_member_read` + `photo_messages_moderate` (`20261113000972:78-114`) — `is_admin()` OR `event_members member_type IN ('couple','coordinator')`; **NO INSERT policy** (guest authoring goes ONLY through the service-role submit RPC); same shape in `pabati_clips` (`20270214296222:96-120`) and `editorial_vendor_media` (`20270102000000:95-105`).
- Couple review actions ride RLS, no RPC: `apps/web/app/dashboard/[eventId]/studio/papic/moderation/actions.ts:272-307` `approveKwento/rejectKwento` = plain `.update()` with `.eq('status','pending')` guard; ⚠ `requireCouple` at `:54-67` gates `member_type === 'couple'` ONLY while the RLS admits coordinator — **live inconsistency to resolve for columns.**
- Editorial public read is admin-client + fail-closed: `apps/web/app/[slug]/_components/editorial/data.ts:1756-1766` — `.eq('status','approved').eq('moderation_state','clean').eq('author_publicly_hidden',false).limit(EDITORIAL_KWENTO_CAP=8)`; guest names resolved separately from `guests(display_name,first_name,last_name)` at `:1770-1789`.
- Editorial section registry appends unknown keys safely: `apps/web/app/[slug]/_components/editorial/editorial-order.ts:20,33-39` ("a new key added later never drops a section").
- Render points: `EditorialContent` at `app/[slug]/page.tsx:1994` and `:2714` (duplicated body trees — council PR3 merges them); `OurStory` at `:2161-2164` and `:3133-3136`; council verdict § 1.1 puts guest columns' home in the Story tab.
- Per-guest block lever reusable: `guest_message_blocks UNIQUE(event_id,guest_id)` at `20261113000972:117-126`.
- RA 10173 consent precedent: `photo_messages.consent_captured_at NOT NULL` stamped `NOW()` by the RPC (`20261113000972:53,222`); public-share consent threading in `20270215631984_guest_capture_public_consent.sql:28-45`.
- `photo_messages` and `pabati_clips` both SKIP `public_id` — `guest_columns` can too; `guest_id ON DELETE CASCADE` (`20261113000972:35`) is the erasure-friendly choice for authored text.

### 1.3 Schema sketch (ONE migration, fully inert)

```sql
CREATE TABLE IF NOT EXISTS public.guest_columns (
  id BIGSERIAL PRIMARY KEY,
  column_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES public.guests(guest_id) ON DELETE CASCADE, -- erasure-friendly, mirrors photo_messages
  title TEXT NOT NULL CHECK (char_length(trim(title)) BETWEEN 1 AND 60),
  body_text TEXT NOT NULL CHECK (char_length(trim(body_text)) BETWEEN 1 AND 280),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','declined','withdrawn')),
  decline_note TEXT CHECK (decline_note IS NULL OR char_length(decline_note) <= 200),
  moderation_state TEXT NOT NULL DEFAULT 'unscreened' CHECK (moderation_state IN ('unscreened','clean','flagged','blocked')),
  moderation_labels JSONB,
  consent_captured_at TIMESTAMPTZ NOT NULL,           -- RA 10173: stamped NOW() by the RPC
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  edited_at TIMESTAMPTZ, edit_count INTEGER NOT NULL DEFAULT 0 CHECK (edit_count <= 5),
  reviewed_at TIMESTAMPTZ, reviewed_by_user_id UUID REFERENCES auth.users(id),
  withdrawn_at TIMESTAMPTZ, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_guest_columns_author UNIQUE (event_id, guest_id),  -- one-per-guest; edit/resubmit = UPDATE same row
  CONSTRAINT gcol_approved_needs_screen CHECK (status <> 'approved' OR moderation_state IN ('clean','flagged'))
);
CREATE INDEX guest_columns_queue_idx ON public.guest_columns (event_id, status, submitted_at DESC);
-- No public_id column (photo_messages/pabati_clips precedent).
```

- **RLS at CREATE TABLE time** — verbatim `photo_messages` shape (`20261113000972:78-114`): `guest_columns_member_read` (SELECT to authenticated: `is_admin()` OR couple/coordinator `event_members` OR `status='approved' AND event_id IN current_event_ids()`) + `guest_columns_moderate` (UPDATE, same admits). **NO INSERT policy, NO anon policy** — guest writes go ONLY through the RPC; public/anonymous renders read via the admin client (data.ts:1756 pattern). Event resolution happens INSIDE the RPC (`SELECT event_id FROM guests WHERE guest_id=… AND deleted_at IS NULL`) — the shipped canon.
- **RPC `guest_submit_column(p_guest_id, p_title, p_body, p_moderation_state, p_moderation_labels)`** — SECURITY DEFINER, `search_path=public`, mirrors `submit_photo_message` (`20261113000972:152-250`): assert `p_moderation_state IN ('clean','flagged')`; resolve event else `gcol:unknown_guest`; reuse `guest_message_blocks` (`gcol:blocked`); `pg_advisory_xact_lock(hashtextextended('gcol:'||p_guest_id::text,0))`; upsert on `UNIQUE(event_id,guest_id)` — no row → INSERT pending + `consent_captured_at NOW()`; existing → EDIT-UNTIL-APPROVED: `status='approved'` → RAISE `gcol:already_published` (withdraw first); `edit_count>=5` → `gcol:edit_limit`; else UPDATE title/body, reset review fields, `edit_count+1` — declined/withdrawn rows revive through this same path, which IS the "decline returns it to the guest" loop. REVOKE ALL FROM PUBLIC, anon, authenticated (service-role-only — kwento's tighter variant, correct because the write carries authored PII).
- **RPC `guest_withdraw_column(p_guest_id)`** — service-role-only: sets `status='withdrawn'`, works pre- AND post-approval (RA 10173 self-serve takedown; instantly drops from both renders since they filter `status='approved'`).
- **Couple review: NO RPC** — authenticated server action `.update()` riding `guest_columns_moderate` with `.eq('status','pending')` guard (moderation/actions.ts:272-307 precedent); `gcol_approved_needs_screen` is the DB backstop.
- Optional same-migration: `guest_column_submitted` / `guest_column_reviewed` notification types (`20270129155743` precedent) for the debounced couple email (kwento `STORY_NOTIFY_DEBOUNCE_MS`, route.ts:33-35).

### 1.4 UI surfaces

- Guest submit — new `app/[slug]/_components/guest-column-card.tsx` in the Story tab (council § 1.1), cookie-holding guests only; states: compose (60+280 counters + RA 10173 consent line) / pending + Edit + Withdraw / declined + `decline_note` + resubmit / approved + Withdraw. Server actions: session → `moderateKwentoText` (blocked rejected inline, never stored) → `admin.rpc('guest_submit_column')`. Behind `GUEST_COLUMNS_ENABLED`.
- Couple review queue — clone `kwento-queue.tsx` (Papic moderation surface, or a "Guest columns" card in `/dashboard/[eventId]/website` per the manager-mirror direction); flagged rows badged (`flagged` can still be approved — couple judgment, same as kwento).
- Story-tab public render — new section near `OurStory` (`page.tsx:2161-2164` / `:3133-3136`; post council-PR3 = ONE `SiteBody`): admin-client read `approved+clean`, bylines from `guests` (data.ts:1770-1789 pattern); renders for ALL identity tiers (couple-published content — needs the DPO carve-out, § 1.6).
- Editorial — new key `guestColumns` in `EditorialSectionKey` + `DEFAULT_SECTION_ORDER` (`editorial-order.ts:20-39`), `GuestColumn[]` load beside `kwentoQuotes` (cap ~6), "Letters to the Editor" block beside "What They Whispered".
- Couple notification — `emitNotification('guest_column_submitted')` in `after()`, debounced per event.

### 1.5 PR plan

1. **PR1 — migration only, INERT** (zero readers): table + RLS + both RPCs + REVOKEs + notification types. Idempotent. Rollback: additive, leave in place.
2. **PR2 — guest write path** behind `GUEST_COLUMNS_ENABLED` (off): card + actions + withdraw + changelog fragment. Touches `app/[slug]/` minimally (one import) — coordinate with open-browse PR1–3; if in flight, land the component file first, the page-import line after their extraction PR. Rollback: flag off = zero behavior.
3. **PR3 — couple review queue + actions** (RLS-riding updates, decline_note, flagged badge) + debounced couple email. Flag-independent (queue empty until guests submit). Rollback: revert; no schema.
4. **PR4 — publish surfaces**: Story-tab section + editorial `guestColumns` key/load/block, both admin-client `approved+clean`, both behind the same flag. Gate: golden-snapshot the editorial with/without the section (council CI check). Rollback: flag off.
5. **PR5 — flag flip** after owner copy sign-off + DPO line on consent text. Vercel env change, not a deploy.

### 1.6 Risks

- `app/[slug]/page.tsx` contention: council PR1-extraction/PR3-one-body-tree restructure the exact render area; today the section must be added **TWICE** (`:1994`-vicinity and `:2714`-vicinity) or it silently misses one identity tier.
- **RA 10173**: an approved column is guest-authored PII (name + words) rendered to the ANONYMOUS public tier — the council's zero-guest-bytes CI check (§ 1.2) will fail unless guest columns are explicitly allow-listed as couple-published content; needs a deliberate carve-out + DPO note, not an accidental exception.
- Consent wording is load-bearing: `consent_captured_at NOT NULL` means no submit without the tick; if the editorial is also PRINTED (kwento has a SEPARATE `print_consent` bool) decide now — retrofit is a migration.
- Tier-1 moderation is wordlist, not semantic — a hostile 280-char column can pass "clean"; the couple approval gate is the real filter, which is why auto-publish-on-clean (the `editorial_vendor_media` model) must NOT be borrowed here.
- Coordinator inconsistency is live precedent (kwento RLS admits coordinator, `requireCouple` blocks them); memory lock says coordinator = propose-not-execute.
- Upsert race: advisory lock mandatory (kwento `:199`), UNIQUE constraint = backstop (23505 → friendly error).
- Guest-deletion CASCADE erases an approved column out of a published editorial mid-view — correct for erasure; editorial render already tolerates row-count changes; don't cache columns in `draft_json`.

### 1.7 Open owner questions → § 6.2, items 2–8.

---

## § 2 · BUILD ② — Chibi Avatar

Me-tab builder + 3D venue walk render.

### 2.1 Verdict

Buildable with high reuse, but it is really **TWO builds stacked**: (1) the chibi rig itself — an owner-locked whole-character-system swap (`kit/chibi-figure.tsx` replacing the blob across homepage demo, couple lab, guest walk, instanced crowd, shared-room walkers) whose geometry recipes already exist verbatim in the corpus prototypes; and (2) the thin product layer — `guests.avatar_config` JSONB, a Me-tab/venue-sheet maker, a `public_venue_scene` v8 reader. The product layer is small (write path clones `submitRsvp`'s session-verified action; reader clones the v7 photos gate); **the rig is the real cost and the real risk**, gated by two mechanical merge gates the spec already defines (no-exposed-cap geometry test, pixel-identity bake test) and a batch budget that grows ~21→~30 instanced draws for the whole room — per-guest COLOR is free (`instanceColor`) but each distinct part SHAPE is one more batch, which is exactly why whole-figure merging is forbidden. **🔴 Stale-doc trap to surface to every builder: the memory's "fix joints by OVERLAP" phrasing was owner-corrected 2026-07-21 to "author integral part geometry" (rig spec § 11)** — following the memory verbatim implements the rejected draft. Everything ships flag-dark; the migration is inert on merge.

### 2.2 Grounding

- Today's guest render — `GuestPhotoAvatar` is a billboarded photo-disc/initials token, NOT a body: `apps/web/app/_components/plan3d/guest-avatar.tsx:215-252` (disc + ring), `initialsFromName :159-164`, refcounted texture cache `:44-122`, `preloadGuestPhotos :109-122`; only sanctioned to read `guests.photo_url` (privacy note `:11-14`).
- Venue mount — `/[slug]/venue/page.tsx:28-32` calls SECURITY DEFINER `public_venue_scene(p_slug, p_token)` via `createAdminClient` (identity = `?t=` qr_token), resolves `r2://` refs `:46-57`, renders `<GuestVenueLoader>` `:140`; loader dynamic-imports the WebGL scene `ssr:false` (`guest-venue-loader.tsx:12-23`).
- Crowd batching — anonymous seated strangers collapse to ONE room-level `<InstancedSeatedCrowd quality="low">` (`guest-venue-3d.tsx:942`); `crowdSeats` built `:639-666` with `color:null`; `GuestTable` early-returns `if (!mine && !photoUrl) return null` `:248` so only viewer's seat + photo seats mount individual `<SeatedFigure>` `:250-266`. Comment `:634`: ~22 draws + zero per-figure useFrame vs 14×N unbatched.
- Batch mechanics — `instanced-seated-crowd.tsx`: one InstancedMesh PER PART over 21 baked parts (`SIT_PART_KEYS`, `lib/figure-sit-bake.ts:159-183`) + optional ring batch `:233-244`; per-instance matrix `:185`; per-guest COLOR free via `setColorAt`/`instanceColor` over white material `:186,:230` (pixel-identity proven per `lib/figure-sit-bake.test.ts` header `:14-21`). Per-guest GEOMETRY variation = one new InstancedMesh per distinct buffer — whole-figure merging → N look-combos → N unbatchable geometries.
- Current figure — `kit/figure.tsx` is the 2026-07-09 blob (owner-superseded): ~21 meshes from module-scope shared buffers `:124-159`; photoUrl replaces the head `:35-42`; `SeatedFigure/WalkingFigure` `:649-655`. `lib/figure-rig.ts` already carries the DORMANT look system: `SKIN_TONES :83`, `HAIR_COLORS :94`, `HAIR_STYLE_COUNT=6 :102`, `resolveFigureLook` id-hash defaults `:140-151` — **re-activate, don't re-invent** (rig spec § 3).
- Shared-room walkers — `plan3d-remote-players.tsx:38-53` mounts one walking `<Figure>` per remote peer; flag `NEXT_PUBLIC_PLAN3D_SHARED_ROOM` at `use-plan3d-room.ts:40`. Chibi config must reach this surface (peers see YOUR chibi walk).
- Corpus prototypes — `3D_Avatar_Maker_2026-07-19/chibi_studio_prototype.html` (758 lines) = geometry contract: `closedLathe :176`, 6 `SKIN_TONES :119`, EYES/MOUTHS/MARKS ×4 `:133-135`, `buildFace` always-on nose at skin×0.88 `:188-192`, per-outfit lathe recipes `:337-439`, colorMode `:705-708`. `avatar_maker_one_chibi_2026-07-21.html` (658 lines) = maker UX contract: ONE figure on a turntable, Body/Face/Hair/Outfit/Colour tabs `:28-31,:56-57`, AUTO palette colours `:108-114`. All vanilla THREE — ports directly, nothing external.
- 🔴 **Hard-constraint correction** — Chibi_Rig_Production_Spec § 11 (owner 2026-07-21) explicitly retires the overlap law: "THE FIX IS TO CHANGE THE GEOMETRY, NOT TO OVERLAP PARTS" (spec `:113-117`); body+arms+legs = ONE authored buffer per outfit (`:121-124`), head separate for the idle tilt. The surviving invariant: **never merge whole-figure look-combinations** (bodyType×outfit×hair×colour explodes batches `:115`). Merge gate = no-exposed-cap unit test (§ 11.2 `:142-150`). **Faces ARE in** (§ 10 `:97`: nose always-on, eyes×4, mouths×4, marks×4; selfie disc demoted to an option). Crowd budget re-cost: ~30 batches/room regardless of guest count (§ 6 `:71`). Placement-audit rules inherit in PR-1 (`Chibi_Placement_Audit_Verdict_2026-07-21.md § 4`: seat parts on the ellipsoid, builder clamps, accessories at HAIR radius).
- Guest write pattern — shipped guest-site precedent is the session-verified server action: `app/[slug]/actions.ts submitRsvp` — `readGuestSession()` guard `:91-101` then `createAdminClient` write `:116-131` incl. selfie `photo_url` `:185-193`. Anon-API precedent: `papic_record_guest_capture` (`20260718000000:322-391`). New-column precedent: `guests.photo_url/photo_source/photo_updated_at` + CHECK + COMMENT (`20260831000000_iteration_0001_guest_photos.sql:22-42`).
- Reader gate precedent — `public_venue_scene` at v7 (`20270718464682`); per-seat photos token-gated + `venue_photo_visibility 'none'|'table'|'all'` (`:46,:133-190`); tokenless public NEVER gets photos `:158`. Avatars payload rides the same RPC as a v8 key.
- CSP / no external assets — `next.config.ts:120-123` (frame CSP only, full CSP deferred `:92-97`), `images.remotePatterns` tight whitelist `:21-85`; corpus lock stands (RPM dead, CC0 breaks CSP). Chibi = 100% procedural THREE geometry — satisfies the constraint by construction.
- Me tab does not exist in code — it is council verdict § 1.1 (`:25` "Me / Your Invite"), shipping as `SiteMenuBar` behind `NEXT_PUBLIC_WEBSITE_MENU_ENABLED` (open-browse PR6, grown from `guest-hub-bar.tsx`). The rig spec's own guest entry is the 3-tap sheet on `/[slug]/venue` (§ 11.4 `:164-166`) — same maker subset, same record, **does not wait for the Me tab**.

### 2.3 Schema sketch

```sql
-- PR-4 (inert, zero readers at merge):
ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS avatar_config JSONB,
  ADD COLUMN IF NOT EXISTS avatar_updated_at TIMESTAMPTZ;
DO $$ BEGIN
  ALTER TABLE public.guests ADD CONSTRAINT guests_avatar_config_size_check
    CHECK (avatar_config IS NULL OR pg_column_size(avatar_config) <= 2048);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
COMMENT ON COLUMN public.guests.avatar_config IS
  'Guest-chosen chibi parts {v, bodyType, skinTone, hairStyle, hairColor, eyes, mouth, mark,
   outfit, outfitColor, accessory, colorMode}. NULL -> hash-derived defaults (resolveFigureLook).
   Written ONLY via the session-verified guest server action; every key sanitized against
   lib/avatar-catalog whitelist server-side.';
-- guests RLS untouched (guests never authenticate; couple event-scoped read covers the dashboard).
```

- **Write path — no new RLS, no direct anon write.** `guestSetAvatarAction` in `app/[slug]/actions.ts` following `submitRsvp` exactly (`:91-101` + `:116-131`), catalog sanitizer rejects unknown keys/values, clamps hex colours. (Alternative anon RPC `guest_set_avatar_config(p_guest_id, p_qr_token, p_config)` mirroring `papic_record_guest_capture` only if an API route must POST — do not build both; the server action is the house pattern.)
- **PR-6 reader**: `public_venue_scene` **v8** (next in the hot `20270718*` series — coordinate): adds `avatars: [{table, seatNumber, config}]` built like the v7 photos block (`:160-190`), + `youAvatar` for the token holder. **Gating (owner Q § 6.2 item 10): default = photos-gate parity** (token holder + `venue_photo_visibility 'table'/'all'`; tokenless NEVER, `:158`) — conservative RA 10173 posture; widening to "all visitors" is a one-liner plus possibly `events.venue_avatar_visibility` — decide before PR-6.
- RA 10173 rides the column: joins guest-data export + erasure (lives on `guests` → event-scoped deletion cascades); guest-initiated reset = `avatar_config: null` (withdrawFaceConsent precedent, `actions.ts:394`). **bodyType is COSMETIC — never read from/written to/inferred from `users.sex`** (rig spec § 3 `:46`).
- NOT in this build: `users.avatar_parts` (account-level, rig spec § 3/§ 11.4). Guests are zero-account → `guests.avatar_config` is the store of record; copy → `users.avatar_parts` on account claim (`claimAccountAction`, `actions.ts:76`) is a later PR. Surface the spec divergence rather than silently building a column a guest can never reach.

### 2.4 UI surfaces

- NEW kit: `kit/chibi-figure.tsx` (integral geometry per § 11, ports closedLathe/buildFace/buildHair/outfit lathes; watertight + no-exposed-cap tests land here) · `kit/chibi-crowd` extension of `instanced-seated-crowd.tsx` (part-batched: head+ears, 8 hair buffers, body-per-outfit, face-part buffers, ~30 batches/room) · `lib/avatar-catalog.ts` (THE one whitelist: part ids, colour tables, sanitizer — shared by maker client, server action, 3D reader) · `figure-sit-bake.ts` extension for per-(part×outfit×hair) baked locals + extended pixel-identity test (PR-3 merge gate).
- NEW maker: `app/[slug]/_components/avatar-maker.tsx` — client sheet, dynamic `ssr:false`, ONE turntable chibi + 5 tab panels per the prototype; debounced persist, no commit button (§ 11.4). Two doorways, one record: Me-tab slot (council SiteMenuBar, dep on open-browse PR6) + the 3-tap subset sheet on `/[slug]/venue` (§ 11.4 — ships without the Me tab).
- TOUCHED: `guest-venue-3d.tsx` (`crowdSeats :639-666` gains per-seat config; `GuestTable :230-275` self/photo seats render individual chibi, photo disc still replaces the head) · `venue/page.tsx:28-57` (v8 passthrough — plain JSON, no ref resolution) · `plan3d-remote-players.tsx:38-53` (walkers broadcast + wear config via presence payload) · `[slug]/actions.ts` (set + reset actions) · `kit/figure.tsx` + `lib/figure-rig.ts` (catalog extension, flag switch) · `seating-lab-3d.tsx` + `plan3d-scene.tsx` (couple lab + homepage demo swap on the same flag).
- Flags: `NEXT_PUBLIC_FIGURE_CHIBI` (rig swap) · `NEXT_PUBLIC_GUEST_AVATAR_MAKER` (doorways + reader), both default off, both client-safe booleans (`PLAN3D_SHARED_ROOM` pattern, `use-plan3d-room.ts:40`).

### 2.5 PR plan

1. **PR-1 · kit chibi figure** (flag off; homepage demo flag-on only). Integral part geometry per § 11 — NOT the superseded overlap draft; faces in; placement-audit invariants baked. Gates: watertight + no-exposed-cap tests. Rollback: flag off, zero shipped change.
2. **PR-2 · poses** on the reduced joint set (head + body-lean for crowd; waddle/sit/dance as figure-rig clips; staff idles → pose-variant geometry, § 11.1). Rollback: flag off.
3. **PR-3 · part-batched instanced crowd** — per-(part×outfit×hair) buffers + `instanceColor` tints; extended pixel-identity bake test = MERGE GATE; **verify ~30-batch budget on a 250-pax scene on a phone before merge** (the blob crowd exists because 3.2k draws killed phones). Rollback: flag off restores blob path byte-identically.
4. **PR-4 · schema, inert** — columns + size CHECK + COMMENT + `lib/avatar-catalog.ts` sanitizer with unit tests. Safe under auto-apply. Rollback: column sits unused.
5. **PR-5 · maker + write path** (maker flag off) — sheet, `guestSetAvatarAction` cloning submitRsvp's guard, reset action, venue 3-tap doorway. Me-tab slot wired only if/when open-browse PR6 exists — the venue doorway alone ships the feature. Rollback: flag off.
6. **PR-6 · reader swap** — `public_venue_scene` v8 in the SAME PR as its flag-dark consumer (`guest-venue-3d` threads configs into crowd + individual seats + remote presence). Behind BOTH flags; null config → hash-default chibi → today's silhouette parity. Gates: v8 byte-identical minus new keys for old clients; anonymous/tokenless response contains **zero avatar bytes** (council CI pattern). Rollback: flags off; v8 keys unread.
7. **PR-7 · default flips + blob deletion** (no Classic fallback, owner confirm) after § 9 sign-offs (scale-vs-furniture, accessories-free, hair colours, visibility gate). Rollback pre-deletion: flip flags; post: revert commit.

### 2.6 Risks

- 🔴 **Stale-doc trap** (highest process risk): memory + briefs say "fix joints by OVERLAP, never merging" — owner-corrected 2026-07-21 (spec § 11 `:113-117`); the shared invariant (never merge whole-figure look-combos) is intact, but an implementer following the memory verbatim rebuilds the rejected design.
- Batch-budget regression on phones: ~21 → ~30+ draws, and V4 faces add per-style buffers the § 6 count predates — re-count in PR-3; if it creeps past ~40, style-bucket face relief into head buffers or drop face relief from LOW crowd only. The 250-pax phone test is the merge gate, not a nice-to-have.
- `public_venue_scene` is the hottest RPC in the migration series (v5→v7 in one week) and ~7 WIP worktrees exist — a v8 authored stale can silently clobber a concurrent v-bump; rebase against `origin/main` immediately before merging PR-6.
- Scope coupling: Me-tab home depends on open-browse PR6 (`NEXT_PUBLIC_WEBSITE_MENU_ENABLED`), itself sequenced behind privacy hardening — treat the Me-tab slot as an add-on doorway, never the critical path (the § 11.4 venue sheet decouples).
- Privacy: `avatar_config` is guest-authored personal data on a zero-account subject — export/erasure + a conscious room-visibility default (photos-gate parity recommended); the bodyType↔`users.sex` firewall must survive review on every PR touching both.
- The rig swap replaces the character on surfaces OUTSIDE this brief (homepage demo, couple lab, booth staff) — PR-1..3 regressions surface on marketing pages; pixel-identity + golden-scene tests keep those honest while the flag is dark.

### 2.7 Open owner questions → § 6.2, items 9–14.

---

## § 3 · BUILD ③ — Host Papic Pool Bar

Live pool meter + one-tap Top up + Add-a-camera on the guest site.

### 3.1 Verdict

Almost everything already exists on `origin/main`: the one-pool ledger (`papic_event_point_grants`), an anon-callable SECURITY DEFINER pool reader (`papic_event_pool_status`), catalog-driven Top up (`PAPIC_GUEST_TOPUP`, ₱2,999/+10,000 pts, seeded `is_active=FALSE`), per-camera Papic One (`PAPIC_CAMERAS` order → mini seats at order-creation → `papic_grant_camera_points` 250 pts/camera), all wired through EXACT_HOOKS with symmetric reversal. What does NOT exist is any host-facing meter UI (`fetchEventPoolStatus` has exactly one caller: the seat capture path). **The killer is latency**: apply-then-pay reconciliation is human-speed while the pool drains at reception-speed → the riskiest piece is a trust-first provisional-grant path (live-window-only, bounded, reversal already symmetric via `reversePapicPassPoints`). The dormant Maya gateway cannot rescue this — env-gated to sandbox, no `'paid'` webhook route at all. 5 inert-first PRs; the `is_active=TRUE` flip is itself the catalog-side hold (the retirement guard in `submitOrderAction` rejects inactive SKUs today).

### 3.2 Grounding

- Pool ledger: `papic_event_point_grants` (additive, `source` CHECK, `order_id` FK, RLS enabled with NO policies = service-role/DEFINER only) — `supabase/migrations/20270826385580_papic_event_capture_pool.sql § 2` (~150-175); usage ledger § 3; atomic `papic_reserve_event_points` (UPDATE…WHERE `points_used+cost<=total` RETURNING) § 7; `papic_release_event_points` § 8; all GRANTed to authenticated, anon, service_role (file tail).
- Pool binding: pool "applies" when flat pass OR ANY grant exists; grant-only events get base=0 so total==SUM(grants) — `20270902148488_papic_pool_binding_grants.sql § 3a` (~27-130); `papic_record_guest_capture` yields the per-guest 150 cap to the pool § 3b.
- Host-readable reader EXISTS: `papic_event_pool_status` (applies/total/used/remaining/soft_stop_at), SECURITY DEFINER, anon-callable — `20270826385580 § 5`; shaper `fetchEventPoolStatus` at `apps/web/lib/papic-event-pool.ts:246` (graceful-degrade `EVENT_POOL_ABSENT`), `shapeEventPoolStatus:209`; **only caller = seat capture path** `apps/web/app/papic/actions.ts:644-650` — zero host UI (grep on `studio/papic/page.tsx` = no hits).
- ⚠ Stale picker: `extra-cameras-picker.tsx:7-27` still documents "Papic Mini ₱30 / Ltd ₱50 / Unli ₱100 per day" — `20270830568357` retired roll+unlimited (`:50-53`), Ltd inactive (`20270828150000`), mini retitled "Papic One" ₱100 (`:38-43`); worse, `budgetLine()` (`:55-60`) renders "No limit · archived to your Drive" when `points_per_day==null`, and `20270901123354 § 1c` NULLed mini+free — **the live picker mislabels the pool-metered Papic One as unlimited-with-Drive.**
- Top-up SKU: `PAPIC_GUEST_TOPUP` inserted `is_active=FALSE` (`20270828140000_papic_one_tiers.sql:68-75`); repriced/retitled "Papic Pool — add 10,000 shots" ₱2,999 (`20270830568357:35-36`); `papic_pass_tiers` (10,000, `is_topup=TRUE`) `20270828140000:100-110`; app fallback + `PAPIC_TOPUP_UNLOCK_POINTS=10_000` unlock rule at `apps/web/lib/papic-pass-tiers.ts:47` (merchandising-only — nothing server-side enforces it).
- Papic One canon: ₱100/camera/250 pts repeatable — `0012_papic/Papic_One_Pool_Model_Spec_2026-07-22.md § 0`; `camera_grant_points` (default 250, admin-tunable) + `papic_grant_camera_points(event,order)` (advisory-locked, idempotent by order_id, N = COUNT mini seats with `paid_order_id`) — `20270901123354 § 1b-1d`.
- Activation: EXACT_HOOKS maps PAPIC_GUEST/6K/10K/TOPUP → `grantPapicPassPoints`, PAPIC_CAMERAS → `grantPapicCameraPoints` — `apps/web/lib/sku-activation.ts:846-855`; grant fns `:146-186`/`:205-235`; `reversePapicPassPoints` deletes ALL grants by order_id regardless of source `:238-260`; fired from admin approval `apps/web/app/admin/payments/actions.ts:337-339` and reversal `:622/:942`.
- Purchase path A (drawer): `InlineCheckoutDrawer` (serviceKey prop, screenshot ALWAYS required, BDO/GCash QR, `submitOrderAction`) — `inline-checkout-drawer.tsx:1-60`; `submitOrderAction` → `pending_approval`; coordinator purchases gated on couple-granted `'checkout'` permission (`checkout/actions.ts:~330-349`); **generic retirement guard rejects `is_active=false` SKUs BEFORE price resolvers** (`:352-386`); server-side catalog price override `:395-425`.
- Purchase path B (cameras): `purchasePapicCameras` — `studio/papic/actions.ts:643-770`: couple guard, quote via `computeCameraQuote`, orders insert `PAPIC_CAMERAS` status `'submitted'` (`:721-733`), `provisionPaidCamerasAdmin` materializes PENDING seats with `paid_order_id` AT ORDER CREATION (`:745-752`) — capture blocked until paid; `PAPIC_CAMERAS_ORDER_KEY` `lib/papic-cameras.ts:125`; 1-camera minimum `:129`.
- Seat/claim: `paparazzi_seats.claim_qr_token`, `generateSeatClaimToken` `lib/papic-seats.ts:213`, `papicSeatClaimUrl` → `/papic/claim/[token]` `:227` (route exists); `provisionPapicSeatsAdmin` idempotent `:276-300`.
- Maya dormant: `api/v1/billing/initialize-maya/route.ts:37-38` — Branch B only when `NEXT_PUBLIC_MAYA_STATUS==='APPROVED'` (unset); default endpoint pg-SANDBOX (`lib/integration-config.ts:436-437`); **no maya webhook route exists** (`app/api/webhooks/` = persona/token-purchase/veriff only) — even approved-Maya has nothing that flips an order paid.
- Free pool: 50-pt `free_grant` seeded by AFTER INSERT trigger on events, NEW events only, admin-tunable — `20270902100836:1-45`; legacy events zero grants → `applies=FALSE` → bar correctly absent.
- Clip currency: `PAPIC_POINTS_PER_CLIP=7` (`lib/papic-cameras.ts:735`) + 10s clamp (`20270903248590`) — meter copy must derive from the constant.
- Host detection on guest site: `isAuthedHost` = event_members OR event_moderators — `app/[slug]/page.tsx:683-708`; phase-preview host check `:761-779`; day-of chrome injection point (GuestHubBar) ~`:1404-08`; pull-tick primitive `useDayOfLiveTick` (45s + focus/visibility, inert outside event day) — `lib/use-day-of-live-refresh.ts:26-56`.
- Open-browse placement: council § 1.1 (More tab carries the host-only "Edit this site" slot — the host-chrome precedent), § 2 (`/hub` stays a locked guest-cookie route — NOT the host surface), § 3 PR6 (SiteMenuBar behind `NEXT_PUBLIC_WEBSITE_MENU_ENABLED`).

### 3.3 Schema sketch

```sql
-- PR3 · trust-first source value (inert vocab extension, mirrors 20270901123354 §1a):
ALTER TABLE public.papic_event_point_grants DROP CONSTRAINT IF EXISTS papic_event_point_grants_source_check;
ALTER TABLE public.papic_event_point_grants ADD CONSTRAINT papic_event_point_grants_source_check
  CHECK (source IN ('admin','topup_order','comp','migration','free_grant','camera_grant','trust_topup'));
-- distinct source so reconciliation/audit sees provisional vs settled; reversePapicPassPoints deletes by order_id regardless.

-- PR3 · admin-tunable trust bounds (same posture as camera_grant_points):
ALTER TABLE public.papic_event_pool_config ADD COLUMN IF NOT EXISTS trust_topup_max_open INTEGER NOT NULL DEFAULT 1
  CHECK (trust_topup_max_open >= 0);  -- max UNRECONCILED trust grants/event; 0 = DB-side kill switch

-- PR3 · atomic trust decision, server-authoritative (GRANT authenticated ONLY — caller is a signed-in
-- host/coordinator, never a guest cookie):
CREATE FUNCTION public.papic_trust_topup_grant(p_event_id UUID, p_order_id UUID, p_points INTEGER)
RETURNS BOOLEAN SECURITY DEFINER SET search_path = public …
-- inside: advisory xact lock on order_id (copy papic_grant_camera_points); refuse unless
--   (a) trust_topup_max_open > count of open trust grants (grants JOIN orders, status NOT IN ('paid','fulfilled')),
--   (b) event holds >=1 prior grant source IN ('topup_order','camera_grant') OR >=1 paid/fulfilled order,
--   (c) now() inside the event-day window;
-- then INSERT the grant idempotently by order_id. Ledger stays no-policy/DEFINER-only.

-- PR5 · the go-live catalog flip (ships LAST — this IS the hold under auto-apply):
UPDATE public.platform_retail_catalog_v2 SET is_active = TRUE, updated_at = NOW()
 WHERE service_code = 'PAPIC_GUEST_TOPUP' AND is_active IS DISTINCT FROM TRUE;
```

NO new tables, no RLS-pattern changes, no changes to `papic_reserve_event_points` / `papic_event_pool_status` — the read+reserve machinery is complete. Explicitly do NOT touch `papic_event_pool_config.pass_service_codes` (the § 11 guard in `20270828140000:150-165` RAISEs).

### 3.4 UI surfaces

- NEW `app/[slug]/_components/papic-pool-bar.tsx` — client strip: remaining (big number), total, drain since last tick, soft-stop amber (`poolStatus.soft`), exhausted red; refresh via `useDayOfLiveTick`; host/coordinator-only.
- `app/[slug]/page.tsx` — resolve `isAuthedHost` (`:683-708`) + `fetchEventPoolStatus(adminClient, eventId)` server-side; mount at the day-of chrome injection point (~`:1404`, beside GuestHubBar) pre-redesign; post-redesign = host-only slot in SiteMenuBar / More tab (council "Edit this site" precedent) — **NOT `/hub`** (locked guest-cookie route, council § 2).
- NEW `app/[slug]/pool-actions.ts` — host-gated actions: `topUpPoolAction` (wraps `submitOrderAction` for PAPIC_GUEST_TOPUP + `papic_trust_topup_grant`) and `addCameraAction` (wraps the `purchasePapicCameras` order shape + `papic_grant_camera_points` trust call); both re-check membership + the coordinator `'checkout'` permission exactly as `checkout/actions.ts:330-349`.
- `InlineCheckoutDrawer` reused as-is for the Top-up sheet (catalog-priced, screenshot mandatory), inside the bar's expand state.
- `studio/papic/page.tsx` — parity pool-meter card for the couple dashboard (today it renders NO pool state at all).
- `extra-cameras-picker.tsx` — copy-fix ride-along: retire the "Mini/Ltd/Unli per-day" header doc and fix `budgetLine()`'s `pointsPerDay==null` branch (currently mislabels Papic One as "No limit · archived to your Drive").
- Seat-claim QR surfacing in the bar's post-purchase state: `fetchPapicSeats` + `papicSeatClaimUrl` (`lib/papic-seats.ts:188/227`) rendering the new mini seats' `/papic/claim/[token]` QRs — a just-added camera is handable to a shooter without leaving the guest site.

### 3.5 PR plan

1. **PR1 · pool bar, read-only, flag-dark** — component + host resolution + reader + tick behind `NEXT_PUBLIC_PAPIC_POOL_BAR` (off; demo events forced on). Zero schema. `applies=FALSE` events render nothing. Gate: correct drain on a test event. Rollback: env flag.
2. **PR2 · purchase doorways, still flag-dark** — Top up via drawer + Add-a-camera via host-gated wrapper (N × mini, seats pending at creation exactly like studio); coordinator purchases honor the `'checkout'` gate. Submits correctly FAIL on PAPIC_GUEST_TOPUP until PR5's flip — the retirement guard is the catalog-side interlock. Includes the picker stale-copy fix. Rollback: env flag.
3. **PR3 · trust-first instant activation, inert-on-apply** — migration (source value + `trust_topup_max_open` + RPC; nothing runs until called) + wire pool-actions inside the live window. Approval already idempotent (pre-read by order_id); rejection already reverses. Admin `/admin/payments` row gets a "provisionally granted" badge. Gate: unit-test submit→trust-grant→approve(no double)→reject(reversal). Rollback: `trust_topup_max_open=0` (DB) or env flag (app).
4. **PR4 · post-purchase seat-QR handoff** — claim QRs in the bar success state; pure additive, same flag. Gate: a camera added mid-event is claimable + capturing against the pool within one tick.
5. **PR5 · go-live** — flip `PAPIC_GUEST_TOPUP is_active=TRUE` (migration, only when PR1–4 owner-verified on a demo event), then flip the env flag; DECISION_LOG row + corpus note (One-Pool spec § 4 cross-ref, stale picker doc). Rollback at every stage: env flag off + `trust_topup_max_open=0`; the `is_active` flip alone exposes nothing host-facing (studio doorway for pass tiers is still `coming_soon`).

Sequencing locks: PR3's migration inert by construction; the `is_active` flip is deliberately LAST — the only change making an inactive SKU purchasable platform-wide. If open-browse PR6 lands first, the bar mounts as a menu slot instead of a floating strip — same component, different parent.

### 3.6 Risks

- **Latency/trust exposure is real but tiny and bounded**: worst case per abused event = 10,000 unpaid points at marginal cost ~₱0.023/pt ≈ **₱230**, NOT the ₱2,999 sticker; bounds = signed-in host/coordinator only, mandatory screenshot at submit, live-window-only, payment-track-record precondition, max 1 open provisional (tunable), full reversal on reject. Maya is NOT viable this cycle (sandbox, KYC, no webhook) — a separate program.
- Double-grant/race on trust + approval: mitigated by the advisory-lock + EXISTS-by-order_id pattern `papic_grant_camera_points` already uses — the trust RPC must copy it; PR3's cycle test is the gate.
- `papic_event_pool_status` is GRANTed to anon — anyone with an event_id can read pool numbers (no PII, but capacity/spend telemetry). The bar doesn't widen it, but log it in the privacy-reconciliation queue rather than shipping silently past it.
- Top-up unlock rule conflict: `is_topup` carries "unlocks at ≥10,000 points held" (`papic-pass-tiers.ts:47`) — a Papic One / Free event mid-reception holds far less; strictly enforced, the rescue button is useless exactly when needed. Nothing enforces it server-side today → owner question (§ 6.2 item 15).
- 10s/7-pt clips drain the pool 7× faster than photo math suggests — all bar copy derives from `PAPIC_POINTS_PER_CLIP`; extend the copy-guardrail test pattern (`papic-copy-guardrails.test.ts`) to the bar or the meter will lie after the next currency change.
- 45s pull tick → up to ~45s stale while 20 phones shoot — acceptable for a meter (the reserve RPC is the fail-closed gate), but the exhausted state should also render from a capture 409 signal, not only the poll.
- **Storage blocker R1** (One-Pool spec § 1.4): every point sold is priced on a 6-month-retention cost basis while no purge machinery exists — a one-tap top-up compounds the under-priced-retention drift; do not GA beyond the flag flip until the purge/clip-compression program has an owner decision.
- `page.tsx` heat: keep the bar's diff to a single mount block so open-browse PR1–3 can carry it through the extraction.
- Provisioned-but-unpaid cameras: seats exist PENDING and capture stays blocked until paid — trust-first for cameras must flip whatever the presign gate checks, or the added camera grants points the shooter cannot spend; verify the seat-path paid-gate behavior for `'submitted'` orders before wiring PR3's camera branch.

### 3.7 Open owner questions → § 6.2, items 15–20.

---

## § 4 · BUILD ④ — Guest QR Token Rotation (council verdict § 5.11)

### 4.1 Verdict

Medium-small build with one sharp edge. A naked rotation primitive already ships — `reissueGuestToken` does an RLS-gated UPDATE of `guests.qr_token`, wired to a bare "Re-issue" button on `/dashboard/[eventId]/invitation` — and every QR/URL artifact in the repo renders on-demand from the current token (nothing stores pre-rendered QR SVGs/PDFs), so DB-side rotation is already clean: seat/RSVP/photos all key on `guest_id` and survive untouched. **The riskiest part is session semantics**: the 60-day `setnayan_guest_session` JWT embeds `qr_token` but NO consumer re-validates it against the DB (`[slug]/page.tsx:677` checks only `event_id`) — an attacker who redeemed a leaked QR keeps access for up to 60 days after rotation. Core new work = a flag-gated session-revalidation chokepoint + an RPC adding audit, durable rate-limiting, actor typing, and notifications around the existing mint. Second hazard is day-of: printed place cards, the check-in desk, the souvenir table, and the `/papic/me` camera bridge all die instantly on rotation → the live window (T-1h..T+8h) needs a typed-confirm guard.

### 4.2 Grounding

- Token birth: `guests.qr_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16),'hex')` — `20260513010000_iteration_0001_guests.sql:125`; index `:135`; 32-hex contract `apps/web/lib/checkin.ts:5-12`.
- Existing rotation: `reissueGuestToken` — `invitation/actions.ts:16-39` (randomHex(16) + RLS UPDATE; **no audit, no rate limit, no notify, no confirm**); wired at `invitation/page.tsx:347` and `:408`. Master-QR precedent with `rotated_at`: `event-qr/actions.ts:35-72`.
- Resolvers that die on rotation (lookup BY qr_token): `/[slug]/redeem/route.ts:36-38` (`?invite=` → session mint); `/[slug]/seat/claim/route.ts:58-60` (`?t=` → session mint); `/[slug]/seat/page.tsx:123-130` (dual guest/table resolver); `/papic/me/[token]/page.tsx:126`, `…/session/route.ts:26-35`, `…/download/route.ts:34`, `…/actions.ts:35`; `/papic/join/[token]/page.tsx:88` (guest-vs-crew disambiguation); `/api/venue-scene/[slug]/route.ts:64-67` (`public_venue_scene p_token`).
- Emitters that embed the current token (**all render on-demand — nothing stored**): `lib/qr.ts:42,56,175`; `invitation/page.tsx:109-168` + `invitation/print/page.tsx:42`; `studio/custom-qr-guest/page.tsx:222-226,331` + print `:82` (Custom QR SKU); `/api/website/qr/guest/[guestId]/route.ts:109` PNG (`Cache-Control 'private, max-age=300'` `:124-126` — ≤5-min stale window); `seating/print/route.ts:107` place cards encode `${site}?g=${qr_token}`; `studio/patiktok/booth/page.tsx:89`; `[slug]/page.tsx:1058-1062,1396,3077-3079` + `[slug]/hub/page.tsx:265-269,350,632` (`/papic/me/{token}` camera links); `website/widgets/page.tsx:139-140`; `guest-drawer.tsx:94-206` decorative.
- 🔴 **Session gap (the core defect)**: `lib/guest-session.ts:5` (60-day cookie), `:17,:44` (JWT carries qr_token) — but the private-event gate checks only `session.event_id` (`[slug]/page.tsx:677`); hub re-reads the guest row by `guest_id`, never comparing tokens (`hub/page.tsx:188`). **24 files consume `readGuestSession`** (incl. `api/papic/guest-capture`, `guest-selfie`, pabati, `[slug]/actions.ts`, `lib/link-guest-account.ts`) — rotation today does NOT revoke a leaked-token session.
- Survives rotation (keys on guest_id): `papic_record_guest_capture(p_guest_id, …)` anon-granted — `20260718000000:322-325,391`; souvenir claims (`souvenirs/actions.ts:34-60`, manual_search fallback `:38`); check-in desk loads roster with qr_token server-side (`guests/checkin/page.tsx:54`) with LiveRefresher → a mid-event rotation invalidates printed cards at the door within one refresh.
- Authz: `couple_writes_guest` RLS (couple OR is_admin) `20260513010000:196-212`; `guests_moderator_write` (coordinator delegate with `guest_list=edit`) `20261129003000:318-322`; moderator UPDATEs audit-logged via `log_delegate_write` trigger `20261129003000:106-198` (**couple writes deliberately NOT logged** `:129-131` → rotation needs its own audit row).
- Notify + rate-limit precedents: `security_alert` type `lib/notifications.ts:96,255`; best-effort `after()` pattern `lib/account-security-actions.ts:131,176`; `emitNotification` `lib/notification-emit.ts:144`; `sendEmail` `lib/email.ts:54`; `guests.email` exists (`lib/guests.ts:352`). In-memory limiter `lib/rate-limit.ts:38` with per-instance caveat `:4-8` → durable limit must live in the DB. Audit-table precedents: `slug_change_log` (`invitation/actions.ts:91-97`); `scan_events` best-effort.
- Day-of window: live = T-1h..T+8h — `lib/day-of-mode.ts:110-117` (`getDayOfPhase`).
- Privacy ties: non-public events get robots noindex (`[slug]/page.tsx:229`) but **`/papic/me/[token]/page.tsx` exports NO robots metadata** (token-in-path page indexable — gap); fault-log redaction masks token keys `lib/telemetry/redact.ts:25`; council verdict names this build § 5.11 + flags bearer-tokens-in-URLs (`:111`, `:120-121`) + § 5(d) analytics scrub of `?invite=`/`?t=`.
- Adjacent non-targets sharing the name (**do NOT touch**): `paparazzi_seats.claim_qr_token` (`papic/join/[token]/page.tsx:75`), `event_tables.qr_token` (`lib/seating.ts:102-114`), `events.master_qr_token` (`api/crew/register-device/route.ts:117-118`), vendor locked-QR family (`lib/vendor-locked-qr.ts`).

### 4.3 Schema sketch (PR-1, INERT)

```sql
ALTER TABLE public.guests
  ADD COLUMN qr_token_rotated_at timestamptz,
  ADD COLUMN qr_rotation_count integer NOT NULL DEFAULT 0;   -- mirrors events.master_qr_token_rotated_at

CREATE TABLE public.guest_qr_rotations (
  rotation_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events ON DELETE CASCADE,
  guest_id uuid NOT NULL REFERENCES guests ON DELETE CASCADE,
  actor_kind text NOT NULL CHECK (actor_kind IN ('couple','coordinator','guest_self','admin')),
  actor_user_id uuid,
  reason text,
  old_token_sha256 text NOT NULL,      -- SHA-256 of the retired token, never raw (forensics without re-leak)
  created_at timestamptz NOT NULL DEFAULT now()
);
-- RLS at CREATE TABLE: ENABLE; SELECT to authenticated USING (event_id IN (SELECT current_event_ids()) OR is_admin());
-- no INSERT policy — writes only via the RPC.

CREATE FUNCTION public.rotate_guest_qr_token(p_guest_id uuid, p_actor_kind text, p_reason text DEFAULT NULL)
RETURNS jsonb SECURITY DEFINER SET search_path = public …
-- (1) SELECT guest FOR UPDATE, reject deleted;
-- (2) authz: couple/coordinator → is_admin() OR event_members(couple) OR moderator_area_level(event_id,'guest_list')='edit';
--     guest_self is server-mediated only (service_role after signed-cookie validation) — do NOT grant anon;
-- (3) durable rate limit: reject 'rate_limited' when >=3 rows in guest_qr_rotations for this guest in 24h;
-- (4) INSERT audit row, old_token_sha256 = encode(digest(old_token,'sha256'),'hex');  -- pgcrypto 20260513020000
-- (5) UPDATE guests SET qr_token = encode(gen_random_bytes(16),'hex'),
--       qr_token_rotated_at = now(), qr_rotation_count = qr_rotation_count + 1;
-- (6) RETURN {ok, qr_token, rotated_at}.
-- REVOKE FROM PUBLIC/anon; GRANT to authenticated, service_role.
```

**Invalidation semantics: IMMEDIATE** — no grace window, no `qr_token_previous`; every resolver queries by current token so the old QR dies atomically at the UPDATE; recovery is reprint/reshare, not undo. **Session revocation is NOT schema** — it is the app-layer equality check (`session.qr_token === guests.qr_token`) added in PR-3, using the qr_token the JWT already carries; no session table.

### 4.4 UI surfaces

- Host/coordinator support rotation (upgrade in place): `/dashboard/[eventId]/invitation` — replace the bare Re-issue form (`:347,408`) with a confirm dialog stating exactly what dies (printed invitation card, printed place card, Custom-QR PNG, shared links, camera link) and what survives (RSVP, seat, photos); `qr_token_rotated_at` badge + `rate_limited` state. Same action from the guest drawer.
- Guest self-service (new, flag-gated): `/[slug]/hub` "My QR" panel — "Lost your QR? Get a new one" behind the guest-session cookie; confirm dialog; on success **re-sign the actor's own cookie with the new token** (`setGuestSession`) so the rotating guest is not logged out, and render the fresh QR immediately.
- Day-of guard on both paths: `getDayOfPhase(event_date)==='live'` → typed confirm ("the door desk and place cards stop scanning NOW — use manual search at check-in"); check-in desk gets a "rotated N min ago" hint from `qr_token_rotated_at`.
- Notifications: guest_self rotation → `security_alert` to all hosts (best-effort `after()`); host rotation → optional email to `guests.email` with the NEW link when present, plus copy forcing the host to reshare when absent (most guest rows have no email).
- Privacy sweep: robots noindex on `/papic/me/[token]/page.tsx` (currently none); analytics scrub of `?invite=`/`?t=`/`?g=` per council § 5(d); no NEW surfaces may mint token-bearing URLs (menu-site rule).

### 4.5 PR plan

1. **PR-1 — migration only (inert)**: columns + `guest_qr_rotations` + RPC + RLS. Nothing calls it — safe under auto-apply. Rollback: additive; a bad RPC is re-created by a follow-up migration.
2. **PR-2 — host path swap**: `reissueGuestToken` → the RPC via the user's authenticated client (actor_kind from membership), confirm-dialog copy, rotated_at badge, error states, best-effort guest email behind `GUEST_QR_ROTATE_EMAIL_ENABLED` (off until copy approved). Behavior-compatible replacement — no flag on the swap itself; old action kept one release. Rollback: revert to direct UPDATE.
3. **PR-3 — session-revalidation chokepoint (the leak-kill)**: `validateGuestSession(admin, session)` in `lib/guest-session.ts` (fetch by guest_id, require `guest.qr_token === session.qr_token`, else null), threaded through every access-granting `readGuestSession` consumer (`[slug]/page`, hub, seat, find-my-table, welcome, actions, `api/papic/guest-capture|guest-tag|kwento|accept-terms`, `api/guest-selfie`, pabati, `link-guest-account`, join actions). Flag `GUEST_SESSION_TOKEN_CHECK` (off) — flip after browser-verifying legit sessions survive. Add a lint/grep CI gate that new call sites use the validated helper. Rollback: flag off.
4. **PR-4 — guest self-service**: hub panel + server action (validated cookie → admin client → RPC `actor_kind='guest_self'`) + per-IP backstop (`lib/rate-limit.ts`) + host `security_alert` + in-place cookie re-sign. Flag `GUEST_QR_SELF_ROTATE` (off). Rollback: flag off.
5. **PR-5 — day-of guard + hazard copy**: live-window typed confirm both paths, check-in hint, help copy pointing at manual-search fallback. No flag (pure guard, fails toward MORE friction). Rollback: revert.
6. **PR-6 — privacy sweep** tied to the open-browse privacy PR: noindex on `/papic/me/[token]`, analytics param scrub, DECISION_LOG row + corpus note closing council § 5.11, changelog fragment. Rollback: revert.

### 4.6 Risks

- **Session-revocation blind spot is live TODAY**: a leaked-QR holder who redeemed before rotation keeps a 60-day session (only event_id checked). Until PR-3 flips, "rotation" only stops FUTURE scans — the confirm copy must not overpromise.
- Missed consumer in PR-3: 24 files import `readGuestSession`; any access-granting site left on the raw reader keeps honoring revoked sessions. Mitigate: CI grep gate + enumerated checklist in the PR body.
- Day-of bricking: rotating during T-1h..T+8h kills `?g=` place cards, the `?invite=` card, `/papic/me`, and — via LiveRefresher — the check-in roster within one refresh. Typed confirm mandatory; manual-search is the only door fallback.
- Guest recovery dead-end: most guest rows have no email; a host rotation with no reshare strands the guest (their bookmarked hub link survives only until PR-3 flips — afterwards it dies too). Copy must force the "now reshare" step.
- PR-1 must stay truly inert — no seed data, no reader changes, RPC granted-but-uncalled. Coupling PR-1+PR-2 in one merge removes the rollback seam.
- Custom-QR PNG 5-min private cache + server-rendered QR tables can show a just-retired QR briefly; `revalidatePath` on invitation + custom-qr-guest + hub narrows this to the PNG cache only.
- Rate-limit bypass at the edge: `lib/rate-limit.ts` is per-instance; the durable 3-per-24h check inside the RPC is the real ceiling.
- Adjacent-token collateral: `claim_qr_token` / `event_tables.qr_token` / `master_qr_token` / vendor locked-QR share the column name; disambiguators rely on disjoint UNIQUE 32-hex spaces — new mint must stay `encode(gen_random_bytes(16),'hex')`.
- The fuzzy name-claim path (`join/[eventId]/actions.ts:406-470`) mints sessions from the CURRENT token for a name match with no possession factor — rotation does not close that vector; it is the council's separate OTP work item and must not be scope-crept into this build.

### 4.7 Open owner questions → § 6.2, item 1 (AUTHORITY, first) + items 21–26.

---

## § 5 · BUILD ⑤ — Run-of-Show Trigger

Host/coordinator-set "Happening Now" driving the guest Now panel.

### 5.1 Verdict

The owner's directive is **~70% already shipped and LIVE (not flag-dark — the memory note on #3412 is stale for this worktree)**: migration `20270321980372` put the trigger pointer on the timeline itself (`event_schedule_blocks.run_state 'upcoming'|'live'|'done'` + `actual_start_at/actual_end_at`), a single-winner `advance_schedule_block()` RPC, a Supabase Realtime publication on the table, and a shared `RunOfShowHeader` with an advance control on the host schedule page + vendor workspace, read-only on the guest schedule widget. Missing = exactly the directive's payload: (1) the guest "What's happening now" surfaces (hub Now panel, GuestHubCard, ScheduleWidget badges) still infer "now" from the wall clock and never read `run_state`; (2) a DELEGATE coordinator is shown the advance button but the RPC 403s them (gate = `current_event_ids` = event_members only — the migration comment's "coordinator" is the rarely-used QR-join `member_type='coordinator'`, not the `event_moderators` delegate the product actually creates); (3) no jump/rewind — only sequential advance; (4) no estimated-vs-live labeling in RSVP season. **4 small PRs, no new table**; riskiest part = collision with the in-flight 5-tab open-browse rebuild, whose Details/Home tabs re-home the very panels PR-3 touches.

### 5.2 Grounding

- Trigger machinery shipped: `supabase/migrations/20270321980372_dayof_runofshow_handover.sql:44-55` (enum + columns), `:88-199` `advance_schedule_block()` (FOR UPDATE + run_state-precondition single-winner, START/ADVANCE branches, idempotent), `:201-203` REVOKE anon / GRANT authenticated, `:382-392` Realtime publication.
- RPC auth gate = `current_event_ids ∪ current_vendor_booked_event_ids ∪ is_admin` (`:118-122`). `current_event_ids()` = event_members only (`20260512000000_setnayan_base.sql:178-188`; only definition). Delegate coordinators live in `event_moderators` via `current_moderator_event_ids()/moderator_area_level()` (`20261129003000:33-73`) → **a delegate coordinator FAILS the gate with 42501 `not_on_this_event`.**
- …but the same delegate ALREADY has a direct FOR ALL write on the timeline: `event_schedule_blocks_moderator_write USING moderator_area_level(event_id,'schedule')='edit'` (`20261129003000:350-355`); `COORDINATOR_AREAS` grants `schedule:'edit'` (`lib/event-moderators.ts:122-130`); auto-granted on booked-planner downpayment (`lib/coordinator-grant.ts:12-27`). Day-of schedule ops sit INSIDE the coordinator's direct-edit area — propose-not-execute applies to VENDORS (`event_schedule_suggestions`, `20270321980372:12-15` comment), the money wall to budget (`20261129003000:304-315`). **The owner's "coordinators set it directly" needs only the RPC gate widened, not a permission-model change.**
- Delegates DO reach the surface: dashboard layout admits accepted `event_moderators` (`layout.tsx:111-131`); schedule page renders `RunOfShowHeader` with `canAdvance` unconditionally (`schedule/page.tsx:233-234`) — today a delegate sees the button and gets a server error on tap.
- Shipped UI: `run-of-show-header.tsx:67-95` (Realtime channel `postgres_changes` filtered by event_id + refetch, ~500ms per header comment `:23`), advance control `:102-110`; `app/_actions/run-of-show.ts:23-44` `fetchRunOfShowBlocks` (RLS-respecting, works for anon guests per `:12-15`), `:46-72` `advanceScheduleBlock` + revalidatePath. Rendered: host schedule page (`:234`), vendor client workspace (`vendor-dashboard/clients/[eventId]/page.tsx:2493-2495`), guest ScheduleWidget read-only, gated on "some block `run_state !== upcoming`" (`schedule-widget.tsx:118-119,147-149`). **No feature flag anywhere on these surfaces** (grep = zero hits).
- Pure derivation core: `lib/run-of-show.ts:62-99` `deriveRunOfShow` (current = the 'live' block; wall clock only feeds driftMinutes); tests `lib/schedule-run-of-show.test.ts`.
- Time-inferred guest "now" paths that IGNORE run_state: (1) hub Now panel — `hub/page.tsx:216-224` strips run_state from `topLevelBlocks`, `:445-446` feeds `WhatsHappeningCard`, whose `deriveState` is pure wall-clock math (`whats-happening-card.tsx:24-47`), shown only when `isLive && blocks` (`:393`); (2) GuestHubCard "Coming up" — `pickNextScheduleBlock` time-only with 15-min grace (`guest-hub-card.tsx:134-145`), fed at `[slug]/page.tsx:1276`; (3) ScheduleWidget per-block badges — wall-clock `currentIndex/upNextIndex` (`:73-85,172-181`) **can CONTRADICT the run-state header rendered directly above them.**
- Refresh cadence: hub is pull-only — `hub-shell.tsx:121` `useDayOfLiveTick` default 45s + focus/visibility, inert outside the day (`lib/use-day-of-live-refresh.ts:25-56`; day window = live+post per `lib/day-of-mode.ts:74-77`); WhatsHappeningCard re-derives 60s (`:59-62`); ScheduleWidget ticks 30s (`:34-39`). Meanwhile `RunOfShowHeader` on the SAME pages already has ~500ms Realtime.
- Zero-account guest read already open: anon SELECT on `is_public=TRUE` rows (`20260513190000_iteration_0031_schedule.sql:81-85`); `fetchPublicScheduleBlocks` selects run_state/actual_* (`lib/schedule.ts:73-74,90-103`); hub + `[slug]` fetch via admin client (`hub/page.tsx:211`, `[slug]/page.tsx:815`) — new columns already flow to guests; Realtime honors the same anon policy (already exercised by the guest-side header).
- Estimated-phase context: RSVP-season phases from `getDayOfPhase` (`lib/day-of-mode.ts:28-46`); hub renders ScheduleWidget in every phase (`hub/page.tsx:511`) with no estimated/live labeling; council verdict keeps the public schedule in the Details tab + live-window pinned-schedule safety belt (§ 1.1 Details row).

### 5.3 Schema sketch (ONE additive migration, inert)

**NO new table, NO `events.current_schedule_block_id`** — the pointer already exists as the single-winner `run_state='live'` row; a separate events-level pointer would create two sources of truth against the shipped RPC + Realtime publication.

```sql
-- (1) attribution (directive's set_at already exists as actual_start_at)
ALTER TABLE public.event_schedule_blocks
  ADD COLUMN IF NOT EXISTS run_state_set_by UUID,   -- auth.uid(); no FK (users may hard-delete)
  ADD COLUMN IF NOT EXISTS run_state_set_role TEXT
    CHECK (run_state_set_role IS NULL OR run_state_set_role IN ('host','coordinator','vendor','admin'));

-- (2) set_current_schedule_block(p_block_id UUID, p_clear BOOLEAN DEFAULT FALSE)
--     — the JUMP/REWIND primitive ('set what is currently happening', not 'advance one step').
-- SECURITY DEFINER, search_path=public, REVOKE PUBLIC/anon, GRANT authenticated. Gate (the widening):
--   IF v_event_id NOT IN (SELECT current_event_ids())                        -- host/couple + QR-join coordinator
--      AND COALESCE(moderator_area_level(v_event_id,'schedule'),'') <> 'edit' -- DELEGATE coordinator (owner directive)
--      AND NOT is_admin() THEN RAISE 42501; END IF;
--   -- deliberately NO vendor arm: vendors keep sequential advance only (owner question)
-- Semantics, serialized via SELECT event's live rows FOR UPDATE:
--   p_clear → every 'live' row: run_state='done', actual_end_at=NOW()   (explicit 'between moments')
--   else    → target: 'live', actual_start_at=COALESCE(actual_start_at,NOW()), set_by/set_role stamped;
--             every OTHER 'live' row → 'done' + actual_end_at=NOW();
--             rows strictly BEFORE target (sort_order,start_at) still 'upcoming' → 'done' (skip-forward closes the past);
--             rows strictly AFTER target that are 'done' → back to 'upcoming', actual_end_at cleared (REWIND —
--             the one behavior advance's 'never resurrects a finished block' rule (20270321980372:174) forbids).
-- Idempotent: target already live → jsonb status='already'.

-- (3) Widen the EXISTING advance_schedule_block gate identically (CREATE OR REPLACE, add the
--     moderator_area_level('schedule')='edit' arm at :118-122) so the button delegates already see stops 403ing.

-- (4) Nothing for guest RLS/Realtime: anon is_public policy + publication already cover the columns.
--     run_state_set_by is anon-exposed by row-scoped RLS — NEVER render it to guests (PII discipline).
```

### 5.4 UI surfaces

- `run-of-show-header.tsx` — jump-set (tap any block row in host/coordinator mode → `setCurrentScheduleBlock`) + "Pause / between moments" (`p_clear`); one-tap advance stays the primary happy path.
- `schedule/page.tsx` event-day view (`:233-234`) — `canAdvance` derived server-side (couple member OR moderator schedule-edit) instead of hardcoded `true`, + block-list set control.
- `app/_actions/run-of-show.ts` — new `setCurrentScheduleBlock` action mirroring `advanceScheduleBlock` (`:46-72`) incl. both revalidatePath calls.
- `whats-happening-card.tsx` — accept run_state/actual_start_at; `deriveState` prefers the 'live' row (reuse `deriveRunOfShow`), falls back to time inference when all 'upcoming'; "Live · set by your hosts" vs "Estimated" chrome.
- `hub/page.tsx:216-224,393,445-446` — stop stripping run_state; mount the trigger-aware Now card; share ONE Realtime channel per page with ScheduleWidget's header — do NOT open a second socket.
- `schedule-widget.tsx:73-85,172-181` — badges prefer run_state ('live'→Happening now, 'done'→dims; progress ring counts done rows) with wall-clock fallback pre-show; `:118` gate unchanged.
- `guest-hub-card.tsx:134-145` — `pickNextScheduleBlock` prefers 'live' then first 'upcoming' after it; time fallback unchanged.
- Estimated labeling (PR-4): ScheduleWidget + hub headers take `dayOfPhase` — pre/inactive → "Estimated program · times may shift on the day"; live+trigger-started → "Live"; coordinate copy with the 5-tab Details tab.

### 5.5 PR plan

1. **PR-1 · migration only, INERT** (safe: nothing calls the new RPC; columns nullable): `set_current_schedule_block` + attribution columns + widened gates on BOTH RPCs. The advance-gate widening is the only behavior change and is strictly additive (a caller class that errored now succeeds — exactly the owner directive). Rollback: RPC uncalled; re-narrow gate via CREATE OR REPLACE.
2. **PR-2 · host/coordinator control surface**: action + jump-set/clear UI + server-derived `canAdvance`; vendor workspace left advance-only. RPC self-gates → stray render harmless. Rollback: revert UI.
3. **PR-3 · guest read path**: hub Now panel + ScheduleWidget badges + GuestHubCard prefer run_state, wall-clock fallback — behind `NEXT_PUBLIC_GUEST_NOW_TRIGGER` (off) ONLY because the 5-tab rebuild re-homes these exact panels. Realtime: REUSE the existing per-page channel; keep the 45s pull as no-socket fallback. Cost check: connections already opened by the guest widget once the show starts; 250-guest wedding ≈ ≤250 concurrent (within Supabase Pro's 500), ~30 taps × 250 subscribers ≈ 7.5K msgs/event — negligible; 45s-only would genuinely undercut "now on the dance floor" (worst case a full song late). Rollback: flag off.
4. **PR-4 · estimated-vs-live labeling**: phase-aware copy; land inside or after the 5-tab Details tab to avoid double-churn. Rollback: copy revert.

### 5.6 Risks

- Collision with the 5-tab rebuild: PR-3 edits `hub/page.tsx` + `schedule-widget.tsx`, which the council re-homes into Details/Home tabs — sequence against that worktree or land the derivation in `lib/` (extend `deriveRunOfShow`) so both UIs consume it.
- Two coordinator identities: `member_type='coordinator'` event_members (QR-join, passes today) vs `event_moderators` delegates (the real coordinator, currently 403s). The widened gate covers both; **don't "fix" by moving delegates into event_members** — that grants them every event_members-gated surface.
- Delegates can ALREADY bypass single-winner via their direct FOR ALL table write (`20261129003000:350-355`) — a raw UPDATE of run_state skips FOR-UPDATE serialization. Low practical risk (app never issues it); consider a follow-up trigger/column-guard if abuse matters.
- `is_public=FALSE` live block: anon guests can't see the row; Now panel must degrade to "between moments"/time fallback — never crash or leak the label.
- `run_state_set_by` anon-readable once populated — never render on guest surfaces (RA 10173); host-dashboard attribution only.
- Auto-apply: PR-1's advance-gate widening goes live the moment it merges — acceptable only because it implements the owner directive directly.
- Rewind semantics contradict the shipped "never resurrects a finished block" invariant (`:174`) — keep resurrect logic ONLY in the new RPC so the vendor-facing advance keeps its guarantee.
- ⚠ Stale memory: "P2 run-of-show #3412 flag-dark" — this worktree shows it live and unflagged on host/vendor/guest surfaces; verify prod behavior before assuming a launch flip is pending.

### 5.7 Open owner questions → § 6.2, items 27–31.

---

## § 6 · Cross-build sequencing + consolidated owner sign-offs

### 6.1 Collision map and order of operations

**Shared hot files/tables — who touches what:**

| Shared surface | ① Columns | ② Chibi | ③ Pool Bar | ④ QR Rotation | ⑤ Run-of-Show | Open-browse 11-PR plan |
|---|---|---|---|---|---|---|
| `app/[slug]/page.tsx` | Story render ×2 body trees (PR4) | Me-tab doorway (PR-5, optional) | bar mount block (PR1) | host rotation touches nothing here; PR-3 validates its session reads | GuestHubCard feed (PR-3) | **PR1 extraction + PR3 one-body-tree restructure the exact lines** |
| `app/[slug]/hub/page.tsx` | — | — | NOT here (locked guest route) | "My QR" panel (PR-4) | Now panel (PR-3) | re-homed into 5-tab shell |
| `schedule-widget.tsx` | — | — | — | — | badges (PR-3) | re-homed (Details tab) |
| `lib/guest-session.ts` / `readGuestSession` | consumer (submit action) | consumer (`guestSetAvatarAction`) | — (host-authed, not guest) | **defines `validateGuestSession`, threads 24 consumers (PR-3)** | — | consumer |
| `public_venue_scene` (RPC series) | — | **v8 (PR-6)** — hottest RPC, v5→v7 in one week | — | resolver consumer (`?t=`) | — | — |
| SiteMenuBar / Me tab (open-browse PR6) | compose placement option | Me-tab doorway | More-tab bar slot | — | — | **owns it** (`NEXT_PUBLIC_WEBSITE_MENU_ENABLED`) |
| `guests` table | FK author | `avatar_config` columns | — | `qr_token` + rotation columns | — | — |

**What the open-browse plan absorbs vs what ships independently:**

- **Absorbed / sequenced behind it**: ① PR4 (Story + editorial renders — land after council PR1–3 extraction, or as `_components`-only + a one-line import after), ⑤ PR-3/PR-4 (Now panel + labels — or land the derivation in `lib/` now and let both UIs consume it), ② Me-tab doorway, ③ More-tab slot, ④ PR-6 (privacy sweep rides the open-browse privacy PR).
- **Ships independently, zero wait**: every inert migration (① PR1, ② PR-4, ③ PR3, ④ PR-1, ⑤ PR-1); all dashboard-side work (① PR3 review queue, ③ studio meter card + picker copy fix, ④ PR-2 host rotation, ⑤ PR-2 control surface); ② PR-1..3 rig work (flag-dark, touches `plan3d`/`kit`, not `[slug]`); ② PR-5 via the venue 3-tap doorway; ③ PR1 bar (single mount block the extraction can carry through); ④ PR-3 session chokepoint (lib-level + API routes).

**Recommended program order:**

1. **Week 0 — all five inert migrations land immediately** (each is auto-apply-safe by construction; no coupling between them: `guest_columns` / `guests.avatar_config` / trust-topup vocab / `guest_qr_rotations` / `set_current_schedule_block`).
2. **④ PR-3 session-revalidation chokepoint EARLY** — before ① and ② add new `readGuestSession` consumers, so their new call sites are born on the validated helper and the CI grep gate covers them from day one. This is the one cross-build ordering that saves rework.
3. **⑤ PR-1/PR-2 + ④ PR-2 + ① PR3 + ③ PR1/PR2** in parallel — dashboard/host surfaces, no `[slug]` contention.
4. **② PR-1..3 rig track runs the whole time** flag-dark (longest pole; its regress surface is marketing pages, not `[slug]`).
5. **Guest-site render wave after open-browse PR1–3 extraction**: ① PR4, ⑤ PR-3, ③ bar placement finalization, ② PR-6 (rebase v8 against `origin/main` at the last minute).
6. **Flag flips last, each independent**: ⑤ standalone or bundled with the 5-tab go-live (owner call), ① after DPO line, ③ after demo-event verification + the `is_active` migration, ④ after browser-verifying legit sessions survive, ② after § 9 sign-offs.

**One shared caveat**: ③ PR5 and ② PR-7 both contain non-inert migrations (`is_active` flip; blob deletion). They are the only two merges in the program where merge = live behavior change; both are deliberately last in their tracks.

### 6.2 Consolidated owner sign-off list

**1. 🔴 QR-ROTATION AUTHORITY (Build ④ — decide first; PR-2/PR-4 shape depends on it).** Who may rotate a guest's QR token: guest self-service, host, coordinator — in what combination?

> **RECOMMENDATION: BOTH — guest self-service AND host/coordinator support-rotation, each behind a printed-QR-dies confirm + notification.** The studies argue it three ways: **(a) Rotation is cheap and safe by construction** — every emitter in the repo renders QR/URLs on-demand from the current token (invitation, print pack, Custom-QR PNG, place cards, camera links — § 4.2 emitter list) and every durable object keys on `guest_id` (`papic_record_guest_capture` takes `p_guest_id`; souvenirs, seats, RSVP survive), so nothing is corrupted by rotating — the only casualties are printed artifacts and shared links, which is exactly what the confirm dialog enumerates. **(b) Host-only rotation strands guests**: most guest rows have no email, so a host rotation with no reshare dead-ends the guest — self-service ("Lost your QR? Get a new one") behind the authenticated guest cookie is the only recovery path that doesn't route through the host, and the RPC's durable 3-per-24h limit + per-IP backstop + `security_alert` to hosts bound the abuse surface. **(c) Coordinator support-rotation is already live de facto**: `guests_moderator_write` (`guest_list=edit`) lets delegates hit the existing bare Re-issue path via RLS today, and coordinators run the door desk where lost-QR triage actually happens — restricting the RPC to couple-only would be a silent power *removal* contradicting shipped RLS, while granting it keeps the propose-not-execute lock intact because rotation is guest-list ops, not money or publishing. Non-negotiable riders regardless of the authority answer: immediate invalidation (no grace token), day-of typed confirm (T-1h..T+8h), audit row with `old_token_sha256`, and the PR-3 session-revalidation flip so rotation actually revokes leaked sessions rather than only future scans.

**Build ① — Guest Columns**
2. Approver set: couple only (`requireCouple` precedent) or couple+coordinator (`photo_messages` RLS precedent + propose-not-execute lock)? Study recommendation: RLS admits both (canon shape), server action gates to couple, coordinator propose-only later.
3. Free or SKU-gated? Kwento is paid-to-unlock (KWENTO entitlement), but columns anchor the free editorial/Story surface — a paywall contradicts "the paper" as terminal artifact. Recommend free.
4. Compose location: Story tab (write where it publishes) or Me/Your Invite tab (where guest-personal actions live per council § 1.1)? Pick before PR2.
5. `decline_note` guest-visible (kind rejection reason) or internal-only? Copy needs sign-off either way.
6. Post-approval edits: locked (withdraw-then-resubmit, the sketch — a published column silently reverting to pending mid-editorial is worse) or allowed-with-re-review (kwento's model)?
7. One column per guest per EVENT — confirm it reads right for multi-honoree event types before the pattern propagates.
8. Does the submission window close (e.g., T+30d with the editorial freeze / accountless closure, `page.tsx:1328-1332`) or stay open forever? Nothing in the sketch closes it.
9. Print consent: does one consent line cover the PRINTED keepsake, or copy kwento's separate `print_consent` column now (cheap) vs retrofit-by-migration later?

**Build ② — Chibi Avatar**
10. Avatar room-visibility default: strangers' chibis for every visitor (tokenless included) or the exact photos gate (`venue_photo_visibility` + token — recommended: a chosen skin tone/outfit is still guest-authored personal data under the conservative RA 10173 read)?
11. Chibi scale vs furniture (rig spec § 9.1): ~1.06 m against product-true 0.46 m seats / 0.74 m tables (recommended) vs scaled-up ~1.3.
12. Accessories + fun hair colours free at launch vs SKU/creator-drop later (§ 9.2/§ 9.4) — determines whether the maker needs an entitlement check in V1 (recommend: no, all free).
13. Blob deletion at PR-7 with no Classic fallback (§ 9.3) — confirm before the delete commit.
14. `guests.avatar_config` (this build, zero-account) vs the spec's `users.avatar_parts` (account-level): confirm guests-first + carry-over-on-claim as a later PR, so the spec text gets corrected rather than the build bent to it. Also: if PR-3's face-parts re-count pushes past ~40 batches on phones, pre-approve the degradation (style-bucketed head buffers vs no face relief in LOW crowd only).

**Build ③ — Papic Pool Bar**
15. Waive the "≥10,000 points held" top-up unlock rule during the live window (so Papic One / Free events can rescue themselves), or enforce it and point small events at Add-a-camera only? Nothing enforces it in code today — a rule-definition moment, not a refactor.
16. Trust-first ceiling: 1 open provisional top-up (+10,000 pts / ₱2,999 owed, ~₱230 real exposure) per event as default? And do Papic One camera adds (₱100/250 pts) trust-grant unlimited-count or share the cap?
17. Top-up quantum: +10,000/₱2,999 matches the directive, but the smallest rescue for a 50-pt Free event is a ₱100 camera — confirm no intermediate rung (e.g., +1,000) before the doorway ships.
18. Coordinator visibility vs purchase: meter visible to all coordinators with buy buttons gated on the couple-granted `'checkout'` permission (recommended, matches `checkout/actions.ts`), or hide the whole bar from non-payment coordinators?
19. Placement under open-browse: persistent host strip on `/[slug]` during T-1h..T+8h (recommended; `/hub` stays guest-only per the locked precedent) + a More-tab entry post-redesign — confirm, since the council's More tab currently lists only "Edit this site" as host chrome.
20. The anon-readable `papic_event_pool_status`: leave as-is (numbers only) and log in the privacy-reconciliation queue, or ship a narrowing migration (drop anon EXECUTE) alongside PR1 — shipped code reads it via the admin client, so the anon grant appears unused.

**Build ④ — QR Rotation (beyond the authority call above)**
21. Session revocation: PR-3 flip revokes already-minted sessions (recommended — it is the entire point for a leaked QR) but changes every guest's "my bookmark still works" expectation when a host rotates.
22. Guest self-rotation free everywhere (recommended — a security affordance, not an upsell) even though it makes the paid Custom-QR SKU's printed assets the thing most often invalidated?
23. Rate limits: 3/guest/24h (RPC) + 10/IP/hour (backstop) — and is a per-EVENT daily cap needed against a hostile coordinator mass-rotating the roster the night before?
24. Bulk "rotate all guests" for a mass leak (a print pack posted publicly): in scope now or follow-up? Per-guest-only V1 proposed.
25. May the host-rotation email include the NEW token URL to `guests.email` under the RA 10173 posture (host-entered addresses can be stale/wrong-person)? Alternative: "ask your host for the new link," no token.
26. Day-of: typed confirm (proposed) or hard-block during the live window with admin-only override?

**Build ⑤ — Run-of-Show**
27. Vendors: booked vendors can sequential-advance today (`20270321980372:119`). Jump-set too (the emcee case), or direct-set host+coordinator-only as the directive reads (current design excludes them)?
28. Explicit "between moments / paused" state (the `p_clear` branch) wanted, or exactly one live block once the day starts?
29. Private (`is_public=false`) block set live: generic "Something special is happening" teaser for guests, or plain fallback to the time-inferred view (current design: fallback)?
30. RSVP season: does the estimated schedule show to the no-QR public visitor too (council's Details tab implies yes via `is_public` blocks) — confirm "Estimated" labeling applies to the anonymous surface.
31. `NEXT_PUBLIC_GUEST_NOW_TRIGGER`: flip standalone once PR-3 lands, or bundle into the 5-tab open-browse go-live?

---

*Scribe note: per the relaxed sync mandate, this is a new dated corpus doc, written to `/Users/icecasasola/Documents/Claude/Projects/Setnayan/On_the_Day_App_Five_Build_Studies_2026-07-23.md`; a DECISION_LOG row should be appended when the owner signs off § 6.2 items. No iteration-stub bodies were touched.*
---

# § 7 · BUILD ⑥ — Shared Pool Gallery + Self-Link (same-day sixth study)

> Owner directive later the same session: guests browse the WHOLE pool gallery + link photos they're in — couple toggle DEFAULT OFF. Studied separately; its owner questions (6) are numbered independently below.

## ⑥ Shared Pool Gallery + Self-Link

### Verdict (3-5 sentences: shape, size, riskiest part)

This is a **one-migration + three-PR feature that reuses the entire existing tag rail**: the self-link is just a fourth writer of `photo_tags` with `source='manual_pick'` — a value the schema, the 10-cap trigger, the couple-gallery dot colouring, the guest "tagged of you" reader, the ZIP download, and the Story-reel photo set **all already handle**, so a linked photo becomes downloadable and reel-eligible with zero changes to any downstream reader. The new work is one `events` boolean (default FALSE = the go-live hold, since migrations auto-apply on merge), three SECURITY DEFINER RPCs mirroring shipped patterns (`papic_guest_missions` / `papic_tag_guest_capture` / `papic_vendor_challenge_photos`), and a session-gated guest page. Size: S-to-M (~2–4 focused days). The riskiest part is **privacy shape, not code**: the pool view exposes every guest's captures to every other guest before the couple's review pass, so the read RPC must carry the Live Wall's full read-time veto stack (strict `'clean'` allowlist + `photo_consent` veto + faceblock baked-blur rule + web-copies-only), and a latent quirk — the cap trigger counts tombstoned tags — can silently burn cap slots under link/unlink cycles.

### Grounding (bullet facts with file:line refs)

> ⚠ Worktree HEAD at `/Users/icecasasola/setnayan-wt-seo-geo` is **112 migrations behind `origin/main`** (branch `claude/seo-geo-life-event-os`, upstream gone). All refs below verified against `origin/main` (fetched 2026-07-23); migration files ≤ `20270215…` also exist identically in the worktree.

**(a) The pool reader**
- The couple's full-pool read is `fetchPapicGallery` — `apps/web/lib/papic-gallery.ts:64` (origin/main) — reading BOTH capture tables (`papic_photos` + `papic_guest_captures`) under couple RLS, **denylist** posture (`moderation_state !== 'nsfw_blocked'`, `!hidden_at` — lines 108–113), cap `GALLERY_LIMIT = 120` (line 55), **no pagination**. Its select list already includes the full web-copy column set: `r2_object_key, clip_web_r2_key, full_res_dropped_at, poster_r2_key, display_r2_key, thumb_r2_key` (lines 74, 82).
- It is served to native via `apps/web/app/api/events/[eventId]/papic-gallery/route.ts:14-40` — couple-session-token only. **No guest-facing "all captures" reader exists**; the closest are (1) the venue Live Wall (`wall_visible_photos`, below) and (2) the per-guest tagged read `getGuestLiveGallery` — `apps/web/lib/guest-live-gallery.ts:38`, which on origin/main is **strict allowlist**: `moderation_state = 'clean'` (lines 68, 84), `hidden_at IS NULL`, photos-only, and its `webRef` now resolves `thumb_r2_key ?? display_r2_key ?? undefined` — **never falls through to the geo-bearing `r2_object_key`** (lines 111–115).
- The gate template to mirror (PR #3541): `supabase/migrations/20270911359108_papic_vendor_challenge_photos_rpc.sql` (origin/main) — SECURITY DEFINER STABLE, returns **web-copy derivative refs only** (`display_r2_key, thumb_r2_key, poster_r2_key, clip_web_r2_key` — declared in RETURNS TABLE), gates `cap.moderation_state = 'clean' AND cap.hidden_at IS NULL`, comment: "Returns web-copy derivative refs only (never the geo-bearing original)."
- Web/original split: `clip_web_r2_key` added to both tables by `supabase/migrations/20270906703321_papic_clip_web_copy_at_capture.sql:20-24`; the outbound-teaser reader `fetchTeaserFrames` (`apps/web/lib/papic-gallery.ts:307` origin/main) documents the canon — "DISPLAY/THUMB derivative ONLY — never r2_object_key (the geo-bearing original). A frame with no such derivative is SKIPPED."
- Actual hidden column is **`hidden_at TIMESTAMPTZ`** (not `hidden`) on both capture tables.

**(b) The tag rail**
- `photo_tags` created in `supabase/migrations/20261104000959_papic_live_photo_wall_schema.sql:95-108`: polymorphic `source_table CHECK IN ('papic_photos','papic_guest_captures')` (line 99), `source CHECK IN ('individual_qr','table_qr','auto_face','manual_pick')` (line 102) — **`manual_pick` already exists in the enum, unused by any writer today** — and `UNIQUE (source_table, source_id, guest_id)` (line 105). RLS: member read (112–121) + admin ALL (122–125); **no user-facing write policy by design** (writes are DEFINER/service-role only).
- The 10-cap is enforced **twice**: (1) inside each tag RPC (pre-check + truncate — `20270111577244_papic_guest_qr_tagging.sql:51,112-116`), and (2) a DB-invariant BEFORE INSERT trigger `enforce_photo_tag_cap` — `supabase/migrations/20270110120000_photo_tags_cap_trigger.sql:25-47` — which at cap **RETURNs NULL (silent skip, never error)**, owner-locked 2026-06-17 across ALL sources incl. `manual_pick`. ⚠ It counts `count(*)` with **no `removed_at IS NULL` filter** (lines 32–36) — tombstones burn cap slots (the tombstone column landed later, `20270131081062`).
- Cookie/RPC pattern to mirror: the guest is the **zero-account cookie model** — signed JWT in cookie `setnayan_guest_session` (`apps/web/lib/guest-session.ts:4`, payload `{guest_id, event_id, qr_token}` lines 14–18). Two grant precedents exist: `papic_tag_guest_capture` (same table, cookie-validated route → admin client) is granted **`service_role` ONLY** (`20270111577244:198-199`); `papic_complete_mission` / `papic_guest_missions` (`20270902047075`, origin/main) are granted **`authenticated, anon`** with `p_guest_id` as capability + `pg_advisory_xact_lock(hashtextextended(p_guest_id...))` for idempotent upsert.
- The unlink precedent already ships: soft tombstone `removed_at TIMESTAMPTZ` / `removed_by CHECK IN ('guest','couple','admin')` — `supabase/migrations/20270131081062_photo_tags_guest_removal.sql` — with the guest "Not me" action pinned `source='auto_face'` + own `guest_id` (`apps/web/app/[slug]/actions.ts:427-432, 468-474`). Rationale in the migration header: hard DELETE would let auto-tag re-add the row; the tombstone row IS the gravestone.
- Downstream readers that make self-link "just work": `getGuestLiveGallery` reads `photo_tags … .is('removed_at', null)` source-agnostic (`lib/guest-live-gallery.ts:45-52`); the ZIP download route reads the same set (`app/papic/me/[token]/download/route.ts:47-51`, on-the-fly EXIF/GPS strip via `stripPhotoMetadata` line 8); the Story-reel photo set reads `photo_tags` (`lib/guest-stories-photo-set.ts:15`); the couple gallery already maps `manual_pick → 'manual'` dot colour (`lib/papic-gallery.ts:48`).

**(c) The toggle**
- Events-column toggle precedent: `events.live_photo_wall_visibility TEXT NOT NULL DEFAULT 'tagged_only' CHECK IN ('tagged_only','all_with_consent','off')` — `20261104000959:78-80` — flipped from the couple studio surface.
- The coming site system reserves **`events.website_open_browse DEFAULT false`** and `invitation_widgets.mode ('auto'|'shown'|'hidden')` for the *website sections* (corpus `Guest_Event_Website_Open_Browse_Council_Verdict_2026-07-22.md` §verdict + §1.4) — the pool toggle is a **different axis** (capture-pool exposure, not section visibility) and should be its own events column, not a widget mode.
- Who can flip: `couple_can_update_event` RLS = couple or admin (`20260513040000:90-96`). Coordinators have **read-only** on events (`events_moderator_read`, `20261129003000:262-263`); but the Papic wall control actions are membership-gated couple/**coordinator** then written via admin client (`app/dashboard/[eventId]/studio/papic/_components/live-wall-actions.ts:1-50`) — so coordinator-flip is a choice, not a constraint.
- Inert-ship law: migrations auto-apply on merge (`supabase-migrations.yml`; memory `project_setnayan_migrations_autoapply`) — **the DEFAULT FALSE column is the go-live hold**, and every RPC must early-return empty/fail when the flag is FALSE so the merged migration is dead weight until a couple flips.

**(d) Privacy gates**
- Guest-side controls that must veto the pool: `guests.photo_consent BOOLEAN NOT NULL DEFAULT TRUE` (drop entirely — `20260513010000:118`); `guests.faceblock_enabled` (blur on public surfaces, couple still sees clear — `20261104000959:67-70`); `guests.face_recognition_excluded` (host-set minor safeguard, face-vector-scoped only — `20270517638525:22-26`).
- The Live Wall read RPC is the canonical guest-to-guest veto stack: `wall_visible_photos` re-checks at READ time — tagged-guest `photo_consent = FALSE` veto + faceblock events serve **only rows with `faceblock_baked_at` baked blur** (`wall_safe_r2_key`), fail-closed — `20261112000545:82-140` and v2 `20261115000604:179-200`.
- `moderation_state` allowlist `'clean'` (CHECK includes `'consent_withheld'`/`'faceblock_withheld'` — `20261104000959:48-54`) is the strict outbound posture (`life-story-moment-graph.ts:626-627` names it the RA-10173 filter); `'unscreened'` fails CLOSED under it — captures appear in the pool only after the NSFW screen.
- 7-day couple review window applies to the **Drive release** (`app/dashboard/[eventId]/studio/photo-delivery/page.tsx:206,275`), not to in-event surfaces — the wall already shows unreviewed captures live; the pool inherits that posture, mitigated by default-OFF + read-time `hidden_at` (couple hide is retroactive on next read).
- URL hygiene: existing guest media is served via presigned derivative URLs or the stable streaming route `app/papic/media/[...key]/route.ts` (media bucket only, "geo-stripped derivative … never a raw geo-bearing original"). ⚠ Guest-capture R2 keys embed the shooter's `guest_id` in the path — `papic/guest/${session.guest_id}/papic-${stamp}.jpg` (`app/api/papic/guest-capture/route.ts:320-322`) — so any served URL pseudonymously identifies the shooter (exposure already exists on the tagged gallery; the pool widens it to all guests).
- noindex precedent on every token-adjacent guest page: `robots: { index: false, follow: false }` (`app/papic/join/[token]/page.tsx:40`, `demo/[token]/page.tsx:19`).

**(e) UI surfaces**
- The coming guest site is the **five-tab open-browse** architecture (Home · Details · Story · **Photos** · Me), per-event `website_open_browse DEFAULT false`, Photos tab already slated to hold "per-guest tagged gallery (guest only), Papic camera + roll" (corpus council verdict, Photos-tab row). The couple manager mirror is `/dashboard/[eventId]/website` — five section rows with auto-populate chips ("Photos · fills from Papic on the day") + the board-header "Open browsing" toggle (verdict §1.4).
- Today's guest gallery card to mirror: the `/papic/me/[token]` "Photos of you" grid — 3-col thumbs, presigned raw `<img>`, full-size link through the metadata-stripping `photo` route, ZIP download, Kwento decorate via the `/session` cookie bridge, `GuestStoryMaker` (`app/papic/me/[token]/page.tsx:44-110`).
- Host toggle placement precedent: the `LiveWallCard` row on the couple studio page (`app/dashboard/[eventId]/studio/papic/page.tsx:649`).
- Pool sizes reach 3,000–10,000+ points per event (corpus `0012_papic/Papic_One_Pool_Model_Spec_2026-07-22.md` §0) — the 120-cap no-pagination `fetchPapicGallery` shape is NOT reusable; keyset precedent exists (`wall_visible_photos(p_event_id, p_since)`).

### Schema changes (SQL sketches: column, RPCs guest_pool_gallery / guest_link_capture / guest_unlink_capture, RLS)

```sql
-- 1. The couple toggle — the go-live hold (migrations auto-apply; FALSE = inert).
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS pool_gallery_open BOOLEAN NOT NULL DEFAULT FALSE;
COMMENT ON COLUMN public.events.pool_gallery_open IS
  'Couple opt-in: guests may browse the WHOLE Papic pool (web copies, clean-screened) and self-link. DEFAULT FALSE is the ship gate. Distinct from website_open_browse (site sections) and live_photo_wall_visibility (venue wall).';

-- 2. Pool reader — mirrors papic_vendor_challenge_photos' web-copy/clean/hidden gates
--    + wall_visible_photos' read-time consent/faceblock vetoes. Keyset-paginated.
CREATE OR REPLACE FUNCTION public.guest_pool_gallery(
  p_guest_id UUID,
  p_before   TIMESTAMPTZ DEFAULT 'infinity',
  p_limit    INT DEFAULT 60
) RETURNS TABLE (
  source_table    TEXT, source_id UUID, media_type TEXT,
  display_r2_key  TEXT, thumb_r2_key TEXT, poster_r2_key TEXT, clip_web_r2_key TEXT,
  wall_safe_r2_key TEXT,          -- served INSTEAD of display on faceblock events
  captured_at     TIMESTAMPTZ,
  linked          BOOLEAN         -- this guest's own live manual/QR/face tag exists
) LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public AS $$
DECLARE
  v_event UUID;  v_fb BOOLEAN;
BEGIN
  SELECT g.event_id INTO v_event FROM public.guests g
   WHERE g.guest_id = p_guest_id AND g.deleted_at IS NULL;
  IF v_event IS NULL THEN RETURN; END IF;
  -- COUPLE TOGGLE gate — flag off ⇒ empty (the inert hold).
  IF NOT EXISTS (SELECT 1 FROM public.events e
                 WHERE e.event_id = v_event AND e.pool_gallery_open) THEN RETURN; END IF;
  v_fb := EXISTS (SELECT 1 FROM public.guests g
                  WHERE g.event_id = v_event AND g.faceblock_enabled AND g.deleted_at IS NULL);
  RETURN QUERY
  SELECT * FROM (
    SELECT 'papic_photos', pp.photo_id, pp.photo_type,
           pp.display_r2_key, pp.thumb_r2_key, pp.poster_r2_key, pp.clip_web_r2_key,
           pp.wall_safe_r2_key, pp.captured_at,
           EXISTS (SELECT 1 FROM public.photo_tags pt WHERE pt.source_table='papic_photos'
                   AND pt.source_id=pp.photo_id AND pt.guest_id=p_guest_id AND pt.removed_at IS NULL)
    FROM public.papic_photos pp
    WHERE pp.event_id = v_event
      AND pp.moderation_state = 'clean' AND pp.hidden_at IS NULL         -- strict allowlist (#3541)
      AND (pp.display_r2_key IS NOT NULL OR pp.thumb_r2_key IS NOT NULL) -- web copy or skip; NEVER r2_object_key
      AND (NOT v_fb OR pp.faceblock_baked_at IS NOT NULL)                -- wall v2 rule, fail-closed
      AND NOT EXISTS (SELECT 1 FROM public.photo_tags pt                 -- G2 photo_consent veto
                      JOIN public.guests g2 ON g2.guest_id = pt.guest_id
                      WHERE pt.source_table='papic_photos' AND pt.source_id=pp.photo_id
                        AND g2.photo_consent = FALSE)
    UNION ALL
    SELECT 'papic_guest_captures', gc.capture_id, gc.media_type, /* same column/gate stack on gc */ …
  ) pool
  WHERE pool.captured_at < p_before
  ORDER BY pool.captured_at DESC
  LIMIT LEAST(GREATEST(p_limit, 1), 60);
END; $$;
REVOKE ALL ON FUNCTION public.guest_pool_gallery FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.guest_pool_gallery TO service_role;
-- Grant note: the directive named the papic_complete_mission anon-grant mirror; the CLOSER
-- precedent on this exact rail (papic_tag_guest_capture, 20270111577244:198) is service_role-only
-- with the cookie-validating route as the gate. All callers are Next routes → the tighter grant
-- costs nothing. Flip to `authenticated, anon` only if a client-direct call path is wanted.

-- 3. Self-link — "I'm in this". Idempotent per (photo, guest); graceful at cap.
CREATE OR REPLACE FUNCTION public.guest_link_capture(
  p_guest_id UUID, p_source_table TEXT, p_source_id UUID
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_event UUID; v_current INT; v_row public.photo_tags;
BEGIN
  -- guest live + toggle open + the capture passes THE SAME pool gates (a guest can
  -- only link what the pool would show them: same-event, clean, not hidden, web copy).
  … (resolve v_event as above; verify capture row under the §2 gate stack; else {'ok',false,'error','not_in_pool'}) …
  PERFORM pg_advisory_xact_lock(hashtextextended(p_source_id::text, 0));  -- papic_complete_mission pattern
  SELECT * INTO v_row FROM public.photo_tags
   WHERE source_table=p_source_table AND source_id=p_source_id AND guest_id=p_guest_id;
  IF FOUND THEN
    IF v_row.removed_at IS NULL THEN RETURN jsonb_build_object('ok',true,'already',true); END IF;
    IF v_row.removed_by = 'guest' THEN                        -- revive OWN tombstone as manual_pick
      UPDATE public.photo_tags SET removed_at=NULL, removed_by=NULL, source='manual_pick'
       WHERE tag_id=v_row.tag_id;
      RETURN jsonb_build_object('ok',true,'revived',true);
    END IF;
    RETURN jsonb_build_object('ok',false,'error','removed_by_host'); -- couple/admin removal is final
  END IF;
  SELECT count(*) INTO v_current FROM public.photo_tags
   WHERE source_table=p_source_table AND source_id=p_source_id AND removed_at IS NULL;
  IF v_current >= 10 THEN RETURN jsonb_build_object('ok',false,'error','cap_reached'); END IF;
  -- Pre-check is MANDATORY: the cap trigger (20270110120000) silently skips at cap —
  -- without this check an at-cap link would look like success while inserting nothing.
  INSERT INTO public.photo_tags (event_id, source_table, source_id, guest_id, source)
  VALUES (v_event, p_source_table, p_source_id, p_guest_id, 'manual_pick')
  ON CONFLICT (source_table, source_id, guest_id) DO NOTHING;
  RETURN jsonb_build_object('ok',true,'tag_count',v_current+1,'cap_reached',v_current+1>=10);
END; $$;
GRANT EXECUTE … TO service_role;   -- same grant note

-- 4. Unlink — the guest removes their OWN self-link. Soft tombstone (20270131081062
--    pattern), pinned to source='manual_pick' + own guest_id (the auto_face "Not me"
--    action stays its own path). Idempotent: 0 rows updated = still ok.
CREATE OR REPLACE FUNCTION public.guest_unlink_capture(
  p_guest_id UUID, p_source_table TEXT, p_source_id UUID
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.photo_tags SET removed_at = now(), removed_by = 'guest'
   WHERE source_table = p_source_table AND source_id = p_source_id
     AND guest_id = p_guest_id AND source = 'manual_pick' AND removed_at IS NULL;
  RETURN jsonb_build_object('ok', true);
END; $$;
GRANT EXECUTE … TO service_role;
```

**RLS:** none new. `photo_tags` keeps its no-user-write posture (writes only via these DEFINER RPCs / service role — same as the whole tag rail); the pool read never touches table RLS (DEFINER); the toggle rides existing `couple_can_update_event`. No policy on `events` changes.

### UI surfaces

- **Guest — "Everyone's gallery" card (Photos tab of the coming 5-tab site; interim doorway on `/papic/me/[token]`).** Session-gated route (e.g. `/papic/pool`), reached only through the `setnayan_guest_session` cookie — reuse the `/papic/me/[token]/session` bridge (`app/papic/me/[token]/page.tsx:100-106`) so no guest token ever appears in the pool URL. Renders **only when `pool_gallery_open`** (server-checked; the card simply doesn't exist otherwise — no fake door). Grid mirrors the Me-page 3-col presigned-thumb grid; tile overlay = **"I'm in this"** button (POST `/api/papic/guest-pool-link`) flipping to a linked check + "Remove" (unlink). Keyset "Load more" via `p_before` cursor, 60/page — flat for 3,000+ captures. `robots: { index:false, follow:false }` (join/demo page pattern). Self-linked photos appear in "Your gallery · Tagged of you", the ZIP download, and the Story-reel picker **automatically** — all three read `photo_tags … removed_at IS NULL` source-agnostically.
- **Host — studio row + manager mirror.** A `PoolGalleryCard` beside `LiveWallCard` (`studio/papic/page.tsx:649`): toggle + copy stating exactly what opens ("every guest can browse ALL clean-screened photos — web copies only — and tag themselves"), membership-gated server action in the `live-wall-actions.ts` shape. When the open-browse manager board (`/dashboard/[eventId]/website`, verdict §1.4) lands, its **Photos row** gains the "Everyone's gallery" status chip + the same toggle, next to the board-header "Open browsing" switch — two different switches, labelled apart.
- **Couple gallery** needs zero change: `manual_pick` already colours as `'manual'` (`lib/papic-gallery.ts:48`), so self-links are visible to the couple by dot colour, and the couple's existing hide/moderation surface retroactively pulls a photo from the pool.

### PR plan (ordered, each step's gate/flag + rollback)

1. **PR-A · Migration only** — `pool_gallery_open` column + the 3 RPCs + tests (RPC returns empty when flag FALSE; cap pre-check; tombstone revive/deny matrix). *Gate:* merge = live DB, but everything is inert — the DEFAULT FALSE column IS the hold, and every RPC early-returns on it. *Rollback:* none needed (additive, dead until flipped); worst case `DROP FUNCTION`s.
2. **PR-B · Guest surface** — `/papic/pool` page + `/api/papic/guest-pool-link` + `/api/papic/guest-pool-unlink` routes (cookie-validated → admin client → RPC, the `papic_tag_guest_capture` route shape) + Me-page doorway card. *Gate:* double-gated — env `NEXT_PUBLIC_PAPIC_POOL_GALLERY` (call-site flag, `NEXT_PUBLIC_PAPIC_GAMES_V1` pattern) AND the per-event couple toggle; ships with env OFF. *Rollback:* env off (surface vanishes; DB untouched).
3. **PR-C · Host toggle** — `PoolGalleryCard` on studio/papic + server action + privacy copy. *Gate:* same env flag; toggling without PR-B live does nothing (RPCs still gated per-event). *Rollback:* env off; per-event toggle back to FALSE closes the pool instantly (read-time gate).
4. **PR-D · Manager-board mirror + hardening** — Photos-row chip/toggle on `/dashboard/[eventId]/website` (blocked on the open-browse manager build), CI test asserting the pool RPC's select list can never contain `r2_object_key`, and the Games-panel/Kwento cross-links. *Gate:* rides the open-browse program's own sequencing locks. *Rollback:* independent, revertable.

Go-live = flip env in Vercel, then couples opt in per event. No migration is ever the go-live act.

### Risks

- **Full-pool exposure precedes couple review.** The 7-day window governs Drive release only; an open pool shows unreviewed (but clean-screened) captures to all guests, like the Live Wall but browsable + downloadable. Mitigations: default OFF, opt-in copy that says so, retroactive `hidden_at`, strict `'clean'` allowlist (unscreened waits), consent veto, faceblock baked-blur-or-excluded.
- **Cap-trigger counts tombstones** (`20270110120000:32-36` has no `removed_at` filter): link→unlink cycles permanently consume slots of the locked 10-cap; a photo with 10 tombstones rejects all future tags including QR/face. The RPC's own count filters live rows, so RPC and trigger can disagree (RPC says room, trigger silently skips). Needs a one-line trigger amendment — but that touches locked-cap semantics → owner sign-off, listed below.
- **Self-link is an unverified assertion.** Any session guest can claim any pool photo; effect is bounded (the pool already shows them everything) but a false link pollutes "tagged of you", the couple's tag dots, and excludes that guest from auto-face on that photo (`lib/face-match.ts` reads existing tags as already-tagged). The couple-side removal (`removed_by='couple'`) is the recourse; the RPC's "host removal is final" rule prevents re-assertion.
- **Shooter `guest_id` in R2 key paths** (`guest-capture/route.ts:320-322`) leaks pseudonymous shooter identity through every served derivative URL — an existing exposure the pool widens from "guests tagged with you" to "every guest". UUID-as-capability, but a persistent correlator.
- **Grant-surface drift.** If the anon grant (mission-RPC mirror) is chosen over service_role-only, `p_guest_id` becomes a directly PostgREST-callable capability — same trust shape the mission RPCs already accepted, but this one returns the whole pool.
- **Scale**: 3,000–10,000-point events make the presign fan-out (60/page × R2 sign) the hot cost; the stable `/papic/media` streaming route is the pressure valve if presign volume bites.

### Open owner questions

1. **Who can flip the toggle** — couple only (events RLS today), or couple + coordinator (the wall-controls precedent, `live-wall-actions.ts`)? Coordinator canon is "propose-not-execute"; this is a privacy switch, so recommend **couple-only** — confirm.
2. **Clips in the pool?** Recommend browse = photos + clips (poster + `clip_web_r2_key` playback), but **self-link = photos-only in V1** (the Story reel set and the tagged gallery are photo pipelines; a clip self-link buys nothing yet). Confirm.
3. **Cap-trigger amendment** — add `AND removed_at IS NULL` to `enforce_photo_tag_cap`'s count so tombstones stop burning slots of the locked 10-cap. One line, but it modifies owner-locked (2026-06-17) enforcement — sign-off needed.
4. **Pool lifetime** — does the pool close when the 6-month Papic access window ends (`Papic_Pricing_Lock_2026-07-20.md` retention), or stay open as long as the toggle is on? Recommend it follows the access window.
5. **Two toggles, one Photos surface** — `website_open_browse` (site sections) and `pool_gallery_open` will sit near each other on the coming manager board. Keep separate (recommended: different privacy stakes), or nest pool under open-browse?
6. **Faceblock posture** — pool follows the wall v2 rule (baked blur or excluded). On a faceblock event this can blank most of the pool until the bake catches up; acceptable, or defer pool availability on faceblock events entirely?