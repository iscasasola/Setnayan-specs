# What Is Setnayan AI

### "Browsing is free. Setnayan AI does the matchmaking."

> **Status:** Definition lock · 2026-06-08. Synthesizes a working session that walked the shipped code (`apps/web` @ `origin/main`) feature-by-feature to settle, once and for all, **what "Setnayan AI" is**, what it does, where it ends, and what is built vs. still spec. Supersedes the loose interim-planner naming drift (the SKU previously shipped under "Setnayan Assist", "Setnayan Concierge", and other since-retired interim labels).
>
> **Naming decision (this doc):** the consumer-facing name is **Setnayan AI** (noun/brand); *"assists"* is the verb describing what it does. *"Setnayan Assist"* is retired as a label; the DB value `events.planning_mode = 'manual'` is kept (no migration — UI label only).
>
> ✅ **Owner decisions RESOLVED 2026-06-08 (§9): paid per-event gate · price/value dimension when feasible · last-minute range + AI-off-empty rule · name = Setnayan AI.** Several pieces below remain **spec-only** (not in code) and several shipped pieces are **not yet gated** behind the AI flag — both flagged inline and in §8 (build-state).

---

## 1 · One-paragraph definition

**Setnayan AI is the deterministic planning + matchmaking layer that sits on top of a free vendor marketplace.** It takes what the couple tells Setnayan at onboarding (region, date, faith, guest count, venue setting, budget, style, service picks + refinements), turns it into a match vector, and uses it to **rank, recommend, personalize, and nudge** — finding the best-fit vendors near the reception, the best common date their team can all make, the right deadlines for each category, and (close to the day) the vendors still willing to commit at the last minute. It is **algorithmic, not an LLM** — haversine distance, weighted scoring, gate→sort→slice, statutory-deadline math. Its value promise to the couple: *"Setnayan AI assists you in finding the best-fit vendors, the best date, and the best deals for your wedding."*

---

## 2 · The governing principle (the free-floor vs AI boundary)

> **The data + integrity layer is FREE. The ranking, scoring, recommendation, and nudging layer is Setnayan AI.**

This one rule decides which side of the line every feature falls on, and it keeps the free tier genuinely safe + useful (no double-bookings, location-relevant results) while making Setnayan AI the *optimization* layer couples pay for.

| Concern | FREE floor (always on) | Setnayan AI (the paid/assist layer) |
|---|---|---|
| **Vendor search** | Browse, taxonomy search, filters, save/favorite, compare. **Scoped to the couple's TARGET LOCATION (region)** as the quality floor. | Reception-anchored proximity ranking · % compatibility · best-fit recommendation · "Matching you on" personalization · cross-category & paired-venue recommendations. |
| **Scheduling** | Vendor sets availability · couple sees genuinely-booked vendors dropped (**anti-double-book integrity**). | "Best date" ranking (Date Aligner) · date-headroom score · "👀 N eyeing your date" nudge. |
| **Deadlines** | — | Per-category recommended deadlines + statutory paperwork windows. |
| **Last-minute** | "Accepts last-minute" eligibility + transparent surcharge line. | Last-minute *matchmaking* (surfacing vendors still willing to commit) + feasibility triage + the last-minute badge. |

**The gate (owner-locked 2026-06-08): a toggle activates Setnayan AI, gated on a PER-EVENT purchase.** Toggle **on + purchased** → readjusts the whole experience to the full matchmaking layer. Toggle **on + not purchased** → routes to the Setnayan AI purchase page. Toggle **off** → the standard search below. The entitlement is **per event, NOT per account** (like other event-scoped SKUs). So the gate moves off the old *free* `planning_mode` toggle onto **purchase of the per-event Setnayan AI SKU**; the toggle is the on/off + buy-routing control (`planning_mode='manual'` = off / standard).

**AI-OFF behavior:** the search becomes **generic** — it **still filters by the couple's target location (region)** so results stay relevant (*"still better than most in the market"*), but it drops the reception-venue proximity anchor, the %, the deadlines, the best-match auto-inquiry, the eyeing nudge, and last-minute matching. Anti-double-book availability stays free. **One hard edge (owner 2026-06-08):** if a category is **already in its last-minute zone (`R ≤ leaf START`), the standard search shows NOTHING** in that category — last-minute-accepting vendors surface **only** with Setnayan AI on. (Plan late → the free search goes empty for that category until you turn AI on — the sharpest pull to purchase.) **Generic ≠ garbage; it's region-scoped browse without the matchmaking intelligence.**

