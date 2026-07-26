export const meta = {
  name: 'setnayan-exposure-audit-and-freeze',
  description: 'Audit everything the public keys can reach across 368 tables, views and SECURITY DEFINER functions; then freeze the permission surface with a CI guard',
  phases: [
    { title: 'Inventory', detail: 'Full permission matrix, risk tiering, and the views/RPC attack surface' },
    { title: 'Hunt', detail: 'Shard by risk tier — find actually-exploitable holes, not theoretical ones' },
    { title: 'Verify', detail: 'Adversarially confirm each claimed hole before it reaches the owner' },
    { title: 'Freeze', detail: 'CI guard that fails any PR widening what anon/authenticated can reach' },
    { title: 'Report', detail: 'Ranked, de-duplicated, owner-readable' },
  ],
}

const PROJECT = 'njrupjnvkjkitfctetvi'
const REPO = 'iscasasola/setnayan-platform'

const COMMON = `
Setnayan platform. Repo ${REPO} (app in apps/web). Supabase project ${PROJECT} — you have a Supabase MCP with execute_sql.

🚫 PROD IS READ-ONLY. execute_sql against ${PROJECT} for INSPECTION ONLY. Never INSERT/UPDATE/DELETE/ALTER/DROP against prod. Never create a branch (it costs money). To PROVE exploitability, write a DB test in apps/web/tests/db/*.db.test.ts that runs as a genuine unprivileged role — do not attack prod.

=== WHY THIS AUDIT EXISTS ===
In one day, seven separate vulnerabilities were found in this codebase, and they were all the SAME mistake: the UI was treated as the security boundary while the database sits directly on the internet. Supabase publishes every table as a REST endpoint; the anon key is in the page source by design. Worked examples, all real, all found today:
  · R2 presign endpoint signed ANY storage key → any user could pull another vendor's government IDs.
  · A wedding guest could SELECT the couple's entire events row — QR master token, Google OAuth token.
  · A guest can still read the couple's birth dates and budget (RLS is ROW-level; it cannot hide a column).
  · estimated_pax came from the submitted form → a ₱2,800 price became ₱0.
  · requested_total_php came from the client → pay ₱1 for any SKU.
  · event_type is host-writable and Setnayan AI prices off it live → ₱1,499 becomes ₱99.
  · std_media.nsfw verdict was PATCHable → publish unscreened video.

=== THE MEASURED STARTING POSITION (verified 2026-07-26) ===
368 tables in public. RLS enabled on ALL 368 (good). BUT:
  · 361 tables grant SELECT and INSERT to **anon**
  · 360 grant INSERT / UPDATE / DELETE to **authenticated**
  · 28 tables have RLS enabled with ZERO policies
This is the stock Supabase \`GRANT ALL ... TO anon, authenticated\` default. It means RLS policies are the ONLY gate — there is no defence in depth. One wrong policy = that table fully exposed.

⚠ RLS IS ROW-LEVEL ONLY. It can never hide a column. Any table mixing sensitive columns with columns a wider audience legitimately reads has a structural hole that no policy can close — it needs column REVOKEs, a split table, or a view. This is the SEC-2b shape and it is likely to recur across many tables.

⚠ RLS ON + ZERO POLICIES = deny-all for non-owner roles, which is SAFE, not broken. But it may mean a feature silently does not work, or that the table is only ever reached via service_role. Classify, do not "fix" by adding permissive policies.

=== SCALE CONTEXT — READ THIS, IT CHANGES WHAT MATTERS ===
auth.users has exactly ONE signup ever (the owner, 2026-05-12). public.orders has ZERO rows ever. So NOTHING was actually breached — there was no second tenant's data to steal. Do NOT write breach-response findings or urgency theatre. The value here is entirely preventative: these must be closed before the first real vendor uploads a DTI certificate. Rank by "how bad would this be with 5,000 weddings on the platform", not by "who is affected today" (nobody is).

=== HOUSE RULES ===
· The repo has 8 canonical RLS patterns + 4 helper functions: is_admin, current_event_ids, current_vendor_ids, current_thread_ids. Prefer these; do not invent new patterns. See 02_Specifications/RLS_Policy_Pattern.md in the spec corpus at ~/Documents/Claude/Projects/Setnayan/.
· Reuse-first. A new bespoke helper next to one that already does the job is a defect.
· ⚠ VACUOUS DB TESTS: this repo has shipped them TWICE. A psql connection that OWNS the table SKIPS RLS entirely, so an RLS test run as the owner passes no matter what the policy says. Every DB test needs a meta-test asserting the connected role is 'authenticated', is NOT the table owner, and lacks BYPASSRLS — plus a neutralisation proof (remove the guard, tests must fail).
· ⚠ Migration timestamp collisions have bitten twice. ls supabase/migrations/ | tail -30 before committing. Other agents are concurrently adding migrations on public.events and public.orders/payments — stay out of those two lanes; they are being handled.
· Changelog fragments go in the ROOT changelog.d/, never apps/web/changelog.d/ (CI guard).
· is_active = false is OVERLOADED: on SETNAYAN_AI_RENEW it means "not independently sellable", not "retired". See resolveServiceSellability in apps/web/lib/v2-catalog.ts.
`

