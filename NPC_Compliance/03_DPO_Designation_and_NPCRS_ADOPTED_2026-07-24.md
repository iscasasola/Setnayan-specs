# DPO Designation & Accountability Record + NPC Data Processing System Registration Data Sheet

> **ADOPTION-READY · 2026-07-24.**
>
> This single document holds two related RA 10173 (Data Privacy Act of 2012) filing records for **Setnayan**:
> **Part A** — the Data Protection Officer (DPO) Designation & Accountability record (RA 10173 § 21 accountability + NPC Advisory No. 2017-01 on the designation of DPOs).
> **Part B** — the NPC Data Processing System Registration data sheet: the field-by-field information required to complete registration through the **NPC Registration System (NPCRS)**. Once its ‹OWNER TO SUPPLY› tokens are filled, **Part B IS the consolidated fillable NPCRS data sheet.**
>
> Grounding source for security measures + data flows: [`01_Contracts/Setnayan_Privacy_and_Security_Policy.md`](../01_Contracts/Setnayan_Privacy_and_Security_Policy.md) (Policy v1, locked 2026-05-12; Person-Graph amendment 2026-07-05 in DRAFT). Cross-referenced Records of Processing Activities: [`NPC_Compliance/02_Records_of_Processing_Activities_DRAFT_2026-07-05.md`](02_Records_of_Processing_Activities_DRAFT_2026-07-05.md).
>
> **Never-invent rule:** every value not supplied verbatim is either filled from confirmed facts or rendered as a bold **‹OWNER TO SUPPLY: …›** token. Do not guess.

---

> ## ✅ ADOPTION POSTURE — adopt now, counsel later
>
> This document is prepared for the DPO to **adopt as v1.0 and file now**, on the DPO's own authority — a sole proprietor may adopt their own RA 10173 records and file NPC registration directly through the NPCRS without a lawyer. To proceed: the owner supplies the **6 fields** in the checklist immediately below, then signs Part A.5 / B.9 and sets the effectivity date.
>
> **External Philippine counsel review is recommended, not blocking.** Where counsel or the NPC later requires a change, it is applied by a **dated amendment**; any affected live feature can be switched off immediately via the in-app Data Privacy control board (`/admin/data-privacy`). The items most worth a counsel pass when one is engaged: the **PIC = DPO self-designation** (A.3), the **sensitive-PII categorization** (B.4), and the **automated-decision declaration** (B.5).
>
> **Two things stay firm before filing:** (1) the 6 owner fields below must be **real values, not placeholders** — do not file with blanks; and (2) the ⚠ STATUS-TO-CONFIRM flags in B.4 / B.5 / B.8 (whether third-party ID verification and AMLC screening are actually active) must be resolved so the declaration is accurate.

### Fields the owner must supply before signing / filing

1. [ ] **Principal address — barangay + ZIP.** Complete the principal/registered office address (street already on file: 76 Sampaguita Avenue, Quezon City).
2. [ ] **BIR TIN / Form 2303 number.** Enter this **directly at filing** from admin → Compliance. **Do NOT write the number into this file.**
3. [ ] **Exact DPO position / title string.**
4. [ ] **Contact phone number.** One mobile number suffices, used as PIC contact + DPO contact + breach hotline.
5. [ ] **Sub-processor DPA status.** Which sub-processors have a signed DPA on file, and the **PostHog instance region (US or EU)**.
6. [ ] **Adoption / signature / effectivity date.**

---

## Master fact block (shared by Part A and Part B)

