---
iteration_id: 0008_seating_chart_editor
iteration_number: 0008
spec_source: 0008_seating_chart_editor.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — 0008 — Seating Chart Editor

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0008_seating_chart_editor.md` (spec) · `0008_seating_chart_editor.html` (prototype) · `0008_seating_chart_editor.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] What to build
- [ ] Visual reference (canonical)
- [ ] Stack & conventions
- [ ] Route
- [ ] Data model
- [ ] `tables` table
- [ ] `event_floor_plan` table (singleton per event)
- [ ] Venue elements summary
- [ ] Table-type catalog (frontend constant)
- [ ] Resizable venue elements
- [ ] Page composition (desktop)
- [ ] Page composition (mobile)
- [ ] Chair-level interaction (per-seat circles)
- [ ] Chair appearance
- [ ] Interactions
- [ ] Knowing who an initial-only chair belongs to
- [ ] Auto-fill — role-tier rings
- [ ] Tier definitions
- [ ] Algorithm
- [ ] What auto-fill does not do
- [ ] Publish flow + table QR generation
- [ ] What `Publish` does (server-side, atomic)
- [ ] Print pack (downloadable PDF)
- [ ] Functional scope
- [ ] Must work end-to-end

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** - Auth: Same dashboard guard as 0001 — couple must own the event.
- [ ] **AC-02.** Tables cannot be placed inside it.
- [ ] **AC-03.** - tablespool = all tables NOT in the "manually-locked" set (couple can right-click a table → Lock placement; locked tables keep their current guests and are skipped).
- [ ] **AC-04.** Per couple decision (2026-05-09): guests cannot tag from a roster or list — the only path to tag another guest is to physically scan that guest's personal QR.
- [ ] **AC-05.** - Round, sweetheart, family-head: rotation is locked at 0°.
- [ ] **AC-06.** At least one door of kind: 'main' must exist by Publish.
- [ ] **AC-07.** - [ ] Auto-fill never moves an already-placed guest; never touches a locked table; never seats declined/pending RSVPs; never seats a sweetheart-type table.
- [ ] **AC-08.** This is primarily a 0012 / future-iteration concern, but the seating chart is the surface that distributes the QR cards and therefore the gateway to the trust handshake — the print-pack design must keep personal QRs legible enough to scan reliably.
- [ ] **AC-09.** CLAUDE.md — project context, locked SKUs, decision log.

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `Publish`
- [ ] `Unseated`
- [ ] `event_floor_plan`
- [ ] `side`
- [ ] `table_assignment_id`
- [ ] `tables`

## Test scenarios

### Positive (happy path)

- [ ] User performs the primary intended flow end-to-end with valid inputs. Result: success state visible in UI; DB rows created; observability events emitted.
- [ ] Repeat the flow with a second user/event to confirm scoping (no cross-tenant data leakage).

### Negative (rejected inputs)

- [ ] Submit each form with required field missing → server rejects with the documented error message; no DB write.
- [ ] Submit each form with malformed input (wrong type, out-of-range, oversized) → server rejects; no DB write.
- [ ] Attempt the flow without authentication → 401.
- [ ] Attempt the flow as the wrong role → 403; no row leak.

### Edge cases

- [ ] Slow network (throttle to 4G) — UI still responds within performance budgets.
- [ ] Offline at the moment of submission — queued write, replayed on reconnect (where iteration spec calls for offline support).
- [ ] Concurrent updates by two browser tabs — last-write-wins or optimistic-lock per spec.
- [ ] Boundary values: empty collections, single-item collections, max-size collections, items at exact field-length limits.
- [ ] Time-zone correctness: dates near midnight PHT vs UTC.

### RLS / authorization

- [ ] Row-level security policies match the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md` for every table this iteration touches.
- [ ] Cross-event isolation: a user in event A cannot read/write event B's data.
- [ ] Admin actions are gated where the iteration spec requires two-admin approval (per § 9.1).

## Performance + accessibility budgets

- [ ] Initial paint < 1.5s on throttled 4G (per `0019` comms perf discipline checklist).
- [ ] Interaction-to-next-paint < 200ms for primary actions.
- [ ] All interactive elements keyboard-navigable.
- [ ] Color contrast ≥ 4.5:1 for body text, 3:1 for UI elements (WCAG AA).
- [ ] Mobile thumb-zone targets ≥ 44pt × 44pt.
- [ ] No PII in client-side logs (RA 10173).

## Test data fixtures

Sample data lives in `fixtures.json` co-located in this folder (create alongside this file). Tests should reference it by key, not hardcode values, so prototype, tests, and dev seed share one source of truth.

```json
{
  "// example": "see fixtures.json"
}
```

## CI signal

Before this iteration's PR can merge:

- [ ] All acceptance criteria checkboxes ticked.
- [ ] Coverage report shows ≥ 80% line coverage on new code paths.
- [ ] No new Sentry errors of severity ≥ warning in CI smoke run.
- [ ] PostHog events fire for every spec-required telemetry point.
- [ ] Observability runbook entry (per iteration 0035) updated if alerts changed.

