export const meta = {
  name: 'erasure-completeness',
  description: 'RA 10173 right-to-erasure: find every place personal data survives account deletion, then make deletion actually finish',
  phases: [
    { title: 'Sweep', detail: 'Find every surviving copy of personal data — JSONB, denormalised, logs, storage, biometrics' },
    { title: 'Fix', detail: 'Extend erasure to cover them, preserving the own-data-vs-shared-record line' },
    { title: 'Attack', detail: 'Three lenses: did it miss copies, delete too much, or fail silently' },
    { title: 'Report', detail: 'Owner-readable, plus what needs a DPO ruling' },
  ],
}

const REPO = 'iscasasola/setnayan-platform'
const PROJECT = 'njrupjnvkjkitfctetvi'

const COMMON = `
Setnayan platform (PH wedding/life-events). Repo ${REPO}, app in apps/web. Supabase project ${PROJECT} — execute_sql is READ-ONLY against prod. Never mutate prod, never create a branch.

=== THE TASK ===
The owner asked for one thing, in his words: "make it finish." Account deletion does not currently erase everything.

KNOWN GAP that started this: apps/web/app/admin/users/actions.ts → purgeOwnedEventBirthData NULLs five birth/consent columns plus the owner's contact PII and the encrypted Google OAuth token — by COLUMN NAME. But events.wizard_state (JSONB) keeps a second copy of much of it and is never opened. Its contents include the wedding and prenup dates, the budget again, pax/guest counts, monogram initials, the site slug, per-task vendor ids, and an unbounded meta_* passthrough whose target task ids are cenomar_bride / church_paperwork / marriage_license — i.e. slots designed to hold PSA and CENOMAR reference numbers, which are Philippine government civil-registry documents.

⚠ VERIFIED: wizard_state is EMPTY in prod right now (zero rows with a non-null JSONB object). So this is PREVENTATIVE — there is no data to clean up and no backfill is required. Confirm this yourself; do not write a migration that rewrites live rows if there are none.

=== THE EXISTING CODE'S PHILOSOPHY — PRESERVE IT, DO NOT REINVENT IT ===
Read apps/web/app/admin/users/actions.ts lines 25–200 before writing anything. It is careful, well-reasoned code and its docstrings explain decisions you must not silently overturn:
  · It purges the LEAVING USER'S OWN data and deliberately leaves SHARED record fields (bride/groom names, venue) intact, because a wedding has two partners plus coordinators. Whether partial erasure of a shared record should go further is explicitly deferred to a DPO/counsel ruling. Do NOT resolve that question yourself — flag anything that lands on that line.
  · It is BEST-EFFORT: a purge failure is logged to admin_audit_log with action='erasure_purge_failed' and does NOT block deletion, because a stuck purge must never trap an account in an undeletable state. Keep that property exactly.
  · It runs on the service-role admin client so it is not subject to the leaving user's partially-torn-down RLS.
  · purgeUserAuthoredChat hard-deletes only the user's own authored messages, and its docstring warns those rows FEED A COUNTER (countCoupleMessages in lib/chat.ts). Read that before touching anything chat-adjacent.

=== LANES — OTHER WORK IS LIVE RIGHT NOW ===
🚫 DO NOT EDIT apps/web/app/api/profile/export/route.ts — it is inside held draft PR #3736. If you find an export-completeness gap, REPORT it; do not fix it here.
🚫 Stay out of: public.orders / public.payments and checkout (a workflow is converting those now); std_media and the NSFW binding (PR #3734, round 2 in flight); public.events column grants and the events_host view (PR #3736, held).
⚠ events.wizard_state itself is inside #3736's revoke set — you may READ and PURGE its contents from server code, but do not alter its grants or the view.

=== HOUSE RULES ===
· ⚠ Migration timestamp collisions have bitten repeatedly today. ls supabase/migrations/ | tail -30 first.
· Changelog fragment in the ROOT changelog.d/, never apps/web/changelog.d/ (CI guard).
· ⚠ VACUOUS TESTS: this repo has twice shipped DB tests that passed because the connection OWNED the table (Postgres skips RLS for owners). Any DB test needs a meta-test asserting role='authenticated', not the table owner, no BYPASSRLS — plus a neutralisation proof with the failure count reported.
· test:db:ci DOES run in CI (.github/workflows/ci.yml ~line 42).
· 7 unit tests fail on clean main (pHash native deps, vendor-deep-search) — pre-existing; verify against the base.
· Scale: 1 signup ever (the owner), 0 orders ever. Nothing is being exploited. No urgency theatre — rank by what matters at 5,000 weddings.
`

