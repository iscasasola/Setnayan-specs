---
iteration_id: 0016_step_by_step_plan_builder
iteration_number: 0016
spec_source: 0016_planning_reference.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — Setnayan Wedding Planning Reference

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0016_step_by_step_plan_builder.md` (spec) · `0016_step_by_step_plan_builder.html` (prototype) · `0016_step_by_step_plan_builder.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] 1. The Locked Sequence
- [ ] Phase 1 — Anchors (set everything else)
- [ ] Phase 2 — Major commitments (book 8–12 months out)
- [ ] Phase 3 — Style + Design layer (4–8 months out)
- [ ] Phase 4 — Programming + Entertainment (3–6 months out)
- [ ] Phase 5 — Logistics + Finishing (2–4 months out)
- [ ] Pre-event (after photographer is locked)
- [ ] Post-event (Setnayan coordination tasks)
- [ ] 2. The 8km Proximity Rule
- [ ] 3. Importance Tiers (which categories couples can't skip)
- [ ] 4. Working Budget Tiers (Per-Head Spend)
- [ ] The Five Tiers
- [ ] Working Budget by Tier × Guest Count
- [ ] Key Properties
- [ ] 5. Budget Allocation by Tier
- [ ] Tier 1 · Simple and Intimate (₱1,500–3,000/head)
- [ ] Tier 2 · Charming and Personal (₱3,000–5,000/head)
- [ ] Tier 3 · Grand and Beautiful (₱5,000–8,000/head)
- [ ] Tier 4 · Distinguished and Refined (₱8,000–13,000/head)
- [ ] Tier 5 · Luxurious and Beyond (₱13,000+/head)
- [ ] 6. Vendor Registration Schema (Din Phase 3)
- [ ] Required Declarations on Vendor Sign-Up
- [ ] Match Logic
- [ ] 7. Bundling Cascade Reference
- [ ] Hotel Premium Package (₱2,500+/pax)

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** The order is determined by three forces: lead time (how far ahead a vendor must be booked), dependency (does the category need other decisions first?), and bundling cascade (does picking it auto-resolve others?).
- [ ] **AC-02.** Reception venue (must be ≤8km from ceremony unless overridden) 3.

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| Tier | Name | Per-head ₱ | Feel |
| 1 | **Simple and Intimate** | ₱1,500–3,000 | Restaurant or modest hotel; immediate family + closest friends; minimal extras |
| 2 | **Charming and Personal** | ₱3,000–5,000 | Mid-tier hotel or curated garden; wedding party + extended family; thoughtful styling |
| 3 | **Grand and Beautiful** | ₱5,000–8,000 | Premium hotel or full-service garden estate; full design layer; SDE + cocktail extras |
| 4 | **Distinguished and Refined** | ₱8,000–13,000 | Top-tier hotel or destination estate; stylist-driven full design; premium photo/video; couture-adjacent gown |
| 5 | **Luxurious and Beyond** | ₱13,000+ | Iconic hotel grand ballroom or premium destination; couture gown; full-event stylist team; multi-vendor cocktail; designer everything |
| 50 | ₱75K – ₱150K | ₱150K – ₱250K | ₱250K – ₱400K | ₱400K – ₱650K | ₱650K+ |
| 80 | ₱120K – ₱240K | ₱240K – ₱400K | ₱400K – ₱640K | ₱640K – ₱1.04M | ₱1.04M+ |

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

