# Pricing Reprocess — Session Handoff (2026-06-14)
### START HERE to continue the pricing discussion in a fresh session.

> This is the single "where we are" doc for the free-vs-paid + bundle reprocess. It captures the persona, the LOCKED free tier, the priced side still to finalize, the live revenue bugs, and the open owner calls. Pairs with `Monetization_Blueprint_2026-06-14.md` (strategy), `Free_Pro_Tiering_2026-06-14.md` (structure), and `Pricing_Collection_2026-06-14.md` (where final amounts land).
>
> **All ₱ below are PROVISIONAL.** The job of the next session is the **holistic pass**: lock the amounts + the bundles + the open items, and fix the live revenue bugs.

---

## The persona that worked (use this in the new session)
**A senior budget-management sales specialist + monetization strategist for digital services.** Goal: maximize free→paid conversion and ARPU while keeping the free tier a genuine, generous magnet. Plain English always (define the term + the problem + the trade-off; no architect jargon). UX is the north star. PH "sulit" buyers, GCash one-tap, no consumer subscriptions.

---

## ✅ FREE tier — LOCKED this session (do NOT re-open)
The whole working cockpit is free, capped-not-crippled:
- **Guest List** — full list, roles, plus-ones, RSVP status, QR claim, day-of check-in, **+ add groups**. (Cap ~150 guests.)
- **Seat Plan** — full editor. **Free forever** (hard lock).
- **Budget** — full ledger, payment log, deadlines, calendar export.
- **Mood Board** — curated palettes/themes/color names (no uploads).
- **Timeline** — countdown + statutory deadlines + basic run-of-show.
- **Website** — **1 simple template**, subdomain, branded QR, "Powered by Setnayan" badge.
- **QR** — standard B&W event/guest/table/check-in.
- **Find vendors** — search + **filter by estimated date + by target onboarding location** + **manual add-to-compare** + **book at 0% commission**. **Date-matching is free and mutual** (the couple's one date propagates across every service; service B only shows options free on the same date as service A).
- **Papic (free funnel)** — shared gallery, **100 photos**, **downgraded quality**, short retention, no auto-tag, watermark.
- **Live Photo Wall (free)** — **online only**, embedded in the event website (personal viewing). NOT a venue-projection mode (that's paid — see note).
- **Monogram (free)** — simple static initials mark.
- **Save-the-Date (free)** — 1 basic template.

**Why the free live-wall doesn't cannibalize the paid venue wall:** free = "view on your own device" (no full-screen/TV/cast mode by design). Paid = the operated venue broadcast (Display Mode + live FaceBlock moderation + operator console). Keep "cast to the room" exclusive to the paid wall.

---

## 💰 PAID side — TO FINALIZE (provisional amounts)
| SKU | Provisional ₱ | Notes / open question |
|---|---|---|
| **Setnayan AI** (ranked vendor match — HEADLINE first paywall) | **₱3,999** | = ranking + %-fit + **auto-compute-on-compare** + cross-service optimization + deadline mgmt. **A/B ₱1,999 vs ₱3,999** (most important price). |
| Website Pro | ₱1,999 | template gallery + custom domain + on-site RSVP + embeds + badge off |
| QR Pro | ₱999 | branded + per-guest-at-scale + dynamic + analytics |
| Animated Monogram | ₱1,999 | bespoke mark + animation everywhere |
| Papic 5 Seats | ₱2,999 (+₱350/50 pax) | crew, unlimited, full quality, face auto-tag, reels, no watermark |
| **Papic Guest (disposable)** | **UNRESOLVED** | per-guest disposable camera (24 photos + 10×5s). Corpus had "from ₱2,999" — likely too high per-guest. **Decide slot + price.** |
| RSVP Pro | ₱4,499 | unlimited + meals/dietary/+1 + song requests. **(3-way SKU collision is LIVE — see bugs.)** |
| Live Photo Wall (venue/paid) | ₱2,499 | Display Mode + live moderation + operator console |
| Pakanta (song) | ₱2,499 / ₱3,999 / ₱9,999 | 3 tiers |
| Panood (livestream) | ₱2,499/day | **open: free single-phone funnel tier?** |
| SDE / Thank-You Video | ₱4,999 / ₱3,499 | edited films |
| Editorial Website | ₱5,999 | drop from ₱7,999 (only SKU above market) |
| Live Background (8K LED) | ₱2,499 | free low-res preview only |
| Patiktok / Camera Bridge | ₱1,499 each | |
| Save-the-Date | ₱49/render | multi-purchase |

### Bundles — UNDER REASSESSMENT (owner's new rules)
- Rules locked this session: **every item must have an à-la-carte price** (nothing bundle-only) AND **bundles must "work together"** (coherent use-case, not a discount grab-bag).
- Current set to reassess: **Setnayan Pro ₱4,999** (one-tap: AI + Website Pro + RSVP Pro + Monogram + unlimited Papic + QR Pro + collab seats) · **Essentials ₱12,999** · **Complete ₱27,999**.
- A **bundle-reassessment workshop** (4 pricing lenses → judge → synthesis) ran this session; fold its output in here when finalizing (good-better-best vs use-case "work-together" packs vs anchor+attach vs minimalist).

---

## ⚠ LIVE REVENUE BUGS to fix in the holistic pass
1. **Cash register may be off:** `SETNAYAN_AI_PAYWALL_ENABLED` ships **default OFF** + repo still says ₱1,499 → the headline ₱3,999 paywall may not be charging. Flip + verify checkout `service_key` ↔ entitlement gate.
2. **RSVP three-way SKU collision is LIVE** (RSVP_PRO_WEBSITE ₱4,499 + PRO_RSVP ₱1,999 + RSVP_WEBSITE ₱2,499 + reader-key mismatch) → contradictory RSVP prices at checkout. Resolve to: base RSVP free-capped + one RSVP Pro; retire the rest; fix the reader key.
3. **Price-fragmentation (DB vs hardcode):** Animated Monogram ₱1,999 vs ₱2,499 · Custom QR ₱999 vs ₱1,499 · Thank-You ₱3,499 vs ₱5,499. Unify each to DB canon. (Prices are admin-managed — never hardcode.)
4. **Bundle "save" must reconcile** against the true sum of à-la-carte parts (trust-killer otherwise).
5. **Editorial Website** ₱7,999 → ₱5,999.
6. **Free-pillar copy debt:** the 2026-06-07 "thin free tier" copy is partly live; the generous-free-cockpit direction reverses it → reposition "create + run your whole wedding free" across homepage, /pricing, llms.txt, Offer JSON-LD, help.

---

## ❓ Open owner calls
- Panood free single-phone funnel tier — yes/no?
- Papic Guest (disposable) — à-la-carte add-on vs per-pax upsell vs Pro perk; and price.
- RSVP — its own paid SKU vs a Pro feature of Website+Guest List.
- Bundling model — one Setnayan Pro pass vs per-tool Pro vs both (resolve with the workshop output).
- High-Res Archive — paid add-on vs a Pro retention perk.

## Hard constraints (don't violate)
- Customer prices **one-time, per-event** — NO consumer subscriptions (subs are vendor-side only: Pro ₱6,000/28d · Enterprise ₱10,000/28d · tokens flat ₱100 · 0% commission).
- Marginal cost ≈ R2 storage → 90–99% margins. Seat Plan free forever.
- **Prices are admin-managed** — set in the admin catalog, never hardcoded in code (stale hardcoded fallbacks are bugs to clean).
- Surface load-bearing/locked-SKU changes for owner sign-off; don't silently change.
- Final amounts land in `Pricing_Collection_2026-06-14.md` → live catalog (`platform_retail_catalog_v2` + `platform_package_catalog`; `service_catalog` is a tombstone).
