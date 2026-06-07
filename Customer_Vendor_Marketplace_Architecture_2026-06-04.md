# Customer ↔ Vendor Marketplace Architecture — Consolidated (2026-06-04)

**Status:** design consolidation · **draft for Cowork ratification.** Merges the existing locks — the **Universal Service Template** ([Service_Specifications_2026-06-02](Service_Specifications_2026-06-02.md)), the **Schedule/Date** model ([Schedule_Matrix_and_Date_Finder_2026-06-02](Schedule_Matrix_and_Date_Finder_2026-06-02.md)), the **Match Personalization** layer ([Vendor_Match_Personalization_2026-06-01](Vendor_Match_Personalization_2026-06-01.md)), the required **Setnayan Exclusive** (`CLAUDE-CODE-BRIEF-v2.1` §7.2), and the **vendor tier matrix** (DECISION_LOG 2026-05-30) — with the **2026-06-04 architecture session**: the compatibility-score engine, the cascade-lock, the booking handshake, the slot/white-locked model, the vendor lead-token economy, the inquiry-lifecycle rules, force majeure, off-platform money + liability, and the conflict/concurrency layer.

This does **NOT** override locked iteration specs; where it extends them it is flagged. It folds into **0006 / 0019 / 0021 / 0022 / 0023 / 0034 / 0043 / 0044** + a DECISION_LOG row via Cowork. **Code is the truth where specs have drifted** (see §9). Build sequence in §11.

---

## 0. The model in one paragraph

A **constraint-satisfaction marketplace.** The couple narrows `location(s) → candidate dates → reception venue → a set of booked services`, guided by a **live compatibility %** and a **cascading lock** that prunes options that can no longer co-exist. **Money is off-platform** (0% commission); Setnayan captures value through the **required Setnayan Exclusive** and the **vendor lead-token economy** (vendors pay to *pursue* a lead, never to answer one). Three interlocking actors — **customer · vendor · admin**. The **vendor's schedule is the shared source of truth** that makes double-booking impossible. Booking is a **two-sided handshake on a definite date** (request → vendor approves + sets terms → downpayment).

---

## 1. What a service IS — the Universal Service Template (LOCKED structure, extended this session)

The six sections (Service_Specifications), with this session's additions in **bold**:

1. **BASIC** — Date(s) · Time · Starting Pax · Max Pax (capacity ceiling, capacity-bound only) · Additional ₱/pax · Distance (vendor sets service-area + radius + travel fee; Setnayan computes distance **from the reception anchor**). **+ `daily_booking_capacity` default 1/day per service. + manual date blocks (§4).**
2. **ADVANCED** — Parent→Child **leaf** + **Details** = tags from the per-child **vocabulary** (48-tile library) + custom. **Only faith/dietary/cert tags filter; the rest sort.**
3. **INCLUSIONS** — the **row-by-row** inclusion lines, each with (+) variations.
4. **LINKED SERVICES** — other tiles bundled, auto-tagged **"✓ included with {vendor}"**; **card shows "comes with [X][Y][Z]."**
5. **FEES** — Downpayment · Service Fee · Transportation · Food Allowance · Excess Pax · (+) add. **+ Pax-adjustment line, vendor-level Discount line, Last-minute surcharge line. Separate `downpayment_required` (quote) from `deposit_paid` (record).**
6. **EXCLUSIVE SETNAYAN PERKS** *(REQUIRED)* — `exclusivePerk` (v2.1 §7.2). The **value-capture keystone** (the perk the customer gets only by availing in-app). Surfaces: tinted offer row (0015 + 0021) · "✓ applied" badge · "Has Setnayan-exclusive" filter. **Required-for-visibility.**

**Bundles** are a distinct service type; booking a bundle books its components.

