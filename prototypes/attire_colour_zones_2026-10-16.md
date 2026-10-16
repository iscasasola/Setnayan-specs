# Attire colour zones — a suit is three colours, not one (Fable, 2026-10-16)

**Status: PROTOTYPE for owner approval. Nothing built in the repo.**
Prototype: `prototypes/attire_colour_zones_2026-10-16.html` (self-contained — every figure and mask inlined as a data URI, so it draws from `file://`, a local server or an artifact). Assets beside it: `prototypes/attire_colour_zones_2026-10-16/{figures,zones}/` + `zones/build-zones.py`.

## Owner, verbatim (2026-10-16)
On the Mood Board dress-code figures where a role's ONE colour fills the whole garment (an all-olive suit — coat, shirt and tie the same olive): *"suit has a color for the coat and pants, a color for the long sleeves and a color for the tie and accents"*.

## What ships today (origin/main a09087c4)
13 AI-drawn figures (owner 2026-10-14 "Use them"): a drawing with the garment in ivory + ONE alpha mask; the role's FIRST colour over the mask with `mix-blend-mode: multiply` — `lib/attire-figures.ts` (`FIGURE_ART`), `lib/role-figure.ts` (`roleFigurePeople`, `main` = colours[0]), `app/_components/role-figure.tsx`. The Studio's Attire block (`mood-board-studio.tsx`, tab `attire`) draws per pick: label → figure (132 px) + the colour dots + "+" → Wear ▾. The guest page (`dress-code-widget.tsx`) draws the same `RoleFigure`.

## The delta
Split the menswear masks into zones; the role's dots paint the zones **in order**, and a small word under each dot says which.

### Zones per garment (dot order) · bytes (alpha WebP, 280 px tall)
| Garment | 1 | 2 | 3 | drawing · masks |
|---|---|---|---|---|
| Suit `suit` | Coat & pants `-a` | Tie `-c` | Shirt `-b` | 6.7 KB · 5.1 / 0.7 / 0.4 KB |
| Formal (tux) `tux` | Tux `-a` | Bow tie + pocket square `-c` | Shirt `-b` | 7.1 KB · 4.9 / 1.0 / 0.3 KB |
| Boy's suit `suitb` | Vest & pants `-a` | Bow tie `-c` | Shirt `-b` | 7.0 KB · 3.8 / 1.7 / 0.3 KB |
| Barong `barong` | Barong `-a` | Pants `-b` | — | 7.0 KB · 5.3 / 1.1 KB |
| Boy's barong `barongb` | Barong `-a` | Pants `-b` | — | 6.9 KB · 4.5 / 1.1 KB (the pillow is left as drawn) |
| Smart casual `shirt` | Shirt `-a` | Pants `-b` | — | 7.3 KB · 4.4 / 2.3 KB |
| Pantsuit `pantsuit` | Suit `-a` | Blouse `-b` | — | 7.3 KB · 4.7 / 0.3 KB |
| Gown · terno · cocktail · midi · women's barong · flower girl | one colour (the shipped mask) | | | unchanged |

Shipped today, for the byte class: drawing 6.8–8.8 KB, one mask 4.7–10.3 KB. A zoned garment's three masks together weigh about what its one mask did.

**The drawing is re-saved with its recolourable zones neutralised to the garment's ivory** (the khaki tie, the champagne shirt, the black barong pants, the khaki chinos, the satin blouse) — a multiply tint over khaki is "olive × khaki", not olive. With no colour given, each zone's default tint puts the drawing back as it looks today (charcoal barong pants, khaki chinos, white shirt, a tie in the garment's own colour, deeper).

### The colour rule
1. **Dot 1 — the garment** (as today).
2. **Dot 2 — the accent**: tie (suit · tux · boy's suit, with the pocket square and bow tie) · pants (barong · boy's barong · smart casual) · blouse (pantsuit). Absent → the garment's colour, deeper (ties), or the drawing's neutral.
3. **Dot 3 — the shirt** (suit · tux · boy's suit). Absent → white.
4. **Women stay one colour** (the sash/belt is the dress's own cloth in every drawing; a woman's second colour is the bouquet, not the fabric) — except the pantsuit, whose drawing already has two garments.
5. A dot beyond the zones paints nothing and carries no label; it is still the role's palette (the guest page shows every chip).

Why tie before shirt: a couple says "olive suit, marigold tie" far more often than a coloured shirt, and it keeps the shipped meaning of a role's second colour ("colour 1 is the main piece, the rest accents", `lib/role-figure.ts`).

### How the editor says it
Under each dot of a zoned garment, the zone's word (10.5 px, `text-ink/65`): "Coat & pants · Tie · Shirt" / "Barong · Pants" / "Shirt · Pants" / "Suit · Blouse". Nothing under a one-zone garment's dots. The "+" and the dots keep their shipped behaviour (the one colour menu). Compatible with `rd/attire-per-column` (each column its own Wear ▾ and colours; the labels follow the column's garment).

## What a builder touches
- `apps/web/public/attire/` — + 7 zone drawings and 17 zone masks from `zones/` (`<g>-a/-b/-c.webp`); shipped files stay for the one-zone garments.
- `lib/attire-figures.ts` — `FigureArt` gains `zones?: {key; mask; label; default}[]`; `FIGURE_ART` fills it for the seven garments (their `src` → the neutralised drawing); `ZONE_LABELS`.
- `lib/role-figure.ts` — `FigurePerson.main` → `colours: string[]`; one pure `zoneTints(garment, colours)` = the rule.
- `app/_components/role-figure.tsx` — one tint layer per zone (same `mask-image` + `multiply` recipe).
- `mood-board-studio.tsx` (tab `attire`) — passes the pick's whole colour list; the label under each dot.
- `dress-code-widget.tsx` — no markup change.
- Guards: `the-palette-wears-a-person.test.ts`, `attire-recolours-because-the-query-asks.test.ts` — "a second colour reaches a second mask"; "with one colour the shirt layer is white and the tie layer is the deeper first".

## How the masks were made
`zones/build-zones.py` (copy of `controller-2026-10-12/attire-figures/zones.py`) on the shipped `src/ cut/ mask/`: the shirt and tie are distinct colour regions inside the drawings (champagne shirt, khaki tie, black/khaki pants), picked by colour inside hand-drawn polygons; the tux's ivory bow tie and pocket square, the boy's placket and the pillows by polygon alone; morphological closing, a 0.8 px blur, the same crop (y 16..1006) and 280 px resize as `build-webp.py`. Verified by a 7 × 5 contact sheet (one · two · three colours · Rosewood + Pandan + Cream · Narra + Marigold) and in the prototype at 375 px, light and dark.

## Open for the owner
- Approve the rule (1 garment · 2 accent · 3 shirt) or swap 2 and 3.
- Women one colour, pantsuit two — or also a sash zone on the midi and the flower girl (cuttable the same way; not recommended now).
