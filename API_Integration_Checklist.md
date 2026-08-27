# API Integration Checklist — Prereqs Before Code Starts

> Every external service, account, and integration that must exist *before* Claude Code (or any engineer) starts building. Locked 2026-05-12 · **Owner Punch List section added 2026-05-16 covering walkthrough items #17-20** · **Re-audited 2026-05-20 against `origin/main`** · **Refreshed 2026-05-22 post 17-PR sprint** — Sentry smoke-test endpoint now wired (#280) and the crypto-secret values are pre-generated (still need Vercel env paste); Google Drive verified-app submission unchanged (Phase 2 awaits owner submit-for-review). Do not skip — building without these set up first will produce code that can't run end-to-end.

## Why this comes first

V1 is built on Vercel + Supabase + Cloudflare R2 + GitHub plus seven third-party integrations. The build sequence assumes these are live, billing is set up, and credentials are stored in a shared `.env.example` template. Building without them first produces code that runs locally but can't deploy to a real environment — wasteful.

**Estimated time to complete this checklist: 8–12 hours of admin work.** Most steps are 5–10 minutes each; a handful have multi-day to multi-week approval waits (PH bank account verification, NPC registration, Canon/Nikon/Sony/Fujifilm SDK access requests, Apple Developer Program identity verification).

---

## ⛔ READ THIS BEFORE THE PUNCH LIST — EVERY PERMIT, TAX AND BANK ROW BELOW IS DEFERRED TO JANUARY 2027

**Owner ruling, 2026-07-30, verbatim: *"we will do everything on january 2027 but let this run
truthfully until then."*** He has since had to repeat it — *"we already agreed to just approve this
until january"* (2026-08-20) and *"isn't this for january?"* — and it has now been re-raised at
least **four** times by sessions reading this very file.

🔑 **WHY IT KEEPS HAPPENING, AND IT IS MECHANICAL, NOT A MEMORY LAPSE.** The deferral lives in
`DECISION_LOG.md` and in `scripts/check-corpus-facts.mjs` (which names it explicitly) — and until
today this file contained the word "January" **zero times**. So every red 🔴 below reads as *open
work* to anyone who lands here, and the punch list is exactly where a session looking for "what do
we still need?" lands. **A fact written in more than one place with nothing keeping the copies equal
is the disease this corpus has CI for.**

⛔ **DO NOT PUT ANY OF THESE ON THE OWNER'S PLATE BEFORE JANUARY 2027:** Mayor's Permit · BIR
registration / Form 1905 / ATP · BDO business account · GCash business account · the DTI trade-name
change · NPC filing · PH counsel engagement · the entity's tax posture. **A 🔴 on those rows means
"scheduled for January", NOT "overdue".**

✅ **WHAT IS STILL LIVE WORK TODAY:** anything a *customer or the product itself* touches — the
service credentials that make features run, and keeping every public claim **truthful in the
meantime**, which is the other half of his ruling and is not deferred.

⚖ **AND TWO ROWS BELOW ARE STALE IN THE OTHER DIRECTION** — verify before repeating them: the DPO
row shows 🔴 while the owner registered on the NPC system **2026-07-07**; the checklist has not been
re-audited since **2026-05-22**, three months ago. Treat every status mark here as *unverified*.

---

## 🚨 Owner Admin Punch List (V1 Launch · 2026-05-16)

Consolidated punch list of every **owner-side action** needed to unblock V1 launch. Walkthrough items #17-20 closed here. Each row links back to the detailed section below. Status column: 🔴 not started · 🟡 in progress · ✅ done · ⚪ V1.5+ deferred (can wait).

### Critical path · start NOW (longest leads first)

| # | Task | Lead time | Cost | Status | Detail § |
|---|---|---|---|---|---|
| #17a | **Google Cloud project + YouTube Data API v3 OAuth** — **🔄 RESCOPED 2026-07-23 by the Live Studio Cast/Roam split** (`Live_Studio_Cast_and_Roam_2026-07-23.md`). **✅ Phase 1 DONE 2026-05-18:** Google Cloud project `Setnayan` + YouTube Data API v3 enabled + OAuth consent screen (External·Testing) + OAuth client + redirect URI `/api/oauth/youtube/callback` + Client ID/Secret captured + scopes + test users. **✅ Engineering DONE** (`lib/panood-youtube.ts` + `/api/oauth/youtube/{start,callback,disconnect}` + `/api/cron/oauth-refresh` + `oauth_grants` table — main via `20b21fc`, 2026-05-16). **✅ Crypto secrets** incl. `OAUTH_REFRESH_CRON_SECRET` in Vercel (#19f, 2026-06-13). **✅ Privacy YouTube disclosure** (PR #116). **⚠ CONFIRM:** `YOUTUBE_OAUTH_CLIENT_ID/SECRET/REDIRECT_URI` actually pasted into Vercel (was "paste pending" 2026-05-18; #19f crypto secrets were a separate track). **THE PIVOT changes the biggest blocker:** "verified-app review = single biggest gating item" held ONLY under the retired BYO model (writing to *couples'* channels = sensitive third-party scope). **ROAM now streams on a SETNAYAN-OWNED channel** → own-channel access via **Google Workspace + "Internal" consent screen needs NO verified-app review** and gets long-lived tokens (External·Testing expires refresh tokens after 7 days). **OPEN OWNER DECISION:** (a) **Workspace-Internal** — *recommended*: no review, own-channel only; vs (b) keep **External + finish the verified-app submission** (the pending 1-2 min demo video — works for own-channel AND any future BYO/Cast-on-couples'-channels; ~3-6 wk Google SLA). **🔴 NEW — G1:** create + live-enable (phone-verify + 24h wait) + verify the actual Setnayan YouTube channel(s) (pool = a few brand channels under one account), then connect once. **G4** (API quota extension) is a separate pre-scale item. | Phase-1 ✅ · G1 ~1-3 wk · verify: 0 wk (Internal) / 3-6 wk (External) | Free (+ Workspace ~$7/mo if chosen) | 🟡 (most done; G1 + OAuth-path decision open) | § 5.3 |
| #17b | **DTI Business Name Certificate** — ✅ **DONE 2026-06-25**: "SETNAYAN SOFTWARE DEVELOPMENT SERVICE" registered as sole proprietorship (proprietor INDALECIO SACDALAN CASASOLA II), **national scope**, Business Name No. **8297508**, ref TFWR279119337448, **valid to 2031-06-25** (5-yr DTI renewal — window opens ~3 months before). Cert PDF → file at `01_Contracts/DTI_Certificate.pdf` (owner). | — | paid | ✅ | § 2.2 |
| #17c | **BIR registration — Form 1905 amendment, NOT a fresh 2303** (owner-decided 2026-07-15): Setnayan rides the owner's existing **ICASA ENTERPRISE** sole-prop registration (same person = same TIN = one COR). File Form 1905 (Oct 2025 ENCS) at ICASA's RDO: item 5A COR + item 7A **Additional Trade Name** (old ICASA ENTERPRISE → new SETNAYAN SOFTWARE DEVELOPMENT SERVICE, exact DTI spelling) + item 7D add software/platform-services line of business; attach Setnayan DTI cert + ID. Then ATP **invoice** series under the Setnayan trade name (EOPT: "Invoice", not OR — 0026 PDF title should follow). Registration is **non-VAT · 8% flat income-tax option** (election covers all trade names). ⚠ Tripwire: ₱3M *combined* ICASA+Setnayan gross → VAT prospective **and** the 8% election dies retroactively for the year; build the combined-gross gauge before launch marketing. Still required for Form 2307 quarterly issuance to vendors (BIR Marketplace Withholding 1% × 50%). | days (ORUS or RDO walk-in) | ~free (₱500 ARF abolished by EOPT) | 🟡 | § 2.2 |
| #17d | **Mayor's Permit** — barangay clearance + municipal business permit. Annual renewal Jan-Feb. | ~7-14 days | ~₱2,500–5,000 | 🔴 | § 2.2 |
| #18 | **DPO appointment + NPC registration** — Data Protection Officer under RA 10173. Setnayan can appoint internal (owner) or contract one. NPC registration ~₱500 one-time. `dpo@setnayan.com` mailbox setup. | ~1-2 weeks | ₱500 one-time (NPC) + ₱20K/mo if contracted | 🔴 | § 2.3 |
| #17e | **BDO business savings account** — receiving account for the manual-reconciliation payment flow (V1 ships with this; Maya Business is V1.5+). Daily inbox monitoring + auto-statement download for monthly reconciliation. Requires DTI + BIR 2303 + Mayor's Permit. | ~1-2 weeks after BIR | Free; min balance applies | 🔴 | § 2.1 |
| #17f | **GCash business account** — second receiving rail. Same BDO prerequisites. | ~3-7 days | Free | 🔴 | § 2.1 |
| ~~#19a~~ | ~~**Anthropic Console account + workspace "Setnayan"** — unblocks 0032 Contract Intelligence for V1 ship.~~ | — | — | ❌ **DEFERRED 2026-05-18** — 0032 Contract Intelligence RETIRED in migration `20260518200000_vendor_contracts_dual_esign_retire_0032.sql`, replaced by free dual e-signature on every vendor contract (no AI in V1). Anthropic now V1.5+ only for 0011/0012 highlights. | § 5.4 |
| #19f | **Generate crypto secrets** — `ENCRYPTION_KEY` (AES-256-GCM, used by `lib/encryption.ts` PR #152) · `CRON_SECRET` · `OAUTH_REFRESH_CRON_SECRET` · `INTERNAL_WORKER_SECRET`. Without these, OAuth flows fail to decrypt + admin/cron endpoints return 401. Generate each with `openssl rand -base64 32`, paste into Vercel env. | Same day (5 min) | Free | ✅ (all 4 set in Vercel · Production+Preview · verified live 2026-06-13) | (new — added 2026-05-20) |
| #19g | **Google Drive OAuth verified-app submission** — Drive scopes for 0009 Photo Delivery (Sept 2026 ship) + 0012 Papic. Separate from #17a (YouTube scopes). Same ~3-6 weeks Google review SLA. Engineering shipped 2026-05-19/20 (PRs #147, #150, #152, #153); owner needs to set up Google Cloud OAuth consent screen for Drive scopes + submit for verified-app review. | 1-6 weeks Google review | Free | 🟡 (unchanged — Phase 2 awaits owner submit-for-review) | (new — added 2026-05-20) |
| #19b | **Persona / Veriff / Onfido signup** — Identity verification for vendor onboarding (gov ID liveness check, ~₱200/check, ~₱535/vendor across the full 12-doc verification). Pick one — Persona is recommended for PH coverage. | ~3-7 days for KYC | Per-check pricing | 🔴 | § 5.6 |
| #19c | **AMLC sanctions API access** — PEP screening at vendor verification time (12-doc checklist item l). Required by 2026-05-16 vendor verification lock. AMLC provides bulk subscription via PH banks; alternative is World-Check or Refinitiv. | ~7-14 days | ~₱20K-50K/year subscription | 🔴 | § 5.8 |
| #19d | **Resend account + DKIM/SPF/DMARC** — transactional email (verification codes, payment instructions, comp-gift notifications). Free tier 3,000/mo covers V1; $20/mo for 50K. Domain auth must complete before first email send. | ~1-2 days | Free tier | 🟡 (likely partial) | § 3.1 |
| #19e | **Sentry production smoke test** — Sentry SDK is wired (PR #17) AND smoke-test endpoint `/api/admin/sentry-smoke-test` is now wired (PR #280, 2026-05-22 17-PR sprint). Owner action remaining: trigger the admin-gated endpoint once in production → confirm capture + email/Slack alerting routes. | Same day (1 click) | Free tier | 🟡 (endpoint + Sentry env vars verified live 2026-06-13 · trigger handed to owner: POST /api/admin/sentry-smoke-test while admin-signed-in · awaiting alert-routing confirm) | § 4.1 + decision-log row 10 (2026-05-16) |

### Social auto-publish track (added 2026-06-13)

