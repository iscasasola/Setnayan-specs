# Vendor ↔ Couple Transaction Lifecycle — CANONICAL

> Owner-defined 2026-06-20 (live walkthrough discussion). This is the canonical end-to-end flow for a marketplace vendor booking, from the vendor listing a service to the vendor's editorial post. Where the current as-built diverges, **this spec wins** (see the gap map + phased plan). Companion: `Vendor_Quality_Rating_System_2026-06-17.md`, iterations 0006 (vendors), 0021 (couple plan), 0022 (vendor dash), 0034 (payments/cart), editorial spec.

## Actors
- **Couple (host)** / **Coordinator** — either may drive; coordinator is the delegated host.
- **Vendor.**
- **System (Setnayan)** — matching, notifications, editorial composition. **Holds no money. 0% commission.**

## Payment model — LOCKED
- **Vendor bookings are vendor-confirmed end-to-end.** The vendor shares payment info → the couple pays off-platform + uploads proof → the **vendor** accepts the transaction → the vendor-defined schedule runs → the **vendor** clicks **"Payment cleared."** Setnayan never holds the funds.
- **Setnayan's own in-app SKUs** (Papic, Panood, Animated Monogram, etc.) stay **admin-reconciled** (iteration 0034) — UNCHANGED.
- **The vendor defines the payment schedule at service-creation:** downpayment · payment 1 … payment X, each with a **due date**. Used to drive payment reminders + the clearance gate.

## IA change — Build absorbs Lock (2026-06-20)
- **Build now shows considering + quoted + LOCKED services** in one place.
- The separate **"Lock" sub-tab in `/vendors` is REMOVED.** The lock action lives in **Build / Compare**; locked services stay visible in Build with a locked badge.
- `/vendors` sub-tabs: **Summary · Shortlist · Build · Compare.**

## The 11 stages

