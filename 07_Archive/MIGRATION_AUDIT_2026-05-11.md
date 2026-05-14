# MIGRATION AUDIT — 2026-05-11

> Deep-dive audit of the Papic / Panood / Patiktok migration. Verifies folder structure, file naming, content rename, and cross-iteration connections.

## Migration scope

| Old name | New name | Iteration |
|---|---|---|
| Paparazzi | **Papic** | 0012 |
| Live Stream | **Panood** | 0011 |
| (new) | **Patiktok** | 0017 |

## What was renamed

### Folder rename
- `0011_live_stream/` → `0011_panood/`
- `0012_paparazzi/` → `0012_papic/`

### Filename rename (inside folders)
| Old filename | New filename |
|---|---|
| `0011_live_stream.md` | `0011_panood.md` |
| `0011_live_stream.html` | `0011_panood.html` |
| `0011_live_stream.docx` | `0011_panood.docx` |
| `0011_live_stream_offline_note.md` | `0011_panood_offline_note.md` |
| `0012_paparazzi.md` | `0012_papic.md` |
| `0012_paparazzi.html` | `0012_papic.html` |
| `0012_paparazzi.docx` | `0012_papic.docx` |
| `0012_paparazzi_migration.sql` | `0012_papic_migration.sql` |
| `0012_paparazzi_offline_note.md` | `0012_papic_offline_note.md` |
| `0012_paparazzi_sdk_notes.md` | `0012_papic_sdk_notes.md` |
| `09_Panood_Feature_Specification.md` | `09_Panood_Feature_Specification.md` |
| `10_Papic_Feature_Specification.md` | `10_Papic_Feature_Specification.md` |

### New folder created
- `0017_patiktok/` — contains `0017_patiktok.md` (the new feature spec)

### Content rename (string replacement)
Bulk find-and-replace executed across all `.md`, `.html`, and `.sql` files in:
- `0011_panood/*` (all internal files)
- `0012_papic/*` (all internal files incl. migration.sql)
- `0017_patiktok/*`
- `09_Panood_Feature_Specification.md`
- `10_Papic_Feature_Specification.md`
- `0000_app_shell_and_navigation/*`
- `0001_creating_guest_list/*`
- `0002_qr_invitation_system/*`
- `0003_token_wallet_and_packs/*`
- `0006_vendors_management/*`
- `0007_budget_expenses/*`
- `0008_seating_chart_editor/*`
- `0009_photo_delivery/*`
- `0010_mood_board/*`
- `0013_platform_stack_and_sync/*`
- `0015_main_website/*`
- `0016_step_by_step_plan_builder/*`
- `00_Iteration_Connection_Map.md`

Replacement rules:
- `Paparazzi` → `Papic`
- `paparazzi` → `papic` (lowercase, used in URLs and SKU keys)
- `Live Stream` → `Panood`
- `live_stream` → `panood`
- `live-stream` → `panood`
- `livestream` → `panood`
- `/services/paparazzi` → `/services/papic`
- `/services/live-stream` → `/services/panood`
- `paparazzi_*` SQL columns → `papic_*`
- `live_stream_*` SQL columns → `panood_*`
- Folder references `0011_live_stream/` → `0011_panood/`
- Folder references `0012_paparazzi/` → `0012_papic/`

### What was NOT renamed (intentional)
- **CLAUDE.md** — owner decision required. Decision log, iteration table, SKU table, and memory references still use Paparazzi/Live Stream names. Owner should sweep this manually.
- **YouTube API references** in 09_Tayo_Panood spec — `liveStreams.insert`, `liveBroadcasts.insert`, `liveStreams.bind`, etc. These are external SDK identifiers, must stay.
- **`.docx` files** — binary format, sed can't process them. Will need to regenerate from `.md` source or manual edit in Word.

## Final verification — stale string counts

