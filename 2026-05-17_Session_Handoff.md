# Setnayan — 2026-05-17 Session Handoff

> **For:** the next Claude account picking up this work.
> **Session length:** ~one workday (Asia/Manila timezone).
> **Net result:** 4 new spec sections in iteration 0021 (§ 10–13) · 1 new admin surface in iteration 0023 (§ 3.12) · 1 new corpus-root consolidated reference doc (Pricing.md) · 5 new CLAUDE.md decision-log rows · pandoc installed locally.

---

## 1. Quick orientation (read this first)

If you've just been transferred this conversation, the SessionStart hook auto-injects an alignment header pointing you at three sources of truth:

1. **Live product** — https://www.setnayan.com (WebFetch when needed to verify shipped behavior)
2. **Spec corpus** — `/Users/icecasasola/Documents/Claude/Projects/Setnayan/`
3. **Code repos** — Setnayan-App monorepo (`apps/web` for surfaces) + setnayan-platform (auth shell)

**Read these status anchors BEFORE any new work:**

- [`CLAUDE.md`](CLAUDE.md) — engineering context primer. The **decision log lives at the bottom** (search `## Decision log`). New rows go in date order, format `| Date | Decision | Why-or-affected-files |`. The most recent ~6 rows added in this session document everything below.
- [`COWORK.md`](COWORK.md) — update workflow. Lines 44–54 are the canonical sequence: capture decision → CLAUDE.md decision log → iteration `.md` edits → regenerate `.docx` mirror via pandoc.
- [`V1_Gap_Analysis_Status.md`](V1_Gap_Analysis_Status.md) — spec-side audit of what's specced vs missing.
- [`App_Build_Status.md`](App_Build_Status.md) — code-shipped audit (spec vs origin/main).
- [`Installed_Stack_Inventory.md`](Installed_Stack_Inventory.md) — what infrastructure is wired up.
- [`API_Integration_Checklist.md`](API_Integration_Checklist.md) — owner-actionable external prerequisites.

**Locked guardrails (do not violate without owner sign-off):**

- V1 scope is locked. Flag feature expansion explicitly before producing code.
- Pricing is PHP centavos in `service_catalog` (iteration 0034, not 0003 — token wallet at 0003 was retired 2026-05-11). No USD; no invented prices.
- NO wallet UI. Payment is order-and-pay only (iteration 0034). Any "Token wallet pill" reference in iteration 0000 is spec drift — log it and don't implement.
- Responsive by default — design for both desktop and mobile. Bottom sheets on mobile · dropdowns on desktop. Don't re-ask "mobile or desktop".

**User context.** The owner has been moving fast through design conversations; rapid back-and-forth dictation with periodic spec writeups. Keep responses tight (2-3 sentences for exploratory questions; mockups when proposing copy; full multi-step capture when locking decisions).

---

## 2. What got designed this session (iteration 0021 § 10–13)

All four sections live in [`0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md`](0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md). The `.docx` mirror is regenerated and current.

### 2.1 § 10 — Date change with booked vendors (multi-party state machine)

When a couple wants to change their wedding date with ≥1 confirmed vendor attached, the change cannot be a unilateral edit. The change routes through a structured negotiation flow.

**Trigger logic** (§ 10.1): the gate fires only when the event has ≥1 confirmed vendor. Confirmed/paid + in-active-mediation count toward the threshold; cart/draft + cancelled/refunded don't. Zero confirmed vendors = free date edit, no warning.

**Confirmation modal copy** (§ 10.1): shows affected vendor list (up to 3 names + "and N more"), a required reason field (min 30 chars), warning about chat-negotiation fallback. Tone is informative, not alarmist — couples reaching this modal are usually already stressed.

**Schedule check** (§ 10.2) runs against each vendor's calendar. Two customer-facing outcomes locked:
- *"Your schedule change is available for all vendors. Waiting for their confirmation."*
- *"Your schedule change is available for X vendors but conflicts for Y vendors. We cannot apply this change until all vendors accept."*

**Pending-state freeze** (§ 10.3): original date holds on couple dashboard, vendor calendars, AND the public landing page. No further date attempts. Payments paused. Vendor slots locked from re-allocation.

**Vendor response window** (§ 10.4): 48 hours default. Accept · Decline · Couple-cancel options. Auto-escalate to admin mediation if vendor ghosts.

