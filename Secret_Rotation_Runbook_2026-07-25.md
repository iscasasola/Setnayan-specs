# Secret Rotation Runbook — 2026-07-25

> Written during the planned rotate-everything session (day before market intro). This is the
> owner-facing companion to the new **/admin/secrets "Secrets & Rotation" board** — the board
> carries the same instructions inline, with alarms; this doc is the archive copy + the record
> of what was rotated today vs. what still needs the owner's dashboards.

## What Claude rotated today (done, no action needed)

All self-generated random values — nothing external holds copies (verified: no DB webhooks,
no secrets embedded in pg_cron, `app.cron_secret` DB setting was never set):

| Secret | Where | Notes |
|---|---|---|
| `CRON_SECRET` | Vercel prod + preview | Manual curl triggers of sweep routes. New value takes effect on next deploy. |
| `OAUTH_REFRESH_CRON_SECRET` | Vercel prod + preview | Same class. |
| `INTERNAL_WORKER_SECRET` | Vercel prod + preview | Patiktok worker stub + telemetry auto-resolve. |
| `GUEST_CLAIM_OTP_SECRET` | Vercel prod + dev | Invalidates only in-flight OTP codes (minutes). ⚠ Zero code references this var today — kept + rotated anyway; the board row carries the note. |
| `SUPABASE_WEBHOOK_SECRET` | Vercel prod | **DELETED** — dead var; no code reads it (code wants `NOTIFY_WEBHOOK_SECRET`, which is unset → /api/notify is fail-closed/dormant). |

`ENCRYPTION_KEY` — rotated to a fresh key (staged 2026-07-25 11:16, active on the next deploy).
The dual-key bridge (`ENCRYPTION_KEY_PREVIOUS`) could NOT be used this one time: the old value
is a Vercel "sensitive" var — write-only, unrecoverable by design — so nothing could seed the
previous-key slot. Blast radius was exactly ONE stored ciphertext (the Resend key in the
integrations console); email keeps working via the `RESEND_API_KEY` env fallback, and the stale
ciphertext is cleared so the console honestly shows "not configured" until a fresh Resend key is
pasted (which the owner does anyway in step 5 below). **All FUTURE rotations use the dual-key
procedure on the board's ENCRYPTION_KEY card** — save the outgoing key into
`ENCRYPTION_KEY_PREVIOUS` first, redeploy, run the re-encrypt sweep to `failed = 0`, then delete
the previous key. Never naive-swap: with more stored tokens (vendor IG, photo-delivery OAuth)
that silently destroys them.

### Deliberately NOT rotated (rotate only on compromise — see board)

- `DEVICE_HASH_SALT` — not a credential; rotating resets device-fingerprint continuity
  (trial-abuse clustering starts over).
- VAPID web-push key pair — rotating invalidates every existing push subscription.
- Apple/Android signing secrets (GitHub) — new certs change the signing identity.

## What only the owner can rotate (provider dashboards)

Work through these top-to-bottom; each is ~2–5 minutes. After each: the board row's
"Mark rotated" (or the paste-box save) stamps the date so the alarm clock resets.

1. **Supabase service-role + anon keys** — dashboard → Project Settings → API keys.
   Paste the new service-role into the board (it writes Vercel for you) → Redeploy →
   check `/api/health/deep` stays `ok:true`. Anon key also goes to `apps/web/.env.local`.
2. **Supabase database password** — dashboard → Database → reset. Then update GitHub Actions
   secrets `SUPABASE_DB_PASSWORD` + `SUPABASE_DB_URL` (URL embeds the password), then run the
   `supabase-migrations` workflow once to confirm.
3. **Supabase personal access token** (CI) — account → Access Tokens → new token → update
   GitHub secret `SUPABASE_ACCESS_TOKEN` → revoke old.
4. **Cloudflare R2 key pair** — R2 → Manage API Tokens → create NEW token (Object R/W on the
   4 buckets) → paste both halves into the board → Redeploy → `/api/health/deep` → delete old
   token. Create-then-delete, never edit-in-place, so there's no gap.
5. **Resend API key** — resend.com/api-keys → new key → paste on /admin/integrations (Resend
   card; instant, no redeploy) → click Verify → delete old key.
6. **OpenAI key** — platform.openai.com → new key → paste on /admin/integrations.
7. **Vercel API token** — vercel.com/account/settings/tokens → create NEW token FIRST →
   paste into the board → Redeploy → update the GitHub Actions copy → delete old token.
   (Order matters: the board authenticates with the old token while saving the new one.)
8. **Recraft key** — new key → board paste → also update the local copy in
   `~/.claude/settings.json` on this Mac.
9. **Sentry auth token, PostHog key, Cloudflare TURN pair, Meta Page token, IG app secret,
   Google OAuth client secrets (sign-in / Drive / YouTube), TikTok** — per the board rows;
   several are dormant/env-dark, so they're hygiene rather than urgent.

## Standing policy (encoded in the board)

- Provider keys: 90-day default clock (Meta 60d; OAuth client secrets + dormant integrations 180d).
- Self-generated internals: 90d, one-click regenerate from the board.
- `ENCRYPTION_KEY`, `DEVICE_HASH_SALT`, VAPID, signing: **manual — rotate only on compromise**,
  each with its special procedure on the board.
- The board's alarm banner (and the row chips) is the single place to check; it computes age
  from the Vercel API's own env-var timestamps plus the `platform_secret_rotations` table.

## Verification results (2026-07-25, post-deploy v445bf7c)

- `/api/health/deep` → `ok:true` (Supabase 184ms · R2 320ms · 8 core env vars) on the rotated environment.
- CRON_SECRET end-to-end: wrong secret → **401**, Vault secret → **200** against `/api/admin/cron/dispute-counter`. Proves the new value is live in prod AND the Vault copy matches.
- ⚠ Discovered: the 2307 job's target route `/api/admin/cron/generate-2307` was **never built** (404) — iteration 0026 shipped schema + cron job only. Auth is now fixed; the route is a separate task (chip spawned).
- Rotation stamps seeded in `platform_secret_rotations` for the 5 rotated ids; stale Resend ciphertext cleared (console shows "not configured" until a fresh key is pasted).