// ─────────────────────────────────────────────────────────────────────────────
phase('Inventory')

const TIER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['tiers', 'noPolicyTables', 'columnRiskTables', 'totals'],
  properties: {
    totals: { type: 'string' },
    tiers: {
      type: 'array',
      description: 'Risk tiers, most dangerous first. Between 5 and 8 tiers. Every one of the 368 tables must appear in exactly one tier.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'rationale', 'tables'],
        properties: {
          name: { type: 'string' },
          rationale: { type: 'string' },
          tables: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    noPolicyTables: { type: 'array', items: { type: 'string' }, description: 'The 28 RLS-on-zero-policy tables' },
    columnRiskTables: {
      type: 'array',
      description: 'Tables that mix sensitive columns with columns a wider audience legitimately reads — the structural SEC-2b shape that no RLS policy can fix',
      items: { type: 'string' },
    },
  },
}

const SURFACE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['views', 'definerFunctions', 'findings'],
  properties: {
    views: { type: 'string', description: 'Views reachable by anon/authenticated and whether security_invoker is set' },
    definerFunctions: { type: 'string', description: 'SECURITY DEFINER functions executable by anon/authenticated' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['severity', 'object', 'summary', 'evidence'],
        properties: {
          severity: { type: 'string' },
          object: { type: 'string' },
          summary: { type: 'string' },
          evidence: { type: 'string' },
        },
      },
    },
  },
}

