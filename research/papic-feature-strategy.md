# Papic — Feature Strategy & Disruption Roadmap

**Companion to:** Volumes I and II
**Compiled:** 29 August 2026
**Question answered:** what to build so Papic is first to the right combination, not just first to a longer list.

---

## 0. The uncomfortable premise

You asked what features will disrupt this market. The honest answer starts with a warning:
**features are not where this market is won, and a feature race is the one fight you lose.**

Evidence from Volumes I and II:

- Kuha already ships QR upload, live slideshow, photo game, RSVP, digital invitations, seat
  finder, permanent links, and a white-label partner programme. They are a small team on Firebase
  moving fast. Anything you ship, they can ship in a quarter.
- Fotify ships AI moderation, live streaming, RSVP, DJ requests, table management and TikTok-style
  stories for $49.99 — and publishes comparison content against every rival.
- AI highlight reels, face search, photo games, live walls and guestbooks are all **table stakes
  in 2026**, not differentiators.

A longer feature list gets copied. Three things do not get copied quickly: **a cost structure your
rivals cannot match, a compliance position they cannot claim, and a distribution channel they
cannot reach.** Every feature below is chosen because it defends one of those three, or because
not having it loses you deals.

**The single most important reframe in this document:** Papic's unfair advantage is not that it
is a better photo app. It is that **Papic is not a photo app at all — it is a feature of a wedding
planning platform** that also runs vendor subscriptions and portfolio hosting. Kuha would have to
build an entire planning platform to match that. You already have one. Section 5 is about
weaponising it, and it matters more than Sections 2–4 combined.

---

## 1. Novelty audit — what is actually first-to-market

Before you write "first in the market" on any slide, check it against this.

| Feature | Status | Who already has it |
|---|---|---|
| QR browser upload, no app | Table stakes | Everyone |
| Live photo wall | Table stakes | Kuha, PhotoShare, EventPix, GuestCam, Fotify, Guestpix, Pix Wedding |
| Photo challenges / games | Table stakes | Kuha (scavenger hunt), Guestpix (I-Spy) |
| AI face search by selfie | Commoditised | GuestCam, Kamero, FotoOwl, Kwikpic, Memzo, FindMe, SnapSeek, EventPixel |
| **AI highlight reel** | **Not novel** | Cam-Shot, FotoOwl, Capsule, Samaro |
| Professional photographer gallery merge | Not novel | GuestCam, SnapSeek, Kamero |
| Per-guest shot limits | Not novel | Lense, Scene, POV |
| Timed / delayed reveal | Not novel | Scene, Lense, POV, Once |
| Pre-display moderation | Rare | POV only (and gated behind an add-on) |
| Multi-level photo privacy | Rare | Kamero, FotoOwl (host-controlled, not guest-controlled) |
| Data-residency compliance pitch | Rare | Gathmo (EU only) |
| **Guest-initiated biometric opt-out** | **Genuinely first** | Nobody found |
| **Graduated per-surface consent** | **Genuinely first** | Nobody found |
| **Shot throttling paired with a live wall** | **Genuinely first** | Nobody found |
| **Multi-chapter journey (engagement → wedding)** | **Genuinely first** | Nobody found |
| **Messenger/Viber-native delivery** | **First for PH** | Samaro does WhatsApp — wrong app for this market |
| **Filipino wedding role and ritual modelling** | **Genuinely first** | Nobody found |
| **Civil-ceremony product** | **Genuinely first** | Nobody found |

Seven genuine firsts. Build around those. Everything else is either catch-up or noise.

---

## 2. Pillar One — the Consent Layer

*Defends: the compliance moat. Attacks: GuestCam, Kamero, every AI rival.*

Volume II established that biometric data is sensitive personal information under RA 10173, that
the NPC issued a cease-and-desist against Worldcoin in October 2025, and that the August 2026
draft circular imposes stricter requirements on AI and biometric systems. Face-blocking is not a
premium perk. It is the architecture.

### 2.1 Graduated consent — the actual innovation

Every rival treats face recognition as binary: opted in, or absent. That is the wrong model for a
wedding, where a guest's comfort varies by *audience*, not by feature.

Four distinct exposure surfaces, four independent guest choices:

| Surface | What it means | Typical guest choice |
|---|---|---|
| **Live wall** | Projected to 300 people in the ballroom | Many want off this one specifically |
| **Shared gallery** | Visible to all guests after the event | Usually fine |
| **Couple's private archive** | Only the couple ever sees it | Almost always fine |
| **Social export / reel** | Leaves the platform | Most want a say |

A guest sets these once, from their phone, in about eight seconds. "Keep me out of the projection
but leave me in their album" is a sentence real people say. No product in this market can express
it.

