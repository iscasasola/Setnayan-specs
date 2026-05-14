# Setnayan Wedding Planning Reference + Guided Planner SKU

> Master reference for the Plan Builder's category sequence, importance tiers, per-head budget allocation per couple's tier, sub-event + sibling-event handling, post-wedding coordination, vendor registration schema, and representative PH wedding venue inventory. **Locked 2026-05-14 as optional paid SKU; DIY is free default.** Companion HTMLs: `0016_plan_builder_prototype.html` (main), `0016_guided_vs_diy_flow.html`, `0016_venue_food_flow.html`.

---

## 0. Access Model — DIY vs Guided Planner (Locked 2026-05-14)

The wedding-planning content in Sections 1–N below describes Setnayan's complete planning system. **Couples access this content in one of two modes**, locked 2026-05-14:

### DIY mode (free, default for every event)

- **Cost:** Free. No purchase required.
- **What couples see:** Full access to every dashboard surface — guest list, vendor tracker, budget, seating chart, mood board, etc. The planning categories from Section 1 are organized as a 10-tile launcher on iteration 0021's dashboard.
- **What couples DON'T see:** No active timeline, no deadline alerts, no daily nudges, no vendor-pick recommendations matched to event style, no step-by-step roadmap. Couples discover and navigate the tools on their own.
- **Switch to Guided:** Anytime from Settings → Guided Planner OR via the upgrade banner on the dashboard.

### Guided Planner (paid · 3 pricing tiers)

| SKU | Duration | Price | Per-week | vs Week-by-Week | Savings |
|---|---|---|---|---|---|
| `guided_planner_1week` | 1 week | **₱99** | ₱99/wk | baseline | — |
| `guided_planner_3month` | 13 weeks | **₱999** | ₱76.85/wk | ₱99 × 13 = ₱1,287 | **₱288 (22%)** |
| `guided_planner_12month` | 52 weeks | **₱1,999** | ₱38.44/wk | ₱99 × 52 = ₱5,148 | **₱3,149 (61%)** · **flagship** |

**What couples get:**
- 9-step expert roadmap (the Locked Sequence in § 1) walked through step-by-step instead of self-serve
- Smart timeline auto-built from wedding date + venue book date + lead-time matrix
- Deadline alerts (in-app + email per iteration 0028) at T-90, T-30, T-7, T-1 day per category
- Vendor picks matched to event style + budget tier (pulls from iteration 0006 marketplace; ranks by 0010 Mood Board palette match)
- Daily nudges on the "next thing to do" pinned at the top of iteration 0021 dashboard
- Post-wedding coordination prompts (per § Post-event content below) — marriage certificate pickup, thank-you cards, honeymoon coordination

**Pre-paid blocks** — V1 uses one-time payment via apply-then-pay (BDO + GCash). No recurring auto-renewal. Couples can stack purchases (buy a 1-Week now + another 1-Week next week, or upgrade from 3-Month to 12-Month — remaining weeks of the lower-tier purchase don't refund but new tier's access duration starts from purchase date).

**Auto-renew lands at V1.5** — pending GCash Merchant API approval. Until then, manual renewal via the Settings → Guided Planner "Buy Another Plan" CTA.

**Access doesn't end at wedding date.** A 12-Month purchased 8 months before the wedding gives 4 months of post-wedding planning assistance (anniversaries, baptisms, family reunion planning, etc. — Setnayan's broader event types unlock over time per CLAUDE.md scope).

### Choice card on event creation (iteration 0000)

After the couple enters their event name, four options appear:

```
┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│ DIY MODE   │  │ 1-WEEK     │  │ 3-MONTH    │  │ 12-MONTH ✨ │
│ Free       │  │ PASS       │  │ PLAN       │  │ PLAN       │
│            │  │ ₱99        │  │ ₱999       │  │ ₱1,999     │
│            │  │            │  │ save 22%   │  │ BEST VALUE │
│            │  │            │  │            │  │ save 61%   │
│ All tools. │  │ Try it for │  │ 13 weeks   │  │ 52 weeks — │
│ Plan at    │  │ a week.    │  │ of guided  │  │ full year  │
│ your pace. │  │ Decide     │  │ planning.  │  │ + post-    │
│ No         │  │ later.     │  │            │  │ wedding    │
│ timeline   │  │            │  │            │  │ assistant. │
│ help.      │  │            │  │            │  │            │
│            │  │            │  │            │  │            │
│[Start Free]│  │ [Buy ₱99]  │  │ [Buy ₱999] │  │[Buy ₱1,999]│
└────────────┘  └────────────┘  └────────────┘  └────────────┘

         Optional — activate or change anytime from Settings.
```

### Schema additions on `events`

```sql
ALTER TABLE events
  ADD COLUMN guided_planner_status TEXT
    NOT NULL DEFAULT 'diy'
    CHECK (guided_planner_status IN ('diy', 'active', 'expired')),
  ADD COLUMN guided_planner_tier TEXT
    CHECK (guided_planner_tier IN ('1week', '3month', '12month')),
  ADD COLUMN guided_planner_expires_at TIMESTAMPTZ;
```

### Daily expiry sweep

Cron job (depends on Phase 1 of `Install_Sequence_V1.md` — Vercel Cron OR Cloudflare Cron Triggers):

```sql
UPDATE events
SET guided_planner_status = 'expired'
WHERE guided_planner_status = 'active'
  AND guided_planner_expires_at < NOW();
```

On status flip → in-app notification + email (per 0028) → DIY dashboard surface variant takes over.

### Server actions

- `activate_guided_planner(event_id, tier, order_id)` — flips status to 'active', sets tier + expires_at
- `extend_guided_planner(event_id, additional_tier, order_id)` — purchased-on-top extension; expires_at extends by duration of new purchase
- `cancel_guided_planner(event_id)` — early cancel; sets `guided_planner_status='expired'` immediately (refund handled by admin per existing 0034 refund flow; pro-rated refund optional admin action)

---

## 1. The Locked Sequence

The plan builder routes couples through categories in this order. The order is determined by three forces: **lead time** (how far ahead a vendor must be booked), **dependency** (does the category need other decisions first?), and **bundling cascade** (does picking it auto-resolve others?).

### Phase 1 — Anchors (set everything else)

1. **Ceremony venue** — geographic anchor; locks the radius for reception search
2. **Reception venue** (must be ≤8km from ceremony unless overridden)
3. **Catering** — auto-routed by reception's food arrangement

### Phase 2 — Major commitments (book 8–12 months out)

4. **Photography**
5. **Wedding Coordinator**
6. **Bridal gown · Groom suit** (custom = 3–6 month lead)

### Phase 3 — Style + Design layer (4–8 months out)

