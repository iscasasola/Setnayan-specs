# Setnayan AI — Market Intelligence Feature Family

**Date:** 2026-07-02
**Status:** PROPOSED (brainstorm output — NOT locked). Owner sign-off + DPO review required before build.
**Home iteration:** 0016 (Setnayan AI). This is a newer dated sibling — do NOT re-expand into `0016_step_by_step_plan_builder.md` (archive stub).
**Related:** [[project_setnayan_ai_definition]] · [[project_setnayan_ai_subscription_redesign]] · [[project_setnayan_free_vs_ai_boundary]] · [[project_setnayan_behavioral_data_edge]] · `Setnayan_AI_Template_Library.md`

---

## 1. Thesis

A great human wedding planner's real edge isn't taste — it's **market knowledge they carry in their head**: which vendors book out fast for your date, whether you're overpaying, whether you're behind schedule, when to lock what. A free directory can't give a couple any of this. Setnayan AI can, by **computing it honestly** from data the platform already holds.

This family quantifies "the planner's sixth sense." Because none of it exists on a free directory (incl. our closest competitor, Bridalpod), it is legitimately **paid — part of Setnayan AI** — and never loses us a head-to-head comparison row.

## 2. Governing principles (inherited — non-negotiable)

1. **Setnayan AI, not free.** Reactive (your own actions) = free floor; proactive (Setnayan watches the market *for* you) = AI. Every feature here is proactive. Anti-double-book stays free.
2. **Honest-computed or hidden.** Every number is real and computed, or it isn't shown. No fabricated urgency (no "🔥 5 viewing"). This is the trust floor — one fake signal poisons the whole AI.
3. **Aggregate = minimum-N gated.** Any signal derived from *other people's* behavior only shows at N ≥ 25 (reuse `public.min_n_ok`); below that it's hidden to prevent de-anonymization (RA 10173).
4. **Scarcity always ships with an action.** No stress-without-a-fix. A signal that doesn't resolve into a next step ("lock now" / "Date Aligner alternate date" / "here's your backup") is cut.
5. **Deterministic — no per-render LLM.** All computed from SQL + the templated voice library → ~95–99% margin. The instant an output is LLM-rendered it flips to per-use cost — not allowed here.
6. **Free taste where it converts.** A net-new feature may show a free *teaser* (that something happened) with the actionable detail behind the AI paywall.

## 3. The privacy insight that drives sequencing

Not all "aggregate" data is equal under RA 10173:

- **Aggregate over VENDORS (businesses)** — fill-rate, price bands, how-fast-they-book. Business data, low personal-data exposure. Needs only a min-N over vendors so no *single* vendor is outed ("the one cheap caterer"). **Lighter gate → ships sooner.**
- **Aggregate over COUPLES (persons)** — how many couples eye your date, are-you-on-track pacing, what couples-like-you pick. Personal behavioral data. **Full DPO gate + min-N = 25 → same bucket as the dormant Trend/Inference layer.**

This split lets us deliver most of the *urgency value* from vendor-side proxies **without touching couple PII**, months before the couple-behavior aggregates clear counsel.

## 4. Feature catalog

Legend — **Job**: Secretary / Guard / Coach / Personalization / Trend. **Source**: personal (your data only) · vendor-agg · couple-agg. **Gate**: none / min-N(vendor) / DPO+min-N(couple).

### Wave 1 — personal signals · computable now · NO privacy gate

| ID | Feature | Job | What it does | Source | Free taste |
|---|---|---|---|---|---|
| MI-1 | Shortlist availability countdown | Guard | "4 of your 5 shortlisted photographers are still free on your date" — ticks down as the market moves | personal + vendor calendar | show the count; live-refresh is AI |
| MI-2 | Booked-out escalation + auto-backup | Guard/Secretary | The moment a shortlisted vendor loses your date → "they're gone — here's your best replacement" | personal + match engine | teaser "one is gone"; backup match is AI |
| MI-3 | Shortlisted-vendor-inquired alert | Guard | Someone else inquired a vendor on your shortlist | personal (boolean) / couple-agg (count) | boolean teaser free; **count of others → Wave 3 (min-N)** |
| MI-4 | Hold & quote expiry guard | Guard | "Your date-hold expires in 3 days unless you pay the deposit" / "this quote is valid until the 15th" | personal | — |
| MI-5 | Price-drop / opened-slot alert | Guard | Positive scarcity: a shortlisted vendor dropped price or opened a last-minute slot | personal + vendor price/calendar delta | — |
| MI-6 | Auto-shortlist refresh | Secretary | When a shortlisted vendor goes unavailable, surface the next-best match so the shortlist is always "5 viable" | personal + match engine | — |
| MI-7 | Quote comparison table | Secretary | Auto-assembles received quotes into one side-by-side (price · inclusions · hours) | personal | — |
| MI-8 | Follow-up autopilot + ghost flag | Secretary | Chases quiet vendors on a cadence; flags who's ghosting | personal + thread timings | — |
| MI-9 | Season guard | Guard | "Your date is peak rainy season for your region — consider a covered venue / backup" | region + historical weather (external, one-time load) | — |
| MI-10 | Style-coherence check | Coach/Personalization | "Your florals read rustic but your venue reads modern — want matches to your mood board?" | personal (mood board vs shortlist tags) | — |
| MI-11 | Progress confidence | Coach | "You're 60% booked and ahead of schedule — the hard part's done" | personal booking progress | ⚠ keep the *nudge* AI; the raw free checklist stays free |

