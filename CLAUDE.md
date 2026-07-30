# CLAUDE.md — Setnayan Engineering Context

> Project context for Claude Code working on the Setnayan platform. Keep this file under 200 lines — it's loaded into every Claude Code session as context, so brevity matters.

## 🔑 TRIGGER — the owner types **"what's next"**

When the owner says **"what's next"** (or *whats next* / *what next*), that is a standing
instruction to **pick up all unfinished work**:

1. Open **[`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md)** — the master register of every active
   handoff, its gates, and its repo/worktree rules. **Read it fully before touching anything.**
2. Then open the contract for whichever stream you are executing (each row in the register names
   its own contract file).
3. Obey the register's global safety rules: build up to a gate, stop at it, list it. Never
   auto-flip a prod flag, never `db push` a counsel-gated migration, never make an
   `OWNER_DECISION` yourself.

⚠️ **THIS MAY BE A DIFFERENT MACHINE OR CLAUDE ACCOUNT.** Assume **no memory files exist** —
`~/.claude/.../memory/` does NOT travel. Everything you need is committed in THIS repo
(specs/corpus, remote `Setnayan-specs.git`) and in the code repo
(`github.com/iscasasola/setnayan-platform`). If a doc references a memory note by `[[name]]`,
treat it as a hint about a topic, not as a file you can open — the substance was copied into the
committed docs on purpose.

## 🚦 ACTIVE WORK — READ THIS BEFORE ANYTHING ELSE (updated 2026-07-29)

**The owner's #1 complaint about new sessions: they start without the plan, rebuild things that
already ship, and produce errors.** The fix is this block. Keep it CURRENT — one active work
stream, deleted or replaced when it finishes. If you finish a stream, update this block.

> ### 🔑 TRIGGER — the owner saying **"what's next"** activates ALL unfinished sessions
> (Set 2026-07-29 for cross-account continuation — the prior account hit its usage limit; a
> fresh account has NO conversation context, only these files.) On the trigger, open
> [`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md) — the master register + its HUMAN-GATE rules —
> and its newest entries:
> - [`WHATS_NEXT_Card_Family_Handoff_2026-07-29.md`](WHATS_NEXT_Card_Family_Handoff_2026-07-29.md)
>   — maker/card/details/customization-inquiry: 11 PRs DONE (anchored `origin/main`=`441779c1f`,
>   verify before trusting), locked principles, the unfinished build list, the trap list.
>   ⏭ One pending owner flip: `NEXT_PUBLIC_SERVICE_DETAILS_ENABLED`.
> - The **Papic two-type model** (locked 2026-07-29, build NOT started): DECISION_LOG row
>   2026-07-29 + memory `project-setnayan-onboarding-papic-ai-cards`.
> - **Song Desk** below — ✅ **PR 1 shipped + ALL SIX owner gates answered 2026-07-30.** Fully
>   cold-startable: build **PR 2**, then the new **PR 1b**.
> Execute per each contract's own rules; build flag-dark; stop at every HUMAN gate.

> ### ▶ ACTIVE: Song desk / song requests / sets
> **THE CONTRACT — open it first, before any grep, plan or code:**
> [`Song_Desk_BUILD_ORDER_2026-07-27.md`](Song_Desk_BUILD_ORDER_2026-07-27.md)
>
> It contains, already verified against live prod on 2026-07-27:
> - a table of **what already ships** (so you do not rebuild it — this happened twice in one day),
> - **8 PRs in dependency order** (7 + the new 1b), **every owner gate now ANSWERED**,
> - the standing traps (the exposure-baseline freeze, the default-ACL REVOKE, pre-launch-empty prod).
>
> 🏁 **THE BUILD ORDER IS COMPLETE — all 8 PRs shipped 2026-07-30**, every owner gate answered the
> same day (slots · vibe names · pre-fill direction · accept-vs-set · **requests always-on** ·
> **the paywall moved to the inbox**). PR 7 was deprioritised. **Do not rebuild any of it.**
>
> 🪤 **BUT THE DESK WAS UNREACHABLE THE WHOLE TIME** — and this is the lesson to carry, not the
> footnote. The day-of surfaces narrow a vendor's tiles by intersecting **two vocabularies that
> never match**: `vendor_profiles.services` speaks TILES (`live_band`·`coordinator`·`host_mc`),
> `get_vendor_event_brief().booked_categories` speaks CATEGORIES (`band_dj`·`planner_coordinator`·
> `host_emcee`). Result: **all three specialization desks denied for every booked vendor**, and the
> requests inbox printed *"no requests yet"* over **3 real pending rows**. Fixed in **#3942** via the
> bridge that already existed (`lib/vendor-category-taxonomy.ts`), plus the second half of the bug —
> `eventTiles ? new Set(…) : null` treats an **empty array as a real narrowing**, because `[]` is
> truthy.
>
> 🏁 **8 PRs, every DB object verified, and none of it caught this.** Verifying the parts cannot find
> a defect that lives in the JOIN between two correct parts. Before calling ANY gated surface done,
> run its real reads **as the end user's identity** (`set local role authenticated` + jwt claims) and
> diff against the same reads as service-role — **where they differ, the UI is lying.**
>
> ✅ Fix **#3942 is LIVE in prod** (`version: 58c8a30`, deployed hands-free by the finished cutover).
>
> ⏭ What remains is NOT code: (a) keep or reverse the widened playlist read, (b) should the HOST see
> a band's finished setlist, (c) **nobody has opened it on a phone.**
> **Fixture** — vendor `testnayan2@test.com`, event `0ccc7aa3-3a81-43ee-b170-afb194e0b259`,
> 3 pending song requests, at `/vendor-dashboard/on-the-day/live/0ccc7aa3-3a81-43ee-b170-afb194e0b259`.
> ⚠ **The desk opens ONLY on its `booked_date` (currently `2026-07-31`).** To view it on any other
> day, move the date first — one statement, safe to repeat:
> ```sql
> update public.vendor_schedule_pool_bookings set booked_date = current_date
>  where pool_booking_id = 'cb39ef7c-40cd-41ac-9177-367067573b8c';
> update public.events set event_date = current_date
>  where event_id = '0ccc7aa3-3a81-43ee-b170-afb194e0b259';
> ```
> Reasoning behind every line: the song-desk rows in `DECISION_LOG.md` — find them with `grep -in "song desk\|song request\|playlist-slot\|song-pick system\|set composition" DECISION_LOG.md` (15 rows, 2026-07-27)
> (`grep -n "2026-07-27" DECISION_LOG.md`), plus the two 2026-07-30 rows at the bottom.

**If you are starting a session on ANY topic, do these three things first:**
1. Read the ACTIVE block above (even if your task seems unrelated — it may already be covered).
2. Run RULE 0 from the repo's own `CLAUDE.md`: grep for the feature noun in `apps/web` BEFORE
   designing anything. Two features the owner asked for on 2026-07-27 turned out to already ship.
3. Verify claims against **live prod or shipped code**, not against specs or handoffs — the
   iteration specs are archive stubs and `schema_migrations` can lie about what actually landed.

## 🧭 SOURCE OF TRUTH (read this FIRST — flipped 2026-06-07)

