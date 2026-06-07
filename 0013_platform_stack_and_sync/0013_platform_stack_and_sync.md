# Iteration 0013 — Platform Stack & Sync Setup

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - **Stack confirmed:** Next.js `apps/web` on Vercel + Supabase (Singapore) + Cloudflare R2 + GitHub are all live and wired, plus Resend email (`lib/email.ts`), R2 helpers (`lib/r2.ts`), and YouTube/Panood (`lib/panood-youtube.ts`). Auth + RLS + realtime are real.
> - **Native is NOT the Swift/Kotlin/Tauri skeletons in Steps B5–B7.** The shipped native shell is a single **Capacitor remote-URL WebView** (`apps/mobile`, Android built, iOS pending Xcode) that loads the hosted server-rendered site — there is no separate `ios/`, `android/`, or `desktop-macos/` Tauri tree. The macOS Tauri desktop wrapper is likewise not the current path.
> - **Service-catalog seed (Step B9 / Test C6) is superseded.** SKUs live in `lib/sku-catalog.ts` (apply-then-pay 0034 model), NOT a token-pack-seeded `service_catalog`. The C6 expected rows (`panood_base` etc.) are stale; the live SKU set + prices = the ground-truth catalog. Customer token wallet (0003) is RETIRED.
> - **Payment (Step A7 / Setnayan Pay):** apply-then-pay with **manual admin approval** is correct, but vendor↔customer money is **OFF-PLATFORM (0% commission)** — Setnayan never charges or holds it. No automated gateway, no card charge anywhere in V1.
> - **Domain:** production is `setnayan.com` (the historical "" / pre-rename references are dead).
>
> When this body disagrees with the above, **the above wins.**

> **Refresh banner — 2026-05-12.** Three updates since the 2026-05-09 draft: (1) **Token wallet retired.** All references to `20260509_003_token_wallet.sql` and `service_catalog` seeding through token packs are superseded by iteration 0034's payment + cart schema (`20260512_034_payments_and_cart.sql`). (2) **PayMongo removed from V1.** Setnayan V1 ships with **Setnayan Pay (manual reconciliation per 0034)** — no automated payment gateway. PayMongo evaluation is V1.5 scope only; the Step A7 PayMongo account-creation step is downgraded to optional / future-evaluation. (3) **Brand rename.** All `setnayan.com` URLs in this doc resolve to `setnayan.com` for the active V1 build; the historical `setnayan.com` references are preserved where they describe the pre-rename codebase or migration trail, but the production domain is `setnayan.com`.
>
> **Native strategy locked 2026-05-12.** V1 web is React via Vercel + Next.js. V1 native (Papic capture binary, Panood operator binary) uses native SwiftUI iOS + Jetpack Compose Android per the 2026-05-09 CLAUDE.md decision. The reference to React Native / Expo that appears in `CLAUDE_Code_Build_Prompt.md` is **future-evaluation scope only — not V1**. The native skeletons in Steps B5 + B6 below are native (Swift / Kotlin), not Expo. macOS desktop is a Tauri wrapper around the web build (Step B7).

**Iteration number:** 0013
**Topic:** Foundation infrastructure — Vercel + Supabase + Cloudflare R2 + GitHub. Account creation, credentials wiring, multi-platform sync, integration testing.
**Surface:** No user-facing UI of its own. This iteration sets up the platform every other iteration runs on.
**Build order:** **SPRINT ZERO — must ship before 0000 even though it's numbered 0013.** The number is for ledger organization; the build order is "this comes first."
**Status:** Drafted 2026-05-09 · Refreshed 2026-05-12 (banner above)
**Companion specs:** every iteration 0000–0012 (this one is the foundation they all run on), plus 0034 (payment + cart spine).

---

## What this iteration delivers

A working Setnayan platform you can deploy, sign in to, and verify works end-to-end across web, iOS, Android, and macOS — before any single feature iteration is built on top of it.

In plain language, three deliverables:

1. **All your accounts are created** — Vercel, Supabase, Cloudflare, GitHub, Apple Developer, Google Play Console, YouTube, BDO business + GCash for Business (Setnayan Pay V1), Anthropic, etc. All API keys and credentials in hand. (PayMongo + Stripe deferred to V1.5.)
2. **The codebase skeleton runs** — `npm run dev` boots a Next.js app, signs you into Supabase, lets you create a test event, and the data appears in your Supabase dashboard.
3. **Sync works across platforms** — change something on your iPhone, see it on your laptop within 2 seconds. Sign in once, see your data everywhere.

