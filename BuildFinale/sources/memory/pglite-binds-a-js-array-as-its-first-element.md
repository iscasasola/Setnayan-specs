---
name: pglite-binds-a-js-array-as-its-first-element
description: "In Setnayan's PGlite db-test replay, passing a JS array as a query param binds its bare first element — pass a Postgres array literal string instead"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 07f9360d-521b-4e8a-9c58-0ad4f7746686
  modified: 2026-09-10T18:21:53.264Z
---

In `apps/web/tests/db/*.db.test.ts` (PGlite replay), `db.query(sql, [['principal_sponsor']])` with `$1::guest_role[]` fails `22P02 malformed array literal: "principal_sponsor"` — the JS array is bound as its first element. Pass `` `{${arr.join(',')}}` `` (a Postgres array literal string) instead.

**Why:** hit 2026-09-11 building the sponsor-share test; it looks like a SQL bug in the function under test but is the test harness.
**How to apply:** any db test seeding an array column (e.g. `guests.extra_roles`, which is also NOT NULL — COALESCE to '{}'). Related: [[setnayan-sponsor-share-landed]].
