# Hand-off — 10 October 2026 (account at 98 % of its week) · READ THIS FIRST

Written by the controller session at the owner's request ("maximize until before you reach 99 % … then make a documentation").
A hand-off is not evidence: re-measure with the commands given before acting. Running log with every step and every
correction: `~/Documents/Claude/Projects/controller-2026-10-08/CONTROLLER-NOTES.md` (the last ~40 entries).

## 0 · THE OWNER'S PRIORITY (verbatim, 2026-10-10)
> "what we are building is the connection os the supplier and user on their events. we cannot invite vendors if the event
> supplier's page, event hub is not working"

**Order:** Event Hub working → Event Suppliers page working → supplier dashboard → invite vendors → admin dashboard (after
the Apple check). Do not reorder the supplier dashboard ahead of the Event Suppliers page to reach revenue sooner.

## 1 · LIVE NOW — `64746f0` (check: `curl -sL https://www.setnayan.com/api/health`)
Merged this week: #6458 (speed), #6468 (the new Maker's toolbar, guest list, Studio pages, Scrub dark), #6469 (glass row),
#6470 (Seat plan Done button), **#6471** (10 Oct 02:48 UTC): RSVP stage per element (Edit · Style = Font ▾ / one colour
circle + picker / Size slider · card Background None·Plain·Frosted · Animate · card settings in Card › Edit), Exit preview on
RSVP, Animate on four fixed blocks (Wedding March · The details · E-Gifts · Happening now), The Day + Post Event panels,
Seat plan table sheet, Scrub fixes.
- The new Maker is behind `NEXT_PUBLIC_MAKER_STAGES_STUDIO_ENABLED` (NOT set: internal accounts only, phone only). Setting
  it = every couple gets the new Maker = the owner's explicit yes, never assumed.
- Scrub ships DARK: `apps/web/lib/scrub-out-offered.ts` `SCRUB_OUT_OFFERED = false`.
- NOT verified on live by anyone: anything signed in on a real event; a real iPhone. The controller never opens the Maker on
  the owner's real event (opening it can write his draft).

## 2 · BUILT, ON THE LOCAL REVIEW COPY ONLY — not on GitHub, not live
Review copy: worktree `~/Documents/Claude/Projects/wt-review`, branch `review/local-2026-10-08`, head **`611edc07e`**; the
owner looks at it on `http://localhost:3480` (start: Browser pane `preview_start name="review-local"`; first compile ≈ 2 min).
Merge a builder commit with `controller-2026-10-08/merge-into-review.sh <sha>`. Every branch below is LOCAL (unpushed) in its
own worktree — **do not prune these worktrees**:

| What | Branch (worktree) | Head | Seen |
|---|---|---|---|
| Test page draws the real Wedding March + Dress code | `rd/lab-real-march-and-dress` (wt-lab-real) | `f253050fc` | builder's pictures |
| **Event Suppliers page**: the four drafts merged onto today's main | `rd/suppliers-on-main` (wt-suppliers-now) | `a73bb03fc` | controller at 375: `/dev/suppliers-lab`, `?open=catering` |
| Real guest page rendered with sample data + byte-for-byte guard | `rd/site-body-fixture-render` (wt-sitebody) | `7ae4c46d8` | guard 5/5 |
| Background on the four fixed blocks | `rd/fixed-blocks-background` (wt-block-bg) | `5bbc74c19` | March + E-Gifts in the lab |
| Maker first-load give-back (three moves) | `rd/maker-first-load-give-back` (wt-giveback) | `41b2e044e` | MEASURED, below |
| Your seat + Digital pass get real Background + Animate | `rd/sample-blocks-get-real-looks` (wt-sample-blocks) | `bce47fb7d` | lab samples only |
| Plate ink fix (latent fault) + guard | on review itself | `e0c048f7b`, `5fefc5ef1` | Chromium, lab |
| Scrub: the cover as hand-over zero (lab + generated pages only) | already live in #6471, dark | — | lab |

- **MEASURED 10 Oct 06:07 UTC, real build of review `8f391b67b`: Maker first load 502.5 KB of 507.0 — 4.5 KB of headroom**
  (it was 0.1 KB on live `64746f064`). Re-measure with `scratchpad`-style script: real `next build` in `wt-train-b` under
  `heavy-lock.sh`, then `node scripts/check-maker-js-budget.mjs`. The build drops exports no client code uses (so only code a
  LAZY client module imports out of a first-load module is worth moving); `lib/maker-parts.ts` is NOT first-load.
