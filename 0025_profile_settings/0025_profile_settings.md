# Iteration 0025 — Profile Settings & Privacy Controls

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - Profile settings ship at **`/dashboard/profile`** (single shared shell), NOT the `/dashboard/[event-id]/settings/`, `/dashboard/vendor/settings/`, `/admin/settings/profile` URL trio described here. It exposes profile fields, soft-delete-my-account (30-day grace), and a conditional Concierge link — not the full 7-tab left-rail.
> - **Tab 2 Appearance is GONE: the theme picker was light-locked 2026-06-04.** Setnayan always renders light; `users.theme_preference` is dormant (see `_components/theme-provider.tsx`). The 5-theme picker + Victorian/Classy/iOS/Forest variants in § 3.2 are not in the product.
> - **Tab 7 Setnayan Concierge (₱4,999 · 3-day trial · enforcement tiers) is effectively OFF:** `CONCIERGE_ENABLED = false` in `lib/concierge.ts`, so the entire § 3.7 surface is gated off. The planner SKU on the live site is **"Setnayan AI" ₱1,499**, not "Setnayan Concierge ₱4,999," and the couple-app planning *wizard* is retired (SKU/branding persists on the site only).
> - **Tab 5 Payment Methods:** Setnayan order payment is **apply-then-pay + manual admin approval** (no card charge); any "Setnayan Pay 3% convenience fee" in the payment-history copy is RETIRED — **commission is 0%**. Off-platform vendor pay (the 2026-06-04 note at the bottom) is correct: Setnayan never holds vendor money.
> - § 3.6.2 already flags the soft-delete + 30-day-grace model as deprecated for admin actions; the shipped *user-side* `softDeleteAccount` still does a 30-day soft-delete (kept, not replaced). The 0026/BIR-fed "Tax Documents" sub-tab is moot — **BIR (0026) is being retired** and the vendor tax-documents page redirects.
>
> When this body disagrees with the above, **the above wins.**

**Iteration number:** 0025
**Topic:** Profile Settings surface and the RA 10173 privacy-controls layer (account deletion + data export). Lives inside each existing dashboard (customer / vendor / admin) as a shared shell with role-specific tabs enabled.
**Surface:** All three role surfaces under their respective dashboards. Same component shell, role-driven section visibility.
**URL patterns:**
- Customer: `setnayan.com/dashboard/[event-id]/settings/`
- Vendor: `setnayan.com/dashboard/vendor/settings/`
- Admin: `setnayan.com/admin/settings/profile`

**Builds on:** 0000 (auth + `users`), 0002 (slug), 0013 (Supabase + R2 platform stack), 0019 (notification preferences consumed by chat), 0021 (couple dashboard chrome), 0022 (vendor dashboard chrome), 0023 (admin console chrome).
**Provides to downstream iterations:**
- 0026 (BIR / tax compliance) reads the payment-history view introduced here
- 0028 (email notifications) reads `notification_preferences`
- All future surfaces read `users.theme_preference` and `users.locale_preference`

**Status:** Drafted 2026-05-12.
**Phase:** V1 launch-blocking — RA 10173 compliance is non-negotiable for any PH consumer platform per the locked Privacy & Security Policy. The data-export and account-deletion features in tab 6 are the legally required pieces; the rest of the tabs are baseline UX hygiene.

---

## 1. Why this iteration exists

Every iteration before this one has shipped surface-specific settings inline (notification toggles inside chat, slug check inside the invitation editor, face-detection toggle inside the gallery). That scatter-pattern was acceptable while we were drafting iterations independently, but it leaves the user without a single place to:

- Change their email or password
- Pick a theme or locale
- Manage notification preferences across categories
- Exercise their RA 10173 rights (data export, account deletion, marketing consent withdrawal)

The Privacy & Security Policy (locked 2026-05-12) names two rights that **must** be machine-actionable in the product, not "email DPO and wait":

- **Right to data portability (§ 18):** the user can download all their data in a structured, commonly-used, machine-readable format.
- **Right to erasure (§ 16(e)):** the user can request deletion of their account and have it processed within a defined window.

A "contact DPO via email" workflow technically satisfies the letter of RA 10173 but fails the spirit and exposes Setnayan to NPC complaints. Pulling both rights into a self-service Settings tab is the correct posture for a consumer platform of Setnayan's scale.

The other five tabs are the conventional surface every user expects to find under a Settings cog. Shipping them in one iteration means the cog-icon-leads-to-Settings invariant holds across all three roles from V1 launch.

---

## 2. Surface architecture

### 2.1 Shared shell, role-driven sections

The Settings surface is one React component (`<SettingsShell />`) parameterized by the current role. It renders **seven** tabs in a left-rail layout on desktop and a horizontal scroll on mobile (Tab 7 Setnayan Concierge added 2026-05-14 as "Guided Planner"; renamed to "Setnayan Concierge" 2026-05-16 per the repricing lock). Each tab's visibility is gated by role:

| Tab | Customer | Vendor | Admin |
|---|---|---|---|
| 1. Profile | full | full (business name read-only) | full |
| 2. Appearance | full | full | full |
| 3. Notifications | full | full | full + admin-only "internal-account creation" category |
| 4. URL & Slug | full (event slug) | full (vendor slug) | n/a (hidden) |
| 5. Payment Methods | full | n/a (vendor payouts live in 0022 § 6) | n/a (hidden) |
| 6. Privacy & Data | full | full | partial (cannot self-delete · § 6.2 exception) |
| **7. Setnayan Concierge** | **full (per event)** | **n/a (hidden)** | **n/a (hidden)** |

A user with multiple roles (`event_members.member_type` spans couple + guest, or a customer who later becomes a vendor) sees the Settings cog jump them to the role-appropriate Settings page. Switching role via the top-chrome "Switch view" pill (per one-app-three-doorways) re-renders Settings against the new role context.

### 2.2 Mobile considerations

