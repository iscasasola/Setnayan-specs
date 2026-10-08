# Studio › Look — amendment 2026-10-08 · Fable (Background · Elements · Music · the sample screen)

**Design + prototype only. Nothing here is built.** Prototype: `prototypes/background_sources_amend_2026-10-08_fable.html` (self-contained, every control works; `?shot=<id>` isolates a frame). Captures: `prototypes/background-sources-amend-2026-10-08/` (18 at 375 × 812, 2 at 900 × 700, headless Chromium on the static file).

Amends `BACKGROUND_RESTUDY_2026-10-08_fable.md` (approved) as built in PR #6426 (three tabs) · #6431 (Background source cards) · #6442 (Elements roles, draft) · #6434 (Our music, draft). Code read from a detached worktree of `origin/rd/background-source-cards` @ `9613cab24` (and `git show` of `origin/rd/elements-roles`, `origin/rd/hub-music-our-music`) — never `~`, never the main working copy.

Owner, verbatim, 2026-10-08, using the built Look on the local copy:
- **A · Background** — *"Color / no more Pattern / Scene / Video / Upload · When color is picked: Color Picker can be 2. so it can become ombre to do dawn/diagonal/glow for the 2 colors · Just place 2 circle palette like moodboard where they pick the color there · Effects: Lantern / Parallax / etc · when scene, video or upload is picked: I want a line bar where it can fade to white or fade to black · fade to white drag line bar to right · fade to black drag to left · snap to center · Effects: Lantern / Parallax / etc"*
- **B · Elements** — *"remove magic move · remove Palette Type · Line up 5 circle colors · Light/Dark (so we can see what complementing color to support their light and dark mode depending on what the background is. · Choose 2/3 fonts? how many fonts are used on the website? · Pick Button Shape (color is on the palette already so no need to add)"*
- **C · Music** — *"Pick a music from our listing or upload your own"* · *"skip the apple concept"*
- **D · The preview** — *"our preview should not be this. but a sample of the header text, buttons on the actual screen"*
- **Rules** — *"follow our rules on how buttons, dropdown, space is used. We can use carousel style on certain parts"*

---

## 0 · Verdict, five lines

