# Seat_Plan_2D3D_Sync_Council_Verdict_2026-07-16

**Council:** coordinates · persistence · architecture · verification — merged by synthesis judge.
**Verification stamp:** every load-bearing anchor in this verdict was re-checked against `origin/main` @ `7b74f5a18` (2026-07-16) before synthesis: `SERP_RI=0.95/SERP_RO=1.55` (lib/seating-3d.ts), 2D `SERP_RI=80/SERP_RO=120` + `TABLE_FOOTPRINT_M.serpentine=2.4` + `JOIN_TOL_M=0.05` (lib/seating.ts), the free-board `pxPerMeter = null` branch (seating-editor.tsx:540-544), per-axis drag math (`x/rect.width`, `y/rect.height`, ED:~2261-2264), the weld's instant `commitRotation` at drag-end while positions only mark dirty (ED:~2620-2641), the `NOMINAL_W=1000` bridge with its `venueW && venueL` guard (actions.ts:~1413-1435), server clamp −300..900 (actions.ts:~1060-1066), `DEFAULT_ROOM {w:20,d:30}` / `roomSize` / `pctToWorld` (seating-3d.ts:~176-375), and the CI merge gate (`test:unit` = `tsx --test "lib/**/*.test.ts"`, ci.yml:33). Recent commits `b183a9a8a`/`fbdabd087` (booth picker, stage/dance wall-snap, room presets) touch the same files — line numbers below are anchors, not gospel; re-grep before editing. The recon's findings all held.

**Judge's note on the owner's "ensure coding is correct":** the code on main now carries an owner-locked comment at the weld drag-end — *"Connective snap (owner 2026-07-16 — positioning, NOT linking)"* — which resolves the councils' one genuine design conflict (3D link-on-snap) in favor of removal. Every other conflict is decided below with rationale. An implementer needs zero further design decisions.

---

## 1 · Root cause (named exactly)

Three independent defects. The linear pct→world map and the rotation convention are **NOT** the bug (both already consistent: `pctToWorld` S3:369-375, `rotation.y = −deg` via `serpRotVec` ≡ y-down clockwise `rotatePoint`).

**GUN A — two serpentine body-geometry families, ~27–31% apart.**
`lib/seating.ts` defines the 2D family in px (`SERP_RI=80`, `SERP_RO=120`, sweep 104°, box≈243.4 px), normalized to metres by `TABLE_FOOTPRINT_M.serpentine = 2.4` ⇒ band bbox ≈ **1.865 m**, tip radius ≈ **0.986 m**, S-bend centre distance ≈ **1.62 m**, continue-circle ≈ **1.33 m**. `lib/seating-3d.ts:381-382` independently defines `SERP_RI=0.95 / SERP_RO=1.55` in metres ⇒ bbox **2.443 m**, tip rm **1.25 m**, S-bend **2.06 m**, continue-circle **1.68 m**. Everything 3D — mesh (`SERPENTINE_TOP_GEO`, serpentine-top.ts:19-30), `serpentineBand()`, `tableDims('serpentine')`, `serpentineChainSnapWorld` (S3:473-521) — uses the second family. Consequence: a 2D-snapped chain renders interpenetrating in 3D; a 3D-snapped chain reads back ~0.44 m apart in 2D and is **rejected by the system's own server validator** (`linkTables`' `isLegalJoint` @ `JOIN_TOL_M=0.05`). The two projections fail each other's validators.

**GUN B — the free board's percent space is fiction in 3D (matches the owner's screenshots).**
With no venue size, 2D persists x as % of the region cell's WIDTH and y as % of its HEIGHT (`pxPerMeter = null`, ED:540-544; per-axis conversion ED:2263-2264) — anisotropic AND canvas-size-dependent at save time (the code admits the shear at ED:1636-1639). 3D re-reads those percents against a fixed portrait **20×30 m** room (S3 `DEFAULT_ROOM`). On a ~2:1 landscape cell the axes distort ~3× relative to each other: seams shear apart, relative positions move, room shape differs.

