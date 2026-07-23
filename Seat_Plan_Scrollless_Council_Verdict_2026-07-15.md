# Seat_Plan_Scrollless_Council_Verdict_2026-07-15

**Council:** four designer proposals (`canvas-tool`, `ia-density`, `operator`, `kit-coherence`) synthesized into one buildable verdict.
**Scope:** couple seat-plan editor at `apps/web/app/dashboard/[eventId]/seating/` — recomposed as a scroll-less app frame. Zero capabilities deleted; ~13 toolbar controls + 2 page-header pills + 1 video link rehoused.
**Ground truth:** recon @ `origin/main` 1cc063db4. All line anchors refer to `_components/seating-editor.tsx` unless a file is named.

---

## 0. Verdict in one paragraph

The page stops being a document and becomes a fixed `100dvh` frame: one 52px glass **command bar** (the only backdrop-blur surface on the page), an optional single-line **banner slot**, and a body of **[320px left panel | canvas]** where the canvas absorbs all remaining height. All controls consolidate into the command bar's four homes — a **`+ Add ▾` menu** (place objects + room size), an **`Arrange ⚙▾` popover** (policies + fill-around-locked + draft), a **`Share & print ▾` menu** (publish, PDFs, guest photos, walkthrough videos), and a permanent **save-status chip** — plus a **[2D · 3D · List]** segmented view control and the single gold **Auto Arrange** primary. The left panel becomes three tabs (People / Tables / Rules), full-height, virtualized. 2D↔3D is a dirty-guarded route swap to the existing `/seating/lab`, with a mirrored segment added to the lab. No mode model. No autosave in v1 (permanent save chip + `beforeunload` guard instead; autosave is a separate owner-gated PR). Mobile keeps List default and swaps the stacked panel for a bottom drawer.

---

## 1. The single viewport layout

The seating route opts out of the SidebarShell document scroll (`data-shell-main`, `layout.tsx:393`) via a scoped wrapper **inside the seating page** — a `SeatingFrame` component: `flex h-[calc(100dvh-var(--shell-top))] flex-col overflow-hidden`, with the shell exposing its chrome height as a CSS var (a `fullBleed`-style opt-out on the shell is acceptable if the CSS-var approach proves insufficient, but prefer the least-invasive wrapper — see risk R1). Use `100dvh`, never `vh` (iOS toolbar collapse).

**Row 1 — COMMAND BAR (fixed, 52px, one row, never wraps).** Absorbs BOTH the page header row (`page.tsx:161-229`, incl. the ~70px SeatStat strip `:164-169`) and the pills+toolbar row (`seating-editor.tsx:3203-3515`), killing the 2–3-row flex-wrap. Layout, left→right:

1. **[2D · 3D · List]** segmented view control (see § 4).
2. **Stats chip** — one mono string, e.g. `142/180 seated · 12 to seat · 14 tables` — the SAME sources as the SeatStat cells + the duplicate Pills (`:3205-3221`). One stats surface, not two. Live peer pills render beside it; the view-only/lock banners (`:3141-3203`) collapse to a lock pill + popover with the takeover button inside.
3. *(spacer)*
4. **`+ Add ▾`** · **`Arrange ⚙▾`** · **`Share & print ▾`** (icon+label menu rows inside, never bare icons — see § 2).
5. **Save-status chip** (permanent — see § 2, SAVE).
6. **Auto Arrange ✦** — the single gold primary, far right, keeping its 3-step confirm modal (`:5405-5455`).

**Row 2 — BANNER SLOT (0 or 32px, hard budget: ONE single-line strip max).** Priority order: DayOfEditingBanner (`page.tsx:231`, wedding-day span only, warm red "Live — guests are seeing this now") > capacity shortfall (`page.tsx:242-249`) > walima note (`page.tsx:233-238`). When ≥2 want to show, the winner renders and the rest collapse into an **"N notices" badge** on the command bar that expands on tap. Never two stacked banners; banners shrink the canvas, never scroll the page.

