# Interim Policy — Payments (QR + Manual) & Data-Privacy / NPC-DPO Deferral

> **Effective 2026-07-24 · owner-locked (Indalecio S. Casasola II).** Standing default for the whole platform until superseded.
> This doc is the canonical home for two owner decisions made 2026-07-24 and the **living register** that replaces "block on privacy."
> **Not legal advice.** External PH counsel remains the terminal gate before the NPC lodging itself (see §2).

---

## 1. Payments — QR code + manual approval (interim)

**Default until PayMongo goes live:** every in-app payment is collected by **QR code (BDO + GCash) with manual admin approval**, per iteration `0034_payments_and_cart`.

- Customer checks out → app shows Setnayan's static **BDO + GCash receiving QR codes** + a unique 8-char Crockford reference code → customer pays externally → uploads proof/screenshot → **admin manually reconciles** (Approve / Reject-needs-more-proof / Reject) within the 24-hr SLA → service activates.
- **No automated rail is charged in V1.** The `setnayan_pay_methods` gateway rows stay `is_active=FALSE`. Commission stays **0%**.
- **PayMongo integration is DEFERRED** — it becomes the automated replacement "when the time comes" (owner 2026-07-24). Until then, do **not** gate or block any payment-touching feature on PayMongo/automated reconciliation being present. Ship the QR+manual path.
- The 3D-Plan Booking-Fee rail (`RAIL_LIVE` / PayMongo KYC) stays two-key flag-dark exactly as before — this policy does not flip it live; it only confirms QR+manual is the accepted interim rail everywhere else.

**Reading:** QR + manual is not a stopgap we apologize for — it is the sanctioned V1 rail. Build against it as the real thing.

---

## 2. NPC / DPO filing — deferred to 2027-01-01

**Owner decision 2026-07-24:** Setnayan will **submit its NPC registration + DPO designation on 2027-01-01** (next year), not before. The compliance pack (`NPC_Compliance/`) stays drafted and ready; the *act of lodging* is scheduled for Jan 1.

- In the meantime, **the public privacy posture stays true and honest** — see the guardrail in §3. Deferring the *filing* does **not** license the *notice* to misstate what we do.
- The terminal external-PH-counsel pass (minors cluster, vendor gov-ID/AMLC basis, automated fraud-suspension) still happens before the Jan-1 lodging — deferral moves the date, not the requirement.
- Filing readiness detail lives in `NPC_Filing_Status_and_Action_Sheet_2026-07-24.md`; that sheet's "what needs you" items are now owner tasks due **before 2027-01-01**, not blockers on shipping product today.

---

## 3. New default — data-privacy issues are DOCUMENTED, not BLOCKED

**Owner-locked 2026-07-24:** From this point forward, **do not block, gate, or refuse a feature because of a data-privacy / NPC / DPO concern.** The old pattern of "deferred pending DPO review / pending counsel / pending NPC" as a *hard stop* is retired for product work. Instead, for every privacy-touching change:

1. **List it** in the **Data-Privacy Deferral Register** (§4 below) — what data, what processing, what the residual concern is.
2. **Record the approval** on the **admin privacy surface** (`/admin/privacy` — the approvals/register view; build tracked in §5). Approval = owner-acknowledged, logged, dated.
3. **Provide proper documentation** — the register row + a link to any DPIA/LIA/RoPA delta so the paper trail exists for the Jan-1 filing and for counsel.

### The one non-negotiable guardrail — the public notice must stay honest
"Privacy will always be true to its statement and honest" (owner). So enabling a previously-gated processing activity is allowed **only if** the public `/privacy` notice truthfully discloses it **at or before** enablement.

