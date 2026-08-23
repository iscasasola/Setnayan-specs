# Setnayan Pricing — V1 Master Reference

> **Purpose.** Single consolidated view of every Setnayan-platform price + vendor-side fee structure. Each row cross-references the owning iteration `.md` where the canonical decision lives — this doc is a navigable index, not the source of truth.
>
> **Last sweep:** 2026-06-04 — **LIVE-SITE RECONCILIATION.** Realigned to the published catalog on setnayan.com (`/pricing`, `/`, `/features`, `/for-vendors`, `/how-it-works`). The live site is now the source of truth; where it contradicts itself, `/pricing` wins. See **§ 0** for the authoritative live catalog and **§ 0.1** for unresolved site-internal contradictions the owner must settle. Sections § 2–§ 8 below are the pre-reconciliation spec history, retained for lineage but **superseded by § 0 wherever they disagree.**
> **Update protocol** (see § 11): when a price changes, update the owning iteration `.md` → CLAUDE.md decision log → this doc → regenerate `Pricing.docx` via pandoc. **(Amended 2026-07-19 — owner: pricing follows code: a price change lands as CODE first — a migration/PR in `setnayan-platform` — and this doc mirrors the merged state after; never edit § 00 ahead of the code.)**
>
> **Known drift:** the CLAUDE.md § Cost-per-event cheat sheet is stale in places — see § 7. As of 2026-06-04 the larger drift is spec-vs-live-site; see § 0 and the standalone `Site_vs_Spec_Reconciliation_2026-06-04.md`.

---

## 00. PRICING — CANONICAL (owner-locked 2026-06-07 "lock it" · supersedes § 0 and §§ 2–8)