**Row 3 — BODY (`flex-1 min-h-0`), grid `[320px_minmax(0,1fr)]`** (evolving `:2789`):

- **Left panel:** 320px, `h-full overflow-y-auto` — replaces `max-h-[46vh]/lg:max-h-[78vh]` (`:2791`). Inner scroller #1. See § 3.
- **Canvas:** `absolute inset-0` of its cell. **DELETE** the free-mode `aspect-[7/5]` box AND the 64vh to-scale cap (`:3758-3781`). To-scale mode letterboxes the room ratio INSIDE the fill against measured region height, not a vh guess. `fitView` (`:2597-2645`) fires on mount + a ResizeObserver. The transform-only world layer (`worldRef :3782`, ref-driven pan/zoom `:534-541`, wheel `:643-670`, pinch `:1839-1899`) is **untouched** — this is a container-sizing change, not an interaction rewrite. The wheel-zoom "hijack" stops being a bug the moment there is no page scroll to fight.

**Floating on the canvas (all pre-existing or relocated, no new blur):** zoom +/−/Fit cluster bottom-right (`:4790-4816`, keep); scale bar bottom-left (`:4778`, keep); to-scale wall grips (`:4819-4857`, keep); **contextual bar** bottom-center — the picked-guest / picked-group / linking bars (`:3673-3755`) become ONE floating pill that swaps content instead of flow rows that push the canvas down (includes a "picked: Ana Reyes" echo so pick-to-seat mode survives tab switches); hint line (`:5216-5219`) → first-visit-only fading toast; per-table settle-positioned popover and the empty-state "Build my seating" draft card (`:4480-4502`) unchanged.

**Scroll inventory (exhaustive):** document scroll = none, ever. Inner scrollers = (1) left panel, (2) the List view when active (renders in the canvas region, `:5221-5405` cards, own scroll). Canvas = pan/zoom only.

**Vertical math on an 800px laptop:** 52 bar + 0–32 banner + ~716–748px canvas — vs. today's ~70 stats + 90–130 wrapped toolbar + 610–640 capped canvas overflowing the viewport. Scroll-less with ~100–130px more canvas.

---

## 2. Where every current action lives

