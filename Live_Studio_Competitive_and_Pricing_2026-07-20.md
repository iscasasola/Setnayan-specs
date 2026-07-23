# Live Studio — Competitive Teardown & Pricing Decision (2026-07-20)

> **Status: research + recommendation. Two items APPLIED to the corpus, three HELD for owner sign-off (§ 6).**
> Newer sibling to [`Live_Studio_Repackaging_2026-07-08.md`](Live_Studio_Repackaging_2026-07-08.md), which remains the canonical packaging doc. This doc adds the market evidence under it and revises one price.
> Method: 5 parallel research agents, ~46 products checked against primary sources (pricing pages, developer docs, Meta/Google policy pages). Figures below are **[VERIFIED]** from a primary page unless marked **[UNVERIFIED]**.

## 1. The finding in one line

**No product on the market does what Live Studio does.** The capability set — install-free link-join phone cameras + LAN/offline operation + a browser control room + output to the couple's own event page, priced per event — exists nowhere as a single product. The market splits it three ways and each holder is missing the other two thirds.

## 2. Closest analogues

| Product | Matches | Missing | Price [VERIFIED] |
|---|---|---|---|
| **Switcher Studio** | The control room. 9 iOS devices as wireless cameras. **LAN-offline multicam recording confirmed in their own docs** — cameras sync over a router/hotspot with no internet; internet needed only to stream. The incumbent everyone benchmarks. | **App install on every camera phone.** Subscription-only, iOS/macOS. No venue wall, no event context. | $65/mo · $540/yr (=$45/mo) · Suite $99/mo · $948/yr |
| **Canon Live Switcher Mobile** (launched 20 Jan 2025) | Closest *commercial* analogue to our Mobile tier — 3 devices, same WiFi, true LAN multicam, auto-switch 8/12/16/20s. | App install per device. 3-camera ceiling. No wall, no event page. | Free (720p + watermark) · **$17.99/mo** |
| **VDO.Ninja** | Closest *functional* analogue — join by link or QR, no app, director control room with real scene switching, self-hostable for LAN/offline. | **No built-in RTMP** — OBS must be hung off it (the same seam we have). Unpolished, no event context, no wall. | **$0**, open-source |
| **mimoLive** (Boinx) | The only commercial product with install-free browser camera join (**mimoCall**, WebRTC). | **Safari unsupported** → dead on iPhone unless the guest installs Chrome. mimoCall is internet-dependent. macOS-only. | €79/mo · €790/yr (Studio) — prices only in the store page's analytics payload, not rendered as text |
| **EventLive** | Wedding framing, embed on the couple's site, long VOD retention. **Already geo-priced in PHP.** | **Single camera.** Their own help doc tells you to buy Switcher Studio and feed them RTMP. | **₱2,990 one-time** (list ₱4,299) |
| **Lovecast** | 3 camera angles + auto-generated wedding site with player. | Host app install, no switching control room, no wall, ~1 week retention. | Free / **$150** / **$250** one-time |
| **LoveStream** | Phones-you-already-own as 3–5 cameras. | It's a **staffed service** — a human producer switches for you. | $450–$1,850/event |

