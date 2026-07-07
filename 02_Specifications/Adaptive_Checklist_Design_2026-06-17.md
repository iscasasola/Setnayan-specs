# Adaptive Checklist Design
**Authored:** 2026-06-17 — design session with owner  
**Status:** Spec complete · build queued  
**Code:** `apps/web/lib/checklist.ts` · `apps/web/app/dashboard/[eventId]/checklist/`  
**PR:** #1646 (foundation commits shipped)
**Sibling (per-event-type):** [`Adaptive_Checklist_Event_Type_Definitions_2026-07-08.md`](Adaptive_Checklist_Event_Type_Definitions_2026-07-08.md) — this doc is **wedding-shaped**; the sibling de-hardcodes its four wedding-only assumptions into an `EventTypeChecklistDef` and defines all 8 non-wedding types. Read them together.

---

## What the Adaptive Checklist IS — and is NOT (governing definition · owner, 2026-07-08)

**It is NOT a printable checklist.** Not a document, not a static to-do list you tick off, not a page you print. If it reads like a fixed list of tasks, it is wrong.

**It IS an execution engine** — an *initiator* that generates **performable tasks** and sequences the couple through them, with **Setnayan AI** plugged in at each decision:

- Each task is an **in-app action the couple executes** (find & lock a vendor · pick the date · set the budget · resolve a clash) — not a checkbox. Every task deep-links into the surface where the doing happens.
- Its purpose: help the couple **manage planning and finish it as fast and efficiently as possible**, always steering toward the **best option** given everything decided so far.
- The mechanism is **progressive constraint locking**: decisions are locked **one at a time**, and every lock **re-shapes** the remaining options, the budget buffer, the date window, and the task list — until the whole event is complete. (This is why "the date is an output," § 1, and why a bundle/vendor lock cascades, §§ 13–15.)
- **Division of labor:** the **checklist initiates and sequences** the decisions; **Setnayan AI optimizes each one** against all live variables (availability · budget · venue · pax · religion · reviews). The two are the same loop, not two features.

> 🔴 **Build implication (verified 2026-07-08):** what ships today is **Layer 1 only** — a static wedding task list, i.e. *precisely the printable checklist this definition rejects*. The progressive-lock / adaptive / best-option behavior lives entirely in the currently-DEAD Layers 2/3 + budget engine (zero callers — see the sibling spec § 1). **Wiring them is therefore the core deliverable, not a follow-on** — it is what converts the document into the engine.

---

## 0. 🔒 2026-07-08 owner directive — the six inputs the Adaptive Checklist must consider

The Adaptive Checklist is not a standalone task list. It must read from and react to **six systems** (owner, 2026-07-08):

| # | Input | What the checklist takes from it (existing mechanism where one exists) |
|---|---|---|
| 1 | **Date Picker** | The `/find-date` Schedule Matrix (§ 1) — the date is the OUTPUT of vendor discovery. The `find_date` task deep-links here; a locked date re-anchors every deadline. |
| 2 | **Schedule** | The couple's schedule/timeline surface — checklist task deadlines and vendor milestones must stay consistent with the unified Schedule view (no two calendars disagreeing). |
| 3 | **Checklist** | The task list itself — three-layer structure (§ 4): static backbone · taxonomy-seeded vendor tasks · per-category adaptive state machine. |
| 4 | **Budget Analyzer** | The budget health-check (§ 15) — `buffer = total − committed − projected(min..max) − paperwork`, best/worst-case range, over-budget prompts. |
| 5 | **Locked Vendors** | `event_vendors` locked state — locking a vendor auto-completes its category task, removes it from projected spend, resolves bundle inclusions (§ 13), and constrains the Date Picker. |
| 6 | **Setnayan AI** | The paid intelligence layer (per-user subscription **₱499 first 28-day cycle → ₱799/28d** — owner-locked 2026-07-02) — reads all five signals above to deliver adaptive resolution (§ 15), bundle value comparison (§ 13), and budget optimisation. |

**Reading of the directive:** inputs 1–5 are the free rule-driven spine; Setnayan AI is the layer that cross-references them intelligently. Any checklist build that treats one of these six as out-of-scope is incomplete.

---

## 1. Core philosophy — the date is an output

The wedding date is the **OUTPUT** of vendor discovery, not the starting point.

