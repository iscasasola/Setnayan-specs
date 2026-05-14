---
iteration_id: 0025_profile_settings
iteration_number: 0025
spec_source: 0025_profile_settings.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — Iteration 0025 — Profile Settings & Privacy Controls

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0025_profile_settings.md` (spec) · `0025_profile_settings.html` (prototype) · `0025_profile_settings.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

- Customer: `setnayan.com/dashboard/[event-id]/settings/` - Vendor: `setnayan.com/dashboard/vendor/settings/` - Admin: `setnayan.com/admin/settings/profile`

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] 1. Why this iteration exists
- [ ] 2. Surface architecture
- [ ] 2.1 Shared shell, role-driven sections
- [ ] 2.2 Mobile considerations
- [ ] 3. The six tabs
- [ ] 3.1 Tab 1 — Profile
- [ ] 3.2 Tab 2 — Appearance
- [ ] 3.3 Tab 3 — Notifications
- [ ] 3.4 Tab 4 — URL & Slug
- [ ] 3.5 Tab 5 — Payment Methods
- [ ] 3.6 Tab 6 — Privacy & Data (the RA 10173 surface)
- [ ] 4. Data model
- [ ] 4.1 New tables
- [ ] 4.2 Columns added to `users`
- [ ] 4.3 RLS posture
- [ ] 5. Background jobs
- [ ] 6. Privacy posture summary
- [ ] 7. Build order
- [ ] 8. Companions and next steps

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** Phase: V1 launch-blocking — RA 10173 compliance is non-negotiable for any PH consumer platform per the locked Privacy & Security Policy.
- [ ] **AC-02.** Privacy & Data | full | full | partial (cannot self-delete · § 6.2 exception) | A user with multiple roles (eventmembers.membertype spans couple + guest, or a customer who later becomes a vendor) sees the Settings cog jump them to the role-appropriate Settings page.
- [ ] **AC-03.** Theme applies to every surface the user owns; vendors who want vendor-side public theming must hold a Vendor Pro Weekly subscription (forward-referenced in 0022 § 7) — without it, the customer-side marketplace listing always renders in Setnayan Default.
- [ ] **AC-04.** SLA: the job must complete within 7 days.
- [ ] **AC-05.** User must type their email address into a confirmation field to enable the "Confirm deletion" button.
- [ ] **AC-06.** Resolve unpaid orders before deleting your account." - Admin role. Admins cannot self-delete.
- [ ] **AC-07.** Show: "Admin accounts must be deleted by another admin.
- [ ] **AC-08.** - Sole isinternal=TRUE owner. If only one of the two § 10a internal accounts remains, that account cannot self-delete until a second internal account is added — protects the dogfooding invariant.

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `customer_payment_methods`
- [ ] `data_export_requests`
- [ ] `notification_preferences`
- [ ] `users`

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

