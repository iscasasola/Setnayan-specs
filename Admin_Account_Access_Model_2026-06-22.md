<!-- Design doc generated 2026-06-22 from the admin-account-model design pass (security + RA 10173 critiques folded in). -->

> ⚠ **VERIFIED RECONCILIATION (2026-06-22, against origin/main):** there is **no admin RLS policy on `chat_messages`** to "narrow" — chat row-level security is **already participant-only** (couples/vendors in the thread; grep for an admin/`is_admin` chat policy returns nothing). Admin reach to chat bodies is **only** via the service-role client (`createAdminClient()` bypasses RLS), and the **sole** current reader is `app/admin/demo-vendors/inquiries/[threadId]` (hard-gated to `vendor.is_demo`) via `lib/chat.ts → fetchMessages(admin)`. So wherever this doc says "narrow the chat admin RLS policy," the real Phase-0 mechanism is: **(a) a CI lint guard that fails the build on any service-role read of `chat_messages.body` / `chat_attachments` / `face_enrollments.vector_blob` outside the allow-listed paths, and (b) keeping chat RLS admin-free.** The force-majeure last-10 snippet, when built, is an additive `SECURITY DEFINER` RPC — not a relaxation of an existing admin grant.
# Admin Account-Access Model — Final Design (2026-06-22)

> Iteration 0023 (Admin Console) addendum. Folds the Security audit (FAIL) + RA 10173 Compliance audit (CRITICAL GAPS) into the owner-locked model. Supersedes the bare `View as user` line in 0023 §3.4 and extends §2 (audit), §3.6b (force majeure), §4 (two-admin), §3.7 (settings).

## 1. The locked model (owner, 2026-06-22)

Applies to **both couple/customer AND vendor accounts**.

- **Every field is editable — nothing is permanently locked. What differs is the TIER of access:**
  1. **Read-only view** — admin sees it, never edits silently.
  2. **Consent-to-fix** — admin proposes; user approves (or a documented enforcement basis applies); then it lands.
  3. **Takeover** — gated impersonation session, two-admin to start, fully notified + change-reported.
- **Two-admin 'four-eyes' gate** on every risky action: money, identity/KYC, deletions, anything touching another person's data.
- **Takeover runs until the admin ends it**, with a generous **safety auto-expiry backstop** (not a short forced timer).
- **No-consent actions** (admin acts directly, with audit + user notification): account-SECURITY / ENFORCEMENT actions + BENEFICIAL grants. Catalog in §3.
- **Trust promise published** in the privacy notice (§9).
- **Force-majeure exception kept** (0023 §3.6b): last-10-messages snippet ONLY when a dispute escalates past 7 days.
- **Privacy invariants preserved even inside a takeover:** chat bodies, thread attachments, raw behavioral/decision data, raw face vectors stay OFF-LIMITS unless separately consented; the FM snippet is the lone chat exception.

## 2. The core flaw the audits found, and the fix

Both audits converge on one root cause: **read-only constraints, two-admin gates, and audit immutability live in UI/code, not in the database schema.** A single compromised admin could read all data, forge approvals, edit the audit log, and impersonate users untraced. The fix: **push every control down to the schema** — DB-level approval CHECKs, append-only HMAC-chained audit, RLS that denies chat-body/face-vector reads, and a takeover that cannot start without a second admin and a user notification.

## 3. Action catalog (complete no-consent list + the consent list)

**Principle:** act without asking when the action (a) protects account security, (b) enforces rules, or (c) grants the account something beneficial — always with audit + after-the-fact user notice. Ask first (consent-to-fix) when editing the user's/vendor's OWN authored content, personal/contact data, event data, payment/payout details, or KYC.

