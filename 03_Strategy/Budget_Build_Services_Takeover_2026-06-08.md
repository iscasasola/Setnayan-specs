# Budget "Build" — Services Takeover (2026-06-08)

> **Status: SPEC — design locked this session, no code yet.** Captures the owner design
> session of 2026-06-08. The repo keeps its worktree + PR workflow — **nothing here ships
> until the owner green-lights a build PR.** Section 12 lists the open defaults; everything
> else is settled.
>
> **Grounded in shipped `origin/main`:**
> - `apps/web/app/dashboard/[eventId]/vendors/page.tsx` + `_components/plan-budget-accordion.tsx`
>   (the live Services tab — the "5 surfaces" this re-homes), `_components/accordion-lock.tsx`,
>   `_components/category-search-overlay.tsx`, `../_components/match-criteria-strip.tsx`.
> - `apps/web/lib/setnayan-ai.ts` — `isSetnayanAiActive()` (THE gate), `planning_mode`,
>   `setnayan_ai_active`, `SETNAYAN_AI_PAYWALL_ENABLED`.
> - `apps/web/lib/budget-allocation.ts` — `computeBudgetAllocation()` (the allocator).
> - `apps/web/lib/compat-score.ts` — `computeCompatScore()` (the "% match" score).
> - `apps/web/lib/vendors-plan-budget.ts` — `buildPlanBudgetModel()`.
> - `apps/web/lib/dependency-graph.ts` (Setnayan AI PR-5) · `vendor_services.last_minute_*` (PR-3/4).
> - `_components/customer-bottom-nav.tsx` Guests **FOCUS MODE** takeover (nav suppression +
>   floating X) · `_components/vendor-availability-intersection.tsx` · `/find-date` (Date Aligner).
>
> **Supersedes the single-screen layout in** `Vendors_Plan_Budget_Tab_Spec_2026-05-31.md`
> (its 5 stacked surfaces become the 5 tabs below) **and extends**
> `Budget_Planner_Allocation_Engine_2026-06-05.md` (the allocator becomes the Build engine).

---

## 0 · The owner realizations this answers (2026-06-08)

1. The couple wants **"one press, I'm-ready"** budgeting — put an amount in, see a complete,
   affordable wedding take shape — *before* committing to anyone.
2. **"Budget" reads as expense-tracking.** The planning surface needs a name about *assembling
   the wedding*, not managing money → **Build**. ("Budget" stays the expense ledger.)
3. The free allocator must NOT cannibalize Setnayan AI — they're **one engine at two depths**:
   free draws the *map* (money → categories), paid assembles the *real wedding* (matched vendors).
4. The Services surface should be a **full-screen FOCUS MODE takeover** (like Guests/Website):
   its own section bottom-nav + a floating **X** top-left, not a flat scroll.
5. Planning must **never delete a live inquiry** — the planner is a non-destructive *projection
   layer*; the only sanctioned write to the booking domain is an explicit batch-inquiry / Lock.

---

## 1 · What ships

The **Services** bottom-nav tab (`/dashboard/[eventId]/vendors`, label "Services", key `vendors`)
opens as a **full-screen FOCUS MODE takeover** — the global 5-tab nav + topbar are suppressed, a
**section bottom-nav** replaces them, and a floating **X** (top-left) exits to event Home. Inside,
**five tabs** turn budget + pax + date + location into a complete, affordable, bookable wedding plan:

```
[ Summary ]   [ Shortlist ]   [ Build ]   [ Compare ]   [ Lock ]
```

| Tab | Role |
|---|---|
| **Summary** | Cover page — build *progress analysis* + the **Setnayan AI** Assisted↔Manual toggle (the paywall switch) |
| **Shortlist** | The **bench** — every service considered, per category. Couple-only, vendor-invisible. No budget bar. |
| **Build** | The **lineup** — the auto-fit plan: running total · auto-fill · save **A/B/C** · the **Pin** dials · marketplace sourcing |
| **Compare** | A vs B vs C **side-by-side** + the **available wedding dates** for each build |
| **Lock** | **Finalize** the chosen build's vendors (one-per-category) — the only crossing into real vendor threads |

---

## 2 · The Build engine — auto-fit, never cheapest

Build extends `computeBudgetAllocation()` (`lib/budget-allocation.ts`). Given budget `B`, pax,
location, date:

- **Default to the *median*, not the floor.** Each recommended category starts at its *typical*
  market price ("complete & solid") — cheapest is the feasibility floor/safety net, never the
  default. A small budget is dignified; a big budget feels grand.
- **Completable by construction.** `share = weight / Σweight × B`, clamped to each category's real
  **[floor · ceiling]** from gate-scoped vendor prices, with **overflow redistribution** (a category
  that can't absorb its share — ceiling hit, no premium option locally — pushes the excess to
  categories that can, or to the **Cushion**). The split always sums to `B` and every number maps
  to a real bookable vendor.
