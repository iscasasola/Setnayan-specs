# Iteration 0011 — Panood

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - **Price split: site says ₱3,499/day, CODE ships ₱2,499/day.** Live site / ground truth = "Panood (Website Add-on) ₱3,499/day · In build · Token Worthy". Shipped code (`app/dashboard/[eventId]/add-ons/panood/page.tsx` + `lib/sku-catalog.ts`, `panood_daily_broadcast`) is still **₱2,499/day (centavos 249900)** — the live-site repricing to ₱3,499 has NOT landed in code. Annual Streaming = ₱19,999/yr in both. The site is authoritative on price; flag for owner to push the ₱3,499 update into `sku-catalog.ts`.
> - **SHIPPED surface** at `/dashboard/[eventId]/add-ons/panood/` with `page` + `setup` + `broadcast` + `reviews` routes; SKUs `panood_daily_broadcast` + `panood_annual_streaming` + AI-highlight add-ons (`ai_video_highlight_60s`, `ai_edited_highlight_3min`, `same_day_edit`). `panood_camera_sync` + `panood_annual_streaming_plus` are RETIRED in code (always-multi-cam pivot).
> - **Token Worthy** on the live site (vendor token economy is LIVE; burn-on-answer wired PR #1057). The "0003 wallet `spend()` primitive" this spec builds on is RETIRED — paid via 0034 apply-then-pay + manual admin approval.
> - The retired Cloudflare-Stream-Live composite architecture / Broadcast Style Pack sections below are correctly flagged as historical; V1 = BYO-YouTube.
> - **Cross-cutting:** commission 0% (no Setnayan Pay 3%).
>
> When this body disagrees with the above, **the above wins.**

> **⚠ LIVE-SITE RECONCILIATION 2026-06-04.** On setnayan.com/pricing this ships as **"Panood (Website Add-on)" · ₱3,499 / day · build state "In build" · Token Worthy** (livestream per day embedded on the event page). This supersedes the ₱2,499/day "Daily Broadcast" figure used below. SDE / Thank-You / AI-highlight add-ons are now Papic-anchored on the site (see 0012). Prices below are pre-reconciliation; canonical catalog is `Pricing.md § 0` + `Site_vs_Spec_Reconciliation_2026-06-04.md`.

**Iteration number:** 0011
**Topic:** Panood feature, V1 (WebApp track) — YouTube-delivered (promoted from V1.5+ on 2026-05-18)
**Surface:** Setnayan Web → Couple Dashboard · **Bottom-nav tab: Add-ons** · URL: `setnayan.com/dashboard/[event-id]/services/panood`
**Builds on:** 0000 (app shell, sign-in, event-scoped URL, Add-ons launcher), 0003 (apply-then-pay flow, `spend()` primitive)
**Status:** Drafted 2026-05-09 · revised 2026-05-09 (apparatus pricing + YouTube-only delivery) · revised 2026-05-10 (Pro Camera Bridge — DSLR feeds, shared SKU with 0012) · revised 2026-05-10 (broadcaster control surfaces — preview/program, audio rail, hold-to-end, mobile slide-to-end, keyboard shortcuts) · **revised 2026-05-16 (Architecture pivot: drop Cloudflare Stream Live composite + Setnayan master YouTube channel · couple BYO YouTube via OAuth · per-day pricing replaces base+add-ons · Broadcast Style Pack retired · see CLAUDE.md 4th 2026-05-16 row)**

> **2026-05-16 PIVOT NOTICE.** The Pricing section below is the **new** V1 SKU lock. The "Delivery architecture", "Pipeline", "Setnayan's master YouTube channel", "Broadcaster control surfaces", and "Broadcast Style Pack" sections further down describe the **prior** Cloudflare-Stream-Live composite architecture and are **retired in V1**. They are kept on disk for historical reference; the V1 build will read only the Pricing section + the new BYO-YouTube delivery model summarized below. Composite-dependent features (lower-thirds, scene cards, 4-mode broadcast styles, ffmpeg overlay) are NOT in V1 because the composite step is gone — couples wanting those use YouTube's own production tools or OBS-style apps writing to their YouTube.
**Companion specs:** `09_Panood_Feature_Specification.md`, `0003_token_wallet_and_packs/`, `0012_papic/`
**Successor iteration:** `0012_papic/` consumes the same shared monogram pack flag this iteration registers, and shares the `pro_camera_bridge_addon` SKU registered here.

---

## What this iteration ships

V1 (WebApp track) of Panood as defined in the master spec at `09_Panood_Feature_Specification.md`. (Promoted from V1.5+ on 2026-05-18; body references to "V1.5+" lower in the file that describe forward-looking enhancements — e.g. 7-8 cam ceiling for industry-event tiers, AI Highlight archive-fetch rescope — are intentionally preserved.) The architecture has been simplified along two axes since the original draft:

The first is a **pricing rule alignment**. Every Panood SKU now prices the Setnayan software tool the couple unlocks — camera-slot count plus capability set — never hours of coverage or human crew. Couples bring their own phones and recruit their own camera operators. The four DIY tiers (1–4) are the entire V1 lineup; the previously-listed crew-bundled Tiers 5–8 are out of V1 scope (they would violate the apparatus rule and CLAUDE.md already lists "Setnayan Roving service tier" as not in V1).

The second is a **delivery architecture simplification**. Viewer delivery happens entirely through YouTube. Setnayan ingests via Cloudflare Stream Live SFU and composites server-side, then RTMP-relays to YouTube on Setnayan's master channel. The couple's landing page embeds the YouTube IFrame Player as its video element. There is no Cloudflare Stream Player embed, no per-tier viewer cap, no Viewer Pack SKU.

Specifically, this iteration delivers:

- Four V1 pricing tiers, all DIY, all priced as apparatus
- WebApp camera operator client (browser-based, no install) — runs on any modern phone browser
- **Native iOS / Android camera-bridge companion app** — required only when a camera operator is pairing a DSLR to their phone for the broadcast. Reuses the same Papic binary from 0012 (one app, two modes — Papic capture or Panood camera operator). Phone-only operators continue to use the WebApp; no install required for them. See *Pro Camera Bridge — DSLR camera feeds* below.
- WebApp broadcaster client (multi-stream subscribe + grid UI with tap-to-switch) — runs on any modern browser; the broadcaster role is supported on **desktop, laptop, tablet, and mobile phone**, with the layout adapting to the viewport. Desktop/tablet is recommended (more screen for the camera grid); mobile is the fallback when no larger device is on-hand. See the HTML mockup for both layouts.
- Cloudflare Stream Live SFU integration for ingest with WebRTC publish
- Server-side ffmpeg compositor with monogram overlay support
- RTMP relay to YouTube Live as the **sole** viewer-delivery path
- YouTube IFrame Player embedded on the couple's landing page (delivery surface = YouTube CDN)
- YouTube auto-archive on Setnayan's master channel; the couple downloads the recording from their dashboard
- Custom Standby screens (countdown, transitions) — bundled into the Custom Monogram Pack
- Custom logo upload (PNG with transparency) — bundled into the Custom Monogram Pack
- AI Video Highlight add-on (₱999 per 60 seconds)

This iteration does NOT ship:

- A standalone native iOS / Android **Panood-only** app — DROPPED FROM V1. The phone-internal camera operator path stays pure WebApp + YouTube delivery, no install required. The native app surface that DOES exist in V1 is the **shared 0012 Papic binary** running in Panood camera-operator mode for operators who have purchased Pro Camera Bridge to pair a DSLR. That mode is detailed in the Pro Camera Bridge section below; the WebApp client remains the default for any operator not bridging a DSLR.
- Cloudflare Stream Player landing-page embed (replaced by YouTube IFrame Player)
- Per-tier viewer caps and any viewer-pack SKU (YouTube delivery is unbounded at zero marginal cost)
- The crew-bundled Tiers 5–8 from the original master spec (cut from V1; revisit as a separate "Setnayan Pro Services" line if the company decides to enter staffed video services later)
- The previous ₱999 Wedding Ceremony +3 hours add-on (cut)
- The standalone Facebook Live add-on (cut from V1; couples wanting Facebook can re-broadcast the YouTube stream themselves)
- Custom RTMP destinations beyond YouTube (V2)
- Self-hosted SFU (V2.5+ per locked architecture decision)
- Portable 4G/5G hotspot rental as a paid add-on (operations item; track for V1.1)

---

## Pricing — V1 SKU lock 2026-05-16 (BYO YouTube · per-day + Annual)

V1 Panood ships **four SKUs** under the BYO-YouTube architecture. Couple OAuths their own YouTube channel; Setnayan provides broadcaster orchestration (multi-cam UI + RTMP push of the active feed) + auto landing-page IFrame embed. **The composite step is gone**; YouTube does any compositing via its own multi-camera Live tools, or Setnayan's broadcaster UI just hands one active feed at a time to the couple's YouTube via standard RTMP from the operator-selected camera.

### V1 SKU table (locked 2026-05-16)

| SKU | `service_catalog.sku_code` | Price | Scope | Multi-purchase |
|---|---|---|---|---|
| **Daily Broadcast** | `panood_daily_broadcast` | **₱2,499 / day** | One day of **multi-cam (up to 6) broadcasting** to the couple's BYO YouTube · multi-cam is **always built-in** (locked 2026-05-17 V1 SKU lock) | Yes — couple buys one per event-day (prep · ceremony · reception are often 3 separate days) |
| **Annual Streaming** | `panood_annual_streaming` | **₱19,999 / year** | Multi-cam (up to 6) unlimited days for one year · **ALL events on the account** (vendor / competition-organizer / multi-event subscription) · `time_recurrence=annual`, `event_scope=all_events` | No — single subscription per account, renews annually |
| **Cam Bridge** | `panood_cam_bridge_slot_day` | **₱199 / slot / day** | DSLR-paired camera slot for the Panood broadcast feed (WiFi-SDK via Papic-binary native app) | Yes — buy N units = N slot-days |
| **Template Pack (per day)** | `panood_template_pack_daily` | **₱799 / day** | Unlocks overlays + titles + transitions on the broadcast output for one event-day · applies to phone-cam AND Cam-Bridge-DSLR feeds | Yes — one per day on which production styling is wanted |
| **Template Pack (per year)** | `panood_template_pack_annual` | **₱7,999 / year** | Overlays + titles + transitions · unlimited days for one year · ALL events on the account · pro-broadcaster pack | No — annual subscription |

**Retired same-day 2026-05-17 (collapsed into the always-multi-cam pivot):**

| SKU | Retired price | Reason |
|---|---|---|
| `panood_camera_sync_daily` | ₱99 / day | Multi-cam now built into Daily Broadcast — no separate add-on |
| `panood_annual_streaming_plus` | ₱3,999 / year | Multi-cam now built into Annual Streaming — no Plus tier |

**Max camera count enforced at infrastructure:** Cloudflare Stream Live SFU room config `max_publishers: 6` — couples physically cannot connect a 7th camera. Six is the practical Filipino-wedding sweet spot (typical 2–4 cams · premium 5–6) with stability headroom for phone-broadcaster + average home internet. The 7–8 cam ceiling discussed during the 2026-05-17 architecture review is reserved as a V1.5+ option for industry-event / competition tiers · not in V1.

Custom Monogram Pack (₱1,999) still applies for the landing-page chrome (event-page brand) but **no longer touches the broadcast video itself** — the couple sets their own YouTube channel branding inside YouTube Studio (channel watermark, lower-thirds via YouTube Live Producer, end-cards). Setnayan's landing page wraps the couple's `liveBroadcasts.id` in an IFrame embed and applies the couple's monogram + page chrome around it.

### Worked pricing examples

| What the couple wants | Calculation | Total PHP |
|---|---|---|
| Single-cam reception broadcast, 1 day | Daily Broadcast | **₱499** |
| Multi-cam reception broadcast, 1 day | Daily Broadcast + Camera Sync | **₱598** |
| Multi-cam coverage across 3 event-days (prep + ceremony + reception) | (Daily Broadcast + Camera Sync) × 3 | **₱1,794** |
| Vendor streaming portfolio events for a year (single-cam) | Annual Streaming | **₱2,999** |
| Vendor streaming portfolio events for a year (multi-cam) | Annual Streaming Plus | **₱3,999** |

### Retired SKUs (Cloudflare-composite era)

| Retired SKU | Old price | Retirement reason |
|---|---|---|
| `live_stream_base` | ₱2,499 | Cloudflare Stream Live composite no longer the V1 architecture |
| `live_stream_camera_addon` | ₱999 | Per-camera slot pricing replaced by per-day Camera Sync (₱99) |
| `live_stream_hour_addon` | ₱999 | Hour-based pricing replaced by per-day model (couples buy days, not hours) |
| `broadcast_style_pack` | ₱2,999 | News / Cinematic / Sports / Royalty + ffmpeg-overlay composites required the retired composite step; couples wanting style switching use YouTube's own production tools |

Pro Camera Bridge (DSLR pairing via 0012 Papic-shared SKU) is preserved as a 0012-side capability and can still pair a DSLR to one of the operator's phones for the Panood broadcast — the DSLR feed enters the Setnayan broadcaster UI as one of the multi-cam slots when Camera Sync is purchased.

AI Video Highlight (₱1,999/60s), **AI Edited Highlight (₱3,499/3min — repriced 2026-05-16 from prior conflicting values: Strategy B ₱2,999, charm pricing ₱4,999)**, and Same-Day Edit (₱24,999) are **preserved** but their data source shifts: they consume the **couple's YouTube archive via OAuth** rather than Cloudflare-Stream-recorded feeds. Engineering re-scope at V1.5+ build time will route their archive-fetch logic through the YouTube Data API instead of Cloudflare Stream's recording endpoints.

### Why this pricing structure

Three drivers. **First**, the BYO-YouTube model cuts the largest variable-cost line (~$1 per 1,000 streamed minutes × cameras × hours) to near zero by handing the composite + delivery + storage to YouTube at unbounded scale. **Second**, per-day pricing matches how Filipino weddings are actually scheduled (prep day at one venue · ceremony at another · reception at a third — each is a distinct broadcast day, not a continuous "stream capacity hour" pool). **Third**, the Annual SKUs open a vendor-side ARR line for vendors who livestream portfolio events year-round — break-even after ~6 days of use, attractive for wedding-coverage vendors who do 30+ events a year.

The architecture pivot also trims the V1 engineering surface by ~60% — no Cloudflare Stream Live ingest, no SFU subscription wiring, no server-side ffmpeg compositor, no RTMP relay to a Setnayan master channel. The broadcaster web UI + landing-page IFrame embed are the entire V1 build.

---

## Delivery architecture — YouTube as sole viewer surface

### What changes vs. the original master spec

The original spec described a dual-delivery model: Cloudflare Stream Player embedded on the couple's landing page **and** YouTube via RTMP relay. V1 collapses to YouTube-only delivery:

- Setnayan's compositor output goes to **YouTube Live ingest** as the only delivery destination
- The couple's landing page (`setnayan.com/[event-slug]`) embeds the **YouTube IFrame Player** as its video element
- Viewers watching on the landing page and viewers watching on YouTube directly see the same broadcast served from YouTube's CDN
- Setnayan's per-event delivery cost is **₱0**, regardless of audience size

### Why YouTube-only

The Cloudflare Stream Live delivery rate at 1,000+ concurrent viewers becomes a real margin risk under the apparatus rule's "no audience caps" implication. At rate-card pricing, a viral wedding with 50,000 concurrent viewers on the embedded Stream Player could cost Setnayan ~₱700,000 in pure delivery against a ₱7,500 SKU. Routing all delivery through YouTube eliminates this exposure entirely — YouTube absorbs unlimited viewers on Google's infrastructure at no cost to Setnayan or the couple.

This decision is documented in user memory at `project_setnayan_panood_youtube_delivery.md` and in the CLAUDE.md decision log.

### Pipeline

```
5 phones (WebRTC publish) ──► Cloudflare Stream Live SFU (ingest)
                                          │
                                          ▼
                               Setnayan server-side compositor (ffmpeg)
                               • broadcaster picks active camera
                               • monogram overlay (if pack purchased)
                               • picture-in-picture (Tier 4)
                               • lower-thirds + scene cards
                               • standby screen during breaks
                                          │
                                          ▼
                               RTMP relay to YouTube Live
                                          │
                                          ▼
                               YouTube ingest on @SetnayanWeddings (master channel)
                                          │
                                          ▼
                               YouTube CDN
                                          │
                ┌─────────────────────────┴─────────────────────────┐
                ▼                                                   ▼
   setnayan.com/[event-slug] embeds                        Direct YouTube watch URL
   the YouTube IFrame Player                           (couples can share for smart-TV viewers)
   (branded landing-page experience)                   (universal device support)
```

The same composited stream — with the couple's monogram, broadcaster's switching, lower-thirds, standby screens — plays on every surface. The video content is identical; only the player chrome around the video differs.

### Setnayan's master YouTube channel

All broadcasts are created via the YouTube Data API on **one Setnayan master channel** (final naming is a brand decision; `@SetnayanWeddings` is the working name). Couples never log into YouTube, never OAuth into a Google account, never see "your YouTube channel" anywhere in setup.

Hard architectural rules for the master channel:

- **Channel must NOT be enrolled in YouTube Partner Program (YPP).** This removes any per-broadcast monetization decision entirely; the channel is structurally incapable of running ads on a wedding broadcast.
- **Every broadcast is created with `monetizationDetails.monetization: false`** as a belt-and-suspenders setting at the API call level.
- **Default privacy state is "unlisted"** — anyone with the watch URL can view, but the broadcast is not discoverable via YouTube search. Couples can request a public flip after the event for sharing.
- **Default latency mode is "ultra-low-latency"** at broadcast creation. End-to-end latency lands at ~10 seconds, accepted tradeoff vs. Cloudflare Stream Player's ~5–7 seconds.
- **Recording auto-archives on the master channel** as unlisted, indefinite retention. Couples can download the archive from their Setnayan dashboard or request a public flip.
- **YouTube channel concurrent broadcast quota** defaults to ~50; for V1 launch this is plenty. Past it, request a quota raise from YouTube or shard across multiple Setnayan-controlled channels.

### Embed implementation

The landing page embeds the YouTube IFrame Player using YouTube's embed parameters configured for a clean look:

- `controls=1` — show standard playback controls
- `modestbranding=1` — minimize YouTube branding
- `rel=0` — no related-video suggestions when the player is paused
- `iv_load_policy=3` — disable video annotations
- `playsinline=1` — inline play on iOS without forcing fullscreen

The full wedding's branded UI (RSVP, gallery, schedule widget, mood board) renders around the embedded player on the same Setnayan page. Viewers get the wedding-hub experience plus YouTube's free CDN delivery.

---

## Cost model (per-event, base + add-ons)

Cost components scale only with camera count and stream duration. Audience size does not affect Setnayan's bill (YouTube delivery is free).

| Configuration | What couple pays | Setnayan cost | Margin |
|---|---|---|---|
| Base (3 cams × 3 hrs) | ₱2,499 | ~₱120 | 95% |
| 5 cams × 3 hrs (base + 2 cams) | ₱4,500 | ~₱180 | 96% |
| 3 cams × 5 hrs (base + 2 hrs) | ₱4,500 | ~₱180 | 96% |
| 5 cams × 5 hrs (base + 2 cams + 2 hrs) | ₱6,500 | ~₱280 | 96% |
| 5 cams × 8 hrs (base + 2 cams + 5 hrs) | ₱9,500 | ~₱430 | 95% |
| 5 cams × 12 hrs (base + 2 cams + 9 hrs) | ₱13,500 | ~₱630 | 95% |

Margin holds at ~95% across the entire base + add-ons range because the per-camera-hour cost scales linearly with revenue (₱999 add-on covers ~₱60 of incremental Setnayan cost).

**Cost line breakdown** at the typical 5-cam × 5-hr event (Setnayan cost ~₱280):

- Cloudflare Stream Live ingest (5 cameras × 5 hrs × ~₱6/cam-hr): ~₱150
- R2 archive (composited broadcast, ~5–6 GB at HD bitrate): ~₱50
- Compositor compute (Workers / ffmpeg): ~₱30
- RTMP relay outbound to YouTube: ₱0 (free egress on Cloudflare)
- YouTube ingest: ₱0 (YouTube doesn't charge to ingest)
- YouTube delivery (any audience size): ₱0
- Misc (signaling, broadcaster admin session, monogram asset reads): ~₱50

The audience-side numbers are gone. Whether the wedding has 100 viewers or 1,000,000 viewers, Setnayan's cost is the same.

---

## Highlight markers (base SKU feature)

The broadcaster admin includes a **★ Mark highlight** button. Each tap creates a `highlight_marker` row keyed to the active camera and broadcast timestamp, with a 30-second window around it. Markers cost Setnayan nothing per use (one DB write per tap) and are included free with every base SKU.

When the broadcaster taps it during a meaningful moment (vows starting, ring exchange, first kiss, first dance starts, cake cutting, speeches), the AI Video Highlight and AI Edited Highlight reels — if the couple has bought either — pull from these marked moments first, then auto-detect additional content via vision/audio AI to fill in. The result: dramatically better highlight reels because the broadcaster told the AI exactly which moments mattered.

Couples who don't buy any AI highlights still benefit — the markers are saved with the broadcast metadata, so the couple can locate those moments quickly when scrubbing through the YouTube archive afterward.

```sql
CREATE TABLE highlight_markers (
  marker_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID NOT NULL REFERENCES events,
  active_camera_id INT,                       -- which camera was on air when broadcaster tapped
  broadcast_ts  INTERVAL NOT NULL,             -- offset from broadcast start
  marked_by_user_id UUID REFERENCES users,
  note          TEXT,                          -- optional broadcaster note ("first dance")
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Broadcaster control surfaces (V1)

The broadcaster runs an entire wedding's video in real time, often with one operator and a friend or family member helping. The control surface has to be loud about *what's on air right now*, hide its destructive actions behind a confirmation gesture, and put the most-used controls within one tap or one keystroke. This section locks the V1 layout for both desktop and mobile after a 2026-05-10 design pass that simplified the original mockup.

### Preview vs program (desktop)

The desktop broadcaster runs a **two-state pattern** borrowed from professional video switchers:

- **Program** — the camera currently on air. Shown as the big feed in the center; visible as a thick red outline + `PROGRAM` tally on the matching tile in the camera rail.
- **Preview** — the camera queued to go on air next. Shown as a small inset thumbnail in the bottom-right corner of the program feed, plus a green outline + `PREVIEW` tally on the matching tile in the camera rail.

Clicking any non-program camera tile **sets it as preview**. The program does not change. The broadcaster verifies the framing in the inset, then hits the **Take** button (or presses Space) to cut preview to program. The previous program flips into preview, ready to come back.

This eliminates the V1 draft's pattern of "click a cam → it cuts immediately to that cam," which forced the broadcaster to commit to a frame they hadn't checked. Preview/program adds one click in exchange for a much lower rate of bad cuts.

The mobile broadcaster keeps the simpler "tap a cam = cut to it" model — the small phone screen makes preview real estate impractical — but adds a **swipe-left / swipe-right gesture** on the feed itself to cycle through cameras as a one-handed alternative.

### Top bar (desktop)

| Control | Affordance | Notes |
|---|---|---|
| `Standby` | Single-click toggle | Cuts the broadcast to the standby card. Toggles back on second click. Keyboard: `Esc`. |
| `End stream · hold` | **1.5-second press-and-hold**, with a fill animation showing progress | Releasing before 1.5 s aborts. The destructive action is now physically harder to fire than any other button. Keyboard: `Shift+E` opens an explicit confirm modal. |

The earlier draft's `Lower thirds (primary)` button has been **removed from the top bar** — it was a duplicate of the `Lower third` button in the feed-controls row below the program. One canonical location for each action.

### Feed controls (desktop creative row)

A four-button row directly under the program feed, each with its keyboard chip visible:

| Action | Keystroke | Behavior |
|---|---|---|
| `+ Highlight` | `H` | Marks a 30-second window around the current broadcast timestamp. AI Highlight reels pull from these markers first. |
| `Lower third` | `L` | Opens a small modal with `name` + `sub-caption` fields; on submit shows a lower-third caption over the active feed. |
| `Scene card` | `S` | Picks a transition card (Welcome / Ceremony / First Dance / Send-Off). Custom Standby designs unlock with the Custom Monogram Pack. |
| `Picture-in-picture` | `P` | Toggles PiP mode (program + a secondary feed inset). |

The earlier draft's `Audio mixer` button is gone, replaced by a sticky audio rail (below).

### Sticky audio rail (desktop)

Audio is the failure mode that ruins live broadcasts most often (mic feedback, levels off, music bed too loud over speeches). V1 surfaces audio as an **always-visible three-channel meter** under the creative row, not behind a button:

```
┌──────────────────────────┬──────────────────────────┬──────────────────────────┐
│ CAM 1 MIC  [▓▓▓░░░] [M] │ CAM 3 PGM  [▓▓▓▓▓░] [M] │ MUSIC BED  [▓▓░░░░] [M] │
└──────────────────────────┴──────────────────────────┴──────────────────────────┘
```

Each cell shows the channel label, a real-time level meter (green → yellow → red gradient signaling clipping risk), and an `M` mute pill. Tapping `M` toggles mute on that channel. Clipping (red zone) is the broadcaster's signal to back off the gain.

V1 ships these three channels: program-camera mic, hot-mic on whatever camera the broadcaster designates as the wide audio source, and the music bed. V1.1 will allow re-mapping which channels appear (some weddings have a separate boom mic, an instrument feed for the band, etc.).

### Bottom bar (desktop)

Slim, informational. Holds the highlight counter (`Highlights · 7 marked`), the auto-archive destination, the session ID, and a small `press ? for shortcuts` hint. The original draft's "Hold to mark highlight clip" big button is gone — the `+ Highlight` button in the creative row is the only highlight affordance.

### Camera rail (desktop)

Five tiles stacked vertically, one per camera slot. Each tile carries:

- The camera's color thumbnail
- A small DM-Mono `1`–`5` keyboard chip in the upper-right corner (matches the keyboard shortcut for previewing that cam)
- A health dot (green / amber / red) for ingest status
- The `PROGRAM` tally on the on-air cam (red outline)
- The `PREVIEW` tally on the queued cam (green outline)

### Right rail (desktop)

Three sections, top to bottom:

1. **Destinations** — `YouTube Live`, `Facebook Live`, `Setnayan landing page`. **Each pill is now clickable** to pause that destination mid-stream (with a confirm modal); other destinations keep streaming. A paused destination renders dimmed with a `paused · ` prefix on its viewer count. Earlier draft was read-only.
2. **Overlay presets** — five named cards (`Welcome`, `Cake cutting`, `First dance`, `Speeches`, `Send-off`), each with a keyboard chip showing `6`–`0`. Press the chip's key to fire the preset; click also fires it.
3. **Branding** — Custom Monogram Pack status pill (`On` when purchased, `Off` otherwise).

### Mobile broadcaster

The mobile broadcaster is **not the desktop broadcaster shrunk**. It's a thumb-zone-first redesign with different defaults.

| Surface | Behavior |
|---|---|
| Live badge + event name + viewer count | Top header. |
| Health strip | Three small stats under the header: signal type + bitrate (`4G · 4.1 Mbps`), battery (`87%`), elapsed time. The earlier draft had no visible health indicator on mobile — added in this revision. |
| Camera strip | Horizontally scrollable strip of five **88pt × 54pt rectangles** (not the original tiny circles). Each shows the camera's color thumbnail and number; the active camera has a red outline + `PGM` tally chip. Tap a tile to cut to that camera (no preview/program two-state on mobile). |
| Program feed | Big rectangle with the live pill + monogram + lower third overlays. **Swipe left / right on the feed itself** also switches camera (next / previous in the strip). Swipe affordance hint sits at the bottom of the feed area for the first few seconds. |
| Action row | **Three primary buttons + a More button** — `+ Highlight`, `Standby`, `Lower 3rd`, `More ▾`. The earlier draft had five buttons cramped into one row, all below the 44pt touch-target threshold; this version puts the long tail (Scene card, PiP, Audio mixer, Cast to projector, Broadcast style, Stream settings) behind the More sheet. |
| More sheet | Pulls up from the bottom (drag handle to dismiss). Six secondary actions in a 2-column grid plus a compact 3-channel audio rail (`PGM` / `CAM` / `BED`) so the broadcaster can monitor and mute audio without a separate modal. |
| Bottom bar | Destinations mini-strip (clickable to pause / resume) + a **slide-to-end-stream** thumb-drag affordance. Replaces the earlier draft's tap-only `End stream` button. The destructive action requires a deliberate slide gesture; tapping the track does nothing. |

### Keyboard shortcuts (desktop)

Pressing `?` (Shift+/) opens a fullscreen cheatsheet overlay listing every shortcut. The cheatsheet stays available throughout the broadcast.

| Key | Action |
|---|---|
| `1` – `5` | Set preview camera |
| `Space` | Take preview to program |
| `H` | Mark highlight |
| `L` | Lower third |
| `S` | Scene card |
| `P` | Picture-in-picture toggle |
| `6` – `0` | Fire overlay preset (Welcome / Cake cutting / First dance / Speeches / Send-off) |
| `Esc` | Toggle standby |
| `Shift+E` | End-stream confirm modal (or 1.5 s hold on the End stream button) |
| `?` | Show / hide this cheatsheet |

Shortcuts are suppressed when an `<input>` or `<textarea>` is focused (so typing into a lower-third name doesn't fire camera switches), and entirely disabled in mobile-view mode.

### Hold-to-confirm and slide-to-confirm — the V1 destructive-action pattern

V1 establishes a single rule for destructive actions across the broadcaster:

- **Desktop destructive actions are press-and-hold** with a visible fill animation. Release before completion = abort.
- **Mobile destructive actions are slide-to-confirm** with a thumb that drags from one edge of a track to the other. Release before reaching the end = thumb snaps back.

This rule applies to `End stream` in V1 and will extend to other destructive actions (revoke face data, delete event, etc.) in later iterations.

---

## Cast to projector (base SKU feature)

Every broadcast can be cast to a projector at the venue via HDMI. This is a free feature included in the base SKU — gives venue guests a real-time view of the broadcast on a projection screen while family abroad watches via YouTube (with the standard ~10s YouTube delay).

### How it works

The broadcaster admin includes a **"Cast to projector"** button. Tapping it opens the active composited feed in a fullscreen video element. The two supported broadcaster setups:

**Laptop broadcaster (recommended for polished look):**
- Connect laptop to projector via HDMI (treat as extended display)
- Tap "Cast to projector" — opens a popup window with the active feed at fullscreen
- Drag the popup to the secondary display (projector)
- Hit fullscreen on that window
- Projector shows the **full polished composite** (with monogram, lower-thirds, broadcast style if owned, transitions)
- Latency: ~500ms (WebRTC + client-side overlay rendering)

**iPhone broadcaster (portable setup, raw feed on projector):**
- Connect iPhone to projector via Lightning-to-HDMI or USB-C-to-HDMI adapter
- Tap "Cast to projector" — puts the active camera feed in a `<video>` element
- iOS Safari's fullscreen-video → external-display behavior auto-routes the video to the projector
- iPhone screen continues to show camera tiles + broadcaster controls
- Notifications, status bar, and app chrome do NOT appear on the projector — only the video
- Projector shows the **raw active camera feed** (no overlays — overlays are server-side only)
- Latency: ~500ms

For most weddings the iPhone setup is fine — the venue audience can see what's happening at the altar in real time. For weddings where the projector display matters as a "production moment" (dance party visuals, branded projection), recommend the laptop setup.

### Implementation notes

- The "Cast to projector" button uses WebRTC to consume the same camera feeds the broadcaster admin already has. No new backend infrastructure.
- For laptop: client-side overlay rendering matches the server-side composite (the same overlay templates ship to the client when Custom Monogram Pack and/or Broadcast Style Pack are owned).
- For iPhone V1: the cast view shows raw camera feed only. V1.1 candidate: server publishes a low-latency WebRTC composite-with-overlays back to the broadcaster device for polished iPhone projector cast.
- Cost to Setnayan per use: ₱0. Cost to couple per use: ₱0 (included in base ₱2,499).

---

## Pro Camera Bridge — DSLR camera feeds

### What it is

A purchasable add-on that turns one Panood camera slot into a phone+DSLR pair. The phone retains everything the WebApp camera operator does today — WebRTC publish, network awareness, broadcaster signalling, monogram-stamped output via the server-side compositor — but the **optical capture surface** moves to a connected DSLR. The phone reads the DSLR's clean live-view feed via the vendor's WiFi SDK and republishes it through WebRTC to Cloudflare Stream Live exactly as if it were the phone's own internal camera.

A bridge unlock is **per device-pair**, multi-purchase, ₱1,500 each, registered as `pro_camera_bridge_addon` in the service_orders (V1 apply-then-pay). The same SKU is sold by 0012 Papic; one purchase unlocks one paired-camera seat on whichever surface the paired phone is operating. A couple buying 5 cameras for the broadcast (`panood_base` + `panood_camera_addon` × 2) plus 3 Pro Camera Bridge unlocks (3 × ₱1,500 = ₱4,500) ends up with 5 broadcast cameras, three of which are phone+DSLR rigs and two of which are phone-internal.

### Slot rule — phone+DSLR is still 1 camera

A phone+DSLR pair counts as **one camera slot** against the Panood camera limit. The base SKU's 3 cameras and the +1 camera add-on's slot count are unaffected by whether the slot is operated by a phone alone or a phone+DSLR pair. The bridge add-on sells **quality**, not slot count — couples bringing professional glass to the broadcast pay for the glass-aware pipeline, not for an additional camera position.

### Why phone-as-bridge

Same architectural reason as 0012 Papic:

1. **DSLR firmware doesn't run third-party apps.** WebRTC publish, the broadcaster's session token, and the couple's monogram all live on a layer the camera body can't touch. The phone hosts that layer.
2. **WebRTC publish from the camera body to Cloudflare's SFU isn't a thing.** The vendor SDKs all expose an "SDK-to-companion-device" pattern; the companion device (phone) is the only place we can actually ingest from.
3. **The phone is already an operator.** In V1 every Panood camera is a phone running the WebApp client. Switching that phone from "publish my internal camera" to "publish the DSLR live view I'm receiving over WiFi" is a swap of capture source, not a new architecture.

### Pipeline when paired

```
Canon EOS R6 ─(SDK over WiFi)─► phone running 0012 native app in
                                Panood camera-operator mode
                                       │
                                       │ live view feed (1080p, ~24–30 fps)
                                       ▼
                                phone re-encodes for WebRTC publish
                                       │
                                       ▼
                          Cloudflare Stream Live SFU (ingest)
                                       │
                                       ▼
                          Setnayan server-side compositor (ffmpeg)
                          • monogram overlay applies as today
                          • broadcaster picks active camera as today
                                       │
                                       ▼
                          RTMP relay ► YouTube ► viewers (as today)
```

The compositor and broadcaster don't know or care whether a given camera tile is sourced from a phone's internal sensor or a paired DSLR — both arrive as standard WebRTC streams indistinguishable to the SFU. Monogram, broadcast style, picture-in-picture, all overlay logic is unchanged.

### Why use the 0012 native app for the operator role

The vendor SDKs (Canon EOS Camera Connect, Nikon SnapBridge, Sony Camera Remote, Fujifilm Camera Remote) are all native iOS / Android libraries — there is no browser API. A phone bridging a DSLR therefore needs a native runtime. Rather than ship two separate native apps (one for Papic, one for Panood camera operator), the 0012 binary gains a Panood camera-operator mode and the Panood camera operator who has purchased a bridge unlock launches the same app the Papic crew uses — selecting "Panood camera" instead of "Papic capture" at the seat-claim screen.

The phone-internal Panood operator path remains pure WebApp. Operators without a bridge unlock never need the native app.

### Pairing flow (camera operator side)

The pairing flow is identical to 0012's:

1. Operator scans the seat-claim QR for their Panood camera slot, lands in the 0012 native app, picks "Panood camera operator" mode.
2. App detects the bridge unlock for that slot and shows **Settings → Pair a camera**.
3. Brand picker → SDK pairing handshake → Live View test (per 0012 spec).
4. WebRTC publish starts; the camera tile lights up on the broadcaster's grid.

### Slot enforcement at spend-time

`pro_camera_bridge_addon` purchases are bound at spend-time to a specific Panood camera slot (`panood_camera_id`) or papic seat (`papic_seat_id`). The wallet UI surfaces the bind step explicitly:

> *Pro Camera Bridge — ₱1,500*
> *Bind this unlock to:*
> *◯ Panood Camera 1*
> *◯ Panood Camera 2*
> *◯ Papic Seat A — Auntie Rosa*
> *...*

A bound unlock travels with the slot through battery handoffs and device swaps but does not transfer across slots. V1.1 will add an admin "transfer bridge" action; V1 ships without it.

### What a bridge unlock buys the broadcast

- **1080p clean output** with no autofocus hunt, controlled depth-of-field, real low-light performance.
- **Manual control surfaces** the operator can use (aperture, ISO, shutter speed, focus override) — the phone is now a capture remote rather than the sensor.
- **Same monogram, same broadcaster, same YouTube delivery.** Nothing downstream changes.

### What it does NOT do in V1

- **No multi-DSLR-per-phone.** 1 phone : 1 DSLR.
- **No DSLR-direct-to-SFU.** Every DSLR feed goes through a phone.
- **No USB-tethered DSLR pairing.** WiFi only.
- **No native broadcaster client.** The broadcaster role stays browser-only — the broadcaster doesn't need the native app, ever.
- **No DSLR-side recording.** When the bridge is active, the DSLR's own SD-card recording behavior is unchanged — couples can still record locally on the body if the body supports it. Setnayan's broadcast pipeline is unaffected by what the DSLR does or doesn't write to its own card.

### Disconnect handling

DSLR WiFi at venues is unreliable. When pairing drops mid-broadcast:

- The camera tile on the broadcaster's grid switches to *"Camera disconnected — switching to phone camera. Tap to retry pair."*
- The phone's internal rear camera comes back online and continues to publish — broadcast does not interrupt.
- Auto-retry runs every 5 seconds; on successful re-pair the broadcaster sees the tile transition back to DSLR-source.
- Frames published during the disconnected window carry the same `paired_camera_brand=null, paired_camera_model=null` provenance fields used in 0012, queryable from the broadcast metadata for post-event analysis.

### Wallet integration

```
service_key:        "pro_camera_bridge_addon"
display_name_en:    "Pro Camera Bridge (per DSLR seat)"
php_price_centavos: 150000
token_display:      45000
ref_type:           "(event_id, panood_camera_id | papic_seat_id)"
one_time_per_event: false                          -- multi-purchase, bound to a specific slot at spend-time
```

This is the canonical SKU definition; 0012 Papic reads from this row.

---

## LED Background → Panood standby integration (cross-iteration)

If a couple owns BOTH the LED Background Maker (0005) AND the Panood + Custom Monogram Pack, the 1080p LED background render automatically becomes the visual under the Custom Standby screen during the live broadcast.

### How it works

The compositor checks `events.led_background_render_id` when standby mode is triggered. If set:

- The 1080p LED background MP4 (already rendered and stored at `led_backgrounds/{event_id}/{template_id}_{config_hash}.mp4`) loops underneath the standby card text
- Standby card content (countdown, "Reception begins shortly," intermission text, monogram) renders on top
- Result: the venue's projected LED background visual matches the broadcast's standby visual — cohesive look across surfaces

If the couple doesn't own the LED Background, standby falls back to the default Setnayan background pattern. If they don't own Custom Monogram Pack, standby falls back to the default Setnayan standby template entirely.

Cost to Setnayan per use: ₱0 — the 1080p file is already rendered (sunk cost from 0005's render pipeline). Cost to couple per use: ₱0 — bonus integration when both iterations are owned.

This integration is documented in 0005's spec as "1080p file becomes Panood standby source when both 0005 and 0011 Custom Monogram are purchased."

---

## Broadcast Style Pack — V1 spec

### Scope

Single event-wide SKU at **₱2,999**. Unlocks the full broadcast styling toolkit. Once purchased, the broadcaster can switch between modes mid-event (e.g., News mode for ceremony coverage, Cinematic for the reception, Royalty for the entrance).

### What's included

**Four broadcast style modes:**

1. **News mode** — bold red live bug, channel-style logo box, news-ticker bottom bar, hard cuts and quick wipes, sharp neutral color grading. Best for couples who want their wedding broadcast to feel like a polished news event.
2. **Cinematic mode** — cinema-bar letterbox (2.39:1), italic serif typography, subtle live indicator, warm film color grade, smooth fades and dissolves. Best for couples who want a "wedding film" aesthetic.
3. **Sports event mode** — bold geometric overlays, yellow/black contrast, camera number bug, time-of-event readout, fast slide / push transitions. Best for couples who want high-energy broadcast feel.
4. **Royalty mode** — gold filigree frame border, crowned monogram in corner, ornate scrollwork on captions, deep jewel-tone color, slow iris-in/out reveals. Best for couples doing a formal traditional wedding aesthetic.

**Four color presets per mode** — warm film, cool blue, black-&-white, vintage sepia. Couple picks per mode at setup; broadcaster can switch presets mid-event.

**Four transition types**:

- **Hard cut** (also available in base — instant switch)
- **Crossfade / dissolve** (smooth blend between cameras)
- **Slide / push** (one camera slides in as the other slides out)
- **Iris reveal** (circular fade-in/out, slow and ornate)

The broadcaster picks which transition to use per scene change via a small popup on the admin.

**Animated scene cards** — full-screen transitional cards with mode-specific styling: "Welcome," "Ceremony," "First Dance," "Cake Cutting," "Send-Off." Plus the Custom Standby screen treatment from the Custom Monogram Pack.

### Why it's bundled (not 4 separate SKUs)

Earlier drafts considered selling each mode as a separate ₱2,999 SKU (₱12,000 total to unlock all four). The bundled approach won because:

1. **Simpler for couples** — one decision instead of four; "I want my wedding to look polished" maps to one purchase.
2. **More mode-switching freedom** — couples can use News for the church ceremony coverage and Royalty for the reception entrance without paying extra. This makes the broadcast feel coherent across the day.
3. **No extra Setnayan cost** — per-use cost to Setnayan is ₱0 regardless of how many modes are loaded. Bundling doesn't hurt margin.
4. **Margin preserved** — ₱2,999 → ~₱5 cost = ~99% margin.

### Implementation

- Single boolean flag: `event.broadcast_style_unlocked` — set on purchase, never unset.
- Mode + transition + preset state stored at `events.panood_state` JSONB so the compositor knows which template/LUT to load each frame.
- Templates and LUT files ship with the compositor; no per-event asset generation needed.
- Mode switching during broadcast is via a "Change style" button on broadcaster admin that opens a mode picker.

### Wallet integration

Spend goes through 0003's `create_service_order(service_key, customer_id, amount_php)` primitive. On successful spend, the backend sets `event.broadcast_style_unlocked = true`. No direct PayMongo / Stripe charges in this iteration.

---

## Same-Day Edit — V1 spec

### Scope (locked 2026-05-12 — un-retired into V1)

**Same-Day Edit (SDE)** is Setnayan's flagship render SKU. A 3–5 minute cinematic film of the wedding day, **delivered before the reception ends** and played live on the LED background screen at the climactic moment of the reception. This is something traditional Filipino wedding videographers cannot do — their delivery is 4–12 weeks. Setnayan's pipeline collapses that to **T+0**.

**Single event-wide SKU at ₱24,999.** Per-event; multi-purchase allowed but typically bought once. Multi-purchase only when the couple wants alternate cuts (e.g., a "family edit" + a "social edit" with different feel-categories).

### Why this works at ₱24,999

The original 2026-05-09 retirement of SDE was driven by a ~₱9,500/event estimated vision-AI cost — which assumed real-time per-frame inference. With Claude API's batch + prompt-caching, plus Remotion + Lottie + LUT carrying most of the styling work, real per-event Setnayan cost is **~₱225–450**:

| Component | Cost |
|---|---:|
| Anthropic Claude API (vision scene-selection + storyline generation, prompt-cached) | ~₱200–400 |
| Remotion compute on Cloudflare Workers (3–5min render) | ~₱20–40 |
| R2 storage + bandwidth | ~₱5–10 |
| **Total** | **~₱225–450** |

Margin: **~98%** at ₱24,999. The flagship anchor that traditional videographers charge ₱50K+ for over 4–12 weeks.

### Flow (the SDE pipeline — locked)

1. **Pre-event setup.** Couple buys SDE during event planning. Couple picks a feel-category template (e.g., HF-01 Capiz Garden, or CD-01 Hollywood Anamorphic) at purchase. Picks can be changed up to T-24h.
2. **During the event (T-8hr → T-1hr).** Paparazzi (0012) + Panood broadcast (this iteration) continuously upload photos and clips to R2 with mandatory capture metadata (captured_at, geo, paired_camera). EXIF + face-detection tags accumulate on every photo.
3. **T-30min before reception.** A Cloudflare Workers cron job triggers the SDE render:
   - **Step 1 — Vision pass.** Claude API (vision-enabled, prompt-cached system prompt with the chosen template's storyline pacing) scans the full event photo + clip set. Picks 30–40 best moments. Output: a structured JSON storyboard `[{moment_id, beat, duration_seconds, emotional_intensity, photo_id|clip_id}, …]`.
   - **Step 2 — Render spec generation.** Same Claude call writes the Remotion render spec: which photo/clip goes where, what music transition lands on each beat, which Lottie overlay fires at which timestamp.
   - **Step 3 — Render execution.** Remotion + headless Chromium + FFmpeg + Lottie + `.cube` LUT renders the 3–5 minute MP4 (1080p H.264, vertical 9:16 + horizontal 16:9). Music track pulled from the Suno-owned catalog matching the template's `music_pairing_categories`.
   - **Step 4 — Delivery.** MP4 written to R2 + signed URL emailed to couple + couple's coordinator. Push notification sent to the couple's phones.
4. **Reception · climactic moment.** Couple's LED background screen (iteration 0005 hardware) plays the SDE. If couple owns Custom Monogram Pack (₱1,999), their monogram replaces Setnayan's watermark in the render.

### Storyline structure (per event-type × feel-category)

SDE uses the same **storyline-render** framework as AI Video Highlight + AI Edited Highlight (locked 2026-05-12), just longer + higher-quality. For weddings × Heritage-Filipiniana feel-category, the 5 narrative beats are: anticipation (prep) → climax (vows, kiss) → celebration (reception) → tender moments (parent dance, family reactions) → resolution (closing shots, sparkler exit). Each beat gets ~30–60 seconds of edited material.

For non-wedding event types (when Setnayan opens to birthdays, debuts, corporate, travel, celebration — burial retired 2026-05-16), the same SDE infrastructure runs against different story-template manifests per event-type × feel-category combination.

### Schema additions

```sql
-- Extend service_catalog
INSERT INTO service_catalog (sku_key, customer_price_php_centavos, description)
VALUES ('same_day_edit', 899900, 'Same-Day Edit · flagship · 3-5 min · T-30min delivery');

-- Same-Day Edit render record
CREATE TABLE sde_renders (
    sde_render_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id          TEXT UNIQUE NOT NULL DEFAULT generate_public_id('S'),
    event_id           UUID NOT NULL REFERENCES events(event_id),
    order_id           UUID NOT NULL REFERENCES service_orders(service_order_id),
    template_id        TEXT NOT NULL,         -- e.g., 'HF-01' from Template_Catalog_V1
    feel_category      TEXT NOT NULL,
    target_duration_s  INTEGER NOT NULL,      -- 180-300
    storyboard_json    JSONB NOT NULL,        -- Claude-generated structure
    r2_output_key      TEXT,                  -- filled on render complete
    render_started_at  TIMESTAMPTZ,
    render_finished_at TIMESTAMPTZ,
    render_status      TEXT NOT NULL DEFAULT 'queued',  -- queued|rendering|complete|failed
    error_details      JSONB,
    custom_monogram_applied BOOLEAN NOT NULL DEFAULT FALSE
);
```

### Failure modes

- **Claude API timeout / quota.** Fall back to selecting moments by face-detection confidence + capture-recency. Render still ships; couple gets a "best-effort" version with a follow-up email offering a free re-render after Setnayan team manual curation.
- **Insufficient material.** If fewer than 15 high-quality moments are available at T-30min, the SDE pipeline auto-extends to T-15min. If still insufficient, couple gets a pro-rata refund + an Edited Highlight render in lieu.
- **LED screen unavailable.** SDE still renders + delivers via MP4 download. Couple plays from any other device (projector, laptop HDMI, etc.).

### Customer-facing positioning

"Your wedding film. Delivered before the reception ends. Not edited by you — written by AI in your chosen aesthetic, played on your LED screen as the night peaks."

Traditional wedding-film cost reference: ₱50K–₱100K per couple, 4–12 weeks delivery. Setnayan SDE: ₱24,999, same-day. Same emotional weight, same cinematic quality, fraction of the cost + zero wait.

---

## Custom Monogram Pack — V1 spec

### Scope

Single event-wide SKU at **₱1,999**. Replaces the Setnayan logo with the couple's monogram on every media output Setnayan produces for that event:

- Panood broadcast — live feed plus YouTube auto-archived recording
- Panood highlight reels — intro card, outro card, corner watermark
- Papic photo exports and shares (when 0012 ships)
- Personal Reels — intro and outro cards plus corner watermark (when 0012 ships)
- Photo gallery chrome on the couple's landing page (when 0012 ships)
- Future surfaces — LED background, photo book, share cards

### Default state without the pack

Setnayan logo applied to every output. This is the marketing surface — every guest who shares a Personal Reel to Instagram Stories or every relative watching the YouTube broadcast still sees Setnayan branding. The SKU is the explicit upgrade from "vendor-branded" to "couple-branded."

### Asset library

Four overlay design templates, each with portrait and landscape variants — eight layouts total:

1. **Corner Bug** — small monogram in a configurable corner.
2. **Bottom Band** — monogram plus the couple's hashtag in a slim band along the bottom.
3. **Top-Right Sweep** — monogram in upper right, with an animated sweep on entry and exit for video output.
4. **Centered Lower-Third** — monogram with optional text caption in the lower third.

Each design has a portrait variant (used for Papic photos and 9:16 reels in 0012) and a landscape variant (used for Panood broadcast at 16:9). The export and render pipelines auto-detect each output's aspect ratio and apply the matching variant.

### Monogram source

Two ways for couples to provide their monogram:

1. **Upload PNG with transparency** via the dashboard. Typical case — couples already have a monogram from their invitations. Validation: must be PNG, must have an alpha channel, max 2 MB, min 512 × 512 px.
2. **Auto-generate from couple's names** if no upload. Server-side SVG → PNG generation using one of four wedding-friendly typography templates: serif elegant, sans modern, script flowing, monogram block. Uses the couple names already in their event record. The couple can replace the auto-generated default with a real upload at any time.

### Custom Standby (Panood only)

Bundled into the Custom Monogram Pack. The screen shown before the stream starts and during breaks — countdown screens, "Reception begins shortly" transitions, intermission cards. Couples who only have Papic (no Panood) still get the full pack value through photo and reel branding; Custom Standby simply does not apply to them.

### Implementation

**Storage flag.** A single boolean per event: `event.custom_monogram_unlocked`. Set on purchase, never unset (purchase is final; refund follows the wallet refund rules in 0003).

**Asset storage.** The couple's uploaded monogram PNG is stored at `events/{event_id}/branding/monogram.png` in R2. The auto-generated default lives at `events/{event_id}/branding/monogram_default.png`. Both are kept; the dashboard picks which to use based on whether an upload exists.

**Application.** Branding is applied at export and render time, never to stored originals:

- Panood broadcast — the ffmpeg compositor reads the flag, picks the correct PNG, overlays it onto the active feed before YouTube ingest. The monogram travels with the video to every viewer surface (landing-page embed, direct YouTube URL).
- Papic photo exports (when 0012 ships) — sharp / imagemagick pipeline at the download and share endpoint applies the corner bug.
- Personal Reels (when 0012 ships) — FFmpeg render command includes the monogram input.
- Photo gallery chrome — dashboard frontend reads the flag and swaps the corner branding.

**Mid-event upgrade.** A couple who buys the pack mid-event sees their monogram appear on all subsequent broadcast frames immediately. No re-render of stored content is needed because nothing was baked in.

### Wallet integration (depends on 0003)

The Custom Monogram Pack is registered as a paid service in the V1 apply-then-pay flow:

```
service_key:        "custom_monogram_pack"
display_name_en:    "Custom Monogram Pack"
display_name_fil:   "Custom Monogram Pack"
php_price_centavos: 200000
token_display:      60000
ref_type:           "event_id"
one_time_per_event: true
```

Spend is performed via 0003's `create_service_order(service_key, customer_id, amount_php)` primitive. On successful spend, the backend sets `event.custom_monogram_unlocked = true`. No direct PayMongo or Stripe charges in this iteration — couple buys tokens via 0003 packs, then spends.

### Panood service registrations (V1)

| service_key | php_price_centavos | display name | multi-purchase | iteration_origin |
|---|---|---|---|---|
| `panood_base` | 250000 | Panood — Base (1 broadcaster, 3 cameras, 3 hours) | false (one per event) | 0011 |
| `panood_camera_addon` | 100000 | Panood — +1 camera | true, max 2 per event | 0011 |
| `panood_hour_addon` | 100000 | Panood — +1 hour | true, unlimited per event | 0011 |
| `custom_monogram_pack` | 200000 | Custom Monogram Pack (Remove Watermark) | false (one per event) | 0011 |
| `broadcast_style_pack` | 300000 | Broadcast Style Pack (4 modes + transitions + color presets) | false (one per event) | 0011 |
| `pro_camera_bridge_addon` | 150000 | Pro Camera Bridge (per DSLR seat) | true, unlimited per event; bound to a specific panood_camera_id or papic_seat_id at spend-time | 0011 (shared with 0012) |
| `ai_video_highlight` | 200000 | AI Video Highlight (per 60s) | true, unlimited per event | 0011 |
| `ai_edited_highlight` | 500000 | AI Edited Highlight (per 3-min) | true, unlimited per event | 0011 |

The base SKU is a one-time-per-event purchase that unlocks the Panood feature for that wedding. The capacity add-ons (`panood_camera_addon`, `panood_hour_addon`) are multi-purchase: each additional camera or hour is a separate `spend()` call that increments the event's `panood_extra_cameras` and `panood_extra_hours` counters.

---

## Offline behavior

Panood is fundamentally an online feature — without internet there is no live broadcast. Filipino wedding venues frequently have variable connectivity, so this iteration includes degradation rules for partial outages.

### Camera operator client (each camera phone)

- **WebRTC publish drops below acceptable bitrate** (sustained < 500 kbps for 10 s): banner appears — *"Connection unstable — switch to a stronger network or move closer to Wi-Fi."*
- **Connection lost entirely:** WebApp displays a *"Reconnecting..."* overlay; client retries every 3 s with exponential backoff up to 60 s. Local recording continues to the device's IndexedDB as a fallback so the moment is not lost; on reconnect, the local recording is offered as a manual upload.
- **Browser tab backgrounded** (mobile browser limitation): publish pauses after roughly 30 s on iOS; banner warns the operator before the pause, suggesting they bring the tab forward or upgrade to a Native phone tier (V2).

### Broadcaster

- **All cameras disconnected:** broadcaster sees an *"All cameras offline — last good frame held"* overlay. Stream switches to the Custom Standby screen (or default Setnayan standby if no pack purchased).
- **Broadcaster connection lost:** the active feed continues from the last selection until the broadcaster reconnects. Standby triggers only if the active feed also disconnects.
- **YouTube ingest hiccup:** Cloudflare's RTMP relay handles transient YouTube ingest failures with reconnect-and-resume. If YouTube ingest is down for sustained periods (rare but possible during YouTube infrastructure incidents), broadcast quality is unaffected for live viewers but the stream cannot be served until ingest recovers.

### Product recommendation

For Panood events at venues flagged as low-connectivity in the couple's event setup, surface a **portable 4G / 5G hotspot rental** recommendation at checkout. Hotspot rental itself is not in this iteration's scope; tracked for V1.1 operations.

---

## Build order

Sprint plan defined in master spec **Part 17**. This iteration builds in the order specified there, with the YouTube-only delivery simplification reducing some of the original dual-delivery work. Key gating dependencies for Setnayan's iteration ledger:

1. **Sprint 1 (foundation)** depends on 0003 apply-then-pay flow being live so the Custom Monogram Pack and tier purchase flows can spend.
2. **Sprint 2 (YouTube integration)** establish the Setnayan master YouTube channel, complete YouTube Data API OAuth (Setnayan's account, one-time), wire broadcast creation + monetization-off + ultra-low-latency defaults.
3. **Sprint 3 (compositor)** server-side ffmpeg compositor with monogram overlay, picture-in-picture rendering, standby screen insertion.
4. **Sprint 4 (overlays)** the Custom Monogram Pack asset pipeline must support both PNG upload and auto-generation before launch.
5. **Sprint 5 (production launch)** depends on Sentry plus Cloudflare Analytics being wired per master spec Part 24 checklist.

External account provisioning items (master spec Part 0 — *Required External Accounts and Credentials*) begin in parallel with Sprint 1. The YouTube master-channel creation and YPP-disabled verification are blockers for any production broadcast and should be the first item in Sprint 1's checklist.

---

## Acceptance criteria

This iteration is shippable when all of the following are true:

- Base SKU `panood_base` (₱2,499), `panood_camera_addon` (₱999, max +2 per event), and `panood_hour_addon` (₱999, unlimited per event) all visible in checkout and purchased via the V1 apply-then-pay flow (static BDO + GCash, manual reconciliation per 24-hr SLA).
- Camera add-on purchase increments `events.panood_extra_cameras` (capped at 2); past the cap the spend confirmation modal disables the +Camera button.
- Hour add-on purchase increments `events.panood_extra_hours` with no upper cap.
- Custom Monogram Pack (₱1,999) and AI Video Highlight (₱999 per 60s, multi-purchase) purchasable via the same wallet flow; refund follows 0003's refund rules.
- Auto-generated default monogram works for any couple's names without upload, using the four typography templates.
- WebApp camera operator joins via QR within 60 seconds end-to-end.
- Broadcaster sees live preview tiles for all up-to-5 cameras (3 base + up to 2 add-on) and can switch the active feed with a single tap.
- Camera slot count enforced — broadcaster cannot add a 4th or 5th camera until the corresponding add-on is purchased.
- Stream-capacity hour count enforced — at the start of the broadcast the broadcaster sees their hour budget (3 base + N add-ons); a 30-minute warning fires before the budget runs out and the broadcaster can buy more hours mid-stream.
- Stream pushes to YouTube Live on Setnayan's master channel; broadcast is created with `monetization=false` and `latencyPreference=ultraLow`.
- Couple's landing page embeds the YouTube IFrame Player; viewers watching on the landing page and viewers watching on YouTube see the same broadcast.
- YouTube auto-archive on Setnayan's master channel contains the post-event recording; couple can download from their Setnayan dashboard.
- Custom monogram, when purchased, is burned into the broadcast frame via the compositor before YouTube ingest — appears on every viewer surface within 5 seconds of purchase. Watermark removal also applies to Papic photo exports + reels and to the gallery chrome on the couple's landing page.
- AI Video Highlight add-on produces a 60-second compiled reel within 10 minutes of stream end.
- Offline degradation rules visible via integration tests (network throttling at the SFU edge).
- All applicable analytics events fire per master spec Part 17 metrics list.
- **Pro Camera Bridge add-on** (`pro_camera_bridge_addon`, ₱1,500, multi-purchase) visible in checkout and bindable at spend-time to a specific Panood camera slot.
- **Bound bridge unlock** unlocks DSLR pairing in the 0012 native app for that camera operator's seat; phone-only operators continue to use the WebApp without any change.
- **Phone+DSLR camera tile** appears on the broadcaster's grid as a normal camera tile, with the camera's brand and model surfaced in the tile metadata for the broadcaster to verify.
- **Slot count enforcement** — phone+DSLR pair counts as 1 camera; bridge unlocks do not increase the broadcast's camera limit.
- **DSLR pairing flow** completes in ≤ 90 seconds end-to-end on at least one body per supported brand (Canon EOS R-series, Nikon Z-series, Sony α-series, Fujifilm X-series).
- **Pairing disconnect** mid-broadcast falls back to the phone's internal camera within 3 seconds without interrupting the broadcast; auto-retry succeeds when the DSLR comes back online.

---

## Open questions

- Whether to include a portable hotspot rental as a paid add-on. Operations question; deferred to V1.1.
- Final naming for Setnayan's master YouTube channel (`@SetnayanWeddings`, `@SetnayanOfficialPH`, etc.). Brand decision; not blocking technical work.

---

## Companion specs and cross-references

- `09_Panood_Feature_Specification.md` — full Panood master spec, single source of truth for all technical details.
- `0003_token_wallet_and_packs/` — apply-then-pay flow, pack ladder, `spend()` primitive consumed by this iteration's tier and add-on purchase flows.
- `0012_papic/` — consumes the `event.custom_monogram_unlocked` flag this iteration registers.
- `14_Music_Catalogue_Cowork_Playbook.md` — music catalogue used in highlight reel renders.
- `CLAUDE.md` — decision log including the 2026-05-09 apparatus rule and YouTube-only delivery decisions.

---

[View this iteration's HTML mockup](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan%20App/0011_panood/0011_panood.html)

[View this iteration's Word document](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan%20App/0011_panood/0011_panood.docx)
