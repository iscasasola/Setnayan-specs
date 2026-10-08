# Suppliers one-screen — BUILD STATUS · 2026-10-08 (Builder SP1, Opus)

## PR1 · the shell — COMPLETE (code + local checks), waiting for the preview side-by-side

- Branch `rd/suppliers-shell-three-modes` · head **`b5bb865078f4c13f8392a63edb049a76fa60f0d7`** (two commits on `origin/main` `560e6d0f0`; main had not moved at the final push)
- PR **#6422** — DRAFT · `do-not-auto-merge` · auto-merge OFF · title no longer WIP
- Worktree `~/Documents/Claude/Projects/wt-suppliers`

**What Find shows when something is picked (the prototype at corpus HEAD, and the build):** the Build segment reads `Build N/M`; adding a supplier to the build raises the cart peek (two lines, 2.5 s, "View this build"). **No "View this build" pill** — removed per the 2026-10-07 evening ruling. The Find thumb row (expand · search · add) is PR2.

### Checks at `b5bb865`
| Check | Result |
|---|---|
| `tsc --noEmit`, COLD (tsbuildinfo deleted, heavy lock) | rc 0 · 203 s · empty log |
| `pnpm -s lint` (apps/web) | 0 errors |
| The 58 test files that read the suppliers page or a touched file | 594 pass / 0 fail |
| New + re-pointed tests alone | 72 pass / 0 fail |
| `ugat-concept-coverage` + `ugat-schema-claims` (db) | 6 pass |
| ci.yml node guards that read the change | 22 pass / 0 fail |
| Sabotage | 33 runs, every new or changed test seen red once, all restored (table in the PR body) |

### Not verified
- Nothing was looked at in a browser; no lab renders this page and none was faked. **Controller: PR1 is ready for the Vercel preview and the 375 px side-by-side.**
- Phone first-paint weight (Find, with the bench, is now the first body).

### Files (under `apps/web/`)
`vendors/_components/services-takeover.tsx` (the shell) · `build-cart.tsx` (new — the peek) · `date-place-line.tsx` (new) · `vendors/page.tsx` · `accordion-build.tsx` + `bench-vendor-actions.tsx` (announce a saved pick) · `lib/suppliers-shell.ts` (+ test) · `lib/budget-build.ts` (`bb:build-added`) · deleted `planning-list.tsx`, `planning-list.test.ts`, `chats-door.tsx` · `vendors/build-cart.test.ts` (new) · re-pointed: `your-team-phone-first`, `suppliers-opens-fast`, `suppliers-keeps-the-shell-bar`, `lib/marketplace-masthead-and-layout`, `lib/pillar-parts`, `lib/chats-badge-equals-the-list` · `tests/db/ugat-concept.baseline.txt` · regenerated `scripts/port-control-baseline.json`, `lib/ugat/screens.generated.json` · `changelog.d/rd-suppliers-shell-three-modes.md`

