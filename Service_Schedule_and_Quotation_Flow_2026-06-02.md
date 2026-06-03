# Service Schedule & Quotation Flow — design lock (2026-06-02)

**Status:** Design-locked · **V1.x post-pilot** (V1 scope is locked — this is the build target, not shipping now).
**Owns / touches:** cross-cutting — 0006 (vendors), 0019 (chat/inquiry), 0021 (couple dashboard), 0022 (vendor dashboard), 0034 (orders/token), 0028 (email), 0007 (budget tracking).
**Parent designs:** [Schedule_Matrix_and_Date_Finder_2026-06-02.md](Schedule_Matrix_and_Date_Finder_2026-06-02.md) (availability convergence + capacity + eyeing) · [Vendor_Match_Personalization_2026-06-01.md](Vendor_Match_Personalization_2026-06-01.md) (inquiry → token → reveal · §5b certs · §7b fan-out). This doc makes the **end-to-end engagement lifecycle** concrete and locks the **scheduling-commit** + the **vendor-issued quotation**.

---

## The one-line idea

A service appears to a customer **only if it shares a usable date** with them. The customer **requests**; the vendor **approves**. The booking is committed **when the vendor approves the lock — never when money moves** (money is entirely off-platform). Pricing is a **vendor-issued, versioned, customer-approved quotation** tailored to the customer's request. Setnayan provides the tools for the two to navigate together; it does **not** verify or process their payments.

## Plain-English glossary

- **Booking request (inquiry)** — the customer shortlists/inquires a service. The vendor gets **Accept / Decline**.
- **Token** — the vendor **pays a token to Accept** a booking request. Paying the token opens the chat **and reveals both names** (refines the hybrid-anonymity trigger — reveal moves from "first chat reply" → "token paid").
- **Whitelist** — the vendor's list of **accepted-but-not-yet-locked** customers for a date. Pending demand. **Informational — it does NOT block the date.**
- **Lock request** — the customer commits the deal. The vendor **approves** it (after declining competitors, §T1.4). Approval = the booking is **confirmed** and a slot is **consumed**.
- **Quotation** — the vendor-issued, versioned, customer-approved pricing instrument for that specific request (§T2).

---

## The 7 locked decisions (owner, 2026-06-02)

| # | Decision | Note |
|---|---|---|
| 1 | **A date is "taken" at vendor-approved-lock — NOT at payment.** | They've agreed to terms; Setnayan never checks payment. Commitment = a Setnayan-observable, vendor-controlled signal (not off-platform, self-reported money). Supersedes the locked "capacity decrements on `deposit_paid`" (Schedule Matrix §2 + lock/delete/overlap Rule 4). |
| 2 | **A lock request has NO system auto-expire — it stays whitelisted/pending until the vendor approves; the vendor is nudged not to drag it.** | *(Revised owner 2026-06-02 from the earlier 48h-auto-expire reading.)* No auto-approve, **no forced expiry**. While pending, the customer **stays whitelisted** (a live candidate). Never stranded — a pending lock is non-binding, so the customer can **withdraw anytime** + pursue another vendor; **one active lock request per category** (T1.4a). |
| 3 | **Whoever the vendor approves wins — but the vendor cannot lock anyone while other requests are pending. They must explicitly decline the others first.** | A customer never loses silently. The decline is a deliberate, acknowledged "no," not a passive slot-fill side-effect. Multi-slot vendor: decline everyone beyond who they're taking, then approve. |
| 4 | **Schedule is the hard gate — a service won't show unless a date is mutual.** | Hide a vendor only when **confirmed-busy on ALL the customer's candidate dates**. An **unfilled calendar = "possibly mutual" → still shows** ("availability to confirm"). The DATE filter is a true hide (not "Expand search"); the *other* hard filters (area · pax · faith · certs) still route to Expand per Vendor_Match §7. |
| 5 | **Customer requests, vendor approves; they chat first, then the vendor issues a quotation tailored to the specific request.** | Confirms the structured vendor-issued quotation as a V1.x build (owner-approved feature expansion). |
| 6 | **Reveal happens right after the vendor pays the booking-request token.** | Token payment is the reveal trigger (before any message). Refines hybrid-anonymity ("first chat reply" → "token paid"). |
| 7 | **Setnayan only provides tools to navigate together — it has no means to check payment.** | Vendor↔customer money is **off-platform + untracked-as-truth**. The "payment status" on a service page is what *they* record/observe, not a Setnayan-verified state. Scheduling commitment and payment are **decoupled** (see §3). |

---

## Track 1 — the schedule lifecycle (no-overlap)