Mobile views collapse the left-rail nav into a top-of-screen segmented control that horizontal-scrolls past the visible viewport. Every primary action (Save, Delete, Export) sits in the thumb zone (lower third). Destructive actions (delete account, withdraw consent) require a typed confirmation; mobile renders the typed-confirmation field with a 16pt minimum tap target.

---

## 3. The six tabs

### 3.1 Tab 1 — Profile

| Field | Customer | Vendor | Admin | Notes |
|---|---|---|---|---|
| Display name | editable | n/a | editable | Customer's social name; appears on chat bubbles + guest-list rows |
| Business name | n/a | **read-only** | n/a | Change requires admin re-verification per Vendor Agreement § 3.1 |
| Email | editable | editable | editable | Change triggers two-email verification flow: confirmation link to old address + confirmation link to new address; both must click within 24h |
| Password | editable | editable | editable | Current → new → confirm; new must satisfy 12-char min + 1 number + 1 symbol per Privacy Policy § 4.3 |
| Profile photo (customer) | editable | n/a | editable | R2 `setnayan-media` key `users/{user_id}/avatar/{uuid}.{ext}` · EXIF strip on upload |
| Company logo (vendor) | n/a | editable | n/a | Per Vendor Agreement § 1.1; propagates to all surfaces within 5 min via CDN purge |
| Phone number | optional | optional | optional | E.164 format · V1 stores only · SMS delivery wired in V1.5 (0028 dependency) |

**Email change flow safeguards:** The new email cannot already be associated with another `users` row. If the user has unread security-alert notifications older than 24h, the change is blocked with a "review pending security alerts first" message — defends against a compromised session changing email to lock out the legitimate owner.

### 3.2 Tab 2 — Appearance

Three controls. All persist on `users` (schema § 4) and apply immediately without page reload.

**Theme picker.** Five V1 themes per `02_Specifications/Theme_System_Implementation_Spec.md`:
- Setnayan Default (cream + ink + deep burgundy accent — accent swapped from terracotta to burgundy 2026-05-15; the platform brand baseline)
- Victorian (aged paper + deep burgundy + gold leaf + ornate Playfair italic — Bridgerton / heritage-formal)
- Classy (ivory + champagne gold + Cinzel display — understated luxury)
- iOS (system-grey + system-blue accent · Apple-Settings rendering)
- Forest & Champagne Gold (warm off-cream + deep forest accent + champagne secondary tint — vendor-grounded / professional)

Selecting a theme writes `users.theme_preference` and reloads the CSS variable bundle. Theme applies to every surface the user owns; vendors who want vendor-side public theming must hold a Vendor Pro Weekly subscription (forward-referenced in 0022 § 7) — without it, the customer-side marketplace listing always renders in Setnayan Default.

**Locale preference.** `EN | TL | CEB` segmented pill. Writes `users.locale_preference`. In-app strings load from the matching `locale.<code>.ts` bundle. V1 ships the in-app string bundle for `en` only; `tl` and `ceb` complete in V1.5 per the 0015 locale rollout. Until then, switching to `tl` or `ceb` shows a "Coming soon — your preference is saved" notice and keeps rendering EN.

**Density.** Compact / Comfortable. Applies a CSS spacing-scale multiplier (1.0× vs 1.25×). Default is Comfortable. Compact targets vendors running dashboards on laptops who want denser tables.

#### Dashboard language toggle (locked 2026-05-12 — EN/TL only in V1)

While the marketing site (0015) supports EN / TL / CEB, V1 in-app dashboards ship with **English + Tagalog only**. CEB deferred to V1.1.

**Settings → Appearance → Language:**

- Toggle: English (`en`) · Tagalog (`tl`)
- Stored as `users.language_preference` (extends from the existing `users.theme_preference`)
- Applied at SSR via Next.js i18n routing: `setnayan.com/en/dashboard/...` vs `setnayan.com/tl/dashboard/...`
- All dashboard chrome strings live in `apps/web/locales/dashboard.{lang}.json` bundles
- Date/number/currency formatting respects the locale (₱ stays as ₱; date format flips between MM/DD/YYYY for EN and DD MMM YYYY for TL)

V1 translation scope: dashboard chrome + bot-nav + button labels + form labels + empty states + error messages. Articles in the help center (0029) stay English-only in V1 per the 0029 decision.

### 3.3 Tab 3 — Notifications

A master toggle ("All notifications") sits at the top. When off, every row below is disabled (writes are blocked, UI is greyed) — same pattern as iOS Do Not Disturb.

**Category rows.** Each row shows the category label, a one-line explainer, and two checkboxes (in-app · email):

| Category | Customer | Vendor | Admin | Default |
|---|---|---|---|---|
| Payments | yes | yes | yes | both on |
| Vendors | yes | n/a | yes | both on |
| Events | yes | yes (as bookings) | yes | both on |
| Account | yes | yes | yes | both on |
| Marketing | yes | yes | yes | **both OFF** — explicit opt-in per Privacy Policy § 6.2 |
| Internal accounts | n/a | n/a | yes (admin only) | both on |

Each category writes a row into `notification_preferences` (schema § 4). Email column requires a verified email on the account — if email is unverified, the email checkbox is disabled with a "verify your email first" hint.

**Quiet hours.** A single time-range picker (start hour → end hour, local time per IANA tz). When set, push and email notifications are queued during the window and delivered at the end. In-app notifications still surface (they're passive — they don't ping). Quiet hours apply across all categories; per-category quiet hours are V1.5.

**Default reminder offsets** (events category): T-7d, T-1d, T-1h. Not configurable in V1; configurable per-event in V1.5.

### 3.4 Tab 4 — URL & Slug

Reuses the slug check component from 0002 § 4.

**Customer side:** the event slug (`setnayan.com/[event-slug]`). Real-time availability check (debounced 300ms). On change, the 90-day SEO redirect explainer renders: "Your old URL stays redirected to your new one for 90 days. After 90 days, the old slug becomes available for someone else." Schema: `event_slug_redirects` already exists from 0002.