| Action | Tier | Consent? | Two-admin? | Notify? |
|---|---|---|---|---|
| Reset password | no-consent (security) | No | No | Yes |
| Grant comp ≤ ₱10K | no-consent (beneficial) | No | No | Yes |
| Grant comp > ₱10K | no-consent (beneficial) | No | Yes | Yes |
| Blacklist (email locked) | no-consent (enforcement) | No | Yes | Yes |
| Suspend (30-day soft hold) | no-consent (enforcement) | No | No | Yes |
| Vendor sanction / force-delist | no-consent (enforcement) | No | Yes | Yes |
| Grant vendor tokens | no-consent (beneficial) | No | No | Yes |
| Grant vendor Pro/Enterprise 28d | no-consent (beneficial) | No | No | Yes |
| Restore / un-blacklist | no-consent (beneficial) | No | No | Yes |
| Re-trigger KYC / clear stuck flag | no-consent (security) | No | No | Yes |
| Revoke leaked session / force-logout | no-consent (security) | No | No | Yes |
| Freeze for fraud investigation | no-consent (security) | No | No | Yes |
| Reconcile payment / activate SKU | no-consent (operational) | No | No | Yes |
| Refund ≤ ₱25K | no-consent (operational) | No | No | Yes |
| Refund > ₱25K | no-consent (operational) | No | Yes | Yes |
| Fix typo'd name/email/phone/address | consent-to-fix | Yes | No | Yes |
| Correct event detail (date/venue/guest) | consent-to-fix | Yes | No | Yes |
| Edit user's authored content | consent-to-fix | Yes | No | Yes |
| Change payment-method / payout | consent-to-fix (money) | Yes | Yes | Yes |
| Edit KYC / identity docs | consent-to-fix (identity) | Yes | Yes | Yes |
| Read chat body / attachment | forbidden except FM snippet | Yes | Yes | Yes |
| FM last-10 snippet (dispute > 7d) | takeover-exception | No | Yes | Yes |
| Decrypt / inspect face vectors | forbidden except enforcement case | Yes | Yes | Yes |
| Read raw behavioral data | forbidden (aggregate-only) | Yes | Yes | Yes |
| View-as-user (takeover) | takeover (gated) | No | Yes | Yes |
| Hard-delete account (cascade) | takeover (destructive) | No | Yes | Yes |
| Change BDO/GCash receiving accounts | takeover (fraud-critical) | No | Yes | No |
| Mid-quarter SKU price/frequency | governance | No | Yes | Yes |
| Promote admin / internal / team-pool | governance (privilege) | No | Yes | Yes |

## 4. Data model (schema-enforced)

```sql
-- Tier catalog: the action catalog made data (drives the read-only access page + edit workflow)
CREATE TABLE account_field_tier_catalog (
  field_key TEXT PRIMARY KEY, account_type TEXT, tier TEXT
    CHECK (tier IN ('read_only','consent_to_fix','takeover')),
  needs_two_admin BOOLEAN NOT NULL DEFAULT FALSE);

-- Append-only, HMAC-chained audit (revoke UPDATE/DELETE from ALL roles; INSERT via SECURITY DEFINER only)
ALTER TABLE admin_audit_log
  ADD COLUMN prev_row_hash BYTEA, ADD COLUMN row_hash BYTEA,
  ADD COLUMN takeover_session_id UUID NULL;
REVOKE UPDATE, DELETE ON admin_audit_log FROM authenticated, service_role;

-- Who VIEWED whose data (RA 10173 right-to-know substrate)
CREATE TABLE admin_data_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL, target_user_id UUID NOT NULL,
  data_categories TEXT[] NOT NULL, purpose TEXT NOT NULL,
  evidence_ref TEXT NULL, takeover_session_id UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());

-- Scoped takeover sessions (two-admin to start; user-notified; safety backstop expiry)
CREATE TABLE admin_takeover_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id UUID NOT NULL, original_admin_id UUID NOT NULL,
  approval_request_id UUID NOT NULL REFERENCES admin_approval_requests(request_id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ NULL, ended_by TEXT NULL CHECK (ended_by IN ('admin','user_force_end','backstop')),
  safety_backstop_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '8 hours'));

-- Consent-to-fix workflow
CREATE TABLE account_field_edits (
  edit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id UUID NOT NULL, proposed_by_admin_id UUID NOT NULL,
  field_key TEXT NOT NULL REFERENCES account_field_tier_catalog(field_key),
  before_value JSONB, after_value JSONB,
  basis TEXT NOT NULL CHECK (basis IN ('user_consent','enforcement','user_requested')),
  status TEXT NOT NULL DEFAULT 'awaiting_user'
    CHECK (status IN ('awaiting_user','approved','declined','applied','expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), resolved_at TIMESTAMPTZ NULL);

-- Consent integrity (HMAC signature blocks forged consent)
ALTER TABLE marketing_consents ADD COLUMN consent_signature BYTEA;
ALTER TABLE face_data_revocations ADD COLUMN consent_signature BYTEA;

-- Per-member sub-cap on §10b shared pool
ALTER TABLE team_allowance_consumptions ADD COLUMN week_of DATE; -- weekly ₱2,500/member; peer-approval to exceed (trigger)

-- Cascade-delete audit (exempt from user-cascade; logged BEFORE delete)
CREATE TABLE user_deletion_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deleted_user_id UUID NOT NULL, deleted_by_admin_id UUID NOT NULL,
  affected_row_refs JSONB NOT NULL, approval_request_id UUID NOT NULL,
  deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
```

