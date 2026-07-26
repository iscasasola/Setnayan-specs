export const meta = {
  name: 'sec4-orders-insert-lockdown',
  description: 'Close the direct-PostgREST orders INSERT pricing hole: revoke INSERT, move 8 sites to service_role with explicit authz, adversarially verify',
  phases: [
    { title: 'Recon', detail: 'Re-verify call sites, DB grants/policies/triggers, and the authz each site currently leans on' },
    { title: 'Implement', detail: 'Migration + 8 call-site conversions with explicit ownership assertions + DB tests' },
    { title: 'Verify', detail: '5 independent adversarial lenses on the resulting diff' },
    { title: 'Repair', detail: 'Fix anything a verifier proved BROKEN, then re-verify' },
    { title: 'Report', detail: 'Synthesise and open the PR' },
  ],
}

const REPO = 'iscasasola/setnayan-platform'

// ── Shared context every agent needs. The traps here are all real and all
// already bit this repo today; repeating them is cheaper than re-learning them.
const COMMON = `
REPO: ${REPO}. Monorepo; app code in apps/web. Supabase project njrupjnvkjkitfctetvi (you have a Supabase MCP with execute_sql for READ-ONLY inspection of prod — never mutate prod).

THE VULNERABILITY (already triaged; do not re-triage, verify and fix):
public.orders INSERT is reachable directly over PostgREST with the public anon key.
  - orders_owner_write (20260513150000_iteration_0034_payments.sql:77) is FOR ALL ... WITH CHECK (user_id = auth.uid()) — no amount guard.
  - guard_orders_protected_columns (20270226279630_money_path_security_guards.sql) protects requested_total_php / service_key / confirmed_total_php but is BEFORE **UPDATE** only — it never sees an INSERT.
  - orders_insert_status_guard (20270920010000_order_payment_write_guard.sql) constrains STATUS only, never the amount.
Net: an authenticated user POSTs /rest/v1/orders with {user_id: self, event_id: their own event, service_key: any SKU, requested_total_php: 1, status: 'submitted', reference_code: 'SN…'}, pays PHP 1 for real, and /admin/payments shows PHP 1 as the order's own asking price so reconciliation looks correct. Approval then runs activateOrderSku and they own the SKU.

PR #3731 already deleted the legacy createOrder server action (the app-layer half). This is the DB-layer half.

AGREED FIX SHAPE (settled in #3731):
  REVOKE INSERT ON public.orders FROM authenticated, anon  → the server becomes the only minter
  + switch every session-role insert site to createAdminClient() (service_role).

⚠⚠ THE MAIN RISK, AND THE MAIN WORK: each of those sites currently relies on RLS for its AUTHORIZATION. Moving to service_role REMOVES that check. Every converted site needs an explicit ownership/membership assertion in code BEFORE the insert, or the fix trades a pricing hole for an authorization hole — strictly worse, because service_role also bypasses every other policy on the table.

⚠ DO NOT write a SQL trigger that re-derives the price. Pricing spans platform_retail_catalog_v2 + platform_package_catalog + a pax curve keyed to events.estimated_pax + per-event-type Setnayan AI pricing + subscription cycle multiplication. A SQL price rule = a second source of truth, which is exactly what #3731 exists to prevent.

⚠ is_active = false is OVERLOADED. On SETNAYAN_AI_RENEW it means "not independently sellable", NOT "retired" — see the long comment above resolveServiceSellability in apps/web/lib/v2-catalog.ts. A naive "reject inactive SKUs" guard breaks every AI renewal. This repo has already shipped one is_active regression from exactly this misreading.

⚠ VACUOUS DB TESTS: this repo has TWICE shipped DB tests that passed for the wrong reason, because the test connection OWNED the table and Postgres skips RLS for table owners. Any DB test here MUST include a meta-test asserting the connected role is 'authenticated', is NOT the table owner, and lacks BYPASSRLS — and the suite must be shown to FAIL when the fix is neutralised.

⚠ MIGRATION TIMESTAMP COLLISIONS have bitten this repo twice today. Two other agents are concurrently adding migrations touching public.events (SEC-2b: relocating birth-date/budget columns; SEC-5: gating event_type writes). Your lane is orders/payments — stay out of events. Before committing any migration: ls supabase/migrations/ | tail -30 and pick a timestamp that cannot collide.

⚠ Changelog fragments go in the ROOT changelog.d/, NOT apps/web/changelog.d/ — there is a CI guard (lint-changelog-dir).

Local test commands (from apps/web): npm run test:unit  ·  npm run test:db  ·  npx tsc --noEmit
Note: 7 unit tests fail on clean main (pHash native deps, vendor-deep-search). That is pre-existing — verify against the base before blaming yourself.
`

