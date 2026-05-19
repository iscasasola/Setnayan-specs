# Setnayan — Installed Stack Inventory

**Last audited:** 2026-05-14 against `origin/main` at https://github.com/iscasasola/setnayan-platform
**Companion docs:** [V1_Gap_Analysis_Status.md](V1_Gap_Analysis_Status.md) (spec) · [App_Build_Status.md](App_Build_Status.md) (code) · [API_Integration_Checklist.md](API_Integration_Checklist.md) (prereqs) · this doc (what's actually wired)

---

## How to read this doc

`App_Build_Status.md` answers "what features have we shipped?". **This doc answers "what's actually installed under the hood?"** — every dep, every migration, every workflow, every env var. Updated after a 10-pass audit of `origin/main`.

The "Status" column uses:

- ✅ **Live** — installed, configured, in active use
- 🟡 **Installed, not configured** — code is in the repo but env vars / external service signups are not done yet
- 🚧 **Queued** — referenced in `.env.example` or spec, no code wiring yet

---

## Pass 1 — Repo & build system

| Item | Value | Source |
|---|---|---|
| Package manager | **pnpm 9.12.0** (locked via `packageManager`) | `package.json` |
| Node version | **22** (locked via `.nvmrc` + `engines`) | `.nvmrc`, `package.json` |
| Monorepo | **Turborepo 2.3+** | `turbo.json` |
| Workspaces | `apps/*`, `packages/*` | `pnpm-workspace.yaml` |
| Type system | **TypeScript 5.7** (project-wide) | root `devDependencies` |
| Formatter | **Prettier 3.3** | root `devDependencies` |
| License | **AGPL-3.0** (added 2026-05-14 on public-repo flip) | `LICENSE` |
| Editor config | `.editorconfig` + `.prettierrc` checked in | repo root |
| Turbo cached tasks | `build`, `lint`, `typecheck`, `test` — `dev` non-cached + persistent | `turbo.json` |
| Turbo env passlist | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | `turbo.json` |

**Workspaces present:**

- `apps/web` — the Next.js app (`@setnayan/web`)
- `packages/shared` — shared TypeScript types/utilities (`@setnayan/shared`)
- `src-tauri/` — desktop wrapper (Rust crate, *not* part of pnpm workspaces)

---

## Pass 2 — Web app dependencies (`apps/web/package.json`)

### Runtime dependencies

| Package | Version | What it does |
|---|---|---|
| `next` | ^15.1.0 | Next.js framework (App Router, Server Actions, RSC) |
| `react` | ^19.0.0 | React 19 |
| `react-dom` | ^19.0.0 | React DOM 19 |
| `@supabase/ssr` | ^0.5.2 | Supabase SSR helpers (cookie session, middleware refresh) |
| `@supabase/supabase-js` | ^2.45.4 | Supabase client (Postgres + Auth + Storage) |
| `jose` | ^6.2.3 | JWT signing/verifying for the 0033 public API gateway (`sk_live_…` tokens) |
| `resend` | ^6.12.3 | Transactional email SDK (Resend) — **installed but env vars unset** |
| `qrcode` | ^1.5.4 | QR code generation (guest personal QRs, invitation print sheet) |
| `jsqr` | ^1.4.0 | QR detection client-side (admin merchant-QR auto-crop, added 2026-05-14) |
| `lucide-react` | ^1.14.0 | Icon framework — locked per `02_Specifications/Lucide_Icon_Migration_Spec.md` |

### Dev dependencies

| Package | Version | Purpose |
|---|---|---|
| `eslint` | ^9.0.0 | Linter |
| `eslint-config-next` | ^15.1.0 | Next.js ESLint preset |
| `tailwindcss` | ^3.4.17 | Tailwind CSS |
| `postcss` | ^8.4.49 | PostCSS |
| `autoprefixer` | ^10.4.20 | Autoprefixer |
| `typescript` | ^5.7.0 | TypeScript |
| `@types/node` | ^22.10.0 | Node typings (matches Node 22) |
| `@types/react` | ^19.0.0 | React typings |
| `@types/react-dom` | ^19.0.0 | React DOM typings |
| `@types/qrcode` | ^1.5.6 | QR code typings |

### Notable absent (queued for V1.1 / V1.5)

- `@tanstack/react-query` + persister — queued by Caching & Offline Strategy spec
- `@sentry/nextjs` — queued by 0035 Observability
- `posthog-js` — queued by 0035 Observability
- Cormorant Garamond / Manrope / DM Mono webfonts — queued by 0015 marketing site (Tailwind currently falls back to system stack)
- `next-pwa` / `workbox-window` — to be decided as part of caching-strategy implementation
- Daily.co SDK — queued by 0019 video upgrade

---

## Pass 3 — Database & schema (Supabase, Singapore region)

### Migrations on `main` (25 total, chronological)

| Sequence | File | Iteration | Adds |
|---|---|---|---|
| 1 | `20260512000000_setnayan_base.sql` | 0013 platform | 4 base tables (`users`, `events`, `event_members`, `event_join_tokens`), `generate_public_id()`, 5 RLS helpers, auth trigger |
| 2 | `20260513000000_iteration_0000_shell_schema.sql` | 0000 | App shell additions |
| 3 | `20260513010000_iteration_0001_guests.sql` | 0001 | Guest list + 18 PH role enum |
| 4 | `20260513020000_enable_pgcrypto.sql` | infra | pgcrypto for UUIDs |
| 5 | `20260513030000_fix_pgcrypto_qualification.sql` | infra | extension schema fix |
| 6 | `20260513040000_fix_rls_infinite_recursion.sql` | infra | RLS pattern bug fix |
| 7 | `20260513050000_iteration_0002_invitation.sql` | 0002 | Slugs, invitation tokens |
| 8 | `20260513060000_iteration_0002_monogram.sql` | 0002 | Monogram QR fields |
| 9 | `20260513070000_iteration_0021_planner.sql` | 0021 | 9-step planner state machine |
| 10 | `20260513080000_iteration_0010_mood_board.sql` | 0010 | Mood board palettes |
| 11 | `20260513090000_iteration_0008_seating.sql` | 0008 | Seating + tables |
| 12 | `20260513100000_iteration_0006_vendors.sql` | 0006 | Vendor tracker (couple side) |
| 13 | `20260513110000_iteration_0007_budget.sql` | 0007 | Budget + line items |
| 14 | `20260513120000_iteration_0022_vendor_dashboard.sql` | 0022 | Vendor profiles, services |
| 15 | `20260513130000_iteration_0019_communications.sql` | 0019 | Chat threads, messages, identity masking |
| 16 | `20260513140000_iteration_0025_profile_settings.sql` | 0025 | Profile prefs, theme, soft-delete |
| 17 | `20260513150000_iteration_0034_payments.sql` | 0034 | Orders, payment inbox, reference codes |
| 18 | `20260513160000_iteration_0028_notifications.sql` | 0028 | In-app notifications |
| 19 | `20260513170000_iteration_0029_help_center.sql` | 0029 | FAQ articles, support tickets |
| 20 | `20260513180000_iteration_0030_guided_tour.sql` | 0030 | `users.tour_completed_at` |
| 21 | `20260513190000_iteration_0031_schedule.sql` | 0031 | Schedule blocks (admin timeline) |
| 22 | `20260513200000_iteration_0033_api_gateway.sql` | 0033 | API keys + scopes (`oauth_clients` precursor) |
| 23 | `20260513210000_iteration_0026_bir_tax_compliance.sql` | 0026 | OR + VAT + EWT tables |
| 24 | `20260513220000_iteration_0026_drop_or_number.sql` | 0026 | OR numbering tweak |
| 25 | `20260513230000_platform_settings.sql` | admin | `platform_settings` row (BIR/bank/GCash + merchant QR URLs) |

### Schema patterns enforced

- **Canonical IDs:** every public-facing entity has `S89<TYPE>-<10-char Crockford>` via `generate_public_id(letter)`
- **RLS helpers** (in base migration): `is_admin()`, `current_event_ids()`, `current_couple_event_ids()`, `current_user_guest_ids()`, `current_vendor_profile_ids()`, `current_thread_ids()`
- **Auth trigger:** `on_auth_user_created` flips `is_internal=TRUE` for `iscasasolaii@gmail.com`
- **Patterns:** Pattern A (per-user) + Pattern B (event-scoped) per `02_Specifications/RLS_Policy_Pattern.md`

### Storage (Supabase Storage)

| Bucket | Region | Use |
|---|---|---|
| `platform-assets` | Singapore | Merchant QR codes uploaded by admin (`bdo_qr_url`, `gcash_qr_url`) |

### Cloudflare R2 (PH `apac` region — 4 buckets provisioned, not all wired)

| Bucket | Status | Use per spec |
|---|---|---|
| `setnayan-media` | ✅ Provisioned | Couple/guest photos, paparazzi captures, save-the-date renders |
| `setnayan-thread-files` | ✅ Provisioned | Chat attachments (0019) |
| `setnayan-vendor-contracts` | ✅ Provisioned | Vendor agreement signed PDFs (V1 manual flow) |
| `setnayan-samples` | ✅ Provisioned | Sample render program assets |

R2 env vars `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` exist in `.env.example` — wiring status: 🟡 (server-side upload code uses Supabase Storage only as of audit date).

---

## Pass 4 — Routes & pages (45 total)

### Marketing & public (8)

`/`, `/login`, `/signup`, `/help`, `/privacy`, `/terms`, `/download`, `/[slug]` (personal invitation), `/[slug]/welcome`

### Couple dashboard (19)

`/dashboard`, `/dashboard/create-event`,
`/dashboard/[eventId]` (home),
`/dashboard/[eventId]/guests` + `/new` + `/[guestId]` + `/import` + `/quick`,
`/dashboard/[eventId]/invitation` + `/print`,
`/dashboard/[eventId]/vendors`,
`/dashboard/[eventId]/budget`,
`/dashboard/[eventId]/messages` + `/[threadId]`,
`/dashboard/[eventId]/seating`,
`/dashboard/[eventId]/orders` + `/new` + `/[orderId]`,
`/dashboard/[eventId]/schedule`,
`/dashboard/[eventId]/services` + `/[service]` + `/mood-board` + `/save-the-date`,
`/dashboard/profile`, `/dashboard/api-keys`, `/dashboard/notifications`

### Vendor dashboard (4)

`/vendor-dashboard`, `/vendor-dashboard/messages`, `/vendor-dashboard/messages/[threadId]`, `/vendor-dashboard/notifications`

### Admin console (8)

`/admin`, `/admin/users`, `/admin/events`, `/admin/vendors`, `/admin/payments`, `/admin/receipts`, `/admin/help`, `/admin/settings`

### Join / receipts (3)

`/join/[eventId]` + `/success`, `/receipts/[receiptId]`

### Vendor view (1)

`/v/[slug]` — alternative public vendor view

### API routes (6)

| Route | Auth | Purpose |
|---|---|---|
| `/api/v1/health` | none | Liveness probe |
| `/api/v1/me` | Bearer `sk_live_…` | Caller's profile (whoami) |
| `/api/budget/[eventId]/ics` | session | `.ics` budget export |
| `/api/profile/export` | session | RA 10173 data export |
| `/api/slugs/check` | session | Slug-availability debounce (300ms) |
| `/api/download/mac` | none | Redirects to GitHub Releases `.dmg` |

### Auth / sign-out routes (4)

`/auth/callback`, `/auth/sign-out`, `/[slug]/redeem`, `/[slug]/sign-out` (guest)

### Liveness

`/health` (200 + `{ok: true, ts}`)

---

## Pass 5 — Server actions & lib modules

### Lib modules (`apps/web/lib/`) — 37 files

| Module | Concern |
|---|---|
| `api-auth.ts` | Bearer-token validation for `/api/v1/*` |
| `api-keys.ts` | API key CRUD + scope checks |
| `budget.ts` | Budget + line item domain |
| `chat.ts`, `chat-actions.ts` | Chat threads, identity masking, message ops |
| `csv.ts` | CSV import parsing |
| `desktop-release.ts` | GitHub Releases metadata for `/download` page |
| `email.ts` | Resend wrapper (queued sends, no-op when env unset) |
| `events.ts` | Event CRUD |
| `guest-session.ts` | Cookie-based guest sessions (signed via `GUEST_SESSION_SECRET`) |
| `guests.ts` | Guest CRUD, 18 PH roles, plus-ones |
| `help.ts` | FAQ + support tickets |
| `monogram.ts` | Monogram + QR rendering |
| `mood-board.ts` | 9 palette keys (Venue / Couple / Roles) |
| `notification-actions.ts`, `notification-emit.ts`, `notifications.ts` | In-app notifications |
| `orders.ts` | Apply-then-pay orders (0034) |
| `planner.ts` | 9-step Setnayan Concierge state (renamed from "Guided Planner" 2026-05-16) |
| `platform-settings.ts` | BIR + bank + GCash + merchant QR settings |
| `qr.ts` | QR generation helpers |
| `receipts.ts` | BIR receipts (VAT split, OR generation) |
| `role-groups.ts` | Filipino role groupings + palette dots |
| `save-the-date.ts` | 12-template gallery → orders flow |
| `schedule.ts` | Day-of timeline (admin) |
| `seating.ts` | Tables + drag-place floor plan |
| `slugs.ts` | Slug validation + reservation |
| `storage.ts` | Supabase Storage upload helpers |
| `supabase/admin.ts`, `client.ts`, `middleware.ts`, `server.ts` | Supabase clients (service role / browser / middleware refresh / SSR) |
| `tour-actions.ts` | Guided tour completion |
| `vendor-profile.ts`, `vendors.ts` | Vendor profile + couple-side tracker |

### Server actions — 33 `actions.ts` files

Every mutating UI flow has its own `actions.ts` co-located with the page (Next 15 server-action convention). Notable inventories:

- **Auth:** `app/login/actions.ts`, `app/signup/actions.ts`
- **Event lifecycle:** `app/dashboard/create-event/actions.ts`, `app/dashboard/[eventId]/actions.ts`
- **Guests:** `new/actions.ts`, `[guestId]/actions.ts`, `import/actions.ts`, `quick/actions.ts` (4 entry points)
- **Public invitation:** `app/[slug]/actions.ts`, `app/[slug]/welcome/actions.ts`
- **Admin:** `users/actions.ts`, `payments/actions.ts`, `settings/actions.ts`, `help/actions.ts`
- **Vendor:** `app/vendor-dashboard/actions.ts`, `app/dashboard/[eventId]/vendors/actions.ts`

---

## Pass 6 — External services & integrations

| Service | Status | Wiring evidence | Env vars |
|---|---|---|---|
| **Supabase** (Postgres + Auth + Storage + Realtime) | ✅ Live | `lib/supabase/{admin,client,server,middleware}.ts`, 25 migrations | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| **Vercel** (Hosting + Vercel Analytics) | ✅ Live | `setnayan.com` + `setnayan-platform-web.vercel.app` | Vercel project env |
| **Cloudflare R2** (4 PH-region buckets) | 🟡 Buckets provisioned, app-side upload still on Supabase Storage | `.env.example` keys reserved | `R2_*` |
| **Resend** (transactional email) | 🟡 SDK installed (`resend ^6.12.3`), no env vars | `lib/email.ts` wrapper | `RESEND_API_KEY`, `RESEND_FROM_ADDRESS` |
| **Daily.co** (video meetings 0019) | 🚧 Queued | none | `DAILY_API_KEY`, `DAILY_DOMAIN` |
| **Anthropic Claude API** (0032 + 0011 highlights) | 🚧 Queued | none | `ANTHROPIC_API_KEY` |
| **Sentry** (error tracking 0035) | 🚧 Queued | none | `SENTRY_DSN`, `SENTRY_AUTH_TOKEN` |
| **PostHog** (product analytics 0035) | 🚧 Queued | turbo env-passlist reserves the keys | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` |
| **Better Stack** (uptime + log) | 🚧 Queued | none | `BETTER_STACK_SOURCE_TOKEN` |
| **GitHub Releases** | ✅ Live | v0.0.1 with macOS `.dmg`; `/download` consumes via `lib/desktop-release.ts` | none |
| **Cloudflare Workers / Queues / Stream Live** (0011 / 0012 / 0024 render) | 🚧 Queued | none | — |
| **YouTube Data API v3** (0011 live-stream relay) | 🚧 Queued | none | — |
| **Suno Premier** (music catalog generation) | 🚧 Owner manual workstream | none | — |
| **Canon / Nikon / Sony / Fujifilm SDKs** (0012 DSLR bridge) | 🚧 Approval waits | none | — |
| **Apple Developer Program / Google Play Console** (Papic native + macOS signing) | 🚧 Awaiting owner enrollment | none | — |
| **Hetzner Cloud** (render fallback VM pool) | 🚧 Queued | none | — |
| **Mapbox or Google Maps** (venue pin) | 🚧 Queued | none | — |
| **PandaDoc / DocuSign** (V1.5 e-signature) | 🚧 Placeholder | manual signing in V1 | — |
| **GCash Merchant API / PayMongo** (V1.5 payments) | 🚧 Application pending | manual reconciliation in V1 | — |

---

## Pass 7 — Hosting, domains & GitHub

| Item | Value |
|---|---|
| GitHub repo | `https://github.com/iscasasola/setnayan-platform` |
| Repo visibility | **Public** (flipped 2026-05-14, AGPL-3.0 licensed) |
| Main branch | `main`, fast-forward auto-deploy to Vercel Production |
| Branch naming for AI work | `claude/<adjective>-<noun>-<6hex>` (PR pattern) |
| GitHub security | Dependabot alerts + automated security updates **enabled**; Secret scanning + push protection **enabled**; Wiki + Projects + Discussions **disabled** |
| Custom domain | `setnayan.com` (SSL via Vercel) — live |
| Vercel project URL | `setnayan-platform-web.vercel.app` (preview + fallback) |
| Vercel plan | Hobby |
| Production short-URL alias | Middleware rewrites `setnayan.com/<event-uuid>/...` → `/dashboard/<event-uuid>/...` |
| GitHub Releases | v0.0.1 with macOS `.dmg` for Tauri desktop |
| Owner email (auto-internal) | `iscasasolaii@gmail.com` |

---

## Pass 8 — Desktop / PWA / multi-platform

### Tauri 2 desktop wrapper (`src-tauri/`)

| Property | Value |
|---|---|
| Identifier | `com.setnayan.desktop` |
| Product name | Setnayan |
| Version | 0.0.1 |
| Targets in CI | `aarch64-apple-darwin` (.dmg), `x86_64-pc-windows-msvc` (.msi) |
| Window | 1440×900 default, 1024×768 minimum, resizable |
| Tauri deps | `tauri ^2`, `serde ^1`, `serde_json ^1`, `tauri-build ^2` |
| Rust edition | 2021 (rust-version 1.77+) |
| Code signing | **Not yet** — owner needs Apple Developer Program ($99/yr) + Windows code-signing cert |
| Bundle icons | 32px, 128px, 128@2x, `icon.icns`, `icon.ico` |

### PWA

| Property | Value |
|---|---|
| Manifest | `apps/web/public/manifest.json` (name "Setnayan", `display: standalone`, lang `en-PH`, theme `#FAF7F2`) |
| Icons | `/icon-192.svg`, `/icon-512.svg` (SVG, maskable) |
| Service worker | `apps/web/public/sw.js` (raw API, ~50 LOC) — shell cache + offline fallback; exclusion list for `/auth/`, `/api/`, `/health`, cross-origin |
| Service-Worker-Allowed header | Set via `next.config.ts` `headers()` for `/sw.js` |
| Cache strategy | Sprint-0 minimal; full strategy specced in [Caching_and_Offline_Strategy.md](02_Specifications/Caching_and_Offline_Strategy.md) (implementation pending) |
| Server actions body limit | 6MB (raised from default 1MB for phone-camera screenshots) |

---

## Pass 9 — CI/CD workflows (`.github/workflows/`)

### `ci.yml`

- Triggers: push to `main`, all PRs, manual dispatch
- Jobs:
  - **typecheck + lint** — `pnpm typecheck` + `pnpm lint` on Node 22 with pnpm cache
  - **gitleaks** — `gitleaks/gitleaks-action@v2` against full history (`fetch-depth: 0`)

### `lighthouse.yml`

- Triggers: PRs touching `apps/web/**` or `.lighthouserc.json`, manual dispatch
- Builds the web app, runs Lighthouse CI
- Targets: Perf / A11y / Best / SEO ≥ 90 (error), PWA ≥ 90 (warn)

### `build-desktop.yml`

- Triggers: push to `main`, PRs touching `apps/web/**` or `src-tauri/**`, manual dispatch
- Matrix: `macos-latest` (aarch64) + `windows-latest` (x86_64)
- Produces unsigned `.dmg` (macOS) and `.msi` (Windows) artifacts on every run
- Goal per kickoff: "don't go back" insurance — a web change that breaks the Tauri wrapper fails CI before merge

### Owner follow-up (deferred)

- "Require approval for first-time contributors" → set to **All outside collaborators** in Actions settings (UI-only, not REST-accessible)
- Branch protection on `main` deferred — solo dev for now

---

## Pass 10 — Environment variables (full inventory from `.env.example`)

### Supabase

- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅

### Cloudflare R2

- `R2_ACCOUNT_ID` 🟡
- `R2_ACCESS_KEY_ID` 🟡
- `R2_SECRET_ACCESS_KEY` 🟡
- `R2_BUCKET_MEDIA=setnayan-media` 🟡
- `R2_BUCKET_THREAD_FILES=setnayan-thread-files` 🟡
- `R2_BUCKET_VENDOR_CONTRACTS=setnayan-vendor-contracts` 🟡
- `R2_BUCKET_SAMPLES=setnayan-samples` 🟡
- `R2_PUBLIC_URL` 🟡

### Daily.co

- `DAILY_API_KEY` 🚧
- `DAILY_DOMAIN` 🚧

### Resend

- `RESEND_API_KEY` 🚧 (SDK code shipped; manual password-reset bypass is Phase 2A)
- `RESEND_FROM_ADDRESS=hello@setnayan.com` 🚧

### Anthropic

- `ANTHROPIC_API_KEY` 🚧 (blocks 0032 Contract Intelligence)

### Observability

- `SENTRY_DSN` 🚧 (blocks 0035)
- `SENTRY_AUTH_TOKEN` 🚧
- `NEXT_PUBLIC_POSTHOG_KEY` 🚧
- `NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com` 🚧
- `BETTER_STACK_SOURCE_TOKEN` 🚧

### App-level

- `NEXT_PUBLIC_APP_URL=http://localhost:3000` ✅ (prod overrides to `https://setnayan.com`)
- `GUEST_SESSION_SECRET` ✅ (falls back to service-role key if unset)

---

## Themes, fonts & icons

| Asset | Status |
|---|---|
| Theme palettes (Setnayan Default / Victorian / Classy / iOS) | ✅ Live in `apps/web/app/globals.css` per `02_Specifications/Theme_System_Implementation_Spec.md` |
| Tailwind breakpoints (sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536) | ✅ Locked in `tailwind.config.ts` |
| Color tokens (`cream`, `ink`, `terracotta` 50–900) | ✅ Defined via CSS variables; runtime-resolvable per `[data-theme]` block |
| Cormorant Garamond / Manrope / DM Mono webfonts | 🚧 Queued for 0015 — system fallback active |
| Icon set (Lucide) | ✅ `lucide-react ^1.14.0` installed |
| PWA icons (192, 512) | ✅ SVG, maskable |
| Tauri bundle icons (32, 128, 128@2x, .icns, .ico) | ✅ Generated from `src-tauri/icons/icon.svg` via `cargo tauri icon` |

---

## What's NOT installed (visible-gap section — re-audited 2026-05-14)

The full inventory of things that are *expected* by specs but *not* in code today. Surfaced via 10-pass audit on 2026-05-14. Originally 10 items; full count is **80**. Grouped below; complete install sequence with phasing at [Install_Sequence_V1.md](02_Specifications/Install_Sequence_V1.md).

### Business / Legal / Tax foundation (PREREQUISITE for SDK approvals + bank accounts)

1. **DTI Single Proprietorship registration** — gating Tier 6 SDKs + bank accounts
2. **BIR Form 2303 + Mayor's Permit** — gating Official Receipts + business operations (Tier 2.2)
3. **BIR accountant retainer** — quarterly Form 2307 + eFPS filings (~₱5K/mo)
4. **DPO appointment + NPC registration** — RA 10173 compliance, ~₱500 fee
5. **BDO + GCash business accounts** (Setnayan registered name, not personal)
6. **`setnayan.ph` domain** via PHNic

### Email infrastructure (PREREQUISITE for Resend)

7. **DKIM / SPF / DMARC DNS records** on `setnayan.com`
8. **Email forwarders** via Cloudflare Email Routing (`admin@`, `dpo@`, `vendors@`, `hello@`)
9. **Resend account** + env vars in Vercel
10. **Slack workspace** for Better Stack alert routing

### Observability (queued, needs signups)

11. **Sentry account** + `SENTRY_DSN` + `SENTRY_AUTH_TOKEN`
12. **PostHog account** + `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST`
13. **Better Stack account** + uptime monitor + log drain destination
14. **`@sentry/nextjs`** npm install
15. **`posthog-js`** npm install
16. **`/api/health/deep` endpoint** (DB + R2 + Resend pings)

### Caching & offline foundation (per locked spec)

17. **`@tanstack/react-query`** + **`@tanstack/query-sync-storage-persister`**
18. **`workbox-window`** + **`workbox-precaching`** (extend existing `sw.js`)
19. **`useTrackedMutation`** wrapper at `lib/use-tracked-mutation.ts`
20. ESLint rule **`setnayan/no-raw-mutation`**
21. **`NEXT_PUBLIC_CACHE_BUSTER`** env + CI schema-bump enforcement

### npm packages — engineering foundation

22. **`zod`** — Server Action + API schema validation
23. **`react-hook-form`** — form handling
24. **`date-fns`** (or `dayjs`) — date/time + PH timezone
25. **`next-intl`** (or `i18next`) — i18n framework
26. Locale files `dashboard.{en,tl}.json` for 0025 EN/TL toggle
27. **`nanoid`** — short-lived token IDs

### npm packages — file preview + readers (0019)

28. **`mammoth`** — `.docx` → HTML reader for chat attachments
29. **`xlsx`** (SheetJS) — `.xlsx`/`.csv` reader for chat attachments
30. **LibreOffice headless** binary on Cloudflare Queue worker for preview-generation pipeline

### npm packages — documents + images

31. **`pdf-lib`** (or `jsPDF`) — BIR Official Receipts + Form 2307 PDFs (0026)
32. **`sharp`** — server-side image processing

### Render pipeline (Phase 7)

33. **Anthropic Console account** + `ANTHROPIC_API_KEY` + spend cap
34. **`@anthropic-ai/sdk`** npm install
35. **Cloudflare Workers Paid plan** ($5/mo)
36. **Cloudflare Stream Live** enable + ultra-low-latency mode
37. **Cloudflare Queues** — `reel-render-queue`, `std-render-queue`, `ai-highlight-queue`
38. **YouTube master channel `@SetnayanWeddings`** + YPP-OFF verification
39. **Google Cloud project** + YouTube Data API v3 + OAuth credentials
40. **Remotion** — programmatic video rendering library
41. **`lottie-web`** (or `@lottiefiles/lottie-player`) — overlay rendering
42. **FFmpeg binary** on Workers + Hetzner VMs
43. **30 LUT files** (`.cube` color-grading) — one per template feel category
44. **30 Remotion components** — one per V1 template (Capiz Garden, Editorial Cream, etc.)
45. **30 `manifest.json` files** at `/template_library/{feel}/TPL_{nnn}.json`
46. **`library_index.json`** master index on R2
47. **Music catalogue** (~400 Suno-generated tracks) → R2 `/music_catalogue/{category}/`
48. **`catalogue_manifest.json`** master index on R2

### Database extensions

49. **`pg_trgm`** Postgres extension — fuzzy text matching for 0034 § 11 reconciliation
50. Verify **`uuid-ossp`** extension enabled (Supabase default)

### Infrastructure / configuration

51. **Vercel Pro plan upgrade** ($20/mo) — currently Hobby; unlocks Cron + Log Drains
52. **Vercel Log Drains** → Better Stack
53. **Cron infrastructure** — Vercel Cron OR Cloudflare Cron Triggers for 6 scheduled jobs
54. **Vercel KV** or **Upstash Redis** — rate-limit layer for 0033 API tiers
55. **Cloudflare Email Routing** activation on `setnayan.com`
56. **Cloudflare WAF rules** — basic edge protection (Phase 9)
57. **Cloudflare Turnstile** (or hCaptcha) — bot protection on signup/login/register-vendor/redeem
58. **R2 client** — `@aws-sdk/client-s3` (or `aws4fetch`) + `lib/r2.ts` signed-URL helper
59. **R2 upload path swap** — vendor logos + payment screenshots + thread attachments + vendor contracts (currently all on Supabase Storage)
60. **`developers.setnayan.com`** subdomain → static placeholder page
61. **OAuth + PKCE plumbing** — `oauth_clients` table + 16-scope registry + refresh-token rotation
62. **Supabase Pro plan upgrade** (~$25/mo) — when approaching free-tier limits

### Webfonts + brand assets

63. **Cormorant Garamond** webfont
64. **Manrope** webfont
65. **DM Mono** webfont
66. **Color name library** (~300 entries) — Mood Board autocomplete dataset

### Tour migration

67. **`driver.js`** — migrate hand-rolled tour + ship 11 per-surface mini-tours (0030)

### Video meetings (0019 partial → complete)

68. **Daily.co account** + `DAILY_API_KEY` + `DAILY_DOMAIN` + Singapore region
69. **`daily-js`** npm install

### Mapping

70. **Mapbox account** + API token (referrer-restricted) — venue pin

### Phase 2 / V1.5 deferrals (start signups October 2026)

71. **Apple Developer Program** ($99/yr) — identity verification 2–14 days
72. **Google Play Console** ($25 one-time)
73. **Canon EOS Camera Connect SDK** approval — 5–10 days
74. **Nikon SnapBridge / MTP-WiFi SDK** approval — 7–14 days
75. **Sony Camera Remote SDK** approval — 7–14 days
76. **Fujifilm Camera Remote SDK** approval — 10–21 days (longest)
77. **Firebase project** (`setnayan-prod` + `setnayan-staging`) — for ML Kit Android
78. **Twilio / Globe / Smart SMS gateway** — V1.5 SMS OTP
79. **GCash Merchant API** — V1.5 automated payment reconciliation
80. **PayMongo** — V1.5 alternative payment processor
81. **PandaDoc** or **DocuSign** — V1.5 e-signature
82. **Hetzner Cloud** account + 2× CPX21 VMs (HEL1) — render-pipeline fallback

### Contract documentation (file as items above resolve)

83. **`01_Contracts/Suno_Premier_License.md`**
84. **`01_Contracts/DTI_Certificate.pdf`**
85. **Vendor SDK signed agreements** × 4 (Canon, Nikon, Sony, Fujifilm)

---

**Count summary:** 80 install-surface items + 5 contract documentation items = 85 total gaps surfaced. See [Install_Sequence_V1.md](02_Specifications/Install_Sequence_V1.md) for the 10-phase install plan; see [API_Integration_Checklist.md § Tier 8](API_Integration_Checklist.md) for the per-tier breakdown.

**Previously listed:** 10 items (pre-2026-05-14 audit)
**Newly surfaced this audit:** 70+ items
**Critical-path-for-December-18:** items 9, 11–16, 17–21, 31, 51 plus 0031 day-of UI (Phase 3 of sequence)

---

## Cross-references

- **Where to look in spec corpus:** every iteration with a `0NNN_*` folder has a `.md` spec, a `.docx` stakeholder mirror, and (for 0021/0022/0023/0024) an `.html` prototype. Open the matching folder.
- **Where to look in the repo:** `STATUS.md` is the living checkpoint, `HANDOFF.md` is the cold-start handoff, `OWNER_ACTIONS.md` is the phased launch checklist, `CHANGELOG.md` is the append-only history.
- **Strategy/financial context:** `03_Strategy/`, `05_Financials/Pricing_Workbook_*.xlsx`
- **Locked contracts:** `01_Contracts/Setnayan_Vendor_Agreement.md`, `01_Contracts/Setnayan_Privacy_and_Security_Policy.md`
- **Disaster recovery:** `09_Operations/Disaster_Recovery_Playbook.md`

---

## How to re-generate this doc

After any dep/migration/workflow change, re-run the 10-pass audit:

```bash
# Pass 1 — root
git show origin/main:package.json
git show origin/main:turbo.json
git show origin/main:pnpm-workspace.yaml

# Pass 2 — web deps
git show origin/main:apps/web/package.json

# Pass 3 — migrations
git ls-tree -r origin/main supabase/migrations | awk '{print $4}'

# Pass 4 — routes
git ls-tree -r origin/main apps/web/app | grep -E '/(page|route)\.tsx?$' | awk '{print $4}'

# Pass 5 — actions + lib
git ls-tree -r origin/main apps/web/app | grep 'actions\.ts$' | awk '{print $4}'
git ls-tree -r origin/main apps/web/lib | awk '{print $4}'

# Pass 6 — services (cross-reference against .env.example)
git show origin/main:.env.example

# Pass 7 — repo metadata
gh repo view iscasasola/setnayan-platform --json visibility,description,homepageUrl
gh release list --repo iscasasola/setnayan-platform

# Pass 8 — desktop + PWA
git show origin/main:src-tauri/tauri.conf.json
git show origin/main:src-tauri/Cargo.toml
git show origin/main:apps/web/public/manifest.json
git show origin/main:apps/web/public/sw.js

# Pass 9 — CI
git ls-tree -r origin/main .github/workflows | awk '{print $4}'

# Pass 10 — env
git show origin/main:.env.example
```

Cross-reference each finding against [App_Build_Status.md](App_Build_Status.md) (per-iteration shipping state) and [API_Integration_Checklist.md](API_Integration_Checklist.md) (signups + approvals needed before code can run end-to-end).
