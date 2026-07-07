# Setnayan Couple Landing Page Feature Specification

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main)
> **This doc is HISTORICAL/REFERENCE.** Authoritative current state = the live site (www.setnayan.com) + shipped code (`apps/web` @ `origin/main`) + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. The core landing-page *concept* (one canonical event URL, theme + section-toggle model, three lifecycle modes, guest RSVP via magic link) is broadly sound and reflected in the shipped couple dashboard's Landing surface. Deltas / cautions:
> - **Tier model (Essentials / Premium / Pro Event) is RETIRED.** The "V1 Pricing & Packaging" table gating custom domain / remove-footer / AI copy behind tiers does not match the live SKU model — there is no Essentials/Premium/Pro Event ladder. Couple-side monetization is the per-SKU catalog (premium event-page upgrades surface as add-ons — the free 4-in-1 couple website plus ONE **Couple Website PRO ₱1,999**; the old separate "Pro Website"/RSVP/RSVP Pro/Event Website/Editorial Website à-la-carte SKUs are retired). Use §1 of the ground-truth doc for the current catalog, not this table.
> - **"Sulyap" branding is stale** (Part 10.6/10.7): the native capture app/feature ships as **Papic** (the SKU is now per-camera — **Papic Unli ₱100/cam·day** and **Papic Ltd ₱30/cam·day**, both capped ₱15,000/day; the old "Papic (5 Seats)" + "Papic Guest" flat SKUs are retired), and native apps are a **Capacitor remote-URL shell** (Android built; not the standalone iOS/Android app this doc assumes). Treat "Sulyap" as a retired working name.
> - **Payment is apply-then-pay + manual admin approval** (NOT PayMongo/auto-charge); unlocks that gate Gallery/Live Stream sections fire off `orders='paid'` only after an admin confirms a screenshot at `/admin/payments`.
> - **Vendor service-completion QR + vendor brand placement** (Part 10.7) is forward/aspirational, not the way the shipped vendor surface works (vendors run a full `/vendor-dashboard`; vendor↔couple money is OFF-PLATFORM per RA 11967).
> - Companion refs `06_*`/`16_Couple_Landing_Page_Live.html` and the "spec 07 tier section" pointers are pre-resync; cross-check against the ground-truth doc + live Landing surface before relying on them.
> - Commission/0% and the retired customer token wallet (0003) don't surface in this doc directly; no correction needed there.
>
> When this body disagrees with the above, **the above wins.**

**Document Version:** 1.0 — V1 SCOPE
**Last Updated:** 2026-05-08
**Owner:** Setnayan Product & Engineering
**Status:** Draft for V1 implementation
**Audience:** Product, Engineering, Design, Operations, Customer Success
**Companion Specs:** 07_V1_Developer_Specification.md, 09_Panood_Feature_Specification.md, 10_Papic_Feature_Specification.md, 06_Couple_Landing_Page_Designs_v1.html, 13_Engineering_Brief.docx

---

## V1 Pricing & Packaging

The Couple Landing Page is **not a separately purchased SKU.** Every Setnayan couple gets a landing page automatically when they create their event — it is the canonical surface that every other Setnayan feature plugs into. Pricing for the landing page is therefore $0 marginal at the SKU level; revenue is captured by the underlying tier (Essentials / Premium / Pro Event in Section 7 of `07_V1_Developer_Specification.md`) and the per-feature add-ons that surface inside the page (Paparazzi unlock, Live Stream unlock, Template add-ons).

### What the couple controls per tier

| Capability | Essentials | Premium | Pro Event |
|---|:-:|:-:|:-:|
| Custom event slug (`setnayan.com/[slug]`) | ✓ | ✓ | ✓ |
| Theme picker (6 curated themes) | ✓ | ✓ | ✓ |
| Section toggles + reorder | ✓ | ✓ | ✓ |
| Story, schedule, venue, RSVP modules | ✓ | ✓ | ✓ |
| Custom hero photos (up to 6) | 3 | 6 | 6 |
| Custom monogram (auto-generated SVG) | ✓ | ✓ | ✓ |
| Password-protected mode (private invite) | ✓ | ✓ | ✓ |
| Connect a custom domain (e.g., `mariaandjuan.com`) | — | ✓ | ✓ |
| Remove "Powered by Setnayan" footer | — | — | ✓ |
| AI-assisted story copywriting (Claude) | — | ✓ | ✓ |

Every other capability described in this spec ships at all tiers.

---

## Part 1 — Executive Summary

### What the Couple Landing Page Is

The Couple Landing Page is the single canonical web surface for every Setnayan wedding. It lives at `setnayan.com/[event-slug]` (e.g., `setnayan.com/maria-juan-2026`) and serves three audiences from one URL with role-aware rendering:

- **The couple** — their day-of-event command center; the place they edit their story, manage their guest list, monitor RSVPs, and watch the photo feed fill up live.
- **Guests** — their entry point to RSVP, the schedule, the venue map, the dress code, the live ceremony stream, and after the event their personal photo gallery and Personal Reel builder.
- **Anyone with the URL** — the public face of the wedding: a short story, a hero photo, the date, and a clear "View invitation →" CTA that pushes them through RSVP.

**This feature is web-only.** The Setnayan native app (iOS + Android) is reserved for Paparazzi capture per spec 10. The landing page is rendered server-side by Next.js 15 and is consumed via a desktop or mobile web browser. A guest opening the URL on their phone gets a fully responsive web page — not an app deep-link, not an app-required experience.

### Why Web-Only Is the Right Call for V1

A wedding invitation has to open from a Messenger thread, a Viber group, an email, a printed QR code on a save-the-date card, or a tita's Facebook share. None of those flows can assume the guest has the Setnayan native app installed. A web-first landing page works for 100% of guests; an app-required landing page works for none of them.

Native apps are the right surface for *capture* (Paparazzi requires hardware controls — see spec 10) and *passive viewing* (a guest scrolling 2,000 photos benefits from a native gallery). For everything else — the invitation, the story, the RSVP, the schedule, the registry, the live stream watch page, the post-event Personal Reel builder — a responsive web surface is faster to ship, easier to update, and doesn't ask anyone to install anything.

The native app integrates *with* the landing page, not as an alternative to it. Paparazzi shoot in the app, but the photos they take land on the web landing page's gallery section. Guests scan a QR on a printed table tent, but the QR resolves to the web landing page. The web page is the trunk; native is one branch.

### What Changes vs. What's Already Specified

