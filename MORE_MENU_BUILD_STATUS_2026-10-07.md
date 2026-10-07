# More-menu build status — builder MM (audit `MORE_MENU_PAGES_AUDIT_2026-10-07_fable.md` §3) — ⏸ STOPPED 2026-10-08 (owner: move to the new account)
All PRs DRAFT + `do-not-auto-merge`, auto-merge off. Stacked: step 1 on `rd/maker-button-rule` (#6400, not on main); each next step should branch from the previous step's branch.

## Done
- 2026-10-08 resume: #6411 REBASED onto origin/main (#6400 + #6404 merged) and RETARGETED to `main`; now @1fbb55569 (port baseline regenerated). Guards 41 run: all pass except the 2 build-only ones. Worktree `wt-mm-1` still exists (node_modules installed, .next removed) — reuse it or prune it. Still to do for step 1: the side-by-side PNG (see below), read CI. Then step 2 onward; NEW STEPS BRANCH FROM origin/main now (no more stacking on #6400).
- step 1 · **#6411** `rd/more-menu-1` @20a9f2f9b ("WIP — paused" in title) — Live Watch: More row → `/panood/control/[eventId]` once owned (`lib/our-services.ts` ownedHref); shop window → one "More cameras · Add Live Watch · ₱…" row (same ChoosePlanSheet) + green "Go live" thumb bar; new shared `components/thumb-bar.tsx`, `components/service-rows.tsx`, `ChoosePlanSheet.renderTrigger`; tour `customer_live_watch_v1`; guard `lib/live-watch-is-one-row-not-a-shop.test.ts`; lab `/dev/more-menu-lab?page=live&state=…`. Local: 41 CI guards pass except the 2 needing a build; 10 related unit files 93/93; next lint clean; 2 sabotages caught. CI at pause: 11 pass · 5 pending · 1 skipped. Local tsc never ran (machine at load 50, timed out in the lock queue) — read CI's typecheck.
- ⚠ NOT done for step 1: the side-by-side PNG (`prototypes/more-menu-pages-2026-10-07/built/` is empty) — run the lab (`pnpm dev`, needs apps/web/.env.local) and shoot `?page=live&state=add` (+ tap the row for the sheet, + `state=launch`) at 375 next to `3-live-watch-375.png`. Worktree `wt-mm-1` removed; branch is pushed.

## In progress
- step 2 (Live Watch Set-once rows + Go live · Cut · Camera thumb bar) — NOT started in code. Findings for whoever resumes: the controller (`app/panood/control/[eventId]/page.tsx`, ~2,950 lines) is a fixed no-scroll screen (Unified Spec §4g); its 7 `sn-tile` cards live inside `<SetupSheet>`; the YouTube panel there has NO Disconnect (only the step-1 page has it — guarded by `lib/live-studio-cast-retirement.test.ts`); TransportRow has only Go live/End (cut = tap a camera tile); there is NO "Setnayan mark" control (the mark is entitlement-derived) — the prototype's switch has no setting behind it → needs an owner call or a read-only row; 3 "celebration" strings (status-row fallback, watch-link blurb, join-QR note).

## Next (audit §3 order)
3 Papic boxes → rows · 4 Papic sub-pages → sheets · 5 Patiktok one page, three segments · 6 Setnayan AI — ⛔ NEEDS A MIGRATION (per-capability coverage store, audit says "new per-event coverage store") → stop and get owner/controller sign-off before building · 7 Music Maker · 8 tours (Live Watch's is already in #6411) · 9 honest reads · 10 word guard.

## Open owner calls (audit §4)
- Scope of "Erase data" (Setnayan AI): derived snapshot only, or the DPO review's per-user behavioural data?
- Where the free single-camera Live Watch door lives once the shop window is gone (kept on the page as "Go live" in #6411).
- Whether a Patiktok booth on/off switch exists.
- New from step 2 reading: what the prototype's "Setnayan mark" switch should control (no such setting exists).
