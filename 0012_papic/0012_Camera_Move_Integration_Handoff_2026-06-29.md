# Papic ⟶ Camera-Move Integration Handoff

> **Purpose.** Transfer the §16.9 "camera move" work (the *Vids AI* effect for Guest Stories) into a Papic-focused session so the remaining tiers are integrated properly.
> **Date:** 2026-06-29 · **Author:** Claude Code session (Stories camera-move build) · **Status verified against `origin/main` + live prod.**
> **Read order:** §0 (status) → §3 (engine API) → §4 (render wiring) → §5 (Papic data seam) → §6/§7 (the two things left to wire). Everything is repo-relative to `apps/web/`.

---

## 0. TL;DR — what's live, what's left

The camera move turns a still photo into something that reads as *filmed* (push-in / pan / roll / orbit-feel), beat-synced, in the **Guest Stories** reel a Papic guest renders at `/papic/me/[token]`. It is **deterministic, ₱0 per render, client-side** (no server render pipeline needed).

| Tier | What | Status on prod (`www.setnayan.com`) |
|---|---|---|
| **1 · Camera move** | push/pan/roll/orbit-feel per photo | ✅ **LIVE + correct** — every Guest Story photo moves (default move is centered, no edge reveal) |
| **1b · Beat-punch + beat-cut** | cuts/zoom snap on the music's real downbeats | ⚠️ **Deployed but INERT** — verified **0 of 30 active `reel_music_tracks` have a `beat_grid`**, so reels render an EVEN split with NO on-beat cuts and NO punch today (see §8). Fix = data, not code. |
| **2 · Auto-reframe** | zoom converges on the subject | ✅ **LIVE as a heuristic** (portrait bias `0.5,0.44`). ⏳ *Detected* centering is a **real refactor, not a quick wire** — ingest face detection is gated + discards boxes (corrected §6) |
| **3 · Depth parallax** | foreground separates from background (true 2.5D) | ⚙️ **Render path COMPLETE but DORMANT** — needs a per-photo depth map + a CORS-enabled depth bucket + a hosted model (see §7) |

> **⚠ Known gaps (adversarial audit, 2026-06-29).** This feature was gap-audited after the handoff. The corrections are folded into §6 (Tier-2 is a refactor) and §8 (beat-sync inert), and the full list is in `DECISION_LOG.md` (row dated 2026-06-29, "camera-move gap audit"). Two latent geometry bugs (off-center-focal edge reveal; high-amount horizontal-pan overscan overshoot) are **dormant today** but **must be fixed inside the Tier-2 work** — see §6.

