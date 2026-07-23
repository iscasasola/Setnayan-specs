# Live Studio — Cast & Roam (two products, one umbrella) — 2026-07-23

> **Status:** design + build plan. **Cast** = partly built (₱0 OBS path works, BYO channel). **Roam** = NOT built (design from the 2026-07-23 owner session). This doc is the canonical target for the build.
>
> **Origin:** owner design conversation 2026-07-23 — "can viewers pick which camera to watch, like Coachella's multi-place stream, with a switch to the directed feed?" → resolved into a second Live Studio product.
>
> **🔒 CHANNEL MODEL LOCKED 2026-07-23 (owner "we will integrate our own youtube channel"):** Roam runs on a **Setnayan-owned channel (pool)**, NOT the couple's channel. Chosen because it is the only model that is **truly 0-to-do for the couple**. This resolves S1 (see below) and reverses the 2026-07-08 "couple's own channel" lock **for Roam** (Cast stays BYO). Consequences baked into this design: (a) recordings are a **Setnayan → couple handoff**, (b) scale = a **channel pool**, (c) it **likely removes the OAuth verified-app review gate** (own-account access, no third-party user data).

---

## 🔴 OWNER SIGN-OFFS + ACTIONS

| # | Item | State |
|---|---|---|
| **S1** | **Channel model = Setnayan-owned channel pool** (reverses 2026-07-08 couple-channel lock, Roam only). | ✅ **RESOLVED** (owner 2026-07-23) |
| S2 | Roam price. | ✅ **RESOLVED 2026-07-23: ₱3,500/day** (Cast ₱2,500/day). ⚠ Only +₱1,000 over Cast → this prices the **software/capability** (multi-cam pick-your-view, cameras BYO via the QR claim = ~₱0 COGS like Cast), NOT a Setnayan-shipped hardware kit to N venues. If the owner wants the **done-for-you kit** it must be a **separate paid add-on** (its per-day COGS ≫ ₱1,000). Owner to confirm kit is add-on, not included. |
| G1 | **Verify Setnayan's own YouTube channel(s)** — live-streaming + concurrency enabled, in good standing. | ⏳ owner action (~2–3 wk) |
| ~~G2~~ | ~~Google OAuth verified-app review~~ | 🟢 **likely NOT required** — own-channel/own-credentials access isn't a sensitive third-party scope. *Confirm against Google's current policy before relying on it.* |
| G3 | Refresh prod DB creds (`SUPABASE_DB_PASSWORD`/pooler) — already blocks the Panood foundation migrations. | ⏳ owner action |
| G4 | **Request a YouTube Data API quota increase** from Google (default ~10k units/day ≈ ~dozens of camera-setups/day; burst days need more). File early. | ⏳ owner action |

