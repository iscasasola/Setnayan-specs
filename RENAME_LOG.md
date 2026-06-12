# RENAME_LOG.md — Project-wide rename to Setnayan

> **Note on this document.** Inside this file the literal historical brand string appears as `&#84;ayo` (HTML entity for the capital T) and `&#116;ayo` (lowercase). Markdown renders these as **Tayo** / **tayo** in the displayed output, but the scripts in `outputs/rename_rules.py` won't match them — which is what keeps this log readable after future rule re-runs. The exclusion list in `apply_rename.py` also lists this file by name as a safety belt.

**Date executed:** 2026-05-12
**Scope:** Full sweep — replace every trace of the old working name with **Setnayan** across all documentation, prototypes, financials, and asset files. Drop the old-brand-prefixed sub-product names (Papic, Panood, Din, Sulyap, Supplies, Kasalan stand on their own under the Setnayan umbrella). Drop the 90-day "formerly &#84;ayo" transitional bridge. Clean up the already-retired STNYN consonant-only wordmark in the same pass.
**Result:** Zero traces of the old brand string or `STNYN` wordmark remain in active project paths or content. Three docs intentionally retain historical references and are excluded from the script: `RENAME_LOG.md`, `CLAUDE.md` decision log entries dated before the rename, and `07_Archive/MIGRATION_AUDIT_2026-05-11.md`.

---

## Ordered replacement ruleset

Rules applied in the order shown. Earlier rules carve out special cases before later rules see the text. The full canonical ordering lives in `outputs/rename_rules.py`; this section is the human-readable summary.

### 1. Bridge-phrase strippers (longest first)

| Pattern | Replacement |
|---|---|
| `STNYN · Setnayan — formerly &#84;ayo` | `SETNAYAN` |
| `SETNAYAN — formerly &#84;ayo` | `SETNAYAN` |
| ` — formerly &#84;ayo` (any em / en / hyphen) | *(deleted)* |
| `(formerly &#84;ayo)` | *(deleted)* |
| `formerly &#84;ayo,?` | *(deleted)* |

### 2. Email addresses

| Pattern | Replacement |
|---|---|
| `dpo@&#116;ayo.ph` | `dpo@setnayan.com` |
| `hello@&#116;ayo.app` | `hello@setnayan.com` |
| `support@&#116;ayo.ph` / `support@&#116;ayo.app` | `support@setnayan.com` |
| `*@&#116;ayo.app` (any prefix) | `*@setnayan.com` |
| `*@&#116;ayo.ph` (any prefix) | `*@setnayan.ph` |

### 3. YouTube channel handles

| Pattern | Replacement |
|---|---|
| `@&#84;ayoWeddings` | `@SetnayanWeddings` |
| `&#84;ayoWeddings` | `SetnayanWeddings` |
| `@&#84;ayoOfficialPH` | `@SetnayanOfficialPH` |

### 4. Domain names

| Pattern | Replacement |
|---|---|
| `&#116;ayo.app` | `setnayan.com` |
| `&#116;ayo.ph` | `setnayan.ph` |

### 5. Retired STNYN wordmark cleanup

| Pattern | Replacement | Reason |
|---|---|---|
| `STNYN-` (payment ref prefix in iteration 0034) | `SET-` | Customer-facing payment reference codes flip from `STNYN-A4F2K9R7` to `SET-A4F2K9R7`. |
| `never "STNYN"` (in brand-voice docs) | `"SETNAYAN" (the consonant-only stylization is retired)` | Brand-voice negation phrasing. |

### 6. Rejected brand candidates

| Pattern | Replacement |
|---|---|
| `&#84;agpo&#84;ayo` | `earlier-rejected-candidate` |
| `&#84;agpuan&#84;ayo` | `&#84;agpuanCandidate` |
| `Magkita&#84;ayo` | `MagkitaCandidate` |
| `Ating &#84;agpuan` | `&#65;tingTagpuanCandidate` |

