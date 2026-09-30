# Cloud session prompts — Oct 3 (The Day + Post Event) and the guest landing page

How: Claude app → New session → **Cloud** → repo **iscasasola/setnayan-platform** → paste ONE prompt per session. Run **A, B, C at the same time** (they touch different code). Run **D only after A's PR has merged** (same guest pages). Each opens a PR labelled `do-not-auto-merge`; the local controller merges and deploys.

COMMON RULES (in every prompt): Model: Opus · effort high. Read CLAUDE.md at the repo root and obey it. Never merge, never `gh pr merge`, never --admin, never arm auto-merge; ONE PR to main with `gh pr create --label do-not-auto-merge`, then run `gh pr view --json autoMergeRequest` and if it is not null run `gh pr merge <n> --disable-auto` (a repo workflow arms PRs). Never apply a migration to production; new migrations only via `pnpm migration:new`, RLS at CREATE TABLE, Ugat map rule. Never deploy. Plain English; the couple's page is the "Event Hub", never "website"/"site"; "supplier" never "vendor"; any set of 3+ choices is ONE shipped PickMenu; no "edit elsewhere ↗" links; Pro is ◆ and never blocks trying. Phone first (390 px). No casual greetings on guest pages. Changelog fragment `changelog.d/<branch-slug>.md` only. From apps/web: `pnpm install --frozen-lockfile`, typecheck, lint, every CI guard script in .github/workflows/ci.yml, nearby tests (escape `[[]slug]`). Maker budgets: `scripts/check-maker-js-budget.mjs` ≤ 505KB, shared ≤ 202KB — never raise; new Maker UI lazy inside an existing chunk. Every rule you implement: a guard test + sabotage once. Read the named DECISION_LOG rows in the spec repo `iscasasola/Setnayan-specs` (clone it) before coding. Report: PR number + a 3-step phone check card.

---

