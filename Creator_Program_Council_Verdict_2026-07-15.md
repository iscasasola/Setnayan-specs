# Creator & Influencer Program — Council Verdict (2026-07-15)

> **The question.** How do we serve content creators + nano/micro influencers so they maximize Setnayan? The owner's expanded ask: *"do they also have a YouTube-like page where they can create videos on the app? … provide these opportunities to entice more people to enter and join. They need to achieve a certain follow to claim them as an influencer?"* — plus the original: connect their **YouTube + Facebook Page** accounts.
>
> A 5-member council deliberated (Growth · Architecture · Media-Infra/Cost · Monetization · a deliberate Skeptic), grounded in the live corpus. **The result is near-unanimous** — even the Growth Strategist and the Skeptic, briefed to argue opposite corners, converged on the same shape. **Three items need owner sign-off before build — see § 10.**
>
> **⛔ SCOPE — this is a NEW capability layer built ENTIRELY from existing primitives, not a second app.** Every recommendation below reuses the `/u/[slug]` public page, the template render pipeline, the `oauth_grants` social plumbing, Alaala, and the Editorial "Real Stories" surface. Nothing here forks the codebase or stands up a video host. The one idea the council *rejects* is the literal reading of "a YouTube-like page where creators host their own video."

---

## 1. The panel

| Voice | Owns | Landed on |
|---|---|---|
| **The Growth Strategist** | PH acquisition | Kill the host; the wedge is a **booking-in + publish-out rail** for event content-creators (a hot PH vendor category). Distribution is the magnet, hosting is not. |
| **The Architect** | Structure / scope | Creator "channel" = a **public VIEW over `/u/[slug]`** composed of event-anchored Alaala renders + external embeds. Influencer status = a **derived, Meta-verified attribute**, not a native social graph. |
| **The Infra/Cost Engineer** | Feasibility / ₱ | A UGC host **inverts** Setnayan's best property (bounded, audience-independent cost). **Host pixels, not bytes** — embed YouTube/FB, don't re-encode/re-serve. |
| **The Monetization Lead** | Money / positioning | Creators are a **CAC-negative distribution loop, not a paying segment**. Free Creator Kit; verified influencers earn **comped ~99%-margin SKUs in exchange for a "Made on Setnayan" watermark**. |
| **The Skeptic** | The anti-case | An open video host is the *"wrong app, wrong moment"* burial mistake in a new costume — reopens 3 locks at max legal exposure, pre-launch, on a solo operator. **Recognize creators; don't become their host.** |

**The striking result:** five voices, briefed independently, converged on ~90% of the answer — *no in-app video host · creator = distribution loop · channel is a view + embeds · gate the badge not the door · free kit + comped perks · publish is review-gated so lead with the review-free path.* The convergence is the verdict.

---

## 2. Headline verdict — the reconciled spine

**Do not build an in-app YouTube. Build "Creator Home" — a creator PRESENCE + DISTRIBUTION layer over surfaces you already own.** It has three parts, all made of existing primitives:

| Part | The ONE job | Made from |
|---|---|---|
| **The Creator Page** | A public, shareable presence at their `/u/[slug]` — event portfolio + verified stats + a wall that *embeds* their existing YouTube/FB/TikTok videos. Host nothing; point at everything. | `/u/[slug]` scheme (`Public_URL_Architecture_2026-07-08.md`) · `vendor_ig_connections` read-sync · a thin `creator_profiles` row |
| **The Publish-Out Loop** | Every Setnayan-rendered, **template-driven** event reel/gallery goes *out* to the channels they already own, watermarked "Made on Setnayan." Their audience is the acquisition channel. | Template render pipeline (Patiktok `0017`, Guest Stories, Save-the-Date reveal) · share-sheet/deep-link · `oauth_grants` |
| **The Status System** | **Hosting a real Setnayan event** is the primary earned status (→ featured on Editorial "Real Stories"). **OAuth-verified follower count** is a secondary perk multiplier (badge tier + comped SKUs). Open door, gated badge. | Editorial 0038 · Meta/YouTube OAuth · `platform_settings` threshold |

**Why creators at all:** their event → branded reel → posted to *their* audience is pure top-of-funnel that recruits both couples (demand) and vendors (revenue) at ₱0 marginal cost. Creators are a **growth loop**, not a segment. Every feature is designed around *content leaving the app branded and attributed* — that is the entire point.

---

## 3. Fork #1 — in-app video HOST vs presence layer → **kill the host**

**Decision: reject the literal "YouTube-like page where creators host their own video." Build the presence layer instead.** This was the council's clearest call — reached by the Skeptic and the Growth Strategist *independently*.

