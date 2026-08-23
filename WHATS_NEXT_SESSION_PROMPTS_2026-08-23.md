# SESSION PROMPTS — 2026-08-23

Ready to paste. One block per session, in wave order, from
[`WHATS_NEXT_EXECUTION_PLAN_2026-08-23.md`](WHATS_NEXT_EXECUTION_PLAN_2026-08-23.md).

**How to use it:** paste **§ 0 (the shared header) first**, then the session's own prompt under it.
The header is what stops a session rebuilding shipped work, reading a stale tree, or clobbering
another session — it is not boilerplate.

🔴 **Never run more than three at once, and only ever sessions from the SAME wave.** The
no-collision guarantee is per wave; two sessions from different waves may own the same files.

▶ **Every prompt is written to RUN TO THE END.** The header carries a standing continuity clause —
the session finishes its whole list, decides its own way past blocked checks and conflicts, and
reports once at the end. It stops only at an item explicitly marked OWNER DECISION. **You should
not have to answer anything mid-session.**

| session | model | effort | wave |
|---|---|---|---|
| W0 · PR triage and land | Opus 5 | high | 0 — alone |
| W1-A · A finished event tells the truth | Opus 5 | medium | 1 |
| W1-B · Retire Pabati, let the buy pages sell | Opus 5 | **xhigh** | 1 |
| W1-C · Make the paperwork true | Sonnet 5 | medium | 1 |
| W2-A · A guest can keep their code | Opus 5 | high | 2 |
| W2-B · Delete what we said we would delete | Opus 5 | **xhigh** | 2 |
| W2-C1 · The gold nobody can read | Sonnet 5 | medium | 2 |
| W2-C2 · Ninety-five admin routes, one shape | Opus 5 | high | 2 (after C1) |
| W3-A · "You have none" must mean none | Opus 5 | high | 3 |
| W3-B · A supplier's card earns its keep | Opus 5 | high | 3 |
| W3-C · A wake is not a celebration | Opus 5 (+ Fable for the words) | high | 3 |
| W4-A · The four screens a couple lives in | Opus 5 → Sonnet 5 | medium | 4 |
| W4-B · Sixty-three supplier screens | Opus 5 → Sonnet 5 | medium | 4 |
| W4-C · Shut the doors nobody uses | Opus 5 | **xhigh** | 4 |
| W5-A · A supplier's record survives a delete | Opus 5 | **max** | 5 |
| W5-B · The surfaces nobody drew | Fable → Opus 5 | medium | 5 |
| W5-C · Who is in my event? | Opus 5 | medium | 5 |
| W6 · The grab-bag, verified first | Fable → Sonnet 5 | medium | 6 — alone |

---

## § 0b · THE APPLE-INVITES ITEMS — twelve, and where each one landed

**Where they came from.** The owner said **Apple Invites** looks similar to Setnayan. A session
compared the two products, then measured our **live signed-in UI** at phone and laptop widths
against `origin/main` @ `09697145d` — the same tip wave 0 finished on. Its deliverable was an
artifact, not code; nothing was committed. **It is not "Apple Live"** — that phrase was never used
in it.

⛔ **THREE THINGS IT FIRST REPORTED AND THEN DISPROVED ITSELF. DO NOT BUILD ANY OF THEM.**
- **The photo event card with fallbacks ALREADY SHIPS** — `(launcher)/_components/event-scene.tsx`,
  precedence: the couple's own hero → a per-type stock photo → a deterministic branded gradient.
  ✅ **I re-checked: the file is there and `grep -c "sm:\|md:\|lg:"` returns 0**, so it does not
  branch on viewport. The first-pass finding "mobile has no photo card, build one" is FALSE.
- **The phone/laptop split is DELIBERATE and comes from an approved prototype** — `MobileEventHero`
  + `MobileEventChip` under `sm:hidden`, the desktop grid under `hidden sm:grid`, with the
  prototype's own class names cited in the comment. **Changing it is a design reversal, not a fix.**
- **`#8C6932` is NOT off-palette.** ✅ Re-checked: `app/globals.css:154` defines it as
  `--color-terracotta-700`, documented at 5.02:1 AA. The "front door breaks the colour lock"
  finding is FALSE.
- Co-hosting ships (`app/host/accept` exists); Apple only added theirs in June 2026.

🛑 **AP-2 AND AP-5 ARE WITHDRAWN. BOTH WOULD HAVE REVERSED AN OWNER LOCK — AND MY OWN FIRST
CORRECTION OF AP-2 WAS ALSO WRONG.**

I first wrote that the app *does* set a typeface and that some surface must be losing the variable.
Closer, still not the cause. **Read it yourself:**
```bash
git show origin/main:apps/web/app/_components/frontdoor/front-door.css | sed -n '18,36p'
```
That docblock is headed **"WHAT IS LOCKED HERE (owner 2026-08-11, this page only)"** and lists,
verbatim: **gold `#8C6932` action buttons with cream labels — measured 4.86:1** · **the SYSTEM
typeface, not the app's serif** · cream `#FDFBF7` page, ink `#2C2A29`. Line ~73 authors it
explicitly: `--fd-sys: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, …`.

So the front door is **not** losing a variable and is **not** missing a typeface. It wears a
deliberately authored system stack **because the owner chose it**, and its gold buttons are the
locked treatment. *"Settle on one strength of the action colour, front door included"* is a
reversal of an owner decision wearing the clothes of a consistency fix.

🔑 **THE LESSON IS WORTH MORE THAN BOTH ITEMS: THAT SESSION MEASURED THE FRONT DOOR AND SAID "THE
APP".** The front door is **the single page in this product with its own owner-locked visual
identity** — the worst possible sample to generalise from. Its "5 on-brand vs 133 fallback" tally
was the lock working correctly, read as a defect. **Anything sourced from a front-door reading must
be re-scoped to say "front door", or re-measured on a real app surface.**

🔒 **AND CARRY THIS, FROM THE SAME DOCBLOCK:** under `[data-chrome='app']` the front door's
page-level declarations — background, colour, typeface — are **UNSET on purpose**, so it lends
CHROME and never page styling. **"Which typeface does shared chrome wear" is an OPEN OWNER
DECISION** (`ONE_SHELL_PLAN_2026-08-13.md` §5.3). The file says letting an inherited `font-family`
leak onto ~15 pages *"would have decided it silently, which is how this project has twice ended up
with a lock nobody remembers agreeing to."* **Do not decide it by accident.**

⏭ **WHAT SURVIVES IS A MEASUREMENT, NOT A BUILD.** Nobody has ever tallied the computed
`font-family` on an **app** surface. That measurement now opens W4-A (see its prompt); a build is
opened only if the app itself is falling back. AP-5 leaves nothing behind on the front door; whether
the app's own primary buttons are internally inconsistent is a **separate, unmeasured** claim — two
were observed and both were terracotta.

### Where the twelve landed

| id | what a person gets | goes to | why there |
|---|---|---|---|
| AP-1 | the bottom bar stops vanishing when you tap People or Spaces | **W1-A** | `HomePillNav` is rendered in exactly ONE place — `(launcher)/page.tsx:1455` — which is W1-A's file. The fix lifts it to a layout. |
| AP-6 | no name is cut to "Y…" on a phone | **W1-A** | same file |
| AP-7 | Home and the event page report the same "planned" figure | **W1-A** | `(launcher)/page.tsx` + `lib/progress-stages.ts`, both already W1-A's — and W1-A is already inside `progress-stages.ts` for the After stub |
| AP-8 | section names that don't need a help button | **W1-A** | same file, copy only |
| AP-4 | the couple's photo appears on the card shared in Messenger | **W1-A** | `app/api/og/realstory-slug/[slug]/` — owned by nobody; small, and W1-A is the light session |
| ~~AP-2~~ | ~~the app stops falling back to the phone's default typeface~~ | 🛑 **WITHDRAWN** | reverses the owner's 2026-08-11 front-door lock. What survives is a measurement, opening **W4-A**. |
| ~~AP-5~~ | ~~one strength of the action colour everywhere~~ | 🛑 **WITHDRAWN** | the gold front-door buttons ARE the locked treatment. Nothing left on the front door. |
| AP-3 | the invitation reads like an invitation, not a receipt | **W2-A** | `app/[slug]/**` is W2-A's territory |
| AP-9 | guests see the weather for the day | **W2-A** | same territory ⚠ needs a forecast provider chosen — that is a cost/dependency call, flag it |
| AP-10 | guests get a map instead of a line of text | **W2-A** | same territory ⚠ **the CSP change in `next.config.ts` MUST be in the same PR** — our own CSP has already blocked our own map once, and the only symptom was an empty grey panel |
| AP-11 | the couple gets a first draft of their invitation words | **W5-C** | touches `dashboard/[eventId]/website/**` and the AI surface — both collide with wave 1 and wave 3 territory, so it waits |
| AP-12 | empty screens look deliberate, not unfinished | **W6** | deliberately broad; W6 runs ALONE and may claim any file. Pattern source: `(account)/samahan`, which that session called the best-designed screen it saw |