A 3-layer demand funnel on the vendor's calendar, all using Setnayan-observable signals:

| Stage | Trigger | Vendor calendar | Blocks the date? |
|---|---|---|---|
| **Discovery** | service shares ≥1 usable date with the customer (§T1.5) | — | — |
| **Booking request (inquiry)** | customer shortlists/inquires → **Accept / Decline** | auto-populates (informational demand signal) | no |
| **Accepted** | vendor Accepts + **pays token** → **chat opens + names reveal** → on **whitelist** | whitelisted (pending) | **no** (informational) |
| **Lock requested** | customer commits the deal | pending-lock (≤48h, §T1.3) | no |
| **Confirmed** | vendor **approves the lock** (after declining competitors, §T1.4) | **slot consumed** | **yes — when slots run out** |

### T1.1 · Whitelist = informational, not a hold
Multiple customers can be whitelisted for the same date. The whitelist is the vendor's pending-demand list; it **does not block** the date. A slot is only consumed at **Confirmed** (vendor-approved-lock). This keeps capacity honest (Schedule Matrix §2: a date blocks only when slots run out).

### T1.2 · Capacity
`vendor_profiles.daily_booking_capacity` (default 1) = how many weddings the vendor can serve that date. A **Confirmed** booking consumes one slot. Date flips to **Busy** when confirmed bookings reach the limit (surface "1 slot left" while one remains). Slot consumed at vendor-approved-lock — **not** at any payment.

### T1.3 · The 48h pending-lock window (decision 2)
Customer locks → request is **pending**, vendor is **nudged**, ceiling **48h**. No auto-approve. At 48h unactioned → **auto-expire** (releases back to whitelist; the customer is freed to lock another vendor — never stranded waiting). While pending, the customer's other candidate dates are **not** released.

### T1.4 · The decline-the-others-first rule (decision 3 — the strongest new rule)
**A vendor cannot approve a lock while competing lock-requests are still pending for that slot. They must explicitly decline the non-chosen requests first, then approve the winner.**

- Capacity 1: decline all others → lock the one.
- Capacity N: decline everyone beyond the N they're taking → lock the rest.
- **Why:** no customer loses the lock silently or "for no reason." A loss is always a **deliberate, acknowledged decline** by the vendor, surfaced to that customer (with an optional reason note — *whether the reason text is mandatory is the one small sub-decision, §6 flag*).
- **System enforcement:** the slot cannot be consumed (and the "no longer available" cascade cannot fire) until the vendor has explicitly resolved (declined) the competing pending requests.
- A declined customer is **immediately freed** (knows the outcome) — and if that was their only candidate date for the category, the service **disappears from their list** + a "no longer available for your date" notice (this is the locked eyeing-signal "✓ Booked" tier, now triggered by an explicit decline rather than a silent fill).

### T1.5 · Discovery — schedule is the hard gate (decision 4)
A service shows **only if it shares a usable date** with the customer's candidate set:

| Vendor availability on the customer's candidate dates | Shows? | Label |
|---|---|---|
| ✅ Confirmed-free on ≥1 candidate date | yes | "Free on this date" / "1 slot left" |
| ◇ No conflicts on file (unfilled calendar) on ≥1 date | **yes** | "availability to confirm" |
| ✗ Confirmed-busy on **all** candidate dates | **no — hidden** | — (not Expand) |

The **date** filter is a true hide (per decision 4 — "won't show unless mutual"). An **unfilled calendar is treated as possibly-mutual and still shows** — otherwise cold-start hides almost every vendor. The *other* hard filters (area, pax, faith, certs) still route to **Expand search** with a reason (Vendor_Match §7); only the date dimension hides outright.

### T1.6 · Couple-side delete-gating + the 7-day stale nudge (owner-locked 2026-06-03)

The couple seeds inquiries from the **one-tap-confirm fan-out** ([Vendor_Match_Personalization_2026-06-01.md](Vendor_Match_Personalization_2026-06-01.md) §7b.1) — Setnayan reaches out, on the couple's behalf, to the best-fit vendors in each onboarding-picked category. Because **we** opened that door, the couple can't slam it shut the same second: a vendor with a live inquiry gets a fair window to respond before the couple may remove them. This is the couple-side companion to the fair-exposure rule (Vendor_Match §7b.2).

**The gate.** A couple **cannot delete** a vendor whose inquiry is still `requested` (pending · no vendor response) until **one** of:
- **(a) the vendor accepts** — `requested → accepted` (token-pay + name-reveal + chat opens, decision 6). The relationship is now live, so removal is **free** thereafter (same as any considering / shortlisted vendor).
- **(b) the inquiry goes 7 days stale** — no vendor response within 7 days of the send (or of the last nudge). The stale state **unlocks delete** and raises the prompt below.

