# App-Wide Atelier-Glass Rollout Plan — 2026-07-15

> **Author:** Fable (design lead) · **Implementer:** Opus, as phased PRs
> **Reference implementation:** the four-surface home at `apps/web/app/dashboard/(launcher)/` (branch `claude/home-fidelity` worktree `/Users/icecasasola/setnayan-wt-home-polish`) + the fidelity spec (`fidelity-gaps.md`, session scratchpad) — those two together are the canonical values wherever this plan says "canon."
> **v2 design prototypes (2026-07-15, permanent — the per-surface visual references for PR-2..9):** `prototypes/event_dashboard_v2_2026-07-15.html` (consumed by PR-2 #3256 + PR-3) · `prototypes/vendor_dashboard_v2_2026-07-15.html` (PR-6/7) · `prototypes/admin_hq_v2_2026-07-15.html` (PR-8/9) · `prototypes/user_home_final_2026-07-15.html` (launcher canon, shipped as PR-0 #3247). Translate the design, keep the page's real data — proto sample strings never ship.
> **Scope amendment (owner, 2026-07-15):** this is a **full redesign in place**, not a skin — "fix the design and not place a skin on top of it … full animation and transitions to make everything seamless and alive." This supersedes the 2026-07-12 "skin-only reskin" framing. Preserved invariants: existing **routes** (fix pages in place, never parallel v2 pages), data/actions/copy-facts, honesty rules (real data, no fake doors), feature flags, per-page functionality. Free to change: composition, section order, hierarchy, component shapes, motion.
> **Hard exclusions (owner locks):** guest-facing event sites (`app/[slug]`, the guest-tree editorial scope in globals.css) and the marketing site keep their editorial system. Nothing in this plan may leak into them (see § 6 R5 for the shared-class hazard).

---

## 0. Ground truth — what exists today (all paths under `apps/web/`)

| Layer | State | Evidence |
|---|---|---|
| **Kit tokens** | Complete and correct. `--sn-gold-500 #A9834B` · `--sn-ink-900 #1B1A17` · warm semantics (`--sn-warning #B77E2E`, `--sn-success #5E7C52`, `--sn-info #4E6C82`, `--sn-danger #A6483B`) · radii 6/10/14/18 · warm shadows · motion vars (`--sn-ease .2,.7,.2,1` · `--sn-ease-out .16,1,.3,1` · durs 120/200/320/640ms) | `globals.css` ~2835-2885 |
| **Kit classes** | Defined, **almost entirely unconsumed**: `.sn-card/.sn-btn/.sn-input/.sn-chip/.sn-badge/.sn-reveal/.sn-modal/.sn-scrim/.sn-acc/.sn-skeleton` have **zero consumers**. Only `.sn-ambient` + `.sn-sidebar` are live (via `SidebarShell`). | grep audit; `app/_components/nav/sidebar-shell.tsx:117,126` |
| **Ambient** | `.sn-ambient { background:#ffffff }` — the 2026-07-13 white-flatten. The launcher paints its own inline wash (weaker than canon). | `globals.css:2905`; `(launcher)/layout.tsx:64-72` |
| **Chrome** | Sidebar + topbar are already frosted glass everywhere `SidebarShell` runs (event, vendor, admin): sidebar `rgba(255,255,255,.45)` blur(24px) sat(1.5); topbar `rgba(255,255,255,.55)` blur(18px) sat(1.4). | `globals.css:862-905`; `sidebar-shell.tsx:222-227` |
| **Live primitives** | `.button-primary` (~100 files) · `.button-secondary` (~66) · `.input-field` (~117) · `useModalA11y` (~40 consumers, behavior-only, panels hand-rolled) · `ToastProvider` (`app/_components/toast/toast-provider.tsx`). No shared `<Card>`; cards are bespoke inline Tailwind everywhere. | primitives audit |
| **Event dashboard** | `dashboard/[eventId]/layout.tsx` → SidebarShell. Content = `.m-card` **opaque** `#FBFAF7` cards, `m-serif` (Instrument Serif) headings, retired-wine `mulberry` gradients on the AI skin, `bg-cream` (= pure white since the token flip) section cards. 101 `page.tsx` routes. | `event-dashboard.tsx:822-895`; guests/vendors/schedule greps |
| **Account spokes** | `(account)/layout.tsx` = the launcher's slim top bar but **no ambient at all** (plain white), spoke pages = `max-w-2xl` + back-link + `text-3xl font-semibold` headers. 9 spokes. | `(account)/layout.tsx:63-82` |
| **Vendor dashboard** | Same SidebarShell. Home = `VendorEnergyStats` gold-left-rail white hero + KPI cluster + `WhatsNewFeed` + `OngoingTasks` + `UpcomingSchedules`. `m-serif text-4xl` H1. Residual `--v-blue #3F6EA5` accents. 53 routes. | `vendor-dashboard/page.tsx:217`; `overview-sections.tsx` |
| **Admin console** | Same SidebarShell but `accent="violet"` + live violet/purple islands (`--a-violet #6D28D9` badge dot, `bg-purple-100`, RefundForm `violet-700/800`). KPI numerals in **Saira Condensed**, not Space Mono. 32 literal `<table>`s + 100-row `<ul>` queues. 101 routes. | `admin/layout.tsx:132-133,231`; `payments/page.tsx:387,638,692` |
| **Motion today** | sn library exists (rise/fade/scale-in/blur-in/grow/donut/shimmer/pulse/ring/acc/skeleton + RM freeze) but pages are static; a View-Transition system exists **only** for the mobile bottom-nav slide (`.sn-vt-page`, globals ~1946-1970). No `template.tsx` anywhere. | `globals.css:2979-3026` |

The strategic read: **the tokens and the chrome are already the language; the page bodies are not.** This rollout is (a) turning the canvas warm again, (b) recomposing each surface's key pages the way the home was recomposed, (c) making the dormant kit the live primitive system, and (d) installing motion as a default, not an ornament.

---

## 1. THE SHELL LANGUAGE SPEC

The shared recipe every dashboard view follows. Opus: implement §§ 1.1-1.2 once, in globals.css + shared components (PR-1), then every page consumes them.

### 1.1 Ambient — ONE canvas, everywhere (DECISION)

**Decision: spread the warm wash. Redefine `.sn-ambient` to the canonical Atelier wash and let every shell inherit it** — event, vendor, admin (all via SidebarShell), launcher, and account spokes (add the class to their layout roots).

Canonical value (fidelity-spec canon, verbatim):

```css
.sn-ambient {
  background:
    radial-gradient(45% 55% at 18% 6%,  rgba(203,167,102,.32), transparent 60%),
    radial-gradient(55% 65% at 90% 22%, rgba(94,124,82,.10),  transparent 62%),
    radial-gradient(45% 60% at 86% 92%, rgba(78,108,130,.20), transparent 60%),
    linear-gradient(135deg, #EFEAE0, #E3DDCF 55%, #DDD6C6);
  background-attachment: fixed;
}
```

**Justification against the 2026-07-13 white-flatten:** (1) The physics of the language — `rgba(255,255,255,.5)` glass on `#ffffff` is invisible; this exact failure is the fidelity spec's top finding ("the page reads near-white, so the glass cards barely separate"). Glass *requires* a tinted backdrop; you cannot have the owner-approved home look on a white canvas. (2) The timeline — the flatten (07-13) predates the owner's approval of the home's wash (07-15, "owner-approved final home design") and predates today's directive that the app should "feel similar when they enter event, vendor, admin dashboard and all the pages around it." The newest signed intent is the wash. (3) The launcher layout comment scoping the wash to the splash ("the white-flatten stands everywhere but this home splash") was written before the similarity directive; it is now stale. **This is still a formal reversal of a dated owner directive → surfaced for sign-off in § 6 R1. PR-1 ships it behind that sign-off.** No drift-blob animation on the wash — the static-wash deviation already recorded stands (infinite 72px-blur animation is a GPU tax we decline).

The launcher's inline style in `(launcher)/layout.tsx` is replaced by the same `.sn-ambient` class (one source of truth); `(account)/layout.tsx:64` gets `className="sn-ambient min-h-dvh"`.

### 1.2 The surface recipes (new/updated kit utilities — the only place these values live)

Add to the kit block in globals.css; update the two glass vars to canon (`--sn-glass-bg: rgba(255,255,255,.5)`, `--sn-glass-blur: blur(22px) saturate(1.5)`, `--sn-glass-line: rgba(255,255,255,.72)`); add `--sn-sh-tile: 0 18px 40px -26px rgba(30,26,18,.4)` and `--sn-sh-hi: 0 28px 54px -30px rgba(30,26,18,.5)`.

| Utility | Recipe | Use |
|---|---|---|
| `.sn-tile` | glass bg/line/blur (canon) · radius **20px** · padding 18px · shadow `--sn-sh-tile` · hover −3px + `--sn-sh-hi` @ 320ms `--sn-ease` | Non-navigating panels (Watch, Spaces, stat panels, form sections) |
| `.sn-card` | (exists — retune) same glass · radius **18px** · min-height where card-grid · hover **−4px** + `--sn-sh-hi` | Navigating/interactive cards (event cards, doorway cards) |
| `.sn-tile-dark` | `radial-gradient(70% 60% at 85% -10%, rgba(203,167,102,.16), transparent 60%), rgba(23,22,15,.82)` · blur(22px) sat(1.4) · border `rgba(255,255,255,.18)` · radius 20px · text `#F3ECDF` · shadow `0 26px 50px -28px rgba(23,22,15,.7)` | **The obsidian focal — max ONE per view** (§ 1.3) |
| `.sn-row` | `rgba(255,255,255,.72)` **NO blur** · hairline `rgba(30,26,18,.07)` divider or border-white/60 · radius 14px | Repeated list rows / table rows — the blur-budget fallback (§ 1.6) |
| `.sn-eye` | Hanken **10.5px w700 tracking .14em uppercase**; `#8A6B39` (gold-700) on glass, `#CBA766` (gold-300) on dark; 14px icon | Tile eyebrows — replaces every `font-mono text-[10px] tracking-[0.18em]` hand-roll |
| `.sn-h1` | Hanken **w800**, 36px (`text-4xl`), tracking −.03em, leading 1.02, `#1B1A17`; soft tail span `#8A857B` w700 | Page heroes. **`m-serif` is retired from all dashboard surfaces** (stays on guest/marketing) |
| `.sn-sec` | Section head: **16px w800 tracking −.015em sentence-case** ink + sibling 12px `#8A857B` sub | Section labels (replaces mono ALL-CAPS section labels, per fidelity canon) |
| Data face | **Space Mono for every numeral, date, %, ₱-amount, ID, count** — `font-mono` (already resolves to Space Mono under `.app-surface`). Kill the Saira-Condensed KPI numerals in admin. | app-wide rule, not a class |
| `.sn-btn*` / `.sn-input` / `.sn-chip` | Adopt the existing kit classes as the live primitives: re-point `.button-primary` → gold `--sn-gold-500` fill, hover gold-600 −2px lift + gold glow shadow; `.button-secondary` → 1.5px ink outline; `.input-field` → gold focus ring `0 0 0 3px var(--sn-gold-100)`. **Scope the re-point under `.app-surface`** so guest/marketing consumers are untouched (§ 6 R5). | one edit moves ~280 files' CTAs/inputs |
| `.sn-modal-panel` | `rgba(255,255,255,.85)` blur(30px) sat(1.5) · radius 18px · shadow `0 60px 100px -60px rgba(30,26,18,.6)`; scrim `rgba(27,26,23,.32)` blur(8px) `sn-fade` | The shared modal chrome all `useModalA11y` consumers migrate to |
| Toasts | Re-skin `toast-provider.tsx` panel to `.sn-row` + warm semantic border/icon (`--sn-success/-warning/-danger/-info`), slide-up entrance `sn-rise` 320ms | one file |
| Radius tokens | Add `rounded-tile` (20px) / `rounded-card` (18px) to `tailwind.config.ts` — the `lint:radius` guard forbids arbitrary `rounded-[Npx]`, so the kit radii must be named tokens (§ 6 R9) | config |

**Gold is jewelry, not paint:** exactly **one gold-filled primary action per view**; everything else secondary/ghost. Eyebrows, active states, focus rings, ring-fills = the gold family. Semantic colors carry status: warn `#B77E2E` on `#F6EAD2` · success `#5E7C52` · info-slate `#4E6C82` · danger `#A6483B`. **Violet is retired for real** (§ 3.4). Icons: Lucide, `strokeWidth={1.75}`.

### 1.3 The one-obsidian-focal rule — named per surface

At most one `.sn-tile-dark` per view. It is the emotional/priority center, always real data:

| Surface | The focal | Content |
|---|---|---|
| Launcher (`/dashboard`) | **Alaala tile** (shipped) | Life-Flash headline · lenses · Play |
| **Event Overview** | **"The Big Day" hero-tile** (new) | Countdown numeral (count-up, Space Mono 40px+) · date + venue · % planned ring sweep · when Setnayan AI is active, the **Suri briefing sentence + chips render INSIDE this tile** (gold-300 eyebrow "Suri · your briefing") — replacing the current retired-wine `from-mulberry-700` gradient strip so AI-on still has exactly one dark tile |
| Event section pages | **None** (all-glass) — except **day-of mode**, where the DayOfModeGrid's "happening now" card is the obsidian | keeps the focal rare and meaningful |
| Account spokes | Only **Setnayan AI** spoke: obsidian status tile (plan state · guards on watch). Other spokes: none | |
| **Vendor home** | **"Today at {shop}"** tile | inquiries waiting (count-up) · next booking date · earned this cycle (mono ₱) — the vendor twin of The Watch |
| **Admin home** | **"Exception Desk"** tile | open items across actionable lanes (count-up) + top-3 lane rows — reuses `getAdminQueueDigest` exactly as the launcher HQ signal does |
| Admin queue pages | None | density surfaces stay light |

### 1.4 Page anatomy (the recomposition grammar)

Every dashboard view follows the home's grammar: **greeting/eyebrow → `.sn-h1` hero (statement, not label) → hero stat line (real aggregates, mono numerals, hidden when zero) → [command/filter bar] → the focal or the primary work surface → glass tile bento → full-width continuation panels.** Status→Act→Navigate ordering (owner-approved council verdict 2026-07-12) is preserved wherever it already governs (event Overview).

### 1.5 Type + data rules

Hanken w800 for display, w700 for emphasis, w400-600 body. Space Mono for data (§ 1.2). Eyebrows per `.sn-eye`. Hairline dividers `rgba(30,26,18,.07-.08)`. Body ink ladder: `#1B1A17` / `#3A382F` / `#6E6A62` / `#8A857B`.

### 1.6 The blur budget (perf law)

- **Blur allowed:** fixed chrome (sidebar 24px, topbar 18px — shipped) · page-level `.sn-tile/.sn-card/.sn-tile-dark` — **cap ~8 blurred elements per viewport** · modals/⌘K (30px) · scrims (7-8px).
- **Blur banned:** repeated list rows, table rows/cells, any element in a >10-item collection, anything inside a scrolling virtualized list, and **nested glass** (children of a blurred panel are flat — one blur layer deep, ever).
- **Fallback:** `.sn-row`. Tables get ONE `.sn-tile` wrapper; `<table>` rows stay opaque (`bg-white/70`+hairlines). This is what keeps admin's 32 tables and 100-row queues cheap.
- **No infinite animation** except `sn-pulse`/`sn-ring` on genuinely live signals and `sn-skeleton` while loading. The ambient wash is static (no drift blobs — recorded deviation stands).

---

## 2. THE MOTION LANGUAGE

Everything reuses/extends the sn library (globals.css kit block). New keyframes land in PR-1: `sn-bloom` (rise+scale+staged-blur materialize, 1s, for the obsidian focal), `sn-lens-in` + `.sn-lens-swap` (tab/filter body cross-fade, .42s, staggered ×3), `sn-chip-pop` (.34s 9% overshoot on select), `sn-pop-in` (modal .38s), `.sn-press` (`:active { scale:.97 }` opt-in for `<Link>` cards — the global button rule doesn't match anchors), `.sn-live-dot` (`sn-pulse 1.9s infinite`), `sn-ring-sweep` (generalized `sn-donut` via `--sn-ring-circ`, per the fidelity spec's ProgressRing recipe).

**(a) Route transitions.** Add a **`template.tsx` per shell** — `dashboard/[eventId]/template.tsx`, `dashboard/(account)/template.tsx`, `vendor-dashboard/template.tsx`, `admin/template.tsx` — each a 3-line server component wrapping `{children}` in `<div className="sn-page-enter">`. New CSS: `.sn-page-enter { animation: sn-rise-soft 400ms both var(--sn-ease-out); } @keyframes sn-rise-soft { from { opacity:0; transform:translateY(8px); } }`. App Router remounts templates on **pathname** changes (the idiomatic entry-animation hook), so every in-shell navigation gets a soft rise; search-param changes (`?show=all`) do NOT remount — correct, filters shouldn't replay the entrance. The launcher keeps its richer hand-authored cascade instead of a template. **Interplay with the existing mobile View-Transition slide** (`.sn-vt-page` bottom-nav carousel): the 400ms rise plays inside the incoming pane during the slide — subtle enough to compound rather than fight; verify on mobile in PR-2 and, if it doubles visibly, suppress via `html:active-view-transition .sn-page-enter { animation:none }`.

**(b) Entrance choreography (per-page, above the fold only).** Cascade order: header (0s) → command/filter bar (+.08s) → focal (`.sn-bloom`, lands LAST at ~1.05s — the signature) → tiles/cards `.sn-reveal` +.08s each (cap 6 staggered; the rest paint with the 6th) → **below-fold content paints static** (no long-tail delays). Streamed Suspense content runs its own `.sn-reveal` on arrival.

**(c) Data motion.** Every headline numeral uses the **CountUp island** (`(launcher)/_components/count-up.tsx` per the fidelity spec — SSR renders the final value, rAF 0→value 1150ms easeOutCubic, RM bails) — promote it to `app/_components/count-up.tsx` in PR-1. ProgressRing gets the opt-in `sweep={{delayMs}}` prop (1.3s, synchronized with its CountUp). Bars use `sn-grow`; shimmer only inside a growing bar, once-ish (`sn-shimmer`).

**(d) Micro-interaction standards.** Hover: cards −4px, tiles −3px, buttons −2px, all 300-320ms `--sn-ease` + shadow deepen to `--sn-sh-hi`; rows slide `translateX(2px)` + arrow → gold. Press: universal .97 scale (buttons via the existing global rule; Link-cards via `.sn-press`). Chips: `sn-chip-pop` on select. Tab/lens/filter body swaps: `key`-remount + `.sn-lens-swap` (never a hard cut). Accordions: `.sn-acc` grid-rows (no height measuring). Modals: `.sn-scrim` fade + `sn-pop-in` panel. Toasts: rise in, fade out. **Pulse ONLY on genuinely live states** (unread bell, day-of live dot, active livestream, "quiet" watch dot).

**(e) List/stagger rules.** Stagger only the first **8** rows (+40ms each); rows 9+ appear with row 8. Re-sorts/filters get `.sn-lens-swap` on the container, not per-row animation. No entrance animation on paginated table loads.

**(f) Guardrails.** transform+opacity only (the library's stated law); the global RM freeze block + the sn-reveal RM rule cover everything, and any covering veil element (sn-veil pattern) additionally gets `display:none` under RM. Blur budget per § 1.6. No infinite background animation. Lighthouse is a **required CI check** — motion/blur regressions block auto-merge, which is our safety net (§ 6 R3).

---

## 3. PER-SURFACE AUDIT + REDESIGNED COMPOSITION

### 3.1 Event dashboard (`dashboard/[eventId]/`, 101 routes — the couple's most-lived surface)

**Chrome today:** `layout.tsx` → SidebarShell (`sn-ambient` white + frosted sidebar/topbar — already language-correct once the wash returns) + CustomerSidebar/BottomNav/NavFab/SectionSubnav. Chrome needs only: wash inheritance, the day-of "Planning" pill off `bg-cream` onto glass, `.sn-eye` treatment of sidebar section labels.

**Deltas:** (1) content cards are opaque `.m-card` `#FBFAF7`; (2) `m-serif` serif headings everywhere; (3) the AI skin uses retired-wine `from-mulberry-700 via-mulberry to-mulberry-600` gradients (half-broken since mulberry re-pointed to gold); (4) eyebrows are `text-terracotta` uppercase sans / mono hand-rolls, not `.sn-eye`; (5) KPI numerals serif not mono; (6) zero motion; (7) `bg-cream` section cards read pure white on white; (8) no focal; (9) radius drift (12/16/22px); (10) checkbox-styled toggles and mixed pill idioms.

**Redesigned composition — Overview (`_components/event-dashboard.tsx`):** preserve the owner-locked section ORDER (hero → bento → overlays → decisions → band → journey rail; Status→Act→Navigate) and every data source; recompose the expression:
- Hero → greeting line (13px, sentence case) + `.sn-h1` statement; stat line with mono count-up numerals in gold-700.
- **NEW focal: "The Big Day" `.sn-tile-dark`** directly under the hero — countdown count-up + date·venue (mono) + planned-% ring sweep; AI-active adds the Suri briefing sentence + glass chips inside it (retires the mulberry gradient strip AND the separate premium veil — the tile IS the premium presence; `sn-bloom` entrance). "Today's one thing" becomes a gold-hairlined `.sn-tile` right below (AI state).
- At-a-glance bento → four `.sn-tile`s, ring sweeps + CountUp, `.sn-eye` labels, mono numerals.
- Decisions board → `.sn-tile` group panels; decision items = `.sn-row` (no blur; they can be many); chip tones map to warm semantics; one gold primary CTA per group.
- Around-your-event band → `.sn-card` doorways (stretched-link pattern stays, #3188) with hover lift + arrow-gold shift.
- Journey rail → glass track, gold progress, stage dots `sn-pulse` ONLY on the current stage.
- Entrance: header → bento (staggered) → Big-Day bloom; below-fold (decisions/band/rail) static.

**Top sections:**
- **Guests** — the Living Roster composition is owner-built (2026-07-11) and stays; re-express: facet bar → `.sn-chip` row (pop on select, `.sn-lens-swap` on the roster body), roster rows → `.sn-row` (long list — no blur), sticky mobile filter strip → glass, header → `.sn-h1` + mono stat line, pax/confirmation bars → `sn-grow` + gold fills.
- **Vendors** — header to language; category progress → ring sweeps; vendor rows `.sn-row`; the Explore takeover keeps its own composition (Merkado spec) but consumes the same primitives.
- **Schedule** — recompose from flat list to: `.sn-h1` + "next up" glass strip (the imminent block, mono times) → timeline of `.sn-row` blocks with a gold now-line when day-of; propose/accept actions → kit buttons.
- **Budget/checklist and the rest** — recipe application (§ 5 PR-4) with the § 4 contract; recompose only pages that are stale flat lists.

### 3.2 Account spokes (`dashboard/(account)/` — library, people, profile, setnayan-ai, notifications, create-event, year, api-keys, life-flash)

**Chrome today:** launcher-consistent slim top bar, but **no ambient** (plain white) — `(account)/layout.tsx:64`. **Deltas:** no wash; `max-w-2xl` narrow columns with `rounded-md bg-ink/5` back-links; `text-3xl font-semibold` headers; flat bordered sections; zero motion.

**Treatment:** add `sn-ambient` to the layout root (one line — the spokes instantly sit on the home's canvas). Per spoke: back-link → ghost `.sn-chip`; header → eyebrow + `.sn-h1`; content sections → `.sn-tile` (spokes are low-density — tiles are safe); forms → `.input-field` (re-pointed) inside tiles; profile's tab strip → `.sn-chip` + `.sn-lens-swap`; notifications list → `.sn-row` feed with unread gold dot (`.sn-live-dot`); **setnayan-ai spoke gets the surface's only obsidian status tile**; create-event keeps its 3-question minimalist flow (owner-locked) inside a single centered `.sn-tile`. Template entrance via `(account)/template.tsx`.

### 3.3 Vendor dashboard (`vendor-dashboard/`, 53 routes)

**Chrome today:** SidebarShell (shared) + `vendor-sidebar.tsx` (VENDOR_NAV_GROUPS inline) + vendor bottom nav/FAB. **Deltas (agent-verified):** white ambient; opaque `.m-card`/`rounded-xl border bg-#fff` tiles; **no obsidian focal** (hero is a gold-left-rail white tile); `m-serif text-4xl` H1; data numerals Hanken semibold/serif not mono; residual `--v-blue #3F6EA5` (sidebar identity rail inset shadow `vendor-sidebar.tsx:329`, Overview reviews-legend dot `overview-sections.tsx:102`, CashFlow/next-payout eyebrows `overview-sections.tsx:344,357`); JetBrains-Mono 11px `.m-label-mono` eyebrows; 12px card radii; zero motion.

**Redesigned composition — vendor home (`page.tsx` + `overview-sections.tsx`):**
- Hero: eyebrow "Kumusta, {name}" + `.sn-h1` "Your shop, today." + mono stat line (inquiries · bookings · this-cycle ₱).
- **Focal: "Today at {shop}" `.sn-tile-dark`** — inquiries-waiting count-up + next booking + cycle earnings (mono ₱), Play-style gold CTA to the inbox. Replaces the gold-rail hero tile.
- KPI cluster → glass bento `.sn-tile`s, ring sweeps, Space Mono numerals, `.sn-eye` labels (retire `.m-label-mono`+`--v-blue` colorings → gold-700 on glass; blue data accents → info-slate ONLY where semantic).
- What's-new feed → `.sn-card`s (bounded count — blur OK) with tone-mapped semantic chips; Ongoing/Upcoming → `.sn-tile` panels with `.sn-row` items, mono date blocks.
- Entrance: header → KPI tiles → focal bloom; feed static.
- **Sections sweep** (customers hub, services, calendar, messages, subscription…): contract application; the customers hub's `--m-paper` body wrapper is removed (wash shows through); tables per blur budget.

### 3.4 Admin console (`admin/`, 101 routes — LAST, lightest)

**Chrome today:** SidebarShell with `accent="violet"` (`admin/layout.tsx:231` — resolves to gold already via the token remap, but the prop + `--a-violet` dot + `bg-purple-100 text-purple-800` Internal badge + RefundForm violets are live). **Deltas (agent-verified):** white ambient; opaque `.m-card`/cream rows; no focal; KPI numerals **Saira Condensed**; mixed Tailwind semantic scales (`warn-*/red-*/purple-*`) instead of warm semantics; heading drift (`m-display-tight` 700 vs raw `font-semibold`); 32 tables + 100-row queues (the perf hazard).

**Treatment (deliberately restrained — admin is a solo-operator tool):**
- Shell: wash inherits; **retire violet everywhere** — drop the `accent` fork (delete `sn-sidebar--violet` + `--a-violet`; Internal badge → info-slate `#4E6C82`/`#E2EAEF`; RefundForm violet-700/800 → ink primary + gold focus). Admin's identity = the ShieldCheck + "HQ" label, not a color fork (kit rule: gold is the only decorative color).
- **Home: focal "Exception Desk" `.sn-tile-dark`** (open actionable items count-up + top-3 lanes) above a glass lane bento (`.sn-tile` per lane, warm semantic tones, mono counts — Space Mono replaces Saira). This is a true recomposition of the KPI-cluster + action-queues gradient section.
- **Queue-page pattern** (payments, verify, disputes, …): `.sn-h1` header + filter `.sn-chip` row + ONE `.sn-tile` wrapper + `.sn-row` items / opaque table rows. **No per-row blur, no row entrance animation** — queues are work, not theater. Status pills → warm semantics.
- Long tail: contract application only; tables keep opaque rows.

---

## 4. THE COHERENCE CONTRACT (apply to EVERY page touched — "does this page speak the language?")

1. The page sits on `.sn-ambient` (inherited — no page-level opaque background wrappers like `bg-cream`/`--m-paper` blocking the wash).
2. Panels are `.sn-tile`/`.sn-card` (glass, 18-20px radius, warm shadow); repeated rows are `.sn-row` (no blur); ≤8 blurred elements in view; never nested blur.
3. At most ONE `.sn-tile-dark` focal, and only where § 1.3 names one; it carries real data.
4. Exactly one gold-filled primary action visible; gold elsewhere only as jewelry (eyebrows, active, focus, rings).
5. H1 is `.sn-h1` (Hanken w800 — no `m-serif` on dashboards); section heads are `.sn-sec`; eyebrows are `.sn-eye`.
6. Every numeral/date/%/₱/ID is Space Mono; headline counts use CountUp; rings sweep.
7. Status colors are the warm semantics (#B77E2E/#5E7C52/#4E6C82/#A6483B) — no red-*/purple-*/violet-*/blue one-offs.
8. Entrance: template rise + above-fold cascade (≤6 staggered, focal blooms last); below-fold static; interactive things lift/press; tab-swaps cross-fade; pulse only on genuinely live.
9. Honesty: real data or nothing (hidden-when-zero, no fabricated urgency, no dead doors); copy-facts, routes, actions, flags unchanged.
10. Excluded scopes untouched (`app/[slug]`, guest-tree editorial, marketing); reduced-motion verified (freeze/none, veils `display:none`); `lint:radius` clean (named radius tokens only).

---

## 5. PHASED PR PLAN (ordered; each per-surface-atomic, coherent at every intermediate state)

Auto-merge stays the default; Lighthouse + build are the required gates. "S/M/L" = review size.

| # | Size | Scope | Files (primary) |
|---|---|---|---|
| **PR-0** *(in flight)* | M | Home fidelity — the full fidelity-gaps.md punch-list on the launcher (branch `claude/home-fidelity`). Lands the canonical values this plan references. | `(launcher)/*` + kit additions it already specifies |
| **PR-1** | **M** | **Foundation** (gated on § 6 R1 sign-off): `.sn-ambient` wash · glass-var canon · `.sn-tile/.sn-tile-dark/.sn-row/.sn-eye/.sn-h1/.sn-sec/.sn-modal-panel` · motion additions (§ 2 list + `sn-rise-soft`) · radius tokens · `.button-primary/.button-secondary/.input-field` re-point **scoped under `.app-surface`** · toast reskin · CountUp → `app/_components/count-up.tsx` · ProgressRing `sweep` prop · violet retirement (tokens + `accent` prop + admin badge/RefundForm) · launcher layout swaps inline wash for the class. The whole app warms up at once, coherently, before any recomposition. | `globals.css`, `tailwind.config.ts`, `sidebar-shell.tsx`, `toast-provider.tsx`, `progress-ring.tsx`, `admin/layout.tsx`, `(launcher)/layout.tsx`, `(account)/layout.tsx` |
| **PR-2** | **L** | **Event Overview recomposition + event shell polish** (highest traffic — couples live here): Big-Day obsidian focal, glass bento, decisions board, doorways band, journey rail, mulberry-gradient retirement, `[eventId]/template.tsx`, day-of pill + sidebar label polish. | `event-dashboard.tsx`, `[eventId]/page.tsx`, `[eventId]/layout.tsx`, `progress/_components/journey-rail.tsx`, new `template.tsx` |
| **PR-3** | **L** | **Event core sections**: Guests (Living Roster re-expression), Vendors, Schedule, Budget, Checklist — recomposed headers/heroes, glass panels, `.sn-row` lists, chips + lens-swaps, motion. | `guests/`, `vendors/`, `schedule/`, `budget/`, `checklist/` pages + their `_components` |
| **PR-4** | **M** | **Event long tail** (~40 remaining routes): § 4 contract application sweep; recompose only stale flat-list pages (messages, seating index, studio/design indexes, orders). Split 4a/4b if review size balloons. | remaining `[eventId]/**/page.tsx` |
| **PR-5** | **M** | **Account spokes**: ambient on the layout, per-spoke hero recomposition, setnayan-ai obsidian, profile chips/tabs, notifications feed, `(account)/template.tsx`. | `(account)/layout.tsx` + 9 spoke trees |
| **PR-6** | **L** | **Vendor shell + home recomposition**: "Today at {shop}" focal, glass KPI bento, feed cards, `--v-blue` retirement, `vendor-dashboard/template.tsx`, vendor sidebar identity card on glass. | `vendor-dashboard/page.tsx`, `overview-sections.tsx`, `vendor-sidebar.tsx`, new `template.tsx` |
| **PR-7** | **M** | **Vendor sections sweep** (52 remaining routes): customers hub recomposed (drop the `--m-paper` wrapper), services/calendar/messages/subscription to contract; tables per blur budget. | `vendor-dashboard/**/page.tsx` |
| **PR-8** | **M** | **Admin shell + home + queue pattern**: Exception-Desk focal, lane bento, Space-Mono KPIs, the queue-page pattern applied to payments/verify/disputes, semantic-scale swap, `admin/template.tsx`. | `admin/page.tsx`, `kpi-stat-card.tsx`, `_overview-tile.tsx`, `payments/`, `verify/`, `disputes/`, new `template.tsx` |
| **PR-9** | **M** | **Admin long tail** (~95 routes, lightest pass): contract sweep, tables stay opaque-rowed, headings/eyebrows/pills normalized. Mechanical; recomposition only where a surface is a bare unstyled list. | `admin/**/page.tsx` |

**Ordering justification:** foundation first because the ambient + primitives shift is global and harmonizes old-opaque and new-glass pages during the transition (opaque `#FBFAF7` cards on the warm wash read as intentional paper-on-paper, so mid-rollout states stay coherent). Event surface next — it's where couples spend their time. Spokes before vendor because they're one click from the finished home (the contrast is jarring today). Admin last and lightest per the brief. Each PR ships a changelog fragment; PR-1 + PR-2 also log the two decisions (§ 6 R1/R2) in `DECISION_LOG.md`.

---

## 6. RISKS + OWNER SIGN-OFFS

- **R1 · White-flatten reversal (SIGN-OFF REQUIRED).** § 1.1 spreads the warm wash app-wide, formally reversing the owner's 2026-07-13 "plain white" directive (`globals.css:2900-2905`). My design ruling: the wash is a precondition of the glass language the owner approved on 07-15 and of "feel similar everywhere." **PR-1 does not merge until the owner confirms.** Fallback if declined: glass panels swap to `.sn-row`-style tints app-wide (the language survives, diminished).
- **R2 · Scope amendment supersedes the skin-only lock.** Owner 2026-07-15: full redesign + full motion supersedes the 2026-07-12 "skin-only" reskin framing. Log as a `DECISION_LOG.md` row with PR-1. Guest-site exclusion and all data/copy/route invariants still stand.
- **R3 · Blur + motion perf.** backdrop-filter on low-end Android is the top hazard; the § 1.6 budget (chrome + ≤8 panels, never rows/tables, one layer deep) plus transform/opacity-only motion is the mitigation. **Lighthouse is a required check** — it gates every auto-merge; if a surface regresses, reduce panel blur to the `.sn-row` fallback rather than overriding CI.
- **R4 · Admin density vs glass.** 32 tables + 100-row queues: the queue pattern (one glass wrapper, opaque rows, no row animation) is load-bearing — Opus must not "helpfully" glass the rows.
- **R5 · Shared-class bleed into excluded scopes.** `.button-primary` (~100 files) and `.input-field` (~117) are consumed on guest/marketing surfaces too. The PR-1 re-point MUST be scoped under `.app-surface` (dashboards only); verify `app/[slug]` renders byte-identical before merge.
- **R6 · Token aliasing debt.** `terracotta`/`mulberry`/`warn-*` all resolve to gold by remap; page code still says the old names. Keep the name-preserving remaps through this rollout (mass renames would bloat every PR); schedule a mechanical rename sweep after PR-9.
- **R7 · The AI "premium skin" is already half-broken** — `from-mulberry-700 via-mulberry to-mulberry-600` gradients now interpolate across re-pointed gold values (`event-dashboard.tsx:895,945,1069`). PR-2's obsidian-focal recomposition is also the bug fix; don't patch it separately.
- **R8 · View-transition interplay.** The mobile bottom-nav VT slide + the new template rise could compound; § 2(a) carries the test + suppression rule. Also verify `useHideOnScroll` topbar behavior over the new wash (fixed-attachment background + sticky blur is fine, but test iOS Safari).
- **R9 · `lint:radius` guard** forbids arbitrary `rounded-[Npx]` — kit radii must land as named Tailwind tokens (PR-1) or the fidelity-spec's literal `rounded-[18px]` recipes will fail lint.
- **R10 · Suspense + entrance.** Streamed tiles (AlaalaTile pattern) animate on arrival — acceptable; but never gate LCP content behind a >200ms animation delay (the focal's 1.05s bloom is opacity-from-0 on a below-hero element, not the LCP).
