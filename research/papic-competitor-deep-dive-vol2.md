# Papic — Competitor Deep Dive, Volume II

**Companion to:** `papic-competitor-documentation.md`
**Compiled:** 29 August 2026
**Covers:** verified pricing, channel economics, regulatory exposure, unit-economics modelling,
market sizing, and the three structural findings that change the strategy.

---

## 0. What changed since Volume I

Three findings here are more consequential than anything in the first document.

1. **Your ₱499 figure for Kuha was right and my correction was wrong.** ₱499 is their VIP tier
   SRP. I have their full price card, partner rates, and margin structure below. I flagged it as
   unverified; it was verifiable and it was accurate. Correcting that.

2. **The AI-versus-unlimited-uploads trap.** Every local competitor markets *unlimited uploads*.
   Face recognition costs roughly $0.001 per image indexed. At their price points, unlimited
   uploads makes AI face-tagging mathematically unaffordable for them. Your Controlled Shots
   feature is not a curation feature. It is the **enabling precondition for AI at Philippine
   price points**, and your competitors have marketed themselves into a corner they cannot exit
   without breaking a public promise. This is your actual moat. Section 5.

3. **The Philippine wedding market is contracting, hard.** Registered marriages fell from 449,428
   (2022) to 414,213 (2023) to 371,825 (2024), and Jan–Nov 2025 ran 16.1% below the same period
   in 2024. Three consecutive years of decline. Any deck projecting growth off a growing PH
   wedding market will not survive a diligent investor. Section 6.

---

## 1. Kuha.app — full commercial teardown

Their `/experience/partners` page publishes their entire price card and channel economics.

### 1.1 Verified price card

| Tier | Client SRP | Partner rate | Partner margin |
|---|---|---|---|
| VIP Album | ₱499 | ₱349 | ₱150 |
| Elite Album | ₱999 | ₱699 | ₱300 |
| Luxxe Wedding Suite | ₱1,999 | ₱1,399 | ₱600 |

**Partner subscription: ₱999/month.** Break-even is two Luxxe sales per month, which they
advertise explicitly. Everything past that is partner profit.

### 1.2 What the partner program actually buys

This is a **white-label reseller channel**, not an affiliate scheme, and it is more developed than
your competitive picture assumed:

- Custom subdomain — `yourbusiness.kuha.app` — with the studio's logo, colours and brand ✅
- Guests never see Kuha branding ✅
- Client management dashboard covering every event, album and RSVP ✅
- Integrated booking system turning the partner page into a lead-capture storefront ✅
- Portfolio and live demo hosting, pitched as replacing a ₱15,000 website ✅
- Post-event branded memories page with a permanent slideshow link ✅
- **"Powered by [Your Brand]" on every digital invitation** — they explicitly sell this as
  100 impressions per 100-guest invite list ✅

### 1.3 Why this is the most dangerous thing in the landscape

Kuha is not competing with you for couples. They are competing for **coordinators and studios**,
and they are doing it by making the coordinator's business better rather than by paying a
referral fee. A studio that adopts Kuha gets a website, a booking funnel, a client CRM and a
margin — all switching costs that compound monthly.

Your memory notes a plan to flip planners from Kuha. Understand what you are asking them to
abandon: not a vendor, but their storefront. A better album will not do it. You need to beat the
*business system*, or find a wedge Kuha's system cannot serve.

### 1.4 Additional features found (not in your grid)

- **Seat Finder** — guests locate their table from the same QR ✅
- Branded digital invitation as a standalone viral surface ✅
- Photo Game demo video confirms the scavenger hunt is shipped, not roadmap ✅

### 1.5 Their technical stack, and what it costs them

Asset URLs resolve to `firebasestorage.googleapis.com`, projects `kuha-dev` and `kuha-6a7b6`.
**Kuha runs on Firebase.** Support email is a Gmail address. This is a small, fast team on a
managed stack.

That stack has a specific weakness. Firebase Storage is Google Cloud Storage: roughly $0.026/GB-
month plus **~$0.12/GB egress**. Kuha simultaneously promises high-resolution storage, guest
downloads, *and* a permanent memory link that never expires.

Modelled on a 4.7 GB high-res album:

