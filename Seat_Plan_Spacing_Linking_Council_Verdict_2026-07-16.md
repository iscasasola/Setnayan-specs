# Seat_Plan_Spacing_Linking_Council_Verdict_2026-07-16


> **⚠ AMENDED 2026-07-16 (owner): the "cross-family links are rejected" rule below is SUPERSEDED.** The linkable set is now the **chainable types {banquet/long-run, serpentine}** — any two chainable types may weld end-to-end, INCLUDING cross-family banquet↔serpentine (straight run flowing into a curved section). Non-chainable types (round, sweetheart, king, family_head) still reject. `linkTables` enforces the chainable-set rule (not blanket-allow). Wherever this doc says "cross-family rejected" / "same-family gate," read "chainable-set gate." Shipped in the combine/weld fix PR.


**Council:** geometry · interaction · banquet-ops · solver — synthesized into one buildable verdict.
**Anchors:** origin/main @ `bbf50c4b6` (post-#3274 + #3275). Files: `apps/web/lib/seating.ts` (2569 ln), `apps/web/app/dashboard/[eventId]/seating/_components/seating-editor.tsx` (6358 ln), `apps/web/app/dashboard/[eventId]/seating/actions.ts`.

**Governing principle (unanimous across all four proposals):** there is exactly ONE placement oracle, pure and testable in `lib/seating.ts` (per the #3274 pure-helper model), and every mutation path — manual drag, snap, every rotate path, link, group move/rotate, Auto Arrange, server persist — calls it. Nothing persists a pose the oracle rejects. Sanctioned contact exists only as a stored, pose-validated link; no distance-only heuristic survives.

New pure helpers (names locked):

- `obbOf(table)` — rotation-aware oriented footprint from `TABLE_FOOTPRINT_M` + `rotation_deg`. Round = circle; banquet/sweetheart/family_head = single OBB; serpentine = 3-OBB decomposition of the arc (NOT convex hull — the hull overestimates the concave inner edge). SAT overlap with an AABB/circumscribed-circle broad-phase prefilter.
- `legalJoinPose(anchor, mover)` — returns the EXACT snapped pose for a legal joint or null. Reuses the existing snap-candidate generators (seating.ts:2324–2356 serpentine, 2376–2397 rect, 2408–2430 round) as the single source of truth for both snapping and join validation.
- `checkPlacement(pose, world, params) → { valid, violations[] }` — the oracle: pose vs all non-groupmates + zones + booths + walls, gap ≥ `aisle_m`.
- `layoutViolations(layout, settings)` — full-board O(n²) audit built on `checkPlacement`; used by Auto Arrange verification, the mount audit, and the server actions.

---

## 1. Root-cause fixes for the persisting overlaps (exact predicates to change)

| # | Root cause (recon) | Fix |
|---|---|---|
| 1 | `serpentinesJoined`/`rectRunsJoined` are distance-only exemptions with zero rotation constraint; `SERP_JOIN_TOL_PX = 18` ≈ 1.1 m at 50 m-room scale — wider than the 0.6 m enforcement gap (seating.ts:2481–2497, 2484) | **DELETE both predicates as standalone collision exemptions.** The only exemption is same-`link_group_id` membership (§ 2). Join *validation* becomes pose-constrained: end-midpoints coincident within `JOIN_TOL_M = 0.05` m (metric, not px) AND rot-delta ∈ {+104°, −104°, 180°} ±3° for serpentine (SERPENTINE_SWEEP_DEG math at 2340–2353 promoted from snapper to validator); rot-delta ∈ {0°, 180°} ±3° + end faces flush for rect runs; centre distance = rA+rB+gap (any angle) for round kiss. The X-crossed-tips screenshot bug dies here. |
| 2 | "already stuck → drag free" disjunct — any currently-overlapping table drags unconstrained and the drop persists (editor:2227, 2224–2236) | **DELETE the disjunct.** Replace with the monotone-escape rule (§ 4): a violating table may move only to fully-valid poses or poses whose max penetration depth does not increase (ε = 2 cm plateau allowance). Out is always possible; deeper never is. |
| 3 | Collision is a rotation-agnostic AABB — `footprintPx` (editor:1602–1606) returns the unrotated box, `boxesOverlap` (seating.ts:2449–2459) is pure AABB; rotated banquets interpenetrate and phantom-block | `footprintPx` carries `rot` through; `boxesOverlap` superseded by `obbOf` + SAT (kept for broad-phase only). Fixes both false negatives (chair interpenetration) and false positives. |
| 4 | Every rotation path persists with zero re-check: ±15°/Flip (editor:1542–1560), `commitRotation` (1427–1439), rotate handle (5183–5228), two-finger (2028–2047), `persistGroupTransform` (1496–1527) | All rotate paths become preview → `checkPlacement` → commit. Gesture rotations block at the last legal angle in the arc with a small shake; button rotations that would violate are refused with a shake. Only legal angles ever persist. |
| 5 | Snap early-return never runs `overlapsAny` on the snapped placement (editor:2104–2167); `linkTables` has zero geometry validation (actions.ts:1317–1372); linked-unit drag has zero collision check (editor:2068–2091) | Snap ghost is oracle-checked vs ALL third parties + zones + booths before it is even offered (§ 2); `linkTables` gains server-side same-family + `legalJoinPose` validation; unit drag/rotate goes through the oracle on the union of member OBBs. |
| 6 | `serpSnapRotRef`/`rotById` rotation smear — snap rotation stored at editor:2160/2162, never cleared when drag frames leave the snap radius, persisted at pointer-up (2319–2334) | Clear `serpSnapRotRef` + `rotById` the frame the drag exits 1.4× the catch radius (hysteresis: enter r, exit 1.4r). No free-position wedge ever persists a chain angle again. |
| 7 | Saved overlaps never heal — mount resolver honors saved anchors verbatim and skips them in cleanup (editor:1811–1856, 1834) | Saved anchors stay honored (locked: never rearrange on load), but a read-only mount audit + owner-initiated repair path is added (§ 6), and monotone-escape drag heals organically. |

## 2. THE join/link model — "weld": snap is link, link is rigid

**Sanctioned contact = same `link_group_id`. Nothing else.** `chainJoined`'s unlinked proximity branches (editor:1619–1651) are deleted; the exemption test becomes pure membership. "Snapped but unlinked" ceases to exist as a state. **No schema change:** because a link can only be created at an exact `legalJoinPose` and the group is a rigid body forever after, relative poses can never drift — membership alone is a safe exemption; joint geometry never needs storing beyond the existing x/y/rotation.

**Cross-family links are rejected** (closes the actions.ts no-validation hole and the 1628 same-family-gate inconsistency).

**Gesture 1 — drag-to-weld (primary).** Drag a compatible table; when an end enters the existing catch radius (radii unchanged — they're finger-friendly), render a dashed blueprint GHOST at the exact `legalJoinPose` with a small weld tick at the joint, and snap live. The ghost is itself run through `checkPlacement` vs all third parties/zones/booths: if the welded pose collides elsewhere, the ghost renders red-dashed "No room" and release does NOT weld or place there — drag continues as plain slide. Release on a valid ghost = write the exact candidate pose + `linkTables` (optimistic, rollback on failure) + toast **"Linked · Undo"**.

**Gesture 2 — pull-to-join (the chain icon, repurposed).** The popover Link2 icon (editor:5282–5293 / 5067–5078) no longer links in place. Tap chain icon on table A (anchor) → compatible attachment ends on other tables glow → tap table B → B animates to the nearest oracle-valid `legalJoinPose` on A and links. No valid spot → refuse with "No room at that end — drag them closer." The tap-anywhere `linkingFrom` completion at editor:2338–2340 is deleted; `doLinkTables` routes through this path.

**Unlink.** The existing popover unlink icon (editor:5271–5280) only, plus Undo on the link toast. Positions stay as-is; the exemption ends immediately, so an unlinked-but-touching pair shows as a violation and is healed by monotone-escape drag. **No drag-to-tear hysteresis** (rejected, § 7).

**Chain move/rotate.** Grabbing any member drags the whole unit rigidly (current behavior) — but now through the oracle on the union of member OBBs, with the same slide/ghost/escape behavior as singles (closes editor:2068–2091). Group rotate previews per-frame and blocks at the last legal angle; `persistGroupTransform` (1496–1527) only ever writes oracle-passed poses. Internal joints exempt each other pairwise; the serpentine seam at a legal 104° joint is tested with a small negative seam tolerance so the 3-OBB decomposition never false-positives on its own weld.

## 3. THE clearance model — one global "Walkway width", metric

**Body = footprint.** `TABLE_FOOTPRINT_M` already includes ~0.5 m chair depth per side (seating.ts:338–355) — do NOT double-count. Footprint-to-footprint gap therefore ≈ chair-back-to-chair-back clearance, the exact number planners quote.

**One owner control: Arrange ⚙ popover (#3275 command bar) → "Walkway width."** Segmented presets + fine stepper (0.6–2.0 m, 0.1 steps; hard floor 0.6 m — no zero, that's the walkability guarantee):

- **Tight — 0.6 m** · caption: "single-file — staff can't pass with trays"
- **Service — 0.9 m (default for new rooms)** · caption: "room for staff with trays" — PH banquet staff-aisle minimum
- **Comfort — 1.5 m** · caption: "guest aisle, gowns"

Persisted as `aisle_m` in the room doc JSON next to venue dims (additive key, no schema break). **Rooms missing the key read as 0.6 m** — the 2026-07-11 owner rule (editor:1671) — so nothing that was legal under the old gap turns red on upgrade. Replaces the hardcoded `0.6 * pxPerMeter` and `COLLIDE_GAP = 10` in sized rooms.

**px at editor scale** (`pxPerMeter = canvasW / venue.width`, editor:539–542): 20 m room / 800 px canvas → 40 px/m → 0.9 m = 36 px; 50 m room → 16 px/m → 0.9 m ≈ 14 px, 0.6 m ≈ 10 px.

**Free board (no venue dims): control shown DISABLED** with hint "Set your room size to control walkway width." The 10 px breathing gap and place-anywhere behavior stay as-is — best-effort by design, stated honestly. No fake control, no new enforcement there.

**Presentation (blueprint grammar):** the dragged or selected element renders its clearance halo — footprint inflated by `aisle_m / 2` — as a faint dashed hairline offset. Halos-may-not-touch is the visual rule. Two violation grades: **amber "tight"** = gap < `aisle_m` but no body overlap (typically setting-induced after raising the slider); **red "overlap"** = true body intersection. Welded seams render a solid weld tick, no halo between members. Raising the slider previews the consequence before commit: "At 1.5 m, 4 placements too close — apply anyway / auto-tighten?"

## 4. Drag behavior at violation — slide, ghost, monotone escape

1. **Valid candidate** → move.
2. **Blocked** → SAT minimal-translation axis-slide (upgrades the AABB slide at editor:2231–2234 to oriented shapes): full move, then x-only, then y-only, else hold — the table presses against the halo.
3. **Unresolvable** → the solid table holds its **last valid pose** while a 50 %-opacity red-haloed ghost tracks the cursor; **drop commits the last valid pose**, never the violation.
4. **Already-violating table** (legacy save, or aisle raised) → monotone escape: candidates accepted iff fully valid OR max penetration depth does not increase by more than ε = 2 cm (plateau moves allowed, avoiding the glued-in-a-pocket local-minimum). You can always rescue; you can never worsen or seed new overlaps. The "Fix overlaps" button (§ 6) is the guaranteed hatch.
5. **Weld snap outranks slide** but only when the ghost's third-party check passes (§ 2).
6. Pointer-up persists only what the frame loop already validated — Save-writes-verbatim stays safe because nothing invalid ever becomes current state.

Perf contract: only the moving element/unit is tested against the rest; AABB broad-phase before SAT narrow-phase; memoized OBB corners. **Perf gate on mid-range Android (the owner's 3-phone test devices) before PR-2 merges.**

## 5. Auto Arrange = solver over the same oracle

Rewrite of `computeAutoLayout` (seating.ts:2102–2263), keeping the stage-out centre-out row-packing heuristic as the SEED and adding verified legality:

- **Inputs:** venue metres + `pxPerMeter`; zones (dance/cocktail/booths/stage) inflated by `aisle_m/2` as hard no-go; `aisle_m`; band LO/HI (2156–2157); sweetheart pin; **link groups collapsed to rigid super-elements** (compound footprint placed as one — never scatters an assembled unit); TYPE_RANK order (2129).
- **Metric gaps:** `ROW_GAP`/`SLOT_GAP` (4 %/3 % of canvas, 2153–2154 — room-size-dependent by accident) → slot gap = `aisle_m`, row gap = `aisle_m` + 0.3 m service allowance. Free board keeps % gaps.
- **Centre aisle:** a reserved processional/service lane, width `max(aisle_m, 1.5 m)`, stage to back wall, modeled as a zone rect. Default ON when a stage exists; toggle "Reserve centre aisle" in the Arrange confirm dialog.
- **Rotation contract:** the solver owns rotation — singles reset to 0° (or row orientation for banquets), declared in the confirm dialog; compounds keep internal geometry and translate intact.
- **Acceptance:** every slot passes `checkPlacement` vs everything placed so far; rejection scans alternate slots in the row, then the next row. **DELETE** the keep-stacking fallback (2217–2219), the one-shot sideways zone push (2247–2256), and the false resolver comment (2245–2246).
- **Guarantee:** after layout, `layoutViolations` runs as a final full-pairs verification — the return value is either fully legal or `{ placed, unplaced[] }`. Auto Arrange is structurally incapable of returning what drag forbids. `autoArrange` (actions.ts:1774–1827) persists only the verified set; guest auto-seat unchanged.
- **Honest failure mode (never silent):** unfitting tables persist with `x_pos = null` (nothing fake) and appear in an **"Unplaced (N)" tray strip** in the editor. Banner: *"Fits 18 of 22 tables at 0.9 m walkways — at 0.6 m it fits 21. Try Tight, remove tables, or enlarge the room."* The alternate count comes from one extra cheap solver pass, so the suggestion is real; one-tap "Retry at Tight" included.

## 6. Existing-save migration — detect, offer, never force

Locked constraint honored: **saved rooms are never rearranged on load**; the mount resolver keeps honoring saved anchors (editor:1811–1856).

1. **Read-only mount audit:** run `layoutViolations` once over saved poses. Clean → nothing. Violations → dismissible command-bar pill *"N overlaps — Review"* (dismissal remembered per room). Violating tables render red-dashed halos; tight-only pairs render amber.
2. **Review → "Fix overlaps":** minimal-displacement iterative separation — push offenders along minimum-translation vectors, ≤20 iterations, avoiding zones/walls, links preserved as rigid units, sweetheart pinned; fallback the OBB-ified nearest-free spiral (editor:1743–1755). Shown as a **ghost-diff preview with per-table displacement in metres** → Apply persists, Cancel discards, undoable. Only violating tables move.
3. **Legacy link groups** failing the new pose validation (cross-family or arbitrary-pose links created by the unvalidated `linkTables`) render as **"linked (broken)"** — dashed connector badge, collision exemption OFF (they collide normally) — with two one-tap actions: **Re-weld** (pull-to-join onto the nearest candidate) or **Unlink**. Existing `link_group_id` data is never silently mutated.
4. **Legacy kissed-but-unlinked runs** that PASS `legalJoinPose` are offered in the same Review panel: "These serpentines look joined — link them?" One tap promotes to a real link.
5. Owners who ignore the banner still heal organically via monotone-escape drag. Zero data migration; behavior-level only.

## 7. Rejected ideas (one line each)

- **Distance-only join exemption (`SERP_JOIN_TOL_PX = 18`)** — the root hole; wider than the enforcement gap at real room scales; deleted, not tuned.
- **Per-element clearance halos/config** — one global walkway number is the whole model; per-element is V2 scope creep.
- **Drag-to-tear unlink with 0.5 m hysteresis (solver)** — accidental unlink on fine nudges; solver's own risk list flags it; explicit unlink + Undo instead.
- **Auto-break join when a member is dragged out of pose (geometry)** — members can't be solo-dragged in a rigid unit, so the case can't arise; simpler invariant.
- **Enforcing collision on the free board (interaction)** — the free board is place-anywhere by design; an honest disabled control beats new surprise enforcement.
- **Per-table "Pin" toggle in Auto Arrange (solver)** — V1.5; the sweetheart pin already covers the hero case.
- **Parking band with persisted in-room positions (interaction)** — never persist fake coordinates; `x_pos = null` tray instead.
- **Convex-hull serpentine footprint (interaction)** — overestimates the concave inner arc; 3-OBB decomposition is tighter and still SAT-compatible.
- **≤0.3 m auto-translation repair on invalid rotation (solver)** — surprising teleports; block-at-last-legal-angle is predictable.
- **Storing joint geometry in the schema** — unnecessary; exact-pose weld + rigid unit keeps joints legal by construction, `link_group_id`/`link_group_label` suffice.
- **2 cm join epsilon (geometry)** — too tight against float drift in saved rotations (its own risk #2); 5 cm + ±3° is the floor.
- **Keep-stacking fallback + one-push zone heuristic in Auto Arrange** — dishonest overlap producers; deleted.
- **Deleting the chain icon entirely (geometry)** — pull-to-join keeps an accessible non-drag link path (mobile, motor accessibility).

## 8. Implementation notes — file anchors, PR slicing, tests

**Delete/replace list (anchored):**

- `lib/seating.ts`: 2481–2497 (distance-only joined predicates → `legalJoinPose` validator) · 2449–2459 (AABB → SAT/OBB kernel, AABB retained as broad-phase) · 2153–2154 + 2217–2219 + 2245–2256 (% gaps, stacking fallback, one-push heuristic → metric solver) · 2102–2263 (`computeAutoLayout` seed+verify rewrite) · 2324–2430 (snap candidate generators promoted to shared source of truth).
- `seating-editor.tsx`: 1602–1606 (`footprintPx` + rot → `obbOf`) · 1619–1651 (`chainJoined` → link-membership only) · 1656–1729 (`overlapsAny` → oracle) · 2224–2236 (drag gate rewrite; delete the 2227 stuck→free disjunct → monotone escape) · 2104–2167 (snap validation + ghost; delete early-return) · 2160 + 2319–2334 (`serpSnapRotRef` hysteresis clear at 1.4×r) · 2068–2091 + 1457–1527 (unit drag/rotate → whole-unit legality) · 1427–1439, 1542–1560, 2028–2047, 5183–5228 (all rotate paths → preview/validate/commit) · 2338–2340 + state 627 (`linkingFrom` tap-anywhere completion deleted → pull-to-join) · 1811–1856 (mount: add read-only audit; keep anchor-honoring) · Arrange ⚙ popover: Walkway control + Review pill.
- `actions.ts`: 1317–1372 (`linkTables` same-family + `legalJoinPose` server validation) · 1774–1827 (`autoArrange` persists verified-only + `unplaced[]` with `x_pos = null`). `unlinkTable` 1377–1405 unchanged. `renameTable` 1288–1301 unchanged.
- Untouched by design: the per-chair × delete chips (4849–4862, `toggleSeat` 1586–1597) — not link-related; leave alone.

**PR slicing (each independently shippable, builds on #3274):**

1. **PR-1 — kernel (lib only):** `obbOf` + SAT + broad-phase, serpentine 3-OBB decomposition with seam tolerance, `legalJoinPose`, `checkPlacement`, `layoutViolations`, `JOIN_TOL_M`. Pure functions + unit tests; zero UI change.
2. **PR-2 — editor gates + link semantics:** oracle-wired drag/slide/ghost, monotone escape, delete stuck→free, validated weld-ghost snap-commit-as-link + pull-to-join, all rotate-path validation, unit legality, `serpSnapRotRef` fix, `linkTables` server validation. **Perf gate on mid-range Android before merge.**
3. **PR-3 — Walkway control:** Arrange ⚙ segmented presets + stepper, `aisle_m` room-doc persistence (absent ⇒ 0.6), halo rendering, amber/red grading, slider-raise preview.
4. **PR-4 — Auto Arrange rewrite:** metric solver + centre aisle + compound units + final verification + Unplaced tray + honest overflow banner + `autoArrange` validated persist.
5. **PR-5 — migration surface:** mount audit, Review pill, Fix-overlaps ghost-diff preview, "linked (broken)" badges with Re-weld/Unlink, "looks joined — link them?" promotion.

**Test list (minimum):**

- SAT: 90°-rotated banquet vs neighbor detects overlap the old AABB missed; rotated banquet no longer phantom-blocks an actually-clear slot.
- Serpentine: two wedges X-crossed with tips 15 px apart FAIL the join test (the screenshot case); a legal +104° continuation PASSES; the 3-OBB seam at a welded joint does not self-report overlap; 180° S-bend passes.
- Round kiss passes at rA+rB+gap ± 5 cm, any mutual angle; fails at body overlap.
- `legalJoinPose` returns exact candidate poses; committed poses re-validate within tolerance after a save/load round-trip (float drift).
- Drag: stuck table accepts penetration-reducing and ε-plateau moves, rejects worsening moves; drop-on-violation commits last valid pose; slide works on rotated OBBs.
- Snap ghost: welded pose colliding with a third table / dance floor / booth is refused (no place, no link).
- `linkTables`: rejects cross-family and arbitrary-pose requests; accepts oracle-validated welds.
- Rotate: each of the five rotate paths blocks at last legal angle and never persists a violating angle; unit rotate checks the union footprint.
- `serpSnapRotRef` cleared when a drag frame exits 1.4× catch radius; free-position drop persists drag rotation, not stale snap rotation.
- Solver property test: random rooms/table sets → `layoutViolations(result) === []` always; unplaced tables have `x_pos = null`; overflow banner counts match a real second pass; deleted fallbacks never resurrect (no two tables at identical coords).
- Scale math: 20 m/800 px → 0.9 m = 36 px; 50 m → ≈14 px; free board unaffected.
- Migration: room with missing `aisle_m` loads at 0.6 m with zero new violations flagged for previously-legal layouts; legacy invalid link renders broken (exemption off); Fix-overlaps preview moves only violators and preserves links + sweetheart.

## 9. Open owner sign-offs

1. **Snap = link.** Every sanctioned contact is now a persistent link; the "kissed but unlinked" state disappears (Undo toast is the escape). Confirm the semantic shift.
2. **Service 0.9 m default for new rooms** (legacy grandfathered at 0.6 m) + the Tight preset labeled "staff can't pass with trays." This is a real capacity reduction vs today's 0.6 m — Auto Arrange will fit fewer tables by default. Sign the default and the copy.
3. **Honest overflow.** Auto Arrange used to "always fit" by silently stacking; it will now return an Unplaced tray. Accept the perceived-regression support cost.
4. **Legacy-room violation wave.** Rooms with real persisted overlaps (including Auto Arrange's own) will surface a Review pill the day this ships; repair is preview-and-confirm only, but expect "why is my saved plan suddenly wrong" feedback.
5. **Centre aisle default ON** (when a stage exists) in Auto Arrange — reduces capacity further; toggle provided.
6. **Free board stays place-anywhere** with the Walkway control disabled — confirm no enforcement is wanted there in V1.