⚠ **AP-1 MUST BE VERIFIED BY SCREENSHOT, NOT BY QUERYING THE PAGE.** That session nearly filed a
false "empty nav bar" finding off a DOM probe whose selector matched the wrong element and returned
**the same result on a page where the bar is plainly visible**. Only the control test caught it.

### 🔴 THREE NEW OWNER DECISIONS — do not schedule, do not decide

1. **Collapse the phone's dark hero + chip into one photo card shared with desktop.** It would
   reverse an approved prototype.
2. **May guests see the full guest list?** Apple shipped it in June 2026. Touches our RA 10173
   posture and the standing lock that *surfaces show presence, the graph never talks*.
3. **Should the invitation carry an always-visible facts bar over the veil film?** It softens a
   locked cinematic opening.

### ❓ What that session could not check, and neither can the next one

Anything on a real device, on cellular, or on Android — every reading was a desktop browser at a
phone frame. **And it was signed in as the OWNER throughout, so the GUEST view was never seen** —
which is the view that decides AP-3, AP-9 and AP-10. Whether the two "planned" figures are one bug
or two different measures was observed but never traced. **AP-7 starts by tracing it.**

---

## § 0a · WHAT A SECOND VERIFICATION PASS FOUND — read this before any session

Every prompt below was re-checked against `origin/main` @ `c984e0caf` and the live production
database on **2026-08-23, after the prompts were first written**. Six briefs were wrong, and each
one would have produced exactly the loop this project keeps paying for: rebuilding something that
already ships.

| brief said | actually true on main today |
|---|---|
| W3-A: ~30 files, and the couple's supplier page has **45** unbound reads | **19** unbound reads across **14** files; that page has **3**, and **12** already bind their error. Most of it was fixed already. |
| W5-A: **152** foreign keys cascade, **10** survive | **145** cascade, **19** survive. Nine more already survive than the brief claims. |
| W4-C: **~290** anonymous read grants | **235**, across 384 public tables. Batches have landed. |
| W2-C1: **106** gold-as-text occurrences | 106 by the guard's regex, **207** by a plain grep. Both real, different methods — say which you used. |
| W1-C: the compliance pack still claims Philippine hosting and a 90-day retention rule | The **adopted** manual already carries the corrected retention row and no PH-hosting claim was found in it. The remaining "90 days" is about marketing samples — a different, correct rule. |
| C1: the per-guest QR download "refuses anyone without a full account" | It requires the event to own a **paid ₱1,499 SKU** — it is the BRANDED variant. Opening it to every guest gives away a sold product. |

🛑 **AND ONE OF MY OWN CLAIMS WAS WRONG — CORRECTED BY THE SESSION THAT RAN W0.** I wrote, in the
plan and in W0's prompt, that the six open PRs were *"none failing a check — all stuck on
conflicts."* **THREE OF THEM WERE FAILING**, and it changed the work:
- **#4711 was failing typecheck+lint** on a guard that says no NEW route word may be left uncovered
  by the database mint. It shipped a public `/pakanta` page and **never reserved the word** —
  confirmed in prod, `business_slug_is_reserved('pakanta')` returned NO, so a business named
  "Pakanta" could have been minted our own product page **permanently**, since shop addresses are
  immutable. Fixed with a migration, mutation-measured 1 → 0 RED, 15/15 restored.
- **#4563 was failing the exposure freeze** — its surface widened by a new column.
- **#4567's run was CANCELLED at 15m18s** — not an assertion failure at all, a third distinct cause.
🔑 **"BLOCKED", "DIRTY", "FAILING" AND "CANCELLED" ARE FOUR DIFFERENT STATES AND I COLLAPSED THEM
INTO ONE.** Read each PR's actual check run before deciding what kind of work it is. A summary of
several PRs' health is exactly the kind of claim that is cheap to write and expensive to believe.

🪤 **AND EVERY LINE NUMBER IN THESE PROMPTS HAS ALREADY DRIFTED.** Cited positions were re-checked
and several point at unrelated code — one brief's "unconditional email write at ~:233 and ~:453"
lands on neither. **GREP THE STRING. NEVER TRUST THE LINE.** The line numbers are kept only as a
hint about which region of the file to search.

🔑 **THE RULE THIS PASS PROVES.** Six of about twenty briefs were stale within hours of being
written by people looking at the same tree. So: **the first thing every session does is re-measure
its own premise and print the number.** If the number has moved, ship the smaller fix and say so —
that is a result, not a failure. If the premise is gone entirely, close the item and move to the
next one. Do not build to a brief. Build to a measurement.

---

## § 0 · THE SHARED HEADER — paste this above every session prompt

```
You are working on Setnayan, a pre-launch Philippines-first life-events platform.
Code: github.com/iscasasola/setnayan-platform · Specs corpus: ~/Documents/Claude/Projects/Setnayan

BEFORE ANY CODE — non-negotiable:
0. MEASURE YOUR OWN PREMISE FIRST AND PRINT THE NUMBER. Every count, file path and line number in
   your prompt was true when written and several have already been proved stale — six of about
   twenty briefs were wrong within hours. Re-run the grep or the query your prompt is built on
   BEFORE you scope anything. If the number moved, ship the smaller fix and say so. If the premise
   is gone, close the item in one line and go to the next. Build to a measurement, never a brief.
   GREP THE STRING, NEVER TRUST THE LINE — cited line numbers have already drifted.
1. RULE 0. Assume what you are asked for ALREADY EXISTS. This product is ~2 years of code and the
   owner has paid more than once to have a screen rebuilt that already shipped. grep for the
   feature noun in apps/web BEFORE designing anything, then state in one line each:
   what exists · what is missing · the delta you will build.
   If you cannot name the existing component, you have not searched enough. Do not start.
2. Read a FRESH tree, never the home directory (~ is a checkout ~1100 commits behind and returns
   confidently wrong answers):
     git -C ~ fetch origin main
     git worktree add --detach /private/tmp/wt-read-$$ origin/main
     git -C /private/tmp/wt-read-$$ rev-parse HEAD    # PRINT IT, compare to origin/main
   `git worktree add` on an EXISTING path fails while the next command in the chain happily prints
   the OLD tree's hash. Three agents read a 187-commit-stale tree that way on 2026-08-23.
3. Read WHATS_NEXT_EXECUTION_PLAN_2026-08-23.md § 2 and find YOUR session's territory.
   DO NOT EDIT A FILE OUTSIDE IT — another session may be in it right now.

WORKING RULES
- Branch FIRST, then `git worktree add <path> <branch>`. Never work in ~.
- NEVER `git reset --soft origin/main`. Rebase. Before every push:
      git diff --diff-filter=D origin/main..HEAD      # MUST be empty
  A deletion you did not author means you are about to clobber merged work. CI cannot see this —
  a repo missing a whole feature is internally consistent. It has already stopped production
  deploying once.
- apps/web/scripts/port-control-baseline.json is GENERATED. Regenerate on every rebase, never
  hand-merge. Diff routes before/after and confirm you removed only what you meant to.
- Add changelog.d/<branch-slug>.md with a `SPEC IMPACT:` line. Never edit CHANGELOG.md or
  STATUS.md in a feature PR.
- `gh pr create` then `gh pr merge <n> --auto --merge`. A force-push DISARMS auto-merge — re-arm
  after every rebase. Check `mergeStateStatus`, not just that the checks are green.
- Prune your worktree the moment the PR merges.

PROOF RULES — this product's entire defect history is bugs that were green in CI
- Every guard you write must be MUTATION-TESTED and the mutation MEASURED: print the occurrence
  count BEFORE → AFTER. An unmeasured mutation proves nothing in either direction. Assume your
  guard is decorative until you have broken the guarded thing and watched it go red.
- A rejected query is NOT a thrown error. A phantom column, a phantom enum value, a phantom RPC
  argument name, a blocked iframe, an unresolved r2:// reference — all get REFUSED, and the only
  symptom is an absence. If a screen is empty, suspect refusal before emptiness.
- Supabase does not throw; it resolves with { error }. A try/catch around a read is decoration.
  An unread count is not zero.
- A HAND-ENUMERATED GUARD LIST IS A LIST OF THE THINGS YOU THOUGHT OF. Proved again on 2026-08-22:
  one guard listed 7 buy paths while 9 files called the function it was guarding, and a ₱400
  purchase reached a page naming NEITHER bank account. DERIVE the subject list from the code, and
  FLOOR it so an empty sweep cannot pass silently.
- A GUARD THAT PROTECTS NOTHING IS WORSE THAN NO GUARD, and shipping one is worse than deleting it.
  Also proved 2026-08-22: a column-level REVOKE applied without error and changed nothing, because
  a column-level REVOKE CANNOT CARVE A HOLE IN A TABLE-LEVEL GRANT. The measured surface was
  identical afterwards. The right move was to DELETE the migration and record the finding — not to
  ship a protection that reads as if it were in place.
- After any migration merges, verify it applied IN PROD BY THE OBJECT (pg_get_functiondef,
  information_schema) — never by schema_migrations, never by the migration's own comment — and
  run `curl -s https://www.setnayan.com/api/health` to confirm the served version is your merge or
  later. THE MERGE IS NOT THE SHIP.
