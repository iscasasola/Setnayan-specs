# Smart Seat-Plan — Guest-Reactive Extensions (Phases 5–6 + pax pool + account auto-surface)

> **Definitive build plan · 2026-07-08.** Extends the existing **Smart Seat-Plan program (Phases 1–4, shipped)** with the guest-reactive layer the owner asked for: "smart seat planning depending on the guest." Grounded against `origin/main` (clone 2026-07-08). Companion audit: [`../0001_creating_guest_list/0001_Guest_Spec_vs_Shipped_Audit_2026-07-08.md`](../0001_creating_guest_list/0001_Guest_Spec_vs_Shipped_Audit_2026-07-08.md).

## Why this doc exists

The guest list and seat plan are joined by `event_seat_assignments (guest_id ↔ table_id, UNIQUE(event,guest))`, but the connection is **one-way and only automatic on removal** (hard-delete → FK cascade, soft-delete → app releases, RSVP=declined → DB trigger frees). Assignment itself is **explicit** (Auto-Arrange or drag). The owner's 8-point model wants the **forward edge**: the seat plan should *react* to the guest list.

## Owner decisions locked (2026-07-08)

| # | Decision | Chosen |
|---|---|---|
| A | Auto-seat behavior on add / re-role | **Live provisional seat** — every non-declined guest instantly gets a provisional (`locked=false`) seat; role/group change re-tiers auto seats; couple can lock a seat or the whole plan to freeze auto-moves. |
| B | Pax counting | **Add an "unassigned pax" pool** — `unassigned = max(0, target − listed_non_declined)`, shown beside the existing attending meter. Pricing + `final_pax` stay on `attending` (owner-locked `headcount_basis` **not** reversed). |
| C | Existing-account guest → event visibility | **Auto-surface + opt-out (inclusion is the default).** On identity/email match the event is **sent to the guest's account regardless of whether they've accepted**, and stays there **until they explicitly say no** (decline/leave) — only an explicit "no" removes it. Notice + one-tap "leave/decline." **Counsel-gated** (RA 10173) before flag-on. _(Refined 2026-07-08: owner "the event will be sent whether they accept or not; only if they say no is it not included.")_ |

## The model → where each point lands

| # | Owner intent | Today | This plan |
|---|---|---|---|
| 1 | Onboarding sets starting pax → X initial *unassigned* | `estimated_pax` = pricing floor only; no pool | **Pax pool** — at create, `listed=0` ⇒ `unassigned=target` |
| 2 | Listing a guest fills the unassigned pax | live `COUNT(attending)` vs target | **Pax pool** derived from `listed`; attending meter kept separate |
| 3 | Creating a guest auto-creates a seat | ❌ unseated until Auto-Arrange | **Phase 5** live provisional placement on every couple-side insert |
| 4 | Role assignment → new seat | ❌ role write only | **Phase 5** re-tier `locked=false` seats on role/group/priority/±1 change |
| 5 | +1 listed + always grouped to its guest | ✅ first-class row; seating pins +1 to primary | **kept** — Phase 5 placement keeps the invariant |
| 6 | Seat even if not RSVP-confirmed | ✅ pending/maybe held; only declined excluded | **kept** — provisional model is exactly this |
| 7 | Every guest gets a QR; account → event auto-appears | 7a ✅ `qr_token`; 7b ❌ explicit join only | 7a kept; **7b = Account auto-surface**, inclusion-by-default until explicit "no" (decision C) |
| 8 | Group overflow → tables stick adjacent | ❌ overflow = next-nearest-to-*stage*, no adjacency | **Phase 6** coordinate adjacency using `x_pos`/`y_pos` |
| 9 | Join a group → prioritized to sit *with* that group | ⚠ Auto-Arrange clusters groups, but joining/changing a group never re-seats | **Phase 5** — `group_id` change re-places the guest with their group (made explicit below) |

## Foundation we build on (Phases 1–4, shipped — do NOT rebuild)