**Why this is defensible:** it is not a toggle, it is a data model. Retrofitting per-surface
consent into a system built on a single face collection is a schema migration, not a sprint.
Ship it in the foundation and rivals need a rebuild to match.

### 2.2 Deletion on withdrawal — non-negotiable

The NPC named the absence of a deletion mechanism as a specific finding against Tools for
Humanity. A toggle that suppresses future matching while leaving the face vector in your
collection fails on exactly that ground.

Requirement: withdrawal triggers actual deletion of the face embedding, with a timestamped record
that it happened. Ask your engineer this week whether the current design does that.

### 2.3 Consent receipt

After a guest sets their preferences, they get a plain-language record: what was collected, why,
for how long, and how to revoke. Sent over Messenger (§4.1), not email.

Two payoffs. It is close to what the NPC says a privacy notice must contain — purpose, scope,
extent, duration. And it is the artefact you hand a corporate client's privacy officer, which is
how you win events no competitor can bid on.

### 2.4 Guest Privacy Dashboard

One link. Every photo you appear in, whoever uploaded it. Remove yourself, or remove the photo
entirely. This is the DPA's access and correction rights expressed as a product feature rather
than a legal page.

### 2.5 What not to do

If House Bill 6313 passes, denying service, penalising, deprioritising or price-discriminating
against people who decline facial recognition becomes unlawful. **Design the opt-out path to be
feature-equivalent from day one.** A guest who declines face recognition must still get a good
experience — manual browsing, chapter filters, upload access. Do not build a degraded path you
will have to fix later.

---

## 3. Pillar Two — Controlled Shots as the economic engine

*Defends: the cost moat. Attacks: Kuha, PhotoShare, EventPix — structurally.*

Volume II's finding: face indexing runs about $0.001 per image, and every local rival markets
unlimited uploads. At a ₱499 album with heavy uploads, AI inference costs more than the album
sells for. Your throttle is what makes affordable AI possible.

### 3.1 Reframe the feature entirely

Stop calling it curation. It is the mechanism. The pitch:

> "Every guest gets AI photo-finding included, not as a $45 add-on. We can do that because we
> control upload volume. Platforms promising unlimited uploads cannot add this without raising
> prices or breaking their promise."

That is numerate, checkable, and unanswerable without a retraction.

### 3.2 Make the shot budget feel generous, not stingy

The risk is obvious: "limits" sounds worse than "unlimited" on a comparison page. Solve it with
framing and mechanics, not by removing the cap.

- **Frame as a gift, not a rationing.** "Every guest gets 15 shots on the couple" reads
  differently from "limited to 15 photos."
- **Refills as the revenue engine.** Mid-event top-ups are already in your plan. Make them the
  couple's decision, announced from the stage or the live wall: *"The couple just gave everyone
  10 more shots."* That is a moment, not a paywall.
- **Earned shots.** Complete a photo challenge, unlock more. Ties throttling to engagement
  instead of opposing it.
- **Role-weighted budgets.** Principal sponsors, the bridal party and immediate family get larger
  budgets than the general guest list. See §4.2 — this only works because you model Filipino
  wedding roles.

### 3.3 On charging guests directly

You could sell guests their own refills. I would not lead with it. A guest being asked for money
at a wedding is a bad feeling, and one screenshot of that flow in a coordinator group chat costs
more than the revenue. Keep top-ups host-funded, and if you test guest-funded refills, do it as a
gift mechanic ("Ninong bought everyone 10 more shots") rather than a checkout.

---

## 4. Pillar Three — build for Filipino weddings specifically

*Defends: a cultural moat. Attacks: every global player, and Kuha's generic event framing.*

Global rivals localise language. None of them model the *structure* of a Filipino wedding. This is
the cheapest defensible ground available to you and almost nobody can be bothered to take it.

### 4.1 Messenger and Viber native — highest ROI item in this document

Messenger has roughly 95% penetration in the Philippines and Viber 71%. About 98.9% of Filipino
internet users use chat apps monthly. Meanwhile every competitor delivers guest photo sets by
**email**. Samaro built WhatsApp-native delivery — the right idea, the wrong app for this market.

Build:
- Guest's personal photo set delivered over Messenger, not email
- Consent receipt and privacy dashboard link over Messenger
- Coordinator alerts over Viber (Viber skews to formal business use here)
- Optionally, a Messenger entry point so a guest can upload without opening a browser at all

**Why this matters more than it looks.** Email delivery is where guest photo apps quietly fail —
the message lands in Promotions and nobody opens it. Your redemption rate on personal photo sets
should be multiples of a rival's. That is a metric you can put in a deck and a coordinator can
feel.

### 4.2 Filipino wedding roles