- Production is pre-launch: 5 events · 40 guests · 2 shops · 1 order, cancelled. ZERO ROWS IS THE
  PLAN, never a defect to report.

WRITING TO THE OWNER
Plain English. Say what a PERSON experiences — never file names, function names, table names or
flag names. Decide and act; escalate only locked prices, scope, risk, or reversing an owner lock.

RUN TO THE END — DO NOT STOP TO ASK WHETHER TO PROCEED
Owner, 2026-08-04, verbatim: "can you keep going instead of telling me what you recommend doing
next. can you do it. and decide". This is a standing instruction and it governs this whole session.
- You have ALREADY been authorised to do everything in your prompt. Do not ask permission to start
  an item, to open the next PR, to continue after a merge, or to move to the next item on your
  list. Just do it and say what you did.
- Finish your ENTIRE list before you report. A session that does item 1 and asks "shall I do item
  2?" has failed the instruction. Work item by item to the end.
- WHEN A CHECK FAILS OR A PR IS BLOCKED, that is work, not a stopping point. Investigate, fix,
  rebase, re-arm auto-merge, and carry on. Only a genuinely failing REQUIRED check that you cannot
  fix after real investigation is worth raising — and even then, park that item and finish the
  others first.
- WHEN ONE ITEM TURNS OUT TO BE BLOCKED OR ALREADY DONE, do not stop the session. Say so in one
  line, move to the next item, and finish everything that is not blocked. Scaling the work down is
  the owner's call, not yours.
- THE ONLY LEGITIMATE STOPS are: (a) an item your prompt explicitly marks as an OWNER DECISION —
  skip it, do not decide it, do not build it; (b) a locked price, SKU, or scope change; (c) an
  action that would destroy real customer data you cannot restore. Everything else, decide it
  yourself, state the assumption you made, and keep moving.
- Pre-launch means reversible. Production holds 5 events, 40 guests, 2 shops and a single cancelled
  order. Nothing you are asked to do here can hurt a real customer today, so hesitation costs more
  than a mistake does.
- Report ONCE, at the end: what shipped, what you skipped and why, what is waiting on the owner.
  No mid-session check-ins, no "let me know if you'd like me to continue".
```

---

## WAVE 0 — runs ALONE

### W0 · PR triage and land · **Opus 5 · high**

> ## ✅ W0 IS COMPLETE — 2026-08-22 21:57Z. DO NOT RUN IT AGAIN.
> **Independently verified, not taken on the session's word:** `gh pr list --state open` returns
> **ZERO open PRs** · #4535 CLOSED with a written reason · #4699 · #4708 · #4711 · #4567 · #4563 ·
> #4723 all MERGED · main tip `09697145d` · **production serving `0969714`, which IS that tip.**
> Migrations verified in prod **by the object** (my own query, not schema_migrations):
> `business_slug_is_reserved('pakanta')` = **true**, with `pay` and `creators` still reserved and an
> ordinary shop name still free — so the CREATE OR REPLACE neither reverted nor over-reserved; and
> `ensure_papic_board` now carries `10 - v_vendor_used` with the old `20 - v_vendor_used` **gone**.
> 🔓 **ALL THREE PABATI GATES ARE IN. WAVE 1 IS UNBLOCKED.**
>
> 🪤 **TWO THINGS THAT SESSION PAID FOR — carry them:**
> 1. **`$T:apps/...` in zsh triggers the `:a` history modifier and SILENTLY MANGLES THE PATH**, so
>    `git show` errors and the grep count comes back 0. **A verification that cannot match reads
>    exactly like a clean result.** Use `${T}:path`. Same family as every other "search that could
>    not match is not a negative result" in this repo.
> 2. **THE ANTI-REVERT RE-READ IS NOT OPTIONAL WHEN MERGES LAND AFTER YOURS.** Five merges landed
>    after #4699, so the final tip was re-read for every piece of the session's own work before
>    calling it done. Nothing had been reverted — but that is a measurement, not an assumption.
>
> ⏭ **NAMED, NOT FIXED — deliberately, and correctly:** `vendor-dashboard/subscription/actions.ts`
> hand-builds a payment path instead of calling the shared helper, so it lacks the helper's
> `.trim()`. Measured INERT (the reference is a database-generated Crockford code that cannot carry
> whitespace) and the guard documents the exception. **Do not "fix" it in a later session without
> re-measuring — it is a recorded decision, not an oversight.**
>
> ---
>
> <details><summary>Its mid-run state, kept for the reasoning</summary>
>
> ⏱ **STATE AT 2026-08-22 19:45Z, measured with `gh` and `curl` — a running session is already on
> this.** #4535 **CLOSED** · #4699 **MERGED** (19:36Z, main tip `0deceeb95`) · #4708 · #4711 ·
> #4567 · #4563 all **OPEN and BLOCKED** (they were DIRTY; the rebases landed).
> ⏱ **DEPLOY LATENCY IS ~10 MINUTES, AND THAT IS NORMAL — DO NOT CALL IT A DEAD DEPLOY TOO EARLY.**
> Production served the pre-merge build `c984e0c` for nine minutes after #4699 merged, then caught
> up to `0deceeb` at 19:46Z (`deploy-prod.yml` run: completed success). ⚠ **I raised it as a
> possible dead deploy at nine minutes and had to retract it one minute later.** The rule that
> survives: **a verification run against a build that predates your merge is a FALSE PASS, not a
> check** — wait for `/api/health` to report your merge or later before verifying anything. Give it
> ~15 minutes before treating a stall as the dead-deploy pattern, and confirm by reading the
> workflow run, not by the health endpoint alone.
> ⚠ **BLOCKED is not DIRTY.** Read why before acting: a required check still running is not a
> conflict, and re-pushing to "unstick" it wastes a cycle. A force-push disarms auto-merge.
>
> </details>

```
Six pull requests are open on setnayan-platform and none is failing a check — they are all stuck
on conflicts. Land five and close one. Nothing else runs while you do this; every later session
depends on these merges.

FIRST, AND WITHOUT REBASING IT: close #4535.
It is 507 files carrying SIXTEEN migrations that are already applied on main. That is the exact
shape of the merge that deleted 24 files, reverted 42, and stopped production deploying for a day
on 2026-08-21. Read enough of it to say in one line what it was genuinely carrying that main does
not have, write that down for a future session, then `gh pr close 4535` with that reason. Do not
rebase it. Do not cherry-pick from it without checking each file against main first.

THEN LAND, IN THIS ORDER, rebasing and regenerating the port baseline between each:
1. #4699 (the last three payment doors) — DIRTY on the baseline only.
   AFTER IT DEPLOYS: verify the six shop redirects are actually back BY READING THE DEPLOYED
   BUILD, not by trusting the merge. That is exactly how a silent revert was found last week.
2. #4708 (papic challenges, 3 migrations) — gates the Pabati retirement.
3. #4711 (Pakanta joins the Studio) — BLOCKED; diagnose WHY before rebasing. Second gate on Pabati.
4. #4567 (admin work-list counts) — 3 files.
5. #4563 (a band can show you them playing it, 1 migration).

THEN FINISH THE UNFINISHED AUDIT. The adversarial review of the payment conversion ran on
2026-08-21 and 17 of its 57 agents died on a usage limit — including the whole completeness pass
and the verification for two of six lenses: `redirect-mechanics` and `notify-and-admin`. Those
findings were never confirmed or refuted. A partial pass is not a clean bill of health. Re-run
those two lenses only, and act on what survives.

Read first: WHATS_NEXT_One_Payment_Page_2026-08-22.md (its §3 carries the per-file verification
procedure for a suspected revert — the conflicts git reports are NOT the dangerous part; the
files that merge cleanly by keeping a deletion are).

Done when: #4535 is closed with a written reason, the other five are MERGED, production's health
endpoint reports a version at or after the last of them, and the six shop redirects are confirmed
in the deployed build.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

---

## WAVE 1 — three at once

### W1-A · A finished event tells the truth · **Opus 5 · medium**

