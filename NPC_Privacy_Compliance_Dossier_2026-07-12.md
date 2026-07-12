# Setnayan — Privacy Compliance Dossier

### For submission to the National Privacy Commission (NPC), Republic of the Philippines

> **Status: DPO-prepared DRAFT — pending final legal review before filing.** This dossier is prepared by the Data Protection Officer to support NPC registration and to serve as Setnayan's Records of Processing Activities (ROPA) and Privacy Impact Assessment (PIA). It is reasoned from RA 10173 (Data Privacy Act of 2012), its IRR, and NPC issuances. It is **not legal advice**; the Personal Information Controller should have it reviewed by external counsel before submission.
>
> **Prepared:** 2026-07-12. **Version:** 1.0. **Governing law:** RA 10173 + IRR + NPC Circulars.

---

## 1. Personal Information Controller (PIC) and Data Protection Officer (DPO)

| Field | Detail |
|---|---|
| **Registered business name** | SETNAYAN SOFTWARE DEVELOPMENT SERVICE |
| **Legal form** | Sole proprietorship (DTI-registered 2026-06-25, national scope) |
| **PIC under RA 10173** | The proprietor. A sole proprietorship has no legal personality separate from its proprietor, so the proprietor is the Personal Information Controller. |
| **Data Protection Officer** | The proprietor (Indalecio S. Casasola II), serving the DPO function directly |
| **DPO contact** | dpo@setnayan.com |
| **Data subject response SLA** | 15 business days |
| **BIR registration** | Under the proprietor's existing TIN |
| **NPC registration** | To be filed under the registered business name |
| **Public privacy notice** | Published at `setnayan.com/privacy` (effective 2026-05-13; last updated 2026-07-12) |

---

## 2. Description of the Data Processing System

**Setnayan** is a Philippines-first life-events platform (V1 surface: weddings). It provides three role-routed doorways:

- **Couples/customers** plan an event end-to-end (guest lists, vendors, budget, schedule, invitations, media galleries).
- **Vendors** run a business profile and receive inquiries.
- **Administrators** (the Setnayan team) run operations and integrity/fraud review.

Personal data is processed to deliver the planning service, to enable couple↔vendor communication, to process in-app payments, and to protect the marketplace from fraud. Processing is web-based; data resides with the subprocessors in §7.

---

## 3. Records of Processing Activities (ROPA)

Personal data categories, purposes, legal bases, and retention. Retention detail is maintained in the companion **Data Retention Schedule (2026-07-11)**; periods marked *(counsel)* await external ratification.

| # | Data category | Data subjects | Purpose of processing | Legal basis (RA 10173) | Retention |
|---|---|---|---|---|---|
| 1 | **Account / profile** — email, hashed password, display name, optional phone, profile photo | Couples, vendors, admins | Account creation + authentication; deliver the service | § 12(a) consent; § 12(b) contract | Life of account + 30–90-day tail, then purge |
| 2 | **Event data** — guest lists, vendor records, budget items, schedule, mood-board palettes | Couples (and guests they enter) | Deliver event-planning features the user is paying for | § 12(b) contract | 5 years from event date *(counsel)* |
| 3 | **In-app messages** — couple↔vendor chat | Couples, vendors | Enable coordination between parties | § 12(b) contract | 5 years from event date *(counsel)* |
| 4 | **Payment metadata** — order amounts, reference codes, channel, payment-proof screenshots | Paying users | Process + reconcile in-app payments; issue Official Receipts | § 12(c) legal obligation (NIRC/BIR) | **10 years** — legal floor (BIR RR 17-2013) |
| 5 | **Contracts + e-signatures** | Couples, vendors | Vendor engagement records | § 12(c) legal obligation; Civil Code Art. 1144 | **10 years** — legal floor |
| 6 | **Biometric — facial-geometry vectors** *(sensitive personal information)* | Guests/users who opt in (adults 18+) | Optional automatic photo-matching within a single event | § 13(a) **explicit opt-in consent**, timestamped at enrolment | Per-event only; revocable on request; purged with media (≤5y) |
| 7 | **Device identifier** — one-way hashed, first-party per-browser id | Signed-in users | **Fraud prevention** — detect fake / duplicate / sock-puppet accounts | § 12(f) **legitimate interest** (fraud prevention + protecting vendors) | Life of account; rolling-prune device rows unused > 24 months *(counsel)* |
| 8 | **Automatic technical data** — IP address (truncated to first 3 octets for QR-scan events), browser user-agent, timestamps | Site visitors | Security, abuse-prevention, service operation | § 12(f) legitimate interest | Provider default / with related record |
| 9 | **Product analytics** — page views, clicks, funnel events (PostHog; no personal identifiers) | Site visitors | Product improvement | § 12(a) consent (opt-out in profile); anonymized/aggregate = outside § | Provider default |
| 10 | **Error/diagnostic logs** — stack traces (Sentry; no message bodies, payment details, or guest data) | N/A (no PII by design) | Bug diagnosis + reliability | § 12(f) legitimate interest; data-minimization | ≤ 90 days |
| 11 | **Marketing consent / communication preferences** | Couples, vendors | Proof of consent; honor preferences | § 12(a) consent | Life of account + audit tail |
| 12 | **Support tickets** | Users who contact support | Handle support requests | § 12(b)/(f) | 2 years |

