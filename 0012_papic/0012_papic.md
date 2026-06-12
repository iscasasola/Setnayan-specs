# Iteration 0012 — Papic

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - **Price split: site says Papic (5 Seats) ₱2,999, CODE ships ₱2,499.** Live site = "Papic (5 Seats) ₱2,999 · Live" + "Papic Guest (Disposable Camera) from ₱2,999 · Live". Shipped code (`lib/sku-catalog.ts`) = `paparazzi_5_seats` **₱2,499** + `paparazzi_3_seats` **₱1,499** (3-seat pack still `isActive` in code but NOT on the live catalog) + `paparazzi_camera_addon` ₱999. The site is authoritative on price/catalog; the ₱2,999 reprice + retiring the 3-seat pack + adding the "Papic Guest disposable camera" SKU have not all landed in code. Flag for owner.
> - **SHIPPED webapp slice:** couple gallery + seat purchase + `app/papic/{seat,claim,guest}` + `app/api/papic`. Cam Bridge (`papic_cam_bridge_slot_day`) is cataloged but **`isActive=false`** (native Papic binary + DSLR WiFi SDK deferred until pilot wraps). Native iOS/Android Papic capture app is NOT built (Capacitor remote-URL shell only; Android shell built).
> - **0003 token wallet RETIRED** — Papic seat purchases route through **0034 apply-then-pay** (`orders`/`payments`, manual admin approval), not a wallet/`spend()`. Token-wallet language was already purged 2026-05-12; the vendor token economy (LIVE) is a separate thing and Papic shows "Token Worthy" on the site.
> - The 207-camera mesh / 150-credit / "Premium Guest Camera Pack ₱1,499" / Auto-Recap economics in this body predate the live catalog — treat as design history, not as-built pricing.
> - **Cross-cutting:** commission 0% (no Setnayan Pay 3%); vendor↔customer money is off-platform.
>
> When this body disagrees with the above, **the above wins.**

> **⚠ LIVE-SITE RECONCILIATION 2026-06-04.** setnayan.com/pricing now sells Papic as: **Papic (5 Seats) ₱2,999** (Token Worthy · unlimited photos + video for 5 hrs · **Live**) and **Papic Guest (Disposable Camera) from ₱2,999** (24 photos + 10×5s clips · **Live**). Papic-anchored add-ons (Coming soon unless noted): **SDE ₱3,499** (3-min compilation), **Thank You Video ₱5,499** (5-min), **Guest Stories ₱1,999** (30s), **Camera Bridge ₱1,999**, **Live Venue Photo Wall ₱2,499**. Supersedes the ₱1,499 / ₱2,499 3-seat/5-seat ladder in the body. Canonical catalog: `Pricing.md § 0`.

**Iteration number:** 0012
**Topic:** Papic feature, V1
**Surface:** Couple-side → Setnayan Web Dashboard · **Bottom-nav tab: Add-ons** · Couple URL: `setnayan.com/dashboard/[event-id]/services/papic` (gallery + seat purchase) · Paparazzo-side: native iOS / Android apps (separate)
**Builds on:** 0000 (app shell, sign-in, event-scoped URL, Add-ons launcher), 0001 (guest data, role taxonomy, `photo_consent`), 0002 (personal QR delivery), 0008 (table QR for fan-out tagging), 0011 (Custom Monogram Pack flag), 0034 (Payments & Cart — Papic seat purchases route through `service_orders` apply-then-pay)
**Status:** Drafted 2026-05-09 · revised 2026-05-10 (DSLR Pro Camera Bridge + face-detection auto-tag + EXIF/geo metadata + adaptive compression) · token-wallet language purged 2026-05-12 (now PHP-native via 0034) · architecture lock 2026-05-16 (see § Architecture Lock below) · **V1 promotion 2026-05-18 (prior V1.5+ deferral lifted; architecture + SKU locks below stand; see CLAUDE.md decision log)**
**Companion specs:** `10_Papic_Feature_Specification.md`, `0011_panood/`, `0034_payments_and_cart/`, `0001_creating_guest_list/`, `0002_qr_invitation_system/`

---

## Architecture Lock — locked 2026-05-16 (V1.5+ deferral lifted 2026-05-18)

> **2026-05-18 V1 promotion.** Owner promoted the iteration from V1.5+ build-deferred into V1 scope. The architecture lock below and the SKU table at the end of this section stand as the V1 canonical reference. Body text written before the promotion that says "deferred to V1.5+" should be read as "in V1 scope, engineering pending"; the lift only affects the deferral framing — the locked decisions themselves are unchanged.
>
> **Original architecture-lock framing (2026-05-16, preserved for context):** All Papic SKUs were deferred to V1.5+. V1 was to ship without native iOS / Android engineering bandwidth. The architecture is **frozen** so the build cannot re-litigate decisions already argued through. The "What this iteration ships" section below describes V1 scope and remains canonical for build-time reference; SKU pricing is in the SKU table at the end of this section.

### 1. 207-camera mesh per event

5 paid paparazzi + 200 guest cameras (cap) + 1 couple seat = **207 cameras** per event. Each guest receives **150 captured-photo credits**, bundled free in the Premium Guest Camera Pack (event-wide ₱1,499 SKU). The 5 paid paparazzi seats share a **pooled credit pool** (see § 8 below) rather than per-paparazzo quotas.

### 2. Drive sync to couple's archive (mode set via iteration 0009 Photo Delivery)

Drive sync timing + mechanics live in **iteration 0009 Photo Delivery** — Papic is one of the photo sources that feeds the 0009 R2-to-Drive pipeline. The couple OAuths their Google account via the 0009 setup panel and Setnayan pushes the full archive (photos, videos, Auto-Recap, XMP/EXIF metadata) to the couple's `Setnayan/[Event Name]/` Drive folder root.

**Sync mode is set per event (locked 2026-05-20):**
- **`manual_release`** (default) — Setnayan retains photos in R2 through the event + 7-day review window. Couple clicks "Release to Drive" via the 0009 panel after reviewing; background job pushes the archive to Drive in batches.
- **`auto_sync`** (opt-in) — photos stream to Drive in real-time as they land in R2 throughout the event. Couple sees the archive grow live; no release gate.

**Original T+30d transfer model (2026-05-16 architecture lock) is RETIRED** by the 2026-05-20 per-event mode toggle. The 90-day cold-tier safety window (§ 3 below) and XMP/EXIF embedding (§ 4 below) still apply — both trigger on first successful Drive write per photo, regardless of mode.

Drive transfer remains **one-way**: subsequent edits in Setnayan (e.g. couple un-hides a photo during review) do NOT re-sync to Drive once a photo has been delivered. For `manual_release` mode this is moot since the review window closes before release. For `auto_sync` mode this means a photo hidden in Setnayan after first sync remains in the couple's Drive — couples can delete it from Drive manually.

**Couple owns the archive from first Drive write onward.**

### 3. Cold-tier 90-day safety window

From T+30d to T+120d, Setnayan retains a **cold-tier R2 mirror** of the archive (R2 Infrequent Access class — ~₱0.004/GB/month vs hot-tier ~₱0.020/GB/month, ~80% cost reduction). After T+120d the cold-tier rows lapse and the couple's own Google Drive becomes the only canonical copy. If a couple accidentally trashes the Drive folder within the 90-day window they can request re-transfer from Setnayan support.

### 4. XMP/EXIF tag embedding on Drive transfer

Before the T+30d Drive push, Setnayan embeds the following into each file:
- **XMP sidecars (per-photo, alongside `.jpg`/`.cr2`/`.nef`):** face-detection tags (Lightroom-compatible `Iptc4xmpCore:PersonInImage`), table tag, capture timestamp, geo coordinates, photographer ID
- **EXIF UserComment / ImageDescription** (where the file format supports it): same tags as a fallback for tools that don't read XMP

Couple's archive is queryable in Lightroom / Photo Mechanic / Capture One / Photos.app without Setnayan being in the loop — face tags surface as named keywords, table tags as a custom keyword, geo as standard EXIF lat/lon.

### 5. Auto-Recap (FFmpeg, no AI · free with Premium Guest Camera Pack)

Rendered T+24h post-event, **60-90 second highlight reel**, deterministic ordering:
- Capture timestamps clustered into ~12-15 narrative beats spread evenly across event duration
- Within each beat, photo-quality heuristic picks the best frame: sharpness score (Laplacian variance) + face-count (more faces = higher score) + exposure-curve median (closer to mid-gray = higher score)
- No Anthropic API · no scene-prompt costs · no LLM in the loop
- Music: Setnayan-owned AI track from the catalogue (couple picks category at purchase)
- Output: 1080×1920 vertical MP4 (H.264) + 1920×1080 horizontal MP4 (H.264), both bundled into Drive transfer + downloadable from couple dashboard

Auto-Recap is **free** when the event has the Premium Guest Camera Pack (₱1,499 event-wide) — no separate per-event recap charge.

### 6. Folder structure on Drive

```
Setnayan/[Event Name]/
├── 00_Cover/                    # best-of-show curated by couple during 7-day review
├── 01_Pre-event/                # captures before ceremony start time
├── 02_Ceremony/                 # captures during ceremony window
├── 03_Reception/                # captures during reception window
└── 04_Auto-Recap/               # the 60-90s highlight reel (vertical + horizontal)
```

Phase-bucketed for Lightroom-style ingest. Couple can re-organize at will after T+30d (they own the folder).

### 7. File naming

```
{couple-slug}_{ISO-8601 capture timestamp}_{photographer-id}_{capture-id}.{ext}
```

Example: `maria-juan_2026-08-15T14-32-08+0800_p3_c00421.jpg` — sorts chronologically by photographer per session; photographer-id (`p1`-`p5`) lets Lightroom collections filter by-photographer trivially.

### 8. Pooled credit pool

Couple's paid paparazzi **share a pool** (not per-paparazzo quotas):
- **3-Paparazzi pack** (₱1,499): **5,000 captured-photo credits** shared across the 3 seats
- **5-Paparazzi pack** (₱2,499): **10,000 captured-photo credits** shared across the 5 seats

Pool sizes are calibrated for typical Filipino-wedding capture counts (200-guest event = 3K-5K paparazzi shots; pool gives 1.5-2× headroom). Per-paparazzo quotas would force premature shutter-discipline in high-value windows (ceremony, first dance, send-off) where one paparazzo legitimately shoots heavy while another shoots lighter at the same moment.

### 9. Soft warning at 80% pool utilization + extension SKU

At **80% of the pool consumed**, the operator UI shows a soft-warning banner: *"You've used 80% of the event credit pool. Add 1,000 more credits for ₱299 to keep shooting freely."* Operator can tap to purchase the **Credits Add-on** (`paparazzi_credits_addon`, ₱299 / +1,000 credits, multi-purchase) inline without leaving the booth flow. Pool depletion is non-blocking — shutter still works after 100%, but each capture posts a warning toast and the couple's dashboard surfaces the overage at event-end with a one-tap top-up button.

### V1 SKU table (reactivated 2026-05-17 · Papic HTML-based capture, unlimited guest photographers under the seat-count UX limit)

> **2026-05-17 reactivation lift.** The seat-pack SKUs are reactivated to **V1** because Papic capture is HTML/browser-based (no native-app gating per seat). The seat count is the **official-paparazzi UX limit** that the couple sets — guests can still upload via QR without consuming seats. Cam Bridge becomes a separate tier-structured product per the 2026-05-17 SKU lock (3 product-scoped tiers: per-slot/day, all-slots/day, all-slots/year). The V1.5+ deferral header above is **partially superseded** — seat packs ship in V1; credits/album/book SKUs stay V1.5+ deferred.

| SKU | `service_catalog.sku_code` | Price · Frequency | Scope |
|---|---|---|---|
| **3-Paparazzi Pack** | `paparazzi_3_seats` | **₱1,499** · one_time + per_event | 3 paparazzi seats · 5,000-credit pool · 200 guest cams · 150 credits/guest · **V1 (reactivated 2026-05-17)** |
| **5-Paparazzi Pack** | `paparazzi_5_seats` | **₱2,499** · one_time + per_event | 5 paparazzi seats · 10,000-credit pool · 200 guest cams · 150 credits/guest · **V1 (reactivated 2026-05-17)** |
| **Camera Add-on (+1 seat)** | `paparazzi_camera_addon` | **₱999** · one_time + per_event + multi-purchase | One additional paid paparazzi seat · **V1 (reactivated 2026-05-17)** |
| **Cam Bridge (per slot/day)** | `papic_cam_bridge_slot_day` | **₱99** · one_time + per_event + multi-purchase | DSLR-paired Papic seat, one event-day · WiFi-SDK via Papic-binary native app · **V1 (new 2026-05-17)** |
| **Cam Bridge (all slots/day)** | `papic_cam_bridge_all_slots_day` | **₱249** · one_time + per_event + multi-purchase | DSLR pairing for all Papic seats, one event-day · flat rate · breaks even vs per-slot at ≥3 DSLRs · **V1 (new 2026-05-17)** |
| **Cam Bridge (all slots/year)** | `papic_cam_bridge_all_slots_annual` | **₱2,499** · annual + all_events | DSLR pairing for all Papic seats, unlimited events for one year · vendor / wedding-photographer subscription · **V1 (new 2026-05-17)** |

**V1.5+ deferred (still build-pending):**

| SKU | `service_catalog.sku_code` | Price | Scope |
|---|---|---|---|
| **Credits Add-on** | `paparazzi_credits_addon` | ₱299 | +1,000 pool credits · multi-purchase · in-event upsell at 80% pool warning |
| **Premium Guest Camera Pack** | `premium_guest_camera_pack` | ₱1,499 | Event-wide flag: every guest gets Lifetime Archive + Drive sync + Auto-Recap + watermark-free downloads + HD video upload |
| **Personal Album (per guest)** | `personal_album_per_guest` | ₱49 | Per-guest digital album · opt-in per guest · low-friction upsell |
| **Memory Book (per guest)** | `memory_book_per_guest` | ₱249 | Per-guest printable hardcover memory book PDF · opt-in per guest |

Pro Camera Bridge for DSLR pairing (Canon · Nikon · Sony · Fujifilm WiFi SDK) is **no longer the same shared SKU as 0011 Panood**. Each consuming product (Papic / Panood / Patiktok) has its own Cam Bridge tier structure with different pricing (locked 2026-05-17 per CLAUDE.md decision log). The underlying WiFi-SDK pairing tech in the Papic-binary native app is shared; the SKUs that gate it differ per product.

### Tax-tier note

All V1.5+ Papic SKUs net **~65-72% margin** under V1 tax tier (Percentage Tax 3% + Local Business Tax 1% + Income Tax 25% — non-VAT lock). Cold-tier R2 + 90-day safety window cuts long-tail storage cost ~80% vs the prior hot-tier indefinite retention model.

### QR scan token — defers to 0002 unified model (cross-ref 2026-05-22)

