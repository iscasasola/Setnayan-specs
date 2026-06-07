# V2 Cutover Plan · 2026-05-28

> **Status:** locked 2026-05-28 · execution starts **post-pilot** · pilot 2026-06-01 ships locked V1 unchanged · cutover day TBD (recommendation: ~2026-06-22 once pilot stabilizes).

> **Source-of-truth blueprint:** owner-supplied `💎 Part 1 Final Customer (B2C) Pricing Verification.md` (5 parts: B2C pricing · B2B tokens · manpower fulfillment · QR telemetry rewards · offline architecture) + `SQL Guide.pdf` (7-page schema migration with `vendor_wallets`, `platform_retail_catalog`, `platform_package_catalog`, `event_software_activations`, `registered_crew_devices` + 5-cap trigger, `token_rewards_log`, `execute_manpower_telemetry_reward()`, `consume_vendor_assets()`). Both originals live at `~/Desktop/setnayan_blueprint/` and `~/Desktop/SQL Guide.pdf` on the owner's machine.

> **Decision lock:** [CLAUDE.md decision log row 2026-05-28 · third 2026-05-28 row · "V1 → V2 architectural pivot"](CLAUDE.md). This doc operationalizes that lock.

---

## TL;DR

V1 launches to a 5–20 personal/family pilot on **2026-06-01 unchanged**. Locked V1 (Setnayan Pay 5%, apply-then-pay, Today's Focus ₱9,999/24mo, 65-card wizard, weekly vendor tiers, 16-SKU launch promo through 2027-01-30) ships exactly as currently on `origin/main`. Pilot couples are grandfathered on V1 pricing for their wedding.

V2 cutover happens **after pilot stabilizes** (~3 weeks of pilot operation, expected mid-late June 2026). Cutover is a coordinated atomic flip across schema · 18 SKU catalog · vendor token wallet · 65-card wizard rebind · QR + telemetry rebuild · IndexedDB offline daemon · communications. Day-of cutover: pilot vendors get **+100 free earned tokens** as the V1 promo replacement, V1 launch-promo references retire from `/privacy` + marketing, and Setnayan Pay 5% disappears entirely (Setnayan is now publisher, not marketplace intermediary).

Owner-side action items reset for V2 (different BIR posture — Setnayan as publisher of software SKUs only, no Marketplace Withholding role on manpower since that's offline cash).

---

## The 6 owner-confirmed decisions (locked 2026-05-28)

| # | Question | Decision |
|---|---|---|
| 1 | Pilot timing | **Ship V1 to pilot · cutover post-pilot.** Pilot 2026-06-01 ships locked V1. V2 lands over ~3 weeks during/after pilot. Pilot couples grandfathered. |
| 2 | Today's Focus disposition | **Paywalled at ₱1,499 entry SKU.** Keep the 65-card wizard substrate (structural moat). Drop the V1 24-mo/pause-aware machinery + ₱9,999/₱4,999 re-up model. ₱1,499 one-time per event unlocks the wizard. |
| 3 | Vendor recurring billing | **28-day prepaid blocks · manual renewal.** Pro Vendor ₱1,999/28-day + Enterprise ₱5,499/28-day. No recurring auto-charge in V1. Email + dashboard countdown 7 days before expiry · lapse → auto-downgrade to Free Vendor. GCash Merchant API / Maya recurring rails stay V1.5+. |
| 4 | Manpower ₱15k flow | **Build as specced · offline cash + 2-token handshake.** Setnayan handles ₱0 of the ₱15k. Vendor stamping via 2-token deduction. No invoice/OR for this leg. Vendors handle their own BIR Form 2307 on the cash. |
| 5 | Setnayan Pay 5% fee | **Retire entirely · Setnayan is publisher.** All 18 software SKUs + 2 bundles sold at sticker price. No convenience fee anywhere. Vendor token packs same posture. Setnayan revenue is full retail minus SaaS overhead per catalog. |
| 6 | Launch promo | **100 free earned tokens to verified pilot vendors · drop V1 promo.** Per blueprint Part 5 Launch Status. Existing V1 launch promo on retired SKUs ends with the cutover. Mass email comms to affected accounts. |

---

## Retired-vs-new SKU map

### Retired V1 SKUs (marked `is_active=FALSE` on cutover day · added to `RETIRED_SKU_CODES`)

**Customer-side:** `concierge_complete` (₱2,499 + variants) · `todays_focus` (₱9,999) · `todays_focus_extension` (₱4,999) · `save_the_date_video_render` (₱199 · pending owner confirm § Open items #6) · `monogram_hero_upgrade` (₱1,999) · **`bespoke_monogram` (₱2,999)** (RETIRED 2026-05-28 · owner: Animated Monogram only) · `ai_edited_highlight` (₱3,499) · `ai_video_highlight` (₱999) · `pro_widget_schedule` (₱999) · `paparazzi_3_seats` (₱1,499) · `paparazzi_5_seats` (₱2,499) · `paparazzi_camera_addon` (₱999) · `panood_daily_broadcast` (₱2,499) · `panood_camera_sync` (₱99/day) · `panood_annual_streaming` (₱19,999) · `panood_annual_streaming_plus` · `panood_template_pack_daily/annual` · `papic_cam_bridge_*` (₱99/day · ₱249/day flat · ₱2,499/year) · `panood_cam_bridge_slot_day` (₱199) · `patiktok_setnayan_tiktok` (₱999/day) · `patiktok_personal_tiktok` (₱1,999/day) · `patiktok_cam_bridge_day/annual` · `patiktok_video_overage` (₱49/+10) · **`pakanta_basic` (₱1,999) · `pakanta_premium` (₱3,999) · `pakanta_wedding_suite` (₱9,999)** (3 V1 Pakanta tiers retire · replaced by single ₱3,499 SKU per § Open items #4).

**Vendor-side:** `vendor_pro_weekly` (₱499/wk) · `all_tools_unlock_annual` (₱9,999/yr) · `boosted_ads_5km_weekly` (₱4,999) · `boosted_ads_10km_weekly` (₱7,999) · `boosted_ads_20km_weekly` (₱14,999) · `sponsored_boost_quarterly` (₱249,999) · `sponsored_boost_annual` (₱799,999) · `vendor_verification_annual_renewal` (₱1,499) · `vendor_verification_reverification` (₱2,499) · `tool_mood_board_weekly` (₱99) · `tool_seat_arrangement_weekly` · `tool_palette_weekly` · `tool_qr_reader_weekly` · `tool_advanced_pricing_weekly`.

### New blueprint SKUs (inserted via cutover migration)

**Customer-side (18 blueprint catalog rows + 1 Setnayan-published Pakanta row = 19 total):** see `platform_retail_catalog` seed in SQL Guide § 2. Highlights — `ANIMATED_MONOGRAM` ₱2,499 · `PRO_WEBSITE` ₱2,999 · `CUSTOM_QR_GUEST` ₱1,499 · `TODAYS_FOCUS` ₱1,499 (wizard substrate · no trial · one-time impulse) · `PINOY_MAP_ROUTE` ₱1,499 · `INDOOR_BLUEPRINT` ₱1,499 · `CALL_TIME_ESCALATOR` ₱1,999 · `PATIKTOK_COMPILER` ₱2,499 · `PABATI` ₱999 · `HIGH_RES_ARCHIVE` ₱2,999/yr · `PAPIC_GUEST` ₱2,999 · `PAPIC_GUEST_STORIES` ₱3,499 · `PAPIC_MEDIA_PACK` ₱9,999 · `PAPIC_SEATS` ₱2,999 (5-seat pro pass) · `PANOOD_SYSTEM` ₱3,499 · `SDE` ₱5,499 · `CAMERA_BRIDGE` ₱1,999 · `LIVE_WALL` ₱3,499 · **`PAKANTA` ₱3,499** (custom songwriter · single-tier consolidation from V1's 3-tier model · added 2026-05-28 per owner directive). The 7 `is_token_able=TRUE` SKUs (`PATIKTOK_COMPILER`, `PABATI`, `PAPIC_SEATS`, `PANOOD_SYSTEM`, `SDE`, `CAMERA_BRIDGE`, `LIVE_WALL`) are the ones that fire telemetry rewards into vendor wallets per blueprint Part 4 § 2. **`PAKANTA` is NOT token-able** (no telemetry checkpoint · it's a fulfillment-on-delivery service per iteration 0036 architecture).

**Customer-side bundles (2 rows in `platform_package_catalog`):** `GUIDED_PACK` ₱11,999 (full guided suite incl. 3-month High-Res + Drive auto-transfer) · `MEDIA_PACK` ₱16,999 (comprehensive media processing suite).

**Vendor-side subscriptions (28-day prepaid blocks):** Pro Vendor ₱1,999/28-day (1 category lock · max 5 sub-seats) · Enterprise ₱5,499/28-day (multi-category · unlimited sub-accounts).

**Vendor-side token packs (₱100/token flat · sizes 4/10/25/50/100 · no discount — bulk earns bonus tokens on top):** superseded the ₱250-baseline ladder 2026-06-04 ("no more 250"), see `Price_Reconciliation_2026-06-04.md`.

**Manpower fulfillment:** ₱15,000 flat-rate vendor crew SKU. Setnayan handles ₱0 (offline cash). 2-token deduction from claiming vendor's wallet stamps Vendor ID as event owner-stamp.

### Today's Focus rebind

V1: `todays_focus` ₱9,999 one-time + `todays_focus_extension` ₱4,999 re-up · 24-month cumulative-active runtime · pause-aware · ALL 65 wizard cards free for active subscribers.

V2: `TODAYS_FOCUS` ₱1,499 one-time per event · no runtime expiry (one purchase, full wedding access) · drops the 24-mo machinery + pause/resume + `events.todays_focus_*` columns (5 columns retired in cutover migration). Wizard surface stays · paywall gates entry · DIY toggle still available.

---

## Schema cutover migration order

Single coordinated migration applied on cutover day via `supabase db push --linked` per [[feedback_setnayan_push_migrations_myself]]. Idempotent on `IF NOT EXISTS` + `CREATE OR REPLACE` patterns from the SQL Guide.

**Pass 1 — Retire V1 surfaces.** `UPDATE service_catalog SET is_active=FALSE WHERE sku_code IN (...retired list above...)`. Drop columns: `events.todays_focus_status` · `events.todays_focus_purchased_at` · `events.todays_focus_first_activated_at` · `events.todays_focus_paused_at` · `events.todays_focus_pause_count` · `events.todays_focus_total_paused_seconds` · `events.todays_focus_extension_count` · `events.concierge_status` · `events.concierge_trial_used_at` · `events.concierge_expires_at` · `events.concierge_activated_at` · `events.concierge_complete_purchased_at` · `events.concierge_abuse_strike_count` · `events.concierge_enforcement_level` · `events.concierge_enforcement_at` · `events.concierge_enforcement_by` · `events.concierge_enforcement_reason` · `events.launch_promo_until` (column drop) · `users.show_todays_focus_wizard` · `users.concierge_trial_used_at`. Drop tables: `setnayan_pay_methods` · `concierge_abuse_flags` · `vendor_contract_signatures` (dead schema from 2026-05-18 retirement) · all Maya disbursement scaffolding tables if they shipped.

**Pass 2 — SQL Guide schema.** All 7 pages of SQL Guide PDF executed verbatim (with adjustments): `vendor_wallets` · `platform_retail_catalog` + 18-SKU seed · `platform_package_catalog` + 2-bundle seed · `event_software_activations` · `registered_crew_devices` + `check_crew_device_seat_allocation()` 5-cap trigger · `token_rewards_log` · `execute_manpower_telemetry_reward()` function · `consume_vendor_assets()` function.

**Pass 3 — Pilot vendor seed.** `UPDATE vendor_wallets SET earned_tokens = earned_tokens + 100 WHERE vendor_id IN (SELECT vendor_profile_id FROM vendor_profiles WHERE verification_status='verified')`. Insert `token_rewards_log` audit rows with `service_code='PILOT_GRANT_2026_06'` for each affected vendor.

**Pass 4 — 45-day voucher expiry sweeper.** Lazy-eval on read per [[reference_setnayan_cron_strategy]] — no cron job. Function `evaluate_earned_token_expiry(vendor_id)` runs on every `vendor_wallets` SELECT in the app code · zeros out `earned_tokens` if `event_date + 45 days < NOW()` for that wallet's most-recent reward event. (Detailed shape TBD during Phase E implementation.)

**Pass 5 — RLS policies.** Per established patterns from `02_Specifications/RLS_Policy_Pattern.md`. `vendor_wallets`: vendor reads/writes own row · admin reads all · couples no access. `registered_crew_devices`: vendor reads own + couples read for own event_id · admin reads all. `event_software_activations`: vendor reads own · couple reads for own event · admin reads all. `token_rewards_log`: vendor reads own · admin reads all · no host access. `platform_retail_catalog` + `platform_package_catalog`: public read · admin write only.

---

## Phased PR plan (post-pilot · ~10 phases · ~40 PRs · ~2-3 weeks)

Each phase ships as 1-5 PRs auto-merged on green per [[feedback_setnayan_pr_auto_merge]]. WHY-rich commit bodies cross-reference this doc per [[feedback_setnayan_document_changes_with_why]]. Schema migrations push BEFORE merge per [[feedback_setnayan_push_migrations_myself]].

**Phase A · Schema cutover** (Task #3 · ~2 days) — Pass 1-5 above as a single migration · pushed to prod first · code follows.

**Phase B · Pricing surfaces** (Task #4 · ~3 days) — `/pricing` rewrite (18 SKUs grid + 2 bundles) · `/for-vendors` rewrite (Pro/Enterprise 28-day + 5 token packs) · `/privacy` (drop Setnayan Pay disclosure + add token voucher + offline-storage disclosures) · homepage worked example rewrite · drop Setnayan Pay 5% math everywhere.

**Phase C · Vendor token wallet + 28-day subs** (Task #5 · ~4 days) — vendor dashboard token wallet UI (dual-balance, FIFO burn, voucher-expiry countdown) · token pack purchase flow (5 tiers) · Pro Vendor + Enterprise 28-day prepaid block flow · auto-downgrade on lapse · email comms (7-day · expiry-day · day-after).

**Phase D · Master event QR + crew device handshake** (Task #6 · ~3 days) — Master Event QR generator with rolling 60s hash regen · couple displays from Phase 2 wedding website route · crew app Camera Bridge Registration UI · 5-cap enforced via existing trigger · audit log.

**Phase E · Telemetry endpoints + 14-token stacking** (Task #7 · ~5 days) — 7 telemetry checkpoint endpoints (Papic file-volume · Panood RTMP duration · Patiktok WASM render · Pabati guest clips · SDE callback · Camera Bridge transit · Live Wall WebSocket) · 14-token stacking ladder consumes `execute_manpower_telemetry_reward()` · 45-day voucher expiry lazy-eval.

**Phase F-Bid · Bid/RFP marketplace** (Task #13 · ~3-5 days · added 2026-05-28 per owner "we do it now") — `couple_briefs` + `vendor_bid_submissions` tables · region-weighted token burn to answer (1–3 tokens = ₱100/₱200/₱300, ₱300 ceiling · banded by the wedding region's **minimum wage**: low-wage 1 · hubs 2 · NCR/CALABARZON/C.Luzon 3 · keyed to the wedding's region, **never by booking size** · repriced 2026-06-05 from 3‑4‑5‑6, see `Token_Economy_Flow_Map_2026-06-01.html`) · couple brief-authoring surface at `/dashboard/[eventId]/briefs/new` · vendor bid-inbox at `/vendor-dashboard/bid-inbox` · token deduction via `consume_vendor_assets()` atomic on bid submission · admin moderation queue (per 0023 § 6 Disputes pattern) · RLS (vendor reads briefs in their canonical_service coverage · couples read own · admin reads all). ~~High-valuation brief token sink drains excess vendor balances~~ — retired with the by-booking-value model (2026-06-03); the burn is now region-weighted, flat within a band.

**Phase F · Manpower flow + 2-token handshake** (Task #8 · ~3 days) — ₱15k manpower SKU surface · 2-token handshake fee deduction via `consume_vendor_assets()` · admin audit · vendor stamping for token rewards. BIR-exempt leg per blueprint Part 3 § Payment Flow.

**Phase G · IndexedDB + offline daemon** (Task #9 · ~5 days) — client-side IndexedDB vault initialization · unified media submission interceptor pipeline · `navigator.onLine === false` divert · background auto-synchronization daemon · R2 + Supabase post-event flush. Extends current iteration 0031 day-of PWA shell.

**Phase H · 65-card wizard rebind** (Task #10 · ~4 days) — `WIZARD_TASKS` rebound to new SKU substrate · Today's Focus paywall gate at ₱1,499 · drop pause/resume + 24-mo expiry UI · PLAN_GROUPS sync · rebind cards referencing retired SKUs (Save-the-Date Video, Monogram Hero, AI Edited Highlight, Concierge wizard) to nearest blueprint equivalents.

**Phase I · 100-token pilot grant + V1 promo retirement** (Task #11 · ~2 days) — Pass 3 migration applied (Phase A) · mass email via 0028 to pilot vendor cohort + waitlist · `/privacy` + `/pricing` launch-promo block removal · `/for-vendors` retire 2027-01-30 references.

**Phase J · Spec corpus repaper** (Task #12 · ~3-4 days) — all affected iteration .md files updated · status anchors refreshed · `Pricing.md` regenerated from new catalog · memory files updated (retire `project_setnayan_concierge_objective` + create `project_setnayan_v2_publisher_model`) · all `.docx` mirrors regen via pandoc.

**Total realistic effort:** ~30-35 dev-days · with parallel agent execution per [[feedback_setnayan_pr_auto_merge]] compressible to ~3 calendar weeks wall-clock once cutover day fires.

---

## Pilot-day → cutover-day timeline

| Date (estimate) | Milestone | What ships |
|---|---|---|
| 2026-06-01 | **Pilot launch** | Locked V1 unchanged. 5-20 personal/family cohort exercises payment cycle, lock/unlock, wizard surface, Today's Focus ₱9,999, Setnayan Pay 5%, weekly vendor tiers, 16-SKU launch promo. |
| 2026-06-01 → ~06-15 | Pilot operation | Real payment captures · admin reconciliation flow · vendor verification queue · all V1 architectural locks exercised against real (small-scale) traffic. Bugs surface + get fixed in normal post-launch sprint. |
| ~2026-06-15 | Pilot stabilization checkpoint | Owner decision: pilot stable enough for cutover? OR extend pilot another week? Soft gate. |
| ~2026-06-16 | **Phase A migration push** | SQL Guide schema applied to prod via `supabase db push --linked`. Old V1 SKUs marked `is_active=FALSE`. Schema is V2; code is still V1 (feature-flagged dual-read). |
| ~2026-06-16 → 06-22 | **Phases B + C + H + I parallel** | Pricing surfaces · vendor token wallet + subs · wizard rebind · 100-token pilot grant + promo retirement comms. ~6 calendar days of parallel agent work. |
| ~2026-06-22 | **V2 cutover day (atomic flip)** | Last V1 code paths retire. /pricing /for-vendors /privacy /homepage all V2. Pilot vendors get 100-token grant. Email blast to waitlist. CONCIERGE_ENABLED killswitch retires. |
| ~2026-06-22 → 07-05 | **Phases D + E + F + G** | Master event QR · 7 telemetry endpoints · manpower flow · IndexedDB offline daemon. Lands as V2.1 polish. |
| ~2026-07-05 → 07-10 | **Phase J · spec repaper** | All iteration .md updates · status anchors · Pricing.md · memory files · .docx mirrors. Ends V1→V2 transition. |

Public launch (target 2026-12-01 per [[project_setnayan_pilot_timeline]]) ships V2 architecture as the canonical baseline. Owner's December 2026 wedding is the dogfood anchor for V2.

> **Gate before announcing public piloting:** run `Pre_Public_Pilot_Hardening_2026-06-04.md` — Part A copy-resistance/IP (matching engine confirmed server-side; rate-limit/bot-protect public surfaces; anti-scrape ToS + trademark + trade-secret) and Part B data-security (RLS layer verified strong; fix the HTTP edge — security headers/CSP + rate limiting — plus the `SETNAYAN_DEMO_MODE` prod foot-gun, RA 10173 hard-delete/breach-runbook, and PII-in-logs scrubbing). The closed 2026-06-01 pilot does not need it; the public announcement does.

---

## Owner-side action checklist for cutover

**Pre-cutover (during pilot · weeks 1-2):**

- [ ] Decide cutover date (recommend ~2026-06-16 if pilot stable, ~2026-06-22 if extended).
- [ ] BIR posture re-confirm: Setnayan as publisher of software SKUs means OR issuance on every B2C sale stays mandatory. Setnayan Marketplace Withholding (0.5%) role retires since vendor bookings no longer flow through Setnayan Pay. Form 2307 for vendor payouts retires entirely (no payouts). New posture: simpler — Setnayan invoices end-customers directly for software.
- [ ] Token pack PHP payment receiving: continues to use existing manual reconciliation flow (BDO + GCash QR) per V1 apply-then-pay. No new gateway needed for V2.
- [ ] Verified pilot vendor list snapshot: capture `(vendor_profile_id, business_name, owner_email)` of every vendor with `verification_status='verified'` as of cutover-day-minus-7. This is the cohort that receives 100 free earned tokens.

**Cutover day:**

- [ ] Verify Phase A migration applied to prod (`supabase migration list --linked` confirms `20260616_v2_cutover.sql` applied).
- [ ] Verify 100-token grant landed in `vendor_wallets` for verified pilot vendors (`SELECT vendor_id, earned_tokens FROM vendor_wallets WHERE earned_tokens >= 100` shows expected count).
- [ ] Verify retired SKUs are `is_active=FALSE` (`SELECT sku_code, is_active FROM service_catalog WHERE sku_code IN (...retired list...)` returns all FALSE).
- [ ] Verify `/pricing` + `/for-vendors` + `/privacy` show V2 copy.
- [ ] Trigger comms blast: mass email via 0028 to (a) waitlist + (b) verified pilot vendors + (c) pilot couples (grandfathering note).

**Post-cutover (week 1):**

- [ ] Monitor token pack purchase flow (any reconciliation issues surface in admin queue).
- [ ] Monitor vendor 28-day expiry countdown (first cohort of expiring subs hits T+28 days post-cutover).
- [ ] Spec corpus repaper review (Phase J PR set).

---

## Communications plan

### 100-token pilot vendor grant (cutover day)

Subject: *"Setnayan upgrade · 100 free tokens loaded · architecture update"*

Body (brand voice per [[feedback_setnayan_no_dev_text_post_launch]]):
> Setnayan just upgraded its vendor economy. As a verified pilot vendor, you've been granted **100 free tokens** (₱25,000 marketplace value) loaded into your wallet.
> What changed: Setnayan now sells software directly to couples (no marketplace commission). Vendors earn token vouchers by serving events through our app — see your wallet's "Earned" balance for tokens that came from your event work.
> Tokens fund: bidding on public client briefs · unmasking direct client contact info · claiming staffing gigs. Vouchers (earned) expire 45 days after the event date if unused. Purchased tokens never expire.
> Open your wallet at /vendor-dashboard/wallet to see your balance.

### V1 launch-promo retirement (cutover day · waitlist + signed-up accounts)

Subject: *"Setnayan architecture update · what's new + what changed"*

Body:
> Setnayan has refined its model based on what we've learned during the pilot. Three things to know:
> 1. **Free vendor registration during launch still stands.** Free Vendor accounts are free forever — no setup fee, no monthly bill.
> 2. **The "10 services free through January 2027" launch promo is retiring.** We've replaced it with a stronger offer for verified pilot vendors: 100 free tokens in your wallet on activation. Existing waitlist accounts: when you complete verification, you'll receive the same grant.
> 3. **New pricing structure:** Couples now buy software directly (18 SKUs · 2 bundles · transparent retail). Vendors earn token vouchers by serving events. See `/pricing` and `/for-vendors` for the new structure.

### Pilot couple grandfathering note

Pilot couples (5-20 family/friends on their pre-cutover events) keep V1 pricing for their wedding. Sent as a brief in-app banner + email confirmation: *"Your event is grandfathered on the pricing you booked under. Nothing changes for you. New events created after this date use Setnayan's updated catalog."*

---

## Open items + risks

### Risks

1. **Token wallet contradicts the "NO wallet UI" guardrail** locked in CLAUDE.md system reminder header. Owner has explicitly approved this rule override for V2 in the 6-decision lock. Future agents reading the system reminder may flag the contradiction — they should be pointed at this doc + the CLAUDE.md V1→V2 decision row.
2. **Telemetry-driven token rewards introduce fraud surface.** Mitigations are speced (60s rolling hash on Master QR, file-size + count thresholds on Papic, RTMP socket continuity on Panood, etc.) but real attack vectors will surface only post-launch. Plan: admin monitoring dashboard for anomalous reward patterns (V2.1).
3. **Manpower offline cash leg has no Setnayan-side audit trail beyond the 2-token deduction.** Vendors are trusted to handle their own BIR. Disputes between couples and crew that don't surface inside Setnayan's chat threads will be invisible to admin moderation.
4. **45-day voucher expiry is a soft cliff.** Vendors who serve a wedding but don't bid on any other event within 45 days lose all earned vouchers. Tactically generous (drains supply, protects purchased-token pricing) but may produce vendor dissatisfaction. Communications + dashboard countdown widget mitigate.
5. **No recurring billing rail until V1.5+.** 28-day prepaid block flow requires vendor to manually renew. Lapse rate could be high. Mitigation: 7-day email + 3-day reminder + day-of expiry + 7-day post-expiry "reactivate with one click" copy.
6. **Cutover atomic flip carries deploy risk.** Mitigation: phased PR plan with feature flag — Phase A migration ships first (schema both old + new alive), code flips per-surface in Phases B-I, V1 code paths retired only in final Phase J cleanup. Rollback feasible until Phase J merges.

### Open items

1. **`PILOT_GRANT_2026_06` service_code for the 100-token audit row** — not in `platform_retail_catalog`. Decide: add as a synthetic catalog row (price ₱0 · `is_token_able=FALSE`) for FK integrity, OR remove the FK constraint from `token_rewards_log.service_code → platform_retail_catalog.service_code` (the SQL Guide doesn't show the FK explicitly, so likely fine to just write 'PILOT_GRANT_2026_06' as a free-text marker).
2. ~~**High-valuation brief token sink (5-8 tokens per proposal) requires marketplace bid model that doesn't exist in V1.**~~ **RESOLVED 2026-05-28 · owner: "we do it now."** Bid/RFP marketplace pulled into V2 cutover scope as new **Phase F-Bid** (between Phase E telemetry and Phase F manpower · ~3-5 days engineering · Task #13). New tables: `couple_briefs` (event_id · brief_title · brief_body · category · estimated_budget_range · brief_valuation_tier 1-3 · status open/closed/awarded · expires_at) · `vendor_bid_submissions` (brief_id · vendor_id · proposal_body · proposed_price · tokens_burned · submitted_at · status pending/shortlisted/awarded/declined). Token cost calculation: Tier 1 (basic · under ₱20k budget) = 1 token · Tier 2 (mid · ₱20k-₱100k) = 3 tokens · Tier 3 (high-value destination · ₱100k+) = 5-8 tokens (sliding by `estimated_budget_range`). Token deduction via `consume_vendor_assets()` on bid submission (atomic · idempotent on duplicate-submit). Couple-side brief authoring surface · vendor-side bid inbox · admin moderation queue (per [0023 § 6 Disputes](0023_admin_console/0023_admin_console.md) pattern). RLS: vendor reads briefs in their canonical_service coverage · couples read own briefs · admin reads all.
3. ~~**Today's Focus paywall at ₱1,499 — does the 3-day free trial concept survive in V2?**~~ **RESOLVED 2026-05-28 · owner: "today's focus 3 day trial retires."** Drop trial entirely. V1's card-less 3-day account-level trial + per-event lock from CLAUDE.md 2026-05-17 row + tiered abuse-enforcement framework (warning → trial_banned → full_banned) + `concierge_abuse_flags` table + 6 `users.concierge_*` + `events.concierge_trial_used_at` columns all retire on cutover. V2 Today's Focus = ₱1,499 one-time impulse purchase per event · no trial · no abuse-detection · no admin Concierge Abuse review tab. Schema cleanup added to Phase A Pass 1 column drops.
4. ~~**Pakanta (custom songwriter) iteration 0036 SKUs (Basic ₱1,999 · Premium ₱3,999 · Wedding Suite ₱9,999)**~~ **RESOLVED 2026-05-28 · owner: "pakanta 3499 - i just forgot but let us keep it."** Pakanta survives V2 cutover. **Interpretation:** consolidates from 3 V1 tiers to single ₱3,499 SKU under V2 simpler model (matches the simplification pattern of TF ₱9,999/24mo → ₱1,499 one-time + vendor weeklies → monthly prepaid blocks). Single SKU `PAKANTA` ₱3,499 lands in `platform_retail_catalog` alongside the 18 blueprint SKUs (making it the 19th customer-side row). Old 3-tier SKU codes `pakanta_basic` · `pakanta_premium` · `pakanta_wedding_suite` retire (added to `RETIRED_SKU_CODES`). **If owner meant something else (e.g., keep all 3 tiers · ₱3,499 is just the mid tier reference)** — please flag in next message; reversible via single migration UPDATE before Phase A pushes.
5. ~~**Bespoke Monogram (iteration 0037) ₱2,999** — Bespoke + Animated coexist?~~ **RESOLVED 2026-05-28 · owner: "Animated Monogram only."** Bespoke Monogram RETIRES entirely. Iteration 0037 ships to retirement alongside the V1 retirees. Only `ANIMATED_MONOGRAM` ₱2,499 from blueprint Part 1 § 1 survives. `bespoke_monogram` SKU code added to `RETIRED_SKU_CODES`. The DALL-E AI generation flow + 30-refinement loop + brief-lock-at-payment + vectorizer.ai SVG output from iteration 0037 all retire — replaced by Animated Monogram's expanded layout asset canvas (premium border frames · local floral crest designs · custom typography paths · more frame designs) per blueprint Part 1 § 1 description.
6. **STD Video (`save_the_date_video_render` ₱199)** — not in blueprint. Retire OR keep? Lean: retire · blueprint doesn't replace it · couples can post their landing page directly per existing 0002 Phase 1 free hero. **Pending owner confirmation** before Phase A.
7. **Vendor sub-account quota enforcement (Pro max 5 sub-seats · Enterprise unlimited)** — not in SQL Guide schema. Add column to `vendor_wallets` OR new table `vendor_seat_allocations`? Decide during Phase C.

---

## Cross-references

- **[CLAUDE.md decision-log row 2026-05-28 · "V1 → V2 architectural pivot"](CLAUDE.md)** (third 2026-05-28 row · the canonical lock that this doc operationalizes).
- [HANDOFF_2026-05-17.md](HANDOFF_2026-05-17.md) — pattern this doc follows for self-contained cold-start reading.
- [BRANCH_CONFLICTS_2026-05-24.md](BRANCH_CONFLICTS_2026-05-24.md) — sibling pattern for per-branch handoff.
- [App_Build_Status.md](App_Build_Status.md) — refreshed 2026-05-28 · current V1 shipped state · the baseline this cutover departs from.
- [V1_Gap_Analysis_Status.md](V1_Gap_Analysis_Status.md) — current spec-vs-shipped audit · drives Phase J repaper checklist.
- [Pricing.md](Pricing.md) — V1 canonical pricing reference · regenerated from new catalog in Phase J.
- [`02_Specifications/RLS_Policy_Pattern.md`](02_Specifications/RLS_Policy_Pattern.md) — canonical RLS patterns referenced in Phase A Pass 5.
- [`OWNER_ACTIONS.md`](OWNER_ACTIONS.md) (in `iscasasola/setnayan-platform` repo · not corpus) — punch list refreshed for V2 cutover during Phase I.
- Memory file `[[project_setnayan_pilot_timeline]]` — pilot gate + cutover sequencing source-of-truth.
- Memory file `[[reference_setnayan_cron_strategy]]` — no-cron preference enforced through V2 (45-day voucher expiry lazy-eval, not cron sweep).

---

## What to do if you're picking this up cold in a future session

1. Read this doc top-to-bottom.
2. Confirm pilot status by reading [App_Build_Status.md](App_Build_Status.md) header + the 2026-05-28 pre-pilot smoke check row in CLAUDE.md.
3. Check Task list for `[POST-PILOT] Phase A` through `Phase J` status (Tasks #3-#12).
4. Pick the next pending phase + verify its dependencies are met.
5. Per [[feedback_setnayan_push_migrations_myself]] — push migration BEFORE merge.
6. Per [[feedback_setnayan_pr_auto_merge]] — auto-merge on green.
7. Per [[feedback_setnayan_document_changes_with_why]] — PR body + decision-log row + this doc updated together.
8. Cross-link new work back to this doc via `[V2 Cutover Plan](V2_Cutover_Plan_2026-05-28.md) Phase X`.
