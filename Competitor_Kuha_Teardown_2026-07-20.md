# Competitor Teardown — Kuha (kuha.app)

**Date:** 2026-07-20
**Method:** full fetch of the public marketing site + all 28 shipped `_next/static` JS chunks, live DOM render of the client-side pricing table, legal pages, and one live partner subdomain. No authenticated surface, no backend querying — public front-end only.
**Status:** REFERENCE. Contains no Setnayan pricing decisions. Setnayan numbers below are quoted from `Pricing.md` § 00 (canonical, verified 2026-07-19) and are not changed by this document.

---

## 0. TL;DR

Kuha is **not** a planning platform. It is a **single event-day media SKU** — QR photo album + digital invitation + seat finder + guestbook + live slideshow — sold **per album, one-time**, at **₱499 / ₱999 / ₱1,999**, with a **white-label reseller program for event vendors at ₱999/month**.

The collision with Setnayan is **narrow but sharp**: it lands only on the event-day guest-media stack. At their top tier (₱1,999) they package that whole stack for less than Setnayan charges for individual add-ons inside it. Below that tier they sell a bare photo album. They do not compete at all with Setnayan's free planning suite, which Kuha has no equivalent of.

**The single most decision-relevant fact in this document:** their **Digital Invitation, RSVP, and Seat Finder are gated at ₱1,999 (LUXXE only)** — while Setnayan gives all three away at **₱0**. Their ladder is built to force couples up to that tier, and their reseller earns the most (₱600) on exactly that SKU. That is simultaneously their tightest monetisation loop and their most brittle claim.

The real threat is **not price — it's distribution.** They are recruiting the photographers and coordinators as resellers, which is the same channel Setnayan's vendor tiers depend on. This confirms risk #9 in `Papic_Access_Scope_Council_Verdict_2026-07-20.md:229`.

---

## 1. What they actually are (technical)

Read from the shipped bundles:

| | |
|---|---|
| **Frontend** | Next.js App Router, route group `(public)`, static marketing pages + client-rendered pricing |
| **Backend** | **Firebase** — project `kuha-6a7b6`. Firestore (database), Cloud Storage (photos), Cloud Functions, Firebase Auth |
| **Guest identity** | **Firebase Anonymous Auth** — guests get a temporary anon UID, no signup, no app. Confirmed in their privacy policy §2b |
| **App routes found** | `/signup` · `/album/[id]` · `/invite/[id]` · `/slideshow/[id]` · `/album/[id]/thank-you` · `/dashboard/become-partner` · `/a/b` · `/a/i` |
| **ID format** | 20-char Firestore auto-ID (e.g. `4pfYIchHsVuN4n8PYLa5`) — vs Setnayan's `S89<TYPE>-<10 Crockford>` |
| **Payments** | **Contradiction in their own docs**: Terms says **Paddle**, Privacy says **LemonSqueezy**. Both are merchant-of-record processors — meaning *they* are not the merchant, which sidesteps the BIR/OR problem Setnayan solved in-house (0026) |
| **Partner subdomains** | Real and live: `rens.kuha.app`, `demo.kuha.app`, `yourbusiness.kuha.app` — all in the public sitemap |
| **Analytics** | None detected in the HTML. No GA, no Meta pixel, no PostHog |

**Timeline:** Terms + Privacy effective **2025-08-11**. First Wayback crawl **2025-07-19**. Blog seeded in one batch **2026-01-13**. Partner page carries a "Profit Roadmap 2026" badge and has never been archived. → **product ~1 year old; the reseller program is H1 2026 and new.**

---

## 2. Their pricing — verified from the live rendered DOM

### Couple-side (one-time, per album, non-refundable)

> **Verified from computed style, not text.** The tier cards list excluded features *in place* with a red icon (`oklch(0.637 0.237 25.331)`), `text-decoration: line-through`, and italic. A plain text scrape reads them as included — it is not. Every row below is confirmed against the rendered DOM.

| Tier | Price | Photos | Quality | Guest upload window | Album access | Digital Invitation | Seat Finder | Video Guestbook | Slideshow & Games · ZIP · QR |
|---|---|---|---|---|---|---|---|---|---|
| **HOST (trial)** | **₱0** | 200 | SD | 3 days | 1 month | all features, usage-limited | | | ✅ |
| **VIP** | **₱499** | 1,000 | HQ | 30 days | 3 months | ❌ | ❌ | ❌ | ✅ |
| **ELITE** | **₱999** | 3,000 | HD | 60 days | 6 months | ❌ | ❌ | ✅ **(50)** | ✅ |
| **LUXXE** | **₱1,999** | 5,000 | UHD | 100 days | 12 months | ✅ | ✅ | ✅ **(100)** | ✅ |

