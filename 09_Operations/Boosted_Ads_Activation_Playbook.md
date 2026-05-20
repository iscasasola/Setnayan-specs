# Boosted Ads Activation Playbook

**Locked 2026-05-19.** Companion to [0022 § 5b](../0022_vendor_dashboard/0022_vendor_dashboard.md) (Boosted Ads + Sponsored Boost spec) and the 2026-05-19 traffic-monetization decision-log row. **This is an owner-side playbook — no engineering changes required to execute.** Engineering work for Boosted Ads itself already landed via 0022 § 5b lock (2026-05-16).

> **⏸️ ACTIVATION DEFERRED 2026-05-19 (afternoon).** Outbound execution is paused until the verified-vendor pipeline is live in production. Specifically: this playbook is dormant until (a) 0006 vendor management ships verification queue + verification state machine in production, AND (b) at least one batch of vendors has completed verification with `verification_state = 'verified'` in the DB. Both prerequisites unlock the prospect-list SQL in Step 1 below. Owner directive: "Wait until verified-vendor pipeline is live" (per AskUserQuestion 2026-05-19 afternoon). Until then, do NOT send outbound DMs to pilot vendors as a real sales motion — pilot vendors haven't gone through verification, don't have the booking-volume signal, and selling to them now would burn a relationship without a real product to deliver. The 30-vendor launch promo (`BOOSTED-LAUNCH-2026` 20% off month 1 cap 30 redemptions) seed timing should align with this activation, not happen earlier. Featured-vendor lookbook (due 2026-06-15 per API checklist § 9.4) can proceed in parallel — it's not gated on verified vendors existing.

---

## Why this doc exists

Boosted Ads + Sponsored Boost are the highest-yield monetization surface Setnayan owns. A single 20km Boosted Ads vendor pays ₱14,999/week (~₱780K/year). A single Sponsored Boost Annual sale is ₱799,999/year. For comparison, the AdSense path being built in 0039 nets roughly ₱5–20K/month at 100K monthly pageviews — two orders of magnitude lower.

But this revenue does not materialize without **outbound sales motion**. The spec exists; the SKUs are seeded; the surface renders. Vendors will not self-discover their way into ₱4,999–₱14,999/wk placements without Setnayan reaching out. This playbook is the outbound script.

---

## The current state

- **Boosted Ads tier ladder (per 0022 § 5b · seeded in `0034 § service_catalog`):**
  - 5km radius — ₱4,999/wk
  - 10km radius — ₱7,999/wk
  - 20km radius — ₱14,999/wk
- **Sponsored Boost (verified-only, 30km radius):**
  - Quarterly — ₱249,999
  - Annual — ₱799,999
- All prices PHP centavos in `service_catalog`. Charm pricing convention applied 2026-05-17.
- Vendor purchase flow is shipped in 0022 (Phase 2 agent ships full marketplace + bookings; placement upsell modal already exists).

---

## The outbound playbook

### Step 1 — Build the prospect list

**Where prospects come from:**
- Verified vendors who have NOT yet bought a marketing tier — query in 0023 admin:
  ```
  SELECT vendor_id, business_name, primary_category, city, verification_state,
         monthly_booking_volume_centavos
  FROM vendors
  WHERE verification_state = 'verified'
    AND NOT EXISTS (
      SELECT 1 FROM vendor_marketing_subscriptions
      WHERE vendor_id = vendors.vendor_id
        AND status = 'active'
    )
  ORDER BY monthly_booking_volume_centavos DESC NULLS LAST
  LIMIT 50;
  ```
- Coming-soon vendors approaching the "3+ disputes/30d" auto-demote threshold (these tend to be high-volume vendors who need the trust signal of Boosted Ads to recover) — same query with `verification_state = 'coming_soon'`.
- Vendors mentioned in editorial articles (0038) — natural pairing for a Sponsored Content cross-sell into a Sponsored Boost subscription.

**Disqualify:**
- Vendors with <3 active bookings in the last 90 days (cannot service additional inbound)
- Vendors with active disputes >0 in the last 30 days (sell after dispute resolves)
- Vendors flagged for AMLC sanctions review

### Step 2 — Reach out via existing communication channel

Use 0019 Threads (in-app chat) for the initial outreach — vendors check that more reliably than email + the conversation is logged for audit. Template:

```
Hi [Vendor name],

This is [Owner name] from Setnayan. Quick note — your bookings are
trending up [or: your profile views are strong] and you're not yet on
a marketing tier.

A few couples in [their city] are searching your category but going to
other vendors because they don't see your profile in the
"Recommended" slots. We have 3 ways to fix that:

  · 5km Boosted Ads — ₱4,999/wk (top of marketplace within 5km)
  · 10km Boosted Ads — ₱7,999/wk (reaches ~3x more couples)
  · 20km Boosted Ads — ₱14,999/wk (full Manila / your metro region)

Verified-only — Sponsored Boost (₱249,999/qtr or ₱799,999/yr) pins
you to a 30km radius PLUS gives you a "Sponsored" tier badge that
couples have started searching for explicitly.

Want me to walk you through which tier fits your booking pipeline?

— [Owner name], Setnayan
```

### Step 3 — Discovery call (15 min, Google Meet — 0019 video meetings are retired)

Three questions:
1. How many booked weddings do you have in the next 12 months?
2. What's your typical client acquisition path today? (Wedding shows / Facebook / referral / etc.)
3. What's your geographic service area?

