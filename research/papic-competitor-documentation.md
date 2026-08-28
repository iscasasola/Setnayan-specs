# Papic — Competitor Documentation

**Product under analysis:** Papic (guest event-photography service inside setnayan.com)
**Compiled:** 29 August 2026
**Method:** Live vendor pages, pricing pages, and vendor comparison content retrieved 29 Aug 2026.
**Status:** Working document. Every claim is marked ✅ verified / ⚠️ vendor-claimed / ❓ unverified.

---

## 0. Read this first — corrections to your existing grid

Your current landscape grid contains factual errors. If any of these reach a pitch deck or a
planner sales call, a competitor's own homepage disproves you in about fifteen seconds.

| # | Your grid says | Reality | Severity |
|---|---|---|---|
| 1 | Kuha.app has "no gamified challenges" | Kuha ships a built-in photo game / scavenger hunt with tasks like "selfie with the groom" | **Critical** |
| 2 | Kuha.app is a video-guestbook tool with gallery spam problems | Kuha is a full event suite: QR upload, live slideshow, digital invitation with animated envelope reveal, RSVP dashboard, guest greetings, QR template library, partner program | **Critical** |
| 3 | PhotoShare PH has an "extremely basic UI" and no live features beyond the wall | PhotoShare has live wall, private/invite-only albums, expiry dates, passwords, post-hoc moderation, highlight export. UI quality is a subjective claim you cannot source | **High** |
| 4 | Lense App is an "ultra-low latency live-streaming wall architecture" specialist | Lense is a **disposable camera app** — shot limits, vintage filters, delayed reveal, built for casual friend groups. It is a direct Scene competitor, not a live-wall competitor | **High** |
| 5 | Scene "lacks a dashboard" and is purely nostalgic | Scene has host event creation, reveal-time controls, QR table cards, 9-language localisation, offline-first capture. Accurate that it has no live wall | Medium |
| 6 | "Setnayan Papic" listed as a Legacy Architecture competitor writing to client Google Drive | Papic is *your own product*. The Google-Drive-direct competitor you're describing is **WedUploader** (and EventSnap) | **Critical** — remove before any external use |
| 7 | GuestCam has "no photo limitations" | MagicFind processes **up to 10,000 images** and **only photos uploaded after activation**. Both are real limits and both are exploitable | Medium — this one helps you |
| 8 | The grid has 7 competitors | The market has 25+ active players. Four significant ones are missing entirely (EventPix.ph, Fotify, Guestpix, Kululu) | **High** |

**One more structural problem.** Much of the comparison material online is written by vendors
about their rivals — pix.wedding's blog ranks Pix Wedding first, Scene's blog ranks Scene first,
GuestCam's "versus" pages exist to beat Guestpix. I have flagged each of these below. Do not
inherit a rival's marketing claim into your own deck without checking it on the subject's own site.

---

## 1. Market map

The market is not one category. It is five, and they price differently, sell differently, and
lose for different reasons. Papic is currently attempting to span four of them at once — which is
the strategic bet, and also the risk.

| Segment | What they sell | Price anchor | Players |
|---|---|---|---|
| **A. PH local QR gallery** | Cheap per-event album + live wall | ₱699 – ₱1,299 | Kuha.app, PhotoShare PH, EventPix.ph |
| **B. Global QR gallery (feature-maximal)** | Everything-in-one wedding platform | $49 – $119 one-time | Fotify, Pix Wedding, Guestpix, Kululu, Wedibox, Guestlense |
| **C. AI face-search layer** | Selfie → your photos | $45 add-on to $$$ | GuestCam (MagicFind), Kamero, FotoOwl, Kwikpic, Memzo, FindMe Photo, Honcho, VaultPic |
| **D. Disposable / nostalgia** | Shot limits, film look, timed reveal | Free – $99 one-time | Scene, Lense, POV Camera, Once Film, Dispo, JoinMyMoment, Disposable.app |
| **E. Storage passthrough** | Files land in your own Drive | Free | WedUploader, EventSnap |

**Where Papic sits:** you are trying to be A (local price/trust) + B (feature depth) +
C (AI) + D (controlled shots) simultaneously. No competitor currently does all four. That is the
opportunity. It is also four separate product surfaces to build, maintain and support.

---

## 2. Competitor profiles

### 2.1 Kuha.app — **Threat level: HIGH (highest single threat)**

*Segment A. Philippines. Your closest analogue.*

