---
iteration_id: 0013_platform_stack_and_sync
iteration_number: 0013
spec_source: 0013_platform_stack_and_sync.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — Iteration 0013 — Platform Stack & Sync Setup

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0013_platform_stack_and_sync.md` (spec) · `0013_platform_stack_and_sync.html` (prototype) · `0013_platform_stack_and_sync.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] What this iteration delivers
- [ ] How this document is organized
- [ ] Step A1 — Domain (15 min)
- [ ] Step A2 — GitHub repository (10 min)
- [ ] Step A3 — Vercel account (15 min)
- [ ] Step A4 — Supabase project (20 min)
- [ ] Step A5 — Cloudflare account + R2 bucket (20 min)
- [ ] Step A6 — YouTube master channel (30 min)
- [ ] Step A7 — Setnayan Pay (manual reconciliation per 0034) — receiving accounts (1–3 days)
- [ ] Step A8 — Stripe account (international payments, 30 min – 1 day) — DEFERRED to V1.5
- [ ] Step A9 — Anthropic API account (Claude API for AI features, 10 min)
- [ ] Step A10 — Apple Developer Program (iOS + macOS, $99/year, 1–3 days)
- [ ] Step A11 — Google Play Console (Android, $25 one-time, 1–2 days)
- [ ] Step A12 — Domain DNS (after Steps A2–A5 done, 30 min)
- [ ] Step A13 — Transactional email (Resend recommended, 15 min)
- [ ] Step A14 — Sentry account (error tracking, optional but recommended, 10 min)
- [ ] Step A15 — Suno account (music catalogue, per playbook 14, 30 min)
- [ ] Step A16 — Final credential summary
- [ ] Step B1 — Scaffold the Next.js + Supabase project
- [ ] Step B2 — Apply the V1 schema as Supabase migrations
- [ ] Step B3 — RLS policies for every table
- [ ] Step B4 — Auth flow + Supabase Realtime wiring
- [ ] Step B5 — iOS native app skeleton (for 0012 Papic)
- [ ] Step B6 — Android native app skeleton (for 0012 Papic)
- [ ] Step B7 — macOS desktop shell (Tauri)

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** > > Native strategy locked 2026-05-12. V1 web is React via Vercel + Next.js.
- [ ] **AC-02.** Every account, credential, and configuration that you, the user, must obtain.
- [ ] **AC-03.** The channel must stay non-monetized.

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `setnayan`

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

