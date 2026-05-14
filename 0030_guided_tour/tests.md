---
iteration_id: 0030_guided_tour
iteration_number: 0030
spec_source: 0030_guided_tour.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — Iteration 0030 — First-time Guided Tour

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0030_guided_tour.md` (spec) · `0030_guided_tour.html` (prototype) · `0030_guided_tour.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] 1. Why this iteration exists
- [ ] 2. Tour mechanics
- [ ] 3. Per-role tour scripts
- [ ] 3.1 Customer (couple / organizer) — `customer_dashboard_v1` — 8 steps
- [ ] 3.2 Vendor — `vendor_dashboard_v1` — 7 steps
- [ ] 3.3 Guest — `guest_landing_v1` — 4 steps
- [ ] 3.4 Admin — `admin_console_v1` — 6 steps
- [ ] 4. Per-surface mini-tours (deeper dives)
- [ ] Customer mini-tours
- [ ] Vendor mini-tours
- [ ] Admin mini-tours
- [ ] 5. Data model
- [ ] 6. Trigger logic + replay flow
- [ ] 7. Implementation approach
- [ ] 8. Accessibility
- [ ] 9. Tour analytics in 0023
- [ ] 10. Composition with 0021 / 0022 / 0023 / 0031
- [ ] 11. Voice + tone
- [ ] 12. Acceptance tests
- [ ] 13. Decision log
- [ ] 14. Companion docs

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** All three locales must have all keys before a tour can ship — enforced by the locale-completeness CI check from 0015.
- [ ] **AC-02.** Imantala lang nato ang dashboard mo." - No engineering-spec voice. Banned: "Apparatus," "surface," "flywheel," "role-router," "doorway" — even though they're locked terms in the project, public-facing copy uses everyday words.

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `Back`
- [ ] `Finish`
- [ ] `tour_completions`
- [ ] `tour_step_views`

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