const [tiering, surface] = await parallel([
  () => agent(`${COMMON}

INVENTORY TASK A — build the complete permission matrix for all 368 public tables and sort them into RISK TIERS that the hunt phase will shard on.

Pull from prod (READ-ONLY) at minimum:
  · pg_class.relrowsecurity / relforcerowsecurity per table
  · every pg_policy: table, name, cmd, permissive vs RESTRICTIVE, roles, and the FULL pg_get_expr of USING and WITH CHECK
  · table privileges per role (anon, authenticated) — has_table_privilege for SELECT/INSERT/UPDATE/DELETE
  · COLUMN privileges — information_schema.role_column_grants, because column grants are where SEC-2b lives and table-level checks miss it entirely
  · row counts per table (helps judge what actually holds data)

Then produce:

1. RISK TIERS (5–8 of them), most dangerous first, every table in exactly one tier. Tier by BLAST RADIUS AT SCALE, not by row count today. Suggested spine, adapt as the data warrants:
   · Money and entitlement — anything that sets a price, records a payment, or unlocks a SKU
   · Identity and credentials — tokens, OAuth, secrets, verification documents, API keys
   · Sensitive personal data (RA 10173) — biometrics/face data, birth dates, government IDs, health, minors, private messages
   · Cross-tenant relational — tables joining couples↔vendors↔guests where one wrong policy leaks between tenants
   · Guest-facing surfaces — reachable by the largest and least-authenticated audience
   · Vendor business data — pricing, clients, contracts
   · Operational / telemetry / catalog — low sensitivity
   Give each tier a one-line rationale. Balance tier sizes so no single tier exceeds ~70 tables; split a tier if it would.

2. noPolicyTables — the 28 with RLS on and zero policies. For each, say whether it is deny-all-by-design (service_role only) or a likely broken feature. Do NOT recommend adding permissive policies to make a feature work; flag it.

3. columnRiskTables — tables where sensitive and widely-readable columns coexist in one row, so RLS structurally cannot help. This is the highest-value output of this task: it predicts where the next SEC-2b is. Be thorough.

Return the tier table lists as exact table names — the next phase shards on them, so a typo drops a table from the audit entirely.`, { schema: TIER_SCHEMA, phase: 'Inventory', label: 'inventory:matrix+tiers', effort: 'max' }),

  () => agent(`${COMMON}

INVENTORY TASK B — audit the NON-TABLE attack surface, which is routinely worse than tables and is invisible to a table-only audit.

1. VIEWS. In Postgres a view runs with the PRIVILEGES OF ITS OWNER unless security_invoker = true. A view owned by postgres over an RLS-protected table hands out every row to anyone who can SELECT the view — RLS on the base table does nothing. This is one of the most common serious Supabase misconfigurations.
   · List every view in public, its owner, whether security_invoker is set (check reloptions), and which roles may SELECT it.
   · For any view without security_invoker over a table holding money / identity / personal data, state exactly what it exposes.
   · Include materialized views — they NEVER honour RLS.

2. SECURITY DEFINER FUNCTIONS. These run as their owner and bypass RLS by design. Any one executable by anon or authenticated is a potential privilege-escalation route.
   · List every SECURITY DEFINER function in public with EXECUTE granted to anon or authenticated: name, args, owner, and the full body.
   · For each, judge: does it perform its OWN authorization check? Does it take a caller-supplied id and act on it without verifying ownership? Does it leak data through its return value or through a distinguishable error?
   · Check search_path is pinned on each — an unpinned search_path on a SECURITY DEFINER function is a classic privilege-escalation vector.
   · Pay attention to public.generate_public_id and the four helpers (is_admin, current_event_ids, current_vendor_ids, current_thread_ids) — if is_admin is spoofable or reads a user-writable column, EVERY policy that depends on it fails at once. Check what is_admin actually reads and whether that source is user-writable.

3. Anything else reachable: RPCs exposed via PostgREST, triggers that run with elevated rights, foreign tables, and any GRANT to PUBLIC (not just anon/authenticated) — a GRANT TO PUBLIC is easy to miss and covers every role.

Report concrete findings with evidence (object name + the SQL output or body line that proves it). Severity by blast radius at scale.`, { schema: SURFACE_SCHEMA, phase: 'Inventory', label: 'inventory:views+definer-fns', effort: 'max' }),
])

const tiers = (tiering?.tiers || []).filter((t) => t && Array.isArray(t.tables) && t.tables.length)
log(`Inventory: ${tiers.length} risk tiers · ${tiers.reduce((n, t) => n + t.tables.length, 0)} tables tiered · ${(tiering?.columnRiskTables || []).length} column-risk tables · ${(surface?.findings || []).length} view/function findings.`)

const INVENTORY_BRIEF = `
=== RISK TIERING + PERMISSION MATRIX ===
${JSON.stringify(tiering, null, 2)}

=== VIEWS AND SECURITY DEFINER FUNCTIONS ===
${JSON.stringify(surface, null, 2)}
`

// ─────────────────────────────────────────────────────────────────────────────
phase('Hunt')

