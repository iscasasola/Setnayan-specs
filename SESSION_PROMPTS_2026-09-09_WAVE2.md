# Session prompts — wave 2, written 2026-09-09

> Measured against `origin/main` and the live database, not against the registers.
> **Run at most two at a time.** Ten parallel builds once shipped 44 defects.

## Sequence

```
NOW, in parallel (no shared files):   EX-1   ·   ENC-1
then, in parallel:                    STORY-13   ·   FIX-1
after EX-1 merges:                    EX-2
```

| | session | model · effort | depends on | conflicts with |
|---|---|---|---|---|
| **EX-1** | The Setnayan gift is a switch, not a sentence | opus · **high** | PR #5373 (mine, in CI) | EX-2 |
| **EX-2** | The gift reaches the bill, and the couple's pot | opus · **xhigh** | EX-1 | EX-1 |
| **ENC-1** | The encoder actually runs | opus · **high** | nothing | nothing |
| **STORY-13** | Every celebration that is not a wedding gets a story | opus · **high** | nothing | any story session |
| **FIX-1** | A ₱2,500 page stops promising what only suppliers can do | sonnet · **medium** | nothing | nothing |

---

## THE HEADER — paste this above every prompt below

```
You are working on Setnayan. Assume NO memory files exist; everything you need is
in the two repos.

WHERE THINGS ARE
• Code: github.com/iscasasola/setnayan-platform, checked out at
  ~/Documents/Claude/Projects/setnayan-platform
• Specs + decisions: ~/Documents/Claude/Projects/Setnayan (a SEPARATE git repo).
  DECISION_LOG.md there is the record of every owner ruling. It is append-only and
  shared with other sessions — stage it by explicit path, never `git add -A` at its root.

⛔ NEVER READ CODE FROM /Users/icecasasola. It is a git checkout ~2,950 commits
stale that tracks your home directory. It produces coherent, fully-traced,
COMPLETELY WRONG findings — real line numbers from files deleted months ago.
Read current main with: git worktree add --detach /tmp/wt-read origin/main
⛔ And from a scratch workspace, never run a bare `git` command — those folders are
empty and sit under ~, so git resolves to that stale repo. Always `git -C <worktree>`.

RULE 0 — FIND IT BEFORE YOU BUILD IT. This is ~2 years of code. Assume what you are
asked for ALREADY EXISTS and your job is to locate and extend it. Before writing
anything, grep apps/web for the feature noun and state in one line each: what
exists · what is missing · the delta you will build. The owner has paid twice to
have a page rebuilt that already shipped.

⛔ READ PRODUCTION, NEVER WRITE IT. SELECT only. Never apply a migration to prod —
that orphans the ledger and jams `db push`. Allocate a timestamp with
`pnpm migration:new <name>`.

HOW TO KNOW YOU ARE DONE
• `npx tsx --test <path>` — REQUIRE `# tests` to be NON-ZERO. Zero-tests-zero-fail
  exits 0 and is byte-identical to success. A path with [brackets] under `--test`
  silently matches nothing; run `npx tsx <path>` with no --test flag instead.
• Typecheck: print the exit code BESIDE the error count. `TSC_EXIT=134` with
  `ERROR_LINES=0` is an out-of-memory abort, not a pass — re-run with
  NODE_OPTIONS=--max-old-space-size=8192.
• MUTATION-TEST every guard you write. Break the guarded thing and prove the guard
  goes red, printing the occurrence count BEFORE -> AFTER. If the count did not
  move, the sabotage did not land and the result means nothing — re-measure on a
  string that actually changes. Assume one of your guards is decoration; in this
  session's own work one was, and only a mutation found it.
• A generated file's merge conflict has NO correct side. Regenerate it from the
  merged tree (`pnpm --filter @setnayan/web exposure:baseline`), read the diff, and
  never pick a side or hand-edit the hunk.

WORKFLOW
Branch, build in a worktree BESIDE the repo, commit before your first mutation and
push early (a proved change was once lost with an uncommitted /tmp worktree). Add a
`changelog.d/<branch-slug>.md` fragment with a `SPEC IMPACT:` line. Do NOT edit
CHANGELOG.md or STATUS.md. Open the PR; auto-merge arms itself ~12s later, so if
the change is owner-gated or money-shaped, open it as a DRAFT instead.
```

---

## EX-1 · The Setnayan gift is a switch, not a sentence
**opus · high.** Depends on PR #5373 being merged (verify with `gh pr view 5373 --json state,mergedAt`).

```
THE OWNER HAS RULED ALL OF THIS. Do not re-ask any of it; read
DECISION_LOG.md 2026-09-09 for the rows.

• The Setnayan Exclusive is ONE thing: PAPIC CREDITS. Not five products, not two.
  Setnayan AI, Live Studio, Event Hub Pro and the Mood Board pack are OFF the gift
  shelf — they stay ordinary products a couple can buy.
• It is OPTIONAL. PR #5373 already removed it from the publish gate, from the
  database trigger and from the maker's guided pass. Do not redo that.
