# Iteration 0035 — Observability (Error Monitoring · Product Analytics · Health · Status · On-Call)

**Iteration number:** 0035
**Topic:** Production observability stack for Setnayan V1 — Sentry for errors, PostHog for product analytics, Better Stack for uptime + status page + on-call paging, custom health endpoints, structured logging, and a privacy-first telemetry posture (RA 10173).
**Surface:** Cross-cutting · instruments every iteration; surfaces an admin observability tab inside 0023 Admin Console; consumer-facing status page at `status.setnayan.com`.
**URL pattern:** `setnayan.com/api/health`, `setnayan.com/api/health/deep`, `status.setnayan.com`, `setnayan.com/dashboard/admin/settings/observability`
**Builds on:** 0013 (platform stack), 0023 (admin console + funnel_events table § 3.8), 0025 (notifications opt-out toggle), 0028 (email notification provider), 0034 (payment events firing).
**Status:** Drafted 2026-05-12.
**Phase:** V1 launch-blocking. Without it, the team deploys blind — first bug reports arrive from customers, not from monitors, and incident response is reactive.

---

## 1. Why this iteration exists

Setnayan V1 ships with eight launch-blocking surfaces (payment cart 0034 · vendor dashboard 0022 · admin console 0023 · landing pages 0002 · email 0028 · marketing site 0015 · day-of guest 0031 · communications 0019). Any one of them can fail silently in production — an unhandled exception in the payment screenshot upload handler, a Daily.co token misconfiguration, an R2 signed URL returning 403, a Resend webhook quietly dropping bounce events.

Without observability:

- A payment fails for one customer; we don't know until they email support 6 hours later.
- An admin role tries to approve a vendor and hits a 500; admin assumes "it'll work next time" and the queue silently stalls.
- A wedding day's guest gallery returns 503s for 20 minutes during the ceremony; we find out from a 1-star review the next morning.
- A spike in Sentry errors during a Save-the-Date render storm goes uncorrelated with the deploy that introduced it.

With observability:

- Sentry pages on-call within 60 seconds of a server-side 5xx threshold.
- Better Stack pings `/api/health` every minute and lights up the status page on the first failed check.
- PostHog funnels show "vendor inquiry sent → quote sent → booking confirmed" conversion in real time, so the team sees the marketplace working (or not).
- Vercel log drains stream structured JSON to Better Stack's log explorer for ad-hoc forensics.

**The non-negotiable:** V1 cannot launch without eyes. This iteration locks the stack, the alert rules, the on-call rotation, and the privacy posture so engineering can deploy with confidence.

---

## 2. The observability stack (locked)

| Layer | Tool | V1 plan |
|---|---|---|
| Error monitoring | **Sentry** | Hosted Sentry account · all client + server + edge errors captured · 90-day retention · alerting via email + Slack |
| Product analytics | **PostHog** | Hosted PostHog Cloud (EU region — closest GDPR-equivalent privacy posture) · funnel events from 0023 § 3.8 piped here · session recordings **disabled** by default (privacy) · 90-day retention |
| Uptime monitoring | **Better Stack** (formerly Better Uptime) | Cheaper than Pingdom · pings every 1 min · status page at `status.setnayan.com` |
| Log aggregation | **Vercel Log Drains → Better Stack** | Default Vercel logs + Edge Function logs pipe to Better Stack's log explorer |
| On-call paging | **Better Stack** | Free tier supports 1 on-call user · upgrade to ₱500/mo for a 3-person rotation in V1.5 |
| Health endpoints | Custom `/api/health` + `/api/health/deep` | See § 4 |

**Total monthly cost (V1):** ~₱3,500
- Sentry Team plan ~₱1,500/mo (50K errors/mo · 100K performance units)
- PostHog Cloud free tier suffices at V1 traffic (1M events/mo free); paid tier kicks in at ~₱1,000/mo once traffic grows
- Better Stack Solo plan ~₱1,000/mo (status page + 10 monitors + 1 on-call user)

This is the floor. Higher-revenue months may bump Sentry to ~₱3,000/mo (Business plan with longer retention) and PostHog past the free-event ceiling — budget review monthly.

