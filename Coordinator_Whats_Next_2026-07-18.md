# Coordinator Role — What's Next (handoff)

**Date:** 2026-07-18 · **Status:** ⏸️ PAUSED at a clean stopping point. Two features shipped flag-off; the rest is documented below for a clean resume.
**Companion:** [`Coordinator_Role_Feature_Spec_2026-07-18.md`](Coordinator_Role_Feature_Spec_2026-07-18.md) (the consolidated design + build plan) · memory [[project_setnayan_coordinator_role]].

> **⚠ RECONCILED 2026-07-21 vs `origin/main` — several items below are DONE or SUPERSEDED (see the §8 status block; don't re-run them).** Headlines: the **blanket money wall was SUPERSEDED → consent-scoped** (owner 2026-07-19 — coordinators may lock + checkout iff the couple granted that scope; `coordinator_access_consents.scopes` + `lib/coordinator-money-scope.ts` live on main). This makes the `#checkout-audit` moot and **propose-a-lock dormant**. The **data-export gap is CLOSED** (PRs #3467 + #3475). The last open item is now closed: **owner confirmed 2026-07-21 the approver = couple/host** (not guests); the consent flag flip is gated on DPO only.

---

## 1 · Shipped this session (both **flag-OFF** — no live behavior change yet)

| PR | Feature | Flag (default OFF) | State |
|---|---|---|---|
| [#3390](https://github.com/iscasasola/setnayan-platform/pull/3390) | **RA 10173 consent gate on the coordinator invite** — Data-Privacy modal (unticked checkbox) before a coordinator host invite; `coordinator_access_consents` audit record | `NEXT_PUBLIC_COORDINATOR_CONSENT_GATE_ENABLED` | ✅ **MERGED** |
| [#3401](https://github.com/iscasasola/setnayan-platform/pull/3401) | **Coordinator "propose a lock"** — a coordinator's vendor-lock becomes a `vendor_lock_proposals` row the couple confirms | `NEXT_PUBLIC_COORDINATOR_PROPOSE_LOCK_ENABLED` | ✅ **MERGED** 2026-07-18 14:54 UTC *(corrected 2026-07-19 — was "open, waiting CI")*; migration `20270729130000_vendor_lock_proposals.sql` on main; vendors/page.tsx conflict resolved |

Flag OFF = byte-for-byte current behavior for both. Nothing is half-built; both are complete + `tsc`/`lint` clean.

---

## 2 · Corrections established this session (do NOT relitigate)

Two load-bearing facts were verified against **code** (which beats the specs). The corpus/DECISION_LOG previously had these wrong:

1. **Coordinator access is INVITE-based, not "auto-grant on lock."** `finalizeVendor` never touches `event_members`. The couple invites (Hosts page "Promote your coordinator" / generic co-planner form; `lib/coordinator-grant.ts:autoInviteCoordinator` also auto-creates a *pending* invite on downpayment) → the coordinator **accepts** at `/host/accept` → `event_members` coordinator row. Consent (PR #3390) therefore lives at the invite.
2. **Coordinators CAN lock vendors today.** `event_vendors_moderator_write` (migration `20261129003000`, OR'd with the couple policy) + `COORDINATOR_AREAS.vendors='edit'` let a coordinator's `finalizeVendor` status write through (audit-logged via `log_delegate_write`). PR #3401 restricts the lock to propose→confirm (flag-off).

---

## 3 · To activate what shipped (flag flips + their gates)

| Flag | Where to flip | Gate before flipping |
|---|---|---|
| `NEXT_PUBLIC_COORDINATOR_CONSENT_GATE_ENABLED` | Vercel env (prod/preview) → `true` | **DPO ruling** on 2 sub-decisions: (a) confirm biometric scope-out, (b) decline-path lawful basis (consent vs contract-necessity). See spec § 3a. |
| `NEXT_PUBLIC_COORDINATOR_PROPOSE_LOCK_ENABLED` | Vercel env → `true` | **Owner flip** — it removes coordinators' current direct-lock (a behavior change). No DPO gate. |

Both migrations (`coordinator_access_consents`, `vendor_lock_proposals`) ship the tables regardless; they're inert until the flags flip.

---

## 4 · Immediate follow-ups (small, tied to what shipped)

- **Consent (PR #3390):** ✅ **DONE.** `revoked_at` is stamped on removal / revoke / decline (audit loop closed), and the `autoInviteCoordinator` downpayment path now **respects the consent gate** (PR #3537): when the `coordinator_consent_money` control is **ACTIVE** it **suppresses the silent auto-grant (fail-closed)** so no guest-PII share happens without a recorded consent — the couple promotes the coordinator through the consent-gated manual form instead. Control OFF = prior behavior. *(The old "consent-at-accept vs deferred-consent" design question is moot — suppress-when-gated is the fail-closed resolution.)*
- **Propose-lock (PR #3401):** a **DB trigger** hard-blocking a coordinator's raw `status→contracted` write (belt-and-suspenders beyond the app gate — deliberately left OFF so flag-off stays exactly current behavior; add once the flag is permanently ON); a true inline one-tap confirm through `finalizeVendor`'s gate results from the strip (today a gate result nudges the couple to the vendor card).
- **`checkout: true` audit — ✅ DONE (2026-07-22):** re-traced every money-adjacent coordinator surface. The consent-scoped money wall (`coordinatorMoneyScopeAllowed`) is enforced **fail-closed at all five sites** — checkout submit, order create, payment-proof log, vendor lock, vendor deposit. No unguarded checkout surface remains; the raw `checkout: true` permission flag is fully superseded by the consent-scope check.
- **Reconcile the two access primitives:** `event_members.member_type='coordinator'` (host review / completion) vs `event_moderators` `wedding_planner_external` (delegated planning / recommend-strip). They overlap; the target model is one grant with per-surface flags. Tech-debt, not a new mechanic.

---

## 5 · The remaining coordinator build plan (from the spec — NOT built)

Prioritized in [`Coordinator_Role_Feature_Spec_2026-07-18.md`](Coordinator_Role_Feature_Spec_2026-07-18.md) § 4:

- **P1 · Prep-then-release visibility flags** — `coordinator_only` vs `couple_visible` on tools/tasks/timeline rows + a "released" state. The industry's #1 coordinator feature (Aisle Planner) and the highest-leverage gap; extends the shipped `seat_plan='edit'` per-surface pattern. **DPO note:** widening coordinator full-read parity over guest PII rides on the same consent basis as PR #3390.
- **P2 · Filtered run-of-show** — one master `event_schedule_blocks` → auto-synced per-vendor / per-couple / per-guest views; responsible-party per row; **email-only** call-time reminders (no-SMS lock, SMS V1.5); schedule templates per event type + bulk retime.
- **P3 · Finish the day-of broadcast stub** (`coordinator-broadcast-card.tsx`) + email call-times — the PH-first offline-PWA (0031) moat; incumbents cover day-of mobile least.
- **P4 · Per-vendor working folder** — contract files + **private coordinator notes vs couple-visible notes** + proposal versioning; extends 0006.
- **Setnayan-native (no competitor equivalent):** coordinator→guest vendor recommendations (soft interest signal, no token burn, converts only when the guest starts their own event); `referred_by_coordinator` inquiry provenance (**label only, NO earn** — that resurrects the retired productions-referral; **same flat-1 token gate**, don't reopen the 2026-07-12 uniformity lock).

**Do NOT build** (constraint collisions): in-app card processing / coordinator pays-vendor-on-behalf / approves-contracts-on-behalf (money wall). Contract-builder + e-sign belongs to iteration 0032 (coordinator drafts/proposes, couple signs).

---

## 6 · Open owner sign-offs (carried from spec § 6)

1. Coordinator-recommended inquiries — keep the **flat-1 uniform** token gate (recommended) vs a per-source discount.
2. Delegated access grant shape — **per-surface flags** (recommended) vs one full grant with payments carved out.
3. Prep-then-release (P1) DPO review of coordinator guest-PII read parity.
4. `checkout: true` money-wall audit (see § 4).
5. Reconcile the dual access primitives (§ 4).

---

## 7 · Worktrees / branches (resume state)

- `setnayan-wt-coord-consent` → `feat/coordinator-lock-consent-gate` → **PR #3390 (merged)**. Safe to remove.
- `setnayan-wt-propose-lock` → `feat/coordinator-propose-lock` → **PR #3401 (MERGED 2026-07-18)**. Safe to remove *(corrected 2026-07-19)*.

**To resume a new build:** branch from `main` in a fresh worktree, symlink `node_modules` from the main checkout (`ln -sfn /Users/icecasasola/node_modules …` + `…/apps/web/node_modules`), then `tsc --noEmit` + `next lint --file` to verify. Start with **P1 (prep-then-release)** — highest leverage.

**Canonical checkout (first-hand verified this session):** `/Users/icecasasola` is the git root (`origin` = `github.com/iscasasola/setnayan-platform`, branch `main`); `apps/web/` + repo-root `supabase/migrations/` live under it. This resolves the repo-root ambiguity in `WHATS_NEXT_INDEX.md` §2/§7.1 for the coordinator stream. Migrations were **hand-allocated** with non-round prefixes (`20270729120000`, `20270729130000`) — both pushed fine past the round-`000000` guard. *(⚠ corrected 2026-07-19: "sort after 20270729130000" is stale — `origin/main` now carries migrations up to `20270823141500`; the next migration must sort after **main's current tip**, so use the `pnpm migration:new` allocator, which fetches origin/main and picks a prefix after the live tip.)*

---

## 8 · Execution metadata (for the orchestrator — conforms to [`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md) §3)

> Fan out only `parallel_safe: yes && safety_gate: NONE`. Route every other gate to the human queue. All code = fresh worktree off `origin/main` + PR (index §2). **Every P-item below adds a migration → migration mutex (index §6): serialize the P-items, re-fetch `main` between them.**

**⚠ STATUS (verified vs `origin/main` 2026-07-21 — DO NOT re-run the DONE/SUPERSEDED items):**
- ✅ **Consent gate** live (`coordinator-consent-gate.ts` + migration + in export). Flag `NEXT_PUBLIC_COORDINATOR_CONSENT_GATE_ENABLED` OFF.
- ✅ **`#gap-export` DONE** — real PRs #3467 + bug-fix #3475 (`coordinator_access_consents` now in the RA 10173 export; the miscited #3402 does not exist).
- ✅ **`#consent-revoke` DONE** — `revoked_at` wired into host removal.
- ✅✴️ **`#checkout-audit` RESOLVED** by the **consent-scoped money model** (owner 2026-07-19): `coordinator_access_consents.scopes` (migration `20270823668011`) + `lib/coordinator-money-scope.ts` guarding checkout/orders/vendors/finalizeVendor/recordDeposit. Blanket money wall is HISTORICAL.
- 💤 **`#propose-lock-trigger` + `#flag-proposelock` DORMANT** — propose-lock (PR #3401, merged 2026-07-18) superseded by the consent-scoped model; flag expected permanent-OFF.
- ✅ **RESOLVED 2026-07-21** (owner: "follow your recommendations"): the money-scope approver is the **COUPLE/HOST** (not literal guests) — matches the shipped consent-scoped code, so no code change. The consent flag flip is now gated on DPO only.

**Still genuinely actionable below:** `#reconcile-primitives`, `#flag-consent`, `#D-signoffs`, `#native-recs`. *(`#consent-autoinvite` DONE 2026-07-22 · PR #3537 — fail-closed suppression when `coordinator_consent_money` is active. `#checkout-audit` also confirmed DONE — see § 4.)* **`#P1-prep-release` (PR #3492, flag-dark — SCHEDULE slice only) / `#P2-filtered-ros` / `#P3-broadcast` / `#P4-vendor-folder` are SHIPPED flag-dark — do NOT re-run.** (P1 follow-ups still open: timeline badge · hide-already-visible control · extend prep-then-release to checklist/tasks, which has no coordinator read/write policy today.) (DONE/SUPERSEDED items stay in the block below for lineage — the statuses above override them.)

```
- id: coordinator#gap-export   title: Add coordinator_access_consents to RA 10173 data export
  type: code   depends_on: []   parallel_safe: no   # SHARES app/api/profile/export/route.ts with featured-weddings#2 → serialize
  safety_gate: NONE   touches: app/api/profile/export/route.ts
  verify: tsc + lint; live export includes the table (empty until the consent flag flips)
  gap: PR #3390's consent table was never added to the export — index §7.4 pattern (like marketing_share_consents).

- id: coordinator#consent-revoke   title: Stamp revoked_at on coordinator_access_consents when a host is removed
  type: code   depends_on: []   parallel_safe: yes   safety_gate: NONE
  touches: app/dashboard/[eventId]/hosts/actions.ts (removeHost / revokeHostInvite) + coordinator_access_consents
  verify: tsc + lint   gap: consent audit loop is grant-only; revocation not recorded.

# ✅ DONE 2026-07-22 · PR #3537 — RESOLVED by fail-closed suppression (no new lawful-basis needed):
#   when coordinator_consent_money is ACTIVE, autoInviteCoordinator returns {created:false}
#   without inserting, so no PII-sharing delegate is created without a recorded consent; the
#   couple promotes via the consent-gated manual form. Control OFF = prior auto-grant behavior.
- id: coordinator#consent-autoinvite   title: Consent capture on the autoInviteCoordinator downpayment path
  type: code   depends_on: []   parallel_safe: no   # touches finalizeVendor + lib/coordinator-grant.ts
  safety_gate: DPO_COUNSEL   # consent-at-accept vs deferred-consent is a lawful-basis question
  touches: lib/coordinator-grant.ts; finalizeVendor downpayment path   verify: tsc + lint
  gap: auto-invite creates a pending invite with no couple UI moment to consent.

- id: coordinator#propose-lock-trigger   title: DB trigger hard-blocking a coordinator's raw status→contracted write
  type: migration   depends_on: [coordinator#flag-proposelock ON permanently]   parallel_safe: no   # migration mutex + event_vendors trigger
  safety_gate: FLAG_FLIP_PROD-adjacent   # add ONLY once propose-lock is permanently ON, else it breaks flag-off = current behavior
  touches: new migration (event_vendors BEFORE UPDATE trigger)   verify: tsc + migration guard + trigger test
  gap: PR #3401 is an app-level gate only; a raw PostgREST status write still bypasses it.

- id: coordinator#checkout-audit   title: Audit what checkout:true actually reaches for coordinators (money-wall)
  type: verify+decision   depends_on: []   parallel_safe: yes   # read-only audit
  safety_gate: OWNER_DECISION   # only if it surfaces a gap needing a scope call
  touches: PERMISSION_TEMPLATES.wedding_planner_external → cart/orders surfaces (trace)   verify: grep + trace, report
  gap: PR #3401 guarded only the LOCK path; other checkout surfaces are unaudited. HIGHEST-value loose end.

- id: coordinator#P1-prep-release   title: Prep-then-release visibility flags (coordinator_only vs couple_visible)
  type: code+migration   depends_on: []   parallel_safe: no   # migration mutex; planning surfaces
  safety_gate: DPO_COUNSEL   # widens coordinator guest-PII read parity — same basis as PR #3390; BATCH into the shared counsel packet
  touches: new migration (visibility columns); tools/tasks/timeline surfaces   verify: tsc + lint + tests; RLS
  gap: — (highest-leverage build; industry's #1 coordinator feature)

- id: coordinator#P2-filtered-ros   title: Filtered run-of-show + schedule templates + bulk retime
  type: code+migration   depends_on: []   parallel_safe: no   # migration mutex; SHARES event_schedule_blocks with P3/any schedule work
  safety_gate: NONE   # email-only call-time reminders per no-SMS lock
  touches: event_schedule_blocks; schedule surfaces   verify: tsc + lint + tests   gap: —
  # ✅ SHIPPED 2026-07-20 · PR #3412 (flag-dark): migration 20270825042743 (responsible_party + responsible_vendor_ids UUID[]
  # on event_schedule_blocks, NO new RLS); lib/schedule-ros.ts (audience FILTERS over the one master — vendor/couple/guest —
  # + bulk-retime span math) + lib/schedule-templates.ts (3 wedding skeletons, load additive-into-EMPTY only); actions
  # setBlockResponsibleParty / bulkRetimeScheduleBlocks / loadScheduleTemplate (authenticated client → existing couple +
  # moderator schedule-'edit' RLS). UI behind NEXT_PUBLIC_SCHEDULE_ROS_P2_ENABLED (default OFF); vendor Brief tag-boost
  # data-gated. Owner: push migration, then flip flag. Email call-time SEND path deliberately NOT built — P3 owns it.

- id: coordinator#P3-broadcast   title: Finish day-of coordinator broadcast stub + email call-times
  type: code+migration   depends_on: []   parallel_safe: no   # migration mutex; shares schedule/day-of domain with P2
  safety_gate: NONE   touches: coordinator-broadcast-card.tsx; coordinator_broadcasts / event_broadcasts / broadcast_acknowledgments
  verify: tsc + lint; live-check   gap: broadcast card is a stub (no backend).
  # ✅ SHIPPED 2026-07-20 · PR #3415 (flag-dark): migration 20270825364600 = coordinator_broadcasts (immutable day-of
  # announcements; Pattern B member read + moderator read + admin; INSERT couple OR schedule-'edit' delegate — the same
  # authority that owns the run-of-show; NO update/delete). broadcast_acknowledgments DEFERRED (prefer-minimal — card has
  # no ack affordance). Card wired behind NEXT_PUBLIC_COORDINATOR_P3_ENABLED (default OFF = pre-P3 stub byte-for-byte):
  # server-resolved feed + composer for couple/coordinator (lib/coordinator-broadcasts{,-server}.ts + _actions/day-of-
  # broadcast.ts). Email call-times = explicit button press (the opt-in) → earliest responsible-tagged block per vendor
  # (P2 responsible_vendor_ids lens; untagged/email-less skipped), EMAIL-ONLY via lib/email.ts Resend gate — key absent
  # (prod today) = clean not_configured no-op. 12 unit tests pin the derivation. Owner: push migration, flip flag, Resend.

- id: coordinator#P4-vendor-folder   title: Per-vendor working folder (private coordinator notes vs couple-visible)
  type: code+migration   depends_on: []   parallel_safe: no   # migration mutex; SHARES the vendors domain — serialize with any active vendors/* or v/[slug] task
  safety_gate: NONE   touches: 0006 vendor records; new notes/versioning tables; vendors surfaces   verify: tsc + lint + tests   gap: —

- id: coordinator#reconcile-primitives   title: Reconcile event_members coordinator vs event_moderators wedding_planner_external
  type: decision+code   safety_gate: OWNER_DECISION
  touches: RLS + membership model   gap: two overlapping access primitives (tech-debt); target = one grant + per-surface flags.

- id: coordinator#flag-consent   title: Flip NEXT_PUBLIC_COORDINATOR_CONSENT_GATE_ENABLED
  type: flag   depends_on: [DPO ruling: biometric scope-out + decline-path basis]   safety_gate: DPO_COUNSEL + FLAG_FLIP_PROD

- id: coordinator#flag-proposelock   title: Flip NEXT_PUBLIC_COORDINATOR_PROPOSE_LOCK_ENABLED
  type: flag   depends_on: [owner accepts removing coordinators' direct lock]   safety_gate: OWNER_DECISION + FLAG_FLIP_PROD

- id: coordinator#D-signoffs   title: 5 open owner sign-offs (spec §6: token-gate uniform-vs-discount · grant shape · P1 DPO parity · checkout audit · reconcile primitives)
  type: decision   safety_gate: OWNER_DECISION

- id: coordinator#native-recs   title: Setnayan-native — coordinator→guest vendor recs + referred_by_coordinator provenance
  type: code+decision   depends_on: [coordinator#P4-vendor-folder]   parallel_safe: no   # rides the creator-economy provenance rail (referring_chapter_id)
  safety_gate: OWNER_DECISION   # label-only, NO earn (retired productions-referral); SAME flat-1 token gate (don't reopen 2026-07-12 uniformity)
  touches: chat_threads provenance; guest landing surface   gap: — (structural moat; no competitor equivalent)
```

**AUTO-OK to fan out now** (`safety_gate: NONE`): `#gap-export` (serialize w/ featured-weddings#2), `#consent-revoke` (fully parallel), `#P2`, `#P3`, `#P4` (each a migration-mutex + domain-serialize). **Read-only, safe anytime:** `#checkout-audit`. **Human-gated:** everything with DPO_COUNSEL / OWNER_DECISION / FLAG_FLIP_PROD.
