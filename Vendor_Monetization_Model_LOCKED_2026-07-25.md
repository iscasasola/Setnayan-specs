# Setnayan Vendor Monetization Model — LOCKED (owner, 2026-07-25)

**Status:** APPROVED — "we are good, let's start building this." This is the canonical spec for the vendor monetization build. Design rationale + market evidence in `Vendor_Sync_Fee_Deep_Analysis_2026-07-24.md`; fee-seam lineage in `Option_A_One_Lock_Handoff_2026-07-24.md`.

## Philosophy
**Monetize ACCESS + GROWTH, not the vendor's deals.** Subscription-first; the sourced-lead fee is the *smallest, narrowest* stream. Evidence: HoneyBook (SaaS, zero commission on the vendor's own clients), OpenTable (charge only platform-*sourced* diners; the restaurant's own diners are free), The Knot/WeddingWire (vendors pay for leads/visibility, never a booking cut). No precedent anywhere for a % on a vendor's self-sourced deal.

## Three revenue streams
1. **Subscriptions** — the engine (recurring, predictable).
2. **Premium feature add-ons** — à la carte, cheaper for higher tiers.
3. **Sourced-lead finder's fee** — only when Setnayan sourced the client. The smallest stream.

---

## 1. Subscription tiers + capability matrix
Prices billed per 28-day cycle (platform standard; ⚠ confirm 28d vs calendar month at build).

> 🔁 **OWNER PRICE SHEET, 2026-08-27 — migration `20271171000513`.** Enterprise 28-day **₱8,000 → ₱10,000**. Annuals: Solo **₱10,000 → ₱10,400** · Pro **₱25,000 → ₱26,000** · Enterprise **₱80,000 → ₱104,000**. Additional Branch **₱999 → ₱1,000**; 3D Booth **₱1,500 → ₱2,500**. Every annual figure is exactly `28-day × 10.4` — thirteen periods with 20% off — **recorded as an observation, never encoded**; a stored second copy of a pricing rule is how prices drift, and he must stay free to break it on any one row.
>
> 🔴 **THE CUSTOM TIER IS RETIRED. ENTERPRISE IS NOW THE TOP PURCHASABLE TIER.** All six `vendor_custom_*` catalogue rows are `is_active=false`; anyone above Enterprise's caps is handled **by hand, off-platform**. `vendor_tier_rank()` and the `vendor_tier_state` enum are deliberately untouched — retiring what can be BOUGHT was the ruling, deleting the tier is not. Verified against production first: **zero** vendors on custom (two profiles, both `solo`), so no rank can move. ⚠ **The flag alone does NOT close the Custom door** — `lib/vendor-custom-catalog.ts` falls back to hardcoded literals for a missing row and the configurator is still linked from the subscription page; closing it means deleting the axes from `CUSTOM_SKU_CODES` + `CUSTOM_UNIT_PRICE_FALLBACK`. Reported, not silently half-built.
>
> ⚠ **AND FOUR ANNUAL ADD-ON PRICES ON THAT SHEET WERE NOT CREATED** (branch ₱10,400 · seat ₱2,600 · Vendor AI ₱15,600 · 3D Booth ₱26,000). The billing machinery cannot charge or honour an annual add-on: every add-on term is a hardcoded 28 days, each price reader selects one literal `sku_code`, and the only function that turns `subscription_annual` into a 365-day term maps sku→tier by `LIKE 'solo|pro|enterprise_vendor_%'` and raises `UNMAPPED_SKU_TIER` for anything else. A priced row nothing can fulfil takes the money and grants nothing.

| | **Free** | **Solo** ₱1,000 | **Pro** ₱2,500 | **Enterprise** ₱10,000 |
|---|:---:|:---:|:---:|:---:|
| **— RUN —** | | | | |
| Verified badge · BYO/returning clients | ✓ | ✓ | ✓ | ✓ |
| Budget · guest list · schedule · **inbox & chat** (never gated¹) | ✓ | ✓ | ✓ | ✓ |
| Reviews + stats | ✓ | ✓ | ✓ | ✓ |
| Concurrent active bookings | **3** | unlimited | unlimited | unlimited |
| Live candidates you may pursue **per date** (whitelist — accepted, not yet locked) | **1** | **3** | **5** | **10** |
| Couples you may hold on a **waitlist** for a date you're booked out on | **—** | **1** | **3** | **5** |
| **— GROW —** | | | | |
| Organic rank (by merit) | ✓ | ✓ | ✓ | ✓ |
| Search boost + Featured slots | — | small | bigger | **top** |
| Sourced-lead priority | last | standard | priority | **first pick** |
| SEO / GEO / AEO external visibility (bundled, not an add-on) | Basic | Enhanced | Enhanced + AEO | **Priority + AEO** |
| Market intel (Demand Radar + price-position) | — | — | ✓ | ✓ |
| Vendor favorites · Editorial features | — | favorites | ✓ | ✓ |
| **— SCALE —** | | | | |
| Team seats | 1 | 1 | 3 | **10** |
| Roles (Agent/Financial/Secretary) + agent scheduling | — | — | ✓ | ✓ |
| Service categories | 1 | 1 | 3 | **unlimited** |
| Reach — Ring 2 outer cap | ~30 km | ~30 km | ~60 km | **100 km** |
| API access | — | — | — | ✓ |

> ¹ **The inbox stays ungated (2026-07-24) — the per-date whitelist is a different limit.**
> Any vendor on any plan can receive and answer inquiries, with no weekly cap. What the
> whitelist row bounds is how many *accepted-but-not-yet-locked* clients they may be
> pursuing **for one date at a time**; they answer freely on every other date, and free a
> slot by locking someone in or declining them (§ T1.4 decline-the-others-first).
> ⚠ At Free = 1 this does mean the *second* couple asking about the *same* date cannot be
> accepted until one is dropped. Owner-set 2026-08-09; shipped SWITCHED OFF
> (`platform_settings.vendor_tier_pipeline_caps_enabled`) because every prod vendor is on
> Free today. Numbers live in `lib/vendor-tier-caps.ts` + `vendor_tier_limit()`, held in
> step by a test — never re-typed from this table.

## 2. Add-on pricing (subscribers pay less)

| Add-on | Free / Solo | Pro / Enterprise |
|---|:---:|:---:|
| Papic Challenge (per event) | ₱500 | ₱400 |
| 3D Plan Ads (/28d) | ₱2,000 | ₱1,500 |
| AI Chatbot — Basic (/28d) | ₱2,000 | ₱1,500 |
| AI Chatbot — Advanced (/28d) | ₱3,000 | ₱2,500 |
| Deep Search — About You | ₱1,000 | ₱500 |
| Deep Search — Market Scan | ₱2,000 | ₱1,500 |

**Principle:** bundling an add-on "free" into a tier is not free — it must be priced into that tier's sub. Nothing is currently bundled free, so subs stay ₱1,000/₱2,500/**₱10,000** (Enterprise repriced 2026-08-27).

> 🪤 **A CONFLICT WORTH NAMING, 2026-08-27.** The owner set the **3D Booth / Virtual Booth catalogue price to ₱2,500**, but the "3D Plan Ads" row in the matrix above is the same product's TIERED price (₱2,000 entry / ₱1,500 growth) and it lives in code, not the catalogue. Today the tiered matrix is **inert** — `NEXT_PUBLIC_VENDOR_ADDON_TIERED_PRICING` defaults OFF, so checkout charges the flat catalogue price and ₱2,500 is what a vendor pays. **If that flag is ever flipped, the booth silently reverts to ₱2,000/₱1,500 and the owner's ₱2,500 is ignored.** Not changed here — he ruled on the catalogue price, not on the tiered matrix — but the two must be reconciled before that flag goes on.

## 3. Sourced-lead finder's fee
- **Applies ONLY to clients Setnayan sourced** (client discovered the vendor through the marketplace). BYO / vendor-invited / returning = **free**.
- **Rate:** **5% on the first ₱100,000 of a booking, then 1% on the amount above.** Applies to the **first booking AND every repeat** of a sourced client with that vendor.
  - ₱60k → ₱3,000 · ₱300k → ₱7,000 · ₱1M → ₱14,000 · ₱10M → ₱104,000.
- **Deals above ~₱3–5M → Enterprise, then hand-priced off-platform,** not the automatic formula. _(This line said "Enterprise/Custom"; the Custom TIER was retired 2026-08-27 and "hand-priced" is now literal — there is no priced ladder above Enterprise.)_
- **Attribution — the anti-gaming core:** *sourced-vs-BYO is stamped ONCE at first contact* (how the client arrived: marketplace-discovered vs vendor-invited/own-link), and is **immutable**. NOT decided by booking size or order → kills the "book a small event first" dodge.
  - 🛡 **ENFORCEMENT POINT NAMED 2026-08-09 — "immutable" was a sentence, not a mechanism, and one path was silently rewriting it.** Owner, restating the rule the same day: *"we have a rule. to check the user first if they found each other first on the website or not."* The stamp lives in `event_vendors.source`. `vendor_claim_locked_qr()` upserts that row on a Locked-QR scan, and on the **UPDATE** branch — i.e. precisely when a row already existed because the couple had **already found the vendor on Setnayan** — it overwrote `source` with `'vendor_locked_qr'`. `host_marketplace_search` became vendor-brought in one scan. Against the live classifier `vendor_source_attribution()` (which buckets `host_marketplace_search` + `auto_cascade_from_finalize` → **setnayan**, `host_manual` + `admin` → **off_platform**, everything else → **unattributed**) a genuinely Setnayan-sourced booking silently left the "Setnayan sourced" column on the vendor's own My Performance page. Fixed in migration `20271121904105` (`COALESCE(source, 'vendor_locked_qr')` — the INSERT branch still stamps, because with no prior row the QR genuinely IS how they met), pinned by `tests/db/locked-qr-preserves-source.db.test.ts` with a neutralisation case.
  - ⚠ **Read this as ATTRIBUTION, not billing.** The fee engine reads a **thread's** `inquiry_source` via `booking_fee_is_sourced_surface()`, not this column, and `bookingFeeSendGate` still has **no live caller** (prod: 0 fee charges). Nobody was mis-billed. It matters because the fee is scoped *sourced clients only* and this is the column whose NAME answers that question — so it is what a future wiring reaches for, and it had to still be there when it does. **The Shortlist QR never had the bug**: its import path returns `already_saved` on a pre-existing row and writes nothing.
- **Anti-under-declaration (already partly built, flag-dark):** the declared price doubles as the vendor's public "typical price" + matching signal (verified-median, self-correcting) + the under-declaration plausibility scanner flags outliers for admin review + the declared amount = the accepted proposal price (understating needs a fake-low proposal + couple collusion). Not 100%-preventable (off-platform payment), but costly, detectable, self-limiting — and not load-bearing (subs are the revenue).

## 4. Free-tier mechanics
- Verified vendors run their own clients (BYO) + basic ops **free**.
- **Cap: 3 concurrent active bookings** (locked, event not yet done — counts ALL sources). At cap → shown **"Fully booked"**: still discoverable, but couples **cannot Lock/Book** them until a booking completes (slot frees) or they subscribe (→ unlimited).
- **Inbox & chat are NEVER gated** — a capped vendor still receives inquiries, chats, and sends proposals. Only the couple's Lock/Book button is disabled. This is the prime upsell moment ("5 couples want you, you can hold 3 — upgrade").

## 5. Ranking (marketplace integrity — do NOT pay-to-win)
- **Organic rank = merit for everyone incl. Free** (match to need, reviews, responsiveness, completed bookings, proximity). A better free vendor is never buried.
- **Paid = a capped boost + clearly-labeled Featured/Sponsored slots** — amplifies quality, never manufactures it, never buries a better vendor.

## 6. Reach — two rings, free-transport ENFORCED
- **Ring 1 "Free travel":** served + discoverable; in the Proposal Maker the **transportation line is locked to ₱0** (cannot be added) when the event venue is inside Ring 1. Couple sees **"Free Transportation."**
- **Ring 2 "Willing to travel":** discoverable; couple sees **"travel fee may apply"**; transportation line **is** editable.
- **Beyond Ring 2:** vendor not shown to that couple.
- **The event venue location decides the ring.** Vendors set both rings; the Ring-2 outer bound is tier-capped (Free/Solo ~30 km · Pro ~60 km · Enterprise 100 km).
- Implementation: `event_vendors.transport_php` / proposal transport item forced to 0 + field disabled when venue ∈ Ring 1.

## 7. Team seats + roles (Pro+)
- **Roles:** Owner/Admin (all, incl. billing/settings) · **Agent** (own clients + own calendar) · **Financial** (billing/payments/reports, no client chat) · **Secretary/Coordinator** (scheduling + comms across the team).
- **Agent scheduling:** each agent has their own calendar; the owner sees a **unified team calendar**; assigning a booking **notifies the agent** ("You've been booked for [event]").
- Seats: Free/Solo 1 (owner only) · Pro 3 · Enterprise 10. Roles/agent-scheduling = **Pro+**.

## 8. External visibility (SEO/GEO/AEO) — bundled into subscription
- **Basic indexability = free for all** (also feeds Setnayan's own SEO).
- **Enhanced SEO + GEO (structured data, local schema) = Solo+.**
- **AEO (surfaced by AI answer engines) + priority sitemap + AI-surfaced featuring = Pro+.**

## 9. Deep Search — cost to us (est., measure once built)
- **About You ≈ ₱10** (≈8 web searches + one Haiku-class synthesis).
- **Market Scan ≈ ₱30** (≈25 searches + larger synthesis; genuinely ~3× the work).
- ~90–98% margin at listed prices even on a premium model. Measure a real run to confirm.

---

## Launch posture (owner 2026-07-25)
- **First-5-free = a STANDING free vendor perk** (not just an intro) — a verified vendor's first 5 sourced bookings pay ₱0, always. Reframed from "launch promo" to permanent free-tier value.
- **Free-until-2026-11-30 launch window:** selected paid features are **free until Nov 30, 2026** to seed supply. During launch a vendor effectively gets the full stack free; pricing below is the *post-launch* steady state.

## Competitive positioning (benchmarked 2026-07-25 — "better features for a price")
Setnayan bundles THREE things competitors sell separately, at less than any one of them:

| Category | Examples | ~Monthly | What's missing vs. Setnayan |
|---|---|---|---|
| Creative CRM (tools only) | HoneyBook, Dubsado, Táve, 17hats | $22–109 (~₱1,300–6,300) | no marketplace, no leads, no couple event site, no AI answerer, no 3D |
| Lead marketplace (US) | The Knot, WeddingWire | $125–1,200 (~₱7,250–70,000) | no CRM/tools, low-quality leads, 12-mo lock-in |
| SEA/PH marketplace | Bridestory (Gold ≈₱2,440), Kasal.com, eKasal | ~₱2,440 / quote-hidden | thin CRM, no AI/3D/market-intel, opaque pricing |
| **Setnayan** | — | **Free / ₱1,000 / ₱2,500 / ₱10,000** | **all of the above in ONE** |

**Stack-replacement math:** a vendor buying best-of-breed today pays ≈ HoneyBook Essentials ($49) + a Knot listing (~$125) + a standalone AI tool (~$30) ≈ **$204/mo ≈ ₱11,800/mo** — and still gets no 3D booths, no market intel, no couple-facing event layer, across two logins. **Setnayan Pro delivers all of it for ₱2,500.**

**Per-tier verdict (₱58/$):**
- **Free ₱0** — no competitor offers a real marketplace-listed + CRM + inbox free tier. Best free in market; pure acquisition weapon.
- **Solo ₱1,000 (~$17)** — undercuts *every* Western CRM (cheapest is Táve $22) AND adds marketplace + leads they don't have.
- **Pro ₱2,500 (~$43)** — priced at Bridestory Gold / below HoneyBook Essentials, but bundles a ~₱12k/mo stack. The flagship value tier.
- **Enterprise ₱10,000 (~$172)** — still below a *single* Knot listing, adds 10 seats + API + everything. _(Was ₱8,000 / ~$138 until the owner's 2026-08-27 price sheet.)_

**Verdict:** strictly more value per peso at every tier. If anything Solo/Pro are *underpriced* vs the bundle — deliberately correct for a supply-starved launch (win vendors now, revisit Pro/Enterprise upward once value is proven). **Recommendation: HOLD current prices through launch; revisit after traction.**

## Supersedes / reconcile
- **RETIRES 5%-on-everything-at-lock.** The payment session's `booking_fee_*` engine (`booking_fee_centavos`, `booking_fee_open_lock_charge`, `collectBookingFeeAtLock`, `chat-lock-booking*`, PR #3658) must **re-scope**: (a) fee applies to **sourced clients only**, not BYO; (b) rate becomes **5% up to ₱100k then 1%** (replaces flat-5%/₱50-floor); (c) applies to **first + repeats** of a sourced client; (d) trigger keyed to **arrival-source attribution stamped at first contact**, not any lock. Keep the engine + idempotency + verified-gate; change the rate function + the "who pays" gate.
- Reconcile with existing: `vendor_billing_catalog` (subscription seed), verified-median (flag-dark), plausibility scanner, vendor favorites (subscription-gated), editorial (0038), market-intel gating, `transport_php`.

## Build sequence (phased, each flag-dark PR)
0. **Spec lock** — this doc + DECISION_LOG + memory. ✅
1. **Foundation** — vendor monetization catalog as data (tiers + capability flags + add-on prices + fee schedule); reconcile with `vendor_billing_catalog`.
2. **Fee re-scope** (payment session) — sourced-only + 5%/1%-above-₱100k taper + first+repeats + arrival-source attribution; hold/adjust PR #3658.
3. **Free-tier cap** — 3-concurrent + "Fully booked" lock-gating + upsell (inbox/chat never gated).
4. **Reach** — two rings + free-transport enforcement in Proposal Maker.
5. **Ranking** — merit-first + capped boost + labeled Featured slots.
6. **Team roles + agent scheduling** (Pro+).
7. **Add-ons** — Papic Challenge tiered, 3D Ads, AI Chatbot Basic/Advanced, Deep Search You/Market, tiered pricing.
8. **SEO/GEO/AEO** tiering.
9. **Reconcile** market-intel/favorites/editorial gating to the tier matrix.