phase('Sweep')

const SWEEP_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['survivingCopies', 'currentCoverage', 'dpoQuestions', 'prodDataPresent'],
  properties: {
    prodDataPresent: { type: 'string', description: 'Which of these actually hold data in prod today vs are structurally-possible-but-empty' },
    currentCoverage: { type: 'string', description: 'What deletion covers today, precisely' },
    survivingCopies: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['location', 'dataKind', 'sensitivity', 'reachedByErasure', 'evidence'],
        properties: {
          location: { type: 'string', description: 'table.column, file:line, or storage prefix' },
          dataKind: { type: 'string' },
          sensitivity: { type: 'string', description: 'sensitive-personal-information | personal | pseudonymous | shared-record' },
          reachedByErasure: { type: 'boolean' },
          evidence: { type: 'string' },
          isSharedRecord: { type: 'boolean', description: 'true if it belongs to the couple/event jointly, not the leaving user alone' },
        },
      },
    },
    dpoQuestions: { type: 'array', items: { type: 'string' }, description: 'Judgement calls that are the DPO/owner\u2019s, not an engineer\u2019s' },
  },
}

const sweep = await agent(`${COMMON}

SWEEP — find EVERY place a departing person's personal data survives account deletion. The wizard_state JSONB is the one we know about; the point of this task is to find the others, because an erasure routine that targets column names will always miss copies.

Search for these classes specifically — this is where erasure gaps actually live:
1. JSONB / TEXT blobs holding a second copy: wizard_state, any *_state / *_payload / *_snapshot / metadata / meta / settings / preferences / draft / form_data column anywhere in the 368-table schema. Query information_schema for jsonb and text columns and judge which could carry PII.
2. DENORMALISED copies — names, emails, phone numbers copied onto other rows for display (guest lists, seating, vendor-side client records, proposals, invitations, RSVP rows, chat thread titles, notification rows).
3. LOGS AND AUDIT TRAILS — admin_audit_log, any event/analytics table, email send logs, webhook payloads, error records. Note carefully: audit logs may need to SURVIVE for legitimate accountability, which conflicts with erasure. That tension is a DPO question, not something to silently resolve — flag it.
4. BIOMETRIC DATA — face_enrollments holds vector_blob per guest. Under RA 10173 biometrics are SENSITIVE personal information. Does deletion revoke and remove enrollments? Check both the DB row and any derived vector store.
5. OBJECT STORAGE — R2. Uploaded photos, videos, ID documents (vendor-verification), contracts, payment screenshots, chat attachments. Does account deletion remove any R2 objects at all, or only DB rows? A DB-only erasure leaves the actual files. State plainly what happens today.
6. DERIVED / CACHED — search indexes, materialised views, generated exports, PDFs, rendered pages, ISR caches, anything precomputed from personal data.
7. auth.users metadata — raw_user_meta_data / raw_app_meta_data can hold profile fields that outlive a public.users delete.

For each: is it reached by today's erasure? Is it the leaving user's OWN data or a SHARED record (the existing code draws that line deliberately)? How sensitive?

Then verify with execute_sql which of these ACTUALLY hold data in prod today. With 1 user and near-empty tables, most will be structurally-possible-but-empty — say so, because it changes whether a backfill is needed.

Finally, list the genuine DPO/owner judgement calls you hit — shared-record erasure, audit-log retention vs erasure, biometric handling, storage retention vs the 5-year photo rule. Do not answer them.`, { schema: SWEEP_SCHEMA, phase: 'Sweep', label: 'sweep:surviving-pii', effort: 'max' })

log(`Sweep: ${(sweep?.survivingCopies || []).filter(c => !c.reachedByErasure).length} locations NOT reached by erasure · ${(sweep?.dpoQuestions || []).length} DPO questions.`)

const BRIEF = `=== SWEEP RESULT ===\n${JSON.stringify(sweep, null, 2)}`

phase('Fix')