**Chat negotiation on decline** (§ 10.5): existing customer↔vendor thread (per the customer-initiates-chat rule) gains **structured action cards** — Propose alternate date · Accept this date · Cancel booking · Escalate to support. Free-text agreements in chat are NOT load-bearing — only cards trigger state transitions. This is a hard dependency on iteration 0019 supporting interactive action cards as a first-class message type.

**Admin mediation tier** (§ 10.6): when chat stalls or 72-hr couple ghost timeout fires. Setnayan's Disputes Handler joins the thread (same pattern as 0019 force-majeure + § 2.2 refund/dispute menu). Mediator picks from a fixed outcome enum — vendor reconsiders, couple stays at original, vendor swap, refund + cancellation, reschedule-fee compromise. No free-text resolutions.

**Race condition** (§ 10.7): vendor backs out during negotiation; if count drops to zero, in-flight negotiation auto-resolves and couple is free to apply the change immediately.

**Door-reopened banner** (§ 10.8): when confirmed-vendor count returns to zero (any reason), Home surfaces a passive banner: *"All vendors have been released — you can now change your event date freely."* Dismisses on first edit attempt or after 14 days.

**Reschedule fees** (§ 10.9): vendors set per-window fee policy at onboarding (0006). Manual mediator action V1; auto-debit lands in 0034 Phase 2.

**Hard cap** (§ 10.10): 2 successful date changes per event lifecycle. Third requires admin override via 0029 help center.

### 2.2 § 11 — Venue change (reuses § 10 with substitutions)

Same multi-party state machine. Two material differences:

**Coverage check replaces schedule check** (§ 11.1): each vendor's service-area radius · permits/licensing · equipment compatibility · venue house-rules are checked instead of calendar availability. Customer-facing strings adapted — *"Your venue change is available for all vendors..."* / *"...is in conflict for Y vendors."*

**Auto-accept radius** (§ 11.2): NEW feature for venue changes. Vendors set a service-area auto-accept radius at onboarding (e.g., "auto-accept any venue within 50 km of Manila"). Venues inside the radius skip the vendor card entirely and the booking auto-transitions. Cuts negotiation volume for short-distance moves (e.g., one Tagaytay venue to another).

**Relocation fee replaces reschedule fee** (§ 11.3): travel cost · equipment shipping · venue-specific insurance. Same surfacing pattern.

**Mediation outcomes** (§ 11.4) parallel § 10.6 with venue-specific labels.

**Public landing page holds** (§ 11.5): venue is one of the top-of-page facts on the public invite. During pending venue change, original venue continues to show. Updates server-side when change applies; guests notified via 0028.

### 2.3 § 12 — Guest count change · monotonic ratchet

Fundamentally different shape from § 10 / § 11 because guest count is a numeric attribute, not a swap.

**Direction restriction** (§ 12.2): couples can INCREASE the planning guest count but cannot DECREASE once any guest-count-dependent vendor has confirmed at that count. The minus stepper is disabled at the UI layer with hint *"Cannot decrease below confirmed floor — vendors have already committed to N guests."* This is a hard UI gate, not a state machine.

**Guest-count-dependent vendors** (§ 12.1) — only this subset receives the confirmation card. Per-vendor flag `is_guest_count_dependent` at onboarding (0006). V1 defaults:
- TRUE: catering · florals · mobile bar · lights & sound · name cards · favors · printable invites
- FALSE: photography · videography · HMUA · planner · broadcast

**Ratchet rule** (§ 12.2): floor = MAX(all confirmed counts ever). New vendors booked later inherit current floor as starting commitment. Vendor back-out dissolves THEIR commitment but the floor for remaining dependent vendors stays — couples cannot reduce because others are still planning at the higher count.

**Confirmation gate on increase** (§ 12.3): modal surfaces per-vendor cost impact (e.g., "+20 plates × ₱1,200 = +₱24,000") and total delta. Per-head pricing captured at vendor booking (0006).

**Capacity check** (§ 12.4): each dependent vendor's headcount capacity at the current proximity to event. Same two-message pattern as § 10 / § 11.

**Vendor response · chat negotiation** (§ 12.5): identical to § 10.4–10.5 with capacity-specific outcomes.

**Ratchet enforcement on back-out** (§ 12.6): floor doesn't reset when a vendor leaves. New vendors must meet current floor at onboarding.

