---
iteration_id: 0002_qr_invitation_system
iteration_number: 0002
spec_source: 0002_qr_invitation_system.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — 0002 — Guest QR Code System & Personal Invitation Site

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0002_qr_invitation_system.md` (spec) · `0002_qr_invitation_system.html` (prototype) · `0002_qr_invitation_system.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] What to build
- [ ] Visual reference (canonical)
- [ ] Stack & conventions
- [ ] Token format and URI scheme
- [ ] Token
- [ ] URI scheme — unified across surfaces
- [ ] Browser fallback URL
- [ ] Encoding choice — why we don't use the `setnayan://` scheme directly in printed QRs
- [ ] Personal invitation site
- [ ] Route
- [ ] +1 onboarding flow (when name not yet captured)
- [ ] Page composition (desktop)
- [ ] Page composition (mobile)
- [ ] What the guest can do
- [ ] Limited +1 invitation site (locked variant)
- [ ] Couple's QR admin view
- [ ] Route
- [ ] Page composition (desktop)
- [ ] Mobile composition
- [ ] Print sheet format
- [ ] Database schema additions
- [ ] `scan_events` — every QR scan, regardless of surface
- [ ] Customer slug — real-time availability check (locked 2026-05-12)
- [ ] Monogram frame at QR center — simplified variant for scannability
- [ ] Monogram source (auto-generated vs uploaded by couple)

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** After confirmation, a limited +1 lands on the locked-down version of the personal invitation site (see "Limited +1 invitation site" below) instead of the full one.
- [ ] **AC-02.** Flipping unlocks the locked features on next page load — no token regeneration needed.
- [ ] **AC-03.** Going from 'full' → 'limited' is non-destructive: any RSVP and tagged photos persist; only the locked features hide.
- [ ] **AC-04.** The frame stroke inherits the wedding's accent color from the locked palette by default.
- [ ] **AC-05.** #### Locked structural rules (couples cannot change) | Spec | Locked value | Why | |---|---|---| | Error correction | Level H (~30% redundancy) | Tolerates center monogram clearance + print imperfections.
- [ ] **AC-06.** | #### Per-surface palette routing — locked 2026-05-08 The wedding has 9 palettes total (8 ceremony role palettes + 1 Reception palette per the Dress Code widget (defined downstream)).
- [ ] **AC-07.** The renderer reads the event's locked palette swatches.
- [ ] **AC-08.** Clearance must NOT overlap the three corner finder patterns or timing rows/columns.
- [ ] **AC-09.** Summary for the couple's mental model: The QR's math is locked because scanner-spec requirements aren't negotiable.
- [ ] **AC-10.** This is the same pattern Spotify codes, Apple Wallet passes, and branded marketing QRs at scale use: locked structure, customizable surface.
- [ ] **AC-11.** The Universal/App Link routing for native Setnayan skips auto-signin for limited +1s — the app, on detecting a limited-+1 token, opens to the same locked invitation view rather than the full registered guest experience.
- [ ] **AC-12.** The block uses dashed borders and 55% opacity on its disabled fields to communicate the locked state without hiding the structure.

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `flower_girl`
- [ ] `guest_rsvp_extras`
- [ ] `qr_token`
- [ ] `ring_bearer`
- [ ] `scan_events`
- [ ] `slug_change_log`

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