```
Four defects on a celebration that has already happened. Read
WHATS_NEXT_A_Finished_Event_2026-08-22.md first — nine PRs already shipped for this stream, do not
rebuild any of them. These are the four it left open, re-verified 2026-08-23.

1. THE SCHEDULE SHOWS NOTHING ON THE FIRST OPEN.
   `fetchScheduleBlocks(supabase, eventId)` is called TWICE in
   apps/web/app/dashboard/[eventId]/schedule/page.tsx (~:130 and ~:180). The second is the
   deliberate re-read after the non-wedding seed; the first serves a stale "0 blocks". Deleting the
   duplicate is right whichever cache is at fault — but RUN THE DISCRIMINATOR before you write a
   cause into a commit message. Do not assert a caching diagnosis you have not tested.
2. THE CHECKLIST DOES NOT KNOW THE DAY HAPPENED.
   apps/web/lib/checklist.ts (week buckets ~:292) + the checklist page read `event_date` only and
   carry ZERO lifecycle references, so a finished event shows "This week" over dates that have
   passed, at 0%. The nearby "compressed runway" comment is about an event created CLOSE to its
   date — NOT a past event. Do not read it as a fix.
3. "REVIEW" HAS NO DESTINATION.
   apps/web/lib/customer-menu.ts (~:177) and
   app/dashboard/[eventId]/_components/after/finished-event-summary.tsx (~:141) both open the plain
   marketplace. `BUDGET_BUILD_TABS` in lib/budget-build.ts is shortlist·build·budget·compare — there
   is no team tab to land on. The per-supplier "Leave a review" affordance ALREADY SHIPS inside
   that page: this is a LANDING change, not a new screen.
4. THE "AFTER" STAGE IS A STUB — and its promise is fiction.
   lib/progress-stages.ts has `afterPct = 0` (~:301) and a "7-day review window" sentence (~:298,
   ~:371) describing a mechanism that EXISTS NOWHERE IN THE PRODUCT. Delete the sentence rather
   than build to it. This is the least valuable of the four and the stream's own file says so —
   on the events where that stage is current the rail sits inside a COLLAPSED disclosure, so you
   cannot demonstrate it by loading the page. Do it last, or say you skipped it.

ALSO IN YOUR TERRITORY — three doorway rows that are defined and rendered nowhere:
`BecomeStorytellerRow`, `OpenShopRow`, `CreateSamahanRow` in app/dashboard/(launcher)/page.tsx
(~:2436/:2483/:2517, ZERO call sites app-wide). Two guards — open-shop/has-a-doorway.test.ts and
lib/the-controls-have-a-home.test.ts — assert the board carries those doors and are satisfied by
strings inside components nothing mounts. Nobody is stranded (the account menu still carries
"Your Story"), so the honest fix is either mounting a row or rewriting the assertion to check a
MOUNTED one. A guard satisfied by dead code is worse than no guard.

ALSO YOURS — FIVE ITEMS FROM THE APPLE-INVITES COMPARISON (see § 0b). They land here because they
are in files you already own, so they cost you almost nothing and would cost anyone else a
collision:
 AP-1 THE BOTTOM BAR VANISHES when you tap People or Spaces. `HomePillNav` is rendered in exactly
   ONE place — (launcher)/page.tsx:1455 — so every sibling route loses it. Lift it to the layout
   that covers those routes.
   ⚠ VERIFY BY SCREENSHOT, NOT BY QUERYING THE PAGE. The session that found this nearly filed a
   false "empty nav bar" off a DOM probe whose selector matched the wrong element and returned the
   SAME answer on a page where the bar is plainly visible. Only its control test caught it.
 AP-6 NAMES ARE CUT TO "Y…" ON A PHONE — several blocks in that same file.
 AP-7 HOME AND THE EVENT PAGE REPORT DIFFERENT "PLANNED" FIGURES (7% vs 0% was observed live).
   ⚠ NOBODY HAS TRACED WHETHER THAT IS ONE BUG OR TWO DIFFERENT MEASURES. Trace it first; you are
   already inside lib/progress-stages.ts for the After stub, so do them in one pass.
 AP-8 SECTION NAMES THAT NEED A HELP BUTTON TO BE UNDERSTOOD — copy only, SectionLabel.
 AP-4 THE COUPLE'S OWN PHOTO IS MISSING from the card people see when a story is shared
   (app/api/og/realstory-slug/[slug]/). Small, and nobody else owns that directory.

TERRITORY (do not edit outside it): dashboard/[eventId]/schedule/page.tsx · lib/checklist.ts +
checklist page · lib/customer-menu.ts · after/finished-event-summary.tsx ·
dashboard/[eventId]/vendors/page.tsx · dashboard/[eventId]/page.tsx · lib/budget-build.ts ·
lib/progress-stages.ts · dashboard/(launcher)/page.tsx + its _components/home-pill-nav.tsx ·
the dashboard layout that must host the pill · app/api/og/realstory-slug/** · those two guard tests.

Aim for 3 PRs now (the four original items · the Apple items · the OG card). No migration.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W1-B · Retire Pabati, and let the buy pages sell · **Opus 5 · xhigh**

```
🔓 **GATE SATISFIED 2026-08-22 21:57Z — #4708, #4711 AND #4723 ARE ALL MERGED, and production is
serving the last of them. YOU MAY START.** (Re-confirm with `gh pr view <n> --json state,mergedAt`
anyway — that costs seconds and this file rots.) (#4723 was opened on 2026-08-22
by the W0 session and touches app/papic/buy/actions.ts and the vendor-side photo-challenge buy
path — adjacent to the challenge libraries this retirement edits.) Both edit the exact files this
work deletes; landing an ~80-file deletion into that window makes a deliberate retirement
indistinguishable from the accident being repaired.

Read WHATS_NEXT_Studio_Is_One_Concept_2026-08-22.md in full. It carries the owner's rulings, the
enumerated scope and the traps. Four pieces, in this order, as separate PRs:

PR1 — RETIRE PABATI. Owner, 2026-08-21: "we do not need pabati. retire it because it is part of
papic." This SUPERSEDES PR #4704, which made it FREE hours earlier on an earlier instruction.
Safe by measurement: 0 greetings ever recorded, 0 sales ever, 1 challenge row of 631 — against 284
clip challenges that already do the job. The scope doc estimates ~50 files; the real count measured
2026-08-23 is ~80 EDITABLE files (92 matches, minus 8 test files and ~10 APPLIED migrations, which
are never edited).
  🔑 THE CAPABILITY DOES NOT DIE WITH THE PRODUCT. Convert the one library row (slug `pabati`,
     "Leave the newlyweds a video greeting") to capture_kind='clip' so a guest can still leave a
     greeting — recorded the way they record everything else.
  🚨 MAKING A SKU DISAPPEAR TAKES TWO HALVES OR YOU DO THE OPPOSITE. Free and retired are the same
     row in the catalog and opposite in the product. Deactivate the row AND remove it from
     FREE_FOR_ALL_SKUS in lib/entitlements.ts (and lib/v2/sku-catalog-v2.ts, lib/v2-catalog.ts,
     (shell)/pricing/page.tsx, onboarding-pricing.ts, persona-packs.ts, experience-personas.ts,
     api/v1/billing/initialize-maya/route.ts).
  🚨 lib/llms-txt.ts: drop PABATI from REQUIRED_RETAIL **and** its prose line, and update the
     hand-written test fixture IN THE SAME PR. Retiring a row that file still advertises THROWS and
     drops the whole AI/GEO document to its 603-byte stub. That has already happened in production
     once, with PAPIC_ADDON_STORIES.
  Also: delete app/pabati/, app/api/pabati/, lib/pabati.ts,
  lib/offline/service-handlers/pabati-handler.ts (+ its registration in sync-daemon.ts and
  offline/types.ts), app/[slug]/_components/pabati-prompt.tsx and its mount in site-body.tsx; drop
  the third member of CaptureKind in lib/papic-missions.ts and the `pabatiActive` threading behind
  it; drop the empty pabati_clips table (0 rows, follows the LED-backdrop precedent).
  ⛔ MUST NOT TOUCH: the Papic shot ladder (PAPIC_GUEST_100/PAPIC_GUEST/PAPIC_GUEST_10K/
     PAPIC_GUEST_20K) — owner-locked, features are free and SHOTS are the product;
     PAPIC_ADDON_THANK_YOU (₱2,499) stays paid; the `greeting` category and its 47 clip challenges,
     which are the replacement.
  ⚠ A CATALOG ROW IN PROD IS NOT WHAT THE MERGED MIGRATION SAYS — query the object; #4704's
     migration had not applied because nothing was deploying.

PR2 — NINE BUY PAGES HAVE NO HEADLINE. This is the complaint that started the stream: "i tried
unlocking setnayan AI ... it does not look appealing." Nine in-app pages take money and render no
visible headline: dashboard/[eventId]/studio/{papic, custom-qr-guest, editorial-pro,
indoor-blueprint, save-the-date, patiktok, setnayan-ai, website-pro, supplies-marketplace}. The
sell lines are authored and invisible ("Stop guessing who to hire").
  ⚖ THE FIX IS NOT PUTTING THE PAGE HEADER BACK. PageMasthead was deliberately reduced on
    2026-08-21 and is owner-locked and CORRECT for the ~380 pages a person lives in. A buy page is
    the opposite case — the person has not decided anything yet. Give those nine a hero of their
    own: product name, one-line promise, price, above the fold.
  🔑 RULE 0: app/_components/marketing/_doorway.tsx already solves this for the eight public
    product pages. PORT IT. Do not draw a new one.