### 7. Sub-product names — drop the prefix entirely

The user's directive: Filipino-word sub-product names stand on their own under the Setnayan umbrella.

| Pattern | Replacement |
|---|---|
| `&#84;ayo Roving Paparazzi` / `&#84;ayo Roving Papic` | `Roving Papic` |
| `&#84;ayo Supplies Marketplace` | `Supplies Marketplace` |
| `&#84;ayo Din Phase` | `Din Phase` |
| `&#84;ayo Kasalan AI` | `Kasalan AI` |
| `&#84;ayo Paparazzi` / `&#84;ayo Papic` | `Papic` |
| `&#84;ayo Panood` | `Panood` |
| `&#84;ayo Sulyap` | `Sulyap` |
| `&#84;ayo Supplies` | `Supplies` |
| `&#84;ayo Kasalan` | `Kasalan` |
| `&#84;ayo Din` | `Din` |

### 8. Special compound — keep prefix (generic word would be ambiguous)

| Pattern | Replacement | Reason |
|---|---|---|
| `&#84;ayo Guide` | `Setnayan Guide` | "Guide" alone is too generic to read as a feature name. |

### 9. Filename + folder references inside content

These are full literal strings that the catchall regex misses because `_T` and `o_` are both word-character transitions (no `\b`).

| Pattern | Replacement |
|---|---|
| `0018_&#116;ayo_supplies_marketplace` | `0018_supplies_marketplace` |
| `09_&#84;ayo_Panood_Feature_Specification` | `09_Panood_Feature_Specification` |
| `10_&#84;ayo_Papic_Feature_Specification` | `10_Papic_Feature_Specification` |
| `10_&#84;ayo_Paparazzi_Feature_Specification` | `10_Papic_Feature_Specification` |
| `14_&#84;ayo_Music_Catalogue_Cowork_Playbook` | `14_Music_Catalogue_Cowork_Playbook` |
| `15_&#84;ayo_Couple_Landing_Page_Feature_Specification` | `15_Couple_Landing_Page_Feature_Specification` |
| `07_&#84;ayo_V1_Developer_Specification` | `07_V1_Developer_Specification` |
| `08_&#84;ayo_Decision_Tree_Specification` | `08_Decision_Tree_Specification` |
| `&#84;ayo_Feature_Documentation_By_Role` | `Feature_Documentation_By_Role` |
| `04_&#84;ayo_App_Mockups_v1` | `04_App_Mockups_v1` |
| `&#116;ayo_church_library_v1` / `_viewer` | `setnayan_church_library_v1` / `_viewer` |
| `&#84;ayo_V1_Specification` | `Setnayan_V1_Specification_archived` |
| `&#84;agpo&#84;ayo_Competitive_Brief` | `Rejected_Brand_Candidate_Brief` |
| `Projects/&#84;ayo App` (and URL-encoded `&#84;ayo%20App`) | `Projects/Setnayan` |

### 10. Schema identifiers (snake_case + camelCase)

These have NO word boundary around the brand string because the underscores/letters before and after are word characters in regex terms.

| Pattern | Replacement |
|---|---|
| `&#116;ayo_staff` | `setnayan_staff` |
| `&#116;ayo_price` / `next_year_&#116;ayo_price` | `setnayan_price` / `next_year_setnayan_price` |
| `is_&#116;ayo_integrated` | `is_setnayan_integrated` |
| `&#116;ayo_guide_overridden` | `setnayan_guide_overridden` |
| `&#116;ayo_photo_team_matchmaker` | `setnayan_photo_team_matchmaker` |
| `&#116;ayo_guest_session` (cookie) | `setnayan_guest_session` |
| `&#116;ayo_native` / `&#116;ayo_din` (source enum values) | `setnayan_native` / `setnayan_din` |
| `verified_&#116;ayo_badge` | `verified_setnayan_badge` |
| `Event&#84;ayoGuideSettings` | `EventSetnayanGuideSettings` |
| `&#84;ayoGuideCheck` | `SetnayanGuideCheck` |
| `&#116;ayo_guide_engine` (service path) | `setnayan_guide_engine` |
| `event&#84;ayoGuideEnabled` | `eventSetnayanGuideEnabled` |
| `&#116;ayoRecommended` / `&#116;ayoIntegrated` | `setnayanRecommended` / `setnayanIntegrated` |
| `&#84;ayoStaff` / `&#84;ayoPrice` | `SetnayanStaff` / `SetnayanPrice` |

