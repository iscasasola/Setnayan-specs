# Cloud prompts ready for Thu 1 Oct (Thursday account, $250 credit)

How: Claude app → New session → **Cloud** → repo **iscasasola/setnayan-platform** → paste the COMMON RULES + ONE prompt. The local controller merges, batches and deploys. Start **G1–G4 at once** (they touch different code); **G5** after the onboarding engine (G1) merges.

## COMMON RULES (paste first, every time)
```
Model: Opus · effort high. You are a builder in iscasasola/setnayan-platform (Next.js monorepo, apps/web). Read CLAUDE.md at the repo root and obey it. Clone iscasasola/Setnayan-specs and read INTERACTION_RULES.md (one way to ask/choose/navigate/search/do; two looks) plus every DECISION_LOG row named below before coding.
RULES: never merge, never `gh pr merge`, never --admin, never arm auto-merge. ONE PR to main with `gh pr create --label do-not-auto-merge`, then `gh pr view --json autoMergeRequest` and if not null `gh pr merge <n> --disable-auto`. No production migrations (new ones only via `pnpm migration:new`, RLS at CREATE TABLE, pipeline only). No deploys. Plain English; "Event Hub" never "website"; "supplier" not "vendor"; no casual greetings on guest pages; 3+ choices = ONE PickMenu dropdown; no "edit elsewhere ↗"; Pro is ◆ and never blocks trying. Phone first (390 px). Fewest screens; title ≤5 words + one line ≤12 words; details behind ⓘ; no confirm dialogs unless destructive. Changelog fragment only. From apps/web: install, typecheck, lint, every CI guard in .github/workflows/ci.yml, nearby tests (escape brackets with ?). Budgets: shared bundle ≤202KB (0 KB spare — lazy-load, never raise), Maker ≤505KB, server actions ≤1225 (at the ceiling — reuse). RULE 0: find and extend what exists; never a second registry or mechanism. Guards + sabotage once per rule. Report PR + a 3-step phone check card.
```

## G1 — Event onboarding engine + Wedding + simple types
```
SPEC: DECISION_LOG 2026-09-30 "THE SETUP LIVES AT THE END OF CREATING THE EVENT…", "…EVERY SETUP CARD NEEDS AN ANSWER…", "THE EVENT TYPE SHAPES EVERYTHING…", "GUEST-LIST ROLES AND GROUPS FOLLOW THE EVENT TYPE", "APPROVED — THE EVENT ONBOARDING CONCEPT", "BUILD ORDER FOR THE SIMPLIFICATION". Design: prototypes/event_onboarding_concept_2026-09-30_fable.html (sections A, B, W, B-birthday, H1, M).
BUILD: one onboarding engine at the end of create-event, steps chosen by the event-type profile (extend event_type_profiles / EventWords / STAGE_BAR — add the five fields guest_word · gifts_mode · team_first · look_set · camera_default on the same profile). The 7 essentials (name · when · where · photo · look/theme · how guests get in [Ask guests to reply? + personal QRs / one QR for everyone, DECISION_LOG "THE RSVP IS OPTIONAL"] · guests — never re-ask what creation already asked) + 0–2 type steps from the shipped specialty/honoree screens + the Yes/No list (logo · questions · Papic · gifts). Every card needs an answer (quick answers allowed), changeable later. Styled per type. THIS PR: Wedding + Birthday + Hangout + Date + Get-together (simple_event); roles + default groups per type for these. Wake/Corporate/others come in G5. DESIGN: prototypes/event_onboarding_phone_2026-10-01_fable.html (approved; desktop frames at the top). DEFAULTS (DECISION_LOG "ELEVEN OWNER ANSWERS" 2026-10-01): wake = No · One QR for everyone and NO guest-list step; birthday default = No · One QR (host can change); face tagging on by default for every type with Papic (host can turn off). Branch rd/onboarding-engine.
```

