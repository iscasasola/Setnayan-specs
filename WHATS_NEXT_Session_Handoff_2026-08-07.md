# Session handoff — 2026-08-07 · build-integrity sweep

> **Read this before touching CI guards, migrations, or any open PR.** Written for a
> **cold start on a different account/machine** — assume no memory files exist. Every
> claim below was verified against live prod, shipped code, or a live `gh` query at the
> time of writing. **Verify before acting anyway** — that is the whole lesson of this
> session (see § 5).

---

## 1 · What SHIPPED — do NOT rebuild any of it

| PR | What it was | State |
|---|---|---|
| **#4201** | The Ugat admin table list crossed the client/server line — `next build` failure | MERGED |
| **#4207** | 🔴 **A live user-facing bug**: every guest message save failed. Plus the orphan migrations dir | MERGED |
| **#4188** | The photo-tag tests still asserted the 20-cap the owner retired | MERGED |
| **#4195** | Drop the retired sign-in hero's config table | MERGED |
| **#4187** | Papic §9 challenge library — freeze baseline, trigger-fn reason, secret-scan false positive, anon-grant revoke | MERGED |
| **#4149** | A stale upgrade could demote a paying vendor | MERGED |
| **#1180** | Onboarding background music | **CLOSED — superseded** |

### 🔴 The one that mattered most: #4207

**Every guest who wrote a message on a Papic photo got `save_failed`. Always, for weeks.**

`app/api/papic/kwento/route.ts` posted **eight** named arguments to
`submit_photo_message`; production's function took **seven** and had no
`p_voice_depth`. PostgREST resolves an RPC by its **exact set of named
arguments** — one unknown name means *no candidate matches* and the call fails
before the body runs. The route mapped it to a generic 500.

**Nothing threw. Nothing logged a schema problem. CI was green throughout**, because
CI never calls the live database.

**Why the schema was missing:** the feature's migration was written into
`apps/supabase/migrations/` — an **orphan directory**. `supabase db push` reads
`<repoRoot>/supabase/migrations` only. The app half shipped and went live; the
schema half went somewhere nothing reads. **Both halves looked done.**

### ⚠️ #1180 was closed — read this before anyone re-opens it

The owner asked whether it was the same as the band/singer song-list page. **It is
not** — but it is redundant anyway:

- **`vendor-dashboard/repertoire` + `dashboard/[eventId]/studio/playlist` + `admin/songs`** =
  a band/singer/orchestra listing songs for an event. Ships.
- **#1180** = ambient music during *couple onboarding*. Different feature — **and it
  also already ships on main**: `onboarding_bg_music_r2_keys` exists in prod, has a
  writer (`app/admin/onboarding/actions.ts`), readers (`lib/platform-settings.ts`,
  `lib/website-media-server.ts`, the Ugat onboarding surface), and
  `OnboardingMusic({ src, srcs })` already plays a playlist in order.

It was **5,723 commits behind main**. Merging it risked a stale-tree clobber for zero gain.

---

## 2 · NEW GUARDS — do not weaken, delete, or "simplify" these

Three guards were added because three separate silent-failure classes cost real
time this session. **All three are mutation-tested — each was deliberately broken
and confirmed to go red.** If one becomes noisy, *raise its threshold*; never
disable it.

| Guard | Catches | Where |
|---|---|---|
| `apps/web/scripts/lint-server-only-boundary.mjs` | A `'use client'` file reaching a `server-only` module through a **value** import, at any depth | `ci.yml` blocking guard + `pnpm lint:server-only` |
| `apps/web/scripts/lint-migrations-dir.mjs` | A `supabase/migrations/` dir anywhere but the repo root | `ci.yml` blocking guard + `pnpm lint:migrations-dir` |
| `apps/web/tests/db/rpc-argument-names.db.test.ts` | Any `.rpc()` call passing an argument name the function does not accept | `test:db` — **197 call sites checked, 8 skipped and reported** |

🔑 **Wiring a CI guard takes THREE edits in `ci.yml`**, not one: the step (with `id:`
and `continue-on-error: true`), the **env binding** in the aggregation step, and the
`check '...' "$VAR"` line. A guard missing any of the three is **decorative** — it
runs and can never fail the job.

---

## 3 · The rule these three guards all serve

