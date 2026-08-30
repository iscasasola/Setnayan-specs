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
| **S6** | The promotion page may finally say it | `/papic` | anything | — |

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

## S5 · The buyer chooses  *(owner 7b)*

At the moment a guest buys: **keep them for me** (their money, outside the couple's limit) or
**add them to the celebration** (into the shared pot; they revert to an ordinary share).
✅ `papic_dedicate_shots` takes a **TARGET, not a delta**, so giving and taking back are the same
call — this is that call in the pot direction. Nothing new.
⚠ **What a camera has already SHOT can never come back.** The buyer's screen must say so.
⚠ Verify `NEXT_PUBLIC_PAPIC_GUEST_BUY` in the hosting settings before assuming the buy panel is
reachable — a flag's default in code is not its value in production.

---

## S6 · The promotion page

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
