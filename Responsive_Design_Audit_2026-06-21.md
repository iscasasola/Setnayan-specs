# Responsive / Adaptive Design Audit — www.setnayan.com

> **Date:** 2026-06-21 · **Source:** `apps/web` @ `origin/main` #1936 (clean worktree `wt-responsive-audit`)
> **Purpose:** Inventory of EVERY desktop/mobile adaptive setting currently shipped, as the factual base for a canonical desktop↔mobile responsive ruleset. This is a **discovery snapshot** — it records what IS, not what SHOULD be. Inconsistencies are flagged in §9 for the rule-writing pass.
> **Method:** 6 parallel deep-search agents (breakpoints/CSS · JS logic · nav chrome · overlays · marketing pages · app surfaces). Every claim below traces to a `file:line` in the agent reports.

---

## 0. TL;DR — the de-facto system in one paragraph

The site runs on **Tailwind's default breakpoints** (`sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`), explicitly re-declared so a theme can't shift them. In practice only **two** breakpoints carry real weight: **`lg` (1024px) is the master mobile↔desktop switch** (bottom-nav ⇄ sidebar, hamburger ⇄ inline links, list ⇄ plan), and **`sm` (640px) is the reflow point** (grids 1→2 col, forms 1→2 col, sheet ⇄ dialog/drawer). **`md` (768px) is almost never used.** There is **no shared responsive JS hook and no named breakpoint constant** — every width decision is an inline magic number. Mobile-first is the authoring default; desktop is layered on with `lg:` utilities or additive CSS (onboarding is the textbook case). The one structural fork is **native-shell (Capacitor) vs web**, which is UA/cookie-driven, not width-driven.

---

## 1. Breakpoint system (the source of truth)

### 1a. Tailwind screens — `tailwind.config.ts:32-38`
Declared explicitly (NOT relying on defaults), values == Tailwind defaults:

| Token | px | Role in practice |
|---|---|---|
| `sm` | **640** | Grid/form reflow (1→2 col), sheet→dialog/drawer flip, marketplace bar top/bottom flip |
| `md` | **768** | **Orphan** — almost never used (only `vendor-vision.tsx`, `login`/`signup` split panes, seating phone `767`) |
| `lg` | **1024** | **MASTER mobile↔desktop switch** — nav chrome, shell offset, list↔plan, hamburger↔inline |
| `xl` | **1280** | Rare — legacy `SiteHeader` inline search, explore 4-up tiles |
| `2xl` | **1536** | Rare — vendor/admin topbar max-width cap only |

- `darkMode: 'class'` (`tailwind.config.ts:29`) — dark is class-driven, NOT OS-driven.
- No `theme.container`; no responsive `spacing`/`fontSize`/`maxWidth` in `theme.extend`.

### 1b. Non-Tailwind custom breakpoints (won't show in a Tailwind audit)
| px / condition | Where | Effect |
|---|---|---|
| **480px** (min-width) | `onboarding.css:30` | Phone frame stops being full-bleed → floating 430×880 card |
| **760px** (`@container`) | `lib/monogram-studio/markup.ts:86` | Monogram studio → two-column grid (the only container query in the app) |
| **940px** (max-height) | `onboarding-desktop.css:156` | "Short desktop" — top-align + scroll so the 880px card isn't clipped |
| **640px** (`Math.min(W,H)<640`) | `rigid-webgl.tsx:91` | STD reveal GPU-quality flag (downsample shadow/DPR) — not a layout change |

### 1c. JS pixel thresholds (hard-coded, no constants)
| Value | File:line | Branches |
|---|---|---|
| `min-width:1024` | `desktop-redirect.tsx:26` (×2), `spatial-backdrop.tsx:69` | desktop redirect off `/more`; load journey video |
| `max-width:1023` | `seating-editor.tsx:475` | default to list view |
| `max-width:767` | `seating-editor.tsx:484` | table edit → bottom sheet (vs popover) |

**Finding:** if a future refactor wants one source of truth, the JS values to consolidate are **1024 / 1023 / 767 / 640**.

---

## 2. Viewport, meta, PWA, dark mode

### 2a. Viewport — `app/layout.tsx:401-407` (single export for the whole app)
```ts
export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,        // pinch-zoom kept ENABLED for WCAG 1.4.4 (deliberate)
  viewportFit: 'cover',   // makes env(safe-area-inset-*) resolve to real notch values
};
```
- No nested layout overrides it.
- iOS focus-zoom guard: `(pointer: coarse)` forces 16px inputs (`globals.css:902`).

