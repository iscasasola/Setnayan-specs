# Wedding Attire Guide · AI Generation Prompt Spec

**Owns:** prompt-template + per-role parameter table + per-style modifier list + generation workflow for the **50-figure Wedding Attire Guide clipart library** (5 style themes × 10 RoleKey entries).

**Status:** Phase 1 infrastructure shipped (locked 2026-05-23 PM third pass). Phase 2 generation is owner-gated on Recraft API key procurement.

**Cross-references:**

- CLAUDE.md 2026-05-21 row "Moodboard expanded · 3 pillars" — Dress codes pillar lock + asset sourcing 3-phase strategy
- CLAUDE.md 2026-05-22 row 5 — Specialized Pro Tools (Professional Mood Board pay-per-render at ₱167-₱199/render, ~95% margin)
- CLAUDE.md 2026-05-23 row "Wedding Attire Guide arc" — full PR lineage (PRs #449 / #451 / #453 / #455 / #457 / this work)
- Iteration [0010 Mood Board](../0010_mood_board/0010_mood_board.md) — Dress codes pillar + Color Range Manipulator architecture
- Iteration [0037 Bespoke Monogram](../0037_bespoke_monogram/0037_bespoke_monogram.md) — sibling AI-generation iteration (DALL-E 3 + vectorizer.ai), different SKU but same generation-pipeline pattern
- `apps/web/lib/recraft.ts` — Recraft API client (ships in same PR as this doc)
- `apps/web/scripts/generate-attire-guide-figures.ts` — generation script that consumes this prompt template
- Migration `20260613000000_iteration_0010_attire_guide_style_theme_column.sql` — schema that holds the generated assets

---

## Generator pick + cost

**Generator: Recraft V3+ (model `recraftv4_1_vector`)** — native SVG output, no raster→vector conversion step needed. Picked via AskUserQuestion 2026-05-23 PM over DALL-E 3 + vectorizer.ai. Recraft V3+ produces clean flat-illustration vector aesthetics out-of-box; DALL-E + vectorizer.ai adds artifacts on facial detail that compound across a 50-figure library.

**Cost per generation:** $0.08 / SVG (80 API units · pre-purchased at $1 / 1000 units).
**Full library cost:** 50 SVGs × $0.08 = **$4 one-time** for the initial library. Add ~$2-4 for iteration / regeneration of low-quality figures = **$6-8 total budget** for the V1 cutover.

**Setnayan-owned IP:** Recraft's commercial-use terms allow Setnayan to own the generated SVGs outright. No attribution required. No ongoing licensing fee per render.

---

## The 5 style themes

Maps 1-to-1 to the `STYLE_OPTIONS` const in `apps/web/app/dashboard/[eventId]/add-ons/mood-board/_components/wedding-attire-guide.tsx`. Each style gets one full set of 10 figures.

| Style key (DB) | UI label | Visual register | Style modifier phrase for prompt |
|---|---|---|---|
| `elegant · simple · classic` | Elegant · Simple · Classic | Refined editorial · subdued palette · clean lines | "sophisticated editorial illustration, refined and minimal, subdued color palette with cream + ink + single accent, magazine-clipping aesthetic" |
| `bridgerton · regal` | Bridgerton · Regal | Period-romance · rich jewel tones · ornate detail | "Regency-era period illustration, romantic Bridgerton aesthetic, rich jewel-tone color palette with burgundy and gold, ornate but flat-vector-style detail" |
| `editorial cream` | Editorial Cream | Wedding-magazine sophistication · cream + blush + gold | "wedding-magazine editorial illustration, sophisticated cream + blush + champagne-gold palette, soft refined aesthetic, neutral tones with one warm accent" |
| `tropical heritage` | Tropical Heritage | Filipiniana cultural rootedness · piña + abaca + tropical greens | "tropical Filipino heritage illustration, abaca + piña textile inspiration, warm greens and earthy ochres, cultural rootedness, Filipiniana embroidery hint" |
| `modern minimalist` | Modern Minimalist | Stark contemporary · two-tone · architectural | "modern minimalist illustration, two-tone bold palette, stark contemporary aesthetic, architectural clean lines, no ornamentation" |

---

## The 10 RoleKey entries

Mirrors the `RoleKey` union in `wedding-attire-guide.tsx`. Each role gets one figure per style theme (so 10 × 5 = 50 total figures).

| RoleKey | UI label | Pose | Attire base | Default tint | Ethnicity precision | Attire detail |
|---|---|---|---|---|---|---|
| `bride` | Bride | standing front-facing, hands holding small bouquet at waist | wedding gown, A-line silhouette, fitted bodice, soft veil flowing behind shoulders | `#FAFAFA` off-white | Filipina, warm brown skin, dark brown hair past shoulders | small white-and-blush bouquet at waist, modest scoop neckline, no train (figure clarity) |
| `groom` | Groom | standing front-facing, hands at sides | barong tagalog over black trousers, traditional Filipino embroidery panel down center front | `#E8D9B8` cream | Filipino, warm brown skin, short black hair | small ribbon boutonniere at left chest, formal black trousers, formal black leather shoes |
| `bridesmaids` | Bridesmaids | standing front-facing, holding small posy bouquet at waist | matching A-line bridesmaid gown, sleeveless, knee-length, soft skirt flare | `#7E1F32` burgundy (role tint placeholder) | young Filipina, warm brown skin, dark hair half-up | small matching posy bouquet, simple round neckline, low-heel pumps |
| `groomsmen` | Groomsmen | standing front-facing, hands at sides | tailored navy two-piece suit, crisp white dress shirt, narrow tie matching bridesmaid color | `#2E3F5C` navy | young Filipino, warm brown skin, short black hair | small boutonniere at lapel, tucked shirt, polished black shoes |
| `female_ps` | Female Principal Sponsors | standing front-facing, hands clasped at waist | formal Filipiniana terno gown with classic butterfly sleeves, full-length, refined sash | `#D4B896` champagne | mature Filipina (50s), warm brown skin, hair styled up | shawl draped over one arm, small clutch, formal heels |
| `male_ps` | Male Principal Sponsors | standing front-facing, hands at sides | embroidered barong tagalog with prominent piña-textile pattern, formal black trousers | `#E8D9B8` cream | distinguished Filipino (50s), warm brown skin, salt-and-pepper hair | gold lapel pin, formal black leather shoes |
| `mothers` | Mothers | standing front-facing, slight smile | midi-length formal dress with elegant shawl draped over shoulders, modest sleeves | `#C5C8CC` silver-gray | mature Filipina (60s), warm brown skin, hair styled simply | small clutch, low-heel formal pumps |
| `fathers` | Fathers | standing front-facing, hands at sides | barong tagalog (mature gentleman cut), formal black trousers | `#E8D9B8` cream | mature Filipino (60s), warm brown skin, short white-gray hair | formal black leather shoes |
| `guests` | Guest women | standing front-facing | knee-length cocktail dress, fitted bodice with soft skirt | `#7E1F32` burgundy (role tint placeholder) | young Filipina, warm brown skin, dark hair styled simply | small clutch, formal heels |
| `men_guests` | Guest men | standing front-facing, hands at sides | long-sleeve polo or guayabera-cut shirt, dress trousers, no tie | `#B8DCE8` light blue | young Filipino, warm brown skin, short black hair | tucked-in shirt, formal leather shoes, smart casual register |

---

## Canonical prompt template

This template combines all the above into a single Recraft-tuned prompt. Substitute the bracketed placeholders per role × style.

```
A flat vector illustration of {ETHNICITY_PRECISION}, {POSE}, full body view,
centered composition on plain white background. Wearing {ATTIRE_BASE} in
{DEFAULT_TINT}. {ATTIRE_DETAIL}.

Style: {STYLE_MODIFIER_PHRASE}. Clean flat-illustration aesthetic, solid
blocks of color with crisp clean outlines, no gradients, no photographic
shading, no noise, no textures, no shadows. Bold simple geometry. Single
subject, no background scene elements.

Color regions must be flat and distinct for clean vector output:
- skin = warm brown #C68864
- hair = dark brown-black #3A2B20
- attire dominant = {DEFAULT_TINT}
- accessories = subtle accent color of the prompt's style modifier

Output: single figure centered on the canvas, suitable for SVG vector
rendering. Tall portrait aspect.

Negative: photorealism, gradients, shadows, noise, texture, multiple
figures, busy backgrounds, watermarks, text, signatures, low-resolution
artifacts, anime style, manga style, hyperrealistic style.
```

**Recraft API call shape:**

```ts
generateVectorSvg({
  prompt: filledTemplate,
  style: 'vector_illustration',
  substyle: 'flat_2',  // start with flat_2; iterate to 'tablet_sketch' or
                       // 'engraving_color' if flat_2 quality is insufficient
  size: '1024x1024',
  model: 'recraftv4_1_vector',
});
```

---

## Critical prompt-engineering rules

The prompt template above looks straightforward but each phrase pulls a specific lever in the generator. Removing any of these phrases will degrade output quality measurably.

1. **"Flat blocks of color with crisp clean outlines"** — single biggest lever for clean SVG output. Without it, Recraft defaults to a softer painterly aesthetic that vectorizes with visible gradient artifacts.

2. **"No gradients, no shadows, no noise, no textures"** — four negative phrases that together prevent the most common vector-killing artifacts. "No noise" specifically prevents the speckle texture Recraft sometimes adds to flat areas.

3. **Style modifier phrases (per the 5-style table)** — explicit aesthetic anchors per style. Generic "wedding clipart" prompts produce generic-clipart-aesthetic output across all 5 styles, defeating the style-set purpose. The modifier phrases are tuned to push Recraft toward visibly distinct aesthetics per set.

4. **Explicit hex codes for skin / hair / attire** — gives the Color Range Manipulator engine (V1.x feature) known regions to target. The seed migration that populates `moodboard_asset_color_ranges.sampled_hex` for slot 1 should use the `{DEFAULT_TINT}` value verbatim so the runtime recolor swap is well-targeted.

5. **"Single subject, no background scene elements"** — produces transparent-bg-ready output that composites cleanly over the canvas backdrop in the WAG component. Without this, Recraft sometimes generates ambient scenery (flowers / venue suggestions / patterns) that conflict with the WAG canvas backdrop.

6. **"1024×1024 canvas, single figure centered, tall portrait aspect"** — predictable output dimensions for the seed migration's expected width/height ratio. Different sizes per role would require per-row CSS overrides in the WAG renderer.

7. **Negative list at the end** — vector tools especially benefit from "what NOT to render" as much as "what to render." The negative phrases for "anime style, manga style, hyperrealistic" anchor away from common quality-detractor aesthetics.

8. **Ethnicity precision phrasing** — "warm brown skin, dark brown hair" produces consistent results; "Filipino" alone is ambiguous to Recraft (the model has variable interpretation of nationality-as-visual-feature). Explicit skin + hair color hex codes in the body of the prompt reinforce the ethnicity phrase.

---

## Workflow

### Phase 1 (this PR, ships infrastructure)

1. **Migration `20260613000000`** adds `style_theme TEXT` column to `moodboard_library_assets` with CHECK constraint matching the 5 style keys + partial index for fast (subtype, style) lookup.
2. **`apps/web/lib/recraft.ts`** — minimal fetch wrapper for the Recraft API.
3. **`apps/web/scripts/generate-attire-guide-figures.ts`** — executable tsx script that loops 5 × 10 = 50 generation calls, downloads SVGs, uploads to R2, prints seed-SQL to stdout for human review.
4. **This spec doc** — prompt template + per-role + per-style parameter tables.
5. **`.env.example`** — adds `RECRAFT_API_KEY=` entry with comment.
6. **WAG component** — accepts new `assetsByRoleAndStyle` nested map prop, resolves `(role, current_style)` at render time with default-style fallback.

### Phase 2 (owner-gated, ships content)

1. **Owner action:** sign up at https://www.recraft.ai/ · purchase ~$10 of API units (4000 units → covers ~50 vector generations with iteration room) · generate API key under Account → API Tokens · paste into Vercel env `RECRAFT_API_KEY` AND local `.env.local`.
2. **Run generation script** — `pnpm -F web tsx scripts/generate-attire-guide-figures.ts` (estimated ~5-10 min for 50 calls; Recraft rate-limits to ~30 req/min on the free tier, slower if backoff kicks in).
3. **Review generated SVGs** — script writes a preview HTML page to `/tmp/recraft-preview.html` with all 50 figures laid out for visual review. If any are off-aesthetic, mark them in the script's regeneration-targets file and re-run that subset.
4. **Approve seed migration** — script's stdout SQL is the new `20260614000000_iteration_0010_attire_guide_recraft_seed.sql` migration. Owner / Claude reviews the SQL + commits + pushes to prod via `supabase db push --linked`.
5. **Hard-refresh live site** — confirm the new figures render on `/dashboard/{eventId}/add-ons/mood-board` Wedding Attire Guide section + that clicking a style chip swaps the figure set (not just the canvas backdrop).

### Phase 3 (post-launch refinement, V1.x)

1. **Stylist marketplace launch** (per 0047 sequencing) → stylist persona unlocks. Stylists can override the V1 Recraft seed with their own curated sets via `/admin/moodboard-library` + the existing library editor / color-range manipulator surfaces.
2. **Color Range Manipulator engine** (per CLAUDE.md 2026-05-22 row 5) → server-side canvas HSL substitution keyed on `moodboard_asset_color_ranges.sampled_hex`. Replaces the CSS `mix-blend-mode` hack in the WAG with region-specific recoloring (skin / attire-dominant / accessories all swap independently).
3. **Professional Mood Board SKU** (₱167-₱199/render at the locked pricing) → couples can generate their own bespoke figure sets via the same Recraft pipeline, billed per render.

---

## Open questions for next pass

1. **Substyle iteration loop:** the script uses `substyle='flat_2'` as the default. Recraft offers other vector_illustration substyles (`tablet_sketch`, `engraving_color`, `cartoon_outline`, etc.) — should the V1 library mix substyles per style theme, or stay uniform on `flat_2`? Recommend uniform for V1 simplicity; experiment in V1.x.
2. **Size variants for different roles:** the bride probably benefits from `1024×1707` (taller portrait) for the gown's full sweep; the guests probably look fine at `1024×1024`. V1 uses uniform `1024×1024` for layout simplicity; V1.x adds per-role size overrides.
3. **Multi-figure prompts:** the owner's reference images show some figures as couples (bride + groom together). The current spec generates single figures and composes them in the WAG layout. Multi-figure prompts (e.g., "bride and groom standing together") are an option for V1.1+ if owner wants the composed-couple aesthetic baked into the asset.
4. **Style-set bridging assets:** when the host's picked style is `bridgerton · regal` but the wedding's ceremony_type is `civil`, should the bride figure still show the regal-style gown? Likely yes (style is host aesthetic preference, ceremony_type is event reality), but worth confirming with owner before V1.x stylist marketplace launches.

---

## Acceptance criteria (V1)

- [ ] Migration `20260613000000` applies cleanly to prod via `supabase db push --linked`.
- [ ] `apps/web/lib/recraft.ts` exports `generateVectorSvg` with typed args + result.
- [ ] `apps/web/scripts/generate-attire-guide-figures.ts` runs end-to-end with `RECRAFT_API_KEY` set, produces 50 SVGs uploaded to R2 + a seed-SQL stdout dump.
- [ ] Generated SVGs each weigh < 50KB (acceptable for browser hot-link; if over, run through SVGO compression step).
- [ ] WAG component renders Recraft figures filtered by active style; falls back to `editorial cream` style figures when current style has no asset; falls back to SVG silhouette when no asset at all.
- [ ] Per-role color picker still tints the figure (via the existing CSS `mix-blend-mode` overlay path in the PhotoFigure renderer from PR #455).
- [ ] Style picker chips visibly swap the figure SET, not just the canvas backdrop.
- [ ] Generated SVGs are visually distinct across the 5 style themes (visually-tested by Setnayan team in a /tmp preview HTML before seed migration commits).

---

## Out-of-scope explicitly (V1)

- Per-role per-style multi-figure renderings (e.g., 3 bridesmaid variants per style for visual variety) — V1.1+
- Animated SVG output (Lottie / SMIL) — out of scope, not what Recraft generates
- Per-wedding bespoke figure generation (couple uploads photo of themselves, Recraft adapts) — V1.x Professional Mood Board SKU territory
- Bilingual prompt support (Tagalog/Cebuano prompt phrases) — Recraft is English-prompt-only, no plan to translate
- Auto-regeneration on prompt-template change — V1 is one-shot generation; V1.x can add an admin-trigger regen button per row
