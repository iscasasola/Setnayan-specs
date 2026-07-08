# Setnayan Pricing — V1 Master Reference

> **Purpose.** Single consolidated view of every Setnayan-platform price + vendor-side fee structure. Each row cross-references the owning iteration `.md` where the canonical decision lives — this doc is a navigable index, not the source of truth.
>
> **Last sweep:** 2026-06-04 — **LIVE-SITE RECONCILIATION.** Realigned to the published catalog on setnayan.com (`/pricing`, `/`, `/features`, `/for-vendors`, `/how-it-works`). The live site is now the source of truth; where it contradicts itself, `/pricing` wins. See **§ 0** for the authoritative live catalog and **§ 0.1** for unresolved site-internal contradictions the owner must settle. Sections § 2–§ 8 below are the pre-reconciliation spec history, retained for lineage but **superseded by § 0 wherever they disagree.**
> **Update protocol** (see § 11): when a price changes, update the owning iteration `.md` → CLAUDE.md decision log → this doc → regenerate `Pricing.docx` via pandoc.
>
> **Known drift:** the CLAUDE.md § Cost-per-event cheat sheet is stale in places — see § 7. As of 2026-06-04 the larger drift is spec-vs-live-site; see § 0 and the standalone `Site_vs_Spec_Reconciliation_2026-06-04.md`.

---

## 00. PRICING — CANONICAL (owner-locked 2026-06-07 "lock it" · supersedes § 0 and §§ 2–8)

