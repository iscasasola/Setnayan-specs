# Build — 3-State Solver (Phase 3d) · 2026-06-16

> **Status:** DESIGN-LOCKED (owner session 2026-06-16) · build queued. **Supersedes § 12 ("Lock vs Flag", 2-state) of [`Budget_Build_Pin_Solver_Plan_2026-06-09.md`](Budget_Build_Pin_Solver_Plan_2026-06-09.md)** and expands its § 10 "3d" row from "paid sourcing ladder" into the full 3-state solver below.
>
> **Grounded in shipped `origin/main`** (audited this session): the couple-side Build surface at `/dashboard/[eventId]/vendors` is a 5-tab takeover (`lib/budget-build.ts`: `summary · shortlist · build · compare · lock`). Most of this spec is a **refit of shipped mechanisms**, not greenfield — see § 8 deltas.
>
> ⚠ A parallel adversarial improvement audit (`host-search-improvement-audit`, 2026-06-16) is running; its `build-solver-correctness` findings (edge-case guards) will be folded in as an amendment.

---

## 1 · The model in one paragraph

The Build is **search collapsed into a solver**. Instead of the host searching category-by-category, each row carries a leftmost **3-state toggle** — **Locked / Auto / Excluded** — and a bottom bar (`Reset · Build · Save As`). The host *constrains* (lock what's decided, exclude what's out, leave the rest on Auto) and **Build** fills every Auto row. Rows are drawn from the couple's **quoted inquiries** plus three always-present dimension rows (Date · Budget · Location). Auto's behaviour depends on whether **Setnayan AI** is on; when Auto can't fit from the quotes it falls back to a marketplace search, and a quoted vendor who's priced-out (but can still do the date + place) gets nudged in-thread to re-propose. Saved builds land on **Compare**.

This is the deliberate end-point of the host-search-easing thesis: the host stops searching and starts constraining.

---

## 2 · The 3-state toggle (supersedes the 2-state Pin/Flag)

The legacy controls were **Pin/Flag** on the anchors and **Lock/Flag** on categories — two-state, with "neither" rendering a cancel sign. This unifies them into one tri-state per row.

| State | Icon (locked 2026-06-16) | Legacy equiv. | Meaning | Solver behaviour |
|---|---|---|---|---|
| **Locked** | 🔒 padlock | Pin | fixed to a specific value | host **must pick** a concrete value (§ 4); solver honours it |
| **Auto** | ⚡ bolt *(wand alt — open)* | Flag | "fill this for me" | **Build** generates it (§ 5) |
| **Excluded** | 👁️ eye-off ("Hidden") | *(neither)* | left out of the build | skipped entirely; the default/empty state |

- **Icon rationale:** padlock = pinned/fixed; bolt = "the system does it" (wand is the open alternative — "smart" vs "energetic"); **eye-off chosen over the cancel/ban sign** because Excluded should read as *calm "not shown here,"* not *error/forbidden*. (Removed/minus-circle and a bare slash were the runners-up.)
- **Interaction:** Excluded is the **implicit default** (nothing chosen), not a third co-equal button to click — same as the legacy "neither = cancel."
- **One shared control** for taxonomy rows *and* the three dimension rows.

---

## 3 · Which rows show (the quoted-inquiry gate)

> **Owner rule (2026-06-16, extends the 2026-06-09 build-eligibility lock):** a taxonomy row appears on the Build **iff it has ≥1 inquiry with a quotation given** — i.e. `event_vendors.total_cost_php != null` for that category. A still-pending **request** (no price) produces **no row**.

- This **lifts the existing compute-time predicate** (`build-flags-actions.ts` — *"a price-less inquiry can't be computed into the build"*) **up to row visibility**. Same field, same rule, one layer earlier.
- Changes today's behaviour: rows are sourced from `openCats` (`state==='empty' && !coveredBy`) — the Build spans the whole plan. The new rule scopes rows to **quoted inquiries only**. ⚠ Load-bearing behaviour change — surfaced for sign-off.
- **Three always-present dimension rows** sit alongside: **Date(s) · Budget · Location** (mapped to `events.event_date` / `estimated_budget_centavos` / `region` today; reception coords for location).