Couples arrive with a preferred date or window. As they explore and shortlist their must-have vendors — especially the reception venue and ceremony venue — those vendors' availability reshapes the date. The couple weighs the trade-off: "Is this venue worth moving my date for?" Most of the time, the answer is yes.

Owner's own example: wanted Dec 12 → dream church only had Dec 18 → accepted Dec 18 because they valued that church more than the specific date. This is near-universal for Filipino couples.

**Checklist implication:** Never frame "set your date" as step 1. The date emerges from venue shortlisting. The checklist guides:
> Start with what matters → explore venues → let priorities find your date.

The `/find-date` Schedule Matrix is the central mechanism — it intersects the couple's candidate dates against shortlisted vendor availability and surfaces the best match. The checklist deep-links to it from the `find_date` task.

---

## 2. Onboarding pre-fill — the checklist is never blank

By the time a couple opens the checklist, onboarding has already set:

| Signal | DB column | Checklist task auto-completed |
|--------|-----------|-------------------------------|
| Guest count | `events.estimated_pax` | `guest_estimate` |
| Working budget | `events.estimated_budget_centavos` | `set_budget` |
| Ceremony type | `events.ceremony_type` | Gates church-only tasks (banns, pre-Cana, etc.) |
| Vendor picks | `events.style_preferences.interested_categories` | Seeds Tier 3 vendor task list |

Auto-completion signals are defined in `lib/checklist-autocomplete.ts`. The `budgetSet` and `guestEstimateSet` signals fire as soon as these fields are non-null, so for any couple who completed onboarding, both tasks arrive pre-done.

The `interested_categories` picks from onboarding screen 9 ("What would you love?") are the **starting** scope — not the frozen scope.

---

## 2a. Living scope — Explore expands the plan automatically

The couple's planning scope is a living set. It grows whenever they engage with a new category in Explore, without requiring them to return to onboarding.

**Source of truth for "what is the couple planning":**
```
interested_categories (onboarding picks)
UNION
plan groups where an event_vendors row exists (Explore additions)
```

When a couple unlocks or shortlists a vendor in a category they didn't pick in onboarding, the environment responds immediately across three surfaces:

1. **Checklist** — `ensureChecklistSeeded()` fires on next open, detects the new `event_vendors` plan group, and seeds the corresponding task. The state starts at `in_progress` — no decision prompt, because engaging with a vendor in Explore IS the decision.
2. **Budget health-check** — recomputes to include the new category's estimated cost. Buffer updates immediately.
3. **Tier 3 scope** — `checklistTier3PlanGroups()` now includes the new category.

**State a category lands in when added from Explore:**

| Action in Explore | Checklist state on arrival |
|-------------------|---------------------------|
| Just browsed the category tile | `not_started` — no signal yet |
| Viewed a vendor profile (shortlisted) | `searching` |
| Sent inquiry / unlocked a vendor | `in_progress` |
| Vendor at contracted / deposit paid | `done` |

The `needs_decision` prompt only fires for categories with no `event_vendors` signal at all. A category touched in Explore skips the decision prompt entirely.

---

## 3. Three-layer checklist structure

```
┌─────────────────────────────────────────────────┐
│ Layer 1 · Static backbone                       │
│ Paperwork · Attire · Guests · Logistics         │
│ Same for every couple. Fixed tasks, fixed order. │
├─────────────────────────────────────────────────┤
│ Layer 2 · Taxonomy-driven vendor tasks          │
│ Generated from event-type plan-group tree       │
│ + couple's interested_categories from onboarding │
│ Different event types → different vendor tasks. │
├─────────────────────────────────────────────────┤
│ Layer 3 · Adaptive state machine                │
│ Per vendor-category state:                      │
│   not started → needs more options →            │
│   one option → in progress → done               │
│   (or: excluded · deferred)                     │
└─────────────────────────────────────────────────┘
```

Layer 2 is *intended* to be seeded via `lib/checklist-taxonomy.ts` reading the active event type's plan-group tree and the couple's picks. ⚠ **Code-verified 2026-07-08:** this is NOT built — `lib/checklist-taxonomy.ts` is a 28-line stub (returns `interested_categories`, reads no plan-group tree) with **zero callers**, and only `ensureChecklistSeeded()` (Layer 1, `checklist-actions.ts:40`) actually fires. Layer 2 wiring is net-new work, not a top-up on existing code. See [`Adaptive_Checklist_Event_Type_Definitions_2026-07-08.md` § 1](Adaptive_Checklist_Event_Type_Definitions_2026-07-08.md) for the verified gap + de-hardcode plan.

