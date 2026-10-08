# Suppliers one-screen — BUILD STATUS · 2026-10-08 (Builder SP1, Opus)

## NOW — where both branches stand (updated after every item)

| Branch | PR | Head | On `origin/main` |
|---|---|---|---|
| `rd/suppliers-shell-three-modes` | #6422 (draft · `do-not-auto-merge`) | `8af5ea67b` | `9b2065225` merged in (baselines regenerated — no change needed) |
| `rd/suppliers-find` | #6425 (draft · `do-not-auto-merge`, base = the shell branch) | `963868ee0` | same, through the shell branch |

Checks on the merged trees: shell — cold `tsc` rc 0 (173 s) · `next lint --no-cache` 0 errors · 831 pinned tests pass. Find — 882 pinned tests pass (cold `tsc` runs with the next item).

**2a items, in order:**

| Item | State |
|---|---|
| Thumb row (expand · search · add) | DONE `c1a8fc3` |
| Flat rows · ring · state words · pinned header · scoped search · ONE "Add to your event" dropdown | DONE `c45748a` |
| The three faults the controller measured on the preview at 375 | DONE `5733ba34e` — one "＋" on "Add to your event" · the search field keeps 60 % of the bar (`useFitRow` now runs in the component that draws the row, plus a CSS floor) · category names wrap, never clip ("· N yours" rides the same run) |
| Verbs by step | DONE `76e767376` — one table `lib/supplier-card-verbs.ts`, drawn by `bench-vendor-actions.tsx` as `ActionButton`s; Remove, Nudge, Pay / Payments, Read their reply, Ask about another day, Workspace are new on the card; +0 exported actions (Nudge is a branch of `contactShortlistVendor` through `sendChatMessageCore`) · 929 pinned tests · 18 sabotages red |
| Service cards in the rows | DONE `b027e91c6` — inside a row the couple's suppliers are a LIST of service cards (80×112 cover · service name + running offer · who and where · price · included · not included · gift line) with the verb row across the foot; every line the bench card carried is kept. `lib/bench-service-card.ts` (one decision over `snapshotFromService`; a shop that hides prices shows no peso figure; ended offers dropped) + `lib/bench-service-cards.ts` (batched read on the page's photo pass; a failed read is `null` → the card says nothing, never "Price on request"). 11 new tests · 893 pinned pass · 33 guards pass · 22 sabotages red · +0 actions |
| "More to compare" always on, with a count | DONE `963868ee0` — every OPEN category with no booking carries the marketplace list under the couple's cards: "More to compare · N" / "To compare", the one sort dropdown in its head, the suppliers' service cards with Ask for a quote (main) + Save. `MoreToCompare` owns one row's list (several rows open at once); `fetchInlineMoreRow` also returns each supplier's card for the category (+0 exports); a withheld name is not given away by a card title; the count shows only after a read; a failed read never says "Nobody" / "Price on request". 12 new tests · 5 guards re-pointed with reasons · 941 pinned pass · 33 guards · 32 sabotages red |
| The supplier sheet | IN PROGRESS |
| 2b (own stacked branch + draft PR; may carry the ONE named migration; never applied, never deployed) | not started |