7. **Stylist** (parent-vendor; absorbs florals + lights + decor when hired)
8. **Florals** (or auto-bundled with stylist/venue)
9. **Lights and Sounds** (or auto-bundled)
10. **Cake** (bundled at hotels; solo at gardens)

### Phase 4 — Programming + Entertainment (3–6 months out)

11. **Host / Emcee**
12. **Band / DJ** (multi-vendor allowed)
13. **Cocktail vendors** — multi-slot multi-vendor: food · drinks · souvenirs · attractions · photobooth · entertainment · others

### Phase 5 — Logistics + Finishing (2–4 months out)

14. **HMUA** (coverage roster)
15. **Bridal car** (bundled at hotels)
16. **Dressing Room / Hotel Stay** (bundled at hotels; solo for out-of-town guest blocks)
17. **Invitations** (needs final guest list)
18. **Rings** (couple-led; often external)

### Pre-event (after photographer is locked)

- **Pre-nup shoot** (2–6 months before wedding, with the same photo team)
- **Dance Guide / Choreographer** (4–8 weeks before; first dance + entourage grand march)

### Post-event (Setnayan coordination tasks)

- **Marriage certificate pickup** (Setnayan nudges 14 days post-wedding)
- **Honeymoon** (coordination + budget line)
- **Wedding registry / thank-you cards** (curated external links in V1; Setnayan SKU in V2)

---

## 2. The 8km Proximity Rule

Reception venue search filters to ≤8km from the ceremony venue by default.

**Reasoning:**
- Manila weekend traffic: 8km ≈ 30–45 minutes drive
- Guest comfort: long transitions kill event momentum
- Couple efficiency: outfit changes need short transitions
- Photography: golden-hour timing depends on quick venue moves

**Override:** "Show beyond 8km" toggle. Far venue cards display a `+Nkm · ~Nmin travel` badge so the trade-off is visible. Adapts for Tagaytay / destination ceremonies — the radius pulls in same-region venues.

---

## 3. Importance Tiers (which categories couples can't skip)

| Tier | Categories | Why |
|---|---|---|
| **Tier 1 — Non-negotiable** | Ceremony, Reception+food, Photography, Bride's gown, HMUA, Coordinator, Rings, Marriage license | Wedding can't happen without these |
| **Tier 2 — High-impact** | Florals (or Stylist), Cake, Music/Band/Host, Bridal car, Invitations, Videography | Defines the *feel* of the day |
| **Tier 3 — Style amplifiers** | Stylist (full-service), Lights & Sounds, SDE, Cocktail food + drinks, Pre-nup | Elevates the experience |
| **Tier 4 — Nice-to-haves** | Photobooth, Souvenirs, Drone, Cocktail attractions, Dance Guide | Adds delight |
| **Tier 5 — Bonus** | Lounge furniture, Cigar bar, Custom signage, Sparkler send-off | Pure flourish |

**Unlock progression:** Tier 1 categories must be placeholder-filled before Tier 2 unlocks for vendor browsing, and so on.

---

## 4. Working Budget Tiers (Per-Head Spend)

Replaces the previous absolute-budget framing. **Tier is determined by per-head spend, not total budget.** Couples pick a tier first; the plan builder computes the working budget by multiplying the tier's per-head range by the guest count.

### The Five Tiers

| Tier | Name | Per-head ₱ | Feel |
|---|---|---|---|
| 1 | **Simple and Intimate** | ₱1,500–3,000 | Restaurant or modest hotel; immediate family + closest friends; minimal extras |
| 2 | **Charming and Personal** | ₱3,000–5,000 | Mid-tier hotel or curated garden; wedding party + extended family; thoughtful styling |
| 3 | **Grand and Beautiful** | ₱5,000–8,000 | Premium hotel or full-service garden estate; full design layer; SDE + cocktail extras |
| 4 | **Distinguished and Refined** | ₱8,000–13,000 | Top-tier hotel or destination estate; stylist-driven full design; premium photo/video; couture-adjacent gown |
| 5 | **Luxurious and Beyond** | ₱13,000+ | Iconic hotel grand ballroom or premium destination; couture gown; full-event stylist team; multi-vendor cocktail; designer everything |

### Working Budget by Tier × Guest Count

| Guests | Tier 1 (Simple) | Tier 2 (Charming) | Tier 3 (Grand) | Tier 4 (Distinguished) | Tier 5 (Luxurious) |
|---|---|---|---|---|---|
| 50 | ₱75K – ₱150K | ₱150K – ₱250K | ₱250K – ₱400K | ₱400K – ₱650K | ₱650K+ |
| 80 | ₱120K – ₱240K | ₱240K – ₱400K | ₱400K – ₱640K | ₱640K – ₱1.04M | ₱1.04M+ |
| 100 | ₱150K – ₱300K | ₱300K – ₱500K | ₱500K – ₱800K | ₱800K – ₱1.3M | ₱1.3M+ |
| 150 | ₱225K – ₱450K | ₱450K – ₱750K | ₱750K – ₱1.2M | ₱1.2M – ₱1.95M | ₱1.95M+ |
| 200 | ₱300K – ₱600K | ₱600K – ₱1M | ₱1M – ₱1.6M | ₱1.6M – ₱2.6M | ₱2.6M+ |
| 230 | ₱345K – ₱690K | ₱690K – ₱1.15M | ₱1.15M – ₱1.84M | ₱1.84M – ₱3M | ₱3M+ |
| 250 | ₱375K – ₱750K | ₱750K – ₱1.25M | ₱1.25M – ₱2M | ₱2M – ₱3.25M | ₱3.25M+ |
| 300 | ₱450K – ₱900K | ₱900K – ₱1.5M | ₱1.5M – ₱2.4M | ₱2.4M – ₱3.9M | ₱3.9M+ |

### Key Properties

**Tier is decoupled from headcount.** A 100-guest wedding can be Luxurious. A 250-guest wedding can be Simple. Tier is about *kind of wedding*, not *size of wedding*.

**Couples pick tier first, never the budget.** No cold "type your number" prompt. The wizard shows 5 cards; couple picks one; computed budget appears.

**Budget flexibility — Stick or Play.** After picking a tier, couple is asked: *Stick with this budget, or play with it?* Stick locks at the tier's midpoint. Play opens a slider with ±20% range, with annotations explaining what tightens/stretches:
- Lower: "Restaurant or smaller-hotel receptions; skip cocktail attractions"
- Higher: "Premium hotel options; stylist-driven full design"

---

## 5. Budget Allocation by Tier

These are typical PH market allocations. Refine after launch with real Setnayan data.

### Tier 1 · Simple and Intimate (₱1,500–3,000/head)

Example: 100 guests × ₱2,250/head = ₱225K target