- **3 baskets** generated from the same engine, switchable in one tap, and the seeds of the saved
  options: **Lean** (all floors, cushion shown) → **Fits** (median, on-budget) → **Stretch** (≈p75 +
  a signature add-on). They auto-seed **A / B / C**.
- **Surplus ladder ("grand"):** complete the picture first (breadth, to median) → upgrade the
  couple's *pinned priorities* (depth) → signature add-ons. Breadth is bounded, depth is unbounded,
  so the engine leans breadth for modest budgets and depth for large ones.
- **Shortfall / soft-gate** (owner-locked **soft gate**, not hard block): when `Σ floors > B`, Build
  surfaces *"you're ₱X short for these N services"* and ranked levers — **self-provide ("I've got
  this" → ₱0, stays in plan)** · **cut pax** (re-prices per-head categories — the biggest mover) ·
  **raise budget** · **drop a category** (suggested from the least-prioritized end, never the
  pinned-first venue). Adding past the limit greys out (overridable), never disappears
  (never-empty / never-impossible).

Today, with a founder-only marketplace, ranges fall back to **admin benchmarks** labeled "rough
estimate" with confidence chips (already supported in the engine); they sharpen as vendors onboard.

---

## 3 · The constraint solver — Pin Budget / Date / Services

Budget · Date · Services are three faces of one equation (`cost(Services, Date) ≈ Budget`). The
couple **Pins** what they care about; the rest solves. ("**Pin**" — deliberately *not* "Lock", to
avoid colliding with the **Lock** tab.)

| Pinned | The app solves | Reuses |
|---|---|---|
| **Date** | Budget (services drive the cost readout) | — |
| **Budget** | Date (the date your money goes furthest) | **`/find-date` / Date Aligner — do NOT fork a 2nd date engine** |
| **Budget + Date** | Services (auto-fill what fits both) | the Build allocator |
| **a specific service** | the rest flexes around it | the engine's fixed-line (`fixedPhp`) carve-out |

- **Auto-fill** runs the allocator under the active pins. Free path = "complete & solid" defaults;
  date-solve = the Date Aligner's "best match / least-stressful" ranking.
- **Marketplace sourcing ladder** — when a pin change leaves a hole the bench can't fill, Build closes
  it **least-disruptive-first**: (1) re-balance the current build → (2) pull from the **Shortlist
  bench** → (3) **source fresh from the marketplace** (eligible: right category · available the pinned
  date · in remaining budget) → (4) only then surface the honest shortfall + *which Pin to relax*.
  Anything sourced this way also lands on the Shortlist (the two-way rule, §4).
- **Pins are respected.** A pinned service is never auto-replaced. If a *pin itself* is the conflict
  (pinned Dec 12 **and** a photographer booked that day), Build hands it back: *"unpin one to
  continue"* — the one case it won't auto-resolve.
- **Inherently-fixed variables** (hard date — anniversary, venue already booked) make pinning that
  variable mandatory, not optional.

---

## 4 · Tab behaviors + the two-way bench

- **Shortlist ↔ Build are two-way.** Add in Shortlist → drops into Build; add/build directly in Build
  → also lands on Shortlist. **Shortlist = the bench** (everything considered); **Build = the active
  lineup**. Removing from Build returns the service to the bench (not deleted).
- **Shortlist has no budget bar** — the running total lives in Build. (The dark sticky budget bar that
  sits atop the current single surface moves to Build; the overview/progress moves to Summary.)
- **Build saves A / B / C** — named snapshots of a complete plan, each with its total. Seeded from the
  3 baskets, then freely edited.
- **Compare** puts A / B / C side-by-side **and shows the available wedding dates per build** — the
  intersection of that build's vendors' availability (`vendor-availability-intersection.tsx` +
  `vendor_calendar_blocks`). This **reverses the usual order**: build the combination, then see which
  dates the whole team can do (fits couples who came in with a flexible date — onboarding stores date
  candidates/window, not a fixed day). Empty intersection → *"no single date works — [X] and [Y]
  don't overlap; swap one"* (never blank).
- **Summary** = the cover page: progress analysis (how complete, budget used, what's locked, what's
  next via `lib/dependency-graph.ts` soft nudges) + the **Setnayan AI** toggle.
- **Lock** = `finalizeVendor` (the canonical hard-single, one-per-category gate, already shipped).

---

## 5 · Free vs paid — gate (free) vs score (paid), via the existing AI gate

This maps **directly** onto the shipped `isSetnayanAiActive()` (`lib/setnayan-ai.ts`) — we add no new
gate, we consume the one that exists.

| | Dimensions | = `isSetnayanAiActive` |
|---|---|---|
| **FREE — the gate** | location *(region/area)* · date · budget · pax · venue setting · ceremony type | AI **OFF** → "generic region-scoped search; free floor = region filter + anti-double-book availability" |
| **PAID — the score** | **refinements** (style/cuisine/fine facets) · **distance/proximity** ranking · the **"% best match"** + nudges + **best-match auto-inquiry** | AI **ON** → "ranking + % match pill + proximity sort + deadlines + 👀-eyeing nudge + auto-inquiry" |

- **Free filtering needs no AI** — location/date/budget/pax/venue/ceremony are deterministic queries
  and **reuse the matcher GATE** (`Customer_Vendor_Marketplace_Architecture_2026-06-04.md`; do not fork
  it). Free Build produces the *eligible set*, simply sorted, **manual pick**.
- **Paid Setnayan AI** layers the refinement- + distance-weighted **best-match ranking** and
  **auto-slots** vendors into the build. Note: the `compat-score` "% match" pill already ships, with
  **refinements + date-headroom currently neutral** — paid just turns that weighting on.
- **The Summary toggle** is the existing `planning_mode` Assisted↔Manual switch; when
  `SETNAYAN_AI_PAYWALL_ENABLED=true`, turning it ON requires the purchased `setnayan_ai_active`
  entitlement (the live `SETNAYAN_AI` SKU — ₱3,999, catalog-driven) → the toggle is the **conversion
  point** (off → checkout; owned → behavior switch).
- **The seam:** *"Free draws your plan; Setnayan AI turns it into real, matched, date-checked,
  ready-to-book vendors."* Free = the map; paid = the assembly.

---

## 6 · Projection-layer safety — never delete an inquiry

Everything in **Summary / Shortlist / Build / Compare is a non-destructive sandbox.** Editing the
plan, pinning, auto-filling, saving A/B/C, comparing, even *sourcing* from the marketplace — all touch
only scenario state. They never write to the booking domain.

- **Two states, never conflated:** *allocation/scenario* (couple-only, free to add/remove) vs
  *inquiry/booking* (`chat_threads` — vendor-visible, token-burned, money off-platform — precious).
- A **live inquiry shows in Build as a protected committed line** (`fixedPhp`), carved off the top.
  Removing its category from the *plan* warns, never cancels: *"You have an active inquiry with
  [Vendor] here — removing this won't cancel it."*
- The **only sanctioned crossings** into the booking domain are explicit, couple-initiated: **batch
  inquiry** (fan out `chat_threads`) and **Lock** (`finalizeVendor`). Both **create only, never
  delete** — Build has **no `deleteVendor` wire** (which also sidesteps the known orphan-threads race).
- **Shortlist removals are silent** (shortlist = `event_vendors` *considering*, vendor-invisible).
  Only **inquiry** removals get the guarded warning.

---

## 7 · Quality two-layer

- **The price *range*** (free) is built from **credible** vendors so the couple budgets enough for a
  good one — a **soft trim with fallback**, never a hard "high-reviews-only" gate (would empty
  categories + punish new vendors; few reviews → shrink toward category average, don't zero out). The
  *displayed floor* = cheapest *credible* vendor.
- **The vendor *pick*** (paid) is where **reviews rank** — a reputation dimension atop the 6-dim match,
  **boosting, never excluding**, running on **event-bound, guest-verified** reviews once they exist.
- **Today:** reviews barely exist (forward spec, founder-only marketplace) → "credible" leans on
  verified status / tier / completed bookings / response rate. Reviews become the gold standard as
  they accrue.

---

## 8 · Interaction parity (expand/collapse) + the takeover shell

- **Reuse the Guests FOCUS MODE shell** (`customer-bottom-nav.tsx`): suppress the global nav for
  `/vendors` exactly as it's done for `/guests` (`if (pathname === ...) return null`), hide the topbar
  (`.shell-topbar{display:none}`), render the floating top-left **X** → event Home, and a lower-third
  **section bottom-nav** (the 5 tabs).
- **Single-open accordion** for Build/Shortlist categories — mirror onboarding's `team_extras`
  picker (`extrasOpen` index, `.exgroup/.exhead/.exbody`, chevron, one parent open at a time, each
  revealing a Rail of cards). Same muscle-memory from onboarding into the dashboard.
- **Keep CSS scopes distinct** — the dashboard uses `.pbacc`, onboarding uses `.exgroup`; the old
  `.pba` scope leaked app-wide (documented bug). Mirror the *behavior + visual language*, **never
  share selectors**.

---

## 9 · Phasing — dashboard-first, no onboarding change required

Onboarding **already captures every input** the takeover needs — date (step 5), location (6), pax (7),
budget band + pax-floored amount (8), category picks via `applyBudgetHighlight` → `event_vendor_preferences`
(9). So:

- **Phase 1 — the Services takeover only.** Pure dashboard build; hydrates from the committed event
  row. Couple onboards as today → lands in the dashboard → the takeover is pre-populated. **No
  onboarding change.** (One wiring check: that picks commit as canonical service *leaves* the
  allocator reads — likely already compatible; a small adapter at worst, not a redesign.)
- **Phase 2 (optional, additive) — the onboarding Hook/Reveal.** Show a lightweight auto-fit reveal
  at budget(8)/picker(9) + a Reveal beat, filling the redesign's missing bookends
  (`Onboarding_Wedding_Adaptive_Redesign_2026-06-07.md`). Doesn't block Phase 1.

---

## 10 · Today → 5-tab migration map (against the live `plan-budget-accordion`)

The live single surface (`Vendors_Plan_Budget_Tab_Spec_2026-05-31.md` §2 — five stacked surfaces)
**re-homes** into the five tabs. Mostly **relocate, not rebuild**.

| Live surface / action (today) | → Tab | Reuse |
|---|---|---|
| ① Dark sticky **budget bar** (Chosen Σ · range vs target · meter) | **Build** (total) + **Summary** (progress) — **removed from Shortlist** | `buildPlanBudgetModel` figures |
| ② **"Where your day stands"** overview (estimate · chosen · could-land · what-to-lock-next · scroll cue) | **Summary** | as-is; add `dependency-graph` nudges |
| ③ 10 **sticky-stacking category folders** | **Shortlist** (browse/add) + **Build** (lineup) | converge to single-open accordion (§8) |
| ④ Per-category **vendor rails** (300px cards: photo·name·city·stars·badges·price/linked·eyeing) + dashed **Find-more** card | **Shortlist** (candidates) + **Build** (sourcing) | `VendorCardAtom`, `category-search-overlay.tsx` |
| ④ Compare drawer / curve-zoom coverflow (the §4 polish pass) | **Compare** (now **combination**-level) | extend `CompareSheet` |
| ⑤ Bottom recap **"Look how far you've come"** | **Summary** | as-is |
| Action: tap card → detail · **× → `deleteVendor`** · **↩ `revertVendorToConsidering`** | **Shortlist / Build** | as-is |
| Action: **Lock → `finalizeVendor`** (hard-single, one-per-category, auto-archive losers) | **Lock** | `accordion-lock.tsx` as-is |
| `MatchCriteriaStrip` ("Matching you on") + `isSetnayanAiActive` gating | **Summary** (toggle) + **Build/Shortlist** (score when ON) | as-is |

**Net-new** (vs. relocation): the **Pin** dials + constraint solver, **save A/B/C**, **Compare's
available-dates-per-build**, the two-way bench, and the marketplace **sourcing ladder**. The allocator,
gate, score, lock, compare, and search components all already exist.

---

## 11 · Cross-references

- `Budget_Planner_Allocation_Engine_2026-06-05.md` — the allocator (extended into Build).
- `Vendors_Plan_Budget_Tab_Spec_2026-05-31.md` — the current single surface (superseded layout).
- `What_Is_Setnayan_AI_2026-06-08.md` — the AI gate/paywall, last-minute + dependency engines.
- `Customer_Vendor_Marketplace_Architecture_2026-06-04.md` — the matcher GATE (reused, not forked).
- `Wedding_Date_Aligner_Expansion_2026-06-04.md` / `/find-date` — the date solver (reused).
- `Onboarding_Wedding_Adaptive_Redesign_2026-06-07.md` — the Phase-2 Hook/Reveal home.
- Booking ruleset, vendor token economy, hybrid-anonymity, conflict architecture — `MEMORY.md`.

---

## 12 · Open decisions / defaults assumed (owner to confirm or redline)

1. **"Pin"** is the dial verb (not "Lock") — to avoid the Lock-tab clash. *(assumed)*
2. **A/B/C auto-seed** from Lean/Fits/Stretch, then freely edited. *(assumed)*
3. **Solver objectives:** free services → "complete & solid" (median); date-solve → the Find-your-date
   ranker. *(assumed)*
4. **Add reserves** the **median** (free path) / the **specific vendor price** (when picked or
   AI-matched). *(assumed)*
5. **Empty date-intersection** → surface "relax this Pin," never blank. *(assumed)*
6. **Filter behavior** = greyed-out + override (soft gate), with an optional "only show what fits"
   toggle — *not* hard-hide. *(owner-locked soft gate)*
7. **Compare scope** = combination-level (plan vs plan). Confirm whether single-vendor compare is also
   kept. *(open)*
8. **Two "budget" surfaces:** Build (plan) vs the Budget ledger (track). Confirm labels stay distinct.
   *(resolved by the "Build" rename)*