### 2b. PWA manifest — `public/manifest.json`
| Field | Value |
|---|---|
| `display` | `standalone` |
| `orientation` | `any` (not locked to portrait) |
| `theme_color` / `background_color` | `#FAF7F2` ⚠ **mismatches** viewport `#FFFFFF` |
| `lang` | `en-PH` |
| icons | SVG 192/512 + one maskable PNG 512 (no per-res raster set) |

### 2c. Dark mode
- App is **always-light** by design (`darkMode:'class'`, single white `themeColor`, no dark `prefers-color-scheme` variant in app).
- OS `prefers-color-scheme: dark` is honored in **exactly one place**: the static keynote decks (`public/keynote/styles.css:54`).

### 2d. Image responsiveness — `next.config.ts`
- `deviceSizes: [640, 750, 828, 1080, 1200, 1920]` (`:209`) — the two largest defaults (2048/3840) dropped.
- `formats: ['image/webp']` (AVIF dropped on cost). `imageSizes` left at Next defaults.

---

## 3. Safe-area & viewport-height units

| Item | Where | Value |
|---|---|---|
| Docked-subnav clearance | `globals.css:352` | `padding-bottom: calc(env(safe-area-inset-bottom) + 8.5rem)` — cancelled `≥1024px` (`:354`) |
| Onboarding full-height | `onboarding.css:28` | `height:100vh; height:100dvh;` — **the only `100dvh` in the whole app** |
| Onboarding bottom bar | `onboarding.css:46` | `calc(18px + env(safe-area-inset-bottom))` |
| BottomNav float | `bottom-nav.tsx:675` | `bottom-[calc(env(safe-area-inset-bottom)+12px)]` |
| Chat columns | `messages/[threadId]/page.tsx` | `h-[calc(100dvh-12rem)]` |

**Findings:** No `svh`/`lvh` anywhere. `100dvh` used in only ~3 spots. `env(safe-area-inset-*)` handled on BottomNav + SubNav + a few sheets, but **most inline bottom sheets do NOT pad for safe-area** (§6).

---

## 4. JS / runtime responsive logic

### 4a. The headline: there is no shared responsive layer
- **No** `useMediaQuery` / `useIsMobile` / `useBreakpoint` / `useWindowSize` — these hooks do not exist.
- **No** named breakpoint constants. Every threshold is an inline magic number.
- The only reusable hook is `usePrefersReducedMotion()` (local to `bottom-nav.tsx:113`), and the reduced-motion query is hand-inlined in ~16 other files.

### 4b. `matchMedia` breakpoint queries
| File:line | Query | Gates |
|---|---|---|
| `desktop-redirect.tsx:26` (couple + vendor) | `(min-width:1024px)` | bounce desktop users off mobile-only `/more` |
| `seating-editor.tsx:475` | `(max-width:1023px)` | default to list view |
| `seating-editor.tsx:484` | `(max-width:767px)` | `isPhone` → bottom sheet |
| `spatial-backdrop.tsx:69` | `(min-width:1024px)` | load parallax journey video (desktop only) |
| `client-type-detector.tsx:37-38` | `(display-mode: standalone/minimal-ui)` | PWA detection |

### 4c. Native-shell vs web (the real structural fork — UA/cookie, not width)
- `detectClientType()` → `capacitor|tauri|pwa|web` cookie (`client-type-detector.tsx:7`).
- `getRequestPlatform()` → `web|ios|android` server-side (`lib/request-platform.ts:29`).
- `middleware.ts:269` — native clients hitting marketing routes get a **307 → /dashboard or /login** (app shell skips the brochure).
- `inline-checkout-drawer.tsx:142` — native UA opens checkout in the **external browser** (App Store compliance), renders a different button tree.
- **No** `sec-ch-ua-mobile` / viewport cookie — the server has **zero knowledge of screen width**; all width responsiveness is client-only (which is why the desktop-redirects exist).

### 4d. Network/capability adaptation (not viewport, flagged for completeness)
- `navigator.connection.saveData` / `downlink` thresholds (`>=5`→strong, `>=1`→medium) skip videos / set sync mode (`spatial-backdrop.tsx:70`, `gallery.tsx:93`, `OfflineSyncProvider.tsx:168`).
- `devicePixelRatio` capped at 2 for canvas crispness (7 files). `lowRes` prop on veil reveal is **dead/unwired**.
- **No** `pointer:coarse`/`maxTouchPoints`/touch-vs-mouse branching — unified Pointer Events everywhere.