> Prereqs for the Social Sharing auto-publish pipeline (`03_Strategy/Social_Sharing_Program_2026-06-12.md` § 8) — auto-posting couple creations / vendor features / greetings to the Setnayan Facebook, Instagram, and TikTok pages. None block the web app; Phase A code ships first and activates when the env vars land.

| # | Task | Lead time | Cost | Status | Unlocks |
|---|---|---|---|---|---|
| #21a | **Meta Business Portfolio + developer app** — create a Business app, link the Setnayan Facebook Page, create a **system user**, grant `pages_manage_posts` + `instagram_content_publish`, generate the long-lived page token. Paste into Vercel env: `META_PAGE_ID` · `META_PAGE_ACCESS_TOKEN` · `IG_USER_ID`. Posting to Setnayan's OWN page needs no public App Review. | Same day (~30 min) | Free | 🔴 | FB auto-posting (Phase A) + IG (Phase B) |
| #21b | **Instagram → Professional (Business) account**, connected to the Setnayan Facebook Page in Meta Business settings. Prerequisite for the Content Publishing API. | Minutes | Free | 🔴 | IG auto-posting (Phase B) |
| #21b-2 | **Capture `IG_USER_ID`** — after #21b, read the IG Business account id (Graph API Explorer `GET /me/accounts?fields=instagram_business_account` with the page token, or Meta Business settings) and paste it into Vercel env as `IG_USER_ID`. The same `META_PAGE_ACCESS_TOKEN` authorizes IG posting once it carries `instagram_content_publish` + `instagram_basic` + `pages_show_list`. | Minutes | Free | 🔴 | IG auto-posting (Phase B — code shipped #1322) |
| #21c | **TikTok for Developers app + Content Posting API "Direct Post" audit** — register at developers.tiktok.com, request Content Posting API, submit for the Direct-Post audit. **The long pole — runs on TikTok's clock.** Until approved, the pipeline runs assisted-manual (rendered 9:16 video + copy-caption card in the Social Queue). Env: `TIKTOK_CLIENT_KEY` · `TIKTOK_CLIENT_SECRET`. | Days–weeks (audit) | Free | 🔴 | TikTok auto-posting (Phase C) |
| #21c-2 | **Verify a PULL_FROM_URL domain + capture `TIKTOK_ACCESS_TOKEN`** — after #21c clears, verify `www.setnayan.com` (or the card-route host) as a content-source domain in the TikTok dev portal, OAuth the Setnayan TikTok account, paste the user token into Vercel env as `TIKTOK_ACCESS_TOKEN`. Note: TikTok tokens are short-lived — a refresh-token loop is a follow-on before fully hands-off. **Until done, the shipped pipeline (#1328) runs assisted-manual: it renders the 9:16 card + caption in /admin/social-queue for a 30-sec manual post.** | Minutes (after audit) | Free | 🔴 | TikTok auto-posting (Phase C — code shipped #1328) |
| #21d | **Meta Marketing API access (separate from #21a's page-publishing token)** — for the new HQ **Marketing → Ads** surface (owner directive 2026-07-01, real Meta Ads Manager integration — live campaigns/spend/results in HQ, not a manual log). Needs a Business Manager account, an ad account ID, and an access token scoped `ads_management` + `ads_read` (page-publishing's `pages_manage_posts` scope does NOT cover ads data). Paste into Vercel env once minted: `META_AD_ACCOUNT_ID` · `META_ADS_ACCESS_TOKEN` (placeholder names — confirm at build time). **Blocks all Ads-surface code** — no menu item exists yet in HQ (deliberately, to avoid a dead link) until these land + read-vs-write scope is confirmed with the owner (reporting-only vs. creating/editing campaigns from HQ — write access is materially bigger scope + liability). | Same day–days (Business Manager + ad account setup) | Free (Meta doesn't charge for API access; ad spend itself is separate) | 🔴 | HQ Marketing → Ads (not yet built) |

### App-store distribution track · start when mobile is greenlit (added 2026-06-11)

> Prereqs for shipping the native apps (0052) + Wallet passes + App Clips/Live Activities, per `Mobile_Native_Features_Tier1_2_Proposal_2026-06-10.md`. None block the web app. **The Apple org enrollment is the long pole — its D-U-N-S verification runs on Apple's clock, so start it the moment mobile is greenlit, before any native code.** Store-fee exposure is ₱0 under the locked payments-off-platform contract (proposal §6, owner-locked 2026-06-11).

| # | Task | Lead time | Cost | Status | Unlocks |
|---|---|---|---|---|---|
| #21a | **Apple Developer Program — enroll as ORGANIZATION** (developer.apple.com/programs → Enroll → Organization). Needs: D-U-N-S number for the registered business (free via Apple's D-U-N-S lookup/request form; have the DTI registration name + address exactly as registered — so #17b is a soft prereq), a legal-entity webpage, and the owner as verified signatory. Individual enrollment is faster but publishes under a personal name and complicates Wallet/APNs org assets later — use Organization. | **3 days – 2+ weeks** (D-U-N-S + Apple identity verification) | US$99/yr | 🔴 | iOS/iPadOS app distribution · App Clips · Live Activities · APNs · **Wallet Pass Type ID cert** · Sign in with Apple |
| #21b | **Google Play Console developer account** (play.google.com/console → new developer account, organization type). Identity + payment-profile verification; org accounts need a D-U-N-S too — reuse #21a's. | ~1–3 days | US$25 one-time | 🔴 | Android app distribution · Play Instant Apps |
| #21c | **Google Wallet API issuer account** (pay.google.com/business/console → Google Wallet API). Separate from #21b; free; needs a service-account key from a Google Cloud project (reuse the #17a project). | ~1–3 days | Free | 🔴 | Google Wallet passes (T2-5) |
| #21c-2 | **Verify a PULL_FROM_URL domain + capture `TIKTOK_ACCESS_TOKEN`** — after #21c clears, verify `www.setnayan.com` (or the card-route host) as a content-source domain in the TikTok dev portal, OAuth the Setnayan TikTok account, paste the user token into Vercel env as `TIKTOK_ACCESS_TOKEN`. Note: TikTok tokens are short-lived — a refresh-token loop is a follow-on before fully hands-off. **Until done, the shipped pipeline (#1328) runs assisted-manual: it renders the 9:16 card + caption in /admin/social-queue for a 30-sec manual post.** | Minutes (after audit) | Free | 🔴 | TikTok auto-posting (Phase C — code shipped #1328) |
| #21d | **VAPID web-push keys** — `npx web-push generate-vapid-keys` + 3 Vercel envs. **No store account needed** — see repo `OWNER_ACTIONS.md` 2026-06-11 entry for exact steps. | 5 min | Free | ✅ (keys set 2026-06-11 · verified live on Production 2026-06-13) | Web Push (shipped 2026-06-11, PR #1229 — LIVE on Production) |
| #21e | **Pre-submission compliance pack** — before the first store submission: walk proposal §6.4 (payments DO/DON'T matrix) + §7 remedies (account deletion ✅ · UGC report/block ✅ · NSFW filter · push/offline ✅), fill both stores' privacy forms from `Store_Privacy_Labels_Answer_Sheet_2026-06-11.md`, PH-counsel review of the native purchase/sign-in flows. | owner + counsel | — | 🔴 | App Review approval without rejection loops |

### Event-type onboarding activation track (added 2026-06-24 · 0053 Phase 3)