**Decrease override** (§ 12.7): admin-mediated path for genuine catastrophes (force majeure, mass family withdrawal). Couple files via 0029 → admin negotiates with each vendor case-by-case.

**Seating chart side-effects** (§ 12.8): when a count change applies, seating chart adds tables · print pack flags "outdated" · name cards/favors quantity auto-updates · catering vendor's plate count updates in `vendor_event_window.confirmed_guest_count`.

**Audit log** (§ 12.9): `event_guest_count_log` writes a row per applied change.

### 2.4 § 13 — Per-vendor change-acceptance cutoffs (meta-rule applying to § 10/11/12)

Each vendor declares at onboarding how close to the event they'll accept changes to date / venue / guest count. Once any confirmed vendor is past their stated cutoff, the corresponding change attempt is BLOCKED OUTRIGHT. Admin override is the only forward path.

**Three cutoff fields** (§ 13.1) on the vendor record:
- `date_change_cutoff_days_before_event`
- `venue_change_cutoff_days_before_event`
- `guest_count_change_cutoff_days_before_event` (NULL = not guest-count-dependent)

Cutoff windows inclusive of the day itself (T-30 means T-30 is the last day to initiate, T-29 is past cutoff).

**V1 default values** (§ 13.2) pre-filled at vendor account creation. These are conservative starter values — owner should review with real vendor feedback during early onboarding.

| Vendor category | Date | Venue | Guest count |
|---|---|---|---|
| Catering | 30 | 21 | 14 |
| Florals | 21 | 14 | 10 |
| Mobile bar | 21 | 14 | 7 |
| Lights & sound | 14 | 21 | 7 |
| Name cards / favors / print | 21 | 14 | 10 |
| Photography | 7 | 3 | N/A |
| Videography | 7 | 3 | N/A |
| HMUA | 7 | 3 | N/A |
| Planner / coordinator | 7 | 3 | 7 |
| Live stream / broadcast | 3 | 3 | N/A |

**Pre-flight check** (§ 13.3) runs before the § 10.1 / § 11.1 / § 12.3 confirmation modal. If any vendor is past cutoff, a dedicated past-cutoff modal fires instead, listing blocking vendors + their cutoff dates + a "Request admin override" CTA. No reason field, no vendor cards.

**Retroactivity rule** (§ 13.5): vendor edits to cutoffs in 0022 do NOT apply retroactively to already-confirmed bookings. Cutoffs are snapshotted to `vendor_event_window.effective_*_cutoff` at booking confirmation time. Closes the adversarial edge case where a vendor could shorten their cutoff mid-engagement to block the couple.

**In-flight protection** (§ 13.6): changes initiated before the cutoff date and currently pending continue to run to completion even if the cutoff falls during the negotiation window. Cutoffs apply to NEW attempts, not in-progress ones.

**Admin override path** (§ 13.7): only forward path past cutoff. Couple files via 0029 → mediator reaches out to each past-cutoff vendor individually. Override actions log to `dispute_resolutions` with `cause = 'past_cutoff_override'`.

**Cross-references** added to top of § 10, § 11, § 12 as one-line italic notes pointing back to § 13.

---

## 3. What got compiled this session ([`Pricing.md`](Pricing.md) at corpus root)

Single consolidated MD doc compiling every Setnayan-platform price + vendor-side fee structure. Cross-references each row to its owning iteration `.md`. This doc didn't exist before today — pricing was scattered across CLAUDE.md sections, individual iteration files, and 05_Financials xlsx workbooks.

**Structure (12 sections):**

1. **Pricing rules** — currency / centavos / charm ladder / apparatus principle / wallet-retired / no-refund tag rules / 2D billing model / Cost Watch primitive / two-admin frequency gate
2. **Core couple-side SKUs** — Papic (11 SKUs · 4 marked V1.5+ deferred) · Panood (11) · Patiktok (2) · Save-the-Date · Invitation Widgets Pro · Pakanta · Bespoke Monogram · LED
3. **Setnayan Concierge** — ₱4,999 / 12mo single tier + 3-day card-less trial
4. **Vendor-side platform SKUs** — Vendor Pro · Extended Pin · Boosted Ads 5/10/20km (charm-corrected) · Sponsored Boost Quarterly/Annual (charm-corrected) · 5 tool integrations · All Tools Unlock Bundle · QR Retrieval drop-in
5. **Vendor-to-couple fee structures** — reschedule / relocation / per-head policies + the § 13 cutoff defaults; illustrative numbers from § 11.3 / § 12.3 labeled clearly as examples (NOT platform-mandated rates)
6. **Cost-per-event reference** — refreshed margin table
7. **CLAUDE.md cheat-sheet drift notes** — 8 stale rows flagged for owner reconciliation
8. **Retired SKUs** — 16-row historical context
9. **Companion artifacts** — 5 xlsx + 2 docx in 05_Financials/
10. **Cross-references** to every price-touching iteration
11. **Update protocol** — current hand-edit workflow + future canonical workflow (admin → DB → generated, ships with 0023 § 3.12)
12. **Companions** — Pricing.docx Word mirror

