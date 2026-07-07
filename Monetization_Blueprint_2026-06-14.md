> **🔴 SETNAYAN AI PRICE SUPERSEDED 2026-07-02 (owner-locked): ₱499 first 28-day cycle (intro) → ₱799/28-day cycle.** Single tier, unlock-all, event-anchored. Every ₱3,999 / ₱1,499 *Setnayan AI planner* figure below is RETIRED — the ₱499/28d that was the working price is now the first-cycle intro (non-AI SKU prices unaffected). Canonical: `Pricing.md` §00.A + DECISION_LOG 2026-07-02 + [[project_setnayan_pricing_tiers]].

# Setnayan Monetization Blueprint (2026-06-14)
### "Plan the whole wedding free; pay only for the decision and the memory"

> Strategy deliverable (senior monetization workshop — 5 lenses → CFO critique → synthesis). **Amounts are PROVISIONAL recommendations for the holistic pricing pass** (`Pricing_Collection_2026-06-14.md`), not a final lock. Pairs with the structural map in `Free_Pro_Tiering_2026-06-14.md`.

## The big idea
Give away the one thing no PH competitor gives — a **free place to actually BUILD and RUN the whole wedding** (every planning tool genuinely usable, *capped not crippled*, + free funnels for the light experiences) — then monetize the **two emotionally non-negotiable moments**:
1. **"Who do I hire?"** → the paid ranked **AI match** (the first paywall).
2. **"How will we remember this?"** → the produced-media moat (song, film, livestream, animated artifacts).

Sell almost everything as **per-event ONE-TIME unlocks** (GCash-native, "sulit", no subscription dread). Consumer subscriptions are avoided entirely (a wedding is a one-time event → monthly billing churns the week after and reads as predatory). **Subscriptions stay vendor-side only.**

**Why free is safe AND smart:** marginal cost = R2 storage only, so the whole free cockpit runs at ~₱0 — a couple sits free 12–18 months at near-zero cost *while their wedding date sells for us*. And every free couple drags **100–250 guests** onto branded surfaces (RSVP page, QR, seat-finder, Papic gallery) = **₱0-CAC viral loop**. Free is the hook *and* the moat.

## The free magnet (what's free)
- **The full working cockpit** — Guest List · Seat Plan (free *forever*) · Budget · Timeline · Mood Board · **Basic Website** (1 template, subdomain, branded QR) · **free RSVP up to ~150 guests** + day-of QR check-in.
- **Free marketplace** — browse · **compare (manual add-to-compare)** · book at **0% commission**.
- **The killer pull — a free "Match Preview":** after the couple enters date + budget + pax + venue + religion, show **"37 vendors fit your date, budget & pax"** + a **blurred ranked top-3 with %-fit scores.** The count + blur are free (proves value exists); the **unblur + contact is the first paywall.**
- **Free funnels (capped):** Papic shared gallery (~300 photos / 60–90-day retention / no auto-tag) · simple static Monogram · 1 Save-the-Date template · basic Live Photo Wall.

## The price ladder (provisional ₱)
| Item | Price | Type |
|---|---|---|
| **Setnayan AI — ranked match (HEADLINE / first paywall)** | **₱3,999** | one-time |
| Custom QR per Guest | ₱999 | one-time |
| Animated Monogram | ₱1,999 | one-time |
| Event Website Pro | ₱1,999 | one-time |
| Papic 5 Seats / Guest | ₱2,999 (+₱350/50 pax) | one-time |
| RSVP Pro | ₱4,499 | one-time |
| Pakanta | ₱2,499 / ₱3,999 / ₱9,999 | one-time |
| Panood livestream | ₱2,499/day | per-day |
| Thank-You Video | ₱3,499 | one-time |
| SDE (Same Day Edit) | ₱4,999 | one-time |
| Editorial Website | **₱5,999** *(drop from ₱7,999)* | one-time |
| Live Background · PhotoWall | ₱2,499 each | one-time |
| Patiktok · Camera Bridge | ₱1,499 each | one-time |
| **Setnayan Pro** (one-tap: AI + Website Pro + RSVP Pro + Monogram + unlimited Papic + QR Pro + collab seats) | **₱4,999** | one-time |
| **Essentials bundle** | ₱12,999 (~₱22,492 SRP, ~42% off) | one-time |
| **Complete bundle** | ₱27,999 (~₱110,000 basket) | one-time |
| *Vendor-side (only subscriptions):* Pro ₱6,000/28d · Enterprise ₱10,000/28d · tokens flat ₱100 · 0% commission | | recurring |

