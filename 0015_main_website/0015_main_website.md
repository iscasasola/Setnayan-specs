# Iteration 0015 — Setnayan Main Marketing Website

**Iteration number:** 0015
**Topic:** The public marketing website at `setnayan.com` (working) / `setnayan.com` (current). The single site that introduces Setnayan to couples, event creators, and vendors before they sign up.
**Surface:** Public web — desktop + mobile responsive. NOT the dashboard app.
**URL pattern:** `setnayan.com/` (root), `/about`, `/features`, `/for-vendors`, `/for-event-creators`, `/coverage`, `/register-vendor`, `/apply`, `/legal/*`. Coexists with the dashboard at `/dashboard/*` from 0000.
**Builds on:** 0013 (platform stack), 0000 (auth + apply flow), 0006 (vendor schema), 0014 (PHP-only billing rail).
**Status:** Re-drafted 2026-05-11 (this turn) — supersedes 2026-05-09 first draft.
**Phase:** V1 launch-blocking. Couples and vendors can't find Setnayan without a homepage.

---

## What this iteration ships

The marketing site at the root of `setnayan.com`. Built in the same Next.js codebase as the app — public pages live under `app/(marketing)/...` route group; dashboard pages stay under `app/dashboard/...` per 0000.

Twelve sections on the homepage, in order:

1. **Announcement bar** — "Now accepting vendors — free registration during launch."
2. **Hero (three-question framing)** — "Planning an event? / Looking for vendors? / A vendor looking for customers?" with brand-reveal eyebrow + single primary + ghost secondary CTAs
3. **Real numbers (count-gated)** — stats appear when 100+ vendors / 25+ events / 1,000+ couples / 5+ cities thresholds met; muted single-line placeholder pre-threshold
4. **The chaos we're fixing** — scattered-tools problem framing
5. **Built for both sides of the celebration** — two-column "Why Setnayan" block (six couple beats + six vendor beats)
6. **Maria & Juan: see how it works** — live dashboard preview + four-tab product walkthrough (folds in former Section 4 content)
7. **In-app services** — apparatus catalog (Papic, Panood, Pamahiya, Pakulay, Pailaw, Pareto, Custom Monogram) — features only, no prices
8. **Vendor compatibility & verification** — how vendors plug in, Setnayan Team verification flow
9. **Event-type readiness board** — Wedding LIVE; others tracked; swaps to social proof at T+90 days post-launch
10. **PH coverage map** — city-level pins (never barangay public)
11. **Dual CTA conversion module + brand-origin footer** — single primary apply (couples) + ghost vendor secondary; "Set na 'yan." brand-reveal payoff lands here
12. **Available everywhere you plan** — hide-until-live tiles (Web at V1 launch; native tiles materialize per store URL — revised 2026-05-15)

Plus marketing-site chrome: header with the persistent split-hero toggle echo, footer with company info + legal + social, SEO meta + sitemap.

The marketing site is **publicly accessible** — no authentication required. All data shown is anonymized + aggregated per the privacy rules (Section "Privacy invariants" below).

---

## Downstream iteration consumed by 0015 marketing copy: 0019 Communications

The vendor-side hero, vendor perks list ("In-app chat & video meetings"), and ops section ("you can pull a coordinator into a vendor chat") all pre-promise capabilities that ship in a downstream iteration:

- **0019 Communications** (queued) — In-app text chat between couples ↔ vendors, with coordinators able to be invited into existing threads. In-app video meetings (1:1 or group) attached to those same threads. Coordinator role gets per-thread join permission granted by either party.

This iteration is forward-referenced from 0015 marketing copy because the value-prop story for the vendor side leans on it. **The iteration is not yet drafted as a folder** — it's queued in CLAUDE.md's iteration ledger. When it's drafted, the marketing site copy already maps to its surfaces; no rework needed.

If 0019 ends up materially different from what's promised on the marketing site, the marketing copy must be revised in lockstep with the iteration draft.

---

## Brand: SETNAYAN

- **Wordmark:** **SETNAYAN** — full word, spelled out. Earlier STNYN consonant-only stylization (working candidate 2026-05-11) retired in favor of the full spelling — more legible, more obviously Filipino in voice, holds up better at small sizes (favicon, vendor badge). Brand-rename decision logged 2026-05-12.
- **Spoken / full name:** **Setnayan** (SET-na-yan)
- **Origin:** "Set na 'yan." — Tagalog for "that's all set" / "it's sorted." The outcome the platform delivers when an event is fully wired up.
- **Domain target:** `setnayan.com` and `setnayan.ph`
- **Tagline (homepage hero):** "Set na 'yan. — Every part of your event, in one place."
- **Symbol mark:** custom monogram glyph at `setnayan_logo.svg` (uploaded 2026-05-12). A vertical pin/teardrop form, single-color black, scales cleanly from favicon size to billboard. Standalone mark for app icons, favicons, vendor badges, and avatar contexts where the wordmark is too wide.
- **Wordmark + symbol lockups:**
  - `setnayan_logo.svg` — symbol mark solo (favicon, app icon, social avatar)
  - Horizontal lockup — symbol left + SETNAYAN wordmark right · primary header use
  - Vertical lockup — symbol stacked above SETNAYAN wordmark · primary social-post use
  - Stamp variant — circular badge with mark inscribed (future asset)
  - Monochrome variant — single-color silhouette for vinyl, embroidery, monochrome print (future asset)
- **Strapline:** "SET NA 'YAN · BOOK EVERY LIFE EVENT" — pairs the brand-origin phrase with the universal-platform promise.
- **Brand transition:** The site uses SETNAYAN as the wordmark, "Setnayan" as the spoken name in body copy. Existing in-product strings still say "Setnayan" until a coordinated rebrand cutover. The site footer reads "SETNAYAN" for the first 90 days post-launch to bridge.
- **Reversibility:** All brand strings live in a single `brand.config.ts` file. Flipping back to "Setnayan" is one PR.
- **Logo assets:** `setnayan_logo.svg` co-located in this iteration folder; embedded inline into the HTML mockup. Earlier `0015_stnyn_logo.svg` / `0015_stnyn_logo_mono.svg` / `0015_stnyn_logo_stamp.svg` retained as reference for the retired STNYN direction.

---

## One app, three role-routed entries

**Locked architecture decision (2026-05-11):** Setnayan is **one app**. There is no separate vendor app, no separate admin console, no separate vendor surface supplier app. Every user — couple / event-creator, vendor, admin — opens `setnayan.com`, logs in once, and the app jumps them to the right surface based on their account's `member_type`.

```
            ┌──────────────────────┐
            │   setnayan.com/login │
            └──────────┬───────────┘
                       │
            ┌──────────▼───────────┐
            │   role router (0000) │
            └──┬─────────┬─────────┘
               │         │         │
        ┌──────▼──┐ ┌────▼────┐ ┌──▼──────┐
        │ Customer│ │ Vendor  │ │ Admin   │
        │ surfaces│ │ surfaces│ │ console │
        └─────────┘ └─────────┘ └─────────┘
```

- `users.account_type` ∈ `{customer, vendor, admin}` — the primary jump signal (extends the existing 0000 `event_members.member_type` model to top-level).
- A user with multiple roles (e.g., a vendor who is also planning their own wedding) sees a "Switch to vendor / customer view" pill in the top chrome — same pattern as Airbnb's host/guest switch.
- Admin role is internal only; assigned by another admin, never self-served.
- All three role surfaces share the same database, the same auth, the same brand chrome — the marketing site sells **one product, three doorways**, not three products.

