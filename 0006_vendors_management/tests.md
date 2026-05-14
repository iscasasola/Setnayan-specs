---
iteration_id: 0006_vendors_management
iteration_number: 0006
spec_source: 0006_vendors_management.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — 0006 — Vendors Management

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0006_vendors_management.md` (spec) · `0006_vendors_management.html` (prototype) · `0006_vendors_management.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] What this iteration builds
- [ ] Visual reference (canonical)
- [ ] Stack & conventions
- [ ] Route
- [ ] Data model
- [ ] `canonical_services` — hardcoded enum
- [ ] `event_vendor_relationships` table
- [ ] `vendor_services` — links a vendor to one or many services (canonical or custom)
- [ ] `event_custom_services` — couple-defined service rows beyond the canonical list
- [ ] `event_service_coverage_status` — per-event flag for "not needed"
- [ ] `vendor_inclusions` — free-form line items inside the package
- [ ] `vendor_payment_milestones` — flexible custom milestones
- [ ] `vendor_crew` — crew count + meal cost computation
- [ ] `vendor_meetings` — scheduled meetings between couple and vendor
- [ ] `vendor_contracts` — uploaded contract files
- [ ] Computed / derived values
- [ ] Per-vendor
- [ ] Per-event aggregate (Vendor Panel header)
- [ ] Hybrid service taxonomy — UX rules
- [ ] Payment milestones — UX rules
- [ ] Crew meals — UX rules
- [ ] Meetings — UX rules
- [ ] DIY-mode vendor browse — filter popup
- [ ] DIY-mode filter popup (locked 2026-05-12)
- [ ] Reviews schema (locked 2026-05-12)

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** The implementation must visually match it at desktop and mobile widths.
- [ ] **AC-02.** No data migration is required when Din launches.
- [ ] **AC-03.** The vendor cannot edit, propose, or confirm — they communicate offline (email, message, call) and the couple records the meeting.
- [ ] **AC-04.** Guided uses the recommender (per the 7 locked Guided UX patterns in memory) that picks vendors based on event constraints.

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `event_custom_services`
- [ ] `event_service_coverage_status`
- [ ] `event_vendor_relationships`
- [ ] `relationship_id`
- [ ] `vendor_contracts`
- [ ] `vendor_crew`
- [ ] `vendor_inclusions`
- [ ] `vendor_meetings`
- [ ] `vendor_payment_milestones`
- [ ] `vendor_reviews`

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

