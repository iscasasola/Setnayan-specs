# The supplier's Setnayan page — review · 2026-10-03 · Fable

Owner: *"what does a supplier setnayan page have on both desktop and mobile view. and how can we improve this. their portfolio reflect what they have collected on events."*

Read-only against `origin/main` **74ff0bec** (`app/v/[slug]/page.tsx`, 4,323 lines) and the prod DB. Drawing: `prototypes/supplier_page_2026-10-03_fable.html` (+ `.png`). Rules applied: INTERACTION_RULES.md · DECISION_LOG 2026-09-10/11/14 (universal page, Free minimal, stock photo, no doors out) · 2026-10-03 (Papic → supplier page, Allow, own shots only).

**Prod today (re-measure, never trust this line):** 2 public shops, both Solo — `saysay-live-band-and-hosting-fix` (2 cards · no logo · no tagline · no pin) and `setnaprod` (logo + pin · **0 active cards**). Both: 0 portfolio photos · 0 videos · 0 reviews · 0 completed events · 0 Papic shots · 0 imported album photos.
`select business_slug, array_length(portfolio_r2_keys,1) from vendor_profiles where verification_state='verified'`

---

## a · What the page has today

Order top → bottom. **Phone** = <640 px (Tailwind `sm:` off). **Desktop** = ≥1024 (`lg:`). Empty folds are not drawn. Anchor = greppable string in `page.tsx`.

| # | Fold (real heading) | Source | Phone | Desktop | Anchor |
|---|---|---|---|---|---|
| 1 | Header: wordmark · "Plan with Setnayan" / "Return to Dashboard" | — | link **hidden** | link shown | `hidden text-sm font-medium` |
| 2 | Banner photo | `microsite.heroPhotoKey` (Pro) else **stock `/placeholders/vendor.webp` when 0 photos** | 176 px | 256 px; Enterprise+photo: 416 px cinematic hero with name over it | `VENDOR_PLACEHOLDER_PHOTO` · `cinematicHero` |
| 3 | Identity: logo/initials · name (serif italic) · tagline · chips `✓ Verified` · `New to Setnayan…Elite` · ★ avg · "N saved" (≥3) · "N yrs in business" · "On the marketplace since …" · 📍 city · "Replies in your Setnayan inbox" · Inquire + Share (+ "Walk into my booth") · map · Google Maps/Waze/Apple Maps · "Also here" branches | `vendor_profiles` · `vendor_public_completed_events_stats` · `vendor_trusted_review_stats` · `count_saves_for_vendor` · `vendor_branches` | stacked, logo above name | logo left of name; Pro/Ent: Inquire row hidden (rail instead) | `displayLabel` · `expTier.longLabel` · `FAVORITES_MIN_DISPLAY` · `marketplaceSince` |
| 4 | About (Solo+, if typed) | `vendor_microsites.about` | | | `canPersonalizePage && microsite.about` |
| 5 | Songs they play (music shops) | `vendor_songs` | 1 col | 2 col | `Songs they play` |
| 6 | **Portfolio** — one flat grid: photos, then YouTube/Vimeo inline, then synced IG posts; **no caption, no event, no lightbox** | `portfolio_r2_keys` · `gallery_video_links` · IG sync | 2-up, video spans 2 | 3-up | `showPortfolio &&` |
| 7 | Featured in these stories | `fetchVendorPoolBookings` → published stories · featured chapters | 1 col | 3 col | `id="featured-stories"` |
| 8 | Services offered (pills) | `vendor_profiles.services` | | | `Services offered` |
| 9 | Details (per-category flags + facts) | `vendor_service_attributes` | facts 1 col | facts 2 col | `attributeDetails.length` |
| 10 | Event compatibility: Ceremonies · Venues | `compatible_ceremony_types` · `compatible_venue_settings` | | | `Event compatibility` |
| 11 | Services & pricing — "Starting prices set by X. Final quotes happen in chat." filter chips · cards (title · from ₱ · ≤5 showcase photos · ✓ inclusions · Serves) | `vendor_services` + inclusions/discounts/coverage | 1 col | 2 col | `ServicesPricingSection` · `services-gallery.tsx` |
| 12 | Verified typical price (flag) | `fetchVendorVerifiedMedian` | | | `verifiedMedianEnabled()` |
| 13 | Packages | `vendor_packages` | 1 col | 2 col | `VendorPackagesSection` |
| 14 | Reviews: "Recommended by N couples" · **Track record** ("Wedding · MAR 2027", or "Recent weddings"/"Weddings at your venue" with venue name) · histogram · rows · "This supplier still has no review." | `vendor_reviews` · `vendor_completed_events` · `events.venue_name` | 1 col | 2 col | `ReviewsSection` · `TrackRecord` · `VenueMatchedEvents` |
| 15 | Trusted by (supplier endorsements) | `vendor_partnerships` | | | `TrustedBySection` |
| 16 | Inquire: prose · celebration picker · signed-in composer or anon composer ("Log in free to see your conversation") · waitlist card · **"Plan with Setnayan" + "Back to home"** | `event_vendor_preferences` · `vendor_waitlist` | | | `id="get-in-touch"` |
| 17 | Sticky rail (Pro/Ent only): ★ · Inquire · Share · "Starts a **masked** chat" · city · events · years | — | **absent** | right column 320 px | `hidden lg:block` |
| 18 | Footer: "Powered by SETNAYAN · Set na 'yan" · "Supplier ID · S89V-…" · "Report this shop" | — | | | `Report this shop` |

