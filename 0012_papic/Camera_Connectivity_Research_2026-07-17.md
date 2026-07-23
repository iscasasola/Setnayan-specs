# Camera Connectivity — Verified Research (2026-07-17) · Papic SLR SHELVED

> **Status: Papic SLR / external-camera bridge is SHELVED (owner 2026-07-17) — "let's not connect those cameras for now, do it some other time."** This doc preserves the verified reality so the feature restarts from truth, not the stale SDK docs.
>
> **Source:** deep-research harness, 103 agents, ~6.9M tokens, 994 tool calls, **3-vote adversarial verification per claim** against primary vendor sources. **⚠ This SUPERSEDES `0012_papic_compatible_cameras.md` + `0012_papic_sdk_notes.md`, which are substantially WRONG** (see below) — do NOT build against those two until corrected.

## The spec docs were wrong

The existing camera docs assumed four third-party **mobile WiFi SDKs** with "1–6 week approvals." Verified verdict:

| Spec claimed | Truth (verified) |
|---|---|
| Canon **"EOS Camera Connect SDK"** | **Name doesn't exist.** Canon ships EDSDK (desktop/USB-only) + **CCAPI** (the real WiFi path). "Camera Connect" is Canon's consumer app. |
| Fujifilm **"Camera Remote SDK"** | **FALSE (3-0).** Real product = Camera Control SDK: **no iOS**, Android = **USB-only**, WiFi is desktop-only — **and using it voids the camera warranty.** |
| Nikon **"SnapBridge SDK"** | **UNVERIFIED** — not disproven, not confirmed. Nikon wireless is mostly **PTP/IP (binary, not HTTP)**. |
| Sony **"Camera Remote SDK"** | **UNVERIFIED.** The official Camera Remote SDK is **desktop-only**; but a **retired HTTP "Camera Remote API"** (mobile, WiFi, JSON-RPC) may still live in older-body firmware. |

The "54 bodies, 1–6 week approvals" list is unreliable. Uniform-approval framing is wrong both ways (GoPro = zero approval; Fujifilm/Panasonic = no mobile-WiFi path to approve at all).

## What actually connects (verified)

**Ungated — no approval:**
- **GoPro / Open GoPro** *(strongest, 3-0 ×4)* — MIT, public GitHub, "no application needed." WiFi HTTP: trigger + media download. HERO9 · 10 · 10 Bones · 11 · 11 Mini · 12 · 13 · MAX 2 · LIT HERO · MISSION 1 · 1 Pro.
- **Insta360 (OSC path)** — ungated (no appId/secret). ONE X · ONE X2 · ONE R · ONE RS · X3 · X4 · X5.
- **Ricoh THETA** — Google OSC open spec. A1 · X · Z1.

**Gated but real:**
- **Canon CCAPI** *(3-0)* — genuine WiFi HTTP REST for third-party phone apps ("CCAPI = wireless, EDSDK = wired," Canon Europe). **~25 bodies, incl. 4 DSLRs: 90D · Rebel T8i · Rebel SL3 · 1D X Mark III (WFT-E9 only).** ⚠ **5D Mark IV & 6D Mark II ABSENT — permanent gap** (CCAPI launched Feb 2019; only newer bodies get it). **Blocker:** one-time **desktop + USB activation per body** (Canon Activation Tool, Win/Mac) — a phone cannot self-activate; can't onboard an unactivated body at the venue. Only 5 ship pre-activated (R1, R5 II, R6 III, PowerShot V10, R50V).
- **Insta360 SDK** — ~3 working days + issued appId/secretKey.

**Not possible:** Fujifilm (no iOS; Android USB-only; voids warranty) · Panasonic/Lumix (official SDK Windows-only, beta, **no WiFi transport**) · DJI Osmo Action/Pocket (MSDK V5 = Android + **drones only**).

**Unknown — needs a second pass:** all **Nikon** (PTP/IP lead) + all **Sony** (retired HTTP Camera Remote API lead) = **30 bodies** unresolved.

## The better architecture for pros (not researched-to-completion): FTP push

For interchangeable-lens pros, **"camera pushes to our server via FTP" beats "our app pulls via SDK":**
- Most pro bodies (Canon/Nikon/Sony) have **built-in FTP transfer** — camera auto-uploads each JPEG as shot. **Brand-agnostic** (FTP is a standard, no per-vendor code), reaches the Nikon/Sony/Canon-DSLR bodies CCAPI misses (incl. 5D IV via transmitter), and pros already use it for live sports delivery.
- **Setnayan builds:** FTPS ingest endpoint + per-event credentials (routes each camera → the right gallery) + a watcher feeding the existing Papic pipeline. No per-brand code.
- **Tradeoffs:** fiddly on-camera setup · some bodies need a WFT/WT transmitter (cost/bulk) · needs **FTPS** (per-body support varies) · push-only (no trigger — fine) · venue-WiFi dependent unless a **local relay box** catches shots and forwards.
- **WiFi SD cards** = brand-agnostic budget path (any SD-slot body, transfer-only) — but the good ones (Eye-Fi, FlashAir) are **discontinued**; remaining cards are unreliable.

## Design decisions locked during this exploration (hold for when revisited)

- **Pricing (when built): ₱500 / camera · day** — a paired external camera as a tier, not an add-on.
- **Dual shutter:** phone can trigger AND the photographer's own shutter works — but the phone-shutter's only real use is a locked-off/tripod body (it fires blind).
- **NO live view** — dropped (it's the expensive/fragile half: streaming, heartbeats, ~15%/hr battery, screen contention). Just capture → transfer.
- **We pull the JPEG only; RAW stays on the SD card** (their archive). Keeps storage/margin sane. ⚠ RAW-only shooters produce no JPEG → extract the embedded preview JPEG, or force RAW+JPEG at pairing.

## Open for the second pass (before any build)

1. **Nikon + Sony** — verify PTP/IP (Nikon) and the retired HTTP Camera Remote API (Sony) per body. 30 bodies at stake.
2. **FTP** — per-body FTPS grid + which bodies need a transmitter.
3. **iOS USB-C** — recheck whether iOS 17/18 + USB-C iPhones opened any third-party accessory/UVC path (was the reason USB-PTP was ruled out).
