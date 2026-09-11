---
name: setnayan-a-new-fk-to-auth-users-needs-on-delete
description: a bare REFERENCES auth.users(id) is NO ACTION and blocks account deletion; the guard only runs in CI's DB-replay job
metadata:
  type: project
---

A new column written as `set_by UUID REFERENCES auth.users(id)` — no ON DELETE
clause — is **NO ACTION**, which **REFUSES the user delete**. One row in a minor
feature table is enough to block erasing an account.

`apps/web/tests/db/user-delete-fk-surface.db.test.ts` catches it and names the two
honest answers: give the column a behaviour, or add a line to
`tests/db/user-delete-refusing-fks.baseline.txt` saying what must outlive its author
and why. A second test, `user-fk-behaviour.db.test.ts`, then demands the generated
map be regenerated **in the same PR**: `UPDATE_FK_BEHAVIOUR=1 pnpm --filter
@setnayan/web test:db`. Check the regenerated diff moves by the lines you expect and
that RESTRICT does not grow — that is what separates a record of a fix from a mask.

**Why this is easy to miss:** neither guard is in the unit suite. They run only in
the `typecheck + lint` job's *Data-layer guards (DB replay)* step, which is the
slowest thing in CI (~30 min), so a locally-green branch can still fail there.

**How to apply:** for an authorship stamp ("who did this"), `ON DELETE SET NULL` —
match the sibling `event_category_build_state.set_by`. Reach for CASCADE only when
the row is meaningless without that user; on anything shared by all hosts of an
event, CASCADE is the defect, because one host closing their account would silently
change what the others see. Note the generated map's own warning: Supabase erasure
issues no delete, so **SET NULL never means "erasure handled it"** — check
`erasure-completeness.db.test.ts` separately. See [[setnayan-order-mint-and-table-rosters]]
and [[setnayan-adding-an-events-column-costs-three-things]].
