# Iteration 0033 — Public API Foundation

**Iteration number:** 0033
**Topic:** Plumbing for a future public API. OAuth2 PKCE authorization server, scoped tokens, rate limiting, schema versioning, webhook delivery infrastructure, and a developer portal. NO public endpoints turn on in V1 — this iteration ships the foundation so V1.5 can flip endpoints on incrementally without retro-fitting auth or rate limiting under fire.
**Surface:** Customer / vendor / admin (foundation only) + new developer portal subdomain `developers.setnayan.com`.
**URL pattern:** `api.setnayan.com/v{n}/{resource}`, `developers.setnayan.com/apps/{app_id}`, admin extension under `setnayan.com/dashboard/admin/api`.
**Builds on:** 0000 (auth + role-router), 0013 (Supabase + Cloudflare + R2 platform stack), 0019 (webhook delivery patterns), 0023 (admin console — extends with API surface).
**Status:** Drafted 2026-05-12.
**Phase:** V1 ships **foundation only**. Zero customer-facing endpoints active. Internal-only callback endpoints (Resend, Daily.co, GCash) routed through the same gateway so V1 stress-tests the plumbing.

---

## 1. Why this iteration exists

Owner direction (2026-05-12): "set this up now for future-proofing." Locking in the API foundation while the codebase is small means V1.5's first endpoint flip is a configuration change, not a refactor.

**The trap we are avoiding.** Most platforms add a public API after they ship — and then discover that their internal architecture assumed trusted callers, made auth a per-route afterthought, hardcoded rate limits in three different places, and never planned for schema versioning. By the time those problems surface, every internal team is paying the refactor tax.

**What "foundation" means here:**

- An API gateway sits between the public internet and every Setnayan backend service, from day one. Internal callbacks (Resend webhooks, Daily.co meeting events, GCash payment notifications) flow through it. The gateway is real, exercised, observed, hardened — just not exposed to third-party developers yet.
- OAuth2 with PKCE is implemented end-to-end. First-party Setnayan apps (web, mobile) use the same authorization server an external app would use later. No "internal auth" vs "public auth" split.
- Every Edge Function defines its OpenAPI schema fragment. Schema is generated at build-time, published at `api.setnayan.com/v1/openapi.json`. Internal endpoints carry `x-internal: true` and are stripped from the public bundle.
- Rate-limiting middleware runs on every request, even internal ones. The tier table is in code; flipping a token to "free tier" applies the same limits the eventual public free tier will see.
- Webhook delivery infrastructure (queue + retry + HMAC signing) is built and used internally for events like `payment.reconciled` posting to admin Slack-equivalents. Same code path that third-party webhook subscriptions will use in V1.5.

When V1.5 says "ship the first three public endpoints," the work is: write the Edge Function business logic, declare the scopes, publish to the OpenAPI bundle. The plumbing is already battle-tested.

---

## 2. Architecture

### 2.1 Gateway

**Cloudflare Workers** sit in front of every Setnayan backend service. The Worker layer owns:

- TLS termination
- Request authentication (Bearer token validation, OAuth flow handlers)
- Rate limit enforcement (per-token, per-IP, per-account)
- Request logging (writes to `api_request_log`)
- API version routing (`/v1/...` → v1 Edge Functions; `/v2/...` → v2 Edge Functions)
- Response header stamping (`X-Setnayan-Api-Version`, `X-Request-Id`, `X-RateLimit-*`)
- CORS enforcement for browser-origin callers

**Supabase Edge Functions** sit behind the gateway and own business logic only. No Edge Function ever sees an unauthenticated request — the gateway either resolves the caller's `user_id` + `scopes` and forwards them as signed headers (`X-Setnayan-User-Id`, `X-Setnayan-Scopes`), or returns 401/403 directly.

This split means:
- Edge Functions stay small and testable. They trust the gateway-provided context.
- Rate limit logic and auth logic live in one place. No drift across functions.
- The gateway can be swapped (e.g., to AWS API Gateway, Kong) without touching business logic.

### 2.2 Authorization server (OAuth2 with PKCE)

**Standard:** RFC 6749 (OAuth 2.0) + RFC 7636 (PKCE) + RFC 6750 (Bearer tokens) + RFC 7009 (token revocation).

**Flows supported in V1:**
- Authorization Code with PKCE (for third-party apps, single-page apps, mobile apps)
- Refresh Token grant (with rotation)

**Flows NOT supported (locked decision):**
- Implicit flow (deprecated by IETF; PKCE supersedes it)
- Resource Owner Password Credentials (RFC explicitly warns against; we never want third-party apps holding user passwords)
- Client Credentials grant (no server-to-server use case in V1; revisit if Setnayan adds B2B integrations like Zapier connectors)