**`Pricing.docx` mirror** regenerated via pandoc, current with all content.

---

## 4. What got added this session (iteration 0023 § 3.12 — new admin surface)

A new tenth admin surface at `/admin/addons` that mirrors the customer-facing add-ons grid visually but routes each tile to admin-only settings. Lives in [`0023_admin_console/0023_admin_console.md`](0023_admin_console/0023_admin_console.md).

**Surface count update** (§ 1): 9 → 10. Mobile "More" tab gains the new surface.

**Two-tab card layout** (§ 3.12.1):
- **Customer Add-ons tab** — mirrors `/dashboard/[event_id]/add-ons` (per 0021 § 4.4) tile-for-tile + admin-only tiles for SKUs absent from the customer grid (Concierge · Same-Day Edit · Pakanta tiers · Bespoke Monogram · Custom Save-the-Date variants)
- **Vendor Add-ons tab** — first canonical visualization of vendor-purchasable SKUs (Pro Weekly · Extended Pin · Boosted Ads · Sponsored Boost · 5 tool integrations · All Tools Unlock · QR Retrieval)

**Per-tile metadata at a glance:** icon · name · price + 2D billing chip · eligibility dots per account type (🟢/⚫) · lifetime purchase count · Cost Watch health flag (🟢/🟡/🔴).

**Per-SKU drawer (4 tabs, right-side · 480 px on desktop · bottom-sheet on mobile):**

- **Eligibility** — `feature_policy` toggles + per-account-type `block_reason_*` text + `event_feature_policy_override` table
- **Pricing** — current state read + edit panel (charm-ladder helper · delta auto-flag at >₱500 triggers two-admin gate · frequency-change two-admin gate · required reason field · inline `service_catalog_price_history` last 10 changes)
- **Current users** — paid + active orders filtered by couple/vendor · row click → user detail § 3.4 · subscription-state distinction for recurring SKUs
- **Statistics** — lifetime purchases · active subs · revenue · conversion rate · distinct event count · Cost Watch metrics · time-series purchase chart

**Pricing Report Generation button** (single-admin · read-only-from-DB): queries `service_catalog` + `feature_policy` + price history + Cost Watch → renders templated Markdown matching `Pricing.md` structure → writes immutable snapshot to `/admin/addons/reports/{ISO_ts}.md` AND overwrites corpus-root `Pricing.md` AND regenerates `Pricing.docx` via pandoc.

**No new schema.** Leverages existing tables — `service_catalog`, `feature_policy`, `event_feature_policy_override`, `service_render_costs`, `service_catalog_cost_watch`, `orders`, `order_lines`, `admin_audit_log`.

**V1.5+ deferred:** nightly pg_cron auto-regeneration · Slack/email change notifications · `Pricing.pdf` mirror · external `GET /api/v1/pricing` read endpoint.

**Complement to § 3.5, not replacement.** § 3.5 stays as the engineering / audit tabular grid (spreadsheet density · bulk operations). § 3.12 is the product / strategy card view. Both edit the same underlying tables.

---

## 5. Decision log rows added this session

Each row is in [`CLAUDE.md`](CLAUDE.md) at the bottom (search `## Decision log`). All dated 2026-05-17. In chronological order of addition:

1. **Date-change flow with booked vendors** — multi-party state machine for iteration 0021 § 10
2. **Venue-change flow** — reuses date state machine with coverage-check substitution + auto-accept radius for § 11
3. **Guest-count change flow** — monotonic ratchet with vendor confirmation on increases, decreases blocked outright for § 12
4. **Per-vendor change-acceptance cutoffs** — three cutoff fields per vendor at onboarding · V1 defaults · retroactivity snapshot rule for § 13
5. **Consolidated `Pricing.md` reference doc created at corpus root** — what's in it + drift notes
6. **Admin Add-on Management surface** — new tenth admin surface in 0023 § 3.12