**Dead / do not carry in any competitive set:** Cinamaker (domain doesn't resolve, both App Store listings 404, Crunchbase "permanently closed", last release Feb 2024) · WedSocial (pulled ~2018) · Veri/The Guest (service off 31 Dec 2023). "Slidesk" is a name collision with an open-source Markdown presentation engine — the real product is Slidesome.

## 3. Two structural white spaces

1. **Install-free link-join + real multicam.** VDO.Ninja does it free but raw; mimoLive tried and shipped it broken on iOS Safari; **no commercial product does it working.** Everything else mandates an app per camera phone.
2. **One-time per-event pricing for multicam.** EventLive proved couples pay one-time per event — but it's single-camera. Everything multicam is a monthly subscription built for people who stream weekly. A couple wanting 3 cameras for one day today buys a month of Switcher and cancels.

A third, adjacent: **live video and the venue photo wall are never the same product.** Across ~35 photo-wall products (Kululu, Guestpix, Fotify, Lense, LiveWall, Snapbar, Walls.io, Slidesome, Kuha, PhotoShare, EventPix…), **zero** bundle a live video switcher, and zero livestream products ship a venue wall. Where photo-wall marketing says "live stream" it means *photos appearing in real time* — never a camera feed. The categories don't share vocabulary.

## 4. The PH market

**No PH software competitor does video livestreaming.** Kuha (₱499/₱999/₱1,999 one-time albums), PhotoShare PH (₱999/event), EventPix (₱699 photo / ₱1,299 photo+video) all stop at the live photo wall.

The incumbent is a **human**:

| Line item | PH price [VERIFIED] | Source |
|---|---|---|
| 1 live-feed videographer | **₱15,000** (snippets also ₱15,000–20,000) | Prodigital Media rate card |
| Additional live-feed videographer | +₱15,000 | Prodigital Media |
| Venue-bundled livestream package | ₱9,000–₱13,000 | Jardin de Miramar |
| "Video switcher + camera setup" module inside full production | ₱5,000–₱15,000 | eventnest.ph |
| Extra camera operator | ₱3,000–₱5,000 | eventnest.ph |
| LED wall (4×6 P5 → 9×12 P3) | ₱13,000–₱27,000 | Prodigital Media |

**What couples actually default to: free Facebook Live**, driven by OFW/overseas family. PH wedding media names no streaming platform at all. [UNVERIFIED] No adoption data exists — nobody publishes what share of PH weddings livestream; Reddit/FB-group sentiment was not obtainable.

**Legal note [VERIFIED]:** a PH marriage is only valid with couple, witnesses and officiant *physically* present (PSA). Livestream is structurally spectator-only — which is exactly why it stays a ₱15k add-on and never becomes a ₱100k product.

## 5. Pricing decision

### 5.1 The problem: two anchors an order of magnitude apart

- **₱0** — free Facebook Live off a cousin's phone. The real incumbent.
- **₱15,000–₱20,000** — a live-feed videographer.
- **₱2,990** — EventLive, the *only* software price point in between, already quoted in pesos to Filipino buyers, **for a single camera**. This is the most useful number in the sweep: it proves PH couples pay ~₱3,000 one-time for a wedding stream, and it caps what we can charge without a track record.

### 5.2 Recommended ladder

| Tier | Live now (DB) | Decided | Rationale |
|---|---|---|---|
| Free (1 cam) | ₱0 | **₱0 — keep** | The paywall is *multicam*, not streaming. Fighting ₱0 with ₱0 is correct; marginal cost is zero anyway. |
| Mobile Controller (3 cam) | ₱1,299/day | **₱1,500/day** | Owner's 2026-07-17 per-service sheet (DECISION_LOG 2026-07-17). |
| Desktop Controller (8 cam, offline) | ₱2,499/day | **₱2,500/day** | Same sheet. Sits ~16% under EventLive while offering 8 cameras + offline vs their 1 — correct pre-revenue posture: be *under* the established player, not over. |
| Camera Bridge (DSLR) | **₱500** flat, event-wide | **₱500 — keep** | Corrected: ₱500 is the owner's 2026-07-11 round-up and what prod carries; the ₱499 in older docs is stale. Best value ratio in the catalog — ₱500 against a ₱3,000–₱5,000 extra-operator line. Do not touch. |
| Annual Streaming | ₱19,999/yr | **keep — see § 5.3** | |

**On the round numbers.** These depart from the 2026-05-12 charm-pricing (-1 endings) convention deliberately. The 07-17 sheet is systematically round across the catalog — Pakanta ₱2,500, 3D Plan Unlock ₱3,000, Website Upgrade ₱3,500, and **Monogram Pro ₱999 → ₱1,000**, an explicit move *off* a charm price. That is a re-basing, not a slip, and **the charm convention no longer governs Live Studio.**

> **Correction (2026-07-20).** An earlier pass of this doc recommended **₱1,499** for Mobile and described the ₱1,500/₱2,500 figures as "a 2026-07-18 note" to be **rejected** for breaking the charm lock. Both claims were wrong: the figures are the **owner's own 2026-07-17 per-service sheet**, and the charm convention they "broke" is 2026-05-12 — older, and superseded by that sheet. The ₱1,499 recommendation is withdrawn.

### 5.2b Flat ₱1,500 for both tiers — considered, not recommended

**It deletes Mobile.** At price parity every couple with a laptop takes Desktop (8 cameras + offline for the same money), so Mobile is bought only by people who physically cannot run Desktop — and they would have paid ₱1,500 regardless. The net effect is not "simpler pricing" but **a ₱1,000 price cut on Desktop plus a dead SKU.**

It also prices the moat at zero. Offline operation is the single capability no competitor has (§ 2–3): Switcher has LAN-offline but mandates an app per phone; mimoLive is browser-join but dies on iOS Safari; VDO.Ninja has both but is free, raw and needs OBS. Charging the same for offline as for online-only gives that away.

**The honest counter-argument**, which is real: Mobile-vs-Desktop is not a good/better/best choice the buyer makes — it is *which device they already own*. Charging differently for that is arguably odd. But the device determines capability (3 vs 8 cameras, online-only vs offline), so it functions as a capability ladder regardless of the label. **Owner decision open — see § 7 item 6.**

### 5.3 The important decision is the pro tier, not the couple price

A videographer charges ₱15,000–₱20,000 per wedding livestream. At **₱19,999/yr** for unlimited Desktop days they break even on **1.3 events** and keep the margin on every one after. That is not a price — it is a channel hook, and it is deliberately underpriced against what a pro extracts from it.

That is correct, because **the platforms are all fighting over the videographer as distribution, not over the couple**:

- **Kuha** — ₱999/mo white-label partner program, wholesale ₱349/₱699/₱1,399 against ₱499/₱999/₱1,999 SRP, custom subdomain, booking system, "Powered by [Your Brand]" on every digital invitation, pitched as *"breakeven at 2 albums/month."*
- **Lovecast Pro** — $49/$79/mo, white-label at $79.
- **EventLive Business** — ₱1,497–₱2,690/event or ₱9,249/mo unlimited.

**Recommendation:** hold ₱19,999/yr and add a **~₱1,999/mo** option to match Kuha's entry shape — ₱19,999 upfront is a harder ask than ₱999/mo even when it is better value. [HELD for sign-off — § 6.]

### 5.4 What is not the constraint

Prod is at **63 events and 5 Papic orders ever** [MEASURED 2026-07-20]. On a day that cannot be re-run, a couple will not hand the ceremony to unproven software at *any* price, and a low price reads riskier rather than safer. The existing gate — do not flip these SKUs buyable until a real non-wedding event test passes — matters more than ±₱500.

Two things that would move more units than any price change: a **money-back-if-it-fails guarantee** on the paid tiers, and a visible *"tested at N events"* number.

## 6. Delivery: YouTube vs Facebook

PH couples default to Facebook, so this was checked against primary Meta/Google sources.

**Facebook via the existing OBS path is free to support today.** RTMPS is RTMPS — the couple pastes a Facebook stream key instead of a YouTube one into the same OBS setup, capturing the same Program pop-out. No new engineering, no API, no review. Gates [VERIFIED, effective 10 Jun 2024]: account ≥60 days old; a Page or professional-mode profile needs ≥100 followers.

**Facebook in-app (no OBS) is materially harder than YouTube, not easier:**

| | YouTube | Facebook |
|---|---|---|
| Gate | Sensitive-scope verification, **~10 days**, no fee. YouTube scopes are **not** on Google's restricted list → **no CASA security assessment** | App Review for the Live Video API feature **+ Business Verification** (required for Advanced Access) |
| Permissions | OAuth; `youtube.force-ssl` etc. | `publish_video` (profile) · `pages_manage_posts` + `pages_read_engagement` (Page) |
| Extra | Quota audit required past 10,000 units/day | 60-day account age · 100-follower Page gate |
| Private streams | **Unlisted = link-only** — fits a guest list cleanly | Allowlist is the broadcaster's **Facebook friends** only; Page broadcasts are effectively public |
| **Replay retention** | **Indefinite** — archived streams behave like normal uploads | **30 days, then auto-deleted** |

**The decisive finding [VERIFIED]:** Meta's live-video storage policy changed effective **19 February 2025** — new broadcasts are replayable for 30 days then automatically removed, and the entire back-catalogue older than 30 days was deleted (90-day download window; one-time 6-month deferral available). Source: [about.fb.com](https://about.fb.com/news/2025/02/updating-our-facebook-live-video-storage-policy/).

For a wedding that is disqualifying as a *primary* destination — the ceremony replay self-destructs a month after the day. It also cuts directly against the retention-and-permanence line the 2026-07-20 Papic ruling committed to.

**Decision applied:** Facebook Live ships as a **documented OBS destination with an explicit 30-day-deletion warning**, not as an in-app integration. YouTube stays the recommended and only in-app path. The old lock "YouTube as sole delivery" is softened to **"YouTube as sole *in-app* delivery; Facebook supported via OBS."**

[UNVERIFIED] Whether plain unencrypted `rtmp://` still works for Facebook — no current Meta primary page states it is rejected. Assume **RTMPS required**; the Live Video API docs state it outright.

## 7. Open items — owner sign-off

| # | Item | Status |
|---|---|---|
| 1 | **Mobile ₱1,299 → ₱1,500 · Desktop ₱2,499 → ₱2,500** (owner's 07-17 sheet) — corpus updated; **live DB `platform_retail_catalog_v2` NOT changed** and no repo PR opened. Needs owner go before the public price moves. | ⏳ HELD |
| 6 | **Flat ₱1,500 for BOTH tiers?** Owner question 2026-07-20. Recommendation: **no** — it deletes Mobile and prices the offline moat at zero (§ 5.2b). | ⏳ HELD |
| 8 | ✅ **Camera Bridge — RESOLVED, prod was right.** ₱500 is not drift: `Pricing.md` records an owner **round-up 2026-07-11 (₱499 → ₱500)**, consistent with the same re-basing that produced ₱1,500/₱2,500. The "₱499" in this doc § 5.2 and in `Live_Studio_Repackaging_2026-07-08.md` § 1 was the **stale** value — corrected. `billing_period = one_time` is likewise **correct, not a bug**: the SKU is a *flat event-wide* DSLR unlock, so one charge per event is the intended unit; the "/day" in the display title is the misleading part and is the only thing worth cleaning. **Canonical: ₱500 flat, event-wide.** | ✅ DONE |
| 9 | **No council has ever ruled on Live Studio pricing** — verified against all 25 `*_Council_Verdict_*.md` docs in the corpus. Every price in this doc traces to the owner's 07-17 sheet or to market evidence, not to a council. If a council pass is wanted, it has not happened yet. | ℹ️ NOTED |
| 2 | **~₱1,999/mo option** alongside Annual Streaming ₱19,999/yr, to match Kuha's entry shape. | ⏳ HELD |
| 3 | **Papic-ruling carve-out.** The 2026-07-20 ruling said stop selling event-day features — charge only for SCALE · RETENTION+IDENTITY · COMPUTE. Live Studio is a pure event-day feature. It arguably survives on different grounds (it displaces a ₱15k human, which the free Papic features never did), but that needs an explicit carve-out rather than a silent exception. | ⏳ HELD |
| 4 | **`09_Panood_Feature_Specification.md` is doubly stale** — its "YouTube as sole delivery" section still describes server-side compositing on *Setnayan's master channel*, an architecture deferred out of V1 by the 2026-07-08 repackaging (it is now the couple's own OBS → the couple's own channel). A dated correction banner was added; the body was not rewritten. | ⏳ NOTED |
| 5 | **Money-back guarantee + "tested at N events" badge** on paid tiers — proposed in § 5.4, not specced. | ⏳ HELD |

## 8. Sources

Switcher Studio [pricing](https://www.switcherstudio.com/pricing) · [recording-only/LAN](https://support.switcherstudio.com/article/331-recording-only) · [Canon Live Switcher Mobile](https://www.usa.canon.com/mobile-apps/live-switcher-mobile) · [mimoCall docs](https://mimolive.com/user-manual/sources-input/remote-sources/mimocall/) · [EventLive pricing](https://www.eventlive.pro/pricing) · [Lovecast pricing](https://www.lovecastapp.com/pricing) · [LoveStream packages](https://www.lovestream.io/package-pricing) · [Kuha partners](https://www.kuha.app/experience/partners) · [PhotoShare PH](https://photoshare.ph/) · [Prodigital Media rates](https://prodigitalmediaph.com/packages-rates/) · [eventnest.ph LED walls](https://eventnest.ph/blog/how-filipino-couples-are-using-led-walls-and-video-screens-at-modern-wedding-receptions/) · [PSA — virtual weddings](https://psahelpline.ph/blogs/is-a-virtual-wedding-considered-valid-in-the-philippines) · [Meta live storage policy](https://about.fb.com/news/2025/02/updating-our-facebook-live-video-storage-policy/) · [Meta Live Video API](https://developers.facebook.com/docs/live-video-api/) · [Meta access levels](https://developers.facebook.com/docs/graph-api/overview/access-levels/) · [Google sensitive-scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification) · [Google restricted-scope list](https://support.google.com/cloud/answer/13464325) · [YouTube archive live streams](https://support.google.com/youtube/answer/6247592)
