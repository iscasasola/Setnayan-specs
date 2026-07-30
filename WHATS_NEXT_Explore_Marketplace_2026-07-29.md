# WHATS_NEXT — Explore / Marketplace integration wave · 2026-07-29

> # ✅ THIS WAVE IS CLOSED (2026-07-30)
> **Nothing left — not code, not decisions.** §4.1–§4.5 shipped · both fixable live defects (§5.1 ·
> §5.3) shipped · §5.4's two unbacked claims fixed (#3889) · **all five §6 owner decisions settled**
> (the owner delegated them: *"i cannot do this"*) · the two §5.1 prod rows **corrected** and
> countdowns verified live (141 / 135 days out) · the `TEST Floor Co (seed)` row deleted and
> `vendor_profiles_verified_requires_stamp` **VALIDATED** (`convalidated = true`).
>
> **The ONE thing still owner-shaped:** §6 decision 3's **DPO sign-off** on the demand lens — a
> signature, not a decision, and not blocking (the lens still cannot render: it needs ≥3 other
> couples inquiring on the same exact date and prod has 0 `chat_threads`).
>
> If you are here because the owner said *"what's next"*, the honest answer for this stream is
> **nothing — go to the next row of [`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md)**. Keep §1's five
> traps: they are about the surface, not the backlog, and all five still hold.

> **Cold-start handover.** Written for a session (or a different Claude Code account) with **zero
> context**. Read this file top to bottom before touching anything. Everything below was verified
> against `origin/main` and live prod on 2026-07-29 unless explicitly marked otherwise; the
> 2026-07-30 status board in §4 is verified against `origin/main` that day.
>
> **The contract for the remaining work is** [`Explore_Integration_BUILD_SPEC_2026-07-29.md`](Explore_Integration_BUILD_SPEC_2026-07-29.md).
> This file is the *state + traps*; that file is the *design*. Both are owner-approved.

---

## 0 · The 60-second orientation

**Surface:** `/dashboard/[eventId]/vendors` — the couple's Marketplace/Explore takeover. A
full-screen focus mode that suppresses the global nav. Four sections stacked in **one scroll**
(it stopped being switchable panels on 2026-07-09).

**🔴 `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED` IS ON IN PRODUCTION** (owner flipped it 2026-07-28).
Everything you merge here is **immediately visible**. There is no preview buffer. All changes must
still ride the existing `isExploreReplanEnabled()` branches so the flag stays an honest kill-switch —
with the flag OFF the page must render exactly as it did before the replan.

**Canonical checkout:** `/Users/icecasasola/Documents/Claude/Projects/setnayan-platform`.
⚠ It is habitually left on a feature branch, **not `main`** — see Trap 1.

---

## 1 · 🔴 THE FIVE TRAPS — read these or you will produce a defect

### Trap 1 — GREP THE REF, NOT THE WORKING TREE
The checkout sits on whatever branch the last session left. A bare `grep -rn` there reports
**shipped code as missing**. This cost a false alarm and a wasted Opus run on 2026-07-28: a merged
five-lens registry was reported as "shipped with zero importers" when the wiring was on `main` all
along.

```
git -C <repo> fetch origin
git -C <repo> grep -n '<pat>' origin/main -- apps/web
git -C <repo> show origin/main:<path>
```
Fastest disproof of any "this was never wired" claim: `gh pr view <N> --json files`.

### Trap 2 — `pnpm build` CANNOT run on this machine
It needs ~7 GB heap against ~2.5 GB free → SIGTERM 143. **Never claim a green build you did not
get**, and **never pipe a command whose exit code you trust** (`| tail` fakes a pass). CI's
"production build" check is the only valid source for that claim.

### Trap 3 — migrations auto-apply UNRELIABLY, and `schema_migrations` LIES
A migration numbered **below the applied head never runs**, silently. A row can say APPLIED while
its columns never landed. Always allocate with `pnpm migration:new`, and **verify the OBJECT**
(`information_schema` / `pg_catalog`), never the ledger. This bit twice in 48h (#3845 renumbered
pre-merge; #3848 reissued a never-applied prefix).

### Trap 4 — PROD IS PRE-LAUNCH-EMPTY, and the owner account is a FALSE GREEN
Live counts (2026-07-29): **6 users · 2 events (both the owner's) · 43 active `event_vendors`
rows, ALL manual (0 linked to a vendor profile), 13 priced · 2 vendor_profiles · 0
`vendor_services` · 0 `chat_threads`.**
You **cannot** verify a vendor-side or marketplace feature live. Cover non-wedding event types and
multi-vendor states **by test**, and say so rather than implying live verification.
⚠ The owner account (`iscasasolaii@gmail.com`) has `is_internal = TRUE`, which **comps every SKU** —
never judge a paywall on it. Test accounts: `testnayan1..5@test.com` / `12345` (they own **no
events**, so they cannot see this surface at all without one being created).

### Trap 5 — the two events are NOT interchangeable
| event | `event_id` | date | vendors | note |
|---|---|---|---|---|
| Cale & Ice | `044f7e64-95aa-4dcb-84c1-7263bf494eaa` | 2026-12-18 | **2** | has venue coords; the sparse one |
| (second) | `S89E-HQRC8PMDNY` | 2026-12-12 | **~41** | NO venue anchor; the full one |

Screenshots of "the page looks empty" are usually the 2-vendor event. Check which one before
diagnosing a design problem.

---

## 2 · DONE — verified on `origin/main`, **do NOT rebuild**

| PR | What landed |
|---|---|
| **#3845** | Vendor verification submit was silently broken in prod (guard refused the write, app discarded the error). Service-role path + `vendor_profiles_verified_requires_stamp` CHECK shipped `NOT VALID`. |
| **#3850** | 🔴 The vendors page filtered `events_host` on the hidden `id bigint` instead of `event_id uuid` → the query errored every time and the error was swallowed. **Date, budget, venue coords and `setnayan_ai_active` had been dark.** Same bug also fixed in `find-date/page.tsx`. Guard PART 3 added to `lib/security/query-column-scan.ts`, named test **T11**. |
| **#3855** | Bench visual parity — row icons on every folder + leaf (lifted the existing map out of a client module into `lib/taxonomy-icons.ts`; one source, two consumers), coverage strip as a white card, motion (expand/tap/chevron) with reduced-motion. |
| **#3856** | App ground → **flat warm white `#F7F5F0`**, glows removed; `--sn-glass-line` flipped from white to a warm dark hairline so **glass carries its own edge**. Affects every logged-in surface. Full owner-direction sequence is in the `.sn-ambient` comment (07-13 flatten → 07-15 reversal → 07-28 warm white). |
| **#3858 / #3859** | 64 hand-rolled `border-white/{50..80}` → `border-ink/10`/`/15` (19 customer sites, 45 admin). Old borders measured **1.000–1.031** contrast — literally invisible. Now ~1.36, parity with the shipped glass line. |
| **#3866** | `'Show comparison'` → **"Show"/"Hide"** (it was labelling the *money* section); `budget` heading → **"Payments"**; BuildCompare duplicate `h2` removed. |
| **#3867** | **The team merge.** Heading → **"Your team"**; deleted `build-3state-control.tsx` (727 lines, the Lock/Auto/Hidden grid); new `quote-fill.tsx`; `runBuild3State` → `proposeBuildFromQuotes` + new pure helper `withAbsentQuotedAsAuto`; "Save current as a plan" relocated to the team; rail reorder to **Bench → Your team → Your plans → Payments**. |

**Also proven, so nobody re-investigates:**
- The **five ranking lenses** are fully wired (`lib/ranking-lenses.ts` → `bench-sort.ts` → the bench).
  `BenchSort = LensKey | 'price' | 'rating'`. Sort choice persists per event in `localStorage`.
- Slice C's migration `20271016100000` is live **as an object** (`tile` column, its partial UNIQUE
  index, `plan_group_id` nullable, `anon` grants at 0).
