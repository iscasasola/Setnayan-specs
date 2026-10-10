# Next-account maps — 2026-10-10

Read-only mapping. Code read from `/Users/icecasasola/Documents/Claude/Projects/wt-review` (`apps/web`, HEAD `c896158cb`). No build, no tsc, no server was run. Everything below is from reading imports and source, so every byte figure is a PROXY (see the method line in MAP 1). No line numbers — every claim names a greppable symbol.

---

# MAP 1 — where the Maker's first download can give bytes back

## 0. Read this first: the one thing I could not settle without a build

Whether a first-load module that exports 80 symbols but is only USED for 3 of them ships all 80 depends on whether this Next/webpack build drops unused exports. I cannot run a build, so I report two numbers per module and say which is which:

* **SAFE (b):** code used ONLY by lazily loaded modules. A tree-shaker cannot remove it (a lazy module really imports it), so it travels in the first-load chunk purely because its neighbours live in a first-load file. This is the precedent: `RSVP_WORD_LINES` (lazy-only, 209 B gz) moved from `lib/rsvp-ask.ts` to `lib/rsvp-stage.ts`.
* **SPECULATIVE (c)(d)(e):** code used only by server code / other routes / tests / nobody. A working tree-shaker already removes these; moving them would then gain 0. The precedent that it may NOT be removed: `rsvpAskConfigOnGoingPublic` was imported only by `app/dashboard/[eventId]/website/privacy/actions.ts` (a `'use server'` file) and tests, and moving it still saved 75 B gz. One data point, so I rank it "plausible", not "proven".

**The one-build experiment that decides it (do this first, 2 minutes after any `next build`):**
`hubDraftBounceHref` in `lib/hub-draft.ts` is imported only by server actions and tests, and contains the unique literal `draft_error=`. After a build:
`cd apps/web && node -e "import('./scripts/check-maker-js-budget.mjs').then(m=>{const r=m.measure();const fs=require('fs');for(const c of r.chunks){if(fs.readFileSync('.next/'+c.chunk.replace(/^\/?_next\//,''),'utf8').includes('draft_error='))console.log('SHIPPED in',c.chunk,c.gz)}})"`
If it prints a chunk, unused exports are NOT eliminated and section 5b (about 40 KB gz speculative, mostly `lib/hub-draft.ts`) is real. If it prints nothing, only section 5a counts. The same probe for the SAFE group: the literal `LOGO_IN_LABEL`'s text from `lib/logo-layers.ts` should print a chunk (it is lazy-only but sits in a first-load module).

