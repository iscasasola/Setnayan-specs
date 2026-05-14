# Pro Camera Bridge — Compatible Camera List

> Single canonical list of every DSLR / mirrorless body Setnayan's Pro Camera Bridge supports. Companion to `0012_papic.md` and `0012_papic_sdk_notes.md`. Last revised **2026-05-11**.

The Pro Camera Bridge (₱1,500 per DSLR seat, multi-purchase, shared SKU with 0011 Panood) pairs one phone seat to one camera body over WiFi using the vendor's official SDK. The phone keeps every responsibility it had in V1 — gesture shutter, tag drawer, face detection, EXIF stamping, adaptive compression, offline queue, upload — but the optical capture surface moves to the camera body.

**Compatibility status legend**

| Status | Meaning |
|---|---|
| **V1** | Ships at launch. Tested against this body in Setnayan's lab kit. |
| **V1 (path)** | Works in V1 via the body's legacy WiFi protocol (slower than modern SDK path). |
| **V1.1** | Deferred — requires a separate sub-bridge implementation that costs additional engineering. Decision pending. |
| **V2** | Deferred — needs USB tether or a transport Setnayan doesn't ship in V1 (WiFi-only). |
| **Not supported** | No public SDK / WiFi remote-shutter path exists. |

---

## Canon — EOS Camera Connect SDK (V1) + legacy CCAPI (V1.1)

WiFi 5 GHz preferred (full-frame mirrorless), 2.4 GHz fallback (APS-C). Flash control: E-TTL via SDK. Approval timeline: 2–3 weeks.

