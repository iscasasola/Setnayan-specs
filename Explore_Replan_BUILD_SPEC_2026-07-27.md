# Explore Replan — BUILD SPEC
**Date:** 2026-07-27 · **Status:** BUILD-READY · **Execute in:** a fresh session (this spec is the cold-start contract)
**Design:** [`Explore_IA_Replan_2026-07-27.md`](Explore_IA_Replan_2026-07-27.md) (+ §5 owner additions) · **Behavioral spec = the playable prototype:** [`Design_Explore_Replan_2026-07-27/explore_replan_playable_2026-07-27.html`](Design_Explore_Replan_2026-07-27/explore_replan_playable_2026-07-27.html) (artifact fb168bd2 mirrors it). When prose and prototype disagree, the prototype wins — the owner iterated on it five rounds.

## 0 · Read first (in order)
1. This file, fully. 2. The playable prototype (open it, click through one lock loop). 3. `Explore_IA_Replan_2026-07-27.md` §0–§5. 4. DECISION_LOG 2026-07-27 rows: multi-pick floor · IA replan · §5 additions · SERVICE-CARD RECONCILIATION · stateful-inquiry amendment. 5. Repo rules: worktree off `origin/main` per PR · changelog fragment in ROOT `changelog.d/` · `gh pr merge --auto --merge` · verify BEFORE arming auto-merge · prune worktree after merge · `pnpm install --frozen-lockfile --prefer-offline` in fresh worktrees.