## G2 — Venue styles (design → build)
```
SPEC: the controller's 3 venue styles (Photo card = today's, fixed · Full photo with the name over a dark fade · The journey = Ceremony → Reception route with one map, both pins) + a switch "One map for both venues / none". First draw them (static HTML/CSS, the Fable look of prototypes/guest_landing_page_2026-09-30_fable.html) into prototypes/venue_styles_2026-10-01.html and STOP for owner approval in the PR description; build after approval as a Style ▾ on the Venue scene. Branch rd/venue-styles.
```

## G3 — Ship the held step-4 PRs
```
Rebase each onto origin/main, resolve keeping both intents, regenerate generated baselines with their generators, re-run CI to green, keep do-not-auto-merge: #6175 (dropdowns + first-visit tours — add `after=` so it doesn't open alongside the Guest list's Invite tour), #6179 (dead ends), #6180 (supplier paywalls obey the switch — owner OK'd Branches/payment links open to every plan while the flag is off), #6162 (Partner + label handshakes), #6161 (Patiktok: free to use, pay to save/share). One PR each (push to their branches); report each PR's state.
```

## G4 — Lane 2: demo shops, /for-suppliers, region pages
```
SPEC: DECISION_LOG "LANE 2 §2C — ALL FIVE OWNER QUESTIONS ANSWERED". BUILD: (1) a forward data migration setting is_demo = true for SetnaProd and Saysay (count first read-only; pipeline only); Discover's Shops shelf and the marketplace may go empty — say so. (2) /vendors → /for-suppliers with a permanent redirect (keep legal pages' defined term "vendor"). (3) Region supplier pages under the same "≥3 cards from ≥2 shops" rule as the city pages. Branch rd/lane-2.
```

## G5 — (after G1 merges) Onboarding: Wake, Corporate, the rest + wording sweep
```
SPEC: same rows as G1 + the concept's K (wake, solemn skin) and C1 (corporate). BUILD on the merged engine: Wake (who we are remembering; quiet tone everywhere — no confetti/emoji, abuloy/condolences instead of gifts, no RSVP pressure, sensitive photo defaults), Corporate (company name + logo; an event FOR a business pre-fills from the shop), then Reveal · Birthday variants (debut court) · Celebration · Travel · Tournament · Anniversary · Graduation · Reunion · Gala; roles + default groups per type; sweep event-type wording across Hub/Guest list/Your Team. Branch rd/onboarding-types.
```

## G6 — Admin: open an event + reopen its guest list (this account, ~$20 credit)
```
Model: Opus · effort: medium. Repo iscasasola/setnayan-platform, base origin/main, branch rd/admin-event-page. Read CLAUDE.md first. Credit is small (~$20): commit + push WIP early and often so nothing is lost if the session stops.

WHY: the owner cannot open an event or reopen a finalized guest list from admin — today he had to run SQL by hand to unlock one. Build ONE admin event page.

BUILD
1. Page /admin/events/[eventId] (accept the public id S89E-… and the internal id). Shows: name, type, date, hosts (names + emails, linked to /admin/users/<id>), guest counts (total / replied yes / declined), whether the guest list is finalized (events.guest_count_locked_at, events.final_pax, events.guest_list_edit_deadline), Papic face tagging (events.papic_face_mode AND events.face_tagging_declined_by_couple — show "On (couple declined)" when declined; resolveFaceMode in lib/papic-face-mode.ts is the truth), and a per-guest face list (read guest_face_enrollments + guests.face_recognition_excluded; name · enrolled yes/no · excluded yes/no). Every read binds its error and shows "Couldn't load" instead of an empty/zero state — copy the pattern in apps/web/lib/guests-read-is-honest.test.ts.
2. "Reopen guest list" button (ConfirmForm). It must clear guest_count_locked_at AND final_pax AND move guest_list_edit_deadline forward (null it, or +14 days — read lib/guest-list-closed.ts and lib/pax.ts ensureFinalized first; if you only clear the stamp, ensureFinalized re-stamps it on the next visit). Check the row actually updated (.select() the row), redirect with ?saved= / ?error=, write the existing admin audit log. Respect the trigger guard_guest_edits_when_locked (migration 20261215000000).
3. Make setEventFaceMode (app/admin/events/actions.ts) honest: .select() the updated row, redirect with ?error= / ?saved= instead of silently returning.
4. Link to the new page: the event row in app/admin/accounts/_surfaces/events-surface.tsx (name → the page), and the event links on app/admin/users/[userId]/page.tsx.

LIMITS: server actions are AT THE CEILING (1225) — do NOT add a new exported action; add the reopen as a new branch of an existing action in app/admin/events/actions.ts (e.g. one action taking an intent field), or replace one. Shared client bundle has ~0 bytes spare — server components only, no new client code. A new admin page must join four registries or CI fails: ConsoleTable + its CONVERTED list (admin-console-is-one-table.test.ts), regenerate `pnpm admin:map && pnpm admin:jobs` from apps/web and commit the generated files, add ADMIN_NAV_DESCRIPTIONS + ADMIN_NAV_ALIASES, and raise MODEL_CHOICE_CAP in rank-choices.test.ts by what the test says. Word is "supplier", never "vendor", in UI copy. No migration (if you truly need one, stop and say why).

TESTS: a guard test proving (a) reopen clears all three columns, (b) every read on the page has an error branch; sabotage-check it. Run typecheck + the CI guards + unit tests from apps/web. Add changelog.d/rd-admin-event-page.md (SPEC IMPACT: None).

PR: gh pr create --base main; then immediately `gh pr edit <n> --add-label do-not-auto-merge` and `gh pr merge <n> --disable-auto`. Never merge, never --admin. Report the PR number + a 3-step check card.
```

