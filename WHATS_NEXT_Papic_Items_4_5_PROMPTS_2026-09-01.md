<!-- Ready-to-paste session prompts for items 4 and 5 of
WHATS_NEXT_Papic_Build_Order_2026-08-29.md. Paste ONE prompt per session, verbatim. -->

# Papic items 4 & 5 — session prompts (2026-09-01)

> ✅ **4a AND 4b ARE SAFE TO RUN TOGETHER.** 4a is a migration + resolver (schema side); 4b is the
> wall feed and its component (read side). **Disjoint on every file**, and 4b deliberately renders
> only what already ships, so it does NOT wait on 4a's columns.
> ⛔ **ITEM 5 RUNS AFTER 4a MERGES** — it hangs challenges on the ceremony sequence, which is the
> clock 4a builds.
> ⚠ Every session must `git fetch` before branching. `origin/main` moved 31 commits under a single
> held PR during the last session.

---

## ✅ THE CLOCK IS RULED — 2026-09-01, owner. 4a IS UNBLOCKED.

**A challenge's window is RELATIVE, and the ceremony sequence is the clock.**

- It starts when the challenge is **ARMED**, never at a wall-clock time the couple sets.
- **One challenge is live at a time per celebration.** Arming the next closes the previous.
- The last one closes when the capture window ends — `events.papic_window_end`, which already ships
  (migration `20270305885232_papic_capture_window_per_event.sql`). No new bound is invented.
- ⚠ **EXPIRY CLOSES THE PROMPT, NEVER THE SHUTTER.** A guest is never refused a photo for lateness;
  the challenge merely stops being the armed one.
