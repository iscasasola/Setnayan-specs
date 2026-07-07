> ⚠ RENAMED 2026-06-29: Panood → **Live Studio**; paid multicam repriced ₱4,999 → ₱3,499/day. (Internal SKU key PANOOD_SYSTEM unchanged.) See DECISION_LOG.md 2026-06-29.

# Panood Feature Specification

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main)
> **This doc is HISTORICAL/REFERENCE.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Panood exists in code as an **"In build"** SKU, but the pricing/packaging in this doc is fully superseded:
> - **Live pricing:** Panood is **"Panood (Website Add-on)" ₱3,499/day** (per-day, audience-independent, livestream on the couple's event page) — NOT the "₱2,500 base + ₱1,000/camera + ₱1,000/hour" apparatus model, and NOT the legacy "Pkg 1 ₱4,499 / Pkg 2 ₱7,499" lineup in the revenue section. Charm `-1` PHP-direct pricing applies platform-wide.
> - **Retired add-on prices:** "AI Video Highlight ₱2,000", "AI Edited Highlight ₱5,000", "Custom Monogram Pack ₱2,000", and the SDE/Thank-You-Video numbers cited here are stale. Current catalog: SDE / Same-Day Edit is **RETIRED** · Thank You Video ₱2,499 · the monogram SKU is **"Animated Monogram" ₱1,999** (bundles the animation). Use the ground-truth SKU table.
> - **Crew tiers stay cut:** the Tier 5–8 "Setnayan Team Stream" bundles + province surcharges (₱24,999–₱79,999, with "3% / 11" style commission columns in the Year-1 revenue table) are CUT and were never built — Setnayan supplies no crew labor. Any "3%/5% commission" or "Team tier" math here is a dead revenue model; **platform commission is 0%**.
> - **Sales model:** Panood (like all Setnayan Productions) is sold as a **first-party vendor listing** to couples via apply-then-pay (manual admin approval); free during the launch window (to 31 Mar 2027). The YouTube-only delivery architecture (SFU ingest → server compositor → RTMP → YouTube IFrame embed) remains the intended technical design and is the part of this doc still worth reading.
>
> When this body disagrees with the above, **the above wins.**
>
> **➕ 2026-06-29 price refresh** (live-site sync — supersedes any stale prices in the banner above): Setnayan AI **₱3,999** (paid first paywall) · Animated Monogram **₱1,999** · Live Studio (Panood) multicam **₱3,499/day** (single-cam livestream FREE) · Pakanta **₱2,499** (one SKU) · Cinematic Reveal **₱1,499** · vendor Pro **₱2,499** / Enterprise **₱4,999** per 28-day · **0% commission · verification FREE** · couple website = free 4-in-1 + ONE **Couple Website PRO ₱1,999** (old separate RSVP / RSVP Pro / Event Website / Editorial Website à-la-carte SKUs retired) · couple tiers **Free ₱0 · Setnayan AI ₱3,999** (Essentials/Complete bundles REMOVED 2026-06-29). Canon: `AS_BUILT_GROUND_TRUTH_2026-06-07.md` § 1 + `Pricing.md` § 00.

**Document Version:** 1.1 (FINAL pricing locked)
**Last Updated:** 2026-05-08
**Owner:** Setnayan Product & Engineering
**Status:** Master Technical and Product Reference
**Audience:** Product, Engineering, Operations, Sales, Customer Success

---

## FOR CLAUDE CODE: BUILD INSTRUCTIONS

> **Read this section first.** Everything you need to start building Panood lives below. This document is intended to be single-pass readable: you can consume it top-to-bottom and start writing code without external references (other than dev spec doc 07 for the broader Setnayan system schema).

### Project Context

You are building **Panood**, a multi-camera wedding panooding feature inside the Setnayan wedding-planning platform. Couples (or friends/family/Setnayan crew) operate 3 to 5 phones around a venue. Each phone joins via QR code into a numbered "camera slot." A single broadcaster sees all camera feeds and taps to switch which feed is live. The composed stream is broadcast to YouTube Live, Facebook Live (add-on), and the couple's Setnayan landing page, with auto-recording archived to YouTube + Cloudflare R2.

V1.5 ships as a **WebApp** (browser-based, no install). V2 adds Native iOS/Android apps. **Build V1.5 first.**

### Tech Stack (Locked)

```typescript
// Frontend (camera + broadcaster + landing-page embed)
Framework:       Next.js 14+ (App Router)
UI:              React 18, TypeScript, TailwindCSS
State:           Zustand (real-time camera state)
Realtime sync:   Supabase Realtime (cross-device events)
Hosting:         Cloudflare Pages

// Streaming
SFU:             Cloudflare Stream Live (WebRTC ingest, LL-HLS output, RTMP relay)
Browser capture: navigator.mediaDevices.getUserMedia()
Transport:       WebRTC (RTCPeerConnection + RTCDataChannel)
Player:          YouTube IFrame Player (V1 — ~10 sec latency in ultra-low mode)

// Backend
API:             Hono on Cloudflare Workers (stream session manager)
Database:        Supabase Postgres (with Row-Level Security)
Object storage:  Cloudflare R2 (recording archive + highlight clips)
Compositor:      ffmpeg (server-side overlay rendering, RTMP push)

// External APIs
Live destinations: YouTube Data API v3 (liveBroadcasts/liveStreams),
                   Facebook Graph API Live Video (add-on)
AI:                Anthropic Claude API (AI Video Highlight selection)
Auth:              OAuth 2.0 (YouTube + Facebook crossposting)
```

### Architecture: Plan B (LOCKED)

**Cloud SFU + YouTube delivery (V1).** All camera phones publish WebRTC to Cloudflare Stream Live. The server-side compositor pulls the active feed, applies overlays via ffmpeg, and pushes RTMP to YouTube Live on Setnayan's master channel (Tier 4 also pushes simultaneously to Facebook Live). The couple's landing page embeds the **YouTube IFrame Player** as its video element — viewers see the same broadcast whether they arrive on the landing page or on the direct YouTube watch URL.

This is **confirmed locked** — do not propose self-hosted SFU (MediaSoup) or peer-to-peer alternatives for V1.5. Self-hosting is deferred to V2.5+ once volume justifies operational burden.

See **Part 3** for the full data-flow diagram and **Part 7** for backend infrastructure detail.

### Where to Start

**Sprint 1: Foundation (Weeks 1-3).** See **Part 17** for the full sprint breakdown and **Part 24** for the actionable build checklist. Concretely:

1. Set up the database schema (camera_slots + camera_sessions tables — see Part 8).
2. Create the Cloudflare Stream Live live-input lifecycle helpers (see Appendix B for the API integration template).
3. Wire up YouTube Live broadcast lifecycle (create / bind / transition — Appendix C).
4. Build the QR token generator and the slot join endpoint.
5. Wire webhook handlers for Cloudflare Stream events (stream-started, stream-ended).

### Required External Accounts and Credentials

Before you can run end-to-end, the following must be provisioned (do these in parallel with Sprint 1 development):

| Service | What you need | Lead time |
|---|---|---|
| Cloudflare account | API token with Stream + R2 + Workers + Pages permissions | Same day |
| Cloudflare Stream Live | Live input creation enabled (Standard tier OK for V1.5) | Same day |
| Cloudflare R2 bucket | `setnayan-stream-archive` bucket + access keys | Same day |
| Supabase project | Postgres connection string + service role key | Same day |
| YouTube channel | Verified Setnayan brand channel (apply 2-3 weeks ahead for verification) | 2-3 weeks |
| Google Cloud project | OAuth 2.0 client + YouTube Data API v3 enabled | Same day |
| Facebook Page | Setnayan Business Page with Live Video API permission (`pages_manage_posts`, `pages_read_engagement`); Business Manager verification | 2-3 weeks |
| Anthropic Claude API | API key for AI Video Highlight scoring | Same day |
| Sentry project | DSN for client + worker error tracking | Same day |

### Database Schema Reference

The slot/session schema for Panood is in **Part 8** of this document (camera_slots + camera_sessions tables, includes the takeover-flow logic). The broader Setnayan platform schema (events, couples, landing_pages, deliverables, dashboards) is in **dev spec doc 07** — do not duplicate those tables here, reference them.

### Code Starting Points (Already in This Doc)

| Component | Location |
|---|---|
| Camera operator client (browser WebRTC publish) | **Part 5** — `getUserMedia` + `RTCPeerConnection` to Cloudflare publish endpoint |
| Broadcaster client (multi-stream subscribe + grid UI) | **Part 5** — React component pattern with `useCameraSlots` hook |
| Backend stream session manager | **Part 7** — Hono on Cloudflare Workers, endpoints listed (`createBroadcast`, `joinSlot`, `takeoverSlot`, `endStream`) |
| Cloudflare Stream Live API integration | **Appendix B** — `createLiveInput`, `addOutput` (RTMP) |
| YouTube Live API integration | **Appendix C** — `createBroadcast`, `createStream`, `bind`, `goLive` |
| Facebook Live API integration | **Part 7** — endpoint summary; full integration to be implemented during Sprint 4 (it's an add-on, not base path) |
| Server-side ffmpeg compositor | **Part 10** — sample command line; full pipeline in `services/compositor` |

### Build Order

Follow the sprint plan in **Part 17** and check off items in **Part 24**. Do not jump ahead — Sprint 2 (camera mode) depends on Sprint 1 (slot schema + Cloudflare wiring), and Sprint 3 (broadcaster) depends on Sprint 2 (working camera publish).

---

## Part 1 — Executive Summary

### Why Panood Exists — Presence Across Distance (positioning · owner-stated 2026-06-14)

> **This is the canonical *why*; the multi-camera production tooling described below is the *how*.** Panood is not, at heart, broadcast tooling — it is **presence across distance.** It exists for the people the couple most wants in the room but who cannot physically be there: **the lola who is bedridden, the relatives who are abroad** — anyone whose body can't make it to the venue. Its goal is to give them the chance to **see the wedding as if they were there** — not a grainy single-phone afterthought, but **multiple cameras carrying every angle of the day so no story is left untold.**

Panood is one half of Setnayan's **"presence" pair**, alongside Papic. **Papic** brings the *human moments of the day* to a couple too busy to catch them — the reactions and candids they couldn't see. **Panood** brings the *people who can't attend* into the day itself. Both sell presence, not production. (This is the same split the competitive comparison already draws: *"I want my mom in Toronto to watch"* is Panood; *"I want every candid the photographer missed"* is Papic.) Public copy should lead with **who you bring into the room**, not the camera count.

### What Panood Is

Panood is a multi-camera wedding panooding platform integrated end-to-end with the Setnayan wedding planning suite. Couples (or their friends, family, and Setnayan crew) operate 3 to 5 phones around a wedding venue. Each phone is onboarded by scanning a QR code that ties it to a numbered "camera slot." A single broadcaster — sitting at a phone, tablet, or laptop — sees a live preview grid of every camera and taps to switch which feed is "live" at any moment. The composed live feed is broadcast simultaneously to YouTube Live, Facebook Live, and the couple's own Setnayan landing page, with auto-recording archived to both YouTube and Cloudflare R2.

The product is delivered in two technical tracks:

1. **WebApp Track (V1.5)** — Browser-based camera and broadcaster clients. No app install required. Friends and family on any modern smartphone can join in seconds via QR code.
2. **Native App Track (V2)** — iOS and Android native apps with full manual camera controls, background streaming, deep Bluetooth audio integration, and improved thermal management.

Both tracks share the same backend infrastructure (Cloudflare Stream Live SFU + server-side compositor + RTMP relay), so couples upgrading from WebApp to Native get a seamless experience and existing event setups migrate cleanly.

### Why It Matters Competitively

The Philippines wedding industry has historically priced multi-camera professional panooding at ₱40,000 to ₱150,000, almost exclusively as a service delivered by traditional video houses. Smartphone-based panooding exists (Facebook Live from a single phone, basic YouTube broadcasts), but there is no player offering a structured 3-to-5 camera, app-driven workflow at impulse-purchase pricing.

Setnayan's positioning is unique: **app-native multi-camera panooding starting at ₱4,500 self-serve, scaling to ₱9,000 at the top of the V1 lineup.** Apparatus-priced tiers (V1) cover the "we just want family abroad to see the wedding" use case at the entry tier through the full DIY production setup at Tier 4. Coverage on every tier = the couple's full event window — no hour gates. (The original spec scaled to ₱79,999 with crew-bundled tiers; those are cut from V1 per the apparatus pricing rule and may revive as a separate "Setnayan Pro Services" line in the future.)

Competitive moat:

- **Software-defined leverage.** Each marginal stream costs Setnayan roughly ₱200-400 in cloud fees on the entry tier. Margins exceed 80% at the DIY tiers.
- **QR onboarding.** Friends and family operate cameras within 60 seconds of scanning a QR. Traditional video houses cannot match this distribution model.
- **Integrated landing page.** The panood is embedded on the couple's existing Setnayan landing page, where invited guests already check schedules, RSVP, and view the gallery. No separate streaming URL to share.
- **Auto-archival.** Every stream is automatically saved to YouTube and Cloudflare R2; couples need no separate upload step.

### Target Year-1 Attach Rate

**25% of paid couples** will purchase a streaming package. With Setnayan's Year-1 target of 1,500 paying couples, this translates to **375 streaming events** in the first 12 months of streaming-feature general availability.

### V1 architecture revision (2026-05-09 · revised same day)

This master spec was originally drafted with an 8-tier lineup spanning DIY app tiers and crew-bundled "Setnayan Team" service tiers, plus a dual-delivery model using Cloudflare Stream Player on the landing page alongside YouTube. The V1 architecture has been simplified along three axes during the 2026-05-09 pricing review:

**Apparatus-only pricing rule.** Every Setnayan SKU prices the software resource the couple unlocks — capability flags, app-access counts, or finite computational resources Setnayan's infrastructure provides (camera slots, hours of stream capacity). It does NOT price hardware (couples bring their own phones), crew labor (Setnayan supplies no operators), or "hours of coverage" (a labor unit). The crew-bundled Tiers 5–8 are cut from V1; the ₱999 Wedding Ceremony +3 hrs add-on is cut.

**YouTube as sole delivery.** Viewer delivery happens entirely through YouTube. Setnayan ingests via Cloudflare Stream Live SFU and composites server-side, then RTMP-relays to YouTube on Setnayan's master channel. The couple's landing page embeds the YouTube IFrame Player. No Cloudflare Stream Player embed, no per-tier viewer cap. YouTube absorbs all viewers at zero marginal cost.

**Base + add-ons pricing model.** V1 ships a single Panood base SKU at ₱2,500 (1 broadcaster + 3 cameras + 3 hours of stream capacity), plus two capacity add-ons (+₱1,000 per camera, max +2; +₱1,000 per hour, unlimited). The Native iOS/Android camera-operator app track is DROPPED from V1 — pure WebApp + YouTube delivery. The 4-tier model (WebApp 3-cam / 5-cam, Native 3-cam / 5-cam) used briefly in earlier 2026-05-09 drafts is superseded by the base + add-ons model.

The sections below have been updated to reflect V1. Architecture parts further down (compositor, audio, overlay system, etc.) describe the underlying mechanics and remain accurate; references to "Cloudflare Stream Player landing-page embed" or "Native track" should be read as historical and replaced by current V1 architecture (YouTube IFrame Player, WebApp-only) wherever they appear in lower sections.

### Pricing Structure At-a-Glance (V1)

V1 ships a single Panood base SKU plus two capacity add-ons. All units are software resources Setnayan's infrastructure provides.

**Base SKU**

| Item | What's included | Price |
|---|---|---|
| Panood — Base | 1 broadcaster + 3 cameras + 3 hours of stream capacity | **₱2,500** |

**Capacity add-ons**

| Add-on | What it adds | Price each | Limit |
|---|---|---|---|
| +1 Camera | Adds one more camera slot to the broadcast | ₱1,000 | Multi-purchase up to **+2** (max 5 cameras) |
| +1 Hour | Adds one more hour of stream capacity | ₱1,000 | Multi-purchase, **unlimited** |

**Service add-ons (event-wide, not capacity-based)**

| Add-on | Price | Multi-purchase? |
|---|---|---|
| Custom Monogram Pack (remove watermark + apply couple's monogram across Panood broadcast, Papic exports, Personal Reels, gallery chrome) | ₱2,000 | One per event |
| Broadcast Style Pack (4 modes — News / Cinematic / Sports / Royalty — plus transitions, color presets, animated scene cards; broadcaster can switch styles mid-event) | ₱3,000 | One per event |
| AI Video Highlight — 60 seconds (quick social clip from broadcast) | ₱2,000 | Yes, unlimited |
| AI Edited Highlight — 3 minutes (themed multi-segment reel from broadcast + papic photos; auto-inherits Broadcast Style if owned) | ₱5,000 | Yes, unlimited |

**NOT in V1 (deferred):**

- Same-Day Edit (SDE) — the Filipino tradition of a 3-min reel edited DURING the reception. Would require ~₱9,500 per event in vision-AI + LLM + manual QA costs at realistic quality, plus brand-damaging failure mode if AI breaks. Revisit in V1.1 once vision AI gets cheaper.
- Cinematic feature film (15+ min) — required human editor labor, violates apparatus rule. Would need a separate "Setnayan Pro Services" line.

**Worked pricing examples**

| Configuration | Total |
|---|---|
| Base (3 cams × 3 hrs) | ₱2,500 |
| 5 cams × 3 hrs (base + 2 cam add-ons) | ₱4,500 |
| 5 cams × 5 hrs (base + 2 cam + 2 hr add-ons) | ₱6,500 |
| 5 cams × 8 hrs (base + 2 cam + 5 hr add-ons) | ₱9,500 |
| 5 cams × 12 hrs (base + 2 cam + 9 hr add-ons) | ₱13,500 |

Couples bring their own phones; Setnayan provides the WebApp + backend that orchestrates them into a multi-cam YouTube broadcast.

**Cut from V1:**

- Tiers 5–8 (Setnayan Team Stream tiers) — bundled crew labor violates the apparatus rule; deferred indefinitely. Sections preserved further down for historical reference but NOT part of V1.
- Tiers 3–4 (Native iOS/Android camera-operator apps) — dropped from V1; the V1 camera operator client is browser-only. Native app architecture sections preserved further down for historical reference.
- Wedding Ceremony +3 hrs add-on — sold hours of crew coverage; violates apparatus rule.
- Standalone Facebook Live ₱499 add-on — cut from V1; couples wanting Facebook can re-broadcast the YouTube stream themselves.
- Province surcharges — no Setnayan crew travels in V1, so there are no surcharges.
- Hardware kits as wallet SKUs — sold separately as physical products (tripod kit ₱1,500, audio boost kit ₱1,500, combined kit ₱2,500).

### Two Tracks: Webapp (V1.5 Launch) and Native App (V2)

The WebApp track ships first because (a) build effort is smaller (6-8 weeks), (b) it eliminates app-install friction for the friends-and-family camera operators who power the entry tiers, and (c) it lets us validate demand and pricing before investing in native app builds.

The Native App track ships second (V2, 12-16 weeks after V1.5 launch) and unlocks the higher-value Native Pro tiers, primarily by removing the four hard limitations of mobile browsers: background streaming, manual camera controls, deep Bluetooth audio integration, and thermal management.

---

## Part 2 — Product Tiers & Pricing

### Panood — Base SKU (₱2,500) + capacity add-ons

**One-line pitch:** "Live-stream your wedding to YouTube. Pay for the camera count and stream length you actually need."

**What ₱2,500 unlocks (the base SKU):**

- 1 broadcaster + 3 camera slots (browser-based capture, no app install required for camera operators)
- 3 hours of stream capacity (counted from when the broadcast starts)
- Streams up to 1080p (auto-downgrades to 720p if low connection)
- Server-side compositor with default Setnayan monogram (replaceable via Custom Monogram Pack)
- Lower-third overlays, scene/schedule cards, broadcaster-typed live captions
- RTMP relay to YouTube Live on Setnayan's master channel
- YouTube IFrame Player embedded on the couple's landing page
- YouTube auto-archive of the recording (couple downloads from dashboard)
- Email/Setnayan dashboard support during event
- Up to 10 saved overlay presets per event

**Capacity add-ons (multi-purchase from the same wallet):**

- **+1 Camera** at ₱1,000 each, multi-purchase up to +2 (max 5 cameras total)
- **+1 Hour** at ₱1,000 each, multi-purchase unlimited

**Conditions:**

- Must follow Setnayan's setup guidelines (compatibility check, position planning, network test)
- Can be bought last minute (no advance booking required)
- Human crew is NOT a Setnayan offering in V1 — couples recruit their own friends/family operators
- Camera operators run a browser page on their phones, not a native app (Native iOS/Android camera apps cut from V1)

**Cost to Setnayan:** ~₱120 per event at base config (3×3) / ~₱280 at 5×5 / ~₱630 at 5×12.
**Margin:** ~95% across the entire range — every camera-hour add-on covers ~₱60 of incremental Setnayan cost while pricing at ₱1,000.

**Best for:**
- Couples who only want to broadcast the ceremony or only the reception → base SKU at ₱2,500 covers it
- Couples who want full reception coverage with multiple angles → base + 2 cameras + 2 hours = ₱6,500
- Couples broadcasting their full day prep → reception → send-off → base + 2 cameras + 5+ hours = ₱9,500+

### Service Add-ons (V1 — apply to any Panood broadcast)

| Add-on | Price | What it does |
|--------|-------|--------------|
| Custom Monogram Pack (Remove Watermark) | ₱2,000 | Single event-wide flag — removes the Setnayan watermark and replaces it with the couple's monogram across Panood broadcast, Papic photo exports + reels, Personal Reels, and gallery chrome on the landing page. See Part 9.7. |
| AI Video Highlight (per 60 seconds, multi-purchase) | ₱2,000 | AI-compiled 60-second highlight reel using Claude AI to select the best moments from broadcast clips. See Part 9.6. |

**Pricing examples (couple's typical journey):**
- Just streaming the ceremony, 3-cam basic: ₱2,500
- Whole reception, 5-cam × 5-hr: ₱6,500
- 5-cam × 5-hr + Custom Monogram Pack: ₱8,500
- 5-cam × 8-hr + Custom Monogram Pack + 1 AI Highlight: ₱13,500
- Marathon broadcast, 5-cam × 12-hr + Custom Monogram + 3 AI Highlights: ₱21,500

**Add-ons that were CUT from V1:**

- Facebook Live ₱499 standalone — couples can re-broadcast the YouTube URL to Facebook themselves
- Custom Overlay + Custom Standby ₱1,999 — superseded by Custom Monogram Pack (event-wide scope)
- Wedding Ceremony coverage ₱999 — sold hours of crew coverage, violates apparatus pricing rule
- The 4-tier WebApp/Native lineup (₱4,500 / ₱7,500 / ₱5,000 / ₱9,000) — superseded by base + add-ons

---

> **⚠ Tiers 3–4 (Native iOS/Android camera-operator apps) are CUT FROM V1.** The two sections below describe the V2 Native track from earlier 2026-05-09 drafts. V1 ships pure WebApp + YouTube delivery — every camera operator runs a browser-based capture page, no app install required. The Native track may return as a V2 effort once the WebApp version proves out launch-time demand, but it is NOT in V1.
>
> Content preserved below for historical / V2 reference only. Do NOT register these as services in `service_catalog`. Do NOT surface them in checkout.

---

### Tier 3: Panood Native — 3-cam (₱5,000) **— CUT FROM V1**

**One-line pitch:** "Pro-quality panood with 3 phones — manual controls, background streaming, thermal management."

**Apparatus included:**

- 1 broadcaster + up to 3 phone slots (using native iOS or Android Setnayan app — V2)
- Everything in Tier 1
- **Plus:** Manual camera controls (tap-to-focus area, exposure compensation, ISO, shutter speed, white balance lock)
- **Plus:** Background streaming — phone continues streaming when screen is locked or another app is foregrounded
- **Plus:** Better thermal management with early heat warnings
- **Plus:** Torch/flash control on iOS (not available in WebApp)
- **Plus:** RAW preview metadata (helps broadcaster anticipate exposure issues)
- **Plus:** Bluetooth lavalier microphone deep integration
- **Plus:** Custom audio routing
- **Plus:** Stabilization mode selection (cinematic / standard / off)
- **Coverage:** the couple's full event window

**Cost to Setnayan:** ~₱270 per event at 5 hrs / ~₱590 at 12 hrs (slightly higher than WebApp tiers due to higher-bitrate compositor output).
**Margin:** 88–94%.

**Note:** Tier 3 registers as a service in V1 but only becomes buyable when the V2 native apps ship. Couples who buy a V1 tier and want Native capability after V2 launches can upgrade by spending the price difference.

**Best for:** Tech-savvy couples or photographer/videographer-friend operators who want pro camera control. Also the right answer for outdoor afternoon weddings where heat throttling kills WebApp streams.

### Tier 4: Panood Native — 5-cam (₱9,000) **— CUT FROM V1**

**One-line pitch:** "Top of the V1 lineup — 5 native cameras, dual-platform streaming, advanced overlays."

**Apparatus included:**

- 1 broadcaster + up to 5 phone slots (native)
- Everything in Tier 3
- **Plus:** Simultaneous Facebook Live (dual-platform broadcast — bundled, not a separate add-on)
- **Plus:** Advanced overlay system (animated lower thirds, Ken-Burns motion overlays, picture-in-picture)
- **Plus:** Picture-in-picture support (e.g., main feed = bride at altar; PIP corner = groom's reaction)
- **Plus:** Animated scene transitions (slide, fade, push)
- **Plus:** HDR streaming (where supported)
- **Coverage:** the couple's full event window

**Cost to Setnayan:** ~₱430 per event at 5 hrs / ~₱950 at 12 hrs (HDR + PiP + animated overlays raise compositor cost ~50% over Tier 2).
**Margin:** 89–95%.

**Note:** Tier 4 also gates on V2 native app shipping. Tier 4 unlocks Facebook Live as a bundled feature (the standalone ₱499 Facebook Live add-on is gone in V1).

**Best for:** Couples whose friend agreed to operate the app and who want broadcast-quality DIY at the top of the V1 SKU lineup.

---

> **⚠ Tiers 5–8 are CUT FROM V1.** The four sections below describe crew-bundled service tiers from the original spec draft. They violate the apparatus-only pricing rule (each tier bundles Setnayan crew labor and on-site staff) and are deferred indefinitely. They may return as a separate "Setnayan Pro Services" line of business in the future, but they are NOT part of the V1 software platform's SKU set.
>
> Content preserved below for historical reference only. Do NOT register these as services in `service_catalog`. Do NOT surface them in checkout. Do NOT include them in V1 pricing comparisons.

---

### Tier 5: Setnayan Team Stream — Reception Only (₱24,999) **— CUT FROM V1**

**One-line pitch:** "Setnayan crew runs your reception panood end-to-end, 4 to 6 hours."

**Included:**

- 1 Setnayan Staff broadcaster (operates the app, switches cameras, manages overlays)
- 1 Setnayan roving camera operator (handheld camera with gimbal)
- App access for friends/family to add additional camera angles (web or native)
- 4-6 hours coverage (reception only — not ceremony)
- Audio mixer integration (XLR + audio interface routed into broadcaster phone or laptop)
- Bluetooth lavalier microphone on the MC
- Coordinated pre-event setup (Setnayan crew arrives 2 hours before doors open)
- Full overlay suite (Package 2 features)
- Both YouTube Live + Facebook Live
- Auto-archival (YouTube + R2)

**Cost to Setnayan:** ~₱14,500 per event (crew labor + travel + audio gear + broadcast infrastructure).
**Margin:** 42%.

**Best for:** Couples whose ceremony will be intimate (so DIY is fine for the church) but whose reception is large and they want a polished broadcast for the speeches, dances, and toast moments.

### Tier 6: Setnayan Team Stream — Full Event + Recording (₱39,999) **— CUT FROM V1**

**One-line pitch:** "Setnayan crew covers your whole wedding day, 8 to 12 hours, with raw recordings delivered."

**Included:**

- Everything in Tier 5
- Full event coverage (typically 8-12 hours: prep, ceremony, reception, send-off)
- Crew of 2 to 3 (broadcaster + roving camera + audio engineer)
- Raw recording delivered on USB drive **and** cloud download (both)
- Pre-event venue walkthrough (Setnayan lead arrives 1 day before to scout)
- Backup broadcaster phone on-site

**Cost to Setnayan:** ~₱25,000 per event.
**Margin:** 38%.

**Best for:** Couples who want their entire day panooded without lifting a finger and who want raw footage so they can edit a personal video later.

### Tier 7: Premium with Edited Highlight (₱49,999) **— CUT FROM V1**

**One-line pitch:** "Tier 6 plus a 5-minute edited highlight reel delivered within a week."

**Included:**

- Everything in Tier 6
- 5-minute edited highlight reel
- Delivery: 1 week post-event
- Music licensing included (Setnayan's licensed catalogue)
- Color graded
- Two rounds of revisions

**Cost to Setnayan:** ~₱30,000 per event.
**Margin:** 40%.

**Best for:** Couples who want the panood archive **and** something polished to share on social media in the days following the wedding, without paying full cinematic prices.

### Tier 8: Premium Cinematic Broadcast (₱79,999) **— CUT FROM V1**

**One-line pitch:** "Three pro cameras, full crew, same-day edit at reception, 6-week cinematic feature film."

**Included:**

- 3 pro broadcast cameras (Sony FX3 / Canon C70 class) operated by full crew
- Full crew (4-6 people: 3 camera operators + director + audio + editor)
- Cinematic feature film (15-25 minutes runtime)
- Delivery: 6-8 weeks post-event
- Same-day edit (3-4 minute reel) shown live at the reception
- Drone footage where allowed (CAA-permitted operator)
- Live stream output (broadcaster + RTMP to YouTube + Facebook)
- All raw footage delivered on hard drive
- Full color grade + sound mix

**Cost to Setnayan:** ~₱40,000 per event.
**Margin:** 50%.

**Best for:** Top 5% of couples who want a flagship-quality wedding film and a same-day edit moment at the reception. This tier sells Setnayan's brand at the top.

### Add-Ons (legacy table — see "Standalone Add-ons (V1)" above for the active V1 list)

> **⚠ V1 has only two software add-ons** (Custom Monogram Pack, AI Video Highlight) registered in `service_catalog`. The expanded add-on table below is from the original draft and is **partially CUT from V1**:
>
> - **Hardware kits** (Phone Tripod Kit, Audio Boost Kit, Combined Setup Kit) — sold separately as physical products in the Setnayan web store, NOT through the wallet, NOT bundled into any tier. They are "couple buys this on top if they want," not part of any tier's apparatus SKU.
> - **Highlight upgrades** (1-min teaser, 5-min highlight, Same-Day Edit) — CUT from V1. The 5-min and same-day edits required Setnayan crew or editors to produce; they violate the apparatus rule. The AI Video Highlight at ₱2,000 (per 60s, multi-purchase) covers the "polished short reel" need software-only.
> - **Facebook Live add-on ₱499** — CUT from V1 as a standalone SKU. Folded into Tier 4 as a bundled capability.

| Add-on | Price | Notes |
|--------|-------|-------|
| Phone Tripod Kit (3 tripods + return shipping) | ₱1,500 | Hardware (separate product, not a Setnayan software SKU) |
| Audio Boost Kit (Bluetooth lavalier + adapter) | ₱1,500 | Hardware (separate product) |
| Combined Setup Kit (tripods + audio) | ₱2,500 | Hardware (separate product, bundle saving) |
| 1-min teaser highlight (24-hour delivery) | ₱2,999 | **CUT from V1** — required editor labor |
| 5-min highlight reel (1-week delivery) | ₱9,999 | **CUT from V1** — required editor labor |
| Same-Day Edit (3-min, shown at reception) | ₱14,999 | **CUT from V1** — required editor labor |
| Facebook Live add-on (Package 1 or 2) | ₱499 | **CUT from V1** as standalone — bundled into Tier 4 |

### Province Surcharges **— CUT FROM V1**

> No Setnayan crew travels in V1, so there are no surcharges. Section preserved for historical reference (will return if a future "Setnayan Pro Services" line revives the crew tiers).

Setnayan's crew tiers (5, 6, 7, 8) include travel within Metro Manila. Outside MM, surcharges apply to cover crew transit, lodging, and venue access fees.

| Region | Surcharge |
|--------|-----------|
| CALABARZON (Cavite, Laguna, Batangas, Rizal, Quezon) | +₱2,000 |
| Other Luzon | +₱5,000 |
| Visayas / Mindanao | +₱8,000 |
| Boracay / Palawan / Siargao | +₱12,000 |

WebApp and Native DIY tiers (1-4) have no surcharges since no Setnayan crew travels.

---

## Part 3 — System Architecture (V1: YouTube-only delivery)

### High-Level Data Flow

```text
                    ┌─────────────────────────────────┐
Camera 1 (phone) ──>│                                 │
Camera 2 (phone) ──>│   Setnayan SFU Media Server         │
Camera 3 (phone) ──>│   (Cloudflare Stream Live)      │
Camera 4 (phone) ──>│                                 │
Camera 5 (phone) ──>│                                 │
                    └────────┬────────────────────────┘
                             │
                             ├── Low-res preview tiles ──> Broadcaster
                             │                              (taps to switch active cam)
                             │
                             ├── Active feed full-quality ──> Server-side compositor
                             │                                 (monogram, lower-thirds, PiP, standby)
                             │                                       │
                             │                                       ▼
                             │                              RTMP push ──> YouTube Live
                             │                                              (Setnayan master channel,
                             │                                               unlisted, monetization off,
                             │                                               ultra-low-latency mode)
                             │                                                     │
                             │                                                     ▼
                             │                                              YouTube CDN
                             │                                                     │
                             │                          ┌──────────────────────────┴──────────────────────────┐
                             │                          ▼                                                     ▼
                             │             setnayan.com/[event-slug] embeds                          Direct YouTube watch URL
                             │             the YouTube IFrame Player                              (couples can share for
                             │             (branded landing-page experience)                       smart-TV viewers)
                             │
                             └── Recording archive ──> YouTube auto-archive (master channel, unlisted)
```

### Component Breakdown

**1. Camera Client (Web or Native)**
Each camera operator's phone runs either the Setnayan WebApp camera page (in browser) or the Setnayan Native app's camera mode (V2). The client:

- Captures video and audio from the device
- Encodes (browser uses VP8/VP9; native uses H.264 hardware encoder)
- Uploads via WebRTC to the SFU
- Listens for control messages (e.g., "switch to 720p," "show heat warning," "you've been replaced")
- Displays minimal status UI (battery, network, "you are LIVE" indicator)

**2. Setnayan SFU Server (Cloudflare Stream Live — INGEST ONLY)**
The Selective Forwarding Unit (SFU) receives incoming streams from up to 5 cameras and routes them downstream to:

- The broadcaster (low-resolution preview tiles, plus full-quality of the active camera)
- The compositor (full-quality of whichever camera is currently active)

In V1, Cloudflare Stream Live's role is **ingest and routing only**. Its delivery / playback functionality is NOT used — viewer delivery happens entirely through YouTube.

**3. Server-Side Compositor**
A backend service running ffmpeg takes the active camera's full-quality feed and overlays:

- The couple's monogram (configurable corner / position based on Custom Monogram Pack design choice)
- The hashtag bug (bottom right, default)
- The ● LIVE badge (top left)
- Lower thirds, scene cards, and animated transitions when triggered by the broadcaster
- Picture-in-picture composition (Tier 4)
- Custom Standby screens during broadcaster-triggered breaks
- Theme-colored borders and accent elements

The composited output is encoded for YouTube ingest and pushed via RTMP. The compositor is the load-bearing component that ensures every viewer surface (landing-page IFrame embed, direct YouTube URL) sees the same fully-branded broadcast.

**4. RTMP Relay (single destination in V1)**
The composited stream is pushed via RTMP to:

- **YouTube Live on Setnayan's master channel** — sole delivery destination in V1. Created via YouTube Data API at event setup with monetization explicitly disabled and ultra-low-latency mode enabled.
- Facebook Live (Tier 4 only — bundled, not standalone) — secondary RTMP destination. The Cloudflare relay can push to multiple RTMP endpoints simultaneously.
- Custom RTMP destinations (V2 — Instagram, Twitch, custom URL — out of V1 scope)

**5. Embedded Player (YouTube IFrame on Setnayan Landing Page)**
The couple's Setnayan landing page (`setnayan.com/[event-slug]`) embeds the YouTube IFrame Player as its video element. Embed parameters: `controls=1`, `modestbranding=1`, `rel=0`, `iv_load_policy=3`, `playsinline=1`. End-to-end latency lands at ~10 seconds in YouTube's ultra-low-latency mode.

The full wedding's branded UI (RSVP, gallery, schedule widget, mood board) renders around the embedded player on the same Setnayan page. Viewers get the wedding-hub experience plus YouTube's free CDN delivery. Setnayan's per-event delivery cost is **₱0** regardless of audience size.

**6. Recording Archive (YouTube auto-archive only in V1)**
Every broadcast is auto-archived by YouTube on Setnayan's master channel as an unlisted video, indefinite retention, free. Couples download from their Setnayan dashboard via a link that resolves the YouTube watch URL through the Data API.

(The original spec called for a parallel Cloudflare R2 archive of the composited output as a "Setnayan authoritative archive" — that's removed from V1 to avoid paying for storage of content that's already free on YouTube. The R2 source-frames archive of individual camera feeds during ingest is retained for post-event editing service flows that may run in a future iteration.)

---

## Part 4 — Camera Capabilities Comparison: WebApp vs Native

### Feature Matrix

| Feature | WebApp | Native iOS | Native Android |
|---------|--------|------------|----------------|
| Camera capture (1080p) | ✓ | ✓ | ✓ |
| Front/rear camera switch | ✓ | ✓ | ✓ |
| Auto focus | ✓ | ✓ | ✓ |
| Manual focus (tap-to-focus area) | ⚠ Limited | ✓ Full | ✓ Full |
| Auto exposure | ✓ | ✓ | ✓ |
| Manual exposure (compensation) | ⚠ Browser-dependent | ✓ Full (ISO, shutter) | ✓ Full |
| White balance manual | ⚠ Limited | ✓ | ✓ |
| Torch/flash control | ✗ iOS / ⚠ Android | ✓ | ✓ |
| Optical zoom (multi-lens phones) | ⚠ Limited | ✓ | ✓ |
| Digital zoom (pinch) | ✓ via UI | ✓ | ✓ |
| Background streaming (screen-locked) | ✗ ~30 sec on iOS | ✓ Foreground service | ✓ Foreground service |
| Hot battery management | ⚠ OS handles | ✓ App can warn early | ✓ App can warn early |
| Bluetooth lavalier integration | ⚠ Browser dependent | ✓ Deep integration | ✓ Deep integration |
| Custom audio routing | ✗ | ✓ | ✓ |
| RAW metadata | ✗ | ✓ | ✓ |
| Stabilization mode selection | ✗ | ✓ | ⚠ Some devices |
| HDR streaming | ✗ | ✓ | ✓ |
| Push notifications | ⚠ PWA only | ✓ | ✓ |
| Heat throttling early warning | ✗ | ✓ | ✓ |

### WebApp Camera APIs

The browser stack relies on three Web APIs:

```javascript
// 1. Capture media
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    frameRate: { ideal: 30 },
    facingMode: 'environment'
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }
});

// 2. Adjust at runtime (zoom, focus)
const [videoTrack] = stream.getVideoTracks();
const capabilities = videoTrack.getCapabilities();
if (capabilities.zoom) {
  await videoTrack.applyConstraints({ advanced: [{ zoom: 2.0 }] });
}

// 3. Torch (Android only, varies by browser)
if (capabilities.torch) {
  await videoTrack.applyConstraints({ advanced: [{ torch: true }] });
}
```

Browser support floor:
- **Safari 14.5+** (iOS 14.5+)
- **Chrome 80+** on Android
- **Firefox 80+** on Android (limited torch)
- **Samsung Internet 14+** (good torch support on Samsung devices)

WebApp limitations:
- Torch on iOS Safari is unsupported (security policy).
- Background streaming dies on iOS within 30 seconds of screen lock.
- Manual focus is only available in browsers exposing the `focusDistance` capability — this is hit-or-miss across Android browsers.

### Native APIs

**iOS (AVFoundation):**

```swift
let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back)!
try device.lockForConfiguration()
device.focusMode = .continuousAutoFocus
device.exposureMode = .continuousAutoExposure
device.unlockForConfiguration()
```

**Android (Camera2):**

```kotlin
val builder = cameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_RECORD)
builder.set(CaptureRequest.CONTROL_AF_MODE, CONTROL_AF_MODE_CONTINUOUS_VIDEO)
builder.set(CaptureRequest.CONTROL_AE_MODE, CONTROL_AE_MODE_ON)
session.setRepeatingRequest(builder.build(), null, handler)
```

Both platforms expose thermal-state APIs (`ProcessInfo.thermalState` on iOS, `PowerManager.getCurrentThermalStatus()` on Android API 29+) that the Setnayan app polls every 5 seconds to give early heat warnings.

---

## Part 5 — WebApp Architecture (V1.5 Implementation)

### Stack

- **Browser target:** any modern mobile browser (Safari 14.5+, Chrome 80+).
- **Camera capture:** `getUserMedia()`.
- **Streaming:** WebRTC via `RTCPeerConnection` plus `RTCDataChannel` for control signaling.
- **SFU:** Cloudflare Stream Live (WebRTC ingest endpoint).
- **Overlay rendering:** HTML5 Canvas API with WebGL acceleration where available.
- **Broadcaster UI:** React + Next.js, deployed on Cloudflare Pages.
- **State:** Zustand store for real-time camera states, Supabase Realtime for cross-device sync.
- **Backend:** Supabase Postgres (slot/session schema), Hono workers on Cloudflare for the stream session manager.

### Camera Operator (Publish) Code Example

```javascript
// Camera operator's phone (browser)
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    frameRate: { ideal: 30 },
    facingMode: 'environment'
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }
});

const pc = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.cloudflare.com:3478' }
  ]
});

stream.getTracks().forEach(track => pc.addTrack(track, stream));

const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

// Exchange SDP with Cloudflare Stream Live ingest API
const resp = await fetch(`https://customer-${customerId}.cloudflarestream.com/${liveInputId}/webRTC/publish`, {
  method: 'POST',
  body: JSON.stringify({ sdp: offer.sdp }),
  headers: { 'Content-Type': 'application/json' }
});
const { sdp: answerSdp } = await resp.json();
await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
```

### Broadcaster (Subscribe) Code Example

```javascript
// Broadcaster's phone or laptop (browser)
const cameras = useCameraSlots(eventId); // 5 RTCPeerConnections, one per slot

return (
  <div className="broadcaster-grid">
    {cameras.map(camera => (
      <video
        key={camera.id}
        ref={el => attachStream(el, camera.stream)}
        autoPlay
        playsInline
        muted={camera.id !== activeCameraId}
        onClick={() => switchToCamera(camera.id)}
        className={camera.id === activeCameraId ? 'live' : 'preview'}
      />
    ))}
  </div>
);

async function switchToCamera(cameraId) {
  // Tell the server-side composer to swap the active feed
  await fetch(`/api/events/${eventId}/active-camera`, {
    method: 'POST',
    body: JSON.stringify({ cameraId, transition: 'crossfade-300ms' })
  });
}
```

### WebApp Limitations and Workarounds

| Limitation | Workaround |
|------------|------------|
| iOS background tab throttles after 30 sec | Pre-event briefing: keep tab visible, plug into power, set screen timeout to "Never" |
| No torch on iOS Safari | Use external lavalier mic with built-in light, or position cameras toward existing light |
| No persistent service | Encourage PWA install (Add to Home Screen); shows fullscreen UI and slightly improves keep-alive |
| Limited camera control | Default settings work for 90% of weddings. Pro users upgrade to Native tier. |
| Heat throttling | Setnayan monitors per-camera framerate; auto-degrades resolution; broadcaster gets warning |

### Build Effort

**6-8 weeks** with Claude Code + 1 human reviewer + 1 designer (part-time).

---

## Part 6 — Native App Architecture (V2 Implementation)

### Stack

- **iOS:** Swift, AVFoundation, WebRTC SDK (Google's libwebrtc), SwiftUI for chrome.
- **Android:** Kotlin, Camera2 API, WebRTC SDK, Jetpack Compose for chrome.
- **Backend:** Same as WebApp (Cloudflare Stream Live SFU).
- **Alternative considered:** React Native with native modules for camera and WebRTC. Decided against for V2 because camera control performance is too critical.

### Native iOS Camera Control Example

```swift
// Manual focus
guard let device = AVCaptureDevice.default(for: .video) else { return }
try device.lockForConfiguration()

device.focusMode = .autoFocus
device.focusPointOfInterest = CGPoint(x: 0.5, y: 0.5)

// Manual exposure
device.exposureMode = .custom
device.setExposureModeCustom(
  duration: CMTime(value: 1, timescale: 60), // 1/60 sec
  iso: 400,
  completionHandler: nil
)

// Torch
if device.hasTorch {
  device.torchMode = .on
}

device.unlockForConfiguration()
```

### Native Android Camera Control Example

```kotlin
val builder = cameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_RECORD)
builder.set(CaptureRequest.CONTROL_AF_MODE, CaptureRequest.CONTROL_AF_MODE_AUTO)
builder.set(CaptureRequest.SENSOR_SENSITIVITY, 400) // ISO
builder.set(CaptureRequest.SENSOR_EXPOSURE_TIME, 1_000_000_000L / 60) // 1/60 sec in ns

cameraSession.setRepeatingRequest(builder.build(), null, null)
```

### Why Native Justifies Higher Pricing

1. **Background streaming reliability.** A foreground service on iOS (`AVAudioSession` + background mode `audio`/`voip`) and on Android (`Service.startForeground()` with `mediaProjection` type) keeps the stream alive when the screen is off. WebApp dies in 30 seconds.

2. **Better camera quality from manual controls.** Many Filipino weddings have tricky lighting: dim church interiors mixed with bright stained-glass windows; outdoor receptions in direct sun. Manual exposure lock prevents the "auto-exposure dance" that ruins long ceremony shots.

3. **Lower battery drain.** Native code is ~2x more efficient than WebRTC-in-a-browser for the same workload. A camera phone that lasts 90 minutes in WebApp lasts 3+ hours in Native.

4. **Better thermal management.** Native apps can read thermal state and proactively reduce framerate or resolution before throttling kicks in, rather than waiting for the OS to drop frames silently.

5. **Bluetooth audio deep integration.** Native gets full access to the iOS `AVAudioSession.Category.playAndRecord` with `bluetoothA2DP` option, enabling reliable Bluetooth lavalier mic capture. Browsers can't reliably specify Bluetooth as the input source.

### Build Effort

**12-16 weeks** with Claude Code + 1 human reviewer (split between iOS and Android specialists, even if part-time).

---

## Part 7 — Backend Infrastructure

### Cloudflare Stream Live (Recommended SFU)

- WebRTC ingest from phones (camera operators)
- HLS / Low-Latency HLS output for player
- RTMP push to YouTube + Facebook simultaneously
- Auto-recording to Cloudflare R2
- PH-region edge servers (Manila + Singapore)

**Pricing:**
- $1 per 1,000 minutes of ingest
- $5 per 1,000 minutes stored (storage; ~$0.015/GB-month equivalent)
- $0.85 per 1,000 minutes-viewed

**Per-event cost:** ~₱200-400 depending on duration and viewer count.

### Alternative: LiveKit Cloud

- Open-source SFU with well-documented SDKs (Web, iOS, Android, Flutter, React Native)
- Better customization for edge cases
- Requires Setnayan to manage RTMP push + recording externally

**Pricing:** $0.005 per participant-minute.

**Per-event cost:** ~₱150-300 (slightly cheaper at low volumes).

### Self-Hosted (V2+ Only, After Demand Validated)

- MediaSoup + Node.js running on bare-metal or hosted VMs
- ffmpeg for RTMP relay
- Server cost: ₱8,000-15,000/month per region
- Break-even at ~30 concurrent events per region

This is **deferred to V2.5+** because the operational burden (uptime, scaling, debugging) is not justified at projected volumes.

### YouTube Live API Setup

- Create Setnayan's verified YouTube channel.
- OAuth 2.0 for backend access (Setnayan's own service-account-style flow, with couple's permission to crosspost via OAuth scope `https://www.googleapis.com/auth/youtube`).
- YouTube Data API v3:
  - `liveBroadcasts.insert` — creates a broadcast.
  - `liveStreams.insert` — gets the RTMP key.
  - `liveBroadcasts.bind` — connects them.
  - `liveBroadcasts.transition` — start (`live`) and end (`complete`).
- Auto-archives all broadcasts to Setnayan's YouTube channel and to the couple's optional connected channel.

### Facebook Live API Setup

- Create the Setnayan Page.
- Business Manager verification.
- Get Panooding permission (`pages_manage_posts`, `pages_read_engagement`).
- Use Live Video API:
  - `POST /me/live_videos` — creates a broadcast, returns RTMP URL + stream key.
  - Manage start/stop via Graph API.
  - Crosspost to couple's Facebook page if connected via OAuth.

### Backend Service Architecture

```text
┌────────────────────────────────────────────────────────┐
│                Setnayan Stream Backend                    │
├────────────────────────────────────────────────────────┤
│                                                        │
│   Stream Session Manager (Hono on Cloudflare Workers) │
│     - createBroadcast(eventId, tier)                  │
│     - joinSlot(qrToken, deviceFingerprint)            │
│     - takeoverSlot(slotId, newSessionId)              │
│     - endStream(eventId)                              │
│                                                        │
│   WebSocket Server (Realtime Camera State)            │
│     - per-camera health (bitrate, battery, heat)      │
│     - active camera switches                          │
│     - lower-third overlays                            │
│                                                        │
│   ffmpeg Relay (Compositor + RTMP push)               │
│     - input: active feed from Cloudflare              │
│     - overlay: monogram, hashtag, lower thirds        │
│     - output: RTMP to YouTube + Facebook              │
│                                                        │
│   Recording Manager                                   │
│     - R2 bucket per event                             │
│     - YouTube archive metadata                        │
│     - couple-dashboard download URLs                  │
│                                                        │
│   Monitoring & Alerting                               │
│     - Sentry for client errors                        │
│     - Cloudflare Analytics for stream health          │
│     - PagerDuty for critical event-day issues         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Part 8 — Camera Slot System (Session Takeover)

### Why Slot-Based Architecture

Wedding camera operators are unreliable: a designated friend's phone dies mid-ceremony; an aunt agrees to film the cocktail hour but not the reception; the Setnayan crew brings a backup phone if a primary fails. Hard-binding a camera to a single phone ID means any device swap requires admin intervention.

The solution is **slot-based**: each event has 5 fixed "camera slots" (Camera 1, Camera 2, etc.). A slot is a stable identity (with a fixed QR code, label, and order). The phone currently filling the slot is a transient session that can be replaced at any time by another phone scanning the same QR.

### Schema

```sql
CREATE TABLE camera_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  slot_number INTEGER NOT NULL CHECK (slot_number BETWEEN 1 AND 5),
  slot_label TEXT NOT NULL, -- "Wide Angle", "Tight Closeup", "Crowd"
  qr_token TEXT UNIQUE NOT NULL,
  current_session_id UUID REFERENCES camera_sessions(id),
  status TEXT NOT NULL DEFAULT 'inactive', -- 'inactive' | 'active' | 'swapping'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, slot_number)
);

CREATE TABLE camera_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES camera_slots(id) ON DELETE CASCADE,
  phone_fingerprint TEXT NOT NULL,
  operator_name TEXT,
  device_info JSONB, -- iPhone model, OS version, etc.
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  ended_reason TEXT, -- 'replaced' | 'manual_disconnect' | 'timeout' | 'network_lost'
  webrtc_session_id TEXT NOT NULL
);

