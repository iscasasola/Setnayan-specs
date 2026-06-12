# Pre-pilot checklist · 2026-06-01 launch

**Authored:** 2026-05-28 (4 days to pilot)
**Scope:** Bucket A observability stack — keeping all 4 items connected end-to-end.

This doc is the single sheet to run through before 2026-06-01. Each step depends on the previous one. Work the list top-to-bottom · check each box · ping me if any step fails.

---

## Connection map (why these 4 items hang together)

```
┌──────────────────────────────────────────────────────────────────┐
│  Step 1 · Vercel env vars                                        │
│  ↓                                                                │
│  Step 2 · Sentry smoke test ─────────► /admin/settings button     │
│  ↓                                                                │
│  Step 3 · Health endpoints curl-test ──► /api/health + /deep      │
│  ↓                                                                │
│  Step 4 · Better Stack monitors ───────► poll both endpoints      │
└──────────────────────────────────────────────────────────────────┘
```

If env vars are missing (Step 1) → Sentry can't capture (Step 2 fails) → health endpoints return 503 (Step 3 fails) → Better Stack alerts fire (Step 4 noisy). Each step verifies the one above is wired correctly.

---

## Step 1 · Vercel env vars (Today/tomorrow · ~10 min)

Open https://vercel.com/iscasasolas-projects/setnayan/settings/environment-variables and verify each row exists in **Production** scope.

### 🔴 Pilot-blocking (8 — must be set or app breaks)