**Token shape:**
- Access token: opaque random string (256-bit entropy), prefix `stn_at_`, 1-hour lifetime
- Refresh token: opaque random string (256-bit entropy), prefix `stn_rt_`, 30-day lifetime, single-use (rotated on each use)
- Tokens are validated by lookup in `api_tokens` keyed on SHA-256 hash, never decoded JWTs

**Why opaque tokens, not JWTs:** JWTs sound great until you need to revoke one before its expiry. Opaque-token-with-lookup gives instant revocation, lets us update scopes mid-session, and survives a private-key rotation without forcing every active session to log out. Cost: one Redis-cached DB lookup per request — negligible.

### 2.3 Token storage

- `api_tokens.token_hash` stores SHA-256 of the token (cleartext token never persisted)
- `api_tokens.token_last4` stores the last 4 characters cleartext so UI can show `stn_at_••••••abcd` for selection
- Tokens are issued exactly once. If the user loses theirs, they revoke and re-issue — there is no recovery path
- Token-hash lookup is cached in Cloudflare Workers KV with 60-second TTL (revocations propagate within 60 seconds)

### 2.4 Versioning

**Path-based major versions:** `/v1/events/{id}` vs `/v2/events/{id}`. Major bumps reserved for **breaking schema changes only** (removed fields, changed field types, changed response shape).

**Header-based minor versions:** Additive changes (new optional fields, new optional query params) ship without a path bump. Each response carries `X-Setnayan-Api-Version: 1.4` so clients can opt into newer behavior with `X-Setnayan-Api-Version-Pinned: 1.2` if they need stability.

**Deprecation policy (locked):**
- Minor version: backward-compatible always; no deprecation needed
- Major version: previous major supported for 12 months minimum after the next major ships; deprecation warnings injected as `Deprecation: true` and `Sunset: <RFC9745-date>` response headers starting 6 months before sunset

### 2.5 Rate limiting

Per-token quotas + per-IP DOS protection + per-account app cap. See Section 8 for the full table.

Limits are enforced by a sliding-window counter in Cloudflare Workers KV. Each request decrements the relevant counters; if any counter reaches zero, the gateway returns `429 Too Many Requests` with a `Retry-After: <seconds>` header and `X-RateLimit-Remaining: 0`.

### 2.6 Webhook delivery

Outbound events get POSTed to subscriber URLs. Delivery semantics:
- **At-least-once.** Subscribers must implement idempotency keys (we provide `X-Setnayan-Delivery-Id` per attempt)
- **Retry schedule:** 5min → 30min → 2hr → 8hr → 24hr → fail. Five retries; total span 1d 10h 35m
- **HMAC signing:** every delivery carries `X-Setnayan-Signature: sha256=<hex>` computed as `HMAC-SHA256(body, hmac_secret)` so subscribers can verify authenticity
- **Hard timeout:** subscriber must respond within 10 seconds. Any 2xx response = success; anything else (including timeout) = retry
- **Expiry:** after 5 failed attempts, delivery moves to `status='expired'` and the subscription gets a strike. 3 strikes auto-disables the subscription and emails the app owner

### 2.7 OpenAPI 3.1 schema

Auto-generated from Edge Function type definitions (TypeScript types → JSON Schema → OpenAPI). Build pipeline runs on every commit; published at:
- `api.setnayan.com/v1/openapi.json` (public bundle — `x-internal: true` endpoints stripped)
- `api.setnayan.com/v1/openapi.internal.json` (full bundle — gated to Setnayan admins)

Compatible with Postman, Insomnia, OpenAPI Generator, and Stoplight tooling. The dev portal embeds Swagger UI rendered against the public bundle.

---

## 3. Scoped permissions catalog

Token scopes follow the pattern `{action}:{resource}` where action ∈ `read | write | delete`. Tokens combine scopes; an app requests a list at OAuth flow start, the user grants exactly what they choose, the token is issued with exactly those scopes. **No runtime scope escalation is possible** — to gain a new scope, the app must re-initiate the OAuth flow and the user must re-consent.

### 3.1 Standard scopes

