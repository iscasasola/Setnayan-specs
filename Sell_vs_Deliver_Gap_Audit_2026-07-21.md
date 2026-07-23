# Sell-vs-Deliver Gap Audit — Owner Report
> **✅ INDEPENDENTLY RE-VERIFIED 2026-07-21 before delivery.** The two money-tier findings were
> re-checked by hand against `origin/main` + prod, not taken on the council's word (a prior council
> in this same series produced a retraction). Confirmed: `formatV2Sku`
> (`lib/v2/sku-catalog-v2.ts`) and `resolvePaxPricedOrderCentavos` (`lib/v2-catalog.ts`) both select
> on `service_code` alone with **no `is_active` filter**; the `website-pro` card is `status:'live'`
> with `opensDirect:true` and `/studio/website-pro/page.tsx` **exists**; `checkout/actions.ts`
> hard-rejects only `{GUIDED_PACK, MEDIA_PACK}` and its own comment admits the generic hole
> (*"submitOrderAction does NOT require serviceKey to map to an active catalog row"*).
> `PRO_TIER_SKUS` is the two dead v1 codes and its doc comment (*"there is no DB tier column"*) is
> now false — prod has **5 vendors at `tier_state` pro/enterprise** and **0 orders** carrying either
> code, so every one of them is locked out of payment links.
>
> ⚠ One nuance the council overstated: the ₱1,001 "overcharge" on `COUPLE_WEBSITE_PRO` compares the
> umbrella to its two *separately purchasable* components (`EDITORIAL_PRO` 2,999 +
> `STD_PREMIUM_OPENINGS` 999). The umbrella's card also claims RSVP + on-the-day + watermark
> removal, which have no standalone SKUs — so the delta is directional, not a clean like-for-like.
> The solid, unarguable finding is that a **retired** SKU is still fully purchasable.

**2026-07-21 · repo `origin/main` @ 38f9b974a · prod `njrupjnvkjkitfctetvi`**

---

## 1. Bottom line

