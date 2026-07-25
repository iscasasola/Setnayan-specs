# Vendor Fee Model — Deep Analysis: sync fee, imported clients, returning clients (2026-07-24)

**The question (owner, 2026-07-24):** A vendor brings their *own* client into Setnayan — imported from outside, or a returning client rebooking — with a price already agreed off-platform. Do they pay the 5%? Owner's insight: *"5% of a self-sourced ₱1M deal (= ₱50k) isn't a 'sync fee,' it's a commission — vendors won't import their clients or rebook under it."* Owner's proposed direction: **freemium** — basic sync free (budget planner, guest list, basic chat), premium features gated (Papic, 3D Plan, Papic Games, Editorial). Owner's caveat: *free syncing still costs us data storage, so is free strategic?* And: **"study how other websites work / the proper way, then do a deep analysis."**

---

## 1. How the market actually prices this — the evidence

Three closest comparables, and they all say the same thing.

| Platform | What it is | How it charges | % commission on the vendor's OWN bookings? |
|---|---|---|---|
| **HoneyBook** | Wedding/creative-vendor CRM — the closest "run your own clients" tool | Flat subscription **$29–129/mo** (team-tiered). Only *payment-processing* fees (2.9%+$0.25 card / 1.5% ACH) *when money moves through them* | **None.** Zero take on the deal. And Setnayan doesn't process payments, so even that fee wouldn't apply |
| **OpenTable** | Reservation marketplace — literally the "own diners vs network diners" split | **Network (platform-sourced) diners = $1.00–1.50/cover.** The restaurant's **OWN website reservations = $0** on paid plans (subscription covers them), $0.25/cover only on the cheapest plan | **None on your own diners.** A per-unit fee applies *only* to demand OpenTable itself sent |
| **The Knot / WeddingWire** | Wedding marketplace / directory | Advertising + lead model (~$125–$1,200/mo by market); new hybrid = low base sub + pay-for-performance on leads | **None.** You pay for visibility/leads, never a cut of bookings |

**Platforms that DO take a % of the deal** — Airbnb (~15%), Etsy (~6.5%), Uber, Amazon (8–15% referral) — all share **two traits Setnayan does not have**: (1) *they* originate the demand, and (2) *they* hold/process the payment. Setnayan does neither for a vendor's own client (off-platform payment, vendor-sourced lead).

**Unambiguous conclusion:** across every close comparable, **nobody charges a percentage commission on a vendor's own, self-sourced bookings.** A % take-rate is reserved for demand the *platform* sourced. Tools for managing your own clients are monetized by **subscription + optional paid features + (where money moves) payment processing** — none of which scale punitively with the vendor's deal size.

The single most on-point data point: **OpenTable makes your own customers free and only charges for the customers it sends you.** That is precisely the split the owner is reaching for, proven at scale by the world's largest reservation marketplace.

---

## 2. Why 5%-on-everything is the wrong instrument for imported/returning clients

- **Value mismatch.** Syncing a ₱200k and a ₱2M wedding costs Setnayan the same and delivers the same tools. A fee that scales with deal size charges for value that isn't there.
- **It funds its own leak.** A 5% tax on self-sourced deals is a direct incentive to keep them off-platform — the exact behavior the chat **contact-filter** is being built to stop. You'd be building the leak and the plug in the same app.
- **It punishes loyalty.** Charging 5% *again* on a returning client taxes the vendor's own repeat business — pure leakage, and it makes rebooking-on-Setnayan the expensive choice.
- **It contradicts your own locked philosophy.** *"Pay for access, not transactions"* and *"monetize the doorway, not the deal."* The 5%-of-deal was the detour; the subscription + add-on model you already locked is the through-line. This analysis is a *return* to it, not a new invention.

---

## 3. The storage-cost worry self-solves

The owner is right that free sync + service use isn't free to Setnayan — but the economics fall the right way:

- **Basic sync is nearly free to store.** Budget-planner rows, guest names, schedule, text chat = *kilobytes* per event. Negligible.
- **The storage/compute-heavy features are exactly the ones you'd gate:** Papic (photos + video), 3D Plan (renders), Editorial (media), Live Studio. Those are **already paid SKUs.**
- So free basic sync does **not** create a real cost sink — **the cost centers are already behind the paywall.** You give away the *cheap* thing that creates data + habit + lock-in, and charge for the *expensive* thing that actually costs you money. That is textbook freemium done correctly.