### Wave 2 — vendor-aggregate · min-N over businesses · light legal review

| ID | Feature | Job | What it does | Source | Gate |
|---|---|---|---|---|---|
| MI-13 | Category fill-rate | Guard/Trend | "Venues in your area are 70% booked for your date; caterers only 20%" — shows *where* the urgency is | vendor-agg (availability) | min-N(vendor) |
| MI-14 | Price benchmark | Guard | "Photographers for your date/area run ₱X–₱Y; your shortlist averages ₱Z" — are you overpaying | vendor-agg (pricing) | min-N(vendor) |
| MI-17 | Best-time-to-book window | Secretary/Trend | "Photographers for your date typically fill 8 months out — book soon" | vendor-agg (fill history) | min-N(vendor) |

### Wave 3 — couple-behavior aggregate · DPO + min-N = 25 (same gate as dormant Trend/INF)

| ID | Feature | Job | What it does | Source | Gate |
|---|---|---|---|---|---|
| MI-12 | Date-contention / demand-density | Guard/Trend | "N couples in your area are targeting your date and similar services" | couple-agg | DPO + min-N=25 |
| MI-15 | On-track pacing benchmark | Trend/Coach | "Couples with your budget & date are usually 3 vendors in by now; you're at 1" | couple-agg | DPO + min-N=25 |
| MI-16 | Popular-in-your-area | Trend/Personalization | Styles/vendors couples with your profile actually choose (honest social proof) | couple-agg | DPO + min-N=25 |
| MI-3c | (count variant of MI-3) | Guard/Trend | "3 couples inquired this shortlisted vendor" | couple-agg | DPO + min-N=25 |

## 5. Data sources — what exists vs net-new

- **Vendor availability calendar** (MI-1,2,4,5,13,17) — EXISTS (auto-block-on-booking trigger + waitlist substrate shipped; see [[project_setnayan_vendor_calendar_waitlist]]).
- **Shortlist + inquiry threads** (MI-3,6,8) — EXISTS.
- **Vendor pricing** (MI-5,14) — prices exist; a **price-change log is net-new** for drop-detection & benchmarks.
- **Quotes** (MI-4,7) — EXISTS in threads; may need a structured quote capture for the comparison table.
- **Weather history by region** (MI-9) — net-new external dataset, one-time load, no PII.
- **Mood board + vendor style tags** (MI-10) — mood board free-palette exists; vendor style tagging may need enrichment.
- **Couple-behavior aggregation pipeline + `min_n_ok`** (MI-12,15,16,3c) — net-new pipeline; `min_n_ok` helper exists.

## 6. How it plugs into what's already built

- Rides the **`user_ai_subscription`** entitlement (₱499/28-day) — **no new SKU**; this is depth inside the sub, not an à-la-carte add-on.
- Emits through the existing **trigger engine** (`lib/setnayan-ai-triggers.ts` — `runTriggers` → `applyRestraint` → `assembleWeeklyDigest`) as new trigger types; restraint (dedup/cooldown/cap/rank) already prevents alert spam.
- Fed by the **snapshot adapter** (`lib/setnayan-ai-snapshot.ts`) — currently sources only the money guard floor; each new feature is a new snapshot field as its data source matures.
- Voice comes from the **templated library** (`lib/setnayan-ai-templates.ts`) — add MI-* templates in the existing 5-category structure; no LLM.
- MI-12 explicitly extends the shipped **"eyeing your date"** nudge.

## 7. Open sign-offs

1. **Owner** — ratify the family; confirm Wave 1 build list; confirm all of it is **bundled in the ₱499 sub (no extra SKU)**; ratify the honest-not-fake + scarcity-with-action guardrails as hard rules.
2. **DPO / PH counsel** — Wave 3 couple-aggregate features (consent model + min-N=25). Same review already pending for the Trend/Inference layer — fold in, don't open a second review.
3. **Legal-light** — Wave 2 vendor-aggregate: confirm min-N over vendors is sufficient so no single vendor is individually outed as "booked / cheapest / most expensive."

