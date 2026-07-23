# Papic Challenges §9 — RESUME HANDOFF (2026-07-23)

> **For a fresh Claude Code session (any account).** This is self-contained — a new account will NOT
> have the prior session's auto-memory, so everything needed is here or in the named corpus docs. Read
> this top-to-bottom, then confirm every code fact against the branch before continuing.

---

## 0 · TL;DR

Building the **Papic Challenges §9** feature: a Setnayan-supplied **40-challenge library** + a **20-slot
board** = couple (≤10) + vendor (≤5) + Setnayan backfill, with a guaranteed Top-5 and veto-wins-backfill.
**Council-planned** (14 agents), **PR-A/B/C built + committed locally, PR-D/E/F remain.** **Nothing is
pushed or PR'd** — the migration has **never been applied to a database** (no local Docker/psql), and it
must be verified on a real DB before shipping.

---

## 1 · WHERE THE CODE IS

- **Repo (canonical working):** `/Users/icecasasola` (home-rooted, git-dir `.git`; worktrees hang off it).
  ⚠ **IGNORE** `/Users/icecasasola/Documents/Claude/Projects/setnayan-platform` — a SEPARATE STALE checkout.
  ⚠ The home repo's local `main` was ~971 commits behind `origin/main` — **always build from `origin/main`.**
- **Build worktree:** `/Users/icecasasola/wt-papic-challenges` · branch **`claude/papic-challenges-40lib`**
  (off `origin/main` @ `796d8f167`) · `node_modules` symlinked from `/Users/icecasasola/apps/web/node_modules`.
- **Commit:** `7e31ddb38` — "feat(papic-games): §9 … PR-A/B/C (flag-dark, DB-UNVERIFIED)". **NOT pushed**
  (no upstream). PR-D/E/F should be added as further commits on this branch.
- **Read-only council worktree:** `/Users/icecasasola/setnayan-council-read` (detached @ `796d8f167`) —
  used for grounding; **deletable** via `git worktree remove /Users/icecasasola/setnayan-council-read`.

**Files changed in the commit:** `supabase/migrations/20270919292820_papic_challenge_library_and_board.sql`
(new) · `apps/web/lib/papic-missions.ts` · `apps/web/lib/papic-missions.test.ts` · `apps/web/lib/papic-games.ts`
· `apps/web/app/api/papic/guest-missions/route.ts` · `apps/web/app/papic/guest/_components/papic-challenge-panel.tsx`
· `changelog.d/papic-challenges-40lib.md`.

---

## 2 · CANONICAL DESIGN DOCS (read these)

- **Spec:** `0012_papic/Papic_Games_and_Vendor_Missions_Spec_2026-07-21.md` **§9** (the model) — §9.2 the 40
  library, §9.3 the 20-slot 3-lane resolver, §9.4 provisional Top-10, §9.5 Pabati own-quota, §9.6 build state.
- **Council verdict (drives the build):** `0012_papic/Papic_Games_Build_Council_Verdict_2026-07-23.md` —
  the resolved design, the PR-A…F plan, reuse map, owner sign-offs, DPO gates, residual risks.
- **Decision log:** corpus `DECISION_LOG.md`, rows dated 2026-07-23 (search `PAPIC CHALLENGES`).

## 3 · OWNER DECISIONS — LOCKED (do not re-litigate)

1. **Couple-veto → VETO WINS + backfill.** A couple hiding a Setnayan hero (is_active=false) is a tombstone;
   the resolver backfills the next ranked item. Never resurrect, never delete.
2. **Paid vendor challenges → PRO+ (not Solo).** (Resolves the Solo-vs-Pro contradiction; gates PR-F.)
3. **Minor-safety → ship with the DB blocklist, residual ACCEPTED** (the keyword trigger isn't complete;
   owner accepted that a determined user could evade it). Do NOT represent the blocklist as complete.

**Adopted defaults (reversible; owner may redirect):** §9.4 Top-10 ranking is **PROVISIONAL** (seeded, a
reorder is a 10-row `UPDATE`) · "allow vendors" toggle **defaults ON** (preserves today's behaviour) ·
Pabati is a **doorway only**, own meter, **no Story reward**.

---

## 4 · ⚠ THE VERIFICATION GAP — READ BEFORE SHIPPING ANYTHING

**The migration `20270919292820` has NEVER been applied.** This machine has **no Docker and no `psql`**, so
PR-A's SQL could not be run locally. PR-B's 21 tests validate the **algorithm** (runnable, no DB), but **not
the SQL syntax/behaviour.** The flag `NEXT_PUBLIC_PAPIC_GAMES_V1` is **LIVE in prod**, and migrations
auto-apply to **prod** on merge (`supabase-migrations.yml`) — so **do NOT push/PR/auto-merge until the
migration is applied + asserted on a real database.** (Owner lock: verify-before-arming-auto-merge.)

**Pick a verification path (owner decision, still open):**
- **A) Ship-and-review** — open the PR, owner reviews the diff, CI applies on merge (first real run = prod).
- **B) Scratch DB** — apply to a throwaway/staging Postgres or Supabase branch, assert, THEN merge. (Preferred.)
- **C) Local Supabase** — install Docker + Supabase CLI, `supabase db reset` (applies all ~887 migrations), assert.

