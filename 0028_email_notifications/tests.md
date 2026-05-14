---
iteration_id: 0028_email_notifications
iteration_number: 0028
spec_source: 0028_email_notifications.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — Iteration 0028 — Email Notification Fallback

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0028_email_notifications.md` (spec) · `0028_email_notifications.html` (prototype) · `0028_email_notifications.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] 1. Why this iteration exists
- [ ] 2. Reference designs
- [ ] 3. Scope (V1)
- [ ] 4. Architecture
- [ ] 5. Notification categories (5) + V1 templates (10)
- [ ] Quick reference
- [ ] 6. Per-template specifications
- [ ] 6.1 `payment_instructions`
- [ ] 6.2 `payment_confirmed`
- [ ] 6.3 `refund_processed`
- [ ] 6.4 `new_vendor_message`
- [ ] 6.5 `vendor_status_change`
- [ ] 6.6 `vendor_unresponsive_48h`
- [ ] 6.7 `rsvp_received`
- [ ] 6.8 `wedding_day_reminder`
- [ ] 6.9 `save_the_date_sent`
- [ ] 6.10 `security_alert`
- [ ] 7. Schema
- [ ] 8. Per-user preference resolution
- [ ] 9. Delivery + reliability
- [ ] 10. Branding
- [ ] 11. Compliance
- [ ] 12. Admin observability (in 0023)
- [ ] 13. Cost projection
- [ ] 14. Forward-compatibility hooks

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** Phase: V1 launch-blocking for payments (customers must receive payment instructions + confirmations) and for wedding-day reliability (T-1d / T-1h reminders).
- [ ] **AC-02.** - Variables — keys the templatedata JSON must contain.
- [ ] **AC-03.** | | Plaintext alternative is mandatory, never optional | Gmail's reputation algorithm penalizes HTML-only email; we lose nothing by always shipping both.

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| Provider primary | **Resend** | Same team as Vercel; React Email native; ₱0.0006/email at PH conversion; modern webhook + suppression API. |
| 3 | `refund_processed` | payments | Refund processed — ₱[amount] is on its way back |

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `category`
- [ ] `email_dispatches`
- [ ] `email_suppressions`
- [ ] `email_unsubscribe_tokens`
- [ ] `notification_preferences`

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

