---
iteration_id: 0009_photo_delivery
iteration_number: 0009
spec_source: 0009_photo_delivery.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — 0009 — Photo Delivery to Couple's Cloud (Google Drive)

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0009_photo_delivery.md` (spec) · `0009_photo_delivery.html` (prototype) · `0009_photo_delivery.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] What to build
- [ ] Visual reference (canonical)
- [ ] Stack & conventions
- [ ] Routes
- [ ] Data model
- [ ] Extensions to `events`
- [ ] Extensions to `photos`
- [ ] New table: `photo_delivery_jobs`
- [ ] OAuth flow
- [ ] Connect (one-time per event)
- [ ] Token refresh
- [ ] Disconnect
- [ ] Release pipeline (the upload job)
- [ ] Trigger
- [ ] Worker
- [ ] Manifest CSV
- [ ] Notification on completion
- [ ] Page composition (desktop)
- [ ] State 1 — Connect (idle)
- [ ] State 2 — Ready (connected, photos finalized, awaiting release)
- [ ] State 3 — Uploading
- [ ] State 4 — Complete
- [ ] Page composition (mobile)
- [ ] State 1 — Connect
- [ ] State 2 — Ready

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** CLAUDE.md — project context, locked architecture, decision log.
- [ ] **AC-02.** - Do NOT use a paste-link folder model. That was the rejected option B; the locked decision is OAuth.
- [ ] **AC-03.** - Background-job runner choice. Cloudflare Queues is the locked choice.

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `photo_delivery_jobs`

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

