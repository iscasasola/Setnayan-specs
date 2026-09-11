# Booking Fee — Build Plan + Abuse Analysis

**Date:** 2026-07-21 · **Status:** ⚠ BUILD BRIEF — not started, not signed off
**Replaces:** the inquiry-gate / token-burn-on-accept concept (live today, see §1.2)
**Model doc:** [`3D_Plan_and_Vendor_Revenue_Model_2026-07-20.md`](3D_Plan_and_Vendor_Revenue_Model_2026-07-20.md) §3.0 — pricing, framing, and the decisions behind them
**Repo checked:** `/Users/icecasasola/setnayan-wt-propose-lock` (freshest checkout, merged `origin/main` 2026-07-18). ⚠ `setnayan-db-push` is stuck at **PR #649 / 2026-05-30** — do not read it.

---

> ## 🚨 REWRITTEN 2026-07-21 (later same day) — THE TRIGGER CHANGED AND THIS BRIEF WAS TEACHING THE RETIRED ONE
>
> **An earlier version of this file specified the fee as a receivable billed when the couple's payment ledger recorded the first payment**, with a `void` on cancellation, a monthly invoice batch, and a suspension ladder. **That model is retired.** The model doc was corrected; this file — the only document naming tables, columns, files and PR slices — was not. Anyone building from the previous version would have shipped the retired mechanism.
>
> **CURRENT MECHANISM (model doc §3.0d, owner-corrected):**
>
> > customer sends a **LOCK** → vendor accepts with a **FINALIZED PROPOSAL** whose amount computes the fee → **the vendor PAYS SETNAYAN TO SEND the finalized proposal** (a **prepaid gate**, not an invoice) → the customer **accepts the price** (handshake, no second charge) → the customer pays the **VENDOR directly, off-platform**.
>
> **This is not a wording change and the data model is not a rename.** A prepaid send-gate and a payment-triggered receivable are different shapes: the receivable version needs accrual states, an ageing invoice, dunning and a void rule; the prepaid version needs a **charge that must clear before an action is permitted**, and has no receivable, no ageing, no dunning and nothing to void. **§3 has been re-derived, not patched.** §3.1 states plainly which of the old PR slices no longer make sense.
>
> ⚠ **The old `void` rule is REMOVED, not restated.** The previous text asserted *"cancellation before any payment → `void`."* Under the prepaid gate there is nothing to void — but **what happens to a vendor who paid to send and then lost the client is an OPEN sign-off** (model doc 3d-iii-b). **No rule is asserted here.**

---

## 0 · The offer being built

> **Free unlimited inquiries. Minimal Booking Fee — from ₱50, never more than ₱4,000. You keep 98%, and more as you grow.**

**Fee = marginal brackets on the declared engagement value:**

| Slice | Rate |
|---|---|
| First ₱2,500 | ₱50 flat |
| ₱2,500 – ₱50,000 | 2.0% |
| ₱50,000 – ₱150,000 | 1.5% |
| ₱150,000 – ₱300,000 | 1.0% |
| **Above ₱300,000** | **₱4,000 flat (cap)** |

Continuous at every boundary — **nothing to shave.** Only **Setnayan-sourced** bookings are billable; **imports are free forever.**

🚨 **The cap's UNIT is an open sign-off (model doc #3c-unit).** The owner said ***"until 4k/vendor"*** and did not disambiguate **per vendor × booking · per vendor × event · per vendor outright**. **This brief assumes per vendor × event** — it has to assume something to specify a `UNIQUE` key — and every place that assumption is load-bearing is marked ⚠ **[3c-unit]**. **Do not treat it as decided.** A per-booking answer changes the ledger key; a per-vendor-lifetime answer changes it again and makes the high-water rule incoherent.

---

## 1 · What exists today (verified)

### 1.1 The pieces that already work

| Need | Exists as |
|---|---|
| Discovery surface | **`/explore`** — `apps/web/app/explore/page.tsx` (+ `_components/vendor-card.tsx`) |
| Vendor profile | `/v/[slug]` — `apps/web/app/v/[slug]/page.tsx` |
| Inquiry creation | `startServiceInquiry` — `apps/web/app/v/[slug]/inquiry-actions.ts:59` |
| **The lock (couple half only)** | `event_vendors.status = 'contracted'` via `finalizeVendor` — `apps/web/app/dashboard/[eventId]/vendors/actions.ts:636` |
| A place to put an amount | **`event_vendors.total_cost_php`** already exists (+ `transport_php`, `food_allowance_php`) |
| Attribution spine | `chat_threads.inquiry_source` + `stampThreadProvenance` — `apps/web/lib/inquiry-attribution.ts:162` |
| Per-(vendor,event) ledger pattern | `vendor_event_unlocks` — `UNIQUE(vendor_profile_id, event_id)` |
| Couple payment ledger | `event_vendor_payment_plan` + payment rows (iteration 0007) — ⚠ **no longer load-bearing for revenue**, see §1.4 |
| Periodic work, cron-free | `claim_periodic_job` / `cron_job_runs` |
| A payment gate primitive, wrong party | `apps/web/lib/payment-gated-lock.ts` — flag-off; gates the **couple's downpayment**, not the vendor's send |

