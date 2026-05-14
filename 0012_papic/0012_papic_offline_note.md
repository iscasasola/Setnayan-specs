# 0012 — Papic (placeholder)

**Status:** Empty placeholder folder. Full spec to be drafted in a follow-up session. Foundation already exists in `10_Papic_Feature_Specification.md` (the higher-level product spec).

When this iteration is fleshed out, **the spec MUST include an "⚠️ Important — Offline behavior" section** addressing the following:

## Papic must work end-to-end at venues with weak or no internet

Filipino wedding venues frequently have spotty WiFi, brownouts, or dead-zone cellular signal. The Papic feature is the most demanding offline use case in Setnayan because it captures photos/clips, tags guests, and uploads continuously throughout the event.

## Mandatory offline patterns the spec must cover

### 1. Pre-event sync (24–48 hours before)

When the papic seat is claimed and the app is connected, the device downloads:
- **Full guest list** (id, full name, role, table assignment, personal_qr_token decoded)
- **Table list** (table id, name, table_qr_token decoded)
- **Couple's branding** (monogram SVG, palette, frame style for any in-app overlays)
- **Event metadata** (start/end times, schedule blocks)

Stored in local SQLite. On every launch with connectivity, the app re-syncs to pick up RSVP changes and last-minute additions.

### 2. Capture queue (already specced in CLAUDE.md, formalize here)

Every photo / clip capture writes to local SQLite WAL with a `pending_upload` flag. A background uploader (BGTaskScheduler on iOS, WorkManager on Android) PUTs each item to R2 via signed URL. Failed uploads are retried with exponential backoff. The visible UI shows a persistent "📡 47 items syncing" badge.

### 3. Local QR resolution (no backend roundtrip)

When a paparazzo scans a guest's QR or table's QR, the app resolves the token-to-guest_id mapping **locally** using the cached guest list. No internet required. Tag intents are written to local SQLite with the captured photo's local id and queued for upload.

### 4. Tag fan-out at upload time

When the photo successfully uploads to R2, the queued tag intents are sent in the same payload. The backend then performs the tag fan-out (table-tag → all guests at that table, capped at 10 total tags per photo per CLAUDE.md). If only the photo upload succeeds and the tag write fails, retry logic ensures eventual consistency.

### 5. Conflict resolution

Photos uploaded out of order (because of intermittent connectivity) are timestamped client-side at capture time, not server-side at receive time. Gallery sort uses client capture time.

### 6. Visible offline UX

The papic app's status bar shows one of: `✓ Online · synced`, `📡 Offline · X items queued`, `🔄 Syncing X of Y...`. The paparazzo always knows nothing is lost.

### 7. Local-network fallback (deferred / V1.5)

In extreme cases (zero WAN, multiple papic devices at the venue), devices could mesh via Bluetooth/AirDrop to share captured photos so at least one device with eventual cellular reaches the cloud. Defer to V1.5 unless real-world testing reveals it's needed for V1.

## Real-time photo pool view (guest-facing) — degraded mode

Guests viewing the live photo gallery on their phones can see only what's already cached. New uploads from papic require both ends to have connectivity. The gallery shows a "📡 Reconnecting — X new photos pending" banner when it can't reach the server. When any one device reconnects, that device syncs and other guests' devices may still be offline.

## BackgroundSyncQueue primitive

The pre-event-sync + queued-writes + retry pattern wants to live as a generic `BackgroundSyncQueue` abstraction in the native apps. **0012 should ship this primitive** so:
- Iteration 0001's door check-in feature can plug into it (retroactively documented in 0001's offline-behavior section)
- Iteration 0011's Panood local-recording can plug into it
- Future event-day features inherit it for free

## Build sequence

- **Requires:** 0001 (events, guest list, role taxonomy), 0002 (QR system — papic scan tokens to resolve guests), 0003 (token wallet for SKU purchase), 0004 (invitation widgets for the gallery view embed and template purchase flow), 0005+ (LED Background may consume capture metadata).
- **Provides:** BackgroundSyncQueue primitive (consumed by 0001's door check-in retrofit, 0011 Panood, future event-day features); papic photo flow (consumed by 0009 Photo Delivery for cloud archival).

---

*Full spec to be drafted in a follow-up session. This file exists only to preserve the offline-behavior requirements between sessions so they don't get lost.*
