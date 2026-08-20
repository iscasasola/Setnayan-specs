#!/usr/bin/env node
/**
 * check-corpus-facts.mjs — the regulator-facing documents must not disagree with
 * each other, or with what the product actually does.
 *
 * WHY THIS EXISTS. On 2026-08-20 the counsel review packet — the cover letter a
 * Philippine lawyer reads first — told them photos carry a **5-year retention
 * default**. The owner had ruled on 2026-08-18 that the gallery is kept **for
 * life**, and the dossier in the SAME envelope said so. Two documents, one review
 * set, contradicting each other on the exact point the packet asked counsel to
 * ratify. The packet had simply not been reopened since 13 July; its filename
 * still carries that date, so nobody re-read it.
 *
 * That was the third instance in a single day of ONE disease: **a fact written in
 * more than one place, with nothing keeping the copies equal.** The others were
 * the January-2027 deferral (recorded in the decision log, absent from the task
 * register, so the work was re-raised to the owner) and the business name
 * (three different spellings in three places).
 *
 * 🔑 WHY HERE AND NOT IN THE CODE REPO. The code repo already guards the shipped
 * PDFs (`apps/web/lib/npc-pack-is-true.test.ts`) and says explicitly that it will
 * not assert on "a markdown source that lives in a different repository". That
 * repository is this one — and it is exactly where the staleness was. This closes
 * the half that guard deliberately left open.
 *
 * ⚠ A CORRECTION IS NOT A DEFECT. Every corrected document keeps an audit trail
 * quoting the wording it replaced ("superseding the 2026-08-07 five-year window",
 * "please disregard any copy that says so"). A naive substring search would
 * condemn the very sentences that fix the problem — and a guard that cries wolf
 * is one nobody reads on the day it is right. So a hit inside a correction
 * window is allowed, and that behaviour is itself tested below.
 *
 * ⚠ WHAT THIS IS NOT. It says nothing about whether anything has been LODGED with
 * the NPC. Filing is January 2027 by owner ruling (2026-07-30, "we will do
 * everything on january 2027 but let this run truthfully until then"). Truth is
 * owed now; filing is scheduled. Do not read green here as "we are filed", and do
 * not relax this to match a filing date.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

/* ── The review set: documents a regulator or a lawyer actually reads ─────── */
const REVIEW_SET = [
  'NPC_Privacy_Compliance_Dossier_2026-07-12.md',
  'Data_Retention_Schedule_2026-07-11.md',
  'Counsel_Review_Packet_NPC_Privacy_2026-07-13.md',
  '01_Contracts/Setnayan_Privacy_and_Security_Policy.md',
  ...(existsSync(join(ROOT, 'NPC_Compliance'))
    ? readdirSync(join(ROOT, 'NPC_Compliance'))
        .filter((f) => f.endsWith('.md'))
        .map((f) => join('NPC_Compliance', f))
    : []),
].filter((p) => existsSync(join(ROOT, p)));

/* ── What is TRUE about media retention, settled by the owner ─────────────────
 * Nothing is ever deleted. The full-resolution ORIGINAL is held 6 months from
 * first capture (floored at 3 months after the event ends), then REPLACED by a
 * compressed copy, which is kept free FOR LIFE (owner 2026-08-18). Only the
 * resolution ever changes.
 *
 * So in the review set, a sentence may not attach a deletion or a fixed-year
 * expiry to MEDIA. It may absolutely do so for chat, event data, face vectors or
 * payment records — those genuinely have periods, and the dossier states them
 * correctly. That distinction is the whole difficulty: a check on the string
 * "5 years" alone would fire on six correct sentences in the dossier.        */
/* ── THE RULE, AND WHY IT IS A DENY-LIST AND NOT A HEURISTIC ──────────────────
 * The first cut of this check asked "does a sentence mention media AND mention
 * deletion?" It produced **44 hits, of which 43 were the CORRECT sentences** —
 * "No photo is ever deleted on a schedule", "Media is NOT on the 5-year clock",
 * "Delete my face data", every account-deletion cascade. These documents are
 * ABOUT deletion rights, so proximity proves nothing.
 *
 * That is the precise failure this project keeps recording — a guard that cries
 * wolf teaches the reader to skim past the one time it is right — and I built it
 * on the first try. It is kept in the history as the reason this file is shaped
 * the way it is.
 *
 * So: no heuristic. A short list of the EXACT wordings that have been ruled
 * false, each with the ruling that killed it. Adding a line here is a decision
 * that a specific sentence is wrong; it is not a pattern that might be wrong.  */
/** Media words. The tiering wording is only wrong ABOUT MEDIA — vendor ID
 *  uploads and business permits genuinely do sit on a 90-day-hot clock, and
 *  flagging those was 5 of the 7 hits on the second cut of this file. */
const MEDIA = /\b(photo|photos|photo\/video|video|media|gallery|clip|clips|image|images|originals)\b/i;