**Why these tools (rationale):**

- **Sentry** is the industry-default error monitoring stack for Next.js. First-party SDK, source-map upload, breadcrumbs, performance tracing, and release tracking all built in. PH dev teams who've used Sentry need zero ramp time. Self-hosting was considered and rejected — we are 1 engineer in V1; managed Sentry costs less than the engineering hours to run a self-hosted instance.
- **PostHog** beats Mixpanel + Amplitude on price (free 1M events vs Amplitude's ~₱15K/mo entry) and ships feature flags + session recording + cohort builder in one bundle. PostHog Cloud EU was chosen over US for the GDPR-equivalent privacy contract — closest legal equivalent to PH RA 10173.
- **Better Stack** combines uptime monitoring + status page + log management + on-call paging in one bill. Pingdom + StatusPage + Datadog + PagerDuty would cost ~₱15K/mo for the same surface. The trade-off is Better Stack's log volume is more limited; we accept this for V1 and revisit if log volume grows.
- **Custom health endpoints** instead of relying on Better Stack synthetics — `/api/health/deep` knows the difference between "app responds" and "Supabase reachable, R2 reachable, Daily.co reachable, Resend reachable." A synthetic browser test can't.

---

## 3. Sentry integration

### 3.1 SDK setup

Three init files, one per Next.js runtime:

```
sentry.server.config.ts   // Node.js server-side
sentry.client.config.ts   // Browser client-side
sentry.edge.config.ts     // Edge runtime (middleware, edge functions)
```

DSN injected via Vercel environment variable. Source maps upload on every Vercel build via `@sentry/webpack-plugin`.

### 3.2 Sample rates (V1)

```
errors:         100%   // every error captured
performance:     10%   // 1 in 10 transactions traced
replays:          0%   // session replay disabled per privacy posture
profiling:        0%   // CPU profiling disabled (cost + privacy)
```

Performance sampling lifts to 25% in V1.1 once we have a baseline; replays stay off until the privacy review explicitly approves them (likely V2).

### 3.3 User context (PII-scrubbed)

```ts
Sentry.setUser({
  id: user.id,                       // OK — opaque UUID
  account_type: user.account_type,   // OK — 'customer' | 'vendor' | 'admin'
  // email: NEVER
  // full_name: NEVER
  // phone: NEVER
});
```

`user.id` is the only correlator. Email, phone, name are scrubbed before send by the server-side data scrubber (§ 9.2).

### 3.4 Custom tags

Every captured error includes:

- `iteration` — string ID of the iteration the code belongs to (e.g., `'0034'`)
- `flow` — sub-flow within the iteration (e.g., `'payment_screenshot_upload'`)
- `event_id` — when the error happens inside an event context
- `vendor_id` — when the error happens inside a vendor context
- `role_surface` — `'customer'` | `'vendor'` | `'admin'`

This lets the on-call engineer filter to "all 0034 errors in the last hour" or "all admin-surface errors in the last 24h" without grep-ing free-text messages.

### 3.5 Breadcrumbs

Sentry captures the last 50 user actions automatically (clicks, navigation, fetch calls). We extend with custom breadcrumbs at flow boundaries:

```ts
Sentry.addBreadcrumb({
  category: 'cart',
  message: 'cart_item_added',
  data: { sku_code: 'paparazzi_3_seats', cart_id: cart.id },
  level: 'info',
});
```

### 3.6 Error grouping

Sentry's default fingerprinting (stack trace + error type) works for most cases. Custom fingerprints for known error patterns:

- Supabase RLS denials grouped by `policy_name` (not stack)
- R2 4xx errors grouped by `bucket_name + status_code` (not stack)
- Daily.co token errors grouped by `error_code` (not stack)

### 3.7 Example: payment-screenshot upload failure

```ts
try {
  await uploadPaymentProofToR2(file, order.id);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      iteration: '0034',
      flow: 'payment_screenshot_upload',
      role_surface: 'customer',
    },
    extra: {
      order_id: order.id,
      file_size_bytes: file.size,
      mime_type: file.type,
      // NOT included: file name (may contain PII), customer email
    },
  });
  throw new UserFacingUploadError();
}
```

### 3.8 Release tracking

Every Vercel deploy creates a Sentry release tagged with the git SHA. When an error spike correlates with a deploy, Sentry surfaces it under the "regression" tab.

---

## 4. Health endpoints

### 4.1 GET /api/health (liveness)

Lightweight liveness check. Returns 200 + minimal JSON if the Node.js process is up and serving requests. **Does NOT** touch databases, external APIs, or storage — used by Better Stack uptime monitor on a 1-minute cadence with a 10-second timeout.

```ts
// Response shape
{
  "status": "ok",
  "timestamp": "2026-05-12T15:42:30Z",
  "version": "0035.1"   // package.json version, useful for rollout detection
}
```

If this endpoint fails, Vercel is down, the deploy is broken, or DNS is misrouted. Critical-tier alert.

### 4.2 GET /api/health/deep (readiness)

Deep readiness check. Pings each external subsystem in parallel with a 3-second per-subsystem timeout, aggregates results, returns 200 if all subsystems healthy, 503 if any subsystem unhealthy.

```ts
// Response shape (200 — all healthy)
{
  "status": "ok",
  "timestamp": "2026-05-12T15:42:30Z",
  "subsystems": {
    "supabase":  { "status": "ok", "latency_ms":  45 },
    "r2":        { "status": "ok", "latency_ms": 120 },
    "dailyco":   { "status": "ok", "latency_ms": 200 },
    "resend":    { "status": "ok", "latency_ms":  80 },
    "posthog":   { "status": "ok", "latency_ms":  60 }
  }
}

// Response shape (503 — Daily.co down)
{
  "status": "unhealthy",
  "timestamp": "2026-05-12T15:42:30Z",
  "subsystems": {
    "supabase":  { "status": "ok",        "latency_ms":  45 },
    "r2":        { "status": "ok",        "latency_ms": 120 },
    "dailyco":   { "status": "unhealthy", "error": "timeout after 3000ms" },
    "resend":    { "status": "ok",        "latency_ms":  80 },
    "posthog":   { "status": "ok",        "latency_ms":  60 }
  }
}
```

**Status semantics:**

- `ok` — every subsystem responded within budget
- `degraded` — at least one non-critical subsystem is slow (e.g., Resend latency > 1000ms) but everything is reachable; the app keeps running but operators should know
- `unhealthy` — at least one critical subsystem is unreachable (Supabase is always critical; R2 is critical for media surfaces; Daily.co is critical only when active meetings exist; Resend is critical only when payment confirmations are queued)

Better Stack hits this endpoint every 5 minutes. The admin observability tab (§ 10) polls it every 30 seconds while open. Internal staff dashboards may poll up to once per second; rate-limit to 60 req/min per IP to prevent runaway clients.

### 4.3 Per-subsystem ping implementations

| Subsystem | Ping |
|---|---|
| Supabase | `SELECT 1` against the read replica · times out at 3s |
| R2 | HEAD on a fixed `/healthcheck.txt` object · times out at 3s |
| Daily.co | `GET /v1/` (root API) with API key · times out at 3s |
| Resend | `GET /domains` · times out at 3s |
| PostHog | `GET /api/feature_flag/local_evaluation` · times out at 3s |

---

## 5. PostHog product analytics

### 5.1 Pipe

PostHog ingests two streams:

1. **funnel_events** — backend-fired events from the `funnel_events` table per 0023 § 3.8. A Supabase trigger calls a PostHog ingestion edge function on insert; failure of the edge function never blocks the main transaction.
2. **Client-side captures** — explicit `posthog.capture()` calls in the Next.js app for events that don't warrant a DB row (page views, button clicks, form submissions).

### 5.2 Identify on login

```ts
posthog.identify(user.id, {
  account_type: user.account_type,
  signup_date: user.created_at,
  locale: user.locale,         // 'en' | 'tl' | 'ceb'
  // email: NEVER
  // full_name: NEVER
});
```

### 5.3 Key events tracked

| Event | Iteration | Source |
|---|---|---|
| `cart_item_added` | 0034 | Client |
| `cart_checkout_initiated` | 0034 | Server (funnel_events) |
| `payment_proof_submitted` | 0034 | Server (funnel_events) |
| `payment_approved` | 0034 | Server (funnel_events) |
| `vendor_inquiry_sent` | 0019 | Server |
| `vendor_quote_received` | 0019 | Server |
| `vendor_booking_confirmed` | 0006/0034 | Server |
| `save_the_date_template_selected` | 0024 | Client |
| `save_the_date_render_purchased` | 0024 | Server |
| `papic_seat_claimed` | 0012 | Server |
| `papic_photo_uploaded` | 0012 | Server (sampled at 1%) |
| `panood_broadcast_started` | 0011 | Server |
| `tour_started` / `tour_completed` / `tour_skipped` | 0030 | Client |
| `help_article_viewed` / `support_ticket_submitted` | 0029 | Client/Server |
| `vendor_registration_submitted` | 0015 | Server |
| `vendor_verification_approved` | 0023 | Server |

### 5.4 Session recordings — DISABLED in V1

Session recordings would capture too much PII — guest names, vendor messages, payment screenshots. Disabled by SDK config:

```ts
posthog.init(POSTHOG_KEY, {
  disable_session_recording: true,
  capture_pageview: true,
  capture_pageleave: true,
});
```

Revisit in V2 with a privacy review, region-restricted recording (admin surfaces only), and explicit opt-in.

### 5.5 Feature flags

PostHog feature flags drive:

- Gradual rollouts of new iterations (e.g., 0024 Save-the-Date rolled to 10% of users for the first week)
- A/B tests on marketing copy (0015 hero variants)
- Per-event-type kill switches (disable Papic for one wedding if a bug is reported)

### 5.6 Cohort + funnel example

Cohort: "Vendors who registered but haven't responded to first inquiry within 48h."

Funnel: `vendor_registration_submitted` → `vendor_verification_approved` → `vendor_inquiry_received` → `vendor_inquiry_responded` (window: 48h).

Both surfaces light up the operations team's drop-off heatmap and feed the vendor-unresponsive nudge email (0028 template § vendor_unresponsive_48h).

---

## 6. Better Stack — uptime + status page + on-call

### 6.1 Uptime monitors

**Public** (Better Stack runs synthetic checks from multi-region):

- `setnayan.com/` — home
- `setnayan.com/apply` — customer apply
- `setnayan.com/register-vendor` — vendor registration
- 5 sampled vendor landing pages (`/v/[slug]`) rotated weekly

**Internal** (Better Stack calls authenticated endpoints with bearer token):

- `/api/health` — every 1 minute · 10s timeout
- `/api/health/deep` — every 5 minutes · 15s timeout
- Supabase direct ping (Better Stack DB monitor) — every 1 minute

### 6.2 Status page

Hosted at `status.setnayan.com` (custom domain CNAME'd to Better Stack). Public-facing.

- Auto-updates when monitors trip (red banner + incident card)
- Admin can post manual updates ("We are investigating a payment processing delay")
- Historical uptime % displayed per subsystem (90-day rolling)
- Subscribe-to-incident-updates via email (RFC 8058 unsubscribe support inherited from Better Stack)

### 6.3 On-call

| V1 | V1.5 |
|---|---|
| 1 on-call user — Ops Lead (free tier) | 3-person rotation — Ops Lead + Backend Lead + Founder rotates weekly (₱500/mo upgrade) |
| Escalation: SMS + email simultaneously; if no ack within 10 min, escalate to secondary | Escalation: same, plus auto-page next-in-rotation if primary doesn't ack within 15 min |
| Quiet hours: non-P1 alerts batched 22:00–08:00 PHT | Same — quiet hours preserved |

P1 (critical) alerts page even in quiet hours. P2 (warning) and P3 (info) batch.

---

## 7. Logging strategy

### 7.1 Pipeline

```
Next.js app (Vercel)
  ├─ stdout/stderr  ──► Vercel runtime logs  ──► Vercel Log Drain  ──► Better Stack
  └─ Sentry.captureException()  ──► Sentry
```

Vercel auto-captures everything written to stdout/stderr from Next.js server + Edge Functions. The Log Drain ships the stream to Better Stack's log explorer in real time. Sentry captures errors separately.

### 7.2 Log levels

| Level | When | Where |
|---|---|---|
| `error` | Anything thrown · always captured by Sentry too | Sentry + Better Stack |
| `warn` | Non-fatal anomaly (slow query, retry attempted, deprecated path hit) | Better Stack |
| `info` | Flow boundary crossings (request received, response sent, queue job started) | Better Stack |
| `debug` | Verbose · enabled only in dev + staging · suppressed in production | Better Stack (staging only) |

### 7.3 Structured JSON

All server logs are JSON-formatted with consistent fields:

```ts
console.log(JSON.stringify({
  level: 'info',
  iteration: '0034',
  flow: 'payment_proof_submitted',
  user_id: user.id,
  order_id: order.id,
  request_id: ctx.request_id,
  message: 'Payment proof uploaded to R2',
  timestamp: new Date().toISOString(),
}));
```

A logger helper wraps this — engineers call `log.info({...})` rather than hand-rolling JSON.stringify each time.

### 7.4 Retention

- Better Stack default: 30 days
- Sentry: 90 days (V1 Team plan)
- Vercel raw logs: 24 hours (Hobby) / 7 days (Pro)

V1 retention is intentionally short to keep cost down and minimize PII exposure surface. Longer retention requires explicit privacy review.

---

## 8. Alert rules

### 8.1 Critical (page on-call immediately, 24/7)

- `/api/health` returns 5xx for 2 consecutive checks (2 minutes)
- `/api/health/deep` returns `unhealthy` for 2 consecutive checks (10 minutes)
- Sentry error rate > 50 errors/minute sustained 5 minutes
- Supabase 5xx rate > 50% sustained 5 minutes
- Daily.co video meeting setup failures > 50% sustained 5 minutes (during business hours)
- Status page subscriber count drops > 30% in 1 hour (signal of incident-driven unsubscribes)

### 8.2 Warning (Slack notification only, not paged)

- Sentry error rate > 10 errors/minute sustained 15 minutes
- `/api/health/deep` returns `degraded` for 3 consecutive checks (15 minutes)
- R2 upload latency p99 > 5s sustained 10 minutes
- Daily.co video meeting setup failures > 5% sustained 30 minutes
- Resend email delivery rate < 95% sustained 30 minutes
- Vercel deployment failures (2 consecutive)

### 8.3 Info (Slack daily digest at 09:00 PHT)

- Daily error count > 1,000
- Daily 4xx rate > 5%
- R2 storage usage > 80% of plan limit
- Supabase row count growth > 10% week-over-week (capacity planning signal)
- PostHog event volume approaching free-tier ceiling

### 8.4 Alert deduplication

Sentry's issue grouping deduplicates errors by fingerprint. Better Stack alert deduplication: identical monitor failures within 15 minutes consolidate into one incident card. Reduces "alert storm" noise during real outages.

---

## 9. Privacy + RA 10173 compliance

### 9.1 No PII in logs

Email addresses, full names, phone numbers, payment card details, and government IDs MUST NOT appear in log messages, breadcrumbs, error contexts, or analytics events. Correlation uses `user_id` only (opaque UUID).

### 9.2 Sentry server-side data scrubber

Sentry's data scrubber runs before send:

```ts
Sentry.init({
  // ...
  beforeSend(event) {
    // Strip known PII fields
    if (event.user) {
      delete event.user.email;
      delete event.user.username;
      delete event.user.ip_address;
    }
    // Scrub free-text PII patterns
    event = scrubEmailPattern(event);          // RFC 5322 regex
    event = scrubCreditCardPattern(event);     // Luhn-valid 13–19 digit runs
    event = scrubPHPhonePattern(event);        // +63 9XX XXXX XXX
    return event;
  },
});
```

### 9.3 PostHog opt-out

Users opt out of product analytics via 0025 Profile Settings → Privacy → "Help improve Setnayan" toggle. Default ON (industry standard); UI clearly labels what is collected and provides one-tap toggle.

```ts
// On toggle off
posthog.opt_out_capturing();

// On toggle on
posthog.opt_in_capturing();
```

### 9.4 Session recordings DISABLED in V1

Per § 5.4. Not configurable in V1 — disabled by SDK init, no admin override.

### 9.5 Data residency

Sentry, PostHog (EU), Better Stack are not PH-region hosted. Cross-border data flow is anonymized telemetry — no PII per § 9.1. This is documented in the Privacy Policy under "Service Providers" with each vendor's data processing agreement linked.

### 9.6 Right to erasure

When a user invokes account deletion (per 0025 § 6 — RA 10173 § 16(e)):

- Sentry: scheduled job calls Sentry's user deletion API to scrub historical events
- PostHog: same — PostHog supports `posthog.reset()` on client + server-side user delete API
- Better Stack: logs purged via the 30-day rolling retention (no explicit delete API; user_id naturally ages out)

Documented latency: user-data erasure across observability vendors completes within 30 days of the soft-delete grace window.

---

## 10. Admin observability surface (extends 0023)

A new sub-section inside 0023 Admin Console → Settings → **Observability**:

| Card | Content | Source |
|---|---|---|
| Subsystem health | Green/amber/red badges for Supabase · R2 · Daily.co · Resend · PostHog · Vercel | `/api/health/deep` polled every 30s |
| Recent errors | Top 10 Sentry issues in last 24h with counts + last-seen + open Sentry link | Sentry Issues API |
| Funnel snapshot | Today vs 7d-avg for the 4 headline funnels (cart conversion · vendor signup · S-T-D purchase · Papic seat claim) | PostHog API |
| Uptime | Last-7-day uptime % per public surface | Better Stack API |
| Status page | "Post incident update" button → opens status page admin | Better Stack |
| On-call | Current on-call user + escalation contact + "I'm on-call now" override | Better Stack (V1.5) |

Visible to admin roles `Operations Lead`, `Engineering Lead`, `Founder` per 0023 § 9 role gates. Read-only for `Verification Handler` and `Transactions Handler`.

---

## 11. Acceptance tests (V1)

1. Server-side exception thrown in any iteration → appears in Sentry within 60 seconds with `iteration` tag.
2. Client-side React error boundary triggered → appears in Sentry with breadcrumbs.
3. Sentry user context contains `id` + `account_type` ONLY — never email/name/phone (regression-tested).
4. Email address embedded in error message body → scrubbed before Sentry send.
5. `/api/health` returns 200 + `{ status: 'ok', timestamp, version }` in < 50ms p99.
6. `/api/health/deep` returns 200 + per-subsystem latencies when everything healthy.
7. `/api/health/deep` returns 503 when Supabase ping times out, with `unhealthy` status and Supabase error detail.
8. Better Stack uptime monitor at 1-minute cadence trips on first 5xx, lights up status page within 2 minutes.
9. Better Stack pages on-call (SMS + email) within 5 minutes of monitor trip.
10. PostHog `cart_item_added` event fires with sku_code + cart_id, no PII.
11. PostHog opt-out via Profile Settings → no further events captured client-side from that user.
12. Session recordings: confirmed disabled in production SDK config (build-time assertion).
13. Vercel log drain → Better Stack log explorer surfaces structured JSON within 30 seconds of console.log.
14. Sentry source map upload succeeds on Vercel build; production stack traces unminified.
15. Alert dedup: 50 identical errors in 1 minute create 1 Sentry issue + 1 Slack notification, not 50.
16. Feature flag evaluated server-side: `posthog.isFeatureEnabled('save_the_date_gradual_rollout', user.id)` returns deterministic boolean.
17. Account deletion (0025) triggers Sentry + PostHog user erasure API call within 24 hours.
18. Admin Observability tab loads in < 2s with all 6 cards populated.

---

## 12. Build sequence

1. **Day 1** — Sentry account creation · DSN in Vercel env vars · `sentry.{server,client,edge}.config.ts` committed · source map upload working in staging.
2. **Day 1** — Logger helper (`@/lib/log.ts`) + structured JSON enforced via lint rule.
3. **Day 2** — `/api/health` + `/api/health/deep` endpoints implemented + tested locally.
4. **Day 2** — PostHog account + project · client + server SDKs initialized · identify-on-login wired.
5. **Day 3** — Better Stack account · uptime monitors created · status page DNS configured (`status.setnayan.com`).
6. **Day 3** — Vercel Log Drain → Better Stack configured.
7. **Day 4** — Alert rules entered into Better Stack + Sentry (critical · warning · info tiers).
8. **Day 4** — Admin Observability tab (0023 extension) — health card + recent errors card + funnel card.
9. **Day 5** — Fire-drill: trigger synthetic 5xx in staging · confirm Sentry alert · confirm Slack notification · confirm on-call SMS · confirm status page update. Document run-of-show in `09_Operations/incident_response_runbook.md`.
10. **Day 5** — Privacy review: verify Sentry scrubber working · PostHog opt-out wired · session recordings off · all 15 acceptance tests pass.

**Engineering effort:** 1 engineer · 1 week to V1-ready.

---

## 13. Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-05-12 | Sentry over Rollbar / Bugsnag | First-class Next.js support; PH dev market familiarity; release tracking + source map upload built in |
| 2026-05-12 | PostHog over Mixpanel / Amplitude | Bundled feature flags + analytics + cohorts at 10–20% the cost; EU region for GDPR-equivalent privacy contract |
| 2026-05-12 | Better Stack over Pingdom + StatusPage + PagerDuty | Single vendor consolidates uptime + status + log + on-call at ₱1K/mo vs ~₱15K split across 4 vendors |
| 2026-05-12 | Custom `/api/health` + `/deep` over synthetic-only | Synthetic browser checks can't distinguish "app responds" from "Supabase reachable, R2 reachable, etc." — too coarse for incident triage |
| 2026-05-12 | Session recordings DISABLED in V1 | RA 10173 minimization principle; payment screenshots + guest names + vendor messages in DOM make recordings a PII hazard; revisit V2 with explicit opt-in |
| 2026-05-12 | Performance sampling 10% in V1 | Cost control during launch traffic; lift to 25% in V1.1 once baseline data exists |
| 2026-05-12 | No replays · no profiling V1 | Same privacy + cost rationale; replays require explicit opt-in path that V1 hasn't designed yet |
| 2026-05-12 | On-call free tier (1 user) for V1 | Avoid the ₱500/mo upgrade until we have at least 3 engineers to rotate; until then Ops Lead carries the pager |
| 2026-05-12 | User context = `id` + `account_type` only | Hard PII boundary in observability; correlation possible via internal admin tooling with proper audit trail |
| 2026-05-12 | Health-endpoint rate-limit 60 req/min per IP | Prevents runaway internal clients from DDoS'ing the deep health check + cascading subsystem pings |
| 2026-05-12 | Log retention 30 days (Better Stack) + 90 days (Sentry) | Sufficient for incident forensics + post-mortem windows; longer retention requires privacy review |
| 2026-05-12 | Status page at `status.setnayan.com` subdomain | Independent infrastructure from setnayan.com — if main app goes down, status page stays up because it lives on Better Stack |

---

## 14. Companion docs

- `0013_platform_stack_and_sync/` — defines the stack this iteration instruments
- `0023_admin_console/` — funnel_events table § 3.8 + admin role gates § 9 + Observability sub-tab landing here in § 10
- `0025_profile_settings/` — Privacy tab hosts the PostHog opt-out toggle
- `0028_email_notifications/` — Resend integration that this iteration health-checks
- `0034_payments_and_cart/` — emits funnel_events that PostHog consumes
- `Setnayan_Privacy_and_Security_Policy.md` — documents the cross-border telemetry flows + scrubbing posture
- `09_Operations/incident_response_runbook.md` — produced as deliverable of § 12 Day 5 fire-drill; covers paging, comms, post-mortem template
