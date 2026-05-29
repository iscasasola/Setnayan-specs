# Setnayan — System Wiring Map (2026-05-28)

**Audit scope:** every button + form + server-action on the 3 doorways (customer, vendor, admin) on `origin/main` of `iscasasola/setnayan-platform`. Each interactive element traced to file:line, server-action, downstream table writes, and cross-doorway notification fires.

**Why this exists:** owner asked *"map the whole app — their connections to buttons and functions and how they can throw information between admin, vendor and customer."* The keynote `system-map.jsx` is the conceptual diagram (three doorways, one event engine); this doc is the code-level verification that the diagram matches what ships.

**Companion docs:**
- [Feature_Flow_Registry.md](Feature_Flow_Registry.md) — route-level entry/action/outcome inventory (2026-05-22 audit, ~103 routes)
- [App_Build_Status.md](App_Build_Status.md) — spec-vs-code ✅/🟠/⚠️/🔴 per iteration
- [CLAUDE.md](CLAUDE.md) — canonical decision log (this audit captured as 2026-05-28 row)

**Pilot context:** pilot 2026-06-01 (4 days). 5-20 personal/family cohort. Owner is solo admin. RED findings must ship pre-pilot; AMBER + GREEN documented but not gating.

---

## TL;DR · headline numbers

| Doorway | Surfaces walked | Interactive elements | ✅ wired | 🟠 partial | 🔴 broken | ⚠️ orphan | 🚫 retired |
|---|---|---|---|---|---|---|---|
| Customer | 19 | 92 | 14 core flows | 4 | 1 (verified) | 0 (3 false-positives ruled out) | 0 |
| Vendor | 17 | 29 | 8 core flows | 2 | 0 | 8 (all V1.x post-pilot) | 0 |
| Admin | 26 | 31 | 22 | 0 | 5 (audit-log gaps) | 2 (V1.x) | 0 |
| **Total** | **62** | **152** | **44 + 24 wired sub-flows** | **6** | **6** | **10** | **0** |

**Pilot readiness:** GREEN with 3 RED fixes to ship pre-pilot. No pilot-blocking architecture gaps. The 10 ⚠️ orphans are all explicitly V1.x post-pilot per CLAUDE.md decision log (clients/calendar/billing on vendor side · dispute detail page + Pricing Report Generation on admin side).

---

## RED · pre-pilot critical (ship today/tomorrow)

### 1. 🔴 Follow-gate UI consume gap (couple-side messages)

