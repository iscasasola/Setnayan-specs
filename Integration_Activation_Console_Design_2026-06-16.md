# Integration Activation Console — Design & Build Plan

**Date:** 2026-06-16 · **Status:** ✅ **PR1 + PR2 SHIPPED 2026-06-22.** PR1 = email (Resend) + AI-paywall slices (migrations `20270129275192` + `20270209911535`). PR2 = generalized **data-driven secret registry** (`lib/integrations/registry.ts`) + **OpenAI moderation** (migration `20270210283954`) — PR #2001. All DB-first/no-redeploy, live on `/admin/integrations`; migrations applied to prod. ✅ **CONSOLE COMPLETE 2026-06-22 (PR1→PR4d, all auto-merged):** PR3 #2011 OAuth trio · PR3b #2013 OAuth cards · PR4a #2022 Meta/IG (LIVE) · PR4b #2029 TikTok token · PR4c #2035 Maya (2-secret card) · PR4d #2040 read-only "Build-time & env-only" section. **R2_PUBLIC_URL + VAPID deliberately NOT made DB-first** (build-time-coupled — next/image remotePatterns / paired client-inlined key; shown read-only instead). **⚠ ledger reconcile owed:** PR4a/b/c migrations applied via pg-direct (db push was parallel-session-drift-blocked) — columns live, ledger rows pending a clean `db push`/`migration repair`. **Still queued (design's LATER phases, optional):** per-integration Test-connection + `/api/health/deep` checkEnv; `NEXT_PUBLIC_*`→server-resolved props; cleanups (generate-random-secret button, close GUEST_*_SECRET service-role fallback, encrypt plaintext oauth_grants tokens). **Recraft dropped** (offline-script-only — `server-only` would break the tsx script; no runtime-web read). · **Owner decision:** keys-in-DB approach accepted; security-posture trade signed off. ⚠ **Build deviation (owner sign-off pending):** the AI-paywall resolver shipped **DB-first/env-fallback (tri-state)**, NOT the "OR-wins" in the PR1 plan below — OR-wins can never turn the paywall OFF once env=true. See DECISION_LOG 2026-06-22.

Produced by a 17-agent research workflow (6 codebase+web investigators → 5 candidate approaches designed → each adversarially vetted → synthesis). This doc is the decision-ready output; a future session can build straight from it.

---

## Problem

Every external integration is gated on **Vercel environment variables**, so turning a shipped-but-dormant feature ON requires: an external account, sometimes DNS, a manual paste into Vercel, and a **redeploy** — with no in-app way to verify it worked. Examples: email (`RESEND_API_KEY`), the Setnayan-AI paywall flag, Meta/IG/TikTok keys, `R2_PUBLIC_URL`, Recraft, Maya. Features ship "live but dormant"; the owner finds out via a doc. The backlog of these keeps growing.

## Decision (recommended + approved)

**Build an in-app "Integration Activation Console" (`/admin/integrations`) with a three-layer store:**

