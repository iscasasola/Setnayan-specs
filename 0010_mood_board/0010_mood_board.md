# Iteration 0010 — Mood Board (Palettes V1)

**Iteration number:** 0010
**Topic:** Mood Board V1 — coordinated wedding palettes for roles and venues, with the Setnayan Guide rule engine
**Surface:** Setnayan Web → Couple Dashboard · **Bottom-nav tab: In-App Services** · URL: `setnayan.com/dashboard/[event-id]/services/mood-board`
**Builds on:** 0000 (app shell, sign-in, event-scoped URL, In-App Services launcher), 0001 (role taxonomy, per-role guest assignments), 0006 (vendor records — V1 non-blocking context)
**Status:** Drafted 2026-05-09 (supersedes the 2026-05-08 partial placeholder)
**Companion specs:** `0001_creating_guest_list/`, `0006_vendors_management/` (vendor coordination context)

---

## What this iteration ships

The Mood Board V1 is a **palette-only** surface — the place where the couple defines the colors for every role on their guest list and every part of their venue, with a curated rule engine ("Setnayan Guide") that nudges them toward a cohesive, photograph-friendly wedding aesthetic.

V1 scope is deliberately narrow. The 2026-05-08 partial placeholder spec captured a much broader vision (inspirations paste board, role outfit galleries, venue segments with 10 photos + 10 videos, concept-vs-actual comparison, stylist persona). All of that is **deferred** until a stylist persona exists in the system. V1 ships what the couple can manage themselves.

Specifically delivered:

- **Role palettes** — every role on the guest list (from 0001) gets a palette: Bride, Groom, Bride's parents, Groom's parents, Maid of Honor, Best Man, Bridesmaids (Team Bride), Groomsmen (Team Groom), Principal Sponsors, Secondary Sponsors, Bearers, Flower Girls, plus any custom roles the couple has added in 0001.
- **Venue palettes** — Church, Reception, Cocktail by default. Couple can add custom venue palettes (Photo wall, Stage, After-party, Suite prep room, etc.) with a free-form label.
- **Six colors per palette** — hard cap. Each color is a `{hex, name, position}` triple.
- **Three input paths per color:** hex code typed, native browser color picker swatch, or color name autocomplete from the Setnayan-curated library.
- **Image extraction** — couple uploads a reference image, Setnayan runs a Cloudflare Workers pipeline to extract the dominant 5–8 colors, couple picks which to add. The image stays attached as a reference image on the palette.
- **20 pre-template palette themes** — Setnayan-curated coordinated wedding palette packs the couple can pick to seed all their role + venue palettes at once, then tweak.
- **Setnayan Guide rule engine** — runs on every palette change, surfaces warnings and contradicts (block-with-suggestions) when the colors won't work. Override toggle per event.
- **Master palette** — auto-compiled, read-only. Deduplicated by exact hex AND named color. Shows the wedding's overall color story with badges indicating which palettes reference each color.
- **Reference images per palette** — 1–3 images stored in R2 (extracted source images count toward this).
- **Saved palettes library** — couple can save custom palette compositions for reuse across roles or events. V1 is couple-scoped; schema extensible for future stylist scoping.
- **Copy from existing palette** — quick-start mechanism. Couple picks "Copy from [existing role/venue palette]" to seed a new palette, then customizes. Snapshot, not link — edits don't propagate.
- **Mobile thumb-zone UX** — all primary touch targets in the lower third of the mobile screen.

This iteration does NOT ship (deferred until stylist persona exists, V2 / Din):

- Inspirations paste board (Pinterest-style pinboard)
- Role styling outfit galleries (per-role outfit references)
- Venue segments with 10 photos + 10 videos each
- Concept-vs-actual side-by-side comparison view
- Stylist persona + private saved-palette libraries + permissions
- AI-powered color recommendation engine (V1 is rule-based)
- PDF "design book" export
- Vendor sharing read-only links

---

## Setnayan Guide rule engine

The opinionated heart of this iteration. The engine evaluates the couple's full set of palettes against seven rule categories on every change. Each rule produces a state (`pass` / `warn` / `contradict`), an explanation, and 0–3 suggested alternative colors with reasons.