const BANNED_WORDINGS = [
  {
    // The tiering that was never built. No R2 lifecycle rule has ever existed.
    pattern: /90[- ]days?\s*hot|5\s*years?\s*cold|hot[- ]90|cold[- ]5/i,
    mediaOnly: true,
    why: 'claims a 90-day-hot / 5-year-cold storage tiering FOR MEDIA that was never built — no lifecycle rule exists and no photo is ever deleted',
  },
  {
    // Committed us, in a filing, to destroying photos we in fact keep.
    pattern: /5[- ]year hard limit|five[- ]year hard limit/i,
    mediaOnly: true,
    why: 'declares a 5-year hard limit on photos, which the product does not do — the compressed copy is kept for life (owner 2026-08-18)',
  },
  {
    // The specific sentence that nearly went to counsel on 2026-08-20.
    pattern: /5[- ]year default \(event data, chat, media\)|default \(event data, chat, media\)/i,
    why: 'puts MEDIA on the same 5-year default as chat — media has its own clock and is never deleted',
  },
];

/** Wording that marks a sentence as QUOTING a superseded claim, not making one. */
const CORRECTION = /\b(previously|supersed\w*|no longer|disregard|corrected|was\s+["“]|formerly|used to|retired|never built|instead of|rather than)/i;

/** Names the business is called. All copies must agree. */
const NAME_PATTERNS = [
  /SETNAYAN SOFTWARE DEVELOPMENT SERVICE/gi,
  /ICASA ENTERPRISE/gi,
];

/**
 * A document that declares itself superseded at the top is not a live claim.
 *
 * ⚠ THIS IS A NARROW EXEMPTION AND IT IS CONDITIONAL, NOT A SKIP-LIST. The
 * superseded Privacy Manual draft still contains the false media row
 * ("90 days hot → 5 years cold | 5-year hard limit"), and that row DID reach the
 * shipped PDF once — the generator pointed at the draft until 2026-08-17. What
 * makes it safe now is the banner, so the banner is what earns the exemption:
 * remove it and this check fires again. The bytes a lawyer actually reads are
 * guarded separately in the code repo (`npc-pack-is-true.test.ts`).
 */
function declaresItselfSuperseded(text) {
  return /SUPERSEDED/i.test(text.split('\n').slice(0, 20).join('\n'));
}

const skipped = [];
const failures = [];
const notes = [];

function sentences(text) {
  // Split on sentence enders AND newlines: these documents are largely tables and
  // bullets, where a "sentence" is a cell or a line. Splitting on '.' alone would
  // glue a correction note onto an unrelated row and hide a real hit.
  return text.split(/(?<=[.!?])\s+|\n/);
}

/* ── Check 1 · no document may repeat a wording that has been ruled false ─── */
for (const rel of REVIEW_SET) {
  const text = readFileSync(join(ROOT, rel), 'utf8');
  if (declaresItselfSuperseded(text)) { skipped.push(rel); continue; }
  for (const s of sentences(text)) {
    for (const { pattern, why, mediaOnly } of BANNED_WORDINGS) {
      if (!pattern.test(s)) continue;
      if (mediaOnly && !MEDIA.test(s)) continue; // vendor IDs DO have a 90-day clock
      if (CORRECTION.test(s)) continue; // quoting the old wording IS the fix
      failures.push(
        `${rel}\n    ${why}.\n` +
          `    If this sentence is quoting the superseded wording on purpose, say so in it\n` +
          `    — "previously", "superseding", "disregard".\n` +
          `    → ${s.trim().slice(0, 180)}`,
      );
    }
  }
}

/* ── Check 2 · the business is called ONE thing ───────────────────────────── */
const namesFound = new Map();
for (const rel of REVIEW_SET) {
  const text = readFileSync(join(ROOT, rel), 'utf8');
  for (const re of NAME_PATTERNS) {
    for (const m of text.matchAll(re)) {
      const key = m[0].toUpperCase();
      if (!namesFound.has(key)) namesFound.set(key, new Set());
      namesFound.get(key).add(rel);
    }
  }
}
if (namesFound.size > 1) {
  failures.push(
    `The business is called ${namesFound.size} different things across the review set.\n` +
      `    A regulator, a bank and the BIR each need ONE registered name, and a receipt\n` +
      `    that does not carry it is not a valid receipt. Pick the DTI-registered name\n` +
      `    and make every copy match it:\n` +
      [...namesFound.entries()]
        .map(([n, files]) => `      • "${n}" — ${[...files].join(', ')}`)
        .join('\n'),
  );
}

/* ── Vacuity: a check that scanned nothing passes ─────────────────────────── */
if (REVIEW_SET.length < 5) {
  failures.push(
    `Only ${REVIEW_SET.length} review-set documents were found. The set moved or was ` +
      `renamed, and this check is looking at almost nothing.`,
  );
}

notes.push(
  `scanned ${REVIEW_SET.length - skipped.length} live documents` +
    (skipped.length ? ` (${skipped.length} skipped as self-declared superseded)` : ''),
);

/* ── Report ──────────────────────────────────────────────────────────────── */
if (failures.length === 0) {
  console.log(`✓ corpus facts agree — ${notes.join(' · ')}`);
  process.exit(0);
}
console.error(`\n✗ ${failures.length} corpus fact${failures.length === 1 ? '' : 's'} disagree — ${notes.join(' · ')}\n`);
for (const f of failures) console.error(`  • ${f}\n`);
console.error(
  `These documents go to a lawyer and a regulator. Two copies of one fact that\n` +
    `disagree is how we nearly paid counsel to ratify a retention rule we had\n` +
    `already dropped (2026-08-20).\n`,
);
process.exit(1);