| Tier | Partner net | Egress (2 full downloads) | Left for storage | Years until it goes negative |
|---|---|---|---|---|
| VIP ₱349 | $6.02 | −$1.12 | $4.89 | **3.3 years** |
| Elite ₱699 | $12.05 | −$1.12 | $10.93 | 7.5 years |
| Luxxe ₱1,399 | $24.12 | −$1.12 | $23.00 | 15.7 years |

**Their entry tier goes cash-flow negative in year four and stays there forever.** "Never
expires" on an egress-billed stack is an unfunded perpetual liability. They may not have modelled
it. You can — and should — price against it.

*Caveat: album size and download frequency are my assumptions, not Kuha's data. The direction
holds across a wide range of inputs; the exact year does not.*

---

## 2. Verified pricing — the whole field

### Philippines

| Vendor | Entry | Mid | Top | Retention | Channel |
|---|---|---|---|---|---|
| Kuha.app | ₱499 | ₱999 | ₱1,999 | "never expires" ⚠️ | ₱999/mo white-label partner ✅ |
| PhotoShare PH | ₱999 flat | — | — | **30 days** ✅ | none found |
| EventPix.ph | ₱699 | ₱1,299 (+video) | — | ❓ | none found |

### Global

| Vendor | Pricing | Retention / upload window | Notable |
|---|---|---|---|
| GuestCam | Standard **$49**, Premium **$97** ✅ | 6mo upload/12mo store; 12mo/14mo ✅ | MagicFind +$45; Colorado Springs; claims 100+ countries ⚠️ |
| Fotify | $29.99 / $49.99; pro $99–$149/mo ⚠️ | 30d upload/90d; 90d/365d ⚠️ | AI moderation from $29.99; Premium video capped 30s or 80MB ⚠️ |
| Guestpix | Classic $49 ⚠️ | 3-month upload window ⚠️ | 180+ Canva templates ✅ |
| Wedibox | $49 ⚠️ | 6mo upload / 1yr storage ⚠️ | — |
| Qrowd Pics | from $39 ⚠️ | matches GuestCam windows ⚠️ | undercutter |
| Gathmo | Free / €29 / €69 / €89 ⚠️ | 30d / 90d / 183d / 365d ⚠️ | **EU data residency + DPA as the pitch** |
| Kululu | Pro $99 ⚠️ | ❓ | AI filtering added Aug 2025 ⚠️ |
| Guestlense | from $49 ⚠️ | up to 12 months ⚠️ | AI moderation on all tiers ⚠️ |
| Knipsmig | Free; $89 lifetime ⚠️ | 1 month free tier ⚠️ | free-tier disruptor |
| Scene | Free (5) → $19.99 (50) → $99.99 ✅ | reveal-based ✅ | offline-first |
| Lense | Free (7) → $4.99–$69.99 ⚠️ | ❓ | video +$9.99 |
| POV Camera | Free (10) → $89.99 (250) ⚠️ | next-day reveal ⚠️ | host pre-approval |
| Pix Wedding | $49–$89 ⚠️ | 12mo Starter ⚠️ | self-published figures |

**Read the retention column again.** The global market has settled on **6–12 month upload windows
and 12–14 month storage**. Your 6-month live tier is *below* the emerging global norm. It beats
PhotoShare's 30 days by a mile, but a couple comparing Papic against GuestCam sees a shorter
window, not a longer one. Position the 6 months as the *interactive* tier and lead with the
lifetime archive, or the comparison reads badly.

### 2.1 Gathmo — the one you should study hardest

Gathmo sells **EU data residency and a Data Processing Agreement** as its primary differentiator,
arguing directly that a cheaper plan without EU hosting is more expensive once compliance is
priced in.

That is your pillar 1, already commercialised, in another jurisdiction, and *working*. Two
implications:

- **Validation.** Privacy-as-differentiator is a proven wedge in event photo sharing, not a
  theory. Someone monetises it today.
- **Warning.** It is not a defensible category on its own. Gathmo competes on *hosting location*.
  Anyone can rent a Manila region. Your version has to be the harder thing — consent architecture
  and biometric opt-out — not just where the bytes sit.

---

## 3. Regulatory analysis — this is bigger than a feature

