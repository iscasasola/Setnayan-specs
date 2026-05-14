# 0024 — Save-the-Date Video Maker

> Iteration 0024. Couples pick a template, supply engagement video clips + couple details + music, and receive a rendered Save-the-Date video in three formats (horizontal · square · vertical) for sharing across social platforms and embedding on the invitation landing page.

## 1. Scope

Couples announce their wedding date 6–8 months before the event. Setnayan provides a template-driven video maker that produces a polished Save-the-Date in minutes — no editing skills required.

The render pipeline, music catalogue, and template-manifest pattern are inherited from iteration 0012 (Paparazzi). This iteration adds a Save-the-Date-specific template library, a new render-job type, multi-aspect-ratio output, and a distribution path (download + landing-page embed).

### What ships in V1

- Template library: ~50 Save-the-Date templates across 9 feel categories
- Multi-format render: every render produces horizontal 1920×1080, square 1080×1080, vertical 1080×1920
- Input set: **3–8 short engagement video clips (5–15s each, MP4/MOV/HEVC, max 200MB each)** · couple names · wedding date · venue name · optional caption
- Clip audio is muted; the template&apos;s background music drives the soundtrack so couples don&apos;t have to think about audio balance
- Music: Setnayan-owned AI catalogue, filtered to announcement-mood subset (~80 tracks at 15s–30s lengths)
- Distribution: ZIP download (all 3 formats) + **default-on landing page embed** (0002) — see §5a for the landing-page hero lifecycle
- Multi-purchase: couples can buy additional packs to try different templates

### What's out of V1

- Custom (non-template) renders
- Per-frame manual editing
- BYO music
- Long-form videos (>30s)
- 4K output (1080p is V1 ceiling)
- Animated text customization beyond names/date/venue/caption

## 2. SKU

| SKU | PHP price | Notes |
|---|---|---|
| Save-the-Date Render | ₱99 | One render of one template across all 3 formats (16:9 + 1:1 + 9:16). Multi-purchase — try as many templates as the couple wants at ₱99 each. |

**Apparatus-rule compliance:** ₱99 unlocks the tool — one full template render across all 3 formats. Not priced per second, per minute, per format, or per share. Couples render once, download forever, share anywhere.

**Why ₱99 (and not free):** at this price the SKU is accessible enough that couples don't hesitate, while still covering Setnayan's compute + storage cost and producing margin. It also creates the right *commitment* signal — couples who pay ₱99 commit to their template choice and ship the result; free-tier behavior at scale produces test renders nobody uses.

**Cost analysis (Setnayan-side):**
- FFmpeg compute (Cloudflare Worker): ~₱2 per render across 3 formats
- R2 storage (originals + outputs, 90 days hot): ~₱1
- ZIP packaging compute: ~₱0.50
- **Total Setnayan cost: ~₱4–5 per render**
- **Margin: ~90% (₱44–45 per render)**

**Cost at scale:** 1,000 weddings × ~2 renders avg × ₱5 = ₱10,000/month compute · ₱98,000/month revenue · ₱88,000/month gross margin.

## 3. Template library

**Total:** ~50 templates across 9 feel categories. Each template has a single manifest that drives all three aspect-ratio renders — slot positions, durations, and transitions are parameterized so the 16:9, 1:1, and 9:16 outputs use the same storytelling beats with different framing.

### Feel categories

1. **Minimalist** — clean type, generous negative space, monochrome palette
2. **Classic** — serif type, gold accents, traditional layouts
3. **Bridgerton** — regency-era florals, pastel palettes, ornamental frames
4. **Modern** — bold sans-serif, geometric reveals, high contrast
5. **Cinematic** — letterboxed, kinetic typography, dramatic transitions
6. **Tropical** — saturated palette, palm-leaf motifs, summer-light feel
7. **Boho** — earth tones, hand-drawn elements, soft transitions
8. **Royalty** — deep jewel tones, regal frames, gold leaf accents
9. **Heritage Filipino** — terno motifs, tropical-glam palette, baybayin accents (optional)

### Template manifest schema (JSON)