**The 3 go-live assertions the migration must pass on a real DB:**
1. A role-targeted mission is invisible to a non-matching guest (`papic_guest_missions` v3 role guard carried).
2. Building the board then reshuffling **never deletes** a `papic_mission_completions` row (materialize-once).
3. The reader was **DROP+CREATE**, not `CREATE OR REPLACE` (return-shape change), and re-granted `anon`.

Plus: an end-to-end test that a Pool/board event's `ensure_papic_board` actually materializes ≤20 rows and the
reader orders by `board_slot`.

---

## 5 · REMAINING WORK — PR-D / PR-E / PR-F

All flag-dark (`papicGamesEnabled()` / `NEXT_PUBLIC_PAPIC_GAMES_V1`). Each: map → build → **adversarial
self-review** → commit on this branch. Migrations via the **allocator** `pnpm migration:new "<name>"`
(NEVER hand-stamp a timestamp — cross-lane collision lesson), allocate **after** `20270919292820`.

### PR-D — Pabati doorway
- **Read first:** the Pabati recording surface + route (`app/api/pabati/clip/route.ts`, `lib/pabati.ts`,
  `pabati-prompt.tsx`, and wherever the guest reaches the Pabati recorder — confirm the route path, e.g.
  `/pabati/[eventId]` vs the guest-landing `[slug]` surface).