| Scope | Stale "Paparazzi" | Stale "Live Stream" | Notes |
|---|---|---|---|
| `0011_panood/` | 0 | 0 | Clean |
| `0012_papic/` | 0 | 0 | Clean |
| `0017_patiktok/` | 0 | 0 | New iteration, already using new names |
| `09_Tayo_Panood_*.md` | 0 | 8 | All 8 are YouTube API names (liveStreams.insert etc.) — must stay |
| `10_Tayo_Papic_*.md` | 0 | 0 | Clean |
| All other iteration folders | 0 | 0 | Clean |
| `00_Iteration_Connection_Map.md` | 0 | 0 | Clean |
| **CLAUDE.md** | many | many | **Not swept** — owner decision required |

## Connection graph (post-migration)

```
                  ┌──────────────────────────────────────────┐
                  │  0013 Platform Stack & Sync              │
                  │  (Supabase + R2 + Vercel + GitHub)       │
                  └────────────┬─────────────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
       ┌──────────┐    ┌──────────────┐   ┌──────────────┐
       │ 0000     │    │ 0003 Billing │   │ 0001 Guest   │
       │ App Shell│    │ Rail (PHP)   │   │ List + Roles │
       └────┬─────┘    └──────┬───────┘   └──────┬───────┘
            │                 │                  │
            │     ┌───────────┴──────────┐       │
            ▼     ▼                      ▼       ▼
       ┌──────────────────┐         ┌──────────────────┐
       │ 0002 QR          │         │ Apply-then-pay   │
       │ Invitations      │         │ flow (memory)    │
       │ + Personal QR    │         └──────────────────┘
       └────┬─────────────┘
            │
            │ Personal QR is the gateway for both:
            │
   ┌────────┴────────┐
   ▼                 ▼
┌─────────┐    ┌─────────┐
│ 0011    │    │ 0012    │
│ Panood  │◄───┤ Papic   │
│         │    │         │
│ 3 cam   │    │ 3 cam   │
│ + 3 hr  │    │ + event │
│ + HDMI  │    │   days  │
│         │    │   pack  │
└────┬────┘    └────┬────┘
     │              │
     │ Shared SKUs: │
     │  • Custom Monogram Pack
     │  • SLR Sync (Pro Camera Bridge)
     │  • Music catalogue
     │  • Face vectors (Papic only)
     │              │
     └──────────────┤
                    │
                    ▼
          ┌───────────────────┐
          │ 0017 Patiktok     │
          │                   │
          │ • Uses Papic      │
          │   face vectors    │
          │ • Uses Papic      │
          │   storage pack    │
          │ • Uses Setnayan music │
          │   catalogue       │
          │ • Personal QR     │
          │   auth (0002)     │
          └───────────────────┘

         Downstream / cross-cutting:
         ┌────────────────┐
         │ 0008 Seating   │ — table QR is consumed by Papic for tag fan-out
         │ 0007 Budget    │ — auto-populates Papic/Panood/Patiktok charges
         │ 0009 Photo     │ — gallery surface for Papic captures
         │ 0006 Vendors   │ — vendor logo overlays on Panood + LED
         │ 0010 Mood Board│ — palette drives Patiktok template selection (V2)
         │ 0015 Marketing │ — public-facing Setnayan product names use Papic/Panood
         └────────────────┘
```

## Iteration-by-iteration migration status

