> ⚠ **SUPERSEDED 2026-09-29 for ORDER and PLAN by `WHATS_NEXT_HANDOFF_2026-09-29.md`.** The Apple check is no longer Thursday — it runs LAST (A → C → E → D → B). Kept for history.

# What's next: handoff for the new account (2026-09-28)

> Supersedes `WHATS_NEXT_HANDOFF_2026-09-08.md`. Written by the Redesign Controller at the end of the Event Hub
> redesign weekend (26–28 Sep 2026). **A handoff is not evidence:** re-measure every line with the command beside it
> before acting on it.

## 0. Where to start
1. Repo `CLAUDE.md` → its top block "NEWEST — 2026-09-28". It lists the traps and the owner's Maker rules.
2. Repo `STATUS.md` (refreshed 2026-09-28). It has the measured production state, what shipped, and the open list.
3. `~/Documents/Claude/Projects/setnayan-handoff-src/CURRENT-STATE.md`, newest section on top. It is the controller's running log.
4. `DECISION_LOG.md` rows dated 2026-09-26 → 2026-09-28. These are the owner's rulings on the Event Hub Maker, guest pathway, prints and QR. **Don't re-ask them.**
5. `AFTER_APPLE_BUILD_LIST_2026-09-28.md`: everything deliberately left for after the Apple check.

## 1. The milestone
**Apple check: Thursday 1 Oct 2026, on a NEW account.** Owner, 2026-09-28: *"finish all the builds for the event hub. we will do apple check on thursday on a new account"*.
The owner's own event, **cale-ice** (Indalecio & Claire, 18 Dec 2026), is the real event everything is tested on.

## 1b. Accounts and schedule
The owner has two accounts: **account B resets Thursday 1 Oct** (it restarts the work on Apple-check day); **account A resets Sunday 4 Oct**. Both are near their weekly cap, so nothing runs before Thursday. The day-by-day estimate is in `setnayan-handoff-src/CURRENT-STATE.md` → "ESTIMATED SCHEDULE":
- **Thu — THE APPLE CHECK FIRST** (owner, 2026-09-28: *"when we resume we will prioritize the apple check"*). Run it on the new account before any build starts. Then fix what it finds, together with items 1–2 of §4 (both are Apple-review risks). Items 3–7 come after, as train 2.
- **Fri:** Post Event scenes · STD auto-play · per-letter styling.
- **Sat:** the remaining Event Hub items plus Apple-check fixes.
- **Sun (account A):** submission polish, then the after-Apple list.
- **Budget:** keep to 3 or fewer Opus builders at once.