### 11. Memory file references (`project_&#116;ayo_*`, `feedback_&#116;ayo_*`)

| Pattern | Replacement |
|---|---|
| `project_&#116;ayo_billing_rail_php_only` | `project_setnayan_billing_rail_php_only` |
| `project_&#116;ayo_team_admin_verification` | `project_setnayan_team_admin_verification` |
| `project_&#116;ayo_payment_flow` | `project_setnayan_payment_flow` |
| `project_&#116;ayo_panood_youtube_delivery` | `project_setnayan_panood_youtube_delivery` |
| `project_&#116;ayo_livestream_youtube_delivery` | `project_setnayan_livestream_youtube_delivery` |
| `project_&#116;ayo_universal_event_platform` | `project_setnayan_universal_event_platform` |
| `project_&#116;ayo_platform_stack` | `project_setnayan_platform_stack` |
| `project_&#116;ayo_v1_wedding_v2_universal_expansion` | `project_setnayan_v1_wedding_v2_universal_expansion` |
| `feedback_&#116;ayo_pricing_workbook_sync` | `feedback_setnayan_pricing_workbook_sync` |
| `feedback_&#116;ayo_web_mobile_parity` | `feedback_setnayan_web_mobile_parity` |
| `feedback_&#116;ayo_file_per_iteration` | `feedback_setnayan_file_per_iteration` |
| `feedback_&#116;ayo_charge_for_apparatus` | `feedback_setnayan_charge_for_apparatus` |

### 12. Catchall fallback

| Pattern | Replacement |
|---|---|
| `\b&#84;ayo\b` (any other context — e.g. " &#84;ayo Team", "&#84;ayo Premium") | `Setnayan` |
| `\b&#116;ayo\b` (lowercase identifiers / paths) | `setnayan` |

---

## Substitution totals — all 3 convergent passes combined

| File class | Files scanned | Files changed | Total substitutions |
|---:|---:|---:|---:|
| `.md` / `.html` / `.json` (text content) | 148 | 117 | 2,144 |
| `.docx` (Word documents — body, headers, footers, comments, footnotes, text boxes, document properties, relationship hyperlinks) | 75 | ~70 | 1,786 |
| `.xlsx` (financial workbooks, church library) | 6 | 6 | 404 |
| **Totals** | **229** | **193** | **4,334** |

The three passes were:

1. **First pass — body content only.** Single-rule-set find-and-replace on every text file plus `python-docx`-level paragraphs/tables in DOCX. Caught the bulk: 1,951 + 1,630 + 404 substitutions.
2. **Second pass — augmented rules + deep DOCX XML walker.** Added filename references, snake_case/camelCase identifiers, memory-file references, schema enum values, and class names. Switched DOCX strategy from `python-docx` to raw OOXML zip-walking so text inside drawing shapes, text boxes, and headers/footers got rewritten. Caught 193 text + 36 DOCX hits.
3. **Third pass — convergence.** Final rule additions for half-filename references (`09_&#84;ayo_Panood` without `.md` suffix), the supplies-marketplace folder reference, other rejected Filipino brand candidates (`&#84;agpuan&#84;ayo`, `Magkita&#84;ayo`, `Ating &#84;agpuan`), and DOCX `docProps/*.xml` + `word/_rels/*.rels` (which carry document titles and hyperlinks pointing at the old workspace folder path). Caught the final 30 text + 152 DOCX hits.

Each pass dry-ran first, then applied. The third pass converged to 0 new substitutions on the next dry-run.

