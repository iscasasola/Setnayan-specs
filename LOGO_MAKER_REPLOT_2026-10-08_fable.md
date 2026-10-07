# Logo Maker — the replot (2026-10-08, Fable)

> Owner, on Event Hub Maker › Studio › Logo, verbatim: *"when opening logo make on studio, i get
> stuck with 1 layer and cannot access anything more. you have to replot how the whole logo maker
> works while keeping its concept. no more asking do you want a logo? this is direct edit already.
> Workspace. Layers and tools. that is it. Tools allow character (if text) and animation. you can
> use the same concept as stages and have the layers above it replace the eventbar and add a
> carousel for adding layers"*.
>
> Design + prototype only. Read from `origin/main` (the shipped editor is
> `apps/web/app/dashboard/[eventId]/launch/_components/maker-logo.tsx`, its model
> `apps/web/lib/logo-layers.ts`). Prototype: `prototypes/logo_maker_replot_2026-10-08_fable.html`
> · screenshots `prototypes/logo-maker-replot-2026-10-08/`.

## 1 · Today (shipped, `origin/main`)

`MakerLogoDoor` (`maker-logo.tsx`) is a full-screen layered editor (DECISION_LOG 2026-09-27,
redrawn-as-is 2026-10-06): a square frame with ▶ Play; a stack of layers **Text · Image · Frame**
(`LOGO_LAYER_KINDS`, max 12); per layer — Name · Words · Typeface (`FontPick`, the eight stage faces)
· *Remove white background* · Frame (seven kinds) · Colour (the five main colours + *Its own*) ·
Size and place (Size · Across · Up and down · **Rotate**) · *How it's written* (trace the letter;
Draw on follows the pen) · Motion (In: Draw on/Rise/Fade/None · During: Still/Drift · **Out**:
None/Fade/Sink · Starts after · Speed) · *Remove this layer*. Drag on the canvas with rails; move
↑/↓ in the list; a save gate that never saves on open (#6023); draft autosave announced in the
Maker bar. **Not shipped:** hide, lock, duplicate, split into letters, ornaments, starting designs,
letter spacing, download.

On a phone the editor has two sheets, `sheet: 'layers' | 'tools'`, opened from two tiles
(**☰ Layers** · **⚙ Edit [layer]**, disabled until a layer is picked) that it portals into the
lower third's navigator slot (`IntoLowerThird to={ltNav}`), and each open sheet registers itself as
a Maker **tool** (`useMakerTool(Boolean(ltNav) && sheet !== null, …)`).

## 2 · Why the owner is stuck on one layer (the cause, file:symbol)

Three mechanisms stack, and together they leave exactly one layer and no way further:

1. **`maker-logo.tsx` → `openingLayers()`** opens with ONE layer (`initials` text, or `yourlogo`
   image) and `selectedId = null`. So the Edit tile reads *"Pick a layer"* and is disabled.
2. **`maker-lower-third.tsx` → the navigator folds while a tool is open** (`data-lt-rows` gets
   `inert` + `pointer-events-none` whenever `tool !== null`). The Logo's own two tiles live IN that
   navigator (`IntoLowerThird to={ltNav}`), so while any tool is open they are unreachable.
3. **`details-workspace.tsx` → `<MakerHalfSheet … tool={at?.kind === 'step'}>`** (the guided
   "What's left" flow, `stepSheet = mode === 'guided' && plan !== null`) draws the Logo step's half
   sheet — whose field is the **"Do you want a logo?"** answer (`maker-details.tsx`:
   `editors.logo = logoA.node`, `lib/event-answers.ts: LOGO_QUESTION`) with Back · Skip · Next — and
   `maker-sheet.tsx` registers it as a Maker tool (`useMakerTool(inMaker && tool && …)`). Result on
   the phone: the logo with its one opening layer in the workspace, the yes/no question in the lower
   third, and the Logo's Layers / Edit tiles folded away behind it. (`detailsItemLayout('logo')` is
   already `'whole'` in `lib/maker-details-items.ts`, which keeps the *All items* sheet from doing
   the same — the guided step sheet has no such exclusion.)
   Outside the flow the second shape of the same trap: **Layers** opens as a tool and folds the
   **Edit** tile away, and vice-versa — every move is × then a tile, and nothing says so; the
   opening layer is never picked, so Edit reads *"Pick a layer"* and is disabled.

