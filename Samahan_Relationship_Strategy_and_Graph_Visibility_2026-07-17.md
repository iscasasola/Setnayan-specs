# Samahan_Relationship_Strategy_and_Graph_Visibility_2026-07-17

> **Owner-locked 2026-07-17** ("i follow your recommendation"). Two decisions: (A) relationships are People edges, never samahans — two primitives that feed each other; (B) graph visibility extends along FAMILY edges only — friend edges are private leaves, no friend-of-friend visibility anywhere. Companion to `Event_Creation_Limits_Council_Verdict_2026-07-17.md` (life vs lifestyle) and `Samahan_Minimal_Build_Plan_2026-07-15.md`.

## A · Relationship ≠ Samahan — two primitives

**People edges answer "who are we to each other."** The handshake connection (degree model, shipped ~#3337) is the relationship record — private, mutual-consent, disconnect with mutual data separation. A couple forming = they *Connect* (1°). Later (counsel-gated) the edge can carry a typed label — partner, married — with optional union date; that union edge is the missing primitive that could someday make couple anniversary life-class (per the event-creation-limits council, anniversary = lifestyle v1 precisely because no union-subject primitive exists).

**Samahan answers "what do we do together."** A user-named activity container (no `kind` column by design — dropped 2026-07-17, RA 10173 data minimization) whose job is owning shared lifestyle events. It says nothing about how members are related.

**Rejected: relationship-as-samahan.** (1) Breakup would mean "dissolving an org" while the People model already has disconnect semantics — two truths for one fact. (2) Samahan membership is visible to all members; a "relationship" group leaks romantic status — the same class of affiliation signal the `kind` drop just eliminated. (3) The coupling already flows the right direction: samahans *produce* relationships (2°→1° Connect-on-co-members, shipped), they don't define them.

**Rule of thumb (mirrors the shipped `event_class` lock): persons own life events; samahans own lifestyle events.**

## B · Samahan anniversary + the triangle flywheel

- Samahan anniversary works structurally today: `anniversary` is `community_eligible`, lifestyle-class (unlimited, ungated), recurs by nature. Build item = the **doorway**: a "Samahan anniversary" card inside the samahan space.
- **No `founded_on` column on `communities`** — the first anniversary event's own date IS the founding record (data minimization; don't add a date column the event already carries).
- **Triangle flywheel:** life events create relationships (guests meet → handshake connections) → relationships create samahans (the barkada names itself) → samahans create unlimited lifestyle events (anniversary, reunion, Christmas party, tournament — vendor demand at ~zero marginal cost) → new people → more connections → more samahans. Life events = scarce gated top-of-funnel; samahans = the recurrence engine between milestones.
- **Missing doorway on the triangle:** samahan-formation prompt after an event settles ("Ang saya ng barkada na 'to — gusto n'yo bang manatiling magkasama? Gumawa ng samahan"), targeted at guests who connected at that event.

## C · Graph visibility — branches vs leaves (owner-locked)

**Family edges are branches — the tree grows through them. Friend edges are leaves — the tree stops there.**

1. **A friend edge is visible only to its two endpoints.** Never to family, never to mutual friends, never traversed, never feeds a "people you may know."
2. **Family edges extend the tree — only your own tree.** Family-tree visibility travels along family edges only, within consented membership.
3. **Crossing case:** Ana friends Ben; Ben is in the Reyes family tree. The Reyes do NOT see "Ben ↔ Ana" (friendships are not tree data). Ana does NOT see the Reyes tree (Ben is a leaf on her graph; his branches don't become hers). The graphs touch at Ben and never leak across him — no transitive exposure in either direction.
4. **RA 10173 basis:** an edge is personal data of BOTH endpoints; disclosing "Ana ↔ Ben" to Ben's family is disclosing Ana's data to people she never consented to. Default = silence.
5. **Co-presence nuance:** shared surfaces (event guest lists, samahan member lists) show presence to that container's audience — that is container membership, not graph traversal (the shipped 2°→1° suggestions come from shared samahan, not friend-edge walks — consistent). **Surfaces show presence; only the graph shows relationships — and the graph never talks.**

**Implementation directive (for Opus):** person-graph reads are self-scoped + family-tree-scoped + container-scoped; RLS never joins across connection edges for any third-party read. The friend-of-friend query path must be ABSENT, not blocked.