**Canonical reference: [`AS_BUILT_GROUND_TRUTH_2026-06-07.md`](AS_BUILT_GROUND_TRUTH_2026-06-07.md).** Source-of-truth order: **(1) live site `www.setnayan.com` → (2) shipped code `apps/web` @ `origin/main` → (3) live prod DB → (4) the ground-truth doc → (5) iteration specs / dated handoffs = REFERENCE + HISTORY ONLY, may be stale.**

> ⚠ **The canonical iteration specs are ARCHIVE STUBS as of 2026-07-02.** Each `NNNN_<slug>/NNNN_<slug>.md` (and its `.docx` mirror) has been **gutted to a one-screen pointer** — title + "where current truth lives" + a `git show 573a96c:<path>` recovery command + links to any newer dated siblings in the same folder. The full original bodies were **not deleted** — they live in git history at `573a96c` and are one command away. This replaced the old "append-a-banner-on-top-of-the-stale-body" pattern, which is exactly why stale prices/SKUs kept resurfacing: the stub is now the *only* thing the canonical filename serves, so a grep or a cold read can no longer surface superseded claims. **Do NOT re-expand these stubs** — if an iteration needs fresh detail, write a new dated file in its folder (a "newer sibling") or update the living main; never paste the old body back into `NNNN_<slug>.md`. When any spec disagrees with the live site / code / ground-truth doc, **the latter win.** The old "after every code change, edit the corpus + regenerate .docx + `[PENDING]` to `COWORK_INBOX`" sync mandate is **relaxed** — log notable decisions at the **bottom of `DECISION_LOG.md`**; the code is canonical, the corpus is the archive + decision history.

_(Superseded: the old "Latest handoff → HANDOFF_2026-05-17 · Concierge ₱4,999" pointer — Concierge is retired; the planner SKU is **Setnayan AI — ₱499 one-time (was a per-USER subscription)** (owner-locked 2026-07-02; supersedes the interim ₱3,999 one-time per-event, which itself superseded the mislabeled ₱1,499). Commission is **0%**, not 3/5%. See `Pricing.md § 00` + the ground-truth doc.)_

## ⚠ Live-site reconciliation (2026-06-04 — read before trusting any price below)

> **🔄 2026-06-23 correction — the prices in THIS 2026-06-04 banner are PRE-RESET and wrong now.** Canonical = `Pricing.md § 00` + `AS_BUILT_GROUND_TRUTH_2026-06-07.md` § 1: **Setnayan AI ₱3,999** (not ₱1,499) *(⚠ itself superseded 2026-06-30/07-02 → ₱499 one-time (was a subscription) — Pricing.md § 00)* · **Animated Monogram ₱1,999** (not ₱2,499) · **Panood ₱2,499/day** (not ₱3,499). The "**site contradicts itself** on vendor Pro price + commission — unresolved" line is **RESOLVED**: live site is uniform **Pro ₱6,000/28d · Enterprise ₱10,000/28d · 0% commission · free verification** everywhere (Pricing.md § 0.1). Website/RSVP à-la-carte SKUs **collapsed to one Couple Website PRO ₱3,999** (Pricing.md § 00.F). Cinematic Reveal = **₱799**. Banner kept below as a labeled 2026-06-04 snapshot only.

The published catalog on **setnayan.com** has moved ahead of these specs. As of 2026-06-04 the SKU table and Payment section here are realigned to the live site (source of truth). Key deltas: the AI planner is **"Setnayan AI" ₱1,499** (not "Setnayan Concierge ₱4,999"); a **vendor token economy is live** (packs + 100 free on verification + `[Token]` redeemable SKUs) — reversing "no tokens anywhere"; Panood is **₱3,499/day**; monogram is **"Animated Monogram" ₱2,499**; and ~15 SKUs were added/renamed. **The site also contradicts itself** on vendor Pro price and commission — unresolved, owner must settle. Full mapping in `Pricing.md § 0`, gap analysis + contradictions in **`Site_vs_Spec_Reconciliation_2026-06-04.md`**.

## Status anchors (read these before any work)

Two status docs sit at the spec-corpus root. Cross-reference them at the start of every session — they answer "where are we?" without re-reading the whole iteration tree.

