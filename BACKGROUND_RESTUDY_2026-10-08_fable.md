# Studio › Look restudy — Background · Elements · Music · 2026-10-08 · Fable

**Design + prototype only. Nothing here is built.** Prototype: `prototypes/background_restudy_2026-10-08_fable.html` (open it; every control works; `?shot=<state>` for the screenshots in `prototypes/background-restudy-2026-10-08/`).

Owner, verbatim, in order received today:
- *"main background does not show the animated backgrounds, color, upload media and everything we can do for the background restudy this and create a better approach to design background. Save the date should adapt to the main background as well. we stay 1 design for all."*
- *"colors here is not color of the background but the colors of the different fonts, and buttons and highlights"*
- *"fonts will be multiple fonts like, details, button font, header font, etc."*
- *"Button style is also on this global look. so how do we arrange this? Background, Elements (combine the font color and styles?) and Music?"*
- *"i see a hero video on music. this should be for the background"* · *"and no save button"*
- *"background music is upload your music or pick from our background music. where do you want your music button to live?"* · *"Play at first tap or Play when music button is pressed"* · *"Crossfade when a video plays with sound."*

**Verdict.** Everything the owner asked for already exists in code — the nine theme videos (the loops uploaded 2026-09-24), ten ready-made scenes, own photo/video with parallax, four patterns, five shades, blur, focus, the Mood Board five, three overlay-effect engines (reveal petals/butterflies, celebration confetti, spatial glow layers), a 45-font catalogue with theme pairings, button shape + fill, music with a tap-to-play speaker. The Look panel shows a fraction of it, in the wrong tab, through a 27 × 36 px thumbnail in a dropdown, with a second background for the Save the Date film. The fix is arrangement, not invention: three tabs, one page above them, picture cards for looks, ONE dropdown per set of choices, no Save button, and the film follows the main background. Two things are NEW and say so below: per-role fonts/colours beyond the one typeface and two colours that exist, and a music "Starts · Button · Fade out" setting.

---

## 1 · Rule 0 — what exists (read from `origin/main` 508cb3f, never `~`)

### 1a · Background