**File:** [`apps/web/app/dashboard/[eventId]/messages/page.tsx:15`](https://github.com/iscasasola/setnayan-platform/blob/main/apps/web/app/dashboard/[eventId]/messages/page.tsx#L15)

**Symptom:** when a couple tries to message a vendor they haven't followed yet, `startThreadByVendorEmail` redirects to `/dashboard/[eventId]/messages?error=Follow%20X%20first&next_action=follow&vendor_profile_id=...`. The page renders only the generic error toast — the `next_action` + `vendor_profile_id` params are not in the `searchParams` type at line 15 + no `<FollowGate>` mount exists. Couple is stranded with no clear path forward.

**Why it matters for pilot:** the follow gate (CLAUDE.md 2026-05-14 row 4 + 2026-05-19 row 10) is the anti-spam mechanism every couple-to-new-vendor interaction passes through. The 5-20 family cohort will hit this on their first vendor message attempt.

**Fix:** extend searchParams type, mount existing `<FollowGate>` component (`apps/web/app/_components/follow-gate.tsx`) conditional on `next_action='follow' && vendor_profile_id` with copy *"Follow {vendor} first — you'll be able to message them right after."*

**Existing infra:** `followVendor` server action at `apps/web/lib/follow-actions.ts:16` + `<FollowGate>` component at `apps/web/app/_components/follow-gate.tsx`. Zero new code, pure wiring.

---

### 2. 🔴 Order payment-instructions email missing (couple-side cart)

**File:** [`apps/web/app/dashboard/[eventId]/orders/actions.ts createOrder`](https://github.com/iscasasola/setnayan-platform/blob/main/apps/web/app/dashboard/[eventId]/orders/actions.ts) (319 lines, zero `sendEmail` calls)

**Symptom:** when a pilot couple submits a Today's Focus ₱1,499 OR any cart item:
1. `createOrder` inserts `orders` row with `reference_code` 'SN<8-hex>'
2. Redirects to order-detail page (success state)
3. **No email arrives** with bank-transfer instructions, reference code, or 24-hr SLA copy

If the couple closes the tab right after the redirect, they have no way to retrieve their reference code without re-opening the dashboard. The apply-then-pay manual-reconciliation flow (iteration 0034) requires the couple to:
- Know which account to transfer to (BDO / GCash details)
- Include the SN-prefixed reference code
- Upload screenshot for admin to reconcile within 24 hrs

**Why it matters for pilot:** every paid SKU purchase goes through this flow. The 5-20 family cohort will purchase Today's Focus + add-ons; if they can't complete payment, pilot revenue + lock/unlock cycle coverage breaks.

**Fix:** add `sendEmail` call to `createOrder` after the orders INSERT (and another in admin `approvePayment` for confirmation). Template lives inline in createOrder for V1 (template directory doesn't exist yet). Subject: *"Setnayan order {public_id} — payment instructions"*. Body: reference code + bank/GCash account details from env vars + 24-hr admin reconciliation copy + dashboard deep-link.

**Existing infra:** `sendEmail` helper at `apps/web/lib/email.ts:29`. Used in signup, vendor cancel, hiring-guide. The Resend pipeline is wired; just no template was added for payment instructions.

---

### 3. 🔴 5 admin audit-log gaps

**Files:**
- [`apps/web/app/admin/users/actions.ts`](https://github.com/iscasasola/setnayan-platform/blob/main/apps/web/app/admin/users/actions.ts):
  - `toggleTeamMember:26-58` — flips `users.is_team_member` flag, no audit
  - `resetUserPassword:163-200` — generates temp password, no audit
  - `confirmUserEmail:210-225` — sets `auth.email_confirmed_at`, no audit
- [`apps/web/app/admin/reviews/actions.ts`](https://github.com/iscasasola/setnayan-platform/blob/main/apps/web/app/admin/reviews/actions.ts):
  - `rejectAppeal:127-148` — closes appeal, no audit, no customer notification
  - `escalateAppeal:150-171` — flags appeal for admin, no audit

**Symptom:** all 5 actions write state but skip the `admin_audit_log` row that every other admin mutation writes (verified at lines 408 + 502 of `/admin/users/actions.ts` for `issueCompGrant` + adjacent actions which DO log). Per CLAUDE.md 2026-05-12 row *"§ 9.1 two-admin approval scope"*, admin audit-log is required for every admin mutation.

**Why it matters for pilot:** owner is solo admin during pilot. If owner blacklists / resets-password / confirm-emails on family-member accounts and something goes wrong, there's no audit trail to debug from. Mechanical fix (one `admin.from('admin_audit_log').insert(...)` per action).

**Fix:** add `admin_audit_log` INSERT to each of the 5 actions matching the canonical pattern used by `issueCompGrant` (line 408): `action` slug + `target_user_id` + `metadata` JSON + `performed_by_admin_id`. Also add `sendEmail` to `rejectAppeal` so vendor knows their appeal was closed.

---

## AMBER · polish during pilot (fix this week if time)

| Item | File:line | Pilot risk | Notes |
|---|---|---|---|
| Cancel email uses Resend direct (no `notification_type='booking_cancelled'` enum value) | `vendors/actions.ts:2128` | LOW | Vendor still gets email; the canonical `emitNotification` path skipped because enum lacks value (acknowledged in CLAUDE.md 2026-05-27 row PR #551 follow-up #b) |
| Soft-hold rate-limit doesn't email couple | `vendors/actions.ts:425-531` | LOW | Gate enforced inline + modal copy explains; just no follow-up email |
| Force-majeure resolveFlag missing audit_log | `admin/force-majeure/actions.ts:88-142` | LOW | Couple gets notified, just no audit trail on admin side. Iteration 0019 § force-majeure pattern |
| Concierge-abuse adminClearFlag/adminConfirmAbuse missing audit_log | `admin/concierge-abuse/actions.ts:77-195` | LOW | Today's Focus OFF for pilot per CLAUDE.md 2026-05-22 row 3 — feature won't fire in pilot |
| Auto-cascade silent error swallow | `vendors/actions.ts:674-787` | LOW | finalizeVendor cascades into related categories; cascade errors invisible to host. Acceptable; host can re-open vendor tracker |
| Slug invalidation 60s ISR race | `website/actions.ts:20-26` + `[slug]/page.tsx revalidate=60` | LOW | Old-slug URL within 60s window shows stale data before ISR cache expires. Edge case; rare for pilot couples |

---

## GREEN · V1.x post-pilot (acknowledged + deferred)

**Vendor-side missing surfaces (all explicitly V1.x per spec):**
- `/vendor-dashboard/clients` + `/clients/[event_id]` — Rule 2 vendor-release CTA (CLAUDE.md 2026-05-24 ninth row · CLAUDE.md 2026-05-27 row PR queue D-E)
- `/vendor-dashboard/clients/invite` — Bring in outside Clients (CLAUDE.md 2026-05-28 eighth row)
- `/vendor-dashboard/calendar` — Rule 5 calendar-block auto-create
- `/vendor-dashboard/settings/availability` — Rule 3 max_soft_holds_per_date UI (column shipped via PR #550, UI deferred)
- `/vendor-dashboard/billing` + `/billing/upgrade` — Pro Vendor ₱1,999/mo + Enterprise ₱5,499/mo + Annual SKUs (CLAUDE.md eleventh 2026-05-28 row)
- `/vendor-dashboard/post-event-blurbs` — Iteration 0046 editorial credit claims (V1.5+)
- `/vendor-dashboard/bid-inbox` — V2.1 lead-broker side-branch RETIRED 2026-05-28 (correctly not shipped)

**Admin-side missing surfaces:**
- `/admin/disputes/[disputeId]` — dispute detail + resolve actions (CLAUDE.md 2026-05-23 row 2 PR #419 shipped list-only)
- `/admin/addons` Pricing Report Generation — CLAUDE.md 2026-05-17 row 5 spec (markdown snapshot + Pricing.md regen + pandoc .docx)
- TIER 2 vendor self-claim sub-queue — CLAUDE.md 2026-05-22 row 11 vendor scan at venue
- Admin revenue-milestone notification primitive — CLAUDE.md 2026-05-28 ninth row (₱1M MiroTalk seed, table + UI panel)

**Cross-cutting integrations:**
- Persona / Veriff / Onfido KYC backend — verification UI shipped, backend is no-op pending owner OWNER_ACTIONS punch list signup
- Two-admin approval gate primitive — § 9.1 spec requires for refund > ₱25K + comp grant > ₱10K. Current V1 implementation: warning banner only (per CLAUDE.md 2026-05-23 row 2 PR #431). Full primitive lands V1.x. Pilot is owner-only-admin so no two-admin scenarios trigger.
- Maya Bulk Fund Transfer disbursement automation — CLAUDE.md 2026-05-17 first row · V1.5+ scaffold

---

## Cross-doorway hand-offs verified

| Hand-off | Path | Status |
|---|---|---|
| Customer signs up → Welcome email | `signup/actions.ts:114 sendEmail` | ✅ wired |
| Customer creates event → join token minted | `create-event/actions.ts:75 createWeddingEvent` → `on_event_created` trigger | ✅ wired |
| Customer locks vendor → vendor sees in `/vendor-dashboard/bookings` | `vendors/actions.ts:305 finalizeVendor` → event_vendors UPDATE | ✅ wired |
| Customer cancels booking → vendor receives email + chat deep-link | `vendors/actions.ts:1925 cancelBookingAsHost` → sendEmail direct (NOT emitNotification because enum gap) | 🟠 AMBER (works but bypasses canonical pipeline) |
| Customer submits bid (chat) → vendor inbox unread badge | `messages/actions.ts:8 startThreadByVendorEmail` → `chat_threads` UPSERT → `vendor-dashboard/bookings/page.tsx:67-82 fetchVendorThreads + unread badge` | ✅ wired (modulo Follow gate UI gap — see RED #1) |
| Vendor submits verification → admin sees in `/admin/verify` queue | `verify/actions.ts:208 submitApplication` → `vendor_verification_applications.status='pending_review'` | ✅ wired |
| Admin approves verification → vendor unlock + tier flip | `admin/verify/actions.ts:approveApplication` → `vendor_profiles.verification_state='verified'` + `vendor_tier_history` audit + `public_visibility='verified'` | ✅ wired |
| Admin reconciles payment → couple order activates + vendor payout scheduled | `admin/payments/actions.ts:approvePayment` → payments.matched + orders.paid + receipts.issued + payouts.scheduled | ✅ wired (but missing: payment_received email to couple — see RED #2) |
| Customer disputes booking → admin force-majeure inbound link | `cancel-booking-button.tsx:389 [Request refund/dispute]` → `/dashboard/[eventId]/disputes` (not a true orphan — Customer agent flagged false-positive) | ✅ wired |
| Admin moderates review → vendor appeal resolved + customer notified | `admin/reviews/actions.ts:overridePublishReview` → RPC `admin_override_publish_review` | ✅ wired (modulo `rejectAppeal`/`escalateAppeal` audit gaps — see RED #3) |
| Multi-host invite → moderator joins event | PR #181 invite-token mechanic shipped + `/host/accept/[token]` flow | ✅ wired (V1.2 full feature surface deferred per v2.1 brief § 13.7) |

---

## False-positive findings ruled out

The customer-side audit agent flagged 4 items that turned out to be wrong on inspection. Logging here so future audits don't re-trip on the same blind spots:

| False positive | Reality | Why agent missed it |
|---|---|---|
| `DOWNPAID_STATUSES` undefined → cancel routes break | Defined at `vendors/actions.ts:1902` as `new Set<VendorStatus>(['deposit_paid','delivered','complete'])` | Agent's read window cut off before line 1902 in 2168-line file |
| `/dashboard/[eventId]/disputes` orphan | Linked from `page.tsx:200` TILES + `cancel-booking-button.tsx:389` DisputeLinkButton | Agent missed TILES array in event-home page |
| `/dashboard/[eventId]/schedule` orphan | Linked from `upcoming-schedules.tsx:71` + `your-plan-section.tsx:189` + `live-schedule-card.tsx:52` | Same — agent did per-route scan without checking parent surfaces |
| `/dashboard/[eventId]/activity` orphan | Linked from `activity-feed.tsx:78` | Same |

The vendor-side audit agent also flagged `/vendor-dashboard/messages/[threadId]` as missing chat reply server action — false positive. Reply lives in shared `apps/web/app/_components/chat-send-form.tsx` + `lib/chat-actions.ts` consumed by both sides.

These false positives mirror the same audit pattern caught in CLAUDE.md 2026-05-20 rows 442-444 (Phase 1 audit agents shipped 5 false positives caught on verification pass). **Process lesson**: Phase 0 fact-gathering against parent-surface entry points + grep for shared components MUST happen before flagging anything as orphan.

---

## Methodology

**3 parallel Explore agents** (one per doorway · ≤350-word reports · ~67s + 130s + 116s wall-clock parallel). Each agent walked its surface list, grep'd for `onClick` + `action=` + server-action exports, tracked downstream state writes, and reported orphans + broken connections + cross-doorway fragility.

**Synthesis pass:** verified every flagged RED finding by direct file:line read against `origin/main`. 4 of 4 customer-agent flags + 1 of 1 vendor-agent flag were false positives. 5 of 5 admin-agent flags were real. 3 RED items remain after verification (Follow gate UI · order email · 5 audit-log gaps).

**Audit window:** point-in-time snapshot of `origin/main` at 2026-05-28 18:00 PHT. Subsequent PRs may shift the picture; re-run the 3-agent dispatch after the next significant PR batch.

---

## Companion artifacts

- This doc (System_Wiring_Map_2026-05-28.md) — synthesis of 3 doorway audits
- [Feature_Flow_Registry.md](Feature_Flow_Registry.md) — route-level inventory (2026-05-22)
- [App_Build_Status.md](App_Build_Status.md) — spec-vs-code per iteration
- [CLAUDE.md](CLAUDE.md) — canonical decision log (this audit captured as 2026-05-28 row)
- 3 RED-fix PRs to ship pre-pilot (links to be filled when PRs open)