### 1.2 🚨 The thing that must be removed

**We ship Bridestory's credit-gated inbox today.** The couple's inquiry is free, but `acceptInquiry` (`apps/web/lib/chat-actions.ts:328`) burns 1–3 tokens via `unlock_vendor_event`, and:

- `TIER_FREE_NO_INAPP` — **free-tier vendors cannot accept at all**
- `VERIFIED_WEEKLY_LIMIT` — verified capped at 10 accepts/rolling week
- `INSUFFICIENT_WALLET_BALANCES` — *"You need tokens to accept this inquiry"*

And `apps/web/lib/inquiry-mask.ts:8` reveals the couple's identity **only if `accepted_at` is set** — i.e. only if a token burned. **A vendor without tokens leaves a real couple in silence.** That is the exact failure the new model exists to remove, and the exact thing we planned to attack Bridestory for.

### 1.3 🚨 The gap that blocks billing

`chat_threads.inquiry_source` has `shortlist · first_pick · favorites · influencer · website · editorial · auto_build · degree` — **and no `explore` or `search`.**

The Explore card links to `/v/${slug}` with **no `?src=`** (`vendor-card.tsx:241`), and `/v/[slug]` only honours `editorial` and `favorites`.

**So an organic marketplace discovery is indistinguishable from a bare direct hit — both land as `NULL`.** You cannot bill a fee you cannot attribute. This is PR-0 for a reason.

### 1.4 🚨 THE SURFACE THE FEE IS CHARGED ON DOES NOT EXIST

This is the single most important fact in this brief and it is worse than a missing column.

| Piece the mechanism needs | State |
|---|---|
| **A two-sided lock** — customer sends, **vendor accepts** | 🚫 **Does not exist.** Shipped `finalizeVendor` is **unilateral by the couple**: it flips `event_vendors.status`. There is no vendor accept step. |
| **A finalized proposal object** attached to that acceptance | 🚫 **Does not exist.** The **Proposal Maker** is design-only; its known blocker is a missing `pricing_basis` on `vendor_package_items`. |
| **A SEND action on that proposal** | 🚫 **Does not exist** — there is nothing to send. |
| **A payment gate in front of that send action** | 🚫 **Does not exist.** `payment-gated-lock.ts` is the *couple's downpayment* at lock — **opposite party, opposite moment.** Do not reuse it; do not let anyone think it is the same gate. |

**⇒ The Booking Fee cannot be metered at all until the two-sided lock and the Proposal Maker ship.** `event_vendors.total_cost_php` is *a field that can hold a number*; it is not the billable surface. **Neither is the 0007 payment ledger** — under the retired trigger it was the billing event; under the current one it is a couple-facing feature and, at most, a cross-check. Nothing about revenue depends on it any more.

This is the model's hardest build dependency, and it reorders everything in §3.

---

## 2 · The flow, end to end

```
/explore  →  browse, filter, compare               [free, no account needed]
   │           card links /v/[slug]?src=explore    ← PR-0
   ▼
/v/[slug] →  profile · verified median · reviews · past events
   │           "Message this vendor"
   ▼
startServiceInquiry
   │  · creates chat_thread
   │  · stampThreadProvenance → inquiry_source='explore'   ← PR-0 (IMMUTABLE)
   │  · creates event_vendors row (status='considering')
   ▼
Vendor opens inbox              [FREE — no token, no tier check]   ← PR-1
   │  · identity unmasked on accept, no payment
   ▼
Couple sends a LOCK                                     [free to the couple]
   │  · event_vendors.status → 'contracted' (or a new 'lock_sent' state)
   ▼
VENDOR ACCEPTS THE LOCK + attaches a FINALIZED PROPOSAL           ← PR-2 (NEW BUILD)
   │  · proposal.amount_php  →  fee = f(amount)     [computed, NOT charged]
   │  · attribution frozen here: sourced | import
   ▼
┌──────────────────────────────────────────────────────────────┐
│  ⭐ PREPAID GATE — vendor pays Setnayan to SEND               │  ← PR-3
│     · charge must reach status='paid' BEFORE release          │
│     · import  → fee 0, auto-'waived_import', sends free       │
│     · unpaid  → the proposal simply does not send             │
└──────────────────────────────────────────────────────────────┘
   ▼
Proposal is RELEASED to the customer
   ▼
Customer ACCEPTS the price          [the handshake — NO second charge]
   ▼
Customer pays the VENDOR directly, off-platform    [Setnayan never holds it]
   ▼
Completed booking → feeds verified median + reputation             ← PR-5
```

**Three properties to hold on to, because they are what changed:**

1. **There is no receivable at any point.** The money moves before the action, or the action does not happen.
2. **Setnayan's only money event is the vendor's own prepaid send fee.** It never touches the couple↔vendor payment.
3. **Nothing downstream of the send is a billing event.** Acceptance is a handshake; the customer's payment is invisible to us.

---

## 3 · The build, in order

### 3.1 ⚠ FIRST — what the old PR plan got wrong, stated rather than patched

