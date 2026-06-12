# Wedding Website — Effects & Editing Spec (canonical working doc)

> **Created 2026-06-11** with the owner, in-session. Companion to
> [`Wedding_Website_Lifecycle_Spec_2026-06-07.md`](Wedding_Website_Lifecycle_Spec_2026-06-07.md)
> (the *what's on the site* doc). This doc covers the two layers that don't exist yet:
> **(A) how the couple edits the site** ("edit on the page") and **(B) the motion/effects
> system** that makes a Setnayan site feel cinematic instead of like a form.
> Spans iterations **0002** (invitation site), **0021** (couple dashboard editor), **0024**
> (save-the-date), **0031** (day-of), **0037** (animated monogram). Fold into those `.md`
> files once the build order below is signed off. DECISION_LOG row added 2026-06-11.

## 0. Why this doc exists — the current gap

Studied against `origin/main` (local main is ~500 commits stale):

- The customer "Website" nav doorway opens **`/site-editor/[eventId]`** — a full-screen
  "Reels-style" shell with a **dead** live-preview iframe (`pointer-events-none`) and a
  4-tab carousel whose cards **deep-link OUT** to separate sub-editor pages
  (`/website/hero-photo`, `/website/dress-code`, `/invitation`, …). It is a **launcher,
  not an editor** — you leave the preview to edit anything, then come back.
- The public guest site (`app/[slug]/page.tsx`) renders **essentially static**. The only
  motion that ships is the one-off monogram stroke-draw (`animated-monogram-hero.tsx`) and
  a scroll-reveal helper (`_components/marketing/_motion.tsx` → `Reveal`) that is wired
  into the **marketing** site only, never the wedding site. There is **no scroll-scrubbed
  video, no per-section animation, no envelope intro, no editorial newspaper, no PDF
  keepsake.**
- **No motion library** is installed (no framer-motion / GSAP / Lenis / Lottie). House
  style = hand-rolled CSS + `IntersectionObserver` + `requestAnimationFrame`. **`pdf-lib`
  IS installed** (used by receipts) — the PDF keepsake reuses it / a print stylesheet, no
  new dependency.

So three layers must be built: **the inline editor** (how you build it) · **the content
blocks** (what's on it — the §2 matrix in the lifecycle spec) · **the motion system** (how
it moves). This doc specs the 1st and 3rd.

---

## 1. The editing model — "edit on the page"

**Principle (owner, UX-north-star):** the live preview **IS** the editor. The couple sees
their real site and edits in place — never thrown to a separate page. This is what finally
delivers the "full-screen Reels-style takeover" the editor promised but never honored.

### 1.1 Three interactions, identical on both platforms — only the container changes

1. **Select** — tap/click a block in the live preview (it outlines + shows a small
   ✎ / drag / 👁 toolbar), OR pick it from the section list.
2. **Edit** — its fields open **without leaving the page**. Every keystroke/toggle
   re-renders the preview live.
   - **Mobile:** a **bottom sheet** rises (~60–75% height); the preview stays visible
     above it. Swipe down to close.
   - **Desktop:** the **right inspector** pane fills with that block's fields.
3. **Arrange** — drag to reorder, eye-icon to show/hide — done **per phase** (a block can
   sit high on RSVP, lower on Event, gone on Editorial).

### 1.2 Shell

- **Phase switcher** — `RSVP · Event · Editorial` segmented control. Swaps both the preview
  state AND which sections exist. Replaces today's mislabeled tabs (shipped "Event" = "all
  content"). Matches the 2026-06-07 lock (one site, 3 date-driven phases).
- **⚙ Settings** door — non-content config: URL/slug · master QR · visibility
  (public/unlisted/private) · Google Drive · theme/palette · **Motion style** (§3.1).
- Top chrome — ✕ exit · Preview (hides all edit affordances) · **Publish** · device toggle
  (desktop only: phone ↔ broadsheet width) · autosave "Saved" pill.

### 1.3 Layout

| | Mobile | Desktop |
|---|---|---|
| Preview | Full screen, interactive (tap to select) | Center, in a device frame |
| Sections | Bottom **chip rail** (tap to jump+select; long-press drag) | **Left rail** list (drag-reorder, 👁 toggles, + Add section) |
| Editing | **Bottom sheet** (rises over live preview) | **Right inspector** pane |

### 1.4 What this replaces

The shipped sub-editors (`/website/hero-photo`, `dress-code`, `photo-moments`,
`special-message`, `what-to-bring`, `our-photos`, `site-chrome`, `widgets`, `privacy`)
become **inline inspector/sheet panels** — same fields, same server actions, folded into
the one canvas. Their routes can stay as deep-link fallbacks during migration, then retire.

---

## 2. The effects catalog (RSVP + Editorial marquee set)

Owner-prioritized 2026-06-11. Each effect = **what it is · how it animates · how it's
edited · tier (proposed)**.

### 2.1 Scroll-scrubbed cinematic hero — RSVP/Event chrome · **PRO (proposed)**
- **What:** the couple's hero footage where **scroll position is the playhead** — scroll
  down, the film advances frame-by-frame; scroll up, it rewinds. Distinct from the
  *ambient looping hero video* (autoplay-muted-loop, already half-shipped via `site-chrome`)
  — the couple picks ONE hero treatment: **Still photo · Looping video · Cinematic scrub**.
- **Motion:** scroll drives `video.currentTime`; the monogram **draws itself** over the
  film (extend `animated-monogram-hero.tsx`), names rise, then the hero "releases" and the
  page reveals.
- **Edited by:** Hero inspector → Background = Photo / Video / **Cinematic**; on Cinematic,
  upload footage (auto-processed: transcode to keyframe-dense encode, poster, lighter mobile
  variant) + one **scrub-length** dial (how much scroll = the full clip).
- **Build note:** the heavy item. Needs frame-friendly encoding + a **mobile fallback**
  (Apple's technique pre-extracts frames to a `<canvas>` image-sequence for reliability;
  low-power devices fall back to the looping video / keyframe stills). `rAF`-driven, zero-dep.
- **No AI / no nano-banana** (owner Q 2026-06-11). Scrubbing isn't generation — it's the
  couple's own footage with scroll as the playhead, done entirely with **FFmpeg (already in
  the stack)**: keyframe-dense MP4 (desktop) + WebP frame-sequence on `<canvas>` (mobile).
  AI imagery, if ever wanted elsewhere, = **Recraft** (configured backend), never an image
  model for the scrub; nano-banana makes images, not video, so it's irrelevant here.

