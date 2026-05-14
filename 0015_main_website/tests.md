---
iteration_id: 0015_main_website
iteration_number: 0015
spec_source: 0015_main_website.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — Iteration 0015 — Setnayan Main Marketing Website

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0015_main_website.md` (spec) · `0015_main_website.html` (prototype) · `0015_main_website.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] What this iteration ships
- [ ] Downstream iteration consumed by 0015 marketing copy: 0019 Communications
- [ ] Brand: SETNAYAN
- [ ] One app, three role-routed entries
- [ ] Audience model: two-sided split hero
- [ ] "I'm planning an event" side
- [ ] "I'm a vendor" side
- [ ] Announcement bar (top of every marketing page)
- [ ] Tone & voice (locked 2026-05-11) — luxurious, Filipino, modern
- [ ] Notes on the original "oo nga noh" framing
- [ ] Localization (EN / TL / CEB) — locked 2026-05-11. Primary locale: English.
- [ ] Privacy invariants (locked from 2026-05-09 memory)
- [ ] Hide prices on the public site (this iteration's scope decision)
- [ ] Section-by-section spec
- [ ] Section 1 — Announcement bar
- [ ] Section 2 — Two-sided split hero
- [ ] Section 3 — The chaos we're fixing
- [ ] Section 4 — One app, every moving piece
- [ ] Section 5 — In-app services (apparatus catalog)
- [ ] Section 6 — Vendor compatibility & verification
- [ ] Section 7 — Outsourcing, pacing, scheduling
- [ ] Section 8 — The vendor flywheel
- [ ] Section 9 — Event-type readiness board
- [ ] Section 10 — PH coverage map
- [ ] Section 11 — Dual CTA + brand-origin footer

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** If 0019 ends up materially different from what's promised on the marketing site, the marketing copy must be revised in lockstep with the iteration draft.
- [ ] **AC-02.** --- ## Localization (EN / TL / CEB) — locked 2026-05-11.
- [ ] **AC-03.** The marketing site (and downstream the in-product surfaces) must be fully compatible in three languages from V1 launch: | Code | Language | Role | Notes | |---|---|---|---| | en | English | Primary / default | The default bundle for every visitor unless overridden.
- [ ] **AC-04.** Voice rules per locale: - tl — the "oo nga noh, kailangan ko 'to" voice locked above.
- [ ] **AC-05.** | | vendors.ispublic defaults FALSE | A vendor must explicitly opt in to marketing exposure during their free-registration flow.
- [ ] **AC-06.** No PHP figures. Cards (from the locked CLAUDE.md SKU list, reordered for marketing flow): 1.

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `Verified`
- [ ] `en`
- [ ] `hero_toggle_flipped`
- [ ] `marketing_cta_clicked`
- [ ] `vendor_registrations`

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

