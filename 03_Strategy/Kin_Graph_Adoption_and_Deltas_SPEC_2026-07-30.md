# Kin Graph — Adoption & Deltas

**Status:** DECISION DOCUMENT · awaiting owner + DPO + PH counsel sign-off
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

## 2. The decisions

Each of these is genuinely the owner's (some the DPO's, some counsel's). None can
be inferred from the code.

### OD1 · Adopt this as THE family tree

Confirm `people` + `person_connections` are the family tree, and that no parallel
schema gets built. Recommend **yes** — it is better than a redesign would be, and
a second person model would be worse than either.

*Needs: owner. Output: a `DECISION_LOG.md` row.*

### OD2 · How to hold relationships before counsel signs off

People will want to build their tree before the flag flips. Options:

1. **`status='draft'` rows** — invisible to the other party, one tap to convert to
   `pending` when the flag flips. *Recommended.* Requires widening the `status`
   CHECK by one value.
2. A separate drafts table, discarded on adoption. More code, no reuse.
3. Nothing — no tree-building until counsel clears it.

Note (1) means storing relationship data about third parties before sign-off, even
if nobody but the author can see it. **That is a real question, not a technicality**,
and it is precisely the sort of thing to put to counsel rather than decide here.

*Needs: owner + counsel.*

### OD3 · Retention lines

Two windows have no answer today:

- **Never-confirmed `pending` proposals** — recommend expiry at **12 months**.
  A relationship claim nobody ever answered should not sit forever.
- **`declined` rows** — recommend purge at **30 days**. Long enough to prevent
  immediate re-spam, short enough not to be a record of a refusal.

Both need a matching line in `/privacy`, which currently discloses neither.

*Needs: DPO (which is the owner). See `project_setnayan_data_retention`.*

### OD4 · The minors bridge — recommend NOT NOW

Connecting `dependents` into the tree as `people` nodes via `person_stewardships`
means building a kin graph that includes **children**. That deserves its own data
protection impact assessment and its own counsel conversation.

Recommend: explicitly out of scope. Nothing in this spec should touch it.

*Needs: owner, to agree it is deferred.*

### OD5 · Build the derivation engine now, flag-dark?

Extended kin (lolo, lola, tito, tita, pinsan, bilas, balae) is **derived** from the
stored primitives, not stored. That engine does not exist.

Recommend **build it now**, flag-dark: it is pure code, provably inert against zero
edges, and it closes a real gap — the shipped preview copy already describes
behaviour the code does not have. Building it exposes no data.

*Needs: owner.*

### OD6 · Gendered labels — the one with a hidden cost

*Lolo* versus *lola* requires knowing sex. **`people` does not hold it.**
`dependents` does, but that is a different table for a different purpose.

Recommend **gender-neutral paired labels** for V1 — render "Lolo/Lola" rather than
guessing. Adding a sex or gender column to `people` is sensitive-personal-information
territory under the Data Privacy Act; it is a counsel matter, not an engineering
preference, and it should not be smuggled in as a display improvement.

*Needs: owner + counsel if the answer is anything other than neutral labels.*

### OD7 · Freeze the vocabulary for V1

Confirm **no new storable relations**: no `partner`, no step/half qualifiers, no
in-law primitives. Everything beyond the seven locked relations stays derived or
absent.

The reason to freeze: each new stored relation multiplies the derivation surface and
the consent questions. Widening later is a fresh decision; widening quietly is how a
vocabulary becomes unmaintainable.

*Needs: owner.*

---

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
- **Friends never on the tree.** The `friend` layer exists in the data; it is not
  kinship and should not be drawn as such.
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
