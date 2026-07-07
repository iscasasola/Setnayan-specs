# Adaptive Checklist — Build Plan (engine wiring + per-type + leaf-surfacing)

**Authored:** 2026-07-08 · **Status:** Plan (corpus-first; repo PRs follow)
**Grounded in:** two code traces on `origin/main` (2026-07-08) + market research (planning-app checklists · two-sided marketplace discovery fairness).
**Siblings:** [`Adaptive_Checklist_Design_2026-06-17.md`](Adaptive_Checklist_Design_2026-06-17.md) (definition + wedding shape) · [`Adaptive_Checklist_Event_Type_Definitions_2026-07-08.md`](Adaptive_Checklist_Event_Type_Definitions_2026-07-08.md) (per-type framework).

---

## 1. What the market proves (research → our design rules)

**Planning-app checklists (Zola · The Knot · Bridebook · WeddingWire · Joy · Notion):** the state of the art is shallow — mostly date-driven timeline templates. The differentiated moves, with proof:

| Steal | Who proved it |
|---|---|
| **A task is a decision, not a reminder** — every category task deep-links into vendor discovery, and booking *writes back* (checks the task, updates budget). | The Knot — pilot showed **+16% shortlist→booking conversion** |
| **Vendor state machine: shortlisted → reached-out → booked**, in one board with notes/quotes/threads. | The Knot "Your Vendors" |
| **Locking a vendor updates a live budget** with an over/under health indicator; allocation seeded from **guest count + real-couple benchmarks**, not flat %. | WeddingWire (live sync) + Bridebook (benchmark allocation) |
| **"Your single next best action" on a browsable list** — soft-sequence, hard-gate only venue/date. | The Knot prioritized timeline |
| **Branch on faith/region/traditions** — nobody does this deeply; a PH-first product can own it. | Zola (light) — white space |
| **Event-triggered task injection** — a decision unlocks its downstream obligations (book caterer → crew meal, dietary, headcount). | The Knot |
| **AI is assistive, not autonomous** — surface/shortlist/explain, never silently decide (couples reward help, reject auto-decisions on emotional choices). | The Knot 2026 study (only 7% use AI tools; resistance on high-stakes) |