**Vendor side:** the vendor slug (`setnayan.com/v/[vendor-slug]`). Same component. Vendor-slug changes also propagate to the vendor's marketplace card and chat thread routing.

**Admin side:** tab hidden. Admins do not have public URLs.

### 3.5 Tab 5 — Payment Methods

**Customer side only.** Vendor side is hidden (vendor payouts are managed in 0022 § 6, not here). Admin side is hidden.

**V1 (apply-then-pay).** Static informational block:

> Setnayan accepts payments via BDO bank transfer and GCash. Each order generates a payment instruction email with a unique reference code. Pay using the reference code, then the Setnayan Team verifies the payment within 24 hours and your service activates.
>
> **[View my payment history]** — links to a dedicated `/dashboard/[event-id]/payments` view (introduced here) showing one row per `service_orders` record with status, amount, reference code, and date.

**V1.5 (planned).** This tab will expand to saved-card / saved-GCash management when Setnayan Pay automation lands. Schema is forward-compatible: `customer_payment_methods (method_id, user_id, method_type, brand?, last4?, masked_account?, created_at, deleted_at?)` table reserved but not populated in V1.

**Payment history view.** Read-only table:
- Date · Service · Amount (₱) · Reference code · Status (`pending_payment` / `paid` / `failed` / `refunded`) · Receipt download (PDF — generated on demand via Cloudflare Worker)
- Filterable by date range and status
- CSV export for accountants (consumed by 0026 BIR compliance)

### 3.6 Tab 6 — Privacy & Data (the RA 10173 surface)

This is the legally critical tab. Five subsections, in order.

#### 3.6.1 Data export — Right to data portability (RA 10173 § 18)

**Button:** "Download all my data"

Clicking initiates an asynchronous background job. The button immediately becomes disabled with the new state "Export in progress — we'll email you when it's ready" and a status badge shows next to it. The user can leave the page; the job continues server-side.

**The job (Cloudflare Worker triggered via Supabase Edge Function):**

