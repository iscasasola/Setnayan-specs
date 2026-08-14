# Ready-to-paste session prompts — the website adjustments · 14 August 2026

The list they execute: [`WEBSITE_ADJUSTMENTS_2026-08-14.md`](WEBSITE_ADJUSTMENTS_2026-08-14.md).

**Ten sessions · four rounds · up to four at a time.**

| Round | Sessions | Why they can share a round |
|---|---|---|
| **1** | **1 · 2** | Session 1 is the dependency for 3·4·5·9 and must land first. Session 2 shares no file with it. |
| **2** | **3 · 4 · 5 · 6** | Four different trees. No shared file. All need session 1 merged. |
| **3** | **7 · 8 · 9** | 7+8 are Marketplace-only; 9 deletes what 3·4·5 stopped using. |
| **4** | **10** | Alone — the big one. |

🛑 **NEVER pair two sessions that edit the same file.** The 44-defect run was ten sessions on
overlapping files, all auto-merging. **The number was never the problem; the overlap and the
unwatched merge were.**

🛑 **IN A PARALLEL ROUND, DO NOT ARM AUTO-MERGE.** This *overrides* the standing
`gh pr merge --auto --merge` default. Push, open the PR, report, and **stop**. A human looks first.
Sessions running alone (1 in round 1, 10 in round 4) may arm it as usual.

---

## SHARED HEADER — paste this at the top of EVERY block below

```
Read /Users/icecasasola/CLAUDE.md and ~/Documents/Claude/Projects/Setnayan/CLAUDE.md first.

RULES THAT OVERRIDE YOUR DEFAULTS:
- RULE 0 — FIND IT BEFORE YOU BUILD IT. This project is ~2 years old. Assume what you are
  asked for ALREADY EXISTS and your job is to locate and extend it. The "ALREADY SHIPS"
  lines in your block were read out of origin/main 3ca1af296 and the live DB on 2026-08-14
  so you do not have to re-derive them — but CONFIRM anything you are about to change.
- A DOCUMENT IS NOT EVIDENCE — including this prompt, and including a doc's own status
  line. This week a status line was wrong in BOTH directions: a closed gate still reading
  "open" (twice), and shipped work still reading "not built" for a month. Verify against
  shipped code and the live production database (Supabase njrupjnvkjkitfctetvi).
- RULE 0 APPLIES TO PLANS TOO. Before writing a new design, grep the corpus for one that
  already exists. A fresh Marketplace plan was commissioned on 2026-08-13 for a surface
  whose IA design had been written on 2026-07-27 and said the same thing.
- A rejected query is not a thrown error. A phantom column, enum value, function argument,
  a blocked iframe or a missing grant all fail the same way: THE ONLY SYMPTOM IS AN ABSENCE.
- Trace a feature to its WRITE, not its flag. Five times now something shipped complete
  with nothing anywhere able to switch it on.
- Branch FIRST (`git branch -f <name> origin/main`), THEN `git worktree add`. NEVER work in
  the shared main checkout — it holds ~96 uncommitted files from another session. Read
  current code with `git -C /Users/icecasasola show origin/main:<path>`.
- Prune your worktree the moment your PR merges (~1.6 GB each).
- Add a changelog fragment in the ROOT changelog.d/. Do NOT edit CHANGELOG.md or STATUS.md.
- A guard must be able to FAIL. Sabotage it and PRINT THE OCCURRENCE COUNT before and after
  — an unmeasured mutation proves nothing. A file-level count cannot say which component
  still renders a thing. Anchor with \b: `foo` matches `DISABLED_foo`.
- A script that prints "ok" without measuring proves nothing. Assert your anchor, then count.
- pnpm build CANNOT run on this machine (~7 GB heap). CI is the only valid build claim.
- Verify a merge landed with `git merge-base --is-ancestor`, and verify a migration reached
  production BY QUERYING THE OBJECT — never schema_migrations.
- Reply to the owner in PLAIN ENGLISH: what a PERSON experiences. No file paths, function
  names, table names, SQL or flag names in your answer to him.
- Do not touch pricing, locked SKUs, or anything the owner has locked. Surface, don't change.
```

