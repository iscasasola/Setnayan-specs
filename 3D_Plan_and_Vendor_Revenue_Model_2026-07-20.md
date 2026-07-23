# 3D Plan Pricing + Vendor Revenue Model — Working Session

**Date:** 2026-07-20 · **Status:** ⚠ WORKING DOC — owner design session, NOT locked, NOT yet in `DECISION_LOG.md`
**Scope:** competitive position of 3D Plan → its pricing → the vendor revenue model it forced open (inquiry gate, commission replacement, lock fee).
**Method:** market scan (9 web searches, sources §7) + repo grounding + owner-led design across ~20 turns.

> ## 🔔 OWNER DECISIONS APPLIED 2026-07-21 — read before anything below
>
> **Six** of this doc's open items were settled by the owner and are now folded in (the table below has six rows — an earlier pass said "four" and was miscounted):
>
> | # | Decision | Where |
> |---|---|---|
> | 5 | ⭐ **Booking Fee trigger = the VENDOR PREPAYS TO SEND their finalized proposal** — a gate on sending, not an invoice afterwards. *(Owner CORRECTED this within the same day: it supersedes both the original "first recorded payment" AND the interim "customer accepts → fee".)* | §3.0d · **§3.0d-scope, §3.0d-i, §3.0d-ii, §3.0d-iii** |
> | 5b | **Fee scope widened — shortlist and vendor-website transactions carry it too** (*"any transactions to shortlist and websites will have booking fee"*) | §3.0d-scope |
> | 9 | **Vendor subscription ladder must be RE-COSTED** — explicitly NOT settled (*"we still need to access and recost the price subs of the vendors"*) | **new §3.0f-recost** |
> | 6 | **Cap CONFIRMED at ₱4,000/vendor** — *"until 4k/vendor"* | §3.0 (unchanged) · stale ₱7,500s corrected in §3.0f, §5, sign-off 18 |
> | 7 | **Tokens RETIRED** — *"there should be nothing that needs token anymore"* | §4.4a |
> | 8 | **No market-price comparison, ever** — observe offer-vs-declaration only; never expose a vendor as under/overpriced | §3.0a boundary box · §3.0b rung 5 DELETED |
> | **10** | ✅ **Customer protections SCOPE TO THE DECLARED AMOUNT** — *"1. yes"*. A couple who under-declares with their vendor loses recourse on the difference; **the customer becomes the enforcer** | **new §3.0m-a** · sign-off 3m-1 |
> | **11** | ✅ **The declared price determines WHICH MARKET SEGMENT Setnayan boosts the vendor into** — *"whatever they declare will be the market we will boost them to. this affects their services and target market"* | **new §3.0m-a** · sign-off 3m-2 |
>
> ⚠ **PROPOSED IN THE SAME EXCHANGE BUT NOT CONFIRMED — do NOT read these as decisions:** the **high-water delta rule** for upward price revisions (§3.0m-c · sign-off 3m-b) was offered in answer to the owner's own question about the under-declare-then-adjust bypass and **the owner did not explicitly accept it**; **median-of-completed-and-reviewed bookings + a minimum count** as the basis for segment placement (§3.0m-e · sign-off 3m-c) is an assistant proposal against the mirror risk. Both are written as options with their reasoning, **not as rules.**
>
> 🚨 **AND THE MIRROR RISK, stated with equal weight (§3.0m-d):** decision 11 **inverts above the cap.** The fee caps at ₱4,000 at ₱300,000, so **the marginal fee rate above ₱300,000 is ZERO** — declaring ₱1,000,000 costs exactly what declaring ₱300,000 costs, and buys a better market. It cannot be faked on a *live* booking (the customer must accept the inflated price; inflated proposals lose real deals) but **it can be faked on a staged one: one fake ₱1M booking with a friend costs ₱4,000 and buys premium placement.** Whether that is cheap or expensive is an **owner judgement** — the arithmetic is in §3.0m-d and no recommendation is made.
>
> ⚠ **Also retracted in this pass, not decided:** *"until 4k/vendor"* had been rendered as *"₱4,000 per vendor **per booking**"*. **The owner said "per vendor" and did not disambiguate** per-booking vs per-vendor-per-event vs per-vendor-lifetime — an order-of-magnitude difference. Now **open sign-off #3c-unit**; the doc carries per-vendor-per-event as a stated assumption only.
>
> 🚨 **What the owner did NOT decide, and is now open because of these:** whether a vendor is **refunded or credited if the customer walks after they already paid to send** (§3.0d-iii · sign-off 3d-iii-b) · whether *"you pay when your client says yes"* may still be **published** when the fee is charged at send (§3.0d-iii · sign-off 3d-iii-a) · **where the prepaid gate sits on the shortlist and website paths**, which have no proposal-send chokepoint (§3.0d-scope · sign-off 3d-iv) · whether a vendor's verified range may be **shown to couples at all** (§3.0a · sign-off 13b) · **peso prices for the meters tokens used to carry** (§4.4a) · **the whole subscription ladder** (§3.0f-recost). None was invented here.
>
> ✅ **And one thing the correction FIXED:** the cancellation / non-payment hole that the interim acceptance trigger opened is **closed** — a prepaid gate leaves no invoice to chase and nothing to void (§3.0d-i). The old sign-off 3d-i is resolved, not carried.