Paparazzi scan the **same `guests.qr_token`** (32-hex opaque, from 0001's schema) that opens the guest's invitation page in a browser and hydrates the day-of LIVE view in 0031. No separate Papic-specific peer-tag token; no separate scan vector. The single token drives four scan uses across four actors per the **canonical lock in [0002 § Unified QR Code Lifecycle Model](../0002_qr_invitation_system/0002_qr_invitation_system.md)** locked 2026-05-22.

Locked behaviors preserved from prior 0012 + 2026-05-09 decisions, restated here for build-time clarity:

- **Paparazzi scan** writes `photo_tags.guest_id = <guest> AND source = 'individual_qr'` (the existing 0012 line 583 contract).
- **Tag-once trust handshake** (2026-05-09): a paparazzo scanning a guest's QR once gates 5+ minutes of subsequent shots from that paparazzo as auto-tagged to that guest, no rescanning needed.
- **Untagged-still-delivered guarantee** (2026-05-09): photos with no scan / face-match / pick action still upload to the couple's gallery; they just don't get a guest tag.
- **Max 10 tags per photo** (2026-05-09): combined guest QR + table QR + auto-face + manual Pick + table fan-out caps at 10 tags total per photo.
- **Table QR (`setnayan://table/{token}`)** is a SEPARATE token from `guests.qr_token`. Per 0008's lock, table QRs are minted only at seating-chart publish. A table-QR scan fans tags to every guest seated at that table (alphabetized + truncated at the 10-cap).
- **Token rotation never breaks tag history.** `photo_tags.guest_id` is the immutable join; the QR token is just the lookup key. A re-issued QR (per 0002's per-guest Re-issue action) invalidates the magic-link cookie + the printed QR but does not unlink the guest from already-tagged photos.

For the cross-iteration framing (3 lifecycle states · 4 scan actors · vendor TIER 1/TIER 2 scan addition · Phase 4 editorial guest hydration), defer to [0002 § Unified QR Code Lifecycle Model (canonical lock 2026-05-22)](../0002_qr_invitation_system/0002_qr_invitation_system.md).

---

## What this iteration ships

V1 of Papic as defined in the master spec at `10_Papic_Feature_Specification.md`, with the polish layer worked out in alignment sessions on 2026-05-08 and 2026-05-09 folded in. This iteration consumes the **Custom Monogram Pack** flag registered in 0011 — Papic photo and reel exports apply the couple's monogram instead of the Setnayan logo when the pack is purchased.

Specifically delivered:

- 3 Papic (₱1,499) and 5 Papic (₱2,499) tiers per master spec Part 2, repriced to PHP charm pricing (locked 2026-05-12)
- Per-template add-on at ₱49, repriced to PHP charm pricing (locked 2026-05-12)
- **Pro Camera Bridge add-on** at ₱1,499 per DSLR seat (multi-purchase, shared SKU with 0011 Panood): turns one phone seat into a phone+DSLR pair via vendor WiFi SDK (Canon, Nikon, Sony, Fujifilm). Phone runs face detection + metadata + upload pipeline; DSLR provides the optical glass. Detailed in *Pro Camera Bridge — DSLR pairing* below
- Native iOS 16+ and Android 11+ apps only — no WebApp variant, **rear camera only** for the phone-internal capture path, never selfie
- Capture sandbox: photos live in the app's private SQLite WAL, never auto-saved to the phone's camera roll. Opt-in toggle in settings to save copies; defaults off
- QR-driven tagging (personal guest QR plus table QR) with the 10-tag-per-photo cap and the untagged-still-delivered guarantee
- 5-second clips, **always exactly 5 seconds — no shorter**, enforced client-side. Continuous recording from release; cannot be cut short
- Gesture shutter (see below) replacing the previous tap-and-hold model
- Persistent in-viewfinder portrait nudge (green when held portrait, amber when tilted landscape)
- Last-5 captures strip at the bottom of the viewfinder for retag and delete
- Upload queue indicator + storage meter in the top status bar
- 20% battery warning + manual handoff QR (mirrors Panood slot takeover pattern)
- "Pick" shortcut button on the bottom action row for the manual guest picker, with smart guest ordering
- Couple gallery on the existing Setnayan landing page with four V1 filters: chronological, photos of us, untagged, type (photos / videos / all)
- 7-day couple review window with bulk hide / unhide
- Personal Reels (1-30 seconds, 9:16 vertical, template-driven, Ken Burns crop on landscape source)
- Reel preview before render commits
- Share-to-IG / FB / X / WhatsApp + download button on every reel and photo
- Couple's monogram or Setnayan logo on every share and download (depending on Custom Monogram Pack purchase)
- **Face detection auto-tag** on every uploaded frame and photo, on-device (Apple Vision / ML Kit), with a layered face catalog drawn from RSVP profile photos (baseline) + pre-event guest portal upload (opt-in) + on-the-day check-in kiosk enrollment. Confidence ≥ 0.85 auto-tags `source='auto_face'`; 0.65–0.85 surfaces as a suggested tag in the last-5 strip; below 0.65 the photo uploads untagged and the existing QR / Pick / table-fan-out paths handle it
- **Capture metadata** — every file stamps `captured_at` (NTP-synced device clock), `geo_lat / geo_lon / geo_accuracy_m` (Core Location / FusedLocation), `device_model`, and (when paired) `paired_camera_brand` + `paired_camera_model`. Metadata is written to EXIF on JPEGs and to QuickTime metadata atoms on MP4s before upload, so it survives any download. See *Capture metadata* below
- **Adaptive compression** — phone runs a rolling 30-second bandwidth estimator and switches between three upload presets (originals on strong networks, 80%-quality JPEG / H.264 CRF 23 1080p on medium, queue-only on weak). DSLR RAW files are always queued and ship when bandwidth permits. See *Adaptive compression + offline queue* below
- **Offline queue** — captures land in the SQLite WAL whether the phone has internet or not; queue persists across app suspend, device reboot, and battery handoff; resumes on foreground / network change with exponential backoff. 7-day TTL on local-only items before the paparazzo gets a "couldn't deliver these" prompt with bulk re-try
- Face detection on-device (MLKit / Vision) for tag matching and opt-out blur
- Privacy: opt-out at RSVP with face-blur preview; DPO contact link; geolocation opt-out at couple level (default ON, since wedding venues are public locations)
- Admin: regenerate papic seat token from the Setnayan support dashboard; event status dashboard
- "My contributions" view per paparazzo, post-event, for personal copies download

This iteration does NOT ship (deferred to 0013 V1.1 Polish or beyond):

- Photo Center curator role — no reliable human owner at most events; fully deferred to V1.1 (no admin-lite version in V1)
- Wedding-day profile photo auto-update — face recognition handles identification without it; V1.1
- Sort / filter beyond the four V1 essentials (by role, by team, by schedule segment, by individual guest, favorited, needs-attention, by seat, orientation) — V1.1
- Battery escalation at 10% (push to crew) and 5% (auto-pause new captures) — V1.1
- Delivered-status indicator + "what now?" couple nudge — V1.1
- Template favorites / wishlist — V1.1
- BLE / Bluetooth proximity guest detection — V2
- All-Guest Unlock tier — V2
- Native Pro Capture Pack (RAW, manual focus peaking) on the **phone-internal** camera path — V2 (DSLR RAW is supported in V1 via Pro Camera Bridge)
- Roving Papic service tier — V2
- Multi-DSLR-per-phone pairing — V2 (V1 is strictly 1 phone : 1 DSLR)
- Cross-papic bridge transfer (move an unlocked bridge from one seat to another mid-event) — V1.1
- USB-tethered DSLR pairing — V2 (V1 is WiFi-SDK only)
- Cross-event face vector reuse (a guest who attended Wedding A having their enrollment auto-reused at Wedding B) — never; per-event vector store is by design

The 12-month theme-library rotation is an operations ritual, not an iteration — Setnayan team reviews template purchase counts annually, retires the bottom slice, and refills with new AI-sequenced manifests. Tracked in `14_Music_Catalogue_Cowork_Playbook.md`, not here.

---

## Pricing alignment

Per the 2026-05-12 charm-pricing decision in `CLAUDE.md`, master-spec prices for Papic SKUs are PHP-native, charm-priced (-1 round-number convention). This iteration uses these prices:

| SKU | `service_catalog.sku_code` (per 0034) | Price | Notes |
|---|---|---|---|
| 3 Papic | `paparazzi_3_seats` | **₱1,499** | 3 app seats per event |
| 5 Papic | `paparazzi_5_seats` | **₱2,499** | 5 app seats per event |
| Per Template (premade) | `template_unlock` | **₱49** | multi-purchase |
| **Pro Camera Bridge (per DSLR seat, multi-purchase, shared with 0011)** | `pro_camera_bridge_seat` | **₱1,499** | per DSLR seat |
| Custom Monogram Pack (registered in 0011, consumed here) | `custom_monogram_pack` | **₱1,999** | event-wide, removes Setnayan watermark |

The Pro Camera Bridge add-on is per device-pair, not per event. A couple buying 5-Papic (₱2,499) plus three Pro Camera Bridge unlocks (3 × ₱1,499 = ₱4,500) ends up at ₱7,000 total, with three of their five papic seats running phone+DSLR rigs and two running phone-internal rear-camera. The add-on is identical to 0011's `pro_camera_bridge_addon`; one purchase counts toward whichever surface (Papic or Panood) the paired phone is running.

---

## Capture UI — V1 spec

### Screen layout (top to bottom)

**iOS / Android native status bar** at the very top — time, system battery, system signal. Untouched.

**Setnayan app top bar** (32pt tall):

- **Storage chip (left):** device storage % used. Green < 70%, amber 70-90%, red > 90%. Tap-through to "Clear cached previews" so the paparazzo can free space mid-event.
- **Upload queue chip (center, wider):** pulsing blue dot + "12 queued · 3 uploading". Confirms uploads are flowing.
- **Monogram dot (right cluster):** small gold dot showing "M&J" if Custom Monogram Pack purchased, "T" otherwise. Confirms which branding is being applied to exports.
- **Settings cog (rightmost):** opens settings sheet (battery saver, save-to-camera-roll toggle, viewfinder grid, sign out).

System battery and signal are deliberately NOT duplicated in the Setnayan bar — iOS / Android already shows them at the top.

**Viewfinder** (full-bleed middle):

- Live preview from rear camera
- Tap anywhere to set focus point (small reticle animates)
- Two-finger drag for exposure compensation
- Bottom-left corner: **persistent orientation nudge** — small pill with a green dot when held portrait, amber dot when tilted landscape. No popups, no blocking. Pure ambient cue.

**Right edge — collapsed tag drawer:**

- "+ Tag" pill with a count badge of how many tags are on the most recent photo
- Tap to expand into the tag scanner sheet (defaults to QR scan mode)

**Bottom action zone** (thumb zone):

- **Last-5 captures strip:** five thumbnail squares, scrollable horizontally. Tap any to retroactively tag, delete, or favorite.
- **Pick button (left of shutter):** opens the manual guest picker as a one-tap shortcut.
- **Smart shutter (center):** see Gesture model below.
- **Torch button (right of shutter):** continuous fill light; toggles on / off independently of per-capture flash.

The mode pill ("PHOTO | 5-SEC CLIP") from the master spec is removed in V1 — the gesture shutter handles mode selection.

### Gesture shutter — the four capture modes

A single shutter button responds to four gestures:

| Gesture | Capture |
|---|---|
| Tap | Photo, no flash |
| Drag up | Photo with flash (single pop synced to shutter) |
| Drag right | 5-second clip on release; runs the full 5 seconds, cannot be cut short |
| Drag right → drag up (chord, before release) | 5-second clip with flash on release; torch on for the full 5 seconds |

**Discoverability:**

1. First-launch onboarding shows a 5-second animation demonstrating tap, drag-up, drag-right, and the chord drag-right-then-up.
2. Subtle ambient hints on the shutter: two small directional ticks around the white circle pointing up and right. The chord (drag-right-then-up for flash clip) is taught in onboarding only — the perimeter ticks stay sparse.
3. Below the shutter for the first ~5 captures: soft caption "tap photo · drag for flash or clip" that fades out after the paparazzo demonstrates fluency.

**Haptics:** each direction commits with a distinct haptic tap so the paparazzo can shoot from the hip and feel which mode triggered.

**Timing:**

- Tap → photo fires on touch-up (snappy)
- Drag up → photo fires on release after the up direction registers (>24px from center)
- Drag right → on release, clip recording starts and **runs for the full 5 seconds, continuously**. Cannot be cut short; release does not stop it. Paparazzo can put the phone down, walk away, or tag a guest mid-clip — the recording finishes on its own at 5.0 seconds and uploads in the background.
- Drag right → drag up (chord, before release) → arms flash for the clip; on release, recording starts with torch on for the full 5 seconds. Same continuous behavior — no early stop.

Every clip in V1 is exactly 5 seconds. No "up to 5 seconds" — the 5-second duration is fixed by design. This makes clips droppable straight into Reels / TikTok / Stories with no further trimming, and makes the upload payload size predictable.

### Storage and album behavior

**Default:** photos stay in the app's private sandbox (SQLite WAL with original blobs). Never written to the phone's native camera roll.

**Lifecycle:**

1. Capture lands in WAL with a UUID, timestamp, papic seat ID, and any client-side tags
2. Background uploader (iOS BGTaskScheduler, Android WorkManager) PUTs to R2 via signed URLs
3. On successful upload + server ack, the local sandbox copy is purged after a 24-hour grace window (kept locally so the last-5 strip and retroactive tagging keep working in the meantime)
4. Tag intents flush to the backend with the upload payload

**Optional save-to-album:** a toggle in the settings cog menu, "Save copies to my camera roll." Defaults off. If on, captures are also written to the phone's Photos / Gallery via the OS standard API (with the user's saved camera-roll permission).

**Post-event "My contributions" view:** each paparazzo can access a personal gallery of their captures from the past event for download / sharing if the couple has granted them download access.

### Battery handoff (V1 — single threshold)

At **20% device battery**, the upload-queue chip in the top bar is replaced by a red **"Battery 18% — hand off your seat"** pill. Tapping opens a handoff sheet:

- **Swap to my backup phone** — the paparazzo signs in on their own second device using a regenerated handoff QR
- **Hand off to another paparazzo** — backup papic (anyone with the Setnayan app installed) scans the QR, the seat token transfers, both devices show a confirmation banner, the Photo Center / admin dashboard logs the swap

**Handoff mechanics** mirror the Panood slot takeover pattern in `09_Panood_Feature_Specification.md` Part 8: 3-second grace period for in-flight uploads, wedding-scoped session token revocation on the old device, reissue on the new device. Original device's queued uploads continue draining until the WAL is empty.

V1.1 will add escalation at 10% (push to crew) and auto-pause at 5% — V1 ships only the warning + manual handoff to keep complexity tight.

---

## Pro Camera Bridge — DSLR pairing

> **⚠ SUPERSEDED IN PART — see [`Camera_Bridge_Build_Plan_2026-06-11.md`](Camera_Bridge_Build_Plan_2026-06-11.md) (canonical build plan).** Key corrections (research-verified 2026-06-11): (1) the symmetric 4-brand SDK matrix below is **optimistic — only Canon (CCAPI) is a genuine mobile-WiFi capture API**; Sony + Nikon have NO mobile SDK (capability gap, V2-only) and Fujifilm is Android-USB-only with a warranty-voiding EULA → **V1 = Canon bodies only**. (2) Owner extended the bridge to a THIRD surface: **Patiktok** (with Papic + Panood). (3) The Panood target below assumes the **retired** WebRTC→SFU pipeline — the live path must be redefined against BYO-YouTube and is gated on a CCAPI live-view field test. (4) The real parallel axis is SURFACES + now-vs-gated, not brands; critical path = core+mock → Papic sink → true-native Android binary → CanonBridge (~5-6 Claude-Code weeks). (5) **C1+C2 shipped 2026-06-11**: `apps/web/lib/camera-bridge/` (protocol + MockBridge + pairing FSM, 17-test suite) + the BLE→WiFi transport correction in `apps/mobile`.


### What it is

A purchasable add-on that turns one phone seat into a phone + DSLR pair. The phone retains every responsibility it had in V1 — gesture shutter, tag drawer, last-5 strip, face detection, EXIF stamping, adaptive compression, offline queue, upload — but the **optical capture surface** moves to a connected DSLR. The phone fires the DSLR's shutter via vendor SDK; the DSLR captures the photo or clip; the file transfers to the phone over WiFi; from there everything proceeds as in the phone-internal path. A bridge unlock is **per device-pair**, multi-purchase, ₱1,499 each, registered as `pro_camera_bridge_addon` in the service_orders (V1 apply-then-pay) (shared SKU with 0011 — one purchase counts toward whichever surface the paired phone is running, Papic or Panood).

### Why phone-as-bridge (and not DSLR-direct-to-cloud)

Three reasons made the phone the right place to hold the upload + tagging + metadata logic:

1. **DSLR firmware is read-only.** Canon, Nikon, Sony, and Fujifilm don't allow third-party app installation on their bodies. Anything that requires inference, network awareness, or a apply-then-pay flow has to live somewhere the platform allows third-party software to run. The phone is that somewhere.
2. **WiFi-direct from DSLR to a public AP is unreliable at venues.** All four vendor SDKs assume a phone or laptop in a personal-area network with the camera. Routing the phone's LTE / venue WiFi through that bridge gives us a connection model that actually works in Filipino reception halls.
3. **The phone already does the right work.** Face detection, gesture shutter, QR scanning, tag flushing, monogram metadata — these all live in the existing 0012 native app. Adding "shutter trigger over WiFi" is a small surface vs. re-implementing the whole stack on a body that won't run our code anyway.

### Vendor SDK matrix

| Brand | SDK | Transport | Notes |
|---|---|---|---|
| **Canon** | EOS Camera Connect SDK (Mobile) | WiFi (5 GHz preferred, 2.4 GHz fallback) | Live View, single-shot trigger, AF point set, settings read; supported on EOS R-series, R5/R6/R6 II, R7, R8, R10, R50, RP, plus M-series with the legacy CCAPI fallback |
| **Nikon** | SnapBridge SDK (legacy MTP-WiFi where SnapBridge is unavailable) | WiFi 2.4 GHz | Z-series (Z fc, Z 5 II, Z 6 III, Z 7 II, Z 8, Z 9), D-series via MTP-WiFi for older bodies |
| **Sony** | Camera Remote SDK | WiFi 5 GHz | A7-series, A1, A6700, A7C II, FX3, ZV-E1, ZV-E10 II |
| **Fujifilm** | Fujifilm Camera Remote SDK | WiFi 5 GHz | X-T5, X-T4, X-S20, X-H2/X-H2S, GFX 100 II, X100VI |

Each vendor's SDK exposes a different API surface. The Setnayan app abstracts them behind a single `CameraBridge` interface (Swift protocol on iOS, Kotlin interface on Android) so the rest of the capture pipeline stays vendor-agnostic. The phone's internal camera is a fifth implementation of the same interface — `InternalCameraBridge` — which means the gesture shutter, last-5 strip, tag drawer, and face detection don't need to know whether they're driving a Canon body, a Sony body, or the phone's own sensor.

```
┌─────────────────────────── phone (Papic app) ───────────────────────────┐
│                                                                                  │
│   gesture shutter ──► CameraBridge (protocol)                                    │
│                              │                                                   │
│   ┌──────────────────────────┼─────────────────────────────────┐                 │
│   ▼                          ▼                                 ▼                 │
│ CanonBridge              NikonBridge ... (per vendor)     InternalCameraBridge   │
│   │                          │                                 │                 │
│   ▼                          ▼                                 ▼                 │
│ EOS SDK (WiFi) ──► Canon body fires shutter, returns JPEG/RAW over WiFi          │
│                                                                                  │
│   captured file ──► WAL ──► face detection ──► EXIF stamp ──► adaptive upload    │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Pairing flow

A first-time bridge pair takes ≤ 90 seconds end-to-end:

1. Paparazzo opens **Settings → Pair a camera** (only visible once `pro_camera_bridge_addon` is unlocked for their seat).
2. Brand picker — large tap targets for Canon / Nikon / Sony / Fujifilm with the body's native pairing instructions inline ("Press MENU → Wireless Settings → Connect to smartphone").
3. App scans for the camera's WiFi SSID. Camera authentication uses the vendor SDK's standard handshake — no Setnayan-side credentials, no "create account on the camera."
4. Once paired, app downloads camera capabilities (model name, max resolution, shutter speed range, RAW availability).
5. Pair confirmation screen — paparazzo names the rig ("Canon EOS R6 — front camera"), sets RAW vs. JPEG preference, sets default flash behavior.
6. Live View test — phone shows a preview from the DSLR's live view feed; paparazzo points the rig and taps the shutter. If the test photo lands in the last-5 strip, pairing is good; if not, the app drops back to the brand picker with a diagnostic.

A re-pair (camera was paired earlier in the day) is a single-tap reconnect — the phone remembers the last paired body per seat and reconnects automatically when both are powered on within range.

### Capture flow when paired

When the bridge is active, the gesture shutter behaviors map to DSLR equivalents:

| Phone gesture | Paired-camera behavior |
|---|---|
| Tap | DSLR fires single still, no flash |
| Drag up | DSLR fires single still with flash (E-TTL via SDK; flash cap-detect — if no on-camera flash, app warns "no flash on this body" once, then the gesture defaults to a still) |
| Drag right | DSLR records 5-second clip via SDK's video-mode entry; clip ends at 5.0s, just like the phone-internal path |
| Drag right → drag up (chord) | 5-second clip with continuous video light if the body supports it; falls back to silent 5-second clip if not |

Files transfer DSLR → phone over WiFi as they're captured (5 GHz preferred for SDKs that support it; 2.4 GHz fallback). The phone's WAL holds them; face detection runs on the phone; tagging works exactly as it does for phone-internal captures. The last-5 strip shows the DSLR's photos, not the phone's internal sensor's.

### Live View overlay

The phone's viewfinder switches to a **DSLR Live View pass-through** when paired. The vendor SDK streams a 720p preview from the DSLR body to the phone. Setnayan overlays its own UI chrome (storage chip, upload chip, tag drawer, gesture shutter, orientation nudge) on top of that preview, exactly as in the phone-internal path. The phone's own rear camera is held inactive while paired, freeing thermal headroom for the upload + face-detection workload.

### Fallback to phone-internal on disconnect

DSLR WiFi is flaky at venues. The bridge is built around the assumption that pairing will drop and recover during an event. When pairing drops:

- App banner: *"Camera disconnected — switching to phone camera. Tap to retry pair."* (3-second auto-dismiss; the banner does not block the viewfinder.)
- The phone's internal rear camera comes back online; gesture shutter keeps firing without a tap-rate hiccup.
- Auto-retry runs every 5 seconds in the background; on successful re-pair, banner: *"Camera reconnected."*
- All captures during the disconnected window are stamped `paired_camera_brand=null, paired_camera_model=null` — clearly distinguishable from paired captures in the gallery.

### What the bridge unlock gives the couple

- **Optical glass.** Same papic crew, dramatically better stills and video. Couples bringing a friend with a Canon R6 or a Sony A7 IV get true low-light performance, depth-of-field, and burst speed without paying for a hired photographer.
- **No new behaviors to learn.** Same gesture shutter, same QR tag flow, same last-5 strip. The paparazzo learns one app whether they're shooting on a phone or a DSLR.
- **Same delivery + branding.** Photos still flow through the couple's gallery, still get monogram-stamped if the Custom Monogram Pack is purchased, still feed Personal Reels.

### What it does NOT do in V1

- **No multi-DSLR-per-phone.** 1 phone : 1 DSLR. SDK transport bandwidth and pairing complexity make multi-pair untenable for V1.
- **No cross-papic camera handoff.** A bridge unlock is bound to the seat that purchased it; it doesn't follow the camera body. V1.1 may add "transfer bridge to another seat at the same event" as an admin action.
- **No tethered USB pairing.** WiFi only. USB tethering belongs to a different product (full-control studio shooting) and is V2.
- **No DSLR-side firmware updates.** Setnayan app reads camera capabilities; it never writes firmware.

---

## Face detection — layered enrollment + auto-tag

### Three enrollment paths, one face vector store

V1 uses all three of the catalog sources, layered, so the catalog has the best possible coverage by event-day:

1. **RSVP profile photos (baseline, no extra friction).** Every guest who completes RSVP in 0001 / 0002 already uploads a profile photo. On RSVP submit, a backend job extracts a face vector and writes a `face_enrollments` row with `source='rsvp_profile'`. This gets us coverage for ~90%+ of the guest list at zero additional UX cost.
2. **Pre-event guest portal upload (opt-in, higher quality).** Each guest's personal invitation page (0002) gains a *"Help papic tag you in real time"* card with a 1–3 photo upload widget. Photos must be face-forward, well-lit, neutral expression. Each upload writes a `face_enrollments` row with `source='guest_portal'` and a `quality_score` from the on-device QA pre-flight (lighting, sharpness, frontalness). Optional; falls back to RSVP profile if skipped.
3. **On-the-day check-in kiosk (highest quality, controlled lighting).** A laptop or tablet at the venue entrance runs Setnayan's check-in flow. Guests scan their personal QR; the camera captures one face frame; vector merges into `face_enrollments` with `source='checkin_kiosk'` and a high `quality_score`. Couples opting for the kiosk get the cleanest possible recognition catalog because lighting and pose are controlled.

The matcher prefers the highest-quality enrollment per guest. If a guest has all three, the kiosk vector wins; if they have only an RSVP photo, that's the vector used. Coverage > absolute precision — V1's design accepts that some guests will only have RSVP-quality enrollment, and the auto-tag confidence threshold absorbs that.

### On-device inference

Inference runs on the **phone**, never the DSLR. Apple Vision (`VNFaceObservation` + `VNGenerateImageFeaturePrintRequest`) on iOS; ML Kit Face Detection + Face Mesh on Android. A 128-d face vector is computed per detected face, then cosine-matched against the phone's local face vector cache.

The cache is downloaded at seat-claim time (typically 30 s after the paparazzo activates their seat QR). It refreshes:

- Every 5 minutes during the event (catches late RSVPs and check-in kiosk additions)
- On app foreground after a > 1 hour suspend
- On manual pull-to-refresh in the tag drawer

Cache size: ~50 KB per 100 guests. A 200-guest wedding caches at ~100 KB. No meaningful storage or bandwidth cost.

### Confidence thresholds

| Cosine similarity | Behavior |
|---|---|
| ≥ 0.85 | Auto-tagged with `source='auto_face'`. Tag visible in the photo's tag chip immediately. |
| 0.65–0.85 | Surfaces as a *suggested* tag in the last-5 strip. A small "?" chip on the thumbnail; tap to confirm or reject. |
| < 0.65 | No auto-tag. Photo uploads untagged. Existing QR scan, manual Pick, and table fan-out paths all still work — auto-tag is additive, never the only path. |

The 0.85 threshold is conservative on purpose. A wrong auto-tag (Aunt Maria gets tagged in a photo that's actually Aunt Cora) is more costly than a missed auto-tag, because it shows up in *Aunt Maria's* gallery view ("Photos of me") and causes confusion. The suggested-tag tier exists to handle borderline cases without polluting anyone's personal feed.

### Privacy

Face vectors are **scoped to one event** and **never leave Setnayan's per-event vector store**. They're not shared across weddings, not used to train a global model, not exposed to the couple as raw vectors. Guests who toggle `photo_consent = false` at RSVP have their enrollment skipped entirely — no vector is computed, no auto-tag fires for them, the existing face-blur path (master spec Part 5) applies to any photo they're identifiable in.

A guest who enrolled and later wants to revoke can hit *"Delete my face data"* from their personal invitation page; the matcher drops their vector within the next 5-minute cache refresh, and any auto-tags previously applied with `source='auto_face'` and `guest_id=<them>` are revoked from the gallery view.

The face vector store is deleted in full at the event's 5-year retention boundary, alongside the rest of the event's media.

### Data model additions

```sql
CREATE TABLE face_enrollments (
  enrollment_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        UUID NOT NULL REFERENCES events,
  guest_id        UUID NOT NULL REFERENCES guests,
  source          TEXT NOT NULL CHECK (source IN ('rsvp_profile','guest_portal','checkin_kiosk')),
  vector_blob     BYTEA NOT NULL,                  -- 128-d float32, 512 bytes
  quality_score   REAL NOT NULL,                   -- 0.0–1.0 (lighting + sharpness + frontalness)
  captured_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at      TIMESTAMPTZ,                     -- guest-driven deletion timestamp
  CONSTRAINT one_per_source UNIQUE (event_id, guest_id, source)
);

-- existing PhotoTag.source enum gains 'auto_face' (already in master spec data model)
-- new column on photos:
ALTER TABLE photos ADD COLUMN auto_face_attempted BOOLEAN NOT NULL DEFAULT FALSE;
```

Full DDL — including indexes, foreign-key cascade rules, RLS policies, and Supabase storage bucket config — lives in the migration file `0012_papic_migration.sql` alongside this spec.

---

## Face enrollment UX — three paths in detail

The architectural section above explains *what* the matcher does with the catalog. This section specifies *how guests get into it*. All three paths share the same backend table (`face_enrollments`) and the same on-device QA pre-flight; they differ only in surface and operator.

### Shared building blocks

#### Quality QA pre-flight

Before any face is enrolled, the capture surface (RSVP form, guest portal widget, or kiosk app) runs a four-check pass on the candidate frame:

| Check | Threshold | Failure copy |
|---|---|---|
| Single face detected | exactly 1 | *"We see 0 / 2 / 3 faces — make sure only your face is in frame."* |
| Face fills frame | bounding box ≥ 25% of image area | *"Move closer so your face fills more of the frame."* |
| Sharp / not blurry | Laplacian variance ≥ 80 | *"That looks blurry — hold still and try again."* |
| Frontal pose | yaw and pitch each within ±15° | *"Face the camera straight on — chin level."* |

The pass produces a single `quality_score` ∈ [0, 1] equal to the geometric mean of the four sub-scores. A score < 0.4 hard-rejects (asks the guest to retry); 0.4–0.7 enrolls with a soft warning ("This will work but a clearer photo would tag you better"); ≥ 0.7 enrolls silently. The same QA function is shared library code — `face_qa.ts` for web, `FaceQA.swift` for iOS, `FaceQa.kt` for Android — so the bar is identical across surfaces.

#### Consent text (canonical, all three paths)

> *"Setnayan's papic app uses on-device face matching to tag you in photos faster on the day. Your face stays in this wedding only — never shared, never used to train AI, deleted with the rest of the event's photos at the 5-year retention boundary. You can remove it anytime from your invitation page."*

This appears verbatim above the camera tile / file picker on every enrollment surface. It links to the DPO contact card and to the master spec's privacy section.

### Path 1 — RSVP profile photo (0001 / 0002)

The smallest UX delta. Guests already upload an RSVP profile photo as a required step in 0001 / 0002. We add three things:

1. **Quality QA inline.** When the guest finishes cropping their RSVP profile photo, the QA pre-flight runs before the form's "Save" button enables. Hard-rejects show the failure copy as a small note under the photo; soft warnings show as a yellow banner that doesn't block save. The photo still saves regardless of QA outcome — the QA only gates the *enrollment* derived from it.
2. **Consent toggle.** A single checkbox under the cropper: *"Use this photo to tag me in papic photos faster"* — defaults **on**. Unchecking it means the photo saves to the guest record (used for the dashboard, name-card thumbnails, etc.) but no `face_enrollments` row is written.
3. **Backend enrollment job.** On RSVP submit, if the consent toggle is on, a Supabase Edge Function generates the 128-d vector and writes a `face_enrollments` row with `source='rsvp_profile'` and the QA score.

No additional UI surface, no extra step in the RSVP flow. Coverage = baseline ~90% of guests.

### Path 2 — Pre-event guest portal upload (0002)

Lives on each guest's personal invitation page (`setnayan.com/invite/[guest-id]`). Appears as a card below the RSVP and main invitation content, only after RSVP is confirmed:

```
┌──────────────────────────────────────────────────────────────┐
│  [icon: camera]                                              │
│  Help papic tag you in real time                         │
│                                                              │
│  Upload 1–3 face-forward photos so on-the-day papic can  │
│  tag you in photos as the night happens. Your face stays in  │
│  this wedding only.                                          │
│                                                              │
│  [thumbnail: rsvp profile · score 0.82 ✓]                    │
│  [+ Add a clearer photo]   [+ Add a side-light photo]        │
│                                                              │
│  ┌─ Why bother? ─────────────────────────────────────────┐   │
│  │  Your RSVP photo already works for tagging — adding a │   │
│  │  second or third helps when the lighting at the venue │   │
│  │  is different from your RSVP photo.                   │   │
│  └───────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

Capacity: up to **3 enrollment images per guest** (the RSVP profile photo counts as the first slot if consent was given). Each upload runs the same QA pre-flight inline; the thumbnail's quality score appears as a small chip ("excellent / good / blurry"). Guests can swap a low-quality slot for a better photo at any time.

The card is **opt-in by inaction** — guests don't have to engage with it; their RSVP photo is already enrolled if consent was given. The card exists for guests who want better tagging accuracy.

The card disappears for guests with `photo_consent=false` from RSVP — they've explicitly opted out of being tagged at all, so we don't surface enrollment.

### Path 3 — Check-in kiosk (laptop / tablet at venue entrance)

The highest-quality enrollment path. Couples opting in install Setnayan's check-in kiosk app on a laptop or iPad at the venue's main entrance. Existing guests who already enrolled via RSVP / portal are skipped silently; guests with no enrollment, low-quality enrollment, or who want to refresh get a fresh capture under controlled lighting.

#### Hardware footprint

- One laptop (running Chrome/Edge) or one iPad (Safari) — couple's choice. Setnayan provides instructions; couple owns the device.
- Front-facing camera with a 720p+ sensor (every modern laptop / iPad qualifies).
- Optional: a softbox or ring light placed over the device. Setnayan includes a recommendation in the setup guide; not required.

#### Operator flow

The check-in kiosk app is a single-purpose web app (`setnayan.com/kiosk/[event-id]?token=...`). The couple or their coordinator unlocks it once at setup with a session token tied to the event. On launch:

1. Guest walks up. Device shows a centered camera preview with a subtle Setnayan-branded frame.
2. Guest scans their personal QR (printed on their place card from 0008's print pack) using the kiosk's camera. The QR is read in the same camera frame the kiosk is already showing — no separate scanner.
3. Kiosk pulls the guest record. If the guest already has a `quality_score ≥ 0.7` enrollment, kiosk shows *"You're all set, [Name]. Welcome!"* and beeps softly. Done in 1.2 s end-to-end.
4. If enrollment is missing or low quality, kiosk shows *"Hi [Name] — quick face check for the photo magic"* with a 3-second countdown and an animated face-position guide. Guest holds still; kiosk captures one frame.
5. QA pre-flight runs. Soft warning rolls into a retry; hard reject loops back to step 4 with a coaching tip.
6. On success: *"Perfect, see you on the dance floor!"* with a soft chime. Vector writes to `face_enrollments` with `source='checkin_kiosk'`, quality score attached.

Average time per guest: **< 5 seconds** when enrollment is needed. Zero seconds when the guest is already enrolled (the QR scan alone confirms).

#### Operator console (couple / coordinator side)

A small stats panel at the top of the kiosk screen, visible only when the operator taps a hidden corner (so guests don't see it):

- Guests checked in: 47 / 120
- Enrolled at kiosk: 12 (the rest were already enrolled)
- Average enrollment time: 3.8 s
- Failed retries (3+ attempts): 2 (taps to surface guest names + retry prompt)

The panel never shows guest face thumbnails — it's flow stats only, to keep operators from accidentally turning the kiosk into a guest-photo browser.

#### Offline behavior

The kiosk caches the full event guest list + enrollment status on launch (~50 KB per 100 guests). Captured frames + QA scores queue locally if the network drops; the queue uploads automatically when connectivity returns. The kiosk works fully offline for at least 4 hours of typical event throughput before falling back to a "couldn't sync — please bring connectivity" warning.

#### Hard rules

- **Kiosk never persists raw frames.** Only the 128-d vector + quality score leave the device. The frame is held in memory long enough to compute the vector, then dropped.
- **Kiosk never tags photos directly.** Its only output is `face_enrollments` rows.
- **Kiosk respects `photo_consent=false`.** Guests who opted out at RSVP get a *"You opted out of face tagging at RSVP. Welcome!"* greeting and the kiosk skips enrollment entirely.

### Revocation — "Delete my face data"

Every guest has a single revoke link on their personal invitation page (`setnayan.com/invite/[guest-id]`), shown in a *Privacy* section near the bottom:

```
┌──────────────────────────────────────────────────────────────┐
│  Privacy                                                     │
│                                                              │
│  Your face is in this wedding only. We use it to tag you in  │
│  photos automatically. To remove your face data:             │
│                                                              │
│  [ Delete my face data ]                                     │
│                                                              │
│  This stops auto-tagging immediately. Tags already applied   │
│  to photos of you (auto or manual) will stay unless you      │
│  also remove those individually from the photo's tag drawer. │
└──────────────────────────────────────────────────────────────┘
```

Tap behavior:

1. Confirmation modal: *"Stop auto-tagging me in this wedding's photos? You can re-enroll later by uploading a photo on this page or stopping by the check-in kiosk."*
2. On confirm: backend sets `revoked_at = NOW()` on every `face_enrollments` row for that `guest_id` in this event. Vector blobs are zeroed in the same transaction.
3. The on-device face vector cache picks up the revocation on the next 5-minute refresh — usually within 5 minutes of the tap, never longer.
4. Optional checkbox on the modal: *"Also remove existing auto-face tags from photos of me."* If checked, a backend job deletes all `photo_tags` rows where `guest_id=<them>` AND `source='auto_face'`. Manual / QR / table tags stay; couples and other guests retain their tagging actions.

Revocation is **per event**. Revoking at Wedding A does not affect a guest's enrollment at Wedding B (they would re-enroll separately for B anyway, since the vector store is per-event).

### Coverage targets (V1 acceptance)

| Path | Target enrollment rate | Target QA score median |
|---|---|---|
| RSVP profile photo (baseline) | ≥ 88% of confirmed guests | ≥ 0.55 |
| + Guest portal upload (opt-in) | ≥ 35% of confirmed guests use it | ≥ 0.72 |
| + Check-in kiosk (couple-installed) | ≥ 60% of arrivals when kiosk is in use | ≥ 0.84 |

Couples without the kiosk still hit ~88% baseline through RSVP photos alone. Kiosk-using couples hit > 95% combined coverage by event-day, with much higher median quality.

---

## Capture metadata — timestamp, geolocation, and provenance

Every capture stamps a fixed metadata bundle before it leaves the phone. The data lives in three places: the row in the `photos` table (queryable), the file's EXIF / QuickTime atoms (survives any download), and the local SQLite WAL row (so the queue can resume even if the photo never made it to the server).

### Fields

| Field | Source | Notes |
|---|---|---|
| `captured_at` | NTP-synced device clock (`NSDate`/`Instant`, UTC) | Stamped at shutter-release moment, not upload moment. Phone runs an NTP sync at app launch and every 30 minutes after to correct clock drift. |
| `geo_lat`, `geo_lon`, `geo_accuracy_m` | Core Location (iOS) / FusedLocationProvider (Android) | Most recent fix at shutter-release, max age 60 s. If no fix is available, all three are null and the photo uploads with a `geo_unavailable=true` flag — does not block delivery. |
| `device_model` | `UIDevice.current.model` / `Build.MODEL` | E.g., "iPhone 15 Pro Max", "Pixel 8 Pro". |
| `paired_camera_brand` | CameraBridge (null for phone-internal) | "Canon", "Nikon", "Sony", "Fujifilm", or null. |
| `paired_camera_model` | CameraBridge (null for phone-internal) | E.g., "EOS R6 Mark II", "Z 8", "α7 IV", "X-T5". |
| `seat_id` | Seat session token | Already in V1 schema; included here for completeness. |
| `event_id` | Seat session token | Already in V1 schema. |

### EXIF / QuickTime injection

JPEGs get standard EXIF tags (`DateTimeOriginal`, `GPSLatitude`, `GPSLongitude`, `GPSHPositioningError`, `Make`, `Model`, plus a `UserComment` JSON blob with Setnayan's seat / event / paired-camera fields). MP4 clips get equivalent QuickTime metadata atoms (`com.apple.quicktime.creationdate`, `com.apple.quicktime.location.ISO6709`, plus a `com.setnayan.capturecontext` JSON atom).

Files that arrive from a paired DSLR already carry the body's own EXIF (camera maker, lens, aperture, shutter speed, ISO). The phone **merges** Setnayan's metadata into the existing EXIF without overwriting the body's optical fields. Couples downloading a JPEG from the gallery get a file with both Canon's lens info and Setnayan's geo / seat / timestamp. Photographers who want the file as-shot still see the original camera settings.

### Privacy

- **Couple-level geolocation toggle** at event setup. Default ON because wedding venues are public locations, but a couple holding a private home wedding can flip it off and the geo fields are stamped null on every capture for that event.
- **Per-photo geo strip on share** — when a couple or guest shares a photo to Instagram / Facebook / WhatsApp, the share endpoint strips geo EXIF on the rendered share copy. The original on R2 keeps the metadata; only outbound shares get scrubbed. Same rule applies to Personal Reels output.
- **Geofence sanity check** at the server. If a photo's geo coordinates are > 50 km from the event venue's stored coordinates (set at event creation), the geo fields are flagged as "device location anomaly" and quietly dropped from the photo's metadata. Prevents a paparazzo's phone with a stale GPS fix from stamping a wedding photo with their morning-coffee-shop coordinates.

### Data model additions

```sql
ALTER TABLE photos
  ADD COLUMN captured_at          TIMESTAMPTZ NOT NULL,
  ADD COLUMN geo_lat              DOUBLE PRECISION,
  ADD COLUMN geo_lon              DOUBLE PRECISION,
  ADD COLUMN geo_accuracy_m       REAL,
  ADD COLUMN geo_unavailable      BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN device_model         TEXT,
  ADD COLUMN paired_camera_brand  TEXT,
  ADD COLUMN paired_camera_model  TEXT;
```

---

## Adaptive compression + offline queue

### Network speed estimator

The phone tracks a rolling 30-second window of upload throughput across the most recent N completed PUTs. From that, the uploader picks one of three modes for the next outbound payload:

| Mode | Sustained throughput | Behavior |
|---|---|---|
| **Strong** | > 5 Mbps | Upload originals. JPEGs pass through unmodified. MP4 clips pass through unmodified. RAW files (when available from a paired DSLR) upload at full resolution. |
| **Medium** | 1 – 5 Mbps | JPEGs re-encoded at 80% quality (typical 30–40% file-size reduction with no visible quality loss). MP4 clips re-encoded at H.264 CRF 23 1080p. RAW files queued for later — never uploaded in medium mode. |
| **Weak / offline** | < 1 Mbps or no connectivity | Queue everything locally. Upload thumbnails (256 px long edge) only, so the couple's gallery shows that the moment was captured even before the original lands. Originals upload when bandwidth recovers. |

Mode switches are sticky — the estimator avoids flipping between modes more than once every 30 seconds to prevent oscillation when bandwidth is right at the boundary.

### RAW handling

DSLR RAW files are first-class citizens of the queue but never upload in medium mode (a 30 MB RAW on a 2 Mbps link blocks the queue for two minutes). RAW files always upload in strong mode, or wait. JPEGs always ship first because they're what the couple's gallery and the Personal Reel render use; RAW is preserved as the post-event archive and is never on a critical path.

### Offline queue

The capture queue uses the same SQLite WAL that already exists in V1 for the upload pipeline. New behaviors:

- **Persistent across all suspend states.** App backgrounded, phone locked, app force-quit, phone rebooted, battery handed off — the queue persists. Re-launching the app on the same seat (or claiming the seat from a fresh device via the existing handoff QR) drains the queue from where it left off.
- **Resume on foreground / network change.** Background uploader runs on iOS BGTaskScheduler and Android WorkManager (already in V1) — extended to wake on `NWPathMonitor` connectivity-changed events / Android `ConnectivityManager.NetworkCallback`.
- **Exponential backoff** on retries — 5 s → 10 s → 30 s → 60 s → 5 min, then steady at 5 min until either success or 7-day TTL.
- **7-day TTL** on local-only items. After 7 days of failed delivery, the paparazzo gets a *"3 captures couldn't be delivered — re-try?"* prompt with bulk re-try. If the paparazzo dismisses without retrying, the items move to a "Delivery failed" view in *My contributions* where they can still be manually exported.
- **Queue depth indicator** in the existing top-bar upload chip. Today's chip says "12 queued · 3 uploading"; with offline mode, it gains a network mode label: "12 queued · 3 uploading · medium" or "8 queued · offline."
- **Couple gallery placeholder.** When a thumbnail-only weak-mode upload lands but the original hasn't yet, the couple sees a soft "original uploading" badge on that photo. The badge clears the moment the original PUT completes.

### Failure modes worth calling out

- **Phone runs out of battery before the queue drains.** The handoff QR mechanism already exists (V1 spec). When the new device claims the seat, it replays only its own captures forward — captures that lived only in the dead phone's WAL are lost. V1.1 adds queue migration via the cloud once the dead phone reboots and reconnects.
- **Storage runs out on the phone.** The storage chip in the top bar already escalates green → amber → red at 70% / 90%. At > 95% storage, the queue switches to lossy compression (JPEGs at 60% quality, MP4 at CRF 28 1080p) regardless of network mode, and writes a banner: *"Storage critical — uploads are being compressed."* The paparazzo can tap the banner to free space (clear cached previews) or hand off the seat.
- **Network is good but R2 / Setnayan backend is down.** Backoff applies; the queue drains as soon as the backend returns. The couple's gallery is unaffected because the read path is independent of the write path.

---

## Tagging

### QR-based tagging (primary path)

Both QR types from the master spec ship as designed:

- `setnayan:guest:{guest_id}` — encoded in personal QR delivered with each guest's RSVP confirmation
- `setnayan:table:{table_id}` — printed on Setnayan-branded tent cards at each table

Tag flow: paparazzo captures a photo or clip → opens tag drawer or taps the recent capture → scans one or more guest QRs, scans a single table QR, or mixes. **10-tag cap** combined; if a table scan would exceed, system tags the first 10 (alphabetical by RSVP'd name) and surfaces the truncation warning sheet so the paparazzo can swap any of the 10 with the truncated overflow.

**Untagged-still-delivered:** every photo and clip uploaded by a Papic is delivered to the couple's gallery in full resolution regardless of tagging status. Tags improve guest navigation and Personal Reel matching but never gate delivery to the couple.

### Manual picker (Pick button or tag drawer "Pick from list" tab)

When QR isn't available — guest forgot their email, lost their card, or the paparazzo is grabbing a quick candid — the manual picker opens a search-and-select sheet with guests ordered by likelihood:

1. **Faces detected in this photo** — auto-match suggestions from on-device face detection; top of list with face thumbnails
2. **Same group as the last photo** — paparazzo just shot the same cluster
3. **Same table as the last table-tag** — proximity inference from the most recent table scan
4. **Recently tagged across the event** — short-term memory of who they've been near
5. **Alphabetical fallback** — for everyone else

Each row shows the guest's RSVP profile photo (no auto-update from wedding-day captures in V1 — face detection identifies people without needing a refreshed thumbnail), name, table assignment, and a checkmark when tagged. The 10-tag cap applies.

### Tag visibility for guests

Per the master spec — when a guest scans the wedding QR and lands on the gallery, they see three top-level filters: "Photos of me" (anything they're tagged in), "My table" (anything tagged with their table), and "All photos" (the full gallery).

---

## Couple gallery — V1 spec

### Filters (V1 ships four)

1. **Chronological** (default sort, newest first; toggle to oldest first)
2. **Photos of us** — anything tagged with either of the couple's guest_ids
3. **Untagged** — review queue; what needs attention before public unlock
4. **Type** — photos / videos / all

V1.1 adds: by role (bridal party, family, friends, vendors), by team (Bride / Groom side), by schedule segment (ceremony, cocktail, reception, after-party), by individual guest, couple-favorited, needs-attention (untagged + NSFW-flagged), by papic seat, orientation. None of these are blockers for V1; couple feedback after launch will tell us which to prioritize first.

### 7-day review window

Per master spec Part 3.1 step 6-7. After the event, the couple has 7 days (configurable 0-14) to review the gallery before public unlock to all guests. This iteration adds:

- **Countdown banner** at the top of the gallery: "Public unlock in 4d 6h." Tap to extend, tap to release early.
- **Reminder pushes** at 24h, 12h, and 1h before unlock so the couple doesn't sleep on the review.
- **Bulk hide / unhide** — multi-select with rubber-band on web and multi-tap on mobile; one action hides a whole bad-lighting batch from the public gallery. Hidden photos remain visible to the couple in their dashboard.

NSFW filter is on by default and cannot be disabled (master spec Part 5.3). Flagged photos land in the moderation queue for couple review; rejection is bulk-actionable.

---

## Personal Reels — V1 spec

Per master spec Part 2, Part 3.3, and Part 4.3. V1 ships:

- 1-30 second flexible duration; guest picks how long, template auto-scales slot durations
- 1080×1920 vertical 9:16 H.264 MP4 output
- Up to 5 guest-picked photos / clips + up to 5 couple memorable clips (auto-filled from the couple's pre-event upload)
- Music from Setnayan's owned AI-generated catalogue (₱0 per render — no licensing)
- Templates purchased per-unlock at ₱49 each (PHP charm pricing locked 2026-05-12)
- Reel preview in the builder before render commits — 3-second thumbnail loop of the chosen template with the guest's selected photos
- Share targets: TikTok, IG Reels, IG Feed, IG Stories, Facebook, X, WhatsApp, save to camera roll, plus a download button
- Setnayan logo on share / download by default; **couple's monogram replaces the logo** when the Custom Monogram Pack (0011) is purchased

### Landscape source handling

When a guest picks a landscape photo for their 9:16 reel, default behavior is **Ken Burns crop** — slow pan / zoom across the photo, keeping it full-frame and visually alive. Looks intentional, doesn't waste vertical real estate. No letterbox bars or blurred-edge fill.

The persistent portrait nudge in the papic app aims to keep landscape photos rare in the source pool, but the reel render handles them gracefully when they appear.

---

## Privacy

Per master spec Part 5.

- Opt-out at RSVP with a face-blur preview ("here's what you'd look like in the gallery"). One toggle, immediately reflected in the consent record.
- Face-blur registration applies on-device first (MLKit / Vision detection), server-side verified; blurred faces in the gallery for opt-outs.
- DPO contact card linked from every guest view and every couple dashboard.
- 5-year retention matching PH wedding industry standard, R2 hot 90 days then cold archive. Annual reminder to extend.
- PH Data Privacy Act (RA 10173) compliance handled by Setnayan's existing DPO.

---

## Payments integration (depends on 0034)

This iteration consumes four SKUs from the 0034 `service_catalog` (in addition to consuming the `custom_monogram_pack` flag from 0011 and co-registering the Pro Camera Bridge SKU with 0011):

```
sku_code:               paparazzi_3_seats
name:                   3 Papic
description:            3 app seats per event
category:               paparazzi
price_php_centavos:     149900           -- ₱1,499
is_multi_purchase:      false
ref_binding_on_paid:    (event_id) → insert 3 paparazzi_seats rows

sku_code:               paparazzi_5_seats
name:                   5 Papic
description:            5 app seats per event
category:               paparazzi
price_php_centavos:     249900           -- ₱2,499
is_multi_purchase:      false
ref_binding_on_paid:    (event_id) → insert 5 paparazzi_seats rows

sku_code:               template_unlock
name:                   Personal Reel template (per unlock)
description:            Unlocks one Personal Reel template
category:               template
price_php_centavos:     4900             -- ₱49
is_multi_purchase:      true
ref_binding_on_paid:    (event_id, template_id from cart_items.metadata) → insert event_template_unlocks row

sku_code:               pro_camera_bridge_seat    -- shared with 0011 Panood; one catalog row, both iterations consume
name:                   Pro Camera Bridge (per DSLR seat)
description:            WiFi-SDK pairing for Canon / Nikon / Sony / Fujifilm
category:               paparazzi
price_php_centavos:     149900            -- ₱1,499
is_multi_purchase:      true
ref_binding_on_paid:    (event_id, paparazzi_seat_id | live_stream_camera_id from cart_items.metadata) → insert pro_camera_bridge_seats row
```

Purchases flow through the 0034 cart → checkout → screenshot → admin-approve loop. Multiple template purchases per event are allowed (couples typically buy 3). Pro Camera Bridge unlocks are bound at activation-time to a specific papic seat or Panood camera slot — once bound, the unlock travels with that seat through any battery-handoff or device swap, but does not transfer across seats. The catalog row itself is owned by 0011 to keep the SKU definition single-source-of-truth; 0012 simply references the same `sku_code`.

---

## Admin

- **Regenerate papic seat token** from the Setnayan support dashboard. Used when a paparazzo loses their phone mid-event and needs a fresh claim QR.
- **Event status dashboard** for support: photos uploaded, tags applied, reels rendered, render queue depth, papic seats claimed and their connection status.

No Photo Center curator role in V1. Curation is deferred entirely to 0013 V1.1 Polish — no admin-lite version, no support-curated workflow. Tag accuracy in V1 comes from face detection on-device + smart guest ordering + papic tagging at capture time.

---

## Build order — Pro Camera Bridge + face + metadata + offline

Sprint plan for the additions specced in this revision (DSLR pairing, face detection auto-tag, capture metadata, adaptive compression + offline queue). Sequenced to keep critical path short and parallelize where possible. Each sprint is 2 weeks; total ≈ 16 weeks of engineering for V1 launch including the existing 0012 V1 work.

### Sprint 0 — Foundations (week 0, prerequisites)

Blocks every other sprint below.

- [ ] **0013 Platform Stack** must be at "schemas land" milestone — `events`, `guests`, `papic_seats`, `photos` tables exist in Supabase
- [ ] **0003 Apply-then-Pay flow** must support `pro_camera_bridge_addon` SKU registration and the `(event_id, papic_seat_id | panood_camera_id)` ref_type binding
- [ ] **R2 buckets** provisioned: `events/{id}/photos/`, `events/{id}/face_vectors/` (vector cache shipped to phones; never holds raw frames)
- [ ] Vendor SDK accounts registered (Canon Developer Program, Nikon Developer, Sony Pro Developer ID, Fujifilm SDK access). See `0012_papic_sdk_notes.md` for per-vendor steps. Allow 2–4 weeks lead time for Sony and Fujifilm approvals; start day one.

### Sprint 1 — Native shell + CameraBridge abstraction (weeks 1–2)

Critical path. No DSLR work yet — just the abstraction so vendor SDKs slot in cleanly.

- [ ] iOS app skeleton (Swift / SwiftUI) — gesture shutter, viewfinder, last-5 strip, tag drawer, settings
- [ ] Android app skeleton (Kotlin / Compose) — same surfaces
- [ ] `CameraBridge` protocol (Swift) / interface (Kotlin) defined: `connect()`, `disconnect()`, `livePreview() -> Stream`, `triggerStill(flash: Bool)`, `triggerClip(durationMs: Int, light: Bool)`, plus capability metadata
- [ ] `InternalCameraBridge` implementation backed by AVFoundation (iOS) / CameraX (Android). Phone-internal capture works end-to-end through the abstraction.
- [ ] Capture pipeline writes to SQLite WAL with the new `photos` schema columns (captured_at, geo, device_model, paired_camera_brand/model, auto_face_attempted) — null on phone-internal until pairing lands

Deliverable: a paparazzo can install the app, claim a seat via QR, and shoot photos / clips with the phone-internal camera. No DSLR support yet.

### Sprint 2 — Capture metadata + adaptive compression + offline queue (weeks 3–4)

Parallelizable with Sprint 3 (different file surfaces). Two engineers split.

- [ ] NTP sync at app launch + every 30 min; `captured_at` stamped at shutter-release moment
- [ ] Core Location (iOS) / FusedLocationProvider (Android) integration; `geo_*` fields stamped with max-age 60 s
- [ ] EXIF injection on JPEGs (`DateTimeOriginal`, `GPS*`, `Make`, `Model`, `UserComment` JSON); QuickTime atoms on MP4s
- [ ] Server-side geofence sanity check (50 km from venue → drop geo metadata)
- [ ] Couple-level geolocation toggle in event settings UI (default ON)
- [ ] Outbound share endpoint strips geo from rendered share copy
- [ ] Bandwidth estimator: rolling 30-second throughput window; sticky-mode classifier (strong / medium / weak)
- [ ] Three-mode upload pipeline: pass-through / 80%-quality JPEG + CRF 23 H.264 / queue-only-with-thumbnails-first
- [ ] WAL-backed offline queue with NWPathMonitor (iOS) / ConnectivityManager.NetworkCallback (Android) wakeups; exponential backoff 5 → 60 s → 5 min steady; 7-day TTL with bulk re-try prompt
- [ ] Top-bar upload chip extends to show network mode label

Deliverable: phone-internal captures survive a 10-minute network blackout test, ship correct EXIF, and switch compression modes under a network-throttling rig.

### Sprint 3 — Face detection inference + on-device cache (weeks 3–4, parallel with Sprint 2)

- [ ] Apple Vision integration (iOS): `VNFaceObservation` → `VNGenerateImageFeaturePrintRequest` → 128-d vector
- [ ] ML Kit Face Detection + Face Mesh (Android) → 128-d vector via shared TFLite model
- [ ] Cosine-match against on-device cache; thresholds at 0.85 / 0.65 / below
- [ ] Vector cache download on seat-claim; refresh every 5 min during event; refresh on app foreground
- [ ] Auto-tag write path (`photo_tags(source='auto_face', confidence=...)`) integrated with existing tag flush
- [ ] Suggested-tag UI on the last-5 strip ("?" chip → confirm/reject sheet)
- [ ] `auto_face_attempted` flag set on every photo regardless of match outcome

Backend / web parallel work in this sprint:

- [ ] Backend Edge Function: RSVP profile photo → 128-d vector → `face_enrollments(source='rsvp_profile')` row on RSVP submit
- [ ] Guest portal "Help papic tag you" upload widget (lives in 0002's invitation page); QA pre-flight inline
- [ ] Web kiosk app shell at `setnayan.com/kiosk/[event-id]` — QR scan + face capture + QA pre-flight + offline queue
- [ ] "Delete my face data" revocation surface on the invitation page; backend cascade on `revoked_at`

Deliverable: a guest enrolls via RSVP photo → papic shoots a photo of them → photo arrives in the gallery already tagged with their name.

### Sprint 4 — Pro Camera Bridge: Canon + Sony (weeks 5–7)

The two largest wedding-photographer brands ship first. Sony tends to be slower to integrate than Canon (SDK is more abstract); plan accordingly.

- [ ] Canon EOS Camera Connect SDK integration: pairing handshake, live-view stream parser, `triggerStill` + `triggerClip` mappings
- [ ] `CanonBridge` implementation of `CameraBridge`
- [ ] Sony Camera Remote SDK integration: same surface
- [ ] `SonyBridge` implementation
- [ ] Pairing flow UI: brand picker, WiFi handshake, body capability download, named-rig confirmation, Live View test
- [ ] Live View pass-through in the phone's viewfinder with Setnayan UI chrome overlaid
- [ ] Disconnect detection + auto-fallback to internal camera within 3 s
- [ ] Auto-retry every 5 s with banner toggling
- [ ] `dslr_pairings` table writes on successful pair; `paired_camera_brand/model` propagated through the photos pipeline
- [ ] Cart binding flow: `pro_camera_bridge_seat` SKU at checkout captures slot binding metadata; on admin approve, the activation hook binds the unlock to the chosen paparazzi seat or live stream camera slot

Deliverable: a paparazzo with a Canon R6 or a Sony A7 IV can pair, shoot, and have their photos arrive in the gallery with full DSLR EXIF preserved + Setnayan provenance fields appended.

### Sprint 5 — Pro Camera Bridge: Nikon + Fujifilm (weeks 8–9)

Same scaffolding as Sprint 4; faster because the abstraction and UI exist.

- [ ] Nikon SnapBridge SDK integration; MTP-WiFi fallback for older Z bodies
- [ ] `NikonBridge` implementation
- [ ] Fujifilm Camera Remote SDK integration
- [ ] `FujifilmBridge` implementation

Deliverable: all four brand families pair successfully against the test rig; per-vendor known-issue list documented in `0012_papic_sdk_notes.md`.

### Sprint 6 — Panood camera-operator mode in 0012 binary (weeks 9–10, parallel with Sprint 5)

- [ ] Mode selector at seat-claim screen ("Papic capture" vs "Panood camera")
- [ ] WebRTC publish path: re-encode DSLR live-view stream for Cloudflare Stream Live SFU ingest
- [ ] Hand-off the same `CameraBridge` instance between Papic and Panood modes (capture vs continuous publish)
- [ ] Slot binding: `pro_camera_bridge_addon` bindable to `panood_camera_id` as well as `papic_seat_id`
- [ ] Compositor sees the DSLR-paired stream as a normal WebRTC publish — no compositor change needed (validated)

Deliverable: a Panood camera operator with a DSLR can run the 0012 native binary in LS-camera mode and appear on the broadcaster's grid as a normal camera tile, with the brand/model surfaced in the tile metadata.

### Sprint 7 — Hardening + field test (weeks 11–12)

- [ ] Network-throttling rig in CI: simulate 5 Mbps / 2 Mbps / 0.5 Mbps / offline; verify mode switches
- [ ] Battery handoff test: drain phone to 20%, hand off via QR, verify queue continues from new device
- [ ] DSLR pairing test against bodies from each brand (rented or borrowed)
- [ ] Geofence sanity check tests: photos stamped > 50 km from venue lose geo metadata
- [ ] Auto-face accuracy sweep on a synthetic 100-guest event; tune thresholds if false-positive rate > 2%
- [ ] One real-event field test (engineering team's wedding, friend's wedding, or staged event with paid guest stand-ins)

Deliverable: V1 acceptance criteria all green; field-test photos render correctly in the gallery with auto-tags + DSLR EXIF + Setnayan metadata.

### Sprint 8 — Beta + launch (weeks 13–16)

- [ ] Closed beta with 3 paying couples (heavy-touch support)
- [ ] Telemetry dashboards (Sentry + Cloudflare Analytics + Supabase logs)
- [ ] Per-vendor SDK quirks discovered in beta → documented in SDK notes file → patches as needed
- [ ] Public launch when: zero P0 bugs in beta + closed-loop tagging accuracy ≥ 92% + DSLR pairing reconnect rate ≥ 95% on each brand

### Critical path / dependency graph

```
Sprint 0 (foundations) ──┬── Sprint 1 (native shell + CameraBridge) ──┬── Sprint 4 (Canon + Sony) ──┐
                         │                                            ├── Sprint 5 (Nikon + Fuji) ──┼── Sprint 7 (hardening) ── Sprint 8 (beta + launch)
                         │                                            └── Sprint 6 (LS operator)  ──┘
                         ├── Sprint 2 (metadata + offline) ────────────────────────────────────────┤
                         └── Sprint 3 (face detection) ───────────────────────────────────────────-┘
```

Sprints 2 and 3 run in parallel with Sprint 1 and start as soon as their backend surfaces (schemas, edge functions) are landed by Sprint 0. Sprint 6 (LS operator mode) depends on Sprint 4 finishing the Canon + Sony bridges so it can validate the WebRTC re-encode path against a paired DSLR.

### Cross-iteration blockers worth surfacing now

- **0001 / 0002 (RSVP, invitation page):** add the consent toggle to the RSVP profile photo crop step + add the "Help papic tag you" widget + add the "Delete my face data" revocation surface. ~2 sprints of frontend work; coordinate with whoever owns 0001/0002.
- **0008 (seating chart print pack):** print-pack QR for the personal-card check-in flow already exists in 0008's print pack. Kiosk app reuses it. No new artifact needed; just verify the QR token format matches what the kiosk app expects.
- **0011 (panood):** the WebRTC ingest pipeline + compositor already accept any WebRTC publish; Sprint 6 only adds the camera-operator mode in the 0012 binary. No 0011 backend changes.
- **0013 (platform stack):** schemas + buckets in Sprint 0. Block on this before kicking off Sprints 1–3.

---

## Output-layer build order — Live Wall → SDE → Stories → Thank-You (sequenced 2026-06-10)

> **Why this section exists.** The Sprints above sequence the *capture* side (seats, Cam Bridge, face, metadata, offline). They do **not** sequence the **produced-output layer** — Live Photo Wall, SDE, Guest Stories, Thank-You Video. Competitive research (2026-06-10 · memory `project_setnayan_papic_competitive_strategy`, vs Moments / Waldo / Kwikpic / POV / Kululu / Pic-Time) found this layer is Papic's real moat: **no competitor auto-produces a highlight reel / SDE / thank-you with cleared music** — they can't, because they don't own the music. All four SKUs are "Coming soon" today, so the differentiation is the part still unbuilt. This is the order to build them in.

> **Estimates are Claude Code build time, not human-engineer months** (owner convention) + calendar-bound externals called out separately. The legacy "weeks 1–N" sprints above predate that convention. `service_key` for each add-on per `Pricing.md § 0` / `lib/sku-catalog.ts` — these are cataloged but `isActive=false` today; confirm keys at build time.

### Phase 0.A — Gating prerequisite: the live capture feed (must exist first)

Every output feature consumes the same input: tagged Papic photos/clips flowing into the event pool with NSFW + consent + FaceBlock flags resolved. Today the native capture app is **not built** (Capacitor shell only); only the webapp slice + couple gallery ship. **Nothing in this section can light up until the browser-based capture path (paparazzi seats + disposable cameras) is actually emitting photos.** That capture path — not the render pipeline — is the true blocker. Treat "capture emits photos" as the hard prerequisite.

### Cross-cutting privacy rule (applies to all four)

Live Wall, SDE, Stories, and Thank-You all display or compile guest faces. Each must honor the same multi-view rules: **NSFW filter on (cannot disable), FaceBlock-opted guests blurred on the public surface (server-rendered derivative, not CSS), per-event face scope, RA 10173 consent.** The Live Wall is a *public venue projection* — the strictest case: a FaceBlock guest must appear blurred on the wall in real time.

### Phase 0.B — Shared render foundation (needed for SDE/Stories/Thank-You, NOT for Live Wall)

The video features ride one backbone: the template-driven FFmpeg/Remotion render worker + owned-AI music pairing + the ~400-template library. Two seeds already exist in spec — Personal Reels render (1080×1920 H.264 in 30–90 s; acceptance criteria above) and Auto-Recap (FFmpeg, no AI, 60–90 s). SDE/Stories/Thank-You are new *template formats + curation logic* on the same worker, not new pipelines. **Live Wall is photo display (no video encode) and does not depend on this — which is exactly why it goes first.**
- **Calendar-bound external:** the SDE / Stories / Thank-You template designs + any new music pairings come from the Cowork asset workstream (`14_Music_Catalogue_Cowork_Playbook.md`) — owner-side, runs in parallel, not Claude Code time.

### Phase 1 — Live Photo Wall · ₱2,499 (⚠ price — see drift note)

**What:** a full-screen real-time collage projected at the venue (TV / projector / LED) that fills as paparazzi + disposable cameras shoot, with a live capture count. The in-venue "wow" + the social engine that drives guest participation. Table stakes among capture-camp competitors (POV, Kululu, PhotoShare.ph) and a PH reception expectation (booth live-walls).
**Why first:** highest visible impact per build-day, no video-render dependency, and the **display surface already shipped** (2026-06-09 — `events.photo_wall_photos` masonry on the recap page, with the standing note to "source the wall from `papic_photos` once 0012 ships its live pipeline"). What's missing is only the *live feed* into it.
**Depends on:** capture feed (0.A) · NSFW + FaceBlock gates · existing `photo_wall_photos` display.
**Build:**
- [ ] `/wall/[event-id]` full-screen display route (no chrome; auto-advancing animated collage; live count badge "N photos captured live · Powered by Setnayan")
- [ ] Live feed: new approved `papic_photos` for the event (post-NSFW, post-consent) pushed via polling or lightweight realtime
- [ ] **Server-side FaceBlock** applied to wall frames (a blurred-opt-out guest is blurred on the projection — strict, real-time)
- [ ] Couple/coordinator moderation: hide-from-wall toggle; honor the live-event override of the 7-day review window
- [ ] Reuse the recap-page masonry styling for visual continuity
**Claude Code time:** ~8–11 days (re-scoped + owner-confirmed 2026-06-11 — see the full **Salamisim** section below; the original ~1–2-day guess under-scoped the anonymous-projection security + the server-baked FaceBlock pipeline).
**Done when:** a photo shot at the venue appears on `/wall/[event-id]` within seconds, FaceBlock guests render blurred, NSFW is filtered, the live count increments.

### Phase 2 — SDE (Same-Day Edit) · ₱4,999 (⚠) · 3-min compilation

**What:** the Filipino wedding ritual — a ~3-minute edited highlight screened *at the reception, same day*. Auto-curated from the event pool, template-driven, scored to owned-AI music. Highest cultural-leverage feature (couples already pay ₱150–300k for SDE-led video packages).
**Why second:** establishes the **video render backbone** that Stories + Thank-You reuse, and owns an existing behavior rather than teaching a new one.
**Depends on:** 0.B render foundation · capture feed · SDE template designs (Cowork) · music catalogue.
**Hard constraint:** *same-day* — the render must complete inside the reception window. Deterministic curation (no per-render AI) + a fast, reliable 3-min 1080p encode.
**Build:**
- [ ] Auto-curation heuristic (no per-render AI): rank the pool by quality + face-coverage + moment diversity → shot list; couple/coordinator can nudge
- [ ] SDE template format (3-min, 16:9 for projection + 9:16 variant), slot timings, monogram intro/outro
- [ ] Music pairing from the owned catalogue by template `music_pairing_categories`
- [ ] Render orchestration tuned for same-day latency + a "screen now" handoff to the coordinator
- [ ] FaceBlock / NSFW honored in the compiled output
**Claude Code time:** ~3–5 days (curation + SDE template format + same-day render orchestration).
**Done when:** from a live event pool, an SDE renders within the reception window, plays 16:9 on the venue screen, honors FaceBlock/NSFW, music auto-paired.

### Phase 3 — Guest Stories · ₱1,499 (⚠) · 30-second story maker

**What:** a per-guest 30-second vertical "story" each guest builds from their own tagged photos. The viral, per-guest loop — every guest leaves with something to post.
**Why third:** it is essentially the **already-specced Personal Reels builder** (1–30 s, 9:16, guest-built, owned music — see *Personal Reels* above) productized to a 30-s story SKU. Cheapest of the four because the builder + render already exist; it just needs story templates + the SKU gate.
**Depends on:** 0.B render foundation · the existing Personal Reels builder · story template pack (Cowork).
**Build:**
- [ ] Story template pack (30-s, 9:16) added to the template library
- [ ] Scope the existing Personal Reels builder to the Stories SKU (30-s cap, story templates, share targets)
- [ ] SKU gate via 0034
**Claude Code time:** ~1–2 days (reuses the reel render + builder).
**Done when:** a guest with tagged photos builds + renders a 30-s 9:16 story with owned music and shares it.

### Phase 4 — Thank-You Video · ₱3,499 (⚠) · 5-min compilation

**What:** a ~5-minute couple→guests compilation delivered after the event to everyone who attended.
**Why last:** post-event, **no live or same-day constraint** → the safest to defer; reuses the entire backbone with the loosest deadline.
**Depends on:** 0.B render foundation · capture feed · attendee list (0001) · email delivery (0028) · thank-you template (Cowork).
**Build:**
- [ ] Thank-You template format (5-min), couple-curated or auto-curated from the pool
- [ ] All-attendee delivery (email-only V1 via 0028, per no-SMS)
- [ ] FaceBlock / NSFW honored
**Claude Code time:** ~1–2 days.
**Done when:** a 5-min thank-you renders post-event and delivers to every attending guest by email.

### Sequence + dependency graph

```
Phase 0.A capture feed (BLOCKER — must emit photos) ──┬───────────────────────────────────────────┐
                                                      │                                           │
Phase 0.B render foundation (FFmpeg/Remotion + music) ┼── Phase 2 SDE ──┬── Phase 3 Stories        │
   (Cowork: templates/music land in parallel)         │                └── Phase 4 Thank-You       │
                                                      └── Phase 1 Live Wall (no video dep) ────────┘
```

Phase 1 (Live Wall) needs only the capture feed, so it ships first and proves the live pipeline. Phase 0.B + Phase 2 (SDE) build the video backbone; Phases 3–4 reuse it. **Total Claude Code build ≈ 1.5–3 weeks**, gated on the capture feed being live and the Cowork template/music assets landing in parallel.

### ⚠ Price reconciliation flag (owner — confirm before these go live)

Today's live site (`setnayan.com/pricing`, fetched 2026-06-10) shows **SDE ₱4,999 · Thank-You ₱3,499 · Guest Stories ₱1,499**. The 2026-06-04 reconciliation line at the top of this file recorded **SDE ₱3,499 · Thank-You ₱5,499 · Guest Stories ₱1,999** — the SDE and Thank-You numbers look **swapped/changed** since. Per source-of-truth order the **live site wins**; the prices in this section use the live-site figures. **Owner: confirm the live-site set and I'll align `Pricing.md § 0` + the line-13 note.** Live Photo Wall ₱2,499 was not re-listed in today's Papic fetch — confirm it still ships at that price.

---

## Kwento — photo-anchored guest messages ("the story behind this moment")

> **Designation:** 0012 Papic · net-new `photo_messages` table · designed 2026-06-10. Owner ask (verbatim intent): *"On Papic we can also create a message/caption on the photo so the people are telling a story to the couple."*
> **One line:** A guest taps a photo of themselves, tells the couple what was happening, and their words land in the couple's review queue, overlay the Live Wall in real time, and become an on-screen caption (later, a music-ducked voiceover) when that photo plays in the SDE / Thank-You video on Setnayan-owned music.
> **Shape:** text-caption-first MVP wired to the full sentiment-as-fuel output path. Voice/video is a flagged Phase-2 owner decision (§ Owner sign-offs), **not** V1.
> **✅ P0–P2 SHIPPED 2026-06-11** (PR #1257, merged; migration `20261113000972` applied + prod-smoked). Live, end to end: `photo_messages` (polymorphic anchor; consent-at-insert; `print_consent` fail-closed; DB interlocks `wall_needs_clean`+`approved_needs_screen`) · `guest_message_blocks` · service-role `submit_photo_message` (cap 10/event incl. rejected · 3/60s burst · edit-resets-moderation, max 3, locked-once-baked) · audited `guest_visible_messages` · one-tap `wall_approve_caption`/`wall_clear_caption` · **Tier-1 EN+TL+CEB moderation lexicon + PH-PII gate** (`lib/kwento-moderation.ts`, 17 tests; Tier-2 OFF per residency rec) · the guest author sheet on the disposable camera (post-shot, consent tick blocks Send) · the couple review queue on the moderation page · the wall lower-third with attribution. Still open per this spec: the guest 24h self-delete surface, the 0028 email nudges, Tier-2 residency sign-off, the standalone-guestbook reconciliation.
>
> **Owner sign-offs (locked 2026-06-10):** ✅ **text-only** in V1 · ✅ **free for every guest incl. free Receivers** (monetize the produced video; no new SKU) · ✅ Live Wall = **couple/coordinator one-tap approve-to-wall** (no auto-publish, no hold-delay). The remaining items in § Owner sign-offs stay open for owner decision.

### Why this shape (and what "story" means in V1)

The literal primitive is **one message bound to one photo by one guest** — a caption, not a chaptered narrative builder. V1 ships the caption and brands the aggregate as the story: *the couple's whole collection of Kwento, read together, is the story their guests told them.* The per-photo narrative/chaptered builder is explicitly **V1.1**. Differentiation does not live in the authoring surface — it lives in where the words go (the produced video the platform already plans to ship). Setnayan **owns its music** (Personal Reels music is ₱0, see `0012:1031`); no competitor can legally compile guest UGC + guest-voice narration over owned music. *"The photos tell the story; the guests narrate it."*

### User flow — zero-account guest → couple receives

```
GUEST (zero-account, S89G-…)
  │  scans Universal Event QR → name + email → signed event-scoped session
  │  (existing 0002 magic-link: httpOnly cookie carrying { guest_id, event_id, exp 30d } — a custom
  │   setnayan_guest_session JWT, NOT a Supabase auth.uid() row — this is load-bearing for RLS below)
  ▼
"Photos of you" feed   (existing tagged-photos view; photo_tags.guest_id = me, 0012:740)
  │  each photo card carries a soft rotating prompt chip:
  │     "✍️ Ano'ng nangyari dito? Kwentuhan mo sila."  ("What happened here? Tell them.")
  ▼
AUTHOR SHEET (inline expand-in-place, no modal, thumb-zone, single screen)
  │  parent photo pinned · 280-char textarea · emoji · rotating photo-anchored prompt
  │  MANDATORY write-time consent tickbox (RA 10173 — captured on EVERY message, not "first only")
  ▼
SUBMIT → POST /api/papic/messages { photo_id, body_text, consent:true }
  │  server action validates the guest-session JWT (service_role write — guests have no auth.uid())
  │  → resolves guest_id from the SESSION (never the rotatable qr_token, per 0012:143)
  │  → atomic per-guest cap + burst guard inside the insert txn
  │  → SYNCHRONOUS Tier-1 text gate (EN+TL+CEB lexicon + PH-PII regex) runs BEFORE any surface
  │  → Tier-2 multilingual classifier runs ASYNC (can only DOWNGRADE clean→flagged; never blocks the send)
  │       clean   → status='pending', moderation_state='clean',  wall_eligible per § wall rule
  │       flagged → status='pending', moderation_state='flagged', wall_eligible=FALSE (couple sees it badged)
  │       blocked → rejected inline at the editor ("Let's keep it sweet 💛 — try rephrasing")
  ▼
THREE FAN-OUTS, each with its own gate
  ├─ COUPLE GALLERY (always)  → couple sees it IMMEDIATELY, full attribution (master view, 0012:992)
  │                             → rides the existing 7-day review window before PUBLIC unlock (0012:746)
  ├─ LIVE WALL (if live)       → eligible only after the stricter wall gate (§ Live Wall) overlays the frame
  │                             (live override of the 7-day window per 0012:1008; couple/coordinator kill switch)
  └─ PRODUCED-VIDEO POOL       → has_approved_message = deterministic curation BOOST in SDE/Thank-You
                                 → baked ONLY into FINAL renders produced AFTER approval (§ Erasure)
  ▼
Guest keeps Edit / Delete for 24 h (any edit RESETS moderation, see § Edit). RA 10173 erasure always available.
T+1–2 day Resend email nudge to non-writers (email-only, no SMS).
```

**Durable identity (load-bearing):** the message binds to `guests.guest_id` (UUID PK), never to `qr_token` or the cookie (`0012:143`). The **stored row** survives QR re-issue, cookie loss, device change. **Authoring/edit/24h-withdraw actions** require a live session, so a rotated QR forces a re-scan before those actions work again — therefore the RA 10173 erasure path is **also** reachable from the couple/admin side so a rotation can never strand an erasure request.

### UX — guest authoring surface (inline in "Photos of you")

```
┌─────────────────────────────────────┐
│  [ photo of Tita Baby laughing ]    │   ← parent photo (multi-view resolved)
│  📸 by Kuya Paparazzi · 7:14 PM      │
│  ┌─────────────────────────────────┐ │
│  │ ✍️ Ano'ng nangyari dito?         │ │   ← ghost prompt chip (rotates per visit)
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
        ↓ (tapped — expands in place, autofocus)
┌─────────────────────────────────────┐
│  [ photo of Tita Baby laughing ]    │
│  ┌─────────────────────────────────┐ │
│  │ Right after the first dance —    │ │
│  │ hindi mapigil ni Tita ang luha   │ │
│  │ sa sobrang saya 🥹               │ │
│  │                          198/280 │ │
│  └─────────────────────────────────┘ │
│  😊 ❤️ 🥹 🎉                          │
│  ☑ I'm okay for the couple & guests   │   ← RA 10173 write-time consent (EVERY message; blocks Send)
│    to see my name + message, and to  │
│    use it in their wedding video. 💛 │
│        [  Send to the couple  💌  ]  │   ← primary, thumb-zone bottom
│        Cancel                        │
└─────────────────────────────────────┘
        ↓ (sent)
  "Naipadala na! 💛 Salamat — your story is on its way to the couple."
  [ Edit ]  [ Delete ]   ← 24 h
  "43 kwento na ang naipadala"   ← live social-proof counter
```

**Accessibility (required, not optional — elderly Tita-Baby guests are a core audience):**
- WCAG AA contrast on the sheet, textarea, and consent line; visible focus ring; logical focus order.
- The sheet is fully **keyboard-operable** and dismissible without touch (not tap-only); emoji row and consent box are reachable by Tab.
- Programmatic labels on the consent checkbox and Send; `aria-live="polite"` on the social-proof counter.
- `prefers-reduced-motion` disables prompt-chip rotation and slows/stops Live Wall auto-advance.
- Title-card text in renders is real text; guest-facing playback exposes the message as readable text, never image-only.

### UX — couple's view (new "Kwento" lens in the 0021 gallery)

```
FILTERS:  [ All ]  [ Photos of us ]  [ Untagged ]  [ Flagged ]  [ 💌 Kwento ●3 ◀NEW ]

⏳ Stories + photos go public in 3d 6h.   [ Extend ]  [ Release early ]   ← reuses the 0012:746 banner
   Clean messages publish with their photo. Flagged messages stay hidden until you approve.

┌──────────────────────────────────────────────┐
│  [ photo ]            💌 2 messages            │
│  Tita Baby Reyes · pending                     │
│  "Right after the first dance — hindi mapigil  │
│   ni Tita ang luha sa sobrang saya 🥹"         │
│        [ Approve ]  [ Hide ]  [ Reject ]       │
│  ──────────────────────────────────────────── │
│  ⚠ Marco Cruz · flagged for review             │   ← moderation_state='flagged', couple-only
│  "[hidden — needs your review]"                │
│        [ View ]  [ Approve anyway ]  [ Reject ] │
│  🚫 [ Block this guest from messaging ]         │   ← per-(event,guest) block lever (§ Abuse)
└──────────────────────────────────────────────┘
Bulk:  ☑ 12 selected   [ Approve selected ]  [ Hide selected ]
```

The couple **always sees every message immediately**, full attribution, master view (`0012:992`). `pending` governs only *public* visibility.

### Data model

> **⚠ Schema correction (2026-06-11, surfaced by the Live Photo Wall design).** The `photo_messages.photo_id … REFERENCES photos(photo_id)` below is **broken-on-arrival — there is no `photos` table.** Papic captures live in TWO tables (`papic_photos` = seats · `papic_guest_captures` = disposable cameras). Re-anchor the message to a **polymorphic `(source_table, source_id)`** (or a shared `wall_feed.feed_id`) so a disposable-camera frame — the cohort most likely to write a Kwento — can also carry a caption. See the Salamisim § "Data model" for the canonical polymorphic shape.

One new table, `photo_messages`. Dedicated — **not** `photos.caption` (per-message RA 10173 erasure must be clean; `photos` has no author FK) and **not** an overload of `photo_tags.source` (a tag = who is *in* a photo; a message = authored content).

**Honest reuse statement (corrected):** `photo_messages` **does not mirror `video_guestbook_entries` column-for-column.** Verified: `video_guestbook_entries` (`Database_Schema_Master.sql:1580-1595`) has only `status` + `r2_purged_at` + the `reviewed_*`/`user_deleted_at` erasure columns and a `duration_sec 1–60` cap. It carries **no** `moderation_state`, `moderation_labels`, `wall_eligible`, `hide_from_wall`, or `consent_captured_at`. Those are **net-new** here. `photo_messages` **shares the erasure/status vocabulary** (`status` enum + `submitted_at`/`reviewed_by_*`/`user_deleted_at`/a purge-audit column) and **adds a moderation/wall layer the guestbook lacks.** The couple-review queue is therefore a **query-layer UNION that tolerates NULL `moderation_state` on guestbook rows** — not a free "one schema, no forking" reuse. Text moderation is first-class net-new infra, budgeted as such below.

**Reconciliation (surface to owner):** `photo_messages` (photo-anchored, text) and `video_guestbook_entries` (standalone, video, already shipped couple-side per `0031:6`) **coexist; they do not merge** (merging would force a 60s-video-vs-text cap reconciliation and touch a shipped surface). This is a third guestbook-adjacent construct alongside (a) the 2026-05-09 Wedding-Challenges guestbook lock (`DECISION_LOG.md:50`) and (b) the shipped 0031 table — owner must bless `photo_messages` as the canonical photo-anchored primitive (see Owner sign-offs).

```sql
-- 0012 extension: photo-anchored guest messages ("Kwento sa Mag-asawa"). TEXT-ONLY in V1.
-- kind enum reserves room for voice/video (owner decision). Shares status/erasure vocab with
-- video_guestbook_entries; ADDS a net-new moderation/wall layer that table does not have.
CREATE TABLE photo_messages (
  message_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id          UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,  -- Pattern B scope key
  photo_id          UUID NOT NULL REFERENCES photos(photo_id) ON DELETE CASCADE,  -- the photo this story is about
  guest_id          UUID NOT NULL REFERENCES guests(guest_id) ON DELETE CASCADE,  -- DURABLE author; walk-ins mint S89G too

  kind              TEXT NOT NULL DEFAULT 'text' CHECK (kind IN ('text')),        -- voice/video DEFERRED

  body_text         TEXT NOT NULL CHECK (char_length(body_text) BETWEEN 1 AND 280),
  prompt_text       TEXT,                                                          -- snapshot of the prompt answered

  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','approved','rejected','user_deleted')),
  moderation_state  TEXT NOT NULL DEFAULT 'unscreened'
                    CHECK (moderation_state IN ('unscreened','clean','flagged','blocked')),
  moderation_labels JSONB,                                                         -- {profanity,abuse,pii}; PII redacted before any Tier-2 send
  wall_eligible     BOOLEAN NOT NULL DEFAULT FALSE,
  hide_from_wall    BOOLEAN NOT NULL DEFAULT FALSE,                                -- real-time kill switch (couple/coordinator)
  author_publicly_hidden BOOLEAN NOT NULL DEFAULT FALSE,                           -- TRUE if author FaceBlocked → whole msg suppressed publicly
  baked_into_render BOOLEAN NOT NULL DEFAULT FALSE,                                -- TRUE once compiled into a FINAL render → edits locked

  consent_captured_at  TIMESTAMPTZ NOT NULL,                                       -- RA 10173: mandatory at insert (no escape hatch)
  submitted_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  edited_at            TIMESTAMPTZ,                                                -- last edit; any edit resets moderation (§ Edit)
  edit_count           INT NOT NULL DEFAULT 0 CHECK (edit_count <= 3),
  reviewed_by_couple_at TIMESTAMPTZ,
  reviewed_by_user_id   UUID REFERENCES users(user_id),
  user_deleted_at      TIMESTAMPTZ,                                               -- 24h self-withdraw + RA 10173 erasure
  hard_deleted_at      TIMESTAMPTZ,                                               -- purge-audit (proves the RA 10173 "within N days" SLA)
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- one message per (guest, photo) keeps it a caption, not a comment thread
  CONSTRAINT uq_photo_messages_author UNIQUE (photo_id, guest_id),

  -- DB-LEVEL surface guards: the "cannot disable NSFW" rule must survive a buggy code path.
  CONSTRAINT wall_needs_clean     CHECK (wall_eligible = FALSE OR moderation_state = 'clean'),
  CONSTRAINT approved_needs_screen CHECK (status <> 'approved' OR moderation_state IN ('clean','flagged'))
);
```

### RLS — Pattern B; guest reads via one audited RPC; guest writes via service_role

> **⚠ Correction (2026-06-11, verified vs shipped origin/main):** the statement below that `coordinator` is NOT an `event_members.member_type` is **stale corpus drift.** The shipped `public.member_type` ENUM is `('couple','guest','vendor','coordinator')` — so **`coordinator` IS a real member type.** The `thread_join_authorizations` table referenced in this section is **unnecessary and was NOT built** (Salamisim P0, migration `20261104000959`); coordinator moderation authority is simply **`member_type IN ('couple','coordinator')`**.

The load-bearing identity fact: **zero-account guests carry a custom `setnayan_guest_session` JWT, not a Supabase `auth.uid()` row.** So `current_event_ids()` (keyed on `auth.uid()`, `RLS_Policy_Pattern.md:362`) returns nothing for them, and **RLS cannot protect the guest read path at all.**

> **✅ Verified against shipped code (`origin/main`, 2026-06-10).** Confirmed true: `apps/web/lib/guest-session.ts` issues the custom `setnayan_guest_session` JWT (`{guest_id, event_id, qr_token}`, no `auth.uid()`); guest data is read/written through a **service-role admin client with app-level scoping** (`lib/papic-guest.ts`, `lib/supabase/admin.ts` — *"bypasses RLS… perform application-level authorization inside the calling code"*), and the shipped `guest_face_enrollments` migration documents it verbatim: *"writes still flow through the admin-client server actions, so no guest write policy is defined."* **So this service-role + audited-RPC design MATCHES shipped reality — it is consistency-hardening, not a bug fix.** ⚠ The earlier alarm that shipped policies `guests_read_own`/`face_enrollments_select` were broken is a **FALSE POSITIVE from a drifted corpus doc** — those names exist only in `02_Specifications/Database_Schema_Master.sql`; the real shipped policies are `guest_reads_own_row` / `guest_reads_own_face_enrollment` (`TO authenticated`, intentionally for the logged-in-account reader, **not** broken). Live migrations — not the schema-master — are ground truth.

Two corrections follow:

1. **All guest-facing reads go through ONE `SECURITY DEFINER` RPC** (`guest_visible_messages`) that hard-codes the visibility filter in a single audited place — never scattered hand-filters in N server actions. A guest can never receive a `pending`/`flagged`/`rejected`/`user_deleted` row, nor a message whose parent photo is FaceBlock-/consent-hidden for that viewer, nor a FaceBlocked author's message on a public surface.
2. **Guest writes/edits/withdraws** go through a JWT-gated service-role action; there is **no client-direct guest INSERT/UPDATE policy** (the shipped `face_enrollments` precedent, `0012_papic_migration.sql:349`). Do **not** invent a `current_guest_id()` helper.

```sql
-- READ (couple + admin see ALL; auth.uid()-bearing members see APPROVED only).
-- NOTE: 'coordinator' is NOT an event_members.member_type (CHECK is 'couple','guest','vendor',
-- Database_Schema_Master.sql:180). Coordinator authority comes from thread_join_authorizations on a
-- coordinator-class thread (the 0031:187/385/425 model), so it is added as an explicit EXISTS branch.
CREATE POLICY photo_messages_read ON photo_messages FOR SELECT USING (
  is_admin()
  OR ( event_id IN (SELECT current_event_ids())
       AND ( status = 'approved'
          OR EXISTS (SELECT 1 FROM event_members m
                     WHERE m.event_id = photo_messages.event_id
                       AND m.user_id = auth.uid()
                       AND m.member_type = 'couple') ) )
);

-- MODERATE (couple + admin always; coordinator via the real authorization mechanism, read+act,
-- never mode-override — couple-default per 0031:425).
CREATE POLICY photo_messages_couple_moderate ON photo_messages FOR UPDATE USING (
  is_admin()
  OR EXISTS (SELECT 1 FROM event_members m
             WHERE m.event_id = photo_messages.event_id
               AND m.user_id = auth.uid() AND m.member_type = 'couple')
  OR EXISTS (SELECT 1 FROM thread_join_authorizations a            -- coordinator-class authorization
             JOIN chat_threads t ON t.thread_id = a.thread_id
             WHERE t.event_id = photo_messages.event_id
               AND a.user_id = auth.uid() AND a.role = 'coordinator'
               AND a.revoked_at IS NULL)
) WITH CHECK ( event_id IN (SELECT current_event_ids()) OR is_admin() );

-- guest_visible_messages(p_event_id, p_guest_id, p_mode) SECURITY DEFINER:
--   p_mode='public'  → status='approved' AND author_publicly_hidden=FALSE
--                      AND parent photo visible to p_guest (FaceBlock + photo_consent multi-view join)
--   p_mode='mine'    → guest_id = p_guest_id (the author's own kwento, any status)
-- NOTHING else is ever returned. This is the single audited choke point for every guest surface,
-- the Live Wall feed, the landing-page playback, and the produced-video compile pool.
-- NO client-direct guest INSERT/UPDATE policy — authoring/edit/withdraw run through the JWT-gated
-- service-role action (validates setnayan_guest_session → resolves guest_id → caps → text gate → write).
```

`is_admin()` + `current_event_ids()` are already shipped (`RLS_Policy_Pattern.md:5`). RLS-map entry to add: `photo_messages = Pattern B; member reads = approved-only; guest reads via SECURITY DEFINER guest_visible_messages(); guest writes via service_role` (mirrors `guest_video_guestbook_entries`, `RLS_Policy_Pattern.md:505`).

### Backend logic

**Who may write (eligibility — surfaced with recommendation).** A message is **authored content, not an upload** — it consumes zero capture credits and never touches the retired **All-Guest Unlock** *upload* tier (`0012:192`). Precedent: anonymous-QR-session guests already author UGC free via the video guestbook (`0031:386`).

| Actor | May write text? |
|---|---|
| **Receiver** (free, zero-account, no SKU) | ✅ **YES (recommended)** — the participation engine that feeds the moat |
| **Papic Guest** (paid disposable cam) | ✅ |
| **Paparazzi** (seat) | ✅ |
| **Couple / coordinator** | ✅ + moderation authority |

**Anti-flood (concurrency-safe, DB-enforced — not a denormalized counter):** soft cap **10 messages / event / guest** (configurable) enforced by a `SELECT count(*) … FOR UPDATE`-guarded check **inside the insert transaction** (a denormalized `guests.message_count` would race on concurrent submits and drift on `ON DELETE CASCADE` — rejected). **Rejected/blocked messages count toward the cap** so rejection actually throttles a bad actor. Burst limit: **max 3 messages / 60s**. `UNIQUE(photo_id, guest_id)` caps a guest at one message per photo. N blocked attempts → auto-escalate the guest to the admin queue.

**Text NSFW / profanity moderation — NET-NEW infra (flag to owner).** Today's NSFW filter is **image-only** (`0012:992`); zero text moderation exists in the corpus. The un-disableable rule now extends to text:
- **Tier 1 (synchronous, blocking, ~₱0):** EN + Tagalog + **Cebuano/Bisaya** profanity/slur lexicon + PH PII/doxxing regex (phone/email/address). `clean` → proceeds; `flagged` → pending+badged, wall-ineligible; `blocked` → rejected inline at the editor.
- **Tier 2 (asynchronous, multilingual classifier):** runs **after** the send so the guest never waits on an external call; it can only **downgrade clean→flagged**, never block. **Data-residency rule:** Tier-1-detected PII is **redacted before any external classification call** (raw phone/email/address never leave the platform); the call is **classification-only, no-retention, never a system of record** (consistent with the first-party-data + OSS-self-host locks). If a self-hosted/regional classifier is available, prefer it to avoid cross-border transfer entirely. **Outage fallback:** Tier-2 unavailable → leave at `flagged` (never auto-public). A held message shows the guest *"held for the couple to review"* — never silent failure; the only appeal is the couple's **Approve anyway**.

### Multi-view visibility — inherits the parent photo, never its own logic

A message inherits the visibility of its parent photo (`0012:992`). Resolved live by the Multi-View Engine, encapsulated in the `guest_visible_messages` RPC:

1. **Couple / host:** sees everything — every message, full attribution, all statuses (`0012:992`).
2. **Other guests (public):** see a message only if `status='approved'` **AND** the parent photo is visible to that viewer. If the parent photo is FaceBlock- or `photo_consent`-hidden for that viewer, the attached message is **hidden too** (a caption can't leak a blurred guest's identity).
3. **FaceBlocked author = whole-message public suppression (corrected).** Name-hiding alone is **not** enough — a self-describing body ("as the maid of honor…") + the photo anchor re-identifies a blurred author. So if the author has `faceblock_enabled=TRUE`, the entire message is **suppressed on public surfaces** (`author_publicly_hidden=TRUE`); the couple always sees it in full. The author may optionally opt back into public display at write-time (default = hidden). The Live Wall is the strictest enforcement point.

### 7-day review — two distinct paths

| Surface | Review path |
|---|---|
| **Couple gallery / RECAP landing** | Couple sees immediately; **public** unlock waits for approval OR the configurable 0–14d window lapse (`0012:746`). On lapse: **clean publishes with its photo; flagged stays hidden until explicit couple approval** (stated on the countdown banner). Reuses the existing photo review window + bulk hide/unhide. |
| **Live Wall (LIVE mode)** | Live override of the 7-day window (`0012:1008`), but **never auto-publishes**. **Owner-locked 2026-06-10:** a message reaches the projector **only** on an explicit **couple/coordinator one-tap approve-to-wall** — no auto-publish on filter-clean, no hold-and-display delay. The `wall_eligible ⇒ moderation_state='clean'` DB check still applies underneath (a flagged/blocked message can't be approved to the wall even by mistap), and `flagged` is **never** wall-eligible. A real-time `hide_from_wall` kill switch remains for both couple and coordinator. |

### Edit / delete / erasure (RA 10173) — bait-and-switch closed

- **Edit (author, within 24h, max 3):** **any** edit **resets** the row to `status='pending'`, `moderation_state='unscreened'`, `wall_eligible=FALSE`, `reviewed_by_couple_at=NULL`, pulls it from the Live Wall **and** the compile pool, and re-runs the gate. An already-approved message that is edited drops off public surfaces until re-approved. An audit trail ("changed after you saw it") is shown to the couple. **Once `baked_into_render=TRUE`, edits are locked** (the produced artifact is immutable).
- **Self-withdraw (24h):** sets `user_deleted_at` → hidden immediately → purged within 24h.
- **Couple reject:** `status='rejected'` → purged within 7 days. **Reject-for-abuse** retains the body + author `guest_id` in an admin-only evidence store beyond the normal purge (lawful basis: protection of rights/safety) so an abuser can't launder evidence by self-deleting.
- **Hard erasure / face-data revocation:** `guest_id ON DELETE CASCADE` cascades the message — RA 10173 erasure for free; one guest's erasure never touches another guest's message on the same photo (single-author rows, `0012:607`). `hard_deleted_at` records the purge so the "within N days" SLA is auditable.
- **Rendered-output erasure (corrected):** approved messages are baked **only into FINAL renders produced after approval** (so any erasure before finalization never reaches a render). If a message is erased/rejected **after** it was compiled into a delivered render, that render is **invalidated and re-queued** (re-render-and-replace) — an erased message must never remain visible in a delivered MP4.
- **Export-my-data ZIP** must include the guest's `photo_messages` (extends `0031:285`). Retention rides the event media lifecycle (R2 hot 90d → cold → 5-yr purge, `0012:39`), with the faster RA 10173 paths taking precedence downward.

### Abuse controls — block lever + admin escalation (net-new; nothing exists today)

Verified: the corpus has **no** guest block/ban primitive (only a photo-report → couple queue at `0031:119`). The couple must not be the sole moderator of a harassment stream:
- **Per-(event, guest) block:** couple/coordinator action `Block this guest from messaging` → a `guest_message_blocks` row → the write action refuses further INSERTs from that `guest_id` and hides their existing messages. Admin (0023) override available.
- **Admin escalation queue (0023):** a guest whose messages are rejected N times, OR whose message trips Tier-2 abuse, surfaces to Setnayan admin for review/ban — not just to the couple.
- **Report-this-message** guest-facing action, distinct from photo-report.

### Integration — the sentiment-as-fuel path

| Surface | Integration | Cost |
|---|---|---|
| **Couple gallery** (no output-phase dependency) | "💌 Kwento" filter + message child under each photo card + reuse the 7-day queue (query-layer UNION) + bulk moderate | near-zero gallery/queue reuse; **moderation layer is net-new.** **Ships first.** |
| **Live Wall** (Phase 1) | `wall_eligible` lower-third overlays the projected frame; couple/coordinator `hide_from_wall`; FaceBlocked author suppressed | low + the net-new wall-grade text gate. Earliest in-venue "wow." |
| **SDE** (Phase 2 — moat) | `has_approved_message` = deterministic curation **ranking boost** (`0012:1024`); message text → on-screen **title card / lower-third**; baked only post-approval | low — one template text-slot. **The moat.** |
| **Thank-You Video** (Phase 4) | Same as SDE; loosest deadline; delivered email-only via 0028 | low |
| **Guest Stories** (Phase 3 = productized Personal Reels) | The author's own message becomes their 9:16 story's caption/title card on owned music (`0012:1031`) | low |
| **Personal landing (RECAP/EDITORIAL)** | Approved messages play back under photos, sorted `submitted_at ASC`, named-vs-"A guest" stack, "see all" beyond N, empty-state when a visible photo has no messages; **a message is never shown if its parent photo is hidden to the viewer** (couple-hidden photo suppresses its approved messages publicly too) | near-zero |

**0031 reconciliation:** `photo_messages` (photo-anchored) and `video_guestbook_entries` (standalone) coexist and share one couple-review queue at the query layer; no table merge. The day-of `video guestbook` card (`0031:121`) gains a "Tell their story" entry that opens the photo-anchored author sheet.

### Emotional framing — "Kwento"

Branded **"Kwento"** (Tagalog: *story/tale*), EN-primary + natural Taglish warmth. **Ask at the moment of viewing** (the prompt meets the guest in their own "Photos of you" feed, the #1 participation lever); **use names, never "the couple"**; photo-anchored prompts extend `event_guestbook_prompts` with `context='photo_anchored'` ("Ano'ng nangyari sa litratong ito?" · "What were you feeling here?" · "Best advice for year one."); CTA **"Send to the couple 💌"**; confirmation **"Naipadala na! 💛"**; live "43 kwento na" social-proof counter (reuse `0031:136`); MC/DJ verbal nudge in the couple playbook + T+1–2d Resend email nudge (email-only).

### Notifications (email-only, Resend — flags a 0028 scope touch)

- **Guest:** "your message is live" (on approval) · "the couple is reviewing your note" (on flag). A held message must not be silent.
- **Couple:** batched **digest** when messages land (not per-message).
- These extend **0028's fixed 10-template V1 list** — adding message emails is a cross-iteration scope item to surface to the owner.

### Pricing recommendation

**FREE, text-only, for all guests including Receivers.** Text messages are near-zero marginal cost and are the **participation fuel** for the paid output layer; charging would starve the moat. Monetize the *produced video* the messages narrate — **SDE · Thank-You · Guest Stories** (peso figures carry the corpus-wide pricing-drift warning; don't hardcode them). PHP-centavo, **no new SKU.** Consistent with the "free to plan" positioning; a top-of-funnel warmth driver.

### Phased build order (Claude Code time — never human-engineer months)

> Per the timeline-units rule: Claude Code working spans + calendar-bound externals only.

**Prereqs (~0.5 day):** the migration — `photo_messages` + RLS + the `guest_message_blocks` table + `guests.faceblock_enabled` (verified absent today — must land first; the multi-view rule has nothing to read without it) + `event_guestbook_prompts.context`. Apply via `supabase db push --db-url "$SUPABASE_DB_URL"` from a clean worktree (migrations don't auto-apply on main).

| Phase | Scope | Depends on | Claude Code time |
|---|---|---|---|
| **P0 — Schema + write-path + moderation** | Migration; `moderateText()` Tier-1 lexicon (EN+TL+CEB) + PII regex + async Tier-2 (PII-redacted, no-retention); JWT-gated service-role write (validate session → resolve guest_id → atomic cap/burst → gate → write); `guest_visible_messages` SECURITY DEFINER RPC; block lever | prereqs | **~1.5–2 days** (text moderation + the audited read RPC are the net-new cost) |
| **P1 — Guest author surface** | Inline expand-in-place sheet; rotating photo-anchored prompts; mandatory consent line; 24h edit/withdraw with moderation reset; social-proof counter; Resend nudge; **accessibility pass** | P0 | **~1–1.5 days** |
| **P2 — Couple gallery + moderation** | "💌 Kwento" filter; message child; query-layer UNION queue + bulk moderate + flagged badge / "Approve anyway"; block-this-guest; digest email | P0 | **~1–1.5 days** (rides the built gallery; queue UNION is real refactor, not free) — **ships before any output phase** |
| **P3 — Live Wall caption overlay** | `wall_eligible` lower-third; couple/coordinator `hide_from_wall`; FaceBlocked-author suppression; wall-grade Tier-2 gate / hold-delay | P0 + the wall (Phase 1) | **~0.5–1 day** |
| **P4 — SDE / Thank-You title-card + curation boost + re-render-on-erase** | `has_approved_message` ranking signal; `message_slot` text title card; bake-only-after-approval + invalidate-on-erase | P0 + SDE/Thank-You backbone | **~1 day** atop those phases |
| **P5 — Guest Stories caption** | Author's own message → caption slot in the Personal Reels builder | P0 + Phase 3 (Guest Stories) | **~0.5 day** atop that phase |

**Total net-new: ~5.5–7.5 days Claude Code time**, of which P0–P2 (~3.5–5 days) deliver the complete couple-facing loop independent of the output layer. **Calendar-bound externals:** none unique beyond existing Resend + R2. Voice/video (deferred) would add a transcription→text-moderation step + frame-NSFW + multilingual ASR — out of V1 pending owner sign-off.

### Acceptance criteria

- [ ] A zero-account guest (no `auth.uid()`) can author a message on a photo they're tagged in, with mandatory consent captured at insert; Send is blocked until consent is ticked.
- [ ] The couple sees every message immediately at full attribution (master view); `pending` gates only public visibility.
- [ ] **A guest session can never retrieve another guest's `pending`/`flagged`/`rejected` message, nor a message on a photo blurred/consent-hidden for that viewer, nor a FaceBlocked author's message** (integration test against `guest_visible_messages`).
- [ ] No row can be `wall_eligible=TRUE` unless `moderation_state='clean'`, and none can be `status='approved'` while `unscreened`/`blocked` (DB CHECKs).
- [ ] Editing an approved message resets it to pending/unscreened and removes it from the wall + compile pool until re-approved; edits are locked once `baked_into_render`.
- [ ] A blocked guest cannot author further messages; their existing messages are hidden; admin can override.
- [ ] Tier-1 blocks hard slurs/PII inline; Tier-2 runs async, PII-redacted, and only downgrades clean→flagged; the guest never waits on the external call and is never silently failed.
- [ ] Live Wall **never auto-publishes**: a message reaches the projector only via an explicit couple/coordinator one-tap approve-to-wall (owner-locked 2026-06-10); coordinator (via `thread_join_authorizations`) and couple can both flip `hide_from_wall` in real time.
- [ ] RA 10173: guest export ZIP includes their messages; erasure cascades and is auditable via `hard_deleted_at`; an erased message baked into a delivered render triggers re-render-and-replace.
- [ ] An approved message renders as a real-text title card in SDE/Thank-You over owned music.

### What it does NOT do in V1

- **No voice or video messages** (text-only; the `kind` enum reserves room — owner decision).
- **No per-photo narrative/chaptered story builder** (one 280-char caption per guest-photo; the aggregate is the "story"). V1.1.
- **No public comment threads** (`UNIQUE(photo_id, guest_id)` — a caption, not a conversation; no replies between guests).
- **No re-opening of All-Guest Unlock** (messages are authored content, not uploads; capped + free).
- **No SMS** anywhere; email-only via Resend.
- **No self-hosted-classifier requirement** if unavailable — but Tier-2 PII redaction + no-retention is mandatory regardless.

---

## Phase 1 — Live Photo Wall ("Salamisim") · in-venue real-time collage

> **Implements the locked Phase-1 build bullets (`0012:999-1011`) + the Kwento one-tap-approve lock (`0012:1075,1319`).** This section EXPANDS those bullets into the full design. Most of it is a read-layer over what already ships; the genuinely net-new build is the server-side FaceBlock derivative pipeline, the trilingual text gate, and **one durable public feed table + one audited reader RPC** that solve a problem the corpus hand-waved (`0012:1006` "push from papic_photos via polling or lightweight realtime"). Verified against shipped `origin/main` @ `825ab6e`.
>
> **The architecture fork that drives this whole design (verified, load-bearing):** Supabase Realtime *honors RLS* — "clients only receive change events for rows they're authorized to SELECT" (`supabase/migrations/20260514140000_enable_realtime_chat.sql:11-13`). The capture tables are **couple-only** RLS (`papic_photos`, `20260520015000:107-127`; `papic_guest_captures` couple-read + admin-all, `20260718000000:91-117`). The venue projection is **anonymous** — a zero-account screen carrying a `jose`-signed `setnayan_guest_session` JWT (`lib/guest-session.ts:1-44`), which Supabase Realtime cannot parse, served by the service-role admin client that bypasses RLS at the app layer (`lib/supabase/admin.ts:1-12`, the exact pattern `lib/papic-guest.ts:99-103` already uses). The only shipped Realtime consumer (`app/_components/chat-message-stream.tsx:26,65,117,152`) runs **authenticated**. **Therefore an anon projection client cannot subscribe to `postgres_changes` on the capture tables, and must not be granted a direct `TO anon` SELECT on any feed table** (that would let any client subscribe to any event's wall by guessing the id, and broadcast a mis-gated row to the open internet). The wall is fed by **server-authorized Realtime Broadcast + a service-role RPC backfill**, never a direct anon table read.

> **✅ P0 + P1 SHIPPED 2026-06-11** (PRs #1228 schema · #1253 feed+projection, both merged; migrations `20261104000959` + `20261112000545` applied to prod). Live now, dark-launched: `wall_ingest` gate chain (LIVE_WALL → photos-only → **NSFW allowlist via the shipped self-hosted nsfwjs screen** → **FaceBlock fail-closed withhold** → consent veto) · the audited `wall_visible_photos` reader · the `wall_retract`/`wall_unhide` kill switch (wall-only vs also-gallery) · single-use screen codes · the anonymous `/wall/[event-id]` projection (claim → masonry + live count + gold-ring tiles + 12s/60s reconcile + freeze-on-drop + wake-lock + teaser modes) · the couple control card on the Papic add-on page · ingest chained after the NSFW screen on BOTH capture paths. **Prod ACLs verified: feed RPCs service-role-only.** P2 (server-baked blur derivatives) = the public-event ship gate; P3 (full control tab + Kwento lower-thirds) + P4 (SW cache + recap freeze) follow.

> **✅ P2 SHIPPED 2026-06-12 (PR #1273, migration `20261115000604` applied + prod-smoked) — THE FACEBLOCK SHIP GATE IS NOW LIVE.** The blanket P1 withhold is replaced by a per-row BAKED requirement. What landed, and where it amends the design below: **(1) Blur-ALL-faces, not match-and-blur-selectively** — `guest_face_enrollments.face_vector` is still NULL (no enroller, no embedding model validated), so the shipped P2 slice blurs EVERY detected face on a FaceBlock event. Over-blur is the conservative superset of the designed per-guest matching (which remains the P2b upgrade path); "withhold-when-uncertain" is interpreted at the PIPELINE level — any bake error (model, R2, decode, upload, RPC) writes no markers and the row stays withheld. **(2) Detector = self-hosted MediaPipe full-range** (tfjs graph model, CPU backend, ~1.2 MB committed weights, the nsfw-screen fs-IOHandler pattern — the "provider choice" calendar item is RESOLVED the same way the NSFW one was). **(3) Recall engineering:** the 192×192 detector input loses distant reception faces (2/6 single-pass on the test fixture) → a TILED sweep (full frame + 4 overlapping 62% quadrants, IoU-deduped) recovers 5/5 frontal; boxes expand 1.6× before Gaussian blur is baked INTO a fresh ≤1600px JPEG derivative (never CSS, never the original object). Honest residual: extreme profiles/occlusions can still be missed — mitigations are the tiled sweep, box expansion, the `wall_retract` kill switch, and the couple-moderated surface; the accepted flip side is an occasional blurred candlestick (false positives are fail-SAFE). **(4) Schema:** `faceblock_baked_at` + `faceblock_faces_found` provenance on both capture tables; service-role-only `wall_record_bake`; `wall_ingest` v2 (FaceBlock event ⇒ require a baked derivative); `wall_visible_photos` v2 (per-row baked check at READ time — a guest flipping FaceBlock ON mid-event hides every un-baked tile on the next read with no cascade, fail-closed by construction). **(5) Surfaces:** both capture `after()` chains run screen → bake → ingest; the couple's guest-detail page gains the "Face privacy · Blur faces on the Live Wall" toggle (beside Photo consent — a day-of request is one checkbox), whose ON fires a bounded newest-25 re-bake sweep so the wall recovers blurred instead of staying dark. 11/11 tests (real detection on committed fixtures; face-crop texture stdev 68.5→20.9 post-bake). **The detection-on-original-resolution clause below is amended:** detection runs on the EXIF-normalized ≤1600px derivative (the wall's own display cap) with tiling carrying small-face recall — original-res tiling at typical 12–48 MP capture sizes would cost 10–30× the CPU for faces the projection cannot resolve anyway.
>
> **Owner sign-offs (locked 2026-06-11):** ✅ **full robust build** (~8–11 CC-days — NOT the thin polling demo: the complete server-baked FaceBlock + server-authorized broadcast/backfill feed, real-guest-safe) · ✅ **venue projection default = all-with-consent** (the whole room's cleared photos; distinct from the 0031 phone-card `tagged_only` default; every frame still FaceBlock/NSFW/consent-gated). Standing (not overridden): the FaceBlock ship-gate, the name 'Salamisim' (confirm/replace), and price read at runtime.

> **✅ P0 schema SHIPPED 2026-06-11 (migration `20261104000959`, PR #1228, applied to prod).** Built against the real shipped schema — **three corrections supersede the design below:** (1) **`coordinator` IS a real `public.member_type` enum value** (`'couple','guest','vendor','coordinator'`) — so **`thread_join_authorizations` was NOT created**; every reference to it below is superseded by wall-control authority = **`member_type IN ('couple','coordinator')`** directly. (2) **`events` had no `timezone` column** → added (PH default) for the server-side day-of mode. (3) Shipped tables use a hidden `id BIGSERIAL` PK + a UUID business key (FKs target the UUID); the enrollment table is **`guest_face_enrollments`** with a **`face_vector`** JSONB column (not the spec's `face_enrollments`/`vector_blob`). Net-new objects that DID land: `wall_feed` · `photo_tags` (polymorphic) · `wall_display_sessions` · the wall-state/moderation columns · `guests.faceblock_enabled` · the day-of columns · `wall_feed`→realtime publication. RPCs + `/wall` route + control surface remain P1.

### What it is

A full-screen, no-chrome collage at `/wall/[event-id]` projected on whatever screen the venue has, that fills in real time as paparazzi (`papic_photos`) and paid disposable-camera guests (`papic_guest_captures`) shoot. A hero live count, a "shooting now" presence pill, one-tap-approved Kwento lower-thirds, and a persistent claim-your-camera QR make it the in-venue centerpiece AND the social engine that recruits the next paid `PAPIC_GUEST` camera. It is the cheapest, highest-impact "wow" and the proof of the live pipeline the SDE (Phase 2) consumes (`0012:1062`).

### Two distinct surfaces — never conflate

| Surface | Who | Where | Behavior |
|---|---|---|---|
| **Venue projection** | the room | `/wall/[event-id]` big screen | Global, passive, lean-back. All consent-cleared photos, live count, presence, Kwento lower-thirds, join-QR. No controls. |
| **Phone card** | each guest | 0031 day-of "live-photo-wall" card | Personal, interactive. Defaults to "Photos of me"; save-to-reel / hide-me / report. "All photos" toggle gated on `live_photo_wall_visibility`. **The shipped card (`app/dashboard/[eventId]/_components/day-of-mode/live-photo-wall-card.tsx`) is a coming-soon STUB** in the COUPLE dashboard — the rich guest-facing card (`0031:106-124`) is unbuilt. This phase ships projection-first; the phone card is a separate, budgeted line item (see Build order). |

### Venue / user flow — zero hardware, zero install (~60s)

No cast/pairing infra exists to reuse; Panood's precedent is a browser at a URL with no install (`0011_panood.md:38,40`). UX north star: the venue AV person already knows how to open a browser.

1. Couple/coordinator buys "Live Venue Photo Wall" → a `LIVE_WALL` row lands in `event_software_activations_v2` (reuse the shipped gate, `app/[slug]/_components/editorial/data.ts:550-553`). **Never hardcode the price** (catalog vs corpus drift, `0012:1066`).
2. From the couple's Photo-Wall control tab → **"Open wall on a screen"** → a sheet shows a **QR + short URL** (`setnayan.com/wall/S89E-…`) + a **rotating 6-char Crockford display code**.
3. Venue staff opens the URL on any screen (smart-TV browser, laptop+HDMI, mini-PC, tablet→TV, LED controller), enters the code once → the route mints a short-TTL **`wall_display_session`** JWT (modeled on `signGuestSession`, `lib/guest-session.ts:19-25`), requests **`navigator.wakeLock`** (best-effort; see below), and renders 16:9 full-bleed.

The code+QR (not native cast) is deliberate: it lights *any* screen including camera-less smart-TVs (typed code), and is the cheapest "wow." Rate-limit code entry and expire the code after first claim so a guest can't replay it onto a private projection; the control tab can **revoke** a screen ("projecting on N screens" → tap → revoke). `wakeLock` is **best-effort, not guaranteed** — re-request on every `visibilitychange→visible`, add a 1px-looping-muted-video keep-awake fallback for TV browsers that lack the API, and the "Open on a screen" sheet shows a one-line "disable display sleep in the TV's settings" hint.

### Projected-wall UX — `/wall/[event-id]` (16:9, lean-back, zero chrome)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ⟡ SETNAYAN   Patricia & Miguel · #PatMig2026    ● LIVE   847   🟢        │ ← top strip: monogram (Animated
│                                                  ●● 9 shooting now          │   Monogram if owned), names, LIVE,
│   ┌──────┐ ┌────────────┐ ┌──────┐ ┌────────┐  ┌──────────┐               │   live COUNT (animated tick-up),
│   │ tile │ │    tile     │ │ tile │ │  tile  │  │   tile   │               │   presence pill, connection dot.
│   └──────┘ │             │ └──────┘ └────────┘  └──────────┘               │
│   ┌────────┐└────────────┘ ┌──────┐ 🌫(blurred FaceBlock derivative tile)  │ ← CSS-columns masonry (reuse recap
│   │ ✦ NEW  │ ┌─────┐ ┌─────┴────┐ │tile│        ┌──────────┐               │   break-inside styling). Newest tile
│   │  tile  │ │tile │ │   tile   │ └────┘        │   tile   │               │   fades+scales in with a 2s gold
│   └────────┘ └─────┘ └──────────┘               └──────────┘               │   "✦ bagong kuha" ring, then reflows.
│                                                                            │
│  ┌──────────────────────────────────────────────────┐  ┌───────┐          │
│  │ ❝ Ang ganda ng entrance! Congrats best friend ❞    │  │ ▓ QR ▓│          │ ← Kwento lower-third (ONLY on one-tap
│  │   — Tita Baby (Table 4)                            │  │ join  │          │   approve), over a solid scrim, holds ~8s.
│  └──────────────────────────────────────────────────┘  └───────┘          │
│  ⟡ Powered by Setnayan · Papic           📲 Scan to get your camera        │ ← persistent join-QR = the growth loop
└──────────────────────────────────────────────────────────────────────────┘
```

**Behavior rules.** New tiles prepend with the gold ring, then the wall gently reflows; debounce arrivals into ~800ms batches so a flood reads as elegant motion (breathing, never strobing). Cap ~36–48 on-screen tiles; older recede off-canvas (still in the pool); a ~20s back-catalog rotation re-seeds older tiles so the 2pm lola still gets airtime at 9pm across a 6–8h Filipino reception. The **live count is the hero metric** (animated tick-up, `toLocaleString('en-PH')` per `editorial-content.tsx:618`) and counts **only cleared captures** (= `wall_feed` rows) so the room never sees that something was filtered, and the number always matches what's on screen. **Presence** ("9 shooting now") uses the shipped Realtime presence `.track()` (`chat-message-stream.tsx:184-234`) on a **shooter-role** channel; the projection/control screens track a **distinct display-role** channel so passive screens never inflate "shooting now." Milestone bursts (round numbers) overlay ~4s. **Clips** (`photo_type='clip'`; guest captures are photo-only by schema) are **excluded from the live wall in Phase 1** (collage of photos; muted-autoplay poster tiles are Phase-1.5, capped ≤2 concurrent for low-spec venue browsers).

**Projection legibility (10–30ft viewing).** 1080p baseline; all chrome text ≥ ~28–32px-equivalent; a **TV-safe inner margin (5% all sides)** so the QR / join-bar / count never land in overscan; a **solid scrim behind the Kwento lower-third** (never text-over-photo) for guaranteed contrast; the **6-char display code printed beside the QR** as the cross-room fallback (a phone-screen QR won't scan from 20ft).

### Couple / coordinator control UX

```
┌─ PHOTO WALL ──────────────────────── ● LIVE · projecting on 1 screen ──────┐
│  [ ⏸ Pause wall ]   [ Open on a screen ▢QR ]   [ what guests see ↗ ]        │
│  847 on the wall · 9 shooting · 23 cameras claimed · 5 Kwento pending       │
│  Guest "All photos" view:  ( ) Tagged-only [default]  (•) All (consent)  ( ) Off │ ← writes events.live_photo_wall_visibility
├─────────────────────────────────────────────────────────────────────────────│
│  KWENTO — waiting for your OK to show on the wall (5)                        │
│  ┌─ [thumb] ❝ Ang ganda ng entrance! ❞ — Tita Baby  ✓clean [✓ Show on wall][Skip] │
│  ├─ [thumb] ⚠ "[hidden — flagged]" — Anonymous   (approve ✗)        [Dismiss]│ ← approve disabled; DB CHECK backstops a mistap
├─────────────────────────────────────────────────────────────────────────────│
│  ON THE WALL NOW — newest first                                             │
│  [▣][▣][🌫][▣][▣]   🌫=auto-blurred (FaceBlock)                             │
│   tap any → [ ⊘ Hide from wall ]  [ ⊘⊘ also hide from gallery ]             │ ← two distinct semantics (see kill switch)
└─────────────────────────────────────────────────────────────────────────────┘
```

Lives in a new **`/dashboard/[event-id]/live` → Photo Wall tab** (the route shell is **net-new** — only loose day-of-mode card components exist today). One-tap, no double-confirm. **Pause** = global soft-freeze (ceremony proper, speeches) → a tasteful "✦ the wall resumes shortly" holding card; captures still ingest+gate in the background and flood back on resume. **Coordinator** sees the identical surface; their write authority is checked **per call** via a `thread_join_authorizations` row (`role='coordinator'`, `revoked_at IS NULL`) — **not** an `event_members.member_type` (the shipped CHECK is only `('couple','guest','vendor')`, `0012:1250-1251`) — so a revoke takes effect on the next action.

### Cron-free real-time feed

Architecture in one line: a capture lands → a Next 15 `after()` step runs the privacy gate chain (the capture paths already use `after()` for Drive copy in `app/papic/actions.ts` and `app/api/papic/guest-capture/route.ts`) and, only if it clears, inserts a **`wall_feed`** row pointing at a **gated/blurred derivative** → the `wall_ingest` RPC **server-broadcasts** that tile on `event:{id}:wall` → the anonymous wall renders it. No scheduler (owner lock `project_setnayan_cron_free`).

- **Why a durable table AND broadcast.** The anon wall **subscribes to a Realtime Broadcast channel** (broadcast does not RLS-gate row reads), and uses the durable `wall_feed` table **only for backfill-on-reconnect** through a thin public server route `GET /api/wall/[event-id]/since?cursor=…` that verifies the `wall_display_session` JWT server-side and calls the reader RPC via the **service-role admin client** (the shipped guest-serve pattern). The browser never holds a table-read credential and never calls the DEFINER RPC directly; event-scope comes from the JWT, not a client-controlled query param; the route is per-session rate-limited. A broadcast-only path would silently lose any tile a momentarily-offline projector missed on flaky venue wifi — the table makes recovery durable.
- **The one audited reader.** `wall_visible_photos(p_event_id, p_since)` SECURITY DEFINER (sibling to the specced `guest_visible_messages`, `0012:1245,1277`) hard-codes the visibility filter in ONE place and **re-evaluates consent + FaceBlock at READ time** (joins live `photo_consent` / `faceblock_enabled`), so even a missed retraction cascade fails closed on the next read. It returns only rows where `wall_hidden_at IS NULL AND wall_safe_r2_key IS NOT NULL` and resolves URLs via the shipped `displayUrlForStoredAsset` (`lib/uploads.ts:99`).
- **Peak-burst resilience.** Treat Realtime as a "wake up and reconcile" nudge, not a guaranteed firehose: the projector pulls `wall_visible_photos(p_since=cursor)` on a ~10–15s timer *regardless of channel health* (the cron-free single-long-lived-page display loop), so a grand-entrance flood that exceeds Realtime's per-client rate self-heals within one interval. The **hero count is broadcast as a single periodic aggregate** (count over the gated pool), decoupled from per-tile delivery, so a missed tile never desyncs the number.
- **Weak-wifi survival.** A `/wall/`-scoped service worker caches the last N rendered tiles; on drop the collage **freezes on the last good frame** + amber dot (never whites out); wake-lock keeps the screen on; on reconnect a full `wall_visible_photos(p_since=last_seen)` backfill catches missed inserts **and reconciles retractions** (the reader returns the current visible set, so a tile killed while offline drops on the next read). Connection dot: 🟢 live / 🟡 reconnecting (cached) / 🔴 offline (`0031:400`). This mirrors 0031's "cached last 20 photos" offline rule (`0031:226`). (Do **not** reuse `/api/telemetry/live_wall` as the SW substrate — it is server-to-server only, gated by `INTERNAL_WORKER_SECRET`, which must never reach a venue browser.)

### Server-side privacy / moderation pipeline (the strictest surface in the product)

The wall has **no RLS backstop** (service-role feed). Every gate is the server's responsibility and **fail-closed is non-negotiable** — no verdict yet ⇒ withheld, never shown-then-retracted.

**Per-photo gate chain — runs in `after()` on every capture (both sources):**
```
NEW CAPTURE (papic_photos | papic_guest_captures)
  └─ after():
     G0 SKU active?     event owns LIVE_WALL (event_software_activations_v2) ──no→ never enters pipeline
     G1 NSFW classify   synchronous, un-disableable interlock; auto-flag >0.7 (10_Papic:445)
                        ─flagged→ moderation_state='nsfw_blocked' · STOP
     G2 RA 10173 consent any tagged guest with photo_consent=FALSE (or guests.deleted_at)? ─yes→ DROP photo · STOP
     G3 Face detect+match per-event vector store ONLY (guest_face_enrollments, EXCLUDE revoked_at — 20260901000000:44,58)
     G4 FaceBlock decision  if ANY faceblock_enabled guest may be present:
                        • detected face of a faceblock guest → bake a SERVER-SIDE blurred derivative → wall_safe_r2_key
                        • NOT confidently face-free (low light / profile / occlusion) → WITHHOLD whole photo (don't project a maybe)
                        else → wall_safe_r2_key = a downscaled wall variant of the original
     G5 INSERT wall_feed only NOW is the photo projection-eligible → broadcast fires
```
**The wall reads ONLY `wall_safe_r2_key`, never the original `r2_object_key`.** No derivative ⇒ no `wall_feed` row ⇒ never projected. Face matching is **per-event scoped** (vectors never cross weddings, `0012:992`). **FaceBlock cannot be matcher-gated:** for any event with ≥1 `faceblock_enabled` guest, detection-failure ≠ face-free — if the matcher's confidence the photo is free of a faceblock guest is below a high threshold, **withhold the whole photo** rather than project an unblurred maybe. Detection runs on the **original resolution** (small faces survive) and the blur is baked into the derivative (never detect-on-downscale). The `guest_face_enrollments.face_vector` is **NULL until the unbuilt Papic enroller fills it** (`20260901000000:42`); until enrollment exists, an event with any `faceblock_enabled` guest **withholds all faces** — which is why the public `/wall` route stays behind the FaceBlock pipeline for such events (ship gate, below).

**Kwento caption gate chain — before any lower-third (`0012:1314-1323`):**
1. **Tier-1 synchronous text moderation** (net-new; un-disableable; today's NSFW is image-only): EN+Tagalog+Cebuano profanity/slur lexicon + PH PII/doxxing regex → `moderation_state` must be `'clean'`; `'flagged'` is never wall-eligible. Tier-2 async classifier can only downgrade clean→flagged; PII redacted before any external call (data-residency lock); outage fallback = leave flagged, never auto-public.
2. **DB CHECK `wall_needs_clean`** (`wall_eligible=FALSE OR moderation_state='clean'`, `0012:1232`) survives a buggy code path.
3. **Parent-photo visibility inheritance** — caption suppressed if its anchor photo is FaceBlock/consent-hidden (a caption can't name a blurred guest, `0012:1311`).
4. **FaceBlocked-author suppression** — if the author has `faceblock_enabled`, the whole message is publicly suppressed (`author_publicly_hidden`, `0012:1312`).
5. **Explicit one-tap approve-to-wall** — owner-locked 2026-06-10: human gate, no auto-publish, no hold-delay (`0012:1075,1319`). **Interlock:** the approve button is disabled until Tier-2 returns clean, AND any post-approval clean→flagged transition on a projected caption **auto-retracts** the lower-third (the no-hold-delay lock bans auto-PUBLISH on filter-clean; it does not forbid Tier-2 from yanking an already-projected caption — surface this nuance to the owner).
6. **Edit re-gates** — any author edit resets the row to pending/unscreened, pulls it from wall + compile pool, re-runs the gate (`0012:1323`).

**Kill switch + 7-day live override (two distinct semantics — do not conflate).** The **wall kill switch** flips `wall_hidden_at` on the source capture row (transient, wall-only, reversible) → the `wall_feed` mirror's `wall_hidden_at` follows → broadcast UPDATE → the tile vanishes in <1s. This is **separate** from the shipped `hidden_at` (durable gallery/recap suppression) so a couple hiding a guest from the big screen for a 5-minute speech does **not** delete the photo from their own wedding album; a second affordance ("also hide from gallery") writes `hidden_at` when a genuine durable retraction is wanted. For captions, the canonical kill primitive is the already-locked `photo_messages.hide_from_wall` (`0012:1214`); `wall_feed` mirrors it, never an independent source of truth. The **7-day couple review window is overridden during `live` mode** — photos hit the wall in seconds (`0012:1008,1319`) — with the kill switch + per-call coordinator re-check as the human backstop.

**Mutable-state cascade (RA 10173 reversibility).** Consent/FaceBlock are mutable mid-event. On `photo_consent→FALSE`, `faceblock_enabled→TRUE`, or `guest_face_enrollments.revoked_at` set, a **synchronous fan-out RPC** sets `wall_hidden_at` on EVERY `wall_feed` row tagged to that guest in one transaction (and re-queues blur re-ingest where the intent is blur-not-drop). Belt-and-suspenders: because the reader re-checks consent/FaceBlock at READ time, a missed cascade still fails closed on the next read.

> **Open semantic decision (surface to owner):** `photo_consent=FALSE` = "not in any shared output" → **drop** the whole photo; `faceblock_enabled=TRUE` = "appear blurred" → **composite** (don't lose a group shot because one person opted into blur). Keep the two primitives distinct.

### Data model — reuse-first; reconcile with shipped recap

**Reuse as-is (shipped):** `papic_photos` (seat; `photo_id` UUID; `width_px/height_px/photo_type`; `hidden_at`) + `papic_guest_captures` (guest; `capture_id` UUID + `id` BIGSERIAL; `r2_object_key`; `hidden_at`) = the two capture sources · `events.photo_wall_photos` JSONB + the `LivePhotoWall` masonry (`editorial-content.tsx:606`) = the **recap/archive** render mode · `event_software_activations_v2` `LIVE_WALL` row = activation gate (`data.ts:550-553`) · `displayUrlForStoredAsset` (`lib/uploads.ts:99`) · `guests.photo_consent` · `guest_face_enrollments` (exclude `revoked_at`) · `setnayan_guest_session` JWT shape + service-role admin client · Realtime publication + presence/reconnect machinery · `getDayOfPhase()` (`lib/day-of-mode.ts:80-89`).

**Specced-but-UNBUILT (must ship as prerequisites):** `events.live_mode_override` (`0031:43,350`) · `events.live_photo_wall_visibility DEFAULT 'tagged_only'` (`0031:356-357`) · `photo_tags` (referenced by name in `0031:110,489` — **use this name, not `papic_photo_tags`**, or the "Photos of me" query forks) · `guests.faceblock_enabled` (`0012:1368`) · `photo_messages` + CHECKs (`0012:1197-1233`).

**Net-new (grep-zero today):** **`wall_feed`** (the public-broadcast feed mirror — anon never SELECTs it directly; carries only `wall_safe_r2_key`, never the original key) · `moderation_state` + `wall_safe_r2_key` + `wall_hidden_at` columns on both capture tables · `thread_join_authorizations` (coordinator authority — the corpus RLS at `0012:1270` references it but it does not ship) · `wall_display_sessions` (code/QR → display JWT, short TTL, rotating) · DEFINER RPCs `wall_ingest` / `wall_retract` / `wall_approve_caption` / reader `wall_visible_photos` / `wall_claim_display` / `wall_freeze_recap`.

**Recap convergence (closes the standing note `20261017000000`).** At `recap` handoff, `wall_freeze_recap(p_event_id)` selects the top ~24 `wall_feed` rows by an explicit ranking (face-coverage + quality + chronological diversity, with a couple-override pick list reusing the control grid — the shipped renderer hard-slices `photos.slice(0,24)`), writes **only `wall_safe_r2_key`** (blurred derivatives — never originals) into `events.photo_wall_photos`, and records the full pool count so the recap caption ("847 photos captured live") stays truthful. **One wall, two render modes, one gated pool** — the recap masonry just works, and only fully-gated rows ever bake into the permanent public recap article.

**Broken FK to fix first.** The corpus `photo_messages.photo_id REFERENCES photos(photo_id)` (`0012:1200`) is broken-on-arrival — **there is no `photos` table.** Redesign the caption anchor polymorphically — `(source_table, source_id)` matching the `wall_feed` shape (or a `feed_id` FK) — so a `papic_guest_captures` (disposable-camera) frame can carry a Kwento caption, not just `papic_photos`. The paying disposable-camera cohort is exactly the one most likely to write Kwento.

### 5-mode lifecycle

The wall is a **sub-state of the day-of router, not its own clock.** **Drive the mode SERVER-SIDE from the event's stored date + `events.timezone`** — a venue projection is exactly the "guest-facing renderer" the shipped helper defers tz-correctness to (`day-of-mode.ts:9-10`) — and push the current mode into the feed payload. Do **not** trust the projector machine's local clock (set by random venue AV staff); a wall flipping live an hour early/late is the single most visible failure. `live_mode_override` (couple-set, `0031:43,62-65`) is the authoritative manual control, surfaced as one-tap "Go live now / Hold."

| Mode | Wall behavior |
|---|---|
| **coming_soon** (>T-7d) | Teaser: monogram loop + "The wall lights up when the celebration starts" + big claim-your-camera QR. Drives pre-event `PAPIC_GUEST` signups. No photos. |
| **pre_event** (T-7d..T-1h) | Warmer teaser + countdown; pre-shot getting-ready photos appear; counter at 0. |
| **live** (T-1h..T+8h) | The real-time projection; 7-day window live-overridden. |
| **recap** (T+8h..T+30d) | Freeze → `wall_freeze_recap` backfills `events.photo_wall_photos`; `/wall` redirects new loads to the recap render, but **gates the redirect behind `live_mode_override`** so an active projector is never auto-yanked to recap mid-overrun (freeze, don't redirect, a still-mounted live screen). |
| **archive** (T+30d+) | Read-only last frame / static masonry. |

> **Shipped-vs-spec reality:** the shipped `getDayOfPhase` has only **4 coarse phases** (pre=T-3d, live=T-1h..T+8h, post, inactive) and **cannot distinguish coming_soon vs pre_event vs the T-7d boundary**; the 5-mode/T-7d machine + `live_mode_override` are **0031-spec-only, unbuilt** (`0031:5`). V1 binds to the event-tz-precise computation (recommended) with `live_mode_override` as the safety; the teaser-mode split lands when the 5-mode machine ships.

### Reconciliation — recap, Panood, Kwento, 0031

- **Recap wall:** converge, don't fork (above). Live = broadcast `wall_feed`; recap/archive = the frozen `events.photo_wall_photos` masonry written from the same gated pool.
- **Panood:** same event-slug origin, two independent surfaces, **zero contention** (Panood = YouTube IFrame CDN, `0011_panood.md:43-44`; wall = R2 tiles via broadcast). A venue runs both on two screens. When both `LIVE_WALL` and Panood are active, the "Open on a screen" chooser offers `/wall/[id]` vs the livestream. "Projecting on N screens" counts `wall_display_sessions` only (excludes Panood viewers); Pause fans out only to wall screens.
- **Kwento:** the wall is Kwento's strictest enforcement point (`0012:1342`). Lower-thirds render only on the wall renderer, only on one-tap approve, through `guest_visible_messages(p_mode='public')` so suppression is centralized.
- **0031 phone card:** distinct surface (personalized, interactive). Shares the feed + `live_photo_wall_visibility` (which **defaults to `tagged_only`** per `0031:566` — the **venue projection** showing all-with-consent is a *projection-specific* default owner-ratified 2026-06-11 = all-with-consent (still FaceBlock/NSFW/consent-gated), separate from the phone card's global toggle). The 0031 card deep-links to `/wall/[event-id]` only while the mode is `live`.

### Phased build order — Claude Code time

Estimates assume the capture pipeline (0.A) emits photos — the hard prerequisite (`0012:988`). Calendar-bound externals (NSFW + face-detect model validation on a real photo set; PH-residency-compliant) called out separately.

| Phase | Scope | Claude Code time |
|---|---|---|
| **P0 — Schema prerequisites** | Migrations: `wall_feed`; `moderation_state`+`wall_safe_r2_key`+`wall_hidden_at` on both capture tables; `guests.faceblock_enabled`; `photo_tags`; `thread_join_authorizations`+grant/revoke flow; `events.live_mode_override`+`live_photo_wall_visibility`; `photo_messages`+CHECKs (polymorphic anchor); `wall_display_sessions`; `ALTER PUBLICATION`. DEFINER RPC stubs. Apply via `supabase db push`. | **~0.5–1 day** |
| **P1 — Feed + projection (gates on, faces stubbed)** | `wall_ingest` (G0/G1/G2 + insert + broadcast), `wall_visible_photos` reader, `/api/wall/[id]/since` backfill route, `/wall/[event-id]` renderer (reuse masonry CSS), claim handshake (code+QR+JWT+wakeLock), broadcast subscribe + reconcile-timer + backfill, live counter, presence (shooter vs display roles), new-tile animation, rotation, teaser/processing/empty states, event-tz mode binding. **FaceBlock fail-closed-stubbed** (withhold any photo with a detected face on a faceblock event). **INTERNAL/clean-test-event only.** | **~2–2.5 days** |
| **P2 — Server-side FaceBlock** | Face detect (original-res) → per-event match → baked blur derivative → `wall_safe_r2_key` → withhold-when-uncertain; CHECK enforcement. The long pole + the public-event ship gate. | **~1.5–3 days** *(+ calendar-bound: NSFW + face-detect provider choice & validation, first-party / PH-residency)* |
| **P3 — Control + Kwento** | `/dashboard/[id]/live` Photo-Wall tab (incoming grid + one-tap hide + two-tier hide semantics, visibility toggle, pause, open-on-a-screen, screen revoke); coordinator auth branch; `photo_messages` + Tier-1 trilingual text gate + Tier-2 interlock + one-tap approve + lower-third renderer + parent/author suppression + edit-re-gate. | **~2–2.5 days** |
| **P4 — Resilience + lifecycle + phone card** | Wall-route SW (last-N tile cache, freeze-on-drop, long-lived presigns), connection dot, recap backfill (`wall_freeze_recap`), Panood/screen chooser, wire the 0031 phone-card stub to the feed (Photos-of-me, save-to-reel, hide-me, gated "All photos"). | **~1.5–2 days** |

**Total ~8–11 Claude Code days.** **This is ~3–4× the corpus's locked 1.5–3-week-for-the-whole-output-layer framing for just Phase 1** because the corpus under-scoped the anon-Realtime/RLS problem (it assumed "push from papic_photos via polling or lightweight realtime", `0012:1006`, which an anon projection client cannot do — Realtime honors RLS). The `wall_feed` table + baked FaceBlock derivative pipeline are the delta — **owner-locked 2026-06-11: FULL ROBUST BUILD confirmed** (not the thin polling-only V1) — the complete server-baked FaceBlock + safe broadcast/backfill architecture, real-guest-safe. **Hard ship gate:** the public `/wall` route stays behind P2 for any event with FaceBlock opt-ins — an unblurred opt-out guest projected in front of the whole reception is the highest-blast-radius privacy failure in the product. P1 (NSFW + consent + `wall_hidden_at` kill switch, no opt-out faces) is a demoable "wow" on a clean test event only.

### Acceptance criteria

- [ ] A photo shot at the venue (from either `papic_photos` OR `papic_guest_captures`) appears on `/wall/[event-id]` within seconds; the live count increments and matches on-screen tiles; "shooting now" presence is non-zero while cameras are active.
- [ ] A FaceBlock-opted guest renders **blurred** on the projection via a server-baked derivative (never CSS blur); a photo the matcher cannot confidently clear of a faceblock guest is **withheld**, not projected.
- [ ] NSFW and non-consenting (`photo_consent=FALSE`) photos **never** reach the wall (withheld at ingest, never flash-then-retract).
- [ ] A couple/coordinator `⊘ Hide from wall` removes the tile in <1s and does **not** delete it from the couple's gallery; `⊘⊘ also hide from gallery` writes `hidden_at`.
- [ ] A Kwento caption reaches the lower-third **only** on explicit one-tap approve; a flagged caption cannot be approved (button disabled + DB CHECK); a clean→flagged Tier-2 downgrade auto-retracts an already-projected caption.
- [ ] A disposable-camera (`papic_guest_captures`) frame can receive and project a Kwento caption.
- [ ] On a venue-wifi drop the projector freezes the last good collage (never whites out) + amber dot; on reconnect a backfill catches missed tiles AND reconciles retractions.
- [ ] Mid-event `faceblock_enabled→TRUE` / consent withdrawal / face-data revoke retracts already-projected photos of that guest within seconds.
- [ ] A revoked coordinator's hide/approve action 403s on the next call; the couple is unaffected.
- [ ] At `recap`, the gated pool freezes into `events.photo_wall_photos` (blurred derivatives only) and the shipped recap masonry renders it; an active live projector is not auto-yanked to recap mid-overrun.
- [ ] N browsers on `/wall/[event-id]` render identically; the control tab shows "projecting on N screens"; Pause/Off fans out to all wall screens only.
- [ ] No anon client holds a direct SELECT grant on `wall_feed` or any capture table; the projection reaches data only through the service-role-served route.

### What it does NOT do in V1

- No video/clip tiles on the live wall (photo collage only; muted-poster clips are Phase-1.5).
- No auto-publish of Kwento captions (human one-tap only) and no rich-media captions (text-only, `0012:1075`).
- No native cast / Chromecast / AirPlay pairing (browser-at-a-URL only).
- No All-Guest web-shoot tier, no live venue floor-projection mapping, no cross-paparazzi de-dup (spec Part 6).
- No CSS-only blur anywhere (FaceBlock is server-baked or the photo is withheld).
- The interactive guest phone card is built last (P4); Phase 1 ships projection-first.

---

## Kwento Magazine — the print/keepsake sibling of the film outputs

> **✅ VARIANT A SHIPPED 2026-06-11** (PR #1261, merged; no migration). The free couple-private A4 keepsake is live: `lib/kwento-magazine.ts` (deterministic gap-bucketing — **curation owns the cap** so a Kwento-anchored photo rescues a slot; "a Kwento earns its photo a slot"; WinAnsi-safe text, emoji gently stripped; full renderer cover→Ang Simula→PH-titled chapters→**Mga Boses**→Salamat, every page "PARA SA INYO LANG") + the couple-gated download route (the SAME `loadEditorialData`/`composeCopy` frame as the recap — no fork; ≤48 curated images, SSRF-guarded, sharp-resized) + the MagazineCard on the Papic add-on page. **The Kwento weave shipped WITH Variant A** (its `photo_messages` dependency landed first, PR #1257). Verified: real 12-page fixture render + 14/14 content assertions on the decompressed streams. **Still deferred per this design:** fontkit/Cormorant polish · P5 async-at-scale + Drive-copy push · Variant B shareable (blur pipeline + consent amendment) · paid print-on-demand (pricing batched to the holistic review).


> **Your one-PDF ask = Variant A, Phase 1: a free, beautiful, couple-private photo + storyline magazine, shippable now off existing infra in ~3–5 days Claude Code time.** Everything below it (the Kwento weave, the shareable copy, print-on-demand) is an OPTIONAL follow-on roadmap, each gated on a prerequisite that does not exist yet. The core ask did not balloon; the phasing keeps the warm thing first.

The Kwento Magazine is the **print member of the produced-output family** (§ "produced-output layer" moat) — the same three ingredients as the SDE / Thank-You / Stories film (the Papic photo stream + the guest Kwentos + the couple's storyline), laid out as a magazine PDF instead of rendered as a film. *"The photos tell the story; the guests narrate it"* — now in print. No competitor can compile this book, because none co-owns the captured stream **and** the photo-anchored sentiment **and** the couple's love story in one product.

> ⚠ **DEPENDS ON KWENTO.** The guest-voice layer requires `photo_messages` (designed in this iteration, **not yet built** — zero references in `apps/web`; the corpus FK to a `photos(photo_id)` table is broken-on-arrival, no such table exists). Build the anchor **polymorphically** over the two real capture tables — `(source_table, source_id)` across `papic_photos` (seats) and `papic_guest_captures` (disposable cameras) — matching shipped `photo_tags` / `wall_feed`. A non-polymorphic anchor would silently exclude disposable-camera guests, who are the cohort **most likely to write a Kwento**. The photo + storyline magazine ships before `photo_messages`; the Kwento weave waits on it.

### Magazine structure (page-by-page)

A4 portrait (`595.28 × 841.89`, margin 42 — matching `concept-pdf.ts`), one continuous **auto-paginated** document — the first Setnayan PDF that flows across an unbounded page count. Clean Editorial language (Warm Alabaster paper, Deep Obsidian ink, Royal Champagne Gold, Rich Mulberry accent). Typical wedding ≈ 24–40 pp. SETNAYAN-authored chrome (chapter names, section titles, how-to-read, "Salamat") binds to the couple's `events.story_language` (EN / TL / CEB), defaulting to the same field `composeCopy` already reads — guest Kwentos always render verbatim, never translated.

**FRONT MATTER — the storyline FRAME (from `loadEditorialData` / `composeCopy`)**
- **P1 · Cover** — Animated Monogram rasterized to static (text-monogram fallback if Lottie-only with no clean single frame — note the visual downgrade) · "A & B" · long-form en-PH date · venue · one **gate-passing** hero photo full-bleed · gold kicker "Ang Kwento ng Aming Kasal." The cover runs the privacy gate FIRST and only ranks gate-passing photos; if none pass (shareable), it falls back to a monogram-only cover — never a blurred/withheld image in the most prominent slot.
- **P2 · Colophon / "Paano basahin ito"** — one warm paragraph + the day's stats ("147 guests · 892 photos · 64 kwentos · one day") + a moodboard palette swatch row + a 1-line table of contents.
- **P3–4 · Ang Simula (the prologue)** — `composeCopy` headline / deck / lead paragraphs as flowing body; `love_story.milestones[]` as a vertical gold-dotted rail (the **love-story** timeline, ≤9); `anchors{song/place/injoke/food}` as 4 gold-label cards; `special_message` as the act-closing pull-quote. **Hand-off beat at the Act-I → spine boundary** converts the love-story axis into the wedding-day axis in one sentence (e.g. *"On <eventDateFormatted>, the story they'd been writing for <yearsTogether> years became a single day —"*; both values already computed in `data.ts`) so the two timelines read as one continuous story, not two stapled books.

**THE SPINE — the wedding-day timeline (net-new, `captured_at`-bucketed)** — for each moment chapter in chronological order:
- **Chapter opener** (½–1 pg): moment name "Ang Seremonya / The Ceremony" · time range · gold rule · chapter-hero photo · one tone-tinted interstitial line from `composeCopy` vocabulary. Openers drop below a minimum photo count (no thin half-empty dividers).
- **Photo + Kwento spreads** (flowing): rotated archetypes — (1) full-bleed photo + one Kwento as a large lower-third pull-quote; (2) asymmetric 2–4 photo grid + small Kwento cards beside their anchor; (3) quote-forward typographic card (a Kwento whose anchor photo is absent/consent-dropped — words kept, no image).
- Chapters run the PH-wedding bilingual vocabulary (empty buckets silently skipped): Paghahanda → Seremonya → Panata at Halik → Paglabas → Pagdating sa Reception → Unang Sayaw → Mga Talumpati → Selebrasyon → Paghahatid.

**BACK MATTER**
- **"Mga Boses" / the guest voices** — orphan approved Kwentos whose anchor photo didn't earn a spread, as a typographic quote-wall (no guest's words ever lost; capped + ranked, overflow stays in the live gallery). In the shareable variant the quote-wall runs the **full** Variant-B Kwento gate identically to inline cards — a self-describing caption is identifying content under RA 10173 and can re-identify a non-consenting **subject** of the omitted anchor photo, not just the author.
- **Salamat** — closing storyline beat · "From the Couple" · tier-aware credit roll (guests who wrote · vendors) · metrics woven warmly · QR to the living landing page · Setnayan colophon · edition stamp ("Unang Edisyon").

**The weave rule (load-bearing):** the storyline FRAME *opens* and *closes* the book plus thin chapter interstitials — it never competes with the day's chronology. The two timelines stay distinct: `love_story.milestones[]` = love-story frame; `captured_at` buckets = wedding-day spine. Do not conflate (the editorial recap has **no** `captured_at` timeline field — only `love_story`; the spine is wholly net-new).

### Data assembly

**Single source of storyline truth.** Derive the FRAME from the SAME assembly as the editorial recap — do **not** fork it. Extract a shared `assembleStoryFrame(eventId)` over `loadEditorialData(eventId)` (admin-client, best-effort, never throws) + `composeCopy()` (deterministic, **LLM-free, never invents facts**, minimal flattering fallback at `composeLede`). Both the web recap and the magazine call it. Two route-side patches the loader doesn't carry: `events.role_palette` (add `sanitizeRolePalette`, as the concept route already does) and the Animated Monogram R2 asset — both mechanically identical to the existing `displayUrlForStoredAsset → fetch → sharp → embed` path. Make the magazine's **spine query** the single capture-stream source and derive the frame's hero/count from it (the loader already exposes `hero_photo_id`) rather than re-querying `papic_photos` twice.

**The four-layer join (100% net-new):**
- **Layer A · SPINE** — UNION `papic_photos` + `papic_guest_captures` into one `captured_at`-ordered stream (both `captured_at` columns NOT NULL + indexed → sort is free; guest captures carry no `width_px/height_px`, read via `sharp().metadata()`). `captured_at` is the **only** ordering primitive — no `moment`/`phase` column exists. **Trap:** the shipped `photo_moments` table is an unrelated website etiquette widget (`camera_ok / phone_down / papic_only`), NOT a timeline.
- **Layer C · TAGS** — `photo_tags` polymorphic `(source_table, source_id)`, shipped; gives who's-in-frame for attribution.
- **Layer D · KWENTO** — `photo_messages` (build first), polymorphic anchor, `status='approved' AND moderation_state='clean'`. A Kwento inherits its moment by reading its anchor photo's `captured_at`. `UNIQUE(source_table, source_id, guest_id)` enforces one caption per (guest, photo).

**Moment bucketing (deterministic — no per-render AI, matching the SDE lock):**
1. **Clock-skew normalization FIRST** — seat photos are NTP-stamped; disposable-camera clocks may be unsynced. Per device, estimate an offset by aligning each device's dense burst to the global median timeline, clamp wild outliers, *then* bucket.
2. **Gap detection is the PRIMARY structural signal** — `captured_at` always exists; walk the stream, a gap `> max(20 min, 1.5× median inter-shot gap)` marks a boundary.
3. **`events.photo_moments_config.time_label` is a SECONDARY hint only** — it is free text (≤60 chars, ≤8 entries), authored for guest **etiquette** not as a schedule, and often empty/non-parseable. Use it only when a time can be regex-extracted *and* aligns within tolerance to a detected density boundary; otherwise ignore it.
4. **Labeling** — map ordinal buckets onto the fixed PH bilingual vocabulary; couple can rename / merge / reorder.

**Auto-curation:**
- **Per-chapter hero** — SDE-style rank: quality + face-coverage (via `photo_tags` count) + has-Kwento bonus. Couple override via `event_editorial.hero_photo_id` / `essay_photo_ids`.
- **"A Kwento earns its photo a slot"** — every approved Kwento renders. Anchor in the chapter → card beside it. Anchor not in the chapter → promote it in. Chapter full → Kwento drops to the back-matter quote-wall. No guest's words are ever lost.
- **Density cap** — ~6–9 photos/chapter; Kwento-anchored photos win over silent photos; cut count surfaced ("12 more from this moment in your gallery").

**Empty states (strong shipped precedent — every embed silently skips, every section degrades):**

| Situation | Behavior |
|---|---|
| No Kwentos at all | Pure photo-story magazine (timeline + couple story). **Ships before the Kwento table exists** — back-matter reads "The photos tell the story," not a quote-wall. |
| Chapter has photos, no Kwento | Clean photo spread. |
| Kwento, anchor photo consent-dropped (shareable) | Quote-forward card — words kept, no image — unless the author is also FaceBlocked/unresolved (then suppress). |
| Variant-B edition left near-zero usable photos (every photo had a non-consenting tagged guest) | Fall back to a deliberate typographic "Mga Boses" quote-anthology layout (book-of-words, monogram + palette chrome, no empty `framed()` boxes) OR surface to the couple that the shareable edition is photoless and recommend the private edition. |
| Image fetch fails | `embed()` returns null → slot silently skipped. |
| Few photos (< ~12 / elopement) | Collapse to one "Ang Araw / The Day" chapter; lean on the always-present FRAME. |
| Sparse storyline | `composeLede` minimal flattering fallback; Act I shrinks to names + date + monogram, day chapters carry the book. |
| Guest capture with NULL `r2_object_key` | Skipped (filtered in SQL + silent embed skip). |
| Animated Monogram is Lottie/animated-only | Text-monogram badge fallback (note the cover downgrade). |

### Generation plan

**Reuse the route + builder split verbatim** (the `concept-pdf.ts` architecture): a pure `buildKwentoMagazine(input): Promise<Uint8Array>` layout lib receiving **pre-resolved JPEG/PNG bytes + resolved text + palette + monogram**, and a route doing **ALL I/O** (auth, RLS, privacy-aware key selection, presign, fetch, sharp-normalize, embed). The privacy fork lives in the route; the lib stays a dumb "lay out ready bytes" layer.

```
apps/web/lib/kwento-magazine.ts                                    ← pure layout (extends concept-pdf)
apps/web/app/dashboard/[eventId]/add-ons/kwento-magazine/route.ts  ← all I/O, auth, privacy, maxDuration
```

**[REUSE] verbatim from `concept-pdf.ts`:** `center`, `fitSize` (long Filipino names), `label` (gold mini-caps), `framed` (gold frame + contained image), `paragraph` (word-wrap), `footer`, brand palette consts, `hexToRgb`, `initialsFrom`, `formatDate`, monogram badge, silent `embed()→null` skip. QR via `QRCode.toBuffer().embedPng` (`seating-pdf.ts`). Mandatory SSRF-guarded fetch `safeFetchImageBytes` (`safe-image-fetch.ts`). R2 resolve `displayUrlForStoredAsset` (`uploads.ts`).

**[NET-NEW] (narrow but real):**
1. **Cross-page flow + pagination engine — the hardest, beauty-critical piece; budget it as its own sub-item (~1.5–2.5 days alone).** `concept-pdf`'s helpers draw at caller-computed absolute `y` with no page-break awareness — reusable only for *in-block* drawing, not flow. Build a measure → atomic-block → `Cursor.place(block)` abstraction where each archetype declares its height and is placed whole-or-next-page, with running header/footer redraw (generalize `seating-pdf`'s `ensureSpace/addPage` loop). De-risk by shipping P1 with a simpler fixed-grid-per-page layout first and deferring true editorial cross-page text reflow to a polish pass.
2. **Kwento primitives** — `pullQuote(...)` (oversized serif, gold rule, mulberry attribution) and `kwentoCard(...)` (framed photo + wrapped quote + who's-in-frame).
3. **Multi-photo editorial slots** — full-bleed `bleed()` (image to page edge, no frame) + the existing margined `framed()`, alternated for rhythm. Each slot declares its pixel box; the route's `sharp(...).resize(boxW, boxH, {fit:'cover'})` normalizes (pdf-lib does NOT resize).
4. **Chapter-opener band.**
5. **Fonts — `@pdf-lib/fontkit` + real TTFs (the single net-new dependency, load-bearing).** `ascii()` keeps Latin-1 (so `ñ`/`é` already survive today) but strips emoji, true curly quotes, and any non-Latin script — fatal for a book made OF guest Taglish/emoji (🥹💛). Embed Cormorant Garamond (display serif, matches the recap) + a humanist body serif + DM Mono (eyebrows/timestamps) via `doc.embedFont(ttf)`. Apply a gentle filter (keep accented Latin + curly punctuation; strip only emoji, which text fonts can't render) instead of `ascii()`'s strip. **Never rasterize Kwento text** — keep it real, selectable, searchable text.
6. **JPEG embed path** — Papic photos are photographic → `sharp.jpeg({quality:82})` → `embedJpg` yields far smaller PDFs than the PNG-everything path.

**Route, budget, scale:**
```ts
export const dynamic = 'force-dynamic';
export const maxDuration = 60;  // up from concept's 20; raise toward the Vercel plan ceiling
```
Auth `supabase.auth.getUser()` → 401; RLS-scoped reads → 404 on null event. Response `application/pdf` · `Content-Disposition: attachment; filename=<sanitized firstNames>-Kwento-Magazine.pdf` · `Cache-Control: no-store`. **The scale problem is real** — a naive all-at-once `Promise.all` sharp pipeline times out AND OOMs Vercel. Mitigations in order: JPEG · bounded concurrency (`p-limit ~4`) + `limitInputPixels` + `failOn:'truncated'` · fetch only curation-surviving photos · `metadata()` for guest-capture dimensions. **For large / "Complete" editions: render off the request path** via Next 15 `after()` / `waitUntil` (cron-free), store the PDF in R2 keyed `magazines/{event_id}/{edition}/{generated_at}.pdf`, email the couple a download link (reuse 0028 templates). **Accessibility (V1 floor):** set document `/Lang` from `events.story_language`; keep all text as real embedded text (already planned via fontkit); ensure logical content order. Full PDF/UA tagging (structure tree, image alt) is beyond pdf-lib's easy reach — deferred and stated as a known gap, not silently omitted.

**Delivery (honor the locked Drive-copy architecture):** the finished magazine PDF is a **Drive-copy artifact** — after R2 store, call `pushToDriveCopy()` (`lib/drive-copy.ts`) to land it in the couple's permanent Drive folder, joining the six locked artifacts (Papic · Patiktok · Pabati · Pakanta · Monogram · QR codes). Channels: (1) instant download on the request path (Variant A, small editions); (2) `after()`/`waitUntil` → R2 → email link for large / Variant B; (3) Drive-copy as the durable home. *(Owner sign-off: add Kwento Magazine as a 7th `drive_copy_artifacts` type.)*

### Privacy model (LOAD-BEARING — the central product decision)

**One assembly, TWO renders, differing only in *which R2 key* + *which reader*.** Correct-by-construction by reusing the strictest pipeline already in the product (the live wall) — no bespoke magazine privacy logic. **Anchor all privacy primitives to the canonical multi-view + Kwento model (§ Kwento data model / multi-view visibility / 7-day review / RA 10173 erasure) and the live-wall `moderation_state` state machine — NOT a stale "G0–G5" enumeration.** Ground truth today: `moderation_state` DEFAULTS to `'unscreened'` for 100% of photos, the gate-running RPCs are explicitly **unbuilt**, and nothing in `apps/web` ever writes `moderation_state` or `wall_safe_r2_key`. So `displayUrlForStoredAsset` presigns ANY key with zero privacy logic — the gate is 100% the caller's responsibility.

**Variant A — "Para sa atin / Keepsake for us" (couple-PRIVATE · default · ships now):**
- Reads **original `r2_object_key`** masters, **unblurred** — couple/host always sees 100% (locked, not a toggle).
- Every approved Kwento in full attribution; no FaceBlock suppression, no consent-drop.
- **NSFW is an ALLOWLIST, not a blocklist** — include a photo only when `moderation_state='clean'` (affirmatively screened safe), never "everything except `nsfw_blocked`" (an un-screened NSFW photo is `'unscreened'`, not `'nsfw_blocked'`; the un-disableable NSFW rule is satisfied here because only the couple — who already has full master-gallery access — ever sees Variant A). **Block Variant A from every share/email/upload affordance** — the share button must regenerate from the gated Variant-B pipeline, never attach the Variant-A file.
- Inherits **hard RA 10173 erasure**: a deleted guest / revoked face-data must purge them even from a STORED private artifact + the export-my-data ZIP (DB `ON DELETE CASCADE` does NOT reach into a generated PDF binary — see invalidation below).
- A discreet "Para sa inyo lang · for you only" colophon **labels** (not "guards") the file; the real control is that the product never moves a Variant-A file off-device on the couple's behalf.
- **₱0, no new privacy infra. This is the first ship.**

**Variant B — "Para ipamahagi / A copy to share" (SHAREABLE · gated):** a fully separate code path from Variant A — never one parameterized key-selector that can fall through.
- **Photo-stream SQL fails CLOSED in the query, not in prose:** `WHERE event_id=$1 AND hidden_at IS NULL AND moderation_state='clean' AND wall_safe_r2_key IS NOT NULL`. The route reads `wall_safe_r2_key` into every embed slot and **never references `r2_object_key`**; add a route assertion that throws if any resolved Variant-B key equals an `r2_object_key`. NULL safe key = photo **omitted, never substituted** (no `COALESCE(wall_safe_r2_key, r2_object_key)` — that ships every master).
- **Photo-level consent as an explicit fail-closed veto** (consent is a column on `guests`, not the photo): exclude a photo if `EXISTS (SELECT 1 FROM photo_tags pt JOIN guests g USING(guest_id) WHERE pt.source_table=s.source_table AND pt.source_id=s.source_id AND g.photo_consent=FALSE)`. Because **untagged ≠ consented**, require an affirmative safe derivative (`wall_safe_r2_key`, which exists only post-gate) rather than inferring consent from the absence of a dissenting tag — untagged raw photos never reach a shareable file by default.
- **FaceBlock-author suppression off the materialized write-time flag, not a live recompute:** gate Kwento inclusion on `photo_messages.author_publicly_hidden = FALSE` (NOT a live read of `guests.faceblock_enabled`, which is default-FALSE and reads "no preference" as "fine to print" — fatal for zero-account disposable-camera authors with no complete `guests` linkage). If author identity / faceblock linkage is unresolved → treat as suppressed-in-share. A Kwento also inherits its parent photo's visibility (caption hidden if the photo is hidden for the viewer).
- **Author CONSENT-FOR-PRINT as a DB-enforceable filter:** the captured-Kwento consent string authorizes use in the wedding **video**, not print/PDF/redistribution. Store a consent-version (or cutoff timestamp) per message; render a Kwento into a shareable PDF only when `consent_captured_at` post-dates a string naming "a printed or PDF keepsake you may share." Messages collected under the old video-only string are **Variant-A only** or must be re-prompted.
- Only **post-approval, post-7-day-window** content (a HARD precondition so the snapshot already excludes provisional content).
- **Invalidation / blast-radius:** track every generated shareable PDF in `magazine_renders` (`event_id`, `r2_key`, `audience`, `content_hash`, `generated_at`, `stale_at`). Because a distributed copy is **non-retractable**, reduce blast radius at GENERATION time: (a) make Variant B a short-TTL revocable signed link / hosted view by default rather than a free-floating emailed attachment, so revocation kills future access; (b) bake a visible "reflects consents as of <date>" line so it reads as a snapshot; (c) on guest hard-delete / face-data revocation, mark stale + delete the stored R2 PDF (regenerate on next request). Extend `magazine_renders` to **any stored artifact** — including P5's async-stored Variant A; a request-path **streamed** Variant A needs no invalidation (no artifact survives the response).

**TWO hard blockers on Variant B (surface to owner — do NOT silently ship):**
1. **Consent-for-print** — amend the Kwento consent string (or scope shareable to the closed guest circle the current consent already covers). **Split consent into two scopes:** (a) closed-circle share (couple → their own guests) — an amended string covers this; (b) public / redistribution / commercial (public link, social, **paid print-on-demand**) — requires a separate explicit redistribution consent OR strips all guest-identifiable Kwento + faces regardless of FaceBlock. P5 POD is a public commercial artifact and must be gated on (b), not allowed to ride the Variant-B model.
2. **Unbuilt pipeline** — Variant B reads `wall_safe_r2_key` + `moderation_state='clean'`, both produced ONLY by the Phase-1 wall-screening RPC (sets `'clean'` + writes the safe key) and the blur-derivative baker. Both are unbuilt → a Variant B built today renders a **completely empty book** (zero photos), even for a wedding with zero FaceBlocked guests. *Enrollment CAPTURE is shipped* (`lib/face-gate.ts`: RSVP-selfie MediaPipe quality gate already populating `guest_face_enrollments.asset_url/quality_score`); what's unbuilt is server-side face **matching** (`face_vector` embeddings, NULL today) + the derivative baker. **Variant B blocks on the entire wall-moderation/derivative pipeline + the consent amendment — both calendar-bound, not Claude-time-bound.**

**The warm UX of the fork:** a single **"Sino ang makakakita nito? / Who's this for?"** choice at generate-time, default private. If any guest opted private, Variant B shows one honest line: *"May ilang bisita na gustong manatiling pribado — ni-blur o inalis namin sila sa kopyang ipamamahagi, para ligtas mong maipadala."* The couple never feels punished; the private edition stays complete.

### Curation UX

**Auto-first, couple-perfectible.** Entry point in the couple dashboard add-ons, beside the mood-board concept book.
1. **One-tap generate → a finished book** (auto-bucketed clock-skew-normalized, auto-hero'd, auto-placed). Most couples stop here — they open a complete magazine, never a blank editor.
2. **Magazine editor** (reuse the `photo_moments` editor pattern + the recap hero-pick): rename / merge / reorder / split / hide moment chapters; a prominent **"fewer / more chapters" slider** exposing the gap threshold (front-line fix for the most error-prone step — auto-bucketing); per-chapter hero swap + cover pick via `hero_photo_id` / `essay_photo_ids`; add / remove a photo per chapter; **hide a specific Kwento** from *their* book (include/exclude only — the couple never edits a guest's words).
3. **Editorial-frame copy** curated-overridable via `event_editorial.draft_json` (same hook the recap uses).
4. **Guest-side disclosure (the other half of consent):** at Kwento compose-time show a one-line notice ("Your words may appear in the couple's keepsake magazine") + a per-Kwento "keep private to the couple / don't print" toggle (a `print_consent` flag on `photo_messages`) — Variant B suppresses any Kwento whose author declined print, independent of FaceBlock.
5. **Audience picker** at the top → live preview (low-res first-N-pages PDF, or the editorial recap web page as the on-screen proxy) → download (Variant A) or generate-and-email (large / Variant B).
6. **Edition versioning** — Kwentos trickle in for weeks post-wedding. `magazine_renders` carries an edition counter + `kwento_count_at_render`; a couple-dashboard nudge ("N new kwentos and M new photos since your last edition — regenerate?") fires off the cron-free post-approval `after()` hook. Distinguish "edition" (couple-named snapshot) from "render" (privacy-invalidation re-bake). POD order freezes content as-of-now. Regenerate is ₱0 and idempotent.

### Pricing recommendation (no figure invented — read at runtime from `service_catalog`)

- **Variant A (couple-private PDF): FREE.** ₱0 marginal cost (all data the couple already created; pdf-lib + sharp, like the free mood-board concept book). A free, beautiful day-in-order keepsake is a retention + word-of-mouth engine and a natural Papic upsell; Filipino warmth says don't gate the couple's own memories.
- **Variant B (shareable PDF): FREE, gated** on Papic/Kwento being active — same SKU gating as the wall/SDE. **Avoid the "pay more, get less" trap:** do NOT make the paid artifact the blurred one and the free one the complete one. Both digital variants are free; monetization lives in the physical object.
- **Print-on-demand (physical magazine): PAID — the monetization surface.** A4 portrait already matches standard photo-book trim. **Deferred.** Real owner-scoped work, not hand-waved: a press-prep export profile (screen-RGB → CMYK + 300 dpi + 3 mm bleed), page-count-to-multiple-of-4 padding for perfect binding, explicit back-cover + spine spec, partner min/max page bounds, per-trim COGS, and POD inherits the **public/redistribution** consent scope by definition. Price = print cost + margin, owner-set at runtime.

### Reconciliation with sibling outputs

| Surface | Relationship | Reuse / don't duplicate |
|---|---|---|
| **Editorial recap** (`/[slug]`) | Same storyline assembly = single source of truth. Recap = living web scroll; magazine = its printable, timeline-ordered, guest-narrated sibling. Net-new vs recap = ONLY the wedding-day SPINE (recap has no `captured_at` timeline, only `love_story.milestones`) + the Kwento↔photo↔moment weave. | Extract + share `assembleStoryFrame()`; recap web page doubles as the on-screen preview. No storyline re-query; derive the capture stream once. |
| **Mood-board concept-pdf** | Direct parent — same pdf-lib/sharp/route pattern, palette, footer, ₱0 posture. Concept-pdf renders design intent; the magazine is the first PDF to render guest faces. | Extend concept-pdf primitives; clone the route shell (auth + RLS + maxDuration + filename sanitizer). |
| **SDE / Thank-You / Stories video** | Sibling, not competitor — same three ingredients, page layout instead of an FFmpeg/Remotion timeline. The cheap/instant/paper member; ships far sooner (no render backbone, no face enrollment for Variant A). | Build the **moment-bucketer once** and share it with the SDE shot-list; share the privacy gate. **Positioning:** the free magazine is the top-of-funnel teaser for the paid motion outputs (print can't move, play music, or carry the Pakanta song) — carry a soft in-book "See this day in motion — your SDE film" CTA + dashboard upsell; measure attach via `lib/add-on-stats.ts`. Free-book-drives-paid-film attach is an owner decision, not an accident. |
| **Save-the-Date maker** | Shared templated-render aesthetic + Clean Editorial palette/monogram identity. | — |

### Build order (Claude Code time, not human-months)

| Phase | Scope | Depends on | Estimate |
|---|---|---|---|
| **P0 — Kwento table** | `photo_messages` migration: polymorphic `(source_table, source_id)` anchor (NOT the broken `photos(photo_id)` FK), RLS Pattern B, `guest_visible_messages()` SECURITY DEFINER RPC, `author_publicly_hidden` + `print_consent` + consent-version columns. Apply via `supabase db push` from a clean worktree (migrations don't auto-apply on main). | owner blesses `photo_messages` as canonical | ~0.5–1 day |
| **P1 — Magazine MVP (Variant A · photo + storyline · NO Kwento)** | fontkit + TTFs; `lib/kwento-magazine.ts` (flow/pagination engine as its own sub-item; chapter generator; full-bleed + grid slots; pull-quote stub); clock-skew-normalized `captured_at` UNION + gap-primary bucketer + ordinal labels; route (auth/RLS/sharp/JPEG/bounded-concurrency/maxDuration/`/Lang`); `assembleStoryFrame()`; role_palette + Animated-Monogram raster; Drive-copy push; one-tap generate. **Ships today off shipped infra — answers the owner's ask.** | shipped infra only | ~3–5 days |
| **P2 — Kwento weave** | Four-layer join + `kwentoCard` + attribution via `photo_tags` + "Mga Boses" quote-wall + "earns its photo a slot" rule. | P0 | ~2 days |
| **P3 — Curation UX** | Auto-compile + couple editor (rename/merge/reorder/split, gap slider, hero/cover swap, photo add/remove, hide-Kwento, audience toggle, live preview, edition nudge) + guest-side print-consent disclosure. | P1 + P2 | ~2–3 days |
| **P4 — Variant B (shareable)** | Audience picker, fail-closed `wall_safe_r2_key` path + route assertion, photo-consent veto, `author_publicly_hidden` + consent-for-print filters, `magazine_renders` invalidate-on-erasure + short-TTL link, warm notice. | **wall-screening + FaceBlock-derivative pipeline (unbuilt)** + **consent-text amendment** + owner sign-off — calendar-bound | ~2–3 days Claude time + external dependency |
| **P5 — Async render at scale + Print-on-demand** | `after()`/`waitUntil` + R2 store + email link for large events; CMYK/300dpi/bleed press-prep; page-count + spine + back-cover spec; PH POD partner + paid SKU + redistribution-consent gate. | partner onboarding, price | ~2–4 days Claude time + partner calendar |

**Recommended sequence:** P1 ships the free, beautiful, couple-private photo + storyline magazine NOW. P0 + P2 add the Kwento soul. P3 polishes. P4 (shareable) waits on the face/screening pipeline + the consent amendment. P5 monetizes via print.

### Acceptance criteria

- One-tap generate produces a complete, downloadable A4 PDF — never a blank editor; auto-bucketed chapters in `captured_at` order, auto-heroes, no half-empty dividers.
- The book opens with the couple's prologue (FRAME) and closes with "Salamat," with the day's chronology as the SPINE between them; the two timelines never conflate.
- `ñ`, accented Latin, curly quotes, and Taglish render correctly (fontkit + TTF); emoji gently stripped; Kwento text is real selectable/searchable text, never rasterized; `/Lang` set from `story_language`.
- Variant A reads only unblurred masters that are `moderation_state='clean'`; it exposes **no** share/email/upload affordance; a deleted guest is purged from any stored Variant-A artifact + export ZIP.
- Variant B reads ONLY `wall_safe_r2_key` where `moderation_state='clean' AND wall_safe_r2_key IS NOT NULL`; the route throws if any resolved key equals an `r2_object_key`; a photo with ANY `photo_consent=FALSE` tagged guest is dropped; an untagged raw photo never enters a shareable file; a FaceBlocked / unresolved author's Kwento is fully suppressed (not merely un-attributed); only post-approval, post-7-day-window Kwentos with print-consent render.
- A generated shareable PDF is tracked in `magazine_renders` and re-flagged stale when a guest later revokes consent / face-data / sets FaceBlock.
- Every approved Kwento renders somewhere (beside its photo, a promoted anchor, or the "Mga Boses" wall) or is auditable as suppressed for a privacy reason.
- Large events render off the request path → R2 → email link without timing out / OOMing; the finished PDF lands in the couple's Drive-copy folder.

### What it does NOT do in V1

- No public link / social posting / commercial redistribution without the separate (b)-scope redistribution consent (and POD print is gated on it).
- No print-on-demand fulfilment, no CMYK press-prep, no paid SKU (P5 / deferred).
- No translation of guest Kwentos (verbatim only); no per-render AI (bucketing + copy are deterministic, LLM-free).
- No editing of a guest's words (couple include/exclude only).
- No full PDF/UA tagging (structure tree, image alt text) — V1 floor is `/Lang` + real text + logical order.
- No automated face matching / blur derivatives — Variant B blocks on that unbuilt pipeline; until then only Variant A ships.

---

## Acceptance criteria

This iteration is shippable when all of the following are true:

- 3 Papic (₱1,499) and 5 Papic (₱2,499) tiers visible in checkout, purchased via the V1 apply-then-pay flow (static BDO + GCash, manual reconciliation per 24-hr SLA)
- Per-template purchase at ₱49 in the template browse flow
- Native iOS 16+ and Android 11+ apps install via App Store / Play Store deep links from the seat-claim QR
- Rear camera only — front camera entirely disabled in capture mode; no UI surface to flip
- Photos never written to the phone's native camera roll by default; opt-in toggle works on both platforms
- Gesture shutter triggers the four capture modes correctly with distinct haptic feedback
- Persistent orientation indicator transitions green ↔ amber as the phone tilts past 30°
- Last-5 captures strip surfaces the most recent 5 captures with retag / delete / favorite affordances
- Storage meter, upload queue chip, monogram dot, and settings cog visible in the top bar
- 20% battery warning + manual handoff QR works end-to-end (tested by manually draining a papic phone battery)
- 10-tag cap enforced; truncation warning sheet allows the paparazzo to swap names
- Untagged photos still arrive in the couple's gallery in full resolution
- Couple gallery shows the four V1 filters and the 7-day review window with bulk hide
- Personal Reel render produces 1080×1920 H.264 MP4 in 30-90 seconds; templates pull from the 400-template library
- Custom Monogram Pack (purchased via 0011) replaces Setnayan logo on photo exports, reel intro/outro, and gallery chrome within 5 seconds of purchase
- Face-blur opt-out from RSVP applies in the gallery for tagged photos
- "My contributions" post-event view available to each paparazzo
- Admin regenerate-seat-token works from support dashboard
- **Pro Camera Bridge add-on (`pro_camera_bridge_addon`, ₱1,499) visible in checkout, multi-purchase, binds to a specific papic seat at spend-time**
- **Pairing flow** completes for at least one body per supported brand (Canon EOS R-series, Nikon Z-series, Sony α-series, Fujifilm X-series) on both iOS 16+ and Android 11+, in ≤ 90 seconds end-to-end
- **Gesture shutter** triggers the paired DSLR's shutter (tap = still, drag-up = still+flash, drag-right = 5 s clip, chord = 5 s clip with light) with parity to the phone-internal path
- **Live View pass-through** from the DSLR renders in the phone's viewfinder at ≥ 24 fps with Setnayan's UI chrome overlaid
- **Disconnect fallback** — when DSLR WiFi drops, the phone returns to its internal camera within 3 seconds and the gesture shutter keeps firing; reconnect is automatic
- **Face vector cache** downloads on seat claim (≤ 30 seconds) and refreshes every 5 minutes during the event
- **Auto-tag confidence ≥ 0.85** writes `photo_tags(source='auto_face')` and surfaces the tag chip on the photo immediately
- **Suggested tags 0.65–0.85** appear in the last-5 strip with a "?" chip; tapping confirms or rejects
- **EXIF / QuickTime metadata** present on every download — `DateTimeOriginal`, `GPSLatitude`/`GPSLongitude` (when available), `Make`/`Model` (when paired), Setnayan's `UserComment` JSON / `com.setnayan.capturecontext` atom
- **Outbound share** strips geo EXIF on the rendered share copy; the original on R2 retains it
- **Geofence sanity check** drops geo metadata when capture coordinates are > 50 km from the event venue
- **Adaptive compression mode** switches strong/medium/weak as bandwidth changes, with anti-oscillation hysteresis of 30 s minimum dwell time
- **Offline queue** drains correctly after a sustained 10-minute network blackout simulated at the device level
- **Couple-level geolocation toggle** in event settings, default ON, flips all subsequent capture geo fields to null when disabled

---

## Open questions

- Whether to ship a "Roving Papic" service tier (Setnayan-staffed photographer alongside the seat program) — listed as deferred in master spec Part 6, but V2 candidate worth scoping.
- Whether to fold the Photo Center curator role into V1.1 or wait for V1 launch data on whether couples actually need real-time tag curation.

---

## Companion specs and cross-references

- `10_Papic_Feature_Specification.md` — full Papic master spec, single source of truth.
- `0011_panood/` — registers the `event.custom_monogram_unlocked` flag this iteration consumes.
- `0034_payments_and_cart/` — apply-then-pay flow, cart + checkout + screenshot reconciliation, service-activation hooks (replaces the retired 0003 token wallet).
- `0001_creating_guest_list/` — guest data model the QR tagging consumes (provides guest_id, table assignment, RSVP profile photo).
- `0002_qr_invitation_system/` — personal QR delivery to guests at RSVP.
- `14_Music_Catalogue_Cowork_Playbook.md` — music catalogue and template library used by the Personal Reels render pipeline.
- `CLAUDE.md` — decision log including the 2026-05-08 Papic pricing alignment, gesture shutter lock, rear-only constraint, and Custom Monogram Pack scope.

---

[View this iteration's HTML mockup](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan%20App/0012_papic/0012_papic.html)

[View this iteration's Word document](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan%20App/0012_papic/0012_papic.docx)
