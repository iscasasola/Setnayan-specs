<!-- The front door for the Claude account dedicated to "what's next". Written 2026-08-29 because
the auto-loaded CLAUDE.md carries SIX blocks labelled ACTIVE and only ONE is open work — which is
exactly the confusion that makes a session rebuild something that already ships. Triage below is
measured, not remembered. -->

# START HERE — the "what's next" account

**You are the account dedicated to picking up unfinished work.** This file exists so your first
ten minutes are not spent working out which of 56 `WHATS_NEXT_*` files and six blocks marked
ACTIVE is the real one.

---

## § 1 · THE ANSWER: there is ONE open stream

### ▶ Papic, items 3–7

**Your handoff, and it is self-contained:
[`WHATS_NEXT_Papic_Items_3_7_HANDOFF_2026-08-29.md`](WHATS_NEXT_Papic_Items_3_7_HANDOFF_2026-08-29.md)**

It assumes **no memory files exist** (476 notes do not travel between accounts), inlines every
house rule, pre-answers RULE 0 for each item with real file paths, and carries the owner decisions
already made. Read it, then
[`WHATS_NEXT_Papic_Build_Order_2026-08-29.md`](WHATS_NEXT_Papic_Build_Order_2026-08-29.md) for the
ordering and why.

| # | What | Size | State |
|---|---|---|---|
| 1 | The browser stops enforcing a limit that does not exist | days | ✅ **DONE** (PR #5002) |
| 2 | Say what is already true, on the promotion page | days | ✅ **DONE** (PRs #5003, #5007) |
| **3** | **Shots per guest** (+ sponsors default to a bigger share) | several sessions | **← START HERE** |
| **4** | **Timed challenges reach the wall** | 1 session | open |
| **5** | **Challenges hang on the ceremony sequence** | small | open |
| **6** | **The guest chooses per audience** | small | open |
| **7** | **The year** — one pot across a linked group of celebrations | project | open |

⚠ **Verify 1 and 2 before trusting this table** — `gh pr view 5002 5003 5007 --json number,state,mergedAt`.
**This corpus has been wrong about a PR's state five separate times.**

---

## § 2 · 🛑 THE SIX "ACTIVE" BLOCKS — ONLY ONE IS OPEN WORK

The auto-loaded corpus `CLAUDE.md` carries six blocks headed `▶ ACTIVE`. **Five are finished
streams or standing rules that never had the label removed.** Triaged 2026-08-29 by reading each
block's own claims:

| Block in `CLAUDE.md` | Really? |
|---|---|
| **Papic: the build order** (2026-08-29, line ~68) | ✅ **THE ONE OPEN STREAM.** Items 3–7. |
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
2. [`WHATS_NEXT_Papic_Items_3_7_HANDOFF_2026-08-29.md`](WHATS_NEXT_Papic_Items_3_7_HANDOFF_2026-08-29.md) — the open stream, self-contained
3. [`WHATS_NEXT_Papic_Build_Order_2026-08-29.md`](WHATS_NEXT_Papic_Build_Order_2026-08-29.md) — the ordering and the reasoning
4. [`WHATS_NEXT_Shots_Per_Guest_2026-08-28.md`](WHATS_NEXT_Shots_Per_Guest_2026-08-28.md) + [`…_SESSIONS_…`](WHATS_NEXT_Shots_Per_Guest_SESSIONS_2026-08-28.md) — item 3 in full

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

**Read the Papic items 3–7 handoff and start on item 3. Ignore the five stale ACTIVE labels.
Verify everything against production, not against a document — including this one.**
