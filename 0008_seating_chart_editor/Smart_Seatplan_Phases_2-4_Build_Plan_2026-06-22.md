# Smart Seat-Plan — Phases 2/3/4 Build Plan (verified 2026-06-22)

> Produced by a design workflow (parallel subsystem readers → synthesis → adversarial re-verification against `origin/main`). **Phase 1 (combined linked-table seat count) shipped as PR #1997.** This is the executable plan for the remaining three phases. Companion: memory `project_setnayan_smart_seating_plan` (design + locked decisions).

## VERDICT — strictly SEQUENTIAL: P2 → P3 → P4 (one auto-merged PR each)

**Not parallel.** Two independent reasons, both verified:

1. **Logical dependency chain.**
   - **P3's solver warm-starts from P2's `computeAutoSeat(... priorityOrder)`** — building P3 first means re-implementing P2's tier weighting inside the solver, then ripping it out (rework + conflict).
   - **P4 extends P3's `solveSeatPlan` return shape and adds `locked` pinning** — it literally cannot compile against a non-existent solver.
2. **File contention.** All three phases edit `lib/seating.ts` and the ~5,031-line `seating-editor.tsx` in overlapping regions, plus **linearly-timestamped migrations**. Parallel branches = guaranteed three-way conflicts in the monolith.

**What parallelizes — only *within* a phase** (build pure-lib + migration + tests first; wire the editor last):

| Phase | Parallel lanes | Serialize last |
|---|---|---|
| P2 | A priority weighting (pure) · B resolver+persistence (pure) · D migration · E tests | C editor Section + toolbar button |
| P3 | A migration · B `solveSeatPlan` (pure, long pole — test-first) · E tests | C keep-apart UI · D server action |
| P4 | A migration · B locked-aware solver + `relaxLowestPriorityRule` (pure) · E tests | C relax/lock UI · D `solveWithLockedSeats` |

**Migrations: per-phase, NOT front-loaded.** Each migration is the first commit of its phase PR (honors the "schema FIRST, RLS at CREATE TABLE" lock per phase + keeps each migration tied to its CHANGELOG/`SPEC IMPACT`). Apply in-session via `supabase db push --db-url "$SUPABASE_DB_URL"`.

## Verified codebase facts (anchor by SYMBOL, not line — editor lines drift ~200/PR)

- **Migrations dir:** `supabase/migrations/` (repo root, NOT `apps/web/...`). Latest after the 2026-06-22 merge: `20270209911535_ai_paywall_flag_db_toggle.sql`. **Next free slots: `20270210000000`, `20270211000000`, `20270212000000`.** A `migration timestamp guard` CI check enforces ordering.
- **RLS (couple-owned, event-scoped):** helper `public.current_couple_event_ids()` `RETURNS SETOF UUID`. Pattern: `event_id IN (SELECT public.current_couple_event_ids())`. Write policy idiom: `FOR ALL TO authenticated USING (…) WITH CHECK (…)`. RLS enabled at CREATE TABLE time. This satisfies couple-private (RA 10173) — no vendor/guest read path.
- **Lock gate (every mutating action):** `await assertSeatingLockHeld(supabase, eventId, lockIdFrom(formData))` (defined `actions.ts` ~L50) then `await refreshSeatingLock(...)` after the write.
- **`event_seat_assignments`:** `UNIQUE(event_id, guest_id)`; seat writes use `.upsert(..., { onConflict: 'event_id,guest_id' })`. No `locked` column yet (P4 adds it).
- **`event_floor_plan`:** per-event singleton; Pattern-B RLS already on it; no `priority_order` column yet (P2 adds it). `FloorPlanRow` type + `fetchFloorPlan` select string must gain the new column with `?? null`.
- **Auto-seat math:** `computeAutoSeat()` (the editor-facing seater) is the warm-start primitive. `computeAutoLayout()` is **type-driven, not guest-driven — do NOT thread `priorityOrder` into it** (corrects the original memory note). Stage ranking already exists via `rankTablesByStage()`.
- **Tier mapping:** `roleTier`/`guestTier` + `ROLE_TIER_LABELS`; honors a per-guest `seating_priority` override. Maps onto the locked 3-tier default.
- **Phase-1 reuse:** once #1997 merges, `groupTablesIntoUnits()` + `TableDisplayUnit` are on main — **P3's "same table" check must be link-group-aware** (two keep-apart guests must not share a `link_group_id`, since linked tables are one pool). `lib/seating.test.ts` (tsx `--test`, the `test:unit` script) is the established pure-lib test home; `tests/e2e/seating-logic.spec.ts` (Playwright no-browser, `mkTable`/`mkGuest`) is the alternative. Use `lib/seating.test.ts` for pure solver tests.
- **⚠ Parallel session:** branch `claude/seating-auto-layout` (worktree `~/wt-seating-autolayout`, ~310 commits behind, in-progress) may have an open PR touching `lib/seating.ts`/`seating-editor.tsx`. **Pre-flight `gh pr list --search "seating in:title,body"` before branching P2.**