- [ ] `NEXT_PUBLIC_SUPABASE_URL` — middleware crashes on boot without it
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — middleware crashes on boot without it
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — admin client throws, every API route returns 500
- [ ] `R2_ACCOUNT_ID` — media uploads return 503
- [ ] `R2_ACCESS_KEY_ID` — media uploads return 503
- [ ] `R2_SECRET_ACCESS_KEY` — media uploads return 503
- [ ] `ENCRYPTION_KEY` — Photo Delivery decrypt fails (AES-256-GCM key · base64 32 bytes)
- [ ] `RESEND_API_KEY` — transactional emails silent no-op (pilot couples don't get RSVP/invite emails)

### 🟡 Feature-blocking (3 cron secrets — set them all)

If you generated these on 2026-05-22 already, verify they're still set. If not, **generate fresh** via `openssl rand -base64 32` × 3 and paste into Vercel:

- [ ] `CRON_SECRET` — BIR Form 2307 quarterly job + dispute reconciliation skip without it
- [ ] `OAUTH_REFRESH_CRON_SECRET` — YouTube + Google Drive token refresh skip · OAuth feeds stop after ~1h
- [ ] `INTERNAL_WORKER_SECRET` — Patiktok render worker returns 401

### 🟢 Observability (4 — should be set or Sentry/PostHog/Better Stack silent)

- [ ] `SENTRY_DSN` — server-side error capture (gate for Step 2 below)
- [ ] `NEXT_PUBLIC_SENTRY_DSN` — client-side error capture (gate for Step 2 below)
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` — product analytics
- [ ] `NEXT_PUBLIC_POSTHOG_HOST` — PostHog endpoint URL

### 🟢 OAuth (optional · gracefully degrade · skip if you haven't done the Google Cloud submission yet)

- [ ] `YOUTUBE_OAUTH_CLIENT_ID` / `_SECRET` / `_REDIRECT_URI` — Panood booking flow
- [ ] `GOOGLE_DRIVE_OAUTH_CLIENT_ID` / `_SECRET` / `_REDIRECT_URI` — Photo Delivery
- [ ] `TIKTOK_CLIENT_KEY` / `_SECRET` / `_OAUTH_REDIRECT_URI` — Patiktok personal-tier

**Done with Step 1 when:** Vercel dashboard shows green checkmarks against all 🔴 rows + the 3 cron secrets. If you redeploy after adding any env var, trigger a fresh production deploy (Settings → Deployments → ⋯ → Redeploy without build cache).

---

## Step 2 · Sentry smoke test (after Step 1 · ~3 min)

1. Sign in to https://www.setnayan.com as an admin user
2. Navigate to `/admin/settings`
3. Find the "Fire Sentry smoke test (admin only)" button (shipped via PR #280)
4. Click it · UI surfaces a trace ID + 3-step checklist
5. Open https://sentry.io/organizations/setnayan/issues/ in a new tab
6. Search by the trace ID
7. **Expected:** the test error appears within 60s with the controlled message "Sentry smoke test (admin-triggered)"
8. **Bonus:** verify alert email lands at `iscasasolaii@gmail.com` within 60s (confirms alert routing is wired)

**Done with Step 2 when:** the test event is visible in Sentry dashboard AND alert email arrived. If it didn't fire, re-check `SENTRY_DSN` + `NEXT_PUBLIC_SENTRY_DSN` env vars from Step 1.

---

## Step 3 · Health endpoints curl test (after Step 2 · ~2 min)

Open a terminal and run these 3 commands. All should return HTTP 200.

```bash
# Shallow probe — must always be 200 + sub-second
curl -sw "\n[HTTP %{http_code} · %{time_total}s]\n" https://www.setnayan.com/api/health

# Deep probe — first call may be 1-2s (cold start), subsequent calls 250-900ms
# After PR #565 ships, timeout is bumped to 3000ms so cold starts no longer flake
for i in 1 2 3; do curl -sw "\n[HTTP %{http_code} · %{time_total}s]\n" https://www.setnayan.com/api/health/deep; sleep 1; done

# HEAD-only check (what Better Stack will use — cheapest)
curl -sIw "[HTTP %{http_code} · %{time_total}s]\n" https://www.setnayan.com/api/health/deep
```

**Expected results:**

- `/api/health` → HTTP 200 · `{"ok":true,"ts":"...","region":"iad1","version":"...","env":"production"}` · under 1s
- `/api/health/deep` × 3 calls → all HTTP 200 · `"ok":true` · `"failing":[]` · the 3 sub-checks (supabase + r2 + env) all `"ok":true`

**Done with Step 3 when:** 3 of 3 deep calls return HTTP 200. If any call still returns 503 after PR #565 is live, ping me — could mean Supabase pgbouncer is bouncing or service-role key is wrong.

---

## Step 4 · Better Stack monitors (Sat 2026-05-31 · ~10 min)

Sign up at https://betterstack.com/uptime (free tier covers pilot · 10 monitors free).

Create **2 monitors** per the lock from the eighth 2026-05-28 row tenth 2026-05-28 row § (Bucket A):

### Monitor 1 · Shallow heartbeat (60s · keeps Vercel lambda warm)

- **URL:** `https://www.setnayan.com/api/health`
- **HTTP method:** HEAD
- **Region:** Singapore (closest to PH user base)
- **Interval:** 60 seconds
- **Timeout:** 3 seconds
- **Expected status:** 200
- **Alert routing:** Email `iscasasolaii@gmail.com` (Telegram + SMS too if Better Stack tier supports)
- **Why:** the 60s heartbeat acts as a warm-up · keeps the Vercel function alive · indirectly benefits the deep endpoint too

### Monitor 2 · Deep dependency probe (5min · validates Supabase + R2 + env)

- **URL:** `https://www.setnayan.com/api/health/deep`
- **HTTP method:** HEAD
- **Region:** Singapore
- **Interval:** 300 seconds (5 minutes)
- **Timeout:** 5 seconds (matches Vercel `maxDuration`)
- **Expected status:** 200
- **Alert routing:** Email `iscasasolaii@gmail.com` (paging tier if available)
- **Why:** catches downstream dep failures (Supabase outage · R2 bucket issue · env var drift)

### Optional · Vercel log drain

In Vercel dashboard → Settings → Monitoring → Log Drains → Add Better Stack source token. This pushes Vercel function logs to Better Stack for incident debugging.

- **`BETTER_STACK_SOURCE_TOKEN`** env var (per `.env.example` line 60) is defined as a placeholder but no code consumes it directly — the Vercel-side log drain integration handles the push automatically once the token is configured in Vercel dashboard.

**Done with Step 4 when:** both monitors show green status in Better Stack dashboard within ~5 min of creation.

---

## Step 5 · Final sanity (Sun 2026-05-31 morning · before sending pilot invites · ~10 min)

Walk the golden user path as a test couple to confirm nothing's regressed:

- [ ] Sign up as a test couple (or sign in if you already have an account)
- [ ] Create a test event (Wedding · pick a date · pick a venue setting)
- [ ] Add 5 test guests (mix of confirmed + pending RSVP)
- [ ] Open `/dashboard/[eventId]/website` · verify slug page works
- [ ] Open `/vendors` · browse marketplace · verify vendor cards render with photos
- [ ] Click into one vendor · verify the profile page works
- [ ] Test inquiry flow (don't actually book · just verify the form submits)
- [ ] Open `/dashboard/[eventId]` · verify Setnayan AI wizard renders (CONCIERGE_ENABLED flag state may hide it depending on V2.1 lock state · expected per pilot scope)

**Done with Step 5 when:** all 8 steps pass without error · the Sentry dashboard shows ZERO new errors during your test run (otherwise pilot couples will hit them too).

---

## Pilot launch day · 2026-06-01

Once Steps 1-5 are green:

1. **Owner morning routine** (5-10 min): re-run the curl tests from Step 3 · verify Better Stack dashboard is green · check Sentry for overnight surprises
2. **Send pilot cohort signup links** to family/friends (5-20 people per [[project_setnayan_pilot_timeline]])
3. **Be reachable** for support during launch weekend (Messenger/WhatsApp group recommended · per [[reference_setnayan_owner_email]] DPO mailbox deferred pre-Dec-1)
4. **Monitor Sentry + Better Stack** for 24h post-launch · 80%+ of launch issues surface within first 6 hours

---

## What's NOT on this checklist (intentionally deferred)

These are flagged in CLAUDE.md tenth 2026-05-28 row § 14 + ninth 2026-05-28 row open items · don't block pilot · need answers before Phase L cutover ~2026-06-15:

- Pro/Enterprise token allowance (lean 25/mo Pro · 100/mo Enterprise)
- UI Theme Setnayan Default palette (v2.1 burnt sienna vs 2026-05-15 burgundy)
- Pricing violation policy ladder (v2.1 § 13.1)
- Content team attendance default (v2.1 § 13.2)
- On-site verification + content package pricing floor (v2.1 § 13.4)
- BIR partner for Productions services (v2.1 § 13.5)
- 192-category taxonomy canonical CSV (v2.1 § 13.6)
- iOS / Android timeline (v2.1 § 13.8)
- NPC registration PIC-2026-0042 confirmation (v2.1 § 13.9)
- DTI / BIR Form 2303 / Mayor's Permit chain (deferred pre-Dec-1 per pilot strategy)
- `dpo@setnayan.com` mailbox routing (deferred pre-Dec-1)
- YouTube verified-app Phase 2 submission · TikTok Business Verification · Camera SDK programs

---

## Connection summary

After running Steps 1-5, you have:

✅ All env vars set in Vercel → app boots cleanly + features work
✅ Sentry capturing errors → blind debugging eliminated
✅ Health endpoints robust (PR #565 ships cold-start fix) → no false-positive alerts
✅ Better Stack monitoring both endpoints from Singapore → 60s heartbeat keeps lambda warm + 5min deep probe validates deps + alerts route to `iscasasolaii@gmail.com`

The 4 items stay **connected** because each layer validates the one beneath: env vars feed Sentry feeds health endpoints feed Better Stack. If any layer regresses, the next one above will alert before pilot couples notice.

---

## Cross-references

- [CLAUDE.md tenth 2026-05-28 row](../CLAUDE.md) — v2.1 brief canonical lock
- [CLAUDE-CODE-BRIEF-v2.1_2026-05-28.md](../CLAUDE-CODE-BRIEF-v2.1_2026-05-28.md) — canonical product spec
- [V2_Cutover_Plan_2026-05-28.md](V2_Cutover_Plan_2026-05-28.md) — post-pilot Phase L plan
- PR #565 — deep-health cold-start fix (this audit's deliverable)
- iteration [0035 Observability](../0035_observability/0035_observability.md) — full observability spec
- [[reference_setnayan_owner_email]] — `iscasasolaii@gmail.com` for all alert routing
- [[project_setnayan_pilot_timeline]] — pilot strategy + Dec 18 wedding gate
