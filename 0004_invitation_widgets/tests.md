---
iteration_id: 0004_invitation_widgets
iteration_number: 0004
spec_source: 0004_invitation_widgets.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — 0004 — Invitation Widgets Editor

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0004_invitation_widgets.md` (spec) · `0004_invitation_widgets.html` (prototype) · `0004_invitation_widgets.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] What to build
- [ ] Build sequence — requires / provides
- [ ] Requires (must be implemented in earlier iterations before this one runs)
- [ ] Provides (downstream iterations consume these — do not modify in later iterations without changelog)
- [ ] Forward-references intentionally NOT made
- [ ] Visual reference (canonical)
- [ ] The 11 widgets
- [ ] Data model
- [ ] `invitation_widgets` — one row per widget per event
- [ ] Per-widget `config_json` schemas (Zod-validated)
- [ ] `pro_widget_purchases` — the upgrade record
- [ ] Pro purchase flow (apply-then-pay via 0034)
- [ ] Editor UX
- [ ] Three-panel layout (desktop, 1380px+)
- [ ] Mobile editor (390×844)
- [ ] Functional scope
- [ ] Must work end-to-end
- [ ] Basic-tier features that must work end-to-end (folded in from former Pro candidates)
- [ ] Out of scope (deferred)
- [ ] ⚠️ Important — Offline behavior
- [ ] Acceptance criteria
- [ ] Privacy & compliance
- [ ] Companion files to read before starting
- [ ] Decision log
- [ ] Notes for Claude Code

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** Each numbered iteration must be implementable in order with no backward dependencies.
- [ ] **AC-02.** // Once palette is locked: renderer reads the locked palette swatches, picks the darkest-with-≥7:1 contrast // as pattern color and the lightest as background, falls back to ≥4:1 then black-on-white if no swatch // combo clears the threshold.
- [ ] **AC-03.** Frames inherit the wedding's accent color from the locked palette by default.
- [ ] **AC-04.** Continue?" This iteration's only direct consumer of the lock palette is the QR Code widget (defined here in 0004 itself), which reads the locked palette to auto-derive its colors when colormode = 'autofrompalette'.
- [ ] **AC-05.** ### Basic-tier features that must work end-to-end (folded in from former Pro candidates) - Greeting video upload. Couple uploads a 15–30 sec MP4 in the Greeting inspector.
- [ ] **AC-06.** - Free-form drag-drop layout — locked at sequential vertical widgets per spec 15 Part 11.
- [ ] **AC-07.** But two surfaces interact with the venue day: RSVP submission (guest-facing, can happen at any time including at the venue): - The RSVP form must use optimistic UI + queued writes.
- [ ] **AC-08.** Forward references must be reframed as "this iteration provides X; downstream iterations consume X." | Ensures the folder sequence builds cleanly step-by-step.

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| 1 | **Hero Monogram** | Static monogram (auto-generated or uploaded) with style + motif picker + 25-frame catalog | Names animate into the monogram on page load · ₱99 |
| 3 | **Our Story** *(new in 0003)* | Couple's love-story timeline of 3–7 moments (date label + title + body + optional photo) with optional intro/closing copy. Format toggle: timeline / prose / mixed | Scroll-triggered photo parallax + Ken Burns effect on each moment · ₱99 |
| 9 | **Schedule** | Time-aligned run-of-show list | "Happening now" live highlight (purely time-based; current block glows + auto-scrolls; role-specific cue line) · ₱99 |
| 2026-05-08 | Pro Bundle priced at ₱199 (covers all 3 Pros, vs ₱300 separately, ~33% off) | Bundle math kept dynamic in code so it auto-scales as new Pros are added |
| 2026-05-08 | **Pro tier per widget priced at ₱99; Pro Bundle (all 3) at ₱199** (charm-priced 2026-05-12) | Clean impulse-purchase price points; bundle saves ~33% off the all-three sum and converts couples who would have bought at least one anyway |
| 2026-05-08 | Illustrated attire figure library (with runtime skin-tone + fabric recoloring) deferred to V2 | Build cost (~₱25–35K) hard to justify until demand validated. V1 ships with stylist-uploaded reference photos at zero build cost |
| 2026-05-08 | Per-render AI outfit generation deferred to V2 paid premium | Real per-render cost (₱3–15) breaks Setnayan's zero-marginal-cost pattern; IP risk on uploaded designer sketches; quality non-deterministic. Future paid premium with disclaimers when justified |

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `events`
- [ ] `invitation_widgets`
- [ ] `pro_widget_purchases`

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