**GUN C — half-persisted welds + four unguarded doors into the lab.**
A connective snap persists the **rotation instantly** (`commitRotation` at drag-end, ED:~2637-2641 → `updateTableRotation`) while **positions only mark dirty** and wait for Save. Abandon the editor via any of 4 doors that bypass Save & view (hub tile → `/seating/lab` directly, add-ons-catalog.ts:174-179; direct URL/refresh; any SPA sidebar/nav link; second tab with live-refresh suppressed by user-keyed lock, use-seating-live-refresh.ts:22-25) and the DB holds wedges *rotated-as-if-joined but standing at pre-drag spots* — the owner's screenshot, verbatim.

---

## 2 · Canonical coordinate contract (the documented invariant)

Written as a normative header block at the top of `lib/seating.ts` — the single statement of record. Columns unchanged; **one** interpretation:

> **INVARIANT — Seat-plan coordinate contract (v2, 2026-07-16)**
> 1. `event_tables.x_pos / y_pos` = the table's visual-bbox **CENTRE**, as **percent of the ROOM BOX** — x = % of room width (m), y = % of room length (m). Top-left origin; +x east/right; +y south/down ≡ 3D **+z** (no y-flip). Values may exceed 0–100 (free auto-grow); server clamp −300..900 unchanged.
> 2. **The room box always has metre dimensions:** `venue_width_m × venue_length_m` when both set and >0, else `DEFAULT_ROOM_M = {w:20, d:30}`. The room box is the coordinate **denominator** and is **NEVER content-dependent** — auto-grow is a viewport/display concern (`contentBoundsM`), never a change to what a percent means.
> 3. `rotation_deg` = degrees **clockwise** in the y-down plan view; 3D applies `rotation.y = −deg·π/180`. One conversion site.
> 4. **Body geometry is ONE metric family:** local px geometry from `tableGeometry(type, capacity)` uniformly scaled by `TABLE_FOOTPRINT_M[type] / geo.box.w`. Serpentine canonical: Ri≈0.789 m · Ro≈1.183 m · tip rm≈0.986 m · sweep 104° · bbox≈1.865 m · S-bend centre distance≈1.62 m · continue-circle≈1.33 m.
> 5. Rows with NULL x/y get client-only homes from ONE shared resolver; homes are never persisted.
> 6. Percent↔world: `x_m = (xPct/100 − 0.5)·room.w`, `z_m = (yPct/100 − 0.5)·room.d`, and its exact inverse. Nothing else converts.

Behavioral change this implies (the free-board fix): the 2D free board stops filling the region cell at arbitrary aspect — it **letterboxes to the room box's 2:3 aspect exactly like sized rooms** (reuse `scaledBox`, ED:3225-3239), `pxPerMeter = canvasW / room.w` is always defined, tables always render at true metric scale. Anisotropy and canvas-dependence become impossible to author.

---

## 3 · Shared projection API — in `lib/seating.ts`

**Location decision:** `lib/seating.ts`, not a new module. It already owns `tableGeometry`, `TABLE_FOOTPRINT_M`, `legalJoinPose`, `serpentineChainSnap`, `isLegalJoint`, `JOIN_TOL_M` — the geometry authority is one file; a second module would split it and invite drift. `lib/seating-3d.ts` keeps thin 3D adapters and **re-exports** for compatibility (it and plan3d-room/stage consumers keep compiling untouched). Pure, server-safe, no React/three.

New/moved exports:

```ts
export const DEFAULT_ROOM_M = { w: 20, d: 30 };            // MOVED from seating-3d.ts (~:180); re-exported there
export function roomBoxM(floor: { venue_width_m?: number|null; venue_length_m?: number|null })
  : { w: number; d: number; isDefault: boolean };          // absorbs roomSize (S3:332-337)
export function pctToWorldM(xPct: number, yPct: number, room: {w:number;d:number}): { x: number; z: number };
export function worldToPctM(x: number, z: number, room: {w:number;d:number}): { xPct: number; yPct: number };
                                                           // MOVED from S3:369-375 + exact inverse — THE linear map
export function rotationWorldY(deg: number): number;       // −deg·π/180; single conversion site
export function metricGeometry(type: TableType, capacity: number)
  : { box: {w:number;d:number}; outlineM: Vec2[]; tipsM?: {plus:Vec2; minus:Vec2}; bandM?: {ri:number;ro:number;rm:number;sweepDeg:number} };
                                                           // tableGeometry × TABLE_FOOTPRINT_M[type]/geo.box.w — the ONLY body-geometry source
export function legalJoinPoseM(anchor: PoseM, mover: PoseM, tolM?: number): PoseM | null;
                                                           // metric wrapper over legalJoinPose/serpentineChainSnap with ppm folded to 1
                                                           // (the same NOMINAL_W bridge trick actions.ts:1415-1433 and the #3285 oracle already use)
export function validateChainJointM(a: PoseM, b: PoseM): boolean;
                                                           // the pose check inside linkTables, extracted — server, 2D, 3D, tests call THIS
export function resolveHomePcts(rows: TableRow[], room: {w:number;d:number}): Map<string, {x:number;y:number}>;
                                                           // the ONE null-row resolver (defaultGrid/shelf/nearestFree + cleanup, hoisted from ED:1979-2024)
export function fitRoomToCell(room: {w:number;d:number}, cellW: number, cellH: number)
  : { canvasW: number; canvasH: number; pxPerMeter: number };  // letterbox, hoisted from scaledBox (ED:3225-3239)
export function canvasPxToPctM(px: Vec2, fit: ReturnType<typeof fitRoomToCell>, room): { xPct; yPct };  // + inverse
export function contentBoundsM(rows, room): { w: number; d: number };  // display envelope for out-of-0–100 tables — VIEWPORT ONLY
```

**Per-view code deleted / replaced (the checklist):**

| File | Delete/replace | Becomes |
|---|---|---|
| `lib/seating-3d.ts` ~:381-382 | `SERP_RI=0.95 / SERP_RO=1.55 / SERP_SWEEP` | derived from `metricGeometry('serpentine')` |
| `lib/seating-3d.ts` `serpentineBand()` ~:410-435 | own radii | thin adapter over `metricGeometry(...).bandM` (x→x, y→z). Chair-ring cosmetics (`SERP_CHAIR_GAP`, `serpSeats`) may stay 3D-local — only position/snap/validation geometry must be shared |
| `lib/seating-3d.ts` `serpentineChainSnapWorld` ~:473-521 | independent candidate generator | convert-call-convert wrapper over `legalJoinPoseM` — 3D snap output passes `isLegalJoint` **by construction** |
| `lib/seating-3d.ts` `tableDims` ~:566-583 | hand-typed per-shape table | `metricGeometry(...).box` for every shape |
| `lib/seating-3d.ts` `DEFAULT_ROOM`/`roomSize`/`pctToWorld` | own definitions | re-exports of the seating.ts versions (plan3d stage/dance/booth consumers unaffected) |
| `plan3d/kit/serpentine-top.ts` :19-30 | `SERPENTINE_TOP_GEO` third copy of radii | mesh extruded from `metricGeometry('serpentine').outlineM` |
| `seating-editor.tsx` ED:2263-2264 + 2362-2363 | per-axis `%` conversions (x/rect.width, y/rect.height) | `canvasPxToPctM` (isotropic) |
| `seating-editor.tsx` ED:540-544 + 3225-3239 null branch + ED:5196 `tableScale : 1` | free-board fill-the-cell + scale-1 rendering | `fitRoomToCell(roomBoxM(floor), …)` always; metric `tableScale` always |
| `seating-editor.tsx` ED:1636-1639 | groupSnap px-round-trip apology | group snap runs in world metres |
| `lab/page.tsx` LP:100-121 | bare `defaultTablePosition` null fallback | `resolveHomePcts` (identical homes in both views) |
| `actions.ts` ~:1413-1435 | `NOMINAL_W=1000` bridge + `venueW && venueL` guard in `linkTables` | `validateChainJointM` on `pctToWorldM` poses; guard drops so **free-board links validate too** |
| `seating-lab-3d.tsx` LAB:674-712 | oracle bridge (validation-only) | **stays mounted** — collapses to an identity check; permanent runtime tripwire |

