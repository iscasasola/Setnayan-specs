# Papic v3 — Compliance + Admin Delta (2026-07-17)

> **What this is:** the owner's "update documents and admin" action for the Papic v3 counsel/DPO items. It enumerates (A) what must be added to the privacy/compliance corpus + the live `/privacy` page before counsel/DPO sign-off, and (B) the admin-console changes the build needs. Pairs with `Papic_Build_Brief_2026-07-17.md`. Counsel/DPO still sign off; this preps the material.

## A. Privacy / compliance documents to update

Targets: `NPC_Privacy_Compliance_Dossier_2026-07-12.md`, the live `/privacy` page (`apps/web/app/privacy/page.tsx`), the DPO one-pager, `0025` Privacy & Data surface. Reconcile with [`project_setnayan_privacy_reconciliation`].

1. **Capture points** — no new PI. A photo/clip count replaces the photo+clip counters; no personal data added. Note it's a billing/quota unit only.
2. **Face-vector 5-year expiry (NEW retention control — helps compliance).** Add to the retention schedule: per-event `guest_face_enrollments.face_vector` is nulled at ~5 yr (anchor = GREATEST(event_date, created_at) + 1825d); the photo stays. **Open for DPO:** does the enrollment *selfie* asset (`asset_url`, a biometric original) get purged at expiry too, or retained? Account-level `user_face_profiles` is governed separately (account deletion) — state that it's untouched by this per-event rule.
3. **6-month full-res window + drop.** Add to the retention schedule: full-res photos AND 5-sec clips are kept 6 months, then dropped from our R2 unless Drive-synced; the compressed gallery (photos + compressed clip copies) is kept indefinitely. Right-to-erasure: dropping/purge honors account deletion.
4. **Google Drive (`drive.file`).** Disclose the least-privilege scope (we only write to a folder we create; can't read the rest of the Drive), 2-Drives/event, and how OAuth tokens are stored. **Open for security/DPO:** `oauth_grants.refresh_token` is plaintext today — decide app-layer encryption vs service-role-RLS + at-rest, and state the chosen control in the dossier.
5. **Papic Lite crowd-capture (the biggest new flow — needs the most).**
   - **Bystander/subject consent:** an open, public-QR photo pool captures non-participants. Document the QR-join consent gate, the "host owns and controls this pool" notice, and the host's DPA-controller role.
   - **No face-search in Lite** (biometric-free) → the RA 10173 subject-access/erasure mechanism is a **public takedown/complaint form** (routes to host + admin), NOT face-lookup. Document this as the objection path.
   - **Minors** in crowd events (concerts/reunions/tournaments): add the minors-present notice + host acknowledgment.
   - **NSFW (non-disableable) + CSAM known-hash matching** with mandatory-reporting obligations — document the pipeline + the reporting duty (counsel-reviewed).
   - **Email/magic-link join claim:** a consent record + Sybil control; disclose what's stored (email, consent timestamp/version, device/IP hash) and its retention.

## B. Admin-console changes (0023) the build needs

1. **Papic caps editor — add the 3rd (Mini) field.** The event editor currently exposes Ltd + Unli caps; PR-2 added `papic_mini_cap_php`. Without the field it's un-editable post-migration. (Reminder: the new admin-only trigger means only admin/service-role can change caps.)
2. **`papic_tier_config` editor** — the new admin-editable source for per-tier point budgets + caps + rate SKUs. Needs an admin surface (or leave to SQL initially).
3. **Papic Lite moderation panel** — host-facing (hide/remove/block a participant/capture) PLUS an admin escalation surface: the CSAM/NSFW review queue, the public-takedown-complaint queue, and the report → confirm/dismiss actions (reuse the `ugc_moderation` stack).
4. **Enterprise Lite pool (>100k photos)** — the two-admin approval gate (mirror the existing two-admin decision queue).
5. **Retired-SKU hygiene** — ensure the admin catalog reflects Unlock-all + Keep-Full-Res deactivated and Live Photo Wall hidden (do not surface on any Papic buy path).

## C. Not a document/admin change — resolved this session

- **RESEND:** the email system is fully built + wired (`lib/email.ts`, Resend); it sends in prod iff `RESEND_API_KEY` is set in the Vercel env. Since the live app already sends other emails, it's almost certainly set — **verify in Vercel, no build work.**
- **Instant-pay rail:** Papic Lite uses the **standard apply-then-pay** flow like every other SKU (0034 spine). Same-day activation is covered by the **free capture-now preview bridge** (start free, payment reconciles in the background) — **no new payment rail needed.**
- **Quality:** fixed per product (wedding = Optimal 12 MP · Lite = High-Efficiency), no picker; clips compress at 6 mo. See `Papic_Good_Better_Best_Pricing_2026-07-17.md` § 5.
