# Recovered orphaned work · 2026-07-30

Three files that exist **only** inside stale git worktrees and are **not on
`origin/main`**. Copied here so they survive the worktrees being deleted. Nothing here
is a decision — it is a rescue.

## Why they were orphaned

Found while pruning worktrees for disk. The standing check "is the PR merged?" said yes
for both source branches — but `git merge-base --is-ancestor <sha> origin/main` said the
branch tip is **not in main's history**. That gap is the whole finding: **a MERGED PR
label is not proof its content landed.** See the stacked-PR/auto-merge orphan trap.

## 1–2. `vendor-surface-service-keys.ts` + its test — 🔴 the real loss

From `claude/sec4-db-revoke-orders-insert`, commit `9743f1f4f`
*"fix(security): SEC-4b repair — close the DELETE lane, un-vacuum the guards"*
(2026-07-26). PR **#3738 is MERGED**, and most of that commit **did** land — the
migration `20271008178212_revoke_orders_payments_insert_from_session_roles.sql`,
`orders-payments-insert-revoke.db.test.ts`, `order-mint-identity.test.ts` are all on
main.

**But this module and its test never did.** All three of its exports are absent from
`origin/main` (verified by symbol grep across `apps/web`, not by filename):

- `VENDOR_SURFACE_SERVICE_KEY_PREFIXES`
- `isVendorSurfaceServiceKey()`
- `assertVendorSurfaceKeyNotSoldToCouple()` ← the guard itself

So a guard written to stop **vendor-surface SKUs being sold to a couple** is not in the
shipped tree, while the PR that introduced it reads as merged.

⚠ **Do not just paste these two files onto main.** The test fails on current main with
`Cannot find module './vendor-surface-service-keys'` — i.e. the module is genuinely
missing, not renamed. And landing the module + test alone would create exactly the
failure mode called out earlier the same day: **a guard that exists but is wired to no
call site passes its own tests while enforcing nothing.** Whoever lands this must find
the call sites the original commit wired it into (`git -C <worktree> show 9743f1f4f`
lists 10 action files) and re-wire them, then mutation-prove the guard by deleting the
call and watching a test go red.

## 3. `suite-surface.changelog-fragment.md` — minor

From `claude/silid-surface`, commit `ce7dc71d2` (*Silid → Suite* rename). The **rename
itself landed** (`apps/web/app/dashboard/[eventId]/suite/page.tsx` is on main); only its
`changelog.d/` fragment did not. Consequence is cosmetic: that entry will be missing
when `CHANGELOG.md` is next generated from fragments. Drop it into the repo-root
`changelog.d/` in any convenient PR.

## The two worktrees these came from were NOT deleted

They still hold the only other copies, so they were deliberately skipped during the
prune — together ~3.7 GB:

| Worktree branch | Size | Why kept |
|---|---|---|
| `claude/sec4-db-revoke-orders-insert` | ~1.7 GB | holds the guard module above |
| `claude/silid-surface` | ~2.0 GB | holds the changelog fragment above |

Once items 1–3 are on main, both are safe to `git worktree remove … --force`, freeing
that space.

---

## 4. `seating-geometry-uncommitted-2026-07-30.patch` — archived before deleting a worktree

The uncommitted contents of the `claude/public-walk-entrance-kind` worktree
(`…/setnayan-platform-wt/seating-geometry`), frozen at its HEAD `466ea334d`
(**2026-07-11**). 109 files, ~9,500 added lines, 468 KB.

**Why it was almost certainly debris** — checked before deleting, on a 40-file sample:

- **21 of 40 byte-identical** to what is already on `origin/main`
- **9 differ**, but the worktree is frozen at 2026-07-11 and main has moved 200+
  commits since, so those are older drafts, not newer work
- **10 absent from main** — and every one is a `changelog.d/` fragment filed in the
  wrong directory (`apps/web/changelog.d/` instead of the repo root), for features
  that have already shipped (booth ads, ghost booths, living roster)

Its branch's PR (**#3069**) is MERGED and every commit is an ancestor of `origin/main`,
so nothing *committed* was at risk either.

⚠ **This patch will NOT apply to current main** — it is a 2026-07-11 snapshot, kept as a
readable record rather than a replayable change. To read a file from it:
`grep -A 200 'diff --git a/<path>' <this patch>`.

`claude/login-audit-cleanup` was deleted with **no** archive: all 1,290 of its changes
were *deletions* of files that exist on main — an emptied checkout, with nothing written.

**Reclaimed ~3 GB.** The rule this follows: archiving costs seconds and megabytes, and
converts an irreversible delete into a reversible one. Earlier the same day, a worktree
holding the only copy of an unmerged security commit was removed by another session
mid-task — that was survivable only because the commit had been rescued first.