---

## 4 · Existing-data normalization — ZERO row rewrites, ZERO schema change

- **Sized-room rows:** already conform to contract v2 (isotropic % of venue metres). No migration, no visual movement in either view.
- **Free-board rows:** genuinely ambiguous — the save-time canvas aspect was never persisted and is unrecoverable. There is exactly one deterministic interpretation in the system today: **3D's 20×30 reading. Adopt it as canonical.** x/y read verbatim; every saved free-board room renders in 3D pixel-identically before/after; only the 2D free-board rendering changes — *to finally match 3D*. This is interpretation-unification, not rearrangement.
- **No `layout_space`/`coord_space_version` column** (two proposals wanted one — rejected, see §8): the contract is fully derivable, and a version column institutionalizes two interpretations of the same columns forever — the exact anti-pattern that caused this bug.
- **Surprise mitigation (cosmetic, client-side):** free-board rooms with persisted positions show a one-time dismissible chip in the 2D editor — "2D and 3D now show the same room — review your layout and Save to confirm" (dismissal in localStorage; no durable state needed).
- **Pre-existing damaged chains:** a read-only **invariant report** (admin script) lists `link_group_id` groups whose joints fail `validateChainJointM` @ 5 cm — run BEFORE merge to size the blast radius (quantifies 3D-authored chains persisted at 2.06 m spacing that will show a ~0.44 m gap post-unification). Repair = per-room, **user-invoked "Repair chain"** affordance (re-pose movers via `legalJoinPoseM`, marks dirty, user saves). **Never automatic. Existing `link_group_id` rows are never retro-invalidated** — the validator applies to NEW link attempts only.

---

## 5 · Freshness — the guarantee at every door into 3D

**Core fix first (kills the screenshot state):** new server action in `seating/actions.ts`:

```ts
commitWeld(eventId: string, poses: Array<{ tableId: string; xPct: number; yPct: number; rotationDeg: number }>)
```

