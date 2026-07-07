# Monogram Studio — Vector Design Tool (Design + Prototype)

> **⚠ UPDATE 2026-06-19 (owner "we only want the VECTOR STUDIO and upload your own; remove the rest" · PR #1842):** the couple Monogram Maker page (`/dashboard/[eventId]/monogram`) now offers **only the Vector Studio + Upload your own**. The **Cipher Studio** (#1269), **Bespoke/AI studio** (#1245 · 0037), and the lettered **"Drawn" maker** (+ motion-style picker) were **retired** from the page (full code removal). The Vector Studio is therefore the *only* in-app composer — no longer "a 4th writer alongside Cipher/Bespoke/Upload." The **Animated Monogram ₱2,499 SKU is kept**, re-pointed to bloom the Vector Studio / Upload mark. No schema change (`monogram_cipher_config` + `bespoke_monogram_generations` retained for existing marks). Shared infra kept (`bespokeSvgToDataUri`, `sanitizeBespokeSvg`, `monogram-motion`/`AnimatedMonogramHero`/`BespokeMonogramMark`, lettered data model). See DECISION_LOG 2026-06-19.
>
> **Status: SHIPPED to app code 2026-06-19 (Phase 5 of the monogram overhaul).** Designed across an iterative `show_widget` session (prototype v21), then built into the live Monogram Maker at `/dashboard/[eventId]/monogram` as the **Vector Studio** card. Working prototype artifact: [`06_Prototypes/Monogram_Studio_Prototype_2026-06-19.html`](../06_Prototypes/Monogram_Studio_Prototype_2026-06-19.html) (standalone). Supersedes the static [`Monogram_Lab_2026-06-01.html`](../06_Prototypes/Monogram_Lab_2026-06-01.html) and extends the [`Monogram_Maker_Plan_2026-06-05.md`](Monogram_Maker_Plan_2026-06-05.md). Pricing → owner's holistic pass (the free monogram stays free).
>
> **As-built (2026-06-19):** the studio's saved mark **is the official event monogram** — Save exports a tight-viewBox pure-paths SVG to `events.monogram_custom_svg` (the single canonical mark every surface reads: chrome icon, QR centre, landing hero, save-the-date, seating/mood PDFs, social cards), with a re-editable `events.monogram_studio_config` source (new column, migration `20270126539355`). It is a **4th writer** of the one `monogram_custom_svg` alongside Cipher / Bespoke / Upload; saving clears the others' provenance so exactly one source owns the mark (upload still overrides). Code: `app/dashboard/[eventId]/monogram/{studio.tsx, studio-actions.ts}` + the shared engine/markup at `lib/monogram-studio/{engine.ts, markup.ts}` + `lib/monogram-studio-shared.ts`; deps `paper` + `paperjs-offset` (client-only dynamic import) + 8 self-hosted OFL faces in `public/monogram-studio/fonts/`.
>
> **Public studio (2026-06-19 · "build this to www.setnayan.com"):** a FREE, no-login version lives at **`/monogram`** on the public marketing site. Same engine + editor (shared `lib/monogram-studio/*`), but a visitor has no wedding to save into — so it ends in **Download** (crisp SVG + transparent PNG, rastered client-side) + a *"start planning · free"* CTA into `/onboarding/wedding`, never a server write. Free by the standing "the free monogram stays free" lock; it's a lead-magnet, with the paid layer (Animated Monogram reveal) downstream. In `NAV_ROUTES` + a footer link, but NOT the locked 6-page top-nav (IA lock).
>
> **Carry-through (2026-06-19 · shipped):** a mark designed on the public studio BEFORE sign-up now follows the visitor into their wedding. The public studio stashes the sanitized design to `localStorage` (`lib/monogram-studio/draft.ts` · SVG + config + 30-day TTL) on download + CTA; after sign-up, the dashboard Monogram Maker shows a *"pick up the monogram you designed"* card (`draft-restore.tsx`) when a draft exists AND the event has no mark yet, submitting it to the existing `saveStudioAction` (which re-sanitizes + auth-gates — so the localStorage→server boundary is safe). One-shot: cleared once a mark exists, so it never re-nags. Device-bound (download = cross-device fallback).

---

## 0. TL;DR

A couple-facing **vector monogram studio**: the initials are **real font outlines** (not CSS text), directly manipulated, interlocked with true boolean operations, framed with a mirrored fountain-pen, and previewed with **ink-character animations**. Everything is vector, so it stays crisp at any size, sits on a transparent background, and can animate + export cleanly. It is the redesign of the "fresh redesign" fork the owner picked over polishing the old Monogram Lab.

The original ask — *"delete parts of a letter… the one on top has a stroke outline and we pick the overlapping strokes to delete or merge"* — is realized as a **per-crossing Combine / Cut / Delete** tool on real geometry.

---

## 1. Tech stack (verified loading in the sandbox)

| Library | Role | Source |
|---|---|---|
| **opentype.js** 1.3.4 | font file → glyph **drawing commands** | cdnjs |
| **paper.js** 0.12.18 | the vector canvas: boolean ops, paths, layers, view (pan/zoom), `onFrame` animation | cdnjs |
| **paperjs-offset** 1.0.8 | path **offset** (outside outline + cut-gap dilation) | jsdelivr (`window.PaperOffset`) |
| **8 static Google fonts** | the typefaces (must be **static** TTF — opentype.js does not decode variable-font `gvar`; static glyf outlines are required) | `cdn.jsdelivr.net/gh/google/fonts@main/ofl/…` |

**Hard-won lessons (load-bearing for the real build):**
- **opentype.js needs STATIC fonts.** Variable fonts technically parse but the studio standardised on static TTFs to avoid empty/odd outlines; the 8 faces below are all static.
- **Build paper paths from opentype `getPath().commands`** (moveTo/lineTo/curveTo) **or `importSVG`** — `new paper.CompoundPath(pathDataString)` was unreliable and rendered empty.
- **Let paper own hi-DPI.** Set `view.viewSize` in CSS px and let paper apply `pixelRatio`; do **not** also multiply the canvas by `devicePixelRatio` (double-scaling pushed the art off-canvas).
- **Outside-aligned stroke = offset geometry, not a centered stroke.** A centered stroke eats inward as it thickens and distorts the letter; the outline is rendered as `offset(path, w)` filled behind the glyph.
- **Cut gap = boolean subtraction, not a fat stroke.** A thick erase-stroke bulges and self-overlaps on serif curves; the gap is `lowerLetter.subtract(offset(topLetter, gap))`.
- **Dark-mode hosts restyle form controls** — force the studio's own light palette on inputs/buttons with `!important` + `appearance:none` so it reads correctly in any theme.

## 2. The 8 typefaces

Cardo (italic serif) · Gilda Display (high-contrast) · Playfair Display SC (small caps) · Marcellus (refined) · Yeseva One (bold display serif) · Cinzel Decorative (ornate roman caps) · Great Vibes (script) · Pinyon Script (formal copperplate). Each loads on demand; the couple's layout/edits carry across font swaps.

## 3. Feature set

### 3a. Letters — direct manipulation
- **Drag** to move, **scroll / pinch** to resize, **gold corner-handle / two-finger twist** to rotate, **double-click** to reset a letter. (Replaces the old X/Y/Size sliders — "modern, gesture-first".)
- Names → initials (`L & R`), or a single initial.

### 3b. Interlock — per-crossing, on real geometry
Tap a crossing where two letters overlap → a per-crossing action bar:
- **Combine** — boolean **union** into one continuous outline.
- **Cut** — top letter weaves over the lower with an adjustable **gap** (subtraction of the offset top letter). Gap is editable right in the crossing bar; **0 = flush**.
- **Delete** — the overlapping region is **knocked out** of both (a clean hole).
- **On top** — explicitly pick which letter crosses over (replaces a blind flip).

### 3c. Per-letter styling
Each letter carries its **own** Outline (outside-offset, never distorts), Cut gap (the gap it leaves when on top), and Finish (auto-clean), plus Bring-to-front / Send-to-back.

### 3d. Auto-clean (finish)
Despeckle boolean slivers + straighten near-straight segments + simplify — letterform-safe by default (it cleans boolean junk without sanding serifs).

### 3e. Frame — mirrored fountain pen
A **Draw frame** mode with a real **fountain pen**:
- **4 nib tips:** Broad (chisel calligraphy — nib-angle thick/thin), Pointed (flex copperplate, tapered points), Round (monoline), Brush (fuller taper). Built by sweeping a ribbon: broad = swept along a fixed nib-angle vector; others = perpendicular-to-tangent with pressure/speed width + end taper.
- **Width driver:** real **pressure** on a stylus (`pointerType==='pen'`), **speed** (slower = thicker) on finger/mouse.
- **Mirror:** Off / Vertical / Horizontal / 4-way — one-finger draws on one side, reflected across the axis so both sides are equal (symmetric frames / wreaths). Two fingers pan/zoom while drawing.

### 3f. Canvas, colour, background
Pan-and-zoom sheet (drag empty space / pinch / scroll · Fit recenters). **Three colour rows, each with a curated preset palette + a native custom-colour picker:** **Ink** (mulberry · gold · champagne · obsidian · navy · sage · dusty-rose + custom); **Outline** — a *global* outline-ring colour (gold · champagne · silver · mulberry · ink · white + custom) **+ Clear** (`none` → no ring drawn even at width > 0; default gold so existing marks are unchanged); **Backdrop** (paper · white · cream · blush · sage · dark + custom) **+ Clear** (transparent checkerboard). The backdrop is the *working canvas only* — the saved mark is **always transparent** so it drops onto any page/photo and exports with transparency. (As-built 2026-06-19: `StudioConfig.outlineColor` hex|`'none'`; ink/backdrop store any hex.)

### 3g. Ink animations (Play) — *not* generic transforms
- **Handwriting** — letters written one-by-one (M → & → J → frame) with a gold **nib** riding the front of each stroke as ink lays down behind it.
- **Trace** — one continuous gilded line traces the whole mark, fill bleeding in behind.
- **Droplet** — ink **grows and floods** outward from seed droplets until it fills the mark (clip-circle growth, organic multi-seed).

(Implemented via paper `onFrame`: write/trace = stroke-dash `dashOffset` on the outline + fill fade; droplet = a growing clip mask on the grouped mark. All have failsafe timeouts so the UI never locks.)

### 3h. Undo / redo
Full history (snapshots of letter state + interlock + frame strokes) — buttons + ⌘/Ctrl-Z, ⌘/Ctrl-Shift-Z. Covers move/resize/gap/outline/finish/combine-cut-delete/on-top/draw/clear/reset.

## 4. Open / next

- **Symbol palette** — stamp vector ornaments (dot · ring · star · sparkle · diamond · leaf · fleur · laurel) that **mirror as frame parts** (mirror on) or **stand alone as part of the mark** (mirror off). The agreed-but-unbuilt next addition.
- **SVG export** of the finished mark (all-vector, so direct) → feeds the event-wide monogram surfaces (QR centre, hero, save-the-date, etc., per 0037).
- **Persistence model** — how the studio's output stores on `events` (today the shipped maker uses `monogram_*` columns + `monogram_cipher_config` + `monogram_custom_svg`). The vector studio would save its composed SVG to the custom-mark column, slotting in beside the Cipher Studio path.
- **Relationship to shipped maker / 0037** — this is the design-forward successor to the lettered/Cipher/Bespoke maker at `/dashboard/[eventId]/monogram`; build sequencing + which pieces land first → owner.

## 5. Pricing

Not set here — **provisional**, deferred to the holistic pricing pass. The free monogram stays free (never gate the static/drawn mark); any premium (e.g. animated reveal on the wedding site) aligns with the existing Animated Monogram SKU. See `Pricing.md`.
