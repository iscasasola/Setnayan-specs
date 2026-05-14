---
iteration_id: 0029_help_center
iteration_number: 0029
spec_source: 0029_help_center.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — Iteration 0029 — Help Center / FAQ

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0029_help_center.md` (spec) · `0029_help_center.html` (prototype) · `0029_help_center.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] 1. Why this iteration exists
- [ ] 2. Surface architecture
- [ ] 2.1 Public help landing — `setnayan.com/help`
- [ ] 2.2 Per-role help home — `setnayan.com/help/[role]`
- [ ] 2.3 Article page — `setnayan.com/help/[role]/[section]/[slug]`
- [ ] 2.4 Contact form — `setnayan.com/help/contact`
- [ ] 2.5 Authenticated deep-links — `setnayan.com/dashboard/[role]/help`
- [ ] 2.6 Admin ticket queue — `setnayan.com/dashboard/admin/support`
- [ ] 3. Per-role section structure
- [ ] 3.1 Customer (couple) — 6 sections, ~30 articles V1
- [ ] 3.2 Vendor — 6 sections, ~25 articles V1
- [ ] 3.3 Guest — 4 sections, ~15 articles V1
- [ ] 3.4 Admin (internal) — 4 sections, ~20 articles V1
- [ ] 4. Article structure spec
- [ ] 5. Search architecture
- [ ] 5.1 Full-text index
- [ ] 5.2 Role-scoped search
- [ ] 5.3 Search-as-you-type
- [ ] 5.4 Ranking
- [ ] 5.5 Synonyms
- [ ] 6. Contact form and support tickets
- [ ] 6.1 Contact form flow
- [ ] 6.2 Routing matrix
- [ ] 6.3 SLA + auto-response
- [ ] 6.4 User-facing ticket tracking

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** Setnayan cannot launch with "email Setnayan" as the only support channel — a multi-thousand-event marketplace generates support load that has to be tiered, searchable, and routed before it hits a human.
- [ ] **AC-02.** If a term must be used (RLS, R2, JWT), define it inline on first occurrence.
- [ ] **AC-03.** If a term must be used (RLS, JWT, R2), define it inline on first occurrence.
- [ ] **AC-04.** Admin articles cover internal ops (BIR reconciliation rules, refund > ₱25K two-admin flow) and must never leak — gated server-side, X-Robots-Tag: noindex on /help/admin/.

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| 3 | Disputes & refunds | 5 | "How does dispute mediation work?" / "How do I process a refund ≤ ₱25K?" / "How do I escalate a refund > ₱25K to two-admin approval?" / "What's the force-majeure policy?" / "How do I document a dispute resolution?" |
| 2026-05-12 | **Public help articles + private admin section, role-gated.** | SEO benefits (couples Googling "how does setnayan refund work" → land on a real answer) require articles to be publicly indexable. Admin articles cover internal ops (BIR reconciliation rules, refund > ₱25K two-admin flow) and must never leak — gated server-side, `X-Robots-Tag: noindex` on `/help/admin/*`. |

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `Account`
- [ ] `Payments`
- [ ] `Vendors`
- [ ] `article_feedback`
- [ ] `help_articles`
- [ ] `help_search_synonyms`
- [ ] `support_canned_responses`
- [ ] `support_routing_config`
- [ ] `support_tickets`
- [ ] `ticket_messages`

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

