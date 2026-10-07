# Maker (Stages | Studio) — side-by-side check, prototype vs. what shipped · 2026-10-07

Owner, verbatim: *"the lower toolbar did not execute the designs style we agreed on the prototype"* → *"do the side by side check now"*.

**Compared**

- **Approved design:** `prototypes/maker_two_dropdowns_owner_wireframe_2026-10-06_fable.html`, iPhone 13 mini picker (375 × 812), screenshotted with `?shot`.
- **Built:** `origin/main` at `2026-10-07 ~04:00 UTC` (PRs #6386 · #6388 · #6389 · #6390 · #6391 · #6392 merged), rendered at `/dev/maker-lab?ss=1` on a headless Playwright phone (375 × 812, `isMobile`, `hasTouch`, iPhone 13 mini UA, 2×). Measurements are `getBoundingClientRect()` on both, never eyeballed.
- **Owner's production phone** (signed in, flag on, event "Indalecio & Claire"): two screenshots on disk (`side-00-…OWNER-PROD-guided-picker.png`, `side-14b-…OWNER-PROD.png`) and five described by the controller (part tap → old type bar; Date tap; What to wear Style; E-Gifts Style; Background picker; Animate). Where the lab could not show a state, the owner's screenshot is the evidence and is marked so.

**Screenshots:** `prototypes/side-by-side-2026-10-07/` — `side-*.png` are the composed pairs (prototype left, built right); `proto-*.png` / `built-*.png` are the singles.

**Grading:** **MUST FIX** = breaks an agreed rule (44-px rows · panel = 50 % of the screen · controls fill the panel · any set of choices is ONE dropdown · no cards or boxes · helper text behind ⓘ · Stages always shows the page) or the approved look. **SHOULD FIX** = visibly different, not rule-breaking. **LAB LIMIT** = the dev lab cannot show it; judged from the owner's phone or not at all.

**Totals: 31 MUST FIX · 14 SHOULD FIX · 7 LAB LIMIT.**

**Lab artefacts to ignore in the built shots:** the cookie banner inside the canvas iframe and the Next.js "N" dev badge bottom-left — neither exists in production.

---

## 0 · Stages with an unfinished event — OWNER PROD · `side-00-stages-OWNER-PROD-guided-picker.png`

Prototype: Stages always shows the page preview above a 62-px collapsed row. Owner's phone: the **retired guided picker** ("Which stage do you want ready? · 15 of 17 in place · Get Save the Date ready") fills the page area, with the new lower panel under it.

| # | Difference | Grade | Where |
|---|---|---|---|
| M1 | The guided setup (`stage-picker.tsx` → `details-guide.tsx` / `details-workspace.tsx`) still takes the work area in Stages mode when the event is "unfinished". The owner retired the guided flow; Stages must always render the page preview (`maker-shell.tsx` — the `openDetails` / `guideTitle` branch that mounts Details on the stage list instead of the canvas). | **MUST FIX** | `launch/_components/maker-shell.tsx`, `stage-picker.tsx`, `details-guide-top.tsx` |

---

## 1 · Stages, nothing picked (collapsed) · `side-01-stages-collapsed.png`

Measured — prototype: top nav 56 · lower third **62** (row 44: stage ▾ 153×44 · Style/Text/Animate 46×38 each in a 44 pill · ▶ 40) · caption 18 + guest tab bar 44 drawn at the foot of the preview. Built: toolbar 52 · lower third **236** (`--maker-lt-h: clamp(216px,30dvh,236px)`) = row 44 (Invitation ▾ 101×44 · tools 48×44 · ▶ 44) + caption 18 + a strip of 84×84 tiles (149) · guest bar 49 (tabs 48 with icons).

| # | Difference | Grade | Where |
|---|---|---|---|
| M2 | Collapsed panel is **236 px**, not one 62-px row. The prototype's collapsed state is the row only; the parts strip appears only after a tool is tapped with nothing picked (then the panel rises to 50 %). The 30 dvh resting height is the OLD lower third's. | **MUST FIX** | `lib/maker-phone-room.ts` (`makerLtHeightPx`), `lib/maker-lt-size.ts`, `stage-tools.tsx` (`onPx(null)` resting) |
| M3 | Part tiles are bordered white cards (`STAGE_PART_TILE`: `rounded-xl bg-white ring-1`) — the owner's "no cards or boxes". Prototype tiles (`.th`, 104×124) are icon-over-name thumbnails with the source as a small gold caption (STUDIO / INFO / SUPPLIERS), shown only in the tool-tapped state. | **MUST FIX** | `lib/maker-stage-room.ts` `STAGE_PART_TILE`, `stage-tools.tsx` strip |
| S1 | Caption "You're editing · Invitation › Welcome" sits INSIDE the panel, 12 px sentence case. Prototype: an 18-px gold-wash uppercase strip above the guest tab bar, at the foot of the preview. | SHOULD FIX | `stage-tools.tsx` `[data-stage-caption]` |
| S2 | Guest tab bar: built draws icons + labels (48 px); prototype draws labels only (44 px) with a dominant-colour underline. | SHOULD FIX | `stage-tools.tsx` guest bar, `STAGE_GUEST_TAB` |
| S3 | Animate icon is Sparkles; prototype uses a keyframe diamond (`i-key`). Minor. | SHOULD FIX | `stage-tools.tsx` (lucide `Sparkles`) |
| S4 | Stage ▾ pill: built "Invitati…" truncates at 101 px; prototype gives the pill `flex:1` (153 px, uppercase letter-spaced) so the name never truncates. | SHOULD FIX | `STAGE_ITEM_BUTTON` (`min-w-0 shrink`) |

Top nav (both modes): both have ✕ · Stages \| Studio · ↶ · ✓ at 44 px. Prototype: ink knob, uppercase labels with icons, Apply always green with a count badge. Built: terracotta knob, sentence case, no icons, Apply grey until a change exists (the owner's prod shot shows it green with "2" once there are changes — fine). → S5 SHOULD FIX (knob colour / icons / uppercase), `stages-studio-parts.tsx` `StudioSideSwitch` (`ISegmented tone="wine"`).

---

## 2 · The stage ▾ sheet · `side-02-item-sheet.png`

Prototype: one bottom sheet, 326 px, five stages as 50-px rows — icon · name · its pages as a grey subtitle · HERE badge + ✓ on the current one. Pages are picked from the guest tab bar, never from the sheet (owner 2026-10-06: *"if we are having this, then we don't need the expand on the drop down"*). Built: sheet 503 px (62 dvh), stages as 48-px accordion rows with chevrons; the open stage expands into its pages (Welcome · Here, Details, Our Love Story, Me) with page icons.

| # | Difference | Grade | Where |
|---|---|---|---|
| M4 | Stage rows expand into pages (accordion). Owner said the sheet lists stages only; the guest tab bar picks the page. | **MUST FIX** | `stage-item-menu.tsx` (`[data-stage-menu-pages]`) |
| S6 | No stage icons, no pages subtitle, no HERE/✓ marker on the current stage; sheet is 62 dvh instead of fitting its five rows. | SHOULD FIX | `stage-item-menu.tsx`, `STAGE_SHEET_ROW` |

Sheet styling (peeks from the bottom, grab handle, rounded top, scrim) matches. ✓

---

## 3 · A tool tapped with nothing picked · `side-03-tool-tapped-nothing-picked.png`

Prototype: panel rises to 50 % (406 px); hint row "☝ Tap a part of the page — Style will act on it" (40 px) + the parts strip (104×124 thumbnails with icon · name · source). Built: tapping Style auto-picks the FIRST part (the Reveal) and shows its kinds as a horizontal **pill row** ("Four-flap envelope ◆ PRO · Two-flap · side open ◆ …"), "Extras ▾ None", and ARRANGE as a segmented "Shown | Hidden"; the panel's lower half is empty.

| # | Difference | Grade | Where |
|---|---|---|---|
| M5 | A tool tap with nothing picked silently picks the Reveal instead of showing the hint + strip. | **MUST FIX** | `stage-tools.tsx` `pickTool` (`if (!picked && parts[0]) return pickPart(parts[0])`) |
| M6 | Reveal kinds are a pill row — "any set of choices is ONE dropdown". | **MUST FIX** | `add-part-sheet.tsx` `RevealPartTools` |
| M7 | "This stage · Shown \| Hidden" segmented — same rule; prototype Arrange uses "On this stage ▾". | **MUST FIX** | `add-part-sheet.tsx` `RevealPartTools` |

---

## 4 · A part picked → Style (Countdown) · `side-04-part-style-look.png`

Measured — prototype panel 406 (50 %) · segmented Look \| Background \| Arrange 355×44 · dark "Edit in Studio › Info — OR TAP THE WORDS ›" bar 355×44 · layout carousel cards 220×128 **real previews** (the countdown drawn in each layout) · one footnote line. Built panel 406 ✓ · quiet row "Edit in Studio › Info ›" 44 (plain text link) · layout carousel cards 156×95 **text cards** (name + sentence + "Recommended") · then BACKGROUND as a 4-column grid of 7 bordered tiles (70 px) · SHOW segmented Shown \| Auto \| Hidden (48) · ORDER "Move up / Move down" buttons (44) · Alignment "As the scene" (40) · one long scroll (`panel.scrollHeight` > panel).

| # | Difference | Grade | Where |
|---|---|---|---|
| M8 | No **Look \| Background \| Arrange** segmented control; everything is one scrolling column. | **MUST FIX** | `stage-tools.tsx` (asks the work area for the scene's whole sheet) + `website/editor/_components/element-sheet.tsx` / `part-inspector.tsx` |
| M9 | Layout carousel shows text cards, not real previews of the part in each layout. | **MUST FIX** | `website/editor/_components/scene-style-row.tsx` (`[data-style-carousel]`) |
| M10 | Background is a 4-col **tile grid** of 7 bordered tiles (No background · Plain · Diagonal · Glow · Opaque · Frosted · Upload media ◆) + Shape segmented (Framed \| Full width) + Opacity slider. Prototype: ONE "Background ▾" dropdown row, a Colour swatch row, Gallery ▸ / Upload ◆ pills, Shade ▾ only once a photo is chosen — all 44 px. Breaks both the dropdown rule and no-boxes. | **MUST FIX** | `website/editor/_components/scene-background-row.tsx` |
| M11 | Row heights: carousel cards 95, background tiles 70, Show 48, Alignment 40 — the rule is 44 everywhere. | **MUST FIX** | same files as M8–M10 |
| M12 | Arrange: "Shown \| Auto \| Hidden" segmented and "Move up / Move down" buttons instead of "On this stage ▾", "Order · n of N ◀ ▶", "Alignment ▾", "Spacing ▾". Spacing is missing. | **MUST FIX** | `part-inspector.tsx` (`<ISection>Show</ISection>`, Order) |
| M13 | The picked part is **not centred** in the preview above the panel — its outline sits at the top edge under the toolbar (frame top = 60). Prototype `centrePicked()` scrolls the part to the centre of what is left, 240 ms after the panel rises, and pads the page bottom so the last part can centre too. The built `scrollTo` message fires but the canvas aligns to the top. | **MUST FIX** | `stage-tools.tsx` (`postToCanvas … 'scrollTo'`), `app/[slug]/_components/editor-bridge.tsx` scrollTo handler |
| S7 | The quiet row is a plain text link; prototype is a full-width dark pill "▤ Edit in Studio › Info · OR TAP THE WORDS ›" (both 44). | SHOULD FIX | `STAGE_QUIET_ROW` |
| S8 | A gold 2-px ring is drawn around the whole open panel (visible in every built shot with a tool open) — reads as a focus outline on `[data-phone-chrome="panel"]`; the prototype has none. | SHOULD FIX | `maker-lower-third.tsx` / `maker-shell.tsx` panel styles |
| S9 | Prototype outlines the picked part with a label badge ("COUNTDOWN") on the outline's corner; built outline has no name. | SHOULD FIX | `editor-bridge.tsx` `mark()` |

Part edges: ＋ on the top and bottom edge, 🗑 top-right, grip right — present in both and in the same places. ✓ (`add-part-sheet.tsx` `PartEdits`.)

---

## 5 · Style › Background and Arrange · `side-05-part-style-background.png`, `side-06-part-style-arrange.png`

Covered by M8, M10, M11, M12 above. The owner's production screenshot (Background in the new panel) adds: an "Own background · ↺ Use the Event Hub's" pill, a Colour hex dropdown + colour wheel, Opacity slider, Shape segmented, then SHOW (Shown \| Hidden) under Background. Show belongs in Arrange (prototype), not under Background → folded into M12.

---

## 6 · Text · `side-07-part-text.png`

Prototype: Font row (Aa · name ▾), Colour row (theme swatch + five palette swatches + ink + custom), Size row (slider + %) — three 44-px rows, then one hint line. Built: Font · "Event Hub font ▾" (44) ✓, Size · − / + stepper (44), Colour · "Theme ▾" dropdown + colour wheel (44); the rest of the panel is empty.

| # | Difference | Grade | Where |
|---|---|---|---|
| S10 | Size is a −/+ stepper, not a slider with a % readout. | SHOULD FIX | `part-inspector.tsx` `<IRow label="Size">` |
| S11 | Colour is a dropdown + colour wheel instead of the five palette swatches (+ theme + ink + custom). The dropdown itself is rule-compliant; the wheel beside it is a second control for one choice. | SHOULD FIX | `part-inspector.tsx` `<IRow label="Colour">` |
| S12 | Controls fill only the top 40 % of the half-screen panel; prototype rows flex to fill it. | SHOULD FIX | `stage-tools.tsx` panel layout |

Rows are 44 ✓. Order Font · Size · Colour vs Font · Colour · Size — trivial.

---

## 7 · Animate · `side-09-part-animate.png` (lab) + owner's production screenshot

Prototype: segmented **Build in \| Action \| Build out** (44) → "◆ HOW IT MOVES · Auto ▾" (44) → 44-px toggle rows Fade · Blur · Move (with ← → ↓ ↑ direction buttons) · Size (Grow \| Shrink), then Duration / Delay sliders, then "◆ Into the next scene ▾"; Action = Does ▾ · Timing ▾ · Parts ▾. Lab (a scene): "HOW IT MOVES ◆ PRO · Auto ▾", an explanation line, "INTO THE NEXT SCENE ◆ PRO · Scroll ▾", a "▶ Preview" button, another explanation line — no phases at all. Owner's phone (a part): one long list — "◆ Event Hub Pro" label, BUILD IN with four separate dropdown rows Fade ▾ · Move ▾ · Size ▾ · Blur ▾ (all None, ≈65 px each), ACTION · During ▾ (Still), WHEN IT PLAYS · Plays once ▾; Build out not visible without scrolling.

| # | Difference | Grade | Where |
|---|---|---|---|
| M14 | No **Build in \| Action \| Build out** segmented control; the three phases are stacked sections in one scroll, Build out below the fold. | **MUST FIX** | `part-inspector.tsx` (`<ISection>Build in / Action / Build out`), `stage-tools.tsx` |
| M15 | Each effect is its own dropdown row (~65 px) instead of a 44-px toggle row with its value on the right and direction buttons for Move. | **MUST FIX** | `part-inspector.tsx` Build-in rows |
| M16 | No "How it moves ▾" preset row above the effects on a part; no Duration / Delay sliders. | **MUST FIX** | `part-inspector.tsx` |
| S13 | Explanation sentences ("Auto follows the theme…", "Plays this scene, then the move…") sit in the panel; the owner's rule is helper text behind ⓘ. | SHOULD FIX | `element-sheet.tsx` scene animate |

"Into the next scene ▾" exists in both. ✓

---

## 8 · Names picked — the typeable part · `side-14-names-picked.png` (lab) · `side-14b-names-tapped-OWNER-PROD.png` (production)

Prototype: tapping the names selects them (one outline with ＋ top/bottom, 🗑, grip, "EVENT NAME" badge), centres them, the panel rises to 50 % with Style · Text · Animate, Look shows the dark "Edit in Studio › Info · OR TAP THE WORDS ›" bar and the names' layout carousel (Classic · Stacked · …). A second tap on the words types in place: the panel slides away, the keyboard takes the bottom half, Done brings the panel back. Lab (tile tap): panel rises, quiet row "Edit in Studio › Info ›", then **"Part · Pick a part ▾"** and nothing else — no layouts. Owner's phone (page tap): the new panel **disappears entirely**; the shipped floating type bar "✓ Done · Wording ▾ · Style ▾ · Hide" sits at the bottom; a large empty white area between the page and the bar; TWO overlapping gold frames (one hugging "Indalecio", one around the whole names block); the names pinned at the top, not centred.

| # | Difference | Grade | Where |
|---|---|---|---|
| M17 | **A tap on a part of the page falls through to the old floating TypeBar instead of the new panel** — the single biggest gap. Every part tap in production (names, date, …) does this. The new panel treats `t:'type' phase:'start'` as "typing" and hides itself; the canvas sends that on the FIRST tap, not the second. | **MUST FIX** | `website/editor/_components/type-in-place.tsx` (TypeBar), `stage-tools.tsx` (`setTyping(true)` on `d.t === 'type'`), `app/[slug]/_components/editor-bridge.tsx` (`typeablePart` → type on first tap) |
| M18 | Dead white gap between the page preview and the floating bar while the panel is away (the lower third keeps its height, empty). | **MUST FIX** | `stage-tools.tsx` (`translate-y-[110%]` leaves the lower third's room), `maker-lower-third.tsx` |
| M19 | Double highlight: the canvas's `mark()` outline (`editor-bridge.tsx`) AND the type-in-place caret-part outline both draw. Prototype: one outline. | **MUST FIX** | `editor-bridge.tsx` `mark()`, `type-in-place-canvas.ts` |
| M20 | Names' Style shows no layout carousel (lab: "Part · Pick a part ▾" + blank). | **MUST FIX** | `stage-tools.tsx` `askTool` (opens the part inspector, not the scene's style row), `part-inspector.tsx` |
| M21 | Picked part not centred (names pinned at the top edge). Same as M13. | **MUST FIX** | see M13 |

---

## 9 · Date picked — a Suppliers-sourced part · `side-15-date-picked.png` (lab) + owner's production screenshot

Prototype: Date is NOT typeable on the page; Look shows "🛍 Change the date in Suppliers · SUPPLIERS ›" + the date's layouts; the part is centred. Lab: quiet row "Change the date in Suppliers ›" ✓, then nothing. Owner's phone: the old floating bar "✓ Done · **Format ▾** · Style ▾ · Hide", blank gap, date pinned at the top.

| # | Difference | Grade | Where |
|---|---|---|---|
| M22 | Date offers Format ▾ on the page (typeable path) although its source is Suppliers. | **MUST FIX** | `type-in-place.tsx` (Format ▾ for date/time), `lib/maker-parts.ts` `makerPartSource` → `editor-bridge.tsx` typeable gate |
| M23 | No layout carousel for the date in Style (lab shows the quiet row then blank). | **MUST FIX** | as M20 |

---

## 10 · Studio-sourced / per-guest parts — E-Gifts, What to wear, Dress code · `side-15c-gifts-picked.png`, `side-17-dress-picked.png` + two owner screenshots

Prototype (Dress code): "✎ Edit the Mood Board & Dress Code · STUDIO ›" bar, the five-layout carousel with REAL previews, "PALETTE LOOK · Tags ▾", footnote. Lab (Dress code): "Edit the Mood Board ›" ✓, text-card carousel (Colours and roles · The palette · The line), "Palette · Tags ▾" ✓, then the background tile grid. Lab (E-Gifts): "Edit the E-Gifts ›" ✓, then two explanatory sentences and a large empty area. Owner's phone (What to wear): Style = ONLY two sentences ("Each guest sees what they wear…" / "Each guest sees their own look…") and empty space; no quiet row; part not highlighted or centred. Owner's phone (E-Gifts): quiet row ✓, then a **bordered box** with two sentences, then empty; highlighted at the top edge, not centred.

| # | Difference | Grade | Where |
|---|---|---|---|
| M24 | Studio-sourced and per-guest parts get **no layouts / Background / Arrange in Style** — only explanatory sentences (prod) or sentences + blank (lab E-Gifts). | **MUST FIX** | `stage-tools.tsx` `askTool`, `lib/maker-parts.ts` (parts without `el`/scene style), `element-sheet.tsx` |
| M25 | Helper sentences in the panel, in a bordered box — owner rules: helper text behind ⓘ, no cards or boxes. | **MUST FIX** | `element-sheet.tsx` / `part-inspector.tsx` note blocks |
| M26 | What to wear: no quiet "Edit the Mood Board ›" row and no selection highlight/centring. | **MUST FIX** | `lib/maker-parts.ts` `makerPartQuietRow` (per-guest `my*` parts return null), `stage-tools.tsx` |
| S14 | Quiet row words: built "Edit the Mood Board" vs prototype "Edit the Mood Board & Dress Code · STUDIO ›" (the source as a small trailing label). | SHOULD FIX | `lib/maker-parts.ts` `MAKER_STUDIO_TOOL_LABEL`, `STAGE_QUIET_ROW` |

---

## 11 · ＋ add sheet · `side-12-part-edges-and-add.png`

Prototype: a bottom sheet "ADD BELOW COUNTDOWN · PARTS" grouped (Words · When & where · Your story · For each guest · …) with icon-chip buttons "+". Built: the ＋ buttons draw on the part's edges (visible) but live inside the canvas overlay; the lab run could not open the sheet by script (no reachable "Add" control in the parent document).

| # | Difference | Grade | Where |
|---|---|---|---|
| L1 | ＋ sheet contents and styling not judged here. | LAB LIMIT | `add-part-sheet.tsx` |

---

## 12 · Studio home · `side-18-studio-home.png`

Prototype: "Studio · 10 of 11 ready", 11 tiles in two columns, each icon · ✓ or Missing badge · name · one status line · "FULL SCREEN" on the immersive ones. Built: "Studio · 0 of 11 ready", same 11 tiles in the same order, same words, "FULL SCREEN" on Wedding March / Seat plan ✓. No ✓/Missing badges in the lab (fixtures carry no `done`). Icons differ (Logo = diamond vs monogram; Mood Board = shirt vs palette; Schedule = calendar-clock vs clock).

| # | Difference | Grade | Where |
|---|---|---|---|
| L2 | ✓ / Missing badges — lab fixtures have no readiness; judge on prod. | LAB LIMIT | `studio-home.tsx`, `lib/studio-tiles.ts` |

Tiles ARE cards in the prototype too (the owner approved that), so no no-boxes finding here. ✓

---

## 13 · Studio › Info · `side-19-studio-info.png`

Prototype: "INFO ▾ · ✓ Saved" row (44), then ONE form — YOUR EVENT (Event Name · A note from us · Opening line · What to bring · Special message · Countdown line), TITLES, YOUR EVENT HUB — rows at 44+, saves as you type. Built: "Info ▾" pill under the toolbar, then the OLD Details "ask one by one" question card ("YOUR EVENT · Thank-you message · Used on E-Gifts" with a preview card), and a floating card panel "Your event ▾ · Thank-you message · Guests see this right away ⓘ · Your own words (bordered box) · suggestion chips".

| # | Difference | Grade | Where |
|---|---|---|---|
| M27 | Info is the old one-question-at-a-time Details flow, not the prototype's single form. | **MUST FIX** | `details-your-event.tsx`, `details-workspace.tsx`, `studio-tools.tsx` (what Info opens) |
| M28 | Suggestion chip row ("So we can choose together · Plainly put · …") = a set of choices as pills. | **MUST FIX** | `details-your-event-parts.tsx` / `opening-line-field.tsx` |

---

## 14 · Studio › Look (four tabs) · `side-21-studio-look.png`, `side-22-studio-look-colours.png`

Prototype: the four tabs ARE the panel's top row — segmented **Background \| Colours \| Fonts \| Music** (44) beside ▶; Background = one explanation line, a carousel of REAL background previews (Plain colour · Diagonal · …), Colour swatch row, Shade ▾. Built: lower third at the collapsed 236 px with a "Look ▾ · Background" heading row and **four bordered tile cards** (Background · Colours · Font · Music, ≈ 190 px tall) as the tab control; Colours = a floating card with a side rail ("C · Colours · ‹ ›"), "Page ⓘ · Default ▾" dropdown + colour wheel + swatches. The lab's canvas is blank in Look (frame 0×0).

| # | Difference | Grade | Where |
|---|---|---|---|
| M29 | Look's four sections are tall bordered cards, not a 44-px segmented control in the top row; the panel does not rise to 50 %. | **MUST FIX** | `studio-tools.tsx` (Look's bar), `details-look-pages.tsx` |
| M30 | Colours opens the old floating-card + side-rail layout, not the prototype's rows in the panel. | **MUST FIX** | `details-look-pages.tsx`, `maker-theme-picker.tsx` |
| L3 | Background carousel previews / Shade — the lab canvas is blank, so the real previews cannot be judged. | LAB LIMIT | `studio-tools.tsx` |

---

## 15 · Studio › Mood Board, Logo, RSVP, Prints · `side-25-studio-*.png`

- **Mood Board** — prototype: "MOOD BOARD ▾ · ✨ Auto · ✓ Saved", segmented Colours \| Attire \| Inspiration \| Do's & Don'ts, five-colour rows. Built lab: the "Mood Board ▾" pill opens the **Background** panel ("Behind every scene · Just the colour"). The Logo tile does the same. → **L4 LAB LIMIT** (`maker-lab-shell.tsx` routes `studio` tiles to stand-ins; verify on prod — if prod also lands on Background, it is a routing bug in `maker-shell.tsx` `openStudio`).
- **Logo** — prototype: the shipped logo editor redrawn (square canvas · ▶ Play · Layers \| Edit tiles · Name · Image · Colour · Size and place). Built lab: see above. → **L5 LAB LIMIT** (`maker-logo.tsx`).
- **RSVP** — built lab: "The RSVP settings is read from the database — open it in the Maker." → **L6 LAB LIMIT** (`maker-rsvp-ask.tsx`).
- **Prints** — prototype: "PRINTS ▾ · ✓ Saved", the invitation set as rows with "Save · Classic (PDF)" / "Save in your theme ◆" buttons, a "Download the set" bar. Built: "Prints ▾" pill, "INVITATION SET · The Invitation" preview, a floating card "The Invitation ▾ · Size 5 × 7 in ▾ · Parents on the invitation ⓘ (toggle) · Opening line (toggle) · **Faith · Formal · Warm · Filipino** chip row".
  - **M31** The opening-line tone chips are a pill row — one dropdown. **MUST FIX** — `maker-prints.tsx` / `opening-line-field.tsx`.
  - **L7** The piece list + Save buttons could not be compared further (lab shows only the first piece). LAB LIMIT — `maker-prints.tsx`, `lib/print-pieces.ts`.

---

## The ten to fix first (money-on-the-screen order)

1. **M17** — every part tap on the page falls through to the old floating TypeBar; the new panel vanishes. `type-in-place.tsx`, `stage-tools.tsx` (`typing`), `editor-bridge.tsx`.
2. **M1** — the retired guided picker covers the page in Stages. `maker-shell.tsx` (`openDetails` branch), `stage-picker.tsx`.
3. **M24 / M20 / M23** — Studio-, Info- and Suppliers-sourced parts get no layouts / Background / Arrange in Style, only sentences or blank. `stage-tools.tsx` `askTool`, `lib/maker-parts.ts`.
4. **M8** — no Look \| Background \| Arrange segmented; one long scroll. `stage-tools.tsx` + `element-sheet.tsx`.
5. **M10** — Background is a 7-tile grid + Shape segmented, not "Background ▾" + swatches + Gallery/Upload. `scene-background-row.tsx`.
6. **M14 / M15** — Animate has no Build in \| Action \| Build out segmented; effects are ~65-px dropdown rows, not 44-px toggles with direction buttons. `part-inspector.tsx`.
7. **M2 / M3** — collapsed panel is 236 px of bordered tiles, not one 62-px row. `lib/maker-phone-room.ts`, `STAGE_PART_TILE`.
8. **M13 / M21** — the picked part is never centred in the preview. `stage-tools.tsx` scrollTo → `editor-bridge.tsx`.
9. **M9** — layout carousel is text cards, not real previews. `scene-style-row.tsx`.
10. **M18 / M19** — dead white gap while typing; double gold highlight. `stage-tools.tsx`, `editor-bridge.tsx` `mark()`.

Then: M12 (Arrange as dropdowns + Spacing), M5–M7 (tool tap with nothing picked / Reveal pills), M22 (Date not typeable), M25–M26 (helper text behind ⓘ, no boxes; What to wear quiet row), M27–M31 (Studio Info form, Look tabs, Colours, Prints chips), M4 (stage sheet without the page accordion).

---

### How this was measured (so it can be re-run)

```
# prototype — served from its folder, ?shot disables animations
python3 -m http.server 3498   # in Setnayan/prototypes
node scratchpad/proto.js      # Playwright, #phone 375×812, getBoundingClientRect per state

# built — a detached worktree of origin/main, never ~ and never the main checkout
git worktree add --detach ../wt-review origin/main && pnpm install --frozen-lockfile
pnpm exec next dev --port 3477   # apps/web, .env.local copied read-only
node scratchpad/built2.js        # 375×812 isMobile hasTouch; /dev/maker-lab?ss=1
```

Prototype actions were driven through its own `data-act` buttons and a dispatched click on `.el[data-el=…]`; built actions through `[data-stage-part=…]`, `[data-stage-tool=…]`, `[data-stage-item-menu]`, `[data-studio-tile=…]` (`stage-tools.tsx`, `studio-home.tsx`).