| Body | Status | WiFi | Flash via SDK | Notes |
|---|---|---|---|---|
| EOS R5 | V1 | 5 GHz | Yes (E-TTL) | Lab reference body |
| EOS R5 Mark II | V1 | 5 GHz | Yes | |
| EOS R6 | V1 | 5 GHz | Yes | R6 Mk I has a shutter-buffer firmware bug — bridge handles |
| EOS R6 Mark II | V1 | 5 GHz | Yes | Lab reference body (in Setnayan's kit) |
| EOS R7 | V1 | 2.4 GHz | Yes | APS-C init path |
| EOS R8 | V1 | 5 GHz | Yes | |
| EOS R10 | V1 | 2.4 GHz | Yes | APS-C init path |
| EOS R50 | V1 | 2.4 GHz | Yes | APS-C init path |
| EOS RP | V1 | 2.4 GHz | Yes (built-in flash) | |
| EOS R3 | V1 | 5 GHz | Yes | |
| **EOS M50** | **V1.1** | 2.4 GHz | Pair-time only | Legacy CCAPI sub-bridge — not the modern SDK |
| **EOS M50 Mark II** | **V1.1** | 2.4 GHz | Pair-time only | Same CCAPI path as M50 |
| **EOS M6 Mark II** | **V1.1** | 2.4 GHz | Pair-time only | Same CCAPI path |
| EOS 5D Mark IV | V2 | 5 GHz | No | DSLR mirror body — different SDK family entirely; not on V1.1 roadmap yet |
| EOS 6D Mark II | V2 | 2.4 GHz | No | Same DSLR-family deferment |
| EOS 90D | V2 | 2.4 GHz | No | Same |

**Why M-series is V1.1, not V1.** The M-series uses Canon's older **CCAPI** (Camera Control API) protocol, not the modern EOS Camera Connect SDK. They're two different SDKs that look superficially similar but have different auth flows, different live-view formats, and different trigger commands. Treating them as a single Canon adapter would push a lot of branching logic into hot paths. The clean path is a separate `CanonLegacyBridge` sub-class that V1.1 enables — same `CameraBridge` interface, separate implementation.

**Engineering cost to bring M50 / M50 II / M6 II into V1:** ~1 sprint of engineering for the CCAPI sub-bridge, plus a body in the test rig. Flash control will remain pair-time only (CCAPI doesn't expose per-shot flash) — paparazzi using M50s won't be able to toggle the Drag-Up "photo with flash" gesture mid-session; flash is decided at pairing.

---

## Nikon — SnapBridge SDK (V1) + MTP-WiFi (V1 path)

WiFi 2.4 GHz only on SnapBridge path. Flash control: set at pair time (SDK limitation). Approval timeline: 1–2 weeks.

| Body | Status | WiFi | Flash via SDK | Notes |
|---|---|---|---|---|
| Z 9 | V1 | 2.4 GHz | Pair-time | Flagship mirrorless |
| Z 8 | V1 | 2.4 GHz | Pair-time | Cleanest video clip implementation |
| Z 7 II | V1 | 2.4 GHz | Pair-time | |
| Z 6 III | V1 | 2.4 GHz | Pair-time | Lab reference body |
| Z 6 II | V1 | 2.4 GHz | Pair-time | ~500 ms videoStart latency — bridge compensates |
| Z 5 II | V1 | 2.4 GHz | Pair-time | |
| Z fc | V1 | 2.4 GHz | Pair-time | BT pairing token expires after 24 h inactivity — re-pair flow |
| Z 50 | V1 | 2.4 GHz | Pair-time | |
| Z f | V1 | 2.4 GHz | Pair-time | |
| D850 | V1 (path) | 2.4 GHz (MTP) | No (manual on body) | MTP-WiFi — JPEG transfer 800 ms–1.5 s |
| D780 | V1 (path) | 2.4 GHz (MTP) | No | MTP-WiFi |
| D750 | V1 (path) | 2.4 GHz (MTP) | No | MTP-WiFi — slow |
| D500 | V1 (path) | 2.4 GHz (MTP) | No | MTP-WiFi |
| D7500 | V1 (path) | 2.4 GHz (MTP) | No | MTP-WiFi |

**D-series caveat:** the MTP-WiFi path works but is materially slower than mirrorless. Don't promise sub-500 ms shutter-to-WAL on these bodies. Couples expecting "instant" gallery delivery should be told that D-series paparazzi will see ~1.5 s lag between capture and gallery upload.

---

## Sony — Camera Remote SDK (V1)

WiFi 5 GHz primary; 2.4 GHz fallback on older APS-C. Flash control: per-shot via SDK. Approval timeline: **3–6 weeks (slowest of the four — start day-one of Sprint 0)**. Strictest "one consumer at a time" rule — closing Sony's Imaging Edge app before pairing is mandatory.

| Body | Status | WiFi | Flash via SDK | Notes |
|---|---|---|---|---|
| α1 | V1 | 5 GHz | Yes | Burst mode throttled to 3 fps via SDK |
| α1 II | V1 | 5 GHz | Yes | |
| α7 IV | V1 | 5 GHz | Yes | Lab reference body |
| α7 V | V1 | 5 GHz | Yes | |
| α7R V | V1 | 5 GHz | Yes | |
| α7R IV | V1 | 5 GHz | Yes | |
| α7 III | V1 | 5 GHz | Yes | 30-min live-view disconnect bug — bridge reconnects pre-emptively |
| α7S III | V1 | 5 GHz | Yes | Low-light champion |
| α7C II | V1 | 5 GHz | Yes | |
| α7C R | V1 | 5 GHz | Yes | |
| α6700 | V1 | 2.4 GHz | Yes | Lab reference body |
| α6400 | V1 | 2.4 GHz | Yes | |
| FX3 | V1 | 5 GHz | Yes | Cinema body |
| FX30 | V1 | 5 GHz | Yes | |
| ZV-E1 | V1 | 5 GHz | Yes | Vlogger body |
| ZV-E10 II | V1 | 2.4 GHz | Yes | Sometimes returns 720p live view instead of 1080p — bridge upscales |

---

## Fujifilm — Camera Remote SDK (V1)

WiFi 5 GHz primary on modern bodies; 2.4 GHz fallback on older X-series. Flash control: per-shot via SDK (X100VI exception). Approval timeline: 2 weeks. Concurrent app sessions OK (different from Sony).

| Body | Status | WiFi | Flash via SDK | Notes |
|---|---|---|---|---|
| **X-T5** | **V1** | 5 GHz | Yes | **Lab reference body — Setnayan's primary Fuji test rig.** Firmware 2.x changed live-view JPEG format; bridge handles |
| X-T4 | V1 | 5 GHz | Yes | |
| X-T3 | V1 (path) | 2.4 GHz | Yes (older flash semantics) | Older body, slower transfer |
| X-S20 | V1 | 5 GHz | Yes | Same firmware-2.x JPEG change as X-T5 |
| X-S10 | V1 | 2.4 GHz | Yes | |
| X-H2 | V1 | 5 GHz | Yes | |
| X-H2S | V1 | 5 GHz | Yes | |
| X-H1 | V1 (path) | 2.4 GHz | Yes | Older body |
| X-Pro3 | V1 | 5 GHz | Yes | |
| X-T30 II | V1 | 2.4 GHz | Yes | |
| GFX 100 II | V1 | 5 GHz | Yes | Medium-format — 102 MP, RAW ~120 MB; bridge queues RAW separately |
| GFX 100S | V1 | 5 GHz | Yes | |
| X100VI | V1 | 5 GHz | **No (leaf shutter)** | Fixed 35mm-equivalent lens; leaf-shutter flash semantics differ — flash falls back to no-flash with a tip toast |
| X100V | V1 | 5 GHz | No (same leaf-shutter reason) | |

---

## Phone-internal camera (V1)

The phone-internal camera is implemented as a fifth `CameraBridge` adapter so the gesture shutter, last-5 strip, tag drawer, and face detection don't need to branch on "is there a DSLR paired?". Every phone Setnayan supports for the Papic native app (iOS 16+ / Android 11+) is automatically V1 for the phone-internal path. Pro Camera Bridge SKU is only required to pair an external body.

---

## Not supported (any version)

These don't have public SDKs or WiFi remote-shutter protocols Setnayan can build against:

- Canon DSLRs in the **EOS 1D / 1Dx** line (no consumer WiFi SDK — pro tethered shooting uses a different stack)
- Canon **G-series** point-and-shoots
- Nikon **Coolpix** point-and-shoots
- Sony **RX100** series (no Camera Remote SDK support on most)
- Panasonic Lumix bodies (separate SDK ecosystem — not in V1 scope; possible V2)
- Olympus / OM System bodies (separate SDK; possible V2)
- Pentax / Ricoh bodies (no consumer remote SDK)
- Any film camera (obviously)
- Action cameras (GoPro, DJI Osmo, Insta360) — different category, not "DSLR Pro Camera Bridge"
- Smartphone cameras OTHER than the paparazzo's own seat phone (covered by the seat itself, not the bridge SKU)

---

## Quick answer flowchart for support questions

When a couple or paparazzo asks "does my body work with Setnayan?":

1. **Is it in the V1 table above?** → Yes, works at launch.
2. **Is it in the V1.1 / V2 table?** → Not at launch; communicate the roadmap status.
3. **Is it a model not on either list?** → Treat as "not supported" by default. If the model is newer than May 2026 and is in a brand Setnayan supports (Canon mirrorless / Nikon Z / Sony α / Fuji X), file an issue in the SDK-update backlog. Vendor SDKs are quarterly-refreshed; the body likely lands in V1.1 or V1.2.

---

## Maintenance ritual

This file is the **single source of truth** for compatible bodies. When any of the following change, this file updates first, then the changes propagate to the HTML mockup cards and the SDK notes:

- A new body is added to a vendor's SDK support matrix → add to V1 / V1.1 / V2 column with notes.
- A body's firmware update breaks the bridge → add a row in Notes.
- A V1.1 body is brought into V1 → move row, update CLAUDE.md decision log.
- A body is dropped → mark as "deprecated YYYY-MM" rather than deleting.

Quarterly review aligned with the SDK-version refresh ritual in `0012_papic_sdk_notes.md`.