## 8. Anti-goals

- NOT a fake-urgency engine. NOT per-render LLM. Does NOT paywall anything currently free (all net-new). Does NOT expose any individual couple, nor — in aggregates — any individual vendor.

## 9. Recommended build order

**Wave 1 first**, in this order (highest value, zero privacy gate, extends existing work): **MI-1 → MI-6 → MI-2** (the availability/backup trio), then MI-4/MI-5/MI-7/MI-8 (guard + secretary quick wins), then MI-9/MI-10/MI-11. **Wave 2** once the vendor-aggregate min-N review clears. **Wave 3** rides the DPO sign-off already pending for Trend/INF — no separate legal effort.

---

## 10. Implementation plan — Wave 1 top-three (grounded in `origin/main` @ `cd9bb25d`, 2026-07-02)

**The engine already exists and is pure** (`apps/web/lib/`):
- `setnayan-ai-triggers.ts` — `PlanningSnapshot` → `runTriggers` → `applyRestraint` (dedup/cooldown/cap/rank) → `assembleWeeklyDigest`. 8 triggers wired today (all money/deadline/shortlist-stuck).
- `setnayan-ai-snapshot.ts` — `buildPlanningSnapshot` (sources ONLY the money floor; every other snapshot field returns EMPTY, "no fabricated data") + `computeUserAiDigest` (fans across a user's couple events).
- `setnayan-ai-templates.ts` — `renderTemplate`, warm established voice, **exactly 33 templates**.
- `vendor-availability.ts` — the data source: `getBatchVendorAvailableDays`, `getVendorAvailableDays`, `getAvailableDaysForVendorSet`, `filterVendorsByAvailabilityIntersection`.
- Shortlist = the couple's "considered vendors" per taxonomy tile (`shortlist-taxonomy.ts`).

**Key finding:** the *templates* for all three features are already written — `GRD-09` (availability changed → "lock them soon"), `GRD-10` ("{vendor} fell through … I already found {backup_count} open on {date}"), `SEC-08` ("options running thin ({found_count}) … widen by {suggestion}?"). **No trigger emits any of them.** So Wave 1 is mostly wiring, not new copy.

The gap is uniform: **(a) new snapshot fields for availability, (b) a DB adapter to populate them, (c) new triggers that emit the existing templates.** No engine redesign.

### MI-1 · Shortlist availability countdown → mostly NEW (needs one new template)
- **Snapshot:** extend `SnapshotShortlistCategory` with `shortlistedCount` + `availableOnDateCount` (both already category-grained, matching the existing shape).
- **Adapter:** for each shortlist category, read the couple's considered-vendor ids → `getBatchVendorAvailableDays(ids, eventDate)` → count still-free.
- **Trigger:** `availabilityCountdownTrigger` — low priority (informational); **digest-only, never interrupts**. Emits a NEW template `SEC-10` "**{available} of {shortlisted} of your {category} picks are still open on {date_label}.**" (positive frame; SEC-08 stays the "thin" escalation). ⚠ Net-new template → bumps the library 33→34 and needs `Setnayan_AI_Template_Library.md` updated in lockstep.

### MI-6 · Auto-shortlist refresh → REUSES SEC-08 (zero new copy)
- **Trigger:** `shortlistThinTrigger` — fires when `availableOnDateCount ≤ 1` for a category with `bookedCount === 0`. Emits the existing `SEC-08` with `found_count` = replacement matches.
- **Adapter:** when thin, run the match engine (`preference-match.ts` / `match-criteria.ts`) filtered by availability on the date → `found_count` + the suggested relaxation.
- Priority mid (above countdown, below money guards).

### MI-2 · Booked-out escalation → REUSES GRD-09 + GRD-10 (zero new copy)
- **The trigger needs a DELTA** (was-free → now-booked), which the pure engine can't see from a single snapshot. Two ways:
  - **V1 (pull, no new infra):** persist last-seen `availableOnDate` per shortlisted vendor (small `event_shortlist_availability_seen` table, or fold into the cooldown store). Each digest run, a vendor that flipped available→booked emits `GRD-10` with backups from the match engine. Simple, fits the existing weekly-pull model.
  - **V1.1 (push, immediate):** hook the **already-shipped `event_vendors` auto-block trigger (PR #2612)** — the moment a vendor is booked on a date, check which couples had it shortlisted for that date and queue `GRD-10` for them. More real-time; more plumbing.
- Start with V1 (pull); upgrade to push once the feature earns it.

### Shared work + tests
- Widen `buildPlanningSnapshot` to populate `shortlist` + the two new availability counts (currently empty). One new `event_vendor_line_items`-style read against the shortlist store + a batched availability call per event.
- Pure unit tests per trigger (mirror the existing 12), plus adapter pure-helper tests (mirror `paymentsFromBudget`). All deterministic → free.
- **No SKU/pricing/schema-pricing change.** One small additive table if MI-2 takes the pull route.

### PR breakdown (worktree + PR, off `origin/main`)
1. **PR-1** — snapshot availability fields + adapter population + `availabilityCountdownTrigger` + `SEC-10` (MI-1). Flag-gated (inert while `setnayan_ai_per_user_enabled` OFF), like every AI PR to date.
2. **PR-2** — `shortlistThinTrigger` → SEC-08 (MI-6) + match-engine replacement lookup.
3. **PR-3** — booked-out delta store + `bookedOutTrigger` → GRD-09/GRD-10 (MI-2).

## 11. The human voice (owner directive 2026-07-02 — "as human as possible")

The established voice micro-rules (`warm · plain · inform-never-pressure · praise-only-when-earned`) already read human — "Heads up —", "Nice, that's locked", "Great choice … you're in good hands", contractions, every message ends in a *question* not a command. Wave 1 **extends** that, held to six rules:

1. **Name the specifics** — vendor, date, ₱, category. Generic copy is what reads robotic; "your Nared Studios payment" beats "a payment."
2. **End with a low-pressure choice, never an order** — "Want me to…?" / "or stay open?" The couple always holds the wheel.
3. **Hard news carries its own fix in the same breath** — never "your vendor is gone" alone; always "…gone — I already found 3 open on your date." (GRD-10 is built exactly this way.)
4. **Celebrate earned wins, sparingly** — the Commend templates exist so planning doesn't feel like pure vigilance.
5. **No manufactured urgency, ever** — honest-computed or hidden (§2). One fake "🔥" and the human voice becomes a used-car voice.
6. **Restraint IS humanity** — a real planner doesn't text you five times a day. Default everything to the **weekly digest**; only genuinely time-critical guard items (payment due, window closing, booked-out) earn an interrupt. `applyRestraint` already enforces this — lean on it.

**The load-bearing tension (must hold):** "as human as possible" has to be achieved through **crafted templates, NOT a per-render language model.** An LLM per message = per-use cost (kills the ~95–99% margin that makes the ₱499 sub viable) AND re-opens the hallucinated-vendor trust problem the deterministic design deliberately solved. So:
- **Get human without an LLM** by giving each template **2–4 hand-written tone variants**, rotated deterministically by a hash of the `dedupeKey`, so the same couple never sees identical wording twice and it feels like a person, not a form letter. Still 100% deterministic, still free, still honest. (`renderTemplate` already supports named variants — this just adds more and a rotation selector.)
- **The only legitimate LLM use here is at authoring time** — a one-time, offline pass to help *write* that variant library. Human-quality copy, zero runtime cost. Never in the render path.

This keeps the promise the whole feature rests on: it should feel like the warmest, most on-the-ball human planner you've ever had — while costing us a database read, not a model call.

**Stored-message asset — the cost model (owner, 2026-07-02):** the message variant library is a **written-once, owned-forever asset**, exactly like the ~400-track Suno music catalogue and the template library. Author the phrasings once (offline, optionally LLM-assisted), store the strings, and **every render for the life of the product is free** — a DB read + `renderTemplate` substitution. The couple still gets a message specific to *their* wedding (their vendor, date, ₱ poured into the slots live); only the *wording* is drawn from the finite owned set. So:
- **The cost moves from compute to coverage.** "Free for life" is true for the render; the one-time investment is authoring *enough* variants to cover the real range of situations so it never feels thin or repetitive. That's real work, but it's paid once and never again — the right trade, and the house pattern already in use.
- **Slots must degrade gracefully** — a stored line with a missing value must still read clean (the renderer already leaves unknown `{tokens}` intact + the adapter supplies fallbacks like `'a vendor'`). Keep that discipline as the library grows.
- **It's a living asset, refreshed offline** — copy can be improved seasonally or as the brand voice evolves without ever touching runtime cost. Taglish/Cebuano variants, if wanted later, multiply *authoring* only, never render cost.
- **Storage choice (open):** V1 keeps the library **code-stored** (`setnayan-ai-templates.ts` — versioned, type-checked, unit-tested via the count guard, reviewed like any voice-critical copy). A **DB-backed admin editor** (edit copy / A-B test without a deploy) is a clean later upgrade — `renderTemplate` stays identical; only the source of the strings changes. Recommend code-stored now, DB-editable when non-engineers need to edit copy.