• The supplier's control is a pure YES/NO. There is no amount to set, no picker,
  no slider, no top-up. 40% of the booking fee is a ceiling.
• The card promises NO NUMBER. The photo count is computed from what the supplier
  actually pays and appears on the QUOTE, not on the card.

WHAT TO BUILD
Today the gift is `vendor_services.exclusive_perk_text` — a FREE-TEXT box anyone can
type anything into, written in 4 places in
app/vendor-dashboard/services/actions.ts and rendered by canvas-maker.tsx and
service-wizard.tsx. Replace the CONTROL with a real yes/no on the service card, and
make the card say the true thing.

RULE 0 FIRST — measure and report before building:
• grep for exclusive_perk_text across apps/web AND supabase/migrations. Name every
  writer and every reader. There were 6 app files at last count.
• The card's badge today reads `snap.hasExclusive` (service-card-face.tsx) fed from
  service-card-snapshot.ts. Say what it renders now.
• Production holds TWO service cards, both active, both carrying perk text. Say what
  happens to those two rows under your change — they must not lose anything.

THE SHAPE
• A boolean column on vendor_services (RLS at CREATE TABLE time; check the 8
  canonical patterns in 02_Specifications/RLS_Policy_Pattern.md).
• ⚠ A NEW COLUMN IS NOT DONE WHEN IT EXISTS. Check whether vendor_services uses the
  per-column GRANT allowlist pattern that `events` does — if it does, a column with
  no `GRANT SELECT (col)` makes PostgREST refuse the WHOLE query and every read goes
  silently empty.