| Field | Value |
|---|---|
| **Personal Information Controller (PIC) — legal name** | **SETNAYAN SOFTWARE DEVELOPMENT SERVICE** (sole proprietorship of Indalecio Sacdalan Casasola II) |
| **Business / brand name** | Setnayan |
| **Business registration** | DTI Business Name Registration No. **8297508** · Territorial scope: **National** · Validity: **25 June 2026 – 25 June 2031** |
| **Registration type** | DTI Business Name (sole proprietorship). SEC/CDA: not applicable (sole prop). |
| **BIR registration (Form 2303 / TIN)** | **‹OWNER TO SUPPLY at filing — held in admin → Compliance; do NOT store the number in this file›** |
| **Proprietor / owner** | Indalecio S. Casasola II · owner sign-up email: iscasasolaii@gmail.com |
| **Domains / public surfaces** | setnayan.com · setnayan.ph |
| **Registered / principal office address** | 76 Sampaguita Avenue, Quezon City **‹OWNER TO SUPPLY: barangay + ZIP›** |
| **Data Protection Officer (DPO)** | **Indalecio Sacdalan Casasola II** · iscasasolaii@gmail.com · registered on NPC DPO system 2026-07-07 |
| **DPO position / title** | **‹OWNER TO SUPPLY: exact title string›** |
| **DPO employment basis (employee / contractor / outsourced)** | Internal — the proprietor / PIC also serves as DPO (2-person founding team). See A.3 for the independence rationale. |
| **DPO other contact (mobile / landline)** | **‹OWNER TO SUPPLY: contact number›** |
| **Total employees / headcount** | **2** — Indalecio S. Casasola II (proprietor + DPO) · Claire E. Buanhog (VP, co-founder) |
| **Total number of data subjects** | **~401** as of 2026-07-05 pre-launch snapshot (19 customers + 50 vendors + 332 guests; 61 events; will grow) |
| **Number of data subjects with sensitive personal information** | **0 active biometric face vectors** currently; a subset of the 50 vendors submit government IDs at verification; some guest dietary fields may reveal health/religion. (Not a fixed count — see B.4.) |
| **Sector / industry** | Information & communications technology — online life-events / weddings platform (marketplace + SaaS) |

---

# PART A — Data Protection Officer (DPO) Designation & Accountability Record

*Prepared under RA 10173 § 21 (Principle of Accountability) and NPC Advisory No. 2017-01 (Designation of Data Protection Officers).*

## A.1 Appointment

**SETNAYAN SOFTWARE DEVELOPMENT SERVICE** ("the PIC"), a sole proprietorship of **Indalecio Sacdalan Casasola II**, hereby designates:

| Field | Value |
|---|---|
| **Designated DPO** | **Indalecio Sacdalan Casasola II** |
| **Official DPO email** | iscasasolaii@gmail.com |
| **Position / title within the organization** | **‹OWNER TO SUPPLY: exact title string›** |
| **Employment basis** | Internal — the proprietor / PIC concurrently serves as DPO (2-person founding team). See A.3. |
| **Other contact (mobile / landline)** | **‹OWNER TO SUPPLY: contact number›** |
| **Effectivity date of designation** | **‹OWNER TO SUPPLY: sign date›** |
| **Reports to** | The proprietor, **Indalecio S. Casasola II** (highest management level) |

as its **Data Protection Officer**, accountable for the organization's compliance with RA 10173, its Implementing Rules and Regulations, and all applicable NPC issuances.

> **NPC registration of DPO contact details (required).** RA 10173 and NPC issuances require that the DPO's contact details be **registered with the National Privacy Commission** and made available to data subjects and the NPC. The DPO's contact details are carried into Part B (NPC registration data sheet) and are published to data subjects via the Privacy & Security Policy (`iscasasolaii@gmail.com`). The owner has already registered on the **NPC DPO system (2026-07-07)**. This designation is not complete for NPC purposes until the DPO's details are filed through the NPC Registration System.

## A.2 Duties and functions of the DPO

Per NPC Advisory No. 2017-01, the DPO shall, at minimum:

1. **Monitor compliance** — oversee the PIC's compliance with RA 10173, its IRR, NPC issuances, and internal data-protection policies, including the assignment and periodic review of the same.
2. **Advise on Data Privacy Impact Assessments (DPIAs)** — ensure the conduct of DPIAs for new or materially changed processing systems and features; advise the PIC on their necessity, application, and outcomes. *(Explicitly flagged as DPO-first in the Policy's Person-Graph and Minors/Legacy forward-notice — those phases each carry their own guardian-consent mechanics and DPIA before activation.)*
3. **Breach response** — ensure the organization's Personal Data Breach Management procedure (assessment, containment, and the **72-hour NPC notification** and affected-data-subject notification obligations already committed in Policy § 8) is in place and followed; serve as the point of contact during breach handling.
4. **Act as the NPC contact point** — serve as the primary liaison between the PIC and the National Privacy Commission on all matters relating to data privacy and security, including responding to NPC information requests and inquiries.
5. **Handle data-subject requests** — receive, coordinate, and ensure timely response to data-subject requests to be informed, to access, to object, to rectify, to erase/block, to data portability, and to be notified of breaches (Policy § 9 and Appendix A; committed response window: **within 15 business days** for non-urgent requests, **immediate** for breach notifications).
6. **Cultivate awareness** — inform and cultivate awareness on privacy and data-protection matters within the organization, including orientation/training of personnel involved in processing.
7. **Advocate for privacy by design and by default** — advise on embedding privacy safeguards into product design (e.g., RLS access control, per-event-scoped face vectors, signed-URL media access, zero-retention AI mode — see Policy §§ 3, 5, 7, 10).
8. **Maintain records** — support the maintenance of the Records of Processing Activities (RoPA) and the organization's registration with the NPC, and keep both current.
9. **Cooperate with the NPC** — coordinate registration, respond to compliance checks, and facilitate any NPC audit or investigation.

## A.3 Independence, resources, and safeguards

- **Independence.** The DPO shall perform the role independently and shall not be dismissed or penalized for performing DPO duties. The DPO shall not hold a position that gives rise to a conflict of interest with the DPO role. ⚠ **PIC = DPO self-designation.** Here the DPO **is** the proprietor (Indalecio Sacdalan Casasola II), the highest management level — which is itself the concurrent role to assess. NPC Advisory No. 2017-01 favours a DPO with autonomy from the controller; for a **2-person sole proprietorship** the owner acting as DPO is commonly accepted as a practical necessity. **Interim rationale to record (PH counsel to confirm):** no independent employee exists to hold the role, so the proprietor is designated DPO in the interim; the PIC will re-evaluate designating an independent DPO or a **Compliance Officer for Privacy (COP)** as headcount grows. The owner has already registered on the **NPC DPO system (2026-07-07)**.
- **Direct reporting line.** The DPO reports directly to the **highest management level** of the PIC — here, the proprietor, **Indalecio S. Casasola II**.
- **Resources & access.** The PIC shall provide the DPO the resources necessary to carry out the functions above, and timely and unimpeded access to personal data processing activities, systems, and records reasonably required for the role.
- **Involvement.** The DPO shall be involved, in a timely manner, in all issues relating to the protection of personal data.

## A.4 Contact details for publication

| Channel | Value |
|---|---|
| **DPO email (published to data subjects)** | iscasasolaii@gmail.com |
| **In-policy contact point** | Policy § 9 — Data subject access / rectification / erasure / restriction / breach inquiries |
| **Breach hotline (severity-high)** | **‹OWNER TO SUPPLY: contact number›** (one mobile suffices — same number may serve PIC contact + DPO contact + breach hotline; Policy § 8 references a phone hotline for severity-high incidents) |

## A.5 Signature block

This designation takes effect on **‹OWNER TO SUPPLY: sign date›** and remains in force until revoked or superseded in writing.

**For the Personal Information Controller (PIC):**

| | |
|---|---|
| Signature | ________________________________ |
| Name | **Indalecio Sacdalan Casasola II** |
| Title | Proprietor, SETNAYAN SOFTWARE DEVELOPMENT SERVICE |
| Date | ________________________________ |

**Accepted by the Data Protection Officer:**

| | |
|---|---|
| Signature | ________________________________ |
| Name | **Indalecio Sacdalan Casasola II** |
| Title | Data Protection Officer · **‹OWNER TO SUPPLY: exact title string›** |
| Date | ________________________________ |

---

# PART B — NPC Data Processing System Registration Data Sheet

*This is the consolidated fillable field-by-field information to be entered into the **NPC Registration System (NPCRS)**. Values are drawn from the master fact block; bold **‹OWNER TO SUPPLY: …›** tokens mark the genuine unknowns that must be settled before filing, and clearly-labelled post-filing blanks mark values that only exist after submission. The **actual online filing is performed by the DPO / owner** through the NPC Registration System — this sheet is the data to file, not the filing itself.*

## B.0 Eligibility / threshold note — assess before filing

NPC mandatory registration of a data processing system is generally triggered when **any** of the following applies to the PIC:

| Trigger (mandatory-registration indicator) | Setnayan status |
|---|---|
| Processes **sensitive personal information of at least 1,000 individuals** | **NOT currently met by count.** As of the 2026-07-05 pre-launch snapshot there are **0 active biometric face vectors**; only a subset of the 50 vendors submit government IDs at verification, and some guest dietary fields may incidentally reveal health/religion — none of these approach 1,000 individuals today. This trigger may be re-assessed as the platform grows. |
| Has **at least 250 employees** | **NO** — headcount is **2**, far below 250. |
| Processing is **likely to pose a risk to the rights and freedoms of data subjects** | **YES** — biometric face-vector infrastructure, government-ID verification, an automated vendor-suspension decision, minors/legacy roadmap, and cross-border transfers together pose more than negligible risk to rights. |
| Processing is **not occasional** (i.e., regular / part of core operations) | **YES** — processing is continuous and central to the platform. |

**Assessment:** the two numeric thresholds (≥1,000 sensitive-PII data subjects; ≥250 employees) are **NOT currently met**. However, the **risk-to-rights** and **not-occasional** triggers are independently met. **Recommendation: register the PIC and its data processing system(s) with the NPC** on the risk-based and non-occasional grounds. This posture should be re-checked as the sensitive-PII population grows (e.g., once biometric face vectors are activated at scale or verified-vendor volume rises), at which point the ≥1,000 count trigger may also apply.

## B.1 Personal Information Controller (PIC) details

| NPC field | Value |
|---|---|
| Registered name of PIC | **SETNAYAN SOFTWARE DEVELOPMENT SERVICE** |
| Trade / brand name | Setnayan |
| Type of organization | Sole proprietorship (private) |
| Business registration | DTI Business Name No. **8297508** (National · valid 25 Jun 2026 – 25 Jun 2031) |
| SEC / CDA registration | Not applicable (sole proprietorship) |
| BIR TIN / Form 2303 | **‹OWNER TO SUPPLY at filing — held in admin → Compliance; do NOT store the number in this file›** |
| Proprietor / authorized representative | Indalecio Sacdalan Casasola II |
| Sector / industry classification | Information & communications technology — online platform / marketplace + SaaS (life-events / weddings) |
| Nature of operations | A Philippines-first life-events platform (V1 surface: weddings). Couples/organizers plan events end-to-end; vendors run business profiles; the Setnayan team runs operations. Includes RSVP + guest management, vendor marketplace & verification, in-app paid services (photo/video capture, livestream, renders, AI-assisted planning), payments (apply-then-pay), and communications. |
| Principal / registered office address | 76 Sampaguita Avenue, Quezon City **‹OWNER TO SUPPLY: barangay + ZIP›** |
| Contact number | **‹OWNER TO SUPPLY: contact number›** |
| Official email | iscasasolaii@gmail.com |
| Website(s) | setnayan.com · setnayan.ph |

## B.2 Data Protection Officer details (as filed with NPC)

| NPC field | Value |
|---|---|
| DPO full name | **Indalecio Sacdalan Casasola II** |
| DPO position / title | **‹OWNER TO SUPPLY: exact title string›** |
| DPO email | iscasasolaii@gmail.com |
| DPO contact number | **‹OWNER TO SUPPLY: contact number›** |
| DPO office address | 76 Sampaguita Avenue, Quezon City **‹OWNER TO SUPPLY: barangay + ZIP›** (same as PIC principal office) |
| Registered on NPC DPO system | 2026-07-07 |

## B.3 Scale of processing

| NPC field | Value |
|---|---|
| Total number of employees | **2** (Indalecio S. Casasola II — proprietor + DPO; Claire E. Buanhog — VP, co-founder) |
| Total number of data subjects | **~401** (2026-07-05 pre-launch snapshot: 19 customers + 50 vendors + 332 guests; 61 events; will grow) |
| Number of data subjects whose **sensitive personal information** is processed | **No fixed count today — 0 active biometric face vectors**; a subset of the 50 vendors submit government IDs at verification; some guest dietary fields may reveal health/religion (see B.4). |
| Categories of data subjects | Customers (couples / organizers) · Guests · Vendors (business representatives) · (internal: Setnayan team / admins) |

## B.4 Does the system process **sensitive personal information**? — **YES (capability present; low volume today)**

Enumerated categories of sensitive personal information / regulated data processed (grounded in Policy §§ 1, 3, 10):

| Category | Detail | Data subject | Source in policy |
|---|---|---|---|
| **Government-issued identifiers** | Government-issued ID of vendor primary representative (image), captured for identity + liveness verification. **⚠ STATUS TO CONFIRM — the live /privacy notice states third-party identity-verification providers are not currently active (stub; no personal data flowing). DPO to confirm live status before filing; if inactive, declare as roadmap/planned rather than active.** | Vendors | Policy § 1.2, § 3.4, § 10 (Persona/Veriff/Onfido) |
| **Biometric data — face vectors** | 128-dimension face vectors generated from RSVP profile photo + optional pre-event upload + on-the-day check-in kiosk, used for per-event auto-tagging. **0 active vectors as of 2026-07-05 pre-launch snapshot.** | Guests (and couples where they appear) | Policy § 1.4 |
| **Financial reference data** | Payment receipts, transaction references, partial bank/e-wallet details for receipts and refunds; vendor payout account details. (Full card numbers, CVVs, and full bank account numbers are NOT stored.) | Customers, Vendors | Policy § 1.1, § 1.2 |
| **Sanctions / PEP screening data** | Vendor business name + owner name screened against AMLC / ComplyAdvantage sanctions & PEP lists. **⚠ STATUS TO CONFIRM — the live /privacy notice states third-party identity-verification providers are not currently active (stub; no personal data flowing). DPO to confirm live status before filing; if inactive, declare as roadmap/planned rather than active.** | Vendors | Policy § 3.4, § 10 |
| **Health / dietary information** *(possible)* | Guest dietary requirements captured for event catering may reveal health/religious information. Presence and scope in current build: `[TO CONFIRM]` | Guests | `[TO CONFIRM]` (not explicitly enumerated in Policy v1 § 1; verify against RoPA + live schema) |

> Note: some of the above (e.g., government IDs, financial account data) are "sensitive" and/or specially-regulated categories under RA 10173 / related law. Their inclusion here is for completeness of the NPC declaration; the DPO/counsel should confirm final categorization. **On count:** the ≥1,000 sensitive-PII threshold in B.0 is NOT currently met — see B.0 and B.3.

## B.5 Automated processing / AI decision-making

| NPC field | Value |
|---|---|
| Does the system involve automated processing? | **YES** — automated processing is used. |
| AI / automated features present | (a) Automated **face-matching auto-tag** of event photos (per-event-scoped; confidence-gated). (b) **AI contract analysis** (Contract Intelligence, Anthropic Claude API, zero-retention mode). (c) AI-assisted planning ("Setnayan AI" — navigational/assistive). (d) Fuzzy payment-inbox → order matching (rule-based). (e) **Anti-Fraud identity clustering + vendor fraud scoring + auto-suspend** (DPS-12 / DPIA R-08 — live 2026-07-07). |
| Solely-automated decisions producing legal or similarly significant effects on data subjects? | **YES — one, as of 2026-07-07.** The Anti-Fraud engine (DPS-12 / R-08) can **automatically suspend** a vendor's public listing at a high fraud score — a **reversible** decision with a significant effect. The **irreversible** wipe/ban is **not** automated (routed through a two-admin/four-eyes gate). All other automated features remain assistive/human-reviewed (vendor verification + payment reconciliation are admin-reviewed; face auto-tag surfaces suggestions below high-confidence thresholds). **⚠ STATUS TO CONFIRM — the live /privacy notice states third-party identity-verification providers are not currently active (stub; no personal data flowing). DPO to confirm live status before filing; if inactive, declare as roadmap/planned rather than active.** **Follow-up (RA 10173 §16(c)/§34):** document a formal contest/appeal path for the automated suspension — see `08_DPIA_AntiFraud_Trust_Integrity_2026-07-07.md` §6. |

## B.6 Data processing systems / activities (RoPA reference)

The full Records of Processing Activities are maintained separately. **Reference:** [`NPC_Compliance/02_Records_of_Processing_Activities_DRAFT_2026-07-05.md`](02_Records_of_Processing_Activities_DRAFT_2026-07-05.md) *(that RoPA document is the authoritative per-activity list; ensure it exists and is current before filing — status: `[TO CONFIRM — draft to be created/finalized]`).*

Indicative data processing systems (to be reconciled with the RoPA):

| # | Data processing system | Purpose |
|---|---|---|
| 1 | Customer / guest account & event management | Provide planning, RSVP, guest list, seating |
| 2 | Vendor registration & verification | Onboard + verify vendors (ID, permits, sanctions screening) |
| 3 | Media capture, storage & auto-tagging | Photo/video/face-vector processing and delivery |
| 4 | Payments (apply-then-pay) & reconciliation | Process PHP payments, receipts, refunds |
| 5 | Communications (chat) | Couple ↔ vendor / coordinator messaging |
| 6 | AI-assisted services | Contract analysis, planning assistance, renders |
| 7 | Admin operations & audit | Verification queues, dispute mediation, audit log |

## B.7 Security measures (summary — full detail in Policy §§ 5, 7, 10)

| Area | Measure |
|---|---|
| Encryption at rest | AES-256 on Supabase Postgres + Cloudflare R2; keys via provider KMS |
| Encryption in transit | TLS 1.3 on all external connections; HSTS; mixed-content blocked |
| Access control | Supabase Row-Level Security (per-user isolation); short-lived signed URLs (5-min) for sensitive media; granular admin roles; two-admin approval for high-risk actions; TOTP 2FA (mandatory for admins) |
| Face-vector safeguards | Per-event scoped, encrypted at rest, never reused across events, "Delete my face data" revocation |
| Application security | Input validation, parameterized queries, XSS/CSRF protections, rate limiting on auth |
| Audit | Append-only admin audit log (timestamp, actor, action, before/after, rationale) |
| Breach response | 72-hour NPC + affected-user notification; public summary within 7 days (Policy § 8) |
| Backups | Daily encrypted DB backups, 30-day retention |

## B.8 Cross-border data transfers

**YES — the system involves cross-border transfers.** Primary infrastructure is Singapore + APAC region; several sub-processors are outside ASEAN. All transfers are encrypted in transit (TLS 1.3) and governed by data-processing agreements / SCCs. (Policy § 10.)

| Recipient / sub-processor | Jurisdiction | Data shared | Purpose | Lawful basis (per Policy) | DPA on file? |
|---|---|---|---|---|---|
| **Supabase** (database) | **Singapore** | PII + transactional records, **including the biometric face vectors** (`guest_face_enrollments.face_vector`, `user_face_profiles`) — corrected 2026-07-31 | Application database (encrypted at rest) | Performance of contract | **‹OWNER TO SUPPLY: signed DPA on file?›** |
| **Cloudflare R2** (object storage) | **Asia-Pacific (APAC)** — ✅ **CONFIRMED IN THE CLOUDFLARE DASHBOARD 2026-08-01** by the DPO (`setnayan-media` → Location: *Asia-Pacific (APAC)*). *(Was "APAC / PH region"; R2 offers no Philippines region. Filing-ready — this is no longer an assumption.)* | Media originals, the **source selfie images** for face enrolment, documents — **not the face vectors** (corrected 2026-07-31) | Media & document storage | Performance of contract | **‹OWNER TO SUPPLY: signed DPA on file?›** |
| **Vercel** (application hosting) | **United States** | Application traffic / runtime | Web application hosting | Performance of contract | **‹OWNER TO SUPPLY: signed DPA on file?›** |
| **Resend** (email) | **United States** | Recipient email + notification content | Transactional / notification email delivery | Performance of contract / legitimate interest | **‹OWNER TO SUPPLY: signed DPA on file?›** |
| **PostHog** (product analytics) | **‹OWNER TO SUPPLY: US or EU instance›** | Product-analytics events (no PII per Policy) | Product analytics | Legitimate interest | **‹OWNER TO SUPPLY: signed DPA on file?›** |
| **Anthropic (Claude API)** | US | Vendor contract text | Contract Intelligence analysis (zero-retention mode) | § 12(b) legitimate interest; enterprise DPA | **‹OWNER TO SUPPLY: signed DPA on file?›** |
| **Persona / Veriff / Onfido** | US | Vendor gov-ID image + selfie + liveness | Vendor identity verification | § 12(b) — vendor consent at registration | **‹OWNER TO SUPPLY: signed DPA on file?›** — **⚠ STATUS TO CONFIRM — the live /privacy notice states third-party identity-verification providers are not currently active (stub; no personal data flowing). DPO to confirm live status before filing; if inactive, declare as roadmap/planned rather than active.** |
| **AMLC API / ComplyAdvantage** | PH (AMLC) / UK (ComplyAdvantage) | Vendor + owner name | Sanctions / PEP screening | § 13(d) — compliance with PH AMLA | **‹OWNER TO SUPPLY: signed DPA on file?›** — **⚠ STATUS TO CONFIRM — the live /privacy notice states third-party identity-verification providers are not currently active (stub; no personal data flowing). DPO to confirm live status before filing; if inactive, declare as roadmap/planned rather than active.** |
| **DTI Database** | PH | Vendor DTI Business Name number | Business-registration validation | § 12(c) — necessity for contract | **‹OWNER TO SUPPLY: signed DPA on file?›** |
| **OpenAI (GPT-4)** — V1.5+ fallback only | US | Vendor contract text (fallback) | Contract Intelligence backup | Same as Anthropic | **‹OWNER TO SUPPLY: signed DPA on file?›** |
| **Suno** | United States | No personal data transmitted → not a personal-data sub-processor | AI music generation for renders (Pakanta / template music) | n/a — no personal data transmitted | n/a |

> The US sub-processors are bound by SCCs or equivalent DPAs; the Anthropic workspace uses zero-retention API mode; Persona/Veriff/Onfido + AMLC screenings are batch-call-only with no ongoing storage (Policy § 10). **Suno** processes no personal data and is not a personal-data sub-processor (lawful basis n/a). Complete the "DPA on file?" column per the checklist before filing.

## B.9 Filing action & sign-off

- **This document is the DATA to be filed, not the filing itself.** The actual NPC registration of the data processing system(s), and the registration of the DPO's contact details, are **online filing actions performed by the DPO (Indalecio Sacdalan Casasola II) and/or the owner (Indalecio S. Casasola II)** through the **NPC Registration System (NPCRS)**.
- Before filing, resolve **all ‹OWNER TO SUPPLY› tokens** with real values, confirm the RoPA (§ B.6) exists and is current, and have the DPO validate the sensitive-PII categorization (§ B.4) and the automated-decision answer (§ B.5). A counsel pass on these is **recommended** when one is engaged, but is **not a precondition** to filing.

| Prepared / reviewed | Name | Date |
|---|---|---|
| Reviewed by DPO | Indalecio Sacdalan Casasola II | ________________ |
| Approved by PIC | Indalecio S. Casasola II | ________________ |
| Filed with NPC (NPCRS) — reference no. | `[POST-FILING — NPCRS reference no. assigned on submission]` | ________________ |
| NPC registration number issued | `[POST-FILING — NPC registration number issued after acceptance]` | ________________ |

---

*Footer — This ADOPTION-READY document establishes a compliant baseline. It is **not a substitute for legal review**; external Philippine counsel review — including blessing the PIC=DPO self-designation — is **recommended but not a precondition** to adoption or filing (per the adoption posture above), and any change it requires is applied by a **dated amendment**. The actual NPC online registration of the data processing system(s) and the registration of the DPO's contact details are the DPO's / owner's filing actions. · 2026-07-24.*