---

## 5. Navigation chrome — the `lg` switch

**One mechanism repeated everywhere:** two independent self-hiding components, no JS, pure Tailwind.
- **Mobile (<1024):** floating frosted-pill `BottomNav` (`lg:hidden`) + optional docked `SubNav` (`lg:hidden`). Sidebar is `hidden`.
- **Desktop (≥1024):** fixed left `SidebarShell` rail (`hidden lg:flex`). BottomNav + SubNav vanish.

### 5a. BottomNav — `app/_components/nav/bottom-nav.tsx` (owner-locked, lint-guarded)
- Visibility: `...lg:hidden` (`:675`). `fixed`, inset `left-[14px] right-[14px]`, floats `12px` over safe-area, `z-30`.
- Height ~64px, published to `--sn-bottomnav-h` via ResizeObserver. Dev warn if >6 tabs.
- Per-doorway tabs (overlaid by admin `/admin/menus` registry):

| Doorway | Tabs |
|---|---|
| Customer (phase-aware, `lib/customer-menu.ts`) | Plan: Home·Guests·Explore·Studio·Budget · Day-of: Now·Check-in·Seats·Services·Schedule · After: Home·Review·Editorial·Galleries |
| Vendor | Home·Bookings·Calendar·Messages·Website·More (agents get Home+More only) |
| Admin | Home·Work·Directory·Money·Insights·More |
| Account `(account)` | **No bottom nav** (by design) |

### 5b. Sidebar / top bar — `app/_components/nav/sidebar-shell.tsx`
- Sidebar: `hidden lg:fixed lg:flex` (`:114`). Does **not** become a drawer on mobile — fully hidden, BottomNav takes over.
- Desktop collapse: localStorage `setnayan.nav.sidebar.collapsed`; `16rem` ⇄ `4rem` rail; labels hide via `[data-sidebar-collapsed]`.
- Top bar: `sticky top-0 z-20`, shown on **all** viewports, hide-on-scroll-down / reveal-on-scroll-up (`useHideOnScroll`). AccountSwitcher pill is `lg:hidden` (mobile uses sidebar).

### 5c. Marketing header — `site-nav.tsx` / `_nav-mobile.tsx`
- Mounted once in root layout (no remount flash). Links `hidden lg:flex` (`:126`); "Sign in" `hidden lg:inline`; "Start planning" always visible; hamburger `lg:hidden` (`_nav-mobile.tsx:18`).
- Legacy `SiteHeader` (still on `/weddings`, `/download`, `/waitlist`): nav `lg:flex`, **search `hidden xl:block`** (`:137`), hamburger → `<Sheet>`.
- Non-sticky on `/explore` (it owns its own bar).

### 5d. Sub-menus
- **SubNav** (`sub-nav.tsx:111`) — second floating pill, `lg:hidden`, docks above BottomNav via measured `--sn-bottomnav-h`. Children are `flex-1` (no scroll, relies on ≤5). On desktop the same children render as **nested sidebar rows**. SSOT = `lib/customer-menu.ts`.
- **FeaturesAnchorNav** (`_AnchorNav.tsx`) — horizontal `overflow-x-auto`, active pill `scrollIntoView(center)`.
- **StickyMarketplaceHeader** (`sticky-marketplace-header.tsx:190`) — `fixed bottom-0` (thumb-zone) on mobile → `sm:sticky sm:top-0` on desktop. **Pivots at `sm` (640), not `lg`.**

---

## 6. Interaction primitives (overlays) — the two patterns

Nearly every switch fires at **`sm` (640px)**.

### Pattern A — bottom sheet → right-side drawer
Container `fixed inset-0 flex items-end justify-center sm:items-stretch sm:justify-end`; panel `rounded-t-3xl w-full max-h-[90vh]` → `sm:h-full sm:w-[Nrem] sm:rounded-l-3xl`.
- `app/_components/sheet.tsx:79` (shared primitive — but **used in only ONE place**, `vendor-direct-pay.tsx`)
- `InlineCheckoutDrawer:248/259` (canonical checkout; `sm:w-[28rem]`)
- `cart-drawer.tsx:358`, `lock-modal.tsx:97`, `ChoosePlanSheet`

### Pattern B — bottom sheet → centered dialog card
Container `...items-end justify-center sm:items-center`; panel `rounded-t-2xl/3xl` → `sm:max-w-{sm|md|lg} sm:rounded-2xl`.
- `requirements-modal.tsx:97`, `ceremony-type-modal.tsx:83`, `new-manual-vendor-modal.tsx:328`, `quick-add-sheet.tsx:385` (desktop-only; mobile uses inline carousel), + ~10 more confirm modals.

