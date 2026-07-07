# People Graph & Lifelong Identity — Strategy Note

**Date:** 2026-07-04
**Status:** 🔒 **LOCKED plan of record (owner "lock everything" · 2026-07-04).** Positioning · phasing · routing · guardrails are canonical. Execution still gated: Phase 0 is greenlit (safe/additive); the `people` table needs the Phase-1 greenlight; tree / life-stories / recs / legacy need PH counsel; any face self-enrollment needs DPIA + counsel. Locking the plan does **not** skip these gates. No code greenlit beyond Phase 0.
**Author context:** Owner (Ice) brainstorm → planned with Claude Code. Owner reframed it as "an easy shift — this is just the intro of our account and how they connect and stays together."

> **Read me first if you're merging this into another session:** this is a *positioning + account-model* proposal, not a feature ticket. It flips Setnayan's data spine from the **event** to the **person**. Most of it reuses data we already collect (guest lists, RSVPs, Papic tags, seating) and currently throw away. One ingredient — minor/children's data — is genuinely hazardous and is cleanly quarantined into a later, counsel-gated phase.

---

## 1. The one-sentence shift

Today Setnayan's durable spine is the **event**. Flip it so the spine is the **person** — events, accounts, and connections all hang off people who persist for life.

The thesis this expresses (already in the corpus as "Living Memories" / "core memory" positioning): **we don't just *collect* memories, we *connect* them.** Weddings are simply the first event type we entered through.

## 2. The whole model is four pieces

**1. Person — the durable node.**
Exists whether or not they ever log in. Every guest we've ever added is *already* a person; we just currently treat them as disposable rows inside one event. Fields: name, birthday, optional face/photo. That's it.

**2. Account — a login that claims a Person.**
The existing `users`. Creating an account = **claiming your own Person node**. Most Persons on the platform will have *no* account (a baby, a lola, a guest who never signed up) — that's fine. The account is optional; the Person is permanent.

**3. Connection — an edge between two Persons.**
Cheap because we already generate it and discard it:
- Same guest list → "knows"
- RSVP'd + attended → "was there"
- Papic-tagged in same photo → "was with"
- Same table in seating chart → "close to"

Every event silently thickens the graph: who came to your wedding *and* your friend's debut, who's new this time, who you keep celebrating with. **We are not building a social network — we are reading one out of data we already collect.**

**4. Guardianship — a Person managing another Person.**
A guardian is a Person who controls (and pays for) another Person's node until a handover. "Birth → present" becomes: *a guardian created your Person node and attached events to it before you had an account.* This is the hazardous piece — see §5.

## 3. The "intro" — three doors into being a Person

There are exactly three ways a Person enters Setnayan:

| Door | Who | Connects because |
|---|---|---|
| **Self sign-up** | An adult creating their own account | They *are* the Person, claimed |
| **Added as a guest** | Anyone on a guest list / RSVP / Papic tag | Auto-linked to host by co-presence |
| **Registered by a guardian** | A child, or someone who can't self-register | Guardian holds the node until handover |

**The magic moment:** when a guest later signs up on their own, we **match them to the Person node that already exists** instead of minting a blank one — and their whole history of "events I was part of" is waiting for them. That is "how they connect and stay together."

## 4. Reuse vs. genuinely new

- **Reuse (~80%):** guest lists, RSVPs, Papic tags, seating, face enrollment — all already produce person-data and co-presence. `users` already exists.
- **New (~20%):** (a) a `people` table that outlives events; (b) a match/merge step so one human isn't 5 rows; (c) the guardianship link + handover flow.

Critically, it's **additive** — a `people` table *alongside* `users`, seeded from data we already have. Nothing existing has to change to start, so it doesn't threaten the wedding V1 currently shipping.

## 5. Risk register — the honest version

The risk is **concentrated, not spread.** One ingredient is dangerous; the rest is ordinary hard engineering.

