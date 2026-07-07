---
iteration_id: 0022_vendor_dashboard
iteration_number: 0022
spec_source: 0022_vendor_dashboard.md
generated_at: 2026-05-12
status: starter — engineer fills in during implementation
---

# Test Plan — 0022 — Vendor Dashboard, Comprehensive Interactive Prototype

> Auto-generated starter from the iteration spec. Each section below pulls structure from the spec; the test cases themselves are the engineer's (or Claude Code's) responsibility to flesh out during implementation. **Treat this as a coverage checklist, not a finished test suite.**

**Companion files in this folder:** `0022_vendor_dashboard.md` (spec) · `0022_vendor_dashboard.html` (prototype) · `0022_vendor_dashboard.docx` (stakeholder doc) · `tests.md` (this file).

## Scope summary

---

## Test coverage map

Each section of the spec needs corresponding test coverage. Tick when written.

- [ ] 1. The 6 vendor surfaces
- [ ] 2. Vendor data model (V1)
- [ ] 2.1 The Vendor record
- [ ] 2.1b Mandatory vendor logo (locked 2026-05-12)
- [ ] 2.1a Vendor-proposed custom categories
- [ ] 2.2 The Service object (the spec-expanded shape from 2.4d earlier)
- [ ] 2.2a Crew size on service definition (locked 2026-05-12)
- [ ] 2.3 Calendar mechanism
- [ ] 2.4 Client pipeline
- [ ] 2.5 Plan & proposal builder
- [ ] 2.6 Team / agents
- [ ] 2.6a Team member role assignment (locked 2026-05-12)
- [ ] 3. Pro subscription (locked weekly model)
- [ ] 4. In-app crew rates (V1.5 scope; documented for forward-compat)
- [ ] 5. QR-as-a-service for vendor types beyond V1
- [ ] 4a. Calendar — privacy + collision-tolerance for agents
- [ ] 4b. Calendar mobile view rules
- [ ] 4c. Agent attribution on every booking
- [ ] 5a. Headquarters Pin + Extended Pins · with 5km service commitment
- [ ] 5b. Sponsored Boost · ₱1,499/week · extends visibility from 10km to 30km
- [ ] 5c. Vendor-controlled final price + payment routing
- [ ] Rule 1 — Vendor controls the final agreed price
- [ ] Rule 2 — Payments settle off-platform · 0% fee, 0% commission (Setnayan Pay convenience fee RETIRED 2026-06-07; the old "3% opt-in" path is no longer offered)
- [ ] ~~Rule 3 — Tax treatment when Setnayan receives payments~~ (RETIRED — Setnayan no longer receives vendor-booking payments; off-platform only)
- [ ] ~~Rule 4 — Setnayan Pay convenience fee~~ (RETIRED to 0% at the 2026-06-07 reset)
- [ ] 2d. Couple-invite claim landing (locked 2026-05-19) — public route, default + Already-on-Setnayan branches, post-signup auto-link, failure modes, transactional email template

## Acceptance criteria

Claims drawn from the spec that the implementation must satisfy. Each one needs at least one passing test case before this iteration ships.

- [ ] **AC-01.** Aligns with the locked decisions on apply-then-pay, Pro weekly subscription, multi-service calendars, and in-app crew rates.
- [ ] **AC-02.** The logo is a hard-blocking requirement at the verification stage — vendors cannot submit their registration application without one, and Setnayan Team verification cannot approve a vendor whose logor2key is missing.
- [ ] **AC-03.** Submitting without one returns a form error: "Company logo is required.
- [ ] **AC-04.** ### 2.1a Vendor-proposed custom categories Vendors aren't locked into the 28 canonical wedding service categories.
- [ ] **AC-05.** Free vendors with pending verification cannot boost.
- [ ] **AC-06.** If Mariposa has 3 pins (Tagaytay, Manila, Cebu) and 12 / 32 / 28 photography vendors in each 20km respectively, boost is locked in Tagaytay but available in Manila and Cebu independently.
- [ ] **AC-07.** This is the V1 default and matches the existing locked decision from 0006/0007 ("vendor money leaves Setnayan · direct to vendor").
- [ ] **AC-08.** Claim landing at `/vendor/claim/{token}` is publicly accessible (no auth) and shows the default-branch surface OR the Already-on-Setnayan branch based on whether the invited email matches an existing `users.email` who owns a `vendors` row.
- [ ] **AC-09.** Claim landing displays the identity snapshot (business name · phone · email · service category · couple display name · event date) and explicitly omits `package_total_centavos`, `vendor_inclusions`, `vendor_payment_milestones`, and `vendor_meetings`.
- [ ] **AC-10.** Default-branch Claim & sign up routes the vendor into the standard registration flow with `email` pre-filled + locked, the `claim_token` carried as a query param, and the originating `relationship_id` carried via hidden field. The mandatory logo gate from § 2.1b still applies (placeholder logo acceptable).
- [ ] **AC-11.** On successful claim, the new `vendors` row is auto-linked back to `event_vendor_relationships.marketplace_vendor_id` AND a `vendor_follows` row is inserted per 0019 § Booking-implies-follow auto-insert — both writes happen in the same transaction as the vendor registration completion.
- [ ] **AC-12.** Already-on-Setnayan branch Sign in & connect links the EXISTING `vendor_id` into the couple's `event_vendor_relationships.marketplace_vendor_id` without creating a new `vendor_invites` row or a duplicate vendor profile; chat unlocks immediately on both sides.
- [ ] **AC-13.** Failure modes — expired token, revoked token, already-claimed token, declined token, and token-not-found — each render the documented read-only surface without leaking token-existence information.