Twenty-eight candidate gaps went in, six were killed by the skeptics, and **19 real divergences survived** — but only **three cost money today**, and they cluster in one place: three catalog readers never learned to check `is_active`, so *retiring a SKU in the admin console does nothing*. The single worst one is that **`/dashboard/[eventId]/studio/website-pro` still sells the retired Couple Website PRO umbrella at ₱4,999 when its two surviving perks now sell standalone for ₱3,998** — a live, couple-reachable ₱1,001 overcharge that the owner explicitly tried to stop in migration `20270712300000` ("this only stops new sales" — it doesn't). Everything else is a public page promising things the product can't hand over, which is reputational rather than financial, and a long tail of stale comments that will keep manufacturing bugs like the PANOOD one you fixed this morning.

---

## 2. Charging wrong / blocking paid customers

| Gap | Trigger | Evidence | Fix | Migration? |
|---|---|---|---|---|
| **Retirement is a no-op — 3 readers ignore `is_active`, so retired SKUs still price, still render a buy drawer, still create orders.** Live victims: `COUPLE_WEBSITE_PRO` ₱4,999 (overcharges ₱1,001 vs `EDITORIAL_PRO` 2,999 + `STD_PREMIUM_OPENINGS` 999 = ₱3,998) and `INDOOR_BLUEPRINT` ₱1,499. | Couple opens Studio → "Website PRO" card (`status:'live'`, `opensDirect`) or "Indoor Blueprint" (`status:'web_v1'`, also seeded into "Recommended for you now") → completes the BDO/GCash drawer. Order lands `pending_approval`. | `lib/v2/sku-catalog-v2.ts:178-183` `formatV2Sku` selects by `service_code` only; `lib/v2-catalog.ts:534-540` `resolvePaxPricedOrderCentavos` (the *authoritative* charge resolver) same; `studio/page.tsx:110-113` price pill same. Six sibling readers in the same file **do** filter — `v2-catalog.ts:170-171` even documents why. `checkout/actions.ts:353-360` guards only `{GUIDED_PACK, MEDIA_PACK}`. Prod: both rows `is_active=false`. Intent: migration `20270712300000:19-21`. | Add `.eq('is_active', true)` to all three readers **and** hard-reject in `submitOrderAction` any `service_key` with no active row — the reader fix alone does *not* close Indoor Blueprint, which falls back to hardcoded `INDOOR_BLUEPRINT_PRICE_PHP = 1499` (`studio/indoor-blueprint/page.tsx:64-65,90`). Flip both add-on cards to `coming_soon`. | **No** |
| **Vendor Pro/Enterprise can never add a payment link** — the gate reads two dead v1 SKU codes against `orders`, which the subscription path never writes. | Vendor pays ₱2,499/28d, admin approves, `tier_state='pro'` → /vendor-dashboard/shop?tab=payments → "Payment links are a Pro & Enterprise feature — upgrade to add one." Infinite upsell loop, no escape. | `lib/vendor-payment-methods.ts:46-49` `PRO_TIER_SKUS = ['vendor_pro_weekly','all_tools_unlock_annual']`, matched at :164 against `orders`. Prod: zero orders with either code, ever. All three subscription RPCs (`create_/approve_/confirm_vendor_subscription`) contain **no reference to `orders`** — verified via `pg_get_functiondef`. Canonical reader everywhere else is `vendor_profiles.tier_state` (`lib/vendor-feature-gate.ts:33-43`). Exact sibling of the PANOOD bug you fixed. | Rewrite `isVendorProActive` to use `resolveVendorTier()` / `isTierAtLeast(tier_state,'pro')` + `tier_expires_at`; delete `PRO_TIER_SKUS`. | **No** |
| **Live Studio is sold ₱2,500 *per day* but a second day is physically unconsumable** — and the free tier burns the one window. | Couple presses "Go live" on the rehearsal (or on the **free** tier, which the product tells them to do) → `first_live_at` stamped, DB-immutable. 24h later the full-screen SETNAYAN overlay covers the ceremony. Buying a 2nd ₱2,500 day changes nothing. | `lib/panood-watermark.ts:109` anchors solely to `firstLiveAt`; `lib/panood-control.ts:167-169` writes once; prod trigger `trg_panood_first_live_at_immutable` confirmed enabled. `broadcast/page.tsx:126-127` passes `paid: owned` — a **boolean**, so order #2..N are invisible. `broadcast/actions.ts:99-107` deliberately has *no* paid gate: "`setLive` MUST reach the DB on a free event: it stamps the write-once anchor." Prod: event `fba4a392…` holds **2 paid PANOOD_SYSTEM orders (₱5,000) against 1 anchor**; event `044f7e64…` has burned its anchor with **zero orders**. | Consume an *order*, not an event-lifetime anchor: stamp `orders.expires_at = now+24h` on approval (or a `panood_day_passes` row) and have `decideWatermark` read the latest unconsumed pass. Also decide whether the free-tier press-live should stamp at all. | **Yes** |

> Note: `canStartBroadcast` in `lib/panood-watermark.ts` has **zero production callers** — the couple is not blocked from going live, they just lose the clean feed they paid for.

---

## 3. Advertising falsely

Promises a visitor or a signed-in couple can see, that we cannot keep.

**A. `/pricing` sells five things no code path can sell.** All five are `is_active=true` and carry the terracotta **"Live"** chip, under copy that says "Each SKU is marked Live, In build, or Coming soon so you know what works today."

| SKU | Price | Reality |
|---|---|---|
| `PAPIC_ADDON_THANK_YOU` | ₱2,499 | **Zero implementation.** No route, no table, no renderer, no `eventSkuActive` call. Only a display-label map. Meanwhile the couple-facing `site-editor.tsx:938` shows it as a `soon`-badged card. |
| `PAPIC_ADDON_STORIES` | ₱2,000 | **Already shipped free.** `lib/guest-stories.ts:18` — "FREE TIER — no entitlement gate, no price." Every guest gets it at `/papic/me/[token]`. The same /pricing page then claims it "Deliberately EXCLUDES Guest Stories (paid / inactive)." |
| `SEATING_3D` | ₱2,999 | **Free to everyone.** The 3D lab opens by default; the only control is the `NEXT_PUBLIC_SEATING_3D` kill-switch. The string appears in exactly 3 files, all pricing surfaces. |
| `PABATI` | ₱1,299 | Feature is built and hard-gated on `eventSkuActive('PABATI')`, but the **only** purchase route is the ₱15,000 `PAPIC_UNLOCK` bundle. No standalone drawer. |
| `LIVE_WALL` | ₱2,500 | Same shape — built, gated, bundle-only. Sold standalone at ₱2,500, but `live-wall-card.tsx:29-42` dead-ends a buyer with no Papic ("set up your Papic crew first"). |

Both `THANK_YOU` and `STORIES` were flipped active by the same blanket sweep, migration `20270710619774` ("all our features should now be active"). That sweep is the root cause of most of this section.

**B. `CUSTOM_QR_GUEST` is listed under "Free, always" at ₱0 — and demands a payment screenshot.** Prod row is `0.00, is_active=true` (an admin edit on 2026-07-01, no migration). `formatV2Sku` returns `0`, not null, so the studio page renders "₱0.00" beside a "Brand my guests' QRs" drawer that hard-rejects submission without a BDO/GCash reference + screenshot (`checkout/actions.ts:487-489`), then waits 24h for admin approval. Mitigating: a *default* free per-guest QR does ship via the Invitation page; what's unreachable is the branded/print variant. `PAKULAY` is the only other ₱0 row and it is correctly `is_active=false`.

**C. `HIGH_RES_ARCHIVE` is sold "₱999/yr" and granted forever.** Buy trigger label is literally `Keep Full-Res · ₱999/yr` (`studio/papic/page.tsx:473`). No activation hook stamps `expires_at` (only `EVENT_SUBDOMAIN` gets `stampAnnualSubscriptionWindow`), so the renewal-reminder RPC — which filters `expires_at IS NOT NULL` — can never see it. Year 2 is never billed and never asked for. *(The seat also flagged `PATIKTOK_COMPILER` "/day"; that half was refuted — `per_day` there is a documented display unit for a flat per-event charge, and the buy card correctly shows "Add Patiktok · ₱1,499" with no suffix. Do not "fix" it.)*

**D. The ₱15,000 "Unlock all of Papic" card lies twice and hides a ceiling.**
- Copy at `studio/papic/page.tsx:429` promises "every add-on (Kwento, Photo Wall, Thank You, Stories, Pabati, **Camera Bridge**)" — Camera Bridge you shelved this morning, Thank You does not exist. `bundle_components` still lists both; commit `094d7c2fb` never touched that table. *(Folds into the already-reported bundle-rot item — same root, wider blast radius than logged: `PAPIC_UNLOCK` has a real buy surface, `PAPIC_UNLOCK_LTD` ₱9,000 has none at all, so its rot only bites admin-granted orders.)*
- "**Unlimited** cameras" is true for cameras but silent on the event-lifetime capture pool it switches on: `clamp(guests × 150, 5000, 30000)` points, hard-stop, applied **only** to pass buyers (`papic_event_pool_config.pass_service_codes`). A per-camera buyer has no event ceiling. `fetchEventPoolStatus` has exactly one caller — post-capture, shooter-facing. The ₱15,000 buyer learns about it when a shot is refused mid-reception.

**E. The retired "Papic Ltd" rung is still on sale in the studio.** `papic_tier_config.ltd` and `PAPIC_CAMERA_LTD_DAY` are both `is_active=false` (retired 2026-07-20), and `publicPapicLadder()` exists precisely so "an admin deactivating a tier removes it from every surface at once." `/pricing` obeys it; the logged-in picker does not — `studio/papic/page.tsx:544` maps the hardcoded `PAPIC_RUNGS = ['mini','ltd','unlimited']`, `fetchCameraRates` has no `is_active` filter, and the server action doesn't re-check. A couple gets billed ₱50/camera/day at **1.4 pts/peso** when the active Mini rung gives **2.0**. It provisions and captures fine — it's simply the withdrawn, worse-value rung.

**F. Onboarding shows three deactivated SKUs at ₱0 and auto-adds them.** `/onboarding/wedding` screen "Boost & enhance" renders a hardcoded 12-card list; `papic_seats` (₱2,999), `advanced_website` (`PRO_WEBSITE` ₱7,999) and `papic_guest` (₱500) are all `is_active=false`, miss the catalog lookup, degrade to `{set:0,label:''}`, and print "₱0". Worse, `PICK_TO_INAPP` pre-adds them (reception → papic_seats), and `papic_seats` maps to a checkout slug, so "Purchase Now" routes to `/studio/papic` for a product advertised free. The file **documents the rule it breaks** at `onboarding-shell.tsx:1143-1144`: "a retired SKU drops out of the catalog → **would otherwise render at ₱0**."

**G. Structured data on `/pricing` over-claims to crawlers and AI shoppers.** Three separate defects in the JSON-LD `@graph`:
1. `buildAvailability` (`pricing/page.tsx:340`) maps everything except `'not_built'` to `schema.org/InStock` — so `LIVE_WALL` and `EVENT_SUBDOMAIN`, which the visible card labels "In build", publish as in-stock.
2. Recurrence is stripped from every non-`per_28d` SKU (`:364-376`) — **Live Studio ₱2,500/day publishes as a flat ₱2,500**; a 3-day event is really ₱7,500. Same for `PATIKTOK_COMPILER`, `EVENT_SUBDOMAIN`, `HIGH_RES_ARCHIVE`.
3. The graph maps over the **raw** catalog, not `resolvedGroups` — so it emits an Offer for `HIGH_RES_ARCHIVE` (rendered nowhere on the page) and for `PAPIC_CAMERA_ROLL_DAY`, the legacy alias `publicPapicLadder` deliberately hides. A shopper can be shown two ₱100 "Papic Mini" products.

---

## 4. Misleads developers

These cost nothing today and will cost you a Saturday later. Ranked by how likely each is to become the *next* PANOOD-class bug.

1. **`LAPSED_SUBSCRIPTION_SKUS` is 11 dead v1 codes** (`lib/subscriptions.ts:48-65`). The expiry sweep runs lazily on three dashboards and matches **zero rows on every call** — no paid order has ever reached `status='lapsed'`. The three SKUs that *do* get an `expires_at` (`EVENT_SUBDOMAIN`, vendor branch/custom prefixes) are all absent from the list. This is a safeguard that presents as live and is inert. Same failure class as the two bugs already found.
2. **`eventActiveSkus` omits the internal/founder grant that `eventSkuActive` honors** (`lib/entitlements.ts:603-661` vs `:531-561`). Founder/internal-hosted events pass the per-SKU gate but fail the Papic prerequisite and show buy pills on the Studio/Suite grids. Two prod events are in exactly this state.
3. **`SETNAYAN_AI_SUB` has no catalog row in prod**, though its seed migration is recorded. Both price resolvers return null, so `submitOrderAction` keeps the **client-supplied** amount and the approval hook grants `cyclesFromAmount(x, null) = 1`. Unreachable today (`setnayan_ai_per_user_enabled` is NULL) and half of the documented go-live step is "flip the SKU active" — but re-seed the row now so the flip is safe.
4. **`PAPIC_CAMERA_MINI_DAY` is missing from `BUILD_STATUS`** → defaults `'not_built'` → its public Offer says `PreOrder` while its legacy alias says `InStock`. One line.
5. **`addon-detail-view.tsx:90-99` reads ownership with a bare `.eq('service_key')`** — no alias, bundle, comp, internal or founder expansion, on a page whose siblings all route through `eventSkuActive`. Currently inert (the two alias SKUs have no detail page), but it's a landmine in the exact spot the last one was.
6. **The `−20% onboarding promo` is real code and completely unwired** (`onboarding-shell.tsx:1162`, `:4579-4585`). It renders a struck-through total and a discounted "amount due"; `handleFinish` threads no voucher, and prod `discount_codes` holds one expired `grant_tokens` row. Today it's dead — the whole paywall tail is filtered out when `EXPERIENCE_QUIZ_ENABLED` is on, and it *is* on in prod. **Flip that flag off and it becomes an instant CHARGES_WRONG.** Delete the promo block rather than leave the tripwire.
7. **`ADD_ON_SKU_MAP.papic = []`** with the comment "0012 SKUs slot in here once the catalog rows land" — literally the shape of the bug you fixed. Inert only because `resolveAddOnState` is called with `'panood'` and nothing else. Same for `FEATURE_BUNDLE_SKU` holding only `panood`.
8. **Comment rot, everywhere pricing is discussed.** `v2-catalog.ts` BUILD_STATUS quotes ₱1,499 for `STD_PREMIUM_OPENINGS` (999), ₱2,499 for `SEATING_3D` (2,999), ₱2,499 for `LIVE_WALL` (2,500), ₱500 for `KWENTO` (299). `pricing/page.tsx:276-279` and `pricing-data.ts:137` both assert "Kwento + Pabati + Stories owner-locked FREE" while all three are active and paid. `entitlements.ts:363-366` says "Thank-You/Guest retired" about a SKU /pricing badges Live. `lib/pabati.ts:13` says "the catalog deliberately keeps PABATI='not_built'" while `v2-catalog.ts:129` says `'live'`. **Strip peso figures from comments entirely** — the catalog is the price authority.
9. **Homepage `pricing-data.ts` price fallbacks (incl. `CAMERA_BRIDGE` ₱500/day) are almost certainly dead code.** Two independent seats grepped and found `PricingData.groups` is never rendered — `PricesOverlay` was rewritten 2026-07-04 into a summary card reading only `pricing.aiPrice`. **I'm ruling this MISLEADS_DEV, not ADVERTISES_FALSELY, and downgrading the already-logged `WEBSITE_GALLERY_UPLOAD`/`WEBSITE_MAP_LINKING`/`WEBSITE_THEMES` item with it** — don't spend a PR treating it as customer-facing. It still needs the `priceOf → null` cleanup before anyone re-wires a full overlay.

---

## 5. Dropped by the skeptics

Six proposals died. This is how you calibrate the rest.

| Proposed | Why it died |
|---|---|
| **"`LIVE_WALL: 'partial'` is a stale blocker — flip it to `'live'`"** | The comment block directly above says the opposite: Camera Bridge and Live Wall are **"HELD as 'partial' … owner-confirmed hold"**, applied at the same moment sibling SKUs were flipped live. The wall's own files say "dark-launched (P1)", and a `LIVE_WALL` buyer with no Papic gets a dead end. Flipping it would reverse an owner decision on a code read, and it *under*-promises — nothing is charged or blocked. |
| **"`initialize-maya` never applies VAT — 12% shortfall"** | The route has **zero callers** (`initializeMaya` in `routes.ts` is never invoked; the modal that "intercepts this shape" is imported by nothing), its only output table `manual_payment_logs` has **0 rows** vs 32 orders, and the DB fn that would read it is documented in three places as dead. VAT rate is 0 today, so both paths agree byte-for-byte. Contingent tax exposure on unreferenced code, not a sell-vs-deliver gap. |
| **"Internal/founder host definition includes `wedding_planner_external` → a staff coordinator makes a couple's event free"** | `eventSkuActive` is a *render* gate. The store CTA (`resolveAddOnState`) reads `orders` directly and never touches it; no checkout path consults it. Nothing becomes free. Prod has 1 internal user + 1 founder seat (same person), and all their moderator rows are self-owned. Real authorization-scope note; not this audit's shape. |
| **"Onboarding −20% promo overcharges by 20%"** | The screen it lives on is filtered out of the sequence whenever `EXPERIENCE_QUIZ_ENABLED` is true — and prod proves the flag is on (7 events carry `experience_persona`, including a birthday event that can only exist with the flag on, through the most recent signup). Downgraded to MISLEADS_DEV and kept in §4 as a tripwire. |
| **"`SETNAYAN_AI_SUB` charges the client-supplied price"** | Unreachable: `setnayan_ai_per_user_enabled` is NULL, so the buy UI renders "Coming soon". The documented go-live step already includes activating the SKU. Also misdiagnosed — `resolvePaxPricedOrderCentavos` has no `is_active` filter, so a *present-but-inactive* row would price correctly; the defect is the missing row. Downgraded to MISLEADS_DEV. |
| **"`PABATI` blocks a paid customer"** | `eventSkuActive` is bundle-aware and `PABATI` is a component of the **active, purchasable** `PAPIC_UNLOCK` — whose drawer names Pabati in its own copy. The entitlement is obtainable. Downgraded to ADVERTISES_FALSELY (no standalone buy path), which is the same position as `LIVE_WALL`/`STORIES`/`THANK_YOU`. |

Four further claims were confirmed but **re-rated down** by the skeptics: `CUSTOM_QR_GUEST` (a free default QR *does* ship — only the branded variant is unreachable), the Papic Ltd rung (deliverable and correctly priced — just withdrawn), `PAPIC_ADDON_THANK_YOU` (no standalone buy path exists, so nobody is a blocked *paid* customer), and `HIGH_RES_ARCHIVE` (over-delivery, and the corpus already struck a stronger version of this claim as a fabricated citation).

---

## 6. Needs an owner decision

Stated as questions, not "review this."

1. **Are Guest Stories, Kwento and Pabati free or paid?** Your 2026-07-08 Pricing Lock and four separate code comments say free; the live catalog charges ₱2,000 / ₱299 / ₱1,299. Stories has already *shipped* free with no gate, so that one is a live contradiction. Pick one and I'll make the catalog and the comments agree.
2. **Is 3D Plan a ₱2,999 SKU or part of the free Seat Plan?** Today it's advertised paid and delivered free, with no gate and no buy path. If paid, the lab needs an `eventSkuActive` gate *and* a drawer before the price can stay up.
3. **Do `LIVE_WALL`, `PABATI`, `PAPIC_ADDON_STORIES` and `PAPIC_ADDON_THANK_YOU` sell à-la-carte, or only inside `PAPIC_UNLOCK`?** If bundle-only, deactivate the four rows and they drop off /pricing automatically. If à-la-carte, four drawers need building (and Thank You needs building *at all*).
4. **Is Couple Website PRO retired for good?** If yes I close the doorway. If it comes back, it must be repriced below ₱3,998 — its two components now sell standalone for less than the umbrella.
5. **Should Live Studio stay ₱2,500 *per day*?** If yes, it needs a per-day pass table + migration. If it's really one-price-per-event, change the billing period and the label — that's a one-row edit and no code.
6. **Should `CUSTOM_QR_GUEST` be ₱0 (auto-granted, no payment flow) or restored to a real price?** Someone set it to 0 by hand on 2026-07-01 without unwiring the paywall.
7. **Does the ₱15,000 Papic pass get a stated capture ceiling, or does the word "unlimited" come out?** The pool itself is sound margin protection — the silence isn't.
8. **Is `PAPIC_UNLOCK_LTD` ₱9,000 still a product?** Once `CAMERA_BRIDGE` leaves `bundle_components` it has exactly one component (`LIVE_WALL`) and no buy surface anywhere.

---

## 7. Fix order

Smallest-safe-first. Each PR ships independently.

**PR 1 — Stop selling retired SKUs (PURE CODE).** *Highest value; closes the only live overcharge.*
1. `.eq('is_active', true)` on `formatV2Sku` (`lib/v2/sku-catalog-v2.ts:182`), `resolvePaxPricedOrderCentavos` (`lib/v2-catalog.ts:534`), and the Studio hub price read (`studio/page.tsx:114`).
2. Replace `RETIRED_BUNDLE_CODES` in `submitOrderAction` with a generic hard-reject: a `service_key` with no *active* catalog row cannot create an order (never fall through to the client price).
3. Delete `FALLBACK_PRICE_PHP` in `studio/indoor-blueprint/page.tsx` — without this, step 1 doesn't close that door.
4. Flip the `website-pro` and `indoor-blueprint` add-on cards to `coming_soon`.

**PR 2 — Unblock paying vendors (PURE CODE).**
5. Rewrite `isVendorProActive` to read `vendor_profiles.tier_state` via `resolveVendorTier` + `tier_expires_at`; delete `PRO_TIER_SKUS`.

**PR 3 — Catalog honesty sweep (NEEDS MIGRATION, decisions 1–3 first).**
6. Deactivate whatever §6 decides: `PAPIC_ADDON_THANK_YOU`, `PAPIC_ADDON_STORIES`, `SEATING_3D`, and (if bundle-only) `PABATI` + `LIVE_WALL`.
7. Delete the `CAMERA_BRIDGE` rows from `bundle_components` for both `PAPIC_UNLOCK` and `PAPIC_UNLOCK_LTD` — `094d7c2fb` deactivated the SKU but never touched the bundle table.
8. Same PR, code side: correct the ₱15,000 card copy at `studio/papic/page.tsx:429` and set the matching `BUILD_STATUS` entries to `not_built`.

**PR 4 — Public-surface truth (PURE CODE).**
9. Feed the Papic rung picker from `publicPapicLadder()` instead of `PAPIC_RUNGS`, and reject inactive rungs server-side in `purchasePapicExtras`.
10. Filter `INAPP_KEYS` (and the `PICK_TO_INAPP` auto-seed) to keys that resolved from the live catalog, so a retired SKU drops its onboarding card instead of printing ₱0.
11. Delete the `−20% onboarding promo` block from the services-summary totals.
12. JSON-LD: map `'partial'` → `PreOrder`; emit a `UnitPriceSpecification` for every non-`one_time` billing period; build the graph from `resolvedGroups` rather than raw `customerSkus`.
13. Add `PAPIC_CAMERA_MINI_DAY: 'live'` to `BUILD_STATUS`.

**PR 5 — Zero-price + subscription windows (NEEDS MIGRATION, decisions 5–6 first).**
14. Either auto-grant ₱0 SKUs (skip the drawer, use the existing `sku-activation.ts` `CUSTOM_QR_GUEST` hook) or restore a real price.
15. Add an activation hook stamping `orders.expires_at` for `HIGH_RES_ARCHIVE` — it feeds the existing renewal-reminder RPC for free.
16. Rebuild `LAPSED_SUBSCRIPTION_SKUS` as a catalog read (`billing_period <> 'one_time'` + the two vendor prefixes), or delete the sweep.

**PR 6 — Live Studio day-passes (NEEDS MIGRATION, decision 5 first).**
17. Consume an order rather than `first_live_at`; decide whether a free-tier "Go live" burns the window.

**PR 7 — Comment + dead-code hygiene (PURE CODE).**
18. Strip all peso figures from `v2-catalog.ts` BUILD_STATUS comments; delete the "owner-locked FREE" claims in `pricing-data.ts:137` and `pricing/page.tsx:275-279`; fix `lib/pabati.ts:13` and `entitlements.ts:363-366`.
19. Union internal/founder into `eventActiveSkus`.
20. Swap `addon-detail-view.tsx`'s bare `.eq('service_key')` for `eventSkuActive` / `eventOwnsSku`.
21. Make `priceOf` return `null` on a catalog miss and filter nulls in `pricing-data.ts` (kills the `CAMERA_BRIDGE` + three `WEBSITE_*` literals before anyone re-wires the overlay).
22. Re-seed `SETNAYAN_AI_SUB` at `is_active=false` so the documented go-live flip is safe *(this one is NEEDS MIGRATION — split it out if PR 7 must stay pure)*.