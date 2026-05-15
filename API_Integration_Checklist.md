# API Integration Checklist — Prereqs Before Code Starts

> Every external service, account, and integration that must exist *before* Claude Code (or any engineer) starts building. Locked 2026-05-12. Do not skip — building without these set up first will produce code that can't run end-to-end.

## Why this comes first

V1 is built on Vercel + Supabase + Cloudflare R2 + GitHub plus seven third-party integrations. The build sequence assumes these are live, billing is set up, and credentials are stored in a shared `.env.example` template. Building without them first produces code that runs locally but can't deploy to a real environment — wasteful.

**Estimated time to complete this checklist: 8–12 hours of admin work.** Most steps are 5–10 minutes each; a handful have multi-day to multi-week approval waits (PH bank account verification, NPC registration, Canon/Nikon/Sony/Fujifilm SDK access requests, Apple Developer Program identity verification).

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
- [ ] Provision three R2 buckets in PH region:
   - `setnayan-media` — couple/guest photos, paparazzi captures, save-the-date renders
   - `setnayan-thread-files` — chat attachments (0019)
   - `setnayan-vendor-verification` — vendor DTI/SEC/ID documents (private)
- [ ] Set R2 bucket policies — `setnayan-media` allows signed reads; `setnayan-thread-files` and `setnayan-vendor-verification` block all public reads
- [ ] Configure CORS for production + staging domains
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

- [ ] DTI (Department of Trade and Industry) — register Setnayan as Single Proprietorship OR upgrade to Corporation later
- [ ] BIR Form 2303 — Certificate of Registration
- [ ] Mayor's Permit (business permit from the city where Setnayan is headquartered)
- [ ] BIR Form 0605 + 1601C / 1601E — tax filing setup with accountant

**Cost:** ~₱5,000–10,000 total for full DTI + BIR + Mayor's Permit setup. Annual renewals apply.

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
- [ ] Setnayan Pay convenience fee repriced **3% → 5.5% on top of vendor price** (admin-configurable per method — see 0034 § 6 + 0023 § 3.5d)

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

## Tier 5 — Media + AI Pipeline (mandatory for Papic/Panood/AI Highlights · 2026-05-16: Save-the-Date dropped from this tier)

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

> **Reframed 2026-05-16.** Per the Panood architecture pivot, Setnayan no longer hosts a master YouTube channel for couple broadcasts. **Each couple OAuths their own YouTube channel** at Panood booking time, granting Setnayan write permission to their channel; the broadcaster UI pushes the active camera feed via RTMP to the couple's `liveBroadcasts` resource; the landing page embeds the couple's `liveBroadcasts.id` in an IFrame. Setnayan never touches a master Setnayan-owned YouTube channel for Panood. (Patiktok's `@SetnayanWeddings` master TikTok handle is a separate flow under § 7.2 — that one IS Setnayan-owned for the Setnayan-tier Patiktok SKU.)

- [ ] Set up Google Cloud project + YouTube Data API v3 client (Setnayan-owned)
- [ ] Configure OAuth 2.0 consent screen with verified-app status (required by YouTube for write-scope OAuth from third parties)
- [ ] Request OAuth scope verification from Google: `https://www.googleapis.com/auth/youtube` + `https://www.googleapis.com/auth/youtube.upload` (Google reviews the request; typical 1-4 weeks for verified-app status)
- [ ] Extend `oauth_grants` schema to persist per-couple YouTube refresh tokens + token expiry + granted scopes (one row per event, tied to `events.event_id`)
- [ ] Implement OAuth handshake at Panood SKU purchase time — couple completes consent in a popup, refresh token written to `oauth_grants`
- [ ] Implement `liveBroadcasts.insert` for the couple's channel with `monetizationDetails.monetization: false` and `contentDetails.latencyPreference: ultraLow` (couple decides monetization on their own channel post-event)
- [ ] Implement `liveStreams.insert` to get the RTMP ingest URL + stream key for the **broadcaster web UI's active-feed push** (not Cloudflare Stream relay — § 5.1 is retired)
- [ ] Landing-page IFrame embed: fetch the couple's `liveBroadcasts.id` from `oauth_grants` and render `https://www.youtube.com/embed/{video_id}` in the landing page's hero
- [ ] Token-refresh worker: nightly refresh of YouTube OAuth tokens within their 6-month inactivity window
- [ ] Revocation handling: if couple revokes YouTube access from their Google account, Setnayan dashboard shows "Re-authorize YouTube to continue broadcasting" with a one-tap re-OAuth button

**Cost:** Free (YouTube Data API quota is generous per-OAuth-client; per-couple OAuth means quota scales naturally with users without consuming Setnayan's daily quota budget).

**Spec refs:** `0011_panood/0011_panood.md` § Pricing — V1 SKU lock 2026-05-16, CLAUDE.md 2026-05-16 4th row, `0033_public_api_foundation/0033_public_api_foundation.md` § oauth_grants schema (extended for per-event YouTube refresh-token storage).

### 5.4 Anthropic Claude API — **LOCKED 2026-05-16**

- [ ] Sign up for Anthropic Console account under Setnayan-owned email
- [ ] Create workspace **"Setnayan"** within the console
- [ ] Set spend caps: **$500/month soft alert · $2,000/month hard cap · $100/day soft cap** (locked 2026-05-16)
- [ ] Generate API key, store in `.env` as `ANTHROPIC_API_KEY`
- [ ] Enable prompt caching on the contract-analysis prompt template (0032) and the AI-highlight scene-selection prompt (V1.5+ Papic)
- [ ] **Model config (2026-05-16 lock):**
  - Primary text model: **Claude Haiku 4.5** for Contract Intelligence (0032 text extraction) — ~80% cheaper than Sonnet, comparable accuracy on Filipino-language wedding contracts
  - Vision model: **Claude Sonnet 4.6** for AI Video Highlight + AI Edited Highlight (V1.5+ Papic) — reserved for when Papic ships
  - V1.5+ fallback: OpenAI GPT-4 (separate API key in `OPENAI_API_KEY` when needed)
- [ ] Add usage monitoring dashboard alert at 80% of monthly cap ($400/mo trigger)
- [ ] Unblocks 0032 Contract Intelligence for V1 ship — this was the last open dependency

**Cost (updated 2026-05-16):** ~**₱1 per contract analysis** (Haiku 4.5 input ~$0.80/M + output ~$4/M tokens). V1 spend at 500 analyses/month = ~$6.50/mo — well inside the $500/mo soft alert (4× safety margin). AI Highlights (Sonnet 4.6) cost line N/A until Papic V1.5+ ships.

**Spec refs:** `0032_contract_intelligence/0032_contract_intelligence.md`, `CLAUDE.md` 2026-05-16 marketplace/payment/verification lock row § 13 (Anthropic API setup).

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