### Rule categories

**1. Cohesion — themed, not rainbow**

- **Hard limit:** 8 unique colors across the entire master palette. Crossing 8 fires a contradict: "Your wedding is starting to feel scattered. Pick a primary direction or merge similar colors."
- **Soft target — 60-30-10 distribution.** One dominant color (60% of usage frequency across palettes), one secondary (30%), accents in remaining 10%. When no clear dominant emerges, the engine warns ("Your palettes aren't gravitating toward one color. The 60-30-10 rule helps photographs feel intentional.").

**2. Contrast — newlyweds must pop**

Every role palette is scored against the dominant venue background color using WCAG-style luminance contrast ratios. Minimums by role tier:

| Role tier | Minimum contrast vs venue dominant |
|---|---|
| Newlyweds (bride, groom) | ≥ 4.5:1 |
| Parents (bride's, groom's) | ≥ 3.5:1 |
| Best Man + Maid of Honor | ≥ 3.0:1 |
| Team Groom + Team Bride + Secondary Sponsors | ≥ 2.5:1 |
| Bearers + Flower Girls + Other | no minimum |
| Guests | no minimum |

A role failing its tier minimum fires a contradict with three alternative colors that meet the threshold. Suggestions are temperature-consistent with the role's existing palette (warm role stays warm).

**Inversion rule:** every role's contrast must be at most equal to the role above it in the standout ranking. The engine catches inversions ("Your bridesmaids have higher contrast than the bride — that flips the visual hierarchy. Reduce bridesmaids' contrast or pick a different bridal palette").

**3. Background ≠ foreground**

No role palette's primary or secondary color may match a venue palette's primary within ΔE 10 (CIE76 perceptual color distance). Closer than that = contradict.

> "Bride's champagne (#F7E7CE) is only ΔE 6.3 away from the reception ivory (#F5EDE0). She'll blend into the wall in photos. Suggested alternatives: …"

**4. Temperature consistency**

Each color is classified warm / cool / neutral based on its hue in HSL. A palette mixing more than 2 warm + 2 cool colors fires a soft warning: "This palette mixes warm and cool aggressively. Pick a temperature lane for stronger cohesion."

**5. Saturation hierarchy**

High-saturation colors draw attention. They belong on focal points (newlyweds, ceremony arch, stage), not on backdrops or guest tables.

- Venue dominant saturation > 70 (HSL) → warn: "Reception backdrop is highly saturated — it'll compete with the people. Consider a muted alternative."
- Guest-tier palettes with saturation > 80 → warn: "Guest colors are louder than the bride's. Visual hierarchy reads better when guests are quieter."

**6. Photography color cast**

Strongly saturated red (hue 350–10°), magenta (hue 290–340°), or chartreuse (hue 70–90°) walls bounce color cast onto skin in photos. Warn when venue dominant is in those wavelength ranges with saturation > 60: "Saturated [color name] backdrops cast onto skin tones in photos. Wedding photographers usually advise against."

**7. Cultural defaults (PH wedding traditions)**

- Bride defaults to white/ivory family. If a non-white bride color is set, engine confirms once: "Most PH weddings have a white/ivory bride. Are you sure?" Then never asks again for that event.
- Secondary sponsors traditionally pair-coordinate (candle / veil / cord / coin). When one pair's primary is set, engine pre-fills the other pairs to coordinate, with an "edit" affordance to break the pre-fill.

### Engine output format

Each rule check produces a structured record:

```json
{
  "rule_id": "contrast_newlyweds",
  "category": "contrast",
  "state": "contradict",
  "affected_palette_ids": ["bride_palette_id", "reception_palette_id"],
  "message": "Bride's champagne (#F7E7CE) is only 2.1:1 contrast against reception ivory backdrop. She needs at least 4.5:1 to stand out in photos.",
  "suggestions": [
    {
      "hex": "#8C4A28",
      "name": "Burnished Bronze",
      "reason": "4.8:1 contrast, warm temperature consistency"
    },
    {
      "hex": "#D4A574",
      "name": "Warm Gold",
      "reason": "5.2:1 contrast, complements ivory background"
    },
    {
      "hex": "#A36B47",
      "name": "Caramel",
      "reason": "4.6:1 contrast, classic wedding warm"
    }
  ],
  "dismissed": false,
  "last_checked_at": "2026-05-09T10:24:00Z"
}
```

