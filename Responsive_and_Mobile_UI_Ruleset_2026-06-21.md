# Setnayan — Responsive & Mobile-UI Ruleset (GLOBAL)

> **Date:** 2026-06-21 · **Status:** Part A (global rules) + Part B (navigation IA) RATIFIED by owner this session. Surface-by-surface application follows.
> **Basis:** [`Responsive_Design_Audit_2026-06-21.md`](Responsive_Design_Audit_2026-06-21.md) (current shipped state, fully cited) + the "Mobile App UIs in 8 minutes" video lessons + owner's Shazam (mobile) / DesignBrand (desktop) inspiration. Synthesized by a 19-agent code-grounded, adversarially-verified workflow.
> **How to read:** these are **laws that govern every surface**. ⚠ = touches an owner-locked decision (recorded, never silently changed). Each rule has a stable ID; build waves are at the end.

---

## 0. Owner decisions ratified 2026-06-21 (these drive everything below)

| Fork | Decision | Consequence |
|---|---|---|
| **Bottom-nav model** | **≤5 tabs in the pill + ONE broken-out contextual action** beside it (Shazam pattern). | Vendor & admin drop from 6 cells to 5 (one destination demoted to the side menu). Customer stays 5. The broken-out action is a **sibling of**, not a cell inside, the locked pill. **Supersedes** the 2026-06-15 owner-picked 6-tab vendor/admin rosters. |
| **Side menu / "More"** | **Notion-style secondary home** (the video's Option B): recents/active at top, grouped actions with counts, prominent search/action at bottom — not a flat link dump. | The vendor/admin "More" surface gets rebuilt; customer overflow (account/settings/help) follows the same pattern. |
| **Visual direction** | **Structure only — stay Clean Editorial.** Borrow Shazam's *layout intelligence* (sparse floating pill, broken-out action, thumb-zone CTAs, peeking rows, whitespace); render it entirely in `--m-*` (frosted Alabaster + Champagne-Gold hairlines + Mulberry). **No Shazam blue, no heavy glass.** | The 2026-06-04 light Clean-Editorial palette lock is preserved. `GLASS-1` enforces it. |

---

## PART A — GLOBAL RULES (every surface inherits these)

### A1 · Breakpoint system — 2 tiers, one source of truth
- **`sm` 640px = reflow** (1→2 col, sheet→dialog). **`lg` 1024px = master** mobile↔desktop switch (bottom-nav⇄sidebar). **`md` 768px reserved** for documented split-pane exceptions only.
- **SYS-1:** Extract ONE `useBreakpoint()` / `useIsDesktop()` hook + named constants (`BP.sm=640`, `BP.lg=1024`) and migrate the ~16 inline `matchMedia` calls + scattered magic numbers (1024/1023/767/640) to it. Move `usePrefersReducedMotion()` into the same shared module. *This is the foundation gestures/overlays build on — land it before Wave 3.*
- Define `--sidebar-width` (today referenced but never defined; always falls back to 16rem).

### A2 · Sizing & touch — bigger on mobile, never smaller
- **SIZE-1:** Body/UI text floors at **16px** on touch (`pointer:coarse`) and never computes smaller. Responsive pairs go small→large (`text-base sm:text-lg`), never reverse. 14px is a **desktop-only** (`pointer:fine`/≥1024) density allowance.
- **SIZE-2:** Every tappable target ≥ **44×44px** — links, `role=tab`, `role=button`, label toggles, segmented items, not just `<button>`. Raise marketing hamburger 40→44px (`_nav-mobile.tsx`). Raise `.sn-seg-item` to a 44px tap area (visual pill may stay slimmer via internal padding).
- **SIZE-4:** Two regimes stay separate: the `pointer:coarse` 16px-input + 44px-target floors are NEVER disabled to "match desktop." ⚠ Keep `maximumScale:5` (WCAG pinch-zoom) and the 16px input floor — never lock the viewport to enlarge type.

### A3 · Spacing — mobile at least as generous as desktop
- **SIZE-3:** Section padding uses a **fluid clamp with a mobile floor** (`clamp(20px, 5vw, 56px)`), not the `px-4 sm:px-6 lg:px-8` ladder that gives phones the *least* padding. Adopt one canonical fluid wrapper (`.m-section` or its replacement) site-wide. Never tighten mobile spacing to fit more — add a page or a horizontal rail.

### A4 · Cards — one primitive, never nested
- **CARD-1:** ⚠ ONE card primitive (`.m-card`: `--m-paper` bg, 1px `--m-line`, radius `--m-r-lg` =22px, `--m-shadow-sm`). Hand-rolled `rounded-2xl border bg-cream` is banned; new surfaces use the primitive.
- **CARD-2/3:** **No double-nesting** — a card never directly contains another card. Inner groups separate by **whitespace** (`space-y-3/4`) or a **hairline divider** (`divide-y divide-[--m-line]`). The only bordered descendant allowed is a **media well** (image/QR/chart/video/swatch). A list of rows = one card + `divide-y`, not one card per row. A section *wrapper* is a non-card (whitespace+heading) so child cards don't double-nest.
- **CARD-6:** Card padding floors at `p-5` (20px) on phone for primary cards (`p-4` only for compact tiles), → `sm:p-6`. Never shrink padding to fit content.

### A5 · Layout direction — one axis per mobile section
- **DIR-1:** Below `lg`, each section picks **one** axis: vertical stack **or** horizontal snap-scroll — never a 3+ col × multi-row grid. *Exemption:* KPI/stat tiles (label+number+delta) may go 2-up base / 3-up `sm`. Above `lg`, DIR-1 does not apply — desktop density is sanctioned (`DESK-1`).
- **GRID-1 / CARD-5:** Canonical card grid is `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (kills the sm-vs-lg reflow drift). Do not collapse 1→2 at `lg` on some sections and `sm` on others.
- **ROW-1:** "Recent/suggested" = ONE shared horizontal snap-scroller (`flex snap-x snap-mandatory overflow-x-auto`, `shrink-0` cards, ~16px trailing **peek**, hidden scrollbar). Desktop may switch the same data to a grid.
- **DIR-2:** ⚠ Wide desktop grids get a phone form: vendor calendar `grid-cols-7` → mobile **agenda/week-scroller** (`grid-cols-7` is `lg:` only); dense tables → restack to cards or horizontal-scroll with a frozen first column (never a raw cramped grid). Calendar chips ≥11px.

### A6 · Overlays — sheet on mobile, drawer/dialog on desktop
- **OVL-1:** Bottom sheet `<640px` flips to side **drawer** (Pattern A: `sm:items-stretch sm:justify-end`) or centered **dialog** (Pattern B: `sm:items-center`) at `sm`. No overlay stays a full-bleed sheet on desktop.
- **OVL-2/3:** Standard `max-h-[90dvh]` (dvh, not vh). **Mandatory** `pb-[max(env(safe-area-inset-bottom),16px)]` on any sheet footer with a CTA.
- **OVL-4:** ⚠ Sheets get a **real, wired** drag-to-dismiss grabber (`h-1 w-10 rounded-full bg-ink/15`), dismiss past ~40%/~80px, snap back otherwise. Never paint an unwired grabber. ESC + backdrop-tap + visible X remain (WCAG).
- **OVL-5:** Toast repositions: bottom-center mobile (above `--sn-bottomnav-h`) → top-right desktop.
- **OVL-6/7:** `ConfirmDialog` becomes a sheet on phones. Anchored dropdowns with >3 rows become a sheet `<640px`; small menus stay anchored.
- **OVL-12:** Provide a **tap/focus tooltip** primitive; never rely on native `title` alone (invisible on touch).

### A7 · One screen, one thing
- **OSOT-1/2:** Every route except the 4 dashboard homes serves **one job** (one dominant section/form/editor; additional top-level blocks may only be a header, a single summary strip, or a Link to another route). To add a capability, add a **route** and link to it — never graft a second management surface. Secondary tasks open as a **sheet on the same route**.
- **OSOT-3:** ⚠ Event-home stays a ≤5-beat single-column "cockpit." New home blocks replace a beat or move to a tab.

### A8 · Motion & empty states
- **ACT-2/3:** Chrome show/hide uses canonical `transition-transform duration-300 ease-out` + `motion-reduce:transition-none`. Banned: hard `display:none` chrome toggles the user watches appear/disappear. Reduced-motion read only via the shared hook (`SYS-1`).
- **ACT-1:** ⚠ Mobile deep-focus editors present a self-contained thumb-zone action set (≥1 primary "Done" + "Cancel/X", ≥44px), persistent for the task, removed on exit. May hide the top bar; may not rely on the global bottom nav as the only exit.
- **EMP-1/2:** ONE shared `<EmptyState>` primitive, 3 variants: **first-use** (dashed full-panel + 1 action + teach line), **no-results** (imagery + acknowledgement + typo/broaden suggestion + a **count-backed** exit like "Show all 42 venues"), **scheduled-to-fill** (status chip). A no-results state with no exit is a defect. A lone Lucide glyph does not satisfy the imagery requirement.

### A9 · Visual language — Clean Editorial (structure-only borrow)
- **GLASS-1:** ⚠ Glassmorphism permitted ONLY as frosted Alabaster chrome (`--m-paper`/`--m-paper-2` ~90–94% + `backdrop-blur`); never glass over a saturated color, never a blue/violet gradient. Hairlines = `--m-line` or Champagne-Gold `--m-orange`; press/active light stays white. **No Shazam blue enters production.**
- **CTA-1:** The single primary CTA on any mobile landing/onboarding/empty surface = **full-width Mulberry pill** (`w-full rounded-full --m-mulberry`, min-height 52px, `pb env(safe-area-inset-bottom)`), pinned to the thumb zone. No `flex-wrap` button rows as the sole primary CTA below 640px.

### A10 · Accessibility & i18n *(the video skipped these; the market needs them)*
- **A11Y-1:** Global `:focus-visible` ring (2px + offset, `--m-ink`/`--m-mulberry`) on ALL interactive elements (today only `.btn`).
- **A11Y-2:** Add ONE skip-to-content link as the first focusable element in the app shell.
- **A11Y-3/4:** Replace native-`title` tooltips with a tap/focus popover on coarse pointers. Every horizontal scroller, sheet, and the broken-out action is keyboard-operable and announces state.
- **I18N-1:** Nav/tab/button labels must not truncate or wrap-break at **+30% string length** (test in TL/CEB — they run ~20–30% longer than EN). Test BottomNav + SubNav labels in the **longest** locale. No RTL work (all locales LTR).

### A11 · Native / PWA parity
- **PWA-1:** Reconcile `theme_color` / `background_color` / viewport `themeColor` to one token (`--m-paper`) — fixes the `#FAF7F2` vs `#FFFFFF` standalone flicker.
- **PWA-2:** Every new mobile chrome rule (broken-out action, gestures, sticky CTAs) is validated in **Capacitor + `display-mode:standalone`**, not just mobile web (the server has zero width knowledge; native opens some flows externally).

### A12 · Loading & responsive media
- **LOAD-1/2:** Every route-level `loading.tsx` skeleton mirrors its loaded layout **at each breakpoint** (same column count, same card primitive) — zero layout shift on reflow. Reserve space for async chrome (`--sn-bottomnav-h`, top bar).
- **IMG-1/2/3:** All content images via `next/image` with explicit width/height or `aspect-ratio` (no CLS) and a `sizes` matching the card grid. `deviceSizes` cap 1920 + webp-only is canonical (no AVIF/4K without a perf budget). Below-the-fold media lazy-loads; the LCP/hero image is `priority`.

---

## PART B — NAVIGATION INFORMATION ARCHITECTURE

### B1 · The architecture — one tree, two renderings
One **menu tree per doorway** (SSOT: `lib/customer-menu.ts` + the `/admin/menus` registry). Each item is tagged:
- **`primary`** → rides the bottom-nav pill (mobile) / sidebar top rail (desktop)
- **`overflow`** → the Notion-style "More" / side menu (mobile) / grouped sidebar sections (desktop)
- **`action`** → the single broken-out contextual button (mobile satellite) / top-bar primary button or search (desktop)

| Tag | Mobile (`<1024`) | Desktop (`≥1024`) |
|---|---|---|
| `primary` | Bottom-nav pill cells (**≤5**) | Sidebar top rail |
| `overflow` | "More" secondary home | Grouped sidebar sections below |
| `action` | Broken-out satellite beside the pill | Top-bar search / primary button |

**Conversion is mechanical and must stay symmetrical:** the pill's primary items become the sidebar top; "More" contents become sidebar groups; the satellite action becomes the top-bar action. ⚠ The sidebar **never** becomes a hamburger drawer — it is `hidden` `<lg` and the pill owns mobile. The **marketing brochure header is the only sanctioned mobile hamburger** (those pages have no bottom nav).

### B2 · Per-doorway rosters (ratified model)

| Doorway | Pill `primary` (≤5) | Broken-out `action` | "More" / side-menu `overflow` (Notion home) |
|---|---|---|---|
| **Customer** | Home · Guests · Explore · Studio · Budget *(phase-aware: Day-of → Now·Check-in·Seats·Services·Schedule; After → Home·Review·Editorial·Galleries)* | **phase-aware**: Plan = "+ Add", Day-of = "Scan" (check-in) | Account · Settings · Notifications · Help · Services index *(reached via account switcher / a More affordance)* |
| **Vendor** | Home · Bookings · Calendar · Messages · **More** | **"+ New"** (quote/booking) | **Website** (demoted from pill) · Team · Earnings · Tokens · Marketing · Settings |
| **Admin** | Home · Work · Directory · Money · **More** | **"Search"** | **Insights** (demoted from pill) · Catalog · Content · Settings |
| **Account** | *(no bottom nav — transient surface)* | — | Sidebar-only (My Events · Notifications · Profile · Marketplace · New event) |

Notes:
- **Which item demotes** (vendor `Website`, admin `Insights`) is the recommendation; final pick is adjustable, but the **≤5 pill + action** shape is locked.
- Customer keeps its **phase-aware accordion** for section children (in-place child extraction) — that pattern never overflows and is exempt from the 5-cap discussion.
- The **`action` is contextual and may be phase-aware** (it is NOT a fixed 6th tab).

### B3 · Bottom-nav rules
- **NAV-9:** ⚠ Geometry is canonical & unchanged: floating frosted **paper** pill (`rgba(248,246,240,0.92)`, never colored glass), inset 14px each edge, 12px above `env(safe-area-inset-bottom)`, `z-30`, fully rounded, `lg:hidden`. All changes edit the ONE shared template — never fork a per-surface bar.
- **NAV-1:** Pill holds **≤5** cells. *Correction to prior assumptions:* the lint guard (`scripts/lint-bottom-nav.mjs`) does NOT cap tab count today (it checks delegation + 7 interaction markers; the count is a `console.warn` at >6 in `bottom-nav.tsx`). **New work:** add a real ≤5 count assertion to the guard, and add the frosted-fill token to `REQUIRED_MARKERS` so the fill can't be restyled.
- **NAV-2 / OVL-10:** ⚠ The broken-out **satellite** = one circular **Mulberry** (`--m-mulberry`) button, ≥56px diameter, sibling of the pill, same safe-area offset, at most one per surface, absent when a surface has no single dominant action. Additive to the locked template (owner-approved 2026-06-21).
- **NAV-7:** Once ≤5, bottom-nav labels rise to **≥11px (prefer 12px)** — the freed width buys legibility, not more tabs.
- **NAV-3:** The docked **SubNav** (second contextual pill) stays **≤5 children** (`flex-1`, no scroll); a section needing >5 sub-tabs uses an in-page `.sn-seg` scroller or a sub-page.

### B4 · "More" / side-menu rules (Notion-style home)
- **NAV-5:** ⚠ "More" is a **secondary home**, not a link dump: recent/active items at top, grouped actions **with counts** on the right, a prominent **search / primary action** at the bottom. Built on the card primitive (`CARD-1`), one-direction-per-section (`DIR-1`), with first-use/empty states (`EMP-1`).

### B5 · Top bar (both platforms)
- **NAV-8:** The top bar is **contextual, not a frozen toolbar**: page-specific title + actions + unread bell, continuing hide-on-scroll-down / reveal-on-scroll-up. Desktop search lives here; on mobile that search is the satellite action or swipe-up-to-search (Wave 3).

### B6 · Desktop dashboard (the DesignBrand reference)
- **DESK-1:** ≥1024px dashboards keep: fixed left **sidebar rail** (collapsible 16rem⇄4rem, **light Alabaster — not dark navy**) + sticky top bar with ONE canonical right-aligned rounded **search** field + a **two-direction titled-card grid** (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, every module a titled `.m-card`). Cap couple-side content width to match vendor/admin (`max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl`). DIR-1's single-axis constraint does **not** apply at desktop.

---

## PART C — Gestures (Wave 3, native-shell-first)
- **GEST-1:** ONE shared gesture hook (Pointer Events, axis-lock on first 8px — reuse `guest-list-multiselect.tsx:1145` logic). No new inline gesture state machines.
- **GEST-2:** All sheets get drag-to-dismiss + one snap point; scale the page behind to 0.96 (reduced-motion-safe). Pad safe-area.
- **GEST-3/4/6:** Swipe-up-to-search (with a visible grabber hint), long-press action sheet (additive only — every action also has a visible tap path), opt-in per-route swipe-back (never on onboarding / full-bleed canvases / scroll surfaces; never intercept OS edge-swipe except unsaved-data guards).
- **GEST-5:** Any gesture on a **primary** path ships a visible affordance (peek/grabber/coachmark) with a per-account "seen" flag. `aria-label` alone does not count.
- ⚠ Gestures must yield to: onboarding's locked prototype, WCAG pinch-zoom (never `touch-action:none` on scrollable content), iOS edge-swipe-back.

---

## PART D — Build waves (reuse primitives over new ones)

**Wave 1 — quick wins** (pure CSS/utility, no sign-off, low risk):
SIZE-1..5, NAV-4 (hamburger 44px), DIR-2 (calendar chip ≥11px), DIR-3/ROW-1 (formalize peeking scrollers), A11Y-1/2 (focus ring + skip link), LOAD-1, GRID-1/CARD-5 (settle reflow), PWA-1 (theme_color), I18N-1, CTA-1.

**Wave 2 — structural** (shared primitives + codemods + system hygiene; some sign-off):
SYS-1 (the breakpoint/reduced-motion hook — **foundation**), CARD-1/2/3 (one card primitive codemod), DIR-1, DESK-1 (write the desktop rules + define `--sidebar-width` + cap couple width), OVL-1..7 (ratify Toast/ConfirmDialog + table→card), IMG-1..3, NAV-5 (Notion "More"), NAV-8, A11Y-3/4, PWA-2, SIZE-6.

**Wave 3 — nav-template edit + gestures** (owner-locked template + gesture layer; highest risk, native-shell-first):
NAV-1 (≤5 cap + lint count assertion), NAV-2 (broken-out satellite), NAV-7 (bigger labels), NAV-3, NAV-9 (fill token to lint), GEST-1..6. *NAV-1/2/7 move together as one owner-gated template edit; GEST-1 (Sheet drag-dismiss) is the safe one and can pull earlier.*

---

## PART E — VISUAL & INTERACTION FUNDAMENTALS
*Integrated from "Every UI/UX Concept Explained in Under 10 Minutes." Part A/B/C/D govern responsive structure + IA; Part E governs how any single surface should LOOK and RESPOND. These are global and apply at every breakpoint. Most fold into Wave 1 (token/CSS) and Wave 2 (shared primitives).*

### E1 · Signifiers & affordances — the UI must explain itself
- **VIS-1:** Meaning is shown, not written. A **container** signifies grouping/selection; a **grayed** element (reduced opacity + `cursor-not-allowed`) signifies inactive; an **accent underline/fill** signifies the active nav/tab. Don't add instructional text where a signifier does the job.
- **VIS-2:** ⚠ Every interactive element exposes its affordance through state (see E8) — hover (desktop), press, active/selected highlight, focus ring (`A11Y-1`), and a tooltip/`aria-label` (`OVL-12`) where the icon alone is ambiguous. A control with no visible state is a defect.

### E2 · Hierarchy — size · position · color (in that order of power)
- **VIS-3:** Each card/section has exactly **one** clear focal element: largest + boldest + nearest the top. Secondary info (date, meta) is smaller and below. **Hierarchy is contrast** — if two things look equally weighted, neither reads as primary.
- **VIS-4:** **Lead with an image where one exists** (vendor cards, gallery, real-stories, recently-found rows) — imagery adds color and makes scanning fast (`ROW-1`/`CARD-2` media wells).
- **VIS-5:** The single most action-relevant value (price, status, count) sits **top + end-aligned + in an accent** (`--m-mulberry` or `--m-orange`) so the eye lands on it. Use position + color to imply relationships (a `→` between origin/destination instead of the words "from/to").

### E3 · Whitespace first, grid second
- **VIS-6:** **Whitespace is the primary grouping tool** — group related items by proximity before reaching for a bordered container (reinforces `CARD-2/3` no-double-nesting). A 12-col grid is a *guideline* for repeating/structured content (galleries, blogs, marketplace), not a mandate for bespoke pages.
- **VIS-7:** Spacing follows a **4-point system** (every gap a multiple of 4; 8/16/24/32 are the workhorses) so any space can be halved consistently. This is the spacing spine under `SIZE-3`'s fluid clamps and `CARD-6`'s padding floors.

### E4 · Typography
- **VIS-8:** ⚠ **One type family for body** — our locked **Source Sans** (do not add fonts; the **Saira Condensed** display face used by `.m-display-tight` for hero/event-name headers is the one sanctioned exception, already in the system). Picking fonts is not where design time goes.
- **VIS-9:** On **large text** (display/hero, ≥~32px) tighten **letter-spacing −2% to −3%** and drop **line-height to 110–120%** — the cheap move that makes big type read "designed." Body copy keeps comfortable line-height (~150%). `.m-display-tight` already encodes this; extend the tightening to other large headings.
- **VIS-10:** Cap the type scale: **≤6 sizes** on marketing/landing surfaces; **dense dashboards rarely exceed ~24px** (information density). This bounds the `clamp()` ladder and resolves the audit's "two type systems" drift toward one capped scale.

### E5 · Color — purpose, not decoration
- **VIS-11:** Built on **one primary** (`--m-mulberry`), lightened → backgrounds, darkened → text — the spine of the `--m-*` ramp (Alabaster/Obsidian/Champagne-Gold/Mulberry). No off-ramp colors (see `GLASS-1`; the audit flagged `/setnayan-ai`'s non-token hex — fix to tokens).
- **VIS-12:** **Semantic colors carry meaning:** success = green, danger/destructive = red, warning = amber/`--m-orange`, info/trust = a calm accent. Use them for state (error inputs, success toasts, "new" chips), never as decoration. Map these to named tokens so they're consistent everywhere.

### E6 · Shadows & depth (light mode)
- **VIS-13:** Depth via the `--m-shadow-sm/md/lg` ramp only: **low opacity + generous blur**. Cards use `sm`; floating/popover content (sheets, dropdowns, the bottom-nav pill) uses a stronger `md/lg`. Rule of thumb: **if the shadow is the first thing you notice, it's too strong.**
- **VIS-14:** *Dark mode is out of scope* (app is light-locked, `A9`). The keynote decks are the only dark surface; if a dark surface is ever added, depth comes from a **lighter-than-background card** (not shadows) and chips **dim saturation, brighten text** — recorded here so it isn't re-derived.

### E7 · Icons & buttons
- **VIS-15:** Icons match the adjacent text's line-height (≈ the font's cap/line box, ~`h-4`/`h-5` against our text sizes) — oversized icons are the most common amateur tell. Strokes stay consistent (Lucide, `strokeWidth≈1.75`).
- **VIS-16:** Buttons are one family of primitives: **ghost** (no fill until hover — sidebar/nav links), **secondary** (outline/tonal), **primary** (`--m-mulberry` fill). Comfortable padding ≈ **width 2× height**; works with or without a leading icon. A primary + secondary CTA pair is the default action layout (`CTA-1` governs the mobile full-width case).

### E8 · States & feedback — every action gets a response
- **VIS-17:** ⚠ Every **button** ships ≥4 states — **default · hover · active/pressed · disabled** — plus a **loading** state (spinner/disabled) for async actions. The locked BottomNav's press-light is the reference interaction.
- **VIS-18:** Every **input** ships **focus** (visible ring, `A11Y-1`), **error** (red border + message), and where useful **warning** states — never a silent rejection. Pair with inline validation copy.
- **VIS-19:** Every async or mutating action shows feedback: loading spinner/skeleton while fetching (`LOAD-1`), a success confirmation (toast `OVL-5`), and an error path. No "dead click."

### E9 · Micro-interactions
- **VIS-20:** Confirm non-obvious actions with a small motion cue, not just a state change — e.g. a "Copied" chip that slides up on copy, a checkmark on save. Built on the canonical motion tokens (`ACT-2`) and **always reduced-motion-safe** (`ACT-3`). Range from purely practical to lightly playful, but never gratuitous.

### E10 · Image overlays
- **VIS-21:** Text over imagery (hero, gallery captions, real-stories, save-the-date) never uses a flat full-screen scrim that flattens the photo. Use a **linear gradient** that keeps the image visible and converges into a readable band behind the text; an optional **progressive blur** on top of the gradient for the premium treatment. Tokens/util to be standardized so every photo-over-text surface uses the same recipe.


- **Density vs sizing:** density is a **desktop** affordance; on mobile a "dense dashboard" becomes a vertical stack of horizontal **peer-rows** — never shrink padding/type below the floors to fit more.
- **DIR-1 vs KPI grids:** KPI/stat tiles count as equal-peer tiles and are exempt up to 2-up base / 3-up `sm`. Above `lg`, DIR-1 doesn't apply.
- **Section wrapper vs card nesting:** section panels group with whitespace + heading (non-card); only leaf surfaces are `.m-card`; media wells are the sole bordered descendant.
- **Customer accordion is exempt** from the ≤5 flat-mode reasoning (it extracts children in place, never overflows).

*Anchored to [`Responsive_Design_Audit_2026-06-21.md`](Responsive_Design_Audit_2026-06-21.md) for all current-state file:line citations.*
