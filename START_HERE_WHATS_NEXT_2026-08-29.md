<!-- The front door for the Claude account dedicated to "what's next". Written 2026-08-29 because
the auto-loaded CLAUDE.md carries SIX blocks labelled ACTIVE and only ONE is open work — which is
exactly the confusion that makes a session rebuild something that already ships. Triage below is
measured, not remembered. -->

# START HERE — the "what's next" account

**You are the account dedicated to picking up unfinished work.** This file exists so your first
ten minutes are not spent working out which of 56 `WHATS_NEXT_*` files and six blocks marked
ACTIVE is the real one.

---

## § 1 · THE ANSWER: there are TWO open streams — the story is the live one

> 🔴 **CORRECTED 2026-09-09.** This section said *"there is ONE open stream"* and named Papic 3–7.
> That was true the day it was written (2026-08-29) and is **false now.** A fifteen-session build of
> **the story and the Story Maker** began 2026-09-07 and has been the whole machine's work since —
> eight of its fifteen sessions merged and served on 2026-09-09 alone. A session following the old
> answer today would be sent to the wrong stream: **the exact failure this file exists to prevent,
> one iteration later.**
>
> 🔑 **The lesson § 2 teaches about `CLAUDE.md`, turned on this file.** A front door holding
> yesterday's answer is worse than no front door, for the same reason a stale `ACTIVE` label is:
> both send a fresh session somewhere confidently wrong. **Whoever starts a stream adds it here in
> the same commit; whoever finishes one strikes it here in the same commit.**

### ▶ Stream A — THE STORY & THE STORY MAKER · **the live one**

Folder: [`Design_Editorial_By_The_Minute_2026-09-07/`](Design_Editorial_By_The_Minute_2026-09-07/).
Read `00_BUILD_README.md`, then **`09_SESSIONS_AND_PROMPTS_2026-09-09.md`** — the fifteen sessions
with their ready-to-paste prompts, dependencies and lanes. `08_Build_Order.md` carries the
acceptance criteria per step.

**Every state below was verified with `gh pr view` on 2026-09-09, not copied from a register** —
that register's own header warns this corpus has been wrong about a PR's state five separate times.

| # | What a person gets | State (verified 2026-09-09) |
|---|---|---|
| S1 | A photo lands on the minute it was **taken**, not uploaded | ✅ MERGED #5332 |
| S2 | The day's own photos fill the day | ✅ MERGED #5329 |
| S3 | Guests' photos stay guests-only until the host publishes | ✅ MERGED #5331 |
| S4 | The five things not stored yet (columns only) | ✅ MERGED #5330 |
| S5 | One desk instead of four screens | ✅ MERGED #5337 · #5338 |
| S6 | Nothing the shipped editor can do is lost, plus the theme | ✅ MERGED #5346 |
| S9 | The story becomes a clock | ✅ MERGED #5342 |
| S10 | The light moves morning → night, the room lights up | ✅ MERGED #5349 |
| **S8** | **Publish — three states, consent, the number stamped once** | 🔶 **OPEN #5364 — in review** |
| S7 | A cover picture, and naming the next celebration | ⏳ waits on S8 |
| **S11** | The index, search, Relive, "were you there?" | 🔨 **IN PROGRESS 2026-09-09** — branch `claude/s11-find-anything-in-the-day`. **Do not start; the page lane is held.** |
| S12 | The last word, the back cover, print and share | ⏳ waits on S7 |
| S13 | Every celebration that is not a wedding, incl. a wake | ⛔ unblocked by dependency, but **the page lane is held by S11** — wait, or take Stream B |
| S14 | A guest changes their mind after publish | ⏳ waits on S8 |
| S15 | Supplier reach; No. 2 opens on No. 1 | ⏳ waits on S7 · S12 |

