---
iteration_id: 0024_save_the_date
iteration_number: 0024
spec_source: 0024_save_the_date.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — 0024 — Save-the-Date Video Maker

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0024_save_the_date.md` (spec) · `0024_save_the_date.html` (prototype) · `0024_save_the_date.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

Couples announce their wedding date 6–8 months before the event. Setnayan provides a template-driven video maker that produces a polished Save-the-Date in minutes — no editing skills required.

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] 1. Scope
- [ ] What ships in V1
- [ ] What's out of V1
- [ ] 2. SKU
- [ ] 3. Template library
- [ ] Feel categories
- [ ] Template manifest schema (JSON)
- [ ] Master library index
- [ ] 4. Data model
- [ ] `save_the_date_templates`
- [ ] `engagement_clips`
- [ ] `save_the_date_renders`
- [ ] Payment integration
- [ ] 5a. Landing-page hero lifecycle
- [ ] 5. Render pipeline
- [ ] Render flow
- [ ] Estimated render time
- [ ] 6. Surfaces
- [ ] Surface A — Browse Templates
- [ ] Surface B — Template Detail + Create Flow Start
- [ ] Surface C — Create Flow (3 steps)
- [ ] Surface D — Render Progress
- [ ] Surface E — Output / Done
- [ ] 7. Mobile parity
- [ ] 8. Forward dependencies / consumes

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

_(No locked/must/cannot claims auto-extracted. Engineer should populate during implementation.)_

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| Save-the-Date Render | ₱99 | One render of one template across all 3 formats (16:9 + 1:1 + 9:16). Multi-purchase — try as many templates as the couple wants at ₱99 each. |

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