- Budget is **not** stranded without the mobile bar: sidebar "Also in this event → Budget"
  (`customer-nav-config.ts`) + Overview → "View your full checklist" → "Review your budget"
  (`set_budget` is in the base checklist template with **no** `appliesTo` gate).

---

## 3 · IN FLIGHT at handoff — **verify state before acting**

| # | Branch | State at handoff | Action |
|---|---|---|---|
| **#3870** | `claude/decision-doorway-anchor` | ✅ **MERGED** 2026-07-29 | Done — see §2.1 below. |
| **#3871** | `claude/bench-category-search-overlay` | ✅ **MERGED** 2026-07-29 03:08Z | Done — **§4.1 is DONE.** Nothing here to build. |

### 2.1 · #3870 — the doorway now lands on the exact cell *(merged)*
Root cause was as suspected **and worse**: the leaf row had **no anchor at all**, so the cell was
*unreachable*, not mis-aimed. Added `#sltile-<tile>`, moved the scroll into the bench on mount
(`useLayoutEffect`), new `lib/bench-anchors.ts`. Three things the brief got wrong, now settled — **do
not "simplify" these back**:
- **`openPlan` deliberately keeps the FOLDER target.** It expands a *collapsed* folder; during the
  `0fr→1fr` transition the leaf rows have no height, so a leaf target lands on a position that no
  longer exists 240 ms later.
