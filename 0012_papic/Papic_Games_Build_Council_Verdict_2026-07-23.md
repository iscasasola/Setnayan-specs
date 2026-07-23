<!-- Council-produced (5 ground + 3 design + 5 red-team + 1 chair, 14 agents, 39 findings / 8 blockers / 13 high), 2026-07-23. Baseline origin/main @ 796d8f167. Drives the §9 build. Owner sign-offs open (§4). -->

# COUNCIL VERDICT — Papic Challenges §9: 40-Library + 20-Slot 3-Lane Resolver

**Feature:** `NEXT_PUBLIC_PAPIC_GAMES_V1` · Papic Games §9 (spec `Papic_Games_and_Vendor_Missions_Spec_2026-07-21.md` §9)
**Repo baseline:** `/Users/icecasasola/setnayan-council-read` @ origin/main `796d8f167`
**Status:** BUILD-READY with 5 owner sign-offs (one blocks seed *values* only, not machinery)

> Three load-bearing facts the council confirmed against the real schema: (1) `source` is a CHECK
> constraint `('auto','couple','vendor')` — an additive rebuild, not a pg-enum drop; (2)
> `papic_mission_completions.mission_id … ON DELETE CASCADE` — **deleting a mission wipes guest
> completions**, so the "delete-each-call" resolver was a hard blocker (REJECTED); (3)
> `papic_guest_missions` has a fixed 7-column `RETURNS TABLE` granted `TO authenticated, anon` —
> widening it needs **DROP+CREATE**, not `CREATE OR REPLACE`, and must re-grant + carry the v3 role guard.

---

## 1. RESOLVED DESIGN

**Data model — new catalog table + additive `papic_missions` extension.** A **`papic_challenge_library`**
table holds the 40 canonical prompts as global seed rows (NOT 40×N per-event copies —
`papic_missions.event_id` is `NOT NULL ON DELETE CASCADE`, and a catalog makes the PROVISIONAL §9.4
rank a 10-row `UPDATE`). `papic_missions` is **extended, never parallel-tabled**: nullable additive
`library_id`, `capture_kind`, `board_slot`; a `source` CHECK rebuilt to the 4-value superset
`('auto','couple','vendor','setnayan')` (CHECK, not enum → drop-and-re-add-superset is safe, honors
never-rename); and **TWO source-scoped partial unique indexes** — `WHERE source='couple'` and
`WHERE source='setnayan'` — NOT a single cross-lane unique (which would make a couple's pick of an
already-materialized Setnayan hero throw `23505` and block curation). Duplicate resolves at **read
time, couple wins**.

**Resolver — materialize-once, NEVER delete (the load-bearing decision, 3 blockers).** Setnayan fills
are `INSERT … ON CONFLICT (event_id, library_id) WHERE source='setnayan' DO NOTHING` — materialized
once, never deleted. **De-selection is `board_slot = NULL`, never a row delete** (the cascade trap).
`ensure_papic_board(event_id)` (SECURITY DEFINER, `SET search_path=public`, advisory-xact-lock, auth
guard cloned from `ensure_papic_auto_missions`) writes `board_slot 1..20`; the guest reader is a **dumb
`ORDER BY board_slot`** — one authoritative selector, no drift. The TS `resolveChallengeBoard` is
**test/preview only, non-authoritative.**

