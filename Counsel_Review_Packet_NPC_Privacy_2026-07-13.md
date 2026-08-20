# External Counsel Review Packet — NPC Privacy Filing

**To:** External Philippine data-privacy counsel
**From:** Setnayan — Data Protection Officer (Indalecio S. Casasola II · dpo@setnayan.com)
**Date:** 2026-07-13
**Re:** Pre-filing legal sign-off on Setnayan's NPC registration + privacy-compliance dossier

---

## 1. What we're asking for

We have prepared a DPO-level privacy-compliance dossier and want your **sign-off before we lodge it with the National Privacy Commission (NPC)**. This is not a request to draft from scratch — the documents are complete and reconciled to the as-built product. We need a lawyer to **confirm the legal bases, ratify the retention periods, resolve four specific questions below, and flag anything that must change before filing.**

Setnayan is a Philippines-first event-planning platform operated by **SETNAYAN SOFTWARE DEVELOPMENT SERVICE**, a DTI-registered sole proprietorship (the proprietor is both the Personal Information Controller and the DPO). Governing law: **RA 10173 (Data Privacy Act of 2012)**, its IRR, and NPC issuances.

## 2. Documents attached (review set)

| # | Document | What it is |
|---|---|---|
| A | `NPC_Privacy_Compliance_Dossier_2026-07-12.md` (**v2.0**) | The master dossier — full ROPA (18 processing activities), device-fingerprint PIA, sensitive-PI declaration, subprocessors, security measures. **Start here.** |
| B | `Data_Retention_Schedule_2026-07-11.md` | Per-class retention schedule; periods marked *(counsel)* await your ratification |
| C | `01_Contracts/Setnayan_Privacy_and_Security_Policy.md` | The binding public policy (amended 2026-07-13) |
| D | `NPC_Compliance/` pack | Deeper filing set — Privacy Manual, full RoPA, DPO Designation + NPCRS data sheet, Breach Policy, DPIA register, Face-Vector DPIA, Anti-Fraud DPIA |
| E | `Device_Fingerprint_Data_Use_DPO_Review_2026-07-12.md` | DPO one-pager for the (dormant) fraud device-hash |
| — | `Privacy_Reconciliation_Home_and_Data_Flows_2026-07-13.md` | Background: how the dossier was reconciled to the shipped product (context, not for sign-off) |

## 3. The four sign-off items

### Item 1 — Minors' data & sensitive personal information (the priority question)

**Facts.** The product processes, in production, the following sensitive/§ 3(l) categories:
- **Self-profile (adults):** religion, civil status, gender — optional, opt-in, per-field consent timestamp.
- **Dependents (a generic list — person, pet, or anything):** the feature is *not* a minors registry; a `dependent_kind` (person / pet / other) discriminates it. Only a **person** dependent may carry **name, birth date, sex, religion** (guardian-consent timestamps); pets/other carry no sensitive data. When a person-dependent is a **child**, a household model lets a **spouse account read a shared child's record**, retained after separation/annulment for co-parenting. So minors' SPI is a **conditional sub-case of the person kind**, not the table's purpose — but it can occur.
- **Event honoree data (christening / gender reveal):** a **child's birth date + gender**, and a **pregnancy expected due-date** (health-adjacent) — entered by the account holder into the event record, currently **without a separate per-field consent timestamp** (documented as-is; see dossier § 3 row 4 and § 11 item 6).
- **Godparents:** name + **email of a third party**, who may receive godchild-birthday reminders.

**Current position.** We rely on **§ 13(a) consent** — self-consent for adults, **guardian consent** for a minor's attributes — plus § 12(b) contract for event delivery.

**We need you to confirm / advise:**
1. Is **guardian consent** a sufficient and valid basis under RA 10173 § 13 for processing a minor's SPI (birth date, sex, religion) in this consumer product, and are any additional safeguards or a DPIA required?
2. Is the **honoree path acceptable without a per-field consent timestamp**, or must those fields be gated/instrumented before filing?
3. Are the **household spouse-share** and **post-separation retention** of a child's record defensible, and how should they be disclosed?
4. Please approve the corrected wording for the binding policy's **§ A.5**, which currently still reads *"data about minors is not processed"* (now inaccurate — flagged, not yet rewritten).