## G7 — Maker first-load diet (~3 KB) so #6205 + #6209 fit (this account, ~$16 credit)
```
Model: Opus · effort: medium. Repo iscasasola/setnayan-platform. Read CLAUDE.md first. Credit is small (~$16): commit + push WIP early and often.

BASE: first run `gh pr view 6211 --json state`. If MERGED → branch rd/maker-diet from origin/main. If not merged yet → branch from origin/rd/train-2026-09-30-midnight (the train; it carries #6207, the Maker's latest +2.3 KB) and say so in the PR body.

WHY: the Maker's first-load JS is at ~504.4 KB of its 505 KB ceiling (apps/web/scripts/check-maker-js-budget.mjs, run in CI after the production build). Two finished PRs can't ship until room is found: #6205 (More Services + phone bar, +1.6 KB) and #6209 (tap-to-type, +0.6 KB). NEVER raise the ceiling.

GOAL: cut the Maker route's first-load JS by ≥ 3 KB (target ≤ 501.4 KB) with NO behaviour change. Also do not grow the shared bundle (≤ 206,848 B, apps/web/scripts/check-bundle-size.mjs — it is at the limit) and do not add server actions (at 1225 ceiling).

HOW: `pnpm build` in apps/web (needs a lot of memory — NODE_OPTIONS as the repo's build script sets), then run check-maker-js-budget.mjs to see the chunk list. Find what the Maker page loads on open that it doesn't need until a tap: sheets/panels/dialogs/pickers imported eagerly → next/dynamic or React.lazy at the tap point; big constant tables/data that can move server-side or into a lazy chunk; duplicate helpers pulled in twice; dev-only code. Measure before/after on the same machine and paste both numbers per change. Each change keeps every existing test green (run the Maker-related tests + typecheck + CI guards from apps/web). Watch for guards pinned to file paths when moving code (grep the test tree for the symbol before moving it).

TESTS: add a small guard only if it protects a lazy boundary you created (e.g. "X is not imported statically by the Maker page"); sabotage-check it. Add changelog.d/rd-maker-diet.md (SPEC IMPACT: None).

PR: gh pr create --base main --draft; then `gh pr edit <n> --add-label do-not-auto-merge`, `gh pr ready <n>`, `gh pr merge <n> --disable-auto`. Never merge, never --admin. Report: PR number, before/after Maker KB, shared bundle bytes, what moved.
```