**Right-to-erasure interaction:** an account-deletion request deletes the subject's personal data **except** records under a legal-hold floor (rows 4 & 5 — payments and contracts), which are retained under the legal-obligation basis for the statutory period and then disposed of. This carve-out is disclosed in the privacy notice.

---

## 4. Privacy Impact Assessment — Device-Fingerprint Capture (fraud prevention)

A PIA of the **newest and most scrutiny-worthy** processing activity (ROPA row 7). Built into the platform but **switched OFF behind a feature flag**; it collects nothing until the DPO authorizes activation.

### 4.1 What is processed and why
To protect couples and vendors from coordinated fraud (a single bad actor — often a competing vendor — spinning up many fake couple accounts to spam a vendor's inbox or drain the token a vendor spends to answer an inquiry), Setnayan must recognize when several "different" accounts are in fact the **same device**. On a signed-in session, the browser generates a **random identifier** stored in local storage; it is transmitted to Setnayan's server and **one-way hashed (SHA-256 with a server-side salt)**. Only the hash is stored, against the account. Two accounts sharing a device produce the same hash, which lets the existing fraud-clustering logic **flag them for human review** — it never auto-bans anyone.

### 4.2 Necessity and proportionality
- **Necessary:** vendors are charged per inquiry; fake inquiries are a direct, quantifiable financial harm, and account-level signals alone cannot detect one actor behind many accounts.
- **Proportionate / least-intrusive:** the signal is a **random id**, deliberately **not** a behavioral or biometric fingerprint (no canvas/font/WebGL probing) and uses **no third-party tracking SDK**. It identifies a *browser*, not a person's activity, and is never used for advertising, personalization, or cross-site tracking.

### 4.3 Legal basis
**Legitimate interest** under § 12(f): preventing fraud and protecting the marketplace and its vendors. Balancing test — the intrusion is minimal (a fraud-only pseudonymous hash), the interest is substantial, and the practice is disclosed. The data is **not** sensitive personal information.

### 4.4 Risks and mitigations
| Risk | Mitigation |
|---|---|
| Re-identification of an individual | Value is a **one-way hash of a random id** (raw value never stored); pseudonymous; no linkage to browsing behavior |
| Function creep (used beyond fraud) | **Purpose limitation** enforced in code + policy; used only for identity-cluster fraud review; never sold or shared |
| Over-collection | **Signed-in accounts only**; one hash per (account, device) + a last-seen timestamp; **no IP stored** for this signal |
| Data-subject unawareness | Disclosed in the public privacy notice **before** activation (published 2026-07-12) |
| Unlawful retention | Retention clock (life of account; rolling-prune > 24 months); included in data export; deleted on account deletion |
| Activation without oversight | **Flag-gated OFF**; activation requires DPO sign-off; fully reversible from a single toggle |

### 4.5 Residual assessment
With the above controls, residual privacy risk is **LOW**. The DPO's activation decision + a privacy-notice update are the remaining gates.

---

## 5. Sensitive Personal Information — biometric (facial recognition)

Optional photo-matching may process facial-geometry vectors (ROPA row 6). Processed only: (a) with **explicit, timestamped opt-in consent**; (b) for **adults 18+**; (c) **scoped to a single event** — never reused across events, never sold or shared for advertising. Consent is withdrawable at any time, which **permanently deletes** the face vector and enrolled selfie. Users who never enrol provide no biometric data. This satisfies § 13 (sensitive personal information processed on the basis of consent) and the NPC's guidance on biometrics.

---

## 6. Data Subject Rights (RA 10173 § 16)

Setnayan honors the rights to be **informed, access, object, rectify/correct, erase or block, data portability, and to lodge a complaint / claim damages**. Operationally:

- **Access + portability:** a self-service "download my data" export (iteration 0025).
- **Erasure/blocking:** soft-delete → hard-delete of account data, subject only to the legal-hold carve-out (§ 3).
- **Objection/withdrawal:** analytics opt-out toggle; face-recognition consent revocation (deletes the vector); marketing-preference controls.
- **Correction:** profile/settings self-edit.
- **Complaints:** routed to the DPO at dpo@setnayan.com; **15-business-day** response SLA; the data subject retains the right to complain to the NPC.

---

## 7. Subprocessors and Cross-Border Transfers (§ 21)

Setnayan uses the following subprocessors. Cross-border transfers rely on § 21 and each provider's adequacy/contractual commitments.

| Subprocessor | Function | Location |
|---|---|---|
| Supabase | Database + authentication | Singapore |
| Vercel | Web application hosting | United States |
| Cloudflare | CDN + R2 object storage (media) | APAC / PH-region buckets |
| Resend | Transactional email | United States |
| Sentry | Server-side error monitoring (stack traces only, no PII) | United States |
| PostHog Cloud | Product analytics (opt-out available; no personal identifiers) | United States |
| Anthropic | AI features (when used) | United States |
| Google LLC | Google Drive / YouTube (only when the user connects the optional integration) | United States |

**Not active:** third-party identity-verification providers (e.g., Persona, Veriff, Onfido) are a **stub only** — no personal data flows to them; the privacy notice will be updated before any such provider begins processing.

---

## 8. Organizational, Physical, and Technical Security Measures

- **Access control:** database Row-Level Security (RLS) on all tables (enabled at table creation); role-scoped access; two-admin approval gates for major administrative decisions.
- **Cryptographic controls:** passwords hashed; the device identifier is a **one-way salted hash** (raw value never stored); transport over TLS.
- **Data minimization:** analytics carry no personal identifiers; error logs exclude message bodies, payment details, and guest data; IP truncated to 3 octets for QR-scan events.
- **Content safety:** an NSFW filter is on by default and cannot be disabled.
- **Confidentiality by design:** vendor identity masking (a vendor sees only the couple's event display name + date, never their email or personal name unless shared).
- **Residency:** database in Singapore; media in PH-region object-storage buckets.
- **Breach response:** the DPO coordinates assessment and any NPC + data-subject notification within the periods required by the NPC's breach rules.

---

## 9. Compliance Statement

Setnayan processes personal data under RA 10173 on the bases recorded in § 3, with retention bounded on both ends (RA 10173 storage-limitation as the maximum; BIR/Civil Code statutory floors as the minimum for financial and contractual records). Data subject rights are implemented and honored; sensitive personal information (biometric) is processed only on explicit consent; the fraud-prevention device identifier is minimized, pseudonymized, disclosed, and DPO-gated. The DPO is the proprietor and is the point of contact for the NPC and for data subjects.

**Prepared by (DPO):** _______________________  (Indalecio S. Casasola II) — dpo@setnayan.com

**Date:** 2026-07-12

---

## Appendix — companion documents

- `Device_Fingerprint_Data_Use_DPO_Review_2026-07-12.md` — DPO one-pager for the device-fingerprint processing.
- `Data_Retention_Schedule_2026-07-11.md` — full per-class retention schedule + `[PENDING COUNSEL]` items.
- Public privacy notice — `setnayan.com/privacy`.
- `[[dpo-designation-owner]]` — DPO designation record.

> **Open items before filing:** (1) external counsel review of this dossier + the retention periods marked *(counsel)*; (2) DPO sign-off + activation decision on the device-fingerprint feature; (3) confirmation of the NPC registration threshold applicable to the business.