| Old slice | Verdict under the prepaid gate |
|---|---|
| **PR-2 · "Declared value + couple confirmation" at `finalizeVendor`** | 🚫 **NO LONGER MAKES SENSE AS WRITTEN.** It assumed the vendor types a number into `event_vendors.total_cost_php` at the couple's unilateral lock, and that *couple confirmation* is what makes the number honest. Under §3.0d the number lives on a **finalized proposal the customer receives and pays against**, so confirmation is demoted (model doc 3d-ii, sign-off 14) and the field is the wrong home. **Replaced by a genuinely bigger slice: build the two-sided lock + the proposal object.** |
| **PR-3 · `booking_fees` with `accrued → billable → invoiced → paid → void`** | 🚫 **WRONG SHAPE.** Those states model an ageing receivable. A prepaid gate needs a **charge that must clear before an action is permitted** — and it needs **one row per SEND**, not one per booking, because revisions re-send. **Re-derived in PR-3 below.** |
| **"Billable transition fires on the couple's first recorded payment"** | 🚫 **RETIRED.** The couple's payment is off-platform and none of our business. |
| **`void` on cancellation before payment** | 🚫 **REMOVED, and deliberately not replaced.** Nothing accrues, so nothing voids. What happens to a vendor who already paid to send is **model-doc sign-off 3d-iii-b, OPEN.** Do not implement a refund path before it lands. |
| **PR-4 · monthly invoice batch + autopay + suspension ladder** | 🚫 **MOSTLY GONE.** No invoice to batch, no arrears to dun, no ladder needed — non-payment self-enforces by not sending. **What replaces it is smaller and more awkward: per-send checkout + BIR documentation + the per-send gateway-cost problem (PR-4 below).** |
| **PR-5 verified median · PR-6 integrity** | ✅ **Survive, both demoted.** Neither protects the fee any more (model doc 3d-ii). They protect **positioning** and **listing accuracy**, which are real but different justifications. Re-scope before sizing. |
| **PR-0 attribution · PR-1 remove the accept gate** | ✅ **Survive unchanged in substance.** PR-0's *freeze point* moves from the lock to the proposal send. |

### PR-0 · Attribution *(still blocks everything)*

1. Add `explore` and `search` to the `inquiry_source` CHECK constraint + `apps/web/lib/inquiry-source.ts`.
2. Explore vendor card → `/v/${slug}?src=explore` (`vendor-card.tsx:241`); compare + categories surfaces too.
3. Whitelist `explore`/`search` in the `/v/[slug]` client-declared-source list (`inquiry-actions.ts:315-320`).
4. Keep it **stamped once, on brand-new threads only** — already the behaviour (`inquiry-actions.ts:298-326`), protected by `guard_thread_provenance_columns_trg`.
5. Backfill: existing `NULL` threads stay `NULL` = **not billable**. Never retro-bill.

**Definition of sourced:** a thread exists for `(couple_event, vendor)` whose `inquiry_source` ∈ {`explore`, `search`, `shortlist`, `first_pick`, `favorites`, `auto_build`, `editorial`, `influencer`, `website`} **and** it predates the proposal send. Everything else — including `NULL` and `event_vendors.source='host_manual'`/`'invite_claim'` — is an **import**.

⚠ **The freeze point moved.** It used to be *"immutable at lock."* It is now **immutable at the first proposal send for that `(vendor, event)`**, because that is the first billable moment. Subsequent revisions inherit the frozen classification — a vendor must not be able to re-classify a revision as an import.

⚠ **`inquiry_source='website'` is now ambiguous and it is a revenue question.** The owner put **vendor-website transactions in fee scope** (model doc §3.0d-scope) while **imports are free forever** (§3.0e). A visitor to the vendor's own Setnayan-hosted site is arguably both. **Model-doc sign-off 3d-iv. Do not resolve it in code.**

### PR-1 · Remove the accept gate

1. `acceptInquiry` — drop the `unlock_vendor_event` burn, the `TIER_FREE_NO_INAPP` block, and `VERIFIED_WEEKLY_LIMIT`. Keep setting `inquiry_status='accepted'`, `accepted_at`.
2. `inquiry-mask.ts` — unmask on accept regardless of tier or balance.
3. Retire `INSUFFICIENT_WALLET_BALANCES` from this path.
4. Leave `vendor_event_unlocks` in place as a **historical ledger**; stop writing new burns.
   🔒 **Do NOT drop it, and do not drop any token table.** The owner retired the **currency**, not the **schema** — *dormant, not deleted* (model doc §4.4a). A schema drop is a separate change with its own review and its own owner sign-off; it is **not** a cleanup to fold into a fee PR.
5. Anti-spam `inquiry-gate` (flag `NEXT_PUBLIC_INQUIRY_GATE_ENABLED`) stays as-is — different concern, still dormant.

**Ship behind a flag.** Removing the gate before the fee exists is a free-for-all period. ⚠ **That window is now LONG, not short** — the fee needs PR-2, which is a build, not a wiring change (§1.4). The old plan sequenced PR-1 late to keep the window brief; that is no longer possible, so **the window must be a deliberate, measured, communicated launch policy** rather than a gap to minimise. See §6 #7.