## 2. Production, measured 2026-09-28 05:25Z
- Serving **`6136cd2`** = `main` (the merge of #6071). Check with `curl -sL https://setnayan.com/api/health`.
- Migration head: **`20271250752713`**.
- 14 events · 152 guests · 21 accounts · 2 supplier shops · 9 orders (6 paid, 2 cancelled, 1 submitted).
- Open PRs: #6072 (this docs refresh), plus two old unrelated ones (#5874, #5911).

## 3. What shipped this weekend
Full list in `STATUS.md` → "The Event Hub redesign — what shipped 26–28 Sep 2026". In short:
- **The Maker edits for real.** Tap an element to change its font, colour, size and In/During/Out motion. A single letter can take its own face on the hero. Every scene is listed, a tap only selects, "+ Add a scene" works, and the toolbars follow Keynote/Pages.
- **The Logo is a layered editor:** Text · Image · Frame. The owner's two-letter I + C logo rebuilds from his two files, and "Draw on" follows the writing path.
- **Each stage does one job.** Scenes drag within a stage. Save the Date offers Film or Photos. Each stage has its own guest bar.
- **Scene backgrounds:** six kinds, each Framed or Full width.
- **The whole guest pathway** is live, including Requests.
- **Also shipped:** Love Story panel = the page's chapters · Pro QR · Find your seat · prints fit + Menu card · Schedule rebuild + announcements + reminder emails 30/7/1 · "Passed away" · two venues.

## 4. Open before the Apple check (priority order)
1. **Remove the stale "coming in the next build" copy.** It lives in `MAKER_COMING_NEXT` (`apps/web/app/dashboard/[eventId]/launch/_components/maker-bar.ts`). Apple-review risk.
2. **FREE vs PRO redraw** (DECISION_LOG "WHAT IS FREE VS PRO IN THE EVENT HUB MAKER — REDRAWN").
   - FREE = design pick, text, size, colour, background colour. PRO = themes + media backgrounds.
   - To build: move colour/size/background colour out of `HUB_CANVAS_LOOK_KEYS` (`lib/hub-look-pro.ts`) and the element-style Pro gates.
   - The ruling didn't cover fonts and motion; ask the owner before moving them.
3. **Finish `rd/no-background-drops-the-card`** (WIP e5c6c2f9c, pushed; checks not run). The Maker canvas hold keeps the Countdown's own card after "No background". Fix: release the hold when `hubBackgroundOwnsBox` flips.
4. **Find your seat's ‹ back** (`app/[slug]/find-seat/_components/seat-frame.tsx`). It must land on the Invitation WITH the Event Bar, and must never navigate the Maker canvas away.
5. **Print previews take ~8 s.** A full-size photo is embedded in the screen SVG. Fixes: downscale in `mode=screen`, cache per input, prefetch the other formats.
6. **The dashboard event card** (`app/_components/event-poster.tsx`, `lib/event-poster.ts`) draws cale-ice as plain paper, not its cover. Use the hub's own look resolver; never a second one.
7. **Theme picker → Maker → Details** as quick visual previews (DECISION_LOG "THE THEME PICKER MOVES INTO THE MAKER'S DETAILS").

**Event Hub items not started** (the owner moved every Event Hub item before Apple; ask him to prioritise):
- Both view
- Post Event scenes (`POST_EVENT_SCENES_BUILD_BRIEF_2026-09-26.md`)
- Seat map scene
- Illustrated palette person
- Save the Date auto-play walking widget scenes
- "Account details win on sync"
- Per-letter styling beyond the hero
- A3 "Our Story" poster
- A "view as a free couple" switch for internal accounts

**Owner is still to provide:** measured Arena/Movie ticket sizes (DECISION_LOG "ARENA AND MOVIE TICKET PASS SIZES — PENDING").

## 5. Traps (each cost real time; details in repo `CLAUDE.md`'s newest block)
- **Every PR regenerates `apps/web/scripts/port-control-baseline.json`.** When a sibling merges first, the others go DIRTY, and each re-sync costs a full ~50-minute CI. Pause the siblings, or fold them into ONE merge train.
- **Something on the shared GitHub account arms or merges PRs unasked.** After opening any PR, verify with `gh pr view <N> --json autoMergeRequest`.
- **Internal accounts are fully Pro (§10a).** To see what a free couple sees, test on `testnayan1`.
- **On cale-ice, never press Apply, Undo or Restore, and never type into it** when testing: those change the owner's real draft. (Its undo history measured empty on 2026-09-28, so the old "M & J" step is gone.)
- **Builders never drive the owner's signed-in Browser pane.**
- **A bracketed test path passed alone (`app/[slug]/…`) runs zero tests.** Run the full unit suite before calling a train green.
- **Keep one watcher only.**
- **Weekly usage:** Opus builders burn the week fast. At ~97%, stop and hand off; never downgrade the builder model. Fable designs and plans; Opus builds.

## 6. How the owner works
- Plain English, harsh and direct. One question at a time, with a recommendation.
- **Every build reaches him as a CHECK CARD:** what changed · link · ≤3 steps · what you should see · phone screenshot · "reply ok". Send it only after the controller has tested the build himself in the browser on cale-ice.
- UI copy says "Event Hub" (never "website") and "supplier" (never "vendor").
- Deploy only through `gh workflow run deploy-prod.yml --ref main`, which applies migrations first. Confirm READY on Vercel, never from GitHub.