| Category | % | ₱ range |
|---|---|---|
| Reception venue + food (often restaurant-bundled) | 50–55% | ₱110K – ₱125K |
| Attire (bride + groom) | 8–10% | ₱18K – ₱22K |
| Photography (limited coverage) | 8–10% | ₱18K – ₱22K |
| HMUA | 4–6% | ₱9K – ₱14K |
| Coordinator (day-of only) | 4–6% | ₱9K – ₱14K |
| Florals (minimal — bouquet + small centerpieces) | 4–6% | ₱9K – ₱14K |
| Cake | 1–2% | ₱2K – ₱4K |
| Music / DJ | 2–3% | ₱4K – ₱7K |
| Bridal car | 2–3% | ₱4K – ₱7K |
| Invitations | 1–2% | ₱2K – ₱4K |
| Pre-nup (optional) | 2–3% | ₱4K – ₱7K |
| Buffer | 8–10% | ₱18K – ₱22K |

Notes: Stylist + lights typically skipped. Cocktail layer skipped. Restaurant-bundled receptions common.

### Tier 2 · Charming and Personal (₱3,000–5,000/head)

Example: 150 guests × ₱4,000/head = ₱600K target

| Category | % | ₱ range |
|---|---|---|
| Reception venue + food (mid-tier hotel or curated garden) | 45–50% | ₱270K – ₱300K |
| Photography + Video (basic) | 10–12% | ₱60K – ₱72K |
| Florals + simple lights | 7–9% | ₱42K – ₱54K |
| Attire (bride + groom + entourage assist) | 8–10% | ₱48K – ₱60K |
| HMUA (bride + mothers) | 3–4% | ₱18K – ₱24K |
| Coordinator | 3–4% | ₱18K – ₱24K |
| Music + Host | 3–5% | ₱18K – ₱30K |
| Cocktail (light layer) | 2–3% | ₱12K – ₱18K |
| Cake | 1–2% | ₱6K – ₱12K |
| Bridal car (often bundled) | 1–2% | ₱6K – ₱12K |
| Invitations | 2–3% | ₱12K – ₱18K |
| Pre-nup | 2–3% | ₱12K – ₱18K |
| Buffer | 6–8% | ₱36K – ₱48K |

### Tier 3 · Grand and Beautiful (₱5,000–8,000/head)

Example: 200 guests × ₱6,500/head = ₱1.3M target

| Category | % | ₱ range |
|---|---|---|
| Reception venue + food (premium hotel or full-service garden) | 35–45% | ₱455K – ₱585K |
| Photography + Video | 12–15% | ₱156K – ₱195K |
| Florals + Stylist + Lights | 10–12% | ₱130K – ₱156K |
| Attire (bride + groom + entourage assist) | 8–12% | ₱104K – ₱156K |
| HMUA (bride + mothers + entourage) | 3–4% | ₱39K – ₱52K |
| Coordinator (full-event) | 3–4% | ₱39K – ₱52K |
| Music + Band + Host | 4–6% | ₱52K – ₱78K |
| Cocktail vendors (multi-slot) | 3–5% | ₱39K – ₱65K |
| Cake | 1–2% | ₱13K – ₱26K |
| Bridal car (often bundled) | 1–2% | ₱13K – ₱26K |
| Invitations | 2–3% | ₱26K – ₱39K |
| Pre-nup | 2–3% | ₱26K – ₱39K |
| Buffer | 5–8% | ₱65K – ₱104K |

### Tier 4 · Distinguished and Refined (₱8,000–13,000/head)