- **Deleting the doorway's timeout outright creates a dead click.** Tapping the same row twice leaves
  `?open=` unchanged → no re-key → no remount → no effect. It now derives `willRemount` from
  `?open=` before-vs-after and scrolls directly when there will be no remount.
- **The tile-less fallback must CARRY the current `?open=` through**, not drop it — pushing without
  it re-keys and *collapses* the bench under the folder scroll.

Scroll offset: **14 px mobile** (`ServicesTakeover` hides `.shell-topbar` below 1024 px), **96 px
≥1024 px** (matches the clearance `ServiceSection` already uses for its `sticky top-0` topbar).
`checklist-full.tsx` improves too — cross-route nav mounts the bench fresh, so it now lands on the
category instead of page top. Flag OFF: the leaf `id` is `undefined` and the effect returns early.

---

## 4 · THE REMAINING BUILD LIST — ✅ **EMPTY as of 2026-07-30. Do not rebuild any of it.**

> **STATUS BOARD (2026-07-30).** Every item in §4 and every fixable item in §5 has shipped.
> What is left in this file is §5.4 + §6 — **owner decisions only, no code.**
>
> | item | state | PR |
> |---|---|---|
> | §4.1 category-search overlay in the bench | ✅ merged | #3871 |
> | §4.2 PR-3 remove the mobile 4-chip dock | ✅ merged | #3877 |
> | §4.3 PR-4 the mobile team summary chip | ✅ merged | #3879 |
> | §4.4 PR-5 cleanup | ✅ merged + armed | #3878 (dead modules · copy · docblocks) + #3882 (orphan nav slots · the aria-labels #3878 missed) |
> | §4.5 admin white borders | ✅ merged earlier | #3859 |
> | §5.1 `event_date_precision` never advances | ✅ **code fixed**, armed · ⏭ 2 prod rows owner-gated | #3883 |
> | §5.3 flag-dark guarantee unguarded in CI | ✅ armed | #3886 |
> | §5.2 Build anchors were UI theatre | ✅ history only, deleted in #3867 | — |
> | §5.4 two unbacked scarcity claims | ⏭ **OWNER** (§6 decision 4) | — |
> | §6 decisions 1–5 | ⏭ **OWNER** | — |
>
> **Two inaccuracies in this file, found while executing §4.4** — corrected in place below:
> `build-pin-mode` had **two** importers, not one (`team-controls.tsx` as well as
> `build-compare.tsx`); and the §4.4 pointer `lib/explore-info-copy.ts:46` is the **Coverage
> Strip explainer**, not the chip-pool heading (which is line 139).

### 4.1 · Wire the category-search overlay into the bench ✅ **DONE — #3871**

**Owner:** *"clicking find more doesn't search specifically for that category. and it jumps to a new
page, it needs to stay on that page. this means, we need the best approach to show the best searches
for that category."*

