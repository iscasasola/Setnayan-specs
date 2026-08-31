<!-- Session register for the shots-per-guest build. Written 2026-08-28 at the end of the
planning session, after the build worktree was lost. Read this FIRST, then the build spec
`WHATS_NEXT_Shots_Per_Guest_2026-08-28.md`, which carries the evidence for every claim. -->

# Shots per guest — SESSION REGISTER (2026-08-28)

> **Six sessions. Every decision is already made — do not re-ask any of them.**
> The build spec is [`WHATS_NEXT_Shots_Per_Guest_2026-08-28.md`](WHATS_NEXT_Shots_Per_Guest_2026-08-28.md);
> it carries the file:line evidence, the traps, and the test plan. This file says **who builds
> what, in what order, and what may not run alongside what.**

---

## 🛑 READ THIS BEFORE ANYTHING — S1 WAS BUILT AND THE CODE WAS LOST

S1 below was **written, proved and never committed.** The build worktree lived under `/tmp`, the
session ended, and the directory went with it. **No commit was ever made and nothing was pushed** —
verified: the branch existed pointing at `origin/main`'s tip with zero commits, and it has been
deleted rather than left as a decoy.

🔑 **THE RULE THAT WOULD HAVE SAVED IT, and this corpus already contains it in another form
(*"commit before you mutate"*): COMMIT AND PUSH THE MOMENT A CHANGE TYPECHECKS OR SOONER. A branch
with an ugly WIP commit on the remote survives anything; a perfect working tree in `/tmp` survives
nothing.** Do not batch a session's work into one commit at the end.

⚠ **And do not build in `/tmp` again.** Put the worktree beside the repo
(`~/Documents/Claude/Projects/wt-<name>`), which is where every other worktree in this project
lives — see `git worktree list`.

**Nothing about the DESIGN was lost** — §§ 1–10 of the build spec were written first and are
committed. S1 is a re-run of known work, not a rediscovery. What it did, exactly, is in the spec's
§ 1 and in the S1 row below.

---

## The six sessions