**This is the most important correction in the document.** Digital Invitation, RSVP, and Seat Finder are **LUXXE-only — gated at ₱1,999**, not available at ₱499. Their cheap tiers are a *photo album and nothing else*. The three features that overlap Setnayan's free tier sit behind their top price.

### Vendor-side (recurring)

- **Partner subscription ₱999/month.**
- Wholesale → SRP: VIP **₱349→₱499** (+₱150) · Elite **₱699→₱999** (+₱300) · Luxxe **₱1,399→₱1,999** (+₱600).
- Claimed inclusions: white-label subdomain, logo/colour replacement, partner storefront ("₱15,000 value"), lead-capture booking form, client dashboard, "Powered by [Your Brand]" attribution on every guest invite.
- Their own stated ROI ceiling: **₱2,001/month net at 5 events/month.**

### The pricing model, stated plainly

They monetise **storage, quality, and time** — every tier is a photo cap, a resolution tier, and an expiry clock. Features are nearly flat across paid tiers; only Video Guestbook quantity scales. **Setnayan monetises capability and capture volume** (capture points per camera·day) and does not expire the gallery.

---

## 3. Feature-by-feature match against Setnayan

Setnayan prices from `Pricing.md` § 00 (canonical).

| Kuha feature | Setnayan equivalent | Setnayan price | Verdict |
|---|---|---|---|
| QR guest photo upload → shared album | **Papic** (Free / Mini / Ltd / Unli) | ₱0 / ₱30 / ₱50 / ₱100 per **camera·day** | ✅ we match and exceed (video, face-sort, reels) |
| No app / no account for guests | Papic guest flow | free | ✅ parity |
| **Digital Invitation + built-in RSVP** | free 4-in-1 website + unlimited RSVP + Custom QR per guest | **₱0** | ✅✅ **we win decisively — ours is free and unlimited; theirs is gated at ₱1,999 (LUXXE only)** |
| Customisable QR templates | `CUSTOM_QR_GUEST` | **₱0** | ✅ parity, ours free |
| **Seat Finder (guest-facing, on the event site)** | 2D seat plan free · `SEATING_3D` ₱2,999 — **but the on-site seat-finder integration is UNBUILT** (`Pricing.md:99,:102`) | ₱0 / ₱2,999 | ⛔ **GAP — but a smaller one than first assessed: it is ₱1,999-gated for them, not ₱499. They ship it; we don't ship it at any price** |
| **Video Guestbook** (50/100 clips) | **Pabati** — video guestbook | **₱1,299** | ⚠ theirs starts at ₱999 (Elite, 50 clips) — **not ₱499**. Closer to parity than first assessed |
| **Live Slideshow** (projector/screen, real-time) | **Live Photo Wall** `LIVE_WALL` — row live but **owner-ordered HIDDEN**, on-site rendering UNBUILT | ₱2,500 | ⛔ **GAP — bundled free for them, hidden and unbuilt for us** |
| **Live guest messages on the slideshow** | no direct equivalent (Kwento ₱299 is words-on-photo, not live) | — | ⛔ gap |
| **Interactive Photo Game / scavenger hunt** | **nothing** | — | ⛔ **GAP — no Setnayan equivalent exists or is specced** |
| One-click ZIP of full album | **Photo Delivery** | **₱0** | ✅ parity, ours free |
| Automated branded "Thank You" page + permanent slideshow | Thank You Video ₱2,499 (coming soon) · event site persists | ₱2,499 | ⚠ theirs bundled + shipped, ours paid + unshipped |
| Permanent memory link | event site / Alaala gallery, kept **indefinitely** | ₱0 | ✅ **we win decisively — see §4** |
| Partner client dashboard | vendor dashboard (6 surfaces) | free-verified tier ₱0 | ✅ ours is deeper |
| Integrated booking / lead capture | vendor inquiries + bid pipeline | ₱200/token to answer | ⚠ theirs is free-with-sub, ours burns a token |
| **White-label subdomain + logo/colour replacement** | **does not exist.** Corp white-label explicitly deferred until ≥5 inbound orders (`Papic_Access_Scope:130`) | — | ⛔ **GAP — this is their entire wedge** |
| Face-sorted delivery / personal reels | **Papic** — shipped | included | ✅ **we win — they have neither** |
| 5-second video clip capture by guests | **Papic** — shipped | included | ✅ **we win — they are photos-only** |
| Planning suite (guest list · budget · vendors · schedule · checklist · mood board · seat plan) | all **FREE** | ₱0 | ✅ **we win — they have literally none of this** |
| Marketplace / vendor discovery | Setnayan marketplace | free | ✅ no equivalent |
| Livestream | Live Studio ₱1,299–₱2,499/day, single-cam **free** | | ✅ no equivalent |