- **Never ship a data-handling change that makes `/privacy` a lie.** If we turn a thing on, the notice discloses that thing (purpose, scope, opt-in/out, retention, withdrawal). That copy update ships in the same change (repo PR).
- Un-gating is a **disclose-then-enable** move, never an **enable-and-stay-silent** move. This is the line the "don't block" rule does **not** cross.
- Genuinely irreversible / high-harm handling (e.g. sharing real guests' biometric vectors across events, publishing real people's photos without a consent basis) is still surfaced to the owner in plain English before enablement — documenting it does not mean auto-shipping it. The register is where that surfacing is recorded.

**Net effect:** privacy work shifts from *gatekeeper that stops the build* to *ledger that records the build* — with public honesty as the single hard boundary.

---

## 4. The register + approval surface ALREADY EXISTS — `/admin/data-privacy`

The mechanism §3 describes is **built and live**, not a follow-up. It is the **Privacy control board** at `www.setnayan.com/admin/data-privacy` (owner-pointed 2026-07-24).

- **Table:** `public.data_privacy_controls` (migration `20270814219429...`) — one row per privacy-sensitive capability: `control_key`, `title`, `description`, `category`, `risk_note`, `status ∈ inactive|active|blocked`, `approved_by`, `approved_at`, `note`. Admin-only RLS.
- **Approval = the "apply the approve" step:** on the board, **Approve · activate** flips `status='active'` and stamps `approved_by` + `approved_at` + an optional `note`. That stamp IS the RA 10173 audit trail for the Jan-1 filing. **Turn off** / **Block** are the other two states.
- **The gate every feature reads:** `isDataPrivacyControlActive(key)` in `apps/web/lib/data-privacy-controls.ts` — **fail-closed** (missing row / error / not-`active` → `false`). So a capability is off everywhere until approved on the board — no env flag, no redeploy.
- **Code catalog:** `DATA_PRIVACY_CONTROLS` in the same lib mirrors the seed (18 controls on `origin/main`). The board also hosts the downloadable NPC document set.
- **`note` = "provide proper documentation":** use it to record the basis + a pointer to the DPIA/LIA/RoPA delta for each active control.

**This markdown doc is now the narrative policy + honesty guardrail (§3); the board is the system of record for per-capability approvals.** Don't build a parallel `privacy_deferral_register` — this is it.

### Live control states (snapshot 2026-07-24)

18 controls; all **active** except `guest_columns` and `papic_pool_gallery` (genuinely off, fail-closed, not yet ready). Active set includes the sensitive ones — `face_enrollment` (per-event only; account-wide profile stays off), `faith_religion_graph`, `dependent_minor_profiles`, `papic_geo_metadata`, `device_fingerprint`, `antifraud_trust_signals`, plus vendor/coordinator/home-signal controls.

**Honesty check (2026-07-24):** live `/privacy` (1,016 lines) discloses every active sensitive category — face/biometric, religion, minors/dependents, geolocation, device fingerprint. Guardrail (§3) satisfied at the category level. **Remaining verification:** a per-clause `/privacy` audit against each active control (scope, opt-in/out, retention, withdrawal wording) — not blocking, tracked as owner/DPO follow-up.

**Note cleanup applied 2026-07-24:** four active controls (`faith_religion_graph`, `dependent_minor_profiles`, `papic_geo_metadata`, `device_fingerprint`) still carried a stale `"Off pending DPO sign-off"` note contradicting their `active` status; rewritten to cite this policy. Note-text only — no status or data-handling change.

---

## 5. What is still a build follow-up

- **Per-clause `/privacy` honesty audit** (§4) — confirm each active control's disclosure is complete, not just present. Owner/DPO, before the Jan-1 filing.
- **Wire the remaining gates:** several catalog controls exist without a live `isDataPrivacyControlActive` call site yet (only `vendor_papic_capture` + `vendor_guest_delivery` were wired in the branch inspected). As each capability ships, read its gate so the board actually governs it. Repo work (worktree + PR).

---

## Change control

Supersede or amend only with a new owner decision, logged as a new `DECISION_LOG.md` row referencing this file. Keep §4 append-only.
