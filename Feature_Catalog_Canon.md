# Setnayan — Feature Catalog Canon

> **The naming canon** — feature names, what each one does, and the free/paid split. Living doc, updated in place, never dated in the filename.
>
> **This file carries NO PRICES, on purpose.** Prices live in the live catalog (`platform_retail_catalog_v2`, `vendor_billing_catalog`) and `Pricing.md § 00`. A second copy of a price is only ever a way to quote a dead one.
>
> **Status:** Naming system = **LOCKED** (owner-approved).

---

## 1. Naming system (LOCKED)

**Pattern:** `Our name (generic descriptor)`. Brand name builds equity; the enclosed generic makes it instantly understood + searchable.

- **In-app / dashboard / brand surfaces:** our name leads → `Salamisim (Live Photo Wall)`.
- **Pricing page / app store / first-touch / SEO:** generic leads → `Live Photo Wall (Salamisim)`.
- **One nickname per feature, forever.** Salamisim is always "Live Photo Wall," never also "Photo Wall" / "Live Wall."
- **Shared stems allowed only for true tiers** — the Papic family (Crew / Guests). Everywhere else, distinct names.
- Already-plain features take **no parentheses** (the name *is* the generic).

---

## 2. The catalog

**Verdict key:** ✅ better · ➖ on par / value-leader · ⚠️ weaker. Intl = local USD × **1.571** (30%-store-cut markup → nets +10% vs local; see §5).

| Our name | Generic | What it does | Basic / Pro |
| --- | --- | --- | --- |
| Papic Crew | Paparazzi Crew | Designated friends/family shoot unlimited candid photos+clips, auto-tagged, kept forever | Pro |
| Papic Guests | Guest Cameras | Per-guest digital disposable camera with a shot limit | Pro |
| Salamisim | Live Photo Wall | Live photo collage projected at the venue | Pro (needs Papic) |
| Camera Bridge (was "Pro Camera Sync") | — | Connect a real DSLR (Canon→Nikon/Sony/Fujifilm roadmap) into Papic / Live Studio · **independent SKU** | Pro |
| Smart Photo Sorting | — | AI+QR auto-routes each photo to the guests in it | Free w/ Papic |
| FaceBlock | Face Privacy | Opt-out guests auto-blurred everywhere | **Free — never sell** |
| Thank-You Video | — | Longer produced film for after the day | Pro (needs Papic) |
| Guest Reels | — | Each guest gets a personal short reel | Pro (needs Papic) |
| Pabati | Video Wishes | Guests record short video greetings | Pro |
| Patiktok | Reel Booth | Booth for guest TikTok-style vertical reels | Pro |
| Live Studio (`LIVE_STUDIO`) | Live Stream | Branded event-page livestream (YouTube, no viewer cap) + multicam switching controller, up to 12 cameras | Pro |
| Pailaw | LED Backdrop | LED stage screen | **Basic** loop / **Pro** live overlays |
| Pakanta | Your Wedding Song | Owned custom song; becomes the soundtrack of every video | Pro |
| Cipher | Monogram Maker | Design your two-initial mark | **Free to design** |
| Animated Monogram | — | Animate + auto-deploy the mark (QR, site, video, LED) | **Pro** |
| Upload Your Own | event-logo upload | Bring a designer's logo / existing mark into the deploy + animate engine | Free input → Pro to deploy |
| Kwento | Photo Stories | Guests write a short story on a photo | Free |
| Kwento Magazine | Memory Magazine | Auto-designed PDF storybook (photos + Kwento + love story) | Free digital / Pro print |
| Custom QR | Guest QR Codes | Personalized QR per guest for invites + check-in | Pro |
| RSVP Website | — | Wedding site + RSVP | **Free — the funnel** |
| Event Website | — | Full site; wakes into live mode on the day | Pro |
| Setnayan AI | — | Planning + vendor matchmaking (first paywall — kept low for conversion) | Pro |
| Seating Chart | — | Interactive table editor + QR + meal counts | Free |

*(Free planning tools — Budget, Guest List, Mood Board — round out the Free tier; not sold separately.)*

### Monogram — three on-ramps (one engine)

The mark can enter the system three ways; all feed the same deploy-everywhere + animate engine, so **"upload" is a path into the paid Animated Monogram, not a separate SKU**:

1. **Make it** — Cipher Monogram Maker (free, in-app).
2. **AI design it** — Setnayan AI bespoke studio (paid generation).
3. **Upload your own** — designer's logo / existing event mark (free input). Respects couples who already have a mark, and is essential for non-wedding event types (corporate/debut) that arrive with branding.

- **Pricing:** upload is **free**; deploying/animating any mark = the paid **Animated Monogram**. No new SKU.
- **Animation honesty:** uploaded marks get **template reveal animations** (fade/scale/shimmer, and draw-on *if* a real-path SVG). The signature **restroke/draw-on** is Cipher-only (needs stroke data) — surface this in the UI as a gentle nudge, not a block.
- **Guardrails:** SVG preferred (PNG transparent ≥ min res; offer **vectorize** for low-res raster so it deploys to LED 8K + print); **NSFW moderation** (non-disableable); **ownership attestation** checkbox (it gets baked into renders/print).
- **→ 0037 spec flag (2026-06-13):** absorb "Upload your own" as a first-class third path in `0037_bespoke_monogram/` — entry choice card (3 options), upload+validate+vectorize flow, the limited-animation set for uploads, and the moderation/attestation gates. Customer surface in the monogram editor; admin moderation surface for flagged uploads.

---

## 3. Dependency rules (cart enforcement)

- **Require a Papic service** (in cart or owned): Salamisim, Thank-You Video, Guest Reels, Memory Magazine print.
- **Require Papic *or* Panood:** Pro Camera Sync.
- **Free, auto-included with Papic:** Kwento, Smart Photo Sorting, FaceBlock.
- **Standalone (any order):** everything else.
- **Rule:** a bundle never contains an add-on without its parent.

---

## 5. Pricing model

- **Philippines:** GCash/BDO direct, **0% fee** — local price = your net.
- **International:** Apple/Google IAP, which auto-converts your USD price to local currencies. **Markup ×1.571** (assume 30% cut → net +10% vs local). **Default to the 30% assumption** — if you get the 15% small-business rate, the extra margin is yours (~+33%).
- **Basic = free (the funnel)**, Pro = paid (the revenue). Free basics (Website, Monogram design, Kwento, Seating, planning tools) drive sign-ups + virality; Pro upgrades + Papic add-ons make the money.
- **Never sell FaceBlock** (privacy/compliance/trust).
- **Setnayan AI stays low** — its job is first-purchase conversion, not margin.
- International strategy: lead marketing with the **output/media features** (cheaper than global market even marked-up); use free basics as the funnel (commodity features go premium once marked-up).