**Old links (the controller's note):** the segments still write the shipped keys, on purpose — `?tab=shortlist` (+ `open=`) → Find · `?tab=build` → Build · `?tab=compare` → Build, scrolled to the plans · `?tab=budget` → Booked at its top. Executed by the deep-link case in `vendors/suppliers-opens-fast.test.ts`.

**Service card deviations to rule on:** drawn with the bench card's own elements in the `ServiceCardFace` SHAPE (not the component — it has no slot for the corner, the badges, the dates or a tap target; the values come from the same `snapshotFromService`) · a self-added supplier with no price says "No price recorded", not "Price on request" · card radius is the 14 px token (the radius guard refuses 16 px).

**Trap:** `pnpm -s port:baseline` / `ugat:screens` / `root-map` are scripts of `apps/web` — run from the repo root with `-s` they do NOTHING and print nothing. Run them from `apps/web`. (The merged trees were re-checked: only the baseline's `ref` line had moved.)

**More-to-compare deviations to rule on:** a quiet **Save** sits beside Ask for a quote (the prototype shows only Ask — Save shipped and was kept) · a quiet **"See all ‹Category› with filters"** button at the foot still opens the full sheet (the plan says retire the overlay; it is the only place with filters and facets, so it was kept reachable — say the word and it goes) · the sort is the bench's one value shown in each list head (as in the prototype), and the bar above the rows is gone · the search with NO category in scope still filters only the couple's own cards (a marketplace search across every category is one read per category per keystroke) · suppliers sharing no free day with the build are lowered behind the shipped divider, not hidden · the rail's "Find more" / "Add manually" tiles are no longer drawn on this page (the list is always open; Add your own is in the thumb row and at the foot of a booked category).

**Verb deviations to rule on:** Nudge sends the prototype's one sentence in both the quote and the asked-to-book states · `Connect` stays as one extra grey button until 2b's record sheet · booked with nothing due says "Payments", not "Paid in full" · a marketplace supplier booked with no price says "Set price" and opens the workspace.

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
| **2a · part 1** | Find's thumb row: ⇕ Expand all / Collapse all · search · ＋ Add your own | DONE — in **PR #6425** (DRAFT · `do-not-auto-merge` · auto-merge OFF · base `rd/suppliers-shell-three-modes` · branch `rd/suppliers-find`), commit `c1a8fc3` |
| **2a · part 2** | Flat category rows + state words + pinned header + scoped search; service cards + verbs by step; "More to compare" always on; "＋ Add to your event" as one dropdown | rows + ring + scope DONE at `c45748a` (same PR); cards · verbs · More to compare · supplier sheet still to build |
| **2b** | Add your own (steps, twin match), the record, payment channels, fee-leak check | NOT STARTED — owner said OK: one named migration allowed; stay within the route ceiling |

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

### 2a · part 2 — rows + ring + scope DONE at `c45748a2c26d61fdf0e0d84ef55d9f9b200399c8` (PR #6425, `rd/suppliers-find`)

Owner rulings ("1. yes 2. go 3. ok") built:
- **The ring.** `resolveBenchRing` (one call, the list and the page): the event's own onboarding picks — a wedding's too — else `popularTilesFor(type)`; a category with a supplier or a booking always shows.
- **An added category stays** — `restoreTileToPlan` writes `style_preferences.added_categories` after a host check (`writeStylePreferenceKey`). +0 exported actions, no migration.
- **Checklist finding:** the onboarding picks list is read by the checklist budget, the checklist suggestions, the supplier brief and the onboarding auto-inquiry fan-out, in the picker's vocabulary. The added category is therefore kept under its OWN key and **changes nothing on the checklist**. Recommendation: keep.
- **Flat rows**, "· N yours", one state word, "Covered N of M" (booked or covered), ONE "+ Add to your event" dropdown, "Not needed · Remove ‹Category›", heading "Cover your event".
- **Pinned header + scope:** the open row's head pins; the thumb row's words, search and Add follow the pinned category; rule 6 header taps; landing without a guessed delay.
- **`Build N/M`** counted over the ring.

| Check at `c45748a` | Result |
|---|---|
| `tsc --noEmit`, COLD | rc 0 · 178 s · empty log |
| `next lint --no-cache` | 0 errors |
| 86 test files reading the page / bench / shell / action / touched libs | 947 pass / 0 fail |
| ci.yml node guards | 23 pass / 0 fail · server actions 1199 of 1225 (+0) |
| Sabotage | 56 runs over the three commits, each red, restored |
| Browser | NOT looked at |

**Still to build in 2a (same branch):** service cards (`ServiceCardFace` needs a `Snapshot` per shortlisted supplier — a new batched read on the page) · verbs by step as `ActionButton`s (Ask for a quote · Nudge · Chat · Remove · Read their reply · Add to build · Book · Your record · Withdraw · Pay / Set price · Workspace — today's slots are in `bench-vendor-actions.tsx`; Remove-on-card, Nudge, Pay and Read-their-reply are not on the bench card) · "More to compare" always on with a count (the inline row's state is single-tile today: key it by tile; `h6-mirrors-the-booking-path.test.ts` maps `searchCategoryVendors` callers) · the per-category sort · the supplier sheet.
**2b (own stacked branch + PR, may carry the one named migration):** not started.

Deviations in 2a so far: "Covered ✓" without the covering supplier's name · an empty row says nothing (no marketplace count on the bench) · the scoped search filters the couple's own cards only · shipped cards and verbs inside a row, one bench-wide sort · no `＋ Add "…"` · an explicit removal still hides a category that holds an unbooked supplier.

Traps met in part 2: `lint-colour-exists` reads any `ring-*` class as a Tailwind ring colour · BSD `sed` has no `\b` · `bench-deep-link-anchor.test.ts` forbids `setTimeout(…benchTileAnchorId` — land with a layout effect and `transitionend` · `.fold-collapse>.fold-body` is `overflow:hidden` even when open, which stops a sticky head · the heavy lock once broke another session's lock as "stale" on a corrupt timestamp (not mine; noted).

### Measured before part 2 (kept for reference)
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