**Merged + deployed:** PRs [#2387](https://github.com/iscasasola/setnayan-platform/pull/2387), [#2401](https://github.com/iscasasola/setnayan-platform/pull/2401), [#2406](https://github.com/iscasasola/setnayan-platform/pull/2406) — all merged to `main`; the prod deployment was built after they landed. Verified live: `https://www.setnayan.com/camera-move-preview` renders the Tier-1 demo.

**The single owner decision that unblocks the most:** pick + host a **depth model** for Tier 3 (see §7.3). Tier 2 detected-reframe needs **no new model** — just persist a face center (see §6).

---

## 1. What the feature is (one paragraph)

A guest's tagged photos are rendered client-side into a 9:16 reel. Each photo gets a deterministic virtual-camera move so the montage feels shot on video, not slideshowed — the thing competitor "Vids AI · Reels Video Editor" sells. It is the §16.9 layer of `02_Specifications/14_Music_Catalogue_Cowork_Playbook.md`. The honesty lock (carried in code + spec): this is a **fake-depth** move (push-in + parallax + auto-reframe) that *reads* as a circling camera — **not** a generative 360° orbit (that would be per-render AI and break the "template-driven, no per-render AI" lock).

---

## 2. The three PRs and what each landed

| PR | Title | Key files |
|---|---|---|
| #2387 | engine + live preview (Tier 1) | `lib/stories-camera-move.ts` (engine), `lib/stories-templates.ts` (`StorySlot.cameraMove`), `app/camera-move-preview/page.tsx` (internal demo route) |
| #2401 | apply moves in the live render | `lib/reel-render.ts` (`drawCover`), `app/papic/me/[token]/_components/guest-story-maker.tsx` |
| #2406 | beat-punch + auto-reframe + depth parallax | `lib/reel-render.ts` (`withCamera`, `buildNearLayer`, `maybeBuildNearLayer`, `RenderClip.subjectCenter`/`depthUrl`), `lib/stories-camera-move.ts` (`beatPunchAtDownbeats`, `resolveFocus`, `Focus`) |

---

## 3. Engine API — `lib/stories-camera-move.ts` (pure, zero deps)

The whole engine is deterministic and render-target-agnostic (same functions drive the in-browser preview, the client MP4 render, or a future server render). Exports:

| Export | Signature | Purpose |
|---|---|---|
| `MoveType` | `'push_in'｜'pull_out'｜'pan_l'｜'pan_r'｜'pan_u'｜'pan_d'｜'roll_cw'｜'roll_ccw'｜'orbit_feel'` | the move vocabulary |
| `Ease` | `'linear'｜'in_out'｜'accel'` | easing |
| `CameraMove` | `{ type; amount:0..1; ease?; auto_reframe?:boolean; parallax?:'none'｜'subtle'｜'strong' }` | per-photo spec |
| `Transform` | `{ scale; tx; ty; rot }` | a camera pose at one instant |
| `Focus` | `{ x; y }` normalized 0–1 | focal point a zoom converges on |
| `cameraAt(move, p)` | `(CameraMove, p:0..1) → Transform` | **the core** — pose at progress `p` |
| `applyEase(p, ease)` | `→ number` | eased progress |
| `beatPunch(tSec, bpm)` | `→ ≥1` | zoom punch from a uniform bpm |
| `beatPunchAtDownbeats(tSec, downbeatsSec[])` | `→ ≥1` | zoom punch on **real** downbeats (used in render) |
| `resolveFocus(move, subjectCenter?)` | `→ Focus` | Tier-2: subject center if given, else portrait bias `(0.5, 0.44)`, else center |
| `depthAdjust(cam, depth, strength)` | `→ Transform` | Tier-3 per-layer parallax math (used by the preview; render uses `buildNearLayer`) |
| `parallaxStrength(p)` | `'strong'→1, 'subtle'→0.5, else 0` | enum→scalar |
| `defaultCameraMove(i, amount=0.55)` | `→ CameraMove` | tasteful per-slot default (`auto_reframe:true`, `parallax:'subtle'`) |
| `defaultMoveForIndex(i)` | `→ MoveType` | the rotation `push_in/orbit_feel/pan_r/push_in/roll_cw/orbit_feel` |
| `toSvgTransform(t, cx, cy)` | `→ string` | CSS/SVG transform (preview only) |

**Overscan is baked in:** every move keeps `scale ≥ 1.16`, so pan/roll never reveal the frame edge. Tuning constants (overscan, per-move magnitudes) are internal — change them in this one file.

---

## 4. How it's wired into the live render — `lib/reel-render.ts`

`reel-render.ts` is the **client-side Canvas-2D reel renderer** (ex-`patiktok-render.ts`). It composites photos/clips to a 1080×1920 canvas and encodes via WebCodecs→mp4 (fallback MediaRecorder→webm). The camera move applies to **PHOTO slots only** — video clips already move, so the Patiktok booth is untouched.

**`RenderClip`** (the per-source input) now carries:
```ts
type RenderClip = {
  clipId: string; url: string; durationSec: number | null;
  kind?: 'clip' | 'photo';
  cameraMove?: CameraMove;        // §16.9 — the move
  subjectCenter?: Focus | null;   // Tier 2 — detector output (currently always unset)
  depthUrl?: string | null;       // Tier 3 — depth-map URL (currently always unset)
};
```

**Render-time helpers (all in `reel-render.ts`):**
- `withCamera(ctx, move, focal, paint)` — applies the transform about a **focal point** (`focal.x*OUT_W, focal.y*OUT_H`), then runs `paint`. This is the Tier-2 convergence point.
- `drawCover(ctx, source, template, move?, focal?, nearLayer?)` — fills the dark backdrop, draws the FAR layer (full photo) via `withCamera`, and — when a `nearLayer` is supplied — draws the depth-masked NEAR layer at an amplified move (`scale·1.6`, `tx/ty·1.6`) for parallax.
- `buildNearLayer(image, depth)` — **once per photo**: an OUT-sized canvas = the cover photo with per-pixel alpha taken from the depth map's luminance (white=near=opaque). One O(pixels) pass, never per-frame.
- `maybeBuildNearLayer(image, source)` — loads `source.depthUrl` and builds the near layer **only if** `depthUrl` is set and `parallax !== 'none'`; returns `null` (flat fallback) on absence or CORS-taint. Never throws.

**Both encode loops** (WebCodecs frame loop + MediaRecorder rAF tick) do, per photo:
```
p = progress 0→1 across the slot
move = cameraAt(clip.cameraMove, p)
move.scale *= beatPunchAtDownbeats(absoluteTimeSec, downbeats)   // downbeats = opts.beatGrid?.downbeats ?? []
focal = resolveFocus(clip.cameraMove, clip.subjectCenter)
nearLayer = maybeBuildNearLayer(img, clip)   // built once, before the loop
drawCover(ctx, img, template, move, focal, nearLayer)
```

**Caller** — `app/papic/me/[token]/_components/guest-story-maker.tsx` builds the clips:
```ts
clips: plan.photos.map((p, i) => ({
  clipId: p.id, url: p.url, durationSec: null, kind: 'photo' as const,
  cameraMove: defaultCameraMove(i),
  // subjectCenter / depthUrl NOT set yet — that's the Tier 2/3 wire
})),
```
`plan.music.beatGrid` and `plan.template.beatsPerCut` are already passed to `renderReel()` — so **beat-punch is fully fed today**.

---

## 5. The Papic data seam — `lib/guest-stories.ts`

This is **the one file** where Tier-2/3 data must be threaded from the DB to the render.

- **`buildGuestStoryPlan()`** → `GuestStoryPlan { taggedPhotoCount, canRender, photos: StoryPhoto[], template, music }`.
- **`StoryPhoto`** today is just `{ id: string; url: string }` → must grow `subjectCenter?: Focus|null` and `depthUrl?: string|null`.
- **`readTaggedPhotos()`** (≈ lines 90–160) queries `papic_photos` and `papic_guest_captures` (`{photo_id|capture_id, r2_object_key}`, filtered `moderation_state='clean'`, photo only, not hidden), builds a `keyById` map, and **presigns** each `r2_object_key` via `displayUrlForStoredAsset` (1-hour TTL). **This presign loop is exactly where a `depth_r2_key` would also be presigned into `depthUrl`.**
- **Music is already complete:** `pickMusic()` reads `reel_music_tracks.beat_grid` (JSONB `{bpm, beats[], downbeats?[], …}`) and passes it through. (There's a defensive retry if the `beat_grid` column is missing — error `42703`.)

**Two photo tables, identical pattern:**
- `papic_photos` — seat captures. Columns incl. `r2_object_key, width_px, height_px, moderation_state, display_r2_key, thumb_r2_key, wall_safe_r2_key, poster_r2_key`.
- `papic_guest_captures` — per-guest captures (150-credit quota via `papic_record_guest_capture` RPC). Same derivative/moderation columns.

---

## 6. Tier 2 — detected auto-reframe (a real refactor — CORRECTED 2026-06-29)

**Current state:** `resolveFocus()` is live with a portrait-bias default (zoom converges slightly above center, `y=0.44`). `RenderClip.subjectCenter` is plumbed through `drawCover` but **never populated** by the maker, so detected centering is entirely unbuilt.

> **⚠ CORRECTION (gap audit):** an earlier draft of this section claimed "face boxes already exist at ingest — just persist them, no new inference." **That over-claims.** The audit traced `lib/face-blur.ts`:
> - **Detection is double-gated** (`bakeFaceBlurForCapture` runs only when the event owns `LIVE_WALL` *and* a FaceBlock opt-out guest exists) — **typical events compute NO boxes at ingest.**
> - Even when it runs, `bakeWallSafeJpeg` returns `{ jpeg, facesFound, width, height }` and the RPC persists **only the `facesFound` count** — the **box coordinates are discarded.**
> - Boxes are absolute pixels in the EXIF-rotated, 1600px-capped derivative (not 0–1), and the 5-tile sweep is privacy-tuned to over-detect at ~3s CPU — wrong tolerance/cost for a crop center.
>
> So detected auto-reframe is a **real (small) refactor**, not a 1-hour wire.

**Steps to build it (corrected):**

1. **Ingest detect pass** — add an **ungated, lightweight single-pass** face detect for **every clean photo** at ingest (independent of FaceBlock/LIVE_WALL), or refactor `bakeWallSafeJpeg` to also run + return the dominant box on the non-FaceBlock path. Pick the largest/most-central box; normalize to 0–1 by the bake's own `width/height`.
2. **Migration** — add `subject_center_x NUMERIC, subject_center_y NUMERIC` (0–1, nullable) to `papic_photos` + `papic_guest_captures` (additive, rides existing RLS — no new policy) + a writer.
3. **Read** — in `readTaggedPhotos()` (`lib/guest-stories.ts`), add the two columns to the SELECTs; unpack into `StoryPhoto.subjectCenter = { x, y }` (null when absent).
4. **Caller** — in `guest-story-maker.tsx`, pass `subjectCenter: p.subjectCenter` into the `RenderClip`.
5. **⚠ FIX THE EDGE-REVEAL BUG IN THE SAME PR (mandatory).** `resolveFocus` will now return near-edge centers, and `withCamera` scales/rotates about the focal point while `drawCover` cover-fits **centered** — so a near-edge focal on a pan/orbit **reveals the dark backdrop** (measured ~87px at `x=0.1`, amount 1). Fix in `withCamera`: clamp the focal offset to the safe band per axis `= (cover+overscan margin)/scale`, **or** translate the cover-fit draw so the subject sits at frame center before the camera transform. Add a node-canvas edge-coverage test (see §9, test gap).

**Nuance:** group photos have several faces; "largest/most-central" is a fine v1. Photos with no detected face fall back to the portrait heuristic automatically.

---

## 7. Tier 3 — depth parallax (the real owner-infra step)

**Current state:** the render path is **complete and verified** (`buildNearLayer` + the amplified near-layer composite; proven with a synthetic depth map). It is **dormant** because no photo has a `depthUrl`. With none, `maybeBuildNearLayer` returns `null` and the render is a flat move — **zero added cost today.**

**To activate, three pieces:**

### 7.1 Storage (small, additive)
Migration: add `depth_r2_key TEXT` (nullable, r2:// ref) to `papic_photos` + `papic_guest_captures`, mirroring the `display_r2_key` pattern. In `readTaggedPhotos()`, presign it into `StoryPhoto.depthUrl` in the same loop as the photo URL; pass through in `guest-story-maker.tsx`.

### 7.2 Ingest hook (fits the existing pattern)
The capture flow already has a fire-and-forget `after()` chain (NSFW screen → `generatePhotoDerivatives` → face-blur bake → wall ingest → Drive copy), all best-effort. Add `generateDepthMap(originalRef, table, idCol, idVal)` to that chain: fetch the photo bytes → run depth inference → upload a grayscale depth PNG to the `derivatives/` prefix → `UPDATE depth_r2_key`. Latency (1–10s) is fine because the chain never blocks the capture response.

### 7.3 The model — **this is the owner decision**
Vercel Node has no GPU and the model is 100MB+, so inference must run **off-Vercel**. Options (OSS-first per house preference):
- **Hosted endpoint** — MiDaS / Depth-Anything on a Modal / Replicate / HF-Spaces / Oracle-A1 worker. Server-at-ingest; needs the endpoint stood up + a secret.
- **In-browser at render time** — ONNX-Runtime-Web + a small depth model. **No server**, but this is the **mobile-perf long pole** the spec flags (§16.8) — *run an encode/inference spike on a mid-range Android before committing.*

> ⚠ **Surface for sign-off:** this is the only piece that costs money/infra and has a real mobile-perf risk. Recommend: stand up a small hosted depth endpoint (server-at-ingest), keep it best-effort, and gate the visible 3D effect behind a Papic SKU if desired. No code change activates it beyond populating `depth_r2_key`.

---

## 8. Beat-punch + beat-cut — DEPLOYED BUT INERT (data gap, CORRECTED 2026-06-29)

`beatPunchAtDownbeats()` punches the zoom on `beat_grid.downbeats`, and `buildBeatSchedule` snaps cuts to the grid — both self-disable to an **even split** when a track has no grid.

> **⚠ Verified against the prod DB (njrupjnvkjkitfctetvi): 0 of 30 active `reel_music_tracks` have a `beat_grid`.** So **today every Story renders an even split with no on-beat cuts and no zoom punch** — beat-sync ships as dead weight. The camera MOVE still works; only the beat layer is off.

**To activate (data, not code):** populate `beat_grid.{bpm,beats[],downbeats[]}` for the 30 seeded tracks — either lift the prod guard in `scripts/analyze-beat-grids.mjs` for a one-time controlled run and commit the grids as a seed, or compute `beat_grid` at track ingest. Add a health check counting active tracks missing a grid. **Until then, don't market "hits the beat."**

> **Latent bug to fix at population time:** `buildBeatSchedule` re-bases the grid by `t0 = beats[0]` for cut placement, but downbeats are fed **raw** to `beatPunchAtDownbeats` — a track with a lead-in (`beats[0] > 0`) drifts punch-vs-cut. Re-base downbeats by the same `t0` before populating/consuming.

---

## 9. Open items / risks (audited 2026-06-29)

**Live-impacting**
- 🔴 **Beat-sync inert** — 0/30 tracks have a `beat_grid` (see §8). Top fix.

**Quality / infra (real, not blocking)**
- 🟠 **MediaRecorder non-determinism** — music reels are forced onto the MediaRecorder path (WebCodecs is video-only until an `AudioEncoder` lands, `reel-render.ts:632`), so motion is wall-clock + rAF driven and **stutters on slow devices**. Mitigate: clamp per-frame `dt`; land the AudioEncoder follow-up.
- 🟠 **Zero render-path observability** — silent degradations (WebCodecs→MediaRecorder, music-CORS→silent, depth-taint→flat) never surface; no Sentry/PostHog on the client render. Add `captureException` in the maker catch + PostHog `render_started/succeeded/failed(reason)` (no PII).
- 🟡 **`prefers-reduced-motion` unhandled** — WCAG 2.3.3; ~20 components honor it, the move + preview loop don't. Gate the preview rAF; pass a near-zero/"hold" move + disable punch when reduced-motion.
- 🟡 **Canvas funcs untested** — `drawCover`/`withCamera`/`buildNearLayer` have no unit coverage (Node has no canvas). Add a `@napi-rs/canvas` harness asserting `getImageData` (marker-pixel shift; overscan covers for center AND edge focals; near-layer alpha 255-on-white/0-on-black). This catches the two geometry bugs.

**Latent geometry bugs (dormant; fix when they can fire)**
- 🟠 **Off-center-focal edge reveal** — fix inside Tier-2 (see §6 step 5).
- 🟠 **Horizontal-pan overscan overshoot** (~15px at high `amount`; 0px at default 0.55 centered) — make horizontal overscan move-aware (`scale ≥ 1 + 2·maxTxPx/OUT_W`) or cap pan `tx`.

**Product / hygiene**
- 🟡 **`/camera-move-preview`** likely public + not in `robots.ts DISALLOWED_PATHS`, leaking "§16.9 · ₱0 per render". Cheapest: delete it (engine is exercised by the maker + unit tests). Else: auth + `robots.ts` + noindex + strip jargon. *Verify `robots.ts` before acting.*
- 🟡 **Depth default** — `defaultCameraMove` ships `parallax:'subtle'`, so the renderer asks for depth that never arrives (harmless flat fallback). Honest default until Tier-3 lands: `'none'`. And provision a **CORS-enabled depth bucket** (else `getImageData` taints → silent flat).
- **Template selection** hardcoded to `DEFAULT_STORY_TEMPLATE` — per-event/guest choice is a separate future.
- **Worktree/branch cleanup:** `wt-camera-move`, `wt-camera-wire`, corpus `.claude/launch.json` — safe to remove now everything merged.

**Refuted by the audit (NOT bugs):** single-photo divide-by-zero (guarded), camera move bleeding onto video clips (clips untouched), CORS taint → wrong frames (degrades gracefully), punches at the wrong musical instant (reel-time == song-time).

---

## 10. First 30 minutes in a Papic session

1. Read this doc + `02_Specifications/14_Music_Catalogue_Cowork_Playbook.md` **§16** (esp. §16.9).
2. Open `lib/reel-render.ts` (`drawCover`/`withCamera`/`buildNearLayer`) and `lib/guest-stories.ts` (`readTaggedPhotos`) side by side — that's the whole integration surface.
3. **Tier 2 first** (cheap, no new infra): the migration + the 3-line read/pass-through + reuse the face-blur boxes. Ship it; detected auto-reframe goes live.
4. **Then Tier 3**: get the owner's depth-model decision (§7.3) before writing the ingest hook.
5. Verify like this session did: a synthetic depth map proves `buildNearLayer`; a real Guest Story at `/papic/me/[token]` (≥3 tagged photos) proves the end-to-end render.

---

## 11. References

- **Spec:** `02_Specifications/14_Music_Catalogue_Cowork_Playbook.md` §16.9 (camera-move layer), §16.4 (`zoom_punch`), §16.7 (two render paths), §16.8 (build phases + mobile risk).
- **Decision log:** `DECISION_LOG.md` rows dated 2026-06-29 (engine #2387, live render #2401, Tiers 1–3 #2406).
- **Memory:** `project_setnayan_guest_stories_music_beatsync` (the canonical state), `project_setnayan_marginal_cost_model` (₱0-render frame), `project_setnayan_stories_sde_buildplan`, `project_setnayan_papic_completion_program`.
- **Live proof:** `https://www.setnayan.com/camera-move-preview`.
- **Hard locks:** template-driven render, **no per-render AI**; 9:16 1080×1920; ₱0 marginal (R2 only); fake-depth, never a generative orbit.
