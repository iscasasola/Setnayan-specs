# Ugat Coverage — which pages are veins, which are severed (2026-07-05)

> **Provenance:** Generated 2026-07-05 by a 12-agent parallel sweep of every page route at `origin/main` (10 territory auditors over 339 routes, synthesized). Part of the UGAT papers — see `../UGAT.md`.


## 1. The number

**274 of 298 live routes are connected (92%).** The full sweep covered 339 routes; 41 are dead-by-design (legal prose, pillar marketing pages, tombstone redirects) and are excluded from the denominator. Of the remaining 298, 274 draw their meaningful content from the database at request time, 17 are partial (real DB reads standing next to hardcoded truth), 6 are fully severed, and 1 is an orphan. The honest read: the app's core — guest surfaces, couple dashboard, vendor dashboard, admin console — is thoroughly veined; almost every disconnect that remains is the same disease in different bodies: **a peso price or a taxonomy list hardcoded in TypeScript that duplicates a table an admin already manages.** The two worst offenders (/help articles quoting a retired vendor price ladder, and a supplies marketplace selling from a mock catalog when the real pricing tables exist) are exactly the failure the "pricing admin-managed, never hardcode" lock was written to prevent.

## 2. Severed & partial surfaces

Sorted by risk. Dead-by-design redirects excluded.

