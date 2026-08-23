# Setnayan Privacy Manual

> **ADOPTION-READY · 2026-07-24 — formatted for the DPO's signature and NPC filing.**
> Date prepared for adoption: **2026-07-24**
> Document ID: `NPC_Compliance/01_Privacy_Manual_ADOPTED_2026-07-24.md`
> Governing law: Republic Act No. 10173 (Data Privacy Act of 2012), its Implementing Rules and Regulations (IRR), and issuances of the National Privacy Commission (NPC).

> ### ✅ ADOPTION POSTURE — adopt now, counsel later
>
> This Manual is prepared for the DPO to **adopt as v1.0 now**, on the DPO's own authority — a sole proprietor may adopt their own RA 10173 compliance documents. To adopt: the owner supplies the **6 fields** in the checklist immediately below, signs the approval block in § 12, and sets the effectivity date.
>
> **External Philippine counsel review is recommended, not blocking.** It is not required to adopt this Manual or to file NPC registration. Where counsel or the NPC later requires a change, it is applied by a **dated amendment** (see the § 12 version table); any affected live feature can also be switched off immediately via the in-app Data Privacy control board (`/admin/data-privacy`).
>
> **Two things stay firm before any NPC filing:** (1) the 6 owner fields below must be **real values, not placeholders** — do not file with blanks; and (2) the risk items flagged in the text — especially the vendor gov-ID + AMLC basis and any minors'-data processing — remain visible and should get a counsel pass when one is engaged.

### Fields the owner must supply before signing

