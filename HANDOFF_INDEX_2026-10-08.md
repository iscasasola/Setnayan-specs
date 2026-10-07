# HANDOFF INDEX — 2026-10-08 (old account → new account)

Owner: *"document everything properly and all our rules and prototypes and plans and sequence of builds"*. This is the ONE page to read first; every line points to the file that holds the detail. Newest wins. **A handoff is not evidence: re-measure before acting.**

## 0 · FIRST: catch up on work done AFTER this doc was written
Owner (08 Oct): *"at 98% start documentation and still continue safely building … the documentation will scan up to what part was built after the documentation and proceed after that"*. Builders kept going after this index was written. Before resuming ANY stream, for each branch in §3 run `git fetch origin && git log --since="<this doc's commit time>" origin/<branch>` and `gh pr list --state all --limit 30`, read each builder's status file (they are updated after every item), and treat commits newer than this doc as DONE. Then continue from the first item not yet done. Also check what merged to main (`git log origin/main --since=...`) and whether deploy-prod ran.

## 1 · The rules (owner, standing)
| Rule | Where it lives |
|---|---|
| Rule 0: find it before you build it; extend, never re-draw | repo `CLAUDE.md` |
| Build EXACTLY as the prototype; side-by-side at 375 per PR; owner OK before any UI merge | memory `build-exactly-as-planned-no-skipping-no-reinventing.md`, `a-green-suite-is-not-the-approved-look.md` |
| Never merge before every check is green; no --admin/bypass; never apply a migration directly to prod | memory `never-merge-before-every-check-clears.md`; repo `CLAUDE.md` |
| The button rule (ActionButton icon+word, tones, a row changes together, the field 60%, search debounce, **Rule 7 frosted glass row** `sn-glass-row`) | `BUTTON_RULE_2026-10-07_fable.md` |
| Any set of choices = ONE dropdown (exceptions: look pickers = picture cards; Event access Edit·Off·View three-way) | memory `any-set-of-choices-is-a-dropdown.md`; DECISION_LOG 2026-10-07/08 |
| No go-elsewhere links; one door (the dark "Edit in Studio ›" bar deep-links to the exact field + "Done · back") | memory `no-go-edit-elsewhere-links.md`; DECISION_LOG 2026-10-07 |
| Tools in the thumb zone; phone first (375/390); no boxes; minimal words (help behind ⓘ, at least 60% fewer words) | memory `tools-live-in-the-lower-third.md`, `phone-first-99-percent.md`; `MORE_MENU_PAGES_AUDIT_2026-10-07_fable.md` |
| Edits go to the draft; ONLY ✓ Apply publishes; no Save buttons in the Maker/Studio (Event Hub address and access stay live) | memory `phone-editing-calm-full-width-apply.md`; DECISION_LOG 2026-10-08 "draft 1-3" |
| Words: "Event Hub" not website · "supplier" not vendor · "event" not celebration · couples "book" never lock | memory `it-is-an-event-hub-not-a-website.md`, `say-event-never-celebration.md` |
| Every feature gets a first-visit tour (MiniTour / `lib/tours.ts`) | memory `every-feature-gets-a-first-visit-tour.md` |
| A failure never renders as success, 0 or empty (honest reads) | repo `CLAUDE.md` (the seven fixes) |
| Free very easy · Pro (◆) easy–medium · nothing hard | memory `free-very-easy-nothing-hard.md` |
| Fable designs, Opus builds; a lower model for extraction | memory `fable-designs-opus-builds.md`, `use-a-lower-model-for-extraction-in-parallel.md` |
| Every build comes with a check card (link · 3 steps · what you should see · phone screenshot) | memory `every-build-comes-with-a-check-card.md` |
| Pace: stop builders and hand off at 98% weekly | memory `handoff-zip-at-weekly-97.md`, `stop-only-on-the-measured-usage.md` |

