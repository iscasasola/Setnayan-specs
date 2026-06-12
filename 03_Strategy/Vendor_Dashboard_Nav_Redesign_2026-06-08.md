# Vendor Dashboard — Navigation Redesign

> **Status: PROPOSAL · pending owner sign-off (2026-06-08).** Companion to the clickable prototype
> [`Vendor_Dashboard_Nav_Redesign_2026-06-08.html`](Vendor_Dashboard_Nav_Redesign_2026-06-08.html).
> Affects iteration **0022 (vendor dashboard)**; touches 0034 (payments), 0044 (refinements/attributes),
> the vendor-tier capability matrix, and the token economy. **No code changed** — this is design only.

---

## 0. Scope

A re-organization of the vendor dashboard's information architecture for **both desktop and mobile**:
compact on mobile, more-at-once on desktop, one nav source of truth (mobile flattens, desktop expands).
It does **not** add new product scope — it re-buckets the existing 0022 surfaces and deepens a few of
them (Inbox, Bookings, Home). Several calls below are **load-bearing** and are flagged for sign-off in §8.

---

## 1. Why — current state and its problems

**Shipped today** (`apps/web/app/vendor-dashboard`, `_components/vendor-sidebar.tsx` + `vendor-bottom-nav.tsx`):

- **Desktop** — 4 sidebar groups: Home (Overview, Profile) · **Work** (Bookings, Messages, Services, Contracts, Repertoire, Attributes) · **Grow** (Marketing, Verify, Reviews, Moodboard) · **Business** (Earnings, Payment-options, Tokens, Manpower, Redeem, Branches, Team).
- **Mobile** — 5 tabs: Home · Bookings · Messages · Earnings · **More** → a flat list of ~15 routes.

**Problems:**

1. **"Work" mixes two modes** — *respond to inbound* (Bookings, Messages, Contracts) and *configure what I sell* (Services, Repertoire, Attributes). Daily-driver vs set-once.
2. **Money is split by the wrong axis** — Earnings/Payment-options (money *in*) sit beside Tokens/Redeem (money *out, to get leads*). Opposite flows, same bucket.
3. **The core loop is gated by an invisible resource** — a vendor can't answer an inquiry without burning a token (per the locked token model), yet the balance lives three groups away and never appears where the answer happens.
4. **Mobile "More" is a 15-item dump** — and it's where all of setup lives.
5. **Tiers are invisible** — gated features (Branches=Enterprise, agent seats, marketplace visibility) neither show their locks nor sell the upgrade. Tiers sell *reach*; the nav should too.

---

## 2. Proposed information architecture

### The spine — 5 primary destinations

| # | Primary | What it is |
|---|---|---|
| 1 | **Home** | Command center — "what needs me today" |
| 2 | **Inbox** | New leads **+** chat, unified — *answering a lead burns the token here* |
| 3 | **Bookings** | Pipeline (soft-hold→downpaid→confirmed→delivered); contracts + delivery live inside |
| 4 | **Earnings** | Money *in* + payout status (off-platform) |
| 5 | **More** | the 3 grouped sections below |

### The grouped sections (collapsible sidebar groups on desktop / grouped accordion in mobile "More")

- **Storefront** (set once, refine): Services & packages · **Refinements** (inside Services — see §3.3) · Repertoire\* · Portfolio & profile · Reviews · Moodboard\*
- **Reach** (get more/better leads — tier-aware): Verification & tier · Boost & marketing · Leads & tokens (balance · packs · redeem · history)
- **Account** (rare/org): Team & agents · Branches *(Enterprise)* · Manpower\* · How clients pay you · Notifications · Settings

\* **Conditional** — see §3.5 (appears only for the categories the vendor lists under).

### Desktop ↔ mobile mapping

The `NavGroup[]` definition is **one source of truth** (already true in code — mobile `/more` consumes the same array via shape introspection). Desktop renders the full sidebar with all groups expandable; mobile shows the 5-tab spine + a grouped, searchable "More". Role filtering (agent/viewer scoped subset) and group-`key` localStorage continuity carry over unchanged.

---

## 3. Load-bearing decisions

### 3.1 Unified Inbox (merge Messages + the lead/inquiry queue)
A lead *is* a chat thread, and answering it is the token-burn moment. Today Bookings and Messages are separate and the burn is disconnected from the conversation. **Merge** into one Inbox with filters (New leads / Awaiting you / Active / Archived); the burn happens here with the balance visible and the cost on the **Answer · ◎-N** button. *(Touches the inquiry/chat model — biggest structural change.)*

### 3.2 Command-center Home (not a profile redirect)
Home answers "what needs me today": new leads (with token cost), replies owed, this week's events, downpayments expected, low-token warning, verification/tier status with one upgrade CTA. It is the single landing place for every **customer→vendor** signal (new lead, review, cancellation, dispute) and **admin** signal (verification, payout, tier) — the 3-actor mandate made concrete.

### 3.3 Refinements fold **into** Services (not a standalone nav item)
Refinements (0044 `/attributes`) are **leaf-only** — each service carries its own match facets. So they belong **inside each service** as "step 2 of a service" (the offer → the refinements couples match on), surfaced through a per-service **Match-readiness** index on the Services page, not as a sibling nav entry. *(Owner-confirmed 2026-06-08.)*

