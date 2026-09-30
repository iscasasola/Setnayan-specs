# Cloud session prompts — Oct 3 (The Day + Post Event) and the guest landing page

How: Claude app → New session → **Cloud** → repo **iscasasola/setnayan-platform** → paste ONE prompt per session. Run **A, B, C at the same time** (they touch different code). Run **D only after A's PR has merged** (same guest pages). Each opens a PR labelled `do-not-auto-merge`; the local controller merges and deploys.

COMMON RULES (in every prompt): Model: Opus · effort high. Read CLAUDE.md at the repo root and obey it. Never merge, never `gh pr merge`, never --admin, never arm auto-merge; ONE PR to main with `gh pr create --label do-not-auto-merge`, then run `gh pr view --json autoMergeRequest` and if it is not null run `gh pr merge <n> --disable-auto` (a repo workflow arms PRs). Never apply a migration to production; new migrations only via `pnpm migration:new`, RLS at CREATE TABLE, Ugat map rule. Never deploy. Plain English; the couple's page is the "Event Hub", never "website"/"site"; "supplier" never "vendor"; any set of 3+ choices is ONE shipped PickMenu; no "edit elsewhere ↗" links; Pro is ◆ and never blocks trying. Phone first (390 px). No casual greetings on guest pages. Changelog fragment `changelog.d/<branch-slug>.md` only. From apps/web: `pnpm install --frozen-lockfile`, typecheck, lint, every CI guard script in .github/workflows/ci.yml, nearby tests (escape `[[]slug]`). Maker budgets: `scripts/check-maker-js-budget.mjs` ≤ 505KB, shared ≤ 202KB — never raise; new Maker UI lazy inside an existing chunk. Every rule you implement: a guard test + sabotage once. Read the named DECISION_LOG rows in the spec repo `iscasasola/Setnayan-specs` (clone it) before coding. Report: PR number + a 3-step phone check card.

---

## A — The guest landing page + the ticket's seat on the day
```
[COMMON RULES above]
SPEC: Setnayan-specs DECISION_LOG rows (2026-09-30) "THE PERSONAL LINK OPENS THE GUEST'S OWN LANDING PAGE", "THE TICKET GAINS THE SEAT ON THE DAY · A NEW OR CHANGED TICKET POPS UP FIRST WITH SAVE", APPROVED DESIGN (build this look exactly): `prototypes/guest_landing_page_2026-09-30_fable.html` (frames 1, 1b Messenger bar, 2a–2c, 3–6) and the row "APPROVED — THE FABLE DESIGNS…". The ticket is the Fable 3:4 ticket component.
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

---

## E — (after #6185 merges) The guest card + Guest list rows redesign
```
[COMMON RULES above]
SPEC: Setnayan-specs DECISION_LOG rows (2026-09-30) "APPROVED — THE FABLE DESIGNS FOR THE GUEST CARD, THE GUEST LIST ROWS AND THE GUEST LANDING PAGE" and "WALKING TOGETHER IS NOT BEING A COUPLE". APPROVED DESIGNS (build this look exactly): `prototypes/guest_card_invite_simple_2026-09-30_fable.html`, `prototypes/guest_card_details_2026-09-30_fable.html`, `prototypes/guest_list_rows_2026-09-30_fable.html`.
EXISTS: guest card `app/dashboard/[eventId]/guests/_components/guest-card-body.tsx` + `guest-card-data.ts` + `guest-detail-body.tsx` + `guest-access-control.tsx` + `invited-to-chips.tsx`; SendInvite + the Invite column (`send-invite.tsx`, `shareInvite`, #6185 — sends the Digital Ticket image); list rows `_components/guest-list-multiselect.tsx` (`DesktopRow`, `MobileListRow`, `SelectionBar`), `mobile-guest-carousel.tsx`, `app/dashboard/[eventId]/guests/page.tsx`; PickMenu; lib/formal-name.ts.
BUILD the three designs: card top (ticket thumb → full view + Save ticket; ONE Invite; ⋯ = Write to NFC · New QR (confirm; rotates the key like Unlink) · Unlink account; status line; QR look removed from the card), name open (five parts, Prefix dropdown), all else collapsed sections with toggles / dropdowns / checkmark dropdowns (extra roles + groups editable; Table dropdown in place); RSVP = Attending · No reply · Not coming; no email anywhere; no "walks with" on the card. Rows per the rows design (Sort ▾, dropdown filters, counts, Invite · ⋯ + status, +1 indented, long-press select + bulk bar Invite selected · Set group ▾ · Set table ▾ · ⋯, requests strip, masthead "Share the link"). Reuse every existing server action; the server-action count is at its 1225 ceiling — add none unless you merge/remove another.
Branch: rd/guest-card-and-rows-redesign.
```

---

## F — (after E merges) Top bar searches guests · Hosts pieces move · parts row removed
```
[COMMON RULES above]
SPEC: also `docs/handoff-2026-09-30/CHECKIN_COLUMN_AND_PARTS_ROW_PLAN.md` (branch claude/charming-rubin-vgwpii / main after #6191) and DECISION_LOG "HOSTS FOLD — THREE OWNER ANSWERS"; Setnayan-specs DECISION_LOG 2026-09-30 "GUEST LIST: ACCESS + CHECK-IN BECOME COLUMNS; HOSTS FOLDS INTO THE GUEST LIST; THE TOP BAR SEARCHES GUESTS", and the design file `docs/handoff-2026-09-30/GUEST_LIST_ACCESS_AND_HOSTS.md` (now on main) sections "A · Top bar searches the guest list" and "B · … Hosts pieces move, parts row removed" (items 2 and 4; items 1 and 3 — Check-in column and phone column picker — were built in E). Prototype `build-sessions/prototypes/guest_list_access_2026-09-30.html`.
BUILD exactly as that file specifies: (A) a `guests` search scope — on the Guest list the top bar drives `?q=`, ⌘K back to the top bar, the in-page row becomes Add only (capture bar + Filter), phone in-page search removed only if the phone top bar shows search there; extend the named guards, never loosen. (B2) move every Hosts piece to its listed new home (helper grants + colour access under the Limited helper's Access line on the Guest card; activity to each card + a short Overview feed; "promote your booked coordinator" to Your Team's planner workspace with its RA 10173 consent gate; old email invites retire) — move/re-export actions, never duplicate (server actions at the 1225 ceiling); account for every moved control in the port-controls baseline. (B4) remove the Guests · Hosts · Check-in parts row LAST; old `?gview=hosts|checkin` and `/hosts` links redirect to the Guest list (check-in → `/guests/checkin` stays for the door crew); a helper without guest-list access lands on their own grants view, never a 404.
ALSO (DECISION_LOG "THE FIRST VISIT TO THE GUEST LIST ASKS WHICH KIND OF LIST"): the first time a host opens an event's Guest list, a pop-up "Who can reply?" — Only people on my list / Anyone, I approve — writing the existing Who-can-RSVP setting, shown once per event, before the Invite tour (MiniTour `after=`).
Branch: rd/guest-list-search-and-hosts-fold.
```
