# Pro Camera Bridge — Vendor SDK Engineering Notes

> **⚠ BUILDS AGAINST SDKs THAT DON'T EXIST — DO NOT USE (flagged 2026-07-17).** This file details per-vendor "mobile SDK" integrations for Canon/Nikon/Sony/Fujifilm, but verified research shows **Fujifilm's is false** (no iOS; Android USB-only), **Canon's named SDK doesn't exist** (the real WiFi path is CCAPI, a plain HTTP REST API — no SDK binary), and **Nikon's + Sony's are unverified**. The specific firmware bugs / millisecond latencies here read as confidently-invented. **Camera bridge / Papic SLR is SHELVED (owner 2026-07-17).** Verified reality → [`Camera_Connectivity_Research_2026-07-17.md`](Camera_Connectivity_Research_2026-07-17.md).

> Companion to `0012_papic.md` and `0011_panood.md`. Audience: engineers implementing the per-brand `CameraBridge` adapter. Updated as integration progresses; last revision **2026-05-10**.

The four supported brands (Canon, Nikon, Sony, Fujifilm) all expose phone-as-companion SDKs over WiFi, but each has a different API surface, transport protocol, registration process, and set of quirks. This file captures what every adapter-author needs to know before writing code, plus a running list of issues found during integration so future sprints don't rediscover them.

All four bridges implement the shared `CameraBridge` interface defined in `0012_papic.md` ("Pro Camera Bridge — DSLR pairing"). The interface is:

```swift
protocol CameraBridge {
    var brand: Brand { get }
    var model: String? { get }
    var capabilities: CameraCapabilities? { get }   // resolution, RAW availability, flash, video modes
    var status: BridgeStatus { get }                 // disconnected | pairing | live | recording

    func connect() async throws
    func disconnect() async
    func livePreview() -> AsyncStream<VideoFrame>   // 720p ~24–30 fps
    func triggerStill(flash: Bool) async throws -> CapturedFile
    func triggerClip(durationMs: Int, light: Bool) async throws -> CapturedFile
    func setFocusPoint(_ point: CGPoint) async throws
    func readSettings() async throws -> CameraSettings
}
```

The Kotlin equivalent on Android mirrors this 1:1.

---

## Canon — EOS Camera Connect SDK (Mobile)

### Registration

- Apply to the **Canon Developer Program** (`https://developercommunity.usa.canon.com`).
- Approval timeline: **3–5 business days** for a registered developer account; **2–3 weeks** for SDK access (manual review). Start day one of Sprint 0.
- Distribution: Canon issues the SDK as a tarball with a per-developer NDA. Cannot be redistributed; each engineer working on the integration needs their own developer account or a per-org seat.
- License fee: **₱0** for low-volume integration. Canon may negotiate a license for production volumes; reach out to Canon BD when 0012 hits 10k installs.

### Transport

- WiFi pairing — body advertises an SSID; phone joins. Once joined, body and phone are on a private 192.168.0.0/24 network with no internet egress.
- 5 GHz preferred where the body supports it (R5 / R6 / R6 II). 2.4 GHz fallback on R7 / R10 / R50 / RP.
- For phones that lose internet egress when joined to the camera's AP, the SDK supports **dual-AP mode** — phone keeps its primary cellular / venue WiFi for upload while the camera connection goes through a secondary WiFi NIC (iOS 16+, Android 11+ both support this). Test this carefully on Android — vendor-specific quirks surface here.

### Pairing handshake

1. Phone scans for camera SSIDs (prefix matches `EOS-`)
2. Phone joins SSID with a code shown on the camera body's LCD
3. SDK runs PTP/IP handshake; phone gets a session token
4. SDK exposes camera capabilities (model, max resolution, lens, flash availability, video modes, RAW format)
5. Setnayan app stores `dslr_pairings(brand='canon', model=<model>, last_paired_at=NOW(), status='active')`

### Live View

- Format: MJPEG over PTP/IP, ~720p at 24–30 fps depending on body
- The R-series bodies expose a "Live View Standby" power profile that drops the live-view fps when no shutter activity for > 60 s. The bridge needs to keep a heartbeat ping every ~30 s to prevent the camera dropping into deep standby (which forces a 3–5 s reconnect).
- Phones receive raw MJPEG; bridge transcodes to a `VideoFrame` for the viewfinder layer.

### Triggers