## SKU + pricing coverage

Every pricing path needs a test. Verify amount, currency, applied discount/comp, and that the order row matches the displayed price.

| Direct (default · the only live path) | ₱85,000 to vendor | ₱85,000 | ₱0 |
| ~~Setnayan Pay~~ (RETIRED to 0% 2026-06-07) | ~~₱87,550 to Setnayan~~ → off-platform | ₱85,000 (full, direct) | ₱0 (no fee) |
| Volume | 4% | Packages &gt; ₱150K · volume discount on big contracts |
| Tiny floor | min ₱500 | Contracts &lt; ₱10K · keeps small-policy economics sane |
| B · Specialized tool integrations | ₱99/week each | 100% (license fee) | Yes — billed weekly with Pro |
| C · Pro-included benefits | Bundled in ₱500 Pro Weekly | 100% (subscription) | Yes |

## Schema coverage

Tables this iteration touches. Each needs: insert test, RLS test (per the canonical pattern in `02_Specifications/RLS_Policy_Pattern.md`), and constraint test.

- [ ] `cancelled`
- [ ] `crew_meal_required`
- [ ] `crew_size`
- [ ] `paused`
- [ ] `vendor_services`
- [ ] `vendor_invites` (canonical schema in 0006) — read-only here · post-claim writes to `claimed_by_user_id`, `claimed_vendor_id`, `claimed_at`, `status='claimed'`

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

### Couple-invite claim landing (locked 2026-05-19)

- [ ] **Default-branch render.** `GET /vendor/claim/{token}` with a valid `pending` token + unknown email shows the default branch with identity snapshot + "Claim & sign up" / "I'm not this vendor" CTAs.
- [ ] **Already-on-Setnayan branch render.** Same route with a `pending` token whose `email` matches an existing `users.email` + `vendors.owner_user_id` shows the Sign-in-and-connect branch instead.
- [ ] **Claim signup auto-link transaction.** Completing registration from a claim link writes ALL of: new `vendors` row, `event_vendor_relationships.marketplace_vendor_id`, `vendor_invites.claimed_vendor_id`, `vendor_invites.status='claimed'`, `vendor_invites.claimed_by_user_id`, `vendor_invites.claimed_at`, and a `vendor_follows` row (per 0019 § Booking-implies-follow). Failure of any one write rolls back the whole transaction.
- [ ] **Connect auto-link transaction.** Confirming Connect writes the existing `vendor_id` into `event_vendor_relationships.marketplace_vendor_id` + inserts `vendor_follows` row + sets `vendor_invites.status='claimed'` with `claimed_vendor_id` = existing vendor_id — no new `vendors` row.
- [ ] **Identity-only API boundary.** The claim-landing API response is hardened to omit `package_*` / `vendor_inclusions` / `vendor_payment_milestones` / `vendor_meetings` even if a client requests them with crafted query params.
- [ ] **Decline writes correctly.** Decline endpoint sets `vendor_invites.status='declined'` + `declined_at=now()`; no `vendors` row created; couple side reflects the new pill state.
- [ ] **Expired token.** Lazy sweep flips a `pending` token past `expires_at` to `expired` on render; page shows the documented read-only message.
- [ ] **Revoked / claimed / declined token render.** Each terminal-status token renders its documented read-only surface; no claim action possible.
- [ ] **404 on unknown / deleted token.** Token not in DB → generic 404 (no token-existence info leak). Parent `event_vendor_relationships` deleted → CASCADE wipes the invite → also 404.
- [ ] **Mandatory logo gate still applies.** Coming-via-claim vendors must satisfy the § 2.1b logo gate to complete registration (placeholder logo acceptable per existing rules).
- [ ] **Verification + payout semantics unchanged.** A coming_soon vendor created via claim is queued in the standard verification queue and uses the standard 3-stage payout — invite origin has zero effect on these.
- [ ] **Email mismatch on signup.** Vendor submitting registration with an email different from `vendor_invites.email` is rejected; no vendor row created; invite stays `pending`.
- [ ] **Transactional email send.** Inviting fires exactly one email via the configured transactional provider with the documented subject + body template; bounce / suppression handling is the provider's responsibility (no Setnayan-side throttle per the 2026-05-19 lock).

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

