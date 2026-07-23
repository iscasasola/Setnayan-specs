# Papic — Competitive & Pricing Research (2026-07-20)

> **What this is.** A self-contained research dossier from a single deep session: the Philippine guest-photo competitive landscape, Papic's verified economics, the tax and margin model, four spec-vs-code drifts found in the corpus, and the full history of pricing architectures that were designed, judged, and rejected — with the reasons.
>
> **Status: RESEARCH, not a decision.** Nothing here is owner-locked. Where a recommendation is made, the reasoning and the counter-argument are both recorded so a later session can re-decide rather than inherit a conclusion.
>
> **Confidence marking.** ✅ = verified from a primary source (live page rendered in a browser, or the shipped code in `setnayan-platform`). ⚠️ = single-source or search-snippet only. ❌ = claim checked and found false.

---

## 0. How to use this in a new session

1. Read §1 (the market) and §2 (Kuha) first — Kuha is the real competitor and most prior corpus assumptions predate it.
2. §5 lists **four places where the corpus contradicts the shipped code.** Fix those before writing any pricing copy; a cold session reading the spec would price a product that does not exist.
3. §6 records what was *rejected* and why. Do not re-propose a deletion/expiry SKU without reading §6.1 — it was killed 3–0 by independent red teams, twice.
4. §8 is the open decision list.

---

## 1. The Philippine market — verified landscape

Three PH-priced guest-photo products. All prices captured from their own live pricing pages on 2026-07-20.

| | **Kuha.app** | **PhotoShare.ph** | **EventPix.ph** |
|---|---|---|---|
| Entry | ✅ ₱0 trial (200 photos, SD) | ✅ none | ✅ none |
| Ladder | ✅ ₱499 / ₱999 / ₱1,999 | ✅ ₱999 single SKU | ✅ ₱699 single SKU |
| Photos | 1,000 / 3,000 / 5,000 | unlimited | unlimited |
| Quality | SD → HQ → HD → UHD | claims full-res ❌ (contradicted) | "optimized" (compressed) |
| Upload window | 3 / 30 / 60 / 100 days | **event day only** | 5 days |
| Album lifespan | 1 / 3 / 6 / **12 months** | 30 days *from event creation* | **15 days** |
| Video | guestbook clips (50/100 cap) | ❌ none | ❌ none at ₱699 |
| Face recognition | ❌ none | ❌ none | ❌ none (manual name typing) |
| Rendered output | ❌ none | ❌ none | ❌ none |
| Free tier | trial only, expires | none | none |

**The category-level facts that matter:**

- ✅ **Nobody in the Philippines does face recognition.** Not at any price. EventPix's "guest name tagging" is the uploader typing their own name.
- ✅ **Nobody in the Philippines renders anything.** The deliverable across all three is a ZIP file.
- ✅ **Every one of them expires.** 15 days, 30 days, or 12 months at the very top. This is the single most durable competitive wedge Setnayan has.
- ✅ **All three contradict themselves on permanence.** Each markets a "forever"/"full-res" claim that its own pricing page or FAQ refutes. Details in §2.3 and §3.

**Adjacent real-world comparables (the anchors that actually matter):**

- ✅ Metro Manila **photo booth: ₱5,500–₱13,500/event** — MVN Photostudio ₱5,500 (2hr) · ₱7,000 (3hr) · ₱8,500 (4hr) · ₱10,000 (5hr) · ₱13,500 (8hr). goodtake ₱11,000 (3hr). Flickapalooza ₱6,000–₱11,000 (3hr).
- ✅ PH wedding **livestream videographer ₱15,000–₱20,000** (Prodigital Media, one live feed, 1080p).
- PH wedding photography packages ₱50,000–₱150,000; second shooter ₱15,000–₱30,000.

---

## 2. Kuha.app — full teardown (the real competitor)

Prices are JS-rendered; static fetches return nothing. All figures below captured by rendering in a real browser.

### 2.1 The consumer ladder — one-time per album, no subscription

| Tier | Price | Photos | Quality | Guest sharing window | Album access |
|---|---|---|---|---|---|
| **HOST (Trial)** | ✅ ₱0 | 200 | SD | 3 days | 1 month |
| **VIP** | ✅ ₱499 | 1,000 | HQ | 30 days | 3 months |
| **ELITE** | ✅ ₱999 | 3,000 | HD | 60 days | 6 months |
| **LUXXE** | ✅ ₱1,999 | 5,000 | UHD | 100 days | 12 months |

