# Live Studio (Panood) — Repackaging & ₱0-Cost Architecture (2026-07-08)

> **Owner-locked this session (2026-07-08).** Current canonical model for Live Studio packaging, caps, device split, offline behaviour, and the save/stream architecture. **Supersedes** the single ₱3,499/day multicam tier and the "Camera Bridge included free" line, and **defers the server-mixer / LiveKit infra plan** in [`Panood_Multicam_Architecture_2026-06-26.md`](Panood_Multicam_Architecture_2026-06-26.md) out of V1. Internal SKU key `PANOOD_SYSTEM` unchanged; display name "Live Studio".

## 1. Tiers (per day)

| Tier | Price/day | Connectivity | Cameras | Live-video outputs | Photo-wall / Live-bg | Controls |
|---|---|---|---|---|---|---|
| **Free** | ₱0 | online | 1 | — (own event-page feed) | — | none |
| **Mobile Controller** | **₱1,299** | **must be online** | up to 3 | 1 | unlimited | switch · overlay · adjustable split |
| **Desktop Controller** | **₱2,499** | **can be fully offline** | up to 8 | ~5 | unlimited | full controller |
| **Camera Bridge (DSLR)** — independent SKU | **₱499/day flat** | — | (counts vs cap) | — | — | DSLR ingest |

- **Free = "just stream":** 1 camera → the couple's own live feed on their event page, **ephemeral / not saved**, ₱0 to run (peer-to-peer).
- **Cameras bundle into the version** — no per-camera fee. The cap (3 / 8) is both the paywall and the anti-abuse limit.
- **Camera Bridge** = an **independent standalone SKU** (`CAMERA_BRIDGE`, ₱499/day flat, event-wide · owner 2026-07-08) — decoupled from Papic and Live Studio, works with either; unlocks DSLR / external cameras. Consolidates the old "Pro Camera Sync" ₱1,499 + "Pro Camera Bridge" ₱1,500/seat. When used with Live Studio, a bridged DSLR **counts as one of the N cameras**, not +1 over cap.
- **Annual Streaming · ₱19,999/yr (Desktop tier)** — unlimited Desktop-controller days across all events on the account. **Pro / coordinator / venue-oriented** (break-even ~8 days vs the ₱2,499/day rate; couples doing 1–3 event-days are cheaper à-la-carte). ₱0 to serve under the client-side + OBS model → pure margin.

## 2. Save vs stream — the two intents