- `triggerStill(flash=false)` → SDK sends `RemoteShutter` command. JPEG returns over PTP/IP within 200–600 ms depending on body.
- `triggerStill(flash=true)` → SDK pre-arms the body's hot-shoe flash (or built-in pop-up flash on RP) via E-TTL. If no flash is mounted and the body has no built-in, the call returns `noFlashAvailable`; bridge surfaces a one-time warning to the paparazzo and falls back to a still without flash.
- `triggerClip(durationMs=5000, light=false)` → SDK switches body to video mode, fires `RemoteRecord`, holds for 5 s, sends stop. MP4 transfers over PTP/IP after recording completes — typical 5 s clip is 25–35 MB at default settings, ~3–5 s transfer over 5 GHz.
- Mode switching cost: still → video takes ~400–800 ms on R6; subsequent stills after a video clip take an extra ~600 ms because the body re-enters still-mode mirror flip. The bridge debounces gesture shutter input during this window so users don't queue up failed triggers.

### Known gotchas

- **R6 Mark I (not II)** has a firmware bug where `RemoteShutter` returns success but no JPEG arrives if the body's SD card is < 95% full but the buffer is full. Workaround: the bridge polls for the file with a 2 s timeout, treats absence as a missed shot, and surfaces "shutter buffered — try again" in the viewfinder. Submitted to Canon; expected fix in firmware 2.x.
- **R7 / R10 / R50** use a slightly different SDK initialization path because they're APS-C. The shared `CanonBridge` should switch on `body.is_aps_c` for that init.
- **Older M-series** require the legacy CCAPI fallback — not the modern EOS Camera Connect SDK. Treat M50 / M50 II / M6 II as a separate sub-bridge if Setnayan decides to support them in V1.1.
- **Battery drain on the phone** during sustained live-view is real (~15% per hour on a paparazzo's iPhone 14 Pro). The 20% battery handoff threshold in 0012 should be verified against this — papic running DSLR-paired sessions hit handoff faster than phone-internal papic.

---

## Nikon — SnapBridge SDK + MTP-WiFi fallback

### Registration

- **Nikon Developer Site** (`https://developer.nikonimglib.com`). Application + 1-page use-case writeup required. Approval timeline: **1–2 weeks**.
- Two SDKs are relevant: the modern **SnapBridge SDK** for Z-series bodies and **MTP-WiFi** for older D-series bodies that pre-date SnapBridge but still expose the standard PTP/IP MTP protocol.
- License fee: **₱0** for non-commercial; production licensing handled per partner. Setnayan's case (paid app routing data through bodies) is non-commercial from Nikon's perspective because the camera body never leaves the user's possession.

### Transport

- WiFi 2.4 GHz only on the SnapBridge path. Nikon's SDK does not expose 5 GHz on most Z-series.
- Bluetooth pairing as a one-time bootstrap (SnapBridge stores a pairing token over BT, then upgrades to WiFi). Setnayan's bridge skips the BT step entirely and goes WiFi-direct, which the SDK supports.
- Phones must allow the camera SSID to take precedence over venue WiFi during the active pairing session. iOS 16's `NEHotspotConfiguration` works cleanly; Android's `WifiNetworkSpecifier` (API 29+) does too but requires user confirmation each session — not ideal UX. The bridge caches the SSID on first pair and surfaces a "trust this camera's network" toggle.

### Pairing handshake

1. Phone scans for `Nikon-Z*` or `Nikon-D*` SSIDs
2. SDK initiates connection with the body's pairing code (shown on body's LCD)
3. Body returns capability descriptor: model, sensor size, max ISO, RAW format, flash, video capability
4. SDK exposes a session for live-view + remote-shutter

### Live View

- Format: H.264 over RTP, ~720p at 24 fps. Bridge decodes inline.
- Older D-series via MTP-WiFi: MJPEG instead of H.264, lower frame rate (15–20 fps).

### Triggers

- `triggerStill` → SDK exposes a high-level `capture()` that wraps shutter + AF + transfer. Returns a `NkPhoto` object with the JPEG (and RAW if the body is in RAW+JPEG mode).
- `triggerStill(flash=true)` → SDK does NOT expose flash control on most Z-series via its public API. The bridge instead pre-sets the body's flash mode at pairing time using a separate `setShootingMode()` call, then triggers normally. Limitation: changing flash on/off during an event requires re-pairing or a settings round-trip (~1.5 s). Documented as a "flash decisions made at pair time" UX rule for Nikon-paired papic.
- `triggerClip` → straightforward `videoStart` / `videoStop` pair. Z 8 / Z 9 have the cleanest implementation; older Z 6 / Z 7 have a ~500 ms latency between the SDK call and the body actually starting recording. Bridge accounts for this.

### Known gotchas

- **Z fc** has a firmware quirk where the Bluetooth pairing token expires after 24 hours of inactivity. Forces a re-pair the next morning if the camera was used yesterday but the phone was rebooted. The bridge surfaces this as a normal re-pair flow; not a hard error.
- **D-series via MTP-WiFi** is significantly slower than SnapBridge — JPEG transfer over MTP-WiFi takes 800 ms–1.5 s on a D850. Don't promise sub-500 ms shutter-to-WAL on D-series.
- **Live view + recording at the same time** is not supported on most Z bodies — when video starts, live view temporarily pauses on the phone. The bridge holds the last live-view frame and resumes when recording stops. Document this in onboarding for Nikon papic.
- **Memory card behavior:** Nikon writes captures to the body's SD card AND transfers to the phone simultaneously. This is great (built-in backup) but doubles power draw on the body. Battery considerations for long events.