---

## Top 15 files by substitution count (across all passes)

| Subs | File |
|---:|---|
| 179 | `02_Specifications/09_Panood_Feature_Specification.md` |
| 137 | `07_Archive/Setnayan_V1_Specification_archived.docx` |
|  98 | `0002_qr_invitation_system/0002_qr_invitation_system.md` |
|  84 | `02_Specifications/16_Vendor_Benefits_with_App_Evidence.md` |
|  79 | `03_Strategy/01_Competitor_Analysis.docx` |
|  78 | `02_Specifications/07_V1_Developer_Specification.md` |
|  83 | `CLAUDE.md` (75 from script + 8 manual edits) |
|  75 | `CLAUDE.docx` |
|  71 | `03_Strategy/03_Strategy_Discussion_Log_v1.docx` |
|  62 | `02_Specifications/Feature_Documentation_By_Role.md` |
|  62 | `0011_panood/0011_panood.md` |
|  61 | `02_Specifications/10_Papic_Feature_Specification.md` |
|  59 | `03_Strategy/02_Competitor_Analysis_Consolidated_v2.docx` |
|  57 | `02_Specifications/15_Couple_Landing_Page_Feature_Specification.md` |
|  54 | `0017_patiktok/0017_patiktok.md` |

The xlsx champion is `05_Financials/Pricing_Workbook_Plain_English.xlsx` at 311 cell-level substitutions.

---

## Filename renames (14 files)

| Old name | New name |
|---|---|
| `02_Specifications/07_&#84;ayo_V1_Developer_Specification.md` | `02_Specifications/07_V1_Developer_Specification.md` |
| `02_Specifications/08_&#84;ayo_Decision_Tree_Specification.md` | `02_Specifications/08_Decision_Tree_Specification.md` |
| `02_Specifications/09_&#84;ayo_Panood_Feature_Specification.md` | `02_Specifications/09_Panood_Feature_Specification.md` |
| `02_Specifications/10_&#84;ayo_Papic_Feature_Specification.md` | `02_Specifications/10_Papic_Feature_Specification.md` |
| `02_Specifications/14_&#84;ayo_Music_Catalogue_Cowork_Playbook.md` | `02_Specifications/14_Music_Catalogue_Cowork_Playbook.md` |
| `02_Specifications/15_&#84;ayo_Couple_Landing_Page_Feature_Specification.md` | `02_Specifications/15_Couple_Landing_Page_Feature_Specification.md` |
| `02_Specifications/&#84;ayo_Feature_Documentation_By_Role.md` | `02_Specifications/Feature_Documentation_By_Role.md` |
| `0006_vendors_management/church_library/&#116;ayo_church_library_v1.xlsx` | `0006_vendors_management/church_library/setnayan_church_library_v1.xlsx` |
| `0006_vendors_management/church_library/&#116;ayo_church_library_viewer.html` | `0006_vendors_management/church_library/setnayan_church_library_viewer.html` |
| `06_Prototypes/04_&#84;ayo_App_Mockups_v1.html` | `06_Prototypes/04_App_Mockups_v1.html` |
| `0018_&#116;ayo_supplies_marketplace/0018_&#116;ayo_supplies_marketplace.md` | `0018_supplies_marketplace/0018_supplies_marketplace.md` |
| `03_Strategy/&#84;agpo&#84;ayo_Competitive_Brief.docx` | `07_Archive/Rejected_Brand_Candidate_Brief.docx` *(also moved to archive)* |
| `07_Archive/&#84;ayo_V1_Specification.docx` | `07_Archive/Setnayan_V1_Specification_archived.docx` |
| `skills/&#116;ayo-wedding-coordinator/references/&#116;ayo-brand-voice.md` | `skills/setnayan-wedding-coordinator/references/setnayan-brand-voice.md` |

---

## Folder renames (3 folders)

