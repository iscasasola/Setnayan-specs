---
iteration_id: 0035_observability
iteration_number: 0035
spec_source: 0035_observability.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — Iteration 0035 — Observability (Error Monitoring · Product Analytics · Health · Status · On-Call)

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0035_observability.md` (spec) · `0035_observability.html` (prototype) · `0035_observability.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] 1. Why this iteration exists
- [ ] 2. The observability stack (locked)
- [ ] 3. Sentry integration
- [ ] 3.1 SDK setup
- [ ] 3.2 Sample rates (V1)
- [ ] 3.3 User context (PII-scrubbed)
- [ ] 3.4 Custom tags
- [ ] 3.5 Breadcrumbs
- [ ] 3.6 Error grouping
- [ ] 3.7 Example: payment-screenshot upload failure
- [ ] 3.8 Release tracking
- [ ] 4. Health endpoints
- [ ] 4.1 GET /api/health (liveness)
- [ ] 4.2 GET /api/health/deep (readiness)
- [ ] 4.3 Per-subsystem ping implementations
- [ ] 5. PostHog product analytics
- [ ] 5.1 Pipe
- [ ] 5.2 Identify on login
- [ ] 5.3 Key events tracked
- [ ] 5.4 Session recordings — DISABLED in V1
- [ ] 5.5 Feature flags
- [ ] 5.6 Cohort + funnel example
- [ ] 6. Better Stack — uptime + status page + on-call
- [ ] 6.1 Uptime monitors
- [ ] 6.2 Status page

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** The non-negotiable: V1 cannot launch without eyes.
- [ ] **AC-02.** Privacy + RA 10173 compliance ### 9.1 No PII in logs Email addresses, full names, phone numbers, payment card details, and government IDs MUST NOT appear in log messages, breadcrumbs, error contexts, or analytics events.

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| On-call paging | **Better Stack** | Free tier supports 1 on-call user · upgrade to ₱500/mo for a 3-person rotation in V1.5 |
| 1 on-call user — Ops Lead (free tier) | 3-person rotation — Ops Lead + Backend Lead + Founder rotates weekly (₱500/mo upgrade) |
| 2026-05-12 | Better Stack over Pingdom + StatusPage + PagerDuty | Single vendor consolidates uptime + status + log + on-call at ₱1K/mo vs ~₱15K split across 4 vendors |
| 2026-05-12 | On-call free tier (1 user) for V1 | Avoid the ₱500/mo upgrade until we have at least 3 engineers to rotate; until then Ops Lead carries the pager |

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `error_code`
- [ ] `policy_name`
- [ ] `vendor_inquiry_responded`

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