The host loses on four axes at once:
- **Cost inversion.** Today every cost is bounded per-event and *audience-independent* — "100 viewers or 1,000,000, Setnayan's bill is the same" (`CLAUDE.md`), because the couple's own OBS pushes livestream to YouTube and R2's free egress serves a *fixed* per-event payload. An open host makes cost scale with **strangers × minutes uploaded × minutes watched** — three uncapped multipliers with no event to bound them. R2 free egress does *not* transcode, package ABR, or moderate; Stream-grade playback re-buys, at Cloudflare's meter, the exact delivery bill YouTube pays for free.
- **Reopens three locks.** *No manual video editor in V1* · *owned-AI-music only* (server-rendering third-party audio "makes Setnayan the direct infringer," `CLAUDE.md` gotcha #1) · *narrow, per-event NSFW scope*. An upload box un-retires all three simultaneously.
- **Moderation breaks a solo operator.** Current un-automated admin load is already ~650 min/day against a <180 target (`project_setnayan_solo_admin_plan`). Adversarial open-internet moderation (CSAM, DMCA, RA 10173 on stranger data, minors) is a categorically harder problem, added *before* the public launch, by one person.
- **Unwinnable, cold-start category.** A video host needs viewers; creators' audiences already live on FB/TikTok/YouTube; nobody opens a Filipino *wedding* app to watch videos. You'd maintain and moderate an empty tab.

**What survives:** the presence layer (§ 2) captures the owner's real goal — harness creator reach — without any of this. Host **pixels, not bytes**: embed their videos, render short branded clips, publish outward.

---

## 4. "Can they create videos on the app?" → **yes, via templates; no, not an editor**

The owner's literal ask has a clean, already-shipped answer that respects the lock:

- ✅ **Allowed & already exists:** template-driven creation — pick a template → pick clips/photos from the event's Alaala gallery → server renders a 9:16 reel. This is exactly what Patiktok (`0017`), Guest Stories, and the Save-the-Date reveal already do.
- 🚫 **Not allowed (locked):** a freeform timeline/trim/multi-track/overlay **video editor**. *"No manual video editor in V1. All renders template-driven"* (`CLAUDE.md`). Creating videos ≠ editing videos.

So the honest line: **creators make videos on Setnayan the way everyone does — from templates over their event media — not in a general editor.** That gives the owner the "create on the app" experience without touching the lock.

---

## 5. The follower-gate → **open the door, gate the badge, verify by OAuth**

**Decision: do NOT gate entry on followers. Gate the badge + perks; make hosting-an-event the primary status.** This reconciles the Skeptic (follower counts are bought, gatekeeping repels your best micro-creators) with the rest (a verified tier is worth having).

- **Anyone can join and get a Creator Page.** A follower entry-wall on a pre-launch product is a chicken-and-egg trap and reads as elitism.
- **Two status ladders, hosting-first:**
  1. **Earned by activity (primary):** *Featured Creator* — hosted a real Setnayan event → eligible for the Editorial "Real Stories" surface (0038). This is verifiable, un-gameable, and on-brand.
  2. **Earned by verified reach (secondary perk multiplier):** **Nano 1K–10K · Micro 10K–100K · Macro 100K+**, computed from **OAuth-fetched** counts (`followers_count` via IG Graph / Page `fan_count` via FB) — never self-reported. The count is the token's, not the user's, so it can't be typed in. *Caveat:* Meta only exposes counts for a **Business/Creator IG linked to a Page** — personal accounts can't connect, so the tier serves a subset.
- **What crossing a tier unlocks (perks, not a paywall):** a Verified badge · creator-search priority · a block of **comped ~99%-margin SKUs** (Animated Monogram, Cinematic Reveal, Save-the-Date, a Papic seat block) — the "cost" is near-zero and books as marketing spend — in exchange for the **"Made on Setnayan" watermark + connected-account attribution**. That trade *is* the CAC-negative loop, made contractual.
- **Red line (Architecture):** follower count is a vanity metric the vendor-tiering doc explicitly bans from ranking (`Vendor_My_Performance_Tiering_2026-07-01`). Keep it scoped to creator status; **never leak it into vendor search.**

---

## 6. Connect-accounts → **sequenced by review-gate, review-free first**

The original question ("which capability leads?") is resolved by splitting on the **Meta/Google app-review gate** — the same gate already holding Panood, Patiktok's booth, and Photo-Delivery (`Feature_Flow_Registry.md`). Reconciles Growth ("publish is the viral loop, ship it first") with Infra ("publish is review-gated"): the *loop* ships first via the **review-free manual path**; API auto-publish is the deferred tail.

| # | Capability | Review gate | Ship |
|---|---|---|---|
| **1** | **Connect account (READ) + verify follower count + embed their videos** on the Creator Page | **None** (read/embed) | **Phase 1** — cheap, powers profile + badge |
| **1** | **Assisted publish** — render a template reel → *"Share to my YouTube/FB"* hands the creator the finished file + a pre-filled, watermarked caption; **they** post it | **None** (creator posts) | **Phase 1** — the growth loop, review-free |
| **2** | **FB Live + YouTube multistream** for Live Studio (one broadcast → both, via RTMP stream key) | **None** (RTMP, not the publish API) | **Phase 2** — event-day power feature; PH is FB-first, so this matters |
| **3** | **API auto-publish/upload** (Meta Content Publishing / YouTube upload) | **Gated** (Meta app review + Business verification; YouTube upload audit) | **Phase 3** — rides the review queue already in flight |

**Existing plumbing to reuse (do not rebuild):** `oauth_grants` (encrypted tokens) · Patiktok's per-creator publish OAuth (`0017`) · `vendor_ig_connections` read-sync (`Instagram_Auto_Sync_Wave2_Brief_2026-07-05`) · the `page_connections(owner_type, owner_id, …)` shape from `Auto_Post_To_User_Pages_Wave3_Brief_2026-07-05` — generalize `owner_type='user'`.

---

## 7. Monetization & the flywheel → **free kit, comped perks, defer the marketplace**

**Decision: do not invent a "creator subscription." Creators sit on the free/acquisition side by definition.**

- **Free:** the Creator Kit (creator page, Papic gallery, reveal, shareable watermarked reels). It markets Setnayan — charging for it is backwards.
- **Paid only when wearing another hat:** a creator who is *also* a vendor pays the normal Solo/Pro/Enterprise tier (`Pricing.md § 00`); one who wants deep planning buys Setnayan AI. No new SKU.
- **Perks are the currency:** comped high-margin SKUs + visibility, funded from the marketing/recognition budget, traded for branded reach.
- **New supply side (brands ↔ creators) → DEFER to V2.** Taking a cut of brand↔creator deals is the "monetize the transaction" trap that 0% commission rejects, and Setnayan holds no money (`project_setnayan_vendor_monetization`). If it ever ships, a creator is just a **vendor vertical** riding the existing **lead-token doorway** (pay for access, 0% commission) — never an ad-rake, never a public ad marketplace (out of V1 scope). A lighter, in-scope alternative for V1: give creators a **referral link + perk/rev-share** on the couples/vendors they bring, measured on things Setnayan can verify (events hosted, referrals landed), reusing the 0038 affiliate rail.
- **Positioning line (keeps it on-brand):** *"Your life's biggest moments, made to share."* The event **is** the content; the creator page is its shareable echo — not "TikTok for events." This protects the wedding-first wedge (`project_setnayan_event_type_strategy`).

---

## 8. Red lines the whole council drew

1. **No open-upload video host** — the line nobody crosses. Creator content stays event- or portfolio-anchored; no arbitrary video from people not hosting an event here.
2. **RA 10173 consent on public galleries.** Papic galleries are *guests'* faces. "Public on a creator's channel" massively amplifies exposure → require **explicit per-gallery public consent**, honor opt-out/face-blur/7-day review, and **never auto-public a minor's face** (guardian consent). This is the exact cross-audience gap in `project_setnayan_privacy_reconciliation`.
3. **Owned-AI-music only in server renders.** Creators cannot bring major-label audio into the server pipeline (direct-infringer risk). BYO audio is **client-side only** (the Guest Stories carve-out).
4. **Publishing is per-post consent, never standing auto-post.** A human-confirm gate before anything hits a creator's audience; NSFW filter always on; #ad / ASC-PH disclosure carried.

---

## 9. Build plan (phased, all reuse)

**Phase 0 — schema & profile (small).**
- `creator_profiles(user_id, handle, follower_count_ig, follower_count_fb, follower_count_tiktok, creator_tier, featured_at, threshold_met_at)`; threshold values in `platform_settings` (owner-editable).
- Generalize `page_connections` / reuse `oauth_grants` for `owner_type='user'`.

**Phase 1 — the loop (review-free, highest leverage).**
- Creator Page = a public mode of `/u/[slug]`: event portfolio (public Alaala recaps + template reels) + an **embed wall** of their connected YouTube/FB/TikTok videos.
- **Connect + verify:** OAuth connect → fetch follower counts on connect + the existing 60-day refresh → compute `creator_tier`.
- **Assisted publish:** on any rendered template reel, a *"Share to my channel"* action → finished MP4 + pre-filled watermarked caption via share-sheet/deep-link.
- **Watermark + attribution** baked into every published render.

**Phase 2 — Live Studio multistream.**
- Add **Facebook Live** as a second RTMP target alongside YouTube (review-free stream-key path). PH is FB-first; this is the event-day reach feature.

**Phase 3 — API auto-publish (deferred, review-gated).**
- Meta Content Publishing + YouTube upload behind the app-review/business-verification queue already in flight. Only after a moderation/DMCA function exists.

**Explicitly deferred to V2:** brands↔creators marketplace; any native video host; a native follower/subscribe graph.

---

## 10. Owner sign-off items (3)

1. **Kill the literal "in-app YouTube host"?** The council unanimously recommends **YES — build the presence layer (§ 2), not a video host (§ 3).** This reinterprets your ask; confirm you're happy with "create videos from templates + embed/publish to the channels you already own" rather than hosting video inside Setnayan.
2. **Follower-gate = perks, not entry.** Confirm the **open-door / gated-badge** model (§ 5), with **hosting an event** as the primary earned status and **OAuth-verified** follower tiers as a secondary perk multiplier — vs a hard follower entry wall.
3. **Comped-SKU-for-watermark trade.** Confirm verified creators may earn **free high-margin SKUs in exchange for the "Made on Setnayan" watermark + attribution** (§ 5, § 7). This spends marketing budget and puts your branding on third-party channels — a deliberate, reversible growth lever.

---

## 11. What we are explicitly NOT building (V1)

- ❌ An in-app video host / general creator video feed (re-hosting bytes).
- ❌ A freeform in-app video editor (locked).
- ❌ A native follower/subscribe social graph inside Setnayan.
- ❌ A brand↔creator ad marketplace or any commission on creator deals.
- ❌ Server renders with creator-supplied major-label music.
- ❌ Standing auto-post to a creator's connected accounts.

---

## 12. Refinement (2026-07-15, same day) — the Adventure Chapter model + lifestyle creators

Owner sharpened the target and resolved the host-vs-embed fork. **Two additions to the verdict above, both consistent with it.**

**a) Audience widens beyond event/wedding creators → travel · food · lifestyle · adventure creators.** These map to the existing `travel` / `simple_event` event types (`[[project_setnayan_composable_event_model]]`) — no new type proliferation. A "trip" or "food tour" is just an event.

