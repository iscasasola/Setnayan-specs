# Papic v3 — Build Brief (2026-07-17) · executable handoff for `apps/web`

> **Status:** the Papic model is decision-complete (see `Papic_Good_Better_Best_Pricing_2026-07-17.md` + `Pricing.md` § 2.1/§ 2.1a). This brief is the **build plan** — produced by an 11-agent workflow (7 area drafters → 3 adversarial critics → synthesis), grounded in the **real repo** (`/Users/icecasasola/Documents/Claude/Projects/setnayan-platform`, `apps/web`). **12 PRs, schema-first.** Wedding Papic can ship; **Papic Lite ships dark behind `NEXT_PUBLIC_PAPIC_LITE_ENABLED`** and cannot go public until counsel/DPO + an instant-pay rail clear (see Gates).
>
> ⚠ **Repo work is NOT corpus-authorized by default** (per `CLAUDE.md`: corpus-edit rights do not extend to repo code). Migrations touch a live prod DB — the "Verify on prod" items below must be checked before each migration runs.

## Canonical rulings (the four collisions the drafters hit, resolved)

1. **Tier vocabulary** — KEEP legacy `paparazzi_seats.tier` values `'free'/'roll'/'unlimited'` (never-rename-technical-ids lock); **ADD** `'mini'`/`'ltd'`. Do NOT rename to `unli`/`lite`. The point budget resolves from an **admin-editable `papic_tier_config` table**, never a hardcoded TS map.
2. **Quality column** — ONE column `events.papic_quality_tier` (`full_res`|`optimal`|`high_efficiency`), written by the setup UI and read by ingest (kills the write-`papic_quality`/read-`papic_quality_tier` fake door). New type `PapicFidelityTier` (distinct from adaptive-quality's network-tier `PapicQualityTier`).
3. **Papic Lite storage** — a **dedicated `papic_lite_captures`** table + standalone `papic_lite_participants`; **never** `papic_photos`, **never** a `paparazzi_seats` `tier='lite'` (that would breach the feature-loss firewall). Lite pools key on **UUID** (no `generate_public_id` — all A–Z letters are taken, `'L'` collides with `event_playlist_picks`).
4. **Full-res drop** — the **Drive-aware defer guard wins**: never delete an R2 original for a Drive-connected event until `copied_high_res` is confirmed. Compressed gallery kept **indefinitely**; only per-event **face-vectors** expire at ~5 yr (resolves the forever-vs-5yr tension).

**The single biggest correctness gap all 3 critics found independently:** the "Free = 3 seats × 20 points" cap has nothing to bind to — free cameras are never provisioned as `tier='free'` per-camera seats today, so **PR-3 must provision them or the free cap is a pure fake door** (free capture stays unlimited).

## PR sequence (schema-first; all files `20270821+`)

| PR | Title | Depends | Flag |
|---|---|---|---|
| **1** | Capture-points ledger + tier vocab + rate SKUs | — | none |
| **2** | Wedding-only event_type-aware peso caps + money-integrity trigger | 1 | none |
| **3** | Points enforcement wiring + **free-tier per-camera provisioning** | 1,2 | none |
| **4** | Per-event quality/fidelity tier (one column, UI+ingest reconciled) | 1 | none |
| **5** | 6-month Drive-aware drop + 5yr face-vector expiry + Keep-Full-Res retirement | — | `PAPIC_FULLRES_DROP_ENABLED` + Drive-live + buyer-disposition |
| **6** | Full-res download (per-photo/event-ZIP/account-export) + Drive widgets | 5 | none |
| **7** | Catalog: Thank You ₱2,500, add-on inclusion helper, retire Unlock bundles | 1,3 | none |
| **8** | Setup UI: Papic-vs-Lite fork, camera builder, quality picker, included add-ons | 2,3,4,7 | Lite branch behind flag |
| **9** | Papic Lite — canonical schema (5 tables + RLS at create + ladder seed) | 1 | `NEXT_PUBLIC_PAPIC_LITE_ENABLED` off |
| **10** | Papic Lite — atomic shared-pool RPCs + join/capture/claim/report routes | 9 | flag off |
| **11** | Papic Lite — host dashboard + participant capture UI | 9,10 | flag off; public blocked on gates |
| **12** | Retired-SKU surface sweep (Unlock/Keep-Full-Res/Photo-Wall everywhere) | 7 | none |

**Key per-PR notes:**
- **PR-1:** widen `paparazzi_seats.tier` CHECK (verify the auto-gen constraint name in prod first); `papic_tier_config` (Pattern H, RLS at create); seed rate SKUs `PAPIC_CAMERA_MINI_DAY ₱30` + `PAPIC_CAMERA_LTD_DAY ₱50` **before** the config FK; `papic_seat_day_usage.points_used` (+ backfill `photos+videos*3`, keep old cols for lineage); RPCs `papic_reserve_camera_points` / `papic_camera_points_remaining` (SECURITY DEFINER, atomic wallet-spend pattern, budget resolved from config).
- **PR-2:** `papic_mini_cap_php DEFAULT 6000`; backfill ONLY rows at the **verified** live old defaults; **`events_papic_caps_admin_only` BEFORE-UPDATE trigger is REQUIRED** (couples have unrestricted row UPDATE → could self-discount); `resolveEffectiveCaps(eventType,…)` returns clamps for `wedding`, **null/uncapped for all others**; `PAPIC_FREE_CAMERA_COUNT 5→3`, `PAPIC_MIN_PAID_CAMERAS 5→1`.
- **PR-3:** provision 3 free cameras as `tier='free'` seats; presign gate → 409 `camera_points_exhausted` (no orphan bytes); record layer authoritative, **fail-CLOSED except function-not-found during the seam cutover**; cut both seams (presign+record) to points in ONE PR.
- **PR-5:** `DEFAULT_FULL_RES_RETENTION_DAYS 90→180`; **Drive-aware defer guard mandatory**; remove `HIGH_RES_ARCHIVE` skip + deactivate SKU (owner-gated); rewrite the 30-day drop-warning to two-outcome copy; `guest_face_enrollments.vector_expired_at` + `runFaceVectorExpirySweep` (anchor `GREATEST(event_date,created_at)+1825d`, **never touch `user_face_profiles`** — pin with a test), on `claimPeriodicJob`.
- **PR-7:** `eventHasPaidPapicTier` **fail-CLOSED, ACTIVE-only**, excludes Free+Lite → wired into Kwento/Pabati/Guest-Stories; add a **server-side** entitlement gate on the Thank You order path (today UI-gated only); do NOT deactivate the KWENTO/PABATI/STORIES SKUs (the runtime helper is the gate).
- **PR-10:** `papic_lite_reserve_capture` atomic CAS on the single pool row + per-participant fair-use with a **compensating decrement on subcap rejection** (parenthesize the WHERE — a draft had an operator-precedence bug matching across pools); fast pool-full pre-read **before** the R2 PUT; after() chain = NSFW (non-disableable) → **CSAM hash (counsel-gated stub before public)** → derivatives; never call face/reels/Kwento/Drive paths.

## Reuse map (extend, don't rebuild)

- `lib/papic-cameras.ts` (the ledger/caps home), migration `20270301349537` (`papic_reserve_camera_capture`/`wallet_spend` — the atomic pattern forked for both points RPCs), `20270301225458` (`paparazzi_seats`+`papic_seat_day_usage`+RLS template), `20270302361811` (per-tier cap columns).
- `app/api/upload/route.ts` + `app/papic/actions.ts` (the two enforcement seams). `lib/papic-derivatives.ts` `toAvif` #3082 + `stripPhotoMetadata`. `lib/papic-fullres-drop*` #3110. `lib/papic-drive*` + `drive_copy_artifacts` + `DriveConnectCard`/`DriveSafetyPanel`. `lib/periodic-jobs.ts` `claimPeriodicJob` (all timers; Vercel crons stay `[]`). `lib/papic-storage-telemetry.ts` #3063 (Lite metering). `lib/guest-session.ts` (Lite participant JWT). `lib/nsfw-screen.ts` + `ugc_moderation` (`user_reports`/`report_guest_capture` — Lite report/block).
- RLS: `is_admin()` + `event_members(member_type='couple')`; Pattern H for config/tier tables. **No invented patterns.**

## ⚠ NEEDS BEFORE BUILD — the irreducible list

**Verify on prod (a DB query or `supabase migration list` — can't be done from the corpus):**
- Latest applied migration timestamp (use `20270821+`; some drafts used pre-history stamps that would break Supabase migration-history).
- `SELECT DISTINCT papic_ltd_cap_php, papic_unli_cap_php FROM events` — the PR-2 backfill predicate must target ACTUAL live old defaults (critics disagreed 6000/10000 vs 5999/11999 vs 9000).
- The auto-gen `paparazzi_seats_tier_check` constraint name before the widen.
- Live order counts for `HIGH_RES_ARCHIVE` and `PAPIC_UNLOCK`/`PAPIC_UNLOCK_LTD` before deactivating.
- Confirm no real couple photos already aged past the live 90-day drop before widening to 180.

**Owner decisions (change existing customers / money):**
- **Legacy `'roll'` remap:** → **Mini** (20 pts/₱6000 cap — matches what ₱30 roll buyers paid; *recommended*) vs → Ltd (over-grants). Locks the PR-1 migration.
- **Grandfather/refund** for existing Keep-Full-Res + Unlock buyers (highest data-loss risk; before PR-5/PR-7 enable).
- **Wedding cap semantics:** per-**order-total** ceiling (brief's assumption) vs per-day×days.
- **event_type → mode map:** life-non-wedding (birthday/debut/christening/gender_reveal/anniversary/graduation) = full Papic uncapped; simple_event family = Lite. Confirm reunion + fork-vs-auto-route.
- **Guest-list Limited snapshot path** (`papic_limited_snapshots`): keep as auto-provision (brief) vs retire.
- **Lite defaults:** per-participant fair-use sub-cap + free preview_budget size.
- **`Free = reels ON`** means the personal-reel builder (yes) NOT the Guest Stories add-on (no) — nail the copy before PR-7/8.
- Ratify **UUID-only** `papic_lite_pools` (no public_id).

**Owner actions (infra/env):**
- Set `RESEND_API_KEY`/`RESEND_FROM` (export links + drop-warning emails no-op without them).
- Complete **Google OAuth verified-app review** (`drive.file`) — Drive is now the ONLY surviving-originals path, so **gate the drop-enable on Drive being live in prod.**
- Decide the **instant-pay rail** (PayMongo eval) — Lite same-day PAID activation blocks on it; ship the free-preview bridge + fast manual approval first.
- Add `@aws-sdk/lib-storage` to `apps/web/package.json` (streaming large export ZIPs). B2 cold tier stays flag-gated/deferred.

**Counsel + DPO (block flipping `NEXT_PUBLIC_PAPIC_LITE_ENABLED` public):**
- **CSAM known-hash matcher is NET-NEW** (no PhotoDNA/NCMEC integration today) + mandatory-reporting review — an open, public-QR, no-gate pool materially raises exposure.
- RA 10173: bystander/subject consent at QR-join, public takedown (no face-search), magic-link consent+Sybil record, minors-in-crowd (concerts/reunions); `/privacy` corpus must cover the Lite flow.
- **DPO:** face-vector expiry anchor + whether the enrollment **selfie** biometric is purged at expiry; `user_face_profiles` retention proportionality.
- **Security/DPO:** `oauth_grants.refresh_token` is **PLAINTEXT today** — decide app-layer envelope encryption vs service-role-RLS+at-rest before Drive GA.

## Open risks (must-hold invariants)

Free-cap fake door (PR-3 must land WITH the 3-seat display change) · record-layer reserve fail-CLOSED except fn-not-found · Lite single-hot-row throughput (fast pre-read + accepts/sec limiter; not advisory-lock-per-event; load-test) · Drive-aware drop-defer mandatory + stuck-copy escape valve (attempt≥5 → admin alert) · caps self-edit trigger same-release · irreversible fidelity downscale confirm · non-wedding uncapped → BIR/VAT on larger base (consider a sanity max) · **clip-video storage tail unbounded** (nobody owns clip retention) · orphan-AVIF drain must reject not silently succeed · biometric-expiry sweep has **no cron SLA** on a low-traffic solo-admin platform (manual trigger + monitoring; flag to DPO).
