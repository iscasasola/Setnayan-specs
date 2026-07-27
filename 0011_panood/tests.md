---
iteration_id: 0011_panood
iteration_number: 0011
spec_source: 0011_panood.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — Iteration 0011 — Panood

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0011_panood.md` (spec) · `0011_panood.html` (prototype) · `0011_panood.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] What this iteration ships
- [ ] Pricing — base + add-ons (V1, locked 2026-05-09)
- [ ] Base SKU
- [ ] Capacity add-ons
- [ ] Worked pricing examples
- [ ] Service add-ons (event-wide, not capacity-based)
- [ ] Why this pricing structure
- [ ] Delivery architecture — YouTube as sole viewer surface
- [ ] What changes vs. the original master spec
- [ ] Why YouTube-only
- [ ] Pipeline
- [ ] Setnayan's master YouTube channel
- [ ] Embed implementation
- [ ] Cost model (per-event, base + add-ons)
- [ ] Highlight markers (base SKU feature)
- [ ] Broadcaster control surfaces (V1)
- [ ] Preview vs program (desktop)
- [ ] Top bar (desktop)
- [ ] Feed controls (desktop creative row)
- [ ] Sticky audio rail (desktop)
- [ ] Bottom bar (desktop)
- [ ] Camera rail (desktop)
- [ ] Right rail (desktop)
- [ ] Mobile broadcaster
- [ ] Keyboard shortcuts (desktop)

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** Hard architectural rules for the master channel: - Channel must NOT be enrolled in YouTube Partner Program (YPP). This removes any per-broadcast monetization decision entirely; the channel is structurally incapable of running ads on a wedding broadcast.
- [ ] **AC-02.** Validation: must be PNG, must have an alpha channel, max 2 MB, min 512 × 512 px.
- [ ] **AC-03.** If YouTube ingest is down for sustained periods (rare but possible during YouTube infrastructure incidents), broadcast quality is unaffected for live viewers but the stream cannot be served until ingest recovers.
- [ ] **AC-04.** Sprint 4 (overlays) the Custom Monogram Pack asset pipeline must support both PNG upload and auto-generation before launch.
- [ ] **AC-05.** - Camera slot count enforced — broadcaster cannot add a 4th or 5th camera until the corresponding add-on is purchased.

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| ~~**Panood — Base**~~ ⚠ RETIRED | ~~1 broadcaster + 3 cameras + 3 hours~~ | ~~₱2,499~~ | — |
| **+1 Camera** | Adds one more camera slot to the broadcast | ₱999 | 30,000 | Multi-purchase up to **+2** (max 5 cameras total — 3 base + 2 extra) |
| **+1 Hour** | Adds one more hour of stream capacity | ₱999 | 30,000 | Multi-purchase, **unlimited** — couples buy as many hours as they need |
| Standard 3-cam, 3-hr stream | base | ₱2,499 |
| 5 cams, 3 hrs (full reception coverage with 5 angles) | base + 2 cams | ₱4,500 |
| 3 cams, 5 hrs (whole ceremony + reception) | base + 2 hrs | ₱4,500 |
| 5 cams, 5 hrs (typical Filipino wedding broadcast) | base + 2 cams + 2 hrs | ₱6,500 |
| 5 cams, 8 hrs (prep through send-off, full day) | base + 2 cams + 5 hrs | ₱9,500 |

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `highlight_markers`

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