### PR-2 · ⭐ THE TWO-SIDED LOCK + THE FINALIZED PROPOSAL *(the real work — this is a build, not a field)*

**Everything else is cheap. This is not.** There is no vendor-accept step and no proposal object today (§1.4).

1. **Vendor-side acceptance of the lock.** Today `finalizeVendor` is unilateral. Add the vendor half: a lock the couple *sends*, which the vendor *accepts*. ⚠ Decide whether this is a new `event_vendors.status` (`lock_sent` → `contracted`) or a separate handshake row — **the existing `contracted` value is already written unilaterally in prod**, so a naive reinterpretation re-labels live rows. Additive states only.
2. **`vendor_proposals`** — the finalized proposal, and the object the fee is computed from:

   | Column | Note |
   |---|---|
   | `id`, `vendor_profile_id`, `event_id`, `event_vendor_id`, `thread_id` | |
   | `amount_php` | **the fee base**, and the number the customer pays against |
   | `inclusions` (jsonb) | mandatory — *"what is included in your bundle?"*; an amount with no inclusions is unauditable |
   | `status` | `draft` · `fee_pending` · `sent` · `accepted` · `declined` · `withdrawn` · `superseded` — ⚠ **no `void`** |
   | `supersedes_id` | revision chain, append-only; a revision is a **new row**, never an UPDATE |
   | `sent_at`, `accepted_at`, `declined_at` | |
   | `schedule_version` | the fee schedule in force when this row was priced |

3. **The SEND action is the chokepoint.** It must be a single server action that (a) resolves the fee, (b) requires a cleared charge, (c) releases the proposal. **If sending is possible by any other path, the fee is not enforced** — this is the one invariant worth a dedicated test.
4. **One number, not two.** `vendor_proposals.amount_php` is the declared value, the customer's price, and the median input. Do not add a second "declared to Setnayan" field — the entire self-punishing property of the model (§3.0d-ii) depends on there being only one.
5. **Couple confirmation is DEMOTED, not deleted.** The customer's *acceptance* of the proposal is the handshake. Keep an explicit accept action and timestamp for dispute history — but **do not sequence the revenue model behind a confirmation SLA**, and **do not build the old `event_vendor_declarations` table**; the proposal row is that record now.
6. ⚠ **Known upstream blocker:** the Proposal Maker's missing `pricing_basis` on `vendor_package_items`. Resolve it here or PR-2 stalls.

⚠ **The old PR-2's "unconfirmed-declaration timeout" decision (bill at 14 days? never?) is MOOT.** There is nothing to bill later — the fee was already paid before the customer saw anything.

### PR-3 · The prepaid gate: fee computation + charge ledger

1. **`lib/booking-fee.ts`** — a **pure deterministic function** (Rule 1: no LLM, no per-call cost), unit-tested at every boundary: `2,500 → ₱50`, `2,501 → ₱50.02`, `50,000 → ₱1,000`, `150,000 → ₱2,500`, `300,000 → ₱4,000`, `>300,000 → ₱4,000`.
2. **Version the schedule.** `schedule_version` on every priced row. A fee is computed at send and never recomputed, so a future reprice cannot silently rewrite history.
3. **`booking_fee_ledger`** — the per-relationship aggregate. ⚠ **[3c-unit]** `UNIQUE (vendor_profile_id, event_id)` **assumes the cap is per vendor × event.**

   | Column | Note |
   |---|---|
   | `vendor_profile_id`, `event_id` | ⚠ **[3c-unit]** the uniqueness key |
   | `attribution` (`sourced` \| `import`), `attribution_thread_id`, `attribution_frozen_at` | frozen at first send, immutable |
   | `highest_declared_php` | ⚠ **only meaningful if the high-water rule is confirmed** — model-doc sign-off **3m-b is OPEN**. Ship the column nullable and **do not implement delta billing until it lands**; recording the high-water mark is harmless and reversible, charging on it is not. |
   | `fee_paid_total_php` | what has actually cleared, across all sends |
   | `cap_reached_at` | once `fee_paid_total_php` = cap, later sends compute to ₱0 |

   **Key it on the ledger, NOT on `event_vendors` rows** — `event_vendors_unique_marketplace_pick_per_event` is **partial** (excludes `archived_at IS NOT NULL`, does not cover free-text `marketplace_vendor_id IS NULL` rows), so archive-and-re-add would double-charge or reset. Same reasoning that made `vendor_event_unlocks` the right shape.

