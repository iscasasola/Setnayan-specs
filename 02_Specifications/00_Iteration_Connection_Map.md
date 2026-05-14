# 00 — Setnayan Iteration Connection Map

> **Purpose.** A single source of truth for how the 12 V1 iteration folders (`0001` … `0012`) link together. Use this after each iteration is built to verify the contracts it publishes are consumed correctly downstream, and that no iteration secretly reaches forward to a higher-numbered sibling.
>
> **Sequencing rule (from CLAUDE.md decision log, 2026-05-08).** Each iteration `NNNN` may only depend on iterations `< NNNN`. Forward references must be reframed as "this iteration provides X; downstream iterations consume X." Backward dependencies (a lower iteration importing a higher one) are bugs.
>
> **How to use this file.** Three reading modes:
> 1. **Building an iteration?** Jump to its section under "Per-iteration contracts" — the *Consumes* list tells you what must already exist.
> 2. **Finished an iteration?** Run the matching row in the "Verification checklist" section and tick off the contracts it just published.
> 3. **Suspect a sequencing violation?** Search the "Known sequencing rot" section first, then the per-iteration *Cross-references* line.

---

## 1. Iteration roster

`Status` = spec drafting state. `Built` reflects what is shipped to code today (✅ shipped, ⚠ partial, blank unbuilt). Update Built as each iteration's code lands; see CLAUDE.md "Implementation log" for the timeline.

| # | Folder | Status | Built | One-liner |
|---|---|---|---|---|
| **0013** | `0013_platform_stack_and_sync/` | **drafted 2026-05-09 · BUILD FIRST (Sprint 0)** | ⚠ partial | **Platform Stack & Sync Setup — Vercel (Next.js host) + Supabase (Postgres/Auth/Realtime/Storage/Edge Fns) + Cloudflare R2 (large media) + GitHub (CI/CD). User Setup Checklist + Claude Code Implementation Guide + 15 Integration Tests. Foundation infrastructure that 0000–0012 all run on.** |
| **0000** | `0000_app_shell_and_navigation/` | **drafted 2026-05-09** | ⚠ Phase 1 | **App shell foundation — universal Setnayan account, login, event picker, primary event auto-jump, event QR + scan-to-join flow with role picker, four bottom-nav tabs (Guest List / Vendors / Schedule / In-App Services), event-scoped URL pattern, services launcher, unified Schedule view** |
| 0001 | `0001_creating_guest_list/` | drafted | ✅ | Guest list, household model, role taxonomy, `guests.qr_token`, base `events` table |
| 0002 | `0002_qr_invitation_system/` | drafted | ✅ v2 | Personal invitation site at `setnayan.com/[event-slug]?invite=…`, `setnayan://[entity]/[id]?token=…` URI scheme, `scan_events`, `events.palette_finalized_at` |
| 0003 | `0003_token_wallet_and_packs/` | drafted | ⚠ schema | Token wallet, pack purchase, `service_catalog`, `create_service_order(service_key, customer_id, amount_php)` primitive, formatter, refund |
| 0004 | `0004_invitation_widgets/` | drafted | | 11 widgets (Basic / Pro tier), `invitation_widgets`, palette-lock cascade, Hero Monogram editor, `pro_*` service rows |
| 0005 | `0005_led_background_maker/` | drafted | | 10 Lottie templates, 8K/4K/1080p MP4 renders, hosted live URL, R2 delivery |
| 0006 | `0006_vendors_management/` | drafted | | 28 canonical services + custom, flexible `vendor_payment_milestones`, `vendor_crew` totals, `vendor_meetings`, R2 contracts |
| 0007 | `0007_budget_expenses/` | drafted | | 3-line view per vendor, payment proofs, `.ics` calendar export with stable VEVENT UIDs, wallet read-through |
| 0008 | `0008_seating_chart_editor/` | drafted | | 13-entry table catalog, free-placed stage, role-tier auto-fill, table QR minted at Publish, print pack |
| 0009 | `0009_photo_delivery/` | drafted | | Google Drive OAuth, `photo_delivery_jobs`, manifest CSV, redeliver, Cloudflare Queues worker |
| 0010 | `0010_mood_board/` | drafted | | 20 palette templates, Setnayan Guide rule engine (7 categories), color name library, image extraction, dedup |
| 0011 | `0011_panood/` | drafted (re-revised 2026-05-09) | | Base + add-ons apparatus pricing — Base ₱2,500 (3 cams × 3 hrs) + camera/hour add-ons (₱1,000 each, +1 cam multi-purchase max +2, +1 hr unlimited) + service add-ons (Custom Monogram ₱2,000, Broadcast Style Pack ₱3,000, AI Video Highlight ₱2,000/60s, AI Edited Highlight ₱5,000/3-min). **YouTube as sole delivery surface**, `custom_monogram_pack` → `event.custom_monogram_unlocked` (consumed by 0012) |
| 0012 | `0012_papic/` | drafted | ⚠ webapp slice | Native iOS/Android, rear-only, gesture shutter, QR tagging fan-out, Personal Reels, monogram pack consumer |

> 0013 (`0013_v1_1_polish/`) is queued for V1.1 and out of scope for this connection map.

---

## 2. Dependency graph (linear view)

Read each row as **`X ← {iterations whose contracts X consumes}`**. Anything to the right of the arrow MUST be drafted (and merged) before X can be implemented.

```
0013 ←  ∅                                         (Sprint 0 — platform infra: Vercel + Supabase + R2 + GitHub)
0000 ←  0013                                      (app shell, runs on the platform 0013 sets up)
0001 ←  0013, 0000
0002 ←  0013, 0000, 0001
0003 ←  0013, 0000, 0001, 0002 (non-blocking)
0004 ←  0013, 0000, 0001, 0002, 0003
0005 ←  0013, 0000, 0001, 0002, 0004
0006 ←  0013, 0000, 0001                          (deliberately NOT 0003)
0007 ←  0013, 0000, 0001, 0003 (read-only), 0006
0008 ←  0013, 0000, 0001, 0002
0009 ←  0013, 0000, 0001, 0002 (photos_released_at flag)
0010 ←  0013, 0000, 0001, 0006 (vendor context, V1 non-blocking)
0011 ←  0013, 0000, 0001, 0003
0012 ←  0013, 0000, 0001, 0002, 0003, 0008, 0011
```

Build order is **0013 first**, then 0000, then the remaining iterations in the order the dependency graph allows. Iteration numbering and build order disagree only here — every other dependency follows the natural number order.

Every iteration consumes 0000 because the shell is what makes its surface reachable from inside the app.