In one line: **the Logo page's tools are tiles inside a navigator that hides whenever a tool is
open — and both the guided step's yes/no sheet and the Logo's own two sheets are tools.**

## 3 · The design — the same concept as Stages

Phone first (375). Three zones, the Maker's own (`lib/maker-phone-room.ts`): top nav · workspace ·
lower third. **Nothing opens over the workspace.** The lower third is one fixed layout; nothing
"folds" — the Logo never registers a Maker tool, exactly as a Stage's part does not.

| Zone | What it is | Copied from |
|---|---|---|
| **Workspace** | The logo, big and centred, white square. Tap a layer to pick it → a dashed frame with chips: **↑** upper-left (bring forward) · **↓** lower-left (send back) · **🔒** upper-right · **✕** lower-right. Drag to move (rails + snap, as shipped). **▶** in the corner plays the picked layer's Build in → Action → Build out; nothing picked = the whole logo. | Stages' picked-part frame and chips (`maker_two_dropdowns_owner_wireframe_2026-10-06_fable.html`) |
| **Layers carousel** — *in place of the event bar* ("You're editing" strip / page tabs) | One card per layer, top of the stack first: a thumbnail (the glyph, the words, the ring, the ornament) in its colour, its name under. Picked card = dark name bar. Hidden = faded + "hidden"; locked = 🔒 badge. **Hold and drag** a card sideways to reorder (a flick scrolls the strip). Last card **＋ Add layer** → ONE sheet: Text · Image · Frame · Ornament. | The Stages part carousel |
| **Tools row** | `[ Character \| Style \| Animate ] · ▶ · ⓘ` — one pill, Stages' Style/Text/Animate shape. **Character** shows only for a text layer (hidden, not disabled, otherwise). ⓘ = one plain-English card for the open tool, gone in 5 s. | Stages row 1 |
| **Character** (text only) | Words · Font ▾ · Size · Spacing · Colour (the five main colours — the shared Mood Board palette) · *Split into letters — each letter gets its own animation*. | Shipped Words/Typeface + the owner's split ask |
| **Style** (any layer) | Looks as picture cards (text: Solid · Outline · Shadow) · the kind's own control (image: *Remove white background* switch · frame: Frame ▾ · ornament: Ornament ▾) · Colour · Size · Across · Up / down · Rotate · a row of **Hide · Lock · Duplicate · Delete**. | Shipped Colour / Size and place / Rotate |
| **Animate** (any layer) | `[ Build in \| Action \| Build out ]` sub-tabs. Build in: How ▾ (Draw on · Rise · Fade · None) · *Written* (the traced path, "Trace again" / "✍ Show how it's written") · Starts after · Takes. Action: Does ▾ (Still · Drift). Build out: How ▾ (None · Fade · Sink). | Shipped Motion, in Stages' three-phase shape |