---

## 4 · Locked requires a concrete pick

When a row is set **Locked**, the host must choose the fixed value for that row:

| Row | Locked pick = |
|---|---|
| a taxonomy/service row | one specific **service** — drawn from that category's **quoted inquiries** |
| **Budget** | a peso **value** |
| **Date(s)** | a specific **date** |
| **Location** | a specific **location** (reception anchor) |

A Locked row with no valid pick is an invalid state — the UI must force the pick (guard to be confirmed by the audit's correctness pass).

---

## 5 · Auto behaviour — depends on Setnayan AI

**Build** generates for every **Auto** row (honouring Locked, skipping Excluded). What "generate" means splits on the AI toggle:

- **Setnayan AI OFF → fill from values on hand.** Among the couple's **quoted inquiries** for the row, pick the **cheapest quote that fits the remaining budget** (today's `computeBuildFromShortlist`, cheapest-first).
- **Setnayan AI ON → run the deterministic engine** (the filed matchmaking logic — [`Vendor_Match_Personalization_2026-06-01.md`](Vendor_Match_Personalization_2026-06-01.md) + [`Customer_Vendor_Marketplace_Architecture_2026-06-04.md`](Customer_Vendor_Marketplace_Architecture_2026-06-04.md) § 2 GATE+SCORE). It **re-anchors location to the reception** (if present/locked — § 2a "ground 0"), applies the Layer-A hard gate + the § 3 per-category refinements + the 6-tier ladder, and ranks **among the couple's quotes**. `lib/compat-score.ts` (refinement .30 / distance .25 / reviews .20 / dateHeadroom .15 / trust .10, admit-unknown). AI is *more comprehensive* because it has more inputs to score on — same scorer, more dimensions populated.

For the **dimension rows**, Auto means: Date → `/find-date` proposes a date; Budget → derive the needed total from the picks; Location → infer from picked vendors. *(Defaults — confirm.)*

---

## 6 · Auto fallback search

> If Auto **can't find a suitable service from the quotes** (e.g. nothing fits the remaining budget), search the marketplace **on the actual requirement** — with or without AI (AI = a more comprehensive search; more information to match on).

- **Pagination:** results show the **top 10**, then **expand by 5**. (Net-new — the marketplace grid is page-size 24; no 10→+5 pattern exists today.)
- **Ordering:** every result carries a **hidden compatibility %** (`compat-score`; without AI most dimensions sit at the admit-unknown neutral baseline → a coarser score). The % is **not displayed** — it only orders results best→least.
- ⚠ **Open (a)/(b):** is the % hidden **only on the Build fallback results** (internal sort key; keep the visible "% match" pill on the marketplace) **or everywhere** (drops a shipped, marketed Setnayan AI benefit — `add-ons/setnayan-ai/page.tsx`)? Default lean: **(a)**.

---

## 7 · The vendor re-quote nudge (a quoted-out vendor → "create a new proposition")

When Auto rejects a **quoted** vendor, also invite that vendor to re-propose — **but only when price is the sole blocker**.

- **Gate (owner 2026-06-16):** nudge **only if the vendor still passes date + location** (the Layer-A objective gate) but their quote exceeds the remaining budget. **If the miss is date or location, stay silent** — re-quoting can't fix a wedding they can't serve.
- **Throttle (owner 2026-06-16):** **one nudge per `(event, vendor, service)`.** A service with a pending, **un-replied** nudge is opted out of further nudges. The **vendor must reply** before another auto-message can be sent for that service. *(Default: "reply" = any vendor message in the thread; confirm vs. specifically a new proposition.)*
- **Copy:** **English**, opportunity-framed (not rejection), **budget number withheld** by default (avoid price-anchoring). Draft: *"Good news — [Couple] is building their plan and your service fits their date and venue. Their budget for [Category] is currently a little under your last proposal. Want to send them a new proposition?"* → **[Create a new proposition]**.
- **Implementation:** reuses the **pax-proposal-in-thread** pattern (`fetchVendorPaxProposals`, `vendor-dashboard/messages/[threadId]`) + the **cross-actor signal** infra (`20260907000000_notification_types_cross_actor_signals.sql`). CTA → `/vendor-dashboard/proposals` (`createProposal`). Chat `sender_role` has no `system` value today → add a system/automated message style. Fires **regardless of AI** (the miss is real either way).

