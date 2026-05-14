# Cowork Pending Items

> Consolidated handoff for the next Cowork session(s). Each row is an item that needs Cowork-style spec work (iteration `.md` edits, contract drafting, `.docx` mirror regen, or owner-validation). Source-of-truth for full context is the playbook + CLAUDE.md decision-log entries cited per row. **This file is a navigation aid — do not duplicate spec content here; it will drift.**

**Last updated:** 2026-05-14

**Today's contributing decisions** (CLAUDE.md decision log — search by phrase):
- "Top-nav redesign locked" — nav-chrome amendments + iteration 0003 wallet drift
- "SEO + AI Discoverability Playbook locked" — playbook saved + AI-bot posture
- "SEO Playbook Section 11 added" — multi-audience extension (vendor + boosted fairs)
- "Boost-service capacity locked" — 3-cap + 60-day window
- "Boost-service launch gate locked" — 500-vendor / 10K-couple thresholds

---

## A. Pending `[SPEC CHANGE]` flags (need new spec work)

| # | What | Where it amends | Source |
|---|---|---|---|
| 1 | **Iteration 0018 — publicly indexable browse pages.** `/supplies/*` must be available without login (cart/checkout auth-only). Templates needed: `/supplies`, `/supplies/[category]`, `/supplies/[category]/[city]`, `/supplies/p/[id]/[slug]` with `Product` + `Offer` + `AggregateRating` schema. Without this, no `/supplies` URLs can rank. | `0018_supplies_marketplace/` | Playbook §1, §4.4, §5.1, §7 |
| 2 | **Iterations 0006 + 0022 — public vendor profile spec.** `/v/[slug]` needs a "Public profile (SEO-indexable)" subsection committing to slug + public bio + services + packages + photos + city + verified status + reviews as public fields. Without this, no vendor pages can rank. | `0006_vendors_management/` + `0022_vendor_dashboard/` | Playbook §1, §4.4, §5.1 |
| 3 | **Iteration 0015 — homepage featured-fairs section.** Add an H2 strip surfacing currently-active boosted bridal fairs (max 3, per §11.3.1), with `Event` JSON-LD per fair. Hide when no fair is active. | `0015_main_website/` | Playbook §11.3, §11.3.1 |
| 4 | **New iteration `0036_bridal_fair_boost_service/`.** Cover: SKU definitions (`boost_featured_only`, `boost_featured_plus_email`), eligibility criteria for fairs, fairs data model (fairs, vendor-fair junction, couple-fair registrations), discount-code redemption mechanics, attribution + tracking, slot-management state machine (per §11.3.1), launch-gate counters + `boost_service_open` flag (per §11.7.1), admin override mechanics for both slot pinning and gate flip. Also: `/fairs` index page + `/fairs/[fair-slug]` template per §11.2. | New iteration folder | Playbook §11.2, §11.3.1, §11.7, §11.7.1 |
| 5 | **`01_Contracts/Bridal_Fair_Boost_Service_Agreement.md`.** Contract boilerplate covering Model A + Model B terms, deliverables on both sides, discount-code mechanics, cancellation handling, IP / use-of-marks, term length, exclusivity. | `01_Contracts/` | Playbook §11.7, §11.7.1 |

---

## B. Pending iteration / corpus cleanup

| # | What | Source |
|---|---|---|
| 6 | **Iteration 0003 has no folder.** `02_Specifications/00_Iteration_Connection_Map.md` references `0003_token_wallet_and_packs/` but no folder exists in the corpus. Decide: create folder, archive, or mark deprecated. The wallet half is confirmed not in product (per `project_setnayan_no_wallet` memory + 0000 chrome amendment). | CLAUDE.md decision log "Top-nav redesign locked" |
| 7 | **0000 residual "Wallet" references cleanup pass.** Iteration 0000 still mentions Wallet as an In-App Services card (line ~198) and a `/dashboard/[event-id]/services/wallet` route (line ~269). Wallet doesn't exist in product — needs cleanup beyond the chrome edit already done. | CLAUDE.md decision log "Top-nav redesign locked" |