- **KNOWN RED on review (fix before any batch):** `lib/the-name-style-reaches-every-formal-surface` test — the lab's
  `app/dev/maker-lab/guest/lab-sample.ts` calls `buildEntourage(…)` without the event's Name style.
- **⚠ REVIEW HOLDS THE SUPPLIERS PAGE.** A batch built from review would change the live Suppliers page for couples. Not
  before the owner's look and his approvals. A batch WITHOUT Suppliers must be assembled from the other branches above.
- Local-only config: `wt-review/apps/web/.env.local` has `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED=true` (lets `/dev/suppliers-lab` draw).

## 3 · WHAT IS LEFT, IN THE OWNER'S ORDER
### A. Event Hub — to "working"
1. Owner looks at the live Maker on his own event (RSVP stage; hold ▶ → Exit preview; Invitation › Details › Wedding March ›
   Animate; Post Event). Then his decision on the switch for couples.
2. Next batch (his go): the review branches above minus Suppliers, after fixing the known red.
3. RSVP ＋ / drag / Group — prototype approved (`prototypes/maker_rsvp_add_drag_group_2026-10-09.html`), record
   `Maker_RSVP_Per_Element_Add_Drag_Group_LOCKED_2026-10-09.md` (§3 rulings, §5 the sums). Needs a migration raising the
   CHECK on `events.rsvp_ask_config` (owner said yes; builder's sums: CHECK 24,576 B, app refusal 19,000 B, max 4 added lines
   per screen — the migration's own db test must measure `pg_column_size` of the worst case first). HARD PART: the reply
   card's lines are not one list in the page (legend / fieldset / a run-time hint slot) → the reply card must be restructured.
4. Sample blocks: Your seat + Digital pass DONE (review). **Photos of you STOPPED** — its root is the gallery's dark card
   with light-on-dark words; None/Frosted would break contrast. Owner/controller call: rule the re-inking, or allow
   Animate-only (a change to the pinned `ownTool` line). Then Announcements (drawn in `app/[slug]/layout.tsx`), What to
   wear (needs a name on its root), Live hub (two sibling sections — needs a wrapper). Map:
   `controller-2026-10-08/NEXT-ACCOUNT-MAPS-2026-10-10.md` MAP 2. FOUND: the Me tab is not a "chapter" — a timed Build in
   there plays when Me opens, not on scroll.
5. Scrub → live: `Maker_Scrub_HANDOVER_2026-10-09.md` (updated 10 Oct). The blocker is gone: `renderSiteBodyFixture()` in
   `apps/web/lib/site-body-fixture-render.ts` + golden. Next: wire `HubCoverHold` into the invitation's guest tree (two
   `PahinaMasthead` branches), prove byte-for-byte, then Save the Date, a real iPhone, count stored scrub scenes, flip on
   the owner's go.
6. Smaller: Prints' six controls · seat counter template · other glass rows · Home's Journey + Preparation list · entrance
   videos "plays once" · real Post Event scenes on the lab · two new camera looks (unapproved proposals) · a line's Edit on
   RSVP has no Earlier/Later/Remove row · "You're editing ·" dropped on three parts where it fits.
7. Ten older GitHub drafts the owner said may ride a batch: wish list #6435 #6440 #6444 #6463 (the two bottom ones CONFLICT)
   · reveal #6464 · story fence #6467 · Maker reload #6445 (CONFLICTS) · CI #6457 #6460 #6461. Superseded, close: #6434 #6442
   #6427 #6428 #6446 #6447.

