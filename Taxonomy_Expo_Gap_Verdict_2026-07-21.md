# Taxonomy gap review — PH wedding-expo board vs the 244-canonical taxonomy

**Date:** 2026-07-21 · **Status:** VERDICT — not applied, owner sign-offs in §5
**Trigger:** owner photographed the exhibitor board at *"Getting Married"* (PH wedding expo, 18–19 July 2026) — 27 category headings — and asked whether our taxonomy needs upgrading.
**Method:** grounding pass over `apps/web/lib/taxonomy.ts` → 7 parallel cluster auditors judging each expo heading COVERED / PARTIAL / ABSENT with evidence → synthesis judge instructed to argue *against* new tiles and *against* admitting advertisers. Run `wf_923e70fd-037`, 9 agents, 0 errors.

---

## 0a · ✅ GUARD SHIPPED · ⚠ and the dead-tile count was wrong (2026-07-21, later same day)

**PR #3460 — `apps/web/lib/taxonomy-tile-reachability.test.ts`.** The build now fails if any tile in `WEDDING_TILE_ORDER` resolves to zero canonicals. This ships the *guard*, not the *fix*: the fix is data (sign-off #1 below), and a full seed regeneration clobbers prod hand-edits (§4), so the two are deliberately separated.

The allowlist asserts in **both directions** — an unallowlisted dead tile fails, **and an allowlisted tile that now resolves fine also fails**. So fixing a tile forces the deletion of its entry and the list can only shrink; a fixed tile can never be left allowlisted, quietly suppressing the next regression on itself. A third test rejects misspelled keys, which would otherwise protect nothing while reading as though the defect were tracked. Verified by mutation in both directions.

**⚠ Correction — the dead tiles are 2, not 3.** Measured by walking all 69 tiles through the marketplace's own `canonicalServicesForTile()`:

| Tile | Parent | State |
|---|---|---|
| `ceremony_venue` | venue | **DEAD** — 0 canonicals |
| `editorial` | documentary | **DEAD** — 0 canonicals |
| `filipiniana_barongs` | look | ✅ resolves fine — *the earlier claim was wrong* |

Also measured: **32 of 69 tiles carry exactly one canonical.** Thin-ness is the norm, not the exception — which is precisely why the `reception = accommodation` problem is a *semantic* defect a count guard cannot detect, and the guard deliberately does not try to encode it (pinning an exact canonical set would fail on every legitimate edit and teach the next reader to ignore the file).

---

## 0 · The headline is not what the expo was about

> ## 🚨 The **Ceremony Venue** tile returns EMPTY. Always. And **Reception** has exactly one canonical — `accommodation` (lodging).

**Verified three independent ways:** an orphan-tile scan run before the council, the council's own grounding pass, and the code path itself.

`vendor_services.category` holds **canonical service ids**, and the marketplace resolves tile → canonicals → vendors:

```ts
// apps/web/app/dashboard/[eventId]/vendors/_actions/category-search.ts
const canonicals = groupCanonicals.filter(…)
if (canonicals.length === 0) return EMPTY;
…
.from('vendor_services').in('category', canonicals)
```

- `ceremony_venue` → **0 canonicals** → short-circuits to `EMPTY` before any query. **A church, chapel, mosque or garden ceremony site cannot appear**, in a Catholic-majority market, on a wedding platform.
- `reception` → **1 canonical, `accommodation`** (lodging, per the 2026-05-22 owner directive). **A function hall, clubhouse or events place must mis-tag itself as *accommodation*** to surface under Reception.

**Venue is the most-shopped wedding category and — per this session's own pricing work — the Enterprise-tier buyer** (≈₱500k bookings; the segment the ₱7,999/28d tier and the Prismm comparison were built around). The expo photo surfaced this by accident; it has nothing to do with shoes.

---

## 1 · The answer: mostly no, and the change is unusually cheap

**13 of 22 headings reviewed are cleanly COVERED.** Most PARTIALs are near-misses at *facet* grain, which the file's own maintenance rule already forbids splitting (*"rental / shoot-type / cart-type / package composition are FACETS underneath a tile, never their own tile"*).

**The honest gap is 8 canonical services — with ZERO new tiles, ZERO new folders and ZERO new enum values.** That last point is what makes it cheap and low-risk: `canonical_service` is `TEXT`, and `public.vendor_category` is a *tile-grain* enum, so **STEP 1 of the add-a-leaf contract is skipped entirely** — no permanent PG enum values (which cannot be dropped), no `sort_order` renumbering across 69 tiles, no new booth template, no new empty shelf on `/explore`.

Net: a ~10-line `TAXONOMY_MAP` edit, an 8-row `canonical_service_schemas` stub block, one regenerated seed (244 → 252 mappings, node count unchanged at 84), and **no `applicable_event_types` writes** — NULL stays NULL, today's universal semantics.

## 2 · The 8 additions

