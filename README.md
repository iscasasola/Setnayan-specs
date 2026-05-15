# SETNAYAN — PH Event-Planning Platform

> The project root for Setnayan (formerly "Setnayan"). Wedding-first V1 with universal-event-platform architecture. Built on Vercel + Supabase + Cloudflare R2 + GitHub. EN-primary marketing site with TL + CEB localization.

## What's where

This README is the entry point. The four files at root that you read in this order get any new collaborator productive in 30 minutes.

| File | Purpose | When to read |
|---|---|---|
| **`README.md`** *(this file)* | Project overview + folder map | First — orientation |
| **`CLAUDE.md`** | Project context for AI sessions (auto-loaded by Claude Code) | Second — what's been decided |
| **`API_Integration_Checklist.md`** | External services + accounts that must exist *before* code starts | Third — prereqs |
| **`CLAUDE_Code_Build_Prompt.md`** | Detailed build prompt — tech stack, UI/UX standards, code conventions | Fourth — handoff to Claude Code |
| **`COWORK.md`** | How Cowork mode should navigate this project | Fifth — for ongoing Cowork sessions |

## Folder structure

```
Setnayan Project/
├── README.md                          ← you are here
├── CLAUDE.md                          ← project context (auto-loaded by Claude Code)
├── API_Integration_Checklist.md       ← prereq APIs + accounts
├── CLAUDE_Code_Build_Prompt.md        ← build instructions for Claude Code
├── COWORK.md                          ← how Cowork should read this project
│
├── 01_Contracts/                      ← Legal + business agreements
│   ├── Setnayan_Vendor_Agreement.md
│   └── Setnayan_Privacy_and_Security_Policy.md
│
├── 02_Specifications/                 ← High-level feature specs (numbered 00–18)
│   ├── 00_Iteration_Connection_Map.md
│   ├── 07_V1_Developer_Specification.md
│   ├── 08_Decision_Tree_Specification.md
│   ├── 09_Panood_Feature_Specification.md
│   ├── 10_Papic_Feature_Specification.md
│   ├── 13_Engineering_Brief.docx
│   ├── 14_Music_Catalogue_Cowork_Playbook.md
│   ├── 15_Couple_Landing_Page_Feature_Specification.md
│   ├── 16_Vendor_Benefits_with_App_Evidence.md
│   └── Feature_Documentation_By_Role.md
│
├── 03_Strategy/                       ← Strategic + market analysis
│   ├── 00_Master_Index.docx
│   ├── 01_Competitor_Analysis.docx
│   ├── 02_Competitor_Analysis_Consolidated_v2.docx
│   ├── 02_SWOT_Analysis.docx
│   ├── 03_Market_Need_Validation.docx
│   ├── 03_Strategy_Discussion_Log_v1.docx
│   ├── 04_Risk_Mitigation_Plan.docx
│   ├── 08_GoToMarket_Plan.docx
│   ├── 09_Investor_Pitch_Deck.docx
│   ├── 10_Brand_Messaging_Guide.docx
│   ├── 11_V1_Resilience_Plan.docx
│   ├── 12_Master_Blueprint.docx
│   ├── 14_Sync_Update_v1.1.docx
│   ├── 15_Spotlight_Tour_Manuscript.docx
│   ├── Master_Service_Catalogue_2026-05-10.docx
│   └── earlier-rejected-candidate_Competitive_Brief.docx
│
├── 04_Marketing/                      ← Customer-facing marketing artifacts
│   ├── 05_Customer_Magazine.docx
│   ├── 05_Default_Filipino_Wedding_Template_v1.docx
│   ├── 05b_Customer_OnePager.docx
│   ├── 06_Pricing_Magazine.docx
│   ├── 06b_Pricing_OnePager.docx
│   └── 07_Flyers_Pack.docx
│
├── 05_Financials/                     ← Pricing workbooks + revenue models
│   ├── 00_Pricing_and_Costs.xlsx
│   ├── Cost_vs_Revenue_Analysis.xlsx
│   ├── Pricing_Audit_and_Subscription_Strategy_2026-05-10.docx
│   ├── Pricing_v2_Subscription_Pivot_Recommendation.docx
│   ├── Pricing_Workbook_Plain_English.xlsx
│   ├── Pricing_Workbook_Set_Your_Prices.xlsx
│   └── Revenue_Projection_Model.xlsx
│
├── 06_Prototypes/                     ← Standalone HTML mockups + revenue prototypes
│   ├── 04_App_Mockups_v1.html
│   ├── 06_Couple_Landing_Page_Designs_v1.html
│   ├── 16_Couple_Landing_Page_Live.html
│   ├── 17_Couple_Dashboard_Guests_Mockup.html
│   ├── 18_Guest_QR_Profile_Camera_Mockup.html
│   └── Revenue_Slider_Prototype.html
│
├── 07_Archive/                        ← Retired / superseded content
│   ├── CHANGELOG_2026-05-11.md
│   ├── MIGRATION_AUDIT_2026-05-11.md
│   ├── 0003_token_wallet_and_packs/   (retired iteration)
│   └── 0020_admin_console/            (superseded by 0023)
│
└── (iterations) 0000_app_shell_and_navigation/ through 0024_save_the_date/
    Each iteration folder contains the three deliverables:
    – {iteration}.md  (engineering spec)
    – {iteration}.html  (interactive web + mobile prototype)
    – {iteration}.docx  (stakeholder review mirror)
```

