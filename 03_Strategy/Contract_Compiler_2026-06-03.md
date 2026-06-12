# Contract Compiler — couple-side free contract organizer (design lock 2026-06-03)

> Owner-locked 2026-06-03 as a **free** couple-side planning tool — #33 in [Time_and_Money_Saved_Model_2026-06-01.md](Time_and_Money_Saved_Model_2026-06-01.md) §H (₱1,499 value · ~3h saved). Corrects the earlier "Contact Compiler" mislabel. **Owning iterations:** 0006 (storage — `vendor_contracts`) · 0032 (the paid AI analysis it sits beneath) · 0007 (deadlines / payment milestones) · 0021 (couple-dashboard surface).

## The one-line idea

One place where the couple gathers **every vendor contract** for their wedding — uploaded or Setnayan-signed — and tracks each one's **signature status + key dates** so nothing slips. The free organizer; the AI clause-analysis stays the paid 0032 upgrade.

## What it is (free)

- **Aggregate** — a single Contracts surface on the couple dashboard (0021), one row per vendor contract, from two sources:
  - **0032-signed** contracts where the couple is the counterparty (auto-appear once `status='both_signed'`).
  - **Off-platform** contracts the couple uploads to the existing **`vendor_contracts`** store (0006) — the photographer's paper agreement, the venue's booking form, etc.
- **Organize** — per contract: vendor · amount · a couple-entered title + a few **key terms** typed manually (coverage hours · deliverables · cancellation) · the file.
- **Track** — **signature status** (unsigned / one-party / both-signed) + **key dates** (signing deadline · payment milestones from 0007 · cancellation window) surfaced on the couple's **"Upcoming schedules"** Home feed (the 2026-06-03 earliest-date scheduler).
- **Free.** No AI, no clause library, no e-signature generation here.

## Free / paid boundary (kept clean)

| | Free — **Contract Compiler** | Paid — **0032 Contract Intelligence** |
|---|---|---|
| Store + list all contracts | ✅ | (vendor-side generation) |
| Manual key-terms + deadline tracking | ✅ | — |
| AI 14-element detection + gap-fill | — | ✅ ₱199/contract or Vendor Pro |
| Clause library + branded PDF + e-sign | — | ✅ (vendor-side) |

A couple *can* run a contract they've compiled through the paid 0032 AI analysis — Contract Compiler is the free shelf; 0032 is the paid reader. This keeps the free tool from cannibalizing the paid SKU.

## Data model

No new core table for V1 — reuses **`vendor_contracts`** (0006 · uploaded files per `event_vendor_relationship`) + the 0032 `contract_drafts` rows where the couple is counterparty. When this builds, add only light couple-entered fields to `vendor_contracts` (`key_terms JSONB` · `signature_status` · `signing_deadline DATE`) or a small `event_contract_tracking` side-table. RLS via the couple's `current_event_ids` pattern.

## Scope

V1.x post-pilot · couple-dashboard surface (0021) reading the 0006 store. No AI. **Spec stub** — folds into 0006 / 0021 / 0032 when those next build; the savings-model value (₱1,499 · 3h) is locked.

## Cross-references

- `0006_vendors_management` — `vendor_contracts`, the existing upload store this organizes.
- `0032_contract_intelligence` — the paid AI analysis tier above it (vendor-side generation + e-sign).
- `0007_budget_expenses` — payment-milestone deadlines the tracker surfaces.
- `0021_couple_dashboard_fully_purchased` — the couple-facing surface.
- [Time_and_Money_Saved_Model_2026-06-01.md](Time_and_Money_Saved_Model_2026-06-01.md) §H #33 — the savings-model entry.