All cross-iteration impacts documented per row.

---

## 6. Open items / pending owner decisions

### 6.1 V1 default cutoff values in § 13.2

The 10-row category × 3-cutoff matrix in § 13.2 are starter guesses I picked based on industry norms (catering 30/21/14 days · photography 7/3/NULL · etc.). Owner should review with real vendor feedback during early onboarding before locking these as final. They're editable on a per-vendor basis at onboarding, so this is a launch-tunable.

### 6.2 Custom Monogram Pack vs Bespoke Monogram reconciliation

Pricing inventory flagged a conflict:
- Iteration 0021 § 1 (active apparatus table) still lists "Custom Monogram Pack · ₱2,000 · Active — event-wide flag ON"
- Iteration 0037 introduces "Bespoke Monogram · ₱2,999" as a replacement
- The Explore sweep classified Custom Monogram Pack as RETIRED 2026-05-14, but the 0021 spec text suggests otherwise

Owner needs to sign off on which is canonical. Pricing.md § 7 flags this for reconciliation.

### 6.3 CLAUDE.md § Cost-per-event cheat sheet drift

CLAUDE.md cheat sheet (line 117) is 8+ rows stale by 2026-05-17:
- Save-the-Date showing ₱49 (actual: ₱199 per 2026-05-17 reprice)
- Pro Widget tiers showing ₱99 (retired and superseded by Monogram Hero ₱1,999 + Live Schedule ₱999)
- Live Stream tier table completely obsolete (folded into Panood Daily Broadcast ₱2,499/day multi-cam built-in)
- Sponsored Boost ₱1,499/wk shown (retired and replaced by Boosted Ads 5/10/20km + Quarterly/Annual long-commits)

Pricing.md § 7 documents this. Worth a refresh pass when convenient.

### 6.4 0019 chat infrastructure dependency

§ 10, § 11, § 12, and § 13 all depend on iteration 0019 supporting **structured/interactive action cards as a first-class message type**. The chat thread is the negotiation surface; action cards (Propose alternate / Accept / Cancel / Escalate) are what trigger state transitions. If 0019 today only supports plain text, that's a real chunk of plumbing before any of the new flows can ship.

Worth verifying when the date/venue/guest-count flows move to implementation.

### 6.5 Setnayan platform SKU carve-out from cutoffs

§ 13 explicitly notes that the per-vendor cutoffs apply only to vendor bookings — Setnayan platform SKUs (Papic, Panood, Patiktok, LED, AI Highlights, etc.) have their own pre-event activation / rendering / fulfillment windows handled separately.

Worth confirming with iterations 0011 (Panood) and 0012 (Papic) that those pre-event windows are spec'd; if not, that's a gap worth filling separately.

### 6.6 0006 vendor onboarding · new fields to add coordinately

Across the four new sections (§ 10–13), iteration 0006 vendor onboarding is collecting NEW fields:

- `reschedule_fee_policy` (per-window fee structure)
- `relocation_fee_policy` (per-distance fee structure)
- `service_area_radius_km` + `auto_accept_venue_change_bool`
- `is_guest_count_dependent` boolean
- `per_head_rate` + `per_table_rate` for dependent vendors
- `capacity_ceiling_curve` (max headcount at proximity-to-event)
- `date_change_cutoff_days_before_event`
- `venue_change_cutoff_days_before_event`
- `guest_count_change_cutoff_days_before_event`

Worth a coordinated 0006 update when implementation begins to spec the onboarding form additions in one pass rather than piecemeal.

### 6.7 0023 § 3.12 implementation prioritization

The new admin surface is a significant build — card grid · 4-tab drawer · pricing report generation · two-admin gate integration. Owner needs to decide:
- Fast-track to V1 launch (high-leverage operational tool)
- Or accept manual `Pricing.md` editing through early access and ship § 3.12 in V1.5

Until § 3.12 ships, the canonical workflow is the hand-edit pattern from `Pricing.md` § 11 (current text).

---

## 7. Technical environment state

### 7.1 Pandoc installed locally

- Path: `/Users/icecasasola/.local/bin/pandoc`
- Version: 3.9.0.2 (arm64-macOS)
- Downloaded from GitHub releases (not via brew — brew not installed on this machine)
- Reversible: just delete the binary file
- Used to regenerate `.docx` mirrors for: 0021, 0023, Pricing

