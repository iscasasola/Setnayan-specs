# Coordinator Role — Consolidated Feature Spec

**Date:** 2026-07-18 · **Status:** 🟡 DESIGN — consolidates shipped truth + industry research + a prioritized build plan. **Not yet a build order; open owner sign-offs at the bottom.**
**Supersedes:** the "Coordinator — deferred to a future phase; Vendors tab is the only V1 surface" framing in [`02_Specifications/Feature_Documentation_By_Role.md`](02_Specifications/Feature_Documentation_By_Role.md) Part 5 (self-flagged stale; the host-access model actually shipped — see §1).

> **Disambiguation.** Two things are called "planner": (1) the **Setnayan AI product SKU** (₱499, the deterministic assist product) — OUT OF SCOPE here; (2) the **human wedding coordinator** hired by the couple — the subject of this doc. This spec is only about the human role.

---

## 0 · What a coordinator is (the model)

> **⚠ MONEY WALL SUPERSEDED 2026-07-19 (owner) → CONSENT-SCOPED. Every "money wall / payments: never / propose-not-execute for money" claim below is HISTORICAL.** A coordinator MAY lock vendors and go through checkout **iff the couple granted that scope** at invite time. Shipped on `main`: `coordinator_access_consents.scopes` JSONB (migration `20270823668011`, fail-closed) + two default-OFF couple toggles ("Can lock vendors" · "Can handle payments") + guard `lib/coordinator-money-scope.ts` wired into checkout/orders/vendors/finalizeVendor/recordDeposit. Behind `NEXT_PUBLIC_COORDINATOR_CONSENT_GATE_ENABLED` (OFF). Propose-a-lock (§4/§0 below) is consequently **dormant**. ⚠ **Open owner-confirm:** the owner's words were "guests approval" — recorded as **couple/host** approval; confirm before the flag flips. See DECISION_LOG 2026-07-19.

A coordinator is a **marketplace vendor** (Wedding Coordination category). Access is **invite-based, not lock-based** (⚠ corrected 2026-07-18 against actual code — the earlier "auto-grant on lock" was wrong): the couple **invites** the coordinator as an event host — manually via "Promote your coordinator" on `/dashboard/[eventId]/hosts`, and `lib/coordinator-grant.ts:autoInviteCoordinator` also creates a **pending** invite when the booking's downpayment is marked — then the coordinator **accepts** at `/host/accept/[token]`, which writes the `event_members` coordinator row and grants access. Locking the vendor (`finalizeVendor`) does **not** itself grant access. No separate account; the coordinator enters via an account-switcher in the same 0022 vendor dashboard. The governing principle:

> **Couple-level eyes; couple-approved hands on anything that costs money or can't be undone. Coordinator never touches the money rail.**