**b) The owner's tension — "our content is raw files, not their edited documentation" — is reframed as the MOAT, not a gap.** Their *edit* is the story they chose to tell (their craft, their monetization, licensed music). Setnayan's *raw* files are the explorable reality beneath the edit. **No other platform has both layers in one place.** So we wrap their polished film with our raw substrate rather than trying to replace the edit (which the no-editor lock forbids anyway).

**c) The A-vs-B fork ("let them share edits on their own pages" vs "upload to our page") → resolved as a LAYERED "Adventure Chapter," decided via preview-picker.** Each substantial event = a Chapter on their `/u/[slug]` timeline with three layers:
1. **Finished edit — EMBEDDED, not re-hosted** (YouTube/TikTok/FB). Keeps their license + monetization; **dodges the copyright-music/DMCA host trap** (Setnayan never becomes the distributor of third-party music, since it serves pixels via embed, not the bytes).
2. **Short native teaser — Setnayan HOSTS** (owner pick 2026-07-15: *"Embed + short native teaser"*). Template-rendered, **owned-AI music only**, short → bounded cost + moderatable at low volume + review-free. This is the "made with Setnayan" hook.
3. **Raw substrate — natively ours**: Papic gallery + tagged companions + dated itinerary + vendors/places.
- **The Chapter page is the SHARE TARGET** (`setnayan.com/u/creator/[chapter]`), richer than the bare video → sharing the Setnayan link (not the raw YouTube link) is in the creator's interest → traffic flows TO Setnayan. This is what makes it acquisition, not a dead directory.

