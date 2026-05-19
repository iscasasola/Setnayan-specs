---
iteration_id: 0021_couple_dashboard_fully_purchased
iteration_number: 0021
spec_source: 0021_couple_dashboard_fully_purchased.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — 0021 — Couple Dashboard, Fully-Purchased State

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0021_couple_dashboard_fully_purchased.md` (spec) · `0021_couple_dashboard_fully_purchased.html` (prototype) · `0021_couple_dashboard_fully_purchased.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] 1. The scenario
- [ ] Active Setnayan apparatus
- [ ] State around the wedding
- [ ] 2. The 8 surfaces
- [ ] 2.0a Home layout · Concierge mode default · DIY toggle
- [ ] 2.0b Setnayan Concierge · the 9-step journey
- [ ] 2.0c Profile avatar = dashboard home shortcut
- [ ] 2.1 QR token rules — per QR type (locked)
- [ ] 2.2 Naming — Papic · Patiktok · Panood (the media trio)
- [ ] 2.2a Guest List · spreadsheet bulk-edit mode (locked)
- [ ] 2.3a Per-vendor 6-stage readiness tracker (locked)
- [ ] 2.3b Mobile vital-info rule (locked)
- [ ] 2.3c Vendor ingress / egress (locked)
- [ ] 2.3d Extend-hours / extend-units for time-locked services (locked)
- [ ] 2.3e "Upgrade to ___" prompts (locked)
- [ ] 2.4 Deferred — built into the Vendor iteration (0022)
- [ ] 2.4a Vendor Pro · weekly subscription (not per-event)
- [ ] 2.4b One calendar per service for multi-service vendors
- [ ] 2.4c In-app crew & teams — fixed rates with deductions
- [ ] 2.4d QR-as-a-service for vendor types beyond V1
- [ ] 2.2b Mobile Vendor Card pattern (locked)
- [ ] 2.2c Vendor Profile screen (opened by tap VIEW)
- [ ] Refund / dispute menu on the vendor detail view (locked 2026-05-12)
- [ ] Exclusive offer row on customer's vendor detail (locked 2026-05-12)
- [ ] 2.2d Review-visibility rule (locked)

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** They land in iteration 0022 (the vendor dashboard prototype): ### 2.4a Vendor Pro · weekly subscription (not per-event) Vendor accounts are free during launch (per the locked 0015 memory).
- [ ] **AC-02.** - Not a proposal for new SKUs — uses only the locked V1 SKU list.

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| Papic · 5 seats | 1 | ₱2,500 | Active — 5 of 5 claimed |
| Pro Camera Bridge | 2 grants | ₱3,000 | Active — 2 of 2 bound (Papic Seat #2 · Live Stream Cam #2) |
| Live Stream · Base | 1 | ₱2,500 | Active — broadcaster set |
| Live Stream · +1 Camera add-on | 2 | ₱2,000 | 5 camera slots total |
| Live Stream · +1 Hour add-on | 3 | ₱3,000 | 6 hours of stream capacity |
| Custom Monogram Pack | 1 | ₱2,000 | Active — event-wide flag ON |
| Broadcast Style Pack | 1 | ₱3,000 | Active — 4 modes available |
| LED Background | 1 | ₱599 | Rendering — USB ships T-7 |

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `dispute_resolutions`

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