## 1 · The target surface (all of it already exists — this wave EXTENDS)
Live path `/dashboard/[eventId]/vendors` (BUDGET_BUILD ON in prod): single-scroll `ServicesTakeover` — bench (`shortlist-categories.tsx`, folder accordion + carousel rails) · Build (`Build3StateControl`+`BuildLocked`) · Budget (`MerkadoBudgetLens`) · Compare (`build-compare.tsx`). ⚠ `PlanBudgetAccordion` is the legacy kill-switch path — do NOT build on it (PR #3789's UI affordances live there; carry them here, PR-D/PR-A).

## 2 · Decisions in force
| # | Decision | Source |
|---|---|---|
| 1 | Multi-lock everywhere except `HARD_SINGLE_PICK_GROUPS` (6); "at least 1 is the floor" | #3789 + log row |
| 2 | Post-lock in multi-pick: toast asks "done with this service, or add another?" → `'complete'` / stay open. Hard-single auto-completes | design §1.3 |
| 3 | Incompatible-after-anchors cards: DIM + booking-DISABLED + SINK behind "Not available" divider, never removed; **"Ask anyway"** keeps the thread path (dimmed-but-viewable, per prototype — owner played it 5 rounds without objection) | design §1.2 |
| 4 | "I'm done" collapse = one-line "✓ Covered — reopen" row (per prototype) | design §1.3 |
| 5 | Coverage Strip = ICON tiles (Lucide in production, NOT emoji) + state ring/badge + NEXT flag + progress ring; urgency-ordered; in-plan categories only | §5 + prototype |
| 6 | Adaptive category set: in-plan vs "＋ Add to your plan" pool per folder; "Not needed? Remove"; a category with a locked vendor is NOT removable | §5.2 |
| 7 | ⓘ per tile → plan-group `hint` via the tile→group bridge; finer tiles need copy (Taxonomy Studio later; ship group hint as fallback) | §5.1 |
| 8 | Lock summaries: collapsed rows show locked vendor names; folder heads show "● N locked · N to decide · ＋N more"; Your team gets "Still needs your decision" | §5.3 |
| 9 | **Three-action card:** "＋ Add to build" (primary, `event_build_picks` ◕) · **Inquire / 💬 Check inquiry (STATEFUL on thread existence)** · "Lock now — it's final" (quiet secondary). Hard-single build holds ONE candidate (add swaps). Locking removes the pick from build | reconciliation rows |
| 10 | Plans (Compare renamed): locked picks PINNED identical in every column; columns vary build candidates; "Save current as a plan" from Your team | design §2.4 + prototype |
| 11 | Your team: locked + candidates ("ready to lock" per-row Lock ✓) + anchors + Locked/In-build/Budget/**Buffer** tiles | prototype |

**⛔ One hard owner gate (blocks PR-G only):** lock-reserves-nothing (DECISION_LOG 2026-07-26) — greying options on a lock that holds no date isn't credible. Owner must pick (a) pool-acquire at `contracted` + ~7-day unpaid expiry (recommended) or (b) "Lock is a claim" labeling. **Also prereq for G:** the `/find-date` dead vendor pool (42703, two non-existent columns) must be fixed.

## 3 · PR slices (each = one worktree · one PR · flag-dark; build in order, A→F are unblocked TODAY)
**Flag:** everything user-visible behind `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED` (new, default OFF; helper `lib/explore-replan-flag.ts` mirroring `payment-gated-lock.ts`). Never flip in prod — owner flips after preview.

### PR-A — 'complete' decision + done-or-add-more toast (S)
- Migration: extend `event_category_decisions` CHECK to `('excluded','deferred','complete')` (drop + re-add constraint; RLS/ACL untouched). Ledger rule: dispatch + verify the OBJECT (constraint), not just the ledger.
- `lib/checklist-state.ts`: type + resolution for `'complete'` (reversible).
- Post-lock toast: `_components/lock-milestone.tsx:122` (`LockMilestoneToast`) + `accordion-lock.tsx:271-299` — multi-pick lock adds the two-button question ("✓ I'm done" writes `complete` via a new server action next to `flagCategory`; "＋ Add another" no-op keeps rail). Hard-single: auto-write `complete` in `finalizeVendor` (`vendors/actions.ts:650` family) after the existing milestone block. Undo (`revertVendorToConsidering`) must clear `complete`.
- Bench: "✓ Covered — reopen" row state in `shortlist-categories.tsx` tile body.

### PR-B — Coverage Strip v2 + folder summaries (M)
- Upgrade the plan-strip (`shortlist-categories.tsx:628-648`, `openPlan` machinery stays) → icon tiles: Lucide icon per tile (add an `ICON` map beside `WEDDING_TILE_LABEL` in `lib/taxonomy.ts`), state derived empty/explore/picked(build)/locked/done, count badges, NEXT flag, "Covered X of Y" + SVG progress ring.
- Urgency order: `timelineStatusOf` (`lib/vendors-plan-budget.ts:470`) via the tile→group bridge (`catalogTile` on plan groups / `canonicalServicesForTile` in `lib/vendor-counts.ts`); done sink right.
- Folder heads: "● N locked · N to decide · ＋N more" pills.

### PR-C — Adaptive category set + ⓘ (M)
- Schema: nullable `tile text` column + partial UNIQUE `(event_id, tile)` on `event_category_decisions` (tile-level exclude; plan-group rows keep working). REVOKE-check per default-ACL rule if any new object.
- In-plan set = onboarding-planned tiles (`ShortlistTile.planned`) ∪ tiles with picks/locks − tile-excluded. Folder bottom: "＋ Add to your plan" chips (clears exclusion / adds); per-tile "Not needed? Remove" (writes exclusion; GUARD: refuse if any locked vendor in the tile's categories — toast "unlock first").
- ⓘ on tile rows → group `hint` (`wedding-plan-groups.ts` hints; bridge as PR-B).

### PR-D — Three-action card + lock-on-bench (L)
- Bench `VendorCard` (`shortlist-categories.tsx:810-853` rails): "＋ Add to build" → `setBuildPick` (`build-pick-actions.ts`; multi already supported; hard-single swap = existing `replacesSiblingsOnPin` rules in `lib/build-pick-rules.ts`) · stateful Inquire/"💬 Check inquiry" (thread-existence probe — the `InquiryComposer` existing-thread guard's query, surfaced onto the card; fresh → composer, exists → open thread) · "Lock now — it's final" → reuse `AccordionLockButton` (`accordion-lock.tsx:135`) so conflict gate/date-modal/milestone/undo all carry.
- Collapsed tile rows: locked-vendor-names line; rail-end card: "＋ Add another {tile}" when locked && !hard-single (carries #3789's affordance to the live bench).
- ⚠ SERIALIZE with the Booking session — it owns Card→Details→Inquiry and `v/[slug]` surfaces; `vendors/page.tsx` + card components are HOT. Check `gh pr list` + message that session before starting D.

### PR-E — "Your team" merge (M)
- Right rail: extend `BuildLocked` (`build-locked.tsx`) → locked rows + "In your build — ready to lock" candidate rows (per-row Lock ✓ = `AccordionLockButton`; ✕ = `removeBuildPick`) + "Still needs your decision" list (urgency-ordered `openPlan` doorways) + tiles Date/Location/Locked/In-build/Budget/**Buffer** (buffer = estimated − locked − candidates; estimate from `events.estimated_budget_centavos`).

### PR-F — Plans (M)
- `build-compare.tsx`: rename section "Plans" (`TAB_META` in `lib/budget-build.ts` — label only, key stays `compare`); pinned locked rows identical per column (build on `PlanBuildSnapshot`; `applyBuildToWorking` must not touch locked rows); columns render build candidates; "Save current as a plan" button on Your team (calls `savePlanBuildNamed`). `clearBuildPicks` (currently caller-less — flagged in PR #3790) becomes the "reset candidates" action; if unused after F, delete it then.

### PR-G — Compatibility DIM+DISABLE+SINK (M · ⛔ GATED, see §2)
- Reuse `FitBadges` verdicts (`dateFit==='booked'` ∨ `reachesVenue===false`); stable pre-partition compatible-first (pattern: `category-search.ts:1099`); divider + dim + disable Add-to-build/Lock; "Ask anyway" = the thread path. Budget-over stays soft. Fail-open stance preserved.

## 4 · Verification (every PR) + definition of done
`tsc --noEmit` clean · `next lint` no new warnings · `pnpm run test:unit` (apps/web) green · add/extend unit tests beside the pure libs touched (`checklist-state`, sort partition, in-plan resolution). Runtime: preview link + `testnayan1..5@test.com`/`12345` — **NEVER the owner account** (is_internal comps everything → false-green paywalls). Done = A–F merged flag-dark, owner previews on a flipped preview env, THEN owner flips prod flag; G ships only after the §2 gate.

## 5 · Coordination + hygiene
- Booking session (`local_46eb5ee5…`, "Booking") owns the service Details/Inquiry screens + the `package_item_id→service_id` blocker — already synced via 2 session messages + log rows. Serialize any shared-file work.
- Corpus after each PR: changelog fragment (root `changelog.d/`), DECISION_LOG row on landings worth recording; update `[[project_setnayan_explore_ia_replan]]` memory status as slices land.
