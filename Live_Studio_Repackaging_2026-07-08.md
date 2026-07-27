# Live Studio (Panood) — Repackaging & ₱0-Cost Architecture (2026-07-08)

> **🚫 SUPERSEDED 2026-07-25/26 — HISTORICAL, kept for lineage only. Do NOT quote its prices, tiers, or camera caps.** Live Studio is now ONE SKU `LIVE_STUDIO` **₱2,999/event-day**; there is **no Mobile/Desktop split** and **no 3/8 camera cap** (ceiling is `MAX_ROAM_ZONES` = 12 for everyone; the paywall is publication, not cameras). Current canon: [`Live_Studio_Unified_Spec_2026-07-25.md`](Live_Studio_Unified_Spec_2026-07-25.md) § 1 + `Pricing.md` § 00.
>
> _(Original 2026-07-08 header, preserved:)_ **Owner-locked this session (2026-07-08).** Canonical model **as of that date** for Live Studio packaging, caps, device split, offline behaviour, and the save/stream architecture. **Supersedes** the single ₱3,499/day multicam tier and the "Camera Bridge included free" line, and **defers the server-mixer / LiveKit infra plan** in [`Panood_Multicam_Architecture_2026-06-26.md`](Panood_Multicam_Architecture_2026-06-26.md) out of V1. Internal SKU key `PANOOD_SYSTEM` unchanged; display name "Live Studio".

## 1. Tiers (per day)

| Tier | Price/day | Connectivity | Cameras | Live-video outputs | Photo-wall / Live-bg | Controls |
|---|---|---|---|---|---|---|
| **Free** | ₱0 | online | 1 | — (own event-page feed) | — | none |
| **Mobile Controller** | **₱1,500** ⚠ | **must be online** | up to 3 | 1 | unlimited | switch · overlay · adjustable split |
| **Desktop Controller** | **₱2,500** ⚠ | **can be fully offline** | up to 8 | ~5 | unlimited | full controller |
| **Camera Bridge (DSLR)** — independent SKU | **₱500 flat, event-wide** ⚠ | — | (counts vs cap) | — | — | DSLR ingest |

> ⚠ **Prices above are the owner's 2026-07-17 per-service sheet — ✅ NOW IN CODE.** Mobile **₱1,299 → ₱1,500** · Desktop **₱2,499 → ₱2,500** (DECISION_LOG 2026-07-17; owner confirmed 2026-07-20). Shipped as **PR #3425**, migration `20270827190298_live_studio_price_1500_2500.sql` (idempotent + post-condition guard). ⏳ **Still needs `supabase db push --db-url "$SUPABASE_DB_URL"` to reach prod** — merging the file does not apply it.
>
> **On the round numbers:** these intentionally depart from the 2026-05-12 charm-pricing (-1 endings) convention. The 07-17 sheet is systematically round across the catalog — including **Monogram Pro ₱999 → ₱1,000**, an explicit move *off* a charm price — so this is a deliberate re-basing, not a slip. **The charm convention no longer governs Live Studio.** (A 2026-07-20 pass briefly set Mobile to ₱1,499 citing the charm lock; that was an error — it enforced a 2026-05-12 convention against a newer owner decision, and was reverted same-day.)
>
> **Flat ₱1,500 for BOTH tiers was considered and is NOT recommended** — at parity every couple with a laptop takes Desktop (more cameras + offline, same price), so Mobile becomes dead inventory and the net effect is a ₱1,000 price cut on Desktop plus a dead SKU. It would also price **offline operation — the one capability no competitor has — at zero.** Owner decision still open. Camera Bridge **₱500 flat, event-wide** is unchanged and confirmed against market evidence (vs a ₱3,000–5,000 extra-operator line). ⚠ **₱500, not ₱499** — owner round-up 2026-07-11 (`Pricing.md`); ₱500 is what prod carries. Rationale + competitive teardown: [`Live_Studio_Competitive_and_Pricing_2026-07-20.md`](Live_Studio_Competitive_and_Pricing_2026-07-20.md).