⚠️ "MOST POPULAR" badge placement is inconsistent between the homepage grid (LUXXE, per screenshot) and /pricing (ELITE, per agent render). Minor, but don't cite it as fact.

**Feature gating — verified from the rendered cards (the red ✗ marks):**

- **Digital Invitation** and **Seat Finder** are **LUXXE-only** on the homepage grid. (⚠️ The /pricing render showed them on VIP/ELITE too — the two surfaces disagree. Treat as unresolved.)
- Video Guestbook: ✗ VIP · 50 on ELITE · 100 on LUXXE.
- All paid tiers: Live Slideshow & Games, ZIP Download, QR Templates.

**Terms of Service corroboration** ✅: *"Our 'Host,' 'VIP,' 'Elite,' and 'Luxxe' tiers are offered as one-time purchases for a single album"* and *"Each Album Bundle grants a specific set of features, photo limits, and an expiration period for one (1) album."*

### 2.2 The free-to-paid boundary

The free tier is a **trial**, walled on four axes at once: 200 photos · **SD quality** · 3-day upload window · 1-month access. Its fifth bullet is the boundary statement: *"All features available, with usage limits."* Kuha gates on **quantity and quality, not feature access**.

✅ **No watermark is mentioned anywhere on the site.** The free lever is SD resolution + the 3-day window. Do not assume a watermark exists.

⚠️ Whether ZIP download works at ₱0 is unresolved — "all features available" contradicts the bullet list, which omits it.

### 2.3 The retention trap — Kuha's sharpest weakness

Footnote under the homepage pricing grid, verbatim (their capitalization):

> *"A SHARING WINDOW REFERS TO THE ACTIVE TIME GUESTS CAN UPLOAD PHOTOS AND VIDEOS. ONCE THE WINDOW CLOSES, ORIGINAL MEDIA IS RETIRED BUT YOUR MEMORY PAGE STAY ONLINE FOREVER. WE ALWAYS SUGGEST DOWNLOADING YOUR ORIGINAL ZIP ARCHIVE WITHIN YOUR ACCESS PERIOD."*

**Two contradictory clocks in one paragraph.** Originals are "retired" when the *sharing window* closes (3/30/60/100 days), yet the buyer is told to download within the *access period* (1/3/6/12 months). Kuha never says which clock actually deletes the files.

Meanwhile the /pricing comparison table markets: *"Forever Event Memory Link — Permanent, shareable event memory (never expires)."* That "forever" is scoped **only to a derivative slideshow / Memory Page**, not the originals — confirmed by the "Automated 'Thank You' Gift" feature, which creates *"a beautiful 'Thank You' page with a permanent slideshow link."*

✅ **This is the single most attackable contradiction in the PH market.** At ₱1,999, a couple's originals are gone somewhere between day 100 and month 12, permanently, with no renewal path except undisclosed add-ons.

### 2.4 Add-ons — exist, prices NOT published ✅

ToS confirms a second revenue layer with zero public figures. Examples given verbatim: *"Add 1,000 more photos"*, *"Extend expiration by 7 days"*. *"All fees for Add-On Purchases are paid in full at the time of purchase and are non-refundable."*

No add-on price appears on /pricing, the homepage, /features, /faqs, /terms or /refund. **Kuha's real all-in cost per event is unknowable before purchase.** A couple who blows past 1,000 photos on a ₱499 VIP album pays an undisclosed amount at the moment of maximum pressure — mid-event, window closing.

### 2.5 Partner Program — ₱999/month, aimed at Setnayan's vendor side ✅

This is the finding with the most strategic weight.

Page `/experience/partners`, verbatim: *"Kuha isn't an expense—it's a self-funding asset. See exactly how your ₱999 subscription turns into a monthly profit engine."* ToS confirms it is a **recurring auto-renewing subscription**.

**Published wholesale sheet:**

| Album tier | Client SRP | Partner rate | Partner profit |
|---|---|---|---|
| VIP | ₱499 | ₱349 | ₱150 |
| Elite | ₱999 | ₱699 | ₱300 |
| Luxxe Wedding Suite | ₱1,999 | ₱1,399 | ₱600 |