If the next Claude needs to regenerate any iteration `.docx` mirror:

```bash
cd /Users/icecasasola/Documents/Claude/Projects/Setnayan/<iteration_folder>
/Users/icecasasola/.local/bin/pandoc <name>.md -o <name>.docx
```

### 7.2 Files touched this session

| File | Type of change |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | 6 new decision-log rows appended |
| [`0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md`](0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md) | New § 10, § 11, § 12, § 13 + cross-ref notes |
| [`0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.docx`](0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.docx) | Regenerated (51.6 KB, was 31 KB) |
| [`0023_admin_console/0023_admin_console.md`](0023_admin_console/0023_admin_console.md) | New § 3.12 + § 1 surface count 9→10 |
| [`0023_admin_console/0023_admin_console.docx`](0023_admin_console/0023_admin_console.docx) | Regenerated (52.6 KB) |
| [`Pricing.md`](Pricing.md) | NEW — consolidated reference doc |
| [`Pricing.docx`](Pricing.docx) | NEW — Word mirror |

### 7.3 No schema additions, no code changes

This session was entirely spec corpus work. No DB migrations were authored. No `apps/web` files were touched. All new schema referenced in the spec (e.g., `is_guest_count_dependent`, the three cutoff fields, `event_guest_count_log`) is documented as a forward-dep for engineering pick-up.

---

## 8. How to resume

### 8.1 The user's most recent posture

The owner has been alternating between:
- Adding new customer-control flows (date change → venue → guest count → cutoffs)
- Asking for meta-references (Pricing.md, the admin Add-on Management surface)
- Confirming or refining proposed designs in tight back-and-forth

They were just ready to keep going when the session paused. Likely next moves (from my prior offerings):

- Continue adding customer controls (vendor cancellation by couple · adding vendors mid-plan · cancelling Setnayan SKUs · co-planner access)
- Verify the 0019 chat-action-card dependency before more flows pile up
- Refresh the CLAUDE.md cheat sheet to clear the 8 stale rows flagged in Pricing.md § 7
- Reconcile Custom Monogram Pack vs Bespoke Monogram (open item 6.2)
- Pivot to implementation prioritization for any of the spec'd surfaces

### 8.2 If the next Claude needs to make spec edits

Follow the COWORK.md update sequence (lines 44–54):

1. Capture the decision as a single paragraph with what + why
2. Append a row to CLAUDE.md decision log at the bottom (search `## Decision log`; rows go in date order)
3. Update affected iteration `.md` files
4. Update memory if cross-iteration (per CLAUDE.md guidance)
5. Update `MEMORY.md` index if a new memory file was created
6. Regenerate `.docx` mirror via pandoc (path above)
7. Acknowledge to the user with a succinct summary

The decision-log row pattern from this session: detailed multi-clause "decision" cell + thorough "why" cell + explicit "affects iterations" list at the end of the "why" column. The recent rows show the convention clearly.

### 8.3 If the user asks to verify spec against shipped product

WebFetch https://www.setnayan.com to confirm current shipped behavior (per the SessionStart guardrail). Header CTAs today: "Sign in", "Create account". Primary CTA on the home: "Start planning · free".

For deeper code-vs-spec audits, read `App_Build_Status.md` first.

### 8.4 If the user asks about a specific feature

Drill into the matching iteration folder. Quick map from the SessionStart hook:

| Iteration | Topic |
|---|---|
| 0000 | shell / nav |
| 0001 | guest list |
| 0002 | QR invites |
| 0003 | service_catalog / pricing (token wallet retired 2026-05-11) |
| 0006 | vendors mgmt |
| 0007 | budget |
| 0008 | seating |
| 0011 | Panood |
| 0012 | Papic |
| 0015 | main website |
| 0021 | couple dashboard |
| 0023 | admin console |
| 0028 | email notifs |
| 0029 | help center |
| 0030 | guided tour |
| 0031 | day-of-guest |
| 0032 | contract intel |
| 0033 | public API |
| 0034 | payments / cart |
| 0035 | observability |

---

## 9. Companions

- [`2026-05-17_Session_Handoff.docx`](2026-05-17_Session_Handoff.docx) — Word mirror generated via pandoc (regenerate with the path in § 7.1)

---

*Generated 2026-05-17 by the prior Claude account. Pick up wherever feels useful.*
