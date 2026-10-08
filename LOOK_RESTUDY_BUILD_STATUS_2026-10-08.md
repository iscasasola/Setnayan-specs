# Look restudy — build status (2026-10-08, Builder L1)

Contract: `BACKGROUND_RESTUDY_2026-10-08_fable.md` § 6 (nine PRs) · prototype `prototypes/background_restudy_2026-10-08_fable.html` · screens `prototypes/background-restudy-2026-10-08/01–16`.
Builder L1 owns plan rows **1** and **2** only. Base: `origin/rd/studio-reply-by-editable` @ `124ada744`. Worktree `~/Documents/Claude/Projects/wt-look`.

_This file is updated after each finished item. If a line below says IN PROGRESS and nothing newer follows, the work stopped there._

## DONE
- **Row 1 · PR #6426 · `rd/look-three-tabs` · head `bbeaa6742`** — DRAFT, `do-not-auto-merge`, auto-merge OFF, base `main`. Commits: `ed2ede65c` (the change) · `b81b9d254` (merge of the fixed base `origin/rd/studio-reply-by-editable` @ `83c336a26`) · `bbeaa6742` (the Studio home's Look tile names Background · Elements · Music — it still said the old four; seen in the lab).
  - Local: full `tsc` 0 errors · `pnpm lint` 0 errors · pinning tests 204 files / 1,479 tests / 0 fail / 1 todo (pre-existing) · 36/36 non-build node guards (port baseline regenerated: −`FilmFollowsTheme`) · DB tests that pin Look draft columns, 7 files / 71 tests / 0 fail.
  - **CI on `ed2ede65c` (the full run before the base merge):** full unit suite 22,997 tests · 22,993 pass · **0 fail** · production build ✅ · **bundle size ✅ — Maker first load within budget with 7.1 KB headroom (≈499.9 of 507), shared client bundle 201.7 of 202 KB (unchanged, 0.3 headroom)** · lighthouse ✅ · e2e ✅. The one red step was "Data-layer guards (DB replay)" — the stale base test `a-typed-name-and-date-wait-for-apply` 3, fixed on the base and merged in (4/4 locally). CI on `bbeaa6742` was still running when this was written.
  - Sabotages (10), each seen red then restored: hero video back under Music → (1)(1b) · `part="art"` drawing the page fill → (4) · a Save button back → (6) + `studio-round-3` 6 · the `?item=colours|font` alias removed → (1b) · page.tsx `part="art"` → `"colours"` → (3) + `every-fact-has-one-editor` · the main-extras moved off the main background → `the-main-background-extras-reach-the-page` + (1b) · `film-follows-theme.tsx` recreated → `the-guided-steps` (23) + `studio-round-3` 3 · the hero video's "Go to" back to Music → (5) · `LOOK_SECTION_ITEM_KEYS` without `elements` → `studio-followups` 7, `the-look-moves-into-details` (1)(6), (1b) · the tile's old words → (1b).
- **Row 2 · PR #6431 · `rd/background-source-cards` · head `2df7344c1`** — DRAFT, `do-not-auto-merge`, auto-merge OFF, base `rd/look-three-tabs` (row 1's head merged in).
  - Local, on the head: full `tsc` 0 errors (cold, 9 min) · `pnpm lint` 0 errors · pinning tests 280 files / 1,987 tests / 1,986 pass / 0 fail / 1 todo (pre-existing) · guard `the-background-has-one-source` 8/8 · 36/36 non-build node guards (port baseline regenerated: −`GroundCarousel`, +the cards, +`CandlelightOffOnCanvas`) · dup-rule lint ✅ · DB tests, 7 files / 71 tests / 0 fail. NOT run locally: full unit suite, `next build`, budgets, route count — CI judges (running when this was written).
  - Sabotages (14), each seen red then restored — listed under row 2 below.
  - **375 side-by-sides: `prototypes/look-restudy-built-2026-10-08/`** — `01-bg-colour` · `02-bg-scene` · `03-bg-moving` · `04-bg-photo` · `05-bg-pattern` · `06-bg-source` · `09-el` · `13-music` `-side-by-side.png` (+ `built-*.png`), from `/dev/maker-lab?studio=1` with Playwright's headless Chromium at 375 × 812, no sign-in. Read off the page while capturing: bar = Background · Elements · Music · Video = 9 cards, 9 `<video>`, 3 playing (those on screen), 0 broken images · no Save button · no sideways page scroll. Not committed to the corpus (only this file is).
  - Sabotages (row 2): library scene read as "own" → (1) · Scene's ◆ off → (2) · a Source pick that writes → (3) · a scene card as a bare `<img>` → (4) + `studio-round-3` 2 · a card without its swatch → (4) · `autoPlay` on a loop → (5) · reduced motion ignored → (5) · leaving Candlelight writes nothing → (6) · Look drawing the page fill twice → (7) · Candlelight under Elements in the Studio → (7) · the attribute not lifted → (8) · the marker mounted for a Candlelight draft → (8) · the cover-photo card bypassing `pickGround` → (3) + `studio-screens` 4 · a second `HeroFrameSync` mount → `opening-the-maker-counts-zero-waiting`.

