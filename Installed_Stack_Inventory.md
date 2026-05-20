# Setnayan — Installed Stack Inventory

**Last audited:** 2026-05-20 against `origin/main` at https://github.com/iscasasola/setnayan-platform (previous audit 2026-05-14 — 51 migrations + 130+ PRs landed in the intervening 6 days)
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
| `resend` | ^6.12.3 | Transactional email SDK (Resend) — wrapper at `lib/email.ts`; V1 soft-launch auto-confirms signup so flow is non-blocking |
| `qrcode` | ^1.5.4 | QR code generation (guest personal QRs, invitation print sheet) |
| `jsqr` | ^1.4.0 | QR detection client-side (admin merchant-QR auto-crop, added 2026-05-14) |
| `lucide-react` | ^1.14.0 | Icon framework — locked per `02_Specifications/Lucide_Icon_Migration_Spec.md` |
| `@sentry/nextjs` | ^8.0.0 | Error tracking (0035) — wired by PR #17 on 2026-05-14 |
| `posthog-js` | ^1.165.0 | Product analytics (0035) — wired by PR #19 on 2026-05-14 with 3 server-side funnels |
| `@tanstack/react-query` | ^5.0.0 | Client-side data fetching — wired by PR #10 on 2026-05-14 (caching foundation) |
| `@tanstack/query-sync-storage-persister` | ^5.0.0 | LocalStorage cache persistence for offline-first patterns |
| `@tanstack/react-query-persist-client` | ^5.0.0 | Persister client glue |
| `idb-keyval` | ^6.2.1 | IndexedDB key/value store for offline support |
| `pdf-lib` | ^1.17.1 | PDF generation for BIR Official Receipts + Form 2307 (0026) |
| `@aws-sdk/client-s3` | ^3.700.0 | R2 client (PR #18 — R2 storage migration off Supabase Storage) |
| `@aws-sdk/s3-request-presigner` | ^3.700.0 | Signed URL generation for R2 (5-min TTL) |
| `tailwindcss-animate` | ^1.0.7 | Tailwind animation utilities (added with site redesign 2026-05-19) |

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

- ~~`@tanstack/react-query` + persister~~ — ✅ shipped 2026-05-14 (PR #10)
- ~~`@sentry/nextjs`~~ — ✅ shipped 2026-05-14 (PR #17); production smoke test still pending
- ~~`posthog-js`~~ — ✅ shipped 2026-05-14 (PR #19); 3 server-side funnels live
- ~~`pdf-lib`~~ — ✅ shipped (BIR 2307 + OR generation)
- ~~`@aws-sdk/client-s3`~~ — ✅ shipped 2026-05-14 (PR #18); R2 client + presigner
- Cormorant Garamond / Manrope / DM Mono webfonts — queued by 0015 marketing site (Tailwind currently falls back to system stack)
- `next-pwa` / `workbox-window` — to be decided as part of caching-strategy implementation
- ~~Daily.co SDK~~ — ❌ RETIRED 2026-05-16 (entire 0019 video feature removed)
- `zod` — still absent; server action + API validation queued
- `react-hook-form` — still absent
- `date-fns` / `dayjs` — still absent; PH timezone helpers inlined
- `next-intl` / `i18next` — locale toggle (0025) ships with hand-rolled `lib/i18n/` instead
- `nanoid` — still absent (short token IDs)
- `mammoth` / `xlsx` / `sharp` — still absent (chat preview pipeline)

---

## Pass 3 — Database & schema (Supabase, Singapore region)

### Migrations on `main` (76 total, chronological)

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
| 26 | `20260514000000_blacklisted_emails.sql` | admin | Email blacklist for account-lifecycle redesign (PR #9) |
| 27 | `20260514010000_iteration_0022_vendor_dashboard_expansion.sql` | 0022 | Services editor + bookings inbox + 4-role team + earnings rollup (PR #25) |
| 28 | `20260514011000_iteration_0033_api_scopes.sql` | 0033 | Scope-gated `sk_live_*` keys (PR #27) |
| 29 | `20260514012000_notification_type_additions.sql` | 0028 | Notification type enum expansion |
| 30 | `20260514100000_vendor_reviews.sql` | 0006 | Vendor reviews — couple form + vendor reply (PR #24) |
| 31 | `20260514110000_force_majeure_flags.sql` | admin | Force-majeure queue + couple-side disputes (PR #26) |
| 32 | `20260514120000_add_religious_venue_category.sql` | 0006 | Religious-venue category for vendor browser |
| 33 | `20260514130000_vendor_portfolio.sql` | 0022 | Vendor portfolio uploads |
| 34 | `20260514140000_enable_realtime_chat.sql` | 0019 | Supabase Realtime for chat threads |
| 35 | `20260514150000_iteration_0019_follow_gate.sql` | 0019 | Couple-must-follow-vendor gate before chat open |
| 36 | `20260515000000_theme_preference_add_forest_champagne.sql` | 0025 | Forest + Champagne theme palettes |
| 37 | `20260515005000_vendor_public_visibility.sql` | 0006 | Vendor public visibility toggle |
| 38 | `20260515010000_site_widgets.sql` | admin | Admin-editable marketing widgets (`/admin/website`) |
| 39 | `20260515020000_public_stats_exclusion.sql` | 0006 | Public stats exclude vendor's own team |
| 40 | `20260515030000_self_review_gate.sql` | 0006 | Self-review hard-gate |
| 41 | `20260516000000_v1_sku_lock_service_catalog.sql` | 0034 | V1 SKU lock (canonical catalog) |
| 42 | `20260516010000_v1_sku_lock_vendor_verifications.sql` | 0026 | Vendor verification flow lock |
| 43 | `20260516020000_v1_sku_lock_vendor_payouts.sql` | 0026 | Vendor payout model lock |
| 44 | `20260516030000_v1_sku_lock_setnayan_pay_methods.sql` | 0034 | Setnayan Pay methods lock |
| 45 | `20260516040000_v1_sku_lock_vendor_tool_bundles.sql` | 0022 | Vendor tool bundles |
| 46 | `20260516050000_iteration_0006_vendor_verification_flow.sql` | 0006 | 12-doc vendor verification + Persona/AMLC hooks |
| 47 | `20260516100000_iteration_0026_bir_2307_filings.sql` | 0026 | BIR Form 2307 quarterly filings |
| 48 | `20260516210000_vendor_payout_model.sql` | 0026 | Payout schedules + withholding |
| 49 | `20260516220000_vendor_ad_subscriptions.sql` | 0022 | Vendor ads/marketing subscriptions |
| 50 | `20260516230000_iteration_0017_patiktok.sql` | 0017 | Patiktok schema |
| 51 | `20260516240000_iteration_0017_patiktok_oauth.sql` | 0017 | TikTok OAuth wiring |
| 52 | `20260516250000_iteration_0017_patiktok_music.sql` | 0017 | Patiktok music catalog refs |
| 53 | `20260516260000_iteration_0000_event_type_swap.sql` | 0000 | Wedding-only event type lock for V1 |
| 54 | `20260516261000_oauth_grants_per_couple.sql` | 0011/0009 | OAuth grants table (per-couple YouTube/Drive tokens) |
| 55 | `20260516280000_events_papic_storage_target.sql` | 0012 | Papic storage target per event |
| 56 | `20260517000000_feature_reviews.sql` | platform | Feature-level reviews (separate from vendor reviews) |
| 57 | `20260517010000_feature_policy.sql` | platform | Feature policy table |
| 58 | `20260517020000_notification_type_force_majeure_filed.sql` | admin | Force-majeure-filed notification type |
| 59 | `20260518000000_v1_concierge_pay_flat_and_charm.sql` | 0016 | Concierge flat ₱4,999 + charm pricing |
| 60 | `20260518100000_launch_promo_until_mar_2027.sql` | promo | Pilot Mode free until March 2027 |
| 61 | `20260518200000_vendor_contracts_dual_esign_retire_0032.sql` | 0032 ❌ | **Retire 0032 Contract Intelligence**; replace with free dual e-signature on every vendor contract (no AI in V1) |
| 62 | `20260518300000_couple_waitlist_signups.sql` | marketing | `/waitlist` capture for soft-launch demand |
| 63 | `20260518400000_concierge_repriced_to_2499.sql` | 0016 | Concierge launch promo reprice (later corrected back to ₱4,999) |
| 64 | `20260518500000_iteration_0016_wizard_architecture_schema.sql` | 0016 | Concierge wizard architecture (pgvector synthesis) |
| 65 | `20260519000000_phase_a_event_editorial_consent.sql` | 0015 | Public-view + signup consent (Phase A — PR #131) |
| 66 | `20260519100000_iteration_0048_event_moderators_foundation.sql` | 0048 | **V1.2** multi-moderator foundation (NOT V1) |
| 67 | `20260519200000_vendor_invites_foundation.sql` | 0006/0022 | Couple-initiated invite for off-platform vendors (PR #137) |
| 68 | `20260519201000_iteration_0030_tour_seen_keys.sql` | 0030 | Per-surface guided tour seen-key registry (PR #138) |
| 69 | `20260519210000_iteration_0018_supplies_foundation.sql` | 0018 | **NEW** Supplies — vendors, SKUs, pricing, orders (PR #143) |
| 70 | `20260519220000_iteration_0018_pricing_resolver_fn.sql` | 0018 | Lowest-available-wholesale pricing resolver (PR #146) |
| 71 | `20260519400000_v1_sku_pricing_corrections_2026_05_17.sql` | 0034 | SKU pricing corrections sweep |
| 72 | `20260520000000_iteration_0009_photo_delivery_foundation.sql` | 0009 | **NEW** Photo Delivery Drive (Google Drive OAuth + jobs) — PR #147 |
| 73 | `20260520000000_v1_sku_lock_papic_seat_packs.sql` | 0012 | Papic V1 SKUs seeded (PR #149) |
| 74 | `20260520010000_iteration_0005_led_background_foundation.sql` | 0005 | **NEW** LED background configs + renders (PR #150) |
| 75 | `20260520010000_iteration_0012_paparazzi_seats_photos.sql` | 0012 | `paparazzi_seats` + `papic_photos` (PR #151) |
| 76 | `20260520020000_iteration_0009_photo_delivery_oauth_provider.sql` | 0009 | Photo Delivery OAuth provider table (PR #153) |

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

## Pass 4 — Routes & pages (~140 total)

### Marketing & public (15)

`/`, `/login`, `/signup`, `/help`, `/privacy`, `/terms`, `/download`, `/features`, `/for-vendors`, `/how-it-works`, `/pricing`, `/waitlist`, `/weddings`, `/vendors` (marketplace), `/[slug]` (personal invitation) + `/welcome`

### Couple dashboard (~30)

`/dashboard`, `/dashboard/create-event`, `/dashboard/profile` + `/concierge`, `/dashboard/api-keys`, `/dashboard/notifications`,
`/dashboard/[eventId]` (home), `/activity`, `/budget`, `/contracts` + `/[contractId]`, `/disputes`, `/guests` + `/new` + `/[guestId]` + `/import` + `/quick`, `/invitation` + `/print`, `/messages` + `/[threadId]`, `/orders` + `/new` + `/[orderId]`, `/schedule`, `/seating`, `/vendors` + `/[eventVendorId]/review`,
`/add-ons` + per-addon pages (`led`, `mood-board`, `panood` + `/setup` + `/broadcast` + `/reviews`, `papic`, `patiktok` + `/booth` + `/[templateId]`, `photo-delivery`, `save-the-date`, `supplies-marketplace`, `[addon]` catch-all)

### Vendor dashboard (13)

`/vendor-dashboard`, `/bookings`, `/contracts` + `/new` + `/[contractId]`, `/earnings`, `/marketing`, `/messages` + `/[threadId]`, `/notifications`, `/reviews`, `/services`, `/tax-documents`, `/team`, `/verify`

### Vendor claim flow (2)

`/vendor/claim/[token]` + `/finalize` — couple-initiated invite for off-platform vendors (PR #137)

### Admin console (16)

`/admin`, `/users`, `/events`, `/vendors`, `/verify`, `/payments`, `/payouts`, `/receipts`, `/bir/2307`, `/help`, `/settings` + `/payment-methods`, `/ads`, `/concierge-abuse`, `/force-majeure` + `/[flagId]`, `/funnels`, `/reviews`, `/website`

### Join / receipts (3)

`/join/[eventId]` + `/success`, `/receipts/[receiptId]`

### Vendor view (1)

`/v/[slug]` — alternative public vendor view

### API routes (~30)

| Route | Auth | Purpose |
|---|---|---|
| `/api/v1/health` | none | Liveness probe |
| `/api/v1/me` | Bearer `sk_live_…` | Caller's profile (whoami) |
| `/api/v1/events` + `/[eventId]` + `/guests` | Bearer | Read-only events + guests (0033, PR #27) |
| `/api/v1/vendors` + `/[publicId]` | Bearer | Vendor marketplace read (PR #24/27) |
| `/api/v1/reviews` | Bearer | Reviews read |
| `/api/v1/admin/site-widgets` + `/reorder` + `/[widget_id]` | admin | Marketing widget editor |
| `/api/budget/[eventId]/ics` | session | `.ics` budget export |
| `/api/profile/export` | session | RA 10173 data export |
| `/api/slugs/check` | session | Slug-availability debounce |
| `/api/download/mac` | none | Redirects to GitHub Releases `.dmg` |
| `/api/upload` | session | R2 upload endpoint (PR #18) |
| `/api/oauth/youtube/start` + `/callback` + `/disconnect` | session | 0011 Panood YouTube OAuth |
| `/api/oauth/drive/start` + `/callback` + `/disconnect` | session | 0012 Papic Drive OAuth |
| `/api/oauth/photo-delivery/start` + `/callback` | session | 0009 Photo Delivery Drive OAuth (PR #153) |
| `/api/tiktok/auth/start` + `/callback` | session | 0017 Patiktok TikTok OAuth |
| `/api/cron/oauth-refresh` | `OAUTH_REFRESH_CRON_SECRET` | Refresh OAuth tokens before expiry |
| `/api/admin/cron/dispute-counter` | `CRON_SECRET` | Force-majeure dispute counter cron |
| `/api/admin/cron/generate-2307` | `CRON_SECRET` | Quarterly BIR 2307 generation |
| `/api/admin/bir/2307/regenerate` | admin | Manual 2307 regen |
| `/api/internal/patiktok/process-job` | `INTERNAL_WORKER_SECRET` | Patiktok render worker hook |
| `/api/webhooks/persona` | signature | Vendor KYC webhook |
| `/api/webhooks/veriff` | signature | Vendor KYC webhook (alt) |

### Auth / sign-out routes (4)

`/auth/callback`, `/auth/sign-out`, `/[slug]/redeem`, `/[slug]/sign-out` (guest)

### Liveness

`/health` (200 + `{ok: true, ts}`)

---

## Pass 5 — Server actions & lib modules

### Lib modules (`apps/web/lib/`) — 73 files + `bir/` + `i18n/` + `supabase/` + `supplies/` subfolders

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
| `activity.ts`, `add-on-state.ts`, `add-on-stats.ts`, `analytics.ts` | Activity feed + add-on visibility + telemetry helpers |
| `auth.ts`, `blacklist.ts` | Auth helpers + email blacklist (account-lifecycle redesign) |
| `concierge.ts` | Setnayan Concierge — single-SKU ₱4,999, wedding-anchored access |
| `contracts.ts` | Vendor↔couple dual e-signature flow (replaces retired 0032 AI analysis) |
| `day-of-mode.ts` | T-3d → T+1d auto-activation banner + 6 cards (0036) |
| `encryption.ts` | AES-256-GCM token encryption (PR #152) — uses `ENCRYPTION_KEY` |
| `event-bundle-keys.ts`, `event-preload.ts` | Event pre-load + cache keys (PR #14) |
| `follow.ts`, `follow-actions.ts` | Couple-must-follow-vendor gate before chat open (PR 0019 follow gate) |
| `force-majeure.ts` | Admin queue + couple-side disputes |
| `led-background.ts` | 0005 LED background configs + render queue |
| `panood-youtube.ts`, `papic-drive.ts`, `patiktok-tiktok.ts`, `patiktok.ts` | OAuth + provider integrations for 0011/0012/0017 |
| `payouts.ts`, `vendor-earnings.ts` | Vendor payout schedules + withholding + earnings rollup |
| `photo-delivery-drive.ts` | 0009 Photo Delivery — Google Drive OAuth + token storage |
| `query-client.ts`, `use-tracked-mutation.ts` | TanStack Query setup + tracked-mutation wrapper |
| `r2.ts`, `uploads.ts` | R2 client + signed-URL helpers (PR #18) |
| `reviews.ts`, `self-review-gate.ts` | Vendor + feature reviews; self-review hard-gate |
| `roles.ts`, `self-purchase.ts` | Dual-role pattern enforcement + self-purchase confirm |
| `site-widgets.ts` | Admin-editable marketing widgets (`/admin/website`) |
| `sku-catalog.ts` | service_catalog typed accessors |
| `tours.ts`, `tour-actions.ts` | Per-surface guided tours (0030, PR #138) |
| `vendor-ads.ts` | Vendor ads/marketing subscriptions |
| `vendor-invites.ts`, `vendor-invite-actions.ts` | Couple-initiated invite for off-platform vendors (PR #137) |
| `vendor-services.ts`, `vendor-team.ts`, `vendor-verification.ts`, `vendor-visibility.ts` | Vendor dashboard expansion (PR #25) |
| `bir/` subfolder | BIR 2307 quarterly filings + OR receipt generation |
| `i18n/` subfolder | Hand-rolled EN/TL locale (no `next-intl` dep) |
| `supplies/` subfolder | 0018 Supplies — vendors, SKUs, pricing resolver, orders |

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
| **Supabase** (Postgres + Auth + Storage + Realtime) | ✅ Live | `lib/supabase/{admin,client,server,middleware}.ts`, 76 migrations | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| **Vercel** (Hosting + Vercel Analytics) | ✅ Live | `setnayan.com` + `setnayan-platform-web.vercel.app` | Vercel project env |
| **Cloudflare R2** (4 PH-region buckets) | ✅ Wired 2026-05-14 (PR #18) | `lib/r2.ts` + `lib/uploads.ts` + `@aws-sdk/client-s3` | `R2_*` |
| **Resend** (transactional email) | ✅ Wired (9 of 10 V1 templates) | `lib/email.ts` wrapper; V1 soft-launch auto-confirms so signup non-blocking | `RESEND_API_KEY`, `RESEND_FROM_ADDRESS` |
| ~~**Daily.co** (video meetings 0019)~~ | ❌ RETIRED 2026-05-16 (feature removed entirely from V1+) | — | — |
| ~~**Anthropic Claude API** (0032)~~ | ❌ NOT V1 — 0032 RETIRED 2026-05-18 (free dual e-sign replaces AI analysis); Anthropic still queued for 0011/0012 V1.5+ highlights only | none | `ANTHROPIC_API_KEY` (reserved for V1.5+) |
| **Sentry** (error tracking 0035) | ✅ SDK wired 2026-05-14 (PR #17); 🟡 production smoke test still pending | `@sentry/nextjs ^8.0.0` | `SENTRY_DSN`, `SENTRY_AUTH_TOKEN` |
| **PostHog** (product analytics 0035) | ✅ Wired 2026-05-14 (PR #19); 3 server-side funnels live + 4 PostHog funnel links at `/admin/funnels` | `posthog-js ^1.165.0` | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` |
| **Better Stack** (uptime + log) | 🚧 Queued | none | `BETTER_STACK_SOURCE_TOKEN` |
| **GitHub Releases** | ✅ Live | v0.0.1 with macOS `.dmg`; `/download` consumes via `lib/desktop-release.ts` | none |
| **YouTube Data API v3 + OAuth** (0011 Panood live-stream relay) | 🟡 Engineering shipped 2026-05-16; Google verified-app review pending (Phase 2 of #17a) | `lib/panood-youtube.ts` + 3 OAuth routes + cron refresh | `YOUTUBE_OAUTH_CLIENT_ID/_SECRET/_REDIRECT_URI` |
| **Google Drive OAuth** (0012 Papic + 0009 Photo Delivery) | 🟡 Code shipped 2026-05-19/20; Google verified-app NOT yet submitted for Drive scopes | `lib/papic-drive.ts`, `lib/photo-delivery-drive.ts` + 5 OAuth routes | `GOOGLE_DRIVE_OAUTH_*`, `PHOTO_DELIVERY_OAUTH_REDIRECT_URI` |
| **TikTok OAuth** (0017 Patiktok) | 🟡 Code shipped 2026-05-16; TikTok app review pending | `lib/patiktok-tiktok.ts` + 2 routes | `TIKTOK_CLIENT_KEY/_SECRET/_REDIRECT_URI/_SETNAYAN_REFRESH_TOKEN` |
| **Persona** (vendor KYC) | 🟡 Webhook + env wired; owner signup pending #19b | `app/api/webhooks/persona/route.ts`, `lib/vendor-verification.ts` | `PERSONA_API_KEY`, `PERSONA_TEMPLATE_ID` |
| **Veriff** (vendor KYC alt) | 🟡 Webhook wired as alt provider | `app/api/webhooks/veriff/route.ts` | — |
| **AMLC sanctions** (vendor PEP screening) | 🟡 Env wired; owner signup pending #19c | none yet | `AMLC_API_KEY` |
| **Maya Business** (payment gateway) | 🟡 Env wired (was V1.5+, now reserved); merchant application pending #20a | none yet | `MAYA_BUSINESS_API_KEY/_QR_ENABLED/_REGION` |
| **Cloudflare Workers / Queues / Stream Live** (0011 / 0012 render) | 🚧 V1.5+ deferred | none | — |
| **Suno Premier** (music catalog generation) | 🚧 Owner manual workstream | none | — |
| **Canon / Nikon / Sony / Fujifilm SDKs** (0012 DSLR bridge V1.5+) | 🚧 Approval waits | none | — |
| **Apple Developer Program / Google Play Console** (Papic native + macOS signing) | 🚧 V1.5+ owner enrollment | none | — |
| **Hetzner Cloud** (render fallback VM pool V1.5+) | 🚧 Queued | none | — |
| **Mapbox or Google Maps** (venue pin) | 🚧 Queued | none | — |
| ~~**PandaDoc / DocuSign**~~ | ❌ NOT V1+ — replaced by in-house dual e-sign (migration 61, 2026-05-18) | — | — |
| **GCash Merchant API / PayMongo** | 🚧 V1.5+ alternates under Maya Business primary | manual reconciliation in V1 | — |

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

- `R2_ACCOUNT_ID` ✅ wired
- `R2_ACCESS_KEY_ID` ✅
- `R2_SECRET_ACCESS_KEY` ✅
- `R2_BUCKET_MEDIA=setnayan-media` ✅
- `R2_BUCKET_THREAD_FILES=setnayan-thread-files` ✅
- `R2_BUCKET_VENDOR_CONTRACTS=setnayan-vendor-contracts` ✅
- `R2_BUCKET_SAMPLES=setnayan-samples` ✅
- `R2_BUCKET_VENDOR_VERIFICATION=setnayan-vendor-verification` ✅ (added 2026-05-16 — 12-doc KYC docs)
- `R2_BUCKET_BIR_2307=setnayan-bir-2307` ✅ (added 2026-05-16 — quarterly filings)
- `R2_PUBLIC_URL` ✅

### ~~Daily.co~~ — RETIRED 2026-05-16 (no env needed)

### Resend

- `RESEND_API_KEY` ✅ wired (9 of 10 V1 templates; V1 auto-confirms signup so non-blocking)
- `RESEND_FROM_ADDRESS=hello@setnayan.com` ✅

### Anthropic (V1.5+ only — 0032 retired 2026-05-18, no longer a V1 dep)

- `ANTHROPIC_API_KEY` 🚧 (reserved for V1.5+ 0011/0012 AI highlights; NOT needed for V1)
- `ANTHROPIC_PRIMARY_MODEL=claude-sonnet-4-6`
- `ANTHROPIC_BUDGET_MODEL=claude-haiku-4-5`
- `ANTHROPIC_SPEND_CAP_MONTHLY_USD=2000`, `_ALERT_MONTHLY_USD=500`, `_ALERT_DAILY_USD=100`

### Observability

- `SENTRY_DSN` ✅ SDK wired (smoke test pending #19e)
- `SENTRY_AUTH_TOKEN` ✅
- `NEXT_PUBLIC_POSTHOG_KEY` ✅ wired (3 funnels live)
- `NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com` ✅
- `BETTER_STACK_SOURCE_TOKEN` 🚧

### OAuth integrations (added 2026-05-16 → 2026-05-20)

- `YOUTUBE_OAUTH_CLIENT_ID/_SECRET/_REDIRECT_URI` 🟡 code shipped, Google verified-app review pending
- `GOOGLE_DRIVE_OAUTH_CLIENT_ID/_SECRET/_REDIRECT_URI` 🟡 code shipped, Drive scopes pending Google review
- `PHOTO_DELIVERY_OAUTH_REDIRECT_URI` 🟡 0009 redirect URI
- `TIKTOK_CLIENT_KEY/_SECRET/_REDIRECT_URI/_SETNAYAN_REFRESH_TOKEN` 🟡 code shipped, TikTok app review pending

### Vendor verification + payments

- `PERSONA_API_KEY`, `PERSONA_TEMPLATE_ID` 🟡 webhook wired, owner signup pending (#19b)
- `AMLC_API_KEY` 🟡 env wired, owner signup pending (#19c)
- `MAYA_BUSINESS_API_KEY`, `MAYA_BUSINESS_QR_ENABLED=true`, `MAYA_BUSINESS_REGION=ph` 🟡 env wired, merchant application pending (#20a)

### Crypto + worker secrets (must generate before deploy)

- `ENCRYPTION_KEY` 🔴 AES-256-GCM key for OAuth-token encryption (PR #152) — generate with `openssl rand -base64 32`
- `CRON_SECRET` 🔴 protects `/api/admin/cron/*` — generate
- `OAUTH_REFRESH_CRON_SECRET` 🔴 protects `/api/cron/oauth-refresh` — generate
- `INTERNAL_WORKER_SECRET` 🔴 protects `/api/internal/patiktok/process-job` — generate

### App-level

- `NEXT_PUBLIC_APP_URL=http://localhost:3000` ✅ (prod overrides to `https://setnayan.com`)
- `NEXT_PUBLIC_PILOT_MODE_FREE_UNTIL` 🟡 set to launch-promo date (March 2027) to enable banner
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

## What's NOT installed (visible-gap section — re-audited 2026-05-20)

The full inventory of things that are *expected* by specs but *not* in code today. Re-audited 2026-05-20 after the 2026-05-14 → 2026-05-20 burst (51 migrations + 130+ PRs). Many items previously listed are now ✅ shipped (struck through below). Net count drops from 80 → ~50. Grouped below; complete install sequence with phasing at [Install_Sequence_V1.md](02_Specifications/Install_Sequence_V1.md).

**Major shipped since 2026-05-14 (strike-through):** Sentry, PostHog, R2 client + uploads, TanStack Query + persisters, pdf-lib, vendor verification webhook scaffolding, Persona/AMLC env reservation, Maya Business env reservation, YouTube/Drive/TikTok OAuth code, Photo Delivery (0009), LED Background (0005), Supplies (0018), Concierge wizard (0016), multi-moderator V1.2 foundation (0048), per-surface guided tours, vendor invite/claim flow.

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

### Observability (mostly shipped)

11. ~~**Sentry account** + `SENTRY_DSN` + `SENTRY_AUTH_TOKEN`~~ — ✅ SDK shipped 2026-05-14 (PR #17); 🔴 production smoke test still pending (#19e)
12. ~~**PostHog account** + `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST`~~ — ✅ shipped 2026-05-14 (PR #19); 3 server-side funnels live
13. **Better Stack account** + uptime monitor + log drain destination — 🚧 still queued
14. ~~**`@sentry/nextjs`** npm install~~ — ✅ shipped
15. ~~**`posthog-js`** npm install~~ — ✅ shipped
16. **`/api/health/deep` endpoint** (DB + R2 + Resend pings) — 🚧 still queued

### Caching & offline foundation (mostly shipped)

17. ~~**`@tanstack/react-query`** + **`@tanstack/query-sync-storage-persister`**~~ — ✅ shipped 2026-05-14 (PR #10); also `@tanstack/react-query-persist-client` + `idb-keyval`
18. **`workbox-window`** + **`workbox-precaching`** (extend existing `sw.js`) — 🚧 still queued; basic `sw.js` shipped
19. ~~**`useTrackedMutation`** wrapper at `lib/use-tracked-mutation.ts`~~ — ✅ shipped (`lib/use-tracked-mutation.ts`, `lib/query-client.ts`)
20. ESLint rule **`setnayan/no-raw-mutation`** — 🚧 still queued
21. **`NEXT_PUBLIC_CACHE_BUSTER`** env + CI schema-bump enforcement — 🚧 still queued

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

31. ~~**`pdf-lib`**~~ — ✅ shipped 2026-05-19 (BIR 2307 + OR generation)
32. **`sharp`** — server-side image processing — 🚧 still queued

### Render pipeline (Phase 7 — V1.5+ deferred)

33. ~~**Anthropic Console account** + `ANTHROPIC_API_KEY`~~ — V1 dep was 0032 (retired 2026-05-18). Now only required for V1.5+ 0011/0012 AI highlights. Owner signup deferred until V1.5+ render pipeline starts.
34. **`@anthropic-ai/sdk`** npm install — still queued for V1.5+
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

51. **Vercel Pro plan upgrade** ($20/mo) — currently Hobby; unlocks Cron + Log Drains — 🚧 still queued
52. **Vercel Log Drains** → Better Stack — 🚧 still queued
53. **Cron infrastructure** — see [Setnayan cron strategy memory](../../.claude/projects/-Users-icecasasola/memory/reference_setnayan_cron_strategy.md) — LOCKED 2026-05-14: no new cron triggers, use DB-state + on-access sweeps. Two grandfathered pg_cron jobs at `/api/admin/cron/dispute-counter` + `/api/admin/cron/generate-2307`. Plus `OAUTH_REFRESH_CRON_SECRET`-gated `/api/cron/oauth-refresh`. Vercel Cron may not be needed.
54. **Vercel KV** or **Upstash Redis** — rate-limit layer for 0033 API tiers — 🚧 still queued
55. **Cloudflare Email Routing** activation on `setnayan.com` — 🚧 still queued
56. **Cloudflare WAF rules** — basic edge protection (Phase 9) — 🚧 still queued
57. **Cloudflare Turnstile** (or hCaptcha) — bot protection on signup/login/register-vendor/redeem — 🚧 still queued
58. ~~**R2 client** — `@aws-sdk/client-s3` + `lib/r2.ts`~~ — ✅ shipped 2026-05-14 (PR #18)
59. ~~**R2 upload path swap**~~ — ✅ shipped 2026-05-14 (PR #18); uploads now route through `lib/uploads.ts`
60. **`developers.setnayan.com`** subdomain → static placeholder page — 🚧 still queued
61. **OAuth + PKCE plumbing** — partial: per-couple OAuth grants table shipped (migration 54); full `oauth_clients` + 16-scope registry still queued for V1.5+
62. **Supabase Pro plan upgrade** (~$25/mo) — when approaching free-tier limits — 🚧 still queued

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

### Newly surfaced 2026-05-20 (post-2026-05-14 burst)

86. 🔴 **`ENCRYPTION_KEY`** — generate AES-256-GCM secret for OAuth-token encryption (PR #152 `lib/encryption.ts`). Command: `openssl rand -base64 32` → paste into Vercel env. Without it, OAuth flows for YouTube/Drive/TikTok will fail decrypt.
87. 🔴 **`CRON_SECRET`** — generate, paste into Vercel. Without it, `/api/admin/cron/dispute-counter` + `/api/admin/cron/generate-2307` return 401.
88. 🔴 **`OAUTH_REFRESH_CRON_SECRET`** — generate, paste into Vercel. Without it, `/api/cron/oauth-refresh` returns 401 → OAuth tokens expire silently.
89. 🔴 **`INTERNAL_WORKER_SECRET`** — generate, paste into Vercel. Without it, `/api/internal/patiktok/process-job` returns 401.
90. 🟡 **`NEXT_PUBLIC_PILOT_MODE_FREE_UNTIL`** — set to `2027-03-31` (or whichever date matches the locked launch promo) to render the free-until banner.
91. 🟡 **Google Drive OAuth verified-app submission for Drive scopes** — Phase 1 done for YouTube scopes; Drive scopes for 0009 + 0012 still need their own Google review submission (parallel process, same ~3-6 weeks SLA).
92. 🟡 **Persona owner signup** — env wired, webhook live; just needs account creation + template ID (#19b).
93. 🟡 **AMLC owner signup** — env wired, no code wiring yet; needs subscription + integration (#19c).
94. 🟡 **Maya Business merchant signup** — env reserved; merchant application + sandbox + production credential flow still pending (#20a).
95. 🟡 **Production Sentry smoke test** — SDK wired; just need to throw a controlled error and confirm capture + alerting routing (#19e).

---

**Count summary (2026-05-20 re-audit):** ~50 net install-surface items (down from 80) + 5 contract documentation items. See [Install_Sequence_V1.md](02_Specifications/Install_Sequence_V1.md) for the 10-phase install plan; see [API_Integration_Checklist.md § Tier 8](API_Integration_Checklist.md) for the per-tier breakdown.

**Previously listed:** 10 items (pre-2026-05-14 audit)
**Surfaced 2026-05-14 audit:** 70+ items
**Shipped 2026-05-14 → 2026-05-20:** ~30 items struck through above
**Newly surfaced 2026-05-20:** items 86-95
**Critical-path-for-launch:** items 86-89 (crypto secrets — same-day owner action), 91 (Drive OAuth review — parallel to YouTube), 95 (Sentry smoke test), plus Phase 1 of [OWNER_ACTIONS.md](https://github.com/iscasasola/setnayan-platform/blob/main/OWNER_ACTIONS.md) (BIR/bank info entry in `/admin/settings`)

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