**Positioning.** Self-describes as the leading private wedding photo sharing in the Philippines.
Explicitly speaks Filipino event language — the site references Ninongs and Ninangs by name. ✅

**Verified feature set:**
- QR-code guest upload, browser-based, no app download, no account ✅
- Customisable QR template library themed to the event ✅
- **Built-in photo game / scavenger hunt** with creative guest tasks ✅
- Live slideshow / memory wall for projectors and LED walls ✅
- Digital invitation: animated envelope reveal, live countdown, venue maps ✅
- Integrated RSVP with real-time tracking and one-click export ✅
- Guest greetings / live messages that surface on the slideshow ✅
- High-resolution storage (they position against "heavily compressed" rivals) ✅
- Guests can view and download, not host-only ✅
- Permanent event memory link that does not expire ⚠️ vendor claim
- One-click zip download ✅
- Partner program for coordinators ✅ (page exists at /experience/partners)

**Pricing:** Free trial album, paid bundles above it. Exact tier amounts are rendered client-side
and did not resolve on fetch. Your grid's ₱499 figure is ❓ **unverified — verify manually.**

**Where they are actually weak:**
- No AI face recognition or selfie search — this remains true and is your single cleanest gap ✅
- No face-blocking or biometric opt-out (nobody has this — see §4)
- No shot throttling; unlimited upload means gallery volume is unmanaged
- No evidence of a tiered storage/retention architecture — "never expires" is a cost liability
  they are carrying, and a claim you can pressure-test
- No multi-chapter journey model (engagement → wedding day)

**Do not claim:** that Kuha lacks games, live walls, RSVP, or high-resolution storage.

---

### 2.2 PhotoShare PH — **Threat level: HIGH**

*Segment A. Philippines. Founded 2024, Metro Manila.* ✅

**Verified feature set:**
- ₱999 flat per single event ✅ (confirmed on homepage and blog)
- Unlimited guest uploads, no guest cap, no per-upload fees ✅
- QR code + shareable web link fallback ✅
- Live photo wall, instant appearance on upload ✅
- Full-resolution host download, whole album or individual ✅
- Private by default; expiry dates and password control ✅
- Highlight export for social/aftermovie ✅
- Broad event coverage: weddings, debuts, corporate, graduations, conferences ✅

**The exploitable weakness — this is your best single wedge against them:**
> Photos **cannot be approved before appearing on the live wall.** Hosts can only remove them
> after they have already been displayed. ✅ (stated in their own FAQ)

For a Filipino wedding with 200–500 guests projecting onto a ballroom LED wall, post-hoc removal
is not moderation. It is damage control. Pair this with your Controlled Shots throttling and it
becomes a coordinator-facing safety argument, not a feature argument.

**Second weakness:** **30-day retention only.** ✅ Photos are stored 30 days from event creation.
Your 6-month live / 3-month raw / lifetime compressed architecture is a genuine, defensible,
easily-charted advantage here. Chart it.

**Where they are strong:** they own the local "live wall" search intent, they publish SEO content
targeting Filipino event vocabulary, and their price is a clean single number that coordinators
can quote from memory.

---

### 2.3 EventPix.ph — **Threat level: MEDIUM — MISSING FROM YOUR GRID**

*Segment A. Philippines. Undercuts everyone locally.*

- Entry at **₱699 per event**, one-time payment ✅
- A second tier at **₱1,299** for photo **and video** with real-time photo wall ✅
- QR + private link, browser-based, guests upload free ✅
- Explicitly positions as *the budget alternative* to higher-priced local galleries ✅

**Why they matter to you:** they are running a deliberate price-floor strategy. If your pricing
model assumes ₱999 is the local floor, it is not — it is ₱699, and they are advertising against
"upsell-heavy complexity," which is exactly how a cheap competitor frames a feature-rich one.
Have an answer ready for the coordinator who says *"but EventPix is ₱699."*

---

### 2.4 GuestCam — **Threat level: MEDIUM-HIGH (technical benchmark)**

*Segment C. Global. Your AI benchmark, correctly identified.*

**MagicFind, verified:**
- Guest submits one selfie; face recognition returns every photo they appear in ✅
- Works across all galleries in the event, including professional photographer uploads ✅
- Browser-based, no app ✅
- **$45 add-on** on any plan — not included in base ✅
- Hosts get an elevated version: up to **50 faces** per event, for VIPs, speakers, family ✅
- Guests can search **1 face at a time** ✅
- Re-search picks up newly uploaded photos ✅

