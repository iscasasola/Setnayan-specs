# Event Hub Maker — the one build plan (Fable, 2026-09-25)

> Written against `origin/main` @ `288d76665` (read from a detached worktree, never from `~`), the corpus
> (`FINAL_PLAN_INPUTS_2026-09-25.md` items 1–24, every `DECISION_LOG.md` row dated 2026-09-24/25,
> `DESIGN_BRIEF_2026-09-24.md`, `assets/theme-backgrounds-2026-09-24/THEMES-2026-09-24.md`) and the
> eight prototypes named in § 2. Where a decision row and a handoff disagree, the row wins; where this plan
> and the code disagree, **re-measure the code** — every anchor below is a greppable symbol, not a line number.
> Builders: RULE 0 applies to each phase. Open the shipped file named in "builds on" before writing anything.

---

## 1. Summary

The Event Hub Maker is the full-screen, Keynote-like editor for a couple's one public link, replacing four
editors (`/website/editor`, `/studio/save-the-date`, `/story`, `/monogram`) with one shell whose bar reads
**Logo · Hero · Reveal · Love Story │ Save the Date · Invitation · On the Day · Post Event │ Prints & Tickets**.
Almost everything it needs already ships: the section rows and their live-writing actions (`invitation_widgets`,
`website/widgets/actions.ts`), the canvas contract (`lib/hub-canvas.ts`), the motion presets, the guest render
(`site-body.tsx` → `HubCanvasFrame`), the monogram studio (`monogram/studio.tsx`), the five reveal openings,
the editorial workroom with its `draft_json`, the tour system, the Pro entitlement and the catalogue price read.
What is genuinely new is small and named: a **draft layer** (one table), **one theme registry of ten** with the
CHECK widened, **scene templates + Auto/hold transitions** on the existing canvas JSON, **Love Story moments as
scenes** inside `events.love_story`, the **auto-written Post Event** compiled into `event_editorial.draft_json`,
the **open-up scene** mechanic, **themed printables** with a sample/print-ready split, and the chrome around it
(full-screen shell, navigator, inspector, tours). Two rules ride every phase: text colour adapts to its background
for every couple (never Pro), and each screen passes the four viewport states including foldables. Eleven phases
plus a slot for the foldables audit, each one builder and one PR, sequenced so their files do not collide; two new server-action exports in total, one new page at most, two or three migrations. Free
stays complete (Classic, their words, colour backgrounds, hide/reorder, five word-only Love Stories, the auto Post
Event); everything that changes look, motion or media is the one `COUPLE_WEBSITE_PRO` unlock, tried in the draft
and paid at Apply, priced only by `platform_retail_catalog_v2`, invisible in the store shell.

---

## 2. What exists vs. what is new

Paths are under `apps/web/` unless they start with `supabase/`. "Exists" was read on `origin/main`; "held" is on a
branch; "new" has no file yet.