| Iteration | Folder rename | Filename rename | Content rename | Cross-refs | Notes |
|---|---|---|---|---|---|
| 0000 App Shell | n/a | n/a | ✓ | ✓ | Launcher tile labels updated |
| 0001 Guest List | n/a | n/a | ✓ | ✓ | Cross-refs to Papic seat logic |
| 0002 QR Invitations | n/a | n/a | ✓ | ✓ | Personal QR is gateway for Papic + Panood |
| 0003 Billing Rail | n/a | n/a | ✓ | ✓ | Mockup HTML updated |
| 0006 Vendors | n/a | n/a | ✓ | ✓ | Sidebar mockup uses new names |
| 0007 Budget | n/a | n/a | ✓ | ✓ | Auto-population SKUs renamed |
| 0008 Seating Chart | n/a | n/a | ✓ | ✓ | Table QR downstream consumer line updated |
| 0009 Photo Delivery | n/a | n/a | ✓ | ✓ | Mockup shows Papic seats |
| 0010 Mood Board | n/a | n/a | ✓ | ✓ | No direct dependencies, narrative updated |
| **0011 Panood** | ✓ | ✓ | ✓ | n/a | Was Live Stream |
| **0012 Papic** | ✓ | ✓ | ✓ | n/a | Was Paparazzi |
| 0013 Platform Stack | n/a | n/a | ✓ | ✓ | Service references updated |
| 0015 Marketing Site | n/a | n/a | ✓ | ✓ | Public-facing product names updated |
| 0016 Plan Builder | n/a | n/a | ✓ | ✓ | Narrative updated |
| **0017 Patiktok** | NEW | NEW | n/a | n/a | New iteration — only .md exists, .html + .docx pending |
| 00_Iteration_Connection_Map | n/a | n/a | ✓ | ✓ | Folder paths + SKU keys updated |

## Open migration gaps

| Gap | Severity | Action required |
|---|---|---|
| **CLAUDE.md content not swept** | HIGH | Owner reviews + updates iteration table, SKU table, decision log entries, memory references |
| **.docx companion files not updated** | MEDIUM | Regenerate .docx from .md OR manual update in Word for 0011 + 0012 |
| **0017 Patiktok .html and .docx missing** | MEDIUM | Generate companion files per the 3-files-per-iteration workflow rule |
| **YouTube API references in 09_Panood spec** | NONE | Intentional. These are external SDK names, must stay. |
| **Memory files reference old names** | LOW | Update `project_tayo_livestream_youtube_delivery.md` etc. as a future cleanup |
| **Master pricing workbook** | DONE | Build script renamed; rebuilt successfully |
| **00_Pricing_and_Costs.xlsx** | UNKNOWN | Was identified stale in earlier audit; needs verification |
| **Other root-level .docx** (06_Pricing_Magazine, 05_Customer_Magazine, etc.) | LOW | Old marketing copy; can be regenerated when needed |

## What Claude Code should know (TL;DR for future agents)

1. **The iteration folders for broadcast and capture are now `0011_panood/` and `0012_papic/`.** Older folder paths in your tools or memory should be considered stale.
2. **The product names are Panood (broadcast) and Papic (capture).** Use these in all new code, specs, UI strings, and marketing copy.
3. **The new iteration `0017_patiktok/` defines a guest mimic station** with X-mark floor sticker, 3-sec per-guest mimic compilation, and looping Setnayan-owned music.
4. **SLR Sync is the shared cross-iteration SKU** between Papic and Panood (was Pro Camera Bridge). Same ₱99/cam pricing for both surfaces.
5. **Music catalogue, R2 storage, face vectors are shared infrastructure** consumed by Papic, Panood, and Patiktok.
6. **YouTube API uses `liveStreams.insert`, `liveBroadcasts.bind`, etc.** — these external SDK names stay as-is in the Panood spec, do NOT replace.
7. **CLAUDE.md is the canonical product spec.** It has NOT been swept of old names yet — owner decision pending. When updating CLAUDE.md, follow the rename rules in this audit.

## Companion artifacts updated in this session

| File | Status |
|---|---|
| `Pricing_Workbook_Plain_English.xlsx` | ✓ rebuilt with all new SKUs and renames |
| `Cost_vs_Revenue_Analysis.xlsx` | ✓ rebuilt with revised costs + new SKUs |
| `Revenue_Slider_Prototype.html` | ✓ updated with Panood + Papic naming |
| `CHANGELOG_2026-05-11.md` | ✓ created — canonical reference for the session's changes |
| `MIGRATION_AUDIT_2026-05-11.md` | ✓ this file — deep-dive migration report |

---

*Migration executed 2026-05-11. All grep counts verified zero for Setnayan-product references outside of YouTube API context and CLAUDE.md.*
