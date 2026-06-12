# Cross-Actor Gap Follow-ups — sign-off-ready proposals (2026-06-07)

> Companion to the cross-actor interaction audit. The audit's **additive, existing-infra** fixes shipped in setnayan-platform **PR #1054** (4 vendor signals + `/admin/disputes` resolve + `/admin/notifications` reader — see `DECISION_LOG.md` 2026-06-07).
>
> This doc covers the **5 items deliberately NOT built** because each touches owner-locked economics or is net-new V1-scope work that needs explicit sign-off. Each is written so the owner can approve/defer/reject with the load-bearing decision surfaced. Effort is in **Claude Code time** (not human-engineer months) per the timeline-units rule; calendar-bound externals are called out separately.
>
> Nothing here is built. Approve an item and it becomes its own PR.

---

## Priority at a glance

| # | Item | Type | Owner decision needed | Claude Code effort |
|---|---|---|---|---|
| 1 | Token burn-on-answer | Revenue model (locked economics) | Confirm the locked band map + wedding-vs-vendor region key | ~1 day + 1 migration |
| 2 | Two-admin approval gate | Governance integrity | Which actions are gated + the threshold amounts | ~1–2 days + 1 migration |
| 3 | Anti-fraud fake-event surface | Trust & safety | Detection signals + termination authority (single vs two-admin) | ~1 day + 1 migration |
| 4 | Chat moderation (real threads) | Trust & safety | Report-first vs full admin read; RA 10173 stance on admin reading DMs | ~1–2 days + 1 migration |
| 5 | Vendor-unresponsive / ghosting | UX + economics | The escalation action (auto-decline? token refund? admin queue?) — and it needs a scheduler (cron-free constraint) | ~1 day, **blocked on the cron-free question** |

Recommended order: **2 → 1 → 3 → 5 → 4** (governance integrity first; then the revenue model; safety; then the two that have an open architectural question).

---

## 1 · Token burn-on-answer

**Gap.** The vendor token economy is **economically inert today.** `unlock-category.ts` states in a comment that the region-weighted burn-on-answer "is NOT wired yet." The only real token burn anywhere is the manpower-gig handshake (`consume_vendor_assets`, 2 tokens). So vendors answer inquiries for free — the core monetization the token packs + subscriptions are priced around does not run.

**Why it matters.** This is the platform's primary vendor-side revenue lever (0% commission means the burn + subs ARE the model). Every inquiry answered for free is unpriced supply-side value.

**Proposed design (implements the owner-locked 2026-06-05 ruleset — see `[[project_setnayan_vendor_token_model]]`).**
- Burn **1 idempotent unlock per (vendor, event)** when the vendor first **answers** an inquiry (replies / accepts) — covering ALL that vendor's services for that event. Customer never pays.
- Amount is the compressed **1-2-3 band = ₱100 / ₱200 / ₱300**, banded by the **wedding's** regional minimum wage (lowest-wage band ₱100 … Metro Manila ₱300). Store the region→band map in an **admin-editable** table (wages drift via wage orders; re-band only on threshold cross).
- Idempotency: a unique `(vendor_profile_id, event_id)` constraint on a `vendor_token_unlocks` ledger row; the burn RPC is a no-op on the second answer.
- 100 founder tokens + earn-by-recommend stay (16–33 free answers cushion new vendors).
- **Recommended add (owner-flagged, not yet locked):** auth-then-capture "ghost hold" — hold the tokens when the vendor replies, capture only when the couple replies back, release on ghost. Fixes the regressive-on-low-ticket concern for ALL vendors. Propose as a **phase 2** of this item.

**Owner decision needed.** (a) Ratify the exact band→region map + confirm it keys to the **wedding's** region (not the vendor's). (b) Burn at **answer** vs **accept** (the lock says answer = vendor carries conversion risk). (c) Ship the ghost-hold now or defer.

**Effort.** ~1 day. New migration (`vendor_token_unlocks` ledger + `token_burn_bands` admin-editable table + the idempotent `burn_vendor_unlock` RPC) + wire into `sendChatMessage`/`acceptInquiry` + an admin band editor under `/admin`. No calendar externals.

---

## 2 · Two-admin approval gate

**Gap.** 0023 §9.1 mandates a two-admin gate for major decisions (refunds, large comps, terminations). In code it **does not exist** — `comp_grants.approved_by` is always inserted `NULL`, there is no `admin_approval_requests` primitive, and every high-stakes action (refunds, large comps, vendor termination) is **single-admin**. The comp-grant action merely flags large grants in a success banner for "co-review."

**Why it matters.** Governance integrity + fraud resistance: a single compromised/rogue admin account can issue refunds or comps unchecked. It's the largest governance-integrity gap vs the architect mandate.