**Flags on this page (code default; prod value unknown unless NEXT_PUBLIC and visible):** `NEXT_PUBLIC_SERVICE_DETAILS_ENABLED` (off → no "View details" sheet) · `NEXT_PUBLIC_CARD_RECORD_ENABLED` (off) · `NEXT_PUBLIC_VERIFIED_MEDIAN_ENABLED` (off) · `NEXT_PUBLIC_PACKAGE_CREDIT` (**on** by default) · `NEXT_PUBLIC_VENDOR_SEO_TIER_GATE` (off) · `NEXT_PUBLIC_VENDOR_EXPERIENCE_ENABLED` (on unless `'false'`) · `NEXT_PUBLIC_PLAN3D_BOOTH_SHOWCASE` (off) · `VENDOR_TIER_FEATURE_GATE` via `vendorPaywallApplies`. Tier gates: `tierCaps(effectiveTierState)` → `premiumLayout` (Pro+) · `micrositeCan` → `canPersonalize` (Solo+) · `isEnterprise`.

**Metadata/OG:** title "X · Setnayan supplier", description = tagline or "X on Setnayan.", canonical `setnayan.com/{slug}`, OG image `/api/og/v/{slug}` (1200×630), LocalBusiness + Breadcrumb JSON-LD. (The approved calling-card share, §A of the 2026-09-10 drawing, is not what ships — title still ends "· Setnayan supplier".)

**Doors in (how a couple reaches it):** Explore cards + compare (`?src=explore`) · the bare root `setnayan.com/{slug}` (`app/[slug]` dispatcher, ruling 2026-09-27) · the couple's supplier list, shortlist, library/favorites (`?src=favorites`), review page, packages page, day-of "get help" · chat/vendor info card (`#reviews`) · Trusted-by chips · story credits (`/u/…/c/…?ref_chapter=`, Real Stories credit chip) · booth cards · the on-the-day guest-review QR. **Supplier self-preview exists:** `/vendor-dashboard/website` — same-origin iframe + "Open live"/"Open preview", with "Only you can see this page" until verified.

**Fake vs live:** nothing typed; every fold reads a table. Two render as "zero" on a failed read and are documented as such (favorites count, service links). Dead/odd: rail says "masked chat" (masking retired 2026-09-08); a hidden shop's "Also here"/map never leak; no links out (ruling Q3 holds).

---

## b · What is wrong or missing — worst first