⛔ **LANES — AND THIS IS NOT ADVICE, IT COST AN HOUR ON 2026-09-09.** Two sessions independently
wrote the same six-stage light derivation into the same file path; they merged thirteen minutes
apart, `main` went red on the tripwire one of them had left, and **three other sessions' merges
failed** on it before it was collapsed (#5353). Two lanes, one session each:

* **the host's desk** — S6 → S8 → S7 → (S14)
* **the public page** — S9 → S10 → S11 / S13 → S12

Before starting either, run `gh pr list --state open` and check nobody is holding that lane.

### ▶ Stream B — PAPIC, items 3–7 · open, and nobody is on it

**Handoff, self-contained:
[`WHATS_NEXT_Papic_Items_3_7_HANDOFF_2026-08-29.md`](WHATS_NEXT_Papic_Items_3_7_HANDOFF_2026-08-29.md)**,
then [`WHATS_NEXT_Papic_Build_Order_2026-08-29.md`](WHATS_NEXT_Papic_Build_Order_2026-08-29.md).
It assumes no memory files exist, inlines every house rule, and pre-answers RULE 0 per item.

> 🔴 **CORRECTED AGAIN, 2026-09-09, LATER THE SAME DAY — AND THE MISTAKE IS WORTH MORE THAN THE
> TABLE.** When this section was rewritten a few hours earlier, the rows marked ✅ were verified
> with `gh pr view` and the rows marked **open were copied forward untouched.** That is exactly
> backwards: a "done" claim that is wrong costs a re-read, a **"still open" claim that is wrong
> costs a session rebuilding shipped work** — the failure this whole file exists to prevent.
> Measured against the LIVE DATABASE and `origin/main`, **items 3, 4 and 5 had all shipped.**
>
> 🔑 **VERIFY THE ROWS THAT SAY "OPEN" HARDEST.** They are the ones that send somebody to work.

| # | What | State — measured 2026-09-09 against the live DB and `origin/main` |
|---|---|---|
| 1 | The browser stops enforcing a limit that does not exist | ✅ MERGED #5002 |
| 2 | Say what is already true, on the promotion page | ✅ MERGED #5003 · #5007 |
| **3** | **Shots per guest** (+ sponsors default to a bigger share) | ✅ **SHIPPED — all three tiers live.** `papic_guest_spend_ceiling()` in production implements tier 1 (named guests, `papic_guest_spend_ceilings`), tier 2 (the couple's figure *or* a derived equal share), tier 3 (the release button **and** the automatic late release, derived not scheduled). `papic_record_guest_capture` meters `SUM(points_cost)`, yields the pool gate only when no ceiling is set, and carries an owner ruling dated **2026-08-31** — *after* this handoff was written. The couple's control ships (`guest-allotment-picker.tsx`, `guest-allotments-choice.tsx`), the guest's low state and honest refusal ship (`capReason === 'guest_spend_ceiling'`), and the sponsor default ships (`AllotmentRole`). ⚠ **CORRECTED 2026-09-11: that last clause was HALF TRUE** — only a *suggested* opening number in the couple's picker shipped; nothing enforced it, and it read the sponsors page, which is empty in prod. **The enforced sponsor default is PR #5418 (2026-09-11).** |
| **4** | Timed challenges reach the wall | ✅ **SHIPPED.** `lib/papic-challenge-clock.ts` + `papic_challenge_is_open()` in the database, on an owner ruling dated **2026-09-01**: the window is RELATIVE, opens when armed, and **expiry closes the prompt, never the shutter.** |
| **5** | Challenges hang on the ceremony sequence | ✅ **SHIPPED.** `lib/papic-ceremony-sequence.ts` (+ its test) joins the prompt library to `KWENTO_MOMENTS`, with a run-of-show screen. |
| **6** | **The guest chooses per audience** | ⚠ **UNVERIFIED — CHECK BEFORE STARTING.** Face-choice work exists (`lib/couple-face-choice.ts`, `face-choice-readable.test.ts`) but that is the COUPLE's choice; whether the GUEST can choose per audience was not established. **Measure it before writing anything.** |
| **7** | The year — one pot across a linked group | 🔶 **PRIMITIVE ONLY (7a).** `20271189765490_event_cluster_primitive.sql` adds `event_clusters` + `event_cluster_members`. **No screen, no shared pot.** The project is open. |

⇒ **The real open work in Stream B is item 7 (a project), and item 6 once somebody measures it.**
Items 3–5 are done; do not start them.

🔑 **Stream B touches none of Stream A's files**, so it is the safe pick when both story lanes are
held — which, on 2026-09-09, they usually were.

---

## § 2 · 🛑 THE SIX "ACTIVE" BLOCKS IN `CLAUDE.md` — ONLY ONE IS OPEN WORK

The auto-loaded corpus `CLAUDE.md` carries six blocks headed `▶ ACTIVE`. **Five are finished
streams or standing rules that never had the label removed.** Triaged 2026-08-29 by reading each
block's own claims.

⚠ **THIS TRIAGE IS OF `CLAUDE.md`'S SIX BLOCKS ONLY — AND IT IS NOW INCOMPLETE IN THE OTHER
DIRECTION.** The story build (§ 1, Stream A) has **no block there at all**, so the auto-loaded
context does not mention the work that has occupied every session since 2026-09-07. A stale label
sends a session to finished work; a *missing* one hides live work. Both are how a session starts
without the plan.

| Block in `CLAUDE.md` | Really? |
|---|---|
| **Papic: the build order** (2026-08-29, line ~68) | ✅ **OPEN WORK — this is Stream B.** Items 3–7. ⚠ It was the *only* open stream when triaged on 2026-08-29; Stream A began 2026-09-07 — see § 1. |
| **The supplier's room** (2026-08-27, ~117) | **FINISHED.** S1–S5 built; the Answers Desk shipped as PR #4917, merged and served. Its own remaining item (the weak-signal venue, § H) it calls *"its own project"*. |
| **Papic is the event's one media library** (2026-08-26, ~466) | **SUBSTANTIALLY FINISHED** — nine PRs shipped. Anything left is in its contract § 3c, not in this block. |
| **A rejected query is not a thrown error** (2026-08-07, ~1586) | **NOT A WORK STREAM — a lesson.** Its own second line: *"6 PRs merged, 1 closed as superseded."* Keep reading it; do not treat it as a queue. |
| **Papic timing — three numbers** (2026-08-07, ~2325) | **NOT A WORK STREAM — a standing rule.** Three interlocking retention/capture numbers. Obey it; there is nothing to build. |
| **TIME — and the class of bug behind it** (2026-08-04, ~2468) | **NOT A WORK STREAM — a lesson.** Its 17 defects shipped in PRs #4095 · #4098 · #4101 · #4105. |

🔑 **Why this matters more than it looks.** The owner's stated number-one complaint about new
sessions is that *"they start without the plan, rebuild things that already ship, and produce
errors."* Six competing ACTIVE labels is exactly how that happens. **A block that keeps its ACTIVE
label after it finishes is worse than no block at all** — it sends a fresh session to build
something twice.

⇒ **If you finish a stream, strike its label in the same commit.** And when you read an ACTIVE
block, check its own body for PR numbers and ✅ marks before believing the heading.

---

## § 3 · HOW TO VERIFY ANYTHING — the three rules

This corpus is large, fast-moving and sometimes wrong about itself. These three make it safe:

1. **Read the OBJECT, not the migration.** To learn what a database function does, read its live
   body out of production — never the migration that created it. Functions get replaced; applied
   migrations are never edited, so their comments rot in place. **A migration comment is not
   evidence.**
2. **Read `origin/main`, never a local checkout.** `git fetch`, then
   `git worktree add --detach ~/Documents/Claude/Projects/wt-read origin/main`. A stale checkout
   produces confidently wrong answers *with real line numbers*.
3. **A merge is not a ship.** Production self-reports its commit at
   `https://www.setnayan.com/api/health`. Check it is the commit you think.

**And one about emptiness:** production is pre-launch — a handful of celebrations, no paid orders,
zero face enrolments, zero push subscribers. **Zero rows means nobody has used it yet, not that the
feature is missing.** Grep for the WRITER before concluding anything is unbuilt.

---

## § 4 · THE HOUSE RULES THAT HAVE EACH COST REAL WORK

1. **Branch, then `git worktree add` beside the repo** (`~/Documents/Claude/Projects/wt-<name>`).
   **NEVER in `/tmp`** — a finished, proved change was lost exactly that way on 2026-08-28, with
   zero commits ever made. **Push the moment it typechecks.**
2. **`pnpm install` in the worktree first.** A run in an uninstalled worktree means nothing.
3. **Print the typecheck's exit code beside the error count.** An empty `tsc` log is **not** a
   clean one — it aborts at **134/144**, and two concurrent typechecks cause exactly that.
4. **Require `# tests` to be NON-ZERO.** Zero-tests-zero-failures is byte-identical to success and
   exits 0. ⚠ `npx tsx --test` on a path containing `[brackets]` matches nothing and prints a green
   zero — run the file by bare path with no `--test` flag.
5. **Mutation-test every guard, printing the occurrence count before → after.** If a well-formed
   sabotage reports GREEN, **suspect the sabotage before the guard.** ⚠ An *append* mutation does
   not move its anchor's count — measure the string it actually adds.
6. **Strip comments before matching in a source guard** — docblocks here quote the defect verbatim,
   so a raw match finds the disease and calls it the cure.
7. **`git fetch` before building.** Other sessions work this repo concurrently; `origin/main` moved
   three times during one planning session.
8. **Changelog fragment in `changelog.d/`** — never edit `CHANGELOG.md` or `STATUS.md` directly.
9. **Auto-merge is the default** (`gh pr merge <n> --auto --merge`) — except anything touching
   money logic, which opens as DRAFT for the owner to look at.

---

## § 5 · HOW TO TALK TO THE OWNER

**Plain English, and about what a PERSON EXPERIENCES — never the plumbing.**

✅ *"Your cousin scans the poster, shoots 20 photos, they reach you — but she can't get photos of
herself."*
❌ *"The self-link is keyed on `guest_id`, so a seat-holder without a session cookie can't reach the
pool gallery."*

**No file paths, function names, table names, SQL or flag names in the reply.** They belong in the
PR body. He steers product, pricing, scope and risk — he is not reading the code.

**Decide and act.** He removed the old "here's what I recommend next" closing block on 2026-08-04:
*"can you keep going instead of telling me what you recommend doing next. can you do it. and
decide."* Escalate only real owner territory — locked prices, scope, risk trade-offs, or reversing
one of his own locks.

---

## § 6 · WHAT IS OWNER TERRITORY — do not scope these as builds

- **The coordinator partner offer.** The strongest local rival wins coordinators with a business
  system — white-label page, client dashboard, booking funnel, resale margin, a monthly fee. **We
  have nothing.** It is the biggest strategic hole we have and it is a business decision.
- **Whether Papic is bundled into the vendor subscription** — a pricing call.
- **Anything that moves a locked price or SKU.**

---

## § 7 · WHAT NOT TO START, AND WHY

1. ⛔ **Messenger / Viber delivery.** Web push is **already built, mounted, wired to 108 emit sites
   — and has never had a single subscriber in production.** Ask for push at the moment a guest
   scans the QR at the venue first: the best permission moment this product will ever get, zero
   policy risk, already built. Only after that is Messenger worth its Meta-policy risk.
2. ⛔ **Anything already shipped.** Before designing, grep for the feature noun in `apps/web`. The
   owner has paid more than once to have a page rebuilt that already existed. Five times in one
   week something the market calls *"nobody has this"* turned out already built here and merely
   unconnected — the Filipino sponsor roles, the ceremony sequence, offline capture,
   screening-before-display, and the live wall being free.
3. ⛔ **Claims on any public page** from the prohibited list in
   [`PAPIC_PAGE_BRIEF_FOR_CHAT_2026-08-29.md`](PAPIC_PAGE_BRIEF_FOR_CHAT_2026-08-29.md) § 3 — no
   latency figure, no per-guest limit before it ships, no *"the service closes after six months"*,
   never *"unlimited uploads"*.

---

## § 8 · THE DOCUMENT MAP

**Start with these, in this order:**

1. **this file**
2. **Stream A** — [`Design_Editorial_By_The_Minute_2026-09-07/00_BUILD_README.md`](Design_Editorial_By_The_Minute_2026-09-07/00_BUILD_README.md)
   then [`…/09_SESSIONS_AND_PROMPTS_2026-09-09.md`](Design_Editorial_By_The_Minute_2026-09-07/09_SESSIONS_AND_PROMPTS_2026-09-09.md)
3. **Stream B** — [`WHATS_NEXT_Papic_Items_3_7_HANDOFF_2026-08-29.md`](WHATS_NEXT_Papic_Items_3_7_HANDOFF_2026-08-29.md) — the open stream, self-contained
4. [`WHATS_NEXT_Papic_Build_Order_2026-08-29.md`](WHATS_NEXT_Papic_Build_Order_2026-08-29.md) — the ordering and the reasoning
5. [`WHATS_NEXT_Shots_Per_Guest_2026-08-28.md`](WHATS_NEXT_Shots_Per_Guest_2026-08-28.md) + [`…_SESSIONS_…`](WHATS_NEXT_Shots_Per_Guest_SESSIONS_2026-08-28.md) — item 3 in full

**Reference, when you need it:**

- [`PAPIC_PAGE_BRIEF_FOR_CHAT_2026-08-29.md`](PAPIC_PAGE_BRIEF_FOR_CHAT_2026-08-29.md) — what may
  and may not be claimed on either Papic surface, plus the design locks and the exact palette
- [`research/STRATEGY_DOC_CHECKED_AGAINST_THE_CODE_2026-08-29.md`](research/STRATEGY_DOC_CHECKED_AGAINST_THE_CODE_2026-08-29.md)
  — three outside documents corrected against what we actually run. **Read this before any
  competitive claim.**
- [`research/`](research/) — the two competitor volumes and the feature strategy they correct
- [`prototypes/`](prototypes/) — the binding drawings. **Port them; never redraw them.**
- `DECISION_LOG.md` — append-only; search `2026-08-28` and `2026-08-29`
- [`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md) — the older master register, useful for history

**The two repos:**
`github.com/iscasasola/Setnayan-specs` (this one) · `github.com/iscasasola/setnayan-platform` (code).

---

## § 9 · THE ONE-LINE VERSION

**Two streams. The story build (Stream A) is the live one — take S11 or S13 if its lane is free;
Stream B's item 7 (or item 6, once measured) if it is not — items 3-5 have SHIPPED. Ignore the five stale ACTIVE labels. Check the lane with
`gh pr list --state open` before you start. Verify everything against production, not against a
document — INCLUDING THIS ONE, which was itself eleven days out of date on 2026-09-09.**