**Score: 6 clear wins for Setnayan, 5 gaps against us, 4 parity, 2 where they bundle what we charge for.**

---

## 4. Where they are structurally weak

1. **Their album expires. Ours doesn't.** Guest upload closes after 3–100 days; album access dies at 1–12 months. Their own pricing comparison table simultaneously advertises **"Forever Event Memory Link — never expires."** That is an internal contradiction: the *memory page* persists, the *album* does not. Setnayan keeps the compressed AVIF gallery **indefinitely** with a 6-month full-res window. This is the single strongest counter-message available, and it is factual.

2. **5,000 photos is the ceiling.** A 200-guest wedding with a real photo culture blows past 5,000. Papic Unli is uncapped (fair-use ~50 GB/cam·day).

3. **Photos only.** No guest video capture. Video Guestbook is a separate messaging feature, not capture. Papic ships 5-second clips at every tier.

4. **No face-sort, no personal reels.** Guests get a shared album; they do not get *their* photos. This is Papic's core promise and Kuha cannot answer it.

5. **Compliance is thin for a PH-market product.** Their privacy policy contains **zero mentions** of RA 10173, the Data Privacy Act, the NPC, a DPO, or a retention schedule. Their Terms grant Kuha a licence to use guest-uploaded content **"for promotional and advertising purposes."** Setnayan holds an NPC dossier and a designated DPO. For venues, hotels, and corporate clients — exactly the buyers a reseller program targets — this is a procurement-stage wedge.

6. **No-refund-ever, on everything**, including partly-used subscriptions. Combined with a merchant-of-record processor, that is DTI consumer-protection exposure in PH.

7. **The partner math is thin.** ₱999/mo requires 2 Luxxe resales *every month, forever*, to break even at ₱201. Their own best case is ₱2,001/mo at 5 events. A slow month is ₱999 out of pocket. Setnayan's free-Verified vendor tier costs the vendor **₱0** to stand up.

8. **The "₱15,000 website" is a subdomain landing page.** It is the softest claim on the page and the one carrying most of the persuasion.

---

## 5. Where they beat us

1. **White-label distribution.** They sell the vendor a *brand*, not a lead. Setnayan sells the vendor *access*. Theirs is concrete and arithmetic; ours is a probability. This is the gap that no price move closes.
2. **Guest-facing Seat Finder actually ships.** Ours is specced, priced at ₱2,999, and the on-site integration is unbuilt. (Theirs is ₱1,999-gated — so the *pricing* pressure is mild; the *existence* gap is the real one.)
3. **Live Slideshow ships and is bundled from ₱499**, their cheapest paid tier. Ours is ₱2,500 and owner-hidden.
4. **Photo Game.** Novel engagement mechanic with no Setnayan counterpart, bundled from ₱499, and it is the thing their vendors will demo.
5. **One price, one purchase, zero decisions.** Setnayan's event-day media equivalent — Papic + Pabati ₱1,299 + Live Wall ₱2,500 + 3D ₱2,999 — is **~₱6,800 à la carte against their ₱1,999 all-in**, and requires the couple to assemble it themselves. Their packaging is materially simpler than ours. Holds **only at LUXXE**; ₱499 and ₱999 buy a bare photo album.
6. **Working card payments.** Paddle/LemonSqueezy charges instantly. Setnayan couple checkout still lands `pending_approval` and requires an admin to write `'paid'`.
7. **Their ladder is engineered to force the top tier — and the reseller is paid to push it.** Digital Invitation and Seat Finder are withheld from ₱499 and ₱999 *specifically* so the couple climbs to ₱1,999. The partner markup is simultaneously steepest there (₱600 on Luxxe vs ₱150 on VIP), so the vendor's incentive and the upsell design point the same way. This is a tighter monetisation loop than Setnayan currently runs anywhere — but it is also the exposed nerve: **their entire model depends on the couple believing the invitation and seat finder are worth ₱1,999, when Setnayan gives both away.**

