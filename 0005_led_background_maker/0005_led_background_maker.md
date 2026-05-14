# 0005 — 8K LED Background Maker

**Type:** Implementation work order (Claude Code ticket)
**Surface:** Setnayan Web → Couple Dashboard ("LED Background Maker" panel) + server-side rendering pipeline · **Bottom-nav tab: In-App Services** · URL: `setnayan.com/dashboard/[event-id]/services/led`
**Phase:** Phase 1.5 — depends on Phase 1 (events, dashboard shell, R2 storage) and the locked Hero Monogram from iteration 0004
**Status:** Ready for Claude Code
**Date:** 2026-05-08
**Owner:** Ice (indaleciocasasolaii@gmail.com)
**Builds on:** 0000 (app shell, sign-in, event-scoped URL, In-App Services launcher), 0004 (Hero Monogram widget — supplies the monogram), 0002 (palette + accent color), spec 10 (R2 storage)

---

## What to build

A couple-facing template maker that produces a **self-contained MP4 background video designed to play continuously for the entire 5-hour wedding event**. The couple picks one of 10 pre-built motion-graphics templates, customizes background color / effect intensity / overlay / master-loop length, previews live in the editor, then triggers a server-side render that produces a polished file the venue's tech drops into their playback system and sets to repeat for the duration of the reception.

**Event-length design target (locked 2026-05-08):** the LED Background plays for the full 5-hour event. The MP4 is a **5–30 minute master loop** that the venue's playback system repeats end-to-end. Each loop is seamless (last frame matches first frame).

**Two playback modes — with very different photo-variety behavior:**

1. **Offline MP4 (default, recommended for 95% of weddings).** A self-contained file the venue tech downloads once and plays from local USB. Photos are **baked in at render time** — the same photo sequence plays every loop iteration. Variety comes from how many photos fit in the master loop (longer loop = more photos baked in = less perceived repetition over 5 hours). A 10-min default loop holds ~60 photo moments (~10 s each); over 30 repeats, guests see those same 60 moments cycle through 30 times — repetitive but reliable. A 30-min loop holds ~180 moments and only loops 10× across the reception, which feels almost continuous.

2. **Live feed (Live Playback URL ₱99 + Photo Pool ₱1,999).** A browser-based player at `setnayan.com/led/{event-slug}/live` renders the LED background continuously and **fetches a fresh randomized selection from the full Photo Pool per loop iteration**. Over 30 loops across a 5-hour event, guests can see 500+ unique photo moments — but this mode **requires stable internet at the venue throughout the event**, so it is a convenience option, not the safe default.

**Random/rotating photo behavior is live-feed-only.** A pre-rendered MP4 cannot dynamically change content during playback. Couples who want true random rotation must use the live feed mode and accept the internet dependency. Couples who want maximum photo variety in offline mode should pick the longest practical master loop (30 min, or 90 min via the Custom tier).

The visual quality bar is **Renderforest-class motion graphics** — layered animated elements (color washes, particle drifts, ornament rings, light blooms, film grain) running concurrently, each at different speeds and depths, producing the "alive, breathing" aesthetic that turns a static monogram into ambient venue art.

---

## Visual reference (canonical)

`0005_led_background_maker.html` (this folder) is the canonical visual reference. Open it and watch the desktop preview pane — the **Filigree Bloom** template is rendering live with seven animated layers stacked:

1. **Color wash** — radial gradient that breathes, scales, and rotates slowly (12s cycle).
2. **Filigree pattern** — multi-point radial blur pattern that scales 100%→115% and rotates 30° back-and-forth (16s cycle).
3. **Light bloom** — large soft circular gradient that pulses (6s cycle, scale 0.9→1.15).
4. **Particles** — 15 individual glowing dots drifting upward at different speeds (22s loops, staggered delays).
5. **Outer ornament ring** — decorative glyphs rotating around the monogram (40s, full clockwise).
6. **Inner ornament ring** — smaller glyphs rotating counter-clockwise (28s).
7. **Film grain** — high-frequency stochastic noise overlay (0.6s steps animation, screen blend mode).

The mockup uses CSS-only animations to demonstrate the visual style. **Production rendering uses Remotion** (see "Render pipeline" below) to produce real H.264 MP4 video files at 8K.

---

## Stack & conventions — 100% free V1 stack (locked 2026-05-08)