---

## 3 · What Setnayan AI is made of (the components)

Each is tagged with its build-state: ✅ shipped · 🟡 partial · 📋 spec-only.

### 3.1 — Per-category recommended deadlines ✅
- **Data:** `02_Specifications/18_Concierge_Brain/04_Planning_Timelines.md` (PH-specific 12-month → post-event timeline + statutory windows).
- **Engine:** `apps/web/lib/wedding-plan-groups.ts` assigns each category a `monthsBefore` (lock-by). `apps/web/lib/upcoming-items.ts` emits `recommended_deadline` items (dated `wedding_date − monthsBefore`, cap 5) + `document_deadline` (PSA −180d, marriage license −120d, Pre-Cana −60d, Catholic only).
- **Note:** survived the retirement of the old paid planner wizard — now feeds the Home "upcoming" surface for free **when AI is on**. Manual mode turns ALL deadlines off.

### 3.2 — Onboarding answers → the match vector ✅
- The onboarding is a **sorting questionnaire**: every answer is a canonical-enum scoring input (18 regions, 8 styles, ceremony/faith, venue setting, pax, budget, service picks + Layer-1 refinements).
- Becomes the two-stage **GATE + SCORE** engine (`apps/web/lib/wizard-recommendations.ts` + `apps/web/lib/compat-score.ts`).
- Surfaced to the couple as the **"Matching you on" taste-chip strip** (`personalized-menu.ts` + `match-criteria-strip.tsx`) — hidden in Manual mode. Editable post-onboarding via `match-criteria.ts` (region/feel/budget).

### 3.3 — Reception-anchored proximity ✅
- `fetchReceptionLatLng()` resolves the locked reception venue's coords (`event_vendors[category=venue] → marketplace_vendor_id → vendor_profiles.hq_*`); onboarding seeds `events.venue_latitude/longitude` from the picked city centroid before any venue locks.
- `geo.ts` haversine → `compat-score.ts` **distance** sub-score: half-life decay `0.5 ^ (distanceKm / radius)`, floored 0.15, scaled by the **vendor's own travel radius** (Free 10 / Pro 25 / Enterprise 100 — "tiers sell reach"). Distance carries **0.25** of the score (2nd-heaviest).
- Fail-soft: missing coords → neutral 0.6, never empties the list.

### 3.4 — "Reach my best matches" (the top 1–5) ✅
- `apps/web/app/onboarding/wedding/actions.ts`: **opt-in, default OFF** (RA 10173 consent). When ON, for each picked category auto-inquires the **top 1–5 best-fit vendors — stepper, default 3.**
- Engine = the same `fetchWizardVendorRecommendations` (GATE → sort `ad_rank → review_count → avg_rating` → slice). `UNIQUE(event_id, vendor_profile_id)` dedupes cross-category.
- ⚠ At founder-only pilot, the real count is ~1 (sparse marketplace) — real plumbing, awaiting vendor supply.

### 3.5 — Services-card surfacing: % compatibility + "km from reception" ✅
- `apps/web/.../vendors/_components/plan-budget-accordion.tsx` (`VendorCardAtom`): renders **`{score}% match`** (tier-colored strong/good/fair) + **"X from reception"** distance line.
- The % pill is the **visible face of Setnayan AI** — gated on `personalizationEnabled && marketplace && !setnayan` (hidden in Manual mode; 1st-party Setnayan services never scored — supplementary).
- ⚠ Today the % is driven mainly by **distance + reviews + verification**; `refinement` (0.30) + `dateHeadroom` (0.15) sit at a neutral baseline **until iteration 0044** lands per-service detail data — so the % and the distance chip are largely the same signal right now, and sharpen later.

### 3.6 — Date Aligner ("best common date") + "eyeing" nudge ✅ / 🟡
- **Date Aligner** (`apps/web/lib/schedule-matrix.ts` + `find-date/`): given the couple's 1–4 candidate dates + their picked vendors, ranks which date keeps the most of their team available (reads `vendor_calendar_blocks` via `lib/vendor-availability.ts`, no new schema). *"The best date your top vendors can all actually make."*
- **"👀 N also eyeing your date"** (`lib/vendors-plan-budget.ts`): a real count of other couples' soft-holds on (vendor, wedding_date) pre-downpayment. *Never invents scarcity.* 🟡 partial across surfaces.