PR3 — the Setnayan AI page: eight cards in a 3-column grid leaves an orphan last row and reads as
unfinished (setnayan-ai/_components/setnayan-ai-value.tsx ~:130); the price sits in a plain
sentence at the bottom of a tile (~:266). Same file as PR2 touches — do them together if simpler.

PR4 — the Studio rail rows are UNLIT (named debt, not an oversight). Lighting them needs ONE match
list spanning app/_components/frontdoor/front-door-shell.tsx (~:642 documents the hazard) and
dashboard/[eventId]/_components/event-rail-context.tsx: run separately, "3D Plan" (/seating/lab)
and the event menu's "Seat plan" (/seating) BOTH light, and two lit rows read as broken.

ALSO YOURS: the story page's gold eyebrows fail AA. app/[slug]/_components/editorial/
editorial-content.tsx has 10 `text-terracotta` hits (~7 eyebrow sites) plus 1 in living-moments.tsx.
In this repo the slot named `terracotta` is the GOLD #A9834B — measured 3.48:1 on the now-white
ground, below the 4.5:1 floor for 12px text. The component's own docblock names champagne-gold as
a deliberate editorial accent, so fixing one makes it the odd one out: treat it as a
whole-component call, not a rider. text-mulberry (4.61:1) or text-link (8.22:1) are the passing
slots. Check BOTH themes — a light-only contrast check waves through a token that flips on dark.

Migration: YES (deactivate the SKU + drop the empty table). Allocate forward with
`pnpm migration:new`. Dry-run against prod in a ROLLED-BACK transaction first — the PGlite replay
runs as superuser and will not catch a permissions problem.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W1-C · Make the paperwork true · **Sonnet 5 · medium**
*(It briefly gained two app-wide CSS items from the Apple-Invites comparison and was raised to
Opus. **Both were withdrawn on 2026-08-23 — they would have reversed an owner lock (§ 0b).** It is
documents only again, and Sonnet again.)*

```
Documents only. You will not touch app code, and no test can catch a mistake here — read carefully.

🛑 TWO APP-WIDE CSS ITEMS WERE BRIEFLY ADDED HERE AND ARE NOW WITHDRAWN — an app-wide typeface
change and a single strength of the action colour. BOTH WOULD HAVE REVERSED AN OWNER LOCK. The
front door's own stylesheet is headed "WHAT IS LOCKED HERE (owner 2026-08-11, this page only)" and
lists gold #8C6932 action buttons at 4.86:1 and "the SYSTEM typeface, not the app's serif", with
that stack authored explicitly as --fd-sys. See § 0b.
⛔ DO NOT REINSTATE THEM. Do not touch globals.css, front-door.css, home-reskin.css or
front-door-opening.tsx in this session. This session is DOCUMENTS ONLY.

2. RECONCILE THE ~28 PER-SURFACE PROTOTYPES to the shipped palette and the shipped app shell
   (corpus prototypes/*.html). RECONCILE, NEVER REDRAW: they are still correct about composition
   and carry only the old palette. A delta between a ported screen and its archetype is a defect in
   the PORT, not a fresh design decision.
   The palette, owner-locked: page ground is WHITE #FFFFFF since 2026-08-20 (the token is still
   NAMED `cream` — do not "fix" the name) · ink #2C2A29 · action #C24E25 · gold #A9834B is
   DECORATIVE AND UI-ONLY, never body copy · link #3B4E67. In this repo the Tailwind slot named
   `terracotta` is the GOLD and the action colour lives in the slot named `mulberry` — inherited,
   backwards, and the single most common colour mistake made here.
   ⛔ The 19 approved archetypes/overlays are BINDING (owner approved all 19 on 2026-08-04, no
   changes). Do not ask for them to be reviewed again.
3. ⚠ MEASURE BEFORE YOU EDIT — MOST OF THIS IS ALREADY DONE. Checked 2026-08-23: the ADOPTED
   privacy manual already carries the corrected retention row ("for life", no scheduled deletion,
   nothing ever deleted) and no claim of Philippine hosting was found in it. The one remaining
   "90 days" in that file is about MARKETING SAMPLES being removed within 90 days of revocation —
   a different, correct rule. DO NOT "fix" it. DO NOT edit the superseded DRAFT files; a DRAFT
   corrected to match today's ruling is worse than one that reads as history.
   Grep the whole pack yourself, list what genuinely still misstates something, and if the answer
   is "nothing", SAY SO AND STOP THAT ITEM — that is a result. The claim you may have inherited is:
   four rows say the data is in the Philippines —
   it is not: the database and the face vectors are in SINGAPORE, media is in APAC object storage,
   and NOTHING is hosted in the Philippines. Two rows still quote the retired 90-day rule; the
   ruling is: the full-resolution original is replaced by its compressed copy six months from the
   event's FIRST capture, never sooner than three months after the event ENDS, and the compressed
   gallery is kept free FOR LIFE. NO PHOTO IS EVER DELETED — only its resolution changes.
   ⚠ Wording that a regulator reads is the DPO's call, and the DPO is the owner. Apply the factual
   corrections; FLAG any sentence where the change is a matter of positioning rather than fact.

Done when: every prototype states the current palette, the pack contains no claim of PH hosting
and no 90-day retention, and you have listed for the owner exactly which sentences you changed and
which you flagged instead.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

---

## WAVE 2 — three at once

### W2-A · A guest can keep their code · **Opus 5 · high**

```
🔒 Needs W1-B merged — you share app/[slug]/_components/site-body.tsx.

Read WHATS_NEXT_Guest_Activation_2026-08-22.md IN FULL FIRST. This chain was mapped TWICE in one
session (74 agents, ~11M tokens) and the answer barely moved. DO NOT RE-RUN THE MAP. Its Section 1
lists 13 links that ALREADY SHIP — the personal QR exists the instant the guest's row is written,
the shared door works, Papic is free and on for every event, the day-only rule is enforced at the
upload, and the "confirm who you are, then you're in" screen the owner describes ALREADY EXISTS
fully written at /{slug}/welcome (fenced to plus-ones today). Rebuilding any of it is the
paid-twice mistake.

BUILD THESE SEVEN. Extend the named thing; never draw a new one.
1. A GUEST CANNOT KEEP THEIR QR. No save, download, print or copy — it is inline SVG, so a
   long-press offers nothing and a screenshot is the only way. And one of the three surfaces
   literally says "Save this to your phone" — a promise the page gives them no way to keep.
   🔴 RE-READ 2026-08-23 — THE OBVIOUS EXTENSION WOULD GIVE AWAY A PAID PRODUCT. The per-guest PNG
   at app/api/website/qr/guest/[guestId]/route.ts is NOT merely "account-gated": its own docblock
   says it requires the event to OWN a paid CUSTOM_QR_GUEST order (₱1,499), because that PNG is the
   BRANDED variant carrying the couple's Mood Board palette. Opening it to every guest hands out a
   sold SKU for free, which is a pricing decision and NOT yours.
   BUILD THE PLAIN ONE INSTEAD: an unbranded PNG of the guest's own QR, which is the thing the copy
   promises. Keep the branded, paid route exactly as it is. If you cannot separate them cleanly,
   STOP THAT ITEM, do the other six, and say the branded/plain split needs an owner ruling.
   ⚠ A dead "Download PNG" label already ships into every page's HTML from a menu registry,
   pointing at a route that does not exist and rendered by nothing. A grep of the live site will
   "find" a guest QR download that has never existed. Do not take it as evidence.
2. The web address under the QR is dead text — not copyable, not sendable (same QR block in
   app/[slug]/_components/site-body.tsx).
3. ⚠ RE-READ 2026-08-23 — THE PREMISE IS RIGHT AND THE DESCRIPTION IS WRONG. The screen
   (app/join/[eventId]/check-email/page.tsx, 47 lines) has NO button and NO link at all; the only
   way out is the shared wordmark in the door shell, which goes to the marketing site. It ALSO
   already says "You're already on the guest list — the link just lets you sign in later. You can
   close this tab."
   So: add a way INTO the celebration without contradicting that copy — it must not imply they must
   act. And check what they actually hold at that moment: they have no account yet, so confirm a
   guest session exists before offering a door that will refuse them. EXTEND the "Open your
   invitation" affordance its sibling app/join/[eventId]/success/page.tsx already has.
4. Nobody who joins is told they are ON THE LIST. The one visible status word is "pending", which
   reads as NOT FINISHED (rsvp-widget.tsx ~:375-382).
5. Nothing points a guest at the reply card, so the mobile / email / preferred-name boxes sit on a
   screen they never find. EXTEND the quick-link chips already on their summary card
   (guest-hub-bar.tsx).