---

## 4. Phase 1 ordering — reception venue anchors everything

The first planning phase (18–12 months out) follows this sequence, in this exact order:

1. Decide wedding type & vibe
2. Agree who pays for what
3. Share rough timing preference (a window — not a locked date)
4. Draft guest list
5. Choose wedding party
6. **Confirm guest count** (needed before evaluating venues)
7. **Review budget** (estimated from onboarding recommended services)
8. **Research & shortlist reception venues** ← Tier 1 anchor, comes first
9. Research & shortlist ceremony venues ← follows reception
10. Ask parish for requirements (church-only)
11. **Find the date both venues share** (→ /find-date)
12. **Lock the date** (→ /date-selection)

Reception venue comes before ceremony venue because it constrains capacity, budget ceiling, and date availability more than any other single vendor. Once the reception shortlist exists, ceremony venues can be filtered against those date windows.

---

## 5. Three-tier budget model

Every wedding budget — and budget health-check — is computed in this priority order:

### Tier 1 — Reception venue (the anchor)
The single most capacity-constrained and date-constrained vendor. Sets the ceiling for guest count and establishes the date window every other vendor is checked against. Shortlisted and deposited first. Defined in `CHECKLIST_BUDGET_TIERS.tier1`.

### Tier 2 — The 4 Big
**Ceremony venue · Catering · Coordinator · Photo & Video**

Together these account for 60–75 % of most PH wedding budgets. Booked immediately after the date is locked. Defined in `CHECKLIST_BUDGET_TIERS.tier2`.

### Tier 3 — The rest of the event-type taxonomy
**Not a hardcoded list.** Computed at runtime from the couple's `interested_categories` picks, filtered through the active event type's plan-group tree, minus whatever is already covered by Tier 1 + Tier 2.

Different event types carry different taxonomies → Tier 3 looks different for a debut, a birthday, or a corporate event. The helper `checklistTier3PlanGroups(interestedPlanGroups)` derives this dynamically. Defined in `apps/web/lib/checklist.ts`. → Per-type anchors, core clusters, and Tier-3 plan groups for all 9 types: [`Adaptive_Checklist_Event_Type_Definitions_2026-07-08.md` § 5](Adaptive_Checklist_Event_Type_Definitions_2026-07-08.md).

### Paperwork line (separate from the 3 vendor tiers)
Costs computed from `ceremony_type` + `region`:

| Task key | Applies to | Cost range |
|----------|-----------|-----------|
| `marriage_license` | All ceremony types | ~₱500–1,000 (LGU-dependent) |
| `psa_cenomar` | All ceremony types | ~₱365–500 per document |
| `church_fee` | Catholic only | ~₱5,000–20,000 (parish-dependent) |
| `pre_cana` | Catholic only | ~₱2,000–5,000 (diocese-dependent) |

Defined in `BUDGET_PAPERWORK_TASK_KEYS`. Amounts are estimates — the budget page labels them as "estimated" and links to the relevant task for confirmation.

**Budget health-check formula:**
```
total_budget  = events.estimated_budget_centavos (fixed unless couple adjusts)
committed     = sum of exact costs from locked event_vendors rows
projected     = sum of estimated ranges for all planned-but-unlocked categories
                (market-rate min/max from vendor_market_stats, pax + region adjusted)
paperwork     = static estimates from ceremony_type + region
──────────────────────────────────────────────────────────────────
buffer        = total_budget − committed − projected − paperwork
```

Buffer is shown as a **range** (best case / worst case) — because `projected` is itself a range:
- **Best-case buffer** = total − committed − sum(projected_min) − paperwork
- **Worst-case buffer** = total − committed − sum(projected_max) − paperwork

Each service holds its own market-rate range. Adding a new service does NOT reallocate or shrink other services' ranges — it only reduces the buffer.

**When a new service is added (from Explore or checklist):**
Impact is shown at the moment of adding, before the couple goes deep:
> "Adding a live band will use approximately ₱30,000–₱80,000 of your remaining buffer. You'll have ₱40,000–₱90,000 left after this."

If adding pushes the buffer negative:
> "Adding a live band may push you over your planned budget by ₱20,000–₱50,000. Do you want to increase your budget, or look for a lower-priced option first?"