## IN PROGRESS
_(nothing — Builder L1 stopped after row 2, as briefed)_

## TODO (per plan row)
| # | Branch | State |
|---|---|---|
| 1 | `rd/look-three-tabs` | **PR #6426**, draft, head `bbeaa6742` — awaits CI on the new head + the owner's OK at 375 |
| 2 | `rd/background-source-cards` | **PR #6431**, draft, head `2df7344c1` — awaits CI + the owner's OK at 375 |
| 3 | `rd/elements-roles` | NOT L1's — needs the new `events.site_roles` column |
| 4 | `rd/one-colour-picker` | Builder C, in flight |
| 5 | `rd/music-only-music` | NOT L1's — waits on the owner's "Our music" call |
| 6 | `rd/cover-follows-main` | NOT L1's — the Save the Date background migration |
| 7 | `rd/part-background-same-as-main` | not started |
| 8 | `rd/background-effects` | not started |
| 9 | `rd/magic-move-to-logo-animate` | not started |

## What row 1 changes (as pushed)
- `LOOK_SECTIONS` = `background · elements · music` (`lib/maker-look-sections.ts`); each section drawn from its parts (`LOOK_SECTION_PARTS`): Background = main background · page fill · hero video; Elements = Colours · Font · Buttons; Music = the song.
- Page fill (Plain · Dawn · Diagonal · Glow) moved Colours → Background (`ColorsPanel part="page"`); hero video moved Music → Background (`SiteChromePanel part="video"`). Same fields, same draft doors.
- No Save in Look in either Maker: the song, its switch and the hero video post themselves into the draft on change.
- `FilmFollowsTheme` deleted from Look (component file removed).
- Event Details' Look rows follow the same list (Background · Elements · Music); `?item=colours` / `?item=font` open Elements.
- Studio bar reads Background · Elements · Music; the five main colours ride under Elements › Colours.

