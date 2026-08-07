# HANDOFF PROMPT — continue Setnayan on a fresh Claude Code account

> **Status: DRAFT — awaiting reports from 3 sibling sessions** (owner asked them to
> report in so this can be compiled once). Sections marked ⏳ are placeholders.
> Everything outside them is verified and ready.
>
> 🚨 **A SECOND HANDOFF IS BEING WRITTEN IN PARALLEL — MERGE, DO NOT PICK ONE.**
> As of 2026-08-07 07:4x a sibling session has an **uncommitted** edit to the
> corpus `CLAUDE.md` adding a "COLD START" block that points at
> **`HANDOFF_RESUME_2026-08-07.md` in the CODE repo** (vendor bare-root URLs, the
> 16-surface logo debt, a shared name registry, rename-forwarding expiry). That
> file was **not yet on `origin/main`** when this was written — it is still being
> authored. **Do not delete, supersede or duplicate it.** The two cover different
> ground: this one is the *process + what-just-finished + what-is-next* prompt;
> that one is *verified prod state + URL/naming debt*. The final artefact the
> owner pastes should link both, and § 2 below should gain a line pointing at it
> once it lands.
>
> **The deliverable is § 2 — one block the owner pastes into a fresh account.**
> Everything above and below it is context for whoever assembles the final copy.

---

## 0 · Why this document replaces the old "Master Consolidation Prompt"

The owner was handed a plan (by another AI) to rebuild this repo clean-slate into
a fresh `clean-project/` directory. **That plan was executed against and
disproven on 2026-08-06/07. Do not run it.** Its every premise was false here:

| The old prompt assumed | Measured reality |
|---|---|
| a "messy monorepo" needing clean-slate rescue | the monorepo is already clean — `git status` went 212 entries → 0 once the root `.gitignore` was made an allowlist (the repo root **is** the home directory) |
| unfinished builds leak into prod and must be quarantined behind `NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES` | unfinished work is already flag-dark per feature; a blanket new flag would have created a second, competing gate |
| dead code must be swept out wholesale | a 6-dimension sweep found the two **largest** deletion recommendations were **both wrong** — the "retired" ~4,100-line Concierge wizard is LIVE via the mood-board page |
| `leaflet` is a bundled trap to strip | it is not in the runtime bundle |
| the checklist/map stack needs rebuilding | both ship and work |

🔑 **The real defect class is not mess. It is one fact stored in two places, with
the copies drifting.** Every significant find on 2026-08-06/07 was that shape:
the tag limit reached the database and not the screen; the WebRTC security fix
reached two transports out of five; the ceremony list reached the database and
not the schedule; the challenge library added a fourth source and the couple's
screen still knew three, so Setnayan's own recommendations were labelled
"Vendor". **A rebuild does not fix that — it duplicates it.**

⚠ **A stale checkout produced the original audit.** Its first run read a tree
**294 commits behind** and recommended deleting nine files that had been deleted
hours earlier. Always confirm `git rev-list --count HEAD..origin/main` is 0
before trusting any audit.

---

## 1 · Ground rules for the new account (read before § 2)

- **No memory files travel.** `~/.claude/.../memory/` does not move between
  accounts or machines. Everything needed is committed: this corpus
  (`~/Documents/Claude/Projects/Setnayan/`) and the code repo
  (`github.com/iscasasola/setnayan-platform`). A `[[double-bracket]]` reference
  in any doc is a topic hint, not a file you can open.