CREATE INDEX idx_camera_sessions_slot ON camera_sessions(slot_id);
CREATE INDEX idx_camera_sessions_active ON camera_sessions(slot_id) WHERE ended_at IS NULL;
```

### Takeover Flow

1. New phone scans QR for slot N.
2. Backend detects an active session in slot N.
3. New phone shows confirmation: **"Take over Camera N from [Previous Operator]?"**
4. On confirm: 3-second grace period.
5. Old phone shows: **"[New Operator] is taking over in 3 seconds..."**
6. Auto-switch: WebRTC session ends on old phone, new session starts on new phone.
7. Broadcaster sees: **"Camera N — device changed (Old → New)"** banner for 5 seconds.
8. Live stream continues uninterrupted (1-2 second preview gap, smoothed by the crossfade transition).

### QR Generation

- Each event has 5 unique QR tokens (one per slot, generated at event creation time).
- QR encodes: `https://setnayan.com/[event-slug]/cam/[slot-token]`.
- Couple receives 5 acrylic table-tents (printed by Setnayan) and 5 digital QR codes (downloadable PDF).
- Each slot also has a label: "Wide Angle," "Closeup," "Crowd," "Roving," "Reaction" — printed under the QR for clarity.

### Edge Cases

- **Slot full and operator quits without phone:** Setnayan's broadcaster can manually evict a session via the broadcaster app. Backend ends the session and reopens the slot.
- **Network drop on operator phone:** Session marked as 'inactive' after 60 seconds of no heartbeat. Slot becomes available for takeover. Old phone reconnects → if slot is empty, resumes; if slot is taken, gets the takeover prompt itself.
- **Two phones scan the same QR within 100ms:** The first to complete WebRTC handshake wins. The second gets "Slot is being claimed, please retry."