| # | Current control (anchor) | New home |
|---|---|---|
| — | SeatStat strip (`page.tsx:164-169`) + Pills (`:3205-3221`) | Command-bar **stats chip** (merged, one source) |
| 1 | Floor plan / List toggle (`:3225-3244`) | **[2D · 3D · List]** segment |
| 2 | Room size / W×L (Ruler, `:3246-3257`; panel `:3517-3671`) | **`+ Add ▾`** → final row "Room size & scale…" → opens the room panel (checkbox, W/L inputs, presets, area sizes, unchanged) as a right-anchored popover. Never a layout row again. |
| 3 | Add entrance (`:3259-3266`) | **`+ Add ▾`** (disabled-with-tooltip once one exists) |
| 4 | Service door (`:3268-3276`) | **`+ Add ▾`** |
| 5 | Dance floor (`:3278-3286`) | **`+ Add ▾`** |
| 6 | Cocktail area (`:3288-3296`) | **`+ Add ▾`** |
| 7 | Add sign, max 24 (`:3298-3307`) | **`+ Add ▾`** (×24 cap badge) |
| 8 | Add booth (`:3309-3321`) | **`+ Add ▾`** |
| — | *(new)* + Table | **`+ Add ▾`** top row → opens the 13-type AddTablePanel catalog (`:2824`/`:6054`) as a popover; same component also anchored from the Tables tab |
| 9 | Save layout (N) (`:3323-3332`) | **Permanent save-status chip**: `Saved · <mono time>` / `● N unsaved` (click = `saveLayout :2682-2760`) / `Saving…` / `Retry`. Always visible — the current appear/disappear button is why drags get lost. Add ⌘S and a `beforeunload` + route-change guard on the dirty sets (`setDirty :1459,2204`; floorDirty/boothsDirty/signsDirty). **No autosave in v1** (sign-off S2). |
| 10 | Export PDF dropdown, 3 modes (`:3334-3391`) | **`Share & print ▾`** → "Export PDF" submenu (Mood-board / Blueprint / Caterer) |
| 11 | Guest photos popover (`:3392-3475`) | **`Share & print ▾`** → "Guest photos in 3D walk" (table/all/none → `saveVenuePhotoVisibility`, `actions.ts:723`). Relabeled — the Camera icon masquerading as a toolbar peer was the recon's most misleading control; it's audience policy, so it lives with the other things-others-see. |
| 12 | Publish & print (`:3476-3488`) | **`Share & print ▾`** → emphasized final item, frozen-snapshot semantics untouched |
| 13 | Auto Arrange (`:3489-3497`) | **Visible gold primary**, far right. Confirm modal kept. |
| 14 | Fill around N locked (`:3498-3512`) | **`Arrange ⚙▾`** conditional row when locks exist |
| — | Auto-seating On/Off pill (`page.tsx:176-195`) | **`Arrange ⚙▾`** switch row — same server-action form, verbatim |
| — | Keep groups together pill (`page.tsx:198-217`) | **`Arrange ⚙▾`** switch row — same form |
| — | *(also in Arrange ⚙▾)* "Build my seating draft" | duplicate anchor for `buildSeatingDraft`; the empty-state CTA stays |
| — | Walkthrough Video button (`page.tsx:220-227`) | **`Share & print ▾`** row — it manages a share asset, not a placement tool |

**Discoverability guardrails** (mitigating the burial of a 4-day-old owner-built toolbar): every menu row = icon + label (keep FileDown / Printer / Camera / DoorOpen etc. so recognition survives relocation); when either Arrange policy is Off, the closed `Arrange ⚙▾` button shows a small state badge; one-time "your tools moved" coach marks riding the 0030 guided-tour infra. Audit: **0 capabilities lost; command bar carries 6 visible targets instead of 13 wrapping to 3 rows.**

---

## 3. Left panel — 3 tabs, full height, virtualized

Replaces the 8-section unbounded mega-scroll (`:2791-3138`). Search input pinned above the tabs (`:2793`); tab persisted per user (localStorage).

- **PEOPLE (default).** "Only show unseated" filter pinned; then **Individual Members** (`:2909-2929`, MemberRow `:5716-5769` with ChairAvatar, seated-table chip, and the P1–P4 priority-cycling chip intact) and **Member Groups** (`:2931-3020`, expand, Armchair arm-to-seat, Eye/EyeOff color toggles intact) as two collapsible sections — the ia-density merge of individuals under group headers is **rejected for v1** (structural change beyond a layout pass). **VIRTUALIZE member rows** (react-window or `content-visibility:auto`) — the recon's "250 pax, no virtualization" is the panel's real bug and the single biggest perf fix in this verdict. Unseated-count badge on the tab. Pick-to-seat is cross-tab state, echoed in the canvas contextual pill.
- **TABLES.** Tables list (`:2836-2906` — dominant-color dots, link icon, Filled/Open badges, hover delete, click-to-highlight/seat-group) + "+ Table" opening the same catalog popover as `+ Add ▾`.
- **RULES.** Seating Priority drag-reorder (`:3022-3082`, `savePriorityOrder` intact, ChevronUp/Down fallbacks kept) + Seating Guide keep-apart list + KeepApartAdder (`:3086-3137`). A warm-red violation-count badge sits on the RULES tab itself so breaches are visible from any tab (real violations only — honesty rule).

---

## 4. 2D / 3D toggle