### UX states

| Engine state | Visual treatment | Save behavior |
|---|---|---|
| `pass` | No UI shown | Save proceeds |
| `warn` | Yellow inline banner on the affected palette with the message + 0–3 suggestions inline. Banner can be dismissed to silence re-triggers for the session. | Save proceeds |
| `contradict` | Red modal blocks save. Two paths forward: (a) tap one of the 3 suggested alternative colors to swap the offending color, or (b) tap "Use this color anyway — Setnayan Guide off for this palette" to override. | Save blocked until path (a) or (b) taken |

### Disable Setnayan Guide override

Toggle in palette editor settings: **"Setnayan Guide: ON / OFF"** with a brief description: "Setnayan will help you avoid clashes and suggest better colors. Turn off if you want full control."

- **Default ON** for new events
- Per-event scope (couple-shared) — both spouses see the same toggle state
- When OFF: engine stops running globally; no warnings, no contradicts. A small persistent indicator at the top of the Mood Board panel reads "Setnayan Guide off" so the couple knows they're flying solo.
- Per-palette opt-out also available — when a couple uses the "Use this color anyway" path on a contradict modal, that *specific palette* is flagged `setnayan_guide_overridden = true` and the engine stops checking that palette only. Other palettes still benefit from the engine.

---

## 20 pre-template palette themes

Setnayan-curated coordinated palette packs. Each template ships with pre-built role palettes (matching the standout hierarchy contrast minimums) and pre-built venue palettes (Church, Reception, Cocktail) that are guaranteed to pass all Setnayan Guide rules out of the box. Couple picks one theme to seed everything, then customizes.

| # | Name | Category | Vibe |
|---|---|---|---|
| 1 | Classic | Style | Timeless ivory, champagne, gold |
| 2 | Pastel | Style | Soft, romantic, light blush |
| 3 | Royalty | Style | Burgundy, deep gold, regal |
| 4 | Nomadic | Style | Earth tones, terracotta, desert |
| 5 | Sweet | Style | Pastel pink, rose gold, candy |
| 6 | Elegant | Style | Black, white, silver, crisp |
| 7 | Dreamy | Style | Lavender, mauve, soft cloud |
| 8 | Muted | Style | Dusty desaturated palette |
| 9 | Boho | Style | Burnt orange, cream, tan, free |
| 10 | Blue | Color-led | Navy / sky / cobalt anchor |
| 11 | Red | Color-led | Crimson, burgundy, ruby |
| 12 | Green | Color-led | Sage, emerald, forest |
| 13 | Gold | Color-led | Champagne, brass, antique |
| 14 | Baby Blue | Color-led | Light blue, ivory, pale gold |
| 15 | Army | Color-led | Olive, tan, khaki, masculine |
| 16 | Pink | Color-led | Soft to deep pinks, blush |
| 17 | Spring | Seasonal | Fresh greens, soft pink, ivory |
| 18 | Summer | Seasonal | Bright coral, sky, sunshine |
| 19 | Autumn | Seasonal | Burnt orange, mustard, brown |
| 20 | Winter | Seasonal | Deep emerald, ivory, silver |

Picker UI organizes the 20 in three tabs: **Style** (9 entries), **Color-led** (7 entries), **Seasonal** (4 entries).

Each template manifest is a JSON file Setnayan team maintains under `/palette_templates/{slug}.json`. Schema:

```json
{
  "template_id": "classic",
  "name": "Classic",
  "category": "style",
  "description": "Timeless ivory, champagne, and gold. The default for couples who want a wedding that feels effortless and undated.",
  "vibes": ["timeless", "romantic", "elegant"],
  "sample_image_r2_key": "palette_templates/classic_sample.jpg",
  "role_palettes": {
    "bride": ["#FFFFFF", "#F7E7CE", "#D4A574", "#8C4A28", "#1A1A1A", "#FFFFFF"],
    "groom": ["#1A1A1A", "#3A3A3A", "#8C4A28", "#D4A574", "#FFFFFF", "#F7E7CE"],
    "parents_bride": [...],
    ...
  },
  "venue_palettes": {
    "church": [...],
    "reception": [...],
    "cocktail": [...]
  }
}
```