| Capability | Where (greppable) | Stored | Shown in Look today? | In the new design |
|---|---|---|---|---|
| Page colour, plain | `events.site_bg_color` · `lib/ombre.ts` `parseSiteBackground` · `ColorsPanel` + `ColourWell` (`pro-panels.tsx`) | `events.site_bg_color` (free) | Yes — in **Colours** ("Page") | **Background › Colour**, card *Plain* |
| Page fill Dawn · Diagonal · Glow (ombré of ONE colour, `OMBRE_LIFT`/`OMBRE_DROP`) | `BACKGROUND_EFFECTS` in `lib/ombre.ts` · `GuestGround` in `guest-look-scope.tsx` | same column, `ombre:<effect>:<hex>` (free, `OMBRE_IS_PRO=false`) | Yes — in **Colours** | **Background › Colour**, cards *Dawn · Diagonal · Glow* |
| The Mood Board five (Dominant · Supporting · Accent · Neutral · Accent 2) | `events.role_palette.reception[0..4]` · `MAIN_SLOT` in `lib/site-palette.ts` · `MAIN_COLOUR_JOB` in `lib/main-colours.ts` | `role_palette` jsonb · draft key `main_colours` | Five native `<input type=color>` (`StudioMainColours`) | The source of every default; edited in Mood Board, used here |
| **The theme videos** — the 9 muted 1080×1920 loops the owner uploaded 2026-09-24 (`THEME_BACKGROUND_NAMES`: Luxe chandeliers · Modern gallery walls · Rustic sunset table · Cinderella moonlit frost · Vintage capiz light · Whimsical lantern meadow · Regency ballroom · Gatsby champagne deco · Cyber neon street; Classic has none) | `INVITE_THEMES[id].media = mediaFor(slug)` → `r2://setnayan-media/theme-backgrounds/2026-09-24/<slug>-loop.mp4` + `-poster.jpg` · `hubMovingBackgroundIds()` · `HubMainLoop {ground:'loop', loop}` (`lib/hub-canvas.ts`) · `mainGroundLayerFor` → `<MainGround>` · uploaded by `scripts/upload-theme-loops-to-r2.ts` from corpus `assets/theme-backgrounds-2026-09-24/` | hero row `config_json.main` (no migration) | As rows of ONE `PickMenu` "Behind every scene" with a 27×36 `<img>` thumb — the owner did not recognise them as his videos | **Background › Video ◆** — nine cards, each the real loop playing muted over its poster over a CSS fallback in the theme's colours (never a broken glyph). ⚠ The corpus folder also holds `modern-a`, `modern-b` and `ballroom-velvet-chandeliers` loops that NO theme uses — owner call: offer them as three more Video cards (add to `mediaFor` + the R2 upload) or leave them |
| Ready-made scenes — **10 stills** | `STD_REALISTIC_BACKGROUNDS` in `lib/std-backgrounds.ts` · `apps/web/public/std/backgrounds/*.webp` | `config_json.main = {kind:'photo', media:'/std/backgrounds/x.webp'}` | Buried under "Upload media" as a `PhotoTile` grid | **Background › Scene**, cards |
| Own photo or video (+ Parallax · Focus · Blur · Shade) | `HubMainOwn {kind, media, motion:'parallax', shade, blur, focus}` · `MainBackgroundPanel` · `FileUpload` (`compressImage`/`compressVideo`, `videoCompressProfile="maker"`, 100 MB, `MAKER_MAX_CLIP_SECONDS`) | `config_json.main` · R2 `events/<id>/main-background` | "Upload media" row (◆) | **Background › Your photo or video ◆**: hero · gallery · Save the Date upload · the one video · **Upload** in place |
| "Same as my hero" | `HubMainFollow {follow:'hero'}` · `HeroFrameSync` | `config_json.main` | Yes, a row | A card under *Your photo or video* ("Your cover photo") |
| **Hero video** | `media-panels.tsx` `MusicAndVideoPanel` → `updateSiteChrome`; guest `hero-background-media.tsx` | `events.hero_video_url` (R2 `landing-page-hero-video`) | In **Music** (owner: wrong) | **Background › Your photo or video ◆** — the "Your video ▶" card |
| Pattern — lines · dots · lace · grid | `HUB_MAIN_PATTERNS` · `PatternGround` in `main-ground.tsx` · `StudioMainExtras` | `config_json.main = {ground:'pattern', pattern}` (free) | A "Pattern · None ▾" row | **Background › Pattern**, cards (+ Colour row) |
| Parallax (motion of the picture) and Blur | `HubMainOwn.motion:'parallax'` (`HUB_MEDIA_MOTIONS`), `.blur` · `PahinaCoverParallax` · `hubMainTakes()` says which sources take them | `config_json.main.motion/blur` (Parallax Pro, Blur free) | Rows under "Upload media" only | **Background › Effects › Motion ▾ · Blur ▾** — the background's own motion, beside the overlays; greyed with ⓘ on Colour/Pattern; parallax extended to Scene stills and the theme videos (same layer, `hubMainTakes` widened) |
| Shade Darker · Dark · As is · Light · Lighter | `HubMainShade` · `lib/main-ground-shade.ts` · `shade-never-crosses-the-floor.test.ts` | `config_json.main.shade` (free). ⚠ **There is no `canvas.shade` key** — the brief's name is wrong; per-scene it is PR #6401's follow-up | Only for footage/loop | **Shade ▾** on every source — the veil never takes words under the floor |
| **Effects on top of the background** (owner 2026-10-08: *"lanterns are effect we can place on top of the background"*) | Three shipped overlay engines, none offered on the main background: **Reveal extras** `REVEAL_EXTRA_LABEL` Butterflies · Falling petals (`lib/reveal-extras.ts`) with the `REVEAL_TUNE_KNOBS` Few↔Many · Slow↔Fast · Small↔Large sliders (`lib/std-reveal-effects.ts`), reveal-only, Pro (`REVEAL_ONLY_EFFECT_KEYS` in `lib/reveal-access.ts`) · **Celebration engine** confetti · fireworks · petals bursts (`lib/celebration-engine.ts`, `rsvp-celebration.ts`, `when-yes-celebration.tsx`, picked in `celebration-pick.tsx`) · **Spatial backdrop** Gilded Dusk · Capiz Glow parallax layers + journey video, intensity `subtle · standard · lavish` (`SPATIAL_THEMES`, `INTENSITY_FACTOR` in `lib/spatial-backdrop.ts`; `events.rsvp_backdrop`, Pro via `HUB_LOOK_EVENT_COLUMNS`). **No shipped lanterns or sparkles ambient layer.** | reveal: `std_reveal_effects` · celebration: RSVP config · spatial: `events.rsvp_backdrop` | No — each lives on its own page (Reveal, When they say yes, RSVP) | **Background › Effect ▾** None · Petals ◆ · Butterflies ◆ · Confetti · Sparkles · Lanterns ◆ · Capiz glow ◆ · Gilded dusk ◆ + **Intensity ▾** Subtle · Standard · Lavish (the shipped `SpatialIntensity` words, mapped onto the reveal knobs). Independent of Source ▾: any effect on any background; always under the words; still under `prefers-reduced-motion`. **NEW**: a `config_json.main.effect {kind, intensity}` key and one ambient engine (`lib/ambient-effects.ts`) that reuses the reveal petal/butterfly systems and the celebration particle systems in a slow loop; Lanterns and Sparkles are new particle systems. Pro follows the engine it reuses (reveal and spatial ◆; confetti/sparkles free). |
| Blur · Focus | `config_json.main.blur/focus` · `hubMainTakes()` | same | Only for footage/photo | Blur ▾ on photo and video; Focus folds into the photo card's crop (one tap) |
| Save the Date film's **own** background | `events.std_background` jsonb (migration `20270125138761`) · `stdFilmBackground` / `stdFollowsTheme` in `lib/std-backgrounds.ts` · written LIVE by `StdBuilderClient` + `presignStdBackground` · hand-back link `FilmFollowsTheme` | `events.std_background` (`null` = follows the theme) | "Your Save the Date film keeps its own background · Same as the Event Hub" link | **Retired.** The cover wears the main background. See § 4. |
| A part's own Background (Stages) | `HubSectionCanvas` (`HUB_BACKGROUND_KINDS` photo · snippet · color · diagonal · glow · glass · frost · none) · `StageBackground` + `SceneBackgroundRow` · `lib/scene-background-scope.ts` ("Just this scene", "↺ Use the Event Hub's") | `invitation_widgets.config_json.canvas` | Stages › Style › Background | **"Same as main ▾"** default, "Its own" opens the same Source ▾ + cards (§ 3.4) |
| Pro gate | `lookWriteAllowed` · `HUB_FREE_LOOK_EVENT_COLUMNS` (`lib/hub-look-pro.ts`) · `mainGroundChange` / `planHubDraftApply` (`lib/hub-draft.ts`) · `makerProMark` (◆, never a padlock) · `websiteProActiveFor` guest-side | — | ◆ marks | Unchanged: Colour · Pattern · Scene · Shade free; Moving · own media · Parallax ◆, tried free, named at Apply |