6. 🔴 A GUEST CAN OVERWRITE — OR BY SAVING BLANK, ERASE — CONTACT DETAILS THE COUPLE TYPED.
   The front door refuses this (`.is('email', null)`, fill-a-blank); one screen later the
   protection is gone (app/[slug]/actions.ts ~:233 and ~:453 write unconditionally). That address
   is a SIGN-IN KEY, not a note. This is the one with real consequences — do it first.
9. A guest cannot say who they are bringing, though the couple is promised in writing that the
   name will arrive. No name ⇒ no row ⇒ no QR ⇒ no camera for that person.

⛔ DO NOT BUILD 7 AND 8 — they ride an OWNER DECISION (should the guest camera be free like the
rest of Papic?). One answer deletes both: the false "the host hasn't turned on Papic" message
(untrue on all five prod events) and the camera that shows a live viewfinder and only refuses
AFTER the shutter. Leave them; say in your summary that one owner answer closes both.

ALSO YOURS — three files in the same guest tree where a refused read renders as blank:
app/[slug]/seat/page.tsx (7 unbound reads, 0 error bindings), find-my-table/, and the unreachable
`photos` plate in _components/empty-states.tsx. Extend the existing _lib/silent-absence.test.ts.

ALSO YOURS — THREE ITEMS FROM THE APPLE-INVITES COMPARISON (see § 0b), all inside app/[slug]/**,
which is your territory and nobody else's this wave:
 AP-3 THE INVITATION READS LIKE A RECEIPT, NOT AN INVITATION — a monospaced data face where the
   editorial serif belongs. The guest-facing editorial stack (Cormorant/Manrope) deliberately lives
   outside the dashboard font scope; use it rather than inventing a third register.
 AP-9 GUESTS CANNOT SEE THE WEATHER for the day. ⚠ This needs a forecast provider chosen — an
   outside dependency and a small recurring cost. SCOPE IT, NAME THE PROVIDER AND THE COST, AND
   FLAG IT rather than signing us up to something.
 AP-10 GUESTS GET A LINE OF TEXT WHERE A MAP BELONGS.
   🚨 THE CSP CHANGE IN next.config.ts MUST BE IN THE SAME PR AS THE MAP. Our own CSP has already
   blocked our own map once: the vendor location map embedded OpenStreetMap, `frame-src` listed
   YouTube/Vimeo/Instagram/TikTok and not OSM, and the map was an empty grey panel on every shop
   page with coordinates from the day it shipped. OSM answered 200 — the browser refused the frame.
   A blocked iframe is the same family as every other refusal in this repo: the only symptom is an
   absence. There is a test that fails when an iframe host is missing; keep it fed.
 ⚠ ALL THREE WERE JUDGED WHILE SIGNED IN AS THE OWNER. THE GUEST VIEW WAS NEVER SEEN, and it is
   the view that decides all three. Look at the guest rendering first.

🪤 TWO SURFACES FOR ONE THING, TWICE in this stream already — the seat-finder vs the join door, and
the big QR CARD (phase-gated) vs the My QR BUTTON (not gated at all). ENUMERATE EVERY SURFACE
before reporting an affordance absent.

2–3 PRs. No migration.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W2-B · Delete what we said we would delete · **Opus 5 · xhigh**

```
Two retention promises are written, signed off by the owner as DPO, and NOTHING RUNS THEM. Read
WHATS_NEXT_NPC_Pack_Findings_2026-08-17.md first.

1. FACE DATA IS NOT ACTUALLY DELETED. The privacy pack says face data is deleted three months
   after the event ends; the pack's own text admits "ENFORCEMENT NOT YET BUILT" and there is no
   job in the lib/ job registry that does it. ⚠ CHECKED 2026-08-23: lib/retention-sweep.ts EXISTS
   but purges CHAT ONLY (5-year default, via purge_expired_chat) — it is not this. Copy ITS SHAPE:
   `claimPeriodicJob(<name>, WEEKLY_GAP_MS)` from lib/periodic-jobs, driven cron-free from request
   traffic, best-effort, never throws. lib/vendor-dossier-retention.ts is the other precedent.
2. A SUPPLIER'S ID IMAGE AND LIVENESS VIDEO ARE NOT DELETED 90 days after their decision. No job
   exists — the dossier-retention job covers Deep Search data, not identity files. These live in
   the vendor-verification object-storage bucket, which is separate from the media bucket and is
   NOT covered by the admin media screen.

THIS IS THE ONE PLACE IN THE PLAN WHERE OVER-DELETING IS WORSE THAN THE GAP. Both are irreversible
and both are legally load-bearing under RA 10173. Requirements:
- Compute "the event ended" from the ONE resolver the product already has — an event is over at
  06:00 in the venue's clock on the day AFTER its LAST day (event_end_date where a celebration
  spans days, else event_date). Do not invent a second definition; the product having two answers
  to that question is a defect this codebase has already paid for.
- The sweep must be idempotent, must log what it deleted, and must be provable on a seeded fixture
  BEFORE it can touch anything real.
- Ask "what un-does this?" at write time. A forward primitive with no inverse has bitten this repo
  before. There is no inverse here — which is exactly why the dry-run and the fixture matter.
- Prod holds 14 Papic photos and 2 shops. Test the boundary, not the volume: an event that ended
  yesterday, one that ended 89 days ago, one that ended 91 days ago.

⛔ NOT IN SCOPE: the compressed gallery, which is kept FOR LIFE, and the full-resolution
compression sweep, which already ships and is default-on. NO PHOTO IS EVER DELETED — only its
resolution changes. Face VECTORS are a different thing from photos; do not conflate them.

ALSO YOURS, READ-ONLY THIS WAVE: 15 privacy-pack findings were never verified because the
verification fan-out died on a usage limit. Verify them, write down what survives, and QUEUE any
fix that falls outside your territory rather than applying it.

2 PRs. No migration.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W2-C1 · The gold nobody can read · **Sonnet 5 · medium**

```
Mechanical sweep, one colour, admin only.

app/admin/** uses the gold as TEXT in **106 places across 51 files by the existing guard's own node
regex**, and **207 across 82 files by a plain `grep -rho "text-terracotta" app/admin`**.
⚠ BOTH NUMBERS ARE REAL AND MEASURE DIFFERENT THINGS. Say which method you used, and move THE
GUARD'S number to zero — the guard is what fails CI; the raw grep also counts icon uses and
comments, which are legitimately allowed to stay. On this product's white ground that measures 3.37:1, below
the 4.5:1 floor. In this repo the Tailwind slot NAMED `terracotta` IS that gold, and the real
action colour lives in the slot named `mulberry` — inherited and backwards, which is why this
mistake keeps being made. Reach for `text-mulberry` (4.61:1) or `text-link` (8.22:1).

RULES:
- Gold on an ICON stays — 3.37:1 clears the 3:1 non-text bar. Only TEXT moves.
- Check BOTH themes on any tinted block. `mulberry-700` measures 5.86:1 light and 3.05:1 DARK,
  because that slot flips on a dark panel; `mulberry-600` measures 4.92 / 5.78. A light-only check
  waves the dark failure straight through.
- BEFORE you sweep, an Opus session or your own first PR must land the guard, and the guard must
  be MUTATION-TESTED BY OCCURRENCE COUNT (print before → after). Two contrast guards have already
  missed a real AA failure in this repo — one checks token DEFINITIONS, the other only judges
  pairings where both sides are opaque, and the failure lived in the seam between them.
- Territory is app/admin/** and nothing else.

One PR. Report the occurrence count before and after; "106 → 0" is the deliverable.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W2-C2 · Ninety-five admin routes, one shape · **Opus 5 · high**

```
🔒 Start after W2-C1's sweep merges. Same territory: app/admin/** exclusively.

The admin console is ~95 routes and 33 raw tables, each screen effectively its own invention.
Converge them on ONE archetype. The 19 archetypes were approved by the owner on 2026-08-04 and are
BINDING — port them, never redraw. A delta between a ported screen and its archetype is a defect in
the port, not a fresh design decision.

RULE 0 APPLIES HARDEST HERE — the persistent app shell ALREADY SHIPS AND IS MOUNTED, and a session
was once told the opposite for six days. Before drawing anything, name the shell component, the
mounted navs, and the primitives that already exist. Rebuilding them is described in this project's
own docs as "the paid-twice mistake at its largest scale."

Also true and easy to miss: /admin/work is ALREADY the ranked work list and /admin/more is ALREADY
the all-surfaces map. Extend them.

3–5 PRs, one coherent group of routes each. No migration. Internal-only, so it ships last in its
wave and nothing customer-facing depends on it.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

---

## WAVE 3 — three at once

### W3-A · "You have none" must mean none · **Opus 5 · high**

```
🔒 Needs W1-A merged — you share dashboard/[eventId]/vendors/page.tsx.

About 30 screens in the couple's dashboard render a REFUSED read as an EMPTY FACT. The worst is
app/dashboard/[eventId]/vendors/page.tsx: 45 reads, none binding `error`. A couple reads "you have
no suppliers" and it is not true. The same class was already closed in two other trees — copy
those, do not invent a third pattern:
  apps/web/app/vendor-dashboard/reads-are-honest.test.ts (lane B, 31 reads / 16 files)
  and the explore/tour/papic/panood sweep (lane C, 20 reads) which shipped WITHOUT a per-tree
  guard — that omission is why this lane must ship one.

REQUIREMENTS
- Supabase DOES NOT THROW. It resolves with { error }. A try/catch around a read is decoration,
  and `?? []` turns a refusal into "nothing here".
- Distinguish the three states honestly: empty · could not be read · refused by permission. A
  failed count returns 0, and 0 looks exactly like "you have none".
- SHIP THE PER-TREE GUARD (app/dashboard/reads-are-honest.test.ts) and MUTATION-TEST IT BY
  OCCURRENCE COUNT. This repo has shipped at least six guards that passed while the thing they
  guarded was gone: one proved a card was imported not MOUNTED, one matched a file-level substring
  so a comment exempted the file, one could not fail at all. Assume yours is decorative until you
  have watched it go red.
- Fail toward the caveat. A partially-refused list must say so rather than present itself as
  complete — a coordinator once read only the vendor documentation shots under a card headed
  "Your gallery".

TERRITORY: apps/web/app/dashboard/[eventId]/** plus the new guard. 2–3 PRs. No migration.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W3-B · A supplier's card earns its keep · **Opus 5 · high**

```
🔒 Needs #4563 and #4699 merged (wave 0) — they hold vendor-dashboard files.
Read WHATS_NEXT_Card_Family_Handoff_2026-07-29.md first: 11 PRs already shipped in this stream and
its locked principles govern. Do not rebuild the maker, the card or the details sheet.

FOUR THINGS, smallest first:
1. MID-EDIT SAVE NAVIGATES AWAY and the clip pill shows a placeholder instead of the real duration
   (coverage-actions.ts, ShowcaseMediaFields). Small, no schema, do it first.
2. START FROM ONE OF YOUR CARDS. A vendor creating a new listing cannot copy an existing one —
   services/new/[category]/page.tsx takes only { claim? }. Owner asked for this on 2026-07-28.
3. "WHAT COUPLES ACTUALLY PICKED" on the Card Record. Verified absent: zero references to
   event_vendor_item_options anywhere. Needs a new table plus a write at lock time.
   🔒 THIS PUBLISHES AN AGGREGATE ABOUT OTHER PEOPLE'S MONEY. Apply the K-floor from the stream's
   own doc: below the floor, show NOTHING — not a rounded number, not "fewer than K". And the
   floor must be enforced in the QUERY, not in the component; a component-level floor ships the
   raw number to the browser.
4. REPLY-TIME BADGE + the count of celebrations this supplier documented. Same rule: a minimum-N
   floor, enforced server-side. A supplier with two replies must not get a badge implying a record.

⚠ PRICING AND CLAIMS ABOUT SOMEBODY ELSE: moving a partnership INTO a pricing claim re-asks the
partner and drops their acceptance — the same principle applies to anything you publish on a
supplier's behalf. If a number could be read as a claim the supplier did not make, do not publish
it.

Migration: YES (one new table). Allocate forward with `pnpm migration:new`. RLS at CREATE TABLE
time, using one of the 8 canonical patterns — no invented patterns. Another session is writing a
migration this wave; yours must touch only your new table and read chat_threads. Do not touch
event-type tables.

3 PRs.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W3-C · A wake is not a celebration · **Opus 5 · high · words drafted by Fable**

```
The owner already said yes to this (2026-08-17, "yes to all four"). Verified absent 2026-08-23: no
`funeral` anywhere in lib/event-type-profile.ts, lib/event-words.ts, or any migration.

A family arranging a wake or a funeral gets an event that never says "celebrate", never says
"party", never counts down to a happy day, and never offers a save-the-date.

THE WORDS ARE THE PRODUCT HERE. Draft every user-visible string with Fable before wiring anything —
a wake screen reading "Let's get this celebration started!" is not a copy bug, it is the entire
defect. Then wire them with Opus.

WHERE IT LANDS: lib/event-type-profile.ts · lib/event-words.ts · lib/checklist-event-type-defs.ts ·
a migration for the event type · and the guest-facing tone strings under app/[slug]/**.
🔒 You share app/[slug]/** with wave 2 — do not start until W2-A has merged.

THINGS THIS PRODUCT HAS ALREADY LEARNED, which apply directly:
- The onboarding flow ASKS WHAT IT ALREADY KNOWS. Do not add a screen that re-asks something the
  previous screen carried.
- Raw option keys have leaked to customers before (`1st_birthday`, `adult_regular` on screen).
  Every option needs a label, and the option type may not have a label slot — check before
  assuming the renderer can fix it.
- Removing a screen at runtime is NOT the way to drop a question: out of range is a render-time
  THROW, and removal disarms the "you already have one of these" walk-back.
- There is a settled checklist for adding an event type in the corpus. Follow it; do not derive
  a new one.

Migration: YES (event-type tables only — another session is writing a migration this wave against
a different table set). 2 PRs: schema first, then tone.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

---

## WAVE 4 — three at once

### W4-A · The four screens a couple lives in · **Opus 5 (first screen) → Sonnet 5 (the rest) · medium**

```
🔒 Needs W3-A merged — same tree.
MEASURE FIRST, DO NOT BUILD FIRST. This brief is partly eroded: the guests screen was reworked on
2026-08-22 and the app-wide header retirement touched all four. Re-diff each screen against its
approved archetype and report the REAL delta before writing code. If a screen already matches, say
so and skip it — that is a result, not a failure.

Guests · suppliers · budget · photos (app/dashboard/[eventId]/{guests,vendors,budget,alaala}/**).
The 19 archetypes are BINDING (owner approved 2026-08-04, no changes requested). RECONCILE, NEVER
REDRAW — a delta between a ported screen and its archetype is a defect in the PORT, not a fresh
design decision. Do not ask the owner to review them again.

Opus does the FIRST screen and establishes the pattern plus the guard. Sonnet repeats it for the
other three. If a screen needs a judgement call the pattern does not answer, it goes back to Opus —
it is not a repeat.

Palette, owner-locked: ground WHITE #FFFFFF (token still NAMED `cream`) · ink #2C2A29 · action
#C24E25 · gold #A9834B decorative only, never body copy · link #3B4E67. The slot named `terracotta`
is the GOLD; the action colour lives in the slot named `mulberry`. Check contrast in BOTH themes.

2–4 PRs after the re-measure. No migration. Do not edit vendors/actions.ts.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W4-B · Sixty-three supplier screens · **Opus 5 (the kit) → Sonnet 5 (the sweep) · medium**

```
🔒 Needs W3-B merged — same tree.

app/vendor-dashboard/** is ~63 screens built from 23 one-off components. Converge them on the
shared kit and the approved archetypes. Opus builds the kit and the first two screens; Sonnet
sweeps the rest behind a guard that has been mutation-tested by occurrence count.

RULE 0: the shell, the rails and the primitives ALREADY SHIP AND ARE MOUNTED. Name them before you
draw. Rebuilding a mounted shell is the largest-scale version of the paid-twice mistake in this
project's history.

Same palette rules as W4-A, both themes. The supplier is the person we are asking to trust us with
their business — treat the port as a trust surface, not a repaint.

4–6 PRs. No migration.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W4-C · Shut the doors nobody uses · **Opus 5 · xhigh**

```
You are the ONLY migration writer in this wave.

⚠ RE-MEASURED IN PRODUCTION 2026-08-23: **235** anon SELECT grants across 384 public tables — not
the ~290 the older brief says; batches have landed since. Re-run the count before scoping.
Anonymous read grants exist that nothing needs, plus two views flagged as carrying elevated
rights (events_host, vendor_completed_events) that have never been checked. Continue the existing
batch pattern: apps/web/tests/db/anon-table-grants-closed.db.test.ts records which batches have
landed, and its own note says the EASY category is now EMPTY. What remains is delicate — tables
whose policies merely exclude anon, several reached by the service role, where the damage is felt
only at runtime.

RULES THAT MAKE THIS SURVIVABLE:
- Small batches, one PR each, each proved before the next.
- READ THE COLUMN DEFAULT BEFORE YOU REVOKE. A revoke on a column whose default is the privileged
  value ships silent universal auto-approval — that exact trap was caught once here, and it would
  have been worse than the bug.
- A COLUMN-LEVEL REVOKE CANNOT CARVE A HOLE IN A TABLE-LEVEL GRANT — and it applies WITHOUT ERROR,
  so the only way to know is to MEASURE THE SURFACE BEFORE AND AFTER. This happened again on
  2026-08-22: the revoke ran clean and the freeze still reported the same anon privileges. The
  session DELETED its own migration rather than ship it, and checked at the POLICY instead — the
  table had no write policy admitting anon at all, so the grants were inert. DO THE SAME: if your
  revoke does not move the measured number, it is not a fix, and shipping it reads as a protection
  that is in place. Pick the tool by what the LEGITIMATE code must NAME: revoke the column when no client
  writes it; use a trigger when the value must exist but the browser must not choose it; tighten
  the policy when the caller legitimately names it with some legal values.
- RLS ENABLED WITH NO POLICY READS EMPTY, SILENTLY — 22 prod tables are already in that state and
  one product warning is dead because of it. Closing a door must not close a working feature.
- `auth.role()` CAN NEVER BE NULL IN THE PGLITE REPLAY (the shim returns 'anon' where prod returns
  NULL), so every `auth.role() IS NULL` privileged branch is dead code in every db test here.
  Derive from `current_user NOT IN ('authenticated','anon')` instead.
- Prove each revoke by BREAKING it: an insert or select that should now fail, that did pass before.
  Print the before → after.

3–5 small PRs. Verify each applied IN PROD BY THE OBJECT after merge.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

---

## WAVE 5 — two to three at once

### W5-A · A supplier's record survives a delete · **Opus 5 · max**

```
You are the ONLY migration writer in this wave. This is the most careful piece of work in the plan.

Read VENDOR_DATA_SURVIVES_DELETION_2026-08-21.md and the owner's rules in the project CLAUDE.md
(2026-08-21) before anything else.

WHAT ALREADY SHIPPED — do not rebuild: the sever-connections trigger, and the migrations that make
a review, the money and a quote outlive the event. A supplier can now answer a deletion request
(PR #4646, merged).

WHAT IS LEFT, AND WHY IT NEEDS MAX CARE:
- 152 of ~162 foreign keys to events CASCADE; only 10 survive. The 65-table classification is
  written up — and ITS ADVERSARIAL CHECK IS INCOMPLETE: 31 of 71 agents were cut off by a usage
  limit and the synthesis never ran. TREAT EVERY ROW AS MAPPED-BUT-UNVERIFIED. Verify before you
  migrate; that verification IS the first half of this session.
- "STORED" DOES NOT MEAN "SURVIVES". vendor_activity_stats is RECOMPUTED by unrelated events, so a
  saved snapshot silently drops to the smaller number. Pin it or the guarantee is cosmetic.
- `ON DELETE` SAYS NOTHING ABOUT `ON UPDATE`, and preserving a parent is an UPDATE.

THE OWNER'S RULE, VERBATIM IN EFFECT: on a SHARED record the vendor keeps it — contracts, payments,
completed bookings. Scoped: it does NOT convert the couple's private planning (budget, shortlist,
who they rejected) into vendor data. THE TEST IS WHETHER THE SUPPLIER TOOK PART IN IT. When a row
is ambiguous, do not decide — list it for the owner.

THE GATE IS IN THE DATABASE, NOT THE ACTION. DELETE on events is REVOKED from authenticated/anon
because there were six app delete paths and a seventh with none. Keep it that way; do not add an
app-layer guarantee the database does not keep.

Getting this wrong destroys a business's history permanently and there is no inverse. Every
migration dry-run against prod in a ROLLED-BACK transaction first — the PGlite replay runs as
superuser and will not catch a permissions failure.

2–3 PRs. Verify each applied IN PROD BY THE OBJECT.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W5-B · The surfaces nobody drew · **Fable (re-scope) → Opus 5 (build) · medium**

```
MEASURE FIRST. Part of this brief is now WRONG: the marketplace moved INSIDE the event on
2026-08-22 (owner: "marketplace is best shown inside an event, not when they just logged in"),
which reverses the 2026-08-12 rule this brief was written under. Re-scope with Fable before drawing
anything, and say plainly which parts of the old brief you are discarding.

ALSO ALREADY DONE, do not redraw: the sign-in and joining doors were ported to one shared shell
(13 of them). The auth half of this brief is finished.

WHAT IS GENUINELY UNDRAWN: the browsing surface, the guided tour, the deeper Papic pages (~11
public routes), and the onboarding questions' content. The 19 archetypes are BINDING — port, never
redraw.

⛔ THE TIER MATRIX IS NOT YOURS. Whether the ~450-cell supplier tier grid stays or goes is an owner
decision. Leave it exactly as it is and flag it.

🪤 A brief that says it was measured was wrong FOUR times in this stream's history — it drew six
public doorways where there are eight, missed that a sold product had no public page at all, and
got the folder count wrong. Re-measure every count you are about to design around.

2–3 PRs. No migration.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W5-C · Who is in my event? · **Opus 5 · medium**

```
🔒 Needs W4-A merged — same tree.
Three small things, all verified still true on 2026-08-23.

1. ONE SCREEN THAT ANSWERS "WHO IS IN MY EVENT". Today the answer is spread across five separate
   routes, all still separate. Build one screen above them; do not replace them.
   ⛔ THE BROADCAST HALF IS NOT YOURS — whether a coordinator nobody promoted may message all the
   guests is an owner decision. Roster only.
2. THE COORDINATOR'S "EDIT THIS SITE" IS A DEAD END. lib/owner-ribbon.ts (~:118) links
   unconditionally to an editor that gates on member_type='couple' (website/editor/page.tsx
   ~:118). They press it and are refused. Either don't show it or make it work — a control that
   refuses the person it is shown to reads as a broken product.
3. DURING A BROADCAST THE HOST CANNOT SEE WHO HOLDS EACH CAMERA — the control page says "Phone
   joined" with no name (panood/control/[eventId]/page.tsx ~:2276). The camera claim knows who
   claimed it.

ALSO YOURS — AP-11 FROM THE APPLE-INVITES COMPARISON (see § 0b): THE COUPLE FACES A BLANK BOX
WHERE THEIR INVITATION WORDS GO. Apple drafts them; we ask the couple to write from nothing. It
lands in this session because it touches dashboard/[eventId]/website/** and the Setnayan AI
surface, both of which collide with wave 1 and wave 3 territory — by now they are clear.
🔑 RULE 0 HARD ON THIS ONE. Setnayan AI is DETERMINISTIC, not a language model — check what it
already generates before assuming anything must be built, and check whether the story page's
auto-draft (which already writes a whole day up from the schedule and the photos) is the mechanism
to extend rather than a second one to invent.

🔑 A GRANTED CAPABILITY NOTHING CALLS IS A GATE WITH NO HANDLE — this repo has found five. Before
building any of the three, grep for a WRITER, not just a column or a function: the mechanism may
already exist with nothing calling it, in which case your job is the handle, not the gate.

2 PRs. A migration only if the camera claim genuinely lacks the name — check first.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

---

## WAVE 6 — runs ALONE

### W6 · The grab-bag, verified first · **Fable (verify) → Sonnet 5 (fix) · medium**

```
NOTHING IN THIS LIST HAS BEEN RE-VERIFIED SINCE 2026-08-06. Expect several to be fixed already —
in a comparable pass, 17 of 58 register items turned out to be done. VERIFY EACH ONE BEFORE
TOUCHING IT, and report the closures as results.

1. SHIPPED FEATURES WITH NO DOORWAY. The peer-comparison numbers page (no mount of
   funnel-benchmark.ts was found), the lucky-date card, the supplier's day-preload button. For
   each: does a person have any way to reach it? If not, add the doorway — do not rebuild the
   feature.
2. The remaining cleanliness items 4–14 from WHATS_NEXT_Cleanliness_Findings_2026-08-06.md —
   saving an event type disabling the website, two queues ordered opposite ways, a dead marketplace
   switch, duplicate converters and readers.
3. Three on-the-day gaps: a supplier can only send the coordinator one of six fixed messages; a
   photographer cannot see their own shots after the day; the band-as-emcee package does not reach
   the coordinator's message box.
4. Anything queued for you by W2-B's privacy verification.
5. AP-12 FROM THE APPLE-INVITES COMPARISON (see § 0b): EMPTY SCREENS READ AS UNFINISHED RATHER THAN
   DELIBERATE. This is deliberately broad, which is why it is here — you run ALONE and may claim
   any file. 🔑 DO NOT DESIGN A NEW EMPTY STATE: the pattern already exists and that session called
   it the best-designed screen it saw — app/dashboard/(account)/samahan. PORT IT.
   ⚠ Prod is pre-launch, so MOST OF THESE SCREENS ARE EMPTY BECAUSE THAT IS THE PLAN. You are
   improving how emptiness READS, never removing it, and never reporting it as a defect.

⛔ THE "NOT-WORK" LIST IN THAT FILE IS LOAD-BEARING. 18 files are parked ON PURPOSE, 3 are reached
by CI rather than by imports, and a 4,100-line "dead" wizard is LIVE — an audit once recommended
deleting it, which would have broken a working screen for couples. Do not tidy anything that list
names.

Fable verifies; Sonnet fixes what survives; anything touching a migration, a permission, a deletion
or money goes to Opus instead. 3–6 tiny PRs. Nothing else runs while you do this, so you may claim
any file — one at a time.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```