**The three hard limits — these are your attack surface:**
1. **Processes up to 10,000 images.** ✅ A 400-guest Filipino wedding with controlled uploads can
   approach this; an uncapped one blows past it.
2. **Only processes photos uploaded *after* activation.** ✅ Their own FAQ warns hosts to buy it
   at event creation or lose everything uploaded earlier. That is a real, documented failure mode
   for a coordinator who adds it mid-event.
3. **Paywalled.** At $45 on top of the base plan, third-party comparisons put Premium + MagicFind
   near **$100** ⚠️ (vendor-blog figure — verify on guestcam.co directly before quoting).

**Rest of the product:** live slideshow ✅, audio guestbook ✅, 17-language guest portal ✅,
comments and five reaction types ✅, one-click full-resolution download ✅.
**Gaps:** no free plan ⚠️, no RSVP ⚠️, moderation is manual only ⚠️ (all three from a rival's
blog — verify).

**On your "face-blocking" counter:** it is real, it is good, and it is correctly aimed. But see
§4 before you build the pitch around it, because the framing needs work.

---

### 2.5 Pix Wedding — **Threat level: MEDIUM**

*Segment B. Global. Aggressive SEO operation.*

- **$49–$89 one-time**, flat regardless of guest count ⚠️ (self-published)
- Free tier: first 20 guest uploads, no card required ⚠️
- No guest cap on paid plans ⚠️
- Full-resolution **photos and video**, no compression ⚠️
- Real-time live slideshow / projector wall, refreshes within seconds ⚠️
- 12-month retention on Starter, longer above ⚠️
- Free custom branding on every tier, including the cheapest ⚠️

**Caution flag:** almost every figure above comes from pix.wedding's own comparison blog, where
they rank themselves first in every roundup. Treat as marketing until verified on their pricing
page. Their *technique*, however, is worth stealing: they publish "best X compared" content that
ranks for competitor names and converts. You have no equivalent SEO surface for Papic.

**Your grid said they have no live wall. That is wrong** — a real-time slideshow is one of their
headline features. Correct this.

---

### 2.6 Scene — **Threat level: LOW-MEDIUM**

*Segment D. Nostalgia/disposable. Correctly characterised in your grid, mostly.*

- Host creates the event in an **iOS app**; guests join by QR in browser, no download ✅
- Kodak-inspired film styles (Classic Chrome, Nostalgic Negative, Acros, Original) ✅
- **Offline-first capture** — photos survive weak venue WiFi ✅ *(this is genuinely hard and
  genuinely valuable at Philippine venues; note it)*
- **Timed reveal** — gallery locked until a host-set moment ✅
- Free up to 5 guests; **$19.99 for 50, up to $99.99 unlimited**, one-time ✅
- 9-language localisation ✅
- Pre-designed QR table cards ✅

**Real gaps:** no live wall ✅, no video ✅, no host moderation ✅, no native Android (web PWA) ✅.

**Correction:** they do have host-side event controls. "Lacks a dashboard" is not accurate enough
to survive scrutiny — say "no live-projection capability," which is true and sufficient.

**The offline point matters to you.** If Papic's Controlled Shots requires connectivity to
enforce a shot budget, Scene beats you in every provincial venue with bad signal. Worth an
engineering decision now rather than after the first bad event.

---

### 2.7 Lense — **Threat level: LOW** *(recategorised)*

*Segment D, not "Live Wall Specialist." Your grid has this one materially wrong.*

- Disposable-camera simulation with **configurable shot limits per guest** ✅
- Delayed reveal — photos hidden until a host-set time ✅
- Vintage-style filter presets (not true film-stock emulation) ✅
- iOS **and** Android, QR browser join ✅
- ~90,000+ users ⚠️ (rival-reported)
- Free for 7 guests, **$4.99–$69.99** above that; video is a **$9.99 add-on** ⚠️
- No AI moderation, no RSVP, no event management depth ⚠️
- Built for casual friend groups, so event tooling is thin ⚠️

**Note:** there is a separate product called **Guestlense** (guestlense.com) — customisable
gallery pages, photo-booth-style filters, up to 12-month hosting. Different company. Do not
conflate them; your grid may already have.

**Also note:** Lense already ships **per-guest shot limits**. Your Controlled Shots feature is
therefore not novel in the market — it is novel *in combination with a live wall*, which is the
claim you can actually defend.

