---
iteration_id: 0019_communications
iteration_number: 0019
spec_source: 0019_communications.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — Iteration 0019 — Communications (Chat + Video Meetings + Coordinator Join)

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0019_communications.md` (spec) · `0019_communications.html` (prototype) · `0019_communications.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] Why this iteration exists
- [ ] Reference designs
- [ ] Scope (V1 — launch-blocking for 0015 vendor promises)
- [ ] Pricing — free use (locked 2026-05-11)
- [ ] Architecture
- [ ] Data model
- [ ] Dedicated file storage + in-app readers
- [ ] UI surfaces (Messenger-class chat)
- [ ] Inbox view
- [ ] Active thread view
- [ ] Coordinator-join flow
- [ ] Vendor identity in chat — logo always, never personal photo (locked 2026-05-12)
- [ ] Force majeure flag flow (locked 2026-05-12)
- [ ] UI surfaces (Zoom-class video meetings)
- [ ] Schedule a meeting
- [ ] In-meeting view
- [ ] Post-meeting
- [ ] Performance targets — Messenger-class chat, Zoom-class video
- [ ] Notifications
- [ ] Acceptance criteria
- [ ] Build order
- [ ] Open questions
- [ ] Companion specs and cross-references

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** Marketing copy must be revised in lockstep if 0019 scope changes materially.

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `chat_attachments`
- [ ] `chat_messages`
- [ ] `chat_reactions`
- [ ] `chat_thread_participants`
- [ ] `chat_threads`
- [ ] `force_majeure_flags`
- [ ] `thread_join_authorizations`
- [ ] `video_meeting_participants`
- [ ] `video_meetings`

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

