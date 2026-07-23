# NPC / RA 10173 — Coordinator Delegated-Access Processing Addendum

**Date:** 2026-07-22
**PIC:** SETNAYAN SOFTWARE DEVELOPMENT SERVICE — sole proprietorship of Indalecio Sacdalan Casasola II · DTI BN Reg. No. 8297508
**DPO:** Indalecio Sacdalan Casasola II · iscasasolaii@gmail.com
**Status:** **DRAFT — filing-ready baseline, NOT a substitute for legal review.** For DPO (owner) + PH counsel finalization, then folding into `NPC_Compliance/02_Records_of_Processing_Activities` + `05_DPIA_Register`.
**Purpose:** Records the *new processing* introduced by the **Coordinator / Wedding-Planner delegated-access** feature (consent gate + consent-scoped money authority + prep-then-release schedule staging — all ACTIVE in production via the `/admin/data-privacy` control board) so the RoPA and DPIA Register stay complete ahead of NPC filing. This addendum exists because the `/admin/data-privacy` **Coverage & drift** panel flags `coordinator_consent_money` + `coordinator_prep_release` as **"Live but not declared."** Cross-refs: `Coordinator_Role_Feature_Spec_2026-07-18.md`, `Coordinator_Whats_Next_2026-07-18.md`, `Privacy_Reconciliation_Home_and_Data_Flows_2026-07-13.md`.

> **⚠ Do NOT flip the code coverage map to "declared" yet.** The `/admin/data-privacy` panel stays **RED** for these two controls until counsel actually folds these rows into the filed RoPA/DPIA. Marking `lib/privacy-coverage.ts` `declaredIn` green before that would be false assurance — exactly what the panel is built to prevent. This doc is the artifact counsel incorporates; the green flip is a follow-up code change made *after* incorporation.

---

## 0. Posture (the interpretive lens)

A **coordinator / wedding planner is a third party the couple deliberately invites** into their own event to help plan it. The couple is the practical data controller of their event's guest data; the coordinator is a **recipient** the couple chooses. Access is **never automatic and never silent**:

- It is **invite-based** — the couple promotes the coordinator (Hosts page), the coordinator **accepts** at `/host/accept`, and only then gets an `event_members` row. Booking a coordinator does **not** by itself grant access.
- It is **consent-gated and fail-closed** — when the `coordinator_consent_money` Data Privacy control is ACTIVE (admin-approved, recorded `approved_by/at`), an invite requires the couple's recorded data-privacy consent, and the couple's optional money-authority scopes are **default-OFF**.
- It is **revocable and audited** — removal / invite-revocation / decline all stamp `revoked_at` on the consent row; delegate writes are audit-logged (`log_delegate_write`).

**Consequence:** the heightened item is that the coordinator sees **guest PII (third parties)** and may be granted **payment-submission authority**. Both ride on **consent + the account/booking contract**, with proportionate, fail-closed controls. The lawful-basis question for counsel (§ 3) is whether the couple's consent + the event's existing guest-consent chain suffices to share guest PII with this chosen recipient, or whether an added notice/recipient-category disclosure is required.

---

## 1. New processing activities (RoPA rows — continue the pack's R-## sequence; last used R-13)