---

## PHASE 2 — Priority tiers (draggable) + stage-distance weighting

**Migration** `supabase/migrations/20270210000000_seating_priority_order.sql` — additive, idempotent (inherits floor-plan RLS):
```sql
BEGIN;
ALTER TABLE public.event_floor_plan ADD COLUMN IF NOT EXISTS priority_order JSONB;
COMMENT ON COLUMN public.event_floor_plan.priority_order IS
  'Draggable seating-priority tier list (Phase 2). Ordered JSON array, highest priority first. NULL = lib/seating defaultPriorityOrder().';
COMMIT;
```
Then add `priority_order` to `FloorPlanRow` + `fetchFloorPlan` select (`?? null`).

**`lib/seating.ts` (pure):**
- `PriorityTier = { tier: 1|2|3|4; label: string }`; `PriorityOrder = PriorityTier[]`.
- `defaultPriorityOrder()` — locked 3-tier default reusing `ROLE_TIER_LABELS`: ① family+principal sponsors, ② secondary sponsors+entourage, ③ everyone else (collapse role tiers 3/4).
- `resolvePriorityRank(order|null) → Record<1|2|3|4, number>` (null → default).
- `computeAutoSeat()` — append optional `priorityOrder?: PriorityOrder | null = null` (back-compatible; all callers keep compiling). Replace the hardcoded tier-iteration order with the resolved rank. **Leave within-tier clustering / plus-one / group-key logic untouched.**
- Make the VIP stage-weight an explicit tested invariant: `stageWeight = priorityRank × 1/(1+distance)`; top tier fills stage-closest tables first.

**`actions.ts`:** `savePriorityOrder(formData)` — gate + upsert `event_floor_plan` `{onConflict:'event_id'}` + refresh + revalidate (mirror `saveFloorPlan`). Thread `priorityOrder` into `autoSeatGuests`.

**`seating-editor.tsx`:** new collapsible `<Section label="Seating Priority">` **after the "Member Groups" Section** (grep `Member Groups` to find it). Draggable list (reuse existing table dnd) → optimistic → `savePriorityOrder`. Surface "Build my seating" (`buildDraft`) + Auto Arrange (`runAutoArrange`) if gated invisible. Do not refactor `cyclePriority`/`MemberRow`.

**Tests (`lib/seating.test.ts`):** `defaultPriorityOrder` shape · `resolvePriorityRank(null)`=default & reorder flips ranks · `computeAutoSeat` with a bumped tier places that guest stage-closest before a higher role tier (assert exact `table_id`/`seat_number`) · stage-weight invariant.

---

## PHASE 3 — Keep-apart constraints + constraint-aware solver

**Migration** `supabase/migrations/20270211000000_event_seating_constraints.sql`:
```sql
BEGIN;
CREATE TABLE IF NOT EXISTS public.event_seating_constraints (
  id            BIGSERIAL PRIMARY KEY,
  constraint_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  event_id      UUID NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
  kind          TEXT NOT NULL CHECK (kind IN ('keep_apart')),
  guest_a_id    UUID NOT NULL REFERENCES public.guests(guest_id) ON DELETE CASCADE,
  guest_b_id    UUID NOT NULL REFERENCES public.guests(guest_id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT seating_constraints_not_self CHECK (guest_a_id <> guest_b_id)
);
-- ⚠ Expression-unique must be a UNIQUE INDEX, NOT a table-level UNIQUE(...) clause (would fail at db push):
CREATE UNIQUE INDEX IF NOT EXISTS event_seating_constraints_unique_pair
  ON public.event_seating_constraints (event_id, LEAST(guest_a_id,guest_b_id), GREATEST(guest_a_id,guest_b_id));
CREATE INDEX IF NOT EXISTS event_seating_constraints_event_kind_idx ON public.event_seating_constraints(event_id, kind);
ALTER TABLE public.event_seating_constraints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS event_seating_constraints_couple_read ON public.event_seating_constraints;
CREATE POLICY event_seating_constraints_couple_read ON public.event_seating_constraints
  FOR SELECT TO authenticated USING (event_id IN (SELECT public.current_couple_event_ids()));
DROP POLICY IF EXISTS event_seating_constraints_couple_write ON public.event_seating_constraints;
CREATE POLICY event_seating_constraints_couple_write ON public.event_seating_constraints
  FOR ALL TO authenticated
  USING (event_id IN (SELECT public.current_couple_event_ids()))
  WITH CHECK (event_id IN (SELECT public.current_couple_event_ids()));
COMMIT;
```