1. **Non-secret config + on/off flags** → additive columns on the existing `platform_settings` singleton (e.g. `resend_from_address`, `setnayan_ai_paywall_enabled`).
2. **Secrets (API keys/tokens)** → a NEW **deny-by-default** table `platform_integration_secrets`, **AES-256-GCM-encrypted** via the already-shipped `lib/encryption.ts`. **NEVER on `platform_settings`** — that row is world-readable (`FOR SELECT TO anon, authenticated USING(true)`), so a secret there leaks to any logged-out browser via PostgREST.
3. **Bootstrap secrets** (`ENCRYPTION_KEY`, Supabase/R2 creds) → stay in Vercel env (they bootstrap the DB read itself; can't self-reference). The console shows them read-only as present/absent.

Readers resolve **DB-first, env-fallback** (byte-identical when the DB is empty), so config takes effect on the **next request — no redeploy** — and each integration card has a **"Test connection"** round-trip + green/amber/red status.

This generalizes patterns already in the repo: `platform_settings`, `social_publish_settings`, the `getSetnayanFeeBps`/`setnayan_pay_fee_pct` DB-config precedent, the admin smoke-test route, and `lib/encryption.ts`.

## Why it beats the alternatives

| Criterion (1–5) | In-app console (DB-first) ✅ | Vercel Env API + redeploy | Supabase Vault | External secrets mgr |
|---|---|---|---|---|
| Friction removed | **5** | 2 (redeploy only hidden) | 5 | 1 |
| Security | 3 | 2 (adds god-token) | 3 | 2 (two copies) |
| Build cost | 3 | 3 | 2 | 4* |
| Fit w/ existing arch | **5** | 2 | 4 | 1 |
| Scales to all integrations | **5** | 4 | 4 | 3 |
| Owner-operability | **5** | 2 | 4 | 1 |

- **Vercel Env API (rejected as primary):** Vercel bakes env at build time, so a key written via the API stays inert until a 2–4 min redeploy — it only *hides* the redeploy. Also needs `VERCEL_API_TOKEN`, a god-credential that can rewrite all prod env = net security escalation.
- **External secrets manager (rejected):** syncs *into* Vercel env (redeploy survives), doubles the secret blast radius, adds a second account + third dashboard, zero in-app verification. (*low wiring but you'd still have to build the real solution.)
- **Supabase Vault (not now):** net-new encryption subsystem + the `vault.decrypted_secrets` REVOKE footgun for a narrow backup-secrecy benefit, when `lib/encryption.ts` already delivers the wins. Revisit only if the threat model later demands the decrypt key never share the app's env.

## Honest trade-offs (owner signed off)

- **Secrets in DB is a deliberate, small security regression — NOT "safer because encrypted."** Today keys live only in Vercel env (not reachable by the DB, backups, a leaked service-role key, or SQL injection). Moving them to Postgres adds those vectors. AES-256-GCM means a `pg_dump`/anon read yields **ciphertext only** (because `ENCRYPTION_KEY` is off-DB), so net new exposure narrows to full-app-compromise — where an attacker could already read env secrets. Net: ~env-equivalent for backup/SQL-read, slightly worse for full-app-compromise. **Acceptable for a solo pre-launch owner; approved 2026-06-16.**
- **"No redeploy" is true with 3 caveats:** (1) integration reads must stay OFF the `unstable_cache`'d path (`brand-settings.ts` wraps the same row at 1 hr — use the uncached dynamic read or `revalidateTag` on save); (2) `NEXT_PUBLIC_*` flags are inlined into the client bundle at build time → genuinely cannot be live-flipped without the PR4 prop refactor; label them "redeploy required," no fake live toggle; (3) `R2_PUBLIC_URL` runtime reads can move to DB, but `next.config.ts` consumes it at build time for `next/image` `remotePatterns`, so a brand-new public host still needs one redeploy.
- **`ENCRYPTION_KEY` becomes single-point-of-failure** for all stored secrets AND existing `oauth_grants` tokens — confirm present/stable on prod; document never-rotate-casually.
- **`is_admin()` scope mismatch:** the SQL helper checks only `account_type='admin'`, while `platform_settings` write actions check the broader `is_internal || is_team_member || account_type='admin'`. Enforce authz at the **action layer** (as existing writes do), not via an `is_admin()` RLS policy that would lock out team-member admins.

## Phased build plan (keyed to the codebase)

**PR1 — thin vertical slice (email + AI-paywall):** migration adds `platform_integration_secrets` (deny-by-default, `resend_api_key_enc`) + `platform_settings.resend_from_address` + `.setnayan_ai_paywall_enabled` (mirror `setnayan_pay_fee_pct`). New `lib/integration-config.ts` (`resolveResendConfig()` DB-first/env-fallback like `getSetnayanFeeBps`; `resolvePaywall()` OR-wins). Edit `lib/email.ts` (move BOTH key + from-address reads together; `isEmailConfigured()`→async, 2 callers already async), `lib/setnayan-ai.ts` (thread resolved paywall bool as an arg — do NOT make the leaf predicate async), `lib/platform-settings.ts` (type + SELECT + fallback). New `/admin/integrations` page+actions (reuse `requireAdmin()`, admin-client `UPDATE eq('id',1)`, masked `re_••••a3f9` + Replace, never echo the secret). Test button reuses `app/api/admin/smoke-test/route.ts?type=resend`; stamp `last_verified_at`.

**PR2 — generalize:** add `meta_page_access_token_enc`, `tiktok_access_token_enc`, `recraft_api_key_enc`, `maya_secret_api_key_enc`, OAuth client secrets to the secrets table; non-secret config (`r2_public_url`, `META_PAGE_ID`, `IG_USER_ID`, client IDs/redirect URIs, `NEXT_PUBLIC_MAYA_STATUS`) to `platform_settings`. Data-driven `INTEGRATIONS` registry (`key,label,category,kind,column,isConfigured,testFn`) driving resolver + dashboard. Flip read sites (`lib/social/*`, `lib/recraft.ts`, `lib/r2.ts publicUrlFor()`). Console modeled on `/admin/social-queue` AutopilotStrip.

**PR3 — verification + health:** `app/api/admin/integrations/test/route.ts?integration=…` (Meta/IG `GET /me`, TikTok introspection, Recraft ping, R2 `HEAD` — upgrade the `R2_PUBLIC_URL`=S3-endpoint footgun from a stderr warn to a dashboard red banner). Extend `/api/health/deep` `checkEnv()` (currently omits RESEND/social/R2_PUBLIC_URL) so "deep healthy" means "integrations live" + Better Stack catches breakage. Probes tolerant: 401→red, 5xx/network→amber.

**PR4 (deferrable) — `NEXT_PUBLIC_*` → server-resolved props:** stop reading `process.env.NEXT_PUBLIC_*` client-side for ~6 UI flags (oauth-button-row, offline-daemon-mount, camera-bridge, std-reveal, vendor-addons); pass server-resolved booleans as props. The one genuine code-shape change; pure feature flags, safe to defer for V1.

**Cheap cleanups to fold in:** a "generate-and-store random secret" button for the 8 HMAC/random secrets; close the `GUEST_SESSION_SECRET`/`GUEST_CLAIM_OTP_SECRET`→service-role fallback; encrypt the plaintext `oauth_grants` tokens. Confirm `BUILD_3STATE_ENABLED` is retired on origin/main (#1568) before the registry lists it.

## What stays irreducibly manual (and how it's minimized)

- **External account creation** (Resend/Meta/Recraft/Maya/Google) — unavoidable.
- **Resend DNS** — irreducible; minimized by authenticating a *subdomain* (`send.setnayan.com`), showing the exact records with copy buttons + a Re-check button. Fuller win (defer): wire the Resend Domains API to poll `status=verified` and auto-light the card.
- **Google OAuth redirect URIs + Supabase provider config** — encode as guided in-app steps per card.
- **`ENCRYPTION_KEY` + Supabase/R2 bootstrap creds** — stay env-only; shown read-only as present/absent. The only secrets the owner ever pastes into Vercel.

## Do NOT

- Put ANY secret on `platform_settings` (world-readable). Secrets → the deny-by-default table only.
- Use the Vercel Env API as the primary mechanism (can't escape redeploy; god-token).
- Adopt an external secrets manager as the activation answer, or Supabase Vault as the default store.
- Make `isSetnayanAiActive()` async or route integration reads through `unstable_cache`.
- Sell the DB move as a security upgrade; ship a fake live toggle for build-time `NEXT_PUBLIC_*`/`next/image` `R2_PUBLIC_URL`; or rotate `ENCRYPTION_KEY` casually.

## Open sign-offs at build time

(1) ✅ secrets-in-DB posture trade — approved. (2) confirm `ENCRYPTION_KEY` present/stable on prod + never-rotate-casually. (3) reconcile `is_admin()` vs action-layer admin check before any RLS relies on `is_admin()`. (4) accept that `NEXT_PUBLIC_*` + `next/image` `R2_PUBLIC_URL` stay redeploy-gated until PR4.