---

# ROUND 1

---

# SESSION 1 · The sidebar stops being something you leave
### 🔴 THE DEPENDENCY. 3 · 4 · 5 · 9 all build on this. Runs first. May arm auto-merge.

```
Convert the couple's own account pages to the persistent sidebar — the FIRST and smallest
slice of the one-shell conversion. Plan: ~/Documents/Claude/Projects/Setnayan/
ONE_SHELL_PLAN_2026-08-13.md. Drawing: prototypes/one_shell_2026-08-13.html (walk it).

WHAT A PERSON GETS: they sign in, and the site does not change shape. The same left rail
they saw signed-out is still there, now carrying their events, their Alaala, their story,
and — if they hold them — their shop and Setnayan HQ. Pressing anything keeps the rail.

SCOPE: desktop only (>=1024), ~15 screens — the events board and the account spokes.
The phone keeps its bottom bar; that is the locked signed-in grammar and converting it
would be a regression.

ALREADY SHIPS — DO NOT REBUILD:
- app/_components/frontdoor/front-door-shell.tsx already accepts `children` into its content
  column by design. GENERALIZE IT IN PLACE: parameterise the rail groups and add a slot for
  a per-surface context group. It is NOT a new component.
- Its data already comes from fetchUserRoleSummary() + isAdminProfile() — the shop row and
  the admin row and their capability gates all ship (PRs #4426/#4427).
- app/_components/nav/match-path.ts is the SHIPPED path matcher. Use it.
- SidebarShell has exactly THREE real mounts (event / admin / vendor layouts). Earlier
  counts of 16 and 20 were string hits in comments, CSS and tests. You are not touching it.

🔴 THE DEFECT THIS SLICE MUST FIX: the front-door rail has NO active-route logic — `Home` is
hardcoded data-on="true". Ship the chrome without wiring match-path and ALL 296 PAGES LIGHT
"HOME". Nothing throws. Write a guard that fails if any rail row's active state is a literal.

🔒 THIS REVERSES AN OWNER LOCK, DELIBERATELY. dashboard/(launcher)/layout.tsx and
dashboard/(account)/layout.tsx are chrome-less by the 2026-06-14 retirement and owner
rulings 2026-07-09/13 ("we do not want side bar and menu bars here"). The owner superseded
that on 2026-08-13. It is logged in DECISION_LOG.md — cite it in the PR body so no future
session "restores" the chrome-less launcher.

TRAPS:
- The native apps can NEVER reach `/` (middleware bounces Capacitor/Tauri off marketing
  paths, owner-locked 2026-06-10). Mount the shell IN the layouts. Never "route through /".
- Below 1024 the rule is bottom-bar-only. The front-door top bar renders at all widths on
  `/`. NEVER render both.
- Render labels through getNavSlotMap() or admin label edits silently stop applying on
  desktop while mobile still obeys them — two answers to one question.
- Extending the session-reading shell to blog/realstories/doorways SILENTLY DE-CACHES them.
- Three background sweep jobs ride on `/`. Dropping one stops anniversary digests with no
  error anywhere.
- At the 72px width the icon strip hides counts. Decide it; don't discover it.

STOP AT: the ~15 account-level screens. Do not touch the event, vendor or admin trees —
those are sessions 3, 4 and 5 and they start the moment yours merges.
```

---

# SESSION 2 · Five doors for one product become one
### Runs beside session 1. Shares no file with it. Do not arm auto-merge.

