---
iteration_id: 0017_patiktok
iteration_number: 0017
spec_source: 0017_patiktok.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — 0017 — Patiktok

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0017_patiktok.md` (spec) · `0017_patiktok.html` (prototype) · `0017_patiktok.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] What Patiktok is
- [ ] What's included in the Patiktok Station Pack
- [ ] TikTok integration — viral loop posting via @SetnayanWeddings
- [ ] Sound selection — couple curates 2 templates, hands off via printable QR
- [ ] Guest TikTok handle capture — via Setnayan Guest Profile
- [ ] External display + dual-view mimic UX
- [ ] Multi-performer handling (2+ people on the X mark)
- [ ] Posting flow (post-event)
- [ ] Downloadable backup copy
- [ ] Pricing
- [ ] Coordinator workflow
- [ ] Setnayan cost basis (per Station Pack)
- [ ] User flows
- [ ] Couple flow
- [ ] Guest flow
- [ ] Technical requirements
- [ ] Storage
- [ ] Compilation render
- [ ] Music selection
- [ ] Hardware at venue
- [ ] Anti-abuse rules
- [ ] Integrations across iterations
- [ ] Future considerations (V2+)
- [ ] Open questions for sign-off
- [ ] Companion docs

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** The masked transition (dissolve, swipe, morph) reads as one continuous performance because the viewer's eyes stay locked on the same on-screen spot — only the body underneath swaps.

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| **Patiktok** | **₱2,499** | per event | Single tier. App-only. Includes X-mark decal + app station + TikTok integration + auto-post + guest tagging + multi-performer + compilation + **standard background soft copy**. |
| **Patiktok additional station** | **₱999** | per extra station | Multi-purchase. Each station gets own X-mark + compilation. |
| **Patiktok custom background design** | **₱1,499** | per event | Optional upgrade. Setnayan designs a fully-custom Patiktok backdrop digital file based on couple's request — custom artwork, multiple revisions, full art direction. Soft-copy delivered; couple uses marketplace (future 0018) to source printing. |
| X-mark vinyl decal (print + materials) | ₱50 |
| Shipping (PH Lalamove / standard) | ₱50 |
| Compilation FFmpeg render (~5-minute output) | ₱50 |
| Music: owned AI catalogue | ₱0 |
| App infrastructure | ₱0 |

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