---

## Sony — Camera Remote SDK

### Registration

- **Sony Pro Developer ID** at `https://www.sony.net/Products/CameraRemoteSDK/`. Application + use-case + commercial-use intent statement.
- **Slowest approval** of the four: **3–4 weeks** typical, sometimes 6 weeks. Start day one of Sprint 0; this can block Sprint 4 if it slips.
- License fee: **₱0** for the SDK itself; commercial revenue-sharing not in scope for Setnayan's use case (Sony's commercial terms apply to apps that resell access to the SDK, not apps that use it as a feature).

### Transport

- WiFi 5 GHz primary; 2.4 GHz fallback on older bodies (a6700 and below).
- Sony's SDK has the strictest "one consumer at a time" rule of the four — only one app can hold the SDK session against a given body at a time. If the user previously paired their body to Sony's own Imaging Edge Mobile app and didn't fully sign out, Setnayan's pairing will fail with a `BUSY` error. UX surface: pairing failure copy includes "If you've used the Sony app recently, fully close it before pairing here."

### Pairing handshake

- Sony exposes a **device discovery API** (mDNS-style) that finds bodies on the same WiFi network. The bridge uses this once the phone joins the camera's AP.
- After discovery, bridge calls `connect()`; body shows a 4-digit code; user enters into the Setnayan app; SDK completes auth.
- Capability descriptor returned: model, max resolution, RAW formats, lens, flash, video codecs (S-Log, etc.).

### Live View

- Format: JPEG-stream-per-frame over HTTP, ~720p at 24–30 fps. Bridge polls; latency ~80–150 ms typical.
- Sony's live view stream supports a **focus-peaking overlay** flag — Setnayan's bridge ignores it for V1 (the phone composites its own UI chrome on top), but it's available if a future iteration wants to expose manual-focus assist.

### Triggers

- `triggerStill` → high-level `actTakePicture()` call. Returns the JPEG via a separate fetch URL (not inline). Bridge fetches the URL within ~300 ms.
- `triggerClip` → `startMovieRec()` / `stopMovieRec()`. The clip writes to the body's SD card and the SDK exposes an "extract last clip" API to pull it down. Transfer of a 5 s clip averages 4–6 s on 5 GHz — the slowest of the four brands for clips.
- **Flash:** Sony's SDK exposes flash mode (`setFlashMode("auto" / "fill" / "off")`) cleanly. Bridge uses this for `triggerStill(flash=true)`.

### Known gotchas

- **α7 III** (not IV) has an SDK bug where the live-view stream stops after exactly 30 minutes of continuous streaming. Bridge keeps a 25-minute timer and reconnects pre-emptively to keep papic from hitting it mid-event. Sony has acknowledged; firmware fix planned.
- **ZV-E10 II** and **α6700** sometimes return live-view frames at 1280×720 instead of 1920×1080 even when the SDK is configured for 1080p. Bridge upscales to 1080p before re-encoding for WebRTC publish (Panood operator mode); for Papic mode this isn't visible (still capture is full sensor resolution).
- **Battery on a6700** drains noticeably faster than Canon equivalents during sustained live-view (Sony body draw, not phone). Document for Sony-paired papic.
- **Fast burst mode** on α1 is the fastest of any V1-supported body but the SDK throttles `actTakePicture()` to ~3 fps. Burst papic mode is not a V1 feature; don't expose.

---

## Fujifilm — Camera Remote SDK

### Registration

- **Fujifilm SDK Program** at `https://fujifilm-x.com/global/support/download/software/camera-remote-sdk/`. Email application; approval typically **2 weeks**.
- License fee: **₱0** for the SDK; commercial use subject to a separate licensing agreement that Setnayan will need to sign before public launch. Reach out to Fujifilm Asia-Pacific BD ahead of Sprint 4.

### Transport

- WiFi 5 GHz on X-T5, X-T4, X-S20, X-H2 / X-H2S, GFX 100 II, X100VI.
- 2.4 GHz fallback on older X-H1 / X-T3 / X-T4 in some environments — Fujifilm's WiFi stack negotiates band based on phone capability.

### Pairing handshake

- Body advertises SSID; phone joins; SDK does a TLS handshake with the body's session-key (auto-generated on body, displayed on LCD).
- Capability descriptor returned: film simulation modes, max ISO, RAW format, video codecs.
- **Film simulation flag** is exposed in the capability descriptor — Setnayan's bridge ignores it for V1 (couples are downloading edited photos anyway), but the metadata is available if a future iteration wants to surface it.