```
Consolidate the website add-ons into a single "Your Website" card. OWNER-APPROVED
2026-08-14 ("yes. same as the menu on admin and shop") — this is sign-off #2 of
~/Documents/Claude/Projects/Setnayan/Event_Studio_Replot_Council_Verdict_2026-07-17.md,
open since 17 July. Read that verdict; the design is already decided there.

WHAT A PERSON GETS: one card that says "Your Website", instead of five cards that are all
the same product. Every old link still works.

ALREADY SHIPS — VERIFIED 2026-08-14: apps/web/lib/add-ons-catalog.ts carries FIVE website
doorways — save-the-date · rsvp · editorial · website-pro · landing-page. addOnHref
('landing-page') resolves to the /website hub and a second resolver sends the same key to
/website/editor. The unified editor itself is DONE (Design_Unified_Website_Editor_2026-07-25/).
You are consolidating DOORWAYS, not building a website feature.

BUILD:
1. One free "Your Website" card. The four parts become chips inside it.
2. 301 every retired doorway to it, params preserved. NOTHING may 404 or soft-404.
3. Then the TAB-1 REFILE that this sign-off gated: Mood Board + Seat Plan + 3D Plan move out
   of "Branding" (they are planning/layout tools, not identity). Sign-off #1 approved
   2026-07-17; the refile never shipped because it waited on #2. It is unblocked now.

TRAPS:
- The catalog is read by more than the Studio hub. grep every consumer before deleting a
  key — a REMOVED CATALOG ENTRY LEAVES RAW SLUGS on surfaces you did not look at.
- A retired SKU can render ₱0 rather than disappearing. Check what a deactivated entry does
  before assuming it hides.
- Do NOT change any price. The council's own 2026-07-17 pricing correction is already
  applied; re-deriving prices from a doc is how stale numbers come back.
- Verify the 301s by FETCHING them. A status code is not a page — read the body.

STOP AT: doorway consolidation + the refile. Do not touch the editor or any other tab.
```

---

# ROUND 2 — all four need session 1 merged. None may arm auto-merge.

---

# SESSION 3 · Inside an event, under one sidebar

```
Convert the event tree (~110 screens) to the shared chrome from session 1. Plan:
ONE_SHELL_PLAN_2026-08-13.md. Drawing: prototypes/one_shell_2026-08-13.html — open an
event in it; that is the target.

WHAT A PERSON GETS: opening a wedding no longer swaps the whole page furniture. Their own
rows stay where they were and the event's own menu appears underneath them.

ALREADY SHIPS — DO NOT REDRAW: customer-nav-config.ts is the SSOT and gives THREE named
sections — Plan (Overview · Guests · Marketplace · Studio) · Go live (Launch, gated on the
website surface) · Also in this event (Schedule · Seat plan · Budget). Every row is a PLAIN
LEAF ("solid menu with no submenus", owner 2026-07-15). Budget is deliberately NOT a
top-level menu (owner removed it 2026-07-10). template.tsx already provides route
transitions. The mobile bottom nav already ships.

THE OWNER LOOK THIS SESSION CARRIES: the rail PUSHES the event group with the account rows
still visible, rather than swapping wholesale. This is the ONE place the new ask diverges
from the approved seam prototype. Build the push; flag it for his eye in the PR body.

TRAPS:
- sn-vt-page / data-shell-main: SidebarShell wraps content at ALL widths. The mobile nav
  slide freezes everything except that element and docked-subnav padding keys off it. A
  "desktop-only" swap that removes SidebarShell REMOVES THEM AT MOBILE WIDTHS TOO.
- The seat plan 2D/3D has a LOCKED coordinate contract. Verify the canvas math is
  container-relative BEFORE you change its container.
- Full-bleed working surfaces stay full-bleed inside the content column: website editor,
  seat plan, Live Studio control, day-of mode.
- Do NOT convert the /[slug] guest sites (11 routes). Those wear the couple's own mood-board
  theme. Guests are not "in the app". No rail, ever.

STOP AT: chrome only. Zero route moves. No page body redesign — that is session 6.
```

---

# SESSION 4 · Your shop, under one sidebar

