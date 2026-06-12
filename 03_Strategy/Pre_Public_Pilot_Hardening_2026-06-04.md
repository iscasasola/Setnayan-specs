# Pre-public-pilot hardening · 2026-06-04

**Authored:** 2026-06-04
**Scope:** The steps that must clear **before we announce public piloting** — i.e. before the site is open to anyone (and therefore to competitors and attackers). This is a distinct, later gate from the closed 2026-06-01 family/friends pilot. Two gates live in this sheet:
- **Part A · Copy-resistance & IP** — can someone read our strategic filtering and clone Setnayan?
- **Part B · Data protection** — are customer + vendor data safe from hackers?
**Trigger:** Two owner questions, 2026-06-04 — *"can AI / other programmers just clone our strategic filtering?"* and *"keep customer + vendor data protected from hackers."*

> **Does NOT gate the closed pilot.** The 5–20 family/friends cohort is a trusted, non-discoverable group. Nothing below blocks them. These gate the **public** announcement, when the site is exposed to the open web.

---

# Part A · Copy-resistance & IP

## The one-paragraph framing (read first)

Code secrecy is **not** what protects Setnayan, and chasing it is the wrong instinct. The UI, copy, and layout of *any* website are visible to anyone with DevTools — that can never be hidden, on any site, ever. What actually defends us is the **vendor network**, the **accumulated data** (reviews, demand signals, refinements), the **brand**, the **flywheel**, and our **execution speed**. The items below do three honest things: keep the genuinely-hideable part — our matching engine — hidden, close the one real reverse-engineering vector (mass-scraping our public surfaces), and add legal backstops. They raise the cost of copying; they do not make us un-copyable. Keep the energy on the moat.

## Verified baseline · already protected ✅ (confirmed 2026-06-04)

Audited on the `refactor-audit-main` worktree:

- **The matching/scoring engine runs server-side.** `apps/web/lib/wizard-recommendations.ts` executes as a Supabase query against `vendor_market_stats` (sort chain `ad_rank → review_count → avg_rating_overall → recency`, plus region/ceremony/venue overlap filters). The browser never receives this code.
- **Client components get results, not the recipe.** The client card (`apps/web/app/dashboard/[eventId]/_components/wizard-cards/vendor-pick-grid-card.tsx`, `'use client'`) imports `import type { WizardVendorRec }` — a TypeScript type, **erased at compile time** — and receives the already-ranked list as props.

→ A competitor inspecting setnayan.com sees the *output* (a sorted vendor list), never the *algorithm*. Correct architecture, already in place. The work below keeps it that way and hardens the edges.

## Step A1 · Keep all matching/scoring server-side (Engineering · verify + lock)

- [ ] Confirm zero **value** imports (vs `import type`) of `wizard-recommendations.ts` or any matching/scoring lib inside `'use client'` components.
- [ ] Add a standing guardrail (CI grep or code-review rule) that fails if a matching/scoring lib is value-imported into a client component.

**Done when:** a repeatable check confirms scoring libs are server-only; the rule is documented so a future session can't regress it silently.

## Step A2 · Keep the public vendors API ranking-free (Engineering · verify)

**Good news, confirmed 2026-06-04:** `GET /api/v1/vendors` orders by `created_at DESC` — **not** by the `ad_rank/review/rating` chain — and column-masks contact fields. The strategic ordering is not exposed through the public API today.

- [ ] Lock it in: the public vendors API (and any future public read endpoint) must never sort by the matching/ranking chain. Ranked results stay behind an authenticated session.

**Done when:** route audit confirms no anonymous endpoint returns results ordered by the scoring chain; a comment/rule pins the constraint on `app/api/v1/vendors/route.ts`.

## Step A3 · Rate-limit + bot-protect public surfaces (Engineering · the real scraping vector)

The one genuine reverse-engineering path is **mass-scraping inputs→outputs** of public surfaces to (a) clone the vendor directory — *the moat itself* — and (b) infer the ranking from patterns. ⚠️ `GET /api/v1/vendors` is **public, no-auth, `Access-Control-Allow-Origin: *`, paginatable** — the cleanest path to lift our supply side. *(This shares the fix with Part B § B2 — do it once, it serves both gates.)*

- [ ] Rate-limit `/api/v1/vendors` + `/api/v1/vendors/[publicId]`, and the rendered pages `/vendors`, `/v/[slug]`, `/venue/[slug]`, marketplace search.
- [ ] Reconsider the wildcard `Access-Control-Allow-Origin: *` on `/api/v1/vendors` — scope it, or gate volume.
- [ ] Add bot protection on high-volume query surfaces (Cloudflare bot management / Turnstile).
- [ ] Confirm production minification is on (Next.js default).

**Done when:** rate limits + bot rules are live on vendor/marketplace routes and the `/api/v1/vendors` CORS posture is an explicit decision.

