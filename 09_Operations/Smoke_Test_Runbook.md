# Prod Smoke-Test Runbook

**Locked 2026-05-20.** Owner-side launch-prep checklist for verifying the two critical pieces of prod infrastructure: **Sentry error capture** + **Resend email delivery**. Both tests are triggered from the admin dashboard at `/admin/operations-hiring` after the new "Prod smoke tests" panel.

> **Why these matter.** Sentry catches every server-side error in production; without verifying the wiring works end-to-end, a real prod incident could silently fail to alert. Resend delivers every transactional email (welcome, payment, RSVP, hiring digest, etc.); without verifying inbox arrival, vendors and couples could miss critical notifications.

> **When to run.** Once before V1 launch (gate). Re-run any time `RESEND_API_KEY` or `SENTRY_DSN` is rotated, or after any deploy that touches `apps/web/sentry.*.config.ts` or `apps/web/lib/email.ts`.

---

## Prereqs

| Setting | Value |
|---|---|
| Vercel env (production) | `RESEND_API_KEY` set + `RESEND_FROM_ADDRESS` set to a verified domain (e.g. `Setnayan <noreply@setnayan.com>`) |
| Vercel env (production) | `SENTRY_DSN` (server-side, NOT prefixed `NEXT_PUBLIC_`) + `SENTRY_ORG` + `SENTRY_PROJECT` + `SENTRY_AUTH_TOKEN` (for source maps) |
| Vercel env (production) | `OWNER_NOTIFICATION_EMAIL` (recommended) — defaults to `iscasasolaii@gmail.com` if unset |
| Resend dashboard | The `RESEND_FROM_ADDRESS` domain is verified (DNS records propagated, status green) |
| Sentry dashboard | Project receives events at the configured DSN (do a `Test SDK` from the Sentry UI to confirm the DSN works at all) |
| Logged in as | An internal admin user (`is_internal = TRUE` OR `account_type = 'admin'`) on the production site |

## Runbook

### Step 1 — Navigate to the smoke-test panel

1. Open https://www.setnayan.com (or your prod URL)
2. Sign in as an internal admin user
3. Go to `/admin/operations-hiring` (or click the "Operations · Hiring & Growth" pill in admin nav)
4. Scroll to the **Prod smoke tests** panel near the bottom

### Step 2 — Resend email smoke test

1. Click **Send Resend test email**
2. Wait ≤5 seconds — the panel shows either green success ("resend test fired ✓ message_id: re_XXXX → iscasasolaii@gmail.com") or red failure
3. Check the inbox at `OWNER_NOTIFICATION_EMAIL`:
   - **Pass criteria:** email arrives within 60 seconds with subject `Setnayan Resend smoke test — YYYY-MM-DD HH:MM:SS UTC`
   - **Fail criteria:** UI shows success but inbox is empty after 5 minutes, OR UI shows failure
