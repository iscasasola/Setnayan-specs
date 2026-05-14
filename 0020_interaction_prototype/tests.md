---
iteration_id: 0020_interaction_prototype
iteration_number: 0020
spec_source: 0020_interaction_prototype.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — 0020 — Setnayan Cross-Iteration Interaction Prototype

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0020_interaction_prototype.md` (spec) · `0020_interaction_prototype.html` (prototype) · `0020_interaction_prototype.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] 1. Actors in scope
- [ ] 2. The 8 phases at a glance
- [ ] 3. Cross-iteration data handoffs (the wiring map)
- [ ] 4. Apply-then-pay (locked 2026-05-11) — how the prototype models it
- [ ] 5. Misconnection log
- [ ] 6. What the HTML actually shows
- [ ] 7. How to use this for the wiring check
- [ ] 8. What this prototype intentionally does NOT show
- [ ] 9. The wiring architecture — how to connect everything properly
- [ ] 9.1 The 10 wiring principles
- [ ] 9.2 Correlation-ID traceability example
- [ ] 9.3 Feature accessibility matrix
- [ ] 9.4 What this gives you operationally
- [ ] 9.5 How to use this when starting a new iteration
- [ ] 10. Companions and next steps

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** | 3-business-day verification SLA must page Setnayan Team.
- [ ] **AC-02.** New customers must land on event-create wizard, NOT picker.
- [ ] **AC-03.** | | MC-07 | Phase 5, all activation scenes | The activation hook fan-out (Papic seats / Live Stream slots / Monogram flag / etc.) must be idempotent — Admin double-clicking "Confirm payment" must not insert 10 paparazzi seats instead of 5.
- [ ] **AC-04.** Render-time validator must reject the hidden photo.
- [ ] **AC-05.** If the couple hid photos in review, the AI render must respect that.
- [ ] **AC-06.** P10 — Every home surface lists every feature. Customer's home lists every customer feature with its status (active / pending / locked / not purchased).
- [ ] **AC-07.** - Every cell labeled "owner" or "read" carries a real URL path that must exist in code.
- [ ] **AC-08.** If a new iteration needs to break one, the breakage must surface here AND in CLAUDE.md's decision log before code begins.
- [ ] **AC-09.** The HTML is the contract this prototype is checking against — any structural change in 0013 that contradicts a scene here must update both the iteration spec AND this document in the same PR.

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| **MC-17** | Phase 8, scene 8g | AI Edited Highlight (₱5,000, 3-min) — pulls from broadcast clips + Papic photos. If the couple hid photos in review, the AI render must respect that. Same rule as MC-15 but at the AI-input layer. | The render pipeline reuses the same `couple_review_state` filter. One source of truth. |

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