**Buffer display states:**
- Best-case buffer ≥ 0: "You're in a good range — everything looks covered."
- Best-case ≥ 0 but worst-case < 0: "You're close — fine if vendors are priced at the lower end, but tight if they run higher."
- Best-case < 0: "This might not be enough. Here's what to do."

---

## 6. Adaptive state machine — per-category states

Each vendor category in the checklist has its own state:

```
not_started
  → (couple opens checklist, category is in their interested_categories)
  → needs_decision     ← "Did you want to include X?" prompt
     → excluded        ← "Definite No"
     → deferred        ← "Haven't decided yet" (re-surfaces after 30 days)
     → searching       ← "Let's look for one" → /vendors?open=<tile>

searching
  → needs_more_options ← 0 vendors shortlisted after 14 days
  → one_option         ← exactly 1 vendor shortlisted
  → in_progress        ← ≥2 vendors shortlisted or 1 with inquiry sent
  → done               ← vendor at contracted / deposit / delivered / complete
```

States for categories NOT in `interested_categories`:
- Always start at `needs_decision`
- "You haven't planned for X — do you want to add it?"

Persisted in `event_category_decisions` table (build queued):
```sql
CREATE TABLE event_category_decisions (
  id          bigserial PRIMARY KEY,
  event_id    uuid NOT NULL REFERENCES events(id),
  plan_group_id text NOT NULL,
  decision    text CHECK (decision IN ('excluded', 'deferred')),
  decided_at  timestamptz DEFAULT now(),
  resurface_at timestamptz, -- set when decision = 'deferred'
  UNIQUE (event_id, plan_group_id)
);
```

---

## 7. Decision capture UX

When the checklist identifies a category with `state = needs_decision`, it surfaces a decision prompt inline:

> **Florist / Stylist**
> You haven't planned for this yet.
> `[Let's look for one]` · `[Definite No]` · `[Not sure yet]`

- **"Let's look for one"** → deep-links to `/vendors?tab=shortlist&open=<tile>` and sets state to `searching`
- **"Definite No"** → writes `decision = 'excluded'` to `event_category_decisions`; task is hidden from the checklist from that point
- **"Not sure yet"** → writes `decision = 'deferred'`, `resurface_at = now() + 30 days`; task re-surfaces after 30 days

---

## 8. Budget health-check

Shown inline on the checklist (not a separate page). Displays the buffer range and per-tier breakdown. Updates immediately whenever the couple adds a service, locks a vendor, or adjusts their total budget.

**Data sources:**
1. `events.estimated_budget_centavos` — total (fixed unless couple adjusts)
2. Locked `event_vendors` rows — exact committed costs
3. Planned-but-unlocked categories — `vendor_market_stats` min/max for region + pax tier
4. Paperwork line — static estimates from `ceremony_type` + `region`

**Display states (see §5 for formula):**
- Healthy: "Your ₱XXX budget looks good. Best case you'll have ₱YYY left over."
- Close: "You're close — you're fine at the lower end of vendor pricing, but tight if costs run high."
- Over: "Your planned services may exceed your budget by ₱X–₱Y. Here's what to do:" → `[Increase your budget]` · `[Find lower-priced options]` · `[Remove a category]`

---

## 9. No-results state

When the couple has a category in their plan but no vendors are available (or none fit their budget):

> **No caterers found in your range.**
> `[Negotiate with a vendor]` · `[Increase your budget for catering]` · `[Look for a lower-priced option]` · `[Find one outside Setnayan]`

- **Negotiate** → opens the negotiation flow (see §10)
- **Increase budget** → opens the budget page pre-scrolled to the catering line
- **Lower-priced option** → re-runs the vendor search with a relaxed price filter
- **Find outside Setnayan** → prompts: "Add their details as an external vendor" + invite-to-Setnayan CTA

**Within-category alternatives (reactive):**
When a couple searches within a picked category and finds no matches (or only 1–2 unsatisfying options), the checklist surfaces sibling categories from the same taxonomy folder:
> "No photo booths found in your area — but there are 360 booths, mirror booths, and digital booths nearby. Want to explore?"

---

## 9a. Expansion recommendations — after all chosen vendors are locked

**Trigger:** Every category in `interested_categories` has a vendor in `done` state (contracted / deposit paid / delivered). All three tiers of their initial picks are complete.