// ─────────────────────────────────────────────────────────────────────────────
phase('Recon')

const SITES_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['sites', 'listWasComplete', 'extraFindings'],
  properties: {
    listWasComplete: { type: 'boolean', description: 'true only if the 8 briefed sites are ALL of them' },
    sites: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['file', 'line', 'symbol', 'client', 'inBriefedList'],
        properties: {
          file: { type: 'string' }, line: { type: 'number' }, symbol: { type: 'string' },
          client: { type: 'string', description: "session | admin | other" },
          inBriefedList: { type: 'boolean' },
          notes: { type: 'string' },
        },
      },
    },
    extraFindings: { type: 'array', items: { type: 'string' } },
  },
}

const DBSTATE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['ordersGrants', 'paymentsGrants', 'policies', 'triggers', 'paymentsHasSameHole', 'otherTablesWithAsymmetry', 'revokeBlastRadius'],
  properties: {
    ordersGrants: { type: 'string' },
    paymentsGrants: { type: 'string' },
    policies: { type: 'string' },
    triggers: { type: 'string' },
    paymentsHasSameHole: { type: 'boolean' },
    otherTablesWithAsymmetry: { type: 'array', items: { type: 'string' } },
    revokeBlastRadius: { type: 'string', description: 'Anything that would break if INSERT is revoked from authenticated/anon: views, SECURITY INVOKER functions, edge functions, seeds, cron, RPCs' },
  },
}

const AUTHZ_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['perSite'],
  properties: {
    perSite: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['file', 'rlsCheckLostOnConversion', 'requiredExplicitAssertion', 'existingHelperToReuse'],
        properties: {
          file: { type: 'string' },
          rlsCheckLostOnConversion: { type: 'string', description: 'Exactly what RLS was enforcing for this insert' },
          requiredExplicitAssertion: { type: 'string', description: 'The precise check the code must now perform' },
          existingHelperToReuse: { type: 'string', description: 'Existing repo helper that already does this, or NONE' },
        },
      },
    },
  },
}