- **NO duration column and NO default duration number.** The design does not need one, so none is
  invented (2026-08-31 `DEFAULT_CAPTURE_MIX` rule — *don't guess*). A per-challenge duration for
  auto-close can be added later without redoing the schema, since `armed_at` is already its anchor.

*Why:* `KwentoMoment` is `{key, label, eyebrow}` — ten ordered moments, **none scheduled**. A
challenge tied to "First Dance" cannot know a wall-clock time, and weddings run late, so a challenge
pinned to 7:00 PM fires during the wrong moment on the one day nobody can re-run. Full row in
`DECISION_LOG.md`, 2026-09-01.

---

## SHARED HEADER — paste at the top of EVERY prompt below

```
Read the repo's own CLAUDE.md and the corpus CLAUDE.md first, then follow RULE 0: assume what you
are about to build already exists, and locate it before writing anything. RULE 0 now covers work in
flight, not just origin/main — run `gh pr list --state open --limit 40` and `git worktree list`
before you start. A feature was rebuilt from scratch on 2026-08-31 while a better version sat open
as a PR.

Working rules for this session, all of which have cost this project real work before:

1. Branch, then `git worktree add` IMMEDIATELY — beside the repo at
   ~/Documents/Claude/Projects/wt-<name>. NEVER in /tmp: a finished, proved change was lost that
   way on 2026-08-28 with zero commits ever made.
2. `pnpm install` in the worktree BEFORE running anything. A run in an uninstalled worktree means
   nothing — it resolves nothing and "passes".
3. Run unit and db tests FROM apps/web (`cd apps/web && npx tsx --test tests/db/<file>`). From the
   repo root every `@/…` import dies, including the repo's own guards.
4. PUSH THE MOMENT IT TYPECHECKS. Do not batch a session's work into one commit at the end.
5. Typecheck with the exit code printed beside the error count:
   `npx tsc --noEmit -p tsconfig.json > /tmp/tsc.log 2>&1; echo "TSC_EXIT=$?"; grep -c 'error TS' /tmp/tsc.log`
   An EMPTY log is NOT a clean one — tsc exits 144 on abort, and two concurrent typechecks cause
   exactly that. Never run two.
6. Require `# tests` to be NON-ZERO before believing any pass. Zero-tests-zero-failures is
   byte-identical to success and exits 0.
7. Mutation-test every assertion you add and PRINT THE OCCURRENCE COUNT before → after. An
   unmeasured sabotage proves nothing. If a well-formed sabotage reports GREEN, suspect the
   sabotage before the guard.
8. 🚨 IF YOU WRITE `CREATE OR REPLACE FUNCTION`, DERIVE THE BODY FROM THE CURRENT DEFINITION, NOT
   FROM YOUR BRANCH'S COPY. A replace reinstates whatever body its author copied, and git reports
   NO CONFLICT when that body is stale — PR #5044 silently reverted a fix that had merged hours
   earlier this way. Rebase first, then diff your copy against:
     SELECT pg_get_functiondef('public.<fn>(<args>)'::regprocedure);
9. Add a changelog fragment in changelog.d/ — never edit CHANGELOG.md or STATUS.md directly.
10. Auto-merge is the standing default: `gh pr merge <n> --auto --merge` right after creating it.
    EXCEPTION: anything touching money, credits, ceilings or an anon-callable SECURITY DEFINER path
    opens as a DRAFT and carries the `do-not-auto-merge` label. The owner merges those.
```

---

## ITEM 4a — a challenge acquires a clock

```
Give a Papic challenge a concept of time. Spec: WHATS_NEXT_Papic_Build_Order_2026-08-29.md § 4 in
the corpus at ~/Documents/Claude/Projects/Setnayan — READ THE RE-MEASURED BLOCK AT THE TOP OF THAT
SECTION FIRST; the item is smaller than its prose suggests.

WHAT ALREADY SHIPS — do not rebuild any of it:

- A library of 500+ prompts: lib/papic-challenge-pool.ts (CHALLENGE_POOL_FLOOR = 500), categorised
  and filtered by event type.
- A challenge can already be ARMED on a guest's camera; the viewfinder renders "Next shot: {prompt}".
- A completion board: public.papic_mission_completions, MATERIALIZE-ONCE / NEVER-DELETE, created by
  migration 20271117738153_papic_challenge_library_and_board.sql. It is WRITTEN and it is READ.

🛑 THE TRAP THAT WILL MAKE YOU REPORT THIS AS ALREADY DONE: `papic_challenge_expires_at` EXISTS and
reads exactly like a challenge clock. It is on **vendor_profiles** (migration
20271181420277_the_challenge_is_a_subscription.sql) and is the VENDOR'S SUBSCRIPTION EXPIRY. Read
the column's TABLE, never its name alone. Confirm for yourself:
  grep -n -B6 papic_challenge_expires_at supabase/migrations/*.sql

MEASURED 2026-08-31: a challenge has no window, no countdown and no expiry anywhere.

BUILD:

1. THE CLOCK IS RULED (2026-09-01, see DECISION_LOG.md): the window is RELATIVE — it opens when the
   challenge is ARMED. ONE challenge live at a time per celebration; arming the next closes the
   previous; the last closes when `events.papic_window_end` passes. Do NOT add a duration column and
   do NOT invent a default duration — the design does not need one.
   ⚠ EXPIRY CLOSES THE PROMPT, NEVER THE SHUTTER. A capture is never refused for lateness.
   🔎 FIRST RULE 0 STEP: establish how a challenge is armed TODAY — per guest or per celebration.
   That decides the wiring, not the ruling. `papic_challenge_pending` is a NOTIFICATION type
   ("Papic Challenge to approve"), not the arming mechanism — do not mistake it for one.
2. Schema FIRST, with RLS at CREATE TABLE time and the matching pattern from
   02_Specifications/RLS_Policy_Pattern.md § 5. Allocate the prefix with `pnpm migration:new`.
3. A resolver that answers "is this challenge live right now?" in ONE place, the way
   papic_guest_spend_ceiling() is the one place a ceiling is decided. Two readers must never be able
   to disagree about whether a challenge is open — that class of drift is what item 3 spent six
   sessions removing.
4. A db test that REFUSES something: arm a challenge, move past its end, assert it is closed. A test
   that only asserts a column exists proves nothing — four limits have shipped on this surface
   governing nothing.

DO NOT touch the wall feed or live-wall components; a parallel session (4b) owns those files.
```

---

## ITEM 4b — the wall shows the challenge and who has answered

```
Put the Papic challenge on the live wall. Spec: WHATS_NEXT_Papic_Build_Order_2026-08-29.md § 4 in
the corpus at ~/Documents/Claude/Projects/Setnayan — READ THE RE-MEASURED BLOCK AT THE TOP FIRST.

WHAT ALREADY SHIPS — this is a READER, not a board build:

- public.papic_mission_completions already records who answered (MATERIALIZE-ONCE, NEVER-DELETE).
- It ALREADY HAS A WORKING READER to copy:
    apps/web/app/[slug]/_components/editorial/data.ts   (grep: papic_mission_completions)
- The challenge library and the armed prompt already exist (lib/papic-challenge-pool.ts).

MEASURED 2026-08-31, and this is the whole gap:
  apps/web/app/api/wall/[eventId]/feed/route.ts        -> 0 matches for challenge|mission|prompt
  apps/web/app/[slug]/_components/live-wall-block.tsx  -> 0 matches for challenge|mission|prompt

BUILD:

1. The wall feed carries the currently-armed challenge and a COUNT of guests who have answered it,
   read from papic_mission_completions. Copy the existing read; do not invent a second shape.
2. The wall renders both. A count nobody can see is the disease this whole stream exists to kill —
   a log line never changed a pixel.
3. ⚠ RENDER WHAT IS TRUE WHEN THE READ FAILS OR RETURNS NOTHING. A refused or empty read must never
   render as "no challenge" indistinguishably from a genuinely un-armed wall. The pattern to copy is
   in this repo: apps/web/lib/guests.ts + apps/web/lib/guests-read-is-honest.test.ts.
4. A test that proves the count reaches the RENDER, not merely the query.

DO NOT add columns and DO NOT write a migration — a parallel session (4a) owns the clock. Build
against what ships today; the countdown lands after both merge.
```

---

## ITEM 5 — challenges hang on the ceremony sequence

> ✅ **UNBLOCKED — 4a merged as PR #5070 and 4b as #5067 on 2026-09-01.** Rewritten against what
> those actually shipped, so the session does not rediscover it.

```
Join the challenge pool to the ceremony sequence. Spec:
WHATS_NEXT_Papic_Build_Order_2026-08-29.md § 5 in the corpus at ~/Documents/Claude/Projects/Setnayan.

WHAT 4a AND 4b JUST SHIPPED — build on these, do not re-invent them:

- public.papic_missions gained `armed_at` and `closed_at`
  (migration 20271188446868_papic_challenge_clock.sql).
- public.papic_arm_challenge(p_mission_id UUID) RETURNS TIMESTAMPTZ — arming ONE closes the previous.
- public.papic_armed_challenge(p_event_id UUID) RETURNS TABLE — the currently-armed one.
- public.papic_challenge_is_open(p_mission_id UUID) RETURNS BOOLEAN — the ONE place "is it open?" is
  decided. Every reader asks THIS. Do not add a second answer to that question.
- The wall already renders the armed challenge and the answered count (live-wall-block.tsx).

OWNER RULING, 2026-09-01 (DECISION_LOG.md): the window is RELATIVE — it opens when the challenge is
ARMED, never at a wall-clock time. THE SEQUENCE IS THE CLOCK. No duration column, no default
duration number. Expiry closes the PROMPT, never the SHUTTER.

🔑 THE ONE FACT THAT DECIDES HOW YOU BUILD THIS — THERE IS ONLY ONE PROMPT SOURCE:

  lib/papic-challenge-pool.ts  →  lib/papic-challenge-sql.ts  →  the migration INSERT
                                                              →  public.papic_challenge_library

  "The 631 challenges are authored once in papic-challenge-pool.ts and this turns them into the
   INSERT a migration carries. Nothing is typed twice."  — papic-challenge-sql.ts, verbatim.

⇒ ANY new per-challenge data — including a ceremony-moment mapping — IS AUTHORED IN THE POOL AND
REGENERATED. Never hand-write library rows in SQL, and never add a second table of prompts. Doing
either creates two mechanisms that disagree about one fact, each passing its own suite — the exact
failure this project has paid for repeatedly.

MEASURED 2026-09-01, so you do not have to:

- lib/kwento-moments.ts is TEN ORDERED MOMENTS with NO time: `KwentoMoment = {key, label, eyebrow}` —
  bridal_march · exchange_of_vows · veil_and_cord · first_kiss · leaving_the_church · cocktail_hour ·
  newlywed_entrance · first_dance · cake_cutting · money_dance.
- The library's `category` axis is THEMATIC, NOT CEREMONIAL — 12 categories over 631 rows in
  production: stories(97) couple_family(57) anywhere(55) meet_room(55) fashion_candids(50)
  greeting(50) selfie(50) food_drinks(47) decor_booth(46) stories_couple(43) band_dance(42)
  big_moments(39). `big_moments` and `band_dance` are ADJACENT to moments but are NOT a mapping —
  do not mistake either for one and report this as already done.
- Nothing joins moments to prompts anywhere: zero references to kwento in the pool.

BUILD:

1. The moment→challenge mapping, authored in the POOL and regenerated through papic-challenge-sql.ts
   into a new migration (allocate the prefix with `pnpm migration:new`). A moment maps to SEVERAL
   candidate prompts; a prompt may suit more than one moment.
2. The coordinator's setup path: pick a celebration's sequence, and each moment arms its challenge
   via papic_arm_challenge when the coordinator says the moment is happening. The value being bought
   is that setup takes two minutes instead of writing prompts from scratch.
3. An UNMAPPED moment must degrade to the general pool, never to nothing. A ceremony that reaches a
   moment with no mapping still has to offer the guests something.
4. Tests: a moment yields the prompts a coordinator would expect; an unmapped moment degrades rather
   than empties; and arming a moment's challenge closes the previous one (that behaviour is 4a's, so
   assert you are USING it, not re-implementing it).

⚠ DO NOT add a duration or an expiry of your own. The clock is 4a's and the ruling is settled.
```

## When these are done

Item 6 is next. ~~It needs an owner ruling BEFORE any schema~~ — **settled 2026-09-02: the fourth
flag was ADOPTED and built (session 6b).** `guests.scan_tracking_opt_out` now has a writer (the
guest's own switch, `setGuestScanTracking` + `_components/scan-trail-notice.tsx`) and a reader
(`lib/scan-trail.ts` · `recordScan`, the one door that creates a `scan_events` row, guarded by
`lib/every-scan-goes-through-one-door.test.ts`). **Item 6 builds on it and must not add a fifth flag
for scans.** Two calls were made rather than inherited — the switch is guest-only, and
`guest_checkins` is deliberately outside it; both are written up in the re-measured block at the top
of § 6 of the build order, for the owner to disagree with there.