const fix = await agent(`${COMMON}

${BRIEF}

MAKE DELETION FINISH. Fresh git worktree off latest origin/main. DRAFT PR against ${REPO}. No auto-merge. Do not merge.

Extend erasure to cover every gap the sweep found that is (a) the leaving user's own data and (b) not a DPO question. Specifically including the wizard_state JSONB copies that started this.

Design constraints, all load-bearing:
· PRESERVE THE OWN-vs-SHARED LINE. Mirror what the column purge already does: it clears BOTH partners' birth data when the owner leaves, but leaves bride/groom names and venue. Follow that precedent rather than inventing a new policy. Anything that lands ambiguously on the line goes in the PR body as a DPO question, not into the code.
· SURGICAL, NOT SCORCHED-EARTH. Do not delete wizard_state wholesale — a co-partner's setup progress is shared state. Remove the personal keys, keep the structural ones. If the shape is unbounded (meta_* passthrough), prefer an ALLOW-LIST of keys that may survive over a deny-list of keys to strip: a deny-list silently fails open for every key someone adds later, which is precisely how this gap was born.
· KEEP BEST-EFFORT + AUDIT. Every new purge step follows the existing pattern: failure logged to admin_audit_log with a distinct stage name, never blocking the deletion.
· SERVICE-ROLE, as the existing code does and for the same documented reason.
· NO BACKFILL if the sweep confirmed the columns are empty in prod. Do not write a migration that rewrites live rows for no reason. Say so explicitly in the PR body.

Also add a FORWARD GUARD, because the underlying defect is that erasure targets a hand-maintained list which drifts from reality. Something that fails CI when a new column or key that can hold personal data is added without a decision about erasure. Model it on the coverage tests in PR #3736 (they compute from live schema rather than a typed list — read them first and reuse the approach rather than inventing a second one). Be honest in the PR body about what such a guard can and cannot detect.

TESTS:
· A deletion test proving each newly-covered location is actually emptied.
· A test proving SHARED data and the co-partner's state SURVIVE — over-deletion is a real harm too, and it is the failure mode nobody writes a test for.
· A test proving a purge failure still lets the account delete, and still writes the audit row.
· Anti-vacuity meta-test + neutralisation proof with the failure count.

Root changelog.d/ fragment with SPEC IMPACT. Run npx tsc --noEmit, npm run test:unit, npm run test:db.

In the PR body: what is now covered, what is deliberately NOT (with the reason), and every DPO question surfaced.`, { phase: 'Fix', label: 'fix:erasure-completeness', effort: 'max' })

phase('Attack')

const V = {
  type: 'object', additionalProperties: false,
  required: ['lens', 'verdict', 'reasoning', 'findings'],
  properties: {
    lens: { type: 'string' }, verdict: { type: 'string', description: 'HOLDS | HOLDS-WITH-GAPS | BROKEN' },
    reasoning: { type: 'string' },
    findings: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      required: ['severity', 'summary', 'evidence'],
      properties: { severity: { type: 'string' }, summary: { type: 'string' }, evidence: { type: 'string' }, suggestedFix: { type: 'string' } },
    } },
  },
}

const LENSES = [
  { k: 'missed-copies', p: `LENS 1 — WHAT STILL SURVIVES. Independently re-derive where personal data lives; do not trust the sweep or the PR. Delete an account on paper and follow every table, blob, log, cache and R2 object. What is left? Pay special attention to: JSONB keys the allow-list did not anticipate, denormalised name/email copies on other people's rows, biometric vectors, R2 objects (a DB-only erasure leaves the files), auth.users metadata, and anything generated BEFORE deletion that persists after.` },
  { k: 'over-deletion', p: `LENS 2 — DID IT DELETE TOO MUCH. This is the failure mode nobody tests. A wedding has two partners plus coordinators; erasing one person must not damage the other's event. Can this purge destroy shared state, break the co-partner's wizard, orphan a vendor's records, corrupt a counter (see countCoupleMessages in lib/chat.ts), or leave a half-purged row the app cannot render? Check for JSONB writes that drop unrelated keys, and for any purge that runs on events the user merely BELONGS to rather than OWNS.` },
  { k: 'silent-failure', p: `LENS 3 — DOES IT ACTUALLY RUN, AND DOES IT SAY SO WHEN IT DOESN'T. The whole routine is BEST-EFFORT by design, so a silent no-op is indistinguishable from success. Verify: does each new step really execute on the real deletion path, or was it added to a function nothing calls? PostgREST returns NO error on a 0-row update — is success being inferred from the absence of an error? Does every failure path write the audit row? And the tests: could they pass with the fix removed (run the neutralisation yourself), is the connection the table owner (Postgres skips RLS for owners — twice-shipped bug here), and does the "shared data survives" test actually assert survival rather than just not crashing?` },
]

