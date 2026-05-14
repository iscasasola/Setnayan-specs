# Setnayan Decision Tree Specification

**Document:** 08_Decision_Tree_Specification
**Version:** 1.0
**Status:** Canonical reference
**Audience:** Product, engineering, content, AI ops
**Purpose:** Define exactly what Setnayan handles via deterministic rules, lookups, calculators, and wizards — and where the system escalates to AI.

---

## Part 1 — Architecture Overview

### 1.1 The Three-Layer Guidance System

Setnayan's planning intelligence is organized as three sequential layers. A couple's question is resolved at the lowest possible layer; only what cannot be resolved deterministically falls through to AI.

```
+----------------------------------------------------------+
|  Layer 1 — Smart Defaults (preempt the question)         |
|  - Filipino wedding template auto-loaded at signup       |
|  - 46 categories pre-populated with typical structure    |
|  - 30-row reception flow pre-built                       |
|  - Vendor lead-time reminders pre-scheduled              |
+----------------------------------------------------------+
                          |
                  question still arises
                          v
+----------------------------------------------------------+
|  Layer 2 — Decision Tree (deterministic, free)           |
|  - 14 problem domains, ~100 flowcharts                   |
|  - Calculators (12 specced)                              |
|  - Wizards (8 specced)                                   |
|  - Lookups (15 reference tables)                         |
|  - Pre-written content library (15+ articles)            |
+----------------------------------------------------------+
                          |
                  no clean deterministic answer
                          v
+----------------------------------------------------------+
|  Layer 3 — AI Fallback (Kasalan)                    |
|  - Generative tasks (vows, briefs, custom comparisons)   |
|  - Open-ended emotional support                          |
|  - Personalized analysis beyond rule-based matching      |
|  - 3 free conversations lifetime, then PHP 49 per session|
+----------------------------------------------------------+
                          |
                 sensitive / commercial / legal
                          v
+----------------------------------------------------------+
|  Layer 4 — Setnayan Staff (human escalation)                 |
|  - Vendor disputes, refunds, complex coordination        |
|  - Crisis response (vendor cancellation, no-shows)       |
|  - Couples that explicitly request a human               |
+----------------------------------------------------------+
```

### 1.2 Why Deterministic-First

The architecture is intentionally deterministic-first for four reasons:

1. **Cost** — every AI conversation costs Setnayan real LLM dollars. Decision-tree paths cost nothing per request and are profitable from the first user.
2. **Consistency** — the same question yields the same answer for every couple. No hallucinations, no drift between sessions, no "but the AI told my friend something different."
3. **Auditability** — every terminal action is tied to a typed component, a lookup row, or a piece of pre-written content. Product can change a number once and every couple sees the update next planning session.
4. **Speed** — flowcharts resolve in <100ms. AI responses take 2–8 seconds. For a stuck couple at 11pm, perceived speed matters.

### 1.3 The "I'm Stuck" Button

The decision tree is invoked from three entry points, but the canonical one is the **"I'm stuck"** button visible on every authenticated screen of the Setnayan couple app.

```
[I'm stuck button pressed]
    |
    v
[Detect current screen context]
    |
    +-- Couple is on Vendor screen   -> preselect "Vendor decisions" domain
    +-- Couple is on Budget screen   -> preselect "What's our budget?" domain
    +-- Couple is on Guest screen    -> preselect "How many guests?" domain
    +-- Couple is on Dashboard       -> show full 14-domain selector
    |
    v
[Domain selector OR direct flowchart entry]
    |
    v
[Q1 of selected flowchart]
```

The other two entry points are:

- **Search** in the global header (typed natural-language query mapped to closest flowchart trigger).
- **Kasalan AI** chat input — when the AI detects a question that has a deterministic answer, it routes back to the decision tree before consuming a free quota slot.

### 1.4 When AI Is Invoked and How Usage Is Tracked

AI is invoked only when one of the following is true:

1. The flowchart explicitly terminates in `ai_fallback`.
2. The user clicks "Ask Kasalan" from any screen with their own query.
3. The decision tree returns a result and the user follows up with a free-form question.

Tracking:

- Each couple gets **3 free Kasalan conversations** for the lifetime of their wedding.
- Conversations are scoped: a single conversation can have many turns until 30 minutes of inactivity, after which it closes.
- After 3 conversations, the couple sees a paywall: PHP 49 per additional conversation (or PHP 199/month unlimited within the engagement period).
- The decision tree never consumes quota. Every deterministic path is free forever.

---

## Part 2 — Top-Level Routing

When the "I'm stuck" button shows the full domain selector, the couple chooses one of fourteen problem domains. Each domain is a top-level branch with 5–15 sub-flowcharts.

| #  | Domain                              | One-liner                                                   |
|----|-------------------------------------|-------------------------------------------------------------|
| 1  | Where do I start?                   | Orientation, pathway selection, "what's first" questions    |
| 2  | When is our wedding?                | Date selection and lead-time validation                     |
| 3  | Where will it be?                   | Venue type, region, ceremony/reception placement            |
| 4  | How many guests?                    | Guest count, list-trimming, plus-ones, kids, sponsors       |
| 5  | What's our budget?                  | Setting and allocating budget across 46 categories          |
| 6  | What vibe do we want?               | Aesthetic, mood, color, style direction                     |
| 7  | Vendor decisions                    | Per-vendor selection, comparison, packages, briefs          |
| 8  | Filipino-Catholic specifics         | Pre-Cana, marriage license, Mass, traditions, Ninong/Ninang |
| 9  | Attire decisions                    | Gowns, suits, rings, entourage, children                    |
| 10 | Stationery decisions                | Save-the-date, invitations, programs, signage               |
| 11 | Day-of execution                    | Run-of-show, vendor arrivals, emergency kit, contingencies  |
| 12 | Disagreements                       | Partner conflict, family pressure, money strings            |
| 13 | Crisis handling                     | Cancellations, weather, postponement, no-shows              |
| 14 | Post-wedding tasks                  | Marriage cert, ID updates, settlement, photo deliverables   |

Each domain in Part 3 expands into the specific flowcharts a couple may hit.

---

## Part 3 — Detailed Flowcharts

This is the bulk of the document. Each domain opens with context, then enumerates its constituent stuck-moment flowcharts.

### Domain 1 — Where do I start?

**Context.** Most couples open Setnayan within 24 hours of saying yes or within 48 hours of choosing a date. Their first question is rarely tactical — it is "where do we even begin." Domain 1 catches these orientation moments and routes the couple to either the standard pathway, a starter checklist, or a tighter prioritization view.

#### Flowchart 1.1: I just signed up — what now?

Trigger: First open of the app after signup, OR "I'm stuck" pressed on Dashboard with `daysSinceSignup <= 1`.

```
Q1: How would you describe where you are right now?
   |-- We just got engaged, no date yet            -> Flowchart 2.2 (date recommender)
   |-- We have a target date but nothing booked    -> Smart defaults preview + 90-day starter (1.2)
   |-- We're already mid-planning, need to catch up -> Top-3 prioritizer (1.3)
   `-- I have no idea what we even need            -> Defaults walkthrough (1.4)

Terminal actions:
  - smart_defaults_preview -> Wizard: 4-step intro to the auto-loaded Filipino template
  - flowchart 1.2, 1.3, 1.4 -> linked downstream
```

#### Flowchart 1.2: We just got engaged — what's first?

Trigger: User selects "We just got engaged" on 1.1, OR types "what's first" in search.

```
Q1: How long until your target wedding date?
   |-- 0-6 months   -> Tight-timeline checklist (terminal: PreWrittenContent "0-6 months kit")
   |-- 6-12 months  -> Standard 90-day starter checklist (terminal: Wizard "starter_90d")
   |-- 12-18 months -> Comfortable runway checklist (terminal: PreWrittenContent "12-18 months kit")
   `-- 18+ months   -> Long-runway plan (terminal: PreWrittenContent "long-runway plan")

Terminal actions:
  - starter_90d -> 90-day wizard: book photographer, book venue, set budget, draft guest list
```

#### Flowchart 1.3: I'm overwhelmed — what's the most important thing?

Trigger: "overwhelmed" or "where to focus" in search, OR "I'm stuck" while logged in user has `incompleteTaskCount > 15`.

```
Q1: How many days until your wedding?
   |-- <=30 days   -> Day-of focus: emergency kit + final vendor confirmations
   |-- 31-90 days  -> Critical path: stationery, RSVP follow-up, run-of-show finalization
   |-- 91-180 days -> Bookings: lock missing major vendors, finalize budget
   `-- >180 days   -> Foundation: date, venue, photographer, budget skeleton

Terminal action: top_3_priorities_card with each step linked to its calculator/wizard
```

#### Flowchart 1.4: I don't even know what we need

Trigger: User selected "I have no idea what we need" on 1.1, OR new user dismissed the smart-defaults preview.

```
Q1: Walk me through the entire structure?
   |-- Yes, give me the full overview -> Defaults preview (visual tour of 46 categories)
   `-- No, just the top 10 things     -> Top-10 vendor cheatsheet

Terminal action:
  - defaults_preview -> animated overlay tour through the auto-loaded Filipino template
  - top_10_cheatsheet -> PreWrittenContent "PH wedding top 10 categories"
```

#### Flowchart 1.5: I want to do everything DIY

Trigger: User typed "DIY" or selected "DIY pathway" during onboarding.

```
Q1: Which parts do you want to DIY vs hire?
   |-- Stationery only                          -> DIY stationery toolkit (templates + Canva links)
   |-- Stationery + decor                       -> DIY decor checklist + risk warning
   |-- Stationery + decor + coordination        -> DIY end-to-end with explicit risk modal
   `-- Everything including catering            -> AI fallback (high-risk, needs personalization)

Terminal actions:
  - DIY-toolkit components per scope
  - High-risk paths show an explicit red-flag modal listing common DIY failure modes
```

---

### Domain 2 — When is our wedding?

**Context.** Date selection drives everything: vendor availability, parish slot, weather risk, pricing tier, lead time on stationery, gown sourcing window. Domain 2 has six flowcharts that handle every variant of the date question.

#### Flowchart 2.1: We have a target date — is it auspicious?

Trigger: User entered a date in onboarding, OR pressed "is this date OK" on the wedding-date setting.

```
Q1: What's your target date?
   -> user inputs date

Q2: System auto-checks against:
   |-- Liturgical calendar (Lent, Holy Week, Christmas Octave) -> flag if conflict
   |-- Public holidays                                          -> flag heavy-traffic dates
   |-- Ber-month surge (Sep-Dec)                                -> flag price multiplier
   |-- Rainy-season risk (Jun-Oct) for outdoor venues           -> flag weather risk
   `-- Current parish booking lead times (default: 6 months)    -> flag if too short

Terminal action: date_validator_report
   - status: "Clear" / "Caution" / "Block"
   - per-flag explanation
   - link to flowchart 2.2 if user wants alternatives
```

#### Flowchart 2.2: We don't have a date yet — when should we aim for?

Trigger: User has not entered a target date.

```
Q1: How long do you want to be engaged?
   |-- <=6 months  -> Show next 6 months calendar with risk overlays
   |-- 6-12 months -> Show months 6-12 with risk overlays
   |-- 12-18 months -> Show months 12-18 with risk overlays
   `-- Flexible     -> System recommends optimal window

Q2: Region preference?
   -> injects region-specific weather and vendor density data

Q3: Style preference?
   |-- Outdoor / garden / beach -> push toward Nov-Apr in PH
   |-- Indoor only              -> no weather constraint; optimize for vendor availability
   `-- No preference            -> balanced recommendation

Terminal action: date_recommendation_tool
   - returns top 3 candidate dates with rationale per date
```

#### Flowchart 2.3: Is our timeline realistic?

Trigger: "is this timeline ok" search, OR user changed wedding date and the system detects a tighter-than-typical window.

```
Q1: System computes daysToWedding from today.

Q2: Per major vendor category, system compares daysToWedding to the lead-time table:
   |-- Photographer (recommended >=6mo, urgent <2mo)
   |-- Venue (recommended >=9mo, urgent <3mo)
   |-- Coordinator (recommended >=4mo, urgent <1mo)
   |-- Caterer (recommended >=6mo, urgent <2mo)
   |-- Gown custom (recommended >=6mo, RTW >=3mo)
   |-- Suit (recommended >=3mo)
   |-- Rings custom (recommended >=4mo, RTW >=1mo)
   `-- Stationery (recommended >=3mo print, >=1mo digital)

