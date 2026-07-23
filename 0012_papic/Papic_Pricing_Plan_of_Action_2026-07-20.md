# Papic — Pricing Plan of Action (2026-07-20)

> **Companion to** [`../Papic_Competitive_Pricing_Research_2026-07-20.md`](../Papic_Competitive_Pricing_Research_2026-07-20.md) — read that first for the competitive landscape, verified economics, and the four spec-vs-code drifts.
>
> **Status: PROPOSAL, not owner-locked.** Produced by a 6-seat council (34 agents: 6 designs × 4 judge lenses, 3-way red team, synthesis). Three items in §6 require the owner to reverse an earlier lock. §8 is the decision list.
>
> **Provenance:** the pricing half of the 2026-07-17 good/better/best ladder would be superseded if adopted. The capture-points machinery from PR #3407 survives untouched.

---

## 0. Owner decisions this is built on (2026-07-20)

1. **BUILD** the interactive photo game / scavenger hunt.
2. **Live Photo Wall → FREE** (was ₱2,500/day).
3. **Thank You Video → FREE** (was ₱2,500 — Papic's only paid add-on).
4. Out-spec Kuha's caps (they stop at 5,000 photos / 100 clips / 12 months).

**Consequence:** with those plus face-sort, per-guest delivery, reels, Kwento, Pabati, Guest Stories, face-block and custom QR all free, **only two things retain real marginal cost** — capture volume and full-resolution storage. Both are exactly what Kuha meters. The council's job was to find a paid surface that isn't a price fight.

---

## 1. The decision in one paragraph

Every event-day feature is now free, so **stop selling event-day features.** Papic charges for three things in descending order of defensibility: **(1) SCALE** — unlimited capture, a number Kuha cannot quote; **(2) RETENTION + IDENTITY** — full-res originals kept *person-addressable by the face graph* for 3 years, which no PH competitor has any mechanism for; **(3) COMPUTE** — server-rendered graded films, which Kuha cannot sell at any price because they have no renderer. Bytes are Kuha's home field (their storage expires, so they can undercut our floor and still profit). **Compute is ours alone.** The free tier becomes the acquisition weapon; nothing a guest touches is ever priced.

---

## 2. The free tier — Papic Libre · ₱0 · permanent · no card, no trial clock

- **5 camera seats × 200 capture points/day = 1,000 points/day.** (Today: 3 × 20 = 60 — a **16.7× raise**.) 1 photo = 1 pt, 1 five-second clip = 3 pts.
  → **Constants-and-seed change only.** The points RPCs, the fail-CLOSED reserve and the 409 `camera_points_exhausted` contract from PR #3407 are untouched.
- **Every feature, uncapped:** face auto-sort · per-guest delivery · personal reels (client-rendered, **no watermark ever**) · Live Photo Wall · Thank You Video · Kwento · **Pabati uncapped** (Kuha stops at 100) · Guest Stories · **the photo scavenger hunt** · per-guest custom QR · face-block · non-disableable NSFW filter.
- Plus the free platform: event website · unlimited RSVP · guest list · seating chart + 3D plan · budget ledger · mood board · couple↔vendor chat · run-of-show · Save-the-Date film.
- **Compressed gallery (AVIF long-edge 1280) kept INDEFINITELY at every tier. No expiry, ever.**
- **Full-res originals: 90 days** (code wins over the stale 6-month spec claim), pushed free to the couple's Google Drive as a permanent copy, **and every guest keeps a free full-resolution ZIP of their own face-sorted set** (shipped, owner-locked 2026-07-16 — stays free forever).
- **Full-res video is already perpetual and free** — clips are excluded from the drop sweep because a clip's object *is* the playable file. Do not re-sell it.

**Why 1,000 and not 60:** Kuha's *trial* is 200 photos. A 60-capture permanent free tier is smaller than a competitor's trial, and free is now carrying the entire competitive argument.

---

## 3. The pricing table

Margin rule applied throughout: **sticker ≥ all-in cost × 4.71.** Base all-in per paid event ₱97.94 (incl. ₱7.50 manual reconciliation). Full-res storage at ₱11.49/GB-yr (**not** the ₱6.05 blend — tiering isn't built). Display AVIF ₱0.02/capture capitalised 10 yr. Renders ₱6 (60s) / ₱18 (3-min) / ₱25 (15-min) / ₱2.50 (guest film).

### Consumer plane

| Rung | Price | Includes | Cost | Floor | Net | Who buys |
|---|---|---|---|---|---|---|
| **Papic Libre** | **₱0** | §2 — the whole product | ₱24 | — | funnel | Everyone |
| **Papic Walang Hanggan** (Unlimited) | **₱1,499** /event | Unlimited cameras · unlimited captures · the meter disappears. Full-res 90 days unchanged. | ₱240.92 | ₱1,135 | 74.9% | >150 pax, or running the game hard. **The anti-LUXXE rung.** |
| **Alaala Master** | **₱2,999** /event | Full-res originals kept **3 years, 10 GB** · one-click event ZIP · **per-person full-res download addressed by the face graph** · identity index preserved · annual integrity re-download. Overflow +₱1,499/10 GB. | ₱442.64 | ₱2,085 | 79.6% | The ~1-in-30 heirloom couple. **This is the existing `HIGH_RES_ARCHIVE` SKU repriced — not a new build.** |
| **Alaala Balikan** (re-open) | **₱499** | Re-opens a lapsed event's originals for 30 days. Buyable any time within 3 years. Does not extend the vault. | ₱30.50 | ₱144 | 88.3% | Monetises regret humanely. |
| **Isang Pelikula** | **₱499** | ONE server-rendered 60s film, graded to the couple's own mood-board palette, scored from the owned catalogue. Pure compute, **zero storage tail.** | ₱30.50 | ₱144 | 88.3% | The ₱499–₱999 shopper Kuha owns by default. ⚠ Needs render farm. |
| **Alaala Editorial** | **₱3,499** | Master + 120-image auto-culled editorial graded to the mood-board LUT + 60s Highlight + 3-min Story film + print masters **4R / 5R / 8R only**. | ₱490.64 | ₱2,311 | 79.9% | Couples with a cheap photographer or none. ⚠ Needs render farm. |
| **Alaala Cinema** | **₱4,999** | Editorial + 8–15 min Ceremony Film + Pabati Guestbook Film + 3 style re-renders. | ₱602.64 | ₱2,838 | 79.3% | The whole-thing couple. ⚠ Needs render farm. |
| **Personal Films for Guests** | **free to 30 guests · +₱999/50** | 30-second graded personal film auto-made per RSVP'd guest, emailed. Free tier is the distribution engine. | ₱132.50/pack | ₱624 | 86.7% | ⚠ Needs render farm **and** the "not me" control. |
| **Alaala Re-cut** | **₱499**, unlimited repurchase | Re-manufacture any owned film in a different template, LUT, aspect or song. Editorial+ only. | ₱30.50 | ₱144 | 88.3% | Anniversary buyers, year 2+. |

**Consumer ceiling ₱4,999. Above ₱1,999 we never sell more photos — we sell manufactured goods.** That rule is load-bearing; break it and we're fighting Kuha on Kuha's page.

### Channel plane — prepaid, the only shape a manual rail is good at

| Rung | Price | Includes | Floor | Who buys |
|---|---|---|---|---|
| **Papic Kasangga** | ₱0 incremental (rides Solo ₱999 / Pro ₱2,499 / Enterprise ₱7,999 per 28d) | 1 / 2 / 4 Pro Event Licences per cycle. No new checkout. | — | Every subscribed vendor. Its job is churn, not revenue. |
| **Pro Event Licence** | **₱1,999** /event | Unlimited capture · **vendor white-label** on gallery, QR cards, photo wall, reel end-card · full-res 12 months + ZIP + written commercial/portfolio licence · unlimited staff seats · saved setup template. | ₱1,530 | The pro on a ₱60k–₱150k package. His comparison is a ₱13,500 booth, not Kuha. |
| **Pro 5-pack** | **₱8,999** (₱1,800 ea) | 5 licences, 18-month use-by. | ₱7,474 | Solo pro, 3–5 weddings/quarter. |
| **Pro 20-pack** | **₱32,999** (₱1,650 ea) | 20 licences, 24-month use-by, co-branded QR artwork. | ₱29,894 | Studios, 30–60 events/yr. |
| **Venue Lite** | **₱59,999/yr · 25 events** | Every event at the address under the venue's brand. ₱1,999/event beyond. | ₱37,368 | Garden venues, mid hotels. |
| **Venue House** | **₱149,999/yr · 75 events** | + signage pack, venue analytics, banquet-crew seats. | ₱112,088 | Hotels, ballrooms, sports complexes. |

**Published channel floor ₱1,650/event — never discount below it.** True margin floor is ₱1,530; the gap absorbs founder sales time. Both venue rungs carry ≥₱30k headroom to absorb ~1 day of human selling without breaking the rule.

> **Standing rule: no Papic SKU below ₱150 on the manual rail.** ₱7.50 reconciliation × 4.71 = a ₱36.50 floor before a single byte. This kills the shipped ₱30 camera.

---

## 4. The Kuha answer

Above the fold, no table:

> **"Kuha's most popular plan is ₱1,999 and deletes your album after twelve months. Ours is ₱0 and never deletes anything — and the digital invitation, seat finder and video guestbook they only unlock at ₱1,999 are free on Setnayan at every tier, uncapped."**

Second line for the scroller:

> **"If you want the meter gone entirely, that's ₱1,499 — still less than their ₱1,999, and unlimited instead of 5,000. Above that we don't sell more photos; we sell films, and they don't make films."**

The literal answer to *"why should I pay more than ₱1,999?"* is **you don't.** Entry is ₱0, the anti-LUXXE rung is ₱1,499, and everything above ₱2,999 is an object Kuha cannot quote at any price.

**Concede and fix, don't spin:** Kuha activates in ~60 seconds; we take up to 24 hours. That's why **every consumer rung is a planning-phase or post-event purchase** and no rung is ever needed mid-reception.

**Operating rule (from the earlier artifact work): never quote a Papic price first. Quote ₱0, then name the artifacts.**

---

## 5. Revenue — honest

**Blended ₱606 per wedding at maturity (~18 months), all weddings in the denominator.**

| Line | Attach | Per wedding |
|---|---|---|
| Papic Unlimited ₱1,499 | 9% | ₱134.91 |
| Alaala Master ₱2,999 | 3% | ₱89.97 |
| Isang Pelikula ₱499 | 6% | ₱29.94 |
| Alaala Editorial ₱3,499 | 1.8% | ₱62.98 |
| Alaala Cinema ₱4,999 | 0.6% | ₱29.99 |
| Guest-film pack ₱999 | 2% | ₱19.98 |
| Re-cut ₱499 | 0.6% | ₱2.99 |
| **Consumer subtotal** | | **₱370.76** |
| Vendor Pro licence (10% vendor-attached, blended ₱1,750) | 10% | ₱175.00 |
| Venue-licensed weddings (₱1,999 effective) | 3% | ₱59.97 |
| **Channel subtotal** | | **₱234.97** |
| **TOTAL** | | **₱605.73** |

**Attach rates are assumptions, deliberately set 3–4× below the council's optimistic case.** Median consumer freemium conversion is 2–5%; a 22% blended attach would put Papic in the top 1% of freemium products ever measured, on its first paid surface, against a 24-hour checkout. The photographer-album comp (20–30%) is a category error — that's measured on a client who already paid ₱15k–40k and is asked face-to-face.

- **Halve every attach rate → ₱302.87/wedding.** Margin is unaffected (near-zero cost base); the business is simply half the size. **This design fails slowly and cheaply — it can never lose money, only fail to make enough.**
- **FY1, before the render farm and before an automated rail: ₱312/wedding.** Plan capacity on this, not ₱606.
- **Portfolio net:** ₱606 − ₱53.03 (8% flat + 0.75% LGU) − ₱64 cost = **₱489, 80.7% net.** Clears the 70% floor with ₱65 headroom.
- **Instrument first:** *Unlimited at 9%* — it's 22% of the total and the only rung purchasable in the planning phase, when the budget is open.

**₱3M tripwire:** at ₱606/wedding Papic alone crosses at ~4,950 weddings/yr — but ₱3M is **combined** gross on the ICASA sole-prop COR and **the vendor line gets there first** (100 Pro vendors at ₱2,499/28d = ₱3.25M/yr alone). Post-crossing the net ceiling is **61.75% of gross at zero cost**, a pure function of the tax stack — **no repricing moves it.** "+15% across every rung" is arithmetically dead. The only real answers are entity restructuring or accepting ~50–55% net, and the decision runs on the *vendor* line's calendar. One unclaimed offset: at VAT registration the 12% on Cloudflare becomes creditable, pulling storage ₱11.49 → ₱10.26/GB-yr (−11%).

---

## 6. Blockers, verified against the code

### 6.1 ⚠️ TWO LIVE DATA-LOSS BUGS — fix before any repricing

**(a) A couple can pay to keep their originals and have them deleted anyway.** ✅ Verified:
- `lib/papic-fullres-drop.ts:35` — `dropEnabled()` returns `true` unless `PAPIC_FULLRES_DROP_ENABLED === 'false'`. **ON by default.**
- `lib/entitlements.ts:46` — `ACTIVE_STATUSES = new Set(['paid','fulfilled'])`. An order in `submitted` / `awaiting_payment` **does not protect anything.**
- The rail takes 24 hours; the sweep is weekly.
→ A couple who buys Keep Full-Res on day 89 has an unreconciled order when the sweep fires. **A `submitted`/`awaiting_payment` order must pause the delete.**

*Mitigating nuance (from the code comment): prod currently holds only excluded sample photos, so nothing is drop-eligible yet — real couple photos age into the 90-day window over time. **This is a time bomb, not an active fire.** Fix it before the first cohort matures.*

**(b) The drop has no guard requiring a confirmed Drive copy.** Where the OAuth grant was never given or quota was exceeded, originals genuinely die. Gate the drop on a verified `drive_copy_artifacts` row.

### 6.2 The four blockers and what each actually costs

| Blocker | Blocks | Real cost |
|---|---|---|
| **Manual payment rail (24-hr SLA)** | Any SKU <₱150 · mid-event purchase · guest-side checkout | ⚠️ The council reports an automated Maya branch already exists behind `NEXT_PUBLIC_MAYA_STATUS === 'APPROVED'`, gated on merchant KYC — a form and a wait, zero engineering. **UNVERIFIED — confirm before planning on it.** |
| **Missing "not me / remove tag" control** | Personal guest films · scaling face-sort to 300 pax | ~1 week of code + **4–8 weeks of DPO/counsel calendar.** This, not the render farm, is the long pole on guest films. |
| **Face models on rate-limited `r2.dev`** | **The free tier itself, at any packed wedding** | **~1 day.** Custom domain on the model bucket. Week 1 — face-sort is live in production *now* and the whole funnel is downstream of it. |
| **Render farm does not exist** | Isang Pelikula · Editorial · Cinema · guest films · Re-cut | ✅ Verified: `app/api/internal/patiktok/process-job/route.ts:28` writes `please-replace-with-real-output.mp4` with `TODO(0017-phase2)` markers; `CONNECTION_MATRIX.md:163` documents it as *"would 'complete' with no output if ever enqueued."* **Realistic: 9–12 months to Editorial at solo throughput, +6–8 weeks for guest-film fan-out.** ⚠ Note this is the *server* renderer; the **client-side** `lib/reel-render.ts` works and is what powers free personal reels. |

### 6.3 What survives and what re-slices

**PR #3407 SURVIVES — pricing half only is retired.** Kept and untouched: the capture-points RPCs on both seams · the 409 `camera_points_exhausted` contract · the fail-CLOSED reserve · the free `tier='free'` seats at idx 100..102 · `papic_tier_config` as the single source of every capacity claim. Retired: the per-camera Mini/Ltd/Unli SKU layer and the ₱6k/₱10k/₱15k caps, replaced by one ₱1,499 event SKU. Free-tier change is `points_per_day` 20→200 and seats 3→5 plus a seed backfill.

> **Never ship the free-tier change in the same window as anything else.** A bug on a fail-CLOSED path stops capture at a live wedding and there is no re-shoot.

**Brief-PRs 4–12 re-slice, and one is cancelled.** **PR-5's `HIGH_RES_ARCHIVE` deactivation half must be CANCELLED** — we're keeping and repricing that SKU as the entire Master rung, and it's still queued rather than shipped, so the reversal is free today and expensive next month. PR-5's retention change (90→180) is also cancelled: 90 days stands, made honest by the free Drive copy and the free per-guest ZIP.

---

## 7. What to kill — named

**Retire immediately:**
- **Mini ₱30 / Ltd ₱50 / Unli ₱100 per-camera SKUs.** ₱30 against ₱7.75 all-in is 3.87× — below the 4.71× floor. Killed by ₱7.50 of reconciliation labour, not storage. **Grandfather every existing buyer permanently** (convert a legacy Unli to a full ₱1,499 Unlimited grant on that event).
- **The ₱6,000 / ₱10,000 / ₱15,000 per-event caps.** Nothing left to cap.
- **`PAPIC_UNLOCK` ₱15,000 and `PAPIC_UNLOCK_LTD` ₱9,000 bundles.** Two of their six granted children are now free anyway.
- **Thank You Video ₱2,500** — freed by owner decision.
- **Live Photo Wall ₱2,500/day** — freed by owner decision.
- **`HIGH_RES_ARCHIVE` at ₱999/yr per 50 GB** → repriced to **₱2,999 flat, per event, 10 GB, 3 years.** ⚠ The live catalog says ₱999/yr while `initialize-maya` books ₱2,999 — these disagree today and must be reconciled in the same PR.
- **"12 MP / A3 print" and "300 dpi 12×18" claims** anywhere in the corpus. Capture is 2560×1440 (~3.7 MP); 12×18 at 300 dpi needs 3600×5400. **Sell 4R / 5R / 8R and nothing larger** — this is a refund generator.
- **The "6-month full-res" spec claim.** Code says 90 days. Code wins. Reconcile before taking a peso of retention revenue.

**Never build:**
- **The physical photo book.** ₱1,650 of real COGS demands ₱7,771 of sticker under 8%-on-gross-with-no-deductions — and Editorial's own print masters let a couple self-print for ₱4,000, arbitraging a ₱9,500 premium the product itself created. **Take a print-partner referral fee (₱300–₱600/order, zero COGS, zero courier risk) instead.**
- **Papic Sarili / any guest-paid SKU.** Guests already get a free full-res ZIP of their own face-sorted set (shipped, owner-locked 2026-07-16). Charging for it is a claw-back of a free capability, aimed at a person's own face, on an unauthenticated forwardable URL, settled on a 24-hour rail — and it converts our best distributors into people we billed at their friend's wedding. **Permanently off the table.**
- **Any "remove the watermark" upsell.** There is no watermark on any output at any tier, ever.

---

## 8. Open questions — owner decides

1. **Free tier: 5 seats × 200 points/day = 1,000 capture points.** Confirm. *(Alternative on the table: unlimited free **photos** with the meter on video only — better marketing, but it re-cuts the shipped points RPCs on the fail-CLOSED capture path, ~2–3 engineering weeks plus a full re-verify.)* **1,000, or unlimited-photos?**
2. **`HIGH_RES_ARCHIVE` → ₱2,999 flat / 10 GB / 3 years, and cancel brief-PR-5's "deactivate SKU" half.** The catalog (₱999/yr per 50 GB) and `initialize-maya` (₱2,999) disagree; one number wins. **Confirm ₱2,999 and the PR-5 cancellation?**
3. **Retire the per-camera ₱30/₱50/₱100 ladder** — reverses the pricing half of a lock set 2026-07-17. Rule-based case: ₱30 clears only 3.87× against a mandated 4.71×. Existing buyers grandfathered. **Yes or no?**
4. **File the Maya merchant KYC this week** (⚠ verify the branch exists first). Zero engineering; unlocks sub-₱150 SKUs, mid-event purchase, and eventually removes ₱7.50 from every checkout's cost base. **Yes or no?**

---

## 9. The 90-day plan — solo operator

| Week | Ships | Notes |
|---|---|---|
| **1** | (a) Pending/awaiting-payment order pauses the full-res drop · (b) drop gated on a verified Drive-copy row · (c) face-model bucket onto a custom domain · (d) **file the Maya merchant KYC** | (a)+(b) are the data-loss bugs. (d) is zero engineering and the highest-leverage calendar item of the quarter. |
| **2** | Free tier → 5 seats × 200 pts/day. Constants + seed backfill. **Ships alone.** | Full re-verify of the capture path. Nothing else in this window. |
| **3** | `HIGH_RES_ARCHIVE` → **Alaala Master ₱2,999**, 10 GB / 3 yr. Reconcile the ₱999-vs-₱2,999 conflict. | No new build — retention exemption, drop sweep, warning email and ZIP route are all already in production. |
| **4** | **Papic Unlimited ₱1,499** as a per-event SKU on `eventSkuActive`. Retire Mini/Ltd/Unli + caps. Grandfather legacy buyers. | The one commercially load-bearing PR of the quarter. |
| **5** | Pricing page rewrite (the Kuha sentence above the fold) · per-occasion landing pages (wedding, debut, binyag, birthday) for AI discovery · **instrumentation on every buy surface** | Copy Kuha's *pattern*, not their content. |
| **6** | Start the **"not me / remove tag"** control (code) + open the DPO assessment in parallel | Calendar-bound, 4–8 weeks. Starting now unblocks guest films later. |
| **7–9** | **The photo scavenger hunt — free.** Missions, leaderboard, winner screen, per-event-type mission packs (wedding entourage · 18 Moments for debut · ninong/ninang for binyag). Cultural review by a Filipino reviewer before launch. | Earns ₱0 directly. It is the **capture pump** that turns 1,000 free points into an exhausted meter and a ₱1,499 purchase — and the only answer to Kuha's localisation lead. |
| **10** | `orders.expires_at` + the lapsed sweep wired for annual SKUs | Fixes the latent bug where every `/yr` SKU grants permanently. Prerequisite for every channel rung. |
| **11–12** | **Pro Event Licence ₱1,999** + 5-pack + 20-pack · white-label brand kit across gallery, QR cards, photo wall, reel end-card · **Kasangga** bundled free into Solo/Pro/Enterprise | Prepay is what makes the manual rail work: one reconciliation covers 20 events. |
| **13** | **Read the numbers and decide.** | See the kill criterion. |

**The kill criterion, set now, in writing:** if **Papic Unlimited attaches below 5%** and **Alaala Master below 1.5%** across the first 200 paid-eligible events, **the render farm is dead** and Papic is re-scoped as pure acquisition for the vendor subscription business. **Do not write a line of render-farm code before week 13.**

**Deliberately not in the 90 days:** the render farm · Editorial / Cinema / Isang Pelikula / Re-cut · guest films · venue licences · any physical good.

---

## 10. Council record

Six seats, ranked by 4-lens judge average (Kuha head-to-head · margin+tax · buildability · guest experience):

| Rank | Seat | Score | Modelled revenue/wedding |
|---|---|---|---|
| 1 | **Artifact ladder** — charge for rendered artifacts, never capture | 6.5 | ₱903 |
| 2 | **Event-type spread** — one named SKU per occasion | 6.125 | ₱1,338 |
| 3 | **Volume ladder** — meter quantity + the original only | 6.0 | ₱431 |
| — | Originals-preservation · guest-monetization · vendor-channel | lower | — |

**Grafts:** artifact ladder → the post-event paywall and the Editorial/Cinema/Re-cut rungs · volume ladder → Filipino tier names and the discipline that above ₱1,999 you change the noun, never sell more photos · event-type spread → the TIME/SCALE/RIGHTS framing and per-occasion pages · vendor channel → prepaid licences, and the finding that prepay is the only answer to the ₱7.50 reconciliation tax · originals-preservation → the ₱499 re-open door · guest-monetization → the ₱150 manual-rail floor, adopted as a standing rule.

**Red-team corrections applied in full:** all storage costed at the mandated ₱11.49/GB-yr (not the unbuilt ₱6.05 blend) · video bytes counted · the physical book killed · the guest-paid rung killed · Re-cut repriced ₱999→₱499 (at ₱999 nobody picks it beside Cinema's 3 included re-renders) · guest films unbundled from Cinema (₱6,999→₱4,999).

**The standout finding that did not win but should not be lost** (event-type spread): a **corporate/tournament SKU at ₱9,999 converts at ~55%** because the free tier is *functionally disqualified* for a corporate buyer — no logo, our badge visible, public wall, no export. That is a hard requirement gate, not an upsell. **One corporate event ≈ 4.1 blended weddings.** A wedding-only ladder leaves the highest-margin, zero-sentiment buyer entirely unserved. Worth its own pass.

---

## 11. Honest caveats

- **Every attach rate is modelled, not measured.** Setnayan has no shipped Papic revenue distribution. The ₱606 and the ₱312 FY1 figure are planning assumptions, not forecasts.
- **No council seat scored above 6.5/10.** This plan is a graft, not a clean winner.
- **The Maya branch is unverified** — the council asserts it exists behind `NEXT_PUBLIC_MAYA_STATUS`; confirm before planning the quarter on it.
- **The render-farm timeline (9–12 months) is an estimate** at solo-operator throughput, from a stub with months-old TODOs.
- Pull the real byte-per-event distribution from `papic-storage-telemetry.ts` before committing any ladder publicly — it turns every cost figure here from an estimate into a fact.
