# Monogram Maker — Unified Plan (Static Maker + Animation Picker)

> **Status: PLAN · no code yet.** Authored 2026-06-05 after the owner asked to "search for the plan for monogram maker and make a page for it if non-existent." None existed — this consolidates the shipped reality, the two maker prototypes, and the new 23-treatment animation picker into one build-ready spec. Build is the follow-on (phased sequence in § 9).

---

## 0. TL;DR

We already have (a) a **static monogram maker** (prototyped twice; partly shipped as `events.monogram_*` columns + the Website-tab settings) and (b) a paid **Animated Monogram** SKU that binds exactly **one** animation. The plan: make the animation a **choice** — a picker of curated treatments (the 23 shortlisted in `~/Downloads/monogram-demo/`) — persisted per event and rendered everywhere the monogram appears. For the **web** surfaces this is a direct CSS/SVG port; the **video** surfaces (AI Highlight, SDE, Save-the-Date, LED) need Lottie/Remotion re-authoring later. This is a **scope expansion of a shipped SKU** → needs a Cowork reconciliation (§ 8) and owner sign-off before code.

---

## 1. What exists today (grounded in `~/apps/web` + corpus)

### 1a. Shipped (the source of truth — `apps/web`)
- **Free text monogram on every event.** Initials (e.g. `M & J`) in an italic serif inside a bordered circle, from `events.monogram_text` + `monogram_color`. Resolver: `lib/monogram.ts` (`resolveMonogram`). Rendered in dashboard chrome (`EventMonogram`), the QR center, and the public wedding hero.
- **Customisation columns already present** on `events`: `monogram_text`, `monogram_color`, `monogram_font_key`, `monogram_frame`, `monogram_frame_key`, `monogram_updated_at`. So **font + frame + colour are already first-class** — the animation key is the natural sibling.
- **Paid `ANIMATED_MONOGRAM` SKU (₱2,499 · v2 catalog).** Binds exactly ONE animation: `app/_components/animated-monogram-hero.tsx` — an SVG stroke **draw-on → ink-fill** (~3s, plays once, settles, honours `prefers-reduced-motion`, uses the couple's `monogram_color` inline). Rendered on:
  - the add-on/marketing page `app/dashboard/[eventId]/add-ons/animated-monogram/page.tsx` (buy + preview), and
  - the **public wedding hero** `app/[slug]/page.tsx`.
  - Ownership gate: `lib/animated-monogram.ts` (`eventOwnsAnimatedMonogram`).
- **No style choice exists.** The animation is hard-coded to that one trace. → the 23 turn this single upgrade into a **picker**.
- **Onboarding already cycles monogram *designs*.** The wedding onboarding restyles through 5 `MONO_DESIGNS` lockups (tap or every 30s — decision log 2026-06-05). Appetite for "the monogram moves" is already live; this plan generalises it.

> **SKU disambiguation (load-bearing — do not conflate):**
> - `ANIMATED_MONOGRAM` (₱2,499 · this plan) — animates the auto **text** monogram. No upload, no media background.
> - `monogram_hero_upgrade` (₱1,999 · iteration 0004 "Monogram Hero") — a **widget** upgrade adding a custom video/photo background + SVG/PNG upload via Potrace, gated through `invitation_widgets.tier`. **Out of scope here.**

### 1b. Prototyped in the corpus (not fully shipped)
- **`Monogram_Lab_2026-06-01.html`** — the **static maker**: 12 frames (`assets/mono/*.webp` — none/wreath/crest/oval/square/flourish/art_deco/laurel/baroque/ribbon/botanical/deco_diamond), 5 fonts (cormorant/playfair/cinzel/script/marcellus), 4 inks (mulberry/gold/ink/white), per-glyph **X/Y/size** sliders + spacing, and a "values to bake into the build" readout. **No animation layer.**
- **`0011_panood/0011_monogram_maker_prototype.html`** — "Pro Monogram Maker (prototype)", font-led. Also static.

### 1c. Separate and unbuilt
- **`0037_bespoke_monogram/`** — the **DALL-E bespoke-image** maker (brief → generate → refine loop, routes `/bespoke-monogram*`). **These routes are NOT in the shipped app.** Different feature; do not merge into this plan beyond § 8 reconciliation.

### 1d. The animation library (this session)
- `~/Downloads/monogram-demo/` — `gallery.html` (12) · `gallery2.html` (17) · `gallery3.html` (20) · `shortlist.html` (the **23 keepers**) · served at `http://localhost:8910/`. Palette = Clean Editorial (gold `#C5A059`, mulberry `#5C2542`, alabaster `#FBFBFA`). CSS/SVG loops, every 4s.

---

## 2. Target — the unified Monogram Maker

One maker, two layers:
1. **Static mark** (already modelled): names → initials, **font**, **frame**, **ink colour**, per-glyph nudge.
2. **Animation** (NEW): pick **how it reveals/moves** from the curated library; persisted; rendered on land.

The couple's selections live on the event and drive every monogram surface. The Animated Monogram SKU stops being "you get the trace" and becomes "you get to choose how your monogram comes alive."

---

## 3. The animation library — 23 treatments + the forks

The demos cheat on three things that must be resolved to be product-true:

### Fork A — Colour (the big one)
The hero uses the couple's **single** `monogram_color`. Treatments split:
- **Honours-your-colour (17)** — recolour cleanly to `monogram_color`: Trace · Fade & rise · Letter by letter · Bloom · Ink bleed · Unveil · Drop & settle · Spotlight · Mirror split · Interlock · Card flip · Magnetic snap · Type stamp · Bokeh focus · Smoke form · Frost thaw · Curtain part.
- **Metallic / material finish (6)** — intrinsically gold/material; ship as a **finish** that overrides the ink (or recolour where it makes sense): Gold shimmer · Living gold · Foil emboss · Liquid gold · Capiz sheen · Wax seal (medallion can take `monogram_color`; lettering stays gold).
→ **Decision needed:** do the 6 finishes override colour, or offer "recolour vs gold finish" per treatment? (Recommend: finishes override, labelled clearly as "gold finish.")

### Fork B — Loop → one-shot
Demos loop infinitely (gallery comparison). In-product each treatment plays **once on land, then holds the static monogram**. Every treatment already has a settle frame (proven by the `?freeze` still). Mechanical: strip `infinite`, end on the settled keyframe, `key`-remount to replay (as `AnimatedMonogramHero` already does).

### Fork C — Hero size (~80px)
Most of the 23 are type-centric and read fine at 80px. **Validate at hero size:** Smoke form, Bokeh focus, Wax seal (medallion detail). The big-surface particle ones (confetti, rays, laurel, ribbon) were **not** shortlisted — good. Any that fail at 80px become "big-surface only" (Save-the-Date / video), still selectable but previewed at size.

### Fork D — Frame + font interplay
The circle ring, `monogram_frame_key`, and `monogram_font_key` compose with the animation. Two notes: (1) some treatments **are** a frame (Wax seal = medallion; would replace the ring) — decide compose-vs-replace; (2) script treatments need **Great Vibes** loaded (perf — preload per onboarding golden rules).

---

## 4. Data model

**Existing & adjacent columns (do not duplicate).** The static mark already spans `monogram_text`, `monogram_color`, `monogram_font_key`, `monogram_frame`/`monogram_frame_key`. **Plus** an unapplied, out-of-order migration `supabase/migrations/20260817000000_event_monogram_style.sql` (in worktree `~/wt-mp`, **not yet on prod** — owner to deploy) adds:

```sql
events.monogram_style TEXT
  CHECK (monogram_style IS NULL OR monogram_style IN ('bar','script','duo','framed','infinity'));
-- The 5 onboarding LOCKUP designs (mirrors MONO_DESIGNS in app/onboarding/wedding +
-- lib/monogram.ts). NULL → fall back to monogram_frame_key + monogram_font_key (pre-2026-06-04).
```

So `monogram_style` is the **lockup/layout** dimension (the 5 `MONO_DESIGNS` presets that already auto-restyle every 30s in onboarding). It is **orthogonal** to animation. The static model is converging on these 5 lockups (the Lab's 12-frame model is the legacy fallback).

**New column for this plan** — the *animation* dimension, a sibling to the lockup/font/frame keys, default = current behaviour for back-compat:

```sql
alter table public.events
  add column monogram_animation_key text not null default 'trace';
-- 'trace' = today's shipped draw-on → every existing owner is unchanged.
-- DISTINCT from monogram_style: style = which lockup, animation_key = how it moves.
```

> **Sequencing note:** apply `20260817_event_monogram_style` first (it's already written and pending), then add `monogram_animation_key`, to avoid a second out-of-order migration on the same table.

RLS: `events` is already RLS-enabled; the couple-own write path (the maker action / Website tab) sets it. No new policy.

**Optional but recommended — admin-governed catalog** (enables curation without a deploy; the 3-actor "admin" surface):

```sql
create table public.monogram_animation_styles (
  key            text primary key,         -- 'trace','wax_seal',...
  label          text not null,            -- "Wax seal"
  family         text not null,            -- 'motion'|'light'|'material'|'reveal'|'finish'
  finish         boolean not null default false,  -- overrides ink colour
  hero_ok        boolean not null default true,   -- legible at ~80px
  enabled        boolean not null default true,
  sort_order     int  not null default 0
);
-- RLS: public read (enabled only); admin write (is_admin()).
```

The picker reads `enabled` styles; admin (0023) toggles availability / featured / order / copy.

---

## 5. Rendering surfaces — the medium split

| Surface | Medium | This plan |
|---|---|---|
| Public wedding **hero** (`app/[slug]/page.tsx`) | **CSS/SVG (React)** | Direct port — primary target |
| Dashboard chrome / event switcher (`EventMonogram`) | CSS/SVG | Same registry, smaller size (or static for chrome) |
| QR center · gallery chrome | SVG/static | Static settled mark (animation optional) |
| AI Highlight · SDE · Save-the-Date · LED | **Rendered video (MP4)** | **Lottie/Remotion re-author — LATER**, keyed off the same `monogram_animation_key` |

**Key correction to earlier framing:** for the hero (what the SKU sells today) these CSS treatments are the right medium — **not** Remotion/Lottie. Lottie matters only when the monogram is baked into an MP4.

**Implementation shape:** refactor `AnimatedMonogramHero` from one hard-coded trace into a **keyed registry**:
```
MONOGRAM_ANIMATIONS: Record<AnimationKey, (props:{text,color,size,finish?}) => JSX>
```
Each treatment = a small client component (one-shot, colour param, reduced-motion snap). `AnimatedMonogramHero` selects by `event.monogram_animation_key`. The current trace becomes the `'trace'` entry (zero behavioural change for existing owners).

---

## 6. Three-actor architecture

- **Couple (customer).** Maker/picker on the Animated Monogram add-on page (owned). Live preview at hero size; pick → persists `monogram_animation_key` → renders on their hero + chrome. Non-owners see a **teaser** (a few styles cycling) + the existing `InlineCheckoutDrawer` buy CTA. The free static monogram is never gated.
- **Admin (Setnayan).** Governs the **library** via `monogram_animation_styles` (enable/feature/reorder/relabel) in the 0023 admin console; pricing stays in `v2-catalog`. No per-event admin action needed.
- **Vendor.** None — first-party Setnayan service (`is_setnayan_service`).
- **Connections.** Couple pick → event row → public hero + chrome consume it now; the same key feeds the video surfaces later. Cross-link: onboarding `MONO_DESIGNS` restyle can preview the chosen animation.

---

## 7. Where the page lives

- The **maker/picker UI** belongs on `app/dashboard/[eventId]/add-ons/animated-monogram/page.tsx` (today a buy/marketing page) — it becomes the **maker** for owners (static config handoff to the Website tab where it already lives + the new animation picker), and keeps the teaser+buy for non-owners.
- Static config (names/font/frame/ink/nudge) already partly lives in the **Website tab** (`dashboard/[eventId]/website`) + the two prototypes; § 8 calls for consolidating those into one canonical maker.
- If "make a page" meant a **net-new app maker page** rather than this plan doc: § 9 is its spec — say the word and I build it.

---

## 8. Spec reconciliation (Cowork — flagged, not yet done)

This expands a shipped SKU, so the corpus must catch up:
1. **`0037`** — currently the bespoke DALL-E path (unbuilt). Decide: (a) **re-scope 0037** to the shipped text-maker + animation picker (recommended — matches reality), or (b) keep 0037 as the future bespoke path and slot the animation picker into its own iteration. Owner call.
2. **v2.1 brief § 5** — "Your initials, drawn live" (single trace) → "**pick how your monogram animates** — N curated styles."
3. **Maker prototypes** — fold `Monogram_Lab_2026-06-01.html` + `0011_monogram_maker_prototype.html` into **one** canonical maker spec (the Lab is the stronger base: frames + fonts + inks + per-glyph nudge).
4. Log all of the above via the decision log + `.md`/`.docx` per COWORK.md.

---

## 9. Build sequence (phased — each shippable)

- **Phase 0 — product-true treatments (de-risk, no app).** Port the 23 to honour an arbitrary colour, play once-then-settle, and read at ~80px. Resolves Forks A–C where they're visible. Stays in `~/Downloads/monogram-demo/` or a branch.
- **Phase 1 — schema.** `events.monogram_animation_key` (+ optional `monogram_animation_styles` catalog). Migration applied via `supabase db push`.
- **Phase 2 — keyed render.** Refactor `AnimatedMonogramHero` → registry; implement the **17 honours-colour** treatments first (one-shot + reduced-motion).
- **Phase 3 — picker UI.** Maker/picker on the add-on page (owned) + persist action; teaser for non-owners; hero reads the key.
- **Phase 4 — finishes.** The 6 metallic finishes + the colour/finish UX.
- **Phase 5 — admin catalog.** Governance surface in 0023.
- **Phase 6 — video (later).** Lottie/Remotion authoring for AI Highlight / SDE / Save-the-Date / LED, keyed off the same `monogram_animation_key`.

---

## 10. Open decisions for the owner

1. **Colour:** 6 finishes override ink (recommend) vs per-treatment recolour-or-finish toggle.
2. **Frame:** animation composes with the frame, or treatments like Wax seal **replace** it?
3. **0037:** re-scope to reality vs keep bespoke separate (§ 8.1).
4. **Admin catalog table:** build the governance table (recommend) vs ship all 23 hard-coded.
5. **Hero-size validation:** confirm Smoke / Bokeh / Wax seal at 80px, or mark them big-surface-only.
6. **"Make a page":** this plan doc (done) vs also build the app maker page now (Phase 1–3).

---

## 11. Source artifacts

- **App:** `apps/web/app/dashboard/[eventId]/add-ons/animated-monogram/page.tsx` · `apps/web/app/_components/animated-monogram-hero.tsx` · `apps/web/app/[slug]/page.tsx` · `lib/monogram.ts` · `lib/animated-monogram.ts` · `events.monogram_*` columns · `EventMonogram` · onboarding `MONO_DESIGNS`.
- **Corpus:** `Monogram_Lab_2026-06-01.html` · `0011_panood/0011_monogram_maker_prototype.html` · `0037_bespoke_monogram/` · `assets/mono/*.webp` · v2.1 brief § 5.
- **Demos:** `~/Downloads/monogram-demo/{gallery,gallery2,gallery3,shortlist}.html` (served at `http://localhost:8910/`).