**Proposed design.**
- New `admin_approval_requests` table: `(id, action_type, payload jsonb, requested_by, status{pending|approved|rejected}, approved_by, decided_at)`.
- Gate the high-value actions behind it: a first admin **proposes** (writes a pending request instead of executing); a **second, distinct** admin approves → the action executes via the existing server action. Reuse the existing `requireAdmin` + the `emitNotification` fan-out to surface pending requests to other admins (now that `/admin/notifications` exists, they'll actually see them).
- Thresholds: refunds **≥ ₱X**, comp grants **≥ ₱Y**, any vendor/account termination. (X/Y owner-set.)

**Owner decision needed.** (a) The exact action list to gate. (b) The threshold amounts (X refunds, Y comps). (c) Whether terminations are *always* two-admin regardless of amount (recommended: yes).

**Effort.** ~1–2 days. 1 migration + a `/admin/approvals` queue + refactor 2–3 existing actions to the propose→approve shape. No calendar externals.

---

## 3 · Anti-fraud / fake-event termination surface

**Gap.** The owner-locked "zero-tolerance fake event → account termination, no 3-strike" rule (`[[project_setnayan_vendor_value_proposition_reviews]]`) has **no detection queue and no dedicated action**. The only termination path is the generic `/admin/users` delete + email blacklist, wired to nothing that flags event authenticity.

**Why it matters.** The vendor value prop ("every inquiry counts", reviews are event-bound, sync-outside = 1 review) is only credible if fake events can't farm reviews/stats. Without a surface, fraud is invisible until manually noticed.

**Proposed design.**
- A `/admin/fraud-review` queue fed by signals: events with reviews but no payment/order trail, duplicate device/email clusters on event creation, vendor-self-created events, abnormal review velocity per vendor.
- Outcomes: dismiss · warn · **terminate** (account + restart bar). Termination should route through the **two-admin gate (item 2)** given its severity — so this item composes with #2.
- Audit every decision to `admin_audit_log`.

**Owner decision needed.** (a) Which detection signals to start with (recommend the payment-less-review + device-cluster pair). (b) Termination authority — single admin or two-admin (recommend two-admin, i.e. depends on item 2). (c) Appeal path (reuse the help-center ticket flow?).

**Effort.** ~1 day for the queue + manual-termination action; detection signals can land incrementally. 1 migration (or a view) for the signal queries. No calendar externals.

---

## 4 · Chat moderation for real couple↔vendor threads

**Gap.** The only admin chat-write surface is `/admin/demo-vendors/inquiries`, **hard-gated to `is_demo=TRUE`** vendors. There is **no admin ability to read, flag, hide, or delete messages in real couple↔vendor threads**, and no report-message → admin-queue flow. Abusive/scam content in chat has zero admin recourse — and chat is the *only* two-way channel, so it's where off-platform-payment scams (an RA 11967 liability the platform repeatedly warns about) would actually happen.

**Why it matters.** Trust & safety on the single highest-traffic two-way surface. Also the natural enforcement point for the off-platform-payment caution.

**Proposed design (two layers; ship layer A first).**
- **A · Report-first (lower RA 10173 exposure):** a "Report" affordance on any message → writes a `chat_message_reports` row → `/admin/reports` queue. Admin sees the **reported message + minimal surrounding context only** (not the whole thread), and can hide the message + warn/suspend the sender. Least-privilege; defensible under data-minimization.
- **B · Full thread read (higher exposure):** admin can open any thread. Stronger for investigations but means admins can read private DMs — needs an explicit privacy stance + audit-logging every admin read.

**Owner decision needed.** (a) Layer A only, or A+B? (b) RA 10173 stance: is admin reading of private couple↔vendor messages acceptable, and under what logged justification? This is the load-bearing call — recommend **A only** for V1, defer B.

**Effort.** ~1–2 days for layer A (report affordance + `chat_message_reports` migration + `/admin/reports` queue + hide/warn actions). Layer B is a separate, heavier change.

---

## 5 · Vendor-unresponsive / ghosting escalation

**Gap.** Nothing tracks vendors who never reply to an inquiry. The `vendor_unresponsive_48h` template named in spec 0028 has **no emitter, no queue, no cron**. When a vendor ghosts a couple's inquiry, nothing surfaces to anyone — bad couple UX, and (once item 1 ships) the vendor may have burned a token for an answer the couple never got back, or the couple is stuck waiting.

**Why it matters.** Couple-side experience on the core funnel + fairness in the token economy (ghosting is the exact failure the auth-then-capture "ghost hold" in item 1 addresses from the vendor side; this addresses the couple side).

**Proposed design.**
- Detect threads where the couple's inquiry has had **no vendor reply for N hours** and: nudge the couple ("this vendor hasn't replied — here are similar matches", reusing the decline→alternatives strip), optionally auto-decline the stale inquiry, and surface a vendor-unresponsiveness signal to admin (feeds verification/demotion).
- **⚠ Architectural blocker:** detecting "no reply for N hours" is inherently time-based and wants a scheduler — but the project is **cron-free** (`[[project_setnayan_cron_free]]`): `/api/cron/*` endpoints are dormant. Options: (a) compute lazily on couple page-load (no scheduler, but only fires when the couple revisits); (b) compute via Next `after()` piggybacked on existing traffic; (c) owner relaxes the cron-free stance for this one job.

**Owner decision needed.** (a) The escalation action (nudge-only / auto-decline / token refund to the ghosted vendor's counterpart / admin signal — or a combination). (b) **The cron-free question** — accept lazy-on-load (recommended, zero infra) or authorize a scheduled job.

**Effort.** ~1 day for the lazy-on-load variant (no scheduler). A true scheduled sweep adds infra + reopens the cron-free decision.

---

## Notes

- Items **1, 2, 3** are mostly self-contained and high-value; **2 is the recommended first** (it's a prerequisite for doing 3's terminations safely).
- Items **4B and 5-with-scheduler** carry the open policy/architecture questions — keep them last.
- All five are vendor/admin-facing; none change the couple's "Start planning · free" promise.