### Visual cluster groups

- **Foundation (0001–0003).** Without these, nothing else can ship: guest model + QR system + paid-services spine.
- **Couple-facing planning surfaces (0004, 0006, 0007, 0008, 0010).** Independent of each other except where flagged; can be implemented in any order once the foundation is in place.
- **Asset producers (0005, 0009).** Pure delivery / output iterations. They emit files but no other iteration depends on them.
- **Event-day capture (0011, 0012).** Both register or consume the shared **Custom Monogram Pack** flag. 0011 publishes the flag; 0012 consumes it.

---

## 3. Shared contracts catalogue

These are the cross-cutting primitives that more than one iteration touches. Verify each one is named exactly as documented here in every consuming iteration.

### 3.0 App shell URL pattern + bottom-nav placement (defined in 0000)

Every iteration's user-facing surface lives under the event-scoped URL pattern and is routed by 0000's bottom-nav. The four tabs and what each contains:

| Tab | Sub-pages → URL → Owning iteration |
|---|---|
| **Guest List** | Guests → `/dashboard/[event-id]/guests` → 0001 · Invitation Site → `/dashboard/[event-id]/invitation` → 0002 + 0004 · Seating → `/dashboard/[event-id]/seating` → 0008 |
| **Vendors** | Vendor List → `/dashboard/[event-id]/vendors` → 0006 · Budget → `/dashboard/[event-id]/budget` → 0007 |
| **Schedule** | Unified calendar → `/dashboard/[event-id]/schedule` → 0000 (pulls from 0004, 0006, 0007) |
| **In-App Services** | Launcher grid → `/dashboard/[event-id]/services` → 0000 · Wallet → `.../services/wallet` → 0003 · Mood Board → `.../services/mood-board` → 0010 · LED → `.../services/led` → 0005 · Photo Delivery → `.../services/photo-delivery` → 0009 · Panood → `.../services/panood` → 0011 · Papic → `.../services/papic` → 0012 |

**Auto-jump rule (after sign-in):** 0 events → welcome screen; 1 active event → jump into that event's Guest List tab; 2+ active events → show the event picker. `events.is_primary` is a UI sort hint only — it doesn't change jump logic.

**Verification.** When a new iteration ships, it must (a) route under `/dashboard/[event-id]/[section]`, (b) declare its bottom-nav tab in its `.md` spec, and (c) register a launcher card in 0000's manifest if it's an In-App Service.

### 3.1 `setnayan://` URI scheme (defined in 0002)

```
setnayan://[entity_type]/[entity_id]?token=[token]
```

| entity_type | minted by | consumed by |
|---|---|---|
| `guest` | 0001 (`guests.qr_token`) | 0002, 0008 (place cards), 0012 (peer tagging) |
| `table` | 0008 (`tables.qr_token`, only on Publish) | 0012 (table-tag fan-out) |
| `event` | reserved | — |
| `vendor_service` | reserved (Din Phase 3) | — |
| `coordinator_checkin` | reserved (deferred V1) | — |

HTTPS fallback printed alongside every QR: `https://setnayan.com/[event-slug]?invite=[token]`.

### 3.2 `service_catalog` rows (defined in 0003)

Every paid V1 surface registers exactly one row in `service_catalog`. PHP centavos is source of truth; tokens are render-time display via `formatPrice()`.

| service_key | php_centavos | iteration_origin |
|---|---|---|
| `pro_hero_monogram` | 10000 (₱100) | 0004 |
| `pro_our_story` | 10000 | 0004 |
| `pro_schedule` | 10000 | 0004 |
| `pro_bundle_widgets` | 20000 (₱200) | 0004 |
| `papic_3_seat` | 150000 (₱1,500) | 0012 |
| `papic_5_seat` | 250000 (₱2,500) | 0012 |
| `papic_template` | 20000 (₱200, multi-purchase) | 0012 |
| `panood_base` | 250000 (₱2,500) | 0011 |
| `panood_camera_addon` | 100000 (₱1,000, multi-purchase up to 2) | 0011 |
| `panood_hour_addon` | 100000 (₱1,000, multi-purchase unlimited) | 0011 |
| `custom_monogram_pack` | 200000 (₱2,000) | 0011 |
| `broadcast_style_pack` | 300000 (₱3,000) | 0011 |
| `ai_video_highlight` | 200000 (₱2,000, multi-purchase) | 0011 |
| `ai_edited_highlight` | 500000 (₱5,000, multi-purchase) | 0011 |

**Verification.** When a paid surface is built, the test suite must `SELECT * FROM service_catalog WHERE service_key = '…'` and confirm the row exists with the price the spec quotes. The price should never be hard-coded in product code — always read via `service_catalog`.

### 3.3 `spend(walletId, serviceKey, refId)` primitive (defined in 0003)

Called by every paid iteration. Returns `{ ok: true, txnId }` or `{ ok: false, reason: 'insufficient_balance' }`.

Refunds are positive `token_transactions` rows with `reason = 'refund'`. Iterations 0004, 0011, 0012 are V1 callers.

### 3.4 Lock-palette mechanism (events.palette_finalized_at)

| owner | role |
|---|---|
| 0002 | introduces the column on `events` |
| 0004 | sets / clears via the Dress Code widget; broadcasts cascading-invalidation event |
| 0005 | reads as a gate before unlocking high-quality LED renders |

Anything that consumes a finalized palette MUST check `events.palette_finalized_at IS NOT NULL` before accepting the value as canonical.

### 3.5 Custom Monogram Pack (`event.custom_monogram_unlocked`)

| owner | role |
|---|---|
| 0011 | registers `service_key = 'custom_monogram_pack'` (₱2,000), sets `event.custom_monogram_unlocked = TRUE` on purchase, never unsets |
| 0012 | reads the flag; if true, applies couple's monogram to photo exports, Personal Reels, and gallery chrome |
| Future iterations | every new media surface must check this flag and respect it |

R2 paths:
- Uploaded: `events/{event_id}/branding/monogram.png`
- Auto-generated default: `events/{event_id}/branding/monogram_default.png`

### 3.6 R2 storage layout

Single bucket per concern. PH-region. R2 free-egress is an architectural advantage — proxying through other clouds is prohibited per CLAUDE.md.

```
guests/                                    (0002 cached QR SVGs)
  qr/{event_id}/{guest_id}.svg
events/{event_id}/branding/                (0011)
  monogram.png
  monogram_default.png
events/{event_id}/payment_proofs/          (0007)
  {payment_id}.{ext}
vendor-contracts/{event_id}/{vendor_id}/   (0006)
  {contract_id}.{ext}
led_backgrounds/{event_id}/                (0005)
  {template_id}_{config_hash}.mp4
photos/                                    (spec 10 / 0009 / 0012)
  {event_id}/{photo_id}.{ext}
music_catalogue/{category}/                (playbook 14)
  {filename}.mp3
template_library/{feel_category}/          (playbook 14)
  TPL_{nnn}.json
```

