# RETIRED_ITEMS.md — Things no longer part of the Setnayan app

> **Purpose.** A single canonical list of every spec, feature, SKU, brand asset, vendor concept, or design choice that has been **retired**, **superseded**, **deferred out of V1**, or **explicitly cut**. Useful when reading specs to know what is *no longer load-bearing* even if it still appears in historical decision-log entries.

**Last updated:** 2026-05-12, post-rename sweep.
**Sources:** CLAUDE.md decision log, `07_Archive/` folder, iteration "What's NOT in V1" sections, and brand-evolution decisions.

---

## A. Retired iterations (folder-level)

| Iteration | Status | Replaced by | Where it lives now |
|---|---|---|---|
| **0003 Token Wallet and Packs** | RETIRED 2026-05-11 | Iteration 0034 (PHP-direct apply-then-pay) | `07_Archive/0003_token_wallet_and_packs/` (tombstone) |
| **0020 Admin Console (v1)** | SUPERSEDED 2026-05-12 | Iteration 0023 (admin console v2 with .md + .html) | `07_Archive/0020_admin_console/` (tombstone) |
| **0027 E-signature** | RETIRED before drafting | Manual PDF signing in V1 + PandaDoc/DocuSign in V1.5 | No folder; documented in Vendor Agreement § 12.1 |
| **0014 V1.1 Polish** | QUEUED (no folder yet) | — | Empty placeholder for post-V1 polish work |
| **0017 Patiktok** | RETIRED 2026-06-29 (owner "delete all data about patiktok") | — (guest TikTok-reel concept cut) | `0017_patiktok/` (tombstone). DB: `PATIKTOK_COMPILER` deactivated + `setnayan_patiktok` taxonomy hidden + 6 inactive `patiktok_*` service_catalog rows. **PENDING a removal PR:** drop the 6 `patiktok_*` tables (`patiktok_oauth_state/grants`, `patiktok_music_tracks`, `patiktok_source_clips`, `patiktok_render_jobs`, `patiktok_render_job_clips`), delete inactive catalog rows, remove the app code. See DECISION_LOG 2026-06-29. |

The retirement principle: **tombstone, don't delete.** Each retired folder keeps a one-line README pointing at its replacement so anyone navigating by iteration number lands somewhere meaningful.

---

## B. Retired SKUs / pricing concepts