- **Frontend (editor):** Next.js 15 RSC for the layout, Client Components for the live CSS preview and customization controls. Same dashboard shell as iterations 0002 / 0003 / 0008.
- **Render engine:** **FFmpeg + Lottie** (both free, open source). Each of the 10 templates = (1) a Lottie JSON file holding the structured animation (paths, geometry, names, monogram source), and (2) an FFmpeg filtergraph config holding the post-processing layers (particles, color grade, grain, light leaks, vignette). Server orchestrates: render Lottie → PNG sequence at the chosen resolution → FFmpeg composites overlays + grade + encode H.264 MP4.
  - **Why not Remotion:** Remotion's commercial license is $75–125/month for teams Setnayan's size. FFmpeg + Lottie matches Renderforest's visual quality with zero recurring license fees. Remotion is a V1.5 upgrade path if/when engineering velocity becomes a constraint.
- **Lottie templates:** 10 templates sourced from a mix of (a) free LottieFiles wedding library and (b) custom-designed by motion designer. See `0005_ffmpeg_lottie_reference.md` for sourcing details.
- **Output format:** H.264 MP4, **10-minute master loop default** (5 / 10 / 30 minute options). The MP4 is engineered to repeat seamlessly so the venue's playback system can loop it for the full 5-hour reception with no perceptible seam at the wrap. Three resolutions, priced separately at render time (see Pricing section).
- **Why a master loop instead of a literal 5-hour MP4:** at 8K H.264 with reasonable bitrate, a 5-hour single-pass render is ~80–110 GB — undeliverable to a venue tech via Drive / WeTransfer / USB on the day. A 10-minute master loop is 1–6 GB depending on resolution, downloadable overnight, and the 30 loop iterations across a 5-hour event still feel fresh because the Photo Pool blend rotates the photo content per loop iteration (see Photo Pool section).
- **Render compute:** Cloudflare Containers or AWS Lambda free tier. At small scale (≤277 renders/month), free tier covers everything; at scale, ~₱20–60 per render.
- **Audio:** silent. LED background videos at receptions are paired with the venue's audio (DJ, band, MC); embedding audio would conflict.
- **Storage:** rendered MP4 files cached in R2 (10 GB free tier covers ~80 renders) under `led_backgrounds/{event_id}/{template_id}_{config_hash}.mp4`. Cache key = template_id + sha256 of customization JSON, so identical configs are deduplicated.
- **Stock overlay assets:** sourced from Pexels Videos and Pixabay (CC0, free, commercial use allowed) for particle/bokeh/light-leak loops. One-time engineering pass to license/download a curated set; reused across all 10 templates.
- **Auth:** couple-only. Server-side guard at every route.

## Palette source — Reception palette only (locked 2026-05-08)

The LED Background Maker reads colors from the wedding's **Reception palette** (defined in the Dress Code widget, iteration 0004). That's it — no per-role picker, no segment-aware switching. The Reception palette is what evening LED loops are built around, and that's what the LED Background Maker outputs every time.

The wedding has 9 palettes total — 8 ceremony role palettes (Bride & Groom, Best Man, Maid of Honor, Team Bride, Team Groom, Principal Sponsors, Secondary Sponsors, Guests) plus the Reception palette. **Other surfaces** (the Hero Monogram, the QR Code Widget, future widgets) may pick from any palette per their own product logic — but the LED Background Maker is locked to Reception. This keeps the LED maker simple, and matches how venues actually use these loops (single ambient evening loop, not segment-switched).

If a couple ever needs segment-specific LED loops (e.g., one for the offertory, one for the reception), V1.5 can add a per-render palette source picker. V1 stays simple.

## Background colors auto-derive from the locked event palette

**Same pattern as the QR colors in iteration 0002.** Once the couple flips the "Lock palette" toggle in the Dress Code widget (sets `events.palette_finalized_at`), the LED Background Maker auto-derives its default background colors from the palette swatches:

- The renderer reads the locked palette swatches.
- Picks colors based on the template's intended mood — e.g., Filigree Bloom uses the *darkest* swatch as the canvas backdrop and the *lightest* as the highlight color; Watercolor Wash uses three swatches as the gradient stops; Velvet Sweep uses a jewel-tone subset.
- Each template's default mapping is stored in its template config (`/templates/{template_id}/palette_mapping.json`), so when the couple changes their palette, the renderer picks up the right swatches automatically.

Until palette is finalized, the LED Background Maker uses safe per-template defaults from the template's standalone config — no flickering as the couple iterates on swatches.

