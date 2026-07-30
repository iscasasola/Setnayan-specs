# Kin Graph — Adoption & Deltas

**Status:** OD1-OD7 + both follow-ups ANSWERED · DPO approved 2026-07-31 · PH COUNSEL GATE OPEN
**Date:** 2026-07-30
**Author:** Claude Code session (Ugat map work)
**Nature:** No code. Nothing here has been built. This exists to be argued with.

---

## 0. The headline: this is an ADOPTION decision, not a build

The owner asked for a family tree. The work was briefed as greenfield. It is not.

**The person spine already ships.** Five tables exist in production today, with a
consent lifecycle, a Philippines-aware relationship vocabulary, and directed edges.
They hold **zero rows**, behind a feature flag (`NEXT_PUBLIC_PEOPLE_CONNECTIONS`)
that is **off**, pending counsel review.

So the question is not "what should we build". It is **"do we adopt what is
already there, and on what terms do we switch it on."**

That reframing matters because a greenfield brief invites a redesign, and a
redesign here would discard a schema that is better than what a fresh pass would
produce.

---

## 1. What actually exists — verified against live production 2026-07-30

Read from `information_schema` and `pg_constraint` on `setnayan-prod`, not from
specs or handoffs.

### `people` — the person record

```
person_id · public_id · display_name · first_name · last_name
email · phone · profile_photo_url · birth_date
claimed_by_user_id · created_by_user_id
created_at · updated_at · deleted_at · in_memoriam
```

Two columns worth pausing on. **`claimed_by_user_id`** means a person can exist
before they have an account — someone's lola is a person in the graph whether or
not she ever signs up. And **`in_memoriam`** means someone thought about the case
where a person in the tree has died, which is not a detail a first draft usually
reaches.

### `person_connections` — the edges

```
connection_id · from_person_id · to_person_id
relation · layer · status
created_by_event_id · created_by_user_id
confirmed_at · declined_at · deleted_at
```

Constraints, all enforced in the database:

| | Allowed values |
|---|---|
| `relation` | `spouse` · `parent` · `child` · `sibling` · `godparent` · `godchild` · `friend` |
| `layer` | `family` · `ritual` · `friend` |
| `status` | `pending` · `confirmed` · `declined` |
| `person_connections_no_self` | `from_person_id <> to_person_id` |

**The `ritual` layer is the ninong/ninang layer.** Godparenthood is modelled as a
first-class relationship in its own layer, separate from blood family and from
friendship. For a Philippines-first product that is the correct call, and it is
already made.

`created_by_event_id` gives every edge **provenance** — which wedding, christening
or reunion the relationship was declared at. That is unusually thoughtful: it means
a kin claim can always be traced back to the occasion that produced it.

### `person_stewardships` — who may act for whom

```
stewardship_id · branch_person_id · steward_user_id
kind (guardian | estate) · is_minor · basis · status (active | relinquished | revoked)
granted_at · ends_at · relinquished_at · revoked_at
```

A full lifecycle, including **`relinquished`** as distinct from **`revoked`** —
handing stewardship over voluntarily is not the same event as having it taken away,
and the schema knows that.

### `dependents` — the guardian-held records

```
dependent_id · owner_user_id · name · birth_date · sex · religion · relationship
birth_date_consent_at · religion_consent_at
handed_over_at · handed_over_by_user_id · claimed_user_id
shared_with_spouse · dependent_kind
claim_token · claim_token_purpose · claim_token_expires_at
```

**Per-field consent timestamps.** `birth_date_consent_at` and
`religion_consent_at` record consent for those two specific sensitive fields
independently. That is a materially higher standard than most products apply, and
it is already built.

### `households`

`household_id · event_id · name · address` — event-scoped guest grouping. Related
but a different concern; not part of the kin graph proper.

---
## 2. The decisions — ANSWERED by the owner 2026-07-30

All seven were put to the owner and answered the same day. Two follow-ups remain
open and are marked as such at the end.

### ✅ OD1 · ADOPTED — and it is a CONNECTION tree, not a family tree

Confirmed: `people` + `person_connections` are the graph. No second person model
gets built.

**The owner renamed it.** Not a family tree — a **connection tree**, carrying
three layers: **family**, **ritual** (ninong/ninang), and **friends**. That maps
exactly onto the `layer` CHECK already in the schema, which is a good sign the
original design was thinking the same way.

> ⚠ **This CORRECTS an earlier recommendation in this document.** §6 originally
> said "friends never on the tree." That was wrong, and OD3's answer explains
> why — see below. Friends are not decoration on a kinship graph; in the
> Philippine model they are an INPUT to it.

### ✅ OD2 · YES — draft rows before counsel