> **This template IS "how a vendor creates a service."** Filled in the **0022 service editor** (`/vendor-dashboard/services` + Publish toggle; 0030 tour); vocabulary + attribute storage = **0044**; off-taxonomy → request-a-node (0022 §2.1a → 0023 §3.2c). Setnayan's own first-party services use the same template. Creation flow (0041): **Choose cluster → identify leaf → configure (6 sections) → Publish.**

---

## 2. The compatibility engine — GATE + SCORE

**Stage 1 — Eligibility GATE (binary; fail any → excluded):** reachable (`haversine ≤ radius` OR area ∈ `service_regions`) · **free on ≥1 candidate date** · faith/dietary/cert · capacity (`seated_capacity_max ≥ guest_count`, capacity-bound only) · **accepts last-minute** (if `< 14 days` out).

**Stage 2 — Match SCORE (0–100%, admin-tunable):** Refinement fit **30** · Distance **25** · Reviews **20** · Date headroom **15** · Trust/completeness **10**. Ring badge; sort = **Favorites → Boosted → score**. **Never-empty:** the gate removes; the score sorts + soft-folds weak matches (~25% soft floor + always keep top 3).

**Date model (resolved 2026-06-04).** An inquiry carries **1..N candidate dates** — a single fixed date (church already booked) **or** a small window/2–4 Saturdays. **The window is deliberate: it lets a couple *combine vendors* across dates** (Vendor A free the 12th, Vendor B the 19th → converge where the best team aligns). The vendor **prequalifies** against the set ("free on 2 of your 3"). At **request-to-book / approval it collapses to ONE definite date** (§3) — a vendor can't reserve capacity on a "maybe window." So: **multiple candidate dates while exploring, one definite date to book.** Reception-anchor convergence: shortlist across candidates → lock the reception (pins the date) → every other vendor books that definite date.

---

## 3. The booking handshake (definite date) + cascade-prune

**Booking is a two-sided handshake on a definite date — NOT unilateral.** Full flow (locked 2026-06-04):

1. **Customer taps Lock** → **consent modal:** *"Locking removes your other shortlisted vendors + any vendors in other categories that no longer fit. Continue?"* → on accept, status **`requested`**. **The removals are PREVIEWED here, NOT executed yet** (step 6) — the shortlist is held, reversible.
2. **Vendor accepts the lock request** (= pursuing → token charged if not already, §5) → **auto-sends payment details** (downpayment amount + methods + where to send, from the vendor's stored receiving accounts). Accepting places an **exclusive 48-hr hold on that (vendor, date)** — the vendor can't accept another request for the same date while it's live; competing requests wait.
3. **Customer gets the payment guide + 48-hr countdown + a proof-upload slot** → pays **externally** → uploads a copy → status **`proof_submitted`**. **On upload the customer screen goes passive:** the "Pay within" countdown **flips to "Awaiting verification · up to 48 hrs"** and **no action buttons remain** — the next move is the vendor's. (Booking locks when the vendor verifies; it is **never auto-approved** on upload alone.)
4. **Vendor has 48 hrs to act:** **Payment Verified** · **Resend Request** (ask for clearer proof) · **Cancel Transaction**. **Re-upload escape hatch:** before verification the customer can **Replace proof** at any time, and **Resend Request reopens their upload slot** (status returns to the pay/upload state, the timer reverts to "Pay within") — guards against a wrong-file upload getting stuck.
5. **Payment Verified** → **`deposit_paid` (BOOKED)** → **auto-added to both schedules** + **balance/milestone reminders set on both.**
6. **Only now** does the **bilateral cleanup execute** (the step-1 preview).

State path: `considering → requested → vendor_approved (48h pay-window) → proof_submitted (48h verify-window) → deposit_paid`.

**Window safety:** (a) customer misses the pay-window → hold releases, date reopens, **nothing removed**; (b) vendor misses the verify-window **after the customer already paid externally** → **auto-escalate to admin + protect the customer + strike the vendor** — never silently drop a paid transaction.

**On lock (`deposit_paid`), a bilateral cleanup fires:**
- **Customer side** — cascade-prune: other vendors now **incompatible with this booked vendor + date** are flagged → **confirm modal** → **soft-archive** (reversible via Unlock) + the displaced vendors are notified (§5a).
- **Vendor side** — the booked **date's white inquiries are cleared** (capacity full). This is **per-date**: a multi-candidate inquiry simply loses *that* date and survives on its remaining candidates; an inquiry is fully cleared only when it has **no candidate dates left** with this vendor — sent the **one broadcast explanation** (§5a).

**The cascade fires on `deposit_paid` (the real lock), never on the mere request** — a request the vendor later declines must not prune anyone. **Multi-location** (cap 2): trim each to one reception → book one → collapse to one location → cascade-prune the dropped location's services. *This handshake dissolves the "lock vs vendor-decline" race (the lock requires the vendor's write) — invariant **I3**.*