**d) Positioning locks to the owner's own line: "they do not create random posts — substantial events only."** Setnayan is **not a feed; it's a timeline of substantial chapters, timed properly** — a chaptered, dated adventure journal. This is the differentiator vs IG (ephemeral/algorithmic) and YouTube (flat list).

**e) The travel/food kicker — the Chapter is SHOPPABLE.** Every place/vendor in an adventure is bookable via the marketplace: follower watches → wants the same trip → books the hotel/restaurant/vendor via Setnayan → **vendor pays for the lead (0% commission, monetize the doorway)**. The creator is a discovery channel; Setnayan never touches their content revenue; the vendor demand engine gets fed. CAC-negative loop + vendor demand-gen in one move — uniquely enabled because Setnayan owns the marketplace under the content. Ties `[[project_setnayan_vendor_monetization]]` + the 0038 affiliate rail.

**Decisive caveat recorded:** the owner's "substantial events, low volume" constraint **dissolves the COST objection to hosting but NOT the LIABILITY one** — one edit with licensed music is an infringement risk whether hosted once or 1,000×. Volume-gating fixes cost; only *embedding the full edit* fixes liability. Hence: embed the edit, host only the short owned-music teaser.

**Still open:** the 3 owner sign-offs in § 10 remain (kill-the-host confirmed by this refinement; open-door/gated-badge + comped-SKU trade still pending). This is still strategy + plan — NOT built.

