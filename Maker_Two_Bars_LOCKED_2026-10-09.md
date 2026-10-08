# The Maker's two bars — owner-approved design, 2026-10-09 (night session)

Working reference (clickable): `wt-review/apps/web/public/review/studio-head-prototype.html`
→ http://localhost:3480/review/studio-head-prototype.html · generator `/tmp/claude-501/head/gen2.mjs` (backups gen2.v*.mjs).
Real pictures of today's toolbars: `/review/toolbar-today.html`. Stage map: `STAGES-MAP.md`. Every sentence in quotes is the owner's.

## Top bar — BUILT (I1, commit 4377046bc, merged in the review copy, seen at 375)
`[ ✕ ] [ Invitation ▾ | Studio ▾ ] [ ↺ ] [ ✓ ]` in a stage · `[ ✕ ] [ Stages ▾ | Love Story ▾ ] [ ↺ ] [ ✓ ]` in a Studio page.
- "Stages and Studio both has dropdown" — both halves always have ▾; a tap on either opens ITS list (5 stages / 11 pages); a pick takes you there. The half you are on reads the stage/page name.
- "keep selector always balanced in width no matter what is pressed" — halves always equal.
- "after picking a drop down, the selector needs to animate still and the drop down still needs to have the same effects as dropdown" — thumb slides; ▾ turns while open; press dip + ring. (Check in the real bar.)
- ✕ left everywhere. Short names only: Mood Board, March. No title row on any Studio page ("we will not have these").
- Studio home (cards) is unreachable from the bar; still the landing for outside doors. OPEN: delete it or keep.
- Known fix: the page list's Love Story line still says "Chapters with a photo" → moments.

