# 0011 — Panood (placeholder)

**Status:** Empty placeholder folder. Full spec to be drafted in a follow-up session.

When this iteration is fleshed out, **the spec MUST include an "⚠️ Important — Offline behavior" section** addressing the following:

## Panood cannot run fully offline (by definition)

Streaming requires real-time upstream bandwidth. There is no architecture that lets a wedding be broadcast to remote guests while the venue has no internet. This is a fundamental constraint, not an engineering oversight.

## Mandatory mitigations the spec must cover

1. **Pre-event venue connectivity check.** A "Venue Check" PWA tool the couple/coordinator runs at the venue ahead of time — tests upload speed, latency, cellular signal strength. Returns a green/yellow/red verdict. Yellow/red triggers the recommendation below.

2. **Recommended portable 4G/5G hotspot SKU.** When a couple buys the Panood SKU, surface a "Recommended add-on: Portable 4G/5G hotspot · ₱500/event · we partner with [vendor]" prompt. This becomes a Setnayan-recommended accessory or a partner-fulfilled SKU.

3. **Local recording fallback.** If the upstream stream drops mid-event, the streaming device's app must auto-fallback to local recording on its phone storage. When connectivity returns (could be hours later, after the wedding), the app uploads the locally-recorded chunks to backfill the stream timeline. Remote guests see "📡 Reconnecting — your stream will resume" until the upload catches up.

4. **In-app signal strength warnings.** The Panood control surface continuously monitors upstream throughput and displays a clear status: "✓ Streaming · 1080p · 4.5 Mbps", "⚠ Degraded · falling to 720p", "🔴 Offline · recording locally". The couple/coordinator sees the status throughout.

5. **Service catalog token pricing.** Panood SKU registers in `service_catalog` (iteration 0003) with its PHP price; spent from the couple's token wallet via the standard spend primitive.

## Build sequence

- **Requires:** 0001 (events, dashboard, R2), 0002 (invitation site renderer for the public stream-view page), 0003 (token wallet for SKU purchase), 0004 (invitation widgets for embedding stream links).
- **Provides:** stream playback embed for downstream pages; recording → R2 archive that 0009 Photo Delivery can push to the couple's Google Drive.

---

*Full spec to be drafted in a follow-up session. This file exists only to preserve the offline-behavior requirements between sessions so they don't get lost.*