`07_V1_Developer_Specification.md` Section 6.1 describes the public landing page at a layout level: hero monogram, vertically-stacked sections, "View invitation →" CTA, Variation C styling. **This document supersedes nothing in spec 07** — it extends it. The new content here is:

1. The **couple's settings panel** for managing the page — every screen, every field, every default.
2. The **theme system** — six curated themes derived from `06_Couple_Landing_Page_Designs_v1.html`, what each theme gives you, what the couple can override.
3. The **lifecycle model** — draft, preview, publish, password-protect, soft-launch.
4. The **invitations integration** — how the page becomes the invitation, how guest QRs route here, how the couple sends the invitation link.
5. The **section system** — what each section module is, which are toggleable, which are mandatory.
6. The **cross-feature surface contract** — how Paparazzi gallery, Live Stream player, RSVP module, and registry plug into the page.

---

## Part 2 — Page Surface (Anatomy of the Landing Page)

### Single canonical URL

```
setnayan.com/[event-slug]
```

The slug is generated at event creation (default: `firstname-firstname-year`, e.g., `maria-juan-2026`) and is editable in the couple's settings panel until the day the event is published. After publish, slug edits create a 301 redirect from the old slug for 12 months.

The same URL renders different content based on who's viewing:

| Visitor state | Sees |
|---|---|
| Not logged in | Public landing page (story, schedule, venue, public RSVP CTA, public gallery if event is post-publish-window) |
| Logged in as a guest of this event | Personalized landing page (their RSVP status, their personal photo album link, their reel builder, their seating assignment) |
| Logged in as the couple of this event | Public landing page with a sticky "Edit page" admin bar at the top that opens the settings panel |
| Logged in as Setnayan Staff | Public landing page with a moderation overlay |

### Section anatomy (top to bottom)

> **Important:** the section list below describes the **Pre-Event mode** composition. The page actually has three distinct lifecycle modes (Pre-Event / Event Day / Post-Event) with substantially different sections in each mode. See **Part 10.5** for the full mode-specific composition. The page auto-switches modes based on the wedding date.

The Pre-Event page is composed of nine modules. Order is fixed except where noted; any toggleable module can be hidden by the couple without breaking the page.

1. **Top nav bar** (mandatory, non-toggleable) — minimal logo top-left + "Sign in" link top-right. Becomes "Edit page" for the couple.
2. **Hero** (mandatory) — monogram, couple names, wedding date, "View invitation →" CTA. Configurable: hero photo background, monogram style, names display, date format.
3. **Our Story** (toggleable, default ON) — long-form prose section. Configurable: cover photo, prose body, optional milestone timeline (how-we-met, proposal, engagement).
4. **Schedule / Run-of-show** (toggleable, default ON) — wedding-day timeline. Configurable: event blocks (mass, cocktail hour, reception, etc.), times, locations, dress codes per block. Auto-pulled from the couple's planning suite if entered there; can be overridden for public display.
5. **Venue** (toggleable, default ON) — venue name, address, embedded map, parking notes, getting-there tips. Configurable: ceremony venue + reception venue (separate cards if different), Setnayan-rendered Mapbox embed.
6. **Live Stream** (toggleable, default OFF, auto-enables when Live Stream SKU is purchased — see spec 09) — embedded stream player. Pre-event: "Live stream goes live in [countdown]." Post-event: replay or "Stream ended."
7. **RSVP** (mandatory, non-toggleable, but configurable) — gateway into the RSVP flow. Logged-in guests see their status; logged-out visitors see "View invitation →" which routes them to magic-link sign-in then RSVP.
8. **Gallery** (toggleable, default OFF, auto-enables when Paparazzi or any photo unlock is purchased — see spec 10) — live photo feed during event, full archive after. Pre-event: hidden or shows "Photos appear here on wedding day." Post-event: gallery + Personal Reel builder.
9. **Registry & Gifts** (toggleable, default OFF) — gift registry links (cash gift instructions in Filipino-typical format with bank/GCash details, or external registry URLs).
10. **Footer** (mandatory) — monogram + hashtag + "Powered by Setnayan" link (removable on Pro Event tier).

### Mobile responsive behavior

- ≥1024px: full desktop layout, side margins, two-column where designed
- 640–1023px: tablet, single-column, slightly smaller hero
- <640px: mobile, single-column, hero collapses to ~80vh, schedule/timeline becomes accordion

The Variation C styling from `06_Couple_Landing_Page_Designs_v1.html` is the V1 default. Hero monogram scales 1:1 with viewport width; couple names scale with `clamp(40px, 6vw, 96px)`.

---

## Part 3 — Couple Settings Panel (the Edit Experience)

The settings panel is where the couple shapes their landing page. It is reached from the couple dashboard (`setnayan.com/dashboard`) under **Settings → Landing Page**, and from the public page itself via the sticky "Edit page" admin bar that only the couple sees when they're logged in and viewing their own URL.

### Settings panel routing

```
setnayan.com/dashboard/landing-page          → settings panel home (Overview tab)
setnayan.com/dashboard/landing-page/theme    → Theme tab
setnayan.com/dashboard/landing-page/sections → Sections tab
setnayan.com/dashboard/landing-page/content  → Content tab (per-section editing)
setnayan.com/dashboard/landing-page/sharing  → Sharing & Privacy tab
setnayan.com/dashboard/landing-page/preview  → Live preview (split-screen on desktop, full-screen on mobile)
```

The panel is built with shadcn `<Tabs>` for navigation. Each tab is a single page with a sticky **Save** button bottom-right that turns into "Saved ✓" on success. Changes are autosaved as drafts every 5 seconds; **Publish** is a separate explicit button described in Part 5.

### 3.1 Overview tab

The landing page for the panel itself. Shows:

- **Page status banner** — Draft / Preview / Published (with timestamp of last publish)
- **Live URL** — `setnayan.com/[slug]` — clickable, opens in new tab; copy-button next to it
- **Current theme thumbnail** + "Change theme" button → routes to Theme tab
- **Section checklist** — green check next to each section that has content; orange warning next to any mandatory section (Hero, RSVP) that is missing required fields
- **Page health card** — RSVP responses to date, page view count (last 30 days), guest engagement
- **Quick actions** — "Send invitation link to all RSVP'd guests," "Export QR poster," "Schedule auto-publish"

### 3.2 Theme tab

Picker UI for the curated theme library + custom overrides.

**Theme grid:** 6 cards, each with a live preview thumbnail of how *this couple's* hero would render in that theme.