🔑 **A REJECTED QUERY IS NOT A THROWN ERROR.** This repo has now paid for the same
mistake three times, in three costumes:

1. a phantom **column** in a select → PostgREST rejects the whole query, `data` is
   null, and `?? []` renders it as an empty list;
2. a phantom **enum value** in a filter → identical, and it made a duplicate-payment
   guard inert from the hour it merged;
3. a phantom **argument** in an `.rpc()` → identical, and it broke guest messages
   for weeks (#4207).

In all three the failure mode is **silence**. Assume the fourth costume exists.

---

## 4 · ⚠️ CONCURRENCY — another session is working this repo RIGHT NOW

This is the most important operational fact in this document.

- **A force-push of mine was rejected, and that rejection is the only reason I noticed
  another session had pushed to the same branch minutes earlier.** It had
  independently found the same defect and fixed it the same way. Forcing would have
  **silently erased its work**.
- **ALWAYS check before any force-push.** And make the check precise: a naive
  "does the remote have commits I lack?" **cries wolf after your own rebase**, because
  your own pre-rebase commits look like someone else's work. The reliable test:

  ```bash
  # safe to force ONLY if the remote tip is exactly your own pre-rebase head
  [ "$(git rev-parse origin/<branch>)" = "$(git rev-parse ORIG_HEAD)" ]
  ```
- **Always verify a push actually landed** — compare `HEAD` to `origin/<branch>` after.
  A shell `&& echo "pushed"` chain will happily print success after a failed push.

### 🚨 The shared main checkout has 96 uncommitted files

`~/Documents/Claude/Projects/setnayan-platform` is on `main` with **96 uncommitted
files (29 added, 67 modified)** left by the concurrent session, and it is **122+
commits behind `origin/main`**. `git pull` aborts because of them.

**Do not stash or discard them — they are not yours.** To read current `main`, make a
detached worktree instead:

```bash
git worktree add --detach /tmp/wt-read origin/main
```

**OWNER DECISION NEEDED:** whether that uncommitted work is wanted or should be
discarded. Nobody in a session can safely make that call.

---

## 5 · Traps that cost real time — each one is a rule now

- 🚨 **A TASK BRIEF CAN BE WRONG, INCLUDING A "VERIFIED" ONE.** The orphan-directory
  task said all three findings were verified and instructed *"delete both files"*.
  **Finding 3 was false.** The original check matched `column_name ILIKE '%kwento%'`,
  which proves *some* column exists — not that *this file's* objects do. They did not.
  **Following the instruction would have destroyed the only remaining record of schema
  a live feature needed.** Re-verify a brief's claims before executing its destructive step.
- 🪤 **A GUARD THAT CRIES WOLF IS WORSE THAN NO GUARD.** The server-only guard's first
  run reported **157 violations, every one a false positive** (client components
  importing server actions — the correct pattern). Fixed by stopping the walk at the
  `'use server'` boundary. 157 false alarms teach you to skim past the one real one.
- 🪤 **A MUTATION TEST THAT BREAKS THE BUILD PROVES NOTHING.** My first attempt at
  proving the RPC guard worked deleted a parameter line, which left a trailing comma
  and broke the SQL — **all three tests failed**. That looks like success and is not.
  Redone so only the relevant assertion failed. **Verify the sabotage landed AND that
  it failed for the right reason.**
- 🪤 **`tsc` exiting 134 with ZERO errors is an out-of-memory abort, not a pass.**
  Re-run with `NODE_OPTIONS="--max-old-space-size=12288"`. A crash reporting no
  problems is indistinguishable from success.
- 🪤 **`cd apps/web` then `cd ..` lands in `apps/`, not the repo root.** A restore
  command silently wrote to the wrong path; the sabotage stayed live and a later
  `rm -rf` deleted **two real tracked migrations**. Restored via `git checkout`. Use
  absolute paths, and prefer `git checkout --` over `cp` for restores.
- 🪤 **A secret scanner can flag a COMMENT.** `couple/coordinator/admin/service_role`
  in a SQL comment tripped gitleaks' `generic-api-key` rule. 🔑 **Reword rather than
  suppress** — an inline `gitleaks:allow` on a line that never held a secret looks
  identical to one hiding a real key, and nobody can evaluate it later. Also: gitleaks
  scans **every commit in the PR range**, so fix by **amending**, not by a follow-up commit.
- 🪤 **The exposure freeze fails on NARROWINGS too.** The baseline is a *description*,
  not a ceiling. Regenerate it in the same PR for any column/grant/policy change in
  either direction: `npm run exposure:baseline --prefix apps/web` (no credentials needed).
  **Always regenerate, never hand-merge** — the conflict exists precisely because two
  sides edited the same running totals.
- 🪤 **Baseline PRs must land ONE AT A TIME with a rebase between.** Whichever merges
  first stales the others. This is inherent, not a mistake — do not batch them.

---

## 6 · A judgement call, recorded so it stays consistent

Two PRs added a small function reachable by `anon`. I revoked on one and not the
other **on purpose**:

- **Revoke when the function reads data.** `call_rtc_can_access` queries
  `chat_threads`. It was already safe because its body returns FALSE for anon — but
  🔑 *"safe because the body checks"* and *"unreachable"* are different guarantees,
  and **only the second survives someone editing the body later**.
- **Record when the function is inert.** `vendor_tier_rank` is `LANGUAGE sql
  IMMUTABLE`, `search_path=''`, a single `CASE` over an enum. It reads nothing. A
  revoke would remove a line from a report without removing any access.

🔑 **The exposure baseline is a record of what is true, not a score to drive down.**

Separately: `papic_challenge_library` shipped with `anon SIUD` — **including
DELETE** — because a new `public` table inherits Supabase's default privileges.
RLS blocked it, but **a grant and a policy are two different locks and only one was
set**. Now `authenticated S`, `anon=-`. **`REVOKE ALL` belongs in the migration that
creates the table**, every time.

---

## 7 · Still open

### Code — 2 PRs, both from the concurrent session

| PR | Title |
|---|---|
| #4216 | `chore(vendor)`: stop showing vendors a currency that buys nothing |
| #4212 | A venue states its own size, so the couple stops guessing |

### ⚠️ #4004 merged — and its gate MOVED

`feat(safety)`: the CSAM known-hash hook **merged 2026-08-07**, despite
`DECISION_LOG.md` 2026-08-04 recording *"#4004 stays a DRAFT — it must not
auto-merge."*

**Verified inert**: `knownHashMatchEnabled()` returns true only when
`CSAM_HASH_MATCH_ENABLED === 'true'`, which defaults off. **Merging the plumbing
activated nothing.**

🔑 **But the gate is now an environment variable, not a draft PR.** The original
condition still stands and is unchanged: **enrol with a known-hash provider
(PhotoDNA / NCMEC / IWF) and sign the NPC Circular 16-02 processor agreement,
THEN set the variable.** Both are contracts, not code. ⏭ Someone should confirm
that variable is not set in hosting.

### Flags checked this session

| Flag | State | How it was verified |
|---|---|---|
| `NEXT_PUBLIC_PLAN3D_SHARED_ROOM` | **ON** | Read out of the live production bundle — the compiled constant is `!0`. Not inferred. |
| `NEXT_PUBLIC_BOOKING_FEE_ENABLED` | **Unverifiable from a session** | Server-only; never reaches a browser; its page is behind a vendor login. ⚠ Note it needs **two** switches — `..._RAIL_LIVE` is the one that actually bills, and it is off, so nothing is charged either way. Prod has **0 fee charges, 0 ledger rows, 13 booked vendors**. |

### Owner queue

Unchanged — see [`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md) § 0, which was verified
against live reality on 2026-08-06 and is still the authority. Nothing in this session
closed or opened a row there.

---

## 8 · Housekeeping for the next session

- **Worktrees**: this session's were pruned. Six remain, several from other streams —
  `wt-dim`, `wt-ho`, `wt-tail`, `wt-paymongo`, `wt-copy`. Check whether their PRs
  merged and prune as you go; each is ~1–2 GB and a full disk deadlocks the harness
  (every Bash call fails with `ENOSPC`, including the `rm` needed to recover).
- **The corpus** (`~/Documents/Claude/Projects/Setnayan`) is a git repo with remote
  `Setnayan-specs.git`. Commit and push spec edits there — that is what travels to a
  new account.
- **GitHub Actions had a major outage during this session.** If checks fail with
  `Failed to resolve action download info` / `Bad Gateway`, that is **not your code** —
  the jobs never started. Re-run them; they do not retry themselves.
