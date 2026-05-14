# Setnayan Privacy & Security Policy · v1

> The binding policy governing how Setnayan collects, stores, processes, and protects personal data of customers, vendors, and guests. Locked 2026-05-12. PH Data Privacy Act (RA 10173) compliant. Every Setnayan account-holder accepts this policy at registration.

## 1. Scope of personal data collected

### 1.1 Customer data (couples / organizers)

- **Identity:** full name, mobile, email, optional profile photo
- **Event:** wedding date, venue, target pax, role within event
- **Financial:** payment receipts, transaction references, partial bank/e-wallet details for receipts and refunds (we do NOT store complete card numbers, CVVs, or full bank account numbers)
- **Behavioral:** in-app activity (which surfaces visited, which services purchased, vendor interactions), Guided-mode decisions, search queries
- **Content:** photos uploaded for Save-the-Date renders, paparazzi captures (when customer is the couple), invitation customizations
- **Communications:** chat messages exchanged with vendors / coordinators (0019), video call recordings (only when consented)

### 1.2 Vendor data

- **Identity & business:** DTI/SEC registration, BIR Form 2303, business address proof, government-issued ID of primary representative, business name + slug
- **Service profile:** category, service area radius, sample portfolio, exclusive Setnayan offer, pricing
- **Financial:** bank/e-wallet payout account, transaction history (payments received via Setnayan Pay)
- **Behavioral:** in-app activity, response times to inquiries, booking conversion rate
- **Communications:** chat messages with customers / coordinators (0019), call recordings (consented only)

### 1.3 Guest data

- **Identity:** full name, mobile, email, optional profile photo
- **Event linkage:** which events the guest is associated with, role at each (e.g., principal sponsor, secondary sponsor, family, friend), RSVP status, table assignment
- **Content:** photos and clips the guest captures via the per-guest camera; photos the guest is tagged in (taken by paparazzi seats or other guests)
- **Behavioral:** which Personal Reels they built, which global photos they re-shared

### 1.4 Face vectors (specific category)

128-dimension face vectors generated from RSVP profile photo + optional pre-event portal upload + on-the-day check-in kiosk. Used for auto-tagging in the event's gallery.

- **Per-event scoped:** vectors never reused across weddings
- **Stored encrypted at rest** in the per-event vector store
- **Deleted at 5-year retention boundary** per § 4
- **Guest "Delete my face data" link** revokes within the next 5-minute refresh cycle

## 2. How data is used

### 2.1 Primary purposes (always)

- Provide the contracted Setnayan services to customers, vendors, and guests
- Match couples to vendors via Guided mode and DIY discovery surfaces
- Process payments (BDO + GCash apply-then-pay; PayMongo / GCash Merchant API in V1.5+)
- Auto-tag photos via face matching (couple-scoped only)
- Send notifications about event milestones, vendor confirmations, payment reminders
- Provide platform analytics to Setnayan admins (aggregated, never individually identified to admins outside of dispute mediation context)

### 2.2 Secondary purposes (with consent)

- Use generic event data (anonymized, aggregated) for platform improvement and machine-learning model training
- Use specific renders / captures as marketing samples (requires separate written opt-in per § 6)
- Send promotional communications about new in-app services

### 2.3 Never used for

- Selling personal data to third parties (no data brokers, no advertisers)
- Targeted advertising outside Setnayan
- Sharing with the government except as required by Philippine law (subpoena, court order)
- Cross-vendor data sharing without explicit customer consent

## 3. Where data lives

### 3.1 Database (PII + transactional)

Supabase Postgres in Singapore region (closest PH availability) — separate `users`, `events`, `event_members`, `vendors`, `vendor_registrations`, `chat_messages`, `bookings`, `payments`, and `audit_log` tables. Encrypted at rest (AES-256). RLS (Row-Level Security) policies enforce per-user access — customer A cannot read customer B's events; vendor X cannot read vendor Y's payouts.

### 3.2 Media (photos / videos / face vectors)