### FilterDrawer — the only 3-stage primitive — `filter-drawer.tsx:189`
Mobile bottom sheet → `sm:` wider bottom sheet (`max-w-[480px]`) → `lg:` right full-height drawer (`max-w-[420px]`).

### Primitives with NO responsive switch (important)
| Primitive | Behavior at all sizes |
|---|---|
| `ConfirmDialog` (`confirm-dialog.tsx`) | Always centered `max-w-sm` card — **never** a bottom sheet, even on phone |
| Toast (`toast-provider.tsx:90`) | Always **bottom-center** — never moves to top-right on desktop |
| `ProfileMenu` / dropdowns | Always **anchored-absolute** — do NOT convert to bottom sheet on mobile |
| `ManualCheckoutModal` (Maya/QR) | Always centered `max-w-2xl` |
| Tooltips | Native `title` only — **invisible on touch**, no tap-to-show |
| Date/select | Native `<input type=date>` / `<select>` — OS picker, no coded switch |
| Command palette | **None exists** |

**Cross-cutting:** no drag-to-dismiss / snap points anywhere; body-scroll-lock re-implemented per component; safe-area padding only on `sheet.tsx` + `requirements-modal.tsx` (most sheets omit it).

---

## 7. Page-layout responsiveness

### 7a. Marketing — TWO competing systems coexist
| System | Where | Container | Type | Rhythm |
|---|---|---|---|---|
| **A — `--m-*` clamp-native** | homepage `_sections.tsx`, `/for-vendors`, our-story | `max-w-[1100px]` + `px-5 sm:px-8 lg:px-14` (or `.m-section` clamp) | inline `clamp()` + `.m-h-xl/lg/md` utils (used by `_sections.tsx` ONLY) | `.m-section` clamp `padding-block: clamp(64px,11vw,120px)` |
| **B — Tailwind-step** | `/pricing`, `/features`, `/about`, `/download`, `/how-it-works`, `/blog`, `/realstories`, `/explore` | `max-w-6xl`/`max-w-5xl` + `px-4 sm:px-6 lg:px-8` | `text-3xl sm:text-4xl` steps | `py-16 sm:py-20` |