---

## 6. Correction to an earlier claim in this session

I previously said the Papic **₱4,399 at 300 pax** curve was live and undercut by Kuha's ₱1,999. **That was wrong.** Per `Pricing.md` § 00 (canonical, prod-DB-verified), `PAPIC_GUEST` is **INACTIVE** — the pax curve (`computePaxPriceCentavos`, ₱2,999 + ₱7/pax over 100) is **dormant code, not a live price**. The comparison stands as a warning about the *proposed* Buong Araw repricing, not as a description of what Setnayan sells today.

---

## 7. Open questions for the owner

Each is phrased as a decision, not a task. None is started. None has a PR.

| # | Question | Why now | Gate |
|---|---|---|---|
| **1** | **Do we answer the white-label wedge at all?** | Corp white-label is deferred pending ≥5 inbound orders (`Papic_Access_Scope:130`). Kuha is signing that channel *now*. The deferral may still be right — but it should be a re-made decision, not an inherited one. | OWNER |
| **2** | **Seat Finder on the event site.** Is the 3D Plan the wrong wrapper for a guest-facing seat lookup that arguably belongs in the free tier? | Ours is ₱2,999-gated and the on-site integration is UNBUILT; a rival ships it (at ₱1,999). | OWNER → build |
| **3** | **Does Live Photo Wall stay hidden?** | A rival bundles the same feature from ₱499 as a headline. Ours is ₱2,500 and owner-ordered hidden. | OWNER (reverses a 2026-07-17 call) |
| **4** | **Do we want a Photo Game / scavenger hunt?** | No Setnayan equivalent exists or is specced. Cheap, high demo value, no compliance surface, and it is what their vendors will demo. | OWNER → spec |
| **5** | **Packaging.** Is there an event-day bundle that presents as one price against their ₱1,999, without reversing the à-la-carte model? | Our equivalent stack is ~₱6,800 assembled by the couple. | OWNER (touches `Pricing.md` § 00 — serialize) |
| **6** | **Do we say the free things out loud?** "Unlimited RSVP, digital invitation, and per-guest QR are free" (they charge ₱1,999) and "your gallery never expires" (theirs dies in 1–12 months). Both are true, both are unstated on setnayan.com. | Zero build cost. Highest-leverage item on this list. | marketing copy only |

---

## 8. How to use this in a new session

- **This document is self-contained.** Every Kuha number in it was verified against the rendered DOM or the shipped bundles on 2026-07-20. Nothing here needs re-fetching to be read and acted on.
- **It is REFERENCE, not an execution stream.** It changes no prices, adds no tasks, and is not part of the `WHATS_NEXT_INDEX.md` task graph. §7 is a list of owner *decisions* — each would spawn its own What's-Next item **after** a ruling.
- **If you act on §7 items 2, 3, or 5**, they touch `Pricing.md` § 00 and/or the seating and Live-Wall domains → obey the serialization rules in `WHATS_NEXT_INDEX.md` § 6.
- **Do not quote Setnayan prices from this file.** They are transcribed from `Pricing.md` § 00 as of 2026-07-19 for comparison only. Re-read § 00 before any pricing work — it is the canonical sheet and it moves.
- **Known trap, recorded for the next reader:** Kuha's pricing page renders *excluded* features in place with a red icon and `line-through`. A text scrape reads them as included and produces a materially wrong tier table. Verify against computed style. This error was made and corrected during this research.
- **Re-check cadence:** their partner program is <6 months old and their site was last redeployed 2026-06-25. Worth a re-fetch quarterly, or immediately if a Setnayan vendor mentions them.

---

## 9. Artefacts

Raw captures (9 marketing pages, 4 legal/partner pages, all 28 `_next/static` JS chunks) were written to the research scratchpad, which is **session-scoped and will not survive**. They are not a dependency: every finding above is stated in full in this document. To reproduce, re-fetch `https://www.kuha.app/{pricing,features,partnership,experience/partners,terms,privacy,refund}` plus the chunk list in each page's HTML, and read the pricing tiers from the live DOM rather than the HTML source.
