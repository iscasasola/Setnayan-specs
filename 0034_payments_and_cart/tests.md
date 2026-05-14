---
iteration_id: 0034_payments_and_cart
iteration_number: 0034
spec_source: 0034_payments_and_cart.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — Iteration 0034 — Payments & Cart Flow

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0034_payments_and_cart.md` (spec) · `0034_payments_and_cart.html` (prototype) · `0034_payments_and_cart.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

- **Surface:** Customer cart (lives inside 0021 services launcher) + Admin reconciliation (lives inside 0023 § 3.3 Payments & Activations) - **Status:** drafted 2026-05-12 - **Builds on:** 0000 (users + auth) · 0006 (vendor records via `event_vendor_relationships`) · 0013 (platform stack — Supabase + R2)

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] 1. Why this iteration exists
- [ ] 2. The 8-table canonical schema
- [ ] 3. The customer flow (lives in 0021 services launcher + 0022 vendor dashboard)
- [ ] 3.1 Add to cart
- [ ] 3.2 Cart drawer
- [ ] 3.3 Checkout
- [ ] 3.4 Payment screen
- [ ] 3.5 Screenshot upload
- [ ] 3.6 Confirmation screen
- [ ] 3.7 Order status page
- [ ] 4. The admin flow (lives in 0023 § 3.3 Payments & Activations)
- [ ] 4.1 Queue view
- [ ] 4.2 Detail view
- [ ] 4.3 Three decision buttons
- [ ] 4.4 Service-activation hooks per SKU
- [ ] 5. Internal accounts + team pool integration
- [ ] 5.1 Owner Internal Accounts (§ 10a)
- [ ] 5.2 Setnayan Team Shared Monthly Pool (§ 10b)
- [ ] 5.3 Pool reset on month boundary
- [ ] 6. Setnayan Pay convenience fee (3%)
- [ ] 7. Receipts (per 0026)
- [ ] 8. Refunds
- [ ] 9. Reference code uniqueness + retry
- [ ] 10. Acceptance criteria
- [ ] 11. Payment reconciliation module (the cron that helps admin verify payments)

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** -- This table is the audit record for those changes, plus it backs Official Receipt -- voiding/replacement per 0026 (an OR generated when the SKU was ₱4,900 must be -- voided + reissued if the price changes before the customer pays).
- [ ] **AC-02.** | | 17 | Orders in pendingpayment for > 7 days transition to expired via scheduled job; expired orders cannot be paid (customer must re-checkout).
- [ ] **AC-03.** | | 2 | Amount + sender fuzzy match (Tier 2) populates with matchconfidence = 'high'; admin must still click Approve — never auto-approved.
- [ ] **AC-04.** Decision log (iteration-local) | Date | Decision | Why | |------|----------|-----| | 2026-05-12 | Cart is required pre-checkout state (not optional).
- [ ] **AC-05.** After expiry, the customer must re-checkout (which generates a fresh reference code, useful because the prior code may now be polluted with confused customer transfers).
- [ ] **AC-06.** | | 2026-05-12 | Reconciliation matcher proposes; admin disposes. | The matcher never auto-approves a payment — even at Tier 1 exact-match, admin must click Approve.

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| 15 | Refund (≤ ₱25K, single admin) transitions order to `refunded`, voids the OR per 0026, fires deactivation hooks, sends `refund_processed` email per 0028. |
| **BDO Business Banking SMS** | Forward SMS to a dedicated inbox parser email address (e.g., `bdo-inbox@setnayan.com`) via a phone-based SMS-to-email gateway (Twilio · Globe Labs) **OR** subscribe to BDO's email-notification feature (BDO-Mail) that sends one email per credit transaction | Real-time (push) | ~₱500/month for SMS gateway capacity at V1 volume |
| `exact` | green check | "Exact reference-code match — JUAN DELA CRUZ paid ₱2,499 at 14:32 via BDO" |
| Edge Function execution | ~₱0 | Supabase free tier covers 500K invocations/month. Cron runs ~12×/hour × 24 × 30 = ~9,000/month. |
| SMS-to-email gateway (Twilio or Globe Labs) | ~₱500/month at V1 volume | One-way SMS forwarding from a dedicated SIM. Twilio inbound SMS in PH is ~₱0.50/msg; 1,000 BDO alerts/month = ₱500. |
| pg_trgm extension | ₱0 | Comes free with Supabase Postgres. |
| **Total marginal cost** | **~₱500/month for V1** | Scales to ~₱2K/month at 10× volume before the Edge Function tier matters. |
| 2026-05-12 | **Price snapshot at add-to-cart time, not checkout.** | Customer adds item at ₱4,999. Admin changes price mid-shopping to ₱5,499 (two-admin approved per § 9.1). Customer pays the snapshotted ₱4,999 because that's what their cart showed. Prevents "bait and switch" customer experience. Trade-off: prices can be stale for hours. Acceptable because cart abandonment timeout is 30 days for active carts; mid-quarter price changes are rare events anyway. |

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `cart_items`
- [ ] `carts`
- [ ] `comp_grants`
- [ ] `none`
- [ ] `payment_confirmed`
- [ ] `payment_inbox_messages`
- [ ] `payment_proof_rejected`
- [ ] `pending_payment`
- [ ] `reason`
- [ ] `refund_payout_reference`

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

