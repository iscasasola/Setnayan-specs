# Claude Design Brief — App-Like Reskin, All Four Surfaces (2026-07-31)

> **Owner ask (2026-07-31):** *"redesign the whole website, add animations, make it into a full blown
> app-like experience instead of a website/google sheet like experience."*
> **Scope answered by owner:** all four surfaces · **stay inside the locked design system.**
>
> This is a **design brief to paste into Claude Design**, plus the port contract for Claude Code.
> Verified against `origin/main` @ `c626d7686` (2026-07-31), not against specs.

---

## 0 · RULE 0 — what exists, what is missing, the delta

**Exists.**
- **The animation stack is already installed and it is a serious one:** GSAP `3.13` + `@gsap/react`,
  three.js `0.184` + `@react-three/fiber` + `drei` + `postprocessing`. There is **no framer-motion**.
- **A shared motion grammar exists** — `_components/marketing/_motion.tsx` (`Reveal`, `Blob`) and
  `_pa-motion.tsx` (`LineRevealHeading`, `RevealBand`, `RevealList`, `HowItWorksPanel`).
- **App-shell primitives already ship:** `_components/sheet.tsx`, `nav/bottom-nav.tsx`, `nav/sub-nav.tsx`,
  `nav/nav-slide-controller.tsx`, `app-init-splash.tsx`, `account-switcher/`.
- **The homepage `/` is already cinematic** — no-scroll gate + 5-pillar dock + interactive pillar widgets
  + Real Stories + kinetic ticker + four nav overlays, ported from `Home_ELN_Reskin_2026-06-28.html`,
  owner-approved 2026-06-29.

**Missing.**
- **Coverage, not capability.** Only **15 of 37** top-level public pages use the motion helpers.
- **45 files render a raw `<table>`** — and **~30 of them are `admin/*`**. That is the literal
  "Google-sheet-like experience."
- **No route-transition layer, no shared app shell across the logged-in surfaces.** Every dashboard route
  is a fresh full-page server render with no continuity between them. This — not the styling — is the
  single biggest reason the product reads as *website* rather than *app*.

**The delta.** Keep every token, font, and colour. Change **layout, continuity, and motion**. Design
**~12 screen archetypes**, not 401 screens.

---

## 1 · The hard constraints — do NOT change these

**⚠ PALETTE SUPERSEDED 2026-07-31 (owner):** *"background color like facebook which is white, then mandarin
orange and gold buttons/highlights."* This **breaks the `Atelier + glass = FINAL` lock** (gold-only accent,
warm alabaster) and reverses the "stay inside the lock" answer given earlier the same day. Recorded as a
deliberate supersede. **Typography is untouched and remains locked.**

```
FONTS      Hanken Grotesk   (the UI family — all weights)          ← UNCHANGED, still locked
           Space Mono       (kickers, labels, numerals, .14em uppercase tracking)
           ⚠ No other family. Four were deliberately REMOVED to cut font payload.
           Do not introduce Instrument Serif, Cormorant, Manrope, Saira, Geist, JetBrains.

CTA        mandarin  #F37A1F   button fills, primary actions        (slot: `mulberry`)
           hover     #D9600A
           label     #1B1A17   ← INK, NOT WHITE. White on mandarin = 2.76:1, FAILS AA.
                                 Ink on mandarin = 6.31:1, passes.
           deep      #B44F06   orange TEXT on white = 5.17:1 ✓ · links, small elements
           dark mode #FF8A3D   (7.73:1 on #17160F) · hover #FFA05C

HIGHLIGHT  gold      #A9834B   selected states, active tabs, borders, rules, pills   (slot: `terracotta`)
           soft      #F3ECDF   light  /  #2A2E36  dark
           dark mode #CBA766   (7.99:1)
           ⚠ 3.48:1 on white — LARGE TEXT AND UI ONLY. Never gold body text.

SURFACE    light   page #F0F2F5   card #FFFFFF     ← the Facebook two-tone
           dark    page #17160F   card #1E2229
           ⚠ Today the app is the INVERSE: page is already pure #FFFFFF with warm
             #f4f2ec cards. Facebook's page is GREY and its cards are white.

INK        light  #1B1A17 (17.4:1 on white · 15.5:1 on #F0F2F5)   soft  #4F535B
           dark   #FBFAF7                                          soft  #B6B9BE
```

**Both themes are mandatory.** Every archetype must be designed light *and* dark — the app ships a
runtime theme picker and the Alaala surfaces are obsidian by design.

