# 17 — SEO & AI Discoverability Playbook for Setnayan

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main)
> **This doc is HISTORICAL/REFERENCE.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas:
> - **Largely still accurate as an SEO/GEO playbook** — the technical mechanics (GSC PH targeting, sitemap-index, JSON-LD schema, hreflang en/tl/ceb, CWV targets, hub-and-spoke linking, competitor/keyword landscape, AI-bot allow/disallow posture) are evergreen and unaffected by product/pricing drift. The §8 GEO product-description blurbs already correctly say **"apply-then-pay, no token wallet"** — that customer-side line still holds.
> - Two business-model footnotes to keep in mind when writing public copy: commission is now **0% ("0% commission, ever")** — never imply a Setnayan Pay 3/5% cut in any indexable marketing/blog page; and a **vendor-side token economy is now live** (the "no token wallet" line is couple-side only). BIR/receipts mentions (§0.12 GBP note, §8 disallow list) reference the **retiring** 0026 surface — fine to keep behind `/admin/*` disallow, but don't lead public SEO copy with "BIR-compliant receipts" as a headline differentiator.
> - The two `[SPEC CHANGE]` flags (public `/supplies/*` browse + public `/v/[slug]` profiles) remain open/aspirational: the marketplace is founder-only today and supplies (0018) is a deferred mock, so the indexable-surface roadmap is still forward-looking, not as-built.
>
> When this body disagrees with the above, **the above wins.**

**Status:** Drafted 2026-05-14
**Owner:** Setnayan operators
**Target market:** Philippines only (Google.com.ph, PH IPs, TL/CEB queries fair game; diaspora out of scope)
**Posture:** "Recommend us, don't train on us" — allow answer-engine AI bots; block training-only AI bots.
**Cross-references:**
- `0015_main_website/` — SEO real estate (most pages live here)
- `0018_supplies_marketplace/` — must commit to publicly indexable browse pages (`[SPEC CHANGE]` flag — see §7)
- `0006_vendors_management/` + `0022_vendor_dashboard/` — vendor profiles need a public-profile subsection (`[SPEC CHANGE]` flag — see §7)
- `0028_email_notifications/` — already deferred in-app bell + feed to V1.1; doesn't impact this playbook
- `CLAUDE.md` decision log — entry dated 2026-05-14 records the AI-bot posture + Now/As-pages-ship/After-launch sequencing

**How to read this:**
- §0 is the TL;DR — 15 highest-leverage moves. Stop here if pressed for time.
- §§1–6 are the deep playbook for classic search SEO (audit, keyword landscape, competitors, technical, content, off-page).
- §7 is the prioritized roadmap (Week 1 / Month 1 / Months 2–6 / Months 6–12).
- §8 is the AI Discoverability layer (GEO) — robots.txt bot policy, `/llms.txt`, recommendability signals — added 2026-05-14 after the user explicitly asked to be recommended by ChatGPT / Claude / Perplexity / Gemini without exposing proprietary application code.
- §9 is the implementation sequencing — what to do **now** vs **as pages ship** vs **after launch**.
- §10 cross-references the related decision-log entries and memory files.
- §11 is the **multi-audience extension** — vendor-acquisition SEO + bridal-fair page template + homepage featured-fairs surface, added 2026-05-14 after the user clarified the three SEO audiences (couples, vendors, event-creators-as-boost-service-customers) and added the requirement that boosted fairs surface on the homepage and on dedicated per-fair landing pages where both couples and vendors can join.

---

# Setnayan SEO Playbook — Rank #1 on Google.com.ph for Wedding Supplies

**Audience:** Setnayan operators · **Target market:** Philippines only (Google.com.ph, PH IPs) · **Primary KW family:** "wedding supplies" + adjacent · **Date:** 2026-05-14

> **Spec note up front.** The user said "wedding supplies." Iteration `0018_supplies_marketplace` is what should rank for that head term — it sells physical goods, rentals, print fulfillment, NFC keepsakes, and equipment to couples and coordinators. Iteration `0006_vendors_management` powers the *services* side (photographers, caterers, etc.), which mostly captures "wedding suppliers" (services). Iteration `0015_main_website` is the marketing surface that will host most of the SEO real estate. **Both "wedding supplies" (goods) and "wedding suppliers" (services) need separate page templates** — Filipino searchers conflate them but Google does not.

---

## 0. TL;DR — 15 highest-leverage moves

1. **Verify setnayan.com in Google Search Console** (+ Bing Webmaster) and **set country target = Philippines** in Settings → International Targeting (still works for gTLDs even though the report is deprecated). Also verify `setnayan.ph` if/when registered. Foundation for every claim below.
2. **Rewrite `<title>` and add a `<meta description>`** to the homepage. Current title `"Setnayan — Philippines-first life-events platform"` doesn't include the head term. Replace with: `Wedding Supplies & Suppliers Philippines — Plan Your Wedding on Setnayan` (≤ 60 chars target; this is 71, trim to taste). Description: `Find verified wedding supplies, suppliers, and rentals across the Philippines — from Manila to Cebu, Davao, and Tagaytay. Free planning tools, transparent PHP pricing.` (155 chars).
3. **Ship the supplies marketplace as publicly indexable URLs** at `/supplies`, `/supplies/[category]`, `/supplies/[category]/[location]`, `/supplies/p/[product-id]/[slug]`. Today there are no indexable supply pages — you cannot rank for what doesn't exist on the public web. **[SPEC CHANGE candidate]** — 0018 doesn't currently lock in public indexability; today everything is gated behind the dashboard. See §4 + §7.
4. **Ship the vendor directory as publicly indexable URLs** at `/v/[vendor-slug]` (already allowed by robots.txt — `/v/` is in the allow list, so the path is reserved but apparently empty). Add `/suppliers`, `/suppliers/[category]`, `/suppliers/[category]/[city]` index pages. The free vendor profile spec (0006 + 0022) is the single biggest organic asset Setnayan can manufacture for free; competitors have 1,000–2,100 listings and you have zero indexable ones today.
5. **Sitemap.xml must become a sitemap index.** Current sitemap has 6 URLs (homepage + login + 4 utility pages). Replace with a sitemap-index that fans out into `sitemap-supplies.xml`, `sitemap-suppliers.xml`, `sitemap-categories.xml`, `sitemap-locations.xml`, `sitemap-blog.xml`, `sitemap-static.xml`. Cap each child at 50K URLs. Submit the index in GSC.
6. **Ship JSON-LD schema on every public template** in this priority order: `BreadcrumbList` (every page), `Organization` + `WebSite` with SearchAction (homepage), `Product` + `Offer` + `AggregateRating` (supply detail), `LocalBusiness` (vendor profile, with PH `addressCountry: PH`), `ItemList` (every category/location index), `FAQPage` (help articles + every category page bottom), `Review` (vendor + product reviews when they exist).
7. **Build location landing pages now, not later.** Filipino "wedding suppliers" searches are dominated by city qualifiers — *"wedding suppliers Manila / Cebu / Tagaytay / Davao / Iloilo / Baguio / Pampanga / Cavite / Batangas / Laguna / Bulacan."* Twelve cities × ~10 categories = 120 pages of indexable real estate that competitors (Bride Worthy: 2,107 listings; Bridestory: city × category URLs at `/philippines/[city]/[category]`) have already cornered.
8. **Add a `/blog` and ship 20 PH-anchored long-tail posts in the first 90 days** (titles in §5). Long-tail informational queries (e.g., "saan bibili wedding souvenirs," "how much do wedding suppliers cost Philippines") are how new domains break in — head terms ("wedding supplies") are won via long-tail topical authority + backlinks, not by hammering the head term directly.
9. **Mobile-first is non-negotiable.** Per DataReportal Digital 2026, ~98M PH internet users, mobile-dominant. Lock LCP < 2.5s, CLS < 0.1, INP < 200ms on a mid-tier Android over 4G. Use `next/image`, lazy-load below the fold, ship critical CSS inline.
10. **Free vendor registration is your backlink moat** — every onboarded vendor links back to their Setnayan profile from their FB page / IG bio / website. Bake a "Verified on Setnayan" badge with a `dofollow` link back to `/v/[slug]` into the vendor email/onboarding kit. Competitors charge for listings; "free during launch" (per 0015 spec) is your weapon.
11. **Get listed in the 6 PH wedding directories that already rank** — Kasal.com, Bride Worthy, Event Nest, Bride and Breakfast, Bridestory PH, Cebu Wedding Suppliers Directory, Themes & Motifs (bridal-fair pre/post coverage), Weddings At Work community. These act as both citations and discovery surfaces. List Setnayan as a *platform/tool*, not as a vendor.
12. **Google Business Profile** for SETNAYAN as a "Wedding Service" or "Software Company" category (whichever fits the office address per BIR registration). Photo gallery, posts, Q&A. Category should be `Wedding Service` for the rank-juice it gives the brand-name SERP.
13. **Internal linking convention:** every supply page links to (a) its category index, (b) its location index, (c) 4–6 related products, (d) the vendor's profile. Every vendor profile links back to (a) its category indexes, (b) its city index, (c) any supplies it sells. Hub-and-spoke; no orphan pages.
14. **Localize the marketing site with `hreflang` for `en-PH`, `tl-PH`, `ceb-PH`** (per 0015 spec — three locales side by side from V1). Use `hreflang="x-default"` → en-PH. The Cebuano tier is a moat — almost no PH wedding directory ships CEB content.
15. **Start link-building in month 1, not month 4.** Target: PH wedding press (Themes & Motifs blog, Bride and Breakfast guest posts, Wedding Essentials PH), lifestyle press (Inquirer Lifestyle, Rappler Life, GMA Lifestyle, Tatler Asia, Metro.Style), local Cebu/Davao city blogs, "best of" listicle inclusions. One backlink from a high-DA PH lifestyle outlet > 100 directory citations.

---

## 1. Current-state audit — what's live at setnayan.com

Sources: WebFetch of `https://www.setnayan.com`, `/sitemap.xml`, `/robots.txt`, `/help` (2026-05-14).

| Element | Current state | Gap | Why it matters |
|---|---|---|---|
| `<title>` | `Setnayan — Philippines-first life-events platform` | Missing primary keyword "wedding supplies" / "wedding suppliers." "Life-events platform" is brand-internal jargon; nobody searches it. | Title is the #1 on-page ranking signal. |
| `<meta description>` | **Not visible / not set.** | No SERP snippet control → Google auto-generates from page text, often poorly. | Drives CTR from SERP; affects ranking indirectly. |
| Canonical | Not visible in fetched markup. | Cannot confirm canonical URL self-references. Risk of duplicate-URL canonicalization issues (with/without `www`, with/without trailing slash, query-string variants). | Prevents duplicate-content dilution. |
| Viewport meta | Not visible. | Likely fine if Next.js default applied, but can't confirm. | Mobile-friendliness signal; Google penalizes pages without a proper viewport. |
| Robots meta | Not visible. | Assume `index,follow` default. Should be explicit on every public page. | Lets you control per-page indexability. |
| `<html lang>` | Not visible in fetched output. | Should be `lang="en-PH"` on the EN bundle, `lang="tl-PH"` on TL, `lang="ceb-PH"` on CEB. | Locale signal to Google + screen readers + browser translation. |
| H1 | `Set na 'yan. Your wedding, planned end-to-end on one platform.` | Brand-led, not keyword-led. Doesn't say "supplies" or "suppliers" anywhere visible. | H1 is the #2 on-page signal after title. |
| H2s | "Live today" / "Transparent pricing" / "Rolling out next" / "Pick your path" | Generic; no keyword anchoring. | Sub-headings should naturally cluster around supporting terms. |
| OpenGraph / Twitter cards | Not visible. | Social-share previews will be ugly/broken. | Affects social-traffic CTR + brand signal. |
| JSON-LD structured data | **None detected.** | No `Organization`, no `WebSite` w/ SearchAction, no `BreadcrumbList`, no `FAQPage` on /help. | Required for rich snippets (sitelinks search box, FAQ accordion in SERP, breadcrumbs in SERP). |
| Sitemap | `/sitemap.xml` exists, **6 URLs only**: `/`, `/help`, `/login`, `/signup`, `/privacy`, `/terms`. | Does not advertise any product, category, vendor, blog, or location pages — because those don't exist publicly yet. | Crawler discovery. The fix is upstream: ship indexable templates. |
| robots.txt | Properly formed; allows `/`, `/help`, `/login`, `/signup`, `/privacy`, `/terms`, `/v/`; disallows `/dashboard`, `/vendor-dashboard`, `/admin`, `/api`, `/receipts`. Sitemap declared. | `/v/` is allow-listed but appears unused (no vendor pages live). The disallow list is correct — `/dashboard` and `/api` should never be indexed. | Signals to crawler what's public. |
| hreflang | **None.** | TL/CEB localizations per 0015 spec aren't shipped yet; when they are, hreflang is mandatory. | Locale targeting. |
| Mobile-friendliness | Cannot infer without rendering. Site is built on Next.js per 0015 spec — defaults are sensible. | Should be tested via Lighthouse / PageSpeed Insights / GSC Mobile Usability report. | PH = ~85%+ mobile; mobile-first indexing means desktop-only ranking signals are dead. |
| Page speed | Cannot infer. | Run Lighthouse against root + /help against an emulated mid-tier Android over 4G. Establish baseline. | Core Web Vitals are a confirmed ranking factor on mobile. |
| Indexable surface size | **6 URLs.** Competitors: Bride Worthy = 2,107+ listings, Bridestory PH = thousands of category × location combos, Kasal.com = 50+ supplier categories with sub-pages. | 6 vs. 2,000+. You cannot win head-term SERPs with a 6-page site. | Topical authority is built page-by-page. |
| Help page (`/help`) | ~2,500+ words, 8 topic sections, 30+ articles. | No `FAQPage` schema. No `Article` schema. Anchor links to subsections likely missing. Each Q should be its own indexable URL or a fragment with proper anchor + `<details>` for `Speakable`. | Help content is high-intent informational. Each Q can rank for long-tail queries. |