## Step A4 · Legal backstops (Owner / counsel · long-pole — start early)

- [ ] **Terms of Service** clause prohibiting scraping, automated extraction, and reverse-engineering (covers the marketplace + `/api/v1`).
- [ ] **Trademark** the SETNAYAN brand (protect the thing actually worth protecting).
- [ ] **Trade-secret hygiene:** a short memo designating the matching algorithm a trade secret + access control; NDA for anyone with repo access.

**Done when:** ToS with anti-scrape clause published, trademark filed, trade-secret memo + NDA in place.

## ⚑ Spec-drift flag for Cowork

`GET /api/v1/vendors` + `/api/v1/vendors/[publicId]` are **live, public, no-auth** endpoints (CORS `*`). This appears to contradict the locked decision **"No public API endpoints in V1 · iteration 0033 plumbs the gateway only"** (corpus `CLAUDE.md`). Either the lock was intentionally superseded (a read-only public vendors API shipped) or this is unintended exposure. **Owner to confirm intent**, then reconcile via Cowork — update the 0033 lock + add a DECISION_LOG row recording the real public-API posture.

## Why code-secrecy isn't the whole game

A competent dev with AI can clone the *look* of any site in days — ours, Airbnb's, anyone's. Pixels are cheap. What a copy **cannot** lift: the vendors we've onboarded, the data that sharpens the matching over time, the trust in the Setnayan name, the vendor↔couple flywheel, and the fact that we ship the next version before they finish copying this one. Even Google's ranking gets *approximately* reverse-engineered daily and Google is still Google. Ship these four steps, then put the energy back on the moat.

---

# Part B · Customer + vendor data protection (security gate)

**Audited 2026-06-04** against shipped `main` (212 migrations, ~135 tables). Bottom line: the **data layer is genuinely strong** — the gaps are at the **HTTP edge** (headers, rate limiting) and in a few **compliance/operational** items, all fixable before launch.

## Verified strong ✅ (don't re-litigate)

- **RLS on all 134 tables** + the 4 canonical helpers (`is_admin`, `current_event_ids`, `current_vendor_ids`, `current_thread_ids`); every `SECURITY DEFINER` function pins `search_path`. The few `USING(true)`/`anon` policies are SELECT-only on non-PII public tables (pricing, widgets, ratings).
- **The public API is not the leak the old notes feared.** `/api/v1/*` PII routes require Bearer/scope auth + an explicit row-filter and return **404 (not 403)** to non-members (no existence leak); `/api/v1/vendors` column-masks contact fields.
- **Admin surface** uses a real `is_internal / is_team_member / admin` privilege check (404 on miss) **plus** per-action re-checks in all 16 admin action files (server actions are directly invokable, so this matters).
- **R2 object keys are random UUIDs** — no enumerating another couple's photos/contracts; private docs (contracts, payment screenshots) use presigned URLs.
- **Secrets are clean** — `.env*` gitignored, no `NEXT_PUBLIC_` secret leak, no hardcoded keys; the central upload route has strong path-traversal / MIME / size / signed-content-length defenses.

## 🟡 B1 · Security headers / CSP — ✅ shipped (PR #939)

`next.config.ts` previously set **zero** security headers (clickjacking + MIME-sniffing unmitigated). PR #939 adds a global `headers()` block on every response:

- [x] `Strict-Transport-Security` · `X-Content-Type-Options: nosniff` · `X-Frame-Options: SAMEORIGIN` + CSP `frame-ancestors 'self'` (external clickjacking blocked; same-origin landing-page preview iframe preserved) · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy` (camera/mic/geo = self; Topics off).
- [ ] **Follow-up (tested):** a full resource/script CSP (`default-src`/`script-src`). Deferred because it must enumerate every external origin (Supabase · Sentry · PostHog · R2 · Maya · YouTube · fonts) and would break the inline-Babel keynote decks under `public/keynote/*` — needs a preview test pass before shipping.

**Done when:** securityheaders.com grades the live site ≥ A (verify after merge via `curl -I https://setnayan.com`). Resource-CSP follow-up tracked above.

## 🔴 B2 · Rate limiting — owner action · Cloudflare/Vercel edge (no app code)

There is **no throttle anywhere** in the app (no rate-limit lib in the tree). Brute-force on auth and unlimited scraping of the vendor directory are both open. Owner chose to handle this at the **edge** (best coverage, zero DB load, stops scrapers before they hit the app) rather than in app code. *(Also closes the Part A § A3 scraping vector.)*

**Prerequisite — confirm which edge you're on:**
- If `setnayan.com` is **proxied through Cloudflare** (orange-cloud DNS in front of Vercel) → use **Cloudflare → Security → WAF → Rate limiting rules**.
- If DNS points **straight at Vercel** → use **Vercel → Project → Firewall** (same rules, Vercel's UI). Check this first — rules only fire on the edge the traffic actually passes through.

**Rules to create (sensible starting points · tune after launch):**
- [ ] **Auth brute-force** — path `/login`, `/signup`, `/forgot-password`, `/auth/*` → **10 req / min / IP** → Managed Challenge (or Block 10 min).
- [ ] **Public API scraping** — path `/api/v1/*` → **60 req / min / IP** → Managed Challenge.
- [ ] **Vendor-directory scraping** — path `/vendors`, `/v/*`, `/venue/*` → **100 req / min / IP** → Managed Challenge.
- [ ] **Bot protection** — enable **Bot Fight Mode** (Cloudflare free) / Super Bot Fight Mode (Pro), or Vercel's bot filtering.
- [ ] (Optional · app-level later) Turnstile on the inquiry + review POST forms.

**Done when:** requests above the thresholds return a challenge / HTTP 429 — verify with `for i in $(seq 1 80); do curl -s -o /dev/null -w "%{http_code}\n" https://setnayan.com/api/v1/vendors; done` (expect 200s then 429/403).

## 🔴 B3 · Hard-disable demo-mode in production (Engineering · foot-gun)

`SETNAYAN_DEMO_MODE=1` **bypasses auth + membership checks** in `api/v1/billing/initialize-maya` and `api/v1/manpower/sync-device`. Off in prod today, but catastrophic if ever mis-set.

- [ ] Force `DEMO_MODE=false` whenever `VERCEL_ENV==='production'`; add a CI assertion that it can't take effect in a prod deploy.

**Done when:** the flag provably cannot activate in production.

## ⚠️ B4 · Close the RA 10173 (Data Privacy Act) gaps (Owner + Engineering · legal must-have)

Data **export** (`/api/profile/export`) and **soft-delete** (`deleted_at`) are shipped. The rest isn't:

- [ ] Ship **hard delete / purge** (right to erasure) with a documented retention rule — today deletion only tombstones.
- [ ] Add a **marketing-consent** toggle (not confirmed in code).
- [ ] Write a **breach-notification runbook** (NPC + affected users), even if manual — none exists.

**Done when:** a couple/vendor can fully erase their data and there's a written breach procedure.

## ⚠️ B5 · Enforce PII scrubbing in logs (Engineering)

The "no PII in logs" claim is currently incidental (SDK defaults), not enforced.

- [ ] Sentry: add a `beforeSend` scrubber + `sendDefaultPii: false` in `sentry.*.config.ts`.
- [ ] PostHog: set `disable_session_recording: true` in code (don't rely on the project setting).

**Done when:** both are set in code, not just project config.

## Secondary (before or shortly after launch)

- [ ] **Dependency scanning** — add `pnpm audit --audit-level=high` (or osv-scanner) to `ci.yml` + enable Dependabot/Renovate (neither exists today).
- [ ] **Uniform input validation** — adopt `zod`/`valibot` for server actions + route handlers (validation is hand-rolled per route — thorough where present, but inconsistent, so a new route can silently skip it).
- [ ] **Service-role discipline** — a lint/CI rule that no new `api/v1` route uses the admin client without a preceding auth + row-filter (206 service-role call sites = authz is app-level, not DB-enforced).
- [ ] **Shorten presigned-URL TTL** for contracts + payment-proof screenshots from 24h → ~5–15 min (a leaked URL is valid for a full day today).

## ❓ Verify in external consoles (Owner · not visible in code)

- [ ] Cloudflare R2: confirm `setnayan-vendor-contracts` + `setnayan-thread-files` buckets are **private-read** (not public) — the bucket-level setting isn't in code.
- [ ] PostHog: confirm **session recording is OFF** at the project level (until B5 enforces it in code).

---

## Cross-references

- `PRE_PILOT_CHECKLIST_2026-06-01.md` — closed family/friends pilot (observability stack); this sheet is the *public*-pilot counterpart.
- `V2_Cutover_Plan_2026-05-28.md` — road to the 2026-12-01 public launch (this hardening gates that path).
- `0033_public_api_foundation/` — the "no public endpoints in V1" lock the spec-drift flag touches.
- `0025_profile_settings/` + `0035_observability/` + `0023_admin_console/` — RA 10173 rights · PII-in-logs · admin authz surfaces.
- `02_Specifications/RLS_Policy_Pattern.md` — the 8 RLS patterns + 4 helpers verified above.
- Code: `apps/web/lib/wizard-recommendations.ts` · `apps/web/app/api/v1/vendors/route.ts` · `apps/web/next.config.ts` · `apps/web/middleware.ts` · `sentry.*.config.ts`.
- `[[project_setnayan_leaf_match_contract]]` — the matching engine protected in Part A.