> **Why this is a working doc and not decision rows:** several numbers here **supersede owner-locked, shipped prices that are days old** (the 2026-07-10 vendor pricing finalization; the ₱200 flat token confirmed 2026-07-15 / PR #3138; `SEATING_3D` ₱2,999). None of it is written to the catalog. Nothing here is live. §6 lists what needs sign-off before any of it moves.

---

## 0 · TL;DR

**3D Plan has no competitor.** The market splits into pro floor-plan software (real venue, no people, no commerce) and virtual-event platforms (avatars and booths, fake venue, no real event). 3D Plan sits in the wall between them, and the vendor booth inside a real couple's room has **no comparable at any price.**

**The model that emerged (⭐ final shape in §3.0):**

> ### Free unlimited inquiries. Minimal Booking Fee — from ₱50, never more than ₱4,000. You keep 98%, and more as you grow.

Vendors join free, are found free, and talk to couples free. They pay only when they **win** — a marginal-bracket fee whose **effective rate only ever falls** (2.00% → 0.40%), continuous at every boundary so there is nothing to shave, **PREPAID BY THE VENDOR TO SEND their finalized proposal** (owner-corrected 2026-07-21 — a gate on sending, superseding both the first-payment trigger and the interim acceptance trigger; §3.0d). Because it is prepaid there is **no invoice to chase and nothing to void** (§3.0d-i), and misdeclaration becomes **largely self-punishing** — under-declaring means under-charging the customer by the same amount (§3.0d-ii). ⚠ But *"you pay when you win"* is now **conditional**: the fee gates the *send*, not the *win*, and **whether a vendor is refunded when a customer walks is an OPEN sign-off** (§3.0d-iii). **The fee also covers shortlist and vendor-website transactions**, not just the lock path (§3.0d-scope). Clients they **import are free forever**. Declared prices build a verified median used to **position and match them — observed internally, never published as a price verdict** (owner 2026-07-21, §3.0a). A four-tier subscription carries the 3D booth, tools, and a **Booking Fee buy-down** — and doubles as the autopay rail. **Tokens are RETIRED** — nothing needs a token any more (owner 2026-07-21, §4.4a).

**🔑 WHY DECLARATION STAYS HONEST WITHOUT ENFORCEMENT (§3.0m).** Three forces, no policing: **(1)** a high-water delta on upward revisions makes the under-declare-then-adjust bypass save exactly ₱0 *(⚠ **PROPOSED, not owner-confirmed** — sign-off 3m-b)*; **(2)** ✅ **customer protections scope to the declared amount**, so the **customer** becomes the enforcer (owner-confirmed); **(3)** ✅ **the declared price sets the market segment Setnayan boosts you into**, so under-declaring is immediately self-inflicted damage (owner-confirmed). 🚨 **But force 3 INVERTS above the cap:** the marginal fee rate above ₱300,000 is **zero**, so declaring ₱1,000,000 costs the same as ₱300,000 — **over-declaring is free and buys better placement.** It can't be faked on a live booking, but **a staged ₱1M booking with a friend costs ₱4,000 and buys premium placement.** Owner judgement, arithmetic in §3.0m-d.

**🚨 "0% commission" is RETIRED** (§3.0-i) — a percentage of deal value *is* a commission whoever holds the money, and **whenever it is charged**. New claim: ***"Free until you book, then up to 2%."***

**The through-line:** charge for demand you *created*, never for the introduction — and **price on what you observe, never on what they declare.**

**Retired with reasons in §4 (do not re-propose):** the inquiry gate · 5%-of-declared-sale · the flat ₱500 lock fee · price-banding · lock allowances.

**The finding that reframes everything (§7b):** every 0%-commission business — Rightmove, Zola, The Knot — monetizes supply, and every one first had to **own demand**. *"We need another way to earn"* has one honest answer: **at 63 events, the constraint isn't the revenue model. It's the 63.**

---

## 1 · Competitive position (the finding that started it)

| Capability | Closest in market | Why it's not the same |
|---|---|---|
| 3D digital twin of a real venue | Prismm (Cvent), 3D Event Designer, Merri, Tripleseat Floorplans | Planner/venue tool. **Guests never see it.** |
| Guest seat-finding | Please Find Your Seat, SeatYourself, Wedibox, DigiSeats, Venued, SeatScan, Simplify Tables, SeatPlan.io | All 2D or a flat floor-plan image. **Guest searches their own name; no path animation found anywhere.** |
| Vendor booths + avatars + co-presence | vFairs, MootUp, rooom, Communiqué, Sarcon | Virtual trade shows. **The venue is fictional; no physical event underneath.** |
| Vendor reviews at the booth | BrideVue, Pearl (David's Bridal) | Reviews live in a flat directory. **Nothing renders them in 3D.** |

**Two camps, and a wall between them.** Camp A has the real venue and no people. Camp B has the people and no real venue. **3D Plan is Camp A's substrate running Camp B's mechanics** — plus a review/booking layer neither attaches to a booth.

**Market comp for Enterprise:** Prismm charges venues **~$150/mo (≈₱8,700)** for the floor-plan tool alone. Enterprise at ₱7,999–9,999 is at or under that, for strictly more. **Venues are the Enterprise buyer and 3D Plan is the reason.**

⚠ **Build-state caveat:** repo checkout `/Users/icecasasola/setnayan-db-push` showed **no realtime-presence code, no `BoothVendorCard`, no `SEATING_3D`** — consistent with the shared room being slice 8 (designed, unbuilt) and/or a stale checkout. **Co-presence and in-booth reviews are design, not shipped.** Verify against the right checkout before any of this becomes a public claim.

---

## 2 · 3D Plan pricing

### 2.0 ⭐ THE LINE: private is free, public is paid (owner 2026-07-21)

> ***"Build it free. Pay when your guests walk it."***

| **FREE — authoring + exploration** | **PAID ₱999 (or vendor-sponsored) — guest-facing** |
|---|---|
| The 2D seat-plan editor (already free; already the authoring truth) | Publishing to the event website / `/[slug]` |
| Walking, navigating, **playing** the 3D room yourself | Guest access: scan QR → find your seat → the wayfinding walk |
| Camera, wayfinding preview, layout iteration | **Vendor booths rendering in the room** |
| Seat-plan PDF export | Day-of / live mode · any shareable public link |

**The boundary must be exactly this explicit** — *"integration"* is too vague to implement against.

**Why this shape is right:**
- **The sunk-effort dynamic is honest.** A couple spends an hour arranging the room, hits the publish gate, and **keeps everything** — plan, PDF, editor. You charge for distribution, never holding their work hostage. That's the version of this pattern that doesn't breed resentment.
- **Free editing costs ~₱0** (procedural assets, client-side render, no per-use compute) and every free room is layout + seat data plus an invested couple.
- Consistent with the shipped 2D editor already being free.

**🚨 CONSEQUENCE — this couples the vendor booth to the couple's wallet.** A vendor pays for a 3D booth; if the couple never publishes, no guest walks the room and the booth is worth nothing. At ~8% couple conversion that's **~1 in 12 weddings with a published room** — starving the inventory the vendor add-on sells.

**⇒ Vendor-sponsored activation is therefore the PRIMARY path, not an option.** A vendor holding the 3D variant publishes the room for their client — *"your photographer unlocked the 3D plan for your wedding."* Couple free, vendor gets a room to stand in plus visible generosity in front of their client, Setnayan gets the inventory. **₱999 is the couple's alternative, not the expected route.**

**Accepted:** some couples will use the free editor purely for internal planning and never publish. Fine — they were never the ₱999 buyer, they remain on the platform, and their vendors remain lockable.

### 2.0b Avatars — authoring and materialization (owner 2026-07-21)

**Authoring is already specced** by the 2026-07-19 council verdict — three actor-scoped makers, no fourth editor: couple → Design panel in `/seating/lab`; vendor → "Your booth" tab on the cocktail surface; guest → **3-tap sheet on the venue walk**.

**Vendor authors THREE objects:** the **booth** (chassis from owner-authored, taxonomy-mapped templates) · the **staff avatar** (service-typed from the 28-category taxonomy — caterer→server, photographer→camera, florist→bloom; zero vendor effort, sidesteps CSP entirely) · and the **poster**.

**The poster** — shown on booth activation, fronting the `BoothVendorCard` pop-up. ⚠ **Decide: activation-only, or also in-world on the booth's back wall when idle?** In-world-always is worth more to the vendor and noisier in the couple's room; activation-only matches the "money can't shout in a couple's room" rule.

> ### ✅ RESOLVED 2026-07-21 — **UPLOADS WORK. THE CSP CLAIM IS A MYTH.**
>
> The council verdict's *"CSP forbids fetched assets — vendor 3D/texture uploads are architecturally impossible in V1 and must not be promised"* is **FALSE**. Verified in `/Users/icecasasola/setnayan-wt-propose-lock`:
>
> - **The app ships ONLY `frame-ancestors 'self'`** — no `img-src`, no `connect-src`, no `default-src`, no nonce (`next.config.ts:113`, with a comment saying so explicitly). `middleware.ts` and `vercel.json` set no CSP.
> - **TWO shipped paths already load uploaded images as WebGL textures:** `BoothSign` (`app/_components/plan3d/venue-objects.tsx:379`) does a real `THREE.TextureLoader` fetch of `logo_url` with `crossOrigin='anonymous'`; `GuestPhotoAvatar` (`plan3d/guest-avatar.tsx:53`) does the same for selfies — its own comment names **R2 + CORS** as the mechanism.
> - **R2 CORS already allows `GET`** on all five buckets (`scripts/r2-cors.sh`).
>
> **Source of the myth:** four code comments that meant *offline-first / no asset pipeline* and said *CSP* — `kit/booth-props.tsx:16`, `kit/outfits.ts:23`, `scene-lighting.tsx:16`, `venue-decor.tsx:25` — plus a wrong *"same-origin display URL"* claim at `venue-objects.tsx:374` (it is a **cross-origin presigned R2 URL**). **These have been shaping design decisions; fix the comments in a small PR** or the myth regenerates.

**🚨 LIVE BUG, worth more than the banner feature: shipped logo branding does NOT render on the public guest walk.** `/[slug]/venue` sources from the `public_venue_scene` SECURITY DEFINER RPC, which **does not select `vp.tier_state`** → `boothCanBrand` fails → **every public booth renders generic today.** The Pro branding vendors would pay for is invisible in the one place guests see it. Latest RPC: `supabase/migrations/20270718464682_public_venue_scene_v7_entrance_kind.sql`.

#### Per-event banner (owner 2026-07-21) — buildable now

**Owner ask: a place to upload their banner/design FOR THAT EVENT, with their official logo also showing.**

**Per-event scoping is itself the aesthetic guard** — a vendor designing *for this couple* produces a different artifact than a vendor pasting a house ad. This resolves the "ad breaking the fourth wall" worry **without** needing the structured-template system previously recommended here.

**Path (mirrors what already works):**
1. `<FileUpload bucket="media" pathPrefix="vendors/{id}/events/{eventId}/banner" />` — existing widget (`app/_components/file-upload.tsx`), presigned PUT direct to R2
2. Store the `r2://` ref **per `(vendor, event)`** — new column on `event_vendors`, **not** on `vendor_profiles` (the logo stays global there)
3. Resolve server-side via `displayUrlForStoredAsset()` during scene assembly (`lib/uploads.ts:99`)
4. Add `bannerUrl` to `BoothVendor` (`lib/seating-3d.ts:1165`) as **optional**, so cached payloads still parse
5. Render as a `BoothSign` clone; reuse the refcounted texture cache from `guest-avatar.tsx:44`

**Four real constraints — none of them CSP:**
- ⚠ **24h presigned TTL** silently expires inside cached scene payloads → unbranded fallback. **Logos and banners are public marketing assets: serve them from the public R2 domain instead of presigning.** Removes the failure mode entirely.
- **Reuse the QR-in-media guard** (`lib/vendor-qr-media-guard.ts:278`) — it already rejects logos containing QR codes; a banner is a more obvious smuggling vector.
- **CORS origins match exactly** — any new production domain must be added to `r2-cors.sh` or textures fail with a masked network error.
- **Tier gate** — product decision: same `boothCanBrand` (pro/enterprise) as the logo, or its own?

#### Materialization matrix — who actually renders

**Privacy first:** a published room with named guest figures at specific seats discloses the couple's guest list to 200 people (RA 10173). The shipped wayfinding flow is deliberately scoped — the QR binds to *that* guest and answers *"where am I seated,"* it does not hand them the room. **Default: the crowd is anonymous; identity is opt-in and scoped.**

| Figure | Renders when | Identity level |
|---|---|---|
| **You** (viewer) | Always, on the guest walk | Own avatar, named |
| **Your tablemates** | Published + that guest opted in | Name label, generic body |
| **Everyone else** | Published | **Generic mannequin, no name** |
| **Couple / honorees** | Always | Named, styled — they are the event |
| **Vendor staff** | Published + vendor holds the 3D variant | Service-typed, vendor-branded |
| **Coordinator** | Planning mode only, never guest-facing | Named |

**This also sets the performance budget** — instanced generic mannequins for the crowd, individualized meshes only for the viewer, tablemates, couple and vendor staff. That is the seated-crowd LOD item already in the 3D Plan backlog.

**🔑 SEPARATE THE TWO GUEST CONSENTS.** Customizing your avatar and being **visible to other guests** are different decisions and must be different toggles. Many guests want a nice figure for their own walk without broadcasting their name and seat to 200 people. **Customization is a preference; visibility is a disclosure.** Bundling them means the fun thing silently opts you into the privacy thing. Default visible-to-others **OFF**; tablemates-only as the middle setting. **DPO review.**

**✅ The vendor half has no privacy dimension** — a business presence the vendor authored, on a booth they paid for. **It can and should ship independently of the guest side**, since it is the revenue half.

⚠ **The mannequin identity fork (§6 #10) now gates this too** — it has blocked three things: a revenue feature, the vendor booth pitch, and guest materialization.

### 2.1 The SKU

- **Couples: ₱999 one-time per event** to publish (charm-priced, sits with Animated Monogram ₱999 and STD openings ₱999). This **reprices `SEATING_3D` ₱2,999 → ₱999** rather than retiring it, and resolves the live fake-door contradiction (priced SKU, free ungated feature).
- **Vendor-sponsored activation:** a booked vendor holding the 3D variant can activate the room **free for the couple** — *"your photographer unlocked 3D Plan for your wedding."* Couple gets it free, vendor gets a room to stand in and visible generosity, **you get inventory.** This is the mechanic that stops the couple price from starving booth supply.
- **Watch:** activation rate. If it stalls under ~15%, the vendor-sponsored path is carrying it and the couple price should drop toward free.

### Storefront ≠ ads (keep these separate)

| | Booth add-on | Ads |
|---|---|---|
| Where | Rooms the vendor was **booked** for | Demo + discovery rooms |
| Why they're there | The couple hired them | They paid |
| Paid with | Subscription variant | ⚠ **Pesos — TBD.** *(was "Tokens"; tokens retired 2026-07-21, §4.4a. Ads have no price yet.)* |

**Money can never buy placement in a real couple's room.** Placement comes from the booking. Locked in the 2026-07-19 council verdict and reaffirmed here — it's what keeps guests trusting booths, which is what makes the inventory worth anything.

### V1 customization scope — what can actually be sold

**Yes:** logo BoothSign (shipped) · chassis variant from an owner-authored, taxonomy-mapped template set · offerings + card items + pricing + photos + reviews + Book CTA · staff garment outfit/colour (`staffGarmentTexture` exists) · curated procedural props · pinned promo · media prominence · front-desk embed slot.

**No, and must not be promised:**
- **Uploaded wall art / banners / custom textures.** CSP blocks fetched assets. Vendor 3D/texture uploads are architecturally impossible in V1.
- **Free-form colour.** Accent is constrained to a band **harmonized to the couple's palette.** A booth that clashes reads as an ad breaking the fourth wall.
- ~~**Facial likeness / photo→avatar** — blocked by the matte-white mannequin fork.~~ **✅ CORRECTED 2026-07-21: the fork is CLOSED.** [`Chibi_Rig_Production_Spec_2026-07-19.md`](3D_Avatar_Maker_2026-07-19/Chibi_Rig_Production_Spec_2026-07-19.md) §10 (V4) puts **faces IN** — nose always-on, eyes ×4, mouths ×4, marks ×4 — on a **chibi** character system that supersedes the blob/mannequin everywhere. Figures are **not** featureless. **Photo→avatar remains ₱0 on-device tint-only** (outfitColor now, skinTone/hair buckets later), never uploaded, never stored — that lock is unchanged. §11 (V5, owner 2026-07-21) adds the **seamless-silhouette directive**: no visible round joints, fixed by *overlap* (not merging — merging would explode the instanced-crowd batch count), enforced by a new **overlap law** unit test.

### Service-typed staff avatars (owner idea, 2026-07-20)

Derive the booth's staff avatar from the vendor's **taxonomy category** — caterer→server, photographer→figure with camera, florist→bloom, coordinator→clipboard.

- Zero vendor effort, **sidesteps the CSP limit entirely** (no uploads needed)
- The room becomes readable without text — "the scene is the nav" applied to vendors
- ~28 sets authored once, reused forever; marginal cost stays ₱0 so "unlimited" holds
- Makes the add-on visibly worth paying for: grey placeholder → uniformed staff at a branded booth

**Differentiation stack:** service avatar (taxonomy) → garment colour (banded) → logo sign → props. Category legibility first, individual identity second.
**Build cost to scope:** ~28 authored sets. Consider launching with the top 6–8 categories by vendor count.

---

## 3 · The vendor model

> **⚠ READ §3.0 FIRST — it SUPERSEDES §3.1–§3.4.** The model changed materially late in the session: the meter moved from **inquiries → locked events**, banding moved from **declared price → category**, and **verified median pricing** appeared (and is arguably the session's biggest idea). §3.1–§3.4 are kept as lineage — they record *why* each earlier shape failed, which is the part that stops the same ideas being re-proposed.

### 3.0 ⭐⭐ FINAL SHAPE — Minimal Booking Fee + free unlimited inquiries

> **THE OFFER:** **Free unlimited inquiries. Minimal Booking Fee — from ₱50, never more than ₱4,000. You keep 98%, and more as you grow.**

#### ⭐ THE SCHEDULE — FLAT 2% RATE (owner-directed 2026-07-23, final)

> **⚠ SUPERSEDES the marginal tax-style brackets (owner-final 2026-07-21).** Owner 2026-07-23, verbatim: *"the charge starts at 2500 to get 50 pesos, stays 2% until it reaches 4,000 from 200,000 then locks at 4,000 even if the cost is higher."* One flat rate, no brackets. Canonical live version = **`apps/web/lib/booking-fee.ts`** (PR #3560). The marginal-bracket table is retained as lineage in the collapsed block below. *(An interim 2026-07-23 pass read "linear, ₱4,000 at ₱300k" as 1.3333%; the owner then pinned the exact numbers → flat 2%, cap at ₱200k.)*

**The fee is a flat 2% of the booking, floored and capped.** Three primitives: **rate 2%**, **₱50 minimum** (2% × ₱2,500 = ₱50, so the fee bottoms at ₱50 for bookings ≤ ₱2,500), **₱4,000 cap** (2% × ₱200,000 = ₱4,000, so the fee locks at ₱4,000 for bookings ≥ ₱200,000).

| Booking | Fee | Effective | Vendor keeps |
|---|---|---|---|
| ≤ ₱2,500 | ₱50 (floor) | — | — |
| ₱10,000 | ₱200 | 2.00% | 98.0% |
| ₱50,000 | ₱1,000 | 2.00% | 98.0% |
| ₱100,000 | ₱2,000 | 2.00% | 98.0% |
| ₱200,000 | ₱4,000 | 2.00% | 98.0% |
| ₱500,000 | ₱4,000 | 0.80% | 99.2% |
| ₱1,000,000 | ₱4,000 | **0.40%** | **99.6%** |

**✅ CONTINUOUS.** The ₱50 floor meets the line at ₱2,500 (2% × ₱2,500 = ₱50); the line meets the cap exactly at ₱200,000 (2% × ₱200,000 = ₱4,000). A flat **2%** across the linear span; the effective rate only falls *above* the cap.

**🔑 ONE RATE UP TO THE CAP.** Unlike the superseded declining brackets, every vendor pays the same 2% until the ₱4,000 cap; only bookings past ₱200,000 see a falling effective rate as the lock takes over. Simple to explain ("2%, never more than ₱4,000").

<details><summary>⚠ SUPERSEDED lineage — the marginal-bracket schedule (owner-final 2026-07-21, replaced 2026-07-23)</summary>

Marginal tax-style brackets: ₱50 flat ≤₱2,500 · 2.0% to ₱50k · 1.5% to ₱150k · 1.0% to ₱300k · ₱4,000 cap at ₱300k. Effective rate fell 2.00% → 0.40%; ₱10k→₱200, ₱150k→₱2,500, ₱300k→₱4,000. Replaced 2026-07-23 by a single flat 2% (cap reached at ₱200k, not ₱300k) — simpler, and the owner pinned the exact numbers.
</details>

**✅ CAP LEVEL CONFIRMED 2026-07-21 — owner, verbatim: *"lock fee is what we designed already. until 4k/vendor."*** The marginal-bracket schedule above stands unchanged; **₱4,000 is the ceiling.**

✅ **DECIDED 2026-07-23 (§6 #3c-unit) — the cap's UNIT is PER VENDOR × EVENT.** The owner confirmed the ₱4,000 cap is the most a vendor pays for one event (two events = up to ₱8,000), matching the `(vendor, event)` ledger key (#20) and §3.0-iii's *"a lock is an EVENT engagement."* The three readings were materially different money — the middle one is now locked:

| Reading | A vendor with 6 bookings on one event | A vendor with 40 bookings in a year |
|---|---|---|
| **Per vendor × booking** | up to ₱24,000 | up to ₱160,000 |
| **Per vendor × event** | ₱4,000 | up to ₱4,000 × events |
| **Per vendor, lifetime / per period** | ₱4,000 | ₱4,000 |

**Everything downstream — the revenue estimate, the `UNIQUE` key on the fee ledger, the high-water revision rule (§3.0m) — keys on this.** The whole doc is written on **per vendor × event**; the owner's 2026-07-23 decision confirms that reading, so the `booking_fee_ledger` UNIQUE(vendor_profile_id, event_id) key is locked. ⚠ Note the revenue estimate now uses the **linear 1.3333% rate** (below the old bracket-based ~₱2.4M/yr — recost when building).

**⚠ Cap level — ₱4,000 at ₱300,000 (owner, superseding ₱7,500 at ₱900,000).** Roughly a **47% cut on every large booking** — at 600 events/yr with one venue each, ~**₱2.4M instead of ₱4.5M** from the top of the market. Bought in exchange for near-certain compliance and a far better sentence: ***"never more than ₱4,000."*** Coherent with the standing compliance-over-collection posture; revisit with lock-rate-by-deal-size data.

**🏆 THE LINE THIS HANDS YOU: *"You keep 98% — and more as you grow."*** It inverts the framing entirely — nobody hears a cut being taken, they hear what they keep. Against a 25%-commission platform that ends the conversation.

**📊 Interactive schedule widget built 2026-07-21** (slider + dual-axis fee/effective-rate chart). **Ship it as the vendor pricing page** — no PH competitor publishes anything like it, and it is the concrete proof behind the transparency claim made about *vendors'* prices in §3.0a.

#### ⚠ SUPERSEDED — the coarse-band schedule (lineage)

Killed because **bands create cliffs and cliffs create shaving.** ₱10,000 paid 1.5% and ₱10,001 paid 4%, so a vendor selling ₱26,000 could declare ₱24,999 and save ₱400 — a gap small enough to read as a scope change and therefore **below the noise floor of any detector**. Finer bands shrink the payoff; taken to the limit you get the continuous rule above. *(Owner spotted this: "they will have a range… declare it at a lower price but not too low to show discrepancy.")* **The interactive slider is what makes coarse bands unnecessary — coarse bands existed to make a printed TABLE readable; a lookup needs no bands at all.**

| Deliverable value | Booking Fee |
|---|---|
| Up to ₱3,000 | ₱50 |
| ₱3,001 – ₱10,000 | ₱150 |
| ₱10,001 – ₱25,000 | ₱400 |
| ₱25,001 – ₱50,000 | ₱800 |
| ₱50,001 – ₱100,000 | ₱1,600 |
| ₱100,001 – ₱200,000 | ₱3,200 |
| ₱200,001 – ₱375,000 | ₱5,800 |
| Above ₱375,000 | ₱7,500 *(⚠ superseded — the cap is **₱4,000**, owner-confirmed 2026-07-21; see §3.0)* |

| Term | Value |
|---|---|
| **Inquiries** | **Free · unlimited · every tier, forever** |
| **Imported clients** | **Free forever** — §3.0e |
| **Billed** | ⚠ *(superseded twice — this row records the original retired first-payment trigger: "on first payment recorded; voided if cancelled before any payment". It was briefly replaced by an acceptance trigger, which is **also** superseded. **Live rule = the vendor PREPAYS the fee to SEND their finalized proposal, §3.0d**; refund-on-walk-away OPEN, §3.0d-iii)* |
| **Unit** | One lock per `(vendor, event)`, valued on the TOTAL engagement — §3.0-iii |

**🔑 A PRICE LIST, NOT A PERCENTAGE.** *"Our fee for a booking in this range is ₱1,600"* is a service charge; *"we take 2% of your sale"* is a commission. Same money, different relationship — and a published table suits the transparency position (§3.0a) that every PH competitor's *"contact us for pricing"* cannot match.

**Marketing line: *"Booking fees start at ₱50."*** Concrete, small, and the opposite of a contact form. Lead with it.

**⚠ Know what you traded.** A schedule **cannot** be a flat 2% — the effective rate runs **~1.5% at each band top and up to ~4–5% just inside a band bottom** (₱10,001 pays ₱400 = 4%). That is the inherent cost of banding.
- **The cliff is DETECTABLE, which converts it from a leak into a tripwire:** declarations bunching at ₱2,999 / ₱9,999 / ₱24,999 / ₱99,999 show up instantly on a histogram. **Add boundary-bunching to the fraud bot as a first-class signal (§3.0b).**
- The ₱50 and ₱150 entry bands are a floor by another name — a deliberate reversal of the earlier "no floor" call, chosen to keep the smallest vendors comfortable. Real event engagements below ₱10,000 are rare.

**⚠ Cap level is a live trade *(⚠ superseded — this records the ₱7,500-vs-₱15,000 deliberation; the cap has since been set at **₱4,000**, owner-confirmed 2026-07-21 "until 4k/vendor", §3.0)*. Owner chose ₱7,500 over ₱15,000:** ₱15,000 would hold ~2% to ₱750k; ₱7,500 collects less but removes the evasion incentive at the top where the absolute number gets uncomfortable. **Better to collect 0.75% of everything than 2% of only what can't hide.** Revisit with lock-rate-by-deal-size data.

#### 3.0-i ⚠ IT IS A COMMISSION — "0% commission" is RETIRED

> ⚠ **PREMISE CORRECTED 2026-07-21 — the conclusion survives, the original argument did not.** This section originally read *"a percentage of deal value **triggered by payment** is a commission."* **The fee is no longer triggered by payment** (§3.0d: it is prepaid to send the finalized proposal), so that sentence would now argue the naming decision from a false premise. The corrected argument is below; the retirement of *"0% commission"* stands, and stands on stronger ground than before.

**A percentage of deal value is a commission — the trigger is irrelevant, and so is who touches the money.** Brokers and recruiters take commission without processing a peso; a percentage collected *in advance* of the deal is, if anything, more obviously a commission than one collected after, because there is not even a delivered service to point at. Calling it a "transaction fee" (which means payment processing) is the kind of thing a vendor works out in month three and tells other vendors about.

**Note what the prepaid gate does NOT change:** the base is still the deal value, the rate still scales with it, and the vendor still experiences it as a cut of their sale. Moving *when* it is charged does not move *what* it is.

**Name it the Booking Fee.** Own it. The claim is still excellent:

> ***"Free until you book, then up to 2%."***

Against 25% commission platforms, and against The Knot at **$200–1,200/month with no success requirement**, that wins. And *"0% commission"* was never differentiating here anyway — **Bridestory already advertises "No Admin Fee"** (§7b).

⚠ **This supersedes an owner-lock across `Pricing.md`, the ground-truth doc, and public copy** — a real corpus change, not a wording tweak. **BIR:** gross receipts either way under the 8% flat regime; no tax consequence to the naming.

#### 3.0-ii ⚠ SUPERSEDED LINEAGE — "Why the fee sits at the lock, not the lead"

> 🚨 **THIS SECTION IS SUPERSEDED BY §3.0d AND CONTRADICTS IT. Kept as lineage; do not cite it as current.**
>
> It was written when the fee sat at (or after) the lock. **Under §3.0d the fee is charged at the vendor's PROPOSAL SEND — which is after the lock but before the customer accepts, and therefore before the win is certain.** The section below argues that the fee lands at "the value moment" and that this *"kills the Thumbtack/Bark complaint."* **Neither claim is safe under the current mechanism** — §3.0d-iii records that a vendor can pay to send and have the customer walk, which is *precisely* the Thumbtack/Bark grievance, and sign-off 3d-iii-b (refund or credit?) is open exactly because of it.
>
> **What survives intact:** the *"why not meter leads"* half. Charging per inquiry is still retired (§4.1), and the fee still sits far downstream of the lead. **What does not survive:** any claim that the fee lands only on proven value.

*(Original text, unedited:)*

The value Setnayan delivers only becomes real when the customer locks the service *(owner, and it's right)*. Metering leads charges before value is proven; the lock is the value moment — and it **kills the Thumbtack/Bark complaint** (paying for leads that never convert), the single most hated thing about lead-gen platforms.

**Why the earlier flat ₱500 lock fee failed and this doesn't:** flat killed the ₱900 florist (55%). **Proportional is absorbed like any input cost** — ₱18 on ₱900, ₱1,600 on ₱80,000. §3.4a's pass-through rule bites *disproportionate* fees, not proportionate ones.

**Why value-based pricing is now legitimate** (it was rejected in §4.2b/c): the enforcement stack (§3.0b) makes the declared value **observed**, not asserted — couple-witnessed, card-bound, inclusion-checked, bot-screened. The rule *"price on what you observe"* is satisfied. **Every weakness in couple-confirmation is now a direct revenue exploit.**

#### 3.0-iii Boundary: a lock is an EVENT engagement

Priced on the engagement for that event, **not a single item.** A ₱900 arrangement is not a lock. If small-goods retail ever runs through the platform (0018 supplies vertical) it needs a different motion entirely — lock metering does not fit it.

#### 3.0-iv ⚠ MOSTLY SUPERSEDED — Collection, when the fee was a receivable

> 🚨 **The premise of this whole section — that Setnayan raises an invoice and must then collect it — is retired by §3.0d.** A prepaid send gate produces **no receivable**: the vendor pays, or the proposal does not go. Read §3.0d-i before building anything here.
>
> | Item below | Status under the prepaid gate |
> |---|---|
> | Autopay mandate at signup | ⚠ **Re-purposed, not required.** Nothing to auto-debit; the vendor pays at the moment of send. Still wanted for the *subscription*. |
> | Batch monthly, never per lock | 🚫 **INVERTED.** The fee is now charged **per send**, which is the opposite of batching — and it **re-opens the cost problem the batching solved**. See the new note below. |
> | Suspension ladder on failed charges | 🚫 **Not needed for the fee.** Non-payment is self-enforcing: the proposal simply does not send. Still applies to *subscription* dunning. |
> | Rail steering / never show "fee + processing" | ✅ **Survives, and matters more.** |
> | Confirm the rail before speccing | ✅ **Survives, and is now blocking** — there is no fee at all without a live gateway on the send action. |
>
> 🚨 **NEW PROBLEM THE PREPAID GATE CREATES, and it is not small: per-send gateway economics.** Monthly batching existed because a ₱15 bank transfer on an ₱8,000 invoice is 0.2%, while card processing on a small amount is punitive. **Charging per send destroys the batch.** At the ₱50 floor, a card or e-wallet charge costs roughly ₱15–35 — **30–70% of the fee, and possibly more than it.** Options: a **prepaid fee balance** the vendor tops up (a wallet — note the irony against §4.4a) · absorbing gateway cost below some threshold · a minimum charge · settling small fees on the subscription invoice (which re-introduces a receivable for exactly the cases where it is cheapest to carry). **✅ RESOLVED 2026-07-23 (§6 #3e-ii): split by component — Setnayan absorbs the % (~3.5%), passes the fixed ~₱15 card fee to the vendor as INCLUSIVE card pricing (never a surcharge line). At the ₱50 floor on card the vendor pays ₱65 and Setnayan nets ~₱47.72; GCash payers have no fixed fee to pass. The fixed-cost pass-through is what dissolves the floor problem.**

*(Original text follows, retained as lineage.)*

Settlement happens off-platform, so there is no fee to deduct before remitting. **An invoice you can't withhold against is just a request.**

- **Autopay mandate at signup** — stored card / GCash auto-debit authorised on join. Monthly invoices charge automatically.
- **Batch monthly, never per lock.** On a ₱8,000 monthly invoice: card ≈ ₱295 · GCash ≈ ₱200 · **bank transfer ≈ ₱15 (99.8% net)**. Steer rails: bank transfer first, GCash second, cards last.
- **Do NOT show "2% + processing" as two lines** — that's the surcharge pattern (card-scheme + BSP exposure) and it reintroduces the "what else are they adding" feeling. Either absorb (~₱15,000/yr at current scale) or quote inclusive. **Keep the headline number clean.**
- **Suspension ladder on failed charges:** 0–7d retry → 7–14d new locks blocked → 14–30d **booth dark, verified median frozen, badge lost** → 30d+ delisted. *The booth and the median are the leverage — both visibly lost in front of couples.*
- **⚠ Confirm the rail before speccing:** corpus has **PayMongo "under evaluation" (V1.5)**, GCash Merchant API as probable, while the **Maya gateway is BUILT-but-dormant** (needs KYC + a `'paid'` webhook) and Setnayan Pay rails are all `is_active=FALSE`.

**⚠ Structural weakness to hold in view:** ~~a booking fee charges *after* delivery — a receivables problem.~~ ✅ **RESOLVED 2026-07-21 by the corrected mechanism (§3.0d).** The Booking Fee is now **prepaid to send the finalized proposal**, so it charges *before* delivery, not after — there is no receivable and no collection risk. **The subscription is therefore no longer needed as the rail the booking fee collects on.** It still matters as a feature bundle and a fee buy-down (§3.0f) — and, per §3.0f-recost, it is now where the *value capture* has to live, since the fee itself is minimal and capped at ₱4,000.

#### 3.0a Verified median pricing — the biggest idea in the session

> ### 🔒 BOUNDARY — owner-decided 2026-07-21, governs this whole subsection
>
> **Owner, verbatim:** *"we do not expose them if they are underpriced or overpriced, we only watch what they offer and what they declare from us."*
>
> **Setnayan OBSERVES two things and compares them to each other: what a vendor OFFERS (their card / their quotation) and what they DECLARE to us.** Setnayan does **not** compare either to the market, and **never surfaces a verdict on a vendor's price position** — not to couples, not to competitors, and not to the vendor themselves.
>
> **Permitted:** using the observed record internally to match, rank, budget-fit and slot a vendor into builds; showing the vendor **their own** record. **Prohibited:** any surface, badge, sort label, tooltip or message that renders as *"this vendor is cheap / expensive / below market / above market."*

**Declared prices from locked bookings accumulate into a verified MEDIAN, and that is the figure Setnayan matches and positions them on internally.** Their price stops being a claim and becomes a record. Post ₱500k, declare ₱100k three times, and you *are* a ₱100k vendor here.

⚠ **What changed 2026-07-21:** the earlier text said the median *"becomes what Setnayan sells them at"* and that understating is *"public reclassification as a budget vendor."* **The reclassification is real; the word `public` is now wrong.** The consequence is internal — matching, budget-fit and build-solver slotting — not a published price verdict.

**Both directions self-correct — honesty becomes the only stable strategy:**

| Vendor does | Consequence |
|---|---|
| Under-declares to save fees | Repriced down **in how Setnayan matches them**; matched to budget couples; floods with leads they can't serve |
| Over-declares to look premium | Fewer leads; the record won't support it |

**The enforcement is that the card is how Setnayan MATCHES them** — Setnayan AI recommends them at that price, Merkado's build-solver slots them into builds at it, budget matching uses it. Understating isn't a saved fee; it's a **reclassification of the demand they receive**. **For a premium vendor, price IS the positioning — which inverts the usual fraud gradient: the higher the ticket, the more the lie costs.** That's precisely what broke sale-declaration (§4.5).

🚨 **⚠ READ §3.0d-ii BEFORE TREATING ANY OF THIS AS FEE PROTECTION.** The owner's corrected billing mechanism (prepaid finalized proposal, §3.0d) makes under-declaring **structurally self-punishing** — the declared number *is* the proposal the customer pays against, so shrinking it means charging the customer less by the same amount. **The verified median is therefore no longer needed to protect the fee.** Its remaining justification is *matching, budget-fit and build-solver positioning* — a good argument, but it must now stand on its own merits rather than borrowing anti-fraud necessity. **The one thing it still genuinely defends against is the §3.0d-ii residual leak** (a token in-app proposal with the real deal off-platform), via rung 4 self-consistency.

⚠ **And this is where decision 8 costs something.** The mechanism's force came partly from **visibility** — a vendor understating had to live with a public record that contradicted their pitch. With exposure removed, the consequence is a **quieter, slower** one: worse-fitting leads, felt over months, never explained. **It still works, but it stops being a deterrent a vendor can anticipate and becomes an outcome they experience.** At 63 events that force is close to nil (§3.0h's own condition). Priced in deliberately; named here so it is not rediscovered as a surprise.

**Three guards, or premium vendors revolt:**
1. **Median or range, never a point** — one discount must not redefine them; trim outliers.
2. **Non-market bookings excludable** (family rate, comped, off-season) — flagged, capped, outside the public signal. Without this, vendors stop discounting *or* stop declaring.
3. **Minimum sample (~3 locked bookings)** before any verified range shows; until then their own stated "from" price stands.

**Structured variation, or vendors publish nothing:** base package + inclusions = **binding**; defined add-ons priced and optional; season/date modifiers declared up front. Then *"from ₱100k"* is true and enforceable rather than meaningless.

**Why this may outrank 3D Plan strategically:** every competitor (The Knot, Kasal, Bridestory, WeddingWire) shows vendor-*asserted* prices or hides them behind an inquiry form — their model depends on **not** having real prices. ***"Real prices from real weddings"*** is a couple-facing promise none of them can match. It also makes Setnayan AI budget planning, Merkado's build-solver, and Pro price-position intel run on transacted data instead of claims.

⚠ **This is a positioning bet, not a pricing detail** — owner decision in its own right (§6 #13), not something to inherit as a side effect of a lock meter.

🚨 **OPEN SIGN-OFF created by decision 8 — do NOT resolve silently (§6 #13b).** Decision 8 clearly prohibits **exposing a price VERDICT** ("underpriced / overpriced"). It does **not** obviously prohibit **publishing the vendor's own verified range on their own card** — a factual *"real weddings with this vendor ranged ₱80k–₱120k"* is a record, not a comparison. But it is exposure of price, and *"real prices from real weddings"* (the couple-facing promise above, and the reason this may outrank 3D Plan strategically) **depends entirely on which reading holds.**
>
> **Two readings, both defensible:**
> - **Narrow** — publish the vendor's own verified range; never compare it to anyone. The promise survives intact.
> - **Broad** — no price figure derived from our records is shown to couples at all; the median is a purely internal matching input. The promise collapses to *"we match you on real budgets"*, which is materially weaker.
>
> **The owner ruled on comparison, not on publication.** Deciding this here would silently kill or silently keep sign-off #13. **Left open.**

#### 3.0b Enforcement stack (strongest first)

> 🚨 **STATUS CHANGED 2026-07-21 — most of this stack lost its job.** The owner's corrected billing mechanism (§3.0d: the vendor **prepays to send** a finalized proposal that *is* the customer's number) makes misdeclaration **largely self-punishing**, so the ladder below is no longer the model's main defense. **§3.0d-ii is the authoritative rung-by-rung reconciliation** — read it before building any of this. Kept here because (a) rung 4 is the primary residual detector against the §3.0d-ii off-platform leak, and (b) rungs 2–3 still protect *listing accuracy*, which is a real product concern independent of the fee. **Do not build this stack as though the fee depended on it. It no longer does.**

1. **Couple confirmation — ⚠ DEMOTED (was LOAD-BEARING).** *(See §3.0d-ii: the finalized proposal is itself the couple-witnessed document, so confirmation is no longer what makes the number honest. Retained for dispute history and as a product feature.)* The declared amount appears on the proposal, contract, and the couple's budget ledger; the couple confirms the figure they agreed to. **A vendor cannot understate a number the counterparty is looking at**, and the couple gains nothing from colluding. If confirmation ever becomes optional, the entire protection collapses back to self-declaration.
2. **Card ↔ booking consistency** — ONE number, not two fields. **Inclusions mandatory at whatever price is declared** (owner's sharpest question: *"what is included in your bundle?"*) — this is what makes a false number unpublishable.
3. **Quote-vs-card detection** — you hold both numbers, so the *system* detects the mismatch and the couple merely confirms. Prompt sits on the quote screen, at the point of friction.
4. **Self-consistency across their own bookings** — internal, safe, no external exposure.
5. ~~**Market-relative outlier triage** — percentile bands on category × location × season.~~ 🚫 **DELETED 2026-07-21 (owner decision 8).** *"We only watch what they offer and what they declare from us."* **No market-price comparison at all** — not as a public signal, and **not even as an internal triage signal**. Do not re-propose; the previous text kept it as internal-only, and that concession is now withdrawn.

**✅ THE BOUNDARY, RESTATED:** Setnayan compares a vendor's **offer** (their card, their quotation) against their **declaration to us** — and against **their own** other bookings. It never compares either to the market. Rungs 1–4 are the whole stack.

**✅ SIGN-OFF #16 IS RESOLVED, NOT OPEN.** The **Philippine Competition Act** exposure came entirely from rung 5. With rung 5 deleted there is no mechanism that could read as enforcing a price floor. The guard below is kept because its *don't-flag / do-flag* table is exactly the right rule and is now structural rather than advisory.

**⚠ Legacy guard (now redundant but correct).** Never tell a vendor their price is *too low*. A platform that questions below-market pricing looks like it enforces a price floor — dangerous ground under the **Philippine Competition Act**, regardless of anti-fraud intent.

| Don't flag | Do flag |
|---|---|
| "Your price is below market" | "Your declared amount doesn't match your card" |
| "You're cheaper than other florists" | "The couple's ledger records a different figure" |
| — | "This booking is far below your own other bookings" |

~~Market comparison is an **internal triage signal only**~~ → **Market comparison is not performed at all** (owner 2026-07-21). **Never a signal, never a stated reason, never a penalty basis.** A genuinely cheap vendor who declares accurately must sail through and hear nothing: **budget vendors are market coverage you want**, and a mechanism that makes them feel policed costs you the entire low-tier supply.

**⭐ THE MISDECLARATION LADDER** *(📍 elsewhere in this doc it is cited as "§3.0i" — **that section does not exist**; the ladder lives here, in §3.0b. Fixed 2026-07-21; note §3.0-i with a hyphen is a different section, the "it is a commission" one.)*

> ⚠ **The ladder is now MOSTLY WITHOUT A TARGET.** It was designed to punish a gap between the declared amount and the actual one. Under §3.0d that gap is structurally hard to open on the canonical path — the declaration *is* the proposal the customer pays. **Scope it to (a) the §3.0d-ii off-platform-substitution leak and (b) listing accuracy, and stop presenting it as the fee's defense.** Building the full ladder to protect a fee that now protects itself is wasted work.

**Reporting rules (so it can't be weaponized):** only **verified interactions** may report (else competitors report each other — in a small PH market they will) · **patterns, not incidents** (one mismatch is custom scope; five is a practice) · **laddered consequences** (flag → correct the card → badge at risk → ranking demotion → delisting) · **vendor responds before any action**.

#### 3.0d ⭐ Billing trigger — the PREPAID FINALIZED PROPOSAL (owner-corrected 2026-07-21)

> **Owner, verbatim (the CORRECTED flow — this supersedes BOTH earlier designs):**
> *"customer sends lock. vendor, accepts lock with dedicated finalized proposal which will compute the booking cost. the vendor pays setnayan to send finalized. the customer pays the vendor. and continues the process."*
>
> *"whatever the customer accepts the price of the vendor (this creates a handshake confirmation that the price is true to their plan)."*

**The fee is a PREPAID GATE ON SENDING, not an invoice raised afterwards.** This is the single most important sentence in this section, and it is what makes the mechanism different from both the retired first-payment trigger and the interim acceptance trigger.

| Step | Who acts | What happens to the fee |
|---|---|---|
| 1. Customer sends a **LOCK** to the vendor | Customer | Nothing. Free. |
| 2. Vendor accepts the lock and attaches a **FINALIZED PROPOSAL** | Vendor | The proposal amount **computes** the fee. Nothing charged yet. |
| 3. **Vendor pays Setnayan to SEND the finalized proposal** | Vendor → Setnayan | ⭐ **FEE IS PAID HERE, BEFORE THE PROPOSAL IS RELEASED.** Unpaid ⇒ the proposal does not send. |
| 4. Customer receives the proposal and **accepts the price** | Customer | The **handshake** — acceptance confirms the number is true to their plan. No second charge. |
| 5. **Customer pays the VENDOR directly, off-platform** | Customer → Vendor | Setnayan never holds the money. Unchanged. |

- **Fee base = the finalized proposal price** — which is the same number the customer accepts. One number, authored by the vendor, witnessed by the customer.
- **Acceptance is not the billing trigger.** Acceptance is the *handshake confirming the base was true*. The money moved at step 3.
- **Setnayan is never in the payment path** between customer and vendor. The only money Setnayan touches is the vendor's own prepaid send fee.

⚠ **This RETIRES two earlier designs, not one:**
1. the original *"billed on first payment recorded, voided if cancelled before any payment"*, and
2. the interim *"billed when the customer accepts the quotation"* (the 2026-07-21 first pass).

Everything written against either — including the old argument that *"a fee at approval delays locking"* and *"the fee follows the money"* — is superseded. **The fee now strictly precedes the money, by design and by mechanism.**

⚠ **The revenue-critical surface is the PROPOSAL SEND, and it is NOT BUILT.** It is not the couple's payment ledger (0007) and not a generic acceptance event. It is the **Proposal Maker** — design only, known gap `pricing_basis` on `vendor_package_items` — **plus a payment gate wired in front of its send action**. The Booking Fee cannot be metered at all until both ship. This is the model's hardest build dependency. *(The 0007 ledger stays useful as a couple feature and a cross-check; it is not load-bearing for revenue.)*

##### 3.0d-scope ⭐ The fee is NOT limited to the lock path (owner 2026-07-21)

> **Owner, verbatim:** *"any transactions to shortlist and websites will have booking fee."*

The lock → finalized-proposal path above is the *canonical* flow, not the only one. **Transactions originating from the shortlist and from vendor websites carry the Booking Fee too.**

| Origin | Fee applies? |
|---|---|
| Lock → vendor accepts → finalized proposal | ✅ Yes — the canonical path (§3.0d) |
| **Shortlist** — customer transacts with a vendor they shortlisted | ✅ **Yes** (owner 2026-07-21) |
| **Vendor website** — customer transacts via the vendor's Setnayan-hosted site | ✅ **Yes** (owner 2026-07-21) |
| **Imported clients** the vendor brought themselves | 🚫 **No — free forever** (§3.0e, absolute) |

⚠ **OPEN SIGN-OFF (§6 #3d-iv): the shortlist and website paths have no defined send-gate.** The canonical path has an obvious chokepoint — the proposal send. Shortlist and website transactions may not pass through a finalized proposal at all, so **where the prepaid gate sits on those two paths is undefined.** The owner set the SCOPE, not the mechanism for it. Do not assume the proposal gate transfers cleanly.

⚠ **And note the tension with §3.0e.** *"Clients they import are free forever"* is stated as absolute. A vendor's own website visitor is arguably a client the vendor brought — yet the owner put website transactions **in** scope. **The boundary between "imported client" and "came through your Setnayan website" needs a definition** or the free-forever promise develops the asterisk §3.0e says it must never have.

#### 3.0d-i ✅ THE BILLING / CANCELLATION HOLE CLOSES

**This is the mechanism's biggest strength and it should be stated as plainly as the previous version's weakness was.**

Because the fee is **prepaid before the proposal is released**, there is:

- **no unpaid invoice to chase** — the vendor either paid and the proposal sent, or they didn't and it didn't;
- **nothing to void** — there is no accrued receivable sitting against a booking that might evaporate;
- **no receivables risk for Setnayan** — the structural weakness flagged in §3.0-iv (*"a booking fee charges after delivery — a receivables problem"*) **does not apply to this design**;
- **no suspension ladder needed for fee non-payment** — non-payment is self-enforcing, since it simply stops the send.

**On collection, this is strictly better than both earlier designs.** The retired first-payment trigger depended on detecting that money moved off-platform. The interim acceptance trigger created a billable event that could convert to ₱0 and gave the vendor a grievance identical to the Thumbtack/Bark complaint this model claims to kill. **The prepaid gate has neither problem.**

⚠ **But the risk did not vanish — it MOVED, and it moved onto the vendor.** See §3.0d-iii. The owner chose the mechanism; the owner did **not** choose what happens to a vendor who has already paid to send and then loses the client.

#### 3.0d-ii Misdeclaration becomes largely SELF-PUNISHING — and that retires most of the enforcement design

**Reason it through.** The declared amount *is* the finalized proposal the customer actually receives and pays against. There are no longer two numbers — a "declared" one for Setnayan and a "real" one for the couple. There is one document, and it is the one the customer holds.

**Therefore: a vendor who under-declares to shrink the fee must also under-CHARGE the customer by exactly the same amount.** To save ₱1,450 on an ₱80,000 job, they must send an ₱80,000 job's proposal at a lower price and then be paid that lower price. **Lying costs more than the fee it avoids, always, at every bracket.** The incentive to misdeclare is now **structural rather than policed**.

🚨 **SAY IT PLAINLY: this retires most of the anti-misdeclaration machinery in §3.0a and §3.0b.** Carrying dead enforcement design forward is its own defect, so here is what actually survives:

| Mechanism | Status under the prepaid finalized-proposal gate |
|---|---|
| §3.0b rung 1 — **couple confirmation** | ⚠ **Largely REDUNDANT for the fee.** The proposal *is* the couple-witnessed document; confirmation is no longer what makes the number honest. Still valuable as a product feature and for dispute history — **but it is no longer the load-bearing revenue protection it was.** |
| §3.0b rung 2 — **card ↔ booking consistency** | ✅ Survives, but demoted — it now protects *listing accuracy*, not fee integrity. |
| §3.0b rung 3 — **quote-vs-card detection** | ✅ Survives with the same demotion. |
| §3.0b rung 4 — **self-consistency across own bookings** | ✅ Survives — **now the primary residual detector** (see the leak below). |
| §3.0b rung 5 — market-relative triage | 🚫 Already DELETED by decision 8. Unchanged. |
| §3.0a — **verified median as fee protection** | ⚠ **No longer needed for that job.** The median's remaining justification is *matching and positioning* (§3.0a), which is a separate argument on its own merits. |
| **The misdeclaration LADDER** (flag → correct → badge → demotion → delisting) | ⚠ **Mostly without a target.** It was built to punish a gap between declared and actual. That gap is now structurally hard to open on the canonical path. **Keep it for the residual leak below and for listing accuracy — but do not carry it forward as the model's main defense.** |

**⚠ THE RESIDUAL LEAK — name it, because nothing in this doc addresses it:**

> ### **Lock on-platform, then move the real deal off-platform behind a token proposal.**

A vendor accepts the lock, pays the fee on a deliberately small finalized proposal — say ₱5,000 for "coordination" — sends it, and then contracts the actual ₱120,000 job entirely off-platform by private agreement. The customer is complicit by default because **a smaller in-app number costs them nothing**, exactly as under the previous design.

**This is now the main evasion path.** Note what it defeats:
- ✅ It defeats the self-punishing logic, because the vendor is *not* under-charging — they are charging in full, elsewhere.
- ✅ It defeats couple confirmation, because the couple confirms a proposal that is genuinely what it says it is.
- ✅ It survives decision 8, which removed the only external (market-comparison) detector.

**What remains against it:** §3.0b rung 4 (a vendor whose every proposal is ₱5,000 is visibly inconsistent with their own category and card), and the §3.0a/§3.0h positioning force (*understate it and you have changed your business, not hidden it* — a vendor whose verified record says ₱5,000 gets matched to ₱5,000 couples). **Both are real but slow, and both are weak at 63 events.**

⚠ **Flagged, NOT solved.** See §6 #3d-ii. This is the honest successor to the old *"quote low in-app, settle high off-platform"* leak — the prepaid gate did not close it, it merely changed its shape from *understating a proposal* to *substituting a token one*.

#### 3.0d-iii 🚨 "Pay only when you win" is now CONDITIONAL — and it must be tested

**The vendor pays BEFORE the customer's acceptance is certain.** The payment gates the **send**, not the **win**. A vendor can pay to send a finalized proposal and have the customer walk away. Under this mechanism they are not refunded by default — **no refund rule exists, because the owner chose the mechanism and not the refund policy.**

So the marketing sentence ***"You pay when your client says yes"*** (§5, §8) is **no longer literally true.** The accurate sentence is *"you pay to send your final proposal."* Whether the marketing claim survives depends entirely on one empirical question:

> **Is a LOCK a genuine commitment signal from the customer, or a browse-level action?**

**MEASURED ANSWER — the shipped `lock` is a genuine commitment, and that is good news for the claim.** Verified in the working checkout at `/Users/icecasasola/setnayan-wt-propose-lock`:

- The lock action is **`finalizeVendor`** — the couple *finalizes* a vendor onto their event. It is not a save, a favorite, or a shortlist add (shortlist is a separate, genuinely browse-level primitive).
- **`apps/web/lib/lock-milestones.ts`** treats it as a commitment in so many words: *"A celebratory acknowledgement of what they just **committed to**"* — *"Congratulations! You have picked a Reception venue!"*
- A lock **gates downstream features**. Save the Date requires the wedding date **plus a confirmed (locked) vendor in both the ceremony and reception groups**. Locking has consequences elsewhere in the couple's plan.
- A lock **consumes scheduling capacity** — `actions.ts` acquires vendor schedule-pool rows atomically before the status write, and a full/closed date **blocks** the lock (`acq.status === 'blocked' || 'locked'`). A browse-level action would not contend for a real resource.
- **`apps/web/lib/payment-gated-lock.ts`** (flag-off) can require the couple to submit the **downpayment with a required screenshot at lock**. The primitive is already designed to carry money-grade weight.

**⇒ A lock is a commitment signal, not a browse action. The claim is defensible in substance.** But three gaps stop it being safe to publish today:

1. 🚨 **The two-sided lock the owner described DOES NOT EXIST.** Shipped, the lock is **unilateral by the couple** — `finalizeVendor` flips status; there is **no vendor "accept the lock" step and no finalized-proposal attachment**. The owner's flow needs the lock to become a handshake (customer sends → vendor accepts → vendor attaches proposal). **That is a build, not a wiring change.**
2. 🚨 **`payment-gated-lock` is OFF and is the wrong gate anyway.** It gates the *couple's downpayment* at lock. The Booking Fee needs a gate on the *vendor's send*. Do not conflate them — they are opposite parties and opposite moments.
3. ⚠ **The claim's truth depends on lock→acceptance conversion, which is unmeasured.** At 63 events with 5 Papic orders ever, there is no conversion data. If most locks convert, *"you pay when your client says yes"* is a fair approximation. If they don't, it is a **marketing-claim risk** — the vendor pays per *attempt*, which is the Thumbtack model this doc claims to kill.

🚨 **OPEN SIGN-OFF (§6 #3d-iii) — TWO questions, neither decided by the owner:**
- **(a)** May the *"pay when your client says yes"* copy stand, given the fee is charged at send? (Requires lock→acceptance conversion data that does not exist yet.)
- **(b)** **Does the vendor get a refund or credit if the customer walks after the vendor has already paid to send?** The owner chose the mechanism, **not** the refund policy. **No rule is invented here.** Options exist (credit toward the next send · one free re-send per lock · nothing) and all are deliberately left unwritten.

#### 3.0m ⭐ WHY DECLARATION IS HONEST WITHOUT ENFORCEMENT — three forces, and the one that runs backwards

**Owner block, 2026-07-21.** The owner asked *"when the vendor changes the price, and goes up. another booking fee? i have fear that they under declare the first and just make a big adjustment after like a bypass."* — and then answered two questions of their own. **Read the confirmed/proposed split below literally: two of the three forces are owner-decided, one is not.**

##### 3.0m-a The two forces the owner CONFIRMED

> **✅ CONFIRMED — owner, verbatim, Q: *"do customer protections scope to the declared amount?"* → A: *"1. yes"***
>
> **Customer protections scope to the DECLARED amount.** Reviews, dispute support, the booking record, and recourse all attach to the number declared on the finalized proposal — and to nothing above it. **A couple who under-declares alongside their vendor loses recourse on the difference.**

> **✅ CONFIRMED — owner, verbatim: *"2. whatever they declare will be the market we will boost them to. this affects their services and target market."***
>
> **The declared price determines WHICH MARKET SEGMENT Setnayan boosts the vendor into.** It affects their services and their target market. This is the §3.0a/§3.0h positioning force, now owner-stated rather than inferred — and note it is stated as *boosting*, i.e. an active placement decision, not merely a passive matching input.

##### 3.0m-b The mechanism, stated whole

**Three independent forces push toward honest declaration. None of them requires Setnayan to police anything.**

| # | Force | Who enforces it | Status |
|---|---|---|---|
| **1** | **High-water delta fee** — under-declare then adjust up, and the revision bills the difference, so the bypass saves exactly **₱0** | The arithmetic | ⚠ **PROPOSED — not confirmed** (§3.0m-c) |
| **2** | **Protections scope to the declared amount** — if the real number lives off-platform, the customer has no recourse on it. **The CUSTOMER becomes the enforcer**, and they are the party with the most to lose | **The customer** | ✅ **CONFIRMED** |
| **3** | **Declaration determines the market you are boosted into** — under-declaring destroys your own lead quality, **immediately and self-inflicted** | **The vendor, to themselves** | ✅ **CONFIRMED** |

**Why this is stronger than the enforcement stack it replaces.** §3.0b was a ladder of detectors Setnayan had to build, run, staff and defend. These three are structural: force 1 is arithmetic, force 2 recruits the counterparty (who is otherwise the vendor's *collusion partner* — see §3.0d-ii's residual leak — and is now given a concrete reason not to be), and force 3 is the vendor punishing themselves in a currency they actually care about. **The §3.0d-ii residual leak — lock on-platform, real deal off-platform behind a token proposal — is the case force 2 was made for:** the couple accepting a token ₱5,000 proposal for a ₱120,000 job is knowingly waiving recourse on ₱115,000. That is the first thing in this model that gives the couple a reason to refuse.

⚠ **Force 2 has a cost that must be said out loud:** it works by **withdrawing protection from a customer**, and some of those customers will be victims rather than colluders — coached, confused, or simply not reading. *"You have no recourse because your vendor understated the price"* is a defensible rule and a bad support conversation. **It needs a consumer-facing framing, a disclosure at acceptance, and probably counsel review** before it is published as policy. Not resolved here — **new open sign-off §6 #3m-a.**

##### 3.0m-c ⚠ PROPOSED, NOT CONFIRMED — the HIGH-WATER DELTA rule for price revisions

> 🚨 **OPEN SIGN-OFF (§6 #3m-b). This is an ASSISTANT PROPOSAL offered in answer to the owner's own question about upward revisions. The owner did not explicitly accept it before moving on. It is NOT a decision and must not be recorded as one.**

**The rule as proposed:**

- **Fee owed on any revision = f(highest total ever declared for that `(vendor, event)`) − fee already paid.**
- **No refund on downward revisions.** Declaring less later does not claw money back.
- **The ₱4,000 cap binds across ALL revisions**, not per revision — so the total a vendor can ever pay on one engagement is still ₱4,000, and revisions can never be used to exceed it.

**Worked example (the owner's exact fear):**

| Step | Declared | f(declared) | High-water | Already paid | Charged now |
|---|---|---|---|---|---|
| Send #1 (under-declared) | ₱20,000 | ₱400 | ₱20,000 | ₱0 | **₱400** |
| Send #2 ("big adjustment") | ₱120,000 | ₱2,050 | ₱120,000 | ₱400 | **₱1,650** |
| **Total** | | | | | **₱2,050** |

*(Check: ₱20,000 → ₱50 + 2%×₱17,500 = ₱400. ₱120,000 → ₱50 + 2%×₱47,500 + 1.5%×₱70,000 = ₱2,050.)*

**Versus declaring ₱120,000 honestly the first time: ₱2,050.** Identical. **The bypass saves ₱0** — which is exactly the property the owner was reaching for, and it is achieved without any detection, any accusation, or any judgement about whether the revision was legitimate. **A genuine scope increase and a deliberate bypass are charged the same, and that is the point** — Setnayan never has to decide which one it was looking at.

**Why the "no refund downward" half is needed:** without it, a vendor sends high, pays, then revises down and reclaims — a free option on the fee. With it, the fee is monotonic in the high-water mark and there is nothing to game in either direction.

**What it costs:** a vendor whose deal genuinely shrinks (guest count halves, package cut) pays on a number they never collected. At a ₱4,000 ceiling that is a small absolute grievance, but it is a real one, and it interacts with **open sign-off 3d-iii-b** (refund when the customer walks) — **both are about money already paid on a deal that did not land as declared, and they should be decided together, not separately.**

##### 3.0m-d 🚨 THE MIRROR RISK — above the cap, force 3 INVERTS and over-declaring becomes free

**This must be read with exactly the weight given to the three forces above. Force 3 is not symmetric.** Below the cap it disciplines under-declaration. **Above the cap it actively rewards over-declaration**, because the fee stops moving while the placement keeps improving.

**The arithmetic, plainly:**

| Declared | Fee | Marginal cost of the next peso declared |
|---|---|---|
| ₱300,000 | ₱4,000 | — |
| ₱500,000 | **₱4,000** | **₱0** |
| ₱1,000,000 | **₱4,000** | **₱0** |
| ₱5,000,000 | **₱4,000** | **₱0** |

> ### **Above ₱300,000 the marginal fee rate is ZERO. Declaring ₱1,000,000 costs exactly the same as declaring ₱300,000 — and per owner decision 2, it buys placement in a ₱1,000,000 market instead of a ₱300,000 one.**

**Two natural limits mean it cannot be faked on a LIVE booking:**

1. **The customer must actually accept the inflated price.** The declared number *is* the finalized proposal the customer receives and pays against (§3.0d-ii) — the same self-punishing logic that blocks under-declaration blocks over-declaration, in the other direction: you cannot inflate the number without inflating the bill.
2. **Inflated proposals lose real deals.** A vendor who quotes ₱1M to win a segment badge loses the ₱300k client they were actually going to book.

**But both limits vanish on a STAGED booking.** A vendor and a friend can run a lock → finalized proposal → acceptance cycle with no money changing hands and no third party to object:

| The staged-booking arithmetic | |
|---|---|
| Cost of one fake ₱1,000,000 booking | **₱4,000** (the cap — the *only* cost, since the marginal rate is zero) |
| What it buys | Placement in the top market segment (owner decision 2), plus a data point toward a premium verified median |
| For comparison — Enterprise subscription, one year | **₱119,988** (₱9,999 × 12) |
| For comparison — one honest ₱300,000 booking | ₱4,000, for a ₱300,000-segment position |

**Note the two things that make it clean rather than merely cheap:** force 2 is irrelevant (a complicit fake customer needs no recourse), and force 1 — even if the high-water rule were confirmed — does nothing, because there is no under-declaration to catch. **The staged over-declaration defeats all three forces at once.** It is the exact mirror of the §3.0d-ii residual leak, and it has not previously been named in this doc.

⚠ **Whether ₱4,000 for a segment jump is CHEAP or EXPENSIVE is an owner judgement, and it is deliberately not made here.** The arithmetic is above. Arguments both ways, stated without a recommendation:

- **Cheap:** ₱4,000 is ~3% of an Enterprise year, one-time, and buys a positioning outcome the subscription ladder charges six figures for. A vendor who does it three times has a fabricated premium record for ₱12,000.
- **Expensive:** ₱4,000 is real money to the PH vendor base this platform is built for, it must be paid up front before any benefit arrives, it requires a willing accomplice, and it is only worth doing if premium placement is actually delivering leads — which at 63 events it is not. **The exploit is worth exactly as much as the platform is, which means it arrives only when there is something to steal.**

##### 3.0m-e ⚠ PROPOSED MITIGATION — median of completed-and-reviewed bookings + a minimum count

> 🚨 **OPEN SIGN-OFF (§6 #3m-c). ASSISTANT PROPOSAL, NOT CONFIRMED. The owner said the declared price determines the market boosted into; the owner did NOT say which declaration, nor how many.** Written as an option with its reasoning, not as a rule.

**The proposal:** the segment a vendor is boosted into is derived from the **median of their COMPLETED and REVIEWED bookings**, not from their latest declaration and not from their maximum one — and **a vendor cannot change segment until they have some minimum number** of such bookings.

**Why each half is doing work:**

| Element | What it defeats |
|---|---|
| **Median, not maximum** | One fabricated ₱1M booking cannot move a median built from real ones. Under a max-or-latest rule a single fake reprices the vendor entirely. |
| **Completed** | A staged booking that never happens never enters the signal. This is the half that costs the attacker something real — they must carry the fiction through delivery. |
| **Reviewed** | Requires the counterparty to act, on the record, after the fact. Cheap for a real client; a second visible favour to ask of a fake one. |
| **Minimum count** | Makes the attack scale linearly: one fake is worthless; moving a median needs several, at ₱4,000 each, each with an accomplice, each carried through completion and review. **It converts a ₱4,000 exploit into an ongoing conspiracy.** |

**What it costs, honestly:**
- **It is slow.** A new vendor cannot be positioned at all until the minimum is met — and at 63 events, almost nobody meets it. The fallback (their own stated price, per §3.0a guard 3) is exactly the self-asserted number this whole model exists to move past.
- **It collides with `3.0a` guard 3's existing "~3 locked bookings" threshold** — these are the same knob and must be one number, not two.
- **A legitimately repositioning vendor is held back.** A photographer who genuinely moves upmarket waits out the minimum.
- ⚠ **"Reviewed" makes reputation a gate on commercial positioning**, which is a bigger product decision than it looks — it hands a couple who never reviews the power to freeze their vendor's segment.

**Alternatives not developed here:** a **taper above the cap** (a small non-zero marginal rate past ₱300,000 — restores a cost to inflation, but breaks the *"never more than ₱4,000"* sentence that the cap was chosen for) · **segment changes require admin review above a threshold** (works, but is exactly the manual-exception load §"solo-operator admin" doctrine tries to eliminate) · **accepting the risk and instrumenting for it** (staged bookings between linked accounts are what `identity_clusters` already computes). **None is chosen.**

#### 3.0e Imported clients — FREE, and it must be absolute

> ***"Bring your existing clients free. Only pay for the couples we find you."***

The moment there's an asterisk on that, the promise stops working.

**⚠ Attribution is SYSTEM-DETERMINED, never vendor-declared** — otherwise every vendor marks every booking an import. Same durable rule.

| Classification | Determined by |
|---|---|
| **Setnayan-sourced** | An on-platform trail exists — found via search / marketplace / brief; inquiry thread opened here |
| **Imported** | Vendor initiated; no prior on-platform inquiry from that couple to that vendor |

**Set at lock time, immutable after.** The vendor never picks; they only see which it is.

**Accept leakage deliberately.** A couple who browses Setnayan then messages on Facebook then gets imported is demand you created and won't be paid for. You *could* chase it with profile-view logs and an attribution window. **Don't** — aggressive attribution generates disputes, and a vendor who feels policed costs more than a missed ₱1,600.

**Free imports are the GROWTH ENGINE, not a leak.** Every imported event brings a real wedding: guest list, a 3D room, guests walking it, a verified booking for the median, and couples who meet the rest of the platform. **You'd rather have 1,000 imported events than charge 2% on 50.** And they still earn — 3D Plan activation ₱999, Papic, Monogram, STD, the couple SKUs. **The Booking Fee is for demand you created; everything else on an imported event is still yours.**

**⚠ Guard:** imported clients need **couple confirmation** too — a real account accepting the connection — or vendors farm fake events to inflate verified past-events and look busy.

#### 3.0f Subscription ladder — the fee buy-down IS the upgrade lever

> 🚨 **THE NUMBERS BELOW ARE NOT SETTLED — owner 2026-07-21. See §3.0f-recost immediately after this table before quoting any of them.**

With leads free, the subscription has two jobs: **carry the features, and buy down the Booking Fee.**

| | **Free** | **Solo ₱999** | **Pro ₱2,999** | **Enterprise ₱9,999** |
|---|---|---|---|---|
| **Booking Fee** | **2%** | **2%** | **1.5%** | **1%** |
| Unlimited inquiries | ✓ | ✓ | ✓ | ✓ |
| Verified median · reviews · past-events · listing | ✓ | ✓ | ✓ | ✓ |
| **Front-desk chatbot** | **base (public catalog facts)** | + custom FAQs | + voice-match · precompute · handoff · **in-booth embed** | + team/multi-brand routing |
| **3D booth** | grey placeholder | **✓ full booth** | ✓ + branding | ✓ multi-event |
| Favorites · Proposal Maker · market intel · boosts | — | favorites only | ✓ | ✓ |
| Seats / reach / categories | — | 1 / 30km / 1 | 3 / 50km / 3 | 10 / 100km / ∞ |
| API access | — | — | — | ✓ |

Annual at the 77% house ratio: **₱9,999 · ₱29,999 · ₱99,999.** **Cap stays ₱4,000 at every tier** *(owner-confirmed 2026-07-21 — corrects a stale ₱7,500 here)*.

| Tier | Bought for | Fee break-even |
|---|---|---|
| Solo ₱999 | **The 3D booth** — grey placeholder → real booth | feature sale |
| **Pro ₱2,999 (hero)** | Tools + 0.5% off | above ~₱600k/mo bookings |
| Enterprise ₱9,999 | Scale + 1% off | above ~₱1M/mo — venues, large caterers |

**Pro is priced deliberately against Bridestory Gold (≈₱2,440, no 3D anything).** Solo's whole job is the booth: a vendor opens their client's room, sees their grey placeholder beside a competitor's branded booth, and upgrades — no sales call.

**🚫 TWO THINGS THAT MAY NEVER BE TIERED:**
1. **Nothing couple-facing.** Reviews, verified median, past-events, search listing — free at every tier. A couple must never get a worse experience because a vendor didn't pay.
2. **Never the inbox.** That is Bridestory's mistake and your sharpest attack line (§7a). **Replies are free forever.**

**The chatbot base is FREE for the same reason** — Rule 1 makes it ₱0/reply, and it's couple-facing. It also solves responsiveness without enforcement: every couple gets an instant first answer even from a vendor who's asleep, which makes *"your inbox is never locked"* a guarantee rather than a policy. ⚠ **Not built** (§9 sign-offs open, hard single-tenant RLS required) — a roadmap row, don't sell Pro on it yet.

**⚠ The honest caveat:** Free-tier vendors get almost everything. **The 3D booth must be genuinely compelling or nobody ever leaves Free** — which lands where the whole doc lands: **instrument the booth** (§5.1).

#### 3.0f-recost 🚨 OPEN WORK ITEM — the subscription ladder must be RE-COSTED (owner 2026-07-21)

> **Owner, verbatim:** *"we still need to access and recost the price subs of the vendors. reach. website name reveal and more."*

**The Free / ₱999 / ₱2,999 / ₱9,999 ladder in §3.0f is explicitly NOT SETTLED.** It is a working proposal, and the owner reserved the pricing decision. **No numbers are proposed here.**

**The value levers the owner named, verbatim:**

| Lever | Note |
|---|---|
| **Reach** | Radius / coverage — already differentiated in §3.0f (30km / 50km / 100km) but not priced deliberately |
| **Website** | The vendor's Setnayan-hosted site. ⚠ Now also a **fee-bearing transaction origin** (§3.0d-scope) — it is simultaneously a subscription feature and a revenue path, and those two roles need reconciling |
| **Name reveal** | ⚠ **A new lever not previously in this doc.** Gating whether a vendor's *name* is revealed pre-inquiry is a materially different product from gating features — it touches the *"search must never return empty"* and *"money can't buy relevance"* doctrines (§4.3), and the *"nothing couple-facing may be tiered"* rule in §3.0f. **Flagged as needing its own reconciliation, not just a price.** |
| **"and more"** | Owner-signalled, unspecified — the list is open |

**⚠ WHY THIS IS NOW URGENT, not housekeeping.** Under the corrected Booking Fee the take is **minimal and hard-capped at ₱4,000/vendor** — roughly ₱2.4M/yr at 600 events (§3.0, sign-off 3c), and that ceiling was accepted deliberately. **With the transaction fee capped that low, the subscription is where the value capture has to live.** The revenue model does not close on the fee alone; pricing the ladder is therefore load-bearing, not a follow-up.

**✅ This partially answers a long-standing open question.** *"If being found is free, what does ₱999 buy?"* now has an owner-supplied answer: **reach + website + name reveal (+ more).** ⚠ **The ANSWER is settled; the PRICE is not.** Do not read the existing ₱999/₱2,999/₱9,999 as confirmed by this — the owner named the levers in the same breath as saying the prices need recosting.

⚠ **Note the collision with sign-off #2:** §3.0f's ₱2,999 / ₱9,999 already supersede the **2026-07-10 pricing finalization live in `vendor_billing_catalog`** (₱2,499 / ₱7,999). A recost means that supersession is itself provisional — **nothing should be written to the catalog until this lands.**

#### 3.0j Tax treatment — BIR (owner-confirmed 2026-07-21 · ⚠ accountant to verify)

**Setnayan never receives the couple's payment.** The vendor's sale never passes through the books — so there is **no conduit/agency question, no principal-vs-agent argument, and no risk of pass-through amounts being counted into gross receipts.** *(Coheven's escrow model forces exactly that conversation; not holding the money is a genuine advantage, not only an operational constraint.)*

**Two separate tax events, no overlap:**

| | Income of |
|---|---|
| The wedding service (e.g. ₱80,000) | **The vendor**, entirely |
| The Booking Fee (e.g. ₱1,400) | **Setnayan**, entirely |

- **Setnayan issues NOTHING for the vendor's sale.** The only document is a **monthly EOPT "Invoice"** (not an OR) per vendor covering that month's locks — which the monthly batching (§3.0-iv) already produces.
- Booking-fee income = gross receipts under the ICASA sole-prop COR, **8% flat election**.
- **Form 2307:** expect a MIX. Small vendors (solo photographer, HMUA, florist) are not top withholding agents → full payment, no 2307. Hotels/corporations/**TWAs** withhold ~2% EWT → pay 98% + issue a 2307, creditable against the 8%. **2% of a ₱1,400 fee is ₱28** — record what arrives, don't chase what doesn't.
- **⚠ Autopay conflicts with withholding.** A TWA must control the payment to withhold, so it cannot hand over a 2307 if autopay already debited in full. **Enterprise vendors will need a manual-settlement path** — and that is exactly the segment with the highest receivables risk. Design it deliberately.
- **⚠ ₱3M VAT TRIPWIRE — measured on Setnayan's own revenue** (booking fees + subscriptions), not on wedding spend. Today ≈ ₱1.03M (20 Pro subs ₱720k + fees ₱315k at 63 events). **Crossing happens around 300–500 weddings/yr.** ⚠ **Decide BEFORE publishing the schedule whether fees are VAT-inclusive or VAT-added** — repricing a published fee table afterwards is the ugly version.
- **For the accountant:** confirm characterisation (commission vs service fee — it sets the EWT rate, 2% vs 10%) and 2307 creditability against the 8% election.

#### 3.0g 🚫 CHAT IS OFF-LIMITS — owner-decided 2026-07-21

**Vendor↔couple chat content may NOT be scanned for fee enforcement or fraud detection.** Owner-decided; treat as a boundary, not a preference.

**Why (practical reason first):** the moment vendors learn conversations are read for enforcement, **they move to Viber/Messenger the same week** — costing you the thread data, coordination surface, response-time signals, and the front-desk chatbot's reason to exist, *and* you still don't collect, because the deal is now discussed off-platform. **You'd trade a ₱1,600 fee for the entire communications layer.**

**Privacy exposure:** RA 10173 purpose limitation (messages were collected to *deliver messages*; enforcement is a new purpose needing its own lawful basis + privacy-notice declaration) · **the couple is a second party who never agreed** · and it reverses the platform's own precedent that **calls are locked never-recorded**. Would need DPO + counsel sign-off and likely fails both.

**✅ DO THIS INSTEAD — structure it, don't scan it.** An in-thread **"Record this booking — ₱X"** action either party can tap. Consensual, visible, and it yields *better* data than any parser: an explicit agreed figure instead of a number inferred from *"ok po, 80k na lang."*

**The distinction that governs:** couple confirmation, the payment ledger, and card-vs-booking consistency are **structured, purpose-declared** data. Chat content is the one signal that isn't — which is exactly why it stays untouched.

#### 3.0h 🔑 THE PRINCIPLE THE WHOLE MODEL RESTS ON

> **What a vendor registers isn't a report about their business. On Setnayan, it IS their business.**

The registered lock sets their **verified median → the couples they're matched to → their lead flow**, plus their past-events record, eligible reviews, ranking weight, booth, and price-position. The Booking Fee is almost incidental to it.

**This is why policing is secondary.** A tax declaration reports something real happening elsewhere, so it invites lying. A registered lock is not a report — it *is* the thing. **Understate it and you haven't hidden your business; you've changed it.**

Vendor-facing line: ***"This isn't paperwork. This is your storefront."***

⚠ **The one condition:** the mechanism's force is proportional to how much Setnayan matters to that vendor. **At 63 events it's weak; at 6,000 it's absolute.** Early on, expect leakage and don't chase it — same posture as import attribution (§3.0e) and the misdeclaration ladder (**§3.0b** — corrected from a dangling "§3.0i" reference, 2026-07-21).

#### 3.0c The leak, and why it closes itself

A vendor could take free leads and never lock. Three compounding defenses:

1. **Reputation flows only through locks** — no reviews, no verified past-events, no ranking weight, no 3D booth
2. **No locks → no verified median** — and *"price unverified"* is a visible weakness next to competitors who have one. **In a marketplace built on real prices, the lock stops being a cost and becomes the credential they want.**
3. **The couple is already on-platform** — they added the vendor to their own event; declining to lock is visible to them, not hidden

#### 3.0k ⚠ The open calibration risk *(renumbered 2026-07-21 — was a duplicate "3.0d")*

**Everything hinges on locks per vendor per month in PH.** If a typical photographer wins 2–3 weddings in peak season and none in August, then Solo at 3 is too tight, Pro at 10 is never reached, and **the ladder never sells.** These allowances are guesses. Answerable from your own event data once vendors are on — **get this number before launch.**

---

### 3.1 ⚠ SUPERSEDED (lineage) — Tiers at ₱100 per inquiry

| Tier | Price/28d | Inquiries/mo | Effective |
|---|---|---|---|
| **Free (verified)** | ₱0 | 3 | — |
| **Solo** | ₱999 | 10 | ₱100 |
| **+ 3D variant** | **₱1,500** | **+15** | **₱100** |
| **Pro** | ₱2,999 | 30 | ₱100 |
| **Enterprise** (3D incl.) | ₱9,999 | 100 | ₱100 |
| Custom | ₱8,999+ | Unlimited | — |

*Pro + 3D = ₱4,499 (45 inquiries).* **The entire catalog reduces to "₱100 per inquiry"** — no rung feels like a trick, and the pricing page explains itself in one line.

**Free-verified at 3/month replaces free-during-launch** — and it never has to end. Three real couples with real dates is enough to prove the platform and close one; too few to run a business on. A permanent funnel beats a promotional period you eventually have to withdraw.

### 3.2 The upgrade engine: ₱100 included vs ₱300 overage

| Vendor at | Stays put | Upgrades |
|---|---|---|
| Solo, 30 inquiries | ₱999 + 20×₱300 = **₱6,999** | Pro **₱2,999** |
| Pro, 100 inquiries | ₱2,999 + 70×₱300 = **₱23,999** | Enterprise **₱9,999** |

**The 3× spread IS the mechanism.** Collapsing it (e.g. ₱300 included) removes any reason to climb a tier — vendors would pay overage forever. It also tightens allowances to 3/10/33, and **the allowance is a throttle on marketplace liquidity, not a price.** At 63 events you need more matching, not less. Tighten when there's a queue.

### 3.3 Two rules that keep it humane

1. **The cap governs *routing*, not *replying*.** A vendor at their limit stops being matched to new couples; they are never blocked from answering someone already in their inbox. **No couple ever gets silence.** The cap becomes a capacity signal, and most of the fraud surface disappears with it.
2. **Overage auto-bills, never blocks.** Vendors may set their own ceiling; the default is bill-not-wall.

### 3.4 The lock fee — ⚠ PROPOSED THEN WITHDRAWN (owner objection, same session)

> **🚫 The owner killed this before the session ended. Read §3.4a FIRST — the design below is kept for lineage, not as a recommendation.**

#### 3.4a Why it was withdrawn — pass-through

**A vendor passes a per-booking fee to the couple.** A ₱900 flower arrangement becomes ₱1,200, and the same florist is now **cheaper off Setnayan than on it** — the exact leakage that kills marketplaces. It also quietly undoes the 0% promise: you take no commission, but the couple pays as though you did.

**And it's catastrophic at low ticket:** ₱500 on a ₱900 sale is **55%**; on a ₱8k makeup package, 6.3%; on a ₱500k venue, 0.1%.

**The governing distinction:**

| Cost type | Behaviour |
|---|---|
| Per-transaction fee (lock, commission) | Vendor **itemizes it onto that job** → couple pays more |
| Fixed subscription | Spread across every job — a busy vendor absorbs ~₱50–100/booking, **never itemized** |

**Fixed costs get absorbed; per-transaction costs get passed on.** A lock fee is a per-transaction fee wearing a different name.

**Resolution:** **locking is FREE and mandatory-by-value** — it's how a vendor gets the booth, workspace, verified history, and reviews. That makes it a *reason to subscribe* rather than a toll, and the subscription ladder (§4.2, ~10% collected in advance) carries the value capture without ever appearing on a couple's invoice.

**Claim this buys you:** *"Vendors pay us nothing per booking — Setnayan prices are the same as anywhere else."* Worth more to couples than the fee was worth to you.

**Milder option, if the success-linked line is wanted back:** a floor (no fee under ~₱5,000 packages). Protects the ₱900 florist, keeps it on the ₱500k venue — but it still passes through above the floor, so it shrinks the problem rather than solving it. **Owner call, §6 #4.**

#### 3.4b The withdrawn design (lineage only) — ₱500 per vendor × event

The vendor syncs the client to the app; that grants the event workspace (3D booth in that couple's room, milestones, schedule, contract, coordination, guest exposure).

- **₱500 ≈ 1% of a ₱50k booking.** A success fee, not a commission — they pay only when they've won.
- **Per vendor × event, never per service.** Catering + styling for one wedding = ₱500 once. Per-service pricing would make vendors under-list services to dodge fees — **never price something in a way that rewards hiding data from you.** Adding services later is free. Multi-service vendors pay more via the tier ladder ("unlimited categories"), not by multiplying the lock.
- Same couple, two events = two locks (two workspaces, two booths, two reviews).

**⚠ Hard dependency — the reputation coupling.** ₱500 is only collectible if **reviews · verified past-events (PR #3400) · ranking weight · the 3D booth flow ONLY through locks.** Then dodging ₱500 forfeits the reputation that wins the next ten clients, and the vendor does that arithmetic themselves. **Without the coupling, ₱500 is a toll on convenience and vendors will route around it.** Build the coupling FIRST — a fee shipped before it teaches the habit of avoidance.

**Second lock: the couple.** The couple adds vendors to their own event (existing registry, free, couple-owned). The vendor *claims* it. So a booking can't be quietly kept off-platform — it's already on-platform on the couple's side; the vendor only chooses whether to claim the benefits. The couple never loses vendor tracking because someone didn't want to pay.

**Low-ticket flag:** ₱500 is 0.1% to a venue, 1% to a photographer, **6.3% to a ₱8k makeup artist** — the categories you most want locking, since every wedding has them. **Launch ₱500 flat, watch lock rates by category, band down only if low-ticket categories under-lock.**

**Scaling shape — lock revenue tracks EVENTS; subscriptions track VENDORS:**

| Events/yr | Locks at ~6/event × ₱500 |
|---|---|
| 63 (today) | ~₱189,000 |
| 600 | ~₱1,800,000 |

At scale it exceeds the subscription line. **Healthier than depending on either side of the marketplace alone.**

### 3.5 Granularity map

| Unit | Charged per | Why |
|---|---|---|
| Subscription + allowance | Vendor account | It's a business, not a service line |
| Lock fee ₱500 | **Vendor × event** | One relationship, one workspace |
| Boosts | **Service** | "Fill my February catering slots" |
| 3D booth | Vendor × event | One booth, showing all services |

**Locks buy a workspace for a relationship; boosts buy attention for an offering.**

---

## 4 · What got retired, and why

### 4.1 The inquiry gate — RETIRED

**Its failure mode lands on the couple.** A vendor rationing tokens leaves a couple's message unanswered — damaging the demand engine that is the entire vendor value proposition. **Never charge a vendor to answer someone who wants to hire them.**

It also **contradicts 0% commission**: at ~10 inquiries per booking, ₱200/token is ~4% of a ₱50k deal, and vendors will describe it as a commission by another name.

**And it doesn't do what it was built for.** It was kept to replace a 25% commission — but arithmetically it replaces about **4%** of one:

| Model | On a ₱50k booking |
|---|---|
| 25% commission | ₱12,500 |
| ~10 inquiries × ₱200 | ₱2,000 |
| Direct booking, 1 token | ₱200 |

**All the friction of a commission for a sixth of the revenue.** And it's regressive — commission scales with deal *value*, tokens with inquiry *count*, so ₱200 is 0.04% on a ₱500k venue booking and meaningful to a small vendor.

**Cheaper doesn't rescue it.** A gate cheap enough not to hurt (₱50) is too cheap to be worth the settlement + fake-inquiry machinery it requires. Both of those systems are **designed and unbuilt with 4 open sign-offs** — retiring the gate deletes them.

**What replaces it for behavior: ranking, not price.** Response SLA (`vendor_unresponsive_48h` already wired) → trust badge → search demotion. **A vendor will not answer faster for ₱50; they will answer in two hours to protect their ranking.** Free to build, no fraud surface.

### 4.2 The 25% commission question — answered

**You cannot get 25% without touching the transaction.** It's a transaction rate; it exists only because a platform sits in the payment path and can withhold. Setnayan doesn't hold money and vendors settle off-platform — the commission was never collectible.

**But the ladder already implies ~10%:**

| Tier | Annual | ≈10% of a vendor doing |
|---|---|---|
| Solo ₱999 | ₱12,987 | ~₱130,000/yr |
| Pro + 3D ₱4,499 | ₱58,487 | ~₱585,000/yr |
| Enterprise ₱9,999 | ₱129,987 | ~₱1,300,000/yr |

**You built a commission — you just collect it in advance, in fixed instalments, without touching a peso.** Add the lock fee and a ₱1M vendor lands ~11–13%.

**The real defect is sorting, not price.** Tiers gate on seats/reach/categories — proxies for *team size*, not revenue. A solo videographer doing ₱800k sits on Solo and pays 1.6%; a three-person florist doing ₱200k pays 16%. **Re-base tier thresholds on bookings-recorded-on-platform + published price band** (both observable without the transaction — `vendor_services` already holds their pricing). ⚠ This rewrites Enterprise's owner-locked bounded definition — §6.

**Setnayan Pay is NOT the answer** — the corpus records *no convenience fee, 0% every tier*, all rails `is_active=FALSE`. Reversing that is a separate lock, not a plan. Parked.

### 4.2b Sale-percentage (5% of declared value) — REJECTED

Fails twice, and the owner's own two examples cover the whole range:

| Example | 5% honest | 5% understated | Verdict |
|---|---|---|---|
| Florist ₱1,500 → declares ₱500 | ₱75 | ₱25 | **₱50 gap — costs more to detect than to collect** |
| Stylist ₱450,000 → declares ₱100,000 | ₱22,500 | ₱5,000 | **₱17,500 gap — absolutely worth faking, undetectable** |

**Unpoliceable where it's small, unenforceable where it's large — it bleeds exactly where the money is.** Plus it's 5× the pass-through that killed the ₱500 lock fee (§3.4a). No 0%-commission platform uses declared-sale percentages, and this is why.

**The impulse is right — capture proportional to deal size.** Delivered instead by **category banding** (a venue's tier costs multiples of a florist's) and **verified median pricing** (§3.0a), neither of which depends on an honest self-report.

### 4.2c Price-banding — REJECTED for data corruption

Banding tiers on the vendor's *declared price* was proposed, then killed: PH vendors already publish *"packages from ₱X"*, so every floor price would drift to the bottom of the cheapest band — **corrupting matching, Setnayan AI budget planning, Merkado's build-solver, and Pro price-position intel, and collapsing the revenue anyway.**

> **🔑 THE DURABLE RULE (this bit twice — per-service locks made vendors hide services; price-banding made them hide prices):**
> **Never let a fee depend on data you also need to be accurate. Price on what you OBSERVE, never on what they DECLARE.**

**Category × location banding satisfies it:** miscategorising means the wrong couples find you and the right ones never do — **the correct answer and the profitable answer are the same.** No fee touches price data, so the catalog stays honest.

*(§3.0a's verified median is the one permitted exception — and only because the couple independently witnesses the figure. Remove couple-confirmation and it reverts to self-declaration.)*

### 4.3 Boosts and paid searchability — DEFERRED, and constrained when they come

**Doctrine, extending the booth rule:** ***money can't buy relevance, only visibility among the already-relevant.*** Google and Facebook sell audience; a boost here may only reorder *qualified* matches. A ₱500k venue can never boost into a ₱80k couple's results.

Three structural constraints: **relevance floor** · **hard cap on boosted share (1 in 5)** · **per-vendor boost cap** (one boosted service at a time, ceiling on weeks/year).

**You can afford that restraint precisely because you take 0%** — a commission platform must maximize GMV and therefore must let money win. Marketing line: ***"You can't buy your way to the top of Setnayan."***

**Search must never return empty.** Paid searchability can buy breadth and prominence (categories, radius, peak date windows) — **never existence.** There is always a free searchable floor.

**Sequencing — this is the decisive point:**

| Model | Earns when | Value depends on |
|---|---|---|
| Lock fee / allowance | A real couple needs a real vendor | **Nothing — self-proving** |
| Boosts / searchability | Immediately | **Traffic you don't have yet** |

Charging for reach at 63 events doesn't just underearn — a vendor pays, gets nothing, and concludes the product doesn't work. **Ship earned ranking first. Add boosts once ranking is trusted and traffic is real.** You may find you never want them.

### 4.4a ⭐ TOKENS — RETIRED (owner-confirmed 2026-07-21) · *was "go dormant", now settled*

> **Owner, verbatim:** *"token can retire, there should be nothing that needs token anymore."*

**This is settled, not proposed.** The earlier "dormant, not deleted" posture below is superseded: dormancy was a hedge against unknown live wiring, and the wiring turned out to be empty.

**Under the final model no token has a job.** Inquiry gating is retired (inquiries free) · ads/boosts are deferred **and are peso-priced** (*"₱1,000 for 7 days"* beats a token count) · vendor cold outreach can be tier-capped. **A third currency alongside subscription + Booking Fee is the "how many ways do you charge me" problem.**

**Measured in prod, not estimated** *(see the 2026-07-21 "TOKEN RETIREMENT IS FREE" row in `DECISION_LOG.md`)*: `vendor_token_purchases` 0 · `token_redemptions_log` 0 · `vendor_token_boosters` 0 · `vendor_event_unlocks` 0 · `lead_token_holds` 0 · `vendor_bid_submissions` 0 · `vendor_creator_offers` 0 · `manpower_gigs` 0 · **token-able SKUs in the live retail catalog: 0.** Residue is 5 test wallets holding 500 granted tokens. **Nothing to migrate, nothing to refund.**

**What retirement actually costs — the honest part:** not money, but **meters**. Six features were designed with a token as their only pricing primitive and now have none: lead unlock *(✅ already replaced by the Booking Fee)* · couple-brief bidding · creator discount-collab · manpower handshake · the `[Token]` couple SKUs · subscription/discount token grants. **Plus, in this doc:** ghost-booth airtime · boosts · vendor cold outreach (§4.4b, §5). Each must be peso-priced or explicitly parked — otherwise they ship **silently unpriced**, which is worse than expensive.

- **Now:** tokens are out of the vendor-facing pricing story; packs unsold. The pitch is two lines — **subscription + Booking Fee**.
- 🔒 **Code: DORMANT, NOT DELETED — and this is deliberate.** *(Restored 2026-07-21 after a pass silently downgraded it to "drop when convenient; there is no ordering risk." That was a posture change nobody authorized.)* **The owner retired the CURRENCY. The owner did not authorize dropping tables.** Stop writing to the economy tables; leave them standing. Concretely:
  - `vendor_event_unlocks` stays as a **historical ledger** — the build plan reads it and the fee model's import/attribution history may need it.
  - Every economy table currently reads 0 rows in prod, which makes a drop *cheap* — it does not make it *decided*. Cheap-to-do and safe-to-do are different claims, and "0 rows today" is a measurement, not a guarantee about the flag-off code paths still referencing these tables.
  - A schema drop is an irreversible migration against prod requiring its own review and its own owner sign-off. **It is not a side effect of decision 7.**
  - If a drop is ever wanted, it is a separate change with its own ordering analysis — not a cleanup folded into a fee PR.
- ⚠ **Corpus follow-up (NOT done in this pass) — BLAST RADIUS, counted mechanically 2026-07-21** (`grep -rno "\[Token\]" --include="*.md" .`; earlier passes in this doc quoted **17** in one place and **18** in another — **the sweep target is 18**, and both figures are now reconciled to the count below):

  | Where | `[Token]` markers | Action |
  |---|---|---|
  | `CLAUDE.md` (corpus root, **auto-loaded**) | **12** | 🚨 **Sweep** |
  | `Pricing.md` (incl. § 0.C, the vendor token-economy narrative) | **5** | 🚨 **Sweep** |
  | `03_Strategy/Vendor_Value_Proposition_and_Reviews_2026-06-05.md` | **1** | Sweep |
  | **SWEEP TARGET — total** | **18** | |
  | `07_Archive/Site_vs_Spec_Reconciliation_2026-06-04.md` | 18 | 🚫 History — do not edit |
  | `DECISION_LOG.md` | 5 | 🚫 History — do not edit |
  | This doc (§4.4a / §4.4b lineage) | 5 | 🚫 Lineage — do not edit |

  The sweep is a **separate reviewable change** and is deliberately not done here: a mass edit across the auto-loaded `CLAUDE.md` plus the canonical `Pricing.md` deserves its own review.
- 🚨 **Why the sweep matters more than it looks:** the corpus `CLAUDE.md` is **auto-loaded into every Claude Code session** and still teaches that a vendor token economy is **LIVE at ₱200/token**. Until it is swept, **decision 7 will keep being re-litigated from stale context** by every future session.

**✅ This CANCELS the entire token redenomination problem** (§4.4b below): no ₱50-vs-₱200 decision, no ×4 sweep across ad prices, no dashboard `[Token]` SKU rate to update, no balance migration. Several silent-revenue-loss paths evaporate at once.

### 4.4b 🚫 RETIRED with the currency itself (lineage only) — Tokens narrowed to an ads currency

⚠ **Everything below is lineage.** Tokens buy nothing now; the four uses named here are the ones left **unpriced** by retirement and must be peso-priced before they ship (§4.4a).

Inquiries are now a subscription allowance with peso overage, so **tokens and inquiries have decoupled.** Tokens buy only: ghost-booth airtime in demo/discovery rooms, boosts, creator discount-collab, and **vendor-initiated cold outreach** (the one place a per-message cost protects couples).

**Denomination is now an independent call.** ₱50 units give fine granularity; ₱200–300 make ad prices feel weightier. ⚠ **Any change is a redenomination, not a price cut — every token-denominated price must be ×(200/new) or you silently cut them all.** Affected: ghost-booth airtime · boosts · discount-collab · **`[Token]`-redeemable couple SKUs (a dashboard rate, not code — easiest to miss, and it fails silently as lost revenue)** · existing balances (must be multiplied to preserve what vendors paid; expected ~zero holders — verify).

**Quote ads in pesos, not token counts** (*"₱1,000 for 7 days of airtime"*) so value doesn't get lost in a small-sounding number.

---

## 5 · The resulting model

| Line | Who | Cadence |
|---|---|---|
| **⭐ Minimal Booking Fee — flat 2%, cap ₱4,000** | **Per vendor × EVENT** (decided 2026-07-23; ₱4,000 max per event) | **Scales with EVENTS; PREPAID by the vendor to SEND their finalized proposal** (§3.0d). **Also applies to shortlist + vendor-website transactions** (§3.0d-scope). Imported clients free forever |
| **Subscription — Free/₱999/₱2,999/₱9,999** | Vendor | **Recurring — features + fee buy-down + THE AUTOPAY RAIL** |
| ~~Lock allowances / lock fee ₱500~~ | — | 🚫 superseded — locks are fee-priced, not allowance-metered |
| ~~Inquiry allowance / ₱300 overage~~ | — | 🚫 superseded — **inquiries are unlimited and free at every tier** |
| Ads / boosts / ghost booths | Vendor | Discretionary · deferred · **peso-priced — tokens are retired** (§4.4a). ⚠ Until priced, these features have **no pricing primitive at all** |
| 3D Plan activation ₱999 | Couple, or vendor-sponsored | Per event |
| À-la-carte SKUs (Monogram ₱999, STD ₱999, Papic) | Couple | Per event |

**Vendor-facing pitch:** ⚠ *(stale — "0% commission. Free leads. ₱500 when you book." is retired on all three counts: 0% commission is retired §3.0-i, the ₱500 lock fee was withdrawn §3.4a, and the fee is now **prepaid to send the finalized proposal**, §3.0d.)* **Current: *"Free unlimited inquiries. Minimal Booking Fee — from ₱50, never more than ₱4,000."***
>
> 🚨 **The trailing sentence *"You pay when your client says yes"* is SUSPENDED, not approved.** Under §3.0d the fee is prepaid to **send** the finalized proposal — before the client says anything. The literal-truth sentence is ***"you pay to send your final proposal."*** Whether the friendlier wording may still be used is **OPEN sign-off 3d-iii-a**, and it turns on lock→acceptance conversion data that does not exist at 63 events. **Do not publish it in the meantime** — §8's own note ③ says the copy must match the mechanism exactly, and right now it does not.
⚠ The old framing — *the lock buys the **event workspace**, not a share of the deal* — no longer holds either; §3.0-i settled that it **is** a commission and should be owned as the Booking Fee.

**₱1M/yr ≈ 20 vendors on Pro+3D, or ~10 venues on Enterprise, or ~2,000 locks.**

### 5.1 The sequencing that makes any of it defensible

At 63 events and 5 in-app orders ever, **you don't have the proof that justifies ₱4,499 — that's a sequencing problem, not a pricing one.**

1. **Free-verified tier live; instrument everything** — leads delivered, booth impressions, taps, bookings per vendor
2. **Build the reputation coupling** (reviews/verified-history/ranking through locks) **before** the lock fee ships
3. **Then price to the vendor's own numbers:** *"Setnayan sent you 14 inquiries and 3 bookings. That's ₱58k for work worth ₱150k — a commission platform would have charged you ₱37,500 for those three."*

**That's arithmetic, not argument.** And repricing now costs nothing (vendors are still free-during-launch); repricing after 200 vendors is a migration nightmare.

**Positioning note:** against a directory you look 4× expensive; against a 25% commission platform you're **5× cheaper**. Same price — the win or loss is entirely which shelf you stand on. **Never let a vendor file you next to a listing site.** Keep Solo at ₱999 (market anchor); nobody is quoted ₱4,499 cold — they climb because they're winning.

---

## 6 · Owner sign-offs — nothing below is decided

| # | Item | Supersedes |
|---|---|---|
| 1 | **`SEATING_3D` ₱2,999 → ₱999 — and it now buys PUBLISHING, not access** (§2.0: editor/navigation/play all free; guest-facing surfaces paid). ⚠ Confirm the exact free/paid boundary before build — *"integration"* is not implementable | Live catalog entry (fake door today) |
| 1b | ⚠ **Vendor-sponsored activation is now the PRIMARY path** (§2.0) — without it, ~1 in 12 weddings publishes and the vendor booth inventory starves | Elevated from "option" to load-bearing |
| 2 | **Pro ₱2,499→₱2,999 · Enterprise ₱7,999→₱9,999** | ⚠ **2026-07-10 pricing finalization**, live in `vendor_billing_catalog` |
| 3 | **Inquiry gate retired · leads unlimited and free · LOCKS are the meter** (§3.0) | Token-settlement design + fake-inquiry protection (both unbuilt, 4 open sign-offs) |
| **3b** | 🚨 **"0% COMMISSION" IS RETIRED** (§3.0-i) — it *is* a commission; call it the **Booking Fee**. New claim: *"Free until you book, then up to 2%."* | ⚠ **Owner-lock across `Pricing.md`, ground-truth doc, and public copy** — a real corpus change |
| 3c | **Booking Fee = FLAT 2% RATE (§3.0, owner 2026-07-23 final), ₱50 floor → 2% → ₱4,000 cap.** Replaces the marginal brackets (2026-07-21, now lineage). Floor ₱50 binds ≤₱2,500 (2%×₱2,500); cap ₱4,000 binds ≥₱200,000 (2%×₱200,000). **Live in code: `apps/web/lib/booking-fee.ts` (PR #3560).** ⚠ Recost the ~₱2.4M/yr estimate against a flat 2% capped at ₱4,000 | ✅ **SETTLED 2026-07-23** — supersedes both the 2026-07-21 brackets and the interim 1.3333% reading |
| **3c-unit** | ✅ **DECIDED 2026-07-23 — the ₱4,000 cap is PER VENDOR × EVENT.** Owner: the cap is the most a vendor pays for one event (two events = up to ₱8,000). Locks the fee-ledger `UNIQUE(vendor_profile_id, event_id)` key (coherent with #20 and §3.0-iii) | ✅ **SETTLED** |
| ~~3g~~ | ~~Boundary-bunching detection~~ — **DROPPED: the continuous rule removes the cliff, so the fraud vector no longer exists** | Resolved by design |
| 3h | ⚠ **The smallest vendors pay the highest RATE** (1.9% vs 0.40%) — inherent to a declining schedule. Say it plainly in vendor copy rather than let it be discovered | New |
| 3i | **Ship the interactive schedule widget as the vendor pricing page** — it is the proof behind the transparency claim; no PH competitor publishes anything comparable | New |
| 3j | ⚠ **VAT-inclusive or VAT-added — decide BEFORE publishing the schedule** (§3.0j). ₱3M tripwire crosses at ~300–500 weddings/yr on Setnayan's own revenue | **Repricing a published table later is the ugly version** |
| 3k | **Manual-settlement path for TWA vendors** (§3.0j) — autopay structurally cannot coexist with EWT withholding, and it's the highest-receivables-risk segment | New |
| 3d | ✅ **SETTLED 2026-07-21 (CORRECTED) — the vendor PREPAYS the fee to SEND their finalized proposal** (§3.0d). Owner: *"customer sends lock. vendor, accepts lock with dedicated finalized proposal which will compute the booking cost. the vendor pays setnayan to send finalized. the customer pays the vendor."* The fee is a **gate on sending**, not an invoice afterwards; the customer's acceptance is the **handshake confirming the base**, not the billing event. ⚠ **Supersedes BOTH** the first-payment trigger and the interim acceptance trigger. ⚠ The revenue-critical surface is the **Proposal Maker + a payment gate on its send action — NEITHER IS BUILT**, so the fee cannot be metered until both ship | Supersedes two earlier triggers; **hardest build dependency in the model** |
| **3d-scope** | ✅ **SETTLED 2026-07-21 — the fee also covers SHORTLIST and VENDOR-WEBSITE transactions** (§3.0d-scope). Owner: *"any transactions to shortlist and websites will have booking fee."* Imported clients remain free forever | Widens scope beyond the lock path |
| **3d-i** | ✅ **RESOLVED — the cancellation / non-payment hole CLOSES** (§3.0d-i). Because the fee is prepaid before the proposal is released there is **no invoice to chase and nothing to void**, and Setnayan carries **no receivables risk**. Strictly better than both earlier designs on collection. *(The old "OPEN — cancellation policy" framing belonged to the superseded acceptance trigger and is retired with it.)* | ✅ **Resolved by the 3d correction, not by a separate decision** |
| **3d-ii** | ⚠ **Misdeclaration is now largely SELF-PUNISHING — and that retires most of §3.0a/§3.0b** (§3.0d-ii). Under-declaring means under-CHARGING the customer by the same amount, so lying always costs more than the fee it saves. **Couple confirmation is demoted; the ladder is mostly without a target. Do not build that stack as the fee's defense.** 🚨 **RESIDUAL LEAK, unsolved:** *lock on-platform, then move the real deal off-platform behind a token proposal* — defeats the self-punishing logic (the vendor isn't under-charging, they're charging elsewhere), defeats couple confirmation, and survives decision 8. Only rung-4 self-consistency + slow positioning force remain, both weak at 63 events | Consequence of 3d + 8 together — **flagged, NOT solved** |
| **3d-iii-a** | 🚨 **OPEN — may *"you pay when your client says yes"* still be PUBLISHED?** (§3.0d-iii). The fee gates the **send**, not the win, so the claim is not literally true. ✅ **Measured in its favour:** a `lock` IS a genuine commitment (`finalizeVendor`, celebratory "you committed to", gates Save-the-Date, contends for schedule-pool capacity, has a payment-gated variant) — **not a browse action**. ⚠ **But** the two-sided lock the owner described **does not exist** (shipped lock is unilateral by the couple; no vendor-accept step, no proposal attachment), and lock→acceptance **conversion is unmeasured at 63 events**. **Marketing-claim risk until measured. Copy suspended in §5 and §8** | Created by the 3d correction |
| **3d-iii-b** | 🚨 **OPEN — refund or credit if the customer walks after the vendor already paid to send?** (§3.0d-iii). **The owner chose the mechanism, NOT the refund policy.** No rule invented here. Without one, a vendor pays per *attempt* — which is the Thumbtack/Bark grievance §3.0-ii claims this model kills | **The risk the 3d correction moved onto the vendor** |
| **3d-iv** | 🚨 **OPEN — where does the prepaid gate SIT on the shortlist and website paths?** (§3.0d-scope). The canonical path has an obvious chokepoint (the proposal send); those two may involve no finalized proposal at all. The owner set the **scope**, not the mechanism. ⚠ Also needs the **"imported client" vs "came through your Setnayan website"** boundary defined, or §3.0e's absolute free-forever promise grows an asterisk | Created by 3d-scope |
| 3e | ⚠ **RE-SCOPED — autopay + monthly batching + rail steering** (§3.0-iv). **The collection half is retired by the prepaid gate** (no receivable to autopay against, no invoice to batch, no suspension ladder needed for the fee). What survives: **rail steering**, **never showing "fee + processing" as two lines**, and — now blocking rather than advisory — **confirm the gateway**: Maya is BUILT-but-dormant (needs owner KYC + a `'paid'` webhook), PayMongo only "under evaluation", Setnayan Pay rails all `is_active=FALSE`. **There is no fee at all without a live gateway on the proposal-send action** | ⚠ **Premise retired by 3d** |
| **3e-ii** | ✅ **DECIDED 2026-07-23 — split the gateway cost by component.** Setnayan **ABSORBS the percentage** (up to ~3.5%); the **fixed per-transaction fee (~₱15, card only)** is **passed to the vendor**. This kills the floor problem — the fixed cost (which murdered small fees) is recovered, and Setnayan only ever eats the %: at the ₱50 floor on card the vendor pays ₱65, Setnayan absorbs ₱2.28 (3.5%) and nets ~₱47.72; e-wallet (no fixed fee) has nothing to pass, so a GCash payer pays exactly the fee and Setnayan absorbs ~2.5%. ⚠ **IMPLEMENT AS INCLUSIVE PRICING, NOT A SURCHARGE LINE** — Visa/MC + BSP disallow card surcharges, and this doc's own §3.0-iv says "never show fee + processing as two lines." Quote a single card-inclusive total ("₱775 by card / ₱760 by GCash"), never "₱760 + ₱15". Doubles as an e-wallet nudge. Built at PR-4 checkout (blocked on the Maya rail). | ✅ **SETTLED** — absorb %, pass fixed (inclusive) |
| 3f | **Subscription ladder + fee buy-down** 2%/2%/1.5%/1% (§3.0f); chatbot base FREE; **inbox and couple-facing surfaces never tiered** | Supersedes lock-allowance tiers |
| **3m-1** | ✅ **SETTLED 2026-07-21 — CUSTOMER PROTECTIONS SCOPE TO THE DECLARED AMOUNT** (§3.0m-a). Owner, verbatim, to *"do customer protections scope to the declared amount?"* → ***"1. yes."*** Reviews, dispute support, booking record and recourse attach to the declared number and nothing above it; a couple who under-declares alongside their vendor **loses recourse on the difference**. ⭐ **This makes the CUSTOMER the enforcer** — and it is the first thing in the model that gives a couple a reason to refuse the §3.0d-ii token-proposal leak | **Owner-confirmed** |
| **3m-2** | ✅ **SETTLED 2026-07-21 — THE DECLARED PRICE DETERMINES THE MARKET SEGMENT SETNAYAN BOOSTS THE VENDOR INTO** (§3.0m-a). Owner, verbatim: ***"whatever they declare will be the market we will boost them to. this affects their services and target market."*** Under-declaring is immediately, self-inflictedly costly in lead quality. ⚠ Note it is stated as **boosting** — an active placement decision — which is a stronger claim than §3.0a's passive matching, and must be reconciled with §4.3's *"money can't buy relevance"* and with open sign-off **13b** (may any of it be shown to couples?) | **Owner-confirmed** |
| **3m-a** | 🚨 **OPEN, created by 3m-1 — how is scoped protection FRAMED to a customer who is a victim rather than a colluder?** (§3.0m-b). The rule works by *withdrawing protection from a consumer*, and *"you have no recourse because your vendor understated the price"* is a defensible policy and a bad support conversation. Needs a disclosure at acceptance, consumer-facing copy, and **probably counsel review** before publication | **The cost of 3m-1** |
| **3m-b** | 🚨 **OPEN — the HIGH-WATER DELTA rule for price revisions. ⚠ ASSISTANT PROPOSAL, NOT OWNER-DECIDED** (§3.0m-c). Offered in answer to the owner's own question (*"i have fear that they under declare the first and just make a big adjustment after like a bypass"*); **the owner did not explicitly accept it before moving on.** Proposed: fee owed = f(highest total ever declared for that `(vendor, event)`) − fee already paid · **no refund on downward revisions** · **the ₱4,000 cap binds across all revisions**. Makes the under-declare-then-adjust bypass save exactly **₱0**, with no detection and no accusation. ⚠ **Decide together with 3d-iii-b** — both concern money already paid on a deal that did not land as declared. ⚠ Also depends on **3c-unit** (a per-booking cap makes "high-water per event" incoherent) | **NOT a decision — do not build or publish as one** |
| **3m-c** | 🚨 **OPEN — THE MIRROR RISK: above the cap, over-declaring is FREE** (§3.0m-d). Because the fee caps at ₱4,000 at ₱300,000, **the marginal fee rate above ₱300,000 is ZERO** — declaring ₱1,000,000 costs the same as declaring ₱300,000 and, per **3m-2**, buys a ₱1,000,000-segment boost. Two natural limits (the customer must accept the inflated price; inflated proposals lose real deals) mean **it cannot be faked on a LIVE booking — but it CAN be faked on a STAGED one: one fake ₱1M booking with a friend costs ₱4,000 and buys premium placement** (cf. Enterprise at ₱119,988/yr). It defeats all three forces at once. **Whether ₱4,000 is cheap or expensive for that is an OWNER JUDGEMENT; the arithmetic is stated in §3.0m-d and no recommendation is made.** ⚠ Proposed mitigation — **median of COMPLETED-and-REVIEWED bookings + a minimum count before segment change** (§3.0m-e) — is **ASSISTANT PROPOSAL, NOT CONFIRMED**, and collides with §3.0a guard 3's existing ~3-booking threshold (same knob, must be one number) | **New — the mirror of the §3.0d-ii leak** |
| 4 | **Lock fee — WITHDRAWN (§3.4a).** Confirm: locking free forever, *or* reinstate with a ~₱5,000 package floor? Recommendation: **free** — pass-through inflates couple prices and breaks the "same price as anywhere" claim | Withdrawn same session |
| 5 | ~~Reputation coupling before the lock fee~~ — **moot if locking is free**, but reviews/verified-history/ranking flowing through locks is still worth building as the *reason to subscribe* | Dependency now optional |
| 6 | ✅ **SETTLED 2026-07-21 — TOKENS ARE RETIRED** (§4.4a), not dormant. Owner: *"token can retire, there should be nothing that needs token anymore."* Prod-measured zero usage in every economy table; nothing to migrate. ⚠ **Residual cost = unpriced meters** (ghost-booth airtime, boosts, cold outreach, couple-brief bidding, creator discount-collab, manpower handshake) — peso-price or park each. ⚠ **Corpus `[Token]` sweep NOT done** — **18** non-archive markers outstanding (`CLAUDE.md` 12 · `Pricing.md` 5 · `Vendor_Value_Proposition…` 1; counted mechanically, §4.4a). ⚠ **Retirement ≠ schema drop:** the tables stay **dormant, not deleted** (§4.4a) | ⚠ ₱200 flat confirmed **2026-07-15**, shipped PR #3138 — now void |
| 7 | **Free-verified 3/mo replaces free-during-launch** | Standing launch policy |
| 8 | **Tier thresholds re-based** on bookings + price band | ⚠ Enterprise's owner-locked bounded definition (10 seats · 100km · unlimited categories) |
| 9 | **Venue-wide booth by property contract** — a venue standing in a couple's room by contract rather than the couple's booking brushes the §2 placement rule | Council verdict 2026-07-19 |
| ~~10~~ | ~~Mannequin identity fork~~ — **✅ CLOSED.** Chibi with faces IN (`Chibi_Rig_Production_Spec` §10 V4); §11 V5 adds the seamless-silhouette/overlap-law directive. **Remaining chibi sign-offs live in that spec's §9**, not here | Resolved 2026-07-19/21 |
| 11 | **Service-avatar authoring scope** — all 28 categories or top 6–8 first | New |
| ~~11b~~ | ~~Resolve the BoothSign/CSP contradiction~~ — **✅ RESOLVED 2026-07-21: uploads WORK; the CSP claim is a myth** (§2.0b). Two shipped texture paths prove it | The verdict's "architecturally impossible" line is FALSE |
| **11b-i** | 🚨 **FIX `public_venue_scene` to select `vp.tier_state`** — shipped Pro logo branding renders generic on **every** public booth today. The paid feature is invisible where guests see it | Higher value than the banner itself |
| 11b-ii | **Correct the four false "CSP: no fetched assets" comments** + the "same-origin display URL" claim — they are actively generating bad architectural decisions | Small PR, high leverage |
| 11b-iii | **Serve logos/banners from the public R2 domain, not 24h presigned URLs** — presigned refs expire inside cached scene payloads and silently fall back to unbranded | Marketing assets need no presigning |
| 11b-iv | **Per-event banner: tier gate decision** — same `boothCanBrand` as the logo, or its own? Plus route it through the QR-in-media guard | New |
| 11c | **Poster: activation-only, or also in-world when idle?** (§2.0b) | Vendor value vs. room noise |
| 11d | 🔒 **Guest visibility consent — separate from avatar customization, default OFF, DPO review** (§2.0b). Named figures at seats in a published room disclose the guest list to 200 people | **RA 10173** |
| 12 | **3D-variant launch bundling** — the booth rides free on inquiry value; frame explicitly as *launch* bundling to keep room to unbundle after proof | New |
| **13** | ⭐ **VERIFIED MEDIAN PRICING (§3.0a) — a positioning bet, not a pricing detail.** Setnayan would publish what things actually cost, in an industry built on not doing that. Honest vendors gain; some will refuse to join. **Decide deliberately.** ⚠ **Narrowed by decision 8** — the median may no longer carry a price *verdict* | New — arguably the session's biggest idea |
| **13b** | 🚨 **OPEN — may the vendor's own verified range be SHOWN TO COUPLES at all?** (§3.0a). Decision 8 bans comparison; it did not rule on publication. **Narrow reading** keeps *"real prices from real weddings"* alive; **broad reading** makes the median a purely internal matching input and guts the promise. #13 cannot be answered until this is | Created by decision 8 |
| 14 | ⚠ **Couple-confirmation of declared amounts — DE-ESCALATED, no longer "build first"** (§3.0b, §3.0d-ii). *(Superseded framing: it was called load-bearing enforcement, then escalated further.)* **The 3d correction removes its main job** — the finalized proposal *is* the couple-witnessed document, so confirmation is not what makes the number honest any more. Keep it for dispute history and as a product feature; **do not sequence the revenue model behind it.** ⚠ It is also **useless against the §3.0d-ii residual leak** — a token proposal is genuinely what it says it is, so there is nothing for the couple to contradict | **Demoted 2026-07-21 by the 3d correction** |
| 15 | ⚠ **Binding cards + mandatory inclusions + quote-vs-card detection + report queue** — ~~a prerequisite for the lock meter~~ **NO LONGER a revenue prerequisite** (§3.0d-ii). It protects **listing accuracy**, which is a real product concern, but the fee no longer depends on it. **Re-scope before building** — the original sizing assumed it was gating revenue | **Demoted 2026-07-21** |
| **21** | 🚨 **OPEN — VERIFICATION WALL, still unanswered.** Does a vendor appear on `/explore` **before** an admin verifies them? The owner did **not** answer this on 2026-07-21. ⚠ Interacts with §4.3's *"search must never return empty"* and with the measured supply constraint (**4 real vendors, 3 waiting** — 46 of 50 profiles are demo). **Not resolved, not assumed** | Carried — untouched by the 2026-07-21 block |
| **22** | 🚨 **OPEN — the whole SUBSCRIPTION LADDER is unpriced** (§3.0f-recost). Owner: *"we still need to access and recost the price subs of the vendors. reach. website name reveal and more."* Levers named (**reach · website · name reveal · more**); **prices reserved by the owner**. ⚠ **Urgent, not housekeeping** — with the Booking Fee capped at ₱4,000 the subscription is where value capture must live. ⚠ *"Name reveal"* is a NEW lever that collides with *"nothing couple-facing may be tiered"* (§3.0f) and *"search must never return empty"* (§4.3) — needs reconciliation, not just a number | **Reopens sign-off #2** — the catalog supersession is itself provisional |
| ~~16~~ | ✅ **RESOLVED 2026-07-21 by decision 8** — market-relative outlier triage (rung 5) is **DELETED**, not reframed. Owner: *"we do not expose them if they are underpriced or overpriced, we only watch what they offer and what they declare from us."* No market comparison exists to create exposure | ~~Philippine Competition Act~~ — **exposure removed at source** |
| **16b** | ⚠ **The cost of #16's resolution, for the record** (§3.0a, §3.0d-ii): exposure was part of what made misdeclaration self-correcting. What remains is slow and invisible to the vendor — worse-fitting leads felt over months. **Weakest exactly now, at 63 events** | Priced in deliberately, not overlooked |
| 17 | 🚫 **CHAT NEVER SCANNED for enforcement** (§3.0g) — owner-decided boundary; ship the in-thread *"Record this booking"* action instead | Aligns with the calls-never-recorded lock |
| 18 | **Misdeclaration ladder + ToS** (**§3.0b** — the "§3.0i" pointer was dangling; corrected 2026-07-21) — ToS must **define misdeclaration and permit back-billing** or there's no basis to charge the difference. Sanctions **reputational, not financial** (max at stake is the **₱4,000** cap — chasing it is even more uneconomic than at ₱7,500, which strengthens the argument). ⚠ **Re-scope against §3.0d-ii** — back-billing was designed for a declared-vs-actual gap that the prepaid mechanism largely closes; the ToS need it only for the **off-platform-substitution leak**. ⚠ ToS must also cover the **prepaid send gate** and whatever **3d-iii-b** decides about refunds | ⚠ **Narrowed 2026-07-21** |
| 19 | **Vendor-facing copy (§8)** — must match the mechanism exactly; the wording is a commitment, not marketing | New |
| 20 | **`(vendor, event)` uniqueness constraint** — one lock per vendor per event on the TOTAL engagement, or a ₱500k package gets split into line items. Cheap now, awkward later | New |

**Also owed:** verify build state against the correct repo checkout (§1 caveat) before any public claim about co-presence or in-booth reviews.

## 8 · Vendor-facing copy — DRAFT

> ### Why Setnayan asks for your real prices
>
> **You've lost clients to fake floor prices.** A competitor advertises "packages from ₱15,000," the couple books a meeting, and by the time the real number lands at ₱80,000 you were never in the running — because your honest price looked expensive next to their fiction.
>
> Setnayan is built so that can't happen.
>
> **Every price here comes from a real booking.** Your listed price and the price you actually charge are one number. Over time, your bookings build a **verified price** — a record, not a claim. Couples see what things genuinely cost, and you're compared against other real numbers instead of someone's advertising.
>
> **What this gets you:**
> - **Couples arrive already qualified.** They've seen your real price before they message you. Fewer meetings that were never going to close.
> - **You compete on your work,** not on who advertises the lowest fiction.
> - **Your verified record is a credential no one can fake.**
> - **You pay nothing until you win.** ⚠ **[SUSPENDED — DO NOT SHIP THIS LINE AS WRITTEN.]** Unlimited inquiries, free. A minimal booking fee only when a couple you met here actually books you — **from ₱50, never more than ₱4,000. You keep 98%, and more as you grow.** The full schedule is published before you join. Clients you bring yourself are always free.
>
>   🚨 *Under the corrected mechanism (§3.0d) the fee is **prepaid to send your finalized proposal** — which happens **before** the couple accepts. "You pay nothing until you win" is therefore **not literally true**, and this is precisely the failure note ③ below warns about: a promise the build breaks. Accurate replacement: **"Unlimited inquiries, free. You pay a minimal fee only to send your final proposal — from ₱50, never more than ₱4,000."** Whether the softer framing may be used at all is **OPEN sign-off 3d-iii-a**, and whether a walked-away client earns a refund or credit is **OPEN sign-off 3d-iii-b**. Both must land before this section is published.*
>
> **What we ask:** that the amount you record for a booking is the amount you agreed. Your client confirms it too — so it's never your word alone, and never ours.
>
> **If records don't match,** we'll ask you about it privately first. Genuine scope changes are normal and expected. What we can't carry is a pattern of listed prices that don't match what couples are charged — because that's the exact thing this protects everyone from. In that case your price simply shows as unverified until it's corrected.

**Notes on use:** ① **Lead with the grievance, not the rule** — every PH vendor has lost a lead to a fake floor price and can name the competitor; once they're nodding, the declaration requirement reads as protection rather than surveillance. ② ***"Your client confirms it too"* is the sentence that defuses the objection** — it pre-empts "so you don't trust us?" ③ ⚠ **The copy must match the mechanism exactly.** If the real ladder is harsher than *"shows as unverified,"* or couple-confirmation is optional in the build, this becomes a promise you break.

---

## 7a · Competitor pricing — MEASURED

**Bridestory** (regional incumbent, live in PH) — pulled from their own calculator, 2026-07-20. ⚠ Location autocomplete fell back to **Jakarta/Indonesia**, so these are IDR home-market rates; PH rates unconfirmed.

| | Trial | Silver | Gold ("best seller") |
|---|---|---|---|
| Price (Photography) | Free | **IDR 343,000/mo** ≈ ₱1,220 | **IDR 686,000/mo** ≈ ₱2,440 |
| Credits | 35 | "Unlimited" | "Unlimited" |
| Premium listing · search marketing | ✗ | ✗ | **✓** |
| **Transaction fee (Bridestory Pay)** | **0.5–2.4%** | **0–2.2%** | **0–2.2%** |

- **Prices computed from service category + location** — direct validation of §3.0's category × location banding.
- **Gold is exactly 2× Silver, and everything it adds is visibility** — Gold is a boost product in a tier's clothing.
- **They stack three lines:** subscription + payment processing + paid placement. The subscription barely buys down the fee (2.4% → 2.2%).
- **Their transaction fee is card PROCESSING, not commission** — it applies only when the couple pays through Bridestory Pay. *0% Installment is flagged "currently only available in Indonesia," so PH vendors may be effectively subscription-only.*
- **⚠ Their vulnerability:** feature rows read *"Visible Contact Details (Only When You Have Credits)"* and *"Access to Bridestory Inbox (Only When You Have Credits)."* **Their inbox is credit-gated** — the exact couple-harm this model designs out. Attack line: ***"One price. No transaction fee. Your inbox is never locked."***
- **⚠ Honest gap:** Gold ≈ ₱2,440/mo vs Pro+3D ₱4,499 — **~1.8× the incumbent's top tier.** The 3D booth must carry that entire gap, which is why instrumenting it (§5.1) is not optional.

**Others:** The Knot / WeddingWire **$200–$1,200/mo** per vendor (premium $1,500–$8,000+/yr) · [Planning.Wedding **$19/mo** flat, no commission](https://planning.wedding/advertise-wedding-business) · [Maroo **$0–85**, free CRM, card fees passed to the client](https://www.maroo.us/pricing) · [Perfect Venue **$119–199/mo**](https://www.perfectvenue.com/pricing) · HoneyBook **$32.50/mo** · Aisle Planner **$69.99+/mo**.

**⚠ US price points do NOT transfer to PH** — a US photographer charging $4,000 absorbs $200/mo; a PH photographer at ₱50k cannot absorb ₱11,600. Read them as proof the *structure* supports far more than a listing site, not as targets.

### 7b · The 0%-commission cohort — how they actually earn

**[Rightmove](https://cayucoscapital.substack.com/p/one-of-the-best-businesses-ever-conceived) is the canonical model:** UK property portal, **never takes a commission on any transaction**, agents pay **monthly membership priced by branch count** plus premium features and priority placement. Described as *"one of the best businesses ever conceived."* **This is precisely the shape designed here** — subscription scaled by business size + paid prominence + 0% on transactions. Contrast **Zillow**, which sells leads on CPC/CPM; Rightmove's flat-fee version is the more profitable one.

| Mechanism | Who | Setnayan |
|---|---|---|
| Supply-side subscription by size | Rightmove, WeddingWire, Planning.Wedding | ✅ |
| Paid prominence / placement | Rightmove premium, Bridestory Gold | ✅ deferred |
| **Adjacent transaction margin** | Zola & Joy (registries), Minted (stationery), The Knot (free couple tools → charge vendors) | ✅ **Pabuya + couple SKUs — undecided whether this is a real second engine** |
| Processing fees passed to the client | Maroo | ❌ ruled out (0%/no-convenience-fee lock) |

> **🔑 THE PRECONDITION.** Rightmove charges four figures a month because **every UK buyer starts there.** Zola skips vendor fees because it owns the registry transaction. **Every 0%-commission business monetizes supply — and every one first had to own demand.**
>
> **So the answer to "we need another way to earn" is not another mechanism. It's demand.** 3D Plan, Papic, the guest layer and the free couple tools are not costs to be recovered by a fee — they are the moat that makes vendor subscriptions chargeable at all. **At 63 events, the constraint isn't the revenue model. It's the 63.**

**Local landscape:** Bridestory (credits + tiers + Pay) · [Kasal.com](https://kasal.com/) (since 2001, ~20,000 suppliers, "Priority Listed Vendor" paid placement, physical expos) · **Coheven.com** (Filipino, 2024, two-sided, **escrow** — took the opposite fork: hold the money, so you *can* take a cut) · [Bridalpod](https://www.bridalpod.ph/) (**free** budget/guest/RSVP/website/search — so *free couple tools are table stakes in PH, not a moat*) · Event Nest, Brideworthy, eKasal, Vowly · **Facebook supplier groups do the volume, free.**

**⚠ Two corrections to earlier claims in this doc's own drafting:** (1) *"0% commission is unmatched in PH"* is **wrong** — Bridestory advertises "No Admin Fee" for paid members. (2) The marketplace itself is crowded and commoditised; **the differentiator is the event-day layer nobody else has built, not the fee structure.**

**Exploitable gap:** Kasal, Bridestory, and Bridalpod **all hide vendor pricing behind a contact form** (same as The Knot — platforms monetising inquiries have no incentive to publish prices). **Publishing yours is cheap, honest, and immediately differentiating** — and it's the same standard §3.0a applies to vendors.

**Recon still owed:** register as a vendor on Bridestory PH, Kasal, and Bridalpod for real local rates; and a proper teardown of Coheven, the closest direct competitor (currently secondhand description only).

## 7 · Sources

Prismm/Cvent — [platform](https://www.prismm.com/), [floor planning](https://www.prismm.com/solutions/event-design-software/floor-planning-software-venues-planners-vendors), [3D virtual tours](https://www.prismm.com/solutions/3d-virtual-tour-software) · [3D Event Designer pricing](https://www.3deventdesigner.com/plans-pricing) · [Merri / 3D floor plan roundup](https://www.vow.app/blog/3d-event-floor-plan-software) · [Allseated vs Social Tables](https://www.perfectvenue.com/post/allseated-vs-social-tables) · [Tripleseat Floorplans](https://floorplans.tripleseat.com/) · [BrideVue](https://www.bridevue.com/) · [Pearl by David's Bridal](https://www.retaildive.com/news/davids-bridal-launches-wedding-planning-platform-with-vendor-marketplace/641424/) · [vFairs exhibit hall](https://www.vfairs.com/features/virtual-exhibit-hall/) · [MootUp](https://mootup.com/virtual-exhibition/) · [rooomSpaces](https://www.rooom.com/rooom-spaces) · [Communiqué metaverse](https://www.virtualtradeshowhosting.com/solutions/metaverse-event-platform/) · Seat-finders: [Please Find Your Seat](https://pleasefindyourseat.com/), [SeatYourself](https://seatyourself.io/), [Wedibox](https://www.wedibox.com/features/wedding-seating-chart), [DigiSeats](https://digiseats.com/), [Venued](https://www.venued.app/), [SeatScan](https://svenstudios.com/seatscan-qr-table-seating-plan/), [Simplify Tables](https://www.simplifytables.com/), [SeatPlan.io](https://seatplan.io/)

**Related corpus:** [`3D_Venue_Makers_Council_Verdict_2026-07-19.md`](3D_Venue_Makers_Council_Verdict_2026-07-19.md) · [`Demo_3DPlan_Build_Brief_2026-07-03.md`](Demo_3DPlan_Build_Brief_2026-07-03.md) · [`Seat_Plan_2D3D_Alignment_Directive_2026-07-15.md`](Seat_Plan_2D3D_Alignment_Directive_2026-07-15.md) · `Pricing.md § 00` · `Competitor_Kuha_Teardown_2026-07-20.md`

---

**⚠ All ₱ projections here are MODELLED.** Measured prod (2026-07-20): **63 events · 5 in-app orders ever · vendors on free-during-launch.** No walk-through, booth-impression, or lock-rate data exists yet. Every number in this doc is a starting hypothesis to be replaced by measurement.