const verdicts = (await parallel(LENSES.map((l) => () => agent(`${COMMON}

${BRIEF}

=== THE FIX AUTHOR'S REPORT (a claim to test, not truth) ===
${fix}

You are an independent adversary. Today two separate "fixes" in this repo were reviewed, looked fine, and were BROKEN by an adversary doing your job. Read the ACTUAL diff (gh pr diff) and the real files — never verify against the author's description.

Evidence required for every finding: file:line or SQL output. BROKEN = concrete demonstrable failure. HOLDS-WITH-GAPS = real weakness, no demonstrable failure. HOLDS = you genuinely tried and could not break it.

${l.p}`, { schema: V, phase: 'Attack', label: `attack:${l.k}`, effort: 'high' }))))
  .filter(Boolean)

const broken = verdicts.filter(v => v.verdict === 'BROKEN')
log(`Attack: ${verdicts.filter(v=>v.verdict==='HOLDS').length} HOLDS · ${verdicts.filter(v=>v.verdict==='HOLDS-WITH-GAPS').length} GAPS · ${broken.length} BROKEN.`)

let repair = 'No repair needed.'
if (broken.length || verdicts.flatMap(v => v.findings||[]).some(f => f.severity==='critical'||f.severity==='high')) {
  repair = await agent(`${COMMON}

${BRIEF}

=== THE FIX ===
${fix}

=== ADVERSARIES FOUND PROBLEMS ===
${JSON.stringify(verdicts, null, 2)}

Repair on the SAME PR branch — no second PR, no merge. Fix every BROKEN verdict and every critical/high finding. Where an adversary is WRONG, say so with evidence and change nothing; acting on a false finding is its own defect. Re-run the neutralisation proof and report new counts. Keep every anti-vacuity meta-test, the best-effort property, and the own-vs-shared line.`, { phase: 'Attack', label: 'repair:erasure', effort: 'max' })
}

phase('Report')

const report = await agent(`${COMMON}

${BRIEF}

=== FIX ===
${fix}
=== ADVERSARIES ===
${JSON.stringify(verdicts, null, 2)}
=== REPAIR ===
${repair}

Report for the owner — a solo non-engineer founder. He said "make it finish." Plain English, short sentences, no jargon. He does not want a spreadsheet; he wants to know whether deletion now finishes, and what is still open.

VERIFY FIRST, do not just summarise: read the final diff, confirm the PR number and that it is a DRAFT with auto-merge off and CI green, and re-derive the neutralisation counts. If a claim does not hold up, drop it.

Then write:
1. What "delete my account" actually did before, and what it left behind. One short paragraph.
2. What it does now.
3. What is deliberately still left — and why (shared wedding data belonging to the other partner, audit records that exist for accountability). Make the reasoning obvious to a non-lawyer.
4. The questions that are genuinely his or a DPO's to answer, not an engineer's. Phrase each as a real-world trade-off in plain words — e.g. "when one partner deletes their account, should the wedding's shared details go too, even though the other partner still needs them?" — not as jargon. Give your recommendation on each.
5. Anything found along the way that he did not ask about — especially whether deleting an account removes the actual FILES (photos, uploaded documents) or only the database records. If files survive, say so plainly; that is the kind of thing that matters most and is easiest to overlook.`, { phase: 'Report', label: 'report:erasure', effort: 'high' })

return {
  notReachedBefore: (sweep?.survivingCopies || []).filter(c => !c.reachedByErasure).length,
  dpoQuestions: sweep?.dpoQuestions || [],
  verdicts: verdicts.map(v => ({ lens: v.lens, verdict: v.verdict, findings: (v.findings||[]).length })),
  brokenCount: broken.length,
  report,
}