---

## Part 9 — Broadcaster Mode

### UI Layout (5-Camera, Package 2 Example)

```text
┌─────────────────────────────────────────────────────────┐
│ Maria & Juan Wedding · Live · 02:34:18 elapsed   ⚙ ⚐  │
├─────────────────────────────────────────────────────────┤
│ ┌────────────┐ ┌────────────┐ ┌────────────┐           │
│ │ ◉ LIVE     │ │ Cam 2      │ │ Cam 3      │           │
│ │ Cam 1      │ │ [preview]  │ │ [preview]  │           │
│ │ Wide Angle │ │            │ │            │           │
│ │ Carlo      │ │ Marco      │ │ Sarah      │           │
│ └────────────┘ └────────────┘ └────────────┘           │
│ ┌────────────┐ ┌────────────┐                           │
│ │ Cam 4      │ │ Cam 5      │                           │
│ │ [preview]  │ │ [preview]  │                           │
│ │ Lisa       │ │ Anna       │                           │
│ └────────────┘ └────────────┘                           │
│                                                         │
│ Audio source: Cam 1 ▼                                  │
│ Active overlay: "First Dance"                          │
│ [Add lower third]   [Switch theme]   [End stream]      │
└─────────────────────────────────────────────────────────┘
```

### Features

- **Tap any preview tile** to switch the live feed (1-2 second crossfade).
- **Audio source selector** — pick which camera's microphone is in the stream (independent of which video is live).
- **Lower-third quick-add** — pre-built templates: Welcome, First Dance, Speeches, Cake Cutting, Send-off; plus custom typed-in-the-moment caption.
- **Theme switcher** — change overlay colors live without breaking the stream.
- **Network/battery indicators** per camera — green/yellow/red indicators on each tile.
- **Heat warnings** — if a camera phone is approaching thermal throttling.
- **Stream health panel** — bitrate, dropped frames, viewer count (YouTube + Facebook combined).
- **Recording indicator** — red dot when YouTube archive is recording.
- **End stream confirmation** — two-tap with "Are you sure?" because mid-event termination is hard to recover from.

