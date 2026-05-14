---
iteration_id: 0026_bir_tax_compliance
iteration_number: 0026
spec_source: 0026_bir_tax_compliance.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — Iteration 0026 — BIR / Tax Compliance

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0026_bir_tax_compliance.md` (spec) · `0026_bir_tax_compliance.html` (prototype) · `0026_bir_tax_compliance.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

- Customer: `setnayan.com/dashboard/customer/settings/tax-documents` - Vendor: `setnayan.com/dashboard/vendor/settings/tax-documents` - Admin: `setnayan.com/admin/finance/tax-reports`

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] Why this iteration exists
- [ ] 1. Setnayan business registration (operational prerequisites — non-engineering)
- [ ] 1.1 Required registrations
- [ ] 1.2 BIR-stamped OR books vs Computerized Accounting System (CAS)
- [ ] 1.3 Quarterly compliance check-ins
- [ ] 2. Tax-relevant concepts cheat sheet
- [ ] 3. VAT vs Percentage Tax decision matrix
- [ ] 3.1 The two options
- [ ] 3.2 V1 recommendation (subject to confirmation)
- [ ] 3.3 Effect on the 3% convenience fee
- [ ] 4. Customer-facing Official Receipt generation
- [ ] 4.1 Schema
- [ ] 4.2 OR sequence assignment — gap-free guarantee
- [ ] 4.3 OR generation flow
- [ ] 4.4 Setnayan tax configuration table
- [ ] 4.5 OR PDF template
- [ ] 4.6 Voiding an OR
- [ ] 4.7 Refunds
- [ ] 5. Vendor payout withholding + Form 2307
- [ ] 5.1 Applicable rates (subject to confirmation with accountant)
- [ ] 5.2 Schema
- [ ] 5.3 Payout flow (V1 — manual bank transfer / GCash)
- [ ] 5.4 Form 2307 quarterly generation
- [ ] 5.5 EWT remittance to BIR (Form 1601-EQ)
- [ ] 6. eFPS reporting outputs

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** Phase: V1 launch-blocking. Setnayan legally cannot accept payment from a Philippine customer without issuing a BIR-compliant Official Receipt.
- [ ] **AC-02.** This iteration must ship before the first paid order — even a single ₱49 Save-the-Date charge requires an OR.
- [ ] **AC-03.** The platform must issue a BIR-registered Official Receipt (OR) for each one.
- [ ] **AC-04.** Setnayan business registration (operational prerequisites — non-engineering) This section documents the legal-operational steps Setnayan must complete before any of the engineering in this iteration becomes meaningful.
- [ ] **AC-05.** The CAS application typically takes 4–6 weeks to be approved, subject to confirmation with the assigned RDO — Setnayan must start this in parallel with engineering build of the OR pipeline so they land at roughly the same time.
- [ ] **AC-06.** Per BIR CAS guidelines, the template must include every field in the template below; deviations require RDO re-approval.
- [ ] **AC-07.** The specific items that must be reviewed with Setnayan's tax accountant before launch: 1.
- [ ] **AC-08.** The 3% Percentage Tax rate (§ 2, § 3) — historically temporarily reduced to 1% under CREATE Law transitional provisions; current rate must be confirmed.
- [ ] **AC-09.** The ₱720K individual-EWT-rate threshold (§ 5.1) — RR 11-2018 has been amended multiple times; the threshold and the 5% vs 10% boundaries must be confirmed.
- [ ] **AC-10.** The exact BIR-published Form 2307 template (§ 5.4) — refresh annually; engineering's PDF render must match the current BIR layout.
- [ ] **AC-11.** Build order Phase A — Legal / operational (Setnayan founders + tax accountant, no engineering). Run in parallel with Phase B; both must complete before Phase E goes live.

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| **VAT** | Value Added Tax — 12% on most goods and services in the Philippines. Applies if a taxpayer's annual gross receipts exceed ₱3 million, or if the taxpayer voluntarily elects VAT registration. | NIRC § 105–115, as amended by TRAIN Law |
| Trigger | Annual gross receipts ≤ ₱3,000,000 | Annual gross receipts > ₱3,000,000 **OR** voluntary election |
| Individual (sole prop / freelancer / professional) — gross income ≤ ₱720K | **5%** | RR 11-2018, § 2.57.2(I) — best estimate; subject to confirmation |
| Individual — gross income > ₱720K | **10%** | RR 11-2018, § 2.57.2(I) — best estimate; subject to confirmation |

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `form_2307_issuances`
- [ ] `official_receipts`
- [ ] `or_replacements`
- [ ] `or_sequence_state`
- [ ] `setnayan_tax_config`
- [ ] `vendor_payouts`

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

