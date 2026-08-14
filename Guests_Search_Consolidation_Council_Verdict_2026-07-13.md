# Guests Page — Search & Toolbar Consolidation · Council Verdict

**Date:** 2026-07-13
**Trigger:** Owner spotted two identical search boxes on the desktop Guests (Living Roster) page — "guests already has find on top and there is search on the center?"
**Owner leaning going in:** Option 1 — delete the Toolbar's duplicate search; keep Sort + Apply + List/Mind-map; search lives only in the CaptureBar's Find mode + ⌘K.
**Council:** 4 lenses (IA/interaction · front-end/risk · a11y/discoverability skeptic · product/consistency) → chair synthesis.
**Status:** ✅ **ALL THREE SIGN-OFFS APPROVED 2026-08-14** — owner: *"yes. same as the menu on
admin and shop."* Search is always visible, the `Add|Find` toggle dissolves (CaptureBar goes
Add-only, search moves to the facet-bar query row — **this supersedes the 2026-07-11 lock**), and
Apply + full-reload Sort are retired for instant URL-driven controls. **BUILD IS UNBLOCKED.**
⚠ The sign-offs sat open for a MONTH because nobody put them in front of the owner — not because
anything was undecided. See `DECISION_LOG.md` 2026-08-14.

---

## The problem (code-verified)

Desktop Guests chrome lives in one wrapper — `<div className="gl-settle hidden space-y-3 lg:block">` — and stacks **three** blocks:

1. **CaptureBar** (`_components/capture-bar.tsx`) — `[Add | Find]` segmented toggle (**default = Add**). Add = free-text guest parser (`Ana Cruz +1 groom vip #Barkada` → Enter → inline add, clear, keep focus). Find = wraps `LiveSearch`. Overflow = Full add form / Import CSV / Quick add list. ⌘K jumps to Find. This is the "Living Roster P2 · capture-first" redesign, owner-signed **2026-07-11**, meant to be the single doorway for Add + Find.
2. **SummaryFacetBar** — meters (Guest-target pax · Pax pool · Confirmations) + facet-lens pill rows (Side · RSVP · View · Group · Tags, each a live-count filter `<Link>`) + ActiveFilters breadcrumb. All instant, SSR, URL-driven.
3. **Toolbar** — a **second** `LiveSearch` (the flagged duplicate, identical placeholder) + a native `<form method="get">` Sort select + **Apply** submit (full page reload, 7 hidden param-preserving inputs) + List/Mind-map switcher.

**The redundancy:** both search boxes are the *same* `live-search.tsx` component writing `?q=` with a 250 ms live debounce — 100% redundant on desktop. Because CaptureBar defaults to **Add**, on landing the Toolbar box is the *only* visible search; toggling Find stacks a second identical box above it — exactly what the owner saw.

**Mobile is independent** (`mobile-guest-carousel.tsx` has its own persistent search compose-row). All fixes stay inside `hidden lg:block`; mobile is untouched.

---

## Council positions

| Lens | Verdict on Option 1 | Core argument |
|---|---|---|
| **IA / interaction** | endorse **with changes** | Category error: search is a *lens* (sibling of the filter pills + Sort), not an add-peer. Pairing Find with Add in a toggle is *what forced* a persistent search to leak into the Toolbar. Dissolve the toggle; house Find/Filter/Sort together. |
| **Front-end / risk** | endorse **with changes** | Deleting the duplicate is nearly free (`q` is URL-sourced; mobile untouched) and fixes a real a11y bug (two inputs sharing `aria-label="Search guests"` when Find is open). Convert Sort to an instant client island — it's the *only* full-reload control on the page. (Was the lone dissent on *how far* to go — see below.) |
| **A11y / discoverability** | endorse **with changes** | Code-verified: delete-only leaves **zero** `input[type=search]` in the DOM on landing, and ⌘K's hint only renders in Find mode → undiscoverable. A hint is not a box. Search must be always-visible. |
| **Product / consistency** | endorse **with changes** | The owner *already* shipped an always-visible search on mobile's compose-row. Desktop should mirror that one-bar model, not hide search behind a non-default toggle. |

**Consensus (all four):** (a) delete the Toolbar's duplicate `LiveSearch`; (b) the *literal* Option 1 resolution — "search only behind the Find toggle + ⌘K" — is a discoverability/a11y regression that must **not** ship; (c) make Sort instant, retire Apply/full-reload; (d) keep CaptureBar's Add parser + overflow, keep every meter/facet/breadcrumb, preserve the full URL param contract.