**The two broken thumbnails.** The loop rows' `thumb` is `resolveThemeGround(id).poster` → `publicUrlForStoredAsset('r2://setnayan-media/theme-backgrounds/2026-09-24/<slug>-poster.jpg')` through `publicUrlFor` in `lib/r2.ts`. All nine posters answer HTTP 200 on the public R2 host today, so the break is either the host `publicUrlFor` builds in that environment or a blocked request on the owner's phone — **a check of the first broken `<img src>` in his browser answers it in ten seconds.** Either way the design removes the class of failure: every card has a drawn CSS fallback (the loop's own colours) under the poster, so a missing image shows a coloured card, never a broken glyph.

### 1b · Elements (fonts · colours · buttons)

| Role | Font today | Colour today | Shipped var(s) | NEW? |
|---|---|---|---|---|
| Headings (names, titles) | `events.site_font_key` → `hubFontVars` sets `--pahina-face` + `--font-display` only | Dominant → `--hub-heading`, pulled to AA-large (`buildSitePaletteVars`). ⚠ `--hub-heading` is barely consumed (`event-poster.module.css`, `wayfinding-map.tsx`); headings mostly wear `text-ink` | `--font-display`, `--hub-heading` | Colour override NEW; needs `--hub-heading` wired to the guest headings |
| Details (body) | theme `fonts.body` → `--font-body` (also `--font-sans`); no couple override | computed ink `--color-ink` (first of espresso/black/off-white/white that reads 4.5 on paper AND plates); flips on a dark ground via `hubLegibility` | `--font-body`, `--color-ink` | Font override NEW; colour override NEW (re-measured through `hubLegibility`) |
| Buttons | theme `fonts.body` (buttons inherit body — no role) | `events.site_button_color` → `--color-mulberry*`; label by `buttonLabelOn`; shape + fill `events.site_button_style` (`HUB_BUTTON_SHAPES` theme · square · rounded · pill × `HUB_BUTTON_FILLS` theme · solid · outline) → `--hub-btn-*`, `data-hub-btn-shape/paint` | `--hub-btn-fill/label/radius…` | Font NEW; fill + label + shape **exist** (free) |
| Highlights (links · dividers · icons · eyebrows) | theme `fonts.labels` → `--font-mono` (eyebrows) | Accent → `--color-terracotta*` (eyebrows, links, pulled to 4.5); Accent 2 → `--color-gild` (ornaments, raw) / `--color-gild-text` (words) | `--color-terracotta`, `--color-gild` | Font override NEW; colour override NEW |
| Pairing | `INVITE_THEMES[id].fonts {heading, body, labels, script}` — 10 themes (Classic Cormorant/EB Garamond · Luxe Bodoni/Cormorant · Modern Instrument/Jost · Whimsical Yeseva/Quicksand · Gatsby Limelight/Josefin · …) | `buildSitePaletteVars` from the Mood Board five | — | The **Pairing ▾** preset = the shipped theme pairing applied as a set; no new data |
| Font catalogue | `HUB_FONTS` (45, `lib/hub-fonts.ts`, groups Serif · Script · Sans · Display), `hubFontPickOptions` already draws each name **in its own face**, `content-visibility:auto`, `preload:false` | — | — | Reused as is; the picker is the shipped `FontPick`/`PickMenu` with a sample line added |
| Colour picker | **Four** pickers ship: `ColourPickerSheet` (Mood Board: current · From your photos · Swatches · Custom — the one the owner ordered 2026-10-06), `SwatchPopover`, `ColourWell` (Maker: HSV wheel + "Saved colours"), `StudioMainColours` (bare `<input type=color>`) | — | — | **ONE**: `ColourPickerSheet`, extended with a "Your Mood Board" shelf first and a "Goes with your Mood Board" shelf (complements) — then the other three are retired |
| AA check | `contrastRatio` · `AA_BODY` 4.5 · `AA_LARGE` 3 · `hubLegibility` (`lib/hub-legibility.ts`), `readableOnBoth` (`site-palette.ts`), `hubElementContrast` (`element-style.ts`), `buttonLabelOn` | — | Not shown as a badge | A quiet **AA** badge per role; amber **AA ✗** when it fails, the fix one tap away |
| Art direction ◆ Daylight · Candlelight | `events.site_art_direction` → `data-art="candlelight"` → `[data-art='candlelight']` in `globals.css`: a full palette flip (paper near-black, cream type, gild accents) | Pro (`siteLookChange`) | In Colours | **Moves to Background** as the *Shade ▾* option **"Candlelight"** below *Darker* — it IS the darkest shade, and it fights per-role colours if left beside them (§ 3.2) |
| Magic Move ◆ "Nothing travels" · "Your monogram travels" | `MAGIC_TRAVELLERS=['mark']` (`lib/magic-move.ts`) · `magic-move.tsx` scroll-linked: the monogram leaves the hero and lands in the sticky bar | Pro | In Colours | **Leaves Look.** It is a scroll motion of ONE part (the Logo), so it becomes **Stages › Logo › Animate › Action: "Travels to the bar"** — beside Float · Pulse · Parallax, where a part's motion already lives. Not a Stages default. |
| Palette · Tags | `PALETTE_LOOK_IDS` (`lib/palette-looks.ts`) — how the Dress-code scene draws "Our colours" | free | Appears under Colours on the owner's phone | **Leaves Look.** It is the Dress-code part's own Style row (`PaletteLookRow`), already there. |