Only at this point does the checklist offer categories from the event-type taxonomy that the couple hasn't picked or explicitly excluded.

> "You've covered everything you planned for — great work. Here are other services popular at weddings like yours:"

Surfaced in priority order:
1. **Within budget buffer** — categories available in their area that fit within the remaining buffer. Shown first with estimated cost.
2. **Needs budget expansion** — categories that would require increasing the budget. Shown second with a clear budget note.
3. **No vendors in their area yet** — categories with no local vendors on Setnayan. Shown last with "Invite a vendor" CTA.

Categories the couple previously marked "Definite No" (`excluded`) are never shown in expansion. Categories marked "Not sure yet" (`deferred`) are shown first among the expansion list if their `resurface_at` has passed.

---

## 10. Negotiation path

When a couple wants to negotiate with a vendor on price or scope:

1. Checklist surfaces the option ("Negotiate with [Vendor Name]")
2. Couple sees a **pre-drafted message** — editable before sending:
   > "Hi [Vendor]! We love your work and we're very interested. Our budget for this category is ₱X — is there a package or arrangement that could work for us?"
3. Message is sent through the **in-app vendor-customer chat thread**
4. All planning actions (negotiation initiated, budget decisions, lock events) are **logged in that thread** so both parties have a full audit trail

**One-at-a-time rule:** A couple can only have **one active negotiation open per vendor** at any time. This prevents inbox flooding. The checklist enforces this — the "Negotiate" CTA is disabled if there's already an open negotiation with that vendor.

---

## 11. Completion display

Three levels:

1. **Overall %** — `(done tasks / total applicable tasks) × 100`
2. **Phase completion states** — per countdown phase (P1–P9):
   - `not started` · `in progress` · `complete` · `overdue`
3. **Key milestone markers** — auto-detected from DB state:
   - "Date locked" (date_status = 'locked')
   - "Reception venue confirmed" (vendor at contracted status)
   - "Ceremony venue confirmed"
   - "Marriage license filed"
   - "Invitations sent"
   - "Seating chart finalized"

---

## 12. Search filter inheritance — locked decisions become hard filters

The Explore search filters adapt as the couple locks decisions. Refinements (style, service attributes) are never overridden — only the objective filters change.

### Before any locks — initial state from onboarding
| Filter | Source | Type |
|--------|--------|------|
| Location | `events.region` (target area from onboarding) | Hard |
| Date availability | Candidate window — indicative only | Soft |
| Capacity | `events.estimated_pax` | Hard |
| Price | Per-category budget range | Soft rank |
| Refinements | Style + attribute picks from onboarding | Soft rank |

### When reception venue is locked
Location filter shifts from the couple's general region to **"vendors who can serve [Venue Name] at [Venue Address]"**:
- Center point moves from region → venue coordinates
- Vendors outside their declared service radius for that location are excluded or ranked down
- Travel fees become visible on result cards for vendors who serve but charge extra
- **Venue accreditation** (PH-specific): vendors accredited at that venue surface first with an "Accredited at [Venue]" badge; non-accredited vendors show below with "Works at external venues — confirm with your venue"

### When date is locked
- Vendors unavailable on the locked date are **hard-excluded** — not ranked lower, removed entirely
- The strictest filter: no value showing a vendor who can't be there

### What never changes — refinements
Style preferences (boho, glam, Filipiniana, modern) and service attributes (buffet vs plated, indoor vs outdoor) are taste signals. Locking a venue or date does not override them.

### Full filter priority stack (after venue + date locked)
```
1. Available on locked date           ← hard exclude if not
2. Can serve locked venue location    ← hard exclude beyond service radius
3. Capacity ≥ estimated_pax           ← hard exclude if too small
4. Price within category budget range ← soft rank (shows cost delta if over)
5. Venue accreditation                ← soft rank (accredited first)
6. Refinements (style / attributes)   ← soft rank (match score)
7. Normal match score                 ← tiebreaker
```

---

## 13. Bundle handling — one price, many categories

### Reading a bundle
A vendor package that covers multiple plan-group categories is declared via `bundle_inclusions` on the service/package row — a list of plan-group IDs the package covers (e.g., `['reception_venue', 'catering', 'cake', 'florist', 'bridal_car', 'accommodation']`).