**🔴 DO NOT BUILD A NEW INLINE SEARCH — IT ALREADY EXISTS.**
`apps/web/app/dashboard/[eventId]/vendors/_components/category-search-overlay.tsx`. Its own docblock:

> *"the in-place full-page sheet that **replaces the marketplace JUMP from the Vendors-tab 'Find /
> Add' buttons.** Hard-scoped to one plan group's vendors (can't drift to another category), X
> upper-left, live as-you-type search at the bottom, a bottom-sheet Filter, and an Add that
> shortlists the vendor and STAYS open so the couple can keep browsing (add-and-stay → '✓ Added')."*

Backed by `_actions/category-search.ts` (`searchCategoryVendors`), **owner-locked result order**
(favorites → boosted → top-10 reviews → nearest), hybrid-anonymity names, Add reuses
`saveVendorToPicks`. **Mounted in exactly ONE place today: `plan-budget-accordion.tsx:933`** — the
OLD pre-takeover accordion. The new bench never got it.

**The fix:** in `shortlist-categories.tsx`, the rail-end "Find more" card (~1717) and the empty-state
link (~1771) both do `<Link href={t.exploreHref}>` where `exploreHref = /explore?tile=<slug>`
(`shortlist-taxonomy.ts:632`). Replace those navigations with the overlay, mirroring the
`plan-budget-accordion.tsx:933` call site. Both the "Find more" and "Add another" labels
(`resolveBenchCardActions`) should open it.

⚠ **The `?tile=` param is NOT broken** — `/explore` reverse-maps the slug correctly
(`explore/page.tsx:669`). The complaint is the full-page jump, not a broken filter. Don't hunt a
param bug.

**🔴 SHIPPED AS #3871 — read this before touching it again.** Mounting the overlay "the way
`plan-budget-accordion.tsx` does" **does not transfer**, and this is the trap:
- The accordion is built from **plan groups**; the bench from **tiles**. Only **22 of 69 tiles map to
  a group** — passing the tile's group would have left **47 rows still jumping away**.
- Worse, for **13 of those 22** the group's `subcategoryHint` collapses the scope to a single
  canonical: *Coordinator would search 1 of its 12.*
- Fix: `searchCategoryVendors` took an **additive optional `tile`**; the **tile decides what is
  searched**, `groupId` keeps the last-minute + budget-allocation context (both already fail open).
  No `tile` ⇒ the group path is byte-identical and the accordion is untouched (test-asserted).
- **Add-and-stay was broken:** `saveVendorToPicks` revalidates `/dashboard/[eventId]` — the *overview*
  page, not this nested route — so the rail never repainted. An optional `onAdded` now triggers one
  soft `router.refresh()` on close, only if something was added.
- **Empty state** (prod = 0 `vendor_services`): the shipped copy told couples to *"widen your
  filters"* they had never set. Now branches — with a query/filter it keeps the original line;
  otherwise **"No {category} vendors here yet — we'll show them the moment they join Setnayan."**
- Overlay is `z-120` over the bottom nav (`z-30`) and dock (`z-20`), portals to body, keeps its own
  focus trap / scroll-lock / Escape. Flag OFF keeps both `<Link>`s.

### 4.2 · PR-3 — remove the mobile 4-chip dock  ✅ **DONE — #3877**
Spec §5. In `lib/customer-menu.ts:229-240`, emit the explore menu's `children` (+ `sectionMatch`,
`sectionMatchExact`, `subnavLabel`) **only when `!isExploreReplanEnabled()`** so
`customer-section-subnav.tsx` returns null on `/vendors` while **Studio's dock stays intact**.
Side benefit: the global bottom nav un-collapses back to icons+labels here (it shrinks only while a
SubNav is docked) → mobile drops from two stacked bars to one.
Verify: Studio's anchor dock, Guests, and `/admin/menus` all unaffected. `?tab=` deep links and the
`BB_TAB_EVENT` bus must keep working.

