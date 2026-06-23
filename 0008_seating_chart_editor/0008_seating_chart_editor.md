# 0008 — Seating Chart Editor

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - **SHIPPED at `app/dashboard/[eventId]/seating/`** (page + `actions.ts` + `floor-plan.tsx`), with the **13-table catalog** from `lib/seating.ts` (`round_8/10/12`, `long_banquet_6/8/10`, `family_head_12/14/16`, `sweetheart_2`, `serpentine_6/12/18`) — note the code names long tables `long_banquet_*` (spec body says `long_*`).
> - **No customer token wallet anywhere** — this surface has no payment dependency (free planning tool). If a paid "seat arrangement" tool SKU is referenced, the catalog code carries `tool_seat_arrangement_weekly` (Pro-widget style), not a wallet spend; 0003 wallet is RETIRED.
> - **Cross-cutting:** commission is 0% (no Setnayan Pay 3%); in-app paid SKUs use 0034 apply-then-pay + manual admin approval. None of this is load-bearing for the seating editor, which moves no money.
> - **2026-06-08 update (setnayan-platform PR #1070):** the **"Chair-level interaction"** + **"Auto-fill — role-tier rings"** sections below are now **BUILT** — `_components/seating-editor.tsx` renders per-seat chairs (photo/initials, side/group colour ring, name) around each table, with tap-to-seat/move/unseat, a grouped colour-coded sidebar (Tables · Individual Members · custom Member Groups), an "only unseated" filter, and a one-click **Auto-seat** (`computeAutoSeat` + `autoSeatGuests`, nearest-to-stage by tier, idempotent, skips sweetheart + the couple). Built brand-native, not the "Nunta Pe Mese" reference's palette. **Still NOT built** (the "full rebuild" the owner deferred): Add-Group colour-picker modal, two-tab Arrangements/Members layout, canvas zoom, dedicated mobile table-card view, **publish-QR + print pack**, and the per-seat serpentine wedge geometry (serpentine currently renders on a full circle). Verify any remaining publish/print-pack claims against the shipped `actions.ts` — those still don't exist.
> - **2026-06-11 update (seat-plan program, setnayan-platform PRs #1221/#1222/#1225/#1236/#1251/#1255):** **publish-QR + print pack are now BUILT** (supersedes the 2026-06-08 "still don't exist" line): `event_tables.qr_token` (32-hex UNIQUE, exists from creation) + `qr_published_at` + `event_floor_plan.published_at` (migration `20261101000000`, applied to prod), idempotent `publishSeating` (never re-rolls a token), and a self-contained printable pack at `/dashboard/[eventId]/seating/print` (cover + table directory · one QR sign sheet per table · place cards with each guest's personal QR). Also BUILT: a **per-table popup toolbar** beside the selected table replacing the top selected-table bar (inline rename `updateTableLabel` · **Seat people picker** with Guest/Group/Role tabs (`seatRoleAtTable`) · rotate · delete), **responsive** as the standing pattern (phone = bottom sheet, desktop/tablet = popover), and **continuous rotation**: two-finger twist on touch (~6° dead-zone, 15° snapped) + a desktop rotate handle (15° snaps, Shift = 1°). **⚠ This REVERSES this spec's "no continuous rotation / keep V1 spatial editing dumb" lock — owner-directed 2026-06-10.** The seat-plan engine is now pinned by 20 pure-logic CI tests (`tests/e2e/seating-logic.spec.ts`); the group auto-seat contract is **contiguous fill** (same/neighbouring tables), not same-table packing. Full record: `DECISION_LOG.md` 2026-06-11 "SEAT-PLAN PROGRAM" row.
> - **2026-06-13 update (setnayan-platform PR [#1375](https://github.com/iscasasola/setnayan-platform/pull/1375), schema + couple editor = PR 1 of 2):** the seat plan now carries a **second room on the SAME blueprint — a "Cocktail / Waiting Area"** (owner adjustment, supersedes the multi-area "Areas & booths" overlay drafted earlier the same day). It is a resizable, labelled rectangle drawn on the existing `event_floor_plan` canvas, normally placed **outside** the reception walls, where **booths place but tables/chairs are blocked** ("just 1 place"). Booths live on the existing `event_floor_booths` table, now tagged `zone` (`reception` | `cocktail`) + `event_vendor_id` (the booked vendor running the booth). The earlier `event_floor_areas` + `event_floor_objects` tables and the `/seating/areas` route are **RETIRED** (folded into `event_floor_booths`, then dropped). **New access model (the load-bearing change):** booked **stylist** vendors (`reception_decor`/`florist`) may size + arrange the whole cocktail area; booked **booth** vendors (`photobooth`/`mobile_bar`/`cake_maker`) may place/move/delete **only their own** linked booth — the **first** vendor WRITE access to a couple planning surface, gated on booked status + a couple-controlled `event_floor_plan.cocktail_vendor_edit` revoke switch, scoped to cocktail+booths only (never reception seating or guest PII). Vendor writes go through SECURITY DEFINER RPCs (PR C), not direct table RLS. Two write-scopes share one canvas: **seating** (tables/chairs/guests — couple + coordinator, under the exclusive seating lock) vs **booths+cocktail** (couple + stylist + booth vendors, outside the lock). **PR 1** [#1375 schema/viewer + #1378 couple-editor recovery] (migration `20261218000000`, **additive, APPLIED TO PROD 2026-06-13**) = schema + couple editor (cocktail room element + drag-resize + table-blocked-inside + booths-in-cocktail); **PR 2** [#1381] (migration `20261221000000`, additive, applied to prod) = **SHIPPED** vendor editor + SECURITY DEFINER write RPCs (booked + eligible-category + couple-revoke gated; ARRANGE tier = decor/florist/coordinator/lights vs BOOTH tier = booth/performer own-booth-only). The fold + DROP of the superseded `event_floor_objects`/`event_floor_areas` is a **deferred owner-gated cleanup** (test-event rows present; one-way). Full record: `DECISION_LOG.md` 2026-06-13 "COCKTAIL / WAITING AREA … SAME BLUEPRINT" row.
>
> When this body disagrees with the above, **the above wins.**

**Type:** Implementation work order (Claude Code ticket)
**Surface:** Setnayan Web → Couple Dashboard · **Bottom-nav tab: Guest List** (sub-section: Seating) · URL: `setnayan.com/dashboard/[event-id]/seating`
**Builds on:** 0000 (app shell, sign-in, event-scoped URL, bottom-nav routing), 0001 (`guests`, role taxonomy, table_assignment_id), 0002 (QR token format)
**Phase:** Phase 1 (web-first build sequence)
**Status:** Drafted 2026-05-09 — ready for Claude Code
**Date:** 2026-05-09
**Owner:** Ice (indaleciocasasolaii@gmail.com)

---

## What to build

The couple-facing **seating chart editor** on the Setnayan web dashboard. The couple lays out their reception floor plan — stage, then tables of any supported variation — and assigns guests from the 0001 guest list to specific tables. The editor is the canonical source of truth for both the printed reception layout and the runtime data that 0012 Papic reads to fan-out tags from a single table-QR scan.

This iteration is **strictly forward-sequenced** per project rule. It consumes 0001 (guest list, role taxonomy, RSVP state, personal QR tokens) and 0002 (QR token format). It **provides** the canonical `tables` table that 0012 Papic consumes when the paparazzo scans a table sign. It does not depend on any iteration > 0008.

---

## Visual reference (canonical)

`0008_seating_chart_editor.html` (in this same folder) is the canonical visual reference. It follows the dark-canvas / Web-Mobile-Both toggle pattern established by `0001_creating_guest_list.html`:

- The **desktop frame** shows the full editor — top dashboard nav, page header, three-column body (table palette + floor-plan canvas + guest sidebar), the floating Auto-fill action, and the Publish flow.
- The **mobile frame** shows a thumb-friendly version: a vertical stack of "table cards" with assigned guests, tap-to-edit bottom sheet, FAB for new tables. The full drag-and-drop spatial editor is intentionally **desktop-only**; mobile is for review, guest swap, and quick edits.

Reuse the Filipino Heritage tokens (cream `#FAF6F0`, charcoal `#1A1A1A`, terracotta `#C97B4B`, fonts Cormorant Garamond + Manrope + DM Mono). Don't reinvent.

---

## Stack & conventions

Per `CLAUDE.md` and the rest of the dashboard work:

- **Frontend:** Next.js 15 App Router. Editor canvas is a Client Component (drag/drop is interactive). Table list and guest sidebar are RSC where possible. TypeScript strict.
- **Canvas tech:** Plain SVG + pointer events. Do **not** pull in a heavy library (Konva, Fabric, Pixi) — V1's interaction surface is small enough that bespoke SVG is faster to ship and debug. Reach for Konva only if a real V1.1 requirement justifies it.
- **State:** Zustand or React state for in-editor draft state. Persist to backend via debounced PATCH every 1.5s while editing.
- **Validation:** Zod schemas for table create/update payloads, server- and client-side.
- **Auth:** Same dashboard guard as 0001 — couple must own the event.

---

## Route

```
setnayan.com/dashboard/seating
```

Sits inside the same dashboard shell as 0001. Add a "Seating" entry to the dashboard nav between Schedule and Suppliers.

---

## Data model

### `tables` table

```sql
CREATE TABLE tables (
  table_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  table_type          TEXT NOT NULL CHECK (table_type IN
                        ('round_8', 'round_10', 'round_12',
                         'long_6', 'long_8', 'long_10',
                         'family_head_12', 'family_head_14', 'family_head_16',
                         'sweetheart_2',
                         'serpentine_6', 'serpentine_12', 'serpentine_18')),
    -- Serpentine capacity = 6 × segment_count. 1/2/3 segments = 6/12/18 seats.
    -- Each segment is a quarter-donut wedge with 2 inner-cove chairs + 4 outer chairs.
  capacity            SMALLINT NOT NULL,
    -- Derived from table_type but stored explicitly so future custom-capacity tables
    -- (V1.1) don't require a migration.
  label               TEXT NOT NULL,
    -- Couple-editable display label, e.g., "Sponsors 1", "Reyes Family", "Friends East".
  position_x          REAL NOT NULL,
  position_y          REAL NOT NULL,
    -- Floor-plan coordinates in the canvas's own normalized space (0..1000 on each axis).
    -- Backend never assumes pixels; renders pick a viewport size.
  rotation_deg        SMALLINT NOT NULL DEFAULT 0,
    -- Round, sweetheart, family_head: 0 only.
    -- Long banquet (long_*) and serpentine (serpentine_*): rotation is supported in
    -- 45-degree increments — 0 / 45 / 90 / 135 / 180 / 225 / 270 / 315. Couples align
    -- entourage and friend tables to wall edges and aisles, which are rarely orthogonal.
  qr_token            TEXT UNIQUE,
    -- NULL until the couple publishes. Generated server-side at publish; never edited.
  qr_published_at     TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_tables_event ON tables(event_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_tables_qr_token ON tables(qr_token) WHERE qr_token IS NOT NULL;
```

`tables(table_id)` is the FK already referenced by `guests.table_assignment_id` (0001). 0001's column was created with no editing UI; this iteration is the editing UI.

### `event_floor_plan` table (singleton per event)

```sql
CREATE TABLE event_floor_plan (
  event_id            UUID PRIMARY KEY REFERENCES events(event_id) ON DELETE CASCADE,

  -- Stage
  stage_x             REAL NOT NULL DEFAULT 500,
  stage_y             REAL NOT NULL DEFAULT 95,
  stage_width         REAL NOT NULL DEFAULT 220,
  stage_height        REAL NOT NULL DEFAULT 80,
  stage_label         TEXT NOT NULL DEFAULT 'Stage',

  -- Band platform (optional, adjacent to or on stage)
  band_present        BOOLEAN NOT NULL DEFAULT FALSE,
  band_x              REAL,
  band_y              REAL,
  band_width          REAL,
  band_height         REAL,
  band_label          TEXT NOT NULL DEFAULT 'Band',

  -- Dancefloor (optional rectangle for first dance / parents' dance / games)
  dancefloor_present  BOOLEAN NOT NULL DEFAULT FALSE,
  dancefloor_x        REAL,
  dancefloor_y        REAL,
  dancefloor_width    REAL,
  dancefloor_height   REAL,

  -- Doors — at least one (main entrance) is required at publish.
  doors               JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Array of { id, kind: "main" | "side" | "service", wall: "top"|"bottom"|"left"|"right",
    --           offset_along_wall: 0..1, width, label }.
    -- Example main entrance at bottom-center: { kind: "main", wall: "bottom",
    -- offset_along_wall: 0.5, width: 120, label: "Main entrance · bridal walk" }.

  -- Venue dimensions (OPTIONAL).
  venue_known         BOOLEAN NOT NULL DEFAULT FALSE,
  venue_width_m       REAL,
  venue_length_m      REAL,
    -- When venue_known = FALSE, the editor canvas auto-grows to fit content and
    -- imposes NO placement bounds. When venue_known = TRUE, the canvas renders the
    -- room outline at the stated metric dimensions and the editor enforces hard
    -- bounds — tables can't be dragged outside the walls, can't overlap doors,
    -- can't sit on the dancefloor. Couples flip the toggle in the toolbar.

  -- Editor preferences (persisted across sessions)
  alignment_lock      BOOLEAN NOT NULL DEFAULT TRUE,
    -- When ON, dragging a table snaps it to other tables' centerlines and edges,
    -- and the editor renders alignment guides (vertical / horizontal pink lines)
    -- while the drag is in progress. Tap-toggleable in the toolbar.
  grid_snap           BOOLEAN NOT NULL DEFAULT TRUE,
    -- 10-unit grid snap, separate from alignment lock.

  canvas_width        REAL NOT NULL DEFAULT 1000,
  canvas_height       REAL NOT NULL DEFAULT 900,
    -- Used only when venue_known = FALSE. Auto-grows when the couple drops a
    -- table near the canvas edge.

  published_at        TIMESTAMPTZ,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

There is one floor plan per event. Pre-publish: `published_at IS NULL`, no QR tokens on tables. Post-publish: QR tokens minted, downstream consumers (0012) can resolve `setnayan:table:{table_id}` URLs.

### Venue elements summary

The floor plan is more than tables — it carries the whole reception room:

| Element | Optional? | Purpose |
|---|---|---|
| Stage | required | Where the couple sits (the sweetheart table is in front of, not on, the stage) |
| Band platform | optional | Adjacent to or on the stage; defaults absent for couples without a live band |
| Dancefloor | optional | First dance, parents' dance, games. Tables cannot be placed inside it. |
| Doors (≥ 1) | required | At least one main entrance for the bridal walk. Side / service doors optional. |
| Venue dimensions | optional | When provided, editor enforces wall-bounded placement; when blank, free placement. |
| Alignment lock | toggle | Drag-time guides + snap to other tables' edges and centerlines. Default ON. |

### Table-type catalog (frontend constant)

```ts
export const TABLE_CATALOG = [
  { type: 'round_8',         shape: 'round',      capacity: 8,  size: { w: 120, h: 120 } },
  { type: 'round_10',        shape: 'round',      capacity: 10, size: { w: 140, h: 140 } },
  { type: 'round_12',        shape: 'round',      capacity: 12, size: { w: 160, h: 160 } },
  { type: 'long_6',          shape: 'long',       capacity: 6,  size: { w: 80,  h: 180 } },
  { type: 'long_8',          shape: 'long',       capacity: 8,  size: { w: 80,  h: 220 } },
  { type: 'long_10',         shape: 'long',       capacity: 10, size: { w: 80,  h: 260 } },
  { type: 'family_head_12',  shape: 'long_head',  capacity: 12, size: { w: 220, h: 70  } },
  { type: 'family_head_14',  shape: 'long_head',  capacity: 14, size: { w: 260, h: 70  } },
  { type: 'family_head_16',  shape: 'long_head',  capacity: 16, size: { w: 300, h: 70  } },
  { type: 'sweetheart_2',    shape: 'sweetheart', capacity: 2,  size: { w: 110, h: 70  } },
  { type: 'serpentine_6',    shape: 'serpentine', capacity: 6,  segments: 2, size: { w: 220, h: 120 } },
  { type: 'serpentine_12',   shape: 'serpentine', capacity: 12, segments: 4, size: { w: 380, h: 140 } },
  { type: 'serpentine_18',   shape: 'serpentine', capacity: 18, segments: 6, size: { w: 540, h: 160 } },
] as const;
```

Sizes are in normalized canvas units. Render scales them to viewport pixels.

**Family-head tables are long rectangulars, not ovals** — they're the wider banquet-style table used for the immediate family of the bride or groom, and they're rendered exactly that way on the canvas.

**Serpentine tables are composed of quarter-donut segments.** Each segment is a 90-degree quarter of a donut (annulus) with **1 inner-cove chair + 2 outer-edge chairs = 3 seats per segment**. The geometry is forced — the inner arc is short and fits one chair around its midpoint; the outer arc is longer and fits two chairs spaced symmetrically. Couples assemble multiple segments into longer C-shapes, U-cups, or longer S-waves common in Filipino-wedding entourage seating. The catalog ships three configurations: `serpentine_6` (2 segments — a U-cup), `serpentine_12` (4 segments — a long S-wave), `serpentine_18` (6 segments — a generous loop). Serpentines are **resizable in place** — couples add or remove a segment from a placed serpentine via the table-detail sheet without deleting and re-creating it. The relationship is materialized as a `segments` integer column on `tables` for serpentine rows; capacity is computed as `3 * segments`.

### Resizable venue elements

The **stage**, **band platform**, and **dancefloor** are resizable rectangles — couples drag handles at the corners to scale them. Width and height persist on `event_floor_plan`. Default sizes are sensible for a typical Filipino reception (stage 220 × 80, band 100 × 70, dancefloor 420 × 130 in normalized canvas units), but every venue has its own dimensions and the editor accommodates that. Tables themselves are **not** drag-resizable — capacity is bound to type, so growing a 10-seat round into a 12-seat round means swapping the table type, not stretching it.

---

## Page composition (desktop)

Three-column editor inside the dashboard shell. Top to bottom:

1. **Dashboard top nav** — same shell as 0001. "Seating" link active.
2. **Page header** — breadcrumb "Dashboard / Seating", H1 "Seating Chart", action cluster on the right: `Auto-fill`, `Print pack` (disabled until publish), `Publish` (terracotta primary).
3. **Status strip** — three small pills: `{N} tables · seats {assigned}/{capacity}`, `{unseated_rsvp_yes} RSVP'd guests still unseated`, `Draft` or `Published · {date}` badge.
4. **Three-column body**:
   - **Left rail (220px sticky)** — **Table palette**: collapsible groups for Round / Long Banquet / King-Family / Sweetheart / Serpentine. Each entry shows the shape preview + capacity. Drag from palette onto canvas to add a table.
   - **Center (fluid)** — **Floor-plan canvas**. Dark-cream surface. The stage is a draggable rounded rectangle with a label; couple drags it anywhere on the canvas (top, bottom, left, right edge, or true center for in-the-round). Tables snap to a 10-unit grid (toggleable). Selected table shows resize handles for rotation only (not scale — capacity is fixed by type). Distance-from-stage isolines render as faint concentric guides while Auto-fill is engaged so the couple sees where each ring lands.
   - **Right rail (300px sticky)** — **Guest sidebar**. Tabs: `Unseated` (default), `By table`. Unseated tab pulls every RSVP'd guest from 0001 not yet assigned, grouped by role tier (Tier 1 / 2 / 3 / 4 — see Auto-fill below) with a count per tier. Drag a guest onto a table to assign; drag a guest from a table back to the sidebar to unseat. Tier color matches the ring color used on the canvas.
5. **Floating action — Auto-fill** — bottom-right of the canvas. Click opens a confirmation card: "Auto-fill 132 unseated RSVP'd guests across 18 tables using role-tier rings around the stage. This won't move guests you've already placed." Buttons: `Cancel` · `Auto-fill`.
6. **Publish dialog** — overlays page on `Publish`. Reviews capacity, lists any RSVP'd guests still unseated, asks final confirmation. On confirm: server mints `qr_token` for every table, sets `event_floor_plan.published_at`, makes Print pack downloadable.

## Page composition (mobile)

Mobile is intentionally a **review and adjust** surface, not a full layout authoring tool. Spatial drag-drop on a 390pt viewport is unusable; couples will edit layout on desktop and use mobile to swap guests, rename tables, or last-minute-fix on the day. Top to bottom:

1. **App header (60pt)** — back, title "Seating", and a single 44×44pt action button (`···`) opening a sheet with `Auto-fill`, `Print pack`, `Publish`.
2. **Status row** — same three pills as desktop, scrollable horizontally.
3. **Mini floor plan (220pt tall)** — read-only thumbnail of the published or draft layout. Tappable: tapping a table scrolls the card list to that table.
4. **Table card list** — vertical list, each card 96pt minimum, showing:
   - Table label + type chip ("Round · 10").
   - Stacked tier color ribbon on the left edge.
   - Avatars of seated guests (overlap, max 5 visible + "+ N more").
   - `{seated}/{capacity}` count chip on the right.
   - Tap → full-screen table-detail sheet with seated guests, role chips, swap/unseat actions, and a "Move guest to another table" picker.
5. **Unseated banner** — fixed below the header if any RSVP'd guests are unseated: "{N} guests still unseated · Tap to review". Tap opens a full-screen sheet listing them grouped by tier.
6. **FAB (+)** — terracotta, bottom-right. Opens "Add table" full-screen sheet — pick type + capacity + auto-place near the stage. (Manual position-edit is desktop-only.)
7. **Bottom tab bar** — Overview, Guests, Seating (active), More.

All mobile sheets follow the 0001 mobile convention: full-screen, "Done"/"Save" top-right, swipe-down to dismiss. Tap targets ≥44pt everywhere.

---

## Chair-level interaction (per-seat circles)

Every table renders its individual chairs as small circles around the table's perimeter — one per seat. Couples interact with seats and tables at two distinct grain sizes.

### Chair appearance

Each chair circle is filled in one of two ways:

- **Profile photo** — when the guest has a photo attached to their guest-list record (0001), the chair circle is filled with that photo, clipped to a circle, with a thin colored ring keyed to the guest's `side` (rose for bride's side, blue for groom's side, gold for both).
- **Initials** — when no photo is available, the chair shows the guest's two-letter initials (first name + last name initial) in white, on a side-coded gradient fill (same color system as the avatars in 0001).

Empty seats render as a white circle with a dashed gray outline and no glyph inside.

Chairs are arranged automatically around the table they belong to:

- **Round** — evenly spaced around the perimeter at `radius_table + chair_offset`. 10 seats = 36° apart, etc.
- **Long banquet** — half the seats along each long edge, evenly spaced; ends typically left empty unless the couple manually adds head-of-table seats.
- **Family-head long** — same as long banquet, scaled wider.
- **Sweetheart** — exactly two chairs, side by side.
- **Serpentine** — chairs follow the curve on the outside of the bend, evenly spaced along the arc length.

### Interactions

| Gesture | Target | Effect |
|---|---|---|
| Tap | Chair (any) | Selects the chair. If the seat was filled, the next tap on an empty seat moves that guest there (a single-seat swap). If the seat was empty and another chair was already selected, that guest moves to the empty seat. |
| Long-press | Chair | Opens that guest's detail sheet (same surface as 0001's detail drawer) — name, role, RSVP, plus-one, photo consent, table assignment. |
| Tap | Table body (anywhere not on a chair) | Selects the whole table. Next tap on another table swaps the two tables' positions on the canvas (everyone seated stays with their table — the tables themselves trade places). |
| Long-press | Table body | Opens the table-detail sheet with rename / lock / delete / capacity controls. |

Tap-to-swap-seat and tap-to-swap-table share the same tap gesture but operate on different targets — the target is unambiguous because chairs are distinct circular hit-zones around the table edge, and the table body is everything else inside the table outline.

### Knowing who an initial-only chair belongs to

Initials alone are ambiguous in a 250-guest reception, so the editor surfaces the full name in two complementary ways:

- **Hover (desktop) / single-tap (mobile)** — selects the chair and shows a small floating name pop above it ("Carla Mendoza · Sponsors 2 · ROUND 12"). The pop persists until the couple taps elsewhere.
- **Selected-chair sticky banner** — at the top of the canvas (desktop) or above the table-detail sheet (mobile), the currently-selected chair shows the guest's name, role, side, and RSVP status. While a chair is selected, the editor is in "swap mode": the cursor / banner reads "tap an empty seat to move {Name}", and all empty seats across the floor plan are highlighted.

Initials-only chairs never block identification — the couple is always one tap away from the full name.

## Auto-fill — role-tier rings

The auto-fill algorithm maps the 0001 role taxonomy to four concentric rings centered on the stage.

### Tier definitions

```
Tier 1 — innermost ring (closest to stage):
  - role IN ('principal_sponsor', 'officiant', 'reader_lector', 'soloist_musician')
  - PLUS guests flagged as immediate family (group_category='family' AND custom_tags
    contains 'parents' or 'siblings'). If the couple hasn't tagged immediate family,
    fall back to all family-side guests for tier 1 and surface a warning.

Tier 2 — second ring:
  - role IN ('maid_of_honor', 'matron_of_honor', 'best_man', 'bridesmaid', 'groomsman',
             'candle_sponsor', 'veil_sponsor', 'cord_sponsor', 'coin_sponsor',
             'ring_bearer', 'bible_bearer', 'coin_bearer', 'flower_girl')

Tier 3 — third ring:
  - group_category='family' AND role='guest' AND NOT in tier 1
    (extended family — aunts, uncles, cousins, in-laws beyond immediate)

Tier 4 — outermost ring:
  - group_category IN ('friends', 'work', 'school', 'other')
  - All plus_one rows (regardless of mode) inherit their primary's tier — the +1 sits
    with the inviter, not in their own ring. If that overflows the inviter's table,
    the +1 spills outward one ring.
```

### Algorithm

```text
1. Snapshot:
   - eligible_guests = all guests for event WHERE rsvp_status = 'attending'
                        AND table_assignment_id IS NULL.
   - tables_pool = all tables NOT in the "manually-locked" set
                   (couple can right-click a table → Lock placement; locked tables
                    keep their current guests and are skipped).
   - exclude tables of type 'sweetheart_2' from the pool — sweetheart is for the
     couple, not the auto-fill rotation.

2. Compute distance_from_stage for each table in the pool:
     dist = euclidean( table.center, stage.center )

3. Sort tables_pool ASC by dist, ties broken by (y, x).

4. Group eligible_guests by tier (1 → 4).

5. Assign tier 1 guests, in declared role priority order
   (principal_sponsor before officiant, etc.), to the first M tables where M is the
   smallest count whose total capacity ≥ tier 1 size. Prefer 'king_*' or 'round_12'
   tables for tier 1 if available; otherwise fall back to any.

6. Repeat for tier 2 (next-closest tables), tier 3, tier 4 outward.

7. Within a tier, household-aware packing:
   - Guests sharing a household_id stay on the same table when possible.
   - Paired guests (pair_with_guest_id) and primary+plus_one pairs are adjacent.

8. Stop when all eligible_guests placed OR pool exhausted. Surface any overflow
   in the publish dialog as "{N} guests still unseated".

9. Auto-fill is idempotent on already-placed guests — they are not moved. Couple
   can re-run after manual edits without losing work.
```

### What auto-fill does not do

- It does not place declined or pending RSVPs (couples don't seat people who said no).
- It does not place the couple themselves — the sweetheart table is reserved manually.
- It does not place guests with `photo_consent = FALSE` differently — consent is a tagging concern, not a seating concern.
- It does not minimize "bride's-side / groom's-side mixing" or any other relational heuristic in V1. Couples want roles right; family politics they handle by manual swap.

---

## Publish flow + table QR generation

`Publish` is the single moment QR tokens become real and downstream consumers can read them.

> **Table QR vs guest QR — cross-reference (2026-05-22):** The `tables.qr_token` minted here (`setnayan://table/{token}`) is **a SEPARATE token from `guests.qr_token`** (the canonical per-guest token declared in [0001](../0001_creating_guest_list/0001_creating_guest_list.md) and explained in [0002 § Unified QR Code Lifecycle Model](../0002_qr_invitation_system/0002_qr_invitation_system.md)). The place-card print pack downloaded from this iteration carries each guest's existing `guests.qr_token` — no new token at print time. Table QRs (on table tents) fan tags to all guests seated at the table (capped at 10 per photo per 0012's tag-cap rule); guest QRs (on place cards) tag exactly one person. Both are first-class scan vectors in 0012; they don't compete or overlap.

### What `Publish` does (server-side, atomic)

1. Validate every `attending` guest has a `table_assignment_id` (warn but don't block — couples sometimes finalize seating after invitations are out).
2. For every `tables` row where `qr_token IS NULL`, generate a `qr_token` (32-char hex).
3. Set `qr_published_at = now()` on each minted row.
4. Set `event_floor_plan.published_at = now()`.
5. Atomically commit. On failure, no QR is minted (no half-published state).

Re-publish is idempotent — tables already minted keep their tokens; new tables added since the last publish get fresh ones.

### Print pack (downloadable PDF)

Once published, `Print pack` becomes enabled in the page header. Clicking it generates a zip / single PDF containing:

- **Floor-plan overview** (1 page) — venue layout with table labels and guest counts.
- **Per-table sign sheets** — one A5 page per table, with:
  - Table label in Cormorant Garamond, large.
  - Couple-name footer.
  - **A printed QR code** linking to `setnayan:table:{table_id}?token={qr_token}` — the same token format as 0002 / spec 10.
- **Per-guest place cards** (optional checkbox in the dialog) — a place card per seated guest with their **personal QR token from 0001** rendered. Each card displays the guest's display name, table label, and the QR.

The print pack is the bridge between the digital seating chart and the physical reception. Two QR planes ship to the venue:

- **Table-sign QR** → scanned by a paparazzo to fan-out a tag to **all guests seated at that table** (bounded by the global 10-tag-per-photo cap; see 0012 / spec 10 for the alphabetize-and-truncate rule).
- **Personal QR (per guest)** → scanned by a paparazzo for individual tagging, AND scanned by a peer guest to tag a friend/relative. **Per couple decision (2026-05-09):** guests cannot tag from a roster or list — the only path to tag another guest is to physically scan that guest's personal QR. This preserves "presence at the venue" as the consent gate for tagging and removes the privacy hazard of a browseable guest directory inside the gallery app.

---

## Functional scope

### Must work end-to-end

- **Add table** — drag from palette OR mobile FAB → "Add table" sheet. Default position: nearest empty grid cell to the stage. Validates: max 60 tables per event for V1.
- **Move table** — pointer-drag on canvas. **Alignment lock** (default ON) snaps the dragged table to other tables' centerlines and edges, rendering pink horizontal / vertical guide lines while the drag is in progress. **Grid snap** (default ON, separate setting) snaps to a 10-unit grid. Invalid placements (overlapping another table, on the dancefloor, outside venue walls when `venue_known = TRUE`, off-canvas otherwise) revert with a shake animation.
- **Rotate table** — selected table shows a rotation handle.
  - Round, sweetheart, family-head: rotation is locked at 0°.
  - Long banquet (`long_*`) and serpentine (`serpentine_*`): rotation in **45° increments** (0/45/90/135/180/225/270/315). Couples align entourage and friend tables to non-orthogonal walls and aisles.
- **Move stage / band / dancefloor** — drag any of these venue elements to any coordinate inside the canvas. The four cardinal edges and the center have stronger snap. Band and dancefloor can be added or removed via the toolbar's "Venue elements" menu; a wedding without a live band simply omits the band rectangle.
- **Add / move doors** — toolbar → "Add door". Doors snap to walls only; pick a wall, drag along it. At least one door of `kind: 'main'` must exist by Publish. Doors render as arched gaps in the wall.
- **Set or clear venue dimensions** — toolbar → "Venue · 26 × 30 m" toggle.
  - When **set**, the canvas renders the room walls at the stated metric dimensions, all placement is bounded by walls / doors / dancefloor, and the couple sees a metric scale next to the canvas.
  - When **unset** (the default for couples who haven't measured their venue yet), the canvas is borderless and free-form — tables can sit anywhere, and the canvas auto-grows when a table is dragged near the edge.
- **Edit table label** — double-click on canvas OR rename in mobile sheet.
- **Lock table** — right-click on canvas → "Lock placement". Locked tables are skipped by Auto-fill and outlined with a dashed stroke. Click again to unlock.
- **Per-seat assignment** — see "Chair-level interaction" above. Drag a guest from the sidebar onto an **empty chair** to seat them at that exact seat. Drop on the table body (not on a specific chair) to seat at the next available empty chair, ordered counterclockwise from the head.
- **Tap chair** = swap the seated guest to a different empty seat (cross-table is allowed). **Long-press chair** = open guest details. **Tap table body** = swap that whole table's position with another table on the canvas. **Long-press table body** = open table settings.
- **Unseat guest** — drag chair back to sidebar OR table-detail sheet → "Unseat". Sets `guests.table_assignment_id = NULL`.
- **Auto-fill** — runs the algorithm above. Confirmable. Reversible via Cmd+Z within the editor session (in-memory undo stack, no server-side undo).
- **Publish** — confirms, mints QR tokens, enables Print pack.
- **Print pack** — downloads PDF zip. Re-downloadable any time after publish.

### Out of scope for this iteration

- **AI seating optimization** (relationship graphs, dietary clustering, age clustering) — defer to V1.1 or later.
- **Custom table shapes** beyond the 13 catalog entries — V1.1.
- **Vendor / supplier seat assignments** (DJ, photographer dinner table) — handle via custom_tags + ad-hoc tables for V1.
- **Day-of seat re-shuffle from mobile while events are live** — covered by the basic mobile swap UI; no real-time push to the paparazzi app for seat changes mid-event in V1.

---

## Acceptance criteria

- [ ] Page accessible at `/dashboard/seating` for an authenticated couple with an event.
- [ ] Visual parity to `0008_seating_chart_editor.html` at 1280px desktop and 390px mobile widths.
- [ ] All 13 table-catalog entries can be added, moved, rotated, deleted.
- [ ] Stage can be placed anywhere inside the canvas (top, bottom, left, right, center) and persists across reloads.
- [ ] Drag from palette to canvas creates a table at the drop point.
- [ ] Drag a guest from sidebar to a table updates `guests.table_assignment_id`; drag back unseats.
- [ ] Auto-fill never moves an already-placed guest; never touches a locked table; never seats declined/pending RSVPs; never seats a sweetheart-type table.
- [ ] Auto-fill respects the four-tier role grouping defined in this spec.
- [ ] Publish mints `qr_token` for every table (UNIQUE) and sets `published_at`. Re-publish does not mutate already-minted tokens.
- [ ] Print pack PDF includes per-table sign sheets with the table QR rendered, and (when checked) per-guest place cards with the guest's personal QR from 0001.
- [ ] Mobile view: table cards render seated guests' avatars; tapping a card opens the full-screen table-detail sheet; swap and unseat work.
- [ ] Mobile does NOT expose drag-drop layout authoring; manual position editing only on desktop.
- [ ] Server-side authorization: a couple can only read/write tables and floor plans for their own events. Verify with two events.
- [ ] All editor writes are debounced (1.5s) and atomic; no half-saved table rows.
- [ ] Resilience: refreshing mid-edit reloads from server-confirmed state, never localstorage-only state.

---

## Privacy & compliance

- **No guest list inside the tagging UI for guests.** Per couple decision 2026-05-09, peer-to-peer guest tagging is QR-scan only on the **first tag**. The seating chart's print-pack output (personal QR cards) is the consent-gating distribution mechanism — a guest's QR card is in their physical possession, and they decide whether to share it.
- **Tag-once trust handshake.** Per couple decision 2026-05-09, scanning a guest's personal QR is a one-time consent gesture. Once guest A has scanned guest B's QR once, A is added to B's `tag_consent_grantees` set and may tag B in any of A's own photos thereafter without rescanning. The relationship is one-way (A→B, not B→A) and per-event. Revocation is via the guest-side privacy panel (deferred to V1.1) or a global per-event opt-out from photo_consent in 0001's detail drawer (which stops all tagging). This is primarily a 0012 / future-iteration concern, but the seating chart is the surface that distributes the QR cards and therefore the gateway to the trust handshake — the print-pack design must keep personal QRs legible enough to scan reliably.
- Table-QR fan-out is bounded by the existing 10-tag-per-photo cap (spec 10, 0012). Tables of capacity > 10 alphabetize and truncate per the existing rule; the warning is surfaced in the paparazzi app, not here.
- Photo consent (`guests.photo_consent`) is unchanged by this iteration — opt-out remains a per-guest toggle on 0001's detail drawer.

---

## Offline behavior

Editor authoring is desktop-online only — couples plan seating from home or office. The print pack is the offline artifact for event day:

- Once published, the Print pack PDF works fully offline at the venue.
- Couples are encouraged to print signs and place cards in advance; we don't rely on day-of internet for either layer.
- The paparazzi app's table-QR scan path (0012) is offline-tolerant via the WAL/queue pattern documented there.

---

## Companion files to read before starting

1. `CLAUDE.md` — project context, locked SKUs, decision log.
2. `0001_creating_guest_list/0001_creating_guest_list.md` — guest data model, role taxonomy, RSVP states, personal QR tokens.
3. `0001_creating_guest_list/0001_creating_guest_list.html` — canvas pattern + design tokens to reuse.
4. `0002_qr_invitation_system/` — QR token format conventions.
5. `0012_papic/` — downstream consumer of `tables.qr_token`. Read it to confirm the URL format the table sign needs to encode.
6. `10_Papic_Feature_Specification.md` — full Papic spec, table-tag fan-out and the 10-tag cap.

---

## Notes for Claude Code

- This iteration consumes 0001 and 0002 only. Forward references to 0012 are framed as **"this provides the canonical `tables` table; 0012 reads it"** — there is no backward dependency on 0012.
- The dashboard shell already exists from 0001's work order. Add the "Seating" nav link there; do not rebuild the shell.
- Keep V1 spatial editing dumb: pointer-drag with grid snap, no auto-arrange beyond Auto-fill, no swap-on-overlap, no continuous rotation. The temptation to over-engineer the canvas is real; resist it.
- When you finish, save a short summary at `0008_seating_chart_editor_result.md` (this folder) noting what was built, what was deferred, and any decisions to escalate.