| Concern | Exists (extend this) | Held (fold in) | New |
|---|---|---|---|
| Editor shell | `app/dashboard/[eventId]/website/editor/page.tsx` (rail groups Site · Sections · Chapters, `lockedIf`, `formatV2Sku('COUPLE_WEBSITE_PRO')`), `_components/editor-shell.tsx` (iframe of `/[slug]?phase=&editor=1`, `postMessage` bridge `app/[slug]/_components/editor-bridge.tsx`, `PREVIEW_TABS`), `sections-panel.tsx` (Show/Hide/Auto, up/down, motion "How it moves", backgrounds, custom sections), `media-panels.tsx`, `pro-panels.tsx`, `authoring-panels.tsx`, `text-panel.tsx`, `unlock-label.ts` | — | full-screen chrome (toolbar with three groups, resizable navigator with thumbnails + transition markers + eye + drag, contextual inspector, Exit) |
| Controller | `app/dashboard/[eventId]/launch/page.tsx` ("Event Hub Controller"), `_components/hub-stage.tsx` (`SiteStage` with When = `PUBLIC_STAGE_LABELS` · View as), `hub-pro-offer.tsx` (`priceLabel` from the catalogue, null when unreadable) | `rd/the-stage-asks-who-and-when` — **merged** (#5949) | rename to Event Hub Maker; the stage becomes the editing canvas |
| Stage vocabulary | `lib/public-site-stage-labels.ts` (`PUBLIC_STAGE_LABELS`, `PUBLIC_STAGE_ORDER` = Save the Date · Invitation · On the Day · Post Event) | — | retire the editor's `PREVIEW_TABS` wording in favour of this one list |
| Section rows / scenes | `invitation_widgets` (UNIQUE `event_id, widget_type`; `mode` auto/shown/hidden; `display_order`; `config_json.canvas` + `.custom`), `lib/invitation-widgets.ts` (`WIDGET_TYPES`), `lib/custom-sections.ts` (`custom_1..6`, CHECK in `supabase/migrations/20271242789193_*`), `lib/site-body-plan.ts` (`resolveSiteBodyPlan`), `app/[slug]/_components/hideable-widget-render.tsx`, `hub-canvas-frame.tsx`, `custom-section-widget.tsx` | `rd/hub-custom-sections` — **merged** (#5948) | `template` (1–25) + `slots` + snap-off fractions + per-stage order/visibility keys **inside `config_json.canvas`** (no table) |
| Canvas + motion | `lib/hub-canvas.ts` (`HubSectionCanvas`, `HUB_MOTION_PRESETS` still/calm/editorial/cinematic, `HUB_IN/OUT/DURING/TIMELINE`, `HUB_BACKGROUND_KINDS` photo/snippet/color, `sanitizeHubCanvas`, `hubCanvasVars`), `app/globals.css` "EVENT HUB CANVAS" block (`animation-timeline: view()` under `@supports`), tokens `--sn-ease`, `--sn-ease-out`, `--sn-dur-*` | **#5951 `rd/hub-hold-or-move`**: `lib/hub-scenes.ts` (`groupSceneRuns`), `app/[slug]/_components/hub-scenes.tsx`, transition `scroll|scrub|auto` + speed in `config_json.canvas`; Auto still renders as Scroll | Auto hand-off on a clock; consecutive-hold cross-fade per `prototypes/scenes_hold_crossfade_hybrid_2026-09-24.html`; snap grid toggle |
| Pro entitlement | `lib/couple-website-pro.ts` (`eventCoupleWebsiteProActive`), `lib/entitlements.ts` (`SKU_OWNERSHIP_ALIASES`: `EDITORIAL_PRO`, `STD_PREMIUM_OPENINGS` ← `COUPLE_WEBSITE_PRO`; `FREE_FOR_ALL_SKUS` incl. `EDITORIAL_PRO`, `CUSTOM_QR_GUEST`), `lib/event-hub-pro.ts` (`resolveHubProOffer`, cta `/studio/website-pro`), `lib/website-pro-items.ts` (`WEBSITE_PRO_ITEMS`), price read `lib/v2/sku-catalog-v2.ts` `formatV2Sku` → `platform_retail_catalog_v2` | `rd/hub-look-is-pro` (`lib/hub-look-pro.ts`, `lib/hub-look-gate.ts`: `lookProAllows`/`requireLookPro`; `HUB_FREE_LOOK_EVENT_COLUMNS = ['site_bg_color']`), `rd/hub-pro-animates-the-logo` (`ANIMATED_MONOGRAM` ← `COUPLE_WEBSITE_PRO`) | try-in-draft / pay-at-Apply (the Apply action refuses Pro keys without the unlock). ⚠ **Price + onboarding are another builder's** (`rd/onboarding-sells-event-hub-pro`) — not planned here |
| Store shell | `lib/store-shell.ts` (`STORE_SHELL_HIDDEN_ADDON_KEYS` incl. `website-pro`, `animated-monogram`; `STORE_SHELL_WEB_ONLY_STUDIO_SEGMENTS`; `isStoreShellWebOnlyPath`), `lib/request-platform.ts` `isStoreShellRequest()`, `middleware.ts` → `/web-only`, `inline-checkout-drawer.tsx` (price-less chip on native) | — (#5954 re-audit in flight) | nothing new — every Maker surface uses the same two calls |
| Draft | none for the hub — every `website/*/actions.ts` write is live; `event_editorial.draft_json` is the only draft, and it IS the published document (status flips) | — | table `event_site_drafts` (one migration) + one intent action + a host-only loader overlay |
| Themes | `lib/invite-themes.ts` (`INVITE_THEMES`: house/capiz/velvet/galeriya/abaca ready; minimalist/fairytale/vintage/custom not; entry = id·name·tier·feels·opening·ready — **no palette, fonts or motion fields**), colours in `globals.css` `[data-hub-theme]`, fonts in `app/[slug]/_components/skins/site-skin.tsx`, resolver `app/[slug]/_lib/hub-look.ts` (`resolveHubLook`, `HUB_LOOK_COLUMNS`), storage `events.invite_theme` (CHECK of 5 ids in `supabase/migrations/20271219583821_the_invite_link_wears_a_theme.sql`), writer `guests/invite/actions.ts` `setInviteTheme`, `lib/hub-fonts.ts` (9 faces, next/font), `lib/std-themes.ts` (5 font-only film "themes"), `lib/story-theme.ts` (board/own/neutral) | `rd/every-guest-page-wears-the-theme` — **another builder**, not planned here | the **ten** (Classic·Rustic·Modern·Cinderella·Luxe·Vintage·Whimsical·Regency·Great Gatsby·Cyber Neon) as the single registry with palette/fonts/ornament/reveal/motion/transition/media fields; `std_theme` and `storyTheme` retire as choices; CHECK widened |
| Reveals | `lib/reveal-config-pure.ts` (`RevealTemplateId` ×5), `app/[slug]/_components/reveal/*` (`reveal-overlay.tsx`, `rigid-stage.tsx`, `rigid-webgl.tsx`, `wax-seal.tsx`, `veil-reveal.tsx`), `events.std_reveal_template` / `std_reveal_effects`, `chooseRevealTemplate` in `studio/save-the-date/actions.ts`, `reveal-preview-card.tsx` (fails silent) | `rd/every-reveal-is-pro` (`lib/reveal-access.ts` `revealAllowedFor`, `reveal-mount.tsx`; code-only — **no migration, no data change**: the admin veil default simply stops being an input) | themed material slots `lib/reveal-materials.ts`; the improved opening (self-paced, seal break, continuous hand-off); five signature reveals |
| Logo | `app/dashboard/[eventId]/monogram/` (`VectorStudio` in `studio.tsx`, `studio-actions.ts`, `commit-actions.ts`, `upload-actions.ts`), `lib/monogram-studio-shared.ts` (`STUDIO_FONTS` ×8, `StudioConfig`, `ANIM_KINDS`), `lib/monogram-motion.ts`, `lib/animated-monogram.ts` | `rd/hub-pro-animates-the-logo` | mount inside the Maker; one font list for logo + scenes |
| Hero | `events.landing_page_hero_image_url` / `landing_page_hero_video_r2_key` (`hero-photo/actions.ts`, `living-hero/actions.ts` `saveLivingHero`, `site-chrome/actions.ts`), `app/[slug]/_lib/invitation-card.ts` (the written default), `hero-background-media.tsx`, `lib/guest-hero-video.ts` (`GUEST_HERO_VIDEO_PLAYBACK = false`), poster art `lib/event-card-art.ts` / `lib/celebration-poster.ts`; duplicates: `events.std_background`, `std_media`, `std_film_*` | — | one hero everything derives from; fold the `std_*` copies (migration to drop `std_film_*` after backfill) |
| Love Story | `website/our-story/` (`updateOurStory` → `events.love_story` JSONB: `how_we_met`, `spark`, `proposal`, `milestones[]` ≤100, `anchors`, `together_since`), guest `our-story.tsx`, widget `our_love_story`; no moments table | — | `love_story.moments[]` (photo/clip refs · date granularity · line · place · added_by · anchor tag · `canvas`) rendered as scenes; the scrapbook UI |
| Post Event | `app/dashboard/[eventId]/story/` (`saveEditorial`, `saveArrangement`, `setStoryCover`, `decideDeskItem`, `announceNext`…), `event_editorial` (`draft_json.sections/sectionOrder/chapterOverrides/customColumns/reviews`, `status` = audience, `publish_consent_at` trigger, edition stamp), guest `app/[slug]/_components/editorial/*` (`editorial-order.ts`, `voices.ts`, `custom-columns.ts` limits), `story/were-you-there.tsx`, `find-in-this-day.tsx`, `recap/page.tsx` (PanoodReplay), `lib/story-index.ts`; Discover = `lib/showcase-db.ts` `loadPublishedShowcases` (consent + public visibility only) | — | auto-compiled 25 scenes into `draft_json.scenes`; open-up mechanic; per-reader gallery tabs |
| Printables | `invitation/print/page.tsx`, `seating/print/route.ts`, `lib/seating-pdf.ts` (pdf-lib), `event-qr/page.tsx`, `app/[slug]/print/*` (A3 keepsake), guest pass in `site-body.tsx` via `lib/guest-pass.ts`, QR routes `api/website/qr/guest/[guestId]/route.ts`, `lib/qr-monogram-raster.ts`, `lib/lockup-pdf.ts`; **none reads `invite_theme`**; no `parents`, `opening_line`, `ceremony_time` fields (ceremony time = the ceremony block in `event_schedule_blocks`) | — | the Prints & Tickets group; sample vs print-ready; `events.print_details` (one JSONB column) |
| Uploads | `app/api/upload/route.ts` (presign, `presignAndPut`), `lib/image-compress.ts` (2000 px q0.82), `lib/video-compress.ts` (quality-first CRF 21 / 4K — too heavy), `app/_components/file-upload.tsx` (`validateFile`, checks ORIGINAL size), `lib/boomerang-encoder.ts` | — | compress-then-check, 15 s refusal, 1080p theme-loop preset, silent backgrounds, 100 MB meter |
| Tours | `lib/tours.ts` (`TOURS`, `TourKey`, `TourSlide` — title plain text, body HTML), `app/_components/mini-tour.tsx` (`users.tour_seen_keys`), `guided-tour.tsx`, `lib/tour-actions.ts` `completeTour` | — | `customer_event_hub_maker_v1`, `customer_love_story_v1`; ⓘ reopen |
| Menu | `lib/customer-menu.ts` `buildEventMenuSections` (row `launch` "Event Hub Controller"; studio rows `palogo` Logo Maker, `editorial` → `/story`), `customer-nav-config.ts`, guards `lib/the-event-menu-is-one-tree.test.ts`, `one-event-hub-door.test.ts`, `the-hub-and-its-controller-are-two-words.test.ts` | — | one row "Event Hub Maker" holding Logo Maker · Editorial · Love Story |
| House style | `app/_components/info-tip.tsx` (InfoTip shipped), `lint:no-card`, `lint:radius`, `lint:contrast`, `build-sessions/DESIGN-LANGUAGE-AMENDMENT.md` | — | Readout · Section · SidePanel pieces only if a phase needs them (owner approved 09-24) |

**Prototypes this plan builds against** (structure, not pixels): `prototypes/event_hub_editor_FINAL_2026-09-24.html` ·
`event_hub_controller_dedup_2026-09-24.html` · `scenes_hold_crossfade_hybrid_2026-09-24.html` ·
`scenes_three_modes_std_2026-09-24.html` · `reveals_improved_2026-09-24.html` · `our_love_story_scrapbook_2026-09-25.html`
(+ `prototypes/theme-posters/`) · `post_event_auto_story_2026-09-25.html` · `collection_template_posters_add_flow_v4_2026-09-24.html`.

**Budget baseline (measured):** 431 `page.tsx`, 151 `route.ts`, 1,231 exported server actions in 335 `'use server'`
files. `next.config.ts` documents the Vercel cap: **2,048 routes, counted as ~4 entries per app PAGE** (page ·
`.rsc` · two `.segment.rsc`); `experimental.clientSegmentCache: false` bought back roughly a thousand. Server
actions post to their page's route and do not add entries. So the number to budget is **new pages and route
handlers**, and this plan adds at most **+1 page, +1 route handler**, retiring two pages later. The server-action
delta is still stated per phase as asked; the total is **+2**.

---

## 3. Phases, in build order

Conventions for every phase: one builder · one PR · worktree off `origin/main` with `node_modules` · changelog
fragment in `changelog.d/` · unit tests run from `apps/web` · all 26 repo guards (`run-every-ci-guard-from-apps-web`)
· `pnpm lint:no-card`, `lint:radius`, `lint:contrast` on any new UI · "Event Hub", never "website", in copy ·
prices only via `formatV2Sku` · every paid surface behind `!(await isStoreShellRequest())` · migrations via
`pnpm migration:new`, RLS at `CREATE TABLE`, applied only by the pipeline, plus the Ugat map
(`lib/ugat/graph.ts` or `tests/db/ugat-concept.baseline.txt`).

Two acceptance rules apply to **every** Maker phase (owner, 2026-09-25):

- **Readable for everyone, never Pro.** Every scene's text colour, and the text over the Main background, adapts
  to that background automatically — free couples change background colours, so legibility cannot be a paid
  feature. Reuse what ships: `readableTextOn(bgHex)` in `lib/site-palette.ts` for solid colours;
  `resolveStdLegibility(bg)` in `lib/std-backgrounds.ts` (light/dark tone + veil, the Save the Date uses it
  today) for the theme grounds; for photo and video backgrounds sample the frame under the text box
  (`lib/extract-palette.ts` + `lib/color-space.ts`) to pick a light or dark tone and strengthen the scrim when
  contrast would fall under WCAG AA. Theme accents (foil, gold headings) stay on-brand only when they pass;
  otherwise they fall back to the readable tone. Built once in Phase 3 (`lib/hub-legibility.ts`, pure), applied to
  scene backgrounds in Phase 5; guarded by a test that iterates every theme × a light and a dark background and
  asserts AA for body text.
- **Foldables and dual screens.** Each screen passes the brief's four viewport states **including foldable
  portrait (~690×840) and unfolded near-square (~720×960 / 960×720)**; a live fold/unfold loses no editor state and
  the navigator reflows; dual-screen spanning never splits the canvas across the hinge (use the viewport segments
  API where present, else a single-pane layout). A separate builder audits the rest of the app on
  `rd/foldables-ready` and will report editor-area findings — Slot F below holds them.

Before starting, run the in-flight check
(`gh pr list --state open`, `git worktree list`, `git log origin/main -15`) — three builders are live today
(`rd/onboarding-sells-event-hub-pro`, `rd/every-guest-page-wears-the-theme`, #5953/#5954).

### Phase 0 — Fold the held branches (four small PRs, no new code)

- **Goal:** land what is already built so every later phase starts from it.
- **Order and mechanics (from the diff audit):** ① `rd/hub-pro-animates-the-logo` — clean, merge as is
  (`ANIMATED_MONOGRAM: ['COUPLE_WEBSITE_PRO']` in `SKU_OWNERSHIP_ALIASES`; Monogram Maker shows "Included with
  Event Hub Pro"). ② `rd/every-reveal-is-pro` — clean, merge as is (`revealAllowedFor` returns `NO_REVEAL` without
  Pro regardless of the admin default; `chooseRevealTemplate` and `saveAllStdContent` refuse paid openings). ⚠
  Input 10 says it "turns off the admin-default veil for 9 free events": true at render time, **code-only** — no
  migration, no UPDATE; the `reveal_studio_config` row is untouched. ③ **#5951 `rd/hub-hold-or-move`** — one
  conflict, `lib/the-canvas-fails-visible.test.ts`: main added a loop over `HUB_BACKGROUND_KINDS`, the branch added
  `for (const c of HUB_SCENE_CLASSES) emitted.add(c)`; keep both. ④ `rd/hub-look-is-pro` — last, and a real rebase:
  `sections-panel.tsx` / `editor/page.tsx` (main's `videoChoice`/`colorChoices` props vs the branch's `lookLock`) and
  `widgets/actions.ts` (the branch hard-codes `kind: 'photo'`; main now has `kind === 'color'` — pass the real kind
  into `sectionBackgroundChange` so colour stays free). Re-check `saveAllStdContent`, gated by both ② and ④.
- **Files owned:** exactly the branches' files. **Migrations:** none. **Server-action delta:** 0 (all four are +0).
- **Gating:** this phase *is* the gating — look controls Pro, `site_bg_color` free, every reveal Pro, logo animation in Pro.
- **Store shell:** unchanged; the Monogram Maker already checks `storeShell` before building checkout props.
- **Tests:** each branch's own; after ④, `lib/hub-look-pro.test.ts` plus a new case: a `color` scene background is `none|remove|add|change` → never Pro.
- **Browser check:** open a free test event's public link → no reveal plays; open `/dashboard/<id>/website/editor` → a section background *colour* saves for a free couple, a *photo* shows the Pro mark; `/dashboard/<id>/monogram` shows "Included with Event Hub Pro" and no ₱ figure.

### Phase 1 — The Maker shell (the owner sees it)

- **Goal:** the full-screen editor exists at one address, wearing the final bar, with today's panels mounted
  inside it. Nothing new is written to the database. Owner-visible in days.
- **Builds on:** `editor-shell.tsx` (iframe preview + `editor-bridge` postMessage), `sections-panel.tsx`
  (Show/Hide/Auto = the eye; `moveWidgetUp/Down` = the drag), every panel in `media-panels.tsx` /
  `pro-panels.tsx` / `authoring-panels.tsx`, `SiteStage` (When · View as), `hub-pro-offer.tsx`,
  `PUBLIC_STAGE_LABELS`, `lib/tours.ts` + `MiniTour`, `info-tip.tsx`.
- **Shape (from `event_hub_editor_FINAL`):** four regions — toolbar (✕ Exit · ▤ navigator toggle · ▶ Play · ＋ ·
  the bar **Logo · Hero · Reveal · Love Story │ Save the Date · Invitation · On the Day · Post Event │ Prints &
  Tickets** with red dot = live today · Snap ⊞ · Desktop/Phone/Both · ⋯ = address, who can view, guests get, open
  browsing, View as) · a resizable, collapsible navigator (numbered thumbnails scaled to width, drag its edge, drag a
  scene to reorder, long-press menu Move/Duplicate/Hide/Delete, **eye at lower-right** = `mode` shown/hidden with
  Auto half-lit, transition marker between scenes, ＋ at the end, "Main" pinned on top) · the canvas (this phase:
  the existing interactive iframe, one live preview at a time) · one inspector (Format · Animate · Transition ·
  Content) shown only on selection, mounting today's panel for the selected row. Phone: canvas on top, navigator
  strip, inspector as a sheet. No app nav, rail or bottom bar. Motion on the shared `--sn-*` tokens. Bar items that
  have no phase yet (Hero · Love Story · Prints & Tickets) render but open a one-line "coming in the next build"
  InfoTip — never a dead button. Logo opens `VectorStudio` in a sheet already (Phase 5 makes it the canvas).
- **Route (builder measures, then picks):** the ruling (09-25) is "label change only; menu key `launch` and routes
  unchanged". Preferred: keep `/dashboard/[eventId]/launch` and let the event layout go chromeless for it (check
  whether `app/dashboard/[eventId]/layout.tsx` can skip `AppRailShell` by segment; the live screen at
  `app/live/screen/page.tsx` sits outside the tree, which is why it is chromeless). If the layout cannot, add
  `app/maker/[eventId]/page.tsx` (**+1 page**) and make `/launch` a `redirect()` into it — the menu key and the
  known URL still hold. Do not create both.
- **Menu:** `lib/customer-menu.ts` row `launch` → label **"Event Hub Maker"**; studio row `palogo` (Logo Maker) and
  spine row `editorial` leave the tree — their doors live in the Maker bar. Love Story has no row (Phase 6 adds the
  bar item). Update the pinned guards: `the-event-menu-is-one-tree.test.ts`, `one-event-hub-door.test.ts`,
  `the-hub-and-its-controller-are-two-words.test.ts`, `studio-rows-are-lit.test.ts`, `studio-follows-you-in.test.ts`.
  `/website/editor`, `/website/editorial`, `/monogram` keep working and redirect into the Maker with the matching
  bar item (`?stage=` / `?tool=logo`) — retire their pages in Phase 8 once nothing links there
  (`lint-port-no-lost-controls` will name every lost door).
- **Tour:** `customer_event_hub_maker_v1` in `TOURS` (slides: what the Maker does · pick a theme and the whole hub is
  dressed · tap anything to edit · one place for the four stages · what Pro adds — the price slide reads
  `formatV2Sku` and is **omitted** in the store shell · last step **Start** → lands on the theme panel). `<MiniTour
  tourKey="customer_event_hub_maker_v1" />` on the Maker page; first visit only; ⓘ in the toolbar re-renders
  `GuidedTour` without writing `tour_seen_keys` again. Slides styled to the brief (no bordered card, glass +
  shadow, `--sn-*` motion) — the *system* is reused, the skin is this phase's; Phase 10 brings the older tours up.
- **Copy sweep:** the ~10 rendered "website" strings (`editor/page.tsx` title + "Website address",
  `editor-shell.tsx` heading + alt, `dress-code/page.tsx` ×3, `stories/page.tsx`, `media-panels.tsx` "Play music on
  my website") → "Event Hub"; add `lib/the-hub-never-says-website.test.ts` on the pattern of
  `vendor-dashboard/_components/the-room-is-called-the-event-hub.test.ts` (strip comments, scan rendered strings
  under `website/`, `launch/`, the Maker, `customer-menu.ts`).
- **Files owned:** the Maker page + `_components/maker-*.tsx` (new), `editor-shell.tsx` (becomes the shell's
  legacy path or is deleted), `lib/customer-menu.ts`, `customer-nav-config.ts`, `lib/tours.ts`, the five menu
  guards, the copy files above, `changelog.d/`. **Does not touch:** `widgets/actions.ts`, `hub-canvas.ts`,
  `[slug]/layout.tsx` (other builder), `launch/page.tsx` only if the redirect route is chosen.
- **Migrations:** none. **Server-action delta:** 0. **Pages:** 0 or +1.
- **Gating:** unchanged — the panels carry their own locks (`ProLockPanel`, `lookLock`). Pro marks are the one quiet glyph.
- **Store shell:** `isStoreShellRequest()` once at the top of the page → `HubProOffer` and every price string
  absent; Pro-only controls **hidden, not locked** (owner 09-25: web-bought Pro is not usable in the app yet);
  the free editing works; the tour drops its price slide.
- **Tests:** `lib/customer-menu.test.ts` (one row, three doors inside), tour titles guard
  (`lib/tour-titles-are-text.test.ts`), the copy guard, a render test that the bar has exactly the nine items in
  order with the two dividers, `lint:no-card`/`lint:radius` green on the new chrome, `pnpm lint` (not `next lint --file`).
- **Browser check:** sign in as a couple → sidebar shows one "Event Hub Maker" row → first click shows the tour →
  Start lands on the theme panel → Exit and re-enter: no tour, ⓘ reopens it → resize the navigator, drag scene 3
  above 2 (order changes on the live page after reload), eye-hide a scene (gone from the guest link), tap a scene →
  inspector opens the right panel → phone width: sheet inspector, no bottom nav. Then open the same page with the
  Capacitor cookie (`setnayan-client-type=capacitor`) → no ₱, no Pro CTA, no locked chips.

### Phase 2 — Draft · Apply · Restore · Reset (the one migration this programme truly needs)

- **Goal:** edits are a draft guests never see until Apply; Restore returns to what guests see; Reset returns a stage
  to the page we wrote; a free couple can try a Pro change in the draft and pays at Apply.
- **Builds on:** every `website/*/actions.ts` and `widgets/actions.ts` writer (Apply replays through them, so their
  gates hold), `app/[slug]/_lib/loaders.ts` (`loadWidgets`, the `?editor=1` host-only path), `invitationCard()` /
  `resolveHubLook` / default widget order (what Reset writes), `HubProOffer` + `/studio/website-pro` (what Apply
  opens when the draft holds Pro keys), `saveCustomSection`'s intent pattern.
- **Migration (`pnpm migration:new`):** `event_site_drafts` — `event_id` PK/FK `events`, `draft_json jsonb not null
  default '{}'`, `applied_snapshot jsonb`, `updated_at`, `updated_by`; RLS at CREATE TABLE on the shipped
  `current_event_ids()` pattern (hosts read/write their own); admin via `is_admin()`. Ugat: add the node.
- **Action:** ONE export, `hubDraftAction(eventId, formData)` with `intent = save | apply | restore | reset`
  (**+1**). `save` merges changed keys; `apply` replays keys through the existing per-field actions in a fixed order,
  **refuses every Pro-classified key** (`lookProAllows`) unless `eventCoupleWebsiteProActive`, applies the rest,
  reports what it refused, then clears the row; `restore` deletes the row; `reset` writes the prefilled composition
  for the chosen stage into the draft (undoable until Apply; never touches guests, replies, schedule, galleries,
  orders, `event_editorial`, address or visibility — the confirm says so). Address / who can view / guests get / open
  browsing stay live, outside the draft. Post Event's `draft_json` remains its own draft; Apply on that stage = its
  publish step (Phase 7).
- **Preview:** `loaders.ts` overlays `draft_json` only when the viewer is a host inside the editor frame; guests
  read columns. Draft media uploads go under an `r2://…/drafts/` prefix with a 30-day TTL or until Apply (the one
  real cost of try-then-pay — see decision D6).
- **Apply bar:** hidden until the draft has changes; with Pro keys and no Pro it reads "Apply needs Event Hub Pro ·
  [catalogue price] · one-time · all four stages" and opens `HubProOffer`'s cta; free-only drafts apply normally.
  Autosave on pause with a quiet "Saved" mark and a short undo history inside `draft_json` (both from the
  prototype's recommendations; no migration).
- **Files owned:** the migration, `lib/hub-draft.ts` (pure: merge, classify, replay order), the Maker's
  `actions.ts` (new file, one export), `app/[slug]/_lib/loaders.ts` (overlay only), the Apply bar component,
  `lib/ugat/graph.ts`. **Migrations:** 1. **Server-action delta:** +1. **Pages:** 0.
- **Gating:** Apply is the gate; nothing unpaid reaches a live column even if the action is called by hand.
- **Store shell:** the Apply bar never shows a price or CTA; a draft with Pro keys says "Apply on the web" and stops.
- **Tests:** `*.db.test.ts` — a non-host cannot read another event's draft; hosts can; the Ugat claims pass.
  Unit — replay refuses each `HUB_LOOK_EVENT_COLUMNS` key without Pro and applies `site_bg_color`, words and
  mode/order; Restore leaves live columns byte-identical; Reset never emits a guest-table write (assert on the
  replay plan, not on prose).
- **⚠ As built (2026-09-25, `rd/maker-p2-draft-apply`) — four deviations, see the DECISION_LOG row of that date:**
  RLS on `current_couple_event_ids()` ∪ `current_moderator_event_ids()` (not `current_event_ids()`, which admits
  guests); no `updated_by`; refused Pro keys stay in the draft; only `rsvp_backdrop` among `events` columns is
  draftable until `[slug]/layout.tsx` can overlay a draft. Writers divert on `draft=1` (`<HubDraftField />`); the
  shell mounts `<HubDraftDock eventId stage />`.
- **Browser check:** change a title → guest link unchanged → Apply → changed. Free couple: set a photo background in
  the draft → preview shows it, guest link does not → Apply bar shows the Pro line (web) / stops without a price
  (shell). Restore → preview matches the guest link again. Reset the Invitation stage → confirm text lists what it
  will not touch → draft shows the written page.

### Phase 3 — One theme registry of ten (the whole look, chosen in one place)

- **Goal:** the ten themes of `THEMES-2026-09-24.md` are the only list; every surface reads it; a theme sets palette,
  fonts, ornament, background loop/still, default reveal, motion preset and transition pattern; Classic is free and
  media-free; the picker lives in the Maker only.
- **Builds on:** `lib/invite-themes.ts` (becomes the registry — keep the module and the existing ids where they
  match), `resolveHubLook` / `HUB_LOOK_COLUMNS`, `globals.css` `[data-hub-theme]` blocks and `site-skin.tsx`
  fonts, `lib/hub-fonts.ts` (next/font pattern), the `20271219583821` CHECK, `setInviteTheme`,
  `guests/invite/_components/invite-theme-picker.tsx`, the admin `background-videos` surface for hosting media
  (`app/admin/background-videos/actions.ts`), `hubMediaRef` (`r2://` public-bucket refs).
- **Id mapping (keep matching keys):** `house` → **Classic** · `abaca` → **Rustic** · `galeriya` → **Modern** ·
  `velvet` → **Luxe** · `vintage` → **Vintage** (made ready) · new `cinderella` · `whimsical` · `regency` (public
  name Regency; Bridgerton internal) · `gatsby` · `cyber`. Retire `capiz` (Elegant), `minimalist`, `fairytale`,
  `custom`: **measure `select invite_theme, count(*) from events group by 1` first**, then backfill in the migration
  (proposed: capiz→vintage, minimalist→galeriya, fairytale→cinderella, custom→house — D3). Entry shape grows:
  `palette` (canvas·surface·ink·muted·accent·accentInk·heading), `fonts` (heading·body·labels·script), `ornament`
  key, `media` (`loop` r2 ref · `poster` r2 ref · none for Classic), `reveal` (default `RevealTemplateId` or the
  new signature id), `motion` (`HubMotionPreset`), `transitions` (the per-theme pattern from the spec), `radius`
  token, `scrim`. Values are the spec's measured ones — copy them, do not re-derive.
- **Migration:** widen the `events.invite_theme` CHECK to the ten ids + backfill the retired four (one file).
  `std_theme` stays as a column but stops being offered (its five font choices are superseded by the theme's fonts);
  `event_editorial.draft_json.storyTheme` is ignored in favour of the event theme (Phase 7 removes the step).
- **Media:** the loops (0.3–2.4 MB each, ~14 MB for nine) and posters go to the **public R2 bucket** (egress free;
  media already serves from r2.dev) — not `public/` (Vercel bandwidth is the only bill). Two files in the asset
  folder are duplicates (`ballroom-velvet-chandeliers-*` = `luxe-*`; `modern-b-*` = `modern-*`) — upload one of each.
  `Regency`'s loop is warm parquet, not Wedgwood blue — the palette follows the video (spec note); do not fake it.
- **Fonts:** ship the faces the ten themes name (≈30, all OFL/Apache) through the `layout.tsx` `localFont` pattern
  `hub-fonts-are-loaded.test.ts` guards; the full 112-face library is D8 (bundle weight). Every scene text picker
  offers the same list as the logo (Phase 5 wires `STUDIO_FONTS` in).
- **Foil shimmer:** `.foil` (gold gradient clipped to text, 6 s `glint`, static under reduced motion) on the couple's
  names **by default in Luxe and Great Gatsby**; elsewhere a Pro text effect in Format (owner 09-25) — and only
  when it passes the legibility rule over the actual background, else the readable tone.
- **Legibility for everyone (`lib/hub-legibility.ts`, new, pure):** `toneFor(background)` → `'light'|'dark'` +
  scrim strength, composed from `readableTextOn` (solid colour), `resolveStdLegibility` (theme ground) and a
  frame-luminance sampler for media (the 09-24 spec's own method: 5th-percentile contrast over the text zone).
  `hubCanvasVars` emits the tone as `--hub-ink`/`--hub-scrim`; every theme's palette carries both an ink and a
  light-ink so the swap is a token flip. Free.
- **Picker:** the Maker's Hero/Look inspector is the ONE place; `guests/invite` shows "Theme: X · Change in Event Hub
  Maker ↗"; Love Story (Phase 6) and prints (Phase 8) read only. `WEBSITE_PRO_ITEMS` "Invite link theme" → "9 themes".
- **Files owned:** `lib/invite-themes.ts` (+ test), the migration, `globals.css` theme blocks, `site-skin.tsx`,
  `layout.tsx` fonts, `invite-theme-picker.tsx` (moves into the Maker inspector), `lib/website-pro-items.ts`,
  `lib/every-theme-carries-five-reception-colors.test.ts` if it pins the old set. **Coordinate:**
  `rd/every-guest-page-wears-the-theme` touches `[slug]/layout.tsx` and `resolveHubLook` — land theirs first or
  rebase onto it; do not both edit `hub-look.ts`.
- **Migrations:** 1. **Server-action delta:** 0 (`setInviteTheme` moves, not multiplies). **Pages:** 0.
- **Gating:** Classic free; the nine need Pro via `siteLookChange` (`hub-look-is-pro`); a free couple can *try* any
  theme in the draft (Phase 2) and pays at Apply.
- **Store shell:** the nine render as plain, unpriced, unclickable swatches; no CTA.
- **Tests:** registry has exactly ten ids, each with all fields, contrast ≥ the spec's targets computed from the
  stored palette + scrim (a property, not a phrasing); **every theme × {light, dark} background → body text ≥ 4.5
  and the chosen accent either passes or falls back** (`lib/hub-legibility.test.ts`); the CHECK lists exactly the ten; no file outside the registry
  declares a theme id (grep guard); `hub-fonts-are-loaded` extended to the new faces; snapshot that Classic has no
  `media`.
- **Browser check:** pick Luxe → hero band shows the velvet loop, names shimmer, buttons gold, reveal default
  becomes "Velvet curtains" (locked until Phase 9 lands → shows the dressed four-flap meanwhile), transitions read
  Auto·Scrub·Scroll in the navigator markers; pick Classic → paper, no media, all Scroll; reduced-motion → static
  foil; the guest link on iPhone Safari plays the loop muted inline.

### Phase 4 — Media pipeline: compress first, 15 s, 1080p, 100 MB (small, before scenes need it)

- **Goal:** every couple upload in the Maker obeys the 09-25 media rulings before Phase 5–7 start uploading.
- **Builds on:** `app/_components/file-upload.tsx` (`validateFile` hook = the documented video-duration rule;
  today it checks `file.size` on the ORIGINAL), `lib/video-compress.ts` (CRF 21 / 4K — replace the preset),
  `lib/image-compress.ts` (unchanged), `app/api/upload/route.ts`, `lib/event-media-sweep-core.ts` (verify no
  lifecycle rule deletes before 10 years), `lib/guest-hero-video.ts`.
- **Rules:** duration read on the device first; > 15 s refused with "Please pick a video under 15 seconds", nothing
  uploaded; `maxVideoDurationS` stays on the compress pass as the backstop for unreadable metadata (that hook fails
  open). Encode 1080p H.264 CRF 23, maxrate ~1.9M, faststart; background clips `-an`; content clips keep a small
  audio track (D2); photos unchanged. The 100 MB per-event allowance counts **compressed** bytes: sum the stored
  sizes of the event's own refs at upload time (the upload route already knows the byte length) and show a meter in
  the inspector — if no per-event byte ledger exists, add `events.couple_media_bytes` in this phase's migration
  (measure first: `grep -rn "media_bytes\|storage_bytes" supabase/migrations`). Long videos = a YouTube link field.
- **Reconcile `GUEST_HERO_VIDEO_PLAYBACK = false`:** the constant exists because the hero video is unscreened
  (SEC-6). Route the Maker's clips through the same NSFW screen the Save-the-Date media uses (`lib/nsfw-screen.ts`,
  `std_media_nsfw`) and flip the flag for screened refs only. **Fix the bypass found in the audit:**
  `setWidgetBackground` accepts the hero video as a `snippet` and `HubCanvasFrame` plays it without
  `heroVideoRefForGuests` — gate it the same way.
- **Files owned:** `file-upload.tsx`, `video-compress.ts`, `api/upload/route.ts`, `lib/guest-hero-video.ts`,
  `hub-canvas-frame.tsx` (the gate only), the meter component, optional migration. **Migrations:** 0–1.
  **Server-action delta:** 0 (route handler reused). **Pages:** 0.
- **Gating:** uploads themselves are Pro (09-24 "A"); in the draft a free couple may upload within the TTL prefix.
- **Store shell:** no change (uploads are not purchases; Pro controls already hidden).
- **Tests:** a 16 s fixture is refused before any network call; a fixture with unreadable metadata is capped by the
  backstop; the meter counts the compressed blob, not `file.size`; a background clip has no audio track; the hero
  video does not reach a guest `<video>` unless screened.
- **Browser check:** pick a 20 s phone clip → refused with the sentence, network tab shows no PUT; pick a 10 s clip →
  meter rises by the compressed size (≈3–4 MB), plays silent as a background, with sound-on-tap as content.

### Phase 5 — Scenes: 25 templates, Auto + hold cross-fade, snap grid, playback

- **Goal:** every scene comes from one of the 25 templates (five families, desktop + phone arrangements, default
  preset + transition); "+" opens the picker in the current Desktop/Mobile/Both view headed with the stage; the three
  transitions truly work (Auto hands off on a clock; consecutive holds cross-fade; clean edges; fallback); snap grid
  on by default, off = fractions of the scene box with phone warnings; clips loop / long videos tap-to-play with Full
  screen (default) or In place.
- **Builds on:** #5951 (`lib/hub-scenes.ts`, `hub-scenes.tsx`, transition in `config_json.canvas`),
  `lib/hub-canvas.ts` (extend `HubSectionCanvas` with `template: 1..25`, `slots: {media?|text?}[]`, `free?:
  {x,y,w,h}[]` fractions, `stages?: Record<phase,{order,mode}>`, `video?: {play:'loop'|'tap', open:'fullscreen'|'inplace'}`
  — `sanitizeHubCanvas` drops anything else), `lib/hub-legibility.ts` (Phase 3) applied to every scene background
  — a colour, photo or clip background re-derives the scene's text tone and scrim on save and at render,
  `HUB_MOTION_PRESETS` + `HUB_PRESET_BODY` (the template defaults are
  exactly the prototype's table: ★1 Photo left·Calm·Scroll … 24 Timeline·Editorial·Scrub, 25 Q&A·Editorial·Scroll),
  `custom-section-widget.tsx` (custom scenes render the template), shipped parts the four "built-on" templates
  reuse (special message = 11 Letter, countdown = 12 Big number, monogram = 16, love-story milestones/schedule = 24),
  `prototypes/scenes_hold_crossfade_hybrid_2026-09-24.html` (pinned sections + 170vh spacers, exit 25–85 % / enter
  15–75 %, runs of HOLD wrapped so they unpin together — measured 17–18/80 overlap positions, 0 blank),
  `scenes_three_modes_std_2026-09-24.html` (Auto: two scenes stacked, hand-off `--F` = 1.2 s, speed 1.4×/1×/0.6×,
  pause on touch, never under reduced motion).
- **Scene rows:** the six `custom_N` slots per event are the couple's own scenes (the 09-24 correction: six shown
  in any phase already satisfies "6 per phase"; per-stage visibility/order via `canvas.stages`). Whether the owner
  wants six **per stage** (24 rows, a `stage` column + UNIQUE change) is D1 — do not pre-build it.
- **Acceptance bar (09-24 "seamless and smooth"):** 0 blank frames across sampled scroll positions / auto instants
  (reuse the prototype's `measure3` harness as a Playwright test), opacity/transform only, next scene's media
  preloaded, one motion vocabulary (`--sn-*`), reduced motion = fades. `scripts/lingering-transform.baseline.txt`
  must not grow.
- **Files owned:** `lib/hub-canvas.ts` (+ test), `lib/hub-scenes.ts`, `hub-scenes.tsx`, `hub-canvas-frame.tsx`,
  `globals.css` canvas block, `widgets/actions.ts` (extend `setWidgetMotion` with transition/template/slots/video
  intents — existing exports), the Maker's picker + navigator markers + snap toggle, `lib/scene-templates.ts` (new,
  pure: the 25 definitions). **Migrations:** 0. **Server-action delta:** 0. **Pages:** 0.
- **Gating:** words and template pick free; Scrub/Auto, motion, media in slots, snap-off placement Pro
  (`setWidgetMotion` already refuses Scrub/Auto without Pro; going back to Scroll is never blocked).
- **Store shell:** Pro controls hidden; templates that need media show without a media slot.
- **Tests:** every template has both arrangements and a default `{preset, transition}`; `sanitizeHubCanvas` rejects
  a 26th id and out-of-range fractions; a scene with a near-black colour background renders light ink and one with
  cream renders dark ink for a free event (the tone is not behind any Pro check — assert on the gate, not the copy);
  the shell keeps its state and reflows the navigator across a 690×840 → 960×720 viewport change; `groupSceneRuns` skips hidden scenes (the eye) so the previous scene hands
  over to the next visible one; Auto never engages under reduced motion; the blank-frame harness passes on the
  three fixtures (all-scroll, all-scrub, hybrid).
- **Browser check:** ＋ → picker shows Blank-less 25 in phone view when Mobile is selected → pick 18 Three mosaic →
  slots fill from the gallery → set the marker to Auto · Slow → on the guest link the scene hands over by itself
  and stops when touched → Safari 26 iPhone plays it; Safari without scroll-timeline shows the plain page; a
  15 s clip loops silently; a linked YouTube video shows a still with ▶ and opens full screen.

### Phase 6 — The made-once group: Logo · Hero · Reveal (and the dressed openings)

- **Goal:** the left group of the bar edits the three whole-event things once; every stage and the event-card poster
  derive from the hero; the reveal is chosen here with No reveal free; the four existing openings are dressed in the
  ten themes' materials and open the way the spec always said.
- **Builds on:** Logo — `VectorStudio` (`monogram/studio.tsx`, `mountStudio`), `saveStudioAction` /
  `commitMonogram` / `clearUploadedMarkAction` (reused as is), `STUDIO_FONTS`, `ANIM_KINDS`, `monogram-motion.ts`;
  the canvas swaps to the studio's own rules (letters move; no templates, snap or transitions), toolbar reads "Logo ·
  ‹ Back to scenes". Hero — `landing_page_hero_*` as the single source; the `invitation-card.ts` composition as
  the written default; `event-card-art.ts` / `celebration-poster.ts` read the same resolver so the poster can never
  disagree; Post Event's cover starts from the hero until a post-event photo is chosen (`story-cover.ts`). Reveal —
  the five `RevealTemplateId`s + `NO_REVEAL`, `chooseRevealTemplate`, `std_reveal_effects`, `wax_seal_config`,
  `reveal-preview-card.tsx` (make its failure visible: an `{ok:false}` renders a line, not silence), the improvements
  table in `reveals_improved_2026-09-24.html` (#1 self-paced 2.6 s open after one committed swipe — D7 default; #2
  continuous hand-off: the invitation card rises into the hero, page mounted beneath from frame 0; #3 seal breaks;
  #4 `lib/reveal-materials.ts` keyed by theme id; #5 fold shading so CSS and WebGL match; #7 preload + render-on-demand;
  #8 sentence-case cues + Skip, reduced motion = 400 ms fade; #9 delete `RIGID_FOLD_MS`/`RIGID_REVEAL_MS`, iOS
  `requestPermission` for tilt). Church doors become themed doors, id unchanged (D7). The veil is untouched.
- **Fold the copies (migration):** the film reads `event_date`, `venue_*`, `ceremony_type`, `love_story`;
  `std_media` becomes a pick from the shared gallery; after a backfill count, drop `std_film_date`,
  `std_film_venue_name`, `std_film_venue_city`, `std_film_ceremony_name`, `std_film_story`, `std_film_accent_hex`
  (`saveAllStdContent` also overwrites `event_date` from `std_film_date` — remove that write). `std_background`
  stays as the hub's ground. Column drops need the seven-guard paper trail
  (`dropping-a-table-has-a-paper-trail-in-seven-guards`) and `lint-events-column-grants.mjs`.
- **Files owned:** the Maker's Logo/Hero/Reveal workspaces, `monogram/*` (mount only), `reveal/*` (the listed
  files), `lib/reveal-materials.ts` (new), `reveal-preview-card.tsx`, `studio/save-the-date/actions.ts` (the fold),
  `save-the-date-film.tsx`, the migration. **Migrations:** 1. **Server-action delta:** 0. **Pages:** 0.
- **Gating:** logo letters/frame/ink free; logo animation Pro (alias from Phase 0); hero photo/clip Pro
  (`hub-look-is-pro`); every reveal Pro, No reveal free (`revealAllowedFor`).
- **Store shell:** the Reveal inspector shows only "No reveal"; Logo hides the animation rows; no ₱ anywhere.
- **Tests:** `revealAllowedFor` matrix (free×admin-on → none; Pro×choice → choice); material slots exist for all ten
  themes × four openings (a property test over the registry); the poster and the hero resolve to the same ref for
  ten fixture events; the film renders `event_date` after the columns are gone (db test replays the migration).
- **Browser check:** tap the monogram on the hero → letters become draggable, tilt the "I", Back to scenes → the
  logo is a finished mark on every stage; upload a PNG mark → letters dim, frame/ink still apply; choose Rustic +
  four-flap → kraft envelope, twine, seal breaks, card rises into the hero, no blank frame at the hand-off; drag the
  seal weakly → spring-back; Enter opens; Skip present; reduced motion → 400 ms fade; free couple → the page opens
  directly.

### Phase 7 — Love Story inside the Maker (each story is a scene)

- **Goal:** the scrapbook (`our_love_story_scrapbook_2026-09-25.html`, masthead "Our Love Story") opens from the
  bar; a moment = photos/clip + a date (day · month · just a year) + a line (+ place) + added-by (+ anchor tag How we
  met / The yes); moments self-sort into Before us · How we met · Falling · The yes · Toward the day (→ Before the
  day in Post Event); **each moment is one scene** in the navigator built from a Maker template with a transition;
  free = up to five word-only scenes; the sixth story or any photo/clip shows one quiet line — "Add more stories and
  your photos · Go Event Hub Pro" — opening `HubProOffer`; the five enforced on the server.
- **Builds on — no new table (checked against "one moment = one scene"):** `events.love_story` JSONB already holds
  the couple's story (`how_we_met`, `spark`, `proposal`, `milestones[]` ≤100, `anchors`); add `moments[]` beside
  them, each `{id, date:{y,m?,d?}, line, place?, media?: ref[], added_by, anchor?: 'met'|'yes', canvas:
  HubSectionCanvas}` — the same `canvas` shape every scene uses, so `sanitizeHubCanvas`, the templates and the
  transitions apply unchanged. Seed on first open: `how_we_met` → the "met" anchor moment (template 6), `spark` →
  Falling (8 Words only), `proposal` → "yes" (14 Full clip or 8), each `milestones[]` row → a moment (grouped into
  24 Timeline). The guest widget `our_love_story` (`our-love-story-widget.tsx`) expands to N scenes in
  `resolveSiteBodyPlan` (one virtual scene per visible moment, ordered by date, transitions from each moment's
  canvas) — on the Invitation by default, returning in Post Event as "Before the day". A separate
  `event_story_moments` table is **not** needed and would be a second home for one fact; cap `moments` at 100 like
  `milestones`. "Pick from our events" stores soft refs to `papic_photos` / gallery rows (the
  `person_story_items` pattern: `source_table` + id, nothing copied). **Theme:** none to pick — one line "Theme: X ·
  Change in Event Hub Maker ↗" jumps to Phase 3's panel. Love Story is open to every event type (D5 default).
- **Action:** extend `updateOurStory` or add ONE `loveStoryMomentAction(eventId, formData)` with intents `add |
  edit | delete | arrange | pick` (**+1**); the server counts `moments.length` and refuses the 6th, and refuses any
  `media` ref, unless `eventCoupleWebsiteProActive`.
- **Tour:** `customer_love_story_v1` (a moment is anything · a year is enough · both of you can add · it becomes
  scenes on your Event Hub · five are free, more and your photos are Pro — the Pro slide omitted in the shell).
- **Files owned:** the Love Story workspace components (new, under the Maker), `website/our-story/actions.ts`,
  `lib/love-story-moments.ts` (new, pure: sort into chapters, seed, cap), `our-love-story-widget.tsx`,
  `lib/site-body-plan.ts` (expansion), `lib/tours.ts`. **Migrations:** 0. **Server-action delta:** +1. **Pages:** 0.
- **Gating:** as ruled; the line opens the existing offer; nothing else is locked.
- **Store shell:** the line reads "Add more stories and your photos" with no price and no button.
- **Tests:** server refuses moment #6 and any media for a free event and allows both for Pro (fixture must not
  invent both sides — use the entitlement helper); seeding is idempotent; a year-only date sorts before a dated
  moment of the same year; the guest plan emits N scenes for N visible moments and skips hidden ones; the widget
  never renders a theme picker (grep guard).
- **Browser check:** open Love Story → the seeded chapters show the couple's existing words → add "2021 · Sagada"
  with just a year → it slots into Falling → the navigator gains a scene with the 6 Portrait template → try a 6th
  → the one line appears, opens the offer on the web, is inert in the shell → the guest Invitation shows the five
  scenes in date order with the theme's motion.

### Phase 8 — Post Event as scenes, written for them (and the open-up family)

- **Goal:** the Post Event stage is the 25 auto scenes of `post_event_auto_story_2026-09-25.html`, compiled from what
  happened, editable like any stage; four **open-up** scenes preview in the flow, open full screen on tap and close
  back to the same scene; the gallery's tabs follow the reader (Guest: Yours / Everyone's · Public: shared only ·
  Couple: everything); Apply = live for the people of the celebration; Publish to Discover keeps the consent rule;
  the 13 existing editorials (12 draft, 1 published) convert.
- **Builds on:** `event_editorial.draft_json` (add `scenes[]`, each `{key, template, source, canvas, mode}`; keep
  `sections`/`sectionOrder`/`chapterOverrides` readable for the conversion), `saveEditorial` (extended, not
  multiplied), `status` + `publish_consent_at` trigger + `stampForPublish`, `editorial-order.ts` (its "Editorial PRO"
  reorder mark is already free in effect — `EDITORIAL_PRO ∈ FREE_FOR_ALL_SKUS` — make the copy say so, D4),
  `story-cover.ts` (cover starts from the hero), the sources the prototype names per scene: `events` + living hero
  (0 Cover, T4) · `love_story.milestones` (1 Before the day, T24) · `guests`/`papic_photos` metrics (2, T12) · Papic
  buckets named after run-of-show blocks (3–12, T1/T5/T2 by bucket) · `galleryPhotos` (13 Gallery, open-up, preview
  T21) · `watchFilmEmbedUrl`/films (14 Watch the Film, open-up, preview T14 → `recap/page.tsx` PanoodReplay) ·
  `your-own-day.server.ts` (15 Were you there?, open-up, no name field → `were-you-there.tsx`, `find-in-this-day.tsx`) ·
  `photo_messages` (16 Whispered, open-up, preview T23 → `voices.ts`) · `challengeAnswers` (17, T25) ·
  `guest_columns` (18, T22, `custom-columns.ts` limits) · `vendorMedia` (19, T20) · `photo_wall_photos` (skipped
  without LIVE_WALL) · `draft_json.reviews` (skipped when none) · orders (20, T8) · `vendor_recommendations` (21,
  T17) · `special_message` (22 Letter, T11, pinned, composed until written) · `pakanta_song_r2_key` /
  `love_story.anchors.song` (23, T8, pinned last) · What's next (24, T10, optional). A source with nothing yields a
  **skipped** scene, shown as such — never an empty one (the "renders like emptiness" disease).
- **Open-up mechanic (new):** a scene-level `open: {kind: 'gallery'|'film'|'you'|'wishes'}`; the preview is the
  template; tap → a full-screen layer over the same scroll position (focus trapped, Esc/✕ returns, URL hash so Back
  works); the four bodies are the shipped components mounted in the layer. Reader tabs come from the viewer the page
  already resolves (`?as=`, Papic link session).
- **Compile timing:** the repo has no scheduler by design; compile lazily on the couple's first open of Post Event
  after `event_end_date` (and re-compile skipped scenes when sources gain content), stamping `generated_at`. "The
  morning after" as a push needs the existing digest — D9. Auto scenes are free; theme, template swap, own photos,
  own scenes are Pro (Phase 3/5 gates, unchanged).
- **Conversion:** a pure `draftToScenes(draft_json)` maps `sections` → scene rows; run once per editorial on open;
  verify the one published story on Real Stories before and after (the audit says Discover never read `status`
  — it reads `users.public_summary_consent_at` + `landing_page_visibility`; keep that).
- **Retire:** "Story Maker" label and the `/story` steps rail; `/story` and `/website/editorial` become redirects
  into the Maker; delete `website/editor/page.tsx` and `story/page.tsx` once `lint-port-no-lost-controls` shows every
  control has a home (**−2 pages**).
- **Files owned:** `lib/post-event-scenes.ts` (new, pure compile + conversion), `story/actions.ts` (extend),
  `story/_components/*` (mount inside the Maker; then remove the rail), the open-up layer component,
  `app/[slug]/_components/editorial/editorial-content.tsx` (render scenes), `editorial-order.ts`, `story-cover.ts`.
  **Migrations:** 0. **Server-action delta:** 0. **Pages:** −2 (at the end of the phase).
- **Gating / store shell:** as above; the open-up layer has nothing to sell.
- **Tests:** compile on the fixture event produces the prototype's 25 keys with the right templates; each empty
  source yields `skipped`, never an empty scene; a guest session sees Yours/Everyone's and a stranger only the
  shared layer; the open-up layer restores scroll position and focus; publish without consent still raises
  `story:publish_needs_consent`; the converted published editorial renders the same headline/lead as before (golden).
- **Browser check:** the owner's own past event → open Post Event → 20 scenes + 2 skipped, cover from the hero →
  tap "From the Day" → gallery opens full screen with Everything · Back returns to scene 13 → as a guest link:
  Yours/Everyone's → Apply → the people of the celebration see it → Publish to Discover → consent review → Real
  Stories shows it.

### Phase 9 — Prints & Tickets (the third bar group)

- **Goal:** one themed set derived from the hero and the theme — save-the-date card, the 3-card invitation
  (Invitation · The Entourage · The Finer Details), the event pass (CR80, per-guest QR), the A3 welcome/QR poster,
  signs; free couples see a compressed screen-resolution **Sample** (mark, no bleed/crop marks, no spot layers);
  Pro gets the print-ready PDF (bleed 3 mm, safe 5 mm, crop marks, foil/white-ink as separate layers) and the
  per-guest QR batch; die-cut shapes per theme; print uses the **ceremony** time.
- **Builds on:** the spec's data list (monogram `svgpaths`, names, ceremony block time — not the first schedule item —
  ceremony + reception venues, entourage grouped by `guests.role`/`extra_roles`/`entourage_order` via
  `lib/entourage.ts` with Ninong/Ninang already split, `dress_code_config` by group + swatches, RSVP contact, E-Gifts
  QR masked), the hub hero markup at card scale (one component, two scales — spec note), `lib/seating-pdf.ts` /
  `lib/lockup-pdf.ts` (pdf-lib patterns), `renderInvitationQrSvg` / `api/website/qr/guest/[guestId]/route.ts`,
  `lib/guest-pass.ts`, the existing pages `invitation/print`, `seating/print`, `event-qr`, `[slug]/print` (re-point
  their look to `resolveHubLook` — the audit found none reads `invite_theme`), `theme-posters/*.jpg` + each theme's
  `poster.jpg` (stills on paper; Classic paper only).
- **New fields (migration):** one JSONB `events.print_details` — `parents: [{name, deceased}]` (the † marker),
  `opening_line`, `rsvp_contact`, `gift_lines` (masked) — with its GRANT for every role and the view
  (`an-events-column-needs-its-own-grant`). Ceremony time is read from the ceremony block; no column.
- **Rendering:** the pieces are React at two scales (screen sample vs print) so the sample IS the design; the
  print-ready path is a **route handler** `app/api/hub-print/[piece]/route.ts` (**+1 route**) producing the PDF with
  pdf-lib from the same data, layers named for foil/white ink; the per-guest batch streams one PDF. Sample = the
  screen render rasterised at 1× with a diagonal "Sample" mark.
- **Files owned:** the Prints & Tickets workspace (new), `lib/print-pieces.ts` (new, pure: sizes, safe/bleed,
  die-cut per theme), the route handler, the migration, the four existing print files (look only),
  `guests/page.tsx` (the one download control) and the two QR sheet pages (accept an all-guests mode). **Migrations:** 1.
  **Server-action delta:** 0. **Pages/routes:** +1 route handler.
- **Gating:** everyone sees samples; the PDF route returns 403 without Pro (server-side, not only a hidden button).
  `CUSTOM_QR_GUEST` is **free** (09-06, 09-21 rows) — the plain branded per-guest QR stays free; only the themed
  print-ready pass batch is Pro. Input 7's "₱1,499 CUSTOM_QR_GUEST" is stale.
- **The free do-it-yourself QR PDF lives on the Guest list, not here** (owner 09-25: *"the free version is the PDF
  of QRs if they want to do it themselves"* → *"found on Guestlist"*). Today `guests/page.tsx` shows per-guest QRs
  in the drawer (`GuestCardBody`) and links to the Custom-QR studio, but has no bulk download. Add ONE action on the
  Guest list, **"Download QR codes (PDF)"**, that reuses the existing sheets — `invitation/print/page.tsx`
  (`renderInvitationQrSvg`), `studio/custom-qr-guest/print/page.tsx` (branded, free), `lib/qr.ts`,
  `lib/qr-monogram-raster.ts` — as one printable of every guest's QR + name; HTML + `window.print()` is what ships,
  so start there and add a pdf-lib download only if the owner asks for a file (the library is already in the repo).
  No new renderer. Prints & Tickets shows at most one line: *"Just the QR codes? Download them from your Guest list."*
  The Guest-list action is free for every event and visible in the store shell (QR is not a purchase).
- **Store shell:** samples show; the "Print-ready PDF" control is absent, not locked; the Guest-list QR download stays.
- **Tests:** ceremony time comes from the ceremony block (fixture with a different first block); † renders only when
  `deceased`; every theme has a die-cut and the CR80 pass fits 3.375 × 2.125 in with 3 mm bleed; the sample has no
  bleed box; the PDF route refuses a free event; entourage groups match `lib/entourage.ts` order.
- **Browser check:** Prints & Tickets → the six pieces in Luxe from the hero → free: Sample mark, "Download sample"
  only, plus the one-line pointer → Guest list → "Download QR codes (PDF)" prints every guest's QR with names, free,
  also in the shell → Pro: "Print-ready PDF" → layers visible in Acrobat (Foil, White ink) → passes batch shows a
  QR per guest that opens that guest's pass.

### Phase 10 — Adaptive theme + the five signature reveals (one PR each)

- **Goal (adaptive, Pro):** when a couple swaps a theme's loop for their own clip/photo, the theme's accent/button/
  ornament tint follows their media in the browser: `extractPaletteFromFile` (`lib/extract-palette.ts`) on a frame
  grabbed with `extractPosterFrame` (export it from `std-media-picker.tsx`), shift via `lib/color-space.ts`
  (`oklchOfHex`/`hexOfOklch`), re-measure text contrast over their frame and strengthen the scrim or advise a calmer
  clip, pick a still for print, seamless loop at playback by two stacked `<video>` cross-fading; toggle "Match my
  video's colours" (default on) / "Keep the theme's colours". Fonts, ornaments, reveal, transitions unchanged. No
  server. Stored as `canvas.tint` overrides on the Main background.
- **Goal (reveals, one PR each, after Layer 1 landed in Phase 6):** Luxe velvet curtains · Great Gatsby deco gates
  + confetti · Cinderella midnight sparkle (light only) · Modern frosted acrylic slide · Cyber neon flicker — each a
  new `RevealTemplateId` behind the same `revealAllowedFor` gate, dressed by `reveal-materials.ts`, meeting the
  0-blank-frame bar, with the CSS fallback matching WebGL. Until each lands, its theme's default is its dressed
  existing opening (registry field `reveal` may name a not-yet-shipped id only behind a `ready` flag).
- **Files owned:** `lib/adaptive-theme.ts` (new), `std-media-picker.tsx` (export), `reveal/*` new files,
  `lib/reveal-config-pure.ts` (ids), `lib/invite-themes.ts` (`reveal` values). **Migrations:** 0.
  **Server-action delta:** 0. **Pages:** 0.
- **Store shell / gating:** Pro; hidden in the shell.
- **Tests:** tint keeps contrast ≥ 4.5 on the fixture frames or raises the scrim; five ids × ten themes have
  materials; each new reveal passes the harness.
- **Browser check:** upload a warm clip on Modern → buttons shift warm, text still legible; toggle off → theme
  colours return; Luxe reveal → curtains part, fringe, card rises; reduced motion → fade.

### Phase 11 — Tours wear the brief (small, outside the Maker)

- **Goal:** bring `guided-tour.tsx`'s carousel and the three shipped customer tours + role welcomes up to the house
  style (no bordered card, glass + shadow, `--sn-*` motion, InfoTip for detail), without touching slide contracts.
- **Builds on:** `guided-tour.tsx`, `mini-tour.tsx`, `lib/tours.ts`, `tour-titles-are-text.test.ts`.
- **Files owned:** those two components. **Migrations:** 0. **Server-action delta:** 0. **Pages:** 0.
- **Tests:** `lint:no-card` / `lint:radius` on the component; existing tour tests. **Browser check:** clear a test
  user's `tour_seen_keys` → open Papic → the tour reads as the Maker's does.

### Slot F — editor-area findings from `rd/foldables-ready` (sized when the report lands)

- **Goal:** apply the foldables auditor's editor-area findings (hinge-aware layout, fold/unfold state continuity,
  navigator reflow, dual-screen spanning) that the phases above did not already close under the acceptance rule.
- **Builds on:** the Maker shell (Phase 1), the brief's viewport matrix, the auditor's report. **Files owned:** the
  Maker's layout components only. **Migrations:** 0. **Server-action delta:** 0. **Pages:** 0.
- **Browser check:** Chrome device emulation at 690×840 and 960×720 with a simulated hinge (`Surface Duo` preset)
  → the canvas sits on one pane, the navigator on the other or above; rotate/unfold mid-edit → the selected scene
  and the unsaved draft survive.

**Totals:** migrations 3 (+1 optional media ledger) · server-action exports +2 · pages +1 at most then −2 ·
route handlers +1.

---

## 4. Open owner decisions (only what the corpus does not answer) — each with a recommendation

Answered already, so **not** re-asked: name (Event Hub Maker) · price (₱3,500 / ₱2,100, another builder) · every
reveal Pro, No reveal free · colour free / media Pro · uploads Pro · one Pro unlock · try-in-draft/pay-at-Apply ·
Pro not in the iOS app yet · one sidebar row · Love Story inside, five free word-only, each a scene, no theme
picker · themes = the ten only · foil default in Luxe + Gatsby · media rules (100 MB compressed, 15 s refused,
1080p, silent backgrounds, music Pro) · printables as a third bar group, sample vs print-ready · the free QR PDF on
the Guest list · `CUSTOM_QR_GUEST` is free · text colour adapts to the background for everyone · foldables ready ·
"scene" as the word · tours for everything · the bar order.

| # | Decision | Recommendation |
|---|---|---|
| D1 | **Custom scenes: six per Event Hub (shipped CHECK) or six per stage** (the 09-25 Pro list says "6 per stage"; the 09-24 correction reads six shared as already satisfying "6 per phase"). | Ship six shared now, shown per stage by `canvas.stages`; add per-stage slots (migration) only if a couple runs out. |
| D2 | **Content clips: keep a small audio track (tap for sound) or all clips silent** (09-25 encode row says "confirm"). | Keep audio on content clips, silent backgrounds — the ruling's own words were "for the background video no sound". |
| D3 | **Where the retired theme rows go** (`capiz`/Elegant, `minimalist`, `fairytale`, `custom` — count them first) and the public name **Regency** vs Bridgerton. | capiz→Vintage · minimalist→Modern · fairytale→Cinderella · custom→Classic; public name Regency (trademark). |
| D4 | **Reordering Post Event scenes is free** (default). `editorial-order.ts` marks it Editorial PRO, which is free-for-all anyway. | Confirm free; fix the copy. |
| D5 | **Love Story open to every event type** (default). | Yes — a birthday's "Before us" is still a story; the seeding just skips wedding-only anchors. |
| D6 | **Draft media for free couples**: allow uploads inside the draft under a 30-day TTL prefix (softens "uploads are Pro" to "uploads go live with Pro"), or refuse until paid. | Allow with the TTL — it is what makes try-then-pay real; cap one hero + a small gallery in the draft. |
| D7 | **Reveal opening**: one committed swipe plays a self-paced 2.6 s open (spec 0024 §2b) vs thumb-scrubbed as shipped; **church doors become themed doors** (id unchanged). | Both as the defaults already taken (09-25 row); the prototype shows why scrub cannot stagger or hand off. |
| D8 | **Fonts**: ship the ~30 faces the ten themes name now, the full 112-face library later (bundle weight, CLS). | Theme faces first; library as a later phase once the Maker is live. |
| D9 | **Auto Post Event timing**: compile on the couple's first open after the event (no scheduler exists, by design) and mention it in the existing digest, vs a true "morning after" job. | Lazy compile + digest line; the scene set is identical either way. |
| D10 | **Ninong/Ninang ask card** and a **share-ready video invite** (input 7). | Ask card yes, as a seventh print piece in Phase 9 (roles already exist). Video invite: defer — it is a render job with a cost, and the Event Hub link already shares. |
| D11 | **Theme loops hosted on the public R2 bucket** (egress free) rather than in `public/` (Vercel bandwidth). | R2, uploaded once by admin; refs in the registry. |
| D12 | **Scene order per stage** (default taken) — stored per scene in `canvas.stages`, no migration. | Confirm. |
| D13 | **Pro owners inside the iOS shell**: hide Pro controls entirely (their applied look still renders on the public page) vs show them locked. | Hide entirely — 3.1.3(b) is about content that *works* in the app; a visible lock invites the question. |

---

## 5. Risks

1. **Held-branch order is load-bearing.** `hub-look-is-pro` conflicts with both `hub-hold-or-move` (`sections-panel.tsx`)
   and `every-reveal-is-pro` (`StdBuilderClient.tsx`), and its `widgets/actions.ts` comment about the colour kind is
   now false. Land it last, with a real rebase — not conflict clicks.
2. **Three builders touch neighbouring files.** `rd/every-guest-page-wears-the-theme` owns `[slug]/layout.tsx` +
   `resolveHubLook`; `rd/onboarding-sells-event-hub-pro` owns the catalogue price and Pro copy; #5953 owns the
   poster card. Phases 3, 6 and 9 must rebase onto them, never edit `hub-look.ts` in parallel. Before every merge:
   `git diff --stat origin/main...HEAD -- apps` (a docs merge once silently reverted 3,041 lines, #5937).
3. **Route ceiling.** 2,048 counted per page; headroom exists only because `clientSegmentCache` is off. This plan
   adds at most one page and one handler and retires two pages — but any builder adding "just a preview page" eats
   ~4 entries. The count is visible only when a deploy fails; do not infer it from `routes-manifest.json`.
4. **Two homes for one fact, waiting to happen:** `std_film_*` vs `events.*` (folded in Phase 6), `event_sponsors` vs
   guest roles (Phase 9 reads roles only; flag the other store, do not write it), `storyTheme` vs the event theme
   (Phase 8 stops reading it), a moments table vs `love_story.moments` (this plan chooses the JSON).
5. **RLS is row-level.** A couple can still PATCH look columns straight through PostgREST; the held branch's
   changelog says so. The column-grant/trigger migration is a follow-up the Maker does not need to ship, but Apply's
   server gate must not be the only fence forever.
6. **Scroll-timeline support.** Scrub and hold cross-fade rely on `animation-timeline: view()`; Safari coverage must
   be measured on a real iPhone (Safari 26), and the plain-page fallback must be exercised, not assumed.
7. **Bundle weight and low-end phones.** Thirty fonts, three.js for the rigid reveals, video loops per theme.
   Thumbnails as static renders, one live preview, lazy-mounted scenes; measure LCP on the guest page per theme.
8. **The hero video bypass** (`snippet` background plays the unscreened hero video) is live today; Phase 4 closes it
   before Phase 5 makes clips easy to place.
9. **Apple.** Web-bought Pro that *works* in the shell is the exact 2026-06-30 reasoning. Hiding Pro controls is a
   posture, not a guarantee — the applied look still renders on the public page inside the app's web view. Owner
   ruled "not yet"; keep the paid-feature list in `STORE_SHELL_HIDDEN_ADDON_KEYS` honest as the Maker grows.
10. **Copy that outruns shipping.** `WEBSITE_PRO_ITEMS`, the tour's "what Pro adds" slide and `/features` must list
    only what has landed at that moment (`/features must say what ships`); update them in the phase that ships each item.
11. **One heavy job at a time on a 16 GB Mac; deploys batched 4-hourly.** Merged is not deployed — the controller
    owns the deploy and tells the owner when to look.
12. **Prototype ≠ product.** The Love Story and Post Event prototypes are final in structure; pixels, placeholder
    numbers ("1,240", "85 days") and mock data are not the spec. The transition harness measurements are.
