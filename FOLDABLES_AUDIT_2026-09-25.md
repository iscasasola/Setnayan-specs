# FOLDABLES AUDIT — 2026-09-25

> Owner, verbatim: *"make sure that our app is prepare for iphone duo and other foldable phones as well"*.
> "iPhone duo" is read as Apple's foldable iPhone; the dual-screen reading (Surface Duo class) is covered too.
> House rule this is measured against: `DESIGN_BRIEF_2026-09-24.md` §1 — four viewport states
> (Mobile Portrait · Tablet/Foldable Portrait · Tablet/Foldable Landscape (unfolded) · Wide Desktop).
>
> Fix PR: **#5961** (`rd/foldables-ready`, auto-merge armed) — "fix(layout): foldable and dual-screen phones get the right layout".

---

## 0 · How this was measured (so it can be re-run)

- **Instrument:** headless Chromium 148 (Playwright 1.60) against **production `https://www.setnayan.com`**,
  `isMobile + hasTouch`, Android Galaxy Fold UA, DPR 1. Scripts, logs and every screenshot are in
  `~/Documents/Claude/Projects/foldables-audit-2026-09-25/` (`audit.cjs`, `continuity.cjs`, `inject.cjs`).
- **Pages:** `/` · `/vendors` · `/papic` · `/features` · `/explore` · `/login` · `/realstories` ·
  guest Event Hubs `/cale-ice` and `/maria-and-jose`.
- **Per page, per viewport:** horizontal overflow (`scrollWidth − clientWidth`, plus un-clipped offenders),
  rail state, widest prose measure (px and ≈characters per line), interactive targets under 24px,
  fixed overlays, and — under a hinge — every heading/paragraph/control that crosses it.
- **Hinges are REAL emulation, not arithmetic.** 🪤 `Emulation.setDisplayFeaturesOverride` is accepted by
  Chromium 148 and **does nothing** (`horizontal-viewport-segments: 2` stays false, `viewport.segments`
  stays 1). What works is `Emulation.setDeviceMetricsOverride` with a `displayFeature` — then the media
  query matches and `env(viewport-segment-width 1 0)` resolves to 540. And 🪤 Playwright's own
  `page.screenshot()` re-applies its device metrics and **silently drops the hinge** — the "after"
  screenshot looked identical to "before" while the DOM said otherwise. Capture with CDP
  `Page.captureScreenshot` instead. Both traps would have produced a clean-looking null result.
- **Not measured, and why:** the signed-in dashboard. No local Supabase (no Docker on this Mac) and
  signing in to production would mean typing a password into the browser, which a session must not do.
  The dashboard findings below are from the **code**, marked as such.

### Viewports

| id | CSS px | stands for |
|---|---|---|
| phone-ref | 390×844 | control |
| zfold-cover | 344×882 | Galaxy Z Fold cover screen |
| zflip | 412×919 | Galaxy Z Flip |
| zfold-inner / -rot | 690×840 · 840×690 | Z Fold inner, portrait / rotated |
| pixelfold-inner / -rot | 840×700 · 700×840 | Pixel Fold inner |
| ifold-p / ifold-l | 720×960 · 960×720 | foldable iPhone ESTIMATE (≈4:3) |
| duo-span | 1114×720, hinge x=540 w=34 | Surface Duo spanned (dual-screen) |
| fold-book | 690×840, hinge x=343 w=4 | Fold half-open like a book |
| flip-tabletop | 412×919, hinge y=458 w=4 | Flip half-open (Flex mode) |
| phone-land · ipad-mini-p | 844×390 · 744×1133 | for the iPhone-landscape question |

---

## 1 · Findings per viewport (production, before the fix)

**No horizontal scroll anywhere.** `hOverflow = 0` on all 9 pages × 12 viewports. Nothing to fix there.

| viewport | chrome drawn | widest prose | notes |
|---|---|---|---|
| 344 cover · 412 flip | phone (bottom bar, drawer rail) | 38–61 ch | correct — these are phones |
| 690 Fold inner | **phone** | `/` 105 ch · `/realstories` 82 · `/papic` 88 · `/vendors` 78 | the brief's "tablet/foldable portrait" state does not exist; bottom sheets were 690px wide |
| 700–840 Pixel Fold / rotated Fold | **phone** | `/` 107–129 ch · `/vendors` 79–126 · `/features` 72–99 | same |
| 720×960 iPhone-fold portrait | **phone** | `/` 110 ch · `/papic` 93 | same |
| 960×720 iPhone-fold landscape | **phone** (hamburger, rail hidden, bottom bar on the hub) | `/` 148 ch · `/vendors` 144 · `/features` 114 · `/realstories` 107 | 960px of width with a hamburger; the icon rail would fit twice over |
| 1114 Duo spanned | desktop (72px rail) | — | **10 headings/paragraphs/cards cross the hinge on `/`** — the headline read "Filipino ev │ ent"; `/login`'s whole panel sits on the hinge (353→747); the Event Hub invitation card is centred on it |
| fold-book (half-open) | phone | — | Event Hub content spans the crease (a continuous screen, so tolerable); the bottom sheet spanned it |
| flip-tabletop | phone | — | the sheet already sat below the crease (its content is short) — no defect measured |

