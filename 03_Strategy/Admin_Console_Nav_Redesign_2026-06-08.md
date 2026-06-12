# Admin Console — Navigation Redesign

> **Status: CONDITIONALLY APPROVED by owner (2026-06-08) · CORE SHIPPED to prod 2026-06-09 (PR 1–4).** All four core PRs are live on www.setnayan.com/admin:
> - **PR 1** ([#1124](https://github.com/iscasasola/setnayan-platform/pull/1124)) — nav re-bucket (verb spine + 4-tab mobile + drift fixes).
> - **PR 2** ([#1133](https://github.com/iscasasola/setnayan-platform/pull/1133)) — **command-center Home** (all 11 queues grouped by lane; the "Money to reconcile" lane **satisfies the Money-lane sign-off condition**; fixed a pre-existing wrong *Vendors to verify* count).
> - **PR 3** ([#1143](https://github.com/iscasasola/setnayan-platform/pull/1143)) — mobile "More" **3-section accordion**.
> - **PR 4** ([#1144](https://github.com/iscasasola/setnayan-platform/pull/1144)) — **two-admin (four-eyes) approval queue** `/admin/approvals` (migration `20260930000000` applied to prod; adversarially security-reviewed). Builds the §9.1 primitive the audit found unbuilt.
>
> Optional remaining (not core): recent-admin-activity feed on Home; platform-alerts strip (needs real data sources); future opt-in of more two-admin action types (refunds/brand/pricing) into the now-built `admin_approval_requests` primitive. — *"for as long as everything is easier to manage with the fixed grouping, then we are good."* Acceptance bar = **manageability**. Two load-bearing strings: (a) the **Money-lane filter in Work is required** (without it, dissolving the Money group is a downgrade for finance); (b) the **handler-lane seam is wiring, not locks** — no real permission control until RBAC ships (separate build). Labels default to the suggested set ("Work"; swappable to "Queues", group key stays stable). Companion to the clickable prototype
> [`Admin_Console_Nav_Redesign_2026-06-08.html`](Admin_Console_Nav_Redesign_2026-06-08.html).
> Affects iteration **0023 (admin console)**; touches 0034 (payments/reconciliation), the two-admin
> approval pattern (§9.1), the §10a/§10b internal-account tiers, and 0023 §4.3 handler roles.
> **No code changed** — this is design only, the sibling of the vendor redesign
> ([`Vendor_Dashboard_Nav_Redesign_2026-06-08.md`](Vendor_Dashboard_Nav_Redesign_2026-06-08.md)).

---

## 0. Scope

A re-organization of the admin console's information architecture for **both desktop and mobile**:
more-at-once on desktop (dense queues, bulk actions, master-detail), compact on mobile (single-tap
approvals on the go), one nav source of truth (mobile flattens, desktop expands). It does **not** add
product scope — it re-buckets the ~44 shipped `/admin/*` surfaces and deepens three of them (Home,
Work, the two-admin Approvals queue). Several calls below are **load-bearing** and are flagged for
sign-off in §8.

**Anchored against all three sources.** Live `www.setnayan.com/admin` (confirmed auth-gated — the real
shipped console sits behind sign-in, so the canonical reference is the code); shipped code on
`origin/main` (`apps/web/app/admin/_components/admin-sidebar.tsx` + `admin-bottom-nav.tsx` +
`mobile-landing-grid.tsx` + the ~53 `page.tsx` route files); and the iteration spec
`0023_admin_console/0023_admin_console.md`. Where the spec ("31 surfaces", "8 groups") disagrees with
the code (6 groups, ~44 surfaces), **the code wins** — the spec's own AS-BUILT header says so.

---

## 1. Why — current state and its problems

**Shipped today** (`apps/web/app/admin`, `_components/admin-sidebar.tsx` + `admin-bottom-nav.tsx`):

- **Desktop — 6 sidebar groups** (remapped 8→6 on 2026-06-04 "for a simpler console"):
  - **Home** — Overview (`/admin`)
  - **Queues** — Payments · Payment options · Verify · Disputes · Force majeure · Reviews · Help · Setnayan AI abuse
  - **Directory** — Users · Vendors · Demo vendors · Events · Venues · Wedding types · Wedding traditions
  - **Money** — Pricing · Budget Planner · Discount codes · Add-ons · Payouts · Token bands · Token sales · Receipts · Payment methods
  - **Insights** (key `funnels`) — Growth · Funnels · Operations & Hiring · Telemetry · Connection logs · Offline daemon
  - **Manage** (key `content`, collapsed by default) — Taxonomy · Website · Ads · Setnayan AI brain · Moodboard library · Songs · Settings · Demo mode
- **Mobile — 5 bottom tabs** (Home · Queues · Directory · Money · More) → 4 mobile-overflow landing-grid pages that re-render the same `NavGroup[]` as cards. "More" = Insights + Manage merged (~14 cards).

The grouping was reshuffled twice (8→6) pragmatically, never from an ops-first principle. The problems:

1. **The defining workload of an ops console — "what's pending" — is scattered across four groups.** Genuine act-now queues live in **Queues** (Payments, Verify, Disputes, Force majeure, Reviews, Help, AI abuse, Payment options) but three more hide elsewhere: **Token sales** reconciliation sits in *Money*, **Taxonomy requests** review sits in *Manage*, and the **two-admin approval queue** sits inside *Settings* with **no nav entry at all**. An admin can't see their whole worklist in one place.

2. **The two-admin approval loop is half-built and has no home.** The spec is explicit — §3.1 lists "Two-admin approvals pending" as a Home card, §4 defines the four-eyes pattern, and the §1 cross-reference table says the queue opens from Home. In code, request *creation* exists (`apps/web/app/admin/users/actions.ts` writes `admin_approval_requests`), but **no surface anywhere lets a second admin see and approve a pending request** — and the shipped Home (which *does* surface 4 live action-queue counts) omits it entirely. For a console where "Admin A is waiting on Admin B" is a daily blocker, the highest-stakes loop in the whole console can't actually be completed in the UI.

3. **"Money" is a grab-bag mixing act-now queues with set-once config.** Reconcile-now work (Token sales) sits beside pricing config (Pricing, Add-ons, Discount codes, Token bands, Budget Planner), payment records (Receipts), and a fraud-critical security surface (Payment methods — receiving-account numbers, two-admin gated). Four different kinds of work, one bucket. Meanwhile Payments — also a reconcile queue — lives in *Queues*, so the two halves of "money in" are split by the wrong axis.

4. **Grouping is by noun-domain, not by what the admin does.** Queues / Directory / Money / Insights / Manage are *topics*. But an ops tool's primary axis is the **verb**: *act on what's pending* (queues + approvals + requests) → *look something up* (people/vendors/events) → *tune the platform* (pricing, content, settings, analytics). Set-once config (Taxonomy editor, Website, Songs) gets the same sidebar weight as the daily queue grind.

5. **Home under-surfaces the workload.** The shipped Home shows 4 of ~12 pending queues (Verify, Payments, Disputes, Review appeals). It misses Payment-options moderation, Force majeure, AI abuse, Help tickets, Token sales, Taxonomy requests, and — per problem #2 — two-admin approvals. The spec's §3.1 wants a 6-card overview *plus* platform alerts *plus* a recent-admin-activity feed; the code has the first idea but not the full picture.

6. **No permission scoping in the nav.** The spec defines named **handler roles** (§4.3: Verification Handler, Payments Handler, Disputes Handler, Customer/Vendor Accounts Handler, Ops Lead) and three **account tiers** (🟣 Internal §10a, 🟢 Team Pool §10b, plain Admin). But the layout guard is a flat `isAdmin = is_internal || is_team_member || account_type==='admin'` — **every admin sees all ~44 surfaces identically.** A Payments Handler wades through Verify, Taxonomy and Songs they never touch. (RBAC isn't built; the nav should at least be *shaped* to support lanes.)

7. **Mobile copies the vendor thumb-nav model, which doesn't fit an ops tool.** The 5 mobile tabs (Home/Queues/Directory/Money/More) mirror the desktop domain groups rather than asking "what does an admin actually do on a phone?" Admin is desktop-first; the honest mobile job is **quick approvals on the go** (approve a verification, confirm a matched payment, give a second sign-off) — *not* browsing Funnels or editing Taxonomy. And "More" is a 14-card dump of two unrelated groups (analytics you read on a big screen + config you set once).

8. **Live drift artifacts.** `/admin/notifications` (the cross-actor signal reader, shipped per PR #1054) exists as a page but is in **no nav** — an orphan. `/admin/token-purchases` ("Token sales") is in the desktop sidebar but **missing from both mobile bottom-nav match arrays**, so on mobile it lights up no tab. Small, but real.

---

## 2. Proposed information architecture

### The spine — 3 primary destinations (the verb axis)

| # | Primary | What it is |
|---|---|---|
| 1 | **Home** | Command center — every pending queue at a glance + alerts + activity. The morning glance. |
| 2 | **Work** | The queue-clearing workspace — **all** act-now surfaces in one master-detail, with handler-lane filters. The daily grind. |
| 3 | **Directory** | Look-up — find a person / vendor / event / venue. Read-mostly. |

**Home vs Work** is the dashboard-vs-worklist split every real ops console has: Home = situational awareness + jump-off; Work = actually do the thing. They share one count source so the numbers always agree.

### The grouped sections (collapsible sidebar groups on desktop / grouped accordion in mobile "More")

- **Insights** (read — desktop dashboards): Growth · Funnels · Operations & Hiring · Telemetry · Connection logs · Offline daemon
- **Money & Catalog** (tune — set-once config + records): Pricing · Add-ons · Discount codes · Token bands · Budget Planner · Receipts · Payment methods 🔒
- **Platform** (tune — config, content & security): Settings 🔒 · Taxonomy editor · Website · Ads · Setnayan AI brain · Moodboard library · Songs · **Wedding types** (per-religion launch gate) · **Wedding traditions** (content) · Notifications · Demo mode

### Work — the 12 unified act-now surfaces (grouped into handler lanes)

| Lane | Queues |
|---|---|
| **Trust & supply** | Verify · Taxonomy requests · Payment options (vendor destination screening) |
| **Money** | Payments (reconcile) · Payouts (release) · Token sales (confirm pack purchase — each row links to the vendor's **wallet** `vendors/[id]/tokens` to adjust balance / read the ledger) |
| **Recourse** | Disputes · Force majeure · Review appeals · AI-abuse flags |
| **Approvals & support** | **Two-admin approvals** (§9.1) · Help tickets |

This pulls back the three scattered surfaces (Token sales from Money, Taxonomy requests from Manage, two-admin Approvals from Settings) and gives the four-eyes queue a first-class home.

### Desktop ↔ mobile mapping (one source of truth)

The `NavGroup[]` array stays the **single source of truth** — exactly as today, where the 4 mobile landing grids consume the same array by introspection. The redesign keeps that contract:

- **Desktop** renders the full sidebar: 3 spine items + 3 collapsible groups; **Work** expands into its master-detail with an inner queue-rail (the 12 queues, grouped by lane, each with a live count).
- **Mobile** shows a **4-tab spine** (Home · Work · Directory · More); **More** flattens the 3 groups into a searchable 3-section accordion. `Work` becomes the quick-approve surface (see §5).

Group `key` continuity (the existing `funnels`→"Insights" / `content`→"Manage" localStorage-preserving divergence) carries over: relabel freely, keep keys stable so open-state survives. Role filtering (the forward handler-lane subset) layers on top of the same array.

---

## 3. Load-bearing decisions

### 3.1 Verb-based spine replaces the noun-domain 6-group — and the dedicated "Money" group dissolves
The biggest structural call. Today's six topic groups become a 3-item spine (Home / Work / Directory) + 3 tune-groups (Insights / Money & Catalog / Platform). **"Money" stops being a primary group**: its *queues* (Payments, Payouts, Token sales) move into **Work**, its *config* (Pricing, Add-ons, Discount codes, Token bands, Budget Planner, Receipts, Payment methods) moves into **Money & Catalog**. *Mitigation for finance-minded admins:* Work's **Money lane** filter shows all three money queues together in one click, and Money & Catalog keeps all config together — so "all money in one place" is one filter away, while the spine stays ops-shaped.

### 3.2 Unify every act-now surface into "Work"
Work holds all 12 queues, including the three that are scattered today. A queue is "a list of things in a pending state an admin resolves" — Verify, Payments, Payouts, Token sales, Disputes, Force majeure, Review appeals, AI abuse, Payment-options screening, Taxonomy requests, Two-admin approvals, Help. Desktop renders this as master-detail (queue-rail → list → work-in-place); the queue-rail carries live counts and **lane filters** (All / Trust / Money / Recourse / Approvals / Support).

### 3.3 Elevate the two-admin Approvals queue to a first-class Work surface **and** a Home card
This realizes what the spec already intends (§3.1 Home card, §4 pattern, §1 cross-ref table) but the code only **half-built**: requests are *created* from Users actions, yet **no reading/approval surface exists** for the second admin. So this is **net-new UI**, not a re-bucket — Approvals gets its own queue in Work and its own card on Home, with the four-eyes guard visible: **you cannot approve a request you initiated** (the prototype disables your own row and says why). This is the most under-served critical surface today.

### 3.4 Home = full command center (not a 4-of-12 subset)
Home surfaces **all** pending queues grouped by theme (Trust & supply / Money to reconcile / Recourse / Approvals & support), plus the **platform-alerts** strip (R2 quota, GCash-sync freshness, RLS failures) and the **recent-admin-activity** feed — both called for in spec §3.1 but absent from the shipped Home. Every card is tappable → jumps straight into that queue in Work. This is also where the **3-actor mandate** lands: Home is the single place every customer→vendor signal (dispute, review, cancellation) and admin signal (verification, payout, approval) shows up as actionable work.

### 3.5 Mobile = approvals-on-the-go, **not** a domain-tab mirror (challenges the vendor 5-tab model)
The vendor redesign's 5 thumb-tabs fit a sales surface used on a phone. **Admin is desktop-first**, so the mobile question isn't "which domains get tabs" — it's "what can an admin usefully *finish* on a phone?" The answer is **single-tap approvals**: approve a clean verification, confirm a high-confidence payment match, give a second sign-off, resolve a dispute step. So mobile is **4 tabs** (Home / Work / Directory / More): Home is the glance with two-admin approvals pinned at top; **Work is a quick-approve list** that carries the on-the-go subset and *gracefully degrades* the heavy parts ("2 low-confidence matches — reconcile on desktop", "open full 12-doc review on desktop") rather than cramming bulk master-detail onto 390px; Directory is search-first; More is the grouped accordion. Dense queues, bulk actions and analytics stay desktop-only by design.

### 3.6 Permission scoping: handler lanes + tier-aware locks (forward design — RBAC not built)
The nav is *shaped* for the spec's §4.3 handler roles and §10a/§10b tiers, even though enforcement is a later build:
- **Handler lanes** — the Work queue-rail's lane filter (Trust / Money / Recourse / Approvals / Support) is the seam. When RBAC ships, a handler's lane auto-scopes their Home + Work to only their queues (the prototype demos this: switching to "Handler · scoped" filters Work to the Trust lane and dims the config groups). Until then it's a manual filter everyone shares.
- **Tier-aware locks** — sensitive surfaces show a **🔒 two-admin** marker instead of hiding (Payment methods, Brand & theme, Feature flags, Admin/Internal/Team-Pool provisioning, mid-quarter price/frequency changes). Mirrors the vendor "show the lock, sell the path" pattern — here the lock communicates the four-eyes gate. The topbar badge already shows the admin's tier (🟣 Internal / 🟢 Team Pool / Admin).

### 3.7 Dual-face surfaces — one feature, two nav homes
Three surfaces have both a *queue* face (act-now → Work) and an *editor/config* face (tune → a group). Keep them split, clearly:
- **Taxonomy** — *Requests* queue (review-in-place: map / accept / keep-private / reject) in **Work**; the drag card-tree *editor* in **Platform**.
- **Payments** — *Payment options* (screen vendor bank/QR/link destinations) is a moderation queue in **Work**; *Payment methods* (Setnayan's own receiving accounts, 🔒) is config in **Money & Catalog**.
- **Reviews** — *Appeals* queue (self-review gate) in **Work**; review content/moderation reachable from a vendor's Directory record.

### 3.8 Drift fixes folded in
`/admin/notifications` gets a real nav home (Platform → Notifications) — no more orphan. `/admin/token-purchases` (Token sales) is added to the mobile match arrays (today it lights up no mobile tab). Both are one-line nav-array edits when this lands.

---

## 4. Desktop affordances ("more at once")

- **Persistent collapsible sidebar** with the 3-item spine pinned and the 3 tune-groups expandable; **inline live counts** on Work and each queue.
- A **top utility bar** keeping global search + tier badge + notifications bell always in view.
- **Master-detail Work**: a queue-rail (12 queues, grouped by lane, with counts) + a list + work-in-place — no drilling between separate pages to clear a queue.
- **Lane filters + bulk** on Work (select-many, filter by age/value) and **fuzzy-match suggestions** on Payments (the 4-tier matcher from 0034 §`match_inbox_to_order`, shown with a confidence bar so the admin approves a suggestion rather than hunting).
- **Cross-queue context** — the recent-admin-activity feed on Home so operators see what teammates just did (avoids two admins working the same row).

## 5. Mobile (compact)

- **4-tab spine** in the thumb zone (Home / Work / Directory / More); Work badge shows the total pending.
- **Home = tappable signal cards** with two-admin approvals pinned first (the highest-value phone action).
- **Work = quick-approve** — single-tap Approve/Reject/Confirm on the on-the-go subset; heavy bulk + low-confidence reconciliation explicitly punt to desktop with a one-line note (no crippled master-detail on 390px).
- **"More" is a 3-section accordion** (Insights / Money & Catalog / Platform) + search — never a flat list; desktop-best dashboards carry a small "desktop" hint.

---

## 6. What's net-new vs shipped 0023

| Net-new | Re-bucketing only (low effort) |
|---|---|
| Two-admin Approvals as a first-class Work queue + Home card (3.3) — lifts it out of Settings | The 3-spine + Insights/Money & Catalog/Platform grouping (3.1) |
| Command-center Home surfacing **all** queues + alerts + activity (3.4) | Token sales / Taxonomy requests pulled into Work (3.2) |
| Work master-detail with a queue-rail + lane filters (4) | Money group dissolved → queues to Work, config to Money & Catalog (3.1) |
| Mobile quick-approve Work + graceful desktop-punt (3.5) | Dual-face split made explicit (3.7) |
| Handler-lane scoping + tier locks as a *design seam* (3.6) — RBAC enforcement is later | Drift fixes: notifications nav home + token-sales mobile match (3.8) |

## 7. Migration & risk

**Low–moderate.** The code already uses one `NavGroup[]` source of truth that the 4 mobile landing grids consume by introspection, and group **keys are preserved across relabels** (localStorage open-state continuity — the existing `funnels`/`content` divergence proves the pattern). Most of this is re-bucketing + relabels + the two one-line drift fixes. The genuinely new build is: the **command-center Home** (assemble the remaining queue counts — the queries already exist per-queue), the **Work master-detail shell** (a rail + the existing per-queue pages rendered in-pane), the **two-admin Approvals queue UI** (the `admin_approval_requests` table + four-eyes `CHECK` already exist per §4.1), and the **mobile quick-approve** subset. Handler-lane *enforcement* (RBAC) is explicitly **out of scope here** — the redesign only adds the lane filter seam so RBAC can slot in later without another nav change.

## 8. Open questions for owner sign-off

1. **Verb-based spine + dissolving "Money" (3.1)** — adopt Home / Work / Directory + Insights / Money & Catalog / Platform, and move money *queues* into Work while money *config* goes to Money & Catalog? (Biggest structural change.)
2. **Spine + group names** — Home · Work · Directory; Insights / Money & Catalog / Platform. OK to adopt these labels? (Or keep "Queues" instead of "Work" for continuity — keys stay stable either way.)
3. **Two-admin Approvals first-class (3.3)** — promote it to a Work queue + Home card now (it's spec-intended but code-buried)?
4. **Mobile = approvals-on-the-go, 4 tabs, heavy→desktop (3.5)** — confirm we break from the vendor 5-tab thumb model and build Work-mobile as a quick-approve subset rather than full master-detail?
5. **Permission scoping (3.6)** — build the **handler-lane filter** seam now (design-only, everyone shares it) and defer **RBAC enforcement** + per-handler auto-scoping to a later sprint? Confirm the lane→handler map (Trust→Verification Handler, Money→Payments Handler, Recourse→Disputes Handler, etc.).
6. **Build order** — ship the cheap wins first (re-bucketing + drift fixes + full command-center Home), then the deeper pieces (Work master-detail, two-admin queue UI, mobile quick-approve)?

## 9. References

- Prototype (clickable, both form factors × backlog/clear × 🟣 Internal/🟢 Team Pool/Handler): `Admin_Console_Nav_Redesign_2026-06-08.html`
- Sibling redesign (same method): `Vendor_Dashboard_Nav_Redesign_2026-06-08.md` (+ `.html`)
- Iteration: `0023_admin_console/0023_admin_console.md` (Home §3.1 · two-admin pattern §4 · handler roles §4.3 · internal/team tiers §3.5b/§10a/§10b · cross-ref entry-point table §1)
- Shipped nav code (`origin/main`): `apps/web/app/admin/_components/admin-sidebar.tsx` · `admin-bottom-nav.tsx` · `mobile-landing-grid.tsx` · `apps/web/app/admin/layout.tsx` (the flat `isAdmin` guard) · `apps/web/app/admin/page.tsx` (the current 4-card Home)
- Reconciliation matcher: 0034 §`match_inbox_to_order` (the 4-tier fuzzy matcher surfaced on the Payments queue)
- Cross-actor signals: `project_setnayan_cross_actor_signals` (the `/admin/notifications` reader this gives a nav home)

---

## Appendix A — complete surface inventory (every `/admin/*` route → new home)

Audited against `origin/main` on 2026-06-08: **53 `page.tsx` files** = **38 top-level menus** + **11 detail/child routes** + **4 mobile-nav scaffolding pages**. Every surface is accounted for — nothing is dropped, and orphan-prevention is honored (each route keeps an entry point).

### A.1 Top-level menus (38) → new home

| # | Route (`/admin/…`) | Today's group | New home | Notes |
|---|---|---|---|---|
| 1 | `` (root overview) | Home | **Home** | Becomes the full command center (§3.4) |
| 2 | `verify` | Queues | **Work** · Trust | |
| 3 | `taxonomy` | Manage | **Work** (requests) **+ Platform** (editor) | Dual-face (§3.7) |
| 4 | `payment-options` | Queues | **Work** · Trust | Screen vendor bank/QR/link destinations |
| 5 | `payments` | Queues | **Work** · Money | Order reconciliation = "manage purchases" |
| 6 | `payouts` | Money | **Work** · Money | Money out to vendors |
| 7 | `token-purchases` (Token sales) | Money | **Work** · Money | Vendor token-pack sales · was missing from mobile match arrays |
| 8 | `disputes` | Queues | **Work** · Recourse | |
| 9 | `force-majeure` | Queues | **Work** · Recourse | |
| 10 | `reviews` | Queues | **Work** · Recourse | Self-review appeals |
| 11 | `concierge-abuse` (AI abuse) | Queues | **Work** · Recourse | |
| 12 | `help` | Queues | **Work** · Support | |
| 13 | `users` | Directory | **Directory** | "Manage users" — comp/suspend/🟣Internal/🟢Team-Pool |
| 14 | `vendors` | Directory | **Directory** | "Manage vendors" — +`/edit`, +`/tokens` |
| 15 | `demo-vendors` | Directory | **Directory** | +`/inquiries` responder |
| 16 | `events` | Directory | **Directory** | |
| 17 | `venues` | Directory | **Directory** | +`/[id]`, +`/new` |
| 18 | `wedding-types` | Directory | **Platform** | Per-religion launch gate (governance) — **moved** per A.4 |
| 19 | `wedding-traditions` | Directory | **Platform** | Editable "what to expect" content — **moved** per A.4 |
| 20 | `pricing` | Money | **Money & Catalog** | "Edit values" — SKU prices |
| 21 | `addons` | Money | **Money & Catalog** | "Edit values" |
| 22 | `discount-codes` | Money | **Money & Catalog** | "Edit values" · +`/new`, +`/[id]/edit` |
| 23 | `token-bands` | Money | **Money & Catalog** | "Edit values" — ₱100/200/300 burn bands |
| 24 | `budget-planner` | Money | **Money & Catalog** | "Edit values" — benchmark prices |
| 25 | `receipts` | Money | **Money & Catalog** | Purchase records |
| 26 | `growth` | Insights | **Insights** | |
| 27 | `funnels` | Insights | **Insights** | |
| 28 | `operations-hiring` | Insights | **Insights** | |
| 29 | `telemetry` | Insights | **Insights** | |
| 30 | `connection-logs` | Insights | **Insights** | |
| 31 | `offline` | Insights | **Insights** | |
| 32 | `settings` | Manage | **Platform** | Shipped content is **thin** — see A.5 |
| 33 | `website` | Manage | **Platform** | |
| 34 | `ads` | Manage | **Platform** | |
| 35 | `brain` (AI brain) | Manage | **Platform** | |
| 36 | `moodboard-library` | Manage | **Platform** | |
| 37 | `songs` | Manage | **Platform** | |
| 38 | `notifications` | **(none — orphan)** | **Platform** | Cross-actor reader · drift fixed (§3.8) |

### A.2 Detail / child routes (11) → stay under their parent

`vendors/[id]/edit` · `vendors/[id]/tokens` *(manage a vendor's token wallet — reachable from the vendor record **and** linked from each Token-sales queue row, per A.4)* · `venues/[id]` · `venues/new` · `discount-codes/[id]/edit` · `discount-codes/new` · `force-majeure/[flagId]` · `demo-vendors/inquiries` · `demo-vendors/inquiries/[threadId]` · `settings/payment-methods` *(also a nav item in **Money & Catalog** 🔒)* · `settings/demo-mode` *(also a nav item "Demo mode" in **Platform**)*.

### A.3 Mobile-nav scaffolding (4) — not feature surfaces

`queues` + `money` landing pages **retired** (their queues fold into Work); `directory` + `more` landings **kept**; new `work` landing **added**. (These exist only to back the mobile bottom-tabs.)

### A.4 Net-new + judgment calls (need sign-off)

- **`/admin/approvals` — net-new route + UI.** The two-admin approval **reading/approval surface does not exist anywhere** — requests are *written* from `users/actions.ts` but no page lets a second admin see and decide them (§3.3, A.5). It needs its own page to become the first-class Work surface + Home card. The `admin_approval_requests` table + four-eyes `CHECK` already exist (§4.1) — only the UI is missing.
- ~~**`vendors/[id]/tokens`** — keep inside the vendor record, or also surface under the Token sales queue?~~ **RESOLVED 2026-06-08 (owner "let's do it"):** surface in **both** — it stays on the vendor record (Directory) **and** every Token-sales queue row gets a "Wallet" link to it, so an admin confirming a pack purchase can jump straight to adjust the balance / read the ledger.
- ~~**`wedding-types` + `wedding-traditions`** — keep in Directory, or move both to Platform?~~ **RESOLVED 2026-06-08 (owner "let's do it"):** **moved to Platform** — they're *governance* (per-religion launch toggle) + *content* (editable guide), i.e. "tune", not "look up". Directory is now pure record-lookup (Users · Vendors · Events · Venues · Demo vendors); Platform absorbs the two wedding-* surfaces.
- **`/admin/promoted-events` (spec surface #29) — forward / unbuilt.** Spec'd 2026-06-03 · V1.6 · **no route on `origin/main`.** Compile promoted fairs/events + "Generate mass schedule" broadcast into customers' Home. When built, it belongs in **Platform** (a marketing/ops broadcast surface) with its blast action two-admin gated. Listed here so the map is complete against the spec too.

### A.5 Spec-vs-code gap inside "Settings" (accuracy correction)

The 0023 spec (§3.5b/§3.5e/§3.5f/§3.7) describes `/admin/settings` as a rich hub — brand-mark & theme, feature-flag kill-switches, admin provisioning, internal-account (§10a 🟣) + team-pool (§10b 🟢) management, payment-options policy matrix, fee config, and the two-admin approval queue. **On `origin/main`, the shipped settings page contains only three things:** (1) **BIR / tax identity** (Business name · TIN · address · email · default VAT %), (2) a **Payment methods** link card → `/admin/settings/payment-methods`, and (3) a **Sentry prod smoke test** button. A code scan finds **no** `feature_flag`, `active_theme`, `brand_config`, `team_shared`, or two-admin *reading* UI anywhere under `app/admin`.

What this means for the proposal:

- The **Platform → Settings** entry is largely a **future hub**, not a dense shipped surface. Don't show it (or the prototype) as if feature flags / brand-theme / policy matrices already exist — they're **spec'd-but-unbuilt** and become net-new when built.
- **Internal-account / Team-Pool management is done via the Users record** (flag actions in `users/actions.ts`), *not* a Settings tab as the spec's §3.5b wording implies — so it correctly lives in **Directory → Users**, with the *add-with-two-admin* flow still partial.
- This **strengthens §3.3**: the two-admin loop isn't "buried in Settings," it's **unbuilt** — promoting it to a first-class Work queue is the right and necessary call, not just a re-bucket.