### Broadcaster Hardware

- **Recommended:** iPhone 13 Pro / Galaxy S22 Ultra or newer; or laptop browser.
- **Optimal:** iPad / tablet (large screen for 5-camera grid).
- **Acceptable:** Any "Recommended" camera phone (see Phone Compatibility).

The broadcaster device is more demanding than the camera phones because it's downloading 5 simultaneous WebRTC streams (low-res previews) plus the active feed full-quality, plus rendering the UI at 60fps.

---

## Part 9.5 — Highlight Reel Button Feature

### Description

The Highlight Reel Button is a dedicated control in the broadcaster UI that lets the broadcaster mark specific moments during the event for inclusion in the post-event highlight reel. It captures both the moments leading up to the press AND the duration the broadcaster holds the button down.

- A large red **HIGHLIGHT** button is anchored in the corner of the broadcaster screen.
- **Press-and-hold** behavior: when pressed and held, Setnayan marks a highlight clip.
- Captures: **the last 5 seconds BEFORE the button was pressed** + **the duration the button is held down**.
- Records ONLY what is being streamed (the active camera feed at that moment), NOT all 5 cameras simultaneously.
- Each press creates one highlight clip; broadcaster can press multiple times throughout the event.
- Each clip is automatically tagged with timestamp and the active camera at that moment.
- Visual indicator: when active, a red recording-marker appears on screen so the broadcaster knows the highlight is being captured.

### Technical Implementation

- **Server-side rolling buffer** of the last 5 seconds of the active stream is maintained continuously and refreshed at all times.
- When the broadcaster presses HIGHLIGHT:
  - Backend snapshots the last 5 seconds from the rolling buffer.
  - Starts capturing additional frames as long as the button is held.
  - When released: combines pre-press 5sec + held duration into one highlight clip.
  - Saves the clip to the highlight reel collection for this event.
- Stored on **Cloudflare R2** with metadata: `{ timestamp, active_camera_slot, duration_sec, event_id }`.
- Maximum highlight duration per clip: **60 seconds** (button auto-releases after 60sec to prevent runaway clips).

### Broadcaster UI

- Large red **HIGHLIGHT** button in the corner of the broadcaster screen.
- Live counter showing how many highlights have been captured ("7 highlights captured").
- Captured highlights appear in a sidebar with **thumbnail + timestamp + duration**.
- Broadcaster can **delete an individual highlight** if accidentally pressed.
- Visible recording-marker overlays on the broadcaster's preview while the button is held.

### UI Layout (Broadcaster — Highlight Active)

```text
┌─────────────────────────────────────────────────────────┐
│ Maria & Juan Wedding · Live · 02:34:18    7 highlights │
├─────────────────────────────────────────────────────────┤
│ [5-camera grid as in Part 9]                            │
│                                                         │
│ Sidebar (highlights captured):                          │
│   ▸ #7  02:34:09  18s  Cam 3  [thumb] 🗑               │
│   ▸ #6  01:58:22   9s  Cam 1  [thumb] 🗑               │
│   ▸ #5  01:42:11   4s  Cam 2  [thumb] 🗑               │
│                                                         │
│                              ┌──────────────────────┐  │
│                              │ ◉ HIGHLIGHT (hold)   │  │
│                              └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Part 9.6 — AI Video Highlight (Auto-compiled Highlight Reel)

### Description

When the broadcaster taps **End Stream**, Setnayan automatically compiles all highlight clips captured during the event into a single short-form **AI Video Highlight** reel. This is branded as "AI Video Highlight" because Claude AI is used to intelligently select the best moments from the captured clips.

- Output is a **single video compilation, maximum 60 seconds total** (per add-on purchase).
- Claude AI scores each clip across motion energy, audio peaks, smile/face detection, scene relevance, and emotional beat — then selects the best 60 seconds for compilation.
- Couples can purchase additional 60-second compilations (per add-on, ₱1,999 each) if they want longer highlights.
- The final highlight reel is delivered to the couple as part of their post-event package.

### Technical Implementation

- **Backend service** is triggered on stream end (broadcaster taps "End Stream").
- **ffmpeg** compiles clips with smooth transitions (**0.5 sec crossfades**).
- **Background music** is optional — chosen from a royalty-free library or uploaded by the couple.
- **Theme overlays applied:** lower thirds with timestamps, couple's monogram, wedding hashtag.
- **Output:** max 60 seconds, **1080p MP4**.
- **Delivery:** 5–15 minutes after the event ends, available in the couple's dashboard.
- **Auto-uploads** to Setnayan's YouTube channel as a Setnayan reel + downloadable MP4 in the couple's deliverables.

### Pricing

- **Included** when the couple purchases the **Create AI Video Highlight (per 60 seconds) add-on (₱1,999)**.
- **Each ₱1,999 purchase = one 60-second compiled highlight reel.** Couples wanting longer highlights buy multiple add-ons (e.g., 2 × ₱1,999 = two 60-second reels).
- **Without the add-on:** highlight clips are still saved (raw clips available in the dashboard) but **are not auto-compiled**. The couple receives the raw clip collection only.

### Configuration Options for Couple

- **Music selection:** 3–5 royalty-free options, or upload your own track.
- **Pacing:** slower transitions (cinematic) vs energetic cuts (social-media-ready).
- **Title card:** with couple's names and date.
- **Closing card:** with hashtag and Setnayan branding (Pro / Custom Overlay add-on removes Setnayan branding).

---

## Part 9.7 — Watermark & Branding Policy (V1)

### Default Behavior (All V1 Tiers — ₱4,500 / ₱7,500 / ₱5,000 / ₱9,000)

- All panoods include the **Setnayan watermark** in the corner by default.
- All YouTube auto-archived recordings have the Setnayan watermark baked in.
- All compiled AI Video Highlights show the Setnayan branding intro/outro.
- Auto-overlay always includes: **couple's monogram (top-right) + Setnayan watermark (bottom-right)**.
- The pre-stream and break-time **Standby screen** uses Setnayan's default template (couple's names + Setnayan branding).

### Custom Monogram Pack — Branding Upgrade (V1)

Unlocked via the **Custom Monogram Pack (₱2,000)** — a single event-wide flag that applies across Panood, Papic, Personal Reels, and gallery chrome:

- Remove Setnayan watermark from streams, YouTube recordings, and highlight reels.
- Add the couple's own logo or monogram in the chosen design (4 templates × portrait/landscape variants).
- Customize intro/outro on the highlight compilation.
- **Custom Standby screen:** the screen shown before stream starts and during breaks — couples can fully customize this (e.g., "Wedding ceremony starts at 2 PM" countdown, "Reception begins shortly" transition cards, intermission cards).
- Brand-free deliverables for couples who want pure personal branding.

### Tier Breakdown (V1)

| Tier | Default Setnayan Watermark | With Custom Monogram Pack (₱2,000) |
|------|------------------------|-------------------------------------|
| ₱4,500 (Tier 1, WebApp 3-cam) | Required by default | Removed; couple's monogram + custom standby |
| ₱7,500 (Tier 2, WebApp 5-cam) | Required by default | Removed; couple's monogram + custom standby |
| ₱5,000 (Tier 3, Native 3-cam, V2-gated) | Required by default | Removed; couple's monogram + custom standby |
| ₱9,000 (Tier 4, Native 5-cam, V2-gated) | Required by default | Removed; couple's monogram + custom standby |

The Custom Monogram Pack is the single branding upgrade across all V1 tiers — no per-tier branding bundling. The crew tiers (₱24,999+) and cinematic tier (₱79,999) from the original draft included branding by default, but they are CUT FROM V1 (see Part 2 banner).

### Why Default Setnayan Watermark

- **Marketing:** every Setnayan stream is a marketing piece for the Setnayan brand.
- **Distribution:** viewers see "Powered by Setnayan" → couples discover Setnayan organically.
- **Removal as upgrade:** creates a clear, easy-to-explain premium tier (the ₱1,999 Custom Overlay + Custom Standby unlock).

### Implementation

- Server-side overlay compositing **always** includes the couple's monogram.
- Setnayan watermark layer is **added by default**; removed via flag if Pro unlock (Custom Overlay add-on or higher tier) is present.
- **Custom logo upload:** couple uploads via dashboard (PNG with transparency), stored in R2, applied to all stream outputs (live + recording + highlight reel) automatically.

---

## Part 10 — Overlay & Theme System

### Auto-Overlays (Always On, All Tiers)

- **Couple's monogram** — top-right, 200px wide, ~12% screen width. Sourced from the couple's Setnayan brand kit.
- **Wedding hashtag bug** — bottom-right, smaller, with the couple's hashtag (e.g., `#MariaAndJuanForever`).
- **● LIVE badge** — top-left, animated pulsing red dot.
- **Optional schedule indicator** — small text bottom-left: "Ceremony starts in 15 min" or "Now: First Dance."