At connective-snap drag-end, persist **mover pose + anchor pose in ONE round trip** (replacing the lone `commitRotation` at ED:~2637-2641) and remove both ids from the dirty set. `commitWeld` does **NOT** write `link_group_id` (honors the owner-locked "positioning, NOT linking" comment on main). Additive only — `updateTablePosition` / `updateTableRotation` signatures untouched (#3307/#3317 paths unaffected). The 3D snap's persist path uses `commitWeld` too (replacing the split writes at LAB:~1041-1057), and the 3D `doLink`-on-snap (LAB:~1059-1063) is **REMOVED** — linking in both views happens only via the explicit link affordance → `linkTables` → the one validator. Rule: **any gesture that changes both pos and rot persists both atomically or neither.** This is a bug-fix scoping of the already-shipped instant rotation persist, not new autosave — plain moves stay deferred (sign-off S2 respected; see §10).

**Door audit:**

| Door | Anchor | Guarantee |
|---|---|---|
| Save & view (2D → lab segment) | ED:3301-3315, #3285 | **Unchanged** — the golden path; stays put on save failure. SEG lab→2D covered as-is |
| Hub "Seat plan" tile → `/seating/lab` direct | add-ons-catalog.ts:174-179 | Safe: DB is always gesture-coherent post-`commitWeld`. A stale plain move renders a coherent room, just pre-move — plus the dirty banner (below) |
| Direct URL / bookmark / refresh | — | Same as above |
| SPA nav out of dirty 2D editor (sidebar/nav/checklist/guest-journey links) | customer-menu.ts:152 et al. | **Visible staleness, never silent:** on dirty-set change + pagehide, write localStorage marker `seating-dirty:{eventId}` = `{dirtyIds, ts}`; cleared on save/discard. The lab (any tab) shows a non-blocking banner when a fresh marker exists: "Unsaved 2D changes aren't shown here — return to the editor to save." Editor restores/re-offers on return. `beforeunload` (ED:3277) keeps covering hard unloads |
| Second tab, same user | use-seating-live-refresh.ts:22-25 | Key the edit-lock by **user + per-tab nonce** (`sessionStorage` + `crypto.randomUUID()`): the same user's second tab is a foreign editor → live-refreshes persisted truth + shows "editing in another tab". Also **mount `useSeatingLiveRefresh` in the lab** so any post-save write repaints it within ~1 s |

Resulting invariant: **the DB never holds a half-applied gesture; any saved room renders identically in 2D and 3D; unsaved 2D deltas are visibly flagged in the lab.**

---

## 6 · THE PROOF SUITE (merge-gated)

New `apps/web/lib/seating-parity.test.ts` + typed fixture `apps/web/lib/seating-golden-room.fixture.ts` (rows shaped exactly as `event_tables`/`event_floor_plan`), plus extensions to existing `seating-oracle.test.ts` / `seating-weld.test.ts` / `seating-3d.test.ts`. Runner: existing `test:unit` = `tsx --test "lib/**/*.test.ts"` — **runs in the required CI job (ci.yml:33), so the proof is a merge gate**, not documentation.

**Golden fixture:** two rooms — SIZED 12×18 m and FREE (venue dims null ⇒ 20×30) — each with `round_10`, `long_banquet_8` @ 45°, `sweetheart`, a NULL-position table, and a **connected S-bend serpentine pair** whose second pose is the literal `legalJoinPose` output.

**Anti-tautology rule for the whole suite:** tests enter through each view's REAL seam — extract pure `editorWorldPose(row, floor, canvasWpx)` (the exact function the editor's render style + drag math call) and use the lab's real mesh-home path — so re-forking either view's inline math fails CI even if the shared lib is intact.