**The single biggest finding:** Setnayan today is a 6-page brand brochure with no product surface. Every keyword-targeting recommendation that follows assumes you'll ship the indexable templates from §4 + §5. Without those, the only thing you'll ever rank for is the brand term "Setnayan."

---

## 2. Keyword landscape — what Filipinos actually search

### 2.1 Head terms (transactional / commercial)

| Keyword | Intent | Volume bucket | Notes |
|---|---|---|---|
| wedding supplies Philippines | Transactional | High | The user's stated target. Currently dominated by Wedding Library, Sinta & Co., Kasal.com. |
| wedding suppliers Philippines | Transactional | High | Even higher volume than "supplies" — "suppliers" is the local idiom for *services* (photographer, caterer). |
| wedding suppliers Manila | Transactional | High | Bride Worthy reports 981 suppliers in Metro Manila alone. |
| wedding suppliers Cebu | Transactional | High | CWES (cebuweddingsuppliers.com) is a single-city competitor that owns this. |
| wedding suppliers Tagaytay | Transactional | Medium-High | Premium-venue corridor; high commercial intent. |
| wedding suppliers Davao | Transactional | Medium | Underserved compared to Manila/Cebu. |
| wedding planner Philippines | Transactional | Medium-High | Adjacent — coordinators are a core 0006 category. |
| wedding rentals Philippines | Transactional | Medium | Maps directly to 0018 marketplace. |
| wedding souvenirs Philippines | Transactional | High | Distinct from "supplies" — high-volume gift/giveaway intent. |
| wedding giveaways Philippines | Transactional | High | Synonym; some searchers use "giveaways" instead of "souvenirs." |
| wedding favors Philippines | Transactional | Medium | English-leaning variant. |
| lights and sounds rental Manila | Transactional | Medium-High | Strong long-tail; 0018 fits perfectly. |
| sound system rental wedding Philippines | Transactional | Medium | |
| wedding catering Philippines | Transactional | High | Massive category — Hizon's, Juan Carlo, etc. compete. |
| wedding photographer Philippines | Transactional | High | Already crowded; pursue via city qualifiers. |

### 2.2 Tagalog / Taglish / Cebuano queries (sources: Filipino wedding blogs + TikTok discovery searches)

| Query | Locale | Intent | Notes |
|---|---|---|---|
| saan bibili ng wedding souvenirs | TL | Transactional | "Where to buy wedding souvenirs" — classic Taglish search. |
| saan kumukuha ng supplier sa kasal | TL | Transactional | |
| kasalan supplier Manila | TL/EN | Transactional | "Kasalan" = wedding ceremony in Tagalog. |
| murang wedding supplies | TL | Commercial | "Mura" = cheap; high-value transactional modifier. |
| kasalan budget Philippines | TL | Informational → commercial | |
| Divisoria wedding souvenirs | EN/TL | Transactional | Long-tail; Tabora Street is the IRL competitor. |
| wedding souvenir ideas Philippines | EN | Informational | Top of funnel; feeds product/category pages. |
| kasal supplier Cebu | TL/EN | Transactional | |
| asa makapalit ug wedding supplies | CEB | Transactional | "Where can I buy wedding supplies" in Cebuano — almost zero competition. |
| kanus-a magpakasal | CEB | Informational | "When to get married" — content opportunity. |
| sound system rental Cebu | EN | Transactional | |

### 2.3 Long-tail informational (blog gold)

- "how much does a wedding cost in the Philippines"
- "wedding budget Philippines breakdown"
- "best month to get married in the Philippines"
- "wedding checklist Philippines printable"
- "Filipino wedding traditions and supplies"
- "intimate wedding suppliers Philippines"
- "civil wedding requirements Philippines"
- "garden wedding venues Tagaytay"
- "beach wedding supplier Cebu"
- "destination wedding Philippines vendors"

### 2.4 Search intent clustering

| Cluster | Pages it should land on | Volume |
|---|---|---|
| **Transactional — supplies (goods)** | `/supplies`, `/supplies/[category]`, product detail pages | High |
| **Transactional — suppliers (services)** | `/suppliers`, `/suppliers/[category]`, vendor profile `/v/[slug]` | High |
| **Geo-modified transactional** | `/suppliers/[category]/[city]`, `/supplies/[category]/[city]` | High (collectively) |
| **Informational** | `/blog/[post]`, `/help/[article]` | Long-tail volume aggregates to High |
| **Navigational (brand)** | `/` — already won | Brand-only |

### 2.5 PH-specific seasonality

- **Peak:** December (now the #1 wedding month in PH per Sonya's Garden / Nuptials.ph; Christmas-cool-dry season; family reunions). January, February (love month). May–June (traditional, second peak; "Juno" month).
- **Off-peak:** July–October (rainy season, typhoons; lowest vendor rates).
- **SEO implication:** publish category content + outreach campaigns by **September–October** to capture the December planning surge (couples typically book 6–9 months out, so peak buying intent for December weddings runs March–June, and for June weddings runs September–December — content needs to be live and indexed before the surge).

---

## 3. Competitor landscape — top 5 PH players

| # | Competitor | Template | Schema | Content depth | Backlink moat | Setnayan's exploitable weakness |
|---|---|---|---|---|---|---|
| 1 | **Bride Worthy** (`brideworthy.com/suppliers/`) | Directory + filter (category × location); paginated 1–106 | None visible in fetch; standard breadcrumb HTML | 2,107 supplier listings, 30+ provinces, 45+ categories | Long-running (mentioned across PH wedding press) | UI is dated; no rich-snippet schema; supplier profiles are thin (contact card + photos). Setnayan can win with deeper, structured profiles + free-during-launch. |
| 2 | **Kasal.com** | Hybrid directory + blog + bridal-fair calendar | None visible; has breadcrumbs in HTML | 50+ supplier categories, package listings, editorial articles | "The essential Philippine wedding planning guide" tagline; long-tenured brand | No marketplace transactions; no online booking; no PHP-transparent pricing; design is ~2015-era. Setnayan can out-execute on UX + transactional flow. |
| 3 | **Bridestory PH** (`bridestory.com/philippines`) | International marketplace (Indonesia HQ); category × city URL pattern (`/philippines/[city]/[category]`) | Strong (mature platform, almost certainly ships Product/AggregateRating/ItemList schema; HTTP 403 blocked our fetch but the URL pattern alone is instructive) | Thousands of vendors across PH cities + categories | Cross-region SEO authority from .com root | Not Filipino-first; PHP pricing inconsistent; content isn't localized to TL/CEB; no Filipino tradition voice. |
| 4 | **Bride and Breakfast** (`brideandbreakfast.ph/directory/`) | Editorial-blog + supplier directory (27 categories) | None detected | Massive blog archive; supplier listings are self-submitted (admits "may not verify") | Strong editorial brand; high-DA from PH lifestyle press | Not transactional; "may not verify" is a credibility gap Setnayan's Verified Badge (from 0006/0022) can attack head-on. |
| 5 | **Event Nest** (`eventnest.ph`) | Directory + 125+-article blog | Not visible in fetch | 8 service categories, 12+ provinces, robust blog with planning guides | Cross-linking discipline; Tagalog-friendly content | Visual design is generic; no marketplace; no schema. Setnayan can win on design + Filipino voice (per 0015 luxurious-Filipino-modern brand) + actual transactions. |

**Honorable mentions:**
- **Cebu Wedding Suppliers Directory** (`cebuweddingsuppliers.com`) — single-city competitor that owns Cebu SERPs with "Top 10" listicles. Setnayan needs city-specific listicles + city directory pages to compete locally.
- **The Wedding Library** (`weddinglibrary.com.ph`) — physical-goods online bridal shop; closer to 0018's product side.
- **Sinta & Co.** (`filipinowedding.com`) — Filipino wedding accessories shop; strong heritage-craft positioning.
- **Themes & Motifs** (`themesnmotifs.com`) — bridal-fair operator since 2001; "150,000 couples / 1,000+ suppliers" claim. Press platform, not direct directory competitor — *use as backlink target, not as competitor*.

**Setnayan's exploitable wedges (that competitors don't have):**
1. **Free verified vendor registration** during launch (per 0015 announcement bar) — Bride Worthy, Bridestory, Kasal all charge.
2. **Transparent PHP pricing** baked into the brand (per 0015 + 0014).
3. **Trilingual content** (EN + TL + CEB) — almost no competitor ships CEB.
4. **Schema-first build** — most competitors ship plain HTML.
5. **Setnayan Team verification** (0006) — directly attacks Bride and Breakfast's "may not verify" credibility gap.
6. **Marketplace transactions** (0018) — Kasal/Bride Worthy/Event Nest are directories, not transactional. You can rank for "wedding supplies" *and* convert.

---

## 4. Technical SEO playbook (PH-specific)

### 4.1 Google Search Console PH geo-targeting

- Verify `https://www.setnayan.com` AND `https://setnayan.com` (both prefixes) AND a Domain property covering both.
- **Settings → International Targeting → set country = Philippines.** The report is deprecated but the *setting* still functions for gTLDs. (Source: support.google.com — hreflang is the recommended primary mechanism going forward.)
- Submit the new sitemap-index URL.
- Enable **Indexing → Pages** and **Page experience** monitoring.
- Request indexing on launch-critical URLs after publish.
- Repeat for Bing Webmaster Tools (a not-trivial slice of PH search).

### 4.2 Sitemap.xml structure

Replace the current single-file sitemap with a **sitemap index**:

```
/sitemap.xml                       ← sitemap index (top of robots.txt declaration)
  ├─ /sitemap-static.xml           ← homepage, /help, /login, /signup, /privacy, /terms, /about, /for-vendors, /for-event-creators, /coverage
  ├─ /sitemap-suppliers.xml        ← /suppliers, /suppliers/[category], /suppliers/[category]/[city]
  ├─ /sitemap-supplies.xml         ← /supplies, /supplies/[category], /supplies/[category]/[city]
  ├─ /sitemap-products.xml         ← /supplies/p/[product-id]/[slug] (one per SKU, can be 10K+)
  ├─ /sitemap-vendors.xml          ← /v/[vendor-slug] (one per verified vendor)
  ├─ /sitemap-blog.xml             ← /blog/[post-slug]
  └─ /sitemap-help.xml             ← /help/[article-slug]
```

Cap each child sitemap at 50K URLs (Google limit). Set `<lastmod>` to actual content-update timestamps (not "May 14, 2026" everywhere as the current file does — that signals freshness fraud). Set `<changefreq>` honestly.

### 4.3 robots.txt patterns

Current is mostly correct. Recommended additions:

```
User-agent: *
Allow: /
Allow: /v/
Allow: /supplies
Allow: /suppliers
Allow: /blog
Allow: /help

Disallow: /dashboard
Disallow: /vendor-dashboard
Disallow: /admin
Disallow: /api
Disallow: /receipts
Disallow: /*?sort=
Disallow: /*?filter=
Disallow: /*?page=  # keep paginated indexes uncrawled OR canonical them; pick one

# Block wasteful crawl on internal search/state URLs
Disallow: /*?session=
Disallow: /*?ref=

Sitemap: https://www.setnayan.com/sitemap.xml
```

