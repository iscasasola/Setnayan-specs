# Seating Chart — As-Built Reference (2026-06-21)

> **Why this exists.** A snapshot of how the seat plan *actually works today*, captured before any replan (including the proposed Three.js / React-Three-Fiber "Play / Showcase" mode). When we rebuild the experience, this is the checklist of behavior, data, and rules that must survive. **Code is canonical**; this doc is a frozen description of `origin/main` + the in-flight grouping PR (#1963).
>
> Source files (in `apps/web`): the editor `app/dashboard/[eventId]/seating/_components/seating-editor.tsx` (~4.9k lines, the whole canvas), server actions `…/seating/actions.ts`, pure logic + fetchers `lib/seating.ts`, PDF builder `lib/seating-pdf.ts`, public finder `lib/seat-lookup.ts`. Don't treat the older `0008_seating_chart_editor.md` spec as current where it disagrees with this.

---

## 0. Mental model (read this first)

The seat plan is a **2D top-down floor-plan editor scoped to one event**. The couple:

1. **Shapes the room** — optional to-scale walls (venue metres), a stage, dance floor, entrance, service door, cocktail area, vendor booths, and wayfinding signs.
2. **Drops tables** from an 11-type catalog and arranges them (drag, rotate, group, or one-tap auto-arrange).
3. **Seats guests into specific chairs** — manually, by custom group, by role tier, or one-tap auto-seat.
4. **Publishes** — which mints per-table + per-guest QR codes and unlocks the downstream surfaces: a public no-login "find your seat" search, a printable pack, PDF exports, a caterer meal report, and a read-only vendor viewer.

Only **one person edits at a time** (a server lock), with **live presence** (cursors, selections) for everyone else. An optional **zone walkthrough video** lets the couple record a first-person walk so guests can watch their path to a table.

Everything downstream (QR signs, print pack, caterer counts, vendor viewer, find-seat) is keyed off the **table positions + seat assignments** stored from this one editor. A replan changes the *presentation*; this data contract is what must not break.

---

## 1. Surfaces & routes

| Route | Who | What |
|---|---|---|
| `/dashboard/[eventId]/seating` | Couple / `seat_plan=edit` coordinator | The editor (canvas + people sidebar + toolbar). |
| `/dashboard/[eventId]/seating/walkthrough` | Couple / coordinator | Record + publish per-zone walk videos. |
| `/dashboard/[eventId]/seating/print` (GET) | Couple | Printable HTML pack (directory + QR table signs + place cards). |
| `/dashboard/[eventId]/seating/export?mode=moodboard\|blueprint` (GET) | Couple | PDF floor plan (styled vs technical). |
| `/dashboard/[eventId]/seating/caterer?format=csv` (GET) | Couple | Meal-count report (HTML or CSV). |
| `/[slug]/find-seat` + `/api/seat-lookup/[slug]` | **Public, no login** | Guest types their name → table + optional walk video. |
| `/vendor-dashboard/clients/[eventId]/seat-plan` | Booked vendor | Read-only floor map + **counts only** (never guest names). |
| `/tour/seating` | Marketing | Demo of the find-seat finder. |

---

## 2. Data model

All tables `public.*`, RLS enabled at create (couple read+write; coordinator with `seat_plan='edit'`; admins observe).

- **`event_tables`** — one row per table. Key cols: `table_id` (UUID PK), `public_id` (`S89T…`), `event_id`, `table_label`, `table_type` (enum, §3), `capacity` (1–32), `x_pos`/`y_pos` (NUMERIC **percent** of canvas), `rotation_deg` (int, 0 default), `removed_seats` (int[] — deleted chair indices), `qr_token`, `qr_published_at`, `link_group_id` + `link_group_label` (grouping, §5.4), `walkthrough_zone_id`, `sort_order`.
- **`event_seat_assignments`** — `assignment_id`, `event_id`, `table_id`, `guest_id`, `seat_number`, **`UNIQUE(event_id, guest_id)`** → one seat per guest per event.
- **`event_floor_plan`** — singleton per event (PK `event_id`). Stage x/y/w/h, entrance on/x/y, dance on/x/y/w/h, service entrance on/x/y, cocktail room x/y/w/h/label/metres/`cocktail_schedule_block_id`/`cocktail_vendor_edit`/`cocktail_linked`, venue width/length metres, and **`published_at`** (the publish gate for every guest/vendor surface).
- **`event_floor_booths`** — vendor booths: `booth_id`, `booth_type`, `label`, `x_pos`/`y_pos`, `zone`, `event_vendor_id`, `sort_order`.
- **`event_floor_signs`** — wayfinding arrows: `sign_id`, `label` (≤40, default "Restrooms"), `x_pos`/`y_pos` (0–100), `rotation_deg` (0 = up), `sort_order`.
- **`event_floor_areas` / `event_floor_objects`** — vendor cocktail-area objects (drive the vendor viewer pins).
- **`seating_editor_locks`** — `lock_id`, `event_id` (**UNIQUE** → one editor/event), `holder_user_id`, `holder_label`, `acquired_at`, `last_heartbeat_at`. RLS = SELECT only; all writes via SECURITY DEFINER RPCs.
- **`event_walkthrough_zones`** — `zone_id`, `event_id`, `label`, `video_r2_key`, `video_mime_type`, `duration_seconds`, `poster_r2_key`, `published_at`.

**RPCs** (all `SECURITY DEFINER`):
- `acquire_seating_editor_lock(event, label)` → `{status: acquired|refreshed|took_over|held_by_other|not_authorized}`.
- `refresh_seating_editor_lock(lock_id)` → `{status: ok|lost}` (30 s heartbeat).
- `release_seating_editor_lock(lock_id)`.
- `assert_seating_lock_held(event, lock_id?)` — **dormant** belt-and-suspenders; server-action layer calls it before gated mutations; staged for a future RLS cutover.
- `public_seat_lookup(slug, query)` — granted to `anon`; §10.1.
- `get_vendor_seat_plan(event)` — vendor-gated; §10.2.

---

## 3. The table catalog (11 types)

`TABLE_TYPE_CATALOG` in `lib/seating.ts`. Each is `{ type, label, defaultCapacity, shapeHint }`. Five **shape hints** drive chair geometry: `round`, `long_banquet`, `family_head`, `sweetheart`, `serpentine`.

| type | label | default seats | shape |
|---|---|---|---|
| `round_8` / `round_10` / `round_12` | Round (8/10/12) | 8 / 10 / 12 | round |
| `long_banquet_6` / `_8` / `_10` | Long banquet (6/8/10) | 6 / 8 / 10 | long_banquet |
| `family_head_12` / `_14` / `_16` | Family head (12/14/16) | 12 / 14 / 16 | family_head |
| `sweetheart_2` | Sweetheart (2) | 2 | sweetheart |
| `serpentine` | Serpentine (up to 5 · curved) | 5 | serpentine |

- **To-scale footprints** (`TABLE_FOOTPRINT_M`, metres incl. chairs): round 2.5–3.1, banquet 2.0–3.2, family head 4.4–5.8, sweetheart 1.6, serpentine 2.4. Used only when a venue size is set.
- **Chair geometry** (`tableGeometry`): round = even ring; sweetheart = up to 2 chairs on the top edge; banquet/family-head = chairs on both long edges; serpentine = one quarter-donut wedge (Ri 80 / Ro 120 / 104° sweep), outer-ring-first fill order. `CHAIR_PX = 40`.
- ⚠️ **Drift:** code comments + the old spec say "13 entries." It is **11**. The historical `serpentine_6/12/18` collapsed to a single `serpentine` clamped to 5 seats (migration `20261015000000`, a flagged-destructive backfill that unseated overflow guests).

---

## 4. Floor-plan elements (the room)

Rendered on a pannable/zoomable canvas (`ZOOM_MIN 0.1 … MAX 2.6`; chairs draw at zoom ≥ `0.72`, simplified "pucks" below; pinch/wheel zoom toward the cursor; a Fit button frames everything).

- **Venue walls (to-scale mode):** entering width × length metres draws walls; tables then render at true footprint, the canvas takes the room's aspect ratio (height capped to a 64vh budget), and a half-metre grid appears. Without it, a free **auto-grow board** (7:5 aspect) lets tables spread widely. Wall-resize grips (E/S/SE) adjust dimensions.
- **Stage** — draggable + resizable; the anchor that auto-seat/auto-arrange fan out *from* (default `{x:50, y:8}`).
- **Dance floor** — toggle, drag, resize; a no-table zone (auto-arrange routes around it).
- **Entrance** — toggle + drag (default bottom-centre). The cocktail room can dock to it.
- **Service door** — toggle + drag.
- **Cocktail area** — toggle, drag, resize, **link/dock to the entrance** (auto-repositions when the entrance moves; dragging the room auto-unlinks it). Can be flagged vendor-editable and tied to a schedule block; ARRANGE-tier cocktail vendors may CRUD booths/signs inside it via RPCs.
- **Vendor booths** — drop a blank pin then tap to pick a type (place-then-pick). In a sized room they **snap to a legal wall interval** (`clampBoothToPerimeter` — never the stage wall, clear of door corridors + corners, gap-spaced from other booths); in an open venue they drop freely. A default "Front Desk" registration booth + a "Restrooms" sign seed when the cocktail area is first enabled.
- **Wayfinding signs** — free placement; `rotation_deg` 0 = pointing up. No perimeter logic.

---

## 5. Tables — place, move, rotate, group

### 5.1 Add / rename / restyle / delete
- **Add table** from the sidebar (`+ Table`) or the catalog picker.
- **Rename** via the floating popup; renaming a *linked* table renames the whole unit (syncs `link_group_label`).
- **Restyle** (e.g. long → round) resets capacity to the new shape; guests in chairs the new shape lacks are returned to the pool (count surfaced in a notice).
- **Delete** (with confirm). **Removed seats:** individual chairs can be deleted (e.g. to clear a connection edge), stored in `removed_seats`; `effectiveCapacity = capacity − removed`.

### 5.2 Drag (move)
- Pointer position → world **percent**, pan/zoom-aware. Bounds clamp: sized room `2…98`, free board `−200…600`.
- **Grid snap:** 0.5 m steps in a sized room, 2 % on the free board.
- **Alignment snap:** within 1.2 % of another table's centre (or the room centre-line at 50) the dragged table pulls into line and draws a guide hairline.
- **Chaining magnets** (same-family auto-join while dragging near a connection point): serpentine tips chain into an S/circle (position + rotation), banquet/family-head ends join flush (position + rotation), rounds kiss edge-to-edge (position only). Chained pairs skip the overlap pass.
- **Hold Alt** = drag free of all snapping. The overlap resolver is deliberately **off** during drag (it used to fling touching tables across the room — the "jumps right" bug); mount-time auto-place still gives un-positioned tables a non-overlapping home.

### 5.3 Rotate
Three input paths, all snapping to **15°** (hold **Shift** = 1° on the handle), Flip = 180°:
1. **±15° / Flip buttons** in the floating popup.
2. **Desktop drag handle** — a circle handle beside the selection; drag in an arc.
3. **Two-finger twist** (touch) — a second finger during a drag converts it to a rotate (~6° dead-zone).

### 5.4 Group / link (Keynote-style — current behavior, PR #1963)
Tables sharing a `link_group_id` are **one unit**:
- **Identity:** one shared name + **one printed QR sign**; the print pack emits a single sign for the unit.
- **Move as one:** dragging any member translates the whole unit rigidly (delta clamped so no member leaves the board; internal chain/align snap skipped).
- **Rotate as one:** any rotate path orbits every member around the unit's shared centroid **and** spins each member's own angle by the same delta (computed in pixel space so a non-square canvas can't shear it). A group rotate persists positions **and** angles together so the unit reloads coherent.
- **Break apart** = unlink; every member becomes independent again with its own name + QR, left where it sits.
- **Seating math stays per-table** — grouping is identity + geometry only; who sits where and capacity remain per individual table.

---

## 6. Seating guests into chairs

- **Manual:** pick a guest (or tap a chair) → seats them at the next free seat.
- **Seat a custom group:** seats every member of a guest-list group at one table (seat-what-fits; overflow stays unseated).
- **Seat a role tier:** seats a whole tier's unseated attendees at a table.
- **Priority override:** a guest's `seating_priority` (1–4) overrides their role-derived tier.
- **Capacity guards:** never exceeds `effectiveCapacity`, never fills a `removed_seats` chair, never evicts a current occupant, never seats the couple (bride/groom) anywhere but their sweetheart.

### Role tiers (`roleTier`)
- **Tier 1 — Family & principal sponsors:** principal sponsor, officiant, reader/lector, soloist/musician, both sets of parents, both immediate families.
- **Tier 2 — Entourage:** maid/matron of honor, best man, bridesmaid, groomsman, candle/veil/cord/coin sponsors, ring/bible/coin bearers, flower girl.
- **Tier 3 — Extended family:** any other role whose group category is `family`.
- **Tier 4 — Friends & others:** everyone else.

### Auto-seat algorithm (`computeAutoSeat`)
Pure + idempotent (already-seated guests never move). Pool = all tables **except sweethearts**, sorted nearest-stage-first. Eligible = attending, unseated, not bride/groom. Order = tier 1→4; within a tier cluster custom-group members contiguously (name-sorted), keep plus-ones adjacent to their primary. Fill = each guest into the first pool table with a free seat; when tables run out, the rest **stay unseated** (returned as a count so the UI can prompt for another table).

---

## 7. Layout automation

- **Auto Arrange** (`computeAutoLayout`) — fans tables out from the stage in greedy rows filled centre-out, ordered by type (sweetheart pinned at stage → family head → round → banquet → serpentine). Clamps tables to a playable band (10–90 %), reserving the outer ring for booths, and routes around the dance floor + cocktail room. Disabled until tables exist.
- **Build my seating** (`recommendTableSet`) — one-tap starting draft from the guest list: **1 sweetheart + ceil(toSeat / 10) round-10 tables** (cap 60), where `toSeat` = non-declined guests excluding the couple. Then it auto-arranges + role-tier-seats, turning a blank canvas into an editable draft. (Shipped PR #1875.)

---

## 8. Persistence & collaboration

**Two persistence speeds (important for any rebuild):**
- **Positions move → "Save layout" button.** Dragging marks tables `dirty`; the Save button (with a live count) flushes `updateTablePosition` per table + `saveFloorPlan` + booths/signs.
- **Rotation persists instantly** (`updateTableRotation`). Because of this, a *group* rotate persists positions **and** angles together — otherwise the orbit it induces would be lost on reload while the angles stuck.

**Single-editor lock** (`use-seating-lock.ts` + RPCs):
- Acquire on first edit; **30 s heartbeat**; states `idle | acquiring | editing | view_only | stale_takeover_available`.
- A peer takes over only when the holder is **stale > 90 s by the server clock** (a "Take over" button appears). The client never decides expiry.
- Release on unmount (reliable) + `pagehide` (best-effort); the 90 s server stale-takeover is the guaranteed backstop. Any gated mutation that returns lock-lost drops the client to view-only immediately.

**Live presence** (`use-seating-presence.ts`): channel `seating-presence:{eventId}`, keyed by user id. Shows each peer's name, a deterministic colour, the table they have selected ("Ana is editing Table 7"), and a throttled live cursor (canvas-percent). Presence *also* carries the lock heartbeat so everyone renders the "X is editing — view only" banner without polling. Payloads carry only first name + coords + lock state — no guest/event data.

**Day-of editing banner** warns when editing live during the event window.

---

## 9. Publish & outputs

**Publish** (`publishSeating`) stamps `event_tables.qr_published_at` + `event_floor_plan.published_at`. Publication is the **gate** for every guest/vendor surface below.

- **Print pack** (`/print`) — self-contained printable HTML (Print → Save as PDF): (1) cover + table directory listing each unit's seated names; (2) one full-page **QR table sign per unit** (payload `{site}?t={public_id}`); (3) **place cards** (2-col) each with the guest's personal QR (`{site}?g={qr_token}`). Linked tables print as ONE unit (lead = first member). QRs pre-rendered server-side.
- **PDF export** (`/export`) — `buildSeatingPdf` in two modes: `moodboard` (styled, tinted by the event's saved palette + Setnayan logo) vs `blueprint` (technical). Both receive the palette + logo.
- **Caterer report** (`/caterer`) — attending guests only; HTML shows totals per meal choice + per-table breakdown + a full dietary-restrictions list; `?format=csv` emits one row per attending guest (`Guest,Table,Meal,Dietary restrictions`). Linked tables count as one unit.

---

## 10. Guest-facing & vendor-facing reads

### 10.1 Public "find your seat" (no login)
- `/[slug]/find-seat` → `/api/seat-lookup/[slug]` (service-role client) → `public_seat_lookup(slug, query)`.
- Guards: min query length 2; LIKE wildcards escaped; per-IP throttle (20 hits / 10 s → 429); results capped at 25; **publication gate** (returns nothing unless `published_at` set); any error returns `{matches:[]}`, never a 500.
- Returns to the guest **only**: `display_name`, `table_label`, and (if the guest's zone has a published walk clip) `walk_zone_label` + a short-lived presigned `walk_video_url`. No other PII.

### 10.2 Read-only vendor viewer
- `/vendor-dashboard/clients/[eventId]/seat-plan` → `get_vendor_seat_plan(event)`.
- Gate chain: caller is a vendor → booked status (`contracted|deposit_paid|delivered|complete`) → category is floor-touching → plan exists + published. Any failure redirects to the event Brief.
- Shows the published floor map (stage, dance, doors, cocktail room, vendor pins with the vendor's own booths highlighted "YOU", table positions + rotation) + a table sheet with **`seated/capacity` counts only**. Catering-type categories additionally get per-table meal counts ("Covers per table").
- **Never returns guest names** — enforced in the RPC and stated in the UI (RA 10173).

---

## 11. Walkthrough zone videos

`/seating/walkthrough` (couple or `seat_plan=edit` coordinator). The couple groups tables into **zones**, records a first-person walk (entrance → that cluster), uploads the clip (R2), and publishes the zone. A table belongs to ≤ 1 zone. Only a zone **with a clip AND `published_at`** surfaces to guests — and it surfaces through the find-seat result (§10.1). Coordinator labour, **free / never a SKU**.

---

## 12. Business rules & privacy invariants

- One seat per guest per event (`UNIQUE(event_id, guest_id)`).
- The couple (bride/groom) are only ever seated at a sweetheart; auto-seat excludes them.
- Untagged/un-seated attendees are still surfaced (caterer "Not seated yet" bucket) — never silently dropped.
- **Guest names never cross to vendors** — counts only.
- Public finder + vendor viewer + guest walk videos all require the plan to be **published** first.
- Editing is exclusive (lock) with a server-authoritative 90 s stale takeover; never two simultaneous writers.

---

## 13. Invariants to preserve in any replan (incl. 3D)

If we rebuild the *presentation* (e.g. R3F "Play mode"), these must still hold — they're the contract, not the canvas:

1. **One data model.** Tables (`x_pos`/`y_pos` percent, `rotation_deg`, `type`, `capacity`, `removed_seats`, `link_group_*`) + seat assignments (`table_id`, `seat_number`) + the floor-plan singleton. A 3D scene should *read and write these*, not a parallel store.
2. **Per-chair seat identity.** Seats have stable indices (`seat_number`), the auto-seat order depends on chair index, and `removed_seats` punches holes. Any 3D chair must map 1:1 to these indices.
3. **Role-tier + auto-seat semantics** (§6) — couples excluded, sweethearts reserved, tier order, group clustering, plus-one adjacency, overflow-stays-unseated.
4. **Grouping = move + rotate as one unit, around the shared centroid; one QR sign per unit; break-apart restores independence.**
5. **The publish gate.** No guest/vendor read until `published_at`. QR payloads (`?t=public_id`, `?g=qr_token`) and the find-seat contract must keep working.
6. **Privacy:** vendor sees counts only; the public finder returns name + table (+ optional walk clip) and nothing else.
7. **Exports** (print pack, both PDF modes, caterer CSV) must still derive from the same positions + assignments.
8. **Single-editor lock + presence** semantics (or an equivalent) — exclusive write, server-authoritative takeover, live awareness.
9. **Mobile-first performance + graceful fallback.** The current 2D canvas is buttery on low-end phones; a heavier renderer must degrade (or fall back to 2D) rather than block managing the plan.

**Safe to change / 2D-specific (not contractual):** the top-down canvas itself, px↔% mapping, grid/alignment snap distances, chaining magnets, zoom/pan/detail thresholds, the floating popup, and pucks-vs-chairs LOD. These are *handling*, not *data* — the place to reimagine for game-feel or 3D.

---

## 14. Known drift / cleanup notes

- Catalog is **11 types**, but `lib/seating.ts` comments + the old `0008` spec say "13" / "13-entry catalog." Historical; serpentine collapsed (migration `20261015000000`).
- `assert_seating_lock_held` RPC is **dormant** (server-action layer guards instead) — staged for a future RLS cutover.
- Positions persist on explicit **Save**, rotations persist **instantly** — an intentional asymmetry worth deciding on deliberately in a rebuild.

---

*Captured 2026-06-21 from the worktree at PR #1963 (linked-table grouping). Update the date header if you refresh this against a later state.*