**Brand:** SETNAYAN, spelled in full, never STNYN. Kicker phrase: *Set na 'yan.*

### 1a · Why this is two jobs, not one

- **Cheap (2 token values, ~0 component churn).** `terracotta` (accent) and `mulberry` (CTA) are already
  two distinct semantic slots that today hold the **same** gold value `169 131 75`. Point `mulberry` at
  mandarin and leave `terracotta` gold: **239 CTA files** turn orange and **410 / 570 / 358** highlight
  files stay gold, automatically. No component edits.
- **Expensive (a sweep, not a swap).** `paper` is aliased to `cream` in `tailwind.config.ts`, so **page
  background and card surface are one token**. The Facebook two-tone requires splitting them, which means
  auditing **396 `bg-cream` uses** to classify each as page-or-card — plus **337 files that hardcode
  `bg-white`** and will not follow a token change.

**History the owner should know:** a Facebook palette already shipped **2026-05-22** (light `#FFFFFF` +
blue `#1877F2`) and was **retired 2026-05-30** — recorded in `globals.css` lines 110–114. This is not a
straight revert (orange + gold ≠ Facebook blue), but the territory has been visited.

---

## 2 · What "app-like" actually means here

Not decoration. Five concrete properties the current build lacks:

| Property | What it means | Current state |
|---|---|---|
| **Persistent shell** | Chrome (nav, account, event context) survives navigation; only the content region swaps. | ❌ full-page render every route |
| **Route transitions** | Content region cross-fades / slides; the app never blinks white. | ❌ none |
| **Sheets over pages** | Secondary actions rise as bottom sheets / side drawers, not new URLs. | ⚠ `sheet.tsx` exists, barely used |
| **Optimistic state** | Tap → the UI moves *now*, reconciles after. | ❌ server round-trip everywhere |
| **Direct manipulation** | Drag, long-press, swipe, snap — not form-submit-reload. | ⚠ only in the 3D plan |

**Motion budget (non-negotiable):** every transition ≤ 240ms, easing `cubic-bezier(.22,.61,.36,1)`.
Honour `prefers-reduced-motion` — all decorative motion off, functional transitions reduced to opacity.
No animation may delay first input. No parallax on scroll-critical content.

---

## 3 · The 12 archetypes to design

This is the whole job. 401 routes collapse into these.

**Shell & navigation**
1. **App shell** — persistent top bar + event/account context + bottom nav (mobile) / rail (desktop), with the content region as a swappable slot.
2. **Command surface** — the ⌘K bar, elevated into the primary way to move around.

**Data — the anti-spreadsheet archetypes** *(these replace the 45 `<table>`s)*
3. **Roster** — dense list of people (guests, clients, team). Avatar, status pill, swipe actions, multi-select without checkboxes-in-a-table.
4. **Ledger** — money rows (budget, earnings, receipts, disputes). Right-aligned numerals in Space Mono, running total pinned, per-row expand.
5. **Comparison** — 2–4 things side by side (vendor compare, tier matrix, price bands). Cards in a scroll-snap row on mobile; column grid on desktop. **This is the archetype that kills `build-compare.tsx` and `vendor-tier-matrix.tsx`.**
6. **Admin console table** — the one place density genuinely wins. Keep tabular, but: sticky header, zebra-free, row-hover reveal of actions, inline edit, keyboard nav. Internal-only, so optimise for speed not beauty.

**Content**
7. **Editorial page** — marketing/help/blog long-form. Scroll-reveal grammar, already partly built in `_pa-motion`.
8. **Gallery** — Alaala / Papic media. Obsidian, masonry, lightbox, scrub.
9. **Detail** — one entity, full depth (vendor profile, contract, guest, event).

**Interaction**
10. **Sheet** — bottom sheet (mobile) / side drawer (desktop) for every secondary action.
11. **Wizard** — onboarding and multi-step flows, one decision per screen, progress that feels earned.
12. **Empty & loading** — skeletons that match the archetype's real shape; empty states that teach rather than apologise. *(Prod is pre-launch-empty — most surfaces render empty for every user right now, so this archetype is disproportionately load-bearing.)*

---

## 4 · Per-surface notes

### A · Couple dashboard — 126 routes · **start here**
`/dashboard/(launcher)` · `/dashboard/[eventId]/*` · `/dashboard/(account)/*`
The paying customer's product. Uses archetypes 1, 3, 4, 5, 8, 10.
**Named offenders:** `vendors/_components/build-compare.tsx`, `vendors/_components/plan-budget-accordion.tsx`,
`guests/_components/guest-list-multiselect.tsx`, `[eventId]/invitation/page.tsx`.
**Preserve:** the four-surface home (Events · Alaala · Spaces · You) shipped as PR #3240 — it is
owner-approved and must be re-skinned, **not** re-conceived.