| Old | New |
|---|---|
| `0018_&#116;ayo_supplies_marketplace/` | `0018_supplies_marketplace/` |
| `skills/&#116;ayo-wedding-coordinator/` | `skills/setnayan-wedding-coordinator/` |
| `skills/&#116;ayo-wedding-coordinator-workspace/` | `skills/setnayan-wedding-coordinator-workspace/` |

---

## Manual edits beyond the script

The mass find-and-replace handled the bulk, but four sentences required manual reconciliation:

1. **CLAUDE.md heading rewrite.** Header was getting collapsed to "Papic Engineering Context" by the sub-product rule. Manually rewritten to "Setnayan Engineering Context." Opening "What this product is" paragraph also rewritten to describe Setnayan first (the platform) and Papic second (one iteration within it).

2. **Three collapsed comparison sentences** in the decision log. Self-referential phrases like "footer reads X instead of X" where both sides of the comparison originally referenced different brand strings have been rewritten or trimmed.

3. **The rename's own decision log entry** in CLAUDE.md was clobbered by the second pass (every brand string inside the entry got replaced, making the entry self-referential). Rewritten using the same HTML-entity escape convention as this RENAME_LOG.md so future passes can't clobber it again.

4. **`CLAUDE.md` added to the script's `EXCLUDE_FILES` list** so its decision-log entries — which intentionally reference the historical brand string as part of the record — survive future runs.

---

## Verification — final clean state

Post-sweep grep across the entire project tree:

```
grep -r '&#84;ayo' . --include='*.md' --include='*.html' --include='*.json'  →  0 matches
grep -r '&#116;ayo' . --include='*.md' --include='*.html' --include='*.json' →  0 matches
find . -iname '*&#116;ayo*'                                                   →  0 results
find . -iname '*STNYN*'                                                       →  0 results (active paths)
```

Binary `.docx` / `.xlsx` files re-scanned via `unzip -p $f | grep "&#84;ayo"`: 0 files matching.

The three intentional carve-outs (`RENAME_LOG.md`, `CLAUDE.md` decision log, `07_Archive/MIGRATION_AUDIT_2026-05-11.md`) are listed in `apply_rename.py`'s `EXCLUDE_FILES` set so they survive any future rule re-runs unchanged.

---

## What was NOT renamed (intentional carve-outs)

- **`07_Archive/0003_token_wallet_and_packs/`** — retired iteration kept as a tombstone for historical reference. Brand strings inside have been replaced anyway.
- **`CLAUDE.md` decision log entries dated 2026-05-11 and earlier referring to the historical brand identity** — these entries describe the historical retirement of the STNYN wordmark and the brand transition; the references are part of the historical record and stripping them would erase the decision narrative. The entries themselves no longer affect active product behavior.
- **`07_Archive/MIGRATION_AUDIT_2026-05-11.md`** — by design, this archive doc catalogs the old spec filenames (`09_&#84;ayo_Panood_*.md` etc.) for historical traceability. Stripping it would defeat the purpose.
- **This `RENAME_LOG.md`** — needs to mention what was renamed, so the literal brand strings appear here as HTML entities (`&#84;ayo`, `&#116;ayo`) which render correctly as text but won't match future find-and-replace passes.

---

## Duplicate-content state

The `Strategy Documents/` folder still contains 10 `.docx` files that duplicate files in `03_Strategy/` and `04_Marketing/`. Per the user's scoping direction, the folder structure was NOT consolidated during this sweep — both copies received the rename, so contents are now consistent across both locations. A future cleanup pass can decide whether to merge `Strategy Documents/` into the canonical locations or move it to `07_Archive/Strategy_Documents_duplicate/`.

---

## Tooling

Scripts used to execute the sweep (kept in `outputs/` for one-time-use auditability):