- **Start at [`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md)** — the master register
  of active streams and their gates. Then the corpus `CLAUDE.md` ACTIVE block.
- **RULE 0 — find it before you build it.** ~2 years of design and code exist.
  The owner has paid more than once to have a page recreated that already
  existed. Grep for the feature noun in `apps/web` first; state what exists, what
  is missing, and the delta you will build. RULE 0 paid off four times in one day
  and nothing was rebuilt.
- **Verify against live reality, never a document.** Order of truth: live site →
  shipped code at `origin/main` → live prod DB → the ground-truth doc → iteration
  specs (archive stubs, may be stale). Three notes were wrong about deployment on
  2026-08-06 alone.
- **Reply style is owner-locked.** Plain English, describing what a *person*
  experiences. No file paths, function names, table names or flag names in the
  answer — those belong in the PR body. Decide and act; do not close with a
  recommendations block.

---

## 2 · THE PROMPT — paste this whole block into the fresh account

```
You are continuing the Setnayan platform — a Philippines-first life-events
platform (weddings first), Next.js 15.5 App Router + React 19 + TypeScript,
shipping to Vercel, a Tauri desktop build, and an installable PWA. Supabase
(Singapore) for data, Cloudflare R2 (APAC) for media.

DO NOT REBUILD ANYTHING. An earlier plan to consolidate this repo clean-slate
into a fresh directory was tested and disproven — the monorepo is already clean,
and the real defect class is one fact stored in two places with the copies
drifting. Your job is to find, verify, and close those gaps.

START HERE, IN THIS ORDER:
1. ~/Documents/Claude/Projects/Setnayan/WHATS_NEXT_INDEX.md — the master register
   of every active stream and its gates.
2. ~/Documents/Claude/Projects/Setnayan/CLAUDE.md — the ACTIVE WORK block.
3. ~/Documents/Claude/Projects/Setnayan/HANDOFF_PROMPT_Clean_Monorepo_2026-08-07.md
   — this handoff, for what just finished and what is next.

BEFORE WRITING ANY CODE, run RULE 0 and paste the results into your reply:
   grep -rln "<the feature noun>" apps/web/app apps/web/lib --include="*.tsx" --include="*.ts" | head
   ls ~/Documents/Claude/Projects/Setnayan/*.md
   grep -n "<the feature noun>" ~/Documents/Claude/Projects/Setnayan/DECISION_LOG.md | tail -20
Then state in one line each: what exists · what is missing · the delta you will
build. If you cannot name the existing component and the existing design, you
have not searched enough — do not start.

VERIFY AGAINST LIVE REALITY, NEVER A DOCUMENT. Order of truth: the live site
www.setnayan.com → shipped code at origin/main → the live prod DB → the
ground-truth doc → iteration specs (archive stubs, often stale). Confirm your
checkout is current (git rev-list --count HEAD..origin/main must be 0) before
trusting any audit — a 294-commit-stale tree once produced an entire audit that
recommended deleting files already deleted.

HOUSE RULES THAT COST US REAL DEFECTS:
- A guard is decoration until you have seen it FAIL. Break every fix on purpose
  and watch the guard fire by name before you trust it.
- A guard that cries wolf is worse than none. Three first drafts over-fired
  (16 flagged/1 real, 13 routes/0 real, 10 statuses/0 real) and had to be
  narrowed before shipping.
- Supabase does not throw — it resolves with { error }. A phantom column OR a
  phantom enum value fails the whole query and returns null data, which reads
  exactly like "nothing found". Check the error on every read.
- A refusal nobody can see is indistinguishable from success. If a guard refuses,
  the refusal needs somewhere to be shown.
- Trace to the WRITE, not the flag. Grep the column and ask whether every hit is
  a READ — a column with zero writers has silently disabled a shipped feature
  twice here.
- CI runs in UTC, the one clock where the wall-clock and date-parsing bugs cancel
  out. Run suites under Asia/Manila as well.
- Never edit an applied migration. Allocate forward with `pnpm migration:new`.
- If your PR touches supabase/migrations/, the exposure baseline must be
  regenerated IN THE SAME PR: `npm run exposure:baseline --prefix apps/web`.
  This applies to narrowings too, not just widenings.
- A new table in `public` ships OPEN — Postgres grants the schema defaults to
  anon and authenticated at CREATE TABLE time. `REVOKE ALL` in the same
  migration, then grant only what is needed. Verify the readers are SECURITY
  DEFINER before revoking, or you will break the feature.

WORKFLOW:
- Branch, then `git worktree add` IMMEDIATELY — agents have clobbered a shared
  checkout. Prune each worktree the moment its PR merges; they are ~1–2 GB and a
  full disk once deadlocked a session (every command failed, including the rm
  needed to recover).
- Add a changelog fragment (a NEW file in changelog.d/) with a SPEC IMPACT line.
  Never edit CHANGELOG.md or STATUS.md in a feature PR.
- Auto-merge is the standing default: `gh pr merge <#> --auto --merge`. It is
  ALSO armed automatically by a workflow on every non-draft PR.
- TO HOLD A PR (public legal copy, anything the owner must read first): apply the
  `do-not-auto-merge` label. It now genuinely disarms at any time, including on
  an already-armed PR. Do not rely on simply not arming it.

ASK THE OWNER ONLY for locked prices/SKUs, scope, risk trade-offs, or reversing
an owner lock. Everything else pre-launch is reversible — decide and act. Never
ask a question the corpus answers; grep first and cite what you checked.

Reply in simple English describing what a PERSON experiences. No file paths,
function names, table names or flag names in the answer — those belong in the PR
body. The owner steers product, pricing, scope and risk; they are not reading
the code.
```

---

## 3 · What finished on 2026-08-06/07 (verified, not recalled)

**31 PRs merged across all four sessions in 24 hours.** Highlights that change
what a person experiences:

### Security / privacy
- **The couple↔vendor call channel was PUBLIC** — a missed back-port. Closed
  (#4191). ⚠ The same PR nearly shipped a double-prefixed topic that would have
  denied *every* call; caught by accident.
- **The anonymity floor allowed a market band built from ONE peer** (#4205) —
  its p50 would have been that vendor's own numbers, published to a competitor
  as an "anonymised benchmark". Floor is now a hard `>= 3` with an operating 5.
  Nobody was exposed: zero band rows, and the recompute is a button never pressed.
- Sub-processor lists reconciled; the DPO's two behaviour-changing rulings landed.

### Truth in what we tell people
- **The privacy notice promised 5 years of photos; originals go at 6 months**
  (#4208/#4209). Wrong in the most dangerous direction — a couple relaxes,
  downloads nothing, and loses the good version of their wedding.
- **The RSVP form promised guests three things that do not exist** (#4211):
  a song request, a dance style, and a Papic Challenge opt-in — plus the free
  account to find them in. There is no guest account area at all.
- **Vendors were shown a token price on "Accept"** for every inquiry, when
  accepting is free (#4216). See § 4 — the token retirement is unfinished.

### Correctness
- **A Born Again or Jewish couple was handed a Catholic Mass** (#4198, finished
  in #4204 — the first pass missed three more surfaces).
- **Every guest message save had been failing since a Phase-1 commit** (#4207) —
  a migration was put in an orphan `apps/supabase/migrations/` directory that
  `db push` never reads. The app half shipped; the schema half went nowhere.
  Both halves looked done.
- **Two definitions of "the wedding day" shipped side by side** and were consumed
  in the same component (#4202), disagreeing by 12h at the start and 36h at the
  end — late check-ins happen exactly in that window.
- **No per-photo tag limit** (#4188) — and the screens finally match the decision.
  ⚠ The cap number was never the real defect: the DB had allowed 20 since July
  while two capture screens hardcoded 10.

### Process
- **`do-not-auto-merge` is now a real control** (#4210, then #4214). The label
  only ever protected a PR that carried it at `opened` — two legal PRs were
  armed at open, labelled 16h/14m later, wore the label for eleven minutes and
  merged anyway. Applying it now genuinely disarms.

⏳ **Sessions 2/3/4 — your merged work and its one-line "what a person
experiences" summary goes here.**

---

## 4 · What is next (open, in priority order)

### 4a · Token retirement — HALF DONE
Owner lock 2026-07-21, verbatim: *"token can retire, there should be nothing that
needs token anymore."* Prod has never seen a token bought or spent. A verified
sweep found **42 user-visible token texts**; the vendor-facing ones are removed
(#4216). Still standing:

1. **`/admin/token-purchases`** and **`/admin/vendors/<id>/tokens`** — two whole
   admin pages (confirm token-pack payments; grant tokens).
2. **"Token sales" + "Token bands" in the admin sidebar** on every admin page,
   plus a "Token sales" row in the admin work list.
   ⚠ Admin nav shape is guarded (#4066, added after a cleanup silently deleted
   two nav groups) — removing entries must regenerate that guard in the SAME PR.
3. **`/vendor-dashboard/creators`** — an entire feature whose currency is tokens.
   🔴 **OWNER DECISION:** retiring the currency leaves it with no meter. Free, or
   something else? This is a product question, not a copy edit.
4. **Money** — the Custom plan builder sells ₱100 per 25 tokens/cycle, and
   `vendor_billing_catalog` carries an **ACTIVE** "Custom — Included Token (per
   cycle)" row at ₱100 plus five retired packs. Locked-SKU territory.
5. **Public copy** — `/features` (EN + TL) and the generated `llms.txt`.
6. **Corpus** — `Pricing.md § 0.C` still narrates a live token economy.

### 4b · Papic Challenges §9 — PR-A/B/C shipped, D/E/F remain
The 40-challenge library + 20-slot board is live and verified in prod (40 rows,
RLS on, anon revoked, all three go-live assertions pass, blast radius zero).
Remaining, per `0012_papic/Papic_Challenges_Resume_Handoff_2026-07-23.md` § 5:
**PR-D** Pabati doorway (the video-greeting challenge is fail-closed until it
exists) · **PR-E** couple library picker · **PR-F** vendor lane gate + a hard
5-paid-slot sell cap.
⚠ That handoff carries an owner lock — *do not push/PR/auto-merge until the
migration is verified on a real database.* It was violated on 2026-08-07; the
outcome was clean but the process was not.

### 4c · Owner-only, nothing blocked on code
- Read the now-live privacy notice and the Filipino homepage copy — both merged
  without review while the hold was broken (§ 3). Keep or reverse; the fix means
  it cannot recur.
- Whether a reference should be REQUIRED on the four pay-Setnayan forms.
- The vendor-verification bucket has no cleanup control; two government IDs sit
  there unreferenced.

⏳ **Sessions 2/3/4 — your open items and owner decisions go here.**

---

## 5 · Assembly instructions for whoever compiles the final copy

1. Fill the three ⏳ slots from the sibling sessions' reports.
2. Re-verify every claim that names a file, flag or route — this document will be
   read by an account that cannot check your memory, and a stale line here is
   exactly the failure mode it exists to prevent.
3. Commit it to the corpus and add a row to `WHATS_NEXT_INDEX.md`.
4. Give the owner **§ 2 only** to paste. The rest is for the assembler.