- **Panel** (`app/papic/guest/_components/papic-challenge-panel.tsx`): for `m.capture_kind === 'pabati'`,
  render a **"Record a greeting →" link** to the Pabati recorder with `?challenge=<mission_id>` — do NOT
  render the arm/COMMENCE mechanic (it keys off `lastCaptureId`, a point-pool capture Pabati doesn't use),
  and **suppress the Story reward CTA** (Pabati's reward is the gift). Needs the event id/href — thread it
  from the parent (`papic-guest-capture.tsx`) or a new prop.
- **`pabati-prompt.tsx`:** accept an optional `missionId`; on save → POST `/api/papic/guest-complete-mission`
  with `captureId: null` (the completion RPC is already NULL-safe). Do NOT touch the Pabati 300-clip meter/5s cap.
- **Gate library #5 on `eventPabatiActive` fail-closed** in BOTH the resolver walk (already: `p_pabati_active`)
  AND the couple picker (PR-E) — never offer Pabati when its SKU is inactive.

### PR-E — Couple curation surface
- **Read first:** `app/dashboard/[eventId]/studio/papic/couple-challenges-manager.tsx` (the mounted couple
  curation UI, server component) + its `actions.ts` + `page.tsx` mount; and the existing couple-authored path
  (`source='couple'`, PR #3510) — REUSE it, don't rebuild.
- **Add:** a **library picker** (the 40 grouped by the 7 categories — read from `papic_challenge_library`),
  a **≤10 counter** (enforce server-side too), **create-your-own** (reuse the couple-authored textarea; call
  `isChallengePromptBlocked` from `lib/papic-missions.ts` as the UX pre-check — the DB trigger is authoritative),
  an **"allow vendors" toggle** (writes `events.papic_vendor_challenges_enabled`), and a **Top-5 preview**
  ("we'll also add these"). After a couple write, call `ensurePapicBoard` to reflow.
- **Actions** (`studio/papic/actions.ts`): `pickLibraryChallengeAction` (insert a `source='couple'` mission
  with `library_id`), `setVendorLaneEnabledAction` (scope to **couple + admin, NOT coordinator**; also verify
  the `events` UPDATE RLS actually blocks coordinators). Call the prompt guard in the create action.

### PR-F — Vendor lane gate (owner-decided: PRO+)
- **New migration** (allocate after PR-A): `CREATE OR REPLACE papic_create_vendor_challenge` to ALSO enforce
  (a) `events.papic_vendor_challenges_enabled = true`, and (b) a **hard 5-paid-slot sell-cap per event** — a
  6th ₱400 sponsor must be refused/queued, NEVER sold an invisible slot (fake-door lock). Keep the Pro+ tier
  gate (`NOT IN ('pro','enterprise','custom')` is the FREE-create gate — see the tier gotcha below).
- **`lib/vendor-photo-challenge.ts`:** add the allow-vendors-toggle check to `photoChallengeEligibility`.

---

## 6 · LOCKS & GOTCHAS (violating these breaks prod or the ladder)

- **Never-rename:** display/price/meter only; `is_active=FALSE` never drop/rename a `service_code`/enum value.
  The `source` CHECK was widened to a superset (`+'setnayan'`) — additive, safe.
- **Flag is build-time inlined** (`NEXT_PUBLIC_PAPIC_GAMES_V1`) → a change needs a **redeploy** to flip; fails
  safe OFF. It is currently **LIVE in prod.**
- **Reader v4 = DROP+CREATE** (return shape changed) — a bare CREATE defaults to PUBLIC, so it MUST re-issue
  `REVOKE ALL … FROM PUBLIC` + `GRANT EXECUTE … TO authenticated, anon`, and carry the v3 `target_role`
  fail-closed guard. (Already done in PR-A — preserve it.)
- **Resolver never deletes:** `papic_mission_completions.mission_id` is `ON DELETE CASCADE` — deleting a
  mission wipes guest completions. De-selection = `board_slot = NULL`, never a row delete. (The single most
  load-bearing council finding — 3 blockers.)
- **Pabati own-quota:** the Pabati rail (`/api/pabati/clip`, 300-clip meter, 5s cap) is physically off the
  Papic point pool. The board only adds a DOORWAY. `p_pabati_active` is **server-computed** (`eventSkuActive`
  is a 6-source entitlement engine — do NOT replicate it in SQL); the resolver never trusts a client flag.
- **Minor-safety at the DB:** couple/vendor free-text is an RLS-direct insert (`FOR ALL TO authenticated`), so
  a couple can PostgREST past any app guard — the blocklist is a `BEFORE INSERT/UPDATE` trigger (authoritative);
  `isChallengePromptBlocked` is only a UX mirror.
- **Tier gotcha:** `vendor_tier_state` = free|verified|solo|pro|enterprise|**custom** (custom = the top tier).
  A Pro+ gate is `NOT IN ('pro','enterprise','custom')` — NEVER just `('pro','enterprise')` (that denies the
  top-paying tier).
- **Migrations auto-apply UNRELIABLY** (`supabase-migrations.yml` `db push` on merge; bursty merges silently
  skip). After a migration merge: VERIFY it ran + `gh workflow run supabase-migrations.yml --ref main`.
  ⚠ never echo `$SUPABASE_DB_URL`.
- **Two-vendor-lane subsystems stay separate** — `PAPIC_GUEST*` pass tiers vs the seat/mission subsystems; the
  fence guard `20270828140000` RAISEs if you cross them.
- **PR workflow:** after `gh pr create`, `gh pr merge <PR#> --auto --merge` is the standing default — but
  **verify-before-arming** (this stack: NOT until the migration is DB-applied). Add a `changelog.d/` fragment
  per PR (done for PR-A/B/C); do NOT edit `CHANGELOG.md`/`STATUS.md` directly.

---

## 7 · HOW TO RUN THE TESTS (no DB needed)

```
cd /Users/icecasasola/wt-papic-challenges/apps/web
node --test --import tsx lib/papic-missions.test.ts
```
Expect **21/21 pass** — covers the resolver (T1–T10 + paid-before-booth + couple-order + veto-backfill +
face_verified exclusion + Pabati-skip), the board_slot sort, and the minor-safety guard. Add tests for PR-D/E/F
logic as pure helpers where possible (the resolver mirror is the pattern).

---

## 8 · RESIDUAL RISKS (from the council — do not soften)

1. **First real execution is at a live wedding** (63 events, ZERO guest captures ever). 40 guests scanning in
   within a minute all queue on `pg_advisory_xact_lock(event_id)`. **Mitigation:** materialize the board via a
   **couple-side action** (studio open/publish, in PR-E) so the guest path is non-blocking + fail-soft;
   load-test ~50 concurrent first-opens before the first event.
2. **`board_slot` staleness:** a SKU activation (Pabati bought mid-event) with no later edit won't reflow —
   **add the SKU-activation hook** (`lib/sku-activation.ts`) to call `ensurePapicBoard`.
3. **Duplicate via free-text paraphrase:** dedup keys on `library_id`; a couple typing "Steal a dance" as free
   text won't mark lib1 taken. Consider normalizing custom prompts against the library on insert. Accepted residual.
4. **Coordinator authz on the toggle** — verify the `events` UPDATE RLS blocks coordinators; block toggling OFF
   while an active paid sponsorship exists.
5. **Three copies of the board math** (SQL resolver + dumb-sort reader + TS preview): the TS preview must READ
   materialized `board_slot`, never re-run an independent fill. Enforce in review.

---

## 9 · DPO / COUNSEL (not blocking the board itself)

- Minor-safety (§2.2) is a build gate, not a lawyer gate, but owner must stay on record accepting the blocklist
  residual (§3 above). Do not advertise it as complete.
- Vendor photo delivery (§4) consent is already correctly built (`consent_to_share DEFAULT false`, per-photo
  opt-in). The setnayan/couple lanes carry no vendor delivery → no new SPI flow. Confirm the existing consent
  copy still reads right when a Setnayan-lane (vendorless) completion suppresses the tap.
- No new biometric/face path — `face_verified` is excluded from the launch 40 (gated on the dormant
  `NEXT_PUBLIC_FACE_MODEL_URL`).