const [siteMap, dbState, authzMap] = await parallel([
  () => agent(`${COMMON}

RECON TASK A — enumerate EVERY path that INSERTs into public.orders, and prove the list is complete.

The brief lists 8 session-role insert sites (line numbers as of 2026-07-26, may have drifted):
  1. apps/web/app/dashboard/[eventId]/checkout/actions.ts (~610, submitOrderAction)
  2. apps/web/app/vendor-dashboard/clients/[eventId]/photo-challenge-actions.ts (~302)
  3. apps/web/app/vendor-dashboard/subscription/booth-addon-actions.ts (~328)
  4. apps/web/app/vendor-dashboard/subscription/ai-addon-actions.ts (~246)
  5. apps/web/app/vendor-dashboard/subscription/custom/actions.ts (~193)
  6. apps/web/app/vendor-dashboard/team/actions.ts (~365)
  7. apps/web/app/vendor-dashboard/deep-search/actions.ts (~247)
  8. apps/web/app/vendor-dashboard/branches/actions.ts (~108)
Stated as already service_role and unaffected: papic/actions.ts x3, admin/custom-plans/actions.ts, lib/booking-fee-lock.server.ts.

DO NOT TRUST THAT LIST. Verify it against latest origin/main and find anything it missed. A missed session-role insert site becomes a HARD 403 for real users the moment INSERT is revoked — that is a production outage, so completeness matters more than speed here.

Search exhaustively and by several independent methods, because each alone has blind spots:
  - .from('orders').insert / .upsert  (note upsert! it inserts)
  - dynamic table names, string constants, table-name helpers
  - RPCs / postgres functions that insert into orders (SECURITY INVOKER ones run as the caller and WILL break on revoke; SECURITY DEFINER ones will not)
  - supabase/functions/** edge functions
  - any API route handler, cron/periodic job (this repo uses a cron-free claim_periodic_job pattern), webhook, or seed/backfill script
  - test fixtures and tests/db helpers that insert as a session role
  - the Tauri/desktop and PWA surfaces if they talk to PostgREST directly

For each hit record: file, line, enclosing function, and whether it uses the session client (createClient) or the admin client (createAdminClient). Read enough of each call to be sure which client the .from() chain actually came from — a file can import both.

Report listWasComplete=false if you find ANY session-role insert not in the briefed 8.`, { schema: SITES_SCHEMA, phase: 'Recon', label: 'recon:call-sites', effort: 'high' }),

  () => agent(`${COMMON}

RECON TASK B — establish the exact CURRENT database state for public.orders and public.payments, and the blast radius of the revoke.

Use the Supabase MCP execute_sql against project njrupjnvkjkitfctetvi. READ-ONLY. Do not mutate prod.

Determine and report precisely:
1. Table/column privileges on public.orders and public.payments for roles anon, authenticated, service_role. Use has_table_privilege and information_schema.role_column_grants. Confirm the INSERT grant actually exists today (the whole fix presumes it does — if it does not, say so loudly, that changes everything).
2. Every RLS policy on both tables: name, cmd, permissive/restrictive, roles, USING, WITH CHECK. Full expressions, not summaries.
3. Every trigger on both tables: name, timing, events, function, and the function body. Confirm the claimed BEFORE-UPDATE-only asymmetry on guard_orders_protected_columns, and confirm what orders_insert_status_guard actually constrains.
4. Does public.payments have the SAME INSERT-vs-UPDATE asymmetry on amount_php? Check payments_owner_insert specifically. Answer definitively.
5. Sweep for OTHER money-ish tables with the same shape: a BEFORE UPDATE column guard but an unguarded INSERT, on any table an end user can insert into. Report them; do NOT fix them.
6. REVOKE BLAST RADIUS — what breaks if INSERT on orders is revoked from authenticated and anon? Check for: SECURITY INVOKER functions that insert into orders (these run as the CALLER and will start failing), views with INSERT rules, anything in supabase/functions, RLS policies on OTHER tables whose expressions insert into orders, and any GRANT re-issued by a later migration that would silently undo the revoke. Also check whether a subsequent migration re-grants ALL on public.orders — that pattern exists in some repos and would quietly reopen the hole.

Also: state whether a defence-in-depth trigger that REFUSES non-service_role INSERTs is workable here — i.e. what current_user / auth.role() actually looks like on a service_role PostgREST connection vs a migration vs the SQL editor. Say whether such a trigger would break migrations or admin tooling. Recommend for or against with reasons; do not implement it.`, { schema: DBSTATE_SCHEMA, phase: 'Recon', label: 'recon:db-state', effort: 'high' }),

  () => agent(`${COMMON}

RECON TASK C — for each of the 8 briefed insert sites, determine EXACTLY what authorization RLS is silently providing today, and what explicit assertion must replace it.

This is the highest-risk part of the whole change. orders_owner_write's WITH CHECK (user_id = auth.uid()) is doing real work at every one of these sites: it guarantees a user cannot mint an order attributed to somebody else. The moment the insert runs as service_role, that guarantee is GONE and nothing replaces it unless the code does it explicitly.

But user_id = auth.uid() is only the floor. Several of these are VENDOR surfaces (subscription add-ons, team seats, deep search, branches, booth add-on) where the real question is not "is this row mine" but "does this user actually control this vendor/branch/team, and is that vendor in a state where this purchase is legal". And the checkout one is EVENT-scoped — "is this user a host of this event", which is a different helper again.

For each of the 8 files:
  - Read the full enclosing function.
  - State exactly what RLS was enforcing for that insert (be specific about which policy and which predicate).
  - State the precise explicit assertion the code must now make. Include the vendor/event/team scoping, not just user_id.
  - Identify whether the function ALREADY makes that assertion earlier (several may already call a guard before inserting — if so the conversion is safe and you should say so; do not manufacture work).
  - Name the EXISTING repo helper to reuse. This codebase has established helpers — hunt for them rather than inventing new ones. Look for the patterns used by requirePanoodControlRoomMember, isLiveStudioSetupHost, assertAdmin, current_vendor_ids, and whatever the vendor-dashboard surfaces already use to prove vendor ownership. Report the real names you find.

Reuse-first is a standing rule in this repo. A new bespoke ownership check next to an existing helper that already does it is a defect, not a fix.`, { schema: AUTHZ_SCHEMA, phase: 'Recon', label: 'recon:authz-model', effort: 'high' }),
])