### B. Event Suppliers page — to "working" (full state: `controller-2026-10-08/SUPPLIERS-PAGE-STATE-2026-10-10.md`)
- BUILT (drafts #6422 #6425 #6455 #6459; merged clean onto main locally, 5,194 tests + tsc green): the one-screen shell
  (Find · Build · Booked, date · place line, cart peek), Find (rows, state words, service cards, verbs, More to compare),
  the supplier sheet.
- NOT BUILT: "Add your own" (screens + one migration: `event_manual_vendors.leak_match_vendor_profile_id`,
  `platform_settings.fee_leak_price_tolerance` — **the tolerance number is the owner's, never invented**) · PR3 Build · PR4
  Booked + Budget (drafts #6439 #6441 #6449 exist) · PR5 date/place sheets + tour · PR6 booking-fee rules (held for
  `BOOKING_FEE_RULES_AUDIT_2026-10-07.md`).
- WAITING ON THE OWNER: approvals 1–10 (+8b, 11, 12) of `SUPPLIERS_PAGE_CHECK_2026-10-07_fable.md` — listed to him 10 Oct,
  not answered; the deviations in `SUPPLIERS_BUILD_STATUS_2026-10-08.md`; his look at `localhost:3480/dev/suppliers-lab`.
  The lab has no fixtures for the Build and Booked tabs.

### C. Supplier dashboard
Prototype approved. Drafts #6443 (foundations — CONFLICTS with main) + #6450 (Today is rows). 14 deviations in
`SUPPLIER_DASHBOARD_BUILD_STATUS_2026-10-08.md` for the owner. Everything after those two steps: not built.

### D. Before the Apple check (`ROADMAP_TO_APPLE_CHECK_2026-10-06.md` §2, §5, §6 — dated 6 Oct, re-measure each item)
In-app purchase (owner 8 Oct: before the check; map `controller-2026-10-08/IAP-MAP.md`, six owner questions open) · the
after-test fix queue (PGRST002 retry, /guests uuid bug, supplier fixes, guests desktop table + import, iPhone batch 3, Home
and money labels, the "celebration" → "event" sweep) · launch watchdog on a real iPhone with a hanging connection · native
sign-in setup · first-visit tours (the last feature) · address renames · simulator + in-app-webview walk · build 1.0 (5).

### E. After the Apple check
Admin dashboard (Fable design + prototype of 8 Oct exist, NOT approved, nothing built) · native camera · the rest of roadmap §7.

## 4 · OWNER RULINGS STILL OPEN (ask once, plainly)
Suppliers approvals 1–12 · the Suppliers fee-leak tolerance number · the new-Maker switch for couples · Photos of you
(re-ink vs Animate-only) · Plain on a bare block is the hub's SQUARE plate (rounded?) · Font on an RSVP line = fixed faces vs
the Look's four roles · Dress code prints hex codes beside colour names for guests · 40-px pills → 44 app-wide · Powered by
Setnayan movable/hideable · a switched-off Post Event scene disappears (prototype dimmed it) · the IAP six · Scrub's cover:
the gap under the cover on the first screen, the tall cover.

## 5 · TRAPS FOUND THIS WEEK (each cost real time)
- **Measure on live before saying what guests see.** The controller told the owner "every plate has been broken since 25
  Sep" from a lab measurement; one browser read of the live sample event showed the plates fine (the look pins the plate's
  ink; the fault needs it unset). Latent, not live.
- **The lab's stand-ins hide things from the owner** (no Wedding March, placeholder Dress code and Post Event tiles) — he
  cannot judge what the lab does not draw. Prefer real components on fixtures.
- **Folder-wide guards are missed by per-file test runs**: the colour sweep, numbers-carry-commas (cost one 80-min CI
  round), best-man/best-woman, name-style, the lazy-only list, the controls baseline. Run every test under `apps/web/lib/`
  that mentions the area, or expect CI to find it.
- **A lab save that calls the server action directly redirects to sign-in** a few seconds later — go through the work
  area's draft door (`draftDoor()` in `stage-panel/camera-look.tsx`).
- **A browser snaps a tap in a small gap onto the nearest button** — never rely on gaps to pick a group; the card's own
  paper works.
- **Never take built CSS text apart to find selectors** (an `@media` block reached `querySelectorAll`).
- **A stacking layer can cover a portalled button** (Exit preview under the RSVP stage's z-30 layer) — check
  `elementFromPoint`, not just "it is in the DOM".
- **The Mac (16 GB) is the limit, not the tokens**: one heavy job at a time through `heavy-lock.sh`; a builder's dev server
  left running stalled the others (load 40–100, swap 15 of 16 GB). Dev servers only while taking pictures.
- **Two builders in `stage-tools.tsx`** collide on the `toolWorks` / `ownTool` / `setStagePanelNow` / `editOn` lines and on
  the guards that pin them — keep pinned lines word for word, add beside them.
- **`gh pr merge --match-head-commit` needs the FULL SHA**; a wrong one is refused (safely).
- **Controller clock**: several note timestamps were guesses; trust the ones marked "real clock".

## 6 · OPERATING RULES THAT STILL BIND
Draft PRs + `do-not-auto-merge`; merge only when every check is green AND on the owner's explicit go; batches, one upload;
warn before a deploy (an open live Maker reloads). Never apply a migration by hand; never run the ledger repair. No
passwords, keys or accounts by the controller. Production and the owner's events: read-only. Write to the owner in plain
English; show every UI change at phone size; lead with the verdict. Builders: Opus for building, Sonnet for extraction and
mechanical work, local only, each in its own worktree, small whole commits.
