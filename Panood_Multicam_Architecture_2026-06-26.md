# Panood Multi-Camera Live-Production Controller — Architecture & Build Plan (2026-06-26)

> ## 🔒 SUPERSEDED IN PART 2026-07-08 — read [`Live_Studio_Repackaging_2026-07-08.md`](Live_Studio_Repackaging_2026-07-08.md) first
> The **packaging, pricing, and infra direction** in this doc are superseded by the 2026-07-08 owner repackaging: Live Studio is now **device-tiered** (Mobile ₱1,299/day online · Desktop ₱2,499/day offline-capable · Free 1-cam), **YouTube ships via the couple's own OBS** (₱0 relay), and the whole V1 is **₱0 marginal cost** — so the **self-hosted-LiveKit / server-mixer / cloud-relay plan below is DEFERRED OUT OF V1** (client-side compositing + OBS covers everything decided). The **controller feature set, UI zones, wall/screen model, camera onboarding, and console research below remain valid reference.** Canonical model + prices: [`Live_Studio_Repackaging_2026-07-08.md`](Live_Studio_Repackaging_2026-07-08.md) + DECISION_LOG 2026-07-08.

> Owner asked (2026-06-26): "we want to make the multicam controller now." This is the
> design output (3 architectures → judged → staged plan) + the build-specs for the 3 fenced
> add-ons. Source: design workflow `wf_a210946e-2a2`.

## 🏗️ BUILD PROGRESS — FOUNDATION COMPLETE (2026-06-26)
The engine-agnostic foundation is built + merged to `main` (our own code, each adversarially verified):
- **PR1 ✅ #2242** — `panood_camera_operators` (cameras, clone of papic-seats; claim tokens; RLS couple+coordinator).
- **PR2 ✅ #2252** — `panood_screens` (persistent named venue screens; mode/source routing; 6-char Crockford pairing).
- **PR3 ✅ #2255** — `panood_moments` (moment-director presets) + `panood_control_state` (program/preview/director/live, one row/event).
- **PR4 ✅ #2256** — the REAL control-room page wired + persisting (sources rail · Moment-Director · per-screen routing · Go-live), gated paid (PANOOD_SYSTEM) + couple/coordinator, secrets stripped before the client, free single-cam untouched. Placeholder video.

**NEXT (blocked on owner + the media core):** the media core + walking skeleton (one phone camera → controller → one screen, local) — the first rung that moves real video. Needs: (1) **owner refresh the DB creds** to apply the 4 foundation migrations to prod + run the test; (2) the media-core build (self-host LiveKit per the direction; testing decides if it holds). Deferred UI: Preview/Director-Mode two-bus · transitions/overlays persistence · playout · replays · realtime sync.