**Deterministic fill (all ties broken by `created_at, id`):**
1. **Couple lane** → first `min(count,10)` live `source='couple'` rows → slots 1..10; library-linked picks mark `library_id` taken.
2. **Vendor lane** → first `min(count,5)` live vendor-lane rows, **paid `source='vendor'` (approved) FIRST, then `source='auto'` booth** → slots 11..15; only currently-booked vendors (join `event_vendors.status` at selection); overflow → `board_slot=NULL`. *(A free booth must never evict a ₱400-paid slot.)*
3. **Setnayan lane** → `target = 20 − LEAST(couple,10) − LEAST(vendor,5)` (structurally ≥5 → why Top-5 is guaranteed). Walk `priority_rank 1..10` then `library_order`, skipping taken/inactive/unavailable; `ON CONFLICT DO NOTHING` = DB-level dedup.
4. **Pabati (#5)** availability computed **INSIDE** the resolver (never a caller-supplied boolean); inactive PABATI skips #5, backfills next rank.
5. **Couple-veto** = a hidden (`is_active=false`) Setnayan hero is a **tombstone**: slot-consumed, dedup-blocked, backfill the next distinct ranked item; never resurrected, never deleted.

Targeted roster missions (`target_guest_id NOT NULL`) ride on top, not in the 20.

**Guest reader v4 — DROP+CREATE, fail-soft, carry the v3 role guard, UNION completed-off-board.**
Re-issue `REVOKE … FROM PUBLIC` + `GRANT … TO authenticated, anon`; carry v3's fail-closed
`target_role` filter; `UNION` any completed-off-board mission (a late vendor approval must never
un-finish a guest — render it in a separate "Done" archive so the live board stays ≤20); **fail-soft**
to `created_at` ordering when no board is materialized (the flag is LIVE in prod — a hard
`board_slot IS NOT NULL` filter would blank today's booth missions). **RPC + route + resolver ship as
ONE atomic PR.**

**Pabati — doorway only (§9.5 own-quota lock).** Physically off the Papic pool/capture path (already
true). Add a `capture_kind='pabati'` branch that does NOT render arm/COMMENCE, links to
`/pabati/[eventId]?challenge=<missionId>`, completes via existing `papic_complete_mission` with
`capture_id=NULL`, **Story reward suppressed** (its reward is the gift). Pabati's 5s cap + 300 meter untouched.

**Couple UI + minor-safety at the DB boundary.** Extend the already-mounted
`couple-challenges-manager.tsx` (library picker grouped by 7 categories, ≤10 counter, reuse
create-your-own + hide/delete, add "allow vendors" toggle + Top-5 preview). The §2.2 no-drink-dare
guard MUST be a **`BEFORE INSERT/UPDATE` trigger** on `papic_missions` — couple free-text is an
RLS-direct insert (`FOR ALL TO authenticated`) that can PostgREST past any app-layer guard. TS guard
stays for UX; the lock holds at the DB.

---

## 2. PR-SEQUENCED BUILD PLAN

All migrations via **`pnpm migration:new`** (allocator — never hand-stamp; must allocate strictly after
`20270916200000`). RLS at CREATE TABLE. Shipped migrations superseded via new files, never edited.
Every PR flag-dark (`papicGamesEnabled()`). After each migration merge: **verify + `gh workflow run
supabase-migrations.yml --ref main`**. VERIFY per PR = commit → **adversarial self-review** → PR →
auto-merge armed **only after review passes**.

- **PR-A — Schema + resolver + reader (atomic DB PR).** `papic_challenge_library` + RLS (SELECT `TO
  authenticated` only) + 40 seed rows (`ON CONFLICT (slug) DO NOTHING`; `priority_rank`
  `[1,40,5,2,15,38,4,18,6,22]` with `⚠ PROVISIONAL §9.4` comment; 25 photo/14 clip/1 pabati; no
  `face_verified`); ALTER `papic_missions` (+`library_id`,`capture_kind`,`board_slot`, source CHECK
  rebuild); TWO partial uniques; `events.papic_vendor_challenges_enabled DEFAULT true`; minor-safety
  trigger; `ensure_papic_board`; DROP+CREATE `papic_guest_missions` v4. VERIFY on scratch DB:
  role-targeted mission invisible to non-matching guest; reshuffle never deletes a completion; no
  `CREATE OR REPLACE` on the reader.
- **PR-B — Pure resolver lib + unit tests.** `resolveChallengeBoard` + `challengePromptGuard` in
  `lib/papic-missions.ts` (non-authoritative, test/preview). 13 test cases (T1–T11 + paid-before-booth
  ordering + created_at-tie-by-id + couple-veto-backfill).
- **PR-C — Guest board wiring.** `guest-missions/route.ts` swap `ensureAutoMissions`→`ensurePapicBoard`;
  `lib/papic-games.ts` wrapper (+ delete dead `fetchEventMissions`); `GuestMissionRow` widen;
  `sortGuestMissions`→`[completed, board_slot]`; panel lane badges.
- **PR-D — Pabati doorway.** panel `capture_kind='pabati'` branch; `pabati-prompt.tsx` optional
  `missionId`→complete with `captureId:null`; gate library #5 on `eventPabatiActive` (fail-closed in
  walk AND couple pick).
- **PR-E — Couple curation surface.** `couple-challenges-manager.tsx` picker + ≤10 + allow-vendors
  toggle + Top-5 preview; `studio/papic/actions.ts` (`pickLibraryChallengeAction`,
  `setVendorLaneEnabledAction` scoped **couple+admin, NOT coordinator**; `challengePromptGuard` in create).
- **PR-F — Vendor-lane gate. BLOCKED on owner** (Solo-vs-Pro tier contradiction). Adds allow-vendors
  check + hard 5-paid-slot sell-cap (a 6th ₱400 sponsor refused/queued, never sold an invisible slot).

---

## 3. REUSE MAP (do NOT rebuild)

| Built | Reuse as |
|---|---|
| `papic_missions` + completions + RLS + same-event guard (`20270832487160`) | ALTER target |
| `ensure_papic_auto_missions` advisory-lock+partial-unique idempotent (`20270901331963`) | clone for `ensure_papic_board`; call as step 1 |
| `papic_guest_missions`/`papic_complete_mission`/`papic_set_completion_consent` (`…047075`,`…044875` v3 role guard) | extend reader; complete RPC reused as-is (NULL-safe capture_id) |
| Vendor challenge RPCs + ₱400 SKU + sponsorship (`…380131`,`…628470`,`…359108`) | vendor lane counts these live rows |
| Guest panel arm/commence/retake + consent + Story CTA | reuse wholesale; add lane badges + Pabati branch |
| Couple curation UI (mounted) + create/hide/delete | extend in place |
| Pabati rail (isolated 300 meter, 5s cap) | add a doorway only; do NOT touch meter/cap |
| Migration allocator `scripts/new-migration.mjs` | every migration |

**Dead code to supersede:** `fetchEventMissions` (`lib/papic-games.ts`, zero callers).

---

## 4. OPEN OWNER SIGN-OFFS

1. **§9.4 Top-10 ranking is PROVISIONAL** — blocks the seeded `priority_rank` VALUES only, not the machinery. Ship with the ranking seeded + `⚠ PROVISIONAL` comment; a reorder is a 10-row `UPDATE`.
2. **Pabati-inactive degrades the "guaranteed Top-5"** to Top-4+backfill (Pabati is a paid SKU inactive at ~100% of current events). Recommend (b): the guarantee reads "Top-5 of the shots you've enabled," and the couple Top-5 preview shows the degraded contract.
3. **Solo-vs-Pro vendor tier contradiction** — blocks **PR-F only**. TS + final SQL agree Pro+; corpus/#3515 says Solo. Confirm before touching the gate.
4. **Couple-veto vs Top-5 precedence.** Recommend: **veto wins, resolver backfills the next ranked item** (board stays at 5 distinct heroes, curation respected).
5. **"Allow vendors" default = ON** (spec silent; ON preserves today's behavior), and **off-board vendor missions (>5) stay curatable but invisible to guests** — a change from today's "all live missions surface."

---

## 5. DPO / COUNSEL GATES

- **Minor-safety (§2.2) — build gate, load-bearing.** Couple-authored picks are pre-approved + live-immediately with no human review; the DB trigger is the only enforcement at the RLS-writable boundary. A keyword blocklist does NOT fully satisfy the lock — **owner must accept the residual (obfuscation/euphemism/non-drink dares evade a list) or add a report-and-takedown path.** Do not represent the blocklist as complete.
- **Vendor photo delivery (§4) consent — already correctly built** (`consent_to_share DEFAULT false`, per-photo opt-in, forced false on vendorless). No new SPI flow; the setnayan/couple lanes carry no vendor delivery → no new DPO gate for the board itself. Confirm existing consent copy reads right when a Setnayan-lane (vendorless) completion suppresses the tap.
- **No new biometric/face path** — `face_verified` excluded from the launch 40 (stays gated on dormant `NEXT_PUBLIC_FACE_MODEL_URL`).

---

## 6. RESIDUAL RISKS (unsoftened)

1. **First real execution is at a live wedding** (zero guest captures across 63 events). 40 guests scanning in within a minute all queue on `pg_advisory_xact_lock(event_id)`. **Mitigation required:** materialize the board via a couple-side action (studio open/publish) so the guest path is non-blocking + fail-soft; load-test ~50 concurrent first-opens before the first event.
2. **Flag is LIVE in prod** — any migration/route lockstep slip blanks booth missions that render today. Atomic PR-A + fail-soft reader is the guard; verify the workflow ran before the app deploy every time.
3. **Duplicate via free-text paraphrase (only partially closed).** Dedup keys on `library_id`; a couple typing "Steal a dance" as free text won't mark lib1 taken. Mitigation: normalize+compare custom prompt against the library on insert. Semantic paraphrase remains an accepted residual — owner to acknowledge.
4. **`board_slot` staleness.** A SKU activation (Pabati purchased mid-event) with no subsequent edit won't reflow — **add the SKU-activation hook (`lib/sku-activation.ts`) to the ensure trigger set.**
5. **Coordinator authz on the toggle.** Scope `setVendorLaneEnabledAction` to couple+admin AND verify the `events` UPDATE RLS; block toggling OFF while an active paid sponsorship exists.
6. **Three copies of the board math** (SQL resolver + dumb-sort reader + TS preview). The TS preview must READ materialized `board_slot`, never re-run an independent fill. Enforce in review.
