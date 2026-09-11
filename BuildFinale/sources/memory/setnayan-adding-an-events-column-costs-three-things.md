---
name: setnayan-adding-an-events-column-costs-three-things
description: "A new public.events column needs a GRANT SELECT, an events_host rebuild in the SAME migration, and an accepted exposure-baseline line — omit the grant and PostgREST refuses EVERY events query; and write ONE ALTER TABLE PER COLUMN, because the guard only sees the first column of a comma-separated statement"
metadata: 
  node_type: memory
  type: project
  originSessionId: 8500c81f-ec37-4cc0-b15b-5514f467a54d
  modified: 2026-09-06T15:31:14.674Z
---

Measured 2026-09-06 on RV2 (PR #5273), which added
`events.dismissed_room_suggestions`. Three separate guards fired, in this order,
each on a different CI step:

1. **`GRANT SELECT (col) ON public.events TO authenticated`** —
   `apps/web/scripts/lint-events-column-grants.mjs`. `public.events` revokes
   table-level SELECT and re-grants a computed per-column allowlist
   (migration `20271007100000`). An ungranted column is not merely invisible:
   **PostgREST refuses the ENTIRE query**, so any page whose `events` select
   NAMES the column returns no row at all and renders as an event that does not
   exist. RV2's seating lab would have shipped dead.
2. **Rebuild `public.events_host` in the SAME migration, AFTER the grant** —
   same guard, second half. That view has an EXPLICIT column projection computed
   from the grants, so a new base column is a phantom on it until recreated, and
   `/dashboard/[eventId]/details` THROWS on a query error — killing
   Personalization for every host on every event type. Copy the whole
   `DROP VIEW` + `DO $$ … $$` block verbatim from `20271025120000`, including its
   `private_columns` list and its refuse-if-empty `RAISE`; an omitted private
   column silently drops it from the host's read path.
3. **Accept the widening into `supabase/security/exposure-surface.baseline.txt`**
   — `tests/db/exposure-freeze.db.test.ts` (a `test:db:ci` test, ~21 min).
   Regenerate with `pnpm --filter @setnayan/web exposure:baseline`, then **read
   the diff**: it should contain only your column. A blanket refresh silently
   absorbs any other widening sitting in the tree. Commit it separately as
   `chore(security): …`, the convention already in the log (`e3af1760f`).

🔑 **The db coverage tests structurally CANNOT catch #1** — the guard says so in
its own output: their `before()` re-applies the lockdown, which recomputes the
allowlist over the new column, so the bug disappears exactly where it would be
tested. Only the migration-text guard sees it.

⚠ **The CI failure you are shown may be three steps from the cause.** RV2's run
reported `native encoder tests: skipped` as the failure. The real failure was
`Data-layer guards (DB replay)`; everything after it skipped, and the aggregator
flagged the skip. Read the job's step list, not the annotation.

**How to apply:** put all three in the same PR as the column. Add a
`DO $$ … RAISE $$` post-condition to the migration asserting the grant took and
`events_host` carries the column, so it proves itself. Related:
[[setnayan-reception-design-is-a-closed-vocabulary]].

---

## ⚠ ADDED 2026-09-09 (PR #5330) — TWO WAYS THE ABOVE STILL FAILS

### 4 · ONE `ALTER TABLE` PER COLUMN. The guard is blind to the rest.
`lint-events-column-grants.mjs` matches `ALTER TABLE events` **immediately**
followed by `ADD COLUMN`, so in a comma-separated statement it captures **only
the first column**:

```sql
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS a TEXT,   -- seen by the guard
  ADD COLUMN IF NOT EXISTS b TEXT;   -- INVISIBLE
```

Proven by sabotage, not by reading: with two cover columns in one statement,
deleting the second one's `GRANT SELECT` line left the lint exiting **0**. Split
into separate statements and all are checked. **Measured: 81 events columns
across 37 multi-clause statements are invisible to that guard today** — but
cross-checked against prod, none of the 75 that still exist is *accidentally*
unreadable, so it is a latent trap, not a live outage. Widening the regex is
its own change (spawned as a task, not folded into a column PR).

🔑 **This is the concrete reason to sabotage-check rather than trust a green
guard.** #1 above is the only thing standing between an ungranted column and
every signed-in events read going empty — and for a second column it was not
standing there at all.

### 5 · DO NOT "fix" `private_columns` with prod's unreadable set.
The verbatim 15-name list is CORRECT. Prod has **22** events columns
`authenticated` cannot SELECT — seven more — and the extra seven include
`master_qr_token` and the two `photo_delivery_oauth_*` token columns. Projecting
all 22 into `events_host` would **newly expose those secrets**.

Check the list is current with arithmetic instead of trusting the copy:
`selectable + private = events_host column count`. On 2026-09-09 that was
`191 + 15 = 206`, matching prod exactly (events itself had 213 columns). Add a
proof block that fails if `events_host` ever projects `master_qr_token` or either
OAuth column, so a future "fix" cannot land quietly.

⚖ Four other columns (`kwento_flash_auto_wall`, `last_kwento_notify_at`,
`papic_vendor_challenges_enabled`, `panood_manual_on_air_at`) are unreadable AND
absent from `events_host`. That is the existing state; leave it alone in a column
PR.

### Also worth knowing
`has_column_privilege()` **throws** on a column that no longer exists, so a sweep
over historical column names must join `information_schema.columns` first — five
of those 80 names have since been dropped (e.g. `editorial_tone`).
`BEGIN … ROLLBACK` does work through the Supabase MCP `execute_sql`; prove it
with a throwaway table before dry-running DDL on `events`.

## ⚠ POINT 3 IS NOT EVENTS-SPECIFIC — it fires for ANY table (2026-09-09)

Measured on PR #5372, which added a nullable `previous_scheduled_at` to
`public.event_appointments` — a table with no per-column grant scheme at all.
Points 1 and 2 above are genuinely `public.events` only. **Point 3 is not.**
`exposure-freeze.db.test.ts` failed with *"EXPOSURE SURFACE WIDENED — 1 new
capability for anon / authenticated"*, because a new column INHERITS the table's
existing grants and inheritance is itself a widening.

So budget for it on every `ADD COLUMN`, anywhere:

```bash
pnpm --filter @setnayan/web exposure:baseline
```

Then READ the diff — one added line per new column is expected
(`col  public.<t>.<c>  anon=SIU authenticated=SIU`); more than that means
something else widened too. It runs a full 1377-migration PGlite replay, so give
it several minutes.

🔑 And the guard's "TWO WAYS FORWARD" prompt is worth actually weighing, not
skipping to the regenerate. Narrowing is right when the column is genuinely
server-only; it is WRONG when the column mirrors a sibling that is already
exposed and is written under the caller's own session — revoking UPDATE there
breaks the writer. `event_appointments` was the second case: all 24 existing
columns were already `anon=SIU authenticated=SIU`.
