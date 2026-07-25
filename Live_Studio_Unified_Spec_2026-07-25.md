# Live Studio — Unified Spec (2026-07-25)

**Owner decision (2026-07-25):** merge **Cast/Broadcast (Panood)** + **Roam** into ONE customer-facing **"Live Studio"** SKU — **₱2,999 / event**, **switching-based** controller. No compositing in V1 (phase-2 Pro). No monthly. No vendor plan. Streaming stays customer-facing (the person having the event streams it).

## 1. Model
- ONE product: a directed **Main Stage** + **switchable guest cameras**.
- **Channel 1 = Main Stage** = the directed/controlled channel. It carries **the controller**, is part of the ₱2,999, and is run by the couple / a friend / a coordinator (not a paid crew). Can be activated / deactivated.
- **Added cameras = channels.** Each joins via the **event QR (no install)** and serves double duty: (a) a source the controller can **one-tap cut onto the Main Stage** (the Broadcast/Cast behavior), and (b) an independently **guest-watchable** channel (the Roam guest-pick behavior).
- **Free tier unchanged:** single-camera livestream stays free. Live Studio is the paid multi-cam unlock.

## 2. Controller — Switcher-parity on the SWITCHING half (keeps ₱0 economics)
**Match Switcher:** multi-camera monitor, **one-tap cut** the Main Stage between cameras, add cameras via QR, mark the **default/featured view**, **guest-pick** toggle, stream to YouTube (720/1080p), live status.
**Beat Switcher:** QR-no-install join · **guest-pick (unique to us)** · **₱2,999 one-time** vs $65/mo · integrated in the couple's platform · unlimited viewers at ₱0.
**COMPOSITING — "add what we can" (owner 2026-07-25, reversing the momentary strike-out):**
- **Overlays (monogram bug, lower-thirds) — IN, fast-follow.** Feasible at ₱0: composited **client-side on the phone that's already encoding** (no second feed, no server). Ships inside the ₱2,999 unlock, built right after the switching core. Shown on the controller as the Ⓜ toggle.
- **Split-screen / PiP — IN THE PLAN, phase-2.** Requires a mixing point (director-phone compositing à la Switcher = ₱0 but heavy client build, or a server mixer = real per-minute cost). That fork hangs on the final streaming transport, which is itself gated on the owner's YouTube orchestration — decide then, not now. Shown on the controller design tagged P2.
- **Chroma-key / green screen — OUT** (no wedding need; hardest technically). Revisit only on owner ask.
- **Lower third — IN, fast-follow (owner 2026-07-25):** a news-style info bar on the broadcast ("Dinner is served — Grand Ballroom · 7:00 PM"). Client-side composited like the monogram → ₱0, part of the ₱2,999 unlock. Host-editable text + quick presets.
- **Monogram is REPOSITIONABLE** (owner): tap/drag to place it — corners/top-center; not fixed.
- **Highlights — split honestly (owner asked "and highlights?"):** ① **Highlight MOMENTS — IN, ₱0:** a ⚡ button while live saves a timestamp (pure metadata) → post-event highlight list / YouTube VOD chapters / feeds the recap-reel. ② **Live REPLAY inserted into the stream — P2** (compositing-class, needs the mixer). Confirm ① matches the owner's intent.
- **Layout-change ANIMATION (owner):** Full→Split→PiP transitions must animate (windows slide/morph, no hard jump). Note: since Split/PiP output is P2, the animation requirement attaches to the P2 mixer work; the controller previews it now.
- **Channel names are the HOST'S OWN** (owner): every channel is named to their liking (name + venue = the text under each tile; ✎ rename). Already how `live_studio_roam_zones.label/venue_label` works — keep it.
- **Event-QR overlay — IN (owner 2026-07-25):** show the event's scan-to-join QR right on the broadcast (client-side composite, ₱0). Default corner placement. ⚠ OPEN: paid-only (with the unlock, as prototyped) vs FREE (a QR that pulls guests into the event grows Setnayan too) — owner to pick.
- **FREE-TIER WATERMARK (owner 2026-07-25): "POWERED BY SETNAYAN" as a permanent lower third on every free stream** — the growth loop (every free wedding stream advertises the platform). The ₱2,999 unlock replaces it with the couple's own lower third. Truthful-copy note: free-tier marketing must disclose the branded bar.

