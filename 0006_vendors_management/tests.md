---
iteration_id: 0006_vendors_management
iteration_number: 0006
spec_source: 0006_vendors_management.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — 0006 — Vendors Management

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0006_vendors_management.md` (spec) · `0006_vendors_management.html` (prototype) · `0006_vendors_management.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] What this iteration builds
- [ ] Visual reference (canonical)
- [ ] Stack & conventions
- [ ] Route
- [ ] Data model
- [ ] `canonical_services` — hardcoded enum
- [ ] `event_vendor_relationships` table
- [ ] `vendor_services` — links a vendor to one or many services (canonical or custom)
- [ ] `event_custom_services` — couple-defined service rows beyond the canonical list
- [ ] `event_service_coverage_status` — per-event flag for "not needed"
- [ ] `vendor_inclusions` — free-form line items inside the package
- [ ] `vendor_payment_milestones` — flexible custom milestones
- [ ] `vendor_crew` — crew count + meal cost computation
- [ ] `vendor_meetings` — scheduled meetings between couple and vendor
- [ ] `vendor_contracts` — uploaded contract files
- [ ] Computed / derived values
- [ ] Per-vendor
- [ ] Per-event aggregate (Vendor Panel header)
- [ ] Hybrid service taxonomy — UX rules
- [ ] Payment milestones — UX rules
- [ ] Crew meals — UX rules
- [ ] Meetings — UX rules
- [ ] DIY-mode vendor browse — filter popup
- [ ] DIY-mode filter popup (locked 2026-05-12)
- [ ] Reviews schema (locked 2026-05-12)
- [ ] `vendor_invites` — couple-initiated invitations for off-platform vendors (locked 2026-05-19)
- [ ] Invite-to-Setnayan flow — UX rules (locked 2026-05-19)
- [ ] Booking-implies-follow auto-insert (cross-iter 0019 § Gate, locked 2026-05-19)

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** The implementation must visually match it at desktop and mobile widths.
- [ ] **AC-02.** No data migration is required when Din launches.
- [ ] **AC-03.** The vendor cannot edit, propose, or confirm — they communicate offline (email, message, call) and the couple records the meeting.
- [ ] **AC-04.** Guided uses the recommender (per the 7 locked Guided UX patterns in memory) that picks vendors based on event constraints.
- [ ] **AC-05.** "Invite to Setnayan" action is visible on every off-platform vendor row (`marketplace_vendor_id IS NULL`) and hidden once the row is linked. Sending an invite creates a `vendor_invites` row + fires a transactional email + flips the row's status pill to `Invite sent · {N days left}`.
- [ ] **AC-06.** Submitting the invite modal with an email that matches an existing `users.email` who owns a `vendors` row swaps the modal to a Connect surface. Confirming Connect links the existing `vendor_id` directly into `event_vendor_relationships.marketplace_vendor_id` without creating a `vendor_invites` row.
- [ ] **AC-07.** On successful claim, `event_vendor_relationships.marketplace_vendor_id`, `vendor_invites.claimed_vendor_id`, and `vendor_follows` are all written in a single transaction; the couple's 0019 chat surface unlocks automatically without requiring a manual follow.
- [ ] **AC-08.** Status pill on the relationship row cycles correctly across the five new states: `Invite sent · {N days left}` (pending), `Joined Setnayan` (claimed or Connect), `Declined the invite` (declined), `Invite expired` (expired), `Invite revoked` (revoked).
- [ ] **AC-09.** Couple may have unlimited pending invites per event AND may immediately re-invite the same email after a decline / expire / revoke (no UI cap, no cooldown — both locked 2026-05-19).
- [ ] **AC-10.** Claim landing page shows identity-only snapshot — `package_*`, `vendor_inclusions`, `vendor_payment_milestones`, and `vendor_meetings` are NOT surfaced pre-claim.

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `event_custom_services`
- [ ] `event_service_coverage_status`
- [ ] `event_vendor_relationships`
- [ ] `relationship_id`
- [ ] `vendor_contracts`
- [ ] `vendor_crew`
- [ ] `vendor_inclusions`
- [ ] `vendor_meetings`
- [ ] `vendor_payment_milestones`
- [ ] `vendor_reviews`
- [ ] `vendor_invites` — insert / RLS / partial unique index `(relationship_id, LOWER(email)) WHERE status='pending'` / FK ON DELETE CASCADE behavior when parent `event_vendor_relationships` row is deleted
- [ ] `vendor_follows` (cross-iter 0019) — auto-insert is exercised by every claim / Connect path; covered here for completeness

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

### Invite-to-Setnayan flow (locked 2026-05-19)

- [ ] **Happy path · new vendor claim.** Couple sends invite to a fresh email → vendor opens `/vendor/claim/{token}` → completes registration → all four writes happen atomically (`event_vendor_relationships.marketplace_vendor_id`, `vendor_invites.claimed_vendor_id`, `vendor_invites.status='claimed'`, `vendor_follows` row). Couple's status pill flips from `Invite sent` to `Joined Setnayan`; chat unlocks immediately (Message button enabled without a manual follow tap); one-time toast fires; vendor lands in 0022 Clients pipeline with the inviting couple at Inquiry stage and full negotiated state visible.
- [ ] **Happy path · Already-on-Setnayan Connect.** Couple submits invite modal with an email matching an existing vendor owner → modal swaps to Connect → couple confirms → no `vendor_invites` row is created; existing `vendor_id` is linked into `marketplace_vendor_id` + `vendor_follows` row inserted; existing vendor receives a 0019 system notification with the new couple in their Threads inbox.
- [ ] **Decline.** Vendor opens claim link, taps "I'm not this vendor" → `vendor_invites.status='declined'` + `declined_at=now()`; relationship row stays off-platform; status pill flips to `Declined the invite`; couple can immediately re-send invite to same email (no cooldown per 2026-05-19 lock).
- [ ] **Expiration.** Server flips pending invites past `expires_at` to `expired` on next claim-page render or vendor-list render (lazy sweep, no cron per [[reference_setnayan_cron_strategy]]); claim page for expired token shows the read-only "ask the couple to send a new one" message; status pill flips to `Invite expired` with one-tap **Resend**.
- [ ] **Revoke.** Couple taps the `Invite sent` pill → Revoke → `vendor_invites.status='revoked'`; if the vendor later opens the claim URL they see the "This invite is no longer active" read-only page.
- [ ] **Partial unique index enforces one pending invite per (relationship, email).** Attempting to INSERT a second pending row with the same `relationship_id` + `LOWER(email)` fails at the DB level; the couple-side "Resend" affordance handles this as revoke + create-new atomically.
- [ ] **Email mismatch on claim signup.** Server-enforces that the vendor's registration email matches `vendor_invites.email` exactly; mismatch returns a form error (no vendor row created; invite stays `pending`).
- [ ] **Identity-only privacy.** Claim page response payload contains NO `package_total_centavos`, `vendor_inclusions`, `vendor_payment_milestones`, or `vendor_meetings` data — verified at the API boundary, not just the UI.
- [ ] **No cap on pending invites.** Couple can create N pending invites across N different off-platform vendors with no UI cap exposed; 100-invite stress test passes without breaking the table render.
- [ ] **`marketplace_vendor_id IS NULL` gates the action.** "Invite to Setnayan" affordance is server-gated; attempting to send an invite for a relationship row that's already linked returns a 4xx error.
- [ ] **CASCADE on relationship delete.** If a couple deletes the parent `event_vendor_relationships` row, dependent `vendor_invites` rows are deleted; the claim URL then returns 404.

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

