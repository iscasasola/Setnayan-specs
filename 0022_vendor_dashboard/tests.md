---
iteration_id: 0022_vendor_dashboard
iteration_number: 0022
spec_source: 0022_vendor_dashboard.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — 0022 — Vendor Dashboard, Comprehensive Interactive Prototype

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0022_vendor_dashboard.md` (spec) · `0022_vendor_dashboard.html` (prototype) · `0022_vendor_dashboard.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] 1. The 6 vendor surfaces
- [ ] 2. Vendor data model (V1)
- [ ] 2.1 The Vendor record
- [ ] 2.1b Mandatory vendor logo (locked 2026-05-12)
- [ ] 2.1a Vendor-proposed custom categories
- [ ] 2.2 The Service object (the spec-expanded shape from 2.4d earlier)
- [ ] 2.2a Crew size on service definition (locked 2026-05-12)
- [ ] 2.3 Calendar mechanism
- [ ] 2.4 Client pipeline
- [ ] 2.5 Plan & proposal builder
- [ ] 2.6 Team / agents
- [ ] 2.6a Team member role assignment (locked 2026-05-12)
- [ ] 3. Pro subscription (locked weekly model)
- [ ] 4. In-app crew rates (V1.5 scope; documented for forward-compat)
- [ ] 5. QR-as-a-service for vendor types beyond V1
- [ ] 4a. Calendar — privacy + collision-tolerance for agents
- [ ] 4b. Calendar mobile view rules
- [ ] 4c. Agent attribution on every booking
- [ ] 5a. Headquarters Pin + Extended Pins · with 5km service commitment
- [ ] 5b. Sponsored Boost · ₱1,499/week · extends visibility from 10km to 30km
- [ ] 5c. Vendor-controlled final price + payment routing
- [ ] Rule 1 — Vendor controls the final agreed price
- [ ] Rule 2 — Payments outside the app by default · Setnayan Pay as the V1 opt-in (3%)
- [ ] Rule 3 — Tax treatment when Setnayan receives payments
- [ ] Rule 4 — Setnayan Pay convenience fee (locked 2026-05-12 per task #37 pivot — supersedes earlier 5% Guarantee model)

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** Aligns with the locked decisions on apply-then-pay, Pro weekly subscription, multi-service calendars, and in-app crew rates.
- [ ] **AC-02.** The logo is a hard-blocking requirement at the verification stage — vendors cannot submit their registration application without one, and Setnayan Team verification cannot approve a vendor whose logor2key is missing.
- [ ] **AC-03.** Submitting without one returns a form error: "Company logo is required.
- [ ] **AC-04.** ### 2.1a Vendor-proposed custom categories Vendors aren't locked into the 28 canonical wedding service categories.
- [ ] **AC-05.** Free vendors with pending verification cannot boost.
- [ ] **AC-06.** If Mariposa has 3 pins (Tagaytay, Manila, Cebu) and 12 / 32 / 28 photography vendors in each 20km respectively, boost is locked in Tagaytay but available in Manila and Cebu independently.
- [ ] **AC-07.** This is the V1 default and matches the existing locked decision from 0006/0007 ("vendor money leaves Setnayan · direct to vendor").

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| Direct (default) | ₱85,000 to vendor | ₱85,000 | ₱0 |
| Setnayan Pay | ₱87,550 to Setnayan | ₱85,000 (full) | ₱2,550 (3%) |
| Volume | 4% | Packages &gt; ₱150K · volume discount on big contracts |
| Tiny floor | min ₱500 | Contracts &lt; ₱10K · keeps small-policy economics sane |
| B · Specialized tool integrations | ₱99/week each | 100% (license fee) | Yes — billed weekly with Pro |
| C · Pro-included benefits | Bundled in ₱500 Pro Weekly | 100% (subscription) | Yes |

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `cancelled`
- [ ] `crew_meal_required`
- [ ] `crew_size`
- [ ] `paused`
- [ ] `vendor_services`

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