```json
{
  "template_id": "STD_001",
  "feel_category": "minimalist",
  "duration_seconds": 18,
  "slots": [
    { "slot_id": "intro", "type": "text", "duration": 2.0,
      "content_keys": ["couple_names"], "animation": "fade_in_up" },
    { "slot_id": "photo_1", "type": "photo", "duration": 2.5,
      "framing": { "16_9": "center_crop", "1_1": "center", "9_16": "top_third" },
      "transition_in": "fade", "transition_out": "slide_left" },
    { "slot_id": "photo_2", "type": "photo", "duration": 2.5,
      "framing": { "16_9": "center_crop", "1_1": "center", "9_16": "center" },
      "transition_in": "slide_in_right", "transition_out": "fade" },
    { "slot_id": "date_reveal", "type": "text", "duration": 3.0,
      "content_keys": ["wedding_date"], "animation": "stamp_in" },
    { "slot_id": "photo_3", "type": "photo", "duration": 2.0 },
    { "slot_id": "venue", "type": "text", "duration": 2.0,
      "content_keys": ["venue_name"], "animation": "fade_in" },
    { "slot_id": "outro", "type": "text", "duration": 4.0,
      "content_keys": ["couple_names", "caption"], "animation": "ken_burns" }
  ],
  "music_pairing_categories": ["bridgerton", "jazz", "classical"],
  "music_pairing_bpm_range": [80, 110],
  "preview_horizontal_url": "/std_lib/STD_001/preview_16_9.mp4",
  "preview_square_url": "/std_lib/STD_001/preview_1_1.mp4",
  "preview_vertical_url": "/std_lib/STD_001/preview_9_16.mp4"
}
```

### Master library index

Stored at `/std_library/library_index.json` — analogous to the Personal Reel template index in 0012. The browse surface reads from this index; renders dereference individual manifests.

## 4. Data model

### `save_the_date_templates`

| Column | Type | Notes |
|---|---|---|
| template_id | TEXT (PK) | `STD_001`–`STD_050` |
| feel_category | ENUM | One of 9 categories above |
| manifest_json | JSONB | Full template manifest |
| paired_music_track_ids | TEXT[] | References to `music_tracks` |
| preview_horizontal_url | TEXT | Public R2 preview path |
| preview_square_url | TEXT | Public R2 preview path |
| preview_vertical_url | TEXT | Public R2 preview path |
| duration_seconds | NUMERIC | 15.0–30.0 |
| is_active | BOOL | Admin toggle for soft-deprecation |
| created_at | TIMESTAMPTZ | |

### `engagement_clips`