### Lower Thirds (Package 2 and Up)

Pre-built templates:

| Template | Use Case |
|----------|----------|
| Welcome | Opening of the broadcast |
| First Dance | Couple's first dance moment |
| Speeches | Best man, maid of honor, parents |
| Cake Cutting | Cake-cutting ceremony |
| Send-Off | Final dance and exit |
| Custom | Broadcaster types in the moment |

Behavior:
- Auto-applies couple's theme colors.
- Animated entrance (slide-up, 0.5 sec).
- Auto-dismiss after specified duration (default 10 sec, broadcaster can extend).
- Stays in queue: "Show now" or "Save for later."

### Theme System

Themes apply to all overlays consistently across the stream. They match the couple's existing landing-page theme automatically (synced from the Setnayan theme system).

| Theme | Palette | Typography |
|-------|---------|------------|
| **Filipino-Catholic Warm** | Terracotta + Cream + Gold | Serif (Playfair / Cormorant) |
| **Modern Minimalist** | Black + White + Soft Gold | Sans (Inter / Helvetica) |
| **Garden Romance** | Sage + Blush + Cream | Serif Romantic (Cormorant) |
| **Beach Destination** | Azure + Coral + Sand | Sans Relaxed (DM Sans) |
| **Editorial Monochrome** | Charcoal + White + Single Accent | Serif Bold (Tiempos) |

### Implementation in WebApp

- HTML5 Canvas API.
- 1920×1080 OffscreenCanvas (so it can render off the main thread).
- Render at 30fps to match the stream framerate.
- Composite: video + monogram + hashtag + dynamic overlays.
- Stream output via MediaRecorder + WebRTC.

This is **client-side compositing** — happens on the broadcaster's phone in V1.5. Pros: no server cost. Cons: the broadcaster phone has to be powerful.

### Server-Side Compositing (V2)

The server-side compositor (running in the Setnayan backend) takes over compositing. ffmpeg with the `overlay` filter handles all overlay rendering.

```bash
ffmpeg -i webrtc-input.flv \
  -i monogram.png -i hashtag.png \
  -filter_complex "[0:v][1:v]overlay=W-w-20:20[a];[a][2:v]overlay=W-w-20:H-h-20" \
  -c:v libx264 -preset veryfast -b:v 4500k \
  -c:a aac -b:a 128k \
  -f flv rtmp://a.rtmp.youtube.com/live2/{stream-key}
```

Server-side gives:
- Higher quality output (full server CPU/GPU vs phone).
- Animated overlays without taxing the phone.
- Lower latency for broadcaster (less work on phone).

V2 makes server-side compositing the default for all tiers; V1.5 uses client-side because it's simpler to ship.

---

## Part 11 — Audio Architecture

### WebApp Audio Capture

- `getUserMedia()` with `audio: { echoCancellation, noiseSuppression, autoGainControl }`.
- Sample rate: 48 kHz.
- Channels: 2 (stereo) or 1 (mono).
- Codec: Opus (default in WebRTC).

### Audio Source Options Per Tier