| # | Processing activity | Data subject(s) | Data categories | Proposed lawful basis (counsel to confirm) | Sensitive trigger | Inherent risk | Residual (after built controls) |
|---|---|---|---|---|---|---|---|
| **R-14** | **Coordinator delegated planning access + data-privacy consent** — the couple invites a coordinator (`event_moderators` role `wedding_planner_external`) as an event host; on acceptance the coordinator can read/edit the event's guest list, seating chart, and schedule to plan the event. The couple's consent to this PII share is recorded in `coordinator_access_consents` (invite time), incl. the coordinator's email/label and scope grants. | **Guests (third parties)** + the couple | Guest names, contact, RSVP status, dietary/allergen notes, table/seat assignment; event schedule blocks; couple's plan data | **Consent** of the couple (controller of their event) + the coordinator's booking/account contract; guest PII shared under the event's **existing RSVP consent chain**, with the coordinator as an added recipient | None inherent (ordinary PII; no biometrics — face/gallery access is NOT part of the coordinator grant) | **MED** (third-party access to guests' contact + dietary PII) | **LOW** — invite-based + accept-required; consent-gated (admin-approved control, fail-closed default); per-invite recorded consent; **revocable** (`revoked_at` on remove/revoke/decline, all 3 paths wired); scoped per-surface grants (budget default OFF); coordinator adds vendors **only from own favorites, never marketplace search** (anti-steering); delegate writes audit-logged |
| **R-15** | **Consent-scoped coordinator money authority (optional)** — when, and only when, the couple grants the optional `vendor_lock` / `checkout` scopes at invite time, the coordinator may finalize (lock) vendors and handle the payment *process* (submit orders, upload payment proof, record vendor deposits) on the couple's behalf | The couple; vendors | Order + payment-reference metadata (reference codes, amounts, proof screenshots the couple/coordinator upload); vendor booking status | **Consent** (explicit scope toggles, **default OFF**) + contract | None | **MED** (payment-adjacent delegation to a third party) | **LOW** — scopes **default-OFF**; money wall enforced **fail-closed at all 5 sites** (checkout submit · order create · payment-proof log · vendor lock · vendor deposit) via `coordinatorMoneyScopeAllowed`; **no funds held by Setnayan** (0% commission, off-platform settlement); silent auto-grant **suppressed** while the control is active (PR #3537) so no money-capable delegate exists without recorded consent |

**Prep-then-release schedule staging (`coordinator_prep_release`)** is **not a new RoPA row** — it processes no new data category. It is a **visibility control within R-14**: the coordinator drafts schedule blocks as `coordinator_only` and later `release`s them to `couple_visible`. It is listed as a distinct control on the board only because it is independently activatable. It **lowers** guest/couple exposure (draft plans aren't shown until released) and is captured under R-14's controls + the DPIA note below.

---

## 2. Privacy-by-design controls already built (evidence for the residual-risk column)

Verified in shipped code this session:
- **Activation governance:** both controls live behind the admin-approved `data_privacy_controls` board (`coordinator_consent_money`, `coordinator_prep_release`), seeded **inactive / fail-closed**; approving records `approved_by/at` as the permanent RA 10173 audit trail; features read `status='active'` (no env flag, no redeploy).
- **Consent surface + record:** `hosts/_components/consent-gated-invite-form.tsx` (checkbox-gated, covers both invite entry points); server enforce + record in `inviteHost`; consent stored in `coordinator_access_consents` (RLS at create, canonical Pattern B) with `scope_version` + `scopes` JSON (money toggles default-OFF).
- **Revocation loop:** `revoked_at` stamped on **all three** exit paths — host removal (`removeHost`), pending-invite revoke (`revokeHostInvite`), invitee decline (`declineHostInvite`).
- **Money wall:** `coordinatorMoneyScopeAllowed` enforced fail-closed at all five money-adjacent coordinator surfaces; couple always allowed, coordinator only with an un-revoked consent row granting the scope, everything else denied.
- **Auto-invite fail-closed:** when the consent control is active, `autoInviteCoordinator` (downpayment side-effect) **suppresses itself** — no PII-sharing delegate is created without a couple consent moment (PR #3537).
- **Data minimisation / anti-abuse:** coordinator adds vendors only from own vetted favorites (no marketplace steering); budget visibility default OFF (couple-raiseable to view only); prep-then-release hides draft schedule from couple/guests until released; delegate writes audit-logged (`log_delegate_write`); the coordinator grant carries **no face/biometric/gallery access**.

---

## 3. Decisions still requiring DPO (owner) + PH counsel — the filing-gate items

**(a) Lawful basis to share GUEST PII with the invited coordinator (the primary question).** Guests are third parties. The event already collects guest data + consent at RSVP for the purpose of running the event; the coordinator is a **recipient the couple chooses** to run that same event. Counsel to confirm: does the couple's consent + the existing RSVP consent chain suffice to disclose guest contact/dietary/seating PII to this recipient, or must (i) "coordinator / third-party planner" be added as a **recipient category** in the Privacy Notice, and/or (ii) a short notice be given to guests? *(Assessment: proportionate and expected — a planner seeing the guest list is the norm — but the recipient-category disclosure is the likely minimum.)*

**(b) The money-authority delegation (R-15).** Confirm the **default-OFF consent-scope toggles** (`vendor_lock`, `checkout`) are a sufficient basis for the couple to delegate payment-submission to the coordinator, given Setnayan holds no funds (0% commission, off-platform settlement) and the money wall is fail-closed. DPO to ratify the **provisional owner-as-DPO approval** that activated `coordinator_consent_money` in production (reversible by un-approving the control); external counsel review still recommended before treating it as permanent.

**(c) Coordinator as a personal-information processor/controller — instrument it.** A coordinator handling guest PII (and possibly payments) should be bound by a **data-sharing / processing undertaking** (confidentiality + purpose limitation + no onward disclosure). Counsel to decide whether an in-app coordinator undertaking (accept-time click-through) is adequate or a signed DPA is required.

**(d) Retention.** Set the retention class for `coordinator_access_consents` (the consent + revocation audit) and the delegate audit log — align to the binding policy's retention floor. `revoked_at` preserves the audit; confirm how long revoked rows are kept.

---

## 4. Net effect on NPC filing

This addendum adds **no new HIGH-risk system**. R-14/R-15 are **MED inherent → LOW residual** ordinary-PII processing under consent + contract, with built, fail-closed, revocable, audited controls; the coordinator grant deliberately **excludes** biometrics/gallery. The filing-gate items are the **recipient-category disclosure (§ 3a)** and the **coordinator undertaking (§ 3c)** — a Privacy-Notice wording change + a click-through/DPA, not an architecture change.

**Suggested DPIA Register line (`05_DPIA_Register`):** *"Coordinator delegated access & consent-scoped money authority"* — inherent MED, residual LOW after controls (consent-gated, default-OFF money scopes, fail-closed money wall, revocation loop, no funds held); DPO + counsel to ratify §§ 3(a)–(d).

**Owner action:** review §§ 0 & 3 as DPO; route § 3(a)–(d) to PH counsel; then fold **R-14/R-15** into `02_Records_of_Processing_Activities` + add the DPIA line to `05_DPIA_Register`; **then** (and only then) update `apps/web/lib/privacy-coverage.ts` so `coordinator_consent_money` + `coordinator_prep_release` point `declaredIn` at the filed RoPA/DPIA and the coverage panel goes green.

*Prepared as a compliant baseline for DPO + counsel finalization. Not legal advice.*