1. **Every ask is an arrangement of what ships** — one new stored fact in all of Look (the Text font), one format extension (a second hex in the ombré string), one numeric extension (the fade), one new JSON key already planned by the restudy (`main.effect`). No migration beyond the `site_roles` column already in the release bundle (and it is narrowed, not widened).
2. **The sample screen replaces the two guest-page iframes** above Look: a specimen drawn in the browser from the draft's values — names, eyebrow, date, a line, the two real buttons, a gild detail — on the real background. Every pick shows at once; a Look open costs 0 guest-page renders instead of 2.
3. **Background:** Pattern leaves the list (a stored one keeps rendering, named, with Change); Colour is two Mood-Board circles; Scene · Video · Upload get ONE fade bar (black ← centre → white, snaps) in place of Shade ▾; Effects ▾ on every source holds Lanterns · Petals · … (one at a time) + Parallax ◆ + Blur + Candlelight ◆.
4. **Elements:** the five in one line (the Mood Board's own five, one home); a Light/Dark PREVIEW switch (not stored); two fonts — Headings · Text; button shape only. Magic Move and Palette type leave Look. Row 3's four role rows are superseded; its column survives for one field.
5. **Music:** #6434 already matches the owner's sentence; two words change ("Your music" → "Upload your own"), nothing else.

## 1 · What changes against the approved restudy (as built)

| Restudy / built | Now | Why (owner's words) |
|---|---|---|
| Canvas above Look = `LookFrame` → `MakerPageFrame`, an iframe of the guest page (and a second, hidden stage canvas — L2 measured 2 documents per Look open) | **One sample screen**, ~250 px tall at 375, drawn client-side (§ 2.D) | *"a sample of the header text, buttons on the actual screen"* |
| Source ▾ Colour · Pattern · Scene ◆ · Video ◆ · Your photo or video ◆ | Source ▾ **Colour · Scene ◆ · Video ◆ · Upload ◆**; Pattern read-only while stored | *"no more Pattern"* · *"Upload"* |
| Colour row = one `StudioColourField` | **Two circles** (page colour → optional second); Dawn · Diagonal · Glow blend 1 → 2 | *"Color Picker can be 2 … like moodboard"* |
| Shade ▾ Darker · Dark · As is · Light · Lighter · Candlelight | **One fade bar** on Scene · Video · Upload; Candlelight → Effects | *"a line bar … fade to white … fade to black … snap to center"* |
| Motion ▾ · Blur ▾ · Focus ▾ rows; Effect ▾ + Intensity ▾ planned (row 8) | **Effects ▾**, one sheet on every source: On top (one at a time + How much ▾) · Parallax ◆ · Blur ▾ · Candlelight ◆. Focus ▾ stays its own row, own photos only | *"Effects: Lantern / Parallax / etc"* |
| "Your cover photo" card | **Gone** — the cover photo is one of "their photos" in Upload, no special card | *"why same as hero?"* |
| Elements = Colours heading · Magic Move ▾ · Palette ▾ · five stacked colour rows · Font ▾ · Buttons Shape ▾ Fill ▾ Colour ▾ (built) / four role rows (row 3) | **Light·Dark switch · five circles in one line · Headings ▾ · Text ▾ · Buttons shape cards** | the six-line Elements note |
| Music Source ▾ Our music · Your music (built) | Source ▾ **Our music · Upload your own** | *"Pick a music from our listing or upload your own"* |

## 2 · The design

### 2.A · Background
- **Source ▾** Colour · Scene ◆ · Video ◆ · Upload ◆. The ◆ marks are the built ones (`BACKGROUND_SOURCE_IS_PRO`: scene/video/own true). "Pattern · kept" appears in the sheet only while a pattern is stored, greyed and marked, never re-pickable once left.
- **Colour** = two wells drawn as the Mood Board's palette circles (`mood-board-studio.tsx`: a 44-px tap target, a 28–30 px circle, a ringed "+" for the empty slot). Well 1 = the page colour; well 2 starts "+" and is optional; ✕ on it removes it in one tap. Both open the ONE picker (`ColourPickerSheet`, #6427) with shelves Now · Your Mood Board · Goes with your Mood Board · Swatches · Custom; the second well's sheet carries "Remove the second colour". With one colour the cards are Plain · Dawn · Diagonal · Glow as shipped (the ramp of that colour, `OMBRE_LIFT`/`OMBRE_DROP`). With two, Dawn · Diagonal · Glow run colour 1 → colour 2 (anchors replaced, the 9-step OKLCH interpolation unchanged) and **Plain is greyed, "one colour"** — tapping it says "Plain uses one colour — remove the second first". Recommended over "Plain silently uses colour 1 and drops colour 2": nobody loses a colour by a mis-tap. The cards redraw live with the picked colours.
- **The fade bar** (Scene · Video · Upload): label "Fade", value in words ("As is" · "Lighter 60%" · "Darker 70% · light words"), a 44-px thumb on a track with a black end, a centre tick and a white end. Drag right = a paper veil; drag left = an ink veil; release within ±8 snaps to centre (the thumb's ring turns terracotta at the detent); double-tap or the "↶ As is" button returns to centre. **Readability:** the shipped rule holds unchanged — the veil is the page ink or paper and its strength starts at the bar's value and is RAISED (never lowered) until body words read 4.5 over the picture's measured colours (`requiredScrim`); left of centre the words flip to paper (`shadeWordVars`). The bar never refuses a position; the ⓘ says it: *"The fade never goes under the reading floor — if your words would not read, it is raised a little for you."* Alternative, not recommended: flip the words at a measured point instead of the detent — it makes the flip position vary by picture, and the shipped guard (`shade-never-crosses-the-floor`) is written for the ink-veil-means-light-words rule.
- **Effects ▾** on every source — one sheet, closed row summarising what is on ("Lanterns · Parallax", "Off" dashed when nothing). Sections: **On top · one at a time** None · Lanterns ◆ · Falling petals ◆ · Butterflies ◆ · Sparkles · Confetti · Capiz glow ◆ · Gilded dusk ◆, with **How much ▾** Subtle · Standard · Lavish when one is on; **The picture** Parallax ◆ (switch) · Blur ▾ None · Soft · Strong — on Colour both are shown OFF with the reason ("Needs a picture — a plain colour has nothing to move / blur"), never hidden; **The whole page** Candlelight ◆ (switch). One overlay at a time (the restudy's Overlay ▾ was one; two particle systems at once is a battery cost on a phone); Parallax, Blur and Candlelight combine freely with it. Pro follows the engine reused (reveal + spatial ◆; sparkles/confetti free).
- **Focus ▾** Centre · Top · Bottom stays its own row, shown only for an own PHOTO (a crop, not an effect; `hubMainTakes().focus`).
- **Upload** = their photos and clips as cards (the cover photo among them, by its own name) + an Upload card that opens the shipped `FileUpload` under the strip (deviation 9 of the build status, kept).
- The pick path is #6431's: ring + progress mark from the tap; one aria-live line past 300 ms ("Loading files…" → "Applying to your Hub…"); a refusal puts the old background back with the words and "↻ Try again".

### 2.B · Elements
- **Colours row**: label + ⓘ, and a **Light ◯ Dark** switch (a two-state control = a switch, like Music on/off; not a set of word choices). Under it, **the five in one line** — 5 × 44-px targets with their one-word names (Dominant · Supporting · Accent · Neutral · Accent 2) under each; 5 × 44 + 4 gaps fits 343 with room. A tap opens the ONE picker with the role's job as the subtitle ("Buttons · links · eyebrows (deepened to read)"). These ARE the Mood Board's five: one fact, one home (§ 3).
- **Light / Dark** is a **preview**, not a stored mode. It flips the sample screen between the page's two derivations of the five: *Light* = `buildSitePaletteVars` (paper = the page colour; words = the page ink; eyebrows/links = Accent pulled to 4.5; buttons = Accent pulled deeper until a white label reads; the "&", rules, ornaments = Accent 2); *Dark* = what an ink veil (`shadeWordVars`) or Candlelight (`CANDLELIGHT_WORD_TOKENS`, `[data-art='candlelight']`) does — ink and paper trade places, gild is brightened, Accent lifted to read on dark. So the couple sees the complementing colours BEFORE picking a dark scene or dragging the bar left: dragging to black on Background is the Dark side of this preview; Candlelight is its warm near-black variant. The switch resets to Light on leaving Elements and is never written anywhere.
- **Fonts — the fact from the code.** A guest page today loads: the display face (`--pahina-face` + `--font-display`, the couple's `events.site_font_key` from `HUB_FONTS` — count it with `/usr/bin/grep -c "key:" apps/web/lib/hub-fonts.ts`, 49 on this tree, not the restudy's 45 — else the theme's heading face), the theme's body face (`fonts.body` → `--font-body`/`--font-sans`), the theme's labels face (`fonts.labels`, eyebrows), and on some themes a script face (`fonts.script`). So **three to four faces, of which the couple chooses ONE**. Row 3 (#6442) adds fonts per role (body · button · highlight) in `site_roles`. **The design: two choices — Headings · Text** — each a row whose dropdown shows the face's name IN that face (the sample screen shows the words); "Event Hub font" first in each sheet (the theme's own), then the shipped `FontPick` shelves. **Labels and buttons follow Text.** The page then loads **two faces** (plus the theme's script where the theme has one — see the alternative). **Pairing ▾ is dropped**: with two dropdowns a pairing is a third control for a two-item set and does not earn its place; "Event Hub font" at the top of each sheet is the one-tap way back. *Alternative for the owner:* a third row **Accent (script)** shown only on themes whose pairing carries a script face, for the "&" and the names' flourish → three faces; the storage below already has room for it.
- **Buttons — shape only.** Four phone-shaped cards in a carousel (Default · Square · Rounded · Pill, `HUB_BUTTON_SHAPES`), each drawing the real "Reply" and "Details" buttons in the palette's colour on the current paper. No Fill, no Colour here — the colour is the palette's Accent, deepened until the label reads (the shipped `buildSitePaletteVars` rule); the label ink is `buttonLabelOn`. An event that stored its own `site_button_color` keeps it until changed, with one quiet line "● Your own colour · ↶ Use the palette" beside the Buttons label. The stored fill (`site_button_style`'s second half) is kept as stored and no longer offered.
- Gone from Look: **Magic Move** and **Palette type** (§ 5).

### 2.C · Music (drawn, not redesigned)
Switch "Music" (ⓘ: *"Plays only when a guest taps the speaker — never on its own."*) · **Source ▾ Our music · Upload your own ◆** · Our music = rows (▶ preview per row · title · mood · "2 versions" · the picked one ✓) · Upload your own = the in-place uploader with formats under the button and the codec refusal drawn as one sentence. Rows, not a carousel: a song has no picture, and ▶ beside a name reads better than a card. The speaker sits on the sample screen while Music is open.

### 2.D · The sample screen (replaces the canvas above Look)
- **What it is:** a specimen of the actual guest hero, drawn from the draft in the browser: the eyebrow ("Together with their families", labels face, Accent), the names in the Headings face with the "&" in Accent 2, a gild rule, the date line, one line of text ("Seda Vertis North, Quezon City · reply by November 12"), and the two real buttons — **"Reply to the invitation"** (`.button-primary`: `bg-mulberry` = the derived button fill, `text-cream` = the label ink, `rounded-md` = the shape's radius, `h-11`) and **"Details"** (`.button-secondary`: `border-link/30 bg-cream text-link`, drawn here in the derived secondary ink on a translucent plate). On the real background: the picked colour/blend, scene still, video poster-then-loop, or upload, with the fade veil and the effect layer on top, under the words.
- **Height:** 250 px at 375 × 812 (status 46 + nav 56 + sample 250 + panel 434 + home 26) — about a third of the screen; fixed while the panel scrolls, so the controls stay in the thumb zone and the bar's thumb never sits under the home indicator. At ~900 wide the sample fills a 375-px left column at the phone's width and the controls take the rest (frames A12, B06).
- **Shared:** ONE sample for Background and Elements; Music keeps it and adds the speaker on it (the speaker's place is the Music tab's own control in restudy § 2.3).
- **The whole page in one tap:** the Stages | Studio segment in the top bar IS the door — Stages shows the real page canvas; ▶ (the shipped preview control) shows it full-screen. No new link, no "go elsewhere".
- **It responds at once** to every control because everything it needs is already in hand on the client (§ 3, "Sample screen").

## 3 · THE MAP CARD — verified against the code read

| Control | Stores · where | Read on the guest page by | Storage change | Instant on the sample? |
|---|---|---|---|---|
| Source ▾ | nothing — read off what is stored (`backgroundSourceOf`, `lib/background-source.ts`); `'pattern'` stays in the type, leaves `BACKGROUND_SOURCES` as offered | — | none | yes |
| Colour well 1 | `events.site_bg_color`: a bare `#rrggbb`, or `ombre:<effect>:<hex>` (`lib/ombre.ts`; TEXT, no CHECK) | `guestLookFrom` → `ombreLook` → `GuestGround` | none | yes (client ramp); the server re-measures the words once (as today) |
| Colour well 2 + the blend | **(ii) format extension:** `ombre:<effect>:<hex1>:<hex2>` (≤ 30 chars). `parseOmbre` reads 3 or 4 segments; `encodeOmbre` writes the 4th only when set; `ombreAnchors(base, to?)` uses hex1/hex2 as the light/dark anchors; `ombreLegibility` samples the ramp exactly as today | same | **(ii)** | yes |
| Plain with two colours | not writable (greyed) — Plain is always a bare hex | same | none | — |
| Fade bar | `config_json.main.shade` — today one of `darker · dark · light · lighter` (absent = as is). **(ii):** also an integer −100…100 (negative = ink veil floor \|n\|/100; positive = paper veil floor n/100; 0 = absent). Old words keep reading: darker −70 · dark −45 · light +45 · lighter +70 (`STEP` floors in `lib/main-ground-shade.ts`). New writes are numbers; old rows are never rewritten | `mainGroundLayerFor` → `<MainGround>` (`app/[slug]/_components/main-ground.tsx`), `mainGroundShade` + `shadeWordVars` | **(ii)** | drag: the sample lays the veil client-side (`mainGroundShade` is pure; the picture's samples are in the pick's own read); release: ONE draft write + ONE in-place canvas redraw as today's Shade (`backgroundPickRedraws`) — or zero once the bridge takes the number (row 8's lane) |
| Effects › On top + How much | **new JSON key** `config_json.main.effect {kind, intensity}` on every main-ground shape incl. `{ground:'none'}` — the restudy's row 8 key, unchanged | `<MainGround>` → `lib/ambient-effects.ts` (row 8: reuses reveal petals/butterflies, celebration particles, spatial layers; Lanterns and Sparkles new) | **(ii)** | yes (CSS/canvas layer, no render) |
| Effects › Parallax | `config_json.main.motion:'parallax'` — today only `HubMainOwn` photo (`sanitize…` keeps it for `kind==='photo'`); **widen** to `HubMainLoop` and own clips (`hubMainTakes` widened, row 8 as planned) | `PahinaCoverParallax` / the parallax script | **(ii)** | the sample drifts at once; the page needs its script → 1 redraw (as today) |
| Effects › Blur | `config_json.main.blur: soft \| strong` | `<MainGround>` filter | none | yes |
| Effects › Candlelight | `events.site_art_direction: candlelight \| daylight` (Pro; moves rows, not columns) | shell `data-art` → `[data-art='candlelight']` | none | yes (the sample swaps its tokens) |
| Focus ▾ | `config_json.main.focus: top \| bottom` (photos) | `mainGroundPosition` | none | yes |
| Pattern · kept | `config_json.main = {ground:'pattern', pattern}` — READ ONLY; nothing writes it anew | `PatternGround` | none | — |
| Cover photo (card removed) | `{follow:'hero', of, tint}` stays readable; Look no longer writes it; picking that photo in Upload stores a plain `HubMainOwn {kind:'photo', media}` | `resolveMainGround` | none | yes |
| **Elements — the five** | `events.role_palette.reception[0..4]` (draft key `main_colours`, `MAIN_SLOT`) — the Mood Board's own; editing here edits the same five. **No copy.** | `buildSitePaletteVars` | none | yes |
| Light / Dark | **nothing** — preview only. Light = `buildSitePaletteVars`; Dark = `shadeWordVars` on an ink veil / `CANDLELIGHT_WORD_TOKENS` | — | none | yes |
| Headings ▾ | `events.site_font_key` (free) | `hubFontVars` → `--pahina-face`, `--font-display` | none | yes |
| Text ▾ | **the ONE new stored fact in Look:** `events.site_roles.body.font` — row 3's column (#6438, nullable jsonb, in the release bundle), **narrowed** to `{ body: { font } }` (room for `accent: { font }` if the owner takes the third row). `heading.color · body.color · highlight.* · button.font` are dropped from the sanitiser | row 3's `site-role-look.ts`, reduced: `--font-body` and the labels/buttons faces set from it, layered after the palette | none beyond #6438 | yes |
| Buttons shape | `events.site_button_style` = `<shape>-<fill>`; the design writes the shape and KEEPS the stored fill segment | `resolveHubButtons` → `--hub-btn-*` | none | yes |
| Buttons colour (not offered) | `events.site_button_color` — honoured while stored; "Use the palette" writes null | `buildSitePaletteVars` / `hubButtonColourOffers` | none | yes |
| Magic Move (removed) | `events.site_magic_traveller` stays as stored; nothing in Look reads or writes it | `magic-move.tsx` | none | — |
| Palette type (removed) | its column stays as stored; editable only where the Dress-code part's Style draws `PaletteLookRow` (build-status deviation 2: today only Look draws it — the row moves there with this build, R2's file) | the Dress-code scene | none | — |
| Music switch · pick | `events.bg_music_enabled`; `events.site_bg_music_r2_key` holding `r2://setnayan-media/hub-music/…` for Our music (`lib/hub-music-ref.ts`) or the couple's own upload (#6434: no new column) | `background-music.tsx` | none | the speaker on the sample; audio never loads until ▶ |
| Our music previews | `hub_music_tracks` (PR #6430: public_id · title · mood · r2_key · published) — a stable public address per track; the list is one read on opening Music; a preview streams only on ▶ (minimum-request rule) | — | none | — |
| **Sample screen** | nothing. It needs, all already on the client in the Maker's draft: `site_bg_color` (+hex2), `main` (kind/media/poster/samples/shade/blur/motion/effect/focus), `site_art_direction`, `role_palette.reception`, `site_font_key`, `site_roles.body.font`, `site_button_style`, `site_button_color`, the theme's tokens (`themeBlockVars`), `bg_music_enabled`; the derivations are the pure functions above (`buildSitePaletteVars`, `shadeWordVars`, `mainGroundShade`, `ombreCss`, `hubFontVars`, `resolveHubButtons`) | — | none | **every pick, no server** |

**Storage summary:** no migration. Two format extensions on existing values (a 4th ombré segment; a numeric `shade`), one JSON key already planned (`main.effect`), one widening (`motion` on loops/clips). The `site_roles` column (#6438) is **still needed, for one field**, and should ship narrowed.

**Old → new, so no event changes its look on deploy:** `shade` words → bar positions (above) · `ombre:<e>:<hex>` → well 1 + the style, well 2 empty · a stored pattern → "Pattern · kept" rendering as before · `{follow:'hero'}` → renders as before, Source reads Upload with the cover photo ringed among their photos · Candlelight → Effects › Candlelight ON (Shade ▾'s "Candlelight" row is gone; the fix in #6431 that lets a draft turn a live Candlelight off is kept) · `site_button_color` set → "Your own colour" line · `site_button_style` fill → kept, unchanged · `site_magic_traveller` set → the monogram still travels on those events (§ 5.3) · row 3's `site_roles` with colours → the sanitiser drops them (nobody has one live; #6442 is a draft).

## 4 · The watches (one line each → a guard)

- A main background with `pattern` stored still renders it; `BACKGROUND_SOURCES` as offered never contains `'pattern'`; the Source sheet lists "Pattern · kept" only while one is stored and never writes it.
- `parseOmbre` accepts 3 or 4 segments and nothing else; `encodeOmbre` round-trips both; a 4-segment value's ramp spans hex1 → hex2; `ombreLegibility` clears AA over a sweep of two-colour pairs (extend `ombre.test.ts`).
- With two colours Plain is not writable; removing the second colour is one action and restores Plain.
- `shade` accepts the five words and integers −100…100 only; words map to −70/−45/+45/+70; 0 is never stored; a number's veil is never below the shipped floor (extend `shade-never-crosses-the-floor` to a sweep of positions over every scene's samples and the nine loops').
- The bar snaps to 0 within ±8 on release; "As is" and double-tap write 0; the words flip for every negative position and for none ≥ 0.
- `main.effect` sanitises to a known kind + intensity on every ground shape; Parallax/Blur are refused (not stored) on `{ground:'none'}` and on a pattern; the Effects row never hides them there — it shows them off with a reason.
- Candlelight is written from Effects only; Shade ▾ no longer exists in the Studio's Background (`the-background-has-one-source` row rewritten, not deleted).
- Look draws no "cover photo"/"hero" card; a stored follow still resolves for guests.
- Elements draws exactly five colour controls in one row at 375, each ≥ 44 px, each opening `ColourPickerSheet`; a pick writes `main_colours` and nothing else (no second palette anywhere — the dup-rule).
- Light/Dark writes nothing; the Dark derivation equals what `shadeWordVars` + the gild rule produce for an ink veil (measure against the pure functions, not a fixture that agrees by chance).
- Exactly two font dropdowns; the labels and buttons faces equal the Text face; a guest page loads ≤ 2 couple-chosen faces (+ the theme's script).
- `sanitizeSiteRoles` keeps only `body.font` (and `accent.font` if the owner takes the third row); any colour under `site_roles` is dropped.
- Buttons offers shape only; a write keeps the stored fill segment; a stored `site_button_color` is honoured and shown with the reset line; the label ink is `buttonLabelOn`, never chosen.
- `site_magic_traveller` and the palette-type column are neither read nor written by any Look file.
- Studio › Look mounts 0 `MakerPageFrame`s and 0 guest-page documents on open (count `page.on('request')` as L2 did: 2 → 0); the stage canvas stays for Stages.
- The sample screen's buttons are drawn from `resolveHubButtons`' variables and `.button-primary`/`.button-secondary`'s rules — the same resolver, no second button style.
- Music: a preview request happens only after ▶; opening Music makes one list read; the picked track is marked in the row.

## 5 · The owner's decisions — each with the recommendation (drawn) and the alternative

1. **Pattern (stored, e.g. Dots on a dark paper):** keeps rendering until another Source is picked; the panel names it ("Showing Dots on your page colour · An older look") with ✎ Change. *Alternative:* convert every stored pattern to Colour on deploy — rejected: it silently changes a live look.
2. **"Your cover photo" / "Same as my hero" card:** removed; the cover photo is one of their photos in Upload. The default for NEW events (today `HeroFrameSync` writes a follow) — recommend new events start on the theme's own ground (Video or Colour) and `HeroFrameSync` stops writing a follow; existing follows untouched. *Alternative:* keep the follow as the silent default and only drop the card.
3. **Candlelight:** becomes **Effects › The whole page › Candlelight ◆** (a switch). It is a palette flip of the whole page, not a veil, and the bar's left end is "fade to black" only. *Alternative:* a sixth "Candlelight" stop past the bar's left end — rejected: a stop that changes gild and plates is not a fade, and it would make the bar refuse positions.
4. **Focus and Blur:** Blur → Effects › The picture (a treatment of the picture, beside Parallax, as the restudy grouped them); Focus ▾ stays its own row, own photos only (a crop). *Alternative:* fold Focus into a tap on the picked card — more hidden, not drawn.
5. **Magic Move:** leaves Look. The restudy's home (Stages › Logo › Animate › Action "Travels to the bar", row 9) stands; until row 9 lands it is **retired from the Studio's UI only** — events with `site_magic_traveller = 'mark'` keep the travelling monogram (the guest code is untouched), and the Event Details record row still shows the field. *Alternative:* drop the behaviour for everyone — rejected, it is a live Pro look.
6. **Palette type (Fabric swatches ▾):** leaves Look; the stored value is kept as stored and drawn by the Dress-code scene exactly as today; it becomes editable on that scene's Style row (restudy § 3.3, build-status deviation 2 — R2's `scene-style-row.tsx`). Until that row exists the value is read-only. *Alternative:* keep it in Elements under a ⓘ — rejected, it is a part's own style.
7. **Fonts:** two (Headings · Text), drawn. *Alternative:* a third **Accent (script)** row on themes with a script face.
8. **Row 3 (#6442):** superseded except the Text font. Keep #6438's column, narrowed; cut `studio-elements.tsx`'s four role rows and per-role colours. *Alternative (if the owner wants nothing of row 3):* pull `site_roles` from the bundle now and ship a plain `events.site_text_font_key` text column later — one fact either way.
9. **Light/Dark:** preview-only, recommended. *Alternative:* a stored "dark mode" column — rejected: the page already has two real dark states (an ink fade, Candlelight); a third would be a second source of truth.
10. **Overlays, one at a time:** recommended (battery, and one Overlay ▾ as approved). *Alternative:* switches for several at once.

## 6 · Rules applied (for a line-by-line check)

| Control | Rule it follows |
|---|---|
| Source ▾ · Effects ▾ · Blur ▾ · How much ▾ · Focus ▾ · Headings ▾ · Text ▾ · Music Source ▾ | one dropdown per set of word choices |
| Colour style cards · Scene · Video · Upload cards · Button shape cards | picture choices = phone-shaped 3:4 cards, 136 px fixed, in a **carousel** (swipe, snap, the next card peeking) |
| Colour wells · the five circles | the Mood Board's palette circles, 44-px targets, the ONE picker sheet |
| Fade bar | a slider (a continuous value, not a set); 44-px thumb; "↶ As is" is an ActionButton (grey, icon + word) |
| Light/Dark · Music · Parallax · Candlelight | a two-state control = a switch, never a chip row |
| ✎ Change · ↻ Try again · ↶ Use the palette · ✓ Use (hex) | BUTTON_RULE: pill with border, icon + word, 40 px; grey = manage, terracotta = the forward step (Try again); the word drops before the icon by width |
| Rows | the Studio's hairline rows (build-status deviation 8), no boxes, no cards-inside-cards; ⓘ for every sentence |
| Our music list | rows with ▶ (no picture → no carousel) |
| Sample screen | the real components' look (`.button-primary` / `.button-secondary`, the eyebrow style, the Headings face); the guest hub itself stays exempt from the button rule |
| The panel | tools in the thumb zone: the sample is fixed at ~1/3, the panel scrolls, no control under the home indicator |

## 7 · Music — does #6434 already match? (three lines)
Yes in substance: Source ▾ with two sources, the admin list by mood with ▶ per row, the pick drafted and published on ✓ Apply, the own-song codec refusal in place, "Plays only when a guest taps the speaker — never on its own." kept. Differs in words only: the second source reads **"Your music"** (hint "A song from your phone") — the owner's sentence is **"Upload your own"**; and the list's rows carry no "2 versions" mark (two rows per title today — show one row per title with its versions, or keep two rows; owner's call, not a code change of weight). Order is the same (switch · Source · list). Nothing else to change; no Apple anything.

## 8 · Build note — small PRs, in order, each on top of the built heads

**PR 0 · `rd/look-sample-screen` (part D, first — it is what every other frame is judged on).** `details-look-pages.tsx`: `LookFrame` no longer mounts `MakerPageFrame`; a new `LookSample` client component draws the specimen from the draft store (`createDraftedCanvases` / the look ground store `createLookGroundStore`) and the pure functions listed in § 3; the hidden stage canvas is not mounted while Look is open (Stages remounts it). Expected: guest-page documents per Look open **2 → 0** (count as L2 did). Guard: `look-mounts-no-page-frame`. The ▶ preview and Stages are unchanged.

**PR 1 · `rd/background-two-colours` (part A, step 1).** `lib/ombre.ts` 4th segment + anchors; `main-background-panel.tsx`: two `StudioColourField`s (the second with `onRemove`), Plain greyed with two; `ombre.test.ts` + `the-guest-page-paints-the-ombre` extended. Base: `rd/background-source-cards`.

**PR 2 · `rd/background-fade-bar` (part A, step 2).** `HUB_MAIN_SHADES` keeps the words; `HubMainLook.shade: word | number`; `mainGroundShade` resolves a number; the bar component (drag · snap · words · ⓘ · "As is"); the preview layer lays the veil client-side while dragging; Candlelight moves out of the Shade list (temporarily into the Effects row of PR 3 — land PR 2 and 3 together or PR 3 first). `shade-never-crosses-the-floor` extended to positions.

**PR 3 · `rd/background-effects-sheet` (part A, step 3 = restudy row 8, split).** 3a: the sheet with the shipped controls only — Parallax (widened to loops/clips) · Blur · Candlelight — greyed-with-reason on Colour; Focus stays a row. 3b: `main.effect {kind, intensity}` + `lib/ambient-effects.ts` (the heavy half; can wait).

**PR 4 · `rd/background-no-pattern-no-cover` (part A, step 4).** `BACKGROUND_SOURCES` offered list; "Pattern · kept" row + sheet entry; `coverCardShows` → the cover is a plain own photo; `HeroFrameSync` default per decision 2; label "Upload". Guards updated, never loosened.

**PR 5 · `rd/elements-one-line` (part B).** On `rd/elements-roles` (#6442): remove the four role rows and the Pairing; the five circles (`mood-board-studio`'s circle + `StudioColourField`'s sheet) writing `main_colours`; the Light/Dark preview switch (feeds `LookSample`); Headings ▾ (the shipped `FontPick`) · Text ▾ (writes `site_roles.body.font`); `sanitizeSiteRoles` narrowed; Buttons = shape cards only, the own-colour line; Magic Move and Palette-type rows removed from Look (`look.palette` → the Dress-code scene's Style, R2's file, or read-only until then). #6438's migration ships as is.

**PR 6 · `rd/music-two-words` (part C).** On #6434: "Your music" → "Upload your own"; optionally one row per title with versions. Nothing else.

Each PR ships with its 375 side-by-side beside the frame here (`prototypes/background-sources-amend-2026-10-08/`), per `MAKER_SIDE_BY_SIDE_2026-10-07.md`, and the owner's OK before any merge.

## 9 · What this could not honour, and why
- *"Just place 2 circle palette like moodboard"* — honoured; but the picker sheet is #6427's and is drawn here from its source, not pixel-copied (the branch has no capture).
- *"Effects: Lantern"* — Lanterns and Sparkles are NEW particle systems (restudy § 1a, row 8); the sheet offers them ◆ as planned, nothing ships them yet.
- The brief named a DECISION_LOG row "HOW WE BUILD FROM NOW ON" (map card + sample data) — no row with those words exists on 2026-10-08 (`/usr/bin/grep -n "HOW WE BUILD" DECISION_LOG.md` → nothing); the map card and the standard sample data were applied as the brief described them.
- The music refusal sentence is drawn in my words; the built one in `lib/audio-sniff.ts` (`ownSongProblem`) is the one to use verbatim.
- The prototype uses local/system faces (no external requests), so font names stand in for the real `HUB_FONTS` faces.