log(`Recon done. Call-site list complete: ${siteMap?.listWasComplete}. payments has same hole: ${dbState?.paymentsHasSameHole}.`)
if (siteMap && siteMap.listWasComplete === false) {
  log(`⚠ Briefed list was INCOMPLETE — extra sites found. Revoking without these would 403 real users.`)
}

// ─────────────────────────────────────────────────────────────────────────────
phase('Implement')

const RECON_BRIEF = `
=== RECON RESULT A · call sites (authoritative — use THIS list, not the briefed one) ===
${JSON.stringify(siteMap, null, 2)}

=== RECON RESULT B · database state + revoke blast radius ===
${JSON.stringify(dbState, null, 2)}

=== RECON RESULT C · authorization lost per site, and the explicit assertion required ===
${JSON.stringify(authzMap, null, 2)}
`

const impl = await agent(`${COMMON}

${RECON_BRIEF}

IMPLEMENT the SEC-4 follow-up. Work in a FRESH git worktree off latest origin/main. Open a DRAFT PR against ${REPO}. DO NOT enable auto-merge. Do not merge anything.

Deliver, in one coherent PR:

1. MIGRATION — revoke INSERT on public.orders from authenticated and anon so the server is the only minter. Apply the same treatment to public.payments IF recon B confirmed the same hole there (it reported paymentsHasSameHole=${dbState?.paymentsHasSameHole}). Follow the repo's existing migration conventions. Pick a timestamp that cannot collide — ls supabase/migrations/ | tail -30 first; two other agents are adding migrations right now on public.events.
   - Honour recon B's recommendation on the defence-in-depth non-service_role INSERT trigger. If it recommended AGAINST, do not add it; say why in the PR body.
   - Write a comment in the migration explaining WHY the revoke exists, naming the attack, so a future migration does not casually GRANT ALL and reopen it.

2. CALL-SITE CONVERSIONS — every session-role insert site from recon A moves to createAdminClient(), and each one gains the explicit ownership/membership assertion recon C specified, BEFORE the insert.
   - Reuse the existing helpers recon C named. Do not invent parallel ones.
   - Where recon C found the function ALREADY asserts correctly, do not add a redundant check — note it in the PR body instead.
   - Fail CLOSED: if the assertion cannot be evaluated (missing row, ambiguous membership), refuse the insert. Never fall through to inserting.
   - Keep the refusal message non-specific to the caller so it is not an existence oracle, matching how lib/r2-client-ref.ts phrases its refusals (merged today in PR #3729 — read it for the house style).

3. DB TESTS in tests/db/*.db.test.ts. These are the point of the exercise:
   - The attack itself: as a genuine 'authenticated' role, attempt POST/INSERT into orders with requested_total_php = 1 for a real SKU. Must be REFUSED after the fix.
   - The same for payments.amount_php if that hole was confirmed.
   - Legitimate flows still work through the server path.
   - MANDATORY META-TEST: assert the connected role is 'authenticated', is NOT the table owner, and does NOT have BYPASSRLS. Without this the suite can pass vacuously — it has twice in this repo. Put a comment in the test header saying so.
   - NEUTRALISATION PROOF: re-grant INSERT inside a transaction (or otherwise disable your guard), confirm the attack test FAILS, then roll back. Report the exact count of tests that fail when neutralised.

4. Update apps/web/lib/order-price-authority.test.ts — it enumerates every order-minting module and taint-traces requested_total_php to money-shaped form fields. Its ORDER_MINTERS notes must reflect any module whose client changed. Keep its guarantees intact; do not weaken it to make it pass.

5. Root changelog.d/ fragment with a SPEC IMPACT line.

Before you finish: npx tsc --noEmit, npm run test:unit, npm run test:db. Verify the 7 known-failing unit tests fail identically on the unmodified base before attributing them to yourself.

In the PR body, be explicit about: which sites already had adequate authz vs which gained a new assertion; exactly what authorization each converted site now performs; the neutralisation failure count; and anything you found that the recon missed.`, { phase: 'Implement', label: 'implement:orders-lockdown', effort: 'max' })