**Traps to avoid:** state-blind nagging (never re-prompt a done task — The Knot's #1 complaint), generic date-only templates, dumping every task at once, unconfirmed destructive actions, and **marketplace bias masquerading as advice** (if "recommendations" only point to paid vendors, trust collapses).

**Marketplace discovery fairness (Airbnb · Amazon · Thumbtack · Instacart):** how to give every leaf service a fair chance without spam —

1. **Two-stage pipeline:** relevance-retrieve (hard fit: event-type · faith · date · budget · location · availability — the Thumbtack model) → **diversity re-rank** that discounts each candidate by similarity to what's already shown (Airbnb "Learning to Rank Diversely": +0.29% bookings). Redundant near-duplicates drop; distinct leaf services rise — **no per-category quota needed**.
2. **Cross-category complements, capped 2–3 per surface, triggered by planning stage** (Amazon P-Companion returns *different* categories by design; Instacart varies by journey stage). Seed cold-start from the curated checklist before booking co-occurrence exists.
3. **Only-when-it-fits gating** — never surface a leaf with zero available/in-budget/in-date/in-location vendors (the "hide zero-result filters" rule). This is what stops "surface everything" from becoming spam.
4. **Optimistic cold-start prior + bounded, decaying exploration boost** for new/niche vendors, gated behind a quality bar (verified · complete profile · no open disputes).
5. **Amortized exposure floor per leaf over a rolling window** (greedy round-robin) — the concrete meaning of "no service gets buried," without a quota on every page.
6. **Organic fairness independent of paid promotion** — exploration boost + exposure floor live in the *organic* ranker so an unpaid niche vendor wins on merit. This is the single best defense against "pay-to-win."
7. **Label sponsored unambiguously, cap ad load** — buyers distrust sponsored vs. identical organic in the same slot; over-monetizing a high-trust purchase costs more conversion than it earns.

---

## 2. The architectural crux — two vocabularies, bridged only at tile grain

The code map found the checklist and the marketplace speak different languages:

```
MARKETPLACE taxonomy   folder(10) → tile(~53) → LEAF canonical_service(~201)
                       readers: getCoverageTaxonomy() [leaf-grain, lib/vendor-coverages.ts:81]
                       vendor attach: vendor_coverages{canonical_service,event_types[],faiths[]}

CHECKLIST vocabulary   22 curated PlanGroupId buckets  [lib/wedding-plan-groups.ts:48-82]
                       bridged to taxonomy ONLY at TILE grain via PlanGroup.catalogTile
                       → NO plan group maps to a leaf canonical_service
```

Consequences that shape every PR below:
- The checklist's Tier-3 runs entirely in the **22-plan-group** vocabulary; it never touches leaves.
- `interested_categories` is a **JSONB key in `events.style_preferences`** (NOT a column) holding **tile/picker ids** (not leaves). `lib/checklist-taxonomy.ts` reads the wrong place *and* has zero callers — a dead, mis-targeted stub to replace.
- Couples currently see **all ~53 tiles** (event-type + faith gated), never leaves, never relevance-gated.
- **Your leaf goal (§ 4) requires a leaf→checklist projection that does not exist today** — this is the net-new bridge.

---

## 3. Build sequence — PR by PR

> **✅ SHIPPED 2026-07-08 (autonomous build · 8 PRs).** The whole engine is wired and live/landing:
> - **PR-0** [#2862](https://github.com/iscasasola/setnayan-platform/pull/2862) MERGED — non-wedding events stop rendering the wedding checklist (`isWeddingEvent` guard).
> - **lane C** [#2864](https://github.com/iscasasola/setnayan-platform/pull/2864) MERGED — `checklist-event-type-defs.ts` (8 types).
> - **lane D** [#2866](https://github.com/iscasasola/setnayan-platform/pull/2866) MERGED — `leaf-surfacing.ts` re-ranker.
> - **PR-2** [#2867](https://github.com/iscasasola/setnayan-platform/pull/2867) MERGED — per-type seeding (`buildSeedRows`, wedding byte-identical).
> - **PR-1a** [#2869](https://github.com/iscasasola/setnayan-platform/pull/2869) MERGED — live budget health-check card (`computeBudgetHealth` wired).
> - **PR-4** [#2871](https://github.com/iscasasola/setnayan-platform/pull/2871) MERGED — "you might also want" leaf suggestions (fit-gate + diversity, `leaf-suggestions.ts`).
> - **PR-1b** [#2874](https://github.com/iscasasola/setnayan-platform/pull/2874) auto-merging — vendor-progress pills (`resolveCategoryState` wired).
>
> **Verification bar:** every PR unit-tested (73 tests), typeclean, full CI (build/e2e/lighthouse/12 lints), flag-safe (wedding byte-identical, additive/null-safe cards), auto-merged on green.
>
> **REMAINING — owner-gated:** PR-5 (Setnayan AI optimize + watch-guard wiring). The AI go-live flip stays a held owner decision (charges couples); not flipped autonomously. Inert notification plumbing can be built on request.


Every PR is flag-gated and default-OFF; the wedding checklist output must stay byte-identical until each flag flips. Order is correctness → engine → per-type → leaf-surfacing → AI.

### PR-0 · Fix the live null-ceremony bug *(ship standalone, now)*
- **Do:** `isChurchCeremony(null)` currently returns `true` (`checklist.ts:81-82`) → every non-wedding event renders the Catholic-wedding checklist. Default null/absent `ceremony_type` to non-church so a birthday/debut stops getting marriage-license/pre-Cana tasks.
- **Why now:** live correctness bug, smallest possible diff, independent of everything else.
- **Done when:** a `birthday` event no longer seeds `marriage_license`/`pre_cana`/`psa_cenomar`/ninong-ninang.

### PR-1 · Wire the engine — Layers 2, 3, budget *(this is the core; it converts the "printable checklist" into the execution engine)*
These modules exist with **zero callers**; nothing here is a rewrite, it's connecting dead code to the render path.
- **Budget health-check:** call `computeBudgetHealth()` (`lib/checklist-budget.ts:120`) from the checklist/budget surface; render the best/worst-case buffer + over/under health states (design doc § 5). *Market: WeddingWire live budget + Bridebook benchmark allocation.*
- **State machine:** call `resolveCategoryState` (`lib/checklist-state.ts`) from the render path so each category shows `not_started → searching → in_progress → done` and each task **deep-links into `/vendors`** and writes back on lock. *Market: The Knot "task = decision," +16% conversion; the shortlisted→reached-out→booked board.*
- **Replace `checklist-taxonomy.ts`:** real reader that (a) reads `style_preferences.interested_categories` (JSONB), (b) walks `getCoverageTaxonomy()`, (c) gates by event-type/faith via `passesEventTypeFilter`/`passesFaithFilter` (`lib/taxonomy-filters.ts`).
- **Guardrail:** state-aware — a `done` task never re-prompts (avoid The Knot's #1 complaint).
- **Done when:** locking a vendor in `/vendors` flips its checklist task to `done` and moves the budget buffer, live.

### PR-2 · De-hardcode to `EventTypeChecklistDef`
- **Do:** lift the four wedding constants — `date_model`, `anchor_category`, `phase_ordering`, `statutory_pack` (per-type spec § 1) — out of `checklist.ts` into a per-type def; re-express wedding from the def.
- **Regression gate:** wedding checklist output **byte-for-byte identical** before/after (snapshot test).
- **Done when:** `date_model` drives whether `/find-date` is step-N (wedding/christening = `output`) or the date is an early input (all others).

### PR-3 · Seed the 8 non-wedding types
- **Do:** seed the 8 defs (per-type spec § 5) into `event_type_profiles` sibling data; wire the `date_model='input'` path (skip the Schedule Matrix, count deadlines back from the set date). Each type behind the existing "Coming soon"→enabled toggle → **staged go-live, christening first** (reuses the most wedding plumbing).
- **Done when:** a debut event opens a debut-shaped checklist (cotillion, 18 roses, no marriage license).

### PR-4 · Leaf-surfacing — "give every service a chance" *(the new goal — § 4 below)*

### PR-5 · Setnayan AI optimize + watch guard *(the paid layer, last; depends on go-live flips)*
- **Optimize:** at each lock/over-budget moment, the AI surfaces the *best option* with a reason (design doc § 15). *Market: assistive-not-autonomous — always explain, never auto-decide.*
- **Watch guard (currently DORMANT):** wire the trigger engine to fire proactively — add AI types to the `NotificationType` union + `emitNotification` allowlists (both missing today), add an event-driven path (booking-confirm / `event_vendors` change → notify affected entitled couples), populate the snapshot beyond budget-only. Per the corrected recon in [`Setnayan_AI_Realtime_Notifications_2026-07-02.md` § 2](../Setnayan_AI_Realtime_Notifications_2026-07-02.md).
- **Fix before any per-event go-live:** thread `perEventPricingEnabled` into the read gates, else a lapsed ₱799 window won't lock (`eventOwnsSetnayanAi` early-return, `setnayan-ai.ts:143`).

---

## 4. Leaf-surfacing design — every leaf a fair, relevance-gated chance (PR-4)

**Goal (owner):** every service leaf category should have a chance to become an option the couple sees *as needed and if possible* — so no service is buried and every vendor gets discovery — **without** becoming spam or pay-to-win.

**Mechanism — a relevance-gated leaf recommender that surfaces into the checklist as optional tasks:**

1. **Candidate set = the event's leaf universe.** Walk `getCoverageTaxonomy()` for all leaves whose `applicable_event_types` includes this event type (and faith, via `passesFaithFilter`). This is the pool.

2. **Relevance retrieve (only-when-it-fits gate).** Keep a leaf only if it has **≥1 available vendor** that fits the couple's live constraints — date (availability), budget band, location, pax. Reuse `vendor_coverages` + the availability/counts path (`fetchVendorCountsByService`). A leaf with zero fitting vendors is **never shown** (the "hide zero-result filters" rule). This is what keeps "surface everything" relevant.

3. **Diversity re-rank (cross-category, capped).** From the fitting leaves the couple hasn't already planned, pick 2–3 to surface per visit, **discounting each by similarity to what's already planned/shown** (Airbnb/MMR pattern) and forcing **cross-category** spread (P-Companion) — so a couple who has a photographer sees "photo booth / mobile bar / same-day-edit," not three more photographers.

4. **Seed cold-start from the checklist.** Before booking co-occurrence data exists, seed "frequently planned together" from the curated per-type plan-group → leaf map (the checklist itself is the bill-of-materials). Swap to real basket analysis once bookings accumulate.

5. **Amortized exposure floor (fairness).** Over a rolling window, guarantee each eligible leaf a minimum number of surfacing opportunities (greedy round-robin) so niche leaves aren't permanently out-competed by popular ones — **without** forcing one-of-each-category on every screen.

6. **Organic-first, paid clearly separated.** The exposure floor + any new-vendor exploration boost live in the **organic** ranker (independent of promotion); sponsored leaves/vendors are labeled unambiguously and capped. A vendor who can't pay still surfaces on merit.

7. **Surface as a soft checklist prompt, state-aware.** Present as a `needs_decision` optional task: *"You might also want a **photo booth** — 6 available for your date within budget. Add it?"* `[Add]` `[Not for us]` `[Maybe later]`. Never re-prompt a dismissed/`excluded` leaf (no nagging). Adding it = it enters the living scope (design doc § 2a) and its budget impact shows immediately.

**Net-new pieces (none exist today):** the leaf→checklist-option projection (current task grain is the 22 plan groups, not leaves), the fit-gate query, the diversity re-ranker, and the exposure-floor bookkeeping. Reuse: `getCoverageTaxonomy()`, `taxonomy-filters.ts`, `vendor_coverages`, `fetchVendorCountsByService`, and the existing vendor rec engines (`wizard-recommendations.ts` etc.) for the vendor list *inside* a chosen leaf.

**Double win:** the couple gets completeness ("don't forget X" — a real gap-detector nobody in the market ships well) and every vendor's leaf gets a fair, relevance-gated shot at discovery.

---

## 6. Parallel vs sequential execution

**Governing rule (this repo's convention):** lanes are split by **file ownership** — work is parallel-safe only when the file sets are disjoint. The finding that dictates the whole schedule: **every step that touches `lib/checklist.ts` or the checklist render surface (`app/dashboard/[eventId]/checklist/page.tsx` + `checklist-actions.ts`) must serialize on those files. Everything net-new (new libs, seed data, the AI notification scaffold) parallelizes.**

### Dependency graph

```
                          ┌───────────── the SERIAL SPINE (one lane owns checklist.ts + render) ─────────────┐
PR-0 null-fix ─(merge 1st, tiny)─► PR-2 extract→def ─► PR-1 wire engine ─► PR-3 seed 8 types
                                        ▲                    ▲                    │
  ── Wave-1 PARALLEL net-new libs ──    │                    │                    │
  B  new taxonomy reader ──────────────────────────────────►┘                    │
  C  EventTypeChecklistDef + 9 defs ────┘                                         │
  D  leaf-surfacing libs (fit-gate + reranker) ──────────────► PR-4 integrate ◄───┘
  E  AI notif plumbing (types+allowlist+inert route) ────────► PR-5 integrate (gated)
```

### Waves

| Wave | Lane | Work | Files it OWNS | Parallel-safe? |
|---|---|---|---|---|
| **1** | A | **PR-0** null-ceremony fix | `checklist.ts` (predicate ~81) + `checklist-actions.ts` (ceremony read ~72) | Ships first; tiny. Merge before Wave 2 so the serial lane rebases onto a correct base. |
| **1** | B | **new taxonomy reader** (replaces the dead stub) | `lib/checklist-taxonomy.ts` (full rewrite) | ✅ isolated file |
| **1** | C | **EventTypeChecklistDef + the 9 type defs** | NEW `lib/checklist-event-type-defs.ts` | ✅ net-new |
| **1** | D | **leaf-surfacing libs** (fit-gate query + diversity re-ranker, unit-tested standalone) | NEW `lib/leaf-surfacing.ts` (+ reranker) | ✅ net-new |
| **1** | E | **AI notification plumbing** (add AI types to the `NotificationType` union + `emitNotification` allowlists + inert `/api/notify-ai` scaffold, flag-off) | `lib/notifications.ts`, `lib/notification-emit.ts`, NEW route | ⚠ touches shared notif infra — solo lane, inert/byte-identical while flag off |
| **2** | **S** (serial spine) | **PR-2 extract→def** then **PR-1 wire engine** — extract the 4 wedding constants into Lane C's def (wedding byte-identical gate), then wire `computeBudgetHealth` + `resolveCategoryState` + Lane B's reader into render/seed | `checklist.ts`, `checklist-budget.ts`, `checklist-state.ts`, `checklist/page.tsx`, `checklist-actions.ts` | ❌ **the critical path** — one lane, sequential within it |
| **3** | S | **PR-3 seed 8 types** + `date_model='input'` path (staged, christening first) | `event_type_profiles` seed data + the date-path branch | after Wave 2 |
| **4** | D→S | **PR-4 integrate** leaf libs as state-aware `needs_decision` prompts | reads Lane D libs; writes into the wired render | after PR-1 (needs the state machine live); best after PR-3 (per-type leaf universe) |
| **5** | E→S | **PR-5 integrate** AI optimize + watch-guard event-driven wiring | reads Lane E plumbing; the trigger→emit path | after PR-1; **gated** by the go-live flip + the `perEventPricingEnabled` gate fix |

### Critical path (what gates wall-clock)

`PR-0 → PR-2 → PR-1 → PR-3 → PR-4 → PR-5`. Everything on lanes B/C/D/E is **built in parallel during Wave 1** and merely *consumed* by the spine, so it never extends the timeline — it only has to be *ready* when the spine reaches its integration point.

### The one real ordering decision — refactor before wire

§ 3 lists PR-1 (wire) before PR-2 (de-hardcode), but for a clean single-lane serialization the execution order **swaps to PR-2 → PR-1**: extract the wedding constants into the def *first* (a pure refactor, byte-identical wedding seed, testable with the engine still off), *then* wire the engine to read the def **once**. Wiring first then de-hardcoding would touch `checklist.ts` twice and fight itself on rebase. (User-facing value is identical either way — nothing ships to couples until the flag flips.)

### Merge discipline
- Every PR **flag-gated, default-OFF, byte-identical** until flipped — the wedding checklist can't regress mid-build.
- Parallel lanes run in **separate worktrees** (repo convention) so disjoint file sets never collide.
- **Regression gate on the spine:** a snapshot test asserting the wedding checklist seed + render output is identical before/after PR-2 and PR-1.
- Lane E stays inert until PR-5 — no AI notification can fire while its flag is off.

### Can-start-now
Wave 1's five lanes can all begin immediately and concurrently. PR-0 is minutes and should merge first; B/C/D/E develop in parallel while the spine waits on nothing but PR-0.

---

## 5. Open decisions (owner)

1. **Leaf-task grain vs. plan-group grain.** Today tasks are 22 plan groups; leaf-surfacing (§ 4) introduces ~201-leaf granularity. Do leaves become first-class checklist tasks, or stay *suggestions* that roll up into a plan-group task once added? *Recommend: suggestions that roll up — keeps the core list legible, adds depth on demand.*
2. **Exposure-floor aggressiveness.** How hard to push fairness vs. pure relevance (how many "you might also want" slots per visit; the rolling-window floor size). *Recommend: 2–3/visit, conservative floor — expand once we see engagement.*
3. **Sponsored leaves in the checklist.** Allowed at all, and if so how labeled/capped? *Recommend: organic-only in the checklist prompts at launch; revisit paid boost after trust is established.*
4. **Setnayan AI go-live gating** (PR-5) — still HELD pending the consolidation PR + the per-event-pricing gate fix. Sequence PR-5 after PR-1..4 land.