**The headline number is ₱3,999** (the AI match) — ~1% of a ₱400k wedding vs a ₱25,000+ human coordinator → an unmissable "sulit" yes. **Launch with a ₱1,999-vs-₱3,999 A/B** (it's the single most important price).

**Setnayan Pro at ₱4,999** is the quiet genius: *"you're paying ₱3,999 for the match anyway — for ₱1,000 more get RSVP Pro + Website Pro + Monogram + unlimited storage too."* A near-automatic yes that lifts ARPU.

## The irresistible triggers (moment-of-need, not feature gates)
1. **Match-Preview wall** (#1): "37 fit · blurred top-3" → unblur = ₱3,999, fired the instant onboarding completes.
2. **Last-minute rescue** (sharpest): in the last-minute window, free search returns **zero** available vendors; only AI surfaces last-minute-available ones. A real problem, ~100% margin.
3. **Guest-cap wall**: "Add guest #151" on *their* list → unlock unlimited + RSVP Pro.
4. **90-day gallery expiry** (loss-aversion): "Photos delete in 27 days — keep them forever" + fills past the cap mid-reception.
5. **Watermark itch**: free site/gallery/monogram carry "Powered by Setnayan" → pay ₱1,999 to remove (it's the ad *and* the upsell).
6. **Invite-send QR impulse** (₱999), **OFW-family → Panood** (₱2,499/day, "let lola abroad watch"), **first-dance → Pakanta**, **post-wedding → SDE** ("1,400 photos → a 3-min film, ₱4,999 vs ₱30k crew").
7. **Bundle nudge** ("add 4 more, pay ₱12,999 not ₱18,400") + **sunk-cost Pro ladder** ("you've spent ₱1,999 toward the ₱4,999 Pro pass").

## ⚠ CRITICAL — live revenue bugs to fix BEFORE launch (the workshop caught these)
1. **The cash register isn't plugged in.** `SETNAYAN_AI_PAYWALL_ENABLED` ships **default OFF** and repo still says ₱1,499 → the **headline ₱3,999 paywall may not be charging at all.** Flip the flag + verify checkout `service_key` ↔ entitlement gate.
2. **RSVP three-way SKU collision is LIVE** — DB has RSVP_PRO_WEBSITE ₱4,499 + PRO_RSVP ₱1,999 both active + RSVP_WEBSITE ₱2,499 inactive + a reader-key mismatch → **couples see contradictory RSVP prices at checkout.** Resolve to: base RSVP free-capped + one RSVP Pro at ₱4,499; retire the others; fix the reader key.
3. **Price-fragmentation leaks** (DB vs hardcode): Animated Monogram ₱1,999 vs ₱2,499 · Custom QR ₱999 vs ₱1,499 · Thank-You ₱3,499 vs ₱5,499. Unify each to DB canon.
4. **Bundle "save" must reconcile** — republish Essentials SRP with the corrected parts (~₱22,492 → ~42% off) or the savings claim collapses (trust-killer in a sulit market).
5. **Editorial Website is the only SKU above market** (₱7,999 > ₱6,999) → pull to **₱5,999**.
6. **Free-pillar bait-and-switch debt** — the 2026-06-07 "thin free tier" copy is live; the 2026-06-14 generous-free-cockpit directive reverses it → reposition cleanly ("create + run your whole wedding free") across homepage, /pricing, llms.txt, Offer JSON-LD, help.

## The number that governs everything
**Free→paid conversion ≥ 12–15%** of activated free couples buying at least the ₱3,999 AI match within 90 days. Secondary: **ARPU ₱6,000–₱8,000**/paying event · **attach ≥35%** of AI buyers adding ≥1 downstream SKU · **≥100 branded guest impressions/free event** with ≥2% of guests starting their own event (the ₱0-CAC virality KPI) · **≥90% blended margin** (Papic the only sub-90%, protected by pax-scaling).

> **Packaging model:** à-la-carte-LED + one optional Setnayan Pro pass + two bundles. Per-unit-COGS productions (Pakanta/Panood/SDE/Live Background) stay à-la-carte at margin — never folded into Pro — so Pro keeps ~98–99% margin. All customer items ONE-TIME, per-event, wedding-anchored (through wedding day + ~60 days).