---

## 4. The slot / availability model

- **White (inquiries + soft-holds) = UNLIMITED. Only BOOKED (`deposit_paid`) counts** toward capacity (supersedes the live `max_soft_holds_per_date` cap).
- `daily_booking_capacity` **default 1/day** per service.
- **First-to-downpay wins** — an **atomic** capacity decrement; losing white inquiries are auto-notified "date taken," carrying the vendor's **single broadcast explanation** (one → all displaced; not one-by-one).
- Last booked slot → **date closes to new inquiries.**
- **Manual blocks:** a vendor marks a date **unavailable** via the Calendar "Add Block" (`vendor_calendar_blocks`, `source='manual'`, optional `is_private`) → no bookings, drops from the gate. **Privacy:** couples see only **"unavailable"** for a date — never "booked by another couple" vs "personal block."
- **Org/owner-level shared schedule:** a vendor's multiple agent-listings all pipe to **one** schedule (no cross-listing double-book). *Today keys per `vendor_profile` → build the org-level schedule.*
- **Availability display is eventually-consistent (#7):** what a couple sees can fill mid-session. The display is best-effort; the **atomic gate is the downpayment**, with the handshake + a graceful **"just taken — here are alternatives"** bump (never a hard error).
- Vendor sees two buckets: **White** (pre-payment) | **Locked** (`deposit_paid+`).

---

## 5. The token economy — vendors pay to PURSUE, never to answer

The principle that keeps the marketplace alive: **answering is free; pursuing costs a token.**

- **Customer inquiry is free for the customer.**
- **Free for the vendor (triage):** the vendor always sees the inquiry + couple basics (date(s), pax, budget, location, what they want) and can **DECLINE for free** (with the required explanation, §5a). **Chat itself is gated** — the vendor cannot send any message until they unlock (pursue). Free responses = *view* + *decline*; everything interactive is behind the token. No inquiry dies in silence (decline is free + required).
- **Paid (pursue):** the **token is charged when the vendor *pursues*** — unlocking the full relationship (full chat + couple's full profile + **all their services for the event** + auto-favorite + `rebook_favorite` + the ability to send a proposal / approve). One charge per **(vendor, event)**, **geo-variable by location** (admin market-tier; shown before spend; locked at first charge; idempotent — re-inquire / different service / location-change / FM-rebook → no re-charge).
- **Why this is the right balance:** the vendor's downside is bounded (never pays for leads they don't want; declines freely), so they don't resist answering. Setnayan still earns on every *pursued* lead — and those are **gate-qualified + geo-priced**, so they're winnable and worth it. Charging to merely respond would kill liquidity; charging to pursue does not.

---

## 5a. Inquiry lifecycle — explanations, expiry & accountability

A vendor has three paths on an inbound inquiry, two of them **free**:
- **Pursue** — pay the token, engage (§5).
- **Decline (FREE) — REQUIRES an explanation**, shown to the customer. *(Today `decline_reason` is optional + hidden → make it required + surfaced.)*
- **Ignore → 30-day auto-expiry** — the inquiry is auto-deleted (event-driven, **no cron**), and it counts toward the vendor's responsiveness signal.

**Responsiveness as a RATE, not a count (adjustment 2026-06-04 — never punish popularity).** The signal is `(answered + declined within SLA) / actionable inquiries` over a rolling window — **not** an absolute strike count. Protections: **(a)** inquiries auto-cleared because a date booked/blocked are **moot — not counted** against the vendor; **(b)** a free **decline counts as answering** (positive); **(c)** only inquiries the vendor could have actioned within the SLA and didn't count negatively; **(d)** a vendor at capacity isn't expected to answer inquiries for already-full dates. Result: a flooded popular vendor is judged on **rate**, so volume never creates strikes; only a genuinely low response rate deranks.

**Displacement explanation:** a booking lock that displaces other pending inquiries → **one explanation, broadcast to all** displaced customers (§3/§4).

---

## 6. Money & liability

- **Vendor↔customer money is ALWAYS off-platform.** The app stores **notes + copies**. 0% commission, **non-party publisher** posture.
- **Religious ceremony venues** list **fee-exempt**; billable only for a non-ceremonial add-on service.
- **Liability** *(architecture/risk — PH counsel owns the final word):* off-platform lowers the ceiling but is not immunity — **RA 11967 (Internet Transactions Act, 2023)** can hold a marketplace liable on control / representations / failure-to-act. Raised by verification badges, dispute adjudication, stored copies (→ RA 10173). Mitigations: ToS intermediary framing · at-upload disclaimer · report/takedown · no fund-holding · accurate verification · RA 10173 storage. (RA 7394 + RA 8792 apply.)

---

## 6a. Force majeure (both-party reportable)

**Either party reports** (customer OR vendor) against a booking. It flags the booking, routes to **`/admin/force-majeure`** (liability flag + auto-resolve + admin handler; spans 0019/0021/0023), creates a **no-fault record** (blameless — not the §5a unresponsiveness signal), and **pauses timers.**

**Resolution ladder:**
1. **Reschedule, same vendor (default).** Surface up to **4** of the vendor's next available dates (from the calendar + capacity) as pick-one cards → rebook same vendor, new date, **no new token, no penalty, no decline-strike.** **The FM couple gets PRIORITY on those 4 dates** — a privileged short hold over fresh inquiries (they were already booked + hit by calamity).
2. **Replacement vendor.** Matcher **filtered to available-on-the-needed-date + same category**, surface alternatives; event context carries over.
3. **Refund / credit coordination.** Off-platform → facilitate via the stored downpayment record + notes; escalate to **`/admin/disputes`** only if contested.

**Setnayan's own (digital) services** are covered too — but because they're **zero-marginal-cost** to reproduce, FM = **free extend / re-render** (regenerate the song, re-render the highlight/SDE, extend the website/gallery window) — no ladder.

**Why 4:** enough to feel handled, few enough to decide fast (one card row), with "see more dates" to expand.

---

## 7. Three actors + surfaces (real code routes)

| Actor | Real routes (`~/apps/web`) |
|---|---|
| **Customer** | `/dashboard/create-event` → `/onboarding/wedding`; `/dashboard/[eventId]/{guests,vendors,schedule,budget,messages,contracts,add-ons,seating,event-qr,details,disputes}`; public `/vendors`(+categories,compare), `/v/[slug]`, `/venue/[slug]`, `/weddings`; guest `/[slug]`, `/join/[eventId]`; `/host/accept/[token]`; `/receipts/[id]` |
| **Vendor** | `/vendor-dashboard/{bookings,messages,services,attributes,contracts,earnings,manpower,marketing,repertoire,reviews,verify,tokens,redeem-code,team,moodboard-library,notifications,profile}` |
| **Admin** | `/admin/{verify,taxonomy,payments,disputes,force-majeure,pricing,payouts,receipts,discount-codes,addons,reviews,help,concierge-abuse,users,vendors,events,venues,demo-vendors,brain,moodboard-library,songs,website,ads,operations-hiring,telemetry,funnels,settings,…}` |

**Vendor tiers** (v2.1 / DECISION_LOG 2026-05-30): **Free · Verified · Pro · Enterprise** — radius **10 / 20 / 50 / 100 km**; categories 1 / multiple; per-day capacity Pro+; hybrid-anonymity (Free + Verified name hidden until first reply); Boosters via token spend.

---

## 7a. Vendor home (dashboard) + action hub

Two surfaces, cleanly split — the **home page is the dashboard** (business health + coaching + action-needed counts); the **bookings hub is the working inbox.**

- **Vendor home** (`/vendor-dashboard`) **= the stats + coaching dashboard** — this is where all the business stats and recommendations below render, the first thing a vendor sees.
- **One action hub** (`/vendor-dashboard/bookings`): the single place to **accept inquiries · accept lock requests · confirm verified payments · review cancelled transactions** — the whole actionable pipeline in one inbox, each with its 48-hr clock. The **home page surfaces the live counts** (e.g. "3 lock requests · 2 payments to verify") that **deep-link straight here**.
- **Business stats** (`/vendor-dashboard` home): the funnel — **search reach → inquiry requests → white-listed → locked events** — at **two grains: vendor-level AND per-service** (which posted service gets the most **views + inquiries**, so they see their best and worst performers). Mirrors/feeds admin `/funnels` + `/telemetry`.
- **Recommendations / coaching engine (added 2026-06-04):** each metric carries a **specific, benchmarked, actionable nudge** that turns the funnel diagnosis into a prescription — rule-based off data we already have (funnel ratios · `completeness_score` · the §2 match-score levers · response rate · photo count · price vs category median · calendar fill · missing Setnayan Exclusive · tier radius). Examples: *low reach* → widen `service_regions` / add missing refinement tags / "your Free-tier 10 km radius is limiting reach"; *high reach, low inquiries* → "add photos (you have 4; top-quartile have 15+) · your starting price is above the category median · fill your required Setnayan Exclusive"; *high inquiries, low locks* → "response rate 40% vs 75% median — reply faster · your downpayment terms are steep." One-tap-actionable where possible. **Guardrails:** genuine-improvement-first (paid options — Boost / Pro / wider radius — shown transparently as *one* option, never the only fix); benchmarks are **aggregate/anonymized** (no competitor specifics — matches calendar privacy). V1 = rule-based + explainable; AI-summarized (Haiku) is a V1.x layer; deeper coaching is a natural **Pro-tier** lever.

---

## 8. Conflict & concurrency architecture (Phase 0)

**What protects today:** `event_vendors` is **couple-write-only** (only two-way surface = `chat_messages`). The handshake + proposal + slot + token features add two-way writes → these guards are prerequisites.

| Invariant | Guard |
|---|---|
| I1 · ≤1 confirmed vendor per hard-single category | DB **partial-unique index** `(event_id, plan_group) WHERE confirmed` |
| I2 · paid ≤ capacity; **first-paid-wins** | DB **exclusion constraint + atomic RPC** (`FOR UPDATE`/serializable) |
| I3 · booking requires the **vendor's** approval write; every status write preconditioned | handshake (§3) + **`status IN (…)` in UPDATE WHERE** |
| I4 · accept the proposal/terms that were sent | **version column** + precondition |
| I5 · remove cleans up children | **soft-delete + cascade** |
| I6 · one thread / one token charge (per vendor,event) | **canonical keying + idempotency key** |
| I7 · locked picks stay criteria-compatible | **re-validate on criteria change → soft-warn** |

Plus a **single transition guard** for `event_vendors.status` (legal-transition table). Confirmed races today: double-book TOCTOU · soft-hold-excludes-paid · payment-approve-skips-capacity · lock-has-no-precondition · hard-single TOCTOU · deleteVendor-orphans · no-proposal-versioning · criteria-drift-soft-warn-missing.

---

## 9. Spec ↔ code drift register (reconcile via Cowork)

- Vendor host = **`/vendor-dashboard/*`** (not `/dashboard/vendor/*`).
- **No `/admin/wedding-types` UI** — gating is table-only (`wedding_type_launch_status`).
- **Fee = 0% publisher posture** in code; CLAUDE.md 3% / 0034 5% — reconcile to 0% + off-platform.
- Booking lifecycle code = `chat_threads.inquiry_status` (pending/accepted/declined) + `event_vendors.status`; 0006 + 0022 differ → add the handshake states.
- **Setnayan Exclusive = spec-only, not built.** `daily_booking_capacity` = designed-only.
- White-unlimited supersedes the `max_soft_holds_per_date` cap.

---

## 10. Decisions

**Confirmed (2026-06-04):** vendor-approval handshake on a **definite date** · bilateral lock cleanup (customer cascade-prune + vendor per-date white-clear, partial-displacement aware) · **multiple candidate dates at inquiry → one definite date at booking** · **pay-to-pursue / free-to-triage+decline** (token charged at pursue) · decline requires explanation · one-broadcast displacement · 30-day event-driven expiry · **responsiveness = a RATE (popularity never punished)** · FM both-party report + 4-date ladder with FM-priority · FM on digital services = free re-render · manual blocks + calendar privacy (never reveal) · white/locked · 1/day · 14-day last-minute · 0–100% surcharge · downpayment split · bundles distinct · first-pay-wins · **chat-gated (free = view + decline; pay to unlock chat/pursue)** · **48h customer-pay + 48h vendor-verify windows** · **removals execute only on Payment-Verified** · **vendor action hub + business-stats funnel (vendor + per-service grain) + a benchmarked recommendations/coaching engine.**

**Still open:** score floor exact % · lock reversibility window length · removal-reason chip set · multi-location cap (rec 2) · Exclusive free-text vs gifted Setnayan tool (rec: both, spotlight tool) · geo-token dimension exact tiers.

---

## 11. Build phasing

0. **Conflict layer** (DB constraints + atomic RPCs + status preconditions + soft-delete + idempotency + transition guard).
1. **Service template + compatibility score** (extend `wizard-recommendations`; admin weights; the date-candidate model).
2. **Booking handshake + cascade lock + casualty modal** (vendor-approval-on-definite-date + cross-category prune + bilateral cleanup).
3. **Slots + org-level shared schedule + white/locked view** (build `daily_booking_capacity`; manual blocks).
4. **Token economy** (pay-to-pursue charge; free triage/decline; geo-variable; unlock bundle; auto-favorite; rebook).
5. **Inquiry lifecycle** (required decline explanation · one-broadcast displacement · 30-day event-driven expiry · responsiveness-rate signal).
6. **Setnayan Exclusive surfaces.**
7. **Vendor bundles.**
8. **Force majeure** (both-party report → priority reschedule-4 / replace / refund; digital re-render; extend `/admin/force-majeure`).
9. **Multi-location convergence.**

---

## 12. Sources combined

Locked/prior: Service_Specifications_2026-06-02 (template + best-fit + 48-tile vocab + how-a-vendor-creates-a-service) · Schedule_Matrix_and_Date_Finder_2026-06-02 · Vendor_Match_Personalization_2026-06-01 · `CLAUDE-CODE-BRIEF-v2.1` §7.2 + tier matrix (DECISION_LOG 2026-05-30) · service-editor/publish (0022 §2.2 · 0030 · 0041) · iterations 0006 / 0015 / 0019 / 0021 / 0022 / 0023 / 0034 / 0043 / 0044.
This session (2026-06-04): compatibility gate+score · date-candidate model · booking handshake (definite date) · bilateral cascade cleanup · slot/white-locked model · pay-to-pursue token economy · inquiry-lifecycle + responsiveness-rate · force majeure (incl. digital re-render + FM-priority) · off-platform money + liability · conflict/concurrency layer · 3-actor map + drift audit · owner rule set.
