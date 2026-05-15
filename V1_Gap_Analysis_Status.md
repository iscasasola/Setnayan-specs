# Setnayan V1 Gap-Analysis Status

**Locked 2026-05-12.** This is the single-pane view of every Tier 1 / Tier 2 / Tier 3 gap item raised during the 2026-05-12 gap audit and where each one landed. Open any file path below directly to see the work.

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
| 3 | E-signature for vendor contracts | ✅ | **Hybrid path:** (a) V1 manual signing flow documented in Vendor Agreement § 12.1 (vendor scans signed PDF back, R2 bucket `setnayan-vendor-contracts`); (b) Optional digital upgrade specced as **0032 Contract Intelligence + Builder** at ₱199/contract OR free with Vendor Pro Weekly. |
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
| 8 | Analytics event tracking for product metrics (funnel) | ✅ | `0023_admin_console/0023_admin_console.md` § 3.8 — Funnel analytics layer. 7 V1 funnels (customer signup → first booking · vendor signup → first booking · Guided adoption · DIY browse · Save-the-Date · Paparazzi · Pro upgrade). Schema: `funnel_events` table. New "Funnels" tab in 0023 dashboard with cohort breakdowns + period compare. |

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
0004_invitation_widgets/          → 11 widgets · 2 V1 paid upgrades (Monogram Hero ₱1,999 no-refund + Live Schedule ₱999) · 3 V1.5+ reserved (Panood/Papic/Patiktok)
0005_led_background_maker/        → 8K LED templates
0006_vendors_management/          → vendor registry, filter popup, reviews schema, crew_size
0007_budget_expenses/             → couple's payment ledger
0008_seating_chart_editor/        → table layout + QR print pack
0009_photo_delivery/              → Google Drive integration
0010_mood_board/                  → palettes + Setnayan Guide rule engine
0011_panood/                      → Panood — V1 SKU lock 2026-05-16: BYO YouTube via OAuth · per-day pricing (Daily Broadcast ₱499 · Camera Sync ₱99 · Annual ₱2,999 · Annual Plus ₱3,999) · Cloudflare-composite SKUs retired
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

**Last updated:** 2026-05-12. Re-generate this file after any future iteration batch by running the same audit pattern.