### Item 2 — Vendor identity & AML/sanctions screening

**Facts.** Vendor onboarding collects **government ID, business permits (DTI / BIR 2303 / Mayor's Permit), a liveness selfie, and an AMLC / PEP sanctions-screening result.** Verification-audit records are retained **7 years cold**. Automated verification (Persona) is **staged, not yet live** — documents are currently reviewed by our team.

**We need you to confirm / advise:** the correct legal basis for the gov-ID + sanctions/PEP screening (we currently cite § 12(b)/(c)/(f) and § 13(d) AMLA compliance), the **7-year retention** adequacy, and whether the AMLC/PEP screening triggers any additional AMLA / registration obligation for a marketplace platform of our type.

### Item 3 — Retention periods + one known deletion gap

**Facts.** Retention (schedule B) is **not one period** — it differs by class, and the media rule changed after this packet was first drafted:

- **Media (Papic photos + clips) — NO DELETION AT ANY POINT.** The full-resolution original is held **6 months from the event's first capture**, floored at **3 months after the event ends**, then **replaced by a compressed web copy**; that compressed copy is retained on the couple's gallery **free, for life** (owner ruling 2026-08-18, superseding an earlier five-year window and its never-built paid tier). Only the *resolution* ever changes — no photo is deleted. Dossier (A) § 8 states this; **please read A as authoritative over any earlier five-year wording.**
- **Event data + in-app chat:** **5 years** from the event date *(counsel)*.
- **Facial-geometry vectors:** auto-expire per event at ~5 years; the account-level face profile is governed by account deletion, not that clock.
- **Payment records / Official Receipts:** **10-year statutory floor** (BIR RR 17-2013; contracts under Civil Code Art. 1144).

⚠ **This section was corrected on 2026-08-20.** As originally drafted it told you media carried the same 5-year default as chat, which the product no longer does — please disregard any copy of this packet that says so.

**Known gap:** an account **hard-delete does not yet purge chat-message PII** (schedule B § 4; dossier § 3 note).

**We need you to confirm / advise:** ratify the *(counsel)*-marked periods, and advise whether the **chat-PII-on-deletion gap is a compliance defect that must be remediated before filing** (we can prioritize the fix) or a tracked remediation acceptable to disclose.

### Item 4 — NPC registration threshold + overall attestation

**We need you to confirm / advise:** whether Setnayan meets the **NPC registration threshold** (sensitive PI is processed — biometric, religion, minors' data, gov-ID — which we believe triggers registration), any conditions specific to a **sole proprietorship** registrant, and provide your **overall attestation** that the dossier (A) and binding policy (C) are fit to file, subject to the changes you direct.

## 4. What is already settled (context, so you don't re-open it)

- **Public privacy notice** — updated 2026-07-13 to disclose faith/family/honoree/e-gift processing; already carried opt-in biometric + device-identifier sections. Wording refinements welcome but coverage is complete.
- **Device fingerprint** — built but **flag-OFF / dormant** (collects nothing); activation is DPO-gated and pre-disclosed.
- **DPO contact + SLA** — standardized to `dpo@setnayan.com` · 15 business days across all surfaces.
- **Payments** — Setnayan holds/moves **no money**; e-gift stores display-only receiving handles with no amount or ledger.

## 5. How to return this

Please return your review as (a) a **go / no-go** on filing, (b) **required changes** keyed to the item numbers above, and (c) any **retention periods** you cannot ratify as written. We will apply changes to documents A–C and re-issue for a final short confirmation before lodging with the NPC.

---

**Prepared by (DPO):** _______________________ (Indalecio S. Casasola II) — dpo@setnayan.com · 2026-07-13
**Counsel sign-off:** _______________________ Date: __________
