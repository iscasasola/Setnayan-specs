# UGAT — the Setnayan nervous system

> **Ugat** (Tagalog: *root* and *vein*) is the platform's entity map made explicit: what exists, how it connects, where each piece of data is born, lives, and travels — and whether every surface is telling the truth about it. It is the true base foundation of the app: **all the app does is connect these data.** Christened 2026-07-05 (owner-directed naming session 2026-07-04/05; "Diwa" is reserved for the navigator intelligence layer).

## The Ugat rule

**Every piece of data has one root; every surface is a vein.** A hardcoded value is a second home for data that already has one — *walang ugat*, rootless, and rootless data drifts. Every entity birth and every claimable role-edge has exactly one onboarding flow. Every rendered value must be traceable: surface → binding → home row → last writer → audit trail.

## The papers (all in `03_Strategy/`)

| Document | What it holds |
|---|---|
| `Entity_Map_and_Hardcode_Audit_2026-07-04.md` | The graph: 18 entities, 33 edges (exact via-columns; ⚠ = code-only), 6 verified hardcode violations, lock-step key spaces, the entity card grammar |
| `Data_Flow_Map_2026-07-04.md` | 94 lifecycle flows (born-on → writer → home → windows → guard), the page↔data matrix, 31 prioritized gaps |
| `Onboarding_Map_2026-07-04.md` | 53 birth flows, the coverage matrix, the 9-item missing-onboardings queue |
| `Surface_Binding_Health_*.md` | The four ways a binding lies (dead read · silent fallback · hardcoded stand-in · orphan write) + the error-tracing playbook *(audit re-running)* |
| `Ugat Coverage — *` | Route-by-route: which pages are veins, which are severed *(sweep in flight)* |

## The console (prototypes in `03_Strategy/`)

`Jarvis_Console_Prototype_2026-07-04.html` (the Ugat Console) · `Entity_Map_Console_Prototype_2026-07-04.html` (its base) · `Taxonomy_Studio_Prototype_2026-07-04.html`

### The eight console laws (owner-locked design grammar)
1. **Connections are the primary object** — a summary arrow is a failure state; a connection that is a table renders as a first-class joint with its own card (implemented-by · writers · guards · health · traps).
2. **Three resolution levels** — Entities · Joints · Fields.
3. **Blocks expand in place** — never navigate away; edges stay attached; at Fields level an edge lands on the exact column row that implements it.
4. **Solid / dashed / red / amber honesty** — exists / designed-not-built / lying / drifting. Applies to nodes, edges, *and buttons*.
5. **Access = focus** — opening anything recenters the map on it and opens its card in one gesture; neighbors lit, rest dimmed.
6. **Cards are command decks** — per-entity admin action rails; admins may message users but never read couple↔vendor chats, files, or face data (stated on the card).
7. **One omnibox (⌘K)** — ask or find: questions, records, connections, fields, health findings, admin actions; selecting anything applies law 5.
8. **Dark canvas, light chrome** — engineered blocks with port dots, two-tone bezier connectors, motion only on walked edges (current through veins).

## Live counterparts

The Taxonomy Studio (`/admin/taxonomy`) is the first shipped Ugat organ — tree, refinements, leaf attributes, vocabularies, icons, photos, one control room. The full live console (map API → health telemetry → Diwa navigator) is the build program the papers specify.
