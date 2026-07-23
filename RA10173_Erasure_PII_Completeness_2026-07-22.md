# RA 10173 Erasure — PII Completeness & DPO Queue

**Date:** 2026-07-22
**Status:** DRAFT for DPO (owner) + PH counsel. Companion to PR #3542 (erasure unblock) + the follow-up PR that extends the sweep.
**Context:** Account erasure is now soft-delete + anonymize (`eraseUserAccount` in `apps/web/app/admin/users/actions.ts`) — no `auth.users` DELETE, so NO FK `ON DELETE` behavior fires and ALL user-linked data persists unless explicitly scrubbed. A full schema audit mapped every place a user's personal data survives. This doc records what the follow-up PR scrubs and what is escalated for a legal ruling.

---

## ✅ Scrubbed by the follow-up PR (owner-scoped, clear PII, no shared/retention tension)

- **`users` identity row (extended):** + `religion(+consent)`, `civil_status(+consent)`, `sex(+consent)` (all **§3(l) sensitive PI**), `address_normalized`, `venue_address`, `venue_name`, `social_post_url`, `last_login_at`, `last_ghost_check_at` (on top of email→tombstone, display_name/phone/photo/birth_date/slug).
- **`people`** (the user's own claimed identity node): 7 PII columns nulled + `deleted_at`.
- **`user_face_profiles`** (account-level biometric template): row **deleted**.
- **`push_subscriptions`** (device endpoints/keys): deleted.
- **`dependents` + `godparents`** (private family records the user entered): deleted.
- **`guest_claims`** (own name/email when claiming a seat): anonymized.
- **`help_messages`** (support tickets authored): PII fields tombstoned/blanked, shell kept.
- **`vendor_profiles`** (the user's own shop — `user_id` UNIQUE = sole owner): contact PII nulled, name blanked, **unpublished**.
- **owned `events`** (member_type='couple'): + `owner_email`, `owner_display_name`, `photo_delivery_account_email`, and the **live encrypted photo-delivery OAuth token** nulled.

---

## ⚠ REALITY CHECK (2026-07-22, owner-flagged — the audit was schema-level, not data-level)

The audit found database **columns/tables**, which proves the *code* can hold this data — NOT that we actually collect it. Several "scary" items below are **retired or dormant scaffolding** and hold **no production data**:

- **Government ID scans, live selfies, phone/email OTP, AMLC screening — RETIRED 2026-07-03** (`lib/vendor-verification.ts:171` "we do not need this… what we have, that is it"). `government_id_r2_key` is **never written**. We do **not** collect ID scans or selfies.
- **Biometric face vectors — DORMANT.** Account face profile is behind `NEXT_PUBLIC_ACCOUNT_FACE_PROFILE_ENABLED` (OFF); Papic face vectors need a hosted model (`NEXT_PUBLIC_FACE_MODEL_URL`, not configured) → image-only, no vectors stored.
- **Google / TikTok / Instagram connected-login tokens — DORMANT.** Google OAuth is flag-gated (`NEXT_PUBLIC_OAUTH_GOOGLE_ENABLED`), TikTok returns `not_configured`, IG not wired. No live tokens to revoke.
- **Receipts** exist only for **admin-approved real PHP payments** (`issueReceiptForOrder`) — pre-revenue → near-zero volume.

**So the REAL user-uploaded files in R2 today are just: profile photos, vendor logos, and Papic event photos/videos.** The rows below stay documented for the day those features go live, but most carry no data now.

## ⚠ Escalated — DPO / counsel judgment calls (NOT auto-scrubbed)

Each needs a ruling on **anonymize vs delete vs retain**; recommendation given.

| Item | What survives | Recommendation | Why it's a judgment call |
|---|---|---|---|
| **Per-event guest biometrics** — `guest_face_enrollments` (`face_vector` JSONB, `asset_url` R2 selfie) | the user's face vector + selfie when they attended **someone else's** event | **DELETE row + R2 object** | needs target→guest_id resolution (via `people`/`event_members`); lives on another host's event |
| **R2 objects** — vendor verification docs (`government_id_r2_key`, DTI/BIR/mayor's-permit/bank-proof, live selfie, portfolio), chat **attachment files**, contract PDFs | gov-ID + selfie survive in DB **and** R2; deleted chat rows leave **orphaned R2 files** | delete objects; verification docs vs. legal-retention | R2 deletion is a separate op; contracts/verification may carry a retention duty |
| **Shared-event fields** — `bride_name`, `groom_name`, `event_name`, `venue_*`, `our_photos`/`photo_wall_photos` | half is the erased user, half the partner/co-hosts | partial-erasure ruling | erasing removes the co-partner's still-in-use context |
| **OAuth grants** — `oauth_grants`, `patiktok_oauth_grants` (`refresh/access_token`), `vendor_ig_connections.access_token_enc` | live connected-account **credentials** | **revoke at provider + delete** | nulling DB ≠ revoking at Google/TikTok; on shared events |
| **Financial / BIR** — `receipts` (`issued_to_tin`, `issued_to_email`), `orders`, `payments` (+ `screenshot_url` R2), `vendor_payouts` (`form_2307_url`), `vendor_payment_methods` (bank details) | tax/transactional PII | **RETAIN** rows (NIRC/BIR ~10yr); review payment-proof images | statutory retention overrides erasure |
| **Consent-audit** — `coordinator_access_consents`, `marketing_share_consents`, `account_deletion_requests` | names the erased subject | set retention window | consent **evidence** is often retained to prove lawful processing |
| **Fraud identity graph** — `user_devices`, `identity_clusters`, `fraud_signals`, `user_identity_signals` | device hash + linkage | **retention review already pending** ("counsel review pending" in-migration) | legitimate-interest fraud-prevention basis vs. erasure (note: the PR already nulls `users.address_normalized`, one input) |
| **Third-party PII the user entered** — `event_sponsors`, `event_manual_vendors`, `person_connections`, `households`, `guests` (when user is the host) | invitees'/others' data on a shared event | **LEAVE** (default) | it's the co-host's data, not the erased user's own |
| **`guests` (direction-dependent)** — when the user was themselves a **guest** at another's event | their name/contact/dietary/photo on that event | **ANONYMIZE that row** | needs target→guest_id resolution + scope call |
| **`vendor_reviews`** — user-authored public review body | their words, attributed | anonymize author link; decide body retention | public content about the vendor vs. the user's PII |
| **`vendor_client_notes`** — vendor's CRM notes about the couple | vendor's private notes | DPO call | erasure reaching a vendor's internal CRM is contested |

**Owner action:** rule on each escalated item as DPO; route the statutory-retention + fraud-graph + shared-record ones to PH counsel; then a further PR implements the approved deletes (incl. the R2 object deletions + guest-side biometric resolution). Not legal advice.
