# Muslim Wedding — Sequenced Build Plan

**Status:** Drafted 2026-06-28 · **P1–P5 SHIPPED 2026-06-28** (PR [#2319](https://github.com/iscasasola/setnayan-platform/pull/2319), migrations applied to `setnayan-prod`) · companion to [`Muslim_Wedding_Spec_2026-06-28.md`](Muslim_Wedding_Spec_2026-06-28.md)
**Scope:** Turns the spec's gap list (G1–G10) into an ordered, PR-sized build sequence. Each phase below is a worktree+PR unit (code repos keep the PR workflow; corpus/seeding items can land directly).
**Sequencing principle:** value-first. Lead with the two things a Muslim couple *immediately notices* — the **"Five Essentials of your Nikah" card** (the signature surface) and the **groom-attire hole** (a visible content gap) — then fill wiring and breadth.

> **🟢 Shipped 2026-06-28 (PR #2319).** The minimum-launchable track (P1+P2+P3) plus P4 (mahr — as a budget card + the inline editor; dress-code reuses the existing `dress_code_config` editor) and P5 (imam auto-resolve + PD 1083 comment) all landed. Data live on prod (Nikah guest roles, `mahr_description`/`gender_separation`/singleton indexes, 4 groom-attire leaves). **Two things remain owner-gated:** P0 (the §17 sign-offs + an NCMF-registered imam content review) and flipping the `muslim` faith from `coming_soon` → `active` in `/admin/wedding-types`. P6/P7/P8 remain queued.

---

## At-a-glance order

| Phase | Theme | Gaps | Type | Status |
|---|---|---|---|---|
| **P0** | Decisions + imam review | §17, G7 | Owner / content | ⛔ **Owner gate** (sign-offs + imam review) |
| **P1** | Groom-side Muslim attire seeding | G1 | Vendor/taxonomy seed | ✅ Shipped (#2319) |
| **P2** | Nikah roles + ceremony record (data) | G2a | Migration + types | ✅ Shipped (#2319) |
| **P3** | "Five Essentials of your Nikah" card | G2b | Build (couple UI) | ✅ Shipped (#2319) |
| **P4** | Mahr budget card + editor; dress-code reuse | G2c, G8 | Build (couple UI) | ✅ Shipped (#2319) |
| **P5** | Imam auto-resolve + civil-registrar comment | G3, G6 | Wiring | ✅ Shipped (#2319) |
| **P6** | Gender-separation seating mode | G9 | Build (seating) | 🟡 Queued (`gender_separation` stored; seat reflow unbuilt) |
| **P7** | Walima specialist + venue seeding | G4, G5 | Vendor/venue seed | 🟡 Queued (rolling) |
| **P8** | Pickers read `faith_vocab` (de-hardcode) | G10 | Refactor | 🟡 Queued (separate workstream) |

> P1 and P7 (seeding) can run **in parallel** with the code phases — they touch the vendor catalog, not the app code path. P2→P3→P4 are a strict chain (data before UI). P8 is a standalone strategic refactor that should NOT block the Muslim launch.
>
> **Implementation notes vs. the original plan:** P4's mahr is a couple-set free-text gift (`mahr_description`) shown as a distinct non-billable card on the Budget page (not a peso budget-leaf — a symbolic mahr has no amount), and the dress-code/modesty note reuses the existing `dress_code_config` editor rather than a new column. P6's `gender_separation` column + the couple's choice are stored and surfaced, but the actual seating-section reflow is deferred. The Nikah roles route via a ceremony-aware `resolveRoleSetKeyForEvent` chokepoint (Option A from §G-notes) — `WEDDING_ROLE_SET` stays byte-identical.

---

## P0 — Decisions + imam review *(gate — do first)*

**Why first:** several downstream phases encode a contested ruling (gender-sep default, witness gender, mahr handling). Locking §17 now prevents rework. And the religious chunks (§18, already seeded into [`01_Filipino_Cultural_Reference.md`](18_Concierge_Brain/01_Filipino_Cultural_Reference.md)) carry a *pending imam review* flag — clearing it is a launch gate, mirroring how Catholic content cites the CBCP handbook.

**Tasks**
- Owner confirms the 6 decisions in spec §17 (witness gender, wali default, gender-sep default `none`, mahr never-processed, no auto-civil, imam-review requirement).
- Source an **NCMF-registered imam / qadi** to review spec §§2–10 + the 3 Concierge chunks. On sign-off, flip the "pending imam review" flags to "verified · [reviewer] · [date]".

**Done when:** §17 answered + the 3 Concierge chunks' `Last verified` lines name a reviewer.

---

## P1 — Groom-side Muslim attire (G1) *(seeding · parallelizable)*

**Why early:** the bride side has 4 attire services (Modest Muslim, Maranao, Tausug, Yakan); the groom side has **zero** beyond generic barong/suit. It's the most *visible* hole the moment a Muslim couple browses attire.

**Tasks** (vendor taxonomy — `Vendor_Taxonomy_V1_Master.md` + catalog seed)
- Add canonical groom-side leaves paralleling the 4 bride leaves:
  - Men's Maranao formal (malong/okir-trimmed)
  - Men's Tausug formal (beadwork)
  - Men's Yakan textile formal
  - Modest Muslim groomwear / thobe-style
- Tag each with `ceremony_type: muslim` comfort + the relevant ethno-cultural sub-type so they surface under the right sub-type filter (§10).
- Mirror the bride-side `refinements` (sample photo per leaf, per the refinements contract).

**Done when:** a `muslim` event with each sub-type surfaces ≥1 groom attire leaf; budget "Modest attire — groom" line (spec §13) has a non-empty vendor pool.

---

## P2 — Nikah roles + ceremony record (G2a) *(data layer — chain root)*

**Why now:** the "Five Essentials" card (P3) and the new guest roles have no schema yet. `guest_role` is a **closed Postgres ENUM** mirrored by the `GuestRole` union in `apps/web/lib/guests.ts` (compile-time exhaustive via `Record<GuestRole,…>`), so new roles are a migration + a coordinated type edit — not a runtime add.

**The architectural fork (decide in this phase):** role sets today resolve by **event type** (`resolveRoleSet(profile.roleSetKey)` → wedding / simple) in `apps/web/lib/role-sets.ts`, **not** by `ceremony_type` *within* a wedding. The Muslim roles (`wali`, `witness_1/2`, `imam`) shouldn't clutter a Catholic wedding's picker. Two options:

- **Option A (recommended): ceremony-aware offered-roles filter.** Keep one `WEDDING_ROLE_SET`, add the Muslim roles to it, and filter `offeredRoles` by `events.ceremony_type` at the picker layer (Catholic-only sponsor roles hide for Muslim; wali/witness hide for non-Muslim). Smallest blast radius; reuses the existing tier machinery. The Catholic candle/veil/cord/coin sponsors already in `WEDDING_OFFERED` get the same treatment — a clean, symmetric win.
- **Option B: distinct role-set keys per ceremony.** A `wedding_muslim` RoleSet. More faithful to the 0053 abstraction but duplicates tier literals and risks the drift `role-sets.ts` was built to kill.

> Recommendation: **Option A.** It generalizes to *every* faith (the spec's §11 suppression rule and the audit's hard-coded-picker pain both want ceremony-aware offering), and it's the natural seam P8 later moves onto `faith_vocab`.

**Tasks**
- Migration: extend `guest_role` enum with `wali`, `witness`, `imam` (+ optional `wakil`). RLS unaffected (guest rows already governed).
- Update `GuestRole` union + the `Record<GuestRole,…>` maps in `lib/guests.ts` / `lib/role-groups.ts` (compile will force every site).
- Add the roles to `WEDDING_OFFERED` + singleton set (`wali`, `imam` are singletons; two `witness` allowed), and add the **ceremony-aware `offeredRoles` filter** (Option A).
- Migration: ceremony-record fields on `events` for `muslim` — `mahr_description`, `mahr_prompt_deferred`, `gender_separation ∈ {none,sections,separate_spaces}` (default `none`). (Wali/witnesses are guest rows, not event columns.)

**Done when:** a `muslim` event's add-guest picker offers wali/witness/imam and hides Catholic sponsor roles; non-Muslim weddings are byte-identical (seating.test.ts green).

---

## P3 — "Five Essentials of your Nikah" card (G2b) *(the signature surface)*

**Why this is the centerpiece:** it converts five abstract religious requirements into one tangible, reassuring checklist — the single artifact that makes a Muslim couple feel the platform *understands their wedding*. Free, part of the core couple tool (never paywalled, per the seat-plan precedent).

**Tasks** (couple dashboard, `muslim` events only)
- A card with five ticks, each reading live state:
  1. **Consent** — informational (ticks when ceremony date set / acknowledged).
  2. **Wali confirmed** — ticks when a `wali` guest exists.
  3. **Two witnesses** — ticks when ≥2 `witness` guests exist.
  4. **Mahr set** — ticks when `mahr_description` non-empty.
  5. **Imam / qadi booked** — ticks when an imam is booked (vendor) or an `imam` guest is recorded.
- Each unchecked item deep-links to its fix (add wali → guest list; set mahr → ceremony record; book imam → marketplace).
- Surfaces in the Muslim event's planning hub; suppressed for non-Muslim tracks.

**Done when:** all five ticks reflect real data and each empty state routes to the right action.

---

## P4 — Mahr budget line + guest dress-code field (G2c, G8) *(couple polish)*

**Tasks**
- **Mahr budget line** — pre-fill on `muslim` events, rendered **visually distinct** as a *gift to the bride*, NOT a Setnayan/vendor charge (spec §5 guardrail). Reads `mahr_description`.
- **Dress-code / modesty field** — optional field on the invitation + day-of guest card (0031), default editable copy from spec §7. Small surface, high respect value.

**Done when:** mahr appears as a non-billable gift line; the dress-code note renders on the guest-facing landing/day-of card when set.

---

## P5 — Imam auto-resolve + civil-registrar comment (G3, G6) *(wiring)*

**Tasks**
- **Imam auto-resolve:** when a `muslim` event selects a mosque venue, surface a `muslim_imam` officiant suggestion — parity with the Catholic/Civil/INC auto-resolve that Muslim currently lacks. Feeds Five-Essentials tick #5.
- **Document the `civil_registrar` exclusion:** add a code comment / admin note citing **PD 1083** where `muslim` is excluded from the `civil_registrar` venue group, so it's never "fixed" as a bug (spec §1).

**Done when:** picking a mosque surfaces an imam; the exclusion carries an inline rationale.

---

## P6 — Gender-separation seating mode (G9) *(seating · optional V1)*

**Tasks** (seating editor, gated on `events.gender_separation` from P2)
- `sections` → men's/women's section split with separate role-tier rings; QR/print pack groups accordingly.
- `separate_spaces` → two linked sub-layouts + a dual-flow note in the coordinator brief.
- `none` (default) → unchanged.
- Neutral copy, zero editorializing (spec §9 locked tone).

**Done when:** toggling the mode reflows the chart and the print pack respects the grouping.

---

## P7 — Walima specialist + BARMM venue seeding (G4, G5) *(seeding · rolling)*

**Tasks**
- **Walima specialist** leaf distinct from general halal caterers (feast-specific menu guidance).
- **Venue seeding:** BARMM-first mosque + Muslim-friendly reception venues (current pool ≈ 3 — bare minimum). Rolling supply work; tracks alongside general venue expansion.

**Done when:** the Muslim venue pool clears single digits in BARMM regions; a walima-specialist leaf exists.

---

## P8 — Pickers read `faith_vocab` (G10) *(strategic refactor — do NOT block Muslim launch)*

**Why separate:** the audit found faith is hard-coded across ~17 TS sites (`FAITH_CHIPS`, `ALLOWED_CEREMONIES`, `CEREMONY_TYPE_OPTIONS`, `RELIGION_LABEL`, …) while `faith_vocab` / `event_type_vocab` are read only by `/admin/taxonomy`. This is the real blocker for adding a *10th* faith and the source of Muslim-vs-other inconsistency — but it's a cross-cutting refactor, not a Muslim deliverable. **Ship Muslim on the existing hard-coded path (P1–P7); schedule P8 as its own workstream** so it doesn't gate this launch. Option A in P2 deliberately creates the ceremony-aware seam P8 later moves onto the DB.

**Done when:** couple-facing pickers resolve faith from `faith_vocab`; adding a faith is an admin row, not a 17-file edit. (Tracked under [[project_setnayan_taxonomy_unification_event_faith]].)

---

## Critical path to "Muslim track is launchable"

```
P0 (decisions + imam) ─┬─→ P2 (data) → P3 (Five Essentials) → P4 (mahr + dress) → P5 (imam auto-resolve)
                       └─→ P1 (groom attire)  ── parallel ──  P7 (walima + venues)
                                                                 P6 (gender-sep)  ── optional V1
                                                                 P8 (faith_vocab) ── separate workstream
```

**Minimum launchable Muslim track = P0 + P1 + P2 + P3** (decisions cleared, groom attire seeded, roles/data shipped, Five-Essentials card live). P4–P7 are fast-follows; P8 is decoupled.

---

## Change log

| Date | Change |
|---|---|
| 2026-06-28 | Initial plan — sequenced G1–G10 into P0–P8; flagged the ceremony-aware-role-offering fork (Option A recommended) grounded in `apps/web/lib/role-sets.ts`; set the P0+P1+P2+P3 minimum-launchable path. |