The marketing site's job is to feed exactly two of these doorways: customers (via `/apply`) and vendors (via `/register-vendor`). Admin accounts are minted internally by the Setnayan Team and never self-served from the marketing site.

---

## Audience model: two-sided split hero

User direction: lead with neither side dominant. The homepage opens with a persistent toggle that swaps the hero copy + CTA without scrolling. Both sides get equal real estate; toggle state persists across page loads via `localStorage`.

### "I'm planning an event" side

> **Set na 'yan.**
> Stop juggling 14 apps to plan your event.
> Setnayan brings every part of your wedding — guest list, vendors, budget, schedule, invitations, photos, live stream, mood board — into one place.
> One app. One source of truth. Couples and vendors finally on the same page.

**Primary CTA:** "Apply to plan your event" → `/apply`
**Secondary CTA:** "See what's inside" → smooth-scroll to "One app, every moving piece"

### "I'm a vendor" side

> **Set na 'yan para sa business mo.**
> Reach every couple actively planning a wedding in the Philippines.
> Free vendor registration is open during launch — your verified profile, your service catalog, your contact button on every couple's vendor finder.
> Same Setnayan app the couples use. You log in, the app jumps you to your vendor dashboard. No second app to download. No separate login to remember.
> No setup fees. No monthly bill. You're on the platform from day one.

**Primary CTA:** "Register your business — free" → `/register-vendor`
**Secondary CTA:** "How verification works" → smooth-scroll to "Vendor compatibility & verification"

---

## Announcement bar (top of every marketing page)

Persistent strip at the very top of every `(marketing)` page:

> **🎉 Now accepting vendors — free registration during launch.** [Register your business →]

Closeable per session (X icon, dismissed state stored in `sessionStorage`). Gets replaced when the launch promo ends (configurable in `marketing.config.ts`).

---

## Tone & voice (locked 2026-05-11) — luxurious, Filipino, modern

**Primary voice (EN bundle, default):** the marketing site reads as **luxurious, Filipino, and modern enough for this generation.** Reference brands in the same register: Aesop, Aman, Soho House. The Filipino layer is texture, not costume — the brand-origin phrase "Set na 'yan." stays as the signature; section copy reads as confident editorial English with selective Tagalog touches where they land naturally (e.g., the brand line, footer brand-origin, hero accent).

**Secondary voice (TL bundle, toggle):** the empathy-first "oo nga noh, kailangan ko 'to" voice — Taglish-warm, recognition-led, conversational. This is the variant a Tagalog-first visitor sees when they tap TL.

**Voice rules per locale:**

- **`en` (primary)** — editorial restraint. Eyebrows in confident English ("For couples" / "Sounds familiar?" / "We grow with you"). Sub-headlines quote the visitor's worry in their own voice ("Did we settle the photographer?" / "When was that fitting again?"). Body copy is concise, considered, premium — no marketing exclamations, no à-la-carte fatigue, no "BOOK NOW" pressure. The brand-origin phrase "Set na 'yan." appears with a subtle gloss on first use ("— it's all set"); subsequent occurrences are unglossed and read as the signature.
- **`tl`** — the "oo nga noh" empathy voice. Eyebrows like "Sounds familiar?" / "Kelan ulit 'yung dress fitting?" / "Nabayaran na ba 'yung photographer?" Mix Taglish where it lands naturally. Same brand-origin phrase, no gloss needed — Tagalog readers know the phrase.
- **`ceb`** — same emotional register as TL, translated by a Bisaya-native copywriter (NOT machine-translated). Bisaya-flavored eyebrows ("Pamilyar ba ni nimo?" / "Kanus-a man tong dress fitting?" / "Bayad na ba ang photographer?"). Brand-origin phrase shown with a one-line Bisaya gloss on first use.

**What "luxurious-Filipino-modern" means in practice:**

