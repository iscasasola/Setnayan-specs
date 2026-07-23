> # ⚠ READ THIS FIRST — PARTIALLY SUPERSEDED, 2026-07-20 (same day, later)
>
> This council convened and reported **before** the owner working session that produced
> [`0012_papic/Papic_Pricing_Lock_2026-07-20.md`](0012_papic/Papic_Pricing_Lock_2026-07-20.md).
> Where the two disagree, **the pricing lock wins.** Specifically superseded here:
>
> | This verdict says | **Superseded by the lock** |
> |---|---|
> | Render menu (Kwento/Pabati/Stories/Thank You) stays **PAID** | **ALL FREE** — owner ruling; `Papic_Pricing_Plan_of_Action_2026-07-20.md` § 0 is standing |
> | Live Photo Wall ₱2,500 | **FREE** |
> | Flat pass at **₱1,499**, single tier | **₱500 / ₱1,000 / ₱1,500 / ₱1,999** point ladder (3k/6k/10k/15k) |
> | Retention headline **"5 years"** | **6 months** gallery · 90 days full-res · free Drive handover |
> | Cost basis ~₱0.14/capture, margins 54–58% | **~₱0.023/point, margins 82–85%** — face vector is **₱0** (on-device) and NSFW is **self-hosted**, not an API |
> | Free tier 3 × 20 pts | **50 points shared** across up to 3 cameras |
> | Camera ladder ₱30/₱50/₱100 | **Mini ₱99 / Max ₱199**; "Unli" retired as a name; ₱50 rung dropped |
>
> **What in this document REMAINS FULLY VALID and is the reason to keep it:**
> § 2 (the truth audit — every surface that lies, ranked by damage) · § 5 (the doorway, file by file)
> · § 6 (approved / blocked / forbidden copy) · § 7 (the Kuha distribution response) · § 11
> (cross-examination corrections) · § 12 (dissents) · § 13 (what to measure). **None of those are
> pricing-dependent.** The truth audit in particular is the actionable core: wave 0 is ten deletions
> and three DB writes, needs no owner decision and no DPO, and is the difference between a site that
> is under-merchandised and one that publishes things that are not true.
>
> ---

# Papic Website Strategy — Council Verdict
**2026-07-20 · Chair's synthesis · six lenses, all hostilely cross-examined**

## What this is

The owner's brief: *"study, plan and create a powerful execution for the Papic service… create a strategic plan for our WEBSITE to be correct, competitive and correct in price that makes us win at our best services."*

This is the website plan. Not a product rebuild, not a fourth pricing council. Six lenses reported — truth-audit, competitive-position, price-architecture, funnel-doorway, compliance-copy, red-team — and each was cross-examined by a verifier with repo and prod access. Where the correction landed, the correction wins, and § 11 says so out loud.

**Evidence discipline.** Every claim carries a tag:

| Tag | Means |
|---|---|
| `[MEASURED]` | read from live prod DB or `origin/main` **today, by the chair** |
| `[VERIFIED-CODE]` | read directly out of `origin/main` at a cited `path:line` |
| `[MODELLED]` | an assumption, projection or arithmetic construction — never a measurement |
| `[UNVERIFIED]` | asserted by a source document, not confirmed against code or prod |

**Chair's verification pin.** `origin/main` @ **`b46e67218`** (merge of PR #3424, `claude/papic-event-capture-pool`) — *two merges ahead of the brief's `5b72d625d`*. Every code citation below was re-read at `b46e67218`. Every prod figure was queried against `njrupjnvkjkitfctetvi` (setnayan-prod) on 2026-07-20. Lens citations that did not survive re-reading are corrected in § 11, not silently absorbed.

**Prod, 2026-07-20 [MEASURED]:** 63 events · 6 upcoming · 32 orders · 27 paid · **10** paparazzi seats · **0** guest face enrolments, ever. Papic orders all time: `PAPIC_SEATS` 2 · `PAPIC_GUEST` 1 · `PAPIC_ADDON_STORIES` 1 · `PAPIC_ADDON_THANK_YOU` 1 · **`PAPIC_CAMERA_*` = ZERO**. Five Papic-family orders in the platform's life. Every peso projection in the corpus rests on that base and is `[MODELLED]`.

---

## § 1 — Executive summary

**The thesis, in five sentences.**

Setnayan's Papic problem is not that it is priced wrong; it is that the website is *incoherent* — the only Papic price a visitor can read today is "from ₱30/camera," which is cheaper per unit than every Philippine rival, but it hangs off a three-rung ladder where **two of the three rungs cannot be bought** `[VERIFIED-CODE]`, and the one product shaped like the competition — a flat, per-event, all-guests pass — is switched **off** in the database `[MEASURED]`. The public `/papic` SEO page answers "how do I buy this?" by naming two SKUs that are `is_active=false` `[MEASURED]`; the wedding onboarding flow renders those same two dead SKUs at **₱0** while crediting the couple **₱107,000** of savings for them `[VERIFIED-CODE]`; the guest-facing event page publishes "**photos kept permanently**" `[VERIFIED-CODE]` — the exact claim both prior verdicts banned — while `/privacy` states no media retention period at all and code deletes full-res originals at 90 days `[VERIFIED-CODE]`. Meanwhile the differentiator we would lead with, face-sorted delivery, has executed for **zero guests in production, ever** `[MEASURED]`. The winning move is therefore not a price cut: it is to **stop lying, turn the flat pass on, and change what the page is about** — from a camera calculator to one flat pass with a free tier on top and *"Walang 30-day clock"* as the anchor.

**The three moves.**

| # | Move | Shape | Gate |
|---|---|---|---|
| **1** | **Stop lying.** Delete the phantom ₱50 rung, the duplicate SKU title, the two dead SKUs on `/papic`, the ₱0/₱107,000 onboarding defect, and the banned permanence copy on five customer surfaces. | 3 owner DB writes + 3 small PRs | **none** — every item is a deletion or a `is_active=false` |
| **2** | **Turn the product on.** `PAPIC_GUEST` off the pax curve → flat **₱1,499**, retitled *Papic Buong Araw*, `is_active=true`; then wire `papicGuestPassAccess()` into the Studio hub and flip the card from `coming_soon` to `live`. | 1 owner DB write + 1 small PR | owner reprice (0b) · DPO on RSVP consent text (0d/0e). **Gate 0c is now SHIPPED** — PR #3424 landed the event-scoped capture pool `[MEASURED]` |
| **3** | **Change what the page is about.** `/pricing` goes from six Papic numbers plus a calculator to **three visible prices** — ₱0 → ₱1,499 → "or from ₱30/camera". `/papic` leads with face-sorted delivery (consent-conditional) and carries the unnamed compare row. | 2 small PRs + copy | move 2 must have shipped and been measured alone first (§ 8) |

Everything downstream of a **retention number** — the "30 days vs 5 years" compare row, Alaala Keep as a retention product, any duration claim on any page — is **blocked** and stays blocked (§ 10).

---

## § 2 — What the website says today vs what is true

Ranked by damage. Every row was re-verified by the chair at `b46e67218` / prod.

### 2.1 — 🔴 The public ladder advertises two rungs checkout cannot sell

**Says:** `/pricing`, the homepage pricing block and `llms.txt` all render a three-rung Papic ladder — **Papic Mini ₱30 · Papic Ltd ₱50 · Papic Unli ₱100** per camera per day.

**True:** `apps/web/app/pricing/page.tsx:198-238` maps `publicPapicLadder(papicTierConfig)`, which drops only `free` and `roll` (`apps/web/lib/papic-tier-copy.ts:185-189`) `[VERIFIED-CODE]`. Prod `papic_tier_config` has `mini`/`ltd`/`unlimited` all `is_active=true` `[MEASURED]`, so three rungs render.

Checkout handles **two**:

```
apps/web/lib/papic-cameras.ts:121   export type CameraTier = 'free' | 'roll' | 'unlimited';
apps/web/lib/papic-cameras.ts:400   const PER_CAMERA_SKUS = new Set([ROLL, UNLIMITED, FREE]);
apps/web/lib/papic-cameras.ts:417   if (!skuCode || !PER_CAMERA_SKUS.has(skuCode)) return null;
```
`apps/web/app/dashboard/[eventId]/studio/papic/guest-camera-tier-picker.tsx:52,:123,:128` — tier state is `'roll' | 'unlimited'` `[VERIFIED-CODE]`.

`PAPIC_CAMERA_MINI_DAY` and `PAPIC_CAMERA_LTD_DAY` have **no buy path and no enforcement path**. The ₱50 Ltd rung is simultaneously unsellable *and* unmeterable — if such a seat ever existed, `papicPerCameraTier()` would return `null` and the points gate would not bind it at all.

**Damage:** the ₱50 rung is the one that would have answered photoshare.ph's flat ₱999 with a mid-tier. It is public, it is priced, and nobody can buy it.

### 2.2 — 🔴 Two live catalog rows, same title, different price

**Prod `platform_retail_catalog_v2` [MEASURED]:**

| service_code | title | price | is_active |
|---|---|---|---|
| `PAPIC_CAMERA_ROLL_DAY` | **Papic Ltd (per camera, per day)** | ₱30 | true |
| `PAPIC_CAMERA_LTD_DAY` | **Papic Ltd (per camera, per day)** | ₱50 | true |
| `PAPIC_CAMERA_MINI_DAY` | Papic Mini (per camera, per day) | ₱30 | true |
| `PAPIC_CAMERA_UNLIMITED_DAY` | Papic Unli (per camera, per day) | ₱100 | true |

`apps/web/app/pricing/page.tsx:347-361` maps **every active customer SKU** to a schema.org `Product`/`Offer` using `sku.title` verbatim `[VERIFIED-CODE]`. Google and every answer engine therefore ingest **two Papic Ltd offers at ₱30 and ₱50 simultaneously**.