## ✅ STATUS / DIRECTION (revised 2026-06-26 PM)
- **Packaging LOCKED:** single-cam livestream = **FREE (basic relay, no overlays/controls)** · multi-cam controller + **overlays = PAID** ("unlock the buttons → pay").
- **Direction (owner revised, supersedes "Phase 1 only"):** the **Setnayan app relays ALL streams to the couple's own YouTube via our self-hosted multicam controller** — the couple does NOT use OBS/paste. Build the media-server controller **now**.
- **Infra = SELF-HOST (owner "create our own"):** run our **own OSS LiveKit instance** (Apache-2.0) on our own server (Hetzner SG) — NOT a from-scratch streaming engine. We own/control it; fixed monthly cost (~₱2–4k), not per-minute rent.
- **Cost (owner-accepted ₱0-lock exception):** ALL streams (free + paid) run through our server → Setnayan pays per-wedding compute even on free streams. Self-host = fixed monthly, so it scales.
- **Phase 1 (paste/OBS · #2219):** stays as the ₱0 fallback, no longer the target UX.
- **Owner prereqs:** (1) provision the server (Hetzner SG); (2) file the Google YouTube OAuth verified-app review (our server creates the broadcast on the couple's channel).
- **`panood_broadcasts` EXISTS in prod** (verified); migration DDL moved to canonical path (idempotent).

## Controller feature set (owner 2026-06-26) — a wedding live-production switcher
The Panood multicam controller is a browser-based live production switcher (StreamYard/vMix-class), branded for weddings. Required capabilities:
1. **Change camera on live** — broadcaster taps a camera tile → that angle becomes the program feed, gap-free (the multicam switcher).
2. **Add overlays** — animated monogram + broadcast-style frame + names/lower-thirds composited on the program feed (graphics layer in the compositor).
3. **Start / End live buttons** — one control creates the YouTube broadcast + starts the relay; one ends it (broadcast lifecycle).
4. **Play uploaded videos on demand** — the Video source is a loadable/swappable SLOT, not a fixed clip. A **"Change video"** button (owner 2026-06-26) picks a clip from the operator's PHONE and uploads it to the controller (over the venue's LOCAL WiFi — no internet needed, fits local-first), making it the loaded video; cut to it to play into the program + screens, swap anytime mid-event. Use cases: save-the-date, childhood slideshow, same-day-edit, thank-you message, sponsor reel.
5. **Create highlight replays** — mark a moment live → (a) replay that clip into the broadcast (sports-style instant replay) and (b) save marked moments into a post-event highlight reel (overlaps the AI-Edited Highlight add-on).
6. **Announce a moment → every screen at once (owner 2026-06-26 "the control room is a MOMENT DIRECTOR").** The broadcaster fires a named moment (Cake cutting · Grand entrance · First dance · Speeches · Toast · custom) and it appears simultaneously on: (a) the **broadcast** (lower-third for remote viewers), (b) the in-venue **photo wall** (full takeover over the live-photo collage — LIVE_WALL), and (c) optionally **guests' phones** (the day-of page — reuses the existing coordinator-broadcast). One tap → broadcast + wall + pockets. This reframes Panood from "a video switcher" to the orchestration hub for the wedding's moments across ALL surfaces. Cross-refs: Live Venue Photo Wall (LIVE_WALL · wall_feed/wall_display_sessions), day-of guest experience (0031 coordinator-broadcast).

**Routing model — ANY SOURCE → ANY OUTPUT (owner 2026-06-26 "on YouTube live we can also use the other walls on demand").** Sources = cameras · uploaded video · **photo wall** · **live background** · moment announcements. Outputs = the **YouTube broadcast (program)** + **each venue screen**. The operator routes any source to any output on demand — so the photo wall / live background are not only venue-screen *modes*, they're also cuttable *sources* into the YouTube program (remote family sees the room, not just camera angles). This is the clean unifying model for the whole console: inputs → router → outputs.

**Control UI = a routing grid (owner 2026-06-26):** every OUTPUT is a row (Broadcast + each wall), every SOURCE is a column; tap a cell to route. Outputs are independent (e.g. Broadcast on Cam 2 · Stage on live background · Lobby on photo wall, all at once). A "Walls follow broadcast" quick action snaps every wall to the program's source.

**Persistent PROGRAM monitor (owner 2026-06-26 "we want to see what is being broadcast still, aside from these").** A dedicated always-on PGM window shows exactly what's going out LIVE right now — the composited output (the cut + overlays + announcements as viewers see them) — visible no matter which control panel (routing grid / walls / playout) is active. It ANCHORS the console layout. Pairs with a PREVIEW window (the two-bus convention: Preview = what's cued next, Program = what's live; line up the next shot in Preview, then cut to Program) so the operator always sees both what's live and what's coming.

**Effects (owner 2026-06-26 "where are the other effects?"):** transitions applied on a cut — **Cut · Fade · Dissolve** (Wipe later) — plus the overlay effects (monogram · frame · name lower-third) and the paid broadcast-style packs (News/Cinematic/Sports/Royalty). Effects are part of the paid controller tier; the free single-cam relay has none.

**Free vs paid:** FREE = single-cam basic relay (no switching/overlays/playout/replay). PAID = unlock the switcher buttons (#1), overlays (#2), playout (#4), replays (#5). #3 (start/end) applies to both.

**Audio meters (owner 2026-06-26):** every source tile shows a live audio level meter (green→gold→red), plus a master meter on the program — so the broadcaster confirms each mic works BEFORE cutting to it (a dead-mic camera shows a flat bar + muted icon). Standard switcher tooling.

**Orientation (owner asked 2026-06-26 · recommended LANDSCAPE):** the live broadcast is **16:9 landscape** — YouTube Live is landscape-native, the venue wall + TVs are landscape, remote viewers on laptop/TV get full-frame (phones letterbox, normal for live). Portrait would require a full second composition (re-frame every camera + re-place overlays) for a niche. **Vertical 9:16 is served by the clips pipeline** (Patiktok / personal reels / save-the-date / the highlight clips), which is already 9:16 — not the live multicam. A true vertical-LIVE mode is a future add-on, not V1.

**Responsive / mobile (owner asked 2026-06-26):** the broadcaster is most likely on a PHONE at the venue, so mobile is a focused operator view, not a shrunk board — program preview on top + a Broadcast⇄Wall toggle (can't show both at phone width), a swipeable camera strip (tap to cut, per-camera audio meter), swipeable moment chips, and a thumb-zone action bar (Go live wide · Mark · More) with overlays/replays/wall-settings behind More. The full two-screen director board is the tablet/desktop layout. Follows the locked responsive + mobile-UI ruleset (program-first · thumb zone · horizontal-scroll strips · overflow→More · one bottom action bar).

**Build mapping:** #1 = LiveKit room + program-select; #2/#4/#5-live = the Egress web-compositor page (switch source + overlay HTML/CSS + play a file source); #5-reel = LiveKit recording → clip → render. On the self-hosted-OSS path these are assembled from LiveKit's room + Egress + recording; from-scratch = building all five as bespoke subsystems (the months-long estimate). The richer the feature set, the larger the from-scratch delta.

## Venue wall — modes + display hardware (owner 2026-06-26)
The venue wall is a **mode the broadcaster drives from the control room**, not just a photo collage. Modes: **Photo wall** (live guest photos) · **Mirror broadcast** (show the program feed) · **Live background** (ambient branded screen — monogram + theme; reuses the LED/Live-Background asset; for idle/"not in use" times) · **Off** (deactivate photos during the ceremony). A moment announcement takes over any mode then returns. Built on the existing LIVE_WALL (wall_feed / wall_display_sessions), driven live over a realtime channel.

**Display hardware — NO custom gadget; the wall is a web page.** Two screens, two answers:
- **Cameras = the operators' phones** (shoot + stream over WiFi/cellular; no HDMI, so no charging conflict — power bank for a long day).
- **The wall = a dedicated cheap HDMI device, NOT a phone:** a streaming stick (Fire TV / Chromecast w/ Google TV / Android TV box, ~₱2–3.5k, opens the wall URL in its browser) · or the venue **laptop** (HDMI/VGA, on power) · or a **Raspberry Pi** in kiosk mode (the "make our own" appliance) · or a smart-TV browser. Old VGA projector → a ~₱300 HDMI→VGA adapter.
- **Phone-charges-while-HDMI question:** a **USB-C digital AV multiport adapter** (HDMI + USB-C PD passthrough) charges the phone while outputting HDMI (Apple ~₱3–4k; Anker/UGREEN ~₱1–2k; Lightning equivalent for old iPhones). So a phone/laptop CAN do both — but prefer a stick for the wall so no phone is tied up all night.
- **Multi-screen (owner 2026-06-26):** an event can pair MANY screens, each an independently-controlled display in a control-room "screens manager" (e.g. stage = live background · 2 side projectors = mirror broadcast · lobby/outside = photo wall). Per-screen mode + status (online), group actions (Mirror all · Restore each to its set mode), and Announce-to-all (a moment takes over every screen then returns). Each screen is its own `wall_display_sessions` row; mixed hardware is fine (HDMI stick / VGA projector / laptop) since each just runs the wall page with its own role+mode.

**Screen cap — NOT 2 (owner asked 2026-06-26).** No technical reason to cap screens low: screens are cheap RECEIVERS — a "mirror" screen embeds the couple's YouTube (₱0, audience-independent), a photo wall pulls cheap images, a live-bg renders locally. Cost lives on the CAMERA/ingest side (each camera = real compositing compute), NOT on screens. So: allow several screens with a SOFT cap (~4–6) only for live-manageability; cap CAMERAS by tier instead (free 1 cam → paid more). Multi-screen management is itself a PAID-controller-tier perk (free = one basic wall; paid = the multi-screen director).

**Pairing:** each wall device opens `setnayan.com/wall` + a short per-screen pairing code; the control room then drives each live (mode + announcements) over a realtime channel.

**Onboarding + camera hot-swap (owner asked 2026-06-26).** CAMERA: operator joins the venue WiFi → scans a QR / taps a link → the camera-publish page opens IN THE PHONE BROWSER (no app) → "Start camera" → appears in the source rail. No internet needed (local mode); reuses the Papic seat-claim token pattern (one token → one camera slot → one event). SCREEN: open `setnayan.com/wall` on any HDMI device → scan the same code → name + route it. **Open, hot-swappable roster:** cameras can join/leave anytime — hand a fresh phone the QR mid-ceremony and it's instantly cuttable. **Battery + signal per camera** is shown in the control room so a dying phone is spotted BEFORE it drops; a dropped camera doesn't break the program (cut away + the auto-pilot holding card covers a gap), and a **Replace** action re-fills the slot with a new phone. Operator guidance: give each camera a power bank (a phone shooting video for hours drains regardless).
- **Optional future SKU:** a pre-configured plug-and-play "Setnayan wall kit" (Fire Stick / Pi flashed to auto-open the wall + pairing code) — convenience, not required to launch.

## ⚑ Deployment model — LOCAL-FIRST, YouTube optional (owner raised 2026-06-26)
Owner: "venue has no internet — use the app as a live cast on the screens, not YouTube … or YouTube-only and drop the walls?" → **Recommendation (a third option): LOCAL-FIRST.** The controller runs AT THE VENUE on a local network; the **venue screens/walls always work with NO internet**; **YouTube is an optional bolt-on** that layers on only when the venue has upload bandwidth.

Why this beats both of the owner's framings:
- **Walls are the core + the reliable part** (the in-room audience; no internet needed — cameras + screens on the venue's own WiFi). Don't drop them for YouTube-only — that bets everything on flaky venue internet.
- **YouTube is the bonus + the fragile part** (remote viewers; needs upload bandwidth) → rides on top, never the foundation.
- **Preserves the ₱0-marginal-cost lock** the cloud-relay plan was about to break: a LOCAL controller box (operator laptop / small Setnayan kit) = **₱0 Setnayan cloud compute**; cloud only does light pairing/sync. This is the better answer to the whole engine/cost saga.
- **De-risks the engine question** — a local box driving local screens (and optionally pushing ONE stream to YouTube via direct RTMP) avoids a cloud SFU fighting NAT traversal per camera.

**Trade-off:** needs an on-site kit setup — a laptop/mini-PC + a local WiFi AP + the screens connected (it's how event AV already works). This is where a pre-configured "Setnayan wall kit" earns its keep. Offline guest photo uploads go to the LOCAL box, then sync to cloud when internet returns.

**Net:** local walls always · YouTube when internet allows. This reframes the parked cloud-LiveKit-vs-from-scratch infra fork toward a LOCAL engine on the venue box (local LiveKit / OBS-class / local app), with the cloud reduced to signaling + sync. ⚠ Load-bearing pivot — owner to confirm direction before build.

## Console UI layout — researched conventions (2026-06-26)
Researched how established switchers place controls (Blackmagic ATEM, vMix, OBS, Wirecast · StreamYard, Restream, Ecamm, Streamlabs Talk Studio, Riverside · Switcher Studio, Larix, mimoLive). They converge on **6 zones**: (1) PROGRAM stage (live, the gravity center) · (2) PREVIEW monitor (next shot) · (3) a single unified SOURCE RAIL of live tally-bordered thumbnails ("everything is an input") · (4) TRANSITION controls hugging the program/preview · (5) AUDIO mixer as its own zone · (6) an isolated high-contrast GO-LIVE/RECORD cluster. Deep per-element settings are exiled to a collapsible side rail; a multiview (big Program/Preview + thumbnail strip with meters + status) recurs everywhere.

**Key decisions for the wedding operator (a non-engineer friend):**
- **Default = single-stage "tap a camera = it's live"** (StreamYard/Restream/Riverside). The always-on PROGRAM monitor stays; the **two-bus Preview→Take is an OPT-IN "Director Mode"**, off by default (the pro path exists but isn't forced).
- **The Moment-Director is the PRIMARY control, not the crosspoint.** Big one-tap moments (Processional/Vows/Kiss/First Dance/Speeches) are **macros** — one tap recomposes the layout, picks the camera, fires the lower-third, sets the walls, ducks music (StreamYard layouts / Ecamm scenes / mimoLive Layer Sets). The camera grid is the advanced fallback.
- **Mobile = a bottom tab bar**: Moments / Cameras / Walls / Sound / Replays (Switcher Studio pattern), tap-to-cut, isolated red go-live, audio collapsed to a meter + one-tap mute.
- **Add-a-camera by QR** (Larix Grove — scan to auto-join over WiFi, no pairing UI). **Auto-pilot** fallback for solo operators: timed rotation + a bandwidth-reactive "ceremony in progress" holding card instead of dead air. **Per-phone local full-res recording** in parallel for a better post edit.
- **Independent per-wall output routing** separate from the program bus (mimoLive Output Destinations).

**Skip as pro-overkill for a wedding:** hardware crosspoint matrix · chroma/luma keyers + DVE/supersource · Fairlight parametric EQ · manual T-bar · large multi-transition decks (Cut+Dissolve+one Wipe is enough) · multistream (YouTube-only by lock) · per-camera color pages · green-room guest admission · fully-modular detachable docks · custom-from-scratch layout building as the main path.

Sources: blackmagicdesign.com/products/atemmini · vmix.com/help28 · obsproject wiki · telestream Wirecast guide · support.streamyard.com (layouts) · restream.io studio · ecamm scenes · streamlabs Talk Studio · riverside layouts.

## Build-and-test ladder (owner "let's build it and test it" · 2026-06-26)
We build our own controller + engine orchestration; the TEST RESULTS decide whether home-grown video transport is wedding-grade or whether we stand on the open-source core (LiveKit) for that one layer. Testing is the decision mechanism, not just validation. Each rung is built AND proven before the next:
1. **Foundation** — PR1 camera-operator data (`panood_camera_operators`, clone of papic-seats) → PR2 screens/wall sessions → PR3 moments + control/routing state → PR4 the control-room page. (Engine-agnostic, our own code.)
2. **Walking skeleton** — one phone camera → our controller → one local screen, on a LAN. Test on office WiFi.
3. **Harden + multicam + real console UI.** Test on a real NON-wedding event (party / gig).
4. **Full features + soak test at a staged, non-paying mock wedding.**
5. **GATE (firm): no paying wedding until it survives real-event testing** — a real couple is never the first real test (the wedding-is-unrepeatable rule).

**⚠ Blocker for testing (not building):** PR1 shipped (#2242, migration file on `main`) but the prod apply is DEFERRED — the session's DB credentials are stale (`supabase db push` → password auth fails / SQLSTATE 28P01), and nothing reads `panood_camera_operators` until PR4 so there's no rush. Building the foundation (PR2–PR4 code/migration files) needs no creds; but **applying the migrations + the walking-skeleton test rung need the DB credentials refreshed** (`SUPABASE_DB_PASSWORD` / the pooler URL). Owner action: refresh DB creds before the test rung; then apply the foundation migrations together via `db push` from a clean worktree (avoid out-of-band/MCP applies → ledger drift).

## The locked vision (iteration 0011)
Multiple camera operators each stream from their **phone** → a **broadcaster control room**
picks the live/program camera → server-side **compositing** (program feed + Mood-Board-recoloured
Animated Monogram overlay + broadcast style) → **relay** to the couple's **own YouTube Live**
(RTMP) → the event page embeds it (already built). Per-camera + per-hour are paid add-ons.

## Recommended architecture — a staged convergence (not one choice)
1. **Phase 1 (ship now, ~₱0, glue code):** resurrect the already-written-but-dead
   `lib/panood-youtube.ts` lifecycle. A real "Go live · hold 1.5s" action creates the YouTube
   broadcast on the couple's channel; they push RTMP from **OBS** (monogram as an OBS image
   source); the existing event-page embed lights up. Real multi-cam streaming (multi-cam done
   in OBS) with **zero new infra** — and it clears the Google OAuth verified-app review gate
   (a 1–4 week external blocker for *any* real relay).
2. **Phase 2:** camera-operator links (`/panood/cam/[token]`, a byte-for-byte clone of the
   Papic seat-claim flow) + WebRTC publish into a **LiveKit** room.
3. **Phase 3:** real control room (convert the existing `broadcast/page.tsx` mock to live tiles)
   + server-composited program feed via **LiveKit Egress** (headless-Chromium compositor page
   that reuses the real React monogram/brand components) → RTMP to the couple's YouTube.
4. **Phase 4:** monetization (+1 Camera / +1 Hour provisioning), `eventSkuActive` gating,
   "Mark highlight" → `panood_highlights`, and the **runaway-live cost guard** (auto-stop on
   disconnect + max-duration = the +1 Hour boundary) — a HARD requirement, not later polish.
5. **Phase 5 (optional, volume-gated):** graduate LiveKit Cloud → self-hosted LiveKit
   (Hetzner Singapore) — an **env swap**, not a rewrite (identical API/JWT).

## ⚠ THE OWNER DECISION — infra fork (breaks the ₱0-marginal-cost lock)
Live streaming is the **first** Setnayan feature with real per-event compute. YouTube still
absorbs all viewers + recording at ₱0 (audience-independent); the cost is on **ingest + mix**.

| Fork | Marginal / wedding | Fixed monthly | Notes |
|---|---|---|---|
| **0 — No server mixer** (Phase 1, OBS→YouTube) | ~₱0 | ~₱0 | Ships now, glue only. No in-product multi-cam switching; OBS friction. |
| **B — LiveKit Cloud** (managed) | ~₱150–600 | ~₱3k floor | Best reliability/UX; env-swap to self-host later. **Recommended for multi-cam V1.** |
| **A — Self-hosted LiveKit** (Hetzner SG) | ~low tens of ₱ | ~₱2–4k | OSS/self-host (owner default); heaviest ops (on-call for live weddings). |

**Recommendation:** ship Fork 0 now (no decision needed) → default to **Fork B** for the
multi-cam product surface (reliability + UX win on an unrepeatable wedding moment; it's an
env-swap to self-host later, so it honours the OSS-self-host preference without a rewrite) →
graduate to **Fork A** when concurrent-event volume makes the fixed VM cheaper than per-minute.

**Required owner sign-offs:** (1) explicit exception to the ₱0-marginal-cost lock; (2) a
tax-aware-floor pricing pass on PANOOD_SYSTEM / +1 Camera / +1 Hour (real variable COGS now,
not a ~99%-margin digital SKU); (3) the runaway-live cost guard is a Phase-1-of-managed-path
hard requirement.

## Surfaces (admin + broadcaster + operator)
- **Admin (HQ):** Panood SKUs + add-ons in admin pricing; order-approval → `provisionPanoodCamerasAdmin()`; a NEW live-session health surface (who's live, Egress status, per-camera `last_seen_at`, manual kill, runaway auto-stop monitor); LiveKit keys in the Integration Activation Console.
- **Couple / broadcaster:** the control room (build on the existing mock) — live tile per operator, tap-to-cut program camera (Supabase Realtime), "Go live · hold 1.5s", "Mark highlight", "Cast to projector". Distinct single-use broadcaster token.
- **Camera operator:** `/panood/cam/[token]` mirrors `/papic/claim/[token]` — scan QR → claim (POST) → optional login-free anon session → "Start camera" → getUserMedia rear-cam publish. One token = one camera = one event.

## Data model (extend, don't reinvent)
- `panood_broadcasts` (EXTEND): + `egress_id`, `live_started_at/ended_at`, `program_camera_index`, `paid_hours`, `expires_at`, `mixer_mode ('obs'|'browser'|'server')`.
- `panood_camera_seats` (NEW — clone `paparazzi_seats` + `lib/papic-seats.ts` verbatim): claim tokens, `camera_index`, UNIQUE(event_id, camera_index), RLS at CREATE.
- `panood_highlights` (NEW): the "Mark highlight" feed (→ AI Highlight reel).
- Broadcaster session token (distinct from camera tokens, canSubscribe-all).

## Add-on build-specs (the 3 fenced SKUs)
- **Broadcast Style Pack — LOW lift, build FIRST.** A render-time style system (NOT a live
  compositor): ~4 style manifests (overlay/Lottie + LUT + transitions, Mood-Board-tinted +
  monogram-composited) applied at recap/SDE/AI-Highlight render time via the existing
  Remotion+Lottie+LUT pipeline. Static intro/outro/standby frames can ship as downloads day
  one. Catalog row `PANOOD_STYLE_PACK`. **No live infra, independent of the controller.**
- **AI-Edited Highlight — MEDIUM lift, un-retire it.** Currently `V1_TO_V2_SKU_MAP` maps it →
  null. Un-retire → `AI_EDITED_HIGHLIGHT`; async post-event render (Claude curation → Remotion
  + owned-music/Pakanta → R2 → Resend email), cheapest source = **Papic R2 clips** (already
  tagged) so it ships **without any Panood live infra**.
- **per-Camera + per-Hour — HIGH lift, build LAST.** Hard-depends on the multi-cam controller
  (SFU ingest + operator tokens + metered live window). Quantity SKUs `PANOOD_EXTRA_CAMERA` /
  `PANOOD_EXTRA_HOUR`; provisioning mirrors `provisionPapicSeatsAdmin`.

**Build order:** Broadcast Style Pack → AI-Edited Highlight (both controller-independent) →
the multi-cam controller → then turn on the camera/hour quantity SKUs.

## Open questions / owner actions
- Sign off the infra fork (above) + the ₱0-cost-lock exception.
- **File the Google OAuth verified-app review NOW** — 1–4 week external blocker for any real relay.
- Tax-aware pricing pass on the Panood SKUs (admin-managed, never hardcoded).
- Camera cap for V1 (e.g. 4) + audio = program-camera-only (V1 ok)?
- When to graduate Cloud → self-host (set the volume trigger).