---

## 8 · Bottom bar + deltas vs. shipped

**`[Reset]`** → all rows to **Excluded**. **`[Build]`** → generate for every **Auto** row (honour Locked, skip Excluded; § 5–6). **`[Save As]`** → create a **new named build** OR overwrite an existing saved build → appears on **Compare**.

| Build delta | Shipped today | Work |
|---|---|---|
| 3-state Locked/Auto/Excluded on every row | 2-state Pin/Flag (anchors) + Flag/Unflag (`category-flags.tsx`) | **consolidate** `budget_category_flags` + `event_build_picks` into one tri-state; add **Excluded** (net-new) |
| Rows = quoted-inquiry only | `openCats` (empty budgeted) | change row sourcing to the `total_cost_php` gate |
| Locked needs a concrete pick | Lock already needs a vendor | extend to Budget/Date/Location |
| `[Reset]` → all Excluded | — | net-new |
| `[Build]` Auto-only, OFF=cheapest-fit / ON=engine | `computeBuildFromShortlist` stops at "no compatible" | unify the two compute paths (`generateFlaggedVendors` + `computeBuildFromShortlist`); add ON-engine + fallback |
| `[Save As]` free-named builds | fixed slots A/B/C + optional title (`budget_builds`) | ⚠ loosen the 3-slot cap |
| Vendor re-quote nudge | none | net-new signal (reuses pax-proposal + cross-actor) |
| Hidden compat % (sort-only) | visible pill when AI on | ⚠ reverses shipped/marketed behaviour — § 6 (a)/(b) |

**Dependency — the quote is couple-entered.** Today `total_cost_php` is logged by the *couple* (`updateVendorCosts`), so the whole solver runs on hand-transcribed numbers. **Improvement ① (vendor-authored quotes)** — greenlit 2026-06-16 — makes the **vendor** author the quote (structured proposal in-thread → `total_cost_php` directly + one-tap "add to Build"), which removes the transcription friction *and* closes the re-quote loop end-to-end. The 3-state solver should be built assuming ① lands alongside it.

---

## 9 · Open owner decisions (flagged — need sign-off)

1. **Hidden-% scope** — Build-fallback-only (lean) vs. everywhere (drops a marketed AI benefit). § 6.
2. **Reveal budget number** to the vendor in the nudge — default **withheld**. § 7.
3. **Save-As model** — free-form named builds vs. keep the A/B/C slots. § 8.
4. **Auto icon** — bolt vs. wand. § 2.
5. **Reply-gate definition** — any vendor reply vs. specifically a new proposition. § 7.
6. **Inquiries-only row sourcing** — confirm the behaviour change from `openCats` (whole plan) to quoted-inquiries-only. § 3.

---

## 10 · Build phasing (Claude Code time)

| PR | What | Migration? |
|---|---|---|
| **3d-1** | The 3-state toggle UI + consolidate `budget_category_flags` + `event_build_picks` into one per-row tri-state (incl. the Excluded state) | maybe (schema for tri-state + Excluded) |
| **3d-2** | Quoted-inquiry row sourcing (lift the `total_cost_php` gate to visibility) + Locked-pick enforcement | No |
| **3d-3** | `[Build]` solver: unify compute paths; Auto OFF=cheapest-fit / ON=`compat-score` engine; `[Reset]` | No |
| **3d-4** | Auto **fallback marketplace search** (top 10 / +5, hidden-% sort) | No |
| **3d-5** | Vendor **re-quote nudge** (gate + throttle state machine + system message + CTA) | Yes (nudge state) |
| **3d-6** | `[Save As]` named builds → Compare | maybe (drop A/B/C cap) |
| **① (parallel)** | **Vendor-authored quote** → `total_cost_php` (unblocks 3d-2 + closes 3d-5 loop) | Yes |