**No gate.** Studio › Logo opens straight into this. *"Do you want a logo?"* leaves the Logo screen;
the answer stays a quiet switch on the Logo row of the Studio home (`studio-home.tsx`, "Logo ·
Missing" tile) — *Show the logo on the Cover page and QR* — and in Event Details. Removing the logo =
delete its layers, or that switch; never a question on open.

**Rules kept:** minimal words; every choice a dropdown (the one `PickMenu` sheet); looks as picture
cards; thumb zone only; frosted rows; no Save — the draft autosaves (the bar reads *saving… / saved
to your draft*), **✓ Apply** publishes. ↺ Undo in the top nav walks every change back, including a
delete.

**Desktop** (≥ 1024): same three pieces, the Stages desktop way — layers as a left column with the
same cards, the tools row + panel as the right column, the workspace in the middle. One component,
one state; only the CSS moves.

## 4 · Data — exists vs NEW

| Fact | Where it lives today | New? |
|---|---|---|
| The layers, their order, kind, name, x/y/scale/rotate, colour, text/font, frame, keepWhite, written path, motion (in · during · delay · dur · out) | `events.monogram_studio_config.layers` — `LogoLayerMeta` (`lib/logo-layers.ts`); the composed SVG in `events.monogram_custom_svg` | exists |
| The five main colours | the Mood Board palette (`mainColours`, already passed to `MakerLogoDoor`) | exists |
| Hide / Lock | — | **NEW** two optional booleans on `LogoLayerMeta` (`hidden?`, `locked?`); `composeLogoSvg` skips hidden; both sanitised in `sanitizeLogoLayers`. JSONB — no migration. |
| Letter spacing | — | **NEW** optional `spacing?: number` on a text layer; `textShapes()` already lays glyphs by hand via opentype, so it is one advance per glyph. No migration. |
| Ornament | — | **NEW** `kind: 'ornament'` in `LOGO_LAYER_KINDS` + a closed set of SVG flourishes (like `frameBody`). The 2026-10-06 row kept ornaments OFF this screen — **owner call** before it goes in; the prototype shows it because the owner's brief names Text · Image · Frame · Ornament. |
| Split into letters | — | client-side only: N text layers from one (`text`, `x` laid out from the face's advances, `delay` stepped). No data. |
| Duplicate | — | client-side only (`newLayerId`). No data. |
| "Do you want a logo?" | `LOGO_QUESTION` / `logo_wanted` (`lib/event-answers.ts`, `lib/hub-draft.ts`) | exists — moves OFF the editor to the Studio row; the answer itself is unchanged. |

## 5 · Recommendations (one word each)

1. **Unfold** — the Logo never registers a Maker tool; its tools are a fixed row.
2. **Ungate** — the yes/no leaves the editor.
3. **Carousel** — layers where the event bar was.
4. **Flags** — hide/lock as two JSONB booleans, no migration.
5. **Ask** — ornaments: the owner reversed them on 2026-10-06; confirm before building.

## 6 · PR plan (each on `origin/main`, side-by-side screenshot per PR, owner OK before merge)

| PR | Delta | Touches |
|---|---|---|
| **L1 · Ungate + unfold** | Studio › Logo opens the editor directly: the `details:logo` step sheet is not opened as a tool for the logo item (`detailsItemLayout('logo') === 'whole'` already exists for whole-screen items — use it); `maker-logo.tsx` stops calling `useMakerTool` and stops portaling tiles into `ltNav`; the "Do you want a logo?" answer moves to the Studio home's Logo row as a switch. **This alone ends the one-layer trap.** | `details-workspace.tsx`, `maker-details.tsx`, `maker-logo.tsx`, `studio-home.tsx` |
| **L2 · Layers carousel + chips** | The strip of cards replaces the phone's two tiles; hold-drag reorder (`moveLayer` + `retimeLayers`); the picked layer's frame with ↑ ↓ 🔒 ✕ on the canvas; ＋ Add layer sheet (Text · Image · Frame). Desktop: the same cards in the left column. | `maker-logo.tsx` |
| **L3 · Tools row** | `[Character \| Style \| Animate] · ▶ · ⓘ` with the shipped controls regrouped: Character (Words · Font · Size · Colour), Style (looks cards · kind control · Colour · Size and place · Hide/Lock/Duplicate/Delete), Animate (Build in / Action / Build out over the shipped `LogoMotion`). `hidden?`/`locked?` on `LogoLayerMeta`; `composeLogoSvg` skips hidden. Tests: `logo-layers.test.ts` sanitise round-trip; a render test that a hidden layer is absent from the SVG. | `maker-logo.tsx`, `lib/logo-layers.ts` |
| **L4 · Character extras** | Spacing (`spacing?`), Split into letters, Looks (Outline · Shadow as SVG stroke / drop-shadow filters in `layerShapes`). | `maker-logo.tsx`, `lib/logo-layers.ts`, `lib/logo-fonts.ts` |
| **L5 · Ornament** (only if the owner says yes) | `kind: 'ornament'` + a closed flourish set. | `lib/logo-layers.ts`, `maker-logo.tsx`, Ugat baseline if a db-test notices |

Guards to keep green: `lib/the-maker-keeps-the-page-on-a-phone.test.ts` (the lower third's declared
height — the carousel row is 74 px + tools row 44 px inside the existing `MAKER_LT_HEIGHT`),
`maker-logo-save-gate` (never saves on open — the ungated open must still take its baseline at the
first touch, not at mount).

- **Owner 08 Oct, on the prototype:** *"no need this play button since there is a play button under"* → REMOVE the floating "▶ Play" on the workspace; the ▶ in the tools row is the only Play. (It also collided with the 🔒 chip on the picked layer.)