A Filipino wedding has principal sponsors — often ten to thirty ninongs and ninangs — plus
secondary sponsors, veil, cord and candle pairs. No Western-built app has a concept for any of
this. Kuha references ninongs and ninangs in marketing copy but does not model them.

Build them as first-class roles: role-weighted shot budgets, role-filtered galleries ("all photos
with the principal sponsors"), and a sponsor group shot the system actively prompts for.

### 4.3 Ritual-aware chapters and challenges

Philippine ceremonies have a fixed, known sequence — veil and cord, unity candle, money dance,
release of doves, cake, garter and bouquet. Preload challenges and chapter markers against it, so
a coordinator sets up in two minutes instead of writing challenge prompts from scratch.

Also: the multi-location reality. PhotoShare's own marketing notes a typical Filipino wedding runs
200–500 guests over 6+ hours across church, reception and after-party. Your per-chapter QR model
already fits this. Nobody else's does. Say so explicitly.

### 4.4 Philippine language support

Rivals ship 9 to 17 languages; none of them are Tagalog, Bisaya or Ilocano. Your language support
is undocumented. Ship English plus Tagalog and Bisaya at minimum. Relevant too for the
intermarriage segment — 94% of Filipinos marrying foreigners are women, and those guest lists are
international.

### 4.5 Civil Ceremony Express

**155,604 civil weddings in 2024 — 41.8% of all marriages, the largest single category, and no
competitor addresses it.**

These are short, small, often unphotographed ceremonies. The full product is wrong for them.
Build a stripped variant: 20–30 guests, one chapter, one hour, live wall optional, priced around
₱199–₱299. Low margin per event, enormous volume, and it is the natural on-ramp to your LGU and
city-hall pipeline.

This is your clearest blue ocean. Everything else in this document is a contested market.

---

## 5. Pillar Four — the channel, which is where this is actually decided

*Attacks: Kuha's ₱999/month partner programme.*

Volume II established that Kuha wins coordinators by giving them a business system: white-label
subdomain, client CRM, booking funnel, portfolio hosting, margin on resale. A better album does
not dislodge that.

### 5.1 The asymmetry you are not using

Kuha's partner offer includes a white-labelled page they pitch as replacing a ₱15,000 website.

**Setnayan already runs vendor pro subscriptions and portfolio hosting as standalone business
functions.** You are not offering a coordinator a subdomain on a photo app. You are offering
them presence on a wedding planning platform where couples are already searching for vendors.

That is a fundamentally better product for the coordinator, and Kuha cannot match it without
building a planning marketplace from zero.

The play: **do not sell Papic as a standalone photo tool at all.** Sell it as what a Setnayan
vendor subscription includes. Papic becomes the acquisition wedge for the subscription business,
and the subscription business becomes the distribution engine for Papic. Kuha has one product.
You have a platform. Use the asymmetry.

### 5.2 Turn photographers from rivals into channel

Professional photographers currently see guest-photo apps as either irrelevant or competitive.
Invert it: give the photographer bulk upload, their branding on the gallery, lead capture from
guests who found their photos, and a delivery tool they would otherwise pay Pixieset or FotoOwl
for. They bring you every wedding they shoot.

### 5.3 Match, do not innovate, on partner table stakes

White-label subdomain, client dashboard, partner pricing with resale margin, branded post-event
memory page. Kuha has all of it. These are now the cost of entry to the coordinator conversation.
Do not treat them as differentiators; treat them as the ticket.

---

## 6. Table stakes — where you lose by absence, not win by presence

Ship these because their absence kills deals.

| Feature | Why | Who forces it |
|---|---|---|
| **Pre-display moderation queue** | PhotoShare *cannot* approve before the wall — only remove after. Your best single wedge. Give the coordinator a phone-based approve/reject queue and a kill switch for the wall | PhotoShare's own FAQ |
| **Offline-first capture** | Provincial venue WiFi. If shot budgets enforce server-side, you fail where you most need to win | Scene |
| **Retention parity** | Global norm is 6–12 month upload windows and 12–14 month storage. Your 6-month live tier is *below* it. Lead with the lifetime archive | GuestCam, Wedibox, Guestlense |
| **Full-resolution, no compression** | Kuha attacks rivals on this specifically | Kuha, Pix Wedding |
| **Print-ready collateral** | Guestpix ships 180+ Canva templates; Kuha ships a themed QR library. Coordinators want physical things | Guestpix, Kuha |
| **Guest download access** | Kuha explicitly attacks host-only rivals | Kuha |
| **Photographer bulk upload + merge** | Expected in 2026 | GuestCam, SnapSeek |
| **Seat finder** | Kuha ships it and coordinators like it | Kuha |

---

## 7. Do not build these

- **AI highlight reels as a headline feature.** Already shipped by Cam-Shot, FotoOwl, Capsule and
  Samaro. Build it as a quiet deliverable of the chaptered journey; do not put it on a slide as an
  innovation.
- **A native app.** Your whole category advantage is browser-first. POV requires downloads and is
  criticised for it constantly.
- **Generative AI photo effects.** The industry is converging on disclosure norms around
  AI-generated wedding content, and fabricated imagery sits badly against a consent-first brand.
- **Competing on price with EventPix.** You hold roughly 85% gross margin at ₱699 (Volume II §4.3).
  Price is not your constraint; distribution is. Racing to ₱499 wins nothing.
- **Unlimited uploads.** It would destroy the AI cost structure that is your moat. This is the one
  thing you must never concede, including under coordinator pressure.

---

## 8. Sequencing

Ordered by defensibility per unit of engineering, not by how impressive the demo is.

**Phase 1 — foundations that are expensive to retrofit (build now, in this order)**
1. Per-surface consent data model with deletion on withdrawal (§2.1, §2.2)
2. Controlled Shots with offline-tolerant enforcement (§3, §6)
3. Messenger/Viber delivery (§4.1)
4. Pre-display moderation queue and live-wall kill switch (§6)

Items 1 and 2 are schema-level. Retrofitting either later is a rebuild. Item 3 is the highest
return per engineering hour in this document. Item 4 is the wedge against PhotoShare.

**Phase 2 — the Filipino moat**
5. Wedding role modelling with role-weighted budgets (§4.2)
6. Ritual-aware chapters and preloaded challenges (§4.3)
7. Tagalog and Bisaya UI (§4.4)
8. Consent receipt and guest privacy dashboard (§2.3, §2.4)

**Phase 3 — channel**
9. Partner table stakes: white-label, dashboard, resale margin (§5.3)
10. Papic bundled into the Setnayan vendor subscription (§5.1)
11. Photographer programme (§5.2)

**Phase 4 — the blue ocean**
12. Civil Ceremony Express (§4.5)
13. LGU and city-hall pipeline

**Parallel, non-engineering, starting now**
- Privacy Impact Assessment (effectively mandatory under the August 2026 draft circular)
- NPC registration as a controller processing sensitive personal information
- Counsel review of consent language before any compliance claim goes public

---

## 9. The three sentences

If the whole strategy has to fit on one slide:

1. **Every guest gets AI photo-finding included — because we control upload volume, and platforms
   promising unlimited uploads cannot afford to.**
2. **Every guest chooses where their face appears — the only consent architecture built for
   RA 10173, with real deletion on withdrawal.**
3. **Built for how Filipinos actually marry — sponsors, rituals, three venues, Messenger — and
   for the 155,000 civil ceremonies a year nobody serves.**

---

## 10. Open questions this raises

| # | Question | Why it blocks something |
|---|---|---|
| 1 | Does Controlled Shots enforce server-side? | Determines whether offline capture is possible at all |
| 2 | Does face-blocking delete the embedding? | NPC named this exact gap in the TFH order |
| 3 | Real inference cost on your actual face stack | §3's entire argument is calibrated to $0.001/image |
| 4 | Can Setnayan's vendor subscription absorb Papic as an included feature? | §5.1 depends on it, and it is a pricing decision, not an engineering one |
| 5 | Messenger Platform policy for this use case | Meta's rules on business-initiated messaging may constrain §4.1 — verify before building |
| 6 | Who moderates the wall in practice? | Coordinator, couple, or a paid Papic operator changes the product and the price |

Item 5 deserves a look before you commit engineering to Messenger delivery. The 24-hour messaging
window and template requirements could reshape the design, and I have not verified current policy.

---

## 11. Sources

Competitive and pricing evidence carried forward from Volumes I and II. Additional for this
volume: cam-shot.ai (2026 event photography software review, AI highlights engine), fotoowl.ai
(guest reels), joinmymoment.com blog (Capsule AI curation), eventpixel.app buyer's guide,
snapseek.app (AI face grouping, 12-month hosting), seedance2-video.com (AI wedding video
disclosure norms), Infobip Messaging Trends Report 2026 via Manila Times and Infobip blog
(Messenger 95%, Viber 71% PH penetration), Meltwater Philippine social media statistics 2026,
DataReportal Digital 2026 Philippines, PSA registered-marriage data, NPC advisories and
enforcement actions, House Bill 6313.

Vendor comparison pages remain self-interested; novelty claims in §1 reflect an absence of
evidence in the sources reviewed, which is not proof of absence. Re-verify the biometric opt-out
claim quarterly — it is the one most likely to be copied.
