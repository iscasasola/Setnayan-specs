---
iteration_id: 0032_contract_intelligence
iteration_number: 0032
spec_source: 0032_contract_intelligence.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — Iteration 0032 — Contract Intelligence + Builder

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0032_contract_intelligence.md` (spec) · `0032_contract_intelligence.html` (prototype) · `0032_contract_intelligence.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] 1. Why this iteration exists
- [ ] 2. User flow (vendor side)
- [ ] 3. The 14 detected contract elements
- [ ] 4. AI analysis architecture
- [ ] 5. Setnayan template clause library
- [ ] 6. Compliance checklist — the bare-minimum gate
- [ ] 7. E-signature mechanics
- [ ] 8. Schema
- [ ] 9. UI surfaces
- [ ] 10. Pro Subscription positioning
- [ ] 11. Compliance + legal posture
- [ ] 12. Acceptance tests
- [ ] 13. Decision log
- [ ] 14. Companion docs

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** The vendor cannot proceed to Send while any red (hard requirement missing) item is unresolved.
- [ ] **AC-02.** Hard requirements (compliance gate red if missing — vendor cannot Send): 1.
- [ ] **AC-03.** Vendor must resolve before sending.
- [ ] **AC-04.** Contract is not sendable as-is again (vendor must duplicate to retry).
- [ ] **AC-05.** Decision log | Date | Decision | Why | |---|---|---| | 2026-05-12 | Pricing locked: ₱199 pay-as-you-go + free for Vendor Pro Weekly. SKU contractbuildersingle registered in servicecatalog at ₱199.
- [ ] **AC-06.** | | 2026-05-12 | 14-element detection schema locked. The list is exhaustive enough to cover PH wedding-vendor contracts (cross-checked against the seed template set the legal team will draft).
- [ ] **AC-07.** | | 2026-05-12 | Customer rejection requires a reason. Rejection enters status='rejected' + rejectionreason populated; vendor must duplicate to retry rather than re-editing the rejected one.

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| 2026-05-12 | **Pricing locked: ₱199 pay-as-you-go + free for Vendor Pro Weekly.** SKU `contract_builder_single` registered in `service_catalog` at ₱199. Vendor Pro Weekly subscription unlocks unlimited generation. | ₱199 is the same charm-priced tier as the Pro Widget (₱99) and Pro Bundle (₱199) — vendor-facing pricing already established at that level for individual feature unlocks. Pro inclusion converts the Pro Subscription pitch from "marketing perks" to "operational SaaS" — substantially stronger upgrade hook (Section 10 ROI math). |
| 2026-05-12 | **AI analysis via Claude Sonnet 4.6.** Same provider as AI Video Highlight + AI Edited Highlight; consolidated billing relationship. | No new vendor relationship. Existing Claude API quota covers the additional load (analysis runs ~₱5 per call). |
| 2026-05-12 | **External counsel review gate before V1 launch.** ~50 master clauses + the certificate-page boilerplate + the Terms of Service disclaimer reviewed by a PH contracts firm (Disini & Disini / ALA Law / Romulo Law). Estimated cost ₱30K–₱50K one-time + ₱15K–₱25K annual re-review. | Without external counsel review, "Setnayan template clauses" is marketing copy. With it, the templates have legal weight + Setnayan's liability disclaimer holds up. The cost is small relative to the SKU's revenue potential. |

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `contract_clause_library`
- [ ] `contract_drafts`
- [ ] `contract_purchases`
- [ ] `contract_signatures`
- [ ] `pdfplumber`
- [ ] `signer_user_id`

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