**DB-level two-admin enforcement (mustFix #1):** triggers on `orders` (refund > ₱25K), `comp_grants` (> ₱10K), `payment_receiving_accounts`, admin-role promotion, and `service_catalog` (price/frequency) REJECT the write unless a matching `admin_approval_requests` row is `approved`. A CHECK on `service_catalog` blocks direct price writes without the 24-hour-delay token.

**RLS narrowing:** `chat_messages`/`chat_attachments` `admin_full_access` policy (RLS_Policy_Pattern.md Pattern E, ~line 247) narrows from full read to **metadata-only**; bodies/attachments readable only via the FM snippet RPC, which logs to `admin_data_access_log`. `face_enrollments.vector_blob` and `budget_allocation_decisions` raw rows stay aggregate/RPC-only.

## 5. Takeover (impersonation) security

1. Two-admin live approval to START (no self-initiate).
2. Scoped `admin_takeover_sessions` token (target + original admin + start + ~8h safety backstop; runs until admin ends it).
3. Every in-session action tagged `takeover_session_id` in the append-only log.
4. Real-time in-app bell: 'Admin {name} is viewing your account · [Force end] · [Activity log]' + email with IP/admin/revoke link.
5. On end: CHANGE REPORT email listing every audited action.
6. Privacy invariants HOLD inside takeover (chat/attachments/behavioral/face off-limits; FM snippet is the lone chat exception).
7. Short admin JWT TTL (4h) + `admin_sessions` revocation API + logout invalidation.

## 6. Notifications (0028 templates to add)

`admin_takeover_started`, `admin_takeover_change_report`, `account_field_edit_request`, `account_field_edit_applied`, `account_security_action` (password reset / session revoke — 1h revoke link), `enforcement_action` (suspend/blacklist/sanction — reason + appeal link to 0029), `beneficial_grant` (comp / tokens / Pro). Harmful actions notify with reason + appeal; beneficial notify positively; all real-time in-app + email.

## 7. Chat guard

CI lint `lint-admin-chat-guard` fails the build if any policy or query reads `chat_messages.body`, `chat_attachments`, raw `face_enrollments.vector_blob`, or raw `budget_allocation_decisions` outside the approved FM-snippet RPC + the aggregation service-role path. Enforces the privacy invariant at build time, mirroring the existing nav/bottom-nav lint guards.

## 8. RA 10173 rationale

- **Lawful basis on ACCESS, not just edits:** every personal-data read (incl. takeover) is logged in `admin_data_access_log` with a purpose + (for enforcement) an evidence ref.
- **Right-to-know:** `/dashboard/privacy` shows who accessed the data, when, why; self-service export runs server-side, 5-day SLA, encrypted output, no admin pre-read.
- **Consent integrity:** HMAC signatures block forged/silent consent changes.
- **Takeover notice + change report** match the published trust promise; harmful enforcement carries reason + appeal route.
- **Force-majeure snippet** is the sole, narrow, logged, notified chat exception, disconnected from general takeover (separate two-admin justification; auto-deletes 30 days after resolution).

## 9. Trust promise (publish in privacy notice)

> *Setnayan staff read your messages only with your consent or under a logged, notified takeover. Account changes happen only with your permission or with a notice to you. You can always see who accessed your account, when, and why, from your Privacy page.*

## 10. Phase plan (risk-ordered)

Phase 0 chat guard + RLS narrowing → Phase 1 read-only access page + immutable audit → Phase 2 consent-to-fix + DB-level two-admin + RBAC + pool sub-caps → **Phase 3 takeover hardening LAST, owner review before prod.**