A vendor **decline** (`requested → declined`) also ends the relationship — the couple is freed and the vendor drops per T1.4 (an explicit, acknowledged "no," never a silent disappearance).

**Before the gate clears** (pending · < 7 days · not yet accepted): the **Remove** control doesn't vanish — it **soft-explains** with a countdown: *"We've reached out to {vendor} for you — give them a moment. You can nudge or remove them in {N} days."* (default · §6 flag e). No dead button, no instant ghost.

**At 7 days stale** — the couple gets a decision prompt. Owner source copy (verbatim): *"xxx has not responded to your inquiry. do you want to delete them or we nudge them?"* → two actions:
- **Delete** → the vendor is removed (stale condition met · gate cleared).
- **Nudge** → fires a **vendor-side notification** — owner source copy (verbatim): *"XX has requested an inquiry, accept or decline"* — and **resets the 7-day clock** (`last_nudged_at = now()`). Default cap **1 nudge** (§6 flag f); after the nudged window also lapses, the prompt returns offering **Delete** (nudge spent).

**Scope.** The gate applies to **every pending inquiry** — both the auto-seeded fan-out and any the couple sends manually later. A **pre-send shortlist** entry (saved / considering · no inquiry yet) carries **no gate** and stays freely removable — this is where the shipped two-tap "× Remove" ([Vendor_Page_Prototype_2026-05-31.html](Vendor_Page_Prototype_2026-05-31.html)) survives: free remove now means *un-inquired* shortlist; an *inquired* vendor is gated.

**Reconciles decision 2 (no lock auto-expire).** The 7-day mark on the **inquiry** is **not** an auto-decline — the inquiry stays open until the vendor acts or the couple deletes; the mark only **unlocks the couple's delete + raises the prompt**. It is a different state (`requested`) and a different mechanic from the `lock_requested` 48h window (T1.3): the inquiry's 7 days gate the *couple's* action; the lock's 48h nudge the *vendor's*. Neither force-kills the relationship on a timer.

---

## Track 2 — the quotation lifecycle (vendor-issued, customer-approved)

After Accept + token + reveal + chat, the vendor issues a **quotation** tailored to the customer's specific request (decision 5). It is a **living, versioned instrument** — not the loose `package + inclusions` of today's 0006.