1. **The portfolio does not reflect events.** The only public photo fold is a flat grid of `portfolio_r2_keys` + pasted videos + IG — no event, no date, no venue, no lightbox, no order. What the supplier actually collects at Setnayan events (`vendor_papic_captures`, `vendor_papic_portfolio_photos`, both keyed by `event_id`) has **no public reader at all**: `grep -rln vendor_papic_captures apps/web/app/v` → none. The approved S3 drawing (papic_to_supplier_page b) drops allowed photos into the same flat grid — it reaches the page but still loses the event. `showPortfolio &&` in `page.tsx`.
2. **The stock banner still ships, unmarked.** `portfolioUrls.length === 0 ? <Image src={VENDOR_PLACEHOLDER_PHOTO}` — both live shops open on a picture nobody chose. Ruling 2026-09-11: clean card; A1b 2026-09-14: a sample only if **clearly marked** — it is not (alt = the shop's name). `VENDOR_PLACEHOLDER_PHOTO` in `page.tsx`.
3. **The calling card (§F, approved 2026-09-14) is not what ships.** The top is logo + name + up to six chips + since-line + city + buttons + map + nav pills; the receipt line "Papers checked · Sep 2026" and the "N events through Setnayan" fact are not there; "✓ Verified" carries its explanation only in a `title=` tooltip (invisible on phone). `vendor.verification_state === 'verified' ?` in `page.tsx`.
4. **Facts said four times.** "Services offered" pills · "Details" per-category flags · "Event compatibility" ceremonies/venues · each card's "Serves:" line — four folds between the photos and the prices on a phone. `Services offered` · `Event compatibility` in `page.tsx`.
5. **Track record and the work are two folds that describe the same events.** Track record = "Wedding · MAR 2027" rows inside Reviews (`TrackRecord`, `VenueMatchedEvents`); the photos of that same wedding, once S3 ships, would sit in Portfolio with no link between them. `function TrackRecord` in `page.tsx`.
6. **Order is not the approved order.** Approved: card · what they offer · their work · in their own words · their record · add them · ask them. Shipped: identity · About · Songs · Portfolio · Stories · Services offered · Details · Compatibility · Services & pricing · Packages · Reviews · Trusted by · Inquire. Services & pricing — the reason the page exists — is the 11th fold. `<section className="space-y-3 border-b border-ink/10 py-8">` order in `page.tsx`.
7. **Two doors out at the bottom of Inquire** — "Plan with Setnayan" and "Back to home" after the composer; "Back to home" leaves the shop the couple was reading. `Back to home` in `page.tsx`.
8. **Desktop for Solo is a 768-px column in a 1280 window** with the rail reserved for Pro — right per the Free-minimal ruling, but the grids are the only thing that changes, so a long phone page becomes a long narrow page. `premiumLayout ? 'max-w-screen-2xl' : 'max-w-3xl'`.
9. **Rail copy stale:** "Starts a masked chat in your Setnayan inbox." (masking retired 2026-09-08). `Starts a masked chat` in `page.tsx`.
10. **Share card not the approved one** (§A of the 2026-09-10 drawing): title "Lumina Studio · Setnayan supplier", description = tagline. `vendorMetadataBySlug` in `page.tsx`.

Not wrong, noted: a shop with 0 active cards (setnaprod) reads "hasn't listed a service you can ask about yet" — honest; the IG sync and the booth link are inert in prod (flags/no Meta config).

---

## c · Proposed changes (drawing frames 3–4)

| # | Change | Size · who | Reuses |
|---|---|---|---|
| C1 | **Their work** replaces Portfolio: one list of the supplier's Setnayan events, newest first. Each event with allowed photos = a small album card (1 big + 2 small, "+N", label **Event type · venue · Mon YYYY**, "N photos", "Read their story ›" when the couple published one); an event with none = the Track-record row; the supplier's own uploads (`portfolio_r2_keys` + videos + IG) = the last album "Their own uploads". Tap → lightbox. Phone 1-up, desktop 3-up. **By reference**: public read joins `vendor_papic_captures` ∪ `vendor_papic_portfolio_photos` through the S3 Allow rows, `hidden_at is null` — a takedown (TD-1, `hide-a-reported-photo.ts` already covers both tables) or the couple's Hide removes it with no second write. Label parts: type + month from `vendor_completed_events` (already public); venue from `events.venue_name` under the shipped rule (`landing_page_visibility !== 'private'`); **never the couple's names**. | **large · Opus** — after S3 (Ask/Allow) lands, since it is S3's public end | `TrackRecord` row shape · `VenueMatchedEvents` venue rule · `featuredEditorials` door · S3's Allow table · `resolvePortfolioUrls` |
| C2 | Calling card at the top instead of banner + identity block: mark · name · "what · where" · facts line (`✓ Papers checked · Mon YYYY` from `verification` approval date, "N events through Setnayan", tier) · Inquire · Share · "Replies in your Setnayan inbox" · "Map ›" (map + nav pills fold under it). No stock picture. Pro photo / Enterprise hero stay as gated. | medium · Sonnet | §F drawing (approved) · existing chips' data · `VendorLocationMap`, `NavLinksRow` |
| C3 | One **Details** fold: services pills, then per-category flags + facts, then Ceremonies, Venues as eyebrow rows. Removes "Services offered" and "Event compatibility" headings. | small · Sonnet | the three shipped blocks, re-stacked |
| C4 | Approved order: card · Services & pricing · Their work · About · Details · Reviews (+ Trusted by, Packages after pricing) · Inquire. | small · Sonnet | section moves only |
| C5 | Drop "Back to home"; keep "Plan with Setnayan". | tiny · Sonnet | — |
| C6 | Rail copy → "Replies in your Setnayan inbox." | tiny · Sonnet | — |
| C7 | Share card as approved §A (title "Name — what · where", description from facts). | small · Sonnet (`vendorMetadataBySlug` + `api/og/v/[slug]`) | 2026-09-10 §A drawing |
| C8 | Supplier side, no new screen: in the S3 Ask bar, the chosen photos are already per event — nothing to add. In My Shop → Website preview, the iframe already shows the result. | — | shipped |

Guards to ask the builder for: a db test that the public read never returns a row whose `hidden_at` is set or whose Allow is not `allowed`; a unit test that the album label never contains `host_names`/couple names; the existing `one-inquire-button.test.ts` and `no-door-out-of-the-app.test.ts` stay green.

---

## d · Owner questions (recommended answer first)

1. **The album label.** → **"Event type · venue · Mon YYYY", no names** (what Track record and Recent weddings already print; venue only when the event is not private). Alt: names with a second Allow line ("…and name us") — more to build, more to regret.
2. **Papic Challenge photos (guest-shared) on the public page.** → **Not yet.** The shipped guest tap wording does not say "on their Setnayan page"; show them publicly only for shares made after frame D's line ships, and inside the same event album. Alt: never public, supplier receives privately only.
3. **Where the supplier's own uploads sit.** → **Last album, "Their own uploads"**, so Setnayan events lead (the owner's point). Alt: first, as today.
4. **Should Track record move into Their work (one list)?** → **Yes** — one fold, one truth per event; the Reviews fold keeps "Recommended by N couples" and the stars. Alt: keep both folds.