The guest Event Hubs are the best-behaved surface: their prose is capped (`max-w-prose`, 73 ch) at
every width. The Event Hub's top bar + bottom bar take **129px of a 390px-tall** landscape phone.

**Touch targets under 24px** (WCAG 2.2 AA 2.5.8), same at every width — so not a foldable defect:
`/vendors` 17–18 and `/features` 19–20 (the marketing footer's link list, each link 20px tall);
`/login` the "remember me" checkbox (15×15) and two 17–19px text links; the front door's wordmark and
two "→" links (16px tall). Worth a separate sweep; out of scope here.

**Fixed overlays:** the cookie banner (`z-[70]`) paints **above an open sheet (`z-50`)** at every width
and covers its lower rows — seen on every sheet screenshot. Not foldable-specific; flagged.

**Safe areas:** `viewport-fit=cover` is on. bottom and top insets are used widely, but
**`-left`/`-right` on exactly one surface** (Panood control) — re-measure with
`grep -rn "safe-area-inset-left" apps/web/app apps/web/components`. Irrelevant in portrait; it decides the iPhone
landscape question (§5). A body-level `padding-inline` fix was considered and rejected: every `100vw` / `w-screen`
use (over a hundred — `grep -rn "100vw\|w-screen" apps/web/app apps/web/components | wc -l`) would
overflow by the inset.

### 1a · Resize continuity (a live fold/unfold mid-flow) — `continuity.cjs`

| flow | result |
|---|---|
| **Front-door drawer open at 690 → unfold to 1100** | 🔴 **DEFECT.** `railOpen` stayed true, so `<main inert>` stayed: every link in the page answered `inertAncestor: true`, `elementFromPoint` missed the column, and the scrim that would dismiss it is `display:none` at that width. A page that looks normal and ignores every tap. Folding back re-opened the drawer. Same shell wraps the signed-in trees, so it hit the dashboard too. **FIXED.** |
| Guest hub "Everything else" sheet open at 344 → 690 → 1100 → 344 | ✅ stays open; bottom sheet ↔ right drawer swap is pure CSS; body scroll-lock held throughout |
| `/login` half-typed email 344 → 690 → 344 → 960 | ✅ value kept |

Code-side, the only JS width branches that swap component trees are `seating-editor.tsx` (`isNarrow`
at 1023 swaps aside↔drawer; `isPhone` at 767 swaps popover↔sheet). The popover↔sheet swap reads
the selection from editor state (`highlightId` / `selMarker`), so a Pixel Fold unfolding across 768
keeps the selected table. The aside↔drawer swap at 1024 re-mounts the left panel (anything half-typed
in it resets) — no fold crosses 1024 except a spanned Duo, so it is noted, not fixed (code-read only;
the seating editor is behind sign-in and was not driven).

---

## 2 · What the PR fixes

1. **Unfolding ends the drawer** — `front-door-shell.tsx` closes the drawer when `useIsDesktop('lg')`
   turns true. Guard: `app/_components/frontdoor/unfolding-ends-the-drawer.test.ts` holds the hook's
   breakpoint to the drawer's `max-width` in `front-door.css` (agreement, not a value). Red under both
   sabotages (effect removed; hook moved to `xl`).
2. **The sheet fits foldables and hinges** — `app/_components/sheet-fold.css` (+ `data-sheet` /
   `data-sheet-panel` on `sheet.tsx`). Measured by injecting the rule into production under emulation:

   | case | before | after |
   |---|---|---|
   | 720×960 (tablet band) | panel 720 wide, edge to edge | **640, centred** (Material's large-screen cap) |
   | Duo spanned | right drawer at 762→1114 | **574→1114 = exactly the right screen** |
   | Fold like a book | 690 wide across the crease | **347→690 = the right half** |
   | Flip, tabletop | already below the crease | unchanged (rule caps height to the lower half) |

   Every guest page's "Everything else" sheet rides this — no `app/[slug]` file was touched.
   Guard: two new tests in `sheet-agrees-with-the-nav.test.ts` (the cap's ceiling = the dock point;
   the hooks and import exist). Red under both sabotages.
3. **A spanned phone reads on one screen** — `app/_components/frontdoor/front-door-fold.css`
   (loaded by `app-rail-shell.tsx`): at ≥1024 with two side-by-side segments `--fd-rail` becomes the
   left segment, so the content column starts on the right screen. Hinge-crossing elements on `/`:
   **10 → 1** (the top-bar search). Guard in `unfolding-ends-the-drawer.test.ts`; red when the floor
   moves off 1024 or the import is dropped.

Screens: `foldables-audit-2026-09-25/inject/{before,after}__duo-span___.png`,
`…/after__fold-book___cale-ice__sheet.png`, `…/after__tablet-band___cale-ice__sheet.png`,
`…/cont/A-drawer-1100-after-unfold.png`.

---

## 3 · What is left — OWNER decisions

1. 🔑 **The app's phone/desktop line is 1024, so every foldable is a phone.** Fold inner (690),
   Pixel Fold (840), the foldable iPhone in either orientation (720 / 960) all get the bottom bar,
   the hamburger and single-column pages. The brief's "Tablet/Foldable Portrait — rail" and
   "Tablet/Foldable Landscape — multi-column" states do not exist anywhere in the product yet.
   The industry line is Material's window size classes (compact < 600 · medium 600–839 ·
   expanded ≥ 840). **Moving the line is not a CSS tweak:** it is spread across ~47 files of `lg:hidden` /
   `hidden lg:*` and a dozen-plus `1023.98px` stylesheet blocks (re-measure:
   `grep -rlE "lg:hidden|hidden lg:(block|flex|grid|inline)" apps/web/app apps/web/components | wc -l`
   and `grep -rn "1023.98\|1023px\|1024px" apps/web/app --include='*.css'`), and `app/dashboard/[eventId]/layout.tsx` records
   the phone bottom-bar grammar below 1024 as locked. The two agreement guards this PR added
   (and `sheet-agrees-with-the-nav.test.ts`) are built so that a coordinated move goes green and a
   half move goes red. **Recommendation:** rail from 768 (md) as a first step — it catches the
   foldable iPhone landscape, Pixel Fold and rotated Fold, and every iPad portrait — then 600 once
   the event menu has a medium-width design. Needs the owner's word because it retires the bottom
   bar on iPad portrait.
2. **iPhone landscape** — see §5. Recommendation: not yet.
3. **Top-bar search on a spanned Duo** still crosses the hinge. Moving it means a second layout of
   the bar for one discontinued device class; not worth it without an owner ask.

## 4 · What is left — for the Event Hub Maker plan (FROZEN files, not touched)

- **Editor (`website/editor/_components/editor-shell.tsx`)**: below `lg` it is ONE pane at a time
  (a panel ⇄ preview toggle); the split (390px panel + preview) exists only from 1024. A 720–960
  foldable is exactly the "master-detail" screen the brief asks for — a split from `md` would put
  panel and live preview side by side on an unfolded phone.
- **`site-stage.tsx`**: the preview stage is fixed-height (`h-[300px] sm:h-[420px] lg:h-[560px]`),
  not aspect-aware. On a 960×720 landscape fold, 560px of stage plus the top bar leaves no room for
  the controls; on 720×960 portrait it wastes the height. Size it from the viewport's aspect (or
  `dvh`) rather than three fixed steps.