4. If failure, troubleshoot:
   - **reason: `not_configured`** → `RESEND_API_KEY` env var is missing in Vercel prod. Add it, redeploy, retry.
   - **reason: `send_failed` + error mentions domain** → `RESEND_FROM_ADDRESS` uses an unverified domain. Switch to a verified domain in Vercel env, or temporarily use `onboarding@resend.dev` (sandbox — delivers only to the Resend account holder's email).
   - **UI success but no email arrives** → Check Resend dashboard → Logs for the message_id shown in the UI. Common causes:
     - Spam filter on the receiving inbox (check Spam folder)
     - Recipient address bounce
     - Sender domain SPF/DKIM not propagated

### Step 3 — Sentry error smoke test

1. Click **Trigger Sentry test error**
2. The panel shows green success ("sentry test fired ✓ via thrown-error / via network-error-from-throw") — both indicate the throw succeeded
3. Open the Sentry dashboard for the Setnayan project
4. Look for a new event in the **Issues** list within 60 seconds:
   - **Pass criteria:** New issue titled "Setnayan smoke test — Sentry capture verification" with a `trace_id` in the error message (e.g. `trace_id=smoke-1700000000-a3f9d2`)
   - **Fail criteria:** No new event appears in Sentry after 5 minutes
5. (Recommended) Click the new issue → verify:
   - **Environment** is `production` (NOT `development` — Sentry skips dev errors by config)
   - **Server tags** show the correct release version
   - **Stack trace** points to `apps/web/app/api/admin/smoke-test/route.ts`
6. (Recommended) **Verify alerting routing** — if Sentry is configured to email/Slack/Discord on new issues, confirm the alert arrived
7. **Acknowledge / resolve** the test issue in Sentry so it doesn't clutter the dashboard
8. If failure, troubleshoot:
   - **No event in Sentry** → Check `SENTRY_DSN` is set in Vercel prod (server-side var, NOT `NEXT_PUBLIC_`). Confirm the DSN matches the project + region.
   - **Event appears but environment is `development`** → `apps/web/sentry.server.config.ts` has `enabled: process.env.NODE_ENV === 'production'`. If smoke-testing against a preview deploy that isn't `NODE_ENV=production`, the smoke test will throw but won't reach Sentry. Run against the prod URL.
   - **Event appears but stack trace is minified** → `SENTRY_AUTH_TOKEN` is missing or invalid → source maps aren't uploaded. Source maps are uploaded by `next.config.ts` Sentry webpack plugin during build; missing token = no upload.

### Step 4 — Document the result

After both tests pass:

1. Mark `App_Build_Status.md` row for "Sentry prod smoke test" + "Resend prod smoke test" as ✅
2. Add a row to `CLAUDE.md` decision log noting the date + Sentry issue ID + Resend message ID for audit trail
3. Resolve the test Sentry issue
4. Optionally archive the test email in your inbox

If either test fails after troubleshooting, this is a launch-blocking issue — escalate to engineering before proceeding with V1 launch.

---

## Behavior notes

**Why the Sentry smoke test "throws" instead of just calling `Sentry.captureException`:** the most useful smoke test verifies the full UNHANDLED error path — route handler throws → Next.js error boundary → Sentry SDK instrumentation captures → DSN dispatches → dashboard receives. A direct `captureException()` call would skip the instrumentation layer and only verify the SDK works, not that errors thrown anywhere in route handlers get captured. The thrown error is the real-world failure mode.

**Why 500 = success on the Sentry test:** the route handler is designed to throw. The 500 response is the framework's error boundary catching the throw — but BEFORE that boundary returns, the Sentry SDK intercepts the error and ships it. A 200 response would mean the throw didn't happen, which means Sentry didn't get triggered.

**Why this endpoint isn't accessible to non-admins:** admin auth gate via `getCurrentUser()` + `users.is_internal/account_type='admin'`. Non-admins get a generic 404 (not 401) so the endpoint's existence isn't leaked.

**Why text-only emails:** matches the existing `sendVendorInviteEmail` pattern in `apps/web/lib/email.ts` and the 4 hiring-guide templates. HTML rendering is a separate follow-on; smoke test verifies delivery, not rendering.

---

## Cross-references

- Endpoint: `apps/web/app/api/admin/smoke-test/route.ts`
- Admin UI: `apps/web/app/admin/operations-hiring/_components/smoke-test-panel.tsx`
- Sentry config: `apps/web/sentry.server.config.ts` + `apps/web/sentry.client.config.ts` + `apps/web/sentry.edge.config.ts`
- Email helper: `apps/web/lib/email.ts` + `getOwnerNotificationEmail()` in `apps/web/lib/hiring-guide/emails.ts`
- Iteration 0035 Observability (Sentry + PostHog wiring) — `0035_observability/0035_observability.md`
- Iteration 0028 Email Notifications (Resend infra) — `0028_email_notifications/0028_email_notifications.md`
- Memory: `reference_setnayan_owner_email` → `iscasasolaii@gmail.com` as default `OWNER_NOTIFICATION_EMAIL`

## Decision log

- **2026-05-20 — Runbook drafted + smoke-test endpoint shipped.** Endpoint at `/api/admin/smoke-test?type=sentry|resend` · admin UI on `/admin/operations-hiring` · supersedes the manual "throw a test error from the console" approach that wouldn't go through the prod runtime.