### T2.1 · What a quotation contains
- **1 main photo** + **up to 5 photos** of the service, aligned to the customer's request.
- **Line items:** **service cost** · **transportation cost** · **food allowance cost** · **additional costs** (each with a description; addable any time — prices can go up).
- **Service details** — free-form rows the vendor inputs (one per line), each able to carry its own price + description.
- **Linked cross-category services** — the vendor can attach other categories they also offer (e.g. a photographer also quoting video), each with its own price + description. (Respects saturation rules — a hard-single category like reception venue still can't be double-locked — and the package-inclusion auto-tag, 2026-05-24.)
- **Payment deadlines** — the vendor sets the milestone schedule (label · due date · amount · paid status) right in the quotation. Flips authorship from couple-encoded (today's 0006 `vendor_payment_milestones`) to **vendor-issued**.

### T2.2 · Versioning + customer approval
- **Every change is timestamped.** The quotation is append-only/versioned.
- **Any price change requires the customer's approval** before it takes effect. Vendor edits → customer sees the diff → approves → the new version is the active agreement. (This is a *tracking-layer* approval — the couple agreeing to the new agreed figure — **not** a payment authorization; §3.)
- Maps to the 0007 3-line budget model: service cost = Package · food allowance = Crew Meal · transportation = Transportation; additional costs append.

### T2.3 · The service page
Each service page shows: the active quotation (photos + line items + linked services) · the payment milestone ledger + **payment status** · the schedule state (request / accepted / locked / confirmed) · the change history. One surface per service the customer can navigate.

---

## 3 · The decoupling principle (the architectural consequence of decisions 1 + 7)

**Scheduling commitment and payment are decoupled.**

- **Scheduling commitment** (no-overlap) is handled entirely by Track 1: the booking is confirmed at **vendor-approved-lock**, a Setnayan-observable signal. Setnayan owns this.
- **Payment** is a **shared tracking/coordination tool** (Track 2's milestone ledger + deadlines), entirely **off-platform** between customer and vendor. Setnayan **displays** what they record; it does **not** verify, process, or gate anything on it (decision 7).
- This is *more robust* than the old model that tied capacity to `deposit_paid` — under the 0% publisher model, Setnayan can't see off-platform, self-reported money, so it can't reliably know when "deposit paid" happened. Vendor-approved-lock removes that dependency.

> **Two payment realities on the dashboard** (keep the service-page status unambiguous): **(a) external vendor services** = tracked-only, vendor-set deadlines, off-platform money, customer-approves-the-figure (this doc). **(b) Setnayan Productions SKUs** (Papic, Panood, etc.) = real Setnayan checkout (apply-then-pay / future Setnayan Pay). Different payment realities; same dashboard.

---

## 4 · What this supersedes / reconciles

- **Supersedes** "capacity decrements on `deposit_paid`" (Schedule Matrix §2) + **lock/delete/overlap Rule 4** (auto-release on downpayment) → slot consumes at **vendor-approved-lock**; payment decoupled.
- **Reframes the soft-hold (Option A).** The customer's "lock" is now a **lock request** the vendor arbitrates; the commitment is at **vendor approval**, gated by the **decline-the-others-first** rule (T1.4). Adds the **whitelist** (accepted-pending) state between inquiry and lock.
- **Overrides — for the date dimension only** — Vendor_Match's "all hard filters → Expand search": **date-mutual is a hard prerequisite to appear** (T1.5). Area/pax/faith/cert still route to Expand.
- **Confirms the structured vendor-issued quotation** as a new V1.x object — supersedes/extends the loose 0006 `package + inclusions + couple-encoded milestones` → vendor-issued, versioned, customer-approved.
- **Refines hybrid-anonymity** (`project_setnayan_vendor_hybrid_anonymity`): reveal trigger moves from "first vendor chat reply" → **"vendor pays the booking-request token."** Venue exception + Pro+-always-shown still hold.
- **Reconciles the shipped auto-inquiry** (PR #774/#783): today it opens a chat immediately with no Accept/Decline + no token (the pilot simplification). Under this lock it becomes "booking request sent → vendor sees Accept/Decline → on Accept + token-pay → chat opens + reveal." The shipped immediate-chat becomes a "pending vendor accept" state. The couple seeds these via the **one-tap-confirm fan-out** (Vendor_Match §7b.1 · owner 2026-06-03 · pre-filled best-fit set, sent with a single tap) and **can't instantly drop** a pending one — the **7-day delete-gate + nudge** (T1.6) governs removal.

---

## 5 · Schema (design-level — no migration this lock)

Builds on `event_vendors` / the chat thread / `vendor_payment_milestones` / `daily_booking_capacity` (Schedule Matrix). New shape:

```
-- the engagement state machine (on the relationship / inquiry row)
inquiry_state TEXT CHECK (inquiry_state IN
  ('requested','accepted','lock_requested','confirmed','declined','expired'))
token_paid_at      TIMESTAMPTZ   -- vendor paid to Accept (the reveal trigger, decision 6)
revealed_at        TIMESTAMPTZ   -- = token_paid_at
lock_requested_at  TIMESTAMPTZ
lock_expires_at    TIMESTAMPTZ   -- lock_requested_at + 48h (decision 2)
confirmed_at       TIMESTAMPTZ   -- vendor approved the lock → slot consumed (decision 1)
declined_at        TIMESTAMPTZ
decline_reason     TEXT          -- optional (the §6 sub-decision)
requested_at       TIMESTAMPTZ   -- inquiry sent → starts the 7-day couple-delete-gate clock (T1.6)
nudge_count        INT DEFAULT 0 -- couple nudges sent (default cap 1, §6 flag f)
last_nudged_at     TIMESTAMPTZ   -- each nudge re-pings the vendor + resets the effective stale clock (T1.6)
-- couple-delete-allowed = derived (T1.6):
--   inquiry_state IN ('accepted','declined','expired')
--   OR now() >= COALESCE(last_nudged_at, requested_at) + INTERVAL '7 days'

-- whitelist = derived: inquiry_state='accepted' rows grouped by (vendor, candidate date).
--   informational; does NOT block the date (T1.1). Slot consumes only at 'confirmed'.

-- the vendor-issued, versioned quotation
vendor_quotations (
  quotation_id     UUID PK,
  event_id         UUID,  vendor_profile_id UUID,  canonical_service TEXT,
  main_photo_key   TEXT,  photo_keys TEXT[],            -- up to 5
  version          INT,                                  -- bumps on every change
  customer_approval_state TEXT CHECK (... 'pending_approval','approved'),
  created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ
)
vendor_quotation_lines (        -- the per-row service details + the cost lines
  line_id UUID PK, quotation_id UUID,
  kind TEXT CHECK (kind IN ('service_cost','transportation','food_allowance',
                            'additional','service_detail','linked_category')),
  linked_canonical_service TEXT NULL,   -- for cross-category links
  label TEXT, description TEXT, amount_centavos BIGINT NULL,
  created_at TIMESTAMPTZ
)
-- every edit writes a new version + a change-log row (timestamped, decision T2.2).
-- payment deadlines = vendor_payment_milestones, authorship flipped couple→vendor,
--   attached to the quotation; tracking-only (decision 7).
```

- `daily_booking_capacity` (Schedule Matrix) — slot consumed at `confirmed`, not at any payment.
- No payment-processing schema for external vendor services — tracking-only (decision 7).

---

## 6 · Flagged sub-decisions (small — owner can confirm later)

| # | Sub-decision | Lean |
|---|---|---|
| a | Is a **decline reason text** mandatory or optional? | **Optional** — the explicit decline action already satisfies "no silent loss"; a forced reason adds friction. |
| b | **Unfilled-calendar discovery:** show "possibly-mutual" (lean) vs strict confirmed-free-only (hide unset) | **Show** (T1.5) — strict-only kills cold-start. Owner can flip to strict. |
| c | When a quotation **price change** is pending the customer's approval, does the **old** version stay active until approved? | **Yes** — the last approved version is the agreement until the customer approves the new one. |
| d | Does a **declined** customer's freed slot let the vendor re-open it to a new whitelist? | **Yes** — declines are normal queue management; the date reopens to demand. |
| e | Before the 7-day/accept gate clears, what does the couple's **Remove** control do? (T1.6) | **Soft-explain + countdown** — *"We've reached out to {vendor} — give them a moment. You can nudge or remove in {N} days."* (not a dead / hidden button). |
| f | **Nudge cap** (T1.6) | **1 nudge** — after the nudged window also lapses, the stale prompt returns offering **Delete** (nudge spent). Unlimited nudges risk vendor spam. |
| g | Does a **nudge reset the full 7 days** or a shorter re-ping window? (T1.6) | **Full 7 days** — simplest + consistent with the first window; owner can shorten the re-ping (e.g. 3 days). |

---

## 7 · Build order + cross-iteration touch

**V1.x post-pilot.** Pilot 2026-06-01 ships current behavior. **No code / migration / SKU / pricing change with this lock — design capture only.** Depends on the Schedule Matrix capacity work + the token economy + the Vendor_Match verification gate landing.

1. **Engagement state machine** — Accept/Decline on the booking request + token-pay-to-accept + reveal-on-token (refactors the shipped auto-inquiry into a "pending vendor accept" state) + the **couple-side 7-day delete-gate + nudge** (T1.6: can't delete a `requested` inquiry until vendor-accept or 7-day stale; stale prompt → Delete or Nudge → nudge re-pings the vendor + resets the clock). `inquiry_state` + `token_paid_at`/`revealed_at` + `requested_at`/`nudge_count`/`last_nudged_at`.
2. **Whitelist** (vendor dashboard) — the accepted-pending list per date (informational).
3. **Lock request → 48h pending → vendor approve/decline** + the **decline-the-others-first** enforcement (T1.4) + auto-expire (T1.3) + slot-consume-on-confirmed (capacity).
4. **Date-as-hard-gate discovery** (T1.5) — confirmed-busy-on-all → hide; unfilled → show.
5. **Vendor quotation** — issue / version / line items / cross-category links / customer-approval-of-changes / vendor-set payment deadlines.
6. **Service page** — quotation + payment-status + schedule-state + change history.
7. **0028 emails** — Accept/Decline nudge · lock-request nudge (48h) · decline notice · quotation-issued · price-change-approval-needed · "no longer available for your date." · inquiry-unanswered-7d (couple: nudge or delete · T1.6) · you've-been-nudged (vendor: accept or decline · T1.6).

**Owning iterations:** 0006 (vendor relationship + quotation + milestones + capacity) · 0019 (the chat + booking-request Accept/Decline) · 0021 (couple service page + lock request + price-change approval) · 0022 (vendor dashboard whitelist + Accept/Decline + lock approve/decline + quotation builder) · 0034 (token-on-accept) · 0028 (the emails) · 0007 (payment-status tracking surface).

---

## 8 · Scope

**V1.x post-pilot · design lock only.** Pilot ships current behavior (immediate-chat auto-inquiry, no token, no whitelist, no quotation, capacity-on-deposit not built). This is the convergence of the two parent designs + the owner's 7 decisions + the new vendor-arbitrated lock + the vendor-issued quotation. Sequenced after the Schedule Matrix capacity work + the token economy. **No code, no migration, no SKU/pricing change.**