> **🔁 (code-sync 2026-07-19, owner: pricing follows code).** Owner decision 2026-07-19 (#3): **§ 00 = "follow what we will code" — the CODE is canonical; this doc mirrors it.** Every row below was re-verified 2026-07-19 against BOTH (a) `origin/main` of `setnayan-platform` (`apps/web/lib/add-ons-catalog.ts` + `supabase/migrations/*`) and (b) the **live prod DB** (`platform_retail_catalog_v2` · `vendor_billing_catalog` · `papic_tier_config`). **Repo and prod are IN SYNC** — the prod migration ledger is current through `20270823141500`, identical to `origin/main` — so "code" and "live DB" agree on every row unless a row explicitly records a dual state. Where an owner decision exists only on paper (no migration/PR), the row is marked **(spec-only, not in code — unresolved)**: it resolves by WRITING CODE, never by editing this doc first. Open items → § 00.G.

### 00.0 SHIPPED CATALOG — the code-canonical sheet (verified `origin/main` + live prod DB, 2026-07-19)

**COUPLE (event) side — active SKUs:**

| SKU (`service_code`) | Shipped price · status (code = live DB unless a dual state is recorded) |
|---|---|
| Free base | ₱0 — planning workspace (Guests · Schedule · Budget · Seat Plan 2D/List · Mood Board · Playlist) + the 4-in-1 website (Save-the-Date content film · RSVP · Event day · auto-Editorial) + **unlimited RSVP free** + Custom QR (`CUSTOM_QR_GUEST` ₱0, active) + Photo Delivery + single-cam livestream + free Papic cameras (count: see the Papic row's dual state) |
| Setnayan AI (`SETNAYAN_AI`) | **₱1,499 one-time, per event · ACTIVE.** ✅ **Ambiguity RESOLVED by verification 2026-07-19:** migration `20270729889508` is on `origin/main` **AND applied to prod** — live row = ₱1,499 / `one_time` / active. (The earlier § 00 caveat "built on draft PR #3145, live catalog still ₱499" is stale — #3145 merged and the reprice reached prod.) `SETNAYAN_AI_SUB` + `SETNAYAN_AI_RENEW` stay `is_active=false`. |
| Animated Monogram / **Monogram PRO** (`ANIMATED_MONOGRAM`) | **₱1,000** (owner 2026-07-22 · was ₱999) — the maker is free; the paid animation is Monogram PRO, which now ALSO confers the LED **Live Background** (`LIVE_BACKGROUND ← ANIMATED_MONOGRAM` alias). ✅ IN CODE PR **#3564** (migration `20270915796315`). ⏳ needs `supabase db push`. |
| Cinematic Reveal (`STD_PREMIUM_OPENINGS`) | **BUNDLE-ONLY** (owner 2026-07-22) — `is_active=false`; obtained ONLY via Website PRO ₱3,500 (alias). Was standalone ₱999. Existing owners keep it (order-based). ✅ IN CODE PR **#3564**. ⏳ needs `supabase db push`. |
| Editorial PRO (`EDITORIAL_PRO`) | 🆓 **FREE FOR EVERY EVENT 2026-08-23** (owner, asked what it would cost us: *"keep it free if this costs us nothing"*). Every perk behind its PRO chip is a PRESENTATION CONTROL over data the couple already owns — reordering their own rows and sections, naming their own moments, featuring their guests' wishes — so it costs nothing to run. ⚠ **The row was ALREADY `is_active=false` with ZERO orders ever and nothing had switched the feature on**, so the perks were DARK for anyone without the ₱3,500 umbrella — "free and retired are the same row and opposite products", caught one step in. The row stays deactivated so nothing quotes a price; the feature is ON for everyone via `FREE_FOR_ALL_SKUS`. 🔒 **The umbrella is untouched at ₱3,500** — the no-watermark and the Cinematic Reveal gate on `COUPLE_WEBSITE_PRO`, a different helper. 🔴 **OPEN OWNER DECISION: what Website PRO should now say it buys.** PR **#4727**. _(Was BUNDLE-ONLY from 2026-07-22; standalone ₱2,999 before that.)_ |
| 3D Plan (`SEATING_3D`) | **₱1,500** — host-activation, one-time per event (owner 2026-07-23 · was interim ₱1,000 · was ₱2,999). ✅ **SHIPPED to the live catalog 2026-08-02** (migration `20271032178949`, PR #4033 — prod object-verified at ₱1,500, `one_time`, not pax-priced). **Value** = an interactive "gaming-like" 3D seat plan: view own seats + vendors + **co-presence (see other accounts roaming the room = shared-room slice 8, built flag-off `NEXT_PUBLIC_PLAN3D_SHARED_ROOM`)**. **RETIRE everything else (owner):** the ₱2,999 standalone, the interim ₱1,000, AND the #3526 vendor-enabled couple discount are all retired → ₱1,500 is the single host price. The **₱1,500/28d vendor 3D-Booth add-on** (#3526 · `vendor_3d_booth` · § 00.G #8) is SEPARATE + unchanged (recurring vendor ad/booth presence, not a couple discount — same number, different cadence + payer). |
| Custom Subdomain (`EVENT_SUBDOMAIN`) | ₱999 / year · active — remaining gap is provisioning (wildcard DNS + routing), not billing |
| Pakanta (`PAKANTA`) | **₱2,500** (owner 2026-07-22 · was ₱2,499; Music Creator folds into Pakanta at this price). ✅ IN CODE PR **#3559** (migration `20270914120000`). ⏳ needs `supabase db push`. |
| **Live Studio (`LIVE_STUDIO`)** | **₱2,999 / event** — THE unified live-broadcast SKU (owner-locked 2026-07-25 · `Live_Studio_Unified_Spec_2026-07-25.md` § 3): Cast + Roam merged into ONE switching product (a directed Main Stage + switchable guest cameras). **Per-event, not per-day, not monthly.** ✅ IN CODE (migration `20271001110000`), `is_active=TRUE` — but **name-excluded from the customer catalog while `NEXT_PUBLIC_LIVE_STUDIO_ROAM_ENABLED` is off**, so nothing is listed or purchasable yet. **⚠ CONSEQUENCE, stated: with both Cast SKUs retired (below) and this one flag-dark, NO paid live-broadcast SKU is sellable anywhere today.** The free single-camera livestream is untouched; the paid row returns automatically at the flag flip. Window = ONE event-day of multi-cam broadcasting anchored on FIRST GO-LIVE, extendable at ₱2,999, never cut off mid-broadcast (§ 4f ②). |
| Live Background (`LIVE_BACKGROUND`) | **BUNDLE-ONLY** (owner 2026-07-22) — `is_active=false`; folded into Monogram PRO ₱1,000 (`LIVE_BACKGROUND ← ANIMATED_MONOGRAM` alias). Was standalone ₱499; the LED maker gate + card stay keyed to `LIVE_BACKGROUND` (Monogram-PRO owners get it via the alias). Existing owners keep it. ✅ IN CODE PR **#3564**. ⏳ needs `supabase db push`. |
| Live Photo Wall (`LIVE_WALL`) | **FREE** for every event (owner 2026-08-11 · was ₱2,500; row deactivated so nothing quotes a price, feature ON for all via `FREE_FOR_ALL_SKUS`) |
| Camera Bridge (`CAMERA_BRIDGE`) | ₱500 (row titled "per event/day — unlocks DSLR for ALL Papic cameras"; `billing_period` = `one_time`) |
| Papic cameras | Mini **₱30** · Ltd **₱50** · Unli **₱100** per cam·day (`PAPIC_CAMERA_MINI_DAY` / `_LTD_DAY` / `_UNLIMITED_DAY`; legacy `_ROLL_DAY` ₱30 aliases to Mini). Capture-points config SHIPPED to prod (`papic_tier_config`: free/Mini 20 pts · Ltd 70 pts · Unli ∞ · 1 photo = 1 pt · 5-s clip = 3 pts). **FREE CAMERAS — dual state:** app code on `main` still ships **5 free** (`PAPIC_FREE_CAMERA_COUNT = 5`); the v3 config's **3 free** (`papic_tier_config.free.seats_per_event = 3`) is shipped-but-unread. **CAPS — dual state:** v3 config (shipped): Mini ₱6,000 · Ltd ₱10,000 · Unli ₱15,000 wedding-day caps — **but the quote/charge code does not read it yet**; the legacy billing path still reads `events.papic_ltd_cap_php` (live default **₱9,000**) / `papic_unli_cap_php` (**₱15,000**); `papic_mini_cap_php` (**₱6,000**) is shipped-but-unread. Both dual states collapse when Papic v3 PR-3 lands — per owner 2026-07-19 it lands together with free-tier enforcement as **ONE atomic PR** (in flight). |
| Papic add-ons | ALL ACTIVE + PAID in code+DB: Patiktok (`PATIKTOK_COMPILER`) **₱1,500/day** (owner 2026-07-22 · was ₱1,499 · ✅ PR **#3559**, ⏳ needs `db push`) · Thank You **₱2,499** · Kwento **₱299** · Pabati **₱1,299** · Stories **₱2,000**. ⚠ The 2026-07-17 recut ("Kwento/Pabati/Stories FREE with Mini/Ltd/Unli · Thank You ₱2,500") is **(spec-only, not in code — unresolved)** and belongs to the separate Papic-pricing session; until a migration lands, the shipped paid prices stand. |
| **Website PRO** (`COUPLE_WEBSITE_PRO`) | **REACTIVATED + ₱3,500** (owner 2026-07-22 · was ₱4,999, deactivated) — the umbrella and the ONLY way to buy the now-bundle-only **Cinematic Reveal + Editorial PRO**; confers both via `SKU_OWNERSHIP_ALIASES` + drops the watermark. ✅ IN CODE PR **#3564** (migration `20270915796315`). ⏳ needs `supabase db push`. (Supersedes the prior DEACTIVATED state + the "Website Upgrade ₱3,500 spec-only" note.) |

Inactive in the live catalog (code truth · lineage rows only): RSVP ₱2,499 · RSVP Pro ₱4,499 · Pro RSVP ₱1,999 · Event Website ₱1,999 · Editorial Website ₱7,999 · Papic Guest / Papic 5 Seats ₱2,999 · SDE · Call-Time Escalator ₱1,999 · Indoor Blueprint ₱1,499 · Pakulay ₱0 · Today's Focus ₱1,499 · STD video upload ₱100 · gallery upload ₱100 · map linking ₱100 · website themes ₱1,000 · `SETNAYAN_AI_RENEW` ₱799/28d. Also still true: own-`.com` domain DROPPED · Events-PRO ₱9,999 bundle REMOVED (model stays pure à-la-carte).

**VENDOR side — active catalog (`vendor_billing_catalog`):** Free (Verified) ₱0 · Solo **₱1,000/28d · ₱10,000/yr** · Pro **₱2,500/28d · ₱25,000/yr** · Enterprise **₱8,000/28d · ₱80,000/yr** (🔁 **round-number reprice shipped 2026-07-22 · PR #3513, merged** — off the charm ₱999/₱2,499/₱7,999 · ₱9,999/₱24,999/₱79,999; annual = 10× the 28-day fee) · Custom base ₱8,999/28d + add-ons (Reach +100 km ₱499 · Nationwide ₱2,499 · +1 event slot ₱499 · +100 photos ₱99 · included token ₱100/cycle · custom domain ₱499) · Additional Branch ₱999/28d · Extra Team Seat ₱250/28d · **token packs flat ₱200/token** (5/10/25/50/100 = ₱1,000 / ₱2,000 / ₱5,000 / ₱10,000 / ₱20,000 · `vendor_token_pack_4` retired · PR #3138 / migration `20270728100000`) · burn = flat **1 token (₱200)** per inquiry answer · **0% commission**. ⚠ Two corrections vs the prior § 00 vendor line: **(1) NO 100-free-tokens-on-verify** — retired 2026-06-17 (migration `20270110320020`); tokens come only from admin grants · subscription bundles · paid packs (the "(100 free on verify)" text previously here was stale). **(2) Vendor subdomain (`vendor_subdomain` ₱999/yr) — dual state:** seeded ACTIVE by migration `20270712300100`, but the LIVE row is `is_active=false` (admin-deactivated pending provisioning) — recorded as-is, no winner guessed; the couple-side `EVENT_SUBDOMAIN` is the active one. Boosted Ads / Sponsored Boost stay HELD (mechanism unbuilt).

> **🚨 DEPENDENCY (unchanged):** recurring billing (the ₱999/yr subdomains, true vendor auto-renew, any renewal) needs a payment gateway + card-on-file + recurring scheduler + dunning. Setnayan AI is NOT on this list (one-time). **Gateway = PAYMONGO — owner-locked 2026-07-12 (NOT Maya);** the provider-agnostic seams (manual-QR + reconciliation + subscription scaffold + fulfillment hooks) are reused. Until PayMongo is live, "recurring" = manual prepaid re-charge.

> **Lineage:** the 2026-07-10 finalization banner + FINAL tables that previously sat here (PR #3022 · migrations `20270712300000`/`20270712300100` · the 2026-07-12 ₱1,499 Setnayan-AI FINAL · the 2026-07-13 "leave the 5 Papic add-ons live & paid" ruling · the 2026-07-19 § 2.1 GBB-row correction) are folded into § 00.0 above; full rationale stays in `DECISION_LOG.md` (2026-07-10 → 2026-07-19 entries). Strategic frame unchanged: couple side = demand engine, vendor side = the recurring revenue; cost basis ≈ R2 only → ~95–99% margin. **This section supersedes § 0 below wherever they disagree.** Site-sync history: PR #1335 (2026-06-13).

### 00.A Tiers

| Tier | Price | Includes |
|---|---|---|
| Free — Explore | ₱0 | Browse marketplace + personalized match "reveal" preview + Schedule · Budget · Guest List · Seat Plan · Mood Board. *(code-sync 2026-07-19 — the "**No free RSVP, no free website**" claim here was the 2026-06-07 model and is SUPERSEDED by the shipped code: the base 4-in-1 website + unlimited RSVP + Custom QR are FREE; what stays paid is the matching/AI (₱1,499) + the premium unlocks — see § 00.0.)* |
| **Setnayan AI** | 🔁 **SUPERSEDED AGAIN 2026-07-12 → ₱1,499 ONE-TIME, PER EVENT (single SKU · owner FINAL — no monthly/annual/₱4,999-pass/₱499-entry/tiers; see § 00 banner). ✅ NOW SHIPPED + ON PROD (code-sync verified 2026-07-19): migration `20270729889508` is on `origin/main` AND applied to the live DB — row = ₱1,499 / `one_time` / active.** Prior 2026-07-10 state (kept for lineage) → ₱499 ONE-TIME, PER EVENT — owner-confirmed "per event"; ✅ SHIPPED (PR #3022): live catalog `SETNAYAN_AI` = ₱499/`one_time`, `SETNAYAN_AI_RENEW` deactivated, gate = per-event permanent unlock via `events.setnayan_ai_active`. **No recurring-billing dependency.** Per-USER subscription text (below/right) retired, kept for lineage: ~~₱499 first 28-day cycle (intro) → ₱799/28-day cycle · owner-locked 2026-07-02~~ | First paywall — full match / sort / cross-reference (date↔availability · budget · venue · pax · religion · reviews) + planning workspace + the secretary/guard/coach assistant. Soft-gate reveal. **✅ FINALIZED 2026-06-30 (owner "follow the redesign · go fully live") — per-USER SUBSCRIPTION — ₱499 first 28-day cycle (intro) then ₱799 per 28-day cycle (owner-locked 2026-07-02). Live DB `platform_retail_catalog_v2.SETNAYAN_AI` = ₱499 / `per_28d` (mig `20270322883953`). One subscription covers ALL of a user's events (read-side fan-out via `user_ai_subscription.active_until` → `isSetnayanAiActiveForUser`); never double-charges a couple on shared/co-hosted events; runs from activation UNTIL `events.event_date`, then auto-ends (lazy expiry, no charges past the event). Supersedes the prior ₱3,999 one-time per-EVENT model. ⚠ GO-LIVE GATE: the per-user gate must be wired into the 6 experience surfaces + `setnayan_ai_per_user_enabled` flipped + `SETNAYAN_AI_SUB` SKU activated + the per-event `SETNAYAN_AI` row retired — flag-flip alone does NOT deliver AI (surfaces still read the per-event entitlement). INF/TRD personalization stays dormant pending DPO sign-off. 🆓 FREE FIRST VENUE SHORTLIST (owner-locked 2026-07-09, refined same day): Suri finds the couple's FIRST reception-venue shortlist FREE, ONCE per event — the introduction to the benefits of Setnayan AI. Offered only while the venue shortlist is empty (the state records consumption — no schema); up to 5 real marketplace matches attached via the shipped attach path. Everything beyond that first shortlist — refreshes, other categories, the guard/secretary/briefing layer — stays behind ₱499→₱799.** |

### 00.B À la carte (no bundles — Free → Setnayan AI → these)

> **(code-sync 2026-07-19 — this list now mirrors the SHIPPED catalog; § 00.0 is the row-by-row sheet. Paper-only decisions are flagged, never priced in.)**

Setnayan AI **₱1,499 one-time, per event** (✅ SHIPPED + ON PROD — migration `20270729889508`; single SKU · owner FINAL 2026-07-12 · no monthly/annual/₱4,999-pass/₱499-entry/tiers) · **Website PRO ₱3,500** (owner 2026-07-22 · reactivated · the umbrella that unlocks the now-bundle-only Cinematic Reveal + Editorial PRO) · Editorial PRO **bundle-only (via Website PRO)** · Cinematic Reveal **bundle-only (via Website PRO)** · Animated Monogram / **Monogram PRO ₱1,000** (owner 2026-07-22 · incl. Live Background) · Pakanta **₱2,500** · 3D Plan **₱1,500** (owner 2026-07-23 · host-activation, one-time/event · interim ₱1,000 + ₱2,999 both RETIRED · ✅ **SHIPPED to the live catalog 2026-08-02** (migration `20271032178949`, PR #4033 — prod object-verified at ₱1,500, `one_time`, not pax-priced)) · Custom Subdomain **₱999/yr** · Keep Full-Res **RETIRED in code** (PR #3523 · Preserve = 6-month, folded into Papic) · **Live Studio ₱2,999/event** — the unified SKU (owner 2026-07-25; Cast+Roam merged), ✅ in code + `is_active=TRUE` but **flag-dark and name-excluded from the customer catalog**, so not sellable yet; **both per-day Cast SKUs are RETIRED** (Desktop `PANOOD_SYSTEM` ₱2,500/day by migration `20271005180040` / PR #3716 — it closed a ₱500 alias arbitrage; Mobile ₱1,500/day 2026-07-21) · single-cam livestream still FREE · YouTube via the couple’s own OBS (Wave 9 removed the couple’s YouTube-ACCOUNT requirement, not the encoder), Facebook Live supported via OBS with a mandatory 30-day-replay-deletion warning · Live Background **bundle-only (via Monogram PRO)** · Live Photo Wall **FREE** (owner 2026-08-11 · was ₱2,500) · Camera Bridge **₱500** (event-wide) · Papic **Mini ₱30 · Ltd ₱50 · Unli ₱100 per cam·day** — capture points 20/20/70/∞ (1 photo = 1 pt · 5-s clip = 3 pts) shipped in `papic_tier_config`; **free cameras + caps are DUAL STATE** (app still ships 5 free + legacy caps Ltd ₱9,000 / Unli ₱15,000; the v3 3-free + Mini ₱6,000 / Ltd ₱10,000 / Unli ₱15,000 wedding-only caps are shipped-but-unread — both collapse when Papic v3 PR-3 + free-tier enforcement land as ONE atomic PR, owner 2026-07-19) · Papic add-ons ALL PAID in code: Patiktok **₱1,500/day** (owner 2026-07-22 · was ₱1,499) · Thank You **₱2,499** · Kwento **₱299** · Pabati **₱1,299** · Stories **RETIRED / OFF SALE 2026-08-11** (owner — migration `20271132214645`; the ₱2,000 row sold **nothing**: the story maker has no entitlement gate and no code reads whether it was bought. This lands the "Stories FREE" half of the 2026-07-17 recut **in code**, by retiring the paid row rather than repricing it; ⚠ the Kwento/Pabati halves of that recut remain **spec-only, not in code — still the Papic-pricing session's**) · Custom QR **FREE** · Music Creator **RETIRED** (folds into Pakanta). **No à-la-carte bundles beyond Website PRO** — Essentials/Complete removed 2026-06-29; **Website PRO ₱3,500 is the sole umbrella** (reactivated 2026-07-22 · § 00.G #1–#3). SRP = live sum of the à-la-carte SKUs above. (Retired & inactive: RSVP / RSVP Pro / Event Website / Editorial Website standalones · Papic Guest / Papic 5 Seats · SDE · Auto-Recap · Unlock-all-Papic (no live row).)

### 00.C Removed (tombstoned 2026-06-07)

Indoor Blueprint · Call-Time Escalator · Pro Website (→ Event + Editorial Website) · High Res Archive · Bundle Guided Planner Suite (₱11,999) · Bundle Comprehensive Media Pack (₱16,999). **Mood Board kept — free.**

> ⚠ **(code-sync 2026-07-19):** High Res Archive was REVIVED in code as **Keep Full-Res (`HIGH_RES_ARCHIVE`) ₱999/yr per 50 GB — ACTIVE** (migration `20270723385655` · owner 2026-07-11 · the opt-out from the 3-month full-res drop). The removal above still holds for Call-Time Escalator · Pro Website · both bundles (all `is_active=false` in the live catalog).

> ⚠ **(owner 2026-07-23 — Indoor Blueprint is NOT removed, it is FREE):** the paid ₱1,499 SKU is retired, but the **feature survives as a FREE capability delivered by the already-free 2D Plan** (the skeletal seat-plan blueprint — `Seat_Plan_2D3D_Alignment_Directive_2026-07-15.md`). The paid increment is the **3D Plan `SEATING_3D` ₱1,500** (owner 2026-07-23 · host-activation · interim ₱1,000 + ₱2,999 both retired · ✅ shipped to the live catalog 2026-08-02, migration `20271032178949`) — full 3D + animated walk-to-seat + on-site seat-finder + co-presence roaming. The `INDOOR_BLUEPRINT` catalog row stays `is_active=false`; ✅ the code fix SHIPPED (PR [#3593](https://github.com/iscasasola/setnayan-platform/pull/3593), auto-merge armed 2026-07-23) — free-ifies the card + studio + both guest surfaces, removing the ₱1,499 buy funnel. 3D Plan INTEGRATES Indoor Blueprint (one of four inputs). See DECISION_LOG 2026-07-23 + [`3D_Plan_Whats_Next_2026-07-23.md`](3D_Plan_Whats_Next_2026-07-23.md).

### 00.D ⚠ Live-site reversals (need marketing-copy PR + brand sign-off)

1. Setnayan AI free → ₱3,999 paid first-paywall — reverses "Free to plan · Start planning free."
2. Event Website free → ₱1,999.
3. RSVP free → ₱2,499 (Pro ₱4,499).

Together these gut the "free to plan / free wedding website" pillars; the free tier is browse + match-preview + 5 planning tools only.

> ⚠ **(code-sync 2026-07-19):** 2026-06-07 snapshot — SUPERSEDED by the shipped code: the base 4-in-1 website + unlimited RSVP are FREE again (the paid layer is Editorial PRO ₱2,999 · Cinematic Reveal ₱999 · Custom Subdomain ₱999/yr), and Setnayan AI is ₱1,499 (not ₱3,999). Lineage only.

### 00.E Site-sync deltas (PR scope · code/DB)

/admin `platform_retail_catalog_v2`: deactivate the 3 removed Live/In-build SKUs (Indoor Blueprint, High Res Archive, Call-Time Escalator); set à la carte + the 3 tiers; populate `saas_overhead_cost_php` (R2 COGS). Homepage Setnayan AI ₱1,499 → ₱3,999 (conflicts with /pricing). Event Website ₱1,500 → ₱1,999. Reword "Free to plan / free website." Mockup: `Pricing_Page_Mockup_2026-06-07.html`.

> **✅ SHIPPED 2026-06-13 — PR [#1335](https://github.com/iscasasola/setnayan-platform/pull/1335)** (copy + JSON-LD + llms.txt; DB catalogs were already canonical, no migration) + PR [#1336](https://github.com/iscasasola/setnayan-platform/pull/1336) (signed-in vendor-dashboard worked example). **Still open:** ① `saas_overhead_cost_php` population (admin/COGS); ② **RSVP SKU collision — OWNER CALL NEEDED:** prod DB has BOTH `RSVP_PRO_WEBSITE` "RSVP Pro" ₱4,499 AND `PRO_RSVP` "Pro RSVP" ₱1,999 active while base `RSVP_WEBSITE` ₱2,499 is inactive; § 00.B says RSVP ₱2,499 + Pro ₱4,499. ③ **Vendor-side prices in § 0.C / corpus CLAUDE.md were STALE** — DB + live site canon (DECISION_LOG 2026-06-09 reprice): **Pro ₱6,000/28d (₱60,000/yr) · Enterprise ₱10,000/28d (₱100,000/yr) · flat ₱100/token, packs ₱400–₱10,000**; not ₱2,499/₱5,499/₱1,000–₱18,000. *(code-sync 2026-07-19: ② is now DB-RESOLVED — `RSVP_PRO_WEBSITE`, `PRO_RSVP` AND `RSVP_WEBSITE` are ALL `is_active=false` in the live catalog; ③'s figures were themselves superseded — current vendor canon is § 00.0.)*

### 00.F Website-SKU collapse — NOW LIVE (live-site sync 2026-06-23)

> **(code-sync 2026-07-19):** in the live catalog `COUPLE_WEBSITE_PRO` is **deactivated** (no new sales · `20270712300000`); `EDITORIAL_PRO` ₱2,999 + `STD_PREMIUM_OPENINGS` ₱999 sell standalone; and `SEATING_3D` is **ACTIVE** at **₱1,500** (repriced from ₱2,999 by `20271032178949` on 2026-08-02) (the "inactive until the gate is wired" note below is stale — activated `20270710619774`). The unlock rows below are otherwise lineage.

The **2026-06-14 addendum** (single PRO website unlock) is **live on `/pricing`**. This supersedes the § 00.B treatment of the website/RSVP SKUs:

- **🔄 2026-07-04 owner reprice + new SKU (SUPERSEDES the ₱1,999 figures below) — Couple Website PRO ₱1,999 → ₱4,999 + new à-la-carte Editorial PRO ₱3,499.** Couple Website PRO is confirmed as the **UMBRELLA** that unlocks **all** pro website-lifecycle features across the four phases — **Save the Date · RSVP · On the day · Editorial**. New standalone **`EDITORIAL_PRO` ₱3,499** buys just the editorial-authoring perk (name the moments · tell each story · arrange the front page); a Couple Website PRO order **also confers** it AND **`STD_PREMIUM_OPENINGS`** (the Cinematic Reveal — owner same-day confirmation: "unlocks all pro features … Save the date, rsvp, event(on the day), editorial"; both stay purchasable à la carte), wired via `SKU_OWNERSHIP_ALIASES` in `lib/entitlements.ts` (since `COUPLE_WEBSITE_PRO` can't nest in `BUNDLE_CHILD_SKUS`). Applied live to `platform_retail_catalog_v2` + repo PR (migration `20270511151471`). ⚠ Note: this table stores prices as **whole PHP numeric** (`4999.00`, `3499.00`), NOT centavos. The ₱1,999 figures in the 2026-06-29 note below are now historical.
- **🔄 2026-06-29 owner reprice + remodel — Couple Website is now an à-la-carte unlock menu OR one "Unlock All" bundle.** Free tier keeps the **4-in-1 site (Save-the-Date · RSVP · Event · Editorial) + unlimited RSVP**. Premium is bought per-unlock or as **Couple Website PRO = "Unlock All" ₱1,999** (was ₱3,999) _(now ₱4,999 — see 2026-07-04 note above)_:
  - **Reveal** · cinematic STD openings — **₱999** (`STD_PREMIUM_OPENINGS`, **live**; ₱799→₱800→₱1,499→₱999, repriced DOWN to ₱999 at the 2026-07-10 finalization — live site + § 00 banner both ₱999)
  - STD video upload — ₱100 (`STD_VIDEO_UPLOAD`, inactive · unbuilt)
  - Photo gallery upload — ₱100 (`WEBSITE_GALLERY_UPLOAD`, inactive · unbuilt)
  - Waze / Google Map linking — ₱100 (`WEBSITE_MAP_LINKING`, inactive · unbuilt)
  - Themes (RSVP + Event + Editorial) — ₱1,000 (`WEBSITE_THEMES`, inactive · unbuilt)
  - **Editorial PRO = `EDITORIAL_PRO` ₱2,999** (à-la-carte editorial-authoring unlock · new 2026-07-04; repriced 2026-07-10 from ₱3,499; also conferred by Couple Website PRO)
  - **Unlock All = `COUPLE_WEBSITE_PRO` ₱4,999** (repriced 2026-07-04 from ₱1,999 · the umbrella across STD · RSVP · on-the-day · Editorial). _These are **website-only** unlocks._
- **🔌 The website is a HUB — auto-integrations (2026-06-29 owner; corrects the prior "3D inside PRO" line).** Features the couple owns **surface on the site automatically, free or paid** — they are **separate SKUs, NOT website unlocks**: **3D Plan** (renamed 2026-06-29 from "3D Seating" / "3D Seat Plan"; **FREE** = 2D seat plan + guest list + mood board; **PAID** unlocks the full 3D + the website seat-finder integration + **co-presence (see other accounts roaming the room)** — `SEATING_3D` **₱1,500** (owner 2026-07-23 · host-activation, one-time/event · ✅ **SHIPPED to the live catalog 2026-08-02** (migration `20271032178949`, PR #4033 — prod object-verified at ₱1,500, `one_time`, not pax-priced); lineage ₱999→₱2,499→₱2,999→interim ₱1,000→**₱1,500**; the ₱2,999 + interim ₱1,000 + the vendor-enabled couple discount all RETIRED), standalone SKU **OUTSIDE** Couple Website PRO — inactive until the `eventSkuActive('SEATING_3D')` gate is wired, since the 3D lab is on-for-everyone behind `NEXT_PUBLIC_SEATING_3D` today) · **Live Photo Wall** · **Live Streaming / Live Studio** · **Papic + Gallery** · **Pakanta** (backing song) · **Animated Monogram** (site chrome). Owning/buying the feature is what lights it up on the site; the website just gathers them.
- **Watermark policy change:** the "Powered by Setnayan" watermark is **never removed — it stays subtle for everyone** (free + paid). It is **no longer a paid perk** (supersedes the prior model where watermark-removal was PRO's only live perk).
- The old standalone SKUs (**RSVP ₱2,499 · RSVP Pro ₱4,499 · Event Website ₱1,999 · Editorial Website ₱7,999**) stay **retired/inactive** (DB lineage only).
- **⚠ Build gap:** of the website unlocks above, only **Reveal** is shipped. STD video / gallery / map / themes gating is **UNBUILT** — the à-la-carte rows are seeded **INACTIVE** in `platform_retail_catalog_v2` as build targets; do not activate until each gate ships. So ₱1,999 PRO has **no live functional perk yet beyond Reveal.** (Auto-integration rendering on the site is partly live — Papic gallery, Live Studio embed, monogram chrome — and partly unbuilt — 3D seat-finder, Live Photo Wall on-site.) See DECISION_LOG 2026-06-29.
- **§ 00.E note ② (RSVP SKU collision) — public surface RESOLVED:** RSVP is no longer a standalone public SKU. *Residual:* prod-DB rows (`RSVP_PRO_WEBSITE` ₱4,499 / `PRO_RSVP` ₱1,999 / inactive `RSVP_WEBSITE` ₱2,499) still want a cleanup pass so the catalog table matches the collapsed public model.
- *Residual copy-lag:* the Essentials bundle string on `/pricing` still lists "Pro RSVP + Event Website + Editorial Website" by their old names — a marketing-copy fix, not a catalog change.

> ⚠ **Owner sign-off flag:** this records a load-bearing SKU change (4 website/RSVP SKUs → 1 PRO unlock). It is **not a new decision** — it's the owner's 2026-06-14 addendum, now confirmed live on the site. Surfaced here per the corpus load-bearing-change rule.

### 00.G Open pricing questions (2026-07-17 owner sheet · re-framed 2026-07-19: each resolves by WRITING CODE — a migration/PR that changes the shipped catalog — never by editing this doc first)

1. **Editorial PRO** — ✅ **RESOLVED 2026-07-22 (owner): BUNDLE-ONLY via Website PRO ₱3,500.** Standalone `EDITORIAL_PRO` → `is_active=false`; the `editorial-pro` card retired; its buy surface upsells Website PRO. Shipped PR **#3564** (migration `20270915796315`). *Reaches prod on `supabase db push`.*
2. **Save-the-Date Cinematic Reveal** — ✅ **RESOLVED 2026-07-22 (owner): BUNDLE-ONLY via Website PRO ₱3,500.** `STD_PREMIUM_OPENINGS` → `is_active=false`; save-the-date surface upsells Website PRO. PR **#3564**.
3. **Live Background** — ✅ **RESOLVED 2026-07-22 (owner): BUNDLE-ONLY, folded into Monogram PRO ₱1,000.** `LIVE_BACKGROUND` → `is_active=false`; conferred via the `LIVE_BACKGROUND ← ANIMATED_MONOGRAM` alias; LED maker upsells Monogram PRO. PR **#3564**.
4. **Papic paid ladder** — ⏸ **DEFERRED to the separate Papic-pricing session (owner 2026-07-22 "papic ladder is on another session").** Canon = `0012_papic/Papic_Pricing_Lock_2026-07-20.md`; do not touch from the Suite/bundle work.
5. **Preserve High-Res Data** — ✅ **RESOLVED 2026-07-22 (owner): the 6-month preservation, folded into the Papic service (handled in the Papic session).** The standalone paid annual archive is retired — `HIGH_RES_ARCHIVE` deactivated by the Papic session (migration `20270908796702`).
6. **Hold as-is?** — ✅ **RESOLVED 2026-07-22 (owner):** Patiktok repriced ₱1,499 → **₱1,500/day**; **Photo Delivery is delivered ON Papic** (dropped from the free layer, not its own card); the free 4-in-1 website base + free RSVP HELD. Shipped PR **#3559** (migration `20270914120000`).
7. **Music Creator** — ✅ **RESOLVED 2026-07-22 (owner): RETIRED, folds into Pakanta ₱2,500.** The orphan card removed (its alias still 301s to Pakanta); Pakanta repriced ₱2,499 → **₱2,500**; the ~400-track `songs.ts` stays unused. Shipped PR **#3559**.
8. **Vendor subscription → BASE + ADD-ON restructure (owner-decided + ✅ SHIPPED 2026-07-22).** Canonical decision doc = `Vendor_Subscription_Ladder_2026-07-22.md` (twin doc `Vendor_Front_Desk_Chatbot_Build_Plan_2026-07-18.md` in sync). **Target:** base **Solo ₱1,000 · Pro ₱2,500 · Enterprise ₱8,000** (round; annual 10k/25k/80k) + stackable paid add-ons — **Vendor AI (= the AI Chatbot) FLAT +₱1,500/28d (paid, all tiers — inbox free / AI auto-answer paid / no free bot / no external-chatbot sync)** · **Unlimited 3D Plan +₱1,500/28d (Pro/Ent)** · **Photo Challenge +₱400/event (Pro/Ent, Papic-gated · vendor sponsors, guests free)** · **Deep Search ₱500/search (Pro/Ent 1 free/28-day cycle)**; **token packs RETIRED**; name/inbox never gated (sell prominence/reach, never existence). Fully-loaded: Pro ₱5,500/28d · Enterprise ₱11,000/28d · Solo+AI ₱2,500. *Code today (✅ ALL SHIPPED to `vendor_billing_catalog` + prod DB, 2026-07-22): base **Solo ₱1,000 / Pro ₱2,500 / Enterprise ₱8,000** (annuals 10k/25k/80k · #3513) · **Vendor AI ₱1,500/28d** add-on, free first cycle on activation+verification, paid+verified only (#3517 · SKU `vendor_ai_addon` · entitlement-gates the flag-dark `vendor-autoreply` assistant) · **Photo Challenge ₱400/event** Pro/Ent/Custom, Papic-gated (#3522 · SKU `vendor_photo_challenge` · owner picked charge-now + Pro/Ent/Custom over the same-day #3515's Solo+free-launch) · **Deep Search ₱500/search**, Pro/Ent/Custom 1 free/28-day cycle, Solo pays each (#3525 · SKU `vendor_deep_search`) · **3D Booth ₱1,500/28d** Pro/Ent/Custom, free first cycle (#3526 · SKU `vendor_3d_booth`) **+ vendor-enabled couple discount: SEATING_3D drops to ₱1,000** (from ₱2,999) when a booked vendor with an active 3D Booth add-on unlocks it — server-priced (resolvePaxPricedOrderCentavos), only-lowers, only-SEATING_3D, booked-only · **token packs RETIRED + inquiry-answering NOW FREE** (#3531 · `unlock_vendor_event` burn neutralised, all gates kept). Add-ons are apply-then-pay + intro=₱0 trials (recurring billing still UNBUILT). ⚠ **Master feature flags stay OFF** (`NEXT_PUBLIC_VENDOR_AUTOREPLY_V1` · `NEXT_PUBLIC_PAPIC_GAMES_V1`) — buying an add-on entitles that vendor, but the feature stays dark until the owner flips the flag (go-live = owner switch). ⚠ Photo Challenge fake-door CLOSED (Papic Games now gated by paid sponsorship). Follow-ups: couple SEATING_3D buy-surface, "1-token-to-answer" copy, tier-cap audit (in flight `claude/vendor-pricing-gapfixes`).* The couple-facing free front-desk chatbot stays FREE on every tier (it is **not** "Vendor AI").

Each answer ships as a catalog migration (or route/PR) FIRST; § 00 then mirrors the merge. (List sourced from `Whats_Next_Suite_AI_Pricing_2026-07-18.md` § 3.)

---

## 0. LIVE SITE CATALOG — authoritative as of 2026-06-04 (⚠ SUPERSEDED by § 00 above · 2026-06-07)

> Mirrors setnayan.com/pricing exactly. Each customer SKU carries a build state the site shows: **Live**, **In build**, or **Coming soon**. This section supersedes §§ 2–8 wherever they disagree.

### 0.A Couple-side software SKUs

| SKU | Price | Build state | What the site says |
|---|---|---|---|
| Animated Monogram | ₱999 (owner 2026-07-10, was ₱1,999) | **Live** | Bespoke Monogram with Animation |
| Custom QR per Guest | **FREE** 2026-06-29 (was ₱1,499/₱999) | **Live** | Now FREE (owner) — full per-guest QR personalization; `CUSTOM_QR_GUEST` → ₱0 active. Drives adoption. |
| Indoor Blueprint | **FREE** (owner 2026-07-23 · was ₱1,499) | **Free — via the 2D Plan** | **No longer a paid SKU and no longer "removed":** the indoor entrance→table blueprint is delivered by the **already-free 2D Plan** (skeletal seat-plan projection). The paid `INDOOR_BLUEPRINT` row stays `is_active=false` (never sold); the free 2D Plan IS the feature. ✅ CODE FIX SHIPPED (PR [#3593](https://github.com/iscasasola/setnayan-platform/pull/3593), auto-merge armed 2026-07-23) — free-ifies the card + studio + both guest surfaces, removing the ₱1,499 buy funnel flagged in `Sell_vs_Deliver_Gap_Audit_2026-07-21.md`. Paid increment = the **3D Plan** (`SEATING_3D`), which INTEGRATES Indoor Blueprint as one of its four inputs — **₱1,500** (owner 2026-07-23 · host-activation · interim ₱1,000 + ₱2,999 both retired · ✅ **SHIPPED to the live catalog 2026-08-02** (migration `20271032178949`, PR #4033 — prod object-verified at ₱1,500, `one_time`, not pax-priced), see [`3D_Plan_Whats_Next_2026-07-23.md`](3D_Plan_Whats_Next_2026-07-23.md)). |
| Setnayan AI | **₱1,499 one-time, per event** (owner FINAL 2026-07-12 · ✅ ON PROD — #3145 merged + migration `20270729889508` applied; live catalog ₱1,499 verified 2026-07-19) | **Live** | Assisted planning (the AI planner — replaces "Setnayan Concierge" naming) · `SETNAYAN_AI` = ₱1,499/`one_time` (#3145 merged · was ₱499 via PR #3022); ₱799/28d sub retired |
| Live Background | **₱499** | In build | **Repositioned 2026-06-29** (owner): self-serve — couple places a VIDEO or picks a BACKGROUND from the Setnayan template library for the venue screen. Was ₱2,499 "LED wall design + monogram" service (repriced down + simplified to resolve the Animated Monogram overlap). |
| Live Studio (formerly Panood) — single-cam livestream | **FREE** | Live #2219 | Couple goes live to their own YouTube, embedded free on the event page + auto-archive |
| Live Studio — Mobile controller | **₱1,500 / day** (was ₱1,299 · repriced 2026-07-20, PR #3425) | Foundation built · video pending | Online-only · ≤3 cams · 1 live output · switch/overlay/adjustable-split · YouTube via couple's OBS (repackaged 2026-07-08, was ₱3,499/day single tier) |
| Live Studio — Desktop controller | **₱2,500 / day** (was ₱2,499 · repriced 2026-07-20, PR #3425) | Foundation built · video pending | Offline-capable · ≤8 cams · ~5 live outputs · full 9-feature controller · YouTube via couple's OBS |
| Patiktok | **₱1,499 / day** | **Live** (KEPT — owner ruling 2026-07-13, reverses the 06-29 retire) | Live on `/pricing` at ₱1,499/day; the 06-29 "delete patiktok" retire is superseded by the 07-13 keep-live-and-paid ruling. |
| Camera Bridge (independent · `CAMERA_BRIDGE`) | ₱500 / day (flat, event-wide · round-up 2026-07-11, was ₱499) | ACTIVE | **Independent standalone DSLR-connect SKU** (owner 2026-07-08) — decoupled from Papic and Live Studio, works with either; unlocks DSLR / external cameras event-wide. Consolidates the old "Pro Camera Sync" ₱1,499 + per-feature bridge variants. A bridged DSLR used with Live Studio counts as one of that event's cameras. |
| Guest Stories (Papic Add-on) | ~~₱1,999~~ · ~~₱2,000~~ | **RETIRED — OFF SALE 2026-08-11 (owner)** | The 30-second story maker is **FREE to every guest** and always was in code: `lib/guest-stories.ts` carries no entitlement gate, and **nothing anywhere reads whether this add-on was bought** — so the ₱2,000 row sold nothing. Already retired for this exact reason by migration `20270328922621` ("Guest Stories is owner-locked FREE"), then reactivated as **collateral** of the blanket sweep in `20270710619774`, which flipped three codes in one statement (the other two — `SEATING_3D`, `PAPIC_ADDON_THANK_YOU` — are real paid products and STAY on). Off again via `20271132214645`. **Zero orders ever placed.** The feature is untouched; only the sale is gone. |
| Live Venue Photo Wall (`LIVE_WALL`) | **FREE** (was ₱2,500) | **Live** | **FREE FOR EVERY EVENT 2026-08-11 (owner: "live photo wall FREE").** Never bought by anyone at any price. Both halves are free: the venue projection AND the mirror on every guest's own phone during the celebration. ⚠ The catalog row is `is_active=false` ONLY so nothing quotes a price — the feature is switched ON for everyone by `FREE_FOR_ALL_SKUS` in `lib/entitlements.ts`. **Deactivating the row alone would have made the wall UNAVAILABLE, not free**, because every gate asks whether the event OWNS the SKU. Migration `20271136665973`. |
| Pabati (`PABATI`) | ~~₱1,299 / day~~ | 🗑 **RETIRED — REMOVED FROM THE PRODUCT 2026-08-23** | Owner 2026-08-21: *"we do not need pabati. retire it because it is part of papic."* ⚠ **This supersedes the free-ing made hours earlier the same afternoon** — free was the right answer to the question asked then; retire is the answer to the question asked after it. **It is GONE, not merely off sale:** the page, the API, the `pabati_clips` table and both RPCs are deleted (PR #4724 · migration `20271159146115`, verified in prod by the object). 🔑 **The capability survives the product** — the guest is still asked to leave a video greeting; it is a Papic clip challenge now. **0 greetings ever recorded · 0 orders ever.** ⚠ Both halves shipped together: the row stays deactivated AND the `FREE_FOR_ALL_SKUS` entry is removed — a free entry for a SKU nothing implements would switch on a feature that no longer exists. 🔒 The word stays RESERVED (immutable shop addresses; it is still a taxonomy leaf `SetnaProd` advertises). |
| Pakanta | ₱2,499 | Coming soon | Create a special song for the couple (single SKU — was 3 tiers) |
| Pakulay | ₱0 | Coming soon | Free mood board · palette + visual identity for every account |
| Thank You (Papic Add-on) | **₱2,499** | **Live** (KEPT — owner ruling 2026-07-13, reverses the 07-08 retire) | Live on `/pricing` at ₱2,499; the 07-08 retire is superseded by the 07-13 keep-live-and-paid ruling. |

### 0.B Bundles

> **🚫 ALL BUNDLES REMOVED 2026-06-29 (owner: "no more essentials and complete").** Both bundle tiers are cut — `GUIDED_PACK` ("Setnayan Essentials" ₱12,999) + `MEDIA_PACK` ("Setnayan Complete" ₱27,999) deactivated in `platform_package_catalog`. (The older "Guided Planner Suite ₱11,999 / Comprehensive Media Pack ₱16,999" names were already stale aliases of those same codes.) **The model has NO bundles:** Free → Setnayan AI (₱1,499 one-time — see § 00) → à-la-carte SKUs. `PAPIC_UNLOCK` ₱15,000/day is an à-la-carte Papic-day SKU, NOT a tier bundle — it stays active.

### 0.C Vendor-side (canonical = `/pricing`)

> **🔄 2026-06-29 owner reprice (supersedes the ₱6,000/₱10,000 "canon" in the § 0/§ 0.1 banners above + DECISION_LOG 2026-06-09):** Solo **₱999/28d · ₱9,999/yr** · Pro **₱2,499/28d · ₱24,999/yr** · Enterprise **₱7,999/28d** (⚠ raised to ₱7,999 at the 2026-07-10 finalization — the ₱4,999/₱49,999 below is the superseded 2026-06-29 figure; annual now **₱79,999/yr**, shipped `20270712300000` — code-sync 2026-07-19) · **Custom from ₱8,999** (the truly-unlimited tier, added post-snapshot — see § 00 banner). Aligns the vendor floor closer to the PH benchmark (Kasal.com) per the 2026-06-29 pricing audit. Applied to `vendor_billing_catalog`. 0% commission unchanged. **🖥 Display ordering (owner 2026-06-29): lead with the ANNUAL price, show the 28-day/monthly as the SECONDARY option** — the 28-day run-rate (×13.04 cycles/yr) sits at the top of each Kasal band, so the ~23% annual prepay is what makes the tier competitive; annual must be the hero. ⚠ **Live `/for-vendors` + `/pricing` vendor table still render monthly-first — code change pending (apps/web).**

| SKU | Price | Annual | Notes |
|---|---|---|---|
| **Solo Vendor** | **₱999 / 28 days** | **₱9,999 / yr** (~23%) | 1 category · 0 sub-seats · free vendor site · NEW canonical 2026-06-29 |
| Pro Vendor (28-day prepaid block) | **₱2,499 / 28 days** | **₱24,999 / yr** (~23%) | 3 categories · 3 sub-seats · free vendor site |
| Enterprise Vendor (28-day prepaid block) | **₱7,999 / 28 days** (2026-07-10 finalization · was ₱4,999) | ~~annual TBD~~ **₱79,999 / yr** (shipped `20270712300000` · code-sync 2026-07-19) | all categories · **BOUNDED: up to 10 team seats · 100 km reach** · ~~100 tokens~~ (free-token grant retired 2026-06-17) (Custom ₱8,999+ is the truly-unlimited tier above it) |
| Additional Branch (per branch) | ₱999 / 28 days | — | Enterprise only · apply-then-pay (0034) · BUILT 2026-06-05 (price ₱999 charm + Enterprise gate owner-locked 2026-06-05; supersedes the prior "Pro+ only") |

**Token packs — RETIRED 2026-08-07.** The vendor token currency is gone: no packs on sale, no bundle granted with a plan, no admin grant surface, no voucher that mints one. Owner lock 2026-07-21: *"token can retire, there should be nothing that needs token anymore."*

Prod never saw one bought or spent — 0 purchases, 0 redemptions. Five pilot vendors hold 500 granted tokens between them; those balances and their audit rows are **kept as history** and buy nothing.

**Answering a matched couple is FREE** on every tier, and has been since PR #3531 neutralised the burn. The vendor booking fee — 5% on the first ₱100,000 · 1% above · floor ₱50 · sourced clients only · first 5 free — is the vendor-side money, and it is still flag-dark. Derive the rate from `lib/booking-fee.ts`; never re-type it.

✅ **BOTH remaining token items CLOSED 2026-08-07** by the owner's ruling *"tokens are already retired"* (PR #4223). The Custom plan's "Included Token (per cycle)" axis is **gone from the code** — note that deactivating its catalog row would have changed NOTHING, because a hardcoded ₱100 fallback took over; the retirement had to happen at the source. Creator outreach is now **FREE** (it debited a reach token, and with packs retired the first Pro vendor to send would have been told to top up at a page that no longer exists). The catalog row is deliberately left as-is: with the code gone it prices nothing, and flipping a live SKU is owner territory.

### 0.D How money flows (per `/pricing`)

- **You → Setnayan:** software SKUs above, paid at 100% retail. PHP only · BIR receipts on every transaction.
- **You → Vendor (off-platform):** vendor packages settle directly with the vendor (bank / GCash / in person). Setnayan takes **0% commission**.
- **Vendor → Setnayan:** 28-day prepaid subscription for marketplace presence, plus the booking fee on sourced clients (flag-dark). Token top-ups are RETIRED 2026-08-07.

---

## 0.1 ~~UNRESOLVED~~ SITE-INTERNAL CONTRADICTIONS — ✅ RESOLVED 2026-06-23

> **✅ RESOLVED (live-site re-crawl 2026-06-23).** All five items below are **gone from the live site** — the 2026-06-09 vendor reprice + PRs #1335/#1336 unified every page. Current live state across `/`, `/pricing`, `/for-vendors`, `/how-it-works`: **Pro ₱6,000/28d · Enterprise ₱10,000/28d · 0% commission everywhere · verification free during launch · Setnayan AI ₱3,999** (no "Concierge", no ₱1,499 planner, no 5% commission, no ₱1,499 verification badge). The list below is retained as lineage of what *used* to contradict.

The live site disagreed with itself (snapshot 2026-06-04). `/pricing` was treated as canonical, and these have since been settled and single-sourced on the website:

1. **Vendor Pro price appears four different ways.** `/pricing` ₱2,499 / 28 days · homepage ₱1,999 / 28 days · `/for-vendors` ₱4,999 / **week** (founder ₱3,999/wk) · `/how-it-works` ₱499 / **week**. These are different *models*, not typos.
2. **Commission.** Homepage + `/pricing` say **0% commission**; `/for-vendors` says Setnayan Pay is a **flat 5.0%** on every booking. Mutually exclusive.
3. **Verification badge.** Homepage charges **₱1,499 lifetime + ₱499 refresh**; `/pricing` and `/for-vendors` say listing/verification is free. (The 100-token grant on approval was retired 2026-06-17; the whole currency followed 2026-08-07.)
4. **"Setnayan AI" vs "Setnayan Concierge."** The AI planner SKU is **Setnayan AI ₱1,499** (homepage, `/pricing`). But `/for-vendors` still advertises a free **"Setnayan Concierge"** worth **₱2,499** per booked couple. Same product two names + two prices, or two different things? Decide and unify.
5. **Enterprise** (₱5,499 / 28 days) and **Setnayan AI** (₱1,499) are consistent across pages — no action.

---

## 1. Pricing rules (locked)

- **Currency:** PHP only. Never quote USD.
- **Storage format:** centavos in `service_catalog` (e.g., ₱4,999 = 499,900 centavos).
- **Display format:** ₱ with comma separators (₱4,999 not ₱4999).
- **Charm pricing ladder** (locked 2026-05-08, refined 2026-05-12, B2B tiers charm-corrected 2026-05-17): ₱49, ₱99, ₱199, ₱499, ₱999, ₱1,499, ₱1,999, ₱2,499, ₱2,999, ₱4,999, ₱9,999, ₱19,999, ₱24,999. Higher tiers follow the same -1 pattern (₱49,999, ₱99,999, ₱249,999, ₱799,999 for B2B).
- **Apparatus pricing principle:** every SKU prices the tool / service / capability — never raw hardware, labor, or hours (except per-day / per-hour capacity units for time-bounded services like Panood).
- **Payment model (reconciled 2026-06-04):** customers pay **apply-then-pay direct in PHP** with manual admin reconciliation (BIR receipt on every software purchase). The iteration 0003 *customer* token wallet stays retired — couples never see a token balance. **The vendor-side token economy is RETIRED as of 2026-08-07** (owner lock 2026-07-21) — no packs, no bundles, no grant surface, nothing that spends one. There is no token anywhere in the product now, on either side. See § 0.C.
- **No-refund SKUs** are marked explicitly; refundable SKUs default to 14-day refund window unless otherwise stated.
- **2D billing model** (locked 2026-05-17): every `service_catalog` row carries `time_recurrence ∈ (one_time, weekly, quarterly, annual, lifetime)` × `event_scope ∈ (per_event, all_events)`. Lets per-event couple SKUs and annual-all-events vendor / organizer subscriptions live in the same table without enum collision. See [0034 Payments & Cart](0034_payments_and_cart/0034_payments_and_cart.md) service_catalog seed sections (h)–(p).
- **Cost Watch primitive** (locked 2026-05-17): every paid SKU consumption logs actual Setnayan-incurred cost + `cost_breakdown JSONB` to `service_render_costs`. Materialized view `service_catalog_cost_watch` exposes highest-render / avg / p95 / cost-to-price ratio + 🟢/🟡/🔴 health flag inline in the [0023 admin console § 3.5](0023_admin_console/0023_admin_console.md). Pricing decisions use "highest single render" as the floor.
- **Frequency-change two-admin approval** (locked 2026-05-17): post-launch changes to `time_recurrence` or `event_scope` require two-admin approval (same gate as mid-quarter price changes > ₱500). Existing active subscriptions keep their old frequency until natural expiry (cart-snapshot principle, locked 2026-05-12).

---

## 2. Core platform SKUs · couple-side

### 2.1 Papic — paparazzi capture

> **🔄 SUPERSEDED 2026-07-17 — Papic recut to GOOD / BETTER / BEST + display-vs-download storage. Canonical = [`0012_papic/Papic_Good_Better_Best_Pricing_2026-07-17.md`](0012_papic/Papic_Good_Better_Best_Pricing_2026-07-17.md).** Deltas vs the banners/rows below: capture ladder is now **Free 3 cams (was 5) → Papic Mini ₱30 (20 capture pts) → Papic Ltd ₱50 (70 pts) → Papic Unli ₱100 (unlimited pts)**, priced in a unified **CAPTURE-POINTS** currency (**1 photo = 1 pt · 1 five-second video = 3 pts**; reverses the old two-counter model) (per-tier daily caps **Mini ₱6,000 · Ltd ₱10,000 · Unli ₱15,000**, owner 2026-07-17, **WEDDINGS ONLY — other event types uncapped**; 1-cam min); **free full-res window 3 → 6 months**; **full-res is download-only** (per photo/event/account) while the site always shows the compressed copy; **cold tier = R2-IA now → B2 at scale**; **compressed gallery kept indefinitely** (only face-vectors expire ~5 yr); **ads rejected** as a funding idea. **Add-on model (owner 2026-07-17): Kwento · Pabati · Guest Stories are now FREE (included with Mini/Ltd/Unli) · Thank You ₱2,500 is the only paid Papic add-on · Live Photo Wall HIDDEN · Unlock-all bundle + Keep Full-Res both RETIRED · Papic Lite = zero add-ons.** Rows/banners below kept for lineage.
>
> **⚠ 2026-07-11 (LATER) owner-set CAPTURE caps — raised again: Papic Unli ₱15,000/day · Papic Ltd ₱9,000/day** (supersede the ₱11,999 / ₱5,999 set earlier the same day). Unli ₱15,000 binds at 150 cams; Ltd ₱9,000 at 300 cams. **⚠ FAIRNESS NOTE (surfaced, owner-accepted):** ₱15,000 Unli = **~2.4× competitor Once (₱6,160)** — the exact multiple both Papic councils flagged as breaking the locked "fair price, not premium-everywhere" promise. The owner overrode that for margin. (Storage is not a countervailing concern: full-res rides the couple's own Drive, and after 3 months we keep only the small compressed web copy — no storage governor, see the retired-governor note below.) **🚨 UNLOCK-ALL COLLISION (needs owner reconciliation):** the capture caps now EQUAL the "Unlock all of Papic" bundle (₱15,000 Unli / ₱9,000 Ltd), so the unlock — which adds Photo Wall + Camera Bridge — is now priced at the SAME level as capture-alone → it's effectively a **~₱3,000 discount bundle** (capture cap ₱15,000 + Wall ₱2,500 + Bridge ₱500 = ₱18,000 à-la-carte vs ₱15,000 unlock), no longer the "at-list convenience bundle" it was designed as. See the Unlock-all row below — owner must choose: keep it as a discount, reprice up to ₱18,000/₱12,000 (= capture-cap + add-ons), or retire the separate unlock. **🔑 SCOPE unchanged:** caps bound per-camera CAPTURE only; add-ons (Photo Wall ₱2,500, Camera Bridge ₱500) bill ON TOP. So a maxed Unli event = ₱15,000 capture **+** add-ons à-la-carte. Ltd = **30 photos + 10×5s**. _(Lineage: flat ₱15,000 → split ₱11,999/₱5,999 → now ₱15,000/₱9,000, all 2026-07-11.)_ Add-ons are now per-camera(≈guest) rates scaling to a daily cap with a min floor: **Stories ₱20/cam·day** (min ₱200 / max ₱2,000) · **Kwento ₱5/cam·day** (min ₱50 / max ₱500) · **Pabati ₱500/day** · **Photo Wall ₱1,000/day**; Pabati + Kwento + Photo Wall sit **under Papic**. Needs catalog per-guest/floor/cap fields (flat-only today). See DECISION_LOG 2026-06-29 + `0012_papic.md`.
>
> **🔑 THE CORE INVARIANT (owner-clarified 2026-07-11) — the couple's Google Drive full-res is NEVER downgraded, compressed, or deleted by us. It is THEIR storage, THEIR pristine originals, forever.** All compression / AVIF / the 3-month auto-compress apply ONLY to **our own R2 web copy**, never to the Drive. Two separate things: **full-res originals → the couple's Google Drive(s), untouched**; **the gallery web copy → our R2, born-AVIF + tiered.** **Overflow: up to 2 Google Drives per event** — if Drive #1 fills mid-event, the couple connects a second Drive for the overflow, so full-res always has somewhere to land (supersedes "one host Drive"; also softens the "heavy Unli → Google One" note — a 2nd free 15 GB Drive is an alternative to paying for Google One). _(⚠ "dropping originals" phrasing anywhere below/earlier is WRONG — the only full-res we ever drop is OUR transient hot copy after 3 months; the couple's Drive originals are never ours to touch.)_
>
> **🔄 2026-07-17 UPDATE — supersedes the storage/window specifics in the banners below (canonical: [`0012_papic/Papic_Good_Better_Best_Pricing_2026-07-17.md`](0012_papic/Papic_Good_Better_Best_Pricing_2026-07-17.md)):** (1) **free full-res window 3 → 6 months.** (2) **Display-vs-download split** — the site only ever loads the **compressed AVIF** (fast on venue wifi); **full-res is download-only**: per photo (instant presigned R2 URL, free egress) · per event (ZIP background job **or** Google Drive sync) · per account (bulk export = also the RA 10173 data export). (3) **Cold tier for Keep Full-Res = R2-IA now → Backblaze B2 once the cold pile hits ~tens of TB** (B2 = S3-compatible + free egress via the Cloudflare Bandwidth Alliance; **not** Hetzner — EU-only residency + not S3). (4) **Compressed gallery kept INDEFINITELY** (no year-5 purge); only **per-event face-recognition vectors expire at ~5 yr** (RA 10173 minimisation). (5) **Ads considered + REJECTED** for funding old data (old galleries ≈ zero traffic → ~₱0 yield; brand cost; AdSense already retired 2026-05-19) — storage is ~₱2/album, funded by anniversary re-engagement + vendor subs.
>
> **🔄 SUPERSEDED 2026-08-02 (owner: "6 month.") — the full-res window is SIX MONTHS, not three.** Everything else in the model below stands unchanged: one compression (AVIF, born at capture), then the ~8% web copy kept on the couple's website **forever, never deleted**, and the couple's own Drive full-res permanent and untouched throughout. ⚠ **This DOUBLES the hot-R2 window per event**, so the longevity-ladder worked case below (₱408/yr on a 40 GB outlier → ~8.6 yr) is computed on the retired 3-month figure and needs recomputing before it is quoted anywhere. ⚠ Not built in code — no retention/compression job exists on `origin/main`, so this is a spec change with no migration. Prior text kept below for lineage.
>
> **📦 Retention & storage model (owner-locked 2026-07-10):** every Papic album keeps **full-res free for the first 3 months** (review / download / render reels / Drive sync). _(This 3-month window is about OUR R2 hot copy — see the invariant above; the couple's Drive full-res is permanent regardless.)_ After 3 months, two paths: **(a) free forever** — auto-compresses to the ~8%-of-original web copy, kept on the couple's website **forever, never deleted** (served from standard R2, egress-free; ~₱2/mo·album, covered by the one-time Papic fee for ~125 yr — never a money-loser); **(b) Keep Full-Res** — **₱999/yr per 50 GB block** (rounded up) keeps every original at full quality, undegraded, on us. Full-res originals also stream to the couple's **own Google Drive** during the event (their free DIY archive); **Keep Full-Res is charged ONLY when full-res lives on OUR storage — a Drive-synced couple pays ₱0** (their originals are on Google's dime). **⚠ This shortens the previously-locked "keep originals free for 5 years" rule → free full-res is now 3 months** (we never *delete* — the web copy honors the "lives on your website forever" promise; only the free full-res window shrinks). **Margin reality (owner-corrected 2026-07-10):** the ₱999/50GB clears a real ~₱200/block only because it's **WEB-SOLD** (dodges the 30% Apple/Google IAP cut — it's a renewal, never an in-app buy) and **archived to DEEP-COLD storage** (B2/Hetzner/Glacier-class, retrieval-on-request, ~₱3–4/GB·yr — NOT hot R2). After the ~50% opex load and the ~6% web tax+processing, that leaves ~₱200/50GB block. The live web-copy gallery stays instant on standard R2; only the paid full-res archive is deep-cold (couple "requests" originals → ready in hours). Anti-abuse fence: **Papic Unli fair-use ceiling = ~50 GB/camera·day** (owner-set 2026-07-10, up from the interim 15 GB — 15 GB was too low, would throttle a genuine all-day heavy Unli rig; 50 GB is invisible to any hand-shooter but still stops a runaway/abuse rig · note 50 GB > a free 15 GB Drive → heavy Unli implies Google One) + a **~300 GB/event admin-review alarm** (flag, not a wall). **Storage-tail note:** a camera that actually maxes 50 GB has a free-web-copy lifetime cost (~₱500) above its ₱100 — NOT self-funding per-camera at the ceiling, but covered by (a) full-res→couple's Drive so we carry only the 8% web copy, (b) the longevity ladder, (c) the blended event (light cameras dominate). Base pricing is set on the *typical* camera (~₱7 lifetime storage / Unli · ~₱2 / Ltd), covered ~14–15× by ₱100/₱30.
>
> **🚫 40 GB "Drive-only" storage governor — RETIRED 2026-07-11 (owner: "we do not host 40gb. we just automatically compress after 3 months").** The storage-tail council had proposed a soft 40 GB/event web-copy ceiling with a Drive-only-beyond valve as insurance against a fictional huge event. Owner scrapped it as over-engineering: **there is no 40 GB hosting ceiling and no Drive-only-beyond mechanism.** The storage model is simply **3 months full-res → auto-compress to the AVIF web copy** (= the 3-month full-res drop, BUILT PR #3110). Compression is the bound: after 3 months we keep only the small ~8% web copy (~₱2/mo·album, covered by the one-time fee for ~125 yr), and full-res lives in the couple's own Drive (₱0 to us) — so the "capped revenue + unbounded storage" concern is resolved by *compression + Drive*, not a governor. The council's whole ceiling/Drive-only-beyond apparatus is superseded; the telemetry readout (#3104) still usefully measures the real web-copy ratio, just no longer to "lock a ceiling." Keep Full-Res (₱999/yr/50GB) remains the opt-out for couples who want us to keep full-res past 3 months.
>
> **♾️ Forever-web-copy longevity ladder (owner-locked 2026-07-10) — makes the free copy last a lifetime on the one-time fee.** Worked case: a ₱10k event nets ~₱3,500 "keep" money (after 30%-equiv + 50% opex); a big outlier album's 40 GB web copy on hot R2 = ₱408/yr → only ~8.6 yr. Fix = **compression × colder storage**. **🔧 SIMPLIFIED 2026-07-11 (owner "so we only do 1 compression") — the web copy is now born AVIF at CAPTURE (single pass), NOT JPEG-now + AVIF-re-encode-at-1-year.** So the "re-encode at 1 year" step is RETIRED and the 1-yr re-encode cron is deleted. **TRULY-INVISIBLE DEFAULTS (even on pinch-zoom):** **(1)** the web-copy derivatives are encoded **AVIF at FULL web-resolution at capture** (display q60 ≈ JPEG q80 to the eye, thumb q50) — one lossy pass straight from the full-res original, so *better* quality-per-byte than the old JPEG→AVIF double-compression, and the ~2× (measured ~4× on photo-like content) saving lands immediately (**SHIPPED + confirmed in main** PR #3082 — the AVIF re-land after #3063 merged telemetry-only; `toAvif` in `papic-derivatives.ts`); **(2)** cold-tier to R2 IA / deep-cold at ~1 yr, gated on gallery inactivity (avoids per-view retrieval cost on still-active galleries). Born-AVIF + cold-tier → a normal 2–3 GB album = **centuries**; even a 40 GB outlier clears **~45 years** on the one-time fee. **VISIBLE-ON-ZOOM RESERVES (NOT default — only if a monster album outlives ~45 yr):** **(3)** resolution step-down (e.g. →1440px long-edge) — ⚠ sharp at fit-to-screen but **softens on pinch-zoom and on QHD-phone portraits** (the earlier "invisible on a phone" claim was wrong — corrected 2026-07-10); **(4)** thumbnail-grade + fetch-original-on-request. Both reserves are held back to protect the "lives here beautifully forever" promise; prefer nudging a monster-album couple to Keep Full-Res over degrading resolution. See DECISION_LOG 2026-07-10 + `0012_papic.md`.

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| **Papic Mini** (**20 capture points** · good) | **₱30 / camera·day** | per-cam | ACTIVE · NEW 2026-07-17 · "add a shooter" entry (was Ltd's old ₱30 point) · **event cap ₱6,000/day (WEDDINGS ONLY · other types uncapped)** (binds ~200 cams @ ₱30) | [0012_papic.md](0012_papic/0012_papic.md) |
| **Papic Ltd** (**70 capture points** · better) | **₱50 / camera·day** | per-cam | ACTIVE · per-camera · **1-cam min** · **event cap ₱10,000/day (WEDDINGS ONLY · other types uncapped)** (binds ~200 cams @ ₱50) · repriced 2026-07-17 | [0012_papic.md](0012_papic/0012_papic.md) |
| **Papic Unli** (unlimited · full-res Drive archive) | **₱100 / camera·day** | per-cam | ACTIVE · per-camera · **event cap ₱15,000/day (WEDDINGS ONLY · other types uncapped, owner 2026-07-17)** (binds at 150 cams · ~2.4× Once — councils flagged, owner-accepted) | [0012_papic.md](0012_papic/0012_papic.md) |
| Guest Stories (Papic add-on) | **FREE** — included with Mini/Ltd/Unli | 0 | **NOW FREE 2026-07-17 (owner)** — reverses the 07-13 keep-paid ₱2,000. Bundled into the paid capture tiers to make each camera worth more. **NOT on Papic Lite** (Lite has no reels). | [0012_papic.md](0012_papic/0012_papic.md) |
| Kwento (words-on-photo · Papic add-on) | **FREE** — included with Mini/Ltd/Unli | 0 | **NOW FREE 2026-07-17 (owner)** — reverses the 07-13 keep-paid ₱299. **NOT on Papic Lite.** | [0012_papic.md](0012_papic/0012_papic.md) |
| Thank You (Papic Add-on) · ~~Auto-Recap~~ | **₱2,500** (Thank You · was ₱2,499) | 250,000 | **Live & PAID — Mini/Ltd/Unli only** (owner 2026-07-17). The ONE Papic add-on that stays paid — a premium 5-min film. Auto-Recap stays RETIRED 07-08. **NOT on Lite.** | [0012_papic.md](0012_papic/0012_papic.md) |
| Pabati (video guestbook · under Papic) | **FREE** — included with Mini/Ltd/Unli | 0 | **NOW FREE 2026-07-17 (owner)** — reverses the 07-13 keep-paid ₱1,299/day. **NOT on Papic Lite.** | [0012_papic.md](0012_papic/0012_papic.md) |
| Live Photo Wall (`LIVE_WALL`) | ~~₱2,500/day~~ | — | **SUPERSEDED 2026-08-11 — the wall is now FREE FOR EVERY EVENT (owner: "live photo wall FREE").** The 2026-07-17 hide instruction below never reached the code — the SKU stayed `is_active=true` and on the public price list for three weeks — and is now moot: it is neither hidden nor sold. _(Original: **HIDDEN — do not surface yet 2026-07-17 (owner** "hide and do not use this addon yet"**).**)_ SKU exists but must NOT appear in setup or catalog. _(When revived: a strong Papic Lite attach — a crowd venue-screen collage.)_ | [0012_papic.md](0012_papic/0012_papic.md) |
| Camera Bridge (independent · `CAMERA_BRIDGE`) | **₱500 / day** (flat · event-wide DSLR unlock) | 50,000 | ACTIVE · **round-up 2026-07-11 (was ₱499)** · repriced 2026-07-08 from ₱1,299/day (earlier ₱100/seat·day) · **now independent of Papic + Live Studio** (owner 2026-07-08) | [0012_papic.md](0012_papic/0012_papic.md) |
| Papic Free tier (owner 2026-06-29 · allowance 2026-07-10 · cameras 5→3 + capture-points 2026-07-17) | **Gallery view + camera filters + first 3 cameras free** (**20 capture points** each · face-sort + reels ON) | 0 | ACTIVE | [0012_papic.md](0012_papic/0012_papic.md) |
| Premium Guest Camera Pack · Personal Album · Memory Book · Per Template | (see `0012_papic.md`) | — | **V1.5+ DEFERRED** | [0012_papic.md](0012_papic/0012_papic.md) |

> **Note on V1.5+ deferred SKUs in Papic:** seat SKUs + camera add-on + Cam Bridge tiers + per-template ship in V1. The 4 deferred SKUs (Credits, Premium Guest Camera Pack, Personal Album, Memory Book) reactivate in V1.5+ — they're documented here for spec continuity, not as bookable items at launch.

#### 2.1a Papic Lite — open photo pool (photos-only · no gate)

> **Owner-locked 2026-07-17 (renamed from "Papic Open"; council-navigated · NOT YET BUILT).** Full design + council/red-team: [`0012_papic/Papic_Open_Council_Verdict_2026-07-17.md`](0012_papic/Papic_Open_Council_Verdict_2026-07-17.md). **PHOTOS ONLY — NO VIDEO** (owner 2026-07-17: drops crowd video for simplicity → no transcode/compute load; 1 photo = 1 point, so sold in plain photos). **NO size/type gate · unlimited guests · FEATURE-LOSS is the sole firewall** (no guest count / face tag / face block / Kwento / reels / personal galleries — just accumulated High-Efficiency photos → not a wedding product; owner accepted the residual cannibalization risk). **Event types (corrected 2026-07-17):** Lite's natural home is **`simple_event`** — already specced as `marketplace_enabled=false`, Papic + Live Stream only, no custom QR, **unlimited guest capture**, ₱0 AI (i.e. Lite *is* the Papic for Simple Events). Also fits **`corporate` · `tournament` · `celebration` · `reunion`**. Life-milestone types (`wedding` · `debut` · `christening` · `birthday` · `gender_reveal` · `anniversary`) use the premium per-camera tiers. **NB: "concert / festival / coliseum" are USE CASES, not event types — no such type exists; they're created as `simple_event`** (owner-locked: *reuse travel/simple_event, don't proliferate*; `event_type_vocab` is admin-editable at `/admin/event-types` if a real UX divergence ever justifies one). **Single shared pool:** anyone who scans the event QR shoots into it, each keeps their own shots, the host **accumulates/collects everything**. **Quality: HIGH-EFFICIENCY ONLY** (~2560px, ~0.4 MB/photo · screen/social/crowd grade · NOT high-res). **Pool ends at photos-exhausted OR day-end → service COMPLETE** (top-up to continue; else capture stops). **Storage: R2 while the gallery is hot/served** (free egress + CDN) → **tiers to R2-IA → Backblaze B2 at aggregate scale** for the 5-yr retention (B2 is cheaper per-GB but only wins once data is COLD; for served galleries R2's free egress wins — do NOT put live galleries on B2). Host may optionally Drive-sync at their own cost. **Concurrency cap:** optional host-set max concurrent shooters; **fair-use:** silent per-participant sub-cap so one shooter can't drain the pool. **Activation:** free capture-now preview + instant-pay rail. **Guardrails (pre-ship):** host moderation/takedown · NSFW non-disableable + CSAM hash · bystander consent gate at QR-join + public takedown path (RA 10173, no face-search) · email/magic-link join claim (ownership + Sybil).
>
| Papic Lite — photo pool | Price | ₱/photo |
|---|---|---|
| **200 photos** | **₱100** | ₱0.50 |
| **1,250 photos** | **₱500** | ₱0.40 |
| **3,000 photos** | **₱1,000** | ₱0.33 |
| **25,000 photos** | **₱5,000** | ₱0.20 |
| **100,000 photos** | **₱15,000** | ₱0.15 |
| **Top-up** | **+₱7,500 / +50,000 photos** | ₱0.15 |
| **Enterprise** | custom quote (two-admin gate) | — |

> Smooth volume-discount curve (₱0.50 → ₱0.15/photo), unlimited guests, accumulated photos. Storage trivial: 100k High-Eff ≈ 40 GB ≈ ₱1,400/5yr (~91% margin); the ₱100/200-photo entry ≈ 80 MB (~₱3, ~97% margin). Reuses the shipped byte-accounting (`papic-storage-telemetry.ts` #3063) + event-scoped tokens; **disables the face AND video pipelines**; NEW build = photo-metered billing, host moderation tool, join consent + claim, optional concurrency cap, per-participant fair-use sub-cap, Enterprise quote path.

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
| **Mobile Controller** (online-only · ≤3 cams · 1 live output · switch/overlay/adjustable-split · YouTube via couple's OBS) | **₱1,299 / day** | 129,900 | foundation built · video pending | [Live_Studio_Repackaging_2026-07-08.md](Live_Studio_Repackaging_2026-07-08.md) |
| **Desktop Controller** (offline-capable · ≤8 cams · ~5 live outputs · full controller · YouTube via couple's OBS) | **₱2,499 / day** | 249,900 | foundation built · video pending | [Live_Studio_Repackaging_2026-07-08.md](Live_Studio_Repackaging_2026-07-08.md) |
| Annual Streaming — **Desktop tier** (unlimited days, all events on account · pro/coordinator/venue-oriented; couples cheaper à-la-carte per-day) | ₱19,999 / year | 1,999,900 | ACTIVE · re-based to Desktop tier 2026-07-08 | [Live_Studio_Repackaging_2026-07-08.md](Live_Studio_Repackaging_2026-07-08.md) |
| Camera Bridge (independent DSLR SKU — used with the control room) | **₱500 / day flat** (`CAMERA_BRIDGE` · independent of Papic + Live Studio) | 50,000 | **round-up 2026-07-11 (was ₱499)** · repriced + made independent 2026-07-08 (was "included free" 2026-06-26; DSLR counts as one camera) | [Live_Studio_Repackaging_2026-07-08.md](Live_Studio_Repackaging_2026-07-08.md) |
| Template Pack — per event-day | ₱799 | 79,900 | ACTIVE | [0011_panood.md:63](0011_panood/0011_panood.md) |
| Template Pack — annual (all events) | ₱7,999 / year | 799,900 | ACTIVE | [0011_panood.md:63](0011_panood/0011_panood.md) |
| Broadcast Style Pack (News / Cinematic / Sports / Royalty + transitions, event-wide) | ₱2,999 | 299,900 | ACTIVE | [0011_panood.md:523](0011_panood/0011_panood.md) |
| AI Video Highlight (60-second auto-edit) | ₱1,999 / render | 199,900 | ACTIVE — multi-purchase | [0011_panood.md:98](0011_panood/0011_panood.md) |
| AI Edited Highlight (3-minute auto-edit, repriced 2026-05-16 from ₱4,999) | ₱3,499 / render | 349,900 | ACTIVE — multi-purchase | [0011_panood.md:98](0011_panood/0011_panood.md) |

### 2.3 Patiktok — guest reel builder (iteration 0017) — ✅ KEPT LIVE (owner ruling 2026-07-13; reverses the 06-29 retire)

> **⚠ SUPERSEDED 2026-07-13 — Patiktok is KEPT LIVE & PAID at ₱1,499/day** (owner "leave them live & paid"; renders on `/pricing`). The 2026-06-29 "remove patiktok / delete all data" retire is reversed. The detailed iteration-0017 sub-SKU rows below are PRE-RETIRE lineage (the live offering is a single ₱1,499/day SKU). ⚠ **ACTIVATION TO VERIFY:** if `PATIKTOK_COMPILER` is still `is_active=false` from the 06-29 deactivation, it needs re-activation in `platform_retail_catalog_v2` to be truly purchasable (the /pricing render alone doesn't prove the catalog row is active — couldn't confirm without DB read access). Same caveat for Thank You. See DECISION_LOG 2026-07-13.

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