**DIY tiers (₱4,499 / ₱7,499):**
- Default: ambient phone microphone on whichever camera the broadcaster designates as the audio source.
- Add-on **Audio Boost Kit** (₱1,500): Bluetooth lavalier paired to the camera-1 phone (or to the broadcaster's phone for ceremony coverage).

**Team tiers (₱24,999+):**
- Setnayan audio engineer coordinates with the venue.
- XLR cable from the venue mixer → USB-C/Lightning audio interface (e.g., Rode AI-Micro) → broadcaster's phone or laptop.
- Backup: shotgun mic at the broadcaster's location.

**Premium tier (₱79,999):**
- Multi-mic setup.
- Boom mic for ceremony vows.
- Direct mixer feed.
- Backup ambient mics.
- Real-time audio mixing (live audio engineer with portable mixer).

### Bluetooth Lavalier Integration

**WebApp:**
- Limited support in browsers.
- Workaround: phones with USB-C / Lightning audio adapters connected to wired lavalier mics work reliably in `getUserMedia`.

**Native:**
- Full Bluetooth audio API access (iOS `AVAudioSession`, Android `MediaRecorder` with `AUDIO_SOURCE_BLUETOOTH_SCO`).
- Setnayan Native app pairs with the lavalier and sets it as the active audio source.

### Audio Mixing During Stream

- Default: pass-through from the designated audio source camera.
- V2: mix multiple audio sources (designated + ambient).
- Audio levels meter visible to the broadcaster — VU meter showing peaks on the active audio feed; broadcaster can mute/swap audio sources without changing the active video.

### Audio Sync

WebRTC handles A/V sync automatically. When swapping audio sources mid-stream, there's a 200-400ms glitch as the audio path switches. The broadcaster app smooths this with a 300ms crossfade between old and new audio.

---

## Part 12 — Network & Bandwidth Requirements

### Per-Camera Bandwidth (1080p H.264)

- **Upload:** 4 Mbps stable (recommended 6 Mbps for headroom).
- **Latency:** <100ms to PH-region edge.

### Broadcaster Bandwidth

(Architecture A: server-side compositing — broadcaster only sees previews, not full feeds.)

- **Download:** 8-15 Mbps (5 thumbnail previews + 1 active feed at full quality).
- **Upload:** <100 Kbps (control signals only).

### Connection Recommendations

| Connection | Camera phone | Broadcaster phone |
|------------|--------------|-------------------|
| 5G | ✓ Excellent | ✓ Excellent |
| Strong LTE (4 bars) | ✓ Good | ✓ Good |
| Fair LTE (2-3 bars) | ✓ Acceptable | ⚠ Marginal |
| Weak LTE (1 bar) | ✗ Will drop frames | ✗ Insufficient |
| Venue Wi-Fi (good) | ⚠ Often crowded with guests | ⚠ Use as backup only |
| Venue Wi-Fi (poor) | ✗ Don't use | ✗ Don't use |

### Pre-Event Speed Test (Built into Setnayan App)

Run at each camera position **1 hour before** the event.

- Measures: upload speed, latency, jitter.
- Pass criteria: ≥6 Mbps stable upload, <150ms latency, <30ms jitter.
- Auto-recommendations:
  - "Switch to LTE — Wi-Fi is too slow"
  - "Move closer to a window — signal is weak here"
  - "Use cellular instead of Wi-Fi"
  - "Try a different position — this corner has no coverage"

### Auto-Quality Adjustment

- If upload drops below 4 Mbps mid-stream, auto-downgrade to 720p.
- If upload drops below 1.5 Mbps, downgrade to 480p (last resort).
- If reconnect fails 3 times, auto-disconnect that camera and notify the broadcaster.
- The broadcaster can re-enable manually when the network stabilizes.

### Failover Strategy

For the team tiers, Setnayan crew brings:
- A backup mobile hotspot (different carrier from the venue's primary).
- Wired Ethernet adapter for the broadcaster device (when possible).
- A cellular signal booster for venues with weak cellular.

---

## Part 13 — Phone Compatibility Requirements

### Camera Operator Phones (Any of 3-5 Cameras)

**Recommended:**
- iPhone 12 / 13 / 14 / 15 (all variants)
- Pixel 6 / 7 / 8
- Samsung Galaxy S21 / S22 / S23 / S24
- OnePlus 9 / 10 / 11

**Acceptable:**
- iPhone 11
- Pixel 4 / 5
- Samsung S10 / S20
- Mid-range Android 2021+ (Xiaomi Redmi 10+, Realme 8+, Vivo Y31+)

**Not recommended:**
- iPhone X or older
- Pre-2020 Androids
- Budget phones with poor cameras (<2020 mid-range)

### Broadcaster Phones (More Demanding)

**Recommended:**
- iPhone 13 Pro+ / iPhone 14 / 15 Pro
- Samsung Galaxy S22 Ultra+ / S23 Ultra+
- Pixel 7 Pro / 8 Pro

**Acceptable:**
- Any "Recommended" camera phone
- iPhone 12 Pro+

**Not recommended:**
- Anything older than 2021
- Single-tier mid-range phones

### Compatibility Check Flow (in Setnayan App)

1. Friend scans QR for the first time.
2. App displays the **Compatibility Check** wizard.
3. Tests:
   - Camera access (resolution support — try 1920×1080@30, fall back to 1280×720@30).
   - Microphone access.
   - WebRTC support (RTCPeerConnection availability).
   - Network bandwidth (3-second upload test).
   - Battery health (if accessible — only on Native).
4. Result: ✓ Ready / ⚠ Limited mode / ✗ Not supported.
5. If acceptable but limited: stream at 720p instead of 1080p.

### Gracefully Handling "Not Supported"

When a phone fails the check:
- Show a clear message: "Sorry, this phone can't stream live. Ask the couple if someone else has a newer phone."
- Suggest alternative roles: "You can still help by photographing for the wedding album."
- Don't block — let the user retry on a different network.

---

## Part 14 — Pre-Event Setup Workflow

### 1 Week Before Event

- [ ] Compatibility check on all 3-5 phones (operators run the test from home).
- [ ] Brief camera operators on what to film at each moment (Setnayan provides a 1-page cheat sheet).
- [ ] Print 5 acrylic QR table-tents (one per slot) — Setnayan ships these.
- [ ] Prepare rental kit if ordered (Tripod Kit / Audio Kit / Combined).
- [ ] Schedule venue speed test (if possible — coordinate with venue manager).

### 1 Day Before Event

- [ ] Charge all phones to 100%.
- [ ] Distribute power banks to camera operators.
- [ ] Confirm broadcaster has cooling pad / well-ventilated location (not in direct sun).
- [ ] Test Setnayan app login on all devices.

### Day of Event (3 Hours Before Guests Arrive)

- [ ] All operators arrive with phones.
- [ ] Run Setnayan app speed test at each camera position.
- [ ] Position phones (tripods/gimbals).
- [ ] Operator tests: scan QR, confirm camera shows up in broadcaster preview.
- [ ] Broadcaster tests: switch between cameras, send test instructions.
- [ ] Audio test: designate the primary audio source, verify levels.
- [ ] Network failover test: verify backup Wi-Fi is available.

### 30 Minutes Before Event

- [ ] Plug all phones into power (this is non-negotiable for events >2 hours).
- [ ] Final position check.
- [ ] Operator briefing: "follow broadcaster's instructions, keep phone screen on, don't touch the phone unless asked."
- [ ] Start YouTube broadcast (private/unlisted by default, transitions to public when the actual ceremony starts).
- [ ] Verify embed working on couple's landing page.
- [ ] All cameras live to broadcaster.

### Event Begins

- Stream goes live to YouTube + landing page (and Facebook if enabled).
- Broadcaster operates throughout.
- Setnayan monitors stream health remotely (alerts if issues — Sentry hooks + on-call rotation for team tiers).

---

## Part 15 — Day-of Operations & Troubleshooting

### Common Issues & Resolutions

| Issue | Resolution |
|-------|------------|
| Camera disconnects | Auto-retry 3x, then notify broadcaster; another phone can take over via QR scan |
| Phone overheating | Pause that camera; switch to backup; cool the phone (move to shade, remove case) |
| Battery dying | Plug in immediately; or hand QR to next operator's phone for takeover |
| Stream lag/buffering | Auto-downgrade to 720p; check network; Setnayan SRE checks edge server health |
| Broadcaster phone freezing | Have backup broadcaster phone ready; second device can scan broadcaster QR |
| YouTube broadcast errors | Switch to backup RTMP key; or stream to Facebook only temporarily |
| Audio dropout | Switch audio source to a different camera; or activate Bluetooth lavalier |
| Single camera only shows static / black | Operator likely hit lock screen; remind operator to keep screen on (or upgrade to Native) |
| Stream stuck on YouTube but landing page works | YouTube ingest healthy; check Setnayan backend RTMP relay logs |

### Setnayan App Monitoring Dashboard (Broadcaster Sees)

- **Per-camera:** status (●live/preview/disconnected), bitrate, latency, battery, heat.
- **Stream health:** bitrate to YouTube, dropped frames, viewer count.
- **Network:** bandwidth used, errors.
- **Time elapsed.**
- **Recording status:** archiving on/off.

### Alerts (Push Notifications to Broadcaster)

- Camera disconnected
- Phone battery <20%
- Phone heat critical
- Network drop detected
- Stream interrupted

### Setnayan Backend Monitoring (For Setnayan SRE on Team Tiers)

- Stream session health (every event-day stream is monitored).
- RTMP push success to YouTube + Facebook.
- Recording archive integrity.
- Edge server health by region.
- Customer-impacting alerts route to PagerDuty for team-tier events; lower-priority alerts go to Slack for DIY tiers.

---

## Part 16 — Post-Event Deliverables

### Auto-Delivered (All Tiers)

- YouTube auto-saved recording (full broadcast, ~24-hour processing for HD).
- Cloudflare R2 backup (Setnayan's archive copy, immediately available).
- Both available in the couple's Setnayan dashboard.
- Download button: full MP4 (1080p H.264).

### Tier-Specific Deliverables

**WebApp tiers (1-2):**
- Raw recording: auto-delivered next day.
- Stream URL on landing page: archived view (replaces the live player after the event ends).

**Native tiers (3-4):**
- Same as WebApp + multi-track recording (each camera's individual feed for post-edit option).
- Multi-track is delivered as a ZIP of MP4s in the couple's dashboard.

**Team tiers (5-6):**
- Edited highlight reel (5 min) within 1 week (Tier 7 only).
- Multi-track raw recordings on USB hard drive shipped to couple.
- Cloud download of all raw footage (R2 link, 30-day expiration unless extended).

**Premium Cinematic (Tier 8):**
- Same-Day Edit shown at the reception (3-4 min).
- Full cinematic feature film (15-25 min) within 6-8 weeks.
- Drone footage (separate file).
- All raw footage on hard drive.

### Storage and Retention

- **YouTube:** permanent (couple's profile + Setnayan channel).
- **Cloudflare R2:** 5 years included; extend via the **Lifetime Album** add-on (₱4,999 one-time for 50-year retention).
- Couple can download anytime for permanent personal storage.

### Privacy & Visibility

- By default, YouTube broadcasts are **unlisted** during the event (only people with the link can view).
- After the event, the couple can choose **public** or **keep unlisted**.
- The Setnayan landing page embed respects whatever visibility the couple sets.
- The couple owns the recordings and can request takedown at any time.

---

## Part 17 — Implementation Roadmap

### V1.5 (WebApp Launch — 6-8 Weeks)

**Sprint 1 (weeks 1-3): Foundation**
- Camera slot management + QR generation
- Cloudflare Stream Live integration (WebRTC ingest)
- YouTube Live API setup (OAuth, broadcast lifecycle)
- Backend stream session manager
- Database schema + Row-Level Security

**Sprint 2 (weeks 4-5): WebApp Camera Mode**
- `getUserMedia()` camera capture
- WebRTC peer connection to Cloudflare
- QR scan + slot join flow
- Compatibility check wizard
- Speed test integration

**Sprint 3 (weeks 6-7): Broadcaster Mode**
- Multi-stream preview UI
- Tap-to-switch with crossfade
- Audio source selector
- Lower-thirds quick-add
- Theme application
- Server-side overlay compositing
- RTMP push to YouTube
- Network/battery health indicators

**Sprint 4 (weeks 7-8): Polish & Launch**
- Landing page embed (YouTube IFrame Player — V1)
- Recording archive flow
- Couple dashboard integration
- Documentation + tutorial videos
- Beta test with 5 weddings (free or heavily discounted)
- Production launch

### V1.5+ (Iteration — 4 Weeks After Launch)

- Facebook Live integration (additional RTMP target)
- Audio Boost Kit support (Bluetooth lavalier)
- Phone Tripod Kit fulfillment
- Edit highlight reel workflow (manual editor + delivery pipeline)

### V2 (Native App — 12-16 Weeks)

**Sprint 1 (weeks 1-4): iOS Native App**
- Swift + AVFoundation camera control
- WebRTC SDK integration (libwebrtc)
- Manual focus/exposure UI
- Foreground service for background streaming
- Bluetooth lavalier deep integration

**Sprint 2 (weeks 5-8): Android Native App**
- Kotlin + Camera2 API
- Same feature parity as iOS
- Foreground service equivalent
- Bluetooth A2DP audio routing

**Sprint 3 (weeks 9-12): Native Broadcaster**
- Native multi-stream preview (better performance)
- Picture-in-picture support
- Animated overlays
- Hardware-accelerated compositing

**Sprint 4 (weeks 13-16): Polish & Ship**
- App Store + Play Store submissions
- Hybrid mode: WebApp camera + Native broadcaster (transition path for users who only have a Native broadcaster phone but operators with mixed phones)
- Migration tools for existing WebApp users (their slot URLs continue to work; the QR opens the Native app if installed, falls back to web)

### V2.5 (Premium Tier — 8 Weeks)

- Pro broadcast camera integration (via OBS Studio as a virtual camera input)
- Drone footage workflow (drone uploads to Setnayan R2 immediately, broadcaster can switch to drone feed)
- Same-Day Edit pipeline (editor app + delivery to AV team at the reception)
- Cinematic feature film editor workflow (footage organization, marker syncing, music licensing)
- Multi-platform simulcast (YouTube + Facebook + Instagram + custom RTMP)

---

## Part 18 — Pricing & Cost Breakdown Summary (V1)

### Base + add-ons cost summary

V1 prices the apparatus the couple unlocks. Cost to Setnayan scales with camera count and stream duration only — audience size does not affect Setnayan's bill (YouTube absorbs all viewers at zero marginal cost).

**Panood apparatus**

| Configuration | Couple pays | Setnayan cost | Margin |
|---|---|---|---|
| Base only (3 cams × 3 hrs) | ₱2,500 | ~₱120 | 95% |
| 5 cams × 3 hrs (base + 2 cam add-ons) | ₱4,500 | ~₱180 | 96% |
| 5 cams × 5 hrs (base + 2 cam + 2 hr add-ons) | ₱6,500 | ~₱280 | 96% |
| 5 cams × 8 hrs (base + 2 cam + 5 hr add-ons) | ₱9,500 | ~₱430 | 95% |
| 5 cams × 12 hrs (base + 2 cam + 9 hr add-ons) | ₱13,500 | ~₱630 | 95% |

**Cost line breakdown** at the typical 5-cam × 5-hr event (~₱280 total):

| Cost line | Approx |
|---|---|
| Cloudflare Stream Live ingest (5 cams × 5 hrs × ~₱6/cam-hr) | ₱150 |
| R2 archive (composited broadcast for any post-event editing flows) | ₱50 |
| Compositor compute (Workers / ffmpeg) | ₱30 |
| RTMP relay outbound to YouTube | ₱0 (free egress on Cloudflare) |
| YouTube ingest + delivery + archive | ₱0 (YouTube's infra) |
| Misc (signaling, broadcaster admin session, monogram asset reads) | ₱50 |

### V1 Add-On Margins

| Add-on | Price | Cost | Margin |
|--------|-------|------|--------|
| Custom Monogram Pack | ₱2,000 | ~₱5 (one-time monogram asset generation if auto) | ~99% |
| Broadcast Style Pack (4 modes + transitions + color presets) | ₱3,000 | ~₱5 (compositor template/LUT swaps, no new infra) | ~99% |
| AI Video Highlight (60s, multi-purchase) | ₱2,000 | ~₱10 (Claude API + 60s ffmpeg render) | ~99% |
| AI Edited Highlight (3 min, multi-purchase) | ₱5,000 | ~₱30 (Claude API for edit-decision LLM + ffmpeg + theme template) | ~99% |

### Tiers / Add-Ons / Surcharges CUT FROM V1

The original draft included service-tier crew bundles (Tiers 5–8), province surcharges, hardware kits as wallet SKUs, and editor-labor highlight reels. All of these violate the apparatus-only pricing rule and are cut from V1. Their original numbers are preserved in the legacy sections of Part 2 for historical reference but are NOT part of the V1 economic model.

If a future "Setnayan Pro Services" line of business revives crew tiers, those sections become the starting point — but they would NOT register as services in `service_catalog`, since `service_catalog` is reserved for Setnayan software platform SKUs.

---

## Part 19 — Monetization & Conversion Strategy

### Pricing Psychology (V1)

- **₱4,500 entry tier** creates impulse-buy access for panooding. Most couples will try. Full event coverage included — no hour gates. Couples can layer the Custom Monogram Pack (₱2,000) and one or more AI Video Highlights (₱2,000 each) to lift AOV.
- **₱7,500 second tier** captures couples wanting more cameras (5 phones) and richer overlays (lower-thirds, scene cards, 10 saved presets). Final pricing landed at ₱7,500 to maintain healthy price separation from Tier 1 while reflecting the production value of 5 phones plus advanced overlays.
- **₱5,000 / ₱9,000 native tiers (Tier 3 / Tier 4)** position as "premium quality" upgrades — manual controls, background streaming, thermal management. Native tiers are positioned alongside the WebApp tiers without cannibalization because they sell on *quality* rather than *reach*. They register as services in V1 but only become buyable when V2 native apps ship.
- **Custom Monogram Pack (₱2,000)** is the cross-cutting branding upgrade — replaces Setnayan branding with the couple's monogram across Panood, Papic, Personal Reels, and gallery chrome. Single event-wide flag, multi-iteration value.
- **AI Video Highlight (₱2,000 per 60s, multi-purchase)** lets couples buy a polished short reel without commissioning editor labor. Couples typically buy 1–3 of these.
- **Service-tier framing** (₱24,999+) and **cinematic flagship** (₱79,999) — both deferred indefinitely from V1 with the apparatus-rule lock. Their psychology applies only to a future "Setnayan Pro Services" line of business that does NOT live in this Setnayan software platform.

### Conversion Funnel

- Free guest tier sees couples' wedding stream → exposure to Setnayan brand.
- ~25% target attach rate among paying couples.
- Year-1 target: 1,500 weddings × 25% = 375 streaming events.

### Year-1 Revenue Mix Prediction

**Base tier mix (375 streaming events):**

| Tier | Mix % | Volume | Per-Unit | Revenue |
|------|-------|--------|----------|---------|
| Panood Pkg 1 (₱4,499) | 60% | 225 | ₱4,499 | ₱1,012,275 |
| Panood Pkg 2 (₱7,499) | 20% | 75 | ₱7,499 | ₱562,425 |
| Native Pkg 1 Pro (₱4,999) | 5% | 19 | ₱4,999 | ₱95k |
| Native Pkg 2 Pro (₱8,999) | 5% | 19 | ₱8,999 | ₱171k |
| Team Reception (₱24,999) | 5% | 19 | ₱24,999 | ₱475k |
| Team Full (₱39,999) | 3% | 11 | ₱39,999 | ₱440k |
| Team Full + Highlight (₱49,999) | 1.5% | 6 | ₱49,999 | ₱300k |
| Premium Cinematic (₱79,999) | 0.5% | 2 | ₱79,999 | ₱160k |
| **Base subtotal** | **100%** | **375** | | **~₱3.22M** |

> Final locked pricing: Pkg 1 raised from ₱3,499 to ₱4,499 (+₱225k), Pkg 2 raised from ₱4,999 to ₱7,499 (+₱187k). The combined uplift adds ~₱412k to Year-1 base-tier revenue while keeping app-only tiers below the team-tier ₱24,999 threshold.

**App-tier add-on attach (on top of the 300 webapp Pkg 1+2 buyers):**

| Add-on | Attach % | Volume | Per-Unit | Revenue |
|--------|----------|--------|----------|---------|
| Add Wedding Ceremony coverage (₱999, 3 hrs) | 30% of buyers | ~90 | ₱999 | ₱89,910 |
| Add Facebook Live (₱499) | 25% of buyers | ~75 | ₱499 | ₱37,425 |
| Add AI Video Highlight (₱1,999, per 60 sec) | 40% of buyers | ~120 | ₱1,999 | ₱239,880 |
| Add Custom Overlay + Custom Standby (₱1,999) | 30% of buyers | ~90 | ₱1,999 | ₱179,910 |
| **Add-on subtotal** | | | | **~₱547k** |

**Total Year-1 streaming app-only revenue:** ~₱2.12M (Pkg 1 ₱1,012k + Pkg 2 ₱562k + add-ons ₱547k).

This is **up from ~₱1.71M in the prior plan** — primarily driven by Pkg 1 price increase from ₱3,499 to ₱4,499 (+₱225k) and Pkg 2 price increase from ₱4,999 to ₱7,499 (+₱187k). Add-on attach assumptions are unchanged.

Plus team tier and premium tier revenue (unchanged): ₱475k + ₱440k + ₱300k + ₱160k + Native ₱95k + ₱171k = ₱1.64M.

**Total Year-1 streaming revenue (app-only + team + native + premium): ~₱3.76M.**

Cost: ~₱555k (base ~₱500k + add-on compute ~₱55k).
Gross profit: ~₱3.21M (~85% margin).

### Upsells (After Initial Streaming Purchase)

| Add-on | Attach rate | Tier eligibility |
|--------|-------------|------------------|
| Add Wedding Ceremony coverage (₱999, 3 hrs) | 30% | App-only tiers |
| Add Facebook Live (₱499) | 25% | Any tier |
| Add AI Video Highlight (₱1,999, per 60 sec) | 40% | Any tier |
| Add Custom Overlay + Custom Standby (₱1,999) | 30% | Any tier |
| Add-on highlight reel — 5-min cinematic (₱9,999) | 30% | Team tiers |
| Same-Day Edit (₱14,999) | 15% | Team tiers |
| Audio Boost Kit (₱1,500) | 40% | DIY tiers |
| Phone Tripod Kit (₱1,500) | 30% | DIY tiers |
| Combined Setup Kit (₱2,500) | 25% | DIY tiers |

### Year-2 Targets

- Streaming attach rate: 35% (up from 25%) — driven by more landing-page exposure to past couples' streams.
- Year-2 weddings target: 4,000.
- Streaming events Year-2: 1,400.
- Revenue from streaming Year-2: ~₱10M.

---

## Part 20 — Open Questions / Decisions Pending Before Build

- [ ] Confirm WebApp launch in V1.5 (6-8 weeks).
- [ ] Decide on Cloudflare Stream Live vs LiveKit Cloud (recommend Cloudflare for V1.5 because of integrated R2 archive and PH edge presence).
- [ ] Resolve YouTube channel verification timing (need to apply 2-3 weeks before launch for verified status).
- [ ] Resolve Facebook Page verification timing (similar lead time).
- [ ] Confirm 8-tier (originally 5-tier) pricing structure — sign-off needed from leadership.
- [ ] Define exact phone compatibility requirements (final hardware list — what we'll publish to couples).
- [ ] Sign-off on overlay templates and themes (designer to deliver all 5 theme variants for the lower thirds).
- [ ] Decide V2 native build trigger (revenue threshold vs date) — e.g., "build native after 100 streaming events booked, or 6 months post-V1.5, whichever comes first."
- [ ] Insurance coverage for streaming failures (Premium tier especially) — does our service-disruption clause cap liability appropriately?
- [ ] Setnayan Staff training program for Team Stream tiers (curriculum, certification, payroll/contracting structure).
- [ ] Content moderation policy for panoods (privacy, takedowns, what to do if a guest behaves inappropriately on camera).
- [ ] Drone operator network for Tier 8 — partner with existing CAA-permitted operators or train Setnayan's own?

---

## Part 22 — Operational Running Costs (What Setnayan Spends to Keep This App Running)

This section breaks down all costs Setnayan incurs to operate the panooding feature at scale, separated into fixed monthly costs (paid regardless of usage) and variable costs (per-event).

### 22.1 Fixed Monthly Infrastructure Costs

These are paid every month regardless of how many weddings happen.

| Service | Provider | Tier | Cost | Notes |
|---|---|---|---|---|
| Application hosting | Vercel | Pro plan | $20/mo (~₱1,120) | Next.js hosting + bandwidth |
| Database | Supabase | Pro plan | $25/mo (~₱1,400) | Postgres + Auth + Storage + Realtime |
| Object storage | Cloudflare R2 | Pay-per-use | ~₱5,000-10,000/mo | Photos + recordings + backups (variable, but predictable steady-state) |
| Streaming infrastructure | Cloudflare Stream Live | Pay-per-use | ~₱3,000-15,000/mo | Active during wedding events; lower steady-state |
| AI assistant (LLM) | Anthropic Claude API | Pay-per-token | ~₱15,000-30,000/mo | Kasalan AI for couples |
| Image generation | Replicate (FLUX) | Pay-per-use | ~₱2,000-8,000/mo | AI templates, monograms, mood boards |
| Computer vision | AWS Rekognition | Pay-per-use | ~₱30,000-80,000/mo | Face tagging across all photos |
| Email | Resend | Pro plan | $20/mo (~₱1,120) | Transactional emails (RSVPs, notifications) |
| SMS | Twilio | Pay-per-message | ~₱3,000-6,000/mo | SMS reminders (optional V1) |
| Domain + DNS | Cloudflare | Annual | ~₱150/mo | Domain registration + SSL |
| Error monitoring | Sentry | Team tier | $26/mo (~₱1,500) | Error tracking |
| Analytics | PostHog | Cloud | ~₱2,000/mo | Product analytics |
| Payment processing | PayMongo | 3-3.5% + ₱15/txn | Variable | Transaction-based, not fixed |
| Backup & DR | Multiple | — | ~₱2,000/mo | Database backups, redundancy |

**Subtotal fixed monthly costs at scale: ₱65,000-160,000/month**

This is the floor — what Setnayan pays even if zero weddings happen that month.

### 22.2 Variable Per-Event Costs (Panooding)

Per wedding event with panooding:

| Cost item | Amount | Notes |
|---|---|---|
| Cloudflare Stream Live ingest (5 hrs × 5 cameras) | ~₱150 | $1/1000 min |
| Cloudflare Stream Live recording storage | ~₱75 | $5/1000 min stored |
| Cloudflare Stream Live delivery (100 viewers × 5 hrs) | ~₱200 | $0.85/1000 min-views |
| YouTube Live (free) | ₱0 | Included free |
| Facebook Live (free if add-on bought) | ₱0 | Included free |
| Backend compute (ffmpeg overlay compositing) | ~₱100 | Vercel serverless |
| AI Video Highlight compilation (Claude Opus + ffmpeg) | ~₱200 | Only if add-on bought |
| Customer support overhead | ~₱75 | Per-event allocation |
| **Total variable cost per streaming event** | **~₱400-800** | Depends on add-ons selected |

### 22.3 Variable Per-Event Costs (Other Setnayan Services)

| Service | Cost per event |
|---|---|
| Standard couple account (no streaming) | ~₱150 (storage + AI usage) |
| Couple with photos uploaded | ~₱500 (face tagging via Rekognition + storage) |
| Couple with full Setnayan tier (Premium) | ~₱1,750 (all services combined) |

### 22.4 Total Operating Costs at Different Scales

**Scale 1: 100 weddings/year (small, early-stage)**

- Fixed costs: ₱65,000-100,000/month = ₱780k-1.2M/year
- Variable: 100 × ₱700 avg = ₱70k/year
- Total annual: ₱850k-1.27M/year
- Per-wedding cost (amortized): ₱8,500-12,700

**Scale 2: 500 weddings/year (Year 1 conservative)**

- Fixed costs: ₱100,000-130,000/month = ₱1.2M-1.56M/year
- Variable: 500 × ₱700 avg = ₱350k/year
- Total annual: ₱1.55M-1.91M/year
- Per-wedding cost (amortized): ₱3,100-3,820

**Scale 3: 1,500 weddings/year (Year 1 target)**

- Fixed costs: ₱130,000-160,000/month = ₱1.56M-1.92M/year
- Variable: 1,500 × ₱700 avg = ₱1.05M/year
- Total annual: ₱2.61M-2.97M/year
- Per-wedding cost (amortized): ₱1,740-1,980

**Scale 4: 5,000 weddings/year (Year 2-3 target)**

- Fixed costs: ₱160,000-250,000/month = ₱1.92M-3M/year (some scaling)
- Variable: 5,000 × ₱600 avg = ₱3M/year (better economies of scale)
- Total annual: ₱4.92M-6M/year
- Per-wedding cost (amortized): ₱984-1,200

### 22.5 Cost Optimization Opportunities

As Setnayan scales, several optimizations become economically viable:

1. **Self-hosted streaming (V2):** Replace Cloudflare Stream Live with self-hosted MediaSoup at ~₱8-15k/month. Break-even at ~30 concurrent events. Saves ~₱100k/year at 1,500 weddings.

2. **R2 storage tiering:** Move old recordings (>1 year) to Glacier Deep Archive equivalents. Reduces storage costs by 60%.

3. **Edge caching:** Cloudflare Workers + R2 for cached static assets reduces bandwidth costs.

4. **Anthropic prompt caching:** Already factored in (90% discount on cached system prompts), but as usage scales, savings compound.

5. **Self-host AWS Rekognition equivalent:** Open-source face recognition (DeepFace, InsightFace) on Setnayan's own GPUs. Saves ~₱40k/month at scale, but operational complexity increases.

6. **CDN renegotiation:** At 5,000+ weddings/year, Cloudflare and AWS offer enterprise pricing (30-50% off list).

### 22.6 Revenue vs. Operating Cost Summary

| Year | Weddings | Revenue (gross) | Operating Cost | Operating Profit | Margin |
|---|---|---|---|---|---|
| Year 1 | 1,500 | ~₱5-7M | ~₱2.7M | ~₱2.3-4.3M | 46-61% |
| Year 2 | 3,500 | ~₱14-18M | ~₱4.5M | ~₱9.5-13.5M | 68-75% |
| Year 3 | 5,000 | ~₱22-28M | ~₱5.5M | ~₱16.5-22.5M | 75-80% |

The unit economics scale strongly because most costs are fixed (database, hosting, monitoring) and variable costs decrease per-wedding due to economies of scale.

---

## Part 23 — Concurrent Broadcast Capacity (How Many Simultaneous Streams Can Setnayan Handle?)

A critical operational question: when 30 weddings are streaming on a Saturday afternoon during peak ber-month season, can Setnayan's infrastructure handle it?

### 23.1 Capacity Limits by Component

Each component of the streaming stack has its own concurrency limit:

#### Cloudflare Stream Live (recommended for V1.5):
- Standard tier: 100 concurrent live broadcasts
- Pro tier: 500 concurrent live broadcasts
- Enterprise tier: 1,000+ concurrent (custom limits)
- Ingest sources per broadcast: unlimited (each phone is one source)
- Output destinations per broadcast: 5+ (can simulcast to YT + FB + custom)
- Bandwidth: 10 Gbps+ on standard tier (handles many events)

#### Backend services:
- Vercel serverless functions: scales automatically (millions of req/min)
- Supabase Pro: 200 concurrent database connections (covers ~500-1000 active sessions if pooled)
- WebSocket server (for real-time camera state): can be sharded; ~10,000 concurrent connections per server

#### YouTube Live API:
- Per channel: up to 5 concurrent live broadcasts default (can request more)
- Setnayan's strategy: each wedding gets its own broadcast on Setnayan's main channel; quota requests handle scaling
- API quota: 10,000 units/day default (each broadcast creation = ~10 units)

#### Facebook Live API:
- Similar limits, business verification required for high concurrency
- Per Setnayan Page: ~50 concurrent broadcasts default

#### Database & app servers:
- Supabase Pro: handles ~500 concurrent app sessions comfortably
- Auto-scaling at higher tiers

### 23.2 Realistic Concurrent Capacity at Each Stage

| Stage | Setup | Concurrent Streams Supported |
|---|---|---|
| V1.5 launch (first 6 months) | Cloudflare Stream Standard + Supabase Pro | **50-100 concurrent events** |
| V1.5 mature (months 6-12) | Cloudflare Stream Standard + Supabase scaled | **100-200 concurrent events** |
| V2 (year 2) | Cloudflare Stream Pro + custom infrastructure | **500-1,000 concurrent events** |
| V3 (year 3+) | Self-hosted MediaSoup + Cloudflare hybrid | **2,000-5,000+ concurrent events** |

### 23.3 Demand Forecasting

PH wedding patterns:
- 80% of weddings happen on Saturdays
- Peak hours: 4 PM - 10 PM (reception window)
- Ber-month surge (September-December): 1.5-2x normal volume
- Peak concurrent events estimate:

**Year 1 (1,500 weddings/year):**
- Average per week: 30
- Saturday concentration: 25 weddings on a typical Saturday
- 2-hour reception overlap window: ~15-20 weddings concurrent at peak
- Ber-month peak Saturday: 40 weddings on Saturday → ~25-30 concurrent at peak
- **Year 1 peak concurrent: ~30 events**

**Year 2 (3,500 weddings/year):**
- Saturday peak: ~70 events
- Reception overlap: ~40-50 concurrent
- Ber-month peak: 100+ on Saturday → ~60-70 concurrent
- **Year 2 peak concurrent: ~70 events**

**Year 3 (5,000+ weddings/year):**
- Saturday peak: ~100 events
- Reception overlap: ~60-80 concurrent
- Ber-month peak: 150+ → ~100+ concurrent
- **Year 3 peak concurrent: ~100 events**

### 23.4 Capacity Margin

V1.5 capacity (50-100 concurrent) vs. peak demand (30-70 concurrent):
- **Year 1: comfortable headroom (50-100 capacity vs 30 peak)**
- **Year 2: borderline; need to upgrade to Cloudflare Stream Pro**
- **Year 3: definitely need V2 infrastructure with Pro tier or self-hosted**

### 23.5 Recommended Scaling Path

**Trigger 1: 50% of capacity used during peak hours**
- Action: Upgrade Cloudflare Stream from Standard to Pro
- Cost increase: ~₱50,000/month
- Timing: typically late Year 1 / early Year 2

**Trigger 2: 70% of capacity used**
- Action: Begin self-hosting MediaSoup hybrid
- Cost: ~₱30k/month for dedicated streaming servers
- Replaces some Cloudflare usage with own infrastructure

**Trigger 3: Sustained 90% capacity utilization**
- Action: Multi-region deployment (Manila + Singapore)
- Cost: doubles infrastructure cost
- Timing: Year 3+

### 23.6 What Happens If Capacity Is Exceeded

If Setnayan hits concurrent limits:
- New stream attempts fail with error message
- Couple sees: "Live streaming is at capacity. Please try again in 5 minutes."
- This is a brand-damaging outcome — must avoid

Mitigations:
- Monitor capacity in real-time (Sentry alerts at 80% utilization)
- Automatic scaling triggers (Cloudflare upgrades automatically)
- Pre-event capacity reservation (couples can reserve their slot 1 week ahead — guarantees capacity)
- Premium tier guarantee: ₱79,999 tier includes "guaranteed capacity" — never hits cap

### 23.7 Geographic Distribution Considerations

Cloudflare Stream Live has PH-region edge servers:
- Manila edge: primary for NCR, CALABARZON
- Singapore edge: backup for Visayas, Mindanao
- Latency: <50ms within PH

For 99.9% uptime:
- Multi-region failover (Manila → Singapore if Manila fails)
- Health checks every 10 seconds
- Auto-rollover with <5 second interruption

---

## Part 24 — Claude Code Build Checklist

This is the actionable, sprint-by-sprint task list for Claude Code. Tick items as you complete them. Each box maps to one PR-sized unit of work. Order matters — Sprint N depends on Sprint N-1 deliverables.

### Sprint 1 (Weeks 1-3): Foundation

- [ ] Set up Cloudflare account + Stream Live API key + R2 bucket (`setnayan-stream-archive`)
- [ ] Set up YouTube channel + OAuth 2.0 client + YouTube Data API v3 enabled
- [ ] Set up Facebook Page + Live Video API permissions (`pages_manage_posts`, `pages_read_engagement`)
- [ ] Database migrations: `camera_slots` table (Part 8 schema)
- [ ] Database migrations: `camera_sessions` table (Part 8 schema)
- [ ] Database migrations: `stream_broadcasts` table (event_id, cloudflare_live_input_id, youtube_broadcast_id, facebook_live_id, status, started_at, ended_at)
- [ ] Database migrations: `highlight_clips` table (event_id, r2_key, active_camera_slot, duration_sec, captured_at)
- [ ] Row-Level Security policies on all stream tables (couples can only access their own event)
- [ ] Backend stream session manager (Hono on Cloudflare Workers): `createBroadcast(eventId, tier)`, `joinSlot(qrToken, deviceFingerprint)`, `takeoverSlot(slotId, newSessionId)`, `endStream(eventId)`
- [ ] Camera slot QR token generation (one token per slot, encoded as `https://setnayan.com/[event-slug]/cam/[slot-token]`)
- [ ] Webhook handlers for Cloudflare Stream events (`stream.live_input.connected`, `stream.live_input.disconnected`, `stream.recording.ready`)
- [ ] YouTube Live broadcast lifecycle: `liveBroadcasts.insert`, `liveStreams.insert`, `liveBroadcasts.bind`, `liveBroadcasts.transition` (live and complete)
- [ ] Sentry client + worker integration

### Sprint 2 (Weeks 4-5): WebApp Camera Mode

- [ ] Browser `getUserMedia` camera capture (1080p ideal, 720p fallback, environment facing mode)
- [ ] WebRTC peer connection to Cloudflare Stream Live publish endpoint (Part 5 code as starting point)
- [ ] QR scan + slot join flow (camera operator opens URL, sees confirmation, claims slot)
- [ ] Compatibility check wizard (camera access, mic access, WebRTC support, bandwidth test)
- [ ] Speed test integration (3-second upload test, latency, jitter; pass criteria ≥6 Mbps stable)
- [ ] Reconnection logic (3-attempt retry, 60-second heartbeat timeout to mark slot inactive)
- [ ] Battery + network monitoring (status indicators, broadcaster-visible health badges)
- [ ] Slot takeover flow (3-second grace period, banner notification, smooth handoff — Part 8)
- [ ] Camera operator status UI ("you are LIVE," battery, network, "you've been replaced")

### Sprint 3 (Weeks 6-7): Broadcaster Mode

- [ ] Multi-stream preview UI (5 tiles, low-res WebRTC subscribe, full-quality on active feed only)
- [ ] Tap-to-switch with crossfade animation (300ms transition, server-side composer swaps active feed)
- [ ] Audio source selector (independent of which video is live; 300ms audio crossfade on swap)
- [ ] Lower-thirds quick-add (templates: Welcome, First Dance, Speeches, Cake Cutting, Send-Off + custom)
- [ ] Theme application (5 themes from Part 10 — palette + typography synced from couple's landing page)
- [ ] Server-side overlay compositing (ffmpeg with `overlay` filter — Part 10 sample command)
- [ ] RTMP push to YouTube (always)
- [ ] RTMP push to Facebook (when ₱499 add-on bought)
- [ ] Network/battery health indicators (per-camera green/yellow/red badges)
- [ ] Heat warnings (thermal-state polling on broadcaster-visible per-camera stats)
- [ ] Highlight reel button (rolling 5-sec buffer + press-and-hold capture, max 60 sec auto-release — Part 9.5)
- [ ] Stream health panel (bitrate, dropped frames, viewer count combined YT+FB)
- [ ] End-stream confirmation flow (two-tap with "Are you sure?")

### Sprint 4 (Weeks 7-8): Polish & Launch

- [ ] Landing page embed (YouTube IFrame Player integrated into the couple's existing Setnayan landing page; embed parameters set: controls=1, modestbranding=1, rel=0, iv_load_policy=3, playsinline=1)
- [ ] Recording archive flow (R2 upload + YouTube auto-archive metadata stored in `stream_broadcasts`)
- [ ] AI Video Highlight auto-compilation (Claude Opus scoring + ffmpeg compile, max 60 sec output, 0.5-sec crossfades — Part 9.6)
- [ ] Custom Standby screens (countdown, transitions; unlocked by ₱1,999 Custom Overlay add-on — Part 9.7)
- [ ] Custom logo upload + watermark removal (PNG transparency, applied to live + recording + highlight)
- [ ] Couple dashboard integration (stream URL, archive download, highlight reel, deliverables)
- [ ] Push notifications to broadcaster (camera disconnected, battery <20%, heat critical, network drop)
- [ ] Beta test with 5 weddings (free or heavily discounted; collect bug reports, performance data)
- [ ] Production launch (gradual rollout, monitor Sentry + Cloudflare Analytics)

### V1.5+ Iteration (Weeks 9-12 Post-Launch)

- [ ] Audio Boost Kit support (Bluetooth lavalier wired-adapter path for browsers)
- [ ] Phone Tripod Kit fulfillment workflow (shipping integration)
- [ ] 5-min Edited Highlight Reel pipeline (manual editor + delivery — separate from AI Video Highlight)

---

## Part 21 — Appendix

### A. Sample Stream Session Timeline (8-Hour Wedding)

```text
06:00 AM  Setup begins (Setnayan crew arrives for team tiers)
08:00 AM  Cameras at positions; broadcaster ready; speed tests passed
09:00 AM  Stream goes LIVE (private/unlisted — only invited guests have URL)
10:00 AM  Ceremony begins
11:30 AM  Ceremony ends; transitional scene card
12:00 PM  Cocktail hour (broadcaster switches to Cam 5: crowd)
01:00 PM  Reception begins; lower thirds: "Welcome"
02:00 PM  Speeches; lower thirds: "Maid of Honor — Ana"
03:00 PM  First Dance; lower thirds: "First Dance"; theme accent flash
04:00 PM  Cake Cutting; lower thirds: "Cake Cutting"
05:00 PM  Dancing; broadcaster cycles between Cam 2/3/4
06:00 PM  Send-off; lower thirds: "Send-Off"
06:30 PM  Stream ends — broadcaster taps "End Stream" with confirmation
07:00 PM  Recording auto-archived to YouTube + R2
07:30 PM  Couple receives email: "Your wedding stream archive is ready"
```

### B. Sample Cloudflare Stream Live API Integration

```typescript
// Create a live input
const createLiveInput = async (eventId: string) => {
  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/live_inputs`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        meta: { name: `setnayan-event-${eventId}` },
        recording: { mode: 'automatic' },
        defaultCreator: 'setnayan-platform'
      })
    }
  );
  const { result } = await resp.json();
  return {
    liveInputId: result.uid,
    rtmpsUrl: result.rtmps.url,
    rtmpsKey: result.rtmps.streamKey,
    webRTCUrl: result.webRTC.url
  };
};

// Add an RTMP output (push to YouTube)
const addOutput = async (liveInputId: string, youtubeRtmpUrl: string, youtubeKey: string) => {
  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/live_inputs/${liveInputId}/outputs`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: youtubeRtmpUrl,
        streamKey: youtubeKey,
        enabled: true
      })
    }
  );
  return await resp.json();
};
```

### C. YouTube Live API Integration

```typescript
import { google } from 'googleapis';

const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

// 1. Create the broadcast
const createBroadcast = async (couple: { names: string }) => {
  const broadcast = await youtube.liveBroadcasts.insert({
    part: ['snippet', 'status', 'contentDetails'],
    requestBody: {
      snippet: {
        title: `${couple.names} — Wedding Live`,
        scheduledStartTime: new Date().toISOString()
      },
      status: { privacyStatus: 'unlisted' },
      contentDetails: { enableAutoStart: true, enableAutoStop: true }
    }
  });
  return broadcast.data;
};

// 2. Create the stream
const createStream = async () => {
  const stream = await youtube.liveStreams.insert({
    part: ['snippet', 'cdn', 'contentDetails'],
    requestBody: {
      snippet: { title: 'setnayan-rtmp-ingest' },
      cdn: {
        frameRate: '30fps',
        ingestionType: 'rtmp',
        resolution: '1080p'
      }
    }
  });
  return stream.data;
};

// 3. Bind broadcast to stream
const bind = async (broadcastId: string, streamId: string) => {
  return await youtube.liveBroadcasts.bind({
    id: broadcastId,
    part: ['id', 'contentDetails'],
    streamId
  });
};

// 4. Transition to live (when broadcaster taps "Go Live")
const goLive = async (broadcastId: string) => {
  return await youtube.liveBroadcasts.transition({
    id: broadcastId,
    part: ['status'],
    broadcastStatus: 'live'
  });
};
```

### D. Sample Broadcaster UI Mockup (Text-Based ASCII)

```text
┌──────────────────────────────────────────────────────────────┐
│  Maria & Juan Wedding · ● LIVE · 02:34:18  · 1,247 viewers  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │ ◉ LIVE        │  │ Cam 2         │  │ Cam 3         │   │
│  │ Cam 1: Wide   │  │ Closeup       │  │ Crowd         │   │
│  │ ▓▓▓▓▓▓▓▓▓▓    │  │ ▓▓▓▓▓▓▓▓▓▓    │  │ ▓▓▓▓▓▓▓▓▓▓    │   │
│  │ ▓▓▓▓▓▓▓▓▓▓    │  │ ▓▓▓▓▓▓▓▓▓▓    │  │ ▓▓▓▓▓▓▓▓▓▓    │   │
│  │ ▓▓▓▓▓▓▓▓▓▓    │  │ ▓▓▓▓▓▓▓▓▓▓    │  │ ▓▓▓▓▓▓▓▓▓▓    │   │
│  │ Carlo (iPhone)│  │ Marco (S22)   │  │ Sarah (Pixel) │   │
│  │ 4.2 Mbps · 87%│  │ 4.5 Mbps · 92%│  │ 3.9 Mbps · 76%│   │
│  └───────────────┘  └───────────────┘  └───────────────┘   │
│                                                              │
│  ┌───────────────┐  ┌───────────────┐                       │
│  │ Cam 4: Roving │  │ Cam 5: React  │                       │
│  │ ▓▓▓▓▓▓▓▓▓▓    │  │ ▓▓▓▓▓▓▓▓▓▓    │                       │
│  │ ▓▓▓▓▓▓▓▓▓▓    │  │ ▓▓▓▓▓▓▓▓▓▓    │                       │
│  │ ▓▓▓▓▓▓▓▓▓▓    │  │ ▓▓▓▓▓▓▓▓▓▓    │                       │
│  │ Lisa (iPhone) │  │ Anna (S23)    │                       │
│  │ 4.1 Mbps · 95%│  │ ⚠ 2.1 Mbps    │                       │
│  └───────────────┘  └───────────────┘                       │
│                                                              │
│  Audio source: ▼ Cam 1                                       │
│  Active overlay: "First Dance" (auto-dismiss in 8s)         │
│                                                              │
│  [ + Add lower third ]  [ Switch theme ]  [ End stream ]    │
│                                                              │
│  Stream health: ✓ 4500 kbps · 0 dropped frames              │
│  YouTube: ●  Facebook: ●  Landing page: ●                   │
└──────────────────────────────────────────────────────────────┘
```

### E. Glossary

| Term | Definition |
|------|------------|
| **SFU** | Selective Forwarding Unit — a media server that receives streams and selectively forwards them to subscribers without re-encoding. The standard architecture for multi-party WebRTC. |
| **RTMP** | Real-Time Messaging Protocol — the legacy streaming protocol used by YouTube Live, Facebook Live, Twitch, and most panooding platforms. |
| **HLS** | HTTP Panooding — Apple's adaptive streaming protocol, common for video-on-demand and low-latency live viewing. |
| **LL-HLS** | Low-Latency HLS — extension of HLS with sub-3-second latency, used by Cloudflare Stream Live. |
| **WebRTC** | Web Real-Time Communication — browser/native protocol for sub-second peer-to-peer video and audio. |
| **Ingest** | The process of a stream entering the platform (camera → server). |
| **Broadcast** | The composed, ready-to-send live video stream that goes out to viewers. |
| **Lower third** | An overlay graphic positioned in the lower third of the screen, typically used for captions, name tags, and contextual info. |
| **Scene card** | A full-screen transitional graphic used to introduce sections of an event (e.g., "Welcome," "Ceremony," "Reception"). |
| **Compositor** | A server (or client) component that combines a video feed with overlays before encoding. |
| **Crossfade** | A short transition between two video sources where the outgoing fades out as the incoming fades in. |
| **Slot** | A persistent identity in a wedding's camera roster. Phones come and go; slots stay. |
| **Takeover** | A new phone replacing the current phone in a slot. |
| **PWA** | Progressive Web App — a webapp installable to a phone home screen, gaining limited app-like privileges. |
| **Foreground service** | A persistent background process on Android/iOS that prevents the OS from killing the app when the screen is locked. |
| **Thermal throttling** | When a phone reduces CPU/GPU performance to prevent overheating, often invisibly degrading video quality. |
| **Bitrate** | The amount of data per second of video — higher bitrate = better quality but more bandwidth. |
| **Frame rate** | Frames per second; 30fps is standard for streaming, 60fps for high-motion scenes. |
| **Latency** | The delay between an event happening in real life and viewers seeing it. Setnayan targets 3-7 seconds end-to-end. |
| **Multistream** | Sending the same broadcast to multiple platforms simultaneously (e.g., YouTube + Facebook). |
| **OAuth scope** | The specific permission granted by a user to an app — e.g., `youtube.upload` lets Setnayan create broadcasts on the couple's channel. |
| **R2** | Cloudflare's S3-compatible object storage — used for archive recordings. |
| **Edge server** | A geographically distributed server close to end users; Setnayan uses Cloudflare's Manila and Singapore edges for low PH latency. |
| **Heartbeat** | A periodic message from a client to the server confirming it's still alive; used to detect disconnects. |
| **Crossposting** | Publishing the same content (broadcast or video) to multiple accounts/channels. |

---

## Quick Reference for Claude Code

This is the at-a-glance reference for Claude Code to use during the build. Bookmark this section.

### File Paths to Create / Know About

```
apps/web/                                  # Next.js app (Cloudflare Pages)
  app/
    [eventSlug]/
      cam/[slotToken]/page.tsx             # Camera operator page (QR target)
      broadcast/page.tsx                   # Broadcaster mode page
      live/page.tsx                        # Public landing-page embed
    api/
      events/[eventId]/active-camera/route.ts
      events/[eventId]/highlights/route.ts
      events/[eventId]/end-stream/route.ts
      slots/[slotId]/join/route.ts
      slots/[slotId]/takeover/route.ts
      webhooks/cloudflare/route.ts
      webhooks/youtube/route.ts
  components/
    camera/CameraOperator.tsx              # getUserMedia + WebRTC publish
    broadcaster/CameraGrid.tsx             # 5-tile preview grid
    broadcaster/HighlightButton.tsx        # Press-and-hold capture
    broadcaster/LowerThirdEditor.tsx
    broadcaster/ThemeSwitcher.tsx
    landing/StreamPlayer.tsx               # YouTube IFrame Player wrapper (V1)
  lib/
    cloudflareStream.ts                    # createLiveInput, addOutput
    youtubeLive.ts                         # createBroadcast, bind, goLive
    facebookLive.ts                        # createLiveVideo, manage lifecycle
    qrToken.ts                             # generate + validate slot tokens
    speedTest.ts                           # 3-sec upload test, latency, jitter
    compatibilityCheck.ts                  # Camera/mic/WebRTC capability probe
  store/
    cameraSlotsStore.ts                    # Zustand: per-slot state
    broadcasterStore.ts                    # Zustand: active cam, overlays

services/compositor/                       # Server-side ffmpeg pipeline
  src/index.ts                             # Worker dispatching ffmpeg jobs
  src/overlay.ts                           # Monogram + hashtag + lower thirds
  src/rtmpRelay.ts                         # Push to YouTube + Facebook
  src/highlightRoll.ts                     # 5-sec rolling buffer logic

services/ai-highlight/                     # AI Video Highlight pipeline
  src/scoreClips.ts                        # Claude Opus scoring
  src/compile.ts                           # ffmpeg crossfade compilation

supabase/migrations/                       # Database schema
  20260101_camera_slots.sql
  20260101_camera_sessions.sql
  20260101_stream_broadcasts.sql
  20260101_highlight_clips.sql
  20260101_rls_policies.sql
```

### Required Environment Variables

```bash
# Cloudflare
CLOUDFLARE_ACCOUNT_ID=                     # From Cloudflare dashboard URL
CLOUDFLARE_API_TOKEN=                      # Token with Stream + R2 + Workers + Pages perms
CLOUDFLARE_R2_BUCKET=setnayan-stream-archive
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_STREAM_WEBHOOK_SECRET=          # Validates incoming Cloudflare webhooks

# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=                         # Used by browser clients
SUPABASE_SERVICE_ROLE_KEY=                 # Worker-only; never ship to browser

# YouTube
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
YOUTUBE_API_KEY=                           # For unauthenticated quota
YOUTUBE_CHANNEL_ID=                        # Setnayan verified channel

# Facebook
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_PAGE_ID=                          # Setnayan Page
FACEBOOK_PAGE_ACCESS_TOKEN=                # Long-lived page token

# Anthropic (AI Video Highlight)
ANTHROPIC_API_KEY=

# Observability
SENTRY_DSN_WEB=
SENTRY_DSN_WORKER=

# App
NEXT_PUBLIC_APP_URL=https://setnayan.com
NEXT_PUBLIC_STREAM_PLAYER_BASE=https://customer-{customerId}.cloudflarestream.com
```

### Third-Party Services and Their Roles

| Service | Role | Failure mode |
|---|---|---|
| Cloudflare Stream Live | WebRTC ingest, LL-HLS player, RTMP relay, auto-recording | Stream unavailable → fallback message on landing page; alert SRE |
| Cloudflare R2 | Authoritative recording archive + highlight clip storage | Recording read fails → retry from YouTube auto-archive |
| Cloudflare Workers (Hono) | Stream session manager, webhook handlers | Worker error → Sentry alert; fallback retry queue |
| Supabase Postgres | Slot/session schema, RLS-enforced couple data | Database unavailable → session manager fails closed; alert SRE |
| Supabase Realtime | Cross-device camera state sync | Sync lag → broadcaster sees slightly stale tiles; tolerable |
| YouTube Data API v3 | Live broadcast lifecycle, auto-archive on Setnayan channel | Quota exhausted → broadcast falls back to landing-page-only; alert SRE |
| Facebook Live Video API | Add-on RTMP destination | Push fails → retry once; if still fails, surface "Facebook unavailable" to broadcaster |
| Anthropic Claude API | AI Video Highlight clip scoring | Scoring fails → deliver raw clips bundle instead; refund add-on |
| Sentry | Error tracking | Self-hosted dashboard; non-critical |

### Common Error Patterns and Handling

| Pattern | Handling |
|---|---|
| `getUserMedia` permission denied | Show clear retry prompt; document iOS Safari quirks; offer "Compatibility check" fallback |
| WebRTC ICE connection fails | 3-attempt retry with exponential backoff; mark slot inactive after 60-sec heartbeat timeout |
| Cloudflare Stream `live_input` 5xx | Retry with backoff; if 3 retries fail, mark broadcast `degraded` and alert SRE |
| YouTube `liveBroadcasts.transition` rate-limited | Queue with backoff; broadcast remains in `testing` state until transition succeeds |
| Facebook RTMP push timeout | Single retry; on second failure, drop FB output and notify broadcaster (do not block YT) |
| Phone thermal throttling detected | Auto-downgrade resolution to 720p, then 480p; surface heat warning to broadcaster |
| Slot takeover race (two phones, same QR, <100ms apart) | First WebRTC handshake wins; second gets "Slot is being claimed, please retry" |
| Highlight clip > 60 sec | Auto-release at 60-sec mark; clip is saved with `auto_released = true` |
| Recording archive missing after stream end | Retry R2 upload from YouTube auto-archive; surface "Archive processing" message for up to 24 hours |

### Sprint Sequence (Reminder)

```
Sprint 1 (W1-3)  Foundation:        DB, Cloudflare, YouTube lifecycle, slot manager
Sprint 2 (W4-5)  Camera Mode:       getUserMedia, WebRTC publish, QR join, compat check
Sprint 3 (W6-7)  Broadcaster Mode:  Grid UI, switching, overlays, RTMP push, highlight button
Sprint 4 (W7-8)  Polish & Launch:   Embed, archive, AI highlight, beta test, production
```

Each sprint's full task list is in **Part 24 — Claude Code Build Checklist**. Tick items there as you complete them.

---

**End of Document**

*This specification is the master technical and product reference for Panood. Any implementation deviation requires sign-off from Product and Engineering leads. Suggested changes should be raised as PRs against this document with linked rationale.*