Cloudflare R2 in PH region. Originals stored with signed URL access only (no public reads). Face vectors stored in a per-event encrypted vector index. Media keyed by event with hierarchical access:
- Customer (event organizer) — read all event media
- Coordinator — read all event media within the event's join-permission scope
- Guest — read only tagged photos + global photos
- Vendor — read only photos relevant to their booking
- Setnayan Team — read on mediation cases only; never bulk-export

### 3.3 Communications (0019 chat + video)

Supabase Realtime channels for live chat (ephemeral); messages persisted to Postgres for history. Daily.co hosted SFU for video meetings (recordings only when consented; stored in R2 thread-files bucket).

### 3.4 Vendor-uploaded documents (DTI, BIR, ID)

Dedicated R2 bucket `setnayan-vendor-verification` with extra-restricted access — only Setnayan Team Verification Handler role can read; documents auto-deleted 90 days after vendor approval (retain only DTI/SEC + BIR for tax/legal record; ID + business address proof purged).

## 4. Retention windows

| Data type | Hot retention | Cold retention | Deletion trigger |
|---|---|---|---|
| Customer account profile | Active | — | User deletes account; 30-day grace then purge |
| Customer event data | 5 years post-event | — | Auto-purge T+5 years; user can request earlier deletion |
| Photo/video originals | 90 days hot R2 | 5 years IA R2 | Per the 30-day-post-download compression rule + 5-year hard limit |
| Face vectors | Per-event lifetime + 5 years | — | Auto-purge with event data |
| Vendor account profile | Active | — | Vendor deletes; 30-day grace then purge |
| Vendor verification docs (DTI/BIR) | 90 days hot | 7 years cold | Tax/legal retention; ID + address proof purged at 90 days |
| Vendor transaction history | 5 years | — | Tax compliance |
| Chat messages | 5 years | — | Aligned with event retention |
| Video meeting recordings | 90 days | — | Auto-purge unless customer/vendor extends |
| Audit log (admin actions) | 5 years | — | Tax/legal compliance |
| Anonymized aggregate data | Indefinite | — | No PII — never auto-purged |

**User deletion right:** any customer, vendor, or guest can request full account deletion via a "Delete my account" surface in their settings. Setnayan Team confirms within 30 days. Deletion cascades to: profile, event memberships, face vectors, individual photos taken of them (subject to event-organizer consent if photos are part of a shared event gallery), chat history. **Exception:** transactional records required for PH tax law (Form 2303 vendor records, payment receipts) are retained per § 4 timing.

## 5. Access control & authentication

### 5.1 User authentication

- Email + password (bcrypt-hashed, never plaintext)
- OR mobile + OTP (6-digit SMS code, 5-minute expiry)
- OR Google / Apple SSO (limited PII shared)
- Two-factor authentication available for customer + vendor accounts (TOTP); mandatory for all admin roles

### 5.2 Session management

- Sessions expire after 30 days of inactivity
- Refresh tokens stored httpOnly; never accessible to JS
- Single sign-out option logs out all devices

### 5.3 Authorization (RLS policies)

- All Postgres queries gate through Supabase RLS — no client can read another user's row
- Storage signed URLs are short-lived (5 minutes for sensitive media)
- Admin role gates per the seven granular roles (§ 10 of Vendor Agreement) — each admin can only access surfaces their role permits
- Two-admin approval required for: role provisioning, brand-config flips, refunds > ₱10K, unlimited-use grants > ₱10K retail value

### 5.4 Audit log

Every admin action is logged with: timestamp, admin user, action type, target user/entity, before/after state, rationale field. Logs are append-only (no UPDATE permission). Only Ops Lead can export.

## 6. Consent management

### 6.1 Photos and likeness

- Guests opt in to face detection via RSVP profile photo (implicit consent — they uploaded the photo for this purpose)
- Guests can opt out of face detection at any time via "Photo Consent" toggle in their profile
- Guests can opt out of being photographed by paparazzi seats — vendors are notified to face-blur these guests in any captures
- Couples consent to media residency in PH (R2 PH-region buckets)

### 6.2 Marketing samples

Specific renders / captures used as Setnayan marketing samples require **separate written opt-in** captured in the customer's settings — distinct from the general Privacy Policy acceptance. Customers can revoke this opt-in at any time; existing marketing materials using their content are removed within 90 days.

### 6.3 Vendor data in customer reviews

