export const meta = {
  name: 'sec6-nsfw-binding-round2',
  description: 'SEC-6 round 2: the NSFW verdict fix came back BROKEN — fingerprint binds a decoy, not the served bytes. Re-fix and attack it in two rounds.',
  phases: [
    { title: 'Understand', detail: 'Reconstruct the exact decoy bypass and map verdict-path vs serve-path' },
    { title: 'Refix', detail: 'Bind the verdict to the bytes the guest actually receives' },
    { title: 'Attack', detail: 'Four independent adversaries, including the one that broke round 1' },
    { title: 'Round2', detail: 'Repair anything still broken and re-attack it' },
    { title: 'Report', detail: 'Honest verdict for the owner' },
  ],
}

const REPO = 'iscasasola/setnayan-platform'
const PROJECT = 'njrupjnvkjkitfctetvi'
const JOURNAL = '/Users/icecasasola/.claude/projects/-Users-icecasasola-Documents-Claude-Projects-Setnayan/262b5014-50ac-4cef-9570-0722fc3c7182/subagents/workflows/wf_962281ba-0a9/journal.jsonl'

const COMMON = `
Setnayan platform. Repo ${REPO} (app in apps/web). Supabase project ${PROJECT} — Supabase MCP execute_sql is READ-ONLY against prod; never mutate prod, never create a branch.

=== SEC-6, AND WHY THIS IS ROUND TWO ===
DEFECT: a direct PATCH of \`std_media.nsfw\` publishes an unscreened video to the public guest page. The NSFW filter is owner-locked as ON and NOT disableable, so a bypass is a hard product violation, not a nice-to-have.

A fix was written and opened as **PR #3734** ("fix(security): bind the NSFW verdict to the screened media"). An independent adversary attacked it and returned **VERDICT: BROKEN**:

  "The privilege half is genuinely solid — I attacked it hard and could not move it. The binding half is bypassable: the fingerprint is computed against a DIFFERENT RESOURCE than the one the guest's browser fetches, so an attacker can get a real 'approved' verdict for a decoy object while serving arbitrary unscreened video."

So: the authorization work on #3734 is sound and should be KEPT. The BINDING is what failed — classic decoy / time-of-check-vs-time-of-use. Screen object A, serve object B.

The full adversary report (both bypasses, one begins "BYPASS 1 — parser…") is in the workflow journal at:
  ${JOURNAL}
Read the {"type":"result"} lines there and find the SEC-6 verify agent's full text. Do NOT rely on the summary above — read the original, because the exact mechanics of bypass 1 and 2 matter and are not reproduced here.

=== THE STANDARD THAT MUST BE MET ===
The verdict must be bound to THE BYTES THE GUEST ACTUALLY RECEIVES. Not to a key, not to a row id, not to a URL, not to a value the uploader can influence between screening and serving. If there is any moment where the screened artifact and the served artifact can diverge — a re-upload to the same key, a mutable pointer, a redirect, a range request, a transcode, a variant/web-copy, a CDN alias, a signed URL minted before the swap — the fix has not landed.

Ask relentlessly: what exactly did we hash, and is that provably the same object the browser will fetch at play time?

=== HOUSE RULES ===
· R2 buckets: setnayan-media is PUBLIC BY DESIGN (R2_PUBLIC_URL is bound to it, r2PublicUrl() serves it unsigned — a locked rule). The private buckets are thread-files, vendor-contracts, vendor-verification, samples. A "fix" that assumes media is private is wrong.
· PR #3729 (merged today) added lib/r2-client-ref.ts — a fail-closed allowlist for client-supplied storage refs, with deliberately non-specific refusal messages so it is not an existence oracle. REUSE it; match its house style. Do not write a second guard.
· ⚠ VACUOUS DB TESTS: this repo has shipped them TWICE. A connection that OWNS the table SKIPS RLS entirely. Any DB test needs a meta-test asserting the connected role is 'authenticated', is NOT the table owner, and lacks BYPASSRLS — plus a neutralisation proof (remove the fix → tests must fail, with the count reported).
· test:db:ci DOES run in CI (.github/workflows/ci.yml line ~42: pnpm --filter @setnayan/web test:db:ci) — a tests/db/*.db.test.ts file WILL execute in CI. Earlier advice to the contrary was wrong.
· ⚠ Migration timestamp collisions have bitten repeatedly. ls supabase/migrations/ | tail -30 first. Other work is concurrently touching public.events and public.orders/payments — STAY OUT of those two lanes.
· Changelog fragments go in the ROOT changelog.d/, never apps/web/changelog.d/ (CI guard).
· 7 unit tests fail on clean main (pHash native deps, vendor-deep-search) — verify against the base before blaming yourself.
· Scale context: 1 signup ever, 0 orders ever. Nothing is being exploited today. Rank by "how bad at 5,000 weddings", and do not write urgency theatre.
`