1. Insert a row into `data_export_requests` with `status='pending'`.
2. Flip to `status='generating'`.
3. Compile the user's data into a temporary working directory:
   - `profile.json` — full `users` row (PII included since this is the user's own data) + `event_members` rows
   - `events.json` — for customers: every `events` row the user is on as couple/guest, plus seating chart, guest list, mood board palettes
   - `services.json` — for vendors: every `vendor_services` row, every `service_bookings` row (with counterparty name + email redacted to first-letter + domain), every milestone
   - `chat_messages.json` — every message sent or received. Messages where the counterparty has not consented to data export get the counterparty's name redacted; the user's own messages always render in full.
   - `photos/` — every photo the user contributed via Papic or guest-camera (original quality if hot-tier; compressed if past the 90-day window), plus `photos_manifest.json` mapping filenames to metadata (captured_at, geo if not stripped, tags)
   - `payment_history.json` — for customers: every `service_orders` row + receipt PDFs in a `receipts/` subfolder
   - `face_vectors.json` — every `face_enrollments` row owned by the user (vector blob base64-encoded), one entry per event
   - `README.txt` — explains the ZIP structure, lists what's included, names the file formats, points at dpo@setnayan.com for questions
4. ZIP the directory, upload to R2 bucket `setnayan-exports` under key `exports/{user_id}/{request_id}.zip`. Bucket access is signed-URL-only; the URL TTL is 30 days from `ready_at`.
5. Flip to `status='ready'`, set `r2_export_key`, `ready_at`, `expires_at = ready_at + 30 days`.
6. Send the user an email with subject "Your Setnayan data is ready to download" containing the signed URL and the expiry date.

**SLA:** the job must complete within 7 days. In practice, most exports finish within minutes — only large photo galleries push toward the upper bound.

**On download:** writes `downloaded_at` and flips status to `'downloaded'`. The signed URL remains valid until `expires_at` so the user can re-download within the 30-day window.

**On expiry:** a scheduled job at 00:00 PHT daily flips any `status='ready'` rows whose `expires_at < NOW()` to `'expired'` and deletes the R2 object. To download again, the user clicks the button to enqueue a fresh job.

**Rate limit:** one in-flight export per user. Multiple requests within 7 days while a previous export is still valid show: "Your last export is still available — re-download or wait until it expires."

#### 3.6.2 Account deletion — Right to erasure (RA 10173 § 16(e))

> **Status note (locked 2026-05-13 · PR #9 · amended into spec 2026-05-16):** the **two-tier soft-delete + 30-day grace window** model described below is **DEPRECATED**. PR #9 retired the `users.deleted_at` write path and the 100-year `auth.users.banned_until` ban; an admin now uses **🗑 Delete (hard-delete, email free for re-signup)** or **🚫 Blacklist (hard-delete + lock the email)** from `/admin/users` — see iteration 0023 § 3.4 Users for the canonical actions + the new `blacklisted_emails` schema. **For user-side self-erasure under V1:** the "Delete my account" button is disabled whenever the user has any active event / active booking / outstanding financial obligation (per the 2026-05-15 event-lifecycle lock — see § 9 of iteration 0021 + the "Exceptions that BLOCK deletion entirely" list at the bottom of this subsection), and routes to **"Contact support to discuss deletion"** instead. Support escalates to admin, who chooses Delete or Blacklist. **For users with no active events / bookings / balances:** self-erasure under V1 routes through the same admin flow — the V1 user-side surface enqueues an erasure request that an admin actions within 24 hours; there is no self-serve immediate-delete path. **The soft-delete + 30-day grace window described below is retained in this spec only as historical reference for the deprecated PR #7 model.** Future Cowork pass: rewrite this section to spec the user-side erasure-request flow (a 1-button "Request account deletion" → admin queue → Delete or Blacklist per admin's call), and drop the soft-delete + grace-window narrative entirely.

---

**Two-tier delete: soft (reversible 30 days) and hard (irreversible).** _[DEPRECATED — see status note above.]_

**Soft delete (default path, immediate UX, reversible):** _[DEPRECATED]_

1. User clicks "Delete my account."
2. Modal opens with the full consequences laid out (see "Consequences modal" below).
3. User must type their email address into a confirmation field to enable the "Confirm deletion" button.
4. On confirm:
   - `users.deleted_at = NOW()`
   - `users.deletion_initiated_by = users.user_id` (self-initiated)
   - All active sessions invalidated (next API call returns 401)
   - Confirmation email sent: "Your Setnayan account is scheduled for deletion. Sign in within 30 days to restore it."
   - User is signed out and redirected to the marketing site

**Consequences modal copy (locked):**

> **Deleting your account will:**
> - Hide your profile from vendors and other customers immediately.
> - Cancel your access to all events and bookings you're a part of.
> - **Keep your data for 30 days** — sign in again within 30 days to restore your account fully. After 30 days, your data is permanently deleted.
>
> **Some things stay** — for legal, accounting, and counterparty obligations:
> - Active events and bookings remain visible to the other party (e.g., your vendor still sees the booking they're contracted on).
> - Audit logs of actions you've taken stay for 5 years, anonymized.
> - Photos you contributed to other people's galleries stay in those galleries (the gallery is theirs, not yours).
>
> **Type your email address to confirm:** `[__________________]`

**Hard delete (irreversible, auto-triggered after 30 days OR via "Delete immediately" path):** _[DEPRECATED — PR #9 retired the 30-day-grace path; current model is admin-actioned 🗑 Delete via 0023 § 3.4]_

A scheduled job at 02:00 PHT daily processes all `users` rows where `deleted_at < NOW() - INTERVAL '30 days'` AND `hard_deleted_at IS NULL`:

1. Null out / hash PII fields on `users`:
   - `display_name = '[deleted user]'`
   - `email = hash_sha256(user_id || '@deleted.setnayan.com')`
   - `phone = NULL`
   - `profile_photo_r2_key = NULL` (R2 object deleted by separate Worker)
   - `business_name`, `logo_r2_key`, etc. nulled for vendor rows
2. Delete face vectors for any events older than the legal retention window (events ≥ 5 years old → vectors purged immediately; events within 5 years → retained until the event's retention boundary).
3. Anonymize cross-table references:
   - `chat_messages.sender_id` resolves to `[deleted user]` on the read API; the FK stays intact for audit
   - `photos.uploader_user_id` resolves to `[deleted user]` on the read API; FK intact
   - Audit-log `actor_user_id` resolves to `deleted_user_X_YYYY-MM-DD` anonymized handle on every read
4. Set `users.hard_deleted_at = NOW()`. The row is **not** deleted from the database — it's anonymized. Hard-deleting the row would orphan every FK and break the 5-year audit-retention obligation under Privacy Policy § 5.

**"Delete immediately" path:** advanced expander inside the modal. Same consequences, no 30-day grace, hard delete runs synchronously after the confirmation. Used by users who want their data gone now (e.g., after a privacy incident). Requires re-typing the email a second time as a friction guard.

**Restoration during grace window:** _[DEPRECATED — there is no grace window under PR #9; if a user wants to come back after Delete they sign up fresh on the same email; if Blacklisted they cannot until an admin Unblacklists.]_ Historical: if a soft-deleted user signs in within 30 days, the login flow shows "Your account is scheduled for deletion. Restore it now?" → confirm → `users.deleted_at = NULL`, `users.deletion_initiated_by = NULL`, restoration confirmation email sent.

**Exceptions that BLOCK deletion entirely:**

The Delete-account button is disabled (with a tooltip explaining why) when any of the following hold:

- **Active event within next 30 days (customer-side).** Show: "You have an active wedding scheduled on [date]. Contact support to discuss deletion."
- **Active vendor bookings (vendor-side).** Show: "You have [N] active bookings. Mark them completed or cancelled before deleting your account, or contact support."
- **Outstanding financial obligations.** Show: "Outstanding balance of ₱[X]. Resolve unpaid orders before deleting your account."
- **Admin role.** Admins cannot self-delete. Show: "Admin accounts must be deleted by another admin. Submit a deletion request via the admin console." This routes to a two-admin approval flow per Vendor Agreement § 9.1.
- **Sole `is_internal=TRUE` owner.** If only one of the two § 10a internal accounts remains, that account cannot self-delete until a second internal account is added — protects the dogfooding invariant.

#### 3.6.3 Face data management — Privacy Policy § 6.1

**Per-event toggle:** "Enable face detection on my photos for [Event Name]." Default ON (per the per-event-scoped face-detection rule in the master CLAUDE.md decision log). Toggling off:
- Sets `face_enrollments.revoked_at = NOW()` for the user's enrollments in that event
- Within the next 5-min refresh cycle, face vectors are purged from the in-memory matcher
- Future photos of the user are not auto-tagged; the user retains all QR-scan tagging paths

**Per-event enrollment status badge:**
- **Enrolled** — green dot with the enrollment source (RSVP / portal upload / kiosk)
- **Not enrolled** — grey dot with "Add my face data" CTA linking to the guest portal upload (per 0002 § 5)
- **Opted out** — red dot with "Re-enable" CTA

**Global "Delete all my face data" button.** Scope: every event, every enrollment source. Confirmation required. On confirm, every matching `face_enrollments` row is marked `revoked_at = NOW()` and the underlying vector blobs are purged at the next 5-min refresh.

#### 3.6.4 Marketing consent — Privacy Policy § 6.2

Two toggles, both default OFF (explicit opt-in per RA 10173):

1. **"Setnayan may feature my event in marketing samples"** — writes `users.marketing_consent_event_features`. When ON, Setnayan may use the event's logo (vendor logos with separate consent), public photos (couple-tagged as public), and testimonial quotes (collected via separate consent form) in marketing materials.
2. **"Setnayan may contact me about new features and product updates"** — writes `users.marketing_consent_product_updates`. Drives the `marketing` notification category in tab 3 (when this flips OFF, the marketing toggles in tab 3 auto-disable and grey out).

Withdrawal is immediate. Any in-flight email campaigns drop the user from the next batch within 24h.

#### 3.6.5 Budget Planner behavioral data (added 2026-06-05)

The Budget Planner's allocation engine (home: 0007) captures the couple's actual money-allocation choices as a **first-party behavioral-decision dataset** (`budget_allocation_decisions`: per-leaf default-vs-final, pin signals / first-touched order, what got cut to fund a tilt, tagged with budget band · region · pax band · event type). The owner designated this an **edge** and the platform's **most-protected data class** — its handling under RA 10173 is governed here.

**Two-layer model with a hard wall between them:**

1. **Layer 1 — identified / operational.** Per-event rows, **couple-OWN-ONLY** under RLS (canonical `current_event_ids`); admins get **no blanket read** (gated + audited access only). This is **RA 10173 erasable**. In *this* Privacy & Data tab it therefore must:
   - **(a)** be **INCLUDED in the couple's data export** (§ 6.1) — a `budget_allocation_decisions.json` entry alongside the other exported artifacts;
   - **(b)** be **deleted on account deletion** (cascades with the event) AND **directly erasable by the couple** here, independent of full account deletion;
   - **(c)** carry a **consent / opt-out toggle** governing the de-identified analytics use (Layer 2). Default posture follows the marketing-consent pattern (§ 6.4); withdrawal stops new contributions to the analytical layer.
2. **Layer 2 — de-identified / analytical.** Pseudonymized, identity stripped, **segment-keyed** (budget band · region · pax band · event type · leaf), surfaced only as **aggregate + minimum-N (k-anonymity)** so a thin segment can't re-identify a couple. **PII never crosses into Layer 2.** This is what powers the "couples like you" guidance copy + admin trend analytics, and it **persists as non-personal data even after Layer-1 erasure** (erasing the couple's identified rows does not unwind anonymous aggregates already computed).

**System of record = first-party Supabase Postgres (Singapore).** NEVER a 3rd-party analytics SaaS as system of record; PostHog/GA (0035) may mirror **aggregates** for dashboards only.

**Build state:** the Layer-1 table shipped 2026-06-05 (PR #996, migration `20260824000000_budget_allocation_decisions`, RLS couple-own-only at `CREATE TABLE` time; admins intentionally no blanket read). The export inclusion (a), direct couple-erase (b), and the analytics opt-out toggle (c) are a **follow-on UI wiring in this iteration**.

> Full design: `Budget_Planner_Allocation_Engine_2026-06-05.md` §6–§7 · `DECISION_LOG.md` 2026-06-05. Engine / planner home = 0007; admin governance (two-admin export gate + access audit) = 0023.

#### 3.6.6 DPO contact

Static block at the bottom of the Privacy tab:

> **Data Privacy Officer**
> All requests under the PH Data Privacy Act (RA 10173) — access, correction, blocking, erasure, data portability, complaint, or any other right — are handled by Setnayan's DPO within 15 business days per § 21 of our Privacy Policy.
>
> **dpo@setnayan.com**
>
> [Read the full Privacy & Security Policy →]

The "Read the full Privacy & Security Policy" link routes to `setnayan.com/privacy` which renders the policy from `01_Contracts/Setnayan_Privacy_and_Security_Policy.md` via the same MDX pipeline as the marketing site.

---

### 3.7 Tab 7 — Setnayan Concierge (added 2026-05-14 as "Guided Planner"; repriced + renamed 2026-05-16; simplified to single-SKU + 3-day trial 2026-05-17 · customer-only · per-event)

Per the 2026-05-17 Setnayan Concierge lock (CLAUDE.md decision log second 2026-05-17 row + iteration 0016 § 0), each event runs in DIY mode (free default) or Concierge mode (paid · single SKU ₱4,999) or Trial mode (card-less 3-day taste). This tab surfaces the per-event status + activation controls + the account-level trial cap + the enforcement-state UI.

If the customer has multiple active events, an event picker at the top of the tab swaps the rendered status. Each event's Setnayan Concierge status is independent — couple may run DIY on Event A and paid Concierge on Event B — but the **trial is account-level** (one trial across all of the couple's events, not one per event), and the enforcement state is also account-level.

#### 3.7.1 Current status panel

Reads `events.concierge_status`, `events.concierge_expires_at`, `users.concierge_trial_used_at`, and `users.concierge_enforcement_level` and renders one of four event-states with the enforcement overlay if applicable:

**DIY state** (`concierge_status = 'diy'`):
```
┌─────────────────────────────────────────────────────────┐
│ {event_name}                                             │
│ Currently: DIY mode (free)                              │
│                                                          │
│ You're planning on your own. All dashboard tools are    │
│ available, but you won't get timeline help, deadline    │
│ alerts, or vendor picks matched to your style.          │
│                                                          │
│ [ Buy Setnayan Concierge · ₱4,999 ]                     │
│ [ Try 3 days free — no card required ]                  │
└─────────────────────────────────────────────────────────┘
```

The "Try 3 days free" CTA is hidden if ANY of:
- `users.concierge_trial_used_at IS NOT NULL` (account has already used its one trial — see "Trial used" empty-state below)
- `users.concierge_enforcement_level IN ('trial_banned', 'full_banned')`

**Trial-used empty-state inline** (DIY + `users.concierge_trial_used_at IS NOT NULL`):
> *You've used your free 3-day trial on this account. Buy Setnayan Concierge anytime to continue with the full experience.*

**Trial state** (`concierge_status = 'trial'`):
```
┌─────────────────────────────────────────────────────────┐
│ {event_name}                                             │
│ Currently: 3-day Trial · {days_remaining} days left     │
│                                                          │
│ You're trying the full Setnayan Concierge experience.   │
│ Trial ends: {expires_at formatted}                      │
│                                                          │
│ Continue with:                                           │
│ [ Buy Setnayan Concierge · ₱4,999 ]                     │
└─────────────────────────────────────────────────────────┘
```

**Active state** (`concierge_status = 'active'`):
```
┌─────────────────────────────────────────────────────────┐
│ {event_name}                                             │
│ Currently: Setnayan Concierge · active                  │
│                                                          │
│ Active until: {expires_at formatted}                    │
│ Days remaining: {N}                                      │
│                                                          │
│ [ Extend my plan ]   [ Cancel Setnayan Concierge ]      │
└─────────────────────────────────────────────────────────┘
```

When `days_remaining < 14` → renewal nudge banner appears at the top of the tab AND on the dashboard Home per iteration 0021 § 2.0b (variant C).

**Expired state** (`concierge_status = 'expired'`):
```
┌─────────────────────────────────────────────────────────┐
│ {event_name}                                             │
│ Currently: DIY mode (Setnayan Concierge expired)        │
│                                                          │
│ Your Setnayan Concierge expired on {expires_at}.        │
│ Your progress is saved — reactivate anytime to pick up  │
│ where you left off.                                     │
│                                                          │
│ [ Reactivate Setnayan Concierge → ]                     │
└─────────────────────────────────────────────────────────┘
```

The "Try 3 days free" CTA is NOT offered from the Expired state (trial is one-shot per account; consumed earlier in the account's lifecycle).

#### 3.7.2 Enforcement-state overlay (NEW 2026-05-17)

When `users.concierge_enforcement_level != 'none'`, a notice panel renders **above** the status panel from 3.7.1. The notice copy + actions vary by tier:

| Enforcement level | Notice copy + actions |
|---|---|
| `'warning'` | *"Heads-up — your account was flagged once for review and cleared with a warning. Your 3-day trial remains available; further flags may limit access."* (audit-only · no action buttons) |
| `'trial_banned'` | *"3-day trial unavailable on this account. You can still purchase Setnayan Concierge anytime."* + [ Why this happened — appeal ticket → ] (opens 0029 help-center ticket) |
| `'full_banned'` | *"Setnayan Concierge unavailable on this account. Contact support if you believe this is in error."* + [ Open appeal ticket → ]. Status panel below shows ONLY DIY state (no purchase CTAs) regardless of `events.concierge_status` |

#### 3.7.3 Plan comparison card

When customer taps "Buy Setnayan Concierge" or "Reactivate" → renders the two-option chooser identical to iteration 0000 § 2.5b:

```
┌──────────────────┐  ┌──────────────────────────────┐
│ DIY MODE         │  │ SETNAYAN CONCIERGE  ✨        │
│ Free             │  │ ₱4,999 / 12 months           │
│                  │  │ ₱13.69 / day                 │
│ All tools.       │  │                              │
│ Plan at your     │  │ Full 9-step roadmap +        │
│ own pace.        │  │ daily nudges + priority      │
│                  │  │ vendor matching + honeymoon. │
│                  │  │ Less than ₱25K coordinator.  │
│ [Keep DIY]       │  │ [Buy ₱4,999]                 │
└──────────────────┘  └──────────────────────────────┘

   Not ready to commit? [ Try 3 days free → ] (no card required)
```

The 3-day-trial link follows the same gating rules as 3.7.1: hidden when account has used trial OR is `'trial_banned'`/`'full_banned'`.

#### 3.7.4 Activation flow

Tapping "Buy ₱4,999" routes to checkout per iteration 0034 apply-then-pay:
1. `service_orders` row created with `concierge_complete` SKU (499,900 centavos). Blocked at this step if `users.concierge_enforcement_level = 'full_banned'`.
2. Customer receives BDO/GCash payment instructions
3. Customer pays externally
4. Admin reconciles per 0034 § 4
5. On `service_orders.status = 'paid'`, the activation hook (0034 § 4.4) calls `activate_concierge(event_id, order_id)`:
   - If `concierge_status` was `'diy'`, `'trial'`, or `'expired'` → flip to `'active'`, set `concierge_tier = 'complete'`, stamp `concierge_activated_at = NOW()`, compute `concierge_expires_at` per the **wedding-anchored formula** `LEAST(GREATEST(events.wedding_date + INTERVAL '30 days', NOW() + INTERVAL '12 months'), NOW() + INTERVAL '24 months')` (defaults to `NOW() + INTERVAL '12 months'` if `wedding_date IS NULL`). Trial is overwritten cleanly if a couple buys mid-trial.
   - If `concierge_status` was already `'active'` → extend: re-run the formula against the new `wedding_date` (if changed) and the existing `concierge_activated_at`; apply extend-only (never shrink).

**Wedding-date update recompute.** When the couple later sets or updates `events.wedding_date` via Concierge Step 1 or Profile edit, the database trigger (or app-layer hook) calls `recompute_concierge_expiry(event_id)`:
- Recomputes `concierge_expires_at` per the formula using the current `concierge_activated_at`
- **Extend-only rule:** writes the new value only if it's later than the current `concierge_expires_at`; if earlier, no-op (couple keeps the runway they paid for)
- If the new `wedding_date > concierge_activated_at + INTERVAL '24 months'` AND `events.concierge_long_engagement_advised_at IS NULL`, fires the long-engagement advisory and stamps the column

**Long-engagement advisory copy** (in-app + email per 0028):

> *"Your wedding is more than 24 months away. Setnayan Concierge covers up to 24 months from your purchase date — you'll lose access ~{N} months before your wedding day. We recommend renewing closer to your wedding for full coverage."*

In-app + email notification also fires on activation (separate from the advisory) per 0028.

#### 3.7.5 Trial start flow

Tapping "Try 3 days free" calls `start_concierge_trial(event_id)` server-side directly — no checkout, no order row, no payment instructions. The handler:
1. Validates `users.concierge_trial_used_at IS NULL` (account-level cap)
2. Validates `users.concierge_enforcement_level NOT IN ('trial_banned', 'full_banned')`
3. Runs cross-account similarity check (per iteration 0016 § 0 detection signals) against all trial-used accounts
4. On pass → flips event status to `'trial'`, sets `concierge_expires_at = NOW() + INTERVAL '3 days'`, stamps `users.concierge_trial_used_at = NOW()`; UI refreshes to Trial-state panel (3.7.1 variant Trial) and dashboard Home flips to variant B per iteration 0021
5. On similarity-check hit → inserts `concierge_abuse_flags(status='pending_review')` row + returns `under_review` error; UI shows modal *"Your account is under review. Contact support if you believe this is in error."* with [ Open appeal ticket → ] CTA; **trial slot is NOT consumed** (so a falsely-flagged user later cleared by admin can still start their trial)

In-app notification "Trial started — you have 3 days of Setnayan Concierge" fires immediately on success (per 0028).

#### 3.7.6 Cancel flow

Tapping "Cancel Setnayan Concierge" surfaces a confirmation:

> Cancelling will end your Setnayan Concierge access at the end of your current paid period ({expires_at formatted}). You'll keep all your planning progress and can reactivate anytime. **Setnayan does not offer pro-rated refunds for unused time** — for refund requests, contact the DPO via Tab 6.

If customer confirms:
- `concierge_status` stays `'active'` until `concierge_expires_at`
- A `cancellation_requested_at` flag is set so the renewal nudge banner is suppressed
- At expiry, cron flips to `'expired'` per the standard daily sweep
- Pro-rated refund requests are admin-handled (out of scope for this surface); per § 9.1 single-admin authority for refunds ≤ ₱25K

#### 3.7.7 Server actions

```ts
// apps/web/app/dashboard/profile/concierge/actions.ts

export async function activateConcierge({
  eventId,
  orderId,
}: ActivateInput): Promise<Result>;        // single SKU as of 2026-05-17 (no tier arg)

export async function cancelConcierge({
  eventId,
}: CancelInput): Promise<Result>;

export async function startConciergeTrial({  // renamed 2026-05-17 from startConciergePreview
  eventId,
}: TrialInput): Promise<Result>;             // returns { status: 'started' | 'already_used' | 'enforcement_blocked' | 'under_review' }
```

All three enforce RLS: only event members with `member_type = 'couple'` can mutate; admins can override per § 9.1. `startConciergeTrial` is idempotent and returns the existing trial row if one was already issued for the event AND under-review responses do not consume the account-level trial slot.

**Admin-side server actions** (called from the 0023 Concierge Abuse tab, not from this Settings surface — listed here for cross-reference):

```ts
// apps/web/app/admin/concierge-abuse/actions.ts

export async function adminClearConciergeFlag({ flagId, adminUserId, notes }): Promise<Result>;
export async function adminConfirmConciergeAbuse({ flagId, adminUserId, notes }): Promise<Result>;
export async function adminLiftConciergeEnforcement({ userId, adminUserId, notes }): Promise<Result>;
```

See iteration 0023 § Concierge Abuse for the queue + admin workflow.

---

## 4. Data model

### 4.1 New tables

```sql
-- Asynchronous data-export job tracking (RA 10173 § 18)
CREATE TABLE data_export_requests (
  request_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id),
  requested_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','generating','ready','expired','downloaded','failed')),
  r2_export_key   TEXT,
  ready_at        TIMESTAMPTZ,
  downloaded_at   TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  failure_reason  TEXT
);

CREATE INDEX idx_data_export_user_status ON data_export_requests (user_id, status);
CREATE INDEX idx_data_export_expires ON data_export_requests (expires_at) WHERE status = 'ready';

-- Per-user per-category notification preferences
CREATE TABLE notification_preferences (
  user_id           UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  category          TEXT NOT NULL
                    CHECK (category IN ('payments','vendors','events','account','marketing','internal_accounts')),
  in_app_enabled    BOOLEAN NOT NULL DEFAULT TRUE,
  email_enabled     BOOLEAN NOT NULL DEFAULT TRUE,
  quiet_hours_start TIME,
  quiet_hours_end   TIME,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, category)
);

-- Forward-reserved (V1.5): saved payment methods for Setnayan Pay automation
CREATE TABLE customer_payment_methods (
  method_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  method_type     TEXT NOT NULL CHECK (method_type IN ('card','gcash','maya','bdo_account')),
  brand           TEXT,
  last4           TEXT,
  masked_account  TEXT,
  is_default      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);
```

### 4.2 Columns added to `users`

```sql
-- Soft + hard delete tracking (RA 10173 § 16(e))
ALTER TABLE users ADD COLUMN deleted_at             TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN hard_deleted_at        TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN deletion_reason        TEXT;
ALTER TABLE users ADD COLUMN deletion_initiated_by  UUID REFERENCES users(user_id);

-- Appearance preferences
ALTER TABLE users ADD COLUMN theme_preference  TEXT DEFAULT 'setnayan_default'
  CHECK (theme_preference IN ('setnayan_default','victorian','classy','ios','forest_champagne'));
-- Schema key 'setnayan_default' unchanged across the 2026-05-15 accent-token swap (terracotta → burgundy).
-- Name unchanged. No data migration needed for existing rows.
ALTER TABLE users ADD COLUMN locale_preference TEXT DEFAULT 'en'
  CHECK (locale_preference IN ('en','tl','ceb'));
ALTER TABLE users ADD COLUMN density_preference TEXT DEFAULT 'comfortable'
  CHECK (density_preference IN ('compact','comfortable'));

-- Marketing consent (Privacy Policy § 6.2)
ALTER TABLE users ADD COLUMN marketing_consent_event_features  BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN marketing_consent_product_updates BOOLEAN NOT NULL DEFAULT FALSE;

-- Index supporting the daily hard-delete sweeper
CREATE INDEX idx_users_pending_hard_delete
  ON users (deleted_at)
  WHERE deleted_at IS NOT NULL AND hard_deleted_at IS NULL;
```

### 4.3 RLS posture

Every table above has Row-Level Security policies:

- `data_export_requests`: user can read/write their own rows only; admin can read any row for support purposes; nobody can delete rows (immutable for audit)
- `notification_preferences`: user can read/write their own rows only; admin read-only
- `customer_payment_methods`: user only; admin no access (PCI-scope isolation)
- `users` new columns: `theme_preference`, `locale_preference`, `density_preference`, `marketing_consent_*` are self-writable; `deleted_at`, `hard_deleted_at`, `deletion_reason`, `deletion_initiated_by` are writable only by the user themselves (for self-soft-delete) or by an admin (for admin-processed deletions) — DB-enforced via policy

---

## 5. Background jobs

| Job | Schedule | Purpose |
|---|---|---|
| `data_export_generator` | event-driven (on insert into `data_export_requests`) | Compiles the user's ZIP and uploads to R2 |
| `data_export_expiry_sweeper` | daily 00:00 PHT | Flips `ready` → `expired` for rows past `expires_at`; deletes the R2 object |
| `hard_delete_sweeper` | daily 02:00 PHT | Processes `users.deleted_at < NOW() - 30d` rows · anonymizes PII · purges face vectors · sets `hard_deleted_at` |
| `face_vector_revocation_refresh` | every 5 minutes | Re-syncs the in-memory matcher with `face_enrollments.revoked_at` changes (already exists per CLAUDE.md face-detection decision; this iteration consumes it) |
| `marketing_consent_propagator` | event-driven (on update of `marketing_consent_*`) | Removes user from in-flight campaigns within 24h |

---

## 6. Privacy posture summary

| Right (RA 10173) | Where exercised | SLA |
|---|---|---|
| § 16(a) Right to be informed | Privacy Policy + § 6.5 DPO block | Policy is always current |
| § 16(b) Right to access | § 6.1 data export | 7 days |
| § 16(c) Right to correction | Tab 1 Profile (most fields) + DPO email for the rest | Immediate (self-serve) or 15 business days (DPO) |
| § 16(d) Right to object | § 6.3 (face data) + § 6.4 (marketing) | Immediate |
| § 16(e) Right to erasure | § 6.2 account deletion | Immediate (soft) · 30 days (hard) |
| § 18 Right to data portability | § 6.1 data export | 7 days |
| § 21 DPO obligation | § 6.5 contact block | 15 business days per request |

Every right has a machine-actionable path through Settings. The DPO email remains the fallback for cases the UI doesn't cover (correction of fields not editable by the user, complaint escalation, cross-account data requests).

---

## 7. Build order

After the schema in § 4 lands (Sprint 0), the six tabs are mutually independent and can be implemented in parallel by different engineers:

| Order | Tab | Why this order |
|---|---|---|
| **Sprint 0** | Schema § 4 + RLS policies | Everything blocks on these tables existing |
| **Sprint 1** | Tab 6 § 6.2 (account deletion) + Tab 6 § 6.1 (data export) | Legal compliance — must ship before V1 launch |
| Sprint 1 | Tab 1 (Profile) | Baseline self-serve UX; unblocks email verification flows |
| Sprint 1 | Tab 3 (Notifications) | Consumed by 0019 chat for routing decisions |
| Sprint 2 | Tab 2 (Appearance) | Consumed by every surface; no downstream blockers |
| Sprint 2 | Tab 4 (URL & Slug) | Reuses the 0002 slug component |
| Sprint 2 | Tab 5 (Payment Methods) | V1 is mostly an informational tab + the payment-history view |
| Sprint 2 | Tab 6 § 6.3 / § 6.4 / § 6.5 (Face data + Marketing + DPO block) | Consumed by face matcher + email campaign tool · DPO block is static copy |

The two RA 10173 features (export + deletion) are in Sprint 1 because launching without them exposes Setnayan to NPC complaints. Everything else is hygiene and can slip a sprint without legal exposure.

---

## 8. Companions and next steps

- **0021 (couple dashboard)** — adds the Settings cog to top chrome; routes to this iteration's surface
- **0022 (vendor dashboard)** — adds the Settings cog to top chrome; vendor-side tab variants enabled
- **0023 (admin console)** — admin's own profile settings hosted here (admin's role-grant management lives separately in 0023)
- **0002 (slug check)** — Tab 4 reuses the slug-availability component
- **0026 (BIR / tax compliance)** — consumes the payment-history view from Tab 5 for receipt generation
- **0028 (email notifications)** — consumes `notification_preferences` for routing email category opt-outs
- **`01_Contracts/Setnayan_Privacy_and_Security_Policy.md`** — the policy this iteration's Privacy tab operationalizes
- **`02_Specifications/Theme_System_Implementation_Spec.md`** — the four V1 themes Tab 2 picks from
- **Vendor Agreement § 10a / § 10b** — internal-account markers consumed by Tab 1 (display badge) and Tab 6 (deletion exception)

The iteration ships when all six tabs are reachable from the Settings cog on every dashboard, the schema in § 4 is live in Supabase, the two background sweepers in § 5 are scheduled, and the export + deletion flows have passed end-to-end privacy review.

---

## Payment Options (vendor) — note (added 2026-06-04)

> Shipped 2026-06-04 (PR #969). Vendors manage where couples pay them directly via the dedicated **"How clients pay you"** surface in the vendor dashboard (`/vendor-dashboard/payment-options`) — see 0022 + the canonical spec in **0034 -> "Vendor Payment Options — off-platform direct rail"** — not a settings tab. Distinct from the customer-side "Payment Methods" informational tab (this doc, Payment Methods) which covers Setnayan-processed order payments. Off-platform vendor payments are 0% / never held by Setnayan.