```
Convert the vendor dashboard (63 screens) to the shared chrome from session 1. Mechanical
repeat of session 3 — read that block for the shared traps.

WHAT A PERSON GETS: a supplier moving between their shop and their own account never
changes product.

ALREADY SHIPS — DO NOT REDRAW: vendor-sidebar.tsx is FIVE destinations, owner-locked
2026-07-12 ("overview, my shop, my customers, my performance, BEO are all 1-page each with
the different features integrated on that page"): Overview · My Shop · My Customers ·
My Performance · On the Day (BEO). Do NOT re-add children; every former sub-surface lives
as a tab inside its hub and the old routes redirect in with params preserved.

TRAPS:
- The role filter gates by ITEM KEY. Keep keys 1:1 or deep links, the agent/viewer scoping
  and localStorage section state all break at once.
- Overview uses a SENTINEL matchPrefix so a startsWith match cannot keep it perpetually lit.
  Preserve that behaviour when you wire the shared active-row logic.
- /vendor-dashboard admits owner OR team member. Any row you gate on ownership alone will
  vanish for staff who can legitimately open it.

STOP AT: chrome only.
```

---

# SESSION 5 · The console, under one sidebar

```
Convert the admin tree (108 screens) to the shared chrome from session 1. Internal only —
no customer ever sees it, so this is the lowest-risk of the four and may slip a round.

ALREADY SHIPS — DO NOT REDRAW: admin-nav-groups.tsx gives SIX groups, rendered FLAT as six
top-level rows (owner 2026-07-15, "solid menu with no submenus"): Overview · Accounts ·
Studio · Ugat Console · App Performance · Money & Settings. "All surfaces" is a LINK to
/admin/more and is deliberately NOT a seventh group. Keep it that way.

🔴 THE TRAP THAT BITES SILENTLY: ~10 background sweep jobs ride on admin/layout.tsx. Drop an
`after()` line in a rewrite and retention sweeps and digests stop WITH NO ERROR ANYWHERE.
Move them verbatim and write a guard that counts them.

STOP AT: chrome only.
```

---

# SESSION 6 · The three Overview pieces paused in July

```
Finish the deferred phases of ~/Documents/Claude/Projects/Setnayan/
Event_Overview_Council_Verdict_2026-07-12.md § Build phases. Phases 1 · 2 · 3 · 7 SHIPPED.
Read the verdict; the design is already decided there. This is body work, not chrome —
it does not collide with session 3.

BUILD:
- Phase 4 — shape-honest widgets: a budget mini-donut and a segmented guest RSVP bar in
  place of bare numbers. The `--urgent` token is already reserved.
- Phase 5 — event-type breadth: per-type plan-group and role maps. TODAY NON-WEDDINGS GET A
  PLAINER COUNT; the event-word fallback prevents the bug but the maps were never built.
- Phase 6 — day-of takeover: on the day itself the planning dashboard RECEDES and the page
  leads with the live grid + a jump to /live.
- Fold the AI "What's next" rail into the Decisions board. One list, not two.

🔒 DO NOT TOUCH THE SINGLE HERO CARD. Owner 2026-05-22 (Headspace pattern): it was five
cards, correctly priority-sorted, and hosts FROZE in front of five buttons. The reason is
now written onto the surface itself. Do not "improve" it back into a grid.

TRAPS:
- The day-of window has ONE definition (lib/day-of-mode.ts, -12h..+36h, timezone-aware). A
  second copy once computed ±24h from a UTC-midnight date and disagreed by up to 36 hours,
  so the bottom nav swapped to day-of mode while the Guests stage it points at stayed muted.
  DELEGATE; do not restate.
- progress-stages.ts MIRRORS the Overview's current-stage resolution deliberately. Change
  one and you must change the other or Home and Progress disagree about where a couple is.
- Run the suite under Asia/Manila AND a western timezone. CI runs in UTC, the one clock
  where date-vs-instant mistakes cancel out.

STOP AT: the Overview body.
```

---

# ROUND 3 — 7 and 8 are Marketplace-only; 9 needs 3·4·5 merged. None may arm auto-merge.

---

# SESSION 7 · The Marketplace — reachable, warm, and wide enough

