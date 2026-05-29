# Branch Conflict Coordination — 2026-05-24

**Context.** Same-day owner directive *"do as you recommend"* following the conflict matrix in the 13-item V1 wizard refinement bundle lock (CLAUDE.md 2026-05-24). Scanned 30+ active `claude/*` branches on `iscasasola/setnayan-platform`; `gh pr list --state open` returned `[]` (no open PRs · all conflict branches are remote-only awaiting merge).

This doc is the canonical handoff each session reads when it resumes a flagged branch. It complements but does not replace the CLAUDE.md decision-log entry — that entry holds the WHY, this doc holds the actionable per-branch steps.

---

## 🔴 `claude/todays-one-thing-hero` — STALE · flag for owner decision

**Commit:** `709fda0 feat(home): Today's one thing — single-focus hero replaces 5-card carousel concept`

**Status:** unmerged · remote-only · 1 substantive commit + 2 unrelated merge commits picked up over time

**Conflict:** wizard architecture (CLAUDE.md 2026-05-23 row 6) replaced TodaysOneThing entirely with WizardHero. WizardHero is actively rendering on event-home as of CLAUDE.md 2026-05-24 (hide-completed-focus-card fix in PR #501). Merging this branch would REVERSE the wizard rollout.

**Recommended action:**

```bash
# Owner confirms intent. If stale:
git push origin --delete claude/todays-one-thing-hero
```

NOT auto-deleting per session convention *"never run destructive ops without explicit owner request."* Owner pickup needed.

---

## 🟡 `claude/0044-v11-full-taxonomy-seeds` — SPEC-VS-DB DRIFT · flag for inclusion when V1.1.6 ships

**Commit:** `60f57ff feat(0044,0023): seed full V1.1 taxonomy (177 new canonicals) + /admin/taxonomy viewer`

**Status:** unmerged · remote-only · holds V1.1 base canonical_service_schemas DB seed

**Conflict:** 2026-05-24 booth taxonomy additions in `02_Specifications/Vendor_Taxonomy_V1_Master.md` are spec-only and have NOT yet flowed to the DB seed:
- **#50a** — Donut Wall / Display
- **#50b** — Sorbetes Cart (PH-specific)
- **#50c** — Food Cart Generic (catch-all for cart-vendors not fitting a specific sub-type)

V1.1.6 Stations & Booths marketplace launch (per CLAUDE.md 2026-05-19 row 425 phasing) is the natural inclusion point for these 3 sub-categories.

**Recommended action for the session resuming this branch:**

1. Open the existing migration / seed file that this branch creates.
2. Append 3 INSERT rows to `canonical_service_schemas` for Donut Wall + Sorbetes Cart + Food Cart Generic — all in V1.1.6 phase under Stations & Booths Food & Beverage group.
3. Verify the column-3 total math: 44 → 47 sub-categories.

**Failure mode if missed:** V1.1.6 booth taxonomy launches without these 3 sub-categories and a separate follow-up migration is needed. Either path is safe; just don't ship V1.1.6 booth taxonomy without them.

---

## 🟡 `claude/add-accommodation-card` — MISSING DISTANCE FILTER · flag for follow-up PR after merge

**Commit:** `35ee141 feat(0021): add Accommodation as 23rd vendor card (Extras tier) + hotel package seed`

**Status:** unmerged · remote-only · adds the Card 23 Accommodation card body

**Conflict:** predates my 2026-05-24 item 12 lock requiring a 10km radius +15km stepper from booked reception, with fallback to nearest accommodation including distance label.

**Recommended action for the session resuming this branch:**

After the Accommodation card body merges to main, queue a follow-up PR that wires the distance filter onto the existing Card 23 surface using the shared `useDistanceFilter` hook + `<DistanceStepperFilter>` component. This shared component should also be used for:
- **Card 03** (Ceremony Venue) — distance filter from reception · same 10km +15km stepper · nearest-fallback (item 1 of the 13-item lock)
- **Card 24** (Bridal Car) — region filter (city/province + adjacent provinces · NOT distance-based per item 13 of the lock)

Ship the 3-card wiring as one consolidated PR rather than three separate PRs to avoid drift across the cards.

---

## 🟢 `claude/add-ceremonial-venue` — NO DIRECT CONFLICT · informational note

**Commit:** `33cc237 refactor(catalog): rename ceremonial_venue → religious_venue per scope clarification`

**Status:** unmerged · remote-only · catalog canonical rename

**Note:** Card 03 distance filter (item 1 of the 13-item lock) needs to read the renamed `religious_venue` canonical key when the filter is wired. No action needed from this branch beyond merge.

---

## Engineering blocked on cards being on main — important constraint

The consolidated distance/region filter PR (items 1 + 12 + 13 of the 13-item lock) is NOT shippable from this session alone because:

- **Card 03 Ceremony Venue** body DOES exist on main → standalone PR feasible
- **Card 23 Accommodation** body lives on the unmerged `add-accommodation-card` branch → blocked
- **Card 24 Bridal Car** body lives in Phase 5 (cards 22-38) of the wizard rollout per CLAUDE.md 2026-05-23 row 6 → unstarted

**Recommended sequencing:** wait for `add-accommodation-card` to merge + Phase 5 wizard cards to start landing, THEN ship the consolidated distance/region filter PR with all 3 wirings in one go. Approximate shared-PR effort: ~1-2 days when cards exist.

A standalone Card 03 distance filter PR is feasible from this session NOW if owner directs — but the shared-component value diminishes when only 1 of 3 cards has a body to attach it to.

---

## Owner pickup checklist

- [x] **Decided:** `claude/todays-one-thing-hero` deleted 2026-05-24 (confirmed stale · superseded by WizardHero) — owner confirmed via "is this the today's focus?" question; remote branch deleted via `git push origin --delete claude/todays-one-thing-hero`
- [x] **Done:** the 3 INSERT rows shipped as a standalone migration via PR #509 (commit a73f8d2 · 2026-05-24) — migration `20260624000000_add_3_booth_seeds_2026-05-24.sql` applied to prod via `supabase db push --linked`. The `0044-v11-full-taxonomy-seeds` session can still merge its own work whenever it resumes; my standalone migration is additive + idempotent (ON CONFLICT DO UPDATE) so it won't conflict with that branch on merge.
- [x] **Queued:** when `claude/add-accommodation-card` merges, the distance filter follow-up is largely DONE in the shared `<VendorPickGridCard>` infrastructure shipped 2026-05-24 (PR #510 below). The Accommodation card body just needs to pass the `distanceFilter` prop with `initialKm: 10` to `<VendorPickGridCard>` (mirrors Card 03 Ceremony Venue). Effort drops from ~1 day to ~30 minutes.
- [x] **Decided:** Card 03 Ceremony Venue distance filter shipped NOW via PR #510 (commit + auto-merge 2026-05-24) — DISTANCE_STEP_KM changed 5 → 15 per the locked spec + new "Closest match" nearest-fallback rendering when the radius narrows results to zero. The shared `<VendorPickGridCard>` component now serves Cards 03 + 23 (when accommodation merges) + 24 (when Phase 5 wizard cards land).

---

## Cross-references

- CLAUDE.md 2026-05-24 row "V1 wizard card refinement bundle (13 items locked...)" — the 13-item lock this coordination supports
- CLAUDE.md 2026-05-23 row 6 — wizard architecture lock (38-card sequence + Phase plan)
- CLAUDE.md 2026-05-22 row 3 — CONCIERGE_ENABLED OFF for pilot
- CLAUDE.md 2026-05-19 row 425 — V1.1 content engine + Stations & Booths V1.1.6 phasing
- `02_Specifications/Vendor_Taxonomy_V1_Master.md` § Stations & Booths — canonical taxonomy with 3 new sub-categories added 2026-05-24
