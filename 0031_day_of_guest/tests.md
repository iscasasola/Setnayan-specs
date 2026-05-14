---
iteration_id: 0031_day_of_guest
iteration_number: 0031
spec_source: 0031_day_of_guest.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — Iteration 0031 — Day-of Guest Experience (Live Mode)

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0031_day_of_guest.md` (spec) · `0031_day_of_guest.html` (prototype) · `0031_day_of_guest.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] 1. Why this iteration exists
- [ ] 2. Auto-activation logic (five lifecycle modes)
- [ ] 3. LIVE mode surfaces (six cards)
- [ ] 3.1 "What's happening now" card (top, hero)
- [ ] 3.2 "Your table" card
- [ ] 3.3 "Live photo wall" card
- [ ] 3.4 "Video guestbook" card
- [ ] 3.5 "Live schedule" card
- [ ] 3.6 "Coordinator broadcast" card (conditional)
- [ ] 4. Offline-first PWA shell
- [ ] 4.1 Service worker caching strategy
- [ ] 4.2 Offline degradation behavior
- [ ] 4.3 PWA install affordance
- [ ] 4.4 Background sync
- [ ] 4.5 Failure surfaces (the page must never look broken)
- [ ] 5. Privacy and consent
- [ ] 5.1 Tag-consent handshake
- [ ] 5.2 Photo wall opt-out
- [ ] 5.3 Video guestbook consent + withdrawal
- [ ] 5.4 Couple live-location sharing
- [ ] 5.5 Broadcast targeting + privacy
- [ ] 5.6 RA 10173 surfaces inherited from 0025
- [ ] 6. Schema
- [ ] 7. UI surfaces (guest + couple + coordinator views)
- [ ] 7.1 Guest live page

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** The day-of surface must boot, render, and answer the guest's three core questions even when the network is dead.
- [ ] **AC-02.** ### 4.5 Failure surfaces (the page must never look broken) - If the service worker fails to install (Safari quirk, storage quota exceeded), the page degrades to normal-online behavior — no functionality lost, just no offline guarantee.
- [ ] **AC-03.** | | First Input Delay (FID) | < 100ms | Tapping any card must respond immediately.
- [ ] **AC-04.** | | Cumulative Layout Shift (CLS) | < 0.05 | Photo wall lazy-load must not push the hero card off-screen.
- [ ] **AC-05.** Segment-write authority off by default for coordinators. Without explicit toggle in 0021, the coordinator cannot mark a segment active/completed.
- [ ] **AC-06.** | A scroll on the wedding day must be a thumbs-and-eyes-only experience.

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `broadcast_acknowledgments`
- [ ] `event_broadcasts`
- [ ] `event_guestbook_prompts`
- [ ] `guest_photo_hides`
- [ ] `video_guestbook_entries`

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

