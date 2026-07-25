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

| | **Free** | **Solo** ₱1,000 | **Pro** ₱2,500 | **Enterprise** ₱8,000 |
|---|:---:|:---:|:---:|:---:|
| **— RUN —** | | | | |
| Verified badge · BYO/returning clients | ✓ | ✓ | ✓ | ✓ |
| Budget · guest list · schedule · **inbox & chat** (never gated) | ✓ | ✓ | ✓ | ✓ |
| Reviews + stats | ✓ | ✓ | ✓ | ✓ |
| Concurrent active bookings | **3** | unlimited | unlimited | unlimited |
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

## 2. Add-on pricing (subscribers pay less)

| Add-on | Free / Solo | Pro / Enterprise |
|---|:---:|:---:|
| Papic Challenge (per event) | ₱500 | ₱400 |
| 3D Plan Ads (/28d) | ₱2,000 | ₱1,500 |
| AI Chatbot — Basic (/28d) | ₱2,000 | ₱1,500 |
| AI Chatbot — Advanced (/28d) | ₱3,000 | ₱2,500 |
| Deep Search — About You | ₱1,000 | ₱500 |
| Deep Search — Market Scan | ₱2,000 | ₱1,500 |

**Principle:** bundling an add-on "free" into a tier is not free — it must be priced into that tier's sub. Nothing is currently bundled free, so subs stay ₱1,000/₱2,500/₱8,000.

## 3. Sourced-lead finder's fee
- **Applies ONLY to clients Setnayan sourced** (client discovered the vendor through the marketplace). BYO / vendor-invited / returning = **free**.
- **Rate:** **5% on the first ₱100,000 of a booking, then 1% on the amount above.** Applies to the **first booking AND every repeat** of a sourced client with that vendor.
  - ₱60k → ₱3,000 · ₱300k → ₱7,000 · ₱1M → ₱14,000 · ₱10M → ₱104,000.
- **Deals above ~₱3–5M → Enterprise/Custom (hand-priced),** not the automatic formula.
- **Attribution — the anti-gaming core:** *sourced-vs-BYO is stamped ONCE at first contact* (how the client arrived: marketplace-discovered vs vendor-invited/own-link), and is **immutable**. NOT decided by booking size or order → kills the "book a small event first" dodge.
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
| **Setnayan** | — | **Free / ₱1,000 / ₱2,500 / ₱8,000** | **all of the above in ONE** |

**Stack-replacement math:** a vendor buying best-of-breed today pays ≈ HoneyBook Essentials ($49) + a Knot listing (~$125) + a standalone AI tool (~$30) ≈ **$204/mo ≈ ₱11,800/mo** — and still gets no 3D booths, no market intel, no couple-facing event layer, across two logins. **Setnayan Pro delivers all of it for ₱2,500.**

**Per-tier verdict (₱58/$):**
- **Free ₱0** — no competitor offers a real marketplace-listed + CRM + inbox free tier. Best free in market; pure acquisition weapon.
- **Solo ₱1,000 (~$17)** — undercuts *every* Western CRM (cheapest is Táve $22) AND adds marketplace + leads they don't have.
- **Pro ₱2,500 (~$43)** — priced at Bridestory Gold / below HoneyBook Essentials, but bundles a ~₱12k/mo stack. The flagship value tier.
- **Enterprise ₱8,000 (~$138)** — below a *single* Knot listing, adds 10 seats + API + everything.

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