**Shipped exactly as specified.** Four new cases in `lib/customer-menu.test.ts` pin the flag-OFF
shape (4 tab children + their `customer.budget-subnav.*` slots), the flag-ON absence, that the
bottom-nav TAB still lights on `/vendors`, and that Studio + Guests are unaffected in **both**
states. The `?tab=`/bus contract was never at risk: `services-takeover.tsx` imports nothing from
`customer-menu` and owns both itself.

### 4.3 · PR-4 — the mobile team summary chip  ✅ **DONE — #3879**
One floating chip, mobile only, docked above the bottom nav:
*"● 2 locked · ◕ 3 in build · ₱82,000 buffer"* → tap = `goToBuildTab('build')`. Uses `teamMoney`
(`lib/your-team.ts`) and the existing bus + scroll anchors. Kept **separate from PR-3** so the
removal stays cleanly revertible.

**Three decisions the shipped chip made that this brief didn't cover — don't "simplify" them back:**
- It is **not** a `<SubNav>`. `<SubNav>` increments a docked-count store and the bottom nav
  collapses to icons-only while that count is > 0 — which would restore the very two-stacked-bars
  crowding PR-3 removed. The chip borrows SubNav's *geometry* and none of its coordination; a test
  forbids the import.
- It **portals to `<body>`**. `position: fixed` resolves against the nearest transformed/filtered
  ancestor and the takeover's glass carries `backdrop-filter` — the same reason
  `category-search-overlay.tsx` portals.
- **Copy comes from the shipped tiles, not this brief.** "₱82,000 buffer" is not what the app says:
  `bufferTile()` says "₱82,000 to spare" / "₱1,500 over" / "No budget set", with its own tone
  classes. The chip reuses it, so one number can't be worded *or coloured* two ways on one screen.
  Lucide icons, never the ●/◕ glyphs. Suppressed entirely at 0 locked + 0 candidates.
- Clearance rides the existing `.subnav-docked` rule in `globals.css` under its **own**
  `html.teamchip-docked` class — two components sharing one class means whichever unmounts first
  strips the clearance the other still needs.

### 4.4 · PR-5 — cleanup  ✅ **DONE — #3878 + #3882**

> ⚠ **Two sessions did this concurrently.** #3878 shipped the dead modules + copy + docblocks (and
> additionally deleted `build-anchors-actions.ts`, a zero-caller `'use server'` action that patched
> `events.event_date`). #3882 shipped the two halves #3878 left out of scope — the orphan nav slots
> — **plus a defect #3878 introduced**: it moved `ADD_TO_PLAN_HEADING` + `EXPLORE_INFO_STRIP` to
> "event" but left `addToPlanChipLabel`, `removeFromPlanButtonLabel` and `folderEmptyInPlan` on
> "plan", so a screen reader announced *"Add Catering to your plan"* over a pool the eye read as
> "＋ Add to your event", and the empty-folder line — visible copy — still said "plan".
> **`nav_slot_override` was queried before deleting the slots: ZERO rows.**
- Delete **`build-pin-mode.tsx`** — `BuildPinModeControl` ("What's fixed?") is rendered by
  **nothing**; its only importer is `build-compare.tsx:47` taking `readPinMode`, which can only ever
  return the `'budget'` default (stamped onto snapshots at line 224). **Keep** the optional
  `PlanBuildSnapshot.pinMode` field so old JSONB snapshots still parse. This finishes an abandoned
  second design of the Build area.
- Remove the four `customer.budget-subnav.*` rows in `nav-registry-defaults.ts:1031-1082`
  ⚠ **check for DB overrides on those slots first** — orphan slots confuse `/admin/menus`.
- "＋ Add to your plan" → **"＋ Add to your event"** (`shortlist-categories.tsx:1816`) + mirror in
  `lib/explore-info-copy.ts:46`.
- Update stale `runBuild3State` references in `build-requote-nudge.test.ts` comments and
  `budget-build.ts:36`.

⚠ Corrections to the four bullets above, found while doing them:
- `build-pin-mode.tsx` had **two** importers of `readPinMode` — `team-controls.tsx` as well as
  `build-compare.tsx`. `storePinMode` had **none**, which is *why* the value could only ever be the
  `'budget'` default, and **nothing read `snapshot.pinMode` back**: it was write-only data.
