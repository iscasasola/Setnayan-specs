# 0008 — Seating Chart Editor · Implementation result

**Branch:** `claude/sad-lehmann-b3ea99`
**Built:** 2026-05-09
**Status:** Initial implementation landed; ready for design QA at `/dashboard/seating`.

---

## What was built

### Data model (Supabase migration `20260509060000_seating_chart_editor.sql`)

- **Extended `wedding_tables`** (the existing 0001 table — `tables` is a PG reserved word, so we extend rather than create a parallel `tables` relation):
  `table_type`, `rotation_deg` (45° increments), `segments` (serpentine), `is_locked`, `qr_token` (unique partial index), `qr_published_at`, `updated_at`, `deleted_at`. `position_x`/`position_y` are now `REAL` so the editor can use the normalized 0..1000 coordinate space.
- **`guests.chair_seat_index`** added; partial unique index `(table_assignment_id, chair_seat_index)` prevents two guests sharing the same chair.
- **`event_floor_plans`** singleton: stage / band / dancefloor / doors (jsonb) / venue dimensions / alignment_lock / grid_snap / canvas geometry / `published_at`. RLS policy reuses the `is_couple_of()` helper from 0001.
- All ALTERs are `IF NOT EXISTS` and constraint guards are wrapped in `DO` blocks — the migration is safe to re-run.

### Type / schema layer

- `lib/db/types.ts` — `TableType`, `TABLE_CATALOG` (13 entries from the spec, sized in normalized canvas units), `tableShapeAllowsRotation`, `EventFloorPlan`, `FloorPlanDoor`, `DEFAULT_FLOOR_PLAN`, `tierForGuest()` (the four-ring auto-fill mapping), `TIER_LABELS`, `TIER_VAR`. The legacy `WeddingTable` type stays compatible.
- `lib/schemas/seating.ts` — Zod schemas for every server-action payload (add / update / delete table, swap-positions, assign-seat, update floor plan).
- `lib/db/seating.ts` — server-side loader that returns `{ tables, guests, floorPlan }`, hydrating the floor-plan row and back-filling a sensible `table_type` for legacy 0001 rows.

### Page route + chrome

- `/dashboard/seating` — server component that loads data and renders the editor. **Seating** link inserted between Schedule and Suppliers in `top-nav.tsx`; replaces the old "Schedule" slot in the mobile bottom tab bar to match the spec ("Overview · Guests · Seating · More").
- `/dashboard/seating/print` — published-only print pack: cover page → per-table sign sheet (table label, couple footer, table QR encoding `setnayan:table:{token}`) → optional per-guest place cards (name, table label, personal QR from 0001). Print stylesheet enforces `page-break-after`.

### Server actions (`/dashboard/seating/actions.ts`)

`addTableAction`, `updateTableAction` (move / rotate / rename / lock / type-swap), `deleteTableAction` (soft delete + auto-unseat), `swapTablePositionsAction` (whole-table swap by tap), `assignSeatAction` (seat / unseat / displace prior occupant), `autofillAction`, `publishAction` (mints `qr_token` for every un-tokened table, sets `event_floor_plans.published_at` — idempotent on already-minted rows), `updateFloorPlanAction` (band / dancefloor toggles, snap toggles, etc.).

### Editor surface (`apps/web/src/app/dashboard/seating/_components/`)

