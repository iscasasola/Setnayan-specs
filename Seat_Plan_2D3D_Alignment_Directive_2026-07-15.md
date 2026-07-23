# Seat Plan — List/2D/3D Alignment Directive · 2026-07-15 (owner)

> Owner directive, verbatim intent: "remove all dupes and make everything properly integrated. follow the concept of the 3D and align them both. the only difference is that 2D is more of a skeletal framework and 3D is 3D." + clarification: "so there is list, 2D Plan and 3D Plan."

## The principle: ONE ROOM, THREE PROJECTIONS
The room doc is the single source of truth. The seat plan is ONE product with a first-class three-way view switch — **List · 2D Plan · 3D Plan** — all projections of the SAME model:
- **List = the management projection** — tables + assignments, dense and scannable: search, assign, bulk-edit, counts.
- **2D Plan = the skeletal/blueprint projection** — authoring view: linework, footprints, labels, counts. Reads as the blueprint OF the 3D world.
- **3D Plan = the rendered spatial projection** — same geometry, same positions, same scale, same orientation, same element identities.
No view owns data the others can't see; an edit in any view is immediately true in the other two.

## What this forbids (the dupes to remove)
1. **No duplicated placement/geometry logic** — one catalog of elements (tables incl. serpentine chains, stage, dance floor, entrances, service doors, cocktail areas, signs, booths), one footprint/collision model, consumed by both projections. If the 3D reader today re-derives or re-defines shapes, unify.
2. **No duplicate seating surfaces** — the older list-based seating routes and the editor must not present as two competing "seat plan" products; the editor (+ its List view tab) is the surface; legacy list pages either fold in or redirect. (Cross-ref: the queued seat-plan PDF sync work — `lib/seating-pdf.ts` — renders from the same room doc.)
3. **No name dupes** — element default names auto-increment uniquely ("Table 5" ×6 bug; fix in flight with the collision PR).
4. **No orphaned projection** — the 2D editor carries the 2D/3D toggle; the 3D view links back. One doorway pair (wayfinding rule).

## Design consequences for the scroll-less council verdict (binding)
- The 2D canvas visual language shifts toward BLUEPRINT: skeletal linework for elements (hairline outlines, mono labels, footprint shading), not miniature furniture illustration — the illustration richness belongs to 3D. Chairs render as slots/ticks in 2D, actual chairs in 3D.
- The 2D↔3D toggle is a first-class view switch on the canvas (same camera/center if feasible), not a separate destination buried in nav.
- Whatever the council verdict ships must route BOTH projections through the shared model; any divergence found during implementation is a bug to fix, not to preserve.

