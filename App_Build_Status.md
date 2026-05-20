# Setnayan — App Build Status (spec vs. live code)

**Last regenerated:** 2026-05-20 evening (post engineering-ownership audit cycle — 7 PRs landed today: #162/#163/#166/#169/#170/#172/#174 closing 0009 + 0043 end-to-end; chrome drift confirmed already-fixed; full session arc captured in CLAUDE.md decision-log rows 442-446)
**Repo audited:** `origin/main` at `https://github.com/iscasasola/setnayan-platform`
**Companion docs:** [V1_Gap_Analysis_Status.md](V1_Gap_Analysis_Status.md) (spec) · this doc (code) · [Installed_Stack_Inventory.md](Installed_Stack_Inventory.md) (deps) · [API_Integration_Checklist.md](API_Integration_Checklist.md) (prereqs)

---

## How to read this doc

`V1_Gap_Analysis_Status.md` answers "did we update the spec?". **This doc answers "did we ship the spec?"** Re-generated EOD 2026-05-14 after a 23-PR run.

- ✅ **Shipped** — spec scope is live in the app
- ⚠️ **Partial** — some scope is live; remainder still in flight or queued
- 🟡 **Not shipped** — spec exists, code doesn't (V1.5+ deferral or pending Phase 2/3)
- ⛔ **Blocked** — gated on an external dep
- 🚫 **Retired / superseded**
- ⚙️ **Engineering in flight** — worktree created + brief committed + fresh Claude Code session can pick up (added 2026-05-19 for parallel kickoff)

---

## Headline numbers (post 2026-05-14 PR run)

| Bucket | Count | Iterations |
|---|---|---|
| ✅ Shipped | **24** | 0000, 0001, 0002, 0004, 0007, 0008, **0009** (NEW 2026-05-20 — engineering complete; gated on #19g), 0010, 0013, 0015, 0016, 0021, 0023, 0025, 0026, 0028, 0029, 0030, 0031, 0033 (partial), 0034, 0035, 0037, **0043** (NEW 2026-05-20 — picker + compatibility loop end-to-end) |
| ⚠️ Partial / Phase 2 in flight | 4 | 0006, 0019, 0022 (extended w/ 0043 compat editor 2026-05-20), 0030, 0033 |
| ⚙️ **Engineering in flight** (parallel kickoff 2026-05-19 · schema foundations landed 2026-05-19/20) | **5** | **0005** (schema shipped 2026-05-20 via PR #150 — needs render pipeline + UI) · **0011** (OAuth + cron + scaffolds shipped 2026-05-16 — YouTube verified-app review pending) · **0012** (schema + V1 SKU seed + Drive OAuth shipped 2026-05-19/20 — native iOS/Android still V1.5+) · **0017** (schema + OAuth + UI scaffolds shipped 2026-05-16 — TikTok app review pending) · **0018 Setnayan Supplies** (schema + pricing resolver shipped 2026-05-19 — needs supplier onboarding + fulfillment flow). 0009 graduated to Shipped 2026-05-20 (was in this bucket morning of, lifted evening). |
| 📐 V1.1 spec drafted (2026-05-19) | 6 | 0043, 0044, 0045, 0046, 0047, **0038** (0038 added 2026-05-19 traffic-monetization scope expansion; 0039 added then RETIRED same day — see Retired bucket below) |
| 📐 V1.1 vendor taxonomy master doc (2026-05-19) | 1 | `02_Specifications/Vendor_Taxonomy_V1_Master.md` — 192 sub-categories, phased V1.1 → V1.5+ |
| 📐 V1.2 spec drafted (2026-05-19) | 2 | 0048 multi-moderator event access · 0049 multi-payer cart |
| 📐 V1.2 amendments to existing iterations (2026-05-19) | 5 | 0007 (per-payer budget + visibility) · 0019 (moderator-aware vendor chat) · 0021 (role-aware couple dashboard) · 0028 (moderator-aware notification routing + 4 new templates) · 0034 (multi-payer cart schema + receipt formatting) |
| ⛔ Blocked | 0 | — |
| 🚫 Retired | **6** | 0003, 0014, 0027, 0024 (folded into 0002 Phase 1 on 2026-05-16), 0039 (RETIRED 2026-05-19 — AdSense path blocked), **0032 (RETIRED 2026-05-18 — replaced by free dual e-sign on every vendor contract; migration `20260518200000_vendor_contracts_dual_esign_retire_0032.sql`)** |

**Bold** = changed today.

---

## Per-iteration status (post 2026-05-14)

| # | Iteration | Status | What changed today (if any) |
|---|---|---|---|
| 0000 | App Shell & Navigation | ✅ Shipped | Bottom nav now reads "Add-ons" (PR #13); locale toggle (Phase 2 agent in flight). **Chrome drift FIX SHIPPED 2026-05-15**: PR [#67](https://github.com/iscasasola/setnayan-platform/pull/67) restored the per-couple monogram + caret event-switcher and collapsed the two-row top-nav into a single persistent strip; follow-ons [#99](https://github.com/iscasasola/setnayan-platform/pull/99) (persistent-switcher) and [#127](https://github.com/iscasasola/setnayan-platform/pull/127) (responsive-chrome-polish) hardened the implementation. The drift surfaced in `apps/web/app/dashboard/[eventId]/_components/event-switcher.tsx` + `apps/web/app/dashboard/_components/outer-dashboard-header.tsx` is resolved. (Original 2026-05-15 drift paragraph removed 2026-05-20; preserved in CLAUDE.md decision-log row 443 as audit trail.) |
| 0001 | Creating Guest List | ✅ Shipped | RSVP-received email + in-app notification (PR #20) |
| 0002 | QR Invitation System | ✅ Shipped | — |
| 0003 | Token Wallet (retired) | 🚫 — | — |
| 0004 | Invitation Widgets | ✅ Shipped (free tier; V1 paid upgrades reset 2026-05-16) | Pro tier still queued. V1 paid upgrades locked: **Monogram Hero ₱1,999 no-refund** (SVG-only · animated trace + custom video/photo background) + **Live Schedule ₱999**. Retired: `pro_widget_hero`/`pro_widget_story`/`pro_widget_bundle`. SKU code rename: `pro_widget_hero` → `monogram_hero_upgrade`. New schema fields on `hero_monogram` config_json. |
| 0005 | LED Background | ⚙️ Schema shipped 2026-05-20 (foundation only) | Migration `20260520010000_iteration_0005_led_background_foundation.sql` shipped via PR #150 — `led_background_configs` + renders tables. UI route `/dashboard/[eventId]/add-ons/led/page.tsx` shipped as scaffold. `lib/led-background.ts` shipped. Remaining: render pipeline + asset library + couple-side configurator UX. |
| 0006 | Vendors Management | ⚠️ Partial | `/vendors` placeholder shipped (PR #22); marketplace + reviews in Phase 2 agent (in flight) |
| 0007 | Budget & Expenses | ✅ Shipped | — |
| 0008 | Seating Chart Editor | ✅ Shipped | — |
| 0009 | Photo Delivery | ✅ Shipped (V1 — gated on #19g) | **Engineering-complete end-to-end as of 2026-05-20.** Foundation migrations 72 + 76, OAuth lib + routes shipped 2026-05-19/20 via PRs #147, #150, #152, #153. Six PRs landed 2026-05-20: [#163](https://github.com/iscasasola/setnayan-platform/pull/163) added the add-ons grid card (closing the orphan), [#166](https://github.com/iscasasola/setnayan-platform/pull/166) added the per-event `photo_delivery_sync_mode` column + UI picker (`manual_release` default / `auto_sync` opt-in, migration `20260521020000`), [#169](https://github.com/iscasasola/setnayan-platform/pull/169) rewrote the 517-line client-mock panel into a real server-component reading events.photo_delivery_* + photo_delivery_jobs with live progress polling + release + disconnect server actions. `lib/photo-delivery-release.ts` (539 lines) + 3 API routes (`/api/photo-delivery/release`, `/disconnect`, `/status`) already in place. **Owner action:** Google Drive verified-app submission (#19g) — gates couples-not-on-developer-account from clean OAuth. Without #19g, OAuth works only for `indaleciocasasolaii@gmail.com`. |
| 0010 | Mood Board | ✅ Shipped | — |
| 0011 | Panood | ⚙️ OAuth + cron + UI scaffolds shipped 2026-05-16; awaiting Google verified-app review | **SKU lock 2026-05-16** (see prior history below). YouTube OAuth code shipped 2026-05-16 via commit `20b21fc`: `lib/panood-youtube.ts` + 3 routes (`/api/oauth/youtube/start` + `/callback` + `/disconnect`) + `/api/cron/oauth-refresh` + UI scaffolds `/dashboard/[eventId]/add-ons/panood/{page,setup,broadcast,reviews}`. **Owner action:** YouTube verified-app submission Phase 2 still pending (#17a — privacy disclosure ✅ shipped PR #116, demo video pending owner). |
| 0012 | Papic | ⚙️ Schema + storage target + V1 SKU seed + Drive OAuth shipped 2026-05-19/20 | Migrations 55 (`events_papic_storage_target.sql`), 73 (`v1_sku_lock_papic_seat_packs.sql`), 75 (`iteration_0012_paparazzi_seats_photos.sql`) shipped via PRs #149 + #151. `lib/papic-drive.ts` + 3 OAuth routes (`/api/oauth/drive/start` + `/callback` + `/disconnect`) shipped. UI route `/dashboard/[eventId]/add-ons/papic/page.tsx` shipped as scaffold. **Architecture lock 2026-05-16** retained (see history below — 207-camera mesh, Drive transfer at T+30d, pooled credits, Auto-Recap). **Native iOS/Android still V1.5+** — web-side schema + Drive integration now landed. |
| 0013 | Platform Stack | ✅ Shipped | Caching foundation (PR #10) · R2 storage (PR #18) · Sentry + PostHog (PR #17, #19) · CI build gate (PR #15) |
| 0014 | V1.1 Polish | 🚫 No folder | — |
| 0015 | Main Website | ✅ Shipped | Landing-page conversion upgrades — split CTA, trust signals, pricing table (PR #21) |
| 0016 | Step-by-Step Plan Builder (Setnayan Concierge) | ✅ Shipped + ⚙️ wizard architecture schema landed 2026-05-18 | Single SKU ₱4,999 wedding-anchored access locked 2026-05-17. Pricing migrations: `_concierge_pay_flat_and_charm` (2026-05-18) + `_concierge_repriced_to_2499` (2026-05-18 launch promo) + corrected back 2026-05-19. Wizard architecture schema (pgvector synthesis, migration 64 `iteration_0016_wizard_architecture_schema.sql`) landed 2026-05-18. `lib/concierge.ts` + `/dashboard/profile/concierge` route + `/admin/concierge-abuse` tab shipped. |
| 0017 | Patiktok | ⚙️ Schema + OAuth + UI scaffolds + music refs shipped 2026-05-16 | Migrations 50-52 (`iteration_0017_patiktok.sql` + `_oauth.sql` + `_music.sql`) shipped. `lib/patiktok.ts` + `lib/patiktok-tiktok.ts` + 2 OAuth routes + internal worker route + UI routes (`/booth`, `/[templateId]`). **Owner action:** TikTok app review pending (#20f). SKU lock 2026-05-16 (see history below). |
| 0018 | Supplies Marketplace | ⚙️ Schema + pricing resolver shipped 2026-05-19 | Migrations 69 + 70 (`iteration_0018_supplies_foundation.sql` + `_pricing_resolver_fn.sql`) shipped via PRs #143 + #146. `lib/supplies/` subfolder shipped. UI route `/dashboard/[eventId]/add-ons/supplies-marketplace/page.tsx` shipped. PR #148 aligned UI copy with locked Setnayan-sourced resale model. Remaining: supplier vendor onboarding, order/fulfillment flow, couple-side cart integration. Surface stays behind "Coming to your area soon" empty state until supplier vendor agreements signed. |
| 0019 | Communications | ⚠️ Partial — chat + files shipped · video meetings RETIRED 2026-05-16 | Force-majeure flow + admin escalation in Phase 2 agent (in flight); **video meetings (Daily.co) RETIRED entirely from V1+ on 2026-05-16** — couples + vendors use external tools (Google Meet, Zoom, Messenger, WhatsApp). Chat + file attachments + in-app viewers + coordinator-join + force-majeure flow all retained. |
| 0020 | Interaction Prototype | n/a | Design artifact only |
| 0021 | Couple Dashboard | ✅ Shipped | Day-of mode (PR #11) + event-day pre-load CTA (PR #12) + dispute entry placeholder (PR #22) |
| 0022 | Vendor Dashboard | ⚠️ Partial | 5 new placeholder routes shipped (PR #22); services + bookings + team + earnings in Phase 2 agent (in flight). **Wedding compatibility tag editor added 2026-05-20 via PR [#172](https://github.com/iscasasola/setnayan-platform/pull/172)** — checkbox chip groups for ceremony types + venue settings on the vendor profile page, persisting `compatible_ceremony_types` + `compatible_venue_settings` columns introduced by migration `20260521000000` (0043). |
| 0023 | Admin Console | ✅ Shipped + 2 placeholders | Funnels + Force-majeure tabs added (PR #22) — filled in by Phase 2 agent; Delete + Blacklist actions (PR #9) |
| 0024 | Save the Date | 🚫 Page-render SKU retired · 🟡 V1 ₱99 MP4 SKU (confirmed in V1 alongside 2026-05-18 V1.5+ promotion) | **Two 2026-05-16 changes:** (a) Original ₱99 page-render SKU retired (Phase 1 of landing page is free in 0002). (b) NEW Save-the-Date Video MP4 SKU reintroduced 2026-05-16 — explicitly distinct from retired SKU: input = 5-10 engagement photos · output = single 30-60s 1080×1920 vertical MP4 with Setnayan-owned music + closing-card landing-page URL · ₱99/render · multi-purchase · `save_the_date_video_render` SKU code. Drives traffic back to the free landing page via end-card. ~70% net margin under V1 tax tier. |
| 0025 | Profile Settings | ✅ Shipped | EN/TL locale toggle in Phase 2 agent (in flight) |
| 0026 | BIR Tax Compliance | ✅ Shipped | TIN auto-format (PR #5) |
| 0027 | E-signature | 🚫 V1.5 deferred (NOT promoted on 2026-05-18 — no iteration folder exists; needs separate folder-creation task before promotion) | — |
| 0028 | Email Notifications | ✅ **9/10 templates** (PR #28 added 2 more 2026-05-14) | Welcome, chat_message, order_quoted, order_paid, payment_matched, payment_rejected, rsvp_received, help_ticket_replied, vendor_inquiry_received. Force-majeure-filed notification type added 2026-05-17 (migration `20260517020000_notification_type_force_majeure_filed.sql`). |
| 0029 | Help Center | ✅ Shipped | — |
| 0030 | Guided Tour | ⚠️ Partial | Per-surface mini-tours still queued (not in current Phase 2 batch) |
| 0031 | Day-of Guest | ✅ Shipped (NEW) | Banner + 6-card grid auto-activates T-1h to T+8h (PR #11); 3 of 6 cards are stubs depending on 0009/0011/0012 |
| 0032 | Contract Intelligence | 🚫 **RETIRED 2026-05-18** | Migration `20260518200000_vendor_contracts_dual_esign_retire_0032.sql` flipped both SKU rows (`contract_intelligence_upgrade` couple-side ₱199 + vendor-side) to `is_active=FALSE`. Replaced by **free dual e-signature on every vendor contract** (no AI in V1) — vendor uploads contract PDF, picks event/couple, both parties sign with canvas-captured signatures, signatures stored as PNG image URLs in R2 with IP + UA + timestamp for evidentiary trail (RA 8792 compliant). Notary integration explicitly excluded by owner (PH Notarial Law jurisdiction restrictions). Anthropic API setup deferred to V1.5+ for 0011/0012 AI highlights only. Spec file `0032_contract_intelligence/0032_contract_intelligence.md` kept as reference for V1.5+ revival. |
| 0033 | Public API | ⚠️ Partial | `/health` + `/me` shipped earlier; Phase 2 agent in flight adds events/guests/vendors read-only |
| 0034 | Payments & Cart | ✅ Shipped (V1 manual reconciliation) · 🟡 Setnayan Pay reprice + Maya Business pending V1.5+ | TIN format fix flows through receipts (PR #5). **2026-05-16:** Setnayan Pay convenience fee repriced 3% → flat **5.0%** on top of vendor price (supersedes morning's 5.5%/6.5% dual-rate lock; flat 5.0% hits the owner-ratified 3% net design target under every plausible tax tier; admin-configurable per method but defaults uniform); **Option B confirmed — vendor absorbs gateway, Setnayan does NOT**; BIR Marketplace Withholding 0.5% pass-through per RMC 8-2024; Maya Business as V1.5+ primary gateway with Maya QR Ph preferred (1.5% gateway fee). Engineering pending: per-method config table, BIR 2307 generation, vendor_payouts table, gateway integration. |
| 0035 | Observability | ✅ Shipped (NEW) | Sentry (PR #17) + PostHog 3-event funnel (PR #19); 4 more funnels go through PostHog Insights |
| **0037** | **Event-Day Pre-load (NEW iteration)** | ✅ Shipped | Couple + vendor T-3d → T+1d "Prepare for event day" CTA + auto-prefetch T-24h → T+12h (PR #12). Spec drafted retroactively 2026-05-16 in `0037_event_day_preload/0037_event_day_preload.md` (renumbered from the originally proposed 0036 to avoid collision with `0036_pakanta`). |
| **0043** | **Wedding Type Picker** | ✅ Shipped (V1 — schema + picker + compatibility loop) | **End-to-end engineering complete 2026-05-20.** Migration `20260521000000_iteration_0043_wedding_type_picker.sql` adds events.ceremony_type + venue_setting + sub_type + is_mixed + secondary_ceremony_type columns + vendor_profiles.compatible_ceremony_types + compatible_venue_settings + wedding_type_launch_status + couple_wedding_type_notify_signups tables. UI: `WeddingTypePicker` component on /dashboard/create-event renders 2-axis picker with 2 active types (Catholic + Civil) + 4 Coming-Soon types (INC / Christian / Muslim / Cultural) with inline email-capture flowing to `couple_wedding_type_notify_signups` via `notifyWhenWeddingTypeLaunches` action. **Compatibility loop closed via [#170](https://github.com/iscasasola/setnayan-platform/pull/170)** (couple-side "Match my wedding" toggle on /vendors) + **[#172](https://github.com/iscasasola/setnayan-platform/pull/172)** (vendor-side compatibility tag editor on /vendor-dashboard) + **[#174](https://github.com/iscasasola/setnayan-platform/pull/174)** (compatibility badges on /v/[slug] public vendor profile). Next steps gated on vendor adoption: until vendors fill in their compatibility tags, columns stay NULL → "open to all" semantics keep the filter inclusive. |
| **0044** | **Per-Category Vendor Attribute Schemas** (V1.1 NEW spec) | 📐 Spec drafted 2026-05-19 | `canonical_service_schemas` + `shared_attribute_groups` (faith_compatibility, dietary_accommodations, geographic_service_areas, pricing_signal, vendor_credentials) + `vendor_service_attributes`. V1.1 launches schemas for 15 top canonical_services (catering with faith tags · photography · videography · bridal_gown_custom · band · host · coordinator · florals · stylist · photo_booth · mobile_bar · coffee_booth · officiant · transportation · wedding_cake); remaining ~100 sub-categories roll out V1.2+. |
| **0045** | **Vendor Product Catalogs** (V1.1 NEW spec) | 📐 Spec drafted 2026-05-19 | `vendor_products` table + per-product attribute schemas. ~20 of 115 canonical_services get product catalogs (consumables + portfolio types). Compound queries (attribute AND product) — "coffee booths with oat milk AND Spanish Latte". Snapshot pattern preserves cart line-item state. Setnayan first-party services (Pakanta, Pailaw, Custom Monogram, Save-the-Date Video) populate via same schema with SETNAYAN SERVICE badge. SEO at product-level URLs doubles SEO surface vs WedMeGood. |
| **0046** | **Wedding Showcase (Real Weddings)** (V1.1 NEW spec) | 📐 Spec drafted 2026-05-19 | Vendor-initiated → couple-approves → vendor-submits-3 → couple-picks-1 trigger flow. `wedding_showcases` + `wedding_showcase_vendor_credits` + `wedding_showcase_captures` + `wedding_showcase_product_credits` + `wedding_showcase_facets` tables. Faceted browse (City × Ceremony × Venue × Theme × Budget × Season) creates per-combination SEO landing pages. Vendor portfolio auto-populator + product "used at N weddings" badges close cold-start differently than WedMeGood's editorial team. Real budget brackets + day-of timeline are unique data WedMeGood lacks. |
| **0047** | **Style-Driven Vendor Marketplaces** (V1.1 NEW spec) | 📐 Spec drafted 2026-05-19 | 7 primary marketplaces sequenced V1.1.x with Stylist first (palette ΔE matching reuses 0010 engine, lowest engineering, visual demo). 5-column vendor mega-menu adopted from WedMeGood pattern. Stations & Booths as new category (30 sub-types in 5 groups — Food/Beverage / Sensory/Beauty / Visual/Keepsake / Skill/Craft / Interactive — PH-cocktail-hour culture has no WedMeGood equivalent). SETNAYAN SERVICE badge inserts (Papic / Panood / Pailaw / Patiktok / Pakanta / Concierge) as first-class marketplace listings — "Setnayan eats its own marketplace" pattern. Smart-default filtering by ceremony_type (INC couples auto-see inc_friendly caterers; Muslim couples auto-see halal vendors). |
| **0048** | **Multi-Moderator Event Access** (V1.2 NEW spec) | ⚙️ **Phase A foundation shipped 2026-05-19** | Migration 66 (`iteration_0048_event_moderators_foundation.sql`) shipped via PR #135 — `event_moderators` table + backfill + RLS helper. **NOT V1 launch** — today every event has exactly one owner; co-couple/parent/coordinator sharing arrives V1.2. Foundation laid early so future amendments to 0007/0019/0021/0028/0034 (per-payer budget, moderator-aware vendor chat, role-aware couple dashboard, moderator-aware notification routing, multi-payer cart) have schema to build against. |
| **0038** | **Editorial & Affiliates** (V1.1 NEW spec · traffic monetization) | 📐 Spec drafted 2026-05-19 | `setnayan.com/blog` (long-form articles, git-tracked MD pattern matching 0029 Help Center) + `setnayan.com/recommendations/[category]` (disclosed curated affiliate links · Involve Asia primary network — V1.1 owner action) + Sponsored Content (paid editorial features w/ unambiguous "Sponsored" badge · two-admin gate ≥₱100K per 0023 § 9.1). New tables: `editorial_articles` + `recommendation_pages` + `affiliate_links` + `affiliate_conversions` + `sponsored_slot_bookings`. PostHog `affiliate_link_clicked` event with no PII; postback endpoint `/api/affiliates/postback?network=:network` for conversion tracking. Newsletter sponsorship slot extends 0028 (single-sponsor per send). Cross-coordinates with 0022 Boosted Ads (vendor opt-out toggle) + 0039 AdSense (sponsored articles + sponsored newsletter slots are AdSense-excluded). |
| ~~**0039**~~ | ~~**Display Ads**~~ (V1.1 NEW spec · traffic monetization · activation-gated) | 🚫 RETIRED 2026-05-19 | **Retired same-day after the AdSense walkthrough surfaced that the owner's Google account is locked to AdSense-for-YouTube only — the YouTube channel went inactive, AdSense for YouTube auto-deactivated, and there's no AdSense-for-Content enrollment path forward from that account.** Three alternate URLs (`/adsense/signup`, `/adsense/new`, `adsense.google.com`) all routed back to the deactivation screen. Sidebar showed no Sites tab. Creating a fresh Google account would risk a permanent ban via Google's duplicate-AdSense identity checks (phone · payment · IP · beneficial owner) — not worth the gamble given the surface yield was already ~₱5-20K/mo vs Boosted Ads ~₱780K/yr per 20km vendor. Path A chosen (drop display ads entirely from V1.1; cookie-consent banner scope dropped since RA 10173 first-party PostHog opt-out is sufficient). 0039 spec file kept as a tombstone with the 🚫 RETIRED banner; engineering scope shrunk (no AdSense publisher console, no CSP changes, no `users.consent_state` JSONB, no `cookie_consent_events` / `adsense_activation_log` / `adsense_daily_revenue` tables, no `/cookie-preferences` route, no 0022 vendor opt-out toggle, no 0023 § 5.1 kill-switch, no 0028 `consent_updated` template, no 0029 "Cookies & ads" article). Decision log Ninth (originally tenth) 2026-05-19 row carries the full reasoning. |
| (n/a) | **Boosted Ads Activation Playbook** (NEW operations doc · traffic monetization) | ✅ Doc landed | `09_Operations/Boosted_Ads_Activation_Playbook.md` — owner-side outbound sales playbook for the existing-and-shipped Boosted Ads + Sponsored Boost program (0022 § 5b locked 2026-05-16). No engineering changes. Includes prospect-list SQL · in-app DM outreach template · 4 common objections + counters · 30-vendor launch promo `BOOSTED-LAUNCH-2026` 20% off month 1 cap 30 redemptions (engineering action: seed `promo_codes` row). Featured-vendor lookbook deliverable owed 2026-06-15. Weekly Monday review of new subs + cancels + top/bottom 5 click cohorts. |

---

## Cross-cutting infra

| Item | Status | Notes |
|---|---|---|
| **Caching & Offline Strategy** | ✅ Shipped | TanStack Query + idb-keyval persister + Workbox-equivalent service worker (PR #10) |
| **R2 Storage Migration** | ✅ Shipped | All new uploads go to R2; legacy Supabase Storage URLs still resolve (PR #18) |
| **Account lifecycle (Delete vs Blacklist)** | ✅ Shipped (code); migration owner-action pending | Replaces the soft-delete + ban model from PR #7. Owner must run `supabase db push` (PR #9) |
| **Persistent login (client-aware sessions)** | ✅ Shipped | 10-year cookie maxAge for Tauri + installed PWA; 1-year for web (PR #6) |
| **Services → Add-ons rename** | ✅ Shipped | 308 redirects from `/services/*` → `/add-ons/*` (PR #13) |
| **CI build job** | ✅ Shipped | `pnpm --filter @setnayan/web build` runs on every PR (PR #15) |
| **Vendor Verification flow (NEW 2026-05-16)** | 🟡 Spec locked · engineering pending | FREE initial / ₱1,499 annual renewal / ₱2,499 re-verification after demotion (charm-corrected 2026-05-17) · 12-document checklist (DTI / BIR 2303 / Mayor's Permit / gov ID via Persona/Veriff/Onfido / bank micro-deposit / portfolio + reverse image search / 3-5 references / live selfie + liveness / 15-min Google Meet / SMS OTP + email / social presence / AMLC sanctions) · all-or-nothing · 3-5 BD SLA · `setnayan-vendor-verification` R2 bucket (90d raw + 7yr audit). Schema migrations pending (vendors.verification_state + vendor_verification_applications + vendor_tier_history). |
| **All Tools Unlock bundle (NEW 2026-05-16)** | 🟡 Spec locked · SKU seed pending | ₱9,999/year · includes Mood Board + Palette + Seating + QR Reader + Advanced Pricing Tier · open to ALL paying vendors (NOT verified-only). vendor_tool_bundles table pending. |
| **Boosted Ads + Sponsored Boost ladder (NEW 2026-05-16 · charm-corrected + seeded 2026-05-17)** | 🟡 Spec locked · seeded in 0034 § (i) · engineering UI pending | Boosted Ads 5km ₱4,999/wk · 10km ₱7,999/wk · 20km ₱14,999/wk · Sponsored Boost Quarterly ₱249,999 / Annual ₱799,999 at 30km (verified-only). Replaces prior single ₱1,499/wk Sponsored Boost SKU (now `is_active=FALSE`). |
| **Vendor Payout model (NEW 2026-05-16)** | 🟡 Spec locked · engineering pending | Verified = immediate full payout T+1 (less gateway + BIR 0.5%); coming_soon = 3-stage milestone release 20/60/20 with T-14 + T+7 dispute windows. Demote-to-coming_soon trigger: 3+ disputes/30d. Setnayan absorbs ₱15-25 disbursement fee. vendor_payouts table + dispute counter cron pending. |

---

## 2026-05-15 PR Run — second-day shipping

After the 2026-05-14 PR run wrapped, a follow-on session on 2026-05-15 shipped 4 more PRs to main, with 4 more in flight. Spec-side: 6 new decision-log entries locked in `CLAUDE.md`.

| PR | Decision | What shipped |
|---|---|---|
| #52 | Decision 5 — UI Theme rebrand | iteration 0025 — burgundy default replacing terracotta (`#7A1F2B` accent) + new 5th theme "Forest & Champagne Gold" (`#2D4A3A` primary + `#C9A66B` gold); theme picker UI extended; idempotent enum migration |
| #55 | Decision 1 — Self-purchase confirm + self-review hard-gate | iterations 0006/0034/0023 — schema CHECK + `block_related_account_review()` BEFORE INSERT trigger blocking owner/team/payment/device/household self-reviews; cart self-purchase confirm modal (Pay full price / Comp for myself); admin moderation queue + appeal flow; new `user_devices` + `vendor_review_appeals` + `comp_grants` (stub) tables |
| #54 | Decision 3 — Public-stats exclusion + event-switcher role rows | iterations 0006/0022/0000 — `vendor_public_completed_events_stats` materialized view (filters team/internal/self-comp from public count) + `vendor_full_completed_events_stats` sibling; vendor dashboard "Completed events" card with public-vs-private toggle; event-switcher Shop/Admin console role rows; empty-state monogram split by role |
| #56 | Decision 6 — Vendor visibility + Website editor | iterations 0006/0015/0022/0023 — `vendors.public_visibility ENUM('hidden','coming_soon','verified','archived')` with `coming_soon` default + backfill of existing verified rows; DIY-browse "Verified only" toggle (OFF by default → coming-soon vendors visible with badge); `site_widgets` widget registry + `platform_availability` table; admin Website editor at `/admin/website` (8th admin surface) with native HTML5 drag-drop reorder; `/admin/verify` queue with status tabs + audit-logged actions |

**4 PRs in flight** as of this regen (background agents working in parallel worktrees):
- **PR #57** (Decision 4 homepage 12-section skeleton) — perf optimization agent running; lighthouse regression from 0.88 → 0.71 needs to return to ≥0.9 before merge
- **shared-chrome perf agent** — fixing main's lighthouse regression caused by PR #53 (shared SiteHeader) + PR #56 (admin chrome) bloat that dropped every route's lighthouse score
- **/for-vendors page agent** — full vendor-side landing per spec (Airbnb host page convention; outcome-led merchant framing per Shopify; pricing visible exception to homepage's hide-prices rule)
- **/features page agent** — feature deep-dive page (recipient of dropped Section 7 "Outsourcing, pacing, scheduling" content from Decision 4 homepage redesign)

**6 new decision-log entries today** (in CLAUDE.md): dual-role self-purchase/review gate · V1 platform expansion (5 native apps deferred V1.5) · dual-role public-stats exclusion · public-website wholesale redesign · UI theme rebrand · vendor visibility + widget editor.

**Status shifts (from 2026-05-14 baseline):**
- 0000 — chrome drift fix from Decision 7 (Roadmap doc) still pending; this PR run added Shop/Admin event-switcher rows
- 0006 — stays ⚠️ Partial (marketplace browse + reviews shipped; vendor-side admin moderation now wired via PR #55; full self-review gate live)
- 0015 — stays ✅ Shipped (12-section restructure in PR #57 still pending)
- 0022 — stays ⚠️ Partial (vendor dashboard public-stats card + public_visibility state machine added)
- 0023 — ✅ Shipped + 2 new surfaces (Website editor as 8th admin surface; Verify queue at `/admin/verify`); review-moderation queue from PR #55
- 0025 — ✅ Shipped (theme system extended to 5 themes — Setnayan Default Color burgundy + Forest & Champagne Gold)
- 0034 — ✅ Shipped (cart self-purchase confirm modal added)

**Owner-side blocker** (RESOLVED 2026-05-20 evening):
- ~~`supabase db push`~~ — ✅ **Verified caught up 2026-05-20 evening.** `supabase migration list --linked` against `setnayan-prod` (ref `njrupjnvkjkitfctetvi`) shows all 88 local migrations applied on remote, ending at `20260522010000_iteration_0041_couple_event_type_notify_signups.sql`. No pending migrations as of this verification. The earlier "10+ migrations pending" warning rolled forward across multiple PR runs and finally cleared today.

**Migration name-collision note:** Three of the 4 new migrations from 2026-05-15 each declare `CREATE TABLE IF NOT EXISTS admin_audit_log` with slightly different columns (PRs #54, #55, #56 each stubbed it independently). Two declare `CREATE TABLE IF NOT EXISTS comp_grants` similarly (#54, #55). All idempotent (`CREATE TABLE IF NOT EXISTS` + `ADD COLUMN IF NOT EXISTS`); union schema lands cleanly in any merge order. Worth eyeball when reviewing.

---

## Phase 2 — in flight as of EOD 2026-05-14

5 background agents are landing PRs in parallel. When this doc was regenerated, the 3 originally-spawned agents had opened their PRs and the 2 follow-up agents had just launched:

| Agent | What it ships |
|---|---|
| A | `/vendors` public marketplace + `vendor_reviews` schema + post-completion trigger + display on `/v/[slug]` + vendor-side review viewer |
| B | `/vendor-dashboard/services` editor + `/bookings` inbox + `/team` (4 roles) + `/earnings` rollup |
| C | `/admin/funnels` Supabase-side analytics + `/admin/force-majeure` queue + `force_majeure_flags` schema + couple-side `/dashboard/[eventId]/disputes` flag form |
| D | EN/TL locale toggle in `/dashboard/profile` + 2 new email templates (help_ticket_replied + vendor_inquiry_received) |
| F | Read-only `/api/v1/events`, `/api/v1/events/[id]/guests`, `/api/v1/vendors`, `/api/v1/vendors/[id]` |

Owner must run `supabase db push` once all Phase 2 PRs are merged — multiple new migrations land together (blacklist + reviews + force-majeure + team + services-pricing fields).

---

## Phase 3 — decision-gated (waiting on owner)

| Item | The decision |
|---|---|
| ~~Save-the-Date render pipeline~~ | **CLOSED 2026-05-16** — 0024 reframed, no render pipeline needed (free landing page Phase 1) |
| Panood live stream | Provision Cloudflare Stream Live + YouTube Data API + master channel |
| Marketplace commission model | Free / commission per booking / paid tier |
| Daily.co video meetings | Sign up, paste API key |
| ~~Anthropic Claude API (0032)~~ | ~~Sign up + spend cap~~ | **DEFERRED 2026-05-18 — 0032 RETIRED.** Replaced by free dual e-sign on every vendor contract (no AI in V1). Anthropic env + spend caps preserved in `.env.example` for V1.5+ 0011/0012 AI highlights activation, but **no owner action needed for V1 launch**. |
| Apple Developer Program | $99/yr enrollment (V1.0+ deferred per owner) |
| ~~Render pipeline infra~~ | **CLOSED 2026-05-16** — alongside item #6 closure; landing page is web tech only |

---

## Owner-side blockers (must act, no code can replace)

- ~~**`supabase db push`**~~ — ✅ **DONE 2026-05-20 evening.** Verified via `supabase migration list --linked`; all 88 local migrations applied on remote.
- **Sentry / PostHog smoke test** — trigger one prod error, sign up one fresh user
- **Resend signup smoke test** — confirm welcome email lands at non-account-holder Gmail
- **Cowork spec reconciliation** — `COWORK_INBOX.md` entries below

---

## Pending Cowork spec updates (from today's run)

The 2026-05-14 PR run added or changed several iterations. The spec corpus needs catch-up edits via Cowork:

1. **0037 Event-Day Pre-load** — ✅ DONE 2026-05-16. Iteration folder `0037_event_day_preload/0037_event_day_preload.md` created (renumbered from the originally proposed 0036 to avoid collision with the existing `0036_pakanta` iteration). Spec retroactively documents PR #12 — couple-side banner CTA (T-3d / T+1d) + silent auto-preload (T-24h / T+12h) + vendor-side per-thread CTA + RLS-gated bundle + service-worker asset warming.
2. **0023 Admin Console + 0025 Profile Settings** — update to reflect the Delete vs Blacklist redesign (PR #9). The old soft-delete + ban model from PR #7 is gone; spec text in `0023_admin_console.md` § 9.1 should be updated.
3. **0006 Vendors** — once the Phase 2 marketplace + reviews PR merges, update `0006_vendors_management.md` to reflect that the marketplace + review-stats materialized view are live.
4. **0019 Communications** — once the Phase 2 force-majeure PR merges, update `0019_communications.md` to reflect the actual schema + admin flow.
5. **Services → Add-ons rename** ✅ DONE 2026-05-16. Mechanical search-replace applied across all active iteration spec files (0000, 0005, 0009, 0010, 0011, 0012, 0015, 0020, 0021, 0030) + 02_Specifications/{00_Iteration_Connection_Map, Feature_Documentation_By_Role}.md + 01_Contracts/{Setnayan_Privacy_and_Security_Policy, Setnayan_Vendor_Agreement}.md + tests.md files + README.md. Couple-side route reference `/services` → `/add-ons` updated in 0021 § 2.2 nav table row 5. Historical references in `CLAUDE.md` decision log + `07_Archive/MIGRATION_AUDIT_2026-05-11.md` left intact (those are temporal records of the rename, not current-state docs). Vendor-side "My Services" terminology in 0022 stays untouched — it's a different concept (the vendor's own offerings).
6. **0035 Observability** ✅ DONE 2026-05-16. Row promoted in `V1_Gap_Analysis_Status.md` Tier 3 row #8 — expanded to include both 0023 funnel analytics (7 V1 funnels via Supabase) AND 0035 Observability (Sentry error tracking + PostHog 3 server-side funnels live + 4 more via PostHog Insights). Sentry prod smoke test remains pending — flagged in decision-log row 10 (2026-05-16) and bundled with the long-pole owner-admin sprint (items #17-20).

Owner: walk these via Cowork at convenience.

---

## How to re-generate this doc

1. List spec folders: `ls ~/Documents/Claude/Projects/Setnayan/ | grep -E '^[0-9]{4}_'`
2. Migrations on `main`: `git ls-tree -r origin/main supabase/migrations | awk '{print $4}'`
3. Routes: `git ls-tree -r origin/main apps/web/app | grep '/page\.tsx$' | awk '{print $4}'`
4. Cross-reference with [STATUS.md](https://github.com/iscasasola/setnayan-platform/blob/main/STATUS.md) + [HANDOFF.md](https://github.com/iscasasola/setnayan-platform/blob/main/HANDOFF.md).
5. Re-bucket every iteration. Update the table above.