> Clean-sheet reprice + catalog prune. **4-tier model; the onboarding paywall presents the 3 paid tiers as the price choice.** Cost basis ≈ R2 storage only → ~95–99% margin. **This section supersedes § 0 below wherever they disagree.** **Site-sync SHIPPED 2026-06-13 (PR #1335)** — homepage/pricing/about/waitlist/how-it-works/signup/privacy/help/llms.txt all realigned; § 00.E status note there.

### 00.A Tiers

| Tier | Price | Includes |
|---|---|---|
| Free — Explore | ₱0 | Browse marketplace + personalized match "reveal" preview + Schedule · Budget · Guest List · Seat Plan · Mood Board. **No free RSVP, no free website, no free matching — all paid.** |
| **Setnayan AI** | **₱499 first 28-day cycle (intro) → ₱799/28-day cycle** [🔴 owner-locked 2026-07-02 — the ₱499 first cycle MATCHES the live catalog ₱499/`per_28d`, so cycle 1 is enforceable NOW; only the ₱799 recurring step-up needs the billing PR] | First paywall — full match / sort / cross-reference (date↔availability · budget · venue · pax · religion · reviews) + planning workspace + the secretary/guard/coach assistant. Soft-gate reveal. **✅ FINALIZED 2026-06-30 (owner "follow the redesign · go fully live") — per-USER SUBSCRIPTION — ₱499 first 28-day cycle (intro) then ₱799 per 28-day cycle (owner-locked 2026-07-02). Live DB `platform_retail_catalog_v2.SETNAYAN_AI` = ₱499 / `per_28d` (mig `20270322883953`). One subscription covers ALL of a user's events (read-side fan-out via `user_ai_subscription.active_until` → `isSetnayanAiActiveForUser`); never double-charges a couple on shared/co-hosted events; runs from activation UNTIL `events.event_date`, then auto-ends (lazy expiry, no charges past the event). Supersedes the prior ₱3,999 one-time per-EVENT model. ⚠ GO-LIVE GATE: the per-user gate must be wired into the 6 experience surfaces + `setnayan_ai_per_user_enabled` flipped + `SETNAYAN_AI_SUB` SKU activated + the per-event `SETNAYAN_AI` row retired — flag-flip alone does NOT deliver AI (surfaces still read the per-event entitlement). INF/TRD personalization stays dormant pending DPO sign-off.** |
| ~~Essentials ₱12,999~~ · ~~Complete ₱27,999~~ | — | **🚫 BUNDLE TIERS REMOVED 2026-06-29 (owner: "no more essentials and complete").** `GUIDED_PACK` + `MEDIA_PACK` deactivated (live as of PR #2409). The ladder is now **Free → Setnayan AI (₱499 first 28d → ₱799/28d) → à-la-carte** (no bundles). |

### 00.B À la carte (no bundles — Free → Setnayan AI → these)

Setnayan AI ₱499 first 28-day cycle (intro) → ₱799/28-day cycle (per-USER subscription · owner-locked 2026-07-02; the prior ₱499/28d working price is now the first-cycle intro, ₱799 the new recurring; supersedes the ₱3,999 one-time) · Couple Website PRO ₱4,999 (umbrella · unlocks pro touches across Save the Date · RSVP · on-the-day · Editorial; reprice + owner-lock 2026-07-04, was ₱1,999) · Editorial PRO ₱3,499 (à-la-carte editorial authoring; also included in Couple Website PRO · new 2026-07-04) · Animated Monogram ₱1,999 · Pakanta ₱2,499 · 3D Plan ₱2,499 (priced · gate-pending) · Live Studio Mobile ₱1,299/day · Desktop ₱2,499/day (single-cam livestream FREE · YouTube via couple's OBS · device-repackaged 2026-07-08, was ₱3,499/day multicam) · Live Background ₱499 · Live Photo Wall ₱2,499/day · Pabati **FREE** (owner 2026-07-08 · was ₱1,299/day) · Guest Stories **FREE** (client-rendered · owner-locked free; the stale `PAPIC_ADDON_STORIES` ₱2,000 catalog row was deactivated 2026-06-30) · Kwento **FREE** (whole event · owner 2026-07-08 · was ₱299) · Camera Bridge ₱499/day (event-wide · owner 2026-07-08, was ₱1,299) · Papic Unli ₱100/cam·day · Papic Ltd ₱30/cam·day (both cap ₱15,000/day) · Unlock-all-Papic ₱15,000/day · Custom QR FREE. **No bundles** — Essentials/Complete removed 2026-06-29; the prior fixed "19-paid / SRP ₱48,483" framing is retired with them. SRP = live sum of the à-la-carte SKUs above. (Retired & no longer listed: RSVP/RSVP Pro/Event Website/Editorial Website standalone, Papic Guests, Papic 5 Seats, paid Stories line, Same-Day Edit, Patiktok, Thank You Video, Auto-Recap.)

### 00.C Removed (tombstoned 2026-06-07)

Indoor Blueprint · Call-Time Escalator · Pro Website (→ Event + Editorial Website) · High Res Archive · Bundle Guided Planner Suite (₱11,999) · Bundle Comprehensive Media Pack (₱16,999). **Mood Board kept — free.**

### 00.D ⚠ Live-site reversals (need marketing-copy PR + brand sign-off)

1. Setnayan AI free → ₱3,999 paid first-paywall — reverses "Free to plan · Start planning free."
2. Event Website free → ₱1,999.
3. RSVP free → ₱2,499 (Pro ₱4,499).

Together these gut the "free to plan / free wedding website" pillars; the free tier is browse + match-preview + 5 planning tools only.

### 00.E Site-sync deltas (PR scope · code/DB)

/admin `platform_retail_catalog_v2`: deactivate the 3 removed Live/In-build SKUs (Indoor Blueprint, High Res Archive, Call-Time Escalator); set à la carte + the 3 tiers; populate `saas_overhead_cost_php` (R2 COGS). Homepage Setnayan AI ₱1,499 → ₱3,999 (conflicts with /pricing). Event Website ₱1,500 → ₱1,999. Reword "Free to plan / free website." Mockup: `Pricing_Page_Mockup_2026-06-07.html`.

> **✅ SHIPPED 2026-06-13 — PR [#1335](https://github.com/iscasasola/setnayan-platform/pull/1335)** (copy + JSON-LD + llms.txt; DB catalogs were already canonical, no migration) + PR [#1336](https://github.com/iscasasola/setnayan-platform/pull/1336) (signed-in vendor-dashboard worked example). **Still open:** ① `saas_overhead_cost_php` population (admin/COGS); ② **RSVP SKU collision — OWNER CALL NEEDED:** prod DB has BOTH `RSVP_PRO_WEBSITE` "RSVP Pro" ₱4,499 AND `PRO_RSVP` "Pro RSVP" ₱1,999 active while base `RSVP_WEBSITE` ₱2,499 is inactive; § 00.B says RSVP ₱2,499 + Pro ₱4,499. ③ **Vendor-side prices in § 0.C / corpus CLAUDE.md were STALE** — DB + live site canon (DECISION_LOG 2026-06-09 reprice): **Pro ₱6,000/28d (₱60,000/yr) · Enterprise ₱10,000/28d (₱100,000/yr) · flat ₱100/token, packs ₱400–₱10,000**; not ₱2,499/₱5,499/₱1,000–₱18,000.

### 00.F Website-SKU collapse — NOW LIVE (live-site sync 2026-06-23)

The **2026-06-14 addendum** (single PRO website unlock) is **live on `/pricing`**. This supersedes the § 00.B treatment of the website/RSVP SKUs:

- **🔄 2026-07-04 owner reprice + new SKU (SUPERSEDES the ₱1,999 figures below) — Couple Website PRO ₱1,999 → ₱4,999 + new à-la-carte Editorial PRO ₱3,499.** Couple Website PRO is confirmed as the **UMBRELLA** that unlocks **all** pro website-lifecycle features across the four phases — **Save the Date · RSVP · On the day · Editorial**. New standalone **`EDITORIAL_PRO` ₱3,499** buys just the editorial-authoring perk (name the moments · tell each story · arrange the front page); a Couple Website PRO order **also confers** it AND **`STD_PREMIUM_OPENINGS`** (the Cinematic Reveal — owner same-day confirmation: "unlocks all pro features … Save the date, rsvp, event(on the day), editorial"; both stay purchasable à la carte), wired via `SKU_OWNERSHIP_ALIASES` in `lib/entitlements.ts` (since `COUPLE_WEBSITE_PRO` can't nest in `BUNDLE_CHILD_SKUS`). Applied live to `platform_retail_catalog_v2` + repo PR (migration `20270511151471`). ⚠ Note: this table stores prices as **whole PHP numeric** (`4999.00`, `3499.00`), NOT centavos. The ₱1,999 figures in the 2026-06-29 note below are now historical.
- **🔄 2026-06-29 owner reprice + remodel — Couple Website is now an à-la-carte unlock menu OR one "Unlock All" bundle.** Free tier keeps the **4-in-1 site (Save-the-Date · RSVP · Event · Editorial) + unlimited RSVP**. Premium is bought per-unlock or as **Couple Website PRO = "Unlock All" ₱1,999** (was ₱3,999) _(now ₱4,999 — see 2026-07-04 note above)_:
  - **Reveal** · cinematic STD openings — **₱1,499** (`STD_PREMIUM_OPENINGS`, **live**; ₱799→₱800→₱1,499, repriced up 2026-06-29 per the pricing audit)
  - STD video upload — ₱100 (`STD_VIDEO_UPLOAD`, inactive · unbuilt)
  - Photo gallery upload — ₱100 (`WEBSITE_GALLERY_UPLOAD`, inactive · unbuilt)
  - Waze / Google Map linking — ₱100 (`WEBSITE_MAP_LINKING`, inactive · unbuilt)
  - Themes (RSVP + Event + Editorial) — ₱1,000 (`WEBSITE_THEMES`, inactive · unbuilt)
  - **Editorial PRO = `EDITORIAL_PRO` ₱3,499** (à-la-carte editorial-authoring unlock · new 2026-07-04; also conferred by Couple Website PRO)
  - **Unlock All = `COUPLE_WEBSITE_PRO` ₱4,999** (repriced 2026-07-04 from ₱1,999 · the umbrella across STD · RSVP · on-the-day · Editorial). _These are **website-only** unlocks._
- **🔌 The website is a HUB — auto-integrations (2026-06-29 owner; corrects the prior "3D inside PRO" line).** Features the couple owns **surface on the site automatically, free or paid** — they are **separate SKUs, NOT website unlocks**: **3D Plan** (renamed 2026-06-29 from "3D Seating" / "3D Seat Plan"; **FREE** = 2D seat plan + guest list + mood board; **PAID** unlocks the full 3D + the website seat-finder integration — `SEATING_3D` **₱2,499** (was ₱999 same day — repriced up after competitor research: guest-facing animated 3D is whitespace, closest per-event comps charge ~$97–250 for 2D-only), standalone SKU **OUTSIDE** Couple Website PRO — inactive until the `eventSkuActive('SEATING_3D')` gate is wired, since the 3D lab is on-for-everyone behind `NEXT_PUBLIC_SEATING_3D` today) · **Live Photo Wall** · **Live Streaming / Live Studio** · **Papic + Gallery** · **Pakanta** (backing song) · **Animated Monogram** (site chrome). Owning/buying the feature is what lights it up on the site; the website just gathers them.
- **Watermark policy change:** the "Powered by Setnayan" watermark is **never removed — it stays subtle for everyone** (free + paid). It is **no longer a paid perk** (supersedes the prior model where watermark-removal was PRO's only live perk).
- The old standalone SKUs (**RSVP ₱2,499 · RSVP Pro ₱4,499 · Event Website ₱1,999 · Editorial Website ₱7,999**) stay **retired/inactive** (DB lineage only).
- **⚠ Build gap:** of the website unlocks above, only **Reveal** is shipped. STD video / gallery / map / themes gating is **UNBUILT** — the à-la-carte rows are seeded **INACTIVE** in `platform_retail_catalog_v2` as build targets; do not activate until each gate ships. So ₱1,999 PRO has **no live functional perk yet beyond Reveal.** (Auto-integration rendering on the site is partly live — Papic gallery, Live Studio embed, monogram chrome — and partly unbuilt — 3D seat-finder, Live Photo Wall on-site.) See DECISION_LOG 2026-06-29.
- **§ 00.E note ② (RSVP SKU collision) — public surface RESOLVED:** RSVP is no longer a standalone public SKU. *Residual:* prod-DB rows (`RSVP_PRO_WEBSITE` ₱4,499 / `PRO_RSVP` ₱1,999 / inactive `RSVP_WEBSITE` ₱2,499) still want a cleanup pass so the catalog table matches the collapsed public model.
- *Residual copy-lag:* the Essentials bundle string on `/pricing` still lists "Pro RSVP + Event Website + Editorial Website" by their old names — a marketing-copy fix, not a catalog change.

> ⚠ **Owner sign-off flag:** this records a load-bearing SKU change (4 website/RSVP SKUs → 1 PRO unlock). It is **not a new decision** — it's the owner's 2026-06-14 addendum, now confirmed live on the site. Surfaced here per the corpus load-bearing-change rule.

---

## 0. LIVE SITE CATALOG — authoritative as of 2026-06-04 (⚠ SUPERSEDED by § 00 above · 2026-06-07)

> Mirrors setnayan.com/pricing exactly. Each customer SKU carries a build state the site shows: **Live**, **In build**, or **Coming soon**. `[Token]` = "Token Worthy" — redeemable with vendor tokens at a rate the vendor sets in their dashboard. This section supersedes §§ 2–8 wherever they disagree.

### 0.A Couple-side software SKUs

| SKU | Price | Build state | What the site says |
|---|---|---|---|
| Animated Monogram | ₱1,999 | **Live** | Bespoke Monogram with Animation |
| Custom QR per Guest | **FREE** 2026-06-29 (was ₱1,499/₱999) | **Live** | Now FREE (owner) — full per-guest QR personalization; `CUSTOM_QR_GUEST` → ₱0 active. Drives adoption. |
| ~~Indoor Blueprint~~ | ~~₱1,499~~ | **🚫 RETIRED** | Removed (`INDOOR_BLUEPRINT` inactive in DB; see § 31 "Removed"). |
| ~~Papic (5 Seats)~~ | ~~₱2,999~~ | **SUPERSEDED** | Replaced by the per-camera model (Papic Ltd ₱30/cam·day · Unli ₱100/cam·day); `PAPIC_SEATS` inactive. |
| ~~Papic Guest (Disposable Camera)~~ | ~~₱2,999~~ | **SUPERSEDED** | Replaced by the per-camera model (Papic Ltd = 30 photos + 10×5s per camera); `PAPIC_GUEST` inactive. |
| Setnayan AI | ₱499 first 28d → ₱799/28d | **Live** | Assisted planning (the AI planner — replaces "Setnayan Concierge" naming) |
| ~~High Res Archive~~ | ~~₱2,999 / yr~~ | **🚫 RETIRED** | Removed (`HIGH_RES_ARCHIVE` inactive in DB; see § 31 "Removed"). |
| Live Background | **₱499** | In build | **Repositioned 2026-06-29** (owner): self-serve — couple places a VIDEO or picks a BACKGROUND from the Setnayan template library for the venue screen. Was ₱2,499 "LED wall design + monogram" service (repriced down + simplified to resolve the Animated Monogram overlap). |
| Live Studio (formerly Panood) — single-cam livestream | **FREE** | Live #2219 | Couple goes live to their own YouTube, embedded free on the event page + auto-archive |
| Live Studio — Mobile controller | ₱1,299 / day | Foundation built · video pending | Online-only · ≤3 cams · 1 live output · switch/overlay/adjustable-split · YouTube via couple's OBS (repackaged 2026-07-08, was ₱3,499/day single tier) |
| Live Studio — Desktop controller | ₱2,499 / day | Foundation built · video pending | Offline-capable · ≤8 cams · ~5 live outputs · full 9-feature controller · YouTube via couple's OBS |
| ~~Patiktok~~ `[Token]` | ~~₱2,499~~ | **RETIRED 2026-06-29** | Cut (owner "delete all data about patiktok"). SKU `PATIKTOK_COMPILER` deactivated. See `RETIRED_ITEMS.md`. |
| ~~Pro Website~~ | ~~₱5,499~~ | **SUPERSEDED** | Collapsed into **Couple Website PRO ₱1,999** + à-la-carte unlocks; the DB `PRO_WEBSITE` row is the inactive "Editorial Website" ₱7,999 (lineage only). |
| ~~Call-Time Escalator~~ | ~~₱1,999~~ | **🚫 RETIRED** | Removed (`CALL_TIME_ESCALATOR` inactive in DB; see § 31 "Removed"; SMS is not in V1). |
| Camera Bridge (independent · `CAMERA_BRIDGE`) | ₱499 / day (flat, event-wide) | ACTIVE | **Independent standalone DSLR-connect SKU** (owner 2026-07-08) — decoupled from Papic and Live Studio, works with either; unlocks DSLR / external cameras event-wide. Consolidates the old "Pro Camera Sync" ₱1,499 + per-feature bridge variants. A bridged DSLR used with Live Studio counts as one of that event's cameras. |
| Guest Stories (Papic Add-on) | ₱1,999 | Coming soon | 30-second story maker for guests |
| Live Venue Photo Wall (`LIVE_WALL`) | ₱2,499 / day | **Live** | Live photo collage with live count (repriced 2026-06-29 → ₱2,499/day per audit) |
| Pabati | ₱1,299 / day | Coming soon | Up to 300 × 5-second videos (repriced 2026-06-29) |
| Pakanta `[Token]` | ₱2,499 | Coming soon | Create a special song for the couple (single SKU — was 3 tiers) |
| Pakulay | ₱0 | Coming soon | Free mood board · palette + visual identity for every account |
| ~~SDE (Papic Add-on)~~ | ~~₱3,499~~ | **RETIRED 2026-06-28** | Removed fully (PR #2362; owner "remove SDE fully"). Stories + Auto-Recap kept. See `RETIRED_ITEMS.md`. (The separate Panood human-curated "Same-Day Edit" ₱24,999 is ALSO retired 2026-06-28 — owner "remove same day edit".) |
| ~~Thank You Video (Papic Add-on)~~ | ~~₱2,499~~ | **RETIRED 2026-07-08** | Owner "remove… thank you" — the 5-min-video Thank You is cut. Its true concept was a photo sticker/effects layer (Instagram-style), never a video. See DECISION_LOG. |

### 0.B Bundles

> **🚫 ALL BUNDLES REMOVED 2026-06-29 (owner: "no more essentials and complete").** Both bundle tiers are cut — `GUIDED_PACK` ("Setnayan Essentials" ₱12,999) + `MEDIA_PACK` ("Setnayan Complete" ₱27,999) deactivated in `platform_package_catalog`. (The older "Guided Planner Suite ₱11,999 / Comprehensive Media Pack ₱16,999" names were already stale aliases of those same codes.) **The model has NO bundles:** Free → Setnayan AI (₱499 first 28d → ₱799/28d) → à-la-carte SKUs. `PAPIC_UNLOCK` ₱15,000/day is an à-la-carte Papic-day SKU, NOT a tier bundle — it stays active.

### 0.C Vendor-side (canonical = `/pricing`)

> **🔄 2026-06-29 owner reprice (supersedes the ₱6,000/₱10,000 "canon" in the § 0/§ 0.1 banners above + DECISION_LOG 2026-06-09):** Solo **₱999/28d · ₱9,999/yr** · Pro **₱2,499/28d · ₱24,999/yr** · Enterprise **₱4,999/28d · ₱49,999/yr** (all ~23% annual prepay discount). Aligns the vendor floor closer to the PH benchmark (Kasal.com) per the 2026-06-29 pricing audit. Applied to `vendor_billing_catalog`. 0% commission unchanged. **🖥 Display ordering (owner 2026-06-29): lead with the ANNUAL price, show the 28-day/monthly as the SECONDARY option** — the 28-day run-rate (×13.04 cycles/yr) sits at the top of each Kasal band, so the ~23% annual prepay is what makes the tier competitive; annual must be the hero. ⚠ **Live `/for-vendors` + `/pricing` vendor table still render monthly-first — code change pending (apps/web).**

| SKU | Price | Annual | Notes |
|---|---|---|---|
| **Solo Vendor** | **₱999 / 28 days** | **₱9,999 / yr** (~23%) | 1 category · 0 sub-seats · free vendor site · NEW canonical 2026-06-29 |
| Pro Vendor (28-day prepaid block) | **₱2,499 / 28 days** | **₱24,999 / yr** (~23%) | 3 categories · 3 sub-seats · free vendor site · 100 complimentary tokens once verified |
| Enterprise Vendor (28-day prepaid block) | **₱4,999 / 28 days** | **₱49,999 / yr** (~23%) | all categories · unlimited sub-seats · 100 tokens · repriced 2026-06-29 |
| Additional Branch (per branch) | ₱999 / 28 days | — | Enterprise only · apply-then-pay (0034) · BUILT 2026-06-05 (price ₱999 charm + Enterprise gate owner-locked 2026-06-05; supersedes the prior "Pro+ only") |
| Feature boost (per feature, 7 days) | 4–100 tokens | — | redeemed from token balance |

**Token packs** (vendors top up; redeem against any `[Token]` couple SKU at the vendor's dashboard rate):

| Pack | Price |
|---|---|
| 4 tokens | ₱1,000 |
| 10 tokens | ₱2,400 |
| 25 tokens | ₱5,500 |
| 50 tokens | ₱10,000 |
| 100 tokens | ₱18,000 |

Verified vendors receive **100 complimentary tokens** once verification is approved.

**Vendor token sinks (what a token buys):** (1) **answer a matched inquiry** — 1–3 tokens (₱100–₱300) to unlock a couple, idempotent per (vendor·event), covers ALL the vendor's services, banded by the wedding's region (see DECISION_LOG 2026-06-05 burn-reprice); (2) **redeem** against any `[Token]` couple SKU at the vendor's dashboard rate; (3) **feature boost** (4–100 tokens / 7 days); (4) **🆕 sync an outside event = 1 token (₱100)** — adds an off-platform event to the vendor's stats + free compile-all-events portfolio website + earns **1 verified review** + blocks the date on the shared anti-double-book calendar (owner-locked 2026-06-05; see [`Vendor_Value_Proposition_and_Reviews_2026-06-05.md`](03_Strategy/Vendor_Value_Proposition_and_Reviews_2026-06-05.md) Part C2).

### 0.D How money flows (per `/pricing`)

- **You → Setnayan:** software SKUs above, paid at 100% retail. PHP only · BIR receipts on every transaction.
- **You → Vendor (off-platform):** vendor packages settle directly with the vendor (bank / GCash / in person). Setnayan takes **0% commission**.
- **Vendor → Setnayan:** 28-day prepaid subscription for marketplace presence + token top-ups to redeem software for their own events.

---

## 0.1 ~~UNRESOLVED~~ SITE-INTERNAL CONTRADICTIONS — ✅ RESOLVED 2026-06-23

> **✅ RESOLVED (live-site re-crawl 2026-06-23).** All five items below are **gone from the live site** — the 2026-06-09 vendor reprice + PRs #1335/#1336 unified every page. Current live state across `/`, `/pricing`, `/for-vendors`, `/how-it-works`: **Pro ₱6,000/28d · Enterprise ₱10,000/28d · 0% commission everywhere · verification free during launch · Setnayan AI ₱3,999** (no "Concierge", no ₱1,499 planner, no 5% commission, no ₱1,499 verification badge). The list below is retained as lineage of what *used* to contradict.

The live site disagreed with itself (snapshot 2026-06-04). `/pricing` was treated as canonical, and these have since been settled and single-sourced on the website:

1. **Vendor Pro price appears four different ways.** `/pricing` ₱2,499 / 28 days · homepage ₱1,999 / 28 days · `/for-vendors` ₱4,999 / **week** (founder ₱3,999/wk) · `/how-it-works` ₱499 / **week**. These are different *models*, not typos.
2. **Commission.** Homepage + `/pricing` say **0% commission**; `/for-vendors` says Setnayan Pay is a **flat 5.0%** on every booking. Mutually exclusive.
3. **Verification badge.** Homepage charges **₱1,499 lifetime + ₱499 refresh**; `/pricing` and `/for-vendors` say listing/verification is free with **100 complimentary tokens** on approval.
4. **"Setnayan AI" vs "Setnayan Concierge."** The AI planner SKU is **Setnayan AI ₱1,499** (homepage, `/pricing`). But `/for-vendors` still advertises a free **"Setnayan Concierge"** worth **₱2,499** per booked couple. Same product two names + two prices, or two different things? Decide and unify.
5. **Enterprise** (₱5,499 / 28 days) and **Setnayan AI** (₱1,499) are consistent across pages — no action.

---

## 1. Pricing rules (locked)

- **Currency:** PHP only. Never quote USD.
- **Storage format:** centavos in `service_catalog` (e.g., ₱4,999 = 499,900 centavos).
- **Display format:** ₱ with comma separators (₱4,999 not ₱4999).
- **Charm pricing ladder** (locked 2026-05-08, refined 2026-05-12, B2B tiers charm-corrected 2026-05-17): ₱49, ₱99, ₱199, ₱499, ₱999, ₱1,499, ₱1,999, ₱2,499, ₱2,999, ₱4,999, ₱9,999, ₱19,999, ₱24,999. Higher tiers follow the same -1 pattern (₱49,999, ₱99,999, ₱249,999, ₱799,999 for B2B).
- **Apparatus pricing principle:** every SKU prices the tool / service / capability — never raw hardware, labor, or hours (except per-day / per-hour capacity units for time-bounded services like Panood).
- **Payment model (reconciled 2026-06-04):** customers pay **apply-then-pay direct in PHP** with manual admin reconciliation (BIR receipt on every software purchase). The iteration 0003 *customer* token wallet stays retired — couples never see a token balance. **However, a vendor-side token economy is now LIVE on the site:** vendors buy token packs (4–100 tokens, ₱1,000–₱18,000), receive 100 complimentary tokens on verification, and redeem them against any "Token Worthy" couple SKU (marked `[Token]` in § 0) at a rate they set in their dashboard. This reverses the blanket "no tokens UI anywhere" memory rule — tokens exist on the **vendor** side only. See § 0.C.
- **No-refund SKUs** are marked explicitly; refundable SKUs default to 14-day refund window unless otherwise stated.
- **2D billing model** (locked 2026-05-17): every `service_catalog` row carries `time_recurrence ∈ (one_time, weekly, quarterly, annual, lifetime)` × `event_scope ∈ (per_event, all_events)`. Lets per-event couple SKUs and annual-all-events vendor / organizer subscriptions live in the same table without enum collision. See [0034 Payments & Cart](0034_payments_and_cart/0034_payments_and_cart.md) service_catalog seed sections (h)–(p).
- **Cost Watch primitive** (locked 2026-05-17): every paid SKU consumption logs actual Setnayan-incurred cost + `cost_breakdown JSONB` to `service_render_costs`. Materialized view `service_catalog_cost_watch` exposes highest-render / avg / p95 / cost-to-price ratio + 🟢/🟡/🔴 health flag inline in the [0023 admin console § 3.5](0023_admin_console/0023_admin_console.md). Pricing decisions use "highest single render" as the floor.
- **Frequency-change two-admin approval** (locked 2026-05-17): post-launch changes to `time_recurrence` or `event_scope` require two-admin approval (same gate as mid-quarter price changes > ₱500). Existing active subscriptions keep their old frequency until natural expiry (cart-snapshot principle, locked 2026-05-12).

---

## 2. Core platform SKUs · couple-side

### 2.1 Papic — paparazzi capture

> **⚠ 2026-06-29 owner update (supersedes the per-cam caps below):** Papic Ltd + Unli both cap at **₱15,000/day** (was ₱6,000 / ₱10,000); Ltd = **30 photos + 10×5s**. Add-ons are now per-camera(≈guest) rates scaling to a daily cap with a min floor: **Stories ₱20/cam·day** (min ₱200 / max ₱2,000) · **Kwento ₱5/cam·day** (min ₱50 / max ₱500) · **Pabati ₱500/day** · **Photo Wall ₱1,000/day**; Pabati + Kwento + Photo Wall sit **under Papic**. Needs catalog per-guest/floor/cap fields (flat-only today). See DECISION_LOG 2026-06-29 + `0012_papic.md`.

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| **Papic Ltd** (30 photos + 10×5s clips) | **₱30 / camera·day** | per-cam | ACTIVE · per-camera (≈ per-guest) · **5-cam min → ₱150** · **cap ₱15,000/day** | [0012_papic.md](0012_papic/0012_papic.md) |
| **Papic Unli** (unlimited · full-res Drive archive) | **₱100 / camera·day** | per-cam | ACTIVE · per-camera · **cap ₱15,000/day** | [0012_papic.md](0012_papic/0012_papic.md) |
| **Unlock all of Papic** (`PAPIC_UNLOCK` · daily max / bundle) | **₱15,000 / day** | 1,500,000 | ACTIVE | [0012_papic.md](0012_papic/0012_papic.md) |
| Stories (Papic add-on) | **FREE** | 0 | ACTIVE · client-rendered (₱0-cost), owner-locked FREE · deactivate stale paid `PAPIC_ADDON_STORIES` row | [0012_papic.md](0012_papic/0012_papic.md) |
| Kwento (words-on-photo · Papic add-on) | **FREE** (whole event) | 0 | **owner-locked FREE 2026-07-08** (was ₱299 · ₱0-cost text layer; free maximizes participation + feeds Alaala) | [0012_papic.md](0012_papic/0012_papic.md) |
| ~~Thank You Video · Auto-Recap~~ | — | — | **RETIRED 2026-07-08** (owner "remove auto recap and thank you") — both server-render features cut. Thank You's true concept = photo **stickers/effects** (Instagram-style), not a video; if built, that's a client-side ₱0 layer, scope TBD. | — |
| Pabati (video guestbook · **under Papic**) | **FREE** | 0 | **owner-locked FREE 2026-07-08** (was ₱1,299/day · ₱0-cost collector, no render) | [0012_papic.md](0012_papic/0012_papic.md) |
| Live Photo Wall (`LIVE_WALL` · **under Papic**) | **₱2,499 / day** | 249,900 | ACTIVE · repriced 2026-06-29 (₱1,000→₱1,499→₱2,499/day) | [0012_papic.md](0012_papic/0012_papic.md) |
| Camera Bridge (independent · `CAMERA_BRIDGE`) | **₱499 / day** (flat · event-wide DSLR unlock) | 49,900 | ACTIVE · **repriced 2026-07-08 from ₱1,299/day** (earlier ₱100/seat·day) · **now independent of Papic + Live Studio** (owner 2026-07-08) | [0012_papic.md](0012_papic/0012_papic.md) |
| Papic Free tier (owner 2026-06-29) | **Gallery view + camera filters + first 5 cameras free** (5 photos + 1 video each) | 0 | ACTIVE | [0012_papic.md](0012_papic/0012_papic.md) |
| ~~Papic 3-seat / 5-seat / +Camera / +Credits / Cam-Bridge-tiers~~ | — | — | **SUPERSEDED** by the per-camera model above | — |
| Premium Guest Camera Pack · Personal Album · Memory Book · Per Template | (see `0012_papic.md`) | — | **V1.5+ DEFERRED** | [0012_papic.md](0012_papic/0012_papic.md) |

> **Note on V1.5+ deferred SKUs in Papic:** seat SKUs + camera add-on + Cam Bridge tiers + per-template ship in V1. The 4 deferred SKUs (Credits, Premium Guest Camera Pack, Personal Album, Memory Book) reactivate in V1.5+ — they're documented here for spec continuity, not as bookable items at launch.

### 2.2 Live Studio (formerly Panood) — live broadcast

> **🔒 2026-07-08 REPACKAGING (owner-locked, this session) — SUPERSEDES the 2026-06-26 ₱3,499/day single tier below.** Live Studio is now **device-tiered**, and the whole V1 is **₱0 marginal cost to Setnayan** (client-side compositing + YouTube-via-the-couple's-OBS — no server relay, no cloud LiveKit; the infra fork is deferred out of V1). Full model: [`Live_Studio_Repackaging_2026-07-08.md`](Live_Studio_Repackaging_2026-07-08.md) + DECISION_LOG 2026-07-08.
> - **FREE** — 1 camera → the couple's own live feed on the event page, **ephemeral (not saved)**, ₱0.
> - **Mobile Controller · ₱1,299/day** — **must be online**; ≤ **3 cameras**, 1 live-video output + unlimited photo-wall/live-bg; switch · overlay · **adjustable split cam**.
> - **Desktop Controller · ₱2,499/day** — **can run fully offline** (laptop hosts local signaling); ≤ **8 cameras**, ~5 live-video outputs + unlimited photo-wall/live-bg; full controller.
> - **YouTube (save-to-VOD + unlimited viewers)** — **included** in both paid tiers, pushed via the **couple's own OBS** (window-capture → RTMP → their channel). ₱0 relay to us; YouTube stores the VOD free. No server-side recorder.
> - **Camera Bridge (DSLR) — ₱499/day flat** — an **independent standalone SKU** (`CAMERA_BRIDGE`, decoupled from Papic and Live Studio; owner 2026-07-08), used with the controller; a bridged DSLR counts as one of the N cameras. **Supersedes the 2026-06-26 "included free."**
> - **Anti-abuse:** hard camera cap at the claim token (1/3/8 · no per-camera fee); outputs soft-cap ~6 (photo-wall/live-bg render locally = free, only live-video outputs load the control device); runaway-live duration guard retained.
>
> **⚠ 2026-06-26 packaging LOCK (owner-set price + coverage) — TWO TIERS:**
> - **FREE — single-camera livestream** (₱0, shipped #2219): the couple goes live to their OWN YouTube (phone or laptop) → embedded free on the event page → auto-archived on their channel. Available to every couple, no purchase. This is the ONLY free Panood tier. ("Every service free to use" — the locked positioning.)
> - **PAID — multicam control room** (`PANOOD_SYSTEM` — internal SKU key kept; display name now "Live Studio") · **₱3,499/day** (owner-set 2026-06-29, down from the 2026-06-26 ₱4,999 — itself up from ₱2,499). Unlocks the full controller, all locked until purchased: **(1)** multi-cam YouTube live streaming · **(2)** live streaming · **(3)** Photowall → screen · **(4)** LED Wall → screen · **(5)** extended screen control · **(6)** multicam controller · **(7)** overlays · **(8)** highlight generator (live replays) · **(9)** camera switch. Capabilities: connect multiple cameras · control multiple screens · broadcast via YouTube · also run an in-house (offline/local) live stream. **Foundation BUILT** (PR1-5: cameras #2242 · screens #2252 · control plane #2255 · control-room page #2256 · camera-join #2259); the media core + walking-skeleton (real video) pending the DB-creds refresh + the self-host media server.
> - **No standalone SKU retired** (owner 2026-06-26): Panood's highlight generator = LIVE replays during the broadcast — the post-event edit SKUs (AI Highlight / Thank You) stay separate _(SDE fully RETIRED 2026-06-28)_; and Panood ROUTES Photowall + LED-Wall content to screens — the PhotoWall / Live-Background (LED) content SKUs stay separate.
>
> The rows below are the PRE-LOCK ladder kept for lineage — single-cam is now free, "Daily Broadcast" is the paid multicam tier (now ₱3,499/day · renamed Live Studio), Annual is folded, and the Cam-Bridge/AI rows are scoped add-ons (kept, not retired). See `DECISION_LOG.md` 2026-06-26 + `Panood_Multicam_Architecture_2026-06-26.md`.

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| **Single-camera livestream** (own YouTube → event page → auto-archive) | **FREE** | 0 | ACTIVE #2219 | `Panood_Multicam_Architecture_2026-06-26.md` |
| ~~Multicam control room (single tier)~~ | ~~₱3,499 / day~~ | — | **SUPERSEDED 2026-07-08** → device-tiered (Mobile/Desktop below) | — |
| **Mobile Controller** (online-only · ≤3 cams · 1 live output · switch/overlay/adjustable-split · YouTube via couple's OBS) | **₱1,299 / day** | 129,900 | foundation built · video pending | [Live_Studio_Repackaging_2026-07-08.md](Live_Studio_Repackaging_2026-07-08.md) |
| **Desktop Controller** (offline-capable · ≤8 cams · ~5 live outputs · full controller · YouTube via couple's OBS) | **₱2,499 / day** | 249,900 | foundation built · video pending | [Live_Studio_Repackaging_2026-07-08.md](Live_Studio_Repackaging_2026-07-08.md) |
| Annual Streaming — **Desktop tier** (unlimited days, all events on account · pro/coordinator/venue-oriented; couples cheaper à-la-carte per-day) | ₱19,999 / year | 1,999,900 | ACTIVE · re-based to Desktop tier 2026-07-08 | [Live_Studio_Repackaging_2026-07-08.md](Live_Studio_Repackaging_2026-07-08.md) |
| Camera Bridge (independent DSLR SKU — used with the control room) | **₱499 / day flat** (`CAMERA_BRIDGE` · independent of Papic + Live Studio) | 49,900 | **REPRICED + made independent 2026-07-08** (was "included free" 2026-06-26; DSLR counts as one camera) | [Live_Studio_Repackaging_2026-07-08.md](Live_Studio_Repackaging_2026-07-08.md) |
| ~~Cam Bridge — all slots / per day~~ · ~~annual~~ | — | — | SUPERSEDED → unified ₱200/cam/day | — |
| Template Pack — per event-day | ₱799 | 79,900 | ACTIVE | [0011_panood.md:63](0011_panood/0011_panood.md) |
| Template Pack — annual (all events) | ₱7,999 / year | 799,900 | ACTIVE | [0011_panood.md:63](0011_panood/0011_panood.md) |
| Broadcast Style Pack (News / Cinematic / Sports / Royalty + transitions, event-wide) | ₱2,999 | 299,900 | ACTIVE | [0011_panood.md:523](0011_panood/0011_panood.md) |
| AI Video Highlight (60-second auto-edit) | ₱1,999 / render | 199,900 | ACTIVE — multi-purchase | [0011_panood.md:98](0011_panood/0011_panood.md) |
| AI Edited Highlight (3-minute auto-edit, repriced 2026-05-16 from ₱4,999) | ₱3,499 / render | 349,900 | ACTIVE — multi-purchase | [0011_panood.md:98](0011_panood/0011_panood.md) |
| ~~Same-Day Edit (post-event human-curated highlight)~~ | ~~₱24,999 / event~~ | — | **RETIRED 2026-06-28** (owner "remove same day edit") — see `RETIRED_ITEMS.md` | ~~[0011_panood.md:575]~~ |

### 2.3 ~~Patiktok — guest reel builder (iteration 0017)~~ — 🚫 RETIRED 2026-06-29

> **Patiktok is CUT** (owner "remove patiktok. delete all data about patiktok"). All SKUs below RETIRED; `PATIKTOK_COMPILER` deactivated + `setnayan_patiktok` taxonomy hidden. Rows kept for lineage only. See `RETIRED_ITEMS.md` + DECISION_LOG 2026-06-29.

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Patiktok Cam Bridge — per day (flat, all guests) | ₱49 / day | 4,900 | ACTIVE | [0017_patiktok.md](0017_patiktok/0017_patiktok.md) |
| Patiktok Cam Bridge — annual (all-events) | ₱249 / year | 24,900 | ACTIVE | [0017_patiktok.md](0017_patiktok/0017_patiktok.md) |

> Patiktok Cam Bridge tiers reflect lower per-DSLR value than Panood/Papic (short-form reels vs. broadcast / paparazzi). Locked 2026-05-17 as part of the 6-SKU Cam Bridge rollout.

### 2.4 Save-the-Date (iteration 0024)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Save-the-Date Video (MP4 download for social, repriced 2026-05-17 from ₱99) | ₱199 / render | 19,900 | ACTIVE | [0024_save_the_date.md:47](0024_save_the_date/0024_save_the_date.md) |

### 2.5 Invitation Widgets · Pro tiers (iteration 0004)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Monogram Hero (animated SVG-trace + custom video/photo background) | ₱1,999 | 199,900 | ACTIVE — **NO REFUND** | [0004_invitation_widgets.md:70](0004_invitation_widgets/0004_invitation_widgets.md) |
| Live Schedule (auto-scroll + "happening now" highlight) | ₱999 | 99,900 | ACTIVE — refundable 14d | [0004_invitation_widgets.md:78](0004_invitation_widgets/0004_invitation_widgets.md) |

### 2.6 Pakanta — AI-generated wedding song (iteration 0036)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Pakanta (single SKU — custom AI-generated wedding song) | ₱2,499 | 249,900 | ACTIVE | prod DB `platform_retail_catalog_v2` (2026-06-29) · [0036_pakanta.md](0036_pakanta/0036_pakanta.md) |

> **Repriced 2026-06-29:** the prior 3-tier Pakanta ladder (Basic ₱1,999 / Premium ₱3,999 / Wedding Suite ₱9,999) is RETIRED — Pakanta is now ONE SKU at ₱2,499 (prod DB canon).

### 2.7 Animated Monogram (iteration 0037)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Animated Monogram (AI-generated luxury mark + animation, 30 refinements included) | ₱1,999 | 199,900 | ACTIVE — **NO REFUND** | prod DB `platform_retail_catalog_v2` (2026-06-29) · [0037_bespoke_monogram.md](0037_bespoke_monogram/0037_bespoke_monogram.md) |
| Animated Monogram + 10 Refinements | ₱199 | 19,900 | ACTIVE — multi-buyable | [0037_bespoke_monogram.md:101](0037_bespoke_monogram/0037_bespoke_monogram.md) |

> **Renamed + repriced:** ships as **Animated Monogram ₱1,999** (prod DB canon) — NOT "Bespoke Monogram ₱2,999" and NOT ₱2,499.

### 2.8 LED Background (iteration 0005)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| LED Background — Standard | ₱599 | 59,900 | ACTIVE | iteration 0005 |
| LED Background — Custom tier (up to 90-min loops) | ₱899 | 89,900 | ACTIVE | CLAUDE.md decision log 2026-05-08 |

> **Verify:** LED prices not directly grepped from 0005 iteration .md in the latest sweep. Cross-check against iteration 0005 before using in production.

### 2.9 Professional Mood Board · Composite Scene renders (iteration 0010 V1.1)

Pay-per-render pack pricing locked 2026-05-22 — NO subscription, no activation gate, use anytime. Render = AI-generated composite of host's reference photos + couple's palette, auto-segmented into layered transparent PNGs for live Color Range Manipulator recoloring. Per [0010 § Professional Mood Board (V1.1+) · Composite Scene generator](0010_mood_board/0010_mood_board.md#professional-mood-board-v11--composite-scene-generator).

| SKU | Renders | Price | Centavos | Per-render | Margin (API ~₱30) | Status | Source |
|---|---|---|---|---|---|---|---|
| Professional Mood Board · Single render | 1 | ₱199 | 19,900 | ₱199 | 85% | ACTIVE (V1.1) | [0010_mood_board.md § Professional Mood Board](0010_mood_board/0010_mood_board.md#professional-mood-board-v11--composite-scene-generator) · [CLAUDE.md 2026-05-22 fifth row](CLAUDE.md) |
| Professional Mood Board · Studio pack | 50 | ₱8,999 | 899,900 | ₱180 | 75% | ACTIVE (V1.1) | same |
| Professional Mood Board · Production pack | 150 | ₱24,999 | 2,499,900 | ₱167 | 68% | ACTIVE (V1.1) | same |

**Host access pattern:** hosts (couples) cannot trigger renders directly without purchasing packs. Two paths: (a) **stylist-mediated** — host pins a stylist who holds Professional Mood Board credits; stylist generates the render for them; (b) **DIY direct** — host purchases their own pack. Drives stylist marketplace adoption while preserving DIY access.

**Industry positioning:** premium 3D event design renderings cost ₱45K-₱560K per render at top design studios; Setnayan delivers comparable visualization at ₱167-₱199/render = 99%+ savings. Marketing copy locked: *"Stop quoting clients ₱45,000+ for design renders. Generate unlimited concept visualizations with Professional Mood Board from ₱167/render. Win more bookings."*

---

## 3. Setnayan AI (iteration 0016)

> **RENAMED + REPRICED → SUBSCRIPTION (finalized 2026-06-30, owner "follow the redesign"):** the "Setnayan Concierge ₱4,999" SKU is RETIRED, and the prior **₱3,999 one-time per-event** model is now SUPERSEDED. Setnayan AI ships as a **per-USER subscription — ₱499 first 28-day cycle (intro) → ₱799/28-day cycle** (owner-locked 2026-07-02) — ONE subscription covers ALL of a user's events, runs from activation until each event's date then auto-ends. Adds the assistant layer (secretary/guard/coach + 33-template deterministic library) on top of the matchmaking layer. Prices are catalog-managed (prod DB `platform_retail_catalog_v2`). See [[project_setnayan_ai_subscription_redesign]].

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Setnayan AI (per-user subscription · matchmaking + secretary/guard/coach assistant) | ₱499 first 28d → ₱799/28d | 39,900 → 79,900 | LIVE catalog (`SETNAYAN_AI` = ₱499 `per_28d`). Per-user entitlement engine built but GO-LIVE-gated — see § 00.A. | prod DB `platform_retail_catalog_v2` (2026-06-30) · [0016_step_by_step_plan_builder.md](0016_step_by_step_plan_builder/0016_step_by_step_plan_builder.md) |

---

## 4. Vendor-side platform SKUs · vendor pays Setnayan (iteration 0022)

These are what verified vendors pay Setnayan for visibility, tools, and integrations. Couple-side never sees these prices.

### 4.1 Vendor Pro subscription

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Vendor Pro Weekly (analytics + landing styling, auto-renew, pauseable anytime) | ₱499 / week | 49,900 | ACTIVE | [0022_vendor_dashboard.md:286](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| Extended Pin (each, stacks with Pro, uncapped) | ₱49 / week | 4,900 | ACTIVE | [0022_vendor_dashboard.md:428](0022_vendor_dashboard/0022_vendor_dashboard.md) |

### 4.2 Boosted Ads (geo-radius targeting)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Boosted Ads 5km (top-of-search ranking, 5km radius) | ₱4,999 / week | 499,900 | ACTIVE | [0022_vendor_dashboard.md:464](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| Boosted Ads 10km (citywide reach) | ₱7,999 / week | 799,900 | ACTIVE | [0022_vendor_dashboard.md:465](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| Boosted Ads 20km (regional reach) | ₱14,999 / week | 1,499,900 | ACTIVE | [0022_vendor_dashboard.md:466](0022_vendor_dashboard/0022_vendor_dashboard.md) |

### 4.3 Sponsored Boost (premium long-commit)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Sponsored Boost Quarterly (3 months · 30km radius · verified-only) | ₱249,999 | 24,999,900 | ACTIVE | [0022_vendor_dashboard.md:479](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| Sponsored Boost Annual (12 months · 30km · verified-only · ~20% discount vs Quarterly × 4) | ₱799,999 | 79,999,900 | ACTIVE | [0022_vendor_dashboard.md:480](0022_vendor_dashboard/0022_vendor_dashboard.md) |

### 4.4 Tool integrations (à la carte)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Mood Board Integration | ₱99 / week | 9,900 | ACTIVE | [0022_vendor_dashboard.md:687](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| Seat Arrangement Integration | ₱99 / week | 9,900 | ACTIVE | [0022_vendor_dashboard.md:688](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| Palette Integration | ₱99 / week | 9,900 | ACTIVE | [0022_vendor_dashboard.md:689](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| QR Reader Integration | ₱99 / week | 9,900 | ACTIVE | [0022_vendor_dashboard.md:690](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| Advanced Pricing Tier (multi-rate / time-of-day / bundle engine) | ₱99 / week | 9,900 | ACTIVE | [0022_vendor_dashboard.md:691](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| **All Tools Unlock Bundle** (all 5 integrations, unlimited per account) | ₱9,999 / year | 999,900 | ACTIVE | [0022_vendor_dashboard.md:695](0022_vendor_dashboard/0022_vendor_dashboard.md) |

### 4.5 Non-Pro vendor utilities

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| QR Retrieval (per-event access for non-Pro vendors) | ₱500 / event | 50,000 | ACTIVE | [0022_vendor_dashboard.md:349](0022_vendor_dashboard/0022_vendor_dashboard.md) |

### 4.6 Specialized Pro Tools · per-service AI / specialized-coding add-ons (V1.x+ rollout · locked 2026-05-22)

Per-service Professional [Tool] subscriptions independent of the universal Free/Pro/Max vendor tier (§ 4.1-4.5). A vendor in any tier can subscribe to any Specialized Pro Tool matching their canonical_service. Per [CLAUDE.md 2026-05-22 fifth decision-log row](CLAUDE.md) and [0022 § 11 Specialized Pro Tools subscription management](0022_vendor_dashboard/0022_vendor_dashboard.md).

**13 SKUs at ₱888/wk PLACEHOLDER pricing** — deliberately non-charm-priced marker so they're impossible to miss when finalizing. Final pricing TBD per SKU; pure-code likely settles ₱499-₱999/wk, AI likely ₱1,999-₱2,999/wk with bundled allowance + overage packs.

| SKU | Cost shape | Vendor service category | Price (placeholder) | Status |
|---|---|---|---|---|
| Professional Coordination | Pure code | `wedding_coordination` | ₱888 / week | PLACEHOLDER · V1.x |
| Professional Catering | Pure code | `catering` | ₱888 / week | PLACEHOLDER · V1.x |
| Professional HMUA | Pure code | `hmua` | ₱888 / week | PLACEHOLDER · V1.x |
| Professional Music DJ/Emcee/Host | Pure code | `dj_emcee_host` | ₱888 / week | PLACEHOLDER · V1.x+ |
| Professional Live Band | Pure code | `band_live_music` | ₱888 / week | PLACEHOLDER · V1.x+ |
| Professional Cake/Desserts | Pure code | `cake_desserts` | ₱888 / week | PLACEHOLDER · V1.x+ |
| Professional Sound/Lighting | Pure code | `lights_sound` | ₱888 / week | PLACEHOLDER · V1.x+ |
| Professional Rings/Officiant/Transport/Booth | Pure code | various | ₱888 / week | PLACEHOLDER · V1.x+ |
| Professional Photo Tools | Hybrid (OpenCV + AI ranking) | `photographer` | ₱888 / week | PLACEHOLDER · V1.x |
| Professional Video Tools | AI (video editing) | `videographer` | ₱888 / week | PLACEHOLDER · V1.x |
| Professional Florist | AI (bouquet visualizer · reuses Mood Board engine) | `florist` | ₱888 / week | PLACEHOLDER · V1.x |
| Professional Stationery | AI (invitation designer) | `invitation_print` / `stationery_signage` | ₱888 / week | PLACEHOLDER · V1.x+ |
| Professional Attire | AI (try-on visualizer · reuses Mood Board engine) | `bridal_gown` / `groom_suit` / `entourage_attire` | ₱888 / week | PLACEHOLDER · V1.x+ |

> **Professional Mood Board (§ 2.9 above)** is the 14th SKU in this portfolio but ships pay-per-render packs instead of subscription. Owner directive: *"mood board out"* of the ₱888 placeholder set; its pack pricing is the FINAL model.

**V1.x rollout sequencing:** Professional Mood Board ships V1.1 first (parallel with Stylist marketplace launch per [0047](0047_style_driven_marketplaces/0047_style_driven_marketplaces.md)) · Professional Coordination second · Photo + Video + Catering + Florist third batch · others V1.x+ as marketplaces launch.

---

## 5. Vendor-to-couple fee structures · per-vendor policies (NOT Setnayan SKUs)

These are fee policies vendors set themselves at onboarding (iteration 0006). They're NOT Setnayan platform prices — they're between the vendor and the couple. Setnayan surfaces them in confirmation modals and applies them via the mediator (V1) or via 0034 Phase 2 auto-debit.

### 5.1 Reschedule fee policy (date changes · iteration 0021 § 10.9)

Vendor declares at onboarding whether they charge a fee for date changes, scaled to proximity. Common patterns:

- *"No fee 60+ days out, 50% inside 30 days, 100% inside 14 days"*
- *"₱5,000 flat fee for any date change inside T-21 days"*
- *"No reschedule fee — included in base price"*

Surfaced in the § 10.1 confirmation modal when ≥1 affected vendor has a non-zero fee at the current proximity. V1: manual mediator action. V2 (0034 Phase 2): auto-debit on vendor accept.

### 5.2 Relocation fee policy (venue changes · iteration 0021 § 11.3)

Vendor declares travel-cost rules at onboarding. **Illustrative examples** from the spec:

- *"Free within 30 km of home base; ₱5,000 per additional 10 km"*
- *"Free within Metro Manila; ₱15,000 flat for Tagaytay; case-by-case beyond"*
- *"₱8,000 equipment transport fee for any venue change inside T-30 days"*

> ⚠ **These examples are illustrative.** Vendors set their own policy; the numbers above are sample text in the spec, not platform-mandated rates.

Same surfacing pattern as reschedule fees — modal at § 11.1, manual mediator V1, auto-debit V2.

### 5.3 Per-head / per-table rates (guest count changes · iteration 0021 § 12.3)

Vendors who are guest-count-dependent (catering, florals, mobile bar, lights & sound, name cards/favors/print — see § 12.1 of 0021) capture per-head or per-table rates at booking. **Illustrative examples** from the spec:

- Casa Manila Catering — ₱1,200 / plate
- Bloomwood Florals — ₱5,500 / table
- Lumiere Lights & Sound — flat (capacity ceiling-bounded)

> ⚠ **These examples are illustrative.** Real vendor rates are captured per-vendor at booking via `vendor_event_window.confirmed_guest_count` × per-head rate. Vendors enter their actual numbers; Setnayan does not set them.

The § 12.3 modal computes the cost delta at the time of a guest-count increase (e.g., "+20 plates × ₱1,200 = +₱24,000") and surfaces both per-vendor and total impact before couple confirms.

### 5.4 Per-vendor change-acceptance cutoffs (iteration 0021 § 13.2)

V1 default cutoff values (days before event), pre-filled at vendor account creation. Vendors edit at onboarding. NOT prices — these are acceptance windows.

| Vendor category | Date | Venue | Guest count |
|---|---|---|---|
| Catering | 30 | 21 | 14 |
| Florals | 21 | 14 | 10 |
| Mobile bar | 21 | 14 | 7 |
| Lights & sound | 14 | 21 | 7 |
| Name cards / favors / print | 21 | 14 | 10 |
| Photography | 7 | 3 | N/A |
| Videography | 7 | 3 | N/A |
| HMUA | 7 | 3 | N/A |
| Planner / coordinator | 7 | 3 | 7 |
| Live stream / broadcast | 3 | 3 | N/A |

See [0021 § 13](0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md) for the snapshot rule + admin override path.

---

## 6. Cost-per-event reference (Setnayan-side · for margin tracking)

| SKU | Setnayan cost | Price | Margin |
|---|---|---|---|
| Save-the-Date Video | ~₱5 | ₱199 | ~97% |
| Papic 3-seat | ~₱195 | ₱1,499 | 87% |
| Papic 5-seat | ~₱265 | ₱2,499 | 89% |
| Per Template add-on | ~₱2 / render × ~30 reels = ~₱60 | ₱49 each | varies by usage |
| Monogram Hero (widget Pro) | ₱0 (animation/template assets) | ₱1,999 | ~100% |
| Live Schedule (widget Pro) | ₱0 | ₱999 | ~100% |
| Panood Daily Broadcast (3 cams × 3 hrs reference) | ~₱120 | ₱2,499 | 95% |
| Panood Daily + 2 cams (5 cams × 3 hrs) | ~₱180 | (now bundled into Daily Broadcast ₱2,499) | — |
| Bespoke Monogram | ~₱5 (DALL-E generation) | ₱2,999 | ~99% |
| Broadcast Style Pack | ~₱5 (LUT swaps) | ₱2,999 | ~99% |
| AI Video Highlight | ~₱10 (Claude API + ffmpeg) | ₱1,999 | ~99% |
| AI Edited Highlight (3-min) | ~₱30 (Claude API + ffmpeg + theme template) | ₱3,499 | ~99% |
| ~~Same-Day Edit~~ | ~~(human editor billable to Setnayan)~~ | ~~₱24,999~~ | **RETIRED 2026-06-28** |
| Pakanta Wedding Suite | ~₱200 (Suno credits + Claude API) | ₱9,999 | 85–90% |
| Vendor Pro Weekly | ₱0 (analytics + landing styling) | ₱499 / wk | ~100% |
| All Tools Unlock Bundle | ₱0 | ₱9,999 / yr | ~100% |
| Sponsored Boost (Quarterly / Annual) | ₱0 (ranking is software-only) | ₱249,999 / ₱799,999 | ~100% |

**Per-render cost reference:** ~₱2–₱5 (FFmpeg compute + R2 storage; music is free since Suno catalogue is owned; CDN egress is free on R2).

**Live Stream cost is audience-independent.** YouTube absorbs all viewers at ₱0 marginal cost to Setnayan — bill scales only with camera count and stream hours, not viewer count.

---

## 7. CLAUDE.md cheat-sheet drift (reconcile when convenient)

The [CLAUDE.md § Cost-per-event cheat sheet](CLAUDE.md) was last updated 2026-05-09 and has drifted from current iteration spec. Rows to refresh:

| CLAUDE.md row | Current state |
|---|---|
| "Save-the-Date Render (₱49)" | Repriced to ₱199 on 2026-05-17 (iteration 0024) |
| "Pro tier per Widget (₱99)" | Retired; replaced by Monogram Hero ₱1,999 + Live Schedule ₱999 (2026-05-16) |
| "Pro Bundle (₱199)" | Retired 2026-05-16 |
| "Live Stream Base (₱2,499 — 3 cams × 3 hrs)" | Folded into Panood Daily Broadcast ₱2,499 / day (multi-cam built-in 2026-05-17) |
| "Custom Monogram Pack (₱1,999)" | Status uncertain — iteration 0021 § 1 still lists it active at ₱2,000; iteration 0037 introduces Bespoke Monogram at ₱2,999 as a replacement. **Reconciliation needed.** |
| "Sponsored Boost (₱1,499/wk)" | Retired 2026-05-16; replaced by Boosted Ads 5km/10km/20km weekly + Quarterly/Annual long-commit |
| "AI Edited Highlight (₱3,499 per 3-min · repriced 2026-05-16 from ₱4,999)" | ✅ current |
| "Vendor Pro Weekly (₱499/wk)" | ✅ current |

Refresh action: rewrite the [CLAUDE.md § Cost-per-event cheat sheet](CLAUDE.md) to match § 6 above, then mark `CLAUDE.md` section dated `(refreshed 2026-05-17)`.

---

## 8. Retired SKUs (historical context)

| Retired SKU | Last price | Retired | Replacement | New price |
|---|---|---|---|---|
| Token Wallet system (iteration 0003) | Per-pack model | 2026-05-11 | Apply-then-pay (PHP-direct) | N/A |
| Save-the-Date Render (₱99 MP4) | ₱99 | 2026-05-16 | Save-the-Date Video | ₱199 |
| Save-the-Date Render (₱49 MP4) | ₱49 | 2026-05-17 | Save-the-Date Video | ₱199 |
| Pro Widget Bundle | ₱199 | 2026-05-16 | Individual purchases (Monogram Hero ₱1,999 + Live Schedule ₱999) | — |
| Pro Widget Story (₱99) | ₱99 | 2026-05-16 | Folded to free (scroll parallax + Ken Burns) | FREE |
| Pro Widget Monogram (₱99) | ₱99 | 2026-05-16 | Monogram Hero | ₱1,999 |
| Pro Widget Schedule (₱99) | ₱99 | 2026-05-16 | Live Schedule | ₱999 |
| Custom Monogram Pack (₱1,999) | ₱1,999 | Status uncertain | Possibly Bespoke Monogram | ₱2,999 |
| Concierge Essentials (₱2,499 / 6mo) | ₱2,499 | 2026-05-16 | Concierge Complete (single SKU) | ₱4,999 / 12mo |
| Concierge 3-tier ladder (₱99 / ₱999 / ₱1,999) | varied | 2026-05-14 | Single-SKU Concierge model | ₱4,999 |
| AI Edited Highlight (prior) | ₱4,999 | 2026-05-16 | AI Edited Highlight (repriced) | ₱3,499 |
| Concierge 7-day card-less preview | FREE | 2026-05-17 | 3-day card-less trial (account-level cap) | FREE |
| Panood Annual Streaming Plus | ₱3,999 / yr | 2026-05-17 | Folded into Annual Streaming base | ₱19,999 / yr |
| Panood Camera Sync | ₱99 / day | 2026-05-17 | Built into Daily Broadcast base | ₱2,499 / day |
| Panood Camera Add-on (per camera) | ₱999 | 2026-05-17 | Folded into Daily Broadcast base (multi-cam now built-in) | ₱2,499 / day |
| Sponsored Boost Weekly | ₱1,499 / week | 2026-05-16 | Boosted Ads 5km/10km/20km weekly tiers | ₱4,999–14,999 / wk |
| Live Stream tiered SKUs (5–8 with crew bundles) | various | 2026-05-09 | Dropped from V1 — apparatus rule (price the tool, not the labor) | — |
| Wedding Ceremony +3 hrs add-on | ₱999 | 2026-05-09 | Per-day model (Daily Broadcast) | ₱2,499 / day |

---

## 9. Companion artifacts (binary; for stakeholder + financial modeling)

Located in [05_Financials/](05_Financials/):

| File | Format | Purpose |
|---|---|---|
| `00_Pricing_and_Costs.xlsx` | Spreadsheet | Canonical financial spreadsheet (SKU prices + costs) |
| `Pricing_Workbook_Plain_English.xlsx` | Spreadsheet | Stakeholder-facing pricing explainer |
| `Pricing_Workbook_Set_Your_Prices.xlsx` | Spreadsheet | Owner pricing-decision workbook |
| `Cost_vs_Revenue_Analysis.xlsx` | Spreadsheet | Margin + revenue projection model |
| `Revenue_Projection_Model.xlsx` | Spreadsheet | V1 revenue forecast |
| `Pricing_Audit_and_Subscription_Strategy_2026-05-10.docx` | Strategy report | Pricing audit + subscription pivot discussion |
| `Pricing_v2_Subscription_Pivot_Recommendation.docx` | Strategy report | Subscription-pivot recommendation memo |

These binary artifacts are the financial source-of-truth for owner-side budgeting. This Markdown doc mirrors the customer-facing SKU layer.

---

## 10. Cross-references · price-touching iterations

| Iteration | Pricing surface |
|---|---|
| [0003 (retired)](RETIRED_ITEMS.md) | Token Wallet — retired 2026-05-11, no longer active |
| [0004 Invitation Widgets](0004_invitation_widgets/0004_invitation_widgets.md) | Monogram Hero, Live Schedule |
| [0005 LED Background](0005_led_background_maker/0005_led_background_maker.md) | LED Standard + Custom tier |
| [0011 Panood](0011_panood/0011_panood.md) | All Panood SKUs + AI Highlights _(SDE retired 2026-06-28)_ |
| [0012 Papic](0012_papic/0012_papic.md) | All Papic SKUs |
| [0016 Step-by-Step Plan Builder](0016_step_by_step_plan_builder/0016_step_by_step_plan_builder.md) | Setnayan Concierge tier + trial |
| [0021 Couple Dashboard](0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md) | Active apparatus table § 1 + vendor-to-couple fee policies § 10.9 / § 11.3 / § 12.3 / § 13.2 |
| [0022 Vendor Dashboard](0022_vendor_dashboard/0022_vendor_dashboard.md) | All vendor-side platform SKUs (Pro, Boosted Ads, Sponsored Boost, integrations) |
| [0024 Save-the-Date](0024_save_the_date/0024_save_the_date.md) | Save-the-Date Video |
| [0026 BIR Tax Compliance](0026_bir_tax_compliance/0026_bir_tax_compliance.md) | Tax + receipt rules (no pricing of its own; references all other SKUs) |
| [0034 Payments & Cart](0034_payments_and_cart/0034_payments_and_cart.md) | Apply-then-pay flow (consumes prices from this doc) |
| [0036 Pakanta](0036_pakanta/0036_pakanta.md) | Pakanta tiers |
| [0037 Bespoke Monogram](0037_bespoke_monogram/0037_bespoke_monogram.md) | Bespoke Monogram + refinement add-ons |

---

## 11. Update protocol

When a price changes:

1. **Decide + lock the new price** with the owner. Confirm it matches the charm ladder (§ 1).
2. **Update the owning iteration `.md`** — that's the canonical source.
3. **Append a row to the CLAUDE.md decision log** with date, what + why, affected iterations.
4. **Update this doc** — find the row in §§ 2–5 and refresh the price + centavos + status; if a SKU is retired, move the old row to § 8.
5. **Regenerate `Pricing.docx`** via pandoc:
   ```bash
   pandoc Pricing.md -o Pricing.docx
   ```
6. **Update memory if the rule is cross-iteration** (per CLAUDE.md memory guidance).
7. **Refresh the 05_Financials/ xlsx workbooks** when convenient — those drive financial modeling but are owner-edited binaries.

**Drift detection:** every owner-led pricing decision should follow this protocol. If a price is updated in one place but not the others, the CLAUDE.md decision log is the tie-breaker (most recently dated row wins).

**Future canonical workflow** (locked 2026-05-17 · ships with iteration [0023 § 3.12 Add-on Management](0023_admin_console/0023_admin_console.md)): admin updates SKU price / eligibility / 2D billing config in `/admin/addons` → `service_catalog` row updates with audit row → admin clicks "Generate Pricing Report" → this `Pricing.md` is regenerated from live database state + a timestamped snapshot written to `/admin/addons/reports/{ts}.md`. V1.5+ adds nightly auto-regeneration via pg_cron so this doc is never more than 24 hours stale. **Until that admin surface ships,** keep editing this doc by hand following the protocol above.

---

## 12. Companions

- `Pricing.docx` — Word-format mirror regenerated via pandoc.

---

*Last regenerated: 2026-05-22 (Specialized Pro Tools architecture + Professional Mood Board pack pricing + 13-SKU placeholder added per CLAUDE.md fifth 2026-05-22 decision-log row)*