- **[V1_Gap_Analysis_Status.md](V1_Gap_Analysis_Status.md)** — did we update the *spec corpus* for each gap-audit item? (single-pane view of Tier 1/2/3 spec landings)
- **[App_Build_Status.md](App_Build_Status.md)** — did we ship the *app code* for each iteration? (spec vs. live `origin/main` audit; ✅/⚠️/🟡/⛔ per iteration with what's still missing inline)
- **[Installed_Stack_Inventory.md](Installed_Stack_Inventory.md)** — what's actually *wired under the hood*? (10-pass audit: deps, migrations, routes, actions, integrations, env vars, CI, desktop, PWA)
- **[API_Integration_Checklist.md](API_Integration_Checklist.md)** — external service prereqs (signups, keys, DNS) the owner must action before code can run end-to-end.
- **Repo-side mirrors** (at `https://github.com/iscasasola/setnayan-platform`): `STATUS.md` (living checkpoint), `HANDOFF.md` (cold-start handoff), `OWNER_ACTIONS.md` (phased launch checklist), `CHANGELOG.md` (every change with `SPEC IMPACT` flag), `COWORK_INBOX.md` (pending spec updates).

When code lands ahead of a spec update, the repo appends a `[PENDING]` line to `COWORK_INBOX.md`. Walk those entries at the start of any Cowork session and apply each via the spec file it names, then mark `[DONE <date>]`.

## What this product is

**Setnayan** (spoken: SET-na-yan, brand-origin phrase *"Set na 'yan."* — Tagalog for "that's all set") is a Philippines-first life-events platform. V1 surface is weddings; the product is built for the broader event market (birthday · debut · christening · gender reveal · celebration · travel · corporate · tournament · anniversary · graduation · reunion) as event types unlock over time. *(Burial was owner-RETIRED 2026-05-16 — "wrong app, wrong moment"; dropped from the `event_type` enum by migration `20260516260000`. ~9 other corpus files still stale-promise it — see `Taxonomy_Events_Faiths_Completeness_Audit_2026-06-11.md`.)* One app, three role-routed doorways: **customers** plan events end-to-end, **vendors** run a free-during-launch business profile, **admins** (Setnayan team) run operations from a 7-surface internal console. The full 33-iteration spec spine is documented across `0000_*` through `0035_*` folders.

**Papic** (the candid-capture iteration `0012_papic/`) is one of the in-app SKU-driven services within Setnayan. Designated friends/family ("paparazzi") shoot unlimited photos and 5-second clips, tag guests via QR scan, deposit everything into a shared gallery on the couple's existing Setnayan landing page. Every guest gets their tagged photos in real time and can render a 1–30 second personal souvenir reel from a pre-made template library.

**Full Papic spec:** `02_Specifications/10_Papic_Feature_Specification.md` — read it when in doubt.

## Locked V1 scope (do NOT expand without explicit owner sign-off)

### SKUs

> **🚫 SUPERSEDED 2026-06-07 (owner-locked "lock it") — the table below is PRE-RESET, kept for lineage only.** Canonical pricing lives in **`Pricing.md` § 00**. *(⚠ The 2026-06-07 4-tier ladder quoted here is ALSO stale now: bundles Essentials/Complete were REMOVED 2026-06-29, and Setnayan AI was repriced 2026-06-30/07-02 to a per-user subscription **₱499 one-time**. Current model: Free → Setnayan AI sub → à-la-carte.)* Original 2026-06-07 text: **Free–Explore ₱0 · Setnayan AI ₱3,999 (first paywall) · Essentials ₱12,999 · Complete ₱27,999** (19 paid SKUs · SRP ₱53,981). **Setnayan AI is now PAID** (not the ₱1,499 below, not a free funnel). RSVP now paid ₱2,499 / Pro ₱4,499 · Event Website ₱1,999 · Papic Guests ₱2,999. **Removed:** Indoor Blueprint · Call-Time Escalator · Pro Website (→ Event+Editorial Website) · High Res Archive · both bundles. **Mood Board kept (free).** Three reversals (paid AI + paid Event Website + paid RSVP) gut the live "free to plan / free website" pillars — site-sync PR pending.

> **⚠ RECONCILED TO LIVE SITE 2026-06-04.** This table now mirrors the published catalog on **setnayan.com/pricing** — the live site is the source of truth. The older charm-ladder SKU set (3/5 Paparazzi, ₱99 widget Pros, Live Stream Base/+cam/+hour, ₱49 Save-the-Date, etc.) is **superseded**; see `Pricing.md § 0` for the full mapping and `Site_vs_Spec_Reconciliation_2026-06-04.md` for the gap analysis. Prices still store as PHP centavos in `service_catalog`. `[Token]` = redeemable with **vendor** tokens (see Payment system below). Build state is what the site shows today.

| SKU | Price | Build state |
|---|---|---|
| Animated Monogram (bespoke monogram + animation) | ₱2,499 | Live |
| Custom QR per Guest (1 QR/guest, up to 250 pax) | ₱1,499 | Live |
| Indoor Blueprint (guided entrance→table) | ₱1,499 | Live |
| Papic (5 Seats) `[Token]` — unlimited photos+video, 5 hrs | ₱2,999 | Live |
| Papic Guest (Disposable Camera) `[Token]` — 24 photos + 10×5s clips | from ₱2,999 | Live |
| Setnayan AI (assisted planning · AI planner) | ₱1,499 | Live |
| High Res Archive (yearly archive) | ₱2,999/yr | In build |
| Live Background `[Token]` (LED wall design + monogram) | ₱2,499 | In build |
| Panood (Website Add-on) `[Token]` — livestream/day on event page | ₱3,499/day | In build |
| Patiktok `[Token]` — up to 250 TikTok recordings | ₱2,499 | In build |
| Pro Website `[Token]` — premium invite + event page + editorial | ₱5,499 | In build |
| Call-Time Escalator (SMS all vendors) | ₱1,999 | Coming soon |
| Camera Bridge (DSLR → Papic/Panood) | ₱1,999 | Coming soon |
| Guest Stories (Papic Add-on) — 30s story maker | ₱1,999 | Coming soon |
| Live Venue Photo Wall `[Token]` — live collage + count | ₱2,499 | Coming soon |
| Pabati — up to 300×5s videos | ₱999 | Coming soon |
| Pakanta `[Token]` — special song for the couple (single SKU) | ₱2,499 | Coming soon |
| Pakulay — free mood board (palette + visual identity) | ₱0 | Coming soon |
| ~~SDE (Papic Add-on)~~ — 3-min compilation | ~~₱3,499~~ | **RETIRED 2026-06-28** (PR #2362 + owner "remove same day edit") |
| Thank You Video (Papic Add-on) `[Token]` — 5-min | ₱5,499 | Coming soon |
| **Bundle:** Setnayan Guided Planner Suite (per event) | ₱11,999 | — |
| **Bundle:** Setnayan Comprehensive Media Pack (per event) | ₱16,999 | — |

**Vendor-side (canonical = live DB `vendor_billing_catalog` · 2026-07-10 pricing finalization):** Solo **₱999/28d (₱9,999/yr)** · Pro Vendor **₱2,499/28d (₱24,999/yr)** · Enterprise **₱7,999/28d (₱79,999/yr)** · Custom **from ₱8,999/28d** + à-la-carte add-ons · token packs at a **flat ₱200/token (₱1,000–₱20,000)** (owner-confirmed 2026-07-15, anchored at ₱1,000 = 5 tokens; ladder 5/10/25/50/100; shipped PR #3138) · commission **0%** · ~~100 free tokens on verification~~ **RETIRED 2026-06-17** (grant removed via migration `20270110320020`; tokens now come only from admin grants · subscription bundles · purchases). Enterprise is a BOUNDED tier (up to 10 team seats · 100 km reach · unlimited categories); Custom is the truly-unlimited tier above it. Market Intel (Demand Radar + Price-Position) is **Pro-and-up** (owner 2026-07-11). _(Superseded: the ₱6,000/₱10,000 "Ladder A", the earlier ₱2,499/₱5,499 subs + ₱1,000–₱18,000 packs. Public-surface contradictions cleaned by PRs #1335/#1336.)_

### Hard product constraints

- **~~5-second~~ 10-second hard cap on video clips (owner-reversed 2026-07-22).** Capped client-side. UI must enforce. The old "5-second, not configurable" lock is RETIRED — owner moved the clip currency to **10s = 7 points** (photo still = 1 pt). Ships as an isolated post-metering PR (clip-point value is a hardcoded constant on the fail-closed capture path). See `0012_papic/Papic_One_Pool_Model_Spec_2026-07-22.md § 0`. ⚠ 10s clips are ~2× the bytes and clips don't compress yet → coupled to the clip-web-copy storage PR.
- **Max 20 LIVE tags per photo (owner-raised 2026-07-23 from 10).** Combined individual + table + face + self-link; removed (tombstoned) tags never count toward the cap. Migration `20270916200000`.
- **Untagged-still-delivered guarantee.** Every uploaded photo lands in the couple's gallery regardless of tagging status.
- **Personal Reels:** vertical 9:16 only (1080×1920), 1–30 seconds duration, max 5 guest picks + max 5 couple memorable clips, template-driven render (no per-render AI).
- **Music:** Setnayan-owned AI-generated catalogue only. No major-label music. No per-render music license fee.
- **DSLR pairing is 1 phone : 1 DSLR.** Multi-DSLR-per-phone is V2. WiFi-SDK only in V1; no USB tether.
- **Face detection is per-event-scoped.** Vector store never reused across weddings. Confidence ≥ 0.85 auto-tags; 0.65–0.85 surfaces a suggested tag; below 0.65 the photo uploads untagged.
- **Capture metadata is mandatory.** Every photo and clip stamps `captured_at`, `geo_*` (when fix available), `device_model`, `paired_camera_brand/model` (when paired). Geo is stripped on outbound shares; original on R2 retains it.

## Architecture summary

### Stack

- **Native apps:** iOS 16+ (SwiftUI + AVFoundation), Android 11+ (Compose + CameraX)
- **Backend:** existing Setnayan backend (extend it, don't fork it)
- **Storage:** Cloudflare R2 (**APAC region** — ⚠ corrected 2026-07-31, was "PH-region buckets"; **R2 has no Philippines region**, and this line is where that false claim propagated from — it reached the live public `/privacy` notice. Owner to confirm the actual bucket location hint in the Cloudflare dashboard) — hot 90 days, IA cold 5 years
- **Render pipeline:** FFmpeg on Cloudflare Workers + R2 (or Hetzner VM pool fallback)
- **Auth for paparazzi seats:** wedding-scoped ephemeral session tokens via QR-code claim flow (not username/password)
- **QR scanning:** AVFoundation metadata output (iOS) / ML Kit Barcode Scanning (Android)

### Data model (key tables — full schema in spec Part 4.1)

```
Event(event_id, couple_id, paparazzi_tier{3|5}, templates_unlocked[], geolocation_enabled{default true})
PaparazziSeat(seat_id, event_id, claimer_user_id, claim_qr_token)
Guest(guest_id, event_id, assigned_table_id, personal_qr_token)  -- existing in Setnayan
Table(table_id, event_id, table_qr_token)
Photo(photo_id, event_id, paparazzi_seat_id, r2_object_key, type{photo|clip},
       captured_at, geo_lat, geo_lon, geo_accuracy_m, geo_unavailable,
       device_model, paired_camera_brand, paired_camera_model,
       auto_face_attempted, ...)
PhotoTag(photo_id, guest_id, source{individual_qr|table_qr|auto_face|manual_pick}, confidence?, ...)
Template(template_id, feel_category, manifest_json, paired_music_track_ids[])
EventTemplateUnlock(event_id, template_id, purchased_at)
PersonalReel(reel_id, event_id, guest_id, template_id, selected_photo_ids[], r2_output_key)
DslrPairing(pairing_id, event_id, paparazzi_seat_id|live_stream_camera_id,
            brand{canon|nikon|sony|fujifilm}, model, last_paired_at, status)
FaceEnrollment(enrollment_id, event_id, guest_id, source{rsvp_profile|guest_portal|checkin_kiosk},
               vector_blob, quality_score, captured_at, revoked_at?)
```

### Critical flows

**Paparazzi capture → upload → tag:**
1. Native app captures photo/clip → local SQLite WAL
2. Background uploader (BGTaskScheduler/WorkManager) PUTs to R2 via signed URL
3. Tag scanner sheet → scan guest QR (`setnayan:guest:{id}`) or table QR (`setnayan:table:{id}`)
4. Tag intents flush to backend with the upload payload
5. Backend fans out table-tag to all guests assigned to that table (capped at 10 total tags)

**Personal Reel / Story render (⚠ CLIENT-SIDE, download-only — reversed 2026-07-23, owner):**
The old server pipeline (`POST /reels/render` → Cloudflare Queue → Worker FFmpeg → `Output → R2 → notify guest`) is **RETIRED for guest stories.** The reel maker is **free** and renders **entirely in the guest's browser**; the output is **downloaded to their phone and Setnayan stores nothing** (no R2 write, no DB row, no shared feed). This matches the BYO-music not-distributor posture (`14_...Playbook.md §16.7`). See `DECISION_LOG.md` 2026-07-23.
1. Guest opens the reel maker (reward for completing a Papic Challenge — see `0012_papic/Papic_Games_and_Vendor_Missions_Spec_2026-07-21.md §8`)
2. Guest freely picks up to ~10 items — **any mix of their own Papic photos + clips** (relaxes the locked "5 guest + 5 couple" split) → target 30s, 9:16 1080×1920
3. Picks music: their own upload (BYO, client-side per §16.7) **or** an owned-catalogue template track
4. **Browser** loads the template manifest + the guest's source assets (pulled from R2 — prefer the compressed, geo-stripped `clip_web_r2_key` web-copy; egress is free) + music, and renders via WebCodecs (fallback ffmpeg.wasm)
5. Output MP4 (~15–25 MB) → **guest downloads to phone.** Setnayan holds zero story files → no storage accumulation on our side. Cost to us = ₱0.

## Music & template assets

The music catalogue and template library are generated through a separate Cowork-driven workflow — see `14_Music_Catalogue_Cowork_Playbook.md`.

- **Music catalogue:** ~400 owned AI-generated tracks (Suno Premier, generated once, owned forever) across 6 categories — Bridgerton-Feel, Taylor-Swift-Feel, Michael-Jackson-Feel, Jazz, Sunday Morning Vibes, Hip Hop. Stored under `/music_catalogue/{category}/{filename}.mp3`. Manifest at `/music_catalogue/catalogue_manifest.json`.
- **Template library:** ~400 production-ready JSON manifests under `/template_library/{feel_category}/TPL_{nnn}.json`. Master index at `/template_library/library_index.json`. Schema documented in spec Part 4 / playbook Section 12.

When the backend serves a template selection UI to the couple, it reads from `library_index.json`. When the renderer needs music for a render, it picks from the manifest based on the template's `music_pairing_categories` and `music_pairing_bpm_range`.

## Cost-per-event cheat sheet (charm-priced V1)

> **⚠ STALE as of 2026-06-04.** This table predates the live-site reconciliation and uses retired SKU names/prices (Live Stream Base, ₱1,999 Custom Monogram, ₱1,499 Paparazzi tiers, etc.). Margins are still directionally right (most digital SKUs are ~90–99% margin), but for current prices use the SKU table above / `Pricing.md § 0`. Left in place for cost-shape reference only.

| SKU | Setnayan cost | Margin |
|---|---|---|
| Save-the-Date Render (₱49) | ~₱5 (FFmpeg + R2 + ZIP) | ~90% |
| 3 Paparazzi (₱1,499) | ~₱195 | 87% |
| 5 Paparazzi (₱2,499) | ~₱265 | 89% |
| per Template add-on (₱199) | ~₱2/render × ~30 reels = ~₱60 | ~70% |
| Pro tier per Widget (₱99) | ₱0 (pure-margin animations / deep-links) | ~100% |
| Pro Bundle (₱199) | ₱0 | ~100% |
| Live Stream Base (₱2,499 — 3 cams × 3 hrs) | ~₱120 | 95% |
| Live Stream Base + 2 cams (5×3 ≈ ₱4,497) | ~₱180 | 96% |
| Live Stream Base + 2 cams + 2 hrs (5×5 ≈ ₱6,495) | ~₱280 | 96% |
| Live Stream Base + 2 cams + 5 hrs (5×8 ≈ ₱9,492) | ~₱430 | 95% |
| Live Stream Base + 2 cams + 9 hrs (5×12 ≈ ₱13,488) | ~₱630 | 95% |
| Custom Monogram Pack (₱1,999) | ~₱5 (one-time asset gen) | ~99% |
| Broadcast Style Pack (₱2,999) | ~₱5 (compositor template/LUT swaps) | ~99% |
| AI Video Highlight (₱1,999 per 60s) | ~₱10 (Claude API + ffmpeg) | ~99% |
| AI Edited Highlight (₱3,499 per 3-min · repriced 2026-05-16 from ₱4,999) | ~₱30 (Claude API + ffmpeg + theme template) | ~99% |
| Vendor Pro Weekly (₱499/wk) | ₱0 (analytics + landing styling) | ~100% |
| Sponsored Boost (₱1,499/wk · certified-only) | ₱0 | ~100% |

Per-render cost: ~₱2–₱5 (FFmpeg compute + R2 storage; music free, CDN egress free on R2).

**Live Stream cost is audience-independent.** YouTube absorbs all viewers at ₱0 marginal cost to Setnayan. Per-event cost scales only with camera count and stream duration; whether the wedding has 100 viewers or 1,000,000 viewers, Setnayan's bill is the same.

## Payment system (V1 — apply-then-pay)

Setnayan monetizes via **PHP-direct apply-then-pay** with manual reconciliation. The iteration 0003 *customer* token wallet stays **retired** — couples always pay in PHP and never see a token balance. **⚠ Updated 2026-06-04:** a **vendor-side token economy is now LIVE on setnayan.com** — vendors buy token packs (canonical now: flat ₱200/token · ladder 5/10/25/50/100 = ₱1,000–₱20,000 · owner-confirmed 2026-07-15 · shipped PR #3138), ~~get 100 free tokens on verification~~ *(RETIRED 2026-06-17 · migration `20270110320020`)*, and redeem them against any "Token Worthy" couple SKU (marked `[Token]` in the SKU table) at a dashboard-set rate. So "no tokens anywhere" is no longer accurate: tokens exist on the **vendor** side. See `Pricing.md § 0.C`.

- **Payment rails (V1):** static BDO + GCash receiving accounts owned by Setnayan. Customer applies for a service / order → receives payment instructions email with unique reference code → pays externally → Setnayan Team manually verifies against BDO/GCash inboxes within 24-hr SLA → service activates.
- **PHP-only pricing.** No tokens, no in-app wallet balance, no spending primitive. Each order is a discrete PHP charge tied to a `service_orders` row with `service_key`, `customer_id`, `amount_php`, `reference_code`, `status ∈ pending_payment / paid / failed / refunded`.
- **No Setnayan Pay convenience fee.** Commission is **0%** on every vendor booking, every tier — there is no customer-side convenience fee. _(History: a 3% convenience fee was drafted 2026-05-12 → repriced to flat 5.0% on 2026-05-16 → both RETIRED to 0% at the 2026-06-07 reset per `AS_BUILT_GROUND_TRUTH_2026-06-07.md` § "RETIRED". Vendors settle off-platform; Setnayan does not hold money.)_ A separate automated **Setnayan Pay gateway** (per-rail 1.5%/2.0%/2.5% in `setnayan_pay_methods`) is **dormant** — every row is `is_active=FALSE`, not charged in V1.
- **V1.5 roadmap:** automated reconciliation via GCash Merchant API (probable) or PayMongo integration (under evaluation). Activation latency drops from 24-hr to minutes.
- **Comp + Unlimited-Use Grants:** admin can issue free-render or unlimited-use grants to specific customer accounts. Grants are a `comp_grant_id` populated on `service_orders` that skip the payment-pending state.
- **Spec convention:** in all .md / .docx specs and design conversations, prices are written in PHP. Only the in-app UI and 0003's own spec talk in tokens directly.

## What's NOT in V1 (don't build, don't backdoor in)

- All-Guest Unlock tier (every guest can shoot via web)
- Native Pro Capture Pack (RAW, manual focus peaking, ISO/shutter)
- Roving Papic service tier (staff photographers)
- Premium Photojournalism + Photo Book
- AI Top-50 same-day curation
- Live Photo Wall venue projection
- Photo Mission system / crew leaderboard
- Cross-paparazzi de-duplication
- ~~BYO music in Personal Reels (CapCut-style client-side render)~~ — **UN-RETIRED 2026-06-28 (owner):** approved as Guest Stories' "Your music (upload)" source, **client-side render ONLY** (uploaded audio never enters the server pipeline → Setnayan is not the distributor). Spec: `14_Music_Catalogue_Cowork_Playbook.md` §16.7.

These are tracked in spec Part 6. Each is a future spec.

## Privacy & compliance

- PH Data Privacy Act (RA 10173) — guest consent at RSVP, opt-out flow, face-blur for opt-outs, 5-year retention
- Couple has 7-day review window (configurable) before public unlock
- NSFW filter is on by default and CANNOT be disabled
- DPO is the **proprietor, Indalecio Sacdalan Casasola II** (registered on the NPC DPO system 2026-07-07). ⚠ Not Claire E. Buanhog — she is VP / co-founder and DBRT support. See [[dpo-designation-owner]].
- **Data residency: NOTHING is hosted in the Philippines.** Database = **Supabase, Singapore** (this is also where the biometric face vectors live — `guest_face_enrollments.face_vector`, `user_face_profiles`). Object storage = **Cloudflare R2, APAC region** (media + the source selfie images, *not* the vectors). ⚠ Corrected 2026-07-31 — the old "Cloudflare R2 PH-region buckets" was false in two ways (no PH region exists; and it implied PH residency we do not have) and had propagated into the live public `/privacy` notice. Owner to confirm the bucket location hint in the Cloudflare dashboard.

## Common pitfalls / gotchas for engineers

1. **Don't render reels server-side with major-label music.** Even with TOS click-through, server-side rendering makes Setnayan the direct infringer. Catalogue is owned-AI-generated only.
2. **Don't auto-delete photos within 5 years.** PH wedding photographers keep originals 5+ years; we match.
3. **Tag fan-out from table QR.** When a table has 12 guests but cap is 10, alphabetize by RSVP'd name and truncate. Surface the warning to the paparazzo.
4. **Untagged photos still go to the couple.** Don't filter the couple's gallery view by tag presence.
5. **Personal Reel duration is flexible (1–30s) but template slot durations don't all need to scale linearly.** Some templates have minimum slot durations; if guest picks 1s reel from a template with 4s minimum slots, swap to a shorter-template variant or surface an error.
6. **Wedding-scoped session tokens.** A paparazzi seat token only works for its bound event. Don't allow cross-event reuse.
7. **R2 free egress is a real architectural advantage.** Use Cloudflare's CDN end-to-end. Don't proxy through a different cloud unless absolutely necessary.

## Companion documents

- `10_Papic_Feature_Specification.md` — full product spec, single source of truth
- `14_Music_Catalogue_Cowork_Playbook.md` — music + template asset generation playbook
- `09_Panood_Feature_Specification.md` — Live Studio (livestream/control-room; renamed from "Panood" 2026-06-29; filename + internal SKU key `PANOOD_SYSTEM` unchanged) feature (cross-references the same backend + landing page)
- `07_V1_Developer_Specification.md` — overall Setnayan V1 dev spec (RSVP, seating chart, payments — all of which Paparazzi depends on)
- `13_Engineering_Brief.docx` — Setnayan engineering high-level brief

## Iteration build order (forward-sequenced)

`Status` = spec drafting state. `Built` = what exists in the codebase right now (✅ = shipped to code, ⚠ = partial, blank = unbuilt). Built status updated as each iteration's code lands; the doc's `Status` column stays as the spec-drafting field.

| # | Folder | Status | Built | Surface |
|---|---|---|---|---|
| **0000** | `0000_app_shell_and_navigation/` | **drafted 2026-05-09** | ⚠ Phase 1 | **App shell foundation — universal Setnayan account (`users`), login, event picker, primary event auto-jump (1 active event jumps in; 2+ shows picker), event QR + scan-to-join flow with role picker, four bottom-nav tabs (Guest List / Vendors / Schedule / In-App Services), event-scoped URL pattern `/dashboard/[event-id]/[section]`, services launcher grid, unified Schedule view. Vendor accounts placeholder (deferred to Din)** |
| 0001 | `0001_creating_guest_list/` | drafted | ✅ | Couple dashboard guest list + roles |
| 0002 | `0002_qr_invitation_system/` | drafted | ✅ v2 | Personal invitation site renderer + branded QR |
| ~~0003~~ | `0003_token_wallet_and_packs/` | **RETIRED 2026-05-11** | — | ~~Token wallet, pack picker, spend primitive.~~ Retired. Replaced by PHP-direct apply-then-pay (see "Payment system" section above). Folder kept as tombstone; do not implement. |
| **0004** | `0004_invitation_widgets/` | **drafted (this session)** | | Customization editor, Basic/Pro widget tiers, Pro purchases via wallet |
| 0005 | `0005_led_background_maker/` | drafted | | 8K LED screen template maker (USB delivery, offline) |
| **0006** | `0006_vendors_management/` | **drafted 2026-05-09** | | Couple-managed vendor registry — hybrid service taxonomy (28 canonical + custom), flexible payment milestones, computed crew meals, R2 contracts. No wallet integration (vendor money is external) |
| **0007** | `0007_budget_expenses/` | **drafted 2026-05-09** | | Couple's payment ledger — 3 line items per vendor (Package / Crew Meal / Transportation), payment log with proof, vendor QR display, .ics calendar export, Setnayan platform costs auto-populate from 0003 wallet |
| **0008** | `0008_seating_chart_editor/` | **drafted 2026-05-09** | | Seating chart editor — 13-entry table catalog (round / long / king / sweetheart / serpentine), free-placed stage, role-tier ring auto-fill, QR-on-publish print pack, peer tagging is QR-scan only with tag-once trust handshake |
| 0009 | `0009_photo_delivery/` | partial | | Google Drive integration for photo delivery |
| **0010** | `0010_mood_board/` | **drafted 2026-05-09** | | Mood Board V1 — palettes only (role + venue), Setnayan Guide rule engine with 7 categories, 20 pre-template themes, color name library, image extraction, master palette dedup. Stylist persona + inspirations + venue segments deferred until stylist exists |
| **0011** | `0011_live_stream/` | **drafted 2026-05-09 · re-revised 2026-05-09** | | Live Stream V1.5 — ⚠ HISTORICAL apparatus pricing (per-camera / per-hour add-ons), RETIRED since 2026-06-26. Ships today as **Live Studio, ONE SKU `LIVE_STUDIO` ₱2,999/event-day, no per-camera fee** (canon: `Live_Studio_Unified_Spec_2026-07-25.md`). YouTube as sole in-app delivery, registers shared Custom Monogram Pack flag consumed by 0012 |
| **0012** | `0012_paparazzi/` | **drafted 2026-05-09** | ⚠ webapp slice | Paparazzi V1 — native iOS/Android, rear-only, gesture shutter, QR tagging, consumes monogram pack |
| **0013** | `0013_platform_stack_and_sync/` | **drafted 2026-05-09** | ⚠ partial | **Platform Stack & Sync Setup — Vercel + Supabase + Cloudflare R2 + GitHub. User Setup Checklist (Section A), Claude Code Implementation Guide (Section B), Integration Tests (Section C). MUST BUILD FIRST as Sprint 0 even though numbered 0013.** |
| 0014 | `0014_v1_1_polish/` | empty (queued · no folder on disk yet) | | V1.1 polish — Photo Center, profile photo auto-update, expanded filters, battery escalation, delivered indicator (renamed from 0013, displaced by Platform Stack iteration) |
| **0015** | `0015_main_website/` | **re-drafted 2026-05-11 · brand finalized 2026-05-12** | | **SETNAYAN public marketing site at setnayan.com (working) / setnayan.com (current). Two-sided split hero (couple ↔ vendor), free vendor registration during launch, feature catalog visible / prices hidden, EN-primary luxurious-Filipino-modern voice (TL · CEB toggles), uploaded symbol mark + SETNAYAN wordmark (spelled in full), "Set na 'yan." brand-origin. One product, three doorways (customer / vendor / admin role-router).** |
| **0016** | `0016_step_by_step_plan_builder/` | **⚠ RENAMED + REPRICED: now "Setnayan AI" — ₱499 one-time (was a subscription) (owner-locked 2026-07-02; supersedes the ₱3,999 one-time of the 2026-06-07 reset and the ₱1,499 below; see Pricing.md § 00). Spec text below is pre-reconciliation.** | | **⚠ LIVE SITE: the AI planner ships as "Setnayan AI" at ₱1,499 (one purchase, full access through the wedding) — NOT "Setnayan Concierge ₱4,999". Note `/for-vendors` still advertises a free "Setnayan Concierge" worth ₱2,499/booked-couple — owner must reconcile the name/price collision (see Pricing.md § 0.1). _Original spec text:_ Couple-side Setnayan Concierge — optional paid assistant (DIY remains free default). **Single SKU**: Setnayan Concierge **₱4,999 · wedding-anchored access** — `concierge_expires_at = LEAST(wedding_date + 30 days, activation + 24 months)` with min `activation + 12 months`. Couple always gets ≥12 months and ≤24 months from activation; long engagements (wedding > 24mo out) trigger a one-time advisory recommending renewal closer to the wedding. Full 9-step roadmap · daily nudges · priority vendor matching · honeymoon planning. **Card-less 3-day free trial · one per account** (not per event). **Tiered abuse enforcement** on multi-account trial cycling: similarity detection on trial-start → admin review queue (new tab in 0023) → progressive penalties (warning → trial ban → full Concierge ban). Banned accounts route to 0029 help-center ticket for appeal. Couples activate from event-creation choice card (2 options · DIY + Concierge) OR Settings → Setnayan Concierge tab. Pre-paid; auto-renew is V1.5. Supersedes the 2026-05-16 2-tier (Essentials retired) and the 2026-05-14 3-tier ladder.** |
| 0017 | `0017_patiktok/` | drafted | | Patiktok templates — short-form vertical video templates for the post-event "personal reel" experience (V1 Sulyap roadmap; complements 0024 Save-the-Date). |
| 0018 | `0018_supplies_marketplace/` | drafted | | Supplies marketplace placeholder — third-vertical "Supplies" exploration (deferred; precursor to the second-vertical car-services concept). |
| 0019 | `0019_communications/` | drafted 2026-05-11 · vendor identity masking added 2026-05-12 · video meetings retired 2026-05-16 | | **In-app communications: text chat between couples ↔ vendors, ~~video meetings attached to those threads,~~ coordinator role gets per-thread join permission. Doc / sheet / pdf / image readers attached to threads with dedicated R2 storage. Vendor-side messages always display company logo (never personal photo) per § 3.10. Free use across the board. Video meetings retired 2026-05-16 — couples + vendors use external tools (Google Meet, Zoom, Messenger, WhatsApp).** |
| 0020 | `0020_interaction_prototype/` | drafted 2026-05 | | Cross-cutting 8-phase interaction prototype (vendor → customer → Papic → other features). Lives in iteration 0020 slot alongside the retired 0020_admin_console tombstone. |
| ~~0020~~ | `0020_admin_console/` | **SUPERSEDED 2026-05-12** | — | ~~Admin console early draft.~~ Superseded by iteration **0023** which has the active admin spec + interactive prototype. Folder kept as tombstone pointer; do not implement from this file. |
| **0021** | `0021_couple_dashboard_fully_purchased/` | **drafted 2026-05-10 · theme system + icon migration pilot 2026-05-12** | | **Fully-purchased couple dashboard — 9 surfaces (Overview/Guests/Vendors/Schedule/Services/Seat Plan/Landing/QR Hub/Gallery). Pilot for the 5-theme system (Setnayan Default · Victorian · Classy · iOS · Forest Theme) with runtime theme picker + Lucide icon framework. Home deadline scheduler re-anchored to earliest-chosen-date + "Upcoming schedules" (2026-06-03).** |
| **0022** | `0022_vendor_dashboard/` | **drafted 2026-05-10 · mandatory logo + chat masking 2026-05-12** | | **Vendor dashboard — 6 surfaces (Home/Services/Calendar/Clients/Threads/Team & Setnayan). Mandatory company logo upload at registration per § 2.1b. Pro subscription · plan builder · custom service categories.** |
| **0023** | `0023_admin_console/` | **drafted 2026-05-12 · Team Pool + Payment Methods + § 9.1 scope 2026-05-12** | | **Setnayan internal admin surface — 29 surfaces. Vendor verification queues · payment reconciliation · disputes · pricing catalog · Team Pool widget (§ 10b) · 🟣 internal accounts (§ 10a) · Payment Methods upload (§ 3.5c) · two-admin approval queue gated to major decisions (§ 9.1) · surface #29 Promoted Events & Broadcast (V1.6 · § 3.16).** |
| **0024** | `0024_save_the_date/` | **REDESIGNED 2026-06-17** | ⚠ reveals ✅ · content film 🟡 | **Save-the-Date = a continuous, self-playing, scrubbable CONTENT FILM (one elegant design · the 7-beat spine) under a chosen REVEAL OPENING (5: Sheer veil + four-flap/two-flap-side/two-flap-top/church-doors), recoloured to the couple's Mood Board · auto-plays fullscreen → ends → add-to-calendar (wedding + invitation-launch). FREE = the content film; PREMIUM = the cinematic openings ₱999/event (repriced 2026-07-10, was ₱799). ⚠ The old "30 head-turning aesthetic templates (iMessage / Spotify / VHS / Vogue / …)" + ₱49/render charm price are RETIRED 2026-06-17 (owner "delete them"). **Built state 2026-06-18:** veil reveal PORTED #1671 · STD openings ₱799 buy flow SHIPPED #1705/#1709/#1718 (admin-approval handshake, fail-proofed) · content film (PR4 · 7-beat free film) 🟡 in build. See `0024_Save_the_Date_Content_and_Customization_2026-06-17.md` + `0024_Veil_Reveal_Spec_2026-06-17.md` + AS_BUILT § 10b.** |
| **0025** | `0025_profile_settings/` | **drafted 2026-05-12** | | **Profile Settings surface lives inside 0021/0022/0023 dashboards. 6 tabs: Profile · Appearance (theme picker) · Notifications (preferences) · URL & Slug · Payment Methods · Privacy & Data (RA 10173 — data export + soft/hard account deletion + face data revocation + marketing consent).** |
| **0026** | `0026_bir_tax_compliance/` | **drafted 2026-05-12** | | **BIR / PH tax compliance — Official Receipt generation per in-app SKU payment, VAT vs Percentage Tax decision matrix (V1 launches non-VAT), Vendor payout EWT + quarterly Form 2307 PDF, eFPS report exports for Setnayan's tax accountant, customer/vendor tax-document download surface. Critical for PH legal compliance — Setnayan can't accept payment without this.** |
| **0028** | `0028_email_notifications/` | **drafted 2026-05-12** | | **Email-only notification fallback (SMS deferred to V1.5). 10 V1 templates: payment_instructions · payment_confirmed · refund_processed · new_vendor_message · vendor_status_change · vendor_unresponsive_48h · rsvp_received · wedding_day_reminder · save_the_date_sent · security_alert. Provider Resend (SendGrid fallback). Branded HTML + plaintext, RFC 8058 one-click unsubscribe, RA 10173 + CAN-SPAM compliant.** |
| **0029** | `0029_help_center/` | **drafted 2026-05-12** | | **Help Center / FAQ at `setnayan.com/help` · 4 role tiles (customer/vendor/guest/admin) · ~90 V1 articles · full-text search · structured contact-form routing to admin roles · support ticket queue with 24-hr SLA. SEO via FAQPage schema.org. EN-only in V1; TL/CEB deferred.** |
| **0030** | `0030_guided_tour/` | **drafted 2026-05-12** | | **First-time guided tour on initial login per account type. 8-step customer · 7-step vendor · 4-step guest · 6-step admin scripts. Driver.js library. Per-surface mini-tours (11 of them). Replayable from Settings. Tour analytics in 0023.** |
| **0031** | `0031_day_of_guest/` | **drafted 2026-05-12** | | **Day-of guest experience — live-event mode auto-activates T-1hr to T+8hr on the personal landing page. 6 cards (what's-happening · your-table · live-photo-wall · video-guestbook · live-schedule · coordinator-broadcast). Offline-first PWA shell for venues with weak signal. 5-mode lifecycle (coming-soon → pre-event → live → recap → archive).** |
| **0032** | `0032_contract_intelligence/` | **drafted 2026-05-12** | | **Contract Intelligence + Builder — AI-powered contract analysis (Claude API), 14-element detection, ~50-clause Setnayan template library, both-party e-signature flow (RA 8792 compliant), compliance checklist. Paid upgrade SKU at ₱199/contract OR free unlimited with Vendor Pro Weekly. External PH counsel review gate before launch.** |
| **0033** | `0033_public_api_foundation/` | **drafted 2026-05-12** | | **Public API foundation — Cloudflare Workers gateway · OAuth2 PKCE · scoped tokens (16 scopes) · path-based versioning · rate-limit tiers (free 100/min · Pro 1K/min · Enterprise 10K/min) · webhook delivery infra · developers.setnayan.com portal. NO public endpoints in V1; plumbing for V1.5 phased rollout.** |
| **0034** | `0034_payments_and_cart/` | **drafted 2026-05-12 · reconciliation module added 2026-05-12** | | **Payments & Cart spine — 8-table canonical schema + `payment_inbox_messages` reconciliation table. Customer add-to-cart → checkout → BDO + GCash QR codes → external pay → screenshot upload → admin reconciles (Approve / Reject-needs-more-proof / Reject permanently). Resubmission supported (same order_id). § 10a internal accounts skip payment-pending entirely; § 10b team-pool members get partial / full comp atomically. (No Setnayan Pay convenience fee — commission is 0%; the 3%→5.0% fee in the 0034 draft was RETIRED at the 2026-06-07 reset.) Replaces retired 0003 token wallet. Reference codes 8-char Crockford base32. 7-day expiry on pending_payment. 4-tier fuzzy SQL matcher (`match_inbox_to_order`) auto-pairs bank/GCash inbox notifications to orders — exact code → amount+sender fuzzy → amount-only → unmatched. Admin reviews matcher suggestions but final approve/reject stays single-admin.** |
| **0035** | `0035_observability/` | **drafted 2026-05-12** | | **Observability stack — Sentry (errors · ~₱1.5K/mo) + PostHog (product analytics · ~₱1K/mo) + Better Stack (uptime + status page + on-call · ~₱1K/mo). `/api/health` + `/api/health/deep` endpoints. Vercel Log Drains → Better Stack. Alert rules (critical paging Ops Lead · warning Slack · info digest). RA 10173 compliant — no PII in logs · session recordings disabled · PostHog opt-out toggle. Status page at `status.setnayan.com`. Total ~₱3.5K/month. Engineering effort ~1 week for one engineer.** |
| **0036** | `0036_pakanta/` | **drafted 2026-05-14 · 3-tier locked** | | **Pakanta · Your Wedding's Own Song — 3-tier custom songwriter service powered by Suno Premier. Basic ₱1,999 (1 song · 24-hr turnaround · no lyric approval) · Premium ₱3,999 (1 song · 2 versions · 3 remakes · 8-section intake · lyric approval gate · 2–5 day) · Wedding Suite ₱9,999 (3 matching songs · same Personas · same key family · lyric through-line · mastering pass · 5–7 day). Library-save mechanic makes the couple's Pakanta song(s) the backing track for every Setnayan-rendered video at their wedding. Canonical ID prefix S89K-. 85–90% margins.** |
| **0037** | `0037_bespoke_monogram/` | **drafted 2026-05-14 · prototype shipped · ⚠ LIVE SITE: ships as "Animated Monogram" — ₱999 (2026-07-10 reprice; was ₱1,999/₱2,499; see Pricing.md § 00)** | | **⚠ Live site sells this as "Animated Monogram" at ₱999 (2026-07-10; was ₱2,499/₱2,999), bundling the animation. _Original spec text:_ Bespoke Monogram (DALL-E) at ₱2,999 — fully in-app AI-driven monogram with 30-refinement loop. Couple fills brief (initials + 3 personality words + optional motif + reference uploads) → pays → brief LOCKS → DALL-E 3 HD generates 4 candidates within 5 sec → refine loop with text feedback + suggested chips (4 new variations per refinement; 30 free included; +₱199 for 10 more) → accept final → vectorizer.ai produces SVG → replaces event-wide monogram across QR center, hero, save-the-date, AI Highlight, SDE, LED, signage, gallery chrome. Customer-facing brand "Setnayan AI"; DALL-E/OpenAI never named. Retires Custom Monogram Pack ₱1,999 SKU. ~95% margin. Canonical ID prefix S89B-.** |
| **0038** | `0038_editorial_and_affiliates/` | **drafted 2026-05-19** | | **Editorial & Affiliates · V1.1 traffic-monetization expansion. `setnayan.com/blog` (long-form articles, ~1/week cadence post-launch) + `setnayan.com/recommendations/[category]` (curated picks with disclosed affiliate links — Involve Asia primary network) + Sponsored Content (paid-for editorial features w/ unambiguous "Sponsored" badge, two-admin gate ≥₱100K). Git-tracked MD pattern (same as 0029 Help Center) — content lives in `apps/web/content/editorial/`. New tables: `editorial_articles` + `recommendation_pages` + `affiliate_links` + `affiliate_conversions` + `sponsored_slot_bookings`. PostHog `affiliate_link_clicked` event w/ no PII. Newsletter sponsorship slot extends 0028. Cross-coordinates with 0022 Boosted Ads + 0039 AdSense (sponsored articles + sponsored newsletter slots are AdSense-excluded).** |
| ~~**0039**~~ | `0039_display_ads/` | **🚫 RETIRED 2026-05-19** | — | ~~Third-party display ads (Google AdSense) · V1.1 traffic-monetization expansion · activation gated. Public, pre-purchase pages only — marketing site + help articles + 0038 editorial + marketplace discovery + vendor landing pages. Excludes: logged-in dashboards, guest landing pages (0002 Phases 1-4 incl. Public Summary), day-of guest (0031), sponsored articles, sponsored newsletter slots, checkout, contact form, cookie-preferences page, error pages, vendor verification flows. **Site-wide RA 10173 cookie-consent banner** (new system surface; 3 categories — essential/analytics/advertising; 12-month persistence; first-party cookie + `users.consent_state` JSONB). Hard guardrails: max 1 unit per page, AdSense topic-exclusion of wedding/event categories on vendor profiles + editorial + recommendations + marketplace, Auto Ads disabled, no interstitials. Vendor opt-out toggle on `/vendors/[slug]` (Boosted Ads / Sponsored Boost vendors default OFF — sales-objection neutralizer). Two-admin activation kill-switch in 0023 § 5.1. New tables: `cookie_consent_events` + `adsense_activation_log` + `adsense_daily_revenue`; ALTERs on `users` + `vendors`. CSP updated. **Yield is ~₱5-20K/mo at 100K pageviews — two orders of magnitude below Boosted Ads. Owner picked "all public pages" with brand-cost trade-off acknowledged.**~~ |

### Implementation log

| Date | What landed | Iterations |
|---|---|---|
| 2026-05-09 | Initial schema + couple dashboard for guest list, QR invitation system, plus-one model, +1 onboarding, palette/monogram | 0001, 0002, 0002 v2 |
| 2026-05-09 | Paparazzi V1 schema (seats / captures / tags / reels / templates) + couple gallery review dashboard + guest gallery + reel builder + seat-claim entry | 0012 (webapp slice) |
| 2026-05-09 | Multi-event account model (`users` / `event_join_tokens` / `event_members`), URL refactor to `/dashboard/[event_id]/...`, event picker, 4-tab event-scoped chrome | 0000 (Phase 1) |
| 2026-05-09 | `events.event_type` column + picker enum; full 0003 wallet schema (`token_wallets` / `token_packs` / `token_purchases` / `token_transactions` / `service_catalog`) + `wallet_spend()` RPC; V1 SKU + pack-ladder seeds; retired the 0012 `paparazzi_wallet_skus` stub; `apps/web/.env.example` | 0000 update, 0003 (schema), 0013 (partial — Section B B1 .env / B2 schemas / B9 catalog) |
| 2026-05-10 | Iteration specs revised for **Pro Camera Bridge** (Canon/Nikon/Sony/Fujifilm WiFi-SDK pairing, 1 phone : 1 DSLR), **face-detection auto-tag** with layered enrollment (RSVP profile + guest portal upload + check-in kiosk), **EXIF + geolocation metadata** on every capture, **adaptive compression** (strong/medium/weak), and **offline queue** with 7-day TTL. New `pro_camera_bridge_addon` SKU at ₱1,500/seat, multi-purchase, shared between 0011 and 0012. New schema additions: `dslr_pairings`, `face_enrollments`, plus columns on `photos` (`captured_at`, `geo_*`, `device_model`, `paired_camera_brand/model`, `auto_face_attempted`). Specs only — code does not exist yet. | 0011 (md/html/docx), 0012 (md/html/docx), CLAUDE.md SKU table + data model + decision log |

## Decision log

> **Moved to [`DECISION_LOG.md`](DECISION_LOG.md)** (corpus root) — split out 2026-06-03 to keep this primer light in auto-loaded context. The full append-only log (457 rows, ~2.2 MB) is **not** auto-loaded; search it on demand, e.g. `grep -n "2026-06" DECISION_LOG.md`. **Append new rows there** in date order, format `| Date | Decision | Why-or-affected-files |` — not in this file.