**Blast radius, corrected:** the ₱30 "Papic Ltd" row is filtered out of human-readable copy (`publicPapicLadder` drops `roll`), so this is a **structured-data / answer-engine defect, not a couple-visible one**. Still worth minutes to fix; must not be sold to the owner as something a couple sees. No code change reaches it — it is a DB `title` column.

### 2.3 — 🔴 The SEO landing page tells every visitor to buy two retired products

`apps/web/app/papic/page.tsx:112` — FAQ *"Who takes the photos?"*:

> *"…A handful of designated friends or family can be your crew (**Papic 5 Seats**), or every guest can capture their own night (**Papic Guest** — like handing each table a digital disposable camera)."*

Prod: `PAPIC_SEATS is_active=false`, `PAPIC_GUEST is_active=false` `[MEASURED]`. That answer is fed into `FAQ_LD` at `:120` and injected as schema.org `FAQPage` at `:157` `[VERIFIED-CODE]`.

This is the page whose own docblock (`:5-9`) names it *"the SEO/GEO surface for 'wedding photo sharing Philippines'"*. A couple arriving from search is routed to a dead end, and the machine-readable answer to *how do I buy Papic* is wrong at the source. The page never mentions the per-camera ladder that **can** be bought.

### 2.4 — 🔴 Onboarding renders two dead SKUs at ₱0 and credits ₱107,000 of savings

The highest-intent paid surface in the product. `INAPP_KEYS` (`onboarding-shell.tsx:1145`) includes `papic_seats` and `papic_guest`. Both catalog rows are inactive, so `fetchV2CustomerCatalog` (`lib/v2-catalog.ts:172`, `.eq('is_active', true)`) drops them, and `onboarding-pricing.ts:220-231` takes the missing-row branch:

```
set: 0, out: OUT_ANCHORS[inappKey] ?? 0, label: '', buildStatus: 'not_built'
```

`onboarding-shell.tsx:4538` renders `{pp.label || pesoB(pp.set)}`; `pesoB` at `:1129` is `'₱' + Math.round(n).toLocaleString()` → **"₱0"** `[VERIFIED-CODE]`. `OUT_ANCHORS` (`onboarding-pricing.ts:82-87`): `papic_seats: 75000`, `papic_guest: 32000`.

A couple sees **"Papic · 5 seats — ₱0"** and **"Papic for guests — ₱0"**, can add both, and each inflates the flow's climactic *"saved with Setnayan"* headline by its full market anchor — up to **₱107,000 of fabricated savings on two products that cannot be ordered**.

*This is the most couple-visible defect in the audit and the lens that found it ranked it third.*

### 2.5 — 🔴 The banned permanence claim is live on the public guest page

Both prior verdicts unanimously banned *forever · habambuhay · kept indefinitely · kayo lang ang makakabura* (Handoff § 9 approved-copy rule). The site ships the semantic twin, verbatim, on a route every RSVP'ing guest reaches:

```
apps/web/app/[slug]/page.tsx:4178   Shutter · Selfie Camera · Photo Challenges · Saved Forever · Reel builder
apps/web/app/[slug]/page.tsx:4226   <li>· <strong>Saved Forever</strong> — photos kept permanently</li>
apps/web/app/[slug]/page.tsx:2909   or make a free account (the box near the top) to keep them forever.
```
`[VERIFIED-CODE]`

Contradicted by (a) the filed 5-year media period (`Data_Retention_Schedule_2026-07-11.md:27`), (b) the storage-limitation principle we filed under, and (c) the first RA 10173 erasure request that lands. **Not dead code** — the widget renders from two call sites in the same file.

