# Session Handoff — Coordinator Role + Vendor Offer (2026-07-18 → 2026-07-21)

> **For the merge session.** Self-contained. Combine with the other two session handoffs. Actionable items use the `WHATS_NEXT_INDEX.md` §3 execution-metadata schema so they drop straight into the orchestrator graph. **PR numbers in the corpus drift — verify with `gh pr list` / `origin/main`, never the cited number.**

---

## 0 · TL;DR

The coordinator role was consolidated, benchmarked, built out, and its money model reshaped. **Everything is on `main`, flag-dark; all owner decisions are closed; DB migrations are already applied on prod. The only thing between it and live is flipping Vercel flags** (owner's step) — one of which activates a money feature on a *provisional* DPO approval. Separately, a per-category **Vendor Offer** doc was created (booking-fee section deliberately held — that model is in daily flux).

---

## 1 · What shipped (all flag-dark / OFF; verified on `origin/main` + prod)

| Feature | Flag (default OFF) | State |
|---|---|---|
| **Consent gate on coordinator invite** (RA 10173 modal at invite; `coordinator_access_consents` audit table) | `NEXT_PUBLIC_COORDINATOR_CONSENT_GATE_ENABLED` | ✅ merged (PR #3390) |
| **Propose-a-lock** (coordinator lock → couple-confirm) | `NEXT_PUBLIC_COORDINATOR_PROPOSE_LOCK_ENABLED` | ✅ merged (PR #3401); now **dormant** (superseded, keep OFF permanently) |
| **Consent-scoped money model** (`coordinator_access_consents.scopes` {vendor_lock, checkout}; guard `lib/coordinator-money-scope.ts`; two couple toggles "Can lock vendors"/"Can handle payments") | shares `…CONSENT_GATE_ENABLED` | ✅ on main (PR #3405 per docs) |
| **P2 filtered run-of-show** (master schedule → per-vendor/couple/guest views; responsible-party; templates; bulk retime) | `NEXT_PUBLIC_SCHEDULE_ROS_P2_ENABLED` | ✅ on main (`lib/schedule-ros.ts`) |
| **P3 day-of broadcast + email call-times** (`coordinator_broadcasts`; Resend-gated emails) | `NEXT_PUBLIC_COORDINATOR_P3_ENABLED` | ✅ on main (`lib/coordinator-broadcasts.ts`) |
| **P4 per-vendor working folder** (private-vs-couple notes) | (shipped flag-dark) | ✅ on main |
| **RA 10173 export fix** — `coordinator_access_consents.scopes` added to `/api/profile/export` | none | ✅ merged (PR #3483, 2026-07-21) |

**Migrations:** all 5 coordinator migrations (`20270729120000`, `20270729130000`, `20270823668011`, `20270825042743`, `20270825364600`) are **already applied on prod** (verified via `supabase migration list --db-url`). The "owner: push migration" notes were stale. **No push needed.**

**Flag-OFF = today's behavior exactly** for every one of these.

---

## 2 · Owner decisions (all CLOSED)

- **Money model: blanket "money wall" SUPERSEDED → consent-scoped** (2026-07-19). A coordinator may lock vendors + handle checkout/payments **iff the couple granted that scope** at invite time.
- **Approver = COUPLE/HOST**, not literal guests (2026-07-21; resolves the owner's ambiguous "guests approval" wording; matches shipped code).
- **Coordinator-recommended-inquiry token gate = flat-1 uniform** (no discount).
- **Delegated access = per-surface consent toggles**, not one blanket grant.
- **Reconcile the two access primitives** (`event_members` coordinator vs `event_moderators` wedding_planner_external) = **yes, deferred / low-priority.**
- **DPO = TEMPORARILY / provisionally approved** (owner-as-DPO, 2026-07-21) on the two sub-decisions: (a) biometric/face data stays scoped OUT, (b) decline-path basis = consent. **Provisional** — final external-counsel review still recommended before permanent go-live; **prod flag stays OFF until made permanent.**

---

## 3 · Corrections established (do NOT relitigate)

1. **Coordinator access is INVITE-based, not "auto-grant on lock."** `finalizeVendor` never touches `event_members`. The couple invites (Hosts page "Promote your coordinator" / generic co-planner form; `lib/coordinator-grant.ts:autoInviteCoordinator` also auto-creates a *pending* invite on downpayment) → coordinator accepts at `/host/accept` → `event_members` coordinator row. Consent lives at the invite.
2. **Coordinators CAN lock vendors today** (`event_vendors_moderator_write` + `COORDINATOR_AREAS.vendors='edit'`). The old "lock is couple-only" reading was wrong.
3. **The 2 counsel-gated migrations** (`20270811377742_vendor_papic_capture_counsel_gated`, `20270811993944_vendor_guest_deliveries_counsel_gated`) are **already applied on prod** — so their "must not `db push`" gate is already crossed for the *schema*; gating is flag-based, not withheld schema. (Separate concern, flag for owner re: NPC filing.)

---

## 4 · What remains

**Owner-infra (deliberate hand-offs — prod actions):**
- **Flip the Vercel flags** (only remaining go-live step). Set in Vercel prod, then redeploy (`NEXT_PUBLIC_*` are build-time-inlined):
  - `NEXT_PUBLIC_SCHEDULE_ROS_P2_ENABLED=true` (harmless)
  - `NEXT_PUBLIC_COORDINATOR_P3_ENABLED=true` (harmless)
  - `NEXT_PUBLIC_COORDINATOR_CONSENT_GATE_ENABLED=true` ⚠️ activates coordinators handling **payments** for real couples, on the **provisional** DPO approval — flip only when ready to make that live.
- **Configure `RESEND_API_KEY`** for P3 call-time emails (clean no-op until then).
- **Make the DPO approval permanent** (external-counsel look) before the consent flag goes live.

**Unbuilt / open (execution metadata below):**
- **P1 prep-then-release visibility** (coordinator_only vs couple_visible flags) — highest-leverage remaining build; DPO-gated (same basis as the consent gate).
- Follow-ups: consent on the `autoInviteCoordinator` path; a DB trigger hard-blocking a coordinator's raw `status→contracted` write; reconcile the two access primitives.
- Note: pre-flag coordinators have **no consent row → fail-closed to zero money scopes → must be re-invited** once the flag flips (accepted design, no backfill).

---

## 5 · Execution metadata (for the orchestrator — `WHATS_NEXT_INDEX.md` §3 schema)

```
- id: coord#flag-flip        title: Flip P2/P3/consent Vercel flags (+ Resend, + permanent DPO for consent)
  type: flag  safety_gate: FLAG_FLIP_PROD (+ DPO_COUNSEL for the consent one)  touches: Vercel prod env  parallel_safe: no

- id: coord#P1-prep-release  title: Prep-then-release visibility flags (coordinator_only vs couple_visible)
  type: code+migration  depends_on: []  parallel_safe: no  (migration mutex)  safety_gate: DPO_COUNSEL (guest-PII parity — batch into the counsel packet)
  touches: new migration (visibility cols); tools/tasks/timeline surfaces  verify: tsc+lint+tests; RLS

- id: coord#consent-autoinvite  title: Consent capture on autoInviteCoordinator downpayment path
  type: code  parallel_safe: no  safety_gate: DPO_COUNSEL  touches: lib/coordinator-grant.ts; finalizeVendor path

- id: coord#propose-lock-trigger  title: DB trigger hard-blocking a coordinator's raw status→contracted write
  type: migration  depends_on: [coord#flag-flip permanent]  parallel_safe: no  safety_gate: NONE (add only once consent-scoped is permanently ON)

- id: coord#reconcile-primitives  title: Reconcile event_members-coordinator vs event_moderators-wedding_planner_external
  type: decision+code  safety_gate: OWNER_DECISION (approved: yes, deferred)

- id: vendor-offer#fee-section  title: Fill the booking-fee section of Vendor_Offer_By_Category once the fee locks
  type: spec  depends_on: [booking-fee model locks]  safety_gate: OWNER_DECISION

- id: vendor-offer#event-types  title: De-wedding-frame the per-category offers once vendor coverage→profile propagation ships
  type: spec  depends_on: [vendor event_types no longer stuck at ['wedding']]  safety_gate: NONE
```

Collision keys (serialize): `app/api/profile/export/route.ts` (shared with featured-weddings), `event_schedule_blocks` (P2↔P3), vendors domain (`vendors/*`, `finalizeVendor`, `v/[slug]`), and every P-item is a migration mutex. Batch all coordinator DPO items into the one shared counsel packet.

---

## 6 · Docs created / updated this session

**Created:**
- `Coordinator_Role_Feature_Spec_2026-07-18.md` — consolidated coordinator spec (model, industry benchmark, permission matrix, §3a consent gate, §6 decisions).
- `Coordinator_Whats_Next_2026-07-18.md` — coordinator handoff + §8 execution metadata (registered in `WHATS_NEXT_INDEX.md`).
- `03_Strategy/Vendor_Offer_By_Category_2026-07-21.md` — per-category vendor offer (internal map + vendor copy; booking fee HELD).
- This handoff.

**Updated:** `WHATS_NEXT_INDEX.md` (§5 register, §6 collisions, §7 gaps + the resolved money-scope-approver item), `02_Specifications/Feature_Documentation_By_Role.md` (stale coordinator section superseded), `DECISION_LOG.md` (all decisions above), memory `project_setnayan_coordinator_role`.

---

## 7 · Vendor Offer by Category (the other deliverable)

`03_Strategy/Vendor_Offer_By_Category_2026-07-21.md` maps all **31 canonical `VENDOR_CATEGORY_LABEL` keys → 10 benefit groups** (Venue · Feast · Documentary · Design · Program · Prints · Booths/AV · Transport · Coordinator · Other). Two layers each: **▸Internal map** (true access profile, grounded in the owner-locked `Feature_Access_By_Vendor_Category_2026-06-12.md`) + **▸Vendor copy** (onboarding pitch). Built for the "pick your service → see your offer" flow. Anchored to `Feature_Access_By_Vendor_Category` (access mechanics, mostly BUILT) + `16_Vendor_Benefits_with_App_Evidence.md`.

**Booking fee = deliberately HELD** (owner decision). It changed 3× on 2026-07-21 (first-payment → customer-accepts → **vendor prepays to send a finalized proposal**); the **₱4,000/vendor cap's unit is open**; the **Proposal Maker that would meter it is NOT built**; and `CLAUDE.md`/`Pricing.md`/`AS_BUILT` still say **"0% commission"** — an unreconciled contradiction. Live source of truth: `3D_Plan_and_Vendor_Revenue_Model_2026-07-20.md` + `Booking_Fee_Build_Plan_2026-07-21.md` + DECISION_LOG 2026-07-21 rows. **Do not write a fee number into vendor copy until it locks.**

**Open on the vendor side:** non-wedding vendors are invisible (`vendor_profiles.event_types` stuck at `['wedding']`); the new `editorial`/content-creator category isn't in the 31 keys yet (grain undecided); `crew_meals`/`church_fees` are ledger lines, not shops.

---

## 8 · How to resume

Canonical checkout = `/Users/icecasasola` (git root; origin = `github.com/iscasasola/setnayan-platform`; `apps/web/` + repo-root `supabase/migrations/`). Fresh worktree off `origin/main` per task; symlink `node_modules` from the main checkout; `tsc --noEmit` + `next lint --file` to verify; one task = one branch = one PR + `--auto --merge`. **Never blanket `supabase db push`** — it applies the 2 counsel-gated migrations. Start the coordinator backlog with **P1 (prep-then-release)**; everything else coordinator is done or owner-gated.