## Bottom toolbar — DESIGN APPROVED IN PROTOTYPE, NOT BUILT
Shape: "make toolbar just the lower third" → then "maybe increase it a bit more just enough to place 4 clean rows" → "330 px it is" on a tall phone:
handle 14 + "You're editing · Stage › Page › Part" line 20 + selector band 52 + four rows (48 px, 6-px gaps = 210) + safe area 34
("make sure we have space away from the switch screen line"). Small phones: rows 44 / gaps 4 (≈ 284 px). Real build: `padding-bottom: max(10px, env(safe-area-inset-bottom))`.
- "make the upper part of the bottom toolbar curve"; grab handle ABOVE the editing line ("but this above your editing").
- The lower third's stage dropdown is REMOVED ("means we can remove this"); the guests' bar (Welcome · Details · …) stays a BAR under the sample ("that is the bottom nav of the actual event hub" · "our goal is to make it simple to understand").
- NO part tiles in the toolbar ("these are not the tools…"). "on preview screen, you only select. You can change the content there via edit" — a tap on the page only selects (frame + name tab); no typing on the page; no buttons on the frame.
- Something is always picked on arriving (first part the page DRAWS — `ordered()`) [controller's call].
- SELECTOR: "so it is just Edit | Style | Background | Animate" — four tools, words only, as wide as their words (301 px at 375, 286 at 360), ▶ Play stays in the row.
- "the rule is always start from the top" — rows fill from row 1; empty rows at the bottom; NO vertical centring; nothing scrolls vertically (only card strips swipe sideways).
- No Font in the toolbar ("there is already a universal font" → Studio › Look › Elements › Font). No Arrange ("i don't think we need the arrange anymore": no Alignment, no Spacing, no On-this-stage). No "Add a part" ("I don't think adding is good here") → OPEN: where a part is added.
- "there should always be animate and background?" → "yes that is what we are doing. giving the freedom to fix their event hub." — Animate live for EVERY element; Background live for every BLOCK; Background grey only for single lines inside the cover (Logo, Title, Names, Invite line, Date, Place, Link). NEW ABILITY for fixed blocks (March, E-Gifts, The details, What to wear, Seats, Pass…): real build work AFTER the toolbar; not sized.

### EDIT
- RULE (owner, 2026-10-09 morning): "if the edit is just text, then don't need to jump. but it can both adapt to whichever is edited. same goes to simple edits. Only jump if it has editing that cannot be done there. Example: Schedule, Love Story, Wedding March, Logo".
- Rows 1–3: text and simple values are edited RIGHT THERE — one Form-row field per short text of the part (up to three rows), the field for the text last tapped comes first ("adapt to whichever is edited"); a simple single choice = its dropdown / switch. Same writes as the shipped typing door (one editor per fact).
- Jump ("Open in Studio › <page>", ONE button in row 1) ONLY where editing cannot be done in three rows: Schedule, Love Story, Wedding March, Logo (his examples); by the same test E-Gifts ways to give, the RSVP form, Mood Board & Dress Code colours, Seat plan [controller's reading — builder to list each part's side].
- Date / Place → "Change it in Suppliers".
- Row 4 ALWAYS ("always set this as the last row"): ↑ Earlier · ↓ Later · Remove (red; asks first). No Add.
- Venue's Map row removed ("remove these details") → needs a home with venue details. Post Event scenes: heading field + "Shown to guests" switch.

### STYLE
- Rows 1–3: look cards — a carousel, "maximize the height … portrait", long one-line text up to 60 % width, picked one centred with previous/next visible; previews centred and scaled to fit, never cut.
- Row 4: "color and size share the same row" — Colour = ONE circle that opens the colour picker ("Color just 1 circle…") + Size bar.
- Dress code: rows 1–2 cards · "row 3 is palette style" (Tags · Fabric swatches · Paint chips · Circles · Ribbon — `lib/palette-looks.ts`) · row 4 Colour + Size. Its Do's & Don'ts looks have no row → controller rec: Studio › Mood Board & Dress Code. OPEN.
- A part with no Colour/Size → cards take all four rows.

### BACKGROUND — "copy the background on studio look"
- Row 1: the SOURCE dropdown, full width, no label ("remove the Background Text"): The Event Hub's · Colour · Scene ◆ · Video ◆ · Upload ◆ (the Look's own sources + the first choice).
- Row 2: that source's cards strip (Colour: Plain · Dawn · Diagonal · + element-only Glow · Opaque · Frosted [controller kept them]; Scene: the ready-made scenes — "Gallery should be a different background type"; Video: loops; Upload: button → thumbnail + Change).
- Row 3: Colour → colour circle → second colour (Opacity bar for Opaque/Frosted); media → ONE "Darker ↔ Lighter" line bar ("darker lighter line bar").
- Row 4: Framed | Full width (+ Still | Parallax for photos).
- REMOVED: "More", In frame ("no picking where just automatic center"), Use-where ("it is meant for just this element"), How close/zoom ("remove how close. when a media is picked it will just fit it properly. parallax will just zoom it enough…" → auto ~1.12). Real build: darker/lighter becomes a number in the canvas JSON (no migration).

### ANIMATE
- Row 1: Build in | Action | Build out. "action is the action when it is on screen and not leaving the screen" · "it is like how it moves as it sits there".
- Build in / Build out — one layout ("build in no duration" · "make it similar to build out"): row 2 Fade · Blur · Move · Size; row 3 only what the ON ones need (From/To ▾ · Grow | Shrink, halves); row 4 Movement ◆ + Delay (in) / Movement ◆ + Next scene ◆ + Delay (out). NO Duration. (Build out's Delay is new — owner told; may drop.)
- Action ("action does not need next scene and timing"): row 2 Still | Drift; row 4 Movement ◆.
- "Rows" (scenes that have it) sits beside Movement.

## Not in the prototype yet
The Day and Post Event (toolbar says "Not built in this prototype yet"); six parts the page does not draw (`canvas: null`).
## Things with no home yet (owner to decide)
Where to add a part · the ⓘ explanations · Venue's Map choice · Dress code Do's & Don'ts look · the third "note" toast look · Studio cards page keep/delete · E-Gifts ways-to-give live vs Apply · what "finish the guest list" covers.

## The Day › Camera (owner, 2026-10-09 morning)
"Camera is a full screen design" — the sample IS the camera, edge to edge, one part. "camera greyed out background and animate" · "edit is greyed out too. only have style" — on the Camera ONLY Style is live (the three camera looks as tall phone-shaped cards: Classic · Your brand · Challenges, `lib/camera-look.ts`); Edit, Background, Animate are grey; no Earlier · Later · Remove. Styles only — no adding pieces (controller's recommendation; he asked "add elements … or just different styles?").
