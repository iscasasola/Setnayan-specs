# Approved Pricing Changes — 2026-06-04

> **What this is.** The owner's finalized pricing decisions from the 2026-06-04 session, expressed as **deltas to push** onto the live product.
>
> **Baseline = the live website.** The descriptive "what's live now" source of truth is [`Site_vs_Spec_Reconciliation_2026-06-04.md`](Site_vs_Spec_Reconciliation_2026-06-04.md) + Pricing.md **§0** (both mirror setnayan.com per the owner's "follow the website" directive). **This doc does not restate the live catalog — it lists only what changes.**
>
> ⚠️ Correction note: an earlier version of this file used `service_catalog` **migration** values as "live." The migrations are a *different (less current) layer* than the published site. SDE in particular was wrongly shown as ₱9,999 (migration) — the live site is ₱3,499. This version is rebased on the website.

---

## A · Approved changes to push (site + `service_catalog` + specs)

| Item | Live now (website) | ✅ APPROVED change | Notes |
|---|---|---|---|
| **Vendor token price** | packs ₱180–250/token (₱1,000–₱18,000) | **₱100/token flat** · packs 4/10/25/50/100 · **no per-token discount — bulk earns BONUS TOKENS on top** (bonus ladder owner-to-set) | "no more ₱250" — replaces the ladder; bulk = extra tokens, not a cheaper price. |
| **Answer an inquiry** | (not built; free accept-gate) | **region-weighted 1–3 tokens = ₱100/₱200/₱300** (₱300 ceiling), banded by the wedding region's **minimum wage**: low-wage 1 · hubs 2 · NCR/CALABARZON/C.Luzon 3 · never by booking size | New build · repriced 2026-06-05 (was 3‑4‑5‑6). |
| **Vendor model** | subs + Boosted Ads + Sponsored Boost (no tokens); Vendor Pro shown 4 ways | **Commit to tokens.** Region-tiered subs (Pro ₱2,499–3,999 / Ent ₱5,499–8,499 / 28d) + 100 founder tokens + earn-by-recommend. Built ₱499/wk Pro + Boosted Ads + Sponsored Boost = **pilot-only, sunsetting**. | Resolves the site's vendor-Pro contradiction → the 28-day region model wins. |
| **Verification (initial)** | contradictory (homepage ₱1,499 · /pricing free) | **₱0 (free)** | /pricing already free; fix the homepage copy. |
| **Papic** | Papic (5 Seats) ₱2,999 + Papic Guest from ₱2,999 | **₱4,499 pool** (up-to-10hr OR 10K-capture pool, whichever first) | Owner's 2026-06-01 lock; supersedes seats. |
| **Patiktok** | ₱2,499 flat (up to 250 recordings) | **per-hour, no cap** (15 clips/hr basis) · **rate owner-to-set** | Supersedes per-day + flat models. |
| **AI Video Highlight (60s)** | not on the site | **add at ₱999** | Real SKU missing from /pricing — surface it. |
| **Today's Focus** (AI planner) | ₱1,499, **Live** | **OFF — remove the listing** | Owner: keep it off (aligns with the 2026-06-03 Today's-Focus-retired memory). Flag the live site to drop it. |
| **Same-Day Edit** | ₱3,499 (Papic add-on) | **₱3,499 — no change** ✅ | Confirms live; corrects this doc's earlier ₱9,999 error. |
| **Commission** | 0% (home/​pricing) vs 5% (/for-vendors) | **0%** (implied by the token model) | Drop the /for-vendors 5% line. Owner to confirm if disputed. |

## B · No change (live already correct)
AI Edited Highlight ₱3,499 · **Save-the-Date Video ₱199 — KEPT** (owner 2026-06-04 "we'll still make one"; surface on /pricing) · Animated Monogram ₱2,499 · Custom QR ₱1,499 · Indoor Blueprint ₱1,499 · Pakanta single ₱2,499 · the Coming-soon set.

## C · Where each change lands
- **Live site (code repo):** token packs → ₱100; remove Today's Focus; add AI Video Highlight ₱999; homepage verification → free; vendor-Pro single model; drop 5% line. *(engineering task — not this corpus)*
- **`service_catalog` (migration):** ₱100 tokens + region burn; Papic pool; Patiktok per-hour; AIVH ₱999; sunset built ad SKUs; delete verification alias rows + Patiktok duplicate SKUs (live bugs from the migration audit). *(engineering task)*
- **Specs (this corpus):** token docs done (₱100/no-250/commit-to-tokens); Pricing.md §0 stays as live-mirror; iteration banners per `Site_vs_Spec` §5 cascade.

## D · Still open (owner to settle)
- Patiktok per-hour **rate** (owner-to-set; never invent)
- Token **bonus ladder** — how many extra tokens per bulk tier (flat ₱100 base · bonus, not discount · owner to create)
- Site-internal contradictions from `Site_vs_Spec` §3 not yet pushed: vendor-Pro single model · drop the /for-vendors 5% line · homepage verification → free

✅ **Resolved 2026-06-04:** Save-the-Date kept · Patiktok per-hour · SDE ₱3,499 · AIVH ₱999 add · Today's Focus off · token = flat ₱100 + bonus-on-bulk · commit-to-tokens · Papic ₱4,499 pool · verification ₱0.