Map answers to a tier recommendation:

| Bookings + acquisition | Recommended tier |
|---|---|
| <8 bookings/yr · referral-dominant | **5km Boosted Ads** — keep low risk, prove the channel |
| 8–20 bookings/yr · mixed acquisition | **10km Boosted Ads** — expansion test at modest cost |
| 20+ bookings/yr · already digital-led | **20km Boosted Ads** OR **Sponsored Boost Quarterly** — full metro coverage |
| Premium category (planner, top-end photographer) · 40+ bookings/yr | **Sponsored Boost Annual** — anchor + lock the prime slot for 12 months |

### Step 4 — Handle the four common objections

**"₱14,999/wk is too much."**
→ Reframe: "That's ₱60K/month. One booking at the average ₱120K wedding-photography ticket pays for two months. What's your conversion on couples who see you at the top of search vs. couples who scroll to find you?"

**"I tried Facebook ads, they didn't work."**
→ "Facebook reaches couples not in buying mode. Setnayan reaches couples actively shopping for your category, on the page where they pick the vendor. Different funnel."

**"Will couples know it's a paid placement?"**
→ "Yes — there's a small 'Boosted' chip on the card. The data we have so far suggests couples interpret it as 'this vendor is investing in their business', not as 'this is an ad'. We can show you the click-through and conversion rate breakdown on the first 30 days."

**"What if I'm not happy with the results?"**
→ "Boosted Ads is weekly billing — you cancel any time. Sponsored Boost Quarterly is the smaller commit if you want to lock in a tier badge but want a 3-month checkpoint."

### Step 5 — Close

Send the in-app purchase link via 0019. Vendor self-serves the checkout through their 0022 Vendor Dashboard → Marketplace presence. Owner does NOT take payment over chat or by phone — every Boosted Ads purchase goes through the standard apply-then-pay flow in 0034 with the BIR-compliant Official Receipt.

After purchase:
- Confirm activation in 0023 → Vendor Marketing tab → spot-check the placement renders in marketplace
- Send the "Welcome to Boosted Ads" check-in DM 7 days later via 0019
- Pull the first 30-day performance report from 0023 → Funnels → Vendor Boosted Ads cohort, and share it with the vendor before they decide on renewal

---

## Pricing promo for the first 30 vendors (2026-05-19 → 2026-06-30)

Owner-discretion pricing promo to seed Boosted Ads adoption + generate case-study data:

- First 30 vendors who book any tier get **20% off the first month** (week 1 + 2 + 3 + 4 at -20%)
- Capped at 30 redemptions; tracked via promo code `BOOSTED-LAUNCH-2026`
- Promo code surfaces in the upsell modal automatically (no need for vendor to type it) when `vendor_marketing_subscriptions.first_purchase = TRUE` AND less than 30 redemptions have fired
- Once the 30 redemptions cap is hit, the discount disappears silently (no UX-visible "promo ended" — the price just renders at full ratecard)

Schema-side support already exists via `service_orders.applied_promo_code`. Engineering action: seed `promo_codes` row for `BOOSTED-LAUNCH-2026` with 30-redemption cap.

---

## The featured-vendor lookbook (V1.1 deliverable)

A 1-page PDF showing "what a Boosted Ads vendor looks like on Setnayan." For sales conversations + Sponsored Content prospects.

**Contents:**
- Cover: clean Setnayan branding + "Featured Vendor Placement on Setnayan" headline
- Page 1: marketplace screenshot showing a Boosted Ads vendor card at top vs an organic card below
- Page 2: tier table (5km / 10km / 20km / Sponsored Boost) with bullet outcomes for each
- Page 3: 30-day performance projection range (clicks, conversion to inquiry, conversion to booking) based on tier
- Page 4: "How to apply" (3 steps + screenshot of the 0022 marketplace-presence upsell modal)
- Page 5: vendor testimonial slot (left blank in v1; populated after the first 3 case studies)

**Production:**
- Designer (or owner via Figma) produces v1 by 2026-06-15
- Stored at `04_Marketing/Featured_Vendor_Lookbook_2026Q3.pdf` + linked from 0022 sales modal as "Download the placement guide"
- Refresh quarterly with updated performance data

---

## Performance review (owner-side, weekly)

Every Monday, owner pulls:

- New Boosted Ads + Sponsored Boost vendors this week (count + total weekly run-rate added)
- Cancellations this week (count + reason if logged in 0023)
- Top 5 vendors by Boosted Ads clicks (last 7 days)
- Bottom 5 vendors by Boosted Ads clicks (last 7 days — these need a "is the placement working" check-in)

Report goes into the running Monday handoff doc. Drift indicator: if new-subscriber count drops below 3/wk for 2 weeks running, the outbound motion has stalled — increase prospect-list output to 10/week.

---

## What this playbook is NOT

- NOT a programmatic ad-tech sales motion. This is a manual, high-touch B2B sale by the owner (or whoever is on the founding sales team). When that motion proves out, we revisit whether to layer in a self-serve scaling track.
- NOT a campaign-management product. Vendors do not have ad-set editors, audience targeting controls, or A/B testing UI. The 0022 tier picker is intentionally simple — radius + duration, that's it.
- NOT a customer-side feature. Couples don't know there's a Boosted Ads program by name (they see a "Boosted" chip on cards, that's it).

---

**End of Boosted Ads Activation Playbook.**