| # | Canonical | Folder / tile | Why |
|---|---|---|---|
| **1** | **`reception_venue`** | venue / reception | 🚨 The tile's only canonical is lodging. Function halls have nothing honest to list. |
| **2** | **`ceremony_venue_booking`** | venue / ceremony_venue | 🚨 Shipped tile with **zero** canonicals → renders empty today. Orthogonal to the `marketplaceHidden` officiant rows — those are the *celebrant*, not the room. |
| 3 | `video_booth` | booths / photo_booth | Video-guestbook booths are served only by `setnayan_patiktok` / `pabati`, both `setnayan: true` and therefore **unoccupiable by a third-party vendor**. `booth_360` is a *photo* format — a near-miss, not coverage. |
| 4 | `fashion_stylist` | look / hmua | `stylist_decorator` dresses the **venue**; `bridal_hair_stylist` is hair only. The expo board itself lists FASHION STYLIST separately from EVENTS STYLIST. |
| 5 | **`wedding_shoes`** | look / jewelleries_accessories | Zero footwear canonical in 244 entries — while `lib/checklist.ts` already tells couples to *"break in your wedding shoes"*. Sits beside veil, garter, headpiece, tiara. **The attire tree dresses the whole party head to toe except the feet — it even rents parasols.** |
| 6 | `bridal_lash_brow_nails` | look / wellness_fitness | `mini_nail_bar` is an event-day **guest booth** (folder `booths`), not bride-side prep. |
| 7 | `avp_motion_graphics` | design / led_wall | `led_video_wall` sells the **screen**; the only content-side entry is first-party. `av_production` is the corporate gap leaf, DB-scoped away from weddings. |
| 8 | `wedding_planner_full` | planning / coordinator | A `wedding_planner_partial` exists with no full sibling, so full-service planners mis-tag as `wedding_coordination` — a different, cheaper product in PH trade usage. |

## 3 · Rejected — and the reasoning is the durable part

- **FINANCIAL SERVICES (HSBC · Metrobank · RCBC · UnionBank)** — ❌ **the advertiser test.** A bank at a wedding expo buys **attention**; it is not booked, has no event-day deliverable, and would sit in a model priced on *locks* with nothing to lock. It belongs to the **sponsorship / Boosted-Ads surface**, never the service taxonomy.
- **TRAVEL AGENCY** — ❌ as a new canonical. The concept exists (`honeymoon_planner`, `destination_wedding_travel_coordinator`) and was **deliberately suppressed**. This is an owner decision to *reverse*, not a bug to fix.
- **PHOTOGRAPHY & VIDEOGRAPHY** — ❌ a bundle, not a service. A combined studio selects both existing canonicals on the shared tile.
- **Photo-magnet booth · balloon decor · a strings canonical · an invitations tile · a giveaways tile** — ❌ all facet-grain or already absorbed by an explicit catch-all. The *strings* case is a **labelling** defect: `choir_string_quartet` lives on a tile labelled "Choir".

## 4 · Risks worth reading before applying

- **Seed regeneration clobbers DB hand-edits** — the regenerated seed re-emits all 84 nodes / 252 mappings with `ON CONFLICT … DO UPDATE SET` on **every** column. Any row edited directly in prod is overwritten.
- **Empty category on a shipped surface** — `ceremony_venue` renders nothing today; after this it holds one canonical with **zero vendors**, which is a *different* kind of empty. Decide whether it ships visible or behind a count filter.
- **The `reception` / `accommodation` collision** — `accommodation` is the only canonical in the entire map carrying `secondary_tiles: ['catering']`. Leave it untouched; it correctly serves the hotel room-block case.
- **Stub schemas are functionally empty** — all 8 ship with `'{}'` attributes and `'[]'` facets, so no facet refinement until populated.
- **Scope creep at review** — `avp_motion_graphics`, `bridal_lash_brow_nails` and `wedding_planner_full` are the three weakest and will attract "while we're in here" additions.

## 5 · Owner sign-offs

| # | Decision |
|---|---|
| 1 | ✅ **APPROVED — owner 2026-07-21 ("yes").** Apply #1 + #2 (the venue hole) — a live defect, not an enhancement. ⚠ Must be **additive**, never a seed regeneration (§4). ⚠ Any tile fixed must have its entry **deleted from the PR #3460 reachability allowlist in the same change**, or CI fails (§0a — the allowlist asserts in both directions). |
| **1b** | ✅ **NEW — the second dead tile, `editorial`, now has its definition.** Owner 2026-07-21: *"editorials are not photographers, these are companies that create content for weddings"* — third-party magazines / content companies a couple hires and pays. Seeding canonicals under `editorial` closes the other dead tile. **Model + open sign-offs: [`Editorial_and_Content_Creator_Coverage_2026-07-21.md`](Editorial_and_Content_Creator_Coverage_2026-07-21.md).** ⚠ Same allowlist-deletion requirement as #1. ⚠ The canonical **grain** (one with facets vs two) is not yet decided — do not seed ahead of it. |
| 2 | Apply the remaining 6, or trim to the strong four (#3–#5 + drop #6–#8)? |
| 3 | **Un-hide `honeymoon_planner`** (reverse the marketplaceHidden decision) instead of inventing `travel_agency`? |
| 4 | Relabel the `choir` tile so string quartets are findable? |
| 5 | Does `ceremony_venue` ship visible while it has no vendors? |

---

## 6 · Out of scope here — the goods question

The owner separately raised **shoe stores selling per piece and in bulk**, as gifts/souvenirs or personal use. That is **not** a taxonomy change:

- `souvenirs_giveaways` already exists as a canonical with its own booth tile — a shoe store selling 150 pairs as giveaways registers there today.
- The real gap is **pricing basis**: `vendor_services.pricing_basis` is `CHECK IN ('fixed','per_pax','per_hour')` — there is no `per_unit`.
- ✅ **But `vendor_service_price_brackets` is already a quantity-band table wearing a pax name** — `min_pax` / `max_pax` / `price_php` with an open top bracket is structurally identical to *buy 1–11 / 12–49 / 50+*. **Bulk tiering is built.**
- So per-unit pricing ≈ one CHECK value + a unit-price column + a pax→qty relabel when the basis is per-unit.

⚠ **The bigger question this opens:** per-unit *pricing* is cheap; per-unit *fulfilment* (sizes, stock, delivery) is the **0018 Supplies vertical**, deferred. And once a vendor can price per unit with bulk breaks, that is not just shoes — it is every favor, giveaway and printed item. **Decide whether you are opening footwear or opening GOODS**, because the schema change is identical and the second is a vertical.
