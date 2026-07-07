# Entity Map & Hardcode Audit — 2026-07-04

> **Provenance:** Generated 2026-07-04 by a 28-agent audit of `origin/main`: relations reader + hardcode finder + card-surfaces reader, then one adversarial verifier per hardcode claim (24 filed → only confirmed violations kept), merged by a synthesizer. Companion docs: Onboarding_Map_2026-07-04.md · Data_Flow_Map_2026-07-04.md (in progress).


Read-only audit of `origin/main` (worktree `/Users/icecasasola/.claude/worktrees/entity-map`). Three inputs merged: the DB relations map, the card-surfaces inventory, and the adversarially-verified hardcode claims.

---

## 1. The entity graph (as-built)

### Entities

| Entity | Table | Keys | Plain English |
|---|---|---|---|
| User | `public.users` | bigserial PK · `user_id` UUID → auth.users · `S89U-` | One person, one login. ⚠ Two identity spines: some tables FK `users(user_id)`, others straight to `auth.users(id)`. |
| Event | `public.events` | `event_id` UUID join key · `S89E-` | The wedding/event hub. **No owner column** — ownership is derived from `event_members` couple rows. |
| EventMember | `public.event_members` | UNIQUE(event, user) · member_type couple/guest/vendor/coordinator | Who's on an event, in what role. ⚠ Its `vendor_id` column has **no FK** — dead forward-compat column, never wired. |
| Guest | `public.guests` | `S89G-` · personal `qr_token` · event FK | A guest row (no user_id — the person link lives in claims/membership). Plus-one is a self-referencing guest row. |
| Household | `public.households` | event-scoped | Guest grouping; guests point at it SET NULL. |
| GuestClaim | `public.guest_claims` | UNIQUE(event, claimer) | Name-as-answer-key + email OTP; approval stamps `event_members.guest_id` as the durable user↔guest link. |
| VendorOrg | `public.vendor_profiles` | `S89B-` · founder `user_id` nullable · `tier_state` | The canonical vendors record. NULL founder = admin-pre-staged unclaimed store. ⚠ `tier_state` is app-denormalized from subscriptions — no DB sync. |
| VendorTeamMember | `public.vendor_team_members` | UNIQUE(org, user) · role admin/agent/viewer | Org staff. ≥1-admin floor + peer-vote demotion enforced **in the DB** (trigger) — good. |
| VendorService | `public.vendor_services` | `S89S-` · org FK · `category` TEXT | A listing. ⚠ `category` is bare text, **no FK to taxonomy**. |
| VendorServiceAttributes | `public.vendor_service_attributes` | PK(org, canonical_service) | ⚠ Attributes attach to org+canonical key, not to the service row — the card↔attributes join is code-only. |
| Taxonomy | `service_categories` + 3 canonical tables | tree via parent_id self-FK | ⚠ `canonical_service_taxonomy` ↔ `canonical_service_schemas` share a key string with **no FK between them**. |
| VendorSubscription | `public.vendor_subscriptions` (+ billing catalog) | vendor FK · `sku_code` TEXT | Apply-then-pay tier purchases. ⚠ `sku_code` has no FK to the billing catalog; `reviewed_by` un-FK'd. |
| TokenWallet | `vendor_wallets` + member wallets + vouchers/ledgers | store wallet PK = vendor_id | Two-tier (store vouchers + personal purchased). ⚠ The whole v2 token subsystem is **FK-less on vendor_id**. |
| Order | `public.orders` (+ payments/ledger/refunds/receipts) | `S89O-` · user FK · event FK nullable | The payment spine (spec name `service_orders` shipped as `orders`). ⚠ `service_key` TEXT, no FK to catalog. |
| SkuCatalogActivation | `platform_retail_catalog_v2` + `event_software_activations_v2` | activations UNIQUE(event, service_code) | What `eventSkuActive` gating reads. ⚠ activations' `event_id`/`vendor_id` are un-FK'd. |
| Thread | `public.chat_threads` (+ messages/reads/interests) | UNIQUE(event, vendorOrg) | Exactly one thread per (event, vendor org). ⚠ No participants table — membership derived in RLS; `current_thread_ids()` is a **dead stub returning empty** yet still granted. |
| Booking | `public.event_vendors` (+ pools/manual/outcomes) | PK column *named* `vendor_id` (it's the booking id!) · `S89V-` | The couple↔vendor booking spine. Naming trap confirmed in migration comments. |
| UserAISubscription | `public.user_ai_subscription` | `S89A-` · user FK · `active_until` | The customer AI paywall window, tied to orders via `last_order_id`. |

### Edges (⚠ = code-only "mapping gap")

| Edge | Via | Notes |
|---|---|---|
| User ↔ Event | `event_members` M:N | RLS spine (`current_event_ids()`). |
| Event → owner | ⚠ derived (member_type='couple') | Intentional, but invisible to any FK-based tool. |
| Event → Guest / Household / JoinToken | real FKs | Clean. Join token is 1:1 per event. |
| Guest → Guest (plus-one) | self-FK | Plus-one is a full row pointing at its inviter. |
| User → Guest | `guest_claims` → `event_members.guest_id` | Two-step claim; durable link materialized on approval. |
| User ↔ VendorOrg | founder FK + `vendor_team_members` M:N | Governance in DB — the good pattern. |
| VendorService → Taxonomy | ⚠ `category` TEXT, no FK | Contrast: `event_vendors.category_key` **did** get a real FK. |
| VendorOrg → Attributes | ⚠ keyed to org+canonical, not the service row | Card↔attributes join lives in code. |
| Taxonomy internal | ⚠ canonical tables code-joined | Shared key string, no FK. |
| VendorOrg → Subscription | FK, but ⚠ sku_code code-mapped + ⚠ tier_state app-synced | Two drift channels on one edge. |
| VendorOrg → store wallet | ⚠ no FK anywhere in v2 token tables | Personal member wallets DO have FKs (newer, better). |
| VendorOrg ↔ Event (unlock) | `vendor_event_unlocks` UNIQUE pair | Burn-to-answer, RPC-gated. Clean. |
| User/Event → Order | real FKs | Orders can be event-less (account-level AI passes). |
| Order → SKU | ⚠ `service_key` TEXT vs. admin-managed catalog | Strings can drift from order history. |
| Event → Activation | ⚠ event_id/vendor_id un-FK'd | This is the paid-gating table — highest-value FK gap. |
| Thread ↔ participants | ⚠ no table; derived in RLS; dead stub function | Works, but un-introspectable. |
| Booking → VendorOrg | FK SET NULL (nullable = off-platform vendor) | Eventually-consistent (backfill history exists). |
| Booking → services | FK + ⚠ un-FK'd UUID[] for multi-service asks | Array integrity is app-enforced. |
| Booking capacity | pool bookings FKs + ⚠ pool_categories.category_key TEXT | |
| Thread → outcome | `inquiry_outcomes` CHECK-one-present | Keyed to thread/proposal, not booking. |
| EventMember → VendorOrg | ⚠ dead `vendor_id` column | Vendor presence really flows via threads + bookings. |

**Read of the graph:** the people spine (users–events–members–guests–claims) and the booking spine are solid. The systematic weakness is every **string-keyed edge into a catalog** (taxonomy category, SKU codes, service_key) and the **v2 token subsystem's missing FKs**. Those are exactly where the hardcode audit found the real violations.

---

## 2. Verified hardcode inventory

Honesty note first: of 24 claims filed, verifiers **confirmed 6 violations, reclassified or rejected the rest**. Notable false alarms: `VENDOR_PICK_TASK_CANONICAL_SERVICES` is dead code (sole source of nothing); `PLAN_GROUPS` claimed as a rogue duplicate is actually a DB-co-evolving keyspace (26 ids, all seeded in `budget_leaf_benchmarks`); `WEDDING_FAITH_KEYS` and `LAUNCH_PROMO_*` claimed as keyspaces are actually healthy/dead fallback mirrors; the onboarding peso value-cards are owner-locked marketing copy, not prices; and `SKU_CATALOG`'s claimed "sole source of pricing" was refuted — the charge path never reads it.

### VIOLATIONS (fix these)

| # | Sev | What | Where | Safe migration path |
|---|---|---|---|---|
| 1 | **Medium** | Verification fees ₱1,500/₱2,500 baked into inserts + labels — and drift **already happened**: the 20260702 migration made verification free, code still stamps old fees | `apps/web/lib/vendor-verification.ts` (3 insert sites, 4 UI sites) | Resolve fee from `service_catalog` at draft-insert (inactive/missing → ₱0); build labels from the lookup. Keep the CHECK-bound `APPLICATION_TYPES` keys in code. **Owner flag: renewals should now stamp ₱0.** |
| 2 | **Medium** | Bundle composition is a manually-synced **triple** hardcode (app const ×2 + hardcoded VALUES in DB fn `bundles_granting_sku()`); drift already denied Papic buyers for ~a month (#2269) | `apps/web/lib/entitlements.ts` `BUNDLE_CHILD_SKUS` (+ onboarding-pricing.ts + DB fn) | New `platform_package_children` table (FKs to both catalogs) seeded from the map; rewrite the DB fn to SELECT from it; app reads DB-first, const becomes the graceful-degrade fallback. |
| 3 | Low | `TIER_CAPS` ~25 entitlement fields are code-sole-source, with token amounts **also** mirrored as literals in SQL RPCs; one cap-drift bug already documented in-file | `apps/web/lib/vendor-tier-caps.ts` (prices are fine — DB-first) | Add `vendor_tier_caps` table keyed on the `vendor_tier_state` enum; same migration repoints the SQL literal mirrors. Boolean gating helpers stay in code. |
| 4 | Low | `LEAF_CANONICAL_SERVICES` is the sole leaf→canonical crosswalk (no DB join table exists); note it **deliberately** diverges from the dead wizard map — do not naively dedupe | `apps/web/lib/budget-allocation-data.ts:27-48` | Add admin-editable `canonical_services TEXT[]` to `budget_leaf_benchmarks`, DB-first read, const as fallback. |
| 5 | Low | Supplies marketplace renders 100% from a 314-line static const with pre-pivot prices; the DB resolver (`resolveSuppliesPricing`) exists but has **zero call sites** | `.../studio/supplies-marketplace/_data/products.ts` | Execute the already-planned 0018 PR 3b **only after** supplier SKUs are seeded (none exist — a swap today blanks the marketplace); map kebab-case keys → DB snake_case CHECKs. Checkout is hard-disabled, so no money risk today. |
| 6 | Low | Two hardcoded centavo prices rendered on the site-editor's "Coming soon" card from the otherwise-dead `SKU_CATALOG` | `apps/web/lib/sku-catalog.ts` via `site-editor.tsx:652-653` | Pass server-fetched `platform_retail_catalog_v2` prices into the ProCard prop; then delete the dead SKU_CATALOG/RETIRED/promo machinery (keep `formatCentavosPhp` as a small util). Display-only, no billing impact. |

### LOCK-STEP KEY SPACES (C class — code and DB must co-evolve; correct pattern, just know the pairs)

- `PLAN_GROUPS` (26 ids) ↔ `budget_leaf_benchmarks` PK rows + `event_vendors.hard_single_group` GENERATED column + planning_deadlines seeds — any group change is a migration regardless. Optional hardening: FK the three free-TEXT `plan_group_id` sink tables to `budget_leaf_benchmarks`.
- `VENDOR_CATEGORIES` (30 keys) ↔ `vendor_category` Postgres enum — labels already DB-first via `vendor-category-taxonomy.ts`.
- `CEREMONY_TYPE_OPTIONS` / `FAITH_REGISTRY` / `ALLOWED_CEREMONY_VALUES` ↔ five ceremony_type CHECKs + `wedding_type_launch_status` + `faith_vocab` (both already DB-first). **Side-bug found:** the dashboard modal offers 18 faiths but the server action allows only 10 — the 8 worldwide-expansion faiths are rejected server-side (`app/dashboard/[eventId]/actions.ts:325`).
- Admin venues `CEREMONY_TYPES`/`VENUE_TYPES` ↔ `venue_directory_type` enum (deliberate UI subset; reception rows can't round-trip the form — scoping gap, not hardcode).
- `DOCUMENT_META` paperwork registry ↔ `event_paperwork.document_type` CHECK (migration itself documents "content lives in code").
- `WEDDING_ROLE_SET` packs ↔ `guest_role` enum + singleton unique indexes; selection already DB-first via `event_type_profiles.role_set_key`.
- `member_type` TS union ↔ base-migration enum + ~10 RLS policies.
- `sku-activation.ts` `EXACT_HOOKS` ↔ catalog `service_code` PKs (behavior registry, not data; even reads its price DB-first).
- `ADD_ONS` registry ↔ `platform_retail_catalog_v2` PKs — verifier downgraded this from violation to keyspace: it's a presentation registry (icons, posters, routes) the DB can't hold; prices already DB-first.

### HEALTHY FALLBACKS (A class — the house DB-first + const-fallback pattern)

- `WEDDING_TRADITIONS_GUIDE` — DB-first from `wedding_tradition_items`; **staleness risk:** run the admin "Load starter content" seed in prod so all 17 religions have rows.
- `SETNAYAN_AI_*_FALLBACK_PHP` (499/799) — catalog-authoritative; add a test pinning fallbacks to seeded values so admin reprices don't silently drift.
- `EVENT_TYPES_FALLBACK` — DB-first from `event_type_vocab`; re-sync the fallback roster to the current seed occasionally.
- `WEDDING_FAITH_KEYS` tuple — fallback + compile-time type anchor only (`faith_vocab` is live source).
- `LAUNCH_PROMO_*` — an **orphaned dead mirror** (DB column serves every live reader); delete with item 6 above.

---

## 3. One card grammar, four cards

Every entity card gets the same four zones, so the whole platform reads as one system:

1. **Identity header** — avatar/logo/monogram tile · name · `S89*-` mono public id · type pill.
2. **Status band** — the entity's lifecycle in one pill row (never free text).
3. **Connections rail** — chips for each real edge from § 1, each tappable to the related card. Where the edge is a ⚠ mapping gap, the rail is where the gap becomes user-visible — the card grammar doubles as the FK-hardening test.
4. **Actions row** — role-scoped verbs, same placement everywhere.

### User card
*Evolves from:* the admin Users table row (`app/admin/users/page.tsx:~322`) — it already has identity (email + name), type pill, public_id, and flag chips; it just needs the rail.
- **Identity:** initials avatar · display name · email · `S89U-` · account-type pill.
- **Status:** Internal/Team flags · suspended state · **AI window chip** (`user_ai_subscription.active_until` + source paid/comp/team_pool).
- **Connections:** Events (from `event_members`, with member_type per chip) · Vendor orgs (from `vendor_team_members`, role shown) · Orders count · Guest claims pending.
- **Actions:** open detail · team toggle · suspend/delete.

### Vendor card
*Evolves from:* the /explore `VendorCard` (identity ladder, badges, tier-gated name reveal) merged with the admin Vendors table (claim-link, publish state). One component, props decide public vs. admin depth.
- **Identity:** photo→logo→placeholder banner · hybrid-anonymity name resolver · `S89B-` · claimed/unclaimed state (founder `user_id` NULL = unclaimed + claim-link action).
- **Status:** `tier_state` pill — **but read the truth from `vendor_subscriptions`**, since tier_state is app-denormalized (§ 1 gap); verified/published/off-season badges.
- **Membership block:** `vendor_team_members` rows — avatar + role (admin/agent/viewer), ≥1-admin floor indicated; founder starred.
- **Subscription/token block:** active subscription (sku, status, renewal) · store wallet balance (`vendor_wallets` + FIFO vouchers) · per-member personal balances (`vendor_member_token_wallets`) · event unlocks used this week (tier cap from the future `vendor_tier_caps` table, § 2 item 3).
- **Connections:** Services (count → services manager) · Threads · Bookings (`event_vendors.linked_vendor_profile_id`) · taxonomy leaves covered.
- **Actions:** view shop · open chat · tokens · (admin) verify/edit/revoke claim link.

### Event card — the hub
*Evolves from:* the `EventSwitcher` row (monogram + name + date + primary star) for the compact form, and the vendor-side Customer Card (`vendor-dashboard/clients/[eventId]/page.tsx`) for the expanded form — that page already proves the header + pipeline + tab-rail anatomy works.
- **Identity:** EventMonogram · event name · date · event-type chip · `S89E-`.
- **Status:** lifecycle phase (pre-event/live/recap) · primary-event star · slug/go-live state.
- **Connections rail (the hub view):** **People** (couples from member rows, guest count with RSVP breakdown, coordinators) · **Vendors** (bookings by status + open threads) · **Picks** (plan-group build picks) · **Orders & activations** (`orders` + `event_software_activations_v2` = which paid features are on) · join-token QR.
- **Actions:** open dashboard · switch to · invite QR · (admin) impersonation-safe detail.

### Guest card
*Evolves from:* the mobile `GuestCard` tile + `DesktopRow` (`guest-list-multiselect.tsx`) — same data, two densities; the unified card keeps their side-tint ring, RoleChips, and GroupChipList verbatim.
- **Identity:** photo/initials avatar with side tint · name · plus-one subline (self-FK edge) · `S89G-`.
- **Status:** the **invite → RSVP → claim ladder** as a three-step strip: *Invited* (row + personal `qr_token`) → *RSVP* (pill, existing) → *Claimed* (a `guest_claims` row approved and `event_members.guest_id` stamped = a real user is attached). Claim state is the one thing no current surface shows — this card adds it.
- **Connections:** household · table/seat · roles + groups · plus-one partner · claiming user (→ User card) · tagged photos (future Papic edge).
- **Actions:** open detail · edit RSVP · show QR · remove (swipe preserved on mobile).

---

## 4. De-hardcode queue (smallest safe step first)

1. **Delete dead code** — `SKU_CATALOG`/`RETIRED_SKU_CODES`/`LAUNCH_PROMO_*` + helpers in `apps/web/lib/sku-catalog.ts`, and orphaned `VENDOR_PICK_TASK_CANONICAL_SERVICES` in `apps/web/lib/wizard-recommendations.ts:781` → no target needed; DB catalogs already serve every live reader.
2. **Site-editor prices** — `site-editor.tsx:652-653` → pass server-fetched `platform_retail_catalog_v2` prices via prop, drop `findSku`.
3. **Verification fees** — `apps/web/lib/vendor-verification.ts` → resolve from `service_catalog` at draft-insert + label build; owner sign-off that post-retirement fee = ₱0.
4. **Bundle composition** — `apps/web/lib/entitlements.ts` + DB fn → new `platform_package_children` table; `bundles_granting_sku()` reads it; const demoted to fallback.
5. **Leaf→canonical crosswalk** — `apps/web/lib/budget-allocation-data.ts` → `canonical_services TEXT[]` on `budget_leaf_benchmarks`, DB-first + fallback; keep separate from the (deleted) wizard map.
6. **Tier caps** — `apps/web/lib/vendor-tier-caps.ts` → `vendor_tier_caps` table on the tier enum; same migration repoints the SQL literal mirrors (`unlock_vendor_event`, `_apply_subscription_credit`).
7. **Supplies swap** — `_data/products.ts` → wire `resolveSuppliesPricing()` per the planned 0018 PR 3b, **gated on supplier SKU seeding** (swap-before-seed blanks the page).
8. **Hardening (no violations, cheap insurance)** — FK the three `plan_group_id` sink tables to `budget_leaf_benchmarks`; CI diff of `VENDOR_CATEGORIES` vs `pg_enum`; tests pinning AI-price fallbacks to seeds; prod-seed `wedding_tradition_items`; fix the 18-vs-10 ceremony-type allow-list bug in `app/dashboard/[eventId]/actions.ts:325`.

Separately queued under schema (from § 1, not hardcodes): FKs for `event_software_activations_v2.event_id/vendor_id` and the v2 token tables' `vendor_id`; drop dead `event_members.vendor_id`; retire the dead `current_thread_ids()` stub.