- **Just stream (free / local):** ephemeral, nothing stored — by design (light-privacy: no server in the path, no consent flow needed).
- **Save it → YouTube:** both paid tiers include **YouTube Live via the couple's own OBS** (OBS window-captures the control-room browser → RTMP → their channel). **YouTube auto-records the VOD and serves unlimited viewers, both ₱0 to Setnayan.** There is **no server-side recorder** in V1. "The video the couple keeps" otherwise flows through the Papic / highlight pipeline, not the live feed.
- **OBS does NOT replace the controller — it's only the output pipe.** All production (switching · overlays · split cam · moments) happens in **our** controller, which composites the Program feed client-side. OBS simply **window-captures the controller's Program output** and emits RTMP (the one thing a browser can't). The couple never switches cameras or builds scenes in OBS — they set it once (capture the Program window + paste their YouTube stream key → Start Streaming) and forget it. This is **not** the retired "mix inside OBS" fallback; Setnayan's controller is the whole experience, OBS is invisible during the event. **Build note:** the controller must expose a **clean fullscreen "Program output" pop-out** (no UI chrome) as the capture surface.

## 3. Devices — one responsive codebase, two layouts

- **Mobile version** = focused operator view (bottom tab bar: Moments · Cameras · Walls · Sound · Replays; tap-to-cut; thumb-zone go-live). Phone compute + screen → 3 cameras / 1 live output.
- **Desktop version** = full director board (Program/Preview two-bus + routing grid + audio mixer). Laptop compute + screen → 8 cameras / ~5 live outputs.
- The 3-vs-8 gap is driven by device power **and** screen real estate pointing the same way. **Not two builds — one responsive controller.**

## 4. Offline model (the local-first pivot — owner-approved 2026-07-08)

Two halves that get conflated:

- **Network (the hotspot):** cameras + controller + screens on one local WiFi (venue router, a travel router, a phone hotspot, or the laptop's hotspot). Video flows P2P over the LAN — the video itself needs no internet.
- **Signaling (the handshake):** the connect step. **Cloud today** (Supabase Realtime) → needs a trickle of internet. **True offline** replaces it with a **local signaling server hosted on the laptop** → the Desktop version.

Therefore:

- **Mobile = must be online** (hybrid) — a phone can carry the LAN but can't host local signaling; a phone hotspot with cellular supplies the trickle.
- **Desktop = can be fully offline** — the laptop is both the control room and the local signaling host. Cleanest kit: **laptop + a cheap travel router** (more reliable than a phone hotspot, which often has client isolation).

## 5. Cost — the whole V1 is ₱0 marginal cost to Setnayan

- **Local controller:** composites **client-side in the browser** (the 2026-07-03 demo path) → no server → ₱0.
- **YouTube:** the couple's OBS does the WebRTC→RTMP bridge → ₱0 relay to us; YouTube stores + serves free.
- **Recording:** YouTube's own VOD → ₱0. (R2 recording would be only ~₱6–10/mo storage but is **not** used in V1.)
- **Consequence:** the LiveKit-cloud-vs-self-host infra fork + server-mixer plan are **deferred out of V1**, preserving the ₱0-marginal-cost lock the server-relay plan was about to break. A smooth in-app (no-OBS) YouTube relay is the one thing that would reintroduce per-event compute — a V1.5 decision, not V1.

## 6. Anti-abuse

- **Cameras — hard cap at the claim token** (`max_claims` = tier count: 1 free / 3 mobile / 8 desktop). Wedding-scoped; no cross-event reuse. No per-camera fee, so the cap is purely protective + the version paywall.
- **Outputs — soft cap ~6** for live-manageability. Photo-wall + live-background render **locally on the wall device** (₱0 load); only **live-video outputs** (mirror / independent-camera) load the control device — those are the limited ones.
- **Duration — runaway-live guard** (auto-stop on disconnect + max-duration) caps stream length; count caps don't.

## 7. Controller feature set (from 2026-06-26, still valid)

Switch cam · overlays (monogram + frame + lower-third) · **adjustable split cam** (manual side-by-side / PIP with a paced divider — new, owner-locked 2026-07-08) · highlights (mark → live replay + post-event reel) · Moment-Director macros · routing grid (any source → any output) · walls (photo-wall / mirror / live-background / off) · audio meters. Console UI zones + research: [`Panood_Multicam_Architecture_2026-06-26.md`](Panood_Multicam_Architecture_2026-06-26.md).

## 8. Open / to-confirm

- ~~Annual Streaming re-basing~~ — **RESOLVED 2026-07-08**: re-based to the **Desktop tier** (unlimited Desktop-controller days, all events on account; pro/coordinator-oriented) — see § 1.
- ~~Camera Bridge scoping~~ — **RESOLVED 2026-07-08**: it's an **independent standalone `CAMERA_BRIDGE` SKU** (₱499/day), decoupled from Papic + Live Studio; consolidates the old "Pro Camera Sync" ₱1,499 + "Pro Camera Bridge" ₱1,500/seat.
- Camera cap **8** to be validated by the walking-skeleton test (the *recommended* number may land at 5–6 even if the cap stays 8).
- Whether a smooth in-app YouTube relay (no OBS) is wanted in V1.5 (reintroduces per-event compute).

## 9. Public route

The public **live watch page** is **`/u/[user-slug]/[event-slug]/live`** — a sub-route of the couple's event page under the 2026-07-08 public-URL scheme ([`Public_URL_Architecture_2026-07-08.md`](Public_URL_Architecture_2026-07-08.md)). This is the **viewer** page (the composited feed / YouTube embed); the operator **controller** is a separate authenticated route. ⚠ Depends on the platform migrating events from the shipped flat `/[slug]` to `/u/[user]/[event]` — see the routing doc (owner-to-accept: event-QR breakage + redirects).