log('Implementation done — handing the diff to five independent adversaries.')

// ─────────────────────────────────────────────────────────────────────────────
phase('Verify')

const VERDICT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['lens', 'verdict', 'findings', 'reasoning'],
  properties: {
    lens: { type: 'string' },
    verdict: { type: 'string', description: 'HOLDS | HOLDS-WITH-GAPS | BROKEN' },
    reasoning: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['severity', 'summary', 'evidence'],
        properties: {
          severity: { type: 'string', description: 'critical | high | medium | low' },
          summary: { type: 'string' },
          evidence: { type: 'string', description: 'File:line or SQL output proving it — not an assertion' },
          suggestedFix: { type: 'string' },
        },
      },
    },
  },
}

const LENSES = [
  {
    key: 'authz-regression',
    prompt: `LENS 1 — AUTHORIZATION REGRESSION. This is the lens most likely to find a real bug, so be relentless.

Every converted site LOST orders_owner_write's WITH CHECK (user_id = auth.uid()) plus every other RLS policy on the table, because service_role bypasses RLS entirely. For EACH converted site, prove or disprove:
  - Can a user now mint an order attributed to a DIFFERENT user_id? Trace whether user_id is taken from the session or from caller-supplied input.
  - Can a vendor-surface user now purchase against a vendor/branch/team they do not control? Check the assertion actually binds the vendor id used in the INSERT to the vendor id that was authorised — a check on vendor A followed by an insert naming vendor B is the classic form of this bug.
  - Can an event-scoped purchase be made against an event the caller is not a host of?
  - Is the assertion BEFORE the insert on every code path, including early returns, retries, catch blocks, and any loop?
  - Does any path reach the insert when the assertion threw or returned falsy? PostgREST returns NO error on a 0-row match — an ownership UPDATE/SELECT used as a check must verify the row count, not just the absence of an error. This exact bug was found in finalizeChapterTeaser today.
Default to "still exploitable" unless the diff proves otherwise.`,
  },
  {
    key: 'completeness-outage',
    prompt: `LENS 2 — COMPLETENESS AND PRODUCTION OUTAGE RISK. The revoke is a hard 403 for anything not converted.

Independently re-derive the full set of INSERT paths into orders (and payments if touched). Do NOT trust the recon list or the PR's list — search yourself, by different methods than a naive grep: upsert calls, dynamic table names, RPCs and SECURITY INVOKER functions, supabase/functions edge functions, API routes, seeds, backfills, test helpers, the desktop/PWA surfaces.
Then: does anything still insert as a session role? If yes that is a CRITICAL production outage the moment this merges.
Also verify no later migration re-GRANTs INSERT on orders (which would silently reopen the hole), and that the revoke survives the repo's migration ordering.`,
  },
  {
    key: 'test-vacuity',
    prompt: `LENS 3 — TEST VACUITY. Assume the tests pass for the wrong reason until proven otherwise. This repo has shipped vacuously-passing DB tests TWICE.

  - Does the connection running the DB tests OWN the table? Postgres SKIPS RLS for table owners, so an owner connection makes every RLS assertion meaningless. Verify the meta-test exists AND that it would actually catch this — read it, do not trust its name.
  - Does the role have BYPASSRLS? Is it really 'authenticated' and not postgres/service_role?
  - Would the attack test fail if the guard were removed? Actually check the neutralisation the PR claims — re-run it yourself if you can, and confirm the reported failure count is real rather than asserted.
  - Are the tests asserting a REFUSAL, or merely asserting no exception was thrown? A PostgREST insert that silently affects 0 rows is not a refusal.
  - Is the "legitimate flow still works" test actually exercising the server path, or is it faked with an admin client that would pass regardless?`,
  },
  {
    key: 'pricing-integrity',
    prompt: `LENS 4 — PRICING INTEGRITY AND is_active. Two specific ways this fix could quietly break money or product.

  - Did anyone add SQL that re-derives or validates the PRICE? That was explicitly forbidden — pricing spans platform_retail_catalog_v2 + platform_package_catalog + a pax curve on events.estimated_pax + per-event-type Setnayan AI pricing + subscription cycle multiplication. A SQL price rule is a second source of truth. Check the migration AND any trigger function body.
  - is_active = false is OVERLOADED: on SETNAYAN_AI_RENEW it means "not independently sellable", NOT "retired" (see the comment above resolveServiceSellability in apps/web/lib/v2-catalog.ts). Did any new guard reject inactive SKUs? That breaks every AI renewal. Trace whether an AI renewal order can still be minted end to end.
  - Does the server path still compute the same price it did before? The fix must change WHO may insert, not WHAT the price is. Any price change is a regression, including rounding.
  - Confirm order-price-authority.test.ts still enforces its original guarantee and was not weakened to make CI pass.`,
  },
  {
    key: 'payments-and-blast',
    prompt: `LENS 5 — THE payments TABLE AND COLLATERAL DAMAGE.

  - Was payments.amount_php genuinely checked for the same INSERT-vs-UPDATE asymmetry, or hand-waved? Verify against the live DB yourself with execute_sql (READ-ONLY). If the hole exists and was not closed, that is a finding; if it was closed, verify the same authz-regression questions from lens 1 apply to its converted sites too.
  - Did the migration revoke more than intended? Check it did not strip SELECT/UPDATE, break service_role, or affect other roles.
  - Any RLS policy on ANOTHER table whose expression inserts into orders?
  - Do admin surfaces, the reconciliation queue at /admin/payments, and activateOrderSku still function? Approval is the step that grants the SKU — if approval now runs as a role that cannot write, reconciliation breaks silently.
  - Check the migration is idempotent/re-runnable in the way this repo's migrations are expected to be, and that it cannot fail mid-way leaving INSERT revoked but code unconverted.`,
  },
]