// ─────────────────────────────────────────────────────────────────────────────
phase('Understand')

const RECON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['bypassMechanics', 'verdictPath', 'servePath', 'divergencePoints', 'whatToKeep'],
  properties: {
    bypassMechanics: { type: 'string', description: 'Both bypasses from the adversary report, reconstructed precisely from the journal' },
    verdictPath: { type: 'string', description: 'Exactly what gets screened and what gets fingerprinted, file:line' },
    servePath: { type: 'string', description: 'Exactly what the guest browser fetches at play time, file:line' },
    divergencePoints: {
      type: 'array',
      description: 'Every point where screened artifact and served artifact can differ',
      items: {
        type: 'object', additionalProperties: false,
        required: ['point', 'how', 'evidence'],
        properties: { point: { type: 'string' }, how: { type: 'string' }, evidence: { type: 'string' } },
      },
    },
    whatToKeep: { type: 'string', description: 'The privilege-half work on #3734 the adversary could NOT break — must survive the refix' },
  },
}

const recon = await agent(`${COMMON}

UNDERSTAND — before anything is written, reconstruct the failure precisely.

1. Read the adversary's FULL report from ${JOURNAL}. Find the SEC-6 verify agent's result and read both bypasses end to end. Quote the mechanics accurately; a refix built on a paraphrase will miss the real hole.
2. Read PR #3734's actual diff (gh pr diff 3734). Identify which part is the privilege half (sound — keep it) and which is the binding half (broken — replace it).
3. Trace VERDICT PATH: what object is fetched for screening, what exactly is fingerprinted, when, and where the verdict is stored. Cite file:line.
4. Trace SERVE PATH: what the guest's browser actually requests when the video plays on the public guest page, and which stored value决定s that. Cite file:line. Follow it all the way to the bytes — through any web-copy/variant key (e.g. clip_web_r2_key), any signed-URL minting, any redirect, any CDN path.
5. Enumerate EVERY DIVERGENCE POINT between the two. Be exhaustive and creative: re-upload to the same key after approval; swapping a pointer column; a variant/transcode generated after screening; a signed URL minted pre-swap and used post-swap; range requests; a key the uploader controls; an approved row cloned onto different media; a media row re-parented to another event.

Do not propose a fix yet. The output of this task is an accurate map. Being wrong here makes round 2 fail the same way round 1 did.`, { schema: RECON_SCHEMA, phase: 'Understand', label: 'understand:decoy-bypass', effort: 'max' })

log(`Understood: ${(recon?.divergencePoints || []).length} divergence points between screened and served bytes.`)

const RECON_BRIEF = `
=== RECONSTRUCTED FAILURE MAP ===
${JSON.stringify(recon, null, 2)}
`

// ─────────────────────────────────────────────────────────────────────────────
phase('Refix')

const refix = await agent(`${COMMON}

${RECON_BRIEF}

REFIX SEC-6. Continue on PR #3734's branch — check it out and push onto it. Do NOT open a second PR. Do NOT enable auto-merge. Do NOT merge.

KEEP the privilege half the adversary could not break. REPLACE the binding half.

The bar: the verdict must be bound to the bytes the guest actually receives, and every divergence point in the map above must be closed or made unreachable. For each one, state in the PR body which it is: CLOSED (and how), or UNREACHABLE (and why — with evidence, not assertion).

Design guidance, not a mandate — pick what genuinely holds and justify it:
  · Content-addressing is usually the honest answer: the served object is identified BY its digest, so serving different bytes means serving a different object, and an unscreened digest simply has no approved verdict. Consider whether the serve path can key off the digest rather than a mutable pointer.
  · If the object must stay mutable, then the verdict has to be invalidated the moment the bytes change — and you must prove there is no window between change and invalidation, including for URLs already minted.
  · Immutability at the storage layer (write-once keys, never reusing a key after approval) can remove whole classes of divergence at once. Check whether the upload path already guarantees uniqueness (PR #3729's notes mention server-side randomUUID() on some paths) and whether that guarantee is load-bearing or incidental.
  · Beware the variant problem: if screening runs on the original but guests are served a compressed web copy, then the web copy is what must be screened or provably derived from screened bytes.

Fail closed everywhere. No verdict, unrecognised digest, mismatch, or any error → do not serve. A media item that cannot be proven screened must not reach a guest page, and the refusal must not reveal whether the object exists.

TESTS — this is what makes round 2 different from round 1:
  · Write a test that performs THE ACTUAL DECOY ATTACK the adversary used: obtain an approved verdict for object A, then arrange for the guest to be served object B. It must FAIL to serve.
  · One test per divergence point in the map.
  · DB tests in apps/web/tests/db/*.db.test.ts with the mandatory anti-vacuity meta-test (role is 'authenticated', not the table owner, no BYPASSRLS) and a service_role differential control.
  · NEUTRALISATION PROOF: remove your binding, confirm the tests FAIL, restore, confirm they pass. Report the exact count. Neutralise each HALF separately too — if removing only the binding still passes every test, the tests are measuring the privilege half and prove nothing about what actually broke.

Root changelog.d/ fragment with a SPEC IMPACT line. Run npx tsc --noEmit, npm run test:unit, npm run test:db.`, { phase: 'Refix', label: 'refix:bind-to-served-bytes', effort: 'max' })