- **Free = "just stream":** 1 camera → the couple's own live feed on their event page, **ephemeral / not saved**, ₱0 to run (peer-to-peer).
- **Cameras bundle into the version** — no per-camera fee. The cap (3 / 8) is both the paywall and the anti-abuse limit.
- **Camera Bridge** = an **independent standalone SKU** (`CAMERA_BRIDGE`, **₱500 flat, event-wide** · owner 2026-07-08, rounded ₱499→₱500 on 2026-07-11) — decoupled from Papic and Live Studio, works with either; unlocks DSLR / external cameras. Consolidates the old "Pro Camera Sync" ₱1,499 + "Pro Camera Bridge" ₱1,500/seat. When used with Live Studio, a bridged DSLR **counts as one of the N cameras**, not +1 over cap.
- **Annual Streaming · ₱19,999/yr (Desktop tier)** — unlimited Desktop-controller days across all events on the account. **Pro / coordinator / venue-oriented** (break-even ~8 days vs the ₱2,500/day rate; couples doing 1–3 event-days are cheaper à-la-carte). ₱0 to serve under the client-side + OBS model → pure margin.

## 2. Save vs stream — the two intents

- **Just stream (free / local):** ephemeral, nothing stored — by design (light-privacy: no server in the path, no consent flow needed).
- **Facebook Live (added 2026-07-20):** supported as a **documented OBS destination**, not an in-app integration — RTMPS is RTMPS, so the couple pastes a Facebook stream key instead of a YouTube one into the same OBS setup capturing the same Program pop-out. **₱0 engineering, no API, no app review.** ⚠ The UI **must warn that Facebook auto-deletes live replays after 30 days** (Meta policy effective 2026-02-19 — the ceremony replay self-destructs a month after the day; YouTube retains indefinitely). Facebook gates: account ≥60 days old · Page/professional profile ≥100 followers. An in-app Facebook path is **not** recommended — it needs App Review **plus Business Verification**, vs YouTube's ~10-day sensitive-scope review with no fee. This softens the old **"YouTube as sole delivery"** lock to **"YouTube as sole *in-app* delivery; Facebook via OBS."** See [`Live_Studio_Competitive_and_Pricing_2026-07-20.md`](Live_Studio_Competitive_and_Pricing_2026-07-20.md) § 6.
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
- ~~Camera Bridge scoping~~ — **RESOLVED 2026-07-08**: it's an **independent standalone `CAMERA_BRIDGE` SKU** (**₱500** flat event-wide · rounded from ₱499 on 2026-07-11), decoupled from Papic + Live Studio; consolidates the old "Pro Camera Sync" ₱1,499 + "Pro Camera Bridge" ₱1,500/seat.
- Camera cap **8** to be validated by the walking-skeleton test (the *recommended* number may land at 5–6 even if the cap stays 8).
- Whether a smooth in-app YouTube relay (no OBS) is wanted in V1.5 (reintroduces per-event compute).

## 9. Public route

The public **live watch page** is **`/u/[user-slug]/[event-slug]/live`** — a sub-route of the couple's event page under the 2026-07-08 public-URL scheme ([`Public_URL_Architecture_2026-07-08.md`](Public_URL_Architecture_2026-07-08.md)). This is the **viewer** page (the composited feed / YouTube embed); the operator **controller** is a separate authenticated route. ⚠ Depends on the platform migrating events from the shipped flat `/[slug]` to `/u/[user]/[event]` — see the routing doc (owner-to-accept: event-QR breakage + redirects).

## 10. Build progress & what's next (2026-07-09 · handoff)

Implementation is underway in the platform repo (`apps/web`), shipped as flag-gated PRs. **All real-video work is behind `NEXT_PUBLIC_PANOOD_STREAMING_ENABLED` (default OFF)** — inert in prod until a 2-device test passes (owner picked "build behind the flag, test all at once").