The Setnayan team builds the 20 templates as a content workstream (parallel to the iteration code build), like the 400 Personal Reel templates and the music catalogue. The iteration code consumes via `library_index.json` and renders the picker.

---

## Color name library

Setnayan-curated lookup table of ~300 wedding-relevant color names mapped to hex codes. Used by:

- **Color name autocomplete** — type "champ…" → autocomplete suggests "Champagne Gold (#F7E7CE)"
- **Reverse lookup** — when couple picks a hex via picker, panel shows "≈ Champagne Gold" beside the swatch
- **Master palette dedup** — two palettes referencing "Champagne Gold" merge in the master view even if hex codes differ slightly (named color match takes precedence over fuzzy hex distance)

Library entries:

```json
{
  "color_name": "Champagne Gold",
  "hex": "#F7E7CE",
  "category": "warm",
  "common_synonyms": ["champagne", "warm gold"],
  "tags": ["wedding", "classic", "elegant", "metallic"]
}
```

Library ships as a static JSON file at `/color_library/color_names.json`, loaded into the front-end on Mood Board open. Updates ship via Setnayan content team without code deploys.

---

## Image extraction pipeline

When a couple uploads a reference image to a palette, Setnayan extracts the dominant colors:

1. Image uploaded to R2 via signed URL
2. Cloudflare Workers function (or a small Workers AI image classifier) reads the image and runs k-means clustering with k=8 on the pixel color values, weighted by perceptual hue distance
3. Returns the 5–8 most dominant cluster centroids as hex codes, ordered by frequency
4. UI shows the extracted palette as 5–8 swatches; couple picks which to add to the current palette (max 6 total per palette including any pre-existing colors)
5. Image stays attached as a reference image on the palette

Validation: image must be JPEG, PNG, or HEIC; max 10 MB; min 200 × 200 px.

---

## Master palette

Read-only auto-compilation of every unique color across all palettes for the event.

**Dedup logic — two layers:**

1. **Exact hex match** — `#C97B4B` appearing in 4 palettes = one entry in master with badges showing all 4 sources
2. **Named color match** — two hexes with the same color_name (e.g., "Sage Green") merge into one entry in master, preserving both hex variants as a "≈" group

Order: most-referenced first, then by hex temperature (warm → neutral → cool).

Each master palette entry shows:

- Color swatch
- Hex (or "≈" group of similar hexes)
- Color name (if set)
- "Used in" badges → tap to jump to the palettes referencing this color
- "Replace across all" action — bulk swap this color in every referenced palette to a new color (with Setnayan Guide running on the proposed replacement before commit)

---

## Saved palettes library

Couple's reusable palette compositions. V1 is couple-scoped; V2 adds stylist scoping.

**V1 saved palette schema:**

```
SavedPalette
  - saved_palette_id
  - event_id (FK)
  - name: text
  - description: text (optional)
  - colors: array<{hex, name, position}>
  - reference_image_r2_keys: array<text> (max 3)
  - scope_type: enum('couple', 'stylist')   -- V1 always 'couple'
  - scope_owner_id: FK to user               -- V1 always couple_user_id
  - created_by_user_id, created_at, updated_at
```

**V1 use cases:**

- Couple builds a palette they like, saves it as "Bridal Party — warm version", uses it across multiple roles
- Couple imports a saved palette as the starting point for a new role/venue palette (snapshot, not link)
- Couple deletes saved palettes they don't need

**V2 (stylist scoping) — schema-ready, not built in V1:**

When stylists are introduced (V2 / Din), `scope_type` flips to `'stylist'` and `scope_owner_id` becomes the stylist's user_id. Each stylist sees only their own saved palettes; stylists can pre-make their signature designs and delete the default templates from their personal view (without affecting other stylists or couples). The schema accommodates this without migration; only the access-control logic changes.

---

## Mobile thumb-zone UX