Terminal action: timeline_feasibility_report
   - per-vendor verdict: "On time" / "Tight" / "Risky" / "Too late"
   - actions: skip-to-RTW for tight items, switch to digital, raise alarm
```

#### Flowchart 2.4: What month is best for our region?

Trigger: User typed "best month" or browsed the date recommender beyond top 3.

```
Q1: Which region/city?
   |-- NCR
   |-- Tagaytay
   |-- Batangas
   |-- Cebu
   |-- Boracay
   |-- Palawan
   |-- Davao
   `-- Other

Q2: Indoor or outdoor?

Terminal action: region_month_matrix_lookup
   - returns 12-row monthly matrix: weather risk, vendor surge, price multiplier
```

#### Flowchart 2.5: We want to elope or do civil only — what's different?

Trigger: User typed "civil," "elope," or "courthouse."

```
Q1: Is this a civil-only ceremony, or civil now + church later?
   |-- Civil only (no Catholic ceremony)
   |-- Civil now + Catholic later (within 1 year typical)
   `-- Catholic only (no civil — note: in PH the civil license is required)

Terminal action:
  - civil-only flow: courthouse / judge / municipal hall steps
  - hybrid: explainer + dual timeline
  - "Catholic only" path triggers correction (license is mandatory) + redirects to 8.2
```

#### Flowchart 2.6: How long should our engagement be?

Trigger: "how long should we be engaged" search.

```
Q1: What constraints exist?
   |-- Budget driving timeline (need time to save)
   |-- Family / venue availability
   |-- Pregnancy / immigration / military deployment
   `-- No constraints — just want guidance

Terminal action: PreWrittenContent "Choosing your engagement length"
   - PH norm: 9-14 months for full Catholic
   - 6 months viable but tight
   - <3 months: civil first or destination short-list
```

---

### Domain 3 — Where will it be?

**Context.** Venue is the single largest booking decision after photographer. It anchors the date (parish slot vs reception slot), drives 60% of guest experience, and determines weather risk, parking, transport, decor, sound, and catering constraints. Seven flowcharts cover the full venue decision space.

#### Flowchart 3.1: Hotel vs garden vs beach — how do we choose?

Trigger: User pressed "I'm stuck" on venue selection, OR typed "venue type."

```
Q1: Indoor only, outdoor only, or open?
   |-- Indoor only -> narrow to hotels, halls, indoor function rooms
   |-- Outdoor only -> garden / beach / rooftop short-list
   `-- Open to both -> continue to Q2

Q2: How important is weather guarantee?
   |-- Very important (no plan B) -> indoor only
   |-- Somewhat (plan B acceptable) -> indoor or covered outdoor
   `-- Not important               -> all options

Q3: How formal?
   |-- Very formal -> hotel ballroom, classical hall
   |-- Semi-formal -> garden estate, country-style
   `-- Casual      -> beach, farm, garden

Terminal action: venue_type_recommendation_card with 3 venue archetypes
```

#### Flowchart 3.2: Where in the Philippines?

Trigger: User typed "where to get married," or selected "I haven't decided region."

```
Q1: Will most guests fly in or are most local?
   |-- Local — keep it close       -> NCR / Calabarzon shortlist
   |-- Mixed — hybrid              -> Tagaytay / Batangas / Cavite
   `-- Destination — guests travel -> Cebu / Bohol / Boracay / Palawan / La Union

Q2: Vendor density preference?
   -> System pulls vendor count by region from directory and shows top 3

Terminal action: region_recommendation_card with vendor-density and travel-cost overlay
```

#### Flowchart 3.3: How do we pick a venue from a shortlist?

Trigger: User has 2-4 venues in mind and presses "compare venues."

```
Q1: How many venues are you comparing?
   -> opens the venue_comparison_tool with N rows

System collects per venue:
   - Capacity range (min/max guests)
   - Daily rate / per-event rate
   - In-house catering required? Y/N
   - Parking (number of slots)
   - Transport accessibility (highway, public)
   - Decor restrictions (open-flame, hanging fixtures, etc.)
   - Power capacity
   - In-house sound? Y/N
   - Bridal suite available?
   - Parish/ceremony venue distance

Terminal action: side_by_side_table with weighted score per venue
```

#### Flowchart 3.4: Should church and reception be at the same place?

Trigger: User typed "same venue church reception" or pressed "I'm stuck" on the ceremony+reception logistics.

```
Q1: Is your ceremony Catholic Mass at a parish?
   |-- Yes, parish Mass -> must be at parish, reception elsewhere
   |-- Civil only       -> can be anywhere, including same venue
   `-- Catholic at non-parish (rare, requires bishop dispensation) -> flag, route to AI

Q2: How far is the parish from your reception venue?
   |-- 0 (same venue, civil) -> no transport needed
   |-- <30 minutes           -> standard buffer
   |-- 30-60 minutes         -> 90-min buffer + bridal car cushion
   `-- >60 minutes           -> consider second venue or AI escalation

Terminal action: logistics_decision_card with transport timing and bridal-car implications
```

#### Flowchart 3.5: Indoor vs outdoor in [season]?

Trigger: User has a date and venue type but is uncertain about weather.

```
Q1: System reads wedding date.
Q2: User confirms region.
Q3: User selects venue type (indoor/outdoor/covered).

System computes:
   - Historical rainfall percentile for that region+month
   - Typhoon-season overlap
   - Outdoor risk score: 1-10

Terminal action: weather_risk_calculator output
   - <3:  comfortable outdoor
   - 3-6: outdoor with covered backup recommended
   - >6:  indoor or hard tent required
```

#### Flowchart 3.6: Destination wedding — is it worth it?

Trigger: User has a destination region selected and presses "I'm stuck."

```
Q1: How many guests can realistically travel?
   -> if <40% of invited list, flag concern

Q2: Do you have time to scout in person?
   -> if no, flag concern (destination weddings benefit from physical scouting)

Q3: Are you OK with vendor selection being thinner than NCR?
   -> if no, flag concern (lower vendor density)

Terminal action: destination_wedding_cost_complexity_card
   - guest travel cost estimate
   - vendor travel surcharge estimate
   - logistics complexity score
   - recommendation: "Yes pursue" / "Reconsider" / "Hybrid (civil here, destination later)"
```

#### Flowchart 3.7: Multi-day events — how to schedule?

Trigger: User typed "rehearsal dinner" or "post-wedding brunch" or "multi-day."

```
Q1: How many events total?
   |-- 2 (e.g., civil + church)
   |-- 3 (rehearsal dinner + main + brunch)
   `-- 4+ (bachelor/bachelorette + rehearsal + main + brunch)

Q2: Same venue or distributed?
Q3: Ceremony time of main event?

Terminal action: multi_event_timeline_calculator output
   - day-by-day schedule
   - vendor-per-event breakdown
   - guest itinerary template
```

---

### Domain 4 — How many guests?

**Context.** Guest count is the second-biggest budget multiplier after venue. Six flowcharts handle list sizing, trimming, plus-one and kids policies, sponsor count, and out-of-town hospitality.

#### Flowchart 4.1: How many should we invite?

Trigger: User opened guest list and presses "I'm stuck."

```
Q1: What's your total budget?
Q2: Region (drives per-head benchmark)?
Q3: Tier preference (Essentials / Premium / Pro Event)?

Terminal action: budget_to_guest_calculator
   - returns max guest count for that budget at chosen tier
   - returns budget-needed for a chosen guest count
```

#### Flowchart 4.2: Trim the list — who do we cut?

Trigger: User has a draft list larger than their target count.

```
Q1: Sort guests into three buckets:
   |-- Must-have (immediate family, closest friends, sponsors)
   |-- Nice-to-have (extended family, work friends, plus-ones)
   `-- Cut (haven't seen in 2+ years, parental obligation only)

Q2: How big is "must-have"?
   -> if must-have > target, flag and route to disagreement domain (12.1)

Terminal action: list_trim_assistant
   - suggests cuts in priority order
   - provides scripts for "we kept it small" social explanations
```

#### Flowchart 4.3: Plus-ones — yes or no?

Trigger: "plus one" search.

```
Q1: Default policy?
   |-- All single guests get +1                  -> cost: +X% of invited count
   |-- Engaged/long-term partners only           -> typical PH default
   |-- Married couples and engaged only          -> strict
   `-- No plus-ones                              -> very strict, may cause friction

Terminal action: plus_one_policy_card with cost overlay and script for declining +1 requests
```

#### Flowchart 4.4: Kids at the wedding?

Trigger: "kids," "children policy" search.

```
Q1: Default policy?
   |-- Kids welcome (any age)
   |-- Kids 8+ welcome
   |-- Kids of immediate family only
   `-- Adults-only

Q2: If adults-only, do you need childcare on-site?
   |-- Yes -> vendor recommendation (childcare service)
   `-- No  -> script template for declining kid invites

Terminal action: child_policy_card with cost overlay and scripts
```

#### Flowchart 4.5: Sponsors — how many?

Trigger: "sponsors," "ninong," "ninang" search.

```
Q1: Standard PH counts (default offered):
   - Principal sponsors: 7+ pairs (couples)
   - Secondary sponsors: 1 pair candle, 1 pair veil, 1 pair cord (3 pairs)
   - Bearers: ring, coin, Bible (3 individuals)
   - Flower girls: 2-4 typical

Q2: Are you trimming the count?
   |-- Following standard                  -> use defaults
   |-- Smaller (intimate)                  -> 3 pairs principal, 1 pair secondary roles
   `-- Larger (large family expectations)  -> 9-12 pairs principal, full secondary

Terminal action: sponsor_count_template + assignment wizard (links to 8.7)
```

#### Flowchart 4.6: Out-of-town and foreign guests — what do we provide?

Trigger: "out of town" or "guests flying in" search.

```
Q1: How many out-of-town guests?
   |-- <10   -> personal accommodation help
   |-- 10-30 -> block-rate hotel arrangement
   `-- 30+   -> group rate negotiation + shuttle planning

Q2: Are you providing transport?
   |-- Yes -> shuttle vendor recommendation
   `-- No  -> provide guest itinerary with public transit details

Q3: Welcome bag / hospitality tier?
   |-- None
   |-- Light (water, snack, itinerary card)
   |-- Standard (light + local treats + map)
   `-- Premium (standard + custom tote + local crafts)

Terminal action: hospitality_kit_builder
```

---

### Domain 5 — What's our budget?

**Context.** Budget is the most-consulted screen in Setnayan. Eight flowcharts cover setting, allocating, cutting, splurging, financing, and tracking — including hidden costs that surprise nearly every Filipino couple.

#### Flowchart 5.1: What does a wedding cost in PH?

Trigger: "how much wedding cost" search.

```
Q1: Where will the wedding be?
   -> injects regional benchmark
Q2: How many guests (estimate)?
Q3: Tier (Essentials / Premium / Pro Event)?

Terminal action: budget_range_calculator output
   - returns three numbers: low, mid, high estimate (e.g., 650K / 1.2M / 2.4M)
   - shows what each tier delivers
```

#### Flowchart 5.2: How should we split our budget?

Trigger: User entered total budget and pressed "allocate."

```
Q1: Apply default Filipino allocation %?
   |-- Yes -> auto-fill 46 categories with PH defaults
   `-- No  -> manual allocation per category

Q2: Any priorities (splurge / save)?
   |-- Photo/video splurge -> +5% to media, redistribute from decor
   |-- Food splurge        -> +5% to catering, redistribute from stationery + favors
   |-- Style splurge       -> +5% to decor and florals, redistribute from media
   `-- Balanced            -> no preference

Terminal action: per_category_budget_allocator output (46 rows)
```

#### Flowchart 5.3: We're over budget — where do we cut?

Trigger: "over budget" or "cut budget" search.

```
Q1: How much over (PHP)?
Q2: What categories already booked (locked)?

System lists all unbooked categories ranked by:
   - cuttability (replaceable with smart-default lower-tier)
   - couple-stated importance (from initial setup)

Terminal action: savings_opportunity_analyzer output
   - per category: current allocation, recommended cut, alternative tier
   - total savings possible
```

#### Flowchart 5.4: What's a realistic per-head cost?

Trigger: "per head" search.

```
Q1: Region?
Q2: Tier?
Q3: Inclusions (food only / food + drink / food + drink + entertainment)?