After palette finalization, the couple can still override via the Background field in the editor (custom hex picker, with the same ≥4:1 luminance contrast guard as iteration 0002 — though for the LED background context, contrast is between the monogram's center white badge and the surrounding background, not between QR pattern and background).

Changing the palette after a render has been generated invalidates the render's cache (the `config_hash` includes the palette swatches), so the next "Render & Export" produces a new file with the updated colors.

---

## Routes

```
setnayan.com/dashboard/led-background                 → editor UI
POST /api/led-background/render                    → enqueue render job; returns job_id
GET  /api/led-background/status?job_id=...         → poll render progress (or SSE)
GET  /led-background/{event_id}/{template_id}.mp4  → R2-fronted CDN URL of rendered file
POST /api/led-background/redeliver-to-drive        → push rendered MP4 to couple's Drive (if a downstream Drive integration is connected)
```

---

## Data model

### `led_background_configs` — couple's saved configurations

```sql
CREATE TABLE led_background_configs (
  config_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id           UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  template_id        TEXT NOT NULL CHECK (template_id IN (
    'filigree_bloom', 'capiz_shimmer', 'sampaguita_drift', 'gold_particles',
    'ethereal_mist', 'bokeh_lights', 'watercolor_wash', 'slow_pulse',
    'constellation', 'velvet_sweep'
  )),
  config_json        JSONB NOT NULL,         -- customization fields (see below)
  is_default         BOOLEAN NOT NULL DEFAULT FALSE,  -- one default per event
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_led_bg_configs_event ON led_background_configs(event_id);
```

### `led_background_renders` — completed and in-progress renders

```sql
CREATE TABLE led_background_renders (
  render_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id          UUID NOT NULL REFERENCES led_background_configs(config_id) ON DELETE CASCADE,
  status             TEXT NOT NULL CHECK (status IN ('queued','rendering','complete','failed')),
  progress_pct       INT NOT NULL DEFAULT 0,
  output_resolution  TEXT NOT NULL,          -- '8k', '4k', '1080p'
  output_duration_s  INT NOT NULL,           -- 300 (5min), 600 (10min default), 1800 (30min); event-length playback achieved by venue-side repeat
  loop_seam_validated BOOLEAN DEFAULT FALSE, -- renderer flips this true when the wrap-frame check passes
  photo_rotation_seed INT,                   -- random seed for photo selection per loop iteration when Photo Pool active
  output_r2_key      TEXT,                   -- set when complete
  output_size_bytes  BIGINT,
  error_message      TEXT,
  started_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at       TIMESTAMPTZ
);
```

### `config_json` schema (per template)

All templates share a common base schema, with template-specific extensions:

```ts
{
  // Common fields (apply to all templates)
  background_color: string,            // hex, derived from event palette by default
  effect_intensity: number,            // 0-100
  animation_speed: number,             // 0-100 (slow → fast)
  overlay: 'none' | 'grain' | 'vignette' | 'lightleak' | 'sparkle' | 'mist',
  loop_duration_s: 300 | 600 | 1800,        // 5min / 10min default / 30min master loop. Plays continuously in venue's playback system to fill 5-hour event.
  aspect_ratio: '16:9' | '21:9' | '1:1',
  show_couple_names: 'bottom' | 'top' | 'hidden',
  show_date: boolean,

  // Monogram source — read from iteration 0004's locked Hero Monogram widget
  // (cached on event, not duplicated here)
  
  // Template-specific extensions vary; e.g.:
  // filigree_bloom: { ornament_ring_density: 'sparse'|'medium'|'dense', ... }
  // gold_particles: { particle_count: number, particle_speed: number, ... }
  // watercolor_wash: { primary_color: string, secondary_color: string, ... }
}
```

Each template file (`/templates/{template_id}.json`) carries its default values + the field extensions it accepts. Server-side Zod validators ensure the couple can't post invalid config combos.

---

## The 10 templates

| # | Template ID | Vibe | Default mood | Layered effects |
|---|---|---|---|---|
| 1 | `filigree_bloom` | Romantic | Warm gold | Color wash + filigree pattern + light bloom + particles + ornament rings + grain |
| 2 | `capiz_shimmer` | Filipino Heritage | Capiz cream | Layered capiz-shell radial gradients shimmering at offset cycles |
| 3 | `sampaguita_drift` | Heritage | Cream + champagne | Floating sampaguita petal sprites + soft dawn gradient |
| 4 | `gold_particles` | Glamour | Champagne + black | High-density gold particle bokeh drifting across canvas |
| 5 | `ethereal_mist` | Soft / dreamy | Pale blue + cream | Cloud-like billowing volumes, subtle light leaks |
| 6 | `bokeh_lights` | Cinematic | Deep + warm | Defocused light circles at varying depths, slow drift |
| 7 | `watercolor_wash` | Artistic | Multi-color | Slow color shift between 3 watercolor blooms |
| 8 | `slow_pulse` | Minimal | Single accent | Single concentric circle pulsing slowly, monogram emphasis |
| 9 | `constellation` | Magical | Deep navy | Stars connecting and drifting; rotating around the monogram |
| 10 | `velvet_sweep` | Bold | Velvet jewel-tones | Rich gradient sweep, slow ribbon-like motion |

Each template ships with:
- A **Remotion composition** (`/templates/{template_id}/Composition.tsx`) — defines the React tree, animations, and durations.
- A **defaults JSON** (`/templates/{template_id}/defaults.json`) — populates the customization controls when the couple first picks it.
- A **thumbnail preview MP4** (`/templates/{template_id}/thumb.mp4`, ~5s, 480p) — used in the editor's gallery to show couples what the template looks like in motion before they pick it.

---

## Render pipeline (Renderforest-class quality)

The user's reference: **Renderforest** — wedding monogram intro/outro templates with multi-layer motion graphics. Setnayan's pipeline targets the same visual quality through Remotion compositions:

### Step 1: Couple submits config

Frontend POSTs `/api/led-background/render` with `{ template_id, config_json, output_resolution, output_duration_s }`. Server validates the config against the template's Zod schema, creates `led_background_configs` row, creates `led_background_renders` row at `status='queued'`, enqueues a Remotion render job in Cloudflare Queues.

### Step 2: Remotion render

A Cloudflare Container (or Lambda) wakes up, runs:

```bash
npx remotion render \
  /app/templates/filigree_bloom/Composition.tsx \
  --props='{"background_color":"#2B1F12","effect_intensity":65,...}' \
  --output=/tmp/{render_id}.mp4 \
  --width=7680 --height=4320 \
  --fps=30 \
  --duration-in-frames=18000  # 10min × 30fps (master loop default)
```

Renders all the layered components — wash, filigree pattern, light bloom, particles, ornament rings, monogram, grain — in their composited React tree. Remotion handles frame-by-frame compositing and outputs an H.264 MP4 via FFmpeg.

### Step 3: Multi-resolution outputs

Same render run produces three resolutions in one pass (Remotion supports rendering at base resolution then downscaling cheaply via FFmpeg post-process):

- **8K:** 7680×4320 — primary deliverable for high-end LED walls
- **4K:** 3840×2160 — most common LED wall resolution
- **1080p:** 1920×1080 — fallback for legacy projectors / DJ screens

All three uploaded to R2. Couple downloads whichever fits their venue's setup.

### Step 4: Notification

When all three resolutions complete, server updates `led_background_renders.status = 'complete'`, sends email to the couple with download links and a 30-second preview GIF. In-app toast on the editor panel.

### Step 5: Optional Drive delivery

If the couple has connected Google Drive (if a downstream Drive integration is connected), they can hit "Push to Drive" and the rendered MP4 + variants get uploaded to their Setnayan folder under `LED Backgrounds/`.

---

## Page composition (desktop)

Match the mockup's "Web" frame. Three-panel editor layout:

**Left rail (280px):** Template gallery.

- "Templates" header with count badge.
- 2-column grid of 10 template cards. Each card has a 16:9 mini preview (CSS-art for mockup; production uses the looping `thumb.mp4`), the template name, and a one-word vibe tag (Romantic, Filipino, Glamour, etc.).
- Selected template gets an accent border + soft shadow glow.
- Below the grid, a "PRO BUNDLE" promo card: "All 10 templates · ₱99 · One-time. Render unlimited drafts; final 8K render counts toward this." (Pricing locks in below.)

**Center (flexible):** Live preview pane.

- Toolbar above: "Live preview · 8K · 7680 × 4320 · 10-min master loop · plays 30× to fill 5-hour event" eyebrow. Aspect toggle (16:9 / 21:9 / 1:1). Refresh, Theater mode actions.
- The preview canvas itself runs the chosen template's animations live in the browser at sensible resolution (~800×450 inside the editor; production preview optionally upscales for theater mode).
- Below the canvas: video controls (play/pause, scrub bar with timecode "00:14 / 00:30", volume — but always silent in production, fullscreen).

**Right inspector (360px):** Customization controls.

- Eyebrow "Customizing template" + template name + vibe.
- Field group: **Background** — palette swatches auto-derived from the locked event palette (per iteration 0004), plus a "Custom" picker.
- Field group: **Effect intensity** — slider 0-100%.
- Field group: **Animation speed** — slider 0-100% (slow / fast labels).
- Field group: **Overlay** — 6-tile grid: None, Grain, Vignette, Light leak, Sparkle, Mist.
- Field group: **Master loop length** — 5 min (small file, more visible repetition) / **10 min (default — recommended)** / 30 min (largest file, most variety, near-zero perceptible repetition over 5 hours). Each option shows the resulting file size for the chosen resolution and the implied repeat count over a 5-hour event ("plays 30× to fill your reception").
- Field group: **Aspect ratio** — 16:9 (default) / 21:9 / 1:1.
- Field group: **Couple names** — show bottom / show top / hidden.
- Field group: **Monogram source** — read-only summary linked back to Hero Monogram widget in 0003.
- Footer: **"Render & Export 8K master loop"** big primary button — shows estimated render time (~25 min for the 10-min default at 8K) and output spec (`7680 × 4320 · H.264 · 10-min master loop · ~5.6 GB · plays 30× to cover 5-hour event`).

## Page composition (mobile)

Match the mobile frame. Top-down stack:

App header → live preview canvas with same multi-layer animation (scaled down) → preview meta strip with resolution + timecode → 3-tab control panel (Templates / Customize / Export) → tab content (template horizontal-scroll list, or stacked customize cards, or export options) → sticky bottom export button.

The editor is fully functional on mobile but the Render & Export step is best done from desktop because the rendered file size (≥120 MB at 8K) is large for mobile downloads. The mobile editor lets couples preview, customize, and queue the render; they download the file on a desktop later.

---

## Pricing — per render, by resolution + add-ons (locked 2026-05-08)

| Resolution | Price | Output spec | Render time |
|---|---|---|---|
| 1080p HD | ₱249 | 1920 × 1080, H.264, 10-min master loop (~1.1 GB) | ~12 min |
| 4K UHD | ₱399 | 3840 × 2160, H.264, 10-min master loop (~3.4 GB) | ~18 min |
| 8K cinematic | ₱99 | 7680 × 4320, H.264, 10-min master loop (~5.6 GB) | ~25 min |

**File-size matrix by master loop length** (H.264, balanced bitrate, single-pass downloadable file; venue tech sets repeat=on for 5-hour event playback):

| Resolution | 5-min loop | 10-min loop (default) | 30-min loop |
|---|---|---|---|
| 1080p | ~550 MB | ~1.1 GB | ~3.3 GB |
| 4K | ~1.7 GB | ~3.4 GB | ~10 GB |
| 8K | ~2.8 GB | ~5.6 GB | ~17 GB |

The 30-min master loop is included in every render-tier price, but couples whose venue can't transfer files >5 GB are nudged toward 10-min default at 4K (~3.4 GB) — fits on a USB stick, transfers via Drive/WeTransfer in <30 minutes on typical PH broadband.
| **Custom resolution** | ₱899 | Couple-specified pixel dimensions to fit their LED wall | ~10–15 min |

**Add-ons (stack on any resolution):**

| Add-on | Price | What it does |
|---|---|---|
| **Photo Pool blend** | +₱1,999 | Couple's photos at 30% opacity blended into the background. Live link mode (auto-refresh every 6 hours with fresh random selection) or static mode (locked at render time). Premium pricing reflects R2 photo storage, additional server-side compositing pass, and the auto-rebuild pipeline for live link mode. |
| **Ultrawide aspect (>21:9)** | +₱1,499 | Premium add-on for panoramic / curved / non-standard LED walls. Bespoke render setup, manual quality review by Setnayan Staff, longer render time. |
| **Live Playback URL** | +₱99 | Hosted streaming URL (HLS + direct MP4) at `setnayan.com/led/{event-slug}/r/{render_id}.mp4`. Optional convenience for venues with stable internet who want to stream instead of file-transfer. **The MP4 file download is always included with every render (free)** as the offline-safe primary delivery; this add-on adds the hosted streaming layer for venues that prefer URL-based playback. |

### Custom resolution

For LED walls that don't fit the standard 1080p/4K/8K ratios — couples input exact pixel dimensions (e.g., **5760 × 1080** for an ultrawide wall, or **3840 × 1080** for a wide-but-not-tall stage backdrop). The renderer adapts the Lottie composition's viewBox to match the requested aspect ratio, then encodes at that exact resolution. Render time is roughly 10–15 minutes depending on dimensions. Useful for:

- Venues with stitched-LED-panel installations at non-standard ratios
- Projection-mapping setups onto curved or irregular surfaces
- Custom signage displays at receptions

### Live playback URL — free with every render

Every render outputs both a downloadable MP4 file and a **hosted playback URL** at `setnayan.com/led/{event-slug}/r/{render_id}.mp4`. The venue's LED tech team can paste this URL into their playback system instead of transferring files via USB:

- **HLS streaming** — the URL also serves an HLS manifest at `.m3u8` for systems that prefer streaming over file playback.
- **Auto-loop** — server-side `Cache-Control: max-age=31536000` plus `?loop=1` flag for systems that need explicit loop control.
- **Authenticated** — URL signed for the event's session; expires 30 days post-event (matching the QR token lifetime).

**Same template, different resolution = different render = different price.** Couple can render at multiple resolutions for different purposes (e.g., 4K for the LED wall + 1080p for the prep room screen + Photo Pool blend on the 8K final).

**Drafts and previews are always free.** Couples only pay when they trigger the actual server-side render.

**Margin analysis at locked prices:** ₱25–60 cost per render at Cloudflare Container pricing → ~90% gross margin across all SKUs. Custom resolution at ~₱90 cost → 90% margin maintained. Photo Pool blend adds ~₱20 to render cost (extra compositing pass) → ₱129 margin on the ₱149 add-on (~87% margin). Healthy at any scale.

---

## Functional scope

### Must work end-to-end

- **Template gallery rendering** — all 10 templates show their animated thumbnails in the editor's left rail.
- **Live preview** — picking a template loads its animation in the center canvas. Customization changes update within 200ms (debounced) and reflect live in the preview.
- **Render submission** — clicking "Render & Export" enqueues a job, transitions UI to a "Rendering…" state, polls every 2s for status.
- **Render pipeline** — Remotion composition takes the config_json props, outputs 8K MP4 + 4K + 1080p variants in a single pass, uploads all three to R2.
- **Download** — once render is complete, couple sees download links for each resolution. CDN URLs are signed for the couple's session.
- **Drive push** — if couple has connected Drive (if a downstream Drive integration is connected), one-click upload to their Setnayan folder.
- **Email notification** — render-complete email with download links + a 5s GIF preview attached.
- **Re-render** — couple can change the config and re-render; old render stays accessible until they explicitly delete it.

## Offline safety — venue has no internet (locked 2026-05-08)

**Wedding venues frequently have unreliable wifi or no internet at all during the event.** The LED Background Maker is designed offline-first so the wall never goes black for the full 5-hour reception:

### Primary offline strategy — MP4 file is the source of truth, plays for the entire 5-hour event

Every render produces a **self-contained, downloadable MP4 file** engineered as a **seamlessly-loopable master clip** (5 / 10 / 30 minute options, default 10 min). The hosted Live Playback URL is a convenience, not a requirement. The MP4 plays on any standard LED playback system (Resolume, MadMapper, Watchout, Hippotizer, even VLC) without any network dependency, and the venue's tech sets the playback system to **repeat-on** so the master loop runs continuously for the full ~5-hour reception.

**Hard rule:** the LED tech **always** downloads the MP4 file to a local USB drive or playback workstation **before the event starts**, sets the playback system to repeat-on, and starts playback before the first guest enters the reception space. Once playback starts, **zero internet is required** for the next 5 hours. The hosted URL is only used as a fallback if the local file is lost.

### Why looping a 5–30 minute master clip works (instead of a literal 5-hour MP4)

A literal 5-hour MP4 at 8K H.264 is ~80–110 GB — undeliverable to a venue tech via Drive / WeTransfer / USB on the day of the wedding, and impractical to render in our queue. A **10-minute master loop** is ~1.1 GB at 1080p / ~3.4 GB at 4K / ~5.6 GB at 8K — downloadable overnight, fits on any USB stick. Across a 5-hour reception, the 10-min loop plays 30 times. With **Photo Pool blend** active, each loop pulls a fresh randomized selection from the couple's photo pool, so guests perceive ~30 different photo sequences over the evening even though the underlying motion-graphic choreography repeats. Without Photo Pool, the underlying choreography is rich and slow enough that even repeated loops feel cinematic rather than repetitive.

For the rare couple who insists on zero looping (e.g., a 90-minute formal-dinner segment that should never repeat), the **Custom render tier (₱899)** supports up to 90-minute master loops — the longest practical render that still produces a downloadable file.

### Auto-delivery to LED tech

When a render completes, Setnayan automatically:

1. **Emails the MP4 download link** to the couple AND to a designated LED-tech contact email (couple inputs this in the LED Background settings).
2. **Sends an SMS reminder** 48 hours pre-event: "Your LED Background MP4 is ready. Download it now and load to the venue's playback system."
3. **Sends a second SMS** 4 hours pre-event: "LED file downloaded? Reply YES to confirm or call [number] for support."

The couple can also push the MP4 to their connected Google Drive (via a downstream Drive integration) — many venue techs prefer pulling from a Drive folder shared with them.

### Hosted URL is a paid add-on (₱99) for couples who want it

**The MP4 download is always included with every render** — the offline-safe primary. For couples whose venue has stable internet and wants the convenience of URL-based playback, the hosted **Live Playback URL** is a ₱99 add-on per render. When purchased:

- **HLS streaming** (`.m3u8`) for systems that prefer adaptive streaming.
- **Direct MP4** at the same URL for systems that prefer file-style playback.
- **Cache-Control: max-age=31536000, immutable** — once the venue's network has fetched the file, it serves from cache for the rest of the event even if internet drops momentarily.
- **Server-side rendering of Photo Pool blend** — even in "live link" mode, the photo selection happens at *render time on Setnayan's server*, not at playback time. The MP4 has photos baked in. "Live link" just means the render is rebuilt periodically (every 6 hours) with a fresh random selection; the venue's playback system always plays a complete pre-rendered file. **No mid-playback fetches happen.**

### Live link mode — clarified for offline safety

To avoid offline-catastrophe risk, the **"Live link" Photo Pool mode does NOT require internet during playback**:

- **Server-side:** every 6 hours, Setnayan re-renders the LED MP4 with a fresh random selection from the Photo Pool. The hosted URL points to the latest version.
- **Venue side:** the LED tech downloads the MP4 once before the event. The downloaded file plays offline forever. If the venue wants the rotating-photos behavior, they re-download from the URL every few hours during setup; once the event starts, the latest-downloaded version plays from local file with no further internet needed.
- **Static mode** is identical except no auto-rebuild happens. One render, one file.

### Pre-event checklist (auto-emailed to couple + LED tech 7 days out)

- [ ] LED Background MP4 downloaded to USB drive (file size noted on email — 1.1 / 3.4 / 5.6 GB depending on resolution; transfer started ≥24 h before event)
- [ ] Played end-to-end on the venue's actual LED wall (not just a laptop preview)
- [ ] Loop verified — playback wraps cleanly from the last frame to the first (no black flash, no audio gap if music track is part of the render)
- [ ] **Repeat / loop-on enabled** in the venue's playback software (Resolume / MadMapper / Watchout / VLC) so the master loop runs continuously for the full reception
- [ ] **5-hour playback rehearsal** — let the file loop on the actual LED wall for at least 30 minutes during venue setup; confirm zero stutter or seam at each loop wrap
- [ ] Backup copy on a second USB or laptop
- [ ] Setnayan's hosted URL bookmarked as fallback (only matters if the local file is lost; once playback starts, no internet is needed)
- [ ] LED tech has Setnayan support contact (email + Viber number)

### Damage control if files are lost on the day

Setnayan Staff has emergency override access to re-deliver a rendered MP4 within 5 minutes. The couple or LED tech can call/text Setnayan support, and we push the file to:
1. The hosted URL (if any internet at the venue, even mobile hotspot)
2. The couple's Google Drive (if connected via a downstream Drive integration)
3. WhatsApp / Viber direct file send to the LED tech (last resort, file size permitting)

5-year R2 retention means we can re-deliver any past event's renders at any time.

---

### New features locked 2026-05-08

**Photo Pool background blend (+₱149 add-on).** Couples have a Photo Pool — an event-scoped library of photos uploaded throughout planning (engagement shoot, save-the-dates, pre-wedding bash). The LED Background Maker can blend random selections from this pool at 30% opacity behind the monogram, creating a subtle visual layer that feels personal without overwhelming the cinematic motion graphics. Two source modes:
- **Live link mode** — the rendered MP4 references the photo pool dynamically; each playback can pull a different random selection (requires the venue's playback system to support HLS or hosted-URL playback).
- **Static mode** — photos picked at render time and baked into the MP4. Simpler for systems that need self-contained files.

Schema additions: `event_photo_pools(pool_id, event_id, name, created_at)` and `photo_pool_items(pool_id, photo_url, position, added_at)`. The Hero Monogram widget config_json gains `photo_pool_blend: { enabled, pool_id, opacity, source_mode, max_photos }`.

**Custom resolution (₱899).** For LED walls that don't fit standard ratios — couple inputs exact pixel dimensions and the renderer adapts the Lottie composition's viewBox to match. Add ₱100 for ultrawide aspects beyond 21:9.

**Live playback URL (free with every render).** Every rendered MP4 gets a hosted streaming URL at `setnayan.com/led/{event-slug}/r/{render_id}.mp4` plus an HLS manifest at `.m3u8`. Venues can paste the URL into their playback system instead of file-transfer-via-USB. URL is event-session-signed and expires 30 days post-event.

### Out of scope (deferred)

- **Couple-built custom templates** — V2 (couples upload their own After Effects / Lottie JSON).
- **Audio embedding** — never (LED backgrounds at receptions pair with venue audio; embedded audio causes conflicts).
- **Live-stream output for VJ software** — V1.5 (NDI / SDI streaming output beyond hosted URL).
- **Real-time customization broadcasting** — V2 (couples + designers collaborating in the editor).
- **Multi-monogram variations within one render** — V2 (e.g., bride monogram → couple monogram transition).
- **Couple uploads custom motion assets** — V2 (their own particles, their own ornament images).

---

## Acceptance criteria

- [ ] Visiting `/dashboard/led-background` for a couple-authenticated user with an event renders the three-panel editor.
- [ ] All 10 template cards in the gallery animate in their mini-preview thumbnails on hover; clicking a card selects it and loads its full animation in the center preview pane.
- [ ] Customizing background color via the palette swatches updates the live preview within 200ms.
- [ ] Effect intensity, animation speed, and overlay changes all reflect live in the preview.
- [ ] Clicking "Render & Export" creates a `led_background_renders` row, enqueues a Remotion job, and transitions the UI to the rendering state.
- [ ] Remotion render completes a 30s 8K composition within 8 minutes on the production renderer (test target).
- [ ] Render produces all three resolution variants (8K, 4K, 1080p) and uploads them to R2.
- [ ] Email notification is sent within 60 seconds of render completion with all three download links.
- [ ] Live preview in the editor visually demonstrates Renderforest-class quality: at least 5 animated layers running concurrently with different speeds, scales, and rotations.
- [ ] **Mobile** version renders the editor as a 3-tab panel (Templates / Customize / Export) with the same multi-layer preview animation in the top half of the screen.
- [ ] Mobile is thumb-friendly per the standing rule.
- [ ] Lighthouse 90+ on the editor panel.

---

## Privacy & compliance

- The rendered MP4 files contain only the couple's monogram, names, date, and palette — no guest data. PH-DPA implications minimal.
- R2 storage of rendered files: 5-year retention per spec 10's general retention policy.
- The rendered file is the couple's property — they can download, distribute, or delete at will. Setnayan retains a copy for the 5-year window for re-download convenience.

---

## Companion files to read before starting

1. `CLAUDE.md` — project context.
2. `0005_led_background_maker.html` (this folder) — visual reference, multi-layer animation demo.
3. `0003_invitation_widgets/0003_invitation_widgets.md` — Hero Monogram widget supplies the monogram source for this iteration's renders.
4. `0002_qr_invitation_system/0002_qr_invitation_system.md` — palette finalization gate (LED Background Maker reads from the same locked palette).
5. `0009_photo_delivery/0009_photo_delivery.md` — Drive integration that the LED Background Maker can re-use for delivering renders to the couple's cloud.

---

## Notes for Claude Code

- **Reference Renderforest's wedding monogram intros for the visual quality bar.** The mockup demonstrates the layering pattern — production templates should match or exceed that polish through Remotion compositions.
- **Don't try to render 8K in the browser preview.** The editor's center canvas runs CSS animations at editor scale (~800×450). Real 8K rendering happens server-side via Remotion. The browser preview is a faithful approximation, not the actual output.
- **Remotion compositions are React.** Each template's `Composition.tsx` is just JSX with `useCurrentFrame`-driven animation values. This makes maintenance easy — designers + engineers can iterate on templates with the same tooling.
- **Render jobs are long-running.** 8K H.264 encoding at 30 FPS for 30 seconds takes 5-8 minutes on a Cloudflare Container with GPU; longer on CPU-only Lambda. Use Cloudflare Queues + a dedicated render worker, not synchronous request handling.
- **Resolution variants share the render.** Render at 8K once, then FFmpeg downsample to 4K + 1080p as post-process. Saves ~70% of render time vs three separate full renders.
- **Couples will mostly use 4K.** 8K LED walls are still rare; 4K is the venue standard. Render 8K for future-proofing but expect 4K downloads to dominate.
- **When you finish, save a result summary at `0005_led_background_maker_result.md`** describing what was built, which templates ship in V1 vs deferred, what the production render times measured at, and any decisions worth surfacing.
