# Feature Access by Vendor Category — Cross-Feature Sync Map

> **Status: ✅ OWNER-LOCKED 2026-06-12 — all five D1–D5 decisions settled same day (see § 10).** Maps every couple-side planning feature that exists today to the vendor categories that need it, defines the access levels, and elevates the coordinator from per-thread chat guest to event-level delegate. Nothing here is built yet; § 9 sequences the build.

---

## 0. The problem this solves

The couple builds rich planning data — guest list + RSVP, seat plan, mood board/palettes, schedule, invitations — but **almost none of it reaches the vendors who need it**. As-built today (verified against `AS_BUILT_GROUND_TRUTH_2026-06-07.md` + iteration specs):

| What vendors can see today | Everything else |
|---|---|
| Aggregate headcount + crew meal count (0006) | ✗ Seat plan (couple-only; vendors only touch table QRs via Papic) |
| Chat messages + files in their own thread (0019) | ✗ Mood board / palettes (couple-only) |
| Table QR / event master QR scans (0002/0012) | ✗ Dietary data (couple re-types it into chat for the caterer) |
| | ✗ Day-of schedule (no shared timeline at all) |
| | ✗ Coordinator: per-thread chat join ONLY — cannot see or edit any couple surface |

The result: couples manually re-communicate the same facts (pax, palette, timeline, floor plan) to every vendor over chat, and the coordinator — the one professional hired to manage all of it — has no working surface.

---

## 1. The access model — one primitive, five levels

One primitive, not per-feature hacks: every couple planning **artifact** carries an access level per booked-vendor relationship (`event_vendor_relationships`), **defaulted by the vendor's parent category, overridable by the couple** per vendor (raise or lower). Coordinator access is a separate event-level **delegate role**, not a vendor share.

| Level | Meaning | Mechanics |
|---|---|---|
| **—** | No access | Default for anything not in the matrix |
| **Brief** | Snapshot fields baked into the vendor's booking card (no navigation into couple surfaces) | Auto-composed read model; refreshes on artifact change |
| **View** | Read-only live surface (e.g. published seat-plan viewer, dietary rollup) | New read-only routes under `/vendor-dashboard/clients/[bookingId]/...`, RLS-gated to booked status |
| **Suggest** | View + can propose a change; couple (or coordinator) approves/declines | Suggestion rows, never direct writes — respects the conflict-architecture guard (no unguarded 2-way writes) |
| **Edit** | Direct write, logged per action | **Coordinator delegate only** (per-area grants); never a default for ordinary vendors |

Two hard rules:

1. **Access keys on booked status.** Inquiring/white-list vendors get nothing beyond what marketplace browsing already shows. Booking is the unlock; downgrade/cancel revokes (rides the schedule-pool release path from PR #1290).
2. **Guest PII never crosses to vendors.** Vendors see *aggregates and artifacts*, never the roster (§ 8).

---

## 2. The Vendor Event Brief (answers “booths need a quick idea”)

Every **booked** vendor gets an auto-composed **Event Brief** card on their Clients page (`/vendor-dashboard/clients`), assembled entirely from data the couple already maintains — zero new couple work:

| Brief field | Source |
|---|---|
| Event date · venue name(s) + address | `events` + venue vendor record |
| **Pax**: invited / attending (RSVP live count) / trend arrow | 0001 guest list + RSVP |
| Crew meals total (their own crew highlighted) | 0006 computed crew meals |
| **Palette strip**: couple's master palette + guest dress-code swatches | 0010 `attire_guide_palette` |
| Monogram thumbnail | 0037 event monogram |
| **Their schedule slot(s)** + ingress/setup window | shared timeline (§ 4) |
| Seat-plan status: not started / draft / published (+ View link if granted) | 0008 `event_floor_plan` |
| Ceremony type / faith context (drives attire + program norms) | `events.ceremony_type` |

This is the booth vendor's whole question answered in one card: *palette, pax, where, when.* It's also the caterer's, the florist's, and the photographer's first-meeting prep sheet.

**Tier note:** the Brief is **free for all booked vendors** — per the locked vendor-tier doctrine, tiers sell REACH, not features. A better-briefed vendor is the couple's UX win.

---

## 3. Coordinator = event-level delegate (the role upgrade)

Today the coordinator is only a chat guest (0019 per-thread join). This elevates any booked vendor under **Planning & Coordination** categories (Wedding Planners full/partial, Day-Of Coordinators, plus the PH-specific coordinator types) to an offerable **delegate role**:

- **Foundation already exists:** `event_moderators` table shipped 2026-05-19 (0048 Phase A) with **no RLS enforcement or UI**. Wire it instead of inventing a new table. The couple "promotes" a booked coordinator (or invites by email — covers off-platform coordinators via the existing 0006 invite-claim flow, locked D5; if that coordinator later imports their own external client list, the standing **1-token-per-client import fee** applies via `import_external_client()` — no free bypass).
- **Per-area grants** the couple toggles at promotion time (all logged to `event_action_log` with `performed_by_role='coordinator'`, surfaced as a "your coordinator did X" stream on the couple dashboard, per the 0016 forward-spec):

| Area | Default grant | Notes |
|---|---|---|
| Guest list + RSVP tracking | **Edit** | Add/edit guests, chase RSVPs — the core day-to-day delegation |
| Seat plan | **Edit** | Draft edits; **publish stays couple-confirmed** (QR mint is irreversible) |
| Schedule / day-of timeline | **Edit** | The coordinator's home turf |
| Vendors management (0006 records) | **Edit** | Log vendors, milestones, statuses |
| Invitations | **Edit, first deploy couple-confirmed** | § 5 — coordinator UX must actively guide the confirm gate (locked D4) |
| Mood board | **View** | Aesthetic direction stays the couple's; raiseable to Edit |
| Budget & expenses (0007) | **OFF by default; couple-raiseable to View; Edit never in V1** | Money is the most sensitive surface — locked D1 |
| Chat threads | Join-all granted at promotion (replaces one-by-one 0019 adds) | 0019 mechanism stays for non-delegate cases |

- **Multiple coordinators** (e.g. day-of + full-service) each get their own grant row. Revocation is one toggle, effective immediately.

---

## 4. Shared day-of timeline (the schedule everyone follows)

One timeline per event (the couple's existing Schedule tab is the seed), three lenses:

- **Couple + coordinator:** full edit (coordinator via § 3 grant).
- **Booked vendors:** **View the full day-of timeline + Suggest** changes on any slot ("we need ingress 2 h earlier"), with their own slots visually pinned. Suggestions queue to couple/coordinator for approve/decline — no direct vendor writes. **Full-timeline visibility is the locked default (D2)** — vendors coordinate with each other off the same sheet, which is the point; couple can restrict any vendor to own-slots-only.
- **Approved slots** auto-block nothing on the vendor's schedule pools (pools are date-grain); they DO show on the vendor's Calendar day view as itinerary detail.
- `.ics` export already exists couple-side; extend the feed per-vendor (their slots) and per-coordinator (everything).
- Day-of, this same timeline is what the 0031 guest LIVE "live schedule" card reads — one source of truth, three audiences (vendor, coordinator, guest).

---

## 5. Invitation deployment fix

Invitations stay **couple-branded, couple-owned**, but two gaps close:

1. **Coordinator can run the campaign:** with the Invitations grant, the coordinator can send/resend invitations, chase non-responders, and manage RSVP follow-up. The **first deploy requires a one-tap couple confirmation** (it's the couple's voice going out); resends/reminders don't. **Locked D4 with an explicit UX mandate: the coordinator must be guided through the confirm gate, not surprised by it** — the deploy button reads "Send for couple's approval", a persistent "Waiting for [couple] to confirm" banner shows queue state, the couple gets a notification + one-tap approve, and the coordinator is nudged to remind the couple if unconfirmed after 48 h. The campaign is never silently stuck.
2. **Stationery vendors get print-grade inputs, not addresses:** a booked Prints-category vendor's Brief carries palette, monogram (print-res download), invitation design reference, and **quantity** (invited count + buffer) — never guest names/addresses. If the couple wants the vendor to address envelopes, that's an explicit couple-initiated export (§ 8), not a default.

---

## 6. Seat plan fix

The published seat plan stops being couple-eyes-only:

- **Coordinator:** Edit (draft), couple confirms publish (§ 3).
- **Floor-touching vendors** (Feast, Venue, Design/decor, Booths, Program, Documentary): **View** the published plan — read-only viewer route reusing the print-pack's overview render. Caterer sees covers per table; venue checks fit; florist counts centerpieces; booth vendor sees their assigned placement; band/MC sees stage + dance floor; photographer pre-plots shots.
- **Booth/stage placements become first-class floor objects** (the 0008 catalog already free-places a stage): couple or coordinator drops "Photo Booth — [vendor name]" on the plan; that placement pin is what the booth vendor's Brief deep-links to.
- Per-table dietary counts ride the caterer's seat-plan view (counts per table, no names) — kills the "couple re-types dietary into chat" workflow.

---

## 7. The matrix — default access by parent category

Defaults only; couple can raise/lower per vendor. Columns = the 10 live parent groups (Planning column = its coordination categories **when promoted to delegate**; un-promoted planning vendors get the ordinary-vendor column treatment of their row).

| Artifact (source iteration) | Coordinator (delegate) | Feast | Booths | Design (attire·beauty·decor) | Venue | Documentary | Program | Prints | Transport |
|---|---|---|---|---|---|---|---|---|---|
| Pax + RSVP count (0001) | Edit | **View** | Brief | Brief | **View** | Brief | Brief | **View** (qty) | Brief |
| Dietary / meal rollup (0001) | View | **View** (per-table counts) | Brief (counts, food booths only) | — | Brief | — | — | — | — |
| Guest roster — names/PII (0001) | Edit | — | — | — | — | — | — | — | — |
| Seat plan, published (0008) | Edit (publish = couple) | View | View (own placement pinned) | View | View | View | View (stage/floor) | — | — |
| Mood board / palettes (0010) | View | Brief (cake/styling) | Brief (strip) | **View + Suggest** | Brief | View | Brief | View | — |
| Monogram assets (0037) | View | Brief | Brief | View | — | View (overlay use) | Brief | **View (print-res)** | — |
| Day-of timeline (0021 Schedule) | Edit | View + Suggest | View + Suggest | View + Suggest | View + Suggest | View + Suggest | View + Suggest | Brief | View + Suggest |
| Invitations (0002) | Edit (1st deploy couple-confirmed) | — | — | — | — | — | — | Brief (design + qty) | — |
| Budget & payments (0007) | **OFF default → View raiseable** (locked D1) | — | — | — | — | — | — | — | — |
| Venue / logistics details | Edit | View | View | View | (own) | View | View | — | View |

Notable per-category reads of the matrix:

- **Stylist/designer** (the owner's opening example): mood board View + Suggest — they can propose palette refinements the couple approves; plus pax, seat plan, timeline.
- **Booths** (the owner's closing question): Brief = palette strip + pax + their placement + their slot. Food booths additionally get dietary counts.
- **Feast/catering**: the heaviest consumer — live pax, per-table dietary counts, seat plan, timeline.
- **Documentary**: palette + monogram (for graded/branded outputs), seat plan (shot plotting), timeline (coverage windows). Complements the existing Papic table-QR mechanics without exposing anything new about guests.

---

## 8. Privacy guardrails (RA 10173)

- **Aggregates cross; identities don't.** Vendors get counts, swatches, layouts, timelines — never guest names, contacts, photos, or QR tokens. Dietary is counts-per-table, not names.
- Any name-level export to a vendor (e.g. envelope addressing, calligraphy place cards) is an **explicit couple action** with an on-screen disclosure, logged, and scoped to the named fields needed — never a standing grant level.
- Coordinator PII access (guest list Edit) is consent-framed at promotion: the couple is told exactly what the delegate will see, and the action log keeps them accountable.
- Behavioral-data lock respected: vendor-facing aggregates obey existing min-N surfacing rules; nothing here adds identified couple-behavior exposure.

---

## 9. Build sequence (CC-time, dependency-ordered)

| Phase | What | Why this order |
|---|---|---|
| **1. Vendor Event Brief** | Read-model + card on `/vendor-dashboard/clients` booking detail. Zero new write paths, all source data exists. | Biggest value-per-effort; ships alone safely |
| **2. Coordinator delegate** | RLS + grants UI on the existing `event_moderators` table; action log + couple-visible stream; join-all threads. | Foundation table already shipped; unblocks every "coordinator edits X" promise. **DB-level guards first** per the conflict-architecture lock — delegate writes are the first true 2-writer surface on couple data |
| **3. Shared timeline + Suggest flow** | Timeline read routes per vendor, suggestion rows + approve queue, per-vendor `.ics`. | Needs phase 2's approval actor (coordinator) to be useful |
| **4. Live viewers** | Read-only seat-plan viewer + dietary rollup + booth placement pins on the floor plan. | Reuses print-pack rendering; pins extend the 0008 catalog |
| **5. Invitation campaign delegation** | Coordinator send/resend/chase with first-deploy couple confirm. | Smallest slice; rides phase 2 grants |

---

## 10. Owner decisions — ✅ ALL LOCKED 2026-06-12

| # | Question | **Locked answer** |
|---|---|---|
| **D1** | Coordinator budget (0007) visibility | **LOCKED:** default **OFF**, couple-raiseable to **View**; Edit never in V1 (money + RA 11967 caution) |
| **D2** | Vendors see the FULL day-of timeline or only their own slots by default? | **LOCKED: Full** — couple can restrict any vendor to own-slots-only |
| **D3** | Monogram print-res download to vendors | **LOCKED:** plain download for booked Prints/Design/Documentary; usage line in ToS, no watermark |
| **D4** | First invitation deploy | **LOCKED: hard couple-confirm — with the explicit owner mandate that the coordinator is properly guided** that couple confirmation is required (guided UX spec in § 5: "Send for couple's approval" button · waiting banner · couple notification + one-tap approve · 48 h reminder nudge) |
| **D5** | Off-platform coordinator delegation | **LOCKED: yes** — via existing 0006 invite-claim → account creation; delegation always requires an account. **Owner addendum: if the coordinator imports their own external customers, the standing import fee applies — 1 token per imported client** (the shipped `import_external_client()` path from PR #1292; delegation grants NO free bypass of the tier-matrix import cost) |

---

*Sources: `AS_BUILT_GROUND_TRUTH_2026-06-07.md` · `App_Build_Status.md` · iteration specs 0001/0002/0006/0008/0010/0019/0021/0022/0048 · `Vendor_Taxonomy_V1_Master.md` (10-parent grouping, 192 sub-categories) · locks honored: vendor-tier ladder (reach-not-features) · conflict-architecture (DB guards before 2-way) · behavioral-data min-N · booking ruleset (status-flip never delete).*