Customer reviews of vendors are public by default (the marketplace's social proof system). Reviews cannot be deleted by vendors (per § 3.6 of the Vendor Agreement). Vendors may file mediation requests for review removal in cases of factual error / harassment / non-customer posting; outcomes are logged.

## 7. Security practices

### 7.1 At rest

- AES-256 encryption on Postgres + R2
- Encryption keys managed by Supabase / Cloudflare key management services
- Database backups daily, encrypted, retained 30 days

### 7.2 In transit

- TLS 1.3 on all external connections (setnayan.com, all api endpoints, all WebSocket channels)
- HSTS enabled on production
- Mixed-content blocked

### 7.3 Application security

- Input validation at every entry point (zod / similar)
- SQL injection prevented by parameterized queries (Supabase client)
- XSS prevented by React's default escaping + CSP headers
- CSRF tokens on every state-changing request
- Rate limiting on auth endpoints (login, password reset, OTP requests)

### 7.4 Operational security

- Production database access restricted to Setnayan Team Lead + DevOps roles
- Critical-action audit log monitored daily
- Quarterly security review by external auditor (V1.5+)
- Bug-bounty program (V2)

## 8. Breach notification

In the event of a data breach affecting personal data:

- **Within 72 hours of confirmation:** Setnayan notifies the National Privacy Commission (NPC) per RA 10173
- **Within 72 hours of confirmation:** Affected users notified in-app + via email of: what data was accessed, when, what we're doing about it, what they should do (change password, monitor accounts)
- **Public disclosure:** breach summary posted on `setnayan.com/security` within 7 days
- **DPO contact:** dpo@setnayan.com for breach inquiries; phone hotline for severity-high incidents

## 9. Data Protection Officer (DPO)

Setnayan's DPO is registered with the Philippine National Privacy Commission. The DPO is the contact point for:

- Data subject access requests (a user asking what data we have on them)
- Right to rectification, erasure, or restriction
- Privacy complaints
- Breach notifications

**DPO contact:** dpo@setnayan.com · response within 7 business days for non-urgent requests; immediate for breach notifications.

## 10. Cross-border data transfers

Setnayan's primary infrastructure is Singapore (Supabase) + PH region (Cloudflare R2). When data crosses the SG / PH border (which it does for routine application operations), the transfer is:

- Encrypted in transit (TLS 1.3)
- Governed by Cloudflare's and Supabase's PH-compliant data processing agreements
- Subject to NPC oversight per RA 10173

No personal data is transferred to jurisdictions outside ASEAN unless required for specific contracted services (e.g., Daily.co for video — US-based provider with EU-equivalent privacy commitments).

## 11. Acknowledgments and changes to this policy

Setnayan reserves the right to update this Privacy Policy. Material changes require:

- 30 days' advance notice to all account holders via in-app + email
- Re-consent prompt at next login if changes affect data usage
- Public diff posted on `setnayan.com/privacy/changelog`

Continued use of the platform after the notice period constitutes acceptance of the updated policy.

---

## Appendix A — User rights summary (under RA 10173)

Every Setnayan account holder has the right to:

1. **Be informed** of what personal data is collected and how it's used (this document)
2. **Access** their personal data — request a copy via `dpo@setnayan.com`
3. **Object** to processing — opt out of specific data uses
4. **Rectify** errors in their data — edit their profile + request corrections
5. **Erase / block** their data — delete their account
6. **Damages** — file a complaint with the NPC if their rights are violated
7. **Data portability** — export their event data, photos, chat history in machine-readable format
8. **Be notified** of breaches affecting their data

## Appendix B — Linked iterations and policies

- **Setnayan_Vendor_Agreement.md** — vendor-specific terms; this policy is referenced in § 12 of the Agreement
- **0006 Vendors Management** — vendor data schema
- **0019 Communications** — chat / video data handling
- **0023 Admin Console** — audit log + role-based access
- **0024 Save-the-Date** — render media handling

---

## Vendor + customer + guest acknowledgment

By creating a Setnayan account, the user acknowledges they have read and accept this Privacy & Security Policy. Acceptance is logged with timestamp + IP + user-agent in the `policy_acceptances` table per user.