Partner inclusions: white-label subdomain `yourbusinessname.kuha.app` · custom logo and colors · client management dashboard · integrated booking/lead capture · branded memories page · **"Powered by [Your Brand]"** on every digital invitation. They value the bundled partner website at *"₱15k Value"*.

Their published ROI math: ₱999/mo subscription, breakeven at 2 Luxxe sales (₱1,200 markup), *"If you handle 5 weddings/events a month, you earn an extra ₱2,001.00 net profit."*

**Strategic read:** the margin ladder is thin (₱150–₱600/album) and the ceiling is ~₱2,001/month at 5 events — hobbyist-scale vendor income. Setnayan's vendor subscriptions (Solo ₱999/28d · Pro ₱2,499/28d · Enterprise ₱7,999/28d) sit at or above Kuha's *entire* partner tier while offering a marketplace, not just a resale margin. But Kuha is **already recruiting the same photographers and coordinators**, and a free white-label website is a real hook.

### 2.6 What Kuha ships that Setnayan does not

- **Interactive photo scavenger hunt** with mission list, leaderboard and a WINNER screen. Debut version: *"18 Moments Photo Scavenger Hunt"* — "Photo with the Debutant", "Best Gown Shot", "Rose with the Celebrant".
- **Live guest messages** appearing on the slideshow during the event.
- **Digital invitations** with animated envelope reveal, venue maps, live countdown, dietary notes, one-click CSV export.
- **Printed customizable QR invite cards.**
- **One-click original-resolution album download.**
- **Deep per-event-type cultural localization** — RSVP tracking for *"18 Roses, Candles, and Treasures"*; *"Barkada-Friendly Sharing"*.
- **Instant self-serve activation** (~60 seconds vs Setnayan's 24-hour manual reconciliation).

### 2.7 What Kuha does not have

❌ Face recognition · ❌ per-guest photo delivery · ❌ souvenir reels · ❌ any rendered video output · ❌ permanent originals · ❌ vendor marketplace · ❌ planning tools (budget, seating editor, run-of-show, vendor management).

---

## 3. PhotoShare.ph and EventPix.ph — condensed

**PhotoShare.ph ₱999** ✅ — unlimited guests and photos, branded QR, live photo wall on HDMI, **event-day uploads only**, 30-day storage *from event creation* (not event date), browser-only, no free tier, single SKU.

Three self-contradictions on their own site:
- **Moderation:** FAQ states *"photos cannot be approved before they appear on the live wall"* while marketing pages claim pre-approval. **No pre-approval queue and no NSFW filter published.**
- **Resolution:** "Photos are never compressed" (About) vs "Batch uploads with automatic compression" (homepage, step 2).
- **Storage:** 30-day marketing vs a Privacy Policy saying photos are *"retained until the event host deletes them."*

Guests upload **from their camera roll** — it is a collection product, not a capture product.

**EventPix.ph ₱699** ✅ — unlimited photos, "optimized" quality (never claims full-res), 5-day upload window, **15-day storage**, manual guest name tagging, no video at this tier, no free tier, single SKU, no upsell path.

⚠️ A "photo+video tier from ₱1,299" was reported by one agent but does **not** appear on their pricing page, and their schema.org markup lists 699 as the sole offer. Treat as unconfirmed.

✅ **EventPix is explicitly optimizing for AI-assistant discovery** — seven per-event-type landing pages with copy addressed to users who *"found EventPix through search or AI tools"* (Wedding PH, Debut, Birthday, Corporate PH, Affordable, QR App, No-Download).

---

## 4. Global comparables — what the world charges for what Papic gives away

- ✅ **GuestCam** sells face-matching as a standalone **$45 (~₱2,520) one-time add-on**, on top of a $49/$97 base. *This is the observed market price for the feature Papic includes free.*
- ✅ **Pic-Time** gates face recognition to its top tier: $42/mo billed annually.
- ✅ **Memzo** meters face recognition at **3¢/photo** (~₱3,400 for a 2,000-photo wedding).
- ✅ **Guestpix** ($49/$89/$119), **Kululu** ($39–$99 promo / $79–$199 list), **Wedibox** ($49/$79), **Eversnap**, **Fotify**, **POV** — none have face recognition at any price.
- ✅ Across the **entire** global category surveyed, exactly **one** product auto-renders a per-guest reel (Foto Owl AI, "ReelIt").
- ✅ **Nobody sells capture.** Every product examined is an upload destination. There is no designated-photographer seat model anywhere in the market.
- ✅ Gallery **lifespan is the most-monetized axis globally** — Kululu, Fotify and Guestpix all sell storage duration as the paywall.

**Global all-in-one planners (for platform context):** The Knot, Zola and Joy give couples the website/RSVP/planning suite free and monetize vendors; the only couple-side charges are custom domains (~$15–20/yr). Zola's seating chart seats **15 guests free**, is 2D, and is iOS-app-only. Bridebook (UK) charges couples nothing at all. Appy Couple has moved to $99/yr.

**3D seating:** ✅ Prismm (now Cvent) ladder is Free $0 / Standard $49/mo / Pro $150/mo / Premium $320/mo / **Enterprise custom — and 3D rendering appears only in Enterprise.** Its free tier caps at 1 user, 3 events, 2 diagrams, 150 attendees, and targets planners, not couples. 3D Event Designer has 2D+3D on all tiers but **no free plan**. Merri/Tripleseat sells 3D to the trade only.
→ **The defensible claim is not "free 3D is unique" but "everywhere else, 3D sits behind an enterprise sales call or a venue's software budget, and the couple only sees it if someone else paid."**

**PH-local platform competitors** (beyond photo apps): WedPlanner.ph (free tier caps at 25 items, paywalls seating/mood board/RSVP/AI) · Vowly (₱0 up to 50 guests / **₱2,499 per event** up to 500, with AI assistants, SMS **and WhatsApp** reminders, GCash gift collection; claims 5,000+ Filipino couples) · RSVPMePls (₱0/50 guests · **₱8,995/event** unlimited) · Ating Tagpuan (**₱1,500 / ₱6,299 / ₱9,500**) · Storia.ph (free Wedding DNA quiz + "Hiraya" AI budget assistant trained on PH pricing incl. corkage/VAT/overtime; no published prices) · Kasal.com (directory only — vendor listings **₱10,000 / ₱30,000 / ₱45,000 per year**, ~17,000–20,000 suppliers, 30,000 couples claimed).

---

## 5. ⚠️ FOUR SPEC-VS-CODE DRIFTS — fix before writing any pricing copy

These were found by reading `setnayan-platform` directly. **The corpus is wrong on all four.**

### 5.1 Capture resolution — the spec claims 12 MP; the code ships ~3.7 MP ❌

`apps/web/lib/use-papic-camera.ts:200` constrains capture to `{ width: { ideal: 2560 }, height: { ideal: 1440 } }`. The comment is explicit: stills are canvas-grabbed from the video stream, yielding **≈3.7 MP**, and true full-sensor stills would need `ImageCapture.takePhoto()` which iOS Safari doesn't support.

The 2026-07-17 spec claims **"Optimal ~4256px · ~12 MP · sharp to A3."** Not shipped. There is also **no quality-tier system in code at all** — grepping `optimal` / `high_efficiency` across the Papic path returns nothing.

**Consequences:** (a) never market Papic on megapixels or print size; A3 at 300 dpi needs ~17 MP, you have 3.7. (b) Competitors accepting camera-roll uploads may deliver *higher* resolution than Papic capture. (c) Papic Lite's "High Efficiency 2560px" differentiator is identical to what the paid tiers already capture.

**What actually ships** (`lib/papic-derivatives.ts`): original 2560×1440 JPEG (~1–1.5 MB, dropped at 90 days) → display AVIF long-edge **1280** q≈60 (~150 KB, kept forever) → thumb 320 q≈50. The real two-version split is *original vs 1280px display copy* — a genuine 4× pixel gap.

⚠️ `lib/papic-adaptive-quality.ts` degrades encode quality on weak connections. Two guests at the same wedding produce different-quality originals. If originals are ever sold as a premium tier, either floor the quality when paid or disclose it.

### 5.2 Free full-res window — code says 90 days; spec says 6 months ❌

`lib/papic-fullres-drop.ts:14` — *"3-month full-res drop… After the free full-res window (default 90d)"*, configurable via `PAPIC_FULLRES_RETENTION_DAYS`. The 2026-07-17 spec says 6 months. The customer email says *"in about two weeks."* **Three different numbers live in the corpus and product simultaneously.**

### 5.3 `HIGH_RES_ARCHIVE` advertises "₱999/yr" but grants permanently ❌

Migration `20270723385655` makes Keep Full-Res an **active, sellable** SKU: `('HIGH_RES_ARCHIVE', 'Keep Full-Res', 999, 350, true, 'per_year')` — ₱999/yr, cost basis ₱350/yr per 50 GB. UI shipped on the Papic studio page; enforcement wired into the drop sweep; email nudge live.

But `lib/entitlements.ts:234` `checkOrderActive` matches **any** order with status `paid`/`fulfilled` — **no date check, no expiry, no renewal.** `billing_period` only formats a display suffix. So the couple pays ₱999 once and holds it forever, against a ₱350/yr obligation. **Breakeven 2.9 years, then permanent loss.**

Meanwhile the 2026-07-17 spec states *"Keep Full-Res is RETIRED entirely. There is no paid full-res hosting."* **The spec says retired; the code sells it.** This is a live consumer-facing claim mismatch.

### 5.4 Face auto-tagging — decision log says dormant; it has been LIVE since 2026-06-19 ✅

`DECISION_LOG.md` 2026-06-29 states the face model isn't hosted and auto-tagging is dormant. `OWNER_ACTIONS.md` records: **"✅ Activated 2026-06-19"** — 7 model files on R2, `NEXT_PUBLIC_FACE_MODEL_URL` set in Vercel Production, redeployed, and **verified with a real-face demo** (same-person 0.40–0.47, different-person 0.79–0.90, zero false positives).

The OWNER_ACTIONS entry is more specific and evidence-backed. **Face auto-tagging is live.** Correct the decision-log row.

**Two open follow-ups on it, both now launch-blocking:**
1. ⚠️ Models serve from the **rate-limited `pub-37d64…r2.dev` host**. A 250-guest reception hammering it turns the flagship feature into a public failure. Needs a custom domain (`media.setnayan.com`).
2. ⚠️ **No "remove tag / not me" control.** A false positive cannot be corrected — a product gap and an RA 10173 gap (biometric processing with no subject-side correction path).

---

## 6. Papic — verified capability & economics

### 6.1 What is real (all ✅ from code)

- **Face auto-sort per guest** — live, runs on the *guest's phone* via face-api.js → **₱0 marginal inference cost.**
- **Face blocking** — guest blurs themselves from public surfaces; couple keeps the clear original. RA 10173 right, never a SKU.
- **Personal souvenir reels** — `lib/reel-render.ts` (1,083 lines), 9:16 MP4, **client-side** WebCodecs → MediaRecorder fallback, optional music mix. **₱0 server compute.** Renders *reels*, not full films.
- 5-second video clips · Kwento · Pabati · Guest Stories.
- **Per-guest custom QR: FREE** (`CUSTOM_QR_GUEST` = ₱0, active since 2026-06-29 — the ₱1,499 figure in the old SKU table is stale).
- Compressed gallery kept **indefinitely**; NSFW filter non-disableable; host moderation.
- ⚠️ **No full-length film render pipeline.** The 2026-06-29 accuracy pass ruled: *"short clips (not full films)."* Do not market "we compile your wedding video."

### 6.2 Cost model (corrected)

| Item | Value |
|---|---|
| R2 Standard | $0.015/GB-mo × 12 × ₱57/USD = **₱10.26/GB-yr** |
| ⚠️ Non-VAT → 12% PH digital-services VAT (RA 12023) on Cloudflare/Vercel **not creditable** | ×1.12 → **₱11.49/GB-yr effective** |
| Blended with tiering (hot R2 → R2-IA @90d → Backblaze B2 @12mo) | **₱6.05/GB-yr** |
| R2 egress | **FREE** |
| Perpetual compressed gallery, paid event | ~0.7 GB → **₱3.22/yr** at the cold tail |
| **All-in cost per paid event** | **₱97.94** (gallery capitalised 10 yr + R2 ops + Vercel + Resend + ₱7.50 manual reconciliation) |

⚠️ **The migration's ₱350/50 GB-yr (= ₱7/GB-yr) is stale on FX** — it only reconciles at ~₱42/USD. Every margin figure computed from it is ~47% optimistic on storage.

### 6.3 The storage-liability question — modelled and refuted ✅

At **1,000,000 events/year** (95% free / 5% paid, ₱49.95M gross):

| | Year 1 | **Year 5** | Year 10 |
|---|---|---|---|
| Total storage bill | ₱1,148,068 | **₱2,245,556** | ₱3,274,450 |
| % of revenue | 2.30% | **4.50%** | 6.56% |
| Free tier's share | ₱320,859 | ₱500,277 | ₱668,480 |
| Free tier as % of revenue | 0.64% | 1.00% | **1.34%** |

**Key findings:**
- At year 10 there are **9.5 million free galleries alive**, costing **₱0.070 each per year**. A free gallery held 30 years costs **₱1.42**.
- **The paid tier is the cost driver, not free.** Free events are 95% of volume but only **16.3%** of accumulating bytes — a paid gallery (0.70 GB) is **97× larger** than a free one (7.2 MB).
- **One ₱999 event prepays its own perpetual storage for ~310 years.**
- **Two non-storage lines each exceed the entire free tier:** manual reconciliation (50,000 × ₱7.50 = ₱375,000/yr) and LGU business tax (₱374,625/yr). *Free is not the liability; unautomated bookkeeping is.*
- **One Enterprise vendor at ₱79,999/yr covers the whole 9.5-million-gallery free tier.**
- 38% of the free tier's cost is the **90-day full-res window**, not the perpetual gallery. If trimming is ever needed, shorten that window — never the compressed gallery (12× cheaper, and the entire wedge).

**Highest-value engineering action, independent of all pricing decisions:** ship the storage lifecycle tiering (hot R2 → R2-IA at 90 days → Backblaze B2 at 12 months). It turns ₱11.49/GB-yr into ₱6.05 blended, needs no SKU, no consent gate and no billing engine.

### 6.4 Tax & margin model

**Current regime** ✅ (owner-decided 2026-07-15): Setnayan is an **additional trade name on ICASA ENTERPRISE**, sole prop, **non-VAT, 8% flat income tax on GROSS receipts** (costs are **not** deductible). Plus **LGU business tax ~0.75% of gross** — missed in every earlier model. The 8% must be re-elected every Q1.

**The owner's rule — profit ≥ 70%** resolves to:

```
Profit = S − 0.08S − 0.0075S − C = 0.9125S − C
For ≥70%:  C ≤ 0.2125S   →   S ≥ C × 4.71
```

**⚠️ The rule has an expiry date.** Crossing the **₱3M combined-gross tripwire** (ICASA + Setnayan) forces 12% VAT prospectively *and voids the 8% election retroactively for the whole year*. Then:

```
After-tax profit = 0.7 × (0.886S − C)  →  maximum possible ≈ 62% of sticker, even at zero cost
```

**70% becomes mathematically unreachable.** Not expensive — impossible. Incorporating at the 20% small-corporation rate raises the ceiling to ~71% but requires all-in cost under ~1.1% of sticker, which almost nothing meets. **Realistic planning number: 70% now, ~55–62% after ₱3M.** Build the combined-gross gauge before launch marketing.

**Channel: stay off in-app purchase.** At 3,000 events on a ₱999 ceiling the 30% store cut is ~₱900,000/yr for zero added capability. Ship Capacitor shells with **no purchase surface inside the binary**. (If IAP ever becomes unavoidable: Google Play's 15% on the first $1M is automatic; Apple's Small Business Program is opt-in.) ⚠️ Whether the 8% applies to the full sticker or the net remittance under IAP is genuinely unsettled and likely differs Apple (agent) vs Google (merchant of record) — needs a BIR ruling, moot if you stay on web.

**The binding constraint at the bottom of the ladder is labour, not cost.** Papic Mini's storage cost is ₱0.28; the ₱7.50 manual reconciliation is what breaks its margin. **Rule: no standalone manual-rail checkout below ₱200.** PayMongo GCash at ~2.5% costs ₱0.75 on a ₱30 sale vs ₱7.50 of human time — **automating the rail is worth more than any pricing change.**

---

## 7. Pricing architectures designed and judged — and why they were rejected

Six workflows, ~190 agents. Recording the *rejections* so they aren't re-proposed.

### 7.1 ❌ Deletion / expiry SKUs — rejected 3–0, twice

Proposals: "1-month preservation, no extension"; "15 days for ₱649, no preservation."

All three independent red-team lenses (brand/moat, unit economics, ops/legal) returned **do_not_ship**:

- **It is a paid downgrade from free.** The free tier already keeps the compressed gallery forever. Charging for a version that self-destructs is unexplainable on a pricing page.
- **The fence is inverted.** A price-discrimination fence must withhold something that costs you money. Storage is ~₱2/album with free egress. Competitors' expiry is *cost-driven*; yours would be *manufactured* — and a competitor can say so truthfully.
- **"Cannot be upgraded" is brand poison.** It engineers a scene where a couple offers money for their own wedding photos and is refused. It also collides with the lock: *"a single missed prompt must never cost a couple their gallery."*
- **AI-assistant risk:** assistants flatten a catalog to its cheapest paid entry and will emit *"Papic: from ₱X, photos deleted after 1 month"* — the most quotable string in the catalog.
- **Harm reduction if ever shipped anyway:** expire the **capture window**, never the gallery.

**Also fatal for a paid 1-month window specifically:** the free full-res window is already **90 days** (§5.2) — three times longer.

### 7.2 ❌ Recurring preservation fee — rejected

- **No recurring billing engine exists** (§5.3). Renewals would ride a 24-hour manual rail: 50,000 events = 50,000 manual invoices/year.
- **Free Google Drive sync is built but unactivated** — if promoted, it is a free competitor to any paid preservation SKU.
- Storage economics don't support it (§6.3): ₱999 prepays 310 years.
- **The structural principle worth keeping:** *one-time for artifacts, recurring for capability — never for the right to keep what you already own.* A capability subscription lapses harmlessly (fewer free cameras next event); an artifact-duration subscription cannot lapse without deleting something.

### 7.3 ❌ ₱7,999+ couple-direct anchors — rejected

No evidence any Filipino couple has paid ₱8,000 for app-delivered, phone-captured coverage. Nearest verified comps: ₱699, ₱999, ₱1,999, and GuestCam's ~₱2,520 face add-on. *A price defended entirely by what it is cheaper than does not survive a buyer.*

### 7.4 ❌ Shrinking the free tier — rejected by every judge panel

Four of five architectures tried it. Rejected because: it **takes hostages who cannot pay** (150 guests lose albums, only the couple can buy them back); it **reverses a shipped promise** (*"dati libre 'yan"* travels faster than any price complaint); and it **kills the only distribution Papic has** — ~150 branded, face-sorted guest touches per free event at ₱0 marginal cost, which is what feeds platform adoption and vendor subscriptions.

⚠️ **Setnayan's permanent free tier (60 captures) is currently smaller than Kuha's trial (200 photos).** If free is carrying the competitive argument, 60 is too small.

### 7.5 ⚠️ The ₱999 cumulative ceiling — designed, not adopted

"Make the cap the price": keep Mini/Ltd/Unli, add a cumulative per-event ceiling of ₱999 also sellable as a flat SKU. Needs no instant-pay rail. Would replace the ₱6k/₱10k/₱15k daily caps (owner sign-off required). Superseded by later work but the *mechanism* is sound and reusable.

### 7.6 ⚠️ The artifact ladder — highest-scoring, superseded by owner decisions

*Stop metering capture; sell manufactured output.* Blended ~₱1,300/wedding vs ~₱375 for a ₱999 ceiling (**3.5×**), ~₱1,747 post-automation. Judges killed the more aggressive designs' 45–60% attach assumptions as 3–8× optimistic for self-serve on a manual rail.

**Note:** two of its three revenue pillars (Photo Wall, Thank You) were made **free** by owner decision on 2026-07-20, so the ladder as specified no longer holds. The *principle* stands.

**Best single artifact from that work — the comparison line:**

> *"₱699 is what they charge for the part we give away free. Papic's cameras, photos, videos and face-sorting are ₱0 — unlimited, and nobody's photos get deleted. What we paid for is what a shared folder can't make: every guest's own reel, the photo wall, the thank-you film, and our full-res originals. ₱33 a guest. Our giveaways cost ₱90 each."*

**Operating rule: never quote a Papic price first. Quote ₱0, then name the artifacts.**

**Value anchor: the souvenir/giveaway line, ₱50–₱150 per head** — per-head, budgeted by every couple, and mostly thrown away. ❌ **Do not use the catering anchor** ("₱1,200/head for lechon" invites "that's food, people have to eat"). Use the booth as *"covers what the booth can't"*, never *"replaces the booth"* — couples book both.

---

## 8. Open decisions

1. **Free tier size** — stays at 60 captures, or grows? Kuha's *trial* is 200 photos. Costs ~₱1/event to raise. Breaks an owner-locked value.
2. **The paid surface** — with Photo Wall, Thank You, the photo game, face-sort, reels, Kwento, Pabati, Guest Stories and custom QR all free (owner, 2026-07-20), only **capture volume** and **full-res originals** have real marginal cost. Both are exactly what Kuha meters. Differentiation must come from out-speccing their caps (5,000 photos / 100 clips / 12 months) and from the free tier.
3. **`HIGH_RES_ARCHIVE`** — un-retire it in the spec as a bounded one-time, build real renewal, or remove it from the catalog. It currently advertises a renewal it never collects (§5.3).
4. **Google Drive sync** — activate and promote free (needs Google OAuth review, 1–4 weeks + 3 env vars), or drop it? It cannot coexist as an equal with a paid preservation SKU.
5. **Vendor channel response** — Kuha is recruiting photographers at ₱999/mo with a free white-label website (§2.5). Setnayan has no equivalent counter-offer.
6. **Per-event-type landing pages** — Kuha has 4+ with deep cultural localization, EventPix has 7 explicitly targeting AI-assistant discovery. Setnayan has 14 event types and **zero** such pages. Cheap, and it is where discovery is heading.

---

## 9. Launch blockers (independent of pricing)

1. ⚠️ **Face models on a rate-limited `r2.dev` host** — needs a custom domain before any packed event.
2. ⚠️ **No "remove tag / not me" control** — product gap and RA 10173 gap.
3. ⚠️ **Manual 24-hour payment reconciliation** — Kuha and PhotoShare activate in ~60 seconds. A couple deciding Thursday for a Saturday wedding can buy them and cannot buy you. Optimistic issuance at `pending_payment` with 7-day auto-revoke is the cheap mitigation (marginal cost ~₱2/album).
4. ⚠️ **Storage lifecycle tiering not shipped** — the single highest-value cost action (§6.3).

---

## 10. Sources

**Primary (rendered live 2026-07-20):** kuha.app (/, /pricing, /weddings, /reunion, /experience/partners, /terms, /refund) · photoshare.ph (15 pages) · eventpix.ph · vowly-ph.com · photoshare.ph/pricing · kasal.com/join-us · atingtagpuan.com · rsvpmepls.com · storia.ph · wedplanner.ph/pricing · bridebook.com/uk · planning.wedding/pricing · guestpix.com · kululu.com · lovecastapp.com · eventlive.pro · business.bridestory.com · cvent.com prismm-pricing · withjoy.com · zola.com · theknot.com.

**Code (`~/Documents/Claude/Projects/setnayan-platform` @ `dd0cf98cf`):** `lib/use-papic-camera.ts` · `lib/papic-derivatives.ts` · `lib/papic-adaptive-quality.ts` · `lib/papic-fullres-drop.ts` · `lib/entitlements.ts` · `lib/reel-render.ts` · `lib/papic-drive.ts` · `lib/v2-catalog.ts` · `supabase/migrations/20270723385655_keep_full_res_archive_sku.sql` · `OWNER_ACTIONS.md`.

**Method:** 6 multi-agent workflows (~190 agents) — deep research fan-out, competitor gap-fill, spec teardowns, pricing architecture judging, storage-liability modelling, and a final council. Price claims were adversarially verified where budget allowed; §1–§4 figures marked ✅ were re-fetched by hand.

⚠️ **Known coverage gaps:** the first research pass hit a session token limit and ~79 of 85 competitor claims went unverified — those were re-checked by hand for the PH players but not for the international ones. Kuha's event volume and company details are unknown; a well-built product with 50 customers is a different threat from one with 5,000. Attach rates in every revenue model are *modelled, not measured* — Setnayan has no shipped Papic revenue distribution. Pull the real byte-per-event distribution from `papic-storage-telemetry.ts` before committing any ladder publicly.