## A — The guest landing page + the ticket's seat on the day
```
[COMMON RULES above]
SPEC: Setnayan-specs DECISION_LOG rows (2026-09-30) "THE PERSONAL LINK OPENS THE GUEST'S OWN LANDING PAGE", "THE TICKET GAINS THE SEAT ON THE DAY · A NEW OR CHANGED TICKET POPS UP FIRST WITH SAVE", prototype `prototypes/guest_landing_page_2026-09-30.html` (frames 1–6, 2a–2c).
EXISTS (verify): personal link → `app/[slug]/redeem/route.ts` → `/[slug]` → unreplied guests redirected to `app/[slug]/invite/reply` (DoorShell + RsvpWidget), thank-you `invite/enter`; ticket `app/[slug]/_components/guest-ticket.tsx`, `ticket-picture.tsx`, `lib/pass-card.ts`, `lib/pass-card.server.ts`, `app/api/guest/pass-card/route.ts`; `TICKET_SHOWS_TABLE` in `lib/print-layout.ts`; seat rule `lib/guests-may-see-seats.ts`; theme door skins `app/[slug]/invite/_components/themes/*`, `hub-door-skin.tsx`; invite message `lib/guest-invite-message.ts`.
BUILD: the personal link opens ONE landing page (reuse DoorShell + the couple's theme) in this order: the couple's message (name as given) · "Reply to the invitation" (→ existing RSVP screens; hidden once replied, small "Change my reply" stays) · the Digital ticket (faded + "Reply to confirm your ticket" before Yes; full + "Save my ticket" after Yes; none after No) · "Your guests · Send their invite" · How to use it (3 lines) · "Open the invitation" (→ Welcome · Details · Our Love Story · Me). After submitting the RSVP, return to this page. A new or changed ticket (new QR key, request accepted, +N changed, seat added on the day) pops up first with Save, once per ticket fingerprint. From 00:00 Manila on the event date the ticket (screen, PNG, print) shows table/seat via guests-may-see-seats (replace the constant false). In-app browsers (Messenger/Facebook/Instagram UA): reply works in place; Android offers an intent:// jump to Chrome/app; iPhone shows a one-tap "Open in Safari / Open in the Setnayan app" bar; "Save my ticket" there reads "Open in Safari to save". Guards: page order; RSVP button hidden after reply; ticket states; seat only from the day; pop-up once per version; in-app bar only in in-app UAs.
Branch: rd/guest-landing-page.
```

## B — Auto-seat: sponsors together, families together, roles by choice, then groups
```
[COMMON RULES above]
SPEC: Setnayan-specs DECISION_LOG rows (2026-09-30) "AUTO-SEAT: SPONSORS TOGETHER, BOTH FAMILIES TOGETHER, THEN GROUPS" and "AUTO-SEAT: THE COUPLE CHOOSES, PER ROLE, 'SIT TOGETHER' OR 'SIT WITH THEIR GROUP'".
EXISTS (verify): `app/dashboard/[eventId]/seating/actions.ts` `autoSeatGuests` / `autoArrange` → `computeAutoSeat` in `lib/seating.ts` (role-tier rings nearest the stage, primary group clustering, `floorPlan.priority_order`, `groupAdjacency`, role sets via `resolveRoleSetForEvent`), `lib/seating.test.ts`, the seating editor `seating/_components/seating-editor.tsx`, couple role words `events.role_names`.
BUILD: (1) all principal sponsors (+pairs) at ONE table, overflow to the fewest ADJACENT tables, never scattered; (2) immediate family of BOTH sides at ONE shared table (same overflow); (3) per-role choice for each entourage role set (Bride's/Groom's Crew, flower girls & ring bearers, secondary sponsors…): "Sit together" (default) or "Sit with their group", one toggle per role in the Auto-arrange panel, using the couple's role words, stored with the floor plan's existing auto-seat settings (no new table unless none fits); (4) everyone else by primary group, a group at one table where it fits, split only across neighbouring tables; plus-ones beside their bringer; never move hand-seated guests; couple + sweetheart table untouched. Pure-function tests in lib/seating.test.ts for each rule + sabotage.
Branch: rd/auto-seat-sponsors-families-groups.
```

## C — Post Event: land the held Post Event / scene-styles work
```
[COMMON RULES above]
SPEC: Setnayan-specs DECISION_LOG rows "POST EVENT … BECOMES SCENES" (2026-09-24) and the scene-styles rows; MAKER_REPLAN_PLAN_2026-09-30.md "CUT BY THE OWNER" (do NOT build anything on that cut list).
EXISTS: open PR #6166 (train n: #6153 Stage D event menu + #6156 scene styles & Post Event), branch rd/train-2026-09-29n — its CI failed "typecheck + lint" and it is now behind main (main just took the Oct 1 release train #6181, which changed the Maker, Welcome/menu labels and budgets).
DO: new branch rd/post-event-onto-main from origin/main; merge origin/rd/train-2026-09-29n into it; resolve conflicts keeping BOTH intents (main's Oct 1 release wins on guest pages, menu labels "Welcome · Details · Our Love Story · Me", RSVP stage, Page ▾ dropdown); regenerate baselines with their generators (never hand-merge); fix the typecheck/lint failure at the source; fit the Maker budget without raising it. Open ONE PR to main (not to the old branch). Say which parts of #6153/#6156 are in and anything you had to drop.
Branch: rd/post-event-onto-main.
```

## D — (after A merges) Each menu tab is its own full page + The Day menu
```
[COMMON RULES above]
SPEC: Setnayan-specs DECISION_LOG rows (2026-09-30) "EACH MENU TAB IS ITS OWN FULL PAGE", "THE GUEST MENUS, NAMED", "THE DAY'S MENU HAS FIVE: LIVE · WELCOME · CAMERA · GALLERY · ME", "THE INVITATION'S HOME IS THE GUEST'S OWN PAGE".
EXISTS: the day-of hub `app/[slug]/_components/hub/hub-shell.tsx` + `app/[slug]/hub/page.tsx` (one route, bottom menu toggles full-screen panels); the long page `app/[slug]/_components/site-body.tsx` with anchors from `app/[slug]/_lib/site-nav.ts` (`resolveSiteNav`); Welcome section `guest-welcome.tsx` (self-contained); the Maker's Page ▾ reads resolveSiteNav.
BUILD: Invitation = Welcome · Details · Our Love Story · Me, The Day = Live · Welcome · Camera · Gallery · Me — each tab its OWN full page that scrolls on its own, reusing hub-shell (no second shell); each tab keeps its own address (deep links land on the right tab); Welcome on the day = their table + look + reminders + E-Gifts; Me = the ticket. Keep keys home/details/story/me. The Maker's Page ▾ shows the chosen tab's page. No RSVP slot in the bar.
Branch: rd/each-tab-its-own-page.
```