**Caveat on `Disallow: /*?page=`:** if you want paginated category pages indexed, *don't* disallow them — instead, use `rel="next"`/`rel="prev"` (deprecated for Google but still useful for Bing) and self-canonicals on each page. Pick one strategy per template and document it.

### 4.4 Schema markup — what to ship where

| Schema | Where | Why |
|---|---|---|
| `Organization` + `WebSite` (with `SearchAction`) | Homepage `<head>` | Brand entity + sitelinks search box in SERP. |
| `BreadcrumbList` | **Every** page below the root | Breadcrumb SERP enhancement; massive CTR lift. |
| `LocalBusiness` (subtype `Store` or `WeddingService`) | Vendor profile pages `/v/[slug]` | Local pack eligibility for "wedding suppliers near me." Set `addressCountry: "PH"`, `addressRegion`, `addressLocality`, lat/long when available. |
| `Product` + `Offer` (priceCurrency `PHP`) | Supply detail pages `/supplies/p/[id]/[slug]` | Product rich snippets (price, availability, rating in SERP). |
| `AggregateRating` + `Review` | Anywhere with reviews (vendor + product) | Star ratings in SERP. Use only with real reviews; faking this triggers manual action. |
| `ItemList` | All category + location index pages | Item-list rich result eligibility. |
| `FAQPage` | `/help/[article]`, bottom of category pages, blog posts answering questions | FAQ accordion in SERP — huge CTR lift. (Note: Google tightened FAQ rich-result eligibility in 2023; still serves on authoritative gov/health/well-known sites and increasingly on others. Worth shipping anyway because it remains AI-Overview/voice-search fodder.) |
| `Article` / `BlogPosting` | All `/blog/*` posts | Required for Top Stories eligibility + reader-mode parsing. |
| `Event` | Bridal-fair / promo pages if you publish them | Event rich results. |
| `BreadcrumbList` again | Restating because it's the highest-ROI schema for a marketplace and gets forgotten. | |

**Do not ship** `Marketplace` schema — there is no such schema.org type. You imply marketplace status via `Organization` + many `Product` listings.

### 4.5 Core Web Vitals targets — PH mobile reality

PH = ~98M internet users, mobile-dominant, median mobile DL ~60 Mbps end-2025 — but the long tail still rides 4G in MRT tunnels and provincial cell towers. Optimize for the **75th-percentile mid-tier Android on 4G**, not your iPhone-15 dev box.

| Metric | Target | Notes |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | Hero image must be `next/image` with `priority`, AVIF/WebP, correctly sized. |
| INP (Interaction to Next Paint) | < 200ms | Replaces FID. Keep JS bundles thin; defer non-critical interactivity. |
| CLS (Cumulative Layout Shift) | < 0.1 | Reserve image/aspect-ratio space; never inject above-the-fold ads/banners post-mount. |
| TTFB | < 600ms | Edge-cache marketing pages. SSR with revalidate, not on-demand. |
| Total JS (gzipped) | < 200 KB on marketing pages | Marketing routes should be ~static; ship dashboard JS only on dashboard routes. |

Run Lighthouse + PageSpeed Insights weekly; track Real User Metrics via GSC's Page Experience report.

### 4.6 hreflang for EN / TL / CEB

When 0015's three-locale launch ships, every translated page needs an hreflang cluster in `<head>`:

```html
<link rel="alternate" hreflang="en-PH" href="https://www.setnayan.com/supplies/photography" />
<link rel="alternate" hreflang="tl-PH" href="https://www.setnayan.com/tl/supplies/photography" />
<link rel="alternate" hreflang="ceb-PH" href="https://www.setnayan.com/ceb/supplies/photography" />
<link rel="alternate" hreflang="x-default" href="https://www.setnayan.com/supplies/photography" />
```