| # | What a person gets | Touches | May run beside | Never beside |
|---|---|---|---|---|
| **S1** | The guest's camera stops enforcing a limit that does not exist | TS only — no schema | S3 | S4 (same component) |
| **S2** | The limit becomes real, in shots, where it cannot be got around | SQL + storage | S3 | S1 · S5 |
| **S3** | The couple names guests and sets the numbers | the Papic control centre | S1 · S2 | — |
| **S4** | The guest sees their real number, and an honest “no” | the camera + Event Hub | S3 | S1 |
| **S5** | A guest who buys chooses: keep them, or give them to the room | the buy panel | S3 · S4 | S2 |
| **S6** | ✅ **BUILT** ([#5024](https://github.com/iscasasola/setnayan-platform/pull/5024)) — the promotion page may finally say it | `/papic` | anything | — |

**Order that matters:** S1 → S2 → S3 → S4 → S6. S5 may land any time after S2.
⛔ **S3 must not merge before S2** — *gate the write, not the button*. A control that saves a
number nothing enforces is the `papic_uploads_open` defect this tree has already paid for once.
⛔ **S6 must not merge before S3 and S4 are SERVED in production**, not merely merged. A limit a
guest cannot see is § 1's defect wearing a new number.

---

## S1 · The browser stops lying  *(redo — no schema, no feature)*

**The defect** — spec § 1. `papic_record_guest_capture` folds two conditions into `v_unlimited`;
`fetchGuestQuota` mirrored only the first, so the per-guest 150 is inert server-side on every
celebration while the browser still counts down to it, hides its own shutter and says *"That's all
150 photos!"*. The route does **not** pre-check `remaining` — the browser was the only enforcer.

**What to build, as it was built:**
1. `fetchGuestQuota` asks **both** disjuncts (`eventHasPapicUnlock` **and** `readEventPoolStatus`)
   and combines them exactly as the SQL does. It returns `capApplies` (the inverse),
   `poolRemaining` and `poolLow` beside the existing fields.
2. The camera draws a personal countdown, and may hide its shutter, **only when `capApplies`**.
   Otherwise: nothing, or **“Running low”** once the pool crosses its own soft-stop.
3. **Both** 409 handlers (photo *and* clip — two copies) split *your allowance is spent* from
   *the celebration is spent*. Distinct overlay and footer copy for the pool case. Offering more
   shots stays right in both — that is what an empty pool is for.
4. Threaded through `app/[slug]/_lib/loaders.ts` and `site-body.tsx`, which mount the same camera.
5. 🔑 **Collapse the duplicated shape.** `GuestPapicCamera` in `app/[slug]/_lib/types.ts` and the
   inline declaration in `loaders.ts` were two copies of one shape — *the same disease as the bug*.
   Make `types.ts` the only declaration and have the loader import it.

**Guard** — `lib/papic-guest-quota-mirrors-sql.test.ts`, 6 assertions, all 8 mutations RED, printed
before → after. Test 1 **derives the disjunct list from the migration** rather than restating it, so
a third condition added in SQL fails until the TypeScript learns it too.
⚠ **Count BOTH plpgsql write forms** — `v_unlimited :=` *and* `SELECT … INTO v_unlimited`. Counting
only `:=` reports 1, and that is how this guard first lied to itself.

**Checked and deliberately NOT changed:** `app/papic/decorate` posts to the same route and looked
like the same bug. It is not — it keys on the refusal's **status** rather than the bare 409, which
is precisely the rule the camera's own docblock says it broke. Leave it alone.

**Also verified green in that session:** `papic-capture-has-a-ceiling` · `putaway-stops-captures` ·
`guest-cameras-open-when-the-host-says` — 29 tests, all passing over the edited files.

---

## S2 · The limit becomes real  *(money logic — one atomic PR)*

> ✅ **BUILT 2026-08-30** — migration `20271184624871_papic_shots_per_guest_ceiling.sql`,
> branch `claude/shots-per-guest-ceiling`, opened as a **DRAFT with no auto-merge** (money
> logic; the owner looks first). 22 db tests + 4 unit tests, **18 sabotages all RED**, and a
> `BEGIN…ROLLBACK` dry-run against production in the PR body: the migration applied clean,
> `papic_event_pool_status` returned byte-identical rows for every event, all three new
> columns came back `select=true update=true in_events_host=true`, and **the ceiling refused
> a real capture on an event whose pool applies while the pot sat untouched at 5,050** — the
> exact condition under which four previous limits on this surface shipped governing nothing.
>
> **Three claims in the spec measured FALSE and corrected in it:** two live overloads, not
> three · a defaulted parameter beside an existing overload raises `42725` **and the route's
> fallback regex matches that error**, so it would have silently recorded every clip as a
> photo · `papic_event_pool_status.guest_count` is hard-coded 0 on every grant-driven event,
> so the equal share would have divided by zero.
>
> ⛔ **ONE THING DELIBERATELY NOT BUILT, for the owner:** § 7d's "admit a drained offline
> capture above the ceiling". The only signal that a POST is a replay is a field the client
> sets and this RPC is `anon`-callable, so honouring it would put a *skip the ceiling* switch
> on the public surface — the negation of this session's own title. Shipped closed, with the
> refusal classified **non-terminal** so the shot waits visibly and lands if the couple
> raises the number or releases. Owner to choose.
>
> ⏳ **S3 is unblocked** — the contract (column names, the two RPCs, the arithmetic) was sent
> the moment it was stable. `events.papic_guest_spend_ceiling_on` carries one temporary line
> in `gates-have-handles.baseline.txt`, because the switch necessarily merges one PR ahead of
> the sheet that flips it; that guard's own staleness test deletes the line when S3 lands.


Spec §§ 2–5. Storage, the stored per-capture cost, the gate, and the release.

- **Storage:** the per-guest allotments (mirror `papic_seat_allocations`' shape), the on/off switch,
  the optional “everyone else” number, and the release stamp. New `events` columns need
  `GRANT SELECT (col)` **and** `GRANT UPDATE (col)` **and** the `events_host` view rebuilt —
  `lint-events-column-grants` is the only thing that catches a miss.
- **`papic_guest_captures.points_cost`**, written by the record function from the cost it is
  already given. **Never derive the clip bands in SQL** — that is a second copy of a money rule.
- **The gate, inside `papic_record_guest_capture` and nowhere else** — it is the one object an
  anonymous direct caller still reaches. `CREATE OR REPLACE` the newest body; **do not add a
  fourth overload** (three exist, plus a signature-fallback ladder that would silently skip a new
  one). **Never take the ceiling from the caller.**
- **The yield becomes conditional:** the pool only disarms the per-guest gate when no ceiling is set.
- **The release** (owner 7a): a manual stamp **and** an automatic one in the celebration's last
  stretch. It opens tiers 2 and 3 — **never a named guest's allotment** (owner 7c).

**Proof:** dry-run the migration against prod inside `BEGIN…ROLLBACK`, transcript in the PR body —
`service_role` is `BYPASSRLS` in the replay and tests run as superuser, so a forgotten grant passes
green there. And **prove the ceiling BINDS on a real pool event**; four limits on this exact surface
have shipped governing nothing.

---

## S3 · The couple sets the numbers

Spec § 6a. A `SettingRow` in “Set once, change any time”, opening a sheet: the switch, a number for
everyone else, **naming guests off the guest list and giving each an amount** (the real new UI), a
live *“120 guests · 8 named · everyone else gets 14 each · 32 spare”* line, and the
**“open the rest to everyone”** button.

- Copy the save path of `setPapicUploadsOpen` exactly. **Post the value, never flip what you last
  saw.** *“A blank box is not zero.”*
- ⚠ `shots_set` / `shots_error` are **already taken** by `setCameraShots` — pick new param names,
  and wire them **three ways** or `outcomes-are-shown.test.ts` fails.
- The row must not render on a celebration where guests cannot shoot.

---

## S4 · The guest sees it

Spec § 6b. The pill shows their real number in **shots**; a **“running low”** state before zero
(the camera has none today — the seat camera's soft-stop is the precedent); and the two honest
refusals wired to S2's own status, asked **before** the generic 409 branch, in **both** handlers.

⚠ The offline queue drains later, so a queued shot spends against the ceiling minutes after the
counter moved. The counter is advisory; the function is the truth. Say so in the docblock.

---

## S5 · The buyer chooses  *(owner 7b)* — ⚙ **GATE HALF BUILT 2026-08-31, PR [#5034](https://github.com/iscasasola/setnayan-platform/pull/5034)** (held DRAFT + `do-not-auto-merge`)

At the moment a guest buys: **keep them for me** (their money, outside the couple's limit) or
**add them to the celebration** (into the shared pot; they revert to an ordinary share).

🔑 **THE CHOICE WAS ALREADY SHIPPED — WHAT WAS MISSING WAS THE GATE HONOURING IT.**
`app/papic/_components/papic-buy-shell.tsx` has offered both buttons since 2026-07-29 (*"This
camera only"* → `one_reload`, *"Everyone's pool"* → `pool_topup`) on both live capture surfaces.
But `papic_record_guest_capture` metered `SUM(points_cost)` over **every** capture with no
distinction of funding source, so a NAMED guest who chose *keep them for me* had the shots she
paid for counted against the couple's number and was refused early — **her own purchase consumed
by somebody else's limit.** Fixed by migration `20271185324597`, which derives the funding source
from stored state (`papic_seat_point_usage.points_used`, bounded by the seat grants traceable to
her own `papic_guest_orders` rows of kind `one_reload`).
⛔ **Never from the caller.** `papic_record_guest_capture` is anon-callable, so a client-settable
*"this one is mine"* would be one word past the ceiling entirely.

❌ **CORRECTION 2026-08-31 — THE MECHANISM NAMED BELOW WAS WRONG, IN BOTH HALVES.** The line used
to read *"✅ `papic_dedicate_shots` takes a TARGET, not a delta … this is that call in the pot
direction. Nothing new."* Measured against the shipped functions:

- **At purchase, `papic_dedicate_shots` is not involved at all.** The two choices are two
  different ORDER KINDS, resolved at approval: a `pool_topup` lands a SHARED grant
  (`papic_event_point_grants.seat_id IS NULL`, via `grantPapicPassPoints`); a `one_reload` lands a
  SEAT-scoped grant (via `papic_grant_camera_points`). That is what makes *add them to the
  celebration* mean the pot.
- **And the "give the unspent part back later" half is NOT buildable that way.**
  `papic_dedicate_shots` reads and writes `papic_seat_allocations` ONLY — the host's hand-out
  layer. A guest's purchase is a *grant*, which that function cannot reach: on a camera whose
  dedicated balance is entirely grants the allocation row is `0`, and the function rejects
  `p_points < 0` outright. So *"nothing new"* was true for the purchase choice and false for the
  release. **A buyer-side release of unspent bought credits remains UNBUILT and needs its own
  primitive.** ⏭ Owner call whether it is wanted at all.

🔴 **AND IT WAS NOT MERELY UNBUILT — IT WAS BUILT WRONG, SHIPPED, AND WENT LIVE.** PR
[#5028](https://github.com/iscasasola/setnayan-platform/pull/5028) (merged 2026-08-31) added the
guest-facing *"Give the unused N to the celebration"* button on `papic_dedicate_shots`, from the
§ 7b line above **before** it was corrected. Reachable by real guests —
`NEXT_PUBLIC_PAPIC_GUEST_BUY` is ON in production. Measured: her balance **137 → 178** (+ her own
spend) and the couple's shared pot **3,050 → 3,009** (− the same), while the button offered 96.
**Removed 2026-08-31 by PR #5038**, which also lands the two guards that keep it removed.
✅ **AND THEN REBUILT THE SAME DAY, CORRECTLY, BECAUSE THE OWNER ASKED FOR IT.** Shown what the
feature actually was, he said *"oh sounds nice. yes allow that."* — so the open call above is
CLOSED. Migration `20271185813837` adds `papic_seat_grant_releases` (a third composed layer),
`papic_seat_releasable_grants` (ONE expression, displayed by the panel and re-evaluated by the
mover under its row lock) and `papic_release_seat_grants` (takes NO amount). Details in § 7b of the
main doc. The removal PR's guard was **re-aimed, not relaxed** — two of its three tests asserted
the path was ABSENT, which stopped being the rule; it now asserts the properties that make the
rebuild correct, and every one of them is narrower than what it replaced.
🔑 **THE PR'S OWN TESTS WERE GREEN.** They were written from the same wrong premise and never
built a grant-funded camera — every one exercised the allocation column, where the primitive is
correct. *A test that shares the defect's premise cannot see the defect.*

⚠ **What a camera has already SHOT can never come back.** The buyer's screen must say so.
⚠ Verify `NEXT_PUBLIC_PAPIC_GUEST_BUY` in the hosting settings before assuming the buy panel is
reachable — a flag's default in code is not its value in production. *(Verified 2026-08-31: it is
**ON** in the real Vercel Production environment.)*

⏭ **STILL OPEN ON S5, FOR THE OWNER, NOT ENGINEERING:** credits the **host** hands a guest's
camera (`papic_seat_allocations`) still count against her ceiling — they are the couple's own pot
money, and the 2026-08-28 ruling is about *"a guest who **buys** credits"*. A couple who both name
her at 20 and hand her camera 200 have given two contradictory instructions and the tighter one
wins. Whether a hand-out should lift her ceiling the way her own purchase does is one predicate
away, and is his decision.

---

## S6 · The promotion page  — ✅ **BUILT 2026-08-30, PR [#5024](https://github.com/iscasasola/setnayan-platform/pull/5024)**

**The gate was verified, not assumed.** S6 could not merge until S3 and S4 were SERVING, and they
are: `#5002 · #5017 · #5014 · #5019` are all ancestors of `0d0b265`, whose Vercel deployment is
`READY`, `target: production`.

**What shipped is ONE SENTENCE in the existing "Let the whole room shoot" card** — not a section.
Verbatim: *"You can decide how many credits one guest may spend — name the few who should have
more, and the rest split what is left evenly. Nothing is carved out, so whatever a guest doesn't
use is still there for everyone else."* Credits, not shots; no fixed number, because the couple
picks it.

🔑 **THE SECOND HALF IS TRUE BY CONSTRUCTION, WHICH IS WHY IT IS SAFE TO SELL.** The ceiling is a
CEILING, NOT A RESERVATION — `20271184624871`'s own header: *"Nothing is carved out of the pot; no
guest holds a wallet; unspent credits stay shared."* There is no release to wait on and no way for
the sentence to drift out of true unless the mechanism itself changes. **A marketing claim grounded
in the mechanism rather than the intent cannot rot.**

📏 **MEASURED AT 375px, BOTH REVISIONS ON ONE SERVER** (Vercel skipped the preview build):
**10,803px → 10,903px, +100px · +0.9%.** Live `/papic` is 11,133px, so it lands at ~11,233px — down
from the 12,847px of 2026-08-29, not back toward it. The base section measures **428px both
locally and in production**, which is what makes the local delta trustworthy.

🚨 **AND THE COPY GUARD CARRIED A FALSE MECHANISM — worth more than the copy.**
`papic-page-says-only-what-is-true.test.ts` claimed `stillSayable` *"pins the chapters line so a
later reader cannot tidy a true claim off the page."* **IT DOES NOT.** `stillSayable` asserts a
pattern does not FIRE on a true sentence; **nothing asserted the sentence was present.** Measured by
deleting the claim: every `stillSayable` test stayed green, and exactly one test noticed — the new
one. ⚠ **The chapters line is still unpinned.**

Two prohibitions were rewritten rather than deleted: *"a per-guest shot limit — not built yet"*
became *"a per-guest number the couple did not choose"* (never print a figure; the sponsor default
is a PLACEHOLDER, never an allowance), and a tenth was added — claiming we **invented** per-guest
limits, which a rival ships. Ratchet `>= 9` → `>= 10`.

⚠️ **CROSS-PROGRAMME:** `build-sessions/C7.md`'s do-not-claim list still reads *"per-guest photo
limits — unbuilt, and a rival has them"*. C7 is unrun and rewrites `HOME_TITLE` and the llms-txt
prose; its prompt would forbid a claim we now ship. Not edited here — that file sits inside open
PR #5023.

---

*Original brief, kept because it is what was asked for:*

Spec § 6c. The claim: *decide how many shots each guest gets, and whatever they don't use goes back
to the room.* ⛔ **No explaining line under the headline** — the kicker/lede were removed by owner
ruling 2026-08-19.

Independent of this feature and already drawn in
[`prototypes/papic_promotion_page_2026-08-28.html`](prototypes/papic_promotion_page_2026-08-28.html):
the 16-rung price wall cut to three, that block finally given a heading, and “Two ways to run it”
moved above it. **That drawing may ship on its own at any time** — it needs none of S1–S5.

---

## Rules for every session here

1. **Branch, then `git worktree add` immediately**, beside the repo — never in `/tmp`.
   **Push the branch before you go deep.**
2. **`pnpm install` in the worktree first.** A run in an uninstalled worktree means nothing.
3. **Print `TSC_EXIT` beside the error count.** An empty `tsc` log is not a clean one — it exits
   **144** on abort, and two concurrent typechecks will cause exactly that.
4. **Require `# tests` to be NON-ZERO** before believing any pass.
5. **Mutation-test every guard and print the occurrence count before → after.** An unmeasured
   sabotage proves nothing. ⚠ For an *append* mutation the anchor count does not move — prove it
   landed by the result changing, and say which measure you used.
6. **`git fetch` and read the new tip before building** — another session works this repo, and
   `origin/main` moved twice during the planning session alone.
7. Changelog fragment in `changelog.d/`, never `CHANGELOG.md` or `STATUS.md` directly.
8. Auto-merge is the standing default (`gh pr merge <n> --auto --merge`) — **except S2**, which
   moves money logic and should carry its prod dry-run transcript for a look first.

---

## 🚨 TWO TRAPS THIS STREAM PAID FOR, AND THEY ARE THE SAME DISCIPLINE

Added 2026-08-30 by oversight. Both were hit by a session that was measuring carefully at the
time — that is what makes them worth writing down. Each is **a true observation carrying an
invented consequence**, which is the exact shape of the migration-prefix belief the code repo's
`CLAUDE.md` says this project has now paid for twice.

**1. AN ABSENT MECHANISM IS NOT A MISSING MECHANISM UNTIL YOU LOOK WHERE ELSE IT COULD LIVE.**
S3 observed — correctly — that `lib/supabase/admin.ts` carries no `import 'server-only'` line, and
concluded it was unprotected: *"672 importers held together by a comment."* FALSE. The protection
lives in a different file: `apps/web/scripts/lint-server-only-boundary.mjs` names it in
`EXTRA_BOUNDARY_MODULES`, and that entry's own comment says it *"is what makes that a mechanism
instead of a sentence."* Somebody had already done the job, and left a note saying so.
🔑 Caught only because a sabotage expected to prove the pin was load-bearing went red naming
something else. **Before reporting a missing guard, grep for the property, not for the idiom.**

🔄 **IT HAPPENED AGAIN THE SAME DAY, TO OVERSIGHT, AND THE SECOND INSTANCE NAMES THE
MECHANISM.** Asked whether a rule capped concurrent build sessions, oversight grepped the session
register, the items 3–7 handoff and the build order, found nothing, and told a session *"there is
no rule anywhere."* **FALSE.** The rule is real and its recorded price is 44 defects:
`BUILD_SESSIONS.md:124` — *"Never more than TWO build sessions at once. Ten parallel builds once
shipped 44 defects"* — scoped to the C-programme, not to this stream, which is why the conclusion
survived and the premise did not.

🚨 **WHY NO SEARCH COULD HAVE FOUND IT: THE FILE IS UNTRACKED.** `git grep` cannot see it,
a corpus grep cannot see it, and no session on another machine can see it at all. **An untracked
register is not merely at risk of being lost — it is UNSEARCHABLE, so the rules inside it silently
do not bind anyone who did not happen to open that file.** That is a sharper argument for
committing such a file than data-loss is.

## 🚨 “DO NOT ARM AUTO-MERGE” IS NOT A HOLD ON THIS REPO

**Recorded 2026-08-30, after running a four-PR hold all day on a mechanism I had
misread.** `.github/workflows/auto-merge.yml` (`auto-enable-automerge`, owner
2026-06-14) **ARMS AUTO-MERGE ON EVERY NON-DRAFT PR, AUTOMATICALLY.** So telling
a session *“do not arm auto-merge, I will merge you”* controls nothing: the
moment it runs `gh pr ready`, the workflow arms the PR and branch protection
merges it as soon as the checks go green.

That is exactly how S4's #5019 merged — correctly, and with nobody at fault. The
session confirmed `autoMergeRequest: null` before undrafting, precisely as
instructed. **Undrafting is what armed it.**

🔑 **THE DRAFT WAS LOAD-BEARING, NOT THE INSTRUCTION.** The hold held for S2, S3
and S4 only because they were also told to stay drafts. Had any of them undrafted
on green CI — a reasonable reading of *“undraft when green”* — it would have
shipped without the overseer ever seeing it.

✅ **THE REAL HOLDS, from the workflow's own comment, in order of safety:**
1. **Label `do-not-auto-merge`** — PREFERRED, and *the only one that is safe*,
   because it works **at any time, including on an already-armed PR**: it fires
   the `disarm-on-hold-label` job, which actually runs `gh pr merge --disable-auto`.
2. `DO NOT AUTO-MERGE` in the title.
3. Open as a DRAFT — the workflow skips drafts. **A hold only for as long as
   nobody undrafts.**

⚠ And that recovery job is NEWER than the comment describing it: before
2026-08-07, labelling an already-armed PR did nothing — **which is how #4186 and
#4209 merged while wearing the label.**

⇒ **If a PR genuinely must not ship without a human — money logic, a migration,
anything irreversible — LABEL IT.** Do not rely on an instruction to a session,
and do not rely on draft status alone.

---

## 🚨 THE ONE RULE THE WHOLE 2026-08-30 SESSION WAS PAYING FOR

**A SINGLE GREEN MEASUREMENT IS A HYPOTHESIS, NOT A RESULT.** Every expensive moment of that day
was a tool answering confidently while measuring nothing — and in every case the fix was **a second
measurement taken a DIFFERENT WAY**, not a more careful look at the first.

| what reported success | what it was actually doing | what caught it |
|---|---|---|
| `noComments` / the shared stripper | blanked 16,218 chars of a file down to 6,430 — six guards asserting against nothing | TypeScript's own parser as an oracle over 4,735 files |
| the phantom-column scanner | went blind to `.select(CONSTANT)` — 74 selects unchecked, reporting green | resolving the constants and re-counting |
| a mutation that reported **SKIPPED** | the sabotage never landed; read like a working guard | printing the occurrence count **before → after** |
| a test at 500 credits | right answer and wrong answer both rounded to 505 | re-running with the values **pulled apart** (1,000, differing by 55) |
| `TSC_EXIT=134` / `144`, empty log | heap exhaustion and killed processes, indistinguishable from a clean pass | printing the **exit code beside** the error count |
| *“0 orders that were ever paid”* | true when written, false within two days, repeated three times | `select count(*)` against production |
| a `grep -c` returning **0** | oversight nearly reported a clobber that never happened | comparing **blob hashes**, which were byte-identical |
| a green CI run | belonged to a commit older than the push being described | checking the **head SHA** the run belongs to |
| a local checkout | 2,237 commits behind the branch it claimed to measure | `git merge-base --is-ancestor` against a fetched `origin/main` |

🔑 **THE PATTERN: THE FIRST TOOL AND THE DEFECT SHARE A BLIND SPOT.** A grep cannot see what
a grep mis-parses; a stripper cannot report the code it deleted; a CI badge cannot know which commit
you meant. So the confirming measurement must come **from a different mechanism** — a compiler
instead of a regex, a hash instead of a match, a database instead of a document, a count printed
before and after instead of a pass/fail.

### Two more detectors, 2026-08-31 — both from the replay-ordering session

**1. ONE RUN OF A VARIABLE QUANTITY IS NOT A MEASUREMENT.** That session first
reported its change cost the test suite *"+29 s (+5.8 %)"*. Re-measured on the
rebased base it read **+189 s (+40 %)** — and two runs of near-identical code
differed by **131 s**. Whole-suite wall clock on a laptop is noise with a number
attached. It republished the **per-replay** figure (~6.0 → ~7.8 s, median of 3
each) as the reliable one and printed BOTH suite pairs rather than the flattering
one. ⇒ Before quoting a duration as a cost, run it more than once and see whether
the spread is smaller than the effect. If it is not, that number is not evidence.

**2. `--listFiles` AS A POSITIVE CONTROL FOR `tsc`.** An empty typecheck log is
not by itself a clean one — this register already records `TSC_EXIT=134/143/144`
producing silence. The session added the missing half: `tsc --listFiles` proves
the compiler actually LOADED the files you changed. Exit code says it did not
fail; `--listFiles` says it did not skip. ⇒ Use both when a typecheck is the
evidence for a claim.

🪤 **AND ONE FROM OVERSIGHT, THE SAME DAY, WHICH IS THE WORST-SHAPED OF THE THREE:**
`gh api actions/runs?head_sha=<ABBREVIATED SHA>` returns a clean `total_count: 0`
— valid JSON, no error — because GitHub matches `head_sha` EXACTLY and a 9-char
prefix matches nothing. Oversight used that zero to tell a session its correct
finding was measured with a bad instrument, and invented a plausible mechanism to
explain the number its own malformed query had produced. The full 40-char SHA
returned **6**. ⇒ **A healthy PR would have returned 0 to that query too**, so the
number could never distinguish the case feared from the case hoped for — which
means it was never evidence. Ask what the check would print if the thing you fear
were FALSE; if the answer is "the same", you have not measured yet.

**4. 🐚 THE SHELL CAN MANGLE YOUR QUERY AND RETURN A CLEAN NOTHING.** This shell
is **zsh**, and in `git show "$BRANCH:apps/web/..."` the `:a` is eaten as a zsh
PATH MODIFIER. The command that actually ran was

    git show '/Users/…/setnayan-platform/origin/claude/papic-credit-estimatepps/web/lib/…'

— note `estimate` + `pps/web/…`, the `:a` consumed and the cwd prefixed. It
returns "unknown revision or path", which through `2>&1 | wc -c` or a bare
`| grep` reads as **the file has no matches**. Oversight hit this twice in one
minute and twice concluded a file lacked a string it plainly contained.
⇒ **Put the revision in a variable and the PATH in a variable too**
(`git show "$SHA:$P"`), or use an explicit SHA. Never write a literal path
starting with `a` directly after `$VAR:`.

⇒ **AND THE GENERAL FORM, WHICH IS THE FIFTH INSTANCE OF ONE FAMILY IN A DAY:**
truncated output read as a count · a patch that never applied, its silence read
as evidence · an abbreviated SHA returning `total_count: 0` · a watchdog that
declared success on an empty check list · and now a shell-mangled path. **Every
one produced a confident, well-formed NOTHING.**
🔑 **AN EMPTY RESULT IS A CLAIM ABOUT YOUR INSTRUMENT UNTIL YOU PROVE OTHERWISE.**
Before believing an absence: confirm the file is readable (byte count), confirm
the patch landed (occurrence count before → after), confirm the identifier is
complete, confirm the tool ran at all (elapsed time, `--listFiles`, a positive
control that MUST match).

⇒ **THE CHEAP HABIT:** when a check comes back clean and something important rests on it, ask *what
would this tool report if the thing I fear were true?* If the answer is *“the same,”* you have not
measured yet.

---

⇒ **SEARCHING MORE PLACES THAN LAST TIME IS NOT SEARCHING EVERYWHERE.** Before concluding *no such
rule exists*, enumerate what your search CANNOT reach — untracked files, another programme's
register, a second repo, a machine you are not on — and say so, or say "not in X, Y, Z" instead of
"nowhere".

**2. A GREEN RUN IS NOT *THIS* GREEN RUN UNTIL YOU CHECK THE HEAD IT RAN ON.**
S3 reported "15/15 green" off a CI run that predated its own most recent push. Re-measured on the
real head: 10 SUCCESS, 5 still IN_PROGRESS. Nothing was failing — but the report was of a
different commit than the one being described.
🔁 **The same session made the same class of error twice in one sitting**, on unrelated
subjects: first reading a local checkout 2237 commits behind `origin/main`, then reading a CI run
older than its own commit. **Both are "I reported a reading without re-checking that the thing I
had since changed was inside it."**

⇒ THE COMBINED RULE: **state what you measured, and state WHEN — a claim without its head SHA or
its timestamp is a claim about the past wearing the present tense.** This applies to CI, to
`origin/main`, to production, and to any document in this corpus. Including this one.

### 🚨 `CREATE OR REPLACE FUNCTION` IN A NEW MIGRATION IS A TIME MACHINE — 2026-08-31, caught on PR #5044

**A migration that replaces a shared function reinstates whatever body its author copied — and git
shows NO CONFLICT, because the two changes live in different files.** A revert with no conflict
marker, that merges green and renders identically to success. This is the stream's own disease
(*a failure that looks exactly like success*) arriving through the schema instead of the UI.

**Measured:** PR #5044 (the give-back rebuild) was branched 13 commits behind `origin/main` and did
`CREATE OR REPLACE FUNCTION public.papic_event_pool_status` — which it legitimately had to, since
releasing grants changes the pot arithmetic. But the body it carried forward predated S2's
extraction of `papic_event_guest_headcount` that same morning:

- `SELECT COUNT(*) FROM public.guests g` — back at L217
- occurrences of `papic_event_guest_headcount` in the whole migration: **0**

That is precisely the two-headcounts drift S2 removed and S3 nearly shipped a screen on. Nobody
wrote a bug; a stale copy was carried forward over a fresh fix.

✅ **What caught it:** S2's guard, written that morning, asserting BOTH halves —
`assert.match(def, /papic_event_guest_headcount/)` **and**
`assert.doesNotMatch(def, /SELECT COUNT\(\*\) FROM public\.guests/, 'the headcount expression must
be GONE from pool_status, not merely also present elsewhere')`. 🔑 **The second half is what did the
work.** A guard that only checks the new call is present would have passed this migration: the
inline count sat right beside it. **When you extract a shared helper, assert the OLD expression is
gone — not merely that the new one exists.**

⇒ THE RULE: **rebase onto `origin/main` BEFORE you copy a function body forward, and diff your
`CREATE OR REPLACE` against the CURRENT definition, not against the one your branch remembers.**
With several sessions writing migrations against shared Papic functions at once, whoever merges
last silently wins.