### 3.7 — Paired-venue recommendation ✅
- `apps/web/lib/venue-recommendations.ts`: once a reception is anchored, surfaces nearby **ceremony** venues for the matching ceremony_type (haversine off the reception coords). Closes *"I picked my reception — where's the other half?"* (#3's proximity engine applied to venue-pairing.)

### 3.8 — Cross-category recommended-vendor row ✅
- `recommended-vendor-row.tsx`: *"{vendor} also does your {other category}"* → Consider / Lock too. Cross-sell recommendation across the couple's existing picks.

### 3.9 — Song Bank (song → band) ✅
- `song-bank-step.tsx` / `lib/songs.ts`: find a performer by repertoire — pick a song → surfaces the band that plays it. Discovery-by-song, not a plain browse.

### 3.10 — Last-minute range + leaf-scoped badge ✅
See §4 — the most ambitious net-new mechanic. **Fully SHIPPED:** engine + search-side gating + badge (PR-3), the admin START editor (`/admin/taxonomy`) + the vendor END/surcharge editor (`/vendor-dashboard/services`) (PR-4), migration applied to prod. **Dormant until an admin sets a category START** (the on-switch) → zero behavior change until configured.

---

## 4 · The last-minute mechanic (net-new spec, 2026-06-08)

Supersedes the locked flat *"< 14 days"* last-minute rule (`Customer_Vendor_Marketplace_Architecture_2026-06-04` Stage-1 gate) with a **configurable range**.

> **🔄 START IS NOW VENDOR-OWNED (owner refinement 2026-06-16 — SHIPPED PR #1524).** The last-minute START is **no longer a platform per-leaf value** — it's the **vendor's per-service RECOMMENDED LEAD TIME** (`vendor_services.recommended_lead_time_months`, NEW): the normal/comfortable lead for regular effort ("book by here, no rush"). *Why:* applicability varies per vendor — a photographer who needs no prep can serve whenever the schedule is open; a custom-gown maker needs months. The platform shouldn't guess it per category. The three vendor-declared points per service: **(1) recommended lead time** = the START · **(2) last-minute range** `[recommended_lead → cutoff]` · **(3) hard cutoff** (`last_minute_end_months`, unchanged) = latest they can accept. NULL recommended lead → no last-minute range → always bookable whenever the schedule permits. The platform `last_minute_start` is retired as the driver (kept only as a soft fallback when a vendor leaves it blank). Vendor UI adds the field + a commitment nudge ("honor bookings up to your accept-until date"). The category-wide AI-off-empty rule (§4.2) deliberately stays on the platform group START so one vendor can't black out a whole category. **Dark-by-data** — nothing changes until vendors fill in lead times. The table below is the original 2026-06-08 framing; rows 1's "Set by / Grain" are superseded by the above.

### 4.1 — Two boundaries, split platform/vendor

| Boundary | Set by | Grain | Meaning |
|---|---|---|---|
| **Last-minute START** | ~~Setnayan (platform)~~ → **the vendor (2026-06-16)** | **per their service** | The vendor's **recommended lead time** — the normal lead for regular effort; "last-minute" *begins* here. (Was platform per-leaf; now `vendor_services.recommended_lead_time_months`.) |
| **Last-minute END (floor)** | the vendor | **per their service** | *"I'll still accept a booking until this month before the wedding."* Default if blank; **`0` = until the night before.** |

**Last-minute = the range `[vendor recommended-lead START → vendor END]`** (both vendor-owned since 2026-06-16).

### 4.2 — Three zones, by time-remaining (R = months to wedding)

| Zone | Condition | Visible to | Surcharge |
|---|---|---|---|
| **Normal** | `R > START` | everyone (generic + AI) | none |
| **Last-minute** | `END ≤ R ≤ START` | **AI couples only** | **optional** (vendor's choice, 0–100%) |
| **Expired** | `R < END` | no one (not searchable) | — |

Worked example — stylist, leaf START = 4 mo (platform), vendor END = 3 mo: range **4 → 3 months.** At R=5 normal (everyone); R=4 last-minute opens (AI only); R=3 at the floor (AI only); R=2.9 expired (no one).

**AI-OFF in the last-minute zone = empty category (owner 2026-06-08).** Because the Last-minute zone is AI-only, a standard-search couple whose category is already last-minute (`R ≤ leaf START`) sees **no vendors at all** in that category — even vendors who *would* accept them are hidden until Setnayan AI is on. The free search doesn't show a worse list; it shows an *empty* list for last-minute categories, with the AI purchase as the unlock.

### 4.3 — The surcharge
Within the last-minute zone a vendor **may** raise price (0–100%) or leave it flat. It is an **opt-in opportunity, never forced** — a vendor can use last-minute purely to stay discoverable late, at no price change.

### 4.4 — Leaf-scoped last-minute badge ✅ (shipped PR-3, configurable via PR-4 editors)
Show a **"Last-minute available"** badge when `END ≤ R ≤ leaf_START`, computed **per leaf — never per parent/branch.** Because START is leaf-specific, one vendor can be last-minute for one of their services and normal for another at the same moment (e.g., a caterer's Buffet leaf START=4 vs Dessert-Bar leaf START=2 → at R=3, Buffet is badged, Dessert Bar is not). Renders in the existing `.badges` row beside `% match` / `Verified`. **AI-gated by nature** (generic couples don't see last-minute vendors at all). **Honest, computed — not invented scarcity** (same discipline as the eyeing chip). Tone = opportunity ("still booking late"), not alarm; pairs with the surcharge line when present.

### 4.5 — Data homes (AS-BUILT · PR-3)
- **Platform START** → `planning_deadlines` rows with `kind='last_minute_start'` (admin-set; category default `scope='category'` ref_key = plan-group id, per-leaf override `scope='leaf'` ref_key = canonical). Reuses the codebase's canonical "admin-set, per-category/leaf, months-back-from-wedding" config table (same one that holds recommended deadlines) instead of a new per-leaf column — so the START editor sits beside the deadline control in `/admin/taxonomy`. **No rows seeded → dormant.** (Supersedes the earlier "`last_minute_start_months` column on each taxonomy leaf" sketch.)
- **Vendor END + surcharge** → `vendor_services.last_minute_end_months` + `last_minute_surcharge_pct` (nullable, CHECKed 0–100). END blank → 0 = until the night before.
- Migration: `20260920000000_last_minute_mechanic.sql` (additive; **applied to prod 2026-06-08** via `supabase db query` — db push was ledger-blocked by parallel drift; verified columns + kind constraint live).
- **Editors (PR-4):** admin sets START at `/admin/taxonomy` ("Last-minute window start" section, category-level; per-leaf override supported by the engine, editor is a later refinement); vendors set END + surcharge at `/vendor-dashboard/services` ("Last-minute bookings" block).

---

## 4B · Dependency awareness — the sequencing engine (net-new spec, 2026-06-08) 🟡 SHIPPED (PR-5)

Layers **prerequisite edges** on top of the per-category deadlines (§3.1). Each service declares what must be **finalized first** before it can be matched/booked well, so Setnayan AI can tell the couple *"finalize X by [date] so Y is easy."* Encodes the Concierge Brain cascade (*venue→date→officiant→caterer→invitations→RSVP→seating*) as data instead of prose.

### 4B.1 — Decision nodes (non-vendor prerequisites)
Some prerequisites aren't vendor categories — they're planning artifacts that already live on other surfaces. They become graph nodes:
`wedding_date` (root · the availability anchor) · `mood_board` (palette/style lock · 0010) · `sponsors_confirmed` (guest-list roles · 0001) · `invitations_sent` · `rsvp_headcount` · `seating_chart` (0008).

### 4B.2 — Two relationship types (owner-adjusted 2026-06-08)
- **`dependsOn` (one-way)** — a prerequisite that should be finalized first.
- **`mutual` (order-resolved pair)** — *either* node can go first; whichever the couple finalizes first **anchors** the match, and the second is matched to **complement** it. Captures real wedding flexibility (gown-first vs palette-first).

**Everything is a nudge — nothing ever blocks (always soft).** The `(H)`/`(s)` tag is only the nudge's **prominence**: `(H)` = strong reminder (downstream match is materially worse without it), `(s)` = gentle suggestion.

**🔒 Locked invariant (owner 2026-06-08):** no matter which venue is locked first, **the reception venue is ALWAYS the proximity anchor** for every reception-anchored service (§3.3). Couples may browse ceremony + reception together to find the best *combination*, in either order — but "near the reception" never changes.

**Mutual pairs (order-resolved):**
| Pair | First-locked anchors → second complements |
|---|---|
| `ceremony_venue ↔ reception_venue` | browse both, lock the best combo in either order; **reception stays the proximity anchor** for all other services |
| `attire ↔ mood_board` | gown-first → palette + stylist complement the gown · palette-first → attire complements the palette |

**One-way `dependsOn`:**
| Category | dependsOn | Why |
|---|---|---|
| coordinator | `wedding_date` (s) | **recommended early, never required** — a guide, not a prerequisite for anything |
| officiant | `ceremony_venue` (H) | auto-resolves from the ceremony venue |
| catering | `reception_venue` (H) | reception-anchored; some venues bundle it |
| photography | `wedding_date` (H) | peak-Saturday availability |
| hair_makeup | `wedding_date` (s) | availability |
| florals_decor | `mood_board` (H), `reception_venue` (s) | designs from your palette + the space |
| live_band / music_entertainment / host_mc | `wedding_date` (H) | availability |
| lights_sound | `reception_venue` (H) | venue acoustics + load-in |
| led_background | `mood_board` (H), `reception_venue` (s) | design draws the palette |
| cocktail_booths / photobooth | `reception_venue` (H) | reception-anchored |
| cake | `catering` (s), `mood_board` (s) | reflects catering style + palette; hotels bundle |
| bridal_car | `wedding_date` (s) | availability |
| guest_shuttle | `reception_venue` (H), `ceremony_venue` (s) | the route |
| accommodation | `reception_venue` (H) | near the venue |
| invitations_stationery | `sponsors_confirmed` (H), `mood_board` (s) | sponsor names *print* on the invite |
| logistics | `reception_venue` (s), `rsvp_headcount` (s) | late catch-all |
| **rsvp_headcount** | `invitations_sent` (H) | can't track replies before they're sent |
| **seating_chart** | `rsvp_headcount` (H) | seat the people who actually RSVP'd |
| **rings** | — *(standalone)* | no prerequisite — **but still carries its own deadline** (−3 mo timeline) |

*Consistency check:* every edge points to an equal-or-earlier deadline tier (foundation → big_bookings → style_program → extras → paper), so the graph never contradicts §3.1's `monthsBefore`.

### 4B.3 — How it surfaces
- **Blocked → Ready state.** A dependent service shows *"⏳ Lock your reception venue first"* until its prerequisite is finalized, then flips to *"✅ Ready — here are your best-matched caterers."*
- **Dependency-aware reminder.** Fires relative to the **dependent's** deadline (so the prerequisite is ready in time), not the prerequisite's own: *"Lock your mood board by Aug 12 — your florist, stylist & cake all design from it."*
- **Match-quality payoff (the point).** Finalizing a prerequisite **unlocks better AI results** downstream: reception locked → caterers become distance-ranked (#3); mood board locked → florist/cake/stylist matched on palette; date locked → everyone availability-filtered. The dependency is *why* the next search gets easier.

### 4B.4 — Rules + open decisions
- **ALWAYS SOFT (owner-locked 2026-06-08).** Out-of-order is *always* nudged + explained, **never blocked** — for every edge, `(H)` or `(s)`. A couple with a reason to book early is never trapped. The tag only sets how prominent the reminder is (`(H)` warns clearly, `(s)` gently); neither is a gate. No hard blocks anywhere in the dependency system.
- **Deadline constraint.** A prerequisite's deadline must precede its dependents' — the graph keeps the timeline self-consistent and ties into the deadline↔last-minute derivation (§4 / owner decision).
- **✅ Edge set LOCKED 2026-06-08 — owner-ratified** after review (always-soft + the `mutual` pairs + the reception-anchor invariant + coordinator-recommended-not-required + rings-standalone-with-timeline adjustments all applied). The dependency model is final; remaining work is implementation.
- **🟡 SHIPPED PR-5 (setnayan-platform #1109):** `lib/dependency-graph.ts` (the locked edge set as data + `resolveDependency`) + Blocked→Ready nudge on the Vendors plan-budget accordion, AI-gated + always-soft + shown only in a category's action window. Satisfied-node detection wired for finalized vendor categories + `wedding_date` + `mood_board`; the 4 non-vendor decision nodes (sponsors_confirmed / invitations_sent / rsvp_headcount / seating_chart) **fail open** for now (they live on the guest-list/seating surfaces) — real detection + dependency-aware *reminders* are the remaining slice.

---

## 5 · The value proposition

What Setnayan AI adds on top of the free browse is the **connective intelligence**:
- **Ranks** — proximity, % compatibility, best date.
- **Recommends** — best-5 matches, paired venue, cross-category, song→band.
- **Personalizes** — "Matching you on" chips from the couple's own answers.
- **Nudges** — eyeing, deadlines.
- **Rescues** — last-minute matchmaking + feasibility triage for short-runway couples.

Sellable story: *"Browsing is free. Setnayan AI does the matchmaking — best-fit vendors, the best date, and the vendors still willing to commit this close to your day."*

---

## 6 · What stays FREE (the floor, never gated)

Marketplace browse (category tiles · mega-column taxonomy · folder strips) · taxonomy search · filter drawer · compare · save/favorite · availability banner ("who's free on this date") · event-type notify · **target-location (region) scoping** · **anti-double-book availability**. A couple can browse, search, filter, compare, save, and avoid double-bookings entirely free.

---

## 7 · What Setnayan AI is NOT

- **Not an LLM / chatbot.** It is deterministic (haversine, weights, gate→sort→slice, date math). The retired planner wizard promised *"answers your questions in your own language"* — that conversational layer is **gone**; do not market "ask-it-anything AI" unless/until an LLM layer actually ships.
- **Not a price the couple pays a vendor.** 1st-party Setnayan services are supplementary and never %-scored against the market; vendor money is always off-platform (RA 11967).

---

## 8 · Build-state summary

| Component | State |
|---|---|
| Recommended + statutory deadlines | ✅ shipped (off in Manual mode) |
| Onboarding match vector + "Matching you on" strip | ✅ shipped (strip hidden in Manual) |
| Reception proximity + % pill + distance chip | ✅ shipped (% hidden in Manual; refinement/dateHeadroom neutral till 0044) |
| "Reach my best matches" top-1–5 auto-inquiry | ✅ shipped (opt-in; sparse at pilot) |
| Date Aligner | ✅ shipped |
| "Eyeing your date" | 🟡 partial across surfaces |
| Paired-venue / cross-category / song→band recs | ✅ shipped |
| **Last-minute range + leaf badge + surcharge** | ✅ SHIPPED — engine + search-gating + badge (PR-3) + admin START editor + vendor END/surcharge editor (PR-4); migration applied to prod. Dormant until an admin sets a category START (the on-switch). |
| **Per-event paid Setnayan AI SKU + toggle (on/buy-route/off)** | 📋 not implemented — gate is the free `planning_mode` toggle today, not a purchase |
| **Price/value ("best deals") scoring dimension** | 📋 spec-only — add when feasible (owner "if we can, better"); non-blocking |
| **"AI-off → generic (region-only)" gating** | 📋 not implemented — today Manual mode keeps the reception-distance ladder + full gate; it only drops the % pill + deadlines + nudges |

**The gating gap (the main build task):** to deliver the §2 boundary, the reception-proximity sort, paired-venue rec, cross-sell row, eyeing nudge, Date Aligner, dateHeadroom, and last-minute matching must all move **behind the per-event Setnayan AI entitlement**, leaving only the region filter + anti-double-book as the free floor — and the standard search must return **empty** for any category already in its last-minute zone. That is a single, well-scoped PR (entitlement check + toggle/buy-routing + the empty-last-minute rule) — flagged here, **not started.**

---

## 9 · Owner decisions — RESOLVED 2026-06-08

1. **Gate = PAID, per EVENT.** A **toggle activates Setnayan AI.** On + purchased → readjusts everything to the AI matchmaking layer. On + not purchased → routes to the **Setnayan AI purchase page.** Off → the **standard search** (region-scoped generic — *"still better than most in the market"*). Entitlement is **per event, NOT per account.** → The gate moves off the free `planning_mode` toggle onto **purchase of the per-event Setnayan AI SKU.**
2. **"Best deals" → add a price/value dimension when feasible.** Owner: *"if we can, then better."* Add a value-for-money / budget-fit dimension to the scorer when practical — **desired, non-blocking** (the score works without it today).
3. **Last-minute range confirmed + AI-off-empty rule.** The per-leaf-START + per-vendor-END range replaces the flat *"< 14 days"* gate; beyond the vendor's END they never show. **And:** when **AI is OFF and a category is already in its last-minute zone (`R ≤ leaf START`), NO vendor shows** in that category for standard search — last-minute vendors are surfaced **only** by Setnayan AI.
4. **Name = Setnayan AI** (confirmed). Retire the "Setnayan Assist" label; keep `events.planning_mode='manual'` as the DB value.

---

*Cross-refs:* [[project_setnayan_leaf_match_contract]] · [[project_setnayan_booking_ruleset]] · [[project_setnayan_pricing_tiers]] · [[project_setnayan_todays_focus_retired]] · [[project_setnayan_date_aligner_expansion]] · `02_Specifications/18_Concierge_Brain/` · `Customer_Vendor_Marketplace_Architecture_2026-06-04.md` · `Pricing_Canonical_2026-06-08.md`.