Once 0013 is done, 0000 (the app shell) plugs into this foundation. Then 0001–0012 layer on as feature iterations.

---

## How this document is organized

Three sections, in the order you'll go through them:

- **Section A — User Setup Checklist.** Step-by-step. Every account, credential, and configuration that **you, the user**, must obtain. Claude Code can't sign up for accounts on your behalf.
- **Section B — Claude Code Implementation Guide.** What **Claude Code** builds once you've completed Section A. Project skeleton, schemas, integrations, deployment configs.
- **Section C — Integration Tests.** What **both of us together** verify works after the build. Testing checklists for sync, auth, deployment, and cross-platform consistency.

Read Section A first, do all the steps. Hand off the credentials to Claude Code. Claude Code then runs Section B. Together you both verify Section C.

---

# Section A — User Setup Checklist

These are the things only you can do. Each step ends with a credential or config you'll provide to Claude Code via a `.env.local` file or the Vercel/Supabase dashboard secrets.

## Step A1 — Domain (15 min)

Before anything else: own the domain.

1. Go to a domain registrar (Namecheap, Google Domains, Cloudflare Registrar — Cloudflare's the cheapest with no markup).
2. Buy `setnayan.com` (target V1 domain) and / or `setnayan.ph`. Cost: ~₱500–₱1,500/year. The historical `setnayan.com` domain is kept on file for the "" footer redirect period (90 days post-launch).
3. Note the domain control panel login.

**You'll provide Claude Code:** the domain name (e.g., `setnayan.com`).

## Step A2 — GitHub repository (10 min)

1. Sign in to https://github.com (or sign up if you don't have an account).
2. Create a new repository called `setnayan` (private).
3. Don't initialize with a README — Claude Code will scaffold the project.
4. Note the repo URL (e.g., `git@github.com:yourname/setnayan.git`).
5. Generate a Personal Access Token with `repo` scope at https://github.com/settings/tokens. This is for CI integrations.

**You'll provide Claude Code:**
- Repo URL
- Personal Access Token (kept in 1Password / secure note; pasted into Vercel + Supabase dashboards later)

## Step A3 — Vercel account (15 min)

1. Sign up at https://vercel.com — sign in with GitHub for cleanest integration.
2. Add a payment method (Pro plan is $20/month per member; Hobby plan is free for personal projects but limits production traffic — Setnayan will need Pro within weeks of launch).
3. From the dashboard, click "Add New… → Project" and import the GitHub repo from Step A2.
4. Don't deploy yet — just connect.
5. From your Vercel team's "Settings → Domains," prepare to add `setnayan.com` later (Step A12).
6. Generate a Vercel API token at https://vercel.com/account/tokens for any CLI/CI usage.

**You'll provide Claude Code:**
- Vercel project name
- Vercel team slug (your team name)
- Vercel API token

## Step A4 — Supabase project (20 min)

1. Sign up at https://supabase.com.
2. Create a new project. Name it `setnayan-prod`. Pick a region close to the Philippines (Singapore `ap-southeast-1` is the closest).
3. Set a strong database password — save it in 1Password.
4. Wait ~2 minutes for the project to provision.
5. From the project dashboard, go to "Project Settings → API" and copy:
   - **Project URL** (e.g., `https://abcdefg.supabase.co`)
   - **anon public key** — safe to expose in client code
   - **service_role key** — server-only, NEVER expose to client. Treat as the most sensitive credential.
6. Go to "Project Settings → Database → Connection string" and copy the direct PostgreSQL connection string for migrations.
7. Go to "Authentication → Providers." Enable:
   - Email (magic-link + password) — already on by default
   - Google OAuth (optional, recommended for quick sign-in — requires Google Cloud OAuth credentials, ~10 min extra setup)
   - Apple OAuth (optional, recommended for iOS — requires Apple Developer Sign in with Apple, ~15 min extra setup)
8. Add a payment method. Free tier covers up to 500MB database + 1GB storage; Pro is $25/month and you'll likely need it within a month.
9. Connect Supabase to GitHub for migration auto-apply — go to "Database → Migrations" and connect the GitHub repo. (Optional; can be done later via CLI.)

**You'll provide Claude Code:**
- Project URL
- anon public key
- service_role key (kept in 1Password; pasted into Vercel env vars and the local `.env.local`)
- Database connection string

## Step A5 — Cloudflare account + R2 bucket (20 min)

1. Sign up at https://cloudflare.com (or use existing).
2. Add the domain from Step A1 to Cloudflare. Cloudflare gives you nameservers; go back to your domain registrar and update them. Wait for propagation (15 min – 24 hr).
3. From the Cloudflare dashboard, go to "R2 → Create bucket." Create three buckets:
   - `setnayan-media` (production photos, videos, broadcast archives, LED renders)
   - `setnayan-staging-media` (for non-production environments)
   - `setnayan-vendor-contracts` (separated for vendor contract documents)
4. For each bucket, generate an R2 API token at "R2 → Manage R2 API Tokens." Give it Object Read & Write scope on the buckets. Save the:
   - **Access Key ID**
   - **Secret Access Key**
   - **Account ID** (top-right of Cloudflare dashboard)
   - **Endpoint** (per-account, looks like `https://<account-id>.r2.cloudflarestorage.com`)
5. Add a custom domain to one of the buckets so it serves at `media.setnayan.com` (or similar). This gets you free CDN egress.

**You'll provide Claude Code:**
- R2 Access Key ID
- R2 Secret Access Key
- R2 Account ID
- R2 Endpoint URL
- Bucket names (`setnayan-media`, etc.)
- Custom domain (e.g., `media.setnayan.com`)

## Step A6 — YouTube master channel (30 min)

For Panood delivery (locked memory: YouTube is the sole viewer-delivery surface).

1. Go to https://youtube.com and sign in with a Google account dedicated to Setnayan (don't reuse personal). Create the account if needed.
2. Create a new channel: "Setnayan Weddings" (or your preferred brand name). This is Setnayan's master broadcast channel.
3. Verify the channel via SMS (required for live streaming + 24-hr-or-longer videos).
4. Critically: **DO NOT enroll the channel in YouTube Partner Program (YPP)**. The channel must stay non-monetized. Enrolling it would risk ads on couples' wedding broadcasts.
5. Go to https://console.cloud.google.com — create a Google Cloud project named `setnayan-prod`.
6. Enable the **YouTube Data API v3** in the project's API library.
7. Create OAuth credentials:
   - Application type: Web application
   - Authorized redirect URIs: `https://setnayan.com/api/oauth/youtube/callback` (and a localhost variant for dev)
   - Save the **Client ID** and **Client Secret**.
8. Use the OAuth consent flow to grant Setnayan's prod backend access to the YouTube channel (one-time; the refresh token gets stored in Supabase as a Setnayan-side credential).

**You'll provide Claude Code:**
- YouTube channel ID (`@SetnayanWeddings` or whatever)
- Google OAuth Client ID + Client Secret
- The first OAuth-flow refresh token (Claude Code will help you complete the flow once)

## Step A7 — Setnayan Pay (manual reconciliation per 0034) — receiving accounts (1–3 days)

V1 ships **without an automated payment gateway**. Setnayan Pay is the manual reconciliation flow defined in iteration 0034: customer checks out → app displays Setnayan-owned BDO + GCash QR codes → customer pays externally → uploads screenshot → admin verifies and approves. PayMongo evaluation is deferred to V1.5; this step is left as a placeholder so the future automation can drop in without restructuring the integration layer.

1. **Open Setnayan's BDO business checking account** (1–3 days). DTI/SEC registration, business permit, government IDs of authorized signatories. Get the account number + bank QR code (BDO Mobile app → "My QR"). Save the QR PNG.
2. **Open Setnayan's GCash for Business account** (1 day). Submit DTI cert + government ID via the GCash for Business onboarding portal. Get the GCash QR (download from the merchant dashboard). Save the QR PNG.
3. **Upload both QRs to admin console** (per 0023 § 3.5c Payment Methods Upload) so they appear on the customer-facing payment screen described in 0034 § 3.4.
4. **(Deferred — V1.5)** PayMongo or GCash Merchant API integration for automated reconciliation. Until then, the Transactions Handler admin role per § 9.1 reviews payment-proof screenshots manually within the 24-hr SLA.

**You'll provide Claude Code:**
- BDO business account number + QR PNG file path
- GCash business mobile number + QR PNG file path
- (Later, V1.5) PayMongo test + live keys when automation is greenlit

## Step A8 — Stripe account (international payments, 30 min – 1 day) — DEFERRED to V1.5

International card payments are V1.5 scope. V1 ships PH-only (Setnayan Pay manual reconciliation per 0034). The original Stripe step is preserved below for V1.5 prep.

1. Sign up at https://stripe.com.
2. Submit business verification.
3. From "Developers → API keys," save:
   - **Test publishable key**
   - **Test secret key**
   - **Live publishable key** (after approval)
   - **Live secret key**
4. Set up webhook endpoint at `https://setnayan.com/api/webhooks/stripe`. Save the signing secret.

**You'll provide Claude Code:**
- Stripe Test publishable key + secret key
- Stripe Live publishable key + secret key (later)
- Stripe webhook signing secret

## Step A9 — Anthropic API account (Claude API for AI features, 10 min)

For AI Video Highlight + AI Edited Highlight rendering.

1. Sign up at https://console.anthropic.com.
2. Add a payment method.
3. Go to "API Keys" and create a key for Setnayan prod.

**You'll provide Claude Code:** Anthropic API key.

## Step A10 — Apple Developer Program (iOS + macOS, $99/year, 1–3 days)

Required for shipping the iOS Papic app and the macOS desktop app.

1. Sign up at https://developer.apple.com — uses your Apple ID.
2. Pay the $99/year fee.
3. Apple takes 1–3 days to approve. While waiting, Claude Code can build the iOS skeleton in simulator-only mode.
4. After approval:
   - Go to "Certificates, Identifiers & Profiles."
   - Create an App ID for `app.setnayan.ios` (your bundle identifier).
   - Create another App ID for `app.setnayan.macos`.
   - Generate a development certificate and a distribution certificate.
   - Generate provisioning profiles for both bundle IDs.
5. Set up App Store Connect at https://appstoreconnect.apple.com — create the app records for iOS and macOS so submission is unblocked when the apps are ready.
6. For push notifications later: generate APNs keys (under "Keys" → APNs).

**You'll provide Claude Code:**
- Apple Team ID
- iOS bundle identifier (`app.setnayan.ios`)
- macOS bundle identifier (`app.setnayan.macos`)
- Distribution certificate + provisioning profiles (kept in Apple's keychain or 1Password — Claude Code references them for build configs)

## Step A11 — Google Play Console (Android, $25 one-time, 1–2 days)

1. Sign up at https://play.google.com/console.
2. Pay the $25 one-time registration.
3. Google takes 1–2 days to approve.
4. After approval, create a new app: `Setnayan`.
5. Generate an upload key (Android signing key) and store it securely.
6. Set up Google Play Billing if you'll process in-app purchases through Android (optional — Setnayan V1 currently uses Setnayan Pay manual reconciliation per 0034; in-app billing is V1.5 scope).

**You'll provide Claude Code:**
- Android package name (`app.setnayan.android`)
- Upload key keystore + password
- Service account JSON for Play Console API (for CI auto-deploy)

## Step A12 — Domain DNS (after Steps A2–A5 done, 30 min)

1. Once Vercel project + Supabase + Cloudflare R2 are set up, point DNS records.
2. In Cloudflare DNS:
   - `A` record `setnayan.com` → Vercel's IP (Vercel's dashboard shows you what to point to)
   - `CNAME` record `www.setnayan.com` → `setnayan.com`
   - `CNAME` record `media.setnayan.com` → R2 custom domain
   - SPF / DKIM records for transactional email (set up via Resend or Postmark — Claude Code will tell you which)
3. Verify the domain in Vercel ("Settings → Domains → Add").
4. Enable HTTPS (automatic via Vercel + Cloudflare).

**You'll provide Claude Code:** confirmation that DNS is propagated and `https://setnayan.com` resolves to the Vercel deployment.

## Step A13 — Transactional email (Resend recommended, 15 min)

Supabase Auth needs a sender for magic-link emails.

1. Sign up at https://resend.com.
2. Verify a sending domain (e.g., `mail.setnayan.com`). Resend gives you DNS records; add them to Cloudflare DNS.
3. Generate an API key.
4. In Supabase dashboard, go to "Authentication → Email Templates → SMTP Settings." Enter Resend SMTP credentials.

**You'll provide Claude Code:** Resend API key + verified sender address (`hello@mail.setnayan.com`).

## Step A14 — Sentry account (error tracking, optional but recommended, 10 min)

1. Sign up at https://sentry.io.
2. Create projects for: web (Next.js), iOS (Apple), Android (Google).
3. Save the DSN (Data Source Name) for each project.

**You'll provide Claude Code:** three Sentry DSNs (one per platform).

## Step A15 — Suno account (music catalogue, per playbook 14, 30 min)

For Personal Reels music catalogue.

1. Sign up at https://suno.com.
2. Subscribe to Suno Premier (~$30/month) — generates owned-AI music.
3. Generate the ~400-track catalogue per playbook 14's instructions (this is content workstream work, can run in parallel with platform setup).

**You'll provide Claude Code:** Suno-generated MP3 files uploaded to R2's `setnayan-media/music_catalogue/` per the playbook's directory convention.

## Step A16 — Final credential summary

By the end of Section A, you should have a `.env.local` skeleton ready to hand to Claude Code. Roughly:

```
# Domain
NEXT_PUBLIC_SITE_URL=https://setnayan.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...
DATABASE_URL=postgres://...

# Cloudflare R2
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_ACCOUNT_ID=...
R2_ENDPOINT=https://...r2.cloudflarestorage.com
R2_BUCKET_MEDIA=setnayan-media
R2_BUCKET_VENDOR_CONTRACTS=setnayan-vendor-contracts
R2_PUBLIC_URL=https://media.setnayan.com

# YouTube
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
YOUTUBE_CHANNEL_ID=...
YOUTUBE_REFRESH_TOKEN=...

# Setnayan Pay (V1 — manual reconciliation per 0034). No automated gateway.
# Receiving-account QR file paths are uploaded via admin console (0023 § 3.5c), not env vars.
# PayMongo and Stripe keys are V1.5 prep only — not used by V1 code paths.
# PAYMONGO_SECRET_KEY=sk_test_...           # V1.5 — automated reconciliation
# PAYMONGO_WEBHOOK_SECRET=...               # V1.5
# STRIPE_SECRET_KEY=sk_test_...             # V1.5 — international card payments
# STRIPE_PUBLISHABLE_KEY=pk_test_...        # V1.5
# STRIPE_WEBHOOK_SECRET=...                 # V1.5

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Resend (transactional email)
RESEND_API_KEY=re_...
RESEND_FROM_ADDRESS=hello@mail.setnayan.com

# Sentry
SENTRY_DSN_WEB=https://...@sentry.io/...
SENTRY_DSN_IOS=https://...@sentry.io/...
SENTRY_DSN_ANDROID=https://...@sentry.io/...

# Apple (for iOS/macOS builds — kept in Xcode keychain, referenced in build configs)
APPLE_TEAM_ID=...
IOS_BUNDLE_ID=app.setnayan.ios
MACOS_BUNDLE_ID=app.setnayan.macos

# Google Play (for Android builds — kept in keystore, referenced in build.gradle)
ANDROID_PACKAGE=app.setnayan.android
```

Hand this `.env.local` to Claude Code (paste in chat with secrets redacted, OR drop the file in the project repo's root which is git-ignored). The same values get configured in Vercel's dashboard for production.

---

# Section B — Claude Code Implementation Guide

What Claude Code does once you've completed Section A. Each step is something Claude Code executes; you only review and approve.

## Step B1 — Scaffold the Next.js + Supabase project

Claude Code creates the GitHub repo's initial commit:

```
setnayan/
├── .env.local                  (you provide)
├── .env.example                (Claude Code commits this with placeholder values)
├── package.json                (Next.js 15, TypeScript, Tailwind, Supabase JS)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── app/                        (Next.js 15 App Router)
│   ├── (auth)/login/page.tsx
│   ├── dashboard/page.tsx       (event picker)
│   ├── dashboard/[event-id]/    (the four bottom-nav tabs)
│   └── ...
├── components/
│   ├── ui/                     (shadcn/ui components)
│   ├── chrome/
│   │   ├── TopBar.tsx          (event pill + wallet pill + avatar)
│   │   └── BottomNav.tsx       (4 tabs)
│   └── ...
├── lib/
│   ├── supabase/
│   │   ├── server.ts            (server-side Supabase client)
│   │   ├── client.ts            (browser-side Supabase client)
│   │   └── middleware.ts        (auth refresh middleware)
│   ├── r2/                      (R2 signed URL helpers)
│   └── youtube/                 (YouTube API helpers)
├── supabase/
│   ├── migrations/              (SQL migrations)
│   ├── functions/                (Edge Functions in TypeScript)
│   └── seed.sql                  (test data)
├── ios/                          (iOS native app skeleton — Step B5)
├── android/                      (Android native app skeleton — Step B6)
├── desktop-macos/                (Tauri macOS shell — Step B7)
└── tests/
    └── integration/              (Playwright + cross-platform tests)
```

## Step B2 — Apply the V1 schema as Supabase migrations

Claude Code writes SQL migrations covering every table from iterations 0000–0012. One migration per logical group:

```
supabase/migrations/
├── 20260509_000_users_and_events.sql    (0000 + 0001 schemas)
├── 20260509_001_event_members.sql        (0000 join-flow tables)
├── 20260509_002_qr_invitation.sql        (0002 tables + extensions)
├── 20260512_034_payments_and_cart.sql    (0034 service_catalog + carts + service_orders + comp_grants — replaces the retired 0003 token wallet)
├── 20260509_004_invitation_widgets.sql   (0004)
├── 20260509_005_led_background.sql       (0005)
├── 20260509_006_vendors.sql              (0006)
├── 20260509_007_budget.sql               (0007)
├── 20260509_008_seating.sql              (0008)
├── 20260509_009_photo_delivery.sql       (0009)
├── 20260509_010_mood_board.sql           (0010)
├── 20260509_011_live_stream.sql          (0011 — base + add-ons + monogram + style pack)
├── 20260509_012_paparazzi.sql            (0012)
└── 20260509_013_rls_policies.sql         (Row-Level Security on every table)
```

Each migration applies via the Supabase CLI: `supabase db push`. CI auto-applies on merge to main.

## Step B3 — RLS policies for every table

Default deny. Explicit allow per `event_members` membership. Pattern:

```sql
-- Example: guests table
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Couples can read/write all guests of events they're a couple member of
CREATE POLICY "couples_full_access" ON guests
  FOR ALL
  USING (event_id IN (
    SELECT event_id FROM event_members
    WHERE user_id = auth.uid() AND member_type = 'couple'
  ));

-- Guests can read their own row only
CREATE POLICY "guests_read_own" ON guests
  FOR SELECT
  USING (id IN (
    SELECT guest_id FROM event_members
    WHERE user_id = auth.uid() AND member_type = 'guest'
  ));
```

Claude Code writes these for every table. Tests in Section C verify they hold.

## Step B4 — Auth flow + Supabase Realtime wiring

Claude Code builds:
- Magic-link sign-in flow (uses Resend for delivery).
- Password sign-in flow.
- Optional Google + Apple OAuth (if configured in Step A4).
- Auth middleware that refreshes JWT tokens.
- Realtime subscription helper (`useSupabaseSubscribe(eventId, table)`) that every iteration's components use to get live updates.

## Step B5 — iOS native app skeleton (for 0012 Papic)

```
ios/
├── Setnayan.xcodeproj
├── Setnayan/
│   ├── App.swift                 (SwiftUI app entry)
│   ├── Auth/
│   │   ├── SignInView.swift
│   │   └── SupabaseClient.swift  (Supabase Swift SDK init)
│   ├── Capture/                   (camera capture — Papic spec)
│   │   └── CameraView.swift       (AVFoundation-based)
│   └── ...
└── Setnayan.xcconfig
```

Builds to simulator immediately. Talks to the same Supabase backend as web. Sign-in works; authenticated user can see their events listed.

## Step B6 — Android native app skeleton (for 0012 Papic)

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/app/setnayan/
│   │   │   ├── MainActivity.kt
│   │   │   ├── auth/SignInActivity.kt
│   │   │   ├── capture/CameraActivity.kt    (CameraX-based)
│   │   │   └── data/SupabaseClient.kt        (Supabase Kotlin SDK)
│   │   └── res/
│   └── build.gradle
└── settings.gradle
```

Same auth, same Supabase backend.

## Step B7 — macOS desktop shell (Tauri)

```
desktop-macos/
├── src-tauri/
│   ├── tauri.conf.json     (Tauri config)
│   ├── Cargo.toml
│   └── src/main.rs         (Rust shell — minimal)
└── package.json
```

The Tauri shell points to `https://setnayan.com` (for production) or `http://localhost:3000` (for dev). It's a thin webview wrapper — the web codebase does all the heavy lifting. Ships as `Setnayan.app` for the Mac App Store.

## Step B8 — CI/CD pipelines

Three separate pipelines via GitHub Actions:

```
.github/workflows/
├── web-deploy.yml          (Vercel auto-deploys on merge to main, no Action needed beyond confirm)
├── ios-build.yml           (TestFlight upload on tag push)
├── android-build.yml       (Play Console internal track on tag push)
└── supabase-migrations.yml (apply pending migrations to prod Supabase on merge to main)
```

## Step B9 — Service catalog seed

Claude Code applies a seed migration that inserts every paid service row from CLAUDE.md's SKU table into Supabase's `service_catalog` table. Verifies via Step C5 below.

## Step B10 — Storage signed-URL helpers

R2 doesn't have native Supabase integration; Claude Code writes a Supabase Edge Function (`generate-r2-signed-url`) that accepts an event-scoped request, checks RLS via Supabase Auth, and returns a short-lived R2 signed URL. Every photo/video upload from any client goes through this function.

## Step B11 — YouTube broadcast creation Edge Function

For 0011 Panood: when a couple buys the base SKU, an Edge Function creates a YouTube broadcast on Setnayan's master channel via the YouTube Data API. The OAuth refresh token (from Step A6) is stored in Supabase as a service-level credential.

---

# Section C — Integration Tests

Verification procedures we run together after Sections A and B. Each test confirms one specific piece of the platform works end-to-end.

## Test C1 — Local dev server boots

```bash
git clone <repo>
cd setnayan
npm install
cp .env.local.example .env.local  # then fill in your secrets
npm run dev
```

**Expected:** `http://localhost:3000` loads, browser console shows no errors, Supabase client is connected (visible via `console.log(supabase)`).

## Test C2 — Sign in works (magic-link)

1. Visit `http://localhost:3000/login`.
2. Enter your email.
3. Click "Send magic link."
4. Check your inbox — magic-link email from Resend should arrive within 30 seconds.
5. Click the link.
6. Expected: redirected to `/dashboard`, signed in. `auth.uid()` returns your user ID.
7. Open Supabase dashboard → Authentication → Users — your user should be listed.

## Test C3 — Create test event + verify in Supabase

1. From the signed-in dashboard, tap "+ Create event."
2. Pick "Weddings" (the only enabled event type per 0000).
3. Enter test wedding details and create.
4. Open Supabase dashboard → Table Editor → `events`. The new event row should be visible.
5. Open `event_members` table — the `couple` membership row should be there too, linking your user to the new event.
6. Open `event_join_tokens` — auto-generated token row should exist.

## Test C4 — Realtime sync between two browser windows

1. Open two browser windows side-by-side, both signed in as the same user.
2. Both windows show the dashboard for the same test event from C3.
3. In Window 1: edit the event name (or add a guest, change a setting).
4. In Window 2 (without refreshing): the change should appear within 2 seconds.

This proves Supabase Realtime is wired correctly.

## Test C5 — RLS enforcement (security boundary)

1. Sign up a second test user (`alice@test.com`).
2. Sign in as Alice.
3. Try to query the test event from Test C3 (which belongs to your first user).
4. Expected: zero rows returned. RLS blocks Alice from seeing your data.
5. Try to update the event via the API directly:
   ```ts
   const { error } = await supabase.from('events').update({ name: 'hacked' }).eq('id', '<other_user_event_id>');
   ```
6. Expected: error or zero rows affected.

## Test C6 — Service catalog seeded

```sql
SELECT service_key, php_price_centavos FROM service_catalog
WHERE iteration_origin LIKE '0011%';
```

**Expected rows:**
- `panood_base` → 250000
- `panood_camera_addon` → 100000
- `panood_hour_addon` → 100000
- `custom_monogram_pack` → 200000
- `broadcast_style_pack` → 300000
- `ai_video_highlight` → 200000
- `ai_edited_highlight` → 500000

Same for 0004 widgets, 0012 paparazzi, etc.

## Test C7 — R2 signed URL upload

1. Use the test endpoint Claude Code builds (`/api/test/r2-upload`).
2. Upload a small JPEG.
3. Expected: file appears in Cloudflare R2 dashboard under `setnayan-media/test/`.
4. Public URL via `https://media.setnayan.com/test/<filename>` resolves and serves the image.

## Test C8 — YouTube broadcast creation

1. From a signed-in test session, create a test event.
2. Trigger the YouTube broadcast Edge Function (`/api/test/youtube-create-broadcast`).
3. Expected: a new private/unlisted broadcast appears on the Setnayan master YouTube channel.
4. Verify via YouTube Studio that the broadcast has `monetizationDetails.monetization: false` and `latencyPreference: ultraLow`.

## Test C9 — Cross-platform sync (iOS ↔ Web)

1. Sign in on iOS app (simulator or device) with the same email used in Test C2.
2. Open the same event from C3 on iOS.
3. From iOS: change something (event name, RSVP a guest).
4. Switch to the browser (still signed in): change should appear within 2 seconds.
5. Reverse: change something on web, see it on iOS.

This verifies cross-platform data + realtime sync.

## Test C10 — Cross-platform sync (Android ↔ Web)

Same as C9 but with Android app on emulator or device.

## Test C11 — macOS Tauri shell

1. Run `npm run tauri:dev` in `desktop-macos/`.
2. Tauri window opens, shows the Setnayan web app.
3. Sign in.
4. Verify same event from C3 appears.
5. Edit something — change syncs to web and iOS.

## Test C12 — Production deploy via GitHub push

1. Push a small change (e.g., update a comment) to the GitHub `main` branch.
2. Expected within 2 minutes:
   - Vercel auto-deploys the change to `https://setnayan.com`.
   - Vercel sends a deployment notification (Slack/email).
3. Visit production URL, verify the change is live.

## Test C13 — Migration auto-apply

1. Add a small Supabase migration locally (e.g., create a table called `_test_migration`).
2. Push to main.
3. Expected: GitHub Actions `supabase-migrations.yml` runs and applies the migration to prod Supabase.
4. Verify in Supabase dashboard.

## Test C14 — Sentry error tracking

1. Visit `https://setnayan.com/api/test/throw-error`.
2. Within 1 minute: a new event appears in Sentry's web project dashboard.

## Test C15 — Auth across multiple devices

1. Sign in on iOS, Android, web, macOS desktop — same email.
2. All four show the same events list.
3. Sign out on iOS — others remain signed in (single-device sign-out behavior expected).
4. Sign out on web → log fully out → sign back in. Verify session restored.

## Production-readiness gate

The platform is ready for iteration 0000 to ship on top of it once **all 15 tests pass**. Any failure blocks the V1 launch. Each failure goes back to the relevant Section A or B step for resolution.

---

## Build sequence for 0013 itself

1. **Sprint 0a (you, manual, ~1 week elapsed time):** complete all of Section A. Most steps are 15–30 min of clicking; the long pole is Apple Developer (1–3 days approval) and BDO business + GCash for Business account opening (1–3 business days each).
2. **Sprint 0b (Claude Code, ~3–4 days):** Section B steps B1–B4. Web app skeleton + auth + realtime + RLS. After B4, you can already sign in, create test events, and the browser-based platform is functional.
3. **Sprint 0c (Claude Code, ~1 week):** Section B steps B5–B7. Native iOS + Android + macOS skeletons. Each stub authenticates and reads events from Supabase. No business features yet.
4. **Sprint 0d (Claude Code, ~3 days):** Section B steps B8–B11. CI/CD + service catalog + R2 helpers + YouTube Edge Function.
5. **Sprint 0e (you + Claude Code, ~2 days):** Run all 15 tests in Section C. Fix anything that fails.

Once 0013 is green: 0000 starts, then iterations 0001–0012 layer on as planned.

---

## Acceptance criteria

This iteration is shippable when all of the following are true:

- [ ] Every account in Section A has been created and credentials are in `.env.local` and Vercel/Supabase dashboard secrets.
- [ ] `npm run dev` starts the Next.js app, connects to Supabase, and renders the login screen.
- [ ] All migrations from Section B have been applied to the prod Supabase project.
- [ ] RLS policies are enabled on every user-data table.
- [ ] Service catalog has all V1 SKU rows seeded.
- [ ] iOS app builds and runs (in simulator), signs in, lists events.
- [ ] Android app builds and runs (in emulator), signs in, lists events.
- [ ] macOS Tauri app builds and runs, signs in, lists events.
- [ ] All 15 integration tests in Section C pass.
- [ ] CI/CD pipeline auto-deploys on push to main; auto-applies migrations.
- [ ] Sentry projects are receiving events.
- [ ] Custom domain `https://setnayan.com` resolves to the Vercel deployment over HTTPS.
- [ ] Supabase + Vercel production env vars match the staging-tested values.

---

## Open questions (V1.x candidates)

- Do we want to set up a staging environment (separate Vercel deployment + Supabase project) before launch? Recommended; cost is one extra Supabase Pro subscription (~$25/mo).
- Push notifications via APNs/FCM — currently V1 is in-UI only, but the iOS/Android apps are perfect places to add push later. Defer to V1.1.
- Backup strategy for Supabase Postgres — Supabase auto-backs-up daily but custom point-in-time-recovery requires a higher tier ($600/mo Enterprise). Defer until we have real production data to protect.
- Whether to use Supabase Edge Functions or Vercel Edge Functions for backend logic. Both are TypeScript, both work. Recommend Supabase for things that need direct DB access; Vercel for things that integrate with the Next.js frontend.

---

## Companion specs and cross-references

- `0000_app_shell_and_navigation/` — the first iteration that actually USES this platform.
- `00_Iteration_Connection_Map.md` — top-level map showing 0013 as the foundation everything depends on.
- `CLAUDE.md` — decision log including the 2026-05-09 platform stack lock-in.
- `09_Panood_Feature_Specification.md` and `10_Papic_Feature_Specification.md` — source specs for native iOS/Android features.

---

[View this iteration's HTML mockup](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan%20App/0013_platform_stack_and_sync/0013_platform_stack_and_sync.html)

[View this iteration's Word document](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan%20App/0013_platform_stack_and_sync/0013_platform_stack_and_sync.docx)