const verdicts = (await parallel(LENSES.map((l) => () =>
  agent(`${COMMON}

${RECON_BRIEF}

=== THE IMPLEMENTATION REPORT (treat as a CLAIM to be tested, never as truth) ===
${impl}

You are an independent adversary. Your job is to BREAK this fix, not to bless it. Read the actual diff from the PR — do not verify against the implementer's description of the diff, which is exactly how a wrong fix gets waved through. Use gh pr diff and read the real files in a checkout.

Ground every finding in evidence: a file:line or SQL output. An assertion without evidence is not a finding.

Verdict rules: BROKEN = you can describe a concrete exploit or a concrete production outage. HOLDS-WITH-GAPS = no exploit but real weaknesses. HOLDS = you genuinely tried and could not break it.

${l.prompt}`, { schema: VERDICT_SCHEMA, phase: 'Verify', label: `verify:${l.key}`, effort: 'high' })
))).filter(Boolean)

const broken = verdicts.filter((v) => v.verdict === 'BROKEN')
const gaps = verdicts.filter((v) => v.verdict === 'HOLDS-WITH-GAPS')
const criticals = verdicts.flatMap((v) => (v.findings || []).filter((f) => f.severity === 'critical' || f.severity === 'high'))

log(`Verify: ${verdicts.filter(v => v.verdict === 'HOLDS').length} HOLDS · ${gaps.length} WITH-GAPS · ${broken.length} BROKEN · ${criticals.length} critical/high findings.`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Repair')

let repairLog = 'No repair round needed — no BROKEN verdicts and no critical/high findings.'

if (broken.length > 0 || criticals.length > 0) {
  repairLog = await agent(`${COMMON}

${RECON_BRIEF}

=== ORIGINAL IMPLEMENTATION ===
${impl}

=== ADVERSARIAL VERDICTS — these found real problems ===
${JSON.stringify(verdicts, null, 2)}

REPAIR the PR opened by the implementer. Check out its branch and push fixes to it — do NOT open a second PR, and do NOT merge.

Fix every BROKEN verdict and every critical/high finding. For medium/low findings, fix the cheap ones and list the rest in the PR body as explicitly deferred with a reason.

Rules that still bind you:
  - Fail closed. A repair that makes a test pass by loosening the guard is a regression.
  - No SQL price re-derivation. Still forbidden.
  - Do not break AI renewals via the is_active overload.
  - Every DB test change must keep the meta-test (role is 'authenticated', not the owner, no BYPASSRLS) and you must RE-RUN the neutralisation proof after your changes and report the new failure count.
  - If a verifier was WRONG, say so plainly with evidence and do not make a change to appease it. A false finding acted on is its own defect. Be specific about why it was wrong.

Report per finding: fixed / not-a-real-issue (with evidence) / deferred (with reason).`, { phase: 'Repair', label: 'repair:apply-verdicts', effort: 'max' })

  const recheck = (await parallel(
    [...broken, ...(criticals.length ? [{ lens: 'critical-findings' }] : [])].map((v, i) => () =>
      agent(`${COMMON}

You previously ran (or are re-running) the "${v.lens}" adversarial lens on this fix and it did not hold.

=== WHAT THE REPAIRER CLAIMS TO HAVE DONE ===
${repairLog}

=== THE FINDINGS THAT MUST NOW BE GONE ===
${JSON.stringify(v.findings || criticals, null, 2)}

Re-attack. Read the CURRENT diff on the PR branch — not the repair narrative. For each finding, state whether it is genuinely closed, and try once more to break the fix along the same axis plus one new one you did not try before.

A repair that only closed the exact case you named, while leaving the same class of bug reachable another way, is NOT closed. Say so.`, { schema: VERDICT_SCHEMA, phase: 'Repair', label: `recheck:${v.lens}-${i}`, effort: 'high' })
    )
  )).filter(Boolean)

  const stillBroken = recheck.filter((v) => v.verdict === 'BROKEN')
  log(`Repair re-check: ${stillBroken.length} still BROKEN of ${recheck.length} re-attacked.`)
  repairLog += `\n\n=== RE-CHECK AFTER REPAIR ===\n${JSON.stringify(recheck, null, 2)}`
}

// ─────────────────────────────────────────────────────────────────────────────
phase('Report')

const summary = await agent(`${COMMON}

Produce the final report for the repo owner — a non-engineer founder who reads plain English and wants to know what is actually true, what is still open, and what needs a decision from him. No jargon walls.

=== RECON ===
${RECON_BRIEF}

=== IMPLEMENTATION ===
${impl}

=== ADVERSARIAL VERDICTS ===
${JSON.stringify(verdicts, null, 2)}

=== REPAIR ===
${repairLog}

First, VERIFY the end state yourself rather than summarising claims:
  - Read the final diff on the PR.
  - Confirm the PR number, that it is a DRAFT with auto-merge NOT enabled, and its CI status.
  - Confirm with execute_sql (READ-ONLY, prod) what the CURRENT grants on orders/payments are — the migration has NOT been applied to prod yet, so state clearly that the hole is still OPEN in production until this merges and the migration runs. Do not imply it is fixed when it is not.
  - Confirm whether the briefed 8 sites turned out to be the real list.

Then report, tightly:
  1. What was actually wrong, in one short paragraph a non-engineer understands.
  2. What the fix does, and specifically whether the authorization that RLS used to provide is now genuinely replaced at every converted site — this was the main risk, so be honest about it.
  3. What the adversaries found and whether it was fixed.
  4. The neutralisation proof: exact number of tests that fail when the fix is removed. If that number is 0 or unproven, say so loudly — it means the tests prove nothing.
  5. Anything still open, deferred, or needing an owner decision.
  6. Anything discovered that nobody asked about — other tables with the same hole, other bugs found in passing.

Be honest about weaknesses. An overstated all-clear on a money path is worse than a known gap.`, { phase: 'Report', label: 'report:synthesis', effort: 'high' })

return {
  pr: 'see report',
  callSiteListWasComplete: siteMap?.listWasComplete ?? null,
  paymentsHadSameHole: dbState?.paymentsHasSameHole ?? null,
  verdicts: verdicts.map((v) => ({ lens: v.lens, verdict: v.verdict, findings: (v.findings || []).length })),
  brokenCount: broken.length,
  criticalCount: criticals.length,
  report: summary,
}