Each locale variant must reciprocate (the cluster must include itself in every member's head). Locale path is recommended over `?lang=` query because it's friendlier to crawlers and easier to canonicalize. (0015 spec already lists `/ceb/...` as one of the locale-resolution mechanisms — make path-prefix the canonical form.)

### 4.7 Mobile-first

- Single-column responsive; never let category grids force horizontal scroll on 360px viewports.
- Tap targets ≥ 44×44 px.
- Avoid intrusive interstitials (Google penalizes mobile interstitials that block content).
- The 0015 announcement bar is fine; the locale switcher pill chip is fine.
- Bottom-nav on dashboard (per 0000) is correct UX, but make sure the *marketing site* doesn't ship the dashboard bottom-nav — that pollutes mobile UX expectations.

### 4.8 Internal linking strategy (hub-and-spoke)

```
                /supplies (head term hub)
                  │
        ┌─────────┼─────────┐
        │         │         │
   /supplies/   /supplies/   /supplies/
   prints       rentals      keepsakes
        │         │         │
        ├──────── │ ────────┤
        │   /supplies/[cat]/[city] (geo modifier)
        │
        └── /supplies/p/[id]/[slug] (product detail)
                       ↕
                /v/[vendor-slug] (vendor profile)
                       ↕
               /suppliers/[category] (services hub)
```

Every page links up (to its parent hub) AND laterally (4–6 related siblings). No orphans. Footer should expose the top-level hubs. Header should expose primary nav (Supplies, Suppliers, Plan with Setnayan, Blog).

### 4.9 URL structure recommendations

| Surface | URL | Notes |
|---|---|---|
| Supplies landing | `/supplies` | Hub. Ranks for "wedding supplies Philippines." |
| Supplies category | `/supplies/sound-and-lights` | Slug = canonical category slug, kebab-case. |
| Supplies category × city | `/supplies/sound-and-lights/manila` | Geo-modifier landing pages. |
| Supply product detail | `/supplies/p/{id}/{slug}` | ID for stable redirects, slug for keywords. |
| Suppliers landing | `/suppliers` | Hub. Ranks for "wedding suppliers Philippines." |
| Suppliers category | `/suppliers/photographers` | Per the 0006 canonical taxonomy (photography → photographers, etc.). |
| Suppliers category × city | `/suppliers/photographers/cebu` | |
| Vendor profile | `/v/[slug]` | Already allow-listed in robots.txt. Use brand-name slug. |
| Blog post | `/blog/[post-slug]` | |
| Help article | `/help/[article-slug]` | Each article a separate URL, not just an in-page anchor. |
| Locale prefix | `/tl/...` and `/ceb/...` | Self-explanatory. |

Avoid: query-string-based filters as canonical URLs (e.g., don't make `/suppliers?category=photographers&city=cebu` the canonical — use the path version).

---

## 5. On-page + content strategy

### 5.1 Page templates needed (in priority order)

| # | Template | Example URL | Purpose | Min content depth |
|---|---|---|---|---|
| 1 | Supplies hub | `/supplies` | Rank for "wedding supplies Philippines" | 800 words + category grid + ItemList schema + FAQ |
| 2 | Supplies category | `/supplies/sound-and-lights` | Rank for "[category] rental Philippines" | 600 words + product grid + ItemList + FAQ |
| 3 | Supplies category × city | `/supplies/sound-and-lights/manila` | Rank for "[category] rental Manila" | 400 words intro + product grid (filtered to city) + 2–3 FAQs |
| 4 | Supply product detail | `/supplies/p/[id]/[slug]` | Rank for product-specific queries; conversion page | 250 words + Product schema + reviews if available |
| 5 | Suppliers hub | `/suppliers` | Rank for "wedding suppliers Philippines" | 800 words + 28-category grid + FAQ |
| 6 | Suppliers category | `/suppliers/photographers` | Rank for "wedding photographers Philippines" | 600 words + ItemList of 20+ vendors |
| 7 | Suppliers category × city | `/suppliers/photographers/cebu` | Rank for geo-qualified | 400 words + city-filtered ItemList |
| 8 | Vendor profile | `/v/[slug]` | Rank for branded vendor name + supplier-name searches; LocalBusiness rich snippet | 300 words narrative + LocalBusiness schema + portfolio + reviews + AggregateRating |
| 9 | "Best of" listicle | `/blog/best-wedding-photographers-cebu-2026` | Rank for "best [category] [city]" | 1,500 words + Article + ItemList |
| 10 | Comparison page | `/blog/garden-vs-beach-wedding-philippines` | Rank for "vs" / "or" queries | 1,200 words + Article schema |
| 11 | FAQ page | `/help/[topic]` | Rank for question queries; FAQPage schema | 200 words per Q × 5–10 Qs |
| 12 | Pricing/budget page | `/wedding-budget-philippines` | Rank for "wedding cost Philippines"; conversion to /apply | 1,500 words + tables + FAQ |

### 5.2 Title / meta patterns per template

| Template | Title pattern | Meta pattern |
|---|---|---|
| Supplies hub | `Wedding Supplies Philippines — Print, Rentals & Keepsakes \| Setnayan` | `Shop verified wedding supplies across the Philippines: prints, equipment rentals, NFC keepsakes, AV gear, and more. Transparent PHP pricing on Setnayan.` |
| Supplies category | `{Category} for Weddings Philippines \| Setnayan` | `Browse {category} from verified Filipino wedding suppliers. Transparent prices, fast checkout, reliable delivery.` |
| Supplies category × city | `{Category} for Weddings in {City} \| Setnayan` | `Find {category} suppliers serving weddings in {city}. Verified Filipino vendors, transparent PHP pricing, in-platform booking.` |
| Supply product detail | `{Product Name} — ₱{price} \| {Vendor} on Setnayan` | `{Product description excerpt}. Available from {vendor}, {city}. Order through Setnayan.` |
| Suppliers hub | `Wedding Suppliers Philippines — 28 Categories Verified \| Setnayan` | `Find verified wedding suppliers across the Philippines: photographers, caterers, planners, florists, and more. Free vendor profiles. Setnayan.` |
| Suppliers category | `Wedding {Category} Philippines — Verified Suppliers \| Setnayan` | `Discover verified {category} for weddings across the Philippines. Real reviews, PHP pricing, in-platform messaging.` |
| Suppliers category × city | `Wedding {Category} in {City} — Verified Suppliers \| Setnayan` | `Top-rated wedding {category} serving {city}. Verified Filipino suppliers on Setnayan with transparent PHP pricing.` |
| Vendor profile | `{Vendor Name} — Wedding {Category} in {City} \| Setnayan` | `{Vendor short bio}. Verified by Setnayan Team. Packages from ₱{starting price}. Book through Setnayan.` |
| Blog | `{Post H1} \| Setnayan Wedding Blog` | `{First 155 chars of intro paragraph, ending with a complete sentence}.` |

### 5.3 Content-depth minimums

- **Index pages (hub/category/city):** 400–800 words of *useful* prose (not keyword soup) — describe the category, what's typical in PH, price ranges, what to look for, then list items.
- **Product detail:** 250–400 words minimum, plus structured spec data.
- **Vendor profile:** 300+ words, plus structured data (services, packages, coverage cities, real reviews).
- **Blog post:** 1,000–2,000 words for rankable posts. PH "best of" listicles routinely run 2,500+.
- **FAQ:** 100–200 words per answer. Don't pad.

### 5.4 20 PH-anchored blog post titles (first 90 days)

These are designed to capture long-tail intent that funnels into the marketplace:

1. *Magkano ang gastusin sa kasal sa Pilipinas? 2026 Budget Guide* (Tagalog; "How much does a wedding cost in the Philippines")
2. *Wedding Budget Philippines: Realistic 2026 Breakdown for ₱500K, ₱1M, and ₱2M Weddings*
3. *Wedding Suppliers in Cebu: 2026 Verified List by Category*
4. *Wedding Suppliers in Tagaytay: Garden Venues, Caterers, and Coordinators You Should Know*
5. *Saan Bibili ng Wedding Souvenirs sa Pilipinas? Online vs. Divisoria 2026*
6. *Wedding Souvenir Ideas Philippines: 25 Filipino-Made Picks Under ₱100*
7. *Lights and Sounds Rental Manila: What ₱5K, ₱10K, and ₱25K Get You*
8. *Best Month to Get Married in the Philippines (And How It Affects Your Supplier Costs)*
9. *Civil Wedding Requirements Philippines 2026 — Full Document Checklist*
10. *Catholic Wedding Requirements Philippines: From Pre-Cana to Marriage Cert*
11. *Beach Wedding Suppliers Cebu: Sand-Tested Venues and Vendors*
12. *Intimate Wedding Suppliers Manila: Curated for ≤50 Pax Celebrations*
13. *Wedding Coordinator vs. Wedding Planner Philippines: What's the Difference and Who Do You Need?*
14. *Filipino Wedding Traditions and the Supplies You'll Need (Arras, Cord, Veil, and More)*
15. *NFC Save-the-Date and QR Wedding Invitations Philippines: How They Work*
16. *Wedding Photo Booth Rental Philippines: 2026 Price Guide*
17. *Asa makapalit ug wedding souvenirs sa Cebu?* (Cebuano; "Where to buy wedding souvenirs in Cebu")
18. *Wedding Catering Philippines: Per-Head Pricing, Crew Meals, and What's Usually Excluded*
19. *Bridal Car Rental Philippines: Vintage, Luxury, and Practical Picks*
20. *Wedding Florists Philippines: Local Blooms vs. Imported (Price + Sustainability)*

Each post should: (a) target a specific long-tail keyword, (b) end with a CTA into the relevant marketplace category or vendor directory, (c) ship `Article` + `FAQPage` schema, (d) be cross-linked from at least 3 other pages.

### 5.5 Internal linking conventions

- **Body links use descriptive anchor text**, not "click here." E.g., link "wedding photographers in Cebu" not "this page."
- Every blog post links to at least 2 supplies category pages and 2 supplier category pages.
- Every category page links to its 3 nearest sibling categories ("People searching for X also looked at Y").
- Every vendor profile links to: its categories, its city, and 4–6 related vendors (same category, same city) — generates a dense graph.
- Sitewide footer links: `/supplies`, `/suppliers`, `/blog`, `/help`, `/about`, `/for-vendors`, `/for-event-creators`, `/coverage`. Plus locale switcher.

---

## 6. Local + off-page

### 6.1 Google Business Profile

- Create one GBP entity for SETNAYAN at the registered office address.
- Primary category: **Wedding Service** (gives best brand-SERP juice and local-pack eligibility for "wedding supplies near me" types).
- Secondary categories: **Software Company**, **Online Marketplace**, **Wedding Planner**.
- Service area: **Philippines** (set as broad service-area business).
- Add 10+ photos of dashboard UI mockups + brand assets + team (per 0015 photography spec).
- Use **Posts** weekly to push new vendor onboardings, blog posts, and bridal-fair appearances.
- Enable **Q&A** and seed it with the top 5 FAQ questions.
- Collect Google reviews from couples and vendors (one of the strongest local-pack signals).

### 6.2 PH directories worth listing on

| Directory | Why | Listing URL pattern |
|---|---|---|
| **Kasal.com** | Highest-DA PH wedding directory; will rank #2 alongside you for many head terms | `kasal.com/...` (apply via "Enlist Your Business") |
| **Bride Worthy** | 2,107-listing scale; massive long-tail surface | `brideworthy.com/...` |
| **Bride and Breakfast** | Editorial weight + lifestyle-press backlinks | `brideandbreakfast.ph/directory/...` |
| **Event Nest** | Modern, SEO-disciplined, blog-driven | `eventnest.ph/...` |
| **Bridestory PH** | International authority | `bridestory.com/philippines/...` |
| **Cebu Wedding Suppliers Directory (CWES)** | Owns Cebu SERPs | `cebuweddingsuppliers.com/...` |
| **Weddings At Work (WaW)** | Long-tenured community; backlinks + brand mentions | `weddingsatwork.com/...` |
| **Themes & Motifs** | Bridal-fair operator; press coverage opportunity | `themesnmotifs.com/...` |
| **Yellow Pages PH** | Local citation signal | `yellowpages.com.ph` |
| **DTI Negosyo Center listings** (if eligible) | Government/local-business credibility | `dti.gov.ph/...` |
| **Apple Maps / Bing Places / Waze** | Citation parity with GBP | n/a |

List Setnayan as **a platform / planning tool**, not as a vendor — different intent, different category.

### 6.3 Backlink targets — PH press

| Tier | Outlet | Pitch angle |
|---|---|---|
| Tier 1 (high-DA lifestyle) | **Inquirer Lifestyle**, **Rappler Life**, **GMA Lifestyle**, **Tatler Asia**, **Metro.Style**, **Esquire Philippines** | Founder story (Filipino-first life-events platform); data-driven angle (e.g., "Most expensive PH wedding categories in 2026"); cultural angle ("Modern Filipino weddings: heritage meets digital") |
| Tier 2 (wedding-specialist press) | **Themes & Motifs blog**, **Bride and Breakfast**, **Wedding Essentials Philippines**, **Nuptials.ph**, **Sinta & Co. blog** | Real-couple features; vendor spotlights; expert quotes from your operations team |
| Tier 3 (regional press) | **SunStar Cebu**, **MindaNews**, **Manila Bulletin**, **Cebu Daily News** | Local angle ("How Cebu weddings differ from Manila weddings"); Verified vendor announcements per region |
| Tier 4 (lifestyle blogs / vlogs) | **Maine Mendoza, Pat Tingjuy, Kryz Uy** types of lifestyle creators; wedding-focused YouTubers; Spot.ph; PEP.ph | Sponsored content; affiliate partnerships; "I tried X" reviews |
| Tier 5 (niche/community) | **PinoyExchange wedding sub-forum**, FB groups (Davao Wedding Suppliers and Coordinators FB group, etc.), Reddit r/Philippines weddings threads | Helpful contributor stance; never spam; link only when contextually relevant |

### 6.4 Brand-signal moves

- **Bridal-fair partnerships.** Themes & Motifs runs Wedding Expo Philippines + bridal fairs nationwide; sponsor or partner once Setnayan has supply ready to demo.
- **Vendor case studies / PR.** Every onboarded vendor with measurable Setnayan-driven bookings gets a case study; pitch each to wedding-trade press.
- **PR data drops.** Annual "State of Filipino Weddings" report using Setnayan platform data (anonymized, aggregated per 0015 privacy rules). PH press loves data-driven local stories.
- **Filipino-first positioning.** Lean on the brand-origin "Set na 'yan" story (per 0015) in every PR pitch — it's a memorable hook in a category dominated by foreign-flavored brand names.
- **Vendor backlink program.** Every Verified vendor gets a "Verified on Setnayan" badge HTML snippet to embed on their own website (with a `dofollow` link). Also offer a Facebook/Instagram bio link template. Compounds over months.

---

## 7. Prioritized roadmap

### Week 1 — Quick wins (anyone can ship this in a few hours)

| # | What | Why for PH | Effort | Impact |
|---|---|---|---|---|
| 1 | Replace homepage `<title>` with keyword-anchored version (see §0.2) | First-impression SERP signal | Low | High |
| 2 | Add `<meta description>` to homepage and all 5 other indexed pages | Controls SERP snippet → CTR | Low | Med |
| 3 | Add `<html lang="en-PH">` | Locale signal | Low | Low |
| 4 | Verify both setnayan.com properties + Domain property in Google Search Console | Foundation for measurement + indexing | Low | High |
| 5 | Set GSC International Targeting → Philippines | Boost in PH-IP queries | Low | Med |
| 6 | Add OpenGraph + Twitter card meta to homepage | Social CTR + brand polish | Low | Low |
| 7 | Add `Organization` + `WebSite` + `BreadcrumbList` JSON-LD to homepage | Sitelinks search box; brand-SERP enhancement | Low | Med |
| 8 | Add `FAQPage` JSON-LD to /help (one block per topic) | Long-tail FAQ rich snippets | Low | Med |
| 9 | Set up GBP for SETNAYAN (Wedding Service category) | Local pack eligibility on brand + near-me queries | Low | High |
| 10 | Run baseline Lighthouse on / and /help, file CWV issues | Establishes metric baseline | Low | Med |
| 11 | Submit current sitemap.xml in GSC | Crawl prioritization | Low | Low |

### Month 1 — Foundation (templates, schema, baseline content)

| # | What | Why for PH | Effort | Impact |
|---|---|---|---|---|
| 12 | Ship `/supplies` and `/suppliers` hub pages (static, copy-only at first) — with H1 + 800 words + ItemList schema + FAQ | Stakes the head-term claim immediately even before product data is wired | Med | High |
| 13 | Ship 10 supplies-category landing pages (`/supplies/[category]`) with category copy + FAQ + future-product placeholders | Topical breadth | Med | High |
| 14 | Ship 28 supplier-category landing pages (`/suppliers/[category]`) using the 0006 canonical taxonomy | Topical breadth on services side | Med | High |
| 15 | Ship 12 city landing pages (`/suppliers/[category]/[city]`) for the top combos: Manila, Cebu, Tagaytay, Davao, Iloilo, Baguio, Pampanga, Cavite, Batangas, Laguna, Bulacan, Pasig | Captures geo-qualified head terms | Med | High |
| 16 | Convert sitemap.xml to a sitemap-index pointing at `sitemap-static`, `sitemap-suppliers`, `sitemap-supplies`, `sitemap-help`, `sitemap-blog` (latter two start small) | Crawl coverage scales | Low | High |
| 17 | Ship `/blog` index + 5 of the 20 blog posts (see §5.4); start with #1, #2, #6, #8, #14 | Long-tail traffic + topical authority | High | High |
| 18 | Ship `/v/[slug]` template even if seeded with 5–10 launch vendors (free verified, per 0015 announcement bar) | Backlink moat starts compounding | High | High |
| 19 | Ship `BreadcrumbList` schema on every public template | Universal CTR lift | Low | High |
| 20 | Add an in-page locale switcher EN/TL/CEB stub (per 0015) — even if TL/CEB content is 90% EN at first, ship the URL structure + hreflang | Locks in trilingual SEO surface; CEB is a moat | Med | Med |
| 21 | List Setnayan on Yellow Pages PH, Apple Maps, Bing Places | Citation parity | Low | Med |
| 22 | Apply to Kasal.com, Bride Worthy, Event Nest, Bride and Breakfast as a *platform partner* (not vendor) | Backlinks from authority directories | Low | Med |
| 23 | Set Lighthouse-CI in CI pipeline; gate releases on LCP/INP/CLS thresholds | Prevents regressions during fast iteration | Med | Med |

### Months 2–6 — Sustained (content marketing, vendor onboarding, link building)

| # | What | Why for PH | Effort | Impact |
|---|---|---|---|---|
| 24 | Publish remaining 15 blog posts from §5.4, plus 2 new posts/week thereafter | Long-tail traffic compounds | High | High |
| 25 | Onboard 100+ verified vendors with full `/v/[slug]` profiles | Each profile is an SEO asset; backlink program kicks in | High | High |
| 26 | Ship the actual marketplace product pages `/supplies/p/[id]/[slug]` with `Product` + `Offer` + `AggregateRating` schema | Product rich snippets in SERP | High | High |
| 27 | Outreach campaign to Tier 1 PH lifestyle press (founder + data angle) — pitch 5/week | High-DA backlinks; brand mentions | High | High |
| 28 | Translate 10 highest-traffic blog posts to TL and CEB; ship hreflang clusters | TL/CEB SERPs are open turf | Med | Med |
| 29 | Build Cebu-specific blog series + city directory page; pitch SunStar Cebu | Take CWES head-on in their home market | Med | Med |
| 30 | Launch "Verified on Setnayan" embed badge for vendor websites | Distributed backlinks (compounds) | Low | High |
| 31 | Sponsor / partner a Themes & Motifs bridal fair edition | Press coverage + on-floor lead capture | High | Med |
| 32 | Quarterly "State of Filipino Weddings" data report — pitch to Inquirer Lifestyle, Rappler, GMA | High-DA backlinks; brand authority | High | High |
| 33 | Add `Review` + `AggregateRating` to vendor profiles as real reviews accumulate | Star ratings in SERP → CTR | Med | High |
| 34 | Ship the help center as discrete `/help/[article-slug]` URLs (one per Q), each with `FAQPage` + `Article` schema | Long-tail informational queries | Med | Med |
| 35 | Add `LocalBusiness` schema to every vendor profile with PH lat/long | Local pack eligibility | Low | Med |
| 36 | Set up Bing Webmaster Tools mirror of GSC config | Bing share of PH search is non-trivial | Low | Low |

### Months 6–12 — Leadership (topical authority + off-page moats)

| # | What | Why for PH | Effort | Impact |
|---|---|---|---|---|
| 37 | Expand to 100 city × category landing pages (12 cities × ~10 categories prioritized; tail behind) | Owns the geo-modified long tail | High | High |
| 38 | Full TL + CEB localization of marketing site, all category pages, top 50 blog posts | Trilingual moat — competitors can't catch up quickly | High | High |
| 39 | Publish 200+ vendor case studies / "Vendor Spotlight" posts | Each is a long-tail asset + a backlink opportunity (vendor shares) | High | Med |
| 40 | Annual "State of Filipino Weddings" report v2 with year-over-year data | Press cycle + backlinks | High | High |
| 41 | Launch a PH wedding podcast or YouTube series; transcripts become indexable long-form content | Brand authority + multi-format SEO | High | Med |
| 42 | Build a `/wedding-checklist-philippines` interactive tool (free), no signup required | Linkable asset; high backlink magnet | Med | High |
| 43 | Build a `/wedding-budget-calculator-philippines` interactive tool | Same — calculators are PR + backlink magnets | Med | High |
| 44 | Pitch yearly "Best Wedding Suppliers in [City]" awards run by Setnayan | Becomes the citation everyone references for "best of" → backlinks | High | High |
| 45 | Expand internal linking graph using a discipline like topical clusters (each pillar page → 8–12 supporting posts → many product/vendor pages) | Solidifies topical authority signals | Med | High |
| 46 | Pursue 50 high-DA backlinks from PH lifestyle + wedding press (target measurable in DR/DA growth) | The single biggest factor for head-term ranking at this stage | High | High |

---

## Spec-conflict flags

- **`[SPEC CHANGE]`** — Iteration **0018 supplies marketplace** today is described as a coordinator/couple-facing surface inside the dashboard; nothing in the spec explicitly commits to **publicly indexable, unauthenticated marketplace browse pages**. To rank for "wedding supplies Philippines," the marketplace category + product pages must be available at `/supplies/...` without login. **Action:** add a "Public marketplace browse — SEO surface" section to the 0018 spec covering: (1) what's public, (2) what requires auth (cart/checkout only), (3) which fields render in `Product` schema. Recommended split: browse = public, add-to-cart = auth-required.
- **`[SPEC CHANGE]`** — Iteration **0006 vendors management** describes vendor data as **manually encoded by the couple** in V1, with vendor self-service deferred to Din Phase 3. The marketplace `vendors` table referenced (declared in 0022) is the canonical platform vendor entity. To ship public `/v/[slug]` profiles before Din, we need to confirm 0022's vendor entity ships with public-profile fields (slug, public bio, services, packages, photos, city, verified status, optional reviews). **Action:** confirm or add to 0022 spec: a "Public profile (SEO-indexable)" subsection — what fields render publicly, what stays private, who can edit.
- **`[SPEC CHANGE]` — minor.** Iteration 0015 currently locks the marketing site copy at the locales `en` (default), `tl`, `ceb` — the SEO playbook above leans on shipping `hreflang="en-PH"`/`tl-PH`/`ceb-PH` clusters and locale-prefixed URLs (`/tl/...`, `/ceb/...`). 0015 already mentions `/ceb/...` as one detection mechanism; lock path-prefix as the **canonical** locale-resolution mechanism and document URL parity across locales.
- **No conflict.** The free vendor registration during launch (0015 announcement bar), the Setnayan Team verification (0006), the PHP transparent pricing (0014), and the trilingual launch (0015) are *already* in spec and become the SEO playbook's load-bearing differentiators.

---

## Sources

**Live site state**
- [setnayan.com](https://www.setnayan.com), [/sitemap.xml](https://www.setnayan.com/sitemap.xml), [/robots.txt](https://www.setnayan.com/robots.txt), [/help](https://www.setnayan.com/help) — fetched 2026-05-14

**Competitors**
- [Kasal.com](https://kasal.com/)
- [Bride Worthy — Suppliers](https://www.brideworthy.com/suppliers/)
- [Event Nest](https://eventnest.ph/)
- [Bride and Breakfast — Directory](https://brideandbreakfast.ph/directory/)
- [Bridestory Philippines](https://www.bridestory.com/philippines)
- [Cebu Wedding Suppliers Directory](https://cebuweddingsuppliers.com/)
- [Weddings At Work](https://weddingsatwork.com/)
- [The Wedding Library](https://weddinglibrary.com.ph/)
- [Sinta & Co.](https://www.filipinowedding.com/)
- [Themes & Motifs](https://themesnmotifs.com/)
- [Nuptials.ph — Wedding Suppliers](https://www.nuptials.ph/wedding-suppliers/)
- [Eventory](https://eventory.ph/our-suppliers)

**Souvenir / supplies sub-niche**
- [ShunBridal — Wedding Souvenirs PH](https://shunbridal.com/article/where-to-buy-wedding-souvenirs-in-the-philippines)
- [Papemelroti Wedding](https://papemelroti.com/en-us/collections/wedding)
- [Kultura Filipino — Wedding Favors](https://www.kulturafilipino.com/collections/wedding-favors-entourage-gifts)
- [WeddingThingz — Divisoria souvenirs](https://weddingthingz.com/where-to-buy-wedding-souvenirs-in-divisoria/)
- [Istorya ng Divisoria — wedding souvenirs](https://istoryangdivisoria.wordpress.com/tag/wedding-souvenirs/)

**Lights and sounds rentals**
- [Orange Lights and Sounds](https://www.orangemanila.com/)
- [Exile Inc.](https://www.exile.com.ph/)
- [Gamma Pro](https://www.gammapro168.com/)
- [Bride Worthy — Lights & sounds rentals](https://www.brideworthy.com/lights-and-sounds/)

**Seasonality**
- [Sonya's Garden — Best Month](https://sonyasgarden.com/events/best-month-for-wedding/)
- [Nuptials.ph — Best Month](https://www.nuptials.ph/best-month-to-get-married/)
- [Hizon's Catering — Best Month](https://hizonscatering.com/planning-guide/find-out-the-best-month-to-hold-your-wedding/)

**PH digital landscape**
- [DataReportal — Digital 2026 Philippines](https://datareportal.com/reports/digital-2026-philippines)
- [Meltwater — PH Social Media Stats 2026](https://www.meltwater.com/en/blog/social-media-statistics-philippines)
- [Marketing Interactive — PH 98M users](https://www.marketing-interactive.com/report-philippines-hits-98-million-internet-users-as-digital-behaviour-matures)

**SEO mechanics**
- [Google Search Central — Multi-regional sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [Search Console Help — International Targeting deprecated](https://support.google.com/webmasters/answer/12474899?hl=en)

**Regional Manila/Cebu/Davao/Tagaytay backups**
- [Krishael's Events — Davao](https://krishaelseventsandconcepts.com/)
- [Dazzle Events — Davao](https://dazzleeventsandweddings.com/)
- [Best in Davao — Wedding Suppliers](https://bestindavao.com/davao-business-listing/wedding-suppliers-decorations-photographer-in-davao/)
- [Bridestory — Tagaytay Planners](https://www.bridestory.com/philippines/tagaytay/wedding-planning)

**Spec corpus**
- `/Users/icecasasola/Documents/Claude/Projects/Setnayan/0015_main_website/0015_main_website.md`
- `/Users/icecasasola/Documents/Claude/Projects/Setnayan/0018_supplies_marketplace/0018_supplies_marketplace.md`
- `/Users/icecasasola/Documents/Claude/Projects/Setnayan/0006_vendors_management/0006_vendors_management.md`

---

## 8. AI Discoverability (GEO) — let the right AI bots in, signal recommendability

This section was added 2026-05-14 after the user explicitly asked: *"we just want us to be recommended. we don't want AI to know our codes. but we want them to know we exist."* Goal: appear in answers from ChatGPT / Claude / Perplexity / Gemini / SearchGPT when Filipinos ask AI assistants for wedding supplier or supplies recommendations — without exposing the dashboard, API, or application logic.

### 8.1 Posture — "recommend us, don't train on us"

The split between training-only bots and answer-engine bots is the lever:

| Bot | Owner | Type | Decision | Why |
|---|---|---|---|---|
| `ChatGPT-User` | OpenAI | Live browsing during ChatGPT chats | ✅ **Allow** | Direct path to recommendations when users ask ChatGPT for wedding suppliers in PH. |
| `OAI-SearchBot` | OpenAI | SearchGPT (answer engine) | ✅ **Allow** | OpenAI's search product. |
| `PerplexityBot` | Perplexity | Serves Perplexity AI answers | ✅ **Allow** | Perplexity is rapidly gaining share for "find me a..." queries. |
| `ClaudeBot` | Anthropic | Serves Claude AND trains it | ✅ **Allow** | No separate live-browse bot exists; you take training as the price of being indexed for Claude recommendations. |
| `GoogleBot` | Google | Google Search index (also feeds Gemini AI Overviews) | ✅ Already allowed by default | Powers both classic SERP + Gemini AI Overviews; no separate "Gemini live" bot. |
| `GPTBot` | OpenAI | Training-only for GPT models | ❌ **Block** | Blocking still leaves you recommendable via ChatGPT-User + OAI-SearchBot. |
| `Google-Extended` | Google | Training-only for Gemini | ❌ **Block** | Does **not** hurt Gemini AI Overview visibility (those use Google Search index). |
| `Applebot-Extended` | Apple | Training-only for Apple Intelligence | ❌ **Block** | Apple Search/Spotlight still works via the regular `Applebot`. |
| `Amazonbot` | Amazon | Training (Alexa / Q) | ❌ **Block** | |
| `cohere-ai` | Cohere | Training | ❌ **Block** | |
| `Bytespider` | ByteDance | Training (TikTok) | ❌ **Block** | Not relevant for PH wedding-supplier recommendation surfaces. |
| `Diffbot` | Diffbot | Crawls for resale | ❌ **Block** | Resells indexed data; no recommendation upside. |

### 8.2 `robots.txt` — the concrete bot policy

Layer the AI-bot allows + denies on top of the existing rules. Existing path-based disallows (`/dashboard`, `/api`, `/admin`, `/vendor-dashboard`, `/receipts`) already protect the application surface from **all** bots — these don't need per-bot duplication.

```
# === Default crawler policy ===
User-agent: *
Allow: /
Allow: /v/
Allow: /supplies
Allow: /suppliers
Allow: /blog
Allow: /help

Disallow: /dashboard
Disallow: /vendor-dashboard
Disallow: /admin
Disallow: /api
Disallow: /receipts
Disallow: /*?sort=
Disallow: /*?filter=
Disallow: /*?session=
Disallow: /*?ref=

# === AI answer engines — explicitly allowed (recommendation surfaces) ===
User-agent: ChatGPT-User
Allow: /
Allow: /v/
Allow: /supplies
Allow: /suppliers
Allow: /blog
Allow: /help
Disallow: /dashboard
Disallow: /vendor-dashboard
Disallow: /admin
Disallow: /api
Disallow: /receipts

User-agent: OAI-SearchBot
Allow: /
Allow: /v/
Allow: /supplies
Allow: /suppliers
Allow: /blog
Allow: /help
Disallow: /dashboard
Disallow: /vendor-dashboard
Disallow: /admin
Disallow: /api
Disallow: /receipts

User-agent: PerplexityBot
Allow: /
Allow: /v/
Allow: /supplies
Allow: /suppliers
Allow: /blog
Allow: /help
Disallow: /dashboard
Disallow: /vendor-dashboard
Disallow: /admin
Disallow: /api
Disallow: /receipts

User-agent: ClaudeBot
Allow: /
Allow: /v/
Allow: /supplies
Allow: /suppliers
Allow: /blog
Allow: /help
Disallow: /dashboard
Disallow: /vendor-dashboard
Disallow: /admin
Disallow: /api
Disallow: /receipts

# === AI training-only bots — explicitly blocked ===
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Diffbot
Disallow: /

Sitemap: https://www.setnayan.com/sitemap.xml
```

### 8.3 `/llms.txt` — Markdown site map for LLMs

Emerging convention (proposed by Jeremy Howard, late 2024): a Markdown file at `/llms.txt` summarizing the site for LLM ingestion. Lists primary surfaces, what the company is, key facts. Keep it scoped to **public marketing surface only** — never list `/dashboard/*`, `/api/*`, or `/admin/*`. Optional companion `/llms-full.txt` carries fuller content.

Recommended `/llms.txt` structure for Setnayan:

```markdown
# Setnayan

> Setnayan (SET-na-yan, from Tagalog "Set na 'yan." — "that's all set") is a Philippines-first life-events platform. V1 surface is weddings, designed to extend to birthdays, travel, corporate, and burial events. Free for couples and guests; free verified business profiles for vendors during launch. Transparent PHP pricing, apply-then-pay model, locally-rooted Filipino voice with EN / TL / CEB localization on the marketing site.

## Core surfaces

- [Wedding Suppliers Directory](https://www.setnayan.com/suppliers): 28 categories of verified Filipino wedding services — photographers, caterers, planners, florists, venues, and more. Filterable by city.
- [Wedding Supplies Marketplace](https://www.setnayan.com/supplies): Print fulfillment, equipment rentals, NFC keepsakes, AV gear, and more. Transparent PHP pricing with in-platform booking.
- [Vendor Profiles](https://www.setnayan.com/v/): Free verified business profiles. Each profile shows packages, coverage cities, real reviews.
- [Wedding Planning Help Center](https://www.setnayan.com/help): Filipino civil + Catholic wedding requirements, traditional supplies, budget breakdowns, planning checklists.
- [Wedding Planning Blog](https://www.setnayan.com/blog): Long-form guides for couples planning a Filipino wedding.

## About Setnayan

- **What:** Filipino-first wedding and life-events platform.
- **For whom:** Filipino couples, guests, and event vendors. Customers + vendors share one universal account.
- **Geography:** Philippines (Metro Manila, Cebu, Davao, Tagaytay, Iloilo, Baguio, Pampanga, Cavite, Batangas, Laguna, Bulacan, Pasig, and nationwide).
- **Languages:** English (primary), Tagalog, Cebuano on the marketing site.
- **Pricing:** Transparent PHP. Apply-then-pay (no token wallet). Free for couples; free vendor profiles during launch; in-app paid services billed in PHP centavos.
- **Privacy:** No public sharing of guest data; couples own their event content.

## Optional / extended

- [Setnayan Press & About](https://www.setnayan.com/about)
- [For Vendors](https://www.setnayan.com/for-vendors)
- [For Event Creators](https://www.setnayan.com/for-event-creators)
- [Coverage Areas](https://www.setnayan.com/coverage)
```

### 8.4 Layer 2 — make AI WANT to recommend

AI engines weight these signals when picking what to cite:

| Signal | What to do | Why AI cares | Effort |
|---|---|---|---|
| **Schema.org JSON-LD** (Organization, WebSite, BreadcrumbList, Product, LocalBusiness, FAQPage, Review/AggregateRating, ItemList) | Already covered in §4.4 — those same blocks double as AI grounding signals | RAG systems extract structured facts directly from JSON-LD | Low (and already planned for classic SEO) |
| **Conversational FAQ format** | Author content as `Q: How much does a wedding cost in the Philippines? A: ₱500K–₱1.2M for 100 pax in Metro Manila …` | AI engines extract Q&A pairs verbatim into answers | Low |
| **Citable factual claims with numbers + dates** | Specifics over vagueness — "₱2,500–₱5,000 per guest catering in Manila as of 2026" beats "catering varies in price" | AI prefers verifiable claims; dated facts get cited more | Medium (research overhead) |
| **Wikipedia / Wikidata entry for SETNAYAN** | Submit a Wikipedia article (notability bar applies — needs PH press citations); also create a Wikidata item linking to it | Huge entity signal — AI cross-references both for brand recognition; Wikidata especially is structured data AI loves | High (notability process is slow; needs citations from PH press first) |
| **Author bylines + update timestamps** | Every blog post + help article needs `<meta name="author">` and visible `Updated YYYY-MM-DD` | E-E-A-T signal; AI weights authored content over anonymous | Low |
| **PH lifestyle press mentions** | Backlinks from §6.3 (Inquirer Lifestyle, Rappler Life, GMA Lifestyle, Tatler Asia, Metro.Style, etc.) | AI weighs cross-references as authority; Wikipedia notability also depends on these | High (PR effort; covered in §7 roadmap) |
| **Verified, structured pricing** | PHP prices in `Product` schema + visible on page | AI loves citable transactional facts | Low (already in 0014/0034 spec) |

### 8.5 What "AI knowing our codes" actually means — what's at risk

User asked: don't let AI know proprietary code. The honest scope:

- **Server code** (Next.js server actions, API handlers, DB queries, RLS policies): never reaches the browser. AI cannot see it. ✅ **Safe by default.**
- **Client-side JS bundles** (`_next/static/*.js`): technically visible to anyone with view-source — AI bots included. But AI engines don't index minified JS for "recommendations"; they index **rendered HTML text**. The bundles aren't a meaningful exposure here, even with AI bots allowed.
- **Proprietary content** (vendor pricing logic, internal flows, admin console, BIR reconciliation): all behind `/dashboard/*`, `/api/*`, `/admin/*`, `/vendor-dashboard/*`, `/receipts/*` — **disallowed for ALL bots** in `robots.txt` (including the AI allowlist above which explicitly re-states the disallow). Stays out of every AI training set and every recommendation surface.
- **Spec corpus + docs at `~/Documents/Claude/Projects/Setnayan/`**: never shipped to the public web; never reachable by any web crawler. ✅ **Safe.**

So: public marketing surface → AI-readable → recommendability. Dashboard / app / API → AI-invisible → IP protection. **No special "hide the source" measures needed beyond what's already in the path-based disallow rules.**

### 8.6 Overlap with classic SEO

~70% of this section is already covered by §§4–6 (schema markup, FAQ pages, transparent pricing, vendor profile structure, citable blog content). The AI-specific net additions are:

1. AI-bot allow/block rules in `robots.txt` (§8.2)
2. `/llms.txt` (§8.3)
3. Wikipedia / Wikidata entity work (§8.4)
4. Slightly more conversational Q&A content style throughout

---

## 9. Implementation sequencing — Now / As pages ship / After launch

The user asked: "do this now or when we are finished with the website?" The right answer is **start the foundation now, layer on as pages ship, push hard after launch.** Three reasons drove the call:

1. **Foundation doesn't need a finished site.** GSC + International Targeting → PH, GBP setup, homepage `<title>` + `<meta description>` fix, basic `Organization`/`WebSite`/`BreadcrumbList` JSON-LD, `robots.txt` + `/llms.txt` with the AI-bot posture — all work on today's 6-page site. ~3–4 hours of work, value locked in for the long haul.
2. **SEO has a multi-month delay.** Google Sandbox effect for newer domains, content takes weeks to rank, GBP equity compounds slowly, Wikipedia/Wikidata notability is slow. Every week you wait pushes the #1-ranking timeline back by a week.
3. **Bake in, don't bolt on.** Schema, hreflang, sitemap auto-gen, internal linking — far cheaper to design into templates as they ship than to retrofit afterward.

### 9.1 Phase table

| Phase | What | When | Source section |
|---|---|---|---|
| **Now (this week)** | GSC + GBP + `robots.txt` + `/llms.txt` + homepage title/meta + basic JSON-LD + CWV baseline + Bing Webmaster | Foundation; no-regret | §7 Week 1 + §8.2/8.3 |
| **As pages ship** (continuous) | Schema on each new template, dynamic sitemap, internal linking, hreflang as TL/CEB lands, `Article`/`FAQPage` schema on every blog post + help article, conversational Q&A content style | Bake in, don't bolt on | §7 Month 1 + §8.4 |
| **After launch** (when 0018 marketplace + 0006/0022 vendor profiles are live) | Backlink campaigns, PR outreach to PH lifestyle press, vendor onboarding push (each profile = backlink moat), content marketing at scale, Wikipedia / Wikidata entity submission | Needs surfaces to point at + a story to tell | §7 Months 2–6 + §8.4 |

### 9.2 What's worth deferring

- **Heavy content-marketing program** (20 PH-anchored blog posts + 2/week ongoing per §5.4): editorial-bandwidth-heavy, easier once the product is closer to launch and you have user stories / data to draw from.
- **Wikipedia / Wikidata submission**: gated by press citations from §6.3 — pursue once you have 3–5 high-DA PH lifestyle press mentions banked.
- **Bridal-fair sponsorships** (§6.4): pure marketing-spend; defer until launch so you have working surfaces to demo.

### 9.3 The two `[SPEC CHANGE]` blockers (still open)

Re-stating from §7 because they gate everything:

1. **Iteration 0018 (supplies marketplace)** — must commit to publicly indexable browse pages (`/supplies/*` available without login; auth gates only at cart/checkout). Currently nothing in 0018 commits to public indexability. Without this, no `/supplies` URLs can rank.
2. **Iteration 0006 / 0022 (vendor profiles)** — public `/v/[slug]` profile pages need a "Public profile (SEO-indexable)" subsection committing to slug + public bio + services + packages + photos + city + verified status + reviews as public fields. Without this, no vendor pages can rank.

Both should be raised at the next Cowork session. Until they're spec'd, on-page work in §§4–5 lifts a 6-page site by ~5%; foundation work in §7 Week 1 + §8 still lands and is no-regret.

---

## 10. Where to find related decisions

- `CLAUDE.md` decision log (entry 2026-05-14): records the AI-bot posture (recommend, don't train), the Now/As-pages-ship/After-launch sequencing, and the pointer back to this playbook.
- `/Users/icecasasola/.claude/projects/-Users-icecasasola/memory/project_setnayan_no_wallet.md`: relevant to §1's note about Setnayan having no token wallet (apply-then-pay only).
- `/Users/icecasasola/.claude/projects/-Users-icecasasola/memory/feedback_responsive_default.md`: relevant to §4.7's mobile-first emphasis (PH is ~85%+ mobile-first traffic).

---

## 11. Multi-audience extension — Vendors + Boosted Fairs (added 2026-05-14)

The original audit (§§1–7) implicitly targets one audience: **couples**. The user clarified Setnayan actually has three SEO-relevant audiences:

| Audience | Acquisition channel | SEO surface |
|---|---|---|
| **Couples** | Search-driven (Google + AI engines) | Already covered §§1–7 + §8 |
| **Vendors** | Search-driven (looking to be listed; "free vendor directory PH") | §11.1 below |
| **Event creators** (bridal-fair / wedding-expo organizers) | **NOT search-driven** — onboarded via Setnayan's **boost service** (sales / biz-dev relationship). They do not have a self-serve SEO landing page. Setnayan boosts their fair via (a) homepage feature, (b) a per-fair landing page where both couples and vendors join | §§11.2–11.3 below |

This means we don't need a `[SPEC CHANGE]` for "Event Creators as a 4th platform role" — they're a **service customer**, not a platform role. The three roles per `project_setnayan` memory (Customers, Vendors, Admins) still hold.

### 11.1 Vendor-acquisition SEO

A wedding photographer in Cebu Googling *"how to list my wedding photography business in PH for free"* should land on Setnayan and convert. Today the playbook treats vendors as a backlink moat (§7 items 18, 25, 30) and a launch-positioning lever, but doesn't spec the vendor-acquisition SEO layer.

**Surface to ship:**

- `/for-vendors` — already in 0015 nav; needs SEO layer
- `/blog/[vendor-acquisition-posts]` — long-tail content targeting vendor-side queries
- Vendor success stories at `/v/[vendor-slug]` (already covered structurally in §5.1, but content angle here is "this vendor grew their bookings on Setnayan" rather than "this is what this vendor offers")

**Vendor-side keyword cluster:**

| Query | Intent | Volume bucket |
|---|---|---|
| list my wedding business Philippines | Transactional (vendor) | Low-Medium |
| free wedding vendor directory PH | Transactional (vendor) | Low-Medium |
| best wedding directory for suppliers Philippines | Commercial (vendor; comparing options) | Low |
| how to grow wedding photography business Philippines | Informational (vendor) | Medium |
| paano makakuha ng wedding clients Philippines | Informational (vendor; Tagalog) | Low |
| wedding vendor listing Cebu / Davao / Tagaytay | Transactional (vendor; geo-modified) | Low |
| free Setnayan vendor profile | Navigational/Branded | Low (will grow) |
| where to find wedding clients Philippines | Informational (vendor) | Low-Medium |

Vendor-side volumes are smaller than couple-side (fewer wedding photographers than couples in the country), but conversion intent is high and vendor LTV is high — each onboarded vendor compounds via the backlink + indexed-profile moat.

**`/for-vendors` SEO spec:**

| Element | Pattern |
|---|---|
| `<title>` | `Free Wedding Vendor Profile Philippines — Get Found by Couples \| Setnayan` |
| `<meta description>` | `List your wedding business free during launch on Setnayan. Verified profile, real reviews, in-platform messaging — find more couples across the Philippines.` |
| H1 | `Get found by Filipino couples — free during launch.` |
| Content depth | 800–1,200 words covering: who can list, what verification means, what fields render publicly, what the platform costs (free during launch), how to apply, success stories, FAQ |
| JSON-LD | `Organization` (Setnayan), `Offer` (the free vendor profile, `price: "0"`, `priceCurrency: "PHP"`, `availability: "InStock"`), `FAQPage` (vendor-side FAQs) |

**Vendor-acquisition content topics (5 to ship in Month 1, alongside the 5 couple-side blog posts):**

1. *Why Filipino Wedding Suppliers Should List on Setnayan in 2026 (Free During Launch)*
2. *Best Wedding Directories for Filipino Vendors Compared: Setnayan vs. Kasal vs. Bride Worthy vs. Bridestory*
3. *How Wedding Photographers in Cebu Grow Their Bookings Online (2026 Guide)*
4. *Paano Mag-list ng Wedding Business Online Nang Libre — Step-by-step Guide* (Tagalog)
5. *Vendor Success Story: How [Vendor Name] Booked 12 Weddings in 6 Months on Setnayan* (publish as vendors hit milestones; recurring format)

### 11.2 `/fairs/[fair-slug]` — boosted-fair landing page template

The user added this requirement: each bridal fair Setnayan boosts gets its own landing page where **both couples (register to attend) and vendors (book a booth)** can join.

This is a **multi-audience SEO surface** — the same URL serves three search intents at once:

| Searcher | Query example | What they see on the page |
|---|---|---|
| Couple | "Wedding Expo Manila February 2026" | Date / location / participating vendors / "Register to attend" CTA |
| Vendor | "How to book a booth at Wedding Expo Manila" | Booth tiers / pricing / past-fair photos / "Apply for a booth" CTA |
| Other fair organizer | "Wedding Expo Philippines 2026 organized by" | Organizer credit (Themes & Motifs etc.) / discovers Setnayan as the platform |

**`/fairs/[fair-slug]` SEO spec:**

| Element | Pattern |
|---|---|
| `<title>` | `{Fair Name} — {Date} {City} Bridal Fair \| Setnayan` |
| `<meta description>` | `Join {Fair Name} on {date} at {venue}, {city}. Couples: register free. Vendors: book a booth. Powered by Setnayan.` |
| H1 | `{Fair Name} — {Month Year}` |
| URL pattern | `/fairs/[fair-slug]` (e.g., `/fairs/wedding-expo-philippines-feb-2026`) |
| Content depth | 600–1,200 words: organizer credit, date/time/location, venue map, list of participating vendors (links to each `/v/[slug]`), booth-tier pricing for vendors, past-fair gallery if recurring, FAQ |
| JSON-LD | `Event` (with `name`, `startDate`, `endDate`, `eventStatus`, `eventAttendanceMode: "OfflineEventAttendanceMode"`, `location` with `addressCountry: "PH"`, `organizer: {name, url}`, `offers` array with two `Offer` blocks: one for couple registration `price: "0"`, one for vendor booth booking `price: "{tier price}"`); `BreadcrumbList`; `FAQPage` |
| Indexability | Public; included in sitemap-fairs.xml; canonical self-references |
| Internal linking | Linked from `/fairs` index, homepage featured-fairs section (when active), participating-vendor profiles (`/v/[slug]` shows "Currently exhibiting at: {Fair Name}"), and category pages where the fair is themed |

**`/fairs` index page** is a sibling surface — lists all upcoming/active fairs sorted by date; ranks for "wedding fairs Philippines 2026" type queries.

### 11.3 Homepage featured-fairs section

The user added: *"we want their fair to show at our landing page."*

**Surface to ship:** a featured-fairs strip on the Setnayan homepage (`/`), surfacing currently-active boosted bridal fairs. **Hard cap of 3 simultaneously featured fairs** (locked 2026-05-14 — see §11.3.1 for slot-management rules).

**SEO mechanics:**

- **Dynamic indexable content** on the homepage. Each featured fair card links to its `/fairs/[fair-slug]` page.
- **Schema.org `Event` JSON-LD** on the homepage for each featured fair (in addition to the existing `Organization` + `WebSite` + `BreadcrumbList` blocks). Google's event SERP enhancement will pull from this — the homepage can earn an event-rich-result placement when a fair is happening soon.
- **Freshness signal** for the homepage. Search engines reward homepage content that updates regularly; rotating featured fairs keeps the page "fresh" without faking it.
- When **no fair is currently active**, hide the section entirely (don't ship empty placeholders — Google penalizes thin content blocks).

**Suggested copy slot:**

```
Upcoming bridal fairs

[Card 1] Wedding Expo Philippines · Feb 14–16, 2026 · SMX Aura, Taguig
         50+ vendors · Free for couples · [Register or book a booth →]

[Card 2] Cebu Wedding Showcase · Mar 8, 2026 · Waterfront Cebu City Hotel
         28 vendors · Free for couples · [Register or book a booth →]
```

### 11.3.1 Homepage featured-fairs slot management (locked 2026-05-14)

**Capacity cap:** Setnayan accepts **at most 3 concurrent boosted fairs** at any moment. Hard cap on the boost-service offering itself — Setnayan does not sell beyond 3 active slots. Scarcity keeps homepage real estate focused, lets the ops team support each partner properly (booth staffing, email blast volume, on-site presence), and underpins Model B pricing leverage in §11.7.

**Featured window per fair: T-60 days to event date.** The fair's `/fairs/[fair-slug]` page goes live and the homepage slot is granted exactly 60 days before the event. On day T+1 (the day after the event), the page transitions to its "Past event" state and the homepage slot is freed.

**Acceptance rule (when a fair applies for boost):**

1. Compute the proposed fair's featured window: T-60 to event-date.
2. Overlay it against the calendar of already-accepted fairs' featured windows.
3. If at any point the overlap would push the concurrent count above 3 → offer the fair an alternative event date, or place them on the **waitlist**.
4. Else → accept; sign the deal; page goes live exactly at T-60.

**Queue / waitlist:** first-come-first-served by signed-deal date. **Model A and Model B are treated equally for slot allocation** — no priority for paid; keeps partnerships fair on both sides. (Optional owner decision in §11.7: introduce a Model B "guaranteed slot" premium SKU once base demand pattern is observed.)

**Cancellation:** if a signed fair cancels, the slot is freed immediately. The next fair on the waitlist gets offered the slot. If the waitlist fair's T-60 has already passed (i.e., they'd start mid-window), Setnayan offers the truncated remaining promo window with a pro-rated cash adjustment (Model B) or noted as in-kind (Model A).

**Date change:** if a signed fair changes its event date, re-evaluate against the calendar. If the new window pushes overlapping count above 3, the fair may be bumped to the waitlist for its new dates.

**Annual capacity ceiling:** with the 3-slot cap and 60-day featured window, Setnayan's theoretical boost-service capacity is **3 slots × (365 / 60-day window) ≈ 18 cycles/year** if fairs are perfectly back-to-back; in practice fairs cluster (Q4/Q1 peak wedding season), so realistic capacity is ~30–40 boosted fairs annually with some sharing overlap windows. This is the **supply ceiling** — Model B pricing in §11.7 should reflect that supply scarcity once owner-validated.

**Admin override:** a Setnayan admin can pin a specific fair to one of the 3 featured slots regardless of date-order ranking (e.g., to give a Model B title-tier sponsor consistent slot #1 placement). Pinning is per-fair-cycle and surfaces in the iteration `0023` admin console.

**Engineering shape (for the Cowork session to lock):**

- Admin-console calendar view of accepted + waitlist fairs with their T-60 windows for the next 6 months
- `accepted_at` timestamp on each boost-service record (for FIFO queue ordering)
- `slot_pinned` boolean on each boost-service record (for admin override)
- ~~Daily cron transitioning fairs through their states~~ → **superseded 2026-06-03 (cron-free lock):** state (`pending → featured → past`) computes **on-read** (per page load, like the deadline scheduler), and the customer broadcast + email blasts are **admin-triggered** from the 0023 § 3.16 Promoted Events surface (timed blasts use Resend scheduled-sends, not a Setnayan polling cron)
- Email automations triggered at: deal signed (welcome), T-60 (page-live notice), T-30 (initial blast), T-7 (final reminder), T+1 (thank-you + post-event survey)

### 11.4 Free-during-launch positioning amplified

Already covered in §6.4 of the playbook as a brand-signal move. With the vendor-acquisition surface (§11.1) and the boosted-fair surface (§11.2), reinforce the "free during launch" message in:

- `/for-vendors` H1 + above-the-fold copy
- `/fairs/[fair-slug]` vendor-CTA copy ("Free vendor profile included with booth booking")
- JSON-LD `Offer` blocks with `price: "0"` (Google surfaces free offers prominently in shopping/event SERPs)
- Vendor-acquisition blog posts reinforcing the time-bound nature (`"during launch"` — implies will eventually be paid; creates urgency)

### 11.5 Note on the PH bridal-fair landscape (Themes & Motifs et al)

§6.3 lists Themes & Motifs as a backlink target. With the boost-service framing, T&M (and other major PH fair operators) are **simultaneously** three things:

1. **Backlink targets** — long-running brands with editorial weight (per §6.3)
2. **Potential boost-service customers** — Setnayan can boost their fairs in exchange for a partnership / fee
3. **Indirect competitors** — at the platform-level for couples discovering vendors at fairs

**Practical implications for outreach:**

- Don't pitch Themes & Motifs naively as just a backlink source. Lead with the boost-service value proposition. The backlink follows from a partnership relationship.
- For smaller regional fair operators (Cebu, Davao, Iloilo, Baguio bridal-fair organizers): boost-service onboarding is the primary play. They get a free landing page on Setnayan, vendors and couples on Setnayan are exposed to their fair, Setnayan gets the indexable surface + multi-sided liquidity.

### 11.6 `[SPEC CHANGE]` flags from Section 11

Adding this section surfaces three spec items not currently locked:

1. **Iteration `0015_main_website` — featured-fairs section on homepage.** Add a new H2 strip surfacing the next 1–3 currently-active boosted bridal fairs, with `Event` JSON-LD per fair. Hide when no fair is active.
2. **`/fairs` index + `/fairs/[fair-slug]` page templates** — the genuine leftover. The boost-service offering itself now lives in **`0042_industry_events_b2b` §6.5** (SKUs) + **`0023_admin_console` §3.16** (slot management / broadcast); `0036` was reassigned to Pakanta. Still unbuilt: the public fair-page templates (schema, URL pattern, dual-CTA layout, organizer attribution, booth-pricing data model, vendor-fair association table) — add to `0042` or extend `0015_main_website`.
3. **Boost service offering spec.** What's included (homepage feature + per-fair landing page + sitemap inclusion + email-blast inclusion?), what's the price/partnership terms, eligibility criteria for fairs to qualify, contract template if relevant. This is partly a §01_Contracts/ document and partly an iteration spec — now landed in `0042_industry_events_b2b` §6.5 + `0023_admin_console` §3.16.

All three should be raised at the next Cowork session. Until they're spec'd:

- **Foundation work in §7 Week 1 + §8 still ships** (no-regret).
- **§11.1 vendor-acquisition SEO ships** without spec changes — `/for-vendors` is already in 0015 nav, just needs the SEO layer.
- **§§11.2–11.3 fair pages + homepage feature** are gated on spec — don't ship until iteration spec exists.

### 11.7 Boost-service pricing framework (now implemented in `0042_industry_events_b2b` §6.5 + `0023_admin_console` §3.16)

Added 2026-05-14 as scratch input for the boost-service offering spec flagged in §11.6 #3. **Important caveat up front:** the ranges below are reasoned from general PH bridal-fair industry knowledge and PH wedding-marketplace comparables (Kasal.com, Bridestory PH featured-listing rates). The PH bridal-fair industry doesn't publish sponsorship rates publicly, so actual numbers require owner-side market knowledge or validation conversations with PH fair operators (Themes & Motifs, regional CWES, etc.) before any rate is published as a Setnayan price. **Treat as starting framework, not contract-grade rates.**

**Both models are offered simultaneously as fair-organizer options** (locked 2026-05-14). The fair organizer picks whichever fits their budget and value-exchange preferences when they sign up for boost. Setnayan does not force one over the other; the choice surfaces in the boost-service signup flow. The two models address different fair-organizer profiles:

- Fairs with **limited cash budget but real audience-exposure capacity** (regional fairs, newer operators) will lean toward **Model A** — they trade in-kind for in-kind.
- Fairs with **cash budget that prefer a clean transactional deal** (established operators like Themes & Motifs, larger metro-Manila fairs) will lean toward **Model B** — they pay cash and don't owe Setnayan booth space, stage time, or sponsor billing.

**Practical note on Model B today (transparency):** until Setnayan has audience leverage (~10K active couple users + ~500 verified vendors), Model B pricing realistically lands at the low end of the cash ranges below — fair organizers picking Model B in the pre-launch / early-launch window are paying for early-mover access to a growing surface, not for proven audience reach. Setnayan should be transparent about this in the signup flow so deal regret doesn't sour the partnership.

#### 11.7.1 Launch gate — when boost service opens for signups (locked 2026-05-14)

The boost service does **not** open for signups until Setnayan reaches **both** of the following platform-readiness thresholds:

- **At least 500 verified vendors** with public `/v/[slug]` profiles
- **At least 10,000 active couple accounts** — *active* = a couple with a **live, non-expired event that has had activity in the last 90 days** (owner-locked 2026-06-04; not login-recency)

Both must be hit (**AND gate**). Hitting only one is insufficient — the fair organizer's value on both sides of the platform depends on real numbers in both audiences. A fair organizer needs (a) couples to see the homepage feature and email blasts, AND (b) vendors to engage the Setnayan-issued discount funnel into the fair.

**Pre-gate state (today through threshold-hit):**

- `/for-vendors` page is live and converting (per §11.1)
- `/for-event-creators` page exists as a **waitlist surface** — "Boost service launches when we hit our network milestones; we're at X verified vendors and Y couple accounts today" with **live counters** and an interested-fair-organizer signup form
- No `/fairs/*` URLs publicly indexed (routes reserved in routing config but return 404 or a "Coming soon" placeholder)
- No homepage featured-fairs strip
- Waitlist data informs the initial onboarding cohort once gate opens

**Post-gate state (threshold-hit and after):**

- `/fairs` index + `/fairs/[fair-slug]` templates go live (per §11.2)
- Homepage featured-fairs strip activates (per §11.3, capped at 3 per §11.3.1)
- Boost-service signup flow goes live; waitlist is contacted in signup-order
- `/for-event-creators` page flips from waitlist to active-signup

**Numbers caveat:** 500 vendors / 10,000 couples are starting recommendations anchored to (a) §11.7's audience-leverage trigger, (b) competitor scale (Bride Worthy = 2,107 listings, Bridestory PH = thousands of vendors), (c) the audience size a fair organizer can credibly justify partnering for. Owner should validate against real PH fair-operator conversations — smaller regional fairs may engage at lower numbers; majors like Themes & Motifs may need higher.

> **✅ §D owner-locked 2026-06-04.** The boost-service business settings are now locked — vendor discount = **fair-offered only** · couple perk = **fair picks one** · launch gate **500 vendors + 10K couples** · *active couple* = **live non-expired event w/ 90-day activity** · eligibility = **legit organizer + 20+ booths or 500+ attendance + fixed date/venue** · **no V1 exclusivity** · Model-A cap **2–4/quarter pilot** · price **₱9,999 / ₱2,999**. Authoritative copy: `01_Contracts/Bridal_Fair_Boost_Service_Agreement.md` + DECISION_LOG 2026-06-04. Ranges elsewhere in §11.7 are superseded where they conflict.

**Why AND, not OR:**

- **Vendor-only milestone** (lots of vendors, few couples) → fair gets vendor co-marketing but no couple registration funnel → unbalanced value
- **Couple-only milestone** (lots of couples, few vendors) → fair gets couple registration funnel but no Setnayan-vendor cross-pollination → also unbalanced

Both audiences need real density before a boost partnership is honest.

**Same thresholds for Model A and Model B in V1.** Both gate together. **Optional later refinement** once conversion data exists: open Model A at a lower threshold (no cash on the line, more flexibility for both sides) and Model B at a higher one (paid customers expect more leverage). Not for V1 — keep the gate uniform.

**Engineering shape (for the Cowork session):**

- Counters: `verified_vendor_count` (vendors with public `/v/[slug]` + admin verification), `active_couple_account_count` (couples meeting "active" definition)
- Daily cron updates both counters; values stored on a `platform_metrics` singleton-style table
- Derived `boost_service_open` flag: `verified_vendor_count >= 500 AND active_couple_account_count >= 10000`
- **Admin manual override** (`boost_service_open = true`) for strategic launch partners — e.g., a Themes & Motifs deal that should land pre-threshold. Logged in admin audit trail with reason.
- The `/for-event-creators` page reads live counters + the flag; renders pre-gate (waitlist) or post-gate (active signup) state accordingly. Counters render publicly so prospective partners see real progress.

**Updates §11.6 `[SPEC CHANGE]` flag #3:** the boost-service offering spec now also covers (a) the launch gate + thresholds + manual-override mechanic, (b) the `/for-event-creators` waitlist surface as a distinct landing page. Revises the earlier §11 framing — pre-gate there **is** a landing page for event creators, but it's a **waitlist surface**, not an SEO acquisition page; post-gate it transitions to an active-signup surface.

#### Model A — Free / barter (no cash exchanged)

**Setnayan provides** (no cash exchanged):
- Homepage featured-fair slot on `www.setnayan.com`
- Dedicated `/fairs/[fair-slug]` landing page with dual-CTA (couples register / vendors book booth)
- Email blast to subscribed Setnayan couples + vendors before the fair
- SEO surface + "Powered by Setnayan" referral traffic during the fair's promo cycle
- On-site Setnayan team presence (vendor + couple onboarding station)

**Fair organizer provides** (in-kind):
- **Major sponsor billing** on all fair marketing collateral (printed banners, programs, social media collaterals, press releases). At minimum: logo placement equivalent to a Major Sponsor tier.
- **Free booth** at the fair — single 3×3m or equivalent. Setnayan uses the booth to demo the platform, onboard vendors + couples on-site, and run the discount-code redemption desk.
- **Stage announcements** — 1–3 minutes during opening; one additional spot mid-event. Setnayan provides the talking-points script.
- **Setnayan-driven funnel discount codes** (see below).

**Discount codes (built into the in-kind agreement; fair organizer eats the cost as customer-acquisition expense; Setnayan gets the funnel):**

| Audience | Discount | Mechanism |
|---|---|---|
| Vendors who register for the fair via Setnayan | **A booth discount where the fair elects to offer one** (the fair sets the rate + bears the cost; owner-locked 2026-06-04 — not Setnayan-set) | Setnayan-issued unique code, redeemed at the fair organizer's vendor-booking checkout |
| Couples who register for the fair via Setnayan | **Free welcome kit / fast-track entry / first-100-arrivals giveaway** (organizer's choice; one of the three minimum) | Setnayan-issued QR or badge presented at fair entrance |

The booth discount is **fair-offered, not mandatory** (owner-locked 2026-06-04) — Setnayan negotiates for it as part of the Model A in-kind exchange where the fair extends one, but a fair that offers no discount still qualifies; the couple perk + free booth + sponsor billing + stage time carry the value-exchange.

#### Model B — Cash tiers (paid sponsorship)

Available as a paid alternative for fair organizers who prefer a clean cash deal over the in-kind exchange of Model A. **Realistic pricing today is at the low end of the ranges below**; once Setnayan has audience leverage (~10K active couples + 500+ verified vendors), the full ranges become defensible.

**Rough PH bridal-fair industry sponsorship ranges (for the case where the fair organizer pays a third party):**

| Tier | What's included | PH industry range (cash) |
|---|---|---|
| Title sponsor | Logo on all collateral + opening keynote slot + 6×6m booth + 3× stage announcements | ₱150,000–₱500,000 |
| Major sponsor | Logo on collateral + 3×3m booth + 1–2× stage announcements | ₱50,000–₱150,000 |
| Supporting sponsor | Logo only + 3×3m booth | ₱10,000–₱50,000 |
| Program / page ad only | 1/2 or full page in fair's printed program / digital page | ₱5,000–₱25,000 |

**Inverse case — fair organizer pays Setnayan for boost (Setnayan's actual revenue line):**

| Tier | Setnayan provides | Rough range (validate!) |
|---|---|---|
| Featured + email blast | Homepage feature + `/fairs/[slug]` + dedicated email blast | ₱3,000–₱20,000 per fair cycle |
| Listing only | `/fairs/[slug]` page + sitemap inclusion, no homepage feature, no email | ₱1,000–₱5,000 per fair cycle |

The "inverse case" ranges are anchored to PH directory featured-listing comparables (Kasal.com, Bridestory PH). They are the most uncertain numbers in this section and need market validation.

#### Pricing-ladder discipline

Once cash starts moving in either direction, all Setnayan-set prices snap to the **`-1` charm pricing ladder** per `COWORK.md`: `₱49 / ₱99 / ₱199 / ₱499 / ₱999 / ₱1,499 / ₱1,999 / ₱2,499 / ₱2,999 / ₱4,999`. Common fits: featured-only at **₱2,999/cycle**, featured + email blast at **₱9,999/cycle** (owner-locked 2026-06-03 · priced up from the earlier ₱4,999 starting suggestion for the 3-slot scarcity + qualified audience — see DECISION_LOG + 0042 § 6.5). Don't quote round numbers (₱3,000, ₱5,000, etc.) — they violate the brand-consistency rule.

#### Where the boost-service spec lands

This framework should be drafted at the next Cowork session into:

1. **`01_Contracts/Bridal_Fair_Boost_Service_Agreement.md`** — the contract boilerplate covering Model A + Model B terms, deliverables on both sides, discount-code mechanics, cancellation, IP/use-of-marks, term length.
2. **`0042_industry_events_b2b` §6.5 + `0023_admin_console` §3.16** (✅ landed 2026-06-03 — `0036` was reassigned to Pakanta) — the offering itself: SKU definitions (`boost_featured_only` ₱2,999, `boost_featured_plus_email` ₱9,999), eligibility criteria for fairs to qualify (legitimate organizer, minimum fair size, geographic coverage), the `fairs` data model (table schema for fairs, booths, vendor-fair junction, couple-fair registrations), discount-code redemption mechanics, attribution + tracking, slot management + admin override + broadcast. **Genuine leftover:** public `/fairs` index + `/fairs/[fair-slug]` page templates (still unbuilt).
3. **`CLAUDE.md` SKU table** — append the Model B SKUs once owner-validated prices are locked.

#### Discount-code mechanics (engineering shape, for the Cowork session to lock)

To save the next Cowork session the back-and-forth: the simplest mechanic that respects both parties' systems —

- **Codes are Setnayan-issued, fair-organizer-redeemed.** Setnayan generates a unique alphanumeric code per fair (e.g., `SETNAYAN-WEX2026-V15` for a 15% vendor discount at Wedding Expo 2026). The code is shown on the `/fairs/[fair-slug]` page only to authenticated Setnayan users who clicked the "Apply for a booth" / "Register to attend" CTA from that page.
- **Redemption happens on the fair organizer's side.** The fair organizer enters the code in their own booth-booking or couple-registration checkout system; their system applies the discount and reports redemption back to Setnayan via a simple webhook or end-of-event reconciliation report.
- **Attribution data flows back to Setnayan.** End-of-event: fair organizer sends Setnayan a redemption report (Setnayan-attributed vendor bookings + couple registrations). Setnayan logs against the fair record for future negotiation leverage.
- **Codes expire** at the fair's start date. One code per user per fair; codes are non-transferable.
- **No money flows between Setnayan and the fair organizer in Model A.** The discount is the fair's customer-acquisition expense; Setnayan is paid in funnel attribution + brand exposure + free booth + sponsor billing.

#### Open decisions for the owner / Cowork session

Items the framework intentionally doesn't lock — they need owner-side judgment:

1. **Vendor discount percentage range (10–15%) — narrow to a single number** (e.g., 12%) or keep tiered by fair size?
2. **Customer perk type** — pick one default (welcome kit, fast-track, giveaway) or leave organizer-choice in every contract?
3. **Model B cash tiers — actual numbers** validated against real PH fair operator conversations.
4. **Eligibility criteria** — should small / unverified fair organizers qualify, or is there a minimum threshold (e.g., 20+ vendor booths, 500+ expected couple attendance)?
5. **Exclusivity** — can Setnayan boost competing fairs in the same city in the same month, or is there a geographic / temporal exclusivity window?
6. **Cap on free Model A deals per quarter** — Setnayan's on-site staffing has a real cost; should there be a limit before Model B kicks in even if Setnayan technically lacks audience leverage?