**Dissent & resolution:** 3–1 on *how far*, not on the delete. The front-end lens preferred the conservative path (keep the toggle, keep a thin Toolbar with instant Sort, add a persistent ⌘K *hint* in Add mode). The chair sided with the majority on always-visible search (a hint ≠ a box; three independent lenses converge) and on dissolving the toggle (it's the category error at the root), **but honored** the FE "mixing concerns" objection: search + Sort go in as Suspense-wrapped **client islands** inside the still-SSR SummaryFacetBar — the exact pattern `LiveSearch` already requires.

---

## Verdict — Option 1, refined

> **Delete the duplicate — but don't bury search behind the Add|Find toggle.** Dissolve the toggle so CaptureBar is **Add-only**, pin **one always-visible search** (+ an instant Sort island + the List/Mind-map switch) into a new "query row" at the head of the SummaryFacetBar, and **delete the Toolbar entirely**. Desktop chrome collapses from **three blocks to two**. Search is always visible, Sort is instant, no Apply, no full-page reload.

### Final desktop layout (two blocks + roster)

- **Block 1 — CaptureBar (Add-only):** `+` glyph · parser input · "↵ add & keep going" · "⋯ More ways" overflow. No toggle. Cursor lands here on load (capture-first preserved).
- **Block 2 — SummaryFacetBar (absorbs the Toolbar):**
  - Meters row (unchanged): Guest-target pax · Pax pool · Confirmations.
  - **Query row (NEW):** 🔍 always-visible Search (`role="search"` landmark + visible label + ⌘K target) on the left; right-aligned `[Sort: Importance ▾]` instant island + `[List | Mind map]` switch. All instant, URL-driven, wraps gracefully on narrow desktop.
  - Facet-lens rows (unchanged): Side · RSVP · View · Group · Tags with live counts.
  - Foot: ActiveFilters breadcrumb (unchanged).
- **Roster** below, roster-as-hero, full width (unchanged).

### Delete
- Toolbar's second `<LiveSearch>` + `<Suspense>` — `page.tsx:1313–1319`.
- Toolbar's native `<form method="get">` + 7 hidden inputs + the **Apply** button — `page.tsx:1320–1346`.
- The `Toolbar` function (`page.tsx:1284–1352`) + its call site (`page.tsx:604–610`).
- CaptureBar's `[Add|Find]` toggle + `addMode`/`switchTo` + Find-mode `<LiveSearch>` + unused import — `capture-bar.tsx:30, 99–125, 158–166`. ⚠ **Load-bearing** — supersedes the 2026-07-11 P2 single-doorway lock.

### Combine / move
- One always-visible search island (`guests-search.tsx`, reuses `live-search.tsx` verbatim, wrapped in `role="search"`) into the facet-bar query row; hosts the ⌘K listener (moved out of CaptureBar) targeting *its* input.
- Sort → instant `sort-select.tsx` island mirroring `live-search.tsx`'s `router.replace` (reads `searchParams` inside the handler so a concurrent filter click is never clobbered). Kills the form/hidden-inputs/Apply. `?sort=group` group-bucketing (`page.tsx:372`) preserved automatically.
- `GuestsViewSwitcher` relocated to the right end of the query row (still SSR `Link`, still threads `search`).

### Keep
- CaptureBar's Add parser + "More ways" overflow (Add stays the landing default — capture-first lock honored; it becomes *purer*, not weaker).
- All SummaryFacetBar meters / facet rows / ActiveFilters breadcrumb + the mobile sticky ActiveFilters strip.
- `live-search.tsx` (still used by the new island + mobile). Only its Toolbar call site dies.
- Full URL param contract `q/rsvp/view/group/team/tag/sort/gview` — every control stays a URL writer; SSR + shareable end to end.
- Mobile chrome (`mobile-guest-carousel.tsx`) — entirely untouched.

---

## Owner sign-offs (before build)

1. **Dissolve the CaptureBar `Add|Find` toggle** → CaptureBar becomes Add-only, search relocates to the facet-bar query row. This refines but **supersedes** the owner-locked 2026-07-11 P2 "single doorway for Add and Find" (2 days old). The duplication you spotted is that model's failure tell — but it's a locked decision, so it needs an explicit yes.
2. **Search always-visible** (recommended) over Option 1's literal "search only behind Find + ⌘K." This is the whole discoverability call — code-verified that the literal option leaves zero search inputs in the DOM on landing.
3. **Retire Apply + full-reload Sort** → every roster control (search/filter/sort/view) is instant + URL-driven, no batch-Apply anywhere. Removes the last no-JS fallback for sort (acceptable — the chrome is already JS-dependent).

**Conservative alternative** (the FE dissent, if any sign-off above is a "no"): keep the toggle, delete only the Toolbar duplicate, keep a thin Toolbar with instant Sort + List/Mind-map, add a persistent ⌘K hint in Add mode. Smaller and keeps the P2 lock — but search stays behind the toggle on landing (the regression three lenses flagged).