### 3.4 Booking workspace depth
Bookings becomes a master-detail (list + workspace). Each booking runs end-to-end in one place: a **stage stepper** (soft-hold→downpaid→confirmed→delivered), **payment actions** (mark downpayment/balance received — off-platform, Setnayan never holds the money), a **contract e-sign flow** (draft → send → couple signs → counter-sign → executed), delivery, and a live activity timeline. Earnings recomputes from these payment actions.

### 3.5 Conditional nav = **union of the vendor's categories**, tier-capped
A vendor isn't one archetype — they list under **one or more categories**, and **the nav is the union of each category's surfaces**:

| Category | Signature surface |
|---|---|
| Caterer | Manpower (crew → auto-budget line) |
| Photographer / stylist | Moodboard library |
| Band / DJ | Repertoire (song sets) |

A **caterer + photographer** sees Manpower *and* Moodboard; add a band and Repertoire joins. Shared surfaces (Inbox, Bookings, Services, Refinements, Portfolio, Reviews, Earnings, Reach, Account) always show.

**This is gated by the parent-category cap:** **Free = 1 · Verified/Pro = 3 · Enterprise = ∞ (all categories).** So being multiple archetypes requires Verified+, and an **Enterprise vendor can list under every category and the nav surfaces all of them.** One identity, many hats — same logo, hybrid-anonymity, token wallet, reviews; the categories just expand what the vendor can be booked for and which tools appear.

### 3.6 Token made visible + tier-as-Reach with legible locks
Persistent token-balance chip (top bar on desktop, Home header on mobile), inline burn cost at the point of action, low-balance nudge. Gated features show **locked** with an upgrade path ("Branches — Enterprise", "+ agent seats — Pro") instead of hiding — tiers sell reach, so the nav sells the upgrade. Verify is pinned for unverified vendors (the Free→Verified unlock for marketplace visibility).

### 3.7 State-aware: first-run (Free) vs established (Pro)
A brand-new Free, unverified vendor sees a setup checklist, a **locked Inbox** ("couples can't reach you yet — get verified"), Free empty states on Bookings/Earnings, and the value prop (100 founder tokens on verify · 0% commission). This shows the bottom of the tier ladder and the onboarding funnel, not just the established view.

---

## 4. Desktop affordances ("more at once")

- Persistent collapsible sidebar with **inline live counts** on nav items.
- A top **utility bar** keeping token balance + tier badge + notifications always in view.
- **Master-detail** for Inbox and Bookings (list + item side-by-side; no drilling).
- A **context rail** on Inbox showing the couple/event/match% for the selected lead.

## 5. Mobile (compact)

- 5-tab spine in the thumb zone; Home = tappable signal cards.
- Token chip pinned in the header; burn cost on the Answer button.
- **"More" is a 3-section accordion** (Storefront / Reach / Account) + search — never a flat list.
- Same group definitions as desktop; drill-in for master-detail surfaces.

---

## 6. What's net-new vs shipped 0022

| Net-new | Re-bucketing only (low effort) |
|---|---|
| Unified Inbox (3.1) — touches inquiry/chat model | The 5-spine + Storefront/Reach/Account grouping |
| Command-center Home (3.2) | Refinements moved under Services (3.3) |
| Booking workspace depth (3.4) | Conditional-nav union driven by listed categories (3.5) |
| Persistent token chip + visible locks (3.6) | Free vs Pro state surfacing (3.7) — data already exists |
| Earnings recompute-from-bookings | Notifications stays topbar-bell |

## 7. Migration & risk

**Low.** The code already uses one `NavGroup[]` source of truth that mobile consumes by introspection, and group **keys are preserved across relabels** (localStorage open-state continuity). Most of this is re-bucketing + relabels. The genuinely new work is the Inbox merge, the command-center Home, the booking workspace, and the token chip. Conditional-nav-by-category and Free/Pro surfacing reuse data that already exists (`vendor_services` categories, `tier_state`).

## 8. Open questions for owner sign-off

1. **Inbox merge (3.1)** — combine Messages + the lead queue into one surface? (Biggest structural change; affects the inquiry/chat model.)
2. **Spine + group names** — Home · Inbox · Bookings · Earnings · More; Storefront / Reach / Account. OK to adopt these labels?
3. **Refinements fold (3.3)** — confirmed 2026-06-08; recorded here for completeness.
4. **Conditional-nav union + tier cap (3.5)** — confirm the category→surface map (caterer→Manpower, photographer→Moodboard, band→Repertoire) and that Enterprise surfaces all of them.
5. **Build order** — ship the cheap re-bucketing first (groups + token chip + mobile grouped-More), then the deeper pieces (Inbox merge, Home, booking workspace)?

## 9. References

- Prototype (clickable, both form factors × Free/Pro × multi-category): `Vendor_Dashboard_Nav_Redesign_2026-06-08.html`
- Iteration: `0022_vendor_dashboard/` (`0022_vendor_dashboard.md`)
- Tier model: vendor-tier capability matrix (`Vendor_Tier_Capability_Matrix_2026-06-07.md`), `apps/web/lib/vendor-tier-caps.ts`
- Refinements: iteration 0044 (`/vendor-dashboard/attributes`)
- Token economy: `Token_Economy_Flow_Map_2026-06-01.html`, DECISION_LOG burn-band rows
- Off-platform payments: 0034, `project_setnayan_vendor_payment_disclosure`