- **P1** `groupTablesIntoUnits` — combined table units.
- **P2** draggable seating-priority tier order (`seating_priority` 1–4 + `priority_order`).
- **P3** keep-apart solver (`event_seating_constraints`, `kind='keep_apart'`, `solveSeatPlan`).
- **P4** lock-and-fill — `event_seat_assignments.locked BOOLEAN`; solver pins locked seats and fills around them; `relaxLowestPriorityRule` explainability.
- Removal sync: `free_seat_on_decline()` trigger; FK cascade; soft-delete seat release.
- `event_tables.x_pos/y_pos` (NUMERIC, nullable) — canvas coordinates for adjacency.

All new work reuses `computeAutoSeat` / `solveSeatPlan` — it never forks the algorithm.

---

## Phase 5 — Live provisional seating (points #3, #4, #5, #6)

**Model:** a seat is **provisional** when `locked=false` (auto-placed, auto-movable) and **pinned** when `locked=true` (Phase 4). Every non-declined guest should always hold a provisional seat if capacity exists.

**Core:** `reconcileProvisionalSeats(eventId)` in `lib/seating.ts` —
1. Never touches `locked=true` seats or seats that still satisfy the guest's current tier/group.
2. Seats any **unseated, non-declined** guest into the best open seat via the existing tier/cluster logic (respects P3 keep-apart, P2 tier order, +1-pinned-to-primary).
3. Re-tiers a `locked=false` guest whose `role`/`group_id`/`seating_priority`/`plus_one_of_guest_id` **materially changed** (moves them only if their current table no longer fits their tier/group).
   - **Group-join is a first-class case (point #9):** when a guest is added to / moved between a custom group (`group_id` change), reconcile prioritizes seating them **with their group** — onto the group's anchor table if it has room, else the nearest adjacent table (Phase 6). Existing Auto-Arrange already clusters group members; this makes the *reaction to joining a group* automatic instead of requiring a manual re-arrange. A `locked=true` seat is never moved (an explicit pin overrides group-togetherness).
4. If no capacity, leaves the guest unseated and returns a `needs_table` signal → UI prompts "Add a table."
5. Idempotent + incremental (gap-fill, not full reshuffle) so a 300-guest list doesn't churn on every edit.

**Wiring (couple-side write paths):** call reconcile (debounced, event-scoped) after `createGuest`, `quickAddGuest`, `bulkAddGuests`, CSV `importGuestsCsv`, wizard/onboarding guest inserts, and `updateGuest`/`bulkApplyRoleAndGroup` when a seating-relevant field changed. Also on approve in `claims` (self-join). Removal already covered by the decline trigger + cascade.

**Controls:** `events.seating_autoplace_enabled BOOLEAN DEFAULT TRUE` (couple can switch live auto-seat off) and a "Lock plan" action that sets all current seats `locked=true`. UI: a "provisional" badge on `locked=false` seats; "N guests need a table" banner.

**Schema:** none required beyond the two `events` flags above (`seating_autoplace_enabled`, optional `seating_locked_at`). `locked` already exists. Optional `event_seat_assignments.placed_by TEXT CHECK IN ('auto','manual')` for the badge (default `'auto'`).

## Phase 6 — Group-overflow adjacency (point #8)

**Problem:** when a custom group/household exceeds one table's capacity, overflow currently lands on the next table *by distance to stage* — can be across the room.

**Fix:** in `computeAutoSeat`/`groupTablesIntoUnits`, when a group overflows its anchor table, place overflow on tables sorted by **Euclidean distance to the anchor table** using `x_pos`/`y_pos`, preferring least-full/empty neighbours, so the group occupies a **contiguous cluster**.
- **Fallback when coords are null** (tables not hand-placed): fall back to `sort_order` adjacency, then today's stage-distance order. Never worse than current behavior.
- Integrate with the existing manual **linked-tables** feature (`link_group_id`, migration `20261121000000`) — a couple-declared linked set is treated as a guaranteed adjacency cluster; auto-adjacency only fills the unmanaged case.
- Respect P4 locks (never evict a pinned seat to satisfy adjacency) and P3 keep-apart.
- Ship behind a per-event toggle `events.seating_group_adjacency BOOLEAN DEFAULT TRUE` so couples used to the old output can revert.

**Schema:** none (coords + `link_group_id` exist); one `events` toggle.

## Pax "unassigned" pool (points #1, #2)

**Derived, no stored pool** (avoids drift): 
- `target = events.estimated_pax` (onboarding floor — unchanged).
- `listed = COUNT(guests WHERE deleted_at IS NULL AND rsvp_status <> 'declined')`.
- `unassigned = max(0, target − listed)`; `over = max(0, listed − target)`.
- `attending` count + `final_pax` stay exactly as-is (pricing/lock untouched).

**UI:** on the guest list + seating header, show the pool "**{unassigned} unassigned · {listed} of {target} placed**" that fills as guests are listed, distinct from the attending progress bar. At event create, `listed=0` ⇒ pool = full target (satisfies #1). Extend `computePaxProgress` in `lib/guests.ts` to return the pool numbers.

**Schema:** none.

## Account auto-surface + opt-out (point #7b) — counsel-gated

**Inclusion is the default (owner-refined 2026-07-08):** the event is sent to the matched account **regardless of whether the guest has accepted**, and stays there **until the guest explicitly says no** — only an explicit "no" removes it. On inserting a couple-side guest whose `person_id` resolves to an **already-claimed account** (person-spine), create an `event_members` row (`member_type='guest'`, `joined_via='auto_surfaced'`) so the event appears in that account's picker — **with consent guardrails**:
- Insert `auto_surfaced=TRUE` + fire a notification ("You were added to {couple}'s event").
- Guest's picker shows the event with a "you were added" badge. It **stays** until an explicit **"no"** — where "no" = the guest **declines the RSVP** *or* taps **Leave/Hide** (`hidden_at` set) — either of which removes it from their account list; a non-response never removes it.
- Until the guest engages, expose only the event **card** (couple names + date), not full guest data.
- **Behind `FEATURE_ACCOUNT_AUTOSURFACE` flag, default OFF, pending external PH counsel review** (RA 10173 lawful-basis + notice). Inclusion-by-default is precisely the counsel-sensitive part. This is the one item that must not ship without sign-off.

**Schema:** `event_members.auto_surfaced BOOLEAN DEFAULT FALSE`, `event_members.hidden_at TIMESTAMPTZ`; extend the person-spine link path (`link_guest_to_account_person`) to create the membership row (today it only reacts to an existing one).

---

## PR sequence (each an independent, auto-mergeable PR in the code repo)

| PR | Scope | Depends on |
|---|---|---|
| **S1** | Pax "unassigned" pool — derived numbers + UI (points #1/#2). Smallest, zero schema, zero seating risk. | — |
| **S2** | Phase 5 core — `reconcileProvisionalSeats()` + unit tests (no wiring yet). | P1–4 |
| **S3** | Phase 5 wiring — call reconcile from all couple-side guest write paths + `seating_autoplace_enabled` flag + provisional badge + "needs a table" banner (points #3/#4/#5/#6). | S2 |
| **S4** | Phase 6 — coordinate-adjacency overflow + `seating_group_adjacency` toggle + linked-tables integration (point #8). | S2 |
| **S5** | Account auto-surface + opt-out, behind `FEATURE_ACCOUNT_AUTOSURFACE` (OFF) — **blocked on counsel** (point #7b). | — |

Recommended order S1 → S2 → S3 → S4 → S5. S1 ships value immediately; S5 waits on legal.

## Flags for owner sign-off (surfaced per the corpus rule)

1. **#7b consent (S5)** — auto-attaching an event to someone's account is RA 10173-sensitive; ships flag-off, counsel-gated. Confirm the external-counsel gate.
2. **#8 adjacency (S4)** changes Auto-Arrange output couples may be used to → shipped behind a default-on toggle they can revert.
3. **Performance** — reconcile runs on guest writes; it's incremental + debounced, but for 300+ guest lists confirm we accept a short async placement (badge shows "placing…").
4. **Pricing untouched** — S1 explicitly keeps `estimated_pax`/`final_pax`/`attending` as the pricing basis; the pool is display-only. Confirm that's the intent (vs. making the pool authoritative).

## Shipped PRs (2026-07-08 → 07-09)

Core: **S1 #2907** pax pool · **S2 #2908** reconcile engine · **S3 #2909** wired into 10 guest writes · **S4 #2910** adjacency · **S5 #2912** account auto-surface (flag-off) · **S6 #2913** autoplace toggle + shortfall banner.
Post-ship gap cleanup (from the 2026-07-08 self-audit): **S7 #2920** reconcile-coverage G1/G2/G4 (addTable · public-RSVP · toggle-on back-fill) · **S8 #2922** S5 completeness G5/G6 (Leave affordance + RA-10173 notice mechanism, still flag-off) · **S9 #2923** G8 per-event adjacency opt-out toggle.

## Verification runbook (gap G7 — needs the owner's live Supabase)

The pure functions are unit-tested (pax 12 · reconcile 6 · seating 31) and every PR
passed typecheck + lint + CI production build. What was **NOT** exercised: the
migrations against a live DB, the DB triggers, and the fetch→reconcile→persist glue
end-to-end. Run these against staging/prod to close G7:

1. **Migrations applied — ✅ VERIFIED IN PROD 2026-07-09** (read-only DB query):
   `events.seating_autoplace_enabled` · `events.seating_group_adjacency` ·
   `event_members.auto_surfaced` · `event_members.hidden_at` · triggers
   `guests_hide_autosurfaced_on_decline` + `guests_free_seat_on_decline` · enum
   `notification_type.event_auto_surfaced` — all present. Flag-off invariant holds
   (**0** `auto_surfaced` rows). Steps 2–6 below still need an authenticated app
   session to drive; step 7 (S5) is gated on counsel — see
   [`Account_Autosurface_Counsel_Brief_2026-07-09.md`](Account_Autosurface_Counsel_Brief_2026-07-09.md).
2. **Auto-seat on add (#3):** on an event with ≥1 table, add a guest → a row appears
   in `event_seat_assignments` for them. Add past capacity → the "not enough seats"
   banner shows; add a table → the waiting guest gets seated (G1).
3. **Re-tier on role change (#4/#9):** change a seated guest's role/group → they move
   to the right tier/table; a **locked** seat never moves.
4. **Public RSVP (G2):** confirm attending from `/[slug]` on an unseated guest → seated;
   decline → seat freed by the `free_seat_on_decline` trigger.
5. **Toggle (G4/G8):** flip "Auto-seating" off → adds don't seat; on → back-fills.
   Flip "Keep groups together" off → a group's overflow uses stage order.
6. **Pax pool (#1/#2):** a fresh event shows `unassigned = estimated_pax`; listing
   guests fills it; pricing/`final_pax` unchanged.
7. **Account auto-surface (#7b) stays OFF** — verify no `event_members.auto_surfaced`
   rows exist with `FEATURE_ACCOUNT_AUTOSURFACE` unset (it must stay off until counsel).

## Not built — with rationale

- **G9 provisional-seat badge — intentionally skipped.** Every unlocked seat is
  "provisional," and the editor already marks *locked* seats, so a per-seat badge is
  redundant noise on the 2900-line editor. The header "Auto-seating On/Off" pill +
  the shortfall banner carry the signal more cleanly.
- **G10 reconcile debounce — verified a non-issue.** Bulk paths reconcile once;
  interactive quick-adds are human-paced (one request each), so there's no hot loop.

## Provenance

Plan grounded 2026-07-08 against a shallow `origin/main` clone. Existing Smart Seat-Plan phases read from migration comments (`20270210578106`, `20270210882937`, `20270211861238`, `20270212992703`) + `lib/seating.ts`. Table coords confirmed in `20260513090000_iteration_0008_seating.sql` (`x_pos`/`y_pos`).