| Scope | What it grants | V1.5 endpoint examples |
|---|---|---|
| `read:events` | List + read events the user is on | `GET /v1/events/me`, `GET /v1/events/{id}` |
| `write:events` | Edit event metadata, dates, settings | `PATCH /v1/events/{id}` |
| `delete:events` | Soft-delete an event (organizer only) | `DELETE /v1/events/{id}` |
| `read:guests` | List + read the guest list of events the user organizes | `GET /v1/events/{id}/guests` |
| `write:guests` | Add / edit / remove guests | `POST /v1/events/{id}/guests`, `PATCH /v1/guests/{id}` |
| `read:vendors` | Read vendor profiles (public + booked) | `GET /v1/vendors/{id}`, `GET /v1/vendors/search` |
| `write:vendors` | Vendor-side: edit own vendor profile, services, calendar | `PATCH /v1/vendors/{id}` |
| `read:bookings` | List + read bookings (customer-side: my bookings; vendor-side: my clients) | `GET /v1/bookings`, `GET /v1/bookings/{id}` |
| `write:bookings` | Create / update / cancel bookings | `POST /v1/bookings`, `PATCH /v1/bookings/{id}` |
| `read:contracts` | Download contracts the user is party to | `GET /v1/contracts/{id}/download` |
| `write:contracts` | Upload / sign contracts | `POST /v1/contracts` |
| `read:photos` | Read Papic gallery for events the user has access to | `GET /v1/events/{id}/photos` |
| `write:photos` | Upload photos via Papic API (third-party DSLR integrations) | `POST /v1/events/{id}/photos` |
| `read:schedule` | Read event schedule + calendar feeds | `GET /v1/events/{id}/schedule.ics` |
| `read:messages` | Read chat threads (heavily restricted — explicit user consent required, audit-logged) | `GET /v1/threads/{id}/messages` |
| `read:analytics` | Vendor-side stats, customer-side spend history | `GET /v1/analytics/vendor/me` |

### 3.2 Special scopes

| Scope | What it grants |
|---|---|
| `webhook:subscribe` | App may register webhook subscriptions for events on resources it has read access to. Subscriptions are auto-revoked if the underlying read scope is revoked. |

### 3.3 Scope invariants (locked)

- `delete:*` always requires the corresponding `write:*` and `read:*`
- `write:*` always requires the corresponding `read:*`
- `read:messages` is **never bundled** with other scopes silently — the consent screen must call it out explicitly with a "this app will read your private conversations" warning
- Scopes are **per-user**, not per-event. An app with `read:events` reads every event the user can see; the gateway scopes the response by membership

---

## 4. Developer portal at `developers.setnayan.com`

The dev portal is the third-party developer's entire interface to Setnayan APIs.

### 4.1 Account model

Any Setnayan user (customer, vendor, or admin) can register as a developer. No separate developer account type — the existing `users` row gets `is_developer = TRUE` set on first portal login. This means:
- Couples who want to script their own wedding workflows can build personal apps
- Vendors who want to integrate Setnayan with their existing studio software can build vendor-side apps
- Wedding-tech startups can build apps against Setnayan's public API

Free tier: up to 5 apps per user. Pro tier (planned V1.5): unlimited apps.

### 4.2 Portal surfaces

| Surface | What it does |
|---|---|
| **Dashboard** | List my apps, recent request volumes, alerts (failed webhooks, expiring tokens) |
| **Create app** | Name + logo + redirect URIs + description + scopes-requested. On submit: `client_id` issued immediately, `client_secret` shown ONCE (downloadable as `.env`-format file), app enters `status='pending_review'` |
| **App detail** | Edit metadata, regenerate `client_secret` (invalidates old; all active tokens revoked), view scope grants |
| **Metrics** | Requests/day, p50/p99 latency, error breakdown by status code, rate-limit hits, top endpoints |
| **Webhooks** | Manage subscriptions (which events fire to which URLs), view delivery log per subscription, replay failed deliveries |
| **API docs** | Embedded Swagger UI rendered from `api.setnayan.com/v1/openapi.json` |
| **Sandbox** | Generate a sandbox token bound to a synthetic test event with fake guests, fake vendors, fake bookings. Sandbox tokens never hit production data. |
| **Logs** | Last 7 days of requests for this app (paginated), with full request/response details. After 7 days, summary metrics remain but per-request detail is purged. |

### 4.3 App approval workflow