Example: 230 guests × ₱13,000/head = ₱3M target *(real-world reference: matches the user's wedding profile)*

| Category | % | ₱ range |
|---|---|---|
| Reception venue + food (top-tier hotel) | 30–40% | ₱900K – ₱1.2M |
| Florals + Stylist + Lights | 12–15% | ₱360K – ₱450K |
| Attire (couture-adjacent gown + entourage) | 10–12% | ₱300K – ₱360K |
| Photography + Video (premium team) | 10–13% | ₱300K – ₱390K |
| Music (band + DJ + ceremony quartet) | 4–6% | ₱120K – ₱180K |
| Cocktail vendors (multi-vendor) | 4–6% | ₱120K – ₱180K |
| HMUA (full team + touch-up) | 3–4% | ₱90K – ₱120K |
| Coordinator (premium full-event) | 3–4% | ₱90K – ₱120K |
| Cake | 1–2% | ₱30K – ₱60K |
| Bridal car (often bundled) | 1–2% | ₱30K – ₱60K |
| Invitations (premium stationery) | 2–3% | ₱60K – ₱90K |
| Pre-nup (destination shoot) | 2–3% | ₱60K – ₱90K |
| Buffer | 6–10% | ₱180K – ₱300K |

### Tier 5 · Luxurious and Beyond (₱13,000+/head)

Example: 250 guests × ₱18,000/head = ₱4.5M target

| Category | % | ₱ range |
|---|---|---|
| Reception venue + food (iconic hotel grand ballroom or destination) | 28–38% | ₱1.26M – ₱1.71M |
| Florals + Stylist + Lights (full design team) | 15–20% | ₱675K – ₱900K |
| Attire (couture gown + couture entourage) | 10–15% | ₱450K – ₱675K |
| Photography + Video (couture team) | 8–12% | ₱360K – ₱540K |
| Music (band + DJ + ceremony quartet + late-night DJ) | 5–8% | ₱225K – ₱360K |
| Cocktail vendors (multi-vendor multi-slot) | 5–8% | ₱225K – ₱360K |
| Coordinator (premium team) | 3–5% | ₱135K – ₱225K |
| HMUA (full team + dual-shoot touch-ups) | 3–4% | ₱135K – ₱180K |
| Invitations (curated calligraphy stationery) | 2–4% | ₱90K – ₱180K |
| Pre-nup (destination + multi-day) | 2–3% | ₱90K – ₱135K |
| Cake (couture multi-tier) | 1–2% | ₱45K – ₱90K |
| Bridal car | 1–2% | ₱45K – ₱90K |
| Buffer | 8–12% | ₱360K – ₱540K |

---

## 6. Vendor Registration Schema (Din Phase 3)

The plan builder's match criteria mirrors the vendor registration form. Same vocabulary on both sides of the marketplace.

### Required Declarations on Vendor Sign-Up

**Identity**
- Business name, contact email/phone, billing address
- Service area (cities served + travel willingness)
- Years in business + portfolio link

**Service Categorization**
- Primary category (multi-select from locked list — see Section 1)
- Subtype where applicable (Hotel / Restaurant / Garden Estate / etc.)
- Coverage scope (for multi-slot categories — see Section 8 below)

**Tier Positioning** (which per-head tiers does this vendor fit?)
- Tier 1 (Simple) ✓/✗
- Tier 2 (Charming) ✓/✗
- Tier 3 (Grand) ✓/✗
- Tier 4 (Distinguished) ✓/✗
- Tier 5 (Luxurious) ✓/✗

Most vendors span 2–3 adjacent tiers via package tiers. Plan builder filters vendors whose pricing fits the couple's category budget.

**Pricing Model**
- Per-pax (catering, hotels, restaurants, cocktail food)
- Flat fee (photography, coordinator, host, gown, stylist base)
- Tiered packages (Silver/Gold/Platinum with declared inclusions per tier)
- Hybrid (e.g., stylist base + per-head scaling)

**Inclusion Manifest** (for venues + stylists + parent-vendor types)
Per-package declaration of what's bundled — drives the bundling cascade. See Section 7 for examples.

**Coverage Scope** (for multi-slot categories)
- Photography: pre-nup ✓/✗, wedding ✓/✗, SDE ✓/✗, album ✓/✗, second-shooter ✓/✗
- HMUA: bride ✓, mothers ✓/✗, bridesmaids ✓/✗, touch-up ✓/✗
- Videography: SDE ✓/✗, full-feature ✓/✗, drone ✓/✗, multi-cam ✓/✗

**Relationships**
- Recommended pairings (venue → preferred caterers; stylist → florist partners)
- Corkage policy (for venues that allow outside catering — flat ₱/head)
- `absorbs_categories[]` (for stylists/parent-vendors)

**Capacity Range** (for venues)
- Min guests, max guests, layout options (round / long / mixed)

**Verification Tier**
- *Self-attested* (free): vendor uploads license + portfolio
- *Verified Setnayan Badge* (paid): Setnayan team validates docs, past events, real Setnayan couple reviews

### Match Logic

```
plan_builder.couple → vendor.match if:
  vendor.service_category ⊇ category_being_shopped
  AND tier_overlap(vendor.tiers, couple.working_tier)
  AND distance(vendor.service_area, couple.ceremony_venue) ≤ category_radius
  AND price_in_range(vendor.pricing_model, couple.category_budget)
  AND coverage_match(vendor.coverage_scope, couple.required_coverage)
  AND quality_floor: vendor.rating ≥ 4.0 OR vendor.verified_setnayan_badge
```

Couples never need to filter manually. The plan builder's category page is pre-filtered to vendors who match all of the above. Don't-undersell rule still applies: low-priced quality vendors at any tier remain visible.

---

## 7. Bundling Cascade Reference

When a couple picks a venue, the plan engine reads its `inclusions` manifest and auto-marks downstream categories as bundled.

### Hotel Premium Package (₱2,500+/pax)

| Category | Auto-bundled? |
|---|---|
| Catering | ✓ |
| Cake | ✓ (3–4 tier typical) |
| Reception florals | ✓ (centerpieces + arch) |
| Bridal car | ✓ (5 hrs) |
| Bridal suite + Family suite | ✓ (1 night each) |
| Day-of coordinator | ✓ |
| Sound system + AV | ✓ |
| Ceremony coordination (if hotel chapel) | ✓ |

### Restaurant Bundle (₱1,500–2,500/pax)

| Category | Auto-bundled? |
|---|---|
| Catering | ✓ |
| Cake | ✓ (smaller, 1–2 tier) |
| Basic centerpieces | ✓ (sometimes) |
| Sound system | ✓ |

### Garden Estate (₱150–400K rent)

| Category | Auto-bundled? |
|---|---|
| Catering | — (preferred caterer or open) |
| Sound system | ✓ (sometimes) |
| Basic decor | ✓ (sometimes) |
| Everything else | — (sourced separately) |

### Stylist Parent-Vendor

When a couple hires a full-service stylist:

| Category | Auto-bundled? |
|---|---|
| Reception florals | ✓ |
| Ceremony florals | ✓ |
| Lights & Sounds (design lighting) | ✓ |
| Decor + table styling | ✓ |
| Stage backdrop | ✓ |
| Bouquets + boutonnières | ✓ (often) |

### Food Card Pattern (refined)

The catering category appears in the plan even when food is bundled by the venue, in a "confirm or modify" state:

> **Catering** *✓ Included with your venue*
> [ Keep this menu ] · [ Upgrade to premium ] · [ Switch caterers ]

Translation by food arrangement:
- **Included** → *Switch caterers* warns that food is part of venue contract; *Upgrade* opens premium add-ons
- **Exclusive caterer** → *Switch* shows venue's mandated list only
- **Preferred + corkage** → All three actions live; switching to outside triggers corkage warning
- **Open** → Full browse mode

---

## 8. Sub-Events and Sibling Events

### Engagement Party (Sub-Event)

Same Setnayan event, schema-linked via `parent_event_id`. Smaller guest list (subset of main wedding), separate date, reusable vendor relationships.

**Surfaces in:**
- Couple's event picker → nested under the main wedding ("Wedding · Sept 2026 ▸ Engagement Party · Mar 2026")
- Plan builder → sub-event tab with own category list (often fewer categories: venue, food, photography, attire only)
- Budget (0007) → its own line items, separate from main wedding budget

**Common patterns:**
- 6–12 months before wedding
- 30–80 guests (close family + best friends)
- Reuses photographer (often becomes the pre-nup shoot)
- Reuses caterer / venue from a curated list
- Optional: announces the engagement on the couple's invitation site

### Bridal Shower / Stag Night (Sibling Event)

Friend-organized; the friend is the event owner, not the couple. Friend creates their own Setnayan event with `linked_to_event_id` pointing to the main wedding.

**Why the link matters:**
- Guest list overlap detection (don't double-invite)
- Date conflict warning (don't conflict with prep day)
- Surprise-keeping mode (couple cannot see the friend's event by default)
- Optional vendor sharing (some HMUAs / photographers do both events)

**Privacy:** Surprise mode hides the sibling event from the couple's view entirely. Friend can flip surprise off when they want the couple in the loop.

### Engagement / Stag / Shower Vendor Reuse

When a couple's main wedding photographer also covers their engagement party (or pre-nup shoot), the plan engine recognizes the shared vendor and shows a unified "Photography" view spanning all events.

---

## 9. Post-Wedding Coordination Tasks

The plan doesn't end at the reception send-off. Setnayan nudges couples through the post-wedding tail.

### Marriage Certificate Pickup

- **Trigger**: 14 days after wedding date
- **Nudge copy**: "Your marriage certificate is ready for pickup at [your LCR office]. Bring 2 valid IDs and the original receipt."
- **Optional**: Annulment of bachelorhood claim (if the diocese requires it)
- **Why this matters**: Often forgotten in PH weddings; couples discover months later they need it for legal name changes, joint accounts, immigration filings

### Honeymoon Coordination

- **Surfaces in**: Plan builder as "Post-wedding · Honeymoon" card; Budget (0007) as a separate budget line
- **Type**: Coordination task with budget allocation field; no Setnayan SKU (couple-led booking via airlines/hotels/agencies directly)
- **Reminders**:
  - 30 days post-wedding: "Confirm flight and accommodation bookings"
  - 14 days before honeymoon date: "Pack list checklist"
  - Day of departure: "Travel documents check (passports, visas, insurance)"
- **V2 candidate**: Setnayan travel-agency partnerships for one-click honeymoon packages

### Wedding Registry / Cash Gift App

- **V1 implementation**: Coordination task with curated PH options
  - Lazada Wishlist (most common for physical gifts)
  - Shopee Wishlist (alternative)
  - GCash Gift QR (most common for cash)
  - Honeyfund / Hitchd / Zola (international registry apps)
- **Surfaces in**: Couple's invitation site (0002/0004) as a "Gifts" widget
- **V2 candidate**: Native Setnayan Registry + GCash gift integration with auto-thank-you note generation
- **Etiquette nuance**: PH wedding culture leans toward cash gifts. Couples may want a "soft" gift register (suggested items) without forcing physical-gift expectations

### Thank-You Cards

- **Trigger**: 21 days post-wedding ("Most of your gifts have arrived. Time to send thank-yous.")
- **Surfaces**: Curated stationery vendors + GCash gift QR as a "send a personalized thank-you with photo" option
- **V2 SKU**: Setnayan Thank-You Cards — auto-generated cards with the couple's wedding photo, custom message, and per-guest personalization (ties into the Papic gallery and Photo Delivery)

---

## 10. Wizard Flow Refactor (Path C V1)

### Old flow (pre-tier-first refactor)

date → location → guests → style → **type your budget** → tier classification → category guidance

### New flow (tier-first, locked)

date → location → guests → style → **pick a tier** → **stick or play with budget** → category guidance

### Tier Picker Screen

5 cards arranged vertically (mobile) or in a 5-column grid (desktop):

```
┌─────────────────────────────────────────────────┐
│ TIER 1 · Simple and Intimate                    │
│ ₱1,500–3,000 per head                           │
│ For your 200 guests: ₱300K – ₱600K              │
│ Restaurant or modest hotel · close family       │
│ + minimal extras                                │
│ [photo strip]                                   │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│ TIER 2 · Charming and Personal                  │
│ ₱3,000–5,000 per head                           │
│ For your 200 guests: ₱600K – ₱1M                │
│ ...                                             │
└─────────────────────────────────────────────────┘
... (3 more tiers)
```

### Stick or Play Screen

After tier pick, this screen shows:

> **Your working budget: ₱2.3M** *(Distinguished tier × 230 guests)*
>
> Want to stick with this, or play with the range?
>
> [ Stick — keep ₱2.3M ]  [ Play — give me a range ]

If *Play*, opens a slider:

```
₱1.84M ◀━━━━━━━━●━━━━━━━━▶ ₱3M
                |
              ₱2.3M (current)

← Tighten by ₱400K: Restaurant or smaller-hotel options;
   skip cocktail attractions
→ Stretch by ₱400K: Premium hotel options unlock; full
   stylist-driven design
```

### Category Page Headers

Every category card shows:
- Category name + importance tier badge
- Status (open / in-progress / done / bundled)
- Typical ₱ range for couple's tier ("Distinguished tier typically: ₱120K–₱180K for music")
- Lead-time hint ("Book by [month]")
- Bundled badge if absorbed by venue or stylist

---

## 11. Representative Venue Inventory

> **CAVEAT**: The lists below are illustrative samples drawn from common-knowledge of the PH wedding scene. Prices are rough ranges and **change yearly**. Capacity figures are typical, not maximums. Use these as research starting points for your team — Din Phase 3 (vendor self-onboarding) is the canonical mechanism for collecting verified, current vendor data. Do not present these prices to couples without verification.

### 11A. Hotels (Metro Manila + nearby)

| # | Hotel | Area | Capacity | Typical ₱/pax | Tier Span |
|---|---|---|---|---|---|
| 1 | Manila Hotel | Ermita | 250–500 | ₱2,500–4,000 | T2–T4 |
| 2 | The Peninsula Manila | Makati | 200–700 | ₱2,800–4,500 | T2–T5 |
| 3 | Conrad Manila | Pasay | 200–280 | ₱2,400–3,500 | T2–T4 |
| 4 | Sofitel Philippine Plaza | Pasay | 200–600 | ₱2,200–3,800 | T2–T4 |
| 5 | Marriott Hotel Manila | Pasay | 200–500 | ₱2,300–3,500 | T2–T4 |
| 6 | Shangri-La The Fort | BGC | 200–800 | ₱3,000–5,000 | T3–T5 |
| 7 | Shangri-La Makati | Makati | 200–600 | ₱3,000–4,800 | T3–T5 |
| 8 | Edsa Shangri-La | Mandaluyong | 200–500 | ₱2,500–3,800 | T2–T4 |
| 9 | Solaire Resort & Casino | Pasay | 200–800 | ₱3,000–5,500 | T3–T5 |
| 10 | Okada Manila | Parañaque | 250–1,000 | ₱2,500–4,500 | T2–T4 |
| 11 | City of Dreams Manila | Parañaque | 200–500 | ₱2,800–4,500 | T2–T5 |
| 12 | Resorts World Manila | Pasay | 200–600 | ₱2,200–3,800 | T2–T4 |
| 13 | Grand Hyatt Manila | BGC | 200–600 | ₱2,800–4,500 | T2–T5 |
| 14 | Hyatt Regency Manila | Pasay | 200–500 | ₱2,200–3,500 | T2–T4 |
| 15 | Diamond Hotel | Manila | 150–350 | ₱2,000–3,200 | T2–T4 |
| 16 | Dusit Thani Manila | Makati | 200–600 | ₱2,300–3,500 | T2–T4 |
| 17 | New World Makati Hotel | Makati | 150–400 | ₱2,200–3,500 | T2–T4 |
| 18 | Fairmont Makati | Makati | 200–400 | ₱2,500–4,000 | T2–T4 |
| 19 | Raffles Makati | Makati | 100–200 | ₱3,500–5,500 | T3–T5 |
| 20 | Holiday Inn Makati | Makati | 150–350 | ₱1,800–2,800 | T1–T3 |
| 21 | I'M Hotel Makati | Makati | 100–250 | ₱1,800–2,800 | T1–T3 |
| 22 | Discovery Suites Ortigas | Ortigas | 100–250 | ₱1,800–2,800 | T1–T3 |
| 23 | Discovery Primea | Makati | 150–350 | ₱2,500–3,800 | T2–T4 |
| 24 | Crowne Plaza Manila Galleria | Ortigas | 200–500 | ₱2,000–3,200 | T1–T3 |
| 25 | Acacia Hotel Manila | Alabang | 150–400 | ₱1,800–2,800 | T1–T3 |
| 26 | Bayleaf Hotel Intramuros | Intramuros | 100–250 | ₱1,800–2,800 | T1–T3 |
| 27 | Joya Lofts and Towers | Rockwell | 80–150 | ₱2,000–3,000 | T2–T3 |
| 28 | The Linden Suites | Ortigas | 100–200 | ₱1,800–2,800 | T1–T3 |
| 29 | Seda Vertis North | QC | 150–300 | ₱1,800–2,800 | T1–T3 |
| 30 | Seda BGC | BGC | 150–300 | ₱1,800–2,800 | T1–T3 |
| 31 | Ascott BGC | BGC | 100–250 | ₱2,000–3,200 | T2–T3 |
| 32 | Belmont Hotel Manila | Pasay | 150–300 | ₱1,800–2,800 | T1–T3 |
| 33 | Wack Wack Resort & Country Club | Mandaluyong | 200–500 | ₱2,200–3,500 | T2–T4 |
| 34 | Manila Polo Club | Makati | 200–500 | ₱2,500–4,000 | T2–T4 |
| 35 | Manila Yacht Club | Manila | 150–300 | ₱2,000–3,000 | T2–T3 |
| 36 | The Manor at Camp John Hay | Baguio | 100–250 | ₱2,000–3,500 | T2–T4 |
| 37 | The Bellevue Hotel Alabang | Alabang | 200–500 | ₱2,000–3,200 | T1–T3 |
| 38 | Crimson Hotel Filinvest City | Alabang | 200–400 | ₱2,200–3,200 | T2–T3 |
| 39 | Vivere Hotel | Alabang | 150–350 | ₱2,000–3,000 | T2–T3 |
| 40 | Eastwood Richmonde Hotel | QC | 150–300 | ₱1,800–2,500 | T1–T3 |
| 41 | F1 Hotel Manila | BGC | 150–300 | ₱2,000–2,800 | T1–T3 |
| 42 | Henann Regency Resort | Boracay | 150–400 | ₱3,000–5,000 | T3–T5 |
| 43 | Crimson Resort Mactan | Cebu | 200–500 | ₱2,800–4,500 | T2–T5 |
| 44 | Shangri-La Mactan Cebu | Cebu | 250–600 | ₱3,500–5,500 | T3–T5 |
| 45 | Plantation Bay Cebu | Cebu | 150–400 | ₱2,500–4,000 | T2–T4 |
| 46 | The Henry Hotel Manila | Pasay | 80–150 | ₱2,200–3,200 | T2–T3 |
| 47 | Crowne Plaza Galleria Cebu | Cebu | 200–500 | ₱2,000–3,200 | T1–T3 |
| 48 | Marco Polo Plaza Cebu | Cebu | 200–500 | ₱2,200–3,500 | T2–T4 |
| 49 | Pico Sands Hotel (Pico de Loro) | Batangas | 100–300 | ₱2,500–4,000 | T2–T4 |
| 50 | Sheraton Manila Bay | Pasay | 200–500 | ₱2,400–3,800 | T2–T4 |

### 11B. Garden Estates · Outdoor Venues

| # | Venue | Area | Capacity | Typical Rent ₱ | Food Arrangement | Tier Span |
|---|---|---|---|---|---|---|
| 1 | Hillcreek Gardens Tagaytay | Tagaytay | 100–220 | ₱150–250K | Preferred · no corkage | T2–T4 |
| 2 | Sonya's Garden | Tagaytay | 80–200 | ₱100–200K | Bundled (own food) | T1–T3 |
| 3 | Antonio's Tagaytay | Tagaytay | 80–180 | ₱150–250K | Bundled (own food) | T2–T4 |
| 4 | Tagaytay Highlands | Tagaytay | 100–400 | ₱180–400K | Members + accredited | T3–T5 |
| 5 | Hacienda Isabella | Tagaytay | 100–300 | ₱150–280K | Preferred + corkage | T2–T4 |
| 6 | Caleruega Church and Reception | Nasugbu | 100–300 | ₱150–300K | Preferred caterers | T2–T4 |
| 7 | Casa Ibarra Tagaytay | Tagaytay | 100–250 | ₱120–220K | Preferred + corkage | T2–T3 |
| 8 | Casa Real Tagaytay | Tagaytay | 100–200 | ₱130–230K | Preferred caterers | T2–T3 |
| 9 | Anya Resort Tagaytay | Tagaytay | 100–250 | ₱180–350K | Resort-bundled | T3–T5 |
| 10 | Domicillo Design Hotel Tagaytay | Tagaytay | 80–200 | ₱150–280K | Bundled | T2–T4 |
| 11 | Twin Lakes Hotel Tagaytay | Tagaytay | 150–400 | ₱180–350K | Bundled | T2–T4 |
| 12 | Taal Vista Hotel | Tagaytay | 200–500 | ₱2,200–3,500/pax | Bundled (hotel format) | T2–T4 |
| 13 | One Tagaytay Place | Tagaytay | 80–200 | ₱120–220K | Preferred + corkage | T2–T3 |
| 14 | Royale Tagaytay Country Club | Tagaytay | 200–500 | ₱180–400K | Members + accredited | T2–T4 |
| 15 | Forest Club Tagaytay | Tagaytay | 100–300 | ₱150–280K | Accredited caterers | T2–T4 |
| 16 | Burol Drive Tagaytay | Tagaytay | 100–200 | ₱120–220K | Preferred + corkage | T2–T3 |
| 17 | Lakeshore Antipolo | Antipolo | 100–300 | ₱130–250K | Preferred + corkage | T2–T3 |
| 18 | Pinto Art Museum | Antipolo | 100–250 | ₱150–280K | Preferred caterers | T2–T4 |
| 19 | Forest Grove Antipolo | Antipolo | 80–200 | ₱120–220K | Preferred + corkage | T2–T3 |
| 20 | Las Casas Filipinas de Acuzar | Bataan | 100–500 | ₱250–500K | Resort-bundled (heritage) | T3–T5 |
| 21 | Hacienda Sta Elena | Laguna | 150–400 | ₱180–350K | Preferred + corkage | T2–T4 |
| 22 | Punta Fuego | Batangas | 100–300 | ₱200–400K | Members + bundled | T3–T5 |
| 23 | Pico de Loro | Batangas | 100–300 | ₱200–400K | Members + bundled | T3–T5 |
| 24 | Glass Garden Pasig | Pasig | 100–250 | ₱150–280K | Preferred + corkage | T2–T4 |
| 25 | Fernwood Gardens (QC) | QC | 100–250 | ₱130–250K | Preferred + corkage | T2–T3 |
| 26 | Verdana Homes Mamplasan | Laguna | 100–250 | ₱130–250K | Preferred + corkage | T2–T3 |
| 27 | Mango Farm | Antipolo | 100–250 | ₱120–220K | Preferred + corkage | T2–T3 |
| 28 | Casa San Pablo | Laguna | 80–200 | ₱120–220K | Bundled | T2–T3 |
| 29 | Estancia Resort Lipa | Batangas | 150–400 | ₱150–280K | Bundled | T2–T4 |
| 30 | Mountain Lake Resort Caliraya | Laguna | 100–300 | ₱150–280K | Bundled | T2–T3 |
| 31 | Costa Garden (Tagaytay) | Tagaytay | 100–250 | ₱120–220K | Preferred + corkage | T2–T3 |
| 32 | The Gardens at Eden's Best | Tagaytay | 80–200 | ₱120–220K | Preferred caterers | T2–T3 |
| 33 | Casa Marquez (Tagaytay) | Tagaytay | 100–250 | ₱130–250K | Preferred + corkage | T2–T3 |
| 34 | Lake Kanal | Tagaytay | 80–200 | ₱120–220K | Preferred + corkage | T2–T3 |
| 35 | Thunderbird Resort Rizal | Rizal | 150–400 | ₱180–350K | Bundled | T2–T4 |
| 36 | The Glass Garden BGC | BGC | 80–200 | ₱150–280K | Preferred caterers | T2–T4 |
| 37 | Acuatico Beach Resort | Batangas | 100–300 | ₱180–400K | Bundled (destination) | T3–T5 |
| 38 | Boracay Sands | Boracay | 100–400 | ₱2,500–4,500/pax | Resort-bundled | T2–T5 |
| 39 | Movenpick Mactan | Cebu | 150–400 | ₱2,500–4,000/pax | Resort-bundled | T2–T4 |
| 40 | Bluewater Maribago | Cebu | 100–300 | ₱2,200–3,500/pax | Resort-bundled | T2–T4 |
| 41 | Costa Pacifica Baler | Aurora | 100–300 | ₱2,200–3,500/pax | Resort-bundled | T2–T4 |
| 42 | Astoria Palawan | Palawan | 100–300 | ₱2,500–4,000/pax | Resort-bundled | T2–T4 |
| 43 | El Nido Resorts | Palawan | 80–250 | ₱4,000–8,000/pax | Premium destination | T4–T5 |
| 44 | Two Seasons Coron | Palawan | 100–250 | ₱2,800–4,500/pax | Resort-bundled | T3–T5 |
| 45 | Misibis Bay | Albay | 100–300 | ₱2,500–4,000/pax | Resort-bundled | T3–T5 |
| 46 | Vista Mar Cebu | Cebu | 100–300 | ₱2,200–3,500/pax | Resort-bundled | T2–T4 |
| 47 | Henann Lagoon Boracay | Boracay | 150–400 | ₱2,800–4,500/pax | Resort-bundled | T3–T5 |
| 48 | Antonio's Garden | Tagaytay | 60–150 | ₱120–200K | Bundled | T2–T3 |
| 49 | Casa Maria Tagaytay | Tagaytay | 80–200 | ₱120–220K | Preferred + corkage | T2–T3 |
| 50 | Greenhills Garden Square | San Juan | 100–300 | ₱150–280K | Preferred caterers | T2–T3 |

### 11C. Restaurants (intimate, all-inclusive · 50–150 guests)

| # | Restaurant | Area | Capacity | Typical ₱/pax | Tier Span |
|---|---|---|---|---|---|
| 1 | Casa Marcos Banquet Hall | QC | 50–150 | ₱1,500–2,500 | T1–T2 |
| 2 | Antonio's Restaurant | Tagaytay | 50–120 | ₱2,500–4,000 | T2–T4 |
| 3 | Sonya's Garden Restaurant | Tagaytay | 50–150 | ₱1,500–2,800 | T1–T3 |
| 4 | The Old Manila (Peninsula) | Makati | 50–120 | ₱3,000–4,500 | T3–T4 |
| 5 | Spiral (Sofitel) | Pasay | 80–200 | ₱2,800–4,000 | T2–T4 |
| 6 | Cabalen | Multiple | 80–200 | ₱1,200–2,000 | T1 |
| 7 | Almon Marina | Multiple | 50–150 | ₱1,500–2,500 | T1–T2 |
| 8 | Madison 101 (QC) | QC | 100–250 | ₱1,200–2,000 | T1–T2 |
| 9 | Las Flores | BGC | 50–120 | ₱1,800–2,800 | T1–T3 |
| 10 | Café 1771 (El Pueblo) | Ortigas | 50–120 | ₱1,800–2,800 | T1–T3 |
| 11 | Annabel's | QC | 50–150 | ₱1,200–2,000 | T1–T2 |
| 12 | Mamou (Rockwell) | Makati | 40–80 | ₱2,000–3,200 | T2–T3 |
| 13 | Apartment 1B | Makati | 40–80 | ₱1,800–2,800 | T1–T3 |
| 14 | Wildflour (Forbes) | Makati | 40–80 | ₱2,000–3,200 | T2–T3 |
| 15 | Lucky Chinatown Function Hall | Manila | 100–300 | ₱1,200–2,000 | T1–T2 |
| 16 | Tisa Filipinas | Makati | 50–150 | ₱1,500–2,500 | T1–T2 |
| 17 | Cibo di M | Makati | 50–120 | ₱1,500–2,500 | T1–T2 |
| 18 | Romulo Café | Multiple | 50–120 | ₱1,500–2,500 | T1–T2 |
| 19 | Manam | Multiple | 60–150 | ₱1,200–2,000 | T1 |
| 20 | Sofia's Garden | Tagaytay | 50–120 | ₱1,500–2,500 | T1–T2 |
| 21 | Bag of Beans | Tagaytay | 60–150 | ₱1,200–2,200 | T1–T2 |
| 22 | Marcia Adams | Tagaytay | 50–120 | ₱1,500–2,500 | T1–T2 |
| 23 | Balay Dako | Tagaytay | 100–300 | ₱1,200–2,200 | T1–T2 |
| 24 | Breakfast at Antonio's | Tagaytay | 60–150 | ₱1,500–2,500 | T1–T2 |
| 25 | Verbena (Discovery Country Suites) | Tagaytay | 80–200 | ₱2,000–3,200 | T2–T3 |
| 26 | Café Voi La | Tagaytay | 60–150 | ₱1,500–2,500 | T1–T2 |
| 27 | Nurture Wellness Village | Tagaytay | 60–150 | ₱1,500–2,800 | T1–T2 |
| 28 | Casa Vela | Manila | 50–120 | ₱1,500–2,500 | T1–T2 |
| 29 | Dolce | Multiple | 50–120 | ₱1,500–2,500 | T1–T2 |
| 30 | Café Adriatico (LRI Plaza) | Makati | 60–150 | ₱1,500–2,500 | T1–T2 |

### 11D. Catholic Churches with Wedding Cost Estimates

> **Disclaimer**: Donations vary widely based on parishioner status, day/time slot, choir/musician add-ons, length of ceremony. Verify with each parish directly. The figures below reflect typical reported ranges from common knowledge.

#### Premium Heritage / Iconic Churches (₱40K–150K typical)

| # | Church | Area | Donation Range | Notes |
|---|---|---|---|---|
| 1 | San Agustin Church | Intramuros | ₱60K–150K | UNESCO heritage; iconic colonial-era |
| 2 | Manila Cathedral | Intramuros | ₱40K–100K | Catholic seat of Manila Archdiocese |
| 3 | Santuario de San Antonio | Forbes Park, Makati | ₱40K–100K | Forbes elite parish |
| 4 | Santuario de la Sagrada Familia | Tagaytay | ₱40K–80K | Tagaytay premium |
| 5 | Caleruega Church | Nasugbu | ₱40K–100K | Hilltop, destination |
| 6 | Mary the Queen Parish | Greenhills | ₱30K–80K | Greenhills/San Juan elite |
| 7 | Christ the King Mission Seminary | QC | ₱30K–60K | Modernist architecture |
| 8 | St. James the Great Parish | Ayala Alabang | ₱30K–80K | Alabang elite |
| 9 | St. Andrew the Apostle | Bel-Air, Makati | ₱30K–60K | Bel-Air parish |

#### Major Metro Manila Parishes (₱20K–50K typical)

| # | Church | Area | Donation Range | Notes |
|---|---|---|---|---|
| 10 | Don Bosco Makati | Makati | ₱25K–50K | Salesian-run |
| 11 | Sanctuary of the Holy Face | San Juan | ₱25K–50K | San Juan parish |
| 12 | EDSA Shrine | Mandaluyong | ₱20K–40K | Marian shrine |
| 13 | Immaculate Conception Cathedral | Cubao | ₱20K–40K | Cubao seat |
| 14 | St. Anne Parish | Taguig | ₱15K–35K | Taguig parish |
| 15 | Most Holy Redeemer Parish | Mandaluyong | ₱15K–35K | Mandaluyong |
| 16 | Our Lady of Guadalupe | Makati | ₱15K–30K | Guadalupe |
| 17 | St. John Bosco Parish | Tondo | ₱10K–25K | Tondo |
| 18 | Christ the King Parish | Greenmeadows | ₱20K–40K | Greenmeadows |
| 19 | Our Lady of Lourdes Parish | QC | ₱20K–40K | Retiro |
| 20 | Holy Family Parish | Roxas District, QC | ₱15K–30K | QC parish |

#### Standard Parish Churches (₱5K–25K typical)

| # | Church | Area | Donation Range | Notes |
|---|---|---|---|---|
| 21 | Quiapo Church | Manila | ₱8K–25K | Black Nazarene |
| 22 | Binondo Church | Manila | ₱8K–25K | Chinatown |
| 23 | Santo Niño Parish (multiple) | Multiple | ₱5K–20K | Various locations |
| 24 | San Isidro Labrador | Multiple | ₱5K–20K | Various |
| 25 | St. Anne Parish (Hagonoy) | Bulacan | ₱5K–15K | Provincial |
| 26 | San Pedro Parish (Laguna) | Laguna | ₱5K–15K | Provincial |
| 27 | Most parish churches outside Metro | Provincial | ₱3K–10K | Lower donations |
| 28 | Diocesan shrines (provincial) | Provincial | ₱8K–20K | Standard parish rate |
| 29 | Chapels in subdivisions | Suburban | ₱5K–15K | Smaller weddings |
| 30 | School chapels (alumni-only typically) | Various | ₱10K–30K | Members/alumni |

#### Christian Protestant / Other (₱5K–30K typical)

| # | Church Type | Donation Range | Notes |
|---|---|---|---|
| 31 | Born Again Christian | ₱5K–25K | Varies widely by congregation |
| 32 | Iglesia ni Cristo | ₱5K–20K | Members-only weddings |
| 33 | Methodist | ₱10K–30K | Established congregations |
| 34 | UCCP | ₱5K–20K | Various locations |
| 35 | Episcopal / Anglican | ₱15K–30K | Few PH parishes |
| 36 | Christian Non-denominational | ₱5K–25K | Wide variation |

#### Civil Ceremonies (₱500–₱3K typical)

| # | Venue | Donation/Fee | Notes |
|---|---|---|---|
| 37 | City Hall Marriage Office (Manila/QC/Makati/etc.) | ₱500–1,500 | Civil registrar fees |
| 38 | Judge / Justice of the Peace | ₱2K–5K | Officiant fee + court fees |
| 39 | Mayor's Office (small towns) | ₱500–1,500 | Mayor as officiant in some LGUs |

### 11E. Additional Ceremony Options

- **Beach/destination ceremonies** at Boracay, Palawan, Cebu — bundled with resort venue
- **Private home / family chapel ceremonies** — coordinator-arranged, no parish donation
- **Garden ceremony at reception venue** — 30–60% of garden estates host both ceremony + reception

---

## 12. Open Items for V1.5 Vendor Data Collection

When Din Phase 3 opens vendor onboarding, prioritize collecting:

1. **Venue inclusion manifests** — every package's full list of bundled extras (cake tiers, suites, car hours, flowers scope, AV details)
2. **Recommended caterer pairings** — which caterers each venue prefers; corkage rates for outside
3. **Stylist `absorbs_categories[]`** — what each stylist's full-service tier actually includes
4. **Photographer coverage scope** — pre-nup / wedding / SDE / album declarations per studio
5. **Church wedding donations** — current published rates (most PH parishes don't publish online; this is direct outreach)
6. **Capacity ranges per layout** — venues often quote one max but support multiple layouts at different counts
7. **Pricing per-pax tiers** — Silver/Gold/Platinum or equivalent breakdowns
8. **Tier self-declaration** — vendors declare which per-head tiers (T1–T5) they fit

---

*Last updated: 2026-05-10. Tier model: per-head spend, 5 tiers (Simple / Charming / Grand / Distinguished / Luxurious). Wedding flow: tier-first wizard with stick-or-play budget flexibility. Vendor registration mirrors the plan builder's match criteria. Sub-events linked via parent_event_id; sibling events linked via linked_to_event_id. Post-wedding coordination tasks include marriage cert pickup, honeymoon, registry. This reference is illustrative; verify all venue data and prices through direct vendor contact or post-Setnayan-Din verified listings.*