Calibration of my gz proxy: the moved `RSVP_WORD_LINES` block is 826 B of comment-stripped, whitespace-collapsed source and saved 209 B gz, a ratio of 0.25. Per-module ratios measured the same way are 0.25–0.33 (gzip of the module's own comment-stripped text ÷ its length). I use each module's own ratio. Expect ±40% on any single figure.

## 1. The first-load module set (static walk, not a build)

Method: `/tmp`-style throwaway walker (scratchpad only, not committed). Entries: `app/error.tsx`, `app/not-found.tsx`, `app/global-error.tsx`, `app/layout.tsx`, `app/dashboard/layout.tsx`, `app/dashboard/[eventId]/layout.tsx`, `…/template.tsx`, `…/loading.tsx`, `…/launch/loading.tsx`, `…/launch/page.tsx` (`app/dashboard/layout.tsx` has no `template`/`loading` sibling; `app/dashboard/[eventId]/launch/` has no layout). Rules: follow static `import`/`export … from` (type-only imports skipped, comments stripped); a `'use client'` module ships and everything it imports ships; a server file ships nothing itself but every `'use client'` module it imports DOES (the eager rule stated in the docblock of `launch/_components/details-lazy.tsx`); a `'use server'` file is a stub (its imports do not ship); `import()` is a lazy boundary.

Result: **402 client modules** in the first load (code files only), 467 server-only files behind them, 34 `'use server'` stubs, and **116 lazy targets** reached from client modules (almost all through `details-lazy.tsx`, `scene-styles-lazy.tsx`, `guest-setup-lazy.tsx`, `schedule-lazy.tsx`, `seating-lazy.tsx`, `mood-board-lazy.tsx`, `moment-order-cards-lazy.tsx`, and `maker-tools.tsx`), whose own static closure is 480 lazy-only modules. Comment-stripped source of the 402 gzips to about 452 KB; the real bundle is smaller (types and identifiers vanish), which is consistent with ~250–300 KB of app code inside the 507 KB.

Confirmed first-load (reached statically): `lib/hub-draft.ts` (via `launch/_components/maker-shell.tsx`, `website/_components/hub-draft-bar.tsx`, `website/_components/hub-draft-field.tsx`), `lib/rsvp-ask.ts` (only via `lib/hub-draft.ts`), `lib/hub-canvas.ts`, `lib/hub-scenes.ts` (via `lib/hub-canvas.ts`), `maker-shell.tsx`, `details-workspace.tsx`.

**DISCREPANCY — `lib/maker-parts.ts` is NOT first-load in my walk.** Every importer is lazy-only: `stage-tools.tsx`, `stages-studio-parts.tsx`, `add-part-sheet.tsx`, `stage-item-menu.tsx`, `stage-panel/kit.tsx`, `stage-panel/store.ts`, `maker-rsvp-ask.tsx`, `scene-animate-tab.tsx`, `fixed-scene-style-row.tsx`, plus `lib/maker-stage-filing.ts` / `lib/maker-part-groups.ts` (themselves lazy-only apart from the guest page `site-body.tsx`, a different route). I searched for `import type` edges and a reverse path from `maker-parts` to any first-load file and found none. If the 227 B gz growth you measured from the Post Event entries is real, either (i) a path I cannot see exists (a `require`, a re-export I missed, a package-level import), or (ii) the budget counts a chunk that holds lazy modules (check which chunk contains `MAKER_PARTS` in `.next/static/chunks`). I did not count `maker-parts` as first-load below.

**Where my walk is uncertain:** it is regex-based (no TypeScript parser), so `export *` barrels, `require()`, and unusual import spellings can be missed; it cannot see webpack's chunk splitting (a module shared by two lazy chunks may sit in a shared async chunk, which is still not first load); `next/dynamic` calls inside SERVER files were treated as client-lazy only when their importer is a client module. Big first-load files OUTSIDE the two folders you asked about, reached from the Maker page: `app/dashboard/[eventId]/website/editor/_components/editor-shell.tsx` (197 KB raw, 58 KB gz source; reached through `launch/page.tsx` importing `WebsiteEditorPage`), `app/_components/frontdoor/front-door-shell.tsx` (via the event layout), `app/_components/file-upload.tsx` (via `maker-made-once.tsx`). Not analysed.

## 2. The 15 largest first-load modules (lib/ + launch/_components/)

Sizes: `gzip -c <file> | wc -c` on the SOURCE (a proxy; this repo's files are comment-heavy). "Code B" = comment-stripped, whitespace-collapsed. Export counts are runtime exports (types excluded), classed by who imports them: **a** = another first-load module · **b** = only lazy modules · **c** = only server code or other routes · **d** = only tests · **e** = nobody. "First-load closure" = bytes of the statements first-load code actually reaches (its exports plus the helpers they call).

| Module | src gz | src raw | Code B | exports a/b/c/d/e | first-load closure B | non-first-load B (est gz) |
|---|---|---|---|---|---|---|
| `lib/hub-draft.ts` | 41,286 | 135,065 | 55,947 | 3/0/37/42/0 | 668 | 55,279 (~13,900) |
| `lib/hub-canvas.ts` | 29,040 | 85,379 | 29,052 | 15/44/21/23/0 | 17,019 | 12,033 (~3,100) |
| `launch/_components/maker-shell.tsx` | 24,646 | 75,386 | 34,251 | whole component (client ref from `page.tsx`) | all | 0 |
| `lib/element-style.ts` | 24,212 | 75,670 | 35,867 | 8/39/17/30/0 | 12,402 | 23,465 (~6,050) |
| `lib/entourage.ts` | 19,891 | 57,083 | 16,827 | 3/3/15/9/0 | 3,407 | 13,420 (~3,800) |
| `lib/guests.ts` | 19,117 | 52,446 | 15,120 | 4/3/33/3/0 | 1,298 | 13,822 (~3,900) |
| `lib/logo-layers.ts` | 18,888 | 54,206 | 28,537 | 3/59/0/23/0 | 9,175 | 19,362 (~6,100) |
| `launch/_components/details-workspace.tsx` | 17,526 | 56,442 | 25,961 | whole component | all | 0 |
| `lib/notifications.ts` | 16,565 | 49,491 | 10,819 | 1/0/4/0/0 | 389 | 10,430 (~2,600) |
| `lib/print-pieces.ts` | 15,072 | 43,467 | 18,299 | 2/6/36/7/0 | 2,204 | 16,095 (~4,900) |
| `lib/r2-client-ref.ts` | 13,578 | 36,751 | 8,234 | 1/0/34/0/0 | 64 | 8,170 (~2,200) |
| `lib/invitation-widgets.ts` | 12,428 | 34,681 | 10,490 | 13/0/6/3/0 | 8,753 | 1,737 (~500) |
| `lib/maker-scene-list.ts` | 11,877 | 34,598 | 14,598 | 5/0/7/4/0 | 4,423 | 10,175 (~3,150) |
| `lib/mood-board.ts` | 10,697 | 31,727 | 11,796 | 2/14/3/1/0 | 9,054 | 2,742 (~770) |
| `lib/site-palette.ts` | 10,689 | 28,678 | 11,374 | 1/4/6/3/0 | 1,273 | 10,101 (~3,050) |
| (asked by name) `lib/rsvp-ask.ts` | 7,006 | 18,844 | 6,320 | 1/11/8/0/9 (the nine e are small) | 2,637 | 3,683 (~1,100) |
| (asked by name) `lib/hub-scenes.ts` | 5,912 | 15,236 | 4,533 | 2/8/8/3/1 | 487 | 4,046 (~1,340) |

`maker-shell.tsx` and `details-workspace.tsx` export one component each (imported by the server `page.tsx` / by `maker-shell.tsx`), so there is nothing to give back at export level; their lever would be splitting inside the file, which this map does not cover. Next five by size, for completeness: `lib/post-event-scenes.ts` (non-first-load ~3,050 gz, all server/other-route), `lib/details-guided-flow.ts` (~2,740, other routes), `lib/maker-details-items.ts` (~1,020), `lib/invite-themes.ts` (~690), `lib/chat.ts` (~2,180, c).

Per-symbol importer lists for every module above were generated (all 1,000+ symbols); the candidate rows below are the ones that matter. Who imports what for the a-group: `lib/hub-draft.ts` is used by first-load only for `HUB_DRAFT_FIELD`, `HUB_RESET_NEVER_TOUCHES`, `hubDraftOutcome`; `lib/notifications.ts` only for `countUnread` (from `app/_components/unread-bell-badge.tsx`, in the event layout); `lib/r2-client-ref.ts` only `PUBLIC_R2_BUCKET` (from `lib/hub-music-ref.ts`, `lib/site-media-ref.ts`); `lib/site-palette.ts` only `readableTextOn` (from `lib/hub-legibility.ts`); `lib/guests.ts` only `INVITED_TO_BLOCKS`, `INVITED_TO_LABELS`, `defaultInvitedToForRole`, `guestFullName`; `lib/print-pieces.ts` only `OPENING_LINE_TEMPLATES`, `PRINT_PIECES`, `PRINT_SET_KEYS`; `lib/logo-layers.ts` only `sanitizeLogoLayers`, `logoHasMotion`, `centreLogoOnItsInk`.

## 3. Candidates

### 3a. (b) used only by lazy modules — the SAFE group

Bytes = comment-stripped source of the symbols plus the helpers only they reach, outside the first-load closure; gz = × the module's ratio. `~/` = `app/dashboard/[eventId]/`, `L/` = `~/launch/_components/`. Tests = distinct test files that import one of the moved names OR read the module source and name one (a move must re-aim all of them). Overlap between clusters of the same module (shared helpers) is removed in the ranked list in section 5.

| Module → where it could go | symbols (count) | B | ~gz | importers (all lazy-only) | tests to re-aim |
|---|---|---|---|---|---|
| `lib/logo-layers.ts` → neighbour of `L/maker-logo.tsx` (new lib file imported only from it, e.g. `lib/logo-layers-edit.ts`; `maker-logo` is a named `details-lazy` door) | 28: `LOGO_IN_LABEL`, `LOGO_DURING_LABEL`, `LOGO_OUT_LABEL`, `LOGO_FRAME_LABEL`, `composeLogoSvg`, `layersFromSaved`, `writePartPassages`, `snapInFrame`, `moveLayer`, `retimeLayers`, `svgAsLayerBody`, `tintParts`, … | 13,466 | ~4,230 | `L/maker-logo.tsx` | 6: `studio-logo-are-the-templates`, `the-logo-adds-three-things-only`, `the-logo-is-layers`, `logo-fonts`, `a-logo-is-centred-by-its-ink`, `every-logo-plays` |
| `lib/logo-layers.ts` → beside `app/_components/layered-logo-player.tsx` (lazy via `couple-logo.tsx`) | 10: `LOGO_OUT_HOLD_SECONDS`, `logoInSeconds`, `penProgress`, `writeRevealPlan`, `revealLayersAt`, `logoElementPlayable`, `logoAttributePlayable`, `parseWritePathD`, … | 6,711 (overlaps the row above) | ~1,510 net | `layered-logo-player.tsx` (and `maker-logo.tsx`) | 3: `studio-logo-are-the-templates`, `every-logo-plays`, `the-logo-is-layers` |
| `lib/site-palette.ts` → `lib/theme-colours.ts` (lazy-only; already a consumer) | `buildSitePaletteVars`, `moodBoardSiteColours` | 6,603 | ~2,000 | `lib/theme-colours.ts` | 4: `a-theme-preview-wears-the-palette`, `site-palette`, `the-colors-panel-shows-the-mood-board`, `the-venue-cards-are-readable` |
| `lib/site-palette.ts` → `lib/dance-mural-texture.ts` | `ledPaletteFromMoodBoard` | 2,182 | ~380 net | that file | 2: `dance-mural-texture`, `site-palette` |
| `lib/site-palette.ts` → `app/[slug]/_lib/pro-site-vars.ts` | `buildCustomSiteColorVars` | 801 | ~175 net | `pro-site-vars.ts`, `lib/look-sample.ts` | 1: `site-palette` |
| `lib/element-style.ts` → `lib/block-looks.ts` (already holds the "block look" neighbours) | `hubElementMotionDeclarations` and its keyframe helpers `hubElInKeyframe`/`hubElOutKeyframe` | 4,823 | ~1,240 | `lib/block-looks.ts` | 8: `part-runs`, `the-couples-line-follows-the-hub`, `element-preview`, `motion-four-effects`, `movement-is-a-feel-per-phase`, `one-letter-and-its-own-motion`, `the-motion-reaches-the-guest`, `the-stages-panel-is-the-prototypes` |
| `lib/element-style.ts` → `~/website/editor/_components/part-inspector.tsx` neighbour | 10: `stepHubElementSize`, `stepHubSpacing`, `hubSpacingLabel`, `hasTextStyle`, `HUB_ELEMENT_WEIGHT_LABEL`, `HUB_ELEMENT_ALIGN_LABEL`, `HUB_PART_WORDS_HINT`, `HUB_EL_TIMELINE(_LABEL)`, `HUB_EL_DELAY_LABEL` | 2,862 | ~740 | `part-inspector.tsx`, `scene-style-row.tsx` | 5: `part-runs`, `the-couples-line-follows-the-hub`, `element-preview`, `element-size-scale`, `the-stages-panel-is-the-prototypes` |
| `lib/element-style.ts` → `~/website/editor/_components/element-sheet.tsx` neighbour | 8: `withRunChoice`, `withoutRuns`, `withoutTextStyle`, `withElementMotion`, `withElementAlign`, `withoutMotion`, `hubRunsForRange`, `hubElementContrast` | 6,207 | ~1,560 | `element-sheet.tsx`, `scene-style-row.tsx` | 11 (the 5 above plus `pages-text-rows-reach-the-guest`, `motion-four-effects`, `movement-is-a-feel-per-phase`, `one-letter-and-its-own-motion`, `element-runs-adapt`, `colour-wheel`, `element-style`) |
| `lib/hub-canvas.ts` → `lib/scene-frame-look.ts` | `hubCanvasVars`, `hubCanvasClass`, `hubSpacingClass` | 5,824 | ~1,510 | `lib/scene-frame-look.ts` | **23** (21 import + 13 source-read, overlapping) |
| `lib/hub-canvas.ts` → `scene-animate-tab.tsx` / `studio-tools.tsx` / `main-background-panel.tsx` / `scene-background-row.tsx` | the `HUB_*_LABEL` tables (`HUB_MOTION_PRESET_LABEL`, `HUB_TIMELINE_LABEL`, `HUB_MAIN_PATTERN_LABEL`, `HUB_MEDIA_MOTION_LABEL`), `hubMainTakes`, `mainGroundPosition`, `hubMainFadeAt` | 2,539 + 608 + 577 + 408 | ~660 + 160 + 150 + 105 | those four files, `lib/background-fade.ts`, `lib/scene-media-shade.ts`, `lib/scene-shade-bar.ts` | 7–14 each |
| `lib/hub-scenes.ts` → `scene-animate-tab.tsx` | `HUB_TRANSITION_LABEL`, `HUB_TRANSITION_HINT`, `HUB_DEFAULT_AUTO_SPEED`, `HUB_AUTO_SPEED_LABEL`, `resolveTransition`, `nextTransition` | 1,566 | ~520 | `scene-animate-tab.tsx` | 5: `hub-scenes`, `movement-is-a-feel-per-phase`, `a-hybrid-page-renders-runs`, `scrub-is-a-held-hand-over`, `scrub-out-ships-dark` |
| `lib/guests.ts` → `~/guests/claims/keep-quick-add.tsx` | `guestRoleLabel`, `guestRolePickLabel`, `SIDE_LABELS` | 1,647 | ~465 | `keep-quick-add.tsx` (also used by server and other routes — only worth moving if those import a different file) | 4: `home-numbers-move`, `role-names-reach-every-screen`, `root-map-waves-2-3`, `no-side-surface-on-a-sideless-event` |
| `lib/mood-board.ts` → `lib/mood-board-board-ops.ts` | `DEFAULT_PALETTE_SUGGESTIONS` | 653 | ~180 | that file | 1: `guest-colors-are-options` |
| `lib/mood-board.ts` → `palette-board-context.tsx` / `plan3d-scene.tsx` / `moodboard-render-parts.ts` | `resolveRoomDressing`, `sideAttireColor`, `resolveAttirePaletteColor`, `isWeddingPartyFineKey` | ~2,100 total | ~590 | lazy files | 2–4 each |
| `lib/rsvp-ask.ts` → `lib/who-can-reply.ts` / `maker-rsvp-ask.tsx` / `rsvp-asks.tsx` | `rsvpAnswerWord`, `readOneAtATime`, and the who-can-reply helpers | ~1,500 | ~450 | those files | 2–7 each |
| `lib/entourage.ts` → `lib/march-drag.ts` / `march-moves.ts` / `details-march.tsx` | `columnOfRole`, `isMarchOnlyGroup`, `marchGroupKeys` | 690 | ~195 | those files | ~5 |
| `lib/print-pieces.ts` → `poster-photo-picker.tsx` / `print-menu-editor.tsx` | `posterPhotoTooSmall` and 4 small ones | 474 | ~145 | those files | ~9 |

Group total (b), mutually exclusive, whole fifteen + the two named modules: about **16,500 B gz estimated** (logo-layers 5.7 KB, element-style 3.7 KB, site-palette 2.6 KB, hub-canvas 2.2 KB, mood-board 0.6 KB, hub-scenes 0.5 KB, guests 0.5 KB, rsvp-ask 0.45 KB, entourage 0.2 KB, print-pieces 0.15 KB).

### 3b. (c)(d)(e) — only server code, other routes, tests, or nobody (SPECULATIVE; see section 0)

Per module the non-first-load code that is not (b), so it exists only for server/other-route/test callers. Bytes are comment-stripped, gz estimated:

| Module | (c) server/other-route | (d) tests only | (e) nobody | Existing home for the (c) part |
|---|---|---|---|---|
| `lib/hub-draft.ts` | 54,233 B (~13,650 gz): `planHubDraftApply`, `mergeHubDraft`, `classifyHubDraft`, `sanitizeHubDraft(EventValue)`, `overlayHubDraftEvent/Widgets`, `summarizeHubDraft`, `HUB_DRAFT_EVENT_LABEL`, … | 1,046 (~260) | 0 | server callers already live in `lib/hub-draft-store.ts`, `lib/hub-draft-change-lines.ts`, `lib/hub-pro-effects.ts`, `website/hub-draft-actions.ts` (server set) |
| `lib/notifications.ts` | 10,430 (~2,600): `NOTIFICATION_TYPE_TONE`, `NOTIFICATION_TYPE_LABEL` (4.9 KB and 4.4 KB tables), the readers/writers | 0 | 0 | `lib/notification-emit.ts` (server), `lib/notification-actions.ts` |
| `lib/print-pieces.ts` | 15,502 (~4,720) | 119 | 0 | `lib/print-*.ts` siblings (`print-set.server.ts`, `print-render-svg.ts`) |
| `lib/guests.ts` | 10,899 (~3,080): the `fetch*` readers | 1,276 (~360) | 0 | `lib/guests-read.server.ts` (exists) |
| `lib/entourage.ts` | 11,086 (~3,150): `buildEntourage`, `roleBlocks`, `entourageLines` | 1,644 (~470) | 0 | `lib/march-sections.ts` (server) |
| `lib/maker-scene-list.ts` | 10,175 (~3,150) | 0 | 0 | (not checked) |
| `lib/site-palette.ts` | 1,664 (~500) | 0 | 0 | — |
| `lib/r2-client-ref.ts` | 8,170 (~2,160): 34 other-route/server exports, kernel is one constant | 0 | 0 | `lib/r2.ts` (first-load too!), `lib/uploads.ts` (server) |
| `lib/hub-canvas.ts` | 3,158 (~820) | 507 (~130) | 0 | — |
| `lib/element-style.ts` | 8,553 (~2,200) | 752 (~190) | 0 | — |
| `lib/rsvp-ask.ts` | 2,038 (~610) | 0 | 135 (~40): `WHO_CAN_RSVP_DEFAULT`, `WHO_CAN_RSVP_LABEL`, `RSVP_WORD_DEFAULT`, `DEFAULT_REPLY_BY_DAYS` | `lib/going-public.ts` (already took one) |
| `lib/hub-scenes.ts` | 1,965 (~650) | 515 (~170) | 63 (`HUB_DEFAULT_TRANSITION`) | — |

Total (c)+(d)+(e) over these modules ≈ 38,000 + 2,000 + 40 B gz estimated (almost 14 KB of it `lib/hub-draft.ts`).

**Cheaper shape for (c): extract the small first-load kernel, not the big rest.** When the first-load kernel is tiny, move the kernel to a NEW small module and leave a re-export in the old file (so the 40–60 tests that import the old path keep working). Then only the first-load importers are re-pointed. Kernels: `lib/hub-draft.ts` (3 symbols, 668 B; 3 importers: `maker-shell.tsx`, `hub-draft-bar.tsx`, `hub-draft-field.tsx`; 9 tests read it by source and name a kernel symbol: `the-toolbar-never-hides-restore-undo-apply`, `draft-1-3-waits-for-apply`, `maker-live-savers-draft`, `nothing-locks-before-apply`, `photos-two-ways`, `studio-round-3-follows-the-owner`, `studio-rsvp-wears-the-templates`, `the-draft-always-fits`, `the-look-is-one-panel`), `lib/notifications.ts` (`countUnread`, 1 importer, 0 pinned tests), `lib/r2-client-ref.ts` (`PUBLIC_R2_BUCKET`, 2 importers, 5 pinned tests: `each-background-kind-reaches-the-page`, `scene-words-follow-the-ground`, `scenes-reach-the-page`, `the-canvas-fails-visible`, `the-panel-follow-ups-are-real`), `lib/site-palette.ts` (`readableTextOn`, 1 importer, 0 tests), `lib/hub-scenes.ts` (2 symbols, 1 importer, 0 tests), `lib/guests.ts` (4 symbols, 2 importers, 7 tests), `lib/print-pieces.ts` (2 symbols, 1 importer, 6 tests), `lib/entourage.ts` (3 symbols, 3 importers, 6 tests).

**Cascade upside of splitting `lib/hub-draft.ts` (not in any total above):** its non-kernel half is the ONLY first-load path to 14 other modules (about 49 KB comment-stripped code, ≈ 12–14 KB gz if shipped): `lib/monogram-studio-shared.ts`, `lib/std-reveal-effects.ts`, `lib/rsvp-ask.ts`, `lib/hub-buttons.ts`, `lib/qr-look.ts`, `lib/main-colours.ts`, `lib/march-draft.ts`, `lib/reveal-access.ts`, `lib/typed-names.ts`, `lib/hub-music-button.ts`, `lib/site-roles.ts`, `lib/editor-return.ts`, `lib/magic-move.ts`, `lib/camera-look-key.ts`. Only meaningful if the experiment in section 0 shows exports are not eliminated.

## 4. Big static DATA tables in first-load files

Found by scanning every first-load `const` over 1.5 KB whose initialiser is a literal array/object/Set (JSX excluded). "Used" = how much of it first-load code touches.

| Table | File | Bytes | ~gz | First-load use |
|---|---|---|---|---|
| `T` (the scene templates) | `lib/scene-templates.ts` | 10,090 | ~2,230 | read through `SCENE_TEMPLATES`, `sceneTemplatesIn`, `SCENE_FAMILIES` by `scene-template-picker.tsx` and `post-event-tile-words.ts` (editor, first-load), `lib/custom-sections.ts`, `lib/details-bound.ts` — whole table needed unless the picker goes lazy |
| `INVITE_THEMES` | `lib/invite-themes.ts` | 8,606 | ~2,550 | first-load callers `maker-theme-picker.tsx`, `lib/hub-canvas.ts`, `lib/hub-draft.ts`, `lib/main-colours.ts`, `lib/mood-board-palette-set.ts`, `lib/print-pieces.ts` read id lists and names; the colour data is only needed by the theme gallery |
| `HUB_FONTS` | `lib/hub-fonts.ts` | 7,229 | ~1,710 | first-load users take `HUB_FONT_BY_KEY`, `sanitizeHubFontKey`, `isHubFontKey` (key/validity only); `HUB_FONT_FACES` (2,290 B, ~540 gz) is imported by a lazy module and tests only — SAFE move candidate |
| `FIXED` (private) | `lib/post-event-scenes.ts` | 6,432 | ~1,790 | first-load uses only `postEventSceneDrawn`, `postEventSceneKeyForBlock`; whether those read the whole `FIXED` table I did not trace |
| `NOTIFICATION_TYPE_TONE`, `NOTIFICATION_TYPE_LABEL` | `lib/notifications.ts` | 4,916 + 4,390 | ~1,230 + ~1,100 | used by other routes and tests only (first-load reads `countUnread` alone) — moving them is a pure (c) move: ~2.3 KB gz if not eliminated |
| `PALETTE_LIMITS` | `lib/mood-board.ts` | 3,179 | ~890 | 8 lazy importers, 6 tests; a first-load module reaches it through the closure — check before moving |
| `GUIDED_STEPS` | `lib/details-guided-flow.ts` | 2,639 | ~730 | tests only (first-load uses the navigators, not this table) — (d) |
| `WIDGET_CATALOG` | `lib/invitation-widgets.ts` | 2,950 | ~860 | tests only import it by name, but `widgetByType`/`WIDGET_CATALOG_BY_TYPE` are first-load and likely build from it — kernel |
| `NAV_ICON_COMPONENTS` | `lib/nav-icons.ts` | 2,565 | ~680 | `getLucideIcon` is first-load (nav chrome), whole table needed |
| `GROUPS` (private) | `lib/entourage.ts` | 2,039 | ~580 | only `buildEntourage`/`entourageGroupLabel` (non-first-load) reach it — a (c) move |
| `HUB_DRAFT_EVENT_LABEL` | `lib/hub-draft.ts` | 2,020 | ~510 | tests only |
| `PRINT_PIECES` | `lib/print-pieces.ts` | 1,894 | ~580 | first-load (`maker-details-items.ts`) |
| `MAKER_FIXED_LABEL`, `MAKER_FIXED_SOURCE` | `lib/maker-scene-list.ts` | 1,848 + 1,844 | ~570 + ~570 | first-load (`maker-selection.ts`, `editor-shell.tsx`) |
| `ROUTE_STEPS` | `components/sd-loader/loader-steps.ts` | 1,650 | ~560 | first-load |
| `POST_EVENT_WAITING` | `lib/post-event-scenes.ts` | 1,589 | ~440 | one other-route importer + one test — (c) |
| `LOGO_FONT_OUTLINE` | `lib/logo-fonts.ts` | 1,572 | ~585 | one test only; first-load takes `LOGO_FONT_OUTLINE_ITALIC` and `LOGO_LEGACY_FONT` — (d) |

The two pure tables where a first-load module uses NONE of them and the moves are mechanical: `NOTIFICATION_TYPE_TONE`/`NOTIFICATION_TYPE_LABEL` (c, ~2.3 KB gz, speculative) and `HUB_FONT_FACES` (b, ~540 gz, safe).

## 5. Ranked: the ten cheapest moves (gz ÷ tests to re-aim), running total

### 5a. SAFE (b) moves — the ranked list you asked for

Increments are net of overlap with moves above them in the same module; all destinations are existing lazy-only modules, or a new file imported only by them (which joins that chunk — no new chunk, no extra runtime entry; the budget file's own comment prices a new lazy DOOR at ~56 B).

| # | Move | gz (est) | tests | gz/test | running total |
|---|---|---|---|---|---|
| 1 | `lib/logo-layers.ts` editor half (28 symbols) → beside `L/maker-logo.tsx` | 4,230 | 6 | 705 | 4,230 |
| 2 | `lib/logo-layers.ts` player half → beside `app/_components/layered-logo-player.tsx` | 1,510 | 3 | 502 | 5,740 |
| 3 | `lib/site-palette.ts` `buildSitePaletteVars` + `moodBoardSiteColours` → `lib/theme-colours.ts` | 2,000 | 4 | 500 | 7,740 |
| 4 | `lib/site-palette.ts` `ledPaletteFromMoodBoard` → `lib/dance-mural-texture.ts` | 380 | 2 | 191 | 8,110 |
| 5 | `lib/site-palette.ts` `buildCustomSiteColorVars` → `app/[slug]/_lib/pro-site-vars.ts` | 175 | 1 | 175 | 8,290 |
| 6 | `lib/mood-board.ts` `DEFAULT_PALETTE_SUGGESTIONS` → `lib/mood-board-board-ops.ts` | 180 | 1 | 182 | 8,470 |
| 7 | `lib/element-style.ts` `hubElementMotionDeclarations` (+ keyframe helpers) → `lib/block-looks.ts` | 1,240 | 8 | 156 | 9,710 |
| 8 | `lib/element-style.ts` part-inspector setters → beside `part-inspector.tsx` | 740 | 5 | 148 | 10,450 |
| 9 | `lib/element-style.ts` run/motion/align setters → beside `element-sheet.tsx` | 1,555 | 11 | 141 | 12,010 |
| 10 | `lib/guests.ts` role-label trio → beside `keep-quick-add.tsx` | 465 | 4 | 116 | 12,470 |

(Rank 11–14 for reference: `lib/hub-scenes.ts` → `scene-animate-tab.tsx` 520 gz/5 tests; `lib/hub-canvas.ts` → `lib/scene-frame-look.ts` 1,510 gz/**23** tests, which is why it ranks 12th; `lib/rsvp-ask.ts` → `maker-rsvp-ask.tsx` 170/3; `lib/hub-canvas.ts` label tables → `scene-animate-tab.tsx` 130/14.)

**Total I believe is safely recoverable: about 12 KB gz (12,470 B by the proxy; I would plan on 8 KB as the floor and 15 KB as the ceiling).** That is the sum of the ten moves above, all (b) — valid whether or not the build eliminates unused exports. The whole (b) group is 16.5 KB gz; ranks 11+ add the rest at 15–60 tests each.

**Top three moves:** (1) `lib/logo-layers.ts` editor half beside `maker-logo.tsx` (4.2 KB), (2) `lib/site-palette.ts` palette builders into `lib/theme-colours.ts` (2.0 KB), (3) `lib/logo-layers.ts` player half beside `layered-logo-player.tsx` (1.5 KB). For the best bytes per test ignore size and take the three `site-palette` moves plus `mood-board` (4 moves, 2.7 KB, 8 tests).

### 5b. SPECULATIVE (c)(d)(e) kernel extractions (only if the section 0 probe prints a chunk)

Cheapest first, using the "extract the kernel, re-export from the old file" shape (tests that import the old path keep working; the numbers are the tests that read the old file's source and name a kernel symbol):

| Module (kernel) | saves ~gz | first-load importers to re-point | pinned tests |
|---|---|---|---|
| `lib/notifications.ts` (`countUnread`) | 2,600 | 1 | 0 |
| `lib/site-palette.ts` (`readableTextOn`) | 3,050 (3,000 of it overlaps 5a rank 3–5) | 1 | 0 |
| `lib/hub-scenes.ts` | 1,340 (800 overlaps 5a) | 1 | 0 |
| `lib/r2-client-ref.ts` (`PUBLIC_R2_BUCKET`) | 2,160 | 2 | 5 |
| `lib/hub-draft.ts` (3 symbols) | 13,900 (+ cascade up to ~13,000) | 3 | 9 |
| `lib/guests.ts` | 3,900 | 2 | 7 |
| `lib/print-pieces.ts` | 4,900 | 1 | 6 |
| `lib/entourage.ts` | 3,800 | 3 | 6 |
| `lib/maker-scene-list.ts` | 3,150 | 2 | 4 |

Upper bound if nothing is eliminated: about 40 KB gz, ~27 KB of it counted once `hub-draft` and its cascade are included. This is not a recommendation until the probe has run.

## NOT VERIFIED (MAP 1)

* No build was run: every gz figure is a proxy (source ÷ per-module ratio, ratio checked against exactly one precedent, `RSVP_WORD_LINES`). Chunk placement (shared chunks, `splitChunks`) was not observable.
* Whether unused exports are eliminated (section 0) — undecided; the 75 B precedent leans "not fully".
* `lib/maker-parts.ts` as first-load: my walk says it is not (see section 1). I could not explain the +227 B.
* The walker is regex-based. `export *`, `require`, and non-standard import spellings may be missed. `import type` edges were deliberately skipped.
* "Tests to re-aim" counts test files that import a moved name or read the module source (`readFileSync`/`fs.`) and name a moved symbol. It over-counts files that mention a name in prose and may miss a guard that scans a whole directory.
* Cluster sizes of different moves in one module overlap on shared helpers; the ranked list nets that out, the section 3a table does not.
* `launch/_components/maker-shell.tsx` and `details-workspace.tsx` were not analysed inside the file.
* `editor-shell.tsx`, `front-door-shell.tsx`, `file-upload.tsx` (the three biggest first-load files outside the two folders) were identified but not analysed.
* I did not check whether a Maker session would still work if `lib/logo-layers.ts`'s lazy half moved: that depends on `maker-logo`'s own load order and the `maker-tools-are-all-preloaded.test.ts` / `details-pieces-are-lazy.test.ts` guards, which would need a read.

---

# MAP 2 — the six sample blocks: where each guest's real one is drawn

Mechanism to attach a look (already shipped for the four real blocks): `lib/block-looks.ts` — `BLOCK_LOOK_BLOCKS = ['entourage','details','gifts','spotlight']`; the page puts a hidden `<span data-block-mark="<block>">` (`BLOCK_MARK_ATTR`) IMMEDIATELY BEFORE the block, one `<style data-block-looks>` (`BLOCK_LOOKS_STYLE_ATTR`) carries the CSS, and `blockSelector()` addresses "the element right after the mark" (or right after the Maker's own `data-maker-section` marker). In `app/[slug]/_components/site-body.tsx` the closure is `blockMark(block)` (renders for every block on the Maker's canvas, only when a look exists for a guest), and `blockLooksCss(readBlockLooks(event.style_preferences))` feeds the `<style>`. So "one clean root" means: ONE element that is always the next sibling of where the mark goes, and nothing after the mark when the block draws nothing.

"The page reads `events.style_preferences`": proved via `loadEventShell` in `app/[slug]/_lib/loaders.ts` (its select string includes `style_preferences`), used by `app/[slug]/page.tsx`, `app/[slug]/layout.tsx`, `app/[slug]/find-seat/page.tsx`. Pages that do NOT read it (own `.from('events')` select, no `style_preferences`): `app/[slug]/seat/page.tsx`, `app/[slug]/find-my-table/page.tsx`, `app/[slug]/hub/page.tsx`, `app/papic/me/[token]/page.tsx`.

## Summary

| Block | Verdict | Root a look attaches to |
|---|---|---|
| Your seat `f:find_your_seat` | **READY** | `<section>` of `YourSeatBlock` (all 3 styles) |
| Photos of you `f:photos_of_you` | **READY** | `<section aria-label="Photos of you" className="sn-gal p-5 sm:p-6">` |
| Digital pass `f:pass` | **READY** | `<section id={PASS_ANCHOR} data-motion="pass" data-guest-ticket=…>` |
| Announcements `f:announcements` | **READY** (needs the style emitted in the layout) | `<aside role="status" aria-live="polite" …>` |
| What to wear `f:look` | **NEEDS A NAME ON THE ROOT** | Welcome: bare `<section className="space-y-5">`; Me: `<section data-me-part="wear">` |
| Live hub `f:live_hub` | **NEEDS A WRAPPER** (default style) | two sibling `<section>`s; one `<section data-scene-style>` for Theatre / Wall first |

## 1. Your seat — `f:find_your_seat` (part `seats`)

* **Canvas sample:** `MakerDayPartStandIn` (`part="find_your_seat"`) in `app/[slug]/_components/maker-fixed-parts.tsx` — root `<section data-maker-day-part="find_your_seat" data-maker-day-sample=…>`, shapes from `DAY_SAMPLE['find_your_seat:map' | ':table-number' | ':place-card']`. Mounted by `makerDayStandIns` in `site-body.tsx` (`isMakerCanvas` only), after `makerMark('f:find_your_seat')`.
* **Real, per guest:** `YourSeatBlock` (`app/[slug]/_components/your-seat-block.tsx`), styles `SeatTableNumber` / `SeatPlaceCard` in `your-seat-styles.tsx`. Mounted from the single `seatBlock` const in `site-body.tsx`: `group(seatTab, seatBlock)` on the guest page's Welcome/Details tab, or inside Me (`tableOnMe`) when the guest's bar has Me — one block, two slots, never both. Route `app/[slug]/page.tsx`. Condition: a guest we know who has a table AND seats may be seen (`seatMap`; `guestsMaySeeSeatsFor`, `lib/guests-may-see-seats.ts` — "only on the day", `doorwayFacts.seatingPublished`). Before the day there is no table and no plan at all.
* **One root?** Yes in every style: default `<section className="pahina-plate sm:p-6 …">` (header carries `data-your-table`), `<section data-scene-style="table-number">`, `<section data-scene-style="place-card">`. The block draws nothing when `seatMap` is null, so the mark would sit last in its group (no stray target).
* **Reads the column?** Yes: `site-body.tsx` already holds `event.style_preferences` and `readBlockLooks(...)`.
* **One look for all its surfaces?** Only for `YourSeatBlock`. The other "seat" surfaces are a pill link (`Link href=/${slug}/find-seat` in `site-body.tsx`), `SeatDoorLine` (`<p data-seat-door>`, a text link, in Details and Me), and whole pages (`app/[slug]/find-seat/page.tsx` with `YourSeat`/`DoorPass`/`SeatFrame`, `app/[slug]/seat/page.tsx`, `app/[slug]/find-my-table/page.tsx`) with their own theme chrome — a block look should not touch them.
* **Verdict: READY.**

## 2. Photos of you — `f:photos_of_you` (part `myphotos`)

* **Canvas sample:** `MakerDayPartStandIn` (`part="photos_of_you"`), shapes `DAY_SAMPLE['photos_of_you:grid' | ':lead' | ':polaroids']`, same mount as above.
* **Real, per guest:** `PhotosOfYouGallery` (`app/[slug]/_components/photos-of-you-gallery.tsx`; Lead/Polaroids layouts in `photos-of-you-styles.tsx`), mounted in `site-body.tsx` inside `group('gallery', <>{isLive || isPost ? <PhotosOfYouGallery …/> : null} … <YourShotsGallery …/> …</>)`. Route `app/[slug]/page.tsx`, Gallery tab (`GuestHubBar` Gallery). Condition: a guest session AND the live window or after (`isLive`/`isPost`: roughly T−12h to T+36h, then post); it renders even with zero photos (2026-08-05 rule in the comment above the mount) — not "only once something exists".
* **One root?** Yes: `<section aria-label="Photos of you" className="sn-gal p-5 sm:p-6">` (the main return of `PhotosOfYouGallery`); the sibling `YourShotsGallery` is a separate component after it, so the mark goes between them cleanly. Caveat: `sn-gal` is a dark "obsidian" gallery chrome (`--sn-ob-*` variables) — a Background look will fight it.
* **Reads the column?** Yes (same page, `site-body.tsx`).
* **All surfaces?** There is a second "Photos of you": `GuestGallery` on `app/papic/me/[token]/page.tsx` (`<section aria-label="Photos of you" className="mt-6">`, the Papic QR bridge) — a different page with a different chrome that does not read `style_preferences`. A look would cover the hub gallery only; the Papic page keeps its own style. `GuestHubBar`'s Gallery button is a link only.
* **Verdict: READY** (for the hub gallery; `/papic/me/[token]` is out of reach without a new read).

## 3. Announcements — `f:announcements` (part `announce`)

* **Canvas sample:** `MakerDayPartStandIn` (`part="announcements"`), shapes `DAY_SAMPLE['announcements:banner' | ':notice' | ':line']`.
* **Real:** `DayOfAnnouncement` (`app/[slug]/_components/day-of-announcement.tsx`; styles `AnnouncementNotice` / `AnnouncementLine` in `announcement-styles.tsx`) mounted in **`app/[slug]/layout.tsx`** (`GuestTreeLayout`), so on EVERY page under `/[slug]/…`, not in `SiteBody`. Condition: the viewer is a guest of THIS event and the coordinator has sent a broadcast for the current stage (`loadDayOfBroadcast`); before the day it sits over the Invitation, on the day over The Day, and the layout wraps the live one in `<div className="sticky top-0 z-50">`.
* **One root?** Yes: `<aside role="status" aria-live="polite" className="mx-auto mt-4 w-full max-w-3xl px-4">` (default "banner" card, no data attribute); `notice` and `line` use `<aside … data-scene-style="notice">` / `"line"` (and `mt-2` for the line). Inside the sticky wrapper the mark and the aside are siblings.
* **Reads the column?** Yes: the layout already computes `fixedSceneStyleOf(event.style_preferences, 'announcements', …)` from `loadEventShell`.
* **All surfaces?** One component draws all three shapes, so one look applies. Caveat the build must carry: the layout sits OUTSIDE `SiteBody`, so `blockMark` and the `<style data-block-looks>` that `site-body.tsx` emits are not there — the layout would emit its own mark and style (it already has the column in hand). The look must also survive the 45-second text refresh (it only swaps text, the root stays).
* **Verdict: READY** (extra wiring in the layout, no new read).

## 4. Live hub — `f:live_hub` (part `livehub`)

* **Canvas sample:** `MakerDayPartStandIn` (`part="live_hub"`), shapes `DAY_SAMPLE['live_hub:player-and-wall' | ':theatre' | ':wall-first']`, eyebrow "Watch live · Live photo wall".
* **Real:** the stream (`WatchLiveBlock`, `watch-live-block.tsx`) and the live wall (`LiveWallBlock`, `live-wall-block.tsx`), drawn in `site-body.tsx` in TWO branches, arranged by `LiveHubArrangement` (`live-hub-styles.tsx`) only when the style is Theatre or Wall first (`liveHubArranged`). Route `app/[slug]/page.tsx`. Also `app/[slug]/hub/page.tsx` (`watchPanel`, `<div className="mx-auto max-w-md">`, a page that does NOT read the column). Conditions: the player when `plan.liveMediaVisible && watchLive` (follows the broadcast links, not the calendar); the wall only when `dayOfPhase === 'live'` and the wall is on and readable; both vanish if absent (an arrangement never draws an empty frame).
* **One root?** Not by default. Theatre / Wall first: one `<section data-scene-style="theatre">` or `"wall-first"` from `LiveHubArrangement`. Default style ("Player and wall"): `liveHubArranged` is false, so the player is `<section className="mt-10">` and the wall is `<section id="live-photo-wall" className="mt-10 scroll-mt-6">` as SEPARATE siblings — and with the guest's tabs on they live in different tab groups (`group('live', playerPart)` and `group('gallery', wallPart)`), i.e. on different pages of the guest's bar.
* **Reads the column?** Yes for the page (`site-body.tsx`); no for `/hub`.
* **One look for all surfaces?** Not sensibly across player and wall when they are on different tabs; it would need to be applied to two elements, or the default style needs a single `LiveHubArrangement` wrapper. Wrapping the default adds one element around two `mt-10` sections — spacing changes for every guest on the default style whenever both show (and the tab split cannot be wrapped at all).
* **Verdict: NEEDS A WRAPPER** (for the default style; Theatre and Wall first are READY). `/hub` stays uncovered.

## 5. Digital pass — `f:pass` (part `pass`)

* **Canvas sample:** `MakerGuestScenes` with `show.pass` in `app/[slug]/_components/maker-guest-scenes.tsx` — `mark('f:pass')` then `<section className="flex flex-col items-center gap-2 text-center" data-maker-guest-scene="pass">` (dashed "QR" tile, "Each guest sees their own pass"). Mounted in `site-body.tsx` as `group(at('f:pass','me'), <MakerGuestScenes show={{pass:true…}} …/>)` in the Stages canvas, or the plain `isMakerCanvas` branch otherwise.
* **Real, per guest:** `GuestTicket` (`app/[slug]/_components/guest-ticket.tsx`), mounted in `app/[slug]/page.tsx` (`meSlotFor`, inside `<div className="mb-8">`), on the guest's **Me** tab. Condition: a guest session, the couple's "QR card" switch on (`widgetShouldRender(widgetByType(widgets,'qr_card'))`) and a pass state (`passCardEligibility`): `pass`, `awaiting`, `cannotCome`, or reply-first; `none` draws nothing. The ticket picture is a server-drawn PNG (`/api/guest/pass-card`), so a look can frame it but not re-draw it.
* **One root?** Yes and it is already named, in all four states: `<section id={PASS_ANCHOR} data-motion="pass" data-guest-ticket={state} aria-label="Your digital ticket" className="scroll-mt-6 text-center">` (reply-first and cannotCome variants carry `data-guest-ticket="reply-first" | "cannotCome"`). Caveat: `data-motion='pass'` already has a CSS rule (`app/globals.css`, `[data-motion='pass']:target` — the glow when the day-of "Show your ticket" lands on the anchor); a block Animate must be checked against it, and `PASS_ANCHOR` is relied on by `GuestHubBar` and the arrival action.
* **Reads the column?** Yes (`loadEventShell`), but the mount is in `page.tsx` while the mark/style helpers are `SiteBody` closures; `meSection` is called from inside `SiteBody`, so the wrapper that places `blockMark('pass')` has to be added there or passed down.
* **All surfaces?** Other "pass" surfaces: the door-pass page `app/[slug]/seat/page.tsx` (does not read the column), the "My QR" button in `GuestHubBar` (only when no ticket), the thank-you page ticket hand-over under `app/[slug]/invite/` — all different pieces. One look on the Me ticket section is the sensible scope.
* **Verdict: READY.**

## 6. What to wear — `f:look` (parts `mywear` and the Welcome `look`)

* **Canvas sample:** `MakerWelcomeLook` (`maker-guest-scenes.tsx`): `<section className="space-y-2" data-maker-guest-scene="look" data-part-look=…>`; mounted by `GuestWelcome` (`app/[slug]/_components/guest-welcome.tsx`) in a `WelcomeSlot` with `mark('f:look')`, Maker branch only (`maker`).
* **Real, per guest:** the dress code's own "you" panel, `DressCodeWidget` (`app/[slug]/_components/dress-code-widget.tsx`), in TWO places: (a) Welcome — `GuestWelcome`, `part === 'look'`, `<DressCodeWidget part="you" hideWhenEmpty …/>`, optionally wrapped by `PartLook` (`<div data-part-look=… className="empty:hidden">`, no wrapper at all for the shipped style), inside `WelcomeSlot` (`<div data-welcome-part="">`); (b) Me — `GuestMeParts` (`guest-me-parts.tsx`), `MePart p="wear"` → `<section className="space-y-3" data-me-part="wear">`, also optionally wrapped by `<div data-part-look=…>`. `WELCOME_PART_CANVAS` and `welcomeOnMe` in `site-body.tsx` decide Welcome vs Me by the guest's bar. Route `app/[slug]/page.tsx`. Condition: a guest who has a dress fact (role/colours/figure) — `hideWhenEmpty` returns null otherwise; (b) only for the guest-reply modes `guestMePartsShown` (`lib/guest-me-parts.ts`) allows. The event-wide Dress code SCENE (`w:dress_code`) is a separate block with its own look.
* **One root?** (b) Me: yes and it has a name (`data-me-part="wear"`) — but a mark placed before it would, when `wear` renders null, point at the NEXT part's section inside `div[data-me-parts]`, so Me must be addressed by attribute, not by mark. (a) Welcome: the widget's root is a bare `<section className="space-y-5">` shared with the other `part` values (no identifying attribute); only the `WelcomeSlot` div wrapper exists, and its `data-welcome-part` attribute has an empty value. A name (`data-welcome-part="look"`, or on the section) is the missing piece.
* **Reads the column?** Yes.
* **All surfaces?** The two draw the same fact and a guest sees at most one in practice per the bar (`welcomeOnMe`), but the Me part and the Welcome part are different panels (one fact vs the whole "you" panel) driven by different parts with the same canvas key `f:look`; a single block look is sensible across both. I could not confirm a guest never sees both (see below).
* **Verdict: NEEDS A NAME ON THE ROOT** (give the Welcome slot/section a value like `look`, and address Me by `[data-me-part="wear"]`).

## Suggested build order — and the first one

1. **Your seat** — FIRST. One `seatBlock` const, one `<section>` root in all three styles, in `site-body.tsx` where the mark helper, the column read and the `<style>` already live; no layout, route, or spacing change; only needs the block added to `BLOCK_LOOK_BLOCKS` + `blockMark('find_your_seat')` before `seatBlock` (and before the canvas stand-in) + a `BLOCK_SAMPLE_WHY` entry removed. Also lights up Background/Animate for the Maker's `seats` part.
2. **Photos of you** — same file, one mount, one root; only the dark `sn-gal` chrome to check.
3. **Digital pass** — clean named root, but the mark has to be threaded through `meSlotFor`/`meSection` from `page.tsx`, and `data-motion='pass'` plus the PNG limit what Background/Animate mean.
4. **Announcements** — clean root, but built in `app/[slug]/layout.tsx` (its own mark and `<style>`), on every guest page, and the sticky wrapper needs a look.
5. **What to wear** — needs the root name first, and two slots plus the null-part trap in Me.
6. **Live hub** — last; needs the default-style wrapper (spacing change) or a decision to look only at Theatre / Wall first.

## NOT VERIFIED (MAP 2)

* Whether a guest can see both the Welcome "What to wear" panel and the Me `wear` part at once — I read `welcomeOnMe` and `guestMePartsShown` but did not trace the guest-mode matrix.
* `guestsMaySeeSeatsFor` is described as "only on the day" in the comments above the seat mount; I did not read the function.
* The Live hub's second `site-body.tsx` branch (the "live page" near the `directionsOnTop` code) and the tab-off case — I read both draws but not every `tabs.on` combination.
* `app/[slug]/hub/page.tsx` does its own events select; I confirmed it contains no `style_preferences` string but did not read the select in full.
* Whether the existing pass `:target` animation and a Block Animate conflict; I only read the CSS selector.
* That the Maker's canvas stand-in for `pass` and `look` sits immediately after `makerMark(...)` in every Stages arrangement (the `blockSelector` handles the `data-maker-section` marker, but I did not test arrangements).
* No test or screenshot was run for any of the six; this is code reading only.

---
## ADDENDUM — measured by the controller with ONE real build of origin/main `64746f064` (2026-10-10 04:19 UTC)
Command: `scratchpad/treeshake-check.sh` (real `next build` in wt-train-b, then `node scripts/check-maker-js-budget.mjs`, then grep of `.next/static/chunks`).
- Maker first load on live code: **within budget, 0.1 KB of headroom** (65 chunks; budget 507.0 KB).
- `draft_error=` (inside `hubDraftBounceHref`, imported only by server actions and tests) is in **NO client chunk**. ⇒ the build DOES drop exports nobody on the client uses. **MAP 1's "speculative, up to ~40 KB" list is NOT real — strike it.** Only the moves of code that a LAZY client module uses out of a first-load module can give bytes back (the ~12 KB list, ±40 %).
- `myarrive` (a key that exists only in `lib/maker-parts.ts`'s `MAKER_STAGE_PAGES`) is found only in two LAZY chunks. ⇒ **`lib/maker-parts.ts` is NOT on the Maker's first load** in the production build. The "+227 B from the Post Event entries used up the headroom" theory in the controller notes was wrong; what moved the total by ~0.1 KB between builds is not identified.
- So before any new Maker work: do the top moves of MAP 1 first, and MEASURE with this script after each (a source-size estimate is not a measurement).
