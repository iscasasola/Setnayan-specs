# 0024 — Save-the-Date (page reframe · plus the new ₱99 Save-the-Date Video MP4 SKU)

> **Status (updated 2026-05-16):** The page-render SKU is retired (see § Retired SKU below) and Save-the-Date is **Phase 1 of the lifecycle-phased event landing page** in iteration **0002 QR Invitation System**. Separately, a **new** Save-the-Date Video SKU was reintroduced on 2026-05-16 as a downloadable MP4 product — generic templates + AI auto-edit + Setnayan-owned music + couple downloads an MP4 for social sharing. The new SKU is **explicitly distinct** from the retired one (different inputs · different outputs · different SKU code · different engineering pipeline). See § "Save-the-Date Video SKU ₱99" below.
>
> **V1 promotion 2026-05-18:** The Save-the-Date Video MP4 SKU is now firmly V1 scope (it was reintroduced as V1 on 2026-05-16 and confirmed in V1 alongside the broader V1.5+ → V1 promotion on 2026-05-18). The retired page-render SKU stays retired. See CLAUDE.md decision log.

---

## What changed

The ₱99 Save-the-Date Render SKU is **retired**. The three-aspect-ratio MP4 render pipeline (FFmpeg + R2 + ZIP — formerly § 5 of this iteration) is **retired**. The `engagement_clips` and `save_the_date_renders` tables are **not built**. The video-output primitive is replaced with a **free**, web-tech-only, lifecycle-phased landing page at `setnayan.com/{couple-slug}` — one landing page per event, four phases that auto-transition on date thresholds:

- **Phase 1 — Save-the-Date hero** (T-event to T-90d): animated SVG monogram, countdown, calendar-add, music, OG share card
- **Phase 2 — Invitation hero** (T-90d to T-30d): formal invitation card, RSVP prominent
- **Phase 3 — Final logistics** (T-30d to T-1d): countdown card, directions, parking, day-of timeline
- **Phase 4 — Post-event** (T+1d onwards): gallery feed (Papic / Panood / Patiktok), Save-the-Date archived

The lifecycle phase machinery originally drafted as § 5a of this file is preserved and migrated into iteration 0002. What's deleted is the standalone MP4-rendering ₱99 SKU that was supposed to feed Phase 1.

---

## Where to read instead

- **`0002_qr_invitation_system/0002_qr_invitation_system.md`** — the canonical event landing page spec; absorbs the four-phase lifecycle and Phase 1 hero layout
- **`0004_invitation_widgets/0004_invitation_widgets.md`** — widget-level spec for the Hero Monogram widget (now upgradable to the **Monogram Hero ₱1,999** SKU which delivers the animated SVG trace + custom video/photo background)
- **`CLAUDE.md` decision log entry 2026-05-16** — full rationale for the reframe

---

## Retired SKU

| SKU code | Old price | Status |
|---|---|---|
| `save_the_date_render` | ₱99 | **Retired 2026-05-16** — feature gone; service_catalog row to be removed in next schema migration |

The retired SKU's replacement value lives in the free landing page itself plus the **Monogram Hero ₱1,999** upgrade in iteration 0004, which delivers a fundamentally better Phase 1 experience than the original MP4 ever did.

---

## Save-the-Date Video SKU ₱99 — reintroduced 2026-05-16 (separate product)

> **Distinct from the retired SKU above.** Different inputs, different outputs, different engineering pipeline, different SKU code. The retired `save_the_date_render` was a multi-aspect-ratio composite of the couple's landing-page hero (3 outputs: 16:9 + 1:1 + 9:16 rendered from the page's animated monogram + countdown). The new `save_the_date_video_render` is an AI-auto-edit short MP4 generated from 5-10 engagement photos with Setnayan-owned music — a standalone social-share product whose end-card drives traffic back to the free landing page.

### Product spec

| Field | Value |
|---|---|
| **SKU code** | `save_the_date_video_render` |
| **Price** | **₱199 / one render** (repriced 2026-05-17 from launch ₱99 — see "Why ₱199" below) · multi-purchase if couple wants multiple variants (e.g. one for IG with one music category, one for TikTok with a different one) |
| **Input** | **5-10 engagement photos** uploaded via the Setnayan upload widget. Validation: ≤5MB per photo, JPG or PNG, ≥1200×1200 recommended for crop quality |
| **Templates** | **8-12 generic templates** in V1 (modern minimalist · romantic · vintage · cinematic · fun · etc.) — couple picks one at purchase. FFmpeg compositions with Lottie overlays for animated text. No per-couple custom design in V1 |
| **AI auto-edit** | Heuristic scene-ordering automatically: faces detected (high-face-count photos earlier in narrative) · landscape vs portrait crop · color-palette match against template. Couple does NOT manually sequence; the algorithm picks the order |
| **Music** | Setnayan-owned AI catalogue (~400 tracks). Couple picks **category** at purchase: Bridgerton · Pop · Hip-hop · Jazz · Acoustic · Cinematic. One track auto-selected from the category to fit the chosen template tempo |
| **Output** | **Single 30-60s 1080×1920 vertical MP4** (H.264, no watermark). Closing 2-second card displays `setnayan.com/[couple-slug]` so every social share drives traffic back to the free landing page |
| **Delivery SLA** | Downloadable from couple dashboard within **~5 minutes** of upload completion (FFmpeg compute on Cloudflare Workers, R2 storage) |
| **Multi-purchase** | Yes — couple can buy multiple renders for different social platforms (₱99 × 2 = two variants, etc.) |

