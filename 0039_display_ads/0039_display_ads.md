# Iteration 0039 — Display Ads (Third-party)

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - **RETIRED (confirmed) + NOT BUILT.** This iteration was retired 2026-05-19 (AdSense enrollment blocked for the owner's Google account) and nothing shipped: no AdSense integration, no `/cookie-preferences` route, no site-wide cookie-consent banner, no `cookie_consent_events` / `adsense_activation_log` / `adsense_daily_revenue` tables. Do not implement.
> - RA 10173 consent in V1 is satisfied by first-party PostHog opt-out only (no third-party ad trackers fire), so the elaborate 3-category cookie-consent layer described below is not needed and was not built.
> - The 0023 admin "ads on/off kill-switch" and the `/vendors/[slug]` vendor ad opt-out toggle referenced here do not exist in code.
> - No SKU/price/commission impact (this surface generated no revenue and 0% commission is the platform-wide rule regardless).
>
> When this body disagrees with the above, **the above wins.**

> **🚫 RETIRED 2026-05-19.** This iteration is no longer in scope. AdSense enrollment is blocked for the Setnayan owner's Google account: AdSense-for-YouTube was auto-deactivated due to YouTube channel inactivity, and the account is locked to AdSense-for-YouTube only (no AdSense-for-Content enrollment path forward). Creating a fresh Google account to circumvent the block carries a high risk of permanent ban via Google's duplicate-AdSense identity checks. Path A (drop display ads entirely from V1.1) chosen — yield was already ~₱5-20K/mo at 100K pageviews vs Boosted Ads ~₱780K/yr per 20km vendor, so the brand-risk vs revenue trade-off no longer favors keeping this surface. Cookie-consent banner scope dropped from V1.1 (no third-party trackers means RA 10173 first-party PostHog opt-out is sufficient). Full retirement context: CLAUDE.md decision-log ninth 2026-05-19 row. **Do not implement.** Folder + spec kept as a tombstone for future reference; if a different ad-network path opens (Ezoic, direct AdSense via incorporated entity, etc.) a new iteration number replaces this one.

---

**Iteration number:** 0039
**Topic:** Third-party display advertising (Google AdSense as V1.1 single network) running on **public, pre-purchase setnayan.com surfaces only**. Requires a site-wide RA 10173-compliant cookie-consent layer (new system surface). **Owner brand-risk sign-off required at activation** — this iteration ships in code as ✅ but flips ON only after explicit owner go-ahead.
**Surface:** Marketing site (`setnayan.com`, `setnayan.com/about`, `setnayan.com/pricing`, `setnayan.com/help/*` per § 3 inclusion list), `/blog` article pages + `/recommendations` category pages (from 0038), vendor landing pages (`setnayan.com/vendors/[slug]`), marketplace discovery (`setnayan.com/vendors` filter results). Plus a new site-wide **Cookie Consent Banner** (first-party consent management).
**URL pattern:** N/A — overlays existing routes. Settings surface for users to manage consent lives at `setnayan.com/cookie-preferences` and inside `0025` Profile Settings § Privacy & Data.
**Builds on:** 0015 (marketing site shell — where the consent banner mounts), 0022 (Boosted Ads guardrail coordination), 0023 (admin console — consent-event audit log + ads on/off toggle), 0025 (Profile Settings — user-side consent management), 0028 (cookie-consent-policy email confirmation), 0035 (PostHog — opt-out couples with display-ads opt-out per RA 10173 posture), 0038 (Editorial — sponsored articles + sponsored newsletter slots are AdSense-excluded), 0029 (Help Center — new "Cookies & ads" article).
**Status:** Drafted 2026-05-19.
**Phase:** V1.1 monetization expansion · **gated on owner brand-risk sign-off + cookie-consent layer + AdSense publisher account approval**. Engineering can build the layer in V1.1 but activation is a separate explicit go.

---

## 1. Why this iteration exists — and the trade-off owner has signed off on

setnayan.com receives long-tail SEO traffic from couples Googling general planning + vendor-discovery queries. This iteration monetizes that pre-purchase browsing via third-party display ads (Google AdSense), in addition to the first-party Boosted Ads + Sponsored Boost flow (0022) and the editorial / sponsored / affiliate revenue (0038).

**Owner-acknowledged trade-off (decision-log row 2026-05-19):**
- Philippine AdSense CPMs are low (~$0.50–$2 → roughly ₱5–20K/month at 100K monthly pageviews). The yield is **two orders of magnitude lower** than one Sponsored Boost annual sale (₱799,999/yr per vendor).
- Running ads on vendor landing pages introduces a real risk of cheapening the marketplace (the same surface where Boosted Ads vendors paid for prime placement).
- The trade-off was made with eyes open: owner picked "all public pages" with the bleed-into-vendor-surfaces tension flagged.

This spec mitigates the trade-off by encoding strict guardrails (§ 4) — frequency caps, topic exclusions, vendor opt-out — rather than running raw AdSense.

**Why this iteration is gated on a separate owner sign-off:**

Even with guardrails, display ads are a one-way door on brand perception. A premium Filipino wedding platform charging ₱9,999/yr to vendors and ₱2,499–₱4,999 to couples for in-app SKUs cannot un-cheapen itself after the first time a couple sees a cheap "lose belly fat" ad on a vendor's profile. The activation toggle in 0023 (§ 5) is the kill-switch — engineering can ship the code; owner flips it ON.

---

## 2. The cookie-consent layer (RA 10173 — new site-wide surface)

AdSense's behavioural-ads variant drops third-party cookies on every visitor. RA 10173 (Data Privacy Act of 2012) + the NPC's 2023 Cookie Advisory require:

- Active, informed, freely-given consent before non-essential cookies fire
- Clear notice of which third parties receive data
- Per-category granularity (couple can accept "essential" but reject "advertising")
- Easy revocation at any time

### 2.1 Banner UX

First-visit visitor lands on any `setnayan.com/*` page → cookie banner slides up from the bottom of the viewport. Banner content:

- Headline: "Cookies on Setnayan"
- Body: ~50 words explaining categories
- Three buttons: **Accept all** · **Reject non-essential** · **Customize**
- Link to `setnayan.com/cookie-preferences` (full settings page) + link to privacy policy

Banner is **non-blocking** (visitor can read the page through it; banner sits at the bottom edge, not over the content). Dismissing by scrolling does NOT count as consent. The banner only closes on an explicit button click.

### 2.2 Three cookie categories

| Key | Label | Essential? | Cookies in this bucket |
|---|---|---|---|
| `essential` | Essential | Yes — always on | Session cookie, CSRF token, locale preference, cart state |
| `analytics` | Analytics (Setnayan PostHog) | No — opt-in | PostHog session cookie. First-party. Aggregate-only. |
| `advertising` | Advertising (Google AdSense) | No — opt-in | AdSense + Google personalization cookies. Third-party. |

`analytics` is opt-in **but** PostHog already defaults to opt-out for session-recording per 0035; what this banner adds is event-tracking consent. `advertising` is strictly opt-in — no AdSense fires for visitors who haven't ticked `advertising = yes`.

### 2.3 Consent storage

Banner choice persists for 12 months in a first-party cookie `sn_consent_v1` (HttpOnly: false because client JS needs to read it). Re-prompt on:
- 12 months elapsed since prior consent
- Privacy policy material change (versioned policy ID stored in cookie; mismatch triggers re-prompt)
- Manual reset via `setnayan.com/cookie-preferences`

For **authenticated users**, the banner answer is also written to the `users.consent_state` JSONB column for cross-device + cross-browser consistency. Server-side rendering reads the column when known, falls back to cookie for anonymous visitors.

### 2.4 No-AdSense conditions (server-side guard)

The page-level `data-adsense` attribute renders OFF when ANY of the following is true:

1. Visitor has not consented to `advertising` category (cookie or `users.consent_state.advertising != 'accepted'`)
2. Page-type is on the exclusion list (§ 3.2 below)
3. Vendor profile + vendor toggled their "Display ads on my profile" OFF (0038 § 8.2)
4. Article has `is_paid_placement = TRUE` (0038 § 8.1)
5. Sponsored newsletter slot or sponsored landing page

The AdSense loader script never even fetches the SDK when `data-adsense="off"`. No "loaded but hidden" — outright not loaded.

---

## 3. Surface inclusion / exclusion matrix

### 3.1 Surfaces that DO carry AdSense (V1.1)

| Surface | Pattern | Max units per page | Position | Topic filter |
|---|---|---|---|---|
| Marketing-site homepage | `setnayan.com/` | 1 | Below-the-fold (after testimonial section, before footer) | Wedding/event categories ALLOWED (Setnayan can compete here) |
| Marketing-site about / pricing / etc. | `setnayan.com/about`, `/pricing`, `/why-setnayan`, `/team`, `/press` | 1 | Below-the-fold | Wedding/event categories ALLOWED |
| Help center articles | `setnayan.com/help/[role]/[section]/[slug]` | 1 | After article body, before "Related articles" | Wedding/event categories EXCLUDED (help articles route to a Setnayan answer; ad should not redirect) |
| Editorial articles (non-sponsored) | `setnayan.com/blog/[slug]` (where `is_paid_placement = FALSE`) | 1 | After article body | Wedding/event categories EXCLUDED on editorial; we don't want competitor ads inside our own editorial |
| Recommendation category pages | `setnayan.com/recommendations/[category]` | 1 | After last pick card | Wedding/event categories EXCLUDED (we're recommending a curated set; we don't want a competing ad in-page) |
| Marketplace discovery | `setnayan.com/vendors` (filter results) | 1 | After the 6th vendor card, in-line | Wedding/event categories EXCLUDED (we're selling vendor placement here; competitor ads here actively undermine Boosted Ads) |
| Vendor landing pages | `setnayan.com/vendors/[slug]` | 1 max, below-the-fold (after services + reviews) | Bottom of page, before footer | Wedding/event categories EXCLUDED + the vendor's own category EXCLUDED (no competitor ads on a vendor's own profile) |

### 3.2 Surfaces that NEVER carry AdSense (hard-coded exclusion)

| Surface | Why |
|---|---|
| Any logged-in dashboard route (`/dashboard/**`) | Paid product; ads cheapen the surface couples + vendors + admins paid for |
| Guest landing pages (`setnayan.com/[couple-slug]`) | Guests shared address + dietary + RSVP data privately to the couple. Ads = brand suicide. Also includes Phase 4 Public Summary pages per 0002. |
| Day-of guest experience (`/[couple-slug]?day_of=true` per 0031) | Sacred to the couple's live event |
| Sponsored content articles (`is_paid_placement = TRUE`) | Sponsor paid for the page |
| Sponsored newsletter slots | Sponsor paid for the slot |
| Checkout flow (`/checkout`, `/checkout/[order_id]`) | Conversion-focused page; ads kill funnel performance |
| Help-center contact form (`setnayan.com/help/contact`) | High-intent support surface; ads degrade trust |
| Cookie-preferences page (`/cookie-preferences`) | Self-evidently wrong to monetize the consent surface |
| 4xx / 5xx error pages | Frustrated user; do not monetize frustration |
| Vendor verification application pages | Sensitive doc-upload flow |

### 3.3 Hard guardrails (apply across every including surface)

- **Max 1 AdSense unit per page.** Hard-coded in the ads-loader. No page renders 2.
- **Below-the-fold on EVERY surface — not just vendor landing.** No above-the-fold AdSense placement anywhere. The first viewport on every page is 100% Setnayan content. Owner directive 2026-05-19: "non-invasive · stay clean on the app."
- **Topic exclusion list applied at AdSense publisher-account level.** Categories: Weddings, Wedding planning, Wedding services, Wedding photography, Wedding catering, Bridal gowns, Wedding venues, etc. Full list maintained in `apps/web/lib/ads/excluded_topics.ts`.
- **Sensitive-category exclusion applied at AdSense publisher-account level.** Categories: Gambling, Politics, Religion, Dating, "Get rich quick", Weight loss, Cosmetic surgery. Per AdSense category controls.
- **No AdSense Auto Ads.** Manual-placement only (Auto Ads ignores our placement rules + frequency caps).
- **No interstitials, no full-screen ads, no anchor ads, no sticky/floating ads, no slide-ins, no popups.** Display-only.
- **No interest-based personalization for visitors who chose `Reject non-essential`.** Loader passes `npa=1` (non-personalized ads) signal to AdSense in that case.

### 3.3a Non-invasive design tenets (owner-directed 2026-05-19 — non-negotiable)

These tenets layer on top of § 3.3. They translate "stay clean on the app" into encodable rules so future engineering cannot drift toward aggressive ad UX without an explicit owner override + decision-log row.

| # | Tenet | How it's enforced |
|---|---|---|
| 1 | **Static media only — no animation, no video, no audio.** No GIFs, no auto-play video, no expanding/rich-media units. Image + text only. | AdSense publisher console: disable Video Ads, disable Animated GIF Ads, allow only Image + Text formats. Enforced at the AdSense unit-type level, not page-level. |
| 2 | **Default to non-personalized ads (NPA) for EVERYONE — even visitors who clicked "Accept all".** Setnayan does not behavioural-retarget; we only show contextual ads inferred from page content. | The 0039 ads loader passes `npa=1` to AdSense unconditionally in V1.1. Behavioural personalization is a separate later decision (would require a new decision-log row + Privacy Policy update). |
| 3 | **Restricted unit sizes only.** Allowed: 300×250 (medium rectangle) on mobile, 728×90 (leaderboard) on tablet/desktop, 336×280 (large rectangle) on desktop article pages only. Forbidden: 970×250 (billboard), 300×600 (half-page skyscraper), 320×100 (large mobile banner), 970×90 (large leaderboard). | Hard-coded in `apps/web/lib/ads/sizes.ts`. The loader rejects any AdSense response that returns a forbidden size and renders an empty unit instead. |
| 4 | **Lazy-load — units only mount when scrolled into view.** Prevents AdSense from loading on visits that don't reach the ad position. Cleaner first-paint, lower CLS, lower spend on impressions that won't be seen. | `IntersectionObserver` triggers the AdSense `<script>` mount at `rootMargin: 0px 0px 200px 0px` (200px below the fold). Verified in 0039 acceptance test #17 (new). |
| 5 | **"Advertisement" microcopy label above every unit.** 11px, neutral-gray, non-clickable. Sets visitor expectation; honest signal. | Loader wraps every AdSense slot in a `<figure>` with `<figcaption>Advertisement</figcaption>` above the iframe. CSS lives in the design-system tokens, not inline. |
| 6 | **Quiet container styling.** 1px solid `var(--border-subtle)` border, 12px outer padding, 16px margin top + bottom against surrounding content. No drop shadow, no accent color, no animated hover state. Visually clearly "ad" but never "loud". | Set in `apps/web/styles/ads.css` as a single class `.ad-unit`. Designers cannot override per page; the loader applies the class. |
| 7 | **Generous whitespace — never crowd content.** Min 48px vertical breathing room between Setnayan content and the ad unit on every surface. Computed in CSS via `margin-block: clamp(48px, 8vh, 96px)`. | Page templates set this margin; ad loader does not allow tighter spacing even if a page tries. |
| 8 | **No ad in the first viewport.** Tenet 1 of "below-the-fold on EVERY surface" — encoded via a minimum-distance check: ad mounts at least `100vh` from the page top. Even short pages (404 errors, etc., though those are excluded anyway) cannot place an ad in the first screen. | Computed at mount-time in the loader. |
| 9 | **Visitor-side dismissibility on each unit.** Small "×" affordance top-right of each ad container. Dismissing hides the unit for the rest of the session (cookie `sn_ad_dismissed_v1` tracks dismissed slot-IDs). Persists per visitor session, not per page-load. | Loader injects the dismiss control. Click stores slot-ID + timestamp in the cookie. Re-load skips slots in the dismissed list for 24 hours. |
| 10 | **Page-load weight cap.** Total ad-loader JS payload (including AdSense SDK) must stay under 80KB gzipped on first-paint. Lazy-load (tenet 4) keeps the SDK out of first-paint entirely. | Bundle-size budget enforced in CI via `apps/web/bundle.config.ts`. Any PR raising the ad-loader budget fails the build and requires explicit owner sign-off + decision-log row. |
| 11 | **One ad per page — even when the page is very long.** No "second ad at 2,000 words" pattern even on long-form editorial. Long articles get exactly one ad, same below-the-fold position as short articles. | Tenet 1 of § 3.3 already encodes this; restated here for the tenet inventory. |
| 12 | **Quarterly visual audit by owner.** Owner reviews live ad placements on 5 random article pages + 5 random vendor pages + 3 marketing pages once per quarter. Any unit that feels "off-brand" gets logged in `09_Operations/Ads_Visual_Audit_Log.md` and triggers either a topic-block update OR a placement adjustment within 48 hours. | Manual review, logged. Not engineering-enforced. |
| 13 | **Affiliate recommendation cards (0038) NEVER styled as ads.** Recommendation cards in `/recommendations/[category]` use the standard editorial card pattern from `/blog`. Different from the AdSense `.ad-unit` class entirely. Disclosure microcopy is a 12px gray line beneath the CTA — visible but not heavy-handed. | Set in 0038 spec. Cross-referenced here so engineering keeps the visual systems distinct. |
| 14 | **Audit-resistant kill-switch.** If owner ever decides ads are degrading the brand even with all these tenets, the 0023 § 5.1 activation toggle flips OFF and ALL of the above becomes moot. Migration plan documented in § 12. | Already specced. Restated here as the "ultimate clean" guarantee. |

---

## 4. Vendor-side coordination (extends 0022)

### 4.1 "Display ads on my profile" toggle

New control in 0022 Vendor Dashboard → Settings → Marketplace presence. Per-vendor opt-out for AdSense on `setnayan.com/vendors/[their-slug]`.

| Vendor tier | Default state |
|---|---|
| Verified Boosted Ads or Sponsored Boost vendor | OFF (no AdSense on their profile by default — protects their paid placement) |
| Verified (no marketing tier) | ON (AdSense renders below-the-fold) |
| Coming-soon (unverified) | ON (locked; cannot opt out — these vendors have not paid for tier perks) |

Vendor can flip the toggle from OFF→ON or ON→OFF (within the per-tier allowed range) at any time. Change applies on next page render (cache busted on toggle).

### 4.2 Sales objection neutralizer

When a vendor is purchasing Boosted Ads or Sponsored Boost via 0022 § 5b, the purchase flow surfaces a confirmation line: "Your profile is AdSense-free while this placement is active." Hardcoded into the upsell modal. Removes the "why am I paying when there are ads on my own page" objection up front.

---

## 5. Admin controls (extends 0023)

New section in 0023 Admin Console: **Ads & Consent** (inserted after "Editorial", before "Funnels"). Three sub-tabs:

### 5.1 Activation kill-switch

- Single toggle: "AdSense activation — globally [ON / OFF]"
- Default OFF on first deploy (engineering ships the system, owner flips it)
- Toggle requires two-admin approval per 0023 § 9.1 (this is a major decision)
- Audit log: every state change recorded with `(toggled_by_admin_id, toggled_at, from_state, to_state, reason_text)`
- When OFF: `data-adsense` is forced `off` site-wide regardless of all other guards
- When ON: per-surface inclusion + per-visitor consent + per-vendor opt-out logic in §§ 2-4 controls actual rendering

### 5.2 Consent state metrics

- Aggregate: % visitors who saw the banner · % who Accept-All · % who Reject non-essential · % who Customize
- Trend lines (30 / 60 / 90 day windows)
- Geo cut: PH vs non-PH visitors
- No per-visitor PII surfaced (consent state is aggregate-only in this view)

### 5.3 Revenue + complaints

- AdSense revenue (read-only) — pulled via the AdSense Management API into a daily cron, surfaced as a chart in this tab
- Complaint queue: any ticket from 0029 Help Center with category = "Ads / Cookies" lands here for prioritized handling

---

## 6. Schema additions

```sql
-- 6.1 Per-user consent state (server-of-record for logged-in users)
ALTER TABLE users
  ADD COLUMN consent_state jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN consent_recorded_at timestamptz,
  ADD COLUMN consent_policy_version text;
-- Example state: {"essential": "accepted", "analytics": "accepted", "advertising": "rejected"}

-- 6.2 Anonymous-visitor consent audit log (sampled, no PII)
CREATE TABLE cookie_consent_events (
  event_id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid REFERENCES users (user_id),  -- nullable: anonymous OK
  session_id_hash       text NOT NULL,                     -- one-way hash, no PII
  consent_decision      text NOT NULL CHECK (consent_decision IN ('accept_all','reject_non_essential','custom')),
  custom_payload        jsonb,                             -- only when decision = 'custom'
  policy_version        text NOT NULL,
  recorded_at           timestamptz NOT NULL DEFAULT now(),
  ip_country            text                               -- country-level only, no city or IP
);

CREATE INDEX cookie_consent_events_recorded_idx ON cookie_consent_events (recorded_at DESC);
CREATE INDEX cookie_consent_events_decision_idx ON cookie_consent_events (consent_decision, recorded_at DESC);

-- 6.3 Admin activation log
CREATE TABLE adsense_activation_log (
  log_id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  toggled_by_admin_id   uuid NOT NULL REFERENCES users (user_id),
  approved_by_admin_id  uuid REFERENCES users (user_id),    -- two-admin approval per § 9.1
  from_state            boolean NOT NULL,
  to_state              boolean NOT NULL,
  reason_text           text NOT NULL,
  toggled_at            timestamptz NOT NULL DEFAULT now()
);

-- 6.4 Daily revenue aggregate (cron-populated from AdSense Management API)
CREATE TABLE adsense_daily_revenue (
  revenue_date          date PRIMARY KEY,
  earnings_centavos     bigint NOT NULL,
  impressions           bigint NOT NULL,
  clicks                bigint NOT NULL,
  fetched_at            timestamptz NOT NULL DEFAULT now()
);

-- 6.5 Vendor profile ad-opt-out (ALTER existing vendors table)
ALTER TABLE vendors
  ADD COLUMN display_ads_on_profile boolean NOT NULL DEFAULT TRUE;
-- Trigger sets DEFAULT to FALSE for Boosted Ads + Sponsored Boost active subscriptions
```

---

## 7. Content Security Policy (CSP) changes

AdSense requires script + frame sources. Update `apps/web/middleware.ts` CSP header:

```
script-src 'self' 'unsafe-inline'
  https://pagead2.googlesyndication.com
  https://googleads.g.doubleclick.net
  https://www.googletagservices.com;
frame-src 'self'
  https://googleads.g.doubleclick.net
  https://tpc.googlesyndication.com;
img-src 'self' data: blob:
  https://pagead2.googlesyndication.com
  https://*.googleusercontent.com;
connect-src 'self'
  https://pagead2.googlesyndication.com
  https://googleads.g.doubleclick.net;
```

Keep CSP `default-src 'self'` everywhere else. AdSense's `unsafe-inline` requirement on `script-src` is a known limitation — we accept it for V1.1 in exchange for AdSense functionality.

---

## 8. Owner-side checklist before activation

Engineering ships the layer ⛔ blocked. Activation requires:

1. **AdSense publisher account approval.** Owner signs up at `https://www.google.com/adsense`. Site review (~1-2 weeks). Likely needs 30+ pages of content (editorial articles from 0038 satisfy this; without 0038 content there's no AdSense application to make).
2. **Topic exclusion list configured in AdSense publisher console.** Manually applied via the AdSense category-blocking UI per the list in `apps/web/lib/ads/excluded_topics.ts`.
3. **Sensitive-category blocking applied in AdSense publisher console.** Manually applied per § 3.3.
4. **Privacy policy updated.** `01_Contracts/Setnayan_Privacy_and_Security_Policy.md` adds an "Advertising cookies" section pointing to the cookie-preferences page + lists AdSense as a third-party processor. NPC registration filings updated.
5. **Brand-risk sign-off.** Owner explicitly confirms in CLAUDE.md decision log (separate entry on the activation date) that they have reviewed the surfaced revenue projection vs the brand-risk and approve flipping the switch.
6. **Two-admin approval in 0023 § 5.1 activation kill-switch.** Required by 0023 § 9.1 — display-ad activation is a major decision.

---

## 9. Acceptance tests

| # | Test | Pass criteria |
|---|---|---|
| 1 | First-visit visitor sees the cookie banner | Anonymous request to `/` from a fresh browser shows the cookie banner. Banner is sticky to the bottom edge, non-blocking. |
| 2 | Banner does NOT close on scroll | Scrolling the page does not dismiss the banner. Only button click does. |
| 3 | "Reject non-essential" suppresses AdSense | After clicking "Reject non-essential", visitor reloads the page; `data-adsense` is `off` and no AdSense script is fetched (verify in network panel). |
| 4 | "Accept all" enables AdSense + PostHog | After clicking "Accept all", visitor reloads and AdSense + PostHog scripts both load. `sn_consent_v1` cookie stored with both categories `accepted`. |
| 5 | Logged-in user consent reads from `users.consent_state` | Authenticated user A logs out, logs in from a different browser; their previously-set consent persists from `users.consent_state` (no banner re-prompt). |
| 6 | Policy-version change triggers re-prompt | When `Setnayan_Privacy_and_Security_Policy` major version increments, the cookie's policy_version mismatches; banner re-prompts the visitor. |
| 7 | Logged-in dashboard route never carries AdSense | Visiting `/dashboard/[anything]` while consented to `advertising` still does not load AdSense. `data-adsense="off"` confirmed. |
| 8 | Guest landing page never carries AdSense | Visiting `setnayan.com/maria-and-juan` (any couple slug) does not load AdSense regardless of consent. |
| 9 | Vendor opt-out suppresses AdSense on their profile | A vendor toggling OFF in 0022 settings → AdSense removed from `/vendors/their-slug` on next request. |
| 10 | Boosted Ads / Sponsored Boost vendor default OFF | A vendor purchasing Boosted Ads → `display_ads_on_profile` is auto-set to FALSE; profile is AdSense-free. |
| 11 | Sponsored article never carries AdSense | An editorial article with `is_paid_placement = TRUE` does not load AdSense regardless of consent. |
| 12 | Topic exclusion blocks wedding ads on vendor profile | Manual test: load a vendor profile while consented; AdSense unit renders BUT does not show a wedding-category ad (verify via AdSense category preview in publisher console). |
| 13 | Auto Ads is disabled | Page source contains the AdSense snippet with `data-ad-format="auto"` set to NOT auto, manual placement only. AdSense publisher console "Auto Ads" toggle is OFF for setnayan.com. |
| 14 | Two-admin gate on activation toggle | Admin A flips the kill-switch from OFF → ON; toggle stays in pending until Admin B confirms in 0023 § 9.1 approval queue. |
| 15 | Anonymous consent audit log writes country-only | Inspecting any `cookie_consent_events` row: `ip_country` is a 2-letter ISO code, NOT a full IP. No city, no precise location. |
| 16 | Daily revenue cron populates `adsense_daily_revenue` | Cron job at 02:00 PH runs AdSense Management API; `adsense_daily_revenue` row exists for the previous date with non-null earnings, impressions, clicks. |
| 17 | Lazy-load: ad does not fetch until in viewport (tenet 4) | Network panel on initial page load shows no request to `pagead2.googlesyndication.com`. Scrolling to within 200px of the ad slot triggers the SDK fetch. |
| 18 | Forbidden ad sizes rejected (tenet 3) | Mock an AdSense response returning a 970×250 billboard; loader logs warning, renders empty unit, does NOT mount the iframe. Only 300×250 / 728×90 / 336×280 are accepted. |
| 19 | "Advertisement" label always renders above each unit (tenet 5) | Every page with an ad unit has a `<figcaption>Advertisement</figcaption>` immediately preceding the iframe. Removing it via DOM injection does NOT bypass — the loader re-inserts it on mount. |
| 20 | Non-personalized ads even on Accept-All (tenet 2) | All AdSense requests in the network panel show `npa=1` parameter regardless of the visitor's consent choice in V1.1. |
| 21 | Static media only — no video / no animation (tenet 1) | AdSense publisher console "Allowed ad types" inspection shows: Image + Text enabled; Video + Animated GIF + Rich media all disabled. |
| 22 | Page-load weight cap enforced (tenet 10) | CI build fails if the ads-loader bundle exceeds 80KB gzipped. Verified via `apps/web/bundle.config.ts` budget assertion. |
| 23 | Visitor-side dismiss works for the rest of session (tenet 9) | Visitor clicks "×" on an ad unit; reloading the page within 24h does not render that slot again. Cookie `sn_ad_dismissed_v1` carries the slot-ID list. |

---

## 10. Out of scope for V1.1

- Mediavine / Raptive / Ezoic / AdThrive — V1.5+ candidate if AdSense yield is unsatisfactory (some require min 50K monthly sessions to apply anyway)
- Direct ad sales via own salesforce / DSP integration — out of scope; revisit at V2 when Setnayan has a sales team capable of running direct deals
- Programmatic open-exchange ads (OpenX, Magnite) — explicitly out of policy
- Native-ads / in-feed ads / advertorial recommendations from third-party (Outbrain, Taboola) — out of policy, low quality, brand-corrosive
- Auto Ads / Anchor Ads / Interstitial Ads / Vignette Ads — explicitly disabled
- Display ads on the native iOS / Android app shells (Papic, etc.) — V1.5+ apps don't ship with ads
- Display ads on the desktop app (`apps/desktop`) — out of policy
- Bidding A/B between AdSense + an alternate network — V1.5+ candidate after we know AdSense baseline yield
- Re-targeting (showing setnayan.com visitors a Setnayan ad on other Google-network sites) — separate iteration, not part of 0039

---

## 11. Engineering hand-off (deferred to engineering worktree)

- Schema migrations: `users.consent_state` + `users.consent_recorded_at` + `users.consent_policy_version` ALTERs; `cookie_consent_events` + `adsense_activation_log` + `adsense_daily_revenue` tables; `vendors.display_ads_on_profile` ALTER
- New library: `apps/web/lib/ads/` (loader, excluded_topics list, surface-inclusion map, vendor-opt-out resolver)
- New library: `apps/web/lib/consent/` (banner component, consent-state hook, server-side resolver)
- New route: `/cookie-preferences` (full settings page)
- New route: `/api/consent/record` (POST) — writes to `cookie_consent_events` + `users.consent_state` (if authenticated)
- 0025 Profile Settings → Privacy & Data tab: add "Cookie preferences" link → `/cookie-preferences`
- 0023 Admin Console → new "Ads & Consent" tab + 3 sub-tabs per § 5
- 0022 Vendor Dashboard → Settings → Marketplace presence: add "Display ads on my profile" toggle
- 0028 Email: confirmation email when a user toggles `advertising` consent (template `consent_updated`)
- 0029 Help Center: new article "Cookies & ads on Setnayan" (drafted by editorial, lives in 0038's article system)
- CSP middleware update per § 7
- Cron: daily AdSense Management API pull at 02:00 PH

---

## 12. Migration off — kill switch

If brand-risk feedback after activation goes south, the kill-switch path is:

1. Admin in 0023 § 5.1 flips activation OFF (two-admin gate per § 9.1)
2. `data-adsense="off"` site-wide on next request
3. AdSense Management API stops pulling new revenue rows (cron checks the kill-switch flag)
4. CSP changes from § 7 remain (no AdSense activity, but no engineering revert needed)
5. AdSense publisher account remains, can be re-activated later or formally closed via Google's process

There is no "data to revert" beyond the off-state — all consent state and audit logs remain intact for compliance + analytical purposes.

---

**End of 0039 spec.**