This is the section that changes your strategy. Your face-blocking feature sits on top of an
active, enforcing, and *tightening* regulatory regime.

### 3.1 The law

Under **RA 10173 (Data Privacy Act of 2012)**, biometric data is classified as **sensitive
personal information**, subject to heightened protection. NPC Advisory Opinion 2023-025 states
plainly that a photo of a person's face is biometric data and personal information, because it
directly identifies an individual. Processing sensitive personal information is **generally
prohibited** unless a Section 13 lawful basis applies — most relevantly explicit, specific,
informed, freely-given consent obtained prior to processing.

The NPC has separately reminded the public that a person's face and likeness are personal
information, and that processing them requires a legitimate purpose and a lawful basis.

### 3.2 Enforcement is real and recent

On **8 October 2025** the NPC issued a **Cease and Desist Order against Tools for Humanity**
(Worldcoin's Orb iris-scanning programme). The findings map almost point-for-point onto how an
event face-recognition product can fail:

| NPC finding against TFH | Direct read-across to event face-tagging |
|---|---|
| Consent obtained via inducement is not freely given | A guest who must submit a selfie to see their photos has not freely consented |
| Privacy notice lacked complete information on purpose, scope, extent, duration | "Take a selfie to find your photos" is not a privacy notice |
| **No mechanism to delete biometric data on withdrawal of consent** | Does your face-vector store support withdrawal-triggered deletion? |
| Scope of collection was disproportionate | Indexing every face in every photo, including non-consenting bystanders |
| Biometric identifiers cannot be reset; compromise is permanent | Raises the breach-severity bar for your whole architecture |

Deputy Privacy Commissioner Jose Amelito Belarmino II framed it: where consent is compromised by
inducement, it stops being a genuine expression of choice.

### 3.3 The regime is tightening right now

- **April 2025:** NPC opened nationwide public consultation on dedicated biometric data
  guidelines — covering storage standards, informed consent, retention and deletion, access and
  correction rights, and enforcement.
- **August 2026 (this month):** NPC opened consultation on a draft circular that *narrows*
  mandatory Privacy Impact Assessments for routine processing while imposing **stricter
  requirements on AI systems, biometric programmes, and cross-border transfers.** The draft cites
  the EU Article 29 DPIA guidelines, signalling alignment with GDPR Article 35.
- **Pending legislation (House Bill 6313)** would make it unlawful for commercial entities to
  track users via facial recognition without express consent — **and** unlawful to deny service,
  penalise, deprioritise or price-discriminate against those who decline.
- Entities processing sensitive personal information are required to **register with the NPC**
  and comply with ongoing reporting and monitoring.

### 3.4 What this means for Papic — obligations, not just advantages

**Obligations you now own:**
1. A **Privacy Impact Assessment is effectively mandatory.** The new draft circular exempts
   routine processing and explicitly does not exempt AI and biometric systems. You are in the
   stricter bucket. Budget for it.
2. **NPC registration** as a personal information controller processing sensitive personal
   information.
3. **Deletion-on-withdrawal must be architectural.** The TFH order names its absence as a finding.
   A face-blocking toggle that stops *future* matching but leaves the face vector in the
   collection would fail on exactly the ground the NPC cited.
4. **The consent notice must be complete** — purpose, scope, extent, duration — at the point the
   guest is asked, not buried in terms.
5. **If HB 6313 passes**, gating any feature behind face-scan consent becomes unlawful. Design
   the opt-out path to be feature-equivalent now rather than retrofitting later.

**Advantages this creates:**
1. **GuestCam's MagicFind architecture is hard to defend in PH.** It processes every face in the
   event by default; the guest-facing consent is a selfie prompt. Whether that constitutes
   specific, informed, freely-given consent for sensitive personal information under Section 13
   is, at minimum, an open question — and one a corporate client's privacy officer will ask.
2. **You can compete where they cannot bid.** Corporate events, government functions, LGU
   partnerships and any client with a compliance function are markets where consent architecture
   is a procurement requirement rather than a nice-to-have. That is also the market your ISO/IEC
   27001 track and city-hall pipeline point at.
3. **The moat is documentation, not code.** Face-blocking is a few weeks of engineering for a
   funded rival. A completed PIA, NPC registration, a documented consent flow and a deletion
   audit trail take months and cannot be copied from your marketing site.

**One caution.** Do not market Papic as "DPA compliant" or imply NPC endorsement. Have counsel
review the consent language. An overclaim here is worse than no claim, because it invites exactly
the scrutiny you would then fail.

---

## 4. Unit economics

**Model assumptions:** 200-guest wedding, 40% participation (80 uploaders), 15-shot Controlled
Shots budget = 1,200 photos. 4 MB raw, 0.8 MB web derivative, 0.5 MB archive. Cloudflare R2 at
$0.015/GB-mo standard, $0.010 infrequent access, **zero egress**. Face indexing at $0.001/image
(AWS Rekognition Group 1 tier 1). FX ₱58/USD — verify.

### 4.1 Cost per event

| Component | Cost |
|---|---|
| Raw storage, 3 months (4.69 GB) | $0.211 |
| Live gallery, 6 months (0.94 GB) | $0.084 |
| Class A + B operations | $0.033 |
| **Face indexing (1,200 images)** | **$1.200** |
| Face search (guests re-searching) | $0.240 |
| **Year-1 COGS** | **$1.77 ≈ ₱103** |
| Perpetual archive, per year thereafter | $0.070 ≈ **₱4/year** |

**Finding: AI is 81% of your COGS. Storage is 19%.** Your storage architecture is not the cost
centre you have been treating it as. The face-recognition pipeline is.

### 4.2 The perpetual archive is affordable — stop worrying about it

At ₱4/year per event, the lifetime compressed archive never threatens margin at any realistic
price point. Modelled at scale on R2 Infrequent Access:

| Volume | Year 1 | Year 3 | Year 5 | Year 10 |
|---|---|---|---|---|
| 50 events/mo | ₱204/mo | ₱612/mo | ₱1,020/mo | ₱2,039/mo |
| 200 events/mo | ₱816/mo | ₱2,447/mo | ₱4,078/mo | ₱8,156/mo |
| 500 events/mo | ₱2,039/mo | ₱6,117/mo | ₱10,195/mo | ₱20,391/mo |

At 500 events/month in year 10 — a substantial business — the entire perpetual archive costs
about ₱20,000/month. It is a rounding error against that revenue. **Promise the lifetime archive
loudly.** It is cheap for you and structurally expensive for anyone on an egress-billed stack.

Two conditions: compress aggressively (the model assumes 0.5 MB, not raw), and use a zero-egress
provider. On S3 or Firebase these numbers do not hold.

### 4.3 Gross margin by price point

| Price | Year-1 gross margin |
|---|---|
| ₱499 | 79.4% |
| ₱699 | ~85% |
| ₱999 | 89.7% |
| ₱1,499 | 93.2% |
| ₱1,999 | 94.9% |

You can compete at EventPix's ₱699 floor and still hold ~85% gross margin. Price is not your
constraint. Distribution is.

---

## 5. The structural moat — AI versus unlimited uploads

This is the finding to build the deck around.

Kuha, PhotoShare and EventPix all market **unlimited uploads**. It is on their homepages; for
PhotoShare it is the headline. Face indexing costs about $0.001 per image. Those two facts are
incompatible.

Cost of adding face-tagging to a 200-guest wedding, as a share of gross revenue:

| Upload policy | Photos | AI cost | @₱499 | @₱699 | @₱999 | @₱1,999 |
|---|---|---|---|---|---|---|
| **Papic — 15 shots capped** | 1,200 | ₱70 | **13.9%** | 10.0% | **7.0%** | 3.5% |
| Papic — 30 shots capped | 2,400 | ₱139 | 27.9% | 19.9% | 13.9% | 7.0% |
| Uncapped — typical | 4,800 | ₱278 | 55.8% | 39.8% | 27.9% | 13.9% |
| Uncapped — heavy | 9,600 | ₱557 | **111.6%** | 79.7% | 55.7% | 27.9% |

**Read the bottom-left cell.** A ₱499 unlimited album with face recognition on a heavy-upload
wedding costs more in AI inference than the album sells for. Kuha's VIP tier would run at a loss
on the AI alone.

### What this means

1. **Controlled Shots is not a curation feature. It is COGS control on the AI pipeline.** You
   have been pitching it as premium curation. It is actually the mechanism that makes affordable
   AI possible at all. That is a far stronger story and it is quantifiable.

2. **Your competitors are trapped by their own marketing.** To add face-tagging affordably, Kuha
   and PhotoShare would have to introduce upload caps — retracting a public promise that is
   currently their main selling point. The switching cost is reputational, not technical.

3. **GuestCam already hit this wall and their pricing shows it.** MagicFind is a **$45 add-on**,
   not an included feature, and it caps at **10,000 images**. That is not a packaging decision.
   That is inference cost showing through the price card. They metered it because they had to.

4. **The two features are one system.** Papic's throttling and AI must be presented together.
   Separately they are two nice features. Together they are a cost structure competitors cannot
   replicate without breaking a promise or raising prices.

**Verify before you pitch this:** get real numbers on your actual inference stack. Self-hosted
embedding models (InsightFace and similar) shift the cost from per-image to fixed GPU capacity,
which changes the shape of this argument considerably — probably in your favour at volume, but
with a fixed cost floor that hurts at low volume. The strategic conclusion holds either way; the
percentages will move.

---

## 6. Market sizing — the uncomfortable part

### 6.1 Registered marriages, Philippines (PSA)

| Year | Marriages | Change |
|---|---|---|
| 2021 | 356,839 | — |
| 2022 | 449,428 | +25.9% (post-pandemic rebound) |
| 2023 | 414,213 | −7.8% |
| 2024 | 371,825 | −10.2% |
| 2025 (Jan–Nov) | 276,561 | **−16.1% YoY** |

Three consecutive years of decline, accelerating. The Commission on Population and Development
attributes it to more cohabitation without marriage, more births outside wedlock, and younger
Filipinos deferring or declining marriage entirely.

**Implication:** your TAM is shrinking roughly 10–16% a year. Any deck projecting growth from
market expansion will not survive scrutiny. Growth has to come from share, from attach rate, or
from adjacent event types — and every local competitor already sells into debuts, corporate
events, christenings and graduations. That is not diversification; that is where the market
already is.

### 6.2 The finding that supports your city-hall thesis

**Civil ceremonies were 41.8% of all 2024 marriages — 155,604 weddings.** They are the single
largest category, ahead of Roman Catholic (31.7%) and other religious rites (24.1%).

This is a strong quantitative argument for the LGU/city-hall pipeline already in your strategy
notes. Civil weddings are the segment least likely to hire a full photography team, which makes
guest-sourced photography *more* valuable there, not less. It is also a segment no competitor in
this landscape addresses — every one of them sells to the reception-with-a-photographer market.

At even a 2% attach rate on 155,604 civil weddings at ₱999, that is roughly ₱3.1M/year from a
channel with no incumbent.

### 6.3 Seasonality

**February is the peak month, not June.** February took 12.4% of 2024 marriages (46,130) and
15.5% of 2025's. June and December follow. November is the trough at 13,463.

Consequences: your marketing calendar should peak in **December–January**, not April–May. Your
infrastructure needs to absorb a February spike roughly 3.4× the November floor. And February
weddings mean a January sales cycle — a month when coordinators are choosing their tooling for
the year, which is also when Kuha's ₱999/month partner subscription gets renewed or dropped.

### 6.4 Intermarriage

94% of Filipinos marrying foreigners are women; about 28.5% of intermarriages are with American
nationals and 11.8% with Chinese nationals. These weddings have international guest lists.
GuestCam ships a 17-language guest portal; Fotify claims 17+; Scene has 9. **Papic's language
support is not documented anywhere in your materials.** For a market where a meaningful slice of
weddings has overseas guests, that is a gap.

---

## 7. Revised strategic conclusions

**1. Lead with the cost-structure moat, not the feature list.**
"We are the only platform that can afford to give every guest AI photo-finding at Philippine
prices, because we are the only one that controls upload volume." That is defensible, numerate,
and your competitors cannot answer it without retracting their unlimited-upload promise.

**2. Privacy is a compliance product, not a luxury feature.**
Reframe from "high-profile guests can opt out" to "the only consent architecture built for RA
10173, with deletion-on-withdrawal and a completed PIA." Sell it to corporate, government and LGU
buyers where it is a procurement requirement. Gathmo proves the wedge works commercially.

**3. Kuha is a channel competitor, not a product competitor.**
Beating their album does nothing. They own coordinators through a white-label storefront,
booking funnel, CRM and ₱999/month subscription. Either build a better partner system or find a
channel they do not serve — and the civil-wedding pipeline is exactly that channel.

**4. Promise the lifetime archive loudly.**
₱4/year per event. Structurally cheap for you on zero-egress storage, structurally expensive for
Kuha on Firebase, and impossible for PhotoShare, whose 30-day window is their most obvious hole.

**5. Fix the retention framing.**
Six months is below the global 12-month norm. Present the live tier as the *interactive* window
and lead with lifetime.

**6. Build the market story on share and civil weddings, not growth.**
The PH wedding market is shrinking 10–16% a year. Say so first, then show the 155,604-wedding
civil segment nobody is serving. Being the person in the room who knows the market is contracting
is a credibility asset, not a liability.

---

## 8. Open items

| # | Item | Why it matters | Owner |
|---|---|---|---|
| 1 | Real inference cost on your actual face stack | §5's percentages depend on it; self-hosting changes the shape | Eng |
| 2 | Does face-blocking delete the vector, or just suppress matching? | The TFH order names deletion-on-withdrawal as a finding | Eng + Legal |
| 3 | Commission a Privacy Impact Assessment | Effectively mandatory under the Aug 2026 draft circular | Legal |
| 4 | NPC registration as PIC processing sensitive personal information | Statutory | Legal |
| 5 | Track HB 6313 | If passed, gating features behind face-scan consent becomes unlawful | Legal |
| 6 | Papic language support | Intermarriage share; rivals ship 9–17 languages | Product |
| 7 | Offline capture decision | Scene built it; provincial venue WiFi | Eng |
| 8 | Verify Kuha tiers by signup | Read off their partner page, not their checkout | You |
| 9 | Current PHP/USD | All models here use ₱58 | You |
| 10 | Test PhotoShare's moderation gap live | The "cannot approve before display" claim is your best wedge — confirm it | You |
| 11 | Watch Gathmo | Closest strategic analogue in another jurisdiction | You |
| 12 | Re-check quarterly whether any rival ships biometric opt-out | Pillar 1 depends on absence | You |

---

## 9. Sources

**Vendor:** kuha.app (pricing, features, faqs, experience, partners), photoshare.ph, eventpix.ph,
guestcam.co (magicfind, pricing, blog, versus), fotify.app blog, guestpix.com, gathmo.com blog,
qrowdpics.com blog, knipsmig.com, scenedisposable.com, pix.wedding, kululu.com, guestlense.com,
weduploader.com.

**Regulatory:** NPC Advisory Opinion 2023-025; NPC public advisories on face/likeness; NPC Cease
and Desist Order re Tools for Humanity (23 Sept / 8 Oct 2025) via HLC and Fox Rothschild
analyses; NPC biometric guidelines consultation (Apr 2025) via IDTechWire; NPC draft PIA circular
(Aug 2026) via TechTimes; House Bill 6313, House of Representatives.

**Market:** Philippine Statistics Authority registered-marriage releases 2022–2025; PSA
provisional vital statistics Jan–Nov 2025; Inquirer, PhilSTAR Life, Asia News Network coverage of
PSA/CPD data.

**Infrastructure:** Cloudflare R2 pricing documentation and calculator; AWS Rekognition pricing
page and Group 1 API tier announcement.

**Bias warning.** Competitor comparison pages (fotify.app, pix.wedding, scenedisposable.com,
guestcam.co/versus, gathmo.com, knipsmig.com, qrowdpics.com) are vendor-authored and each ranks
its own product first. Marked ⚠️ throughout. Verify on the subject's own site before external use.

**Modelling warning.** Sections 4 and 5 rest on stated assumptions about participation rate,
photo count, file size and inference pricing. The directional conclusions are robust across a
wide range of inputs; the specific figures are not forecasts.