Each flag-dark → verified, same cadence as Phases 1–2b.

---

## 11 · Cross-references

- [`Budget_Build_Pin_Solver_Plan_2026-06-09.md`](Budget_Build_Pin_Solver_Plan_2026-06-09.md) § 12 (the superseded 2-state) · § 8 (sourcing ladder).
- [`What_Is_Setnayan_AI_2026-06-08.md`](What_Is_Setnayan_AI_2026-06-08.md) — the deterministic matchmaking layer (Auto-ON engine).
- [`Vendor_Match_Personalization_2026-06-01.md`](Vendor_Match_Personalization_2026-06-01.md) § 1–3, § 2a (reception ground-0) — the recommendation computation.
- `host-search-improvement-audit` (2026-06-16) — the six greenlit improvements + the build-solver correctness pass folding into here.
- Code anchors: `lib/budget-build.ts`, `vendors/_components/{build-anchors,category-flags,build-compute,build-compare}.tsx`, `vendors/build-flags-actions.ts`, `lib/compat-score.ts`, `lib/chat.ts`.

---

## 12 · Correctness guards (from the 2026-06-16 adversarial audit — load-bearing)

The `host-search-improvement-audit` (see [`Host_Search_Improvement_Audit_2026-06-16.md`](Host_Search_Improvement_Audit_2026-06-16.md)) stress-tested this spec against `origin/main` and found four blockers that **re-order § 10**:

1. **Schema prerequisite (must land FIRST).** `budget_category_flags` is a pure marker table — **no state column** (verified, migration `20261006000000`). The **Excluded** state and `[Reset]→all-Excluded` cannot exist without a migration: add `state ENUM('locked'|'auto'|'excluded')` (+ `pinned_vendor_id`) to `budget_category_flags`, or a unified `event_category_build_state` table. **No Phase-3d UI ships before this migration.** → this becomes PR **3d-0**, ahead of 3d-1.
2. **Do NOT rename `event_vendors.status` in any Phase-3d PR.** It's referenced by RLS (`event_vendors_couple_read`, vendor-role-aware), `finalizeVendor`/`deleteVendor` gates, and archive/force-majeure migrations. The consolidation **adds** a build-state layer; it does not touch `status`. Any rename = its own isolated, audited PR (or skip).
3. **Multi-pick data-loss guard (ship BEFORE touching compute).** `isMultiPickGroup` is honored in `build-pick-actions.ts` but **NOT** in `build-flags-actions.ts` — running Build on a flagged multi-pick group (Look/Booths/Prints) pins one vendor and the `onConflict` upsert **silently overwrites the couple's other picks.** This is a **live data-loss bug today**; import the guard before 3d-3 (or any consolidation).
4. **Quote bridge is a prerequisite for the quoted-rows-only rule (§ 3).** Because the `total_cost_php != null` gate means a category with only *unpriced* inquiries shows **no rows**, **Improvement ① (vendor-authored quotes) must land before** the row-filtering UI — otherwise the Build reads as confusingly empty for couples who've inquired but not yet logged a price. § 8's "depends on ①" is therefore a **hard** sequencing edge, not a nice-to-have.

**Revised PR order:** `3d-0` state migration → `①` quote bridge → `3d-2` quoted-row sourcing + Locked-pick → `multi-pick guard` → `3d-1/3d-3` 3-state UI + unified solve → `3d-4` fallback → `3d-5` nudge → `3d-6` Save-As. (The § 10 table stands for *content*; this is the *ordering* correction.)

Also from the audit, two **UX guards** on this spec's open decisions: the hidden-% (§ 6) should **add** a "why" line and **keep** the number where it renders rather than blanket-hide (don't name the neutral refinement/dateHeadroom dims); and the nudge/empty-state copy (§ 7 + Improvement ②) must read as *capability the couple lacks* ("can still take your date"), never *"locked."*
