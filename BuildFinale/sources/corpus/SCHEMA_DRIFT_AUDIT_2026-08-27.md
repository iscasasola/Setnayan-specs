# PROD vs REPO SCHEMA DRIFT — the one-time audit

> **Run 2026-08-27** against production (`njrupjnvkjkitfctetvi`) and `origin/main` (`d6a5a79f2`).
> Commissioned after `manpower_gigs.vendor_profile_id` was found `NOT NULL` in prod and nullable in
> the repo. **NOTHING WAS FIXED. This is the surfacing step.**

---

## THE ANSWER IN FIVE LINES

**4,738 columns across 386 tables compared on four axes. ELEVEN differences. ONE is a live defect —
the one we already knew about.**

| Axis | Diffs | Verdict |
|---|---|---|
| Table existence | **2** (prod-only) | (c) **cosmetic** — both are the already-documented `KNOWN_GAPS` |
| Column existence | **0** | ✅ clean — and this **independently agrees with the shipped guard** |
| **Nullability** | **4** | **1 live defect · 3 latent** |
| Type | **2** | (c) **cosmetic** — both are the documented PGlite pgvector shim, not drift |
| Default | **5** | **2 latent · 3 cosmetic** |

🔑 **THE HEADLINE IS THE NEGATIVE RESULT: the corpus is far healthier than the `manpower_gigs` find
suggested.** It is not a widespread rot. It is **one live defect and three sleeping ones**, and the
sleeping ones are all the same shape, so they are worth closing while they are cheap.

---

## 🔑 RULE 0 PAID BEFORE ANY CODE WAS WRITTEN — A DRIFT CHECK ALREADY EXISTS

**`apps/web/tests/db/schema-drift.db.test.ts`** ships, runs on every pull request inside the required
"typecheck + lint" job, needs **no production credentials** (the prod half is a committed snapshot at
`supabase/security/prod-schema.snapshot.txt`), and is **anti-vacuity guarded** with floors on both
sides plus named core tables. There is also `.github/workflows/migration-drift-monitor.yml`.
**Nothing was rebuilt. This audit EXTENDS it.**

🚨 **AND IT ALREADY KNEW ABOUT THIS HOLE, IN WRITING.** Its own **HONEST LIMITS § 1** says:

> *"COLUMN EXISTENCE ONLY. Types, defaults, nullability, constraints and indexes are NOT compared.
> This is a real hole and it hides real bugs … Widening to types means modelling PGlite-vs-prod type
> spelling differences, which is worth doing as a follow-up, not worth blocking this on."*

⇒ **`manpower_gigs.vendor_profile_id` was invisible BY DESIGN, and the design said so.** This audit
is that follow-up. **Baseline measured before touching anything: the existing test is GREEN —
`# tests 6 · # pass 6 · # fail 0`, exit 0.** So column existence genuinely agrees, and every finding
below lives in an axis it never compared.

⚠ **The limits doc even NAMES two of the type drifts it cannot see** —
`manual_payment_logs.items_ordered` (declared `JSONB`, is `text[]` in prod) and
`admin_audit_log.target_id` (declared `UUID`, is `TEXT`). **Neither appears in my type diff, because
both are ALREADY CORRECT in the repo's cumulative replay** — the declarations that made them look
wrong are superseded by later migrations that the replay executes and a text-parse would miss.
🔑 *Two of the three known type drifts were already fixed and the doc had not caught up.*

---

## 1 · HOW THIS WAS MEASURED — and how you know it actually ran

**A diff that silently compares nothing looks exactly like a clean result**, so this is stated first.

- **Repo side:** the real `createReplayedDb()` harness replayed **1,226 migrations into PGlite** —
  **not** a text parse of the SQL. Text-parsing gets this wrong: shape is the cumulative result of
  every `ALTER`, and `IF NOT EXISTS` guards mean the text does not say what ran. (The existing test's
  docblock records that a regex parser was **built first and thrown away** at an 18-of-32
  false-positive rate.)
- **Prod side:** read live by the object — `pg_class` / `pg_attribute` / `pg_attrdef` /
  `format_type` — **never from `schema_migrations` and never from a migration comment.**
- **The ledger was read LIVE FROM PROD, not from the committed snapshot** (see § 4 — the snapshot is
  201 migrations stale). Replaying the wrong ledger would have produced dozens of false "missing"
  rows.
- ✅ **Migration files and prod's ledger are in EXACT 1:1 correspondence — 1,226 each, zero on either
  side.** So there is **no pending-PR noise at all** in this run.
- **Anti-vacuity, measured:** repo **4,738 columns / 386 tables** · prod **4,749 / 388** ·
  **4,738 columns actually compared.**