## What Setnayan does in one paragraph

A two-sided marketplace + planning platform for Filipino weddings (V1) that expands to universal events (anniversaries · debuts · corporate · baptisms · burials in later phases). Couples plan their event end-to-end through a Guided or DIY dashboard; vendors apply, get verified, optionally certified, and grow their bookings through Sponsored Boost; the platform monetizes via apparatus-priced in-app services (Save-the-Date renders, Paparazzi seats, Live Stream, AI Highlights, etc.) and a 3% Setnayan Pay convenience fee. PHP-direct apply-then-pay payments in V1; GCash Merchant API automation in V1.5+. Free vendor registration during launch with grandfathered "lifetime free listing" for the first cohort.

## Key decisions locked

See CLAUDE.md decision log for the full chronology. Major locks:

- **Brand:** SETNAYAN wordmark (full spelling) + custom symbol mark at `setnayan_logo.svg`. Brand-origin "Set na 'yan." Domain `setnayan.com` + `setnayan.ph`.
- **Pricing:** -1 charm pricing across all SKUs (Save-the-Date ₱49, Paparazzi packs ₱1,499/₱2,499, Live Stream Base ₱2,499, Custom Monogram ₱1,999, Broadcast Style ₱2,999, AI Edited Highlight ₱3,499 [repriced 2026-05-16 from ₱4,999], etc.)
- **Payment:** Apply-then-pay V1 (static BDO + GCash, manual reconciliation, 24-hr activation SLA). PayMongo / GCash Merchant API for V1.5.
- **Brand-character payments:** 3% Setnayan Pay convenience fee on customer side when paying vendor through Setnayan.
- **Vendor tiers:** Boosted · Certified · Standard Verified. Certified requires on-site visit. Boost requires Certified.
- **Admin roles (7 granular):** Ops Lead · Transactions · Verification · Disputes · Payments · Customer Accounts · Vendor Accounts. Two-admin approval for provisioning + role changes + grants >₱10K retail.
- **Tech stack:** Vercel (Next.js) + Supabase (Postgres + Auth + Realtime + Edge Fns) + Cloudflare R2 (PH region) + GitHub. Multi-platform clients: web PWA, native iOS/Android (Papic capture), Tauri shell for macOS desktop.
- **Customer model:** Customer ≠ couple-only. Up to 2 co-organizers per event; one user can co-organize many events.
- **Guest model:** Guests have full Setnayan accounts. Each guest has their own camera (5-sec clip cap matching Paparazzi). Papic global photos visible/shareable to all guests.
- **Privacy:** RA 10173 compliant. Per-event face-vector scope. DPO contact dpo@setnayan.com. Breach notification within 72 hours per NPC.

## Build sequence

Build iterations in numeric order with Sprint 0 = **0013 Platform Stack & Sync Setup** (must ship first even though numbered later). After Sprint 0, the build order follows the iteration number 0000 → 0001 → 0002 → …

**Retired/superseded — do not implement:**
- ~~0003 Token Wallet & Packs~~ (replaced by apply-then-pay)
- ~~0020 Admin Console early draft~~ (use 0023 instead)

## Naming conventions

- `**00**_<topic>` prefix = root-level cross-iteration documents
- `01–18_<topic>` prefix = numbered specifications and strategy docs (historical numbering preserved)
- `0000–0024` prefix = numbered build iterations (engineering spec + prototype + docx per iteration)
- `Setnayan_<topic>` prefix = brand-level contracts and policies
- `CLAUDE.md` / `COWORK.md` / `README.md` = root-level AI/human entry points

## How AI sessions consume this project

When Claude Code, Cowork, or other AI tools start a session:

1. **CLAUDE.md** auto-loads as project context (Claude Code convention)
2. **README.md** is the orientation summary (this file)
3. **CLAUDE_Code_Build_Prompt.md** is the build instruction wrapper
4. **API_Integration_Checklist.md** confirms prereqs
5. **COWORK.md** instructs Cowork-mode sessions specifically
6. Memory files (in the session-specific memory directory) preserve learnings across conversations

## Status

V1 iterations drafted through 0024. Production code build has not yet begun — awaiting API integration setup (see API_Integration_Checklist.md). Engineering brief at `02_Specifications/13_Engineering_Brief.docx`.

---

*Last revised 2026-05-12. Source of truth for project orientation. If this file conflicts with CLAUDE.md, CLAUDE.md wins for decision history; README.md wins for folder structure.*
