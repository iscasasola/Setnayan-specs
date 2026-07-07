# Setnayan V1 Gap-Analysis Status

> ## ⚠ AS-BUILT CORRECTION — 2026-06-29 (live-site / prod-DB sync)
>
> **Canonical = setnayan.com + [`AS_BUILT_GROUND_TRUTH_2026-06-07.md`](AS_BUILT_GROUND_TRUTH_2026-06-07.md) + [`Pricing.md § 00`](Pricing.md).** Where the body below disagrees, the live site wins. Current canon (prod DB 2026-06-29):
> - **AI planner = "Setnayan AI" ₱3,999** (paid first paywall) — the "Setnayan Concierge ₱4,999" / "₱1,499" / "free planner" names+prices are RETIRED.
> - **Commission = 0%**, every vendor booking, every tier — no 3%/5% Setnayan Pay cut.
> - **Vendor subs:** Solo ₱999/28d (₱9,999/yr) · Pro ₱2,499/28d (₱24,999/yr) · Enterprise ₱4,999/28d (₱49,999/yr) · verification FREE · 100 free tokens on verify · flat ₱100/token packs. Old ₱6,000/₱10,000 + ₱2,499/₱5,499 + per-week vendor prices are RETIRED.
> - **Couple website:** FREE 4-in-1 site (Save-the-Date · RSVP · Event · Editorial) + unlimited free RSVP + ONE **Couple Website PRO ₱1,999** upgrade. The separate RSVP / RSVP Pro / Event Website / Editorial Website à-la-carte SKUs are RETIRED.
> - **Animated Monogram ₱1,999** · **Live Studio** Mobile ₱1,299/day · Desktop ₱2,499/day (single-cam livestream FREE; YouTube via couple's OBS; device-repackaged 2026-07-08) · **Pakanta ₱2,499** (single SKU) · **Cinematic Reveal = ₱1,499** (STD Cinematic Openings) · **3D Plan ₱2,499** · **Thank You ₱2,499** · **Live Background ₱499** · **Kwento ₱299** · **Custom QR FREE**.
> - **Couple tiers:** Free ₱0 · Setnayan AI ₱3,999. **NO BUNDLES** — Essentials ₱12,999 + Complete ₱27,999 REMOVED 2026-06-29.

**Locked 2026-05-12. Last refreshed 2026-05-22 post 17-PR sprint** — PRs #272-#289 closed payments idempotency (#277), observability end-to-end (#275/#280/#289), health endpoints (#275), retired-strings lint guard (#276), email-link CI audit (#288), schema.org Pro pricing (#278), sitemap (#279), Patiktok + Pakanta marketing surfaces (#281), Setnayan Pay worked example + actor terminology sweep (#282), day-of PWA Phase 1 (#284), admin nav consolidation (#285), couple dashboard TILES expansion (#287).

**Previous refresh:** 2026-05-20 (0032 Contract Intelligence retirement + 51-migration burst).

This is the single-pane view of every Tier 1 / Tier 2 / Tier 3 gap item raised during the 2026-05-12 gap audit and where each one landed. Open any file path below directly to see the work.

---

## 🚀 2026-05-22 17-PR sprint — gap-resolution summary

| Gap (informal — not all are in the formal Tier 1/2/3 list) | Resolving PR(s) | Status flip |
|---|---|---|
| Payments idempotency / double-submit race conditions | #277 | 🔴 → ✅ |
| Health-check endpoints for uptime monitoring (Better Stack) | #275 | 🔴 → ✅ |
| Sentry production smoke-test path | #280 | 🟡 → 🟡 (endpoint wired, owner verification pending) |
| Observability typecheck — every server action instrumented | #289 | 🟡 → ✅ |
| CI guard against retired marketing strings (Pareto / Custom Monogram Pack) | #276 | n/a → ✅ |
| Email link validity CI audit | #288 | 🔴 → ✅ |
| schema.org `Offer` + `PriceSpecification` for Pro pricing | #278 | 🔴 → ✅ |
| Sitemap completeness (all live routes indexed) | #279 | 🔴 → ✅ |
| Patiktok + Pakanta marketing surface coverage | #281 | 🔴 → ✅ |
| Setnayan Pay worked example freshness | #282 | 🟡 → ✅ |
| Actor terminology sweep in marketing copy ("couple" → "customer/host") | #282 | 🔴 → ✅ |
| Day-of guest PWA Phase 1 (offline shell + service-worker fallback) | #284 | 🟡 → ✅ |
| Orphan rule enforcement — admin nav consolidation + dashboard TILES + vendor compare redirect | #274 + #285 + #287 | 🔴 → ✅ |
| Public Editorial + Concierge Brain consent in Privacy Policy v1 | #273 | 🟡 → ✅ |
| service_catalog price/feature corrections | #272 | 🟡 → ✅ |

**Net effect on Tier counters:** Tier 1 stays at 5/5. Tier 2 stays at 7/7. Tier 3 stays at 8/8. The new ✅ resolutions above sit outside the formal Tier 1/2/3 gap list — they're informal-but-load-bearing items surfaced during prior audit cycles (esp. the 2026-05-20 engineering-ownership audit) and resolved in today's autonomous PR burst.

---

## How to read this doc

Each gap item has 3 things you can inspect:

- **📄 Spec** — the `.md` engineering specification (open in any markdown viewer)
- **📘 Stakeholder mirror** — the `.docx` version (open in Word / Pages / Google Docs)
- **🖥️ Prototype** — interactive `.html` walkthrough (open in any browser; works offline)

Plus the **central anchors**:

- **`CLAUDE.md`** — decision log at the bottom captures every locked decision in chronological order. Scroll to the entries dated 2026-05-12 to see the full audit-trail of this session.
- **`01_Contracts/Setnayan_Vendor_Agreement.md`** — the binding vendor contract that captures § 9.1 (two-admin scope), § 10a (owner accounts), § 10b (team pool), § 12.1 (manual signing), § 1.1 + § 3.10 (vendor logo + chat masking)
- **`05_Financials/Pricing_Workbook_*.xlsx`** — every SKU including the new Contract Builder + E-Signature row

---

## Tier 1 — Legally required for V1 launch · **5/5 complete**

| # | Item | Status | Where it landed |
|---|---|---|---|
| 1 | Account deletion + data export (RA 10173 § 16(e) + § 18) | ✅ | **0025 Profile Settings** — Privacy & Data tab. Spec: `0025_profile_settings/0025_profile_settings.md`. Mirror: `0025_profile_settings/0025_profile_settings.docx`. Settings surface lives INSIDE the existing 0021/0022/0023 dashboards (per your direction) — not a new top-level surface. |
| 2 | BIR / tax compliance (ORs · VAT · EWT · Form 2307) | ✅ | **0026 BIR Tax Compliance** — Spec: `0026_bir_tax_compliance/0026_bir_tax_compliance.md`. 681 lines. Schema: 6 new tables + 8 column ALTERs. Effective-dated `setnayan_tax_config` so rate changes don't break historical ORs. **External tax accountant review gate before launch** flagged in spec. |
| 3 | E-signature for vendor contracts | ✅ | **Updated 2026-05-18:** (a) Manual signing flow per Vendor Agreement § 12.1 retained as fallback; (b) ~~0032 Contract Intelligence + Builder paid upgrade~~ **RETIRED 2026-05-18** — replaced by **free dual e-signature on every vendor contract** (no AI in V1). Migration `20260518200000_vendor_contracts_dual_esign_retire_0032.sql` flipped 0032 SKUs to `is_active=FALSE` and added vendor contract upload + dual-signature schema. Vendor uploads contract PDF, picks event/couple, both parties sign with canvas-captured signatures; signatures stored as PNG image URLs in R2 with IP + UA + timestamp (RA 8792 compliant). Notary integration explicitly excluded by owner (PH Notarial Law jurisdiction restrictions). Routes: `/dashboard/[eventId]/contracts/[contractId]` (couple) + `/vendor-dashboard/contracts/[contractId]` (vendor). `lib/contracts.ts`. |
| 4 | Customer notification fallback for critical events (email only · no SMS in V1) | ✅ | **0028 Email Notification Fallback** — Spec: `0028_email_notifications/0028_email_notifications.md`. 10 V1 templates. Provider: Resend (SendGrid fallback). 3 new tables + 1 materialized view for delivery metrics. RFC 8058 one-click unsubscribe. |
| 5 | Marketplace search & vendor discovery | ✅ | **No new iteration needed** (per your read — Guided already handles auto-recommendation, DIY uses filter popup). Extension documented in `0006_vendors_management/0006_vendors_management.md` § "DIY-mode vendor browse — filter popup" with 11 filter chips + 7 sort options + URL-shareable state. |

---

## Tier 2 — Operational completeness · **7/7 complete**

| # | Item | Status | Where it landed |
|---|---|---|---|
| 1 | Marketplace search & vendor discovery (filter popup pattern) | ✅ | `0006_vendors_management/0006_vendors_management.md` — new "DIY-mode filter popup" section. Filter chips: City · Service category · Price band · Available on date · Tier · Distance radius · Years operating · Has Setnayan-exclusive · Has reviews · Rating. Sort options: Recommended / Most reviews / Highest rated / Closest / Newest / Price low→high / Price high→low. |
| 2 | Vendor reviews + ratings (landing page + cards) | ✅ | **Two surfaces:** `0006_vendors_management/0006_vendors_management.md` adds the `vendor_reviews` schema + `vendor_review_stats` materialized view. `0015_main_website/0015_main_website.md` adds the customer-facing review display on the vendor landing page (hero metrics + sort/filter strip + paginated review cards). Reviews trigger via 0028 email 24-hrs after event end. PERMANENT per Vendor Agreement. |
| 3 | Refund / dispute customer-facing flow | ✅ | `0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md` — Vendor detail menu now includes "Request a refund" / "Open a dispute" / "Flag force majeure" / "Mediation history". |
| 4 | Customer help center / FAQ / support ticketing | ✅ | **0029 Help Center / FAQ** — Spec: `0029_help_center/0029_help_center.md`. 613 lines. 4 role tiles (customer/vendor/guest/admin) at `setnayan.com/help`. ~90 articles across roles. Search via Postgres GIN FTS. Structured contact form routes tickets to the right admin role. 24-hr SLA. |
| 5 | Vendor exclusive offers customer-facing surfacing | ✅ | **Two surfaces:** `0015_main_website/0015_main_website.md` adds the tinted exclusive-offer row inside vendor bundle/service detail on the landing page. `0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md` mirrors it on the customer's vendor detail card inside their dashboard. Tint color varies by tier (gold/terracotta/neutral). |
| 6 | Vendor onboarding (first-time guided tour) | ✅ | **0030 First-time Guided Tour** — Spec: `0030_guided_tour/0030_guided_tour.md`. Driver.js library. Per-role scripts: customer 8-step / vendor 7-step / guest 4-step / admin 6-step. Plus 11 per-surface mini-tours. Replayable from Settings. Analytics in 0023. |
| 7 | Backup & disaster recovery (Vercel + offline-first PWA only) | ✅ | **New doc** `09_Operations/Disaster_Recovery_Playbook.md`. V1 posture: Vercel stateless + offline-first PWA shell for guest day-of pages. Supabase free-tier daily backups (7-day window). R2 single-region. Upgrade triggered at V1.5 when monthly revenue exceeds ₱200K. Includes runbooks per failure mode. |

---

## Tier 3 — Polish + future-proofing · **8/8 complete**

| # | Item | Status | Where it landed |
|---|---|---|---|
| 1 | Force majeure customer-facing flow | ✅ | **Three surfaces:** `0019_communications/0019_communications.md` adds the trigger flow (type picker, evidence upload, 4-option resolution path). `0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md` adds the menu entry. `0023_admin_console/0023_admin_console.md` § 3.6b adds the escalation queue for Disputes Handler. Schema: `force_majeure_flags` table. 7-day auto-resolution window. |
| 2 | Coordinator wedding-day app (ship with V1) | ✅ | **No new iteration** — coordinator is a vendor service category ("Wedding Coordination"). Documented in CLAUDE.md decision log + `0006_vendors_management/0006_vendors_management.md`. They use the same 0022 vendor dashboard. Per-thread join permission inherited from 0019. Broadcast access inherited from 0031. |
| 3 | Multi-language dashboard (EN/TL only in V1) | ✅ | `0025_profile_settings/0025_profile_settings.md` — Appearance tab now has the EN/TL toggle. `users.language_preference` column. Next.js i18n routing at SSR. Dashboard chrome strings live in `apps/web/locales/dashboard.{en|tl}.json`. CEB deferred to V1.1. |
| 4 | Vendor team permissions deep model | ✅ | `0022_vendor_dashboard/0022_vendor_dashboard.md` — new § 2.6a Team member role assignment. 4 roles: Owner / Admin / Agent / Viewer. Per-agent service scoping. Optional team_label feeds 0019 chat masking. Owner can change roles anytime from Team tab. |
| 5 | Day-of guest experience | ✅ | **0031 Day-of Guest Experience** — Spec: `0031_day_of_guest/0031_day_of_guest.md`. 570 lines. Live-event mode auto-activates T-1hr to T+8hr on the personal landing page. 6 cards: What's happening · Your table · Live photo wall · Video guestbook · Live schedule · Coordinator broadcast. Offline-first PWA shell for weak-signal venues. 5-mode lifecycle. |
| 6 | Crew meal management UX for catering vendor | ✅ | `0006_vendors_management/0006_vendors_management.md` adds the `vendor_services.crew_size` + `crew_meal_required` columns. `0022_vendor_dashboard/0022_vendor_dashboard.md` § 2.2a surfaces the service editor stepper for "How many of your team will be on-site?". Aggregates into 0007 Budget crew meal totals. |
| 7 | Public API for third-party integrations (future-proofing only) | ✅ | **0033 Public API Foundation** — Spec: `0033_public_api_foundation/0033_public_api_foundation.md`. 624 lines. Cloudflare Workers gateway + OAuth2 PKCE + 16 scopes + rate-limit tiers + webhook delivery infra + `developers.setnayan.com` portal. NO public endpoints turn on in V1; plumbing only. Phased V1.5 rollout: A (events read) → B (webhooks) → C (vendor browse) → D (bookings). |
| 8 | Analytics event tracking for product metrics (funnel) + **0035 Observability end-to-end 2026-05-22** | ✅ | **0023 funnel analytics** — `0023_admin_console/0023_admin_console.md` § 3.8 — Funnel analytics layer. 7 V1 funnels (customer signup → first booking · vendor signup → first booking · Setnayan Concierge adoption · DIY browse · Save-the-Date · Paparazzi · Pro upgrade). Schema: `funnel_events` table. New "Funnels" tab in 0023 dashboard with cohort breakdowns + period compare. **0035 Observability** — `0035_observability/` iteration shipped end-to-end 2026-05-22. **Sentry** (PR #17) wired for error tracking; smoke-test endpoint `/api/admin/sentry-smoke-test` shipped 2026-05-22 via PR #280 (admin-gated controlled-error trigger). **PostHog** (PR #19) wired with 3 server-side funnels live + 4 PostHog Insights funnels. **`/api/health` + `/api/health/deep` endpoints** shipped 2026-05-22 via PR #275 (Better Stack uptime can now ping). **Observability typecheck** via PR #289 confirms every server action is Sentry-instrumented cleanly. **Pending owner-side action:** trigger the smoke-test endpoint to verify Sentry capture + email/Slack alerting routing (endpoint is live; need one click + check Sentry inbox). |

---

## BONUS adds beyond the gap-analysis list

These came up during the same conversation and also landed:

| Item | Where |
|---|---|
| Vendor logo mandatory at registration | Vendor Agreement § 1.1 + 0022 § 2.1b + `0022_vendor_dashboard.html` brand & logo card. PNG transparent, 512×512 min, ≤2 MB. |
| Chat identity masking (vendor logo always shown to customer · never personal photo) | Vendor Agreement § 3.10 + 0019 dedicated section + resolver pseudocode + acceptance tests |
| Owner / Internal Accounts (owner + spouse permanent unlimited grant) | Vendor Agreement § 10a + 0023 § 3.5b + 🟣 badge in Users surface |
| Team Shared Monthly Pool (₱10K cap shared across non-owner team · use-it-or-lose-it · first-come-first-served · 0.5% of prior-month sales formula) | Vendor Agreement § 10b + 0023 Team Pool widget + 🟢 badge + canonical schema declaration |
| Two-admin approval scope locked to MAJOR DECISIONS ONLY (routine ops = single-admin) | Vendor Agreement § 9.1 + 0023 § 4 + decision log |
| Real-time slug check (300ms debounce · silent revert on blur) | 0002 spec + `events.slug` schema + reserved-slug pool |
| Theme system (Setnayan Default · Victorian · Classy · iOS) + Lucide icon framework | `02_Specifications/Theme_System_Implementation_Spec.md` + `02_Specifications/Lucide_Icon_Migration_Spec.md` + pilot applied to 0021 HTML prototype |
| Payment Methods upload surface (BDO + GCash QR) | 0023 § 3.5c with two-admin approval gate |
| Charm pricing convention (-1 endings: ₱49 / ₱99 / ₱199 / ₱499 / ₱999 / ₱1,499 / ₱1,999 / ₱2,499 / ₱2,999 / ₱4,999) | CLAUDE.md decision log + propagated to 0004 / 0011 / 0012 specs |
| Vendor reviews 24-hr post-event email trigger | 0028 template `review_request` (queued for V1.1 — not in V1 templates list) |
| Disaster Recovery Playbook | `09_Operations/Disaster_Recovery_Playbook.md` |
| Strategic memory for the future automotive vertical | Memory file `project_setnayan_second_vertical_car_services.md` |

---

## Where to look — quick-jump reference

### Daily-driver files

- `CLAUDE.md` — every locked decision in chronological order, plus the iteration table at the top
- `MEMORY.md` (in your auto-memory folder) — one-line summaries of every persistent strategic note
- `01_Contracts/Setnayan_Vendor_Agreement.md` — the binding vendor contract; the operational rules every vendor accepts
- `01_Contracts/Setnayan_Privacy_and_Security_Policy.md` — RA 10173 compliance posture
- `V1_Gap_Analysis_Status.md` (this file) — single-pane view of the gap-analysis status (spec corpus side)
- `App_Build_Status.md` — single-pane view of which iterations have shipped in the app on `origin/main` (companion to this doc; spec vs. code)
- `Installed_Stack_Inventory.md` — 10-pass audit of what's actually wired under the hood (deps, migrations, routes, actions, integrations, env vars, CI, desktop, PWA)
- `API_Integration_Checklist.md` — external service prereqs (signups, keys, DNS) the owner must action before code can run end-to-end

### Iteration folder layout

```
0000_app_shell_and_navigation/    → login, role-router, event picker, 4-tab nav
0001_creating_guest_list/         → guest list, RSVP
0002_qr_invitation_system/        → personal QR + slug system + **Event Landing Page** (4 lifecycle phases: Save-the-Date / Invitation / Logistics / Post-event · absorbs retired 0024 as Phase 1)
0003_token_wallet_and_packs/      → [RETIRED 2026-05-11]
0004_invitation_widgets/          → 11 widgets · 2 V1 paid upgrades (Monogram Hero ₱1,999 no-refund + Live Schedule ₱999) · 3 V1.5+ reserved (Live Studio [formerly Panood]/Papic/Patiktok)
0005_led_background_maker/        → 8K LED templates
0006_vendors_management/          → vendor registry, filter popup, reviews schema, crew_size
0007_budget_expenses/             → couple's payment ledger
0008_seating_chart_editor/        → table layout + QR print pack
0009_photo_delivery/              → Google Drive integration
0010_mood_board/                  → palettes + Setnayan Guide rule engine
0011_panood/                      → Live Studio (formerly Panood; folder path 0011_panood/ unchanged) — V1 SKU lock 2026-05-16: BYO YouTube via OAuth · per-day pricing (Daily Broadcast ₱499 · Camera Sync ₱99 · Annual ₱2,999 · Annual Plus ₱3,999) · Cloudflare-composite SKUs retired. (Renamed 2026-06-29; paid multicam tier ₱4,999 → ₱3,499/day — see DECISION_LOG.md 2026-06-29.)
0012_paparazzi/ or 0012_papic/    → Papic — V1.5+ deferral with **architecture lock 2026-05-16**: 207-cam mesh + Drive transfer T+30d + cold-tier 90-day window + pooled credits + Auto-Recap; SKUs frozen at V1.5+ build-time (paparazzi_3_seats ₱1,499 · paparazzi_5_seats ₱2,499 · paparazzi_camera_addon ₱999 · paparazzi_credits_addon ₱299 · premium_guest_camera_pack ₱1,499 · personal_album_per_guest ₱49 · memory_book_per_guest ₱249)
0013_platform_stack_and_sync/     → Vercel + Supabase + R2 + GitHub setup
0014_v1_1_polish/                 → queued; no folder yet
0015_main_website/                → setnayan.com marketing site
0016_step_by_step_plan_builder/   → vendor plan builder
0017_patiktok/                    → Patiktok — V1 SKU lock 2026-05-16: dual-tier per-day model (Setnayan TikTok ₱999/day · Personal TikTok ₱1,999/day via OAuth) · 40-video/day soft cap + ₱49/+10 overage · old ₱2,499/booth/5hr SKU retired
0018_supplies_marketplace/   → supplies marketplace placeholder
0019_communications/              → chat + video + file sharing + vendor identity masking + force majeure
0020_admin_console/               → [SUPERSEDED by 0023]
0020_interaction_prototype/       → 8-phase cross-cutting prototype (separate folder)
0021_couple_dashboard_fully_purchased/  → 9 customer surfaces (post-purchase)
0022_vendor_dashboard/            → 6 vendor surfaces
0023_admin_console/               → 7 admin surfaces + § 9.1 two-admin scope + Team Pool + Payment Methods + funnel analytics + force majeure escalation
0024_save_the_date/               → Save-the-Date — page-render SKU retired 2026-05-16 (folded into 0002 Phase 1); **NEW Save-the-Date Video MP4 SKU ₱99 reintroduced 2026-05-16 as a separate product** — 5-10 engagement photos in → 30-60s vertical MP4 out with Setnayan-owned music + landing-page end-card (different inputs, different outputs, different SKU code `save_the_date_video_render`)
0025_profile_settings/            → 6-tab settings inside customer/vendor/admin dashboards
0026_bir_tax_compliance/          → OR + VAT + EWT + Form 2307
0027_e_signature/                 → [DEFERRED V1.5 — manual signing in V1 per Vendor Agreement § 12.1]
0028_email_notifications/         → 10 V1 templates · Resend + SendGrid fallback
0029_help_center/                 → FAQ + structured support tickets
0030_guided_tour/                 → first-time onboarding (Driver.js)
0031_day_of_guest/                → live-event mode + 6 cards + offline-first PWA
0032_contract_intelligence/       → AI contract analysis + e-signature (paid upgrade)
0033_public_api_foundation/       → OAuth2 + scoped tokens + webhook delivery (V1.5 endpoints)
```

### How to actually open the work

- **For specs** (.md files): open in any text editor or markdown viewer
- **For stakeholder review** (.docx files): open in Word / Pages / Google Docs
- **For prototypes** (.html files at 0021/0022/0023/0024): open directly in a web browser (works offline, no server needed) — try the theme picker swatches in 0021's top chrome
- **For pricing**: open `05_Financials/Pricing_Workbook_*.xlsx` in Excel / Numbers / Google Sheets
- **For the contract**: open `01_Contracts/Setnayan_Vendor_Agreement.md` in any markdown viewer, or the matching `.docx`

### Audit-trail of fixes from the 3x pass

The 3x audit pass (after the gap-analysis batch) found and fixed:

| Fix | Where |
|---|---|
| CRITICAL · schema declarations for `users.is_internal` + `users.is_team_member` + `unlimited_use_grants` + `team_shared_monthly_allowance` + `team_allowance_consumptions` | 0023 § 3.5b — canonical SQL block added |
| CRITICAL · `chat_messages.sender_user_id` → `sender_id` reconciliation | 0019 + 0025 + Vendor Agreement + CLAUDE.md |
| HIGH · Charm pricing propagated to 0011 / 0012 / 0004 | 20 + 15 + 16 substitutions applied |
| HIGH · Token-wallet language purged | 0004 + 0012 banners + 0000 mock + Iteration Connection Map § 0003 strikethrough |
| HIGH · Setnayan Guarantee → 3% Setnayan Pay convenience fee pivot | 0022 § actuarial rewrite · 0023 § 3.6 renamed Disputes & Refunds · Lucide spec relabeled |
| MEDIUM · CLAUDE.md iteration table sync (added 0016/0017/0018/0020_interaction_prototype rows + 0014 status flag) | CLAUDE.md |
| MEDIUM · 0022 § 9 stale future-iteration labels corrected (0023 & 0024) | 0022 |
| MEDIUM · 12 stale .docx mirrors regenerated via pandoc | 0000/0001/0004/0007/0008/0009/0010/0011/0012/0013/0022/0023 |
| LOW · MEMORY.md pointer for `project_setnayan_v1_wedding_v2_universal_expansion.md` | MEMORY.md |

---

## What's still ON THE TABLE (not blocking V1 launch)

These are NOT done because you didn't ask for them, or they're explicitly V1.5+:

- **Digital e-signature integration** (PandaDoc or DocuSign) — V1.5; manual flow covers V1
- **SMS notifications** — V1.5; email-only for V1
- **CEB (Cebuano) dashboard locale** — V1.1; EN/TL only for V1
- **Auto-translation in chat** — V2
- **Native AI post-meeting summary in 0019** — V1.1
- **Vendor-to-vendor private chat** — out of scope by privacy invariant
- **Mobile-app screen share** — V1.1
- **Group video meetings beyond 8 participants** — V1.1 (raises to 16)
- **Public API endpoints turning ON** — V1.5 phased rollout per 0033 roadmap
- **Multi-region Supabase + R2 cross-region replication** — V1.5 when revenue justifies the ₱2K/month upgrade

---

**Last updated:** 2026-05-12 · amended 2026-05-16 (marketplace + payment + verification model lock).

---

## 2026-05-16 — Marketplace + payment + verification model lock (additive)

Today's lock adds five new V1 spec deliverables to the gap-analysis ledger. None of these were on the original 2026-05-12 gap list — they emerged from the post-2026-05-15 walkthrough of marketplace economics + vendor trust + Anthropic API setup. All locked in `CLAUDE.md` 2026-05-16 marketplace/payment/verification lock row.

| # | Item | Status | Where it landed |
|---|---|---|---|
| 1 | **Setnayan Pay commission model (flat 5.0% on top of vendor price · Option B vendor-absorbs-gateway · admin-configurable per method defaulting uniform · BIR 0.5% pass-through · Maya Business V1.5+ primary gateway · Maya QR Ph preferred rail · Setnayan absorbs ₱15-25 disbursement fee)** | ✅ Spec | `0034_payments_and_cart/0034_payments_and_cart.md` § 6 (full rewrite — flat 5.0% targeting 3% net at worst-case tax wedge · supersedes morning's 5.5%/6.5% dual-rate · BIR Withholding 0.5% · Maya Business V1.5+ · payout breakdown table · schema updates). `0023_admin_console/0023_admin_console.md` § 3.5d (admin-configurable payment-method config table + history; all rails default 5.0%). Engineering pending: schema migrations, BIR 2307 generation, gateway integration. |
| 2 | **Vendor Verification flow (FREE initial / ₱1,499 annual renewal / ₱2,499 re-verification after demotion · charm-corrected 2026-05-17 · 12-document checklist · all-or-nothing · 3-5 BD SLA · `setnayan-vendor-verification` R2 bucket)** | ✅ Spec | `0006_vendors_management/0006_vendors_management.md` new "Vendor Verification flow" section (pricing table + 12-doc checklist + category-specific extras + process + tier perks/limitations + schema). `0023_admin_console/0023_admin_console.md` § 3.2a (verification queue refinement). `API_Integration_Checklist.md` Persona/Veriff/Onfido + AMLC additions. |
| 3 | **All Tools Unlock bundle ₱9,999/year (Mood Board + Palette + Seating + QR Reader + Advanced Pricing Tier · open to ALL paying vendors)** | ✅ Spec | `0022_vendor_dashboard/0022_vendor_dashboard.md` § 6B (full rewrite — à la carte ₱99/wk listing + All Tools Unlock bundle + schema with `vendor_tool_bundles` table). |
| 4 | **Marketing tier ladder (Boosted Ads 5km ₱4,999/wk · 10km ₱7,999/wk · 20km ₱14,999/wk · Sponsored Boost Quarterly ₱249,999 / Annual ₱799,999 at 30km, verified-only · charm-corrected + seeded 2026-05-17)** | ✅ Spec | `0022_vendor_dashboard/0022_vendor_dashboard.md` § 5b (full rewrite — Boosted Ads tier table + Sponsored Boost long-commit tier table + retire of prior single ₱1,499/wk SKU + stacked-cost example). Seeded in `0034 § service_catalog (i)` 2026-05-17. |
| 5 | **Vendor Payout model (verified = immediate full payout T+1; coming_soon = 3-stage milestone 20/60/20 with T-14 + T+7 dispute windows; demote-to-coming_soon at 3+ disputes/30d)** | ✅ Spec | `0006_vendors_management/0006_vendors_management.md` new "Vendor Payout model" section. `0034_payments_and_cart/0034_payments_and_cart.md` § 6.7 (vendor_payouts table + payout_stage enum). |

### 2026-05-16 — secondary closes

| # | Item | Status | Where it landed |
|---|---|---|---|
| 6 | **Video meetings (Daily.co) RETIRED** | ✅ Spec | `0019_communications/0019_communications.md` top-banner amendment + scope/pricing strikethroughs + external-tool handoff pattern. `0022_vendor_dashboard/0022_vendor_dashboard.md` Pro Weekly + Threads + cross-iteration handoff updates. `CLAUDE.md` 2026-05-11 Daily.co rows amended with strikethrough + cross-reference. |
| 7 | ~~**Anthropic Console workspace "Setnayan"** + spend caps + Haiku 4.5 (Contract Intelligence) + Sonnet 4.6 (vision) + GPT-4 V1.5+ fallback~~ | 🚫 **DEFERRED 2026-05-18** | 0032 Contract Intelligence retired 2026-05-18 (migration `20260518200000_vendor_contracts_dual_esign_retire_0032.sql`) and replaced by free dual e-sign on every vendor contract. Anthropic signup is **no longer a V1 prereq**. Env vars + spend caps preserved in `.env.example` for V1.5+ 0011/0012 AI highlights activation; defer signup until then. |
| 8 | **AI Edited Highlight 3-min repriced ₱4,999 → ₱3,499** | ✅ Spec | Updated wherever the SKU pricing appears in Strategy + spec corpus + status anchors. |

### Engineering hand-off (deferred to engineering worktree)

- Schema migrations: `vendors.verification_state` enum + `vendor_verification_applications` + `vendor_tier_history` + `vendor_payouts` + `payment_method_config` + `payment_method_config_history` + `vendor_tool_bundles` + ALTERs on `service_orders` (setnayan_fee_bps, gateway_fee_centavos, bir_withholding_centavos, vendor_net_centavos, disbursement_fee_centavos, payment_method_key)
- BIR Form 2307 quarterly PDF generation worker
- Maya Business gateway integration (V1.5+)
- Persona/Veriff/Onfido ID verification webhook handlers
- AMLC sanctions API integration
- ~~Anthropic Console workspace signup + API key in env vars + spend-cap monitoring~~ — **DEFERRED 2026-05-18 (0032 retired)**; reactivate when V1.5+ 0011/0012 highlights ship
- Dispute counter cron (30-day rolling window for auto-demote trigger) — ✅ shipped at `/api/admin/cron/dispute-counter` (`CRON_SECRET` gated)
- Vendor payout dispatcher (T+1 verified · T-14/T+7 coming_soon stages) — partial: `lib/payouts.ts` + `vendor_payouts` table shipped; dispatcher worker still pending

### `.docx` regen

**Pandoc returned 2026-05-20** (`pandoc 3.9.0.2` at `/Users/icecasasola/.local/bin/pandoc`). Backlog `.docx` mirrors needing regen: `CLAUDE.docx`, `0019_communications.docx`, `0022_vendor_dashboard.docx`, `0006_vendors_management.docx`, `0023_admin_console.docx`, `0034_payments_and_cart.docx`, `0032_contract_intelligence.docx` (mark retired), `V1_Gap_Analysis_Status.docx` (this file), plus iteration `.docx` mirrors for any iteration touched by the 2026-05-14 → 2026-05-20 burst. Run during next Cowork session via the COWORK.md lines 44-54 sequence.

---

**End of 2026-05-16 addendum.**

---

## 2026-05-19 — Traffic monetization V1.1 scope expansion (additive)

Owner-greenlit scope expansion (CLAUDE.md decision log 2026-05-19 sixth row of the day). Four directions to "earn while people browse setnayan.com" — none on the original 2026-05-12 gap list. All four greenlit; two of them shipped as new spec iterations; one is a sales playbook; one is gated on a separate activation sign-off.

**Context before reading this addendum:** Setnayan already monetizes browsing through Boosted Ads + Sponsored Boost (locked 2026-05-16 in [0022 § 5b](0022_vendor_dashboard/0022_vendor_dashboard.md) — ₱4,999–14,999/wk + ₱249,999/qtr + ₱799,999/yr). One vendor on 20km Boosted Ads pays ~₱780K/year; Sponsored Boost Annual is ~₱800K/year. Philippine AdSense baseline is ~₱5–20K/month at 100K monthly pageviews. The expansion below adds **complementary** monetization (long-tail SEO traffic + editorial revenue) rather than competing with Boosted Ads.

| # | Item | Status | Where it landed |
|---|---|---|---|
| 1 | **Boosted Ads activation playbook (owner-side sales motion · existing tier ladder shipped 2026-05-16)** | ✅ Doc | `09_Operations/Boosted_Ads_Activation_Playbook.md` — prospect-list SQL · in-app DM outreach template · 4 common objections + counters · tier-to-volume mapping · 30-vendor launch promo `BOOSTED-LAUNCH-2026` 20% off month 1 cap 30 redemptions · featured-vendor lookbook deliverable owed 2026-06-15 · weekly Monday review cadence. No engineering required for the playbook itself. **Engineering action:** seed `promo_codes` row for `BOOSTED-LAUNCH-2026`. |
| 2 | **Editorial section + curated affiliate links + sponsored content (NEW iteration · V1.1)** | ✅ Spec | `0038_editorial_and_affiliates/0038_editorial_and_affiliates.md` — `setnayan.com/blog` (long-form articles · git-tracked MD pattern matching 0029 Help Center · `apps/web/content/editorial/`) + `setnayan.com/recommendations/[category]` (disclosed curated affiliate picks · Involve Asia primary network · `rel="sponsored nofollow noopener"` mandatory) + Sponsored Content (paid editorial features w/ sticky "Sponsored by X" badge + first-line disclosure + two-admin gate ≥₱100K). New tables: `editorial_articles` + `recommendation_pages` + `affiliate_links` + `affiliate_conversions` + `sponsored_slot_bookings`. PostHog `affiliate_link_clicked` event with no PII. Postback endpoint `POST /api/affiliates/postback?network=:network`. Newsletter sponsorship slot extends 0028. Cross-coordinates with 0022 + 0039. |
| 3 | **Third-party display ads (NEW iteration · V1.1 · activation-gated)** | ✅ Spec · ⛔ activation gated | `0039_display_ads/0039_display_ads.md` — Google AdSense as V1.1 single network. Public, pre-purchase surfaces only — marketing site + help articles + 0038 editorial + marketplace discovery + vendor landing pages. **Site-wide RA 10173 cookie-consent banner** (new system surface; 3 categories essential/analytics/advertising; 12-month persistence). Hard guardrails: max 1 unit/page · AdSense topic-exclusion of wedding/event categories on vendor profiles + editorial + recommendations + marketplace · Auto Ads OFF · no interstitials. Vendor opt-out toggle on `/vendors/[slug]` (Boosted Ads / Sponsored Boost vendors default OFF). Two-admin activation kill-switch in 0023 § 5.1. Exclusions: logged-in dashboards · guest landing 0002 incl. Phase 4 Public Summary · day-of 0031 · sponsored articles · sponsored newsletter slots · checkout · contact form · cookie-preferences · error pages · vendor verification flows. New tables: `cookie_consent_events` + `adsense_activation_log` + `adsense_daily_revenue`; ALTERs on `users` + `vendors`. CSP middleware update per § 7. **Activation gated on:** AdSense publisher account approval (~1-2 week site review · 0038 must ship first for ≥30 pages of content) + Privacy Policy update + NPC re-filing + separate owner brand-risk sign-off entry in decision log + two-admin approval in 0023 § 5.1. |
| 4 | **Iteration-number bump (originally 0036/0037 proposed → collisions found → final 0038/0039)** | ✅ Decision logged | `0036_pakanta` (Pakanta songwriter service · drafted 2026-05-14) and `0037_bespoke_monogram` (Bespoke Monogram via DALL-E · drafted 2026-05-14) already occupy 0036/0037. Plus a duplicate `0037_event_day_preload` from the 2026-05-16 retro-numbering. Final numbers for traffic-monetization expansion: **0038** Editorial & Affiliates + **0039** Display Ads. The 0037 duplicate folder reconciliation is **NOT** addressed in this scope — flagged as separate cleanup item for a future Cowork session. |

### Hard NOs surfaced during this lock (do not violate)

- No display ads on logged-in dashboards (0021/0022/0023) — paid product
- No display ads on guest landing pages (0002 — incl. Phase 4 Public Summary) — guests shared data privately, ads = brand suicide
- No display ads on day-of guest experience (0031) — sacred to the couple
- No selling leads to third parties — violates `01_Contracts/Setnayan_Privacy_and_Security_Policy.md`
- No AdSense Auto Ads — manual-placement only
- No interstitials / anchor ads / vignette ads — display-only
- No Outbrain / Taboola / programmatic open-exchange — AdSense managed-network only
- No native/in-feed advertorial recommendations from third-party — out of policy
- No display ads on the native iOS/Android (Papic) apps — out of policy
- No display ads on the desktop app (`apps/desktop`) — out of policy
- No re-targeting in V1.1 — out of scope, separate iteration if ever revisited

### Engineering hand-off (deferred to engineering worktree)

**0038 Editorial & Affiliates:**
- Schema migrations: `editorial_articles` + `recommendation_pages` + `affiliate_links` + `affiliate_conversions` + `sponsored_slot_bookings`
- Next.js routes: `/blog`, `/blog/[slug]`, `/recommendations`, `/recommendations/[category]`
- MD content build pipeline: scan `apps/web/content/editorial/`, validate frontmatter, upsert at build time
- PostHog event: `affiliate_link_clicked` + `newsletter_sponsor_clicked`
- Postback endpoint: `POST /api/affiliates/postback?network=:network`
- 0023 admin: Editorial tab + Articles / Sponsored slots / Affiliate revenue sub-tabs
- 0022 vendor: "Display ads on my profile" toggle
- 0028 email: `sponsored_slot_paid` receipt + newsletter weekly digest + sponsor-slot block

**0039 Display Ads:**
- Schema migrations: `users.consent_state` + `users.consent_recorded_at` + `users.consent_policy_version` ALTERs; `cookie_consent_events` + `adsense_activation_log` + `adsense_daily_revenue`; `vendors.display_ads_on_profile` ALTER
- New libs: `apps/web/lib/ads/` (loader + excluded_topics + surface-inclusion map + vendor-opt-out resolver), `apps/web/lib/consent/`
- New route: `/cookie-preferences`
- New endpoint: `POST /api/consent/record`
- 0025 Profile Settings → Privacy & Data: Cookie preferences link
- 0023 Admin Console → Ads & Consent tab + 3 sub-tabs
- 0022 Vendor Dashboard → Marketplace presence: Display ads toggle
- 0028 Email: `consent_updated` template
- 0029 Help Center: "Cookies & ads on Setnayan" article (lives in 0038 content system)
- CSP middleware update (script-src + frame-src + img-src + connect-src for AdSense)
- Daily cron: AdSense Management API pull at 02:00 PH

**Boosted Ads Activation:**
- Seed `promo_codes` row for `BOOSTED-LAUNCH-2026` (20% off month 1 · cap 30 redemptions · expires 2026-06-30)

### Owner-side actions (pre-activation)

- AdSense publisher account signup at `https://www.google.com/adsense` (~1-2 week review)
- Involve Asia affiliate-network signup + W-8BEN-equivalent for payouts + merchant connections (Klook, Agoda, Trip.com, BDO, etc.)
- Privacy Policy update at `01_Contracts/Setnayan_Privacy_and_Security_Policy.md` — add "Advertising cookies" section
- NPC filings updated to list AdSense as a third-party processor
- Featured-vendor lookbook produced (designer + owner · due 2026-06-15)
- Brand-risk sign-off entry in CLAUDE.md decision log on the day of activation (separate row)

### `.docx` regen

Pandoc still unavailable. `0038`, `0039`, `Boosted_Ads_Activation_Playbook.md`, and `CLAUDE.docx` mirrors NOT regenerated — flag for the same future Cowork session that handles the 2026-05-16 backlog.

---

**End of 2026-05-19 addendum.**

---

## 2026-05-19 — Traffic monetization scope refinement (afternoon)

Same-day refinement of the morning's traffic monetization lock. After the spec landed, owner started the actual signups:

- **Involve Asia signup** — submitted successfully. Network-level approval expected in 3-7 business days. Account configured as Individual / Content site / Setnayan property / Travel + Fashion + Home & Living categories / Philippines / PHP. Status: 🟡 pending approval.
- **Google AdSense signup** — **blocked.** Owner's Google account has an existing AdSense-for-YouTube product that was auto-deactivated due to YouTube channel inactivity. Per Google's post-2021 product split, this account never enrolled in AdSense-for-Content and there's no enrollment path forward. Three alternate URLs (`/adsense/signup`, `/adsense/new`, `adsense.google.com`) all redirected back to the deactivation screen. Sidebar showed no Sites tab. Creating a fresh Google account to circumvent the block would risk a permanent ban via Google's duplicate-AdSense identity checks (phone · payment · IP · beneficial owner). Path A (drop display ads entirely from V1.1) chosen.

### 2026-05-19 addendum refinement

| # | Original direction | New status | Notes |
|---|---|---|---|
| 1 | Boosted Ads activation playbook | ✅ Unchanged | Doc + 30-vendor launch promo + featured-vendor lookbook deliverable all stay on track |
| 2 | 0038 Editorial section + curated affiliate links | ✅ Unchanged | Spec locked; Involve Asia signup submitted today; awaiting 3-7 business day approval |
| 3 | 0038 Sponsored content + newsletter sponsorship | ✅ Unchanged | Spec locked; activates once 0038 ships |
| 4 | **0039 Third-party display ads** | **🚫 RETIRED 2026-05-19** | AdSense block confirmed; 0039 spec flipped to tombstone; cookie-consent banner scope dropped (no third-party trackers means RA 10173 first-party PostHog opt-out is sufficient); engineering scope shrinks significantly |

### Engineering scope removed via 0039 retirement

The following items were specced earlier today but are now NOT needed:

- **Schema:** `users.consent_state` JSONB column, `users.consent_recorded_at`, `users.consent_policy_version`, `cookie_consent_events` table, `adsense_activation_log` table, `adsense_daily_revenue` table, `vendors.display_ads_on_profile` ALTER
- **Routes:** `/cookie-preferences` (full settings page), `/api/consent/record` (POST endpoint)
- **Libraries:** `apps/web/lib/ads/`, `apps/web/lib/consent/` (loader, excluded_topics, surface-inclusion map, vendor-opt-out resolver, banner component, consent-state hook, server-side resolver)
- **Admin surfaces:** 0023 § 5.1 activation kill-switch, "Ads & Consent" tab + 3 sub-tabs
- **Vendor surfaces:** 0022 vendor dashboard "Display ads on my profile" toggle
- **Email templates:** 0028 `consent_updated` template
- **Help articles:** 0029 "Cookies & ads on Setnayan" article
- **Middleware:** CSP changes to `apps/web/middleware.ts` (script-src + frame-src + img-src + connect-src AdSense entries)
- **Cron:** daily AdSense Management API pull at 02:00 PH
- **Privacy Policy:** "Advertising cookies" section + NPC re-filing (no third-party processor to disclose)

### Owner-side actions removed

- Google AdSense publisher account signup (#21a in API checklist) — REMOVED
- Privacy Policy update + NPC re-filing for AdSense cookies (#21c in API checklist) — REMOVED

### Owner-side actions kept

- Involve Asia signup (#21b) — IN PROGRESS (submitted today, awaiting approval)
- Featured-vendor lookbook for Boosted Ads playbook (#21d) — due 2026-06-15
- Seed `promo_codes` row for `BOOSTED-LAUNCH-2026` (engineering action #21e in API checklist Tier 9 § 9.5) — pending

### Files updated in this refinement

- `0039_display_ads/0039_display_ads.md` — top banner flipped to 🚫 RETIRED with reason
- `CLAUDE.md` — iteration table 0039 row strikethrough + new decision log row (Ninth 2026-05-19 row after the V1.2 spec lock cluster)
- `App_Build_Status.md` — V1.1 spec drafted 7→6 · Retired bucket 4→5 (adds 0039) · 0039 detail row updated
- `V1_Gap_Analysis_Status.md` (this file) — new section appended here
- `API_Integration_Checklist.md` Tier 9 — AdSense rows + Privacy Policy NPC re-file rows removed; Involve Asia + Featured-vendor lookbook + promo_codes seed kept

**End of 2026-05-19 afternoon refinement.**
