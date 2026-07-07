# Setnayan — NPC / RA 10173 Compliance Documentation Pack

**Date assembled:** 2026-07-05
**PIC:** SETNAYAN SOFTWARE DEVELOPMENT SERVICE (sole proprietorship of Indalecio S. Casasola II · DTI Business Name No. 8297508)
**DPO:** Indalecio Sacdalan Casasola II · [TO CONFIRM — DPO email]
**Status:** **DRAFT — filing-ready, NOT yet filed.** Every document is built to a compliant RA 10173 / NPC baseline ahead of counsel. For DPO (the owner) + PH counsel finalization, then filing/keepsake. **Not a substitute for legal review.**

---

## What this pack is

The formal records a Personal Information Controller keeps on file and uses to register with the **National Privacy Commission (NPC)** under the Data Privacy Act of 2012 (RA 10173). This is your **keepsake + filing set**.

| # | Document | Purpose |
|---|---|---|
| 01 | **Privacy Manual** | The flagship RA 10173 governance document (present to NPC on request) — 12 sections: scope, definitions, governance + security, principles, lifecycle, the 8 data-subject rights, consent, sub-processors/cross-border, breach, DPIA, complaints, versioning |
| 02 | **Records of Processing Activities (RoPA)** | Data-processing-systems inventory (11 systems) + the NPC-registration threshold analysis |
| 03 | **DPO Designation + NPC Registration data sheet** | The owner's formal DPO appointment record (PIC = DPO) + the field-by-field data to complete NPC registration |
| 04 | **Data Breach Management Policy** | Per NPC Circular 16-03 — 72-hour rule, response team, notification, breach register |
| 05 | **DPIA Register + Person-Graph DPIA** | Impact-assessment register + one completed DPIA (person graph); flags what still needs one |

All five carry the same DRAFT header and the "compliant baseline, not a substitute for legal review" footer.

## How to actually file (this pack is the content, not the filing)

1. **Fill in the `[TO CONFIRM]` facts** below (one pass supplies them across all docs).
2. **You review & adopt as both PIC and DPO** — sign the designation + manual; set the effectivity dates. (PH counsel to review before publishing any policy text.)
3. **Register with the NPC online** via the **NPC Registration System (NPCRS)** at `register.privacy.gov.ph` — this registers the PIC, the DPO's contact details, and the Data Processing System(s). *(This online filing is the DPO/owner's action — I can't file on your behalf.)*
4. **Keep the adopted set as your accountability records** (the "keepsake"); update on the review cadence in the Manual.

## Master list — facts you must supply (`[TO CONFIRM]`, 98 occurrences → these distinct items)

**Business identity**
- Registered / principal place of business address
- BIR TIN / Form 2303 number
- Existing NPC PIC + DPO registration number (after you file)

**Scale (required registration fields)**
- Total headcount / employees (and how many have access to personal data)
- Number of data subjects — customers, vendors, guests (approx.)
- Number of data subjects whose **sensitive** personal info you hold

**DPO (the owner) details**
- Contact email · mobile/landline · designation effectivity date · **the PIC = DPO conflict-of-interest note** (the proprietor also serves as DPO — record a short independence rationale; NPC generally prefers DPO autonomy from the controller, but this is commonly accepted for a 2-person sole proprietorship)

**Data Breach Response Team**
- Names for: Technical/Engineering Lead · Security/Ops Coordinator · Comms/Legal liaison (external PH counsel) · the 24/7 escalation phones + email · the DPO breach hotline number

**Sub-processors (jurisdiction + executed DPA on file)**
- Vercel · Resend (+ SendGrid fallback) · Suno · PostHog (host + opt-out) · the face-matching engine host/location
- ⚠ **Suno is not in the Privacy Policy's sub-processor table** — add it (or confirm it processes no personal data)

**Processing specifics**
- Exact RSVP special-data fields (dietary/health/religious?) — decides whether the guest system is a formal sensitive-PII system
- Automated-decision inventory: the Anti-Fraud auto-suspend (DPS-12 / R-08) **is** a solely-automated decision with a significant effect (reversible); confirm the RA 10173 §16(c)/§34 contest/appeal path is documented
- Maya Business (V1.5 payment gateway) contract status
- Personnel controls: signed NDAs on file · privacy-training cadence · device/endpoint policy
- DPIA review + sign-off dates

## Two things flagged for your attention

1. **Biometric face vectors likely need their own dedicated full DPIA.** The person-graph DPIA (doc 05, Part 2) is complete, but face-vector processing is sensitive (biometric) and is flagged as needing a *separate* HIGH-risk DPIA — not folded into the person-graph one. Worth doing before scaling that feature.
2. **Publish order:** the **Privacy Policy amendment** (person-graph, in `01_Contracts/`) and doc 05's person-graph DPIA should be **finalized with the DPO (owner) + PH counsel before the amendment goes public** — the features are live behind flags, but the public policy text publishes on sign-off.

## Companion documents (outside this folder)
- `01_Contracts/Setnayan_Privacy_and_Security_Policy.md` — the binding public policy (now with the 2026-07-05 person-graph amendment)
- `03_Strategy/Compliance_Pack_PersonGraph_DRAFT_2026-07-05.md` — consent notices + the source person-graph DPIA
- `03_Strategy/Phase2_Counsel_Review_Brief_2026-07-05.md` + `Phase3_Minors_and_Legacy_Counsel_Brief_2026-07-05.md` — the two counsel briefs (for the DPO/owner + PH counsel)

---

*Prepared to a compliant baseline ahead of counsel per the standing compliance-by-default rule. Finalize with Indalecio Sacdalan Casasola II (DPO) + PH counsel before filing/publishing.*