- **Token wallet** — the entire 30-tokens-per-peso accounting model. Replaced by PHP-direct charm-pricing (₱49, ₱199, ₱1,499, ₱2,499 endings).
- **Pack ladders** — the multi-tier prepurchase model where couples bought bigger packs for "bonus tokens." Replaced by per-SKU PHP charges.
- **"Clean × 30 token math" pricing convention** — the requirement that every SKU resolve to a clean integer token count. Retired alongside the token wallet 2026-05-11.
- **Major-label music licensing** — never shipped. Catalogue is owned AI-generated only (Suno Premier one-time pay).
- **₱999 Wedding Ceremony +3 hrs Live Stream add-on** — violated the apparatus rule (selling hours of crew coverage). Dropped 2026-05-09.
- **Standalone ₱499 Facebook Live add-on** — folded into Live Stream Tier 4 then folded out entirely when V1 went YouTube-only.
- **Live Stream Tiers 5–8 (crew-bundled)** — bundled human crew into the SKU price. Violated the apparatus rule ("we only charge for the tool, not the operator"). Cut from V1 2026-05-09.
- **Save-the-Date Render at ₱50 round** — flipped to ₱49 under charm-pricing 2026-05-12.
- **Cleaner-round ₱100 / ₱200 / ₱500 / ₱1,000 SKU prices** — all flipped to ₱99 / ₱199 / ₱499 / ₱999 etc. 2026-05-12. The "clean × 30 math" rationale is gone with the token wallet.
- **3% Setnayan Pay convenience fee on vendor bookings** — still active; flagged here only because earlier drafts considered embedding it in the vendor price (rejected — it's a transparent line item on the customer invoice).

---

## C. Retired brand identity

- **"Tayo" working name** — the entire prior project name. Replaced by **Setnayan** 2026-05-12. See `RENAME_LOG.md` for the exact ruleset.
- **STNYN consonant-only wordmark** — proposed 2026-05-11 as a brand candidate in the TMBLR / GRNDR / SVDKA stylization tradition. Retired 2026-05-12 in favor of the full **SETNAYAN** spelling. More legible at small sizes; reads more obviously Filipino in voice. Logo files `0015_stnyn_logo*.svg` retained in the iteration folder for reference but not active.
- **8-ray Katipunan sun glyph** — the originally proposed symbol mark accompanying STNYN. Retired before pin+star was proposed.
- **Pin+star primary brandmark** — the interim direction (terracotta pin with 5-point star inside, paired with "Set na 'yan." pin-as-apostrophe lockup) proposed 2026-05-11. Retired 2026-05-12 in favor of the uploaded custom symbol mark at `0015_main_website/setnayan_logo.svg`.
- **TagpoTayo brand candidate** — rejected earlier brand candidate evaluated in a competitive brief. File moved to `07_Archive/Rejected_Brand_Candidate_Brief.docx`. Other rejected Filipino candidates documented in the same brief: TagpuanTayo, MagkitaTayo, Ating Tagpuan.
- **"SETNAYAN — formerly Tayo" 90-day footer bridge** — the planned 90-day post-launch transition footer that would have shown both names. Scrapped 2026-05-12 in favor of a clean break; the rename happens pre-launch so the bridge is unnecessary.
- **STNYN- payment reference prefix** in iteration 0034 — `STNYN-XXXXXXXX` reference codes. Flipped to `SET-XXXXXXXX` during the rename sweep.

---

## D. Features deferred from V1 (not deleted, just not V1)

These live in iteration spec **"What's NOT in V1"** sections and / or in `Part 6` of the Papic master spec. They may ship in V1.1, V1.5, V2, or later.

### Papic (candid capture) — deferred from V1

- All-Guest Unlock tier (every guest can shoot via web)
- Native Pro Capture Pack (RAW, manual focus peaking, ISO/shutter)
- Setnayan Roving Paparazzi service tier (staff photographers as a service)
- Premium Photojournalism + Photo Book
- AI Top-50 same-day curation
- Live Photo Wall venue projection
- Photo Mission system / crew leaderboard
- Cross-paparazzi de-duplication
- BYO music in Personal Reels (CapCut-style client-side render)
- Multi-DSLR-per-phone (V1 is 1 phone : 1 DSLR)
- USB tether for DSLR pairing (V1 is WiFi-SDK only)
- Photo Center curator role
- Wedding-day profile photo auto-update
- Extended sort/filters beyond the 4 V1 essentials
- Battery escalation tiers at 10% and 5% (V1 is 20% warning only)
- Delivered-status indicator + couple nudge

### Coordinator surfaces — entirely deferred from V1

The blueprint's coordinator-facing cluster is **out of V1 scope**:

- Web QR scanning station
- Multi-staff PIN access
- Three scanning modes
- Real-time arrival count
- Broadcast notifications
- Dietary tracker
- Encrypted local data bundle
- Thermal label printer support
- Geo-tag arrival
- Post-event PDF

The only V1 coordinator-facing surface is the vendor list in iteration 0006 (so coordinators can call vendors). Coordinators in V1 are a **vendor service category** ("Wedding Coordination" — one of the 28 canonical categories) — not a separate platform role.

### Notification channels — deferred from V1

- Push notifications (FCM / APNs)
- SMS fallback
- Email fallback was V1-deferred → then promoted to V1 as iteration 0028

V1 ships in-UI surfacing across every iteration that needs it, plus the email channel from 0028.

### Live Stream — deferred from V1

- Native iOS/Android camera-operator apps for Live Stream (V1 is pure WebApp + YouTube delivery)
- Same-Day Edit (vision-AI cost too high at ~₱9,500/event; revisit V1.1)
- Cloudflare Stream Player viewer embed (delivery is YouTube-only; viewer count uncapped)

### Papic — retired SKUs

- **SDE (Same-Day Edit) — Papic add-on · RETIRED 2026-06-28 (owner "remove SDE fully").** The ~3-minute crew-delivered video compilation add-on (serviceKey `SDE`, sku `same_day_edit`, was ₱3,499→₱4,999/₱7,999). Ripped out of the code fully (PR #2362): dedicated `/admin/sde` + `/studio/sde` surfaces deleted, removed from catalogs/entitlements (MEDIA_PACK 18→17), offline service codes (7→6), onboarding/marketing/pricing; forward migration `20270316029217_remove_sde.sql` drops `events.sde_*` columns + soft-deactivates catalog rows. **Kept (NOT retired):** Stories (free story-maker) and Auto-Recap (60–90s auto highlight) — both were entangled with SDE in code and deliberately preserved.

- **SDE (Same-Day Edit) — Panood/flagship human-curated render · RETIRED 2026-06-28 (owner "remove same day edit").** The separate ₱24,999/event "post-event human-curated highlight" (3–5 min cinematic film, `0011_panood.md §583`) — distinct from the Papic add-on above, corpus-only (no code/DB SKU ever shipped). Removed from `Pricing.md` (catalog + cost-shape + bundle-map rows) + `0011_panood.md` (§583 RETIRED banner + the §112 mention) + the `/features` marketing copy (PR #2370). SDE is now FULLY dead in both forms. Surviving render outputs: Stories (free) + Auto-Recap (≤30s).

### Other deferred surfaces

- Marketplace search (Tier-2 gap-analysis item) — deferred to a follow-up cycle
- Stylist persona, inspirations paste board, role outfit galleries, venue segments with photos/videos, concept-vs-actual in Mood Board — all deferred until stylist persona exists (V2 / Tayo Din supplier app phase)
- V1.5 GCash Merchant API integration (V1 is manual reconciliation; activation latency drops from 24-hr to minutes when V1.5 ships)
- PayMongo integration (under evaluation for V1.5)

---

## E. Deprecated documents / files

- **`07_Archive/Setnayan_V1_Specification_archived.docx`** (formerly `Tayo_V1_Specification.docx`) — the original single-doc V1 spec, superseded by the modular iteration-folder model.
- **`07_Archive/Rejected_Brand_Candidate_Brief.docx`** (formerly `TagpoTayo_Competitive_Brief.docx`) — competitive brief evaluating the rejected TagpoTayo / TagpuanTayo / MagkitaTayo / Ating Tagpuan brand candidates.
- **`02_Specifications/07_V1_Developer_Specification.md`** — RETIRED at the top of file 2026-05-12 per the dev-readiness audit. Kept for historical reference but no longer the canonical source. Specific contradictions and stale claims are documented inline.
- **`0015_main_website/0015_stnyn_logo*.svg`** files — three SVG variants of the retired STNYN wordmark. Retained for reference but no longer active brand assets.
- **`0015_main_website/0015_stnyn_logo_preview.html`** — the working visual preview for the retired STNYN direction. Retained as a historical reference; not part of active site.
- **`07_Archive/0003_token_wallet_and_packs/`** — the retired token-wallet iteration folder.
- **`07_Archive/0020_admin_console/`** — the retired admin-console-v1 iteration folder.
- **`07_Archive/CHANGELOG_2026-05-11.md`** — snapshot of the pre-rename project state.
- **`07_Archive/MIGRATION_AUDIT_2026-05-11.md`** — audit of the spec migration when iterations were renumbered (excluded from the rename sweep so its old filenames stay legible as historical record).
- **`Strategy Documents/` folder (10 .docx files)** — duplicates of files in `03_Strategy/` and `04_Marketing/`. Both copies updated by the rename pass; consolidation to a single source pending a future cleanup decision.

---

## F. Design decisions explicitly reversed

- **Token wallet pivot (2026-05-08) → token wallet retired (2026-05-11).** Three days. The pivot was a real product direction; the retirement was driven by the desire for a simpler PHP-direct model that aligns with how Filipino e-commerce actually works.
- **`vendors` table at iteration 0006 (couple-event-scoped) → renamed `event_vendor_relationships`.** The canonical marketplace `vendors` table now lives at iteration 0022. The dev-readiness audit caught the naming collision 2026-05-12.
- **8-tier Paparazzi pricing (early V1 drafts) → 2-tier (3-Paparazzi + 5-Paparazzi).** Locked 2026-05-08.
- **Personal Reel fixed 30-second duration → 1–30 second flexible.** 2026-05-08.
- **AI sequencer builds template once per wedding → 500-template pre-made library.** 2026-05-08.
- **BYO music in Personal Reels → catalog-only (server-side render legal constraint).** 2026-05-08.
- **Live Stream Tiers 5–8 with crew bundles → cut entirely.** 2026-05-09.
- **Native iOS/Android camera-operator apps for Live Stream → pure WebApp + YouTube delivery.** 2026-05-09.
- **Cloudflare Stream Player embed (per-tier viewer caps) → YouTube exclusive (audience cost-independent).** 2026-05-09.
- **Pricing rounded to clean × 30 tokens (₱100, ₱200, ₱500, ₱1,000, etc.) → charm-priced -1 endings (₱99, ₱199, ₱499, ₱999).** 2026-05-12.
- **Cross-paparazzi de-duplication algorithm → deferred.** Wedding photographers operate as independent shooters; de-dup adds complexity for marginal value.

---

## G. Conceptual placeholders that didn't make V1

- **Wedding Challenges iteration** (voice/video guestbook + challenge prompts) — concept exists but no iteration drafted. Voice/video guestbook was originally a standalone feature; folded into the Wedding Challenges concept.
- **Coordinator app cluster** — see Section D above. Coordinator is a vendor service category, not a platform role.
- **Setnayan Pro Services** — the crew-bundled tier line of business. May revive post-V1 launch as a separate product line.

---

## How to use this list

When you're reading any spec and you see a feature, SKU, or vendor concept you don't recognize, check this list first. If it's retired or deferred, the spec text is talking about the historical narrative — not active product behavior. The decision log in CLAUDE.md is the canonical source of "why," and `RENAME_LOG.md` is the canonical source of "what got renamed."