The budget health-check treats a bundle as **one line item covering many categories** — never split proportionally for display:
```
Hotel Grand Package — ₱250,000
  ✓ Reception venue
  ✓ Catering (200 pax)
  ✓ Wedding cake
  ✓ Flowers & arrangement
  ✓ Bridal car
  ✓ Accommodation (1 night)

Remaining budget for uncovered categories:
  total_budget − ₱250,000 − estimated cost of still-open plan groups
```

### Proportional split — internal only, not displayed
The AI uses proportional allocation internally to answer "is this bundle a good deal?" It pulls `vendor_market_stats` standalone estimates for each included category, sums them, and compares to the bundle price:
> "The Grand Hotel package covers 6 of your planned categories for ₱250,000. Booking these separately would cost ₱280,000–₱350,000 — a potential saving of ₱30,000–₱100,000."

The couple never sees the split. They see the comparison.

### Unplanned inclusions — "bonus" services
When a bundle includes a category the couple didn't pick in onboarding:

1. **Checklist:** The corresponding task is seeded and immediately marked "Covered by [Hotel] package" — appears as completed with a badge, not pending.
2. **Budget:** The unplanned service's standalone market-rate estimate is included in the AI's value comparison:
   > "Your hotel package also includes a bridal car you hadn't planned for — that's ₱8,000–₱15,000 in extra value at no additional cost."
3. **Explore:** If the couple browses that category later, they see: "Your hotel package already includes this — looking for an upgrade?"

### Checklist impact when a bundle is locked
Every plan-group in `bundle_inclusions` gets its corresponding checklist task auto-completed simultaneously:
- Planned inclusions → `done` (Covered by [Vendor] package)
- Unplanned inclusions → seeded + `done` (Bonus — Covered by [Vendor] package)

A bundle lock is a major checklist unlock — the open task list can shrink by 4–6 items at once.

### Basic vs AI tier
- **Basic:** Single bundle line item, covered tasks marked done, remaining categories listed.
- **Setnayan AI:** Runs the standalone comparison, highlights bonus inclusions with their value, and factors the bundle value into budget optimisation suggestions.

---

## 14. Vendor recommendations, quality signals, ratings, and push notifications

> **Full spec:** [`Vendor_Quality_Rating_System_2026-06-17.md`](Vendor_Quality_Rating_System_2026-06-17.md)

This section summarises how these systems connect to the checklist. Read the full spec for data models, formulas, and build sequence.

### Vendor recommendations and sponsored tie-ups (full spec §8)

Vendors maintain commercial relationships with other vendors. Four types: `accredited` · `sponsored_included` · `sponsored_discounted` · `general`.

**Checklist impact of `sponsored_included`:** When a reception venue is shortlisted and has `sponsored_included` partners, those categories auto-advance to `one_option` in the checklist state machine with the included vendor pre-populated. Common PH hotel packages (venue + catering + florist + bridal car + accommodation) can resolve 4–6 checklist categories in a single shortlist decision. Budget health-check removes those categories from projected spend immediately.

**Search result priority (factor 6):** `sponsored_included` pinned at top → `sponsored_discounted` second → `accredited` / `general` labeled, no position change. All recommendations require `admin_verified = true` before any badge surfaces.

### How they appear in search results (summary — full detail in linked spec)

Recommendations are a soft-rank factor (factor 6 in the priority stack). They never eliminate non-recommended results.

```
1. Available on locked date      ← hard exclude
2. Can serve locked venue        ← hard exclude
3. Capacity ≥ estimated_pax      ← hard exclude
4. Price within budget range     ← soft rank
5. Venue accreditation           ← soft rank
6. Sponsored recommendations     ← soft rank + badge  ← THIS SECTION
7. Quality score                 ← soft rank
8. Refinements                   ← soft rank
9. Normal match score            ← tiebreaker
```

See [`Vendor_Quality_Rating_System_2026-06-17.md §8`](Vendor_Quality_Rating_System_2026-06-17.md) for the full data model, badge rules, AI budget arithmetic, and admin verification flow.

---

## 15. Over-budget behaviour — always prompt, never block

Couples are never hard-blocked from adding a service that exceeds their budget. The real commitment is a deposit payment, not a shortlist entry. Over-budget browsing is normal planning behaviour.

**Trigger:** the moment a service is added and the best-case buffer goes negative, a prompt appears.

> "Adding a live band pushes you over your budget by ₱20,000–₱50,000."