1. **Barangay + ZIP** for the principal address (76 Sampaguita Avenue, Quezon City — complete it).
2. **BIR TIN / Form 2303 number** — enter this at filing from admin → Compliance; **never write it into this file.**
3. **Exact DPO position/title string** (the precise wording of the DPO's designated title).
4. **A contact phone number** — one mobile suffices; it serves as the PIC contact, DPO contact, and breach hotline.
5. **Which sub-processors have a signed DPA on file** — and **the PostHog instance region (US or EU)**.
6. **The adoption / signature date.**

This Privacy Manual is the flagship governance document of the Personal Information Controller. It states how the organization collects, uses, stores, discloses, and disposes of personal data; how it upholds the rights of data subjects; and how it manages security, breaches, and cross-border transfers. It is intended to be kept on file and presented to the NPC on request.

---

## 1. Introduction, Purpose & Scope

### 1.1 The Personal Information Controller (PIC)

| Field | Value |
|---|---|
| Legal entity | **SETNAYAN SOFTWARE DEVELOPMENT SERVICE** — a sole proprietorship of **Indalecio Sacdalan Casasola II** |
| DTI Business Name Registration | **No. 8297508** (national scope; valid **25 Jun 2026 – 25 Jun 2031**) |
| Brand | Setnayan |
| Domains / platform | `setnayan.com` · `setnayan.ph` |
| Nature of business | Philippines-first life-events (weddings-first) planning platform serving three roles — customers (couples/organizers), vendors, and guests |
| Registered address / principal place of business | 76 Sampaguita Avenue, Quezon City, **‹OWNER TO SUPPLY: barangay + ZIP›** |
| Number of employees / personnel with access to personal data | **2 of 2** — Indalecio S. Casasola II (proprietor + DPO) and Claire E. Buanhog (VP, co-founder) |
| Approximate number of data subjects | **48 as measured in production 2026-08-17** (9 accounts + 39 guests; 2 shops; 6 events; 0 active biometric face vectors). ⚠ CORRECTED 2026-08-17 — this field read **~401** from the 2026-07-05 pre-launch snapshot (19 customers + 50 vendors + 332 guests; 61 events). That test data was purged; `07_Compliance_Facts_Register` recorded the ~10× drop on 2026-07-31 and the correction was never propagated to the headline fields. The registration-threshold analysis is UNAFFECTED and strengthened: 48 subjects and 0 biometric vectors sit further below the ≥1,000-SPI trigger than the stale figures did |
| NPC registration number (PIC/DPO registration) | DPO registered on the NPC DPO system **2026-07-07**; DPS registration reference to be captured after NPCRS filing |

### 1.2 Purpose

This Manual:

- Documents the PIC's personal data processing activities and the safeguards applied to them.
- Serves as the reference for all personnel who process personal data on the PIC's behalf.
- Demonstrates the PIC's accountability and compliance posture to the NPC, to data subjects, and to partners.
- Operationalizes the binding **Setnayan Privacy & Security Policy** (`01_Contracts/Setnayan_Privacy_and_Security_Policy.md`), which every account holder accepts at registration.

### 1.3 Scope

This Manual applies to **all personal data** processed by the PIC across all systems, personnel, contractors, and sub-processors, in every format (electronic and, where applicable, physical). It covers the personal data of **customers, vendors, and guests**, and the internal personnel data the PIC processes as an employer/engager (2 personnel with personal-data access — see § 1.1).

### 1.4 Commitment to RA 10173

The PIC commits to upholding the three data privacy principles — **transparency, legitimate purpose, and proportionality** — and to protecting the rights of every data subject. The platform is built on a **privacy-by-design + compliance-by-default** posture: privacy safeguards are engineered into the systems (row-level access control, encryption, per-event scoping) rather than bolted on. The organization's person-graph features are **adults-only**; processing of minors' data and legacy/post-mortem data is a future, counsel-first phase and is **not undertaken now**.

---

## 2. Definitions

Terms used in this Manual carry the meanings assigned by RA 10173 and its IRR:

| Term | Meaning |
|---|---|
| **Personal Information (PI)** | Any information from which the identity of an individual is apparent or can reasonably and directly be ascertained, or when put together with other information would directly and certainly identify an individual. |
| **Sensitive Personal Information (SPI)** | PI about an individual's race, ethnic origin, marital status, age, colour, religious/philosophical/political affiliations; health, education, genetic or sexual life; any proceeding for any offence; government-issued identifiers (SSS, TIN, etc.); and information specifically established by law as classified. |
| **Privileged Information** | Any and all forms of data which, under the Rules of Court and other pertinent laws, constitute privileged communication. |
| **Personal Information Controller (PIC)** | A person or organization who controls the collection, holding, processing, or use of personal information — here, SETNAYAN SOFTWARE DEVELOPMENT SERVICE. |
| **Personal Information Processor (PIP)** | Any natural or juridical person to whom a PIC may outsource or instruct the processing of personal data (the PIC's sub-processors — see § 8). |
| **Data Subject** | The individual whose personal information is processed — Setnayan's customers, vendors, and guests. |
| **Processing** | Any operation performed upon personal data — collection, recording, organization, storage, updating, retrieval, consultation, use, consolidation, blocking, erasure, or destruction. |
| **Consent** | Any freely given, specific, informed indication of will by which the data subject agrees to the processing of personal data about them. |
| **Data Protection Officer (DPO)** | The individual designated by the PIC to be accountable for compliance with RA 10173. |
| **Personal Data Breach** | A breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to, personal data. |

---

## 3. Governance & Organizational Structure

### 3.1 Data Protection Officer (DPO)

| Field | Value |
|---|---|
| Designated DPO | **Indalecio Sacdalan Casasola II** |
| DPO position / title | **‹OWNER TO SUPPLY: exact DPO position/title string›** |
| DPO contact | **iscasasolaii@gmail.com** · **‹OWNER TO SUPPLY: contact phone number (serves PIC + DPO + breach hotline)›** |
| NPC DPO registration | Registered on the NPC DPO system **2026-07-07**; DPS registration reference to be captured after NPCRS filing |

The DPO is the organization's accountable officer for data privacy and the single point of contact for data subjects and for the NPC. The DPO's responsibilities include:

- Monitoring and ensuring the PIC's compliance with RA 10173, its IRR, NPC issuances, and this Manual.
- Serving as the contact point for data subject requests and complaints (access, rectification, erasure, objection, portability, and breach inquiries).
- Overseeing the conduct of Data Privacy Impact Assessments (DPIAs — see § 10) and maintaining the DPIA register.
- Leading the security incident and breach response process (see § 9), including NPC and data-subject notification.
- Cultivating a privacy-aware culture through personnel training and periodic review of policies.
- Reviewing and advising on sub-processor engagements and cross-border transfers.

### 3.2 Security Measures — Overview

The PIC maintains organizational, physical, and technical security measures proportionate to the nature of the personal data processed and the risks involved. The measures below summarize the controls already in place per the binding Privacy & Security Policy.

#### 3.2.1 Organizational measures

- **Binding policy acceptance.** Every customer, vendor, and guest accepts the Privacy & Security Policy at registration; acceptance is logged with timestamp, IP, and user-agent in a `policy_acceptances` record per user.
- **Role-based responsibility.** Internal (admin) access is gated to granular roles; each role can only reach the surfaces it is permitted.
- **Two-admin approval** for high-impact actions — role provisioning, brand-configuration changes, refunds above ₱10,000, and unlimited-use grants above ₱10,000 retail value.
- **Confidentiality obligations** on personnel and contractors — **‹OWNER TO ADOPT: short signed confidentiality note + basic-hygiene policy recommended›**.
- **Privacy training** for personnel who process personal data — **‹OWNER TO ADOPT: short signed confidentiality note + basic-hygiene policy recommended›** (training cadence to be set with the same policy).

#### 3.2.2 Physical measures

- **No self-hosted data centre.** The PIC does not operate physical servers; personal data resides with managed cloud processors (Supabase, Cloudflare) under their physical-security controls and data-processing agreements.
- Access to workstations and administrative credentials is restricted to authorized personnel — **‹OWNER TO ADOPT: short signed confidentiality note + basic-hygiene policy recommended›** (device/endpoint hygiene to be set with the same policy).

#### 3.2.3 Technical measures

| Control | Implementation |
|---|---|
| **Access control (deny-by-default)** | Row-Level Security (RLS) on the Postgres database — every query is gated so no client can read another user's row. Deny-by-default is the baseline; access is granted only by explicit policy. |
| **Encryption in transit** | TLS 1.3 on all external connections and WebSocket channels; HSTS enabled in production; mixed content blocked. |
| **Encryption at rest** | AES-256 on the database and object storage; keys managed by the cloud providers' key-management services. Face vectors are stored as event-scoped rows in the encrypted Postgres database (`guest_face_enrollments.face_vector`), under the same RLS deny-by-default gate as all other personal data — *not* in a separate object-storage index (corrected 2026-07-31; see § 5.3). |
| **Authentication** | Email + password (bcrypt-hashed, never plaintext), or mobile + OTP, or Google/Apple SSO; TOTP two-factor available for customers/vendors and **mandatory for all admin roles**. |
| **Session management** | 30-day inactivity expiry; refresh tokens stored httpOnly; single sign-out across all devices. |
| **Short-lived media access** | Object storage is private; access is via short-lived signed URLs (5 minutes for sensitive media). No public reads. |
| **Application hardening** | Input validation at every entry point; parameterized queries (no SQL injection); output escaping + CSP (no XSS); CSRF tokens on state-changing requests; rate limiting on auth endpoints. |
| **Audit logs** | Every admin action is logged append-only (no UPDATE permission) with timestamp, actor, action type, target entity, before/after state, and rationale. |
| **Backups** | **NONE — there are no automated database backups.** The database runs on the Supabase FREE plan, which provides no scheduled snapshots, and no backup job of our own exists — the platform's ~16 cron-free periodic jobs are application sweeps, none of which is a database backup. ⚠ CORRECTED 2026-08-17 — this row previously declared "Daily encrypted database backups retained 30 days", which was never true. Owner ruling 2026-08-10 (*"let's stay free for the moment"*) records the absence of backups as a CONSCIOUSLY ACCEPTED cost, to be revisited before launch; the paid tier would give daily backups with 7-day (not 30-day) retention. Encryption at rest, TLS 1.3 in transit and RLS isolation are unaffected and remain in force. |

---

## 4. Data Processing Principles Applied

The PIC applies the three RA 10173 principles to every processing activity:

### 4.1 Transparency

Data subjects are informed of the nature, purpose, and extent of processing before or at collection. Mechanisms:

- Registration-time acceptance of the Privacy & Security Policy (logged per user).
- A published privacy notice on `setnayan.com/privacy` and a changelog at `setnayan.com/privacy/changelog`; material changes carry 30 days' notice and a re-consent prompt where processing changes.
- The DPO's contact (iscasasolaii@gmail.com) is published as the channel for questions and rights requests.

### 4.2 Legitimate Purpose

Processing is limited to declared, specified, and legitimate purposes and is never incompatible with them. Concrete examples:

- **Service delivery** — providing the planning tools, gallery, RSVP, and vendor-matching a customer contracts for (basis: performance of contract / legitimate interest).
- **Payments** — apply-then-pay reconciliation using **reference data only**; no card, CVV, or full bank-account numbers are stored (basis: performance of contract).
- **Vendor verification** — identity, business-registration, and sanctions screening at onboarding (bases: consent, legitimate interest, compliance with the PH Anti-Money Laundering Act). ⚠ STATUS TO CONFIRM — the live /privacy notice states third-party identity-verification providers are not currently active (integration is a stub, no personal data flowing); DPO to confirm live status before filing.
- **Face auto-tagging** — matching a guest to their own photos, per-event only, on explicit/implied consent (basis: consent).

### 4.3 Proportionality

Only data adequate, relevant, and necessary to the declared purpose is processed:

- **Payment data minimization** — reference and receipt data only, never full credentials.
- **Per-event face scoping** — face vectors are generated and used **per event only, never reused across weddings**, and are deleted with the event data. There is **no cross-event face recognition**.
- **Person-graph minimization** — connections require **mutual confirmation**; cross-person visibility is **name-only**; extended relationships are **derived, never stored**; trusted-circle signals are **aggregated/computed (≥5 minimum), never per-person records**.

---

## 5. Data Lifecycle: Collection → Use → Storage → Disclosure → Disposal

### 5.1 Collection

Personal data collected, by role:

| Role | Categories collected |
|---|---|
| **Customer** (couple/organizer) | Full name, mobile, email, optional profile photo; event details (date, venue, target pax, role); payment **reference/receipt** data (no full credentials); in-app behavioral data; uploaded content (photos, invitation customizations); chat messages with vendors/coordinators. |
| **Vendor** | Business + identity documents (DTI Business Name Certificate, BIR Form 2303, Mayor's Permit, government ID, bank-account proof, portfolio, client references, live selfie + liveness); service profile; payout account and transaction history; behavioral data; chat messages. Includes **SPI** (government-issued identifiers). | ⚠ **CORRECTED 2026-08-24 — THE OWNER RETIRED THESE CHECKS ON 2026-07-03** (`apps/web/lib/vendor-verification.ts:226`, owner: *"we do not need this … what we have, that is it"*): `government_id`, `live_selfie`, `phone_email_otp` and `amlc_screening` are **RETIRED slots**. **Identity confirmation is a 15-minute Google Meet.** **This row OVER-DECLARES: a government ID, a live selfie and a liveness video are NO LONGER COLLECTED.** ⚖ **THE SPI CLASSIFICATION STANDS, RE-BASED (owner, 2026-08-24):** it previously rested on the government identifier, which is gone — but the **BIR Form 2303 carries a Tax Identification Number**, itself a government-issued identifier, and that document is still collected. **The classification is unchanged; only its basis is corrected.** Keeping it was the deliberate choice: downgrading a classification is the direction that costs a data subject protection, so it needs a stronger reason than the loss of one of two grounds. Collected today: the business documentation (DTI/SEC, BIR 2303, Mayor's Permit, bank-account proof), the portfolio and references. ⚠ **LEGACY UPLOADS FROM BEFORE 2026-07-03 MAY STILL EXIST IN OBJECT STORAGE** — the retention row below governs those, which is why it is corrected rather than deleted. |
| **Guest** | Full name, mobile, email, optional profile photo; event linkage and role; RSVP status and table assignment; captured/tagged photos and clips; behavioral data (reels built, reshares). |
| **Face vectors (special category)** | Per-event face vectors derived from RSVP profile photo + optional pre-event upload + on-the-day check-in kiosk, used only for auto-tagging within that one event. |

### 5.2 Use

Primary uses: providing contracted services, vendor matching, payment processing, per-event photo auto-tagging, event/payment notifications, and aggregated platform analytics. Secondary uses (anonymized aggregate improvement/ML, marketing samples, promotional communications) require **separate, revocable consent**. Personal data is **never sold**, never used for external targeted advertising, and never shared with government except as required by Philippine law (subpoena/court order).

### 5.3 Storage, Residency & Retention

| System | Location | Content |
|---|---|---|
| Database (Postgres) | **Supabase — Singapore** | PII + transactional data, RLS-gated, AES-256 at rest. **Includes the biometric face vectors** — `guest_face_enrollments.face_vector` (JSONB) and `user_face_profiles` (corrected 2026-07-31, see note) |
| Object storage | **Cloudflare R2 — APAC region** | Photos/videos, the **source selfie images** for face enrolment, vendor verification documents; private + signed-URL access |

> **📍 Corrected 2026-07-31 — where the biometric data actually sits.** This table previously placed a *"per-event encrypted face-vector index"* on Cloudflare R2. **Verified against shipped code, that is not how it was built.** The face vectors are `JSONB` columns in **Supabase Postgres (Singapore)** — `guest_face_enrollments.face_vector` (migration `20260901000000`) and the account-level descriptor in `user_face_profiles` (migration `20270306508746`). R2 holds the **source selfie image** (`guest_face_enrollments.asset_url` = `r2://…`), not the vector. **No R2 vector index exists.** Both locations are outside the Philippines, so § 10's cross-border conclusion is unchanged — but the NPC registration sheet asks *where sensitive personal information resides*, and biometric data is the most scrutinised category, so the location must be stated accurately. Same correction applied to `02_Records_of_Processing_Activities` DPS-04 and `03_DPO_Designation_and_NPCRS` § sub-processors.
| Email | **Resend** | Transactional/notification email delivery |

Representative retention windows (full table in the Privacy & Security Policy § 4):

| Data type | Retention | Deletion trigger |
|---|---|---|
| Customer/vendor account profile | Active | Account deletion + 30-day grace then purge |
| Customer event data | **Kept for the LIFE OF THE ACCOUNT**, deleted when the couple closes or deletes their account (plus the existing 30-day tail). Owner ruling 2026-08-17. ⚠ **CORRECTED — the previous "5 years post-event, auto-purge at T+5y" rule is WITHDRAWN, not merely unbuilt.** Building it as written would have DELETED THE PHOTOS: in the live schema the photo rows, the guest list, the tags, the schedule and the supplier list all cascade from the event, so removing a wedding removes its album — contradicting the owner's twice-locked rule that no photo is ever deleted, only compressed. Retention is therefore bound to the purpose that is still running (the couple's own album and its context) rather than to a timer, matching the treatment of account data. Any future end date must be built to remove planning details WITHOUT touching the photos. | Deleted with the account |
| Photo/video originals | Full-resolution ORIGINAL: the later of 6 months from the event's first capture and 3 months after the event ENDS (the celebration's last day: `event_end_date` where the event spans several days, else `event_date` — owner 2026-08-10), then **replaced by** a compressed web copy. **Compressed web copy: free, **FOR LIFE** — owner 2026-08-18, *"we keep it for life"*, superseding the five-year window set on 2026-08-07, which had itself superseded the 2026-07-10 "free forever" lock. **There is no end date and no paid tier.** ⛔ **Nothing was ever deleted under any of the three rulings** — only the ORIGINAL's resolution ever changes. ⚠ The withdrawn paid option was never built and never priced, so this retires a PROMISE, not a product. This pack is unsigned and unfiled, so no superseded figure was ever declared to the Commission.** No scheduled deletion at any point. **No photo is ever deleted on a schedule.** Disposal occurs only on organizer removal, a validated erasure request, or account deletion. Originals synced to the couple's own Google Drive are theirs permanently and are never touched. | ⚠ **CORRECTED 2026-08-07.** This row previously declared a **5-year hard limit** with 90-day-hot/5-year-cold tiering. That tiering was never built, no R2 lifecycle rule exists, and the compressed copy is kept indefinitely — so the row committed us, in a filing, to destroying photos we in fact keep. Declaring a purge that never happens is the more dangerous direction of drift: a commitment to the regulator broken every day. |
| Face vectors | **Deleted 3 MONTHS AFTER THE EVENT ENDS** (`event_end_date` where the celebration spans several days, else `event_date`) — the same clock as the full-resolution photo floor. Owner ruling 2026-08-17. Earlier deletion any time via the guest's "Delete my face data" link or Photo Consent OFF (≤ 5-minute revocation), which DO work today. ⚠ **UPDATED 2026-08-24 — ENFORCEMENT IS NOW BEING BUILT** (the 3-month face-data sweep and the 90-day supplier-upload sweep, PR #4735; verify it MERGED before treating this as true). As adopted on 2026-08-17 no sweep implemented this period — today the only thing that removes this data is an erasure/revocation request. The period stated is the ADOPTED RULE, not a description of current behaviour. ⚠ **CORRECTED 2026-08-17 (same day):** an earlier revision of this row said *"production has ZERO scheduled jobs, so no automatic deletion of any kind runs today"* — **that was wrong.** Setnayan deliberately runs **cron-free**: a database compare-and-swap claim fired from request traffic drives **~16 periodic jobs**, all verified running on 2026-08-17, and several DO delete automatically (a 5-year chat purge, a 180-day Deep-Search-dossier purge, an anonymous-draft sweep, and the full-resolution photo replacement). The gap is that **no job covers THIS class yet** — not that the machinery is absent. Stating the period alone would replace a false promise with a newer one. 🔒 **Deleting face data does NOT remove photo tags** — verified in the live schema: a tag carries the guest link itself and has no reference to face data, so nothing cascades. Guests keep every photo already delivered; only FUTURE automatic matching is lost, which is why the 3-month mark is safe. ⚠ CORRECTED 2026-08-17 — this row previously declared a "per-event lifetime + 5 years, auto-purge with event data" rule, which nothing implemented — and which had silently become "never deleted" when the media row moved to indefinite retention on 2026-08-02. | Revoke link works today |
| Vendor verification audit trail / permits | ⚠ **CORRECTED 2026-08-24 — THE COLLECTION THIS ROW DESCRIBES WAS RETIRED 2026-07-03; it now governs LEGACY uploads made before that date, not an ongoing collection.** Raw uploads (government ID, selfie + liveness video, bank micro-deposit, portfolio): **deleted 90 DAYS AFTER the approve/reject decision** — owner ruling 2026-08-17, which makes true the promise this row already made. The DECISION RECORD ONLY (outcome, deciding admin, timestamp, screening result) is retained **7 years** (BIR §235 + AMLC AML/CTF). DTI / BIR 2303 / Mayor's Permit: 7 years. Transaction history: 5 years (policy §4). ⚠ **UPDATED 2026-08-24 — ENFORCEMENT IS NOW BEING BUILT** (the 3-month face-data sweep and the 90-day supplier-upload sweep, PR #4735; verify it MERGED before treating this as true). As adopted on 2026-08-17 no sweep implemented this period — today the only thing that removes this data is an erasure/revocation request. The period stated is the ADOPTED RULE, not a description of current behaviour. ⚠ **CORRECTED 2026-08-17 (same day):** an earlier revision of this row said *"production has ZERO scheduled jobs, so no automatic deletion of any kind runs today"* — **that was wrong.** Setnayan deliberately runs **cron-free**: a database compare-and-swap claim fired from request traffic drives **~16 periodic jobs**, all verified running on 2026-08-17, and several DO delete automatically (a 5-year chat purge, a 180-day Deep-Search-dossier purge, an anonymous-draft sweep, and the full-resolution photo replacement). The gap is that **no job covers THIS class yet** — not that the machinery is absent. Stating the period alone would replace a false promise with a newer one. | BIR § 235 + AMLC AML/CTF |
| Chat messages / audit logs | 5 years | Aligned with event / tax-legal retention |
| Anonymized aggregate data | Indefinite (no PII) | Not auto-purged |