**① Minor / children's data — the ONLY brand-level risk.**
Holding children's data under PH Data Privacy Act (RA 10173) is real liability. The failure mode isn't a fine, it's a *headline*: "wedding app quietly built profiles of people's kids from birth." Kills trust even if legally clean. Open questions that are the *product*, not edge cases:
- Who owns the account at age of majority? Handover flow vs. guardian keeps it forever.
- Child at 22 says "delete all of it" — RA 10173 gives them that right. Can we honor it?
- Two guardians disagree / divorce / estrangement — who controls the archive?
→ **Mitigation: adults-only for the entire People graph in Phase 1.** The minor layer is a separate, later, **PH-counsel-gated** feature. ~90% of the value ships without ever touching a child's data.

**② The "creepy" line — de-anonymization.**
Same data reads as magic ("your guests reappear") or surveillance ("Setnayan maps everyone you've celebrated with"). A guest who never signed up discovering we profiled them is a problem.
→ **Mitigation: the graph is private to the host, never a public/social feature.** No "people you may know," no exposing edges to anyone but the person whose events they are. We *read* the graph internally; we never *broadcast* it.

**③ De-duplication is genuinely hard — wrong merges are worse than no merge.**
Merge two different "Maria Santos" and you leak one person's history onto another's face.
→ **Mitigation: never auto-merge silently. Suggest → human confirms.** Bias hard toward **under-merging** (two nodes for one person = annoying) over **over-merging** (one node for two people = privacy breach).

**④ Scope gravity.**
Touches the account model — the most load-bearing thing in the app. Careless = a rewrite that stalls V1.
→ **Mitigation: additive only** (see §4).

**Normal, non-scary cons:** more schema/surface to maintain; the graph is only impressive at volume (party trick at 10 events, moat at 10,000) — underwhelming early, and that's fine.

## 6. Verdict

Sound and on-strategy — the truest version of what Setnayan already claims to be. Not too risky **if built in this order**; too risky if built in the reverse order (leading with the birth-to-present baby archive).

## 7. Suggested phasing

