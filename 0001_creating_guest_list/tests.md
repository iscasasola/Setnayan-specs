---
iteration_id: 0001_creating_guest_list
iteration_number: 0001
spec_source: 0001_creating_guest_list.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — 0001 — Create Guest List Management

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0001_creating_guest_list.md` (spec) · `0001_creating_guest_list.html` (prototype) · `0001_creating_guest_list.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] What to build
- [ ] Visual reference (canonical)
- [ ] Stack & conventions
- [ ] Route
- [ ] Data model
- [ ] `guests` table
- [ ] `households` table
- [ ] Role taxonomy (enum values)
- [ ] Page composition (desktop)
- [ ] Page composition (mobile)
- [ ] Functional scope
- [ ] Must work end-to-end
- [ ] Out of scope for this ticket (deferred to future work orders)
- [ ] Acceptance criteria
- [ ] Privacy & compliance
- [ ] Companion files to read before starting
- [ ] Notes for Claude Code

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** This is the first concrete feature being built for Setnayan, and it's gated by being on web (per the locked Phase 1 sequence).
- [ ] **AC-02.** The implementation must visually match the mockup at desktop and mobile widths.
- [ ] **AC-03.** Pixel-perfect parity isn't required, but the layout, hierarchy, color coding (bride/groom/both, RSVP states, role chips), and component primitives (rsvp-pill, tag, filter-chip) must all be there.
- [ ] **AC-04.** - Auth: the couple must be logged in via the existing Setnayan couple-auth flow before they can access the dashboard.
- [ ] **AC-05.** Couples must explicitly grant +1 privilege per guest.
- [ ] **AC-06.** -- 'limited' — +1 can be tagged in photos and submit RSVP, and their QR works for -- paparazzi tagging, but they CANNOT use the in-app features (Shutter, -- Selfie Camera, Challenges, reel builder).
- [ ] **AC-07.** Selects with long option text (Role in wedding has 18 values) must NOT expand the field — keep the field half-width and let the dropdown menu render at full text width when opened.
- [ ] **AC-08.** --- ## Privacy & compliance - Guest data (especially email, mobile, address) must respect PH Data Privacy Act (RA 10173).
- [ ] **AC-09.** CLAUDE.md — project context, locked SKUs, locked architecture, decision log.

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `Full`
- [ ] `guests`
- [ ] `households`
- [ ] `qr_token`

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

