---
name: setnayan-order-mint-and-table-rosters
description: "A new orders-minting file, a new granted table, a changed anon-callable RPC signature, OR A NEW events-INSERT PATH fails CI on hidden hand-maintained rosters even when tsc/lint/the-tests-you-ran are clean — the specific files to update proactively"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 546a30ec-cd0d-49a0-9a9b-b1886f63f048
  modified: 2026-09-07T09:45:53.804Z
---

Measured 2026-09-06 shipping G3 (`vendor-papic-portfolio-album`, PR #5267,
[[setnayan-vendor-papic-portfolio-g3-landed]]): local scoped `tsc` + targeted
unit/db tests were clean, but CI failed twice in a row on guards that derive
their coverage from scanning the codebase rather than trusting a list —
exactly the "roster" pattern `GIFTS-PLAN.md`'s Corrections section already
documented for admin pages, but for a DIFFERENT axis (money + schema
exposure) that isn't mentioned there.

**Why:** these guards are real security backstops (SEC-4 lived unreviewed for
two months before `order-price-authority.test.ts` existed), so they refuse to
pass silently — a hand-enumerated list that a new file doesn't join is
exactly how a review gets skipped. Discovering them only via CI wastes a full
round-trip (~10 min typecheck+lint job) per omission.

**How to apply — before opening a PR, check both conditions and act:**

1. **Any new file that inserts into `orders`** (contains `orderRowFor(` or a
   direct `.from('orders').insert(`) must be added to BOTH:
   - `ORDER_MINTERS` in `apps/web/lib/order-price-authority.test.ts` — a
     `Record<string, string>` keyed by the file's repo-relative path, value =
     one paragraph naming where the price comes from and how the caller is
     authorized (copy the shape of an existing entry, e.g.
     `booth-addon-actions.ts`).
   - `PAID_PATHS` (if it redirects to `payPath(`) or `DELIBERATELY_NOT_REDIRECTED`
     (if it's excused, e.g. a ₱0 comp path) in
     `apps/web/lib/every-buy-button-lands-on-the-payment-page.test.ts`.
   Run both files locally first: `npx tsx --test lib/order-price-authority.test.ts
   lib/every-buy-button-lands-on-the-payment-page.test.ts` from `apps/web`.

2. **Any new migration that grants `authenticated` (or `anon`) new reach** —
   a new table, a new column, a new/changed RLS policy — widens
   `supabase/security/exposure-surface.baseline.txt`, checked by
   `apps/web/tests/db/exposure-freeze.db.test.ts`. Regenerate it with
   `pnpm --filter @setnayan/web exposure:baseline` (from repo root) AFTER
   your migration is final, review the diff (every `+` line should be
   something you deliberately intended and can name the RLS policy for), and
   commit it in the SAME PR. Established precedent: G2's own PR did this for
   `vendor_papic_portfolio_credit_grants` (commit `7b885e1d9`,
   "chore(security): accept the supplier ledger into the exposure baseline").
   Do NOT run this before the migration is final — it replays ALL migrations
   fresh each time, so an intermediate run wastes the ~10s replay for nothing.

3. **Any change to an EXISTING anon-callable RPC's SIGNATURE** (adding a
   parameter to `papic_record_guest_capture` and friends) is the same class as
   2 but easier to miss, because you add no table and no grant. Measured
   2026-09-09 shipping the shutter-minute change (PR #5332): one extra
   defaulted argument fired FOUR guards beyond the exposure baseline —
   - `exposure-freeze` reads the new arity as a NEW anon-callable secdef
     function (the old one shows as a narrowing). Regenerate; the diff should
     be one line with identical grantees/secdef/search_path.
   - db tests that pin the exact `regprocedure` — grep
     `grep -rn "<fn>(uuid,text,…)" apps/web/tests` and update every hit.
     (Do NOT touch the same literal inside already-applied migrations: they
     replay in filename order BEFORE yours, where the old arity is correct.)
   - `lib/papic-guest-ceiling-is-wired.test.ts` pins the guest route's
     signature-fallback ladder as an exact array of argument counts; a new top
     rung must be added there too.
   - `app/papic/the-meter-is-the-only-door.test.ts` requires EXACTLY ONE
     `writer.rpc('papic_record_seat_capture')` in `app/papic/actions.ts`, with
     `p_claimer_user_id`/`p_cost` INLINE at that call — its locator regex caps
     the call block at 1600 chars (after comment stripping), so hoisting the
     args into a `recordArgs` const, or adding a retry rung, breaks it. Put
     long reasoning ABOVE the block, not inside the object literal.

Both categories are silent locally unless you specifically run these three
test files — a scoped `tsc` and a targeted `tsx --test` on your OWN new files
will not catch either, because the guard's assertions live in files you didn't
touch. Run all three routinely on any PR that mints an order or adds
schema, not just when CI already told you to.


## 2026-09-09 (S7, PR #5370) — a THIRD axis: a new `events`-INSERT path, and one roster that fails OPEN

Adding a server action that inserts an `events` row (the story's "Start it now",
`app/dashboard/[eventId]/story/whats-next-actions.ts`) tripped **two** hand-maintained
lists, and **only one of them can catch you**:

1. `GUARDED_EVENT_INSERT_PATHS` in `apps/web/lib/life-event-gate.test.ts` — **fails CLOSED.**
   It *scans* `app/` for `.from('events').insert(` and refuses any file not on the list, so a
   new path is caught automatically. Add the path, and wire `getBlockingLifeEvent`.

2. `CREATION_PATHS` in `apps/web/lib/vendor-event-creation.test.ts` — 🚨 **FAILS OPEN.** It
   asserts each *listed* `{file, fn}` calls `shopAccountMayNotCreateEvents`, so a brand-new
   creation path passes **by being absent from it**. Mine went green while unlisted; after
   adding it, deleting the gate took it 10 pass → 9 pass / 1 fail. **A roster that enumerates
   rather than scans is a guard that cannot see what it has not been told about** — add the
   entry in the same change as the path, or the shop-account ruling simply does not apply there.

Also worth knowing for that shape: reuse `authorizePlanNextYear` (`lib/plan-next-year-authz.ts`)
rather than the route's own `hostUserId` — the latter admits an accepted co-host, and the insert
makes the caller `member_type='couple'` of a **brand-new** event. That exact distinction was a
live privilege escalation in July 2026.

🪤 **DO NOT restore a sabotaged file with `git checkout -- <file>` while you hold uncommitted
work** — it restores from the last COMMIT and silently discarded ~40 minutes of edits to
`lib/whats-next.ts` here. Restore from the `cp` backup you took, and `git diff --stat` after.