The video clips couples upload as input to the Save-the-Date renderer. 3–8 short clips per event (5–15 seconds each, MP4/MOV/HEVC, max 200MB each). Audio is muted during render (the template's owned music drives the soundtrack).

| Column | Type | Notes |
|---|---|---|
| clip_id | UUID (PK) | |
| event_id | UUID (FK → events) | |
| r2_object_key | TEXT | R2 path to the original MP4/MOV |
| duration_seconds | NUMERIC | 5.0–15.0 hard-capped at upload |
| format | TEXT | `mp4` / `mov` / `hevc` |
| file_size_mb | NUMERIC | ≤ 200 enforced at upload |
| thumbnail_key | TEXT | R2 path to a single-frame poster generated on upload (LibreOffice / ffmpeg) |
| source | TEXT | `couple_upload` in V1; reserved for future imports |
| uploaded_by | UUID (FK → users) | Which co-organizer uploaded |
| uploaded_at | TIMESTAMPTZ | |

### `save_the_date_renders`

| Column | Type | Notes |
|---|---|---|
| render_id | UUID (PK) | |
| event_id | UUID (FK → events) | |
| template_id | TEXT (FK → save_the_date_templates) | |
| input_clip_ids | UUID[] | References to `engagement_clips` table (3–8 short video clips, 5–15s each) |
| couple_names | TEXT | Display string, e.g., "Aira & Boy" |
| wedding_date | DATE | |
| venue_name | TEXT | Display string, e.g., "Tagaytay Highlands" |
| caption | TEXT | Optional, max 80 chars |
| music_track_id | TEXT (FK → music_tracks) | |
| status | ENUM | queued · rendering · done · failed |
| output_horizontal_key | TEXT | R2 key for 16:9 MP4 |
| output_square_key | TEXT | R2 key for 1:1 MP4 |
| output_vertical_key | TEXT | R2 key for 9:16 MP4 |
| zip_output_key | TEXT | R2 key for bundled ZIP |
| embed_enabled | BOOL | Whether the 16:9 is embedded on landing page (0002) |
| share_count | INTEGER | Telemetry — increments on each share-link click |
| created_at | TIMESTAMPTZ | |
| completed_at | TIMESTAMPTZ | |

### Payment integration

Save-the-Date renders route through the **V1 apply-then-pay flow** (static BDO + GCash accounts, manual reconciliation per the locked 2026-05-12 payment model — no PayMongo, no token wallet). Each render request creates a `service_orders` row with `service_key='save_the_date_render'`, `status='pending_payment'`, and a generated reference code. Customer receives payment instructions via email; Setnayan Team verifies the inbound payment against BDO/GCash inboxes within 24 hours; on confirmation the order flips to `status='paid'` and the render queue picks it up. Pre-funded customers (those on an Unlimited-Use Grant per § 8 of the Vendor Agreement / Privacy Policy) skip the payment step — order goes directly to `status='paid'` with `comp_grant_id` populated.

## 5a. Landing-page hero lifecycle

The wedding landing page (iteration 0002, accessible at `setnayan.com/{couple-slug}`) has **lifecycle-driven hero phases**. The first published Save-the-Date render automatically becomes the landing-page hero — this is the *default state*, not opt-in. Couples can override or disable the embed at any time, but the rationale is that the first traffic wave to the landing page lands 6–8 months before the wedding because the couple just sent the Save-the-Date out, so the landing page hero should match what those visitors came expecting to see.

**Phase 1 — Save-the-Date phase (T-event to T-90d):**
- Hero: Save-the-Date 16:9 video, autoplay-muted, with the couple's monogram and date overlay
- Below hero: brief "Save the date" message + countdown to event
- RSVP form: hidden or quiet footer link
- Other content: minimal — just enough for guests to bookmark and share

**Phase 2 — Invitation phase (T-90d to T-30d):**
- Hero: shifts to the formal invitation card (still incorporates date/venue, but emphasizes RSVP)
- The Save-the-Date video moves to a smaller "Our story so far" section below the fold
- RSVP form: prominent, above-the-fold call-to-action
- Schedule, dress code, gift registry, accommodations surface as scroll sections

**Phase 3 — Final logistics (T-30d to T-1d):**
- Hero: countdown card + driving directions / parking / venue map
- RSVP form: gated to RSVPed guests only — non-RSVPed see a soft prompt
- Day-of timeline, what-to-wear reminders, contact info for the coordinator

**Phase 4 — Post-event (T+1d onwards):**
- Hero: gallery feed from Papic / Panood / Patiktok (consumes 0012)
- Save-the-Date moves to a small "Where it started" archive section
- RSVP form removed

The transitions are automatic on date thresholds, but couples can manually override any phase from the landing-page editor (in 0002). The override flag is per-phase; the couple can stay on Save-the-Date hero forever if they want.

**Why default-on:** the first 6–8 months of a landing page's life is announcement traffic. Defaulting the Save-the-Date as hero matches what those visitors came expecting — the polished video they just saw on the couple's social. Forcing them to opt-in means most couples never embed, and the landing page launches with an empty hero or a generic placeholder.

**Embed flag on the render:** the `save_the_date_renders.embed_enabled` column controls this per-render. If multiple Save-the-Dates exist (couple bought multiple packs and tried different templates), the *most recent render with `embed_enabled=true`* wins. Couples switching templates simply flip the older embed off; the newer one auto-promotes.

## 5. Render pipeline

Inherits the Cloudflare Worker + FFmpeg + R2 pipeline from iteration 0012. The new render-job type is `save_the_date`, distinguished from `personal_reel` and `paparazzi_reel` by the `job_type` field on the render queue.

### Render flow

1. Couple confirms create flow → POST `/save_the_date/render` with:
   - `event_id`, `template_id`, `photo_ids`, `couple_names`, `wedding_date`, `venue_name`, `caption`, `music_track_id`
2. Validate:
   - Couple has an unconsumed `save_the_date_pack` unlock
   - Template is active
   - Photos belong to event and pass NSFW check
   - Music track is in announcement-mood subset
3. Enqueue 3 parallel render jobs (one per aspect ratio) on Cloudflare Queue
4. Each worker:
   - Loads template manifest
   - Loads photos from R2 (engagement set)
   - Loads music track
   - Generates FFmpeg command tailored to aspect ratio (slot framing per ratio)
   - Encodes H.264 MP4, AAC audio, 30fps
   - Uploads to R2 under `/save_the_date/{render_id}/{ratio}.mp4`
5. After all 3 ratios complete, a finalization job:
   - Bundles all 3 MP4s + a `README.txt` into a ZIP
   - Uploads ZIP to R2 under `/save_the_date/{render_id}/bundle.zip`
   - Marks render `status='done'`
   - Sends in-UI notification (no SMS/email/push in V1 per platform rule)
6. Couple opens the Output surface → previews all 3 formats inline → downloads ZIP or toggles landing-page embed

### Estimated render time

- Per-ratio render: 30–60 seconds (depends on template complexity, photo count)
- Bundle + finalization: 5 seconds
- End-to-end: 1–3 minutes typical, 5 minutes worst case

The Render Progress surface shows estimated time and live progress bar.

## 6. Surfaces

### Surface A — Browse Templates

Gallery of all active templates, filterable by feel category. Each card shows:
- Hover-to-play preview thumbnail (autoplay muted)
- Template name + feel category
- Duration in seconds
- "Use this template" CTA

Filter chips: `All · Minimalist · Classic · Bridgerton · Modern · Cinematic · Tropical · Boho · Royalty · Heritage Filipino`

Sort options: `Most popular · Newest · Shortest · Longest`

### Surface B — Template Detail + Create Flow Start

Selected template renders full-preview in dominant aspect ratio (square for the detail page). Below: a "Create your Save-the-Date with this template" CTA that launches the 3-step create flow.

Inline preview can be swapped between 16:9, 1:1, 9:16 to see how the same template renders across formats.

### Surface C — Create Flow (3 steps)

**Step 1 — Photos.** Upload 3–8 engagement video clips. Drag to reorder. Each photo gets a slot preview showing where it'll appear in the template.

**Step 2 — Details.** Couple names · wedding date (date picker) · venue name · optional caption (max 80 chars). Live preview pane updates as fields are filled.

**Step 3 — Music.** ~12 paired tracks from the catalogue (filtered by template's `music_pairing_categories` and `music_pairing_bpm_range`). 30-second previews on tap. Selected track shows waveform + matched-mood explanation.

Bottom of step 3: a final "Render my Save-the-Date" button. Cost row: *"1 Save-the-Date Render · ₱99 · payment will be requested via email"* (or *"Will consume 1 of your unused packs"* if pre-purchased).

### Surface D — Render Progress

Shown after the couple confirms the render. Live progress bar:
- *"Loading template…"* (5%)
- *"Rendering horizontal 1920×1080…"* (5%–35%)
- *"Rendering square 1080×1080…"* (35%–65%)
- *"Rendering vertical 1080×1920…"* (65%–95%)
- *"Bundling your pack…"* (95%–100%)

Estimated time remaining displayed prominently. Background renders continue if the couple navigates away.

### Surface E — Output / Done

Final delivered state:
- Inline previews of all 3 formats (autoplay, muted, looped)
- Download ZIP button (primary CTA)
- Individual format download links
- Embed toggle: *"Show on invitation landing page"* — switches the landing-page hero to the 16:9 Save-the-Date video
- Share row: deep-link buttons to FB / IG Stories / WhatsApp / TikTok / X / pre-formatted copy-paste caption with the date and venue
- *"Create another with a different template"* link → bounces back to Surface A

## 7. Mobile parity

Every surface ships mobile-first per the existing thumb-friendly rule.

- **Browse Templates (mobile):** 2-column grid of template cards (mirrors DIY pagination rule). 10 per page with "Show 10 more" CTA. Tap card → full template preview as bottom sheet.
- **Template Detail (mobile):** full-screen preview with aspect-ratio swap pills at top.
- **Create Flow (mobile):** 3 sequential screens (one per step) with a sticky progress bar (Step 1 of 3). Photo upload uses native photo-library picker (camera roll access).
- **Render Progress (mobile):** progress card with "Notify me when done" toggle for in-UI notification (no push in V1).
- **Output (mobile):** vertical-first preview at native phone aspect, with format-swap pills. Share row uses native share sheet integration.

## 8. Forward dependencies / consumes

### Consumes
- **0001 Creating Guest List** — event_id, couple display names
- **0002 QR Invitation System** — landing-page-embed integration point
- **0012 Paparazzi** — render pipeline, music catalogue, template manifest pattern, R2 buckets

### Provides (for downstream iterations)
- A new `save_the_date_pack` SKU registered in the apparatus catalog (visible in the In-App Services launcher on 0021 Couple Dashboard and listed in 0023 Admin Console pricing surface)
- The first non-Paparazzi consumer of the FFmpeg + R2 render pipeline — proves the architecture generalizes beyond Personal Reels

### Build order placement
0024 builds *after* 0012 (Paparazzi) is in production because it depends on the render infrastructure. It can ship independently of any other iteration. Recommended placement in the V1.1 wave alongside 0014.

## 9. Marketing copy hooks

For the 0015 marketing site additions:
- **Customer-side**: *"Tell the world you're getting married. Pick a template, drop in your video clips, and we'll send you a polished Save-the-Date video for every platform — Instagram, Facebook, TikTok, your landing page. ₱99."*
- **Apparatus-rule framing**: *"₱99 unlocks the tool. Render it as many times as you'd like — we don't charge per share."*

## 10. Voice & tone

Save-the-Date is the first wedding announcement the couple sends. Template names, music pairings, and UI copy should match the couple's emotional register — celebratory but not gimmicky. Keep the editorial restraint from the marketing voice: no exclamation marks, no all-caps, no "🎉 You're engaged! 🎉"-style copy.

## 11. Privacy & consent

- Engagement photos uploaded for renders are stored under the couple's R2 namespace and follow the standard 30-day-post-download compression rule
- The rendered MP4s are couple-owned outputs and are NOT used as Setnayan marketing samples without separate written consent (a separate "Use my render as a marketing sample" opt-in in event settings, default OFF)
- No face-detection or guest-tagging in this surface — the photos are couple-supplied engagement shots, not paparazzi captures