### Why ₱199 — repriced 2026-05-17 from launch ₱99

The launch ₱99 price was framed as a "low-friction social-share upsell, not a margin product" (cost basis: ~₱5-10 per render · FFmpeg compute + R2 storage + Setnayan-owned music = ~₱0 licensing · ~85-90% gross margin · ~70% net margin under V1 tax tier).

**2026-05-17 reprice rationale:** the new admin Cost Watch primitive (per 0023 § 3.5 · backed by `service_render_costs` table in 0034) makes worst-case-render cost visible to admin in real time. Early instrumentation puts the **highest single render at ~₱45** (vision-heavy footage, full template library access) — at ₱99 the worst-case cost-to-price ratio is **45% (yellow zone)**. At ₱199 the worst-case ratio drops to **23% (green)** with average and p95 sitting comfortably under 15%. Margin discipline at a price point Filipino couples still read as impulse-buy (under ₱200) — the social-share traffic + landing-page end-card play stays intact while Setnayan captures roughly 2× the per-render contribution margin.

**Volume math at the new price:** at ₱199 and ~30% attach rate on the 1,000-event V1 cohort, that's ~₱60K/mo in pure-funnel revenue (up from ~₱30K/mo at ₱99) — and every social share is still a Setnayan-branded MP4 with a `setnayan.com/[couple-slug]` end-card driving traffic back to the platform. The MP4 remains a marketing surface as much as a paid product; the reprice doesn't change the strategic positioning, only the margin capture.

### Why this is NOT the retired SKU

| Dimension | Retired `save_the_date_render` (₱99) | New `save_the_date_video_render` (₱99) |
|---|---|---|
| **Input** | The couple's landing-page hero (animated SVG monogram + countdown + page chrome) | 5-10 engagement photos the couple uploads |
| **Output** | 3 MP4 aspect ratios (16:9 · 1:1 · 9:16) rendered from the same source page | 1 MP4 at 9:16 vertical, AI-auto-edited from the input photos |
| **Pipeline** | FFmpeg + R2 + ZIP bundling of 3 outputs (retired with the page reframe) | FFmpeg + Lottie + R2, single output, 5-min SLA |
| **Job-to-be-done** | Guests "save the date" via a shared video file (rendered Phase 1 hero) | Couple shares a personal-feed engagement video to IG / TikTok; end-card drives guests to the landing page |
| **SKU code** | `save_the_date_render` (RETIRED 2026-05-16) | `save_the_date_video_render` (ACTIVE V1) |

The SKU code distinction matters for OR / refund / audit / SKU history hygiene. The retired SKU never shipped; if it had, OR voids and refunds would need to keep the codes separate. Keeping the codes deliberately different also keeps the price-history table (`service_catalog_price_history`) clean.

### Engineering notes

- Upload widget for 5-10 photos lives inside the couple's add-ons flow (alongside Monogram Hero ₱1,999 and the free landing-page Phase 1 editor)
- Template picker UI: 8-12 thumbnails with a preview-on-tap micro-loop (5s loop of the template's animation against a placeholder photo set)
- Music category picker: 6 chips (Bridgerton · Pop · Hip-hop · Jazz · Acoustic · Cinematic); one auto-selected track is shown as a 15s preview
- Render pipeline: new Cloudflare Queue `std-video-render-queue` reading from R2 `setnayan-media/std-video-uploads/{render_id}/` and writing to `setnayan-media/std-video-renders/{render_id}.mp4`
- 5-minute SLA wiring: pre-fetch the music track to Worker memory · FFmpeg compose with Lottie overlay · push back to R2 · Supabase Edge Function notification → couple dashboard
- Couple dashboard surface: "Save-the-Date Video — ready" card with download button + "Share this" button that pre-fills the social-share intent with `setnayan.com/[couple-slug]` as the link

---

## Why retired

Three drivers (full text in `CLAUDE.md` 2026-05-16 entry):

1. **Wrong primitive for the JTBD.** Couples don't want a video file — they want guests to literally save the date. A landing-page hero with one-click calendar-add solves the actual job better than an MP4 that gets watched once and scrolled past.
2. **Spec already implied this.** The original § 5a lifecycle phases treated the landing page as one surface with phases; the MP4 was a clunky intermediary. Deleting it makes Phase 1 a first-class layout instead of "the place where the rendered MP4 embeds."
3. **Free landing page = marketing surface.** Every shared invitation link is now a Setnayan-hosted page advertising the platform. Original ₱99 × 2 renders × 1,000 weddings = ₱198K/mo line is replaced by two premium V1 SKUs (Monogram Hero ₱1,999 + Live Schedule ₱999) with lower attach rate but higher ASP, plus the V1.1+ widget upgrade tier opening 9 more revenue surfaces post-launch — net likely higher long-term ARPU.

---

## Engineering note

Nothing was ever built against this spec. The Cloudflare Worker render queue, FFmpeg compute path, R2 output buckets, and ZIP bundling job referenced in the original § 5 do not exist in `Setnayan-App`. There is no code to remove. The `service_catalog` SKU row for `save_the_date_render` is dropped as part of the next schema migration pass.

---

## Companion files

- `0024_save_the_date.docx` — `.docx` mirror of this redirect note (regenerate via pandoc once available)
- `0024_save_the_date.html` — original interactive prototype; kept for historical reference, do not link from active surfaces
- `fixtures.json` — original fixture data; no longer authoritative
- `tests.md` — original acceptance criteria; superseded by 0002 + 0004 test plans