| Theme | Vibe | Type pairing | Palette |
|---|---|---|---|
| Modern Minimal | Clean, editorial, Vogue-cover energy | Instrument Serif + Geist | Off-white / charcoal / single accent |
| Filipino Heritage | Capiz, baybayin motifs, warm | Cormorant Garamond + Manrope | Cream / sampaguita white / champagne gold |
| Garden | Botanical illustration borders | Fraunces + Inter | Sage / blush / ivory |
| Beach | Light, breezy, palm silhouette accents | Cormorant + Manrope | Seafoam / sand / sun-bleached white |
| Catholic Classic | Traditional, mass-first, parchment | Cormorant Garamond + Manrope | Parchment / gold leaf / oxblood |
| Modern Pinoy | Contemporary, monochrome with Filipino motifs | Fraunces + Geist | Black / off-white / single neon accent |

The default for new events is **Filipino Heritage** (matches the Variation C from the design mockup).

**Override controls (all tiers):**

- Primary accent color (color picker, defaults to theme's accent)
- Hero photo (upload + crop, max 6 photos for slideshow on Premium/Pro)
- Monogram style (Auto-generated from initials | Initials only | Couple's chosen motif from a set of 24)

**Override controls (Premium/Pro only):**

- Custom font pairing (heading + body) from a curated list of 12 Google Font pairs
- Custom CSS accent (single CSS variable: `--accent-soft`) for tier-Pro power users

The system intentionally does not allow free-form CSS injection. The risk of an ugly couple-built page hurting the brand outweighs the customization value.

### 3.3 Sections tab

Toggles, reorder, and per-section visibility for guest views.

For each toggleable section (Story, Schedule, Venue, Live Stream, Gallery, Registry):

- **Visibility toggle** — On / Off
- **Visibility scope** — Public to anyone with URL | RSVP'd guests only | Specific guest groups (family, friends, vendors)
- **Order** — drag handle to reorder; mandatory sections (Hero, RSVP, Footer) are pinned and cannot be reordered

Sections that depend on a feature unlock (Live Stream → spec 09 SKU; Gallery → Paparazzi or any photo unlock → spec 10 SKU) are visually grayed out with a "Unlock to enable" CTA if the feature isn't purchased.

### 3.4 Content tab

Per-section content editing. Each section has its own sub-route:

#### Hero
- Couple names (two text inputs, "Maria" and "Juan"; rendered as "Maria & Juan" with optional "&"/"and"/"at"/"y" connector)
- Wedding date (date picker, auto-pulled from the event; format selector: long, short, ISO)
- Tagline (optional, ≤80 chars, e.g., "We're getting married!")
- Hero photo upload (1 or up to 6 for slideshow on Premium/Pro)
- "View invitation" CTA label (default "View invitation →"; editable, ≤24 chars)

#### Our Story
- Cover photo (upload, optional)
- Prose body (rich-text editor — bold, italic, headings, paragraph breaks; max 2,000 chars)
- Optional milestone timeline (add/remove rows: date + headline + 1-sentence body, e.g., "March 2021 — We met at a friend's despedida")
- AI-assisted draft button (Premium/Pro only) — opens a Claude Sonnet prompt-builder: "Tell me how you met, your proposal, and what you're most excited about. I'll draft a story you can edit." Output lands in the rich-text editor, fully editable.

#### Schedule
- Auto-import button — pulls the day-of run-of-show from the couple's planning suite
- Manual entry — add/remove blocks: time + title + location + dress code + description
- "Show this to public" toggle per block (some couples want vendor-only blocks hidden from guests)

#### Venue
- Ceremony venue card: name, address (autocomplete via Mapbox), parking notes, getting-there tips (≤200 chars)
- Reception venue card (if same as ceremony, single card; if different, two cards)
- Embedded map preview (Mapbox-rendered SVG snapshot, lazy-loads to interactive map on scroll-into-view)

#### Live Stream
- Linked Live Stream event (auto-populated from spec 09 purchase)
- Pre-event embed: countdown timer + "Live stream starts at [time]"
- During event: live player
- Post-event: replay or "Stream ended" copy

#### Gallery
- Linked Paparazzi event (auto-populated from spec 10 purchase)
- Public unlock window: 0, 7, 14 days post-event (default 7, configurable from spec 10)
- Featured photo (optional, pinned to top of public gallery)

#### RSVP
- RSVP deadline (date picker)
- "RSVP closed" copy (when deadline has passed)
- Plus-one policy: All guests get +1 | By invitation only | No plus-ones
- Dietary restrictions field on/off
- Custom RSVP question (≤120 chars, optional, e.g., "Will you attend the after-party?")

#### Registry
- Section heading (default "Gifts")
- Body copy (rich-text, ≤500 chars; suggested template: "Your presence is the best gift. If you'd like to bless us further, we humbly ask…")
- Cash gift method: GCash, BPI, BDO, UnionBank (each is a card with name + account number; max 3 methods)
- External registry links (label + URL; max 3, validated against an allowlist of known registry domains: SM Gift Card, Rustan's, Crate & Barrel PH, etc.)

### 3.5 Sharing & Privacy tab

How the page is exposed to the world.

- **Page mode**:
  - **Public** — anyone with the URL can view (default after Publish)
  - **Password-protected** — visitors land on a password gate; password set by couple, single shared password
  - **RSVP'd guests only** — visitors must sign in and be on the guest list; non-guests get a "This page is private" notice
- **Custom domain** (Premium/Pro only) — DNS instructions for connecting `mariaandjuan.com` (CNAME setup; SSL cert auto-provisioned via Cloudflare)
- **Search engine indexing** — toggle: "Allow Google to index this page" (default OFF; turning ON adds `index, follow` meta and submits to sitemap)
- **Open Graph image** — auto-rendered from hero photo + monogram; preview of how the link looks when shared on Messenger, Viber, Facebook, iMessage
- **QR poster export** — generates a printable PDF with the couple's monogram + URL + QR code (formats: A4, Letter, 4×6 save-the-date card)

---

## Part 4 — Theme System

### Design philosophy

Themes are not just color swaps. Each theme defines:

- A type pairing (heading font + body font, both from Google Fonts)
- A palette (page background, ink, ink-soft, accent, accent-soft, rule color)
- A monogram template (geometric, ornamental, calligraphic, etc.)
- Section background styles (parchment texture, solid, gradient)
- Hero composition (centered, left-aligned, photo-overlay, monogram-only)

A theme is implemented as a Tailwind config variant + a React layout component variant. The same content (couple names, story, schedule) renders correctly in any theme without the couple having to re-enter anything.

### Theme schema

Each theme is a JSON manifest stored in the codebase under `/themes/{theme_id}.json`:

```json
{
  "theme_id": "filipino_heritage",
  "name": "Filipino Heritage",
  "description": "Capiz, baybayin motifs, warm cream and champagne gold.",
  "fonts": {
    "heading": "Cormorant Garamond",
    "body": "Manrope"
  },
  "palette": {
    "page_bg": "#FAF6F0",
    "ink": "#1A1A1A",
    "ink_soft": "#6B6B6B",
    "accent": "#C97B4B",
    "accent_soft": "#E8C9B0",
    "rule": "rgba(26, 26, 26, 0.08)"
  },
  "monogram_style": "ornamental_filipino",
  "hero_composition": "centered_monogram",
  "section_bg_style": "solid_warm",
  "preview_thumbnail": "/themes/filipino_heritage/thumbnail.png"
}
```

The settings panel reads this manifest to render the theme picker; the page renderer reads it to build the layout.

### Custom monogram generation

A custom SVG monogram is generated for every couple at event creation, derived from:

- The couple's initials (M & J → renders an "M" + "J" composition)
- The selected theme's `monogram_style` (e.g., `ornamental_filipino` adds capiz-shell-inspired curves; `geometric_modern` uses straight lines and right angles)
- Optional motif from a curated set of 24 (sampaguita, capiz, ring, palm, dove, calla lily, etc.)

The monogram is stored as `events.monogram_svg` (raw SVG markup) and can be regenerated whenever the couple changes initials or theme. The SVG is also exported as a PDF in the QR poster output.

A separate monogram-generator brief lives in `07_V1_Developer_Specification.md` Section 17 (logo / monogram design open task).

---

## Part 5 — Visibility & Lifecycle

### Lifecycle states

```
draft  →  preview  →  published  →  archived
```

| State | Who can see it | URL behavior |
|---|---|---|
| **draft** | Couple only (logged in) | `setnayan.com/[slug]` redirects to `setnayan.com/dashboard` for non-couple visitors with a "This page isn't ready yet" notice |
| **preview** | Couple + anyone with the preview link (`setnayan.com/[slug]?preview=[token]`) | Public URL still in draft; preview link bypasses the gate. Useful for showing the page to parents before publish. |
| **published** | Per the page's Sharing & Privacy mode (Public, Password-protected, or RSVP'd guests only) | Public URL is live |
| **archived** | Couple only (read-only) | URL renders an "This wedding has concluded" page with a link to the gallery (if photo unlock was purchased and within retention window) |

### Publishing flow

1. Couple drafts in the settings panel; autosave keeps the draft fresh
2. Couple hits **Preview** → generates a preview link they can share (link expires in 7 days unless re-issued)
3. Couple hits **Publish** → modal asks: "Publish your landing page to `setnayan.com/[slug]`? Anyone with the URL will be able to see it." Couple confirms, page goes live.
4. Optional: couple can schedule auto-publish for a future date (e.g., "Publish on 2026-08-01 — invitation send date")

### Post-event archival

Sixty days after the wedding date, the page automatically transitions from **published** to **archived**:

- Hero, story, schedule, venue, RSVP all become read-only
- Gallery section remains active per the Paparazzi 5-year retention policy (spec 10)
- Live Stream section shows replay (per spec 09 retention)
- Couple can manually reactivate to **published** (e.g., for an anniversary post)

### The Editorial — Your Front-Page Story (positioning · owner-stated 2026-06-14)

> The post-event phase of the page is the **Editorial** — *the front-page story of your life.* It tells the story of how the day went, and unlike a newspaper it doesn't keep that story in still photos alone: it holds **moments** — short videos of the night, photos and short clips of people enjoying themselves, and **guests telling you their true best wishes.** It is **a place to keep everything, not just photos** — *"like Harry Potter's newspaper, but now it's ours."*

Three things make it that:

- **A living, moving page** — figures in the story are silent looping videos that come alive (tap for sound), with short clips and a moving front-page frame — the *Daily Prophet* feel. (Mechanics: the "Daily Prophet rule" + front-page newspaper engine + Living-Moments strip in `03_Strategy/Wedding_Website_Effects_and_Editing_Spec_2026-06-11.md`.)
- **Your guests' words** — the best wishes guests leave (Kwento) surface as pull-quotes in the story, so the people who were there help tell it.
- **Printable, with a QR back to the living story** — a printable keepsake version is generated, carrying a QR that the couple and every guest can scan to always return to the full, moving Editorial online. (Mechanics: the PDF keepsake, effects-spec build-order ④.)

This is the **destination** where Papic's moments, Panood's broadcast, and Kwento's words come to rest as one keepsake. It stays **money-free** — the front-page story of the day, never a show of what was spent. (⚠ Not to be confused with iteration **0038 "Editorial & Affiliates,"** which is the platform's marketing blog — a different "Editorial.")

### Soft-launch URL pattern

For couples who want to send a "save the date" but aren't ready to publish full content, a soft-launch URL is supported:

`setnayan.com/[slug]/save-the-date` — a stripped-down page showing only the hero (couple names + date + monogram + "Full invitation coming soon"). Auto-generated when the couple creates the event; doesn't require any settings panel work.

---

## Part 6 — Invitations Integration

The landing page is the invitation. There is no separate "invitation document" — the URL replaces the printed card.

### How couples send the invitation

The couple sends invitations from `dashboard → Guests → Send invitations`. The flow:

1. Couple selects guest groups (Family, Friends, Office, Vendors, etc.)
2. Couple chooses delivery channel(s): Email | SMS | Messenger (via shared link) | Printed QR
3. Couple picks an invitation template (3 default templates, lightly customizable: heading, body, sign-off)
4. System generates a personalized link per guest: `setnayan.com/[slug]?invite=[guest_qr_token]`
5. Email / SMS goes out with that link; clicking auto-signs the guest in (magic link) and routes them straight to the RSVP module

Per `07_V1_Developer_Specification.md` Section 5, every guest already has a `qr_token` issued at guest-list creation. The landing page reuses the same token — no new token system.

### Printed save-the-date / invitation cards

Couples can export a printable QR poster (Settings → Sharing → Export QR poster). Three formats:

- **A4 printable invitation insert** — designed to be slipped into a mailed envelope; one side has the couple's monogram + URL + QR; the other side is left blank for the formal printed invitation.
- **Letter-size invitation insert** — same as above for couples who print US-format.
- **4×6 save-the-date card** — full-bleed photo + monogram + date + QR code in the bottom-right corner.

The PDFs are rendered on-demand server-side using `react-pdf` and Cloudflare R2 for asset hosting.

### Guest landing experience after invite

When a guest opens their personalized link:

1. URL resolves with `?invite=[token]` query param
2. Server validates the token, signs the guest in via cookie session
3. URL is rewritten (cookie set, query param dropped, history replaced) to clean `setnayan.com/[slug]`
4. Page renders with the **logged-in-as-guest** view: their RSVP status pinned at top, a personalized "Hi [first name]! Maria & Juan would love to see you on October 24th" greeting in the hero
5. Scroll to RSVP section auto-scrolls if `?goto=rsvp` is appended (used for follow-up reminder emails)

### Invitation reminder flow

If a guest hasn't RSVP'd 14 days after invite send, the system auto-emails a reminder with the same magic link. Couples can disable this in Settings → Sharing → Reminders, or trigger a manual reminder send for non-responders.

---

## Part 7 — Cross-Feature Surfaces

The landing page is the canonical home for surfaces from other Setnayan features. This section defines the contract — what the landing page renders, what each feature spec owns.

### RSVP module

- **Owned by:** the planning suite (spec 07 Section 5–6)
- **Rendered on landing page:** the RSVP section is a thin shell that mounts the RSVP form. Logged-in guests see their current status with edit capability; logged-out visitors see the "View invitation →" CTA.
- **Settings panel surface:** RSVP deadline, plus-one policy, dietary restrictions, custom question (per Part 3.4 Content tab)

### Live Stream embed

- **Owned by:** spec 09
- **Rendered on landing page:** when the couple has purchased a Live Stream SKU, the Live Stream section auto-enables. Pre-event: countdown. During event: HLS player. Post-event: replay player or "Stream ended" copy.
- **Settings panel surface:** the section toggle (on/off), but most fields are owned by the Live Stream settings panel (`dashboard/live-stream`).

### Paparazzi gallery + Personal Reel builder

- **Owned by:** spec 10
- **Rendered on landing page:** when any Paparazzi unlock is purchased, the Gallery section auto-enables. Pre-event: hidden. During event: live photo feed (only visible to couple in admin mode unless real-time public-feed mode is enabled). Post-event (after the configured 0/7/14-day window): full gallery + per-guest Personal Reel builder.
- **Settings panel surface:** public unlock window timing, featured photo selection, per-guest album visibility (defaults to "tagged guests can see their own album").

### Couple's planning data → public Schedule section

- **Owned by:** the planning suite (spec 07)
- **Rendered on landing page:** the Schedule section can auto-import the couple's day-of run-of-show. Each block has a "Show this on the public page" toggle so the couple can hide vendor logistics from guests.

### Registry

- **Owned by:** the landing page itself (no separate feature spec). Registry data lives on the `events.registry_*` columns.
- **Rendered on landing page:** Registry section. Cash gift methods + external registry links per Part 3.4.

---

## Part 8 — Data Model

### Tables added

```sql
-- Landing page settings, one row per event
CREATE TABLE landing_page_settings (
  event_id          UUID PRIMARY KEY REFERENCES events(event_id) ON DELETE CASCADE,
  theme_id          TEXT NOT NULL DEFAULT 'filipino_heritage',
  accent_color      TEXT,                    -- hex, optional override
  monogram_style    TEXT NOT NULL DEFAULT 'auto',
  monogram_motif    TEXT,                    -- e.g., 'sampaguita', 'capiz'
  custom_font_pair  TEXT,                    -- Premium/Pro only, references /fonts/*.json
  page_status       TEXT NOT NULL DEFAULT 'draft', -- draft | preview | published | archived
  page_mode         TEXT NOT NULL DEFAULT 'public', -- public | password | guests_only
  page_password_hash TEXT,                   -- bcrypt, only set when page_mode = 'password'
  custom_domain     TEXT,                    -- Premium/Pro, e.g., 'mariaandjuan.com'
  domain_verified_at TIMESTAMPTZ,
  search_engine_indexable BOOLEAN NOT NULL DEFAULT FALSE,
  hide_powered_by   BOOLEAN NOT NULL DEFAULT FALSE, -- Pro Event only
  published_at      TIMESTAMPTZ,
  scheduled_publish_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Per-section settings, one row per (event_id, section_key)
CREATE TABLE landing_page_sections (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id          UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  section_key       TEXT NOT NULL, -- 'hero' | 'story' | 'schedule' | 'venue' | 'live_stream' | 'gallery' | 'rsvp' | 'registry'
  is_enabled        BOOLEAN NOT NULL DEFAULT TRUE,
  visibility_scope  TEXT NOT NULL DEFAULT 'public', -- public | rsvp_guests | specific_groups
  visibility_groups TEXT[],                         -- if scope = 'specific_groups'
  display_order     INT NOT NULL,
  content_json      JSONB NOT NULL DEFAULT '{}',   -- per-section schema (see below)
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, section_key)
);

-- Hero photos (slideshow on Premium/Pro)
CREATE TABLE landing_page_hero_photos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  r2_object_key TEXT NOT NULL,
  display_order INT NOT NULL,
  alt_text      TEXT,
  uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Preview tokens (time-limited)
CREATE TABLE landing_page_preview_tokens (
  token         TEXT PRIMARY KEY,
  event_id      UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Existing table extensions

```sql
ALTER TABLE events ADD COLUMN slug TEXT UNIQUE NOT NULL;
ALTER TABLE events ADD COLUMN monogram_svg TEXT;            -- raw SVG, regenerated on theme/initials change
ALTER TABLE events ADD COLUMN registry_json JSONB DEFAULT '{}'; -- gift methods, registry links
ALTER TABLE events ADD COLUMN slug_redirects JSONB DEFAULT '[]'; -- old-slug → new-slug for 12mo
```

### Per-section `content_json` schemas

Each section's `content_json` follows a section-specific JSON schema validated by Zod on the backend. Examples:

```ts
// hero.content_json
{
  couple_names: { partner_a: string, partner_b: string, connector: '&' | 'and' | 'at' | 'y' },
  date_format: 'long' | 'short' | 'iso',
  tagline?: string,        // ≤80 chars
  cta_label?: string       // ≤24 chars
}

// story.content_json
{
  cover_photo_r2_key?: string,
  prose_html: string,      // sanitized HTML, ≤2,000 chars rendered
  milestones?: Array<{ date: string, headline: string, body: string }>
}

// schedule.content_json
{
  blocks: Array<{
    block_id: string,
    time_local: string,    // ISO 8601
    title: string,
    location?: string,
    dress_code?: string,
    description?: string,
    show_on_public: boolean
  }>,
  auto_imported_from_planning: boolean
}

// venue.content_json
{
  ceremony: { name: string, address: string, lat: number, lng: number, parking?: string, tips?: string },
  reception?: { ... }      // optional, omit if same as ceremony
}

// registry.content_json
{
  heading?: string,        // default "Gifts"
  body_html?: string,      // ≤500 chars rendered
  cash_methods: Array<{ provider: 'GCash' | 'BPI' | 'BDO' | 'UnionBank', account_name: string, account_number: string }>,
  external_registries: Array<{ label: string, url: string }>
}
```

---

## Part 9 — SEO, Sharing, and Open Graph

### Default behavior

Unless the couple turns on search-engine indexing, every landing page is rendered with:

```html
<meta name="robots" content="noindex, nofollow">
```

This protects guest privacy by default — a wedding guest list and venue address shouldn't be Googleable unless the couple explicitly wants it to be.

### Open Graph metadata

Every page renders rich OG tags so the URL previews well in Messenger, Viber, Facebook, iMessage, and Discord:

```html
<meta property="og:title" content="Maria & Juan — October 24, 2026">
<meta property="og:description" content="We're getting married! Tap to RSVP.">
<meta property="og:image" content="https://og.setnayan.com/[event-slug].png">
<meta property="og:url" content="https://setnayan.com/maria-juan-2026">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

The OG image is rendered on-demand by a Cloudflare Worker (`og.setnayan.com`) using `@vercel/og` — composes the couple's monogram + names + date over the hero photo. Cached at the edge for 24 hours; cache-busted when the couple changes hero photo or theme.

### Canonical URL handling

- The canonical URL for the page is always `https://setnayan.com/[slug]` (HTTPS, no trailing slash, lowercase slug)
- Custom domains (Premium/Pro) render with their own domain as canonical
- Old slugs after a slug edit return 301 to the new slug for 12 months, then 410 Gone

### Page performance targets

Per `07_V1_Developer_Specification.md` Section 12, the public landing page must hit:

- Lighthouse 90+ (mobile + desktop)
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

Implementation strategy: SSR via Next.js 15 RSC, hero image preloaded, monogram inlined as SVG, deferred JS for the gallery feed and live stream player.

---

## Part 10 — Privacy & Access Control

### Per-section visibility scope

Every toggleable section can be scoped to one of three audiences:

- **Public** — anyone with the URL
- **RSVP'd guests only** — must be signed in and on the guest list
- **Specific guest groups** — e.g., Family-only Story, vendor-only Schedule blocks

Scope enforcement is server-side at render time. The page never ships content to the client that the visitor isn't authorized to see.

### Page-level access modes

- **Public** — default after publish
- **Password-protected** — single shared password (bcrypt-hashed); password-gated route, cookie sets a 24-hour session
- **RSVP'd guests only** — magic-link sign-in required; non-guests get "This page is private. If you believe you should have access, contact the couple."

### Personal data on the page

The landing page never displays any guest's personal data publicly. The guest list, RSVP details, and dietary restrictions are visible only to the couple and Setnayan Staff (per `07_V1_Developer_Specification.md` Section 5 RLS policies).

### PH Data Privacy Act (RA 10173) compliance

The landing page inherits the Setnayan platform's DPA compliance posture (per spec 10 privacy section): guest consent at RSVP, opt-out flow, data residency in PH-region storage, 5-year retention for photos. The landing page itself stores no additional sensitive personal data.

### Couple ownership and offboarding

If a couple deletes their event, all `landing_page_*` rows cascade-delete. If a couple wants to keep the page after the wedding (e.g., as a memento), they can set the page state to `archived` indefinitely. Archived pages remain reachable at the canonical URL with read-only content.

---

## Part 10.5 — Lifecycle Modes (Pre-Event / Event Day / Post-Event)

The landing page is not a single static surface. It auto-switches through three distinct modes as the wedding date approaches and passes. Each mode rearranges the page so the right content is in front of guests at the right time.

### Mode 1 — Pre-Event (default until wedding-start time)

**Active from:** the moment the page is published.
**Switches to Event Day at:** the wedding's official start time (the first scheduled item, typically the Nuptial Mass start time).

**Sections shown (top to bottom):**

1. Hero with monogram, names, date, **countdown** (days / hours / minutes)
2. Our Story / Theme of the wedding
3. **Color Palette** — 5 swatches + dress-code guidance (e.g., "please dress in cream, capiz, or champagne")
4. **What We Request** — RSVP deadline, arrival time, Sulyap download, gift expectations
5. Schedule
6. Venue
7. **Do's &amp; Don'ts** — Filipino-Catholic etiquette guide for guests (no white attire, no flash during Mass, etc.)
8. Gifts &amp; Blessings
9. RSVP

The Pre-Event mode emphasizes *preparation*. Sections like "What We Request" and "Do's &amp; Don'ts" don't appear in any other mode — they exist to help guests show up correctly.

### Mode 2 — Event Day (auto-switches when the wedding starts)

**Active from:** the wedding's official start time.
**Switches to Post-Event at:** event end time + 4 hours buffer (configurable; default ends at 2:00 AM the day after).

**Sections shown (top to bottom):**

1. **Live Now banner** — full-width dark band at the top showing the currently-active schedule item (e.g., "HAPPENING NOW · Reception &amp; Dinner — Rigodon Ballroom · 7:42 PM · Up next: Dancing at 9:00")
2. **Sulyap CTA** — large hero card inviting guests to open the Sulyap app (deep-link `sulyap://event/[event-id]?guest=[token]` with App Store / Play Store fallback)
3. **Live Gallery** — real-time photo feed (4-column tile grid), counter ("247 photos · 18 clips · uploaded by 5 paparazzi and 32 guests"), "View full gallery →" link
4. **Live Stream** (if SKU purchased) — active player, "Live now · 1,238 watching"
5. **Live Schedule** — same blocks as Pre-Event but with the *current item highlighted* (red "HAPPENING NOW" pill, struck-through completed items, faded future items)
6. Gifts &amp; Blessings — still present, useful for late blessings during the reception

The Pre-Event sections (countdown, Our Story, Palette, What We Request, Do's &amp; Don'ts, Venue, RSVP) are *all hidden during Event Day*. They've served their purpose. The page is now a real-time companion — what's happening, where the photos are, how to capture more.

### Mode 3 — Post-Event (auto-switches after event end time)

**Active from:** event end time + 4 hours.
**Stays active for:** 90 days, after which the page transitions to **archived** (read-only).

**Sections shown (top to bottom):**

1. **Thank-You Hero** — replaces the wedding-date hero with "Salamat po · for celebrating with us on October 24th, 2026 — Maria &amp; Juan"
2. **Wedding Summary** — by-the-numbers card: guests attended, photos taken, clips captured, hours together; closes with a thank-you quote
3. **Download Your Photos** — guest-facing CTA: "We tagged you in 38 photos and 4 clips. Sign in &amp; download." Includes a **prominent 90-day countdown** ("Available until 24 January 2027 · 89 days remaining")
4. **Live Stream Replay** (if recorded) — replay player with retention deadline
5. **Create Your Setnayan Account** — full-width dark conversion card aimed at *guests*, not the couple. Pitches a free Setnayan account so guests can keep their tagged photos forever (past the 90-day window), build their own wedding album across every wedding they attend, and have an account ready when it's their turn to plan a wedding.

The Post-Event mode has two jobs: *gratitude* and *guest acquisition*. The 90-day download window is intentionally finite to create urgency around the Create-Account CTA — guests who don't sign up lose their photos when the window closes.

### Auto-switch logic

```ts
function getCurrentMode(event): 'pre' | 'event' | 'post' | 'archived' {
  const now = Date.now();
  const wedding_start = event.first_schedule_block_start_at;
  const wedding_end = event.last_schedule_block_end_at;
  const event_buffer_ms = 4 * 60 * 60 * 1000;        // 4 hours after end
  const post_event_window_ms = 90 * 24 * 60 * 60 * 1000; // 90 days

  if (now < wedding_start) return 'pre';
  if (now < wedding_end + event_buffer_ms) return 'event';
  if (now < wedding_end + event_buffer_ms + post_event_window_ms) return 'post';
  return 'archived';
}
```

The mode is computed server-side at render time. The same URL (`setnayan.com/[slug]`) returns different HTML depending on `getCurrentMode(event)`. There is no client-side mode toggle in production — the demo HTML at `16_Couple_Landing_Page_Live.html` includes a switcher purely for design review.

The couple can manually override the mode in Settings → Mode &amp; Lifecycle (e.g., to enter Event Day mode early for a rehearsal preview, or to extend Post-Event mode past 90 days for an anniversary post). Manual overrides are sticky until the couple resets to "auto."

---

## Part 10.6 — Sulyap (the Setnayan Capture App)

### Branding

**Sulyap** (Filipino: "glimpse") is the brand name for the Setnayan native capture app. It is the same native iOS / Android app described in `10_Papic_Feature_Specification.md` — Paparazzi is the *feature* (the seat-based capture role); Sulyap is the *product name* of the app that hosts that feature plus the broader candid-capture surface available to all guests.

The landing page references the app exclusively as "Sulyap." The word "Paparazzi" is reserved for paid seat tier descriptions in pricing surfaces and internal documentation.

### Sulyap on the landing page

During Event Day mode, the landing page surfaces Sulyap as a primary CTA card. The card includes:

- A short pitch (e.g., "Take photos that auto-tag to you")
- An "Open Sulyap →" button
- A phone-mockup illustration of the app's scan-to-tag camera screen
- App Store / Google Play download links beneath the primary button

### Deep-link contract

The landing page's "Open Sulyap" button uses a universal-link / app-link scheme:

```
sulyap://event/[event_id]?guest=[guest_qr_token]
```

- iOS: handled via Universal Links registered on `setnayan.com` (so the link opens the app if installed; falls back to App Store)
- Android: handled via App Links with the `assetlinks.json` entry on `setnayan.com`

The `guest_qr_token` query param is the same token the guest received in their RSVP invitation. When Sulyap opens, the app validates the token, signs the user in, and binds all subsequent captures to that user's identity.

### Photo auto-tagging

Once a guest is signed in to Sulyap via the deep-link:

1. Every photo or clip the guest captures is automatically tagged with their identity as the *photographer* (`Photo.taken_by_user_id`)
2. The photo lands in the event's shared gallery on the landing page
3. The photo also lands in the photographer's personal album (their own copy)
4. If the photographer scans another guest's QR while in the capture flow, that scanned guest is added to `PhotoTag` as a *subject* of the photo

This is distinct from Paparazzi seats: paparazzi are *paid roles* limited to 3 or 5 designated phones with enhanced capture controls. Sulyap is the *app* — paparazzi shoot in Sulyap, but so can any guest who downloads it during the event. Guests get standard capture mode; paparazzi seats get enhanced mode (manual exposure, burst, silent shutter, low-light boost).

### QR scanning context behaviors

The same QR code (e.g., a guest's personal QR on their place card) behaves differently depending on what is doing the scanning. This is a critical UX decision — the QR is universal, but the context determines the action.

| Scanning context | Action |
|---|---|
| **Phone camera (default OS scanner)** → opens browser | Browser navigates to `setnayan.com/[slug]?invite=[token]` — the landing page (with mode-aware rendering) |
| **Sulyap app scanner** | Tags the scanned person on the most recent photo (or the next photo about to be taken). **Does NOT open a URL.** Tag is persisted to `PhotoTag` immediately. |
| **Setnayan Vendor app scanner** | Marks the vendor's service line item complete for that table or event scope. **Does NOT open a URL.** POSTs to `/vendor/services/complete` with the QR token + vendor ID. |
| **Setnayan Coordinator app scanner** | Logs the guest's check-in time / table arrival. **Does NOT open a URL.** Useful for tracking attendance against the RSVP list. |

The QR token is identical in every context; the *scanning surface* decides the action. This is implemented via each app's barcode scanner intercepting the token before the OS's URL handler fires. The native apps register themselves as preferred handlers for `setnayan:` and `sulyap:` URI schemes.

The QR payload format is unified:

```
setnayan://[entity_type]/[entity_id]?token=[token]
```

where `entity_type` is `guest`, `table`, `vendor_service`, `event`, etc. The native apps parse the entity type and route to the appropriate handler; browsers fall back to fetching `https://setnayan.com/[slug]?invite=[token]` and rendering the landing page.

---

## Part 10.7 — Vendor Service-Completion QR Flow

A new sub-feature is introduced alongside the lifecycle modes: vendors mark service delivery complete by scanning the event's QR code with the Setnayan Vendor app. This flow is owned conceptually by the Vendor surface (spec 07 Section 6.6) but is described here because it shares the QR-scan-context architecture documented in Part 10.6.

### Flow

1. Vendor arrives at the venue on the wedding day with the Setnayan Vendor app open
2. Vendor opens **Today's Service** in the app — a checklist of deliverables they've contracted to provide for this wedding (e.g., "Floral arrangements: 6 centerpieces · ceremony arch · bridal bouquet")
3. Each line item has a "Mark complete" action that opens the QR scanner
4. Vendor scans the printed event QR (provided by the couple, often posted at the vendor coordination table or the wedding planner's clipboard)
5. The app POSTs to `/vendor/services/complete` with `{ vendor_id, event_id, service_line_id, scanned_token, timestamp, location_lat, location_lng }`
6. The backend validates the token belongs to the event and that the vendor is contracted for this service
7. The line item is marked complete; the couple's dashboard updates in real time; an automatic confirmation message goes to the couple ("Vinta Florals marked Floral Arrangements complete at 1:14 PM")

### Why a QR-based confirmation matters

- **Removes ambiguity** about whether a vendor delivered. Couples often face "did the cake get there?" anxiety on the wedding day; a QR-scan confirmation removes that.
- **Creates a verifiable audit trail** for any payment dispute. The vendor's mark-complete action is timestamped and geo-tagged, so the couple can pay on delivery confidence.
- **Frees the coordinator** from manually checking off a clipboard. The clipboard is in the app.

### Settings on the couple's side

The couple toggles vendor service-completion tracking in their planning suite (not the landing page settings). It's on by default for any contract booked through Setnayan. Vendors who refuse to participate (rare; usually older, non-tech vendors) have their services marked manually by the coordinator on the couple's behalf.

The landing page itself does *not* surface vendor service status to guests. This data is private to the couple, the coordinator, and Setnayan Staff.

---

## Part 11 — Out of V1 Scope

These are deferred. They are valuable but expand surface area beyond what V1 needs.

- **Drag-and-drop full builder** — V2. The V1 model is theme + section toggles + content forms; no free-form layout.
- **Multilingual landing pages** — V1.5. Spanish, Tagalog, Bisaya, Ilocano localized content surfaces. V1 ships English-only.
- **Custom CSS / HTML injection** — never. The brand risk and security risk outweigh the customization value for couples who want it.
- **Live RSVP counter on public page** — V2. The data exists but couples have privacy concerns ("don't show grandma that 12 people declined").
- **Embedded video on Story section** — V2. Hero video on Premium/Pro is supported; Story video is deferred.
- **Multiple landing pages per event** (e.g., one for the wedding, one for the after-party) — never planned. One event, one URL.
- **Couple-side analytics dashboard** (page views, RSVP funnel conversion, etc.) — V1.5. The Overview tab shows basic counts; full analytics is a later add.
- **Per-guest custom landing page content** (e.g., different schedule for the entourage vs. friends) — V1.5. The visibility-scope mechanism gets us 80% of the way there for V1.

---

## Part 12 — Decision Log

| Date | Decision | Why |
|---|---|---|
| 2026-05-08 | Landing page is web-only, not native | A wedding invitation must open from any messaging app on any device without an install gate |
| 2026-05-08 | Theme + section-toggles model (not full builder) | Fastest to ship; protects brand quality; couples don't need a full WYSIWYG to send an invitation |
| 2026-05-08 | Filipino Heritage as default theme | Matches Variation C in `06_Couple_Landing_Page_Designs_v1.html`, aligns with Filipino-Catholic-first positioning |
| 2026-05-08 | Six curated themes for V1 (not infinite) | Quality of theme set matters more than quantity; six covers the spread from minimal-modern to Catholic-classic |
| 2026-05-08 | Draft → Preview → Publish lifecycle | Standard pattern; couple wants to share with parents before going live |
| 2026-05-08 | `noindex` by default, opt-in to search-engine indexing | Privacy by default — guest lists and venue addresses shouldn't be Googleable |
| 2026-05-08 | Custom domains gated to Premium/Pro tiers | Domain provisioning has real DNS support cost; reserves the feature for higher-revenue tiers |
| 2026-05-08 | One canonical URL per event (no per-guest URLs) | Simpler mental model; per-guest invite tokens append `?invite=` to the same URL |
| 2026-05-08 | Cash gift methods are first-class registry section | Filipino weddings overwhelmingly use cash gifts; treating them as "external" is wrong for the market |
| 2026-05-08 | Auto-archive 60 days post-event | Couples often want to keep the page as a memento; archive (read-only) preserves it without burdening the couple to maintain it |
| 2026-05-08 | Three-mode lifecycle (Pre-Event / Event Day / Post-Event) with auto-switch | The page's job changes radically across the wedding lifecycle — pre-event is preparation, event-day is real-time companion, post-event is gratitude + guest acquisition. One static page would either over-show or under-show content at every stage. |
| 2026-05-08 | Sulyap = brand name for the Setnayan capture app | "Paparazzi" is internal product taxonomy; Sulyap (Filipino: glimpse) is what guests see and download. Distinguishes the *app* (Sulyap) from the *paid seat tier* (Paparazzi) cleanly. |
| 2026-05-08 | QR scanning is context-aware (Sulyap=tag, Vendor=complete, Browser=URL) | One QR token, three different surfaces, three different actions. Eliminates the need for separate QR types per use case — the scanning app decides what the scan means. |
| 2026-05-08 | Photo download window post-event = 90 days | Long enough that guests don't lose their photos to forgetfulness; short enough that the Create-Account CTA has urgency. Aligns with R2 hot-storage default cost band. |
| 2026-05-08 | Post-Event mode includes a Create-Setnayan-Account CTA aimed at guests | Best moment in a guest's lifecycle to convert them — they just had a meaningful wedding experience, they have tagged photos they want to keep, and the 90-day deadline creates urgency. |
| 2026-05-08 | Vendor service-completion via QR scan | Removes "did the vendor show up" anxiety on wedding day; creates auditable delivery trail; replaces coordinator's clipboard with timestamped, geo-tagged digital confirmation. |

---

## Companion Documents

- `07_V1_Developer_Specification.md` — overall V1 dev spec; Section 6.1 covers the public landing page layout at a higher level; Section 5 covers RSVP, guest QR tokens, and `events` table
- `09_Panood_Feature_Specification.md` — Live Stream feature; the landing page hosts the embed surface
- `10_Papic_Feature_Specification.md` — Paparazzi feature; the landing page hosts the gallery + Personal Reel builder surface
- `06_Couple_Landing_Page_Designs_v1.html` — three design variations; Variation C is the V1 default theme (Filipino Heritage)
- `13_Engineering_Brief.docx` — overall Setnayan engineering high-level brief