---

## 4. Recommended model — tier the ACCESS, not the deal

(The owner's freemium idea, made precise and reconciled with the already-locked subscription + SKU catalog.)

**A. Free "Basic Sync" — any client, imported or returning, self-sourced.**
Add to budget planner, guest list, schedule, basic text chat, the shared event record. Cheap to host; high strategic value (data, habit, switching-cost); removes the reason to stay off-platform. **No fee. This is the hook.**

**B. Paid premium features — the existing à-la-carte SKUs + subscription add-ons.**
Papic / Papic Games, 3D Plan, Editorial, Live Studio, monogram, save-the-date openings, etc. Whoever wants them pays the existing price (couple-paid SKU, or vendor add-on). This is where storage/compute cost lives *and* where it's recovered. Owner's exact instinct — keep it.

**C. Vendor subscription — Solo / Pro / Enterprise + add-ons (already locked).**
The recurring earn from a vendor running their book of business on Setnayan. Higher tiers unlock more (team seats, reach, market intel, unlimited 3D, deep search, photo challenge).

**D. % / success / lead fee — ONLY on Setnayan-SOURCED clients.**
When the platform delivers the *introduction* (a lead the vendor didn't have), a success fee is earned and defensible — this is OpenTable's "network cover," the one honest place for a %. Vendor's own imports/returns never touch it.

**E. Returning clients re-sync FREE.**
They already generate revenue via feature usage + the vendor's subscription. Re-charging to re-sync is the loyalty penalty. (This **revises** the earlier *"reuse = new lock = new fee"* decision, which is too aggressive under the sync-fee framing.)

### Optional: a small FLAT activation fee (only if you want import to carry *some* charge)
If you'd rather imports aren't 100% free, make it a **fixed ₱ number per synced event** (e.g. ₱99–₱299), tied to *turning on storage-bearing features*, **never a % of the deal.** That keeps the "sync fee" name honest (it's flat, like an activation), and it still nudges vendors to value the sync — without the ₱1M absurdity. Recommend defaulting to **free basic sync** and testing a flat activation only if import volume needs a quality gate.

---

## 5. How this hits all three stated goals

| Goal | How the model delivers it |
|---|---|
| **Encourage vendors to import clients** | Free basic sync → no reason not to bring every client in |
| **Allow rebooking** | Returning clients re-sync free; monetized via features + subscription |
| **Still earn from it** | Three honest streams: (1) premium feature SKUs (the storage-heavy stuff, couple- or vendor-paid), (2) vendor subscriptions (recurring access), (3) success/lead fee **only** where Setnayan sourced the demand. No punitive %-of-deal on money you didn't help make |

---

## 6. On the naming

"Sync fee" is a fine *name* **only if the thing is flat and small** — a nominal per-event activation, not a % of the deal. A "sync fee" that scales with contract size is a commission in a costume, and vendors will see through it (the owner already did). The cleanest posture: **no per-deal sync fee on a vendor's own clients at all** — access is the subscription's job, premium is the SKU's job, and % is reserved for sourced leads.

---

## 7. Blast radius — what changes vs. what's being built

The payment session is shipping **5%-at-lock-on-everything** (draft PR #3658 + booking-fee engine). Under this model:
- **Keep the fee engine** (good plumbing, idempotent, verified-gated) — but **re-scope its trigger to Setnayan-sourced bookings only**, not vendor's-own imports/returns.
- Or hold that PR dark until the model is locked.
- Either way this needs an **explicit owner lock before it goes live**, or it ships the model this analysis argues against.

---

## 8. Decision to lock (proposed — pending owner confirm)

1. **No %-of-deal** on a vendor's own imported/returning clients.
2. Monetize those via **free basic sync + paid premium features + vendor subscription.**
3. Reserve any **% / success / lead fee for Setnayan-SOURCED leads only.**
4. **Returning clients re-sync free** (revises "reuse = new fee").
5. Optional: a small **flat** activation fee tied to storage features — never a %.

On confirm: route to the payment session (re-scope PR #3658's trigger), add a `DECISION_LOG.md` row, and update `Pricing.md` + the vendor-monetization memory.

**Sources:** HoneyBook pricing (assembly.com, g2.com), OpenTable per-cover own-vs-network fees (tablelink.app, opentable.com, eatapp.co), The Knot/WeddingWire vendor advertising model (fullybookedvenue.com, evolveyourweddingbusiness.com).