- **Scroll/Scrub scenes (`lib/hub-canvas.ts` + the `.hub-tl-scrub` rules in `globals.css`)**: they run
  on `view()` timelines with `entry`/`exit` ranges, which scale with the section-to-viewport ratio —
  no defect found at 4:3 or 3:4. Two things to design for: (a) on a short landscape viewport a section
  taller than the screen reaches `entry 92%` only once its top is near the top edge, so the arrival
  completes later in the scroll; (b) the Maker should preview scenes at 4:3 as well as phone and
  desktop — the foldable iPhone is expected to be 4:3.
- **Guest page chrome on a landscape phone**: the Event Hub's fixed top bar (64px) and bottom bar
  (65px) take a third of a 390px-tall screen.
- `lib/hub-canvas.ts` and `sections-panel.tsx`: nothing width-specific found.

## 5 · Recommendation — iPhone landscape for the foldable iPhone

**Keep iPhone portrait-only for now (`Info.plist` `UISupportedInterfaceOrientations` = Portrait).**
Revisit when Apple ships the foldable's SDK and simulator. Three reasons:

1. **Horizontal safe areas are unhandled.** With `viewport-fit=cover`, landscape puts the notch or
   Dynamic Island over the left or right edge of the content, and only one surface in the app pads
   for `safe-area-inset-left/right`. Turning landscape on today ships clipped edges on every current
   iPhone, not only the foldable.
2. **The short-height landscape chrome is unbudgeted** — the Event Hub's two fixed bars take a third
   of a 390px-tall screen, and nothing in the app uses a `max-height` media query to slim them.
3. **Nothing about the foldable's orientation behaviour is known yet.** Whether a portrait-only
   iPhone app runs letterboxed, rotated or full-screen on the inner display is Apple's call and is
   not documented. Portrait-only is not an App Store review risk; a broken landscape layout is.

When it ships: (a) add horizontal safe-area padding to the shell and the fixed bars, (b) re-run
`audit.cjs` at the real inner-display size in both orientations, (c) then add the two landscape
keys to the iPhone array. The web layer already renders 960×720 without overflow (§1), and the
iPad array already allows all four orientations.

**Android is already fine:** no orientation lock, `targetSdk 36` (so Android 16 ignores
orientation/resizability limits on large screens anyway), and `configChanges` includes
`screenSize|smallestScreenSize|screenLayout`, so fold/unfold resizes the WebView without restarting
the activity. The drawer fix in §2 is what makes that resize safe.