- **Now (positioning only):** adopt "person is the spine" as the go-forward account model. Free, and true.
- **Phase 1 pilot (safe 90%):** `people` table + match-on-signup, seeded from existing guest lists. **Adults only.** No new legal surface. Delivers "your guests reappear across your events."
- **Phase 2 (gated 10%):** connection-graph surfaces (who's new / who keeps coming) + guardianship + minor accounts — **behind PH counsel review.** Rides on Phase 1 existing first: you can't archive a life until you can hold a *person* across events.

## 8. Cross-links (existing corpus)

- Living Memories thesis (paper → digital → living) · core memory positioning — this note is the account-model expression of both.
- Entity constitution (`03_Strategy/`, 2026-07-04) — canonical ID generators, `users` model; the `people` table must follow the same `S89<TYPE>-` + hidden `bigserial` pattern.
- 0001 guest list · 0002 QR invites · 0012 Papic tags · 0008 seating — the co-presence data sources feeding the graph.
- RA 10173 compliance surface (0025 Privacy & Data) — the minor layer extends this.

---

## 9. User Page = the Lifelong Home — build strategy (added 2026-07-04)

The user page is not a screen; it is **the Person, rendered.** The private account home and the public `/u/[slug]` page are two faces of one durable node, built to deepen across a life without re-architecture.

**One page, two faces, whole life.**
- **Private face** (account home) — plan · manage · tend · eventually bequeath.
- **Public face** (`/u/[slug]`, shipped PR #2804) — the outward story, which at end of life *becomes the memorial*.

**The page's states track a life** — and the Upcoming/Ongoing/Completed buckets already prototyped are the first two-thirds of it:

| Page state | Shows | Lives on |
|---|---|---|
| Planning (today) | upcoming events | events only |
| Living | events across years + "your people reappear" | + people table |
| Archive | a lifetime of events + family tree | + connections/tree |
| Legacy | frozen tribute, passed to heirs | + memorialization |

`Completed → Archive → Legacy` is one continuum; the page a 25-year-old plans a wedding on and the memorial a grandchild visits are the same surface, aged.

**Build order — the page leads (positioning), the graph follows (gated):**
- **Phase 0 (now · safe · additive):** account home + public page built *person-shaped* (spine = person, events hang off them), populated by events only. No `people` table. Zero legal exposure; does not threaten the wedding V1 shipping.
- **Phase 1:** `people` table + match-on-signup (adults). Faint "your people" presence.
- **Phase 2:** adult family tree (opt-in · mutually confirmed) + guardianship. PH counsel enters.
- **Phase 3:** legacy & memorial (designate-while-alive · counsel-first). Ships last.

**Bake in now (cheap forward-compatibility):**
1. Compose the account home as "a person + their life," not "an events array."
2. Keep `/u/` dignified/editorial — never dashboard-ify it; restraint is what makes it *memorial-ready*.
3. Reserve vocabulary early: an `S89P-` people prefix (entity constitution) + an inert "Legacy contact" slot in the settings IA.
4. Durable-by-default data (extends the "don't auto-delete photos 5 years" lock) — the archive can't pass on what we discarded.

**Why safe + on-strategy:** additive (alongside today's events model); monetization unchanged (per-event apply-then-pay → lifetime value, not DAU); consent-clean by construction (claim · mutual link · designated legacy); the two hazardous layers (minors, death) are the last two phases, both counsel-gated.

**How connections get created (the safe mechanic — prototyped 2026-07-04):** two paths, both human-confirmed, never auto-linked.
- **Suggested (passive · read from data):** co-presence we already collect — same guest list, same table, Papic co-tags — and event roles (Mother of the Bride, principal sponsors, entourage) surface as *suggestions* with a pre-filled relationship guess. "Add your mom?" from data that already exists.
- **Declared (explicit):** search a person → propose a relationship → it sends a **confirmation request**; the edge stays `pending` until the other person accepts (mutual, two-sided). One-sided declarations never create a live edge.
- **Guardrails visible in the UI:** private to the host (never a public/social graph) · opt-in and dismissable · adults-only in Phase 1–2 · suggest→confirm, never silent auto-merge (bias to under-merge).

**Decision captured (2026-07-04):** adopt "the user page is the Person," built person-shaped from Phase 0 — **positioning only**; the `people` table / tree / legacy remain gated (Phase 1+, tree/legacy behind PH counsel).

---

## 10. Face-recognition boundary — agreed 2026-07-04 (owner "I understand and agree")

The lifelong life-story vision creates constant pressure to recognize people by face across events. The line is drawn, and the **existing per-event face-scoping lock stays in force** ("face detection is per-event-scoped; the vector store is never reused across weddings").

**Prohibited:**
- **Cross-event identification** (1:N — "who are all these people, plot them across events"). The dragnet.
- Any **platform-owned searchable face index**.
- **Post-event harvesting** of guests' faces from event galleries to build persistent references — the worst case, because it manufactures a trackable biometric reference for people (including non-signups) who never consented. "When an event ends, we store the best photo of them and replot them later" = this, and it is out.

**Permitted only under all of these — counsel-gated, not yet greenlit:**
- Persistent face reference exists **only via consented self-enrollment** — the person chooses to save *their own* face to *their own* claimed account. Never harvested, never for unclaimed guests.
- **On-device preferred** (template never leaves the person's device → no server-side biometric store to breach).
- **Verification (1:1, "is this me?"), never identification.** Enrolled templates must **never aggregate into a searchable index** — enforced structurally, not by policy.
- **Opt-in per event, revocable, deletable** (RA 10173).
- **DPIA + PH counsel required** before any account-level template is stored.

**Key reframe (why we're not forced into any of this):** the cross-event life story assembles from **tags + QR + confirmed-guest identity — no biometrics required.** Persistent face recognition is an *opt-in convenience accelerant*, never the foundation. Within-event face tagging (already locked-OK, per-event) is unaffected.

The test that separates a feature from a company-ender: **who chose to save that face, and whose is it.** Person chose, person owns → feature. Platform harvested → out.

---

## 11. Trusted-circle vendor recommendations — extension (added 2026-07-04)

The graph's marketplace payoff: recommend vendors that are **near · trusted · connected**, using 1st–2nd degree relationships. Extends the existing vendor recommendation engine + Bayesian quality rating + coverage — not a new system.

- **Formula:** near (coverage) + trusted (rating or explicit review/vouch) + connected (your circle used/vouched). Triangulate three signals; never raw-traverse a graph.
- **"Trusted" must be an explicit signal** — a review or an opt-in vouch. **Never mere booking co-occurrence** (hiring ≠ endorsing).
- **Consent:** opt-in vouch, *or* aggregate counts above a **min-N** threshold; **never name a person who didn't vouch**; anyone can opt their choices out of feeding others' recs.
- **Degree policy:** 1st = attributed *if vouched*, else min-N aggregate · 2nd = anonymized aggregate only, min-N · **3rd = dropped** (weak signal + overreach; marketplace ratings already cover it).
- **Trust is never purchasable.** No vendor pays — via Pro/Enterprise/boost — to appear "trusted by your circle." Boosts stay clearly labeled and separate. (Same "zero fakes" line as the vendor value prop.)
- **Packaging — LOCKED 2026-07-04 (the split, not the number):** the trusted-circle **signal is FREE** (discovery is a locked free pillar; it drives bookings = vendor value; network effects need ubiquity; never lose a free row). **Setnayan AI sells the orchestration** on top — proactive cross-category shortlisting, budget/style/date weighting, sequencing, conflict-flagging. Free hands you the signal; AI does the planning with it. *The free-signal-vs-AI-orchestration split is locked; the exact tier/price-point still rides the holistic pricing review, per the standing "pricing reviewed later" rule.*
- **Gate:** Phase 2+ (needs the connection graph) · counsel-gated (relationship **+** commercial data together is more sensitive than either alone).

## 12. How it connects to the live product — complete plan at a glance (added 2026-07-04)

None of this is a separate app. Every piece lands on a surface that already exists, additively — this is threading, not a rebuild.

| Plan element | Lands on / wires into (real surface) | State today |
|---|---|---|
| Person page — **private** | account home `/dashboard` (the prototyped hub) | prototype |
| Person page — **public** | `/u/[slug]` | **shipped** (PR #2804) |
| Event pages | `/[slug]` event sites | shipped |
| Sign-up **match-or-mint** | existing auth + invite/join (name-as-answer-key) | Phase 1 delta |
| `people` table | new, **alongside** `users` (S89P- prefix) | Phase 1 |
| Connections UI | account home "Your people" section | Phase 2 |
| Life stories | extends Papic per-guest delivery + galleries + editorial | Phase 2 |
| Guest list from your circle | feeds iteration 0001 guest-list creation | Phase 1–2 |
| Trusted-circle vendor recs | extends vendor recommendation engine + marketplace + Setnayan AI | Phase 2 |
| Legacy / memorial | extends 0025 Settings (legacy-contact) + `/u/` becomes the tribute | Phase 3 |
| Face boundary | constrains 0012 Papic face-enrollment — no cross-event | **locked now** |

**Startable now (Phase 0, no new legal/graph exposure):** build the account home *person-shaped*; keep `/u/` as the public person face (done); reserve the `S89P-` prefix + an inert Legacy-contact settings slot; durable-by-default data. Everything past Phase 0 needs the owner's Phase-1 greenlight; tree / legacy / recs additionally need PH counsel.

**Canonical public routing (owner-confirmed 2026-07-04 — matches the shipped slug-routing program):**
- **Person page** → `setnayan.com/u/[person-slug]` (the Person, rendered · shipped, upgraded PR #2804).
- **Event page** → `setnayan.com/u/[person-slug]/[event-slug]` (nested under the person · built as a single middleware rewrite, behind the `NEXT_PUBLIC_U_NESTING_CUTOVER` flag — flip in Vercel env to activate; old/printed-QR URLs kept alive by `slug_change_log` redirects).
- **Vendor page** → `setnayan.com/[vendor-slug]` (bare root · shipped PR #2559). Vendors are businesses, not persons — deliberately *not* under `/u/`.
- **Two-person event ownership — LOCKED 2026-07-04:** an event has **two** persons (a couple). The **primary owner's slug is canonical** for the event URL (`/u/[primary]/[event]`); the event is **cross-listed on both partners' `/u/` pages**; **either partner's URL resolves to the canonical via redirect.** Both partners are first-class persons, but there's one canonical link for QRs and sharing.