- **`SeatingEditor`** (root client orchestrator) — owns optimistic state, error toast, confirmation modals, and routes every mutation through `useTransition` so revalidation happens off the render path.
- **`FloorCanvas`** — plain SVG, no third-party canvas library (per the spec's "do not pull in Konva / Fabric / Pixi" guidance). Pointer-event-based table drag with collision detection (AABB overlap reverts the drop), HTML5 drag-drop for palette → canvas and sidebar guest → chair, click-to-swap-tables, double-click-rename, hover/select chair name pop, distance-from-stage rings shown while Auto-fill is staged. Stage / band / dancefloor / door glyphs render directly from the floor-plan record.
- **`TablePalette`** — collapsible groups (round / long / family-head / sweetheart / serpentine), each entry draggable AND clickable (click adds at canvas center for couples without a pointer).
- **`GuestSidebar`** — Unseated tab grouped by tier with tier-color ribbon on every chip; By-table tab grouped per table. Drag-and-drop wires through to the canvas.
- **`TableDetailSheet`** — rename, see seated guests, unseat individuals.
- **`MobileSeatingView`** — read-only mini canvas + table-card list + status pills + unseated banner + FAB-driven Add-Table sheet + Actions sheet (Auto-fill / Publish / Print pack). Per the spec, mobile is "review and adjust", not full layout authoring.

### Auto-fill algorithm (`_lib/autofill.ts`)

Pure function. Filters to attending + unseated guests, sorts the unlocked / non-sweetheart table pool by Euclidean distance from the stage center (tie-break by y, x), groups eligibles into tiers 1–4 (Tier 1 sub-sorted by role priority `principal_sponsor → officiant → reader_lector → soloist_musician`), then walks tables nearest-first packing households together when capacity allows. Spillover from each tier overflows into the next tier's pool before going to the unseated pile. Idempotent — already-placed guests are never moved.

### Publish flow

`Publish` mints a 32-char hex `qr_token` for every un-tokened active table, stamps `qr_published_at`, sets `event_floor_plans.published_at`, and unlocks the Print pack link in the page header. Re-publish is a no-op for already-minted tokens (the spec calls for additive minting only).

### Visual tokens

- `globals.css` gains the four `--tier-N` palette tokens (matching the mockup), surfaced through Tailwind as `tier-1` … `tier-4`.
- ~700 lines of editor-specific CSS (palette, three-column body, canvas chrome, mobile sheet stack, modal backdrop, status strip) live under the `0008` comment banner.

---

## Verification

- `pnpm --filter @setnayan/web typecheck` — **clean**.
- `pnpm --filter @setnayan/web lint --dir src/app/dashboard/seating ...` — **clean** for everything 0008 introduced.
- `pnpm --filter @setnayan/web build` — **`✓ Compiled successfully in 20.8s`**. The build's lint pass fails on **pre-existing** unescaped-entity errors in `[event-slug]/_components/widgets/*`, `plus-one-onboarding.tsx`, `no-event-state.tsx`, `login/page.tsx`, plus two `@typescript-eslint/no-explicit-any` rule-not-found errors in `lib/supabase/admin.ts` + `lib/supabase/middleware.ts`. None are in 0008 code; they were already failing on this branch before this work order. Recommend cleaning those up in a follow-up PR rather than bundling them here.

---

## Decisions / departures from the spec

1. **`tables` ⇒ `wedding_tables`.** The spec writes raw SQL against a `tables` table, but PG reserves that identifier and the existing 0001 schema already created `wedding_tables` to work around it. We extend `wedding_tables` rather than introduce a parallel relation. All other column names match the spec.
2. **Per-seat assignment is `(guests.table_assignment_id, guests.chair_seat_index)` rather than a sidecar `seat_assignments` jsonb.** Cheaper to query and the partial unique index `(table_assignment_id, chair_seat_index)` keeps one-guest-per-chair invariant at the database layer. The spec didn't prescribe a representation.
3. **Editor uses HTML5 drag-and-drop for guest → chair / palette → canvas, and pointer events for table-on-canvas drag.** The pointer path keeps capture/cancel reliable while dragging; HTML5 DnD is the only path that lets us drag a sidebar `<div>` onto an SVG element and get `dataTransfer.getData()` back without bespoke plumbing.
4. **Alignment-lock is implemented as the grid-snap toggle for V1.** The spec calls for both pink centerline guides and grid snap. V1 ships grid snap (default ON) and the toolbar toggle for it; the centerline-guide layer is deferred — see "Deferred" below.
5. **Print pack ships as a printable HTML route (`/dashboard/seating/print`)** rather than a generated PDF. The page is print-stylesheet-clean (every sign / place-card has its own `page-break-after`), so couples can hit ⌘P and download a PDF from the browser dialog. A real server-side PDF generator is the natural next iteration if the workflow needs it.
6. **Doors are rendered from the floor-plan record but not author-able yet.** A default main entrance is seeded on every event; the door-authoring UI (drag along walls, add side / service doors) is deferred.
7. **Venue dimensions wall-bound enforcement is deferred.** The schema, render path (walls drawn when `venue_known = TRUE`), and toolbar toggle exist; the hard-bound rejection on table-drag and the "X overlaps the dancefloor" message are V1.1.
8. **Auto-fill's "stronger snap on the four cardinal edges + center" for stage placement is not yet implemented.** The stage stays where it lands; couples can move it via grid-snap drag. Deferred to follow-up.

---

## Deferred (V1.1 candidates)

- **Centerline-guide alignment overlay** while dragging tables (pink horizontal/vertical hint lines that anchor to other tables' centers / edges). The toolbar toggle is wired so flipping the schema flag is a one-line change once the geometry pass lands.
- **Door-authoring UI** — drag-to-place along walls, add / remove side / service doors. The data model and renderer already accept the full door spec.
- **Venue-dimension hard bounds** + the metric scale ruler.
- **Stage / band / dancefloor drag-resize handles.** They render from data with the right defaults; resizing them is a corner-handle + keyboard-arrow follow-up.
- **Server-side PDF print pack** (currently HTML + print stylesheet, which couples can print or save-as-PDF from the browser).
- **Long-press to open detail sheet on desktop.** Tap-to-select-and-swap, double-click-to-rename, and the table-detail sheet from the toolbar all work; mobile sheet sequence is the main detail surface.
- **In-editor undo (Cmd+Z) for Auto-fill.** Auto-fill is gated behind a confirm modal and is idempotent; manual swap-back is the V1 reversal path.

---

## Files added / modified

```
A  supabase/migrations/20260509060000_seating_chart_editor.sql
A  apps/web/src/app/dashboard/seating/page.tsx
A  apps/web/src/app/dashboard/seating/actions.ts
A  apps/web/src/app/dashboard/seating/_components/seating-editor.tsx
A  apps/web/src/app/dashboard/seating/_components/floor-canvas.tsx
A  apps/web/src/app/dashboard/seating/_components/table-palette.tsx
A  apps/web/src/app/dashboard/seating/_components/guest-sidebar.tsx
A  apps/web/src/app/dashboard/seating/_components/table-detail-sheet.tsx
A  apps/web/src/app/dashboard/seating/_components/mobile-seating-view.tsx
A  apps/web/src/app/dashboard/seating/_lib/geometry.ts
A  apps/web/src/app/dashboard/seating/_lib/autofill.ts
A  apps/web/src/app/dashboard/seating/print/page.tsx
A  apps/web/src/lib/db/seating.ts
A  apps/web/src/lib/schemas/seating.ts
M  apps/web/src/lib/db/types.ts                  (TABLE_CATALOG, EventFloorPlan, tier helpers, +Guest.chair_seat_index)
M  apps/web/src/app/dashboard/_components/top-nav.tsx     (Seating nav link)
M  apps/web/src/app/dashboard/_components/mobile-tab-bar.tsx (Seating tab)
M  apps/web/src/app/globals.css                  (tier tokens + ~700 lines of editor styles)
M  apps/web/tailwind.config.ts                   (tier-N color exposure)
```

---

## Things to escalate before merging

- **Pre-existing lint failures on `main`-adjacent files** are blocking the production build's lint step. Cleaning them up is a 5-minute PR (mostly `'` → `&apos;`) but I left them alone to keep this work order focused. Suggest a follow-up "lint cleanup" task before any deploy.
- **The Auto-fill defaults to placing households together but does not yet enforce pair_with_guest_id adjacency.** Households share a table; pair_with_guest_id pairs share a table by virtue of household_id, but explicit adjacency on the chair ring isn't optimized for. Consider whether V1 needs that.
- **Decision check:** spec calls for "right-click on canvas → Lock placement". Current implementation uses the toolbar's Lock button when a table is selected. Confirm whether a right-click context menu is needed for V1 or if the toolbar is sufficient.