The recon confirms the couple-facing 3D route **exists and is live** (`/dashboard/[eventId]/seating/lab`, on by default) — so this ships now, as a real door, not a teaser.

- **Placement:** the **[2D · 3D · List]** segmented control, command-bar left. 2D↔List swaps in-page (existing view state `:3225-3244`). The view axis becomes ONE control instead of a toolbar toggle plus a nonexistent link.
- **3D behavior:** `router.push` to `/seating/lab` — an honest route swap, safe because the lab reads the identical doc, writes through the SAME server actions, and shares the single-editor lock (`useSeatingLock`, `seating-lab-3d.tsx:85`). **Dirty guard:** if any of layoutDirty/floorDirty/boothsDirty/signsDirty is set, intercept with "Save layout first?" (Save & switch / Switch anyway) — required because v1 keeps manual save. Prefetch the lab route on segment hover. Optional nice-to-have: persist zoom/pan to sessionStorage keyed by eventId.
- **Reciprocity:** add the IDENTICAL segmented control to the lab's chrome so 3D→2D is one click. This heals the doorway fork (add-ons "Seat Plan" → lab, `lib/add-ons-catalog.ts:170-176`, vs event-nav "Seat plan" → 2D, `customer-nav-config.ts:233-236`) — both doorways may keep their targets once the siblings can see each other.
- **Kill-switch:** hide the 3D segment entirely when `NEXT_PUBLIC_SEATING_3D === 'false'` (mirrors the lab's 404 gate, `lab/page.tsx:66`) — never link to a 404.
- **Explicitly NOT v1:** embedding the 4,952-line R3F lab in the 2D page (dynamic import, parallel route, or iframe). Memory-hostile, forks the lock story, OrbitControls vs pointer-capture collisions. Unanimous across all four proposals. Embed is a v2 spike at best.
- **Lock handoff:** v1 uses the existing release-on-unmount / acquire-on-mount machinery and accepts a possible momentary takeover prompt to presence peers. A gap-free sequenced acquire-then-release needs a `use-seating-lock` change — deferred, tracked as follow-up, not a v1 blocker.

---

## 5. Mode model

**None.** The operator proposal's Place/Seat/Share modes are rejected (see § 8). Grouping is achieved by the three menus + the segment; every verb is reachable in ≤2 clicks from any state, and canvas capability is never gated.

---

## 6. Kit compliance (Atelier-Glass, owner-locked 2026-07-12)

- **Blur budget:** exactly ONE backdrop-blur surface — the command bar. Left panel, menus, popovers, drawer, and canvas chrome are solid surfaces.
- **Gold:** ONLY on the Auto Arrange primary and the active segment tick. Auto Arrange recolours mulberry→gold as part of this rebuild (sign-off S3 confirms sequencing vs the phased reskin plan).
- **Warm semantics:** day-of live banner = warm red; rule-violation badge = warm red; lock/view-only pill = neutral warm.
- **Mono:** all counts, timestamps, and dimensions (stats chip, save chip time, W×L metres, ×24 cap badge) in Space Mono.
- **Honesty:** the stats chip shows the SAME reconciled numbers as the retired SeatStat cells; violation badges reflect real breaches only; no fake doors (the 3D segment hides when the flag is off).
- **Motion:** drawer, toast, chip transitions all behind `prefers-reduced-motion`.
- Guest-facing sites are excluded from the reskin per the lock — this page is couple chrome, in scope.

---

## 7. Mobile ruling (<1024px)

- **List stays the default view** (matchMedia `:626-630` — correct call, kept).
- Frame is still `100dvh` `overflow-hidden`; command bar condenses to **[2D · 3D · List] segment + stats-on-tap chip + Auto Arrange (gold, icon+short label, stays visible) + `⋯` overflow sheet** containing + Add / Arrange / Share & print / Save. **No FAB** — placement actions are rare on phones; `⋯` avoids collision with the zoom cluster.
- The stacked `max-h-[46vh]` panel-above-canvas sandwich is killed: the left panel becomes a **bottom drawer** with 3 snap points (~15% peek showing a mono "12 to seat" handle / ~50% / ~90%), same People/Tables/Rules tabs, over a full-height canvas.
- **Drawer and per-table sheet never stack:** opening the <768px per-table bottom sheet (`:4869-4880`, unchanged) minimizes the drawer to its handle.
- Touch pinch/pan (`:1839-1899`) untouched. Save chip persists in the condensed bar. The **3D segment stays visible on phones** (the lab exists and is full-bleed `h-[82vh]`; consistency beats hiding it in overflow — flagged in S5).

---

## 8. Rejected ideas (one line each)

1. **Place/Seat/Share MODE model** (operator) — modal state hides verbs at the worst moment (day-of coordinator needing caterer export from SEAT); operator's own risk #2 concedes it degrades to buttons, so start there.
2. **Floating vertical Insert rail on the canvas edge** (canvas-tool, ia-density) — extra floating chrome colliding with wall grips, entrance markers, and the mobile zoom cluster; the labeled `+ Add ▾` menu achieves the same grouping inside the one glass strip.
3. **Day-1 debounced autosave** (ia-density) — `saveLayout` fires sequential per-table writes (`:2682-2760`); bursts interleaving with lock takeover / live-viewer refresh turn "lost drags" into "half-saved room"; permanent save chip + beforeunload guard first, autosave as its own lock-aware PR (S2).
4. **Embedding the R3F lab in the 2D page** (raised and rejected by all four) — 4,952 lines, own camera/choreography, doubled memory, forked lock semantics.
5. **Merging Individual Members under group headers in the People tab** (ia-density) — restructures list data in a layout-only pass; two collapsible sections keep blast radius at JSX re-parenting.
6. **A fourth top-level "Display" popover** (ia-density) — one item (guest photos) doesn't earn a top-level home; it lives in Share & print where its audience-facing meaning is legible.
7. **Mobile "+" FAB** (canvas-tool, ia-density) — competes with the zoom cluster and the drawer handle for corner space; `⋯` overflow sheet instead.
8. **SHARE as a panel-takeover mode/sheet** (operator) — same content ships as the `Share & print ▾` menu without hijacking the left panel.
9. **Walima/capacity banners as floating toast-chips over the canvas** (canvas-tool) — replaced by the stricter one-banner-slot + "N notices" badge, which guarantees the height budget.
10. **Repeating Auto Arrange in two rails** (operator) — one gold primary, one home; duplication dilutes the kit's single-primary rule.
11. **⌘K command palette as a v1 requirement** (canvas-tool mitigation) — good later; keyboard shortcuts on menu rows suffice for v1.
12. **Hiding 3D behind mobile overflow** (operator) — the segment is the cross-link's whole point; keep it visible everywhere the flag is on.

---

## 9. Implementation notes (file anchors + PR order)

**Prime directive: pure JSX re-parenting.** Zero changes to the 34 server actions, the dirty-set logic, or the world-layer ref/transform pipeline (`:534-541`, `:643-670`, `:1839-1899`, `worldRef :3782`). Extract only presentational shells from the 6,178-line `seating-editor.tsx`, passing existing handlers down.

- **PR-1 — Fixed frame + command bar + canvas fill** (pure layout). New `SeatingFrame` wrapper in `page.tsx` (replacing `<section className="space-y-3">`, `page.tsx:160`); shell chrome height as CSS var (touch `layout.tsx:393` minimally or not at all); delete `aspect-[7/5]` + 64vh cap (`:3758-3781`); ResizeObserver → `fitView` (`:2597-2645`); stats chip merging `page.tsx:164-169` + `:3205-3221`; banner slot with one-strip budget (`page.tsx:231-249`, lock banners `:3141-3203` → pill); contextual bars → floating pill (`:3673-3755`); permanent save chip + `beforeunload`/route-change guard. Dev-only assertion in `SeatingFrame` that it received full viewport height (any future flow sibling reintroducing scroll fails loudly).
- **PR-2 — Left panel tabs + virtualization.** Tabs over `:2791-3138`; windowed MemberRow (`:5716`); RULES violation badge; localStorage tab persistence.
- **PR-3 — Menu regroup.** `+ Add ▾` (absorbing `:3246-3321` + AddTablePanel anchor `:2824`; room panel `:3517-3671` → popover), `Arrange ⚙▾` (absorbing `page.tsx:176-217` forms verbatim + `:3498-3512`), `Share & print ▾` (absorbing `:3334-3488` + `page.tsx:220-227`); coach marks via 0030 infra; gold Auto Arrange.
- **PR-4 — 2D/3D segment.** Segment in command bar; dirty-save interceptor; hover prefetch; flag-hide (`lab/page.tsx:66`); mirrored segment in the lab chrome (`seating-lab-3d.tsx`); comment update at `lib/add-ons-catalog.ts:170-176`.
- **PR-5 — Mobile.** Bottom drawer (3 snaps) replacing the stacked panel; condensed bar + `⋯` sheet; drawer/table-sheet exclusion rule; `100dvh` audit.

Each PR is layout-only and independently revertable; ship PR-1 behind a flag with the old layout one revert away. Standard repo workflow applies (changelog fragment per PR, auto-merge).

**Built state:** PR-1 (frame + command bar + canvas fill) + PR-4 (2D/3D segment) shipped 2026-07-15 as **council cluster 1** (PR #3275). **PR-2 (left-panel People/Tables/Rules tabs + `content-visibility` virtualization + Rules violation badge), the directive's blueprint 2D restyle, and PR-5 (mobile bottom drawer with 3 snaps + `⋯` overflow sheet)** shipped 2026-07-16 as **council cluster 2** — all presentation-only, zero server-action / dirty-set / geometry / world-layer changes. PR-3 (menu regroup with coach marks) folded into cluster 1's command bar; the `⋯` overflow reuses those same menu bodies. Remaining follow-ups per §10: S1 owner walkthrough of the regrouped toolbar, S2 autosave (still manual save), S5 3D-on-phones preference.

**Top risks carried into engineering** (merged from all four): (R1) the shell-scroll escape is a layout-contract change — scope it to the page wrapper, test at 768/900/1080px heights, and the one-banner budget is the defense against short-laptop canvas crush; (R2) the 6,178-line monolith — presentational extraction only, no ref surgery; (R3) 2D↔3D nav loses in-memory zoom/pan and can flicker a takeover prompt — accepted for v1, sessionStorage persist + sequenced lock handoff tracked as follow-ups.

---

## 10. Open owner sign-offs

- **S1 — Toolbar regrouping.** The always-visible toolbar the owner built 2026-07-11 collapses into three labeled menus; entrance/dance/cocktail/booth/room-size and the two policy toggles move behind one click. Coach marks + labeled rows mitigate, but this is a genuine discoverability trade the owner must accept before PR-3 merges (owner walkthrough recommended).
- **S2 — Autosave.** v1 ships manual save (permanent chip + beforeunload guard). Converting to debounced autosave changes write semantics under the single-editor lock and PH network reality — separate PR, owner decision.
- **S3 — Gold Auto Arrange now.** The Atelier-Glass reskin is locked, but this page jumps the phased-rollout queue by recolouring during the rebuild — confirm sequencing is acceptable.
- **S4 — Shell escape hatch.** If the CSS-var wrapper proves insufficient and a `fullBleed` prop on SidebarShell is needed, that's a precedent-setting `layout.tsx` change — flag before implementing.
- **S5 — 3D segment on phones.** Visible by default (links to the existing full-bleed lab); owner may prefer it desktop-only if low-end-Android R3F performance is a concern.