| # | Actor | What happens | Key data written | Notifies | As-built |
|---|---|---|---|---|---|
| 0 | Vendor | **Lists a service** on the marketplace: starting price (per-pax if pax-oriented) + add-on costs (crew meal, additional pax, transport fee, additional time, …) **+ the payment schedule** (downpayment / payment 1…X + due dates) | `vendor_services` (price/add-on cols exist) + **NEW payment-schedule cols/table** | — | ⚠ add-on schema exists; **payment schedule = missing** |
| 1 | Couple | **Searches** by category · date · location · budget → **sends inquiry** | `chat_threads` (inquiry) | Vendor: `vendor_inquiry_received` | ✅ |
| 2 | Vendor | **Accepts** to engage (token burn — see below) → **sees shared event info** → **proposes a cost (not final)** | `vendor_event_unlocks` + `vendor_proposals` (proposal exists) | Couple: `inquiry_accepted` + name reveal | ⚠ accept ✅; in-thread "offer" dead-ends; proposal channel exists but isn't the chat path |
| 3 | Both | **Negotiate** the package in chat — adjust price, add linked services — until agreed | `vendor_proposals` (revised) | chat notifs | ⚠ chat ✅; structured negotiate→agree weak |
| 4 | System | **Agreed combo → Shortlist** (the agreed price + service set posted for the couple to compare) | `event_vendors` (priced) / shortlist link | Couple | ❌ **the missing bridge** (offer/proposal → shortlist) |
| 5 | Couple | **Compare** the candidate combos → **Lock** one or all. *(Lock lives in Build/Compare; locked items show in Build.)* | `event_vendors` → `status=contracted`, `selection_match_rank` (#1836) | Vendor: lock request | ⚠ compare ✅, lock RPC ✅, feed-in ❌ |
| 6 | Vendor | Receives the **lock request** → **sends payment info** (how + when) | payment-options / schedule surfaced to couple | Couple: payment instructions | ⚠ payment-options surface exists; lock→info handoff partial |
| 7 | Both | Couple **pays + uploads proof** → **vendor accepts the transaction** | payment record + proof + vendor-confirm | Both | ⚠ payment-log form exists; **vendor-accept of a vendor-booking payment = partial/missing** |
| 8 | Vendor | **Payment schedule runs** (downpayment…final per due dates) → when all paid, **"Payment cleared"** | per-payment confirms + cleared flag | Couple: each confirm + cleared | ❌ **schedule + clearance = missing** |
| 9 | Couple / Coord | **Confirms the service is complete** → prompted for **★ rating + comment** (mandatory) | review row + completion | Vendor: completion accepted | ⚠ review/completion partly built |
| 10 | Vendor | Notified of completion → **posts 1×5s video OR 1 photo + 1 message** for the couple | vendor editorial media | Couple | ⚠ "From Your Vendors" gated on the credit chain |

**Side effect of 5–7:** a locked vendor's specs (date, capacity, hard-single category) join the **match filter**, so later searches respect what's already booked.

**Editorial outputs (stage 10):** the vendor's clip/photo + message feed the editorial **"From Your Vendors,"** and the vendor's service data feeds **"By the Numbers"** (validated 2026-06-20: a locked vendor renders "Team Behind the Day · #1 MATCH" + "1/1 #1 match").

**Token burn — unchanged.** Fires on **inquiry-accept** (stage 2 — the vendor's "answer"). FREE-VERIFIED = ≤10 free unlocks/rolling week (0 tokens); PRO/ENTERPRISE = 1–3 tokens banded by the wedding region (NCR=3); returning client = flat 1. One idempotent unlock per (vendor, event) covers all that vendor's services.

## DIY parity
Marketplace vendors flow through the proposal pipeline above. **Off-platform / manually-added vendors** keep the DIY path (couple adds a contact + a self-entered cover price) — the two coexist (see `project_setnayan_dual_path_diy_parity`).

## Setnayan AI — category requirements carry-forward (AI-gated)
When **Setnayan AI is activated** (the finer filtering layer — deterministic matchmaking, *not* an LLM; AI-off = generic), the platform maintains a **per-(event, category) customer requirements profile**:
- Everything the customer sends/answers to a vendor for a category/service is **captured** into that category's requirements profile (built from the info the vendor requested + whatever the customer volunteered).
- Every **add or change** to a request **updates** the profile.
- When the customer inquires to **another** vendor in the **same category**, Setnayan AI **carries the accumulated requirements forward** — pre-filling what the next vendor needs, so the customer never re-enters it and the vendor gets full context on first contact.
- **Privacy boundary (locked):** only the **customer's own requirements/answers** propagate across vendors — **never** another vendor's quote, price, package, or response. Vendor B cannot see Vendor A's proposal. The requirements are the customer's first-party data reused **within their own event** (consistent with the behavioral-data-edge rule: first-party, within-event, decision data stays edge).
- **AI-off:** each inquiry stands alone — no carry-forward; the vendor only sees the base event profile.

Data: a per-(event, category) requirements store, **append / update-on-change**; surfaced into stage 1 (inquiry pre-fill for the next same-category vendor) and stage 2 (the event info the vendor receives).

### Capture surface — owner-specified 2026-06-20 (resolves the "where do customers enter requirements" decision = structured per-category intake)
- **At Inquire, a pop-up opens for this leaf category.** It renders **category-specific fields**: a set of **checkboxes** + a **"Special request" free-text box**. Example — *Church ceremony*: ☐ with AC · ☐ big door · ☐ long aisle · ☐ parking lot · + *Special request* (text).
- The pop-up asks **"Do you have any special request?"** (the text box) and **"Keep this customization to reuse for other [category] inquiries?"** with a checkbox **"auto-send this to my next inquiries."**
- **One saved template per (event, leaf category)** = the customer's reusable answers (the `event_category_requirements` row).
- **Shortlist:** each category shows an **icon** exposing its saved customization/request (view + edit).
- **Carry-forward control:** the customer's **"auto-send" checkbox** drives it (available to everyone); when **Setnayan AI is on** it's enhanced/automatic. *(Owner to confirm: checkbox-driven-for-all + AI-enhances — vs AI-on-only.)*
- **Admin-defined fields (architect mandate):** the per-leaf-category checkbox options are **admin-managed** (a small admin surface — "customization fields per leaf category"), NOT hardcoded — consistent with the taxonomy-DB-driven + admin-managed rules. The *Special request* box is always freeform. Likely lives alongside `canonical_service_schemas`. Three surfaces: **admin defines fields · customer fills/saves/auto-sends (+ shortlist icon) · vendor receives the customization in the inquiry.**
- Gating note: the AI layer reads `isSetnayanAiActive`; the capture pop-up + save + shortlist icon are **core (not AI-gated)**; only the smarter auto-propagation is AI-enhanced (pending the owner confirm above).

## Phased build plan (absorbs the 4 QA-walkthrough fix-chips)
- **Phase 0 · prerequisite — Vendor public-read RLS migration** (`is_published` → `public_visibility`). *[chip ② — task_315a8544]*
- **Phase 1 · Transaction pipeline** — propose → negotiate → **agreed combo posts to Shortlist** → Compare → **Lock (one/all)**; **Build shows locked too**; **remove the Explore Lock tab**; fix the saved-row category (no more "MISC"). *[absorbs chip ① — task_9ba1d1b8 + chip ③ — task_eb328dd0]*
- **Phase 1b · Setnayan AI category requirements carry-forward (AI-gated)** — capture the customer's per-category requirements; carry them forward to the next same-category inquiry (pre-fill); update on every add/change; customer-requirements-only (never other vendors' quotes). Layers onto the inquiry pipeline; gated on the Setnayan AI activation flag. *[new]*
- **Phase 2 · Payment system** — vendor payment **schedule** at service-create; lock → payment info; pay + proof → **vendor accepts transaction**; schedule progression → **"Payment cleared"**; both-way notifications. *[new]*
- **Phase 3 · Completion + review** — couple/coordinator "service complete" → **mandatory ★ + comment** → vendor notified. *[new]*
- **Phase 4 · Vendor editorial post** — 1×5s clip OR 1 photo + message → editorial "From Your Vendors" + By-the-Numbers. *[new]*
- **Polish · Token-cost confirmation** on Accept (show cost + balance before the burn). *[chip ④ — task_8d5ae8d7]*

Build state legend from the live QA walkthrough is in `DECISION_LOG.md` (2026-06-20 "LIVE QA WALKTHROUGH") and memory `project_setnayan_live_qa_walkthrough_2026-06-20`.
