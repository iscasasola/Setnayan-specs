# Iteration 0038 — Editorial & Affiliates

**Iteration number:** 0038
**Topic:** Editorial section on setnayan.com (long-form articles + curated recommendations) with disclosed curated-affiliate links and clearly labelled sponsored-content placements. Layered onto the existing public marketing site as a first-party owned-media monetization surface that complements Boosted Ads / Sponsored Boost without competing for the same inventory.
**Surface:** Public `setnayan.com/blog`, `setnayan.com/recommendations`, `setnayan.com/blog/[slug]`, `setnayan.com/recommendations/[category]`, plus a new **Editorial** section inside the 0023 admin console for publish workflow + sponsored-content moderation.
**URL pattern:** `setnayan.com/blog`, `setnayan.com/blog/[slug]`, `setnayan.com/recommendations`, `setnayan.com/recommendations/[category]`, `setnayan.com/recommendations/[category]/[slug]`, `setnayan.com/dashboard/admin/editorial`
**Builds on:** 0015 (marketing site shell · brand voice · locales), 0022 (Boosted Ads + Sponsored Boost — guardrail-coordinated so AdSense in 0039 doesn't undercut these vendor placements), 0023 (admin console — editorial publish queue + sponsored-content moderation), 0028 (email notifications — newsletter sponsorship slot), 0029 (Help Center — same git-tracked MD pattern), 0035 (PostHog — affiliate click + conversion tracking, no PII).
**Status:** Drafted 2026-05-19.
**Phase:** V1.1 monetization expansion. Not launch-blocking. Owner-greenlit traffic-monetization scope expansion (CLAUDE.md decision log 2026-05-19) — separate from V1 ship.

---

## 1. Why this iteration exists

setnayan.com gets traffic from couples Googling vendor categories, wedding ideas, planning timelines, and Filipino-specific cultural questions. Today every visitor either signs up, leaves, or bounces — there's no editorial layer to catch the long-tail SEO traffic that isn't yet purchase-intent, and no monetization surface that converts pre-purchase browsing into revenue.

This iteration adds three first-party owned-media surfaces:

1. **Editorial articles** (`/blog`) — long-form content (planning timelines, cultural how-to, vendor-category explainers, real-wedding features). SEO ranks them for "how to" + "what is" + "Philippine wedding [X]" queries. Free, no paywall, no ads (display ads land in 0039 on a separate surface decision).
2. **Curated recommendations** (`/recommendations`) — editor-curated "what we recommend" pages with **disclosed** affiliate links to wedding-adjacent merchants (hotels, honeymoon travel, paper invitations, bridal-gown rentals, beauty services, lifestyle gifts). Each link surfaces revenue per click or per conversion via an affiliate network. Disclosure is mandatory and visible above the fold.
3. **Sponsored content** — clearly labelled paid features (bridal-magazine model). A vendor or partner pays Setnayan to publish a feature; the feature carries an unambiguous "Sponsored" badge + disclosure line at top and bottom. Uses the same publishing pipeline as editorial articles with a `is_paid_placement = TRUE` flag.

**Why this complements rather than competes with Boosted Ads:**

- Boosted Ads + Sponsored Boost (locked 2026-05-16 in [0022 § 5b](../0022_vendor_dashboard/0022_vendor_dashboard.md)) monetize **marketplace discovery traffic** — couples already in vendor-shopping mode.
- This iteration monetizes **pre-purchase research traffic** — couples Googling "what should I do 12 months before my wedding" who aren't yet ready to pick a vendor. Different funnel stage, different inventory.
- Vendors who pay for Boosted Ads can ALSO buy Sponsored Content here — but the buying motion is editorial-feature ratecard, not marketplace placement.

**Why this is V1.1 and not V1:**

V1 ships the underlying tables + a placeholder `/blog` route with 3 seed articles drawn from the owner's existing planning notes (zero net-new content production). The full editorial cadence (1 article/week + 1 sponsored slot/month + 4 recommendation pages) is the V1.1 ramp.

---

## 2. Surface architecture

### 2.1 Editorial home — `setnayan.com/blog`

- No login required. Anyone can read.
- Hero: featured article (manually pinned via `is_featured = TRUE` in `editorial_articles` — only one at a time).
- Below: paginated list of articles ordered by `published_at DESC`. 12 per page.
- Each card: cover image (1200×630 OG-spec) · title · 80-char excerpt · category chip · estimated read time · publish date.
- Filter chips above the list: All · Planning · Vendors · Culture · Real Weddings · Setnayan News.
- Footer: "Subscribe to the newsletter" CTA → opens the existing 0015 newsletter subscribe modal with `source = 'editorial_home'` attribution.
- **NO ads on `/blog` index page** (cleaner SEO crawl; AdSense kicks in only on individual article pages per 0039).

### 2.2 Article page — `setnayan.com/blog/[slug]`

- Breadcrumb: Blog / [Category] / [Article title]
- Hero image (1200×630 OG) + title + author byline ("Setnayan Editorial" by default; named author optional) + publish date + estimated read time
- Article body (markdown rendered server-side, same renderer as 0029 Help Center)
- Inline link pattern: any `[text](https://merchant.example)` link with a domain in the `affiliate_link_domains` allowlist auto-decorates with a `data-affiliate="true"` attribute that fires a PostHog event on click (see § 5)
- Inline "Recommended by Setnayan" call-out cards every 800–1200 words → links to `/recommendations/[category]`. Cards have explicit "May earn commission" disclosure microcopy.
- "Related articles" — three other articles tagged with the same primary category
- "Last updated [date]" — stamps `last_updated_at`
- AdSense unit (per 0039): exactly ONE block, below-the-fold, after the article body. Topic filter excludes wedding/event categories so we never serve competitor ads on a Setnayan editorial page.
- Footer: "Subscribe to the newsletter" CTA → 0015 newsletter signup

### 2.3 Recommendations home — `setnayan.com/recommendations`

- No login required. Anyone can read.
- **Disclosure banner at top of every page** (not collapsible): "Setnayan may earn a commission when you book or buy through links on this page. We only recommend services we'd trust for our own clients."
- Category tiles: Honeymoon Travel · Bridal Gowns · Paper & Stationery · Beauty Services · Wedding Gifts · Lifestyle & Home · Wedding Insurance.
- Each tile: tile cover image + category name + "View N picks" link to `/recommendations/[category]`.

### 2.4 Category page — `setnayan.com/recommendations/[category]`

- Disclosure banner repeats at top (mandatory per RA 10173-adjacent FTC-style transparency norms).
- Intro paragraph: editor explains why these picks, what criteria were used, last reviewed date.
- 5–12 recommendation cards. Each card uses the **standard editorial card pattern** from `/blog` — NOT the AdSense `.ad-unit` styling from 0039 § 3.3a tenet 13. Cards must read as editorial recommendations, not as banner ads:
  - Merchant logo / product image (16:9 or square, never animated)
  - Merchant name in the editorial font / size used throughout `/blog`
  - 2-3 sentence editor commentary
  - "Why we picked it" bullet list (3-5 bullets)
  - Price band chip (₱ / ₱₱ / ₱₱₱) — qualitative, not quoted prices (prevents stale-price drift)
  - Outbound CTA button — Setnayan design-system primary button (NOT a generic "Buy now" red CTA). Label: "Book on [merchant]" or "Shop on [merchant]" → opens affiliate link in a new tab with `rel="sponsored nofollow noopener"` attribute (Google quality-guidelines mandate)
  - **Disclosure microcopy beneath the CTA — 12px, neutral gray (`var(--text-tertiary)`), single line: "Sponsored link — Setnayan may earn a commission"**. Visible but never heavy-handed; matches the "non-invasive" tenets owner directed 2026-05-19.
- "Last reviewed [date]" stamp — surfaces visibly at top of category page
- AdSense unit per 0039: exactly ONE block, below the last card, lazy-loaded, "Advertisement" labelled. Same topic-exclusion filter. See 0039 § 3.3a tenets for full styling rules.

### 2.5 Sponsored content article — `setnayan.com/blog/[slug]` (with sponsor badge)

- Same article-page layout as § 2.2, with these differences:
  - Sticky "Sponsored by [Sponsor]" badge top-right of the hero (yellow background, 14px text, never dismissible)
  - First line of article body: "This is a sponsored feature. [Sponsor] paid Setnayan to publish this story. Setnayan retained editorial control over [factual sections / brand voice]; promotional claims about [Sponsor]'s services are [Sponsor]'s own."
  - Sponsor's branded link block at the end of the article (visually distinct from editorial CTAs)
  - "Sponsored" chip on every card representation of the article (blog index, related-articles widget, social-card preview)
  - **NO AdSense** on sponsored content pages (sponsor paid for the page; no display-ad bleed) — exception to the 0039 default
- Cross-tag: every sponsored article also lives under a "Sponsored" filter chip on `/blog` so visitors can find or skip them in bulk

### 2.6 Admin editorial console — `setnayan.com/dashboard/admin/editorial`

New section inside 0023 Admin Console. Detail in section 6.

---

## 3. Content production pattern (git-tracked MD)

**Decision (per CLAUDE.md 2026-05-19 decision log):** content lives as markdown files in the monorepo under `apps/web/content/editorial/`. Same pattern 0029 Help Center uses. Reasons:

- Zero new vendor dependency (no Sanity / Contentful / Payload account)
- Zero new infrastructure (no separate CMS database, no separate auth)
- Editor UX is fine via VS Code or Cursor for owner + small editorial team; non-technical editors can use GitHub's web editor or Decap CMS as a lightweight Git-backed admin UI (V1.2+ layer if owner asks)
- Every draft becomes a PR → preview deploy → owner reviews on a real URL → merge ships it. Same review flow as engineering.
- All content version-controlled via git history. No "who changed this 6 months ago" mystery.
- Site rebuilds via Next.js ISR on merge to `main`; no manual cache invalidation.

### 3.1 File layout

```
apps/web/content/editorial/
├── articles/
│   ├── 2026-05-19_what-to-do-12-months-before-your-philippine-wedding.md
│   ├── 2026-05-22_understanding-bir-receipts-from-your-vendors.md
│   └── sponsored/
│       └── 2026-06-01_sponsored-bdo-wedding-loans.md
├── recommendations/
│   ├── honeymoon-travel.md
│   ├── bridal-gowns.md
│   └── paper-and-stationery.md
└── affiliate-merchants.yml
```

### 3.2 Article frontmatter schema

```yaml
---
slug: what-to-do-12-months-before-your-philippine-wedding
title: "What to do 12 months before your Philippine wedding"
excerpt: "The first three months of planning shape every decision after them. Here's the order we recommend."
category: planning            # planning | vendors | culture | real-weddings | setnayan-news
cover_image: /editorial/covers/12-months-out.jpg
author: Setnayan Editorial
published_at: 2026-05-19
last_updated_at: 2026-05-19
estimated_read_time_minutes: 8
is_featured: false
is_paid_placement: false      # TRUE for sponsored content
sponsor_name: null             # required if is_paid_placement = true
sponsor_disclosure_text: null  # required if is_paid_placement = true
tags: [first-time-planner, timeline, budget]
locale: en                     # en | tl (CEB deferred to V1.5)
---
```

### 3.3 Recommendation page frontmatter schema

```yaml
---
category: honeymoon-travel
title: "Where Setnayan couples go for honeymoons"
intro: "Three island stays, one mainland city break. Picked for trustworthy concierge service, transparent pricing, and reliable WiFi for the couple's first away-from-the-wedding workdays."
last_reviewed_at: 2026-05-19
picks:
  - merchant_slug: agoda
    merchant_name: Agoda
    product: Boracay 4-night stay
    price_band: "₱₱"
    why_we_picked_it:
      - Reliable inventory across the island, including the small boutique stays
      - Flexible cancellation policy on most properties
      - Pesos billing — no FX surprises
    editor_commentary: "Agoda's Boracay coverage is the deepest in Southeast Asia and the cancellation windows are couple-friendly."
    affiliate_link_id: agoda_boracay_4n
  - merchant_slug: klook
    merchant_name: Klook
    ...
---
```

The picks array is the source of truth — render is automatic.

---

## 4. Affiliate-link tracking

### 4.1 Affiliate-network choice (V1.1 owner action)

Owner picks ONE primary affiliate network at V1.1 kickoff. Recommended order:

1. **Involve Asia** (PH-focused affiliate network) — strongest PH merchant coverage (Klook, Lazada, Shopee, Agoda, Trip.com, BDO, Vivere); single dashboard. ~5% net of commission goes to Involve Asia.
2. **Direct merchant programs** — Agoda Partner, Klook Affiliate, Booking.com Affiliate, Shopee Affiliates Program — higher cut but each is a separate signup + dashboard. Pile up these as Setnayan scales.
3. **Impact / CJ Affiliate** — global networks; add only if a specific premium merchant is on them and not on Involve Asia.

Spec ships network-agnostic — `affiliate_links` table stores the prepared outbound URL (already encoded with the appropriate affiliate ID per network) and a logical `merchant_slug` + `network_key`.

### 4.2 Click tracking (PostHog · no PII)

Every click on a `data-affiliate="true"` link fires a PostHog event:

```js
posthog.capture('affiliate_link_clicked', {
  merchant_slug: 'agoda',
  network_key: 'involve_asia',
  affiliate_link_id: 'agoda_boracay_4n',
  source_page_type: 'recommendation_category', // or 'article' or 'sponsored_article'
  source_page_slug: 'honeymoon-travel',
  category: 'honeymoon-travel',
  position_in_list: 1,
  // NO user identifiers, NO IP, NO referrer beyond same-domain
});
```

Properties are aggregate-only. No `distinct_id` is sent on this event — PostHog still attributes via session, but we explicitly do NOT couple this to the authenticated user (no `posthog.identify()` between the page load and the click). RA 10173 posture: aggregate analytics on first-party traffic is in-scope; cross-device personalization is not.

### 4.3 Conversion tracking (when network supports postback)

Involve Asia + Impact + CJ support server-to-server postbacks on completed bookings. We expose a single endpoint:

```
POST /api/affiliates/postback?network=involve_asia
```

Network sends `{ click_id, payout_amount_centavos, conversion_at, merchant_slug }`. We store in `affiliate_conversions`. Used for internal revenue reporting in 0023, never surfaced to the user who clicked (no PII linkage by design — we only know "a click on this `affiliate_link_id` eventually converted for ₱X").

### 4.4 Disclosure rules (non-negotiable)

- Every recommendation page top + bottom: "Setnayan may earn a commission when you book or buy through links on this page."
- Every recommendation card CTA: "Sponsored link — Setnayan may earn a commission" beneath the button.
- Every inline article link to an affiliate-allowlisted domain: small "↗" affiliate-pill suffix after the link text, with hover tooltip "Setnayan may earn a commission."
- Sponsored content articles carry the heavier disclosure pattern in § 2.5.

Disclosure renderer is centralized in the page template — editors cannot disable it.

---

## 5. Schema additions

All additions live alongside the existing 0015 marketing-site tables. None of these store PII.

```sql
-- 5.1 Editorial articles registry (mirrors the MD files for fast queries + admin surface)
CREATE TABLE editorial_articles (
  article_id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 text UNIQUE NOT NULL,
  title                text NOT NULL,
  excerpt              text NOT NULL,
  category             text NOT NULL CHECK (category IN ('planning','vendors','culture','real-weddings','setnayan-news')),
  cover_image_path     text NOT NULL,
  author               text NOT NULL DEFAULT 'Setnayan Editorial',
  estimated_read_time_minutes int NOT NULL DEFAULT 5,
  is_featured          boolean NOT NULL DEFAULT FALSE,
  is_paid_placement    boolean NOT NULL DEFAULT FALSE,
  sponsor_name         text,
  sponsor_disclosure_text text,
  tags                 text[] NOT NULL DEFAULT '{}',
  locale               text NOT NULL DEFAULT 'en' CHECK (locale IN ('en','tl')),
  published_at         timestamptz NOT NULL,
  last_updated_at      timestamptz NOT NULL,
  source_md_path       text NOT NULL,  -- git-tracked file path for traceability
  view_count           bigint NOT NULL DEFAULT 0,
  created_at           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sponsored_requires_metadata
    CHECK ((is_paid_placement = FALSE) OR (sponsor_name IS NOT NULL AND sponsor_disclosure_text IS NOT NULL))
);

CREATE INDEX editorial_articles_category_published_idx ON editorial_articles (category, published_at DESC);
CREATE INDEX editorial_articles_featured_idx ON editorial_articles (is_featured) WHERE is_featured = TRUE;
CREATE INDEX editorial_articles_sponsored_idx ON editorial_articles (is_paid_placement, published_at DESC);

-- 5.2 Recommendation pages (one row per category)
CREATE TABLE recommendation_pages (
  category             text PRIMARY KEY,
  title                text NOT NULL,
  intro                text NOT NULL,
  last_reviewed_at     timestamptz NOT NULL,
  picks_count          int NOT NULL,
  source_md_path       text NOT NULL,
  view_count           bigint NOT NULL DEFAULT 0,
  created_at           timestamptz NOT NULL DEFAULT now()
);

-- 5.3 Affiliate links registry (one row per (merchant_slug, affiliate_link_id))
CREATE TABLE affiliate_links (
  affiliate_link_id    text PRIMARY KEY,
  merchant_slug        text NOT NULL,
  merchant_name        text NOT NULL,
  network_key          text NOT NULL CHECK (network_key IN ('involve_asia','agoda_direct','klook_direct','shopee','lazada','impact','cj','other')),
  outbound_url         text NOT NULL,  -- pre-encoded with affiliate ID
  category             text NOT NULL,
  is_active            boolean NOT NULL DEFAULT TRUE,
  notes                text,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX affiliate_links_merchant_idx ON affiliate_links (merchant_slug);
CREATE INDEX affiliate_links_active_idx ON affiliate_links (is_active) WHERE is_active = TRUE;

-- 5.4 Affiliate conversions (postback log for revenue reporting)
CREATE TABLE affiliate_conversions (
  conversion_id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_link_id    text NOT NULL REFERENCES affiliate_links (affiliate_link_id),
  network_key          text NOT NULL,
  network_click_id     text,
  payout_amount_centavos bigint NOT NULL,
  payout_currency      text NOT NULL DEFAULT 'PHP',
  conversion_at        timestamptz NOT NULL,
  reported_at          timestamptz NOT NULL DEFAULT now(),
  raw_postback_payload jsonb NOT NULL,
  UNIQUE (network_key, network_click_id)
);

CREATE INDEX affiliate_conversions_link_idx ON affiliate_conversions (affiliate_link_id, conversion_at DESC);

-- 5.5 Sponsored content ratecard + booked slots (admin-managed)
CREATE TABLE sponsored_slot_bookings (
  slot_booking_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_name         text NOT NULL,
  sponsor_contact_email text NOT NULL,
  sponsor_contact_phone text,
  vendor_id            uuid REFERENCES vendors (vendor_id),  -- nullable: external sponsors allowed
  slot_type            text NOT NULL CHECK (slot_type IN ('sponsored_article','newsletter_sponsorship','recommendation_card')),
  agreed_rate_centavos bigint NOT NULL,
  scheduled_publish_at timestamptz NOT NULL,
  draft_url            text,            -- preview deploy URL
  published_article_slug text,           -- populated post-publish
  payment_status       text NOT NULL CHECK (payment_status IN ('pending_invoice','paid','refunded','cancelled')),
  internal_notes       text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  created_by_admin_id  uuid NOT NULL REFERENCES users (user_id)
);

CREATE INDEX sponsored_slot_bookings_status_idx ON sponsored_slot_bookings (payment_status, scheduled_publish_at);
```

---

## 6. Admin editorial console (extends 0023)

New tab in 0023 Admin Console: **Editorial** (insert after "Pricing Catalog", before "Funnels"). Three sub-tabs:

### 6.1 Articles

- Sortable + filterable table of `editorial_articles`. Columns: title · category · author · published_at · is_paid_placement (✓ chip if true) · view_count (rolling 30d) · "Open in git" link → opens `apps/web/content/editorial/articles/[file].md` on GitHub web editor.
- Filter chips: All · Editorial · Sponsored · Featured · Last 30 days
- "New article" button → opens GitHub web editor on a templated blank MD file pre-filled with the frontmatter scaffold

### 6.2 Sponsored slots

- Table of `sponsored_slot_bookings`. Columns: sponsor_name · slot_type · scheduled_publish_at · agreed_rate · payment_status (with badge) · published_article_slug (link if filled) · actions
- Two-admin approval gate (per 0023 § 9.1) on any sponsored slot with `agreed_rate_centavos >= 100_000_00` (₱100K+) — single-admin OK below that
- "New sponsored slot" button → modal with sponsor details + slot type + rate + scheduled publish + internal notes
- "Mark paid" action → flips payment_status to `paid`, fires receipt email via 0028 template `sponsored_slot_paid`

### 6.3 Affiliate revenue

- Read-only revenue table. Columns: merchant_slug · network_key · clicks (30d) · conversions (30d) · payout_amount (30d sum) · CTR · CR
- Sort by payout_amount desc by default
- Drill-in per merchant: monthly revenue chart + top-converting article slugs

---

## 7. Newsletter sponsorship (extends 0028)

Reuses 0028 transactional email infrastructure for editorial-newsletter sponsorship slots — a separate motion from the transactional templates already specced in 0028.

### 7.1 Newsletter list

- Subscribers opt in via the existing 0015 newsletter signup modal (already in production)
- Stored in `newsletter_subscribers` table (already specced in 0015) with `confirmed_at` + `unsubscribed_at` columns
- Send cadence: weekly digest of new editorial articles + 1 sponsored slot per send (single-sponsor per send, no list churn from over-monetization)
- RFC 8058 one-click unsubscribe (already specced in 0028)

### 7.2 Sponsored slot in newsletter

- Visually distinct block above the editorial digest, labelled "From our sponsors"
- Single sponsor per send. No banner-ad rotation.
- Sponsor copy: 80-char headline + 2-line body + 1 CTA button. Setnayan editorial reviews before send (same workflow as sponsored-article moderation).
- Ratecard managed via `sponsored_slot_bookings` with `slot_type = 'newsletter_sponsorship'`.

### 7.3 Tracking

- Click event in PostHog: `newsletter_sponsor_clicked` with `slot_booking_id` + `subscriber_event_hash` (one-way hash, no PII)
- Aggregate weekly report surfaces in the 0023 § 6.3 Affiliate revenue tab (separate sponsor-newsletter column)

---

## 8. Cross-iteration coordination

### 8.1 Boosted Ads guardrails (coordinates with 0039)

The AdSense placements specified in 0039 are not allowed on:
- Editorial article pages where `is_paid_placement = TRUE` (sponsor paid for the page; no display-ad bleed)
- Newsletter sponsored slots (sponsor paid for the slot)

The AdSense topic filter (set in 0039) excludes wedding/event categories on **vendor landing pages** so we never run competitor ads against a vendor's own profile. Editorial article pages (which are Setnayan-first-party content) DO carry AdSense per 0039's default policy.

### 8.2 Vendor opt-out for Boosted Ads (added to 0022)

When 0039 ships, 0022 Vendor Dashboard gets a new "Display ads on my profile" toggle (default OFF for verified vendors + Boosted Ads / Sponsored Boost vendors; default ON for unverified vendors). Toggle setting flows into the page-level `data-adsense="off"` attribute the 0039 ads-loader reads.

### 8.3 0034 payments & cart — sponsored-slot invoicing

Sponsored content slots and newsletter sponsorships are invoiced manually outside the in-app cart in V1.1 — they're B2B sales, not consumer orders. V1.2+ candidate: pull them into the `service_orders` schema as a B2B order type.

---

## 9. Acceptance tests

| # | Test | Pass criteria |
|---|---|---|
| 1 | Editorial article page renders the MD body | `/blog/[slug]` server-renders markdown from `apps/web/content/editorial/articles/[slug].md`. Cover image, byline, read-time stamp all visible. |
| 2 | Sponsored article shows sponsor badge + disclosure | When `is_paid_placement = TRUE`, sticky "Sponsored by X" badge top-right + first-line disclosure text both render unconditionally. Cannot be hidden by CSS injection. |
| 3 | Recommendation page top + bottom disclosure both render | Disclosure banner appears at the top AND bottom of every `/recommendations/[category]` page. Cannot be dismissed. |
| 4 | Affiliate link CTA fires PostHog event with no PII | Clicking a `data-affiliate="true"` link fires `affiliate_link_clicked` with merchant_slug + affiliate_link_id + source_page_type populated, AND no user_id / distinct_id / IP attached. |
| 5 | Affiliate link has correct `rel` attribute | Every affiliate-allowlisted outbound link has `rel="sponsored nofollow noopener"` per Google quality guidelines. |
| 6 | Sponsored articles do NOT carry AdSense | When `is_paid_placement = TRUE`, the page's `data-adsense` attribute is `off` so the 0039 ads-loader skips the slot. |
| 7 | Two-admin approval gates ₱100K+ sponsored slots | Creating a sponsored slot with `agreed_rate_centavos >= 100_000_00` blocks publish until a second admin approves (per 0023 § 9.1). |
| 8 | Vendor opt-out toggle suppresses AdSense on their profile | A vendor toggling "Display ads on my profile" → OFF removes AdSense from their `/vendors/[slug]` page on next request (cache busted on toggle). |
| 9 | Newsletter unsubscribe still RFC 8058 one-click compliant | The newsletter email's `List-Unsubscribe-Post` header still works for both editorial + sponsored sends. |
| 10 | Postback endpoint stores conversions idempotently | POSTing the same `(network_key, network_click_id)` pair twice creates exactly one row in `affiliate_conversions` (unique constraint enforces). |

---

## 10. Out of scope for V1.1

- Decap CMS or any web-based editor for non-engineers (V1.2+ candidate; PR-based flow is fine for V1.1)
- Video content / podcast surface (V1.5+ candidate)
- TL (Tagalog) versions of articles — schema supports `locale = 'tl'` but content production is EN-only in V1.1
- Auto-translation of articles (V2)
- Auto-generated recommendation pages from vendor performance data (V2 — editor-curated only in V1.1)
- A/B testing different recommendation orderings (V1.5+ via PostHog Experiments)
- Selling display inventory to brand DSPs (out of policy — only AdSense in 0039, no programmatic open exchange)
- Multi-sponsor rotation in a single newsletter send (single-sponsor lock to protect list integrity)

---

## 11. Engineering hand-off (deferred to engineering worktree)

- Schema migrations: `editorial_articles` + `recommendation_pages` + `affiliate_links` + `affiliate_conversions` + `sponsored_slot_bookings`
- Next.js routes: `/blog`, `/blog/[slug]`, `/recommendations`, `/recommendations/[category]`
- MD content build pipeline: scan `apps/web/content/editorial/`, validate frontmatter, upsert into `editorial_articles` + `recommendation_pages` at build time
- PostHog event: `affiliate_link_clicked` + `newsletter_sponsor_clicked`
- Postback endpoint: `POST /api/affiliates/postback?network=:network`
- 0023 admin console: Editorial tab + Articles / Sponsored slots / Affiliate revenue sub-tabs
- 0022 vendor dashboard: "Display ads on my profile" toggle (couples with 0039 ship)
- 0028 email: `sponsored_slot_paid` receipt template + newsletter weekly digest template + newsletter sponsor-slot block

---

**End of 0038 spec.**