// ─────────────────────────────────────────────────────────────────────────────
phase('Attack')

const VERDICT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['lens', 'verdict', 'reasoning', 'findings'],
  properties: {
    lens: { type: 'string' },
    verdict: { type: 'string', description: 'HOLDS | HOLDS-WITH-GAPS | BROKEN' },
    reasoning: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['severity', 'summary', 'exploit', 'evidence'],
        properties: {
          severity: { type: 'string' }, summary: { type: 'string' },
          exploit: { type: 'string', description: 'Step by step: what the attacker does and what the guest ends up seeing' },
          evidence: { type: 'string' }, suggestedFix: { type: 'string' },
        },
      },
    },
  },
}

const LENSES = [
  { key: 'decoy-again', prompt: `LENS 1 — THE ATTACK THAT ALREADY WON ONCE. Round 1 died to screen-A-serve-B. Re-run it, then find its VARIANTS: same key re-uploaded, pointer column swapped, media row re-parented to another event, an approved row cloned onto different bytes, a variant/web-copy that was never screened, a signed URL minted before the swap and redeemed after. A fix that closed only the literal case the last adversary used has not closed the class. Prove which.` },
  { key: 'toctou-race', prompt: `LENS 2 — TIME. Where is the gap between check and use? Concurrent requests, retries, background jobs, queue workers, a transcode finishing after approval, an approval racing an upload. Can two operations interleave so an approved verdict lands on bytes that arrived afterwards? Also: are verdicts ever recomputed, cached, or copied — and can a stale one be resurrected?` },
  { key: 'serve-path-reality', prompt: `LENS 3 — WHAT DOES THE BROWSER ACTUALLY GET? Ignore the intended design; trace the real network path end to end. Every route, redirect, signed URL, CDN alias, range request, and public-bucket direct hit. setnayan-media is PUBLIC BY DESIGN — so is there a path that reaches the bytes WITHOUT passing the check at all? A perfect verdict on a route nobody has to use is not a fix. Check the guest page, the day-of surfaces, any embed or share/OG path, and the reel/story maker.` },
  { key: 'test-vacuity', prompt: `LENS 4 — DO THE TESTS PROVE ANYTHING? Assume they pass for the wrong reason. Does the decoy test actually perform the decoy, or assert a helper in isolation? Is the DB connection the table owner (Postgres SKIPS RLS for owners — this repo has shipped that twice)? Does the meta-test really catch it, or just have a reassuring name? Verify the claimed neutralisation counts by re-running them. Critically: does neutralising ONLY the binding half fail tests? If not, the suite is measuring the privilege half and says nothing about the thing that broke. Also check nothing legitimate regressed — can an ordinary approved video still play?` },
]

const verdicts = (await parallel(LENSES.map((l) => () =>
  agent(`${COMMON}

${RECON_BRIEF}

=== THE REFIX AUTHOR'S REPORT (a claim to be tested, never truth) ===
${refix}

You are an independent adversary. Round 1 of this fix was BROKEN by someone doing exactly your job, so a bless-it review is worthless here. Read the ACTUAL diff on PR #3734 — gh pr diff 3734 and the real files. Do not verify against the author's description of the diff.

Every finding needs evidence: file:line, SQL output, or a reproducible sequence. Verdicts: BROKEN = you can state a concrete exploit. HOLDS-WITH-GAPS = no exploit but real weakness. HOLDS = you genuinely tried and failed.

${l.prompt}`, { schema: VERDICT_SCHEMA, phase: 'Attack', label: `attack:${l.key}`, effort: 'high' })
))).filter(Boolean)

