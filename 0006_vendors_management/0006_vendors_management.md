# 0006 — Vendors Management

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - **"No vendor app, no vendor self-input, every vendor row manually encoded by the couple" is RETIRED.** A full vendor self-service dashboard shipped at `/vendor-dashboard` (~24 routes), and the couple's Vendors tab (`/dashboard/[eventId]/vendors`) shipped as a **Plan + Budget Accordion marketplace surface** (shortlist + per-category picks across the 10 taxonomy folders, 6-dimension matching, "% match" pills), not the flat couple-encoded registry described below.
> - **Commission is 0% ("0% commission, ever") and vendor↔customer money is OFF-PLATFORM (RA 11967).** Every reference here to "settled **Setnayan Pay** orders" — including the TIER-1 verified-booking branch of the venue master-QR scan — is built on a premise that no longer holds; Setnayan never sits between vendor and couple at checkout. The editorial-credit verification machinery that keys off a settled Setnayan-Pay transaction is unbuilt/historical.
> - **The vendor token economy is LIVE** (bidding tokens, burn-on-answer wired PR #1057, 100 free founder tokens) — distinct from the retired customer wallet (0003), which this spec already notes is "explicitly NOT used here."
> - **Vendor tiers shipped as Free / Pro ₱2,499-28d / Enterprise ₱5,499-28d** (+ Additional Branch ₱999, Verification badge ₱1,499). Any "Vendor Pro Weekly" / "₱499-wk" references are stale price history — live wins.
> - The `vendor_invites` claim-token flow and the per-event vendor registry data model broadly persist; the marketplace + vendor-dashboard layer was added on top.
>
> When this body disagrees with the above, **the above wins.**

> ## DESIGN ADDITION — 2026-06-10: "Do-it-yourself, manage everything from the app" (manual-add refinement)
> **Status: DESIGN ONLY · no code · owner-requested 2026-06-10 ("capture as design only").** Formalizes the self-service / standalone-planner posture and adds one net-new modeling piece. Two of the three parts already exist — this writes down the intended shape.
>
> **The intent (owner, 2026-06-10):** when a couple adds a vendor manually, **ask whether they want to connect that vendor to the app.** *Yes* → invite/connect (existing `vendor_invites` flow). *No* → the couple manages that vendor entirely themselves: set the price, list the inclusions for the package, and **link it to other services manually if needed** — so a couple can do everything themselves and **manage their whole wedding from the app even if no vendor ever joins.**
>
> ### ① Add-time connect fork — *UX promotion of an existing capability*
> Today "Invite to Setnayan" is a **secondary action** buried in the vendor detail drawer (see `## Invite-to-Setnayan flow`). This promotes it to an **explicit fork at the moment of adding**:
> > *"Connect them to Setnayan?  — **Yes, invite them** (they get a free profile · unlocks chat · marketplace grows)  /  **No, I'll manage this myself** (you set the price & inclusions; they're never contacted)."*
> - **Yes** routes to the existing flow incl. the *already-on-Setnayan Connect short-circuit* (sub-rule (g), 2026-05-19 log).
> - **No** = today's default off-platform record (`event_vendor_relationships.marketplace_vendor_id IS NULL`). Fully self-managed; the "Invite to Setnayan" drawer action stays available so the couple can still connect later. Reversible, no data loss.
> - **Privacy is already correct:** in the *No* path the vendor is never contacted and **never sees `package_*` / `vendor_inclusions` / milestones** (locked identity-only claim page, 2026-05-19). "Keep private" is genuinely private by design.
>
> ### ② Couple-side structured service-linking — *the one NET-NEW piece*
> Today the couple gets a **free-form inclusions list** (`vendor_inclusions`) but **no structured *link* between two of their own records.** This adds the couple-side analog of the vendor "✓ comes with X·Y·Z" linked-services (`vendor_service_links` / `vendor_services.is_linked_only`). Blueprint (not applied):
> ```sql
> CREATE TABLE event_vendor_links (              -- couple-authored, event-scoped, couple-only RLS
>   link_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
>   event_id           UUID NOT NULL,
>   from_relationship_id UUID NOT NULL REFERENCES event_vendor_relationships(relationship_id),
>   to_relationship_id   UUID     REFERENCES event_vendor_relationships(relationship_id), -- link to another private record
>   to_setnayan_service  TEXT,     -- OR link to a Setnayan in-app service the couple has (service_key)
>   link_type          TEXT NOT NULL DEFAULT 'comes_with'  CHECK (link_type IN ('comes_with','bundled_with')),
>   note               TEXT,
>   CHECK (to_relationship_id IS NOT NULL OR to_setnayan_service IS NOT NULL)  -- exactly one target
> );
> ```
> - Renders as the same "✓ comes with X · Y · Z" chip on the couple's **own** vendor card, mirroring the marketplace card.
> - **Budget roll-up must not double-count** a linked-only item — reuse the existing `is_linked_only = FALSE` budget-median guard (see memory `project_setnayan_linked_services_and_demo_coverage`).
> - **3-actor:** Couple = full CRUD, entirely private. Vendor = never sees it (even post-connect it stays the couple's view, not imposed). Admin = couple-private, **excluded from marketplace stats / no moderation** (it's the couple's own notes, not an editorial claim).
>
> ### ⚠ OPEN — owner to confirm the linking target
> The blueprint above supports **both** targets (link a private record to *another private record* **or** to a *Setnayan in-app service*). Owner did not pin which is intended — confirm: couple-composes-own-package only, link-to-Setnayan-services only, or both (assumed).
>
> ### Why this matters beyond PH
> This is the clincher for global-readiness: off-platform records already carry full price + inclusions + payment detail, so **a couple in any country can run their whole wedding solo with an empty marketplace.** The marketplace becomes *enrichment, never a requirement.* See `Global_Readiness_Groundwork_2026-06-10.md` § 8.

**Type:** Implementation work order (Claude Code ticket)
**Surface:** Setnayan Web → Couple Dashboard ("Vendors" panel) + responsive mobile · **Bottom-nav tab: Vendors** · URL: `setnayan.com/dashboard/[event-id]/vendors`
**Phase:** Phase 1 — pre-event planning surface
**Status:** Drafted 2026-05-09
**Owner:** Ice (indaleciocasasolaii@gmail.com)
**Builds on:** 0000 (app shell, sign-in, event-scoped URL, bottom-nav routing), 0001 (events, dashboard shell baseline)

---

## What this iteration builds

The Vendors panel — the couple's central registry of every external supplier working their wedding. In V1 there is **no vendor app and no vendor self-input.** Every vendor row is **manually encoded by the couple** (or the Setnayan concierge on their behalf). This is a planning, tracking, and payment-deadline-management surface.

For each vendor the couple captures:

1. **Vendor identity** — business name, primary contact, phone, email, website / social, notes.
2. **Services covered** — which wedding services this vendor delivers, drawn from a hybrid taxonomy (canonical fixed list + custom rows the couple can add).
3. **Package + inclusions** — package name, contracted amount in PHP, and a free-form inclusions list (what's actually being delivered).
4. **Payment milestones** — flexible custom milestones (any number per vendor) with label, due date, amount, paid status, payment method/reference. System computes balance and surfaces upcoming / overdue deadlines.
5. **Crew + crew meals** — number of crew the vendor is sending, per-crew-meal cost, optional "vendor provides own meals" toggle. System computes the crew meal total and rolls up across all vendors.
6. **Meetings** — list of scheduled meetings between couple and vendor (planning meetings, tastings, walkthroughs, fittings, etc.). Each meeting has a title, date/time, mode (in-person / video / phone), location or link, agenda, attendees, and post-meeting notes. The soonest upcoming meeting per vendor is surfaced as "Next meeting" on the vendor card. Manually encoded by the couple in V1; **migrates to vendor-managed in Din (Phase 3)** where the supplier-facing app lets vendors propose / reschedule / confirm meetings directly. The schema is shaped today so the migration is data-only — same table, just a different writer.
7. **Contract files** — couple uploads PDFs/image scans of signed contracts to R2.
8. **Day-of arrival window** — when this vendor is scheduled to arrive at the venue.

The panel also exposes a **Service Coverage** view that maps every canonical service to its assigned vendor (or flags it as gap / not needed). This is how the couple sees at a glance "do I have a Photographer yet?"

---

## Visual reference (canonical)

`0006_vendors_management.html` (in this same folder) is the canonical visual reference. The implementation must visually match it at desktop and mobile widths. Reuse the design tokens (`#FAF6F0` cream, `#1A1A1A` charcoal, `#C97B4B` terracotta; Cormorant Garamond + Manrope + DM Mono).

The mockup shows three primary surfaces:

- **Vendor list (desktop):** sortable table + service-coverage strip + aggregate payment summary.
- **Vendor detail drawer (desktop):** services chips, package + inclusions, payment milestone ledger, crew meal block, contracts list.
- **Mobile cards:** single-column vendor cards with a payment progress bar; tap → vendor detail sheet (full-height, scrollable). FAB to add a vendor.

---

## Stack & conventions

Per `CLAUDE.md`:

- **Frontend:** Next.js 15 App Router. Server Components for the list view; Client Components for the add-vendor flow, milestone editor, crew calculator, contract uploader.
- **UI:** Tailwind + shadcn/ui primitives (Dialog, Sheet, Select, Input, Button, Tabs, Popover, DatePicker). Reuse the dashboard shell from 0001.
- **Data:** Postgres via existing Setnayan backend; Drizzle/Prisma matching repo convention.
- **Storage:** Cloudflare R2 PH-region bucket for contract files (`/vendor-contracts/{event_id}/{relationship_id}/{contract_id}.{ext}`). Signed URLs for downloads.
- **Auth:** couple-auth required. All endpoints scoped to the requesting couple's event.
- **Validation:** Zod, server- and client-side. PHP amounts stored as integer centavos to match `service_catalog` convention.

---

## Route

```
setnayan.com/dashboard/vendors                — list view
setnayan.com/dashboard/vendors/[vendor_id]    — vendor detail (drawer overlay; deep-linkable)
setnayan.com/dashboard/vendors/new            — add-vendor flow
setnayan.com/dashboard/vendors/coverage       — service coverage view (tab)
```

---

## Vendor scan at venue · TIER 1 / TIER 2 (locked 2026-05-22)

Each event carries a **master QR** encoding `https://setnayan.com/{event-slug}` (no token suffix · distinct from the per-guest `guests.qr_token` system in [0002](../0002_qr_invitation_system/0002_qr_invitation_system.md)). Couples already share this QR publicly via Facebook posts, save-the-date PDFs, and the wedding website footer. Starting 2026-05-22 the **same master QR** also drives in-app vendor delivery confirmation + self-claim at the venue.

The vendor scan flow is **part of the unified QR lifecycle model** locked in [0002 § Unified QR Code Lifecycle Model](../0002_qr_invitation_system/0002_qr_invitation_system.md). This section owns the schema + the vendor-side UX contract; 0002 owns the cross-iteration framing.

### Scan-time branch · TIER 1 / TIER 2

When a vendor signed into the Setnayan app scans the event master QR at the venue, the app branches on relationship state:

| State | Branch | What scan does | Verification | Editorial credit tier |
|---|---|---|---|---|
| **TIER 1 · Verified booking** | `event_vendor_relationships.marketplace_vendor_id = <this vendor>` AND a settled Setnayan Pay order exists for this event | Confirm-delivery CTA ("Confirm you delivered {package_name} to {couple_names} today"). On confirm: stamps `delivered_at = NOW()` + `delivered_via = 'venue_qr_scan'` + flips editorial credit to **VERIFIED** per the 2026-05-20 two-tier model. Setnayan Pay transaction IS the verification — no admin review. | Automatic | **VERIFIED** badge + premium featured-strip placement + vendor analytics dashboard + bundle CTA inclusion (per CLAUDE.md 2026-05-20 "Two-tier editorial credit system locked") |
| **TIER 2 · Self-claim** | Vendor account exists, but no booking with this event (off-platform vendor, or platform-discovered-but-paid-off-platform) | Claim-credit form: canonical_service picker (28-enum below) → sub-category picker (from 0044's 192-row taxonomy) → product picker (from 0045's `vendor_products` for this vendor, optional) → one-line description (200 chars). Creates a `wedding_showcase_vendor_claims` row with `status = 'pending'` AND `claim_source = 'venue_qr_scan'` (claims via scan get a +5% bump in auto-approval probability). | Routed to 4-layer moderation pipeline locked 2026-05-20 (vendor verified status + canonical service coverage + active-in-city + couple veto + admin) | **CLAIMED** badge (normal credit, lower visual prominence, no premium strip) |
| **No vendor account on this device** | Sign-in / vendor-signup / claim-existing-invite-token via the 2026-05-19 `vendor_invites` flow (existing § Invite-to-Setnayan below) | Prompt-to-sign-in OR jump-to-`/register-vendor` OR enter pending-invite token if the couple already emailed one (gates on email matching) | n/a (sign-in is the gate) | n/a |

### Schema additions

Two new columns on `event_vendor_relationships` (extends the existing 2026-05-12 schema above):

```sql
ALTER TABLE event_vendor_relationships
  ADD COLUMN delivered_at TIMESTAMPTZ,
  ADD COLUMN delivered_via TEXT CHECK (delivered_via IN ('venue_qr_scan','vendor_dashboard_confirm','admin_marked'));
```

The `wedding_showcase_vendor_claims` row schema already lives in [0046 § extensions locked 2026-05-20 line 567](../0046_wedding_showcase/0046_wedding_showcase.md) — vendor-self-claim writes flow through that table. The 2026-05-22 lock adds two new columns to that schema to track the scan vector:

```sql
ALTER TABLE wedding_showcase_vendor_claims
  ADD COLUMN claim_source TEXT NOT NULL DEFAULT 'vendor_dashboard'
    CHECK (claim_source IN ('vendor_dashboard','venue_qr_scan','admin_added')),
  ADD COLUMN product_id UUID REFERENCES vendor_products(product_id);  -- nullable; from 0045
```

`claim_source = 'venue_qr_scan'` gives the moderation pipeline a higher base auto-approval probability — being physically at the venue at event-time is a strong signal of legitimacy.

### Anti-abuse caps (2026-05-20 caps re-stated)

Inherited from the 2026-05-20 two-tier editorial-credit lock — applies to all `wedding_showcase_vendor_claims` regardless of `claim_source`:

- **5 claims/day** per vendor account (cap)
- **3 rejected claims in 30 days** = 30-day claim ban for that vendor
- **Couple permanent block** — couples can permanently block a vendor from claiming credit on their wedding (writes to `vendor_blocks` table, per 0046)
- **Scan-vector geofence** — `claim_source = 'venue_qr_scan'` requires the scanning device's GPS fix (if available) to fall within 50 km of the event venue's stored coordinates. Failures downgrade the claim to `'vendor_dashboard'` and add a `geofence_mismatch_warning` flag for the moderation queue.

### Cross-iteration touches

- **[0002 § Unified QR Code Lifecycle Model](../0002_qr_invitation_system/0002_qr_invitation_system.md)** — canonical lock for the 3 lifecycle states · 4 scan actors · master QR vs guest QR distinction.
- **[0023 admin console](../0023_admin_console/0023_admin_console.md)** — moderation queue for TIER 2 claims; 48-hr SLA per the 2026-05-20 lock.
- **[0045 product catalogs](../0045_product_catalogs/0045_product_catalogs.md)** — product picker UX for TIER 2 self-claim. Vendor selects the specific product they delivered (Spanish Latte coffee booth · 3-tier chocolate ganache cake · Maria Clara terno) so the editorial credit links to a specific catalog row, not just the canonical_service.
- **[0046 § extensions](../0046_wedding_showcase/0046_wedding_showcase.md)** — the editorial-credit chip on Phase 4 reads the `wedding_showcase_vendor_claims` table; VERIFIED tier vendors get the premium featured-strip placement.

---

## Data model

### `canonical_services` — hardcoded enum

Master list of typical Filipino-wedding services. This is **code-shipped**, not user-editable. Couples can choose which canonical services apply to their wedding (mark "not needed") and can add custom rows beyond this set.

```
ceremony_venue
reception_venue
catering
photography
videography
same_day_edit
drone
prenup_shoot
wedding_coordination
hmua
bridal_gown
groom_suit
entourage_attire
florals
cake_desserts
lights_sound
dj_emcee_host
mobile_bar
live_band
acoustic_performer
choir_string_quartet
officiant
transportation_bridal_car
transportation_guest_shuttle
invitation_print
stationery_signage
photobooth
souvenirs_giveaways
wedding_rings
honeymoon_planner
digital_services
```

(29 canonical services. Order roughly matches wedding-planning priority. Final list reviewed in HTML mockup; add/remove via PR.)

**`digital_services` added 2026-06-03** — the marketplace **Design › Digital Services** child (the Setnayan digital-productions tile: Pakanta · Animated Monogram · Pro Website · Live Venue Photo Wall · Pailaw). It is a **generic, vendor-listable** category — 3rd-party monogram designers / wedding-website builders / LED-content studios can register under it, with the 5 Setnayan services surfacing as options inside. Full per-surface mapping: [Digital_Services_Cross_Surface_Map_2026-06-03.md](../03_Strategy/Digital_Services_Cross_Surface_Map_2026-06-03.md).

**Note on `wedding_coordination` (locked 2026-05-12):** Wedding coordinators register as a regular vendor under this canonical key and use the same 0022 vendor dashboard as photographers, caterers, and every other category — there is **no separate "coordinator" platform role**. Coordinators receive two special permissions on top of standard vendor capability: (a) per-thread join into customer ↔ vendor chats per 0019 § Coordinator-join flow (the couple invites them into vendor threads as needed) and (b) broadcast access on day-of guest experience surfaces per 0031. Both permissions are scoped to the events that booked them and revoke automatically at event-end + 30 days.

### Note on this enum vs. v11 taxonomy (clarification 2026-05-20)

The 28-value `vendor_category` enum above is the **original couple-side per-event categorization layer** for `event_vendors` (per-event vendor cards tracked by the couple). It is **not** the marketplace taxonomy.

The marketplace's **canonical taxonomy is 192 entries in `canonical_service_schemas`** seeded by iteration 0044 (`supabase/migrations/20260521040000_iteration_0044_v11_full_taxonomy_seeds.sql`), grouped into **5 mega-menu columns** via `apps/web/lib/taxonomy.ts`:

1. **Capture** (Visual) — photographers, videographers, drones, SDE, pre-nup locations
2. **Music & Entertainment** — bands, DJs, choirs, choreographers, hosts
3. **Food & Beverage** — catering, cake, bar, stations & booths
4. **Look** — bridal wear, groom wear, beauty, jewelry, decor
5. **Ceremony · Coordination · Logistics · Stationery · Travel** — officiants, planners, transport, invitations, honeymoon

Authoritative spec: [`02_Specifications/Vendor_Taxonomy_V1_Master.md`](../02_Specifications/Vendor_Taxonomy_V1_Master.md). 192-entry per-category attribute schemas: [`0044_per_category_schemas`](../0044_per_category_schemas/0044_per_category_schemas.md).

**Pro/Max tier caps** (per CLAUDE.md decision-log entry 2026-05-20 "Free/Pro/Max 3-tier vendor pricing") operate at the **mega-menu column level** (Free = 1 column · Pro = 2–3 columns · Max = all 5), NOT at the 28-enum or 192-row level. A photographer covering 9 Capture-column sub-categories still counts as **1 column** under tier-cap accounting.

The 28-value enum here remains in use for `event_vendors.category` (the couple's per-event vendor list), as a pragmatic categorization that doesn't need to mirror every marketplace facet.

### `event_vendor_relationships` table

> **Note (locked 2026-05-12):** This table tracks the COUPLE's per-event list of vendors they're working with. It is distinct from the marketplace `vendors` table (declared in 0022) which holds the canonical platform vendor entities. When a couple selects a marketplace vendor, this table's `marketplace_vendor_id` FK links them; for couple-entered custom vendors (off-platform), `marketplace_vendor_id` stays NULL. The previous name `vendors` was renamed to `event_vendor_relationships` to remove the collision with the marketplace table; the primary key column is `relationship_id` (not `vendor_id`) to make joins explicit.

```sql
CREATE TABLE event_vendor_relationships (
  relationship_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  marketplace_vendor_id UUID REFERENCES vendors(vendor_id),  -- nullable; links to canonical marketplace vendor (declared in 0022)
  business_name       TEXT NOT NULL,
  contact_name        TEXT,
  phone               TEXT,
  email               TEXT,
  website             TEXT,                       -- URL or social handle
  notes               TEXT,                       -- couple's free-form notes
  day_of_arrival_at   TIMESTAMPTZ,                -- when vendor arrives at venue
  status              TEXT NOT NULL DEFAULT 'lead'
                        CHECK (status IN ('lead', 'booked', 'completed', 'cancelled')),
  package_name        TEXT,
  package_total_centavos BIGINT NOT NULL DEFAULT 0,  -- PHP centavos
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX event_vendor_relationships_event_idx ON event_vendor_relationships (event_id);
CREATE INDEX event_vendor_relationships_marketplace_idx ON event_vendor_relationships (marketplace_vendor_id);
```

### `vendor_services` — links a vendor to one or many services (canonical or custom)

```sql
CREATE TABLE vendor_services (
  relationship_id     UUID NOT NULL REFERENCES event_vendor_relationships(relationship_id) ON DELETE CASCADE,
  service_kind        TEXT NOT NULL CHECK (service_kind IN ('canonical', 'custom')),
  canonical_key       TEXT,                       -- present when service_kind='canonical'
  custom_service_id   UUID,                       -- present when service_kind='custom'
  PRIMARY KEY (relationship_id, service_kind, COALESCE(canonical_key, custom_service_id::text))
);
```

**Crew size extension (locked 2026-05-12):**

```sql
ALTER TABLE vendor_services
  ADD COLUMN crew_size INT NOT NULL DEFAULT 1 CHECK (crew_size >= 1),
  ADD COLUMN crew_meal_required BOOLEAN NOT NULL DEFAULT TRUE;
```

Each service specifies how many crew members will be physically present at the event for that service (a photographer + 2 assistants = `crew_size = 3`; a solo videographer = `crew_size = 1`; a 5-piece string quartet + 1 sound tech = `crew_size = 6`). This feeds into:

- **0007 Budget computed crew meal totals** — the catering vendor's "meal count" auto-aggregates from all booked services' `crew_size` where `crew_meal_required = TRUE`, so couples don't undershoot their catering quote.
- **Dashboard headcount totals** — Setnayan surfaces pax + crew combined headcount on the customer's dashboard ("180 guests + 22 crew = 202 covers") so the catering vendor receives the right quote.

`crew_meal_required` defaults TRUE; vendors can opt out of crew meal billing if they bring their own crew meals or the service has no on-site crew (e.g., invitation printing).

### `event_custom_services` — couple-defined service rows beyond the canonical list

```sql
CREATE TABLE event_custom_services (
  custom_service_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `event_service_coverage_status` — per-event flag for "not needed"

Lets the couple mark a canonical service as not-needed so it stops showing up in the gap list. No row = "needed but not yet booked." Vendor assigned via `vendor_services` overrides "not needed."

```sql
CREATE TABLE event_service_coverage_status (
  event_id            UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  canonical_key       TEXT NOT NULL,
  status              TEXT NOT NULL CHECK (status IN ('not_needed')),
  PRIMARY KEY (event_id, canonical_key)
);
```

### `vendor_inclusions` — free-form line items inside the package

```sql
CREATE TABLE vendor_inclusions (
  inclusion_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id     UUID NOT NULL REFERENCES event_vendor_relationships(relationship_id) ON DELETE CASCADE,
  label               TEXT NOT NULL,              -- "8-hr photo coverage", "2 photographers", "200 print prints", etc.
  quantity            TEXT,                       -- free-form ("8 hours", "200 pcs", "unlimited")
  sort_order          INT NOT NULL DEFAULT 0
);
```

### `vendor_payment_milestones` — flexible custom milestones

```sql
CREATE TABLE vendor_payment_milestones (
  milestone_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id     UUID NOT NULL REFERENCES event_vendor_relationships(relationship_id) ON DELETE CASCADE,
  label               TEXT NOT NULL,              -- "Reservation", "Down payment", "1st partial", "Balance", etc.
  due_date            DATE,                       -- nullable for milestones with no fixed deadline
  amount_centavos     BIGINT NOT NULL,            -- PHP centavos contracted for this milestone
  paid_at             TIMESTAMPTZ,                -- NULL = unpaid
  paid_amount_centavos BIGINT,                    -- actual amount paid (may differ from amount_centavos)
  payment_method      TEXT CHECK (payment_method IN
                        ('cash', 'gcash', 'bank_transfer', 'check', 'card', 'other')),
  payment_reference   TEXT,                       -- ref no, transaction id, OR check no — couple-entered
  notes               TEXT,
  sort_order          INT NOT NULL DEFAULT 0
);
CREATE INDEX vendor_payment_milestones_due_idx ON vendor_payment_milestones (due_date)
  WHERE paid_at IS NULL;
```

### `vendor_crew` — crew count + meal cost computation

```sql
CREATE TABLE vendor_crew (
  relationship_id     UUID PRIMARY KEY REFERENCES event_vendor_relationships(relationship_id) ON DELETE CASCADE,
  crew_count          INT NOT NULL DEFAULT 0,
  vendor_provides_meals BOOLEAN NOT NULL DEFAULT FALSE,
  meal_cost_each_centavos BIGINT NOT NULL DEFAULT 0
    -- couple's expected cost per crew meal (defaults to event-level catering crew-meal rate
    -- when the catering vendor's package is configured; otherwise 0).
);
```

Crew meal total per vendor (computed view):

```sql
CREATE VIEW vendor_crew_meal_totals AS
SELECT
  c.relationship_id,
  v.event_id,
  CASE WHEN c.vendor_provides_meals THEN 0
       ELSE c.crew_count * c.meal_cost_each_centavos
  END AS crew_meal_total_centavos
FROM vendor_crew c
JOIN event_vendor_relationships v USING (relationship_id);
```

### `vendor_meetings` — scheduled meetings between couple and vendor

```sql
CREATE TABLE vendor_meetings (
  meeting_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id     UUID NOT NULL REFERENCES event_vendor_relationships(relationship_id) ON DELETE CASCADE,
  title               TEXT NOT NULL,              -- "Menu tasting", "Floral mockup", "Final walkthrough"
  starts_at           TIMESTAMPTZ NOT NULL,       -- meeting datetime (Asia/Manila)
  duration_minutes    INT,                        -- nullable; informational
  mode                TEXT NOT NULL CHECK (mode IN ('in_person', 'video', 'phone')),
  location            TEXT,
    -- For in_person: venue / address. For video: meeting URL. For phone: dial-in or "vendor will call".
  agenda              TEXT,                       -- free-form
  attendees           TEXT[],                     -- couple-side attendee names ("Maris", "Anton", "Mom")
                                                  -- in V1; future: array of guest_id refs
  status              TEXT NOT NULL DEFAULT 'scheduled'
                        CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  post_notes          TEXT,                       -- post-meeting notes; populated after status='completed'
  created_by_actor    TEXT NOT NULL DEFAULT 'couple'
                        CHECK (created_by_actor IN ('couple', 'vendor', 'setnayan_staff')),
    -- V1: always 'couple'. Phase 3 (Din): vendors write 'vendor'. Setnayan Staff support actions write 'setnayan_staff'.
  created_by_user_id  UUID NOT NULL,              -- whoever entered it (couple-side user in V1)
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX vendor_meetings_vendor_starts_idx
  ON vendor_meetings (relationship_id, starts_at)
  WHERE status = 'scheduled';
```

`created_by_actor` is forward-compatible: today everything is `'couple'`, but the column lets Din writes coexist with legacy couple-encoded rows once the vendor app ships. No data migration is required when Din launches.

### `vendor_contracts` — uploaded contract files

```sql
CREATE TABLE vendor_contracts (
  contract_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id     UUID NOT NULL REFERENCES event_vendor_relationships(relationship_id) ON DELETE CASCADE,
  filename            TEXT NOT NULL,
  r2_object_key       TEXT NOT NULL,              -- /vendor-contracts/{event_id}/{relationship_id}/{contract_id}.{ext}
  byte_size           BIGINT NOT NULL,
  mime_type           TEXT NOT NULL,
  uploaded_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  uploaded_by_user_id UUID NOT NULL              -- couple member who uploaded
);
```

R2 retention: 5 years post-event, mirroring photographer industry norm and Personal Reels storage policy.

### `vendor_invites` — couple-initiated invitations for off-platform vendors (locked 2026-05-19)

The couple may invite an off-platform vendor (any `event_vendor_relationships` row where `marketplace_vendor_id IS NULL`) to claim a free Setnayan profile. On successful claim, the new marketplace `vendors` row is auto-linked back to the originating `event_vendor_relationships.marketplace_vendor_id`, which transitions the relationship from off-platform to on-platform and unlocks chat (0019) for that couple. UX rules live in `## Invite-to-Setnayan flow — UX rules` below; the vendor-side claim landing page lives in `0022 § Couple-invite claim landing`.

```sql
CREATE TABLE vendor_invites (
  invite_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id     UUID NOT NULL REFERENCES event_vendor_relationships(relationship_id) ON DELETE CASCADE,
  invited_by_user_id  UUID NOT NULL,                       -- couple member who sent the invite
  email               TEXT NOT NULL,                       -- email-only delivery (locked 2026-05-19)
  business_name       TEXT NOT NULL,                       -- snapshot from the relationship row at invite time
  service_category    TEXT,                                -- canonical_key or custom service name (snapshot)
  claim_token         TEXT UNIQUE NOT NULL,                -- URL-safe ~32 char nonce; routes to /vendor/claim/{token}
  status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','claimed','expired','revoked','declined')),
  expires_at          TIMESTAMPTZ NOT NULL,                -- created_at + 90 days
  sent_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  claimed_by_user_id  UUID,                                -- vendor user on claim
  claimed_vendor_id   UUID REFERENCES vendors(vendor_id),  -- new (or existing) marketplace vendor row on claim
  claimed_at          TIMESTAMPTZ,
  declined_at         TIMESTAMPTZ,
  revoked_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX vendor_invites_relationship_idx ON vendor_invites (relationship_id);
CREATE UNIQUE INDEX vendor_invites_token_idx ON vendor_invites (claim_token);
-- One live (pending) invite per (relationship_id, normalized email) at a time:
CREATE UNIQUE INDEX vendor_invites_live_idx
  ON vendor_invites (relationship_id, LOWER(email))
  WHERE status = 'pending';
```

**Server-enforced rules:**

- Invite can only be created when the parent `event_vendor_relationships.marketplace_vendor_id IS NULL`. If a vendor has already been linked, the "Invite to Setnayan" action is hidden on the couple's surface.
- One pending invite per `(relationship_id, LOWER(email))` at a time. To re-send to the same address, the couple revokes the existing pending invite first (one-tap "Resend" affordance does revoke + create-new atomically).
- **No cap on total pending invites per event** (locked 2026-05-19).
- **No cooldown after decline / expire / revoke** (locked 2026-05-19) — couple may re-invite the same email immediately. Email-deliverability throttling is enforced at the transactional-email provider layer (standard de-dupe + bounce handling), not exposed as a UI rule.
- **Lazy expiration sweep** — when `/vendor/claim/{token}` is opened (or when the couple's vendor list is rendered), the server flips any `status='pending'` rows where `expires_at < now()` to `status='expired'`. No cron job per [[reference_setnayan_cron_strategy]].
- **Claim resolution:** on successful signup-from-claim, the new marketplace `vendor_id` is written to BOTH `event_vendor_relationships.marketplace_vendor_id` AND `vendor_invites.claimed_vendor_id`, and `vendor_invites.status='claimed'`. The same transaction also inserts a `vendor_follows` row per **0019 § Booking-implies-follow auto-insert** so the couple's `Message` button enables immediately without a separate follow step. The couple's 0019 chat surface unlocks automatically.
- **Already-on-Setnayan short-circuit:** when the couple submits the invite modal and the entered email matches an existing `users.email` who owns a `vendors` row, the modal switches to a "Connect to existing profile?" path. On confirm, no `vendor_invites` row is created; the existing `vendor_id` is linked directly into `event_vendor_relationships.marketplace_vendor_id` (same transaction also writes the `vendor_follows` row per 0019). The existing vendor receives a 0019 system notification that the couple has connected.

---

## Computed / derived values

### Per-vendor

- `package_balance_centavos` = `package_total_centavos − SUM(paid_amount_centavos)` over the vendor's milestones.
- `next_unpaid_milestone` = the milestone with the soonest non-null `due_date` where `paid_at IS NULL`.
- `payment_progress_pct` = `SUM(paid_amount_centavos) / package_total_centavos`, capped at 100%.
- `crew_meal_total_centavos` per `vendor_crew_meal_totals` view above.
- `next_meeting` = the meeting row with the soonest `starts_at >= now()` and `status = 'scheduled'`. Surfaced as "Next meeting" on the vendor card and in the drawer header.

### Per-event aggregate (Vendor Panel header)

- **Total contracted** across all vendors with `status IN ('booked', 'completed')`.
- **Total paid** across all milestones with `paid_at IS NOT NULL`.
- **Total outstanding** = contracted − paid.
- **Next deadline** = earliest `due_date` of any unpaid milestone across all booked vendors.
- **Crew meal estimate** = `SUM(crew_meal_total_centavos)` across all vendors.
- **Service coverage %** = `assigned_canonical_services / (canonical_services − not_needed_services)`.

These power the stats strip at the top of the Vendors page and feed iteration **0007 (Budget & Expenses)** when it pulls vendor rows.

---

## Hybrid service taxonomy — UX rules

1. **Default state when adding a vendor:** the canonical 28-item list is shown as a multi-select with type-ahead filter. Couple ticks one or more.
2. **"Add custom service" affordance** lives at the bottom of the multi-select. Opens a small inline input → creates a row in `event_custom_services` → immediately selectable.
3. **Custom services are scoped per event.** No global custom-service registry; couples typing "Habagat reception band" don't pollute other couples' lists.
4. **Coverage gap view** only counts canonical services. Custom services are surfaced in a separate "Custom services" panel below the canonical grid.
5. **"Not needed" toggle** — if a couple isn't doing a Pre-nup Shoot, they tap the canonical card → "mark not needed." It's removed from the gap count and visually muted in coverage view. Reversible.

---

## Payment milestones — UX rules

1. **No fixed schedule.** Each vendor starts with zero milestones; the couple adds milestones as they appear in the contract.
2. **Common shortcuts:** the milestone editor offers one-tap presets to scaffold typical schedules: "Reservation + Down + Balance," "Reservation + 4 partials + Balance," "Lump sum on the day." The couple edits each milestone's due date and amount after picking the preset.
3. **Paid status is not financial verification.** When the couple marks a milestone paid, they're recording what *they* did. Setnayan never validates the transaction. `paid_amount_centavos` allows recording partial payments different from the contracted amount.
4. **Overdue surfacing.** Any milestone with `due_date < today AND paid_at IS NULL` renders red. The vendor card in the list surfaces "X day(s) overdue" so the couple sees it without opening the detail.
5. **Upcoming-deadline notification cadence:** out of scope for V1. We surface in-UI; we don't email/push. (Notifications iteration is queued for V1.1.)

---

## Crew meals — UX rules

1. **Default `meal_cost_each_centavos`:** when a vendor is added, this defaults to the event-level "crew meal rate." Couples set the rate once on the catering vendor's record (or via a thin event-settings field). Editable per-vendor in case some crew get plated meals and others get takeaway.
2. **`vendor_provides_meals = true`** zeroes that vendor's contribution to the crew meal aggregate without losing the crew count (still useful for headcount at venue, parking, etc.).
3. **Couple sees both numbers** at the event level: total crew headcount across all vendors AND the crew meal cost subtotal.
4. **Forward link to 0007 (Budget):** the crew meal aggregate is a budget row in iteration 0007. We don't double-count — vendor packages are separate budget rows.

---

## Meetings — UX rules

1. **Multiple meetings per vendor.** A photographer typically has 4–6 meetings before the wedding (initial consult, contract signing, prenup planning, prenup shoot day, final walkthrough, etc.). The drawer shows them as a chronological list with the next one pinned at the top.
2. **"Next meeting" surface.** The vendor card in the list shows a one-line preview of the soonest upcoming meeting ("Next: Menu tasting · Apr 22 · in-person"). When a meeting is missed (`starts_at < now()` and still `status='scheduled'`), it renders amber as "Past — confirm outcome" and prompts the couple to mark it `completed`, `cancelled`, or `rescheduled`.
3. **Mode-specific UX:**
   - `in_person` — `location` accepts a free-form address or venue name. No map embed in V1.
   - `video` — `location` accepts a meeting URL. The detail surface shows a "Open meeting link" button when the start is within ±15 min; outside that window it's just a copyable URL.
   - `phone` — `location` accepts a phone number or "vendor will call." No dialer integration in V1.
4. **Manual encoding only.** V1 is couple-only writes (`created_by_actor='couple'`). The vendor cannot edit, propose, or confirm — they communicate offline (email, message, call) and the couple records the meeting. The schema is shaped to accept Din writes later without a migration.
5. **Post-meeting notes.** When the couple marks a meeting `completed`, the UI prompts for free-form notes ("Picked the seafood option, no allergies, vendor will send invoice by Mon"). Notes stay attached to the meeting row for future reference.
6. **No reminders / push in V1.** In-UI surfacing only. The notifications iteration (V1.1) will own email + push for upcoming meetings the same way it owns payment-deadline reminders.
7. **No `.ics` export in V1.** Calendar export ships as part of iteration **0007 Budget & Expenses** (which already owns the `.ics` pattern for payment deadlines). Once 0007 lands, meetings will join payments in the same combined calendar feed.
8. **Din migration path.** When the supplier app ships in Phase 3, vendors will create / propose / reschedule meetings via Din writing to the same `vendor_meetings` table with `created_by_actor='vendor'`. Couples will see vendor-proposed meetings as `status='scheduled'` rows that originated outside their hands; UI affordances to confirm or counter-propose come with the Phase 3 surfaces. Tonight's V1 schema needs no changes for that future.

---

## Invite-to-Setnayan flow — UX rules (locked 2026-05-19)

For every off-platform vendor row (`event_vendor_relationships.marketplace_vendor_id IS NULL`), the vendor detail drawer / mobile sheet exposes a secondary action: **"Invite to Setnayan."** The action is hidden the moment the relationship is linked to a marketplace vendor (whether via claim, Connect, or marketplace-vendor selection in the original add-vendor flow).

### Invite modal — `Invite {Business Name} to claim their profile`

- **Email field:** pre-filled from `event_vendor_relationships.email` (couple can correct). Required.
- **Copy:** *"We'll email them an invitation to claim a free Setnayan profile. If they sign up, you can message them in-app and your records here will connect to their profile automatically."*
- **CTA:** **Send invite** → creates the `vendor_invites` row (status `pending`, `expires_at = now() + 90 days`), triggers the transactional email, closes modal, status pill on the relationship row flips to **Invite sent**.

### Already-on-Setnayan detection (in the modal)

On submit, the server checks whether `email` matches an existing `users.email` who owns a `vendors` row. If yes, the modal swaps copy to:

> *"This vendor is already on Setnayan as **{Existing Business Name}**. Connect this engagement to their existing profile?"*

with a single **Connect** CTA. On confirm:
- No `vendor_invites` row is created.
- `event_vendor_relationships.marketplace_vendor_id` is set to the existing `vendor_id`.
- The existing vendor receives a 0019 system notification + Threads entry: *"{Couple display name} added you as their {service_category} for {event_date}."*
- Chat unlocks for the couple immediately; the toast confirms *"Connected to {Existing Business Name} — chat is now unlocked."*

### Status pill on the relationship row

Replaces the off-platform muted "Manual entry" pill whenever an invite (or Connect) has happened. Pill state derives from the most recent `vendor_invites` row for that relationship, or from `marketplace_vendor_id` directly:

| Pill | Condition |
|---|---|
| `Invite sent · {N days left}` | latest `vendor_invites.status = 'pending'` |
| `Joined Setnayan` | `marketplace_vendor_id IS NOT NULL` (whether via claim or Connect) — also fires a one-time toast on the couple's session: *"{Business Name} joined Setnayan — chat is now unlocked"* |
| `Declined the invite` | latest `vendor_invites.status = 'declined'` (no `marketplace_vendor_id` set) |
| `Invite expired` | latest `vendor_invites.status = 'expired'` |
| `Invite revoked` | latest `vendor_invites.status = 'revoked'` |
| (no pill) | no invite has ever been sent — fall back to the existing off-platform muted indicator |

The pill has a tap target that opens a small inline menu with contextually relevant actions: **Resend invite** (for declined / expired / revoked / no-pill states), **Revoke** (for pending), or **View Setnayan profile** (for Joined).

### Couple controls — no cap, no cooldown

Both locked 2026-05-19. Couple may have an unlimited number of pending invites across their event, and may immediately re-invite the same email after a decline / expire / revoke. Deliverability hygiene (rate limits, bounce handling) is enforced at the transactional-email provider layer and never surfaced as a UI restriction.

### Privacy on the claim page (identity-only)

The vendor's claim landing page surfaces an identity-only snapshot of the relationship row — business name, contact info, service category, event date, couple display name. The following fields are **explicitly NOT shown pre-claim** (locked 2026-05-19): `package_name`, `package_total_centavos`, any `vendor_inclusions`, any `vendor_payment_milestones`, any `vendor_meetings`. The vendor sees those the moment they finish signup and land in their 0022 Clients pipeline. Full claim-page surface lives in `0022 § Couple-invite claim landing`.

### Failure handling

- **Vendor declines** → couple sees `Declined the invite` pill. The off-platform row stays intact (no chat, full payment-tracking still works). Couple can re-invite the same email immediately.
- **Vendor ignores for 90 days** → invite flips to `expired` on next access. Pill switches to `Invite expired` with a one-tap **Resend** affordance.
- **Couple changes their mind** → tap pill → **Revoke**. Pill flips to `Invite revoked`. The vendor's claim link returns "This invite is no longer active" if they later try to open it.

---

## DIY-mode vendor browse — filter popup

### DIY-mode filter popup (locked 2026-05-12)

The DIY-mode vendor browse view (at `/dashboard/{event-id}/vendors/browse`) shows the vendor marketplace as a list/grid of vendor cards. Customers refine the list via a **filter popup** — a modal triggered by a "Filter & sort" button in the top toolbar.

**Filter popup contents:**

- **City** (multi-select chip list, populated from cities of all active vendors)
- **Service category** (multi-select, the 28 canonical + custom categories)
- **Price band** (range slider in ₱ with histogram backdrop showing distribution of vendor packages)
- **Available on date** (date picker; defaults to event date)
- **Tier filter** (any / Standard Verified / Certified / Boosted)
- **Distance radius from venue** (10 / 20 / 30 / 50 km; default 30 km — origin is the **chosen reception venue's lat/lon**, the stored event anchor). This couple-set *discovery* radius is distinct from the vendor's own **"serves my area" hard filter** — `distance(reception_venue, vendor) ≤ vendor.service_radius` (Free 10km … Enterprise 100km). **Region is a display label, not a matching filter** (owner correction 2026-06-04 — supersedes the earlier "derive region so the area-filter works"); distance is straight-line in V1 (drive-time = V2), and out-of-range vendors are hidden with a count + names. Canonical model: [Vendor_Match_Personalization §2a/§2b](../03_Strategy/Vendor_Match_Personalization_2026-06-01.md) + DECISION_LOG 2026-06-04.
- **Years operating** (any / 1+ / 3+ / 5+ years)
- **Has Setnayan-exclusive offer** (toggle)
- **Has reviews** (toggle)
- **Rating** (min stars · 3+ / 4+ / 4.5+)
- **Verified only** (toggle, OFF by default — locked 2026-05-15) — when OFF (default), browse shows BOTH `public_visibility='verified'` AND `public_visibility='coming_soon'` vendors. Coming-soon cards render with a muted "Coming soon" badge, no booking CTA, profile is read-only preview. When ON, only verified vendors appear. Default OFF so couples see the platform's growing vendor pool even before verification completes — per 2026-05-15 decision. See iteration 0022 § 2.1c for the `public_visibility` state machine.

**Sort options (radio):**
- Recommended (Setnayan default: tier-strict + relevance score)
- Most reviews
- Highest rated
- Closest to venue
- Newest on Setnayan
- Price: low to high
- Price: high to low

**Apply / Reset buttons.** Active filters appear as chips at the top of the browse view; tapping × on any chip removes that filter. URL is updated with query params so filtered state is shareable.

**Guided-mode contrast:** Guided customers don't see this popup. Guided uses the recommender (per the 7 locked Guided UX patterns in memory) that picks vendors based on event constraints. DIY is opt-in for customers who want to browse the marketplace themselves.

Schema additions if needed: none — all filters operate on existing `event_vendor_relationships` + `vendor_services` columns (joined to marketplace `vendors` via `marketplace_vendor_id` for marketplace browsing).

---

## Reviews schema (locked 2026-05-12)

```sql
CREATE TABLE vendor_reviews (
  review_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id        UUID NOT NULL REFERENCES vendors(vendor_id),
  reviewer_user_id UUID NOT NULL REFERENCES users(user_id),
  event_id         UUID NOT NULL REFERENCES events(event_id),
  booking_id       UUID NOT NULL,  -- the booking this review is for
  rating_overall   INT NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
  rating_communication INT CHECK (rating_communication BETWEEN 1 AND 5),
  rating_quality       INT CHECK (rating_quality BETWEEN 1 AND 5),
  rating_value         INT CHECK (rating_value BETWEEN 1 AND 5),
  rating_punctuality   INT CHECK (rating_punctuality BETWEEN 1 AND 5),
  body_text        TEXT,
  photo_keys       TEXT[],  -- R2 keys for review photos
  vendor_response  TEXT,  -- vendor's public reply
  is_published     BOOLEAN NOT NULL DEFAULT FALSE,
  is_flagged       BOOLEAN NOT NULL DEFAULT FALSE,
  flagged_reason   TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at    TIMESTAMPTZ,
  edited_at        TIMESTAMPTZ
);

CREATE UNIQUE INDEX vendor_reviews_one_per_booking ON vendor_reviews(booking_id);
CREATE INDEX idx_vendor_reviews_vendor ON vendor_reviews(vendor_id, published_at DESC) WHERE is_published = TRUE;

-- Aggregate view for marketplace display
CREATE MATERIALIZED VIEW vendor_review_stats AS
SELECT
  vendor_id,
  COUNT(*) AS review_count,
  AVG(rating_overall)::numeric(3,2) AS avg_rating,
  AVG(rating_communication)::numeric(3,2) AS avg_communication,
  AVG(rating_quality)::numeric(3,2) AS avg_quality,
  AVG(rating_value)::numeric(3,2) AS avg_value,
  AVG(rating_punctuality)::numeric(3,2) AS avg_punctuality
FROM vendor_reviews
WHERE is_published = TRUE
GROUP BY vendor_id;

-- Refresh on review publish/edit (trigger or hourly cron, whichever is cheaper)

-- Self-review hard gate — schema CHECK + BEFORE INSERT trigger.
-- See CLAUDE.md decision log 2026-05-15.

ALTER TABLE vendor_reviews ADD CONSTRAINT no_self_review
  CHECK (reviewer_user_id <> (
    SELECT owner_user_id FROM vendors v WHERE v.vendor_id = vendor_reviews.vendor_id
  ));

CREATE OR REPLACE FUNCTION block_related_account_review()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  matched_signal TEXT;
  v_owner_id     UUID;
BEGIN
  SELECT owner_user_id INTO v_owner_id FROM vendors WHERE vendor_id = NEW.vendor_id;

  -- 1. Team member of the vendor (owner_self is already caught by the CHECK above).
  IF EXISTS (
    SELECT 1 FROM vendor_service_agents
    WHERE vendor_id = NEW.vendor_id AND member_id = NEW.reviewer_user_id
  ) THEN
    matched_signal := 'team_member';
  -- 2. Payment-method match — reviewer and vendor owner share any payer account
  --    reference across service_order_payments history.
  ELSIF EXISTS (
    SELECT 1
    FROM service_order_payments p1
    JOIN service_orders o1            ON o1.order_id = p1.order_id
    JOIN service_order_payments p2    ON p2.payer_account_number = p1.payer_account_number
                                      AND p2.payer_account_number IS NOT NULL
    JOIN service_orders o2            ON o2.order_id = p2.order_id
    WHERE o1.user_id = NEW.reviewer_user_id
      AND o2.user_id = v_owner_id
  ) THEN
    matched_signal := 'payment_match';
  -- 3. Device fingerprint match (requires user_devices table — iteration 0034 § 3.1a).
  ELSIF EXISTS (
    SELECT 1
    FROM user_devices d1
    JOIN user_devices d2 ON d2.device_hash = d1.device_hash
    WHERE d1.user_id = NEW.reviewer_user_id
      AND d2.user_id = v_owner_id
  ) THEN
    matched_signal := 'device_match';
  -- 4. Household address match (requires users.address_normalized; null-safe).
  ELSIF EXISTS (
    SELECT 1
    FROM users u1
    JOIN users u2 ON u2.address_normalized = u1.address_normalized
                  AND u1.address_normalized IS NOT NULL
                  AND length(u1.address_normalized) > 0
    WHERE u1.user_id = NEW.reviewer_user_id
      AND u2.user_id = v_owner_id
  ) THEN
    matched_signal := 'household_match';
  END IF;

  IF matched_signal IS NOT NULL THEN
    RAISE EXCEPTION 'SELF_REVIEW_BLOCKED: % (appeal via 0023 Help inbox)', matched_signal
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER vendor_reviews_block_related_account
  BEFORE INSERT ON vendor_reviews
  FOR EACH ROW EXECUTE FUNCTION block_related_account_review();
```

**Review flow:**
1. Review prompts trigger via 0028 email 24 hours after event ends ("How was [Vendor Name] at your wedding?")
2. Customer rates 1-5 stars overall + 4 sub-categories + optional text + up to 5 photos
3. Vendor has 7 days to publicly respond before review auto-publishes
4. Reviews are PERMANENT per Vendor Agreement § "review permanence + mediation" — never deleted, only flagged for admin mediation if content violates community standards
5. Reviews show on vendor cards (avg star + count), vendor landing page (full reviews list), vendor's own dashboard (in 0022 Clients tab — read-only summary)

---

## Dual-role customer ↔ vendor — review gate (locked 2026-05-15)

A single `users` row may carry `account_type='vendor'` AND own/host events as a customer. Setnayan's "one app, three role-routed entries" rule (CLAUDE.md 2026-05-11) extends explicitly to the customer ↔ vendor surface: applying to become a vendor is **additive** — it never closes the customer surface, and the Switch-view pill toggles between roles in chrome. The model mirrors the admin = customer-with-`is_internal=TRUE` pattern locked in § 10a (CLAUDE.md 2026-05-12): one identity, multiple roles, real customer codepath.

**Self-purchase is allowed.** A vendor who books a service from their own catalog hits the standard cart and checkout flow. At checkout, iteration 0034 § 3.1a surfaces a confirm modal with two CTAs — **"Pay full price"** (standard payment) or **"Comp for myself"** (audit-logged self-comp, rate-limited per quarter; see 0034 § 10c). Legitimate use cases include grand-opening dogfooding, internal booking-flow QA, and gifting a service to a friend's event.

**Self-review is blocked at three layers:**

1. **Schema** — the `no_self_review` CHECK constraint and the `block_related_account_review()` BEFORE INSERT trigger (declared above in the Reviews schema block) refuse any row where reviewer + vendor owner share `owner_user_id` (CHECK), team membership (`vendor_service_agents.member_id`), payment method (matching `service_order_payments.payer_account_number`), device fingerprint (`user_devices.device_hash`), or household address (`users.address_normalized`).
2. **API** — `POST /api/v1/reviews` catches the trigger exception and returns `403 SELF_REVIEW_BLOCKED` with the matched-signal name (`owner_self` / `team_member` / `payment_match` / `device_match` / `household_match`) and `next_action: "contest_via_help"`.
3. **UI** — the "Leave a review" CTA renders disabled on the booked-vendor card with the hint *"You can't review your own services"* when the event flips to Wrap stage (0021 § 2.2d). Tap-on-disabled opens the appeal flow.

**Appeal path.** Filipino households legitimately share GCash numbers, devices, and addresses, so the hard gate WILL produce false positives. The appeal routes to the 0023 Help inbox; admin investigates, and if the related-account match is coincidental (couple sharing a GCash with an unrelated vendor's owner is the canonical false-positive), the admin can **override-publish** the review with reason logged in `admin_audit_log`. Single-admin authority (falls below the two-admin threshold per § 9.1).

**Admin parity.** Admins are already customers carrying `is_internal=TRUE` (§ 10a). The self-review gate applies symmetrically — an admin who books a vendor on the customer side cannot review that vendor if the admin sits on the vendor's team.

---

## Public marketplace stats — completed-events count (locked 2026-05-15)

The marketplace vendor card and the public `/v/[slug]` landing page display a "completed events" credibility number. Per the dual-role public-stats rule (CLAUDE.md decision log 2026-05-15, second row), this number EXCLUDES bookings made by the vendor's own people. Encoded as a materialized view, the public sibling of `vendor_review_stats`:

```sql
-- ============================================================
-- vendor_public_completed_events_stats — the count shown on
-- the marketplace card and the public /v/[slug] landing.
-- ============================================================
CREATE MATERIALIZED VIEW vendor_public_completed_events_stats AS
SELECT
  evr.vendor_id,
  COUNT(*) AS public_completed_count
FROM event_vendor_relationships evr
JOIN events e ON e.event_id = evr.event_id
LEFT JOIN service_orders so ON so.event_id = evr.event_id
                            AND so.vendor_id = evr.vendor_id
LEFT JOIN comp_grants cg   ON cg.grant_id = so.comp_grant_id
WHERE evr.stage = 'completed'
  AND e.archived = FALSE
  -- Exclude any booking where the buying couple includes the vendor's owner...
  AND NOT EXISTS (
    SELECT 1
    FROM vendors v
    JOIN event_members em ON em.user_id = v.owner_user_id
    WHERE v.vendor_id = evr.vendor_id
      AND em.event_id = evr.event_id
      AND em.member_type = 'couple'
  )
  -- ...or a vendor team member...
  AND NOT EXISTS (
    SELECT 1
    FROM vendor_service_agents vsa
    JOIN event_members em ON em.user_id = vsa.member_id
    WHERE vsa.vendor_id = evr.vendor_id
      AND em.event_id = evr.event_id
      AND em.member_type = 'couple'
  )
  -- ...or an internal account that owns or sits on this vendor's team.
  AND NOT EXISTS (
    SELECT 1
    FROM users u
    JOIN event_members em ON em.user_id = u.user_id
    WHERE u.is_internal = TRUE
      AND em.event_id = evr.event_id
      AND em.member_type = 'couple'
      AND (
        EXISTS (SELECT 1 FROM vendors v WHERE v.vendor_id = evr.vendor_id AND v.owner_user_id = u.user_id)
        OR EXISTS (SELECT 1 FROM vendor_service_agents vsa WHERE vsa.vendor_id = evr.vendor_id AND vsa.member_id = u.user_id)
      )
  )
  -- Vendor self-comp orders never count regardless of buyer identity.
  AND (cg.source IS NULL OR cg.source <> 'vendor_self_comp')
GROUP BY evr.vendor_id;

CREATE UNIQUE INDEX vendor_public_completed_events_pk
  ON vendor_public_completed_events_stats(vendor_id);

-- Refresh on relationship stage change or comp-grant insert
-- (trigger or hourly cron, whichever is cheaper).

-- ============================================================
-- vendor_full_completed_events_stats — the unfiltered count
-- the vendor's own backend card reads when their toggle is ON.
-- ============================================================
CREATE OR REPLACE VIEW vendor_full_completed_events_stats AS
SELECT
  evr.vendor_id,
  COUNT(*) AS full_completed_count
FROM event_vendor_relationships evr
JOIN events e ON e.event_id = evr.event_id
WHERE evr.stage = 'completed' AND e.archived = FALSE
GROUP BY evr.vendor_id;

-- ============================================================
-- vendors.show_team_bookings_in_backend_count
-- ============================================================
-- Per-vendor toggle. Default FALSE = vendor's backend card reads from
-- vendor_public_completed_events_stats (same number the public sees).
-- TRUE = backend card reads from vendor_full_completed_events_stats and
-- renders the delta inline. Public count is unaffected either way.
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS
  show_team_bookings_in_backend_count BOOLEAN NOT NULL DEFAULT FALSE;
```

**Surface consumers:**

| Surface | View read | Notes |
|---|---|---|
| Marketplace browse vendor card | `vendor_public_completed_events_stats` | The credibility number next to the avg-rating star |
| Public `/v/[slug]` landing | `vendor_public_completed_events_stats` | Inside the credibility band |
| Vendor's own dashboard "Completed events" card | `vendor_public_completed_events_stats` (default) OR `vendor_full_completed_events_stats` (when toggle ON) | See iteration 0022 § 2.4a for the toggle UX |
| Admin console vendor detail (0023 § 3.4) | Both side-by-side | Admin sees public and full counts together for moderation visibility |

**Personal/customer side unaffected.** A team member viewing their own customer-side dashboard sees the full history of THEIR events as a customer. The exclusion above is strictly about the vendor's marketplace credibility number, not the user's personal record.

---

## Connection to other iterations (forward-sequenced)

This iteration depends only on iterations **< 0006**:

- **0001 Guest List** — provides `event_id`, basic event scaffolding, dashboard shell, file upload primitives.
- **0002 QR Invitation** — independent; no shared state.
- **0003 Token Wallet** — explicitly **NOT used here.** Vendor payments are external; the wallet is reserved for Setnayan-charged services. This is a deliberate separation; see decision log.
- **0004 Invitation Widgets / 0005 LED Background Maker** — independent.

This iteration **provides** to downstream iterations (0007+):

- **0007 Budget & Expenses** consumes `event_vendor_relationships`, `vendor_payment_milestones`, and `vendor_crew_meal_totals` to populate budget rows automatically. Any vendor relationship in 'booked' status appears as an expense category; payments roll up into the cash-flow view. The `.ics` calendar export in 0007 also pulls `vendor_meetings` rows, so couples get one combined feed of payment deadlines + meetings.
- **0010 Mood Board** can link styling-related vendors (florist, lights & sound, stylist if added) to mood board segments (florals, stage, etc.).
- **Future Din (Phase 3 supplier app)** inherits the vendor records *and* the `vendor_meetings` table — vendors take over meeting creation/proposals via the same schema with `created_by_actor='vendor'`. No migration required.

---

## Privacy & compliance

- Contract files are couple-scoped. Only logged-in members of the couple's event can fetch signed download URLs. Setnayan Staff have read access for support; access is logged.
- Vendor PII (phone, email, website) is treated as sensitive and never surfaced to other guests, never indexed, never embedded in QR payloads, never sent to analytics.
- 5-year retention on contracts (R2 lifecycle rule). After 5 years, files are auto-purged; metadata rows are kept with `r2_object_key = NULL`.
- PH Data Privacy Act (RA 10173): couple consents to storing vendor contact data on their behalf. Vendors are external businesses; their contact info is publicly shared by them and not protected as personal data, but we treat it carefully anyway.

---

## Vendor Verification flow (locked 2026-05-16)

The verification flow gates which vendors can offer Setnayan Pay to couples, which can subscribe to Pro Weekly, and which can run paid marketing (Boosted Ads / Sponsored Boost). It is the trust spine of the marketplace.

### Pricing

| Stage | Price | Paid by | Notes |
|---|---|---|---|
| Initial Verification | **FREE** | Setnayan absorbs ~₱535/vendor | Treated as customer acquisition cost — keeps onboarding funnel frictionless |
| Annual Re-verification | **₱1,499/year** | Vendor | Light-touch yearly refresh — re-checks docs are current (charm-corrected 2026-05-17) |
| Re-verification after demotion | **₱2,499** | Vendor | Higher gate to discourage demotion churn (vendor is paying to climb back up from coming_soon state · charm-corrected 2026-05-17) |

### Required documents (all 12 — no exceptions)

1. **DTI Business Name Certificate** — auto-validated via DTI Database lookup
2. **BIR Form 2303** (Certificate of Registration)
3. **Mayor's Permit** (current year)
4. **Valid government ID (owner)** — verified via Persona / Veriff / Onfido (~₱200 per check)
5. **Bank account proof** — Maya / GCash micro-deposit verification
6. **5-10 portfolio samples** — reverse image search check
7. **3-5 past client references** — Setnayan calls 1-2 randomly
8. **Live selfie + ID liveness check**
9. **15-min Google Meet with admin** (scheduled in verification queue)
10. **Phone SMS OTP + email confirmation**
11. **Social media presence** — Instagram or Facebook business page link
12. **Sanctions / PEP screening** — AMLC watchlist API

### Category-specific extras

- **Wedding venues:** insurance documents ≥ ₱1M liability
- **Catering > 100 guests:** Health Department certification
- **Wedding coordinators:** industry certification OR 5+ years experience proof
- **High-value vendors (₱500K+ avg booking):** background check on owner

### Process

- **Vendor effort:** 30-45 minutes (document upload + Google Meet)
- **Setnayan SLA:** 3-5 business days
- **All-or-nothing:** no partial verified state — a vendor is either `verified` or `coming_soon`
- **Document storage:** R2 bucket `setnayan-vendor-verification` (90-day rolling for raw uploads · 7-year retention for verification audit trail per BIR § 235)
- **Admin queue:** Setnayan admin reviews each application in 0023 Admin Console → Verification Queue surface

### Tier perks/limitations (locked)

**Verified vendor perks:**

- Verified badge in marketplace
- **Setnayan Pay unlocks for couples** (couples can ONLY use Setnayan Pay with verified vendors)
- Custom partial payment plan configuration
- Pro Weekly subscription access (₱499/wk)
- Sponsored Boost eligibility (Quarterly ₱249,999 / Annual ₱799,999)
- Boosted Ads eligibility (5km ₱4,999 / 10km ₱7,999 / 20km ₱14,999 per week)
- All Tools Unlock bundle access (₱9,999/year)
- Immediate full payout (no 3-stage hold)
- Higher marketplace search ranking
- Featured Vendor program eligibility
- Coordinator-join permission in couple threads

**Coming_soon vendor limitations:**

- Setnayan Pay LOCKED (couples pay direct off-platform — vendor's own BDO / GCash)
- Fixed Setnayan-managed 3-stage payout (see § Payout below)
- "Coming Soon" badge in marketplace
- No Pro Weekly subscription
- No Boosted Ads or Sponsored Boost
- Lower marketplace search ranking
- No tool access (All Tools Unlock locked at coming_soon — wait, exception: All Tools Unlock is open to ALL paying vendors including coming_soon per 2026-05-16 lock; the other marketing/payment perks remain locked)

### Schema

```sql
ALTER TABLE vendors ADD COLUMN verification_state TEXT
  CHECK (verification_state IN ('coming_soon','verified','demoted','revoked'))
  DEFAULT 'coming_soon';

ALTER TABLE vendors ADD COLUMN last_verified_at TIMESTAMPTZ;
ALTER TABLE vendors ADD COLUMN next_renewal_due_at TIMESTAMPTZ;
ALTER TABLE vendors ADD COLUMN demotion_count INT DEFAULT 0;
ALTER TABLE vendors ADD COLUMN last_demoted_at TIMESTAMPTZ;

CREATE TABLE vendor_verification_applications (
  application_id UUID PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(vendor_id),
  application_type TEXT CHECK (application_type IN ('initial','annual_renewal','post_demotion')),
  fee_php_centavos INT NOT NULL,    -- 0 / 150000 / 250000
  submitted_at TIMESTAMPTZ NOT NULL,
  doc_uploads JSONB,                 -- 12-doc checklist + R2 keys
  persona_check_result JSONB,
  amlc_screening_result JSONB,
  google_meet_scheduled_at TIMESTAMPTZ,
  reviewer_admin_id UUID,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  notes TEXT
);
```

---

## Vendor Payout model (locked 2026-05-16)

### Verified vendors — immediate full payout

- Released **T+1** to vendor's chosen disbursement method (Maya / GCash / bank transfer)
- Net amount = vendor list price − gateway/terminal fee − BIR Marketplace Withholding 0.5%
- Setnayan absorbs the ₱15-25 outbound disbursement fee (vendor sees nominal net, no additional deduction)
- BIR Form 2307 issued quarterly to vendor (creditable against vendor's own income tax)

### Coming_soon vendors — 3-stage milestone release

| Stage | Release % | Trigger | Dispute window |
|---|---|---|---|
| 1 — Reservation deposit | 20% | Booking confirmation | none |
| 2 — Pre-event check | 60% | T-14 days · couple confirms vendor's prep on track | 7-day couple response · auto-release on silence |
| 3 — Post-event balance | 20% | T+7 days · couple confirms delivery, no dispute | 7-day couple response · auto-release on silence |

### Demote-to-coming_soon trigger

A verified vendor is auto-demoted if they accumulate **3+ disputes within 30 days**. Demotion:

1. Sets `verification_state = 'demoted'` + `last_demoted_at = NOW()` + `demotion_count = demotion_count + 1`
2. Locks Setnayan Pay (couples pay direct off-platform)
3. Switches payout model to the 3-stage milestone release for in-flight bookings
4. Removes Boosted Ads / Sponsored Boost eligibility
5. Email + in-app notification to vendor with re-verification fee (₱2,500) and link to apply

### Disbursement rail tiers (V1.5+ Maya Bulk Fund Transfer, locked 2026-05-17)

Once Maya Business goes live as the V1.5+ primary gateway, all vendor payouts batch through **Maya Business Bulk Fund Transfer** (one CSV upload per day). Three rails are available; the rail chosen determines settlement time + Setnayan's absorbed disbursement cost. Full routing logic + schema lives in **0034 § 6.7 Outbound — Setnayan pays vendor** and **§ 6.9 `disbursement_batches` table**.

| Rail | Vendor sees money | Setnayan absorbs | Used for |
|---|---|---|---|
| **Intra-Maya** (vendor has Maya Bank account) | **Instant · 24/7 · free** | **₱0** | All payout types when vendor's disbursement bank is Maya Bank |
| **InstaPay** (Maya → any PH bank) | < 1 minute · 24/7 incl. weekends | ~₱10 per payout (bulk rate) | Verified vendor immediate payout to non-Maya destinations |
| **PESONet** (Maya → any PH bank) | EOD same banking day · T+1 weekends/holidays | ~₱15 per payout (bulk rate) | Coming_soon vendor 3-stage milestone releases · payouts < ₱500 or > ₱500K |

**Maya Bank vendor-recruiting copy** (verification flow + onboarding surfaces):

> **Get paid instantly, free, 24/7 — open a Maya Bank business account.**
> Or get paid in under a minute to any PH bank, including weekends (InstaPay).
> Standard payout settles end of business day (PESONet) — default for milestone releases.

The verification approval email + the 0022 Vendor Dashboard onboarding tour both surface the Maya Bank option as the **strongest single payout-experience win** vendors can take — instant + free is a real upgrade vs the EOD/PESONet default. Setnayan benefits too: every Maya Bank vendor onboarded is a zero-fee payout for life.

**Vendor override** (in 0022 Vendor Dashboard payout preferences):

- Verified vendors may downgrade their default to PESONet — earns a ₱5/payout rebate credit (Setnayan saves ~₱5/payout in exchange)
- Coming_soon vendors may upgrade individual milestone payouts to InstaPay — vendor absorbs the ₱5 difference deducted from that milestone

---

## What's NOT in V1 (don't backdoor in)

- Vendor self-input app or login (Phase 3 — Din).
- Automated reminder emails / push to the couple about upcoming deadlines (V1.1).
- Vendor-side proof of payment (V1.1+).
- Vendor reviews / star ratings (Phase 4).
- Importing vendors from a Setnayan-curated marketplace (Phase 4).
- E-signatures on contracts in Setnayan (V2+).
- Currency other than PHP (V2+).
- Multi-event vendor copy ("use my photographer from cousin's wedding") — copy-vendor flow lives in V1.1.

---

## Convenience-fee absorption opt-in (locked 2026-05-16 PM)

Vendors may opt in to **absorb the 5.0% Setnayan Pay convenience fee** out of their own listed price rather than have it added on top of the customer's bill at checkout. Vendors who opt in earn a public-facing **"No Convenience Fee" badge** on their marketplace profile, search results, and detail page. Setnayan's revenue from each booking is unchanged either way — only the visibility of the fee at the cart shifts. The full cart math, customer-side cart treatment, and the worked payout example live in **0034 § 6.8 Vendor opt-in: cover the convenience fee for customers**.

### Schema

A single boolean on the canonical `vendors` table (defined formally alongside the marketplace vendor profile in 0022):

```sql
ALTER TABLE vendors ADD COLUMN absorbs_convenience_fee BOOLEAN NOT NULL DEFAULT FALSE;
```

The flag is read by the cart math in 0034 at the moment a `cart_items` row is created against a vendor booking, and snapshotted onto `service_orders.vendor_absorbed_fee` so a vendor flipping the toggle later doesn't retroactively change in-progress orders (consistent with the 2026-05-12 "price snapshot at add-to-cart time" decision in 0034).

### Vendor-side surface (per 0022 dashboard settings)

A toggle in the Settings panel of the 0022 Vendor Dashboard:

> **Cover the Setnayan Pay convenience fee for customers**
> Show your customers the price they pay — no extra 5% line at checkout. Earn the **"No Convenience Fee"** badge on your profile.
>
> [ Toggle: OFF / ON ]
>
> **Your net on a sample ₱100,000 booking:**
> - **If you cover the fee (badge ON):** Maya QR Ph → ₱93,100 · Cards (max 2.5%) → ₱92,150
> - **If customer pays (default):** Maya QR Ph → ₱98,000 · Cards (max 2.5%) → ₱97,000

Toggle changes are single-admin authority for the vendor (their own account), logged in `vendor_audit_log`, and apply only to NEW cart_items snapshotted after the change.

### Customer-side surface

- **Marketplace listing / search results:** vendors with `absorbs_convenience_fee = TRUE` render a **"No Convenience Fee"** chip next to their name. A search filter chip "No convenience fee" lets couples narrow to vendors who absorb.
- **Vendor profile page:** badge appears in the trust-signals strip alongside the verification badge. Tap reveals: "This vendor covers the platform convenience fee. The price you see is the price you pay."
- **Cart drawer (per 0034 § 3.2):** when a vendor booking with `vendor_absorbed_fee = TRUE` is in the cart, the convenience-fee row renders as `"Convenience fee  ✓ covered by vendor  ₱0.00"` in muted text. Customer still sees a clear line item but understands the math.

### Marketing positioning (per 0015 main website § 8.5)

A second worked example block sits next to the default 5.0% example showing "Some vendors cover the convenience fee — look for the badge. With these vendors, the listed price is the all-in price." Engineering hooks into `apps/web/app/(marketing)/page.tsx` and the eventual `/pricing` page.

## Public vendor profile (SEO-indexable · `/v/[slug]`) — added 2026-06-04

**Locked (Cowork 2026-06-04 · resolves SEO-pending item #2):** every published vendor gets a **public, indexable profile** at `/v/[slug]`. Without a committed public-field set, no vendor page can rank (Playbook §1, §4.4, §5.1).

- **Public fields:** `slug` · public bio (300+ words narrative) · services + packages · portfolio photos · city / coverage area · **verified-status** badge · reviews + `AggregateRating` (real reviews only — faking triggers a manual action). These render without login.
- **Schema:** `LocalBusiness` (subtype `WeddingService`, `addressCountry: "PH"`, `addressRegion`, `addressLocality`, lat/long when available) + `AggregateRating`/`Review` + `BreadcrumbList` (Playbook §4.4).
- **Title / meta:** `{Vendor} — Wedding {Category} in {City} | Setnayan` (Playbook §5.2, template #8).
- **Indexable** in `sitemap.xml`; canonical self-reference. **Hybrid-anonymity interplay:** Free + Verified vendors stay name-masked in browse/cards until first chat reply, but the **public `/v/[slug]` profile is the SEO surface** — slug + bio are indexable per the vendor's visibility tier (reconcile with the vendor hybrid-anonymity lock; Pro+ always visible).
- **Vendor controls these fields from the 0022 dashboard** (see 0022 § Public profile).
- Full SEO substance lives in **Playbook §4.4 / §5.1–5.3** — not duplicated here.

## Acceptance criteria

- Couple can add a vendor with manually entered business name, contact, phone, email, website, notes, day-of arrival.
- Hybrid service assignment works: multi-select from 28 canonical services + add custom service inline.
- Couple can mark a canonical service as "not needed"; it disappears from gap count.
- Vendor package: package name + total amount in PHP; inclusions list with add/remove/reorder.
- Payment milestones: any number per vendor, with label / due date / amount / paid status / payment method / reference. Presets scaffold common schedules.
- Balance, payment progress %, next-unpaid-milestone, and overdue flag are all computed and displayed correctly.
- Crew block: count + per-meal cost + "vendor provides meals" toggle. Crew meal total is computed and rolled up.
- Contract upload: PDF / JPG / PNG up to 25 MB per file, stored in R2; download via signed URL works.
- Service coverage view shows status of every canonical service (Booked / Gap / Not needed) with vendor name when booked.
- Aggregate stats strip (total contracted, total paid, outstanding, next deadline, crew meal estimate, coverage %) reflects current data.
- All currency rendered PHP-primary (`₱1,500.00` format). No token rendering anywhere in this iteration.
- Mobile view: thumb-friendly, single-column, ≥44pt tap targets, FAB for add-vendor.
- Empty states: list view with no vendors shows "Add your first vendor" with quick-start cards for top 5 canonical services.
- Vendor `status` workflow: lead → booked → completed → cancelled (any direction; couple-controlled).
- Meetings: couple can add any number of meetings per vendor with title, datetime, mode (in-person/video/phone), location/link, agenda, attendees, notes.
- "Next meeting" surfaces the soonest upcoming meeting on each vendor card; past-but-still-scheduled meetings render amber and prompt confirmation.
- Meeting `status` workflow: scheduled → completed (with notes) | cancelled | rescheduled.
- Meeting writes in V1 are always `created_by_actor='couple'`; schema accepts `'vendor'` and `'setnayan_staff'` for forward compatibility with Din.
- "Invite to Setnayan" action is visible on every off-platform vendor row (`marketplace_vendor_id IS NULL`) and hidden once the row is linked. Sending an invite creates a `vendor_invites` row, fires a transactional email, and flips the row's status pill to `Invite sent · {N days left}`.
- Already-on-Setnayan detection: submitting the invite modal with an email that matches an existing vendor owner offers **Connect** instead of **Send invite**. Connect links the existing `vendor_id` directly into `marketplace_vendor_id` without creating a `vendor_invites` row.
- On vendor claim, `event_vendor_relationships.marketplace_vendor_id` is populated and the couple's 0019 chat surface unlocks automatically — verified by a single one-time toast on the couple's session.
- The relationship row's status pill cycles correctly through `Invite sent → Joined Setnayan` (claim or Connect path), `Declined the invite`, `Invite expired`, and `Invite revoked` based on the latest `vendor_invites` row plus the linked `marketplace_vendor_id`.
- Couple may have unlimited pending invites per event and re-invite the same email immediately after decline / expire / revoke (no UI cap, no cooldown).
- Claim landing page shows identity-only snapshot — `package_*`, `vendor_inclusions`, `vendor_payment_milestones`, and `vendor_meetings` are not surfaced pre-claim.

---

## Decision log (this iteration)

| Date | Decision | Why |
|---|---|---|
| 2026-05-09 | **Hybrid service taxonomy** — 28 canonical services + per-event custom rows | Canonical list gives clean coverage reporting and consistent rollup into Budget (0007); custom rows handle the long tail of niche services without forcing couples through a "request canonical addition" dance. |
| 2026-05-09 | **Flexible custom payment milestones** (any number per vendor) over fixed 3-stage | PH wedding vendors structure schedules differently — some take reservation + down + balance, others want monthly partials. Fixed 3-stage forces couples to lie about reality. Presets in the UI scaffold the common cases without locking the schema. |
| 2026-05-09 | **Crew meals: count × per-meal cost → computed total**, with `vendor_provides_meals` opt-out | Most vendors expect couple to feed crew. Couple needs the rolled-up number for catering headcount and the budget. The opt-out matters because some larger vendors (full-service caterers, big production crews) bring their own. |
| 2026-05-09 | **No token wallet integration — vendor payments are external, tracking-only** | Vendors are external businesses paid by cash / GCash / bank transfer outside Setnayan. The wallet (0003) is reserved for Setnayan-charged services. Mixing the two would blur the source-of-truth boundary; couples already understand the mental model of "what I paid the vendor" vs "what I paid Setnayan." Combined views can be assembled at the Budget (0007) layer if useful, without coupling the wallet to vendor records. |
| 2026-05-09 | **Manual encoding only in V1** — no vendor self-input | Din (vendor-facing app) is Phase 3. Building a half-baked vendor login surface in V1 would block the V1 launch and create a migration we'd then have to throw away. Manual encoding is sufficient for the planning workflow. |
| 2026-05-09 | **Contracts in R2 with 5-year retention** | Mirrors photographer industry norm and Setnayan's existing photo retention policy. Aligns the storage lifecycle across the platform. |
| 2026-05-09 | **PHP-primary, no token display anywhere** in this iteration | Vendor money never touches Setnayan's books, so no reason to render in tokens. Tokens are for Setnayan SKUs only. |
| 2026-05-09 | **Meetings live in vendor profiles in V1; vendor-managed in Din.** Couple records meetings (title, datetime, mode, location/link, agenda, attendees, notes) on each vendor's detail page. The soonest upcoming meeting per vendor is surfaced as "Next meeting" on the card. The `vendor_meetings` table includes a `created_by_actor` column (`'couple'` in V1) so Din can later write `'vendor'` rows into the same table without migration. | Couples already track meetings in scattered notes, message threads, or memory. Centralizing them on the vendor profile mirrors how planners actually work, and the schema's forward-compatibility column means Phase 3 (Din) can take over without reshaping data. No `.ics` export here — that lives in 0007 Budget, which already owns the calendar pattern; once 0007 ships, meetings join payment deadlines in one feed. |
| 2026-05-16 | **Vendor Verification flow locked — FREE initial / ₱1,499 annual renewal / ₱2,499 re-verification after demotion (charm-corrected 2026-05-17 from ₱1,500 / ₱2,500) · 12-document checklist · all-or-nothing (no partial verified state) · 3-5 business day SLA · documents in `setnayan-vendor-verification` R2 bucket.** Verified tier unlocks Setnayan Pay for couples, Pro Weekly access, Boosted Ads, Sponsored Boost, All Tools Unlock, immediate payout, and Featured Vendor eligibility. Coming_soon tier is restricted to marketplace profile + listing only with Setnayan-managed 3-stage payout (20%/60%/20%). | The FREE initial onboarding lowers vendor activation friction while the 12-doc bar filters out non-serious applicants at zero cost to Setnayan's revenue model. The renewal fee (₱1,499/yr) covers Setnayan's ongoing trust-maintenance cost; the post-demotion fee (₱2,499) discourages demotion churn. The Setnayan Pay gate is the spine of the marketplace's trust signal — only verified vendors get the in-app convenience-fee rail (flat 5.0% on top of vendor price per 0034, locked 2026-05-16 evening · supersedes the morning's 5.5%/6.5% dual-rate). Coming_soon vendors get a path to inclusion (marketplace listing + 3-stage payout) without compromising couple safety. |
| 2026-05-16 | **Vendor Payout model locked — verified = immediate full payout T+1; coming_soon = 3-stage milestone release 20/60/20 with T-14 + T+7 dispute windows.** Demote-to-coming_soon trigger: 3+ disputes within 30 days. Setnayan absorbs the ₱15-25 outbound disbursement fee per payout. BIR Form 2307 issued quarterly to all vendors. | Coming_soon 3-stage release puts a real-money escrow safety net behind unverified vendors — couples don't lose deposits to no-show low-trust providers. Verified vendors are trusted to deliver, so payout is immediate (T+1) less only gateway fee + BIR withholding — no Setnayan deduction. The auto-release-on-silence pattern (T+14 + T+7 7-day windows) keeps the workflow lightweight: couples confirm or stay silent; silence = approval. |
| 2026-05-12 | **Renamed the per-event `vendors` table to `event_vendor_relationships`** (PK column renamed from `vendor_id` to `relationship_id`); added `marketplace_vendor_id UUID REFERENCES vendors(vendor_id)` FK to link the couple's per-event vendor record to the canonical marketplace `vendors` entity declared in 0022. All seven dependent tables in 0006 (`vendor_services`, `vendor_inclusions`, `vendor_payment_milestones`, `vendor_crew`, `vendor_crew_meal_totals` view, `vendor_meetings`, `vendor_contracts`) updated to FK `relationship_id`. | The previous setup had two tables named `vendors` (one in 0006 for the couple's per-event vendor list, one in 0022 for the canonical marketplace vendor entities) which would have caused namespace collision at the Postgres level. Rename clarifies the data model: `event_vendor_relationships` is the join row that says "this couple's event is working with this vendor" and carries the negotiated package details; `vendors` (in 0022) is the canonical marketplace vendor profile shared across all couples who book them. Nullable FK supports the off-platform vendor case (couple enters a custom vendor that isn't on Setnayan's marketplace). |
| 2026-05-17 | **Vendor disbursement rail tiers locked (V1.5+ Maya Bulk Fund Transfer) — Intra-Maya (instant + free) / InstaPay (< 1 min + ₱10 Setnayan-absorbed) / PESONet (EOD same-day + ₱15 Setnayan-absorbed) · default per payout type per 0034 § 6.7 · vendor override available in 0022 with rebate/upgrade pricing · Maya Bank vendor-recruiting copy surfaces on verification approval email + onboarding tour.** Schema (0034 § 6.9): `vendor_payouts.rail` enum (intra_maya/instapay/pesonet), `rail_chosen_by` enum (default/vendor_preference/admin_override), `batch_id` FK to new `disbursement_batches` table. Failure handling: rejected rows revert to `pending` and rejoin next-day batch; 3 consecutive batch failures for same vendor trigger admin alert + manual-reconciliation fallback. | Three drivers. **First, batched disbursement at scale collapses per-payout admin time from ~5 minutes (click-through) to ~5 seconds (CSV row) — the real value isn't fee savings but operational efficiency.** Annual disbursement-cost absorption stays under 0.3% of platform revenue even at 5,000-couple scale. **Second, the three-tier rail structure maps directly to vendor segments:** verified vendors who want instant gratification get InstaPay free of charge (Setnayan absorbs); price-sensitive coming_soon vendors get reliable EOD via PESONet; Maya Bank vendors get the strictly-best outcome on both sides (instant + free). **Third, Maya Bank vendor-recruiting copy is the single highest-leverage vendor onboarding incentive Setnayan can offer** — every Maya Bank account opened means a vendor who gets instant + free payouts forever AND Setnayan saves the disbursement fee forever. Both sides win; the alignment is real, not promotional. **Vendor override pricing:** rebate-for-downgrade / pay-for-upgrade keeps Setnayan whole while letting individual vendors customize speed/cost trade-off. **Engineering pending:** Maya Business approval (2-4 week SLA per API Integration Checklist) gates the entire V1.5+ disbursement automation; `disbursement_batches` table + columns on `vendor_payouts` ship with the V1.5+ migration; admin console "Today's payouts" queue + Generate-batch-CSV button in 0023; vendor payout-preferences UI in 0022. |
| 2026-05-16 | **Vendor convenience-fee absorption opt-in locked — `vendors.absorbs_convenience_fee BOOLEAN DEFAULT FALSE` · "No Convenience Fee" badge on marketplace profile when TRUE · cart hides the fee row + customer sees vendor's listed price flat · Setnayan revenue unchanged at 5% gross regardless · snapshot at order-creation time onto `service_orders.vendor_absorbed_fee`.** Full cart math + payout example + customer-side cart treatment lives in `0034 § 6.8 Vendor opt-in: cover the convenience fee for customers`. Vendor settings UI in 0022 with financial preview. Marketing badge surface in 0015 § 8.5. | Two drivers. **First, Filipino couples strongly prefer "all-in" pricing — many wedding vendors already absorb platform fees informally to keep their headline price flush with the booking total customers expect.** Surfacing this as a first-class opt-in turns the informal practice into a structured platform feature with a visible badge, which (a) lets price-competitive vendors compete on transparency without negotiating with Setnayan, (b) gives Setnayan a search-filter chip that couples actually use ("No convenience fee" as a filter), and (c) preserves the canonical 5.0% flat rate on Setnayan's books regardless of vendor choice. **Second, Setnayan's economics are protected by design** — the 5% is always Setnayan's revenue regardless of who shows it on the receipt. Worked example at ₱100K booking: Option A (vendor covers) → vendor receives ₱93,100 (Maya QR Ph) / ₱92,150 (max 2.5% rail); Option B (default) → vendor receives ₱98,000 / ₱97,000. Vendor sacrifices ~5% of revenue for the badge → only opt in if conversion lift exceeds ~5%. The vendor toggle's financial-preview UI in 0022 makes the math obvious so vendors don't accidentally opt in without understanding the cost. **Snapshot discipline:** flag flip applies only to NEW cart_items, consistent with the 2026-05-12 price-snapshot decision in 0034 — vendors flipping mid-cart can't retroactively change pricing for couples already deep in checkout. |
| 2026-05-22 | **Specialized Pro Tools architecture — vendor-side cross-reference to the 3-layer model locked in CLAUDE.md decision log (fifth 2026-05-22 row).** This iteration's `vendors` marketplace records gain a new dimension: per-service Specialized Pro Tools subscription state. Stylists (`stylist_decorator` per [0044 § stylist_decorator](../0044_per_category_schemas/0044_per_category_schemas.md)) can hold Professional Mood Board render-pack credits per [0010 § Professional Mood Board](../0010_mood_board/0010_mood_board.md#professional-mood-board-v11--composite-scene-generator); the stylist marketplace surface in [0047 § Stylist marketplace](../0047_style_driven_marketplaces/0047_style_driven_marketplaces.md) renders a "Professional Mood Board enabled" badge when this is true. Other Specialized Pro Tools (Professional Coordination · Professional Photo Tools · Professional Video Tools · Professional Catering · Professional Florist · Professional HMUA · Professional Music · Professional Live Band · Professional Stationery · Professional Attire · Professional Cake/Desserts · Professional Sound/Lighting · Professional Rings-Officiant-Transport-Booth) ship per their V1.x rollout sequence with similar per-service subscription state. The four Stylist treatment specializations (`ceiling` · `wall` · `surroundings` · `tunnel`) from [0044 § stylist_decorator](../0044_per_category_schemas/0044_per_category_schemas.md) serve as both vendor marketplace facets AND moodboard Composite Scene layer categories. | The 3-layer vendor model (Universal Vendor Tier + Specialized Pro Tools + per-use packs) keeps this iteration's existing Free / Pro / Max universal tier framework untouched while layering per-service AI capabilities on top. Each Specialized Pro Tool prices independently: Professional Mood Board uses pay-per-render packs (₱199 single · ₱8,999 / 50-pack · ₱24,999 / 150-pack · NO subscription); other 13 SKUs use ₱888/wk placeholder pricing pending finalization per owner directive. Vendor management UI surfaces for subscription state + render-pack purchase flow live in [0022 § Specialized Pro Tools subscription management](../0022_vendor_dashboard/0022_vendor_dashboard.md). |
| 2026-05-19 | **Couple-initiated invite for off-platform vendors locked — new `vendor_invites` table + "Invite to Setnayan" action on every off-platform vendor row (`marketplace_vendor_id IS NULL`).** Locked sub-rules: **(a) email-only delivery** (no SMS in V1; couple can copy the claim link to send via their own Viber/Messenger if desired); **(b) identity-only claim page** — vendor sees business name / contact / service category / event date / couple display name, but NOT `package_*`, `vendor_inclusions`, `vendor_payment_milestones`, or `vendor_meetings` until after signup; **(c) no cooldown after decline** — couple may immediately re-invite the same email; **(d) no cap on pending invites per event**; **(e) 90-day TTL** with lazy expiration sweep at claim-page-render time (no cron, per [[reference_setnayan_cron_strategy]]); **(f) auto-link on claim** — the new marketplace `vendor_id` writes back to `event_vendor_relationships.marketplace_vendor_id`, which unlocks 0019 chat for that couple; **(g) Already-on-Setnayan short-circuit** — if the invited email matches an existing vendor owner, the modal swaps to a Connect flow that links the existing `vendor_id` directly without creating a `vendor_invites` row. Full UX in `## Invite-to-Setnayan flow — UX rules`; schema in `### vendor_invites table`; vendor-side claim landing in `0022 § Couple-invite claim landing`. | Off-platform vendor encoding was already supported (nullable `marketplace_vendor_id` per 2026-05-12 row in this log); this closes the growth loop by turning every couple-encoded off-platform vendor into a free, warm vendor-acquisition signal. **Email-only** avoids SMS-gateway infra and sender-ID provider cost in V1; couples retain full agency to text the link themselves. **Identity-only claim page** avoids leaking the couple's private negotiation data (what they're paying, what's included) to a vendor who has not agreed to join yet — preserves trust on both sides; vendor sees the full state the moment they finish signup. **No cooldown / no cap** honors couple autonomy; deliverability hygiene is handled at the transactional-email provider layer (rate limits, de-dupe, bounce handling) so the UX stays permissive without turning Setnayan's sending domain into a spam source. **90-day TTL** avoids indefinite open tokens lingering in the database. **Auto-link on claim** is the entire point — collapses "off-platform → on-platform" upgrade into a single signup without manual reconnection. **Connect short-circuit** prevents duplicate-vendor pollution when the invited vendor already runs a Setnayan account under a different (older) couple's referral. |

---

## Companion documents

- `0001_creating_guest_list/` — dashboard shell, event scaffolding, file upload primitive
- `0003_token_wallet_and_packs/` — explains why this iteration deliberately does not use the wallet
- `0007_budget_expenses/` (downstream) — consumes this iteration's vendor + milestone data
- `13_Engineering_Brief.docx` — overall Setnayan engineering brief

---

## Offline behavior

Pre-event use only — vendor management is desktop/mobile-web planning UI, not event-day. Standard offline rules apply: form drafts persist in IndexedDB; reads cache for view-time offline access; writes queue and replay when connection returns. Contract uploads require online.
