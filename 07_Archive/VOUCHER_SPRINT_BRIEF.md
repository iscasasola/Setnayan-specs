# Voucher + Inline-Checkout Sprint · Shared Agent Brief

Pilot: 2026-06-01. Owner-approved V1 scope expansion. This is the single source of truth for every Day-N agent in this sprint. **Read this brief once; don't ask for the spec to be restated.**

## Locked policy

- 3 voucher types: `pct_off` (% off, no cap) · `pct_off_capped` (% off up to fiat cap) · `free` (100% off covered services)
- Voucher apply happens BEFORE order creation · invalid clears field + brand-voice error inline
- BIR receipt shows net paid (iteration 0026)
- Voucher field hidden behind "Have a code?" toggle
- Codes case-insensitive input · stored UPPERCASE · 8 chars `[A-Z0-9]`
- 1 voucher per order (UNIQUE order_id) · 1 redemption per couple per code (UNIQUE voucher_id + couple_user_id)
- `expires_at` REQUIRED at code creation · `max_uses` optional (NULL = unlimited)
- order_ledger writes at every state transition · best-effort (never throw)
- For pilot: only Setnayan AI auto-activates post-approval · other SKUs stay `approved` until V1.x activation hooks

## State machine (orders.status)

`CHECKOUT (in-memory)` → `pending_payment` → `pending_approval` → `approved` → `active` → `completed`
Plus side branches: `rejected` · `refunded`

Each transition: single server action with `WHERE status = <prev>` clause + `.maybeSingle()` → NULL means "already advanced, refresh" (canonical idempotent pattern matching existing `approvePayment`).

## Schema state on `origin/main` (post PR #594 + #595 · migrations 20260529010000 + 20260529020000 LIVE on prod)

```
discount_codes              · code (8 char) · discount_type · pct_value INT · cap_centavos BIGINT
                            · covered_service_keys TEXT[] · expires_at TIMESTAMPTZ NOT NULL
                            · max_uses · uses_count · is_active · created_by_admin_id
discount_code_redemptions   · UNIQUE (order_id) · UNIQUE (discount_code_id, couple_user_id)
                            · discount_applied_centavos · couple_user_id
orders                      · + voucher_code_applied TEXT · + voucher_discount_centavos BIGINT
                            · + original_price_centavos BIGINT (added Day 2 if not yet) · + final_paid_centavos BIGINT (added Day 2)
payments                    · status enum + 'resubmit_requested' · + admin_resubmit_notice TEXT
order_ledger                · IMMUTABLE (REVOKE UPDATE/DELETE) · 8 event_types · admin reads all
                            · couple reads via orders.user_id = auth.uid() join · NOT couple_user_id
```

**Important**: orders uses `user_id` (canonical), discount_code_redemptions uses `couple_user_id` (denormalized). Match the existing column when joining.

## Day-by-day deliverables

| Day | Scope | PR | Notes |
|---|---|---|---|
| 1 | Schema + admin CRUD `/admin/discount-codes` | [#594](https://github.com/iscasasola/setnayan-platform/pull/594) | ✅ landed (older 3-type spec) |
| 1.5 | Spec realignment (pct_off_capped + UNIQUE + order_ledger) | [#595](https://github.com/iscasasola/setnayan-platform/pull/595) | ✅ landed |
| 2 | State machine + ledger helper + calc engine + drawer + 12 add-on pages + retire /orders/new | TBD | ⚙️ in flight |
| 3 | Admin 3-state action (Approve/Resubmit/Decline) + Setnayan AI activation hook + 0028 email templates + ledger write hooks | TBD | blocked on Day 2 |
| 4 | Dry-run + decision-log row + .docx mirror regen | n/a | verification only |

## Reusable infra (already shipped, use these — don't reinvent)

- `apps/web/lib/email.ts` · `sendEmail` helper (plaintext only signature)
- `apps/web/lib/platform-settings.ts` · `fetchPlatformSettings()` returns BDO + GCash + QR URLs (per PR #593)
- `apps/web/app/_components/file-upload.tsx` · existing R2 direct-upload component
- `apps/web/app/admin/users/actions.ts:408` · canonical `admin_audit_log` INSERT pattern
- `apps/web/lib/supabase/server.ts` + `admin.ts` · canonical clients
- `requireAdmin()` helper · widens to internal+team+admin per repo convention
- Existing notification path · `emitNotification` from `lib/notification-emit.ts`
- `apps/web/lib/ledger.ts` · `appendLedger()` helper (will be created Day 2)

## Agent execution checklist

For each day's PR:

1. Worktree off `origin/main` · branch `claude/voucher-day<N>-<slug>-2026-05-29`
2. `pnpm install --frozen-lockfile` if fresh worktree
3. Read VOUCHER_SPRINT_BRIEF.md (this file) before coding · don't ask for spec restate
4. Inspect existing patterns FIRST (read-only) · then implement
5. Push migration BEFORE merge if schema change (per [[feedback_setnayan_push_migrations_myself]])
6. `pnpm -F web typecheck` clean · `pnpm -F web lint` only pre-existing warnings
7. WHY-rich inline comments per [[feedback_setnayan_document_changes_with_why]] citing this brief + cross-refs
8. PR title `feat/fix(<scope>): Day <N> · <one-line summary>`
9. PR body: Why (1 para) · Schema changes (if any) · Entry points (per [[feedback_setnayan_orphan_prevention]]) · Test plan checkboxes
10. `gh pr merge <#> --auto --merge` per [[feedback_setnayan_pr_auto_merge]]
11. **Report ≤150 words**: PR # + merge state + diff stats (files/lines) + blockers + 1 surprise

## Cross-references

- Owner architect brief (the canonical state machine + UI states): captured in CLAUDE.md decision-log 2026-05-29 row when sprint closes
- CLAUDE.md 2026-05-12 § 9.1 · admin audit-log discipline
- CLAUDE.md 2026-05-22 row 8 · `supabase db push --linked` manual push pattern
- CLAUDE.md 2026-05-23 row 2 · canonical admin_audit_log INSERT at `/admin/users/actions.ts:408`
- iteration [0026 BIR Tax Compliance](../0026_bir_tax_compliance/0026_bir_tax_compliance.md) · net-paid receipt rule
- iteration [0028 Email Notifications](../0028_email_notifications/0028_email_notifications.md) · Resend template host
- iteration [0034 Payments + Cart](../0034_payments_and_cart/0034_payments_and_cart.md) · apply-then-pay manual reconciliation

## Memory rules referenced (auto-loaded · don't re-cite)

`feedback_setnayan_pr_auto_merge` · `feedback_setnayan_push_migrations_myself` · `feedback_setnayan_orphan_prevention` · `feedback_setnayan_document_changes_with_why` · `feedback_setnayan_no_dev_text_post_launch` · `feedback_setnayan_no_secrets_in_pr_files` · `feedback_setnayan_latest_spec_priority`
