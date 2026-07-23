# ▶ Live Studio Roam — RESUME HERE (handoff 2026-07-23)

> **Purpose:** everything a fresh session needs to continue Live Studio Roam without re-deriving. Canonical design: [`Live_Studio_Cast_and_Roam_2026-07-23.md`](Live_Studio_Cast_and_Roam_2026-07-23.md). Decisions: `DECISION_LOG.md` (2026-07-23 rows). Code repo: `~/Documents/Claude/Projects/setnayan-platform` (work off `origin/main`; local checkout runs stale).

## TL;DR
**Live Studio = 2 variants** (owner 2026-07-23): **Cast ₱2,500/day** (existing directed single-feed; couple's own OBS→own YouTube; ~₱0 to us) + **Roam ₱3,500/day** (NEW: guests pick which camera / wander the venue — multi-cam, multi-venue, on the event page, directed feed as default). Roam streams on a **Setnayan-owned YouTube channel pool** (₱0 streaming — cameras push direct to YouTube; YouTube absorbs viewers). Base Roam = **cameras BYO** (phones join via QR claim, ~₱0 COGS like Cast); a **Setnayan camera kit is a SEPARATE add-on** (not included at ₱3,500 — owner to confirm). Naming: code namespace = `live_studio_roam_*`; legacy Cast keeps `panood_*`.

---

## ✅ BUILT — all merged to `main` + migrations applied, ALL FLAG-DARK
Master switch **`NEXT_PUBLIC_LIVE_STUDIO_ROAM_ENABLED`** = OFF, and SKU `LIVE_STUDIO_ROAM` `is_active=FALSE`. Nothing is visible or sellable.

| PR | What shipped |
|---|---|
| #3579 | Foundation: schema + `lib/live-studio-roam.ts` + viewer picker component |
| #3582 | Picker wired into the public event page |
| #3588 | Provisioning spine (channel-pool lifecycle + manifest mirror + pure builder) |
| #3591 | Rename `panood_roam_*` → `live_studio_roam_*` |
| #3592 | SKU (₱3,500/day) + Suite/Studio tile + App Store detail + recommendation classification |

### Code map (where everything is, on `origin/main`)
- **DB (prod):** `live_studio_roam_zones` (couple-managed, control-room RLS) · `live_studio_roam_channel_pool` (Setnayan channels, admin RLS) · `live_studio_roam_streams` (N broadcasts/event, service-role only, holds secret stream_key) · `events.live_studio_roam_manifest` (public picker mirror, non-secret videoIds). Migrations: `20270918111955` (foundation) → `20270919193341` (rename) → `20270919479280` (SKU).
- **`apps/web/lib/live-studio-roam.ts`** — flag `liveStudioRoamEnabled()`, manifest types (`RoamManifest`, `RoamZoneManifestEntry`, `RoamZoneStatus`), pure helpers `parseRoamManifest` (video-id injection barrier) · `selectFeaturedZone` · `groupZonesByVenue` · `fetchRoamManifest`.
- **`apps/web/lib/live-studio-roam-provision.ts`** — `buildRoamManifest` (pure, tested) · `mirrorRoamManifest` · `checkoutPoolChannel`/`returnPoolChannel` · **`provisionRoamBroadcasts` = documented SCAFFOLD, NOT wired** (the remaining code — see below).
- **`apps/web/app/[slug]/_components/roam-watch-picker.tsx`** — `RoamWatchPicker` (main player + venue-grouped camera picker).
- **`apps/web/app/[slug]/page.tsx`** — Roam manifest rides on the existing `watchLive.roam`; `WatchLiveBlock` swaps the single embed for the picker when present. Zero-impact when flag off.
- **Catalog/tile:** `apps/web/lib/add-ons-catalog.ts` (flag-gated `LIVE_STUDIO_ROAM_ENTRY`; existing tile relabeled **"Live Studio Cast"**) · `apps/web/lib/add-ons-detail.ts` (flag-gated detail) · `apps/web/lib/studio-recommendations.ts` (`STUDIO_PEAK_MONTHS['live-studio-roam']=2`, flag-gated) · `apps/web/lib/v2-catalog.ts` (`BUILD_STATUS.LIVE_STUDIO_ROAM='partial'`).
- **Tests:** `lib/live-studio-roam.test.ts` + `lib/live-studio-roam-provision.test.ts`. ⚠ Full unit suite MUST pass with the flag BOTH off AND on (`NEXT_PUBLIC_LIVE_STUDIO_ROAM_ENABLED=true pnpm test:unit`) — the drift guards cross-check catalog ⟷ peak-months ⟷ detail.

---

## 🔴 REMAINING CODE
1. **YouTube broadcast orchestration** (the one real gap). Wire `provisionRoamBroadcasts` in `lib/live-studio-roam-provision.ts`: for each zone → `createYoutubeBroadcast`/`createYoutubeStream`/`bindYoutubeBroadcast` (reuse **`lib/panood-youtube.ts`** — the full lifecycle already exists for Cast) → insert `live_studio_roam_streams` rows → `mirrorRoamManifest`. **Blocker:** needs the POOL CHANNEL's own OAuth access token. Today's `lib/panood-broadcast.ts` `getEventYoutubeAccessToken` reads `oauth_grants` keyed by **event_id** (per-couple/BYO). Roam needs a token keyed by **pool channel** — a new `getPoolChannelAccessToken(channelPoolId)` + storing the pool channel's grant (in `oauth_grants` with a channel key, or a token column on `live_studio_roam_channel_pool`). **Gated on owner G1 (a verified Setnayan channel exists).**
2. **Native RTMP capture app** — kit/phone cameras push direct to YouTube (browsers can't RTMP; this is the known container-app native gap). Interim: Larix Broadcaster + a provisioning deep-link that hands each camera its stream key.
3. **Admin channel-pool screen** — register verified Setnayan channels into `live_studio_roam_channel_pool` + connect/store each channel's OAuth token.
4. **Recording handoff** — after the event, pull each stream's VOD from the pool channel → deliver to the couple (dashboard + Alaala gallery), then `returnPoolChannel`.

---

## 🔴 OWNER ACTIONS (to go live) — none of these are code
1. **G1 — create + verify the Setnayan YouTube channel(s).** OWNER-ONLY (Google login + phone SMS verification + enable live streaming = 24h wait + channel verification). Claude cannot do this (credential/identity/account-settings). ~15 min + 24h. The only multi-week item; start first. For scale: a few brand channels = the pool (1 is fine to start).
2. **OAuth path** (owner rejected paid Workspace $7/mo). Free options:
   - **⭐ Cloud Identity FREE → "Internal" consent screen** (RESEARCH 2026-07-23): Cloud Identity Free gives you a Google *organization* on `setnayan.com` at **₱0/month** (up to ~50 accounts, no Gmail). An org lets you set the OAuth consent screen to **"Internal"** → **no verification, no user cap, no unverified warning, sensitive scopes allowed without review, long-lived tokens** ([Google: when verification isn't needed](https://support.google.com/cloud/answer/13464323)). This is the free version of the Workspace path and **skips the 3–6 week verification wait**. ⚠ UNCONFIRMED: whether a Cloud Identity Free account can own/create a YouTube channel + enable live streaming (Workspace accounts can once the admin enables YouTube; Cloud Identity is identity-only — needs a quick confirm or just test by creating the account). **Next session: confirm this, or owner just tries it.**
   - **Fallback — finish the External verification** already ~90% done (`API_Integration_Checklist.md` #17a Phase 2: only the 1–2 min demo video + submit remained). Free, but ~3–6 week Google review. Reliable.
   - ❌ Do NOT rely on "Production unverified" — Google expires *unverified* apps' refresh tokens at 7 days regardless of publishing status.
3. **Confirm Vercel env:** `YOUTUBE_OAUTH_CLIENT_ID` / `SECRET` / `REDIRECT_URI` (=`https://www.setnayan.com/api/oauth/youtube/callback`). Checklist marked these "paste pending" in May — confirm they're set. (Crypto secrets incl. `OAUTH_REFRESH_CRON_SECRET` are ✅ confirmed set.)
4. **Launch flips (LAST, after orchestration is wired + a mock-event test passes):** set `LIVE_STUDIO_ROAM` **`is_active=true`** (`/admin/pricing`) + **`NEXT_PUBLIC_LIVE_STUDIO_ROAM_ENABLED=true`** (Vercel) → tile appears, price resolves, sellable + streamable.

---

## OPEN DECISIONS / QUESTIONS
- **Kit-inclusion (owner to confirm):** recorded as a SEPARATE add-on (₱3,500/day base = capability + BYO cameras; a Setnayan-shipped kit can't fit a ₱1,000/day premium over Cast). If owner meant kit-included, rework the COGS/ops model.
- **Cloud Identity Free + YouTube feasibility** — the one research item left open (see OWNER ACTION #2).
- **Umbrella "Live Studio" copy** — ~10 surfaces (marketing/home/alaala/editorial/panood detail + setup pages) still say "Live Studio" as the umbrella. Deliberately NOT swept — needs per-surface umbrella-vs-Cast intent. A follow-up copy pass.
- **B6 GATE (firm):** no paying wedding until Roam survives a non-paying mock-event test (unrepeatable-wedding rule).

## GOTCHAS (learned this session)
- **Flag-gating cascade:** Roam is flag-gated in `ADD_ONS` **and** `STUDIO_PEAK_MONTHS` **and** `ADD_ON_DETAILS` — all three together, because the drift guards cross-check catalog ⟷ peak ⟷ detail. Adding anything Roam-facing → keep it flag-consistent + run tests with the flag BOTH off and on.
- **Migration auto-apply is unreliable on bursty merges** — it skipped #3579 (had to `gh workflow run supabase-migrations.yml --ref main`), fired fine for #3591/#3592. Always verify after a migration merge.
- **Legacy Cast keeps `panood_*`** (live selling product; internal rename = separate effort). `live_studio_roam_zones.camera_operator_id` FKs the legacy `panood_camera_operators` by its real name.
- **Migrations:** use `pnpm migration:new "<name>"` (pre-push hook rejects hand-typed round prefixes).
- **Worktree:** `~/Documents/Claude/Projects/setnayan-platform-wt-roam` (branches merged). Always branch off `origin/main`.
