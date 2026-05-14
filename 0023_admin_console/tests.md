---
iteration_id: 0023_admin_console
iteration_number: 0023
spec_source: 0023_admin_console.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — 0023 — Admin Console (Setnayan Operations Dashboard)

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0023_admin_console.md` (spec) · `0023_admin_console.html` (prototype) · `0023_admin_console.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] 1. The 7 admin surfaces
- [ ] 2. The data model · admin actions audit-logged everywhere
- [ ] 3. Per-surface mechanics
- [ ] 3.1 Home — queue overview
- [ ] 3.2 Verification Queues
- [ ] 3.3 Payments &amp; Activations
- [ ] 3.4 Users
- [ ] 3.5 Pricing &amp; Catalog
- [ ] 3.5b Internal accounts + Team Shared Pool (locked 2026-05-12)
- [ ] 3.5c Payment Methods (BDO + GCash receiving account upload)
- [ ] 3.6 Disputes &amp; Refunds
- [ ] 3.6b Force majeure escalation queue (locked 2026-05-12)
- [ ] 3.7 Settings
- [ ] 3.8 Funnel analytics (new 2026-05-12)
- [ ] 4. Two-admin approval pattern (locked scope per Vendor Agreement § 9.1)
- [ ] 4.1 Mechanics
- [ ] 4.2 Required for (the "major decisions" list)
- [ ] 4.3 Single-admin authority (the "lighter decisions" list — NO approval gate)
- [ ] 4.4 Why this scope is right for V1
- [ ] 4.5 Schema
- [ ] 5. Mobile vital-info rule (inherited)
- [ ] 6. Cross-iteration handoffs
- [ ] 7. Companions and next steps

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** The usersinternalxorteam CHECK constraint enforces the mutual exclusivity locked in § 10a + § 10b — owners can never accidentally be flagged as team-pool eligible (which would create double-comping ambiguity).
- [ ] **AC-02.** File upload dialog: PNG or JPG, ≤ 2 MB, must contain a scannable QR code (client-side QR-decode validation runs to confirm) 3.
- [ ] **AC-03.** Un-decided requests auto-expire and must be re-initiated.

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| Issue an `unlimited_use_grant` worth > ₱10,000 retail to an external customer | Material giveaway |
| Refund any single transaction > ₱25,000 | Financial control |
| Issue a comp gift worth ≤ ₱10,000 retail | Customer Accounts Handler · Vendor Accounts Handler |
| Process a refund ≤ ₱25,000 | Disputes Handler · Payments Handler |

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `admin_approval_requests`
- [ ] `funnel_events`
- [ ] `payment_receiving_accounts`
- [ ] `team_allowance_consumptions`
- [ ] `team_shared_monthly_allowance`
- [ ] `unlimited_use_grants`

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

