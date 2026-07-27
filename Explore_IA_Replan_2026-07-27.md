# Explore IA Replan — post-lock compatibility + integrated Build·Budget·Compare
**Date:** 2026-07-27 · **Status:** DESIGN (owner review) · **Author:** Claude Code (Fable 5 planning session)

> Owner ask (verbatim, condensed): *(1)* "when a service is locked for that category, the rest of the
> services incompatible to that date/venue will be unclickable but will not be removed. all that will
> stay are those they can still book. once they have locked it we will ask if they are done on this
> service, or they want to add more making this category double." *(2)* "replan how the different
> categories will be displayed … easier to navigate around the different categories they need to
> cover, alongside with build, budget, compare. you can integrate them together. The idea of compare
> is to create different builds that complement each other and compare them side by side … without
> destroying the true essence … explore the different options, and compare, check budget, date,
> location, and lock the services they want. filtering them out and sorting them properly."

## 0. Ground truth this design starts from (Rule 0 — what already exists)

The live couple surface `/dashboard/[eventId]/vendors` (BUDGET_BUILD flag ON in prod) is a
**single-scroll takeover**, not tab-switching: four stacked sections — *Browse the bench*
(`shortlist-categories.tsx`) · *Build your team* (`Build3StateControl` + `BuildLocked`) · *Your
budget* (`MerkadoBudgetLens`, payments-only) · *Compare saved builds* (`build-compare.tsx`,
unbounded named `budget_builds` + a live "Current" column). Desktop: bench left, the other three in
a sticky 380px right rail. Key primitives already shipped:

| Primitive | Where | State |
|---|---|---|
| Per-vendor fit verdicts (reach / budget / date) | `FitBadges` (`shortlist-categories.tsx:319`), fed by `getBatchVendorAvailableDays` + tier radius + budget fit | LIVE — **badging only**, never disables |
| "From your plan" category chip strip | `shortlist-categories.tsx:628` (`openPlan`) | LIVE — no status, plan-picks only |
| Sort lenses | `lib/bench-sort.ts` — fit · price · rating (+ reason pills) | LIVE |
| Per-category tri-state | `event_category_build_state` — Locked / Auto / Excluded + pinned vendor (+ `_dim_date/_budget/_location`) | LIVE |
| Working build (multi-pick) | `event_build_picks` PK (event, group, **vendor**) since `20261020000000` | LIVE |
| Saved plans + side-by-side matrix | `budget_builds` (unbounded, named) + `BuildCompare` matrix + availability footer + Modify/apply | LIVE |
| Post-lock feedback | `LockMilestoneToast` (congrats + undo) + `LockDateConfirmModal` ("locking sets your date to {date}") | LIVE |
| Category decisions | `event_category_decisions` — `excluded` / `deferred` only | LIVE |
| Hard-single gate | `HARD_SINGLE_PICK_GROUPS` (6 groups) + DB partial index; everything else multi-lock (PR #3789: shortlist survives the first lock) | LIVE |
| Availability HIDING | ONE place: `/explore` intersection filter once `lockedCount > 0` | LIVE |

**⚠ Carry-over from #3789:** its "Add another" CTA + "✓ N locked · add more" chip landed on the
LEGACY `PlanBudgetAccordion` (kill-switch path). The shared `finalizeVendor` sweep-gate IS live.
This replan carries the affordance to the live bench (§2.3).

---

## 1. Part 1 — Post-lock compatibility ("stay, but can't book")

### 1.1 The model: locks commit ANCHORS; anchors grey the field

A lock's side-effect is not "this category is taken" — it is that the event's **anchors** harden:
locking can finalize the **date** (`date_will_lock`), locking the reception venue fixes the
**location**, every lock consumes **budget**. Compatibility is then a per-vendor verdict *against
the anchors*, and it applies to **every rail in every category**, not just the locked one:

```
incompatible(vendor) = dateFit === 'booked'          // vendor's calendar blocks the locked date
                    ∨ reachesVenue === false          // outside their service radius from the locked venue
```
(Both verdicts already computed per card — `FitBadges`. Budget-over stays a soft badge, never a
disable: prices are negotiable, calendars and geography are not.)

### 1.2 Rendering: DIM + DISABLE + SINK — never remove

- **Compatible** cards: unchanged, sorted first.
- **Incompatible** cards: stay in the rail but (a) dimmed (reduced opacity / muted photo),
  (b) the booking actions (**Add to build · Lock · pin**) disabled, (c) the reason is the loudest
  element on the card — "Booked on your date" / "Can't reach your venue", (d) they **sink to the
  tail** of the rail behind a thin divider: *"Not available for your date/venue"*.
- **RECOMMENDED (owner call §4.1): dimmed-but-viewable, not strictly unclickable.** Tapping still
  opens the quick-view/profile with booking disabled and one escape hatch: **"Ask anyway"** (opens
  the chat thread). Reason: the availability pipeline is deliberately **fail-open** ("a calendar
  flake reads free, never a false booked") — but vendor calendars can also be stale the other way;
  a strictly dead card turns a stale calendar into a lost booking with no recourse. Chat resolves it.
- Sort default becomes **compatibility-first** (compatible → soft-flagged → incompatible), then the
  chosen lens (fit/price/rating). No new sort UI needed — it's a stable pre-partition, exactly the
  pattern `category-search.ts:1099` already uses.

### 1.3 The post-lock question: "Done with this, or add another?"

On a successful `finalizeVendor` in a **multi-pick** category, extend the existing
`LockMilestoneToast` with a one-line question (not a new modal):

> **Photo Booth locked ✓** — are you done with this service?
> **[ ✓ I'm done ]  [ + Add another ]**  *(Undo stays)*

- **"I'm done"** → writes `event_category_decisions.decision = 'complete'` (**additive** CHECK-value
  migration; table + couple-own RLS already exist). The category collapses to a one-line
  **"✓ Covered — reopen"** row, and the what-to-lock-next pointer advances.
- **"Add another"** → rail stays open showing compatible-only remainder; the rail's trailing card
  reads **"＋ Add another {category}"** (carries #3789's affordance to the live bench).
- **Hard-single categories skip the question** — the slot is filled, auto-`complete`.
- No answer (toast dismissed) → nothing written; the category simply shows "1 locked · add more".
- `'complete'` is reversible (reopen clears it) and powers §2.1's coverage states.

### 1.4 ⚠ Prerequisites this design makes urgent (not new decisions — already logged)

1. **Lock still reserves NOTHING** (DECISION_LOG 2026-07-26): `contracted` doesn't consume schedule
   pools; availability is display-time. Greying other couples' options on data that a lock doesn't
   actually hold makes the (a) *pool-acquire at `contracted` + expiry* vs (b) *"Lock is a claim"
   labeling* decision **blocking for §1.2's credibility**. Recommend (a) with a 7-day unpaid-lock
   expiry.
2. **`/find-date` vendor pool is dead** (memory: 42703 on two non-existent columns) — the date-anchor
   path this design leans on must be fixed first.

---

## 2. Part 2 — The integrated IA: one spine, three objects

**Essence preserved:** explore options → compare → check budget/date/location → lock. The replan
does not rebuild the shipped single-scroll takeover; it re-anchors navigation on the one question
couples actually have — *"what do I still need to cover?"* — and merges the overlapping sections.

The couple thinks in **three objects**, and the surface should show exactly three:

| Object | What it is | Absorbs today's… |
|---|---|---|
| **Coverage** (the spine) | The categories they need to cover, each with a live state | "From your plan" strip + folders + Build 3-state |
| **Your team** (the outcome) | Locked + in-build picks, running total vs budget, anchors | Build section + BuildLocked tiles + Budget summary |
| **Plans** (the sandbox) | Named saved builds compared side by side | Compare |

### 2.1 The Coverage Strip — category navigation becomes a status spine

Upgrade the existing plan-chip strip (`openPlan` already does the navigation) into the **primary
navigator**, always visible at the top of the bench:

- One chip per needed category, each carrying a state glyph:
  `○ not started · ◔ exploring (has shortlist) · ◕ picked (in build) · ● locked · ✓ done ('complete') · – skipped ('excluded'/'deferred')`
- **Ordered by urgency, not taxonomy**: `timelineStatus` (overdue → due-soon → start-now →
  upcoming) then coverage state — the leftmost chip is always *the next thing to do*. A count sits
  above it: **"Covered 6 of 11"**.
- Tap chip → the existing `openPlan` scroll/open. Folders remain below as the browse-all fallback
  (unchanged) — the strip is for *their* plan, folders are for *discovering* beyond it.
- The strip replaces nothing structurally; it upgrades `plan-strip` in place. Categories answered
  "I'm done" render ✓ and move right, shrinking the visible to-do set — this is the "easier way to
  navigate what they need to cover".

### 2.2 Merge Build into the bench + "Your team" rail

The bench and the Build section currently split one decision across two places (bench = browse/add,
Build = tri-state/pin/lock). Merge them:

- **Per-category controls move onto the category row** (the accordion row the couple already
  taps): the Locked/Auto/Excluded tri-state + pinned-vendor become a compact control on the open
  tile, next to its rail. One place per category to browse, pick, and lock.
- The right rail's Build section becomes **"Your team"**: locked vendors (with ● and cost) + build
  picks (◕) + the three anchors (Date · Budget · Location — the `_dim_*` rows already exist) + a
  **buffer line**: `estimated budget − locked − in-build = ₱X to spare / over`. This is the always-
  visible "check budget, date, location" the owner named — no tab visit needed.
- **Budget section stays** but only as the payments lens it already is (paid/remaining/upcoming) —
  its planning half (buffer) moved up into "Your team". Net: the four stacked sections become
  **Bench (with Coverage Strip) · Your team · Plans · Payments** — same scroll pattern, clearer jobs.

### 2.3 Locking on the bench

With tri-state on the category row, the **Lock action moves to where the vendor card is** (today:
bench cards can't lock; only Build rows can). The hardened `finalizeVendor` flow (conflict gate,
date-will-lock modal, milestone toast, undo) is reused verbatim — only the button placement
changes. Post-lock, §1.3's Done/Add-another question fires right there.

### 2.4 Plans (Compare) — "different builds that complement each other"

Keep the shipped matrix; sharpen its identity to match the owner's intent:

- **Rename the section "Plans"** (verb: *Save this as a plan*). "Compare" is what you do to plans,
  not what the object is.
- **Locked picks are pinned rows in EVERY column** — shown with ● at the top of the matrix,
  identical across plans, immutable from here. A plan can only vary the **unlocked** categories.
  That is the "complement each other" semantics made structural: plans are alternative ways to
  finish the *same* committed core, so comparing them is always apples-to-apples on the part that's
  still open. (Today `applyBuildToWorking` could silently diverge from locks; pinning kills that.)
- Column footer already shows the shared-available-dates row + over/under verdict — keep both; add
  the anchor row (Date · Venue) so "check date/location" is visible per plan.
- Entry point: a **"Save current as a plan"** button on "Your team" (the natural moment: they have
  a team forming and want to try a variant), plus the existing in-section save.
- `/explore/compare` (vendor-vs-vendor, max 2) is untouched — different tool, different question.

### 2.5 Filtering & sorting, unified

- Bench keeps the 3 lenses (fit/price/rating) + the §1.2 compatibility pre-partition as the new
  default order.
- **Port the legacy overlay's filter sheet to the live bench rail** (it only exists on the
  kill-switch path today): distance chips (10/25/50 km) · verified-only · the dynamic facet
  dimensions (`lib/vendor-facets.ts`, already built) · "only exact matches". One small funnel icon
  per open tile.
- `/explore` (public marketplace) keeps its own drawer; add the missing **price + distance sort
  keys** there (today: reviews/rating/newest/name only).

---

## 3. Build order (PR-sized, each independently shippable)

| # | Slice | Size | Notes |
|---|---|---|---|
| A | `event_category_decisions` + `'complete'` value · Done/Add-another on the lock toast · "✓ Covered" collapse | S | additive migration + toast/UI |
| B | Compatibility DIM+DISABLE+SINK on bench rails (reuse FitBadges verdicts) + compatibility-first partition | M | no schema |
| C | Coverage Strip upgrade (states + urgency order + covered count) | M | reuses `openPlan` |
| D | "Your team" merge (tri-state onto category rows · right-rail team + anchors + buffer) | L | biggest UI move |
| E | Plans reframe (rename · pinned locked rows · "Save current as plan" entry) | M | no schema |
| F | Filter-sheet port to bench + `/explore` price/distance sorts | M | reuses `vendor-facets` |
| — | **Owner gate before B ships loud:** the 2026-07-26 lock-reserves-date decision (§1.4.1) + `/find-date` pool fix | — | blocking for credibility |

## 4. Owner decisions requested (plain English)

1. **Incompatible cards: strictly unclickable, or dimmed-but-viewable with booking disabled + "Ask
   anyway" chat?** Recommendation: dimmed-but-viewable — calendars go stale both ways; a chat
   message rescues a false "booked", a dead card doesn't.
2. **"I'm done" collapse: hide the category entirely, or a one-line "✓ Covered — reopen" row?**
   Recommendation: the one-line row — reversible, no mystery.
3. **Lock-reserves-date (already pending from 2026-07-26):** (a) make Lock actually hold the date
   (pool-acquire at `contracted`, unpaid-lock expiry ~7 days) or (b) label Lock a claim. This
   design's grey-out assumes (a). Recommendation: (a).
