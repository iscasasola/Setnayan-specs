# Vendor Offer by Category — "Tell us your service, here's what Setnayan gives you"

**Date:** 2026-07-21 · **Status:** 🟢 Internal source-of-truth map **+** vendor-facing copy layer. Built for the onboarding "pick your service → see your offer" flow.
**Anchors to:** [`Feature_Access_By_Vendor_Category_2026-06-12.md`](Feature_Access_By_Vendor_Category_2026-06-12.md) (owner-locked access mechanics — the *how*, mostly BUILT PRs #1296/#1300/#1303/#1305) and [`02_Specifications/16_Vendor_Benefits_with_App_Evidence.md`](../02_Specifications/16_Vendor_Benefits_with_App_Evidence.md) (benefit catalog). This doc is the *offer* view over those — do not re-derive access rules here; cite them.

> **How to read this.** Two layers per section: **▸ Internal map** = the true access profile + shipped/planned benefit (grounded, keep honest) · **▸ Vendor copy** = the plain-language pitch that same fact becomes in the onboarding flow. A vendor selects one of the 31 canonical categories; the flow shows the Universal offer + that category's group block.

---

## 0 · The 31 canonical categories → benefit group

Canonical keys are from `apps/web/lib/vendors.ts` (`VENDOR_CATEGORY_LABEL`). Groups mirror the `Feature_Access` §7 matrix (10 live parent groups).

| Canonical category | Group | One-line offer headline |
|---|---|---|
| Venue · Religious Ceremony Venue · Accommodation | **Venue** | The seat plan + multi-area blueprint + live pax to plan the room |
| Catering · Cake maker · Mobile bar | **Feast** | Live headcount + per-table dietary counts + your service slot |
| Photographer · Videographer | **Documentary** | Palette + monogram + published seat plan for shot-plotting + Papic |
| Florist · Reception decor · Makeup artist · Hair stylist · Gown designer · Suit designer | **Design** | The couple's mood board (View + **Suggest**) + palette + your call-time |
| Host / Emcee · Band / DJ · String quartet · Choir · Officiant | **Program** | The shared day-of run-of-show (View + Suggest) + stage/floor plan + Live Stream plug |
| Invitations & stationery · Gifts & giveaways | **Prints** | Print-res monogram + palette + design reference + quantity (never addresses) |
| Photobooth · LED screens · Lights & sound | **Booths / AV** | Your placement pin on the floor + palette + slot; LED gets the LED Background Maker |
| Transportation | **Transport** | The day-of timeline + venue addresses + pax for load planning |
| Planner / Coordinator | **Coordinator** | Delegate access to run the whole event on the couple's behalf |
| Rings · Security · Miscellaneous | **Other** | Verified shop, free leads, chat, calendar, brief — the universal offer |
| Crew Meals · Church fees | *(ledger line — not a bookable vendor service; couple-side budget items)* | — |

---

## 1 · Universal offer — every vendor, every category, free during launch

**▸ Internal map** (grounded in `16_Vendor_Benefits` + `AS_BUILT_GROUND_TRUTH` + `Feature_Access` §2):
- **Free verified shop**, staged: start with a name → complete the profile → get verified (logo required only before verification — owner 2026-07-21). Vendor dashboard = 24 routes.
- **Free unlimited inquiries / leads** from couples; **imported clients are free forever**. Tokens are **RETIRED** (owner 2026-07-21 — nothing costs a token anymore).
- **In-app chat** with couples — identity masked until accept, company **logo** shown (never a personal photo).
- **Service packages · proposals/quotes · calendar with `.ics`**.
- **Vendor landing page** at `/v/[slug]`.
- **Vendor Event Brief** (free for every *booked* vendor — the couple does zero extra work): event date · venue + address · live pax (invited / attending / trend) · crew-meal count · palette strip · monogram thumbnail · **your schedule slot + ingress window** · seat-plan status · ceremony/faith context.
- **Shared day-of timeline** — booked vendors **View the full run-of-show + Suggest** changes on any slot (couple/coordinator approves).
- **Reviews** (couple-authenticated) · **past-events gallery** (safe layer, shipped) · **promotion**: placement on the couple's wedding page, LED background, and Live Stream brand plug.
- **Pro-and-up:** Market Intel (Demand Radar + Price-Position), analytics. *(Tiers sell **reach**, not features — the Brief and planning surfaces are free.)*

**▸ Vendor copy:**
> **Setnayan is free to join and free to get found.** Set up your shop, get unlimited inquiries from real couples, and chat, quote, and manage your calendar in one place. The moment a couple books you, you get an **Event Brief** — their headcount, palette, venue, and your exact time slot — so you walk into every event already prepared. No tokens, no per-lead fees; your imported clients stay free forever.

---

## 2 · Per-group offer

### Venue — *Venue · Religious Ceremony Venue · Accommodation*
**▸ Internal map:** Pax **View**; published **seat plan View** (fit check) + **multi-area blueprints** (`event_floor_areas`/`event_floor_objects`, PR #1309 — ceremony/cocktail/foyer spaces, each with its live window); day-of timeline View + Suggest; venue/logistics Edit-on-own.
**▸ Vendor copy:**
> See the couple's floor plan and guest count live, check the room fits, and map every space — ceremony, cocktails, reception — with its own timing. You're the couple's most-shopped supplier; a complete, verified venue shop with real photos wins the booking.

### Feast — *Catering · Cake maker · Mobile bar*
**▸ Internal map:** the heaviest data consumer — live **pax View**, **per-table dietary counts** (counts, never names — kills the "couple re-types dietary into chat" workflow), seat-plan View, timeline, crew-meal total. Food booths (mobile bar) get dietary counts too.
**▸ Vendor copy:**
> Get the real attending headcount and per-table dietary counts straight from the couple's guest list — no more chasing numbers over chat. See the seat plan for covers per table and your exact service window on the day-of timeline.

### Documentary — *Photographer · Videographer*
**▸ Internal map:** palette + **monogram (print-res)** for branded/graded outputs; **published seat plan View** for shot-plotting; timeline for coverage windows; complements **Papic** table-QR capture + photo-delivery mechanics (no new guest exposure).
**▸ Vendor copy:**
> Walk in knowing the couple's palette, monogram, floor plan, and run-of-show — so you can plot shots and coverage windows before you arrive. Plug into Papic for tagged candid capture, and place your brand on the couple's page, LED wall, and livestream.

### Design — *Florist · Reception decor · Makeup artist · Hair stylist · Gown designer · Suit designer*
**▸ Internal map:** **mood board View + Suggest** (propose palette/style refinements the couple approves — the one group with Suggest on aesthetics); palette strip; pax; seat plan View (decor: centerpiece counts); timeline with **call-time** (beauty: HMUA get their slot + ingress).
**▸ Vendor copy:**
> The couple's mood board and palette are yours to work from — and you can **suggest** refinements they approve in one tap. Beauty pros get an exact call-time; florists and decor see centerpiece counts off the seat plan.

### Program — *Host / Emcee · Band / DJ · String quartet · Choir · Officiant*
**▸ Internal map:** **full day-of timeline View + Suggest** (this group lives on the run-of-show); seat plan View (stage + dance floor); **Live Stream** brand plug; officiant gets ceremony/faith context from the Brief.
**▸ Vendor copy:**
> Run your set off the same run-of-show as everyone else — see the full timeline, request a change if you need more ingress, and check the stage and dance-floor layout. Get your name on the couple's livestream.

### Prints — *Invitations & stationery · Gifts & giveaways*
**▸ Internal map:** **print-res monogram** (plain download, ToS usage line, no watermark — locked D3), palette, invitation design reference, and **quantity** (invited + buffer) — **never guest names/addresses**. Envelope addressing is an explicit couple-initiated export only.
**▸ Vendor copy:**
> Get print-grade inputs — the couple's monogram at full resolution, their palette, and exact quantities — so what you produce matches their event. (Guest addresses are never shared automatically; the couple exports those deliberately if they want envelopes addressed.)

### Booths / AV — *Photobooth · LED screens · Lights & sound*
**▸ Internal map:** Brief = palette strip + pax + **your placement pin** (drag-placed `event_floor_object` linked to your booking — "Your spot") + your slot. **LED screens** additionally: the **LED Background Maker** (8K templates + monogram). Lights & sound: stage/floor plan.
**▸ Vendor copy:**
> See exactly where you're set up — your booth or screen is pinned on the couple's floor plan — plus their palette, headcount, and your time window. LED vendors get the LED Background Maker to design the wall around the couple's monogram.

### Transport — *Transportation*
**▸ Internal map:** day-of timeline View + Suggest (movement windows), venue name(s) + addresses, pax for vehicle planning.
**▸ Vendor copy:**
> See the full day-of schedule and every venue address, so you can plan routes and load times around the couple's actual run-of-show and headcount.

### Coordinator — *Planner / Coordinator*
**▸ Internal map:** the event-level **delegate** role — the couple invites the coordinator as a host; on accept they get **Edit** on guest list, seat plan (publish stays couple-confirmed), schedule, and vendor records, **View** on mood board, chat join-all, and **budget OFF by default**. Direct vendor lock today; the **consent-scoped money model** (shipped flag-dark) lets the couple grant "lock vendors" / "handle payments" per coordinator. Full detail: [`Coordinator_Role_Feature_Spec_2026-07-18.md`](../Coordinator_Role_Feature_Spec_2026-07-18.md).
**▸ Vendor copy:**
> Setnayan turns you into the couple's in-app right hand: with their approval, edit the guest list, seat plan, schedule, and vendor records; join every vendor chat; and run the day off one shared run-of-show. Money stays the couple's unless they explicitly hand you those keys.

### Other — *Rings · Security · Miscellaneous*
**▸ Internal map:** the Universal offer (§1) — verified shop, free leads, chat, calendar, Brief (pax/date/venue). No category-specific planning surface today.
**▸ Vendor copy:**
> A verified shop, unlimited free leads, in-app chat and quoting, and an Event Brief for every booking — the full Setnayan toolkit, no category add-ons needed.

---

## 3 · Booking fee — ⏸️ HELD (do not publish until locked)

**Deliberately not documented here** (owner 2026-07-21): the booking-fee model is in active flux — its trigger was rewritten three times on 2026-07-21 (first-payment → customer-accepts → **vendor prepays to send a finalized proposal**), the **₱4,000/vendor cap's unit is open** (per-booking vs per-vendor), the **Proposal Maker that would meter it is not built**, and `CLAUDE.md`/`Pricing.md`/`AS_BUILT` still say **"0% commission"** (a flagged, unreconciled contradiction).

**When it locks, this section states, in plain vendor terms:** what triggers the fee · the rate + cap · that imported clients are always free · that it buys nothing away from couples · what it means for the vendor's account (prepaid gate vs invoice). **Live source of truth meanwhile:** [`3D_Plan_and_Vendor_Revenue_Model_2026-07-20.md`](../3D_Plan_and_Vendor_Revenue_Model_2026-07-20.md) + [`Booking_Fee_Build_Plan_2026-07-21.md`](../Booking_Fee_Build_Plan_2026-07-21.md) + DECISION_LOG 2026-07-21 rows. **Do not write a number into vendor-facing copy until those settle.**

---

## 4 · Open / to-refresh

- **Booking fee section** (§3) — fill on lock.
- **Event-type coverage:** non-wedding vendors are currently invisible (`vendor_profiles.event_types` stuck at `['wedding']`) — the per-category offer above is wedding-framed; extend once coverage→profile propagation ships (PRs 1–2 #3457).
- **New `editorial` / content-creator category** (owner 2026-07-21) not yet in the 31-key `VENDOR_CATEGORY_LABEL` — add its group + copy when the canonical grain is decided ([`Editorial_and_Content_Creator_Coverage_2026-07-21.md`](../Editorial_and_Content_Creator_Coverage_2026-07-21.md) sign-off #1).
- **`crew_meals` / `church_fees`** are ledger lines, not sellable vendor shops — excluded from the offer flow.

*Sources: `Feature_Access_By_Vendor_Category_2026-06-12.md` (access mechanics, §7 matrix, locks D1–D5) · `16_Vendor_Benefits_with_App_Evidence.md` (benefit catalog) · `AS_BUILT_GROUND_TRUTH_2026-06-07.md` · `apps/web/lib/vendors.ts` (canonical categories) · `Coordinator_Role_Feature_Spec_2026-07-18.md`.*
