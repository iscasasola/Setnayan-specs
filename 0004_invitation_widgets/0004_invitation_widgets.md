# 0004 — Invitation Widgets Editor

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - **The Pro-tier paid widget upgrades (`monogram_hero_upgrade` ₱1,999 / `pro_widget_schedule` ₱999) are DEFERRED — not shipped.** The ground-truth deferred list calls out "Pro-tier widget purchase (`monogram_hero_upgrade`/`pro_widget_schedule`)" explicitly. The free Basic widget editor shipped under `/dashboard/[eventId]/website` (+ `/invitation`); the per-widget paywall did not.
> - **Any paid upgrade would route through apply-then-pay (0034) with manual admin approval** — there is no direct PayMongo/Stripe charge (the spec already says this; reaffirmed: no automated charge anywhere in V1).
> - The monogram on the live site ships as a separate SKU **"Animated Monogram" ₱2,499** (iteration 0037), distinct from this iteration's free Hero Monogram widget — don't conflate the two.
> - The 11-widget Basic framework + `invitation_widgets` table concept broadly matches the shipped website/widget editor; the reserved Panood/Papic/Patiktok widgets remain unseeded.
>
> When this body disagrees with the above, **the above wins.**

**Type:** Implementation work order (Claude Code ticket)
**Surface:** Setnayan Web → Couple Dashboard ("Customize" panel) + invitation site renderer · **Bottom-nav tab: Guest List** · URL: `setnayan.com/dashboard/[event-id]/invitation` (editor — co-located with 0002's QR admin under the same Invitation Site sub-section)
**Phase:** Phase 1 (web)
**Status:** Ready for Claude Code
**Date:** 2026-05-08
**Owner:** Ice (indaleciocasasolaii@gmail.com)
**Builds on:** 0000 (app shell, sign-in, event-scoped URL, bottom-nav routing), 0001 (events, guest list), 0002 (personal invitation site renders the widgets), 0034 (payments & cart — Pro widget purchases route through `service_orders` via the standard checkout flow)

---

## What to build

The couple's customization editor for their invitation site. The personal invitation site from iteration 0002 is a fixed sequence of sections; this iteration turns those sections into **editable widgets** the couple can configure, reorder, hide, and selectively upgrade to Pro tiers. The editor lives at `setnayan.com/dashboard/customize` as a three-panel layout: widget library on the left, live preview in the center, inspector with Basic/Pro tier toggle on the right.

Each widget has a **Basic tier** included free with every wedding. A small subset of widgets also offers a **paid upgrade** — a one-time per-widget unlock that delivers a fundamentally different visual or operational experience. Paid upgrades are pure-margin upsells; the vast majority of features ship in Basic and are free.

V1 ships with **11 widgets**, of which **2 have paid upgrades (locked 2026-05-16)**: **Monogram Hero** (₱1,999, no refund — animated SVG-trace monogram reveal + custom video/photo background) and **Live Schedule** (₱999 — "Happening now" highlight + auto-scroll). The Our Story scroll-animation Pro tier originally drafted in this iteration is **retired and folded to free** (zero marginal cost); the Pro Bundle is **retired** (bundle math doesn't work with 2 SKUs at vastly different price points). All other previously-Pro features (Waze deep-links, calendar deep-links, video greeting, flip-digit countdown, multi-event RSVP) remain folded into Basic — they cost zero per render and shouldn't gate behind a paywall.

**Reserved for V1.5+:** three additional widget types — **Panood widget**, **Papic widget**, **Patiktok widget** — pre-reserved in the registry but not pre-seeded; activated when their parent iterations (0011 / 0012 / 0017) ship. Each inherits its upgrade pricing from the parent iteration's SKU. Pricing for the remaining 9 widgets' paid upgrades is **TBA post-launch** once V1 usage data identifies which widgets convert.

---

## Build sequence — requires / provides

This iteration is part of a strictly forward-sequenced build. Each numbered iteration must be implementable *in order* with no backward dependencies. This section makes that contract explicit.

### Requires (must be implemented in earlier iterations before this one runs)

| From | What 0004 needs |
|---|---|
| **0001** | `events` table, couple authentication, dashboard shell, R2 storage (PH-region), base palette field on `events` (single-list of swatches — superseded by 0004's multi-palette structure) |
| **0002** | Event Landing Page renderer (server-rendered React tree, reads from a per-event content blob + lifecycle phase), QR Code widget with `color_mode` field already shipped (defaulted to safe black-on-white) |
| **0034** | Payments & Cart spine: `service_catalog` SKUs (`monogram_hero_upgrade`, `pro_widget_schedule`), `carts` + `service_orders` flow, admin-reconciliation activation hook (per 0023 § 3.3). **All paid widget upgrades in this iteration route through the standard apply-then-pay flow** — customer adds upgrade to cart, checks out, pays via QR + screenshot, admin approves, the activation hook flips `invitation_widgets.tier` to `'pro'`. No direct PayMongo/Stripe charges initiated from this iteration. **Monogram Hero is no-refund · all sales final** (apparatus-rule clean — one purchase = one tool unlock); checkout copy must surface this disclosure. The previously-spec'd `pro_widget_hero`, `pro_widget_story`, and `pro_widget_bundle` SKUs are retired per the 2026-05-16 pricing reset. |

### Provides (downstream iterations consume these — do not modify in later iterations without changelog)

| To | What 0004 publishes |
|---|---|
| **0005+** | Lock-palette mechanism: `events.palette_finalized_at` timestamp + broadcast event when set/cleared. Downstream consumers (LED Background Maker, future palette-aware features) register their own regeneration handlers. 0004 only ships the QR-regen handler. |
| **0005+** | Multi-palette structure inside `dress_code.config_json` (8 ceremony role palettes + 1 reception palette + optional reception by_role overrides). Any downstream feature that needs a per-role color reference reads from this. |
| **0005+** | Generic `invitation_widgets` framework: any new widget type (LED widget, paparazzi widget, etc.) registers itself as a row in this table. The widget renderer is extensible — define a `widget_type` value, ship a config schema, ship a renderer module. |
| **0005+** | `pro_widget_purchases` framework (now refactored to spend from apply-then-pay flow): any future Pro-tier upgrade across any widget plugs into the same purchase flow + bundle math. |
| **0006+** | `attire_references` schema (12 role-gender slots × 3 photos): when the V2 Stylist Marketplace launches, it consumes this schema and adds magic-link collaboration access on top. |

### Forward-references intentionally NOT made

- 0004 does not reference iteration 0005's LED Background Maker by name in any field, schema, or runtime check. It only emits a generic palette-finalized broadcast event that 0005 will subscribe to.
- 0004 does not reference iteration 0009's Photo Delivery (Google Drive) integration or any later iteration's product surface.
- 0004 does not assume the existence of the Stylist Marketplace (V2); the V1 attire-reference flow has the couple uploading on the stylist's behalf, with no scoped-stylist-access primitives.

---

## Visual reference (canonical)

`0004_invitation_widgets.html` (this folder) is the canonical visual reference. The mockup shows:

- **Desktop frame (1380px)**: Editor top bar with brand, save state, undo/redo, Preview-as-guest, Save draft, Publish. Three-panel body: left widget library (active widgets list with drag-handles + Add widget + paid-upgrade promo card surfacing the two V1 upgrades), center preview pane (live-rendered scaled invitation, with the selected widget outlined and tagged "Editing"), right inspector (selected widget = Hero Monogram with Basic / Monogram Hero toggle, settings fields, and the Monogram Hero upsell card showing trace animation preview + background upload + "₱1,999 · All sales final · no refund" pricing block). *Note: the canonical `.html` mockup file may still render the older ₱99 Pro pricing; the .md spec is source-of-truth as of 2026-05-16 and the prototype regeneration is a pending engineering task.*
- **Mobile frame (390×844)**: Vertical preview with the selected widget highlighted, slide-up settings sheet at the bottom for editing the active widget, three-tab bottom bar (Widgets / Preview / Settings).

Open the mockup, click a widget in the left rail to swap the inspector content, click the tier toggle to flip between Basic and Pro states.

---

## The 11 widgets

| # | Widget | Basic (free) | Paid upgrade (V1) |
|---|---|---|---|
| 1 | **Hero Monogram** | Static monogram (auto-generated or uploaded SVG/PNG) with style + motif picker + 25-frame catalog | **Monogram Hero · ₱1,999 · no refund** — animated SVG-trace monogram reveal + custom video (15–30s MP4 ≤30MB) OR photo (JPG/PNG ≤5MB) background. **PNG monograms accepted via Potrace conversion + preview gate** (see Pro purchase flow below). All sales final |
| 2 | **Greeting** | Personalized "Hi, [first name]" + custom message + optional couple-uploaded video (15–30 sec MP4) that plays inline per guest | — (V1.1+ TBA) |
| 3 | **Our Story** | Couple's love-story timeline of 3–7 moments (date label + title + body + optional photo) with optional intro/closing copy. Format toggle: timeline / prose / mixed. **Scroll parallax + Ken Burns now in Basic** (folded from retired Pro tier 2026-05-16) | — (V1.1+ TBA) |
| 4 | **Countdown** | Days / Hours / Minutes / Seconds, ticking. Couple chooses style: standard ticker **or** flip-digit + milestone bursts (animated celebration at 30/7/1 days) | — (V1.1+ TBA) |
| 5 | **QR Code** | QR with download + copy + add-to-wallet actions, 6 frame styles, palette auto-derive or custom colors | — (V1.1+ TBA) |
| 6 | **RSVP** | Couple chooses mode: single-event (3 buttons + plus-one + meal + dietary + note) **or** multi-event (separate yes/no per ceremony / reception / after-party with independent meal pickers) | — (V1.1+ TBA) |
| 7 | **Event Details** | Date, ceremony summary, reception summary, guest's role, plus one-tap calendar deep-links (Google / Apple / Outlook) | — (V1.1+ TBA) |
| 8 | **Venue** | Two photo cards (ceremony + reception) with "Get directions" + native Waze + Google Maps deep-links | — (V1.1+ TBA) |
| 9 | **Schedule** | Time-aligned run-of-show list | **Live Schedule · ₱999** — "Happening now" highlight (purely time-based; current block glows + auto-scrolls; role-specific cue line) |
| 10 | **Dress Code · Do/Don't** | Title + 9 palettes (8 ceremony roles + reception) + global Do list + global Don't list + tagline + per-role attire references (up to 3 photos × 12 role-gender slots, stylist-uploaded) + global inspiration board | — (V1.1+ TBA) |
| 11 | **Photo Moments · Savour** | 3 highlighted moments (Bridal Walk / Kiss / First Entrance) | — (V1.1+ TBA) |

**V1 paid upgrades locked (2026-05-16):** Monogram Hero ₱1,999 (no-refund), Live Schedule ₱999. **Retired V1 SKUs:** `pro_widget_story` (Our Story scroll parallax — folded to free); `pro_widget_bundle` ₱199 (bundle math doesn't work with 2 SKUs at vastly different price points). The original Pro Monogram (₱99) and Pro Schedule (₱99) SKUs from earlier drafts are superseded by the repriced V1 SKUs above. Future widgets may add their own paid upgrades in V1.1+; no bundle re-introduced unless ≥3 SKUs land at comparable price points.

**Reserved for V1.5+ (price inherits from parent iteration):** **Panood widget** (when 0011 ships), **Papic widget** (when 0012 ships), **Patiktok widget** (when 0017 ships). Widget types not pre-seeded in `invitation_widgets`; added to the registry only when the parent iteration activates.

**Pricing display rule:** all prices are PHP-native, charm-priced (per 2026-05-12 charm-pricing decision). Monogram Hero = **₱1,999**; Live Schedule = **₱999**. Prices render via the standard PHP price formatter as `"₱1,999"` / `"₱999"` everywhere — cart, checkout, receipts, inspector toggle. See iteration 0034 (Payments & Cart) for the `service_orders` flow. Monogram Hero checkout copy must surface the **"All sales final · no refund"** disclosure before confirm.

---

## Data model

### `invitation_widgets` — one row per widget per event

```sql
CREATE TABLE invitation_widgets (
  widget_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id         UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  widget_type      TEXT NOT NULL CHECK (widget_type IN (
    'hero_monogram','greeting','our_story','countdown','qr_code','rsvp',
    'event_details','venue','schedule','dress_code','photo_moments'
  )),
  tier             TEXT NOT NULL DEFAULT 'basic' CHECK (tier IN ('basic','pro')),
  position         INT NOT NULL,
  is_visible       BOOLEAN NOT NULL DEFAULT TRUE,
  config_json      JSONB NOT NULL DEFAULT '{}',
  pro_purchased_at TIMESTAMPTZ,
  pro_price_paid_centavos INT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, widget_type)
);

CREATE INDEX idx_invitation_widgets_event_pos ON invitation_widgets(event_id, position);
```

When a new event is created, the system seeds 11 widget rows (one per type) at default positions and `tier='basic'`. Default ordering is the widget number above (Hero Monogram = position 1, Photo Moments = position 11). The couple toggles visibility, reorders, edits content, and upgrades to Pro from this single table.

### Per-widget `config_json` schemas (Zod-validated)

```ts
hero_monogram: {
  // Source: auto-generated by Setnayan, OR uploaded by the couple (their designer's work)
  monogram_source: 'auto_generated' | 'uploaded',

  // Used when monogram_source = 'auto_generated'
  partner_a?: string,                // "Maria"
  partner_b?: string,                // "Juan"
  connector?: '&' | 'and' | 'at' | 'y',
  style?: 'ornamental' | 'geometric' | 'calligraphic' | 'modern',
  motif?: string,                    // one of 24 named motifs

  // Hero Monogram inherits its color treatment from the **Bride and Groom palette**
  // (palettes.ceremony.bride_and_groom in the Dress Code widget). The frame stroke, badge ring,
  // and any decorative elements pick from that palette specifically — not the Reception palette,
  // and not any role-based palette. Reasoning: the monogram is the couple's identity; their
  // dedicated palette belongs here. Cascades to the QR center badge: the badge's accent color
  // also reads from Bride and Groom palette so the monogram looks consistent across hero + QR.

  // Frame: 25 options across 5 categories. Applies to BOTH auto-generated and uploaded monograms —
  // the frame wraps whichever inner monogram is active.
  frame: 'circle' | 'rounded_square' | 'square' | 'hexagon' | 'diamond'             // Simple
       | 'shield' | 'oval' | 'double_circle' | 'octagon' | 'square_inner_border'    // Geometric
       | 'sunburst' | 'laurel_wreath' | 'sampaguita_wreath' | 'palm_fronds' | 'garden_botanical'  // Botanical
       | 'calla_side_branches' | 'filigree_scrollwork' | 'art_deco_fan' | 'beaded_pearls' | 'vintage_stamp'  // Decorative
       | 'rope_nautical' | 'capiz_shell_border' | 'baybayin_script' | 'modern_pinoy_geometric' | 'catholic_cross_frame', // Filipino Heritage

  // Used when monogram_source = 'uploaded'
  uploaded_url?: string,             // R2 signed URL of the asset
  uploaded_filename?: string,        // display name in editor ("maria-juan-monogram.svg")
  uploaded_format?: 'svg' | 'png',   // validated at upload time
  uploaded_dimensions?: { width: number, height: number },
  uploaded_file_size?: number,       // bytes
  uploaded_at?: string,              // ISO timestamp

  // Apply to both modes
  date_format: 'long' | 'short' | 'iso' | 'filipino',

  // === Monogram Hero upgrade fields (₱1,999, no-refund — locked 2026-05-16) ===
  // Set only when the couple has purchased the Monogram Hero SKU.
  //
  // PNG-to-SVG conversion via Potrace (amended 2026-05-16):
  // PNG monogram uploads are accepted, but server-side Potrace conversion runs
  // and the couple must approve the converted SVG via a preview gate before
  // checkout completes. SVG-only at the RENDERING layer (the trace animation
  // requires path-driven SVG); PNG-only at the UPLOAD layer is rescued by the
  // Potrace pipeline. SVG uploads bypass conversion entirely.
  //
  // (1) Animated SVG-trace reveal of the monogram on page load.
  //     Each <path> in the monogram SVG animates stroke-dasharray + stroke-dashoffset
  //     from path-length to 0 with cubic-bezier easing; paths stagger so frame draws first
  //     (~1s), then monogram body (~1.5s), then names fade in below (~0.5s) = ~3s total.
  trace_animation_enabled?: boolean,
  trace_animation_duration_ms?: number,  // default 3000, range 1500-6000

  // (2) Custom background for the monogram hero section.
  //     Couple uploads ONE of video OR photo (mutually exclusive).
  //     Rendered behind the monogram + couple names via `object-fit: cover`,
  //     `object-position: center`. Same asset serves all device widths.
  pro_background_type?: 'template_default' | 'photo' | 'video',
  pro_background_photo_r2_key?: string,       // JPG/PNG, max 5MB, ≥1920×1080 recommended
  pro_background_video_r2_key?: string,       // MP4 H.264, 15-30s, max 30MB, autoplay-muted, looping
  pro_background_video_poster_r2_key?: string, // auto-extracted first non-black frame for OG card + slow-connection placeholder
  pro_background_uploaded_at?: string,        // ISO timestamp
  pro_background_uploaded_size_bytes?: number,

  // (3) PNG-to-SVG conversion record (set when uploaded_format = 'png' AND couple
  //     approved the converted SVG via the preview gate).
  //     PNG original kept at `uploaded_url` as backup / audit / future re-conversion.
  //     Converted SVG at `converted_svg_url` is canonical for rendering.
  converted_svg_url?: string,                 // R2 path to Potrace-output SVG
  converted_svg_approved_at?: string,         // ISO timestamp — couple's explicit approval at preview gate
  converted_svg_potrace_settings?: {
    threshold: number,                        // brightness threshold (Potrace --threshold), default 128
    turdsize: number,                         // suppress speckles smaller than this (Potrace --turdsize), default 2
    optcurve: boolean,                        // optimize curves (Potrace --no-optcurve negated), default true
    opttolerance: number,                     // curve-optimization tolerance (Potrace --opttolerance), default 0.2
  },
}

greeting: {
  template: string,                 // can use {first_name}, {couple_names}, {date} placeholders
  // Optional inline video greeting (Basic — included free)
  video_greeting?: {
    r2_key: string,                 // R2 object key for the uploaded MP4
    duration_sec: number,           // 15-30, validated client-side
    file_size_bytes: number,
    poster_r2_key?: string,         // optional poster frame
    uploaded_at: string,
  }
}

our_story: {
  intro?: string,                   // optional opening paragraph
  format: 'timeline' | 'prose' | 'mixed',
  moments: Array<{
    date_label: string,             // "Spring 2019" or specific ISO date
    title: string,                  // "We met at a friend's birthday"
    body: string,                   // 1-2 sentences
    photo_r2_key?: string,
    icon?: string,                  // optional motif glyph
  }>,                               // 3-7 entries
  closing?: string,                 // "And here we are..." kind of line
  // === Basic-tier (folded from retired Pro tier on 2026-05-16) ===
  // Scroll parallax + Ken Burns are now free for every couple.
  // Zero marginal cost to deliver; was extractive to paywall.
  scroll_animation_enabled?: boolean,
  parallax_enabled?: boolean,
  ken_burns_enabled?: boolean,
}

countdown: {
  // Style: free choice, both included in Basic
  style: 'standard' | 'flip_digit',
  show_days: boolean,
  show_hours: boolean,
  show_minutes: boolean,
  show_seconds: boolean,
  eyebrow_text: string,             // 'Until we say "I do"'
  hide_after_event_starts: boolean,
  // Only relevant when style = 'flip_digit' — milestone bursts at 30/7/1 days
  milestone_bursts_enabled?: boolean,
}

qr_code: {
  show_actions: ('save'|'copy'|'wallet')[],
  hint_text: string,
  // Color mode — defaults to auto-derive from the wedding palette
  color_mode: 'auto_from_palette' | 'custom' | 'preset',
  // Used when color_mode = 'custom' — validated for ≥4:1 luminance contrast at save time
  pattern_color?: string,          // hex; couple-picked dark tone
  background_color?: string,       // hex; couple-picked light tone
  // Used when color_mode = 'preset'
  style_preset?: 'classic_black' | 'filipino_heritage' | 'modern_pinoy' | 'garden' | 'beach' | 'catholic_classic',
  // Card frame styling — independent of color mode
  card_corner_radius: number,      // 0-32px
  card_shadow: 'none' | 'subtle' | 'soft' | 'lifted',
  card_border: 'none' | 'thin' | 'decorative',
}
// DEFAULT BEHAVIOR (color_mode = 'auto_from_palette'): GATED on events.palette_finalized_at being set.
// Until the couple explicitly locks their palette via the Dress Code widget's "Lock palette" toggle,
// this option is disabled in the QR Code Widget's color_mode picker (with tooltip explaining how to
// unlock). QR uses safe black-on-white during the planning phase to prevent flickering QR appearances.
// Once palette is locked: renderer reads the locked palette swatches, picks the darkest-with-≥7:1 contrast
// as pattern color and the lightest as background, falls back to ≥4:1 then black-on-white if no swatch
// combo clears the threshold. Re-editing the palette warns about QR regeneration before allowing re-lock.

rsvp: {
  // Mode: free choice, both included in Basic
  mode: 'single_event' | 'multi_event',
  deadline: string,                 // ISO date

  // Used when mode = 'single_event'
  show_meal_picker?: boolean,
  show_dietary_field?: boolean,
  show_plus_one_picker?: boolean,
  custom_question?: string,

  // Used when mode = 'multi_event' — independent RSVP per event with its own meal picker
  events?: Array<{
    event_key: 'ceremony' | 'reception' | 'after_party' | string,
    label: string,                  // "Ceremony" / "Reception" / "After-party"
    show_meal_picker: boolean,
    show_dietary_field: boolean,
  }>,

  closed_message: string,
}

event_details: {
  show_date: boolean,
  show_ceremony: boolean,
  show_reception: boolean,
  show_guest_role: boolean,
  // Calendar deep-links — included in Basic
  calendar_links_enabled: boolean,  // shows Google / Apple / Outlook one-tap add-to-calendar
  calendar_event_title?: string,    // override for the calendar event title
  calendar_event_description?: string,
}

venue: {
  ceremony: { name, address, time_local, parking_notes, photo_r2_key },
  reception: { name, address, time_local, parking_notes, photo_r2_key },
  // Deep-links — included in Basic (no longer a Pro upgrade)
  show_waze_link: boolean,
  show_google_maps_link: boolean,
}

schedule: {
  blocks: Array<{ time, title, location?, description?, role_cue?: { role_key: string, cue_text: string }[] }>,
  // === Live Schedule upgrade fields (₱999 — re-priced from ₱99 on 2026-05-16) ===
  // Purely client-side time comparison vs. current time.
  // SKU `pro_widget_schedule` retained (same code, new price).
  live_highlight_enabled?: boolean,
  auto_scroll_to_current_block?: boolean,
}

dress_code: {
  title: string,                    // "Look magical"
  intro: string,
  // Multi-palette structure — couples shape one palette per role, plus a Reception palette
  palettes: {
    ceremony: {
      bride_and_groom: Array<{ name, hex }>,           // bride's gown + groom's suit colors
      best_man: Array<{ name, hex }>,                  // best man + groomsman pair primary
      maid_of_honor: Array<{ name, hex }>,             // MoH + bridesmaid pair primary
      team_bride: Array<{ name, hex }>,                // bridesmaids overall (often coordinates with MoH)
      team_groom: Array<{ name, hex }>,                // groomsmen overall (often coordinates with Best Man)
      principal_sponsors: Array<{ name, hex }>,        // Ninong/Ninang formal palette
      secondary_sponsors: Array<{ name, hex }>,        // candle/veil/cord/coin sponsor pairs
      guests: Array<{ name, hex }>,                    // overall dress code (current "palette" in V1)
    },
    reception: {
      main: Array<{ name, hex }>,                      // primary reception palette
      // optional per-role overrides for reception if couple wants different evening colors
      by_role?: { ... same role keys as ceremony ... }
    }
  },
  // Global Do/Don't — applies to ALL guests regardless of role.
  // Surfaced in the editor under a clearly-labeled "Applies to everyone" panel,
  // separate from the per-role palette tabs.
  do_list: string[],
  dont_list: string[],
  tagline: string,

  // Per-role attire reference photos (V1 stylist-upload model)
  // Up to 3 photos per role-gender slot. The wedding stylist (or couple acting on
  // their behalf) uploads sample photos showing the expected look for each role-gender.
  // The public invitation renders these as small per-role galleries with optional captions.
  // Empty slots simply don't render — graceful fallback.
  attire_references: {
    bride:               { images: AttireImage[] },  // up to 3
    groom:               { images: AttireImage[] },
    best_man:            { images: AttireImage[] },
    maid_of_honor:       { images: AttireImage[] },
    team_bride:          { images: AttireImage[] },  // bridesmaids
    team_groom:          { images: AttireImage[] },  // groomsmen
    principal_sponsor_m: { images: AttireImage[] },
    principal_sponsor_f: { images: AttireImage[] },
    secondary_sponsor_m: { images: AttireImage[] },
    secondary_sponsor_f: { images: AttireImage[] },
    guest_m:             { images: AttireImage[] },
    guest_f:             { images: AttireImage[] },
  },

  // Optional non-role-specific reference shots (fabric swatches, mood photos,
  // palette references, Pinterest-style inspiration). Capped at ~12.
  global_inspiration?: {
    images: AttireImage[],
  },
}

type AttireImage = {
  r2_key: string,
  caption?: string,                 // "Maid of Honor — sage green, off-shoulder"
  uploaded_by?: 'couple' | 'stylist',
  uploaded_at: string,
}

photo_moments: {
  intro: string,
  moments: Array<{ time_label, title, location, glyph }>,
  presence_note: string,
}
```

All `config_json` writes go through Zod validation server-side. The schemas are versioned (a `_schema_version` field on each config) so future migrations are clean.

**Note on Frame Catalog (Hero Monogram, 25 options):** Production renders these as SVG components from a frame library stored under `/assets/monogram_frames/{frame_id}.svg`. Each frame is a square SVG with a transparent center hole sized at ~60% of the canvas, into which the inner monogram (auto-generated or uploaded) is composited. Categories: Simple (5), Geometric (5), Botanical (5), Decorative (5), Filipino Heritage (5). Frames inherit the wedding's accent color from the locked palette by default. Couples who picked Custom QR colors can override the frame stroke color independently. **CRITICAL — QR center rendering at small sizes:** complex frames (filigree, sampaguita_wreath, baybayin_script, etc.) lose detail at the QR center badge size (28×28 to 56×56px). The renderer uses a SIMPLIFIED variant of the chosen frame at QR center — typically the frame's basic geometric shape (circle, square, hexagon) without decorative botanical/scrollwork detail. Each frame in the library ships with two variants: full (rendered at hero/print sizes ≥80px) and simplified (rendered at QR center ≤56px). The simplification map is part of the frame library, not couple-configurable.

**File requirements for uploaded monograms** (renderer-validated): SVG preferred (scales infinitely; stays sharp at QR-center sizing and at print). PNG accepted if ≥800×800 with transparent or white background. Square aspect ratio (within 10% tolerance); non-square assets cropped center. Max file size: 1 MB. JPG / GIF / WebP / other formats rejected at upload (lossy at QR-center sizing).

**Cascading regeneration on monogram changes:** regardless of source, changing any monogram-related field triggers two cascading actions: (1) Update `events.monogram_svg` (auto-generated case) OR `events.monogram_uploaded_url` (upload case) — whichever is set is the canonical monogram for that event. (2) Invalidate all cached guest QR SVGs and enqueue regeneration of every guest's QR with the new monogram composited at center. Per spec 0002: branded QR uses error-correction level H (~30%) and the monogram badge sits in the reserved center clearance — fully scannable in either source mode.

**Cross-iteration consumer — top-nav monogram (added 2026-05-14):** the same canonical monogram (`events.monogram_svg` or `events.monogram_uploaded_url`) is also rendered in the global top-nav chrome per amended iteration 0000. The top-nav reads the same fields with the same priority rule (uploaded wins over auto-generated when both are set). When neither field is populated — i.e., the couple hasn't created a Hero Monogram yet — the top-nav renders a 1–2-letter initials fallback derived client-side from `events.event_name`; it does **not** trigger Hero Monogram auto-generation, so the editor in this iteration remains a couple-driven opt-in. Cascading regeneration above does not need to invalidate any top-nav cache — the top-nav reads `events` directly on each render.

**Note on Greeting Video Upload:** The video greeting is included in Basic. Couple uploads a 15–30 sec MP4 (validated client-side: max 60MB, 1080p max, H.264 preferred). Stored on R2 (PH-region). Storage cost is ~₱0.05/month per wedding; egress is free on R2. The video plays inline (autoplay-muted by default; guest can unmute). Optional poster frame can be auto-extracted from the first non-black frame.

**Note on Dress Code Lock Palette (this iteration *provides* the mechanism):** the Dress Code widget hosts the **"Lock palette"** toggle. Flipping it ON sets `events.palette_finalized_at = NOW()` and broadcasts a palette-finalized event. Flipping OFF (re-opening the palette) shows a confirmation modal that warns about cascading invalidation: "Editing your palettes will regenerate all guest QRs and invalidate cached palette-derived assets. Continue?"

This iteration's only direct consumer of the lock palette is the QR Code widget (defined here in 0004 itself), which reads the locked palette to auto-derive its colors when `color_mode = 'auto_from_palette'`. The lock-palette mechanism, the broadcast event, and the regeneration-job hook are intentionally provided as a generic primitive in 0004 so that *downstream iterations* (LED Background Maker in 0005, future palette-aware features) can subscribe without 0004 needing to know about them. Downstream iterations register their own regeneration handlers; 0004 ships only the QR-regen handler.

The 8 ceremony role palettes + 1 reception palette = 9 distinct palettes per wedding. Each palette is a list of swatches the couple defines in the Dress Code editor (a sub-tabbed UI: Reception | Ceremony Roles, with a tab per role). Most couples will set Reception + Guests (the defaults from V1's single-palette model) and skip role-level palettes; that's fine — downstream consumers default to Reception · main if a role palette is empty.

**Note on Attire References (V1 stylist-upload model):** The couple's wedding stylist (or the couple themselves) uploads up to 3 reference photos per role-gender slot. 12 role-gender slots × 3 photos = up to 36 photos per wedding. All slots optional; empty roles don't render. Stylist collaboration flow (magic-link scoped access for the stylist) is deferred to V1.5 — V1 has the couple uploading on the stylist's behalf. The illustrated figure library with runtime skin-tone + fabric color recoloring is **deferred to V2** — to be built as a B2B2C tool when the Setnayan Stylist Marketplace launches (stylists pay for it, couples benefit downstream).

### `pro_widget_purchases` — the upgrade record

```sql
CREATE TABLE pro_widget_purchases (
  purchase_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id           UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  widget_id          UUID NOT NULL REFERENCES invitation_widgets(widget_id),
  purchase_type      TEXT NOT NULL CHECK (purchase_type IN ('individual','bundle')),
  php_price_centavos INT NOT NULL,                       -- canonical PHP price in centavos (V1: 199900 = ₱1,999 Monogram Hero, 99900 = ₱999 Live Schedule)
  order_id           UUID NOT NULL REFERENCES service_orders(order_id),
                                                         -- the 0034 service_orders row that funded this upgrade
  refunded_at        TIMESTAMPTZ,
  refund_order_id    UUID REFERENCES service_orders(order_id),
                                                         -- the refunded service_orders row (status='refunded') on reversal
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Bundle purchases create one `pro_widget_purchases` row per widget the bundle covers; couples can see itemized line items even though one `service_orders` row funded all of them.

---

## Paid upgrade purchase flow (apply-then-pay via 0034 · locked 2026-05-16)

V1 has **two** paid upgrades: **Monogram Hero** (₱1,999, no-refund) and **Live Schedule** (₱999, refundable per 0034 § 8 within 14 days).

1. Couple is on the inspector for an upgrade-eligible widget (Hero Monogram or Schedule). They click the "✦ Upgrade ·" toggle.
2. If `pro_purchased_at IS NOT NULL` for this widget, tier flips immediately and saves. (Already upgraded.)
3. If not, the SKU (`monogram_hero_upgrade` / `pro_widget_schedule`) is added to the couple's cart per 0034. Cart drawer slides up showing the upgrade name + price + one-time language.
   - **For Monogram Hero:** the cart drawer surfaces the **"All sales final · no refund"** disclosure prominently. The couple must check an acknowledgment box before Checkout activates.
   - **PNG → SVG preview gate** (locked 2026-05-16 amendment): if the couple's current monogram is uploaded PNG, the cart drawer offers an inline **"Convert your PNG to SVG so it can animate?"** path before checkout activates. See the 6-step preview-gate flow immediately below. PNG monograms are no longer hard-blocked; they're rescued by Potrace conversion + explicit couple approval.

### Monogram Hero PNG → SVG preview gate (6-step flow · locked 2026-05-16)

1. Couple in Monogram Hero checkout has a PNG monogram (per `hero_monogram.uploaded_format = 'png'`).
2. Editor surfaces the offer: *"Convert your PNG to SVG so it can animate? We'll show you the result first."* with two CTAs: **Convert + preview** and **Upload SVG instead**.
3. On **Convert + preview**: a `POST /api/monogram/convert?event_id={event_id}` request runs the Potrace WASM Worker; server reads the PNG from R2, runs Potrace with default settings (threshold 128, turdsize 2, optcurve true, opttolerance 0.2), writes the output SVG to R2 under `hero_monogram/{event_id}/converted.svg`. Typical wait ~2 seconds; loading state shown in the editor.
4. **Preview screen** opens: side-by-side panels showing (a) the original PNG and (b) the animated SVG-trace preview looping ~3s. Heading copy: *"This is how your monogram will animate on your landing page. Take your time."*
5. Three CTAs on the preview: **Use this SVG** (proceed to checkout) · **Try a different file** (return to monogram upload) · **Use auto-generated instead** (revert to Setnayan's generator).
6. On **Use this SVG**: write `converted_svg_url`, `converted_svg_approved_at`, and `converted_svg_potrace_settings` to `hero_monogram.config_json`. The PNG at `uploaded_url` is **kept as backup** (audit, archive, future re-conversion if Potrace settings improve). The SVG at `converted_svg_url` is the canonical monogram for rendering. Cart drawer's Checkout button now activates; couple proceeds through the standard apply-then-pay flow.

**Engine:** Potrace (open-source, server-side, Cloudflare Worker WASM). ~₱0 marginal cost per conversion. Mature, used by Inkscape's Trace Bitmap. Quality 80–90% on high-contrast monogram-style content.

**Preview-gate IS the consent mechanism for the no-refund clause.** Couples see exactly what they're paying for before commit. "Use this SVG" is the moment of acceptance; all-sales-final is morally defensible after the gate.
4. Couple taps Checkout. Standard apply-then-pay flow per 0034 § 3 runs: payment screen with BDO + GCash QR codes → external payment → screenshot upload → admin review → approve.
5. **On admin Approve:** the service-activation hook (0034 § 4.4) inserts a `pro_widget_purchases` row referencing the `service_orders.order_id`, sets `invitation_widgets.pro_purchased_at = NOW()`, and flips `invitation_widgets.tier = 'pro'`. The upgrade fields unlock in the inspector. For Monogram Hero, the Trace Animation toggle and background upload widgets unlock.
6. **Refund window:**
   - **Monogram Hero (₱1,999):** NO REFUND. All sales final. The 14-day window does not apply. Apparatus-rule clean — one purchase = one tool unlock; not returnable. Admin console refunds-tooling will refuse Monogram Hero refunds unless an explicit two-admin escalation override is filed.
   - **Live Schedule (₱999):** 14 days from `paid_at`, only if the Pro tier hasn't been actively customized in a way that requires the Pro fields. Refund processed per 0034 § 8: admin marks the `service_orders.status = 'refunded'`, the deactivation hook on `pro_widget_purchases` sets `refunded_at`, populates `refund_order_id`, flips `invitation_widgets.tier = 'basic'`, zeroes `pro_purchased_at`.

**Retired SKUs (2026-05-16):**
- `pro_widget_hero` (₱99 Pro Monogram animation) — superseded by `monogram_hero_upgrade` (₱1,999) which bundles trace animation + custom video/photo background
- `pro_widget_story` (₱99 Our Story scroll parallax) — folded to free, no SKU
- `pro_widget_bundle` (₱199 three-widget bundle) — math doesn't work with 2 SKUs at vastly different price points; couples pick what matters

**Pricing rationale (2026-05-16):**
- **Monogram Hero ₱1,999** — designer-grade upgrade (PH monogram designers charge ₱2K–10K for static work; ₱1,999 for animation + custom video background is market-appropriate). All sales final because (a) the upgrade unlocks immediate creative output the couple can't un-see, (b) animation customization can't be cleanly reverted, (c) apparatus-rule clarity.
- **Live Schedule ₱999** — 10× re-price from original ₱99 captures the wedding-day moment-of-glory value. The widget glows at the venue when "Cake Cutting" is happening NOW; that emotional payoff justifies the premium price.
- **Bundle retired** — two SKUs at ₱1,999 + ₱999 = ₱2,998 don't bundle naturally. No discount stack offered; couples pick the one(s) that matter to them.

---

## Editor UX

### Three-panel layout (desktop, 1380px+)

**Left rail (280px):** Widget library.

- "Active widgets" section — drag-reorderable list of all 11 widgets currently in the invitation. Each item: drag handle, icon, name, tier label (Basic / Pro), visibility toggle (eye icon). Click a widget to select it (loads it in the inspector). The eye icon toggles `is_visible` without removing the widget — hidden widgets render with reduced opacity in this list and don't render on the public invitation.
- "Add widget" button — opens a sheet listing widgets the couple has hidden, plus future widgets that may be added (when more widget types are released, they'll appear here for couples to opt in).
- "Paid upgrades" promo card at the bottom — surfaces the two V1 upgrades available: **Monogram Hero ₱1,999** (animated SVG trace + custom video/photo background; no-refund disclosure surfaced inline) and **Live Schedule ₱999** ("Happening now" highlight). No bundle in V1 (retired 2026-05-16; bundle math doesn't work at these price points).

**Center (flexible):** Live preview pane.

- Toolbar above the preview: "Mobile / Tablet / Desktop" device toggle (defaults to Mobile because most guests view on mobile), plus Refresh and "Open full" actions.
- The preview frame renders the actual invitation site at the chosen device width. The currently-selected widget gets a 2px accent outline + a small "⬤ Editing" tag, so the couple can see exactly what they're editing in context.
- Clicking a widget in the preview also selects it (clicking-the-thing-you-want-to-edit pattern from Webflow / Squarespace).

**Right inspector (360px):** Widget settings.

- Header: eyebrow ("Editing widget"), widget name, tier toggle (Basic / Pro · +price for widgets with Pro tiers; widgets without a Pro tier hide the toggle entirely).
- Body: per-widget content fields organized into field groups. Each group has a small DM-Mono heading and the relevant inputs (text inputs, selects, style cards for visual choices, motif tiles for monogram motifs, color pickers for palettes).
- For widgets with a Pro tier (Hero Monogram, Our Story, Schedule): a Pro upsell card appears in the inspector body showing a preview of the Pro feature (animation preview, parallax preview, live-highlight preview), price tag, and Upgrade button. If already upgraded, the card collapses into a small "✓ Pro active" indicator and the Pro fields become editable inline.
- For Dress Code: the inspector body uses a sub-tab strip — **Palettes · Do/Don't · Attire References · Inspiration**:
  - **Palettes:** sub-tabbed picker for the 9 palettes (Reception | per-role)
  - **Do/Don't:** the global Do/Don't lists, labeled "Applies to everyone"
  - **Attire References:** 12 role-gender accordion rows, each with 3 photo upload slots and caption fields
  - **Inspiration:** unconstrained gallery for fabric/palette/pattern references (Pinterest-style)
- Footer: auto-save indicator ("⬤ Auto-saved") + Reset-to-default button.

### Mobile editor (390×844)

A simpler take. Editing on mobile is real but secondary — most couples customize on desktop. Mobile editor:

- Top bar: back arrow, "Customize · auto-saved" subline, Publish button.
- Full-width preview of the invitation site, scaled down. Tapping any widget on the preview opens a slide-up settings sheet.
- Settings sheet: rounded-top panel that slides up from the bottom 60% of the screen. Widget name + tier toggle at top, settings fields below, Pro upsell card if applicable.
- Bottom 3-tab bar: Widgets (the active default — shows preview with edit affordances), Preview (full-screen guest-view simulation), Settings (global settings — theme, slug, sharing).

The mobile editor is best for tweaks ("change the greeting copy"), not for first-time setup or major restructuring. The dashboard nav nudges couples to "Open the editor on desktop" if they're trying to do heavy customization on mobile.

---

## Functional scope

### Must work end-to-end

- **Widget seed at event creation.** New events get 11 invitation_widgets rows at sensible defaults (Filipino Heritage theme content, Maria & Juan stub data ready to be replaced). Default position 1 = Hero Monogram, position 2 = Greeting, position 3 = Our Story, ..., position 11 = Photo Moments.
- **Edit widget content.** Field changes write to `config_json`, autosave debounced 500ms.
- **Toggle visibility.** Eye icon flips `is_visible`. Public invitation page hides invisible widgets without re-rendering layout.
- **Reorder widgets.** Drag handles on the left rail update the `position` column. Position changes reflect in the public invitation immediately on save.
- **Tier toggle / Pro purchase.** Clicking Pro on a Pro-eligible widget that hasn't been bought opens the payment modal. Successful payment flips tier and unlocks Pro fields. Refund within 14 days. Widgets without a Pro tier hide the toggle.
- **Monogram Hero purchase.** Single ₱1,999 charge unlocks the animated SVG-trace monogram reveal + custom video/photo background. SVG-only validation enforced at checkout (PNG monograms blocked with inline upgrade message). No-refund disclosure surfaced inline with required acknowledgment checkbox before checkout button activates.
- **Live preview.** Center pane re-renders within 250ms of any field change (debounced).
- **Device-width preview toggle.** Mobile / Tablet / Desktop in the preview toolbar swaps the preview frame width.
- **Save draft / Publish.** Drafts are written to `config_json` continuously; Publish flips the event's visibility per spec 15's lifecycle (`page_status = 'published'`).
- **Mobile editor.** Single-widget tap-to-edit, slide-up settings sheet, tier toggle, Pro upsell.
- **Auto-save indicator.** "⬤ All changes saved · 2s ago" updates in real-time.

### Basic-tier features that must work end-to-end (folded in from former Pro candidates)

- **Greeting video upload.** Couple uploads a 15–30 sec MP4 in the Greeting inspector. R2 PUT via signed URL. Renders inline on the public invitation, autoplay-muted with unmute control.
- **Countdown style picker.** Couple selects standard vs. flip-digit in the Countdown inspector. Flip-digit option includes milestone bursts (CSS animation triggered at 30/7/1 days remaining).
- **RSVP mode picker.** Couple selects single-event vs. multi-event in the RSVP inspector. Multi-event mode adds an events array; each event has its own meal/dietary picker.
- **Event Details calendar deep-links.** Renderer constructs Google / Apple / Outlook add-to-calendar URLs from the event date + name + venue. Three buttons in the public invitation, one-tap.
- **Venue Waze + Google Maps deep-links.** `https://waze.com/ul?ll={lat},{lng}` and `https://maps.google.com/?q={lat},{lng}`. Two icon buttons next to "Get directions."
- **Dress Code attire references.** Couple uploads up to 36 photos (3 × 12 role-gender slots). Renderer displays them as compact per-role galleries on the public invitation. Empty slots gracefully hidden.

### Out of scope (deferred)

- **Custom widgets** (couple-built) — V2.
- **Free-form drag-drop layout** — locked at sequential vertical widgets per spec 15 Part 11. No CSS Grid customization.
- **Widget templates / presets** — V1.5 (e.g., "Catholic Classic preset" auto-fills 11 widgets).
- **A/B testing** of invitation variations — never (couples have one invitation).
- **Rich-text formatting in long fields** beyond bold/italic — V2.
- **Stylist magic-link collaboration access** — V1.5. V1 has couple uploading on stylist's behalf.
- **Illustrated attire figure library** with runtime skin-tone + fabric recoloring — V2, built as a stylist-marketplace tool (B2B2C).
- **Per-render AI outfit generation** ("render my actual gown") — V2 paid premium, ₱99–149 per render with explicit disclaimer.
- **More Pro upgrades** — start with Hero animation + Our Story scroll + Schedule live highlight. Each new Pro tier is its own product decision.

---

## ⚠️ Important — Offline behavior

**Filipino wedding venues frequently have weak or no internet.** This iteration is primarily a *pre-event* experience (couple customizes the invitation from home; guests view + RSVP from their phones, usually well before the event). But two surfaces interact with the venue day:

**RSVP submission (guest-facing, can happen at any time including at the venue):**

- The RSVP form must use **optimistic UI + queued writes**. When a guest taps "Going / Maybe / Can't" with no connection, the UI confirms immediately and stores the response in `localStorage` / IndexedDB with a `pending_sync` flag.
- A background sync handler retries the POST every 30 seconds while the page is open, and on next page load if the previous attempt failed.
- The visible RSVP state shows "✓ Saved · syncing" until the server confirms, then "✓ Saved" with the canonical timestamp.
- Server-side: `rsvp_responses` writes are idempotent on `(guest_id, event_id)` — re-submission overwrites with the latest timestamp. Conflict resolution: last-write-wins per field.

**Day-of RSVP changes (couple/coordinator amending RSVPs at the door — e.g., a guest no-shows or a plus-one drops out):**

- Same queued-write pattern. The dashboard's guest-list update form caches changes locally and syncs in the background.
- The actual door check-in flow lives in iteration 0001 Guest List's offline behavior section (see that spec) — this iteration only handles invitation-page RSVPs.

**All other widgets in this iteration** (Hero Monogram, Our Story, Greeting, Countdown, QR Code, Event Details, Venue, Schedule, Dress Code, Photo Moments) are **read-only at view time** — the rendered HTML/CSS is fully cacheable via service worker. Once a guest has loaded the invitation site once on a connection, the cached version renders fully offline (videos and large photos may show a placeholder if not yet downloaded). This makes the invitation viewable at the venue even when both the venue and the guest's cellular have failed.

**Service worker strategy:** the public invitation site registers a service worker that caches the current event's HTML, all widget CSS/JS bundles, the guest's branded QR (already locally generated per spec 0002), and the first-loaded gallery thumbnails. New uploads after the first load are not auto-fetched — guests refresh manually when reconnected.

---

## Acceptance criteria

- [ ] Visiting `/dashboard/customize` for a couple-authenticated user with an event renders the three-panel editor (left rail + preview + inspector). Default selected widget = Hero Monogram. Left rail shows 11 widgets.
- [ ] Editing a field (e.g., changing the connector from "&" to "and") updates the live preview within 250ms and autosaves within 500ms.
- [ ] Reordering widgets via drag-and-drop on the left rail persists `position` to the database; the public invitation reflects the new order on next render.
- [ ] Hiding a widget with the eye icon excludes it from the public invitation; in-editor it stays visible at 50% opacity.
- [ ] Clicking the upgrade toggle on Hero Monogram adds `monogram_hero_upgrade` (₱1,999) to the couple's cart per 0034. Cart drawer surfaces the **"All sales final · no refund"** disclosure with a required acknowledgment checkbox. If the current monogram is uploaded PNG, the cart drawer surfaces the **"Convert your PNG to SVG so it can animate?"** preview-gate path (per the 6-step flow); checkout button stays disabled until the couple either (a) approves the converted SVG, (b) uploads an SVG directly, or (c) reverts to auto-generated.
- [ ] **Monogram Hero PNG-to-SVG conversion + preview gate:** with a PNG monogram in place, tapping "Convert + preview" calls `POST /api/monogram/convert` → Potrace WASM Worker runs → output SVG written to R2 within ~3s p95. Preview screen renders side-by-side (original PNG + animated SVG trace, ~3s loop). Three CTAs are present: **Use this SVG · Try a different file · Use auto-generated instead**. Tapping "Use this SVG" writes `converted_svg_url`, `converted_svg_approved_at`, and `converted_svg_potrace_settings` to `hero_monogram.config_json` and activates the cart Checkout button. PNG original at `uploaded_url` is preserved.
- [ ] Clicking the upgrade toggle on Schedule adds `pro_widget_schedule` (₱999) to the couple's cart per 0034. Cart drawer slides up showing the upgrade.
- [ ] After standard apply-then-pay checkout (per 0034 § 3) and admin approval (per 0034 § 4), the service-activation hook inserts a `pro_widget_purchases` row referencing `service_orders.order_id`, flips `invitation_widgets.tier` to 'pro', sets `pro_purchased_at`, and unlocks the upgrade fields in the inspector. For Monogram Hero: trace animation toggle + background upload widgets unlock.
- [ ] Monogram Hero **refund attempts are refused** by the admin console refunds tool unless explicit two-admin escalation is filed. Live Schedule refund within 14 days (admin-processed per 0034 § 8) reverts `tier` to 'basic', writes `refunded_at`, populates `refund_order_id`, returns live preview to basic styling.
- [ ] **Monogram Hero background upload:** couple uploads a video (15–30s MP4 H.264, ≤30MB) OR a photo (JPG/PNG, ≤5MB). Validation blocks files outside spec. Video: poster frame auto-extracted from first non-black frame. Photo: stored as-is. Background renders behind the monogram on the public landing page via `object-fit: cover`.
- [ ] **Monogram Hero trace animation:** SVG monogram paths animate via `stroke-dasharray` + `stroke-dashoffset` on page load, staggered ~3s total reveal. Animation reduces to a static monogram in users with `prefers-reduced-motion: reduce` set.
- [ ] **Pro Bundle SKU is retired** — `pro_widget_bundle` should not appear in the cart or checkout; admin console SKU list shows it as retired.
- [ ] **Offline RSVP:** disabling network in DevTools, submitting an RSVP, re-enabling network within 5 minutes results in the response being syncing successfully without duplicate writes. UI shows "✓ Saved · syncing" then "✓ Saved · just now."
- [ ] **Service worker cache:** loading the invitation site once with a connection, then disabling network, refreshing the page, results in all widgets except video/photo media rendering correctly.
- [ ] Live preview frame switches between Mobile (390px), Tablet (768px), Desktop (1100px) widths via the toolbar toggle.
- [ ] Visual parity to `0004_invitation_widgets.html` at 1380px desktop and 390px mobile widths. The selected widget on the preview shows a 2px accent outline + "⬤ Editing" tag.
- [ ] **Greeting video** uploads, validates duration (15–30s) and size (≤60MB), renders inline on the public invitation autoplay-muted.
- [ ] **Countdown** flip-digit style triggers milestone celebration animation at 30/7/1 days remaining without server roundtrip.
- [ ] **RSVP multi-event mode** records independent yes/no + meal per event in the rsvp_responses table.
- [ ] **Event Details** calendar buttons open the correct Google / Apple / Outlook URLs with the wedding event populated.
- [ ] **Venue** Waze and Google Maps buttons open native apps on iOS/Android via deep-link, fall back to web.
- [ ] **Dress Code Attire References** sub-tab shows 12 role-gender slots × 3 photo upload slots; uploads to R2 with role tagging; public invitation renders per-role galleries.
- [ ] **Mobile editor** opens a slide-up settings sheet on tapping any widget in the preview. Tier toggle works the same as desktop. Settings persist on dismiss.
- [ ] **Mobile is thumb-friendly** per the standing rule: ≥44pt tap targets, slide-up sheet for forms (not modals), bottom tab bar for primary nav.
- [ ] Lighthouse 90+ on the editor (the editor itself, not the preview frame).

---

## Privacy & compliance

- The customization editor is couple-only. Server-side guard rejects access from any user where `couple_user_id != session.user_id`.
- `pro_widget_purchases` records financial data — encrypt `payment_ref` at rest if it includes provider-side identifiers, otherwise store as opaque receipt ID.
- No guest data is exposed in the editor — couples customize the *frame* of the invitation; per-guest personalization (greeting first name, role, household) is templated and rendered server-side at guest render time.
- Greeting video and attire reference photos: stored on R2 (PH-region), 5-year retention, included in the couple's data export and DSAR flows.
- Stylist-uploaded attire reference photos in V1 are stored under the couple's account (the couple is the data owner). When the stylist marketplace launches in V2 with magic-link collaboration, photos uploaded by the stylist remain attributed (`uploaded_by: 'stylist'`) for audit but ownership stays with the couple.

---

## Companion files to read before starting

1. `CLAUDE.md` — project context.
2. `0004_invitation_widgets.html` (this folder) — visual reference.
3. `0004_invitation_widgets.docx` (this folder) — narrative summary.
4. `0002_qr_invitation_system/0002_qr_invitation_system.md` — defines the personal invitation site that consumes these widgets. The widget rendering contract on the public site reads from `invitation_widgets.config_json` per type.
5. `15_Couple_Landing_Page_Feature_Specification.md` — Part 3 (Couple Settings Panel) and Part 4 (Theme System) describe how customization plugs into the broader landing-page architecture.

---

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-05-08 | V1 ships with 11 widgets (added Our Story as #3 between Greeting and Countdown) | Standard wedding-website expectation; sets emotional tone before practical action items |
| 2026-05-08 | Most former Pro features folded into Basic | Zero marginal cost to deliver — paywalling features that cost nothing to render felt extractive. Greeting video, flip-digit countdown, multi-event RSVP, calendar deep-links, and Waze/Google Maps deep-links are all Basic |
| 2026-05-08 | V1 Pro tiers locked at 3: Hero Monogram animation, Our Story scroll animations, Schedule live "happening now" highlight | Each is a clear "wow" moment with zero marginal cost. Hero animation drives emotion; Our Story parallax adds cinematic feel; Schedule live highlight makes the schedule actively useful on the wedding day |
| 2026-05-08 | Pro Bundle priced at ₱199 (covers all 3 Pros, vs ₱300 separately, ~33% off) | Bundle math kept dynamic in code so it auto-scales as new Pros are added |
| 2026-05-08 | **Pro tier per widget priced at ₱99; Pro Bundle (all 3) at ₱199** (charm-priced 2026-05-12) | Clean impulse-purchase price points; bundle saves ~33% off the all-three sum and converts couples who would have bought at least one anyway |
| 2026-05-12 | **Pro purchases routed through the 0034 payments & cart spine — replaces the retired token wallet flow** | The 2026-05-11 retirement of the token wallet (iteration 0003) collapsed all in-app SKU purchases onto a single apply-then-pay flow defined in 0034. Pro widget upgrades now go: add-to-cart → checkout → QR code → screenshot → admin approve → activation hook flips tier. No direct PayMongo / Stripe charges; no wallet ledger; one `service_orders` row per upgrade event |
| 2026-05-16 | **V1 paid-upgrade pricing reset — Monogram Hero ₱1,999 no-refund + Live Schedule ₱999; retire 3 SKUs.** Hero Monogram ₱99 animation Pro is replaced with **Monogram Hero ₱1,999 (no refund · all sales final)** that bundles the animated SVG-stroke trace reveal + custom video (15-30s MP4 ≤30MB) OR photo (JPG/PNG ≤5MB) background. SKU code rename `pro_widget_hero` → `monogram_hero_upgrade`. Live Schedule re-priced ₱99 → ₱999. Retired SKUs: `pro_widget_story` (Our Story scroll parallax — folded to free); `pro_widget_bundle` (₱199 bundle math no longer works with 2 SKUs at vastly different price points). | Designer-grade upgrade pricing aligns with PH monogram designer market (₱2K-10K for static work); the trace + custom hero background is a fundamentally different visual product than free baseline. Schedule 10× re-price captures wedding-day moment-of-glory value. No-refund clause is apparatus-rule clean (one purchase = one tool unlock; immediate creative output not reversible). |
| 2026-05-16 | **Monogram Hero accepts PNG via Potrace preview gate (amends earlier SVG-only-hard-block).** Earlier same-day decision hard-blocked PNG monogram uploads from the Monogram Hero upgrade. Amended: PNG uploads are accepted, server-side Potrace conversion runs, the couple sees a side-by-side preview + animated trace loop, and the couple explicitly approves the converted SVG before checkout activates. PNG original kept as backup at `uploaded_url`; converted SVG at `converted_svg_url` is canonical for rendering. SVG uploads bypass conversion. The preview gate IS the consent mechanism for the no-refund clause — couples see exactly what they're paying for before commit. | The earlier hard-block was right-by-default but unnecessarily restrictive on what's technically possible. Many couples receive their monogram as PNG from their designer (designer keeps the SVG source); blocking PNG forced them to either go back to the designer, use auto-generated, or skip the upgrade. The preview gate protects the quality bar without locking out couples — those whose conversions look bad self-select away at the preview step. Potrace is free + open-source + battle-tested; quality 80–90% on monogram content; ~₱0 marginal cost preserves the 95%+ margin on the ₱1,999 SKU. |
| 2026-05-16 | **0024 Save-the-Date video SKU retired; landing page is now free with lifecycle phases (Phase 1 = Save-the-Date hero).** This iteration's widget editor surface continues to be the customize interface for that page. Save-the-Date as a separate ₱99 MP4 render no longer exists; couples get a free Phase 1 hero out of the box and optionally upgrade to Monogram Hero (₱1,999) for the animated/personalized version. | Closes item #6 of the 2026-05-15 owner walkthrough. The video-file primitive was wrong for the JTBD; the page-with-calendar-add solves the actual job better. See CLAUDE.md 2026-05-16 entry for full rationale. |
| 2026-05-16 | **3 V1.5+ widget types reserved: Panood, Papic, Patiktok.** Not pre-seeded in `invitation_widgets`; added to the registry only when parent iteration (0011 / 0012 / 0017) activates. Each inherits its upgrade pricing from the parent iteration's SKU. | Forward-compatible registry pattern. Couples don't see unused widget types cluttering the editor; widgets appear when the underlying feature ships. |
| 2026-05-08 | Dress Code adds **per-role attire references** (3 photos × 12 role-gender slots, stylist-uploaded) | Replaces abstract "moodboard" with concrete role-specific guidance. Up to 36 photos per wedding; all optional |
| 2026-05-08 | Global Do/Don't lists explicitly labeled "Applies to everyone" in the editor (no schema change) | Removes ambiguity — the per-role palettes are scoped, but the Do/Don't is universal. UI surfaces this distinction clearly |
| 2026-05-08 | Illustrated attire figure library (with runtime skin-tone + fabric recoloring) deferred to V2 | Build cost (~₱25–35K) hard to justify until demand validated. V1 ships with stylist-uploaded reference photos at zero build cost |
| 2026-05-08 | When V2 launches the figure library, it ships as a **stylist-marketplace B2B2C tool** | Stylists pay (subscription or per-wedding add-on); couples benefit downstream. Better unit economics than a couple-facing feature |
| 2026-05-08 | Per-render AI outfit generation deferred to V2 paid premium | Real per-render cost (₱3–15) breaks Setnayan's zero-marginal-cost pattern; IP risk on uploaded designer sketches; quality non-deterministic. Future paid premium with disclaimers when justified |
| 2026-05-08 | Stylist magic-link collaboration access deferred to V1.5 | V1 has couple uploading reference photos on stylist's behalf. Stylist-scoped access flow parallels the paparazzi seat-claim pattern when built |
| 2026-05-08 | **Architectural rule codified: strict forward iteration sequencing.** Each iteration `NNNN` may only depend on iterations `< NNNN`. Forward references must be reframed as "this iteration provides X; downstream iterations consume X." | Ensures the folder sequence builds cleanly step-by-step. Backward dependencies (this iteration depending on a later one) are bugs that require either stubbing in the earlier iteration or moving the variable forward. Applied to 0004: removed direct references to LED Background Maker (now 0005) and Photo Delivery / Google Drive (now 0009); reframed the Lock Palette toggle and multi-palette structure as primitives that 0004 *publishes* for downstream iterations to subscribe to |
| 2026-05-08 | **Cascading rename:** when the Apply-then-Pay flow iteration was inserted as 0003, all subsequent folders shifted +1. Invitation Widgets moved from 0003 → 0004; LED Background Maker 0004 → 0005; Vendors 0005 → 0006; Budget 0006 → 0007; Seating 0007 → 0008; Photo Delivery 0008 → 0009; Mood Board 0009 → 0010 | Strict forward sequencing rule required Apply-then-Pay flow (a foundational primitive consumed by every paid surface) to ship before Invitation Widgets. Rename was mechanical |
| 2026-05-08 | **Offline behavior section added.** RSVP submissions use optimistic UI + queued writes; service worker caches the rendered invitation site for view-time offline access | Filipino wedding venues frequently have weak internet. Guests must be able to RSVP and view their invitation even with intermittent or no connection |

---

## Notes for Claude Code

- **Don't reinvent the preview engine.** The preview pane should server-render the same React tree that powers the public invitation site (the renderer shipped in 0002). Use a lightweight wrapper that sets the device width and adds the "selected widget" outline overlay. Sharing one renderer between editor preview and the live site means edits look identical to what guests see.
- **No bundle in V1.** The Pro Bundle (₱199, 3 widgets) was retired 2026-05-16; bundle math doesn't work with 2 paid SKUs at vastly different price points. Couples pick the one(s) that matter to them. If V1.1+ adds ≥3 paid widget upgrades at comparable price points, a bundle may be re-introduced — keep the bundle math in code, not hardcoded, ready to wire when conditions justify.
- **All paid widget upgrades route through the apply-then-pay payments & cart spine** (iteration 0034). No direct PayMongo / Stripe calls from this iteration. The cart drawer, payment screen, and admin reconciliation surfaces live in 0021 / 0023 and are reused; this iteration only triggers the add-to-cart for the V1 SKU codes (`monogram_hero_upgrade` for Hero Monogram, `pro_widget_schedule` for Live Schedule). Retired SKU codes (`pro_widget_hero`, `pro_widget_story`, `pro_widget_bundle`) must NOT be added to cart and the admin console SKU list must reflect retired status.
- **Monogram Hero accepts PNG via Potrace conversion + preview gate** (amended 2026-05-16). Before adding `monogram_hero_upgrade` to the cart, check `hero_monogram.config_json.monogram_source` / `uploaded_format`. If SVG or auto-generated: proceed to cart directly. If PNG: surface the PNG → SVG preview-gate flow (6-step) — Potrace WASM Worker runs server-side, couple sees side-by-side preview + animated trace loop, couple explicitly approves the conversion before checkout activates. The approved SVG is stored at `converted_svg_url` and becomes canonical for rendering; the original PNG at `uploaded_url` is kept as backup. PNG monograms continue to work on Basic tier (static rendering) without conversion.
- **Monogram Hero is no-refund.** Checkout copy surfaces "All sales final · no refund" with a required acknowledgment checkbox. Admin console refunds tool refuses Monogram Hero refunds unless explicit two-admin escalation is filed. Apparatus-rule clean — one purchase = one tool unlock; immediate creative output not reversible.
- **Greeting video upload constraints:** validate client-side (duration 15–30s, size ≤60MB, codec H.264 preferred, container MP4). Reject otherwise with clear error. Generate poster frame from first non-black frame using `ffmpeg.wasm` in the browser before upload.
- **Attire references upload constraints:** JPG/PNG accepted, max 5MB per image, recommended 1080×1080 or larger square crop. Auto-rotate from EXIF.
- **When you finish, save a result summary at `0004_invitation_widgets_result.md`** describing what was built, what was deferred, what schema migrations ran, and any decisions made worth surfacing.