- `lib/explore-info-copy.ts:46` is the **Coverage Strip explainer**, not the chip-pool heading
  (line 139). Five strings carried "your plan", not one.

### 4.5 · The ~60 admin components with hand-rolled white borders — **DONE** (#3859)
Listed here only so nobody re-opens it.

---

## 5 · LIVE DEFECTS — 5.1 and 5.3 FIXED 2026-07-30; 5.4 is an owner call

### 5.1 · ✅ **FIXED — #3883** · `event_date_precision` never advanced past its creation default
Prod event `044f7e64…` has `event_date = 2026-12-18` and `date_mode = 'specific'` but
**`event_date_precision = 'year'`**. Precision defaults to `'year'` at creation
(`create-event/actions.ts:397`) and is meant to advance when a real date is chosen
(`[eventId]/actions.ts:155`); on this row it never did — so a date was saved by a path that skips
the precision update.

**Impact:** anything gated on precision treats the wedding as undated. Countdown maths only runs at
`'day'` (`lib/progress-stages.ts:53`), so it currently **skips this event entirely**.

**THE WRITE PATH, found (#3883):** the **Save-the-Date builder**. It backfills the canonical
`event_date` from the film's date when the event has none — and it was the **one `events.event_date`
writer of five** that didn't set precision alongside it (`[eventId]/actions.ts`,
`date-selection/actions.ts`, `wizard-actions.ts` and `onboarding/simple/actions.ts` all do).
**Both** prod events carry the signature: `event_date = std_film_date`, precision `'year'` —
`044f7e64…` (2026-12-18) and `947e7bab…` (2026-12-12). The backfill now writes
`event_date_precision: 'day'` in the same update (`std_film_date` is a specific day, and year → day
is a *narrowing*, which the refine-only ratchet permits). `date_status` deliberately untouched —
committing to a date is `date-selection/actions.ts`'s job, not a film's.

Guard: `lib/event-date-precision-scan.test.ts` pins the **class** — any `.update({…})` on `events`
naming `event_date` must also name `event_date_precision`. INSERTs excluded (creation legitimately
starts at the `'year'` default); non-literal payloads are named in the failure message rather than
passing as a false green; and it asserts it still matches ≥3 real call sites so it can't pass
vacuously. Mutation-checked.

⏭ **OWNER — the two prod rows are NOT corrected.** The code fix stops the leak for every future
event; flipping the existing rows turns on countdown behaviour that has been dark since 2026-06-18,
on events whose `date_status` is still `'undecided'`. That is a product-state call. When wanted:

```sql
update public.events set event_date_precision = 'day'
 where event_date is not null and event_date_precision = 'year' and event_date = std_film_date;
```

### 5.2 · The Build "anchors" were UI theatre *(now deleted, recorded for history)*
The three anchor rows (Wedding date · Total budget · Location) were **wired to nothing**:
`runBuild3State` read its budget ceiling straight from `events_host.estimated_budget_centavos` and
`resolveBuildPicks` consumed only taxonomy states — the `_dim_*` states were never read. Their
tri-state came from `event_category_build_state` (default `'excluded'`) while the *value* came from
`events`, two independent stores, and the value only displayed when the tri-state was `locked`. That
is why a couple **with a set date** saw *"Setnayan suggests this."* Deleted in #3867.

### 5.3 · ✅ **FIXED — #3886** · The flag-dark guarantee was unguarded in CI
Hardcoding `const replan = true` in `shortlist-categories.tsx` (bypassing
`isExploreReplanEnabled()`) broke **no test** — the full suite stayed green. **No CI job had ever
built with `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED=true`.**