---

## C. `.docx` mirror regenerations needed (pandoc not installed in the code env)

Per `COWORK.md` lines 53–54, after modifying any iteration `.md` file, regenerate the `.docx` mirror via pandoc. The following are today's modifications awaiting regen:

| `.md` file modified | `.docx` mirror to regenerate |
|---|---|
| `0000_app_shell_and_navigation/0000_app_shell_and_navigation.md` | `0000_app_shell_and_navigation.docx` |
| `0004_invitation_widgets/0004_invitation_widgets.md` | `0004_invitation_widgets.docx` |
| `0028_email_notifications/0028_email_notifications.md` | `0028_email_notifications.docx` |
| `02_Specifications/17_SEO_and_AI_Discoverability_Playbook.md` (NEW) | `02_Specifications/17_SEO_and_AI_Discoverability_Playbook.docx` |

`CLAUDE.md` is not typically mirrored — verify per project convention.

---

## D. Owner-validation items (decisions to make, not specs to draft)

These are starting recommendations in the playbook that need owner validation against real PH market conversations before being locked:

| # | What | Current default | Source |
|---|---|---|---|
| 8 | Vendor booth-fee discount % for fair-registration via Setnayan | 10–15% range | §11.7 + §11.7 open decisions |
| 9 | Customer perk default for fair-registration via Setnayan | One of: free welcome kit / fast-track entry / first-100-arrivals giveaway (organizer-choice in V1) | §11.7 |
| 10 | Model B cash tier prices | Rough PH industry ranges anchored to Kasal.com / Bridestory PH featured-listing rates; needs validation with Themes & Motifs and regional fair operators | §11.7 |
| 11 | Launch-gate vendor threshold | 500 verified vendors | §11.7.1 |
| 12 | Launch-gate couple-account threshold | 10,000 active couple accounts | §11.7.1 |
| 13 | "Active" couple-account definition | Proposed: signed in within last 90 days | §11.7.1 |
| 14 | Eligibility threshold for fairs to qualify for boost (minimum size, organizer reputation, geographic coverage, etc.) | Not yet locked | §11.7 open decisions |
| 15 | Exclusivity rules (can Setnayan boost competing fairs in same city in same month?) | Not yet locked | §11.7 open decisions |
| 16 | Cap on free Model A deals per quarter (Setnayan's on-site staffing has real cost) | Not yet locked | §11.7 open decisions |

---

## E. Other pending (not Cowork work but worth tracking)

| # | What | Owner | Source |
|---|---|---|---|
| 17 | Week 1 SEO foundation in live-site code (couple-side SEO + `/for-vendors` SEO at §11.1) — happens in `Setnayan-App` worktree (`~/Setnayan/.claude/worktrees/interesting-jang-30c4b5/`) via a separate Claude Code session. Handoff primer at end of today's session conversation. | Code session | Playbook §7 Week 1 + §8.2 + §8.3 + §11.1 |
| 18 | External actions (owner-side, no code): GSC verification + International Targeting → Philippines, Bing Webmaster verify, Google Business Profile setup (Wedding Service category), Lighthouse baselines on `/` and `/help`, sitemap submission. | Owner | Playbook §7 Week 1, §4.1, §6.1 |

---

## How to use this file

- **For Cowork sessions**: read this top-to-bottom at session start. Each row points to the source where the substance lives. Pick items by section (A → spec-amendment, B → cleanup, C → mirror regen, D → owner conversations to schedule).
- **For owner**: Section D is your responsibility — none of those numbers should be locked into a contract or customer-facing surface until validated.
- **When an item is completed**: strike through rather than delete (preserves the audit trail) — example: `~~3 | Iteration 0015 — homepage featured-fairs section~~`. Or move to a `## Done` section at the bottom.
- **When new pending items emerge**: append a new row in the relevant section + add the contributing decision-log phrase to the "Today's contributing decisions" list at the top.
- **Do not duplicate spec content here** — this file is a navigation index. The substance always lives in the playbook + iteration `.md` files + CLAUDE.md decision log.