**Basic tier (free) — manual resolution:**
> `[Increase my budget]` · `[Remove a service to make room]` · `[Add it anyway]`

The couple decides manually. No guidance on which service to cut or how to save.

**Setnayan AI tier (per-user subscription — ₱499 first 28-day cycle → ₱799/28d · repriced 2026-06-30/07-02, was ₱3,999 one-time) — adaptive resolution:**
> `[Help me stay within budget]` · `[Increase my budget]` · `[Add it anyway]`

"Help me stay within budget" triggers the adaptive path — Setnayan reviews the full plan and suggests:
- Which planned service has the most negotiation room
- Which category has cheaper alternatives available in their area
- The buffer impact of deferring one lower-priority service

**"Add it anyway" is always available on both tiers.** Some couples know they're going over and are fine with it. The health-check stays in the over-budget state as a persistent reminder, but never blocks progress.

This is the primary paywall moment in the adaptive checklist: the basic prompt is honest and functional; the AI prompt actively solves the problem.

---

## 17–19. Vendor quality signals, push notifications, and rating system

> **Full spec:** [`Vendor_Quality_Rating_System_2026-06-17.md`](Vendor_Quality_Rating_System_2026-06-17.md)

These systems are fully documented in the dedicated vendor quality spec. Summary of their connection to the checklist:

- **Quality score (§17):** Factor 7 in the Explore search priority stack. Precomputed on `vendor_activity_stats` — never computed at query time. Feeds from response rate, review Bayesian average, median first-reply time, and login recency.
- **Push notifications (§18):** Supabase database webhook on `messages INSERT` → `/api/notify` → FCM/APNs/Web Push. No cron. 10-minute dedup via `last_push_notified_at` on the thread. Faster replies → better quality score → better placement.
- **Vendor rating system (§19):** Two scores — Couple Trust Score (public, 0–100) and Platform Health Score (internal HQ, 0–100). Experience badge from finalized booking count (New / Established / Experienced / Expert / Elite). Reviews unlock 30 days after event date, completed bookings only. Three aspect ratings: Communication / Quality of Service / Value for Money.

---

## 16. Build sequence (queued)

| Step | What to build | File |
|------|--------------|------|
| 1 | `lib/checklist-taxonomy.ts` · `event_category_decisions` migration · `lib/checklist-state.ts` · `lib/checklist-autocomplete.ts` dateStatusLocked signal (**SHIPPED PR #1649**) | Multiple new files |
| 2 | `lib/checklist-budget.ts` — `computeBudgetHealth(eventId)` using `budget_leaf_benchmarks` (**SHIPPED PR #1651**) | `lib/checklist-budget.ts` |
| 3 | `vendor_activity_stats` · `vendor_push_tokens` · `vendor_partnerships` migrations · `chat_threads.last_push_notified_at` (**SHIPPED PR #1650**) | `20270110320014–17_vendor_*.sql` |
| 4 | `/api/notify` push dispatch route — webhook-driven, no cron (building PR 4) | `app/api/notify/route.ts` |
| 5 | `lib/vendor-activity.ts` — score recomputation via `after()`/`waitUntil` (building PR 5) | `lib/vendor-activity.ts` |
| 6 | Push token registration on app open (PWA service worker + Capacitor plugin) | `apps/web/public/sw.js` + `apps/mobile/` |
| 7 | Quality score slot in vendor search soft-rank + recommendation badges | `app/dashboard/[eventId]/explore/` |
| 8 | Vendor dashboard stats panel (response rate, review avg, quality score trend) | `app/vendor-dashboard/` |
| 9 | Decision capture UX — inline decision prompts on checklist page | `app/dashboard/[eventId]/checklist/_components/` |
| 10 | No-results state + negotiation flow | Same components |
| 11 | Supabase database webhook config on `messages INSERT` → `/api/notify` (owner action) | Supabase dashboard |
| 12 | HQ verification queue for `vendor_partnerships` + review flag adjudication (iteration 0023) | `app/admin/vendor-partnerships/` |
| 13 | Couple review flow with 3 aspect ratings (`rating_communication/rating_quality/rating_value`) | `app/dashboard/[eventId]/vendors/[id]/review/` |
| 14 | Threshold action emails via Resend (iteration 0028) | New email templates |
| 16 | Onboarding copy update — reflect date-as-output framing | `app/onboarding/wedding/` |