The mobile mockup follows the thumb-zone rule: **all primary touch targets in the lower third of the screen**.

Layout (top → bottom on a 800 px-tall phone screen):

| Region | Approx height | Content |
|---|---|---|
| Status bar | ~50 px | iOS / Android system status |
| Top context (read-only, scroll-friendly) | ~470 px | Palette name, current 6 colors as a horizontal swatch row, role/venue label, Setnayan Guide warnings inline, reference image preview |
| **Editor zone (thumb-friendly)** | ~280 px | Color picker (swatch grid + hex input + name autocomplete), "Add color" button, "Save palette" button, theme picker drawer, image extraction trigger |

One-handed flow: couple holds the phone, scrolls the upper context to review what they have, all editing happens within thumb reach in the editor zone at the bottom. The Setnayan Guide warnings can be tapped to jump-fix; the editor zone re-anchors to the affected color.

---

## Data model

```
Palette
  - palette_id
  - event_id (FK)
  - palette_type: enum('role', 'venue', 'custom')
  - role_id: FK (nullable; only for type='role')
  - venue_label: text (nullable; e.g., 'Church', 'Reception', 'Cocktail', 'Photo Wall')
  - name: text (display name)
  - notes: text (optional)
  - reference_image_r2_keys: array<text> (max 3)
  - source_template_id: FK (nullable; tracks which pre-template seeded this palette, if any)
  - setnayan_guide_overridden: bool (per-palette opt-out from Setnayan Guide)
  - created_at, updated_at

PaletteColor
  - palette_color_id
  - palette_id (FK)
  - hex: text (#RRGGBB)
  - color_name: text (nullable)
  - position: int (0-5; max 6 colors per palette)
  - PRIMARY KEY (palette_id, position)

SavedPalette  (couple's reusable library; V1 scope=couple, V2 adds stylist scope)
  - saved_palette_id
  - event_id (FK; null in V2 for stylist-scoped library entries)
  - name, description
  - colors: jsonb  (denormalized array of {hex, name, position})
  - reference_image_r2_keys: array<text>
  - scope_type: enum('couple', 'stylist')   -- V1 always 'couple'
  - scope_owner_id: FK to user
  - created_at, updated_at

EventSetnayanGuideSettings  (per-event toggle state)
  - event_id (FK PK)
  - global_enabled: bool (default true)
  - last_modified_by_user_id, last_modified_at

SetnayanGuideCheck  (runtime evaluation cache)
  - check_id
  - event_id (FK)
  - palette_id (FK, nullable for cross-palette rules)
  - rule_id: text (matches rule_id in the engine config)
  - state: enum('pass', 'warn', 'contradict')
  - affected_palette_ids: array<int>
  - message: text
  - suggestions: jsonb  (array of {hex, name, reason})
  - dismissed_at: timestamp (nullable)
  - last_checked_at: timestamp
```

Static content (not in the DB; ships as JSON files alongside the iteration):

```
/color_library/color_names.json        (~300 named colors)
/palette_templates/library_index.json  (manifest of the 20 themes)
/palette_templates/{slug}.json         (one per theme)
/palette_templates/{slug}_sample.jpg   (reference image per theme)
```

---

## Setnayan Guide engine — implementation

The engine is a backend module: `services/setnayan_guide_engine`. Each rule is a discrete checker function with a stable rule_id. The engine runs on every palette change via a Cloudflare Workers cron-like invocation triggered by palette save events.

```typescript
type RuleChecker = (palettes: Palette[], event: Event) => SetnayanGuideCheck[];

const checkers: Record<RuleId, RuleChecker> = {
  cohesion_max_unique_colors: ...,
  cohesion_60_30_10: ...,
  contrast_newlywed_minimum: ...,
  contrast_role_inversion: ...,
  background_foreground_proximity: ...,
  temperature_consistency: ...,
  saturation_hierarchy: ...,
  photography_color_cast: ...,
  cultural_bride_white_default: ...,
  cultural_secondary_sponsor_pairing: ...,
};

function runEngine(event_id: string): SetnayanGuideCheck[] {
  const palettes = loadPalettes(event_id);
  const event = loadEvent(event_id);
  if (!eventSetnayanGuideEnabled(event_id)) return [];
  
  return Object.values(checkers).flatMap(check => check(palettes, event));
}
```