#### 2.1a Multi-clip "spatial journey" — ⚠ SUPERSEDED/PARKED (owner correction, same day)
> **Owner 2026-06-11 (verbatim intent):** *"we do not want keynote transition effects. i was
> referring to the different spatial transitions that banana can create. and not on the love
> story. just the background of the whole rsvp."* → The multi-clip love-story scroll journey
> below was a misread of the ask. It stays PARKED as a possible future effect (nothing below
> is build-committed); the actual feature is **§2.1b — the RSVP Spatial Backdrop**, BUILT
> 2026-06-11. Keynote-style canned transitions are explicitly OUT everywhere.
The cinematic hero can chain **several clips**, one per love-story chapter (*how we met →
proposal → wedding*), so one scroll = a journey through connected *places*, not a single clip.
**Tiering/pricing = TBD** (deferred to the full features-and-prices pass).
- **Two build models.** (A) **Stitched journey (default):** FFmpeg `concat` + `xfade` bakes
  the clips into ONE continuous film that scrubs as a single playhead — simplest, bulletproof,
  transitions designed offline (not reflowable). (B) **Scene-by-scene:** each clip its own
  scrubber, the page pins → scrubs → releases into the next (Apple section-pinning) — flexible
  + reorderable, heavier JS + careful loading.
- **How clips "spatially connect" — the transition ladder** (cheap → most spatial): (1)
  **match cut** (clip 2 opens mid-motion of clip 1 — one unbroken shot); (2) **cross-dissolve**;
  (3) **spatial slide/pan** (camera pans to a new place); (4) **portal / depth zoom** (push
  *into* a window/doorway/bright spot in clip 1 → it becomes clip 2; the strongest "you
  traveled there" feel); (5) **parallax depth** (fore/background move at different speeds across
  the seam → reads 3D); (6) **3D fly-through** (clips as planes, a virtual camera flies between
  — most immersive, needs **WebGL/Three.js = a NEW dependency we don't ship; later/premium
  frontier**). Magic ingredient for all: **consistent motion direction + a shared anchor across
  the seam**.
- **Edited by:** drop clips into a **sequence** (one per chapter — reuses `events.love_story`),
  pick ONE **journey style** preset (*Seamless · Cinematic-portal · Gentle-dissolve*, themed by
  the §3.1 Motion preset), optionally tap a **portal anchor** on a clip (else auto-pick brightest/
  centre). Auto-processed by FFmpeg (normalize · color-match · keyframe-dense/frame-extract · bake
  transitions for model A). Editor gently coaches: "clips that end + start on movement connect best."
- **Build note:** the heaviest effect — multiple videos = real bandwidth/memory → lazy per-scene
  load + preload-next + mobile fallback (fewer frames / one lighter stitched file / drop to
  dissolves). Models A/B = FFmpeg + `rAF`, zero new dep; only model #6 (fly-through) adds WebGL.