- **Typography:** Cormorant Garamond italic for display headers (already in use); Manrope 400/500/700 for body; DM Mono for accent eyebrows. Cap-height generous, line-height airy.
- **Palette:** cream base (#FAF6F0), ink (#1A1A1A), **accent inherits from primary admin's active UI Theme via `brand_config_versions`** (seed default: **Setnayan Default** — deep burgundy `#7A1F2B`; alternate: **Forest Theme** — forest `#2D4A3A` with champagne `#C9A66B` reserved for the Boosted / Certified vendor tints already speced in § Section 8). No competing accents at the page level. Whitespace is the most-used "color." (Terracotta `#C97B4B` was the locked default through 2026-05-14; retired 2026-05-15 — admin can re-enable as a custom brand-config version.)
- **Layout:** generous margins, single-column reading rhythm, quiet section transitions. Density only where data demands it (event tiles, services grid).
- **Copy register:** confident, considered, restrained. Avoid: exclamation marks, all-caps urgency, marketing clichés ("game-changer," "revolutionize," "unleash"), aggressive scarcity ("only 24 hours left!"). Prefer: declarative sentences, concrete details, restrained promises.
- **Motion:** subtle. No jumpy hero animations, no parallax assault. Fade-ins on scroll, gentle hover lifts on cards. Calm.

**The "oo nga noh" recognition pattern still applies — it just speaks English now.** A first-time EN visitor should read the hero + chaos panel and think *"yes, that's exactly what's been happening."* The empathy beat is the same; only the language register changes.

---

## Notes on the original "oo nga noh" framing

**What that means in copy:**

- **Lead with empathy, not features.** Section eyebrows quote the visitor's own pain: "Sounds familiar?" / "Kelan ulit 'yung dress fitting?" / "Nabayaran na ba 'yung photographer?" Recognition before pitch.
- **Mix Tagalog / Taglish where it lands naturally.** Not forced everywhere — the rule is "the way Filipino couples actually talk to each other about their wedding." Examples that work: "Sige, gawin natin," "Magkita-kita setnayan," "Walang nakakalimutan," "Set na 'yan." Examples to avoid: forcing pure Tagalog when the natural register is English (e.g., don't say "ihalal mo ang plano mo" when "pick your plan" is what people actually say).
- **Cut engineering-spec voice.** No "Apparatus catalog." No "The flywheel." No "The operations layer." No "Event-type readiness board." These read like internal documentation; the public site uses softer section labels: "Para sa wedding day mo" / "Lumalago kasama mo" / "Wedding muna. May iba pang darating."
- **Quote the worry, not the spec.** Tab card sub-headlines are the visitor's voice: "Kuya James, kasama na ba sa list?" — not "Track every guest, RSVP, plus-one." The body copy can still say the spec, but the headline is the worry.
- **Concrete > abstract.** "Walang masisingit na sorpresa sa eve of the wedding" beats "complete payment milestone tracking."
- **One promise, repeated.** "Set na 'yan." closes the announcement bar, the hero, the footer brand-origin, and the dual CTA. One promise, repeated four times across one scroll.

**What the marketing-site copy file should look like:** all strings live in per-locale bundles loaded by a single locale loader. V1 ships **three locales side by side from launch** — see "Localization (EN / TL / CEB)" below.

---

## Localization (EN / TL / CEB) — locked 2026-05-11. Primary locale: English.

The marketing site (and downstream the in-product surfaces) must be **fully compatible in three languages from V1 launch**:

| Code | Language | Role | Notes |
|---|---|---|---|
| `en` | English | **Primary / default** | The default bundle for every visitor unless overridden. Tone: luxurious, Filipino, modern (see voice rules below). |
| `tl` | Tagalog (incl. Taglish) | Toggle | The "oo nga noh, kailangan ko 'to" empathy-warm voice variant. |
| `ceb` | Bisaya (Cebuano) | Toggle | ~20M+ first-language speakers across Visayas and Mindanao. Same emotional register as TL, translated by a Bisaya-native copywriter. |

**Copy file structure:**

```
apps/web/src/locales/
  marketing-copy.en.ts    ← English bundle (international + Manila English-comfortable)
  marketing-copy.tl.ts    ← Tagalog/Taglish bundle (the "oo nga noh" voice)
  marketing-copy.ceb.ts   ← Bisaya/Cebuano bundle
  index.ts                ← shared locale loader, exports useCopy() hook
```

Same key shape across all three bundles. Loader detects locale via:
1. Explicit override (URL param `?lang=ceb`, or path prefix `/ceb/...`)
2. Persisted user choice in `localStorage`
3. Geo-IP hint (Cebu/Davao IPs default to `ceb`; Luzon IPs default to `tl`; everyone else defaults to `en`)
4. Fallback to `en`

**Locale switcher UI:** small chip in the top-right of the site header (next to "Log in" / "Apply"), three pills `EN | TL | CEB`. Active pill is the current locale. Tapping switches locale, persists choice, reloads the page with the new bundle. On mobile the chip collapses to the active locale code only and expands on tap.

**Brand-origin phrase exception:** "Set na 'yan." stays in Tagalog across all three bundles — it's the brand origin, not body copy, and translating the brand defeats the point. Bisaya and English bundles include a one-line gloss in their own language directly under the phrase the first time it appears in any page (e.g., for the `ceb` bundle: *"Set na 'yan." — andam na ang tanan.*; for `en`: *"Set na 'yan." — it's all set.*). Subsequent occurrences are unglossed.

**Voice rules per locale:**

- **`tl`** — the "oo nga noh, kailangan ko 'to" voice locked above. Empathy-first eyebrows ("Sounds familiar?" / "Kelan ulit 'yung dress fitting?" / "Nabayaran na ba 'yung photographer?"), Taglish where natural, conversational warmth.
- **`ceb`** — same emotional register, translated by a Bisaya-native copywriter (NOT machine-translated). Bisaya-flavored eyebrows ("Pamilyar ba ni nimo?" / "Kanus-a man tong dress fitting?" / "Bayad na ba ang photographer?"). Same brand-origin phrase + gloss.
- **`en`** — emotionally warm but not forced-PH. Eyebrows in English ("Sounds familiar?" / "When was that fitting again?"), no Taglish. Reads naturally to a Manila professional couple or an international visitor planning a destination wedding in PH.

**Translation workflow:** each `marketing-copy.*.ts` file is owned by one human translator (not auto-generated). When copy changes in one locale, the change is logged in `localization.todo.md` for the other two locale owners to mirror. V1 ships all three bundles fully translated; no half-localized fallback strings on the public site.

**Acceptance criterion:** every public marketing page renders cleanly with `?lang=en`, `?lang=tl`, and `?lang=ceb`. Visual layout (line lengths, button widths, card heights) is tested at the longest of the three translations to avoid clipping.

---

## Privacy invariants (locked from 2026-05-09 memory)

These rules are non-negotiable for every widget on every marketing page:

| Rule | Consequence |
|---|---|
| Vendor logos only at rest | New Vendors carousel renders logo + tap-to-reveal name + service. No public list of vendors with contact info. |
| Goal-progress bars, not raw counts | Every quantitative claim renders as `[N] / [target]` with a bar. Naked counts ("we have 4,217 couples") never appear. |
| City-level geographic granularity | Coverage map pins resolve to PSGC city codes only. Barangay-level is internal-admin only. |
| Anonymized aggregates | "247 weddings being planned in Cebu City" is fine. "Mary & Carlos's wedding on Sept 14" is never on the public site. |
| `vendors.is_public` defaults FALSE | A vendor must explicitly opt in to marketing exposure during their free-registration flow. |
| No raw event counts per vendor | A vendor profile (future TD-3) may show "active on Setnayan since Mar 2026" but never "booked 47 weddings via Setnayan." |

---

## Hide prices on the public site (this iteration's scope decision)

The marketing site shows the **feature catalog in full** but **hides PHP prices** behind the apply / register flow. Rationale:

- PH B2B pricing varies by package + add-on combo; published price tables encourage couples to fixate on a number before they understand the value.
- The apply-then-pay flow (24-hr activation SLA per the payment-flow memory) is already the conversion path; surfacing prices on the marketing site adds a second pricing surface to keep in sync.
- Competitors (AtingTagpuanCandidate, Kuha, Diwang Events) all publish prices; choosing the opposite is a brand differentiator — "we'll quote you for your specific event" reads as premium / consultative rather than commodity.
- Removes the pricing-workbook-sync-on-every-marketing-edit chore.

What replaces price labels on each feature card:
- **Free baseline features** (guest list, mood board palette, schedule, vendor tracking) — labelled "Free with every account."
- **Paid services** (Papic, Panood, Custom Monogram, Templates, AI Highlights, etc.) — labelled "Included in your custom quote" with a CTA "Get your quote → /apply".

A `/pricing` page still exists for SEO + investor / partner due-diligence, but it lists *what's priced*, not *the prices themselves*. Quotes go out via the apply flow.

---

## Section-by-section spec

Replaced wholesale on 2026-05-15 to align with the ideal-content synthesis grounded in WebFetch of `stripe.com` / `linear.app` / `airbnb.com` / `zola.com` / `shopify.com` plus a 2024–2026 SaaS-marketing-site best-practices survey (CXL awareness research, Webstacks 2025, Baymard SaaS UX, DesignStudioUIUX CTA hierarchy, Heyflow thumb-zone, Smartling / Lionbridge localization, web.dev Core Web Vitals, W3C WCAG 2.2). Previous Sections 4 (One app, every moving piece — content folded into the new Section 6 Maria & Juan), 7 (Outsourcing, pacing, scheduling — content moves to `/features` deep-dive), and 8 (The vendor flywheel — content moves to `/for-vendors` as a vendor-side narrative block) are dropped from the homepage. The CLAUDE.md decision-log entry of 2026-05-15 captures the rationale.

### Section 1 — Announcement bar

Persistent strip at the top of the homepage; dismissible (sets cookie). One line of copy + a CTA.

**Copy:** "Now accepting vendors — free registration during launch. **Apply →**" CTA routes to `/register-vendor`.

**Hide condition:** Auto-hides once `verified_vendor_count >= 500` (the boost-service launch gate from decision log 2026-05-14) — at that point the message stops being true.

### Section 2 — Hero (three-question framing)

Above-the-fold conversion module. Problem-aware framing per CXL awareness-stage research — 95% of homepage visitors are problem-aware, not solution-aware.

**Layout (desktop):**
- Eyebrow (small, all-caps, muted, brand-color accent): `SET NA 'YAN · /sɛt na jan/`
- Headline stack (three lines, h1 — large 64–96px):
  - Planning an event?
  - Looking for vendors?
  - Or a vendor looking for customers?
- Subhead (one line, h2-size 22–28px): "Setnayan is the only Filipino-built platform with real operating tools for both sides — from your guest list to your same-day highlight reel."
- Primary CTA (filled button, brand accent): `Start planning · free` → routes to `/apply`
- Secondary CTA (ghost / outline, visually subordinate): `I'm a vendor →` → routes to `/for-vendors`
- Trust strip (small, muted, comma-separated, below CTAs): `Built in the Philippines · BIR-compliant receipts · EN / Tagalog`

**Background:** Designer choice — either pure text on a tinted-cream surface (Linear / Shopify pattern) or a soft full-bleed photographic background with brand-color overlay (Zola pattern). Recommendation: photographic for Filipino-luxe brand alignment; reserve pure-text aesthetic for `/for-vendors`.

**Mobile-specific:**
- Hero stack collapses to single column; type scales to 40–56px h1.
- **Sticky `Start planning · free` button** pinned to the bottom of the viewport (thumb-zone). Per Heyflow + Apple HIG; PH is 80%+ mobile per DataReportal Digital 2024 Philippines.
- 44–48px tap target on primary CTA, 24px floor on secondary CTA per WCAG 2.2 SC 2.5.8.

**A/B test note:** Three-path framing is novel — no widely-referenced 2024–2026 marketplace homepage uses three role-paths. Variant B for post-30-day A/B test if launch traffic supports: two-path framing ("Are you planning an event, or are you a vendor?").

**Removed from previous spec:** the split-hero toggle (couple/vendor pill) is dropped — three-question framing handles audience self-segmentation. The live "[N] / [target] couples planning their event" data row from the prior Section 2 is dropped — replaced by the gated stats in Section 3.

### Section 3 — Real numbers (count-gated)

Trust-signal slot using the boost-service-gate pattern from decision log 2026-05-14. Single page position with two render states keyed off a derived `stats_section_visible` flag.

**Threshold (AND gate — all 4 must be met):**
- `verified_vendor_count >= 100`
- `celebrated_event_count >= 25` (events where `status='completed'` AND `event_date < NOW()`)
- `active_couple_count >= 1,000` (couples with activity in the last 90 days)
- `ph_cities_live >= 5` (cities with `COUNT(verified vendors) >= 3`)

**Pre-threshold render (V1 launch state):**
Single line, muted, centered: `"Real Filipino weddings shipping on Setnayan — soon."` Section uses a fixed-height placeholder so CLS budget is unaffected.

**Post-threshold render:**

> ## The numbers behind Setnayan
> **100+ vendors  ·  25+ events  ·  1,000+ couples  ·  5 cities**
> Plus rising →

Numbers floor-rounded with `+` suffix so they don't visibly tick. `Plus rising →` links to `/coverage` for live current numbers.

**Implementation (mirrors decision log 2026-05-14 boost-service gate pattern):**
- Derived flag `stats_section_visible BOOLEAN` on a new `site_visibility_flags` table (`flag_name TEXT PRIMARY KEY, value BOOLEAN, updated_at TIMESTAMPTZ`).
- Daily cron at 00:00 PHT recomputes from the 4 counts.
- Admin manual override allowed for strategic launch moments (e.g., press) with reason logged in `admin_audit_log`.

### Section 4 — The chaos we're fixing

Problem statement before solution. Hooks problem-aware visitors per CXL awareness research.

**Headline:** Five apps. Three spreadsheets. A WhatsApp group at 11pm.

**Body:**
> That's how most Filipino couples plan a wedding today — bouncing between vendor messages, guest lists, budget spreadsheets, mood-board screenshots, and a barangay full of people asking when the dress code drops.
>
> Vendors aren't any better off. Bookings live in DMs. Calendars live in a notebook. Payments live wherever GCash receipts end up. Reviews don't live anywhere.

**Visual:** Scattered-tool collage — mockups of WhatsApp threads, Google Sheets, Notes app, Drive folders — falling/cascading into a single Setnayan dashboard frame. Animated on-scroll (subtle; no scroll-jacking).

No CTAs in this section — narrative beat only.

### Section 5 — Built for both sides of the celebration

Core positioning — the "Why Setnayan" two-column block. Concrete operating-tool nouns over abstract benefit phrases (Webstacks 2025 / Baymard SaaS UX research).

**Section headline:** Built for both sides of the celebration.

**Sub-claim:** Most event apps pick a side. Setnayan is the only Filipino events platform with real operating tools on both sides.

**Left column — For couples**
- **Free to plan.** Guest list, RSVP, seating, budget, mood board. No subscription, no paywall.
- **Personal QR invitations** for every guest, with branded monogram if you want it.
- **Day-of live broadcast** so anyone who can't be there sees every moment.
- **Paparazzi capture** — your guests' phones become a coordinated photo crew.
- **Same-day highlight reel** delivered 30 minutes before the reception starts.
- **One bill, BIR-compliant.** Pay for what you book. No wallets, no surprises.

**Right column — For vendors**
- **Free listing.** Profile, chat with couples, accept bookings — no monthly fee to start.
- **Real calendar** with team roles, agent privacy redaction, per-service scoping.
- **In-app payments** with BIR receipts and EWT / 2307 handled for you.
- **Pipeline and proposals** from inquiry to completed booking.
- **Sponsored boost** when you're ready to scale — 10km → 30km visibility.
- **Crew-rate marketplace** (V1.5) — list your team and earn from every job.

**Below the columns:** `→ Learn more about Setnayan for vendors` — soft link routing to `/for-vendors`.

### Section 6 — Maria & Juan: see how it works

Product proof — interactive UI preview substitutes for testimonials we don't have yet. Matches Stripe / Linear / Shopify pattern of UI-as-hero-imagery. **This is the strongest don't-break asset from the current live site.**

**Layout — top half:**
- Interactive Maria & Juan dashboard preview (already live at setnayan.com — keep)
- Stage-based workflow strip showing where the demo couple is in their planning
- Toggle to peek at vendor-side ("See what their photographer sees")
- Theme picker (**Setnayan Default** / Victorian / Classy / iOS / **Forest Theme**) — already live, expanded to 5 themes 2026-05-15 (Forest Theme added; Setnayan Default accent swapped to burgundy, name kept); keep

**Layout — bottom half — Four-tab walkthrough (folded in from previous Section 4):**

The four bottom-nav tabs from iteration 0000 explained as benefits, mapped one-to-one with what couples see in the dashboard. Each tab card: screenshot thumbnail + one-line "what it does" + `Learn more →` link to `/features#[slug]`.

| Tab | Headline | Sub-copy (no prices, no SKUs) |
|---|---|---|
| Guest List | From save-the-dates to seating charts. | Track every guest, RSVP, plus-one, dietary preference, table assignment, and personal QR — all linked to the same database your invitations and gallery read from. |
| Vendors | Every vendor, every payment, one ledger. | Track contracts, milestones, deadlines, and crew-meal counts. Calendar-export every payment + every vendor meeting. Vendors stay in sync — you stay in control. |
| Schedule | Every date, every reminder, every milestone — auto-tracked. | Wedding-day timeline, vendor meetings, payment deadlines, RSVP cutoffs — pulled from across the app into one calendar. Subscribe to .ics so it syncs to your phone. |
| In-App Services | The features other event apps haven't maximized. | Live stream on YouTube. Designated friends as paparazzi capturing your candid moments. Custom monogram across every output. Mood boards. LED backgrounds. Polished highlight reels. |

**Couple-name rotation note (open question):** "Maria & Juan" is generic-Tagalog. Consider rotating demo names across regional bias points (e.g., Aira & Boy for Visayan, Inday & Bong for Mindanao) — open question per 2026-05-15 synthesis.

### Section 7 — In-app services (apparatus catalog)

A grid of feature cards for the paid services. Each card: icon, name, one-paragraph description, "Included in your custom quote" label, "Get your quote →" CTA. **No PHP figures.**

**Section headline:** When the day comes, we bring the gear.

**Sub:** Live broadcast. Same-day edit. Paparazzi capture. Personal monogram. The on-the-day apparatus that turns a wedding into a story your guests can replay forever — built into the same app you used to plan it.

**Cards (from the locked CLAUDE.md SKU list, reordered for marketing flow):**

1. **Papic — Designated Paparazzi** — Native iOS/Android app for friends and family. Gesture shutter, QR-tag photos to specific guests or whole tables, untagged photos still land in the couple's gallery. Real-time delivery.
2. **Panood — Multi-Cam Live Stream** — Up to five cameras, one broadcaster, broadcast on YouTube. Custom monogram + Broadcast Style Pack support. AI Highlight reels post-event.
3. **Pamahiya — Personal Souvenir Reels** — Every guest renders their own 1–30 second reel from a template library, scored to Setnayan-owned music.
4. **Pakulay — Mood Board & Palette Engine** — Per-role + per-venue palettes with the Setnayan Guide rule engine catching contrast / temperature / cultural-default mistakes before they hit the printer.
5. **Pailaw — LED Background Maker** — 8K loop generators for venue LED walls, USB-deliverable for offline playback.
6. **Pareto — Pro Camera Bridge** — Pair a DSLR (Canon / Nikon / Sony / Fujifilm) with the Papic phone for broadcast-grade glass without changing the operator's workflow.
7. **Custom Monogram Pack** — One purchase replaces the Setnayan watermark with the couple's monogram across every media output.
8. **Pro Invitation Widgets** — Pro tiers for Hero / Our Story / Schedule blocks on the personal invitation page.
9. **AI Video / Edited Highlight** — Auto-curated event highlight reels from Papic + Panood feeds.

Each card carries a "Free with every account" or "Included in your custom quote" tag — see the hide-prices decision above.

### Section 8 — Vendor compatibility & verification

Tabbed module that flips between "What you get as a vendor" and "How verification works."

**What you get as a vendor:**
- Free profile with logo, photos, services, packages, contact button
- Showing up in every couple's vendor finder for your service category
- Direct lead capture → couples message you in-app, no third-party fees
- Calendar block for inquiries → meetings → bookings
- Vendor dashboard inside the same Setnayan app — no second download, no second login. Log in, the app jumps you to the vendor surface.
- Lightweight CRM + supplier inbox built into the vendor surface from V1 (no Phase-3 supplier app split — one product, three doorways).

**How verification works:**
1. Apply with business name, owner name, service category, service area, sample work
2. Setnayan Team admin reviews legitimacy (DTI / SEC / Mayor's Permit photo OK; portfolio review for solo creatives)
3. Status flips from `Pending Verification` → `Verified` (typical SLA: 3 business days)
4. Verified vendors get a Setnayan check badge on every surface
5. Couples see only verified vendors by default; unverified profiles are toggle-on in advanced search

Anchor: this section's "Apply now" CTA goes to `/register-vendor`.

### Section 8.5 — Transparent pricing

Canonical pricing-transparency block. Replaces the prior `setnayan.com` live copy `"No subscription, no per-guest fee, no commission on vendor bookings."` — that line is **deprecated** as of 2026-05-16 because it hid the **5.5% Setnayan Pay convenience fee** locked the same day. The fee is paid by the couple on top of the vendor's listed price at checkout; the vendor sees their full listed price (minus only the terminal fee + BIR 1% marketplace withholding, both of which they'd pay on any platform). The vendor-side "no commission, no monthly bill" framing in Sections 5/8 stays intact — that promise is still true because the 5.5% is couple-paid, not deducted from the vendor's price.

**Section headline:** Transparent pricing.

**Sub-claim:** Free to plan — the planning tools are free forever. Vendor bookings add a **5.5% Setnayan Pay convenience fee** at checkout, shown on the order summary before you confirm. No subscription, no per-guest fee, no hidden charges.

**Three-column transparency strip (icons + one-line claim each):**

| Column | Headline | Body |
|---|---|---|
| Planning tools | **Free forever** | Guest list, RSVP, seating, budget, mood board, schedule — every planning surface is free. No paywall, no per-guest fee. |
| Add-on apparatus | **À la carte** | Papic, Panood, Custom Monogram, Live Stream, Save-the-Date Video — you only pay when you opt into a specific service. Couple-side prices are listed on `/pricing` and re-shown at checkout. |
| Vendor bookings | **+5.5% at checkout** | Vendor lists their price. At checkout we add a 5.5% Setnayan Pay convenience fee that powers BIR-compliant receipts, in-app messaging, milestone-protected payments, and platform safety. Your vendor sees their listed price 100%. |

**Worked example block** (right column on desktop / collapsed accordion on mobile):

> **Worked example — ₱100,000 vendor booking**
> Vendor's listed price: ₱100,000
> Setnayan Pay convenience fee (5.5%): ₱5,500
> **You pay at checkout: ₱105,500**
> Your vendor receives the ₱100,000 listed price (minus their own terminal fee + BIR withholding — same as any payment platform). Setnayan keeps the 5,500 to run the app.

**Mobile copy collapse:** The three-column transparency strip stacks to a single column with each row remaining a full card. The worked-example block becomes a tap-to-expand accordion ("See how it works") to keep above-the-fold density mobile-readable.

**Engineering note:** the live-site copy on `setnayan.com` (current production: "No subscription, no per-guest fee, no commission on vendor bookings.") needs to be replaced with this section's headline + sub-claim + three-column strip. Tracked as Section 8.5 in `apps/web/app/(marketing)/pricing/page.tsx` (or equivalent — confirm at implementation time). The deprecated "no commission on vendor bookings" claim must be removed from couple-side marketing surfaces; vendor-side "no commission, no monthly bill" copy stays intact per the 2026-05-11 grandfather promise.

### Section 9 — Event-type readiness board

A grid of event-type tiles. Each tile has a cover photo, the event-type name, a status pill, and a goal-progress bar showing vendor readiness for that type.

**V1 displayed event types** (from the universal-event-platform memory):

| Event type | Status | What unlocks at "ready" |
|---|---|---|
| Wedding | LIVE | Full feature set already shipped. |
| Birthday Parties | Coming soon | Children's-party packages, theme decorators, party planners |
| Anniversaries | Coming soon | Surprise-party concierge, intimate-venue partners |
| Vow Renewals | Coming soon | Same as wedding, smaller-scale catering |
| Baptism | Coming soon | Officiant + reception bundle |
| Corporate | Coming soon | Conference AV, team-event venues, corporate emcees |
| Concerts / Showcases | Coming soon | Stage rental, lights & sound at scale |
| Burial / Wake | Coming soon | Memorial photographers, livestream condolences |
| Travel | Coming soon | Out-of-town logistics, destination vendor sourcing |
| Celebration (catch-all) | Coming soon | Generic event type for everything else |
| ...11+ more event types | Tracked | Will activate as vendor pool reaches per-type readiness threshold |

Each tile's progress bar reads `[N vendors registered] / [threshold to activate]`. Tiles also carry a "Notify me when this opens" button that emails the couple when their event type goes live.

**Post-launch evolution (T+90 days):** When real couple/vendor reviews exist, this section flips to a social-proof carousel (named couples, named partner vendors with consent) — pre-launch a roadmap builds momentum; post-launch it signals incompleteness (Webstacks 2025). Trigger: same `stats_section_visible` derived flag from Section 3 — when stats unlock, the readiness board content flips to social proof.

### Section 10 — PH coverage map

PH SVG basemap with city-level pins.

(Inherits the spec from the prior 0015 draft; widget logic unchanged.)

- City-level only (PSGC city codes) — never barangay-level on the public site
- Aggregated event counts only — never individual events
- Hover/tap on a city pin reveals: "247 weddings being planned in Cebu City"
- Pin radius scales: 1–9 events = small, 10–49 = medium, 50–249 = large, 250+ = very large
- Color: brand accent

### Section 11 — Dual CTA conversion module + brand-origin footer

Final conversion module + the chrome that wraps every marketing page.

**Conversion module — single primary apply CTA + ghost-style vendor secondary.** Brand-reveal payoff lands here.

**Headline block:**
> ## Set na 'yan.
> *Everything's set.*
>
> Nothing else like it in the Philippines.

**Primary block (foregrounded, full-width):**
> ### Plan your event with Setnayan.
> Apply now. Setnayan Team will contact you within 24 hours with your activation link.
>
> [ **Apply now →** ] *(routes to `/apply`)*

**Secondary block (ghost-style, smaller, below):**
> You're a vendor? [Register your business — free →](/for-vendors)

**Footer chrome (shared across all marketing pages):**

- SETNAYAN wordmark + symbol mark
- "Set na 'yan." brand-origin paragraph: *"A Tagalog phrase that means 'it's all set' — the moment everything clicks into place. Your venue's booked. Your photographer confirmed. Your guests are RSVP'd. Your day is ready."*
- Nav links: Plan an event · For vendors · About · Help center · Contact · Login
- Legal links: Privacy · Terms
- Compliance badges: BIR-compliant receipts · RA 10173 compliant
- Language switcher: **English · Tagalog · Sugbuanon** (language self-names per Smartling / Lionbridge / Digital.gov localization best practice — replaces the conventional "English · Tagalog · Cebuano" exonym labeling)
- Address: Quezon City, Philippines
- Copyright © 2026 Setnayan

A small "Setnayan" tagline line appears in the footer for the first 90 days post-launch.

**Removed from previous spec:** equal-weight dual cards. Research-validated: 1 primary + 1 visually subordinate secondary lifts conversion ~42% over equal-weight CTAs (DesignStudioUIUX, NerdCow CTA-hierarchy research). The dual-card pattern from the prior spec presented both audiences with the same visual weight; the new pattern keeps the couple path primary on the main page — vendors get their own polished page at `/for-vendors`.

### Section 12 — Available everywhere you plan (locked 2026-05-15; revised 2026-05-15 to hide-until-live)

A platform-availability strip confirming Setnayan is not just a website — it's a real cross-platform product couples and vendors can install on every device they own.

**Position on the page:** renders visually between the Section 11 conversion block and the Section 11 footer chrome.

**Headline:** Available everywhere you plan.

**Sub:** Web · Windows · macOS · iOS · iPadOS · Android. Open Setnayan on whatever device your event-planning lands on.

**Download badges row — hide-until-live tiles** (per 2026-05-15 revision):

| Tile | Label | Routes to | V1-launch state |
|---|---|---|---|
| Web | "Open in browser" | `setnayan.com/login` | **Always visible** |
| Windows | Microsoft Store badge | `platform_availability.store_url` | Hidden until store URL published |
| macOS | Mac App Store badge | `platform_availability.store_url` | Hidden until store URL published |
| iOS | App Store badge | `platform_availability.store_url` | Hidden until store URL published |
| iPadOS | App Store badge (shared with iOS listing) | `platform_availability.store_url` | Hidden until store URL published |
| Android | Google Play badge | `platform_availability.store_url` | Hidden until store URL published |

**Sub-line (auto-trimming as platforms ship):**
- V1 launch (only Web live): *"Native apps for Windows, macOS, iOS, iPadOS, and Android are on the way. We'll add each one as it ships."*
- After 1+ platform ships: sub-line trims to the remaining unpublished platforms.
- After 5 platforms live: sub-line disappears entirely.

**Sync note** (small, muted, below tiles): "Plan from anywhere — your data syncs across every device you sign in on."

**Implementation:**
- New table `platform_availability (platform_id TEXT PK, store_url TEXT NULL, is_visible BOOLEAN DEFAULT FALSE, published_at TIMESTAMPTZ NULL)` — one row per platform.
- UI query: `SELECT * FROM platform_availability WHERE is_visible AND store_url IS NOT NULL ORDER BY published_at` for native tiles; Web tile is rendered statically.
- Admin flips `is_visible` once a store URL is published; `published_at` auto-sets.
- Native app shells delivered per a separate iteration (proposed `0043_native_apps_delivery`).
- Cross-references: CLAUDE.md decision-log entries **2026-05-15 V1 platform expansion** and **2026-05-15 stats + platform gating**.

**Removed from earlier spec (2026-05-15 revision):** the "Coming soon" pills pattern. Replaced with hide-until-live tiles + auto-trimming sub-line. Reason: muted-pill placeholders aged poorly during the months between launch and store approval; the hide-until-live pattern keeps the strip honest at every render state.

---

## Widget architecture (locked 2026-05-15)

The 12 marketing-site sections are widgets in a registry, generalizing the per-section visibility/gating pattern from Section 3 (count-gated stats) and Section 12 (per-tile platform availability). Admins manage which widgets render and in what order via the **Website editor** (iteration 0023 § 3.10).

**Registry table:**

```sql
CREATE TABLE site_widgets (
  widget_id           TEXT PRIMARY KEY,                  -- e.g. 'home_hero', 'home_real_numbers', 'home_platforms'
  page                TEXT NOT NULL,                       -- 'home' | 'for_vendors' | 'features' | 'about' (extensible)
  display_order       INT NOT NULL,                         -- per-page ordinal; admin can drag-drop reorder
  is_enabled          BOOLEAN NOT NULL DEFAULT TRUE,         -- admin toggle
  gate_type           TEXT,                                  -- NULL | 'count' (stats) | 'per_tile' (platforms)
  config              JSONB NOT NULL DEFAULT '{}',           -- per-widget settings; not admin-editable in V1
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by_admin_id UUID REFERENCES users(user_id)
);
CREATE INDEX idx_site_widgets_by_page ON site_widgets(page, display_order);
```

**V1 admin-editable fields:** `is_enabled` and `display_order` only. Per-widget config (stats thresholds, platform store URLs, copy overrides, A/B variants) stays code-locked in V1; admin editing of `config` JSONB deferred to V1.1.

**Seed data for the homepage** (`page='home'`):

| display_order | widget_id | gate_type | config (locked, not admin-editable in V1) |
|---|---|---|---|
| 1 | `home_announcement_bar` | NULL | `{"hide_when_verified_vendors_gte": 500}` |
| 2 | `home_hero` | NULL | `{"variant": "three_question"}` |
| 3 | `home_real_numbers` | `count` | `{"thresholds":{"vendors":100,"events":25,"couples":1000,"cities":5}}` |
| 4 | `home_chaos` | NULL | `{}` |
| 5 | `home_two_sides` | NULL | `{}` |
| 6 | `home_maria_juan` | NULL | `{}` |
| 7 | `home_in_app_services` | NULL | `{}` |
| 8 | `home_vendor_compat` | NULL | `{}` |
| 9 | `home_readiness_board` | NULL | `{"post_launch_swap": "social_proof_when_stats_visible"}` |
| 10 | `home_coverage_map` | NULL | `{}` |
| 11 | `home_dual_cta_footer` | NULL | `{}` |
| 12 | `home_platforms` | `per_tile` | `{"platforms":["web","windows","macos","ios","ipados","android"]}` |

**Widget render logic:**
- `gate_type=NULL` → renders iff `is_enabled=TRUE`.
- `gate_type='count'` → renders iff `is_enabled=TRUE` AND every threshold in `config.thresholds` is met by live counts (daily cron at 00:00 PHT recomputes a derived `count_gate_passes BOOLEAN`). Pre-threshold: muted single-line placeholder. Post-threshold: real numbers strip.
- `gate_type='per_tile'` → renders iff `is_enabled=TRUE`; individual tiles within the widget check `platform_availability.is_visible AND store_url IS NOT NULL`. The Web tile always renders regardless.

**Reordering UX:** Admin drags widget cards in the Website editor; UI optimistic-updates then PATCHes `site_widgets.display_order` for affected rows in one transaction. Audit-logged via `admin_audit_log` with action `site_widgets_reorder`.

**Disabling UX:** Admin toggles `is_enabled=FALSE` on a widget card. Audit-logged. Disabled widgets stay in the registry — visible in the editor with a muted appearance and a "Disabled" badge. Public site cache invalidates at the next 60s tick.

**Replaces** the standalone `site_visibility_flags` table from the earlier 2026-05-15 stats-gating entry — folded into `site_widgets.is_enabled` + the derived `count_gate_passes` check on `gate_type='count'` widgets. The `platform_availability` table (Section 12 per-tile detail) stays as a sibling table linked logically to the `home_platforms` widget by convention (`widget_id` is not a foreign key but the relationship is documented here).

**Forward extension (V1.1 — NOT in scope this session):** per-widget config editing in the admin (stats thresholds editable · copy overrides per locale · A/B variant configuration · scheduled widget visibility windows · cross-page widget moves).

**Cross-references:** iteration 0023 § 3.10 Website editor (admin surface); CLAUDE.md decision-log entry 2026-05-15 widget refactor + vendor public_visibility.

---

## Routes

```
setnayan.com/                  ← homepage (this iteration)
setnayan.com/about             ← Setnayan story, founders, brand origin
setnayan.com/features          ← features deep-dive (each tab + service explained more)
setnayan.com/pricing           ← what is priced, not the prices themselves; routes everyone to /apply
setnayan.com/for-event-creators ← couple-side deep dive (replaces the homepage couple-side hero with longer narrative)
setnayan.com/for-vendors       ← vendor-side deep dive (verification, payouts, marketing benefits)
setnayan.com/register-vendor   ← free vendor registration form
setnayan.com/apply             ← couple/event-creator application form (kicks off the apply-then-pay flow)
setnayan.com/coverage          ← interactive PH coverage explorer (full-page version of Section 10)
setnayan.com/blog              ← V1.1+; placeholder route in V1
setnayan.com/contact           ← contact (email + form)
setnayan.com/legal/privacy
setnayan.com/legal/terms

setnayan.com/login             ← existing 0000 sign-in
setnayan.com/dashboard/*       ← existing 0000 dashboard
setnayan.com/[event-slug]?invite=...  ← existing 0002 guest invitation site
setnayan.com/v/[vendor-slug]   ← future TD-3 Vendor Landing Page
setnayan.com/join/[event-id]?token=...  ← existing 0000 event-join QR landing
```

---

## Vendor landing page — reviews, ratings & exclusive offers

### Reviews & ratings on the vendor landing page (locked 2026-05-12)

Each vendor's landing page (`setnayan.com/v/{vendor-slug}`) displays their reviews:

- **Hero metrics row:** big-display avg rating (4.7 ★) + total review count (47 reviews) + per-category breakdown (Communication 4.8 · Quality 4.9 · Value 4.5 · Punctuality 4.6)
- **Sort/filter strip:** Most recent / Most helpful / By rating (5 / 4 / 3 / 2 / 1 / All)
- **Review cards (paginated, 10 per page):**
  - Reviewer profile photo + first name + event date ("Aira & Boy · November 2026")
  - Star rating with sub-category strip below
  - Body text (truncated to 240 chars with "Read more" expand)
  - Photo carousel (if any photos attached)
  - Vendor's response (if any) shown as quoted card below the review
- **Filter empty state:** "No reviews match this filter yet."
- **No-review empty state on vendors with 0 reviews:** "This vendor has no reviews yet. Bookings completed through Setnayan generate reviews 24 hours after the event."

### Exclusive Setnayan offer row (locked 2026-05-12)

Per Vendor Agreement § "vendor exclusive offer is mandatory," every vendor has at least one Setnayan-exclusive offer (discount, bonus inclusion, free upgrade, etc.). On the vendor landing page, this surfaces as:

- A **horizontally-tinted row inside the bundle/service detail card**, with the Setnayan logo + "Setnayan Exclusive" eyebrow + the offer description + a clear "Available only via Setnayan booking" caveat
- Tint colors: gold gradient for Boosted vendors, terracotta for Certified, neutral for Standard Verified
- The row sits between the package title and the package description
- Tapping the row expands a panel explaining the exclusive offer terms (validity period, applicable services, redemption mechanics)

Example:

```
[Setnayan Exclusive]
₱2,000 off + complimentary parents-of-couple portraits (worth ₱3,500)
Valid only when booked through Setnayan · Auto-applied at checkout
```

---

## Schema additions

Two columns on existing tables (carried over from prior 0015 draft, still required):

```sql
-- For the New Vendors carousel privacy rule
ALTER TABLE vendors ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT FALSE;

-- For the city-level coverage map
ALTER TABLE events ADD COLUMN psgc_city_code TEXT;
ALTER TABLE events ADD COLUMN psgc_province_code TEXT;
CREATE INDEX events_city_code_idx ON events (psgc_city_code) WHERE archived = FALSE;
```

Plus a new table for the free-vendor-registration intake (lighter than the full vendor surface vendor account schema; this is the marketing-side application that the Setnayan Team admin reviews):

```sql
CREATE TABLE vendor_registrations (
  registration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  service_category_codes TEXT[] NOT NULL,  -- references hybrid taxonomy from 0006
  service_area_psgc_city_codes TEXT[] NOT NULL,
  sample_work_urls TEXT[],                  -- portfolio links / IG / FB
  legitimacy_doc_url TEXT,                  -- DTI / SEC / Mayor's Permit upload (R2)
  source TEXT,                              -- where they heard about Setnayan
  status TEXT NOT NULL DEFAULT 'pending_review'
    CHECK (status IN ('pending_review','approved','rejected','needs_info')),
  reviewed_by UUID REFERENCES users (user_id),
  reviewed_at TIMESTAMPTZ,
  approved_vendor_id UUID REFERENCES vendors (vendor_id),  -- set when approved → vendor row created
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX vendor_registrations_status_idx ON vendor_registrations (status, created_at);
```

PSGC reference table is unchanged from the prior draft.

---

## Conversion funnel

```
Visitor lands on setnayan.com/
   │
   ├─ Reads dual hero (toggles to whichever side they care about)
   ├─ Sees the chaos panel (recognition)
   ├─ Sees the four-tab + services overview (recognition → understanding)
   ├─ Sees vendor compatibility / verification (trust)
   ├─ Sees pacing + scheduling story (operational confidence)
   ├─ Sees vendor flywheel + readiness board (momentum)
   ├─ Sees PH coverage map (geographic proof)
   │
   ├─ Couple clicks "Apply" → /apply form → submission → Setnayan Team contacts within 24 hr → quote sent → payment → activated
   │
   ├─ Vendor clicks "Register your business — free" → /register-vendor form → submission → Setnayan Team verifies (3 business day SLA) → vendor profile published with verified badge
   │
   └─ Visitor closes tab — analytics event "marketing_site_bounce"
```

**Key conversion metrics tracked (Vercel Analytics + Sentry):**

- `marketing_homepage_view`
- `hero_toggle_flipped` (which side ended on)
- `marketing_cta_clicked` (which CTA, which section)
- `apply_form_started` / `apply_form_submitted`
- `vendor_registration_started` / `vendor_registration_submitted`
- Bounce rate, time on page, scroll depth per section

---

## Acceptance criteria

This iteration is shippable when all of the following are true:

- [ ] Homepage `setnayan.com/` renders without errors and loads within 2.0 s on a throttled 3G connection.
- [ ] Announcement bar visible at top of every marketing page; dismissible per session.
- [ ] Two-sided split hero renders with toggle visible above the fold on both desktop and mobile; toggle state persists in `localStorage`.
- [ ] Both sides of the hero have working primary + secondary CTAs.
- [ ] "Chaos panel" Section 3 renders without breaking on screens ≥ 360 px wide.
- [ ] Four-tab "One app, every moving piece" Section 4 renders all four tab cards with screenshot thumbnails.
- [ ] In-app services Section 5 renders all 9 cards, each carrying its label ("Free with every account" or "Included in your custom quote") — **no PHP figures anywhere on the public site.**
- [ ] Vendor compatibility / verification Section 6 renders with both tabs functional.
- [ ] Outsourcing / pacing / scheduling Section 7 renders.
- [ ] Vendor flywheel Section 8 progress bar pulls live data from `vendors WHERE status = 'verified'` and renders against the configured target ladder.
- [ ] Event-type readiness board Section 9 renders all event-type tiles; "Notify me" CTA captures email into a per-event-type waitlist table.
- [ ] PH coverage map Section 10 renders SVG basemap with city-level pins; pin sizes scale by event count; hover reveals "[N] events in [City]" only.
- [ ] Dual CTA Section 11 renders side-by-side cards with both apply + register-vendor links functional.
- [ ] Footer carries "Setnayan" bridge copy + brand-origin tagline + social + legal links.
- [ ] All public queries enforce privacy invariants (Section "Privacy invariants"): aggregated counts only, no row-level data, no barangay granularity.
- [ ] `vendors.is_public` defaults to FALSE; vendor settings page in vendor surface will let vendors flip it to TRUE.
- [ ] `vendor_registrations` table created; `/register-vendor` form posts into it; Setnayan Team admin queue page reads from it (admin queue page is out of scope for this iteration; spec separately).
- [ ] All marketing routes (`/about`, `/features`, `/pricing`, `/for-event-creators`, `/for-vendors`, `/register-vendor`, `/apply`, `/coverage`, legal pages) render without errors.
- [ ] Sign-up / apply CTAs from any marketing page route correctly to their target forms.
- [ ] Mobile responsive (thumb-friendly per memory rule) on screens 360 px wide and up.
- [ ] SEO basics: meta tags per page, Open Graph tags for social sharing, sitemap.xml at `/sitemap.xml`.
- [ ] All static assets cached aggressively at Cloudflare (1 year browser cache for images, 5 min ISR for live-data widgets).
- [ ] Brand strings centralized in `brand.config.ts` so a Setnayan ↔ Setnayan flip is one PR.

---

## Build order

1. **Sprint 1** — Next.js marketing route group (`app/(marketing)/...`). Header + footer + announcement bar + brand tokens. Brand config file.
2. **Sprint 2** — Two-sided split hero with toggle persistence; both sides' copy + CTAs.
3. **Sprint 3** — Sections 3 (chaos panel) + 4 (one app, every moving piece) + 5 (in-app services catalog).
4. **Sprint 4** — Sections 6 (vendor compatibility / verification) + 7 (outsourcing / pacing / scheduling).
5. **Sprint 5** — Sections 8 (flywheel) + 9 (event-type readiness board); waitlist email-capture for "Notify me."
6. **Sprint 6** — Section 10 PH coverage map; PSGC reference table seed; SVG pin overlay.
7. **Sprint 7** — Section 11 dual-CTA module; `/apply` and `/register-vendor` forms; `vendor_registrations` schema migration.
8. **Sprint 8** — Other marketing routes (`/about`, `/features`, `/pricing`, `/for-event-creators`, `/for-vendors`, `/coverage`, legal pages).
9. **Sprint 9** — SEO meta tags + sitemap + Open Graph + analytics wiring.
10. **Sprint 10** — Acceptance test pass + brand QA + performance pass.

Roughly 5–7 weeks of engineering at 1 dev. 3–4 weeks at 2 devs.

---

## Open questions

- Domain — `setnayan.com` (rebrand reveal) or `setnayan.com` (current) or both with redirects? **Recommendation:** ship behind `setnayan.com` first; cut `setnayan.com` over once the registration / DNS dust settles. The site code is brand-agnostic via `brand.config.ts` so the cutover is a config flip + DNS swap.
- Verification SLA — 3 business days realistic? **Recommendation:** start with a posted SLA of "within 5 business days" and aim for 3; tighten the public number once we have a quarter of throughput data.
- Should `/pricing` exist at all if prices are hidden? **Recommendation:** yes — the page lists what's priced + the apply flow + competitor differentiator framing ("we quote per-event"). Removes the SEO gap from competitors all having `/pricing` pages.
- Should the homepage include couple testimonials? **Recommendation:** placeholder for V1 ("Couple testimonials publish after our first 50 weddings"); real testimonials backfilled in V1.1.
- Multi-language? **Recommendation:** V1 English-only; Filipino-language site is V2. Hero copy tested in both locales pre-V2.

---

## Companion specs and cross-references

- `0000_app_shell_and_navigation/` — sign-up CTAs route here. Bottom-nav tabs on the dashboard align with the four-tab block on the marketing homepage.
- `0006_vendors_management/` — `vendors` table, hybrid taxonomy referenced by the registration form's `service_category_codes`.
- `0013_platform_stack_and_sync/` — Supabase Edge Functions, Vercel ISR, RLS policies all set up by 0013 and used here.
- `0014_v1_1_polish/` — billing rail (PHP-only, apply-then-pay) referenced by every "Get your quote" CTA.
- `CLAUDE.md` — decision log (especially: 2026-05-09 marketing site privacy rules; 2026-05-11 token wallet retired; 2026-05-11 payment-flow apply-then-pay; 2026-05-11 brand rename in progress; 2026-05-11 universal event platform).

---

[View this iteration's HTML mockup](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan%20App/0015_main_website/0015_main_website.html)

[View this iteration's Word document](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan%20App/0015_main_website/0015_main_website.docx)
