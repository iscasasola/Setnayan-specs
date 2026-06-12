# Setnayan — Canonical Customer Pricing (owner-locked 2026-06-08 · premium stance)

> **Source of truth for customer-side pricing** across the onboarding, the admin Bundle Builder, and the public website. Owner-locked 2026-06-08 (premium stance, 3rd + final iteration). Supersedes all earlier same-day drafts and all prior illustrative prices. Prices are PHP; store as centavos in `service_catalog`. **Every total below reconciles to the peso.**

## The four tiers

| Tier | Price | SRP → savings |
|---|---|---|
| **Free — Explore** | **₱0** | — *(browse + personalized reveal + planning tools)* |
| **Setnayan AI** | **₱3,999** | value-anchored entry (~89% below a ₱30k planner) |
| **Essentials** | **₱12,999** | SRP **₱22,492** → save **₱9,493 (~42%)** |
| **Complete** | **₱27,999** | SRP **₱47,982** → save **₱19,983 (~42%)** · all 18 paid services |

- **Free** + **Setnayan AI** = entry points; **Essentials** + **Complete** = the two bundle offers (onboarding Stage 4 + admin Bundle Builder).
- **~95–99% margin** (marginal cost ≈ R2 storage ≤ ₱1,000/event).

## À-la-carte — all 18 paid services (SRP ₱47,982)

| # | Service | SRP | Category | In Essentials? |
|---|---|---|---|---|
| 1 | Setnayan AI | ₱3,999 | Planning / AI | ✅ |
| 2 | Animated Monogram | ₱1,999 | Brand & Invites | ✅ |
| 3 | Custom QR *(QR Code Personalized)* | ₱999 | Brand & Invites | ✅ |
| 4 | Pro RSVP | ₱1,999 | Brand & Invites | ✅ |
| 5 | Event Website | ₱1,999 | Brand & Invites | ✅ |
| 6 | Editorial Website | ₱7,999 | Brand & Invites | ✅ |
| 7 | Papic Guests | ₱1,999 | Capture (Papic) | ✅ |
| 8 | Guest Stories | ₱1,499 | Video & Media | ✅ |
| 9 | Papic 5 Seats | ₱2,999 | Capture (Papic) | — |
| 10 | Camera Bridge | ₱1,499 | Capture (Papic) | — |
| 11 | Pabati | ₱999 | Video & Media | — |
| 12 | Patiktok | ₱1,499 | Video & Media | — |
| 13 | Thank You | ₱3,499 | Video & Media | — |
| 14 | Same Day Edit | ₱4,999 | Video & Media | — |
| 15 | PhotoWall | ₱2,499 | Video & Media | — |
| 16 | Live Background | ₱2,499 | Video & Media | — |
| 17 | Panood | ₱2,499 / day | Video & Media | — |
| 18 | Pakanta | ₱2,499 | Audio | — |
| | **TOTAL (all 18)** | **₱47,982** | | |

## Bundle inclusions

**Essentials — ₱12,999** (SRP **₱22,492**, save ₱9,493): the **8** ✅ services above —
Setnayan AI · Animated Monogram · Custom QR · Pro RSVP · Event Website · Editorial Website · Papic Guests · Guest Stories.
`3,999 + 1,999 + 999 + 1,999 + 1,999 + 7,999 + 1,999 + 1,499 = 22,492` ✓

**Complete — ₱27,999** (SRP **₱47,982**, save ₱19,983): **all 18** paid services. `Σ = 47,982` ✓

## Free-tier features (₱0 — always)

Browse + personalized reveal + planning tools: Schedule · Budget · Guest List · Seat Plan · RSVP · Mood Board. These are free platform features, **not** à-la-carte SKUs.

## Event Website = PAID (owner-resolved 2026-06-08 · option b)

**Event Website is a paid ₱1,999 à-la-carte SKU** (and is inside Essentials). The Free tier does **NOT** include a free Event Website — that earlier "free Event Website" line is **retired**. The Free tier's website hook is the **personalized reveal** + the planning tools; the actual published wedding website (Event Website) is paid. Prototypes + this doc reflect this.

*(Open: the screenshot's "Removed (no longer offered)" list was cut off — older SKUs not in the 18 (Setnayan AI, Indoor Blueprint, Pakulay, Pro Website, High-Res Archive, Call-Time Escalator) are assumed retired customer-facing; confirm.)*

## How this maps across surfaces

- **Onboarding (Stage 4):** `s4ai` = Setnayan AI **₱3,999** (flat, no strike) · `s4bundle` = Essentials **₱12,999** (struck ₱22,492, save ₱9,493 · 42%) / Complete **₱27,999** (struck ₱47,982, ★ best value) · `s4boost` = à-la-carte cards at the SRP above · `s5paywall` = stay-free (Free tier).
- **Admin Bundle Builder:** catalog = the 18 paid SKUs at SRP; Bundle A = Essentials (8 items → worth ₱22,492, price ₱12,999), Bundle B = Complete (18 items → worth ₱47,982, price ₱27,999). The worth auto-sum reconciles exactly.
- **Website:** pricing page mirrors the four-tier table; per-service pages show à-la-carte SRP.

## Notes

- **Naming (corpus reconcile · Cowork):** owner-canonical names (Pro RSVP, Papic Guests, Same Day Edit, Thank You, PhotoWall, Editorial Website, Event Website) differ from older corpus labels — this doc wins; update `Pricing.md § 0` + the locked SKU table in corpus `CLAUDE.md`.
- **Pakanta** = single **₱2,499** SKU (3-tier ladder retired customer-facing).
- **30-min first-purchase timer** (prototype): framing is "buy the bundle now, or pay à-la-carte SRP later." Owner to confirm keep-vs-drop.
- Margin holds because marginal cost ≈ R2 storage (≤ ₱1,000/event).