**CHANNEL VOCABULARY (owner 2026-07-25, prototype-approved direction):** **Channel 1 = the controlled screen** (the program/broadcast itself; carries the controller). **Every camera = its own numbered channel (CH 2 "Main Stage", CH 3 "Garden Aisle", …)**; tapping a camera channel puts it on Channel 1. "Main Stage" is a camera NAME, not the program. Free tier = Channel 1 + one camera channel; ₱2,999 unlocks the rest.

## 3. SKU / pricing
- New/renamed **`LIVE_STUDIO`** SKU · **₱2,999 / event** · customer-facing · **per-event, not monthly**.
- **RETIRE** `PANOOD_SYSTEM` (Cast ₱2,500, *live in prod*) + `LIVE_STUDIO_ROAM` (₱3,500, just shipped #3666). Their capabilities fold into `LIVE_STUDIO`.
- Free single-cam livestream unchanged.
- Ships flag-gated; owner flip + **YouTube channel/OAuth** for actual streaming (unchanged gate — configuring + buying needs none of it).

## 4. Build (additive on the Roam foundation from #3666)
Roam #3666 already provides the substrate: channel/zone setup, QR camera join, the guest-pick viewer, the `live_studio_roam_*` schema. Build **on top of it**, don't fork:
1. **Controller:** extend the Roam setup controller with **Main Stage directing** — a live monitor + one-tap "cut to this camera on Main Stage." Merge Panood's directed-broadcast into this one controller.
2. **Viewer:** the guest sees the **directed Main Stage output** + can switch to any camera (guest-pick) — one unified viewer.
3. **SKU:** create `LIVE_STUDIO` at ₱2,999; retire the two old SKUs (redirect their studio tiles / catalog rows into the unified one).
4. **Coordinate:** Live Studio was recently touched by a parallel session (#3579–#3592 + #3666). Build **additively**, DRAFT PRs, don't clobber their work.

## 4b. LAYOUT BUILD PLAN (owner approved the prototype 2026-07-25 — "build it")
Design reference = the interactive prototype (artifact `live-studio-control.html`, session scratchpad). Structural base = PR #3683 (merged: rename → `live-studio-control`, shared free/paid controller, server-side entitlement backstop).
- **Wave 1 — the single-screen controller layout** (per prototype, phone-first + one desktop breakpoint): CH 1 monitor with tally discipline (red = on air, red edge + ON AIR chip; `CH 1 · CONTROLLED SCREEN` label) · camera-channel grid (CH 2+, host-named ✎, ★ default, one-tap = put on Channel 1, red tally on the live tile) · transport (GO LIVE/END + guest-pick toggle) · lock-in-place for free users + inline Unlock ₱2,999 · desktop = monitor left / grid right, same components. **Dark behind the existing flag.**
- **Wave 2 — the ₱0 broadcast-extras wave:** Ⓜ monogram overlay (repositionable, default upper-right) · lower third (host text + presets) · **event-QR overlay = FREE (owner-locked 2026-07-25)** — available on the free tier too, because a scan-to-join code pulls guests into the event and grows Setnayan · ⚡ highlight moments (timestamps → post-event list/chapters) · **"POWERED BY SETNAYAN" permanent lower third on FREE streams** (replaced by the couple's own on unlock). Composited client-side at the encoding point — no server mixing.
- **Wave 2 also: GUEST-PICK IS A REAL OPTIONAL TOGGLE (owner-locked 2026-07-25 "make it optional").** Wave 1 shipped it as read-only state because nothing persisted it. Wave 2 adds the persistence (one column on the event/roam config) + the public viewer honoring it: ON = guests may leave CH 1 for any camera channel; OFF = everyone watches the host's cut. Host-controlled, default ON once multi-cam is unlocked.
- **Buy-page copy: keep "Main Stage" as the MARKETING phrase (owner 2026-07-25).** The controller speaks channels (CH 1 = controlled screen); the sales page may keep "directed Main Stage" as the customer-facing pitch. No rewrite needed.
- **⚠ NO-FAKE-DOOR RULE for the shipped app:** the prototype shows Split/PiP chips tagged P2 for design intent, but the REAL controller must NOT render controls for features that don't exist yet (PayMongo-card precedent: hide, don't tease). Split/PiP chips appear only when P2 ships.
- Phase 2 (unchanged): Split/PiP + live replay (the mixer fork) + the animated layout morphs that ride on it.

### 4d. ⭐ PAYWALL MOVED — "REHEARSE FREE, PAY TO BROADCAST" (owner-locked 2026-07-25; SUPERSEDES the Wave 1/2 gating)
**The problem it fixes:** under Waves 1–2 the paywall sat on the *mechanic* (`requireLiveStudioOwned` on the cut actions), so a free host saw padlocked tiles and was asked for ₱2,999 for an experience they had never felt — for a day that cannot be redone.

**The model (mirrors the owner's own locked 3D Plan pattern — "build it free, pay when your guests walk it"):**
- **FREE — private rehearsal, unlimited:** add cameras by QR, name channels, tap-cut between them on CH 1, place the monogram / lower third, set guest-pick. Their own phones, their own venue, at their actual rehearsal. **Nothing is published; no guests can watch.**
- **FREE — broadcasting ONE camera** (unchanged; the live `/pricing` page already promises "Single-camera livestream" free — do not break that claim).
- **PAID ₱2,999 — broadcasting MULTI-CAM:** live cutting between channels + guest-pick + the paid overlays, published to guests.
- **Event QR stays free** everywhere; **"Powered by SETNAYAN"** stays forced on free broadcasts.

**🔧 THE GATE MOVES:** from `requireLiveStudioOwned` on the **cut/config actions** → to a gate at **go-live / publish** time (publishing more than one channel, or live-switching a published stream, requires the unlock). Rehearsal + configuration become entitlement-free; **publication is the paywall.** Cannot be gamed into a free wedding — no publication means no viewers, hence no wedding.
**Also:** locked tiles show the camera's REAL thumbnail once a phone has joined instead of a padlock over nothing; a labelled zero-setup **demo event** (reuse the `is_sample`/demo-fixture precedent) serves someone browsing before they have phones to hand.

**🔤 FREE-TIER DIRECTOR-SCREEN UX (owner-locked 2026-07-25, three refinements):**
1. **Copy = "Unlock to Broadcast"** — owner-approved exact string. ⚠ NOT "Unlock to Use": under rehearse-free the host genuinely *can* use those cameras, so "to Use" would be false while they're using them. The string names the real boundary — **broadcasting**, not using.
2. **The nudge is CONTEXTUAL, not a padlock at rest.** It surfaces as the host actually engages the **2nd and succeeding** camera channels on the director screen (owner: "a (Unlock to Use) will also show"), so the price lands at the moment of felt value. It is a **nudge, never a block** — the cut still succeeds. Entitled hosts never see it.
3. **🚫 NO DIMMING — the extra cameras stay FULLY VISIBLE** (owner: "but they can still see it"). This **reverses the Wave 1/2 treatment**, where non-free tiles rendered grayscale/≈40%-brightness under a 🔒 badge. Full brightness, real previews, normal on CH 1 during rehearsal. **Rationale: seeing the cameras work IS the conversion mechanism** — dimming them recreates the exact defect §4d exists to fix (charging ₱2,999 for an unfelt experience).

### 4c. WAVE 1 + 2 SHIPPED — corrections the build forced (2026-07-25)
**Wave 1 = PR #3690 (merged).** Wave 2 = PR #3698 (merged, dark). Both behind `NEXT_PUBLIC_LIVE_STUDIO_ROAM_ENABLED`.

**🔧 CORRECTION — the encoding point is NOT the capture phone.** This spec assumed overlays composite on the capture phone (§4b "client-side at the encoding point"). **That path does not exist:** `panood-camera-publish.tsx` renders no overlay and the phone never encodes to RTMP. The REAL encode surface today is **`/panood/program/[eventId]`** — the chrome-less pop-out the couple's encoder (OBS etc.) window-captures. Overlays (monogram · lower third · event QR · Powered-by) are wired there as DOM layers, which genuinely reaches air (same mechanism as the existing paywall overlay). ₱0, no server mixer. ⚠ They do NOT composite onto the unified controller's CH 1 monitor (no video pipeline there) — the controller shows a labelled **placement rehearsal** sharing the same corner map.

**Reality per feature:** ⚡ highlight moments = REAL + working (replaced a `markHighlight` stub that returned `{ok:true}`/"no persistence yet") · guest-pick = REAL persistence + REAL server-side viewer enforcement (enforced by omission — the loader ships only the on-air channel), but **not yet observable** because nothing writes `live_studio_roam_streams`; it bites the moment stream provisioning ships · overlays = REAL on the program surface.

**Free-tier branding is unstrippable by construction:** the Setnayan bar is **derived from the entitlement, never stored** — there is no setting for a free host to flip and no request to replay.

**🚨 OPEN OWNER DECISION — two contradictory owner locks, both now rendering on the same surface:**
- `lib/panood-watermark.ts` (**owner-locked 2026-07-21, LIVE**): the free tier is a **FULL-SCREEN** SETNAYAN overlay, deliberately "useless as an actual broadcast" (a paywall).
- This spec (**owner 2026-07-25**): the free stream is genuinely usable and merely carries a **"POWERED BY SETNAYAN" lower third** (a growth loop).
Wave 2 implemented the newer model and left the older watermark untouched, so **both draw today**. ⚠ **MUST be resolved BEFORE the Live Studio flag flips** — otherwise a free stream shows a full-screen paywall *and* a lower third. Owner picks which survives.

### 4e. ONE CONTROLLER — the new one REPLACES the legacy Cast room (owner-locked 2026-07-25)
Owner: *"we want to remove the old controller and set this as our main controller … when we finish our new controller, this will be used to replace the old controller."*
- **Legacy room** `/dashboard/[eventId]/studio/panood/broadcast` is LIVE + selling (`PANOOD_SYSTEM`), and is the **sole installer of `panood-program-bridge`** (today's only path to air). Reachable from **6+ doorways** (galleries · launch · panood hub · panood/setup · panood/cameras).
- **Replacement is FLAG-AWARE (Wave 6):** flag OFF → legacy behaves exactly as today (no regression to a selling product); flag ON → the legacy route **redirects** to `/studio/live-studio-control/setup` and every doorway repoints, via one `liveStudioControllerHref()` helper. The switchover is therefore **atomic with the flag flip**, not a manual scramble.
- **🚨 SEQUENCE — do not reorder:** Wave 5 (path to air) merges → **verify the new controller actually reaches YouTube** → then flip the flag (which activates the Wave 6 redirect) → retire `PANOOD_SYSTEM` → later, delete the legacy code. Retiring the legacy room before Wave 5 is proven would leave the product with **no route to air at all**; the SKU retirement is deliberately NOT in the Wave 6 PR (its migration would auto-apply on merge and kill live Cast sales while the new product is dark).
- **⚠ OPEN — Cast-owner continuity:** hosts who already bought `PANOOD_SYSTEM` (₱2,500) must still reach a working controller after the flip. Either honor `PANOOD_SYSTEM` as equivalent to `LIVE_STUDIO`, or grant/migrate existing buyers. Wave 6 is investigating; **must not silently strand paying customers.**

### 4e. ⭐ WAVE 5 SHIPPED — PATH TO AIR + the program output is now the THIRD paywall point (2026-07-25 · PR #3709, DRAFT, flag-dark)

**§ 4c's "the unified controller has no path to air" is RESOLVED.** The pop-out at `/panood/program/[eventId]` reads frames from its opener over `panood-program-bridge`, and that bridge had exactly **one installer — the legacy Cast control room**. The unified controller now installs the **same** bridge (no fork), opens the same route, and subscribes to Wave 4's **shared** WebRTC viewer (one-publisher → one-viewer per slot; a second viewer would steal the phones from the host's own monitor mid-ceremony). End to end: **QR camera-join → shared viewer → controller publishes the permitted slot → "Open program output" → the pop-out paints it with the § 4c overlays → OBS Window Capture → the couple's own YouTube.**

**🚨 THE PATH OPENS A BYPASS, and closing it is the load-bearing half.** Wave 3's gates stand on surfaces Setnayan **owns** (the `live_studio_roam_manifest` write + read gates). The program output is a publication path we do **not** own — the host's own OBS, the host's own YouTube. Under rehearse-free a host may legitimately cut between eight cameras; if those cuts reached the encoder, **rehearse-free would have meant broadcast-free via OBS.**

**THE MODEL — reduce the SOURCE, exactly as the manifest is reduced:**

| | program output |
|---|---|
| **Un-entitled** | exactly ONE camera — the host's ★ default channel, **cut-blind** |
| **Entitled** | unrestricted (no path can block a paid broadcast) |
| **Free single-cam** | unchanged, never withheld; `panood_watch_url` untouched |
| **Nothing cut** | nothing on air, free tier included |

⚠ **The pin deliberately IGNORES the cut** — unlike `limitPublishedManifest`, which uses the cut-aware `selectMainStageZone` because that path re-mirrors a manifest per provisioning cycle. Here the frame updates in real time, so honouring the cut would hand a free host **a live vision mixer**, which *is* the paid product. The host still chooses *which* camera, with the free ★ control. **Rehearsal is not walked back:** the controller monitor still follows every cut, for every host, at full brightness (§ 4d).

**Enforced server-side twice, from one helper** (`decideProgramAir` / `programSourceAllowed`, beside `decidePublish` which they reuse for the count): the controller only ever publishes a permitted slot, and the **pop-out independently re-resolves the decision on its own render and refuses to paint any other source** — the bridge is a plain `window` property in the host's browser, so trusting what arrives over it would make the paywall a suggestion. It survives a direct PostgREST PATCH: zone UPDATE RLS *is* row-level and the anon key *is* public, so a host can rewrite `is_featured` / `is_main_stage` / `status` — and may, because those only choose *which* channel the pin lands on; the **count** comes from `orders`, which `orders_insert/update_status_guard` makes unforgeable.

**Nothing faked:** a refused source shows a named "Unlock to broadcast all your cameras" card, never a black frame; a permitted-but-not-the-cut frame names the channel actually on air, and the controller says the same in plain words.

**⚠ TWO LIMITS, stated not hidden.** (1) Rehearse-free means every camera's media reaches the host's own browser **by design** — a host who rewrites their own browser's JavaScript can composite their own feeds. What is guaranteed is that **no shipped Setnayan code path** produces a multi-cam program frame for an un-entitled event. (2) A host could window-capture the **controller** and crop to the CH 1 monitor, which follows every cut by owner lock (§ 4d "no dimming") — yielding a chrome-cropped, low-res and **silent** feed (controller monitors are `muted` by construction; the pop-out is the only surface that carries audio). Blanking it would reverse the owner lock and recreate the exact defect § 4d exists to fix.

**🚨 § 4c's OPEN OWNER DECISION IS UNCHANGED AND STILL BLOCKS THE FLAG FLIP.** The unified path deliberately does **not** publish the legacy full-screen SETNAYAN overlay: its 24-hour window is anchored on `panood_control_state.first_live_at`, which the unified go-live path never writes, so feeding it would put a full-screen watermark over a host who **paid ₱2,999**. Free-tier branding on this surface stays the Wave 2 forced "POWERED BY SETNAYAN" bar. The legacy control room's watermark is untouched — so with the flag on, the unified path is the § 4d model and the legacy path is the 2026-07-21 model. **Owner still picks one.**

**🚨 NEW OPEN OWNER DECISION — retired-SKU grandfathering.** An event holding `PANOOD_SYSTEM` / `PANOOD_SYSTEM_MOBILE` (Cast ₱2,500) but not `LIVE_STUDIO` is treated as **un-entitled** by this gate. § 3 says those SKUs "fold into LIVE_STUDIO", which argues for grandfathering — but widening `canPublishMultiCam` also widens Wave 3's guest-side paywall, so it was left as a money decision rather than taken in the build.

## 5. Non-goals for V1 (explicit)
Compositing/PiP/graphics (phase-2 Pro) · a monthly plan · any vendor-side Live Studio plan · recording deliverables beyond what exists.

## 6. Competitive frame (for copy)
Positioned against **a switcher subscription + per-phone installs** (Switcher $65/mo) and **a crewed producer service** (LoveStream ₱18–35k). We are the only one that is **QR-no-install + guest-pick + per-event ₱2,999 + integrated**. Sources: Switcher pricing/features pages; PH videography market scan (2026-07-25 research).