const HOLE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['tier', 'holes', 'tablesCleared', 'coverageNote'],
  properties: {
    tier: { type: 'string' },
    tablesCleared: { type: 'number' },
    coverageNote: { type: 'string', description: 'Anything NOT examined and why — silent truncation is a defect' },
    holes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['severity', 'table', 'kind', 'summary', 'attack', 'evidence', 'fixShape'],
        properties: {
          severity: { type: 'string', description: 'critical | high | medium | low' },
          table: { type: 'string' },
          kind: { type: 'string', description: 'row-leak | column-leak | write-escalation | money | identity | cross-tenant | definer-bypass | view-bypass' },
          summary: { type: 'string' },
          attack: { type: 'string', description: 'Concrete: who, holding what, issues which request, and what they get back' },
          evidence: { type: 'string', description: 'Policy expression, grant output, or file:line. Not an assertion.' },
          fixShape: { type: 'string' },
        },
      },
    },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['confirmed', 'refuted', 'notes'],
  properties: {
    confirmed: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['table', 'severity', 'summary', 'attack', 'whyItHolds'],
        properties: {
          table: { type: 'string' }, severity: { type: 'string' }, summary: { type: 'string' },
          attack: { type: 'string' }, whyItHolds: { type: 'string' },
        },
      },
    },
    refuted: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['table', 'claimedSummary', 'whyItFails'],
        properties: { table: { type: 'string' }, claimedSummary: { type: 'string' }, whyItFails: { type: 'string' } },
      },
    },
    notes: { type: 'string' },
  },
}

// pipeline: each tier is hunted, then its findings are adversarially verified as
// soon as THAT tier finishes — no barrier, so a slow tier never blocks a fast one.
const hunted = await pipeline(
  tiers,
  (tier) => agent(`${COMMON}

${INVENTORY_BRIEF}

HUNT — you own risk tier "${tier.name}".
Rationale for this tier: ${tier.rationale}

YOUR TABLES (${tier.tables.length}) — every one must be examined:
${tier.tables.join(', ')}

For each table, answer concretely, from the ACTUAL policy expressions and grants (not from the table's name):
  1. ROW LEAK — can a logged-in stranger read rows that are not theirs? Read the USING expression and find the case where it is true for someone it should not be. Watch for policies that check membership of the WRONG entity, use OR where they meant AND, or trust a column the requester can write.
  2. COLUMN LEAK — does the row-level policy correctly admit a wide audience (guests, vendors, the public) while the row contains columns that audience must not see? RLS cannot fix this; only a column REVOKE, a split table, or a view can. This is the SEC-2b shape and it is expected to be COMMON. Check column grants explicitly.
  3. WRITE ESCALATION — can a user INSERT or UPDATE a row that grants them something? Specifically: a column that sets a price, an entitlement, a status, a verdict, a role, a verification state, a quota, or a flag the server later trusts. A WITH CHECK that only proves "this row is mine" does NOT stop me setting my own row's price to 1 or my own vendor's verified flag to true.
  4. CROSS-TENANT — on join tables, can I attach myself to someone else's event/vendor/thread by inserting a row naming their id?
  5. DELETE — can I delete rows that are not mine, or that are evidence (chat messages are supposed to be unerasable; audit rows, payment records)?

Rank by blast radius AT SCALE (5,000 weddings), not by today's row counts — there is 1 user and 0 orders, so everything is empty; judge the shape, not the data.

Report only holes you can describe as a CONCRETE ATTACK: who, holding what credential, issues which request, and what comes back. "This policy looks permissive" is not a finding. If a table is fine, it is fine — do not manufacture findings to look thorough; a flood of false positives is worse than nothing because it buries the real ones.

State in coverageNote anything you did not examine and why. Silent truncation is a defect.`, { schema: HOLE_SCHEMA, phase: 'Hunt', label: `hunt:${tier.name}`.slice(0, 60), effort: 'high' }),

  (found, tier) => {
    const holes = (found?.holes || []).filter((h) => h.severity === 'critical' || h.severity === 'high')
    if (!holes.length) return { confirmed: [], refuted: [], notes: `No critical/high holes in tier ${tier.name}; ${(found?.holes || []).length} lower-severity noted.`, _tier: tier.name, _raw: found }
    return agent(`${COMMON}

${INVENTORY_BRIEF}

ADVERSARIAL VERIFY — tier "${tier.name}". Another agent claims these are exploitable. Your job is to REFUTE them. Default to "not a real hole" and make each one earn its place.

=== CLAIMED HOLES ===
${JSON.stringify(holes, null, 2)}

For each claim, check independently against prod (READ-ONLY) and the repo:
  · Re-read the ACTUAL policy expressions yourself. Do not trust the quoted version — a misquoted predicate is the commonest source of a false finding.
  · Is there a RESTRICTIVE policy that already blocks it? Restrictive policies AND with the permissive ones and are easy to overlook.
  · Is there a trigger, a CHECK constraint, a column REVOKE, or a NOT NULL / FK that defeats the attack?
  · Is the table actually reachable over PostgREST, or is it excluded from the exposed schema?
  · Does the claimed attack require something the attacker cannot obtain (an id they cannot learn, a role they cannot hold)? If the id is guessable or enumerable, say so — "they would need to know the event id" is NOT a defence if event ids appear in URLs.
  · For column-leak claims: verify the column grant actually exists for that role, with has_column_privilege. Do not accept the claim.
  · For write-escalation claims: verify the server actually TRUSTS the column later. A writable column nobody reads is noise, not a vulnerability.

Return confirmed holes (with why the refutation attempt failed) and refuted ones (with why they fail). Be specific — a refutation without a reason is as useless as a finding without evidence.`, { schema: VERDICT_SCHEMA, phase: 'Verify', label: `verify:${tier.name}`.slice(0, 60), effort: 'high' })
      .then((v) => ({ ...(v || { confirmed: [], refuted: [], notes: 'verify agent returned nothing' }), _tier: tier.name, _raw: found }))
  },
)