### ✅ Shipped (merged / auto-merging)
- **Pricing** — PR #2928 (two device tiers on `/pricing`, DB-applied + **live**) + #2932 (Mobile row display fix). Live at the time: Desktop ₱2,499/day · Mobile ₱1,299/day, both "In build" — **superseded 2026-07-20 → ₱2,500 / ₱1,500** (PR #3425); still "In build". Renamed Panood → **Live Studio** on the public surface.
- **Walking skeleton** — PR #2934: one real phone camera → the control room's PROGRAM monitor over WebRTC. Generalized the proven demo transport into `lib/panood-webrtc.ts` (channel `panood-rtc:{eventId}`, dynamic `cam{index}` slots).
- **Camera caps** — PR #2940: 8 (Desktop) / 3 (Mobile) / 0 (free) provisioned on paid-order approval via `lib/sku-activation.ts` (`panoodCameraCapForSku`). Hard cap: the claim RPC binds only EXISTING cameras.
- **Source multiview** — PR #2942: every publishing camera shows live in the control-room rail (desktop + mobile), not just PROGRAM.

### ⏭ Next (in order)
1. **PR #4 · OBS "Program output" pop-out** — a chrome-less program surface OBS window-captures (so the couple pushes the composited feed to their own YouTube). ⚠ Must be a **child pop-out window that SHARES the parent control-room's live MediaStreams** (via `window.opener`) — the one-viewer transport can't open a second WebRTC connection (it'd steal the phone's stream). Operator keeps controlling in the main window while OBS captures the pop-out.
2. **PR #5 · Adjustable split cam** — client-side side-by-side composite in the PROGRAM monitor with a draggable divider (the composited output the OBS pop-out then captures). Client state (second source + ratio); no server change for the visual.
3. **PR #6 · Offline (Desktop tier)** — replace cloud Supabase-Realtime signaling with a **venue-local signaling server** on the laptop. The hardest piece (new infra; needs a real offline rig to validate). Media already flows P2P on the LAN; only the handshake needs localizing.
4. **Phase 4 · URL migration** — vendors→`/[slug]`, events→`/u/[user]/[event]`, live→`/u/[user]/[event]/live`. ⚠ OWNER-GATED: breaks existing event QR codes; needs explicit OK + redirects + a vendor-slug blocklist. See `Public_URL_Architecture_2026-07-08.md`.
5. **Gate · flip to buyable** — change the two SKUs "In build" → purchasable ONLY after a real non-wedding event test (the couple's-unrepeatable-day ladder).

### 🔑 Owner actions blocking progress
- **2-device test** of the shipped controller: set `NEXT_PUBLIC_PANOOD_STREAMING_ENABLED=true`, open the control room on a laptop + a claimed camera link on a phone (same Wi-Fi), tap the camera → its feed should appear live. Validates the whole transport before #4–#6 build on it.
- **Phase 4 QR-breakage acceptance** (when we reach the URL migration).

### 🧭 Key technical notes for the next session
- Real transport = `apps/web/lib/panood-webrtc.ts` (STUN-only, no TURN, nothing stored). **One publisher → one viewer per slot** — the transport does NOT fan out to multiple viewers (relevant for the OBS pop-out: it must share the opener's streams, not reconnect).
- Camera-operator flow: `/panood/cam/[token]` (publisher) · control room `dashboard/[eventId]/studio/panood/broadcast/` (viewer). Flag helper `panoodStreamingEnabled()` in `lib/panood-camera-seats.ts`.
- Free tier ≠ operator seats: it's the couple's own device → YouTube (single-cam · `studio/panood/setup/` + `lib/panood-youtube.ts`, which is fully wired, only blocked on Google verified-app review).
- Work off `origin/main` in a worktree; migrations via `pnpm migration:new` (never hand-typed round timestamps — push-blocked). Prices are DB-driven (`platform_retail_catalog_v2`); DB is applied via `supabase db push` and `$SUPABASE_DB_URL` is present in the shell env.