- 🧪 **CONTROL, because floors are necessary and not sufficient:** `events.event_date`'s nullability
  was deliberately flipped in the repo dataset. **Nullability diffs went 4 → 5 and the injected
  column was named.** The comparison demonstrably fires.
- ✅ **Cross-check:** my column-existence result (**0 diffs**) reproduces the shipped guard's green,
  by a completely independent path. Two methods agreeing is why the other axes are believable.
- ⚠ **Two migrations are skipped by the harness** (`20270405784887`, `20270110320023`). **Both are
  data seeds / CHECK re-assertions; neither adds or drops a column**, so neither can affect this.
  Verified in the run's own output, not assumed.

---

## 2 · (a) LIVE DEFECT — exactly one

### 🔴 `manpower_gigs.vendor_profile_id` — prod `NOT NULL`, repo nullable

**PROVEN AGAINST PRODUCTION, not inferred.** The exact insert `postManpowerGig` performs was run
inside a transaction that force-rolled itself back:

```
REFUSED sqlstate=23502 :: null value in column "vendor_profile_id"
of relation "manpower_gigs" violates not-null constraint
```

**`manpower_gigs` still holds 0 rows after the probe** — verified.

**Why it is a defect and not a curiosity:** the app's entire model is *"an open gig is one with no
supplier attached yet."* `postManpowerGig` omits the column; `acceptManpowerGig` matches
`.is('vendor_profile_id', null)`; **both** vendor SELECT policies key on it. Production forbids the
state the whole feature is built on. ⇒ **A host pressing "Post gig" cannot succeed, and never could.**

🔑 **THE CAUSE IS A RULE, NOT A MISHAP: `CREATE TABLE IF NOT EXISTS` NO-OP'd against a pre-existing
production table of a different shape.** The statement succeeds, `db push` reports success, the
version is written to the ledger. **This is the second known instance on this same table** —
`20271011120000` had to `ADD COLUMN IF NOT EXISTS posted_by_user_id` because prod lacked it entirely.

🔴 **AND THE CONSEQUENCE IS BIGGER THAN THE FEATURE.** The PGlite replay builds from the **repo
files**, so its `manpower_gigs` is a **different table** from production's. **A db test for this door
passes in the replay and proves nothing about prod.** This is not the known "the test db is more
permissive than prod" trap — *it is a different schema.*

**Fix belongs to** [`WHATS_NEXT_The_Three_Dead_Answers_2026-08-27.md`](WHATS_NEXT_The_Three_Dead_Answers_2026-08-27.md)
§ 3, which already plans it as a schema-drift repair with a prod `BEGIN…ROLLBACK` dry-run.
⚠ Also carry `handshake_tokens_consumed`: prod defaults **2**, the code promises **0**.

---

## 3 · (b) LATENT — five, all one shape, none firing today

**Every one is the same trap as `manpower_gigs`: production is STRICTER than the replay.** An insert
omitting the column succeeds in every test and is refused in prod. **All five are satisfied by the
code as written today** — which is exactly why they are latent and not live, and exactly why they
should be closed while nobody is depending on them.

### `comp_grants.user_id` · `.granted_by` · `.rationale` — prod `NOT NULL`, repo nullable
The one INSERT (`app/admin/users/actions.ts:599`) supplies all three. Every other reference is a
SELECT or an UPDATE. **Safe today.**
⚠ **The risk is a test, not a user:** a fixture inserting a comp grant without a rationale passes the
replay and would be refused in prod — so a guard written against it would be **testing a table that
does not exist in production.**

### `concierge_abuse_flags.matched_user_ids` · `.signals` — prod `NOT NULL` with **NO DEFAULT**; repo `NOT NULL` **WITH** `'{}'`
Nullability agrees; **the default does not**, which produces the identical outcome: an insert
omitting either column fills in the replay and **fails 23502 in prod**.
The sole writer (`app/dashboard/(account)/profile/concierge/actions.ts:274`) supplies both, and
`detectConciergeAbuseSignals` returns `null` rather than a partial row, so neither can be absent.
**Safe today.**

🚨 **BUT IF IT EVER FIRED, IT WOULD BE DOUBLY SILENT — and that is worth fixing on its own merits.**
That insert is wrapped in `try { await …insert(…) } catch (e) { console.error(…) }`.
**supabase-js does not throw — it resolves with `{ error }`.** So the `catch` can never fire **and
the error is never read.** A refused insert would mean **an abuse flag silently never recorded**,
while the user is still told their account is under review.
🔑 *A try/catch around a supabase call is decoration* — this repo's own documented trap, found here
independently. **Named, not fixed** (it is a real repair, not a drift repair).

---

## 4 · (c) COSMETIC — five, and two of them are the harness working correctly