### 1c · Music

| Capability | Where | Today | In the new design |
|---|---|---|---|
| Song upload | `MusicAndVideoPanel` (`media-panels.tsx`) · `FileUpload` `site-music`, 20 MB, `AUDIO_TYPES` | A form with a **Save** button, a checkbox "Play music on my Event Hub", and the Hero video under it | **Source ▾ Your music** → upload in place; formats behind ⓘ ("MP3, M4A, AAC, OGG, WAV · up to 20 MB"); no Save |
| Our music | **None for the Event Hub.** The only Setnayan-owned catalogue is `reel_music_tracks` (AI tracks, Patiktok/teasers) | — | **Source ▾ Our music** = a library by mood with ▶ preview. **NEW**: either reuse `reel_music_tracks` (owner call: are those tracks right for a guest page?) or a new `hub_music_tracks` list |
| On/off | `events.bg_music_enabled` (checkbox) | checkbox | a **switch** |
| Speaker button | `background-music.tsx`: top-right, portalled into `TOP_CORNER_SLOT_ID` beside the guest's Account control; hint "Tap for their song" until the first tap; eq bars while playing | top-right, fixed | **Button ▾** Bottom right (thumb zone, default) · Top right (as shipped) · Inside the Event Bar. **NEW field** |
| Starts | the docblock: *"never a hidden auto-soundtrack"* — plays only on the speaker tap. Precedent for first-tap: `OnboardingMusic` (onboarding, 2026-06-08) starts on the first tap anywhere | button only | **Starts ▾** "When the button is pressed" (**default** — the shipped behaviour; nothing in DECISION_LOG locks "never on its own" beyond the browser's own rule, and BOTH options wait for a tap) · "At the first tap" (the earliest a browser allows). **NEW field** |
| Fade out for videos | not shipped | — | **Switch, default ON**: a video WITH SOUND starting → the song fades down ~0.8 s and pauses; fades back on pause/end. Hook points: `hero-background-media.tsx` (hero, muted — exempt), `scene-clip.tsx` (scene clips, muted — exempt), `save-the-date-film.tsx`, `editorial/living-moments.tsx`, `editorial/post-event-scene-views.tsx`, `editorial/editorial-content.tsx` (the film, gallery and recap players — these can carry sound), `guest-camera-player.tsx`. One `play`/`pause`/`ended` listener on `document` filtered to `!video.muted` covers all of them. **NEW field** |

### 1d · "No Save button" — Look fields that save outside the draft today (owner decision)

Every Look field in the Maker already goes into the draft **except by round trip**: `MusicAndVideoPanel` and the Hero video post a `<form>` with `HubDraftField` to `updateSiteChrome` — into the draft, but only on **Save**, with a page reload. The design makes them `draftSend` on change like `StudioMainColours`. Two fields write **live, never the draft**, and the owner decides:

1. **`events.std_background`** (the film's own background) is written live by the Save the Date studio (`presignStdBackground`). Retiring it (§ 4) removes the question.
2. **`events.bg_music_enabled` / `bg_music_url` / `hero_video_url`** go through `updateSiteChrome` — drafted when the Maker posts them, **live** when the old `/website/site-chrome` page posts the same action. Recommendation: the old page's door closes with this build (it is the last "go edit elsewhere" door for Look).

---

## 2 · The design, in plain English

**One lower third, one live page.** The top half is the guest's page wearing the draft for real (the main background behind every stage, the cover included; the Elements' fonts and colours on the real words and buttons; the speaker where you put it). The lower half is 50 % of the screen: **Look ▾ · ▶** on top, then one bar — **Background · Elements · Music** — then 44-px frosted-glass rows (`sn-glass-row`). Any set of choices is ONE dropdown; looks are picture cards; help is behind ⓘ; ◆ marks Pro, tried free, named at Apply; **no Save anywhere** — every change goes to the draft at once and the ✓ counts it.

### 2.1 Background — one background for the whole Event Hub

- **Source ▾** — Colour · Pattern · Scene · **Video ◆** (the nine theme videos, by their shipped names) · Your photo or video ◆. One dropdown. (Today's "Behind every scene" rows, "Pattern · None", the Colours tab's page fill and the Music tab's Hero video all fold into this one list.)
- **Cards for that source** — Colour: *Plain · Dawn · Diagonal · Glow* (the ramp of the one colour, drawn live). Pattern: *Fine lines · Dots · Lace · Grid* (+ Herringbone, new, optional). Scene: the ten stills. Video: the nine theme videos, each card the loop itself playing muted (`preload=metadata`, poster frame until it plays, CSS colours if the file never comes). Your photo or video: *Your cover photo · Save the Date upload · Gallery · Your video ▶* + an **Upload** card (the shipped FileUpload, compressed on the phone).
- **Only the rows that source needs** — Colour (opens the Mood Board picker; Neutral by default = the page paper, as `MAIN_SLOT` already says) · **Shade ▾** on every source (Darker · Dark · As is · Light · Lighter · **Candlelight**).
- **Effects — two kinds, both independent of the source, combinable** (owner 2026-10-08: *"parallax is an effect also"*). (1) **Motion of the background itself**: *Motion ▾* Still · Parallax ◆, and *Blur ▾* None · Soft · Strong — Blur goes with Motion because it is the same thing, a treatment of the picture (`HubMainOwn.motion` / `.blur`, applied by `<MainGround>` to the layer, never to the words); both are greyed with an ⓘ ("a plain colour or a pattern has no picture to move or blur") on Colour and Pattern, and live on Scene, Video and Your photo or video. (2) **Overlay ▾ + cards + Intensity ▾** — on top of whatever source is picked: None · Petals ◆ · Butterflies ◆ · Confetti · Sparkles · Lanterns ◆ · Capiz glow ◆ · Gilded dusk ◆. Each card shows the effect moving over the CURRENT background; Intensity is Subtle · Standard · Lavish. Effects and Source are independent — lanterns over a scene, petals over a plain colour, sparkles over a theme video.
- **The page above changes as you tap** — including the Save the Date cover when that stage is open.
- **Never a broken image**: a card is a CSS fallback with the poster on top.

### 2.2 Elements — by role, not by property

- **Pairing ▾** on top: *Classic · Luxe · Modern · Whimsical · Gatsby · Cinderella · …* — the ten shipped theme pairings (heading · body · labels · script, plus Buttons = body) with the colour map from the Mood Board five. One tap sets every role; nothing is locked.
- Four rows, each opening in place:
  - **Headings** — Font ▾ · Colour (default Dominant)
  - **Details** — Font ▾ · Colour (default the computed ink)
  - **Buttons** — Font ▾ · Fill (default Accent, pulled deeper until a white label reads — the shipped `buildSitePaletteVars` rule, named "Accent · deeper, to read") · Label (auto, overridable) · shape cards *Theme's · Square · Rounded · Pill × Solid · Outline* (`site_button_style`)
  - **Highlights** — Eyebrows font ▾ · Colour (default Accent; links, dividers, icons, eyebrows, the monogram ring)
- Each row's head shows the role's sample **in its own font and colour**, its swatch, and an **AA** badge measured against the current background (4.5 for Details and Buttons, 3 for Headings and eyebrows). Amber **AA ✗** when it fails; the picker's first shelf then says "Hard to read — pick a deeper colour · 2.1:1".
- **The font picker** = the shipped `FontPick` shelves (Event Hub font · Recently used · Most used · All) with a sample line under each name; "Event Hub font" at the top returns the role to the pairing. **Stages › Aa** on a single part keeps "Event Hub font" as its lead and now reads "Event Hub font (Headings)" / "(Details)" by the part's role.
- **The colour picker** = ONE: `ColourPickerSheet`, with shelves *Against the background* (the AA line) · *Your Mood Board* (the five) · *Goes with your Mood Board* (complements) · *Swatches* (16) · *Custom* (wheel + code). Picking a colour outside the five for the **background** adds it to the Mood Board — one palette, as the 2026-10-06 row says.

### 2.3 Music — only music

Music switch · **Source ▾** Our music (by mood, ▶ preview) / Your music (upload in place, formats behind ⓘ) · Song ▾ · **Starts ▾** · **Button ▾** · **Fade out for videos** switch. Nothing else. The hero video is in Background.

### 2.4 Stages › a part's own Background

The part's Style › Background row reads **Same as main ▾** by default, with a one-line hint ("change it in Studio › Look › Background, and every stage follows"). **Its own** opens the SAME Source ▾ + cards for that part only (the shipped `HubSectionCanvas` kinds), with Shade and a **↺ Back to main** chip. This replaces today's `StageBgChoice` list (hub · none · color · diagonal · glow · glass · frost · media) — the same stored kinds, one shape of control. Glass and Frost stay as cards under Colour for a part (they only make sense over the main background).

### 2.5 Desktop

As the 2026-10-07 adaptation: the same code draws three columns; Look keeps the page beside its controls; cards become a 3-column grid; sheets open beside the button.

---

## 3 · Decisions this design makes (surface, not silently)

1. **Art direction → Background › Shade "Candlelight".** It is the darkest shade and a palette flip; beside per-role colours it would override them silently (`[data-art='candlelight']` rewrites ink, paper, gild). Known limit stays: a live Candlelight cannot be taken off by a draft (`host-draft-look.tsx`) — the build must fix that or the row is a lie.
2. **Magic Move → Stages › Logo › Animate › Action "Travels to the bar".** It moves one part on scroll; it is not a colour and not a stage transition. Pro stays.
3. **Palette · Tags → stays on the Dress-code part** (already there); gone from Look.
4. **The fifth Mood Board slot's job wording** differs between `MAIN_COLOUR_JOB` ("Buttons · links") and `buildSitePaletteVars` (Accent = buttons AND eyebrows; Accent 2 = ornaments). Elements shows the roles by what the engine does, not the label — align `MAIN_COLOUR_JOB` to it in the build.
5. **Per-role overrides need a home** — see § 5 PR 3. A column or jsonb, named NEW.

---

## 4 · Retiring the separate Save the Date film background — data

**What it is.** `events.std_background` jsonb: `{kind:'plain'|'paper'|'realistic'|'upload', value, legibility}`, or `null` / `{follow:'theme', legibility}` = follows the theme. Written by the Save the Date studio (live), read by `loaders.ts` (`stdFollowsTheme ? stdFilmBackground(...) : resolveStdBackground(...)`), painted by `StdBackgroundLayer` inside `save-the-date.tsx`, and used as a **source picture** for other things: `resolveEventPoster` (dashboard card / Overview tile fall back to the Save the Date background), the scene picker's "the Save the Date background" tile, and the hub-look `resolveInviteGround`.

**Does any event have one set?** Unknown from code — measure, do not assume: `select count(*) filter (where std_background is not null and std_background->>'kind' is not null) from events;` (cale-ice is named in DECISION_LOG 2026-09-28 as an event whose only picture is its Save the Date background, so expect ≥ 1). **Nothing was run.**

**Migration (one PR, no schema drop yet):**
1. For every row with `std_background->>'kind' in ('realistic','upload')` and **no main background of its own** (hero `config_json.main` null): copy it INTO the main background — `realistic` → `{kind:'photo', media:'/std/backgrounds/<id>.webp'}`, `upload` → `{kind:'photo', media:<ref>}` — through the same sanitiser `sanitizeHubMain`, so the couple sees the same cover tomorrow. Rows with `plain`/`paper` or follow-theme: set `std_background = null` (the main background is the theme's already).
2. Rows with BOTH set: the main wins (owner: one design); the film value is kept in a `events.std_background_retired` copy for 30 days, then dropped in a second migration.
3. Readers: `loaders.ts` stops branching — the cover's layer is `mainGroundLayerFor` (same as every stage). `resolveEventPoster` keeps the film upload as a poster fallback only while the copy exists.
4. The `FilmFollowsTheme` line, `stdFollowTheme`, the STD studio's background picker and the `20271220579615` upload guard become dead and are removed with their tests (`the-look-is-one-panel.test.ts`, `the-guided-steps-share-one-layout.test.ts` assert the old copy — they are rewritten, never deleted to go green). Ugat: `ugat-schema-claims.db.test.ts` will fire on the column — one baseline line.

---

## 5 · Recommendations (one word each)

1. **Arrange** — three tabs, nothing new to learn.
2. **Follow** — the cover follows the main background; `std_background` retires.
3. **Roles** — Elements by Headings · Details · Buttons · Highlights.
4. **One** — one colour picker, one font picker, one dropdown per set.
5. **Draft** — no Save; `draftSend` on change, ✓ Apply publishes.

---

## 6 · PR-sized build plan (Opus builds; side-by-side + owner OK before any merge)

| # | PR | Scope | New data |
|---|---|---|---|
| 1 | `rd/look-three-tabs` | `LOOK_SECTIONS` → background · elements · music; `StudioLookBar`; move the page fill cards from Colours into Background; move Hero video from Music into Background's media cards; delete `FilmFollowsTheme` from Look; **no Save**: `MusicAndVideoPanel` → `draftSend` on change. Guards: `the-look-is-one-panel.test.ts` rewritten. | none |
| 2 | `rd/background-source-cards` | Source ▾ + picture cards with CSS fallbacks; the **Video ◆** cards are the nine theme loops as muted `<video preload=metadata>` over `media.poster` over `media.samples` colours (`resolveThemeGround`), autoplay only while on screen (IntersectionObserver), still under `prefers-reduced-motion`; Shade ▾ on every source incl. Candlelight (`site_art_direction` written from here; fix the draft-cannot-remove limit); Parallax/Blur rows; the Mood Board `ColourPickerSheet` as THE picker for the background colour (adds a Mood Board shelf). | none (`config_json.main` + `site_bg_color`) |
| 3 | `rd/elements-roles` | Pairing ▾ (theme pairings as a set); four role rows; font per role; colour per role; AA badges via `hubLegibility`; `--hub-heading` wired to guest headings; `--font-body`/`--font-mono`/`--hub-btn-*` set inline from the overrides, layered after the palette in `proSiteVarsFor`. Buttons shape cards reuse `ButtonsLookRow`. | **NEW** `events.site_roles` jsonb `{heading:{font,color}, body:{font,color}, button:{font,fill,label}, highlight:{font,color}}` — one column; joins `HUB_DRAFT_LOOK_COLUMNS`, `sanitizeHubDraftEventValue`, `HUB_FREE_LOOK_EVENT_COLUMNS`, `hub-draft-change-lines.ts`, the loaders' select, `lint-events-column-grants`, Ugat |
| 4 | `rd/one-colour-picker` | Retire `ColourWell`, `SwatchPopover`, `StudioMainColours` in favour of `ColourPickerSheet` (+ complements shelf + AA line); Stages › Aa "Event Hub font (role)". `hub-font-shelves.test.ts` counts FontPick call sites — update, never loosen. | none |
| 5 | `rd/music-only-music` | Switch; Source ▾ Our/Your; Starts ▾; Button ▾ (speaker portal target by value); Fade out for videos (one document-level listener on unmuted `play/pause/ended`). | **NEW** `events.music_starts` ('button' default · 'first_tap'), `events.music_button` ('br' default · 'tr' · 'bar'), `events.music_fades_for_video` (true); **OWNER CALL** on the Our-music source: `reel_music_tracks` or a new list |
| 6 | `rd/cover-follows-main` | The § 4 migration + reader change + STD studio picker removal; `std_background_retired` copy; second PR 30 days later drops both columns. | migration (via the pipeline, never a direct apply) |
| 7 | `rd/part-background-same-as-main` | `StageBackground`: "Same as main ▾" lead, "Its own" → the PR 2 Source ▾ + cards for the part; `↺ Back to main`. | none |
| 8 | `rd/background-effects` | The Effects block: Motion ▾ (Still · Parallax ◆) + Blur ▾ moved out of the media rows, greyed with ⓘ on flat sources, `hubMainTakes` widened so Parallax takes a scene still and a theme video; Overlay ▾ + Intensity ▾ on the main background: `config_json.main.effect {kind, intensity}`; `lib/ambient-effects.ts` wraps the reveal petal/butterfly systems and the celebration particle systems (`celebration-engine.ts` `sysPetals`/`sysConfetti`) in a slow, looping, under-the-words layer in `<MainGround>`; Lanterns and Sparkles as two new particle systems; the spatial Capiz/Gilded layers reused from `SPATIAL_THEMES`; `IntersectionObserver` + reduced-motion stop. Pro per the engine reused. | **NEW** jsonb key, no migration |
| 9 | `rd/magic-move-to-logo-animate` | Move the `MagicMovePick` row to Stages › Logo › Animate › Action; remove from Look. | none |

Order: 1 → 2 → 5 → 3 → 4 → 7 → 8 → 6 → 9. Each PR ships with a 375-px screenshot of the changed state beside the prototype's (`prototypes/background-restudy-2026-10-08/`), per `MAKER_SIDE_BY_SIDE_2026-10-07.md`.