const broken = verdicts.filter((v) => v.verdict === 'BROKEN')
const sev = verdicts.flatMap((v) => (v.findings || []).filter((f) => f.severity === 'critical' || f.severity === 'high'))
log(`Attack round: ${verdicts.filter(v => v.verdict === 'HOLDS').length} HOLDS · ${verdicts.filter(v => v.verdict === 'HOLDS-WITH-GAPS').length} GAPS · ${broken.length} BROKEN · ${sev.length} critical/high.`)

// ─────────────────────────────────────────────────────────────────────────────
phase('Round2')

let round2 = 'Not needed — nothing came back BROKEN and no critical/high findings.'

if (broken.length || sev.length) {
  round2 = await agent(`${COMMON}

${RECON_BRIEF}

=== THE REFIX ===
${refix}

=== ADVERSARIES BROKE IT AGAIN ===
${JSON.stringify(verdicts, null, 2)}

This fix has now failed TWICE. Do not patch the specific case each adversary named — that is what produced this second failure. Ask what property the design is missing that keeps letting screened and served bytes diverge, and fix THAT.

Push onto PR #3734's branch. Do not open another PR. Do not merge.

Fix every BROKEN verdict and every critical/high finding. If an adversary was WRONG, say so plainly with evidence and change nothing — acting on a false finding is its own defect.

Re-run the neutralisation proof after your changes, including the split proof (binding half alone), and report the new counts. Keep every anti-vacuity meta-test.

If you conclude the current approach CANNOT be made sound and needs a different design, say so explicitly rather than shipping a third patch on a broken foundation. That is a legitimate and useful outcome — state what the sound design would be and what it would cost.`, { phase: 'Round2', label: 'round2:repair', effort: 'max' })

  const recheck = (await parallel(
    (broken.length ? broken : [{ lens: 'critical-findings' }]).map((v, i) => () =>
      agent(`${COMMON}

You ran the "${v.lens}" lens and it did not hold.

=== WHAT THE REPAIRER CLAIMS ===
${round2}

=== WHAT MUST NOW BE GONE ===
${JSON.stringify(v.findings || sev, null, 2)}

Re-attack the CURRENT diff on PR #3734 — not the narrative. For each finding say whether it is genuinely closed. Then try once more along the same axis PLUS one new angle you did not use before.

A repair that closed only the exact case you named while the same class remains reachable another way is NOT closed. Say so plainly.`, { schema: VERDICT_SCHEMA, phase: 'Round2', label: `recheck:${v.lens}-${i}`, effort: 'high' })
    )
  )).filter(Boolean)

  const still = recheck.filter((v) => v.verdict === 'BROKEN')
  log(`Round 2 re-check: ${still.length} STILL BROKEN of ${recheck.length}.`)
  round2 += `\n\n=== RE-CHECK ===\n${JSON.stringify(recheck, null, 2)}`
}

// ─────────────────────────────────────────────────────────────────────────────
phase('Report')

const report = await agent(`${COMMON}

Report for the owner — a solo non-engineer founder. Plain English, no jargon walls, no theatre.

=== FAILURE MAP ===
${RECON_BRIEF}
=== REFIX ===
${refix}
=== ADVERSARIES ===
${JSON.stringify(verdicts, null, 2)}
=== ROUND 2 ===
${round2}

VERIFY BEFORE WRITING — do not just summarise:
  · Read the final diff on PR #3734 yourself.
  · Confirm its number, DRAFT status, that auto-merge is off, and CI state.
  · Re-run or re-derive the neutralisation counts. If the binding half alone does NOT fail tests when removed, say so loudly — it means the tests still do not prove the thing that broke twice.
  · State plainly whether this now HOLDS, or whether it is still not safe to merge.

Then write, briefly:
  1. What the hole was, in one plain paragraph — someone could get an unscreened video onto a public wedding page by getting approval for one file and serving a different one.
  2. Why the first fix failed. Be honest; it was checked and it still broke.
  3. What the fix does now, and whether the adversaries could break it this time.
  4. The neutralisation numbers, including the split proof.
  5. Whether it is safe to merge — a straight yes or no, with the reason.
  6. Anything still open or needing an owner decision.

If it still is not sound, say so. Shipping a broken NSFW filter is worse than knowing it is broken, and the filter is owner-locked as non-disableable.`, { phase: 'Report', label: 'report:sec6-round2', effort: 'high' })

return {
  pr: 3734,
  divergencePoints: (recon?.divergencePoints || []).length,
  attackVerdicts: verdicts.map((v) => ({ lens: v.lens, verdict: v.verdict, findings: (v.findings || []).length })),
  brokenAfterRefix: broken.length,
  report,
}
