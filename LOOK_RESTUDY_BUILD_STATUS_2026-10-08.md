# Look restudy — build status (2026-10-08, Builder L1)

Contract: `BACKGROUND_RESTUDY_2026-10-08_fable.md` § 6 (nine PRs) · prototype `prototypes/background_restudy_2026-10-08_fable.html` · screens `prototypes/background-restudy-2026-10-08/01–16`.
Builder L1 owns plan rows **1** and **2** only. Base: `origin/rd/studio-reply-by-editable` @ `124ada744`. Worktree `~/Documents/Claude/Projects/wt-look`.

_This file is updated after each finished item. If a line below says IN PROGRESS and nothing newer follows, the work stopped there._

## DONE
- **Row 1 · PR #6426 · `rd/look-three-tabs` · head `ed2ede65c`** — DRAFT, label `do-not-auto-merge`, auto-merge OFF, base `main` (built on `rd/studio-reply-by-editable` @ `124ada744`, so the PR's diff also shows the train until the train merges; row 1's own change is the one commit `ed2ede65c`).
  - **INTERIM REPORT (PR 1):** full `tsc` 0 errors (cold 4 min under the lock, then an incremental re-run after one type fix) · `pnpm lint` 0 errors · pinning tests 204 files / 1,479 tests / 1,478 pass / 0 fail / 1 todo (pre-existing) · 36 of 36 non-build `ci.yml` node guards green (port-control baseline regenerated: −`FilmFollowsTheme`). NOT run locally: full unit suite, `next build`, the 507 KB Maker budget, the route count — CI judges.
  - Sabotages, each seen red then restored: (1) hero video put back under Music in `LOOK_SECTION_PARTS` → `the-look-is-one-panel` (1)(1b) · (2) `part="art"` drawing the page fill → (4) · (3) a Save button back in `SiteChromePanel` → (6) and `studio-round-3` 6 · (4) the `?item=colours|font` alias removed → (1b) · (5) page.tsx `part="art"` → `"colours"` → (3) and `every-fact-has-one-editor` · (6) the Studio's main-extras moved off the main background → `the-main-background-extras-reach-the-page` and (1b) · (7) `film-follows-theme.tsx` recreated → `the-guided-steps-share-one-layout` (23) and `studio-round-3` 3 · (8) the hero video's "Go to" back to Music → (5) · (9) `LOOK_SECTION_ITEM_KEYS` without `elements` → `studio-followups` 7, `the-look-moves-into-details` (1)(6), (1b).
  - Side-by-side at 375: NOT captured for row 1's own state. Row 2's head carries the same three tabs; the controller takes row 1 on the Vercel preview.

## IN PROGRESS
- **Row 2 · PR #6431 (DRAFT, "WIP — …", `do-not-auto-merge`, auto-merge OFF) · `rd/background-source-cards` · head `42268191f` · base `rd/look-three-tabs`** — safeguard push at ~09:10 PHT (machine on battery).
  - BUILT and pushed: `lib/background-source.ts` (source read off what is stored · ◆ map · Shade write · one draft patch) · `background-cards.tsx` (BgRow · BgCards · BgCard · LoopPicture) · the panel's Studio branch (Source ▾ + cards for all five sources · Colour via `StudioColourField` · Shade ▾ incl. Candlelight · Motion · Blur · Focus · Match colours ▾ · in-place upload · hero video slot) · `lib/main-ground-patterns.ts` (the guest pattern CSS, moved byte for byte) · `CandlelightOffOnCanvas` (a draft takes a live Candlelight off the host's canvas) · Look draws each control once · guard `lib/the-background-has-one-source.test.ts` (8 tests) · port baseline regenerated · changelog fragment.
  - VERIFIED on the tree just before the last small edit: full `tsc` 0 errors · `pnpm lint` 0 errors · pinning tests 271 files / 1,952 tests / 1 fail (fixed: `HeroFrameSync` is one mount again) · 14 sabotages each caught (list below) · 35 of 36 node guards green + the port baseline regenerated (−`GroundCarousel`, +the cards).
  - STILL TO DO: merge the fixed base (`origin/rd/studio-reply-by-editable` @ `83c336a26`) into BOTH branches · run the `tests/db` files that pin Look draft columns · final tsc · rewrite the PR body · 375 captures (NOT taken — no dev server while on battery; the controller takes them on the Vercel preview).
  - Sabotages (row 2): library scene read as "own" → (1) · Scene's ◆ off → (2) · a Source pick that writes → (3) · a scene card as a bare `<img>` → (4) + `studio-round-3` 2 · a card without its swatch → (4) · `autoPlay` on a loop → (5) · reduced motion ignored → (5) · leaving Candlelight writes nothing → (6) · Look drawing the page fill twice → (7) · Candlelight under Elements in the Studio → (7) · the attribute not lifted → (8) · the marker mounted for a Candlelight draft → (8) · the cover-photo card bypassing `pickGround` → (3) + `studio-screens` 4 · a second `HeroFrameSync` mount → `opening-the-maker-counts-zero-waiting`.

## TODO (per plan row)
| # | Branch | State |
|---|---|---|
| 1 | `rd/look-three-tabs` | **PR #6426**, draft, head `ed2ede65c` — awaits CI + the owner's 375 side-by-side |
| 2 | `rd/background-source-cards` | **PR #6431**, WIP draft, head `42268191f` — being finished (L1) |
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

## Traps
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