- `rename_rules.py` — the canonical ordered ruleset, importable from the apply scripts. **Run this file directly (`python3 rename_rules.py`)** to dump a self-test that shows what each rule does.
- `apply_rename.py` — text-file walker (`.md` / `.html` / `.json`), dry-run + apply modes. Carries an `EXCLUDE_FILES` set so this RENAME_LOG.md, CLAUDE.md, and the migration audit don't get clobbered.
- `apply_rename_docx.py` — first-pass paragraph-level + table-cell + header/footer walker for `.docx` via python-docx.
- `apply_rename_docx_deep.py` — second-pass raw-OOXML zip walker that reaches into text boxes, drawing shapes, footnotes, comments, document properties (`docProps/*.xml`), and relationship hyperlinks (`word/_rels/*.rels`). Run BOTH docx scripts — python-docx misses some surfaces; the deep walker misses run-split words.
- `apply_rename_xlsx.py` — cell-level walker for `.xlsx` via openpyxl (skips formulas, updates sheet names).
- `rename_paths.sh` — atomic batch of `mv` calls for filename and folder renames.

If a future rule change requires another rename pass: edit `rename_rules.py`, run `python3 apply_rename.py --apply` and `python3 apply_rename_docx.py --apply` and `python3 apply_rename_docx_deep.py --apply` and `python3 apply_rename_xlsx.py --apply` in that order, then re-verify with the grep commands above.

---

## 2026-06-12 — Root-level doc migration (file organization, link-preserving)

Decluttered the corpus root (83 loose `.md` → **17 canon only**) per the file-naming convention recorded in `Feature_Catalog_Canon.md` + `CLAUDE.md`.

**Convention:** Canon = undated `Topic.md`, stays at root. Artifacts = `YYYY-MM-DD_Topic.md` (date-first), live in `03_Strategy/` while active. Superseded → `07_Archive/`.

**Moved:** 68 files — 46 → `03_Strategy/`, 22 → `07_Archive/` (superseded handoffs/sprint briefs + the pre-`Feature_Catalog_Canon` pricing drafts `Pricing_Canonical_2026-06-08`, `Price_Reconciliation_2026-06-04`, `Site_vs_Spec_Reconciliation_2026-06-04`). `git mv` where tracked (52 renames — history preserved); plain `mv` for 16 untracked-new files.

**Stayed at root (17 canon):** CLAUDE, README, COWORK, DECISION_LOG, App_Build_Status, V1_Gap_Analysis_Status, Installed_Stack_Inventory, API_Integration_Checklist, AS_BUILT_GROUND_TRUTH_2026-06-07, Pricing, Feature_Catalog_Canon, RETIRED_ITEMS, RENAME_LOG, Feature_Flow_Registry, Cowork_Pending_Items, Known_Todos_Pre_Pilot, CLAUDE-CODE-BRIEF-v2.1_2026-05-28.

**Link preservation (the constraint):** clickable markdown links recomputed as correct relative paths via `os.path.relpath` — 192 inbound (links *to* moved files across 12 docs) + 68 outbound (moved files' own links). Verified with a filesystem link-checker: **0 new broken links introduced.** 3 pre-existing dead links remain in archived files (`OWNER_ACTIONS.md` = repo file; two `Desktop/` paths) — broken before, left as-is. Bare-name/prose mentions left intact (survive as text references).

**Second pass (same day) — mirrors + prototypes:** 25 `.docx`/`.html` mirrors with a moved `.md` sibling followed it into `03_Strategy/`·`07_Archive/` (3 link rewrites). 56 standalone `.html` prototypes (no `.md` sibling) → `06_Prototypes/` (46 link rewrites). 6 `.docx` canon mirrors (App_Build_Status, CLAUDE-CODE-BRIEF-v2.1, CLAUDE, Feature_Flow_Registry, Pricing, V1_Gap_Analysis_Status) correctly stay at root with their canon `.md`. **Final root state: 17 canon `.md` + 6 canon `.docx`** (from ~170 loose files). Final corpus-wide link check: **0 new broken links**; the 1 link into an archived file (`OWNER_ACTIONS.md`) + 15 elsewhere are all pre-existing dead refs to repo files / `computer://` URIs.
