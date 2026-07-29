# WHAT'S NEXT — Day-of specialist desks + the emcee's activity catalogue

> **Written 2026-07-29** at the end of the session that built them, for a **fresh Claude Code
> account with zero context**. Registered in [`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md).
>
> **Read §0 and §1 before touching anything.** §1 is the list of ways this exact stream has
> already wasted a build cycle. Every trap in it actually happened during the session that
> wrote this file — none are hypothetical.

---

## 0 · The 60-second orientation

Three vendor "day-of specialist desks" now ship on the live floor console, plus the data layer
and both surfaces of the emcee's activity catalogue. **All of it is merged and in production.**

What is left is **four items**. As of 2026-07-29 **none is blocked** — the emergency bubble's behaviour was decided (§3.A); only its wording is still open, and the recommendation is to proceed without waiting.

| | Item | State | Gate |
|---|---|---|---|
| A | **Emergency bubble** on the emcee's screen | prototyped + **behaviour decided**, not built | AUTO-OK (see §3.A) |
| B | **Coordinator's inbox inline** on the live console | scoped, **not built** | AUTO-OK |
| C | **The emcee's questionnaire** (he asks, couple answers) | decided, **not built** | AUTO-OK |
| D | **Acknowledge-back** on the bubble ("Got it" → coordinator) | proposed | depends on A |

**Canonical checkout:** `/Users/icecasasola` (git root; `apps/web/` and `supabase/migrations/`
are both under it). ⚠ See §1.1 — this checkout was ~1,455 commits stale during the last
session. **`git fetch origin && git log -1 origin/main` before you trust anything in it.**

---

## 1 · TRAPS — read every one, they all cost real time

### 1.1 The local checkout is probably stale, and it looks like "the file doesn't exist"

Last session started with the owner naming a file path. It appeared not to exist. It did —
the checkout was **1,455 commits behind** `origin/main`, from ~2 weeks earlier.

**Symptom:** a `grep` for a shipped feature returns nothing, and Rule 0 makes you conclude
"not built" and build it again.

**Always:**
```bash
git -C /Users/icecasasola fetch origin
git -C /Users/icecasasola log -1 --format='%h %ci' origin/main   # is this ~now?
git -C /Users/icecasasola rev-list --count HEAD..origin/main      # 0 = current
```
**Never build in that checkout.** Always a fresh worktree off `origin/main`.

### 1.2 Two sessions built the same screen the same day

The coordinator's desk (`floor_command`) was built **twice in parallel** by two sessions and
the collision only surfaced at merge. The other one shipped (`46c395839`); ours was closed
(PR **#3822**). ~1 build cycle lost, and Rule 0 could not have caught it — when the search
ran, the work genuinely did not exist yet.

**Before starting anything in this stream:**
```bash
gh pr list --state open --limit 40 --json number,title,headRefName \
  --jq '.[] | "\(.number) \(.headRefName) — \(.title)"' | grep -iE "emcee|activit|floor|coordinator|bubble|day-of"
```
If someone else is mid-flight on your item, **stop and say so** rather than racing.

### 1.3 `test:unit` is NOT the test suite — there is a second one

CI runs **two** suites. Running only the first and reporting "full suite green" is how a
broken PR got pushed last session.

```bash
cd /Users/icecasasola/<worktree>/apps/web
npx tsx --test "lib/**/*.test.ts" "app/**/*.test.ts"   # test:unit   (~5,150 tests)
npx tsx --test "tests/db/*.db.test.ts"                 # test:db:ci  (~594 tests) ← DO NOT SKIP
```
The DB suite uses **PGlite in-process** — no external database, no Docker, no skip path. It
replays every migration. It takes ~4–5 min. **Run it on any PR that touches SQL or RLS.**

### 1.4 A policy named `_host_` / `_couple_` must NOT use `current_event_ids()`

**This bit us.** `current_event_ids()` returns an event for **any** `member_type` — **invited
guests included**. Our picks policies were named `_host_` and used it, so through a `FOR ALL`
write policy **a wedding guest could have added or removed the couple's chosen segments.**

Caught by `apps/web/tests/db/couple-host-policy-scope.db.test.ts` T1 — a guard that exists
because **ten** policies had already made this mistake, two of them serious.

- couple-only → **`current_couple_event_ids()`**
- any member (guests included) → `current_event_ids()`, and name the policy `_member_`

**The generalised lesson, and it is the one to carry:** copying a sibling table's idiom is
**not** evidence that idiom is right for a differently-named policy.

### 1.5 Every new table ships OPEN, and the exposure freeze will fail your PR

Supabase's default ACL grants `arwdDxtm` to `anon` + `authenticated`. RLS does **not** undo a
table-level GRANT.

Every migration adding a table needs:
```sql
REVOKE ALL ON public.<table> FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.<table> TO authenticated;  -- only what is needed
```
Then the freeze test (`tests/db/exposure-freeze.db.test.ts`) fails, **by design**, because you
widened the surface. Two options, per `supabase/security/README.md`:

1. **Narrow it** — no baseline change needed. Prefer this. We dropped an `anon` SELECT we had
   copied from `vendor_songs` and did not actually need.
2. **Accept deliberately** — regenerate **in the same PR**:
   ```bash
   corepack pnpm --filter @setnayan/web exposure:baseline
   ```
   Then read your own diff. Every added line is new reach. Ours ends `anon=-` on every column.

⚠ **The baseline conflicts on almost every schema PR.** It is a GENERATED file marked DO NOT
HAND-EDIT. Resolve by `git checkout --theirs` + **regenerate**, never by hand-merging.

### 1.6 Do NOT run `supabase db push` — it applies itself

`.github/workflows/supabase-migrations.yml` fires on any merge to `main` touching
`supabase/migrations/**`. Our migration was already applied by the time we looked.

Auto-apply is documented as **unreliable** (bursty merges can skip; a migration numbered below
the applied HEAD never runs), so **verify the OBJECT, never the ledger** — `schema_migrations`
can record APPLIED while nothing landed:

```sql
SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename IN (...);
SELECT polname, pg_get_expr(polqual, polrelid) FROM pg_policy WHERE polrelid='public.<t>'::regclass;
```
(Use the Supabase MCP `execute_sql` against project `njrupjnvkjkitfctetvi`. There is **no
`psql`** on this machine.)

⚠ **Migrations apply ONCE, by version number.** If a migration lands and you then fix the SQL
in the same file, **prod keeps the old version forever** and `db push` reports success while
changing nothing. If you edit a migration after it may have applied, **check prod directly**
and write a NEW migration to correct it.

### 1.7 The specialization registry is the ONE shared file

`…/live/[eventId]/_components/specialization-registry.tsx` is touched by every specialization
PR — one import + one line each. **Conflicts are expected and the resolution is always KEEP
BOTH.** Never take one side.

### 1.8 Migration prefixes are allocator-only

```bash
corepack pnpm -C <worktree> migration:new "<name>"
```
A pre-push hook rejects round `YYYYMMDD000000` prefixes. Guards to run:
`node scripts/check-migration-timestamps.mjs` and `node scripts/migration-doctor.mjs`.

---

## 2 · DONE — verified against LIVE PROD 2026-07-29. **Do NOT rebuild any of this.**

| What | Where | Evidence |
|---|---|---|
| **Script & cues** — host/MC desk | `…/live/[eventId]/_components/stage-script/` | PR **#3812** ✅ merged |
| decision core + 30 tests | `apps/web/lib/stage-script.ts` + `.test.ts` | on `main` |
| `BLOCK_CUE` **exported** for reuse | `apps/web/lib/emcee-script.ts` | on `main` |
| **Run the floor** — coordinator desk | `…/_components/floor-command/` | `46c395839` ✅ (**another session's**) |
| **Activity catalogue** schema | `supabase/migrations/20271015817050_…sql` | ✅ **applied to prod, verified** |
| catalogue logic + 16 tests | `apps/web/lib/vendor-activities.ts` + `.test.ts` | PR **#3831** ✅ merged |
| emcee authoring screen | `apps/web/app/vendor-dashboard/activities/` | on `main` |
| couple's picker + bridge | `…/schedule/_components/emcee-picks.tsx`, `…/schedule/activity-picks-actions.ts` | on `main` |
| all three registry entries | `specialization-registry.tsx` | `song_desk` · `stage_script` · `floor_command` |

**Prod verification run 2026-07-29:** `vendor_activities` + `event_activity_picks` exist ·
RLS **on** both · `anon` holds **no** privilege · picks policies use
`current_couple_event_ids()` (the corrected version) · no stranded migrations.

**Testing checklists already written:** `TEST_SCRIPT_E2E_2026-07-27.md` **§15** (host/MC desk),
**§16** (coordinator desk — rewritten against what actually shipped), **§17** (catalogue).
180 checkboxes total. **Add to that file; do not start a new one** (owner: "we will compile
all to do list").

### Locked design decisions these rest on — do not relitigate

- **Specializations are subscription-gated at `solo`** (`SPECIALIZATION_MIN_TIER`). Registering
  a surface **grants nothing** — pinned by neutralisation tests in both `vendor-dayof-frame.test.ts`
  and `stage-script.test.ts`.
- **Guest list + coordinator broadcasts stay CLOSED to suppliers** (owner: *"yes. keep them
  private."*). A booked vendor cannot read `guests` or `coordinator_broadcasts`, and this is
  deliberate, not a gap. **Never reach for the admin client to work around it** — that is the
  guest-PI exposure the open DPO/NPC item governs.
- **The coordinator relays to the host in person.** No general host inbox. (The bubble in §3.A
  is the *narrow exception* to this, which is exactly why it needs an owner decision.)
- **Catalogue travels, picks do not** (owner: *"stays per wedding. but his questionaire can be
  saved as his template."*). Enforced by schema: `vendor_activities` has **no `event_id`**.
- **Placement appends, never reflows.** Picked activities land after the whole existing
  timeline. Same reasoning as `loadScheduleTemplate` refusing a non-empty schedule.

---

## 3 · NOT STARTED — the build list

### A · The emergency bubble 🟡 **behaviour DECIDED 2026-07-29 — one small question left**

**Owner asked for:** *"a place where he can also receive emergency messages that comes like a
bubble on the bottom right."*

**Why it is gated:** it partially reverses the same-day lock that the coordinator relays in
person and the host has no inbox. The two only coexist if the channel is **narrow**. Build it
wide and it becomes a chat within a week — at which point the host stops looking at it, which
is the precise moment a real emergency arrives.

**Prototype (both options, interactive):**
`0022_vendor_dashboard/MC_Desk_Prototype_2026-07-27.html` ·
artifact <https://claude.ai/code/artifact/c714b04e-defa-4324-8729-d468659ef48d>

**DECIDED (owner, 2026-07-29):** *"emergency bubbles need to show on screen. so they get real
time update of a notice and view it by demand."* That settles the two things that actually
shape the build:

1. **PUSH, not poll.** The notice appears the moment it is sent — no refresh, no "pull to
   check". Live this is a **Supabase realtime subscription**; follow the shipped precedent in
   `LiveReviews` (`_components/live-reviews.tsx`) — a `supabase.channel` on the base table plus
   the publication `ALTER`, with a ~15s reconcile timer as the belt-and-braces. See also
   `wall-projection.tsx` for the same idiom.
2. **NOTICE first, content ON DEMAND.** What arrives is a small marker — *"1 notice · tap to
   read"* — never the message body. The host is holding a live microphone; a wall of text
   landing mid-sentence is worse than a quiet corner marker he opens on a beat. A **second**
   arrival only raises the count; it must **never** force the panel open.

**Sender:** the **coordinator** — already owner-stated 2026-07-27 (*"Coordinator's are the one
to relay messages to host"*).

**Still open, and it is small:** presets vs free text. **Recommendation on record and unchanged:
four presets, no free text** — *Hold the program* · *Medical — pause everything* · *Skip the
next segment* · *Wrap up now*. A free box works on night one and is a chat by the third
wedding, at which point the host stops looking at the corner of his screen, which is the exact
moment a real emergency arrives. **Build presets; they are string constants and swapping them
(or adding a free box later) is a one-file change.** Do not block on this.

**The interaction is fully specified in the prototype — copy it, do not redesign it.**

**When answered, the build shape** (all of this is already designed in the prototype):
- Bottom-right of `…/live/[eventId]`, **burnt amber, never gold** — gold means "you're on" and
  an interrupt must not read as a cue. Pulsing dot.
- **Collapsed:** `N notice(s) · tap to read`. **Expanded:** sender · message · "Got it" per
  item. Clearing the last one returns the corner to nothing.
- Survives a re-render (advancing the run must not drop an unread notice).
- ⚠ **A booked vendor currently cannot read `coordinator_broadcasts`** (member/moderator/admin
  only). So this needs **either** a new narrow table **or** a deliberate new RLS lane. Either
  way it is `OWNER_DECISION` + §1.4 + §1.5 apply in full.
- Sender side lives on the coordinator's `floor-command` surface (already shipped).

### B · The coordinator's inbox, inline 🟢 AUTO-OK

The shipped coordinator surface **links out** to `/vendor-dashboard/on-the-day` for the
requests inbox — which navigates them **out of the fullscreen wake-locked console** to reach
the tool they use most on the night.

**The fix is small:** mount `<IssuesLog eventId={eventId} />` inline in
`…/_components/floor-command/floor-command.tsx` in place of that `Link`.

**Mount `IssuesLog`, NOT `RequestsInbox`** — the wrapper swaps itself to the shared stream when
the server says it is live and stays a **device-local log** when it is not, which is what keeps
a coordinator working on bad venue wifi.

**Spec + a working implementation:** closed PR **#3822**, branch
`claude/floor-command-specialization` (still on disk / on the remote). It also contains a pure
`lib/floor-command.ts` "push or fix first?" cross — ⚠ **that filename now belongs to the merged
version; do not clobber it.** Take the inline-inbox change only, or rename.

⚠ Gated at runtime by the `coordinator_requests_inbox` Data Privacy control — off means the
local log shows, which is correct, not a bug. Noted in `TEST_SCRIPT_E2E` §16.0b.

### C · The emcee's questionnaire 🟢 AUTO-OK

**Owner decided the model already** (2026-07-27, in `DECISION_LOG.md`):
- The emcee **creates his own questions**; the couple answers them.
- **Answers stay per wedding.** The **question set** saves as **his reusable template** for
  future customers.
- The coordinator sees it **only with approval** (*"if the coordinators gets and approval to
  see it"*).

**Why this shape:** it solves the sponsors-names problem **without** opening the guest list.
The emcee's hardest job is announcing ~30 principal sponsors by full name; he cannot read
`guests`; so he **asks**, and the names arrive as something the couple deliberately typed.

**Build it as the second instance of the pattern already proven twice** — `vendor_songs` /
`event_song_picks`, then `vendor_activities` / `event_activity_picks`:
- `vendor_questions` (vendor-owned, reusable, **no `event_id`**)
- `event_question_answers` (per-event, dies with the event)
- The **booked-vendor SELECT lane must be in the first migration** — see §1.4/§1.5, and note
  `event_song_picks` needed that retrofitted later, which is why we built it in for activities.
- Answers should surface on the **Script & cues** desk (`stage-script.tsx`) next to the block
  they belong to.

### D · Acknowledge-back on the bubble — depends on A

"Got it" sends an acknowledgement to the coordinator, so they know the host has seen it and can
stop watching the door. Cheap; on a real floor it is the difference between telling someone and
knowing they heard.

---

## 4 · The verification recipe that actually passes CI

Run **all** of these in the worktree before opening a PR. This is the exact list CI enforces,
and the one that would have caught last session's two misses.

```bash
cd /Users/icecasasola/<worktree>
corepack pnpm install --frozen-lockfile

cd apps/web
NODE_OPTIONS=--max-old-space-size=8192 npx tsc --noEmit        # expect 0 errors (~10 min)
npx next lint                                                   # expect exit 0, 0 errors
npx tsx --test "lib/**/*.test.ts" "app/**/*.test.ts"            # test:unit
npx tsx --test "tests/db/*.db.test.ts"                          # test:db:ci  ← the one we skipped
NODE_OPTIONS=--max-old-space-size=7168 npx next build           # expect exit 0 (~10 min)

cd ..
node scripts/check-migration-timestamps.mjs
node scripts/migration-doctor.mjs
node scripts/lint-exposure-baseline.mjs
for g in lint-entitlement-gates lint-changelog-dir lint-nested-forms \
         lint-guest-legibility lint-retired-strings lint-vendor-layout-revalidate; do
  node apps/web/scripts/$g.mjs || echo "FAIL $g"
done
RADIUS_LINT_STRICT=1 node apps/web/scripts/lint-radius.mjs
```

⚠ `tsc` and `next build` are each ~10 min and get **SIGKILLed if run concurrently** on this
machine (16 GB). Run them one at a time, with the heap flags above.

**Changelog fragment is mandatory:** a NEW file at **repo-root** `changelog.d/<branch-slug>.md`
with a dated `## YYYY-MM-DD · type(scope): summary` block and a `SPEC IMPACT:` line. A CI guard
fails if a `changelog.d/` appears anywhere but the root.

**Then:** `gh pr create …` → `gh pr merge <#> --auto --merge` (standing default; never ask).

---

## 5 · Prove your gate by neutralising it

House style in this stream, and the owner's explicit ask on the first task. For any guard you
add: **break it deliberately, run the tests, record which fail, revert.** Put the observed
counts in the test-file header. Examples already in the tree:

- `stage-script.test.ts` — forcing the privacy flag true fails 4 of 5; forcing false fails the
  control + 1. Pinned from both sides.
- `vendor-activities.test.ts` — removing idempotency fails exactly 2; starting placement at the
  timeline's earliest instead of its tail fails exactly 2.
- `vendor-dayof-frame.test.ts` — dropping the `held` check fails exactly 4 across two suites.

A guard nobody has broken on purpose is a guard nobody knows works.

---

## 6 · Open owner questions, collected

| # | Question | Blocks |
|---|---|---|
| 1 | Emergency bubble: **presets or free text?** (Sender + behaviour now decided — see §3.A. Recommendation: presets. **Do not block on this**, build presets.) | nothing — A is unblocked |
| 2 | Should the coordinator be **copied** on the host's questions to the couple? (owner said "if… approval" — is approval per-question or once per event?) | C (partially) |
| 3 | Which of `Known_Todos_Pre_Pilot.md` / `LIVE_QA_WALKTHROUGH_2026-06-18.md` survives the to-do compile? (Neither is a real to-do list — **0 checkboxes each**; the E2E script is the only one.) | housekeeping |
| 4 | How do parallel sessions **claim** a piece of work before starting? (§1.2 cost a build cycle.) | process |

---

## 7 · Housekeeping left on disk

- Worktrees not pruned: `/Users/icecasasola/setnayan-wt-activities`,
  `/Users/icecasasola/setnayan-wt-floor-command` (~1–2 GB each; ENOSPC deadlocks Bash).
  `git -C /Users/icecasasola worktree remove <path> --force`
- **The canonical checkout `/Users/icecasasola` needs refreshing** — see §1.1.
