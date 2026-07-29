# WHATS_NEXT — Explore / Marketplace integration wave · 2026-07-29

> **Cold-start handover.** Written for a session (or a different Claude Code account) with **zero
> context**. Read this file top to bottom before touching anything. Everything below was verified
> against `origin/main` and live prod on 2026-07-29 unless explicitly marked otherwise.
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

| # | Branch | What | Action for the next session |
|---|---|---|---|
| **#3870** | `claude/decision-doorway-anchor` | "Still needs your decision" rows land on the folder header, not the category. **The bench has no leaf anchor at all** — only `slfold-<folder.slug>` (`shortlist-categories.tsx:1471`). Fix adds `sltile-<tile>`, moves the scroll into the bench (it owns the timing; the doorway's fixed 220 ms races the remount the `key` change causes), keeps folder-level scroll only for `tile === null` groups. | `gh pr view 3870` — if merged, tick it off; if open and stale, re-verify then re-arm. |
| **(not yet opened)** | `claude/bench-category-search-overlay` | See §4.1 — was queued to the same agent and may not exist. **Check `gh pr list --head claude/bench-category-search-overlay --state all` before starting it.** |

---

## 4 · THE REMAINING BUILD LIST

### 4.1 · Wire the category-search overlay into the bench 🔴 highest value

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
⚠ **Empty state matters most**: prod has **0 `vendor_services`**, so the owner will land on the
empty result. It must read calm and honest, not like a void.

### 4.2 · PR-3 — remove the mobile 4-chip dock  ⚠ shared layer
Spec §5. In `lib/customer-menu.ts:229-240`, emit the explore menu's `children` (+ `sectionMatch`,
`sectionMatchExact`, `subnavLabel`) **only when `!isExploreReplanEnabled()`** so
`customer-section-subnav.tsx` returns null on `/vendors` while **Studio's dock stays intact**.
Side benefit: the global bottom nav un-collapses back to icons+labels here (it shrinks only while a
SubNav is docked) → mobile drops from two stacked bars to one.
Verify: Studio's anchor dock, Guests, and `/admin/menus` all unaffected. `?tab=` deep links and the
`BB_TAB_EVENT` bus must keep working.

### 4.3 · PR-4 — the mobile team summary chip  *(owner-approved 2026-07-29)*
One floating chip, mobile only, docked above the bottom nav:
*"● 2 locked · ◕ 3 in build · ₱82,000 buffer"* → tap = `goToBuildTab('build')`. Uses `teamMoney`
(`lib/your-team.ts`) and the existing bus + scroll anchors. Kept **separate from PR-3** so the
removal stays cleanly revertible.

### 4.4 · PR-5 — cleanup
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

### 4.5 · The ~60 admin components with hand-rolled white borders — **DONE** (#3859)
Listed here only so nobody re-opens it.

---

## 5 · LIVE DEFECTS found but NOT fixed

### 5.1 · 🔴 `event_date_precision` never advances past its creation default
Prod event `044f7e64…` has `event_date = 2026-12-18` and `date_mode = 'specific'` but
**`event_date_precision = 'year'`**. Precision defaults to `'year'` at creation
(`create-event/actions.ts:397`) and is meant to advance when a real date is chosen
(`[eventId]/actions.ts:155`); on this row it never did — so a date was saved by a path that skips
the precision update.

**Impact:** anything gated on precision treats the wedding as undated. Countdown maths only runs at
`'day'` (`lib/progress-stages.ts:53`), so it currently **skips this event entirely**.

**To fix:** find the write path that sets a date without advancing precision, close it, then correct
the row. **Do NOT bundle this with a UI PR** — it turns on behaviour that has been dark.

### 5.2 · The Build "anchors" were UI theatre *(now deleted, recorded for history)*
The three anchor rows (Wedding date · Total budget · Location) were **wired to nothing**:
`runBuild3State` read its budget ceiling straight from `events_host.estimated_budget_centavos` and
`resolveBuildPicks` consumed only taxonomy states — the `_dim_*` states were never read. Their
tri-state came from `event_category_build_state` (default `'excluded'`) while the *value* came from
`events`, two independent stores, and the value only displayed when the tri-state was `locked`. That
is why a couple **with a set date** saw *"Setnayan suggests this."* Deleted in #3867.

### 5.3 · The flag-dark guarantee is unguarded in CI
Hardcoding `const replan = true` in `shortlist-categories.tsx` (bypassing
`isExploreReplanEnabled()`) breaks **no test** — the full suite stays green. **No CI job has ever
built with `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED=true`.** Worth a guard script alongside
`select-column-scan.ts`. (Lower priority now the flag is ON, but it will matter for the next
flag-dark feature.)

### 5.4 · Undisclosed / unbacked claims still live *(owner decisions, §6)*
`studio-card-demo.tsx:839` hardcodes "3 also eyeing your date" on public marketing;
`vendor-grow-sections.tsx:230` sells the scarcity nudge to vendors off a save-count.

---

## 6 · OWNER DECISIONS still open

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
