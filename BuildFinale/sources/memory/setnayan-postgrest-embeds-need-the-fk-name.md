---
name: setnayan-postgrest-embeds-need-the-fk-name
description: "A bare `events!inner` embed is refused with PGRST201 and dies silently; counting foreign keys is the wrong question"
metadata: 
  node_type: memory
  type: project
  originSessionId: 6fb97916-7e77-409d-9802-6e036ea53c32
  modified: 2026-09-09T08:29:55.425Z
---

In setnayan-platform, a PostgREST embed of `events` must name its foreign key —
`events!event_vendors_event_id_fkey!inner(...)`, `events!chat_threads_event_id_fkey!inner(...)` —
never a bare `events!inner`. Verified against the live REST API on 2026-09-09: bare from
`event_vendors` returns **HTTP 300 / PGRST201**; FK-named returns 200.

**Why:** one direct FK reaches `events`, but ~19 junction tables also join the two, so PostgREST
finds many routes and refuses the whole query rather than guessing.

**Why it matters:** the refusal is invisible. The read returns an error, the caller degrades to
null, and the feature simply never renders. Three shipped features died this way before a guard
existed — one of them the supplier's "another couple is holding you on your date" caution, never
once shown.

🔑 **Asking prod for the foreign keys does NOT predict this, and is the wrong question.** A
`pg_constraint` query answers "one FK", which reads as unambiguous — the ambiguity comes from every
*other* table that reaches `events`, which that query cannot see. Probe the REST API instead (anon
key via the Supabase MCP `get_publishable_keys`; a `curl` with `select=...` shows PGRST201
immediately). Another instance of [[setnayan-guards-must-test-the-claim]].

`apps/web/lib/the-cure-was-already-written-down.test.ts` scans the tree for the `event_vendors`
half only — **`chat_threads` and every other table are uncovered**, so name the FK there yourself.