const results = hunted.filter(Boolean)
const allConfirmed = results.flatMap((r) => (r.confirmed || []).map((c) => ({ ...c, tier: r._tier })))
const allRefuted = results.flatMap((r) => (r.refuted || []).length)
log(`Hunt+Verify complete: ${allConfirmed.length} CONFIRMED holes across ${results.length} tiers · ${allRefuted} claims refuted.`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Freeze')

const freeze = await agent(`${COMMON}

${INVENTORY_BRIEF}

BUILD THE FREEZE — a CI guard that makes this class of mistake impossible to reship silently. This is the durable half of the job and matters more than any individual fix, because the owner will keep building fast.

Work in a FRESH git worktree off latest origin/main. Open a DRAFT PR against ${REPO}. DO NOT enable auto-merge. Do not merge.

THE PROBLEM IT SOLVES: today nobody — including the people writing the migrations — knows what anon and authenticated can reach. A new table ships with the stock GRANT ALL, or a policy is loosened during debugging, and nothing anywhere notices. Seven vulnerabilities reached production this way.

BUILD:

1. A COMMITTED BASELINE of the exposure surface, generated from the live schema. Per table: RLS enabled/forced, table privileges for anon + authenticated, the set of columns each role may SELECT and UPDATE, and each policy's name + command + permissive/restrictive. Plus views (owner + security_invoker) and SECURITY DEFINER functions executable by anon/authenticated. Store it as a stable, deterministically-ordered, human-diffable file — the point is that a reviewer can SEE the change in a PR diff. Sort everything; never let ordering churn create noise.

2. A TEST that regenerates the surface and compares it to the baseline. Critically:
   · FAIL on WIDENING — a new grant, a new column exposed, a policy dropped, RLS disabled, a new anon-executable SECURITY DEFINER function, a view losing security_invoker.
   · PASS on NARROWING — revoking access must never require ceremony. Make the asymmetry explicit in the code and say why: a guard that punishes tightening will be disabled within a month.
   · The failure message must teach. State exactly which table/column/role widened, why that is dangerous, and the two legitimate paths forward (narrow it, or deliberately update the baseline in the same PR so a human sees it in review).

3. WIRE IT INTO CI so it actually runs. Inspect .github/workflows and follow how test:db / test:db:ci is already run. If DB-backed tests do NOT currently run in CI, say so plainly in the PR body and wire the parts that can run without a database (the baseline is a committed file, so a pure-file consistency check can run everywhere) — do not silently ship a guard that never executes. A guard that does not run is worse than none, because it manufactures false confidence.

4. A SHORT README next to the baseline: how to regenerate it, when updating it is legitimate, and the one-paragraph story of why it exists (the seven findings). Write it for someone who has never seen this conversation.

5. Root changelog.d/ fragment with a SPEC IMPACT line.

PROVE IT WORKS — this is mandatory, not optional:
  · Show the guard FAILING on a synthetic widening (e.g. a test fixture granting SELECT on a column, or a doctored baseline), and the exact message it prints.
  · Show it PASSING on a narrowing.
  · Show it passing clean on the real current schema.
  · If the check can pass without ever comparing anything (empty baseline, skipped when no DB, silently-caught exception), that is the vacuous-test trap in a new costume — prove it cannot.

Run npx tsc --noEmit and the unit suite. Note: 7 unit tests fail on clean main (pHash native deps, vendor-deep-search) — verify against the base before attributing them to yourself.`, { phase: 'Freeze', label: 'freeze:ci-exposure-guard', effort: 'max' })

// ─────────────────────────────────────────────────────────────────────────────
phase('Report')

const report = await agent(`${COMMON}

Write the final report FOR THE OWNER — a solo non-engineer founder. He asked "protect us, what should we do?" and greenlit this audit. He reads plain English and makes real decisions from it. No jargon walls, no theatre, no padding.

=== INVENTORY ===
${INVENTORY_BRIEF}

=== CONFIRMED HOLES (post-adversarial-verification) ===
${JSON.stringify(allConfirmed, null, 2)}

=== FULL HUNT + VERIFY DETAIL (includes refuted claims) ===
${JSON.stringify(results, null, 2)}

=== THE CI FREEZE ===
${freeze}

VERIFY BEFORE YOU WRITE — do not just summarise the above:
  · Spot-check at least five of the most severe confirmed holes yourself against prod (READ-ONLY). If any does not reproduce, say so and drop it. A false alarm in a security report destroys trust in the whole document.
  · Confirm the freeze PR number, that it is a DRAFT without auto-merge, and its CI status.
  · Confirm the total table count and how many were actually examined. If coverage was incomplete, state the gap plainly.

THEN WRITE:

1. THE HEADLINE — in three sentences a non-engineer understands: how exposed is this platform right now, and is anything on fire? Remember: 1 user, 0 orders, so nothing has been stolen. Do not manufacture urgency, and do not soften a real problem either.

2. WHAT WE FOUND — the confirmed holes, ranked by how bad they would be with 5,000 weddings on the platform. For each: one plain sentence on what someone could do, and one on the fix. Group by theme rather than listing 40 items — he needs to see the PATTERN, not a spreadsheet.

3. THE THINGS THAT ARE STRUCTURAL, NOT INCIDENTAL. Specifically call out where a table mixes sensitive and shared columns, because no policy can ever fix that and it will keep producing bugs until those tables are split. This is the most valuable thing in the report.

4. WHAT IS NOW IMPOSSIBLE TO REPEAT — what the CI guard catches from here on, and honestly, what it does NOT catch.

5. WHAT WE SHOULD DO, IN ORDER. A short ordered list. Distinguish: what I can just do next · what needs his decision · what genuinely needs an outside professional. Give a recommendation on each, not a menu.

6. WHAT WE STILL DO NOT KNOW. Be honest about the limits of this audit — what it could not examine, and why an outside penetration test is still worth paying for before real money moves.

Understating a money-path risk is worse than admitting a gap. So is overstating one.`, { phase: 'Report', label: 'report:owner-synthesis', effort: 'max' })

return {
  tablesAudited: tiers.reduce((n, t) => n + t.tables.length, 0),
  tiers: tiers.map((t) => ({ tier: t.name, tables: t.tables.length })),
  confirmedHoles: allConfirmed.length,
  bySeverity: {
    critical: allConfirmed.filter((h) => h.severity === 'critical').length,
    high: allConfirmed.filter((h) => h.severity === 'high').length,
  },
  columnRiskTables: (tiering?.columnRiskTables || []).length,
  viewAndFunctionFindings: (surface?.findings || []).length,
  report,
}
