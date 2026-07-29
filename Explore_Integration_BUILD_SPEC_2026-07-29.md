# Explore / Marketplace — Integration BUILD SPEC · 2026-07-29

> **Status: OWNER-APPROVED, ready to build.** Supersedes nothing; *executes* the model already
> ruled in `Explore_IA_Replan_2026-07-27.md` §2.2 — *"the four stacked sections become
> **Bench (with Coverage Strip) · Your team · Plans · Payments** — same scroll pattern, clearer
> jobs."* The code never caught up to that ruling; this is the catch-up.
>
> Surface: `/dashboard/[eventId]/vendors` — the couple's Marketplace takeover.
> ⚠ `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED` is **ON in production**. Everything here is
> immediately visible on merge. All changes ride the existing `isExploreReplanEnabled()`
> branches so the flag stays an honest kill-switch.

## 0 · Why — the owner's three complaints

> "1. why is the subnav still present? 2. why does the build your team has build your plan and
> your team? 3. Your team, your budget, your plan. … seems like the page is not fully integrated
> properly … it is almost good. but not quite. still confusing."

All three are naming/hierarchy debt from slices landing at different times. Nothing functional is
missing.

## 1 · 🔴 THE FINDING THAT REFRAMES THIS — the anchors are UI theatre

**`Build3StateControl`'s three "YOUR ANCHORS" rows (Wedding date · Total budget · Location) are
wired to nothing.**

- `runBuild3State` reads its budget ceiling **directly from `events_host.estimated_budget_centavos`**
  (`build-3state-actions.ts:194,346`); `resolveBuildPicks` consumes **only taxonomy states**. The
  `_dim_*` states are never read by the solve. Deleting the anchor rows changes zero engine behaviour.
- The row's tri-state comes from `event_category_build_state` (default `'excluded'`) while the
  *value* comes from `events` (`page.tsx:1632-1660`) — two independent stores. `DimensionRow` only
  displays the value when the tri-state is `locked` (`build-3state-control.tsx:543`), so a couple
  **whose date is set** sees "Setnayan suggests this." This is exactly what the owner reported.
- **Absent taxonomy rows default to `'excluded'`**, so an untouched event solves to *nothing* —
  pressing **Build** on a fresh event does nothing at all.

Related live data bug (separate fix, do NOT bundle): prod event `044f7e64…` has
`event_date = 2026-12-18`, `date_mode = 'specific'`, but `event_date_precision = 'year'`.
Precision defaults to `'year'` at creation (`create-event/actions.ts:397`) and is meant to advance
when a date is set; on this row it never did. Countdown maths only runs at `'day'`, so anything
counting down skips this event.

## 2 · The naming scheme — one word, one concept

| Word | Means exactly | Never used for |
|---|---|---|
| **bench** | the browsing surface — vendors you can still consider | — |
| **team** | the people you chose: locked + in-progress + candidates | a section AND a card |
| **build** | your working candidate set only ("Add to build", "In your build") | a section heading or card title |
| **plan** | a saved, named alternative team you compare | the category coverage set |
| **budget** | your money target (the tile + `/budget`) | this page's payments lens |
| **payments** | what's paid and what's due | — |

**Final strings** — `SECTION_HEADING` (`services-takeover.tsx:74`) + `TAB_META`/`tabLabel`
(`lib/budget-build.ts`):

| key | was | **now** |
|---|---|---|
| `shortlist` | Browse the bench | **Browse the bench** (unchanged) |
| `build` | Build your team | **Your team** |
| `budget` | Your budget | **Payments** |
| `compare` | Your plans (flag-on) | **Your plans** (unchanged) |

**No card titles inside sections** — the section heading is the only title. Remove the inner `h2`s:
`build-locked.tsx:184-188` ("Your team" + total; the total already lives in the Locked tile) and
`build-compare.tsx:325-326` ("Plans"). Today each section names itself twice.