**`lib/seating.ts` — `solveSeatPlan` (pure, deterministic — the long pole):**
1. **Group-expansion (group-aware):** expand each rule to the cross-product of both guests' `group_id` members → `Set` of forbidden unordered pairs.
2. **Linked-table awareness:** "same table" = same `link_group_id` (when non-null) OR same `table_id` (reuse Phase-1 `groupTablesIntoUnits`).
3. **Warm-start:** `computeAutoSeat(..., priorityOrder)` ignoring constraints (deterministic start).
4. **Seeded local search:** mulberry32/xorshift PRNG seeded from `seed` (default constant) — **no `Math.random`**. Cost = forbidden pairs co-seated. Bounded passes (`min(500, guests²)`); swap toward equal/lower-priority tables first (preserve VIP stage placement); accept only cost-non-increasing; tie-break lowest `(table_id, seat_number)`.
5. **Graceful degrade:** always return `{ assignments, violations[], satisfiedCount, totalRules }` best-effort; never throw, never empty.

**`actions.ts`:** `addSeatingConstraint`/`removeSeatingConstraint` (gated; RLS+unique-index dedup); `fetchSeatingConstraints` helper in `lib/seating.ts`; upgrade `autoSeatGuests` to fetch constraints → `solveSeatPlan` → upsert.

**`seating-editor.tsx`:** Seating-Guide keep-apart chips (reuse `SeatPeoplePanel` search for the picker); wire `solveSeatPlan` into `runAutoArrange` only when `keepApart.length>0`; violations banner in the `notice` render region (count-only in P3).

**Tests:** group cross-product · linked-table awareness · determinism (same input+seed → identical) · satisfiable→`violations:[]` · over-constrained→best-effort non-empty, no throw.

---

## PHASE 4 — Explainability + lock-and-fill

**Migration** `supabase/migrations/20270212000000_seat_assignment_locked.sql`:
```sql
BEGIN;
ALTER TABLE public.event_seat_assignments ADD COLUMN IF NOT EXISTS locked BOOLEAN NOT NULL DEFAULT FALSE;
COMMENT ON COLUMN public.event_seat_assignments.locked IS
  'Phase 4 lock-and-fill: TRUE = hand-placed seat pinned; the solver treats it as fixed and fills around it.';
COMMIT;
```
Add `locked` to `SeatAssignmentRow` + `fetchAssignments` select (`?? false`).

**`lib/seating.ts`:** `solveSeatPlan` honors locked seats (pinned in warm-start + never swapped). `relaxLowestPriorityRule(rules, guests, priorityOrder)` — drop the one rule whose lower-priority guest is lowest-ranked (deterministic tie-break by `guest_id`).

**`actions.ts`:** `toggleSeatLock(formData)` (flip `locked`); `solveWithLockedSeats(formData)` (solve with locked rows pinned → return `SolveResult`).

**`seating-editor.tsx`:** Relax button in the violations banner; per-seat lock toggles in the per-table popup footer — **⚠ the popup has TWO duplicated branches (phone + desktop); de-dup the seated-occupants list into one shared sub-component INSIDE this PR** so the lock toggle lands once (worst contention zone). "Lock & Re-solve" near Auto Arrange.

**Tests:** locked seat never moves, free seats fill around it · `relaxLowestPriorityRule` deterministic · after relax+re-solve `satisfiedCount` rises · contract `satisfiedCount + violations.length === totalRules`.

---

## START HERE for Phase 2 (after #1997 merges)

1. **Pre-flight:** `gh pr list --search "seating in:title,body"` — coordinate with/land any `claude/seating-auto-layout` PR touching `lib/seating.ts`/`seating-editor.tsx` first.
2. **Fresh worktree off real main:** `git fetch origin && git worktree add … -b claude/seatplan-phase2 origin/main`; verify `git rev-list --count origin/main..HEAD == 0`.
3. **Migration first** (`20270210000000_…`) → `supabase db push` → extend `FloorPlanRow`/`fetchFloorPlan`.
4. **Pure lib + tests first** (`lib/seating.ts` + `lib/seating.test.ts`).
5. **Server action** `savePriorityOrder` + thread into `autoSeatGuests`.
6. **Editor UI last** (grep `Member Groups` for the Section anchor).
7. **Verify with a prod build** (`next build && next start`, not `pnpm dev`).
8. **Ship:** CHANGELOG (+ `changelog.d/` fragment if adopting that pattern) + STATUS + DECISION_LOG; `gh pr create`; `gh pr merge --auto --merge`.
9. **Only after P2 merges, branch P3.**