#### 2.1b RSVP Spatial Backdrop — AI-generated world with scroll-through depth · ✅ BUILT 2026-06-11
**The owner's actual ask:** the whole RSVP page sits on **one immersive AI-generated
backdrop**, and as the guest scrolls, the **camera moves through that generated space** —
depth and travel, not a slideshow. The RSVP content (greeting · countdown · form) floats on
top. "Spatial transitions" = moving across a seam from one generated space INTO a second
(e.g., under the garden lights → deep beneath the lantern canopy), never a Keynote slide.

**Shipped (PR #1233 branch · same architecture as the math spec asserts):**
- `lib/spatial-backdrop.ts` — pure registry + scroll math: per-layer **push-in scale +
  parallax rise** (depth-differential = the 3D read) and a **crossfade seam** between two
  scenes (windows overlap 0.45–0.62 of the scroll track; seam can never go blank — unit-
  asserted). Intensity = Subtle/Standard/Lavish words only (no curve editing, §3.1 lock).
- `app/_components/spatial-backdrop.tsx` — fixed renderer; rAF + passive scroll, imperative
  transform/opacity (compositor-only, zero re-renders/frame); `prefers-reduced-motion` →
  static; aria-hidden; scene-0 eager, rest lazy.
- **Legibility guarantee (v2, owner 2026-06-11 "remove the white background"):** the vellum
  panel is RETIRED — widgets float **directly on the world** (each card carries its own cream
  surface, art flows between cards); loose text reads via an **inherited cream text-halo**
  on the content column (text-shadow: cream bloom + faint dark micro-rim — invisible on the
  cards' own surfaces) over a barely-there `bg-cream/[0.12]` blurred light column — v3 after
  owner feedback that the v2 `/35` wash still read as a milky veil. Footer over the backdrop =
  transparent cream-on-vignette. (PRs #1246 + #1247.)
- **Data:** `events.rsvp_backdrop JSONB {theme, intensity}` (migration `20261110000000`,
  applied to prod). DB stores ONLY the registry key — never asset URLs (injection-proof).
  Renders in the RSVP era only (`pre`/`inactive` day-of phases; live day stays lean).
- **Editor:** site-editor RSVP tab → "Living backdrop" card → inline sheet (theme cards w/
  thumbnails · motion words · Turn off) — the §1 edit-on-the-page pattern.
- **Launch worlds (2):** `gilded-dusk` (twilight garden lights → under the lantern canopy) ·
  `capiz-glow` (capiz parol lanterns → starlit sea). Assets: Recraft v3, lights-on-black glow
  layers composited `mix-blend-mode: screen` (the alpha-free layering trick), 676KB total,
  human-reviewed (generated PEOPLE removed via upward-camera reframe + sky-crop — Recraft
  ignores "no people" when a scene implies an occasion; framing beats negation).

**Journey film (v4 · owner 2026-06-11 "the background need to be a video that moves as we
scroll"):** each theme now ships a pre-rendered **journey video** — the same world as FILM
(camera pushes through scene A → crossfade → deeper into scene B; FFmpeg zoompan from the
hi-res Recraft scenes, keyframe-dense encode) — and on qualifying devices (≥1024px, no
reduced-motion, no save-data) **scroll IS the playhead**: scroll progress maps linearly onto
the video timeline (lerp-smoothed seeks; the element is never play()ed). The near bokeh
layers keep rendering ON TOP as live screen-blend parallax — baked camera motion below,
real-time depth above. The baked crossfade sits at the same ≈0.45 scroll fraction as the
layer math's seam, keeping film + layers in sync. Non-qualifying devices (mobile, reduced
motion, save-data) automatically keep the layered-stills renderer — it is the universal
fallback, and the pre-`canplay` state everywhere. (PR pending this row.)

**On nano-banana (Gemini image):** the generation backend is **model-agnostic** — the
pipeline is "scene prompt → far scene + glow layer per scene". Today's worlds are Recraft
(the configured backend; key present locally AND in the Vercel env). nano-banana slots in
for **V1.x couple-custom worlds** ("describe your dream backdrop" → generated per-couple,
admin-moderated) — its character/scene-consistency strengths fit generating the SAME world
from progressively deeper camera positions. Not a V1 dependency.

### 2.2 Envelope-open intro — RSVP · **Standard (proposed)**
- **What:** the site's *opening ceremony*. First visit shows a sealed envelope **addressed
  to the guest by name** (from their guest session), closed with a **wax seal stamped with
  the couple's monogram**.
- **Motion:** tap "Open" (or first scroll) → flap lifts in 3D, seal breaks, the invitation
  card slides up/out, envelope fades, hero takes over. Plays **once per guest** (remembered
  via `sessionStorage`/cookie). `prefers-reduced-motion` → skip straight to the invitation.
- **Edited by:** Settings/Hero toggle **Opening: Envelope · None** + seal (the monogram) +
  paper/liner color from the couple's palette.
- **Build note:** CSS 3D transforms + a one-time gate. Zero-dep, house style.

### 2.3 Love-story line — RSVP (+ feeds Editorial & Pakanta) · **Free**
- **What:** a vertical timeline down the page spine — *how we met → first date → proposal →
  wedding*. Reads `events.love_story` JSONB `{how_we_met, proposal, milestones:[{year,
  title,note}]}` (foundation specced 2026-06-07).
- **Motion:** as the guest scrolls, the **connecting line draws itself** downward; each
  milestone **fades + rises**; its photo **parallaxes** at its own speed.
- **Edited by:** the **Setup Interview** (onboarding) fills it once; the Love Story
  inspector is a list of milestone cards — add/reorder/edit (year · title · note · photo).
  Told once, used three ways (RSVP section · editorial spine · Pakanta lyrics).

### 2.4 Photos & Save-the-Date — RSVP · **Free** (STD render = ₱49 / 0024)
- **Our Photos** (`events.our_photos`) gets a couple-picked **Display style**:
  *Masonry* (parallax tiles) · *Carousel* (film-strip) · *Slideshow* (full-bleed) ·
  *Polaroid* (scattered). Tap → **lightbox** zoom + swipe.
- **Save-the-Date video** gets its own framed section that **plays inline on tap** (poster
  shown; never autoplay-with-sound). 0024 renders it in 3 aspect ratios (16:9 · 1:1 · 9:16)
  → the site auto-picks the slot's crop; couple can promote it to **hero**.
- **Edited by:** Photos inspector = upload/reorder + Display-style picker; Save-the-Date
  inspector = pick the rendered video (or upload) + placement + poster frame.

### 2.5 Newspaper editorial + PDF keepsake — Editorial · **Pro / Editorial SKU**
- **What:** every wedding auto-generates a **front-page newspaper** — masthead nameplate,
  edition line, lead headline + italic deck + byline, multi-column body with **drop cap** +
  **pull quote**, and a boxed **"By the Numbers"** sidebar (Setnayan Impact: guests · photos
  · RSVP % · #1-match hit-rate · ≈hrs saved). LLM writes it from *that wedding's* real facts
  /reviews/stats (never canned — see lifecycle §8). Desktop = broadsheet → mobile =
  single-column editorial.
- **Motion:** drop-cap paints in · columns fade up · pull-quote slides · **"By the Numbers"
  counts up** (odometer).
- **PDF keepsake (NET-NEW function):** a **"Download PDF keepsake"** button renders the same
  layout to a print-quality, multi-page PDF the couple **and every guest** can keep/print.
  Guests reach their own copy via their personal QR. **Reuses `pdf-lib` / the receipts PDF
  pipeline** + a `@media print` newspaper stylesheet (a `/[slug]/editorial/print` route);
  server-side render so it's one tap, no browser dialog.
- **Living Moments — the 5-second clips strip (owner 2026-06-12: "we want to see live 5
  second videos also").** The Papic 5s clips (hard product cap) become an editorial section:
  a film-strip / mosaic of candid clips that play **muted auto-loop as they scroll into
  view** (the "live photo" feel — motion without sound until tapped; tap = sound + full
  view). Pulls from the SAME tagged-capture pipeline as photos: the shared strip shows
  couple-curated picks; the **per-guest pickup view shows the clips THEY are tagged in**.
  Feeds: Papic clips · Patiktok booth reels · Pabati video well-wishes (each its own row
  when owned). Performance: poster-first, lazy IntersectionObserver mount, ≤3 playing
  concurrently, reduced-motion → poster until tap.
- **THE DAILY PROPHET RULE (owner 2026-06-12: "like Harry Potter, where there are videos
  as well") — the editorial's locked design principle.** ANY figure slot in the newspaper
  can be a **living picture**: a silent, auto-looping video inside a newspaper frame with
  an old-print caption — motion everywhere, sound nowhere (until tapped: tap = lightbox +
  audio). One mechanic powers every block (generalizes Living Moments): poster-first ·
  IntersectionObserver lazy-mount · loops only while in view · ≤3 playing concurrently ·
  reduced-motion → still until tap. The lead photo, the essay figures, the wall mosaic —
  all of them can move. This is the editorial's uncopyable feel.
- **Three more living blocks (owner 2026-06-12):**
  · **The Room, As It Was Set — seat-plan flyover.** A short (5–10s) aerial glide across
    the couple's PUBLISHED seat plan — photoreal 3D render preferred (0008's Recraft
    pipeline, ~80% built), styled 2D plan as fallback — rendered server-side with the SAME
    FFmpeg zoompan pipeline as the backdrop journey films (single-still → camera move →
    mp4 → R2), framed as a newspaper figure with caption ("The Pavilion as it was set —
    142 seats, 18 tables"). Consumes the PUBLISHED plan only (decoupled from the editor
    rebuild session, same contract as the website's seat-plan reads).
  · **The Look — mood-board block.** The couple's palette + motif as a fashion-editorial
    figure (0010 mood board + dress_code_config palette data already exist); collage
    imagery gets a gentle slow-drift (Ken Burns) under the Prophet rule.
  · **The Wall, Frozen — MUST include videos.** The live-photo-wall recap mosaic
    interleaves the 5s clips with photos; clip tiles silently loop in view — the closest
    literal Daily-Prophet front page on the site. (Wall feed already carries both media
    kinds.)
  · (Thank-You Video + SDE inherit the rule: their blocks show a silent looping preview of
    the film's first seconds in the newspaper frame; tap = full playback with sound.)
- **Maxed-out editorial (all services availed) — canonical inventory.** FREE core: masthead
  + auto-LLM article (drop-cap · pull-quote · byline) · By-the-Numbers (M1-M3 + guests ·
  photos · RSVP%) · The Team vendor credits (Pro/Ent visibility rule) · reviews/testimonial
  wall · cross-phase links (Invitation / Wedding Day) · couple thank-you note · PDF keepsake.
  SKU light-ups: **Papic** → photo essay + Living-Moments 5s clip strip + per-guest tagged
  pickup (QR); **SDE** → "Watch the Film" hero embed; **Thank-You Video** → couple's video
  message block; **Patiktok** → booth-reels row; **Pabati** → guest video-wishes wall;
  **Panood** → ceremony replay block; **Guest Stories** → story-reel row; **Pakanta** → the
  couple's song as page soundtrack + "their song" credit line + scores every rendered film;
  **Animated/Bespoke Monogram** → masthead nameplate mark animates; **High Res Archive** →
  full-gallery delivery banner (originals, 1-year); **Live Photo Wall** → "the wall, frozen"
  recap mosaic. (Live Background = venue hardware; no editorial block.)

- **Edited by:** the **Post-event Interview** (favorite moment, cover-photo pick) enriches
  it; then **edit / approve / regenerate** — all free.

---

## 3. The Setnayan Motion System

A small, preset-driven, **zero-dependency** motion library for the wedding site (built on
`IntersectionObserver` + `rAF` + CSS, extending the existing `Reveal` primitive). Couples
**never tune easing curves.**

### 3.1 Motion-style presets (Settings — themes ALL animations at once)
- **Editorial** — calm fades, slow rises (magazine feel)
- **Cinematic** — scroll-scrub hero, parallax depth (dramatic)
- **Playful** — springy pop-ins, confetti on RSVP-yes
- **Still** — accessibility-first, near-zero motion

Per section, the inspector exposes a tiny **Motion: Subtle · Standard · Lavish · Off** row.

### 3.2 Per-section signature animations
| Part | Signature |
|---|---|
| Hero | Scroll-scrub film + monogram stroke draw-in |
| Greeting | Words fade up line-by-line |
| Countdown | Digits odometer-roll |
| Love Story | Spine line draws; milestones reveal on scroll |
| Schedule | Connecting line draws; "happening now" pulses |
| Dress code | Palette swatches stagger-fan |
| Our Photos | Masonry tiles parallax; tap-to-zoom lightbox |
| Venue | Map pin drops + ripples |
| RSVP | "Yes" → tasteful petals/confetti |
| Editorial | Drop-cap reveal · pull-quote slide · numbers count up |

### 3.3 Premium guardrails (non-negotiable — this is what keeps it tasteful)
- **`prefers-reduced-motion`** snaps everything to final state (already the rule for the
  monogram; becomes the system rule).
- **Mobile gracefully degrades** — scroll-scrub falls back to looping video / keyframe stills
  on low-power devices; never janky.
- **Never blocks load** — motion media lazy-loads; first paint (LCP) stays fast.
- **No autoplay-with-sound, ever** — music + STD video are tap-to-start with a visible mute.

---

## 4. Build order (each step ships something usable)

1. **Inline-edit shell + phase switcher** — turn the launcher into a real editor
   (Select/Edit/Arrange; mobile sheet / desktop inspector; RSVP/Event/Editorial tabs +
   Settings). Fold in the first sub-editor (Hero) as the inline pattern.
2. **Fold the RSVP blocks inline** + turn the phase engine **ON** (`WEBSITE_PHASES_ENABLED`,
   apply the per-phase widget migration PR #1060). Land the **Motion System** + Reveal-on-
   scroll for every RSVP section.
3. **Marquee RSVP effects** — envelope-open · love-story line · photo display styles ·
   STD video. Then the **scroll-scrub cinematic hero** (heaviest; its own PR).
4. **Editorial engine** — newspaper layout + LLM compose + "By the Numbers" + **PDF
   keepsake** + the two interviews. Largest greenfield.

---

## 5. Open items (need owner sign-off — load-bearing)

1. **⚠ Pricing / free-vs-paid is unresolved and load-bearing.** The lifecycle spec says the
   published website becomes **paid** (it wavers between *Basic ₱2,500 / Pro ₱4,500* and
   *per-phase SKUs: Pro RSVP ₱1,999 · Event ₱1,999 · Editorial ₱7,999*), which collides with
   the live homepage's "Start planning · free." **Until settled, the editor has no paywall.**
   This decides which effects are Free vs PRO (proposed tiers above are placeholders).
2. **Effect tiering** — confirm: scroll-scrub hero = PRO · envelope = Standard/Free ·
   love-story = Free · newspaper+PDF = Editorial-SKU/Pro.
3. **Save-the-Date pricing** (carried from lifecycle §7): free upload / ₱49 render / both.
4. **PDF keepsake reach** — couple-only, or every guest can download their copy (recommend:
   every guest, via personal QR — it's a sharing flywheel).

---

## 6. Grounding (verified on `origin/main`, 2026-06-11)
- Editor: `app/site-editor/[eventId]/_components/site-editor.tsx` (launcher); retired
  `app/dashboard/[eventId]/website/page.tsx` redirects here.
- Public site: `app/[slug]/page.tsx` (2173 lines; widget registry `invitation_widgets`).
- Motion primitives present: `app/_components/animated-monogram-hero.tsx` (SVG stroke draw,
  reduced-motion aware), `app/_components/marketing/_motion.tsx` `Reveal` (IO fade+slide),
  `app/onboarding/wedding/_components/welcome-parallax.tsx`. No motion lib in `package.json`.
- PDF: `pdf-lib@^1.17.1` installed; receipts precedent at `app/receipts/[receiptId]`.
- Phase engine: built but **flag-dark** (`WEBSITE_PHASES_ENABLED !== 'true'`); per-phase
  widget migration shipped PR #1060, **not prod-applied** (no consumer yet).
- Data columns present: `events.love_story` (foundation), `our_photos`, `special_message`,
  `landing_page_hero_video_r2_key`, `site_bg_music_*`, `dress_code_config`,
  `photo_moments_config`, `landing_page_visibility`, `monogram_*`.

---

## 7. Differentiators — the "separate us" layer (owner session 2026-06-11)

> Added after a market scan (Joy · Zola · The Knot · Riley & Grey · Bliss & Bone, 2025–26).
> The whole category is the **same machine**: a pretty template + logistics (RSVP/registry/
> info) + light guest engagement (QR→photo-folder, AI copy, companion app). They share three
> blind spots Setnayan can own **because it is the whole event platform, not a website
> builder:** (1) the site **dies** after the wedding — nobody makes a *kept artifact*;
> (2) it's a **brochure, not a story** — no 3-phase lifecycle, no real motion; (3) it's
> **bolted on top of planning** — it knows nothing about the couple's vendors, money, or day.
> Setnayan's unfair feed: Papic (capture) · Pakanta (owned music) · the marketplace + 6-dim
> match (data) · GCash (PH) · the seat plan · the auto-editorial. **Positioning:** *everyone
> else builds a page that helps you run the wedding; Setnayan builds a living film of it —
> it invites, goes live on the day, and becomes a keepsake everyone keeps.*

### 7.1 Per-guest personalization engine — THE headline differentiator
The personal QR + guest record already render a **different site per guest** (InvitationSite
vs PublicLanding; role · side · table · meal · plus-one · tagged photos). No competitor
personalizes past a name. Extend it across all three phases:
- **"Your part in the day" card** — a personal run-of-show: call time · processional cue ·
  table · meal · who they walk with. Sponsors/entourage get a real briefing; guests get the
  essentials.
- **Role-reshaped site** — page reorders by role (sponsors see cord/veil/coin duties;
  out-of-towners see hotel/shuttle first; barkada sees the after-party).
- **Know-your-table with faces** — see tablemates (names + faces + one-line) before arriving.
- **Per-guest Editorial + thank-you** — each guest's recap opens addressed to them, featuring
  *their* tagged photos + reel. One keepsake → N keepsakes.

### 7.2 New-feature stack (scope-expanding · owner sign-off pending)
- **Two-way participation:** RSVP-with-a-memory → pre-wedding love-notes wall + Editorial
  "What they said" · collaborative playlist / song requests (`music_playlist_seed`) · live
  reactions + video well-wishes (Pabati) on the live wall.
- **AI helpers:** per-guest **concierge chat** (answers dress-code/parking/kids from the
  couple's data, guest-aware "you're at Table 12", EN/TL/CEB) · **AI thank-you notes**
  (per-guest, couple's voice) · toast/vow helper fed by the real love story.
- **PH-first depth:** principal-sponsor / ninong-ninang module · Filipiniana ceremony
  explainer (cord/veil/arrhae/candle) · **GCash abuloy / cash gift** (the PH registry).
- **Priority picks (owner's top 3 to separate hardest):** ① "Your part in the day" +
  role-reshaped site · ② per-guest Editorial + thank-you · ③ guest concierge chat.

### 7.3 Seat plan as a LIVE website layer (0008 integration)
The seat plan (published · per-table QR · seat-by-role · 3D photoreal pipeline ~80%, Recraft)
stops being a printout and becomes a live per-guest layer:
- **RSVP:** 3D venue tour from the invitation · know-your-table with faces.
- **Event:** **"Find my seat" in 3D** (upgrades the shipped `/[slug]/find-my-table`) ·
  **table QR = social hub** (who's here · menu · live wall · song request) · **live arrival
  board** (guests tap "I'm here" → seat map fills) · seat-aware broadcasts + flagged needs.
- **Editorial:** "where everyone sat" keepsake map (best photo per table).
- **Uncopyable:** live (never reprinted — editor change updates every guest instantly) +
  3D photoreal + per-table QR + per-guest seat, fused. Prismm's 3D is planner-only; the rest
  ship flat 2D charts.
- **⚠ Cross-session contract:** the seat *editor* is being rebuilt in another session
  (`feat/seating-editor-popup-toolbar`). This is the **read/website side** — it consumes the
  **published seat plan + per-table QR + per-guest assignment**. Build against that published
  contract, NOT the editor's internals, so the two stay decoupled.

### 7.4 On-the-day **service stage** (the Event phase = where owned services light up)
Every purchased in-app service surfaces as a **block on the live page** — not a separate
"services" area. Already modeled as phase-scoped widgets in the registry foundation
(`watch_live`, `live_photo_wall`, `video_guestbook`, `savour_the_moment`, …).

| Service | On-day block | Personalized | Storage |
|---|---|---|---|
| **Panood** (live stream) | "Watch Live" YouTube embed; replay → Editorial | yes (remote/can't-attend) | YouTube only (never Drive) |
| **Papic** galleries | "Your Gallery" = their tagged photos + full gallery, live | yes (per-guest tags) | R2 + Drive copy |
| **Papic Live Wall** (Salamisim) | venue projection mirrored on guest phone | shared | R2 |
| **Pabati** | "Leave a video well-wish" + guestbook wall → Editorial/thank-you | yes (their message) | R2 + Drive copy |
| **Patiktok** | vertical-reel booth | guest-made | R2 |
| **Find my seat** | wayfinding from the seat plan (3D when owned) | yes (their seat) | — |
| **Guest Stories** · Patiktok | story maker / reel booth | guest-made | R2 |
| **SDE / Highlight** | "Watch the film" (Event + Editorial replay) | shared | R2 + Drive |
| **Live Background** (LED) | ⚠ venue-hardware (0005) — **no native guest block**; give it a home 2 ways: (a) configurable from the editor's Event service stage, (b) OPTIONAL mirror its 8K design as the site's **Event-phase backdrop** (reuse the asset → guest-visible echo) | — | venue/USB |

**Coverage check (owner, 2026-06-11) — confirmed answers:**
- **Background music = all phases incl. Editorial.** One shared soundtrack, `site_bg_music_source` = upload OR Pakanta. **Pakanta is special on Editorial:** it's the **only music that can also be the backing track for the produced videos** (SDE · Thank-You Video · highlight reel) because renders are owned-music-only (licensing lock) — an **uploaded track plays as ambient site music but CANNOT legally score a rendered video.** Editor copy: "Use Pakanta and it also becomes your videos' soundtrack."
- **Thank-You = YES on Editorial** — free thank-you note + paid **Thank-You Video** (₱5,499/§2 matrix), **personalized per guest** (§7.1, addressed to them + their photos). The closing beat of the recap.
- **Live Background** is the one service without a native guest block (venue LED) → resolved as above.
- **Not guest-web blocks:** Setnayan AI (planning workspace) · Camera Bridge (DSLR→Papic/Panood enabler) · Mood board (feeds theme) · vendor-side SKUs.

**Three rules:** (1) **Owned-gated** — a block renders only if the couple bought it; guests
**never see upsells** on the live page; the **couple's editor** is the only place unowned
services show an "Add X" card. *(Today these are nav-out cards in `site-editor`; the work is
to render them as real owned-gated guest blocks on the public Event page.)* (2)
**Personalized** — same engine ("Your Gallery", remote-guest stream promotion). (3)
**Storage honored** — Panood = YouTube only; galleries/Pabati = R2 + Drive copy. **Registry
pattern:** any future service plugs in by declaring its phase(s) + guest block — no bespoke
wiring. **Commercial:** the Event page is the payoff surface where the couple sees what they
paid for come alive → word-of-mouth.

### 7.5 SERVICE VISIBILITY MAP v2 — every service, seen at its moment (owner 2026-06-12)
> Owner: *"Panood, photo wall live and the gallery must be on the on-the-day part… can you
> check our app features — we also have Kwento, this needs to be added on the editorial.
> We need to showcase our services and show our services when they need to be seen."*
> Principle locked: **each service appears at the moment it matters — LIVE form on the
> on-the-day page, RECAP form on the editorial.** Same service, two roles, never either/or.

| Service | RSVP (before) | EVENT (on the day) | EDITORIAL (after) | Status |
|---|---|---|---|---|
| Panood | — | **Watch Live** embed (remote guests first) | Ceremony **replay** | block wiring queued |
| Live Photo Wall (Salamisim) | — | **Live wall** — venue projection `/wall/[eventId]` + mirrored guest block | **The Wall, Frozen** — mosaic incl. looping 5s clips | wall CODE BUILT; guest block + frozen recap queued |
| Papic gallery | — | **LIVE gallery** — photos/clips flow in as captured; "Be a candid camera" CTA | Photo essay · **Living Moments** 5s strip · per-guest QR pickup | capture live; blocks queued |
| **Kwento** (guest photo-stories) | — | story capture rides Papic flow | **Kwento block** — approved guest stories as captioned pull-quotes beside their anchor photo, woven through the article + wall; **Kwento Magazine** PDF = keepsake sibling | schema in prod; UI unbuilt |
| Patiktok | — | booth reels row (live) | reels row (recap) | queued |
| Pabati | — | record-a-wish CTA | video-wishes wall | queued |
| Guest Stories | — | story maker | story-reel row | queued |
| SDE | — | (rendered same-day) | **Watch the Film** living frame | queued |
| Thank-You Video | — | — | couple's video message living frame | queued |
| Save-the-Date | **STD video block** | — | — | live (0024 renders) |
| Custom QR / guest | personal invite QR | tagging + pickup QR | per-guest pickup | live |
| Indoor Blueprint / seat plan | know-your-table (planned) | **find-my-table** (live route) | **The Room, As It Was Set** flyover | find-my-table live |
| Monogram (static/animated/bespoke) | hero mark | hero mark | nameplate mark animates | live |
| Music (upload / **Pakanta**) | page soundtrack | (lean page — off) | soundtrack + **scores every film** + credit line | live (music chrome) |
| Mood board / palette | site theme | site theme | **The Look** block | theme live; block queued |
| Spatial backdrop | **the world** (film scrub) | off (venue-WiFi rule) | off (newsprint aesthetic) | LIVE |
| Live Background (LED) | — | venue hardware (no web block; optional Event backdrop echo) | — | spec'd |
| High Res Archive | — | — | originals-delivery banner | queued |
| Camera Bridge | — | enabler (feeds Papic/Panood) | — | core shipped |
| Couple-side only (never guest blocks) | colspan: Setnayan AI · Drive photo-delivery · playlist seed · contracts · supplies · bundles | | | — |

## 8. Notifications model — action-first, cron-light

The personalized/day-of pings (coordinator broadcast · seat-change · tag · RSVP · call-time ·
deadline · editorial-launch) split into two kinds:
- **Action-triggered** (someone does the thing) → fire **in the request** via Next 15
  `after()`/`waitUntil`. **No cron.** Covers most day-of magic.
- **Time-triggered** (a clock time arrives — call-time reminder, RSVP deadline, T+3d editorial)
  → need a timer, but **not a polling cron**: schedule **one delayed message** when the time
  is set.

**Reach ladder (graceful degrade):** native app (Capacitor → APNs/FCM, best; needs the
`@capacitor/push-notifications` plugin wired — currently pending) → installed PWA (Web Push;
iOS 16.4+ only if Added-to-Home-Screen → nudge install at RSVP) → email (Resend) + in-app
banner. **No SMS in V1.**

**Cost (owner asked):** essentially ₱0 at pilot. Push delivery is **free** by the providers
(APNs/FCM/Web Push charge nothing, any volume). The cron is a tiny heartbeat query. Only
**email scales** (Resend: free to 3k/mo, ~₱1,100/mo for 50k) — and push *reduces* it.
**Recommendation:** `pg_cron` in Supabase (₱0, in-stack, a 1-min tick draining a "due" table —
the old no-cron concern was waste + nothing-wired, both moot here) **OR** QStash one-shot
(no polling, pennies, adds a vendor). Default = `pg_cron`.

## 9. Open items added 2026-06-11 (need owner sign-off)
- **§7.2 feature stack is scope-expanding** beyond locked V1 — confirm which land in V1 vs V1.x.
- **Notification scheduler choice:** `pg_cron` (relaxes the no-cron lock) vs QStash one-shot.
- **GCash abuloy / cash gift** — is a couple-facing gift registry in V1 scope? (new surface.)
- Carries forward §5's load-bearing **website free-vs-paid pricing** (gates every Free/PRO tier).
