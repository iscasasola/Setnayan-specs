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

## PR2 · Find — STARTED (see the section at the end of this file as it is filled in)

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