Formally a **read/write split**:
- **READ = full parity** with the couple (choices, guests, seating, schedule, vendor threads, mood board).
- **WRITE = two tiers** — low-stakes writes the coordinator just does (edit seating, add a vendor from their vetted list); high-stakes writes they **propose** and the couple **confirms** (lock a vendor, buy a SKU, anything money-adjacent).
  - ⚠ **Reality check (2026-07-18):** a coordinator can **currently lock vendors directly** — `event_vendors_moderator_write` (migration `20261129003000`, OR'd with the couple policy) + `COORDINATOR_AREAS.vendors='edit'` let `finalizeVendor`'s status write through (audit-logged via `log_delegate_write`). An earlier reading that lock was couple-only was **wrong**. ✅ **PR #3401 (flag-off)** enforces the propose→confirm rule for the lock specifically: flag `NEXT_PUBLIC_COORDINATOR_PROPOSE_LOCK_ENABLED` ON → a coordinator's lock becomes a `vendor_lock_proposals` row the couple confirms; OFF → direct lock (current behavior). Other money-adjacent writes (SKU buy) remain couple-only via their own RLS.

### Access primitives that exist today (do NOT conflate — reconcile in build)
| Primitive | Purpose | Helper |
|---|---|---|
| `event_members.member_type = 'coordinator'` | Host review / vendor completion | `current_couple_or_coordinator_event_ids()` |
| `event_moderators` role `wedding_planner_external` | Recommend-strip / delegated planning | `current_moderator_event_ids()` |
| `chat_thread_participants.role = 'coordinator'` | Per-thread chat join | `thread_join_authorizations` (couple authorizes) |
| `seat_plan = 'edit'` flag | Seating editor access | (per-surface flag — the target pattern) |

> ⚠ **Tech-debt to resolve:** two overlapping membership primitives (`event_members` coordinator + `event_moderators` wedding_planner_external) currently back different surfaces. The target model (§3) is **one coordinator grant carrying a set of per-surface permission flags**, extending the shipped `seat_plan='edit'` pattern. Consolidation is part of the build, not a new mechanic.

---

## 1 · Shipped baseline (✅ — already built, verified in DECISION_LOG)

| Capability | Evidence |
|---|---|
| **Auto-INVITE (pending) on downpayment** — creates a pending `event_moderators` invite; access only when the coordinator accepts at `/host/accept` (⚠ NOT a grant-on-lock — corrected vs code 2026-07-18; `finalizeVendor` never touches `event_members`) | `lib/coordinator-grant.ts` · PR #2034 |
| Couple "Remove access" revoke w/ mandatory reason (abuse → admin signal) | PR #2026 |
| **Money wall** — coordinator walled from budget ledger, payment methods, checkout | DECISION_LOG 2026-06-22 |
| Recommend-a-feature strip ("Your coordinator suggests") — `coordinator_feature_recommendations` (mig `20270215220130`); coordinator inserts, couple View/Dismiss, no coordinator update/delete | PR #2052 |
| Chat **Coordinator Join** — per-thread, couple-authorized, `thread_join_authorizations` audit, file access, revoke inside the 15-min signed-URL window, identity unmasked in group thread | 0019 |
| Seat plan editor + walkthrough recorder via `seat_plan='edit'` ("coordinator labour, free / never a SKU") | 0008 AS-BUILT |
| Guest **check-in desk** (jsQR + manual + headcount + undo) — `guest_checkins` couple+coordinator RLS | 0001 audit / 0031 |
| Per-guest souvenir/delivery scan — `guest_souvenir_claims` couple+coordinator read | 0031 |
| Coordinator drives **vendor completion** (confirm / non-delivery) | PR #1918 |
| Coordinator submits **host review**; attributed to the couple, not the coordinator's name (privacy fix) | PR #1922 / #1924 |
| Couple **or** coordinator picks crew meal at Confirm | 0006 crew-meal |

## 1a · Spec'd, not yet shipped (🟡)
- **Schedule segment-write** (mark segments active/complete) — off by default (0031 AC-05).
- **Day-of coordinator broadcast card** — a *stub* today (`coordinator-broadcast-card.tsx`); tables `coordinator_broadcasts`/`event_broadcasts`/`broadcast_acknowledgments` spec'd, no backend.
- **V2 "coordinator cluster"** (deferred, correctly): multi-staff PIN, arrival/meal/departure scan modes, dietary tracker, vendor broadcast, offline data bundle, thermal badge printing, geo-tag arrival pings, post-event PDF report.

---

## 2 · Industry benchmark (deep-research, 2026-07-18)

Verified across **Aisle Planner (dominant), Planning Pod, Timeline Genius, Prismm/AllSeated, HoneyBook** (25/25 claims confirmed via adversarial verification). Professional coordinator software converges on three pillars:

1. **Master run-of-show → per-party views.** One timeline; each row carries a time + a **responsible party** (vendor/crew/room) + a call-time reminder. That master **auto-slices into filtered per-vendor and per-couple views** (Timeline Genius, Aisle Planner) so each party sees only its lines. Authoring efficiency = **reusable templates per event type** + **bulk time-shift** (retime 50 items at once when the day slips).
2. **Staged "prep-then-release" client visibility.** The coordinator preps the whole plan privately, then **releases tools/tasks/timeline items to the couple on their own schedule**; per-item `coordinator-only` vs `couple-visible` flags. Aisle Planner treats this as its single most load-bearing coordinator feature.
3. **Role-scoped delegated access.** Distinct participant roles (HoneyBook: client / collaborator / team-member; Planning Pod: per-tool view-vs-edit + "assigned events only"). **This is the pillar Setnayan already shipped.**

Plus table-stakes: floor-plan/seating (2D↔3D, object library, service-area spacing guides, auto-populate from guests — Prismm/Aisle Planner), per-project vendor folders (contracts + **private-vs-client notes** + proposal versioning), and client portals with synced calendars + scoped shareable links.

**Research caveats (honest):** only 5 of ~13 named tools yielded verified claims. Two buckets came back **empty — day-of on-site *mobile* execution, and coordinator *reporting/analytics*** — absence of evidence, not proof of absence. Notably, **day-of mobile is where Setnayan's weak-signal offline PWA (0031) can out-execute the incumbents.** Sources: aisleplanner.com, planningpod.com, timelinegenius.com, prismm.com, honeybook.com help centers.

---

## 3 · Target permission model (extends `seat_plan='edit'`)

One coordinator grant, per-surface flags the couple toggles (default state in parens):

| Flag | Grants | Default |
|---|---|---|
| `guest_list` (view / edit) | Guest roster + check-in | view |
| `seat_plan` (view / edit) | Seating editor + walkthrough — **shipped** | edit |
| `schedule` (view / edit / run) | Run-of-show authoring + day-of segment-write | edit, **run off** |
| `chat` (per-thread) | Coordinator Join — **shipped**, couple-authorized per thread | per-thread |
| `vendors` (view / add-from-list / propose-lock) | Vendor registry; add **only from coordinator's vetted favorites, never marketplace search**; lock is **propose→couple confirms** | view + add-from-list |
| `recommend` | Recommend-strip (SKUs to couple) — **shipped** | on |
| `payments` | — | **never** (hard money wall) |

**Rules baked in:**
- **Add-from-list, not search.** Coordinator can *see* marketplace search (read parity) but can only *inject* vendors from their own vetted favorites — blocks silent steering/kickback.
- **Propose-not-execute** on `finalizeVendor`/lock and any SKU purchase. There is no coordinator-owned lock today; the built analog is the recommend-strip. "Propose a lock" is a small new mechanic on that same propose→confirm pattern.
- **RA 10173.** Full-read parity includes guest PII → the grant is a **consent record + audit trail ("acting as coordinator") + one-tap revoke** (revoke + reason already shipped). Loop DPO in when `guest_list` read parity is widened. See [[project_setnayan_privacy_reconciliation]].

### 3a · Consent gate at coordinator INVITE (RA 10173) — the *grant* half · ✅ BUILT flag-off (PR #3390, 2026-07-18)

When the couple **invites a coordinator** (`wedding_planner_external`) as an event host — the couple's explicit share decision — a **Data Privacy consent modal** fires *before* the invite is created. (Corrected from "at lock": access is invite-based, see § 0.) This is the grant half that mirrors the shipped revoke-with-reason (#2026): access is now **consent-in, reason-out**.

> **✅ Built 2026-07-18 (PR #3390, flag-OFF).** Migration `coordinator_access_consents` (RLS at create) · flag `NEXT_PUBLIC_COORDINATOR_CONSENT_GATE_ENABLED` (default OFF) · client modal `hosts/_components/consent-gated-invite-form.tsx` (covers both invite entry points: "Promote your coordinator" + the generic co-planner form) · server enforcement + consent record in `hosts/actions.ts:inviteHost`. Flag-OFF = byte-for-byte current behavior. Follow-ups deferred: stamp `revoked_at` on host-removal; consent on the `autoInviteCoordinator` downpayment path (pending invite, no couple UI moment).

- **Trigger** — gated on "the invite grants dashboard access" (role `wedding_planner_external` / `delegate_kind=coordinator`), NOT the literal word *coordinator* (a future co-planner/stylist inherits it automatically).
- **Modal must carry** (DPA: consent = *specific · informed · freely given*):
  - **WHO** — the coordinator by business name.
  - **WHAT** — enumerated scope (guest list, seating, schedule, vendor chats) **+** an explicit "your budget & payments stay private" line (the money wall, stated as reassurance).
  - **WHY** — "so they can coordinate on your behalf."
  - **UNDO** — links the shipped Remove-access-with-reason.
  - **Checkbox UNTICKED by default** (a pre-ticked box is not valid consent); Confirm stays disabled until ticked.
- **Consent record, not just a UI gate** — write a `coordinator_access_consents` row (`couple_user_id · coordinator_vendor_id · event_id · scope_version · granted_at`), RLS at CREATE, mirroring `thread_join_authorizations`; revocation stamps `revoked_at`. This is the audit trail that makes the grant defensible.
- **Three DPO-gated sub-decisions** (surfaced, not resolved):
  1. **Guest-side basis** — the couple's consent is controller→coordinator only; guests are separate data subjects. Their basis must already be captured **at RSVP** ("shared with the couple's appointed vendors/coordinator for event purposes"). The couple's checkbox does NOT reach it.
  2. **Biometric scope-out** — coordinator host access **excludes** face-enrollment vectors (SPI = higher bar, and unneeded). Consent copy enumerates ordinary PI only.
  3. **Decline path** — payment/lock completes; host access is simply **not granted** until consent (grantable later from Settings). Do **not** block payment on the checkbox (freely-given). Whether coordination access is "necessary for the contract" (a *different* lawful basis than consent) is the open DPO call.
- **Build posture** — behind a feature flag, **flag-OFF**, DPO review before go-live. Consent capture + record + modal are built; the enforcement flip waits on the DPO ruling.

---

## 4 · Build plan — gaps worth building, in order

### P1 · Prep-then-release visibility layer  ⛔ gap · highest leverage
Per-item `visibility ∈ {coordinator_only, couple_visible}` on tools, checklist tasks, and timeline rows; a couple-facing "released" state. Lets the coordinator stage the plan before the couple sees anything half-finished — the industry's #1 coordinator feature, and a direct fit for "operating inside the couple's account." Extends existing per-surface flags; no new access primitive.

### P2 · Filtered run-of-show  ⛔ gap · signature differentiator
One master schedule (`event_schedule_blocks` exists) → **auto-synced per-vendor + per-couple + per-guest views** (each sees only its rows). Each row gains a **responsible party** (vendor/crew/family) + a **call-time reminder (email-only in V1 — no-SMS lock; SMS V1.5)**. Pairs with Coordinator Join: push a vendor its slice into the thread. Add **schedule templates per event type** + **bulk retime** (multi-select shift → cascade a late ceremony).

### P3 · Finish day-of broadcast + email call-times  🟡 stub · PH-first moat
Wire the `coordinator-broadcast-card.tsx` stub to `coordinator_broadcasts`/`broadcast_acknowledgments` (RLS: coordinator+couple write, members read) and add opt-in email call-time nudges. This is the bucket the incumbents cover *least*, over Setnayan's offline PWA (0031) — the clearest differentiation.

### P4 · Per-vendor working folder  ⛔ gap · low cost
Extend 0006: per-event vendor record with contract files (R2) + **private coordinator notes vs couple-visible notes** + proposal versioning. The private/couple note split is the coordinator's real workflow.

### Deferred / constraint-bound
- **Contract builder + e-sign** → iteration **0032** (RA 8792); coordinator *drafts/proposes*, couple *signs* (money-adjacent → propose-not-execute).
- **Floor-plan polish** (service-area spacing guides, meal/consideration canvas toggles) — nice-to-have; Setnayan is already at/ahead on 2D↔3D + object catalog (0008).

### 🚫 Do NOT build (constraint collisions)
- In-app **card processing** / coordinator **pays vendor invoices on the couple's behalf** (Planning Pod, Rock Paper Coin) — collides with the money wall + apply-then-pay + 0% commission. Coordinator stays money-walled.
- Coordinator **approves vendor contracts on the couple's behalf** (Rock Paper Coin) — money-adjacent; keep propose-not-execute.

---

## 5 · Setnayan-native (no industry precedent)

The incumbents are B2B SaaS, not marketplaces, so two ideas have **no competitor equivalent** — structural moats, not gaps:
1. **Coordinator recommends vendors → guests** (guests = future couples): a "Recommended by your coordinator" shelf on the guest landing page, tap = a **soft interest signal** (free, no token burn), converting to a real token-settling inquiry only when the guest starts their own event.
2. **`referred_by_coordinator` inquiry provenance** — a warm-lead **label** on the vendor's inquiry (rides the existing creator-chapter `referring_chapter_id` provenance rail). Label only — **no coordinator earn** (that resurrects the retired productions-referral, killed 2026-06-15), and **same flat-1 uniform token gate** (do not reopen the just-locked uniformity with a per-source discount).

---

## 6 · Decisions — owner sign-off · ✅ RESOLVED 2026-07-21 ("follow your recommendations"), except the DPO ruling

**Money-scope approver (the blocker) — ✅ = COUPLE/HOST**, not literal guests; matches the shipped consent-scoped code (no change). See the §0 banner + DECISION_LOG 2026-07-21.

1. **Coordinator-recommended inquiries** — ✅ **flat-1 uniform** vendor-accept token gate (no coordinator-lead discount; keeps the 2026-07-12 uniformity lock).
2. **Delegated access grant shape** — ✅ **per-surface consent toggles** (extends the shipped "Can lock vendors" / "Can handle payments" scopes + `seat_plan='edit'`), not one blanket grant.
3. **"Propose a lock"** — ✅ resolved earlier: built (PR #3401) then made **dormant** by the 2026-07-19 consent-scoped supersession (a couple-approved coordinator locks directly).
4. **Consent gate DPO review (§3a)** — 🟡 **TEMP-APPROVED 2026-07-21** (owner-as-DPO, provisional): (a) biometric scope-out confirmed, (b) decline-path basis = consent. DPO gate **provisionally cleared** — but the prod flag stays OFF until (i) the 5 coordinator migrations are pushed to prod and (ii) the approval is made permanent (final external-counsel review still recommended). Also un-gates P1's full-read parity, provisionally.
5. **Reconcile the dual access primitives** (`event_members` coordinator vs `event_moderators` wedding_planner_external) — ✅ **yes, but deferred / low-priority** (tech-debt; target = one grant + per-surface flags).

---

*Companion: this consolidates [`Feature_Documentation_By_Role.md`](02_Specifications/Feature_Documentation_By_Role.md) Part 5, 0019 (chat), 0031 (day-of), 0008 (seating), 0006 (vendors), and the DECISION_LOG coordinator entries (2026-06-22 host-access trio, #1918/#1922/#1924). Memory: [[project_setnayan_coordinator_role]].*