### B · Public marketing — 104 routes
`/pricing` `/features` `/how-it-works` `/explore` `/help` `/about` `/our-story` `/blog` `/[slug]` guest surfaces.
Uses archetypes 7, 9, 12.
**⛔ Do NOT redesign `/`.** It is the ELN cinematic reskin, owner-approved 2026-06-29. The job is to bring
the *other* pages up to its level, not to replace it.

### C · Vendor dashboard — 63 routes
`/vendor-dashboard/*`. Uses archetypes 1, 3, 4, 9, 10.
**Existing prototypes to extend, not redraw:** `Vendor_Dashboard_AllScreens_2026-07-01.html`,
`Vendor_Dashboard_Reorg_2026-07-01.html`, `Vendor_MyShop_Actual_2026-07-01.html`.

### D · Admin console — 108 routes
`/admin/*`. Uses archetype 6 almost exclusively. Internal-only — **zero customer impact, so it ships last.**
Existing prototype: `Admin_Console_Nav_Redesign_2026-06-08.html`.

---

## 5 · The copy to lay out (owner-approved direction, 2026-07-31)

Claude Design must use **these words**, not placeholder. Direction: **non-sectarian at the top of the
funnel, faith-specific rites only on deeper pages.**

**Hero — `/`**
```
kick   Set na ’yan
title  Keep your memories.
       Plan your moments.
sub    The Filipino way to keep a celebration — remembered by everyone
       who came, not just the couple. Plan any event, free.
```

**Manifesto — `/` and `/our-story`**
> Setnayan is where the memories of every event in your life are kept — the ones you **hold** and the
> ones you **attend**. A Filipino celebration was never one family's; it belongs to the whole
> **samahan** — the ninong and ninang, the titos and titas, the barkada, everyone who showed up. So the
> memory shouldn't belong to one camera either. Every one of them is holding a piece of your day.
> Setnayan is where those pieces come together, and everyone goes home with their own.
> Plan it, run it, remember it, and *keep it, for life.*

**Pillar 01 — Ala ala · Memory Hub**
> Not one family's album. The whole samahan's — every photo, every clip, every story of your day,
> gathered from everyone who was there, waiting for you to step back into whenever you miss it. Yours for life.

**Deeper only (`/alaala`, `/our-story`)** — binyag · kumpil · kasal · aqiqah, and the lifecycle claim
that the same album carries every celebration a family will ever hold. **Never in the hero.**

---

## 6 · Output contract — what Claude Design should hand back

- **One self-contained HTML file per archetype** (12 files), all CSS/fonts/images inlined, both themes
  togglable in-page. This matches the established corpus pattern — every shipped redesign here was
  ported from exactly this kind of file in `03_Strategy/`.
- **Not** a Next.js app, **not** a component library, **not** a Figma link. Self-contained HTML is what
  the import tool ingests and what Claude Code ports from.
- Real copy from §5. Real token values from §1. No lorem ipsum, no invented brand colours.
- Each file should state which of the 401 routes it governs.

**Port path.** `import-claude-design-from-url` pulls the bundle into Vercel for preview → Claude Code
ports each archetype into `apps/web` behind a flag → surfaces migrate archetype-by-archetype, never
big-bang.

---

## 7 · Order of work

| Phase | Surface | Why |
|---|---|---|
| 1 | Archetypes 1, 2, 10, 12 (shell · command · sheet · empty) | Nothing else can land without the shell. Biggest app-like win per unit of work. |
| 2 | Couple dashboard (A) | The paying customer. Archetypes 3, 4, 5, 8. |
| 3 | Public marketing (B) | Visible to acquisition; `/` stays untouched. |
| 4 | Vendor dashboard (C) | Retention surface; prototypes already exist. |
| 5 | Admin console (D) | Internal-only. Ships last. |

---

## 8 · Open flags for the owner

- **`/` is excluded** from the redesign by this brief. Say so if you want it in scope — it would mean
  discarding the ELN reskin approved 2026-06-29.
- **Live Studio pillar (04)** promises broadcast while the Google Cloud Identity account is suspended
  (appeal `73857927`). A redesign of the pillar dock is the natural moment to demote it — **not decided.**
- **Route transitions require a client-side shell**, which changes how the logged-in surfaces render. This
  is the one architectural (not cosmetic) change in the brief.
