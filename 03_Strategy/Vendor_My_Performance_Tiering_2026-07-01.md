# Vendor · My Performance — Tiering & Analytics Design (2026-07-01)

> **Status:** Phase A **SHIPPED** (#2530, flag-dark) · Phase B family 1 (Inquiry
> handling) **SHIPPED** (#2531) · family 2 (Conversion & deals) **SHIPPED**
> (#2534) · family 3 (Reputation) **SHIPPED** (#2535) · family 4 (Capacity)
> **SHIPPED** (#2537). **All buildable Phase B families done.** Open: Catalog
> (not enough data yet — wire the capture so it gathers) · calendar-utilization
> ratio (owner definition) · review sentiment (AI pass). See §3. Every RPC verified live in prod (rolled-back psql
> txn + post-apply pg_proc).
> **Owner-driven design conversation → 1-1 build mapping.** This doc is the
> canonical record of the My Performance tiering decision the owner made in the
> 2026-07-01 session and exactly what shipped for it. Source-of-truth order per
> corpus `CLAUDE.md`: live site → shipped code → this doc. Where a card is
> marked "Phase B/C/D", it is DESIGNED here but not yet built.

---

## 0 · How to read this doc

Every row of §2 and §3 is a **1-1 trace**: one thing the owner said in the
discussion → the design decision it produced → the shipped file (or the
follow-up phase it's queued into). Nothing here is aspirational filler — if it's
not built, it says so and names the phase.

The live surface is `/vendor-dashboard/performance` (the "My Performance" menu,
menu #4 of the 6-menu vendor-dashboard reorg — see
[`Vendor_Dashboard_Build_Plan_2026-07-01.md`](Vendor_Dashboard_Build_Plan_2026-07-01.md)).

---

## 1 · The decision, in one table

Menu **starts at Solo** (no My Performance for Free/Verified). Each tier is a
genuine step up. Complexity is the axis: basic own-shop info at Pro, complex /
cross-business at Enterprise, Solo as the entry rung.

| Card | Free / Verified | Solo | Pro | Enterprise | Class |
|---|:--:|:--:|:--:|:--:|---|
| *(menu visible at all)* | — | ✅ | ✅ | ✅ | — |
| Health composite (ring + 5 pillars) | — | ✅ | ✅ | ✅ | A · own |
| Grow your business (recs) | — | ✅ | ✅ | ✅ | A · own |
| Momentum — count, Monthly/Annual | — | ✅ | ✅ | ✅ | A · own |
| Momentum — + revenue + **Daily** | — | — | ✅ | ✅ | A · own |
| ROI (Setnayan vs your book) | — | — | ✅ | ✅ | A · own |
| Funnel (views→inquiries→quotes→booked) | — | — | ✅ | ✅ | A · own |
| **Demand Radar** | — | — | — | ✅ | B · market |
| **Price-Position** | — | — | — | ✅ | B · market |

- **Solo** = "how's my shop doing" at a glance.
- **Pro** = full own-business analytics.
- **Enterprise** = + nationwide market intelligence.
- Lower tiers see an **inline "Unlock with …" teaser** in the slots above their line.

### The two data classes (the governing principle)

The owner set a hard rule: **"aligned only for their business, not sharing data
from other businesses; it can be totalled nationwide."** Every card sorts into:

- **Class A — own business.** Reads ONLY the vendor's own rows. Enforced in SQL:
  SECURITY DEFINER RPCs ownership-gated to `current_vendor_profile_ids()`. Cannot
  return another vendor's data even if asked. → available to paid tiers.
- **Class B — market intelligence.** Built from many businesses' data but
  **de-identified + min-N floored** (region/month/style → counts only; a bucket
  only surfaces above the admin-managed sample floor). Nationwide totals, never a
  single competitor. → Enterprise-only.

**Why market intel = Enterprise:** it's the only class whose value comes from
*other* businesses' aggregate data. Own-shop analytics are never Enterprise-gated
— gating a vendor's own numbers behind the top tier would be punitive.

---

## 2 · Discussion → design → shipped (1-1 trace)

| # | What the owner said | Design decision | Shipped in |
|---|---|---|---|
| 1 | "vendors my performance menu" | Surface exists (menu #4); audit its real state | Found already shipped on `origin/main`; build-plan "Phase 6 REMAINING" was stale |
| 2 | "which should be part of enterprise only? … only aligned for their business, not share data from other businesses; can be totalled nationwide" | Split all cards into Class A (own) vs Class B (market). **Market intel → Enterprise-only.** Isolation already correct; add an *access* gate only | `marketIntel` cap moved Pro+→Enterprise-only · `lib/vendor-tier-caps.ts` |
| 3 | "also plot daily" | Daily plotting for **own-business** Momentum only (Pro+). Market intel stays monthly (a day+region+style bucket could re-identify one couple) | `vendor_booking_daily_series` RPC + `MomentumCard` Daily toggle |
| 4 | "my performance will show from solo, pro and enterprise. more complex for enterprise, basic info for pro" | 3-step ladder. New `performanceAdvanced` (Pro+) for the deep own-business analytics; `performanceTrends` (Solo+) keeps basic access | `performanceAdvanced` cap + `canSeePerformanceAdvanced()` |
| 5 | Solo scope Q → "Health + Grow + basic Momentum" | Solo = own-shop glance (no earnings, no daily, no ROI/funnel) | `MomentumCard variant='basic'` · page section gating |
| 6 | "are there more analytics we can provide?" → selected all 4 families | Inquiry-handling · Conversion · Catalog · Reputation&capacity added to the **Pro** own-business layer (design; build = Phase B/C) | §3 backlog below |
| 7 | "apply this to our live website now. document it properly … 1-1 output" | Ship Phase A (tiering spine + daily) flag-dark; write this doc + DECISION_LOG row; queue B/C/D | This PR + this doc |

---

## 3 · Card inventory — build status & data source

### Phase A — SHIPPED (this PR)

| Card | Tier | Data source | File |
|---|---|---|---|
| Health composite | Solo+ | `vendor_activity_stats` (own row) | `performance/_components/health-composite-card.tsx` |
| Grow your business | Solo+ | `buildGrowthRecs(statsRow)` | `_components/growth-recs-card.tsx` |
| Momentum (basic) | Solo+ | `vendor_source_attribution` + `vendor_booking_monthly_series` | `_components/momentum-card.tsx` |
| Momentum (+ Daily + revenue) | Pro+ | + `vendor_booking_daily_series` (new) | `momentum-card.tsx` + `momentum-chart.tsx` |
| ROI attribution | Pro+ | `vendor_source_attribution` (365d) | `_components/roi-attribution-card.tsx` |
| Funnel preview | Pro+ | `vendor_funnel` totals | `_components/funnel-preview-card.tsx` |
| Demand Radar preview | Enterprise | `demand_radar_for_vendor` (de-id + min-N) | `_components/demand-preview-card.tsx` |

**Gating mechanics:** `lib/vendor-tier-caps.ts` caps (`performanceTrends` Solo+,
`performanceAdvanced` Pro+, `marketIntel` Enterprise) + `canSee*` helpers,
enforced flag-dark via `isVendorFeatureGateEnabled()`
(`VENDOR_TIER_FEATURE_GATE`, default OFF). Locked slots render `VendorTierTeaser`
(inline) or `VendorTierGate` (full-page for Free/Verified).

### Phase B — VERIFIED feasibility (schema-discovery + adversarial verify, 2026-07-01)

A 6-domain discovery workflow mapped the real tables and an independent verifier
confirmed every column/status against the shipped migrations. Legend: ✅ ready ·
🟡 needs rollup (buildable, non-trivial derivation) · 🆕 needs new capture ·
⛔ infeasible today. All Class A · Pro tier · own-business unless noted.
**Discovery surfaced two tables not in the original design** — `inquiry_outcomes`
(won/lost/no_response, opt-in) and `vendor_event_unlocks` (per-(vendor,event)
token burns) — which unlock the token-efficiency + win/loss metrics.

**Family 1 · Inquiry handling — ✅ SHIPPED (PR #2531, migration `20270421213000`).**
- first-reply p50/p90/avg ✅ (`vendor_inquiry_reply_stats`) · inquiry heatmap ✅
  (`vendor_inquiry_heatmap`) · token efficiency ✅ (`vendor_token_efficiency`,
  via `vendor_event_unlocks`↔`event_vendors`) · missed/slipped leads 🟡→shipped
  (`vendor_inquiry_missed`: declined + unanswered-past-SLA + `inquiry_outcomes`
  no_response + `vendor_date_waitlist`) — labelled a floor, not a census.

**Family 2 · Conversion & deals — ✅ SHIPPED (PR #2534, migration `20270422213000`).**
- quote acceptance + time-to-quote ✅ (`vendor_quote_stats`) · avg deal size ✅
  (`vendor_deal_size`: accepted-quote value + confirmed contract) · booking lead
  time ✅ (`vendor_lead_time`: event_date − booked created_at, avg + median) ·
  **win/loss ✅** (`vendor_win_loss`: won/declined/lost + decided win rate). SQL
  compiled + executed against prod in a rolled-back psql txn before merge.
  Sales-cycle length folded into lead time / win-loss (no `contracted_at`).

**Family 3 · Reputation — ✅ SHIPPED (PR #2535, migration `20270423213000`).**
- reply-to-review coverage % ✅ (`vendor_review_coverage`: rating + count +
  coverage + avg reply time + 5→1 distribution) · rating trend + velocity ✅
  (`vendor_review_monthly`, zero-filled). SQL executed against prod in a
  rolled-back psql txn before merge. Review themes/sentiment 🆕 deferred (body
  text exists, no derived sentiment column — needs an AI pass + persisted col).

**Family 4 · Capacity — ✅ SHIPPED (PR #2537, migration `20270424213000`).**
- waitlist depth ✅ (`vendor_waitlist_depth`: upcoming waitlisted dates + counts
  = unmet demand) · upcoming booked load ✅ (`vendor_upcoming_load`: distinct
  future booked days + next 30/90). SQL executed against prod in a rolled-back
  psql txn. **Calendar utilization % DEFERRED — owner definition needed** (the
  "available-day" denominator: whole month vs future-only vs excluding
  closed/locked; "booked" = any-consumption vs full-capacity). The
  `acquire_schedule_pools` derivation is understood; a guessed ratio would drift
  from what couples see. Fill-pace-vs-peak-season needs a cross-business
  seasonality baseline (Enterprise market-intel territory).

**Family · Catalog performance — 🟡 NOT ENOUGH DATA YET (wire the capture, let it gather).**
Not blocked — the capture just isn't wired, so it needs the write-path added
before a reader has anything to show (unlike F1–F4, which read data already
being recorded). Verified against the live schema: `vendor_profile_views`
columns are `view_id, vendor_profile_id, event_id, source, utm, viewer_hash,
viewed_at` — **no service id**; and there is **no impressions table**. To wire it
so the card gathers from ship date (accumulates forward, no back-fill):
- add nullable `vendor_service_id` to `vendor_profile_views` (+ the shortlist row) and pass it at the write sites (Explore card, view log)
- add a `vendor_explore_impressions` table + log one row per result-card render
- then the reader/card show per-service impressions→views→(inquiry/book) with a "not enough data yet" empty state until rows accrue.

**Enterprise phase-2 market intel** (Class B, de-id + min-N): category
competition density · wedding-date heat · emerging styles · booking-pace
benchmark — all 🟡 rollups, deferred.

**Explicitly NOT built** (owner "only what helps them"): raw pageview totals with
no conversion, "follower" counts, any vanity metric.

**Build sequencing:** shipped as stacked verified PRs. Order: Family 1 (done) →
Family 2 (Conversion, all ready) → Family 3 (Reputation) → Family 4 (Capacity) →
Catalog only after the capture prerequisites land. A future UX note: at ~20 cards
the page should section into a sub-tab strip (Overview · Inquiries · Conversion ·
Reputation · Market) to stay scannable — the Phase A/B section grouping is the seed.

---

## 4 · What is deliberately unchanged

- **No behavior change in prod today.** The gate is flag-dark; with
  `VENDOR_TIER_FEATURE_GATE` OFF every tier sees every Phase-A card exactly as
  before — plus the new Daily toggle and the sectioned layout. The owner flips
  the flag the day paid vendors exist.
- **Data isolation was already correct** — this work adds an *access* gate, it
  does not touch how any RPC scopes data.
- **Prices are read from `vendor_billing_catalog`**, never hardcoded; the tier
  price constants in `vendor-tier-caps.ts` are fallback-only.