```
Slices B1 · B2 · B3 · B5 of ~/Documents/Claude/Projects/Setnayan/
MARKETPLACE_FOUR_TABS_PLAN_2026-08-13.md. READ ITS § 0 AND § 1 FIRST — they list what a
previous brief got wrong. They are ONE session because they all touch the same two files.

🔴 THE TWO THINGS THAT WILL MISLEAD YOU:
1. THE FOUR "TABS" ARE NOT TABS. Since 2026-07-09 this is ONE SCROLL of four stacked
   sections — bench left, a sticky 380px rail holding team -> plans -> payments. The desktop
   tab strip was REMOVED 2026-07-15. ?tab= and BB_TAB_EVENT still work but SCROLL, never
   swap. Rebuilding panel-switching is the paid-twice mistake.
2. THE NAMES ARE DECIDED. "Plans" and "Payments" have been live since the owner flipped
   them on 2026-07-28. Not an open question.

BUILD:
- B1 · a masthead + four section chips IN THE PAGE, reading tabLabel(), wired to the
  EXISTING anchors and bus. WHY THIS MATTERS: with the old mobile dock gone, a couple ON A
  PHONE SCROLLS THE ENTIRE BENCH TO REACH THEIR MONEY.
- B2 · the warm-editorial look the Overview got 2026-08-08, applied class-level with NO
  logic change. Plus one honesty string: the premium crest currently tells EVERY couple they
  are on a premium tier, because the paywall is off and so aiActive is true for all events.
- B3 · MOVE "YOUR PLANS" OUT OF THE 380px RAIL at lg+ — full width under the bench. A
  side-by-side table cannot live in a narrow column. ⚖ THIS IS THE OWNER LOOK. Anchors, bus
  and keys resolve by id, not DOM position, so they are unchanged.
- B5 · an anchored-date line per plan column: "everyone in this plan is free on your date" /
  names who is booked. Today's footer only renders for year/month-precision events, and
  BOTH real prod events are day-precision — so it is currently unreachable, not broken.
  Reuse getBatchVendorAvailableDays; the per-vendor data is already computed for the bench.

TRAPS:
- Everything merged here is IMMEDIATELY VISIBLE (flag ON in prod, no preview buffer). Ride
  isExploreReplanEnabled() branches; flag-OFF must stay byte-identical.
- KEYS NEVER CHANGE: ?tab= values, #svc-* anchors, BB_TAB_EVENT, ?open=, ?inspect=.
  Labels go through tabLabel()/tabBlurb() ONLY.
- Do NOT add .sn-col to this page. Asked twice, refused twice — the 380px rail makes the cap
  subtract from the bench.
- The team chip is NOT a <SubNav>. A test forbids the import. It borrows geometry only.
- ?open= mechanics look redundant and are NOT. Do not "simplify" them.
- Build and Plans have ZERO prod rows because nobody has used them, not because they are
  broken — every writer was traced. Empty is not evidence.
- Do NOT let new copy promise the supplier-agrees step. It does not exist yet (session 10).

STOP AT: these four. Do not touch the payments math (session 8) or any bench mechanic.
```

---

# SESSION 8 · One calculator, two money screens

```
Slice B4 of MARKETPLACE_FOUR_TABS_PLAN_2026-08-13.md § 3.3. Small, self-contained, and it
is ORDERING-CRITICAL.

WHAT A PERSON GETS: nothing visible today — and that is the point. Without this, the moment
the newer budget math is switched on, TWO SCREENS BOTH CALLED "your money" PRINT DIFFERENT
NUMBERS FOR THE SAME WEDDING.

THE FACT: the in-page payments lens computes from the legacy summary in lib/budget.ts while
/dashboard/[eventId]/budget reads resolveEventMoney in lib/budget-truth.ts behind
NEXT_PUBLIC_BUDGET_TRUTH_ENABLED. BUD-1/2/3 shipped; BUD-4..10 are unbuilt (verified live:
event_vendor_line_items.vendor_id is still NOT NULL, so no vendor-less costs exist yet).

BUILD: MerkadoBudgetLens reads resolveEventMoney behind the same flag, with the SAME
degrade-to-legacy rule budget/page.tsx already uses. Run scripts/budget-parity.ts before and
after and put both outputs in the PR body.

🔴 THIS MUST LAND BEFORE ANYONE FLIPS THAT FLAG. Say so in the PR body.

OWNERSHIP RULE (settled, § 5 of the plan): the in-page lens owns paid-so-far, progress,
next dues, and ONE doorway — read-only, always. The /budget page owns the target,
allotments, itemization, manual lines, logging payments and export. The lens NEVER
re-declares an editor control. The phone gets no fourth Budget doorway (owner-settled
2026-07-30).

STOP AT: the lens. Do not redesign it — session 7 owns its look.
```