## 2 · Prototypes (approved unless noted) — all under `prototypes/`
- Maker Stages|Studio: `maker_two_dropdowns_owner_wireframe_2026-10-06_fable.html` (THE contract; TABS map ~line 1226)
- Maker desktop: `maker-desktop-2026-10-07/` + `MAKER_DESKTOP_ADAPTATION_2026-10-07_fable.md` (all five "A")
- Home: `rd-home-with-the-maker-2026-10-07/` · Guests: `rd-guests-with-the-maker-2026-10-07/` · bottom nav: `bottom-nav-2026-10-07/`
- Event Details: `event_details_arranged_2026-10-07_fable.html` (approved "approve all")
- More-menu pages: `more-menu-pages-2026-10-07/` (audit approved: "ok build those pages")
- Look restudy: `background_restudy_2026-10-08_fable.html` (Background · Elements · Music, Video ◆, Effects) — AWAITING approval
- Budget: `budget_page_2026-10-08_fable.html` (approved: "budget looks good!")
- Suppliers: `SUPPLIERS_HANDOFF_2026-10-07_fable.md` + its prototypes (incl. 08 Oct budget adds)

## 3 · Plans and status files (resume from these)
| Stream | Plan | Status / PR |
|---|---|---|
| Stages panel refinements (RD) | owner faults list in `STAGES_PANEL_BUILD_STATUS_2026-10-08.md` | branch `rd/stages-panel-owner-fixes` |
| Studio round 3 (S3) + draft 1-3 | `STUDIO_ROUND3_BUILD_STATUS_2026-10-08.md` | `rd/studio-round-3`, `rd/studio-draft-fields`, #6406 |
| Event Details | `EVENT_DETAILS_ARRANGE_2026-10-07_fable.md` | `EVENT_DETAILS_BUILD_STATUS_2026-10-08.md`, #6412 |
| More-menu pages | `MORE_MENU_PAGES_AUDIT_2026-10-07_fable.md` | `MORE_MENU_BUILD_STATUS_2026-10-07.md`, #6411 |
| Look restudy | `BACKGROUND_RESTUDY_2026-10-08_fable.md` (8-PR plan) | design only |
| Budget | `BUDGET_PAGE_2026-10-08_fable.md` (B0–B5) | builds WITH Suppliers |
| Small PRs | — | #6409 Guests Setup · #6410 frosted rows · `rd/home-tiles-filter` · `rd/event-pages-no-top-search` |
| E-Gifts wish list | DECISION_LOG 2026-10-08 | design first |

## 4 · Sequence of builds (owner order)

⏰ **TARGET (owner, 08 Oct ~03:30): "later, we can also finish supplier build so we can allow vendors to come in this weekend"** → Suppliers must be ready for real suppliers to join by the weekend of 10–11 Oct. FIRST ask the owner, in one line, which side this means: the couple's Suppliers page + Budget, or the supplier's own side (sign-up / shop / onboarding), or both. Then plan the build to land before the weekend.

1. Fix main if red: `launch/_components/add-part-sheet.tsx` (a variable used before it is declared, reported by EDB's typecheck on 08 Oct; verify on origin/main first).
2. Finish the in-flight refinements: RD panel → S3 Studio → small PRs (#6409, #6410, tiles, top search) → owner check on the preview → merge → deploy.
2b. **Event coverage (BEFORE the Apple check)**: every PH event style + needs presets + limits + Maker/onboarding/Home by type (DECISION_LOG 2026-10-08): design the per-type table first (simple events → simple Maker; no dress code → Mood Board = Colours only), owner approves, then build.
3. Desktop three columns.
4. Suppliers + Budget + launch offer (option B, 50 free Papic credits) — target: suppliers join the weekend of 10–11 Oct.
4b. Admin pages, same treatment: "an easy one man handled website".
5. Event Details (#6412 → PR-B, PR-C) and the More-menu pages (#6411 → steps 2–10; step 6 needs a new table, owner sign-off first).
6. Look redesign (after owner approval) · Logo maker replot (approved).
6b. **When ALL features are clean:** redesign + replot onboarding and per-event coverage (EVENT_COVERAGE_MATRIX_2026-10-08_fable.md, A–G incl. expo exhibitors) — before the Apple check.
7. E-Gifts wish list (design first).
Apple check last (`ROADMAP_TO_APPLE_CHECK_2026-10-06.md`), then the post-Apple builds, then **a public feature page per feature for search visibility** (DECISION_LOG 2026-10-08).

## 5 · Where tonight's rulings are
DECISION_LOG.md rows dated 2026-10-07 and 2026-10-08 (verbatim owner words). Handoff state: `setnayan-handoff-src/CURRENT-STATE.md` (top block). Memory: `maker-build-state-2026-10-07-evening.md`.