| Route | Verdict | What's disconnected | Where the truth lives | Fix shape |
|---|---|---|---|---|
| `/help/[slug]` | **Severed · HIGH** | Article bodies hardcode admin-managed prices — vendor Pro ₱6,000 / Enterprise ₱10,000 contradict the live Solo ₱999 / Pro ₱2,499 / Ent ₱4,999 ladder; Setnayan AI shown ₱499 with no renewal price. Users can act on stale prices. | `platform_retail_catalog_v2` + `vendor_billing_catalog` | Interpolate prices from the catalog at render, or strip all peso figures from `lib/help.ts` and link `/pricing`. |
| `/dashboard/[eventId]/studio/supplies-marketplace` | **Partial · HIGH** | The entire product catalog + PHP prices are a hardcoded mock (`_data/products.ts`, self-labelled "pre-pivot") — couples can cart at prices the DB pricing function would not produce. | `supplier_vendor_skus` + `supplier_vendor_sku_pricing` + `resolve_supplies_pricing()` (already migrated, PRs #143/#145/#146) | Swap the mock for the DB readers that already exist. |
| `/dashboard/[eventId]/studio/setnayan-ai` | Partial · MED | "₱499 / 28-day" hardcoded in the WHAT_YOU_GET bullet (page.tsx:69) while the CTA on the same page is catalog-resolved — a reprice makes the page contradict itself. | `platform_retail_catalog_v2` | Feed the bullet the same `formatV2Sku` value the CTA uses. |
| `/dashboard/[eventId]/studio/indoor-blueprint` | Partial · MED | ₱1,499 code fallback both displays and flows into the checkout drawer on a catalog-read miss (page.tsx:84,355) — siblings removed exactly this per the 2026-06-14 owner rule. | `platform_retail_catalog_v2` | Delete the fallback; hide the buy CTA on a missing row (match custom-qr-guest/pakanta). |
| `/site-editor/[eventId]` + `/event` | Partial · MED | Pro upgrade card prices come from the static TS mirror `lib/sku-catalog.ts` with inline ₱1,999/₱999 fallbacks (site-editor.tsx:831,884) — a DB reprice never reaches the display. | `platform_retail_catalog_v2` | Resolve both prices in the shared `_data.ts` loader via `formatV2Sku`. |
| `/dashboard/[eventId]/vendors/categories` | Partial · MED | The unlockable category list is static `PLAN_GROUPS` + `lib/taxonomy.ts` constants — an admin-added DB category never appears here. | `service_categories` / `canonical_service_taxonomy` | Derive the card list from taxonomy-db; keep code only for ordering/presentation. |
| `/dashboard/[eventId]/vendors` | Partial · LOW | 22-card bucketing leans on the static `TAXONOMY_MAP` (categories = taxonomy-DB lock); the picks/budget data itself is fully DB. | taxonomy-db tables | Same fix as `/vendors/categories` — one shared DB-driven grouping. |
| `/dashboard/[eventId]/alaala` | Partial · LOW | "Arc of the day" chips + 'soon' flags hardcoded from the `ARC` constant; ownership wiring admitted as follow-up in-page. | orders / entitlements + catalog | Drive chips from `eventSkuActive` + catalog rows. |
| `/dashboard/[eventId]/studio/papic` | Partial · LOW | "Pair a DSLR — ₱100 / seat / day" price string hardcoded (page.tsx:1193); informational only, no buy flow yet. | catalog (future SKU row) | Read from catalog before V1.5 attaches a buy flow. |
| `/about` + `/tl/about` | Severed · LOW | 0%-commission + feature claims hardcoded, duplicated across two language files (double drift). | catalog + platform_settings | Shared claims module fed by DB, or accept static with a written justification. |
| `/features` + `/tl/features` | Severed · LOW | Tier-boundary claims (Panood "free single-cam, paid multicam") hardcoded in `_DayOfApparatus.tsx` — duplicates catalog truth. | `platform_retail_catalog_v2` | Read the boundary from the catalog row, or de-specify the copy. |
| `/why-setnayan` | Severed · LOW | "0% commission" asserted 4× plus comparative claims, all static. | platform_settings / catalog | Same claims-module fix as `/about`. |
| `/waitlist` | Partial · LOW | Launch date "December 1, 2026" + commission claims hardcoded; sitemap admits hand-updating. | `platform_settings` | Move launch date into platform_settings. |
| `/signup` | Partial · LOW | "192 verified vendors" — a live count frozen in copy (page.tsx:169); header comment already flags it as superseded. | `vendor_profiles` count | Count at request time or drop the number. |
| `/download` | Partial · LOW | Desktop release version/size/URLs in `lib/desktop-release.ts` — stales if a release ships without the edit. | code-SSOT (declared) | Acceptable if the release checklist enforces the edit; else read from GitHub releases. |
| `/realstories` + `/[slug]` | Partial · LOW | Curated sample-wedding roster + non-editorial story bodies hardcoded in `lib/real-weddings.ts`; real showcases are DB. | `lib/showcase-db` tables | Migrate samples into showcase rows, or keep labeled-samples as declared static. |
| `/help` (hub) | Partial · LOW | Topic/article corpus static in `lib/help.ts` (search runs over it); ticket write is DB. | by-design candidate | Fine once `/help/[slug]` prices are fixed; declare corpus static-by-design. |
| `/vendor-dashboard/more` | Partial · LOW | Nav tiles from hardcoded `VENDOR_NAV_GROUPS` + inline descriptions — bypasses the admin `nav_slot_override` layer the layout applies. | `nav_slot_override` via `/admin/menus` | Run tiles through `getNavSlotMap` like the layout does. |
| `/admin/token-bands` | Partial · LOW | Peso display = band × hardcoded ₱100/token multiplier; a rate change silently desyncs the shown amounts. | owner lock, code-only | Put the flat rate in `platform_settings` or a shared constant with the burn engine. |
| `/admin/money` | Dead-with-a-claim · LOW | Nav landing card hardcodes burn bands "₱100/₱200/₱300", duplicating admin-editable `regions.burn_band`. | `regions.burn_band` | Drop the figures from the card copy. |

## 3. Orphans

- **`/camera-move-preview`** — client-only §16.9 engine preview; zero inbound links, zero DB, only referenced in `lib/reserved-slugs.ts`. **Keep** (comment says it wires into the Stories builder later) but gate it behind an env flag like `/demo-capture` so it isn't a public unlisted page.
- **`/explore/compare`** — fully connected (vendor_profiles + services + reviews via `?ids=`) but nothing links to it; only the unused `routes.explore.compare` helper exists, and the dashboard grew its own build-compare. **Kill or link**: either surface a "Compare" entry point on `/explore` or retire the route to avoid maintaining two comparison engines.

## 4. Territory scorecards

| Territory | Routes | Connected | Partial | Severed | Orphan | Dead | Verdict |
|---|---|---|---|---|---|---|---|
| Marketing & content (`/`, pillars, help, blog, TL) | 35 | 8 | 5 | 6 | 0 | 16 | The weak flank — every severed page on the platform lives here; pricing pages themselves are clean, but claims-copy and help articles drift. |
| Auth, onboarding & invites | 17 | 15 | 1 | 0 | 0 | 1 | Excellent — token/claim flows are properly row-driven end to end. |
| Explore, tours & demos | 17 | 14 | 0 | 0 | 1 | 2 | Strong — even the demo tours read real sample-event rows. |
| Guest event surfaces (`/[slug]`, papic, wall, pabati) | 17 | 17 | 0 | 0 | 0 | 0 | Perfect — the day-of guest experience is 100% veined, entitlement-gated, R2-from-rows. |
| Couple dashboard + site editor | 109 | 91 | 9 | 0 | 0 | 9 | Very strong core; every partial is a price/taxonomy constant shadowing a DB table — one cleanup pattern fixes all nine. |
| Vendor dashboard | 52 | 47 | 1 | 0 | 0 | 4 | Near-perfect — heavy RPC use; only the `/more` nav grid bypasses the admin menu layer. |
| Admin console | 92 | 82 | 1 | 0 | 0 | 9 | Near-perfect — the console that manages the Ugat is itself almost fully on it; token-bands ₱ multiplier is the lone wart. |

## 5. The standing rule

1. **Every new page declares its Ugat reads** — the PR description names the tables/RPCs the page derives content from, and the reviewer checks the list against the code.
2. **A page with zero reads needs a written "static-by-design" justification** in a file-top comment (legal prose, pillar marketing, tombstone redirect) — silence is treated as a severed page, and any peso figure, count, or tier boundary in static copy is an automatic rejection.
3. **The coverage number (currently 274/298, 92%) joins the admin console's health overlay** next to the queue digest, recomputed per sweep, so a drop below the line is seen the week it happens — not at the next audit.