---

# SESSION 9 · Retire the old sidebar
### Needs 3 · 4 · 5 merged. Confirm with `git merge-base --is-ancestor` before starting.

```
Delete app/_components/nav/sidebar-shell.tsx, its collapse-state key, and the Atelier glass
that has no consumers — now that the event, vendor and admin trees all wear the shared
chrome from session 1.

BEFORE DELETING ANYTHING: count the real consumers. Earlier counts of 16 and 20 mounts were
STRING HITS IN COMMENTS, CSS AND TESTS; there were three. Print the count of real imports
before and after.

DO NOT delete the legacy PlanBudgetAccordion or fold the Explore replan flag. Both are named
in the Marketplace plan as deliberately NOT sliced — the accordion is the kill-switch path
and the flag gates an entire wave, not two labels.

TRAPS:
- sn-vt-page / data-shell-main are consumed by the mobile nav slide and docked-subnav
  padding at ALL widths. If sessions 3/4/5 preserved them, keep them. Verify, don't assume.
- Run the full suite. A deleted component with a live test is a red CI, not a silent pass.

STOP AT: the deletion. No behaviour change should be visible to anyone.
```

---

# ROUND 4

---

# SESSION 10 · A lock that asks the supplier
### 🔴 THE BIG ONE. Alone. Plan before you build — it has 14 open plan defects.

```
Build PR-H, the vendor-agrees step. Spec: ~/Documents/Claude/Projects/Setnayan/
PR_H_Lock_Request_Handshake_BUILD_SPEC_2026-08-04.md. All four owner answers are already in
it. BUILD FROM THAT SPEC ONLY.

WHAT A PERSON GETS TODAY, AND WHY IT IS WRONG: a couple presses Lock and the supplier is
BOOKED OUTRIGHT — while the words around the button promise the supplier agrees first. The
owner ruled 2026-07-27 that a lock is a REQUEST. Handshake steps 1, 3, 4 and 5 all ship;
STEP 2 DOES NOT EXIST. build-locked.tsx carries the literal empty-slot comment where its
tracker belongs.

🔴 DO NOT START CODING. The spec's own adversarial review left 14 HIGH plan defects open,
and the FIRST one is that the vendor cannot reach the page the agree card was specced onto.
RE-PLAN THOSE 14 FIRST — use Fable — and report the revised plan before writing code.

TRAPS:
- ONE LOCK PATH: AccordionLockButton -> finalizeVendor. Every gate rides it. Do not add a
  second.
- max_soft_holds_per_date is enforced at lock but HAS ZERO WRITERS, and the vendor-settings
  route its own column comment names does not exist. Do not surface "N holds left" anywhere
  until a writer exists — that is the sixth gate-with-no-handle sitting on this exact path.
- A forward primitive with no inverse: whatever this writes, ask at write time what un-does
  it. An auto-block with no counterpart once left a vendor reading BUSY forever.
- The couple's Lock and the vendor's agreement are two sides of one state machine. Constrain
  it in the POLICY on both INSERT and UPDATE — a guard attached to one verb is not a guard.

STOP AT: the handshake. Deposit-at-lock stays flag-dark; it is a separate owner call.
```