---

## 13. Creator earning model (2026-07-15, owner-decided) — ad revenue-share on native sponsorships

**The question:** creators earn real money on FB/YouTube/TikTok; Setnayan has no cash pool to pay them. Owner's model: *"ads on their posts → the ads pay us, the influencers earn, and we earn from their ads too."* — i.e. a YouTube-Partner-style ad **revenue-share**.

**The key finding — the revenue-share structure is fine; the AD INVENTORY decides whether it pays.** Two "ad" types behave nothing alike at Setnayan's scale:
- **Programmatic banners (AdSense-style):** yield is the killer — 0039's own measurement was **~₱5–20K/mo site-wide at 100K pageviews**. Even a 60% creator split is pennies per creator, only grows with traffic you don't have yet (circular — you want creators to *bring* traffic but can't pay them until you *have* it), and routes money *through Setnayan's books* → re-creates the payout + BIR burden the owner wanted to avoid. Reopens the RETIRED 0039.
- **Native sponsorships (a vendor/brand pays to be featured/Boosted on the Chapter):** ~**₱1,000–3,000 per placement** (anchored to the existing Sponsored Boost ~₱1,499/wk), advertisers already exist (Setnayan vendors), on-brand (a travel creator featuring a real hotel *is* the content), and pays a nano creator real money — **₱500–1,500 from ONE placement** at a 50% split. Reuses the existing **Boosted Ads / Sponsored Boost** machinery (0022/0038).

**Owner decision (2026-07-15, preview-picker): "Both — sponsorships now, programmatic as filler later."**
- **Primary earning engine = native vendor/brand SPONSORSHIPS** on creator Chapters. Creator earns a share (~50% ref), Setnayan takes a platform cut → *"they earn as we earn from them,"* the owner's exact goal, on high-value inventory.
- **Programmatic network = deferred, low-value FILLER** for unsold space only — added later, eyes open that it yields little and partially reopens 0039. Not the earning engine.

**Money path (V1, treasury-free — honors "we have no monetary source to pay them"):** creator's share paid as **Setnayan credits / comped SKUs**, OR **brand-pays-creator-direct + Setnayan takes a listing/match fee** — either way no funds flow through Setnayan, no payout rails, no BIR/EWT (0026) burden. A true cash rev-share (brand → Setnayan → creator) is **V2**, once payout infra exists.

**Reconciliation with locked model:** an ad/sponsorship cut is **NOT** a violation of 0% commission — that rule governs *bookings* (couple hires vendor, 0% taken). Advertising/promotion is a different transaction, and Boosted Ads already prove Setnayan monetizes promotion. This is "monetize the doorway," and it's the **disciplined, first-party version of the brands↔creators marketplace** the council parked for V2 in § 7.

**Full creator compensation stack (now complete):**
| Layer | Creator gets | Who pays | Setnayan cost |
|---|---|---|---|
| **Special features** | Comped ~99%-margin SKUs · Chapter hub · badge · teaser renders | Setnayan in-kind | ~₱0 |
| **Sponsorship rev-share** (primary cash) | Share of vendor/brand Boost placements on their Chapter | Advertiser (V1: creator share as credits/SKUs; cash = V2) | ₱0 — Setnayan also takes a platform cut |
| **Shoppable-itinerary leads** (§12) | *(Setnayan-earning today; creator referral cut = V2)* | Vendor pays the lead (0% on the booking) | ~₱0 |
| **Programmatic filler** (later) | Small share of unsold-space banner fill | Ad network | low — deferred |
| **Brand deals** (V2) | Off-platform sponsorships | Brands | ₱0 |

**Still to finalize:** exact revenue-split % (proposed ~50/50), whether the creator's V1 share is credits vs SKUs vs the brand-pays-direct+match-fee route, and who sources sponsorships (creator-brought vs Setnayan-brokered). NOT built — strategy only.