- **House grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (the repeated convention). System-A often uses `1024`-only or `repeat(auto-fit, minmax(260px,1fr))`.
- **Pricing:** no HTML table — restacking card grids (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`). The real comparison table is the **vendor pricing matrix** — hard swap at exactly `1024`: 5-col grid (desktop) ⇄ sticky tier-switcher + 2-col list (mobile).
- **Sticky mobile CTA:** canonical `_StickyMobileCTA.tsx:38` (`fixed inset-x-0 bottom-0 sm:hidden` + safe-area, after 60vh scroll) — but lives **only on `/features`**; `/explore` reimplements a competing one.

### 7b. Dashboard shell — `SidebarShell` (all 4 doorways)
- Desktop offset: `<main className="lg:pl-[var(--shell-main-offset)]">` where var = `4rem`/`16rem` (`sidebar-shell.tsx:221`).
- `--sidebar-width` is **referenced but never defined** → always falls back to `16rem`.
- Canonical content wrapper: `pb-20 lg:pb-0` (reserve mobile bottom-nav) + `mx-auto w-full px-4 py-6 sm:px-6 lg:px-8`.
- Vendor/admin cap topbar width (`max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl`); couple side does not.

### 7c. Onboarding — the textbook mobile-first → desktop-enrichment model
| Breakpoint | File | Effect |
|---|---|---|
| `<480px` (base) | onboarding.css | `.phone` full-bleed `100dvh`, no chrome |
| `min-width:480px` | onboarding.css:30 | `.phone` → floating 430×880 card (radius/border/margin) |
| `min-width:1024px` | onboarding-desktop.css:20 | additive editorial `.onb-aside` appears; centers [aside · phone]; phone pinned 430px |
| `1024px & max-height:940px` | onboarding-desktop.css:156 | short-desktop: top-align + `overflow-y:auto` |
Mobile+tablet are byte-for-byte the locked prototype; desktop is purely additive.

### 7d. Dashboard grids (sm-dominant)
Representative — full table in agent report:
| Surface | Pattern |
|---|---|
| Budget summary | `grid-cols-1 sm:grid-cols-3` |
| Stats rows | `grid-cols-2 sm:grid-cols-4` |
| Admin overview | `sm:grid-cols-2 lg:grid-cols-3` |
| Vendor home KPIs | `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` |
| Forms (dominant) | `grid grid-cols-1 gap-N sm:grid-cols-2` (~31 files) |
| Vendor calendar | `grid-cols-7` — **no mobile fallback** (cramped on phones) |

### 7e. Seating editor (two JS breakpoints)
- `max-width:1023` → default **list** view (chair canvas unusable on phone).
- `max-width:767` → table edit becomes **bottom sheet** (vs popover beside table).

### 7f. Tables in dashboards
Mechanism = **`overflow-x-auto` + `min-w-[…]`** with columns hidden via `hidden md:table-cell` / `lg:table-cell`. **No** table stacks rows into cards on mobile.

### 7g. Couple public event site `app/[slug]/`
- Root `min-h-dvh`; content `mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14` (phone-narrow centered column on desktop). STD film mode is full-bleed.
- Reveal/film geometry adapts **continuously via JS measurement** (orthographic-camera aspect; `fitScale = clamp(0.6, min(cw/440, ch/780), 2.3)`), NOT by breakpoint. Only hard cutoff = the 640px GPU-quality flag.
- Hero media: mobile full-bleed `-mx-4 sm:-mx-0`.

---

## 8. Quick-reference: which breakpoint does what

| Breakpoint | What flips at it |
|---|---|
| **480px** | Onboarding phone frame: full-bleed → floating card |
| **640px (`sm`)** | Grids 1→2 col · forms 1→2 col · sheet→dialog/drawer · marketplace bar bottom→top · `_StickyMobileCTA` hides · vendor pricing tier-switcher top offset |
| **760px** | Monogram studio → 2-col (container query) |
| **767/768px (`md`)** | Seating table sheet→popover (767) · a handful of split panes — otherwise the orphan breakpoint |
| **1024px (`lg`)** | **MASTER:** BottomNav⇄Sidebar · hamburger⇄inline nav · subnav-clearance off · seating list→plan · journey video on · vendor pricing matrix 5-col · onboarding aside on |
| **1280px (`xl`)** | Legacy SiteHeader search · explore 4-up tiles · vendor/admin topbar cap |
| **940px (max-h)** | Onboarding short-desktop scroll fallback |

---

## 9. Inconsistencies & drift to resolve in the ruleset pass

These are the gaps a canonical rule should close (each is a real, cited finding):

1. **Two marketing type/spacing systems** coexist site-wide (`--m-*` clamp vs Tailwind-step). Pick one canon.
2. **`.m-section` / `.m-h-xl/lg/md` clamp utilities exist but are used by ONE file** (`_sections.tsx`). Either adopt site-wide or retire.
3. **Grid 1→2-col switch fires at `sm` on some sections, `lg` on others** — no rule.
4. **`md` (768) is an orphan breakpoint** — nearly unused. Decide if mobile/desktop is a 2-tier (sm/lg) or 3-tier system.
5. **No shared responsive hook / no breakpoint constants** — 1024/1023/767/640 are scattered magic numbers.
6. **`theme_color` mismatch:** manifest `#FAF7F2` vs viewport `#FFFFFF`.
7. **`--sidebar-width` referenced but never defined** (always falls back to `16rem`).
8. **Two independent fixed-bottom-bar implementations** (`_StickyMobileCTA` on /features vs marketplace header) — no shared mobile-CTA primitive.
9. **`Sheet` primitive used once;** every other sheet/drawer re-implements the container inline → drift risk.
10. **Safe-area padding inconsistent** across bottom sheets (only 2 of ~10 pad for the home indicator).
11. **`ConfirmDialog` never becomes a bottom sheet** and **Toast never repositions on desktop** — they opt out of the otherwise-universal sm-flip convention. Decide if that's intentional.
12. **Vendor calendar `grid-cols-7` has no mobile fallback** — cramped on phones.
13. **`/for-vendors` `page-tail` hard-codes non-fluid `56px`/`120px` padding;** `/setnayan-ai` uses flat `px-5` + non-token hex colors — both break the fluid/token conventions.
14. **No `svh`/`lvh`;** `100dvh` used in only ~3 places — mobile full-height handling is ad-hoc.
15. **Server has zero width knowledge** (no client hints) — all width responsiveness is client-side, forcing JS desktop-redirects to patch CSS-hidden mobile surfaces.

---

*Next step: turn §1–§8 into a canonical desktop↔mobile ruleset and resolve §9.*
