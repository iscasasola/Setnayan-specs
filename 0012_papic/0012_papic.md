# Iteration 0012 — Papic

**Iteration number:** 0012
**Topic:** Papic feature, V1
**Surface:** Couple-side → Setnayan Web Dashboard · **Bottom-nav tab: In-App Services** · Couple URL: `setnayan.com/dashboard/[event-id]/services/papic` (gallery + seat purchase) · Paparazzo-side: native iOS / Android apps (separate)
**Builds on:** 0000 (app shell, sign-in, event-scoped URL, In-App Services launcher), 0001 (guest data, role taxonomy, `photo_consent`), 0002 (personal QR delivery), 0008 (table QR for fan-out tagging), 0011 (Custom Monogram Pack flag), 0034 (Payments & Cart — Papic seat purchases route through `service_orders` apply-then-pay)
**Status:** Drafted 2026-05-09 · revised 2026-05-10 (DSLR Pro Camera Bridge + face-detection auto-tag + EXIF/geo metadata + adaptive compression) · token-wallet language purged 2026-05-12 (now PHP-native via 0034)
**Companion specs:** `10_Papic_Feature_Specification.md`, `0011_panood/`, `0034_payments_and_cart/`, `0001_creating_guest_list/`, `0002_qr_invitation_system/`

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