- **T1 — Projection identity + round-trip (prompt req.):** for every golden table, `pctToWorldM(worldToPctM(p, room), room) ≈ p` (< 1e-9 m); and *save-in-2D → project-to-3D → identical world pose*: `editorWorldPose` ≡ `pctToWorldM` per row (< 1e-6 m), both rooms.
- **T2 — Canvas independence (free-board case):** `editorWorldPose` at canvasW **1400 px vs 375 px** identical (< 1e-6 m); free-board golden room at 375/768/1400 px cells yields identical metric inter-table vectors. Property extension: 20 random layouts × cells 375×600→1920×800, `canvasPxToPctM` output cell-invariant. The Gun-B bug class dies here.
- **T3 — One geometry family (frozen goldens):** `metricGeometry('serpentine')` ≡ 3D `serpentineBand()` adapter ≡ mesh band params (< 1e-9); **frozen literals** bbox≈1.865 m · S-bend 1.62 m · continue-circle 1.33 m · tip rm 0.986 m, with the numbers in the assertion message — an innocent px tweak in `tableGeometry` fails loudly, demanding an explicit golden bump + data-compat decision.
- **T4 — Golden S-bend cross-view (the owner's screenshot as a test):** anchor A at (40%, 55%, 20°); B snapped via (i) the 2D path (canvas px → oracle → pct) and (ii) the 3D path (world → `legalJoinPoseM` → pct). Assert identical (xPct, yPct, rot) < 1e-6; `isLegalJoint(A,B)` passes (server accepts the link from EITHER view — the ~0.44 m lab-link rejection is provably dead); tips coincide < **JOIN_TOL_M/10 = 5 mm** in BOTH projections; pct→metres→pct round-trip at 3 room sizes (incl. 20×30) keeps the joint legal.
- **T5 — Seam closure property:** 200 random anchor poses × both ends × {S-bend, continue-circle}: oracle-generated mover passes `isLegalJoint`; 3D tip coincidence ≤ 5 mm; pct round-trip < 1e-9.
- **T6 — Null-row home parity:** NULL-x/y rows through `resolveHomePcts` consumed via the ED-resolver path AND the LP path → identical pct per id (pins both call sites to the one function).
- **T7 — Regression pins (captured from main BEFORE the refactor, committed as fixtures):** (i) #3307 — the 2D oracle's candidate poses for the golden anchor byte-identical post-refactor (2D family is canonical ⇒ 2D snap numbers must not move); (ii) #3317 — delete one wedge of the golden linked pair → survivor's x/y/rot untouched, group dissolves (extend `seating-weld.test.ts`); (iii) `commitWeld` atomicity — mocked action layer: one round trip carries both poses, dirty set drops both ids, **zero lone rotation writes** at weld drag-end.
- **T8 — Render-seam guard (DOM-level):** render the editor at a fixed canvas and diff a golden table's `left/top%` against `editorWorldPose` — blocks the "test imports the shared lib but render uses inline math" tautology. Lab-side: the #3285 oracle bridge stays mounted as the runtime identity tripwire.
- **Pre-merge data report (not a test):** the §4 invariant report over prod — counts `link_group_id` groups failing `validateChainJointM` @ 5 cm; output attached to the PR.

---

## 7 · Implementation order — ONE PR, five ordered commits (each green)

One reviewable PR on a fresh worktree branch (`claude/seatplan-2d3d-sync`), `changelog.d/` fragment included. Commits are review units:

1. **Pin.** Capture T7 golden snapshots from current main (oracle candidates, #3317 behavior) into fixtures; land the fixture + test harness skeleton. All pins green on unmodified code.
2. **Extract.** Move/derive the §3 API into `lib/seating.ts`; `seating-3d.ts` re-exports; **zero behavior change** — pins + full existing seating suites (`seating.test.ts`, `seating-oracle.test.ts`, `seating-weld.test.ts`, `seating-3d.test.ts`, `plan3d-room.test.ts`, `seating.reconcile.test.ts`) green.
3. **3D adopts the family.** `serpentineBand` adapter · `tableDims`→`metricGeometry` · `serpentineChainSnapWorld`→`legalJoinPoseM` wrapper · mesh from `outlineM` · LP→`resolveHomePcts` · `linkTables`→`validateChainJointM` (guard drops). Visible: 3D serpentines shrink 2.443→1.865 m. T3/T4/T5/T6 turn green here.
4. **2D free board goes metric.** `fitRoomToCell(roomBoxM(...))` always; delete anisotropic branches (ED:540-544/2263-2264/2362-2363/3225-3239 null path/5196); review chip. T1/T2 fully green. Sized rooms byte-identical (asserted by T1 on the sized fixture).
5. **Freshness.** `commitWeld` + remove 3D link-on-snap + per-tab lock nonce + dirty marker/lab banner + lab live-refresh. T7(iii) + T8 green.

**Forced-split criterion (the only sanctioned split):** if the §4 invariant report shows a non-trivial number of live 3D-authored chains, split commit 3 (geometry) and commit 4 (free-board) into two PRs so owner comms for each visual change can be staged. Otherwise ship as one.

---

## 8 · Rejected ideas (with reasons)

1. **Converge on the 3D metric family** (make 2D bigger): force-rearranges every 2D-snapped saved chain (1.62 m spacing) — violates the no-force-rearranging constraint; the server validator lineage (`linkTables`/`isLegalJoint`/#3307 oracle) already speaks the 2D family. Direction is not symmetric.
2. **`layout_space`/`coord_space_version` schema column + legacy dual-render adapter + consent dialog** (persistence, architecture): institutionalizes two interpretations of the same columns indefinitely — the anti-pattern that caused the bug; the contract is fully derivable; and 3D never had a second interpretation to preserve. The dismissible chip delivers the surprise-mitigation without the complexity tax.
3. **Auto-save-on-exit via sendBeacon/keepalive** (verification §c-2): it is autosave under sign-off S2. Rejected until the owner amends S2 — the seam is one function if they do.
4. **SPA nav-guard interception as a correctness mechanism**: App Router has no route events; capture-phase anchor hooks miss programmatic `router.push` and misfire on modified-clicks/prefetch — two proposals independently flagged their own guard as their top failure mode. Correctness rests on atomic `commitWeld` + visible staleness instead; a best-effort guard may land later as pure UX, never load-bearing.
5. **Keep 3D link-on-snap** (architecture's default): asymmetric with the owner-locked "positioning, NOT linking" (2026-07-16, in the code); removal gives one linking regime through one validator.
6. **New `lib/seating-space.ts`/`seating-projection.ts` module** (3 of 4 proposals): splits the geometry authority across two files — `tableGeometry`/`legalJoinPose`/`isLegalJoint` already live in `lib/seating.ts`; the API lands there.
7. **Room box that grows with content** (verification's `roomBoxM` growth): would make the percent denominator content-dependent — the same class of bug as Gun B. Growth is viewport-only (`contentBoundsM`).
8. **Automatic repair/migration of damaged chains**: never automatic; user-invoked "Repair chain" only.
9. **Inverting the constant derivation now** (freeze metres, derive px — coordinates' end-state option): correct end-state, wrong moment; T3's frozen goldens give the same protection without touching the px source. Revisit after soak.
10. **Playwright numeric smoke as a required merge gate**: valuable, but the required-CI proof must live in `test:unit`; the e2e smoke may land as a non-required follow-up.

---

## 9 · REGRESSION FENCES — must-not-break

- **#3307 connect snap:** 2D oracle candidate poses **byte-identical** (T7-i pin); linking stays deferred ("positioning, NOT linking" comment preserved verbatim).
- **#3317 delete:** delete one wedge of a linked pair → survivor pose untouched, group dissolves (T7-ii, extended `seating-weld.test.ts`).
- **Walkway/oracle bridge (#3285, LAB:674-712):** stays mounted; must remain green (now an identity check).
- **Save & view (#3285, ED:3301-3315):** semantics unchanged, including stay-put-on-save-failure; Save chip/⌘S unchanged.
- **Sign-off S2 (no autosave):** plain moves stay deferred; `commitWeld` scoped strictly to the weld gesture.
- **Server contract:** clamp −300..900; `updateTablePosition`/`updateTableRotation` signatures untouched (additive `commitWeld` only); existing `link_group_id` rows never retro-invalidated.
- **Rotation convention:** `rotation.y = −deg` / y-down clockwise — pinned by test, unchanged.
- **Recent same-file features** (`b183a9a8a` booth picker + entrance, `fbdabd087` stage/dance wall-snap + room presets + 2D booth footprint): consume `roomSize`/`pctToWorld` via the re-exports; `plan3d-room.test.ts` + `seating-3d.test.ts` must stay green; rebase against current main before starting.
- **Sized-room rendering:** byte-identical in 2D (T1 sized fixture) — the only intentional visual deltas are §10's two sign-off items.

---

## 10 · Owner sign-offs (surfaced, not blocking the build)

1. **3D serpentines visibly shrink ~24%** (band 2.443 → 1.865 m) to match the 2D/server family of record. Before/after renders attached to the PR. Rooms hand-spaced in 3D around the fat band will show gaps until "Repair chain" is used.
2. **Free-board 2D re-projection:** free-board rooms re-render in 2D to match what 3D always showed (20×30, metric table scale). Desktop-authored rooms move most; phone-authored barely. Chip copy for approval: *"2D and 3D now show the same room — review your layout and Save to confirm."*
3. **S2 boundary confirmation:** atomic weld persist is framed as a bug-fix scoping of the already-shipped instant rotation persist (rotation already writes at drag-end today) — confirm this reading of "no autosave". Plain moves remain Save-only. Optional future amendment: allow exit-flush of dirty positions (one-function seam, not in this PR).