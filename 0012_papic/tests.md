---
iteration_id: 0012_papic
iteration_number: 0012
spec_source: 0012_papic.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — Iteration 0012 — Papic

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0012_papic.md` (spec) · `0012_papic.html` (prototype) · `0012_papic.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] What this iteration ships
- [ ] Pricing alignment
- [ ] Capture UI — V1 spec
- [ ] Screen layout (top to bottom)
- [ ] Gesture shutter — the four capture modes
- [ ] Storage and album behavior
- [ ] Battery handoff (V1 — single threshold)
- [ ] Pro Camera Bridge — DSLR pairing
- [ ] What it is
- [ ] Why phone-as-bridge (and not DSLR-direct-to-cloud)
- [ ] Vendor SDK matrix
- [ ] Pairing flow
- [ ] Capture flow when paired
- [ ] Live View overlay
- [ ] Fallback to phone-internal on disconnect
- [ ] What the bridge unlock gives the couple
- [ ] What it does NOT do in V1
- [ ] Face detection — layered enrollment + auto-tag
- [ ] Three enrollment paths, one face vector store
- [ ] On-device inference
- [ ] Confidence thresholds
- [ ] Privacy
- [ ] Data model additions
- [ ] Face enrollment UX — three paths in detail
- [ ] Shared building blocks

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** Photos must be face-forward, well-lit, neutral expression.
- [ ] **AC-02.** New behaviors: - Persistent across all suspend states. App backgrounded, phone locked, app force-quit, phone rebooted, battery handed off — the queue persists.
- [ ] **AC-03.** NSFW filter is on by default and cannot be disabled (master spec Part 5.3).

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| 3 Papic | `paparazzi_3_seats` | **₱1,499** | 3 app seats per event |
| 5 Papic | `paparazzi_5_seats` | **₱2,499** | 5 app seats per event |
| Per Template (premade) | `template_unlock` | **₱49** | multi-purchase |
| **Pro Camera Bridge (per DSLR seat, multi-purchase, shared with 0011)** | `pro_camera_bridge_seat` | **₱1,499** | per DSLR seat |
| Custom Monogram Pack (registered in 0011, consumed here) | `custom_monogram_pack` | **₱1,999** | event-wide, removes Setnayan watermark |

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `GPSLongitude`
- [ ] `Model`
- [ ] `face_enrollments`
- [ ] `service_catalog`

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