### 5.4 Disclosure / Sharing

Disclosure is limited to the sub-processors in § 8, each engaged under a data-processing agreement and used only for the declared purpose. Internal (Setnayan Team) access to event media is read-only, case-scoped to mediation, and never bulk-exported.

### 5.5 Disposal

Disposal occurs by automated purge at the retention boundary or on a validated deletion request. Account deletion cascades to profile, event memberships, face vectors, individual photos of the subject (subject to event-organizer consent for shared galleries), and chat history — **except** records the PIC must retain for PH tax/legal compliance (e.g., BIR vendor records, payment receipts), which are retained for their statutory period and then destroyed.

---

## 6. Data Subject Rights

Every data subject has the following rights under RA 10173. All are exercised by contacting **iscasasolaii@gmail.com** (and, for several, via in-app settings surfaces).

| # | Right | How to exercise / PIC response |
|---|---|---|
| 1 | **Right to be informed** | Via this Manual, the published privacy notice, and registration-time disclosures. |
| 2 | **Right to access** | Request a copy of personal data held, via iscasasolaii@gmail.com. **Response: within 15 business days** for non-urgent requests. |
| 3 | **Right to object** | Opt out of specific data uses (e.g., marketing samples, promotional email) via settings or iscasasolaii@gmail.com. |
| 4 | **Right to rectification** | Edit profile in-app; request corrections via iscasasolaii@gmail.com. |
| 5 | **Right to erasure or blocking** | Delete account via the in-app "Delete my account" surface; **confirmed within 30 days**; cascade per § 5.5, with statutory-retention exceptions. |
| 6 | **Right to damages** | File a complaint with the NPC for violations; the PIC cooperates with any NPC proceeding. |
| 7 | **Right to data portability** | Export event data, photos, and chat history in a machine-readable format, via iscasasolaii@gmail.com or in-app export. |
| 8 | **Right to be notified** | Notification of any breach affecting the subject's data, per § 9. |