Apps in `status='pending_review'` can call only sandbox-scoped endpoints. Production access requires Setnayan admin review:
- Apps requesting only standard scopes (`read:*` / `write:*` on the app owner's own resources) are auto-approved after 24 hours if no admin flags
- Apps requesting `read:messages`, `write:bookings`, or `delete:*` require explicit admin approval
- Apps with > 3 reported abuse incidents auto-suspend pending review

---

## 5. V1 endpoints (locked-down internal-only)

No public endpoints in V1. All routes in V1 are flagged `x-internal: true` in OpenAPI and require either:
- A Setnayan-internal Bearer token (admin console, mobile app session, web app session), OR
- A vetted third-party callback signature (Resend, Daily.co, GCash)

### 5.1 Internal callback endpoints

| Path | Purpose | Authenticator |
|---|---|---|
| `POST /v1/internal/webhooks/resend` | Email delivery events from 0028 | Resend HMAC signature |
| `POST /v1/internal/webhooks/daily` | Meeting events from 0019 | Daily.co HMAC signature |
| `POST /v1/internal/webhooks/gcash` | Payment notifications | GCash webhook signature (V1.5; manual in V1) |
| `POST /v1/internal/webhooks/cloudflare` | R2 upload completion events | Cloudflare HMAC signature |

These are real production endpoints. Routing them through the gateway gives V1 a full operational exercise of the auth + rate limit + logging + retry infrastructure.

### 5.2 Sandbox-only public endpoints (V1)

The dev portal sandbox exposes a synthetic surface so external developers can build against the API before V1.5 flips production endpoints on:

| Path | Returns |
|---|---|
| `GET /v1/sandbox/events/me` | Synthetic wedding-event payload |
| `GET /v1/sandbox/vendors/search?q=photographer` | Synthetic vendor list |
| `GET /v1/sandbox/openapi.json` | Full OpenAPI bundle including planned V1.5 endpoints |

Sandbox endpoints respond with `X-Setnayan-Sandbox: true` and never touch production data.

---

## 6. V1.5+ endpoint roadmap (NOT building, documenting the order)

The roadmap below is the planned flip sequence. Each phase requires the prior phase's endpoints to be stable + observed in production for at least 4 weeks before the next phase's endpoints flip on.

### 6.1 Phase A — Read-only event surface (V1.5 launch)

| Endpoint | Scopes | Notes |
|---|---|---|
| `GET /v1/events/me` | `read:events` | List events the authenticated user is on |
| `GET /v1/events/{id}` | `read:events` | Event detail, scope-gated by membership |
| `GET /v1/events/{id}/schedule` | `read:schedule` | Used by calendar-sync apps (Google Calendar, Apple Calendar, Outlook integrations) |
| `GET /v1/events/{id}/schedule.ics` | `read:schedule` | iCalendar feed for subscribe-based calendar sync |

### 6.2 Phase B — Webhook delivery (after Phase A learnings)

Webhook event types fired:
- `event.created` — when a new event is created on the user's account
- `event.updated` — when an event the user is on is edited
- `event.deleted` — when an event is soft-deleted
- `booking.confirmed` — when a vendor booking moves to `confirmed` status
- `booking.cancelled` — when a vendor booking is cancelled
- `photo.uploaded` — when a new photo lands in Papic gallery (heavily rate-limited; subscribers can opt for digest mode)

Webhook subscription flow lives in the developer portal (Section 4).

### 6.3 Phase C — Public vendor browse

| Endpoint | Scopes | Notes |
|---|---|---|
| `GET /v1/vendors/{id}` | none (public) | Public vendor profile. No auth required; rate-limited per IP. |
| `GET /v1/vendors/search` | none (public) | Vendor browse with filters. Rate-limited per IP (300 req/min ceiling). |

Phase C is the first **no-auth-required** public surface. Triggers a separate review pass for caching strategy (Cloudflare edge cache: 5-min TTL on `GET /v1/vendors/{id}`, 60-sec TTL on `GET /v1/vendors/search`).

### 6.4 Phase D — Third-party booking flow (probably never)

`POST /v1/bookings` to let third-party apps initiate bookings on behalf of the user. Probably never ships because:
- Booking flow includes payment, which requires PCI scope we don't want to expose
- Coordination with the vendor's calendar is real-time and breaks the request/response model
- The booking flow is the highest-value user interaction on the platform; off-loading it to third parties is strategically questionable

Documented here as the line we currently don't cross.

---

## 7. Schema

```sql
-- OAuth applications registered by third parties (and first-party Setnayan apps)
CREATE TABLE oauth_applications (
  app_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id       UUID NOT NULL REFERENCES users(user_id),
  name                TEXT NOT NULL,
  description         TEXT,
  logo_r2_key         TEXT,
  redirect_uris       TEXT[] NOT NULL,
  client_id           TEXT UNIQUE NOT NULL,           -- public, displayable
  client_secret_hash  TEXT NOT NULL,                  -- SHA-256(secret)
  client_secret_last4 TEXT NOT NULL,                  -- cleartext last 4 chars for UI
  scopes_requested    TEXT[] NOT NULL,                -- declared at registration
  status              TEXT NOT NULL DEFAULT 'pending_review'
                      CHECK (status IN ('pending_review','approved','rejected','suspended')),
  tier                TEXT NOT NULL DEFAULT 'free'
                      CHECK (tier IN ('free','pro','enterprise')),
  is_first_party      BOOLEAN NOT NULL DEFAULT FALSE, -- Setnayan-owned apps skip review
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at         TIMESTAMPTZ,
  approved_by         UUID REFERENCES users(user_id),
  suspended_at        TIMESTAMPTZ,
  suspended_reason    TEXT
);

CREATE INDEX idx_oauth_apps_owner ON oauth_applications(owner_user_id);
CREATE INDEX idx_oauth_apps_status ON oauth_applications(status) WHERE status != 'approved';

-- User authorizations (one row per user-app pair, per scope-grant)
CREATE TABLE oauth_authorizations (
  authorization_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id           UUID NOT NULL REFERENCES oauth_applications(app_id),
  user_id          UUID NOT NULL REFERENCES users(user_id),
  scopes_granted   TEXT[] NOT NULL,
  authorized_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at       TIMESTAMPTZ,
  UNIQUE(app_id, user_id, authorized_at)
);

CREATE INDEX idx_oauth_authz_user ON oauth_authorizations(user_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_oauth_authz_app ON oauth_authorizations(app_id) WHERE revoked_at IS NULL;

-- Issued tokens (access + refresh)
CREATE TABLE api_tokens (
  token_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  authorization_id UUID NOT NULL REFERENCES oauth_authorizations(authorization_id),
  token_hash       TEXT UNIQUE NOT NULL,            -- SHA-256 of cleartext token
  token_last4      TEXT NOT NULL,
  type             TEXT NOT NULL CHECK (type IN ('access','refresh')),
  scopes           TEXT[] NOT NULL,                 -- copy of grant at issue-time
  expires_at       TIMESTAMPTZ NOT NULL,
  revoked_at       TIMESTAMPTZ,
  last_used_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_tokens_hash ON api_tokens(token_hash) WHERE revoked_at IS NULL;
CREATE INDEX idx_api_tokens_auth ON api_tokens(authorization_id);

-- Request log (every API call lands here for observability + abuse detection)
CREATE TABLE api_request_log (
  request_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id         UUID REFERENCES oauth_applications(app_id),
  user_id        UUID REFERENCES users(user_id),
  token_id       UUID REFERENCES api_tokens(token_id),
  method         TEXT NOT NULL,
  path           TEXT NOT NULL,
  status_code    INT NOT NULL,
  duration_ms    INT NOT NULL,
  ip_address     INET,
  user_agent     TEXT,
  rate_limit_hit BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_request_log_app_time ON api_request_log(app_id, created_at DESC);
CREATE INDEX idx_request_log_user_time ON api_request_log(user_id, created_at DESC);
CREATE INDEX idx_request_log_status ON api_request_log(status_code, created_at DESC)
  WHERE status_code >= 400;

-- Webhook subscriptions
CREATE TABLE webhook_subscriptions (
  subscription_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id           UUID NOT NULL REFERENCES oauth_applications(app_id),
  event_type       TEXT NOT NULL,                    -- e.g. 'event.created'
  delivery_url     TEXT NOT NULL,
  hmac_secret_hash TEXT NOT NULL,                    -- SHA-256 of HMAC secret
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  strike_count     INT NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_subs_event ON webhook_subscriptions(event_type) WHERE is_active = TRUE;

-- Webhook delivery attempts (one row per subscription per event firing)
CREATE TABLE webhook_deliveries (
  delivery_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id    UUID NOT NULL REFERENCES webhook_subscriptions(subscription_id),
  event_payload      JSONB NOT NULL,
  attempt_count      INT NOT NULL DEFAULT 0,
  next_attempt_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at       TIMESTAMPTZ,
  last_response_code INT,
  last_response_body TEXT,
  status             TEXT NOT NULL DEFAULT 'queued'
                     CHECK (status IN ('queued','delivered','failed','expired')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_deliveries_queued ON webhook_deliveries(next_attempt_at)
  WHERE status = 'queued';
CREATE INDEX idx_webhook_deliveries_sub ON webhook_deliveries(subscription_id, created_at DESC);
```

**Total new tables:** 6 (`oauth_applications`, `oauth_authorizations`, `api_tokens`, `api_request_log`, `webhook_subscriptions`, `webhook_deliveries`).

---

## 8. Rate limit + abuse prevention

### 8.1 Tier table

| Tier | Per-token quota | Burst (5-sec window) | Apps per account |
|---|---|---|---|
| Free | 100 req/min | 50 req | 5 |
| Pro | 1,000 req/min | 500 req | unlimited |
| Enterprise | 10,000 req/min | 5,000 req | unlimited |

Pro and Enterprise tiers are V1.5+ pricing decisions; V1 ships only the Free tier definition. The schema (`oauth_applications.tier`) already supports them so the upgrade path is data-only.

### 8.2 Per-IP DOS ceiling

600 req/min hard ceiling per source IP, regardless of token tier. Applies to:
- Unauthenticated traffic (sandbox endpoints, eventual public vendor browse)
- Token-authenticated traffic (a single misbehaving app on Enterprise tier still can't exceed 600 req/min from one IP)

Source IPs that exceed the ceiling more than 3 times in an hour get a 1-hour cooldown. Repeat offenders escalate to a 24-hour block; admin can permanently block.

### 8.3 429 response shape

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 12
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1715520000

{
  "error": "rate_limited",
  "message": "Quota exceeded. Retry after 12 seconds.",
  "scope": "per_token"
}
```

### 8.4 Burst capacity

Sliding-window counter. Within any 5-second window, an app may use up to 50% of its per-minute quota. Prevents an app from blowing its entire 100/min budget in the first second.

### 8.5 Abuse detection

Auto-suspension triggers:
- 5xx response rate > 50% over 1 hour (the app is hammering broken endpoints; suspend pending investigation)
- 429 rate > 80% over 1 hour (the app isn't honoring rate limits; suspend pending investigation)
- 3 reported abuse incidents from end users (consent-screen complaints, behavior reports)
- Webhook subscription strikes ≥ 3 (consecutive delivery failure cycles)

Suspended apps return 503 to all requests with `X-Setnayan-Suspended-Reason` and email the app owner with the rationale + appeal path.

---

## 9. Admin operations (extends 0023)

New surface in the admin console: **API & Developer Portal** at `setnayan.com/dashboard/admin/api`.

### 9.1 Admin surfaces

| Surface | What it does | Role gate |
|---|---|---|
| **App queue** | List `status='pending_review'` apps + approve / reject / request-changes | API & Developer Reviewer role |
| **All apps** | All registered apps, filterable by status / tier / scope-requested / owner | API & Developer Reviewer role |
| **Volume dashboard** | Aggregate request volumes, error rates, top apps by traffic, p99 latencies | API & Developer Reviewer + Analytics roles |
| **Token revocation** | Search by `client_id`, `user_id`, or `token_last4`; bulk-revoke | API & Developer Reviewer + Security role |
| **Webhook health** | Subscriptions with strike_count > 0, recent delivery failures, expired subscriptions | API & Developer Reviewer role |
| **Suspension queue** | Apps auto-suspended by abuse detection; review + reinstate or confirm | API & Developer Reviewer + two-admin approval (§ 9.1 from 0023 — vendor force-delist parity) |

### 9.2 Two-admin approval scope (extends 0023 § 9.1)

Adds to the two-admin approval list:
- **Approve an app requesting `read:messages` scope** — chat data is heavily protected; second admin required
- **Approve an app requesting `delete:*` scope** — destructive scope; second admin required
- **Confirm a suspended-app reinstatement** — preventing single-admin reinstatement of an abusive app

Routine work stays single-admin (the rest of the app queue, volume dashboard reads, webhook health inspection).

---

## 10. Composition with Cloudflare Workers + Supabase Edge Functions

### 10.1 Request flow

```
Client request
    ↓
Cloudflare Worker (gateway)
    1. TLS termination
    2. Parse Authorization header (Bearer token)
    3. SHA-256(token) → lookup in Workers KV (60s cache) → api_tokens
    4. Check token: not revoked, not expired
    5. Resolve scopes from api_tokens.scopes
    6. Check rate limit counters (KV sliding window)
    7. Route by path version: /v1/* → v1 functions
    8. Stamp request context: X-Setnayan-User-Id, X-Setnayan-Scopes,
       X-Setnayan-App-Id, X-Setnayan-Request-Id
    9. Forward to Edge Function
    ↓
Supabase Edge Function (business logic)
    10. Trust gateway-provided context
    11. Check declared scopes against scopes provided
    12. Execute business logic against Postgres
    13. Return response
    ↓
Cloudflare Worker (gateway)
    14. Stamp response headers: X-Setnayan-Api-Version,
        X-RateLimit-*, X-Request-Id
    15. Write api_request_log row (async, fire-and-forget)
    16. Return to client
```

### 10.2 Webhook delivery flow

```
Business event fires (e.g., booking.confirmed)
    ↓
Edge Function publishes to "outbound_webhooks" queue (Cloudflare Queue)
    ↓
Queue worker (Cloudflare Worker on Cron Trigger every 30 sec)
    1. Pull due deliveries (webhook_deliveries.next_attempt_at <= NOW())
    2. For each: lookup subscription, HMAC-sign payload, POST to delivery_url
    3. On 2xx: mark delivered_at, status='delivered'
    4. On non-2xx or timeout (10s): increment attempt_count, set next_attempt_at
       per retry schedule (5m, 30m, 2h, 8h, 24h), status='queued'
    5. After 5 failed attempts: status='expired', increment subscription.strike_count
    6. If strike_count >= 3: deactivate subscription, email owner
```

### 10.3 Why this split

- Cloudflare Workers run on edge POPs in PH (Manila + Cebu PoPs) — auth + rate limit decisions happen within ~5ms of the user
- Supabase Edge Functions run in Singapore (closest Supabase region) — business logic + database access in ~30ms
- Total round-trip stays under 100ms p95 for Manila/Cebu/Davao clients
- The gateway can be moved off Cloudflare without touching Edge Functions; the Edge Functions can be moved off Supabase without touching the gateway

---

## 11. Security posture

### 11.1 Token hashing

- Tokens generated as 256-bit cryptographically random strings via `crypto.randomBytes(32)`
- Stored as SHA-256 hash; cleartext never written to disk or logs
- Token last 4 chars stored cleartext only for UI display ("which token did I revoke?")

### 11.2 OAuth PKCE

- Authorization Code flow requires `code_challenge` (S256) on `/oauth/authorize` and `code_verifier` on `/oauth/token`
- Authorization codes are single-use, 60-second lifetime, bound to the exact `code_challenge`
- Refresh tokens rotate on every use; the old refresh token is invalidated immediately

### 11.3 HMAC webhook signing

- Each subscription has a unique HMAC secret (256-bit), shared with the subscriber at subscription creation (once)
- Every delivery POST carries `X-Setnayan-Signature: sha256=<hex>` over the raw body
- Subscribers verify by computing `HMAC-SHA256(received_body, their_copy_of_secret)` and comparing
- Subscribers MUST reject mismatched signatures with non-2xx — the gateway treats those as failed deliveries

### 11.4 Secrets rotation

- `client_secret` rotation: app owner triggers from dev portal; old secret invalidates immediately; all active tokens revoked; app must re-OAuth all users
- HMAC secret rotation: app owner triggers from dev portal; supports 24-hour overlap window where both old and new HMAC are accepted, then old is purged
- Internal Cloudflare Worker signing keys: rotated quarterly; supports 24-hour overlap

### 11.5 Scope validation

- The Edge Function declares required scopes in its handler metadata
- The gateway forwards `X-Setnayan-Scopes` header with the token's granted scopes
- The Edge Function's wrapper validates `required_scopes ⊆ granted_scopes` BEFORE running business logic
- If insufficient, returns 403 with `WWW-Authenticate: Bearer error="insufficient_scope", scope="read:events"`

### 11.6 Audit logging

- Every `read:messages` access logged separately to `api_audit_messages_access` (admin-visible, never user-deletable)
- Every admin action in the admin console (app approval, suspension, token revocation) logged to existing admin audit log from 0023
- `api_request_log` rows kept for 90 days, then aggregated to daily summary rows and purged

### 11.7 RA 10173 alignment

- Users can list and revoke all OAuth grants from their account settings (Profile Settings → Authorized Apps, extends 0025)
- Token revocation cascades: revoking a grant revokes all tokens issued under it
- Account deletion (soft + hard, from 0025) cascades to revoke all OAuth authorizations + tokens

---

## 12. Acceptance tests

| # | Test | Pass criteria |
|---|---|---|
| 1 | Register a new OAuth app | App created, `client_id` displayed, `client_secret` shown once, app enters `pending_review` |
| 2 | OAuth authorization code flow with PKCE | User authorizes → code issued → exchanged for token with PKCE verifier → access token + refresh token returned |
| 3 | OAuth flow without PKCE | Request rejected with `error=invalid_request, error_description="code_challenge required"` |
| 4 | Access protected endpoint without token | 401 with `WWW-Authenticate: Bearer error="invalid_token"` |
| 5 | Access endpoint with insufficient scope | 403 with `WWW-Authenticate: Bearer error="insufficient_scope", scope="read:events"` |
| 6 | Exceed per-token rate limit | 429 with `Retry-After` header, `X-RateLimit-Remaining: 0` |
| 7 | Exceed per-IP DOS ceiling | 429 even with valid token; IP enters cooldown after 3 violations |
| 8 | Refresh token rotation | Old refresh token invalidates immediately, new refresh + access tokens returned |
| 9 | Reuse rotated refresh token | 401, all tokens under the authorization revoked (replay-attack defense) |
| 10 | Token revocation propagates within 60s | Workers KV cache expires, subsequent calls fail with 401 |
| 11 | Webhook delivery succeeds | Subscriber receives POST with valid HMAC signature; delivery marked `delivered` |
| 12 | Webhook delivery retries on 5xx | Subscriber returns 503; delivery retried at 5m, 30m, 2h, 8h, 24h; marked `expired` after 5 failures |
| 13 | Webhook subscription auto-disables after 3 strikes | Subscription `is_active = FALSE`, owner email sent |
| 14 | OpenAPI bundle excludes internal endpoints | `GET api.setnayan.com/v1/openapi.json` returns spec with no `x-internal: true` paths |
| 15 | Sandbox token cannot access production data | Token bound to `sandbox=true` returns 403 on any non-sandbox path |
| 16 | App auto-suspends on 5xx > 50% over 1h | Suspension triggers, app returns 503, owner emailed |
| 17 | User revokes app from profile settings | All authorizations + tokens for that app revoked within 60s |
| 18 | Account deletion cascades to OAuth | All grants + tokens for the deleted user revoked |

---

## 13. Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-05-12 | **Build the foundation in V1; flip endpoints in V1.5.** | Owner direction. Retro-fitting auth + rate limits + versioning into a shipped backend is the most expensive refactor pattern in API design. Setting it up now costs ~2 sprints; retrofitting later costs ~10+. |
| 2026-05-12 | **Cloudflare Workers gateway + Supabase Edge Functions backend.** | Workers run at the PH edge (~5ms auth decisions for Manila/Cebu/Davao); Edge Functions in Singapore handle business logic (~30ms DB roundtrip). Total p95 < 100ms. Matches the platform stack from 0013 — no new vendors. |
| 2026-05-12 | **Opaque tokens, not JWTs.** | Instant revocation is non-negotiable for a public API where credentials may leak. JWTs sound clean until you need to invalidate one before its expiry; opaque-token-with-lookup gives that for free. Lookup cost is one Workers-KV-cached DB read per request — negligible. |
| 2026-05-12 | **OAuth2 Authorization Code with PKCE only.** | Implicit deprecated by IETF; ROPC is a security smell; Client Credentials has no V1 use case. PKCE supports SPAs, mobile apps, and traditional server apps from one flow. |
| 2026-05-12 | **Path-based major versions, header-based minor versions.** | Major bumps are rare and require a hard cut (12-month deprecation overlap). Additive changes ship continuously without forcing clients to re-bind paths. Matches GitHub, Stripe, Google's API versioning conventions. |
| 2026-05-12 | **Free tier 100 req/min; Pro / Enterprise schema-ready but unpriced in V1.** | V1 ships zero public endpoints, so tier pricing is a V1.5 decision. The schema slot is there so V1.5 is a price-table change, not a migration. |
| 2026-05-12 | **At-least-once webhook delivery with HMAC signing.** | Industry standard (Stripe, GitHub, Shopify all do this). Subscribers MUST implement idempotency keys; we provide `X-Setnayan-Delivery-Id` so they can. Exactly-once delivery is impossible to guarantee over arbitrary subscriber endpoints. |
| 2026-05-12 | **5-attempt retry schedule (5m / 30m / 2h / 8h / 24h).** | Covers transient subscriber outages up to ~1.5 days; balances retry burden against subscriber survivability. Stripe's pattern (3 days) is more forgiving; Setnayan's is tighter to keep webhook_deliveries table size bounded. |
| 2026-05-12 | **Internal callbacks (Resend, Daily.co, GCash) routed through the same gateway in V1.** | Stress-tests the gateway in production from day one. If the auth + rate limit + logging path can't handle internal callbacks, it can't handle public traffic. Bonus: webhook-from-third-party arrives at the same machinery as webhook-to-third-party will. |
| 2026-05-12 | **Sandbox environment from V1 launch, even though no public endpoints exist.** | Lets early developer-portal users build and test against synthetic data while V1 is live. When V1.5 flips Phase A endpoints on, those developers are ready to ship integrations on day one. |
| 2026-05-12 | **`read:messages` scope requires two-admin approval at app review time.** | Chat data is among the most sensitive in the platform (privacy of customer↔vendor↔coordinator conversations). Two-admin approval is the same gate from 0023 § 9.1 we apply to other high-stakes decisions. |
| 2026-05-12 | **No B2B `client_credentials` flow in V1.** | No identified use case. The temptation is to ship it for "server-to-server integrations" but Setnayan doesn't have a clear B2B integration story yet. Adding it later is trivial; removing it later is operationally messy if anyone depends on it. |
| 2026-05-12 | **OpenAPI 3.1 schema auto-generated from TypeScript types.** | Manual OpenAPI maintenance drifts within weeks. Generating from source-of-truth types (the Edge Function definitions) ensures docs and reality stay aligned. Tooling support (Postman, Insomnia, OpenAPI Generator) gives third-party developers production-ready clients for free. |
| 2026-05-12 | **Phase D (third-party booking flow) probably never ships.** | Booking flow involves payment, real-time vendor calendar coordination, and is the highest-leverage interaction on the platform. Off-loading it to third parties is strategically dangerous. Documented here as the line we currently don't cross — revisit only with explicit owner sign-off. |

---

## 14. Companion docs

- `0000_app_shell_and_navigation/` — `users.account_type`, role-router; this iteration extends with `users.is_developer`
- `0013_platform_stack_and_sync/` — Cloudflare + Supabase + R2 stack; the gateway and Edge Functions sit on this stack
- `0019_communications/` — webhook delivery pattern reference; chat scope (`read:messages`) protects this surface
- `0023_admin_console/` — admin console foundation; extended with the API & Developer Portal surface (§ 9)
- `0025_profile_settings/` — "Authorized Apps" tab added under Privacy & Data for user-side OAuth grant management
- `0028_email_notifications/` — webhook-callback infrastructure (Resend) routed through this iteration's gateway in V1
- `Setnayan_Privacy_and_Security_Policy.md` — RA 10173 alignment for OAuth grants + audit logs + account deletion cascades