### The two prod-only tables — `event_service_deliveries` · `pioneer_incentive_logs`
**Already documented** in `KNOWN_GAPS` with `KNOWN_GAP_CEILING = 2`: *"prod-only table, no migration
creates it (applied out of band)."* My independent count reproduces exactly 2. **No action.**
⏭ Back-filling them is the right eventual fix and is deliberately **not guessed at** — the existing
test explains that a wrong back-fill would itself become a future no-op trap.

### The two `vector(384)` vs `text` types — NOT DRIFT
`concierge_brain_chunks.embedding` and `concierge_unanswered_questions.query_embedding`.
**This is the replay harness's own documented shim**: pgvector is unavailable in this PGlite build,
and `replay-migrations.ts` says so by name — exactly one migration declares those two columns and
they are shimmed to `text`. ⚠ **A future extended guard MUST allow-list these two, or it cries wolf
on every run** — and a guard that cries wolf teaches you to skim past the one time it is right.

### The three `encode(extensions.gen_random_bytes(16), 'hex')` vs `encode(gen_random_bytes(16), 'hex')`
`events.master_qr_token` · `guests.qr_token` · `vendor_locked_qr_tokens.token`. **Schema
qualification only — the same function, resolved through `search_path` in prod.** Behaviourally
identical today.
⚠ **Worth one sentence rather than zero:** production holds the **unqualified** spelling, which is
the more fragile of the two — it depends on `extensions` staying on the `search_path`. These three
defaults mint the tokens behind **every printed invitation QR and every locked-QR booking**. Not a
defect, not urgent, and **not something to "tidy" casually.**

---

## 5 · 🚨 THE FINDING NOBODY ASKED FOR — THE COMMITTED SNAPSHOT IS 201 MIGRATIONS STALE

The prod half of the shipped drift check records **1,025 migrations · 380 tables · 4,618 columns.**
**Production today holds 1,226 · 388 · 4,749.** The snapshot's ledger is a strict subset — no phantom
entries — so it is **stale, not wrong.**

**This does not make the shipped test unsafe, and its own limits predicted it** (*"staleness produces
NOISE, not silence"*). It is green because **both of its halves come from the same stale moment**, so
it is internally consistent — it is simply **not currently checking the last 201 migrations.**

⇒ **ACTION, low effort, no decision needed:**
```bash
pnpm --filter @setnayan/web schema:snapshot
```
🔑 **And it is why this audit read the ledger LIVE.** Replaying the snapshot's ledger against today's
prod would have reported **8 missing tables and 131 missing columns as drift** — every one of them a
false positive. *A stale reference is how a clean method produces a confident wrong answer.*

---

## 6 · WHAT SHOULD HAPPEN NEXT — recommended, nothing done

1. **Refresh the snapshot** (one command, above). Closes § 5.
2. **Fix `manpower_gigs`** as part of the crew-shift work already planned — as a **schema-drift
   repair**, with the prod `BEGIN…ROLLBACK` transcript in the PR body.
3. **Extend the shipped drift check to nullability and defaults.** This audit shows the extension is
   **cheap and quiet**: after the two documented pgvector shims and the three `extensions.`
   qualifications are allow-listed **with reasons**, the steady-state noise is **zero**.
   ⚠ Do **not** extend it to full type comparison without the pgvector allow-list first.
   ⚠ **Any allow-list entry is a BILL, not a decision** — each line says somebody accepts a
   difference until further notice.
4. **Fix the two `comp_grants` / `concierge_abuse_flags` clusters** by making the repo match prod
   (add the `NOT NULL`s, drop the phantom defaults) — so the replay stops being more forgiving than
   production. **Separately from (2); these are latent.**
5. **The decoration `try/catch`** on the abuse-flag insert — its own small repair.

---

## 7 · HOW MUCH TO TRUST THIS

**Measured, by the object:** every number above. Prod read live via `pg_class`/`pg_attribute`/
`pg_attrdef`; the repo side produced by executing 1,226 real migrations; the ledger read live; the
existing test's green baseline run with a **non-zero test count** printed (`# tests 6`) and its exit
code checked; the `manpower_gigs` refusal produced by an actual rolled-back insert against
production with the row count verified at 0 afterwards; the detection control injected and observed.

**Inferred, not measured — flagged deliberately:** that the three `extensions.`-qualified defaults
behave identically in prod (**reasoned from `search_path`, not executed**), and that the five latent
rows cannot fire (**read from every call site**, but a call site can be added tomorrow).

**NOT covered, and stated rather than buried:** constraints (`CHECK`, `UNIQUE`, `FK`), indexes,
triggers, grants, policies, functions, views, and every schema other than `public`. **Only
`public` BASE TABLE columns were compared.** RLS policies and grants are the exposure freeze's job.
🔑 **A `CHECK` constraint that exists in prod and not in the replay would be invisible to this
audit** — and the `manpower_gigs` finding is proof that this table family drifts. **That is the
obvious next sweep, and it was not done here.**