Person-graph specific rights: a data subject may decline connection requests, remove confirmed connections, hide individual life-story items per-person (without affecting the host's gallery), and opt out of an event's story entirely; deletion cascades to their connections and story-item references.

---

## 7. Consent Management

- **Registration consent.** Acceptance of the Privacy & Security Policy is captured and logged (timestamp + IP + user-agent) at account creation.
- **Face detection.** Guests consent to face auto-tagging by uploading an RSVP profile photo for that purpose (implied consent) and can withdraw at any time via a "Photo Consent" toggle; withdrawal triggers face-blur in captures and revocation of face data. Face processing is **per-event only**.
- **Vendor verification consent.** Vendors give explicit, itemized consent at registration for DTI lookup, third-party ID/liveness verification, portfolio reverse-image search, reference calls, and AMLC sanctions screening. ✅ **STATUS CONFIRMED 2026-08-24, AND IT RESOLVES THE FLAG AS "NOT A STUB — REMOVED".** These slots were **retired by the owner on 2026-07-03**; identity confirmation is a 15-minute Google Meet. **No third-party ID/liveness verification and no AMLC screening is consented to, requested, or performed.** The itemized consent must not ask for them.
- **Marketing samples.** Use of a customer's renders/captures as marketing samples requires a **separate written opt-in**, revocable at any time; existing materials are removed within 90 days of revocation.
- **Person graph.** Connections require **mutual confirmation** (no one-sided edges); life-story items rely on existing event photo-consent and are individually hide-able/opt-out-able; trusted-circle recommendations are aggregate-only.
- **Withdrawal.** Consent may be withdrawn at any time through settings or iscasasolaii@gmail.com, without affecting the lawfulness of prior processing.
- **Material changes** to processing carry 30 days' advance notice and a re-consent prompt at next login where the change affects data use.

---

## 8. Data Sharing, Sub-Processors (PIPs) & Cross-Border Transfers

### 8.1 Hosting & cross-border disclosure

The PIC's primary infrastructure is hosted **outside the Philippines**: the database in **Singapore** (Supabase) and object storage in the **APAC region** (Cloudflare R2). Routine application operations therefore involve **cross-border processing**. All such transfers are encrypted in transit (TLS 1.3), governed by the providers' data-processing agreements, and remain subject to NPC oversight; the PIC remains accountable for personal data transferred to any processor.

### 8.2 Sub-processors (Personal Information Processors)

| Sub-processor | Jurisdiction | Data shared | Purpose |
|---|---|---|---|
| **Supabase** | Singapore | PII + transactional data, **including the biometric face vectors** (corrected 2026-07-31 — see § 5.3) | Managed database hosting |
| **Cloudflare (R2)** | APAC region | Media, the **source selfie images** for face enrolment, vendor documents. *(Not the face vectors — corrected 2026-07-31, see § 5.3.)* | Object storage / CDN |
| **Resend** | United States | Recipient email + message content | Transactional email delivery |
| ~~**Persona / Veriff / Onfido**~~ | ~~US~~ | — | 🛑 **NOT A SUB-PROCESSOR. STRUCK 2026-08-24.** The flag on this row is resolved: the slots it served were **retired 2026-07-03**, so this is not a stub awaiting activation — **no relationship exists and no personal data has ever flowed.** Naming them in a filing would declare a cross-border transfer of Filipino identity documents that does not happen. |
| ~~**AMLC API / ComplyAdvantage**~~ | ~~PH / UK~~ | — | 🛑 **NOT A SUB-PROCESSOR. STRUCK 2026-08-24.** Same resolution — `amlc_screening` was retired 2026-07-03. **No sanctions or PEP screening is performed.** |
| **Vercel** | US | Every request to the application — IP, user agent, request path, and any personal data in transit | ➕ **ADDED 2026-08-24 — THE APPLICATION IS HOSTED HERE.** Named **zero times** in this manual while processing every request the product serves. Verified in the production deploy workflow. |
| **Sentry** | US | Error payloads, which may incidentally carry identifiers present at the moment of a fault | ➕ **ADDED 2026-08-24.** Named **zero times** here; present as an application dependency. ⚠ Whether it is *enabled* in production cannot be read from source — the DPO should confirm before filing. |
| **LanguageTool** | EU | Editorial text submitted for grammar/style scanning — may contain names a couple wrote | ➕ **ADDED 2026-08-24.** Named **zero times** here; used by the editorial scan and the admin editorial review. |
| **DTI Database** | PH | Vendor DTI certificate number | Business-registration validation |
| **Anthropic / OpenAI** | US | Vendor contract text (AI features only) | Contract analysis and AI features; the specific model is **not named to users**. Configured for zero-retention where available. |
| **Suno** | United States | **No personal data** — not a personal-data sub-processor | Music generation (owned AI catalogue) |

All non-ASEAN sub-processors are bound by Standard Contractual Clauses (SCCs) or equivalent enforceable data-processing agreements. AI/verification/screening calls are batch/inference-only with no ongoing storage at the sub-processor where so configured. **‹OWNER TO SUPPLY: which sub-processors have a signed DPA on file (and the PostHog instance region, US or EU)›.**

---

## 9. Security Incident & Personal Data Breach Management

The PIC maintains a documented incident-response and breach-management process. Summary posture:

- **Detection & assessment.** Incidents are assessed by the DPO and response team to determine whether a **personal data breach** has occurred and its severity.
- **NPC notification.** Where the breach is notifiable, the NPC is notified **within 72 hours** of knowledge/confirmation, consistent with RA 10173 and NPC Circular 16-03.
- **Data-subject notification.** Affected data subjects are notified **within 72 hours** (in-app + email) of what data was involved, when, remedial actions taken, and recommended protective steps.
- **Public disclosure.** A breach summary is posted on `setnayan.com/security` within 7 days where appropriate.
- **DPO channel.** Breach inquiries go to **iscasasolaii@gmail.com**; a hotline (**‹OWNER TO SUPPLY: contact phone number (serves PIC + DPO + breach hotline)›**) is used for high-severity incidents.
- **Records.** All incidents and responses are documented for the mandatory breach report and NPC review.

> The full procedure — response team, severity matrix, containment/eradication/recovery steps, notification templates, and the breach register — is maintained in the **Data Breach Management Policy**: `NPC_Compliance/04_Data_Breach_Management_Policy_DRAFT_2026-07-05.md`.

---

## 10. Data Privacy Impact Assessments (DPIA)

The PIC conducts a **DPIA** before undertaking any processing that is likely to pose a risk to the rights and freedoms of data subjects — in particular new features involving sensitive or high-volume personal data (e.g., face vectors, the person graph, vendor identity verification, and any future minors/legacy processing). Each DPIA identifies data flows, risks, and mitigations, and is reviewed by the DPO before the processing goes live.

> The DPIA methodology and the register of completed/pending assessments are maintained in: `NPC_Compliance/05_DPIA_Register_DRAFT_2026-07-05.md`.

Minors' data and legacy/post-mortem processing are **not undertaken now**; when contemplated, each will be **counsel-first** and gated on a dedicated DPIA and guardian-consent/post-mortem mechanics.

---

## 11. Inquiries, Complaints & NPC Contact

- **Data subject inquiries and complaints** are directed to the DPO at **iscasasolaii@gmail.com**. The DPO acknowledges and responds within the timelines in § 6, coordinates rectification/erasure/objection, and maintains a record of complaints and their resolution.
- **Escalation to the NPC.** A data subject who is not satisfied may lodge a complaint with the **National Privacy Commission**:

  > National Privacy Commission
  > 5th Floor, Philippine International Convention Center (PICC) Complex, Vicente Sotto St., Pasay City, Metro Manila 1307
  > Email: info@privacy.gov.ph · Website: privacy.gov.ph
  > `[TO CONFIRM current NPC address/contact at time of filing]`

---

## 12. Review, Version Control & Effectivity

- **Ownership.** This Manual is owned by the DPO (Indalecio Sacdalan Casasola II) and approved by the PIC (Indalecio Sacdalan Casasola II).
- **Review cadence.** Reviewed at least **annually**, and additionally upon any material change to systems, sub-processors, or applicable law/NPC issuances.
- **Change control.** Material changes to processing are communicated to data subjects per § 7 and § 11 of the Privacy & Security Policy (30 days' notice; re-consent where required; public changelog).
- **Effectivity.** This Manual takes effect upon (a) the owner supplying the six fields in the "Fields the owner must supply before signing" checklist and (b) sign-off by the DPO/PIC below with an effectivity date. External PH counsel review is **recommended, not a precondition**; any change counsel or the NPC later requires is applied by a **dated amendment** (version table below). Until the owner fields are supplied and the block is signed, this Manual is **not yet adopted** and should not be filed.

| Version | Date | Author | Status |
|---|---|---|---|
| 0.1 (DRAFT) | 2026-07-05 | Prepared for DPO/counsel review | Not yet adopted |
| 1.0 (Adoption-ready) | 2026-07-24 | Formatted for DPO signature | Pending owner fields + signature (counsel review recommended, non-blocking) |
| Adopted | **‹OWNER TO SUPPLY: adoption date›** | Indalecio Sacdalan Casasola II (DPO) | Effective on signature (after owner fields; counsel review recommended, applied by amendment) |

**Approval blocks (to be completed on adoption):**

- PIC / Owner: Indalecio Sacdalan Casasola II — Signature: ______________ Date: __________
- DPO: Indalecio Sacdalan Casasola II — Signature: ______________ Date: __________

---

> **Footnote.** This document was drafted to a compliant RA 10173 baseline **ahead of counsel** to accelerate finalization. It **is not a substitute for legal review**, and external Philippine counsel review is **recommended** — but per the adoption posture above it is **not a precondition** to adoption or filing; any change counsel or the NPC later requires is applied by a **dated amendment**. Before filing, the DPO (Indalecio Sacdalan Casasola II) should still confirm every remaining owner-supplied fact is a real value and resolve the live status of the flagged identity-verification / sanctions-screening integrations so the declaration is accurate.
