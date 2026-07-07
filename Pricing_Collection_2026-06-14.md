# Setnayan — Collected Pricing (2026-06-14)

Single collection point of every price/SKU/tier/fee/commission across live site, shipped code, prod DB, corpus, and memory — for the owner's future holistic pricing pass. All prices PROVISIONAL; nothing re-priced here.

---

## 1. Source-of-truth note

**Canonical order (from the project's CLAUDE.md):**

1. **LIVE site** `setnayan.com` (pricing / for-vendors / homepage / marketplace)
2. **Shipped code** `apps/web` @ `origin/main`
3. **Production DB** (`platform_retail_catalog_v2`, `platform_package_catalog`, `vendor_billing_catalog`, `service_catalog`, `setnayan_pay_methods`, `platform_settings`)
4. **Ground-truth doc** (`AS_BUILT_GROUND_TRUTH_2026-06-07.md`)
5. **Corpus specs / `DECISION_LOG.md` / `Pricing.md` / `Feature_Catalog_Canon.md` / iteration `.md`** = reference + history, **may be stale**

**ALL PRICES ARE PROVISIONAL.** Per the owner's standing rule (auto-memory `feedback_setnayan_pricing_holistic_review_later` + `project_setnayan_pricing_tiers`), every SKU price is read-at-runtime / owner-to-set until a **single dedicated holistic-pricing pass** runs *after all features are done*. Do not settle any price piecemeal. Where the live site, code, and DB agree, that triple is treated here as "canonical current" — but even those remain provisional until the pass.

**Important DB note:** the LIVE customer catalog lives in **`platform_retail_catalog_v2`** + **`platform_package_catalog`**. The old **`service_catalog`** table is a tombstone — only `vendor_verification_initial` (₱0) is still active there. Any doc/code pointing at `service_catalog` for live customer prices is stale.

---

## 2. Customer-facing — the 4-tier paywall

| Tier | Price | What's included | Source(s) | Divergence |
|---|---|---|---|---|
| **Free — Explore** | **₱0** | Marketplace browse · personalized match-reveal preview · free planning workspace (Schedule · Budget · Guest List · Seat Plan · Mood Board). NO free RSVP, NO free website, NO free matching (all paid). | Live · DB (no row — implicit baseline) · Code (free workspace; only `PAKULAY` ₱0 row) · Pricing.md §00.A · memory `project_setnayan_pricing_tiers` | All 6 agree on ₱0. DB has **no paywall row** for Free (it's the no-purchase default). |
| **Setnayan AI** (first paywall) | **₱3,999** | Full matchmaking engine (date↔vendor availability, budget, venue, pax, religion, reviews) + guided planning workspace. "One purchase per event, full access through wedding day." | Live (₱3,999) · DB `SETNAYAN_AI` ₱3,999 active · Code (`SETNAYAN_AI` ₱3,999, **paywall behind env flag `SETNAYAN_AI_PAYWALL_ENABLED`, default OFF**) · Pricing.md §00.A/B · memory | **Live/DB/§00 = ₱3,999.** Repo CLAUDE.md SKU table stale at **₱1,499**; intermediate draft ₱3,499; retired Concierge ₱4,999. **Live behavior may still be free/₱1,499 until the flag is flipped** — owner must confirm. |
| **Setnayan Essentials** | **₱12,999** | Bundle: Setnayan AI + Animated Monogram + Custom QR + RSVP Pro + Papic Guest(s) + Event Website + Editorial Website (+ Guest Stories per §00/memory). **Onboarding-purchase-only** (removed from public /pricing per DECISION_LOG). | Live (₱12,999) · DB `GUIDED_PACK` ₱12,999 active · Code (₱12,999; orig seeded ₱11,999) · Pricing.md §00.A · memory | Tier price locked. **SRP-worth math diverges:** §00 says SRP ₱25,992 (~50% off); DECISION_LOG 2026-06-08 says SRP ₱22,492 / ₱21,494. Bundle composition list varies (7 vs 8 SKUs). |
| **Setnayan Complete** | **₱27,999** | All paid Setnayan services for the event (18 or 19 SKUs). Onboarding-purchase-only. | Live (₱27,999) · DB `MEDIA_PACK` ₱27,999 active · Code (₱27,999; orig seeded ₱16,999) · Pricing.md §00.A · memory | Tier price locked. **SRP + SKU count diverge:** §00 says all 19 paid SKUs / SRP ₱53,981 (~48% off); DECISION_LOG 2026-06-08 says 18 SKUs / SRP ₱47,982 / ₱48,483. |

**Paywall wiring divergence:** Free + Setnayan AI do **not** live in `platform_package_catalog` (which only holds Essentials + Complete). Setnayan AI is a row in `platform_retail_catalog_v2`; Free has no row at all. Open question whether all four tiers should unify into one table.

---

## 3. Customer-facing — à-la-carte SKUs

Deduped by meaning. "Canonical current" applies the source-of-truth order (live → code → DB → corpus). **All provisional.** Edit-point = where the future pass changes the price.

| SKU | Canonical current price | Build state | Divergent values (live / code / DB / corpus) | Status | Defined where (edit-point) |
|---|---|---|---|---|---|
| **Setnayan AI** (à-la-carte) | **₱3,999** | live (paywall flag OFF by default) | Live ₱3,999 · Code ₱3,999 · DB `SETNAYAN_AI` ₱3,999 · corpus: repo CLAUDE.md ₱1,499, §00.B ₱3,999, 0016 spec ₱4,999 Concierge | locked (price) / contradicted (live state) | `platform_retail_catalog_v2.SETNAYAN_AI`; migration `20260915000000`; gate `lib/setnayan-ai.ts` |
| **Animated Monogram** | **₱1,999** *(LIVE + DB + §00.B + memory)* vs **₱2,499** *(code hardcode + Feature_Catalog + AS_BUILT)* | live | **Live ₱1,999** · Code hardcodes ₱2,499 (`animated-monogram/page.tsx`, `lib/animated-monogram.ts`) · DB `ANIMATED_MONOGRAM` ₱1,999 · corpus: §00.B ₱1,999, §0.A ₱2,499, 0037 spec ₱2,999 | **contradicted** | DB `ANIMATED_MONOGRAM` (₱1,999); code `app/dashboard/[eventId]/add-ons/animated-monogram/page.tsx:61` + `lib/animated-monogram.ts:54` (₱2,499 hardcode); Pricing.md §00.B |
| **Custom QR per Guest** | **₱999** | live | Live ₱999 · Code: add-on page hardcodes **₱1,499** (`custom-qr-guest/page.tsx:47`), DB repriced **₱999** (`20260915000000`) · DB ₱999 · corpus: §00.B ₱999, §0.A ₱1,499, repo CLAUDE.md ₱1,499 | contradicted (stale hardcode) | DB `CUSTOM_QR_GUEST`; migration `20260915000000:23`; **stale hardcode** `custom-qr-guest/page.tsx:47` |
| **RSVP (base)** | **₱2,499** *(but the ₱2,499 DB row is INACTIVE)* | contradicted | Live: only "RSVP Pro" appears, no plain base · Code: `RSVP_WEBSITE` ₱2,499 comment-only, retired · DB `RSVP_WEBSITE` ₱2,499 **inactive** · corpus §00.B ₱2,499 | **contradicted** (RSVP collision — see §7) | DB `RSVP_WEBSITE` (inactive); Pricing.md §00.B/§00.E ② |
| **RSVP Pro** | **₱4,499** | in_build / live | Live "RSVP Pro" ₱4,499 (In Build, in Essentials) · Code: `RSVP_PRO_WEBSITE` ₱4,499 **comment-only, never seeded** · DB `RSVP_PRO_WEBSITE` ₱4,499 active · §00.B ₱4,499 | **contradicted** | DB `RSVP_PRO_WEBSITE`; Pricing.md §00.B |
| **Pro RSVP** *(distinct DB row)* | **₱1,999** | coming_soon / live | Live "Pro RSVP" ₱1,999 (Coming Soon) · Code `PRO_RSVP` ₱1,999 (only RSVP row actually seeded, `20260915000000:35`) · DB `PRO_RSVP` ₱1,999 active · §00.E ₱1,999 | **contradicted** | DB `PRO_RSVP`; migration `20260915000000:35`; reader key mismatch in `lib/v2-catalog.ts` |
| **Papic (5 Seats)** | **₱2,999** | live | Live ₱2,999 · Code `PAPIC_SEATS` ₱2,999 (`lib/papic-seats.ts:40`) · DB ₱2,999 · corpus: §00.B/§0.A ₱2,999, §2.1/0012 spec 3-seat ₱1,499 / 5-seat ₱2,499; **memory pax-memo ₱4,499** (1 service = 10hr OR 10K pool) | contradicted (memory pax-memo) | DB `PAPIC_SEATS`; `lib/papic-seats.ts`; migration `20260628000000:90` |
| **Papic Guest (Disposable Camera)** | **from ₱2,999** *(pax-priced floor)* | live | Live "from ₱2,999" · Code `PAPIC_GUEST` ₱2,999 floor +₱350/50 pax (`lib/papic-guest.ts`, pax engine) · DB pax-priced ₱2,999 floor · corpus: §00.B ₱2,999, **Feature_Catalog ₱1,999 (superseded)** | locked (canonical) / contradicted (Feature_Catalog) | DB `PAPIC_GUEST` (`is_pax_priced=true`, floor 100, +₱350/50); `lib/papic-guest.ts` + `computePaxPriceCentavos`; migration `20260720000000` |
| **Guest Stories** (Papic add-on) | **₱1,499** | live *(DB)* / coming_soon *(code/live)* | Live ₱1,999 (Coming Soon) · Code `PAPIC_ADDON_STORIES` ₱1,499 (BUILD_STATUS not_built) · DB ₱1,499 active · §00.B ₱1,499 · Feature_Catalog "Guest Reels" ₱1,499 | locked (price) / contradicted (build state) | DB `PAPIC_ADDON_STORIES`; migration `20260915000000:24` |
| **Event Website** | **₱1,999** | in_build / live | Live ₱1,999 (In Build) · Code ₱1,999 (`20260921000000`) · DB `EVENT_WEBSITE` ₱1,999 · §00.B ₱1,999 (was admin-edited to ₱1,500, reverted) | locked (free→paid reversal) | DB `EVENT_WEBSITE`; migrations `20260915000000:36` + `20260921000000:15` |
| **Editorial Website** | **₱7,999** | in_build / live | Live ₱7,999 (In Build) · Code `PRO_WEBSITE` title "Editorial Website" **₱2,999** (`lib/v2-catalog.ts:81`) · DB `PRO_WEBSITE` ₱7,999 · corpus: §00.B ₱7,999, §0.A/AS_BUILT ₱5,499, Feature_Catalog ₱4,999 | **contradicted** | DB `PRO_WEBSITE` (₱7,999); code seed `20260628000000:78` (₱2,999 — stale); Pricing.md §00.B |
| **Live Background** (LED wall) | **₱2,499** | in_build / live | Live ₱2,499 · Code `LIVE_BACKGROUND` BUILD_STATUS partial (**retail_price_php not directly observed in seed/reprice — flagged provisional**) · DB ₱2,499 active `is_token_able=true` · corpus: §00.B ₱2,499, Feature_Catalog Basic ₱2,499/Pro ₱4,999, 0005 spec ₱599/₱899 **(unverified — Pricing.md §2.8 itself flags the 0005 figures were never grepped)** | contradicted (corpus) / provisional (code price unobserved) | DB `LIVE_BACKGROUND`; `lib/v2-catalog.ts:98` |
| **Panood** (livestream add-on) | **₱2,499** *(/day per code+corpus; live page shows no /day)* | in_build | Live **₱2,499 (no /day suffix)** · Code `PANOOD_SYSTEM` ₱2,499/day (`20260915000000:29`, repriced from ₱3,499) · DB ₱2,499 flat · corpus: §00.B ₱2,499/day, §0.A/AS_BUILT/Feature_Catalog ₱3,499/day | **contradicted** (amount + per-day framing) | DB `PANOOD_SYSTEM`; migration `20260915000000:29`; **mock** `panood/setup/page.tsx` (V1 apparatus ₱2,500 base) |
| **Patiktok** | **₱1,499** | in_build | Live ₱1,499 (In Build) · Code `PATIKTOK_COMPILER` ₱1,499 (repriced from ₱2,499) · DB ₱1,499 · corpus: §00.B ₱1,499, §0.A ₱2,499; **memory pax-memo = per-hour, owner-to-set (~₱200–750/hr)** | locked (flat) / contradicted (memory axis) | DB `PATIKTOK_COMPILER`; migration `20260915000000:26`; legacy `lib/patiktok.ts` |
| **Camera Bridge** (DSLR sync) | **₱1,499** | coming_soon | Live ₱1,499 (Coming Soon) · Code `CAMERA_BRIDGE` ₱1,499 (not_built) · DB ₱1,499 active · corpus: §00.B ₱1,499, §0.A ₱1,999 | locked | DB `CAMERA_BRIDGE`; migration `20260915000000:25` |
| **Live Venue Photo Wall** (PhotoWall / "Salamisim") | **₱2,499** | coming_soon / live *(DB)* | Live ₱2,499 (Coming Soon) · Code `LIVE_WALL` **₱3,499** (`20260628000000:94`, not_built) · DB `LIVE_WALL` ₱2,499 active · corpus: §00.B ₱2,499, Feature_Catalog ₱3,499; memory: "catalog ₱3,499 vs corpus ₱2,499 — read at runtime" | **contradicted** | DB `LIVE_WALL` (₱2,499); code seed `20260628000000:94` (₱3,499 — stale) |
| **Pabati** (video guestbook) | **₱999** | live *(DB)* / coming_soon *(live/code)* | Live ₱999 (Coming Soon) · Code `PABATI` ₱999 (not_built) · DB ₱999 active · corpus: §00.B/§0.A ₱999, **Feature_Catalog ₱2,799** | contradicted (Feature_Catalog) | DB `PABATI`; migration `20260628000000:85` |
| **Pakanta** (custom song) | **₱2,499** | coming_soon | Live ₱2,499 (Coming Soon, single SKU) · Code `PAKANTA` ₱3,499 (`20260628000000:95`, not_built) · DB ₱2,499 active · corpus: §00.B/§0.A ₱2,499, 0036 spec 3-tier ₱1,999/₱3,999/₱9,999, Feature_Catalog ₱5,499 | **contradicted** | DB `PAKANTA` (₱2,499); code seed `20260628000000:95` (₱3,499); spec 0036 (3-tier) |
| **Thank You Video** (Papic add-on, 5-min) | **₱3,499** | coming_soon | Live ₱5,499 (Coming Soon) · Code `PAPIC_ADDON_THANK_YOU` ₱3,499 (repriced from ₱5,499, not_built) · DB ₱3,499 · corpus: §00.B ₱3,499, §0.A ₱5,499, Feature_Catalog ₱4,499 | **contradicted** | DB `PAPIC_ADDON_THANK_YOU`; migration `20260915000000:27` |
| **SDE / Same Day Edit** (3-min compilation) | **₱4,999** | coming_soon | Live ₱4,999 (Coming Soon) · Code `SDE` ₱4,999 (`20260915000000:28`); **also V1 `lib/sku-catalog.ts` ₱9,999 + Panood mock ₱24,999** · DB ₱4,999 · corpus: §00.B ₱4,999, §0.A ₱3,499, Feature_Catalog ₱8,999, §2.2 human-curated ₱24,999/event | **contradicted** (worst spread: ₱3,499 / ₱4,999 / ₱8,999 / ₱9,999 / ₱24,999) | DB `SDE` (₱4,999); legacy `lib/sku-catalog.ts:304` (₱9,999); mock `panood/setup/page.tsx:55` (₱24,999) |
| **Pakulay / Mood Board** | **₱0 (free)** | live (feature) / retired (catalog row) | Live ₱0 (Coming Soon) · Code `PAKULAY` ₱0, **catalog row retired** `is_active=false` (`20260916000001`) but feature stays free · DB ₱0 inactive · §00.C "Mood Board kept — free" | locked (free) / contradicted (row retired) | DB `PAKULAY` (inactive); migration `20260704030000:63` + `20260916000001` |
| **Seat Plan** (0008) | **₱0 (free)** | live | Owner directive ≈₱0/event, no paywalls (memory `feedback_setnayan_seatplan_stays_free`) | locked | Core couple tool — no SKU row |
| **Basic seat-finding lookup** (scan→name→table#) | **₱0 (free, recommended)** | live | Free finder shipped PR #1365 (memory `seatfinding_white_space`) | provisional | `lib/` seat-finder; migration `20261215000000` |
| **Zone walkthrough video** (find-your-seat) | **₱0** *(built ungated/free; coordinator labor off-platform)* | live | PR6 #1393 shipped UNGATED; coordinator-labor model, not a Setnayan SKU (memory) | provisional | migration `20261219000000`; **do NOT gate before holistic pass** |
| **Save-the-Date Video** (V1 legacy) | **₱199** *(catalog)* vs **₱99** *(UI)* | retired (not in V2 catalog) | Code: `lib/sku-catalog.ts` ₱199, `lib/save-the-date.ts` ₱99 · corpus §2.4 ₱199 (history ₱49→₱99→₱199). **No multi-format/3-aspect-ratio pack SKU captured though it renders 16:9+1:1+9:16 — verify `lib/save-the-date.ts` + 0024 spec** | contradicted (code-internal); retired for V2 | `lib/sku-catalog.ts:104` + `lib/save-the-date.ts:25` |
| **Bespoke Monogram +10 Refinements** | **₱199** | live *(spec)* / dropped *(memory)* | Spec §2.7 / 0037:101 ₱199; **memory: dropped, replaced by 12/event round cap (Cipher Studio)** | provisional | 0037 spec; memory `monogram_overhaul` (pricing pending) |
| **Professional Mood Board render pack** | **₱500 / 5 credits** *(newest)* | coming_soon | DECISION_LOG 2026-06-09 ₱500/5 (supersedes same-day ₱300 single); §2.9 stylist packs Single ₱199 / Studio ₱8,999/50 / Production ₱24,999/150 · memory Composite Scene ₱2,999 (Recraft, V1.x) | provisional (unbuilt, owner-gated) | DECISION_LOG line 807; Pricing.md §2.9 |
| **Composite Scene** (Recraft render) | **₱2,999** | V1.x deferred | memory `reference_setnayan_recraft_image_generation` ₱2,999 | provisional (unbuilt) | memory; Recraft backend |
| **Contract hosting** (0032) | **(no charge — upload-only)** | retired (as paid SKU) | Spec §10 ₱199 + "free with Vendor Pro Weekly"; scope shrunk to upload-only 2026-05-18 — SKU stale. **Cross-SKU "free-with-Pro-Weekly" promise now orphaned (Pro Weekly retired) — verify 0032 §10 + `lib/sku-catalog.ts:550`** | contradicted; effectively retired | `lib/sku-catalog.ts:550` (`contract_intelligence_per_contract` ₱199, inactive) |

**Invitation Widget Pro (0004) — status uncertain (likely folded/free):**
| SKU | Last price | Status | Where |
|---|---|---|---|
| Monogram Hero | ₱1,999 (no refund) | contradicted (folded into Animated Monogram?) | §2.5 / 0004:70; `lib/sku-catalog.ts:116` `monogram_hero_upgrade` (retired→null in V2) |
| Live Schedule | ₱999 (14-day refundable) | contradicted (uncertain) | §2.5 / 0004:78; `lib/sku-catalog.ts:131` `pro_widget_schedule` (retired→null) |

**Always-free surfaces (no SKU row — positive ₱0 assertion):** Day-of guest (0031) · Communications text chat / file readers (0019) · Guided Tour (0030) · Help Center / FAQ (0029) — all confirmed free, no paid SKU. Low risk; confirm against iteration folders if completeness demands.

**BIR / tax-document surface (0026):** Official Receipt generation · EWT computation · Form 2307 PDF · tax-doc download surface — **fee not captured (likely ₱0)**. Memory notes "vendor tax-docs + BIR 2307 retired in code" while spec 0026 calls it "critical for PH legal compliance" — **build-state contradiction (legally-required-per-spec vs retired-in-code), unflagged elsewhere; verify iteration 0026 + `lib/payouts.ts`.**

---

## 4. Vendor-side

| Item | Canonical current price | Build state | Divergent values | Status | Defined where (edit-point) |
|---|---|---|---|---|---|
| **Free Vendor tier** | **₱0** | live | All sources ₱0. 1 category, no in-app inquiries, 20km radius. | locked | `lib/vendor-tier-caps.ts:169` |
| **Verified Vendor tier** | **₱0 (free during launch)** | live | All sources ₱0. ≤10 in-app inquiry unlocks/week free. | locked | `lib/vendor-tier-caps.ts:170`; gate `20260911000000:14` |
| **Solo Vendor tier** (Free→Pro in-between · **PROPOSED 2026-06-24**) | **₱2,000/28d** (owner-set 2026-06-24; annual ≈**₱20,000/yr** at ~23% prepay) — **provisional / holistic-pass** | **proposed — not built** | Reach-not-features rung for the solo single-discipline vendor (one photographer/HMUA/host/coordinator — largest PH vendor segment by count). Unlocks vs Free/Verified: **always-visible identity** (lifts the hide-until-first-reply anonymity veil — the biggest reach win for a name-is-the-business solo) + **search-rank boost** + **unlimited portfolio** (vs 15-photo Free cap) + **recurring monthly vendor-token allotment**. Stays **1 category · 1 seat**; Pro growth tools (AI proposal builder, demand analytics, portfolio-theft monitor) stay **Pro+** (open fork: lite slice to Solo? rec = keep Pro+). Double duty — softens the ₱0→₱6,000 cliff **and** densifies the couple-side browsable marketplace. Lands between Kasal Gold ₱10k/yr & Platinum ₱30k/yr; ⅓ of Pro (clean ₱0→₱20k→₱60k→₱100k ladder). ~100% margin → no cost floor; priced for density acquisition. | **PROPOSED (holistic pass)** | NEW — would add `vendor_billing_catalog.solo_vendor_monthly/annual` + a rung in `lib/vendor-tier-caps.ts` (`TIER_PRICE_PHP`) + tier-cap gating |
| **Pro Vendor (28-day)** | **₱6,000/28d** | live | Live ₱6,000/28d · Code ₱6,000 (`vendor-tier-caps.ts:171`, migration `20260911000000:24`) · DB `pro_vendor_monthly` ₱6,000 · corpus: §00.E/memory ₱6,000 **canonical**; §0.C/repo-CLAUDE.md stale **₱2,499**; homepage ₱1,999; /for-vendors ₱4,999/wk (founder ₱3,999/wk); /how-it-works ₱499/wk; §4.1 ₱499/wk; Phase-A ₱3,999 | locked (DB canon) | DB `vendor_billing_catalog.pro_vendor_monthly`; `lib/vendor-tier-caps.ts:171`; migration `20260911000000` |
| **Pro Vendor (annual)** | **₱60,000/yr** | live | Live/Code/DB ₱60,000 ("save ₱18,000 / 23%") · corpus stale ₱24,999/yr (§0.C) | locked | DB `pro_vendor_annual`; `vendor-tier-caps.ts:171` |
| **Enterprise Vendor (28-day)** | **₱10,000/28d** | live | Live/Code/DB ₱10,000 · corpus stale **₱5,499** (§0.C/repo-CLAUDE.md); Phase-A ₱9,999 | locked (DB canon) | DB `enterprise_vendor_monthly`; `vendor-tier-caps.ts:172`; migration `20260911000000` |
| **Enterprise Vendor (annual)** | **₱100,000/yr** | live | Live/Code/DB ₱100,000 (DB copy **"save 17%"** vs site/Pro **"save 23%"** vs computed **25%** — see §7) · corpus stale ₱54,999/yr | locked | DB `enterprise_vendor_annual`; `vendor-tier-caps.ts:172` |
| **Vendor subscription region-banded ladder** (historical model) | **(superseded — not flat)** | retired model | memory: older model had region-tiered subs — Pro **₱2,499→₱3,999** (base→NCR), Enterprise **₱5,499→₱8,499** (base→NCR). Distinct from the flat stale numbers; flat ₱6,000/₱10,000 replaced the whole ladder. | superseded | memory `vendor_token_model` / `vendor_tier_ladder` |
| **Additional Branch** (per branch, 28d) | **₱999/28d** | live *(code/DB)* / **retired?** *(memory)* | Live/Code/DB `vendor_branch_28day` ₱999 · memory: owner said ₱1,000, charm-lock says ₱999; v2.1 memory says "Add Branch SKU retired (Enterprise covers multi-category)". **Tier-gate also contradicts: §0.C "Enterprise only" vs code/`vendor-branches.ts` "Pro+ only" vs memory `vendor_tier_ladder` "Enterprise-ONLY"** | contradicted (₱999 vs ₱1,000; live vs retired; gate Pro+ vs Enterprise-only) | DB `vendor_branch_28day`; `lib/vendor-branches.ts:25`; migration `20260910000000:118` |
| **Extended Pin** (vendor map pin add-on) | **₱49/week** | (not found — build state uncaptured) | Pricing.md §4.1 | provisional | Pricing.md §4.1 |
| **Setnayan Productions** (vendor à-la-carte production SKUs) | **₱0 free until 31 Mar 2027; paid range ₱999–₱7,999 thereafter** | launch-promo (live framing) | LIVE `/for-vendors` "Setnayan Productions" — free promo through **31 Mar 2027**, then ₱999–₱7,999. **Open: are these the same SKUs as /pricing or a separate vendor-facing Productions list? (LIVE open-Q #4)** | provisional (promo) / contradicted (scope) | LIVE `/for-vendors`; Pricing.md §0.1 |
| **Specialized Pro Tools — 13 per-service SKUs** (Coordination · Catering · HMUA · Music DJ/Emcee · Live Band · Cake · Sound/Lighting · Rings/Officiant/Transport/Booth · Photo · Video · Florist · Stationery · Attire) | **₱888/wk placeholder** *(pure-code ~₱499–₱999/wk vs AI ~₱1,999–₱2,999/wk)* | placeholder (unbuilt) | Pricing.md §4.6 — 13 "Professional [Tool]" SKUs at a ₱888/wk placeholder; final per-tool pricing owner-to-set | provisional (placeholder) | Pricing.md §4.6 |
| **Token pack — 4 tokens** | **₱400** *(live, flat ₱100/tok)* vs **₱1,000** *(code/DB seed, = ₱250/tok)* | live | **Live ₱400** (flat ₱100/token) · **Code/DB seed `vendor_token_pack_4` ₱1,000** (`20260631000000:111`) · corpus §0.C ₱1,000; §00.E/memory **flat ₱100 canon, packs ₱400–₱10,000** | **contradicted** (flat-₱100 vs tiered ladder) | DB `vendor_billing_catalog.vendor_token_pack_*`; migration `20260631000000:111-115`; app fallback `vendor-tier-caps.ts:197` |
| **Token pack — 10 tokens** | **₱1,000** *(live)* vs **₱2,400** *(code/DB, ₱240/tok)* | live | Live ₱1,000 · Code/DB ₱2,400 · §0.C ₱2,400 | contradicted | same as above |
| **Token pack — 25 tokens** | **₱2,500** *(live)* vs **₱5,500** *(code/DB, ₱220/tok)* | live | Live ₱2,500 · Code/DB ₱5,500 · §0.C ₱5,500 | contradicted | same |
| **Token pack — 50 tokens** | **₱5,000** *(live)* vs **₱10,000** *(code/DB, ₱200/tok)* | live | Live ₱5,000 · Code/DB ₱10,000 · §0.C ₱10,000 | contradicted | same |
| **Token pack — 100 tokens** | **₱10,000** *(live)* vs **₱18,000** *(code/DB, ₱180/tok)* | live | Live ₱10,000 · Code/DB ₱18,000 · §0.C ₱18,000 · §00.E/memory flat ₱100 → ₱10,000 | **contradicted** | same |
| **Per-token buy price** | **flat ₱100/token** *(app + memory canon)* | live | App `TOKEN_BUY_PRICE_PHP=100` + memory flat-₱100; **but `getVendorPrices().tokenUnit` derives ₱180–₱250 from DB pack rows** (only ₱100 is the hardcoded fallback) | **contradicted** | `lib/vendor-tier-caps.ts:197`; `lib/v2-catalog.ts:229` |
| **Token burn — answer matched inquiry** | **1/2/3 tokens (₱100/₱200/₱300)** region wage-banded | live | All sources: flat ₱100/token, 1–3 tokens by wedding-region band. Idempotent per (vendor,event). Tier-gated. Memory: shipped bands ₱100/200/300; older model section had 3/4/5/6 weighting (base / W.Visayas-C.Luzon / CALABARZON-C.Visayas / NCR) **pending owner ratify**. | locked (band→region map pending) | `token_burn_bands` seed; memory `vendor_token_model`; PR #1057/#1061/#1063 |
| **Token sink — feature boost** (per feature, 7 days) | **4–100 tokens** | live *(corpus)* | Pricing.md §0.C — feature-boost sink, 4–100 tokens, 7-day duration | locked (spec) | Pricing.md §0.C |
| **Token sink — sync outside event** | **1 token (₱100)** | live *(corpus)* / coming_soon *(memory: code NOT built)* | §0.C / DECISION_LOG 2026-06-05 / memory: 1 token | locked (spec) / unbuilt | Pricing.md §0.C; needs wiring into 0034 wallet |
| **Token sink — import customers** | **₱0 — RETIRED (import now FREE, owner 2026-06-24)** | retired | Was 1 token (₱100, all tiers incl. Free) — the only Free-tier sink. Owner-decided FREE: import = the CRM on-ramp + acquisition engine, not a revenue line. See DECISION_LOG 2026-06-24. | **RETIRED** (was locked) | `import_external_client()` burn to be removed; capability matrix |
| **Token sink — review sync** | **₱0 — DROP (owner direction 2026-06-24)** | retired (direction) | Was sync=1 token to convert a synced/imported event into 1 review. Owner direction: drop it — imports earn **1 couple-authenticated review** free; couple-claim is the integrity gate, not a fee. | **DROP** (was locked) | review model; DECISION_LOG 2026-06-24 |
| **Complimentary tokens on verification** | **100 free tokens** (until 31 Jan 2027) | live | All sources agree. Pro/Enterprise also bundle 100 each. | locked | `vendor_billing_catalog`; for-vendors copy |
| **Subscription bundled free tokens (Pro)** | **+5/28d · +50/yr** (lifetime) | live | Code `vendor-tier-caps.ts:186-194`; repriced 2026-06-09 from 30/300; made lifetime | locked | migrations `20261011000000` + `20261012000000` |
| **Subscription bundled free tokens (Enterprise)** | **+10/28d · +100/yr** (lifetime) | live | Repriced 2026-06-09 from 100/1000 | locked | `vendor-tier-caps.ts:193` |
| **Vendor verification — initial** | **₱0 (FREE)** | live | All sources ₱0. Only active row in `service_catalog`. Stale: homepage once charged **₱1,499 lifetime + ₱499 refresh** while /pricing said free (public-surface contradiction, purged #1316). | locked | DB `service_catalog.vendor_verification_initial`; `lib/vendor-verification.ts:71` |
| **Vendor verification — annual re-verification** | **₱0 per public claim** vs **₱1,500/yr charged in code/DB** | live *(code charges)* / retired *(DB row inactive)* | **Code charges ₱1,500** (`vendor-verification.ts:72`) · DB `vendor_verification_annual_renewal` ₱1,499 **inactive** (alias `verification_annual_renewal` ₱1,500 — ₱1 mismatch) · memory/§0.C: verification FREE | **contradicted** (initial free, but renewal charged in code) | `lib/vendor-verification.ts:72`; DB `service_catalog` (retired aliases) |
| **Vendor verification — post-demotion re-verification** | **₱0 per public claim** vs **₱2,500 charged in code** | live *(code)* / retired *(DB)* | Code ₱2,500 (`vendor-verification.ts:73`) · DB `vendor_verification_redemption` ₱2,499 inactive (alias ₱2,500 — ₱1 mismatch) | contradicted | `lib/vendor-verification.ts:73`; DB retired aliases |
| **"Setnayan Concierge" free vendor lead perk** | **worth ₱2,499 / booked-couple** (vendor-facing perk, NOT a charge) | live *(copy)* | LIVE `/for-vendors` advertises a free "Setnayan Concierge" worth ₱2,499/booked-couple — name collides with the customer "Setnayan AI" planner (Pricing.md §0.1 #4) | contradicted (name collision) | LIVE `/for-vendors`; Pricing.md §0.1 |
| **Platform commission on vendor bookings** | **0%** | live | All canonical sources 0% (no commission table in schema). Bookings off-platform (RA 11967). Stale: legacy CLAUDE.md 3%, 0034 spec 5%. | locked | No commission column anywhere; `lib/v2-catalog.ts:18-20` header; `app/page.tsx:141` |
| **Vendor reschedule fee** (vendor-set, illustrative) | **e.g. ₱5,000 flat inside T-21** | vendor-configured (not a Setnayan SKU) | Pricing.md §5.1 — illustrative; vendor sets own value | n/a (vendor policy) | Pricing.md §5.1 |
| **Vendor relocation / travel fee** (vendor-set, illustrative) | **e.g. ₱5,000/+10km · ₱15,000 Tagaytay · ₱8,000 transport** | vendor-configured | Pricing.md §5.2 — illustrative | n/a (vendor policy) | Pricing.md §5.2 |
| **Vendor per-head / per-table rate** (vendor-set, illustrative) | **e.g. ₱1,200/plate · ₱5,500/table** | vendor-configured | Pricing.md §5.3 — illustrative | n/a (vendor policy) | Pricing.md §5.3 |

---

## 5. Platform fees

| Fee | Canonical current value | Build state | Divergent values | Status | Defined where (edit-point) |
|---|---|---|---|---|---|
| **Setnayan Pay convenience fee** | **CONTRADICTED — no agreed value** | dormant / contradicted | **Code = 5.0% flat, ₱50 min floor** (`lib/vendor-earnings.ts:12,23`; `lib/payouts.ts:92,105`) · **DB `setnayan_pay_methods` = 5.0% flat, ₱50 min, BUT all 6 rows `is_active=FALSE`** (rail disabled) · spec CLAUDE.md = **3%** (customer-side on vendor bookings) · code comment `vendor-dashboard/earnings/page.tsx:12` = **"retired 2026-05-28 V2 cutover → 0% commission"** · corpus AS-BUILT = **RETIRED** · memory = **0% in code, only ₱50 gateway min floor** | **contradicted** (5% / 3% / retired / dormant) | `lib/vendor-earnings.ts:12`; `lib/payouts.ts:92`; DB `setnayan_pay_methods` (all inactive); spec CLAUDE.md |
| **Setnayan Pay minimum fee floor** | **₱50** | live | Code `vendor-earnings.ts:23`, `payouts.ts:105` (5000c). Crossover at ₱1,000 gross. | locked | `lib/payouts.ts:105` |
| **Setnayan Pay per-rail gateway fee** | **1.5%** (Maya QR / bank / GCash) · **2.0%** (other eWallet) · **2.5%** (credit card / OTC) | dormant (rows inactive) | DB `setnayan_pay_methods.gateway_fee_pct` — three distinct per-rail rates; all rows `is_active=FALSE` (automated rail dormant) | contradicted (dormant) | DB `setnayan_pay_methods` (per-method `gateway_fee_pct`) |
| **BIR Marketplace Withholding** | **0.5% of gross booking** | live | Code `BIR_MARKETPLACE_WITHHOLDING_PCT=0.5` / `BIR_WITHHOLDING_BPS=50`. RMC 8-2024 pass-through, Form 2307. | locked | `lib/sku-catalog.ts:691`; `lib/payouts.ts:77` |
| **Disbursement fee (Setnayan-absorbed)** | **₱20** (absorbed, never charged to vendor) | live | Code midpoint of ₱15–25 range. | locked | `lib/payouts.ts:84` |
| **Default VAT rate** | **12%** *(DB)* vs **non-VAT V1** *(spec)* | live | DB `platform_settings.default_vat_rate_pct=12` · iteration 0026 spec "V1 launches non-VAT (Percentage Tax)" | contradicted (verify whether 12% actually applied) | DB `platform_settings`; iteration 0026 |

---

## 6. Retired / superseded SKUs & bundles (do NOT revive)

| Name | Last price | Replaced by | Retired |
|---|---|---|---|
| **Token Wallet (customer, iteration 0003)** | per-pack model | PHP-direct apply-then-pay | 2026-05-11 |
| **Setnayan Concierge Complete** | ₱4,999/12mo | Setnayan AI ₱3,999 | superseded 2026-06-07 (`CONCIERGE_ENABLED=false`; internal `service_key` still `concierge_complete`) |
| **Concierge Essentials** | ₱2,499/6mo | Concierge Complete → Setnayan AI | 2026-05-16 |
| **Concierge 3-tier ladder** | ₱99/₱999/₱1,999 | single-SKU Concierge | 2026-05-14 |
| **Concierge card-less preview** | ₱0 (7-day) | 3-day card-less trial (one per account) | 2026-05-17 |
| **Today's Focus** | ₱1,499 | Setnayan AI | wizard retired 2026-06-03 (`TODAYS_FOCUS` inactive; /today redirects) |
| **Indoor Blueprint** | ₱1,499 | splits into Custom QR + coordinator labor | tombstoned 2026-06-07; DB `is_active=false` (`20260916000001`). ⚠ /find-my-table still reuses `WayfindingMap` |
| **Call-Time Escalator** | ₱1,999 | (none — depends on SMS, not in V1) | tombstoned 2026-06-07; DB inactive |
| **High Res Archive** | ₱2,999/yr | (contradicted — see §7) | tombstoned 2026-06-07; DB inactive. Storage memo still says ₱2,999/yr active; pax memo says went free baseline |
| **Pro Website** | ₱5,499 | split → Event Website ₱1,999 + Editorial Website ₱7,999 | 2026-06-07 |
| **Bundle: Guided Planner Suite** | ₱11,999 | 4-tier paywall (Essentials) | 2026-06-07 |
| **Bundle: Comprehensive Media Pack** | ₱16,999 | 4-tier paywall (Complete) | 2026-06-07 |
| **Custom Monogram Pack** | ₱1,999 (spec also lists ₱2,000) | Animated/Bespoke Monogram | uncertain; §7 flags ₱2,000-vs-₱1,999 mismatch |
| **Wedding Ceremony +3 hrs add-on** | ₱999 | (none) | 2026-05-09 |
| **Save-the-Date Render** | ₱49 → ₱99 → ₱199 | (not in V2 catalog) | ₱49 retired 2026-05-17; ₱99→₱199 2026-05-16/17 |
| **Pro Widget Bundle** | ₱199 | individual purchases | 2026-05-16 |
| **Pro Widgets** (Story/Monogram/Schedule @ ₱99) | ₱99 each | Story→free, Monogram→Hero ₱1,999, Schedule→Live Schedule ₱999 | 2026-05-16 |
| **Monogram Hero (V1)** | ₱1,999 | Animated Monogram | retired→null in V2 |
| **Papic Per Template (premade unlock)** | ₱49 | (V2 single Papic SKU) | V1.5 deferred (Pricing.md §2.1) |
| **Papic + Credits / capture-pool top-up** | ₱299 per +1,000 credits | (V2 single Papic SKU) | V1.5 deferred (Pricing.md §2.1) |
| **Premium Guest Camera Pack (event-wide)** | ₱1,499 | (V2 Papic Guest) | V1.5 deferred (Pricing.md §2.1) |
| **Personal Album (per guest)** | ₱49 | (folded into delivery) | V1.5 deferred (Pricing.md §2.1) |
| **Memory Book (per guest, printable hardcover PDF)** | ₱249 | (none) | V1.5 deferred (Pricing.md §2.1) |
| **AI Video Highlight 60s (V1)** | ₱999 (code) / ₱1,999 (Pricing.md §2.2 spec) | (none in V2) | retired→null in V2 (code-vs-spec price split — see §7) |
| **AI Edited Highlight 3-min (V1)** | ₱3,499 (was ₱4,999) | (none in V2) | code retired→null; **Pricing.md §2.2 still lists ACTIVE ₱3,499 — build-state contradiction (see §7)** |
| **Broadcast Style Pack** | ₱2,999 | folded into Panood / single SKU | 2026-05-17 (Pricing.md §2.2) |
| **Patiktok +10 overage (V1)** | ₱49 | (V2 single SKU) | V1 legacy |
| **Patiktok Cam Bridge** | ₱49/day · ₱249/yr | folded into single Patiktok | V1 legacy (Pricing.md §2.3) |
| **Live Stream tiered SKUs (Base + crew bundles)** | various (₱2,499–₱13,488) | Panood per-day | 2026-05-09 (apparatus rule) |
| **Panood Annual Streaming** | ₱19,999/yr | (not in live catalog) | superseded |
| **Panood Annual Streaming Plus** | ₱3,999/yr | (not in live catalog) | retired 2026-05-17 (Pricing.md §8) |
| **Panood Template Pack** | ₱799/day · ₱7,999/yr | folded into single Panood | 2026-05-17 (Pricing.md §2.2) |
| **Panood Cam Bridge tiers** | ₱199/slot/day · ₱249/all-slots/day · ₱2,499/yr | folded into single Panood | 2026-05-17 (Pricing.md §2.2) |
| **Panood Camera Sync** | ₱99/day | folded into single Panood | 2026-05-17 (Pricing.md §8) |
| **Panood Camera Add-on** | ₱999 | folded into single Panood | 2026-05-17 (Pricing.md §8) |
| **Same-Day Edit (human-curated, §2.2)** | ₱24,999/event | automated SDE ₱4,999 | superseded |
| **Pakanta 3-tier** | ₱1,999/₱3,999/₱9,999 | single Pakanta ₱2,499 | 2026-06-08 |
| **Bespoke Monogram (0037)** | ₱2,999 + ₱199/10-refinements | Animated Monogram / Cipher Studio (free default) | superseded 2026-06-07/11 |
| **Vendor Pro Weekly** | ₱499/wk | 28-day/annual Pro ₱6,000/₱60,000 | superseded |
| **Disposable/Founder vendor rate** | ₱3,999/wk (/for-vendors founder rate) | flat ₱6,000/28d Pro | superseded (DECISION_LOG 0022:561; Pricing.md §0.1) |
| **All Tools Unlock + 5 vendor tools @ ₱99/wk** | ₱9,999/yr + ₱99/wk | reach-tier model (tiers sell reach, not features) | superseded 2026-06-07 |
| **Boosted Ads (5/10/20km)** | ₱4,999–₱14,999/wk | reach-tier model | RETIRED 2026-05-28 |
| **Sponsored Boost (Qtr/Annual)** | ₱249,999/qtr · ₱799,999/yr (also ₱250K/₱800K in code) | reach-tier model | RETIRED 2026-05-28 |
| **Sponsored Boost Weekly** | ₱1,499/wk | Boosted Ads tiers (now also retired) | 2026-05-16 |
| **QR Retrieval (per-event, non-Pro)** | ₱500/event | (Pro tier) | superseded |
| **Contract Intelligence per contract** | ₱199 | free upload-only dual e-signature | 2026-05-18 |
| **Display Ads / AdSense (0039)** | — | (retired feature) | 🚫 RETIRED 2026-05-19 |
| **Setnayan Pay 3% convenience fee** | 3% | 0% commission + off-platform settlement (per AS-BUILT); but code still has 5% constants | RETIRED per corpus AS-BUILT (contradicted by code) |
| **CLAUDE.md PRE-RESET SKU table (whole)** | various (Setnayan AI ₱1,499, Panood ₱3,499/day, etc.) | Pricing.md §00 4-tier | SUPERSEDED 2026-06-07 (lineage only) |

---

## 7. CONTRADICTION MATRIX

| Item | Each value + source | Wins (source-of-truth order) | Open question |
|---|---|---|---|
| **RSVP product (THE flagged collision)** | RSVP_PRO_WEBSITE "RSVP Pro" **₱4,499** active (Live + DB); PRO_RSVP "Pro RSVP" **₱1,999** active (Live + DB); RSVP_WEBSITE "RSVP" **₱2,499** **inactive** (DB); §00.B canonical = RSVP ₱2,499 + Pro ₱4,499 | **Unresolvable from source order alone** — live + DB both carry two active "Pro RSVP" rows at ₱4,499 and ₱1,999 simultaneously, base ₱2,499 inactive. Code reader keys (`RSVP_WEBSITE`/`RSVP_PRO_WEBSITE`) don't match the seeded `PRO_RSVP`. | **Owner must settle name + price + build state.** Is base RSVP ₱2,499 or ₱1,999? Is the Pro tier ₱4,499? Align reader keys to the seeded service_code. *(Pricing.md §00.E ②)* |
| **Setnayan AI price/state** | ₱3,999 (Live + DB + §00, paywall flag OFF default); ₱1,499 (repo CLAUDE.md + public_claims_purge); ₱3,499 (intermediate draft + plan_builder); ₱4,999 (0016 Concierge); free funnel (marginal_cost memo) | **₱3,999** (live + DB agree) — but live *behavior* may be free/₱1,499 until `SETNAYAN_AI_PAYWALL_ENABLED` is flipped | Flip the flag and go live at ₱3,999? Confirm checkout writes the `service_key` the entitlement gate expects (code flags ⚠ VERIFY). |
| **Animated / Bespoke Monogram** | ₱1,999 (**Live** + DB + §00.B + memory); ₱2,499 (code hardcode + Feature_Catalog + AS_BUILT + §0.A); ₱2,999 (0037 spec) | **₱1,999** (live + DB agree) — code page **hardcodes ₱2,499** against the ₱1,999 catalog | Is the à-la-carte ₱1,999 or ₱2,499? Cipher Studio default path is ₱0 (free). Fix the ₱2,499 hardcode to read ₱1,999 from catalog. |
| **Custom QR per Guest** | ₱999 (Live + DB); ₱1,499 (code hardcode `custom-qr-guest/page.tsx:47` + corpus) | **₱999** | Fix the stale ₱1,499 hardcode to read from catalog. |
| **Editorial Website (was Pro Website)** | ₱7,999 (Live + DB + §00.B); ₱2,999 (code seed `PRO_WEBSITE`); ₱5,499 (§0.A + AS_BUILT); ₱4,999 (Feature_Catalog) | **₱7,999** (live + DB) | Reconcile the ₱2,999 code seed and corpus ₱4,999/₱5,499 to ₱7,999. |
| **Panood per-day** | ₱2,499 no /day (Live); ₱2,499/day (code + DB + §00.B); ₱3,499/day (§0.A + Feature_Catalog + AS_BUILT + 0011 spec) | **₱2,499** (live + code + DB) | Is it per-day or flat? Live page omits "/day" — confirm framing. Retire the V1 apparatus mock at `panood/setup/page.tsx`. |
| **SDE / Same Day Edit (worst spread)** | ₱4,999 (Live + DB + §00.B); ₱3,499 (§0.A); ₱8,999 (Feature_Catalog); ₱9,999 (V1 `lib/sku-catalog.ts`); ₱24,999 (Panood mock + §2.2 human-curated) | **₱4,999** (live + DB) | Single owner decision on the canonical SDE price; kill the V1/mock prices. |
| **Thank You Video** | ₱3,499 (DB + §00.B); ₱5,499 (Live + §0.A); ₱4,499 (Feature_Catalog) | **₱5,499** (live wins) vs **₱3,499** (DB) — live/DB disagree | Live page ₱5,499 vs DB ₱3,499 — which is canonical? |
| **Pakanta** | ₱2,499 single SKU (Live + DB + §00.B); ₱3,499 (code seed); ₱1,999/₱3,999/₱9,999 3-tier (0036 spec); ₱5,499 (Feature_Catalog) | **₱2,499 single SKU** (live + DB) | Surface single-SKU only, or restore the 3-tier ladder? Reconcile code seed ₱3,499. Confirm no orphaned Premium/Suite rows in `platform_retail_catalog_v2` (V1_TO_V2_SKU_MAP maps all three to single `PAKANTA`). |
| **Pabati** | ₱999 (Live + DB + §00.B); ₱2,799 (Feature_Catalog) | **₱999** | Feature_Catalog ₱2,799 is the outlier — confirm ₱999. |
| **Live Venue Photo Wall** | ₱2,499 (Live + DB + §00.B); ₱3,499 (code seed + Feature_Catalog) | **₱2,499** (live + DB) | Catalog vs corpus ₱3,499 — confirm ₱2,499; finalize "Salamisim" name. |
| **Papic (5 Seats)** | ₱2,999 (Live + code + DB + §00.B); ₱2,499 5-seat / ₱1,499 3-seat (0012 spec); **₱4,499** (pax/pool memo "1 service = 10hr OR 10K pool") | **₱2,999** (live + code + DB) | Does "1 service = 5 seats"? Does the ₱4,499 pool model or a ₱1,499 3-Paparazzi tier still apply? |
| **Patiktok** | ₱1,499 (Live + code + DB + §00.B); ₱2,499 (§0.A); **per-hour owner-to-set ~₱200–750/hr** (pax memo) | **₱1,499** (live + code + DB) | Flat ₱1,499 or per-hour? Do two tiers (Setnayan-handle vs Personal-TikTok) persist? |
| **Live Background** | ₱2,499 (Live + DB + §00.B); Basic ₱2,499/Pro ₱4,999 (Feature_Catalog); ₱599/₱899 (0005 spec, **unverified**); **code retail_price_php not observed** | **₱2,499** | One flat price or Basic/Pro split? 0005 spec wildly stale + unverified; confirm the actual seeded `LIVE_BACKGROUND` price. |
| **AI Video Highlight 60s (V1, retired)** | ₱999 (code) vs ₱1,999 (Pricing.md §2.2 spec) | Both V1/retired — code-vs-spec disagreement | Moot for V2 (retired→null); dedupe if ever revived. |
| **AI Edited Highlight 3-min (build-state)** | ₱3,499 ACTIVE (Pricing.md §2.2) vs retired→null (code) | Code wins (retired) | Spec still lists it active — purge the §2.2 active listing. |
| **Vendor Pro subscription** | ₱6,000/28d (Live + code + DB); ₱2,499/28d (§0.C + repo CLAUDE.md); region-banded ₱2,499→₱3,999 (old memory model); ₱1,999/28d (homepage); ₱4,999/wk founder ₱3,999/wk (/for-vendors); ₱499/wk (/how-it-works + §4.1); ₱3,999/28d (Phase-A) | **₱6,000/28d** (live + code + DB) | Ensure all public surfaces are single-source ₱6,000 (some were a frontend bug). |
| **Vendor Enterprise subscription** | ₱10,000/28d (Live + code + DB); ₱5,499/28d (§0.C + repo CLAUDE.md); region-banded ₱5,499→₱8,499 (old memory model); ₱9,999 (Phase-A) | **₱10,000/28d** | Confirm corpus corrected everywhere. |
| **Annual-savings % copy** | DB `enterprise_vendor_annual` **"save 17%"**; site (both Pro + Enterprise) **"save 23%"**; computed against 13×28-day full price = **25%** (₱18,000/₱72,000; ₱30,000/₱120,000) | **No clean winner** — three different figures in copy | Settle the canonical savings-% basis and fix the DB "17%" / site "23%" / true-25% copy mismatch. |
| **Vendor token packs (flat vs ladder)** | flat ₱100/token, packs ₱400–₱10,000 (Live + app constant + memory + §00.E); tiered ₱1,000/₱2,400/₱5,500/₱10,000/₱18,000 = ₱180–₱250/tok (code/DB seed + §0.C + AS_BUILT) | **Live = flat ₱100** wins over the DB seed — **but DB packs are still seeded tiered**, and `getVendorPrices().tokenUnit` derives ₱180–250 from them | Reprice DB packs to flat ₱100 (₱400–₱10,000) with bulk **bonus tokens** (not discount)? Bonus ladder owner-to-set. |
| **Setnayan Pay convenience fee** | 5.0% flat + ₱50 floor (code constants + DB, but DB rows inactive); 3% (spec CLAUDE.md, customer-side); retired/0% (code comment + AS-BUILT + memory) | **No clean winner** — code constants say 5%, DB rail disabled, spec says 3%, AS-BUILT says retired | Is the fee live at all? If yes, 5% or 3%? If retired, purge the constants and the "3% fee" copy. |
| **Setnayan Pay rail live-state** | DB `setnayan_pay_methods` all 6 rows `is_active=FALSE` (automated rail dormant); manual BDO/GCash reconciliation is the live money path | Manual reconciliation is live; automated rail dormant | Confirm the automated pay rail is meant to stay dormant in prod, or activate it. |
| **Vendor commission** | 0% (Live + code + DB-absence + memory); 3% (legacy CLAUDE.md); 5% (0034 spec) | **0%** | Reconcile stale 3%/5% spec figures to 0% code reality. |
| **Vendor verification fee** | Initial ₱0 (all agree); renewal ₱1,500 + post-demotion ₱2,500 (code charges); FREE (public claim/memory); homepage once ₱1,499 + ₱499 refresh (purged) | **Initial ₱0** wins; **renewal/post-demotion still charged in code** | Is re-verification meant to be free? Only initial is free in code. Dedupe the off-by-₱1 alias rows (₱1,499/₱1,500; ₱2,499/₱2,500). |
| **"Setnayan Concierge" name collision** | Customer "Setnayan AI" ₱3,999 planner vs /for-vendors free "Setnayan Concierge" worth ₱2,499/booked-couple | Distinct artifacts sharing a retired brand name | Rename the vendor perk to avoid collision with the customer planner (Pricing.md §0.1 #4). |
| **Additional Branch** | ₱999 (Live + code + DB); ₱1,000 (owner verbal); retired (v2.1 memory); gate Pro+ (code) vs Enterprise-only (§0.C + memory) | **₱999** (live + code + DB) | ₱999 vs ₱1,000; is the SKU live or retired (Enterprise covers multi-category)? Settle the Pro+ vs Enterprise-only gate. |
| **VAT at launch** | 12% (DB `platform_settings`); non-VAT (0026 spec) | **12%** (DB) — but verify receipts actually apply it | Is 12% VAT charged at launch, or is V1 non-VAT (Percentage Tax)? |
| **High Res Archive** | removed/tombstoned (§00 + DB inactive); ₱2,999/yr active (storage memo); free baseline (pax memo) | **Removed** (newest, DB inactive) | If removed, where does the compression opt-out mechanism live? |
| **Save-the-Date (code-internal)** | ₱199 (`lib/sku-catalog.ts`); ₱99 (`lib/save-the-date.ts`) | Neither in V2 catalog — both V1 legacy | Internal ₱199 vs ₱99 — moot for V2, but dedupe. |
| **Essentials/Complete SRP + SKU count** | SRP ₱25,992/₱53,981, 19 SKUs (§00); SRP ₱22,492/₱47,982 (or ₱21,494/₱48,483), 18 SKUs (DECISION_LOG 2026-06-08) | Tier prices locked (₱12,999/₱27,999); SRP math unresolved | Reconcile à-la-carte sum to exact SRP; confirm 18 vs 19 paid SKUs. |
| **Canonical doc authority** | Pricing.md §00 (owner-locked 2026-06-07, site-synced #1335); Feature_Catalog_Canon.md (2026-06-12, self-declared "supersedes Pricing.md") — disagree on ~8 SKUs | **Live DB is the tie-breaker** (both docs partially stale) | Owner: which doc is canonical going forward? |

---

## 8. OPEN PRICING QUESTIONS for the holistic pass (consolidated, deduped)

> ✅ **OWNER RULING 2026-06-14 (couple website) — resolves Q3 + Q22, restructures the Free tier.** The couple `/[slug]` site becomes a **FREE 4-in-1** (Save-the-Date · RSVP · Event · Editorial) with **unlimited free RSVP collection** (REVERSES "Free-Explore has no free RSVP/website" — the free-website pillar is restored, no longer hollow), monetized by **ONE PRO unlock `COUPLE_WEBSITE_PRO` ₱3,999 (flat, one-time/event; premium positioning — owner "we do not want to look cheap", NO discount theater; parity with Setnayan AI ₱3,999)** that upgrades premium across all 4 phases (premium template library · custom domain · badge removal · premium motion · premium editorial layouts). The free tier carries the Setnayan brand on every page (footer badge · OG card · splash ident · RSVP-confirmation CTA · email footer · QR center — **chrome only, never on the couple's photos**); PRO removes it. **This single PRO SKU supersedes the RSVP three-way collision + `EVENT_WEBSITE` ₱1,999 + `PRO_WEBSITE`/Editorial ₱7,999.** Holistic-pass to-dos: (a) reprice/retire those rows into one `COUPLE_WEBSITE_PRO` ₱3,999 in `platform_retail_catalog_v2`; (b) **owner-confirm Editorial Website ₱7,999 fully absorbs** (big retire) vs survives as a separate ultra-premium tier; (c) **recompute Essentials/Complete SRP + composition** (they bundled RSVP Pro + Event + Editorial ≈ ₱14,497 SRP, now one ₱3,999 line); (d) re-validate the homepage "free to plan / free website" copy (now TRUE again). Provisional amount, admin-set, executed in the one-shot pass — captured here + DECISION_LOG 2026-06-14, not yet wired.

**New this session (2026-06-14):**
1. **Zone-walkthrough-video monetization (PR6 #1393)** — built **ungated/free** as coordinator-labor (not a Setnayan SKU). **Do NOT gate before the holistic pass.** Decide whether to monetize the walkthrough hosting/tool at all; must stay delegatable so a no-coordinator couple does it free (DIY-parity lock).
2. **Paid seat-pass PR4 pricing (UNBUILT)** — the one remaining unbuilt seat-finding slice (Custom-QR personalized arrival / paid seat pass). SKU rename, amounts, and whether to add a narrow guest-experience mini-bundle finalize in the holistic pass, gated before app-store upload.

**Carried open items:**
3. **RSVP SKU collision** — three rows (₱4,499 active / ₱1,999 active / ₱2,499 inactive). Settle name + price + build state + align code reader keys. *(THE single flagged-open item.)*
4. **Setnayan AI live state — ✅ FLIPPED ON 2026-06-22 (owner explicit go-live via AskUserQuestion). ₱3,999 paywall now ENFORCED in prod.** Set `platform_settings.id=1.setnayan_ai_paywall_enabled = true` via `supabase db query` (the #1996 DB toggle — no redeploy; resolver DB-first + uncached → live on the next request). **OFF-SWITCH:** set that column back to `NULL` (defer to env → OFF) or `false`. ⚠ The paid-vs-free DEFAULT + dashboard-vs-onboarding PLACEMENT decision (2026-06-21 lock) is NOT resolved by the flip — enforcement is live but the positioning question is still open for the holistic pass. Pre-flip de-risk record (still accurate as mechanism reference):
   - **The gate:** `SETNAYAN_AI_PAYWALL_ENABLED` (boolean env var, **default OFF** — unset = OFF on prod today; not in `.env.example`). The ONE gate for the whole feature — no other env flag entangles it (introduced 2026-06-08, commit `b27c545e`, "govern now free, monetize next"). Logic in `apps/web/lib/setnayan-ai.ts`: `isSetnayanAiPaywallEnabled()` (L33) · `isSetnayanAiActive()` (L45) · `shouldOfferSetnayanAiPurchase()` (L67).
   - **What flipping ON does (verified vs code + live site 2026-06-22):** AI becomes active **only** for events with the purchased entitlement `events.setnayan_ai_active` (stamped by `lib/sku-activation.ts` on a confirmed `SETNAYAN_AI` order). A non-purchasing couple is NOT silently dumped to generic search — they get a **soft-paywall taste**: the vendor list still renders (generic region order; no %-match pills — `category-search.ts` ~L583; no proximity sort — falls back to review order ~L666; Home hides Today's-One-Thing / Roadmap / Upcoming / Checklist) PLUS a top-of-shortlist "See your ranked shortlist · Unlock Setnayan AI" CTA (`vendors/page.tsx` ~L528) → the dormant buy surface `/studio/setnayan-ai` (live only when `paywallOn && !active && !owns`, `page.tsx` L96). Onboarding is **unaffected** — its ₱3,999 "Your Plan" keep-card is a catalog price display (`onboarding-pricing.ts` L273), no paywall check.
   - **Why parked (resolve FIRST):** (a) the **2026-06-21 lock** moved AI activation OUT of onboarding to the dashboard but left **paid-vs-free default placement OPEN**; (b) a **copy-vs-enforcement gap** — `/pricing` (live: "₱3,999 · The first paid tier", confirmed 2026-06-22) + homepage ("One purchase at ₱3,999") already sell AI as paid, while enforcement gives it free with the flag OFF; (c) verify the checkout `service_key` is `SETNAYAN_AI` and matches the entitlement gate end-to-end.
   - **Go-live (now a no-redeploy DB toggle — supersedes the `vercel env` flip, PR #1996 2026-06-22):** flip from `/admin/integrations` ("Setnayan AI — paywall" card → `setAiPaywall`), which sets tri-state `platform_settings.setnayan_ai_paywall_enabled` (NULL = defer to env · TRUE = on · FALSE = off; migration `20270209911535`, applied to prod). `resolveSetnayanAiPaywallEnabled()` (`lib/integration-config.ts`) reads **DB-first**, with env `SETNAYAN_AI_PAYWALL_ENABLED` now only the NULL-fallback. Column ships NULL → env OFF → AI stays FREE (still parked). ⚠ PR #1996 flagged an owner sign-off: shipped DB-first/env-fallback (a clean on/off toggle) rather than the design's "OR-wins."
   - **Verified 2026-06-22 (de-risk pass, flag still OFF):** Precondition #3 (paid→unlock chain) — normal path INTACT end-to-end (`SETNAYAN_AI` literal consistent buy→order→hook→`events.setnayan_ai_active` stamp; column exists; refund-reversal + bundle children covered) **but one break-on-flip BUG:** `createSelfCompOrder` (`apps/web/app/dashboard/[eventId]/orders/actions.ts` ~L264-333) writes `status='paid'` without calling `activateOrderSku`, so a vendor/admin self-comped `SETNAYAN_AI` order is *owned-but-unprovisioned* (gate stays dark, no re-buy). Narrow blast radius (self-comp only, not couple checkout); **FIXED via PR #1999** (auto-merge armed 2026-06-22 — `createSelfCompOrder` now calls `activateOrderSku` after the paid insert, mirroring `approvePayment`). Precondition #2 (copy) — public surfaces show ₱3,999 paid, but 3 JSON-LD blocks (`app/page.tsx` ×2, `app/layout.tsx`) framed AI as free-included with no price (engines ingest as canonical) + stale ₱1,499 comments in `lib/wedding-essentials.ts` + `lib/officiant-auto-resolve.ts`; **FIXED via PR #2000** (auto-merge armed 2026-06-22 — description/featureList reframed to "optional paid upgrades · (paid add-on)"; comments made price-agnostic, NOT hardcoded to ₱3,999, per the admin-managed-prices rule + pending holistic pass). **Both pre-flip code fixes now shipped (#1999 + #2000).** Full chronological record: DECISION_LOG 2026-06-22.
5. **SDE price** — five values (₱3,499/₱4,999/₱8,999/₱9,999/₱24,999); needs one decision.
6. **Animated Monogram** — live ₱1,999 vs code-hardcode ₱2,499 vs spec ₱2,999; Cipher Studio free default; fix hardcode to read ₱1,999 from catalog.
7. **Pakanta** — single ₱2,499 SKU vs 3-tier ladder (₱1,999/₱3,999/₱9,999); surface which; confirm no orphaned Premium/Suite rows.
8. **Vendor token pack peso-vs-count** — reprice DB packs to flat ₱100/token (₱400–₱10,000) with bulk **bonus tokens** (ladder owner-to-set)? Or keep the tiered ₱180–250 seed?
9. **Setnayan Pay fee** — live at all? 5% / 3% / retired? Purge or settle.
10. **Setnayan Pay automated rail live-state** — all `setnayan_pay_methods` rows inactive; is the entire automated pay rail dormant in prod (manual BDO/GCash is the live path), or should it activate?
11. **Setnayan Pay per-rail gateway fees** — confirm/settle the 1.5% (Maya/bank/GCash) / 2.0% (other eWallet) / 2.5% (card/OTC) split now that rows are inactive.
12. **Vendor re-verification** — is renewal (₱1,500) / post-demotion (₱2,500) meant to be free? Dedupe the off-by-₱1 alias rows (₱1,499/₱1,500, ₱2,499/₱2,500).
13. **Pax per-additional-50 increments** — owner-to-set for Custom QR, Guest Stories, Pabati, Indoor Blueprint (only Papic Guest's ₱350/50 is set). Confirm flat prices = the 100-pax base. Pax ceiling behavior at 500+ (flat cap vs keep adding).
14. **Patiktok axis** — flat ₱1,499 vs per-hour (owner-to-set ~₱200–750/hr); two tiers persist?
15. **Papic service definition** — "1 service = 5 seats"? ₱2,999 vs ₱4,499 pool model; scaling beyond 10hr/10K (₱299/+1K top-up?); does ₱1,499 3-Paparazzi tier still exist?
16. **PhotoWall** — ₱2,499 vs ₱3,499; finalize "Salamisim" name; read at runtime.
17. **Vendor token burn band→region map** — shipped ₱100/200/300 (1/2/3 tokens) vs model-section 3/4/5/6 weighting (base / W.Visayas-C.Luzon / CALABARZON-C.Visayas / NCR) — ratify the map.
18. **Vendor token bulk-bonus ladder** — owner-to-set (never invent).
19. **Additional Branch** — ₱999 vs ₱1,000; live vs retired (Enterprise covers multi-category); Pro+ vs Enterprise-only gate.
20. **VAT at launch** — 12% (DB) vs non-VAT (0026 spec) — confirm receipts.
21. **High Res Archive** — removed vs ₱2,999/yr vs free baseline; if removed, where does compression opt-out live?
22. **Website effect tiers** — lifecycle wavers Basic ₱2,500/Pro ₱4,500 vs per-phase SKUs (Pro RSVP ₱1,999 / Event ₱1,999 / Editorial ₱7,999); collides with homepage "free."
23. **Indoor Blueprint reconciliation** — /find-my-table (`INDOOR_BLUEPRINT` ₱1,499) and /seat (`CUSTOM_QR_GUEST`) both reuse `WayfindingMap` — leave-legacy / alias / retire (retiring live SKU = owner sign-off).
24. **Canonical doc** — Pricing.md §00 vs Feature_Catalog_Canon.md (disagree on ~8 SKUs); DB tie-breaker.
25. **Bundle SRP/SKU-count** — reconcile à-la-carte sum to exact SRP; 18 vs 19 paid SKUs; whether to re-introduce onboarding bundle card.
26. **Vendor Boosted Ads / Sponsored Boost** — spec-era SKUs (₱4,999–₱14,999/wk · ₱249,999/qtr · ₱799,999/yr); status vs reach-tier model — likely superseded/unbuilt, confirm.
27. **Invitation Widget Pro (Monogram Hero ₱1,999 / Live Schedule ₱999)** — folded/free?
28. **`saas_overhead_cost_php` (R2/Recraft COGS)** — unpopulated in `platform_retail_catalog_v2`; needed for Cost Watch / margin-floor.
29. **Professional Mood Board** — ₱500/5-render pack (newest) vs §2.9 stylist packs (₱199/₱8,999/₱24,999) vs Composite Scene ₱2,999; wiring unbuilt, owner-gated.
30. **Outside-event sync token sink** — needs wiring into 0034 wallet (code not built).
31. **Setnayan Productions (vendor)** — free until **31 Mar 2027**, then ₱999–₱7,999; are these the same SKUs as /pricing or a separate vendor-facing Productions list? (LIVE open-Q #4).
32. **Specialized Pro Tools — 13 per-service SKUs** — ₱888/wk placeholder; final per-tool pricing (pure-code ~₱499–₱999/wk vs AI ~₱1,999–₱2,999/wk) owner-to-set.
33. **Annual-savings % copy** — settle the 17% (DB) / 23% (site) / 25% (computed) mismatch for Pro + Enterprise annual.
34. **"Setnayan Concierge" name collision** — rename the free /for-vendors perk (worth ₱2,499/booked-couple) to avoid clashing with the customer "Setnayan AI" planner.
35. **Contract "free with Vendor Pro Weekly"** — cross-SKU bundle promise now orphaned (Pro Weekly retired); settle whether contract hosting stays free / Pro-bundled / paid.
36. **AI Edited Highlight 3-min build-state** — Pricing.md §2.2 lists it ACTIVE ₱3,499 while code says retired→null; purge or restore.
37. **BIR / tax-doc surface (0026)** — OR generation / EWT / Form 2307 PDF / download surface fee (likely ₱0) uncaptured; AND build-state contradiction (memory "retired in code" vs spec "critical for PH legal compliance") — confirm.
38. **Save-the-Date multi-format pack** — renders 3 aspect ratios (16:9 + 1:1 + 9:16); confirm whether any per-format/pack SKU exists beyond the single ₱99/₱199 render.
39. **Extended Pin (vendor)** — ₱49/week pin add-on; confirm build state and whether it survives the reach-tier model.
40. **Vendor illustrative fee classes** — reschedule (e.g. ₱5,000), relocation/travel (e.g. ₱5,000/+10km · ₱15,000 Tagaytay · ₱8,000 transport), per-head/per-table (e.g. ₱1,200/plate · ₱5,500/table) are vendor-set illustrative values; confirm they stay vendor-configured, not Setnayan SKUs.

**Surfaced by the 2026-06-14 live-site re-audit — CORRECTED after owner review (mostly STALE COPY, not pricing gaps):**

> ⚠ Correction (owner, 2026-06-14): most of what this audit first flagged is the live site still **advertising already-retired SKUs**. Those do **not** need a price — they need the **stale copy purged** (unless the owner explicitly revives one). And the **BIR receipt claim is OUT** — the earlier "BIR bundled into subscription / resolves Q37" note was wrong.

**(B) Stale live copy of RETIRED items → PURGE from the site, do NOT re-price (no revive on record):**
41. **Save-the-Date** — `/explore` still lists it among Setnayan's services; retired in V2 (§6, ₱99/₱199 V1 legacy). Purge the copy unless owner revives.
44. **Boosted Ads add-on + Sponsored Boost** — `/for-vendors` still lists both as Pro/Enterprise tier features; **RETIRED 2026-05-28** (reach-tier model replaced them, §6). Strip from the tier copy.
45. **AI highlight reel** — `/for-vendors` launch-promo still names it; AI Highlight is **retired→null** in V2 (§6). Remove from the promo list.
48. **BIR receipt-generation CLAIM — stale, purge.** `/for-vendors` still advertises "Official Receipts / 2307 / EWT included in subscription," but **BIR-compliant-receipt claims were purged** (memory `public_claims_purge` / #1316). This is a stale public claim, **not** a confirmed bundled feature — *the earlier "resolves Q37, bundled ₱0" note was wrong and is retracted.* Purge the copy. (Underlying: only the 0.5% BIR marketplace withholding is wired in code, §5; the OR/2307/EWT surface in iteration 0026 stays build-state-contradicted — Q37 remains open, NOT resolved.)

**(C) Deferred old explorations (not active; nothing to price now):**
42. **Supplies marketplace (0018)** — `/how-it-works` names it; deferred vertical, no SKU. Confirm it should even stay named on the site.
43. **Photo delivery (0009)** — `/how-it-works` names it; old iteration, no SKU. Confirm bundled-free vs drop from copy.

**(A) Genuinely still-live + uncaptured — the ONLY real "confirm-free-or-price" items:**
46. **Crew-rate marketplace (vendor Pro)** — live Pro capability; almost certainly a free bundled directory — just confirm it's not a fee surface.
47. **"Editorial credits" (vendor Pro)** — live Pro unlock; "credits" implies countable — confirm uncapped-bundled vs paid top-up (ties to 0038).

**(D) Surfaced by the 2026-06-24 competitive-monetization session:**
49. **Import-customer gate → RETIRED; import now FREE** (owner 2026-06-24) — was 1 token/₱100 all-tiers; no longer charged. Import = the CRM on-ramp + acquisition engine. *(resolved)*
50. **Review-sync token → DROP; imports earn 1 couple-authenticated review** (owner direction) — vs ≤250 guest-level for fully on-platform; couple-claim is the integrity gate, not a fee. *(resolved direction)*
51. **🔑 THE BIG ONE — meter connection per-event AT ALL?** burn-to-answer ₱100/200/300 (locked 2026-06-05) **vs bundle unlimited connection into the reach subscription** (leak-proof; aligns with "tiers sell reach not features"). Per-connection tolls are structurally dodgeable (new-account/proxy/coordinator-host) → defend with economics, not identity-policing; durable money = reach + couple media. *(OPEN — holistic pass)*
52. **Solo vendor tier ₱2,000/28d** (new Free→Pro rung, §4) — confirm at holistic pass + the lite-growth-tools fork (rec: keep Pro+) + a time-boxed founding-vendor launch rate + the Free-vs-Verified ₱0 redundancy cleanup. *(OPEN)*

> _Cleanly resolved (no new price): Setnayan Productions = the **same** /pricing SKUs (Token-Worthy vs Direct split) → resolves Q31. · Additional Branch **₱999/28d** is live (Enterprise add-on) → partial-resolves Q19. · `/how-it-works` now shows **₱6,000/28d** (stale ₱499/wk gone). · Founder bonus **100 free tokens until 31 Jan 2027**; pay rail = **QR pilot, card+bank later** (automated rail dormant, Q10)._

> Per owner: the **whole-catalog holistic pricing review is deferred until after all features are done.** Do NOT settle any per-feature price piecemeal or AskUserQuestion on price before that single pass.

---

## 9. SOURCE MAP / edit points (for the future one-shot fix)

| Price class | Canonical live location (change here) | Mirrors / stale copies to also update |
|---|---|---|
| **4-tier paywall — Free / Setnayan AI / Essentials / Complete** | DB: `platform_retail_catalog_v2.SETNAYAN_AI` (AI) + `platform_package_catalog.GUIDED_PACK` (Essentials) + `MEDIA_PACK` (Complete). Free has no row. Seed migration **`20260915000000_pricing_canonical_2026_06_08.sql`** | Pricing.md §00.A/B; memory `project_setnayan_pricing_tiers.md`; live /pricing copy; repo CLAUDE.md SKU table (stale ₱1,499) |
| **Customer à-la-carte SKUs (V2)** | DB **`platform_retail_catalog_v2`** (per `service_code`). Reprice migration `20260915000000`; original seed `20260628000000_v2_additive_phase_a.sql`; retire migration `20260916000001_retire_four_customer_skus.sql` | Reader `lib/v2-catalog.ts` (BUILD_STATUS keys + `getVendorPrices`); **per-page hardcodes** `add-ons/custom-qr-guest/page.tsx:47` (₱1,499), `add-ons/animated-monogram/page.tsx:61` (₱2,499 vs catalog ₱1,999); Pricing.md §00.B; Feature_Catalog_Canon.md; live /pricing |
| **Pax-priced SKU engine** | DB `platform_retail_catalog_v2.pax_*` columns; `lib/v2-catalog.ts` `computePaxPriceCentavos` (server recompute in `submitOrderAction`, keyed to `events.estimated_pax`); migration `20260720000000` | Only Papic Guest's ₱350/50 increment is set; others owner-to-set |
| **Vendor subscriptions (Pro / Enterprise / Branch)** | DB **`vendor_billing_catalog`** (`pro_vendor_monthly/annual`, `enterprise_vendor_monthly/annual`, `vendor_branch_28day`). Reprice migration **`20260911000000_vendor_tier_reprice_verified_free.sql`** | `lib/vendor-tier-caps.ts:169-172` (`TIER_PRICE_PHP`); `lib/vendor-branches.ts:25`; `lib/v2-catalog.ts:234-241` (`getVendorPrices` fallbacks); §0.C / repo CLAUDE.md (stale ₱2,499/₱5,499 + region-banded ladder); live /pricing + /for-vendors (savings-% copy 17/23/25%) |
| **Vendor production / pin / tool SKUs** | LIVE `/for-vendors` ("Setnayan Productions" free-until-31-Mar-2027, ₱999–₱7,999); Pricing.md §4.1 (Extended Pin ₱49/wk); §4.6 (13 Specialized Pro Tools ₱888/wk placeholder) | (not found in DB/code — corpus-only; confirm whether any wired to `vendor_billing_catalog`) |
| **Vendor token packs** | DB `vendor_billing_catalog.vendor_token_pack_{4,10,25,50,100}`; seed migration `20260631000000_v2_pricing_table_alignment.sql:111-115` | App `lib/vendor-tier-caps.ts:197` (`TOKEN_BUY_PRICE_PHP=100` fallback); `lib/v2-catalog.ts:229` (`tokenUnit` derives from DB pack); §0.C ladder; memory `vendor_token_model` (flat ₱100 canon) |
| **Vendor token bundles + burn bands + sinks** | Bundle: `lib/vendor-tier-caps.ts:186-194` + migrations `20261011000000`/`20261012000000`. Burn: `token_burn_bands` seed. Sinks (feature-boost 4–100 / sync 1 / import 1): Pricing.md §0.C + DECISION_LOG | memory `vendor_token_model` (band→region map pending); sinks partly unbuilt (sync/import) |
| **Vendor verification** | DB `service_catalog` (`vendor_verification_initial` ₱0 active; renewal/redemption rows inactive, off-by-₱1 aliases); code `lib/vendor-verification.ts:71-73` (`APPLICATION_FEE_CENTAVOS`); `lib/sku-catalog.ts:358,370,382` | memory `public_claims_purge`; live /vendor-dashboard/verify; homepage (purged ₱1,499+₱499) |
| **Commission (0%)** | No commission table/column — 0% by absence | `lib/v2-catalog.ts:18-20` header; `app/page.tsx:141`; stale: legacy CLAUDE.md (3%), 0034 spec (5%) |
| **Setnayan Pay convenience fee + payout fees + per-rail gateway fees** | Code `lib/vendor-earnings.ts:12,23` + `lib/payouts.ts:77,84,92,105`; DB `setnayan_pay_methods` (all `is_active=FALSE`; per-method `gateway_fee_pct` 1.5/2.0/2.5%); `platform_settings.default_vat_rate_pct` | spec CLAUDE.md "Payment system" (3%); code comment `vendor-dashboard/earnings/page.tsx:12` ("retired") |
| **BIR / tax-doc surface (0026)** | `lib/payouts.ts:77` (0.5% withholding); iteration 0026 (OR / EWT / Form 2307) | memory (vendor tax-docs "retired in code") vs spec 0026 ("critical for PH legal compliance") — build-state contradiction |
| **V1 legacy SKU catalog** (Save-the-Date, AI Highlights, vendor ads, tools, monogram_hero) | `lib/sku-catalog.ts` + `lib/v2/sku-catalog-v2.ts` (`V1_TO_V2_SKU_MAP`, `RETIRED_SKU_CODES`, `LAUNCH_PROMO_SKU_CODES`); feature constants `lib/save-the-date.ts`, `lib/patiktok.ts`, `lib/vendor-ads.ts`, `lib/concierge.ts` | Mostly retired/null in V2 |
| **Pricing reference docs (history, not canon)** | `Pricing.md` §00 (canonical intent) / §0 (live-site 2026-06-04) / §§2–8 (spec history); `Feature_Catalog_Canon.md`; `DECISION_LOG.md`; `AS_BUILT_GROUND_TRUTH_2026-06-07.md`; iteration `0004/0005/0011/0012/0016/0022/0024/0026/0031/0032/0036/0037` `.md`; auto-memory `project_setnayan_pricing_tiers.md` + `pax_based_pricing.md` + `vendor_token_model.md` | Update in lockstep with DB after the holistic pass; **DB is the tie-breaker** |

**Bottom line for the future pass:** change customer prices in **`platform_retail_catalog_v2`** / **`platform_package_catalog`** (via a single new canonical migration), vendor prices in **`vendor_billing_catalog`**, fees in `lib/payouts.ts` + `lib/vendor-earnings.ts` (+ `setnayan_pay_methods`), then sweep the **per-page hardcodes** (`custom-qr-guest` ₱1,499, `animated-monogram` ₱2,499-vs-catalog-₱1,999, `panood/setup` mock), the **`lib/v2-catalog.ts` reader keys** (fix the `PRO_RSVP` vs `RSVP_PRO_WEBSITE` key mismatch), the **vendor public-surface copy** (single-source ₱6,000/₱10,000 + savings-% 17/23/25% + "Setnayan Concierge" perk rename), and finally re-sync `Pricing.md §00` + `Feature_Catalog_Canon.md` + auto-memory to match the DB.

---

## 10. Stackable bundle architecture (PROPOSED 2026-06-15 — owner-iterated this session)

> Status: **proposed design, prices PROVISIONAL** (holistic-pass-later). Captures the owner's bundle direction from the 2026-06-15 session. Replaces the earlier overlapping family-bundle sketch. Not yet wired to `platform_package_catalog`.

**The problem with the prior sketch:** the family bundles SHARED SKUs (Planning Bundle and Website Bundle both contained Website PRO + Monogram + Custom QR), so buying two bundles double-charged the overlap → they couldn't be bought together. **Fix = non-overlapping families:** every paid SKU lives in exactly ONE family, so any combination stacks in one checkout with no double-charge. "Buy all five" = the Complete tier.

**FREE tier (no bundle, ₱0):** planning workspace (Schedule · Budget · Guest List · Seat Plan · Mood Board/Pakulay) · basic 4-in-1 website + unlimited RSVP · **Kwento + Kwento Magazine** (guest messages + the couple-private PDF — both free) · 8 print PDFs (incl. basic QR · basic monogram · basic save-the-date).

**Five non-overlapping paid families (each SKU placed exactly once):**
1. **Planning** — Setnayan AI (single SKU; the ranked match).
2. **Website & Invite** — Website PRO (4-in-1) + Animated Monogram + **Custom QR** + Print Pack. *(Custom QR lives HERE — it's the branded invitation QR. Papic tagging + Salamisim work on the FREE default per-guest QR; Custom QR is only the branded skin, NOT a Papic dependency.)*
3. **Papic (Capture)** — **Papic 5 Seats _OR_ Papic Guests** (pick-one capture mode — they're two ways to do the same job; a couple rarely needs both, and the choice roughly halves the capture cost) + Guest Stories + **Salamisim** (= Live PhotoWall, ₱2,499) + Camera Bridge.
4. **Live & Venue** — Panood (livestream) + Patiktok + Pabati + Live Background (LED).
5. **Keepsake** — Editorial Magazine + Digital Photo Book + Same Day Edit + Thank You Video + Pakanta. *(SDE + Thank You moved OUT of Papic into here — they're post-wedding PRODUCED media, a different moment.)*

**Roll-up:** Essentials = a subset of families; **Complete ₱27,999 = all five families** (extra ~15% over buying the families separately). Every paid SKU appears once across the five families = the full à-la-carte set.

**Feature-placement answers (owner asked):** Kwento = **free** (no SKU). Kwento Magazine PDF = **free**. Salamisim = **₱2,499** (the Live PhotoWall SKU — yes it's priced; the ₱1,999 seen earlier was a hero-combo with Custom QR, not standalone). PDFs = mostly free; only Editorial Magazine + Photo Book are paid keepsakes (₱2,499 each / ₱3,999 pack) + optional ₱999 Print Pack.

**Open build items (queued, not yet built):**
- **Multi-bundle cart** — add several bundles, pay once. The non-overlap design makes the dedup trivial; the bundle-charge server re-resolution already shipped (PR #1441).
- **Pick-one Papic capture** — the Papic family offers 5 Seats *or* Guests as a choice (keeps the priciest family affordable). Needs the bundle/catalog wiring.
- **Match-surface soft-paywall banner** — surface the "Unlock Setnayan AI" CTA on the gated vendors/match page (helper `shouldOfferSetnayanAiPurchase` already shipped in the AI buy-surface PR #1433).

**Pricing-architecture policy — web-checkout, NOT in-app IAP (owner now registered on Apple Developer 2026-06-15):** every bundle/SKU purchase must route through **web checkout** (Apple Pay on web = 0% store cut). Selling these (digital) SKUs via iOS in-app purchase would trigger Apple IAP at 15–30%, gutting the ~95–99% margins. The native app deep-links to web checkout; IAP only where Apple ultimately forces it. Decide the IAP-vs-web-link split BEFORE App Store submission (Apple anti-steering is the gating risk). Apple Developer registration also unblocks native iOS Papic + Camera Bridge DSLR pairing (Phase 2).

**Amounts stay provisional** — the exact family-bundle prices (and whether Essentials survives as a named mid-tier) are set in the single holistic pricing pass, not piecemeal.

---

## 11. Vendor billing cadence + per-shop storage cap (CAPTURED 2026-06-20 — owner session)

> Status: **provisional inputs for the holistic pricing pass.** Owner asked to "keep this." Analytical backing lives in `Papic_5yr_Storage_Cost_Model.xlsx` (corpus root — Calculator / Scenarios / BreakEven tabs).

**Billing cadence — ₱6,000/28d vs ₱1,500/7d (identical money: 1,500 × 4 = 6,000/28d):**
- **Direction: bill MONTHLY (₱6,000/28d), but DISPLAY the small unit** — "from ₱1,500/week" or "₱214/day, less than one supplier meal." Captures the low-barrier psychology of the small number AND the low ongoing friction of monthly billing. Cadence and presentation are separable.
- **Why not weekly billing:** weekly = **4× the MANUAL BDO/GCash reconciliation load** + 4× the suspension-risk surface (a missed weekly verification darkens the shop) + higher churn (vendor re-decides every week) + a "rented/gig" feel. Monthly = ¼ the ops, signals a premium business tool, matches how a vendor budgets (like rent).
- **Strongest lever is value-anchoring, not cadence:** "₱6,000/month vs. ONE booking worth ₱30K–₱100K." One booking pays the whole year. Lead with ROI.
- Keep a **weekly plan only as a SECONDARY option** (seasonal visibility boost), never the default.

**Per-shop storage caps** (R2 = **₱0.855/GB-month** Standard, $0.015 × ₱57; **egress = ₱0**, so portfolio views cost nothing).

> ⚠ **Scope (owner clarification 2026-06-20):** this 50 GB / 250 GB cap is the **vendor's OWN portfolio uploads only** (their shop — work photos, sample videos, logo). It does **NOT** include any **couple/customer** photos or videos. Couple/event media (Papic galleries, Save-the-Date, etc.) is a **separate storage pool** accounted under the per-event SKU economics (`Papic_5yr_Storage_Cost_Model.xlsx` — paid per event, ~50 yrs of storage pre-funded by one sale). The two pools never mix and are funded by different products (vendor subscription vs per-event SKU).

| Tier | Storage cap | Your cost/mo | Margin on storage |
|---|---|---|---|
| Free vendor | 2 GB | ~₱2 | — |
| **Pro (₱6,000)** | **50 GB** | **~₱43** | **~99%** |
| Enterprise (₱10,000) | 250 GB | ~₱214 | ~98% |

- **Principle: storage must NEVER be the reason a vendor upgrades.** Tiers sell **reach** (categories · agents · visibility), not gigabytes. Set the Pro cap generously (50 GB) so it's a non-issue; the cap exists only to stop a multi-TB raw-video dump.
- A ₱6,000 Pro vendor's true storage expense is **~₱40–85/mo** → one of the highest-margin lines in the business (~99%).

**Amounts stay provisional** — exact figures set in the single holistic pricing pass, not piecemeal.

### §11.A — Tax-aware pricing floor (STANDING RULE — owner-affirmed 2026-06-20: "we should always have the tax-aware pricing floor")

> Apply to **EVERY** priced SKU — in the holistic pass and in the admin catalog. No price ships without clearing this floor.

**Levies that scale with GROSS revenue (taken off the top, *before* you cover cost):**
- **Income tax — reserve 30%** (conservative planning convention; the accountant optimizes the actual regime — 8%-flat vs graduated + 3% percentage — but we always *plan* at 30%).
- **BIR percentage tax ≈ 3% of gross** (non-VAT, < ₱3M/yr; becomes 12% VAT above the ₱3M threshold).
- **LGU business permit / Local Business Tax ≈ 0.5–0.75% of prior-year gross** + fixed regulatory fees (fire/sanitary/garbage) — **scales with declared sales**, renews annually.
- ⇒ Combined **gross-based** levies ≈ **~3.7% of every peso**, *then* the 30% reserve on what remains.

**The floor formula:**
`price ≥ (cost + target_margin) ÷ (1 − 0.30 − 0.037)`
A price must clear (a) cost, (b) the ~3.7% gross levies, and (c) leave enough that the 30% income-tax reserve still beats the target margin.

**The principle — MARGIN = TAX-SURVIVABILITY:**
- **High-margin digital SKUs** (Papic · monogram · AI · websites · ~95–99% margin) shrug off the stack — 30% of fat profit still keeps ~⅔ of revenue.
- **Low-margin / commodity lines** (storage, hardware, anything near-cost) **die** — the ~3.7% gross levy *alone* can exceed the margin. Worked example: **1 TB storage @ ₱899** (R2 cost ₱855) nets **~₱8/mo** after the full stack → one FX wobble = a loss.

**Locked consequences:**
1. **Build revenue on high-margin digital SKUs; never ship a thin-margin commodity line.**
2. **Storage = baked into the Pro tier, NOT sold as a product** (its cost absorbed by the ~99%-margin subscription). If an upgrade is offered at all, price it near-cost as a **retention convenience** (tax-aware floor still applies), justified by *integration value* (the portfolio is seen by booking couples) — **never as margin**. You cannot out-price subsidized hyperscalers regardless: **iCloud 2 TB = ₱599/mo = ₱0.29/GB retail — BELOW our ₱0.855/GB wholesale R2 cost** (storage is their iPhone loss-leader). Supersedes the earlier "₱499/₱799/₱1,499/₱2,499 storage-upgrade ladder" sketch — that was margin-thinking and ignored the tax stack.