`status='draft'` proceeds: invisible to the counterparty, one tap to `pending`
once counsel clears the flag. Requires widening the `status` CHECK by one value.

### ⚠ OD3 · ANSWERED A DIFFERENT QUESTION — and the answer is the best thing here

The question asked about RETENTION windows. The owner answered about
**DERIVATION**, and the answer reshapes the calculator:

> *"they will only become an aunt if they are the brothers/sisters of their
> parents… and if they are parents of their friends. these are aunts as well"*

So a **tita** arises two ways:

| | Rule | Class |
|---|---|---|
| 1 | sibling of a parent | **blood-derived** |
| 2 | parent of a friend | **courtesy-derived** |

Rule 2 is the Philippine courtesy-kinship model, and no generic family-tree
design accounts for it. Two consequences:

- **The friend layer feeds the family labels.** A courtesy tita is only derivable
  BECAUSE a friend edge exists. This is why friends belong on the tree, and why
  §6's original "friends never on the tree" line was wrong.
- **Derived relations need a CLASS, not just a label.** "My mother's sister" and
  "my mother's best friend" are both tita and are not the same fact. The tree
  should render them distinguishably — same word, different provenance.

The owner also floated, with a question mark, *"year mates of the parents?"* —
i.e. whether a parent's contemporaries are titas by generation alone. Left
**unresolved**; it is a wider rule than rule 2 and would pull in people with no
edge to the person at all.

🔴 **RETENTION REMAINS OPEN.** Recommended and still unanswered: expire
never-confirmed `pending` proposals at **12 months**; purge `declined` rows at
**30 days**; disclose both in `/privacy`, which currently mentions neither.
Owner-as-DPO decision.

### ✅ OD4 · DEFERRED — minors stay with dependants

> *"not now for minors. this will be covered by dependents temporarily."*

Recorded as a decision rather than a silence, which matters: later, "we did not
discuss it" and "we decided not to" look identical. `dependents` holds minors
for now; bridging them into `people` via `person_stewardships` needs its own
DPIA and its own counsel conversation.

### ✅ OD5 · BUILD THE DERIVATION ENGINE — following the tree

> *"follow the family tree"*

Extended kin (lolo, lola, tito, tita, pinsan, pamangkin, bilas, balae) is
DERIVED from the stored primitives, never stored. Build flag-dark: pure code,
provably inert at zero edges, and it closes the gap where shipped preview copy
already promises behaviour the code lacks.

Must implement BOTH derivation classes from OD3.

### ✅ OD6 · SEX DATA EXISTS — the owner was right, with one boundary

> *"we do have a sex."*

Verified against the schema — and this **corrects §2's original claim** that the
data was absent:

| Table | Sex? |
|---|---|
| `users` | ✅ `sex` **+ `sex_consent_at`** |
| `dependents` | ✅ `sex` |
| `people` | ❌ **no sex column** |

`users.sex_consent_at` matters: a per-field consent stamp already exists, so the
privacy model for this field is built rather than needing invention.

The boundary: `people` is the tree's node table and can hold someone with **no
account** (`claimed_by_user_id` is nullable). So gendered labels resolve for
claimed people and dependants, and must fall back to neutral pairs
("Lolo/Lola") for unclaimed nodes. That is a rendering rule, not a blocker — and
notably it means the tree will show a MIX of specific and neutral labels, which
should look deliberate rather than broken.

Adding `sex` to `people` directly remains a counsel matter and is NOT proposed.

### ✅ OD7 · VOCABULARY FROZEN at seven stored relations

Confirmed. `spouse · parent · child · sibling · godparent · godchild · friend`
stay the complete stored set. No `partner`, no step/half qualifiers, no in-law
primitives.

This is coherent with OD5 rather than in tension with it: **if the calculator
derives tita, lolo and pamangkin, none of them need storing.** Every widening of
the stored set multiplies both the derivation surface and the consent questions,
so widening later is a fresh owner + counsel decision.

---

### ✅ Both follow-ups ANSWERED 2026-07-31

**Retention — 30 days.** Owner-as-DPO. Applied to BOTH windows: never-confirmed
`pending` proposals and `declined` rows both purge at 30 days.

> ⚠ Consequence, stated rather than buried: 30 days is far shorter than the 12
> months originally proposed for UNANSWERED claims. Someone who does not open
> the app for a month loses an incoming connection request silently. That is the
> most privacy-protective reading and it is a legitimate choice — but it is a
> PRODUCT effect, not only a privacy one, and it is a one-line change if the
> lived behaviour turns out wrong.

Both windows need a `/privacy` line; it currently discloses neither.

**The courtesy tito/tita boundary — none. Unbounded is correct.**

> *"yes tita can be most."*

