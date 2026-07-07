# Papic Feature Specification

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main)
> **This doc is HISTORICAL/REFERENCE.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Papic is **Live** in code (`app/papic/*`), but the pricing/SKU shape in this doc is superseded:
> - **Live SKUs (per-camera, 2026-06-29 canon):** Papic is now priced **per camera·day** — **Papic Unli ₱100/cam·day** (unlimited photos+video) and **Papic Ltd ₱30/cam·day** (limited capture), **both capped at ₱15,000/day**. The older flat "Papic (5 Seats) ₱2,999" + "Papic Guest (Disposable Camera) ₱2,999" SKUs, the "3 Papic ₱1,500 / 5 Papic ₱2,500 / ₱199-per-template" two-tier model, and the single ₱4,499 pax-pricing draft in this doc are all **RETIRED**. Reconcile to the live catalog + `Pricing.md`/`CLAUDE.md` SKU table, which win.
> - **Hard product constraints still hold:** 5-second video cap, max 10 tags/photo, untagged-still-delivered guarantee, per-event face-scoping, Personal Reels 9:16 / 1–30s — these are owner-locked and remain accurate.
> - **Sales/payment model:** Papic is a **first-party Setnayan Productions vendor listing** sold to couples via **apply-then-pay** (manual admin approval), free during the launch window (to 31 Mar 2027) — not an instant "App Unlock" wallet charge. Customer token wallet is RETIRED; **vendor token economy** is the only token system. **Commission is 0%**; vendor↔customer money is OFF-PLATFORM.
> - **Native vs web:** the spec assumes a native iOS/Android capture app; today Papic ships as a **webapp slice** (native is the Phase-2 / Capacitor-shell direction).
> - **Storage (owner-reconciled 2026-07-08):** **R2 = system of record** + a **Google-Drive permanent full-res copy** (the couple's forever archive). The **90-day full-res window on R2 is KEPT** — full-res stays hot for 90 days post-event (downloads + fast gallery), then the R2 copy is **compressed** (downscaled, never deleted) and kept permanently so the website gallery never breaks. The couple's **Drive holds full-res forever.** What the Drive copy *replaced* is the old R2 **5-year cold tier** as the long-term full-res home — the **5-year no-auto-delete** lock still holds (compress ≠ delete).
>
> When this body disagrees with the above, **the above wins.**
>
> **➕ 2026-06-29 price refresh** (live-site sync — supersedes any stale prices in the banner above): Setnayan AI **₱3,999** (paid first paywall) · Animated Monogram **₱1,999** · Live Studio (Panood) multicam **₱3,499/day** (single-cam livestream FREE) · Pakanta **₱2,499** (one SKU) · Cinematic Reveal **₱1,499** · vendor Pro **₱2,499** / Enterprise **₱4,999** per 28-day · **0% commission · verification FREE** · couple website = free 4-in-1 + ONE **Couple Website PRO ₱1,999** (old separate RSVP / RSVP Pro / Event Website / Editorial Website à-la-carte SKUs retired) · couple tiers **Free ₱0 · Setnayan AI ₱3,999** (Essentials/Complete bundles REMOVED 2026-06-29). Canon: `AS_BUILT_GROUND_TRUTH_2026-06-07.md` § 1 + `Pricing.md` § 00.

**Document Version:** 2.0 — FINAL V1 SCOPE
**Last Updated:** 2026-05-08
**Owner:** Setnayan Product & Engineering
**Status:** Locked for V1 implementation
**Audience:** Product, Engineering, Operations, Sales, Customer Success
**Companion Specs:** 09_Panood_Feature_Specification.md, 07_V1_Developer_Specification.md, 13_Engineering_Brief.docx, 14_Music_Catalogue_Cowork_Playbook.md

---

## V1 Pricing At-a-Glance

|  | App Unlock |
|---|---|
| **3 Papic** | **₱1,500** |
| **5 Papic** | **₱2,500** |
| **per Template (premade)** | **₱199** |

**The Papic job-to-be-done (verbatim product spec):** the will roam around the event to take unlimited photos of people until the end. they can scan the QR codes to tag the guest on the photo. They can also tag the whole table assigned if it is a group photo. each photo can tag up to 10 people only.

### Who Gets What

**Guest Features** (every RSVP'd guest, included with any Papic unlock):

- Get all copies of your own photos and your papic shots in real time
- Render a 1–30 second personal reel (choose your best 5 photo/video picks; mixed with the couple's 5 memorable clips)
- Hassle-free photos for the whole event — no chasing the photographer, no scrolling Facebook for guest-shared photos

**Newlywed Features** (the couple, automatic with any Papic unlock):

- Get all copies of all the guest and papic photos
- Hassle-free photos and short videos for the whole event — full archive, downloadable, gallery-organized, navigable by tag

---

## Part 1 — Executive Summary

### Why Papic Exists — the Human Layer (positioning · owner-stated 2026-06-14)

> **This frame is canonical and wins on conflict with any "second-shooter replacement" language elsewhere in this doc.** Papic does **not** replace the couple's photography team and is **not** there to hunt the "best parts" of the night — that is the photographer's job. Papic is the **human / guest-presence layer**: it captures the reactions, emotions, candids, and stories a hired photographer structurally cannot be everywhere to catch. **Let the photographers take the grandest moments; let Papic take the precious ones** — the moments the couple was too busy to witness, the small things they could never see.

The three Papic products each carry a distinct emotional job, and together they form one system:

- **Papic Guest (disposable camera)** is not an ordinary photo-share bucket. Its purpose is to let *every* guest share their **own** personal experience of the night — the moments the couple can no longer see. A friend's joke, the short clip of the tunnel the couple paid for, guests quietly appreciating the reception. It is how a guest connects to the couple even while the couple is busy, and how the human-side candids photographers miss make it home.
- **Papic 5 Seats** is the inverse of "more cameras." Its real goal is to **free guests to stop filming and live the moment with their own two eyes** — the way the most precious moments were once kept by memory, not by phone. The five designated seats then catch the **reaction shots** one photographer can't be everywhere for: how guests look at the first kiss, the faces amazed at the reception the couple worked so hard for. Five seats exist precisely because the human side of a wedding can't be grasped by a single lens.
- **Kwento** is the **words** layer. Because the couple didn't see it, a guest leaves a message — a story, a *chismis* — about a small-but-memorable moment, anchored to the photo it happened in, all kept in one place. It is the back-story of the great moments the couple would otherwise miss, told to them by the people who were there.

The job, across all three: surface the **human side of the wedding** — presence, candor, reaction, and the stories the couple couldn't be in two places to live. (How those moments become lasting keepsakes — reels, SDE, stories, thank-you films on owned music — is the produced-output layer; that's *how* they matter, this section is *why*.)

### What Papic Is

Papic is a native-app candid-capture product that turns 3 or 5 trusted phones at a wedding into a coordinated, photographer-grade shooting team. Each Papic account is a seat in the Setnayan native app that unlocks an enhanced capture screen — manual exposure, tap-to-focus, burst mode, low-light boost, silent shutter, and a hard-coded 5-second clip limit on video — so a couple's friend or sibling can shoot like a hired second-shooter without the price tag.

The job to be done is narrow on purpose: **roam the event, take unlimited photos and 5-second clips of people, tag who's in each shot via QR, deposit everything into one shared gallery on the couple's Setnayan landing page.** Papic is not a phone-stream broadcaster (that's Panood), it's not a long-form video tool, and it's not a generic photo-sharing app. The 5-second video cap exists by design — it forces shooters to hunt moments rather than record speeches, keeps storage and processing costs predictable, and produces clip lengths that drop straight into Reels, TikTok, and Personal Reels without further trimming.

The product unlocks per event ("App Unlock") at one of two seat counts:

1. **3 Papic** at **₱1,500** — three designated friends/family/crew get the app and full capture access
2. **5 Papic** at **₱2,500** — five seats for larger weddings or deeper coverage

A separate, optional add-on lets the couple unlock pre-made reel templates from Setnayan's template library for their wedding's Personal Reels feature: **₱199 per template**.

### How It Works in 4 Bullets

- The couple pays ₱1,500 (3 seats) or ₱2,500 (5 seats) at checkout. The feature is unlocked instantly for their event.
- The couple invites the chosen friends/family. Each invitee installs the Setnayan native app and signs in via a wedding-scoped QR code. They become Papic for that one event.
- During the wedding, Papic shoot **unlimited photos and 5-second clips**. After each shot, they can scan a guest's personal QR (delivered with their RSVP) or a table QR (printed on table tents) to tag who's in the photo. **Max 10 tags per photo.** Untagged photos are still delivered.
- After the event, the gallery lands on the couple's Setnayan landing page. Guests can view, download, and create their own Personal Reel using whichever templates the couple unlocked at ₱199 each.

### Why It Matters Competitively

The Philippines wedding photography market splits today into two extremes. On the low end, couples rely on the bride's hashtag and hope guests post enough on Facebook and Instagram for them to scrape candids later — a workflow that produces 30–80 usable photos at best, scattered across feeds, frequently set to "friends only." On the high end, couples hire a second or third photographer at ₱25,000–₱60,000 per shooter to capture candid coverage their primary photographer misses while running the formal shot list.

There is no incumbent in the Philippines offering a structured app-driven candid gallery. Globally, POV (formerly POV.app), Wedshoots, Joy, and Veri exist, but none have a Philippines presence, none integrate with a wedding planning suite, and none price below US$99 (~₱5,500) for an event. Their UX assumes English-speaking guests and Western credit-card billing; none ship a native app with photographer-grade capture controls — they're upload buckets with a gallery on top.

Setnayan's positioning is unique: **app-native candid capture with photographer-grade controls starting at ₱1,500 — under one-tenth the cost of hiring a second photographer.** Margins exceed 90% at both tiers because the cost basis is roughly ₱150–₱200 per event in cloud fees.

Competitive moat:

- **Native-app capture controls.** Every competitor is a web upload bucket. Setnayan ships manual exposure, tap-to-focus, silent shutter, and burst mode in a native app — the kind of control a hobbyist photographer expects and that a guest using their phone's default camera does not get.
- **5-second video cap is a feature, not a limit.** Controls cost, controls quality, produces clips that drop straight into the social formats couples actually share.
- **QR-driven tagging.** Personal guest QRs and table QRs make a 1,200-photo gallery navigable instead of an impenetrable stream. Competitors don't have a structured taxonomy.
- **Integrated with the Setnayan landing page.** Same URL the couple already shares with guests for RSVP, schedule, and Panood. No second app, no second URL, no second hashtag.
- **Pre-made template library.** The Personal Reels feature is powered by a library of 500 pre-built templates Setnayan generated at scale — couples mix and match for ₱199 each, every guest gets a 30-second souvenir reel.
- **Bundles cleanly with Panood.** Couples already buying Panood see Papic as a low-friction add-on; the same QR mechanic, the same landing page, the same theme.

### Target Year-1 Attach Rate

**32% of paid couples** will purchase a Papic unlock. With Setnayan's Year-1 target of 1,500 paying couples, this translates to **480 Papic events** in the first 12 months of general availability. Of those, the projected mix is:

| SKU | Year-1 mix | Year-1 events |
|-----|------------|---------------|
| 3 Papic (₱1,500) | 65% | 312 |
| 5 Papic (₱2,500) | 35% | 168 |

**Average templates purchased per couple:** 3 (₱597 in template revenue per event on average). Couples typically pick one template per template family they care about — usually 2 to 4 across our 6 categories (Bridgerton-feel, Taylor-Swift-feel, MJ-feel, Jazz, Sunday Morning, Hip Hop).

**Year-1 revenue model from Papic:**

| Line item | Per-event avg | Year-1 total |
|---|---|---|
| Papic unlock (blended ₱1,500 + ₱2,500 mix) | ~₱1,849 | ~₱887,520 |
| Template purchases (avg ~3 templates) | ~₱597 | ~₱286,560 |
| **Total Papic revenue Year 1** | **~₱2,446** | **~₱1,174,080** |

### How Papic Differs from Panood

Papic and Panood both rely on phones-as-cameras and both use QR onboarding. The differences:

| Dimension | Panood | Papic |
|-----------|-------------|-----------|
| Output | One composed live video feed | Many discrete photos + 5-second clips |
| Operator skill | Broadcaster must actively switch cameras | None — shooters just shoot |
| Real-time? | Yes — viewers watch live | Mostly async; gallery fills over time |
| Format limit | 1080p video, 5+ hr continuous | 4K stills, max 5-sec video clips |
| Upgrade hook | YouTube destination, overlays | Templates, Personal Reels |
| Couple's ask | "I want my mom in Toronto to watch" | "I want every candid the photographer missed" |

A couple buying both gets fully covered: Panood captures the formal moments and broadcasts them; Papic captures the candid moments around them.

---

## Part 2 — Product SKUs & Pricing (V1 Final)

### What's Included Across Both Tiers

Both Papic tiers share these defaults:

- iOS + Android native Setnayan app capture screen with enhanced controls (tap-to-focus, exposure compensation, silent shutter, burst mode, low-light boost)
- **Unlimited photos and 5-second video clips** per paparazzo for the duration of the event — papic roam, shoot freely, no per-shooter quota
- Photos at full sensor resolution; clips capped at 5 seconds by design
- **Guest tagging by QR scan** — papic scan a guest's personal QR (issued at RSVP) to tag them on a photo
- **Table tagging** — for group shots, papic tag the whole assigned table by scanning the table QR; the system fans out to all guests assigned to that table
- **Max 10 tags per photo** (combined: individual guest tags + any table tags)
- **Untagged photos are still delivered** to the newlyweds in full resolution — tagging is a navigation enhancement, never a gate on what the couple receives
- Shared gallery on the couple's Setnayan landing page
- Real-time uploads (when on Wi-Fi or 4G/5G); offline queue when no signal
- Standard auto-moderation (NSFW filter, basic content protection)
- 7-day couple gallery review window before originals are released to guests
- Originals downloadable as ZIP from the couple dashboard
- 90-day hot retention on Cloudflare R2; 5-year cold archive
- Standard Setnayan theme applied automatically (matches the couple's landing page)
- Email/Setnayan dashboard support during event
- Personal Reels feature available to all guests (couple pays per template they unlock — see below)

### SKU 1: 3 Papic (₱1,500)

**One-line pitch:** "Three trusted friends shoot your wedding like second photographers."

**Included:**

- 3 Papic accounts (3 seats in the native Setnayan app)
- All shared defaults above

**Best for:** Smaller-to-mid-size weddings (under 200 guests). The sweet spot is a couple with 3 willing camera-capable friends — typically the maid of honor, the best man, and one cousin or sibling. Together with the primary hired photographer, that's 4 cameras covering the event from different vantage points.

**Cost to Setnayan:** ~₱195 per event (cloud storage, image processing, push notifications, backend compute).
**Margin:** 87%.

### SKU 2: 5 Papic (₱2,500)

**One-line pitch:** "Five papic seats for deeper coverage and bigger weddings."

**Included:**

- 5 Papic accounts (5 seats in the native Setnayan app)
- All shared defaults above

**Best for:** Larger weddings (200+ guests), multi-venue events (separate ceremony and reception locations), or couples who want one paparazzo per major moment-cluster (bride-side detail, groom-side detail, reception roving, kids/family table, dance floor). Five seats is comfortably enough crew that no single photo angle gets missed.

**Cost to Setnayan:** ~₱265 per event.
**Margin:** 89%.

### Add-On: per Template (premade) — ₱199 each

**One-line pitch:** "Unlock pre-made reel templates from Setnayan's library so your guests can create personalized 30-second souvenir reels."

**How it works:**

- Setnayan maintains a library of 500 pre-made reel templates (built via the AI Template Generation pipeline — see 14_Music_Catalogue_Cowork_Playbook.md). Templates span 6 musical/visual feel categories: Bridgerton-Feel, Taylor-Swift-Feel, Michael-Jackson-Feel, Jazz, Sunday Morning Vibes, Hip Hop.
- During Papic onboarding, the couple browses the template library (filtered by feel category, mood, BPM, energy arc) and picks which templates they want available for their wedding's Personal Reels feature.
- Each template the couple unlocks costs **₱199**.
- Once a template is unlocked, every guest at that wedding can use it to create their personal **1–30 second reel** (flexible duration; guests pick how long, the template auto-scales slot durations to fit).
- Guests pick **up to 5 photos/clips** from the gallery, the template fills in up to 5 couple memorable clips automatically, music is licensed, transitions and color grade are baked in — out comes a finished 1080×1920 vertical 9:16 MP4 ready for TikTok, IG Reels, FB Reels, YouTube Shorts.

**Why per-template pricing works:**

- **Couples self-select for variety.** Couples who want maximum guest variety buy 4–6 templates (₱796–₱1,194). Couples who just want one good option spend ₱199.
- **High-margin.** Each template purchase is essentially pure margin — the templates were generated once at ~₱1 each in LLM costs; selling at ₱199 yields ~99% margin per template.
- **Predictable upsell.** Average couple buys ~3 templates = ~₱597 in template revenue per event.

**Conditions:**

- Couples can buy templates any time before or during the event (couples who realize at the reception "we should have more options" can buy more in-app)
- Each template purchased is locked to that one event — not transferable
- A template, once purchased for a wedding, is available to all guests of that wedding indefinitely (subject to gallery hot-retention window)
- The couple cannot edit or modify templates — they're "premade" by design

**Cost to Setnayan per template-unlock:**

- Template manifest already exists in the library (no per-purchase generation cost)
- Per-render cost (when guests use it): ~₱2–₱5 per reel, covering FFmpeg compute + storage + free CDN egress (see "Personal Reels Render Economics" below)
- Even at 100 reels per event using a single unlocked template, Setnayan's cost is ~₱200–₱500 against ₱199 in revenue from that template purchase

The economics work because Personal Reels are amortized across the broader event — couples typically buy templates AND a Papic unlock, so total event revenue (~₱2,446 average) easily covers the rendering costs (~₱500 max for a heavily-used reels event).

### Personal Reels Render Economics (cost basis)

When a guest uses an unlocked template to render their personal reel, Setnayan's per-render cost is:

| Component | Cost per reel |
|-----------|---------------|
| Template manifest fetch (cached) | ₱0 |
| FFmpeg compute (decode 10 clips, transitions, audio mix, H.264 encode on Cloudflare Workers) | ₱1–3 |
| Music licensing | **₱0** (Setnayan owns the AI-generated catalogue from Saturday's Suno session) |
| Output storage (R2) | ₱0.50–1 |
| CDN delivery to guest | **₱0** (Cloudflare R2 has free egress) |
| **Total per reel** | **₱1.50–₱4** |

Music cost is now ₱0 because Setnayan owns the catalogue outright — no annual licensing fee, no per-render charge, no Artlist/Musicbed dependence. See companion playbook for the music-generation strategy.

### Papic Guest — Marginal cost basis (owner-locked 2026-06-07)

> ⚠ AS-BUILT cost frame for the **Papic Guest (disposable-camera-per-guest)** SKU — 24 photos + 10×5s clips per guest, **one flat price up to 250 pax**. Its **only** marginal cost is **R2 storage**; every other component is ₱0.

- **Face recognition / auto-tagging — ₱0.** Runs **on-device** in the native capture app (iOS Vision / Android ML Kit + a bundled embedding model). The phone does the compute, so there is **no cloud face-API charge** and **biometric data never leaves the device** (gold-standard RA 10173). Web-upload fallback uses a self-hosted open model → still ₱0 metered (your own compute only). Never a paid cloud face API.
- **Monogram / logo overlay — ₱0.** Stamping the couple's logo onto photos is a template overlay; if the couple **uploads their own transparent-background file** there is no generation cost at all. (Bespoke AI generation via Recraft is the *only* metered exception platform-wide, ~₱50, and applies to the Animated Monogram SKU — not to Papic Guest.)
- **Renders / filters — ₱0** (template composites on own infra) · **egress — ₱0** (R2 free egress).

**Storage cost** (R2 ≈ ₱7.5/GB lifetime — 3-mo full-res hot → compressed for the 5-yr retention tail):

| Guest count | Media (~190 MB/guest) | R2 cost |
|---|---|---|
| 100 pax | ~19 GB | ~₱143 |
| 200 pax | ~38 GB | ~₱285 |
| 250 pax (flat-price ceiling) | ~47.5 GB | ~₱356 |

So Papic Guest's true COGS at the 250-pax ceiling is **~₱356 (storage only)** → against ₱1,500, **~76% margin**. This supersedes the older "~₱150–₱200 cloud-fee per event" basis for the per-guest disposable SKU (the on-device-face decision removed the only metered AI line).

### The Tagging System

QR-driven tagging is the spine of how Papic photos become navigable instead of a 2,000-photo wall to scroll. Both tiers ship with the same tagging system.

**Personal guest QR codes.** Each invited guest receives a personal QR code as part of their RSVP confirmation (delivered through the existing Setnayan RSVP flow — see 07_V1_Developer_Specification.md). The QR encodes a wedding-scoped guest_id; it's not a personal credential and cannot be used to log in as that guest, only to tag them. Guests who lose the email can re-fetch the QR from the couple's landing page after entering their RSVP code, or check in at the door for a printed backup card.

**Table QR codes.** The couple's seating chart (already managed inside Setnayan) generates a QR per table — physically printed and placed at the center of each table on a small Setnayan-branded tent card (Setnayan provides the printable PDF; couples print locally or order from Setnayan's print partner at ₱99/event).

**Tag flow inside the Papic app.** After capturing a photo or clip, the Paparazzo sees a "Tag" button. They can:

- Tap and scan one or more guest QRs (the camera stays in scan mode until they tap done)
- Scan a single table QR to tag the whole assigned table
- Mix freely (1 individual guest + 1 table)
- Skip tagging entirely and move on — the photo still uploads and is delivered

**The 10-tag-per-photo cap.** Combined cap across individual + table tags. If a Paparazzo scans a table of 12, the system tags the first 10 (alphabetical by RSVP'd name) and surfaces a warning; the Paparazzo can then either accept the truncation or unscan and re-tag manually. The cap exists for two reasons: (1) it keeps the gallery navigation experience clean — a photo tagged with 30 people is not a useful filter, and (2) it caps the fan-out cost when a guest later asks "show me photos of me," which scales linearly with average tag count.

**Untagged-still-delivered guarantee.** This is a load-bearing product promise. Every photo and clip uploaded by a Papic is delivered to the couple's gallery in full resolution, regardless of tagging status. Tags improve guest navigation and personal-reel matching, but they never block delivery to the newlyweds. If a Paparazzo shoots 800 photos and only tags 200 of them, the couple still receives all 800 — the other 600 simply land in the "Untagged" bucket of the couple's dashboard, sortable by timestamp.

**Tag visibility for guests.** A guest who scans the wedding QR and lands on the gallery sees three top-level filters: "Photos of me" (anything they're tagged in), "My table" (anything tagged with their table), and "All photos" (the full gallery). This is the navigation Papic makes possible.

---

## Part 3 — User Flows

### 3.1 Couple Onboarding Flow

1. **Discovery and purchase.** The couple is already inside the Setnayan dashboard. Papic appears as a card on the Add-Ons screen alongside Panood. Tapping the card opens the SKU comparison (3 vs. 5 seats); the couple selects one and pays via the existing Setnayan checkout (GCash, Maya, credit card, or installment via BillEase). On payment success, the Papic feature is unlocked on their event.

2. **Pick templates.** Right after Papic unlock, the couple is offered the template library. They browse by feel category (Bridgerton, Taylor-Swift, MJ, Jazz, Sunday Morning, Hip Hop) and preview templates with placeholder content. Each template they want available for their guests is purchased at ₱199. Most couples pick 2–4. The couple can come back and add more templates any time.

3. **Crew invitation.** Couple opens "Invite Papic" and types in 3 or 5 names + email/phone (matching their seat count), or generates a master invitation link. Each invitee receives an SMS or email with a deep link to install the Setnayan native app and an account-claim QR. Couple sees a live status dashboard: who's installed, who's signed in.

4. **Pre-event setup.** Setnayan emails the couple a checklist: confirm crew installs, print table QR tents (Setnayan provides the PDF), do a 10-minute test capture session with crew, and finalize template selection.

5. **Day-of dashboard.** During the event, couple has access to a live dashboard on the Setnayan landing page admin: live photo count, gallery preview, moderation queue. The couple is unlikely to look at it during the event itself — but a designated friend (often the maid of honor or best man) usually monitors it.

6. **Post-event review.** 24 hours after the event ends, the couple gets an email: "Your gallery is ready." They can scroll the full gallery, the Untagged bucket, and toggle anything off-gallery before the public unlock window opens.

7. **Public unlock.** 7 days post-event by default (configurable to 0–14 days), the gallery becomes guest-accessible on the Setnayan landing page. Personal Reels become available to guests at the same moment. Setnayan emails every RSVP'd guest with a link.

8. **Long-tail.** For 90 days the gallery stays hot; couples can re-share, download originals, buy additional templates ad-hoc. After 90 days the gallery moves to cold storage; download links still work, but the live page redirects to a "request access" form.

### 3.2 Papic Crew Member Flow

1. **Get the invite.** Crew member receives an SMS or email from the couple. They tap the link, which opens the App Store / Play Store with a deep link to the Setnayan app. After install, the app auto-launches and reads a one-time pairing token from the deep link, signing them in and binding their account to this couple's wedding.

2. **Practice mode.** Before the event, the crew member can enter "practice mode" inside the app. Practice mode mimics the full capture screen but uploads to a sandboxed practice gallery only the crew member can see.

3. **Day-of capture.** On the wedding day, the app opens directly into the capture screen. The screen shows:
   - Big live viewfinder
   - Tap-to-focus, exposure compensation slider, silent shutter toggle
   - Mode pill: PHOTO | 5-SEC CLIP (no other modes — by design)
   - Tag drawer (collapsed) on the right edge
   - Top status bar: upload queue count, battery, signal

4. **Capture.** Tap the shutter for a photo, or hold the shutter to record up to 5 seconds of video. The app auto-uploads in the background. If signal is poor, captures queue locally; the app shows the queue depth so the papic knows uploads are pending.

5. **Tag.** After each capture, a transient "Tag" pill animates up from the bottom for 3 seconds. Tapping it opens the tag scanner. Crew can scan one or more guest QRs, scan a table QR (tags the whole assigned table), or skip. The 10-tag cap applies. If skipped, the photo still uploads — it lands in the Untagged bucket.

6. **End-of-event handoff.** When the couple's event window closes, all papic accounts auto-unpair from this wedding. A polite thank-you screen appears: "Thanks for shooting Maria & Juan's wedding."

### 3.3 Guest Flow (RSVP → Tagging → Personal Reel)

1. **Receive RSVP confirmation.** When a guest RSVPs (yes) via Setnayan, the confirmation email/SMS now includes a personal QR encoding a wedding-scoped guest_id. Optional one-tap to add to Apple Wallet / Google Wallet.

2. **Day-of arrival.** Guest arrives at the wedding. They show their QR to a Paparazzo when asked. Table QRs are printed on small acrylic tents at the center of each table.

3. **Mid-event.** Guests don't actively do anything with Papic during the event itself. They live their wedding. Photos of them get tagged by the Papic.

4. **Post-event email.** 7 days after the event (or earlier, if the couple set a shorter unlock window), every RSVP'd guest receives an email: "The Maria & Juan wedding gallery is live." The email contains a one-tap link that opens the gallery on their phone, pre-authenticated by an RSVP-token. They land in the "Photos of me" filter.

5. **Personal Reel creation.** The first thing guests see is a banner: "Make your 30-second Personal Reel." Tapping it opens the reel builder:
   1. The 5 highest-quality "Photos of me" are pre-selected (guest can swap)
   2. Guest reviews their 5 selections
   3. Couple's 5 memorable clips are shown as a separate row (not editable by the guest)
   4. Guest picks a template from the ones the couple unlocked
   5. Tap "Render"
   6. 60–90 seconds later, the reel arrives — preview plays in-page, with download and share buttons (TikTok, IG Reels, IG Feed, IG Stories, Facebook, X, WhatsApp, save to camera roll)

6. **Beyond the reel.** Guest can keep browsing — viewing all photos, downloading individuals (subject to the couple's share permissions), tagging themselves in any photos the papic missed (subject to the couple's review).

---

## Part 4 — Technical Architecture (V1)

### 4.1 Data Model

Core entities for the V1 implementation:

```
Event
  - event_id
  - couple_id (FK to existing Setnayan couple)
  - papic_tier (3 | 5)
  - templates_unlocked: [template_id]
  - gallery_review_window_days: int (default 7)
  - hot_retention_days: int (default 90)

PapicSeat
  - seat_id
  - event_id (FK)
  - claimer_user_id (nullable until claimed)
  - claim_qr_token
  - claimed_at (nullable)
  - role_label (optional: "bride-side", "groom-side", etc.)

Guest
  - guest_id (existing in Setnayan's RSVP system)
  - event_id (FK)
  - rsvp_status
  - assigned_table_id (FK, nullable)
  - personal_qr_token

Table
  - table_id
  - event_id (FK)
  - table_number
  - table_qr_token

Photo (and Clip — same table, type discriminator)
  - photo_id
  - event_id (FK)
  - papic_seat_id (FK)
  - r2_object_key (original)
  - r2_thumbnail_key
  - captured_at (camera timestamp)
  - uploaded_at (server timestamp)
  - type: enum('photo', 'clip')
  - duration_seconds (clips only, capped at 5)
  - moderation_status: enum('pending', 'approved', 'flagged', 'rejected')
  - tags_count: int (denormalized, max 10)

PhotoTag
  - photo_id (FK)
  - guest_id (FK)
  - source: enum('individual_qr', 'table_qr', 'auto_face_match')
  - tagged_at
  - tagged_by_seat_id (FK)
  - PRIMARY KEY (photo_id, guest_id)

Template
  - template_id
  - feel_category: enum (bridgerton_feel, taylor_swift_feel, mj_feel, jazz, sunday_morning, hip_hop)
  - manifest_json (the full slot/transition/grade spec)
  - paired_music_track_ids: [track_id]
  - production_ready: bool

EventTemplateUnlock
  - event_id (FK)
  - template_id (FK)
  - purchased_at
  - PRIMARY KEY (event_id, template_id)

PersonalReel
  - reel_id
  - event_id (FK)
  - guest_id (FK who created it)
  - template_id (FK used)
  - selected_photo_ids: [photo_id]
  - r2_output_key
  - rendered_at
```

### 4.2 Native App Architecture

**Platforms:** iOS 16+ and Android 11+ (covers 95%+ of phones in the PH market for the target couple demographic).

**Auth model.** Papic seats use ephemeral, wedding-scoped sessions. The claim flow: deep link from email → app launch → POST claim_qr_token to backend → receive a session token bound to (seat_id, event_id) with TTL through the event's hot-retention window. No traditional username/password.

**Capture screen tech stack.**
- iOS: SwiftUI for the UI, AVFoundation for camera control (AVCaptureSession with manual exposure / focus / shutter), Photos framework for camera-roll fallback
- Android: Jetpack Compose for UI, CameraX (or Camera2 for advanced controls) for capture
- Shared: a thin Rust core (compiled via uniffi/cbindgen) handles upload queueing, retry logic, and the local SQLite persistence layer so the queue survives app kills and reboots

**Upload queue.** Captures land first in a local SQLite write-ahead log with the original blob in the app's sandbox. A background uploader (iOS BGTaskScheduler, Android WorkManager) pushes to Cloudflare R2 via signed PUT URLs issued by the Setnayan backend. Each upload includes capture_time, photo_id, and any client-side tags. Retries with exponential backoff on transient errors; queues survive app kills, reboots, and venue Wi-Fi flakes.

**QR scanning for tags.** The capture screen has a dedicated tag-scanner sheet using AVFoundation's metadata output (iOS) and ML Kit Barcode Scanning (Android). Both decode QR types (`setnayan:guest:{guest_id}` and `setnayan:table:{table_id}`). After each scan, the seat's local DB stages a tag intent; intents flush to the backend as part of the upload payload.

### 4.3 Render Pipeline (Personal Reels)

**Architecture:** Cloudflare Workers + R2 + a containerized FFmpeg renderer running on Cloudflare Durable Objects (or a small Hetzner VM pool if Workers' CPU limits prove too tight for 30-second 1080p H.264 encodes).

**Pipeline:**

1. Guest finalizes 5 selections in the Reels builder UI on the landing page
2. Frontend POSTs to `/reels/render` with `(event_id, guest_id, template_id, selected_photo_ids)`
3. Backend validates: template is unlocked for this event, photos belong to this event, guest is on the RSVP list
4. Backend enqueues a render job to a queue (Cloudflare Queue)
5. Renderer worker picks up the job:
   a. Loads the template manifest from R2
   b. Loads the 5 guest-selected photos and 5 couple memorable clips
   c. Loads the music track from the owned catalogue
   d. Generates an FFmpeg command from the manifest's slot/transition/grade specs
   e. Executes FFmpeg to produce a 1080×1920 H.264 MP4
   f. Writes output to R2 under `events/{event_id}/reels/{reel_id}.mp4`
   g. Inserts a row into PersonalReel
   h. Pushes a completion notification (email, in-app toast) to the guest
6. Guest opens the landing page; reel plays, downloadable, shareable

**Throughput target:** 50 concurrent renders per event (handles a 200-guest wedding within ~30 minutes of public unlock). Each render takes 30–60 seconds of wall-clock time. Cost ~₱2 per render.

### 4.4 Moderation Pipeline

Every photo/clip uploaded passes through:

1. **Format/duration validation** (client + server) — clips must be ≤5 seconds; photos must be valid JPEG/HEIC; max 30 MB per upload.
2. **NSFW detection** (Cloudflare AI Image classification or a small self-hosted model). Auto-flag anything above 0.7 confidence.
3. **Face detection** (for tag matching and opt-out blur) — local on-device first via MLKit/Vision, server-side verification.
4. **Couple review** — flagged items land in a queue accessible from the couple's dashboard. Couple has 7 days post-event default (configurable) to remove anything before public unlock.

### 4.5 Storage & Retention

| Tier | Storage class | Duration | Cost basis |
|---|---|---|---|
| Hot (live gallery, fast access) | Cloudflare R2 | 90 days post-event | $0.015/GB-month |
| Cold (archive, slower access) | R2 Infrequent Access | 5 years post-event | $0.0036/GB-month after day 90 |
| Personal Reel outputs | R2 hot | 90 days | ~5–15 MB per reel |

Originals are never auto-deleted within 5 years. After 5 years, the couple receives an annual reminder to download or extend.

---

## Part 5 — Privacy, Moderation, Risk

### 5.1 Consent Model

- **Couple consent:** captured at Papic purchase. They agree their guests will be photographed by Papic crew and that the couple is responsible for informing guests this is happening.
- **Guest consent:** baked into RSVP. The RSVP page includes a clear notice: "This wedding uses Papic — designated friends will take candid photos and may tag you in them. Photos will be available in a private gallery shared with other guests. You can opt out of being tagged/shown by toggling here."
- **Opt-out registration:** any guest who opts out at RSVP gets registered for face-recognition blur. When their face is detected in any uploaded photo, the photo is shown in the gallery with their face automatically blurred. Opt-out is reversible up to public unlock day.

### 5.2 PH Data Privacy Act (RA 10173) Compliance

- **Lawful basis:** consent (collected at RSVP) and legitimate interest (the event the guest attended).
- **Data subjects' rights:** every guest can request their data via the Setnayan support flow — including the right to access (their photos), correct (untag themselves), erase (remove themselves from the gallery), and portability (download their photos).
- **Retention:** 5 years matches PH industry standard for wedding photographers; after that, automated cold-storage tier with annual couple-prompted retention extension.
- **Data Protection Officer:** Setnayan's existing DPO (registered with the National Privacy Commission) covers Papic.
- **Breach notification:** within 72 hours, per RA 10173.
- **Cross-border transfer:** Cloudflare R2 has data centers in Asia-Pacific; Setnayan selects PH-region buckets for all guest data.

### 5.3 Auto-Moderation Policies

- NSFW filter is **on by default and cannot be disabled** by the couple.
- Couple can additionally enable: detect and remove blurry shots, detect and remove duplicates (same scene within 5 seconds), detect and remove "test shots" (shots taken during the practice/setup window).
- Manual moderation queue reviewed by the couple before public unlock.

### 5.4 Risk Register

| Risk | Probability | Mitigation |
|---|---|---|
| A paparazzo captures something inappropriate (drunk guest, family argument) | Medium | Auto-NSFW + couple's 7-day review window before public unlock |
| Couple disputes which photos go into the gallery | Low | Couple has full control; can toggle anything off-gallery |
| Guest claims they didn't consent to being photographed | Low (consent at RSVP) | Opt-out flow + face-blur opt-out + post-event removal request |
| App crashes mid-event, photos lost | Low (offline queue + WAL) | Local SQLite WAL persists captures across crashes/reboots |
| R2 outage during event | Very low (Cloudflare 4-nines SLA) | Local queue; photos upload when service returns |
| Paparazzo abandons their seat mid-event | Low | Couple can reassign seats from dashboard mid-event; emergency seats available at ₱699 |
| Papic tag the wrong guest by mis-scanning QR | Low | Tags are correctable post-event by guest (untag themselves) and by couple (override anywhere) |

---

## Part 6 — V1 Roadmap & Launch Dependencies

**V1 launch target: Q3 2026.**

### Pre-launch checklist

1. **Music catalogue ready** (Section 14 playbook) — 300–400 owned AI-generated tracks across 6 categories. ~Saturday 2026-05-09.
2. **Template library ready** — 400+ production-ready pre-made templates in JSON manifests. Saturday or follow-up Cowork session.
3. **Native iOS + Android apps** in TestFlight/Internal Testing with 50 beta couples — 8 weeks pre-launch.
4. **R2 storage + render pipeline** load-tested at 50 concurrent renders, 200-guest event scenario — 6 weeks pre-launch.
5. **QR-tagging system** integrated with existing Setnayan RSVP and seating-chart flows — 4 weeks pre-launch.
6. **Pricing live in checkout** with the three SKUs and template purchase flow — 2 weeks pre-launch.
7. **Customer support runbook** finalized (event-day escalation paths, refund policy) — 1 week pre-launch.

### Scope explicitly DEFERRED out of V1

The following ideas were considered and deliberately pushed past V1 to keep the launch tight:

- **All-Guest Unlock tier** (every guest can shoot via web flow)
- **Papic Native Pro Capture Pack** (RAW capture, manual focus peaking, ISO/shutter control)
- **Roving Papic Service tier** (Setnayan-staffed photographers shooting alongside the couple's primary)
- **Premium Photojournalism + Photo Book** (₱59,999 service tier with hardbound output)
- **AI Top-50/100 same-day curation** (post-event hottest shots auto-surfaced)
- **Live Photo Wall** (venue projection of incoming photos)
- **Photo Mission system** (couple-defined shot list with crew gamification)
- **Cross-papic de-duplication** (auto-detecting two shooters captured the same moment)
- **BYO music in Personal Reels** (client-side render with user-uploaded music; CapCut model)

These represent meaningful future revenue and feature surface area. Each deserves its own spec when it's prioritized for V2 or beyond.

---

## Part 7 — V1 Success Metrics

| Metric | Year-1 target |
|---|---|
| Papic events | 480 |
| Average papic seats sold per event | ~4 (blended 3+5 mix) |
| Average templates purchased per event | 3 |
| Average revenue per Papic event | ₱2,446 |
| Year-1 Papic gross revenue | ~₱1,174,000 |
| Year-1 Papic gross margin | ~85% |
| Photos uploaded per event (median) | 1,200 |
| Photos tagged per event (median) | 400 (33% of uploads) |
| Personal Reels rendered per event (median) | 80 |
| Couple NPS for Papic feature | ≥ 60 |
| Crew (papic) NPS | ≥ 50 |
| Public-share rate of Personal Reels (% of rendered reels posted to social) | ≥ 40% |

---

## Part 8 — Glossary

- **Papic (capital P):** the Setnayan product feature — the native-app candid-capture tool described in this spec.
- **Paparazzo (singular) / papic (plural):** the actual person/people shooting at the event using a Papic seat.
- **Seat:** one Papic account in the Setnayan native app, scoped to one wedding.
- **Capture screen:** the native app screen for taking photos and 5-second clips.
- **Tag:** a metadata association linking a photo to a specific guest_id.
- **Tag fan-out:** the back-end operation that creates 1-to-N tag rows when a paparazzo scans a table QR.
- **Untagged bucket:** the gallery filter showing photos with zero tags applied.
- **Template (premade):** a pre-built JSON manifest from Setnayan's library that defines slot order, durations, transitions, color grade, music pairing, intro/outro for a Personal Reel. Sold to couples at ₱199 each.
- **Personal Reel:** a 1–30 second 1080×1920 vertical MP4 generated for an individual guest, mixing up to 5 of their photo picks with up to 5 couple memorable clips. Duration is flexible — guest picks how long they want their reel within the 1–30 second range; template auto-scales slot durations to fit.
- **Couple memorable clip:** one of 5 short video clips uploaded by the couple before the wedding, used in every guest's Personal Reel render.
- **Hot retention:** the 90-day window post-event during which gallery and reels are served from R2's hot tier for fast access.
- **App Unlock:** the act of paying for Papic on a specific event — opens 3 or 5 seats and the rest of the feature for that wedding.

---

**End of specification — V1 locked.**

[View this spec](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan/10_Papic_Feature_Specification.md)

[View the music & template playbook](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan/14_Music_Catalogue_Cowork_Playbook.md)