Terminal action: per_head_calculator output
   - low/mid/high per-head benchmarks
   - what each tier includes (e.g., 5-course plated vs buffet)
```

#### Flowchart 5.5: How do we pay for this?

Trigger: "how to pay," "financing" search.

```
Q1: What sources are available?
   |-- Couple savings only
   |-- Couple savings + family contribution
   |-- Couple savings + sponsorships from family
   |-- Loan
   `-- Mix

Q2: How many months until wedding?

Terminal action: payment_planner_card
   - savings runway: how much per month needed
   - vendor payment milestones: typical 30/40/30 split
   - loan caution if loan path chosen (with referral to PreWrittenContent)
```

#### Flowchart 5.6: Sponsors are paying for X — how do we track?

Trigger: "sponsor track" or "who is paying" search.

```
Q1: Set up contribution tracker?
   -> wizard: 3 steps
     - List contributors (parent, ninong, etc.)
     - Assign categories or items they cover
     - Set due-by dates aligned with vendor milestones

Terminal action: contribution_tracker_setup_wizard
```

#### Flowchart 5.7: What should we splurge on vs save on?

Trigger: "splurge vs save" search.

```
Q1: What matters most to you?
   |-- Photos and memories  -> splurge media, save decor
   |-- Food experience      -> splurge catering, save stationery
   |-- Visual / wow factor  -> splurge decor and florals, save favors and stationery
   `-- Guest comfort        -> splurge venue + AC + sound, save extras

Terminal action: priority_recommendation_card
   - shows "couples like you" data (anonymized) on what they regret splurging vs cutting
```

#### Flowchart 5.8: Hidden costs we're forgetting?

Trigger: "hidden costs," "what am I missing" search.

```
Terminal action: PreWrittenContent "Hidden Costs in Filipino Weddings"
   - vendor crew meals (5-8% of catering)
   - parking fees / valet
   - overtime fees beyond contracted hours
   - power surcharge for outdoor
   - tip / gratuity culture
   - PSA / license fees + transport for them
   - rings sizing + insurance
   - dress alterations
   - emergency contingency 5% of total
```

---

### Domain 6 — What vibe do we want?

**Context.** Vibe drives style, palette, decor, and vendor brief. Couples often disagree here — Domain 6 includes a structured disagreement-resolution flowchart that complements Domain 12.

#### Flowchart 6.1: We don't know our style

Trigger: User pressed "I'm stuck" on aesthetic / style screen.

```
Q1: Show 12 mood-board images (each tagged with style code).
   - Couple picks 5 favorites.

Terminal action: aesthetic_profile_calculator output
   - tally style codes from 5 picks
   - return dominant aesthetic (e.g., "Modern Filipino Garden")
   - generate 3 sample palettes
```

#### Flowchart 6.2: We disagree on style

Trigger: Both partners have completed 6.1 with different profiles.

```
Q1: Each partner privately picks 5 from a curated 24-image set.
Q2: System computes overlap.

Terminal action:
   - if >=3 overlap -> confident fusion profile
   - if 1-2 overlap -> blended profile + AI fallback offered
   - if 0 overlap   -> AI fallback (Domain 12 framing)
```

#### Flowchart 6.3: How do we describe our vibe to vendors?

Trigger: "vendor brief" or "describe vibe" search.

```
Q1: System reads aesthetic profile.
Q2: System reads palette.
Q3: System reads venue type.

Terminal action: vendor_brief_generator
   - returns 1-paragraph brief, 5 keyword tags, 3 reference image descriptors
   - couple can copy-paste into vendor inquiries
```

#### Flowchart 6.4: Color palette help

Trigger: "palette" or "colors" search.

```
Q1: System reads aesthetic profile if available, else asks "what 2-3 words describe your vibe?"
Q2: Show 6 candidate palettes filtered by season + venue + aesthetic.

Terminal action: palette_picker -> saved to wedding profile
```

#### Flowchart 6.5: Filipino-modern vs traditional — how to blend?

Trigger: "modern vs traditional" search.

```
Q1: How many traditional elements do you want?
   |-- Full traditional (Mass, full sponsors, candles, cord, veil, coins, doves)
   |-- Most traditional with minor modern (palette, decor)
   |-- Modern Filipino fusion (subset of traditions, modern aesthetic)
   `-- Mostly modern, light cultural touch (e.g., barong groom, Filipino music)

Terminal action: PreWrittenContent "Filipino Wedding Tradition Blend Guide"
   - per-tradition modernization options
```

---

### Domain 7 — Vendor decisions

**Context.** This is the largest domain — every vendor category has its own micro-flowchart. Below, vendor categories are organized into sub-domains. Each sub-domain ends with a generic "vendor inquiry template" link.

#### 7.1 Photographer

##### Flowchart 7.1.1: Photographer — when to book?

Trigger: "I'm stuck" on photographer screen, OR "when book photographer" search.

```
Q1: Days until wedding?
   |-- >=9 months -> standard window, full vendor pool
   |-- 6-9 months -> standard window, ber-month dates may be tight
   |-- 3-6 months -> tight, pull from "next available" filter
   |-- 1-3 months -> urgent, pull from "open this month" filter
   `-- <1 month   -> emergency, route to Setnayan Staff

Terminal action: photographer_lead_time_card
```

##### Flowchart 7.1.2: How to compare 3 photographers?

Trigger: User shortlists 2-4 photographers.

```
Q1: Open vendor_comparison_tool prefilled with photographers.