Every friend’s parent is a tito or tita — BOTH, gendered by the person, not just aunts (owner, 2026-07-31). Transitive and without a closeness filter.
This is simply true to Philippine life, and constraining it would make the model
less accurate rather than more manageable.

It therefore becomes a RENDERING problem, not a rule problem: a tree where
courtesy titas outnumber blood relations must not let them crowd the blood
layer out. Volume is expected and correct; the visual hierarchy is what carries
the distinction.

The owner's own *"year mates of the parents?"* remains UNADOPTED — generation
alone is not an edge, and adopting it would derive kin for people with no
connection to the person at all.

## 3. 🔴 A security finding to fix before the flag flips

`person_connections` is governed by a **single `FOR ALL` policy**. One rule covering
select, insert, update and delete for both participants means:

- either side can **create** an edge naming the other, and
- the same side can **confirm** it.

A relationship can be forged and self-approved. Today this is harmless — zero rows,
flag off — which is exactly why now is the moment to fix it.

The fix is to split it into per-command policies: **declarer-only INSERT**,
**to-side-only confirm/decline**, **from-side-only retract**. That edits
`USING`/`WITH CHECK` predicates, so the exposure baseline must be regenerated in the
same PR.

**This must land before any real relationship row is stored.**

Separately, and already fixed: all three person-spine tables were reachable by
`anon` with the full default ACL, including `TRUNCATE`. Closed 2026-07-30 in the
default-ACL hygiene sweep. Grants only — no predicate edits, deliberately.

---

## 4. Privacy posture — the part that decides whether this ships at all

A kin graph is **sensitive personal information about third parties who may have no
account and may never have consented.** That is the whole difficulty, and it is not
solved by careful UI.

The questions counsel and the DPO need to answer:

- **Who may create an edge?** Anyone about anyone, or only about people they have a
  confirmed connection to?
- **Must the other person confirm?** The schema supports it (`pending` →
  `confirmed`). Should an unconfirmed edge be visible to anyone but its author?
- **Who can see the tree?** Ego-centric only, or transitively?
- **Deletion.** When one side deletes their account, what happens to edges naming
  them — and to the other party's view of their own tree?
- **Named third parties.** Someone can be a node with a name, a birth date and a
  photograph, and no account. What is our basis for holding that?

The project's standing default is **disclose-then-enable**: document the posture,
surface a control, and do not ship silently. See
`project_setnayan_interim_payments_privacy_default`.

---

## 5. The standing gate, stated plainly

**PH counsel + DPO sign-off is required before `NEXT_PUBLIC_PEOPLE_CONNECTIONS`
flips and before any real relationship row is stored.**

Every buildable item above can ship flag-dark until then. Nothing in this document
authorises the flip, and no engineering session should perform it.

---

## 6. What the tree would look like, once cleared

Only after the above. Sketched so the decisions have something concrete attached:

- **Ego-centric**, not a global graph — you see your own tree, not the platform's.
- **Confirmed edges solid; derived kin dimmed**, so the difference between "she told
  us she is my aunt" and "we worked out she is probably my aunt" is visible.
- **The ritual layer rendered as its own ring** — ninong/ninang shown with the
  ceremony they came from, which `created_by_event_id` already records.
- **Friends ARE on the tree** (owner, OD1 — this REVERSES an earlier line here).
  The friend layer is not decoration: a courtesy tita is only derivable because a
  friend edge exists, so removing friends would silently remove half the kinship
  labels. Render them as their own layer, visibly distinct from blood.
- **Names only where permitted** — an unconfirmed or unconsented node shows as a
  placeholder, never a name.

Extend `connections-panel.tsx`. Do not build a new page — the People surface exists.

---

## 7. Recommended sequence

1. **This document** → owner reads, decides OD1–OD7, `DECISION_LOG.md` row.
2. **The `FOR ALL` policy split** → before any real row. Baseline regenerated in-PR.
3. **The derivation engine** → flag-dark, pure, inert at zero edges (if OD5 = yes).
4. **Register the spine on the Ugat map** → it is on the `map-backlog` today, and
   Papic already foreign-keys into `people`, so the map is already describing a
   dependency on an unmapped concept.
5. **Counsel + DPO review** → the gate.
6. **The tree surface** → only after the gate.

---

## Appendix · what I could not determine

- **Whether `layer='ritual'` was intended to carry non-godparent ritual kin**
  (sponsors, wedding principals). The CHECK permits it; nothing documents it.
- **Whether `dependents.sex` was added for the tree or for something else.** It
  predates this work and its purpose is not recorded.
- **Whether `basis` on `person_stewardships` is meant to hold a legal citation, a
  free-text justification, or an enum.** The column is text with no CHECK.

Each is a small question for whoever designed the spine, and each would change a
sentence above.