**Full customer-facing inventory, chair-verified by mechanical grep** (the lens's hand-typed list was incomplete):

| File:line | String | Class |
|---|---|---|
| `app/[slug]/page.tsx:4226` | "kept permanently" | **retention — delete now** |
| `app/[slug]/page.tsx:4178` | "Saved Forever" | **retention — delete now** |
| `app/[slug]/page.tsx:2909` | "keep them forever" | **retention — delete now** |
| `app/[slug]/pabuya/page.tsx:149` | "Kept forever on Setnayan" | **retention — delete now** |
| `app/_components/home/HomeReskin.tsx:602` | ", kept forever." | **retention — delete now** |
| `app/_components/marketing/OurStory.tsx:66,:136` | "Kept forever" / "Yours to keep, forever." | **retention — delete now** |
| `app/dashboard/[eventId]/alaala/page.tsx:76` | eyebrow "Kept forever" | **retention — delete now** |
| `app/dashboard/[eventId]/studio/panood/page.tsx:231` | "free for every couple, kept forever" | **retention — delete now** |
| `app/onboarding/wedding/_components/onboarding-shell.tsx:1107` | "kept forever" (Pabati blurb) | **retention — delete now** |
| `app/features/_sections/_DayOfApparatus.tsx:94` | "i-replay ng mga guest mo **habambuhay**" | **retention — delete now** |
| `app/features/_sections/_DayOfApparatus.tsx:121` | "royalty-free at sa inyo **habambuhay**" (Pakanta) | **music-rights claim — rephrase, do not delete** |
| `app/page.tsx:40,:42,:127,:141` · `app/layout.tsx:215,:239,:254,:361` · `llms.txt:3,:11` · `about/page.tsx:207` · `library/page.tsx:54,:58` · `life-flash/page.tsx:288` · `life-flash-home-card.tsx:82` · `pillars.tsx:61` · `account-inline.tsx:122` | "for life" / "Yours for life" | **OWNER DECISION — see § 6.4** |
| `vendor-benefits.ts:88` · `pricing/page.tsx:484,:709,:721` | "0% commission, forever" / "₱0, forever" | **TRUE price claims — must survive** |

### 2.6 — 🟠 `/privacy` publishes no media retention period while code deletes at 90 days

Every `Retention` heading on `/privacy` is OAuth-grant scoped — `privacy/page.tsx:578`, `:677`, `:810` `[VERIFIED-CODE]`. There is **no** media or biometric retention period anywhere in the file. Meanwhile `apps/web/lib/papic-fullres-drop-core.ts:10` — `DEFAULT_FULL_RES_RETENTION_DAYS = 90` `[VERIFIED-CODE]`.

Four numbers in circulation, and the code agrees with none of the published ones: **90 days** (code, full-res) · **6 months** (NPC dossier § 8a, a *filed* document) · **"indefinitely"** (same dossier, compressed copy) · **5 years with purge** (Data Retention Schedule row 2). RA 10173 § 16(a) transparency requires the period in the notice. **Fix path is the DPO, not marketing** (§ 10).

### 2.7 — 🟠 `/papic` asserts unconditional face recognition; `/privacy` correctly says opt-in; prod says it has never run

`papic/page.tsx:100` — *"Papic recognises faces, so every photo a guest appears in is gathered into their personal gallery **automatically**"*; `:137` — *"…automatically, **in real time**"* `[VERIFIED-CODE]`, both also emitted into `APP_LD`/`FAQ_LD`. `privacy/page.tsx:157-185` correctly scopes matching to selfie enrolment: *"If you never enroll a selfie, we collect no biometric data about you."*

**Prod: `guest_face_enrollments` = 0 rows. Ever. `[MEASURED]`**

Three problems in one claim: a consent-signalling risk that turns an NPC filing adversarial, a promise the product will not keep for non-enrolled guests, and an **unproven-capability claim on the top-of-funnel SEO page**. The privacy page is the honest one; `/papic` must be brought down to it, not the reverse.

### 2.8 — 🟠 `/pricing` shows six Papic numbers plus a calculator

`pricing/page.tsx:119-133`, group *"Papic & its add-ons"*: `PAPIC_CAMERAS` (synthetic, blurb enumerating every rung with its own peso rate **and** the free-camera count) + `CAMERA_BRIDGE` + `PABATI` + `KWENTO` + `PAPIC_ADDON_STORIES` + `PAPIC_ADDON_THANK_YOU`, with `<PapicEstimator>` imported at `:19` `[VERIFIED-CODE]`. Adding Buong Araw makes it seven.

Against Kuha's one-price-one-purchase page, this is the **conversion defect** — fixable without touching a single price. *Correction to the price lens:* the render-menu sum is ≈**₱4,097** at prod prices (Kwento ₱299 + Pabati ₱1,299 + Stories ₱2,000 + Thank You ₱2,499 minus Patiktok, which is in a different group) `[MEASURED]`, not the ₱7,596 it published.

### 2.9 — 🟡 Two SKUs the owner may already have made free are still priced on the public page

Prod `[MEASURED]`: `LIVE_WALL` **₱2,500 active** · `PAPIC_ADDON_THANK_YOU` **₱2,499 active**. `0012_papic/Papic_Pricing_Plan_of_Action_2026-07-20.md § 0` records both as owner decisions to make **FREE**. The same document self-declares *"Status: PROPOSAL, not owner-locked"* — so this is genuinely ambiguous. **Owner decision #1.** If § 0 stands, this is the cheapest correct-the-website move in the plan: two DB writes plus a fixture edit.

### 2.10 — 🟡 `llms.txt` — the file authored to be republished by answer engines

Two real defects, both under-diagnosed by the lenses:
- **:74 and :149** hand-type Papic capacity claims (*"Mini about 20 points a day, Ltd about 70"*) in a file that `apps/web/lib/papic-copy-guardrails.test.ts:49-54` does **not** enumerate `[VERIFIED-CODE]`. It is the highest-amplification **unguarded** capacity surface on the platform.
- **:167** — "last refreshed on 2026-07-14" is stale (the file already carries the 2026-07-20 ladder), and the changelog has no entry for the Setnayan AI reprice to ₱1,499. *The lens's "self-contradiction" framing was wrong* — :167 is a dated historical entry that was true on its date (§ 11).

### 2.11 — 🟡 The free tier has never provisioned in production

Prod `paparazzi_seats` = 10 rows, **none** with `sku_code = 'PAPIC_CAMERA_FREE'` `[MEASURED]`. `provisionFreeCamerasAdmin` is lazy — called render-time from the couple's Papic studio page. Consistent with pre-revenue, so not yet a lie. But the free-tier taste the entire funnel depends on **has never executed end-to-end**. Verify before any campaign points traffic at "3 cameras free."

---

## § 3 — The competitive line

### 3.1 — Where it lives: `/papic`, in place. Do **not** build `/compare`.

`apps/web/app/papic/page.tsx:145-150` already carries a five-row `const VS` table under the heading *"Not a shared photo dump"*, rendered at `:215-240`, on a route registered in `NAV_ROUTES` (`_components/marketing/site-chrome.tsx:52-77`) `[VERIFIED-CODE]`. It is `force-static` (`:29`) and revalidates hourly.

A dedicated `/compare` page would be a new indexable surface whose only job is to mention rivals — the highest legal-and-SEO-risk page we own, and one requiring re-verification on their deploy cadence (Kuha last redeployed 2026-06-25). **The surface we need already exists and already ranks.**

**Publish the comparison in three tiers:** (1) the unnamed VS block on `/papic` — public; (2) a single free-tier line on `/pricing` beside the Papic block; (3) the named, sourced competitor grid stays **internal**, as a vendor/sales one-pager, never on the domain.

### 3.2 — Never name a competitor

The Handoff § 2.5 draft names photoshare.ph in a column header and anchors on ₱999 — a price EventPix already undercuts 30% at ₱699 `[UNVERIFIED — sourced to the competitive research, not re-measured by the chair]`. A named column dates the table to one rival's current sheet, hands them brand equity on our own domain, and invites the symmetric audit we currently fail (§ 2.5).

**Column header: "The usual QR photo app."** Beats Kuha, photoshare.ph and EventPix simultaneously and never needs re-verification.

### 3.3 — The hero claim

**Chair's call: face-sorted delivery stays the hero — consent-conditional, and gated on one verified end-to-end match.**

The competitive lens argued expiry is durable but *illegible* — a couple eight months out cannot feel a loss scheduled for day 30 — and that face-sort is the only category-level unique that is a **felt benefit** rather than a spec, already demoable in three seconds by the page's existing `SettleTiles` animation. That reasoning is right and I adopt it against the corpus position that expiry is "the single most durable competitive wedge." Durable and persuasive are different axes.

**But the red team's discipline binds:** zero production enrolments `[MEASURED]` means this is an unproven capability. So the claim ships **conditionally** — *"Guests who add a selfie get their photos found for them"* — and **one real enrolment→match must be verified on a live event before any paid traffic points at it.** Same standard the truth-audit correctly demanded of the free-3-cameras claim.

Ranking: **HERO** = face-sorted delivery. **SUPPORT 1** = the rendered personal reel (legible only when seen → belongs in a video asset, not a table row). **SUPPORT 2** = video clips, which no PH rival ships. **SUPPORT 3** = permanence — *one line, no number, not a section*.

### 3.4 — The compare row, drafted

Heading stays **"Not a shared photo dump."** Standfirst: **"Walang 30-day clock."**

| The usual QR photo app | Papic |
|---|---|
| Pay before anyone shoots | Cameras included before you pay anything |
| Scroll the whole album to find yourself | Add a selfie and your photos find you |
| Photos only | Photos **and** five-second clips |
| The same shared pile for everyone | Their own gallery — and their own reel |
| A link with a clock on it | Your own event site, beside your guest list and seating |
| Whatever guests remember to upload | Every photo reaches you, tagged or not |

**Deliberately absent, and why:**
- **No "Photos kept: 30 days / 5 years" row.** 🔴 Blocked (§ 10). The slot is designed and drafted; it drops in the day the DPO clears it.
- **No price.** The only number that belongs anywhere near this table is **₱0**.
- **Row 4 corrected from the lens's version.** The competitive lens wanted the "Full-res download: Included / Included" row deleted on the theory that our capture is capped at 2560×1440. That is wrong: `apps/web/lib/use-papic-camera.ts:200` uses `{ width: { ideal: 2560 } }` — `ideal` is a **soft getUserMedia hint, not a cap** — and the canvas draws at `video.videoWidth × videoHeight`. Keep the availability claim. Adopt only the guardrail: **never make a megapixel, sharpness, print-size or "quality" claim anywhere near this table.**

### 3.5 — The anchor line ships now; the number does not

**"Walang 30-day clock."** is a negative claim about the absence of a mechanism in **our** product. True at 90 days, at 6 months, at 5 years. It survives whichever way the DPO rules, it needs no gate, and it is the escape hatch that unblocks the entire merchandising push from the DPO queue.

Pair it with a felt line that names nobody: **"Some galleries start counting the day you sign up. Yours starts when the party does."**

> ⚠ **Do not paste the anchor into the `[slug]` guest sign-up widget.** That widget's free column already names a hard 3-day clock (`app/[slug]/page.tsx:4213`), so replacing the account column's only duration promise with a competitor-facing line leaves the account reading *weaker*. In that widget the replacement must be duration-bearing and true: **"Kept with your account, not on a 3-day clock."**

### 3.6 — Copy candidates

**`/papic` hero (replaces `page.tsx:123`):**
> **Every guest goes home with their own photos.**
> Papic turns your guests into your photo crew. Everyone shoots — photos and five-second clips — and each guest gets their own gallery, plus a personal reel. Add a selfie and your photos find you. Three cameras are on us before you pay anything.

**`/papic` FAQ, replacing the dead-SKU answer at `:112`:**
> **Who takes the photos?**
> Your guests. Every event starts with cameras included, free — hand them to whoever you trust with the night. Need more shooters, or want every guest on your list to have one all day? There is a pass for that. See [pricing].

*(Renders the free count through `papicFreeCameraCount()`. Add `app/papic/page.tsx` to `PAPIC_COPY_FILES`.)*

**`/pricing` free rung:**
> **Free — ₱0.** Three cameras, all day. Photos and five-second clips. Personal reels included. Walang 30-day clock.

---

## § 4 — The price table as it should appear on the site

### 4.1 — The rule: three visible prices per capability

One free, one recommended, one escape hatch. Everything else moves to the in-app set-up surface where the couple is already configuring. Kuha ships one price and one purchase; we currently ship six numbers and a calculator (§ 2.8).

### 4.2 — The table

| Rung | Price | Copy | Tag |
|---|---|---|---|
| **Free** | **₱0** | "Three cameras, all day. Photos and five-second clips. Face-sorted for guests who add a selfie. Personal reels included. Walang 30-day clock." | shipped `[MEASURED]` — `papic_tier_config.free`: 3 seats × 20 pts/day |
| **Papic Buong Araw** ← **HERO** | **₱1,499** per event-day | "One pass for the whole celebration. Every guest on your list gets a camera, all day. Photos and five-second clips. No per-camera math, whatever your guest count." | **`[MODELLED]` — proposed, not shipped.** Prod row is ₱2,999 pax-priced, `is_active=false` |
| *escape line, not a card* | **from ₱30** per camera, per day | "Just a few extra shooters? Pay per camera instead." | shipped `[MEASURED]` — `PAPIC_CAMERA_ROLL_DAY` ₱30 |

Below the fold, in **"After the day"** — never in the same visual block as the hero: Kwento ₱299 · Pabati ₱1,299 · Stories ₱2,000 · Thank You ₱2,499 `[MEASURED]`, plus Papic Unli ₱100/cam·day. `CAMERA_BRIDGE` ₱500 stays with capture.

### 4.3 — Contested number 1: **₱1,499** for Buong Araw

**Reasoning (adopted).** ₱1,499 is the only unoccupied slot in the published PH ladder. Live local set: ₱499 (Kuha VIP) · ₱699 (EventPix floor) · ₱999 (photoshare.ph flat) · ₱999 (Kuha ELITE) · ₱1,999 (Kuha LUXXE) `[UNVERIFIED — competitor teardowns, not re-measured]`. Choosing ₱999 puts us in a three-way tie with two rivals already there; ₱1,999 is head-to-head with LUXXE. ₱1,499 satisfies the -9 charm lock, and against the pax curve it is a **50% cut at 100 pax, 66% at 300, 74% at 500** `[MEASURED]` — prod row is floor 100 @ ₱2,999, +₱350 per 50 pax.

The basket argument: Kuha gates Digital Invitation + RSVP + Seat Finder at **LUXXE ₱1,999 only**; Setnayan ships the event website, unlimited RSVP and per-guest Custom QR at **₱0**. Like-for-like, we are ₱500 under their only comparable tier with 5× the retention and video they do not have.

> ⚠ **The ₱500-cheaper conclusion is `[MODELLED]`, not `[MEASURED]`.** The two tier tables are measured; the *equivalence of the baskets* is the council's judgement. Do not let it harden.

**Counter-argument (must be recorded).** On a SKU-to-SKU read — which is how a couple with four browser tabs open actually reads — ₱1,499 is **50% above the modal PH price and 114% above the floor**. The basket framing that rescues it is `[MODELLED]`, and **Kuha can unbundle invitation/RSVP/seat-finder down to their ₱999 ELITE tier at zero build cost**, which closes the argument overnight. That is a faster and more likely rival move than photoshare adding permanent storage. Monitor their pricing DOM, not their headline.

**Collision note.** Prod already has `SETNAYAN_AI` **₱1,499** and `PATIKTOK_COMPILER` **₱1,499** `[MEASURED]`. Three products at one number flattens the ladder. Not disqualifying — Patiktok is per-day and in a different group, AI is a different category — but **never render the three in the same visual band**.

### 4.4 — Contested number 2: the **₱50 Ltd** rung — deactivate it

**Chair's call: deactivate, today, by DB write. Do not wait on PR #3422.**

The price lens proposed merging #3422 first to preserve its `isPaidCameraTier` deny-list fix. That fix is real and should still merge on its own schedule — but it is **`[UNVERIFIED]`** (unmerged PR, not in `origin/main`) and it must not gate a same-day honesty fix. Three writes:

```sql
UPDATE papic_tier_config          SET is_active = false WHERE tier_code   = 'ltd';
UPDATE platform_retail_catalog_v2 SET is_active = false WHERE service_code = 'PAPIC_CAMERA_LTD_DAY';
UPDATE platform_retail_catalog_v2 SET title = 'Papic Mini (legacy · per camera, per day)'
                                  WHERE service_code = 'PAPIC_CAMERA_ROLL_DAY';
```

Write 1 removes the rung from `/pricing`, the homepage and the estimator in one move (`publicPapicLadder` filters on `isActive`). Write 2 removes it from the JSON-LD `@graph`. Write 3 kills the duplicate-title collision. **Effort: minutes. No PR. No CI.**

**Residual, stated honestly:** `PAPIC_CAMERA_MINI_DAY` stays visible at ₱30 while checkout provisions `roll` at ₱30. Same money, same 20-point capacity, different internal SKU code. That is tolerable; a ₱50 rung nobody can buy is not. The code-side aliasing is the engineering item (§ 8, wave 4).

**Counter-argument:** if the owner believes ₱50/70-points is the right competitive middle rung against photoshare's ₱999, then merge #3422 instead and make it real. Both states are honest. **The current state is not.** Owner decision #3.

### 4.5 — Contested number 3: the free-tier capacity — **owner decision, not a config flip**

The price lens called raising `papic_tier_config.free.points_per_day` from 20 → 70 "the highest-leverage config flip on the page." **The cross-exam killed it and I side with the cross-exam.**

Prod `[MEASURED]`: `free` = 3 seats × **20** pts/day · `mini` = **20** pts @ ₱30/day · `ltd` = **70** pts @ ₱50/day. Setting free to 70 makes the free tier capacity-identical to the paid Ltd rung and **strictly better than Mini** — you would pay ₱30/day for *less* than free. It does not raise the free rung; it collapses the ladder.

The underlying problem is real: 3 × 20 = **60 captures** for an entire wedding day (1 photo = 1 pt, one 5s clip = 3 pts, `papic-cameras.ts:453-454`) against Kuha's 200-photo free trial `[UNVERIFIED]`.

**Chair's recommendation: do not fight on the count.** Fight on what the count buys. Their 200 are SD, photos-only, and die in a month. Ours include **video**, **face-sorting**, **free personal reels**, and **no clock**. That is a "what you get" fight, and it is the one we win.

If the owner wants the number raised anyway, the two coherent options are: **(a)** restore free cameras 3 → 5 (`papic-cameras.ts:91` records `// owner 2026-07-17 (was 5)`) → 100 captures, ladder untouched; or **(b)** retune the whole ladder in one pass. Either is an **owner decision** (#4), not a flip.

> ⚠ Note for whoever implements: `/pricing` renders **no free-tier photo count today** — only *"Your first N cameras are free"* in the estimator body (`_papic-estimator.tsx:126-127`). The home page already leads its Papic block with two free rows (`_components/home/pricing-data.ts:189-196`) `[VERIFIED-CODE]`. So a points change is **invisible on `/pricing`** without a copy PR. The lens's "no copy edit needed" was wrong in both directions.

### 4.6 — What is **not** on `/pricing`

- **Papic Unli ₱100/cam·day** — moves below the fold into "After the day" / the in-app set-up surface. ⚠ There is **no config path** to "public: hidden, set-up: visible" — `publicPapicLadder` has no visibility flag, and `is_active=false` removes a tier from *every* surface. Hiding Unli from `/pricing` while keeping it purchasable is a **small PR**, not a flip. The price lens listed this as a config-flip; the cross-exam caught it.
- **`PAPIC_UNLOCK` ₱15,000 / `PAPIC_UNLOCK_LTD` ₱9,000** — two umbrella SKUs, in `platform_package_catalog`, with **two disagreeing child lists** (`entitlements.ts:353-361` grants `PAPIC_GUEST` as a bundle child; migration `20270303150000:78-84` omits it; `20270511379088:122` includes it) `[UNVERIFIED — not re-read by the chair]`. If Buong Araw goes live before this is settled, the Papic set-up page shows a ₱1,499 pass **and** a ₱15,000 pass that silently includes it. **Owner decision #5.** `Pricing.md` contradicts itself: § 00:155 says PAPIC_UNLOCK "stays active", § 2.1:245 says retired 2026-07-17.
- **Alaala Keep / `HIGH_RES_ARCHIVE`** — stays off `/pricing` at launch (§ 10, DPO item 2). Its buy moment is the 90-day full-res cliff, not the browse moment. *Correction: prod title is already **"Keep Full-Res" ₱999** `[MEASURED]`, not "High Res Archive Yearly Subscription" — the compliance lens's rename recommendation is already done.*

---

## § 5 — The doorway, ranked and buildable

The doorway shipped four hours before this council convened, and it shipped **locked**.

`apps/web/lib/add-ons-catalog.ts:614-620` — entry `key: 'papic-guest'`, `label: 'Papic Buong Araw'`, `serviceKey: 'PAPIC_GUEST'`, `surface: 'rsvp'`, `opensDirect: true`, **`status: 'coming_soon'`** `[VERIFIED-CODE]`. Its own 30-line comment (`:590-613`) names the gates.

`coming_soon` is a **fake door**: `studio/page.tsx:222` renders pill "Soon"; `:213` excludes it from `isRecommendable()`; `:253` kills the inspector target; `:690` passes `href={comingSoon ? null : cardHref(addon)}` — a dead div; `suite/page.tsx:253,:282` drop it from both the available and paid sets `[VERIFIED-CODE]`.

And `papicGuestPassAccess()` — the correct, tested, fail-closed predicate carrying the permanent travel deny, the anniversary controller split and the phase ladder — has **zero production callers**. Every hit outside `lib/papic-event-access.ts` is its own test file or a prose comment `[VERIFIED-CODE, chair-verified by grep]`.

### Ranked, file by file

| # | Action | File / surface | Effort | Blocked by |
|---|---|---|---|---|
| **D1** | **Owner DB write.** `UPDATE platform_retail_catalog_v2 SET retail_price_php=1499, is_pax_priced=false, pax_floor=null, pax_floor_price_php=null, pax_increment_size=null, pax_increment_price_php=null, title='Papic Buong Araw', is_active=true WHERE service_code='PAPIC_GUEST'` | prod DB | **owner-DB-action** | DPO 0d/0e on the RSVP consent text |
| **D2** | **Wire the predicate.** Call `papicGuestPassAccess()` in the Studio hub's `surfaceOk` (defined `:93`, applied to rendered rows at **`:640`** — *not* `:355`, which is recommendations-only) and in `suite/page.tsx:253`. Requires plumbing `events.community_id` into the hub's data load — the anniversary controller split needs it (`papic-event-access.ts:26-27`). | `studio/page.tsx:93,:640` · `suite/page.tsx:253` | **small→medium PR** (larger than "small" — the community_id plumbing) | nothing |
| **D3** | **Flip the card.** `status: 'coming_soon'` → `'live'`, **in the same PR as D2, never before it.** `addOnHref` already routes the key — no 404 risk. | `add-ons-catalog.ts:620` | config-flip | D1 + D2 |
| **D4** | **Add Buong Araw to `/pricing` as the FIRST Papic item**, above the per-camera row, as one flat number. | `pricing/page.tsx:119-133` | small-PR | D1 (until then the page prints a rising pax number) |
| **D5** | **Roster entry point.** `dashboard/[eventId]/guests/page.tsx` contains **no mention of Papic** `[VERIFIED-CODE]`. Add a roster-aware strip: *"N guests on your list. One pass gives every one of them a camera."* → `/dashboard/[eventId]/studio/papic`. | `guests/page.tsx` | small-PR | D3 |
| **D6** | **Re-map onboarding.** `papic_guest` reaches only 9 of ~40 picks (`onboarding-shell.tsx:1175,:1183,:1189,:1190` — cake, stations, photo_video, photo_booth, coffee, mocktail, dessert, food_cart, food_truck) `[VERIFIED-CODE]`. `REC_PRIORITY:1200` then ranks it **8th of 12**, behind `papic_seats` (a dead SKU). Fix the **mapping first**, then the order. | `onboarding-shell.tsx:1175-1200` | small-PR | § 2.4 fix |
| **D7** | **Purchase cutoff copy.** Apply-then-pay: orders land `pending_approval` (`checkout/actions.ts:18,:30,:200`) and only `admin/payments/actions.ts:207` writes `'paid'`. State it: *"Order at least 3 days before your event. We confirm within 24 hours, then your cameras open."* | `studio/papic/page.tsx` + the new `/pricing` row | copy-edit | owner picks the cutoff (#7) |
| **D8** | **Instrument, or accept it reports nothing.** The `coming_soon` card emits no impression and no click. ⚠ `lib/analytics.ts` is `import 'server-only'` and early-returns without a `distinctId` — it **cannot** instrument an anonymous visitor. Use the browser SDK already wired at `_components/posthog-provider.tsx`. | `studio/page.tsx` + `pricing/page.tsx` | small-PR | nothing |

> **Do NOT bump `PAPIC_ACCESS_CURRENT_PHASE` beyond 1.** The gate is shipped and fail-closed. Phases 2/3 carry self-join hardening and CSAM-matcher gates; bumping the constant is the cheapest possible way to cause a compliance incident.

---

## § 6 — What we may say / must not say

### 6.1 — ✅ Approved, shippable today, no gate

| Claim | Basis |
|---|---|
| **"Walang 30-day clock."** | A negative claim about our own product. True at any retention value. Council-approved anchor. |
| "Some galleries start counting the day you sign up. Yours starts when the party does." | Factual framing; names nobody. |
| "Three cameras, all day — before you pay anything." | `papic_tier_config.free.seats_per_event = 3` `[MEASURED]`. **Must render via `papicFreeCameraCount()`.** |
| "Photos and five-second clips." | Shipped; no PH rival ships guest video `[UNVERIFIED]`. |
| "Every photo reaches you, tagged or not." | The untagged-still-delivered guarantee (locked constraint). |
| "It lives on your own event page, beside your guest list and seating." | Shipped. |
| "Kept with your account, not on a 3-day clock." | Duration-bearing, true, and the correct replacement inside the `[slug]` widget. |
| **"0% commission, forever" · "₱0, forever"** | **TRUE price-permanence claims. Must survive the copy purge.** |

### 6.2 — 🔴 Blocked (drafted, held, drops in when the gate clears)

| Claim | Gate |
|---|---|
| Any retention **number** — "5 years", "90 days", "kept for the life of your account" | DPO § 10 item 1. The filing says 6 months, code says 90 days, the schedule says 5 years with purge, the dossier says "indefinitely." |
| The "Photos kept: 30 days / 5 years" compare row | Same. The slot is designed; the row is drafted; it ships the day § 1.3 resolves. |
| "Every guest's phone becomes a camera" (to an audience including the guests) | DPO § 10 item 3 — the RSVP form does not name guest-phone capture `[UNVERIFIED]`. |
| Alaala Keep framed as "keep your photos longer" | DPO § 10 item 2 — is a *paid retention extension* permissible under storage limitation at all? Draft it **sync/export-first** so a "no" costs a headline, not a rebuild. |
| Any encryption claim about the Drive connection | `lib/drive-copy.ts` reads `oauth_grants.refresh_token` as a plain string with no decrypt step. Keep `/privacy`'s existing storage-layer wording (`:573,:656,:789`). |

### 6.3 — 🚫 Forbidden, permanently

- **forever · habambuhay · kept indefinitely · kayo lang ang makakabura** — as *retention* claims, on any customer surface. Both prior verdicts, unanimous.
- **"real-time" / "live" / "instantly on the wall"** about the photo wall. `screenCapture` runs fail-open and fire-and-forget; the only healer, `reScreenStuckCaptures`, is bounded at `RESCREEN_LIMIT = 10` rows per table behind a 15-minute grace (`lib/nsfw-screen.ts:307,:309`), fired from `after()` on **two manual page opens** (`studio/papic/moderation/page.tsx:74`, `dashboard/(account)/life-flash/page.tsx:106`), and `apps/web/vercel.json` is `"crons": []` `[VERIFIED-CODE]`. A 150-guest reception can go dark one photo at a time with no automatic remedy. **This forbids `/papic:137` — "automatically, in real time."**
- **Open / public-QR / anonymous crowd capture** — never advertised. Re-opens the CSAM known-hash, bystander-consent and minors-in-crowd cluster.
- **Any megapixel, sharpness, print-size or "quality" claim** near the compare row. It invites the one counter-attack we cannot win.
- **Any hand-typed Papic capacity, free-camera count, cap or points figure.** Photos and clips share one purse (`lib/papic-tier-copy.ts:14-27`), so an exact "N photos + M clips" promise is unkeepable **by construction**.

### 6.4 — ⚖ "For life" — an owner question, not a lint rule

The compliance lens proposed a CI guardrail failing on `forever · habambuhay · indefinitely · permanently · for life`. **Two of those five are wrong.**

The approved-copy rule bans exactly four strings; **"for life" is not among them.** And the owner locked it twice: Handoff:287 — *"KEPT FREE FOR LIFE (the emotional moat)"* — and `llms.txt:167` records a 2026-07-14 owner positioning refresh whose entire spine is *"plan · capture · keep for life."* A guardrail failing on "for life" mechanically blocks the owner's own brand positioning across `app/layout.tsx` (four places), `llms.txt`, `/about` and the account surfaces.

`permanently` would fail ~15 legitimate admin strings **and** `[slug]/actions.ts:309`, which documents the privacy notice's *true* promise that withdrawal "permanently deletes your face" data — a claim we want to make.

**Chair's call: guard the four banned strings only, scoped to marketing/guest-facing JSX, with an allow-list for the true price claims.** Route "for life" to **owner decision #6** — it is a possession/access claim, not a storage-duration claim, and reversing it rewrites the brand summary.

### 6.5 — The guardrail is narrower than everyone assumed

`apps/web/lib/papic-copy-guardrails.test.ts:49-54` reads a **four-file allow-list**: `app/pricing/page.tsx`, `app/pricing/_papic-estimator.tsx`, `app/_components/home/pricing-data.ts`, `app/dashboard/[eventId]/studio/papic/guest-camera-tier-picker.tsx` `[VERIFIED-CODE]`. It does not scan the repo.

Proof it is not repo-wide: `onboarding-shell.tsx` already ships the literal *"3 guest seats"* and CI is green. And its `SPELLED_FREE_COUNT` regex is `/first\s+\d+\s+(?:cameras?|free)/i` — so the competitive lens's own proposed string, *"Three cameras, ₱0"*, would not match it. **Adding a file to the list protects nothing unless the regex is widened to word-numerals and bare counts.**

**Every new Papic surface in this plan must be added to `PAPIC_COPY_FILES` in the same PR — `app/papic/page.tsx`, `public/llms.txt`, `guests/page.tsx`, the onboarding shell — or the guardrail is decorative for exactly the pages we are about to write.**

---

## § 7 — The Kuha distribution response (the website half of owner decision #11)

### 7.1 — The strongest single finding in the council

```sql
-- supabase/migrations/20270325546250_vendor_service_recommendations.sql:61
('photo_video', 'PAPIC_CAMERA_UNLIMITED_DAY', true, 90,
 'Crowd capture — can read as competition; opt-in only'),
```
`[VERIFIED-CODE, chair-verified verbatim]`

It is the **only** `is_opt_in = true` row in the entire `photo_video` block (`:55-61`); every sibling is `false`. **We have encoded, in our own production database, that our capture product reads as a threat to the exact trade Kuha's white-label "Studios & Partners" program is recruiting.**

A couple-facing price rebuild is aimed at the wrong layer if the photographer becomes the doorway.

### 7.2 — We already give away, free, what Kuha's partner pays ₱999/month for

`apps/web/lib/vendor-papic-tier.ts:1-53` — a booked vendor who accepts an inquiry with a lead token earns **Papic Ltd on the day: 70 capture points, photos AND 5-second clips, at ₱0** `[UNVERIFIED — cited by the competitive lens, not re-read by the chair]`. Kuha's partner gets a subdomain and a ₱150–₱600 resale margin, with a stated ceiling of ₱2,001/month at 5 events.

**The pitch is not "resell our brand." It is "keep your client, and shoot into our rig for free."**

### 7.3 — Fix the three fake doors first

`apps/web/app/_components/home/vendor-benefits.ts:157,:158,:159` advertise **"White-label couple tools"**, **"Resell Setnayan Productions"** and **"Setnayan-certified partner"** as `soon: true` on the Pro tier `[VERIFIED-CODE]` — while the corpus defers corporate white-label until ≥5 inbound orders.

We are running **Kuha's exact pitch with no build behind it**, on the surface a PH wedding photographer reads while choosing between us and them. Either honour them or strike them. The one we can honour today is **"Credited on the couple's gallery."**

### 7.4 — The page

**Ship `/vendors/photographers`** — a segment page in `NAV_ROUTES`. Precedent exists: `/creators` was added 2026-07-16 as a segment marketing page and sits in the same nav (`site-chrome.tsx:59-62`). Today `/vendors` is one generic page for all 28 categories; Kuha recruits **one trade** with a page written for that trade. *The channel fight is lost at the page level before price ever enters it.*

> ⚠ **Route correction:** the red team cited `apps/web/app/for-vendors` — **that directory does not exist** on `origin/main`. The vendor-side public surfaces are `/vendors`, `/open-shop` and `/creators`.

**Headline:** *"Your name on the night. Not on a subdomain."*
**Subhead:** *"Setnayan does not resell you a brand. Your couples plan here free, book you at 0% commission, and every photo their guests take lands in a gallery that credits your studio."*

**Sections:** the arithmetic of 0% vs a resale margin · the credited gallery · the couple's planning workspace as your client-retention layer · a **"Setnayan-credited studio"** badge in place of white-label · *(gated)* shoot into the rig free on the day — hold this section until the counsel gate in `lib/vendor-dayof-flags.ts` flips.

**Quote no channel prices.** The Pro Event Licence / white-label ladder in the Plan of Action § 3 is entirely unbuilt.

**Risk to state plainly:** telling a studio "you keep the client" invites them to keep the client **off Setnayan too**. The page must make the *workspace*, not the *margin*, the reason to stay.

---

## § 8 — Build order and sequencing

### The attribution constraint, adjudicated

**The red team gets the last word on sequencing, and its ruling is: the attribution argument is statistically void and must not block work.**

Prod has **6 upcoming events** `[MEASURED]`. At n=6, a 0% attach and a 16% attach are the same observation (0/6 vs 1/6). No decision rule separates them, and waiting costs months of calendar. **Anyone who blocks a website fix citing "we'd destroy the attribution" is protecting a measurement that does not exist.**

But the constraint is not void everywhere — it is **relocated**:

1. **In-app cannot answer the demand question. The unauthenticated `/pricing` page is the only surface with sample.**
2. **On `/pricing`, two changes genuinely confound each other:** the flat-pass reprice and the free-tier framing both move the same conversion number. Those two — and only those two — must not ship in the same week.
3. **Everything in wave 0 is a deletion or a correction. Deletions need no attribution.**

### The waves

**WAVE 0 — this week, no gate. Truth.**

| Item | Surface | Type |
|---|---|---|
| Delete the ten retention-class permanence strings (§ 2.5 table, rows 1–10) | 8 files | copy-edit PR |
| Rephrase `_DayOfApparatus.tsx:121` as a rights claim: *"royalty-free at sa inyo, walang royalty"* | 1 file | same PR |
| Rewrite `/papic` FAQ `:112` — strike "Papic 5 Seats" / "Papic Guest"; derive counts via `papicFreeCameraCount()` | `app/papic/page.tsx` | small-PR |
| Make `/papic` face claims consent-conditional (`:100`, `:136-137`) and strike "in real time" (`:137`) | `app/papic/page.tsx` + `APP_LD`/`FAQ_LD` | same PR |
| Add `app/papic/page.tsx` + `public/llms.txt` to `PAPIC_COPY_FILES`; widen `SPELLED_FREE_COUNT` to word-numerals | `lib/papic-copy-guardrails.test.ts` | same PR |
| Gate the onboarding cards on `buildStatus !== 'not_built' && label !== ''` (kills ₱0 + ₱107,000) | `onboarding-shell.tsx:4531-4538` | small-PR |
| **The three DB writes** (§ 4.4) killing the phantom ₱50 rung + duplicate title | prod | **owner-DB-action** |
| `llms.txt` — append the Setnayan AI ₱1,499 changelog entry; refresh the date stamp | `public/llms.txt:167` | copy-edit |
| Add the four-string CI guardrail with the price-claim allow-list | `lib/*.test.ts` | small-PR |
| Corpus: correct `CLAUDE.md`'s Setnayan AI ₱499 → **₱1,499** and replace the inline SKU tables with a pointer to `Pricing.md § 00` | `~/Documents/Claude/Projects/Setnayan/CLAUDE.md` | copy-edit |

**WAVE 1 — the one change that must ship alone. Gated on owner + DPO.**

D1 (owner DB write, `PAPIC_GUEST` → flat ₱1,499, retitled, active) → then D2 + D3 in one PR (predicate wiring + status flip) → then D8 (instrumentation, browser SDK). **Nothing else touches `/pricing` or the Papic funnel during this window.** This is the change whose attach number matters, and it is the only one with a chance of being read.

**WAVE 2 — after wave 1's measurement window, or 1,000 `/pricing` sessions, whichever comes first.**

D4 (Buong Araw first on `/pricing`) · the three-rung restructure (§ 4.2) · the "After the day" split · the VS-block rewrite (§ 3.4) · the free-rung framing · D5 (roster strip) · D6 (onboarding re-map) · D7 (cutoff copy).

**WAVE 3 — owner-chartered.** `/vendors/photographers` (§ 7). Fix the three `vendor-benefits.ts` fake doors first — they can go in wave 0 as a deletion.

**WAVE 4 — engineering, unblocked by nothing above.** Merge PR #3422 (widen `CameraTier`, extend `PER_CAMERA_SKUS`, carry the `isPaidCameraTier` deny-list fix) so Mini stops aliasing to `roll`. Add the surviving rungs to `BUILD_STATUS` (`v2-catalog.ts:100-145`) so JSON-LD `availability` matches the visible copy. Derive the synthetic `PAPIC_CAMERAS` row's `build_status` from the ladder instead of the hardcoded `'live'` literal at `pricing/page.tsx:236`. Give `publicPapicLadder` a visibility flag so Unli can leave `/pricing` without leaving the app.

**BLOCKED INDEFINITELY.** Every retention number. The compare row's "Photos kept" line. Alaala Keep as a retention product. Any "every guest's phone is a camera" line aimed at guests.

---

## § 9 — Owner decision queue

| # | Decision | Recommendation | Cost of deciding wrong |
|---|---|---|---|
| **1** | **Are Live Photo Wall (₱2,500) and Thank You Video (₱2,499) free, per Plan of Action § 0?** Prod says both are live and priced `[MEASURED]`; the document self-declares "PROPOSAL, not owner-locked." | **Rule now.** If free → two DB writes + a `llms-price-fixture.ts` edit, same day. | Say-free-then-charge is the worst outcome; the site currently charges for two things the owner may believe are free. |
| **2** | **₱1,499 flat for Papic Buong Araw?** | **Yes.** Only unoccupied rung in the PH ladder; -9 charm; 50–74% below the pax curve. | Wrong high → we lose the ₱999 shoppers we never had anyway (1 lifetime order). Wrong low → we anchor a category at ₱999 and cannot climb. **Cost of not deciding is higher than either:** the SKU is switched off. |
| **3** | **Deactivate the ₱50 Ltd rung, or merge #3422 and make it real?** | **Deactivate today** (§ 4.4, three writes). Merge #3422 on its own schedule for the deny-list fix. | Deciding wrong is recoverable in minutes either way. **Not deciding leaves a priced, unbuyable rung on four public surfaces plus `llms.txt`.** |
| **4** | **Raise the free tier?** Free is 3 × 20 = 60 captures vs Kuha's 200-photo trial. | **Do not raise the points** — 70 collides with paid Ltd and inverts Mini. If raising, restore **cameras 3 → 5** (was 5 until 2026-07-17). Or hold and fight on video + face-sort + no-clock. | Raising points wrong makes the paid ladder incoherent and is visible to every buyer. Holding risks losing the "free tier is our asymmetric weapon" argument on the only number a couple compares. |
| **5** | **Does `PAPIC_UNLOCK` ₱15,000 still exist, and does it still grant `PAPIC_GUEST`?** `Pricing.md` § 00:155 vs § 2.1:245 contradict. | **Deactivate it, or remove `PAPIC_GUEST` from its children — before wave 1.** Fix both the `bundle_components` row **and** `entitlements.ts:353-361`; a DB-only edit leaves the app constant still granting. | A ₱1,499 pass sitting silently inside a ₱15,000 SKU on the same set-up page is the single most incoherent thing a couple could see after the reprice. |
| **6** | **Does "for life" stay?** It is owner-locked twice and spans `layout.tsx`, `llms.txt`, `/about` and four account surfaces. | **Keep it.** It is a possession/access claim, not a duration claim, and it is not on the banned list. Ask the DPO to confirm it does not read as duration (§ 10 item 4). | Deleting it reverses a locked brand positioning and rewrites the answer-engine brand summary. Keeping it, if the DPO says it reads as duration, means the purge has to run twice. |
| **7** | **What is the purchase cutoff in days?** Apply-then-pay, 24-hour manual reconciliation SLA. | **3 days.** State it wherever Buong Araw is sold. | No stated cutoff → night-before buyers get a product that activates after the wedding. A refund and a one-star review, from a product that worked perfectly. |
| **8** | **Charter the Kuha channel response?** (§ 7) | **Yes — the page only.** `/vendors/photographers`, no channel prices quoted, capture section held behind the counsel gate. | Not chartering leaves the distribution layer undefended while a rival actively signs the trade. Chartering the *pricing* half prematurely quotes an unbuilt ladder. |
| **9** | **Run the `/pricing` demand test honestly, or is the reprice already decided?** | **Ship the reprice regardless** — it is a correction, not an experiment. Run the test to size the funnel, not to gate the fix. | Dressing a decided move as an experiment burns the one instrument we have. |
| **10** | **Who owns `platform_retail_catalog_v2` titles and `is_active` going forward?** Four defects here are pure DB state no PR or CI guard can reach. | **Name one owner and add a weekly prod-vs-copy diff to the release ritual.** | This is the mechanism by which every drift in this document happened, and it will happen again. |

---

## § 10 — DPO / counsel queue (website-copy gates only)

Only items that block **what the site may say**. The full compliance queue lives in `Papic_Compliance_Delta_2026-07-20.md`.

| # | Item | Blocks | Owner | If it never clears |
|---|---|---|---|---|
| **1** | **Reconcile the retention period.** Code `DEFAULT_FULL_RES_RETENTION_DAYS = 90` `[VERIFIED-CODE]` · NPC dossier § 8a says **6 months** for full-res and **"indefinitely"** for the web copy · `Data_Retention_Schedule` row 2 says **5 years, hot 90d → cold → purge**. The dossier self-declares that this paragraph blocks all retention marketing copy. | **Every retention number on every surface**, the compare row's headline row, and the `/privacy` media section. | DPO ratifies; owner picks 90 vs 180 (a Vercel env flip, `PAPIC_FULLRES_RETENTION_DAYS=180`, resolves it with no PR). | Ship **"Walang 30-day clock"** permanently and never publish a number. The plan loses a row, not a spine. |
| **2** | **Is a paid retention extension permissible under RA 10173 storage limitation, and what is its ceiling?** (Alaala Keep / `HIGH_RES_ARCHIVE`, prod title "Keep Full-Res" ₱999 `[MEASURED]`.) | Whether Keep is a **retention** product or a **Drive-sync / export convenience**. | DPO. | Draft it sync-first today; a "no" then costs a headline, not a rebuild, and makes Drive-connect rate the metric the CTA measures. |
| **3** | **Does the RSVP form name guest-phone capture?** The nearest sentence says "photographers can find your candid shots" — which a Filipino guest reads as the *hired professional team* `[UNVERIFIED — sourced to the compliance delta, not re-read by the chair]`. | **Every "every guest's phone becomes a camera" line aimed at an audience that includes the guests being photographed.** Named "the real gate" in the Handoff. | DPO. **One paragraph, not a build** — model it on the biometric consent block, already the strongest consent surface in the product. | The Day Pass reduces to a designated-shooter flat pass and Phases 2–3 die. |
| **4** | **Does "for life" read as a storage-duration claim?** (Owner decision #6 depends on this.) | ~14 strings across `layout.tsx`, `llms.txt`, `/about`, the account surfaces and the home page. | DPO — a short read, not a filing. | Keep it as a possession claim, which is what the owner locked. |
| **5** | **Publish ROPA row 21** (Papic captured media). No ROPA row covers the photographs and ≤5s clips Papic captures **for weddings shipping today**, not merely the expansion `[UNVERIFIED]`. Draft written at Compliance Delta § 2.2. | Should gate the merchandising **push** — pushing capture volume up while the disclosure row is missing is what turns an omission into a material one. | DPO must rule on the § 12(f) basis for incidental capture. | The push must not run. This is a paragraph; the cost of doing it first is near zero. |
| **6** | **Does "facial-recognition photo matching for this event" adequately describe face-sorted *delivery* to that guest?** | The hero claim on `/papic` (§ 3.3). | DPO. | The hero reverts to "photos and clips from everyone, in one gallery" — weaker, and it hands the category unique back. |

**Verification prerequisite before items 3 and 5 are actioned:** three one-line greps the compliance lens never ran — `photo_consent` default-true insert paths, the RSVP consent copy in `[slug]/_components/selfie-capture.tsx:391-449`, and `lib/vendor-papic-tier.ts:51` before any "Papic Lite" rename is scheduled. Do not send a DPO an unverified gate.

---

## § 11 — Cross-examination corrections

Corpus convention: verification corrections are **cited, not silently absorbed**. Where the correction was graded `certain` or `likely`, it **wins**.

| # | Lens claim | Correction | Grade | Chair |
|---|---|---|---|---|
| **1** | Multiple lenses: "`origin/main` @ `5b72d625d`" (inherited from the brief) | HEAD is **`b46e67218`** — two merges ahead. `412913de2` = PR #3423 (doorway), `b46e67218` = PR #3424, whose commit `2fa9a224a` is *"event-scoped capture fence for a flat per-event pass"* — **that is gate 0c** `[MEASURED]`. | certain | **Correction wins.** Gate 0c is SHIPPED. The `add-ons-catalog.ts:596-613` comment enumerating 0b/0c/0d/0e is itself now stale. Buong Araw's blocker set shrinks to **0b + 0d/0e**. |
| **2** | Brief + competitive lens: "`PAPIC_GUEST` is ABSENT from `add-ons-catalog.ts`" | **False since PR #3423.** Full entry at `:614-620`, `status: 'coming_soon'`, `addOnHref` already routing it. | certain | **Correction wins.** The doorway is an authoring task no longer; it is a one-word flip behind a predicate wiring. |
| **3** | Price lens: "deactivate `ltd` → public ladder becomes ₱0 → ₱30 → ₱1,499; Unli stays live but only in the set-up surface" | `publicPapicLadder` filters only on `isActive` + excludes `free`/`roll`. Deactivating `ltd` leaves **mini AND unlimited** public. There is **no config path** to "public: hidden, set-up: visible." | certain | **Correction wins.** Hiding Unli from `/pricing` is a **small PR**, not a config flip. Moved to wave 4. |
| **4** | Price lens: "raise `free.points_per_day` 20 → 70 — highest-leverage config flip; no copy edit needed" | 70 is **exactly** the paid Ltd rung's rate; Mini (20 pts @ ₱30/day) becomes a rung you pay for *less* than free. And `/pricing` renders no free-tier photo count at all, so the flip is invisible on the page it was proposed for. | certain | **Correction wins.** Demoted from "config flip" to **owner decision #4** with the collision math shown (§ 4.5). |
| **5** | Truth audit: "the Mini/Ltd fix is a large PR blocked on #3422" | `pricing/page.tsx:200-207` drops any rung whose rate SKU is absent from the active catalog. The rungs render **solely because their catalog rows are `is_active=true`** `[MEASURED]`. Honest shutdown = **three DB writes, minutes.** | certain | **Correction wins.** Reprices the whole item from a sprint to an afternoon (§ 4.4). |
| **6** | Truth audit: onboarding cards "render with a blank price" | They render **"₱0"** — `pesoB(0)` at `onboarding-shell.tsx:1129,:4538` — and each still carries its `OUT_ANCHOR`, inflating the flow's climactic savings headline by up to **₱107,000** `[VERIFIED-CODE, chair-confirmed]`. | certain | **Correction wins.** Promoted from third-ranked to **the most couple-visible defect in the audit** (§ 2.4). |
| **7** | Truth audit: `llms.txt:167` "contradicts itself on the flagship paid tier" | `:167` is a **dated historical changelog** ("Prior 2026-07-10 — … moved to a flat ₱499 one-time"), true on its date. Every live-price line says ₱1,499. | certain | **Correction wins.** Restated as: append the missing entry, refresh the stale date stamp. **Lowest-damage item on the list.** Meanwhile the real `llms.txt` defect — unguarded hand-typed capacity claims at `:74`/`:149` — was found by the compliance cross-exam, not the truth audit. |
| **8** | Competitive lens: "a live `HIGH_RES_ARCHIVE` billed '/yr' that never expires (`entitlements.ts:234`)" | **Fabricated citation.** Zero hits for `HIGH_RES_ARCHIVE` in that file; `:234` is unrelated order-status code. Prod title is **"Keep Full-Res" ₱999** `[MEASURED]` — not a "Yearly Subscription." | certain | **Correction wins.** Struck. The defensible version is doc-sourced (prepaid 12-month term, never auto-renew, because recurring billing is unbuilt) and tags `[UNVERIFIED]`. |
| **9** | Competitive lens: delete the "Full-res download: Included / Included" row; our capture is capped at 2560×1440 | `use-papic-camera.ts:200` uses `{ width: { ideal: 2560 } }` — `ideal` is a **soft hint, not a cap**; the canvas draws at `video.videoWidth × videoHeight`. "~3.7 MP" was `[MODELLED]` presented as `[VERIFIED-CODE]`. | likely | **Correction wins.** **Keep the row.** Adopt only the guardrail: never claim resolution or quality near the compare table. |
| **10** | Compliance lens: `#3422` is unmerged so the ₱50 Ltd rung is a fake door "with an audit trail" — tagged `[VERIFIED-CODE]` | The Ltd rung **is** wired in config (`papic-tier-copy.ts:101-110`; prod row active `[MEASURED]`). The lens inferred code state from a corpus sentence about an unmerged PR and stamped it `[VERIFIED-CODE]`. | certain | **Correction wins on provenance — but the lens's *conclusion* was right for a reason it never found.** The rung is a fake door because **checkout cannot sell it** (`CameraTier` excludes it), not because the config is missing. The chair re-derived this independently at `papic-cameras.ts:121,:400-404,:417`. |
| **11** | Compliance lens: CI-guard `forever · habambuhay · indefinitely · permanently · for life` | "For life" is **not banned** and is owner-locked twice; "permanently" fails ~15 legitimate admin strings and the true face-deletion promise at `[slug]/actions.ts:309`. | certain | **Correction wins.** Guard the four banned strings only (§ 6.4). "For life" → owner decision #6. |
| **12** | Compliance lens: the banned claim spans "five files and two route groups" | Undercounts. Chair's mechanical grep finds **ten** retention-class occurrences across **eight** files plus `llms.txt` — including `[slug]/page.tsx:2909`, the sign-up-moment line on the same public route, 1,300 lines from the cited one. | certain | **Correction wins.** § 2.5 publishes the mechanical list. **Never trust a hand-typed grep list — including this one; re-run before the PR.** |
| **13** | Funnel lens: wire the predicate into `surfaceOk` "~`:355`" | `:355` is `isEligible` inside `recommendStudioAddOns` — **recommendations only**. `surfaceOk` is defined at `:93` and applied to rendered rows at **`:640`**. Wiring at `:355` would gate suggestions while the card still rendered for travel. | certain | **Correction wins.** § 5 D2 cites `:640`. Also adds the `community_id` plumbing the lens missed, which makes D2 larger than "small." |
| **14** | Funnel lens: the ₱0 rung is "buried as a chip and a subordinate clause" on the home page | **Refuted.** `_components/home/pricing-data.ts:189-196` already leads the Papic block with two `Free` rows, including the derived free-camera row. And the cited `app/page.tsx:136` is a **JSON-LD `featureList` string** no couple ever sees. | certain | **Correction wins.** The genuine gap is narrower: `/pricing` states free only inside estimator body copy, and Studio shows it as a `freeTrial` chip on the *paid* entry. |
| **15** | Red team: "the public page's visible ceiling is 6×–15× a ₱999 competitor; lower the caps" | The estimator defaults to `tiers[0]` × 10 cameras × 1 day = **₱300** (`_papic-estimator.tsx:94-96`), and the catalog row reads **"from ₱30/camera"**. ₱6,000/₱15,000 are **wedding-only protective clamps** rendered as "never total more than," binding only above ~200 Mini cameras. | certain | **Correction wins.** *Lowering the caps would cut the maximum a couple can pay while leaving the headline untouched — a giveaway dressed as a competitive fix.* Only the "`PAPIC_GUEST` has no public surface" half survives — and it is the finding that reframes the whole plan. |
| **16** | Red team: run the demand test with `captureEvent` (`lib/analytics.ts`) | `lib/analytics.ts` is `import 'server-only'`, requires a `distinctId`, and early-returns without one. **It cannot instrument an anonymous `/pricing` visitor** — the entire test population. | certain | **Correction wins.** Use the browser SDK at `_components/posthog-provider.tsx`. The "<1.5% over 1,000 sessions" rule is `[MODELLED]` — no measured `/pricing` session volume exists anywhere. |
| **17** | Red team: "two mutually-exclusive owner mandates dated 2026-07-20" | `Papic_Pricing_Plan_of_Action` line 5 self-declares **"Status: PROPOSAL, not owner-locked."** Only its § 0 bullets are owner decisions. The Handoff already dockets the Ltd conflict at line 406. | certain | **Correction wins, narrowly.** Downgraded from "two competing architectures" to "one synthesis vs one proposal, conflict already docketed." **But the red team's HALT instinct survives** — § 0's Live-Wall/Thank-You free decisions *do* contradict live prod prices `[MEASURED]`, which is why that is **owner decision #1**. |
| **18** | Red team: "BOTH name ₱1,499 for DIFFERENT products (Buong Araw vs Walang Hanggan)" | Same commercial move, two Filipino names. The only real difference is the fence — pool-metered vs truly unlimited. | likely | **Correction wins.** **Chair kills the second name: the SKU is `PAPIC_GUEST`, the product is *Papic Buong Araw*, and "Walang Hanggan" is retired as a naming candidate** — it is also a permanence word, which is exactly what we just banned. |
| **19** | Cross-exam of the funnel lens: "`papic_guest` is reachable from exactly three picks — dessert, food_cart, food_truck" | **The correction was itself wrong.** Chair's grep finds **nine**: `cake`, `stations` (`:1175`), `photo_video` (`:1183`), `photo_booth`, `coffee`, `mocktail` (`:1189`), `dessert`, `food_cart`, `food_truck` (`:1190`) `[VERIFIED-CODE]`. | — | **Chair overrules the cross-exam.** The substantive point survives: reach is still **pick-conditional**, and `REC_PRIORITY:1200` still ranks it 8th behind a dead SKU. Fix the mapping first, then the order (D6). |
| **20** | Price lens: Kwento's live price is ₱500 (last migration), so read prod before rendering it | Prod: **`KWENTO` = ₱299 `[MEASURED]`.** `Pricing.md § 00` was right; the migration-derived figure was stale. Same for the render-menu sum: **≈₱4,097 at prod prices, not ₱7,596.** | certain | **Correction wins.** The lens demanded a prod SELECT before rendering one price and then published four prices from a document without doing the same. |
| **21** | Price lens / open question: "Setnayan AI ₱1,499 or ₱499 — unresolvable from the repo" | Prod: **`SETNAYAN_AI` = ₱1,499, `is_active=true` `[MEASURED]`.** `Pricing.md:23` is right; **`CLAUDE.md`'s auto-loaded primer (₱499) is the stale artefact** — and it is what every future session reads first. | certain | **Resolved by measurement.** Corpus fix in wave 0. This is the single mechanism by which retired prices keep re-entering public copy. |
| **22** | Price lens: "per-type pricing is structurally impossible without SKU proliferation" | Overstated. The same table already carries an additive per-dimension pricing mechanism (the pax columns, `computePaxPriceCentavos`), and `papic_tier_config` is a second precedent for a side table driving price. | likely | **Correction wins.** Flat ₱1,499 across opened types remains the right V1 call **for simplicity**, not because the schema forbids anything. Do not tell the owner it is forced. |

---

## § 12 — Dissents (preserved verbatim, because they may be right)

**D1 — On the hero claim (competitive lens, against the corpus).**
> *"The corpus ranks expiry as the hero fact — 'the single most durable competitive wedge', 'the most defensible thing in our compare row'. It is the most durable and the LEAST legible. A couple eight months from their date cannot feel a loss scheduled for day 30; the message converts after the event, not before it."*

Adopted (§ 3.3), but preserved because the corpus position may be right for a *different* buyer: the couple whose photographer already burned them. Watch which line the first ten conversions cite.

**D2 — On the free tier as a weapon (chair's own dissent from § 4.5).**
> *Free is 3 × 20 = 60 captures for a whole wedding day. Kuha's free trial is 200 photos. If the website leads with free-as-weapon at the shipped configuration, the first couple who tries it hits the fail-CLOSED 409 mid-reception and the free tier becomes the anti-testimonial.*

The recommendation is to fight on *what you get*, not *how many*. That may simply be losing gracefully. If the free rung is the top of the funnel and it is 30% of a rival's trial, the funnel is 30% as wide.

**D3 — On coherence itself (red team).**
> *"THE BIGGEST RISK IS THAT THIS COUNCIL PRODUCES A COHERENT PLAN. Six lenses each reading a different subset of an internally contradictory corpus will synthesise into something that reads confident and specifies two products under one price. Coherence of prose is not coherence of plan."*

Preserved as written, and it is directed at **this document**. The chair's answer is § 11 and the tag on every number — but the reader should treat that as a mitigation, not a refutation.

**D4 — On the photographers page (competitive lens, against its own recommendation).**
> *"The photographers page could cannibalize rather than defend: telling a studio 'you keep the client' invites them to keep the client OFF Setnayan too. The page must make the workspace, not the margin, the reason to stay."*

**D5 — On the whole exercise (red team).**
> *"A full website rebuild consumes the solo operator's entire capacity for weeks and every shipped claim adds a permanent Saturday-night obligation. The plan should be scored on obligations created, not pages produced."*

**Chair's tally against that standard:** wave 0 creates **zero** new obligations — every item is a deletion, a deactivation or a correction. Wave 1 creates one: a flat pass must work for every guest on the list. Wave 2 creates one: three cameras must actually provision. Wave 3 creates one: a credited-gallery promise to a photographer. **The forbidden list in § 6.3 exists precisely to stop the plan creating a fifth.**

---

## § 13 — What to measure, and the kill criteria for THIS plan

### 13.1 — Instrument these, in this order

| # | Metric | Where | Baseline today |
|---|---|---|---|
| 1 | `/pricing` sessions per week | posthog-js, browser SDK | **unmeasured** — no session volume exists anywhere in the corpus. Measure this *first*; every decision rule below is meaningless without it. |
| 2 | Papic block impressions ÷ `/pricing` sessions | `pricing/page.tsx` | 0 |
| 3 | Buong Araw card clicks ÷ Papic block impressions | `pricing/page.tsx` + Studio | 0 |
| 4 | Buong Araw **orders** ÷ events created, after wave 1 | prod `orders` | `PAPIC_GUEST` = **1, all time** `[MEASURED]` |
| 5 | Free-camera **provisioning** rate (events with ≥1 `PAPIC_CAMERA_FREE` seat) | prod `paparazzi_seats` | **0 rows, ever** `[MEASURED]` |
| 6 | Face **enrolments** per event with Papic active | prod `guest_face_enrollments` | **0 rows, ever** `[MEASURED]` |
| 7 | `/papic` organic entries and its bounce to `/pricing` | analytics | unmeasured |
| 8 | Drive-connect rate (load-bearing if Alaala Keep goes sync-first) | prod `oauth_grants` | unmeasured |

**Metrics 5 and 6 are gates on copy, not just dashboards.** No campaign points traffic at "three cameras free" until 5 is non-zero on a real event. No campaign leads with face-sorted delivery until 6 is non-zero and one end-to-end match is observed.

### 13.2 — Kill criteria for this plan

Trip any of these and the plan is re-argued, not patched.

1. **The DPO rules the retention period is under 12 months.** The ₱1,499 premium over the ₱999 modal price loses its strongest leg. Re-argue the price, not just the copy.
2. **Kuha unbundles Digital Invitation / RSVP / Seat Finder down to their ₱999 ELITE tier.** The entire basket argument for ₱1,499 closes overnight, because their ₱999 would then carry the things we lead with as free. **This costs Kuha nothing to build** — it is faster and likelier than photoshare adding permanent storage. *Monitor their pricing DOM, not their headline.*
3. **Buong Araw attach stays at zero across 25+ new events after wave 1 shipped alone.** At n=25 the observation is finally readable. Zero at ₱1,499 with a live doorway on the roster surface means the product is unwanted, not undiscovered — and the answer is not another price.
4. **Free-camera provisioning is still zero 30 days after wave 1.** The funnel's top rung does not execute; every "free" claim on the site is a fake door and must come down that week.
5. **Face enrolment is still zero 60 days after wave 2.** The hero claim on `/papic` is unearned. Demote it to a support line and promote video clips.
6. **A guest, a couple or the NPC quotes one of our own permanence strings back at us.** Wave 0 failed to find them all. Re-run the mechanical grep, widen the CI guard, and treat the file list as untrustworthy by default.
7. **Median photo lands above 7 MB.** The event-scoped pool economics that make a flat ₱1,499 pass survivable break, and the price moves to ₱1,999. **Nobody has measured this** — it is the highest-priority unmeasured input in the plan.
8. **`/pricing` sessions come in below ~250/week.** Then the "unauthenticated page is the only surface with sample" premise is false too, the demand test cannot run in useful time, and the honest posture is: ship the corrections, ship the flat pass, and stop pretending anything here is measurable at current scale.

---

### Closing note for a fresh session

Start at § 2. Every item there is verified against `origin/main @ b46e67218` and prod on 2026-07-20 and can be actioned without reading anything else. **Wave 0 needs no owner, no DPO and no engineering decision — it is ten deletions and three DB writes**, and it is the difference between a site that is merely under-merchandised and one that is publishing things that are not true.

The rest waits on § 9 and § 10.