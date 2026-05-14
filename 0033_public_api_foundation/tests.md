---
iteration_id: 0033_public_api_foundation
iteration_number: 0033
spec_source: 0033_public_api_foundation.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — Iteration 0033 — Public API Foundation

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0033_public_api_foundation.md` (spec) · `0033_public_api_foundation.html` (prototype) · `0033_public_api_foundation.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] 1. Why this iteration exists
- [ ] 2. Architecture
- [ ] 2.1 Gateway
- [ ] 2.2 Authorization server (OAuth2 with PKCE)
- [ ] 2.3 Token storage
- [ ] 2.4 Versioning
- [ ] 2.5 Rate limiting
- [ ] 2.6 Webhook delivery
- [ ] 2.7 OpenAPI 3.1 schema
- [ ] 3. Scoped permissions catalog
- [ ] 3.1 Standard scopes
- [ ] 3.2 Special scopes
- [ ] 3.3 Scope invariants (locked)
- [ ] 4. Developer portal at `developers.setnayan.com`
- [ ] 4.1 Account model
- [ ] 4.2 Portal surfaces
- [ ] 4.3 App approval workflow
- [ ] 5. V1 endpoints (locked-down internal-only)
- [ ] 5.1 Internal callback endpoints
- [ ] 5.2 Sandbox-only public endpoints (V1)
- [ ] 6. V1.5+ endpoint roadmap (NOT building, documenting the order)
- [ ] 6.1 Phase A — Read-only event surface (V1.5 launch)
- [ ] 6.2 Phase B — Webhook delivery (after Phase A learnings)
- [ ] 6.3 Phase C — Public vendor browse
- [ ] 6.4 Phase D — Third-party booking flow (probably never)

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** Delivery semantics: - At-least-once. Subscribers must implement idempotency keys (we provide X-Setnayan-Delivery-Id per attempt) - Retry schedule: 5min → 30min → 2hr → 8hr → 24hr → fail.
- [ ] **AC-02.** Five retries; total span 1d 10h 35m - HMAC signing: every delivery carries X-Setnayan-Signature: sha256=<hex> computed as HMAC-SHA256(body, hmacsecret) so subscribers can verify authenticity - Hard timeout: subscriber must respond within 10 seconds.
- [ ] **AC-03.** No runtime scope escalation is possible — to gain a new scope, the app must re-initiate the OAuth flow and the user must re-consent.
- [ ] **AC-04.** Subscribers MUST implement idempotency keys; we provide X-Setnayan-Delivery-Id so they can.

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `api_audit_messages_access`
- [ ] `api_request_log`
- [ ] `api_tokens`
- [ ] `client_secret`
- [ ] `oauth_applications`
- [ ] `oauth_authorizations`
- [ ] `webhook_deliveries`
- [ ] `webhook_subscriptions`

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