## Deviations / owner calls found so far
1. **The prototype's cards render as name-only pills in the 16 PNGs** — `.cd .pv` is a `<span>` with a height and no `display:block`, so the 66 px picture collapses in the screenshots. The doc and the prototype's CSS both say picture cards (104 × 66 picture + name); row 2 builds picture cards. The PNGs are therefore not pixel references for the card strip.
2. **"Palette · Tags" is NOT already on the Dress-code part** (restudy § 1b / § 3.3 says it is). Code: `PaletteLookCanvasRow` is drawn only by Look (`editor-shell.tsx` → `look.palette`), and `the-look-is-one-panel.test.ts` (3) holds that the Dress code scene's Style does not draw it. Row 1 keeps it under Elements › Colours — moving it needs `scene-style-row.tsx` (Builder R2's file).
3. **A ready-made Scene is Event Hub Pro in code today** (restudy § 1a says "Scene free"): it is stored as the couple's own photo (`HubMainOwn`, a library `media`), which `mainGroundChange` (`lib/hub-draft.ts`) holds as a Pro addition. Row 2 marks Scene ◆ so the list does not lie; making scenes free is a pricing-rule change (owner call).
4. **The shipped Maker (flag off — every couple today) follows the same three sections**, because `LOOK_SECTIONS` is the one list both Makers draw. Its Event Details list shows Background · Elements · Music.
5. `theme.filmOwnBackground` / `filmLegibility` are still handed by the launch page and no longer read — left for plan row 6 (which removes the film's own background) to avoid touching `launch/page.tsx` while other builders are on it.

## What could NOT be verified locally (the controller checks these on the preview)
- The live page above the panel wearing the draft as a card is tapped (the lab's canvas is a stand-in), and the ✓ Apply count moving.
- A Colour card picked from a video: ONE save, the video goes, the colour shows.
- Candlelight picked in Shade ▾ → dark canvas; then As is → the canvas goes light again WITHOUT Apply, when Candlelight is LIVE (the fix) — needs an event whose live `site_art_direction` is candlelight.
- The cover photo / own photos / own clip cards and an upload round trip (the lab has none).
- Music: the song upload and the switch drafting at once in the shipped (flag-off) Maker too.
- The Video cards on a real phone (three decoding at once) and under iOS Low Power Mode (a refused play leaves the poster).

## Found, NOT fixed (outside this brief)
- The dev lab logs one hydration warning on load: the `InfoTip` ids inside the Love Story panel (`aria-describedby` / `id` differ between server and client — `StoryChapterFields`). The differing part of the id is local to that panel; nothing of Look is named in the diff.
- The shared scratchpad is one folder for several builders: a list file of mine vanished mid-session and a test command then ran with no file list (= the whole suite) for five minutes under my lock before I stopped it. Private sub-folder per builder avoids it.

## Traps
- **A second `<HeroFrameSync` in the panel's source fails `opening-the-maker-counts-zero-waiting`** (it counts mounts in source) — build the node once and draw it in both Makers' branches.
- **A Studio-only control inside `.sn-glass-row` loses its ⓘ popover** (the class clips).
- **`heavy-lock` + incremental tsc:** a warm `tsc --noEmit` finishes in ~20 s here (there is a `tsconfig.tsbuildinfo`); a cold one after a base merge took 9 min. Neither is "did not run" — read the log's two timestamps and the error count.
- `FileUpload` writes its named hidden field only once it holds a value on the client — a static render never shows `name="bg_music_url"`; assert the two form branches in source and the visible labels in the render.
- Importing `studio-tools.tsx` in a node test pulls `server-only` modules — read its source instead.
- `ColorsPanel part="colours"` (page + Candlelight + Magic Move in one form) is still used by the Event Details record row (`details/_components/record-editor.tsx`); Look uses `part="page"` and `part="art"`.

## Deviations found in row 2 (each needs the owner's eye)
6. **Shade ▾ on a flat Colour or Pattern lists As is · Candlelight only.** The shipped veil (`mainGroundShade`) is measured over a PICTURE's colours and is stored on a main background that has one; a flat page colour's words are computed by a different path (`buildSitePaletteVars` / `ombreLook`). Laying Darker ↔ Lighter over a flat colour is a new guest-render path — not built on a morning guests are receiving links. Recommendation: its own PR (or with row 8), with `shade-never-crosses-the-floor` extended.
7. **The greyed Motion ▾ / Blur ▾ rows and the "Effects — on top of any background" label are NOT in row 2** — the plan gives them to row 8 (`rd/background-effects`). Row 2 draws Motion ▾ (own photo and scene stills), Blur ▾ and Focus ▾ where they apply today.
8. **Rows are the Studio's hairline rows, not frosted glass rows.** `.sn-glass-row` clips its content (`overflow:hidden` + mask), which cuts off the ⓘ popover; the rows keep the row skin the rest of Studio uses.
9. **The Upload card opens the shipped uploader under the cards** (one tap more than the prototype's toast) — so its progress and refusals are on screen, never hidden.
10. **"Your photo or video" cards are named generically** ("Your photo", "Your clip", "Your video", "Your upload") — the picture lists the page already builds carry no names ("Save the Date upload", "Gallery · 12" in the prototype).
11. **With nothing stored and a hero photo (the default "follows the cover photo"), Shade ▾ lists As is · Candlelight** — a veil step is stored ON the main background, and the default stores none (the shipped limit; `StudioMainExtras` drew no Shade there either).
12. **Herringbone (prototype, "new, optional") is not built** — not one of the four shipped patterns.
13. **"A colour outside the five is added to the Mood Board" is not built** — that is the one-colour-picker PR's (Builder C, #6427).
14. **The swatches under "Match my photo's colours" (Buttons · Accents · Ornaments) are not drawn in the Studio**; Match / Keep is one dropdown and what it measures is behind its ⓘ.
15. **In the app-store shell there is no main background panel**, so there the Studio keeps row 1's rows (page fill, hero video, the old extras, Candlelight under Elements) and the "main background" line has no ⓘ to sit behind.
16. **The built Studio has no "LOOK ▾ · ▶" row above the bar and the picked segment is the shipped white pill, not ink** — both are the Studio's shipped chrome (round 3: "its one bar is the section picker — no second ▾ above it"), not touched by rows 1–2.
