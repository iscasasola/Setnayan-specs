# Catalog Studio Cleanup — Council Verdict
**2026-07-21 · 5 seats + adversarial skeptic pass · pre-revenue (63 events, ~5 real orders)**

---

## ▶ EXECUTION STATUS (updated 2026-07-21)

| Step | What | State |
|---|---|---|
| **0** | Three live bugs (Live Studio lockout · `readSkuPrice` ignoring `is_active` · 18 stale `sku-catalog.ts` flags) | ✅ **MERGED** — [PR #3444](https://github.com/iscasasola/setnayan-platform/pull/3444) |
| **1** | Retired-row `<details>` drawer + bundle `is_active` ordering — 117 visible rows → 49 | 🟡 **PR open, auto-merge armed** — [PR #3454](https://github.com/iscasasola/setnayan-platform/pull/3454) |
| 2 | Kill the Add-ons tab (file rm + 6 nav refs) | ⬜ not started |
| 3 | Homepage fake doors (`pricing-data.ts` 142-144, 202-204) + regression test | ⬜ not started |
| 4 | Phantom `PRICING_BOOK` / `BUNDLE_BOOK` in `initialize-maya` | ⬜ partially done — the `is_active` guard shipped in step 0; the books themselves remain |
| 5 | `DROP TABLE token_burn_bands` — the audit's ONLY hard delete | ⬜ needs a migration |
| 6 | `vendor_additional_branch` / `vendor_branch_28day` dedupe | ⬜ needs a migration + the schema.org decision in §5 |
| 7 | ~~Papic ladder activation~~ **WITHDRAWN — the council was wrong** (see below) · ROLL→MINI repoint still open | 🚫 **do NOT ship the activation** |
| 8 | Housekeeping updates (recommendations, `paparazzi_seats` normalise) | ⬜ not started |

**🚫 RETRACTION — sign-off item #1 ("the Papic One ladder has no readable price in prod") is WRONG. Owner corrected it 2026-07-21: *"we already have the prices for papic one."* Verified against prod and withdrawn.**

The council read `papic_pass_tiers.is_active=true` + `platform_retail_catalog_v2.is_active=false` on the four `PAPIC_GUEST*` rows as a broken price path. It is not — it is the **deliberate pre-launch state**:

- **The prices exist and are the locked ones.** `PAPIC_GUEST` ₱500 / `_6K` ₱1,000 / `_10K` ₱1,500 / `_TOPUP` ₱1,500, all `updated_at = 2026-07-20`, points matching the tier table exactly (3,000 / 6,000 / 10,000 / +10,000).
- **Phase-0 gate 0b is already DONE.** All four rows are `is_pax_priced=false` — the repricing off the pax curve has landed. ⚠ The comment at `apps/web/lib/add-ons-catalog.ts` §papic-guest still claims *"the live catalog row still says ₱2,999"*; that is now **stale** and will mislead the next reader into thinking 0b is outstanding.
- **`is_active=false` is correct, not a defect.** The add-on card is `status: 'coming_soon'` — *"pill 'Soon', not clickable, no price shown."* The rows are inactive because the product has not launched. Remaining launch gates per the 2026-07-20 access-scope verdict are 0c (event-scoped points pool) + 0d/0e (ROPA row + DPO sign-off on the RSVP consent text) — **not pricing**.

**Running the proposed `UPDATE … SET is_active=true` would have put an unlaunched, DPO-ungated product on sale.** The lesson for reading this verdict generally: the council treated `is_active=false` as evidence of staleness throughout, but on a `coming_soon` product it is the intended state. Check the add-on card's `status` before calling an inactive row a bug.

**⚠ Correction to §3 of this verdict, found while shipping step 0:** the claim that flipping the `sku-catalog.ts` flags *"stops `/site-editor` rendering retired ₱1,999 / ₱999 to couples"* is **wrong**. `ProCard` falls back to a hardcoded `fallbackPrice` string on a `findSku` miss, and those strings are byte-identical to the `priceCentavos` they replace (`199900`, `99900`), so the flip is **visually inert** there. Both cards still advertise retired SKUs at retired prices. Whether they are still offered at all is now owner sign-off item #8.

---

## 1. Bottom line

Your instinct is right that the pricing surface is mostly dead — 42 of 43 legacy `service_catalog` rows and 21 of 43 `platform_retail_catalog_v2` rows are inactive — but **almost none of it should be deleted, because the clutter is a missing UI filter, not surplus data**: `/admin/pricing` renders every inactive row inline with no hide control, and there is no delete button in the product at all, so every "deletion" costs a hand-written prod migration to remove rows that are already invisible to customers. The skeptic pass killed 19 of the 22 proposed hard deletes — the survivors are three code-level cleanups worth about 700 lines, not a single catalog row. **The one move that actually fixes your complaint is a ~40-line UI change: collapse retired rows behind a "Show N retired" toggle and delete the Add-ons tab.** That takes the visible row count from ~117 to ~49 today, with zero data risk.

Two live bugs surfaced that matter more than the clutter and should jump the queue — see §7 step 0.

---

## 2. Delete now (safe) — 3 moves, no DB rows touched

| Target | What it is | Why dead | How |
|---|---|---|---|
| **The Add-ons tab** — `apps/web/app/admin/pricing/_surfaces/addons-surface.tsx` (638 L) + `addons` in `admin/pricing/page.tsx` (TABS/TAB_STRIP/TAB_TITLE/activeSurface) + 6 nav refs (`admin-nav-groups.tsx:761`, `admin-bottom-nav.tsx:197`, `admin-nav-descriptions.ts:127`, `lib/route-meta.ts:110`, `lib/routes.ts:22`, `lib/nav-registry-defaults.ts:2303`) | The only surface still rendering the dead v1 `service_catalog` | Renders exactly **17 rows, all `is_active=false`**. Its purchase counter joins v1 `sku_code` against `orders.service_key` (which holds V2 codes) → **17 of 17 read "No purchases yet"**, permanently. Its eligibility dots join `sku_code` against `feature_policy.feature_key` (which holds slugs: `papic`, `panood`, `led`…) → **zero hits, 100% hollow dots + amber "No policy set"**. It structurally cannot show the one active row. | **File rm + edits. No migration.** Catalog Studio goes 5 tabs → 4. |
| **`public.token_burn_bands`** (20 rows) | Zombie region→burn-band map, superseded 2026-07-01 by `regions.burn_band` | **Zero readers anywhere**: `pg_proc` scan = 0 functions, `pg_depend` = 0 views, no FKs. Repo hits are 3 comments that all *claim it was already dropped*. Its own prod `COMMENT` says "DROP in a follow-up migration once nothing reads it." Every row was already flattened to band=1/tokens=1, so it preserves no history. It's the map whose underscore/PSGC keys once under-charged 6 regions. | **`DROP TABLE public.token_burn_bands;`** in a new migration (also removes its 2 orphan RLS policies). `20270728200000` already guards its touch with `to_regclass(...) IS NOT NULL`, so replay is safe. |
| **`PRICING_BOOK` + `BUNDLE_BOOK`** — `apps/web/app/api/v1/billing/initialize-maya/route.ts:46-68`, plus the 3 phantom `TITLE_BOOK` entries at `:75, :81, :82` | ~25 hardcoded phantom prices | Every entry disagrees with the live catalog (ANIMATED_MONOGRAM 2499→999, PANOOD_SYSTEM 3499→2500, CAMERA_BRIDGE 1999→500, CUSTOM_QR_GUEST 1499→₱0), and 3 codes were **owner-deleted from the DB** by migration `20260701000000` ("Delete the row entirely"). `BUNDLE_BOOK` quotes a *third* set of numbers for the removed bundles. Gated behind `SETNAYAN_DEMO_MODE`, which is **set nowhere** — not in `.env.example`, `vercel.json`, or CI. Route has zero callers; `manual_payment_logs` = 0 rows. | **File edit. No migration.** Repoint the demo branch at the catalog in the same PR — and **add the missing `.eq('is_active', true)` to `readSkuPrice` (:357-362)**; `readBundlePrice` has it, `readSkuPrice` doesn't. That asymmetry is a live bug on the *real* charge path. |

**Plus one file-level fix that is the actual "old pricing you keep seeing":** delete `apps/web/app/_components/home/pricing-data.ts` lines **142-144 and 202-204**. Three retired SKUs (`WEBSITE_GALLERY_UPLOAD` ₱100, `WEBSITE_MAP_LINKING` ₱100, `WEBSITE_THEMES` ₱1,000) are advertised on your **public homepage right now** off hardcoded fallbacks. `fetchV2CustomerCatalog` filters `is_active`, so the inactive row never suppresses the price — the fallback does. This exact bug was fixed for `STD_VIDEO_UPLOAD` on 2026-07-10 and never generalized. **Deleting the DB rows does not fix this; deleting these code lines does.**

---

## 3. Soft-retire, don't delete

Everything below is **already** `is_active=false`. There is no DB action left to take — the audit reason is why they stay.

| Target | Why it stays |
|---|---|
| **~37 inactive `service_catalog` rows** (panood_*, paparazzi_*, papic_cam_bridge_*, monogram_hero_upgrade, pro_widget_*, concierge_complete, boosted_ads_*, tool_*_weekly, vendor_pro_weekly…) | Three independent blockers. (a) `supabase/migrations/20260516000000` seeds every one with `ON CONFLICT DO UPDATE` — a prod DELETE **resurrects on every `db reset`/preview branch**, permanently desyncing prod. (b) `admin/addons/pricing-report/route.ts` states in-code that it "reads the legacy `service_catalog` so historical audit + retired rows stay downloadable." (c) ~10 are still live runtime constants (`monogram_hero_upgrade` + `pro_widget_schedule` render on the couple-facing site-editor; `concierge_complete` has a live activation hook; 7 sit under an **unexpired** `LAUNCH_PROMO_UNTIL = 2027-01-30` lock). |
| **The 6 `category='retired'` rows** (`pro_widget_hero`, `save_the_date_render`, `daily_co_video_meeting`, `video_meeting_addon`, `sponsored_boost_weekly`, `pro_widget_bundle`, `pro_widget_story`) | **Zero benefit** — `addons-surface.tsx:189` never renders `category='retired'`. They were already invisible. Deleting them declutters nothing and desyncs migrations. |
| **`SDE`, `PAPIC_SEATS`, `EVENT_WEBSITE`, `PRO_RSVP`, `PRO_WEBSITE`** | Each has a `paid` order in `orders.service_key` + an activation row + is a `bundle_components` child of the **still-active** `PAPIC_UNLOCK` packages. `orders.service_key` has **no FK**, so a delete wouldn't error — it would silently rot the label on a paid order. |
| **`GUIDED_PACK` / `MEDIA_PACK`** (removed 2026-06-29) | `bundle_components` FK is `ON DELETE CASCADE` — deleting cascades 7 and 16 component rows with **no error and no log**, destroying the record of what the retired bundles contained. |
| **`WEBSITE_GALLERY_UPLOAD` / `WEBSITE_MAP_LINKING` / `WEBSITE_THEMES` / `STD_VIDEO_UPLOAD`** | Seeded **deliberately inactive** as build targets (DECISION_LOG 2026-06-29 + 2026-07-04, "BUILD DEFERRED — this row = spec of record"). Their absorber `WEBSITE_UPGRADE` ₱999 **does not exist yet**. Precedent: `SEATING_3D` from the same batch insert was pulled forward to active ₱2,999. |
| **`TODAYS_FOCUS`, `CALL_TIME_ESCALATOR`, `PAKULAY`, `RSVP_WEBSITE`, `RSVP_PRO_WEBSITE`, `PAPIC_CAMERA_LTD_DAY`, `vendor_token_pack_4`, `vendor_subdomain`** | All re-seeded by migrations; all already invisible to customers. `vendor_token_pack_4`'s own retire migration (`20270728100000`) says in a titled block: *"row kept so any historical purchase snapshot + reference stays valid."* `PAPIC_CAMERA_LTD_DAY` would **error** on delete (`papic_tier_config` FK, NO ACTION). Don't strip the `.neq('TODAYS_FOCUS')` belt-and-suspenders in `v2-catalog.ts:175` — that row leaked to the public homepage **twice**. |
| **`apps/web/lib/sku-catalog.ts`** (582 L v1 TS mirror) | Two-step, not one. `findSku` has a second caller nobody spotted: `lib/upcoming-items.ts:499`, live on the couple dashboard. **Step 1** (this week): flip the 18 wrong `isActive: true` flags to false so the leak stops. **Step 2** (later PR): delete `SKU_CATALOG`/`findSku`/promo consts. **Never** delete `formatCentavosPhp`, `getPilotFreeUntil`, `isPilotFreeMode`, `RETIRED_SKU_CODES` (the lint registry), or `BIR_MARKETPLACE_WITHHOLDING_PCT`. |
| **`concierge_plan_templates`, `supplier_vendor_skus` + `supplier_vendor_sku_pricing`** | 0 rows, no live reads — but `supplies_order_line_items.sku_id` is **`ON DELETE RESTRICT`** (bare DROP errors; CASCADE decapitates the orders→payouts chain), and the Paprint wizard step is **live in shipped product copy** (`lib/wizard.ts:1109`, a hard prerequisite of `all_set_readiness`). And the `concierge` migration file `20260518500000` also defines `vendor_calendar_blocks` (36 refs, live) — **never delete that file**. |

---

## 4. Keep — the non-obvious ones

- **`service_catalog` the TABLE.** 4 live reads survive: `vendor_verification_initial` (the fee lever), `verification_annual_renewal` + `verification_reverification` (read by `APPLICATION_TYPE_SKU`), `journal_sponsored_spotlight` (the on-switch for Journal Sponsored Spotlight — no hardcoded fallback, delete = permanently disabled).
- **`/admin/addons/pricing-report` route.** Explicitly *"Preserved standalone"* in `changelog.d/claude-money-split.md` eleven days ago, and it's the only export path for the legacy catalog. **Re-home its download button onto the Pricing tab** when the Add-ons tab dies — don't orphan it.
- **All four `PAPIC_GUEST*` rows.** Not stale — they *are* yesterday's owner-locked Papic One ladder. `papic_pass_tiers` FK is `ON DELETE CASCADE`, so a delete succeeds **silently** and destroys live pricing.
- **`COUPLE_WEBSITE_PRO`.** Retired but load-bearing: `SKU_OWNERSHIP_ALIASES` makes it the umbrella parent conferring `EDITORIAL_PRO` + `STD_PREMIUM_OPENINGS`.
- **`INDOOR_BLUEPRINT`.** Zero orders — but the `/studio/indoor-blueprint` paywall is *shipped and reachable*. A locked door with no key on sale.
- **`CUSTOM_QR_GUEST` (₱0) and `PAKULAY` (₱0).** ₱0 rows are a legitimate shape here — free-but-entitled features need their FK parent row.
- **The 18 `event_software_activations_v2` rows + their ₱0 orders.** Two seats wanted these purged. They are the **sole entitlement source** for `test-maria-and-jose` — your public demo/showcase event — and the LIVE_WALL row is the `wall_ingest` G0 gate behind all 8 `wall_feed` rows. Purging blanks the demo page and blackholes tour-wall ingest.
- **The 5 Money sidebar rows + 3 legacy redirect stubs.** The sidebar renders **one** flat "Money" row (owner lock 2026-07-15); those items are the `/admin/money` and `/admin/more` hub cards. Collapsing them recreates a drift bug that was already fixed.
- **`market_price_bands` / `market_funnel_bands` / `vendor_custom_plans` (all 0 rows).** Empty because pre-revenue, not abandoned. All live-wired with 2026-07 migrations.

---

## 5. Merge / dedupe — which side is canonical

| Pair | Canonical | Verdict |
|---|---|---|
| `vendor_additional_branch` ↔ `vendor_branch_28day` (both ₱999, both active — the only genuine live dupe) | **`vendor_additional_branch`** — it's `BRANCH_SKU_CODE` in `lib/vendor-branches.ts:40`, the activation key, and the one real order (`vendor_additional_branch__7480d0ed…`) | Repoint `lib/v2-catalog.ts:275` → then soft-retire `vendor_branch_28day` **via migration**, never a raw DELETE (migration `20260530010000:118` re-seeds it). ⚠ Also decide: `pricing/page.tsx:340` emits `vendor_branch_28day` as a **public schema.org Offer** — retiring it silently drops the branch offer from structured data. |
| `PAPIC_CAMERA_MINI_DAY` ↔ `PAPIC_CAMERA_ROLL_DAY` | **`PAPIC_CAMERA_MINI_DAY` is the public rung** — the seat that called it an unreferenced orphan was grepping a checkout **245 commits behind `origin/main`**. `publicPapicLadder()` explicitly filters `roll` out as "the legacy alias of Mini." | **Do not delete either** — `papic_tier_config` FK is NO ACTION (delete = error 23503) and has no ON UPDATE CASCADE (rename = impossible). Separate PR: repoint `papic_tier_config.roll` → MINI, migrate the 1 `tier='roll'` seat, then soft-retire ROLL. Deleting ROLL alone drops the charge path to a **₱30 fallback = 3.3× under-billing**. |
| `vendor_verification_annual_renewal` (₱1,499) ↔ `verification_annual_renewal` (₱1,500), and `_redemption` (₱2,499) ↔ `verification_reverification` (₱2,500) | **Contested — keep all four.** Runtime reads the short "(alias)" rows; migrations + `sku-catalog.ts` + `subscriptions.ts` name the long rows. The long rows carry the **charm-repriced** ₱1,499/₱2,499; the aliases are frozen at the superseded ₱1,500/₱2,500. | No DB action. Deleting either half loses a price. Fix is code-only: flip `sku-catalog.ts:312/:324` to `isActive:false`. **They don't render on Catalog Studio anyway** (`purchaser_role='vendor'` is filtered out). |

---

## 6. Needs your sign-off

1. **🔴 `papic_pass_tiers` has all 4 rows `is_active=true` while their 4 catalog rows are `is_active=false`** — and every price reader filters `is_active`. **The Papic One ladder you locked on 2026-07-20 has no readable price in prod right now.** The correct action is `UPDATE … SET is_active=true` on the four `PAPIC_GUEST*` catalog rows — the exact opposite of deletion. Confirm and I'll ship it.
2. **`PAPIC_GUEST_TOPUP`** — your own pricing lock recommends *against* a dedicated top-up SKU ("make the TIERS THEMSELVES STACKABLE"). Stackable tiers, or top-up SKU? If stackable, this row is the one genuinely dead member of the family.
3. **`INDOOR_BLUEPRINT`** — launch at ₱1,499, or retire the feature and delete the studio surface with it? Right now it's a shipped paywall with nothing on sale.
4. **`vendor_custom_included_token` is ₱100/token and ACTIVE** inside a catalog whose retail ladder is a flat ₱200/token. Deliberate Custom-tier bulk rate, or a survivor of the retired ₱100 ladder?
5. **`WEBSITE_THEMES` / gallery / map ₱100–₱1,000** — are site themes free, or a SKU? Right now the homepage advertises prices for SKUs you can't buy.
6. **Deleting the Add-ons tab reverses DECISION_LOG:160 (2026-05-17)**, which created "Add-on Management" as an owner-directed admin surface. I'm recommending it anyway (it's structurally broken), but it wants a new dated DECISION_LOG row.
7. **`Papic Unli` → `Papic Max` rename.** Your lock says "'Papic Unli' is RETIRED as a name," but `PAPIC_CAMERA_UNLIMITED_DAY`'s title still says it. Title-only rename; **do not touch the service_code**.

---

## 7. Suggested PR sequence

**Step 0 — bug fixes, jump the queue (no migration).** These are customer-visible, not cleanup.
- `apps/web/lib/add-on-stats.ts` — repoint the `panood` bucket from 7 legacy codes to `['PANOOD_SYSTEM','PANOOD_SYSTEM_MOBILE']`. **An event with 2 paid PANOOD orders is being shown a buy button instead of its control room.**
- `apps/web/lib/sku-catalog.ts` — flip the 18 stale `isActive: true` flags to false. Stops `/site-editor` rendering retired ₱1,999 / ₱999 to couples.
- `apps/web/app/api/v1/billing/initialize-maya/route.ts:357` — add the missing `.eq('is_active', true)` to `readSkuPrice`.

**Step 1 — the actual fix for your complaint (pure UI, no migration).**
`apps/web/app/admin/pricing/_surfaces/pricing-surface.tsx` — wrap each section's inactive rows in `<details><summary>Show N retired</summary>`, closed by default (use `<details>`, **not** conditional rendering — unmounted fields stop POSTing and silently change what "Save all changes" covers). Also add the missing `.order('is_active', {ascending:false})` to the **bundle** query — it's the only one lacking it, which is why a removed ₱12,999 bundle sorts above the live ₱15,000 one. **~117 visible rows → ~49.**

**Step 2 — kill the Add-ons tab (file rm + 6 edits, no migration).**
Delete `_surfaces/addons-surface.tsx`; drop `addons` from `admin/pricing/page.tsx`; clean `admin-nav-groups.tsx:761`, `admin-bottom-nav.tsx:197`, `admin-nav-descriptions.ts:127`, `lib/route-meta.ts:110`, `lib/routes.ts:22`, `lib/nav-registry-defaults.ts:2303`. **Keep** `admin/addons/pricing-report/route.ts` and `admin/addons/page.tsx` — move the "Download pricing report" `<a download>` onto the Pricing tab, relabelled *"Download legacy catalog report (service_catalog)"*, and repoint the redirect stub to `/admin/pricing`. Fix the route's footer copy (it promises a migration that never happened).

**Step 3 — kill the homepage fake doors (no migration).**
`apps/web/app/_components/home/pricing-data.ts` lines 142-144 + 202-204. Add a unit test asserting every code in `pricing-data.ts` exists **and** is `is_active` in the catalog, so this bug can't return a fourth time.

**Step 4 — kill the phantom price book (no migration).**
`api/v1/billing/initialize-maya/route.ts` — delete `PRICING_BOOK` (46-64), `BUNDLE_BOOK` (65-68), and `TITLE_BOOK` entries at 75/81/82. Repoint the demo branch at `platform_retail_catalog_v2` / `platform_package_catalog`.

**Step 5 — the only DB migration in this whole verdict.**
`supabase/migrations/<ts>_drop_token_burn_bands.sql` → `DROP TABLE IF EXISTS public.token_burn_bands;` Delete the three stale "retired (dropped in a follow-up migration)" comments in `lib/v2/region-token-burn.ts:53`, `token-bands-surface.tsx:32`, `token-bands/actions.ts:17` so they stop asserting something that was finally made true.

**Step 6 — branch dedupe (needs a migration).**
Repoint `lib/v2-catalog.ts:275` → `vendor_additional_branch`; decide the schema.org question (§5); then `supabase/migrations/<ts>_retire_vendor_branch_28day.sql` → `is_active=false`. Fix the stale corpus pointer at `Pricing_Collection_2026-06-14.md:96, :322`.

**Step 7 — Papic ladder (needs a migration, gated on sign-off #1).**
Activate the 4 `PAPIC_GUEST*` rows; separately repoint `papic_tier_config.roll` → `PAPIC_CAMERA_MINI_DAY`, migrate the 1 `tier='roll'` seat to `mini`, retire `papic-cameras.ts`'s ROLL exports, then soft-retire `PAPIC_CAMERA_ROLL_DAY`. Title-rename Unli → Max in the same PR.

**Step 8 — housekeeping (no migration).**
`UPDATE vendor_service_recommendations SET is_active=false WHERE service_code='COUPLE_WEBSITE_PRO'` (3 rows currently recommending an unbuyable SKU) and `UPDATE paparazzi_seats SET sku_code='PAPIC_SEATS' WHERE sku_code IN ('papic_seat_5','PAPIC_SEATS_FREE','PAPIC_TEST')` — **normalise, never DELETE**; two of those seats are claimed by real users on "Cale & Ice."

---

**Steps 1–4 and 8 are pure UI/code. Only steps 5, 6, 7 touch the database, and step 5 is the single hard delete of the entire audit.** Zero catalog price rows are deleted anywhere in this plan — and after step 1 you won't see them either.
