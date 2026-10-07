# Event Details build status — 2026-10-08 (builder EDB) — PAUSED by owner

## Done
- PR #6412 (draft, do-not-auto-merge, autoMerge null) · branch `rd/event-details-three-segments` · SHA b980ad44c · base `claude/event-access-own-section` (#6408). PR-A frame + Event: three segments, Undo/Apply + Finish card + four folds + record-fold retired, Settled ⓘ group, Area dropdown (new `only=region` door on `updateEventMatchCriteria` — the full path would purge BaZi birth data), Costs shown + Plan it myself, Put this away un-boxed. Guard `the-record-is-three-segments.test.ts` sabotaged 2× red. Details tests 51/51 green locally.

## In progress / left on PR-A
- NOT run: typecheck, lint, full unit suite, ci.yml `node …mjs` guards, baselines (heavy lock was held by other sessions). Run them first.
- Side-by-side + word count not delivered. Harness renders exist in scratchpad (not durable); plan was to render the real page.tsx (old and new) with stubbed I/O modules for a true 375 px word count.
- Unnamed guards were re-measured (flag to owner/controller): `event-details-shows-the-map`, `event-access-is-its-own-fold` (EA's), one line of `a-theme-preview-wears-the-palette`.
- Interim: unlocked Date/Venue › jump to the Maker's Info step (Suppliers has no date editor until PR5); unlocked Kind/Guest count open the Event settings sheet.

## Next
- PR-B (Access segment): restyle PeopleWithAccess to the prototype accordions; `lib/supplier-access-by-category.ts` from #6407. **4 s coordinator switch fix:** switch must flip instantly (use `lib/optimistic-switch.ts`, already added), not disable while saving. ⚠ Do NOT Promise.all `setDelegateArea`: it read-modify-writes `permissions_json`, so parallel calls lose updates — use one batched write (a `setDelegateAreas` action, a new export) or sequential saves behind the instant flip. Add the test that the switch moves before the save resolves. Same for helper Edit · Off · View.
- PR-C (Settings): Guest settings on the Guests › Setup writer, Event Hub, Papic, MiniTour, guards.

## Open owner calls
- Is a new `setDelegateAreas` server action OK for the coordinator switch (parallel single writes are unsafe)?
- Accept the re-measured unnamed guards above.
- Coordinator ON excluding Budget/Photos (EA's open question) is still open.