4. **`booking_fee_charges`** — **one row per SEND ATTEMPT.** This is the table the old `booking_fees` should have been.

   | Column | Note |
   |---|---|
   | `proposal_id`, `ledger_id` | |
   | `computed_fee_php` | f(this proposal's amount) at `schedule_version` |
   | `amount_charged_php` | what this send actually costs. **Equals `computed_fee_php` for a first send.** ⚠ If 3m-b confirms, a revision charges `f(high-water) − fee_paid_total`, floored at 0 and capped. |
   | `status` | `pending` · `paid` · `failed` · `expired` · `waived_import` — ⚠ **no `void`, no `refunded`** until sign-off 3d-iii-b lands |
   | `gateway`, `payment_ref`, `paid_at`, `failed_reason` | |

5. **`attribution='import'` → `computed_fee_php = 0`, `status='waived_import'`, proposal sends free.** Still written, so imports are countable — free must be *measured*, since §3.0e calls free imports the growth engine.
6. **The gate itself:** the send action refuses unless a `paid` or `waived_import` charge exists for that exact `proposal_id`. Charges expire (`pending → expired`) so an abandoned checkout does not leave a permanently sendable proposal.
7. **Write via `after()` where possible — cron-free.** But note: **the charge lifecycle is gateway-callback-driven, not periodic.** The one genuinely periodic job is expiring stale `pending` charges → `claim_periodic_job`.

### PR-4 · ⚠ Money-in: per-send checkout, and the problem it creates

**This is no longer "invoicing + collection." There is nothing to collect.** What is left is: take a small payment at a moment of friction, document it for BIR, and survive the unit economics.

1. **Confirm the rail — this is now BLOCKING, not advisory.** **Maya is BUILT-but-dormant** (needs owner KYC + a `'paid'` webhook); PayMongo is only "under evaluation"; Setnayan Pay rails are all `is_active=FALSE`. **Without a live gateway on the send action there is no fee at all.**
2. 🚨 **THE PER-SEND GATEWAY PROBLEM — size it before designing the UI.** Monthly batching existed because ₱15 on an ₱8,000 invoice is 0.2%. **Charging per send destroys the batch.** At the ₱50 floor, card/e-wallet processing runs ~₱15–35 — **30–70% of the fee, and on the smallest bookings possibly more than it.** Options, none chosen (model-doc sign-off **3e-ii**):
   - a **prepaid fee balance** the vendor tops up — works, and is awkward days after retiring tokens;
   - **absorb** processing below a threshold;
   - a **minimum charge** — reprices the published floor, so it collides with the *"from ₱50"* headline;
   - **settle small fees on the subscription invoice** — re-introduces a receivable for exactly the cases where it is cheapest to carry.
3. **Never show "fee + processing" as two lines** — surcharge pattern, card-scheme/BSP exposure. Absorb or quote inclusive.
4. **BIR documentation.** Setnayan issues an **EOPT "Invoice"** (not an OR) for booking-fee income. The old monthly-batch rationale is gone, so decide: a document per charge, or a monthly summary per vendor for the same charges. ⚠ **VAT-inclusive vs VAT-added must be decided BEFORE the schedule is published** (₱3M tripwire at ~300–500 weddings/yr).
5. **2307 / EWT:** a TWA that withholds must control the payment — **structurally incompatible with a prepaid gate**, since the vendor is paying *us*, in advance, through a gateway. ⚠ The old "manual settlement for TWA vendors" answer was designed for an invoice; **re-derive it against a prepaid charge.** It may be simpler (the vendor is the payer, not the payee, so there is nothing for us to be withheld *from*) — confirm with the accountant rather than assuming.
6. 🚫 **NO suspension ladder for fee non-payment.** Non-payment self-enforces: the proposal does not send. A ladder that darkens a booth over an unpaid fee is punishing a debt that cannot exist. *(Subscription dunning is a separate, unaffected concern.)*

### PR-5 · Verified median *(demoted — positioning, not fee protection)*

1. Roll accepted proposal amounts into a **median (or range)** per vendor per category.
2. **Minimum 3 confirmed bookings** before anything shows; until then their own stated "from" price stands.
   ⚠ **This threshold and the proposed *"minimum count before a vendor can change segment"* (model doc §3.0m-e) are THE SAME KNOB.** One number, not two. §3.0m-e is an **unconfirmed proposal** — do not implement it, but do not implement a *conflicting* threshold either.
3. ⚠ **Which bookings count is OPEN.** §3.0m-e proposes **completed-and-reviewed** rather than merely accepted, as the mitigation against staged over-declaration (§5, C2). **Not confirmed.** Build the aggregation so the predicate is one changeable definition, not scattered across queries.
4. **Excludable non-market bookings** (family rate, comped, off-season) — flagged, capped in number, outside the signal. Without this, vendors stop discounting *or* stop declaring.
5. Feed search/budget matching, Setnayan AI budget planning, Merkado's build-solver, price-position intel.
6. Trim outliers. Never a single point.
7. ⚠ **Whether any of it is shown to COUPLES is open** — model-doc sign-off 13b. Build the internal signal; do not build a public surface on spec.

### PR-6 · Integrity *(re-scoped — most of its original target is gone)*

Deterministic scoring into an admin review queue — **never auto-punish.** Reuse the existing `fraud_signals` / `integrity_flags` shadow-mode pattern.

⚠ **Most of the old signal list targeted under-declaration, which is now largely self-punishing** (model doc §3.0d-ii): the declared number *is* the proposal the customer pays, so shrinking it means charging the customer less by the same amount. **Two targets remain, and they are the two the model does not defend against:**

| Target | Signal | Needs sample depth? |
|---|---|---|
| **Off-platform substitution** (token proposal in-app, real deal outside) | Proposals persistently far below this vendor's own card / own history | after ~3 |
| **Off-platform substitution** | Inclusions match a pricier catalog package | no — works on vendor #1 |
| **Staged over-declaration** (§5 C2, the mirror risk) | Duplicate-event fingerprint · `identity_clusters` overlap between the couple account and the vendor | no — `identity_clusters` **already computes** this |
| **Staged over-declaration** | Accepted proposal with no completion, no review, no downstream event activity | after the event date |
| Listing accuracy (product concern, not fee) | Declared below their own card floor | no |
| ~~Couple's ledger disagrees with the declaration~~ | 🚫 **Retired** — the ledger is no longer the billing surface | — |
| ~~Category × location × season percentile~~ | 🚫 **DELETED by owner decision 8** — no market comparison, not even internally | — |

⚠ **Competition-law guard (PH Competition Act):** never *"your price is below market."* Flag **consistency, never conformity** — *"your declared amount doesn't match your card."* Market comparison is **not performed at all** (owner decision 8). **Budget vendors are market coverage you want.**

---

## 4 · Correcting an assumption

> *"wedding event can only be done once per account, correct?"*

**Not reliably.** A wedding guard exists (`apps/web/app/dashboard/(account)/create-event/wedding-guard.ts:49`) but:

- It is **app-layer only** — migration `20270821100000_life_event_gate_honoree.sql` adds **no unique constraint, no check, no trigger**; the file says so explicitly.
- **Wedding is excluded from the life-event gate's type list** (`debut, christening, birthday, graduation, gender_reveal`) — it has its own older, weaker guard.
- **Anonymous-draft users skip it entirely** (`onboarding/wedding/actions.ts:366` — `if (!user.is_anonymous && …)`).
- It reads **one user's rows only** (`life-event-guard.ts:51-57`) — **no cross-account honoree or person matching anywhere.**
- The slot **frees on archive**, immediately.

**It is a UX de-duplication device inside one account, not an anti-abuse control.** Do not build fee integrity on top of it.

---

## 5 · Bypass analysis

> ⚠ **Re-derived against the prepaid gate 2026-07-21.** Under the retired trigger the attacker's goal was *avoid the invoice*. Under the prepaid gate it is *avoid the send gate* or *exploit the cap*. Those are different attacks and one of them is new.

### Vendor-side

**V1 · Never send a finalized proposal in-app — take the lead, quote off-platform.** *The main leak, and it got easier.*
Under the retired trigger the vendor had to avoid recording a payment. Now they must avoid using our proposal tool at all — which, until the Proposal Maker is genuinely good, is the path of least resistance. Countered structurally, not by policing: reputation flows **only** through recorded bookings (reviews, verified median, past events, ranking, booth). A vendor who never sends has an empty profile and **no verified price** — a visible weakness beside competitors who have one. **The proposal becomes the credential they want, not a toll.** Force scales with how much Setnayan matters: weak at 63 events, absolute at 6,000. **Expect leakage early; do not chase it.**
⚠ **Corollary for PR-2: the Proposal Maker must be worth using on its own merits.** A fee attached to a tool nobody wants collects nothing.

**V2 · Route sourced couples as "imports."**
Attribution is **system-determined and immutable at first send**. If the couple inquired via Explore, the thread exists and cannot be erased. The vendor must intercept *before any on-platform contact* — the browse-then-Facebook path, already accepted (policing costs more than a missed ₱1,400). ⚠ **But the `website` origin is a live ambiguity** the owner created and did not resolve — see PR-0 and model-doc 3d-iv.

**V3 · Register a second vendor account.** ⚠ **Wide open today.**
`business_name`, `contact_email`, `contact_phone` are **not unique**; only `user_id` and the URL slug are, and slug collision is trivially dodged (`acme-studios-2`). **Verification documents are not deduped at all** — no unique index and no extracted number column on `dti_certificate_r2_key`, `bir_2303_r2_key`, `mayors_permit_r2_key`, `government_id_r2_key`, or `persona_inquiry_id`.
- **What stops it:** everything reputational is `vendor_profile_id`-scoped with `ON DELETE CASCADE`, and **there is no account transfer or merge feature anywhere.** A new account starts at zero. *This is the strongest anti-cycling force in the system, and it is purely economic.*
- ⚠ **[3c-unit] It gets a new payoff if the cap is per-vendor-lifetime or per-vendor-period** — then a second account buys a fresh cap. Under per-vendor-per-event it buys nothing. **The cap's unit changes the value of this attack**, which is another reason #3c-unit is not cosmetic.
- **Fix (cheap, high value):** extract and uniquely index the **DTI / BIR TIN / mayor's-permit number** at verification. One index closes this *and* the pre-existing `vendor_additional_branch` ₱999/28d SKU evasion.

**V4 · Under-declare.** ✅ **Largely self-defeating now.** The declared amount *is* the proposal the customer pays against, so under-declaring means under-**charging** by the same amount (model doc §3.0d-ii). Residual: the **token-proposal substitution** below.

**V4b · Under-declare, then revise UP after.** *(The owner's own stated fear.)*
⚠ **Currently OPEN, not closed.** The proposed **high-water delta rule** (model doc §3.0m-c) makes it save exactly ₱0 — but it is an **assistant proposal the owner did not confirm**. **Until 3m-b lands, a revision path is unspecified and this bypass is live.** Do not ship proposal revisions without a decided revision-billing rule; that would be the bypass, shipped.

**V4c · 🚨 Substitute a token proposal.** *The main evasion path, unsolved.*
Pay the fee on a deliberately small proposal — ₱5,000 for "coordination" — send it, then contract the real ₱120,000 job off-platform. It defeats the self-punishing logic (the vendor is charging in full, elsewhere), defeats couple confirmation (the proposal is genuinely what it says), and survives decision 8 (no market comparison). **What remains against it:** self-consistency across the vendor's own proposals (PR-6), and — newly — **the customer's own interest**: per owner decision 10, protections scope to the declared amount, so a couple accepting a ₱5,000 proposal for a ₱120,000 job is knowingly waiving recourse on ₱115,000. **That is the first real reason for the couple to refuse.** ⚠ Both are slow, and the second only works if couples are told (model-doc sign-off 3m-a).

**V5 · Split one engagement across two accounts to reach cheaper brackets.**
✅ **Self-defeating.** The declining schedule punishes it: ₱300,000 as one proposal = **₱4,000**; as 2 × ₱150,000 = **₱5,000**. Splitting costs ₱1,000 *more*. The regressive curve is its own anti-splitting device. ⚠ **[3c-unit]** — this holds only if the cap does not apply per-booking; under a per-booking cap, splitting is neutral rather than punished.

**V6 · Archive + re-add to double-charge or reset.**
`event_vendors_unique_marketplace_pick_per_event` is **partial**. **Mitigated by keying the ledger on `(vendor_profile_id, event_id)`**, not on `event_vendors` rows. Do not key the fee on `event_vendors`.

### Couple-side (as collusion partner)

**C1 · "Make a new account and I'll add you as an import."** ⚠ **Still the cleanest under-declaration bypass, undetectable today.**
No duplicate-event detection exists anywhere — the only unique index on `events` is the slug.
- **Why it mostly won't happen:** the ask is embarrassing, adds friction, and saves ~₱1,400. ⚠ **And it now costs the couple something concrete** — decision 10 scopes their protections to the declared amount, so an off-the-books booking is an unprotected one.
- **Cheap countermeasures:** duplicate-event fingerprint (same `event_date` + venue + honoree names across accounts) · **wire `identity_clusters`**, which **already computes** device/address/payment-sender linkage (`20270516600000_identity_clusters_phase2.sql`) but is read only by shadow-mode detectors · keep the fee small enough that the ask isn't worth making (**already true by design**).

**C2 · 🚨 NEW — the staged OVER-declaration.** *(The mirror risk, model doc §3.0m-d.)*
Because the fee caps at ₱4,000 at ₱300,000, **the marginal fee rate above ₱300,000 is ZERO**. A vendor and a friendly "couple" can run lock → ₱1,000,000 proposal → acceptance with **no money changing hands**, for a total cost of **₱4,000**, and buy placement in the top market segment (owner decision 11). It defeats **all three** honesty forces at once: force 1 has no under-declaration to catch, force 2 is irrelevant (a complicit customer needs no recourse), and force 3 is the *reward*, not the deterrent.
- **Why it can't be done on a live booking:** the customer must actually accept and pay the inflated price, and inflated proposals lose real deals.
- **Detection surface (PR-6):** `identity_clusters` overlap between the couple account and the vendor · accepted proposal with no completion, no review, no downstream activity · an event whose only vendor is the one it flatters.
- ⚠ **Proposed mitigation — median of COMPLETED-and-REVIEWED bookings + a minimum count before segment change — is model-doc §3.0m-e and is NOT CONFIRMED.** Do not build it as a rule.

**C3 · Couple never accepts the proposal.** Not a bypass — **the fee is already paid.** It is instead the vendor's grievance, and the refund question is **model-doc sign-off 3d-iii-b, OPEN.**

### What is *not* a vector

- **Couple multi-accounting for its own sake** — couples pay no booking fee.
- **Boundary shaving** — the continuous schedule removed the cliff; shaving ₱1 saves 2 centavos.
- **Cancelling to dodge the fee** — there is nothing to dodge; the money moved at send.

---

## 6 · Open decisions

> Items marked **[model]** are owner sign-offs held in `3D_Plan_and_Vendor_Revenue_Model_2026-07-20.md` §6. They are listed here because **they block code**, not because this file owns them.

| # | Decision | Why it matters |
|---|---|---|
| 1 | **[model #3c-unit]** 🚨 **Is the ₱4,000 cap per vendor × BOOKING, per vendor × EVENT, or per vendor outright?** | Sets the ledger's `UNIQUE` key, the revenue estimate, whether V3 and V5 are attacks at all, and whether a high-water rule is even coherent. **Nothing in PR-3 can be finalised without it.** |
| 2 | **[model #3m-b]** 🚨 **The high-water delta revision rule — confirm or reject.** ⚠ **Assistant proposal, NOT owner-decided** | Until it lands, **proposal revisions have no billing rule** and V4b is live. Do not ship revisions without it. |
| 3 | **[model #3d-iii-b]** 🚨 **Refund or credit if the customer walks after the vendor paid to send?** | Decides whether `booking_fee_charges` needs a `refunded` state at all. **Do not implement one on spec.** Decide together with #2 — both are money paid on a deal that did not land as declared. |
| 4 | **[model #3d-iv]** 🚨 **Where does the prepaid gate sit on the SHORTLIST and VENDOR-WEBSITE paths?** | The owner put both in fee scope; neither has a proposal-send chokepoint. Also needs the **"imported client" vs "came through your Setnayan website"** boundary, or §3.0e's free-forever promise grows an asterisk. |
| 5 | **[model #3e-ii]** 🚨 **Per-send gateway economics** — processing can be 30–70% of a ₱50 fee | Blocks PR-4's whole shape (prepaid balance? absorb? minimum charge? settle on the subscription invoice?). |
| 6 | ✅ **DECIDED 2026-07-23 — PayMongo.** (Superseded Maya, which was already coded-but-dormant.) PR-4 is now a greenfield PayMongo integration: payment-intent/checkout + a `api/webhooks/paymongo` handler (503 until `PAYMONGO_WEBHOOK_SECRET`, HMAC-verify, on `payment.paid` → `booking_fee_settle_charge`). ⚠ **Still owner-BLOCKING:** PayMongo account + KYC + API keys + webhook secret. The gate's rail-live key is now the rail-agnostic `NEXT_PUBLIC_BOOKING_FEE_RAIL_LIVE` (PR #3572). | **Blocking on owner KYC — no gateway, no fee.** |
| 7 | **How long is the free-for-all window** between PR-1 (gate off) and PR-3 (fee on)? | ⚠ **It is now long by necessity** — PR-2 is a build. This must be a stated launch policy, not an accident. |
| 8 | **VAT-inclusive or VAT-added** — decide **before publishing** the schedule | ₱3M tripwire at ~300–500 weddings/yr; repricing a public table later is the ugly version. |
| 9 | **BIR document cadence** — an Invoice per charge, or a monthly summary? And **re-derive the TWA/2307 path against a prepaid charge** | The old "manual settlement" answer was designed for an invoice we raise; here the vendor is the payer. Confirm with the accountant, don't assume. |
| 10 | **Unique index on verification document numbers** (DTI/TIN/permit) | Closes V3 *and* the pre-existing branch-SKU evasion. |
| 11 | **Duplicate-event fingerprint + wiring `identity_clusters`** | The only real answer to **C1 and C2** — and C2 (staged over-declaration) is new and otherwise undetected. |
| 12 | **[model #3m-a]** **How is declared-amount-scoped protection disclosed to couples?** | Force 2 only works if the couple *knows*. It also withdraws protection from consumers who may be victims — needs consumer-facing copy and probably counsel. |
| 13 | **"0% commission" retirement** across `Pricing.md`, ground-truth doc, live public copy | The old claim is still what's published. |
| 14 | ⚠ **Do NOT publish *"you pay when your client says yes."*** **[model #3d-iii-a]** | The fee is charged at send, before the client says anything. Copy is **suspended**, not approved. |

---

## 7 · Suggested order

**PR-0 → PR-1 → PR-2 → PR-3 → PR-4 → PR-6 → PR-5**

**Why this differs from the previous order.** The old sequence (`PR-2 → PR-0 → PR-3 → PR-1 → …`) put confirmation infrastructure first because four mechanisms rested on it, and put PR-1 late to keep the free-for-all window short. **Both premises are gone:** confirmation is demoted (model doc 3d-ii), and PR-2 is now a *build* — the two-sided lock and the Proposal Maker — so it cannot go first without stalling everything cheap behind it, and the window cannot be short.

- **PR-0 first** — attribution is cheap, blocks all billing, and the earlier it lands the more threads carry a usable source when the fee turns on. Never retro-bill.
- **PR-1 second** — it is a pure removal, it fixes a live couple-harm today (a real couple sitting in silence), and it does not depend on the fee existing.
- **PR-2 third and it is the long pole.** Nothing about revenue happens until the proposal object and its send action exist. Size it honestly; do not let it be estimated as "add a column."
- **PR-3 fourth**, immediately behind PR-2 — the gate is meaningless without something to gate, and PR-2 is dangerous without it (a send path that ships ungated teaches the habit of free sending).
- **PR-4 fifth**, but **start #5/#6 (gateway + per-send economics) during PR-2** — the KYC lead time is owner-dependent and will otherwise become the critical path.
- **PR-6 before PR-5** — integrity now has two live targets (token-proposal substitution, staged over-declaration) while the median is a positioning feature that needs volume this platform does not yet have.

**Ship the interactive fee schedule (slider + dual-axis chart, built 2026-07-21) as the vendor pricing page alongside PR-4.** It is the proof behind the transparency claim, and no PH competitor publishes anything comparable. ⚠ **Its copy must say *"you pay to send your final proposal"*** — not *"you pay when you win"* (open sign-off #14).