> **₱0 streaming lock is preserved** — kit phones push *direct to YouTube* (Setnayan's channel), Setnayan never relays the media, YouTube absorbs all viewers. S2's costs are physical (gear/data/ops), paid by the couple.

---

## The two products

Both live under the **Live Studio** umbrella (the dashboard already carries a "Studio" nav item; the marketplace nav is now labeled "Merkado", key `explore` unchanged). **Both must appear as tiles in the Studio Suite (Silid) hub** — Roam is discoverable there, alongside Cast, not just a checkout SKU (owner 2026-07-23).

### Live Studio **Cast** — *we produce one directed show*
- The existing product: a directed single program feed. Broadcaster/Moment-Director switches cameras + overlays; viewers watch the curated story.
- **Delivery:** couple's own OBS → **couple's own YouTube channel** (BYO, unchanged) → event-page IFrame embed.
- **Cost to Setnayan: ~₱0** — the couple brings the machine, bandwidth, and channel. Setnayan provides software.
- **Tiers:** Free (1-cam, watermarked) · single paid SKU **₱2,500/day** (owner-locked 2026-07-21; unlocks 8 cameras + offline + full console). *(The old Mobile/Desktop split is now a runtime layout choice, not a price.)*

### Live Studio **Roam** — *guests move around and choose*
- NEW. Multiple cameras / zones / **venues**, each its own live stream. The event page shows a **camera/zone/venue picker**; guests pick where to watch, with the directed feed as the default "just show me the wedding."
- **Delivery:** Setnayan-provided kit phones push **direct to YouTube (RTMP) on a Setnayan-owned channel (pool)**; event page embeds N streams behind a picker.
- **Price: ₱3,500/day** (owner-locked 2026-07-23 · Cast is ₱2,500/day). The +₱1,000 over Cast prices the multi-camera capability; base Roam assumes **cameras BYO** (phones joined via the QR claim), so it's ~₱0 COGS + pure margin like Cast.
- **Cost to Setnayan: ₱0 streaming + ~₱0 base** (BYO cameras). A **Setnayan-provided camera kit** (SIM data + hardware + ops) — the fuller "0-to-do" version — is a **separate paid add-on**, not covered by the ₱3,500/day base (its per-day COGS exceeds the ₱1,000 premium). Owner to confirm.
- **Positioning:** premium, for **receptions / debuts / big multi-zone or multi-venue events** — parallel action worth choosing between. (Intimate ceremony → Cast's directed feed wins.)

### Naming — **Cast + Roam** (locked)
- Do **NOT** rename the dashboard "Explore"/"Merkado" — it's the vendor marketplace (`/explore` → `/dashboard/[eventId]/vendors`, key `explore`, a core wired surface). Roam gets its own name. "Roam" also fits Panood's "presence across distance" soul.

---

## Cost truth (say it plainly)

| | Cast | Roam |
|---|---|---|
| Streaming cost / viewer | ₱0 (YouTube) | ₱0 (YouTube) |
| Setnayan marginal cost / event | ~₱0 | **NOT ₱0** — SIM data + kit + ops + recording storage (couple pays via price) |
| Who brings gear + bandwidth | the couple | **Setnayan** (kit + SIM) |
| Channel | couple's own (BYO) | **Setnayan-owned pool** |
| Recording ownership | native (couple's channel) | **handoff** — Setnayan pulls the VOD → delivers to couple |
| Build state | partly built | **not built** |

Never free: **bytes** (telco upload) + **hardware** — neither is a "streaming service" fee. Streaming itself is ₱0 for both.

---

## Roam architecture (Setnayan-owned channel, ₱0 streaming)

**Principle:** the kit phone streams straight to YouTube on Setnayan's channel; Setnayan never touches the video. Orchestration is free software; the media path is YouTube's — free, audience-independent.

1. **Capture = parked kit phones, no login.** Each camera is a Setnayan kit phone with a **pre-configured capture app** doing direct RTMP push (browsers can't RTMP — a native piece / container-app gap; interim = Larix + a provisioning deep-link). Onboarding reuses the Papic/`panood_camera_operators` QR-token claim — the QR now also carries the **per-camera stream key**. A "zone" = a phone on a stand with power + a SIM.
2. **Orchestration = Setnayan API on Setnayan's own channel (free software, simpler than BYO).** On purchase, the backend **checks out a channel from the Setnayan pool** for the event, pre-creates N YouTube broadcasts + mints N stream keys (own credentials — no per-couple OAuth dance), and hands each kit phone its zone's key at provisioning. Auto-bind at claim time — no human wires camera→stream→broadcast.
3. **Channel pool, one channel per event (isolation).** Each event gets its **own** pool channel for its window, returned afterward. This isolates concurrency (a wedding's 3–4 streams sit well under the per-channel cap) **and** blast radius (a copyright strike hits only that event's channel, never other weddings). Pool size = *peak concurrent events*, grown with volume. *(Packing multiple small events per channel is a later efficiency option; start one-per-event.)*
4. **Recording handoff (answers "how do hosts download their live?").** After the event, Setnayan **pulls each stream's VOD** from the pool channel and delivers it to the couple — download on their dashboard + into their **Alaala** gallery (optionally re-published to a channel they connect). The channel is then wiped + returned to the pool. Matches the existing "auto-archive → couple downloads" pattern.
5. **Delivery = the couple's event page.** The page embeds the N YouTube streams behind a **picker** (Ceremony · Floor · Garden · Booth; across venues Church · Reception). Default = the directed/featured feed (the "switch to the control room" option). A dropped zone shows "offline" → falls back to the featured feed. Default single-player + labeled picker (a live grid is heavy on the *viewer's* device, though free for Setnayan).
6. **Multi-venue helps.** Each venue's kit uploads over **its own SIM**, so bandwidth is *distributed across locations*. Venues don't need frame-sync (different places). The only "sync" is **editorial** — the featured view follows the action (church during the ceremony → reception hall after).

**Customer prep = ~none:** the couple names venues/zones; Setnayan pre-configures the kit; the couple (or their on-site coordinator/videographer) powers it on and places it.

---

## Scaling & limits (the locked-model envelope)

- **Viewers: unlimited, ₱0.** Never binds.
- **Cameras / wedding:** Cast up to **8 → 1** directed feed; Roam **~2–4** selectable streams.
- **Concurrent weddings — bounded (the tradeoff of the Setnayan-owned choice):**
  - **Channel pool** — need ~1 pool channel per concurrent event; grow the pool with volume (managing many verified channels is real ops).
  - **🔑 YouTube Data API daily quota** — ~200 units per fully-provisioned camera; default ~10k units/day ≈ **~50 camera-setups/day ≈ ~12–15 weddings/day at 3–4 cams**. **50-weddings-at-once (150–200 broadcasts) needs a quota increase (G4).** *(Order-of-magnitude — verify current unit costs with Google.)*
- **Done-for-you kit weddings/day:** capped by **kit inventory ÷ ~3** (e.g. 60 kits → ~15–20 concurrent). Treat the concierge tier as bounded; cap bookings/day.
- **Per-channel first-live enablement:** phone-verify + 24h before a channel's first stream (handled once per pool channel, not per couple — a win of the pool model).
- **Cost:** ₱0 streaming at any scale; real costs = gear + SIM data + recording storage.

> **Reality check:** ~**0 concurrent weddings today** (63 events / 5 Papic orders ever). None of these bind now. Build the foundation, start a **small pool** (1–3 channels), and **file G4 early** so quota is approved long before it's needed — don't over-build a 50-channel pool for phantom volume.

---

## Build plan — parallel & sequential (flag-dark)

**Track A — Cast** and **Track B — Roam** run in parallel; ship flag-dark (project convention).

### Track A — Cast (finish the directed product · BYO channel)
- **A0 (owner):** clear G3 (DB creds) → apply the Panood foundation migrations + run the walking-skeleton test.
- **A1:** reconcile with in-flight `wt-panood-fit` (pop-out) + `wt-ls-single` (VAT) — land, don't duplicate. All other Panood worktrees are already merged.
- **A2:** confirm the single ₱2,500/day SKU + free watermarked tier; flip `NEXT_PUBLIC_PANOOD_STREAMING_ENABLED` only after a real-event WebRTC test.

### Track B — Roam (new · Setnayan-owned channel)
- **B0 (owner, now):** S2 price · start G1 (verify Setnayan channel[s]) · file G4 (API quota). *(G2 likely dropped.)*
- **B1 ✅ SHIPPED (flag-dark):** data model — `live_studio_roam_zones` + venue grouping, `live_studio_roam_channel_pool` (checkout/return/status), `live_studio_roam_streams` (**N broadcasts per event** — isolated from Cast's single-active `panood_broadcasts`, not touched), + `events.live_studio_roam_manifest` (public mirror), RLS at CREATE. Flag `NEXT_PUBLIC_LIVE_STUDIO_ROAM_ENABLED` (`lib/live-studio-roam.ts`). Code namespace `live_studio_roam_*` (renamed off the legacy `panood_*` — PRs #3579/#3582/#3588 + rename #3591).
- **B2 (unblocked, flag-dark):** viewer **picker UI** on `app/[slug]/page.tsx` — N-embed player + zone/venue switcher + featured-default + offline-fallback. Buildable against mock stream IDs.
- **B3 (needs G1):** provisioning — extend `lib/panood-youtube.ts` to create N broadcasts + keys on a **pool channel** (own credentials); pool checkout/return; recording pull + delivery to dashboard/Alaala.
- **B4 (native):** direct-RTMP capture app for kit phones (container-app gap) — or interim Larix + provisioning deep-link.
- **B5:** kit spec + ops runbook (phones, SIM, power, coordinator-placement) + admin live-health + pool-management surface + Roam SKU in `platform_retail_catalog_v2` / `v2-catalog.ts` + **register Cast + Roam as tiles in the Studio Suite (Silid) hub** (coordinate with in-flight `wt-silid` / `wt-suite-grid`) so both are discoverable from the Studio surface, not just at checkout.
- **B6 (GATE):** **no paying wedding until Roam survives a non-paying mock event** (the wedding-is-unrepeatable rule).

**Unblocked to start in code now:** B1 (schema) + B2 (picker UI). Sync to `origin/main` first — the local checkout is ~200 commits stale.

---

## Cross-refs
- `Live_Studio_Repackaging_2026-07-08.md` (device tiers, couple's-OBS ₱0 model — Cast's basis; S1 reverses its channel model for Roam only)
- `Panood_Multicam_Architecture_2026-06-26.md` (controller feature set, routing, console UI — Cast's how)
- `Live_Studio_Competitive_and_Pricing_2026-07-20.md` (YouTube sole *in-app* delivery; Facebook via OBS)
- `02_Specifications/09_Panood_Feature_Specification.md` (living feature spec)
- Code (`setnayan-platform`, origin/main): `panood_*` tables (`panood_broadcasts` single-active index → relax), `lib/panood-youtube.ts`, `lib/panood-broadcast.ts`, control-room under `app/dashboard/[eventId]/studio/panood/`, `/panood/cam/[token]`, viewer embed `app/[slug]/page.tsx` `WatchLiveBlock`, `app/explore` (marketplace — do NOT rename)