## Built state (2026-07-16)
- **List · 2D · 3D switch** = shipped 2026-07-15 (council cluster 1, PR #3275): the command-bar `[2D·3D·List]` segment, with a mirrored segment on the 3D lab chrome routing back. One room, three projections.
- **2D blueprint restyle** = shipped 2026-07-16 (council cluster 2): the interactive 2D canvas now renders skeletal linework — **chairs are seat-footprint slots/ticks, not `Armchair` furniture illustrations**; room walls / table hubs / serpentine ribbon are hairline; dimensions, table counts, and element marker labels are Space Mono. Presentation-only — geometry / collision (`lib/seating.ts`) and every interaction are untouched. The blueprint style is gated to the interactive canvas: the PDF/print/caterer exports are independent server routes (`.../seating/export|print|caterer/route.ts`, `lib/seating-pdf.ts`) that do NOT import the editor render layer, so the illustrative Mood-board PDF mode is unchanged.

## Vendor presence rule (owner, 2026-07-16 — binding)
> "Finalized vendors are the only one shown. and Setnayan Promotion on the 3D view. this means, they cannot add a vendor if they are not finalized."

- **3D renders ONLY finalized (locked/booked) vendors.** An unlocked/shortlisted vendor has no presence in the room — the room is committed reality, not the shortlist (spatial honesty rule).
- **Vendor placement is lock-gated**: assigning a vendor to a booth/station/element in the editor requires the vendor to be finalized in the Merkado build. The picker offers only locked vendors; no locked vendors → an honest empty state pointing at Merkado's lock flow (never a free-text fake vendor).
- **Setnayan Promotion fills unassigned presence slots in the 3D view** — the default booth/slot content is Setnayan promotional material until a finalized vendor claims it. (Wires into the 3D Booth Ads backlog: slots as inventory.)
- 2D blueprint shows the same assignment state skeletally (slot label: vendor name when finalized, "Setnayan" otherwise) — same room doc, no divergence.

## Cross-projection editing rule (owner + design lead, 2026-07-16 — binding)
> Owner: "2d, list and 3d needs to be synced together. drag and drop on elements on the plan should be same on 2d and 3d?"

- **Sync is absolute**: one room doc, three live projections; the 2D↔3D switch becomes one-tap "Save & view" (auto-save-on-switch replaces the blocking dirty guard) — a switch never loses work, never blocks.
- **Manipulation parity**: MOVE + ROTATE of existing elements work identically in 2D and 3D — same gestures, same placement oracle (`checkPlacement` in lib/seating.ts), same walkway/weld enforcement. 3D drag = ground-plane raycast → the same pure helpers; outcomes are identical by construction.
- **Authoring asymmetry**: CREATE / DELETE / LINK / room-size / zones remain 2D-only (blueprint precision work). 3D = live in the room and adjust; 2D = draft it; List = assign it.
- Prerequisite: the placement-oracle build (Seat_Plan_Spacing_Linking_Council_Verdict_2026-07-16). Sequence: oracle → vendor presence → 3D manipulation parity.

## Full-parity amendment (owner, 2026-07-16 — supersedes the authoring-asymmetry line above)
> Owner: sweetheart-on-stage → "yes share it to 2d too" · lab authoring → "yes. we want them to cleanly sync together."

- **Sweetheart-on-stage is a SHARED oracle rule**: only a sweetheart table may sit on the stage platform — enforced by `checkPlacement` in lib/seating.ts, identically in 2D and 3D (returns as a violation kind, not a 3D fork).
- **FULL authoring parity**: create / delete / link exist in BOTH projections. The lab's authoring tools stay; every authoring path (2D and 3D) routes through the same server actions and the same oracle validation (create placement oracle-checked; 3D links through `legalJoinPose`). The projections must cleanly sync — an authoring act in either view is immediately true in the other.
- The earlier "CREATE/DELETE/LINK are 2D-only" ruling is RETIRED.

### Built state (2026-07-16 · shipped, closes the seat-plan program)
Implemented in app PR `claude/seatplan-full-parity` (branch off `origin/main` @ #3285):
- **Sweetheart-on-stage shared in the oracle** — `lib/seating.ts`: `OracleZone.sweetheartExempt` + exported `stageZone(fp, rect)`; `checkPlacement`/`penetrationDepth` skip the stage only for a `sweetheart` pose (every other table over the stage = `overlap` violation, heals via slide / monotone-escape). Both zone builders (2D `zonesFor`, 3D `oracleZones`) and `solveAutoLayout` push the stage as the conditional obstacle, sized-room-gated (free board stays place-anywhere). Saved non-sweetheart-on-stage rooms never force-moved.
- **CREATE parity** — `createTable` accepts an optional oracle-valid `x_pos`/`y_pos`; the 3D lab (spiral over the shared oracle) and the 2D `AddTablePanel` (`computeSpawn` → `nearestFree`) both persist the identical off-stage, non-overlapping spot → the other view reads it exactly.
- **LINK parity** — 3D manual arm-link = `weldLink` (pull-to-join via shared `legalJoinPose`, oracle-checked, persisted, then the shared server `linkTables` re-validates same-family + `isLegalJoint`). Drag-snap keeps `doLink`.
- **DELETE parity** — `deleteTable` unlinks a link-group remnant reduced to one member; identical in both views (one shared action).
- Gates: typecheck 0 · lint 0 · 1865 unit tests (8 new stage-rule oracle tests) · prod build 0. Live 3D browser-verify owed (needs an authed event + sized room).

## Auto-save-on-exit rule (owner, 2026-07-16 — binding, supersedes the "no autosave v1" S2 scope at view boundaries)
> Owner: "any changes created should be auto saved before they leave 2d or 3d or list. so 2d, 3d, and list will always sync properly."

- **Every exit from any projection auto-saves first**: switching 2D↔3D↔List, navigating to another route, and (best-effort) tab close. No view is ever left holding unsaved changes; every projection therefore always reads persisted truth — sync by construction.
- 3D already persists per-edit (#3285); List writes through server actions; the main obligation is the 2D editor: the manual save chip remains as visible state, but view-exit triggers the save automatically (the #3285 "Save & view" behavior generalized to ALL exits).
- On save FAILURE at an exit boundary: stay in the current view + surface the error (never navigate with unsaved work, never silently drop it) — same posture as Save & view.
- S2's caution (continuous debounced autosave under the single-editor lock) still stands for MID-EDIT autosave; this rule is about the bounded exit moment only.

## Drop rule (owner, 2026-07-17 — binding, supersedes settle-to-last-valid)
> Owner: "we want the tables to be undroppable instead when overlap."

- **An invalid drop is NO drop**: releasing a dragged element over a pose the oracle rejects returns it (animated snap-back) to its DRAG-START pose. No settling at intermediate "last-valid" spots.
- Per-frame feedback stays: warm-red ring/tint while the hovered pose is invalid, so the refusal is legible before release.
- Legacy healing preserved by construction: a violating table's drag-start pose is its current spot; dragging OUT to a valid pose is a valid drop; any invalid release just returns it. No table can ever get more stuck.
- Applies identically in 2D and 3D (one commit rule, shared helpers). Replaces the monotone-escape commit semantics; the escape math may remain only as in-drag visual guidance.

## Lab chrome rules (owner, 2026-07-17)
- **View segment order is LIST | 2D | 3D** everywhere the segment renders (frame + lab). Supersedes the [2D·3D·List] order in the scroll-less council verdict.
- **Fullscreen is explicit, never accidental**: a bottom-right enter/leave-fullscreen control on the 3D lab, plus double-tap on the OUTSIDE area (the dark surround beyond the venue) toggles fullscreen. Whatever gesture currently triggers fullscreen unintentionally is removed/gated.
- The drop rule (invalid drop = NO drop, snap-back) applies to EVERY drag path in every projection — any handler that can move an element must route through the same `dropAccepted` commit rule. One handler slipping through = a bug.

## Confirm-on-drop + universal draggability (owner, 2026-07-17 — refines the drop rule)
> Owner: stage/dance floor/entrance "should also be draggable. and always ask if they want the object to drop here? same goes to the tables and other objects... the area is intersecting X, please choose a different area."

- **Everything draggable**: stage, dance floor, entrance (and all placeable elements) support direct drag in both projections — panel buttons/steppers remain as precision alternatives, never the only path.
- **Confirm-on-drop, universal**: releasing a drag shows a lightweight inline confirm bubble at the drop point — "Drop here?" ✓ / ✗ (✗ or Esc = snap-back to drag-start). Not a modal; the bubble must not occlude the dropped element.
- **Invalid drop = the explanation**: when the pose is oracle-rejected, the bubble states WHAT it hits — "This area intersects with {element name} — please choose a different area" (walkway violations: "Too close to {name} — needs {walkway}m clear") with only cancel/keep-dragging. The silent snap-back is superseded by this named refusal; the snap-back animation remains on cancel.
- One bubble component, both projections, all element types.

## 3D Plan = the integrative product · its four inputs (owner, 2026-07-23 — binding definition)
> Owner: "add 3D Plan — this integrates the 2D Seat Plan, Guest List, Indoor Blueprint, Mood Board." (Prompted by "there is no 3D Plan" = the corpus had mis-modeled it as a narrow `SEATING_3D` walk / an "upgrade of Indoor Blueprint," which undersells what it is.)

The **3D Plan is not just the rendered projection of the room geometry** — it is the surface that **integrates the couple's plan features** into one spatial experience **and hosts the actor-presence layer (avatars + booths) inside it**. It composes:

*Data inputs (four features it reads):*
1. **2D Seat Plan** → room geometry, table footprints, positions, scale, orientation (the "ONE ROOM" model above). *Already hydrated — the 3D lab reads the persisted floor-plan + tables.*
2. **Guest List** → who sits where; RSVP'd guests materialize as seated mannequins at their assigned seats (per the materialization/privacy matrix). *Already wired.*
3. **Indoor Blueprint** → the entrance→table wayfinding / find-your-seat walk. Indoor Blueprint stays **FREE + standalone (the 2D Plan)**; the 3D Plan **integrates** it (renders the same wayfinding in 3D). This **supersedes the 2026-07-23 "3D Plan *upgrades* Indoor Blueprint" wording** — it integrates, it does not upgrade.
4. **Mood Board** → palette / visual identity; the venue **derives its colours FROM the Mood Board's palette** (owner 2026-07-23) so the 3D room reads as *their* wedding, not a stock hall. The 0010 Mood Board is the **sole palette source** and "rooms re-tint to mood board" (Venue Makers council 2026-07-19) — this is the established design. *Partial today (accent colour banded to the palette); the build gap = wire the full Mood-Board palette → venue element colours.*

*Actor-presence layer it hosts (owner 2026-07-23):*
5. **Avatar makers (Vendors + Hosts)** → the actor-scoped avatar authoring surfaces live inside the 3D Plan. **Hosts** (couple / honorees) author their own avatars; **Vendors** author their staff avatar (service-typed from the 28-category taxonomy). *(Guests self-author via the 3-tap on-the-walk sheet — the third actor scope.)* See the AVATARS section of `3D_Plan_and_Vendor_Revenue_Model_2026-07-20.md` + `project_setnayan_avatar_maker` memory.
6. **Booths (Vendors + Hosts)** → booths render in the room. **Vendor booths** are the revenue surface: only finalized/booked vendors render (spatial-honesty rule above), Setnayan Promotion fills unassigned slots, branded render is gated by the ₱1,500/28d 3D-booth add-on. **Host booths are NOT new** (owner 2026-07-23): they were already scoped in the avatar-customization work — the couple/host maker is the **`/seating/lab` Build-mode Design panel** (Venue Makers council 2026-07-19, `3D_Venue_Makers_Council_Verdict_2026-07-19.md`). Align host presence to that existing plan rather than treating it as a fresh build.

**Consequences:**
- **Price = ₱1,500** — host-activation, one-time per event (owner 2026-07-23 · was interim ₱1,000 · was ₱2,999; ⚠ **NOT yet in code** — live catalog still ₱2,999, repo/DB migration owed). What ₱1,500 buys: the interactive "gaming-like" 3D seat plan — view own seats + vendors + **co-presence (see other accounts roaming the room = shared-room slice 8)**. **RETIRE everything else (owner):** the ₱2,999 standalone, the interim ₱1,000, AND the #3526 vendor-enabled couple discount are all retired → ₱1,500 is the single host price. **Vendors separately pay ₱1,500/28d** for their **ad/booth presence** in it (the existing #3526 `vendor_3d_booth` add-on, recurring) — INDEPENDENT of the host's fee, not a couple discount (same number, different cadence + payer).
- The four inputs are **data sources the projection reads**, consistent with "no view owns data the others can't see." An edit to seats, guests, wayfinding, or palette is immediately true in the 3D Plan.
- Naming: "3D Plan" is the owner-blessed product name for the third projection (List · 2D Plan · **3D Plan**); the catalog key stays `SEATING_3D`.