• ⚠ A migration also drags in the exposure baseline
  (supabase/security/exposure-surface.baseline.txt — regenerate, read the diff, and
  COUNT what it adds; regenerating blind has recorded a real widening as intended
  here before) and the Ugat map (see the code repo's CLAUDE.md doc rule 4).
• The free text: KEEP the column and keep displaying what the two live rows already
  say. Retire it as the CONTROL, not as data. A card that already promises
  something keeps promising it.

WHAT THE CARD SAYS WHEN THE SWITCH IS ON
Not a number. Something like "Includes a Setnayan gift — free Papic photos for your
celebration, sized to the booking." The exact wording is yours; it must not imply a
quantity, because the quantity is not known until a price exists.

DO NOT build the computation, the bill or the grant. That is EX-2.
```

---

## EX-2 · The gift reaches the bill, and the couple's pot
**opus · xhigh.** Start only after EX-1 merges — you share the service card.

```
ALL FIVE OWNER GATES ARE CLOSED. Read DECISION_LOG.md 2026-09-09 (six rows) before
you start. The arithmetic, in full:

  gift budget = 40% of the booking fee          (ceiling, never a starting point)
  the fee     = 5% of the first ₱100,000 + 1% above, floor ₱50, no cap
                ⇒ DERIVE IT from apps/web/lib/booking-fee.ts. Never re-type a rate.
  credits     = what that budget buys along the LIVE Papic rung ladder,
                interpolated CONTINUOUSLY between rungs — not "the biggest whole
                bundles that fit". The owner's word is *proportional*; a whole-bundle
                fit strands a remainder and produces lumpy numbers.
  CAP         = 50,000 credits. The 100,000-credit rung is OFF the gift ladder.
                Implement the cap on CREDITS and then price it — a peso ceiling
                silently becomes a different number of photographs the day that rung
                is repriced.
  the charge  = ADDED to what the supplier pays, never deducted. And because the
                supplier is charged FOR the gift, the charge caps with it: above the
                cap they pay fee + the price of 50,000 credits, not fee + 40%.
  the floor   = no Exclusive at all below a ₱3,500 booking. At ₱3,500 the fee is
                ₱175, 40% is ₱70, and ₱70 is exactly the 100-credit rung — the
                smallest gift still worth calling one. Below it the promise produces
                nothing, silently.
  granted     = when the money CLEARS, into the event's Papic pot.

⚠ NEVER RE-TYPE A RUNG PRICE. `platform_retail_catalog_v2.retail_price_php` for the
17 PAPIC_GUEST* rows is the only source and the ladder MUST be read at runtime. A
hard-coded curve is a second copy of a price and this repo has paid for that four
times. (For orientation only, subject to change: 100 credits ₱70 … 50,000 ₱15,000.)
⚠ And CLAUDE.md is WRONG where it says "₱1 = 1 credit; the regular price IS the
credit count". The live ladder tapers from ₱0.70/credit to ₱0.24/credit.

RULE 0 FIRST: `comp_grants` and `vendor_self_comp` ALREADY SHIP, as do
`lib/self-comp-authority.ts` and `lib/self-purchase.ts`. Papic credits already have
a granting path. Find it and use it. Do NOT invent a second way to put credits in a
pot — and read `papic_reserve_capture_split` before you assume how the pot works.

SAY IT IN PHOTOGRAPHS, NEVER IN PESOS. On the quote: "your couple gets 1,429 free
photos", not "₱1,000 of credits". The peso figure is our accounting; the photo count
is the product. Measured examples to sanity-check your implementation against:
₱20k booking → 571 · ₱50k → 1,429 · ₱100k → 3,571 · ₱500k → 6,429 · ₱1M → 14,074 ·
₱3.35M and above → 50,000, capped.

⚠ THIS IS REAL MONEY ON A REAL BILL. Open the PR as a DRAFT so auto-merge does not
arm itself, and say in the body what a supplier's bill looks like before and after.
```

---

## ENC-1 · The encoder actually runs
**opus · high.** Independent of everything else.

```
Setnayan built its own broadcast encoder so a couple opens Setnayan instead of
configuring OBS. Owner-ruled Path A (₱0 per wedding) on 2026-09-03. The pipeline is
phones → controller → canvas → WebCodecs → IPC → Rust/RTMP → YouTube.

THE FINDING THAT IS THIS SESSION: every stage is built, tested and merged — the Rust
crate gates CI with 83 tests — AND NOTHING CALLS ANY OF THEM. The plan of record
(build-sessions/encoder/README.md in the CODE repo) says "14 sessions are merged; the
pipeline is complete end to end." The first half is true. The second is false.

Read, in the code repo: build-sessions/encoder/README.md, X0-TRACKER.md,
S13-PREFLIGHT.md, S17-FINDING.md, and build-sessions/STORE-SHELL-CLOSEOUT-2026-09-07.md.

YOUR JOB: join the pipeline. Composite → encode → send must run end to end from the
desktop app, driven by the controller, with nothing hand-wired in a test.

RULE 0 IS THE WHOLE FIRST HOUR HERE. Do not write a new stage. Every piece exists;
find each one, name its entry point, and report the gaps between them BEFORE writing
a line. If you find a stage that is genuinely missing, say so with the grep that
proves it.

⚠ WHAT IS NOT YOURS AND MUST NOT BE ATTEMPTED: publishing a desktop build (blocked
on the owner pasting 4 GitHub Actions secrets + R2_PUBLIC_URL in Vercel), proving a
real broadcast reaches YouTube (needs a live stream key from the owner), the
60-minute thermal run (needs an hour of the owner's own machine, quiet), and the
entire Windows leg (needs his Windows laptop, and he ruled 2026-09-09 that Windows
comes last). Build up to those gates, stop, and list them.
```

---

## STORY-13 · Every celebration that is not a wedding gets a story
**opus · high.** Runs alone in the story tree.

```
The event story shipped this week across ~11 sessions. It assumes a wedding.

OWNER RULING, already given (Q3, 2026-09-09): a wake gets the QUIET ARM. Do not
re-ask it. Setnayan already has a solemn register — read
DECISION_LOG.md 2026-08-24 (the funeral row): terminology carries
`register: 'solemn'`, there is a hardcoded FUNERAL_PROFILE fallback, no countdown, no
marketing upsells, its own gentler nouns. THAT MODEL EXISTS. Extend it into the
story; do not invent a second one.

Register: Design_Editorial_By_The_Minute_2026-09-07/09_SESSIONS_AND_PROMPTS_2026-09-09.md,
row S13. Its lane blocker (S11) merged 2026-09-09T11:13Z.

⚠ FIRST, RECONCILE WITH AN ORPHAN. Draft PR #5012 ("the Stories switch reaches every
kind of day, and stops calling a blocked celebration eligible") has been untouched
since 2026-08-29 and already fixes HALF of this. Read it before you build. Decide,
and say in your PR body, whether you absorb it or supersede it — then tell the owner
which, because a stale draft nobody closed is how work gets done twice.

⚠ AND THE COVERAGE GUARDS WILL FIRE. A new event type in this repo trips several,
one of which lives in `test:db` and only shows up in CI. Run the WHOLE db suite for
an event-type change, not just your own files.
```

---

## FIX-1 · A ₱2,500 page stops promising what only suppliers can do
**sonnet · medium.** Independent. The smallest real defect on the board.

```
PR #5140 ("couples can attach every film of their day") has been open since
2026-09-03 with nobody on it.

THE DEFECT: the ₱2,500 Live Studio buy screen promises "unlimited video-link upload"
and the editor for those links exists ONLY on the vendor dashboard. A couple pays and
cannot do the thing the page sold them. That is a live mis-sale on a priced product.

Read PR #5140 first — its body has the diagnosis. Decide whether to rebase and land
it or to supersede it, and say which in your PR body.

⚠ Live Studio is ₱2,500 ONE-TIME, once per celebration, unlimited streams — owner
2026-09-02, verified in the live catalog (`billing_period='one_time'`) and pinned by
apps/web/lib/live-studio-unlock-never-expires.test.ts. The separate per-day product
is LIVE_STUDIO_HOSTED_CHANNEL at ₱3,000/day. Several documents still say Live Studio
is per event-day; they are stale. Do not price or gate anything per day.
```
