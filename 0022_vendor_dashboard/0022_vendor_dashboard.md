# 0022 — Vendor Dashboard, Comprehensive Interactive Prototype

> **Purpose.** Show how a vendor uses Setnayan end-to-end — from enrollment through running a roster of paid clients. The mirror of 0021 (the couple-side dashboard) for the supplier side of the marketplace. Aligns with the locked decisions on apply-then-pay, Pro weekly subscription, multi-service calendars, and in-app crew rates.
>
> **Status:** drafted 2026-05-11
> **Companions:** `0022_vendor_dashboard.html` (interactive walkthrough) · `0022_vendor_dashboard.docx` (stakeholder mirror)
> **Vendor in scenario:** Mariposa Bloom Photography · Tagaytay · 6 yrs operating · 3 services authored · 12 clients in pipeline · Pro weekly subscription active

---

## 1. The 6 vendor surfaces

The vendor logs in at `setnayan.com` → role-router sends them to `/dashboard/vendor/...`.

| # | Surface | URL section | What it shows |
|---|---|---|---|
| 1 | **Home** | `/` (vendor root) | This-week snapshot, Pro status, today's schedule, action-needed cards, recent activity, revenue summary |
| 2 | **My Services** | `/services` | Service catalog (vendor's own offerings) with rich service-object cards. Click to author/edit. |
| 3 | **Calendar** | `/calendar` | Master calendar of all bookings · toggle to filter to one service · blocked dates · upcoming sidebar |
| 4 | **Clients** | `/clients` | Pipeline view (Inquiry → Proposal Sent → Accepted → Active → Completed) · click client → detail with plan builder, payments, chat shortcut, file shelf |
| 5 | **Threads** | `/threads` | All chat threads · file sharing (R2-backed per 0019) · ~~video meetings (Daily.co)~~ retired 2026-05-16 |
| 6 | **Team &amp; Setnayan** | `/team` | Team agents + permissions, Pro subscription mgmt, vendor's in-app Setnayan consumption (QR-as-a-service, crew-for-hire listing, etc.) |

Mobile uses a 5-tab bottom nav: **Home · Calendar · Clients · Threads · More**. The "More" tab houses Services, Team, Pro Sub, Settings.

---

## 2. Vendor data model (V1)

### 2.1 The Vendor record

```
vendors(
  vendor_id, owner_user_id, business_name, service_category_primary,
  service_category_secondary[], city, verified_at, is_active,
  logo_r2_key TEXT NOT NULL,                   -- MANDATORY at registration · see § 2.1b
  hero_image_r2_key, profile_description, years_operating,
  travel_area_primary, base_travel_fee_php,
  pro_subscription_status enum('inactive', 'active', 'paused'),
  pro_subscription_renews_at,
  show_team_labels_in_chat BOOLEAN DEFAULT FALSE,   -- 0019 vendor identity masking
  public_visibility ENUM('hidden','coming_soon','verified','archived') DEFAULT 'coming_soon',   -- locked 2026-05-15 · see § 2.1c
  created_at, last_active_at
)
```

### 2.1b Mandatory vendor logo (locked 2026-05-12)

Every vendor must upload a company logo as part of registration. The logo is a **hard-blocking requirement** at the verification stage — vendors cannot submit their registration application without one, and Setnayan Team verification cannot approve a vendor whose `logo_r2_key` is missing.

**File constraints:**
- **Format:** PNG with transparent background (JPG and SVG accepted as fallback, but PNG transparent is the canonical format)
- **Dimensions:** 512 × 512 minimum (square aspect ratio enforced; non-square uploads are auto-cropped center)
- **File size:** ≤ 2 MB
- **Storage:** R2 bucket `setnayan-media` under key `vendors/{vendor_id}/logo/{uuid}.png`
- **CDN serving:** all reads go through a Setnayan-signed URL (24-hour TTL) so the original cannot be hot-linked

**Where the logo is used:**

| Surface | Resolution served | Purpose |
|---|---|---|
| Chat thread bubbles (0019) | 64×64 | Customer-facing vendor avatar on every vendor-side message |
| Inbox thread-list item (0019) | 48×48 | Thread row avatar |
| Marketplace listing card (0015) | 96×96 | Square tile in vendor grid |
| Vendor landing page hero (0015 v/{slug}) | 256×256 with halo | Centerpiece of the page |
| Save-the-Date credit line (0024) | 32×32 | Vendor attribution on save-the-date renders |
| Admin verification queue | 96×96 | Setnayan Team review surface |
| Vendor dashboard chrome (this iteration) | 32×32 in the top-bar avatar slot | Vendor's own brand identity reminder |

**Registration flow (the gate):**

1. **Step 5 of vendor registration: "Upload your company logo"**
   - Drag-drop zone in the center of the form
   - Live preview at 64×64, 96×96, and 256×256 so the vendor sees how it'll render at every size
   - "Generate placeholder logo from your business name" fallback option for vendors who don't have a logo yet — auto-generates a monogram-style placeholder using the vendor's initials + theme palette. **The placeholder is acceptable for submission** but Setnayan Team flags it during verification with a polite nudge to upload a real logo within 30 days
2. **Validation runs client-side first:** format check, file-size check, aspect-ratio check. Failed validations show inline ("PNG transparent recommended" / "Image is 320×512, will be cropped to 320×320 — recommend uploading 512×512 or larger").
3. **Server-side validation runs on submit:** R2 upload, signed URL generation, EXIF strip (privacy — no GPS / device data leaks), background transparency confirmation (alpha channel present check).
4. **Cannot submit registration without a logo.** The submit button is disabled until `logo_r2_key` is populated. Submitting without one returns a form error: "Company logo is required. This is the icon customers will see when chatting with you and on your marketplace listing."

**Logo updates after registration:**

- Vendor can update their logo at any time via dashboard Settings → Brand. The new logo propagates to all surfaces within 5 minutes (CDN purge job).
- Setnayan Team retains the right to require a logo re-upload if the existing one violates community standards (NSFW · misleading branding · trademark infringement).

**Why mandatory:**

The vendor's logo is the customer's primary visual handle on the vendor across every Setnayan surface. Per § 3.10 of the Vendor Agreement and the 0019 chat identity masking rule, the customer never sees the individual sender's profile photo on vendor-side messages — they see the logo. A vendor without a logo would leave the customer staring at a default avatar placeholder on every chat bubble, which (a) breaks brand consistency, (b) downgrades the vendor's perceived professionalism, (c) is visually indistinguishable from a vendor who hasn't been verified yet. Making logo upload mandatory at registration removes that failure mode.

### 2.1a Vendor-proposed custom categories

Vendors aren't locked into the 28 canonical wedding service categories. If their offering doesn't fit (e.g., "Heirloom photo restoration," "Filipino-Catholic ceremony coordination," "Bespoke barong tailoring"), they propose a custom category from the service editor.

**Flow:**

1. **Publish today as private label.** New category is saved on the vendor's services immediately. It's visible to couples viewing that vendor's page but doesn't appear in the marketplace's category-filter dropdown yet.
2. **Admin review (3 business days).** Setnayan Team checks: is this duplicated? does the naming fit the taxonomy? is it scoped sensibly?
3. **Outcome A — promoted to global.** Category enters the canonical taxonomy. Other vendors can opt into it. The proposing vendor keeps the "first vendor" credit.
4. **Outcome B — kept private.** Category remains a private label scoped to the proposing vendor's record. They keep using it; it doesn't appear in marketplace filters.

**Schema:**

```
service_categories(
  category_id, name, parent_family,
  scope enum('canonical','private'),
  proposed_by_vendor_id?, proposed_at?,
  reviewed_at?, reviewed_by_admin_id?,
  description, created_at
)
```

Matches the existing admin curation workflow (CLAUDE.md 2026-05-XX: "stylist/vendor additions to globally-shared template libraries go to admin review queue. Admin approves for global use OR keeps isolated").

---

### 2.1c Vendor public-visibility state machine (locked 2026-05-15)

The `public_visibility` column on `vendors` controls how the marketplace surfaces the vendor profile. Four states:

| State | Set by | Public marketplace behavior |
|---|---|---|
| `coming_soon` | **Default at registration** | Profile is publicly listed with a muted **"Coming soon"** badge; no booking CTA; profile is read-only preview. Vendor can still edit their dashboard. |
| `verified` | Admin via Verification Queues (iteration 0023 § 3.2) after legitimacy review | Profile is fully bookable; all marketplace surfaces treat the vendor as live. |
| `hidden` | Admin (account suspension, voluntary withdrawal) | Profile not surfaced anywhere on the public site. Existing `event_vendor_relationships` preserved. |
| `archived` | Admin (account closure — terminal state) | Profile removed from all browse surfaces. Existing relationships preserve referential integrity. |

**Default `coming_soon` (was `hidden` until 2026-05-15)** — couples can see the platform's growing vendor pool even before verification completes; encourages vendors to complete verification quickly to flip to `verified` and become bookable. Per the 2026-05-15 decision-log entry on visibility correction + widget refactor.

**State transitions** are audit-logged in `admin_audit_log` with action `vendor_visibility_change`, before/after state in JSON, admin who made the change, optional reason.

**Marketplace browse impact:** iteration 0006 § "DIY-mode filter popup" — the **"Verified only"** toggle (OFF by default) controls whether `coming_soon` vendors appear alongside `verified` ones. Default OFF means couples see both states; toggle ON filters to verified-only for couples who only want bookable options.

**Counts impact:** iteration 0015 § Section 3 (count-gated real numbers) — the `verified_vendor_count` threshold metric counts ONLY `public_visibility='verified'` rows; `coming_soon` vendors do NOT contribute. Same for the `verified_vendor_count >= 500` gate on Section 1 (announcement bar auto-hide) and the boost-service launch gate from decision log 2026-05-14.

---

### 2.2 The Service object (the spec-expanded shape from 2.4d earlier)

```
vendor_services(
  service_id, vendor_id, title, service_category, event_types[],
  cover_image_r2_key, gallery_image_r2_keys[], gallery_video_r2_keys[],
  description_md,
  pricing_model enum('flat', 'per_pax_tiers', 'custom_quote'),
  flat_price_php?, per_pax_tiers_json?, min_pax?, max_pax?,
  inclusions_md, lead_time_days, travel_area, travel_fee_php?,
  is_published, created_at, updated_at
)
```

Multi-service vendors hold multiple rows. Each service has its own calendar (per Pro feature).

### 2.2a Crew size on service definition (locked 2026-05-12)

Each service the vendor authors specifies `crew_size` (the number of crew physically present at the event for that service) and `crew_meal_required` (whether crew meals from the catering vendor are needed — defaults TRUE; vendors can opt out if they bring their own crew meals). Schema lives on `vendor_services` per 0006 § `vendor_services` (the ALTER TABLE adding `crew_size INT NOT NULL DEFAULT 1` + `crew_meal_required BOOLEAN NOT NULL DEFAULT TRUE`).

The service editor surfaces three controls:

- **"How many of your team will be on-site?"** — numeric stepper (1, 2, 3, …) bound to `crew_size`
- **"Crew meals needed?"** — toggle (default ON) bound to `crew_meal_required`
- **Live preview:** "This service adds 3 to the couple's crew meal count for their catering quote." — updates as the stepper changes

When the customer books this service, `crew_size` propagates into the couple's 0007 Budget crew meal aggregation automatically. The catering vendor's quote then receives `total_pax + Σ(crew_size where crew_meal_required = TRUE)` as the meal count, ensuring crew aren't under-quoted.

### 2.3 Calendar mechanism

```
vendor_calendar_blocks(block_id, vendor_id, service_id?, blocked_at, blocked_until,
                       reason, block_label, block_source, is_private, created_at)
vendor_bookings(booking_id, vendor_id, service_id, event_id, couple_user_id,
                status enum('inquiry','proposal_sent','accepted','active','completed','cancelled'),
                booking_date, package_name, total_php, paid_php, created_at)
```

When `vendor_bookings.status` is `accepted` or `active`, that date is unavailable on the matching service's calendar (and on the master calendar). Booked dates show as colored blocks.

### 2.3a Intra-day calendar blocks (locked 2026-05-18)

Previously the vendor calendar was full-day granularity (a date was either available or blocked). **2026-05-18 unlocks intra-day blocks at 30-minute granularity** — vendors can now block partial days for off-platform commitments, personal time, or already-scheduled external work, freeing the rest of the day to remain bookable through Setnayan.

**Schema columns added to `vendor_calendar_blocks`:**

```sql
-- Existing columns
block_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
vendor_id       UUID NOT NULL REFERENCES vendors(vendor_id) ON DELETE CASCADE,
service_id      UUID REFERENCES vendor_services(service_id),
blocked_at      TIMESTAMPTZ NOT NULL,    -- start (full-day blocks: 00:00 in vendor's TZ)
blocked_until   TIMESTAMPTZ NOT NULL,    -- end   (full-day blocks: 23:59 in vendor's TZ)
reason          TEXT,                     -- legacy short reason (kept for backwards-compat)

-- New columns (2026-05-18)
block_label     TEXT NOT NULL,            -- vendor-defined private label
                                          -- e.g., "Off-platform shoot", "Personal day"
block_source    TEXT NOT NULL DEFAULT 'manual'
                  CHECK (block_source IN ('manual','setnayan_booking','synced_calendar')),
is_private      BOOLEAN NOT NULL DEFAULT TRUE,  -- couples see "Unavailable" only when TRUE
created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

CHECK (blocked_until > blocked_at),
CHECK (EXTRACT(MINUTE FROM blocked_at) IN (0, 30) AND EXTRACT(MINUTE FROM blocked_until) IN (0, 30))
  -- 30-minute granularity enforced at write time
```

**Granularity rule.** Block start + end timestamps must align to the 30-minute boundary (`:00` or `:30`). A 9:30am-12:00pm block is valid; a 9:37am-11:53am block is not. The UI snaps to 30-minute increments automatically.

**Block sources (auto-populated):**

- **`manual`** — vendor-created via the "Add Block" modal in the Calendar surface. These carry vendor-defined labels ("Off-platform shoot — Cebu", "Doctor's appointment", "Vacation").
- **`setnayan_booking`** — auto-populated by trigger when a `vendor_bookings.status` transitions to `accepted` or `active`. Block runs `event_start_time → event_end_time` (or full-day for legacy bookings without time). Label defaults to `{couple_names} · {service_name}`. Always `is_private = FALSE` (couples see "Booked — {date}"); other couples browsing see "Unavailable".
- **`synced_calendar`** — V1.5+ Google Calendar / iCloud sync. Reserved schema column.

**Privacy model:**

- Default `is_private = TRUE` — couples browsing the vendor see "Unavailable" for that window, no label visible.
- Vendor can opt to expose specific block labels (toggle in the Add Block modal). Useful when vendor wants to signal capacity transparency ("Booked: large wedding · 200 guests" might reassure a future couple looking at a Saturday).
- Setnayan-booking source blocks default to `is_private = FALSE` — both parties already know about the booking.

**UI in the Calendar surface:**

- Calendar grid renders blocks visually with colored bars at the time range. **Color coding:**
  - Setnayan-blue: `setnayan_booking` source
  - Vendor-grey: `manual` source
  - Calendar-purple: `synced_calendar` source (V1.5+)
- "Add Block" button → modal with start datetime (rounded to :00/:30) + end datetime + label + privacy toggle. Multi-day blocks supported.
- Existing blocks: click to edit label / time / privacy or delete.
- Mobile view: vertical day-by-day strip with time-range chips per block.

**Couple-side rendering (downstream effect on 0006 marketplace + 0016 § 0b wizard):**

- Vendor search excludes vendors with blocks overlapping the couple's selected wedding date (full-day block check; intra-day is only relevant once the couple has selected a specific ceremony/reception time).
- Vendor detail pages show greyed-out "Unavailable" windows in the calendar preview; private blocks show only the time range without label.
- Inquiry/booking form errors if couple selects a blocked time: *"This vendor isn't available during your selected time."*
- The Concierge wizard's recommendation logic queries `vendor_calendar_blocks` and filters out vendors with conflicting blocks for the couple's date/time.

**Migration note.** Existing `vendor_calendar_blocks` rows (pre-2026-05-18) get `block_label = COALESCE(reason, '(legacy block)')`, `block_source = 'manual'`, `is_private = TRUE` defaults. Full-day legacy blocks remain valid (00:00-23:59 timestamps already snap to the 30-minute boundary). No data loss.

### 2.3b Symmetric vendor wizard — Next Actions surface (locked 2026-05-18 cross-ref to 0016 § 0b)

Mirrors the couple-side Concierge wizard pattern (per 0016 § 0b) for vendors. The vendor's dashboard Home gains a **Next Actions strip** that surfaces the same 3-tier urgency feed as couples get:

| Tier | Vendor-side examples |
|---|---|
| 🔴 **Overdue** | Unread couple message > 24h · payout failed retry · verification renewal past due · booked event prep tasks past their hard date |
| 🟡 **This week** | Tasting scheduled Thursday · ₱45,000 payout clearing Friday · booked event Saturday (T-3 days · final headcount due) · 2 couples viewed your profile but haven't messaged |
| 🔵 **Next priorities** | 4 NCR couples matched your profile this week · Pro Weekly slot opens Monday · verification renewal in 21 days · 3 unresponded inquiries from last week |

Powered by the same `getNextActions(vendor_id)` server function pattern — deterministic SQL across `vendor_bookings`, `vendor_messages`, `vendor_payouts`, `vendor_subscriptions`, `event_action_log` (for delegate-vendors), `vendor_calendar_blocks`. **₱0 inference cost.**

**Always free for vendors.** Symmetric helper surfaces are part of the "always helping" north-star (memory: `project_setnayan_always_helping_principle.md`) — vendor success drives platform revenue via Setnayan Pay 5%, so the helper layer stays free regardless of vendor tier.

### 2.3c Coordinator multi-couple dashboard (locked 2026-05-18 cross-ref to 0016 § 0d)

Vendors in `canonical_service IN ('wedding_coordination')` (or assigned delegate access to couple events per 0016 § 0d) get a new **"My Couples" tab** on their dashboard. The tab lists all couples they're working with + a badge count per couple derived from `getNextActions(event_id)` scoped to the coordinator's delegate access.

**My Couples list view:**

```
🔴 Anna & Marco · Feb 14 wedding · 3 overdue items
🟡 Bea & Carlo · Mar 21 wedding · 2 due this week
🔵 Cris & Diane · May 30 wedding · all on track
🔵 Eli & Fina · Jun 12 wedding · all on track
```

Click into any couple → see their Next Actions feed scoped for the coordinator + the full action log + ability to act on items (confirm payments, schedule meetings, reply in chat, share artifacts — per the "act on behalf of" scope in 0016 § 0d).

**Coordinator's daily login pattern:**
1. Open dashboard → glance at multi-couple badge counts
2. Triage couples with red/yellow badges
3. Click into worst-state couple → review action items → act
4. Repeat for each couple needing attention

**Audit attribution.** Every action a coordinator takes is logged in `event_action_log` with `performed_by_role = 'coordinator'`. The couple's dashboard surfaces the "your coordinator did X" stream (per 0021 § 2.0a wizard home variant) so the couple has full transparency.

**Coordinator-on-Pro-Weekly synergy.** When a coordinator is on Pro Weekly subscription (`vendor_pro_weekly`), the couples they book automatically unlock Concierge for free (per 0016 § 0c). This creates a virtuous loop: coordinator's value pitch to couples becomes "Subscribe to me and Setnayan unlocks your wedding planner free." Strong driver of Pro Weekly adoption among coordinators specifically.

### 2.4 Client pipeline

5 stages, vendor moves clients through them:

| Stage | Meaning | Triggers next stage |
|---|---|---|
| **Inquiry** | Couple expressed interest (via "I'm interested" CTA or showcase-event scan) | Vendor sends a proposal |
| **Proposal Sent** | Vendor sent custom plan/quote to the couple | Couple accepts in-app |
| **Accepted** | Couple accepted; awaiting reservation payment | Reservation milestone paid (via 0007 vendor payments) |
| **Active** | Reservation paid; vendor is actively serving this client through event day | Event day completes |
| **Completed** | Past event; gallery delivered, final balance settled | (terminal) |

Side states: `cancelled` (any stage), `paused` (held without commitment).

### 2.4a Completed events card — public vs. private view (locked 2026-05-15)

The vendor dashboard surfaces a **Completed events** stat card on Home and at the top of the Pipeline tab. Per the dual-role public-stats rule (CLAUDE.md decision log 2026-05-15, second row), the card has two modes governed by a single per-vendor toggle.

**Default state — toggle OFF (matches what the public sees):**

```
┌─────────────────────────────┐
│ Completed events            │
│  47   ⓘ Public count        │
│ [ Include team bookings ▢ ] │
└─────────────────────────────┘
```

Reads `public_completed_count` from `vendor_public_completed_events_stats` (iteration 0006). This is the same number visible on the marketplace card and the public `/v/[slug]` landing page. Excludes bookings where the buyer is the vendor's owner, a team member, an internal account tied to this vendor, or a self-comp grant.

**Toggle ON state — vendor admin wants total platform activity:**

```
┌─────────────────────────────┐
│ Completed events            │
│  51   +4 team / internal    │
│ Public count: 47            │
│ [ Include team bookings ☑ ] │
└─────────────────────────────┘
```

Reads `full_completed_count` from `vendor_full_completed_events_stats`. Renders the delta inline ("+4 team / internal") and keeps the **Public count: 47** footnote visible so the vendor admin always knows what the public profile actually shows. The public number doesn't move — the toggle is purely about the vendor admin's private view.

**Toggle storage.** Per-vendor at `vendors.show_team_bookings_in_backend_count BOOLEAN NOT NULL DEFAULT FALSE` (column added in 0006). Editable by any team member whose `vendor_team_members.permissions_json` grants `manage_settings`. Every toggle change writes an `admin_audit_log` row (action `vendor_backend_count_toggle`, target = `vendor_id`, metadata = `{ old_value, new_value, by_user_id }`) so the vendor's own audit trail keeps a record.

**Personal/customer side is unaffected.** A team member viewing their own customer-side dashboard sees their personal event history regardless of how this toggle is set on any vendor they sit on. The toggle ONLY affects this vendor's backend card.

**Why the toggle exists.** The default-OFF behavior keeps the vendor admin honest about what their public marketplace profile actually says (no surprise when a competitor screenshots the public card and asks "wait, you really only have 47?"). The toggle-ON path is for ops visibility — the vendor admin wants to see total bookings including their own team for capacity planning or internal review. The dual display means there's never a hidden gap between what the vendor sees in their backend and what the public sees.

### 2.5 Plan & proposal builder

Per-client custom plan composed of:
- Base service (one of the vendor's authored services)
- Pricing override (per-pax or flat for this specific client)
- Inclusions add/remove
- Milestone schedule (default 3 from 0006, customizable per client)
- Terms & validity window
- "Send to client" → couple sees the proposal in their dashboard with Accept / Counter-offer / Decline CTAs

Schema: `vendor_plans(plan_id, vendor_id, client_user_id, base_service_id, custom_json, total_php, valid_until, status, sent_at)`.

### 2.6 Team / agents

```
vendor_team_members(member_id, vendor_id, user_id, role, permissions_json)
```

Roles:
- **Owner** — full control. Default for whoever registers the vendor.
- **Admin** — full control except billing/Pro and deleting the vendor.
- **Agent** — can chat with clients, edit services they're assigned to, view calendar. Cannot delete services or change pricing.
- **Viewer** — read-only across everything.

Per-service assignment table: `vendor_service_agents(service_id, member_id)` lets owners scope agents to specific services.

### 2.6a Team member role assignment (locked 2026-05-12)

When a vendor owner invites a new team member via "+ Invite teammate," the invite flow includes a **role picker step**:

1. Vendor owner enters: email address + display name + optional team-label (e.g., "Booking team", "Lead photographer")
2. **Role picker (required):** the inviter selects ONE of 4 roles:
   - **Owner** — full control including billing, only one Owner per vendor; if inviting a second Owner, the current Owner is downgraded to Admin
   - **Admin** — full control except billing (cannot modify Pro subscription, payment account, or vendor agreement)
   - **Agent** — chat + assigned services + calendar view only
   - **Viewer** — read-only access to everything
3. **Scoping (optional, agents only):** restrict an agent to specific services (e.g., "Carlo Padilla — Agent — scoped to Wedding + Prenup services only")
4. Invite is sent via 0028 email
5. New team member accepts → joins with the specified role + scope
6. **Owner can change roles anytime** via the Team tab — "Edit" on any teammate row opens the role picker; same UI as the initial invite

Schema:

```sql
-- vendor_team_members already exists per 0022. Extend if not present:
ALTER TABLE vendor_team_members
  ADD COLUMN role TEXT NOT NULL CHECK (role IN ('owner','admin','agent','viewer')),
  ADD COLUMN scoped_service_ids UUID[],  -- nullable; agent-scoping
  ADD COLUMN team_label TEXT,  -- nullable; "Booking team" / "Lead photographer" / etc.
  ADD COLUMN role_changed_at TIMESTAMPTZ,
  ADD COLUMN role_changed_by UUID REFERENCES users(user_id);
```

The team label feeds into the 0019 chat identity masking rule — when `show_team_labels_in_chat = TRUE` on the vendor, customers see "Replied by [team_label]" below the company logo + business name on vendor-side messages.

---

## 2d. Couple-invite claim landing (locked 2026-05-19)

Cross-iteration: **the couple-side trigger and the `vendor_invites` schema live in 0006 (§ Invite-to-Setnayan flow — UX rules + § vendor_invites table).** This section covers only the vendor-side public claim landing page and the post-signup auto-link logic.

### Route

| Route | Auth | Purpose |
|---|---|---|
| `setnayan.com/vendor/claim/{claim_token}` | **Public** (no auth required) | The vendor-side claim landing page. The `claim_token` itself is the only access gate. |

The token is an unguessable URL-safe nonce (~32 chars) generated when the couple sends the invite. There is no rate-limit or guess protection beyond the token's entropy — the volume of brute-force attempts required to enumerate one valid token is computationally infeasible.

### Page surface (default branch — new vendor)

When a vendor opens the claim link and the invited email does NOT correspond to an existing Setnayan user, they see a single-page landing tuned for trust + conversion:

**Hero block.**
- "**{Couple display name}** invited you to claim your free Setnayan profile."
- Sub: "They've added you as their **{service_category}** for their wedding on **{event_date formatted in PH long-form, e.g. June 12, 2026}**."

**Identity snapshot card** — read-only mirror of the couple's `event_vendor_relationships` row, identity fields only (locked 2026-05-19):
- Business name
- Phone
- Email (matches the invited email; non-editable)
- Service category (canonical or custom service name)
- Couple's display name + event date

**Explicitly NOT surfaced pre-claim** (per the 2026-05-19 privacy lock in 0006):
- `package_name`, `package_total_centavos`
- Any `vendor_inclusions` rows
- Any `vendor_payment_milestones` rows
- Any `vendor_meetings` rows

These are visible to the vendor inside their 0022 Clients pipeline the moment they finish signup.

**Why-Setnayan strip** (short value props):
- Free Setnayan vendor profile + marketplace listing
- In-app chat with the inviting couple unlocks immediately on signup
- Payment-deadline tracking, contract storage, meeting log all already filled in by the couple
- Marketplace exposure to other couples planning in the Philippines
- No upfront cost; no credit card required

**Two CTAs:**

1. **Claim & sign up** → routes the vendor into the standard registration flow (§ 2.1 onward) with three context items attached:
   - `email` is pre-filled and locked (matches the invite email; vendor cannot edit without abandoning the claim)
   - The `claim_token` is carried as a query param through every step
   - A hidden field carries the originating `relationship_id`
   Vendor proceeds through the normal steps including the mandatory logo gate (§ 2.1b — placeholder logo is acceptable per existing rules).

2. **I'm not this vendor / decline** → confirmation modal: *"We'll let {Couple display name} know and won't email you again about this. Are you sure?"* On confirm:
   - `vendor_invites.status='declined'`, `vendor_invites.declined_at=now()`
   - Couple's relationship row pill flips to `Declined the invite`
   - No vendor account is created
   - Per the 0006 rules, the couple may re-invite the same email immediately.

### Page surface (Already-have-an-account branch)

When the email on the invite matches an existing `users.email` who owns a `vendors` row, the claim page surface changes:

**Hero block.**
- "You're already on Setnayan as **{Existing Business Name}**."
- Sub: "**{Couple display name}** wants to connect their wedding ({event_date}) to your existing profile."

**Single CTA: Sign in & connect** → standard sign-in flow with `claim_token` carried through. On successful sign-in:
- The existing `vendor_id` is written to `event_vendor_relationships.marketplace_vendor_id` for the originating relationship.
- `vendor_follows` row inserted in the same transaction for the couple + existing vendor profile (per 0019 § Booking-implies-follow auto-insert).
- `vendor_invites.status='claimed'`, `vendor_invites.claimed_vendor_id` = existing vendor_id, `vendor_invites.claimed_at = now()`, `vendor_invites.claimed_by_user_id` = signed-in user.
- The vendor lands in 0022 with the new client visible in their Clients pipeline (Inquiry stage by default) and a 0019 system message in Threads: *"{Couple display name} connected you as their {service_category} for {event_date}."*
- Chat unlocks for both sides immediately.

No `vendor_invites`-driven account creation happens on this branch — the existing vendor row stays as-is.

### Post-signup auto-link logic (default branch only)

At the final step of vendor registration when the registration was reached through a claim link:

1. The newly-created `vendors` row is written as normal — `public_visibility='coming_soon'` per § 2.1c · `logo_r2_key` populated per § 2.1b (real or placeholder).
2. **Auto-link** in a single transaction:
   - `event_vendor_relationships.marketplace_vendor_id` ← new `vendor_id`
   - `vendor_invites.claimed_vendor_id` ← new `vendor_id`
   - `vendor_invites.claimed_by_user_id` ← new vendor owner's `user_id`
   - `vendor_invites.claimed_at` ← `now()`
   - `vendor_invites.status` ← `'claimed'`
   - `vendor_follows` ← row inserted for the couple's `user_id` + new vendor's `vendor_profile_id` (per **0019 § Booking-implies-follow auto-insert** — enables the couple's `Message` button without a separate follow step)
3. The couple's app receives a 0019 system notification + one-time toast: *"{Business Name} joined Setnayan — chat is now unlocked."*
4. The vendor's Clients pipeline shows the inviting couple as a connected client in the Inquiry stage. The vendor now sees the **full** negotiated state — package, inclusions, milestones, meetings, contracts — that the couple had entered while the vendor was off-platform.

### Failure modes

| Token state | Page surface | What the vendor can do |
|---|---|---|
| `pending`, not expired | Default claim landing (or Already-have-account branch) | Claim or decline |
| `pending`, past `expires_at` | Server flips to `expired` on this access (lazy sweep), then shows: *"This invite link has expired. Please ask {Couple display name} to send you a new one."* | Read-only message, no action |
| `expired` | Same as above | Read-only |
| `revoked` | *"This invite is no longer active. If you believe this is a mistake, please contact support."* | Read-only |
| `claimed` | *"This invite has already been claimed. If that wasn't you, please contact support."* | Read-only |
| `declined` | *"This invite was previously declined. If you'd like to reconsider, please ask {Couple display name} to send a new one."* | Read-only |
| Token not found in DB | Generic 404 page (do not leak token-existence info) | — |
| Parent `relationship_id` deleted | ON DELETE CASCADE removes the invite; same as token-not-found → 404 | — |

### Verification, payout, and Pro implications

A coming_soon vendor created via a claim link is treated **identically** to any other coming_soon vendor:
- Same verification queue + 12-doc checklist (§ 2.1c + 0006 Vendor Verification flow)
- Same Setnayan-managed 3-stage payout (20%/60%/20%) until verified (0006 Vendor Payout model)
- Same Pro subscription path (free tier always; ₱499/week Pro requires verification per § 3)
- Same Setnayan Pay gating (verified-only)

The couple-invite origin is preserved on the `vendor_invites` row for audit / attribution but does not change any verification, payout, or marketplace status.

### Email template (transactional)

Sent to `vendor_invites.email` at the moment the couple sends the invite. Single-call to the existing transactional email provider; no separate template stored in this iteration.

- **From:** `Setnayan <hello@setnayan.com>` (mailbox already configured per API Integration Checklist)
- **Subject:** `{Couple display name} added you as their {service_category} on Setnayan`
- **Body (plaintext + HTML):**
  - Greeting: *"Hi {Business Name},"*
  - Hook: *"{Couple display name} is planning their wedding on {event_date} using Setnayan and has added you as their {service_category}."*
  - Pitch: *"They've already entered your contact info and the details they have on file. Claim your free Setnayan profile to message them directly and see everything they've recorded."*
  - CTA button: **Claim my profile** → `setnayan.com/vendor/claim/{claim_token}`
  - Footer: *"Not the right vendor? Just ignore this email — we won't follow up."* + standard Setnayan footer.

The provider's standard rate-limiting + bounce-handling applies; no Setnayan-side throttle is added in V1.

---

## 3. Pro subscription (locked weekly model)

**Free tier (always):** vendor profile, marketplace listing, basic chat with clients, accepting bookings, manual payment tracking.

**Pro tier (₱499/week — verified vendors only, locked 2026-05-16):**
- Multi-service authoring (more than one service)
- One calendar per service + unified master calendar
- In-app payments + QR-per-guest service retrieval (Setnayan Pay)
- Plan/proposal builder
- Team / agent invites (more than just the owner)
- ~~Video meetings via Daily.co (0019)~~ **RETIRED 2026-05-16** — couples + vendors use external tools (Google Meet, Zoom, Messenger, WhatsApp)
- Per-service rich content (videos, expanded gallery)
- Showcase-event opt-in (0023)
- Boosted Ads eligibility (5km / 10km / 20km weekly — see § 5b)
- Sponsored Boost eligibility (Quarterly ₱249,999 / Annual ₱799,999 at 30km — see § 5b)
- All Tools Unlock bundle eligibility (₱9,999/year — see § 6B)
- Coordinator-join permission in couple threads
- Custom partial payment plans for couples
- Immediate full payout (no 3-stage hold)
- Higher marketplace search ranking
- Featured Vendor program eligibility

**Coming_soon tier (unverified · locked 2026-05-16):**
- Marketplace profile + listing only
- Setnayan Pay LOCKED (couples pay direct off-platform)
- Fixed Setnayan-managed 3-stage payout (20% / 60% / 20% — see § 5c)
- "Coming Soon" badge in marketplace
- No Pro Weekly subscription access
- No Boosted Ads or Sponsored Boost
- No tool access (All Tools Unlock bundle locked)
- Lower marketplace search ranking

Subscription is **weekly, not per-event**. A photographer with 10 weddings in one week pays ₱500 once. Auto-renews; vendor can pause anytime.

Schema:

```
vendor_subscriptions(sub_id, vendor_id, plan enum('free','pro_weekly'),
                    started_at, current_period_end, auto_renew, paused_at?)
```

Apply-then-pay rail applies: vendor toggles Pro → email payment instructions → vendor pays BDO/GCash → admin confirms → Pro flips active for the current week, auto-renews next week unless paused.

---

## 4. In-app crew rates (V1.5 scope; documented for forward-compat)

When Setnayan brokers crew/personnel through the app:

```
crew_member(crew_id, user_id, role_category, rate_per_project_php,
            rate_per_extension_hour_php, tax_pct, in_app_fee_pct, active, payout_method)
```

Couple pays the gross. System computes:
- `tax_withheld = gross * tax_pct`
- `in_app_fee = gross * in_app_fee_pct`
- `crew_net_payout = gross - tax_withheld - in_app_fee`

Withholding is filed monthly with BIR; in-app fee is Setnayan's revenue. Defaults (proposed): `tax_pct = 5%` (PH WHT for professional services), `in_app_fee_pct = 15%` (Setnayan's cut, comparable to Airbnb).

Vendors who offer their crew on Setnayan's marketplace see their `crew_member` rows in the Team & Setnayan surface, with live status (booked / available / off).

---

## 5. QR-as-a-service for vendor types beyond V1

Photography teams, stylists, ateliers, florists, planners, and any vendor that wants per-guest QR retrieval (e.g., florist scans each guest's QR at the entrance to hand them their bouquet) can opt into using Setnayan's QR infrastructure. Pro covers it; non-Pro vendors can pay a flat ₱500/event drop-in.

Each scanned QR:
- Runs through Setnayan auth + event-scoping (rejects cross-event reuse)
- Returns the relevant per-guest record (RSVP status, dietary, table assignment)
- Logs the scan into `event_activity_log` for audit

---

## 4a. Calendar — privacy + collision-tolerance for agents

The Calendar surface is role-redacted. The owner and admins see everything; agents see a redacted view that protects client privacy.

**Owner / Admin view:** every booking visible in full (client name, agent attribution, payment status, scheduled times). Every block visible with its reason.

**Agent view:** the agent sees:
- Their own bookings — in full (client name, payment, times)
- Other team members' bookings — anonymized as **"Blocked · taken"** with no client identifying info, no agent attribution
- Blocked dates (personal / family / holiday / travel / studio-wide) — date and reason if it's the agent's own; just "Blocked" otherwise

**Why the redaction:** privacy. An agent handling chat for ten clients shouldn't be browsing every booking the owner has booked themselves. Anonymized "Blocked" entries still answer the only question the agent needs answered: is this date available for me to book?

**Collision-tolerance permission:**
- **Default (off):** Agent attempting to book on a date already taken by another team member gets a "Date already taken" error. Owner/Admin intervention required.
- **Override on (per-agent toggle):** Agent can book over an existing schedule. Useful for studios with parallel-shooter capacity (Carlo + Liana can shoot two different prenups in different cities the same day). On invocation, an in-app notification fires to the Owner.

Schema additions to `vendor_team_members`:

```
permissions_json: {
  can_override_schedule_conflicts: boolean,
  can_view_other_agents_bookings_in_full: boolean,   // default false for Agent role
  ...
}
```

## 4b. Calendar mobile view rules

- **Primary view: next 2 weeks** of mixed bookings + blocks (full detail per item).
- **Other upcoming · next 1 year** section below as a compact list (date chip + name + agent + status).
- Block dates CTA always visible at the bottom of mobile Calendar.

The 2-week window is the daily-driver focus; the 1-year list is for planning context, not action.

---

## 4c. Agent attribution on every booking

Every accepted booking records who accepted it. Schema:

```
vendor_bookings.accepted_by_user_id  → references vendor_team_members.user_id
```

Surfaced on every booking row in Calendar + Clients pipeline + per-client detail as a small avatar + name chip ("Accepted by Liana"). Owner sees who took which booking; agents see their own bookings vs anonymized peers per the privacy rule above.

---

## 5a. Headquarters Pin + Extended Pins · with 5km service commitment

Every vendor has one **Primary Pin** (their HQ) and may add **Extended Pins** at any other locations where they regularly operate (branch studio, satellite, regular client zone). Each pin is the geocode anchor for radius-based features.

**The 5km service commitment.** At every pin a vendor places, they agree to provide **free transportation for events within 5 km of that pin**. Beyond 5km, the vendor's standard per-service travel fee applies (computed from the nearest pin). This is the commitment that backs Setnayan's "local-vendor" promise — couples know "local" isn't hand-wavy.

**Schema:**

```
vendor_pins(
  pin_id, vendor_id,
  pin_type enum('primary','extended'),
  label,                              -- e.g., "Tagaytay Studio"
  street_address, city, region,
  latitude, longitude,
  free_transport_radius_km default 5,
  agreed_to_commitment_at,
  is_active, created_at
)
```

Constraints: exactly one row per vendor with `pin_type='primary'`. Extended pins are uncapped in count but **cost ₱49/week each**, billed weekly alongside Pro subscription. Vendor can pause an Extended Pin anytime — paused pins keep their address + history but stop billing and stop appearing in radius queries.

**Pricing:**
- **Primary Pin:** FREE (included with vendor account)
- **Extended Pin:** **₱49/week each**, stacks with Pro and any tool integrations

Schema additions:

```
vendor_pins.weekly_price_php  -- 0 for primary, 49 for extended
vendor_pins.paused_at          -- soft-pause without losing history
```

**Computed travel fee logic (per booking):**

1. Pull every active pin for the vendor
2. For each pin, compute distance to event venue
3. If `min(distance) <= 5 km` → travel fee = `₱0` (free)
4. Else → travel fee = (vendor's per-service travel fee, from `vendor_services.travel_fee_php`, calibrated from the nearest pin)

Auto-populates on proposals; vendor can override per-client.

**Surface in dashboard:** Team & Setnayan → Headquarters Pin + Extended Pins block. Map preview shows primary pin with both circles (5km free-zone in solid accent, 20km density-gate in dashed ink). Extended pins listed below as separate cards with their own zone metrics. "Add Extended Pin" CTA opens a map + address modal.

---

## 5b. Vendor Marketing tier ladder · Boosted Ads (weekly) + Sponsored Boost (long-commit) — locked 2026-05-16

The vendor marketing surface now offers a **two-tier ladder**, replacing the original single ₱1,499/week Sponsored Boost SKU:

### Boosted Ads (weekly, by radius — verified vendors only)

A paid weekly add-on that extends a vendor's marketplace reach. Pick a radius:

| Tier | Price | Radius extension | Use case |
|---|---|---|---|
| **Boosted Ads 5km** | ₱4,999/week | 5km from pin | Try-this-week local push |
| **Boosted Ads 10km** | ₱7,999/week | 10km from pin | Citywide reach |
| **Boosted Ads 20km** | ₱14,999/week | 20km from pin | Regional reach |

- Verified vendors only · stacks with Pro Weekly · cancel anytime
- Top-of-search ranking within radius · tiny "Sponsored" pill differentiator
- Same density gate (≥20 vendors in same service category within 20km) — feature hidden below threshold
- Auto-renews weekly unless paused

### Sponsored Boost (premium long-commit · 30km · verified only)

Premium tier for marquee vendor presence at a fixed 30km radius — long commitment required:

| Tier | Price | Commitment | Effective monthly rate |
|---|---|---|---|
| **Sponsored Boost Quarterly** | ₱249,999 | 3 months | ~₱83,333/mo |
| **Sponsored Boost Annual** | ₱799,999 | 12 months | ~₱66,666/mo (~20% discount vs quarterly × 4) |

- Verified vendors only · stacks with EVERYTHING (Pro Weekly + Boosted Ads + tool integrations)
- 30km radius (3× catchment vs default 10km · still density-gated)
- "Featured Sponsor" pill (more prominent than "Sponsored" — visually distinct from weekly Boosted Ads)
- Top-of-search ranking + homepage hero rotation eligibility + category-page top placement

**The prior single ₱1,499/week Sponsored Boost tier is RETIRED.** Weekly demand is now served by Boosted Ads 5km/10km/20km; premium demand is served by the Quarterly/Annual long-commit tier.

**Combined-stack example:** photographer running Pro Weekly + Mood Board integration + Boosted Ads 10km + Sponsored Boost Annual = ₱499 + ₱99 + ₱7,999 (weekly) + ₱799,999/year (~₱15,385/wk amortized) ≈ **~₱23,982/week effective.**

**Per-zone availability:** a multi-pin vendor sees the boost available per-zone. If Mariposa has 3 pins (Tagaytay, Manila, Cebu) and 12 / 32 / 28 photography vendors in each 20km respectively, boost is locked in Tagaytay but available in Manila and Cebu independently.

**What the couple sees:**

- Standard listing in marketplace: ranks by relevance/recency among all vendors within the couple's 10km search radius.
- Sponsored listing: appears with a tiny "Sponsored" pill on the tile. Indistinguishable from organic otherwise — same card design, same imagery, same info.
- Boosted listings appear to couples up to 30km away from the vendor's pin (versus 10km for unboosted).

**Schema:**

```
sponsored_boosts(
  boost_id, vendor_id, target_pin_id,
  service_category, weekly_price_php,
  visibility_radius_km default 30,    -- 10 standard + 20 boost
  started_at, current_period_end, paused_at?,
  auto_renew, is_active
)
```

Marketplace query becomes:

```sql
SELECT v.* FROM vendors v
JOIN vendor_pins p ON v.id = p.vendor_id
WHERE distance(p.lat_lng, couple_search_pin) <= 
  CASE
    WHEN active_boost_exists(v.id, p.id) THEN 30
    ELSE 10
  END
ORDER BY (active_boost_exists DESC), relevance DESC;
```

**Daily check:** a cron computes `vendors_in_20km_per_category` for every active pin · category combination. If a previously-available boost's count drops below the threshold (vendors churn out), the boost continues for the current paid period and surfaces a notice; no new boost can start there until the count returns.

**Future boost types (V1.5):** Featured Vendor (homepage hero), Category Sponsor (top of category landing page), Showcase Spotlight (highlighted at bridal faire pages). All density-gated by the same rule; visibility-extension mechanic may vary per boost type.

---

## 5c. Vendor-controlled final price + payment routing

Two rules govern how money actually moves between couple and vendor.

### Rule 1 — Vendor controls the final agreed price

The catalog price on `vendor_services.flat_price_php` is a **starting point** for negotiation. On the per-client custom plan, the vendor can adjust the **final agreed price** up or down before the contract is signed.

Schema:

```
vendor_plans.catalog_price_php         -- pulled from vendor_services at proposal time
vendor_plans.final_price_php           -- vendor-editable; defaults to catalog_price
vendor_plans.final_price_locked_at     -- set when the client signs the contract
```

After the contract is signed, the final price is locked. Changing it requires both parties to re-sign a new contract.

### Rule 2 — Payments outside the app by default · Setnayan Pay as the V1 opt-in (3%)

**Default — direct payment.** Couple pays vendor directly via BDO bank transfer or GCash (vendor's own accounts). Setnayan tracks the milestone status but doesn't touch the money. Zero platform fee. This is the V1 default and matches the existing locked decision from 0006/0007 ("vendor money leaves Setnayan · direct to vendor").

**Optional — Setnayan Pay · +3% convenience fee.** Couple opts in for a simpler payment experience: one platform handles disbursement, receipts, and milestone tracking. Setnayan routes the payment, takes a 3% fee, and auto-disburses to the vendor within 24 hours of each milestone clearance. **The vendor receives their full quoted amount; the 3% is paid by the couple.**

The 3% covers gateway fees (~2.5%) + reconciliation (~0.3%) + small platform margin (~0.2%). **No escrow, no refund guarantee, no reserve fund.** Setnayan is a payment processor under this option, not a trust custodian.

Worked example (Aira & Boy · Whole Day Documentary @ ₱85,000):

| Path | Client pays | Vendor receives | Setnayan retains |
|---|---|---|---|
| Direct (default) | ₱85,000 to vendor | ₱85,000 | ₱0 |
| Setnayan Pay | ₱87,550 to Setnayan | ₱85,000 (full) | ₱2,550 (3%) |

**Certified-vendor restriction.** Setnayan Pay is **only available when paying a certified (Setnayan Team admin verified) vendor**. Free / pending-verification vendors can only receive direct payments. Protects couples from misdirected funds and reinforces the value of certification.

**No refund guarantee in V1.** If a vendor breaches their service contract, the couple's recourse is through Setnayan customer service on a goodwill / case-by-case basis — not a contractual guarantee. Setnayan may issue partial refunds or platform credits at its discretion. **This is intentional V1 scope-reduction**:

- Avoids escrow regulatory complexity (PH Insurance Commission)
- No reserve fund required (~₱500K–₱1M saved)
- No mediation team needed at launch
- Ships in weeks, not months

**Why 3% (not 5%):** the 5% number was originally sized to fund a real refund-reserve. Without that liability, the fee drops to roughly cover gateway + reconciliation + thin margin. Setnayan Pay at 3% is comparable to Airbnb's payment routing fee (3%), Etsy's transaction fee (~3.5%), GCash for Business (~1.5%).

**Schema:**

```
vendor_bookings.payment_routing enum('direct','setnayan_pay') default 'direct'
vendor_bookings.convenience_fee_pct default 3.0
vendor_bookings.gross_client_pays_php       -- final_price * (1 + fee if setnayan_pay)
vendor_bookings.vendor_receives_php         -- final_price (always)
vendor_bookings.setnayan_keeps_php          -- final_price * fee if setnayan_pay, else 0
```

**Customer service refund discretion** (V1 informal mediation):

```
admin_goodwill_refunds(
  refund_id, customer_user_id, vendor_id, original_booking_id,
  amount_refunded_php, reason, processed_by_admin_id, created_at
)
```

Logged in admin audit trail. Tracks the informal claim cases that will inform the V1.5 Guarantee pricing + reserve sizing.

### Rule 3 — Tax treatment when Setnayan receives payments

When the couple pays Setnayan under the Guarantee, Setnayan is **merchant of record** for the gross amount. PH tax implications (V1 working assumptions, subject to CPA review):

- **VAT.** 12% PH VAT applies on the 5% Guarantee premium (Setnayan's revenue portion). The 5% number is the **net** premium; ₱4,250 in the example becomes ₱4,760 input from the couple side, or it's structured as VAT-inclusive (₱4,250 includes ₱455 VAT) — final structure pending CPA. The vendor portion (₱85,000) passes through; Setnayan is not the seller of the vendor's service.
- **Vendor receipts.** Vendors issue their own Official Receipts (OR) to the couple for the ₱85,000 service amount (their normal billing). Setnayan issues an OR to the couple for the ₱4,250 Guarantee premium, separately.
- **Withholding.** If Setnayan disburses to the vendor, it may need to withhold 1% (creditable withholding tax for purchases of services). The CWT certificate goes to the vendor at year-end. Confirmed with CPA pre-launch.
- **BIR filings.** Monthly VAT (2550M) + creditable withholding (1601E) + quarterly income (1702Q). Setnayan operations cover these.
- **Vendor's own income tax.** Unchanged — vendor reports their ₱85,000 as gross revenue same as if paid direct.

**Why 5% (the rationale that justifies the premium).** Covers (i) PH VAT ≈ 0.5% effective, (ii) gateway fees ~2.5%, (iii) reconciliation + customer-support cost ~1%, (iv) Guarantee reserve fund (set aside for breach payouts) ~1%. High enough to support actual refunds without bleeding margin; low enough that couples view the protection as cheap insurance on a high-stakes purchase.

### Rule 4 — Setnayan Pay convenience fee (locked 2026-05-12 per task #37 pivot — supersedes earlier 5% Guarantee model)

Setnayan does NOT run an insurance product in V1. The earlier 5% Guarantee model (and its actuarial / breach-rate / reserve-fund math) was retired in favor of a simpler 3% convenience fee charged to the customer when they elect to route their vendor payment through Setnayan Pay. The fee is the customer's cost; the vendor receives the full booking amount. Vendors who want to opt out of Setnayan Pay can require direct payment (cash / direct GCash to their account / bank transfer).

The 5% actuarial pricing model and its margin / loss-ratio analyses (breach rate, expected loss per policy, reserve fund, tiering ladder, "all-in fair rate") are no longer applicable. See CLAUDE.md § "Payment system (V1 — apply-then-pay)" for the active model.

### Rule 5 — Force majeure carve-out

Vendor cancels because of typhoon, earthquake, government-mandated event ban, family death, severe illness, or other event genuinely beyond their control = **full refund to couple from the Guarantee fund · no vendor reliability penalty**.

Why this matters: vendors won&apos;t enroll in the Guarantee if every cancellation hurts their reputation. Force majeure being on the fund (not the vendor) keeps vendors comfortable opting in, while still protecting couples.

Schema: `vendor_bookings.breach_reason enum('vendor_fault','force_majeure','couple_cancellation','mutual')`. Only `vendor_fault` triggers the reliability deduction.

### Rule 6 — Refund tied to 6-stage progress (objective, not vibes)

Refund eligibility is computed against the vendor stage tracker:

| Vendor stage reached | Max % disbursed before refund | Refund eligible % |
|---|---|---|
| Stage 1 · Planning Locked | 30% | Up to 70% |
| Stage 2 · Preparing Materials | 50% | Up to 50% |
| Stage 3 · Ready to Deploy | 75% | Up to 25% |
| Stage 4 · Arrived On-Site | 85% | Up to 15% |
| Stage 5 · Installing | 92% | Up to 8% |
| Stage 6 · Ready for Event | 100% | 0% — full delivery |

Couple-only review on the stage progression: if the vendor self-reported stage 4 but didn&apos;t actually arrive, the couple raises a dispute and Setnayan mediation rolls the stage back. The combination of vendor self-report + couple review + Setnayan mediation gives objective evidence to settle refund claims.

### Rule 7 — V1.5 tiering (deferred until claim data exists)

Once Setnayan has 6 months of policy + claim data, consider rate tiering:

| Tier | Rate | Eligible vendors |
|---|---|---|
| Standard | 5% | All certified vendors (V1 default) |
| Trusted Vendor | 3.5% | 12+ months certified · zero claims · &lt; 1% dispute rate |
| New Vendor | 6% | &lt; 6 months certified · risk premium |
| Volume | 4% | Packages &gt; ₱150K · volume discount on big contracts |
| Tiny floor | min ₱500 | Contracts &lt; ₱10K · keeps small-policy economics sane |

Tiering is V1.5+. V1 is a single 5% rate while we collect data.

---

## 6. Vendor consumes Setnayan — three categories of value

Three distinct ways vendors plug into Setnayan, each with a different revenue model:

### 6A. Provide manpower / materials for Setnayan apparatus · FREE to list

Couples buy Papic / Panood / LED from Setnayan, then can optionally hire a vendor's manpower or rent the vendor's hardware instead of recruiting their own friends.

- **Vendor lists themselves** as a provider in their vendor dashboard (this surface)
- **FREE to list** — Setnayan doesn't charge a listing fee
- **Vendor sets their own price** for the manpower / rental
- **Payment goes direct to vendor** (BDO/GCash, not through Setnayan)
- **Setnayan doesn't take a cut** on this listing — we just route the booking through our marketplace

Listings available:
- Papic crew + DSLR rental
- Panood broadcaster + camera operators
- LED installation + tech crew
- (future) Additional apparatus listings as new SKUs ship

Schema:

```
apparatus_provider_listings(
  listing_id, vendor_id, apparatus_sku,
  description_md, price_php, price_unit enum('per_event','per_hour','per_seat'),
  service_area, is_published, created_at
)
```

### 6B. Specialized tool integrations · ₱99/week each OR All Tools Unlock bundle ₱9,999/year (locked 2026-05-16)

Stylists, planners, ateliers — embed Setnayan's couple-facing tools inside their own service offering. Couples edit through the vendor's branded surface; the vendor co-edits alongside.

**À la carte (₱99/week each):**
- **Mood Board integration** · ₱99/week · embeds the palette editor + Setnayan Guide rule engine + 20 pre-templates
- **Seat Arrangement integration** · ₱99/week · embeds the seating chart editor + 13-table catalog + print pack
- **Palette integration** · ₱99/week · color-palette studio
- **QR Reader integration** · ₱99/week · scan-and-retrieve workflows
- **Advanced Pricing Tier** · ₱99/week · multi-rate / time-of-day / package-bundle pricing engine
- *(future V1.5)* Schedule Builder · Vendor Coordinator · etc.

**All Tools Unlock bundle (NEW SKU 2026-05-16):**
- **Price: ₱9,999/year**
- Includes: Mood Board · Palette · Seating Arrangement · QR Reader · Advanced Pricing Tier
- **Open to ALL paying vendors** (NOT verified-only — capability tools support new vendor growth, including coming_soon vendors who can pay for the bundle even without full verification)
- Saves ~61% vs buying each tool at ₱99/wk individually (₱99 × 5 tools × 52 weeks = ₱25,740/yr à la carte)
- Annual billing only · auto-renews · paused on subscription pause

À la carte ₱99/wk and All Tools Unlock ₱9,999/yr both stack on top of Pro Weekly base. A stylist on Pro Weekly + All Tools Unlock pays ₱500/wk + ₱9,999/yr (~₱192/wk amortized) = ~₱692/wk effective.

Schema:

```
vendor_tool_integrations(
  integration_id, vendor_id, tool_key enum('mood_board','seat_arrangement','palette','qr_reader','advanced_pricing','...'),
  weekly_price_php, started_at, current_period_end, paused_at?
)

vendor_tool_bundles(
  bundle_id, vendor_id, bundle_key enum('all_tools_unlock_annual'),
  annual_price_php default 999900,    -- ₱9,999 in centavos
  started_at, current_period_end, auto_renew, paused_at?
)
```

### 6C. Pro-included benefits

Everything else in the Pro Weekly base (₱499/week):
- QR-as-a-service for per-guest retrieval workflows
- Showcase event opt-in (bridal faires, marketplace events)
- Payouts & BIR-ready statements
- Multi-service calendars
- Plan / proposal builder
- Team invites
- ~~Video meetings (Daily.co)~~ **RETIRED 2026-05-16** — couples + vendors use external tools
- Plus future inclusions as Pro evolves

### Cross-category summary

| Category | Cost | Setnayan's cut | Setnayan handles payment? |
|---|---|---|---|
| A · Apparatus provider listings | FREE | 0% | No — direct to vendor |
| B · Specialized tool integrations | ₱99/week each | 100% (license fee) | Yes — billed weekly with Pro |
| C · Pro-included benefits | Bundled in ₱500 Pro Weekly | 100% (subscription) | Yes |

This replaces and clarifies the earlier "Crew marketplace · 15% Setnayan fee · 5% withholding" description, which was actually two different things conflated: (i) free vendor-self-listed manpower (A above) and (ii) Setnayan-brokered freelance crew with deductions (still in V1.5 scope, deferred from V1).

---

## 7. Mobile vital-info rule (inherited from 0021)

Mobile surfaces show only what's vital. For vendors that means:
- **Home** — today's events + immediate action items
- **Clients** — pipeline scroller, then tap into one
- **Calendar** — current week
- **Threads** — most-recent first
- **Add** flows happen via bottom sheets, not full-screen forms

Bulk work (service authoring, plan-and-proposal building) defaults to desktop with a "Open on desktop" hint on mobile.

---

## 8. Cross-iteration handoffs

- **0006 Vendors** — extends the couple-side vendor profile with the vendor's own authoring surface here.
- **0019 Communications** — chat threads + file sharing + coordinator-join live there; this surface just renders them. ~~Video meetings~~ retired 2026-05-16 — external tools (Google Meet / Zoom / Messenger / WhatsApp) used instead.
- **0007 Budget** — when a client pays the vendor, the milestone flows back into the couple's budget; vendor sees their own payment register here.
- **0020 Interaction Prototype** — Phase 1 covers vendor onboarding (0022 expands the post-verification view).
- **0021 Couple Dashboard** — symmetric to this iteration on the demand side.

---

## 10. Navigation entry points for V1 features (locked 2026-05-12)

Iterations 0024–0035 were drafted after the vendor dashboard's 6 surfaces were locked. This table closes the gap — every vendor-side feature has one canonical entry point.

| Feature | Iteration | UI entry point |
|---|---|---|
| Profile & account settings | 0025 | Top-right profile avatar → dropdown → "Settings" |
| Email notification preferences | 0028 | Settings → "Notifications" tab |
| Help & FAQ | 0029 | Top-right profile avatar → dropdown → "Help" · also a `?` icon in every surface header |
| Replay guided tour | 0030 | Settings → "Tour" tab → "Replay first-time tour" button |
| Tax documents — quarterly Form 2307 | 0026 | Settings → "Tax Documents" tab |
| Contract management | 0032 | Clients surface → each client row has "Contract" action → opens builder or signed-contract viewer |
| Setnayan Pro subscription management | — | Settings → "Subscription" tab |
| Public API access | 0033 | Settings → "API & Integrations" tab (V1.5: shows "Coming soon"; V1: hidden) |
| Sign out | — | Top-right profile avatar → dropdown → "Sign out" |

**Canonical profile-avatar dropdown layout.** The top-right avatar opens a single consistent menu across all three V1 dashboards (couple · vendor · admin): **Settings · Notifications · Help · Tour replay · Sign out**. Vendor-specific affordances (Tax Documents, Subscription, API & Integrations) surface inside Settings tabs rather than as top-level menu items, so the menu stays short and the pattern recognizable when a user with multiple roles switches views.

---

## 9. Companions and next steps

- `0022_vendor_dashboard.html` — interactive 6-surface walkthrough.
- `0022_vendor_dashboard.docx` — stakeholder mirror.
- Iteration **0023** (drafted) — Admin Console — Setnayan operations dashboard for verification, payments, disputes, internal accounts, Team Pool, two-admin approval queue.
- Iteration **0024** (drafted) — Save-the-Date Maker — 30 head-turning templates, customer uploads 3-8 video clips, render in 3 formats, ₱49 per render.