**Copy sweeps that follow:** "＋ Add to your plan" (`shortlist-categories.tsx:1816`) →
**"＋ Add to your event"**; mirror in `lib/explore-info-copy.ts:46` ("the strip at the top is your
plan" → "…is your event, one tile per category you chose").

## 3 · Section model — Bench → Your team → Your plans → Payments

Reordered per the §2.2 ruling (shipped order is bench → build → budget → compare). Payments and
Your plans stay collapsed by default. **"Your team" is a MERGE** of the two cards the owner
flagged, ordered per the prototype's `renderTeam()`:

1. Locked rows
2. Handshake-in-progress rows (slot reserved for PR-H's tracker)
3. "In your build — ready to lock" candidates with Lock ✓ / ✕
4. "Still needs your decision" doorways
5. The six tiles: Date · Location · Locked · In build · Budget · Buffer
6. **"Save current as a plan"** — *moved here* from `build-compare.tsx:337` (relocation, not rebuild)
7. **The quote-fill row** — see §4

Budget does **not** merge into the team; its planning half (Buffer) already moved to the team tiles
in PR-E. Renaming it **Payments** removes the last overlap.

## 4 · The quote-fill row — "act first, adjust after"

Replaces `Build3StateControl` entirely. **No card, no title, no Lock/Auto/Hidden vocabulary.** One
context-aware row inside "Your team", between "In your build" and "Still needs your decision".
New file `vendors/_components/quote-fill.tsx`.

**Fillable** = a category with ≥1 quoted inquiry (`total_cost_php != null`), no locked vendor, no
existing build pick, no `event_category_decisions` row in `('excluded','complete')` for the group or
its tile, and no explicit `event_category_build_state = 'excluded'`. Legacy explicit rows are still
respected; legacy `'locked'`+pin rows resolve to their pin as today.

| state | renders |
|---|---|
| **0 fillable** (prod default today) | **nothing** — component returns null. Kills today's worst state ("No quoted services yet" under a Lock/Auto/Hidden legend). The road to quotes is the bench's Inquire, already signposted by "Still needs your decision". |
| **1 fillable** | *"1 quote is in — {Vendor} for {Category}, ₱{amount}."* · button **"＋ Add to your build"** → appears in "In your build" above; row disappears. Nothing is locked. |
| **2+ fillable** | *"Quotes are in for {N} categories."* · button **"Fill your build from your quotes"** · subline *"Adds the best-priced quotes that fit — nothing is locked, and you can swap or remove any of them."* No budget set ⇒ subline becomes *"No budget set — we'll suggest the cheapest quote for each. [Set a budget]"* linking to `/dashboard/[eventId]/budget` (the canonical editor — never an inline re-declaration). |
| **after a run** | *"Added {k} picks to your build."* · if some didn't fit: *"Couldn't fit {labels} within your ₱{budget} budget:"* + the existing **`FallbackPanel`**, relocated verbatim from `build-3state-control.tsx:281-440`. |

**Adjust-after needs zero new UI** — the result lands in shipped controls: keep = per-row **Lock ✓**
(`AccordionLockButton`) · remove = **✕** (`removeBuildPick`) · swap = the "Still needs your
decision" / bench doorway (`?tab=shortlist&open=<tile>`), where single-pick groups swap
automatically via `replacesSiblingsOnPin` · bulk undo = the existing "Clear candidates". That *is*
Lock/Auto/Hidden — expressed against real vendors and real pesos, with no state name to learn.

**Engine (minimal):**
- **MODIFIED, not new** — `runBuild3State` → `proposeBuildFromQuotes` (`build-3state-actions.ts`):
  same read → `resolveBuildPicks` → write phase byte-for-byte, plus one pre-pass synthesizing
  `'auto'` for fillable groups with **no stored state row** (explicit rows still win). The grid was
  its only caller: a rename with one default flipped, not a fork.
- **NEW pure helper** `withAbsentQuotedAsAuto(states, fillableGroupIds)` beside `lib/build-3state.ts`,
  unit-tested: absent→auto · explicit excluded respected · explicit lock+pin respected ·
  decision-excluded/complete skipped. `resolveBuildPicks` itself untouched.
- Server action keeps its `BUILD_3STATE_ENABLED` guard.

## 5 · Navigation

**Desktop: no change.** The two-column layout (bench left, sticky rail right) already shows every
section; the desktop strip was removed 2026-07-15 because it duplicated what the eye can see. The
sticky rail *is* the navigation.

**Mobile: the 4-chip docked sub-nav goes** (owner complaint #1; the approved prototype has no tab
bar — the Coverage Strip is the navigator). Mechanics: in `lib/customer-menu.ts:229-240` emit the
explore menu's `children` (and `sectionMatch`/`sectionMatchExact`/`subnavLabel`) **only when
`!isExploreReplanEnabled()`**, so `customer-section-subnav.tsx` returns null on `/vendors` while
Studio's dock stays intact and the flag remains a true kill-switch. **Side benefit:** the global
bottom nav un-collapses back to icons+labels here (it shrinks only while a SubNav is docked) — mobile
drops from two stacked bars to one.

Each chip is safe to lose: **Shortlist** is a no-op (the page opens there) · **Build** is replaced by
the summary chip below · **Budget** is not stranded (sidebar "Also in this event → Budget" in
`customer-nav-config.ts`, plus Overview → checklist → "Review your budget", plus the section's own
disclosure) · **Plans** is reachable by scroll, its disclosure, and the team's "Save current as a
plan". The `?tab=` deep-link + `BB_TAB_EVENT` bus contract is untouched.

**NEW — mobile team summary chip** *(owner-approved 2026-07-29)*. A single floating chip
(mobile-only, docked above the bottom nav): *"● 2 locked · ◕ 3 in build · ₱82,000 buffer"*; tap =
`goToBuildTab('build')` (existing bus + scroll anchors). It replaces the dock's only real job with
something that is itself information, using `teamMoney` and plumbing that already exist.

**Live copy bug, fix in the same stroke:** the shared disclosure button is hardcoded
`'Show comparison'` (`services-takeover.tsx:299`) — so the button that opens **Payments** says
"Show comparison". Since the heading names the section, the label becomes plain **"Show" / "Hide"**.

## 6 · The flow after this change

1. **Browse** — the bench; Coverage Strip picks the category (NEXT flag = what's next).
2. **Ask** — card actions: Inquire, or "Check inquiry" once a thread exists.
3. **Assemble** — "＋ Add to build" → the vendor appears in **Your team** as a candidate; the bench
   refilters to shared dates (G1 convergence banner).
4. **Branch (optional)** — "Save current as a plan" on Your team → compare in **Your plans** → Load
   the winner back.
5. **Lock** — from the card or the team's per-row Lock ✓ → handshake runs in Your team.
6. **Pay** — **Payments** shows progress + next dues, doorway to `/budget`.

## 7 · Deletions

- **`build-3state-control.tsx` — the whole file.** `Build3StateControl`, `StateTrio`, `DimensionRow`,
  `InlineValueEditor`, `TaxonomyRowControl`, `STATE_META`, and every Lock/Auto/Hidden string.
  `FallbackPanel` + the `TaxonomyRow`/`QuotedOption` types move to `quote-fill.tsx`.
- `setCategoryBuildState` and `resetBuildStates` — caller-less after the above.
- **`build-pin-mode.tsx`** — `BuildPinModeControl` ("What's fixed?") is rendered by nothing; its only
  importer is `build-compare.tsx:47` taking `readPinMode`, which can only ever return the `'budget'`
  default (line 224 stamps it onto snapshots). Delete file + import + stamp; **keep** the optional
  `PlanBuildSnapshot.pinMode` field so old JSONB snapshots still parse. This finishes an abandoned
  second design.
- Inner `h2`s (§2) · the `'Show comparison'` hardcode · the explore dock children (§5) · in cleanup,
  the four `customer.budget-subnav.*` rows in `nav-registry-defaults.ts:1031-1082` (**check for DB
  overrides on those slots first** — slots with no consumer confuse `/admin/menus`).
- ⚠ **`build-anchors-actions.ts` (`setAnchor`) is NOT deletable** — live caller in
  `onboarding/wedding/_components/onboarding-shell.tsx`. Only the grid's import goes.
- In `page.tsx`: **keep** `buildAnchors` (still feeds `BuildLocked`'s summary tiles) and
  `taxonomyRows` (now feeds `quote-fill.tsx`); drop the `stateOf`/`dimensionStates` wiring.

## 8 · PR sequence

| PR | Size | Scope |
|---|---|---|
| **1** | XS | "Show"/"Hide" fix · `budget` heading → **Payments** (+ `tabLabel`/blurb) · BuildCompare inner-h2 dedupe. Instant win, trivially revertible. |
| **2** | **L** | `build` heading → **Your team** · the team merge (§3) · **quote-fill row** (§4) + `build-3state-control.tsx` deletion · `BuildLocked` inner h2 · "Save current as a plan" relocation · rail reorder. **Must land together** — renaming first would leave a section called "Your team" opening on a card called "Build your plan"; deleting the grid without the row would lose the fill capability for a cycle. |
| **3** | S ⚠ shared | Dock removal via `customer-menu.ts` children gating + `customer-menu.test.ts`. Touches the file the layout, bottom nav and Studio dock all read — verify Studio's anchor dock + Guests unaffected, and that the bottom nav un-collapses on `/vendors`. |
| **4** | S | The mobile team summary chip (the one NEW element). Kept separate so PR-3 stays pure and revertible. |
| **5** | XS | `build-pin-mode.tsx` deletion · registry-defaults slot removal (⚠ verify `/admin/menus`) · "＋ Add to your plan" → "＋ Add to your event" + `explore-info-copy.ts` sweep · update stale `runBuild3State` references in `build-requote-nudge.test.ts` comments and `budget-build.ts:36`. |

Between PR-2 and PR-3 the dock's chip order won't match the new section order — cosmetic for one
merge cycle; land PR-3 same day if convenient.

House rules: `changelog.d/` fragment per PR at the repo root; one `DECISION_LOG.md` row for the
naming scheme + dock removal, stating explicitly that it supersedes the dock half of the 2026-06-16
"sub nav should always respond first" arrangement **for this one surface**.