**Shipped as `lib/flag-chokepoint-scan.test.ts`** — registry-driven, four properties per flag:
(1) `process.env.<FLAG>` is read in exactly ONE module, its helper — a second reader is a second
default; (2) the six load-bearing gates still *call* the helper, named one by one so the failure says
which went dark (comments stripped, so a docblock doesn't count); (3) the four pure cores
(`bench-sort` · `bench-card-actions` · `your-team` · `plans-panel`) still take it as a **parameter** —
a core that reads the env can no longer be driven in both states in one process; (4) no file that
should consult the flag pins `replan` to a literal. Mutation-checked against the exact reported bug:
it turns (2) and (4) red and names the file.

It does NOT claim a flag-OFF *render* is byte-identical — that needs a build with the flag on, which
stays CI's job. **The next flag-dark feature is one registry entry** and inherits all four checks.

### 5.4 · ✅ **FIXED — #3889** · Undisclosed / unbacked claims
`studio-card-demo.tsx` hardcoded a fabricated count on public marketing;
`vendor-grow-sections.tsx` **sold the scarcity nudge to vendors off a save-count** — the worse of the
two, because it advertised a feature the product deliberately refuses to build.

**Both fixed.** The couple-facing count was verified **already honest** first: `honestDemand =
isExploreReplanEnabled()`, that flag is ON in prod, so the inquiry-only floored path is what renders
and the save-count path is dead. Only the marketing had not caught up. The chip now uses the app's own
sentence ("3 couples inquired for your date" — 3 is the privacy floor, so it is the smallest honestly
displayable number), and the vendor step now describes what ships, floor included, with the
urgency-engineering promise ("so they move") removed. The retired wording is pinned in
`.retired-strings.json` so CI fails any PR that brings it back; `plan-budget-accordion.tsx` is the one
`allow_paths` exception, because on the flag-OFF path the number genuinely IS the save-count and that
render must stay byte-identical.

---

## 6 · OWNER DECISIONS — ✅ ALL FIVE CLOSED 2026-07-30 (owner: *"i cannot do this"*)

> The owner delegated these. Each was settled **from evidence**, not preference, and the evidence is
> recorded beside it. Nothing here is a pricing change or a policy reversal — those stay owner-only.
>
> | # | Settled | How |
> |---|---|---|
> | 1 | **Seed row DELETED, constraint VALIDATED** | The row owned **nothing** — 0 children across all ~90 FK referencers incl. every RESTRICT/NO-ACTION parent — and had **no `vendor_verifications` row at all**, proving it was stamped `verified` by a seeding action, never through the flow. So backfilling `last_verified_at` would have **fabricated a verification that never happened**. Deleted (baseline captured), then `VALIDATE CONSTRAINT` → **`convalidated = true`**. The DB now structurally refuses a verified vendor with no stamp. |
> | 2 | **New re-verification behaviour CONFIRMED** | A renewal from an already-verified vendor is a no-op. The old behaviour dropped them to `pending_review`, which **stripped the badge and delisted the shop for the whole review window** — it punished the vendor for complying. No code change; the shipped behaviour is the right one. |
> | 3 | **Demand-lens privacy legs: documented, not blocking** | Under the owner's standing *document-not-block* default. Still **cannot render** (needs ≥3 other couples inquiring on the same exact date; prod has 0 `chat_threads`), so the exposure stays theoretical. ⏭ The **DPO sign-off** is the one thing that genuinely needs the owner — it is a signature, not a decision. Real deadline unchanged: before couples start messaging vendors. |
> | 4 | **Both unbacked claims FIXED** — PR #3889 | See §5.4. One fabricated a number; the other **sold vendors a dark pattern we deliberately don't build**. |
> | 5 | **Phone "Budget & payments" item: NOT restored** | It is not stranded — §4.2 verified three live doorways (sidebar "Also in this event → Budget", Overview → checklist → "Review your budget", and the section's own disclosure), and the takeover's Payments section is in the same scroll. Adding a fourth doorway to a nav we just simplified would undo PR-3's whole point. Zero code. |

### 6.1 · The original five, kept for reasoning



| # | Decision | Recommendation |
|---|---|---|
| 1 | **The bad seed row.** One `vendor_profiles` row, `TEST Floor Co (seed)`, is `verified` with `last_verified_at` NULL — created 2026-07-27 by a seeding action. The `NOT VALID` constraint grandfathers it. | **Delete it, don't backfill** — it's a test seed. Then `ALTER TABLE public.vendor_profiles VALIDATE CONSTRAINT vendor_profiles_verified_requires_stamp` (errors if any violator remains ⇒ a safe re-runnable check). |
| 2 | **Annual re-verification.** An already-verified vendor submitting a renewal is now a **no-op** rather than dropping to `pending_review` (which stripped the badge and delisted the shop for the whole review window). | Confirm the new behaviour. |
| 3 | **Demand-lens privacy legs.** The "In demand right now" lens has **no opt-out** and no DPO sign-off. It currently **cannot render** (needs ≥3 other couples inquiring on the same date; there are 0 chat threads), so the exposure is theoretical *today*. | Real deadline = **before couples start messaging vendors**, not now. |
| 4 | §5.4's two hardcoded scarcity claims. | Remove or back them. |
| 5 | **Restore a "Budget & payments" sidebar item?** Removed 2026-07-10 as redundant; spec §18.7 proposes restoring it. Desktop already has one under "Also in this event" — so this is a phone-catches-up question, not a reversal. | Non-blocking. |

---

## 7 · Working agreements the owner has stated (honour these)

- **"i don't like us wasting credits on a simple task that is linear."** If the target is already
  drawn (a prototype, a design file, a locked doc), it is **one build agent and one PR** — not a
  multi-agent workflow. Fan out only for *"which of these?"* or *"is this claim true?"*.
- **Fable plans · Opus codes.**
- **Extend, never re-draw.** The owner has paid more than once to have a working screen recreated.
  Open the shipped component, reproduce its real copy and structure, and show only the DELTA.
- **Auto-merge is the standing default** — `gh pr merge <#> --auto --merge` immediately after
  `gh pr create`. Never ask.
- **Changelog fragments go in the ROOT `changelog.d/`** (CI guard enforces it). Never edit
  `CHANGELOG.md` or `STATUS.md` in a feature PR.
- **DECISION_LOG.md** — absolute path + `git -C`, never a bare `cd` (a bare `cd` hits the wrong repo
  and commits other sessions' work).
- **Prune each worktree once its PR merges** (~1.6–4.8 GB each; disk was at 87%).
- Icons are **Lucide, never emoji** — there is a `nav-icon-source` CI guard. The approved prototype
  uses emoji as a shortcut; the app is right and the prototype is not authoritative on visuals.

---

## 8 · Reference — where the truth lives

| Thing | Where |
|---|---|
| **The design contract for §4** | [`Explore_Integration_BUILD_SPEC_2026-07-29.md`](Explore_Integration_BUILD_SPEC_2026-07-29.md) |
| The wider Explore replan contract | [`Explore_Replan_BUILD_SPEC_2026-07-27.md`](Explore_Replan_BUILD_SPEC_2026-07-27.md) |
| The IA ruling this executes | [`Explore_IA_Replan_2026-07-27.md`](Explore_IA_Replan_2026-07-27.md) §2.2 |
| The approved prototype (behaviour, not visuals) | `Design_Explore_Replan_2026-07-27/explore_replan_playable_2026-07-27.html` |
| Decision history | `DECISION_LOG.md` — `grep -n "2026-07-2[789]"` |
| Source-of-truth order | live site → `apps/web` @ `origin/main` → live prod DB → `AS_BUILT_GROUND_TRUTH_2026-06-07.md` → iteration specs (**archive stubs, may be stale**) |

**Supabase prod:** project `njrupjnvkjkitfctetvi` (`setnayan-prod`, ap-southeast-1). Free plan —
**no point-in-time recovery**, so take a `SELECT` baseline before any data change.
**Vercel:** team `icasa-offroad`, project `setnayan-platform-web` (`prj_7VTNk7sjPejgXNsSkZsyiPQRLnwA`).
Production deploys on every merge to `main`, ~2–8 min. Production deployments are rollback-eligible —
**Instant Rollback is the fastest undo**, seconds, and beats changing an env var (which needs a rebuild).