System collects:
   - Years experience
   - Setnayan Recommended badge?
   - Package price
   - Hours included
   - Number of shooters
   - Albums included
   - Highlight reel included
   - Engagement shoot included
   - Sample wedding count
   - Aesthetic match (compared to couple's profile)

Terminal action: side_by_side_score with weighted output
```

##### Flowchart 7.1.3: Solo / Duo / Premium — which Setnayan Photo Team?

Trigger: User considering Setnayan's in-house photo teams.

```
Q1: Guest count?
Q2: Hours of coverage needed?
Q3: Aesthetic preference (clean / cinematic / editorial)?

Terminal action: setnayan_photo_team_matchmaker
   - Solo:    <100 guests, 6h max, clean
   - Duo:     100-250 guests, 8-10h, cinematic
   - Premium: 250+ or premium aesthetic, 10+h, editorial
```

##### Flowchart 7.1.4: 4-hour vs 8-hour package — what's the difference?

Trigger: "package hours" search.

```
Terminal action: PreWrittenContent "Photographer hours explained"
   - 4h:   ceremony only or reception only
   - 6h:   ceremony + portrait + early reception
   - 8h:   prep + ceremony + portraits + reception
   - 10h+: full day including prep through last dance
```

##### Flowchart 7.1.5: Shooter Slot or hire 2nd photographer?

Trigger: User considering a second shooter.

```
Q1: Guest count >150?
Q2: Two parallel locations (e.g., bridal prep + groom prep)?
Q3: Want both candid + posed simultaneously?

Terminal action:
   - if any 2 yes -> recommend Shooter Slot or 2nd photographer
   - cost comparison: Shooter Slot vs separate hire
```

#### 7.2 Coordinator

##### Flowchart 7.2.1: Do we need a coordinator?

```
Q1: Guest count?
Q2: Number of vendors total?
Q3: Single venue or split?

Terminal action: coordinator_need_score
   - >100 guests OR >8 vendors OR split venue -> strongly recommended
   - <100 guests AND <=6 vendors AND single venue -> optional, OTD only
```

##### Flowchart 7.2.2: Full vs Halfway vs On-the-Day?

```
Q1: How early do you want help?
   |-- From day 1     -> Full coordination
   |-- Last 90 days   -> Halfway
   `-- Wedding week   -> On-the-Day (OTD)

Q2: Confidence in self-managing vendors?
   |-- Low  -> Full
   |-- Mid  -> Halfway
   `-- High -> OTD

Terminal action: coordinator_tier_matchmaker
```

##### Flowchart 7.2.3: How do we know if a coordinator is good?

```
Terminal action: PreWrittenContent "Coordinator vetting checklist"
   - 8+ wedding portfolio
   - clear contract scope
   - emergency-kit included
   - team size matches event size
   - Setnayan Recommended badge
```

#### 7.3 Caterer (when not bundled)

##### Flowchart 7.3.1: Buffet vs plated vs family-style?

```
Q1: Formality?
Q2: Guest count?
Q3: Budget tier?

Terminal action:
   - formal + 100-200       -> plated
   - mid + 150-400          -> buffet
   - intimate + <=80        -> family-style
   - very large + casual    -> buffet (logistics)
```

##### Flowchart 7.3.2: Per-head pricing — what's reasonable?

```
Q1: Region?
Q2: Style (buffet/plated/family)?

Terminal action: per_head_lookup
   - buffet NCR:           PHP 950 - 2,500
   - plated NCR:           PHP 1,800 - 4,500
   - family-style premium: PHP 2,800 - 6,000
   - destination surcharge: +20-35%
```

##### Flowchart 7.3.3: Dietary requirements — how to handle?

```
Q1: Any specific restrictions?
   |-- Halal / Kosher    -> flag vendor compatibility
   |-- Vegan / vegetarian -> confirm caterer offers
   |-- Allergy-heavy     -> require pre-RSVP collection
   `-- None / minor      -> standard

Terminal action: dietary_checklist + RSVP form addition
```

#### 7.4 Florist / Stylist

##### Flowchart 7.4.1: Stylist or just a florist?

```
Q1: Do you need full visual design (entrance, ceiling, lights, layout) or just flowers?
   |-- Full design          -> stylist (often includes florals)
   |-- Florals + minor decor -> florist with decor add-on
   `-- Florals only         -> florist

Terminal action: scope_decision_card
```

##### Flowchart 7.4.2: Fresh vs silk vs mixed?

```
Q1: Budget tier?
   |-- Essentials -> silk-heavy mix
   |-- Premium    -> fresh hero pieces + silk fillers
   `-- Pro Event  -> all fresh
```

#### 7.5 HMUA (Hair, Makeup, Air-brush)

##### Flowchart 7.5.1: Bride only or full entourage?

```
Q1: Entourage size?
Q2: Budget allocation for HMUA?

Terminal action:
   - <5 entourage   -> bride + 2 mothers minimum
   - 5-10 entourage -> bride + mothers + secondary sponsors
   - 10+ entourage  -> full glam team needed (2-3 artists)
```

##### Flowchart 7.5.2: Trial session — when?

```
Terminal action: HMUA trial 4-6 weeks before, after gown fitting
```

#### 7.6 Music (Live + DJ + Host)

##### Flowchart 7.6.1: Live band, quartet, or DJ?

```
Q1: Venue acoustic constraints?
Q2: Budget?
Q3: Vibe?

Terminal action:
   - formal + ballroom + premium -> live band 6-8 piece
   - elegant + intimate          -> quartet (string)
   - modern + party              -> DJ + emcee
   - hybrid                      -> quartet ceremony + DJ reception
```

##### Flowchart 7.6.2: MC + DJ same person or separate?

```
Q1: Guest count?
   |-- <=100   -> combined often fine
   |-- 100-200 -> separate recommended
   `-- >200    -> separate required
```

##### Flowchart 7.6.3: Choir for ceremony — yes or parish-provided?

```
Q1: Parish offers choir?
   |-- Yes              -> use parish choir (saves PHP 8K-15K)
   `-- No or want custom -> external choir/quartet (PHP 12K-40K)
```

#### 7.7 Lights & Sound (when not bundled)

##### Flowchart 7.7.1: Do we need separate AV?

```
Q1: Venue has in-house AV?
   |-- Yes, sufficient -> no
   |-- Yes, basic      -> upgrade may be needed
   `-- No              -> external AV required
```

##### Flowchart 7.7.2: LED wall — worth it?

```
Q1: Guest count >150?
Q2: Slideshow / live-feed plan?
Q3: Venue is dim?

Terminal action: cost_benefit
   - all yes -> LED recommended
   - partial -> projector alternative
```

#### 7.8 Cake (when not bundled)

##### Flowchart 7.8.1: Tiers — how many?

```
Q1: Guest count?

Terminal action: cake_tier_calculator
   - <50 guests   -> 2 tiers
   - 50-100       -> 3 tiers
   - 100-200      -> 4 tiers
   - 200+         -> 5+ tiers or sheet cake supplement
```

##### Flowchart 7.8.2: Fondant vs buttercream?

```
Q1: Outdoor venue?
   |-- Yes -> fondant (heat-stable)
   `-- No  -> either; buttercream tastes better, fondant looks cleaner

Q2: Aesthetic priority?
   |-- Clean lines / sculptural -> fondant
   `-- Classic / textured       -> buttercream
```

#### 7.9 Bridal Car (when not bundled)

##### Flowchart 7.9.1: Hire vs use family car?

```
Q1: Family has a clean, well-maintained sedan/SUV available?
   |-- Yes -> use family car, save PHP 15K-40K
   `-- No  -> hire (white/cream sedan or vintage premium)

Q2: Photo aesthetic priority?
   |-- Vintage / editorial -> hire premium
   `-- Practical            -> either
```

#### 7.10 Stationery

##### Flowchart 7.10.1: Digital only or print + digital?

```
Q1: Guest age distribution?
   |-- Mostly elders / non-tech -> print
   |-- Mostly peers             -> digital + select print for elders
   `-- Mixed                    -> hybrid (digital primary, print for ninongs/parents)
```

##### Flowchart 7.10.2: Save-the-date vs straight to invitation?

```
Q1: Days from now to wedding?
   |-- >180   -> STD recommended (especially destination)
   |-- 90-180 -> optional
   `-- <90    -> skip STD, go straight to invitation
```

#### 7.11 Wedding Rings

##### Flowchart 7.11.1: Custom vs ready-to-wear?

```
Q1: Days until wedding?
   |-- >=4 months -> custom feasible
   `-- <4 months  -> RTW only (or fast-track with surcharge)

Q2: Special design requests (heirloom stone, engraving, unusual metal)?
   |-- Yes -> custom required
   `-- No  -> RTW fine
```

#### 7.12 Photo stations

##### Flowchart 7.12.1: Photobooth, glambooth, 360 — do we need any?

```
Q1: Reception length >5h?
Q2: Guest entertainment plan thin between dinner and party?
Q3: Budget for PHP 20K-60K extra?

Terminal action:
   - all yes  -> 360 (premium) or glambooth
   - partial  -> traditional photobooth
   - none     -> skip
```

#### 7.13 Specialty (perfume bar, coffee bar, food carts)

##### Flowchart 7.13.1: Worth the spend?

```
Q1: Already at Premium tier?
Q2: Reception >6h with extended cocktail?
Q3: Want a "guest takeaway" experience?

Terminal action:
   - all yes -> recommend 1-2 specialty stations
   - partial -> skip or pick one
```

#### 7.14 General vendor inquiry template

For every vendor category, the system surfaces a copy-paste inquiry template:

```
Subject: Inquiry — [Wedding date] — [Couple name]

Hi [Vendor name],

We're [Couple name] getting married on [Date] at [Venue/Region]. We have approximately
[Guest count] guests and are aiming for a [Vibe descriptors] aesthetic.

We're interested in [Category-specific package]. Could you share:
  - Availability on our date
  - Package options and pricing
  - Sample work / portfolio links
  - What's included vs add-ons
  - Booking process and reservation fee

Looking forward to hearing from you.

Thanks,
[Couple name]
```

The template auto-fills variables from the couple's wedding profile.

---

### Domain 8 — Filipino-Catholic specifics

**Context.** Filipino-Catholic weddings have distinct requirements — Pre-Cana, marriage license, canonical interview, Mass, sponsors, and a specific tradition set (coin, cord, veil, candle). Domain 8 has ten flowcharts plus seven pre-written content articles.

#### Flowchart 8.1: What's Pre-Cana / Discovery Weekend?

```
Trigger: "pre-cana" or "discovery weekend" search.
Terminal action: PreWrittenContent "What is Pre-Cana?"
   - definition
   - typical duration (1-2 days, sometimes a weekend retreat)
   - where to attend (parish-organized vs diocesan vs accredited org)
   - typical cost (PHP 500-3,000 per couple)
   - certificate requirement for marriage license
```

#### Flowchart 8.2: Marriage license — step by step

```
Trigger: "marriage license" search.
Terminal action: PreWrittenContent "Marriage License in PH" + Wizard
   1. Complete Pre-Cana (certificate output)
   2. Get CENOMAR (PSA, ~PHP 210 per person)
   3. Get PSA birth certificate (~PHP 155 per person)
   4. Apply at Local Civil Registrar (LCR) of either partner
   5. Required: CENOMAR, birth cert, IDs, Pre-Cana cert, baptism cert (Catholic)
   6. 10-day publication / posting period
   7. License issued (valid 120 days, anywhere in PH)
   8. License number written into marriage cert by officiant on wedding day
   9. Officiant submits to LCR within 15 days post-wedding
   10. PSA encoding 2-6 months later; PSA marriage cert issued
```

#### Flowchart 8.3: Canonical interview — what to expect

```
Trigger: "canonical interview" search.
Terminal action: PreWrittenContent "Canonical Interview Prep"
   - purpose: parish ensures both parties are free to marry, understand sacrament
   - typical questions (faith, freedom, fidelity, fertility/openness to children)
   - documents to bring
   - pacing: usually 30-60 minutes
   - tip: be honest, not rehearsed
```

#### Flowchart 8.4: Baptismal certificate — recent copy

```
Trigger: "baptismal cert" search.
Q1: Where were you baptized?
   -> instructions to request from that parish
Q2: How long ago?
   -> if >6 months, request "for marriage purposes" copy

Terminal action: process_tree per scenario + parish-contact template message
```

#### Flowchart 8.5: CENOMAR — how and when

```
Trigger: "cenomar" search.
Terminal action: PreWrittenContent "CENOMAR walkthrough"
   - online (PSAhelpline.ph) vs SM Business / SM Mall PSA outlet
   - cost ~PHP 210
   - turnaround: 3-5 business days online, same-day at PSA branches
   - validity: 6 months (LCR may accept <=6 months old)
```

#### Flowchart 8.6: Mass songs — choosing them

```
Q1: Default standard Mass songs?
   |-- Yes -> preset Catholic wedding song list
   `-- No  -> custom selection (within parish guidelines)

Q2: Live ensemble or recorded?
   |-- Live (choir, quartet, soloist) -> vendor route
   `-- Recorded                       -> confirm parish allows

Terminal action: mass_song_list_template
```

#### Flowchart 8.7: Mass roles — assignments

```
Standard PH Catholic roles to assign:
   - 1st Reading (1 reader)
   - Responsorial Psalm (1 psalmist or congregation)
   - 2nd Reading (1 reader)
   - Gospel Acclamation (cantor/congregation)
   - Prayers of the Faithful (1-2 readers, 4-7 petitions)
   - Offertory (2-4 bringing bread/wine)
   - Communion ministers (parish-supplied or family)
   - Coin / arras bearer (1 child)
   - Ring bearer (1 child)
   - Bible bearer (1 child)
   - Flower girls (2-4)

Terminal action: mass_role_assignment_wizard
```

#### Flowchart 8.8: Choosing Ninongs and Ninangs

```
Trigger: "choosing ninong" or "who to ask sponsor" search.
Terminal action: PreWrittenContent "How to Choose Ninongs and Ninangs"
   - role definition (witness, mentor, lifelong support)
   - typical count: 7+ pairs principal
   - selection criteria (married couples, Catholic, mentors not just rich relatives)
   - how to ask (script template)
   - secondary sponsors (candle/veil/cord) — 1 pair each
```

#### Flowchart 8.9: Coin, cord, veil, candle — what are these?

```
Trigger: "arras," "cord," "veil," "unity" search.
Terminal action: PreWrittenContent "Filipino-Catholic Wedding Traditions Explained"
   - Arras (13 coins): bride/groom's commitment to provide
   - Cord (yugal): symbolic union, draped after vow
   - Veil: protection and unity
   - Candle: light of Christ in the marriage
   - explanation of placement order in Mass
```

#### Flowchart 8.10: Mixed religions — how do we handle?

```
Q1: One Catholic, other:
   |-- Christian (Protestant)         -> dispensation; usually granted; both sign declaration
   |-- Other religion (Muslim, etc.)  -> dispensation from disparity of cult required
   |-- Non-religious / atheist        -> dispensation possible, requires interview
   `-- Both Catholic but one not practicing -> standard

Q2: Will non-Catholic family object to Catholic Mass?
   -> script / mediation guidance

Terminal action: PreWrittenContent "Mixed-Religion Weddings in PH"
   + AI fallback option for personalized guidance
```

---

### Domain 9 — Attire decisions

**Context.** Gowns, suits/barongs, rings, and entourage attire have distinct timelines and decision points. Seven flowcharts.

#### Flowchart 9.1: Custom gown vs ready-to-wear?

```
Q1: Days until wedding?
   |-- >=6 months -> custom feasible
   |-- 3-6 months -> RTW with alterations recommended
   `-- <3 months  -> RTW only

Q2: Body fit needs?
   |-- Highly specific (height, plus-size, petite) -> custom often easier
   `-- Standard                                    -> RTW fine

Q3: Vision specificity?
   |-- Have a Pinterest board with very specific design -> custom
   `-- Open to inspiration                              -> RTW
```

#### Flowchart 9.2: When to start gown shopping?

```
Q1: Custom or RTW path (from 9.1)?
   |-- Custom                  -> start >=6 months out
   |-- RTW with alterations    -> start >=3 months out
   `-- RTW off-the-rack        -> start >=6 weeks out
```

#### Flowchart 9.3: Groom — barong vs suit?

```
Q1: Venue formality?
   |-- Garden / beach / casual    -> barong (Tagalog or Mahogany)
   |-- Hotel ballroom formal      -> suit OR formal barong
   `-- Mixed venue                -> coordinator outfits to ceremony venue

Q2: Climate at venue?
   |-- Hot / outdoor -> barong (lighter, traditional)
   `-- AC / indoor   -> either

Q3: Family expectation?
   |-- Traditional -> barong
   `-- Modern      -> suit
```

#### Flowchart 9.4: Entourage attire — coordinated or freeform?

```
Q1: Entourage size?
   |-- <=8     -> easy to fully coordinate (same dress code)
   |-- 9-15    -> palette + dress code (e.g., "blush, long")
   `-- 16+     -> palette only (each picks their own)

Q2: Budget who-pays?
   |-- Couple pays all  -> must keep cost low; full coordination feasible
   |-- Entourage pays   -> palette / dress code only
   `-- Mix              -> couple covers some pieces (sash, accessories)
```

#### Flowchart 9.5: Children's attire

```
Terminal action: children_attire_checklist
   - flower girls: matched dresses, white or palette
   - bearers (ring/coin/Bible): white shirts + slacks OR mini barong
   - safety pins, backup outfit, snacks
```

#### Flowchart 9.6: Wedding rings — when to order?

```
Q1: Custom or RTW (from 7.11.1)?
   |-- Custom -> order 2-4 months out
   `-- RTW    -> order 1 month out + sizing buffer

Q2: Engraving needed?
   -> +1 week
```

#### Flowchart 9.7: Borrowed / heirloom items — incorporating them

```
Q1: What's the heirloom?
   |-- Veil           -> confirm condition, length, attachment to gown
   |-- Jewelry        -> confirm with HMUA
   |-- Rosary / Bible -> ceremony role
   `-- Other

Q2: Sentimental significance?
   -> ceremony moment to feature it (homily mention, photo focus, wear)

Terminal action: heirloom_incorporation_card
```

---

### Domain 10 — Stationery decisions

**Context.** Stationery has predictable timing and a clear decision tree. Five flowcharts.

#### Flowchart 10.1: Save-the-date — yes or skip?

```
Q1: Days until wedding?
   |-- >180   -> STD strongly recommended
   |-- 90-180 -> STD optional
   `-- <90    -> skip STD, go straight to invitation

Q2: Out-of-town / international guests?
   |-- Many -> STD recommended regardless
   `-- Few  -> optional
```

#### Flowchart 10.2: Digital vs print invitations

```
Q1: Guest demographic?
   |-- Mostly elders / less tech-savvy -> print primary
   |-- Mostly peers                    -> digital primary, print for elders
   `-- Mixed                            -> hybrid

Q2: Budget?
   |-- Print full set: PHP 20K-80K (depending on count + design)
   |-- Digital:        PHP 2K-8K (designer fee)
   `-- Hybrid:         PHP 5K-25K
```

#### Flowchart 10.3: When to send invitations?

```
Standard PH timing:
   - Local guests:        6-8 weeks before wedding
   - Out-of-town guests:  8-10 weeks before
   - Destination wedding: 10-14 weeks before

Terminal action: rsvp_timeline_calculator -> calendar reminders
```

#### Flowchart 10.4: RSVP cards or QR-RSVP?

```
Q1: Setnayan recommends QR-RSVP (auto-feeds into Setnayan guest list).

Q2: Backup for elders?
   |-- Yes -> small RSVP card insert with phone option
   `-- No  -> QR only, phone collection from family liaison
```

#### Flowchart 10.5: What to include on invitation

```
Standard PH invitation inclusions:
   - Couple's full names
   - Parents' names (cultural)
   - Wedding date and start time
   - Ceremony venue
   - Reception venue (if different)
   - Dress code
   - RSVP method + deadline
   - Wedding hashtag (optional)
   - Map / directions (or QR to map)
   - Gift preference statement (optional, e.g., "your presence is the gift")
```

---

### Domain 11 — Day-of execution

**Context.** Day-of is where planning meets reality. Eight flowcharts cover run-of-show validation, vendor arrivals, emergency kit, contingencies, photographer downtime, reception flow, weather backup, and crew meal aggregation.

#### Flowchart 11.1: Run-of-show validation

```
Trigger: User has completed run-of-show and presses "validate."

System checks:
   - Total event duration vs venue contract
   - Bridal prep duration vs typical (3-4h)
   - Travel buffer parish-to-reception (cushion check)
   - Reception flow vs standard 30-row template
   - Photographer hours covered fully
   - Caterer arrival 4-6h pre-reception start
   - Coordinator arrival 1.5-2h pre-prep
   - Florist arrival 4-6h pre-ceremony

Terminal action: run_of_show_validator_report
   - per-row warnings with one-tap fixes
```

#### Flowchart 11.2: Vendor arrival times

```
Terminal action: coordination_matrix lookup
   - Florist:      T-6h to T-4h pre-ceremony
   - Caterer:      T-5h to T-3h pre-reception
   - Coordinator:  T-2h pre-prep
   - HMUA:         T-3.5h pre-bride-call-time
   - Photographer: T-2h pre-prep done
   - Videographer: T-1.5h pre-prep done
   - Sound:        T-3h pre-reception start
   - Cake:         T-2h pre-reception
```

#### Flowchart 11.3: Wedding emergency kit — what to pack

```
Terminal action: PreWrittenContent "Wedding Emergency Kit Essentials"
Categories (excerpt):
   - Stains: Tide stick, baby powder, white chalk
   - Dress: sewing kit, safety pins, double-sided tape, bobby pins
   - Body: deodorant, blotting paper, mints, pain reliever
   - Tools: scissors, lighter, super glue, duct tape
   - Tech: phone chargers (Lightning + USB-C), power bank
   - Documents: marriage license copy, vendor contract folder
   - Snacks + water bottles for couple
   - Small cash (PHP 5K) for tips and last-minute
```

#### Flowchart 11.4: Day-of timeline buffer — how much?

```
Q1: Guest count?
Q2: Number of venues?
Q3: Travel time longest leg?

Terminal action: buffer_recommendation
   - <100 guests, single venue:   15 min cushion per major transition
   - 100-250 guests:               25 min cushion
   - 250+ or multi-venue:          40 min cushion + dedicated runner
```

#### Flowchart 11.5: Photographer downtime — what to plan

```
Trigger: Photographer has 1-2h gap (typical between ceremony and reception).

Q1: Use the gap for portraits, family formal, or rest?
   |-- Bridal party portraits (most common)
   |-- Family formal photos
   |-- Couple-only "first look" or sunset shoot
   `-- Photographer rest (shorter package)

Terminal action: downtime_activity_card with location ideas
```

#### Flowchart 11.6: Reception flow — typical PH order

```
Standard PH reception sequence (30-row template):
   1. Cocktail / pre-reception (30-45 min)
   2. Couple grand entrance
   3. Welcome remarks (emcee)
   4. Prayer / blessing
   5. Couple's first dance
   6. Parents' welcome / thank you
   7. Sit-down or buffet open
   8. Toast (best man / maid of honor)
   9. Cake-cutting
   10. Wine toast (couple -> parents -> ninongs)
   11. Father-daughter / mother-son dance
   12. Group photos (table-by-table)
   13. Money dance / prosperity dance
   14. Bouquet toss
   15. Garter toss (where culturally accepted)
   16. Game / entertainment segment
   17. Open dancing
   18. Special performance (couple surprise, family number)
   19. Closing remarks
   20. Send-off / sparkler exit

(Customizable: each row can be reordered, omitted, or expanded.)

Terminal action: reception_flow_template (Wizard 8)
```

#### Flowchart 11.7: Backup plan for [weather/scenario]

```
Q1: Risk type?
   |-- Outdoor rain                   -> tent / indoor backup
   |-- Typhoon (5+ days out)          -> postpone vs modify decision tree
   |-- Power outage                   -> generator vendor or candle plan
   |-- Vendor late                    -> backup-vendor list activation
   `-- Couple illness                 -> coordinator-led reschedule

Terminal action: contingency_decision_tree per risk
```

#### Flowchart 11.8: Vendor crew meal aggregation

```
Q1: System reads booked vendors and their typical crew sizes.
Q2: System sums.

Sample: 8 vendors with 3 staff avg = 24 crew meals.

Terminal action: crew_meal_calculator output
   - total crew count
   - cost estimate (typical PHP 400-700 per crew meal)
   - line item auto-added to budget
```

---

### Domain 12 — Disagreements

**Context.** Disagreements are sensitive. Domain 12's flowcharts provide structure but most terminate in AI fallback or Setnayan Staff escalation when emotional support is needed.

#### Flowchart 12.1: We disagree on guest count

```
Q1: Each partner privately submits target count.
Q2: System computes gap and cost difference.

Terminal action:
   - reframing tool: must-have vs nice-to-have for each partner
   - midpoint compromise visualization
   - if gap >40%, route to AI fallback for personalized facilitation
```

#### Flowchart 12.2: We disagree on budget allocation

```
Q1: Show "couples like you" anonymized data on allocation patterns.
Q2: Each partner picks top-3 priorities.
Q3: System highlights overlap and gap.

Terminal action:
   - allocation_negotiation_card
   - if no overlap -> AI fallback
```

#### Flowchart 12.3: We disagree on venue

```
Q1: Each partner picks top-3 venues independently.
Q2: System scores against criteria both partners value.

Terminal action:
   - side-by-side weighted score
   - if no overlap -> AI fallback or schedule joint review session
```

#### Flowchart 12.4: Family is pressuring us

```
Q1: Pressure type?
   |-- Guest list expansion              -> script template
   |-- Religious / cultural element      -> script template + Domain 8 routing
   |-- Vendor recommendation we don't want -> script template
   |-- Money with strings                -> flowchart 12.5
   `-- Other                             -> AI fallback

Terminal action: PreWrittenContent "How to Handle Family Pressure" + scripts
```

#### Flowchart 12.5: Money from family with strings — how to handle?

```
Q1: Is the contribution conditional (vetoes guest list / venue / vendor)?
   |-- Yes, hard conditions  -> boundary-setting framework
   |-- Yes, soft conditions  -> negotiation framework
   `-- No, just generous     -> thank-you framework

Terminal action: PreWrittenContent "Boundary-Setting on Wedding Funds"
   + AI fallback for personalized scripts
```

#### Flowchart 12.6: Different religions / cultures

```
Trigger: Couple flags interfaith or intercultural.
Terminal action: PreWrittenContent "Mixed-Religion Weddings in PH"
   + Domain 8.10 cross-link
   + AI fallback for nuanced situations
```

#### Flowchart 12.7: One partner not engaged in planning

```
Q1: Has partner expressed disinterest, or is it lack of time?
   |-- Disinterest      -> conversation framing + AI fallback
   `-- Time constraints -> reduced-scope task assignment for partner

Terminal action:
   - engagement_strategy_card
   - PreWrittenContent "How to Have a Productive Wedding Conversation"
```

#### Flowchart 12.8: Cold feet

```
Trigger: Sensitive topic; mostly AI fallback with human escalation option.

Terminal action:
   - immediate AI fallback
   - clear escalation path to Setnayan Staff (human) if user requests
   - clear note that this isn't a decision to rush
```

---

### Domain 13 — Crisis handling

**Context.** Crises are time-sensitive and emotionally loaded. Eight flowcharts cover the most common emergencies. Most terminate in immediate Setnayan Staff escalation when financial or contractual stakes are involved.

#### Flowchart 13.1: Vendor cancelled

```
Q1: Days until wedding?
   |-- >90    -> standard rebook flow
   |-- 30-90  -> emergency rebook with Setnayan Recommended priority
   `-- <30    -> critical rebook — Setnayan Staff immediate

Q2: Reason for cancellation?
   |-- Vendor force majeure       -> claim deposit refund
   |-- Vendor no-show / breach    -> claim deposit + damages
   `-- Couple-initiated           -> review contract for forfeit

Terminal action:
   - filter directory by available + Setnayan Recommended + same price band
   - auto-draft inquiry message
   - escalate to Setnayan Staff if <30 days
```

#### Flowchart 13.2: Vendor unresponsive 7+ days

```
Trigger: Auto-detect — Setnayan's vendor messaging shows last response >7 days.

Terminal action:
   - auto-escalation to Setnayan Staff
   - Setnayan Staff contacts vendor via Setnayan's vendor portal
   - if still unresponsive within 3 more days -> flag as high-risk + initiate replacement
```

#### Flowchart 13.3: Wedding date conflict (suddenly)

```
Q1: What changed?
   |-- Venue cancelled                -> date dependent on new venue
   |-- Family emergency / illness     -> considering postponement
   |-- Pregnancy                      -> considering acceleration
   `-- Other                          -> AI fallback

Terminal action: re_scheduling_guide
   - vendor-by-vendor: contractual flexibility, fees
   - parish slot rebooking
   - guest re-notification template
```

#### Flowchart 13.4: Outdoor wedding + bad weather forecast

```
Q1: Days out from wedding?
   |-- <=7 days   -> activate contingency now
   |-- 7-14 days  -> monitor, prep contingency
   `-- >14 days   -> too early, but flag

Q2: Backup options on venue contract?
   |-- Indoor backup at same venue -> activate
   |-- Tent on-site                -> activate tent vendor
   `-- Move venue                  -> escalate Setnayan Staff

Terminal action: weather_contingency_activation
```

#### Flowchart 13.5: Family emergency — postpone or proceed?

```
Trigger: Sensitive topic.
Q1: Type of emergency?
Q2: How many key people affected?

Terminal action:
   - decision_support_card with postponement cost analysis
   - immediate AI fallback for emotional framing
   - Setnayan Staff for execution if postponement chosen
```

#### Flowchart 13.6: Budget cut needed mid-planning

```
Q1: Cut amount needed?
Q2: What's already booked (locked) vs unbooked?

Terminal action: savings_opportunity_analyzer (same as 5.3)
   - prioritize unbooked categories for cut
   - if locked categories must be renegotiated, surface vendor renegotiation scripts
```

#### Flowchart 13.7: Guest list expansion (forced add-ons)

```
Q1: How many additional guests?
Q2: Vendor confirmation needed (caterer, venue capacity, seating)?

Terminal action: expansion_impact_card
   - cost impact across catering, favors, stationery
   - vendor confirmation message templates
   - venue capacity check
```

#### Flowchart 13.8: Wedding-day vendor no-show

```
Trigger: Day-of, vendor has not arrived 30+ min past expected.

Terminal action: immediate_response_checklist
   - coordinator activates backup contact for that vendor
   - if no response in 15 min -> Setnayan Staff hotline (24/7 wedding-day support)
   - if confirmed no-show -> activate backup vendor (pre-identified for high-risk weddings)
```

---

### Domain 14 — Post-wedding tasks

**Context.** The wedding is done — but legal and admin tasks continue. Five flowcharts.

#### Flowchart 14.1: Marriage certificate — how to get it

```
Terminal action: PreWrittenContent "PSA Marriage Certificate"
Steps:
   1. Officiant / parish submits to LCR within 15 days
   2. LCR encodes locally
   3. PSA receives feed (typically 30-90 days after wedding)
   4. PSA encoding (additional 60 days)
   5. Couple can request PSA cert online (PSAhelpline) or branch
   6. Cost: ~PHP 210 per copy
   7. Validity: indefinite (used for ID updates, immigration, etc.)
   8. If delays >6 months, follow up with LCR; escalate to PSA helpline
   9. Multiple copies recommended (3-5 for various ID updates)
   10. Store digital scan in cloud
```

#### Flowchart 14.2: Government ID updates

```
Terminal action: id_update_checklist (cross-agency)
   - PSA marriage cert (above)
   - Passport (DFA): 1 PSA copy + old passport + form
   - SSS: PSA copy + member form
   - PhilHealth: PSA copy + form
   - Pag-IBIG: PSA copy + form
   - BIR (TIN): PSA copy + form 1905
   - Driver's license (LTO): PSA copy + form
   - Voter (COMELEC): PSA copy + form
   - Bank account: PSA copy + bank's form
   - Workplace HR: notify with PSA copy
```

#### Flowchart 14.3: Thank-you cards — when and how

```
Q1: When?
   - Send within 2 months post-wedding (typical PH grace period)
   - Earlier (within 4 weeks) for VIP guests, distant relatives, sponsors

Q2: Format?
   |-- Printed photo card
   |-- Digital with photo
   `-- Hybrid (printed for elders, digital for peers)

Terminal action: thankyou_template + photo-selection wizard
```

#### Flowchart 14.4: Vendor settlement

```
Q1: All deliverables received as contracted?
   |-- Yes                -> release final payment, post review
   |-- Partial            -> request missing items, hold final %
   `-- No / disputed      -> Setnayan Staff escalation

Terminal action: settlement_checklist
   - per vendor: contract scope reviewed, deliverables received
   - dispute path if needed
   - Setnayan review submission prompt
```

#### Flowchart 14.5: Photo deliverables tracking

```
SLA reminders (auto-scheduled based on vendor contract):
   - Sneak peek / preview      (within 1-2 weeks post-wedding)
   - Highlight reel            (within 4-8 weeks)
   - Full gallery              (within 8-16 weeks)
   - Wedding album             (within 4-6 months)
   - Prints                    (within 6 months)

Terminal action: photo_sla_tracker
   - if vendor misses SLA by 30+ days -> auto-escalation prompt
```

---

## Part 4 — Calculators (Detailed Specs)

Each calculator is a typed component referenced from the flowcharts above.

### 4.1 Budget Range Calculator

- **Name:** `BudgetRangeCalculator`
- **Purpose:** Estimate total wedding cost for a given guest count, region, and tier.
- **Inputs:**
  - `guestCount` (integer, 20-500)
  - `region` (enum: NCR, CALABARZON, Cebu, Boracay, Palawan, Davao, Other)
  - `tier` (enum: Essentials, Premium, ProEvent)
- **Logic:**
  - Look up regional baseline per-head cost: `ph_perhead_table[region][tier]`
  - Multiply by `guestCount`
  - Add fixed-cost portion: `fixed_cost_table[region][tier]` (covers venue, photo, attire, etc.)
  - Apply low/mid/high modifiers: x0.85, x1.0, x1.2
- **Output:** `{low: PHP X, mid: PHP Y, high: PHP Z, breakdown_by_category: [...]}`

### 4.2 Per-Category Budget Allocator

- **Name:** `BudgetAllocator`
- **Purpose:** Split total budget across 46 categories using PH defaults.
- **Inputs:**
  - `totalBudget` (PHP)
  - `priorityProfile` (enum: balanced, photoFirst, foodFirst, styleFirst)
- **Logic:**
  - Apply default % per category (table 5.2 below)
  - Apply priority modifier: shift +/-5% to/from selected categories
- **Output:** array of 46 rows: `[{category, defaultPct, allocatedAmount}]`

### 4.3 Guest Count Impact Calculator

- **Name:** `GuestImpactCalculator`
- **Purpose:** Show cost change when guest count moves.
- **Inputs:**
  - `currentGuestCount`, `newGuestCount`
  - `bookedVendors` (which categories are locked)
- **Logic:**
  - Per-affected-category, compute delta cost
  - Affected categories: catering, favors, stationery, cake, AV, transport
  - Locked categories with overage clauses -> flag overage fee
- **Output:** `{deltaCost, perCategoryImpact, lockedFlags}`

### 4.4 Lead Time Validator

- **Name:** `LeadTimeValidator`
- **Purpose:** Verify timeline feasibility per vendor category.
- **Inputs:**
  - `weddingDate`, `today`
  - `bookedVendorCategories` (so it skips already-booked)
- **Logic:**
  - Compute `daysToWedding`
  - Per remaining category, compare to `lead_time_table[category]`
  - Verdict: OnTime / Tight / Risky / TooLate
- **Output:** array of `{category, verdict, recommendation}`

### 4.5 Cake Servings Calculator

- **Name:** `CakeServingsCalculator`
- **Purpose:** Recommend tier count and sizes.
- **Inputs:**
  - `guestCount`
  - `slicePolicy` (allGuests / partialGuests)
- **Logic:**
  - PH standard cake servings: 6"=8, 8"=20, 10"=38, 12"=56
  - Stack tiers from largest base, each +2" smaller
- **Output:** `{tierCount, tierSizes: [12, 10, 8, 6], totalServings}`

### 4.6 Bouquet Count Calculator

- **Name:** `BouquetCalculator`
- **Inputs:**
  - `bridalParty.bridesmaids` (n)
  - `bridalParty.maidOfHonor` (1 or 0)
  - `bridalParty.flowerGirls` (n)
  - `mothers` (n)
  - `principalSponsorsLadies` (n; for corsages)
  - `principalSponsorsMen` (n; for boutonnieres)
  - `groomsmen` (n; boutonnieres)
- **Output:**
  - `bouquets`: bride (1) + MoH (1) + bridesmaids (n)
  - `corsages`: mothers (n) + ninang corsages (n)
  - `boutonnieres`: groom (1) + groomsmen (n) + ninong (n) + bearers (n)
  - `flowerGirlAccessories`: crowns / petal baskets

### 4.7 Vendor Crew Meal Aggregator

- **Name:** `CrewMealCalculator`
- **Inputs:**
  - `bookedVendorList` with each vendor's typical crew size
- **Logic:**
  - Sum staff per vendor using `vendor_crew_size_table`
- **Output:** `{totalCrewCount, costEstimate (low/mid/high), perVendorBreakdown}`

### 4.8 Transport Cost Estimator

- **Name:** `TransportEstimator`
- **Inputs:**
  - `vendorBaseLocation`, `venueLocation`
- **Logic:**
  - Compute distance via geocoder
  - Compare to vendor's typical free-radius (e.g., 30km)
  - If exceeds -> estimate overage at vendor's per-km rate
- **Output:** `{freeOrPaid, overageEstimate}`

### 4.9 RSVP Timeline Calculator

- **Name:** `RsvpTimelineCalculator`
- **Inputs:** `weddingDate`
- **Logic:**
  - Save-the-date: 6 months before
  - Invitation send: 8 weeks before
  - RSVP deadline: 4 weeks before
  - Reminder 1: 2 weeks before
  - Reminder 2: 1 week before
- **Output:** array of milestones with calendar links

### 4.10 Tier Recommendation Calculator

- **Name:** `TierRecommender`
- **Inputs:**
  - `totalBudget`, `guestCount`, `stylePreference`
- **Logic:**
  - Compute per-head budget
  - PH benchmark: Essentials <=PHP 2,500/head; Premium PHP 2,500-5,500; ProEvent >PHP 5,500
- **Output:** recommended Setnayan tier (Essentials / Premium / ProEvent) with rationale

### 4.11 Multi-Event Timeline Calculator

- **Name:** `MultiEventTimeline`
- **Inputs:**
  - `ceremonyTime`, `venueDistance`, `mealType`, `receptionLength`
- **Logic:**
  - Standard offsets: prep starts -3.5h, ceremony +0, travel +N min, reception +30 min cocktail, dinner +60 min program
- **Output:** chronological timeline rows

### 4.12 Vendor Availability Filter

- **Name:** `VendorAvailabilityFilter`
- **Inputs:**
  - `weddingDate`, `vendorCategory`
- **Logic:**
  - Query vendor calendars
  - Filter by `setnayanRecommended` flag if user opts in
  - Sort by responsiveness score
- **Output:** filtered vendor list with availability status

---

## Part 5 — Lookup Tables

These are static reference tables. Values shown are examples and reflect typical PH benchmarks.

### 5.1 PH Wedding Budget Ranges by Region and Guest Count

| Region | Guest Band | Essentials | Premium | Pro Event |
|--------|------------|-----------|---------|-----------|
| NCR | 50-100 | PHP 500K-800K | PHP 900K-1.4M | PHP 1.5M+ |
| NCR | 100-200 | PHP 800K-1.4M | PHP 1.4M-2.4M | PHP 2.5M+ |
| NCR | 200-350 | PHP 1.4M-2.2M | PHP 2.4M-3.8M | PHP 4M+ |
| CALABARZON | 50-100 | PHP 400K-700K | PHP 800K-1.2M | PHP 1.3M+ |
| CALABARZON | 100-200 | PHP 700K-1.2M | PHP 1.2M-2.0M | PHP 2.1M+ |
| Cebu | 100-200 | PHP 700K-1.2M | PHP 1.2M-2.0M | PHP 2.1M+ |
| Boracay/Palawan | 50-100 | PHP 700K-1.1M | PHP 1.2M-1.8M | PHP 1.9M+ |
| Davao | 100-200 | PHP 600K-1.0M | PHP 1.0M-1.7M | PHP 1.8M+ |

### 5.2 Per-Category Budget Allocation Defaults

| # | Category | Default % |
|---|----------|-----------|
| 1 | Venue (reception) | 18% |
| 2 | Caterer | 22% |
| 3 | Photographer | 9% |
| 4 | Videographer | 6% |
| 5 | Coordinator | 4% |
| 6 | Florist / Stylist | 7% |
| 7 | HMUA | 3% |
| 8 | Music (band/DJ/MC) | 4% |
| 9 | Lights & Sound | 2% |
| 10 | Cake | 1.5% |
| 11 | Bridal car | 1% |
| 12 | Stationery | 2% |
| 13 | Wedding rings | 3% |
| 14 | Bride gown | 4% |
| 15 | Groom suit/barong | 1.5% |
| 16 | Entourage attire | 2% |
| 17 | Photo stations | 1.5% |
| 18 | Specialty stations | 1% |
| 19 | Favors | 1.5% |
| 20 | Pre-Cana / dispensation fees | 0.3% |
| 21 | Marriage license + PSA | 0.2% |
| 22 | Parish fees | 1% |
| 23 | Choir / quartet | 0.7% |
| 24 | Crew meals | 1% |
| 25 | Tips and gratuities | 0.8% |
| 26 | Emergency contingency | 5% |
| 27-46 | Other minor categories | residual ~0.5% each |

(Total = 100%; rounded.)

### 5.3 Vendor Lead Times (Months Before Wedding)

| Category | Recommended | Tight | Urgent |
|----------|-------------|-------|--------|
| Venue | 9 | 6 | 3 |
| Photographer | 6 | 3 | 1 |
| Videographer | 6 | 3 | 1 |
| Coordinator | 4 | 2 | 1 |
| Caterer | 6 | 3 | 1 |
| Florist | 4 | 2 | 1 |
| HMUA | 4 | 2 | 1 |
| Music | 4 | 2 | 1 |
| Cake | 3 | 1.5 | 0.5 |
| Stationery (print) | 3 | 1.5 | 0.5 |
| Stationery (digital) | 1.5 | 0.5 | 0.25 |
| Bridal gown (custom) | 6 | 4 | 3 |
| Bridal gown (RTW) | 3 | 1.5 | 0.5 |
| Suit / barong | 3 | 1.5 | 0.5 |
| Rings (custom) | 4 | 2 | 1 |
| Rings (RTW) | 1 | 0.5 | 0.25 |

### 5.4 Cake Servings per Tier (PH Standard)

| Tier Diameter | Servings (1.5"x2" slice) |
|---------------|--------------------------|
| 6" | 8 |
| 8" | 20 |
| 10" | 38 |
| 12" | 56 |
| 14" | 78 |
| 16" | 100 |

### 5.5 Bouquet / Floral Counts

| Role | Floral Item | Count |
|------|-------------|-------|
| Bride | Bouquet | 1 |
| Maid of Honor | Bouquet | 1 |
| Bridesmaids | Bouquet | n |
| Flower girls | Mini-bouquet or petal basket | n |
| Mothers | Corsage | 2 |
| Grandmothers | Corsage | n |
| Ninang (each) | Corsage | n |
| Groom | Boutonniere | 1 |
| Groomsmen | Boutonniere | n |
| Ninong (each) | Boutonniere | n |
| Ring/coin/Bible bearers | Boutonniere | 3 |

### 5.6 Standard PH Wedding Day-of Timeline (30-Row Template)

| # | Time Offset | Activity |
|---|-------------|----------|
| 1 | -7h | Coordinator + HMUA arrive at bridal suite |
| 2 | -6h | Hair & makeup begins |
| 3 | -5h | Photographer arrives, captures prep |
| 4 | -4h | Videographer arrives |
| 5 | -3.5h | Florist delivers bouquets |
| 6 | -3h | Bride into gown / groom into suit |
| 7 | -2h | Family photos (prep location) |
| 8 | -1.5h | Travel to ceremony |
| 9 | -1h | Arrive ceremony venue |
| 10 | -30min | Final touch-ups, sponsors arrive |
| 11 | 0 | Ceremony begins (Mass) |
| 12 | +1h | Ceremony ends |
| 13 | +1h-1h30 | Post-ceremony photos |
| 14 | +1h30 | Travel to reception |
| 15 | +2h | Cocktail / pre-reception |
| 16 | +2h45 | Couple grand entrance |
| 17 | +2h50 | Welcome remarks |
| 18 | +2h55 | Prayer / blessing |
| 19 | +3h | Couple's first dance |
| 20 | +3h05 | Dinner served |
| 21 | +3h45 | Toasts |
| 22 | +4h | Cake-cutting |
| 23 | +4h05 | Wine toast |
| 24 | +4h15 | Parents' dance |
| 25 | +4h30 | Group photos by table |
| 26 | +5h | Money / prosperity dance |
| 27 | +5h15 | Bouquet & garter toss |
| 28 | +5h30 | Open dancing |
| 29 | +6h | Special performance / surprise |
| 30 | +6h30 | Send-off |

### 5.7 Mass Roles Count

| Role | Count |
|------|-------|
| 1st Reading | 1 |
| Responsorial Psalm | 1 (or congregation) |
| 2nd Reading | 1 |
| Gospel Acclamation | 1 (or congregation) |
| Prayers of the Faithful | 1-2 readers, 4-7 petitions |
| Offertory | 2-4 |
| Communion ministers | parish-supplied or 2-4 family |
| Coin / Arras bearer | 1 child |
| Ring bearer | 1 child |
| Bible bearer | 1 child |
| Flower girls | 2-4 children |

### 5.8 Default Ninong/Ninang Count Expectations

| Family Size / Style | Principal Pairs | Secondary Pairs |
|---------------------|-----------------|-----------------|
| Intimate / minimal | 3 pairs | 1 pair candle, 1 pair veil, 1 pair cord |
| Standard PH | 7 pairs | 1 pair candle, 1 pair veil, 1 pair cord |
| Large family / traditional | 9-12 pairs | 1 pair candle, 1 pair veil, 1 pair cord |

### 5.9 Wedding Emergency Kit Contents

**Sewing & Dress Repair**
- Sewing kit (white, ivory, palette colors)
- Safety pins (assorted sizes)
- Double-sided fashion tape
- Bobby pins, hairpins
- Hair spray, dry shampoo
- Lint roller

**Stains & Spills**
- Tide-to-Go stick
- Baby powder (white-stain absorber)
- White chalk (small chip on dress)
- Stain wipes
- Clear nail polish (stocking runs)

**Body Care**
- Deodorant (couple's preferred)
- Blotting papers
- Lip balm
- Hand cream
- Mints (no chocolate near gown)
- Pain reliever (Paracetamol, Ibuprofen)
- Antacid
- Band-aids
- Tissues
- Eye drops

**Tools**
- Scissors
- Lighter / matches
- Super glue
- Duct tape
- Mini sewing scissors
- Tweezers
- Mini umbrella

**Tech**
- Phone chargers (Lightning + USB-C)
- Power bank (10,000 mAh+)
- Extension cord (3m)

**Documents & Cash**
- Marriage license copy
- Vendor contract folder
- PHP 5,000 small bills (tips, last-minute)
- Couple's IDs

**Snacks & Hydration**
- Bottled water (3-4 for couple)
- Granola bars / dried fruit
- Electrolyte sachets

### 5.10 Catholic Ceremony Required Documents

| Document | Source | Validity |
|----------|--------|----------|
| Baptismal certificate (recent, "for marriage") | Parish of baptism | 6 months |
| Confirmation certificate | Parish of confirmation | 6 months |
| CENOMAR (Certificate of No Marriage) | PSA | 6 months |
| PSA Birth Certificate | PSA | indefinite (recent copy preferred) |
| Pre-Cana / Discovery Weekend certificate | Diocesan / parish-accredited | 1 year typical |
| Marriage license | LCR | 120 days |
| Canonical interview record | Parish of wedding | n/a |
| Banns publication | Parish of wedding (3 weeks) | n/a |

### 5.11 Holy Seasons to Avoid

- **Lent** (Ash Wednesday -> Holy Saturday): annual, 40+ days; weddings discouraged
- **Holy Week** (Palm Sunday -> Easter Sunday): no weddings
- **Christmas Octave** (Dec 24 -> Jan 1): possible but high-demand on parishes
- **Advent** (4 weeks before Christmas): some parishes restrict; check
- **All Souls / All Saints** (Nov 1-2): symbolic clash, often avoided

(Specific Lent dates vary year-to-year; the validator pulls from the liturgical calendar.)

### 5.12 PH Wedding Seasons

| Season | Months | Notes |
|--------|--------|-------|
| Peak (ber-months) | Sep, Oct, Nov, Dec | Highest demand, premium pricing, weather usually good (typhoon risk in Sep-Oct) |
| Peak (summer) | Mar, Apr, May | Hot but dry, high demand, premium pricing |
| Off-peak (rainy) | Jun, Jul, Aug | Vendor discounts, weather risk for outdoor |
| Mid-peak | Jan, Feb | Cool, dry, moderate demand |

### 5.13 Typical PH Wedding Vendor Crew Sizes

| Vendor | Typical Crew |
|--------|-------------|
| Photographer (solo) | 1 |
| Photographer (duo) | 2 |
| Photographer (premium team) | 3-4 |
| Videographer (solo) | 1 |
| Videographer (duo) | 2 |
| Videographer (cinematic team) | 3-4 |
| Coordinator team | 3-6 |
| Caterer (per 50 guests) | 5-8 |
| Florist / Stylist setup | 4-8 |
| HMUA (artist + assistant) | 2-4 |
| Live band 6-piece | 6 + sound tech |
| DJ + MC | 2-3 |
| Lights & Sound | 2-4 |
| Photobooth | 1-2 |

### 5.14 Vendor Inquiry Templates

(See Flowchart 7.14 — reproduced template per category, variables filled from couple's profile.)

### 5.15 Standard Reception Flow Sequence

(See Flowchart 11.6 — 30-row template above.)

---

## Part 6 — Wizards (Multi-Step Flows)

Each wizard is a state machine. Below: step-by-step specs.

### 6.1 RSVP Setup Wizard (8 steps)

```
Step 1: Import contacts
   - paste from Google Contacts / Sheets / CSV upload
Step 2: Categorize
   - immediate family / extended / friends / sponsors / coworkers
Step 3: Assign tables
   - drag-and-drop or auto-assign by category
Step 4: Set RSVP deadline
   - default: 4 weeks before wedding
Step 5: Configure reminders
   - 2 weeks before, 1 week before, 3 days before
Step 6: Preview invitation
   - select Setnayan template
   - QR-RSVP or RSVP card?
Step 7: Send
   - digital -> email/SMS/Messenger
   - print -> export PDF for printer
Step 8: Confirmation
   - couple sees summary, RSVPs auto-feed dashboard
```

### 6.2 Vendor Inquiry Template Wizard (5 steps)

```
Step 1: Category
   - photographer / coordinator / etc.
Step 2: Package interest
   - hours / coverage / inclusions
Step 3: Custom requirements
   - aesthetic, dietary, etc.
Step 4: Preview message
   - auto-generated from template + variables
Step 5: Send
   - via Setnayan's vendor messaging or copy-to-clipboard for external
```

### 6.3 Bulk Guest Import Wizard (6 steps)

```
Step 1: Upload
   - CSV / Sheets paste / Google Contacts sync
Step 2: Field mapping
   - Setnayan fields <- user columns
Step 3: Categorize
   - bulk-tag rows (e.g., highlight all "Smith" -> family)
Step 4: Review duplicates
   - dedupe by name + email/phone
Step 5: Confirm
   - summary: total, by category
Step 6: Import
   - rows added to guest list
```

### 6.4 Pre-Cana Setup Wizard (5 steps)

```
Step 1: Parish lookup
   - by city / barangay / address
Step 2: Schedule selection
   - upcoming Pre-Cana sessions in selected diocese
Step 3: Document checklist
   - what to bring (CENOMAR, IDs, etc.)
Step 4: Reminder setup
   - 1 week before, 1 day before
Step 5: Confirmation
   - calendar event created
```

### 6.5 Mass Role Assignment Wizard (3 steps)

```
Step 1: Select required roles
   - default Catholic set; couple toggles optional
Step 2: Assign guests
   - drag-and-drop from guest list
Step 3: Preview ceremony program
   - PDF preview with role names
```

### 6.6 Wedding Emergency Kit Builder (3 steps)

```
Step 1: Customize defaults
   - couple toggles items they don't need
Step 2: Add specific items
   - allergy medication, glasses spare, etc.
Step 3: Schedule reminder 3 days before
   - shopping list as checklist
```

### 6.7 Budget Initialization Wizard (4 steps)

```
Step 1: Total budget
   - input PHP
Step 2: Category preferences
   - splurge/save profile
Step 3: Review allocations
   - 46-row table editable
Step 4: Save
   - locks defaults, alerts on overspend
```

### 6.8 Day-of Run-of-Show Builder (5 steps)

```
Step 1: Ceremony time
Step 2: Venue distance (parish -> reception)
Step 3: Meal type (buffet/plated)
Step 4: Reception length
Step 5: Preview timeline
   - 30-row template auto-populated; couple edits inline
```

---

## Part 7 — Pre-Written Content Library

Static articles referenced by flowcharts. Stored as Markdown in a content directory and rendered inline.

### 7.1 Article Index

| # | Title | Length | Key Points |
|---|-------|--------|-----------|
| 1 | What is Pre-Cana? | ~500 words | Definition, duration, cost, certificate, where to attend |
| 2 | Marriage License in PH: Step by Step | ~800 words | 10-step process, validity, fees, common pitfalls |
| 3 | How to Choose Your Ninongs and Ninangs | ~600 words | Role definition, count norms, selection criteria, asking script |
| 4 | Filipino-Catholic Wedding Traditions Explained | ~700 words | Coin, cord, veil, candle — meaning and placement |
| 5 | Mixed-Religion Weddings in PH | ~600 words | Dispensation types, family scripting, integration tips |
| 6 | PSA Marriage Certificate: How to Get Yours | ~500 words | Timeline, where to request, multiple copies, delays |
| 7 | Updating Your IDs After Getting Married | ~600 words | Cross-agency checklist, document set, sequencing |
| 8 | Wedding Emergency Kit Essentials | ~400 words | Categorized list, why each matters |
| 9 | How to Have a Productive Wedding Conversation | ~500 words | Disagreement framing, time-boxing, "and" not "but" |
| 10 | What to Do When a Vendor Cancels | ~400 words | Immediate steps, contract review, replacement process |
| 11 | Hidden Costs in Filipino Weddings | ~600 words | Crew meals, parking, overtime, tips, surprises |
| 12 | Choosing Your Wedding Date | ~500 words | Cultural signals, practical concerns, season tradeoffs |
| 13 | When Each Vendor Should Be Booked: A Timeline | ~700 words | Lead-time table walkthrough, why ordering matters |
| 14 | Filipino Wedding Reception Flow | ~500 words | Standard 30-row sequence with optional segments |
| 15 | Photographer Inquiry: What to Ask | ~500 words | Hours, shooters, deliverables, contracts, retouching |
| 16 | Coordinator Inquiry: What to Ask | ~500 words | Tier scope, team size, day-of staffing |
| 17 | Caterer Inquiry: What to Ask | ~500 words | Per-head, dietary, crew, plates vs buffet |
| 18 | Boundary-Setting on Wedding Funds | ~500 words | Conditional contributions, scripts, alternative paths |
| 19 | How to Handle Family Pressure | ~500 words | Common pressure types, scripts, decision framework |
| 20 | Filipino Wedding Tradition Blend Guide | ~500 words | Modern adaptations of traditional elements |

### 7.2 Content Production Notes

- Each article is reviewed by a Filipino wedding subject-matter expert before publication.
- Articles cite parish norms, PSA processes, and PH-specific data — no generic Western wedding content.
- Articles are versioned; updates trigger a "content updated" notification on related flowchart screens.
- All articles are localizable; English V1, Tagalog V2.

---

## Part 8 — AI Fallback Conditions

The decision tree explicitly hands off to Kasalan AI under five conditions.

### 8.1 Condition A — Genuinely Open-Ended Question

The user's question has no finite-state branches. Examples:

- "Write us a personal vow about how we met during the pandemic and our golden retriever Bantay."
- "Help us draft an unconventional ceremony script that blends our Catholic background with my partner's Buddhist family's traditions."

```
Quota: 1 of 3 lifetime
Auto-prompt structure:
  - System: Kasalan persona prompt
  - Context: couple profile, wedding date, vibe, traditions selected
  - User: their original question verbatim
Surfaced back: AI response in chat UI with citation links to relevant flowcharts
```

### 8.2 Condition B — Generative Output Required

Any task that produces creative content:

- Wedding hashtags
- Vow drafts
- Vendor briefs beyond template (e.g., "rewrite our brief to emphasize the editorial vibe")
- Ceremony program text
- Speech outlines (best man, parents)

```
Quota: 1 of 3 lifetime
Auto-prompt: structured template per generative type
```

### 8.3 Condition C — Personalized Comparison Beyond Rules

When the user asks for a comparison that goes beyond simple matching:

- "Compare these 3 specific photographer packages and tell me which fits a garden romance vibe with a budget of PHP 180K and 8h coverage"
- "Which of these 4 venues will work best for a couple with mixed Filipino-Chinese family expectations"

```
Quota: 1 of 3 lifetime
Auto-prompt: pulls vendor details from directory, couple profile, prior preferences
```

### 8.4 Condition D — Emotional Support / Mediation

Sensitive topics — disagreements, family conflict, cold feet, grief during planning. Always offers human escalation.

```
Quota: 1 of 3 lifetime (OR free if Setnayan Staff has flagged crisis-tier conversation)
Auto-prompt: persona prompt with elevated empathy tone, explicit human-escalation offer
Surfaced back:
  - AI response
  - Persistent "Talk to a human" button at bottom
```

### 8.5 Condition E — Flowchart Explicit Fallback

Some flowcharts explicitly terminate in `ai_fallback`. Example: 7.13.x specialty stations beyond the 3 standard categories, or any "we don't know" branch with no rule-based answer.

```
Quota: 1 of 3 lifetime
Auto-prompt: system prefixed with "The decision tree did not have a clean answer. Help the couple with..."
```

### 8.6 What's Auto-Built and Sent

For every AI fallback, the system constructs a structured prompt:

```json
{
  "persona": "Kasalan — supportive, expert, calm Filipino wedding advisor",
  "couple_context": {
    "names": "...",
    "wedding_date": "...",
    "region": "...",
    "vibe": "...",
    "guest_count": "...",
    "budget_tier": "...",
    "selected_traditions": ["..."],
    "current_blockers": ["..."]
  },
  "decision_tree_state": {
    "domain": "...",
    "flowchart_id": "...",
    "user_journey_so_far": ["..."]
  },
  "user_question": "verbatim text"
}
```

The response is rendered with citation links back to relevant flowcharts when the AI references them.

### 8.7 What's Surfaced Back

- AI response in chat UI
- Citation links to flowcharts / lookups it referenced
- "Talk to a human" button if Condition D
- Quota indicator: "2 of 3 free conversations used"
- Save-to-notes button to preserve the response

---

## Part 9 — Implementation Notes

### 9.1 Storage

- **Flowchart definitions** are stored as JSON or YAML in `/content/flowcharts/`. Each file represents one flowchart; the runtime loads them at boot.
- **Lookup tables** are JSON in `/content/lookups/` (one file per table from Part 5).
- **Pre-written content** is Markdown in `/content/articles/` (one file per article from Part 7).
- **Calculator logic** lives in `/lib/calculators/` as TypeScript modules that consume lookup tables.
- **Wizards** are state machines: simple `useReducer` chains for short flows, XState for multi-branch flows (RSVP setup, day-of run-of-show).

### 9.2 Sample Flowchart Definition (JSON)

```json
{
  "id": "vendor_decision_photographer",
  "version": "1.0",
  "trigger": {
    "from_button": "im_stuck",
    "category": "vendor_decisions",
    "subcategory": "photographer"
  },
  "questions": [
    {
      "id": "q1",
      "text": "Where are you with photographer?",
      "options": [
        { "label": "Haven't started", "next": "photographer_when_to_book" },
        { "label": "Comparing options", "next": "photographer_comparison_tool" },
        { "label": "Got a quote, deciding", "next": "photographer_quote_review" },
        { "label": "Booked, but issues", "next": "vendor_dispute_routing" }
      ]
    }
  ],
  "terminal_actions": {
    "photographer_when_to_book": {
      "type": "decision_tree",
      "ref": "photographer_timing_tree"
    },
    "photographer_comparison_tool": {
      "type": "component",
      "component": "VendorComparison",
      "params": { "category": "photographer", "limit": 3 }
    },
    "photographer_quote_review": {
      "type": "component",
      "component": "QuoteReview",
      "params": { "category": "photographer" }
    },
    "vendor_dispute_routing": {
      "type": "ai_fallback_or_staff",
      "preferred": "setnayan_staff",
      "ai_prompt_template": "vendor_dispute_template"
    }
  },
  "metadata": {
    "expected_resolution_seconds": 60,
    "ai_fallback_rate_target": "<10%",
    "owner": "vendor_team"
  }
}
```

### 9.3 Component Catalog

Every terminal action is a typed React component.

| Component | Used In |
|-----------|---------|
| `<BudgetRangeCalculator />` | Domain 5 |
| `<BudgetAllocator />` | Domain 5 |
| `<VendorComparison />` | Domain 7 |
| `<MassRoleWizard />` | Domain 8 |
| `<EmergencyKitBuilder />` | Domain 11 |
| `<RsvpSetupWizard />` | Domain 4, Domain 10 |
| `<RunOfShowValidator />` | Domain 11 |
| `<WeatherRiskCalculator />` | Domain 3, Domain 11 |
| `<VendorBriefGenerator />` | Domain 6 |
| `<PaletteSelector />` | Domain 6 |
| `<ContributionTracker />` | Domain 5 |
| `<TimelineFeasibility />` | Domain 2 |
| `<DateValidator />` | Domain 2 |
| `<HiddenCostsModal />` | Domain 5 |
| `<IDUpdateChecklist />` | Domain 14 |
| `<MarriageLicenseGuide />` | Domain 8 |

### 9.4 AI Endpoint

```
POST /api/ai/kasalan
Headers:
  Authorization: Bearer <user_jwt>
Body:
  {
    "couple_id": "uuid",
    "conversation_id": "uuid (or null for new)",
    "fallback_condition": "A|B|C|D|E",
    "decision_tree_state": { ... },
    "user_question": "..."
  }
Response:
  {
    "conversation_id": "uuid",
    "response": "...",
    "citations": [{"flowchart_id": "...", "label": "..."}],
    "quota_remaining": 2,
    "human_escalation_offered": false
  }
```

### 9.5 Telemetry

Every flowchart resolution emits:

- `flowchart_started`: id, trigger, couple_id
- `question_answered`: question_id, option_label
- `terminal_reached`: action_type, action_ref
- `ai_fallback_invoked`: condition, tokens_consumed
- `staff_escalation`: reason, urgency

Aggregated weekly into:

- Coverage rate (% resolutions completed deterministically)
- AI usage rate per couple
- Most-hit flowcharts
- Drop-off points (couples leaving mid-flow)

### 9.6 Versioning

- Flowchart files are versioned (`version` field).
- When a flowchart updates, in-progress couples either complete the old version (locked) or accept the new (with notification).
- Lookup table updates apply immediately (no in-progress freezes since they're reference data).

### 9.7 Localization

- All user-facing strings in flowcharts and articles are in `i18n` JSON files.
- V1 ships English. V2 ships Tagalog. V3 evaluates Cebuano.

### 9.8 Testing

- Each flowchart has a test fixture: `{trigger -> expected questions -> terminal action}`.
- Calculators have unit tests against PH benchmark data.
- Lookup tables are validated for schema and completeness.
- AI fallback prompts are evaluated against a regression set of 200 sample couple-questions.

### 9.9 Content Authority

The decision tree is the source of truth. When in conflict with marketing copy, blog posts, or vendor sales material, the decision tree wins. Marketing must align to it, not the other way around.

---

## Part 10 — Coverage Map

How much of the typical Filipino couple's stuck-moment volume is handled at each layer.

| Layer | Mechanism | Estimated Coverage | Cost per Use |
|-------|-----------|--------------------|--------------|
| 1 | Smart defaults (preempt) | 40-50% of all potential value | PHP 0 |
| 2a | Decision tree branches | 30-35% of remaining stuck moments | PHP 0 |
| 2b | Calculators | 10-15% of remaining stuck moments | PHP 0 |
| 2c | Wizards | 8-10% of remaining stuck moments | PHP 0 |
| 2d | Pre-written content | 8-10% of remaining stuck moments | PHP 0 |
| 3 | AI fallback | 10-15% of remaining stuck moments | LLM tokens |
| 4 | Setnayan Staff (human) | <2% (mostly crisis) | Staff time |

### 10.1 Composite Math

If 100 couples each have 100 stuck moments over their planning lifetime:

- ~45 are preempted entirely by smart defaults -> couple never asks
- ~55 remaining moments
- Of those 55:
  - ~17 resolve via decision tree branches
  - ~7 via calculators
  - ~5 via wizards
  - ~5 via pre-written content
  - ~7 escalate to AI
  - ~1 escalates to Setnayan Staff
  - ~13 are answered by family/peers/Google (Setnayan's opportunity to capture)

### 10.2 Target Metrics

- Deterministic resolution rate: >=85% of in-Setnayan questions
- AI quota consumption: <=2 of 3 free conversations on average per couple
- Setnayan Staff escalation: <2% of resolutions
- Couple satisfaction with answer: >=4.3/5 across deterministic resolutions

### 10.3 Why This Matters

Every percentage point shifted from AI fallback to deterministic resolution:

- **Saves cost** — no LLM tokens
- **Improves consistency** — same answer for every couple
- **Improves speed** — sub-100ms vs 2-8s
- **Improves auditability** — product can update one row and all couples benefit
- **Reserves AI quota** — for genuinely creative or sensitive moments where AI shines

The decision tree is not a limitation. It is the moat. AI competitors will burn money on questions Setnayan answers for free.

---

## Appendix A — Glossary

- **Pre-Cana / Discovery Weekend**: pre-marriage seminar mandatory for Catholic weddings in the Philippines.
- **CENOMAR**: Certificate of No Marriage Record, issued by PSA.
- **PSA**: Philippine Statistics Authority.
- **LCR**: Local Civil Registrar.
- **Ninong / Ninang**: principal sponsors (godparents at the wedding); witnesses and lifelong mentors.
- **Arras**: 13 coins exchanged during Catholic ceremony, symbolizing material commitment.
- **Cord (yugal) / Veil / Candle**: secondary sponsor symbols draped over the couple during Mass.
- **Ber-months**: September through December; PH wedding peak season.
- **OTD coordination**: On-the-day; coordinator engaged for wedding day only.

---

## Appendix B — Document Conventions

- All PHP amounts are PHP (Philippine Peso), 2025 baseline.
- Table values are typical PH benchmarks; subject to regional and seasonal variance.
- Flowchart IDs follow `domain.flowchart_index.subflow_index` (e.g., `7.1.3`).
- Calculator and component names use PascalCase.
- Lookup table IDs use snake_case.

---

## Appendix C — Change Log

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | 2026-05-07 | Setnayan Product | Initial canonical specification |

---

*End of document.*
