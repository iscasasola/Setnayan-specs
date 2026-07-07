# Install Sequence V1 — Complete (80 items across 10 phases)

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main)
> **This doc is HISTORICAL/REFERENCE.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. This is a 2026-05-14 forward plan; much of it has since landed or been retired. Deltas:
> - **Several "queued" items have SHIPPED** since this plan: TanStack Query + persister, Sentry, PostHog, `sharp`, the PWA service worker, the live app surfaces (couple/vendor/admin dashboards, marketplace, day-of) and the apply-then-pay payments spine are all on origin/main. Re-audit against `Installed_Stack_Inventory.md` + `supabase/migrations/` rather than trusting the ✅/🚧 marks here.
> - **RETIRED / changed items in this plan:** **BIR (0026)** is retiring (item #2 Form 2303 / #4 accountant / #53 receipt PDFs are no longer V1 ship-blockers); **video meetings (0019)** are retired — couples/vendors use external tools, so item #56–58 (Daily.co) are dropped; the **customer token wallet (0003)** stays retired and the planner is **"Setnayan AI" ₱3,999** (not Concierge); commission is **0%**.
> - **Native apps (Phase 10 §A):** the chosen architecture is a **Capacitor remote-URL WebView** loading hosted setnayan.com (Android built, PR #1044), NOT a from-scratch native build — the App Store / Play Console / DSLR-SDK long-leads still apply for the true-native Papic slice but the "rest of app" goes native via the shell.
> - **Driving constraint:** the "wedding 2026-12-18 / 217 days" framing is from 2026-05-14 and is now stale as a countdown. Today is 2026-06-07; the public-launch target and per-phase calendars should be re-derived from current `STATUS.md`, not this snapshot.
>
> When this body disagrees with the above, **the above wins.**

**Locked:** 2026-05-14
**Owner:** Ice (Setnayan founder)
**Driving constraint:** Owner's wedding **2026-12-18** (217 days from today)
**Strategy:** Web-first V1. Native apps + DSLR SDKs deferred to Phase 2 (post-December).

This document is the canonical install plan replacing the partial prior sequence. It covers everything surfaced in the 10-pass audit: 33 external service signups + 25 code/library installs + 2 Postgres extensions + 10 infrastructure/config items + 10 content/assets = **80 items total**.

Status legend matches `Installed_Stack_Inventory.md`:
- ✅ Live · 🟡 Installed not configured · 🚧 Queued · ⛔ Blocked on prior item

---

## Phase 1 — This week · Foundation + Owner Action Long-Leads

Goal: kick off everything with multi-week wait times TODAY so they clear in parallel. Most of these are 10–60 minute admin actions you handle yourself; engineering wiring is light.

### A. Business / Legal / Tax (kick off today, runs 2–6 weeks in parallel)

| # | Item | Why it must start now | Time | Owner action |
|---|---|---|---|---|
| 1 | **DTI Single Proprietorship registration** | Prerequisite for items 2–4, 5–8, AND camera SDK applications | 30 min online + 5–10 day approval | ✅ Required |
| 2 | **BIR Form 2303 Certificate of Registration** | Required for issuing Official Receipts (0026) | 2–3 hr at RDO + 1–2 wk approval | ✅ Required |
| 3 | **Mayor's Permit** | Business permit from headquartered city | Half-day + 1–2 wk approval | ✅ Required |
| 4 | **BIR accountant relationship** | Quarterly Form 2307 + eFPS filings (0026) | 1 hr initial mtg | ✅ Required (~₱5K/mo retainer) |
| 5 | **DPO appointment + NPC registration** | RA 10173 compliance — needed before public launch | 30 min + ₱500 fee | ✅ Required |
| 6 | **BDO business savings account** (in Setnayan's registered name) | Receiving payments per 0034 | 1–2 hr branch visit + 5 day verification | ✅ Required |
| 7 | **GCash business account** (separate from personal) | Receiving payments per 0034 | 30 min in-app | ✅ Required |
| 8 | **`setnayan.ph` domain registration** via PHNic | Secondary brand domain | 30 min + 1 day approval | ✅ Required |

### B. Email infrastructure (signup + wiring this week)

| # | Item | Owner action | Engineering |
|---|---|---|---|
| 9 | **Resend account** + add `setnayan.com` sending domain | 15 min | — |
| 10 | **DKIM / SPF / DMARC DNS records** on `setnayan.com` | 10 min paste into Vercel DNS | — |
| 11 | **Email forwarders** (`admin@`, `dpo@`, `vendors@`, `hello@`) via Cloudflare Email Routing | 15 min | — |
| 12 | **`RESEND_API_KEY` + `RESEND_FROM_ADDRESS`** in Vercel env | 5 min | — |
| 13 | Verify 0028 — 10 transactional templates start sending | — | 30 min smoke test |

### C. Observability (signup + wiring this week)

| # | Item | Owner action | Engineering |
|---|---|---|---|
| 14 | **Sentry** account + `SENTRY_DSN` + `SENTRY_AUTH_TOKEN` | 10 min | — |
| 15 | **PostHog** account + `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST` | 10 min | — |
| 16 | **Better Stack** account + uptime monitor on `/health` + log drain destination | 15 min | — |
| 17 | **Slack workspace** for Better Stack alert routing | 10 min | — |
| 18 | Install `@sentry/nextjs` + `posthog-js` | — | half-day |
| 19 | Write `/api/health/deep` endpoint (DB + R2 + Resend pings) | — | half-day |
| 20 | **Vercel Log Drains** → Better Stack (requires Vercel Pro — see Phase 2) | — | 30 min |

### D. Brand assets + license docs

| # | Item | Owner action | Engineering |
|---|---|---|---|
| 21 | **`01_Contracts/Suno_Premier_License.md`** — file license terms documentation | 30 min | — |
| 22 | File **DTI Certificate PDF** at `01_Contracts/DTI_Certificate.pdf` | 5 min after item #1 | — |

**Phase 1 effort:** ~8 hours owner admin + 1.5 days engineering. Bottleneck = waiting for items 1–6 government approvals (parallel, runs into Phase 2–3).

---

## Phase 2 — Weeks 2–3 · Caching & Offline Foundation + Vercel Pro

Goal: install the cache layer that 0031 day-of guest experience depends on. Vercel Pro upgrade unlocks Cron + Log Drains + bigger function limits.

| # | Item | Why | Effort |
|---|---|---|---|
| 23 | **Vercel Pro plan upgrade** ($20/mo) | Unlocks Vercel Cron (alternative to Cloudflare Cron Triggers), Log Drains (item #20), longer function timeouts | 5 min |
| 24 | Install **`@tanstack/react-query`** + **`@tanstack/query-sync-storage-persister`** | Caching & Offline data layer per locked spec | 1 day |
| 25 | Install **`workbox-window`** + **`workbox-precaching`** — extend `apps/web/public/sw.js` | Asset layer per locked spec | 2 days |
| 26 | Write **`useTrackedMutation`** wrapper + ESLint rule `setnayan/no-raw-mutation` | Cache-invalidation discipline | half-day |
| 27 | Set `NEXT_PUBLIC_CACHE_BUSTER` in Vercel + CI bump on schema change | Schema-version safety | 30 min |
| 28 | Install **`zod`** | Runtime validation for Server Actions (referenced in every iteration's tests.md) | 1 day to migrate hot paths |
| 29 | Install **`react-hook-form`** | Form-handling pattern (current actions use raw FormData) | half-day for boilerplate |
| 30 | Install **`date-fns`** | Date math + PH timezone formatting | half-day |
| 31 | Install **`next-intl`** (or `i18next`) + create `dashboard.en.json` + `dashboard.tl.json` locale files | 0025 EN/TL toggle wired | 2 days |
| 32 | Install **`nanoid`** | Short-lived tokens (non-canonical entities) | 5 min |
| 33 | Sprint 0 acceptance test suite — cold-visit Lighthouse, 75 MB LRU fill, sensitive-data audit | Caching spec § 9 acceptance criteria | 1 day |

**Phase 2 effort:** ~6–7 engineering days.

---

## Phase 3 — Weeks 3–5 · V1-Critical UI (Day-of + Marketplace + Brand Polish)

Goal: ship the two largest spec/code gaps surfaced in App_Build_Status.md. Without these, December 18 wedding has nothing for guests on the day and the marketing site's "browse vendors" CTA goes nowhere.

| # | Item | Why | Effort |
|---|---|---|---|
| 34 | **0031 live-event mode** — 6 day-of cards + T-1hr→T+8hr auto-activation + offline-first PWA shell | Ship-blocker for Dec 18 | 5–7 days |
| 35 | **0006 public marketplace** — `/vendors` browse, DIY filter popup (11 chips + 7 sorts), vendor landing page, reviews UI | 0015 marketing site's CTA needs this | 4–5 days |
| 36 | Load **Cormorant Garamond** webfont | 0015 brand voice | 30 min |
| 37 | Load **Manrope** webfont | 0015 brand voice | 30 min |
| 38 | Load **DM Mono** webfont | 0015 brand voice | 30 min |
| 39 | **Color name library** (~300 entries) — author/source the name-autocomplete dataset for Mood Board (0010) | Spec calls for it but data file doesn't exist | 1 day |

**Phase 3 effort:** ~10–12 engineering days. Phase 4 runs in parallel.

---

## Phase 4 — Weeks 4–6 (parallel with Phase 3) · R2 Wiring + DB extensions

Goal: actually use the 4 R2 buckets that are provisioned. Today every "R2-backed" upload writes to Supabase Storage instead.

| # | Item | Why | Effort |
|---|---|---|---|
| 40 | Install **`@aws-sdk/client-s3`** (or `aws4fetch` for smaller bundle) + write `lib/r2.ts` signed-URL helper | R2 client wiring | 1 day |
| 41 | Enable **`pg_trgm`** Postgres extension | Required for 0034 § 11 fuzzy reconciliation matcher (currently no fuzzy SQL) | 5 min migration |
| 42 | Verify **`uuid-ossp`** Postgres extension is enabled (Supabase default) | UUID generation | 5 min check |
| 43 | Swap **vendor logo upload** → R2 (`setnayan-media`, Phase 6 of OWNER_ACTIONS) | Mandatory logo at vendor registration | half-day |
| 44 | Swap **payment screenshot upload** → R2 (`setnayan-media`) | 0034 reconciliation evidence | half-day |
| 45 | Swap **thread file attachments** → R2 (`setnayan-thread-files`) | 0019 with thread-scoped access | half-day |
| 46 | Wire **vendor contract uploads** → R2 (`setnayan-vendor-contracts`) | V1 manual signing per § 12.1 | half-day |

**Phase 4 effort:** ~3 engineering days.

---

## Phase 5 — Weeks 6–10 · AI Capabilities + Render-Adjacent Libraries

Goal: unlock the premium-tier revenue SKUs (Contract Intelligence + AI Highlights + SDE) and install the libraries the render pipeline will need.

### A. AI signup + wiring

| # | Item | Owner action | Engineering |
|---|---|---|---|
| 47 | **Anthropic Console** account + `ANTHROPIC_API_KEY` + ₱5K/mo spend cap + enable prompt caching | 30 min | — |
| 48 | Install **`@anthropic-ai/sdk`** | — | 2 hr |
| 49 | Wire **0032 Contract Intelligence** (₱199/contract paid upgrade) | — | 4–5 days |
| 50 | Wire **0011 AI Video Highlight (60s)** storyline-arc prompt | — | 3 days |
| 51 | Wire **0011 AI Edited Highlight (3-min)** storyline-arc prompt | — | 3 days |
| 52 | Wire **SDE (3–5 min)** storyline-arc prompt + same-day delivery flow | — | 4 days |

### B. PDF + image processing

| # | Item | Why | Effort |
|---|---|---|---|
| 53 | Install **`pdf-lib`** (or `jsPDF`) | BIR Official Receipts + Form 2307 PDFs (0026) | half-day |
| 54 | Install **`sharp`** | Server-side image processing (Next.js Image, vendor logo resize, render thumbnails) | half-day |
| 55 | **Cloudflare Turnstile** account + integration on `/signup`, `/login`, `/register-vendor`, `/[slug]/redeem` | Bot protection on V1 entry points | 1 day |

**Phase 5 effort:** ~3 owner hours + 16–18 engineering days. The largest engineering chunk; lands the premium revenue SKUs.

---

## Phase 6 — Weeks 8–12 · Video meetings + File preview pipeline

Goal: 0019 partial → complete. Video calls on chat threads + in-app file preview for `.docx` / `.xlsx`.

| # | Item | Owner action | Engineering |
|---|---|---|---|
| 56 | **Daily.co** account + `DAILY_API_KEY` + `DAILY_DOMAIN` + Singapore region | 15 min | — |
| 57 | Install **`daily-js`** SDK + wire video meeting button on chat threads | — | 3 days |
| 58 | Daily.co recording-completed webhook → R2 `setnayan-thread-files` | — | half-day |
| 59 | Install **`mammoth`** — `.docx` → HTML reader for chat attachments | — | half-day |
| 60 | Install **`xlsx`** (SheetJS) — `.xlsx`/`.csv` reader for chat attachments | — | half-day |
| 61 | Provision Cloudflare Queue worker with **LibreOffice headless** for preview generation (first-page PNG for `.docx` / `.xlsx` / `.pdf`) | — | 2 days |

**Phase 6 effort:** ~6 engineering days.

---

## Phase 7 — Weeks 10–14 · Render Pipeline (Live Stream + Save-the-Date + AI Highlights + Patiktok)

Goal: the heaviest single engineering chunk — actually render videos. Save-the-Date UI is live but renders nothing today; Live Stream specs are locked but the relay doesn't exist.

### A. Cloudflare infrastructure

| # | Item | Owner action | Engineering |
|---|---|---|---|
| 62 | **Cloudflare Workers Paid plan** ($5/mo) on existing CF account | 5 min | — |
| 63 | Enable **Cloudflare Stream Live** + provision SFU ingest + ultra-low-latency mode | 30 min | 2 days wiring |
| 64 | Provision **Cloudflare Queues**: `reel-render-queue`, `std-render-queue`, `ai-highlight-queue` | 15 min | 1 day worker code |
| 65 | **Cron infrastructure** — pick Vercel Cron (Phase 2 unlocked it) OR Cloudflare Cron Triggers for 6 scheduled jobs (team-pool, payment expiry, face vector retention, reconciliation matcher, R2 tier migration, quarterly tally) | 30 min config | 1 day |

### B. YouTube delivery (Live Stream)

| # | Item | Owner action | Engineering |
|---|---|---|---|
| 66 | Create **YouTube master channel `@SetnayanWeddings`** under Setnayan Google account; verify NOT in YPP | 1 hr + 24 hr channel-activation wait | — |
| 67 | **Google Cloud project** + YouTube Data API v3 + OAuth credentials | 30 min | — |
| 68 | Wire `liveBroadcasts.insert` (monetization OFF, latency ultraLow) + `liveStreams.insert` → Cloudflare Stream RTMP relay | — | 3 days |

### C. Render libraries + assets

| # | Item | Why | Effort |
|---|---|---|---|
| 69 | Install **Remotion** | Programmatic video rendering | 1 day setup |
| 70 | Install **`lottie-web`** (or `@lottiefiles/lottie-player`) | Animated overlay rendering for monograms + intros/outros | half-day |
| 71 | Install **FFmpeg** binary on Cloudflare Workers + Hetzner VMs | Base render dependency | 1 day Workers config |
| 72 | Author **30 LUT files** (`.cube` color-grading lookup tables) for V1 template catalog feel categories | One per template "feel category" | 2–3 days |
| 73 | Author **30 Remotion components** — one per V1 template (Capiz Garden, Editorial Cream, Bridgerton Pastel, etc.) | One per template | 10–15 days |
| 74 | Author **30 `manifest.json` files** at `/template_library/{feel}/TPL_{nnn}.json` + publish `library_index.json` | Template manifests + master index | 2 days |
| 75 | Suno music catalogue continues (parallel manual workstream) → upload to R2 `/music_catalogue/{category}/` → publish `catalogue_manifest.json` | Music for renders | runs in parallel |

### D. Rate limiting

| # | Item | Why | Effort |
|---|---|---|---|
| 76 | **Vercel KV** or **Upstash Redis** account + integration | 0033 Public API rate-limit tiers (free 100/min · Pro 1K/min · Enterprise 10K/min); also useful for general endpoint protection | 1 day |

**Phase 7 effort:** 30+ engineering days. The biggest phase. Without this, AI Highlights + SDE + Save-the-Date renders all produce nothing.

---

## Phase 8 — Anytime · Mapping + Guided Tour Polish

| # | Item | Owner action | Engineering |
|---|---|---|---|
| 77 | **Mapbox** account + API token (referrer-restricted) | 10 min | — |
| 78 | Integrate venue pin on 0015 marketing, 0006 vendor detail, 0021 couple dashboard | — | 2 days |
| 79 | Migrate hand-rolled tour → **Driver.js** + ship 11 per-surface mini-tours (0030) | — | 3 days |

**Phase 8 effort:** ~5 engineering days. Low priority; static address text works for V1 launch.

---

## Phase 9 — Weeks 14–18 · Pre-launch Hardening

| # | Item | Why | Effort |
|---|---|---|---|
| 80 | **Supabase Pro plan upgrade** (~$25/mo) IF approaching Free-tier 500 MB DB cap | Database scale + PITR backups | 5 min |
| 81 | **Cloudflare WAF rules** — basic bot/scraper protection at the edge | Production hardening | 1 hr |
| 82 | **Hetzner Cloud** account + 2× CPX21 VMs (HEL1) with Docker + FFmpeg + queue worker | Render-pipeline fallback when Workers hit 30s CPU limit | 1 day |
| 83 | **`developers.setnayan.com`** subdomain → static placeholder page | V1.5 Public API portal prep | 30 min |
| 84 | **OAuth + PKCE plumbing** — `oauth_clients` table + 16-scope registry + refresh-token rotation (0033) | V1.5 Public API foundation | 3 days |

**Phase 9 effort:** ~5 engineering days.

---

## Phase 10 — Post-December · Phase 2 / V1.5 (start long-leads now in parallel)

These don't ship in V1 but the signup waits are long. Submit applications in October so they clear by January Phase 2 kickoff.

### A. Native binaries + DSLR SDKs

| # | Item | Earliest submit | Approval wait |
|---|---|---|---|
| 85 | **Apple Developer Program** ($99/yr) — identity verification | 2026-10-01 | 2–5 days, sometimes 2 wk |
| 86 | **Google Play Console** ($25 one-time) | 2026-10-15 | 1–3 days |
| 87 | **Canon EOS Camera Connect SDK** | 2026-10-01 | 5–10 business days |
| 88 | **Nikon SnapBridge / MTP-WiFi SDK** | 2026-10-01 | 7–14 business days |
| 89 | **Sony Camera Remote SDK** | 2026-10-01 | 7–14 business days |
| 90 | **Fujifilm Camera Remote SDK** (longest, has MFi-style review) | 2026-10-01 | 10–21 business days |
| 91 | **Firebase project** (`setnayan-prod` + `setnayan-staging`) — for ML Kit Android face detection | anytime | 5 min |
| 92 | File signed SDK agreements at `01_Contracts/{Canon,Nikon,Sony,Fujifilm}_SDK_Agreement.pdf` | after approvals | — |

### B. Automated payments + SMS

| # | Item | Earliest submit | Approval wait |
|---|---|---|---|
| 93 | **GCash Merchant API** application | 2026-07-01 (after 90 days of V1 transaction history) | 4–6 weeks |
| 94 | **PayMongo** sandbox application (backup processor) | 2026-08-01 | 1–2 weeks |
| 95 | **Twilio / Globe / Smart** SMS gateway | 2026-11-01 (V1.5) | 1 week |

### C. E-signature

| # | Item | Earliest submit | Approval wait |
|---|---|---|---|
| 96 | **PandaDoc** or **DocuSign** subscription | V1.5 | immediate |

---

## Critical-path diagram

```
PHASE 1 (this week — business + email + observability)
    ↓
PHASE 2 (weeks 2–3 — caching + Vercel Pro)
    ↓
PHASE 3 (weeks 3–5 — day-of + marketplace) ───┐
    │                                          │
PHASE 4 (weeks 4–6 — R2 wiring, parallel)     │
    │                                          ↓
    └──────────────────────────→  DEC 18 V1 READY (minimum viable)
    │
PHASE 5 (weeks 6–10 — AI Highlights + Contract Intelligence)
    │
PHASE 6 (weeks 8–12 — video meetings + file preview)
    │
PHASE 7 (weeks 10–14 — render pipeline + Live Stream + Patiktok)
    │
PHASE 8 (anytime — mapping + tour polish)
    │
PHASE 9 (weeks 14–18 — pre-launch hardening)
    ↓
SETNAYAN V1 PUBLIC LAUNCH (target: late November / early December 2026)
    │
PHASE 10 (post-December — Phase 2 + V1.5 long-leads, applications submitted Oct)
```

**Minimum viable December wedding** = Phases 1 + 2 + 3 + (partial 4). Anything from Phase 5 onward enhances launch but doesn't block your wedding ceremony.

**Recommended public launch** = Phases 1–8 done. Phase 9 hardening + Phase 10 long-leads run in parallel.

---

## Item count per phase

| Phase | Items | Days | Cost added |
|---|---|---|---|
| 1 — Foundation + Owner long-leads | 22 | 1.5 eng + 8 hr admin | ~₱10K setup + ₱5K/mo accountant |
| 2 — Caching + Vercel Pro | 11 | 6–7 eng | $20/mo Vercel Pro |
| 3 — V1-critical UI | 6 | 10–12 eng | — |
| 4 — R2 + DB extensions | 7 | 3 eng | — |
| 5 — AI + PDF | 9 | 16–18 eng | ~₱5K/mo Anthropic + bot protection cost |
| 6 — Video + file preview | 6 | 6 eng | ~$50/mo Daily.co |
| 7 — Render pipeline | 15 | 30+ eng | $5/mo Workers + Stream usage |
| 8 — Mapping + tour | 3 | 5 eng | — |
| 9 — Pre-launch hardening | 5 | 5 eng | ~$25/mo Supabase Pro + ~$15/mo Hetzner |
| 10 — Phase 2 / V1.5 (post-Dec) | 12 | (post-Dec) | $99 Apple + $25 Google + SDK $0 + V1.5 misc |
| **Total** | **96 items, 80 install-surface** | **80+ eng + 8 hr admin** | **~$130/mo runtime + one-time setup** |

(96 items = the 80 install-surface items + 16 wiring/engineering subtasks)

---

## How to use this doc

1. **Each phase has a checklist** — mark items off as you complete them
2. **Long-leads start TODAY** — Phase 1 items 1–8 + Phase 10 items 85–94 can be submitted right now to clear approval waits
3. **Engineering phases are sequential** — Phase 2 must finish before Phase 3 day-of work can start (depends on cache layer)
4. **Each phase landing triggers a STATUS.md update** in the repo per the existing checkpoint pattern
5. **Re-run this doc's accuracy quarterly** — re-audit `Installed_Stack_Inventory.md` and flip items to ✅ as they land

---

## Cross-references

- **What's installed today:** [Installed_Stack_Inventory.md](../Installed_Stack_Inventory.md)
- **What ships per iteration:** [App_Build_Status.md](../App_Build_Status.md)
- **Account-level signup details:** [API_Integration_Checklist.md](../API_Integration_Checklist.md) (now extended with Tier 8 — Missing Items)
- **Per-iteration spec corpus:** `02_Specifications/` and `0NNN_*/` folders
- **Decision log:** `CLAUDE.md` decision-log table (all locked decisions referenced by ID)