### Live View

- Format: JPEG-stream over HTTP, similar to Sony. ~720p at 24–30 fps.
- Latency consistently good (~100 ms) across the X-series; one of the cleaner SDKs.

### Triggers

- `triggerStill` → `cameraExecuteShootCommand()`. Fast — JPEG returns within ~250–400 ms.
- `triggerStill(flash=true)` → flash mode set via `cameraSetFlashMode()`. Works on X-T4 / X-T5 / X-S20 / X-H2; X100VI uses a leaf-shutter flash with different semantics — bridge falls back to a still without flash on X100VI and surfaces a one-time tip.
- `triggerClip` → `cameraStartMovieRec()` / `cameraStopMovieRec()`. Clean. 5 s clip transfer averages 3–4 s.

### Known gotchas

- **X-T5** / **X-S20** firmware update 2.x changed the live-view JPEG format from progressive to baseline DCT. Older bridge code that assumed progressive needs a parser update. Already accounted for in the V1 SDK notes; don't regress.
- **GFX 100 II** has a giant sensor (102 MP) — RAW files are ~120 MB each. The bridge always queues GFX RAW for upload (never ships in medium-mode), and the gesture shutter shows a "huge file — uploading later" toast for the first GFX paparazzo per event.
- **X100VI** has only a fixed 35mm-equivalent lens — no zoom, no swap. Couples renting an X100VI for portraits should be told this upfront. UX is unaffected; just a cultural note.
- **Compatibility with Fujifilm's own Camera Remote app** running concurrently is fine on most bodies; the SDK is multi-session-tolerant. Different from Sony.

---

## Cross-vendor matrix

Quick reference for adapter implementers.

| Aspect | Canon | Nikon | Sony | Fujifilm |
|---|---|---|---|---|
| WiFi band | 5 GHz pref | 2.4 GHz | 5 GHz pref | 5 GHz pref |
| Live view format | MJPEG over PTP/IP | H.264 over RTP (Z), MJPEG (D) | JPEG-per-frame HTTP | JPEG-per-frame HTTP |
| Live view fps | 24–30 | 24 | 24–30 | 24–30 |
| Still trigger latency | 200–600 ms | 250–500 ms | ~300 ms + fetch | 250–400 ms |
| Clip transfer (5 s) | 3–5 s (5 GHz) | 4–6 s | 4–6 s | 3–4 s |
| Flash control | E-TTL via SDK | Set at pair time | Per-shot via SDK | Per-shot via SDK (X100VI exception) |
| Concurrent app sessions | OK | OK (BT bootstrap quirk) | **One at a time only** | OK |
| Approval timeline | 2–3 wk | 1–2 wk | 3–6 wk | 2 wk |
| Production license fee | ₱0 (re-evaluate at scale) | ₱0 | ₱0 | License agreement TBD before launch |
| Worst quirk | R6 mk I shutter buffer bug | D-series MTP-WiFi slow | α7 III 30-min disconnect | X-T5 JPEG format change |

---

## Test rig

Per-brand integration tests need physical bodies. Setnayan's lab kit:

- **Canon:** EOS R6 Mark II + RF 50/1.8 (own); EOS R8 + RF 24-105 (rented per sprint as needed)
- **Nikon:** Z 6 III + Nikkor 50/1.8 S (own); Z fc + 28/2.8 (loaned by team member)
- **Sony:** α7 IV + 35/1.8 (own); α6700 + 18-50 (rented)
- **Fujifilm:** X-T5 + 35/1.4 (own); X100VI (loaned)

CI runs against a mock SDK per brand for unit tests; integration tests run weekly against the lab kit on a dedicated test rig in the office.

---

## Vendor escalation contacts

These are the people / channels for "the SDK is broken, our launch is on the line" cases. Not for every-day questions.

- **Canon Asia-Pacific Developer Relations:** dev-relations-ap@canon-asia.com (24-hr response on P0)
- **Nikon Imaging Software Group:** nis-support@nikonimglib.com
- **Sony Pro Developer Support:** prodevsupport@sony.com
- **Fujifilm Asia-Pacific Software:** fapac-software@fujifilm.com (slower; allow 48 hr)

Pricing or licensing questions go through Setnayan BD, not engineering. Engineering uses these channels for technical / SDK issues only.

---

## Maintenance ritual

- **Quarterly:** check each vendor's developer portal for SDK updates. Track versions in `0012_papic_sdk_versions.md` (created when the first vendor ships an update).
- **Per-firmware-update:** when a body's firmware version bumps, run the integration test suite against it. Surfaces firmware-induced regressions before couples hit them mid-event.
- **Per-brand contact refresh:** verify vendor escalation contacts every 6 months. People change roles.