### PR0 — shipped / missing (measured on `origin/main` `560e6d0f0`)
| PR0 "BUILD EXACTLY" item | State |
|---|---|
| `ActionButton` — six tones, `main`, `quiet`, 40 px pill, `.lbl`, `aria-label` = word | shipped |
| `--color-ok / info / warn / danger`, light + dark | shipped — ok `#2B744A`, warn `#965A00`, info = `var(--color-link)` (differ from the plan; shipped wins) |
| `useFitRow(ref)` | shipped — one state per row (full → word → icon), a field keeps 60 % (differs from the plan's one-at-a-time; shipped wins) |
| `Count` + `Fill` | shipped |
| `action-button-is-icon-and-word.test.ts` · `count-animates-only-on-change.test.ts` | shipped |
| Ugat nodes/joints or one reasoned baseline line each for the six tables | **missing → built**: six `map-backlog` lines; no joint added |
| Screenshot inside `ServiceCardFace`'s footer at 375 / 320 | not done here |

### Deviations / owner calls (PR1)
1. Date and place open the Event Details field route (a navigation), not a sheet on this page — PR5.
2. The place reads "‹booked venue›, ‹area›"; the prototype shows a city; the page reads none.
3. "Build N/M": M = categories holding at least one of the couple's suppliers, or covered. PR2 redefines M.
4. The peek's button is an `ActionButton` (cream on ink), not gold text with "›"; 2.5 s, not the prototype's 2.8 s.
5. Payments and Your plans are shown open; the 380 px desktop rail is gone.
6. `BuildLocked` still draws its own Date and Location tiles inside the Build stub — until PR3.
7. `?tab=budget` and the Booked segment both open Booked at its top.
8. Desktop segments are 32 px tall (`ISeg`'s own rule).

## PR2 · Find — split in three; part 1 of 2a is up

The plan's PR2 is too big for one PR (the bench it adapts is 3,729 lines, pinned by ~28 tests). Split, said before opening:

| Part | What | State |
|---|---|---|
| **2a · part 1** | Find's thumb row: ⇕ Expand all / Collapse all · search · ＋ Add your own | **PR #6425** — DRAFT · `do-not-auto-merge` · auto-merge OFF · base `rd/suppliers-shell-three-modes` · branch `rd/suppliers-find` · head **`c1a8fc349248c308047e30d6a8ff91975967afd9`** |
| **2a · part 2** | Flat category rows + state words + pinned header + scoped search; service cards + verbs by step; "More to compare" always on; "＋ Add to your event" as one dropdown | NOT STARTED — see "Next" below |
| **2b** | Add your own (steps, twin match), the record, payment channels, fee-leak check | BLOCKED — needs a migration and probably new server actions; COMMON.md forbids both this week. Needs the controller's word |

### 2a · part 1 — checks at `c1a8fc3`
| Check | Result |
|---|---|
| `tsc --noEmit`, COLD | rc 0 · 221 s · empty log |
| `next lint --no-cache` | 0 errors |
| The 71 test files that read the page, the bench, the shell or a touched file | 763 pass / 0 fail |
| ci.yml node guards | 22 pass / 0 fail (port baseline regenerated) |
| Sabotage | 20 runs, each red, restored (list in the PR body) |
| Browser | NOT looked at — needs the preview |

Files: `vendors/_components/find-thumb-row.tsx` (new) · `suppliers-mode.tsx` (new — the context a body reads: which body is on screen, and `leaving`) · `services-takeover.tsx` (provider + the ~300 ms wait before a swap when a row is up) · `shortlist-categories.tsx` (`openAll` / `folded`, the in-list search box only when the replan flag is off, `addYourOwn`, the "What they do" ask sheet, the row's mount) · `lib/suppliers-shell.ts` (`isCategoryOpen`) · tests: `vendors/find-thumb-row.test.ts` (new), `lib/suppliers-shell.test.ts` (T5), `lib/floating-rows-are-glass.test.ts` (row registered) · `changelog.d/rd-suppliers-find.md`.

Deviations in part 1: the box always says and searches "all suppliers" (the scoped words need the pinned header, part 2) · no `＋ Add "…"` with the typed name (the shipped form takes no name — 2b) · "which category first" is a small sheet with one dropdown, then the shipped form · still the shipped folders under the row.

### Next — 2a · part 2, measured (do not re-measure; verify and build)
A read-only map of the bench against the prototype was taken at `8954305`. The findings that decide the design:

1. **"The categories on the event" has no clean store for a wedding.** `resolveInPlanTiles` (`lib/explore-in-plan.ts`): a SEEDED event (onboarding picks) → plan ∪ engaged − excluded; an UNSEEDED one → EVERY tile minus the removed ones (~53 rows). And `vendors/page.tsx` (~line 1486) deliberately makes every wedding unseeded, although wedding onboarding DOES save `style_preferences.interested_categories` (`app/onboarding/wedding/actions.ts`). The prototype's five-row ring therefore needs: weddings to honour their own onboarding picks (a filter flip, no schema), and a starter set when there are none — `POPULAR_BY_TYPE` in `lib/supplier-find.ts` is the shipped "four a host of that type books first".
2. **"＋ Add to your event" cannot make a never-planned category stick.** `event_category_decisions.decision` is `excluded | deferred | complete` — there is no "added". `restoreTileToPlan` only deletes an exclusion row; for a seeded event today the chip on a never-planned tile changes nothing that survives a refresh. **Owner / controller call:** (a) a migration adding an "included" decision, (b) have the existing `restoreTileToPlan` also append the tile to `style_preferences.interested_categories` (+0 actions, no migration — recommended; note the checklist reads that list too), or (c) the row lives for the session until a supplier is added there.
3. **"Covered N of M" today counts only categories the couple marked done** (`coverageSummary`), not booked ones. The prototype counts booked or covered-by. `coverageStateOf` already knows `locked` and `covered` — count both.
4. **Row state words exist only at folder grain** (`folderSummaryOf`). Per row: `coverageStateOf` (booked / covered / asked / picked / exploring / empty) + `standings[..].needsYou` for "N quote in". "N suppliers" (the marketplace count for an empty category) has no data on the bench — it would be a new read per category.
5. **The marketplace list inside a category is opt-in and one-at-a-time** (`moreOpen`, a single row's state). "More to compare" always on, with a count, for several open categories needs that state keyed by tile.
6. **`ShortlistVendor` carries no service-card fields** — `ServiceCardFace` needs a `Snapshot` (`lib/service-card-snapshot.ts`), i.e. a read of the supplier's service card per shortlisted supplier.
7. **Card verbs:** Add to build · In your build · Book · Withdraw · Set price ship in `BenchVendorActions`; "Inquire" / "Open conversation" need the prototype's words; **Remove on a card, Nudge, Pay, Read their reply are not on the bench card today** (Nudge / Pay live in `lib/your-team-rows.ts` for the Booked body).
8. **`h6-mirrors-the-booking-path.test.ts` holds an exact map of `searchCategoryVendors` callers** — a new caller fails it until added there.
9. Tests that pin the bench's structure and will need re-pointing when the folder level goes: `category-hints`, `bench-deep-link-anchor`, `the-bench-card-keeps-everything` (exact occurrence counts), `bench-category-search`, `choices-are-one-dropdown`, `card-dates`, `bench-arrangement`, `inline-more-order`, `the-bench-says-where-you-stand`, `the-unread-badge-reaches-the-cards`.


## What PR2–PR4 need from this
- Bodies: `data-suppliers-body="find" | "build" | "booked"` in `services-takeover.tsx`. Each is a slot the page fills:
  - Find ← `shortlistSlot` (`ShortlistCategories`), under the "Find a supplier" link and the Setnayan AI strip
  - Build ← `buildSlot` (`MerkadoGuardBanner` + `BuildLocked` + `ReuseBookingsPanel`), then `compareSlot` (`BuildCompare`)
  - Booked ← `teamSlot` (`TeamRows`), then `budgetSlot` (`MerkadoBudgetLens`)
- `--stick-h` (top bar + pinned block) and `--sup-top` are set on `[data-budget-build-takeover]`; pin a category header at `top: var(--stick-h)`.
- The thumb bar: there is none yet. PR2 adds the frosted expand · search · add row for Find (slide up after the mode renders, slide down ~300 ms before a body swap — `goToSection` in the shell is where the swap happens). The cart peek sits 76 px above the bottom bar to clear it.
- Peek trigger: `announceBuildAdded({ name, category })` from any new "Add to build" button.
- Mode helpers: `lib/suppliers-shell.ts` (`suppliersModeOfTab`, `SUPPLIERS_MODE_TAB`); open a mode with `goToBuildTab('shortlist' | 'build' | 'budget')`.
- PR2's `event_manual_vendors.leak_match_vendor_profile_id` needs a schema claim → promote `event_manual_vendors` to a joint and delete its baseline line (the stale check will say so).

## Traps met
- A source test that slices a component to its first column-0 `}` (the old `fnBody` helper) gets only the PARAMETERS of a component with a typed props object. Slice to the next function instead.
- `lint:no-card --update-baseline` wanted to rewrite three unrelated files (drift already on `main`); that was reverted, not committed. Regenerate only what your own change made stale.
- The second `tsc` in a worktree is incremental and finishes in seconds — read the log and the first run's errors before trusting it.
- `fixed` is captured by the dashboard's page wrapper; the pill and peek are portalled to `<body>`.