---

### 2.8 POV Camera — **Threat level: LOW — MISSING FROM YOUR GRID**

*Segment D. The one competitor with real moderation.*

- Free tier covers 10 guests; scales to **$89.99 for 250** ⚠️
- ~25 shots per guest by default ⚠️
- **Host reviews and approves photos before they reach the shared album** ⚠️
- Native iOS **and** Android ⚠️
- Timed reveal, typically next-day ⚠️
- Photobook ordering built in ⚠️
- Live slideshow only as a paid Business Essentials add-on ⚠️
- Requires an active connection — no offline capture ⚠️

*(All ⚠️ — sourced from Scene's competitor pages, i.e. a hostile source. Verify directly.)*

**Why it matters:** POV is the only player in the disposable segment doing pre-publication
moderation. If you pitch Papic's moderation as unique, POV is the counter-example. Pitch instead
on *moderation combined with live display*, which POV gates behind an add-on and PhotoShare
cannot do at all.

---

### 2.9 Guestpix — **Threat level: MEDIUM — MISSING FROM YOUR GRID**

*Segment B. Global, established, strong US brand recognition.*

- 50M+ uploads claimed ⚠️
- QR / private link, no guest registration ✅
- Photos, videos, **and** written + video guestbook messages, exported to CSV ✅
- Digital invitation and RSVP ✅
- Live slideshow ✅
- 20 gallery themes; **180+ Canva templates** for signage, table cards, take-home cards, and an
  "I Spy" game ✅
- Full-resolution zip download ✅
- Multi-lingual ✅

**Documented weakness:** "unlimited guests" on the pricing page, with a fair-use policy capping
all plans at **1,000 guests per event** ⚠️ — *this is GuestCam's accusation on their own versus
page, i.e. a hostile source. Verify in Guestpix's actual terms before ever repeating it.*

**Why they matter:** the 180+ Canva template library is a distribution weapon. Coordinators want
print-ready collateral, not just software. Papic has no equivalent.

---

### 2.10 Fotify — **Threat level: MEDIUM-HIGH — MISSING FROM YOUR GRID**

*Segment B. The most feature-maximal competitor found. Watch this one.*

⚠️ *All figures self-published on fotify.app; they run competitor roundups where they win. Verify.*

- **$49.99** for unlimited everything
- **AI content moderation** — automated, not manual
- RSVP, live carousel, **live streaming**, DJ song requests, table management
- Free tier: 50 photos, 20 invitations, live carousel

**Why this one should worry you more than GuestCam.** Fotify is bundling AI moderation + live
display + event logistics into a single flat price and publishing aggressive comparison content
against every rival. That is structurally the same play Papic is making, executed by someone
already in market, in USD, globally. Your grid's core thesis — "nobody combines entertainment +
AI + premium control" — is weakest against Fotify, not against Kuha.

---

### 2.11 Kululu — **Threat level: LOW-MEDIUM — MISSING FROM YOUR GRID**

*Segment B. Global.*
Digital guestbook with **video, image, or decorated text wishes** ✅; real-time photo wall for
TVs and projectors ✅; QR or link entry, no download or registration ✅; customisable album title,
date, colours, backgrounds ✅; one-click zip ✅.

**Relevance:** Kululu already does the "video guestbook" hook your grid attributes exclusively to
Kuha. The hook is not scarce.

---

### 2.12 WedUploader / EventSnap — **Threat level: LOW**

*Segment E. This is the "Legacy Architecture" row your grid mislabelled as Setnayan Papic.*

- Host connects **Google Drive**; guest uploads land directly in the couple's own Drive ✅
- QR code + unique URL ✅
- **Free for guests**, and WedUploader is free to use ✅
- No live wall, no AI, no games, no moderation ✅

**The real counter-argument, which your grid gets right in substance:** these tools win on
*ownership anxiety*. Tech-savvy couples pick them because the files are theirs forever with no
vendor dependency. Your tiered storage answer is correct but incomplete — hosts who chose
WedUploader are specifically people who distrust hosted retention. Consider an export-to-Drive
option as a trust bridge rather than arguing them out of the preference.

---

### 2.13 AI face-search field (context, not direct competition)

Beyond GuestCam, the selfie-search category includes **Kamero**, **FotoOwl**, **Kwikpic**
(via LocaFlash), **Memzo** (claims 99.3% accuracy ⚠️), **FindMe Photo**, **Honcho** (live
camera-to-cloud), and **VaultPic** (consumer app). Most target *professional photographers*
rather than guests. Several — Kamero, FotoOwl, the ThePerfectHitch/DreamTeller white-label family
— ship **multi-level photo privacy** (e.g. guests see only their own photos while approved users
see all) ✅.

**Implication for your positioning:** face recognition is commoditising fast. It is a
2025-generation feature, not a moat. Multi-level privacy already exists. What does *not* exist
anywhere I could find is a guest-initiated **opt-out from being recognised at all.** See §4.

---

## 3. Feature matrix

✅ confirmed present · ✖ confirmed absent · ⚠️ vendor-claimed · ❓ unverified

| Feature | Papic | Kuha | PhotoShare | EventPix | GuestCam | Pix Wed | Fotify | Guestpix | Scene | Lense | WedUploader |
|---|---|---|---|---|---|---|---|---|---|---|---|
| No-app browser QR entry | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ✅ | ✅ |
| Live photo wall | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✖ | ✖ | ✖ |
| Pre-display moderation | ✅ | ❓ | **✖** | ❓ | ⚠️ manual | ❓ | ⚠️ AI | ❓ | ✖ | ✖ | ✖ |
| Gamified challenges | ✅ | **✅** | ✖ | ✖ | ✖ | ❓ | ⚠️ | ✅ I-Spy | ✖ | ✖ | ✖ |
| AI face tagging | ✅ | ✖ | ✖ | ✖ | ✅ $45 | ✖ | ❓ | ✖ | ✖ | ✖ | ✖ |
| **Face-blocking opt-out** | ✅ | ✖ | ✖ | ✖ | **✖** | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Controlled shots per guest | ✅ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✅ | **✅** | ✖ |
| Timed reveal | ❓ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✅ | ✅ | ✖ |
| Offline capture | ❓ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | **✅** | ✖ | ✖ |
| RSVP / invitations | ✅ | **✅** | ✖ | ✖ | ⚠️ ✖ | ❓ | ⚠️ | ✅ | ✖ | ✖ | ✖ |
| Video support | ✅ | ✅ | ❓ | ✅ ₱1,299 | ✅ | ⚠️ | ⚠️ | ✅ | **✖** | +$9.99 | ✅ |
| Tiered retention | ✅ | ⚠️ forever | **30 days** | ❓ | ❓ | ⚠️ 12mo | ❓ | ⚠️ | ❓ | ❓ | ∞ (own Drive) |
| Multi-chapter journey | ✅ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Mid-event credit top-up | ✅ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Print/Canva collateral | ❓ | ✅ | ❓ | ❓ | ❓ | ❓ | ❓ | **✅ 180+** | ✅ | ❓ | ✅ |

Bold = the cell that changes a strategic conclusion.

---

## 4. Where Papic actually wins — and where the argument is thinner than you think

### Genuinely uncontested (found in no competitor)

**1. Face-blocking / biometric opt-out.** Nothing in the entire scanned field offers a guest the
ability to opt *out* of facial recognition. Multi-level privacy exists (Kamero, FotoOwl); consent
does not. This is a real first.

But reframe the pitch. "High-profile guests can opt out" is a niche luxury argument. The stronger
argument is regulatory: under the **Data Privacy Act (RA 10173)**, facial templates are sensitive
personal information, and processing them requires a lawful basis. GuestCam's model — process
every face in the event by default — is a consent posture that is comfortable in the US and
awkward in the Philippines and hostile in the EU. Papic's opt-out is not a premium perk. It is
**the only architecture in this market that is defensible under a consent regime**, and that is
what you sell to a corporate event buyer, an LGU partner, or an ISO 27001 auditor.

That reframing also matches the compliance work already in your file. Use it.

**2. Multi-chapter journey model.** Nobody else spans engagement → prenup → wedding day as one
shot pool with per-chapter QR codes. Every competitor is single-event. This is your most
under-exploited differentiator and it barely features in your current grid.

**3. Mid-event credit top-ups.** No competitor monetises during the event. Everyone sells one
flat price up front. This is a revenue-model difference, not just a feature.

**4. Tiered retention as a designed system.** Competitors either dump storage on you (PhotoShare's
30 days), promise forever and eat the cost (Kuha, Pix Wedding), or push it to your Drive
(WedUploader). A deliberate 6mo/3mo/lifetime-compressed ladder is more sophisticated than
anything found. Chart it against PhotoShare's 30 days — that comparison sells itself.

### Contested — your grid overstates these

**Controlled Shots.** Lense already does per-guest shot limits. Scene and POV do reveal
throttling. Your defensible claim is narrower: *shot throttling combined with a live wall*.
Nobody pairs those. Say that, not "we invented curation."

**Gamified challenges.** Kuha has a scavenger hunt. Guestpix has I-Spy. This is table stakes in
2026, not a differentiator. Compete on execution quality, not existence.

**Live wall.** Everyone in segments A and B has one. Compete on **moderation before display** —
that is where PhotoShare has a documented hole and where you should aim.

**"More entertaining than Pix Wedding."** Pix Wedding has a real-time slideshow. Drop this line.

### Not yet answered

- **Offline capture.** Scene built it deliberately. Philippine venues have unreliable WiFi. If
  Controlled Shots enforces its budget server-side, you will fail in exactly the provincial
  venues where you most need to win. Decide this before launch.
- **Price floor.** EventPix is at ₱699. What is Papic's entry point, and what is the answer when
  a coordinator quotes that number?
- **Print collateral.** Guestpix ships 180+ templates; Kuha ships a themed QR library. Software
  alone does not win coordinators.

---

## 5. Revised three-pillar pitch

Your existing three pillars have a factual problem each. Replacement:

1. **Consent-first AI.** Everyone else's face recognition is opt-out-impossible. Papic is the
   only platform where a guest can decline to be recognised — built for RA 10173, GDPR, and any
   corporate client with a privacy officer. *(Attack: GuestCam, Kamero, the whole AI segment.)*

2. **Moderated live energy.** PhotoShare cannot approve a photo before it hits the wall — only
   remove it after. Scene and Lense have no wall at all. POV has moderation but sells the wall as
   an add-on. Papic is the only one doing curated live display as one integrated system.
   *(Attack: PhotoShare, Scene, Lense, POV.)*

3. **The whole story, not the one night.** Every competitor sells a single event. Papic runs from
   engagement through the wedding as one chaptered archive with per-chapter access.
   *(Attack: everyone. This is your most defensible pillar and currently your quietest.)*

Storage tiering is a supporting proof point under pillar 3, not a pillar.

---

## 6. Verification backlog

Before this goes anywhere external:

| # | Item | Why | How |
|---|---|---|---|
| 1 | Kuha.app exact peso tiers | Your ₱499 is unsourced; tiers render client-side | Create a free account, screenshot the pricing page |
| 2 | GuestCam base plan + MagicFind total | The ~$100 figure comes from a rival's blog | Check guestcam.co pricing directly |
| 3 | Guestpix 1,000-guest fair-use cap | Sourced from GuestCam's attack page | Read Guestpix's actual terms |
| 4 | Fotify's full feature list | Self-published; and this is your closest strategic twin | Sign up for their free tier |
| 5 | Pix Wedding pricing and retention | All from their own SEO blog | Pricing page |
| 6 | Whether any AI vendor ships biometric opt-out | Your entire pillar 1 rests on this being absent | Re-check quarterly — this is the claim most likely to be copied |
| 7 | Kuha and PhotoShare coordinator commission rates | Determines whether you can flip planners on economics | Ask a coordinator, or apply to Kuha's partner program |
| 8 | Local NPC guidance on event facial recognition | Turns pillar 1 from marketing into compliance | National Privacy Commission advisories |

Item 6 is the one to watch. Face-blocking is a few weeks of work for a funded competitor. The
moat is not the feature — it is shipping it first, documenting the consent flow properly, and
getting an audit trail behind it before anyone else notices the gap.

---

## 7. Sources

Vendor sites retrieved 29 Aug 2026: kuha.app (weddings, features, pricing, experience, faqs),
photoshare.ph (home, about, blog), eventpix.ph, guestcam.co (home, magicfind, weddings, versus),
pix.wedding (multiple comparison pages), scenedisposable.com (multiple comparison pages),
guestpix.com, kululu.com, weduploader.com, fotify.app blog, guestlense.com, kamero.ai,
fotoowl.ai, findme.photo blog, App Store listings for Kamero and LocaFlash.

**Bias warning.** pix.wedding, scenedisposable.com, fotify.app and guestcam.co/versus are
competitor-authored comparison pages. Each ranks its own product first. Claims sourced from them
are marked ⚠️ and should be verified on the subject's own site before external use.
