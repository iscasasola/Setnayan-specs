# Anti-Fraud System — DPO / Counsel Review Brief

> **For:** Indalecio Sacdalan Casasola II (DPO) + PH counsel · **From:** Setnayan engineering · **Date:** 2026-07-05
> **Decision needed:** sign-off (or conditions) before the identity-clustering + fraud-enforcement system goes live. Code is built and gated OFF pending this review. Companion: `Anti_Fraud_Trust_Integrity_2026-07-05.md` (full spec).

## 1. What the system does (plain English)
To keep the marketplace honest ("No fakes. No pay-to-win."), we detect vendors who fake their own trust signals — e.g. creating sockpuppet couple accounts to post fake 5★ reviews, or self-importing fake "delivered" events to inflate booking counts. Detection has three layers:
1. **Identity clustering** — group user accounts likely controlled by one actor.
2. **Signal scoring** — score vendors on five fraud patterns (review rings, account-creation bursts, isolated reviewers, unbacked import spikes, degenerate all-5★ curves).
3. **Enforcement** — a reversible auto-suspend at high confidence, then a human-confirmed permanent ban.

## 2. Personal data processed (for identity clustering)
Only what's needed to link one real person behind many accounts:
| Data | Source | Purpose |
|---|---|---|
| `device_hash` | `user_devices` | Same-device linkage |
| `address_normalized` | `users` | Same-address linkage |
| Payment sender reference | `payments.reference_number` | Same-payer linkage |
| `user_id`, review/event/account timestamps | core tables | Scoring the fraud patterns |

**Not used:** no biometric/face data, no chat/message content, no contact lists, no ad-profiling, no location beyond the vendor's stated city. IP is **not** captured today (noted as a future consideration, not built).

## 3. Safeguards already built in
- **Service-role only.** The cluster tables/views (`identity_clusters`, `user_identity_signals`) and fraud tables (`fraud_signals`, `fraud_enforcement_audit`) have RLS that **denies all access to `anon` and `authenticated`** — no vendor or couple can ever read who is clustered with whom.
- **Purpose-limited.** Used only for fraud prevention + the resulting enforcement. Not fed to marketing, ranking-for-sale, or ad targeting. Badges stay organic; paid boosts never touch eligibility.
- **Human-in-the-loop for the serious action.** The only automated action is a **reversible suspend** (profile hidden, badges frozen, **no data destroyed**). The **irreversible** wipe + permanent ban is **never automated** — it requires a human admin *and* a second admin's approval (four-eyes), with a typed confirmation and an evidence snapshot logged.
- **Appeal path.** A suspended/banned vendor can appeal through the help-center ticket queue for human re-review.
- **Data residency.** Stays in the production DB (Supabase, Singapore region).

## 4. Questions for sign-off (please answer yes / no / conditions)
1. **Legal basis** — Is **legitimate interest** (RA 10173) the correct basis for processing device/address/payment signals for fraud prevention, or do we need explicit consent and/or a specific clause in the vendor Terms + privacy notice?
2. **Automated measure** — Is the **reversible auto-suspend** (system-initiated, no data loss, human-reversible) acceptable as an automated step, given the permanent wipe/ban is human- and two-admin-gated? Any RA 10173 automated-decision concern?
3. **Disclosure** — Must we describe this anti-fraud processing in the **privacy notice / vendor T&C**? If yes, we'll draft the clause for your approval.
4. **Retention** — How long may we keep (a) `fraud_signals` + cluster links for active vendors, and (b) the **evidence snapshot on a banned vendor** (needed for appeal + audit)? Propose a period.
5. **Appeal sufficiency** — Is the **help-center ticket appeal + human re-review** an adequate safeguard/right-to-contest?
6. **Anything else** you'd require as a condition of go-live.

## 5. Go-live gate
Nothing in this system is enabled in production until (a) this DPO/counsel sign-off is on file, and (b) the owner has reviewed the enforcement surface. This brief + your written answers become the record.