Front-end consumes the returned array of checks, filters by `state`, renders the warnings and contradicts in-context on each palette, and shows a master Setnayan Guide health summary at the top of the Mood Board panel.

---

## Acceptance criteria

V1 is shippable when all of the following are true:

- Every role on the guest list (from 0001) appears as an editable palette row in the Mood Board panel with up to 6 colors.
- Three default venue palettes (Church, Reception, Cocktail) exist; couple can add custom venue palettes with free-form labels.
- Each palette accepts colors via hex, native picker, color-name autocomplete, or image extraction.
- Image extraction returns 5–8 dominant colors from any uploaded JPEG / PNG / HEIC image; couple selects which to add (cap at 6 total per palette).
- Color name autocomplete suggests from the ~300-entry library; reverse lookup shows "≈ [name]" beside picked hexes.
- The 20 pre-template themes load in the picker, organized into Style / Color-led / Seasonal tabs; picking a theme seeds all role + venue palettes for the event.
- Setnayan Guide engine runs on every palette change; produces structured check records with state (pass / warn / contradict), message, and 0–3 suggestions.
- All 7 rule categories implemented: cohesion (8-color hard limit + 60-30-10 soft target), contrast (per-tier minimums + inversion check), background-vs-foreground proximity (ΔE 10), temperature consistency, saturation hierarchy, photography color cast, cultural defaults (PH bride + secondary sponsor pairing).
- `warn` state shows yellow inline banner with suggestions; can be dismissed for the session.
- `contradict` state shows red modal blocking save; couple either accepts a suggested alternative or taps "Use this color anyway" to flip the per-palette override.
- Disable Setnayan Guide toggle (per-event, default ON) stops the engine globally when off; ambient indicator shows "Setnayan Guide off" state.
- Master palette auto-compiles, dedupes by exact hex AND color name, shows "used in" badges; "Replace across all" works.
- 1–3 reference images per palette can be attached, stored in R2.
- Saved palettes library lets couple save / reuse / delete custom compositions; scope_type always 'couple' in V1.
- Mobile mockup: all primary touch targets within the lower third of the screen.
- Schema includes the V2-ready fields (`scope_type` enum, etc.) so stylist scoping is data-only when introduced.

---

## Open questions

- **Saturation thresholds** — V1 uses HSL > 70 for venue and > 80 for guest-tier as warning thresholds. These are reasonable starting points; Setnayan content team should test against actual wedding photographs and refine.
- **Cultural defaults beyond the bride** — V1 captures "white/ivory bride" and "secondary sponsors pair-coordinate." Are there other PH wedding traditions worth baking in (e.g., barong colors, offerings palette)? Setnayan content team to research.
- **AI-powered recommendations** — V1's suggestions are deterministic (rule-based color theory + nearest neighbor in palette space). V1.1 candidate: an LLM-augmented suggestion engine that picks alternatives that also match the *vibe* the couple has chosen, not just the contrast math. Cost: one Claude API call per warn/contradict. Defer until V1 launch data tells us couples want richer suggestions.
- **Theme expansion beyond 20** — Setnayan content team should ship 20 at launch; collect couple usage data; expand toward 30–40 themes in V1.1 if certain styles are over-subscribed.

---

## Companion specs and cross-references

- `0001_creating_guest_list/` — role taxonomy and per-role guest assignments consumed by the role palettes
- `0006_vendors_management/` — vendor records (florist, decorator) who consume the palette context for coordination, V2 sharing
- The 2026-05-08 `0010_mood_board.md` partial placeholder — superseded by this iteration; the broader vision (inspirations / role outfit galleries / venue segments / concept-vs-actual / stylist persona) lives there for the next mood-board iteration after stylist support exists
- `CLAUDE.md` — decision log capturing the 2026-05-09 Mood Board V1 scope lock + Setnayan Guide rule set

---

[View this iteration's HTML mockup](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan%20App/0010_mood_board/0010_mood_board.html)

[View this iteration's Word document](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan%20App/0010_mood_board/0010_mood_board.docx)