Retention: hot 90 days → IA cold 5 years for paparazzi photos. **Do not auto-delete inside 5 years** (CLAUDE.md gotcha #2).

### 3.7 Tag-cap and fan-out (defined in spec 10, consumed by 0008 + 0012)

Combined individual + table tags **capped at 10 per photo**. When a table has more than 10 RSVP'd guests, alphabetize by RSVP'd name and truncate. Surface a warning to the paparazzo. Implemented in 0012's tag pipeline using `tables` from 0008.

### 3.8 30-day post-download compression rule (CLAUDE.md, 2026-05-09)

When a couple or guest downloads originals (single photo or full album), the source file in R2 auto-compresses 30 days later. Applies across 0009, 0010, 0012, and any future photo-bearing iteration. Does NOT apply to non-downloaded files (those follow standard tier-retention).

### 3.9 In-UI notifications only (no push/SMS/email in V1)

Every iteration that surfaces a deadline, reminder, or arrival notice does so inside the dashboard / landing page only. Push (FCM/APNs), SMS, and email fallback all defer to a later notifications iteration. Specs and mockups must not promise multi-channel delivery in V1.

---

## 4. Per-iteration contracts

Each section is a contract sheet: what the iteration **provides** to downstream iterations, what it **consumes** from upstream, and the most important cross-references. Keep this in sync with the iteration's own spec — if they ever disagree, the spec is the source of truth and this file is the bug.

### 0013 — Platform Stack & Sync Setup (Sprint 0)

**Provides** (the foundation everything else runs on)
- Vercel project deployed at `https://setnayan.com` (Next.js auto-deploy from GitHub main).
- Supabase project (Postgres + Auth + Realtime + Storage + Edge Functions) hosted in `ap-southeast-1` (Singapore).
- Cloudflare R2 buckets (`setnayan-media`, `setnayan-staging-media`, `setnayan-vendor-contracts`) with custom domain `media.setnayan.com` for free egress.
- GitHub repo + CI/CD pipelines for: web auto-deploy (Vercel), iOS TestFlight push (on tag), Android Play Console internal track push (on tag), Supabase migration auto-apply (on merge to main).
- Codebase scaffolds: Next.js + TS + Tailwind web app, iOS skeleton (Swift + SwiftUI + Supabase Swift SDK + AVFoundation), Android skeleton (Kotlin + Compose + Supabase Kotlin SDK + CameraX), macOS Tauri shell.
- Auth flow with magic-link + password (Supabase Auth + Resend for email delivery).
- Realtime sync helper (`useSupabaseSubscribe(eventId, table)`) for any iteration's components to subscribe to live data.
- RLS policies on every user-data table — default deny, explicit allow per `event_members` membership.
- R2 signed-URL Edge Function for client uploads (auth-checked).
- YouTube Data API integration: Edge Function that creates broadcasts on Setnayan's master channel with `monetization=false` and `latencyPreference=ultraLow`.
- Service catalog seeded with all V1 SKU rows (panood_*, papic_*, custom_monogram_pack, broadcast_style_pack, ai_*_highlight, pro_*).
- Sentry projects for web + iOS + Android with DSNs configured.
- Production-readiness gate: 15 integration tests in Section C must all pass before V1 features build on top.

**Consumes**
- Existing platform: domain DNS, payment provider verifications (PayMongo + Stripe), Apple Developer Program (paid + approved), Google Play Console (paid + approved), Anthropic API account, YouTube channel.

**Cross-references**
- Every iteration 0000–0012 builds on 0013. The platform stack is the foundation; iteration features layer on as logical extensions of Supabase tables + Next.js routes + Edge Functions.
- See `0013_platform_stack_and_sync.md` Sections A (User Setup Checklist), B (Claude Code Implementation Guide), C (Integration Tests) for the full step-by-step.
- Build order: 0013 ships first as Sprint 0, then 0000, then 0001–0012 follow the standard dependency graph.

### 0000 — App shell & navigation

**Provides**
- Login flow (magic-link + password) at `setnayan.com/login`.
- New `users` table (universal account: `user_id`, `email`, `phone`, `display_name`, `profile_photo_url`).
- Event picker at `setnayan.com/dashboard` with auto-jump rule (1 active event → jump in; 2+ → show picker; 0 → empty state with "create your first event").
- Profile + Settings at `setnayan.com/dashboard/profile`.
- Event QR + scan-to-join flow: `event_join_tokens` table (one per event, 32-hex, rotatable) and the `setnayan.com/join/[event-id]?token=...` flow that walks scanners through auth → membership check → role picker → linkage to the event.
- New `event_members` table (account ↔ event link): `member_type ∈ {couple, guest, vendor}`, `role` (uses 0001's 18-value taxonomy for guests; service slug for vendors), optional `guest_id`/`vendor_id` FKs, `joined_via` enum.
- Inside-event chrome (couples only) — top bar (event pill + wallet pill from 0003 + avatar) + four-tab bottom nav (mobile) / sidebar (desktop).
- Event-scoped URL pattern: `setnayan.com/dashboard/[event-id]/[section]`.
- Unified Schedule view at `setnayan.com/dashboard/[event-id]/schedule` — pulls from `vendor_meetings` (0006), `VendorLineItem.deadline_date` (0007), and `invitation_widgets` schedule widget (0004) plus `events.wedding_date` countdown.
- In-App Services launcher grid at `setnayan.com/dashboard/[event-id]/services` — shows one card per registered service with state and primary action.
- Schema additions to `events`: `is_primary BOOLEAN NOT NULL DEFAULT FALSE` (with partial unique index, one primary per couple) and `archived BOOLEAN NOT NULL DEFAULT FALSE`.
- Service registration manifest (config file, not DB) — every In-App Service iteration registers its launcher card here.

**Consumes**
- Existing platform: auth primitives (magic-link sender, password reset, session cookies).
- 0001: the `events` table this iteration extends with two columns; the `guests` table (links via `event_members.guest_id` when scanned QR matches existing record); the 18-value role taxonomy for the role picker.

**Cross-references**
- Every iteration 0001–0012 plugs into 0000's routing. Each downstream iteration must declare which bottom-nav tab it lives under and route under the event-scoped URL pattern.
- Vendor join via QR creates an `event_members` row with `member_type='vendor'` but the vendor-facing dashboard view is deferred to a future iteration (Din). V1 vendor records still couple-encoded per the original 0006 decision.

### 0001 — Guest list management

**Provides**
- Tables: `events` (couple-auth, dashboard shell mounted at `setnayan.com/dashboard/*`), `households`, `guests` with the canonical 18-value role taxonomy enum, `side`, `plus_one_*`, `guests.qr_token` (32-hex, UNIQUE), `guests.table_assignment_id` FK placeholder, `guests.photo_consent`, `guests.invited_to_blocks`.
- Base column on `events.palette` (extended later by 0002).
- Couple-auth flow + payment-modal stub (PayMongo + Stripe).

**Consumes**
- Bootstrap iteration. Only depends on existing platform primitives.

**Cross-references**
- References master specs 10 and 15 for shell context. No iteration-number forward refs.

### 0002 — QR invitation system

**Provides**
- Personal invitation site renderer at `setnayan.com/[event-slug]?invite=[token]`; couple admin at `/dashboard/qr-codes` and `/print`.
- The `setnayan://` URI scheme (5 entity types reserved; `guest` implemented).
- HTTPS fallback URL on every printed QR.
- New tables: `scan_events`, `guest_rsvp_extras`.
- Extensions to `guests` (profile photo set, plus-one confirmed, scan-tracking opt-out) and to `events` (`monogram_source`, `monogram_svg`, `monogram_uploaded_url/_format/_at`, `palette_finalized_at`, `qr_color_dark/_light`, `photos_released_at`).
- Magic-link cookie/JWT session model with 30-day-post-event expiry.

**Consumes**
- 0001: `guests.qr_token`, `guests.role`, `guests.plus_one_*`, role taxonomy.

**Cross-references**
- Forward-refs Hero Monogram editor (now 0004), Papic (now 0012), and "future iteration 0005 — Photo delivery" — see Known sequencing rot below.

### 0003 — Token wallet & pack system

**Provides** (RETIRED 2026-05-11 — see note)
- ~~Tables: `token_wallets`, `token_packs` (6 V1 tiers), `token_purchases`, `token_transactions` (ledger, reasons enum), `service_catalog` (PRIMARY KEY `service_key`).~~
- ~~Reusable React components: pack picker modal, spend confirmation modal, wallet panel, receipt page.~~
- ~~Primitives: `spend()`, refund credit (positive ledger row, `reason='refund'`), `formatPrice(php_centavos)` formatter (PHP-direct pricing, rounds to 100 tokens).~~
- ~~V1 seed `service_catalog` rows for every paid surface (see §3.2).~~

> **These primitives were retired 2026-05-11.** See `service_orders` + `service_order_payments` schema documented in 0023 + 0026 for the active apply-then-pay PHP-direct flow. References below to `token_transactions` / `token_wallets` / `spend()` are kept for historical context only — engineering should route through `service_orders` instead.

**Consumes**
- 0001: `events`, couple-auth, dashboard shell, R2, payment-modal stub.
- 0002: invitation site renderer (non-blocking).

**Cross-references**
- Names downstream services in the seed (`iteration_origin = '0004_invitation_widgets'`, `'0012'`). The schema itself does **not** reference downstream iterations by name.

### 0004 — Invitation widgets

**Provides**
- Table: `invitation_widgets` (11 widget types, tier {basic, pro}, `pro_purchased_at`, `pro_price_paid_centavos`, UNIQUE(event_id, widget_type)).
- Per-widget `config_json` Zod schemas; Hero Monogram editor with 25-frame catalog and Bride/Groom palette pulls.
- Multi-palette structure inside `dress_code.config_json` (8 ceremony role palettes + reception palette + optional reception by_role overrides).
- Sets / clears `events.palette_finalized_at` and broadcasts a cascading-invalidation event (consumed by 0005).
- Service rows registered: `pro_hero_monogram`, `pro_our_story`, `pro_schedule` (₱100), `pro_bundle_widgets` (₱200).
- `attire_references` schema (12 role-gender slots × 3 photos) — reserved for V2 stylist marketplace.

**Consumes**
- 0001: `events`, dashboard shell, R2, payment-modal stub, base `events.palette`.
- 0002: invitation site RSC tree, `qr_code` widget with `color_mode` field, `events.monogram_source/_svg/_uploaded_*`, `events.palette_finalized_at`.
- 0003: `spend()`, spend confirmation modal, pack picker, `service_catalog`, `formatPrice()`.

### 0005 — 8K LED background maker

**Provides**
- Tables: `led_background_configs` (10 templates), `led_background_renders` (status, progress, output_resolution {8k, 4k, 1080p}, output_duration_s {300, 600, 1800}, R2 output key).
- 10 Lottie templates: `filigree_bloom, capiz_shimmer, sampaguita_drift, gold_particles, ethereal_mist, bokeh_lights, watercolor_wash, slow_pulse, constellation, velvet_sweep`.
- API: `GET /led-background/{event_id}/{template_id}.mp4`; `POST /api/led-background/redeliver-to-drive`.
- Hosted live playback URL: `setnayan.com/led/{event-slug}/r/{render_id}.mp4` + `.m3u8` HLS.

**Consumes**
- 0001: `events`, dashboard shell, R2.
- 0002: `events.palette_finalized_at` lock-palette gate, `events.monogram_source`.
- 0004: Hero Monogram widget config (read-only), reception palette inside `dress_code.config_json`.

**Cross-references**
- ⚠️ Stale prose still says "iteration 0003" in places where it means 0004 — see Known sequencing rot.

### 0006 — Vendors management

**Provides**
- Tables: `vendors` (with `package_total_centavos`, status enum, `day_of_arrival_at`), `vendor_services`, `event_custom_services`, `event_service_coverage_status`, `vendor_inclusions`, `vendor_payment_milestones` (custom labels, due dates, paid status), `vendor_crew` (count × per-meal cost, `vendor_provides_meals` toggle), `vendor_meetings` with `created_by_actor` enum {couple, vendor, setnayan_staff}.
- 28-entry `canonical_services` enum.
- R2 contracts: `vendor-contracts/{event_id}/{vendor_id}/{contract_id}.{ext}`.
- Computed view `vendor_crew_meal_totals` (consumed by 0007).

**Consumes**
- 0001: `events`, dashboard shell, file-upload primitives, couple-auth.
- 0003: **explicitly NOT used** — vendor money is external. The wallet stays reserved for Setnayan-charged services.

**Cross-references**
- Forward-refs to 0007 and 0010 framed as publishing-only ("0007 consumes…", "0010 can link…"). No backward dependency.

### 0007 — Budget & expenses

**Provides**
- Tables: `VendorExpense`, `VendorLineItem` (line_type enum {package, crew_meal, transportation}, `tracked_in_calendar` toggle), `PaymentRecord` (with `proof_r2_key`, audit_log JSONB), `MiscExpense`.
- `.ics` calendar export with stable VEVENT UIDs `{event_id}-{line_item_id}@setnayan.ph` and 24h+1h VALARMs. Per-line and bulk-export modes.

**Consumes**
- 0001: couple identity / shared session.
- 0003: read-only consumer of `WalletSpend` records (Setnayan platform costs section). Registers no new wallet services.
- 0006: `vendors`, `vendor_payment_milestones`, vendor GCash/Maya QR uploads, vendor contact info, `vendor_crew_meal_totals`, `vendor_meetings`.

**Cross-references**
- Cleanly forward-sequenced. No bugs.

### 0008 — Seating chart editor

**Provides**
- Tables: `tables` (table_id, event_id, `table_type` CHECK in 13 values: `round_8/10/12, long_6/8/10, family_head_12/14/16, sweetheart_2, serpentine_6/12/18`; `capacity` bound to type; `position_x/y` 0..1000 normalized; `rotation_deg` 0–315 in 45° steps for long/serpentine only; `qr_token TEXT UNIQUE` minted at Publish only; `qr_published_at`; soft-delete), `event_floor_plan` (singleton: stage/band/dancefloor/doors/venue dimensions/alignment_lock/grid_snap toggles).
- Frontend constant `TABLE_CATALOG` (shape + capacity + size for each of the 13 types).
- Table QR URL format: `setnayan:table:{table_id}?token={qr_token}` — consumed by 0012.
- Print pack: per-table sign sheets (table QR) and per-guest place cards (guest QR from 0001).
- Auto-fill: 4-tier role rings centered on stage. Sweetheart tables excluded. Locked tables skipped. Already-placed guests never moved.

**Consumes**
- 0001: `guests` (with role, RSVP, `table_assignment_id`, profile photos, side), dashboard shell.
- 0002: QR token format/conventions, personal-QR URL scheme.

### 0009 — Photo delivery to couple's cloud

**Provides**
- `events` extensions: `photo_delivery_provider` enum, `photo_delivery_oauth_token_encrypted`, `photo_delivery_oauth_expires_at`, `photo_delivery_folder_id/_name/_account_email/_status/_progress_pct/_started_at/_completed_at/_failed_count`.
- `photos` extensions: `delivered_to_drive_at`, `drive_file_id`, `delivery_attempts`, `delivery_last_error`.
- New table: `photo_delivery_jobs`.
- Routes: `/dashboard/photo-delivery`, `/api/oauth/google/start|callback`, `/api/photo-delivery/release|status|disconnect|redeliver`.
- Drive folder template name: `Setnayan · {couple_names} · {wedding_date}`.
- Manifest CSV format on Drive.
- Cloudflare Queues background-worker pattern (reusable).

**Consumes**
- 0001: `events`, dashboard shell.
- 0002: `events.photos_released_at` flag.
- spec 10: `photos` table, R2 retention policy, 7-day review window.

### 0010 — Mood board (palettes V1)

**Provides**
- Tables: `palettes` (with `palette_type` enum {role, venue, custom}, `source_template_id`, `setnayan_guide_overridden`), `saved_palettes` (with `scope_type` and `scope_owner_id` extensible to stylist scope V2).
- Palette template manifests at `/palette_templates/{slug}.json`; `library_index.json` master index for the picker.
- 20 pre-template themes (9 style + 7 colour-led + 4 seasonal).
- Setnayan Guide rule engine — 7 rule categories: cohesion / contrast / background-vs-foreground (ΔE 10) / temperature / saturation / photography color cast / cultural defaults. Returns pass / warn / contradict with `affected_palette_ids` and 0–3 alternative-color suggestions.
- ~300-entry color name library (hex ↔ wedding-relevant name).
- Image-extraction pipeline (R2 upload + Cloudflare Workers).
- Master palette dedup view.

**Consumes**
- 0001: role taxonomy, per-role guest assignments.
- 0006: vendor records as context (V1 non-blocking; sharing is V2).

### 0011 — Live stream

**Provides**
- Service registrations in service_orders (V1 apply-then-pay): `panood_base` (₱2,500 — 1 broadcaster + 3 cameras + 3 hours), `panood_camera_addon` (₱1,000, max +2), `panood_hour_addon` (₱1,000, unlimited), `custom_monogram_pack` (₱2,000), `broadcast_style_pack` (₱3,000 — 4 modes + transitions + color presets), `ai_video_highlight` (₱2,000 per 60s), `ai_edited_highlight` (₱5,000 per 3-min).
- Free base-SKU features: highlight markers (★ button), Cast to projector (laptop HDMI for full polished composite; iPhone HDMI for raw active feed via iOS fullscreen-video routing).
- Cross-iteration: when LED Background (0005) AND Custom Monogram Pack (0011) are both owned, the 1080p LED render becomes the standby video underneath the broadcast's standby card.
- Boolean flag: `event.custom_monogram_unlocked` — set on Custom Monogram Pack purchase, never unset.
- R2 asset paths: `events/{event_id}/branding/monogram.png` (uploaded), `events/{event_id}/branding/monogram_default.png` (auto-generated).
- **YouTube as sole viewer-delivery surface.** Setnayan's master YouTube channel hosts every wedding broadcast; landing page embeds the YouTube IFrame Player. No Cloudflare Stream Player embed, no per-tier viewer cap, no Viewer Pack SKU. Broadcast created via YouTube Data API with `monetizationDetails.monetization: false` and `latencyPreference: ultraLow`.
- 4 overlay design templates × portrait/landscape = 8 layouts: Corner Bug, Bottom Band, Top-Right Sweep, Centered Lower-Third.
- Live stream tier service rows (₱4,500 / ₱7,500 / ₱5,000 / ₱9,000) and add-ons (AI Highlight ₱2,000, Custom Monogram Pack ₱2,000). Standalone Facebook Live, ceremony coverage, and crew tiers all CUT from V1.
- WebApp clients for camera operator + broadcaster, Cloudflare Stream Live SFU integration, ffmpeg compositor with monogram overlay, RTMP relay to YouTube/Facebook Live.

**Consumes**
- 0003: `spend()`, pack ladder, refund rules.
- Master spec 09 (Panood).
- Playbook 14 (music catalogue, for highlight reels).

**Cross-references**
- Forward-ref to 0012 framed correctly as "this iteration registers the flag 0012 consumes." Publishing-only.

### 0012 — Papic

**Provides**
- Service registrations in service_orders (V1 apply-then-pay): `papic_3_seat`, `papic_5_seat`, `papic_template` (multi-purchase allowed).
- Native iOS 16+ / Android 11+ apps — rear camera only, gesture shutter (tap = photo, drag-up = photo with flash, drag-right = 5-sec clip, drag-right→drag-up chord = clip with flash), 5-sec hard cap, sandboxed SQLite WAL, opt-in camera-roll save.
- Couple gallery on Setnayan landing page with 4 V1 filters (chronological / photos of us / untagged / type).
- 7-day review window with bulk hide/unhide.
- Personal Reels: 1–30s flexible duration, 9:16 (1080×1920), template-driven, FFmpeg server-side render.
- Manual handoff QR pattern at 20% battery (mirrors Panood slot takeover).
- "My contributions" post-event paparazzo view.
- On-device face detection (MLKit / Vision).

**Consumes**
- 0001: guest data — `guest_id`, table assignment, RSVP profile photo, role taxonomy, `photo_consent`.
- 0002: personal QR delivery to guests at RSVP. URL `setnayan:guest:{guest_id}`.
- 0003: `spend()`, pack ladder, refund rules.
- 0008: `tables.qr_token`, table-QR URL `setnayan:table:{table_id}` — used for table-tag fan-out (10-tag cap, alphabetize-and-truncate).
- 0011: `event.custom_monogram_unlocked` — applies couple's monogram to photo / reel exports + gallery chrome.
- spec 10 (master Papic spec) and playbook 14 (music + template asset generation).

---

## 5. Verification checklist

Run the matching block once an iteration is marked complete. Each check is a contract that some downstream sibling will rely on; if it's missing or the name has drifted, the downstream iteration will silently break.

### After 0013 (Sprint 0 production-readiness gate)

All 15 integration tests in `0013_platform_stack_and_sync.md` Section C must pass before V1 features start building. Summary:

- [ ] **C1** Local dev server boots; Supabase connected.
- [ ] **C2** Magic-link sign-in works (Resend → inbox).
- [ ] **C3** Test event created; row appears in Supabase.
- [ ] **C4** Realtime sync between two browser tabs (< 2 seconds).
- [ ] **C5** RLS enforcement (User B can't see User A's data).
- [ ] **C6** `service_catalog` seeded with all V1 SKU rows.
- [ ] **C7** R2 signed-URL upload + public retrieval work.
- [ ] **C8** YouTube broadcast creation via Data API works; `monetization=false` + `latencyPreference=ultraLow` confirmed.
- [ ] **C9** Cross-platform sync iOS ↔ Web (< 2 seconds).
- [ ] **C10** Cross-platform sync Android ↔ Web (< 2 seconds).
- [ ] **C11** macOS Tauri shell builds + signs in + syncs.
- [ ] **C12** Production deploy on push to main works (Vercel auto-deploys).
- [ ] **C13** Migration auto-apply on push works (Supabase migrations in CI).
- [ ] **C14** Sentry captures test errors across all 3 platforms.
- [ ] **C15** Multi-device auth works (4 platforms, same user, same data).

### After 0000

- [ ] `events.is_primary` and `events.archived` columns exist with the partial unique index on `(couple_id) WHERE is_primary = TRUE`.
- [ ] `users`, `event_join_tokens`, `event_members` tables exist.
- [ ] Sign-in routes to `/login`; auth via magic-link or password works end-to-end and creates a `users` row on first sign-in.
- [ ] When a couple creates an event, an `event_join_tokens` row is auto-created with a 32-hex token and an `event_members` row is auto-created for the couple (`member_type='couple'`).
- [ ] Scanning the event QR opens `/join/[event-id]?token=[token]` and walks through the join flow.
- [ ] Join flow correctly handles the four cases: signed-in + already a member (jump in); signed-in + not a member (role picker → link); not signed-in + has account (auth then continue); not signed-in + no account (register then continue).
- [ ] After a successful guest join, an `event_members` row exists with `member_type='guest'`, the chosen `role` from 0001's taxonomy, and `joined_via='qr_scan'`.
- [ ] If the joining user's email matches an existing `guests.email` for that event, the new `event_members` row's `guest_id` is set to that record (no duplicate guest created).
- [ ] If no email match, a new `guests` row is auto-created and linked.
- [ ] Vendor join (V1 placeholder) creates an `event_members` row with `member_type='vendor'` but no full vendor-facing dashboard surface; vendor records remain couple-encoded.
- [ ] Couple can rotate the event QR token from event settings (creates a new `event_join_tokens.token`, optionally invalidating the old one via `revoked_at`).
- [ ] Auto-jump query returns the right answer for 0 / 1 / 2+ active events for couples (filter on `event_members.member_type='couple'`).
- [ ] Couples with exactly 1 active event are auto-redirected to `/dashboard/[event-id]/guests` and never see the picker.
- [ ] Couples with 2+ active events always land on `/dashboard` (the picker) on sign-in.
- [ ] Event picker sorts the primary event first; "+ Create another event" button is visible.
- [ ] Inside an event, the four bottom-nav tabs (Guest List / Vendors / Schedule / In-App Services) are visible on mobile and as a sidebar on desktop.
- [ ] Active-tab highlight matches the current URL prefix.
- [ ] Top bar shows the event pill (with quick switcher), wallet pill (live balance from 0003), and avatar (Profile dropdown).
- [ ] Profile + Settings page at `/dashboard/profile` includes the "make this event primary" toggle.
- [ ] Schedule tab pulls from all three sources (0004 schedule widget, 0006 `vendor_meetings`, 0007 `VendorLineItem.deadline_date`) and renders one unified calendar.
- [ ] In-App Services launcher shows one card per registered service with the correct state and primary action; tapping a card routes to `/dashboard/[event-id]/services/[service]`.
- [ ] Couple-side event-scoped routes 404 for users who are not `couple` members of the event.
- [ ] Guests scanning the event QR for an event they're already a guest of get routed to their personal invitation site (`setnayan.com/[event-slug]?invite=...` from 0002), NOT to the couple's dashboard.
- [ ] Mobile tap targets are ≥ 44pt; bottom nav stays in the thumb zone.

### After 0001

- [ ] `events`, `households`, `guests` exist with the column names quoted in §0001.
- [ ] `guests.qr_token` is a 32-hex string, UNIQUE NOT NULL.
- [ ] Role taxonomy is the canonical 18-value enum (any change is a breaking change for 0008's auto-fill rings).
- [ ] Couple-auth flow + dashboard shell mounted at `setnayan.com/dashboard/*`.
- [ ] Payment-modal stub renders without errors (consumed by 0003 only — do not use elsewhere).

### After 0002

- [ ] Personal invitation site renders at `setnayan.com/[event-slug]?invite=[token]`.
- [ ] `setnayan://[entity]/[id]?token=[t]` URI scheme parser accepts all five `entity_type` values (only `guest` need return data; others may 404 / 501).
- [ ] HTTPS fallback `https://setnayan.com/[event-slug]?invite=[token]` is encoded into every printed QR.
- [ ] `scan_events`, `guest_rsvp_extras` tables exist.
- [ ] `events.palette_finalized_at` exists (NULLable). Default is NULL.
- [ ] `events.photos_released_at` exists (consumed by 0009).

### After 0003

- [ ] `spend(walletId, serviceKey, refId)` returns the documented shape.
- [ ] `formatPrice(centavos)` outputs `{ tokens, phpEquivalent, display }` and rounds tokens to 100.
- [ ] `service_catalog` contains, at minimum, the V1 seed rows in §3.2 with the prices in §1.
- [ ] Refund flow inserts a positive `token_transactions` row with `reason = 'refund'` (not a delete).
- [ ] No code path charges PayMongo / Stripe directly outside the pack-purchase flow.

### After 0004

- [ ] `invitation_widgets` table exists; UNIQUE constraint on `(event_id, widget_type)` enforced.
- [ ] All 11 widget types validate against their Zod schemas.
- [ ] Hero Monogram editor shipped with all 25 frames in the catalog.
- [ ] `dress_code.config_json` carries 8 ceremony palettes + 1 reception palette + optional reception by_role overrides.
- [ ] Setting/clearing `events.palette_finalized_at` broadcasts the cascading-invalidation event and 0005 (when present) reacts.
- [ ] All 4 Pro service rows present in `service_catalog`. Pro purchases call `spend()` — never charge directly.

### After 0005

- [ ] All 10 Lottie templates registered in `led_background_configs`.
- [ ] Renders produce 8K, 4K, and 1080p variants at the documented durations.
- [ ] R2 keys follow `led_backgrounds/{event_id}/{template_id}_{config_hash}.mp4`.
- [ ] Hosted playback URL `setnayan.com/led/{event-slug}/r/{render_id}.mp4` resolves and serves HLS via `.m3u8`.
- [ ] Renderer reads `events.palette_finalized_at` and refuses to start if NULL (or warns with a soft-flag, per spec).

### After 0006

- [ ] All 28 canonical services seeded and visible in the picker.
- [ ] Custom rows scoped per event; do not pollute the global canonical list.
- [ ] `vendor_payment_milestones` accepts arbitrary milestone counts (no fixed 3-stage gate).
- [ ] `vendor_crew` rollup view returns count × per-meal cost, zeroes when `vendor_provides_meals = TRUE`.
- [ ] `vendor_meetings.created_by_actor` defaults to `'couple'` in V1 — schema accepts `'vendor'` and `'setnayan_staff'` too.
- [ ] Contracts upload to R2 at `vendor-contracts/{event_id}/{vendor_id}/{contract_id}.{ext}`.
- [ ] No write path ever calls `spend()` (vendor money is external).

### After 0007

- [ ] Each vendor surfaces 3 line items: Package, Crew Meal, Transportation. Crew Meal autopopulates from 0006's rollup.
- [ ] PaymentRecord stores `proof_r2_key` at `events/{event_id}/payment_proofs/{payment_id}.{ext}`.
- [ ] `.ics` export emits stable VEVENT UIDs `{event_id}-{line_item_id}@setnayan.ph` and 24h+1h VALARMs.
- [ ] Bulk-export button reads `tracked_in_calendar` and only emits FALSE rows; button text adapts ("Add 5 new dates" / "All on calendar — re-export?").
- [ ] Setnayan platform costs panel reads `WalletSpend` rows for the event and renders read-only.

### After 0008

- [ ] `tables.table_type` CHECK constraint matches the 13-value list exactly.
- [ ] `tables.capacity` is bound to type via `TABLE_CATALOG` lookup — no per-table custom-capacity field.
- [ ] `rotation_deg` accepts {0, 45, 90, 135, 180, 225, 270, 315} for `long_*` and `serpentine_*`; locked at 0 for `round_*`, `family_head_*`, `sweetheart_2`.
- [ ] `tables.qr_token` is NULL on Draft, populated on Publish, idempotent on re-Publish.
- [ ] Print pack PDFs include both per-table signs (table QR) and per-guest place cards (guest QR from 0001).
- [ ] Auto-fill never moves an already-placed guest, never seats anyone in a locked table, excludes sweetheart tables.

### After 0009

- [ ] OAuth flow at `/api/oauth/google/start` → `/callback` succeeds and stores encrypted refresh token in `events.photo_delivery_oauth_token_encrypted`.
- [ ] Drive folder name follows `Setnayan · {couple_names} · {wedding_date}`.
- [ ] Manifest CSV uploaded to the Drive folder root.
- [ ] `photo_delivery_jobs` rows survive worker restart; `delivery_attempts` increments on retry.
- [ ] Redeliver endpoint accepts the same payload shape as the LED redeliver endpoint where applicable.
- [ ] On successful release, `events.photos_released_at` is populated.

### After 0010

- [ ] All 20 palette themes loadable from `library_index.json`.
- [ ] Setnayan Guide rule engine evaluates all 7 categories on every change and returns structured pass / warn / contradict records.
- [ ] Color name autocomplete returns ≥ 300 entries; both name → hex and hex → nearest-name resolve.
- [ ] Image-extraction handler accepts user-uploaded images via R2 and returns ≤ 5 dominant colors.
- [ ] Master palette dedup view collapses identical hex AND identical named colors (case-insensitive name match).
- [ ] `saved_palettes.scope_type` accepts the V1 value `'couple'` and is forward-compatible with `'stylist'`.

### After 0011

- [ ] `service_catalog` contains all seven 0011 rows: `panood_base` (250000), `panood_camera_addon` (100000, max +2), `panood_hour_addon` (100000, unlimited), `custom_monogram_pack` (200000), `broadcast_style_pack` (300000), `ai_video_highlight` (200000, multi-purchase), `ai_edited_highlight` (500000, multi-purchase).
- [ ] Camera add-on purchase increments `events.panood_extra_cameras`; capped at 2; spend modal disables +Camera past the cap.
- [ ] Hour add-on purchase increments `events.panood_extra_hours` with no upper cap; broadcaster gets a 30-min warning before budget runs out and can buy more hours mid-stream.
- [ ] Broadcast Style Pack purchase sets `events.broadcast_style_unlocked = true`; broadcaster admin shows the mode picker (News / Cinematic / Sports / Royalty) and transition picker only when this flag is true.
- [ ] Highlight markers ★ button creates a `highlight_markers` row per tap regardless of whether AI Highlight add-ons are purchased.
- [ ] Cast to projector button opens a fullscreen video element; on laptop the popup window can be moved to a secondary HDMI display; on iPhone the iOS fullscreen-video → external-display behavior auto-routes the video to the connected projector.
- [ ] When the event has both an LED Background render AND the Custom Monogram Pack, the compositor's standby mode plays the 1080p LED render under the standby card text.
- [ ] On Custom Monogram Pack purchase, `event.custom_monogram_unlocked` flips to TRUE and never reverts (refund rules: refund credits the wallet but does not unset the flag — confirm with spec).
- [ ] Both R2 monogram paths exist after first render: `events/{event_id}/branding/monogram.png` and `monogram_default.png`.
- [ ] All 4 overlay templates × 2 orientations = 8 layouts render correctly.
- [ ] **Setnayan's master YouTube channel exists and is NOT enrolled in YPP** — verified manually before launch.
- [ ] Every YouTube broadcast is created via Data API with `monetizationDetails.monetization: false` and `latencyPreference: ultraLow`.
- [ ] Default privacy state on broadcast creation is `unlisted`.
- [ ] Couple's landing page embeds the **YouTube IFrame Player** — NOT the Cloudflare Stream Player. Embed parameters set: `controls=1`, `modestbranding=1`, `rel=0`, `iv_load_policy=3`, `playsinline=1`.
- [ ] RTMP relay from Cloudflare compositor to YouTube Live ingest succeeds; broadcast is live within 60 seconds of broadcaster start.
- [ ] No code path attempts to use the Cloudflare Stream Player for delivery (search the codebase: zero references to Stream Player as a viewer surface).
- [ ] No code path implements per-tier viewer caps or `panood_viewer_pack` SKU (cut from V1).
- [ ] Tier 4 unlocks Facebook Live via a second RTMP relay endpoint; no separate Facebook Live SKU exists (`facebook_live_addon` should NOT appear in `service_catalog`).
- [ ] YouTube auto-archive on Setnayan's master channel contains the post-event recording for every test broadcast; couple-dashboard "Download wedding archive" link resolves to a working URL.

### After 0012

- [ ] `papic_3_seat`, `papic_5_seat`, `papic_template` rows present in `service_catalog`.
- [ ] iOS app: rear camera only — no front-camera UI surface anywhere. Gesture shutter behaves: tap / drag-up / drag-right / chord. 5-sec cap is client-side.
- [ ] Android app: parity with iOS for shutter, gesture, sandbox-only storage, 5-sec cap.
- [ ] Tag scanner accepts `setnayan://guest/{id}` and `setnayan://table/{id}`. Table-tag fan-out caps at 10, alphabetizes by RSVP'd name, truncates with a UI warning.
- [ ] Untagged photos still appear in the couple's gallery (CLAUDE.md gotcha #4).
- [ ] When `event.custom_monogram_unlocked = TRUE`, photo exports + Personal Reels + gallery chrome render the couple's monogram (not Setnayan's).
- [ ] Personal Reel renderer enforces 1–30s, 9:16, max 5 guest picks + 5 couple memorable clips, music drawn only from the owned-AI catalogue.
- [ ] Battery handoff QR at 20% works end-to-end (3-second grace, session-token revoke + reissue).

### Cross-cutting checks (run after the whole set is done)

- [ ] No iteration's source code or schema imports from a higher-numbered sibling (grep for `iteration_origin = '00NN_*'` and verify NN ≤ this iteration's number).
- [ ] Every paid surface goes through `spend()` — `grep` codebase for direct PayMongo / Stripe charges and confirm only 0003's pack-purchase flow contains them.
- [ ] PHP centavos is the source of truth: any `tokens` field in product code derives from `formatPrice()`, never the other way.
- [ ] Service worker / offline-cache: every event-day iteration (0008 print pack, 0011, 0012) survives a 60-second network drop on a real device.
- [ ] Tag-cap of 10 is enforced in **both** the table-QR fan-out path (0012) and any future cross-paparazzi de-dup path.
- [ ] R2 retention: scheduled job for hot→IA at 90 days exists; no auto-delete inside 5 years (CLAUDE.md gotcha #2).

---

## 6. Known sequencing rot to clean up

These are stale prose / numbering inside existing specs from before the cascading rename of 2026-05-08. They are not behavioural bugs (no iteration actually imports a higher-numbered sibling), but they will confuse anyone reading the specs cold and should be patched the next time those iterations are touched.

1. **`0005_led_background_maker.md`** — header line "Builds on: 0003 (Hero Monogram widget — supplies the monogram), 0002 (palette + accent color)" must say **0004** for Hero Monogram. Same fix for line ~262 ("read-only summary linked back to Hero Monogram widget in 0003"). The companion-files list still reads `0003_invitation_widgets/0003_invitation_widgets.md` — should be `0004_invitation_widgets/0004_invitation_widgets.md`.

2. **`0002_qr_invitation_system.md`** — line ~668: "The full feature lives in a future iteration (likely **0005 — Photo delivery to couple's cloud**)…" Photo Delivery is now **0009**. Update the cite.

3. **`0002_qr_invitation_system.md`** — vague forward-refs to "downstream Hero Monogram editor" and "Pro purchases" should name iteration 0004 explicitly to make the link easy to follow.

When patching, also re-grep each spec for any remaining occurrence of the pre-cascade folder names (`0003_invitation_widgets`, `0004_led_background_maker`, `0005_vendors_management`, `0006_budget_expenses`, `0007_seating_chart_editor`, `0008_photo_delivery`, `0009_mood_board`) and rewrite to the post-cascade names.

---

## 7. Update protocol

This file is part of the codebase, not a one-shot reference.

- When a new iteration is drafted, add a row to §1, an arrow line to §2, a contract sheet to §4, and a verification block to §5.
- When an iteration's spec changes a table name, service key, or URI format, update §3, §4, and §5 in the same commit.
- When a sequencing-rot bug is found, log it in §6 with the file + line, then patch it in the originating spec on the next pass.
- This file should never grow past ~700 lines. If it does, split shared contracts (§3) into a sibling `00b_Shared_Contracts.md`.

— end —