> The per-type onboarding engine shipped to `main` (iteration 0053 Phase 3 · PRs #2123/#2124/#2126/#2127) but ships **DARK** — every non-wedding `/onboarding/[type]` route 404s and the create-event picker keeps its inline name-form until these owner switches are flipped. No code change needed to activate; weddings are unaffected either way. Full context: spec `0053_event_type_engine/0053_event_type_engine.md` + memory `project_setnayan_onboarding_engine`.

| # | Task | Lead time | Cost | Status | Detail § |
|---|---|---|---|---|---|
| #22a | **Flip the experience-quiz flag** — set Vercel env `NEXT_PUBLIC_EXPERIENCE_QUIZ_ENABLED=true` (Production + Preview). Lights up the experience quiz + the `/onboarding/[type]` route + the picker's non-wedding branch. NEXT_PUBLIC = build-time inlined, so redeploy after setting. **The single switch that turns on non-wedding onboarding.** | 5 min + redeploy | Free | 🔴 | 0053 Phase 3 |
| #22b | **Apply the experience-persona migration** — apply `supabase/migrations/20270208703382_events_experience_persona.sql` to prod (the `experience_persona` / `experience_for_whom` / `experience_axes` columns). Until applied, the commit's persona-intent write is flag-guarded off; the flow still works but doesn't persist the persona. Apply via Supabase MCP `execute_sql` + `migration repair` (never `db push`). | 5 min | Free | 🔴 | 0053 Phase 3 |
| #22c | **(optional) No-login anon-draft onboarding** — set `NEXT_PUBLIC_ANON_ONBOARDING_ENABLED=true` **and** enable Supabase `enable_anonymous_sign_ins` (the null-email trigger `20270205204166` already shipped). Lets a visitor complete onboarding without an account (a Supabase anonymous session is minted at commit; "secure your plan" converts it). Without it, onboarding requires sign-in at commit (unchanged contract). | 10 min | Free | ⚪ | 0053 Phase 3 |

### V1.5+ deferred · can wait until after launch

| # | Task | Lead time | Cost | Status | Detail § |
|---|---|---|---|---|---|
| #20a | **Maya Business merchant application** — primary V1.5+ payment gateway with Maya QR Ph (1.5% gateway) as the preferred default rail per 2026-05-16 lock. Replaces PayMongo as primary. | ~2-4 weeks | Per-transaction fees | ⚪ | § 5.7 |
| #20b | **PayMongo (V1.5+ backup)** — alternative payment processor. Previously primary; now backup under Maya Business primary. | ~1-2 weeks | ~3.5% gateway | ⚪ | § 7.7 |
| #20c | **GCash Merchant API (V1.5+ alternate rail)** — under Maya Business primary, GCash automated flow is V1.5+ alternate. V1 GCash flow is manual via business account (#17f). | ~4-6 weeks | ~2.5% gateway | ⚪ | § 7.6 |
| #20d | **Apple Developer Program** — for Papic native iOS V1.5+. Reserve `com.setnayan.papic` + `com.setnayan.app` bundle IDs. Apple identity verification 3-7 days. | ~3-7 days | $99/year | ⚪ | § 6.7 |
| #20e | **Google Play Console** — for Papic native Android V1.5+. Reserve `com.setnayan.papic` package name. | ~1-3 days | $25 one-time | ⚪ | § 6.8 |
| #20f | **TikTok OAuth verified app** — Personal-tier Patiktok BYO flow (couple's own TikTok). Scopes: `user.info.basic` + `video.upload` + `video.publish`. TikTok app review ~7-14 days. Setnayan-tier Patiktok (V1) uses Setnayan-owned `@SetnayanWeddings` master handle — single OAuth, no per-couple review needed. | ~7-14 days | Free | 🔴 (Setnayan-tier V1 · 🔴 Personal-tier V1) | § 7.8 |
| #20g | **Canon / Nikon / Sony / Fujifilm Camera SDK access** — DSLR bridge for Papic V1.5+ Pro Camera Bridge. Each vendor has its own developer program registration with per-vendor lead times. | ~2-8 weeks per SDK | Free for most | ⚪ | § 6.1 / 6.2 / 6.3 / 6.4 |
| #20h | **Suno Premier music catalog generation** — ~400 owned AI tracks per `02_Specifications/14_Music_Catalogue_Cowork_Playbook.md`. Parallel workstream; engineering builds with placeholders. | ~Several hours of generation time | Suno subscription | ⚪ | § 5.5 |

### V1.1 traffic-monetization expansion · post-launch (added 2026-05-19 · 0039 retired same-day)

These items unlock the 0038 iteration spec drafted 2026-05-19. None are V1 launch-blocking; all are V1.1 ramp items that pair with the editorial content cadence. **#21a + #21c removed 2026-05-19 afternoon** after AdSense access was confirmed blocked for the owner's Google account (AdSense-for-YouTube inactivity deactivation; no AdSense-for-Content enrollment path forward). 0039 retired same-day.

| # | Task | Lead time | Cost | Status | Detail § |
|---|---|---|---|---|---|
| ~~#21a~~ | ~~Google AdSense publisher account~~ | — | — | 🚫 **REMOVED 2026-05-19 — 0039 retired (AdSense access blocked)** | — |
| #21b | **Involve Asia affiliate-network signup** — PH-focused affiliate network with deep merchant coverage (Klook, Lazada, Shopee, Agoda, Trip.com, BDO, Vivere). Picked as 0038 primary network. Owner: signup at involve.asia, complete payout details (PH bank account · BIR TIN), apply to per-merchant programs as needed (most auto-approve, a few have editorial review). | ~3-7 days · per-merchant approval ~1-7 days | Free signup · 5% net of commission to Involve Asia · Setnayan keeps the rest | 🟡 **Submitted 2026-05-19 · awaiting network approval (3-7 business days)** | § 9.2 (NEW) |
| ~~#21c~~ | ~~Privacy Policy update + NPC re-filing for AdSense cookies~~ | — | — | 🚫 **REMOVED 2026-05-19 — no third-party trackers means RA 10173 first-party PostHog opt-out is sufficient (already in 0025 Privacy & Data tab)** | — |
| #21d | **Featured-vendor lookbook (V1.1 marketing deliverable)** — 1-page PDF for the Boosted Ads outbound playbook (`09_Operations/Boosted_Ads_Activation_Playbook.md`). Designer or owner via Figma. Stored at `04_Marketing/Featured_Vendor_Lookbook_2026Q3.pdf`. Refresh quarterly with updated performance data. | ~1-2 days design | Internal | ⚪ Owed 2026-06-15 | § 9.4 (NEW) |

### Already done · verified live (refreshed 2026-05-22 post 17-PR sprint)

**🚀 2026-05-22 17-PR autonomous sprint additions to "already done":** Sentry smoke-test endpoint shipped (#280) · `/api/health` + `/api/health/deep` shipped (#275) · payments idempotency sealed (#277) · observability typecheck (#289) · retired-strings CI lint guard (#276) · email-link CI audit (#288) · schema.org Pro pricing (#278) · sitemap completeness (#279) · day-of PWA Phase 1 (#284) · admin nav consolidation (#285) · couple dashboard TILES expansion (#287) · Patiktok + Pakanta marketing (#281) · Setnayan Pay worked example + actor terminology sweep (#282) · marketing chrome polish (#286) · Public Editorial + Concierge Brain consent in Privacy Policy v1 (#273) · service_catalog corrections (#272) · vendor compare orphan redirect (#274).

| # | Task | Status | Detail § |
|---|---|---|---|
| 1 | GitHub `iscasasola/setnayan-platform` **public** repo (flipped public 2026-05-14, AGPL-3.0) | ✅ | § 1.1 |
| 2 | Vercel project (auto-deploys `main`) + custom domain | ✅ | § 1.2 |
| 3 | Supabase project (Singapore) + RLS posture + **76 migrations** | ✅ | § 1.3 |
| 4 | Cloudflare R2 buckets (APAC) — `setnayan-media`, `setnayan-thread-files`, `setnayan-vendor-contracts`, `setnayan-samples`, `setnayan-vendor-verification` (5 canonical per `lib/r2.ts` `R2_BUCKETS`) + R2 client + uploads wired 2026-05-14 PR #18 | ⚠️ | § 1.4 |
| 4a | ⚠️ **Provisioning drift caught 2026-07-05:** `setnayan-vendor-verification` was marked ✅ here but **never actually created in R2** — every vendor verification-doc upload failed with a masked network error (presign OK, browser PUT → `NoSuchBucket`, no CORS headers → XHR `onerror`). **Created 2026-07-05** (APAC / Standard / private) + CORS applied. Lesson: mark a bucket ✅ only after confirming it in the R2 dashboard, not on code-wired. `setnayan-bir-2307` is NOT in the code's `R2_BUCKETS` — drop it from the "6 total" claim. | ✅ (fixed) | § 1.4 |
| 5 | `setnayan.com` + `setnayan.ph` domain registration | ✅ | § 1.6 |
| 6 | ~~Anthropic SDK wired (`@anthropic-ai/sdk`)~~ | ❌ NOT WIRED — was queued for 0032 which retired 2026-05-18; SDK install deferred to V1.5+ | § 5.4 |
| 7 | Sentry SDK wired (PR #17) | 🟡 SDK wired, smoke test pending #19e | § 4.1 |
| 8 | PostHog SDK wired (PR #19) — 3 server-side funnels live + 4 PostHog funnel links at `/admin/funnels` (PR #26) | ✅ | § 4.2 |
| 9 | Daily.co video meetings | ❌ RETIRED 2026-05-16 (do not enable) | § 1.5 |
| 10 | Cloudflare Stream Live | ❌ RETIRED 2026-05-16 (do not enable) | § 5.1 |
| 11 | **Resend** — SDK + 9 of 10 V1 email templates wired (PR #8, #20, #28) | ✅ wired; V1 auto-confirms signup so non-blocking | § 3.1 |
| 12 | **TanStack Query + persisters + idb-keyval + tracked-mutation wrapper** (PR #10 caching foundation) | ✅ | (caching strategy spec) |
| 13 | **R2 storage migration off Supabase Storage** (PR #18) | ✅ — uploads via `lib/uploads.ts` + `@aws-sdk/client-s3` | § 1.4 |
| 14 | **`pdf-lib`** — BIR 2307 + OR receipt generation | ✅ shipped | (0026) |
| 15 | **Per-couple OAuth grants table** (migration 54, 2026-05-16) | ✅ — supports YouTube + Drive + TikTok | (0011/0009/0017) |
| 16 | **YouTube OAuth code (0011 Live Studio [formerly Panood])** — lib + 3 routes + cron refresh | ✅ engineering; 🟡 Google verified-app review pending (#17a) | § 5.3 |
| 17 | **Google Drive OAuth code (0012 Papic)** — `lib/papic-drive.ts` + routes (migrations 53-55, 67) | ✅ engineering; 🟡 Drive scopes verified-app pending #19g | § 5.3 |
| 18 | **Photo Delivery Drive OAuth code (0009)** — `lib/photo-delivery-drive.ts` + routes (PRs #147, #150, #152, #153) | ✅ engineering; 🟡 Drive scopes verified-app pending #19g | § 5.3 |
| 19 | **TikTok OAuth code (0017 Patiktok)** — `lib/patiktok-tiktok.ts` + 2 routes (migration 50-52) | ✅ engineering; 🟡 TikTok app review pending #20f | § 7.8 |
| 20 | **Vendor verification webhooks** — Persona + Veriff webhook routes wired (`/api/webhooks/persona`, `/api/webhooks/veriff`) | ✅ scaffolding; 🟡 owner signup pending #19b | § 5.6 |
| 21 | **Vendor reviews + force-majeure queue** (PRs #24, #26) — couple form, vendor reply, public profile, admin queue, couple-side disputes | ✅ | (0006/admin) |
| 22 | **Public marketplace `/vendors` + couple-initiated invite for off-platform vendors `/vendor/claim/[token]`** (PRs #24, #137) | ✅ | (0006/0022) |
| 23 | **Dual e-sign for vendor contracts** (migration 61, 2026-05-18) — REPLACES the retired 0032 AI flow with free dual e-sign on every contract | ✅ shipped | (replaces 0032) |
| 24 | **Concierge wizard architecture + pgvector schema** (migration 64, 2026-05-18) | ✅ schema shipped; UI wiring in flight | (0016) |
| 25 | **Supplies foundation** (migrations 69-70, PRs #143, #146, #148) — vendors, SKUs, pricing resolver, orders | ✅ | (0018 — NEW) |
| 26 | **LED background foundation** (migration 74, PR #150) | ✅ schema | (0005 — NEW) |
| 27 | **Multi-moderator V1.2 foundation** (migration 66) | ✅ Phase A only — NOT V1 launch | (0048 — V1.2) |
| 28 | **Per-surface guided tours** (PR #138) — all 4 roles | ✅ | (0030) |
| 29 | **`/api/v1` read-only public API** — events, guests, vendors, reviews + scope-gated `sk_live_*` keys (PR #27) | ✅ | (0033) |
| 30 | **EN/TL locale toggle** (PR #28) — hand-rolled `lib/i18n/` (no `next-intl` dep) | ✅ | (0025) |
| 31 | **Pilot Mode launch promo** (migration 60) — free until March 2027 banner | ✅ wired; needs `NEXT_PUBLIC_PILOT_MODE_FREE_UNTIL` env | (launch promo) |
| 32 | **Account-lifecycle redesign** — Delete vs Blacklist (PR #9 + blacklist table) | ✅ | (0025) |
| 33 | **Day-of mode** (PR #11 + #12) — T-3d → T+1d auto-activation + 6 cards | ✅ | (0036) |
| 34 | **Couple waitlist signups** (migration 62) — `/waitlist` capture for soft-launch demand | ✅ | (marketing) |

### How to use this punch list

1. **Start the long-leads TODAY.** Items #17a (YouTube verified-app, 1-4 weeks) and #17b/c/d (DTI/BIR/Mayor's Permit, 7-14 days each, sequentially dependent) gate V1 launch. Every day waiting is a day's delay to ship.
2. **Bundle the same-day items into a single 2-3 hour admin sprint.** Anthropic signup, Resend domain auth, Sentry smoke test, and AMLC inquiry letter all fit in one focused afternoon.
3. **Pay the costs as they come up.** Total V1 admin spend ~₱30K-50K for the regulatory + DPO + AMLC items + Anthropic monthly ceiling. Apple Developer ($99/yr) + Google Play ($25 one-time) can wait until V1.5+.
4. **Document API keys in `.env.example`** as each integration goes live. The repo's `.env.example` already has the 2026-05-16 sections for Anthropic / Maya / Persona / AMLC stubbed (commented placeholders); fill them in as keys become available.
5. **Cross-reference status:** when an item flips ⚪→🔴→🟡→✅, update both this punch list AND the detailed Tier section below. Mismatched status between the two is the most common drift signal.

---

## Tier 1 — Infrastructure (mandatory, ship-blocking)

### 1.1 GitHub repository

- [ ] Create `setnayan-platform` private repository under a Setnayan-owned GitHub org
- [ ] Add SSH deploy keys for Vercel + dev machines
- [ ] Set up branch protection on `main` (PR-only, 1 reviewer required)
- [ ] Initialize repo with `.gitignore` for Node + Next.js + macOS
- [ ] Create issues board mirroring the iteration list (0000–0024)

**Cost:** Free up to 5 users; $4/user/month after.

### 1.2 Vercel project

- [ ] Sign up for Vercel Pro ($20/month) for build minutes + larger functions
- [ ] Connect Vercel to the GitHub repo
- [ ] Set up environments: `production` (setnayan.com), `staging` (staging.setnayan.com), `preview` (auto-generated per PR)
- [ ] Configure environment variables (Supabase keys, R2 keys ~~, Daily.co keys~~ — TBD per § 1.3, § 1.4 · Daily.co RETIRED 2026-05-16)
- [ ] Enable Vercel Analytics (Web Vitals tracking)

**Cost:** ~$20/month Pro tier.

### 1.3 Supabase project

- [ ] Create Supabase project in `Singapore` region (closest to PH for latency)
- [ ] Note connection strings and JWT secrets
- [ ] Set up the V1 schema (see iteration 0013 spec for the SQL bootstrap)
- [ ] Enable Row-Level Security (RLS) on every table per the privacy policy
- [ ] Set up Auth providers: email/password (bcrypt), mobile OTP, Google SSO, Apple SSO
- [ ] Enable Supabase Realtime for chat (0019) + presence (online indicators)
- [ ] Set up Storage buckets if needed (most media on R2; Supabase Storage only for small assets like vendor logos < 1MB)
- [ ] Enable Edge Functions for: render-queue triggers, audit-log writes, comp-gift activation

**Cost:** Free tier covers up to 500MB DB + 1GB Storage; Pro $25/month for ~8GB DB + 100GB Storage; scale as needed.

### 1.4 Cloudflare R2 buckets (PH region)

- [ ] Create Cloudflare account
- [ ] Provision **all five** R2 buckets in APAC — the canonical set is `R2_BUCKETS` in `apps/web/lib/r2.ts`; a bucket the code names but R2 lacks fails EVERY upload to it with a masked network error (see § "Provisioning drift" 2026-07-05):
   - `setnayan-media` — couple/guest photos, paparazzi captures, save-the-date renders (public signed reads)
   - `setnayan-thread-files` — chat attachments (0019) (private)
   - `setnayan-vendor-contracts` — signed contract PDFs (private)
   - `setnayan-samples` — sample/demo assets (private)
   - `setnayan-vendor-verification` — vendor DTI/SEC/ID documents (private) ✅ created 2026-07-05
- [ ] Set R2 bucket policies — `setnayan-media` allows signed reads; the other four block all public reads
- [ ] **Configure CORS on EVERY bucket** `<FileUpload>` PUTs to (all 5) for production + staging domains — CORS is per-bucket; a missing/mismatched policy shows as "Upload failed… check your connection" with no HTTP status. Canonical policy + one-shot script: `apps/web/scripts/r2-cors.sh` (`AllowedOrigins` must include `https://www.setnayan.com` **with** the `www`).
- [ ] Set up API tokens for signed URL generation (5-min TTL for sensitive media)
- [ ] Verify free egress is active (it should be — Cloudflare's signature R2 feature)

**Cost:** Free up to 10GB storage + free egress; $0.015/GB/month over.

### 1.5 ~~Daily.co (for 0019 video meetings)~~ **RETIRED 2026-05-16**

The Daily.co video-meetings feature was retired entirely from V1+ on 2026-05-16. No signup needed. Couples + vendors use external tools (Google Meet, Zoom, Messenger, WhatsApp) for video; the 0019 chat composer surfaces a "Share meeting link" affordance that auto-detects pasted URLs and renders them as tappable cards. Daily.co domain + API keys + recording webhooks all NOT required.

- ~~Sign up for Daily.co; enable Singapore region for SFU~~ — N/A
- ~~Generate API keys — domain creation + room creation + meeting tokens~~ — N/A
- ~~Configure webhook for recording-completed events → uploads to R2 thread-files bucket~~ — N/A
- ~~Set up cost limits: $0 hard ceiling for free trial; $200/month soft cap to start~~ — N/A

**Cost:** ₱0 (feature retired).

**Spec ref:** `0019_communications/0019_communications.md` 2026-05-16 amendment banner; `CLAUDE.md` 2026-05-16 marketplace/payment/verification lock row § 6.

### 1.6 Domain registration

- [ ] Register `setnayan.com` (likely via Namecheap or Cloudflare Registrar)
- [ ] Register `setnayan.ph` (via PHNic — required for `.ph` TLDs)
- [ ] Point DNS A records to Vercel (production)
- [ ] Set up DKIM + SPF + DMARC for transactional email
- [ ] Set up custom email forwarder (admin@setnayan.com, dpo@setnayan.com, vendors@setnayan.com) → existing personal Gmail until V1.5 brings dedicated email infrastructure

**Cost:** ~₱600/year setnayan.com + ~₱2,000/year setnayan.ph + ~$15/year for email forwarder.

## Tier 2 — Payment + Operations (mandatory for revenue)

### 2.1 Static receiving accounts

- [ ] Open BDO business savings account in Setnayan's registered business name
- [ ] Open GCash business account in Setnayan's registered business name
- [ ] Both accounts: ensure inbox is monitored daily for incoming payments + reference codes
- [ ] Configure auto-statement download for monthly reconciliation
- [ ] Set up a daily-run script on a Setnayan-Team machine that reads new bank inbox emails + matches against `service_orders.reference_code` for verification

**Cost:** Free; maintains balance requirements apply.

### 2.2 Business + tax registration

- [x] DTI — ✅ DONE 2026-06-25: "SETNAYAN SOFTWARE DEVELOPMENT SERVICE" sole proprietorship, national scope
- [ ] BIR — **Form 1905 amendment on the owner's existing ICASA ENTERPRISE registration** (owner-decided 2026-07-15; same person = same TIN = one COR, so no fresh 2303): 7A Additional Trade Name + 7D add software/platform-services line; attach Setnayan DTI cert. Reissued COR lists BOTH trade names. Non-VAT · 8% flat option (covers all trade names). Then ATP **invoice** series (EOPT: "Invoice", not OR) under the Setnayan trade name.
- [ ] Mayor's Permit — Setnayan operates from ICASA's registered address; ask the LGU at renewal whether the additional trade name must be reflected on ICASA's existing permit
- [ ] BIR Form 0605 + 1601C / 1601E — tax filing setup with accountant (existing ICASA accountant relationship covers it; one 1701Q/1701A, gross receipts combined)
- [ ] ⚠ **₱3M combined-gross tripwire (ICASA + Setnayan):** crossing it forces VAT (prospective) AND voids the 8% election retroactively for the year (graduated recompute, 8% payments become credits). Build the combined-gross gauge on the admin money surface before launch marketing; the clean success-milestone exit is incorporating Setnayan (own TIN).

**Cost:** ~free (₱500 BIR annual registration fee abolished by the EOPT Act; DTI already paid). Annual renewals apply to the Mayor's Permit.

### 2.3 Data Privacy compliance

- [ ] Appoint a Data Protection Officer (DPO) — internal hire or contracted
- [ ] Register the DPO with the Philippine National Privacy Commission (NPC)
- [ ] Set up `dpo@setnayan.com` (forwarder per § 1.6)
- [ ] Draft + publish the Privacy & Security Policy (already done — `01_Contracts/Setnayan_Privacy_and_Security_Policy.md`)
- [ ] Set up breach notification process — 72-hour SLA per RA 10173

**Cost:** DPO compensation (if internal: part of payroll; if contracted: ~₱20K/month). NPC registration ~₱500 one-time.

### 2.4 Setnayan Pay processing (V1.5 prep) — **AMENDED 2026-05-16**

**2026-05-16 lock:** primary V1.5+ gateway is **Maya Business** with Maya QR Ph (1.5% gateway) as the preferred default rail — see § 5.7 above for full Maya Business signup checklist. GCash Merchant API and PayMongo are now V1.5+ optional alternates rather than primary.

- [ ] **[NEW PRIMARY 2026-05-16]** Submit Maya Business merchant application — see § 5.7
- [ ] ~~Submit application to GCash Merchant API (typically 4–6 week approval)~~ — V1.5+ alternate rail (under Maya Business primary)
- [ ] ~~Submit application to PayMongo (typically 1–2 week approval) — backup integration~~ — superseded by Maya Business primary
- [ ] Set up sandbox test accounts in Maya Business
- [ ] Coordinate with BIR for proper invoicing format (BIR Form 2303 + Form 2307 for marketplace withholding 0.5%)
- [ ] Setnayan Pay convenience fee repriced **3% → flat 5.0% on top of vendor price** (admin-configurable per method, defaults uniform · Option B vendor-absorbs-gateway · supersedes the morning's 5.5%/6.5% dual-rate · see 0034 § 6 + 0023 § 3.5d)

**Status:** V1 doesn't use automated gateway; ships with manual reconciliation per current 0034 flow. Maya Business turns on at V1.5+. Approval timeline (2-4 weeks) is the bottleneck.

## Tier 3 — Marketing + Content (nice to have for launch)

### 3.1 Email infrastructure (transactional + marketing)

- [ ] SendGrid or Resend account for transactional email (verification codes, payment instructions, comp-gift notifications)
- [ ] Set up sender authentication (DKIM/SPF/DMARC per § 1.6)
- [ ] Reserve send capacity (~5,000 emails/month for V1)

**Cost:** Resend free tier 3,000/month; $20/month for 50,000.

### 3.2 SMS provider for OTPs (V1.5+)

- [ ] Apply for Twilio or local PH SMS gateway (Globe / Smart partnership)
- [ ] V1 uses email-based OTP only. SMS OTP is a V1.5 nice-to-have.

### 3.3 Music catalogue + Template library hosting

- [ ] Generate the ~400 owned AI music tracks via Suno Premier (see `02_Specifications/14_Music_Catalogue_Cowork_Playbook.md`)
- [ ] ~~Generate the 30 Save-the-Date templates~~ **RETIRED 2026-05-16** — 0024 folded into 0002 Phase 1; no MP4 templates needed. Phase 1 hero design templates live with the 0004 widget catalog instead (web-tech rendering)
- [ ] Upload all assets to `setnayan-media` R2 bucket under `/music_catalogue/`
- [ ] Publish `catalogue_manifest.json` to the same bucket

**Status:** Asset creation is parallel workstream; engineering can build the consumer surfaces with placeholder assets and swap in production assets when ready.

## Tier 4 — Analytics + Monitoring (V1.1)

### 4.1 Error tracking

- [ ] Sentry account for application error monitoring
- [ ] Configure alerts for production errors > 10/hour

### 4.2 Analytics

- [ ] Plausible or Fathom for privacy-friendly analytics (no cookies, GDPR/PH-DPA friendly)
- [ ] Configure goal tracking for: customer signup, vendor signup, first booking, first paid service

### 4.3 Uptime monitoring

- [ ] BetterStack or UptimeRobot for `setnayan.com` + key API endpoints
- [ ] Configure SMS alerts to Ops Lead phone

## Tier 5 — Media + AI Pipeline (mandatory for Papic/Live Studio [formerly Panood]/AI Highlights · 2026-05-16: Save-the-Date dropped from this tier)

### 5.1 Cloudflare Stream Live — **RETIRED 2026-05-16**

> **Retired with the Panood architecture pivot to BYO YouTube via OAuth.** The composite step (server-side ffmpeg) + SFU ingest + RTMP relay through Setnayan's master channel are no longer the V1 architecture. Couple OAuths their own YouTube channel; Setnayan provides broadcaster orchestration (multi-cam UI + RTMP push of the active feed to the couple's YouTube) + landing-page IFrame embed. **DO NOT enable Cloudflare Stream Live** for the V1 Panood build. See § 5.3 below for the reframed YouTube Live OAuth model and CLAUDE.md 4th 2026-05-16 row.

~~- [ ] Enable Cloudflare Stream Live on the existing Cloudflare account (§ 1.4)~~
~~- [ ] Provision SFU ingest endpoints for iteration 0011 Panood live stream~~
~~- [ ] Configure ultra-low-latency mode (~10s end-to-end target)~~
~~- [ ] Set up RTMP relay output to YouTube on Setnayan's master channel `@SetnayanWeddings` (§ 5.3)~~
~~- [ ] Verify the channel is NOT enrolled in YouTube Partner Program (YPP) — monetization must stay off~~
~~- [ ] Set up signed-URL playback for landing-page embed fallback (if YouTube IFrame fails)~~

**Cost (retired):** Stream Live ingest would have been ~$1 per 1,000 minutes; ~₱120 per 3-hour event base SKU. V1 cost is now ~₱0 per event because YouTube composites and delivers at unbounded scale on the couple's own channel.

**Spec refs:** ~~`0011_live_stream/0011_live_stream.md`~~ → `0011_panood/0011_panood.md` § Pricing — V1 SKU lock 2026-05-16, CLAUDE.md 2026-05-16 4th row.

### 5.1a Potrace WASM (Monogram Hero PNG-to-SVG conversion · added 2026-05-16)

- [ ] Pick a Potrace WASM build (`potrace-wasm` on npm exists; verify license + size <500KB compressed)
- [ ] Deploy as Cloudflare Worker at `/api/monogram/convert` — reads PNG from R2 `setnayan-media`, runs Potrace, writes SVG to R2 under `hero_monogram/{event_id}/converted.svg`
- [ ] Default Potrace settings: threshold 128, turdsize 2, optcurve true, opttolerance 0.2 — captured to `hero_monogram.converted_svg_potrace_settings` for reproducibility
- [ ] Wire the preview-gate UI in the Monogram Hero checkout flow (per 0004 § "Monogram Hero PNG → SVG preview gate · 6-step flow")
- [ ] Acceptance test: PNG upload → Convert tap → ≤3s p95 → preview rendered → couple taps "Use this SVG" → `converted_svg_url` + `converted_svg_approved_at` + `converted_svg_potrace_settings` all written to `invitation_widgets.config_json`

**Cost:** ~₱0 per conversion (Worker compute + R2 storage). Preserves 95%+ margin on the ₱1,999 Monogram Hero SKU.

**Spec refs:** `0004_invitation_widgets/0004_invitation_widgets.md` § "Monogram Hero PNG → SVG preview gate"; CLAUDE.md 2026-05-16 amendment entry.

### 5.2 FFmpeg render pipeline

- [ ] Choose Cloudflare Workers Paid plan tier ($5/month minimum + $0.50 per million requests)
- [ ] Provision a Cloudflare Queue for render jobs (`reel-render-queue`, `ai-highlight-queue`)
- [ ] **NEW 2026-05-16:** Provision a Cloudflare Queue `std-video-render-queue` for the **Save-the-Date Video MP4 SKU** (`save_the_date_video_render` ₱99) — separate from the retired page-render `std-render-queue`. Worker reads from R2 `setnayan-media/std-video-uploads/{render_id}/` (5-10 engagement photos), runs FFmpeg + Lottie composition with one of the 8-12 V1 templates + a Setnayan-owned music track from the chosen category, writes the output to R2 `setnayan-media/std-video-renders/{render_id}.mp4`. 5-minute SLA from upload-complete to download-ready.
- [ ] Deploy a Worker that loads template manifest + photos/clips + music, generates FFmpeg cmd, encodes 1080×1920 H.264 MP4 (Personal Reels), 1080p themed (AI Edited Highlight)
- [ ] **NOTE 2026-05-16:** Panood AI Video Highlight / AI Edited Highlight render pipelines need re-scope to consume the **couple's YouTube archive via OAuth** (per § 5.3 reframe) instead of Cloudflare-Stream recordings. Engineering re-scope at V1.5+ build time; current spec describes the retired source. Save-the-Date Phase 1 landing page (0002) remains web-tech only — separate from the new STD Video MP4 SKU here.
- [ ] Output to R2 `setnayan-media` bucket under `/renders/{event_id}/{render_id}.mp4`
- [ ] Configure Hetzner Cloud VM pool as fallback (§ 7.3) when Workers CPU-time limit (30s) is exceeded for longer renders
- [ ] Set up render-job webhook → Supabase Edge Function → guest/couple notification

**Cost:** ~₱2–₱5 per render (Workers compute + R2 storage). Workers Paid plan ~₱290/month base. STD Video MP4 SKU runs ~₱5-10 per render (slightly higher due to Lottie overlay compute) — still nets ~70% under V1 tax tier at the ₱99 price point.

**Spec refs:** `0012_papic/0012_papic.md` Part 4 (Personal Reel render), `0011_panood/0011_panood.md` § AI Edited Highlight (re-scope flagged), `0024_save_the_date/0024_save_the_date.md` § "Save-the-Date Video SKU ₱99 — reintroduced 2026-05-16" (new pipeline consumer).

### 5.3 YouTube Live API — per-couple OAuth (reframed 2026-05-16)

> **🔄 PIVOT 2026-07-23 (Live Studio Cast/Roam split — `Live_Studio_Cast_and_Roam_2026-07-23.md`).** Live Studio is now two products. **CAST** (directed single feed) keeps the per-couple BYO model described below. **ROAM** (the new multi-camera / multi-venue "guests pick which camera" product) streams on a **SETNAYAN-OWNED channel POOL** (owner "we will integrate our own youtube channel"), NOT the couple's — chosen because it's the only 0-to-do-for-the-couple model. Consequences: (1) **own-channel access via Workspace-Internal needs no verified-app review** — the review that gated #17a was a BYO requirement; (2) recordings become a Setnayan→couple handoff; (3) the existing per-couple `oauth_grants` plumbing must additionally hold the **pool channels' own tokens** (Roam provisioning PR). Roam foundation schema (`panood_roam_zones` / `panood_roam_channel_pool` / `panood_roam_streams` + `events.panood_roam_manifest`) shipped + applied 2026-07-23 (flag-dark, `NEXT_PUBLIC_PANOOD_ROAM_ENABLED`). The BYO description below still governs CAST.

> **Reframed 2026-05-16.** Per the Panood architecture pivot, Setnayan no longer hosts a master YouTube channel for couple broadcasts. **Each couple OAuths their own YouTube channel** at Panood booking time, granting Setnayan write permission to their channel; the broadcaster UI pushes the active camera feed via RTMP to the couple's `liveBroadcasts` resource; the landing page embeds the couple's `liveBroadcasts.id` in an IFrame. Setnayan never touches a master Setnayan-owned YouTube channel for Panood. (Patiktok's `@SetnayanWeddings` master TikTok handle is a separate flow under § 7.2 — that one IS Setnayan-owned for the Setnayan-tier Patiktok SKU.)

> **Phase 1 status (2026-05-18 · corrected later same day):** Google Cloud project `Setnayan` created (separate from `iCASA ERP`); YouTube Data API v3 enabled; OAuth consent screen configured (User type External · Publishing status Testing · branding pointing to setnayan.com + /privacy + /terms + setnayan.com authorized domain); 2/100 test users registered. Scopes requested: `userinfo.email` + `userinfo.profile` (non-sensitive · auto-approved) + `youtube` + `youtube.upload` (sensitive · trigger 3-6 week verification review). OAuth Client `Setnayan Web — Production` (Web app type) created with JS origins `https://www.setnayan.com` + `https://setnayan.com` and **redirect URI `https://www.setnayan.com/api/oauth/youtube/callback`** (note `/oauth/` not `/auth/` — aligns with engineering code at `apps/web/app/api/oauth/youtube/callback/route.ts` already shipped in main via `20b21fc` on `claude/youtube-oauth-panood`). Client ID + Client Secret captured to owner's secure note — Vercel env paste uses **`YOUTUBE_OAUTH_CLIENT_ID` + `YOUTUBE_OAUTH_CLIENT_SECRET` + `YOUTUBE_OAUTH_REDIRECT_URI=https://www.setnayan.com/api/oauth/youtube/callback`** (Production + Preview + Development scopes — not `GOOGLE_OAUTH_*`; existing code at `apps/web/lib/panood-youtube.ts` reads the YOUTUBE_OAUTH_* names). **Engineering already complete** — `oauth_grants` table (migration `20260516261000_oauth_grants_per_couple.sql` · 7 providers stub with `youtube`/`drive`/`tiktok` initial set), `/api/oauth/youtube/{start,callback,disconnect}` routes, `/api/cron/oauth-refresh` nightly token-refresh sweep, and Panood setup UI all shipped 2026-05-16 in the V1 scope expansion. **Phase 2 verified-app submission gated on 2 remaining prereqs** (the engineering item is closed): (a) privacy policy YouTube disclosure ✅ shipped in PR #116; (b) owner records 1-2 min demo video of working OAuth → broadcast creation → landing-page IFrame embed (Google review requirement for sensitive scopes). When the demo video is recorded, click Publish app → Submit for Verification in the Google Auth Platform Verification Center.

- [ ] Set up Google Cloud project + YouTube Data API v3 client (Setnayan-owned)
- [ ] Configure OAuth 2.0 consent screen with verified-app status (required by YouTube for write-scope OAuth from third parties)
- [ ] Request OAuth scope verification from Google: `https://www.googleapis.com/auth/youtube` + `https://www.googleapis.com/auth/youtube.upload` (Google reviews the request; typical 1-4 weeks for verified-app status)
- [ ] Extend `oauth_grants` schema to persist per-couple YouTube refresh tokens + token expiry + granted scopes (one row per event, tied to `events.event_id`)
- [ ] Implement OAuth handshake at Live Studio (formerly Panood) SKU purchase time — couple completes consent in a popup, refresh token written to `oauth_grants`
- [ ] Implement `liveBroadcasts.insert` for the couple's channel with `monetizationDetails.monetization: false` and `contentDetails.latencyPreference: ultraLow` (couple decides monetization on their own channel post-event)
- [ ] Implement `liveStreams.insert` to get the RTMP ingest URL + stream key for the **broadcaster web UI's active-feed push** (not Cloudflare Stream relay — § 5.1 is retired)
- [ ] Landing-page IFrame embed: fetch the couple's `liveBroadcasts.id` from `oauth_grants` and render `https://www.youtube.com/embed/{video_id}` in the landing page's hero
- [ ] Token-refresh worker: nightly refresh of YouTube OAuth tokens within their 6-month inactivity window
- [ ] Revocation handling: if couple revokes YouTube access from their Google account, Setnayan dashboard shows "Re-authorize YouTube to continue broadcasting" with a one-tap re-OAuth button

**Cost:** Free (YouTube Data API quota is generous per-OAuth-client; per-couple OAuth means quota scales naturally with users without consuming Setnayan's daily quota budget).

**Spec refs:** `0011_panood/0011_panood.md` § Pricing — V1 SKU lock 2026-05-16, CLAUDE.md 2026-05-16 4th row, `0033_public_api_foundation/0033_public_api_foundation.md` § oauth_grants schema (extended for per-event YouTube refresh-token storage).

### 5.4 Anthropic Claude API — **DEFERRED 2026-05-18 (0032 retired)**

**Status:** Was locked 2026-05-16 to unblock 0032 Contract Intelligence. **0032 was retired 2026-05-18** in migration `20260518200000_vendor_contracts_dual_esign_retire_0032.sql` and replaced with free dual e-signature on every vendor contract (no AI analysis in V1). Anthropic signup is therefore **NOT a V1 prereq** and **NOT in the V1 critical path**.

**Remaining V1.5+ rationale:** Anthropic still queued for 0011 AI highlights + 0012 Papic AI scene selection when those features ship in V1.5+. Defer signup until then. Env vars + spend caps remain reserved in `.env.example` for the eventual V1.5+ activation.

- [ ] ~~Sign up for Anthropic Console account under Setnayan-owned email~~ → defer to V1.5+ render-pipeline phase
- [ ] ~~Create workspace "Setnayan" within the console~~ → defer
- [ ] ~~Set spend caps: $500/month soft alert · $2,000/month hard cap · $100/day soft cap~~ → spec preserved; activate when needed
- [ ] ~~Generate API key, store in `.env` as `ANTHROPIC_API_KEY`~~ → defer
- [ ] ~~Unblocks 0032 Contract Intelligence for V1 ship~~ → no longer applicable; 0032 retired

**Spec refs:** `0032_contract_intelligence/0032_contract_intelligence.md` (note: spec retains the original AI design for reference only — the SKU rows `contract_intelligence_upgrade` are `is_active=FALSE` on `service_catalog`). `CLAUDE.md` 2026-05-18 decision-log row covering the 0032 retirement + dual e-sign replacement.

### 5.6 Persona / Veriff / Onfido — Identity verification (NEW 2026-05-16 · Tier 2)

For vendor verification (0006 Vendor Verification flow). Required for the gov-ID check + liveness step (item 4 + 8 of the 12-document checklist).

- [ ] Evaluate Persona vs Veriff vs Onfido for PH market support + PH gov ID coverage (UMID, SSS, PhilHealth, PRC, Passport, Driver's License, Voter's ID)
- [ ] Choose one provider (recommendation pending — Persona has best PH coverage at last spot-check; Veriff is cheapest at ~$0.80/check; Onfido has best fraud-detection accuracy)
- [ ] Sign up + KYC the Setnayan business (1-2 BD)
- [ ] Generate API keys, store in `.env` as `PERSONA_API_KEY` (or equivalent)
- [ ] Configure webhook → `/api/vendor-verification/identity-check-result` → updates `vendor_verification_applications.persona_check_result` JSONB
- [ ] Set up sandbox test accounts

**Cost:** ~₱200 per ID + liveness check (1 USD ≈ ₱56). Setnayan absorbs as part of the ~₱535/vendor initial-verification CAC.

**Spec refs:** `0006_vendors_management/0006_vendors_management.md` Vendor Verification flow; `0023_admin_console/0023_admin_console.md` § 3.2a Vendor identity verification queue; `CLAUDE.md` 2026-05-16 marketplace/payment/verification lock row § 7 (item d).

### 5.7 Maya Business — Primary payment gateway (NEW 2026-05-16 · Tier 2 · V1.5+ activation)

V1.5+ primary gateway per 2026-05-16 lock. V1 ships with manual reconciliation (current 0034 flow); Maya Business turns on at V1.5+ for automated processing.

- [ ] Apply for Maya Business merchant account (PH business registration from § 2.2 required)
- [ ] Submit BIR Form 2303 + Mayor's Permit + bank account details
- [ ] Wait for Maya Business approval (typical 2-4 weeks)
- [ ] Enable Maya QR Ph (1.5% gateway fee — preferred default rail at checkout per 0034)
- [ ] Enable additional rails: bank transfer, GCash direct, Maya eWallet (2.0%), credit card (3.0%), OTC (1.5%)
- [ ] Generate API keys, store in `.env` as `MAYA_BUSINESS_API_KEY` + `MAYA_BUSINESS_SECRET`
- [ ] Configure webhook → `/api/payments/maya-webhook` → updates `service_orders.status` on payment confirmation
- [ ] Configure outbound disbursement (Setnayan → vendor) — Setnayan absorbs ₱15-25 fee per payout
- [ ] Set up sandbox + production keys
- [ ] Build per-method admin config UI surface (0023 § 3.5d Payment Method Configuration)

**Cost:** Application fee TBD (typically ₱5,000-10,000 one-time). Gateway fees passed through to vendor transparently.

**Spec refs:** `0034_payments_and_cart/0034_payments_and_cart.md` § 6 Setnayan Pay convenience fee; `0023_admin_console/0023_admin_console.md` § 3.5d Payment Method Configuration; `CLAUDE.md` 2026-05-16 marketplace/payment/verification lock row § 4 (Payment gateway sequencing).

### 5.8 AMLC sanctions API — PEP screening (NEW 2026-05-16 · Tier 2)

For vendor verification item 12 (sanctions / PEP screening).

- [ ] Apply for access to AMLC (Anti-Money Laundering Council) watchlist API — typically via a registered Compliance Officer
- [ ] Alternative: use ComplyAdvantage or Refinitiv World-Check (international PEP databases) for broader coverage
- [ ] Sign up + register Setnayan's Compliance Officer with the AMLC
- [ ] Generate API key, store in `.env` as `AMLC_API_KEY` (or `COMPLY_ADVANTAGE_API_KEY`)
- [ ] Configure batch check on each verification application submission → updates `vendor_verification_applications.amlc_screening_result` JSONB
- [ ] Set up alerts for positive matches → escalate to Setnayan admin for manual review

**Cost:** AMLC direct access typically free for registered Compliance Officers; ComplyAdvantage ~$1-3 per check at low volume.

**Spec refs:** `0006_vendors_management/0006_vendors_management.md` Vendor Verification flow item 12; `CLAUDE.md` 2026-05-16 marketplace/payment/verification lock row § 7 (item l).

### 5.5 Suno Premier (one-time music catalog generation)

- [ ] Confirm Suno Premier subscription is active during the catalog-generation window (~1 month)
- [ ] File Suno Premier account credentials + license terms in `01_Contracts/Suno_Premier_License.md` (TBD — not yet drafted)
- [ ] Verify ownership clause covers the ~400 generated tracks in perpetuity (Suno Premier terms permit commercial use of generated audio)
- [ ] Generate the ~400 tracks across the 6 categories per `02_Specifications/14_Music_Catalogue_Cowork_Playbook.md`
- [ ] Upload to R2 `/music_catalogue/{category}/{filename}.mp3`; publish `catalogue_manifest.json`

**Status:** One-time content workstream, NOT an ongoing API integration. Suno credentials are filed and forgotten after generation. No code dependency on Suno at runtime.

**Cost:** Suno Premier ~$30/month × 1 month = ~₱1,700 one-time. Generated tracks owned forever.

**Spec refs:** `02_Specifications/14_Music_Catalogue_Cowork_Playbook.md`, CLAUDE.md "Music & template assets" section.

## Tier 6 — Native SDKs (mandatory for Papic V1 native app + DSLR bridge)

### 6.1 Canon EOS Camera Connect SDK

- [ ] Create developer account at `developer.canon.com`
- [ ] Submit EOS WiFi SDK access agreement (requires Setnayan business registration from § 2.2)
- [ ] Wait for Canon approval (typical 5–10 business days)
- [ ] Download the EOS SDK + sample code (iOS + Android variants)
- [ ] Build a Canon-only seat test app — pair one Canon body, capture one photo via WiFi SDK, confirm metadata stamp
- [ ] File the signed SDK agreement in `01_Contracts/Canon_SDK_Agreement.pdf`

**Cost:** Free (SDK access is gratis once approved). Engineering time ~2 days for proof-of-concept.

**Spec refs:** `0012_paparazzi/0012_paparazzi.md` § Pro Camera Bridge, decision log "DSLR Pro Camera Bridge ships in V1" 2026-05-10.

### 6.2 Nikon SnapBridge / MTP-over-WiFi SDK

- [ ] Visit `developer.nikon.com` SDK request form
- [ ] Submit business registration (DTI cert from § 2.2) + use-case description
- [ ] Wait for Nikon approval (typical 7–14 business days)
- [ ] Download SDK + sample code
- [ ] Build a Nikon-only seat test (one Nikon body, one photo via SnapBridge/MTP)
- [ ] File signed agreement in `01_Contracts/Nikon_SDK_Agreement.pdf`

**Cost:** Free. Engineering ~2 days for proof-of-concept.

**Spec refs:** `0012_paparazzi/0012_paparazzi.md` § Pro Camera Bridge.

### 6.3 Sony Camera Remote SDK

- [ ] Visit `developer.sony.com` Camera Remote API beta program
- [ ] Request beta program access (Setnayan business credentials)
- [ ] Wait for Sony approval (typical 7–14 business days)
- [ ] Download SDK
- [ ] Build Sony-only seat test
- [ ] File signed beta agreement in `01_Contracts/Sony_Camera_Remote_SDK_Agreement.pdf`

**Cost:** Free. Engineering ~2 days for proof-of-concept.

**Spec refs:** `0012_paparazzi/0012_paparazzi.md` § Pro Camera Bridge.

### 6.4 Fujifilm Camera Remote SDK

- [ ] Visit `fujifilm-x.com` developer page
- [ ] Submit developer agreement application (MFi-style approval process may apply)
- [ ] Wait for Fujifilm approval (typical 10–21 business days — longest of the four)
- [ ] Download SDK
- [ ] Build Fujifilm-only seat test
- [ ] File signed agreement in `01_Contracts/Fujifilm_SDK_Agreement.pdf`

**Cost:** Free, but the MFi-style review can require an NDA + product disclosure. Engineering ~2 days for proof-of-concept. **Flag:** if Fujifilm approval lags past V1 launch, ship Canon/Nikon/Sony first and add Fujifilm in V1.1.

**Spec refs:** `0012_paparazzi/0012_paparazzi.md` § Pro Camera Bridge.

### 6.5 Apple Vision framework (face detection on iOS)

- [ ] No separate SDK or account — built into iOS 16+
- [ ] In the Papic native iOS Xcode project, add `Vision.framework` to linked frameworks
- [ ] Set `NSCameraUsageDescription` in `Info.plist` ("Setnayan uses the camera to capture candid wedding photos")
- [ ] Set `NSPhotoLibraryAddUsageDescription` for opt-in save-to-camera-roll
- [ ] Confirm face-detection model is bundled (`VNDetectFaceRectanglesRequest` + `VNDetectFaceLandmarksRequest`)

**Cost:** Free (bundled with iOS).

**Spec refs:** `0012_paparazzi/0012_paparazzi.md` § Face detection, decision log "Face detection auto-tag with layered enrollment" 2026-05-10.

### 6.6 Google ML Kit Face Detection (Android)

- [ ] Confirm Firebase project exists (create one if not — `setnayan-prod` and `setnayan-staging`)
- [ ] Add ML Kit Face Detection dependency to the Papic native Android Gradle build (`com.google.mlkit:face-detection`)
- [ ] Configure on-device face detection (no cloud calls — privacy + cost)
- [ ] Add Camera permission to `AndroidManifest.xml` with rationale string
- [ ] Test on a low-end Android device (target floor: Android 11 + 3GB RAM)

**Cost:** Free for on-device inference (no Firebase project billing required for ML Kit local mode).

**Spec refs:** `0012_paparazzi/0012_paparazzi.md` § Face detection.

### 6.7 Apple Developer Program

- [ ] Enroll Setnayan business in Apple Developer Program ($99/year) at `developer.apple.com`
- [ ] Submit business legal entity verification (DTI cert + Mayor's Permit from § 2.2)
- [ ] Wait for Apple identity verification (typical 2–5 business days, occasionally up to 2 weeks)
- [ ] Generate App Store Connect API key for CI/CD distribution
- [ ] Reserve the bundle ID `com.setnayan.papic` (and `com.setnayan.app` for the main customer/vendor app if native shells are added)
- [ ] Configure App Store Connect listing draft (screenshots, copy, age rating — Papic is 12+ for user-generated content)

**Cost:** $99/year (~₱5,600/year).

**Spec refs:** `0012_paparazzi/0012_paparazzi.md` § Native distribution, `0013_platform_stack_and_sync/0013_platform_stack_and_sync.md`.

### 6.8 Google Play Console

- [ ] Pay $25 one-time Google Play Console registration fee
- [ ] Submit identity verification (government ID + business documents)
- [ ] Wait for Google approval (typical 1–3 business days)
- [ ] Reserve the package name `com.setnayan.papic`
- [ ] Set up CI/CD service account for Play Console API uploads
- [ ] Configure Play Store listing draft

**Cost:** $25 one-time (~₱1,400). No annual renewal.

**Spec refs:** `0012_paparazzi/0012_paparazzi.md` § Native distribution.

## Tier 7 — Scheduling, Auth + Misc (mandatory for V1 ops + V1.5 prep)

### 7.1 Cron scheduling

- [ ] Choose ONE: Vercel Cron (free on Pro plan, runs on the same Vercel project) OR Cloudflare Cron Triggers (free, runs on Cloudflare Workers — same project as § 5.2 render pipeline)
- [ ] Recommended: Cloudflare Cron Triggers (already on Cloudflare for R2 + Stream + Workers; consolidates ops surface)
- [ ] Configure jobs:
   - Monthly team-pool allocation calc (0023 § 10b) — 1st of each month, 00:00 PHT
   - 24-hr payment expiry sweep (0034) — every hour, marks `service_orders` with `pending_payment` + age > 7 days as `expired`
   - Face vector retention sweep (RA 10173 / 0012) — daily, deletes `face_enrollments` rows past the 5-year retention boundary
   - Reconciliation matcher run (0034 § 11) — every 5 minutes, sweeps unmatched `payment_inbox_messages`
   - R2 hot-to-IA tier migration (0009/0012) — daily, moves objects past 90-day hot window
- [ ] Set up failure alerts → Better Stack (§ 4.3 / 0035)

**Cost:** Free on either platform.

**Spec refs:** `0023_admin_console/0023_admin_console.md` § 10b Team Pool, `0034_payments_and_cart/0034_payments_and_cart.md` § 11 Reconciliation, CLAUDE.md decision log 2026-05-12 "Setnayan Team Shared Monthly Consumable Pool".

### 7.2 OAuth + PKCE setup (V1.5 prep for Public API)

- [ ] Provision the `oauth_clients` table per `0033_public_api_foundation/0033_public_api_foundation.md` schema
- [ ] Define the 16-scope registry (`events.read`, `events.write`, `guests.read`, `guests.write`, `vendors.read`, `payments.read`, etc. — full list in the iteration spec)
- [ ] Build refresh-token rotation logic (refresh tokens rotate on each use; old token invalidated)
- [ ] Reserve `developers.setnayan.com` subdomain — point at a placeholder static page during V1
- [ ] No public OAuth endpoints exposed in V1; plumbing only

**Status:** V1 plumbing exists; no developer signups accepted until V1.5 phased rollout.

**Cost:** Engineering time only (~3–5 days for schema + endpoints + placeholder portal).

**Spec refs:** `0033_public_api_foundation/0033_public_api_foundation.md`.

### 7.3 Hetzner Cloud fallback VM pool

- [ ] Create Hetzner Cloud account (`hetzner.com`)
- [ ] Provision 2× CPX21 VMs (3 vCPU, 4GB RAM, ~€7.50/month each) in region HEL1 (Helsinki) or NBG1 (Nuremberg) — pick HEL1 for lower latency to PH
- [ ] Install Docker + FFmpeg + a queue worker that pulls from the Cloudflare Queue (§ 5.2) when Workers CPU-time limit is exceeded
- [ ] Set up SSH access + monitoring → Better Stack
- [ ] Verify failover: simulate a Workers overflow and confirm the VM pool picks up the job

**Cost:** ~€15/month for 2 VMs (~₱950/month). Scale up to 4–6 VMs at V1.1 if render volume justifies.

**Spec refs:** CLAUDE.md "Architecture summary" (FFmpeg fallback note), `0012_paparazzi/0012_paparazzi.md` Part 4.

### 7.4 Mapbox OR Google Maps

- [ ] Pick ONE: Mapbox (free tier 50K loads/month, cheaper at scale) OR Google Maps (free $200/month credit, more familiar in PH market)
- [ ] **Recommended:** Mapbox — cheaper, sufficient quality for venue pinning, no card-on-file surprise charges
- [ ] If Mapbox: sign up at `mapbox.com`, generate API token, restrict to `setnayan.com` + `staging.setnayan.com` referrers
- [ ] If Google Maps: enable Maps JavaScript API + Places API in Google Cloud Console, generate API key with referrer restrictions
- [ ] Integrate into 0015 marketing site (venue locator) + 0006 vendor detail page (vendor pin) + 0021 couple dashboard (venue map widget)

**Cost (Mapbox):** Free up to 50K map loads/month; $5 per 1,000 loads over. Estimated free at V1 scale.

**Cost (Google Maps):** $200/month free credit covers ~28K dynamic map loads. Estimated free at V1 scale.

**Spec refs:** `0015_main_website/0015_main_website.md`, `0006_vendors_management/0006_vendors_management.md`.

### 7.5 PandaDoc or DocuSign (V1.5 e-signature)

- [ ] No setup required in V1
- [ ] V1 ships manual PDF signing per Vendor Agreement § 12.1 (PDF emailed → signed scan returned → filed in R2 `setnayan-vendor-contracts` bucket)
- [ ] V1.5 evaluation: PandaDoc (~$19/user/month, friendlier API) vs DocuSign (~$25/user/month, more recognized in PH legal market)
- [ ] Tentative pick: PandaDoc for cost + API ergonomics; reconsider if PH counsel requires DocuSign for enforceability comfort

**Status:** Placeholder — no V1 action.

**Cost (V1):** ₱0. **Cost (V1.5 PandaDoc):** ~₱1,100/user/month.

**Spec refs:** `0027_e_signature/` (retired before drafting), CLAUDE.md decision log 2026-05-12 "Launch-blocker iterations", Vendor Agreement § 12.1.

### 7.6 GCash Merchant API (V1.5 reconciliation upgrade)

- [ ] No setup required in V1
- [ ] V1 uses manual reconciliation via the fuzzy SQL matcher in 0034 § 11 (`match_inbox_to_order` 4-tier function)
- [ ] V1.5 will replace manual matching with GCash Merchant API webhook → auto-mark `service_orders.status = 'paid'` when API confirms payment received against reference code
- [ ] § 2.4 application is the prerequisite — submit during V1 so the API is approved by V1.5

**Status:** Placeholder — no V1 action beyond § 2.4 application.

**Cost (V1):** ₱0. **Cost (V1.5):** Per-transaction fees TBD (typically 1.5–2.5% per successful payment).

**Spec refs:** `0034_payments_and_cart/0034_payments_and_cart.md` § 11, CLAUDE.md "Payment system" V1.5 roadmap.

### 7.7 PayMongo (V1.5 alternative payment processor)

- [ ] No setup required in V1
- [ ] Currently under evaluation as a backup / alternative to GCash Merchant API for V1.5 automated reconciliation
- [ ] § 2.4 sandbox application covers the initial integration test
- [ ] Decision point at V1.5 planning: pick ONE primary processor (GCash Merchant API likely; PayMongo as fallback) — running both adds reconciliation complexity without proportional revenue

**Status:** Placeholder — under evaluation.

**Cost (V1):** ₱0. **Cost (V1.5):** ~3.5% + ₱15 per successful card transaction; ~2% per GCash-via-PayMongo transaction.

**Spec refs:** `0034_payments_and_cart/0034_payments_and_cart.md` § 11, CLAUDE.md "Payment system" V1.5 roadmap.

### 7.8 TikTok OAuth — Personal-tier Patiktok BYO flow (V1 · added 2026-05-16)

> **V1 integration.** Added with the 2026-05-16 Patiktok dual-tier SKU lock — the **Personal TikTok** tier (`patiktok_personal_daily` ₱1,999/day) requires the couple to grant Setnayan write permission to their own TikTok account so compilations auto-post to their handle. The **Setnayan TikTok** tier (`patiktok_setnayan_daily` ₱999/day) does NOT use this OAuth path — it posts via Setnayan-owned `@SetnayanWeddings` credentials.

- [ ] Register a TikTok developer app at `developers.tiktok.com` (Setnayan-owned, business-tier)
- [ ] Submit business verification (DTI cert + business email + privacy policy URL pointing to `setnayan.com/privacy`)
- [ ] Wait for TikTok Login Kit + Content Posting API approval (typical 5-10 business days)
- [ ] Request the following scopes for the Personal-tier Patiktok flow:
   - `user.info.basic` — read couple's TikTok display name / avatar for confirmation UI
   - `video.upload` — write videos to the couple's account (PRIVATE by default)
   - `video.publish` — publish those videos publicly with caption + @-mentions
- [ ] Wait for scope-by-scope review (TikTok reviews each scope independently; `video.publish` is the slowest, typically 2-4 weeks)
- [ ] Implement OAuth handshake at Patiktok Personal-tier SKU purchase time — couple completes TikTok login in a popup, refresh token written to `oauth_grants` (same table as YouTube per § 5.3 extension)
- [ ] Token refresh: TikTok refresh tokens are 365 days; nightly cron refreshes any expiring tokens
- [ ] Compilation posting flow: after compilation render completes, server reads couple's refresh token → exchanges for access token → calls `POST /v2/post/publish/video/init/` → uploads the rendered MP4 → finalizes with `POST /v2/post/publish/status/fetch/` polling
- [ ] Revocation handling: if couple revokes TikTok access from their TikTok app, Setnayan dashboard shows "Re-authorize TikTok to continue posting from Patiktok" with a one-tap re-OAuth button
- [ ] Caption template: `"Our Patiktok — [event date] · @[guest1] @[guest2] ... · #[customhashtag]"` (vs Setnayan-tier template that uses `"[Couple Name]'s Patiktok ..."`)

**Cost:** Free (TikTok Content Posting API quota is generous for verified business apps; Setnayan's posting count is well below limits even at V1 scale).

**Spec refs:** `0017_patiktok/0017_patiktok.md` § Pricing — V1 SKU lock 2026-05-16 + § TikTok integration — dual-tier posting, CLAUDE.md 2026-05-16 6th row, `oauth_grants` schema (extended for per-event TikTok refresh-token storage).

## Tier 8 — Missing items (surfaced in 2026-05-14 10-pass audit)

These are integrations + libraries + assets that were referenced across iteration specs / CLAUDE.md decisions / app build but were missing from Tiers 1–7. Added 2026-05-14 to close the gap. For the prioritized install sequence, see [Install_Sequence_V1.md](02_Specifications/Install_Sequence_V1.md).

### 8.1 Business / Legal / Tax foundation (PREREQUISITE for SDK approvals + bank accounts)

- [ ] **DTI Single Proprietorship registration** — prerequisite for Tier 6 SDK applications + Tier 2.1 bank accounts (Tier 2.2 already lists this; surfaced again because Tier 6 depends on it)
- [ ] **BIR accountant relationship** — quarterly Form 2307 EWT filing + eFPS submissions per iteration 0026 (~₱5K/mo retainer)
- [ ] **DPO appointment + NPC registration** — Data Protection Officer registered with Philippine National Privacy Commission (RA 10173)
  - [ ] Identify DPO (internal hire or contracted; ~₱20K/mo if contracted)
  - [ ] File DPO contact with NPC (~₱500 registration fee)
  - [ ] DPO contact email `dpo@setnayan.com` must resolve (depends on Tier 8.2 email forwarders)

**Spec refs:** `01_Contracts/Setnayan_Privacy_and_Security_Policy.md`, iteration 0025 § Privacy & Data, iteration 0026.

### 8.2 Domain + email infrastructure (PREREQUISITE for Resend)

- [ ] **`setnayan.ph` domain** via PHNic (Tier 1.6 lists this — flagged again because it's a different registrar with different paperwork)
- [ ] **Email forwarders** via Cloudflare Email Routing (free):
  - [ ] `admin@setnayan.com` → personal Gmail
  - [ ] `dpo@setnayan.com` → DPO email
  - [ ] `vendors@setnayan.com` → personal Gmail
  - [ ] `hello@setnayan.com` → personal Gmail
- [ ] **DKIM / SPF / DMARC DNS records** on `setnayan.com` — required by Resend for deliverability; without these, every transactional email lands in spam
- [ ] **Slack workspace** for Better Stack alert routing (Tier 4.3 doesn't surface that critical alerts need a Slack destination)

**Spec refs:** iteration 0028, iteration 0035.

### 8.3 Code/library installs (npm — referenced in specs but not in `apps/web/package.json`)

#### 8.3a — Validation + form handling

- [ ] **`zod`** — runtime schema validation for Server Actions + API request bodies
- [ ] **`react-hook-form`** — form handling pattern (current actions use raw FormData)
- [ ] **`date-fns`** (or `dayjs`) — date/time math + PH timezone formatting

#### 8.3b — Localization

- [ ] **`next-intl`** (or `i18next`) — i18n framework
- [ ] Locale files — `apps/web/locales/dashboard.{en,tl}.json` (iteration 0025)

#### 8.3c — Caching & offline (per `02_Specifications/Caching_and_Offline_Strategy.md` locked 2026-05-14)

- [ ] **`@tanstack/react-query`**
- [ ] **`@tanstack/query-sync-storage-persister`**
- [ ] **`workbox-window`** + **`workbox-precaching`** (extend existing `sw.js`)
- [ ] **`useTrackedMutation`** wrapper at `apps/web/lib/use-tracked-mutation.ts`
- [ ] ESLint rule **`setnayan/no-raw-mutation`** (custom plugin)
- [ ] `NEXT_PUBLIC_CACHE_BUSTER` in Vercel + CI bump on schema change

#### 8.3d — File preview + readers (iteration 0019 § file viewers)

- [ ] **`mammoth`** — `.docx` → HTML reader for chat attachments
- [ ] **`xlsx`** (SheetJS) — `.xlsx` / `.csv` reader for chat attachments

#### 8.3e — Document + image generation

- [ ] **`pdf-lib`** (or `jsPDF`) — BIR Official Receipts + Form 2307 PDFs (iteration 0026)
- [ ] **`sharp`** — server-side image processing (Next.js Image, vendor logo resize, render thumbnails)

#### 8.3f — Render pipeline (Phase 7 of `Install_Sequence_V1.md`)

- [ ] **Remotion** — programmatic video rendering (0011 + SDE + 0017). ~~0024~~ dropped from this list 2026-05-16 (Save-the-Date retired)
- [ ] **`lottie-web`** (or `@lottiefiles/lottie-player`) — animated overlay rendering
- [ ] **FFmpeg binary** on Cloudflare Workers + Hetzner VMs
- [ ] **LUT files** (`.cube` color-grading) — ~30 files for V1 catalog feel categories

#### 8.3g — Security + utility

- [ ] **Cloudflare Turnstile** (or hCaptcha) — bot protection on `/signup`, `/login`, `/register-vendor`, `/[slug]/redeem`
- [ ] **`nanoid`** — short-lived token IDs (non-canonical entities)

#### 8.3h — Tour migration

- [ ] **`driver.js`** — migrate hand-rolled tour (iteration 0030); ship 11 per-surface mini-tours

#### 8.3i — Service SDK installs

- [ ] **`@anthropic-ai/sdk`** — Claude API client (Tier 5.4 covers account signup; this is the npm install)
- [ ] **`daily-js`** — Daily.co video SDK (Tier 1.5 covers account signup; this is the npm install)
- [ ] **`@aws-sdk/client-s3`** (or `aws4fetch`) — R2 client (Tier 1.4 covers buckets; this wires the upload path)
- [ ] **`@sentry/nextjs`** — Sentry SDK (Tier 4.1 covers account signup)
- [ ] **`posthog-js`** — PostHog SDK (Tier 4.2 covers account signup)

### 8.4 Database extensions (Postgres / Supabase)

- [ ] **`pg_trgm`** extension — required for `match_inbox_to_order` 4-tier fuzzy reconciliation matcher (iteration 0034 § 11). Currently only `pgcrypto` enabled.
- [ ] Verify **`uuid-ossp`** extension is enabled (Supabase default — confirm)

### 8.5 Infrastructure / configuration

- [ ] **Vercel Pro plan upgrade** ($20/mo) — currently Hobby. Unlocks Vercel Cron + Vercel Log Drains + longer function timeouts + bigger build minutes.
- [ ] **Cron infrastructure** — pick ONE: Vercel Cron OR Cloudflare Cron Triggers. Required for 6 scheduled jobs:
  - [ ] Monthly team-pool allocation (0023 § 10b)
  - [ ] 24-hr payment expiry sweep (0034)
  - [ ] Face vector retention sweep (0012 + RA 10173)
  - [ ] Reconciliation matcher run (0034 § 11) every 5 min
  - [ ] R2 hot-to-IA tier migration (0009/0012)
  - [ ] Quarterly template tally (Sample Refresh Program)
- [ ] **Vercel KV** or **Upstash Redis** — rate-limit layer for iteration 0033 Public API tiers
- [ ] **Cloudflare Email Routing** activated on `setnayan.com` for forwarders in Tier 8.2
- [ ] **Cloudflare WAF rules** — basic bot/scraper protection at edge (Phase 9 hardening)
- [ ] **`developers.setnayan.com`** subdomain → static placeholder (V1.5 Public API portal prep, iteration 0033)
- [ ] **OAuth + PKCE plumbing** — `oauth_clients` table + 16-scope registry + refresh-token rotation
- [ ] **Supabase Pro plan upgrade** (~$25/mo) — flip when approaching 500 MB DB cap or when PITR backups needed (Phase 9)
- [ ] **Firebase project** (`setnayan-prod` + `setnayan-staging`) — for ML Kit Android face detection in Phase 2 native Papic
- [ ] **Vercel Log Drains** → Better Stack — pipe app logs for indexing (depends on Vercel Pro)

### 8.6 Content / assets

- [ ] **Cormorant Garamond webfont** — primary display typeface (iteration 0015)
- [ ] **Manrope webfont** — primary body typeface
- [ ] **DM Mono webfont** — accent typeface
- [ ] **Color name library** (~300 entries) — Mood Board name-autocomplete dataset (iteration 0010)
- [ ] **Music catalogue** (~400 Suno-generated tracks) → R2 `/music_catalogue/{category}/`
- [ ] **Template library JSON manifests** — 30 V1 templates at `/template_library/{feel_category}/TPL_{nnn}.json`
- [ ] **Render assets** — 30 Remotion components + 30 LUT files (Phase 7 engineering)
- [ ] **`catalogue_manifest.json`** + **`library_index.json`** — master indices on R2
- [ ] **`01_Contracts/Suno_Premier_License.md`** — license documentation (Tier 5.5 marked TBD)
- [ ] **`01_Contracts/DTI_Certificate.pdf`** — file after Tier 8.1 DTI registration completes
- [ ] **Vendor SDK signed agreements** — 4 PDFs (Canon, Nikon, Sony, Fujifilm) at `01_Contracts/` after Tier 6 approvals

### 8.7 Tier 8 summary

| Bucket | Items |
|---|---|
| 8.1 Business / Legal / Tax | 6 |
| 8.2 Domain + email | 7 |
| 8.3 npm packages | 25 |
| 8.4 DB extensions | 2 |
| 8.5 Infrastructure / config | 10 |
| 8.6 Content / assets | 10 |
| **Tier 8 total** | **60** |

Of these, ~50 are genuinely new (not previously listed in Tiers 1–7); ~10 are duplicated from earlier tiers for visibility.

---

## Tier 9 — Traffic Monetization (V1.1 · added 2026-05-19 · 0039 retired same-day)

Items unlocking iteration [0038 Editorial & Affiliates](0038_editorial_and_affiliates/0038_editorial_and_affiliates.md) + the existing [Boosted Ads Activation Playbook](09_Operations/Boosted_Ads_Activation_Playbook.md). None of these are V1 launch-blocking — they pair with the editorial content cadence that begins ramp post-launch.

**0039 Display Ads RETIRED 2026-05-19** — AdSense-for-YouTube inactivity deactivation on the owner's Google account blocks AdSense-for-Content enrollment (Path A chosen). All AdSense + cookie-consent + Privacy Policy NPC re-file items removed from this tier. Full context: CLAUDE.md decision log Ninth 2026-05-19 row.

### ~~9.1 Google AdSense publisher account~~ 🚫 REMOVED 2026-05-19

This section removed when 0039 retired. AdSense is not in V1.1 scope. Tombstone reference for future agents:

- Future-revisit gate: if Setnayan incorporates as a registered corporation (separate corporate TIN + Google account) AND editorial + Boosted Ads revenue prove insufficient post-V1.1, a NEW iteration (not 0039 revival) can re-spec display ads from clean state with a different ad-network choice

### 9.2 Involve Asia affiliate-network signup

Primary affiliate network for 0038 `/recommendations` curated picks. Deepest PH merchant coverage (Klook, Lazada, Shopee, Agoda, Trip.com, BDO, Vivere).

- [ ] Owner signs up at `https://involve.asia`
- [ ] Identity verification + W-8BEN-equivalent for payouts
- [ ] PH bank account on file + BIR TIN for tax reporting
- [ ] Apply to specific merchant programs as the editorial picks list grows (most auto-approve; a few require editorial review)
- [ ] Set up postback URL: `https://setnayan.com/api/affiliates/postback?network=involve_asia`
- [ ] API key + per-merchant offer IDs documented in `apps/web/.env.example`:
  ```
  INVOLVE_ASIA_API_KEY=
  INVOLVE_ASIA_POSTBACK_SECRET=
  ```
- [ ] First 5 merchant offers loaded into `affiliate_links` table at editorial-launch
- **Lead time:** Signup ~3-7 days · per-merchant approval ~1-7 days
- **Cost:** Free signup · Involve Asia takes 5% net of commission · Setnayan keeps the rest

### ~~9.3 Privacy Policy update + NPC re-filing for AdSense cookies~~ 🚫 REMOVED 2026-05-19

This section removed when 0039 retired. RA 10173 posture for V1.1 is satisfied by:

- PostHog opt-out (already in 0025 Profile Settings → Privacy & Data tab) — first-party analytics consent
- No third-party trackers means no additional processor disclosure needed
- No cookie-consent banner is required (PostHog is first-party with its own opt-out; no AdSense to disclose)

If a future iteration introduces any third-party tracker, the Privacy Policy update + NPC re-filing will be needed then — but it's not in V1.1 scope.

### 9.4 Featured-vendor lookbook (V1.1 marketing deliverable)

For the [Boosted Ads Activation Playbook](09_Operations/Boosted_Ads_Activation_Playbook.md) outbound motion.

- [ ] 1-page PDF design produced (designer or owner via Figma)
- [ ] Cover + tier table + 30-day performance projection range + "How to apply" + testimonial slot
- [ ] Stored at `04_Marketing/Featured_Vendor_Lookbook_2026Q3.pdf`
- [ ] Linked from the 0022 marketplace-presence upsell modal as "Download the placement guide"
- [ ] Refresh quarterly with updated performance data from 0023 § 3.8 Funnels
- **Owed:** 2026-06-15
- **Cost:** Internal (no external spend)

### 9.5 Engineering action (single-row reminder)

- [ ] Seed `promo_codes` row for `BOOSTED-LAUNCH-2026` — 20% off month 1 · cap 30 redemptions · expires 2026-06-30 · auto-applies on `vendor_marketing_subscriptions.first_purchase = TRUE` until cap is hit

---

## Pre-build verification checklist

Before handing off to Claude Code, verify all of the following are checked:

- [ ] Section 1 — Infrastructure: all 6 items checked
- [ ] Section 2 — Payment + Ops: items 2.1, 2.2, 2.3 checked (2.4 can wait for V1.5)
- [ ] Credentials populated in shared `.env.example` template (no real secrets in git!)
- [ ] Each Setnayan Team member has dev access to: GitHub, Vercel, Supabase, Cloudflare R2, Daily.co
- [ ] `production` and `staging` environments smoke-tested (you can hit a hello-world endpoint on each)

When all boxes are checked, hand off to Claude Code with the `CLAUDE_Code_Build_Prompt.md` document and the build can begin.

## Estimated time-to-complete

- Tier 1 (Infrastructure): ~3 hours admin work + 1-2 days waiting for domain DNS + Vercel verification
- Tier 2 (Payment + Ops): ~1 hour admin work + 1-2 weeks waiting for DTI/BIR approvals (can be parallel)
- Tier 3 (Marketing + Content): ~1 hour admin + 2-4 weeks for music + template asset creation
- Tier 4 (Analytics + Monitoring): ~30 minutes (V1.1 timing, not blocking V1 launch)
- Tier 5 (Media + AI Pipeline): ~2 hours admin (Stream Live + Workers Paid + Claude API + YouTube channel) + 1 day for first YouTube broadcast activation
- Tier 6 (Native SDKs): ~2 hours admin work submitting SDK requests + **1–3 weeks of vendor approval waits in parallel** (Canon ~5–10d, Nikon ~7–14d, Sony ~7–14d, Fujifilm ~10–21d, Apple ~2–5d, Google Play ~1–3d)
- Tier 7 (Scheduling, Auth + Misc): ~1 hour admin work (Hetzner VM provisioning + Mapbox account + Cron job config); V1.5 items are placeholder-only

**Total blocking time:** 8-12 hours of admin work + 1-3 weeks of approval waits in parallel (DSLR SDKs are the longest pole; Apple Developer Program is the second-longest). Plan the Sprint 0 build (iteration 0013) to run concurrently with the approval waits where possible.

---

*This checklist is the contract between strategy/ops and engineering. Building without these prereqs in place produces code that doesn't ship to production. When all items are checked, sign off here:*

**Checklist completed:** ☐  ____________________________  Date: __________

**Signed by Ops Lead:** ____________________________  Date: __________
