# CLAUDE.md — Setnayan Engineering Context

> Project context for Claude Code working on the Setnayan platform. Keep this file under 200 lines — it's loaded into every Claude Code session as context, so brevity matters.

## ⚡ Latest handoff (read this FIRST if you're resuming work)

**[HANDOFF_2026-05-17.md](HANDOFF_2026-05-17.md)** — end-of-session state after the multi-day Setnayan Concierge + vendor pricing lock (2026-05-15 → 2026-05-17). Captures: canonical Concierge spec (₱4,999 single SKU · 3-day account-level trial · wedding-anchored access · tiered abuse enforcement), full active SKU catalog, the ~3-day engineering gap, and the recommended next-PR scope. Read this BEFORE drilling into the iteration tree.

## Status anchors (read these before any work)

Two status docs sit at the spec-corpus root. Cross-reference them at the start of every session — they answer "where are we?" without re-reading the whole iteration tree.

- **[V1_Gap_Analysis_Status.md](V1_Gap_Analysis_Status.md)** — did we update the *spec corpus* for each gap-audit item? (single-pane view of Tier 1/2/3 spec landings)
- **[App_Build_Status.md](App_Build_Status.md)** — did we ship the *app code* for each iteration? (spec vs. live `origin/main` audit; ✅/⚠️/🟡/⛔ per iteration with what's still missing inline)
- **[Installed_Stack_Inventory.md](Installed_Stack_Inventory.md)** — what's actually *wired under the hood*? (10-pass audit: deps, migrations, routes, actions, integrations, env vars, CI, desktop, PWA)
- **[API_Integration_Checklist.md](API_Integration_Checklist.md)** — external service prereqs (signups, keys, DNS) the owner must action before code can run end-to-end.
- **Repo-side mirrors** (at `https://github.com/iscasasola/setnayan-platform`): `STATUS.md` (living checkpoint), `HANDOFF.md` (cold-start handoff), `OWNER_ACTIONS.md` (phased launch checklist), `CHANGELOG.md` (every change with `SPEC IMPACT` flag), `COWORK_INBOX.md` (pending spec updates).

When code lands ahead of a spec update, the repo appends a `[PENDING]` line to `COWORK_INBOX.md`. Walk those entries at the start of any Cowork session and apply each via the spec file it names, then mark `[DONE <date>]`.

## What this product is

**Setnayan** (spoken: SET-na-yan, brand-origin phrase *"Set na 'yan."* — Tagalog for "that's all set") is a Philippines-first life-events platform. V1 surface is weddings; the product is built for the broader event market (birthday, celebration, travel, corporate, burial) as event types unlock over time. One app, three role-routed doorways: **customers** plan events end-to-end, **vendors** run a free-during-launch business profile, **admins** (Setnayan team) run operations from a 7-surface internal console. The full 33-iteration spec spine is documented across `0000_*` through `0035_*` folders.

**Papic** (the candid-capture iteration `0012_papic/`) is one of the in-app SKU-driven services within Setnayan. Designated friends/family ("paparazzi") shoot unlimited photos and 5-second clips, tag guests via QR scan, deposit everything into a shared gallery on the couple's existing Setnayan landing page. Every guest gets their tagged photos in real time and can render a 1–30 second personal souvenir reel from a pre-made template library.

**Full Papic spec:** `02_Specifications/10_Papic_Feature_Specification.md` — read it when in doubt.

## Locked V1 scope (do NOT expand without explicit owner sign-off)

### SKUs

All prices stored as PHP centavos in `service_catalog` (iteration 0003). In-app UI renders to tokens via the standard formatter (30 tokens = ₱1).

| SKU | PHP price | Token display |
|---|---|---|
| 3 Paparazzi (3 app seats per event) | ₱1,499 | — |
| 5 Paparazzi (5 app seats per event) | ₱2,499 | — |
| per Template (premade) — add-on | ₱199 | — |
| Save-the-Date Render (per render, multi-purchase, all 3 formats) | ₱49 | — |
| Pro Camera Bridge — per DSLR seat (Canon/Nikon/Sony/Fujifilm WiFi SDK pairing, multi-purchase, shared SKU between 0011 + 0012) | ₱1,499 | — |
| Pro tier per Invitation Widget (Hero / Our Story / Schedule) | ₱99 | — |
| Pro Bundle (all 3 widget Pros) | ₱199 | — |
| Live Stream — Base (1 broadcaster + 3 cameras + 3 hours) | ₱2,499 | — |
| Live Stream — +1 Camera add-on (multi-purchase up to 2) | ₱999 | — |
| Live Stream — +1 Hour add-on (multi-purchase unlimited) | ₱999 | — |
| Custom Monogram Pack (Remove Watermark — event-wide) | ₱1,999 | — |
| Broadcast Style Pack (4 modes: News/Cinematic/Sports/Royalty + transitions) | ₱2,999 | — |
| AI Video Highlight (per 60s, multi-purchase) | ₱1,999 | — |
| AI Edited Highlight (per 3-min, multi-purchase) | ₱3,499 | Repriced 2026-05-16 from ₱4,999 — resolves Strategy B (₱2,999) vs charm pricing (₱4,999) conflict |

### Hard product constraints

- **5-second hard cap on video clips.** Capped client-side. Not configurable. UI must enforce.
- **Max 10 tags per photo.** Combined individual + table tags.
- **Untagged-still-delivered guarantee.** Every uploaded photo lands in the couple's gallery regardless of tagging status.
- **Personal Reels:** vertical 9:16 only (1080×1920), 1–30 seconds duration, max 5 guest picks + max 5 couple memorable clips, template-driven render (no per-render AI).
- **Music:** Setnayan-owned AI-generated catalogue only. No major-label music. No per-render music license fee.
- **DSLR pairing is 1 phone : 1 DSLR.** Multi-DSLR-per-phone is V2. WiFi-SDK only in V1; no USB tether.
- **Face detection is per-event-scoped.** Vector store never reused across weddings. Confidence ≥ 0.85 auto-tags; 0.65–0.85 surfaces a suggested tag; below 0.65 the photo uploads untagged.
- **Capture metadata is mandatory.** Every photo and clip stamps `captured_at`, `geo_*` (when fix available), `device_model`, `paired_camera_brand/model` (when paired). Geo is stripped on outbound shares; original on R2 retains it.

## Architecture summary

### Stack

- **Native apps:** iOS 16+ (SwiftUI + AVFoundation), Android 11+ (Compose + CameraX)
- **Backend:** existing Setnayan backend (extend it, don't fork it)
- **Storage:** Cloudflare R2 (PH-region buckets) — hot 90 days, IA cold 5 years
- **Render pipeline:** FFmpeg on Cloudflare Workers + R2 (or Hetzner VM pool fallback)
- **Auth for paparazzi seats:** wedding-scoped ephemeral session tokens via QR-code claim flow (not username/password)
- **QR scanning:** AVFoundation metadata output (iOS) / ML Kit Barcode Scanning (Android)

### Data model (key tables — full schema in spec Part 4.1)

```
Event(event_id, couple_id, paparazzi_tier{3|5}, templates_unlocked[], geolocation_enabled{default true})
PaparazziSeat(seat_id, event_id, claimer_user_id, claim_qr_token)
Guest(guest_id, event_id, assigned_table_id, personal_qr_token)  -- existing in Setnayan
Table(table_id, event_id, table_qr_token)
Photo(photo_id, event_id, paparazzi_seat_id, r2_object_key, type{photo|clip},
       captured_at, geo_lat, geo_lon, geo_accuracy_m, geo_unavailable,
       device_model, paired_camera_brand, paired_camera_model,
       auto_face_attempted, ...)
PhotoTag(photo_id, guest_id, source{individual_qr|table_qr|auto_face|manual_pick}, confidence?, ...)
Template(template_id, feel_category, manifest_json, paired_music_track_ids[])
EventTemplateUnlock(event_id, template_id, purchased_at)
PersonalReel(reel_id, event_id, guest_id, template_id, selected_photo_ids[], r2_output_key)
DslrPairing(pairing_id, event_id, paparazzi_seat_id|live_stream_camera_id,
            brand{canon|nikon|sony|fujifilm}, model, last_paired_at, status)
FaceEnrollment(enrollment_id, event_id, guest_id, source{rsvp_profile|guest_portal|checkin_kiosk},
               vector_blob, quality_score, captured_at, revoked_at?)
```

### Critical flows

**Paparazzi capture → upload → tag:**
1. Native app captures photo/clip → local SQLite WAL
2. Background uploader (BGTaskScheduler/WorkManager) PUTs to R2 via signed URL
3. Tag scanner sheet → scan guest QR (`setnayan:guest:{id}`) or table QR (`setnayan:table:{id}`)
4. Tag intents flush to backend with the upload payload
5. Backend fans out table-tag to all guests assigned to that table (capped at 10 total tags)

**Personal Reel render:**
1. Guest finalizes selections in the landing-page builder
2. POST `/reels/render` with `(event_id, guest_id, template_id, selected_photo_ids, target_duration)`
3. Validate: template unlocked? photos belong to event? guest is RSVP'd?
4. Enqueue render job (Cloudflare Queue)
5. Worker loads template manifest, loads photos+couple-clips+music, generates FFmpeg cmd, encodes 1080×1920 H.264 MP4
6. Output → R2 → notify guest

## Music & template assets

The music catalogue and template library are generated through a separate Cowork-driven workflow — see `14_Music_Catalogue_Cowork_Playbook.md`.

- **Music catalogue:** ~400 owned AI-generated tracks (Suno Premier, generated once, owned forever) across 6 categories — Bridgerton-Feel, Taylor-Swift-Feel, Michael-Jackson-Feel, Jazz, Sunday Morning Vibes, Hip Hop. Stored under `/music_catalogue/{category}/{filename}.mp3`. Manifest at `/music_catalogue/catalogue_manifest.json`.
- **Template library:** ~400 production-ready JSON manifests under `/template_library/{feel_category}/TPL_{nnn}.json`. Master index at `/template_library/library_index.json`. Schema documented in spec Part 4 / playbook Section 12.

When the backend serves a template selection UI to the couple, it reads from `library_index.json`. When the renderer needs music for a render, it picks from the manifest based on the template's `music_pairing_categories` and `music_pairing_bpm_range`.

## Cost-per-event cheat sheet (charm-priced V1)

| SKU | Setnayan cost | Margin |
|---|---|---|
| Save-the-Date Render (₱49) | ~₱5 (FFmpeg + R2 + ZIP) | ~90% |
| 3 Paparazzi (₱1,499) | ~₱195 | 87% |
| 5 Paparazzi (₱2,499) | ~₱265 | 89% |
| per Template add-on (₱199) | ~₱2/render × ~30 reels = ~₱60 | ~70% |
| Pro tier per Widget (₱99) | ₱0 (pure-margin animations / deep-links) | ~100% |
| Pro Bundle (₱199) | ₱0 | ~100% |
| Live Stream Base (₱2,499 — 3 cams × 3 hrs) | ~₱120 | 95% |
| Live Stream Base + 2 cams (5×3 ≈ ₱4,497) | ~₱180 | 96% |
| Live Stream Base + 2 cams + 2 hrs (5×5 ≈ ₱6,495) | ~₱280 | 96% |
| Live Stream Base + 2 cams + 5 hrs (5×8 ≈ ₱9,492) | ~₱430 | 95% |
| Live Stream Base + 2 cams + 9 hrs (5×12 ≈ ₱13,488) | ~₱630 | 95% |
| Custom Monogram Pack (₱1,999) | ~₱5 (one-time asset gen) | ~99% |
| Broadcast Style Pack (₱2,999) | ~₱5 (compositor template/LUT swaps) | ~99% |
| AI Video Highlight (₱1,999 per 60s) | ~₱10 (Claude API + ffmpeg) | ~99% |
| AI Edited Highlight (₱3,499 per 3-min · repriced 2026-05-16 from ₱4,999) | ~₱30 (Claude API + ffmpeg + theme template) | ~99% |
| Vendor Pro Weekly (₱499/wk) | ₱0 (analytics + landing styling) | ~100% |
| Sponsored Boost (₱1,499/wk · certified-only) | ₱0 | ~100% |

Per-render cost: ~₱2–₱5 (FFmpeg compute + R2 storage; music free, CDN egress free on R2).

**Live Stream cost is audience-independent.** YouTube absorbs all viewers at ₱0 marginal cost to Setnayan. Per-event cost scales only with camera count and stream duration; whether the wedding has 100 viewers or 1,000,000 viewers, Setnayan's bill is the same.

## Payment system (V1 — apply-then-pay)

Setnayan monetizes via **PHP-direct apply-then-pay** with manual reconciliation. The earlier token-wallet design (iteration 0003) is **retired as of 2026-05-11** — kept on disk for historical context only.

- **Payment rails (V1):** static BDO + GCash receiving accounts owned by Setnayan. Customer applies for a service / order → receives payment instructions email with unique reference code → pays externally → Setnayan Team manually verifies against BDO/GCash inboxes within 24-hr SLA → service activates.
- **PHP-only pricing.** No tokens, no in-app wallet balance, no spending primitive. Each order is a discrete PHP charge tied to a `service_orders` row with `service_key`, `customer_id`, `amount_php`, `reference_code`, `status ∈ pending_payment / paid / failed / refunded`.
- **Setnayan Pay convenience fee:** 3% added to customer invoice when they choose Setnayan as the payment processor for a vendor booking. Vendor receives full booking amount; fee is the customer's cost.
- **V1.5 roadmap:** automated reconciliation via GCash Merchant API (probable) or PayMongo integration (under evaluation). Activation latency drops from 24-hr to minutes.
- **Comp + Unlimited-Use Grants:** admin can issue free-render or unlimited-use grants to specific customer accounts. Grants are a `comp_grant_id` populated on `service_orders` that skip the payment-pending state.
- **Spec convention:** in all .md / .docx specs and design conversations, prices are written in PHP. Only the in-app UI and 0003's own spec talk in tokens directly.

## What's NOT in V1 (don't build, don't backdoor in)

- All-Guest Unlock tier (every guest can shoot via web)
- Native Pro Capture Pack (RAW, manual focus peaking, ISO/shutter)
- Roving Papic service tier (staff photographers)
- Premium Photojournalism + Photo Book
- AI Top-50 same-day curation
- Live Photo Wall venue projection
- Photo Mission system / crew leaderboard
- Cross-paparazzi de-duplication
- BYO music in Personal Reels (CapCut-style client-side render)

These are tracked in spec Part 6. Each is a future spec.

## Privacy & compliance

- PH Data Privacy Act (RA 10173) — guest consent at RSVP, opt-out flow, face-blur for opt-outs, 5-year retention
- Couple has 7-day review window (configurable) before public unlock
- NSFW filter is on by default and CANNOT be disabled
- DPO is the existing Setnayan DPO (registered with NPC)
- Data residency: Cloudflare R2 PH-region buckets

## Common pitfalls / gotchas for engineers

1. **Don't render reels server-side with major-label music.** Even with TOS click-through, server-side rendering makes Setnayan the direct infringer. Catalogue is owned-AI-generated only.
2. **Don't auto-delete photos within 5 years.** PH wedding photographers keep originals 5+ years; we match.
3. **Tag fan-out from table QR.** When a table has 12 guests but cap is 10, alphabetize by RSVP'd name and truncate. Surface the warning to the paparazzo.
4. **Untagged photos still go to the couple.** Don't filter the couple's gallery view by tag presence.
5. **Personal Reel duration is flexible (1–30s) but template slot durations don't all need to scale linearly.** Some templates have minimum slot durations; if guest picks 1s reel from a template with 4s minimum slots, swap to a shorter-template variant or surface an error.
6. **Wedding-scoped session tokens.** A paparazzi seat token only works for its bound event. Don't allow cross-event reuse.
7. **R2 free egress is a real architectural advantage.** Use Cloudflare's CDN end-to-end. Don't proxy through a different cloud unless absolutely necessary.

## Companion documents

- `10_Papic_Feature_Specification.md` — full product spec, single source of truth
- `14_Music_Catalogue_Cowork_Playbook.md` — music + template asset generation playbook
- `09_Panood_Feature_Specification.md` — Panood (Live Stream) feature (cross-references the same backend + landing page)
- `07_V1_Developer_Specification.md` — overall Setnayan V1 dev spec (RSVP, seating chart, payments — all of which Paparazzi depends on)
- `13_Engineering_Brief.docx` — Setnayan engineering high-level brief

## Iteration build order (forward-sequenced)

`Status` = spec drafting state. `Built` = what exists in the codebase right now (✅ = shipped to code, ⚠ = partial, blank = unbuilt). Built status updated as each iteration's code lands; the doc's `Status` column stays as the spec-drafting field.

| # | Folder | Status | Built | Surface |
|---|---|---|---|---|
| **0000** | `0000_app_shell_and_navigation/` | **drafted 2026-05-09** | ⚠ Phase 1 | **App shell foundation — universal Setnayan account (`users`), login, event picker, primary event auto-jump (1 active event jumps in; 2+ shows picker), event QR + scan-to-join flow with role picker, four bottom-nav tabs (Guest List / Vendors / Schedule / In-App Services), event-scoped URL pattern `/dashboard/[event-id]/[section]`, services launcher grid, unified Schedule view. Vendor accounts placeholder (deferred to Din)** |
| 0001 | `0001_creating_guest_list/` | drafted | ✅ | Couple dashboard guest list + roles |
| 0002 | `0002_qr_invitation_system/` | drafted | ✅ v2 | Personal invitation site renderer + branded QR |
| ~~0003~~ | `0003_token_wallet_and_packs/` | **RETIRED 2026-05-11** | — | ~~Token wallet, pack picker, spend primitive.~~ Retired. Replaced by PHP-direct apply-then-pay (see "Payment system" section above). Folder kept as tombstone; do not implement. |
| **0004** | `0004_invitation_widgets/` | **drafted (this session)** | | Customization editor, Basic/Pro widget tiers, Pro purchases via wallet |
| 0005 | `0005_led_background_maker/` | drafted | | 8K LED screen template maker (USB delivery, offline) |
| **0006** | `0006_vendors_management/` | **drafted 2026-05-09** | | Couple-managed vendor registry — hybrid service taxonomy (28 canonical + custom), flexible payment milestones, computed crew meals, R2 contracts. No wallet integration (vendor money is external) |
| **0007** | `0007_budget_expenses/` | **drafted 2026-05-09** | | Couple's payment ledger — 3 line items per vendor (Package / Crew Meal / Transportation), payment log with proof, vendor QR display, .ics calendar export, Setnayan platform costs auto-populate from 0003 wallet |
| **0008** | `0008_seating_chart_editor/` | **drafted 2026-05-09** | | Seating chart editor — 13-entry table catalog (round / long / king / sweetheart / serpentine), free-placed stage, role-tier ring auto-fill, QR-on-publish print pack, peer tagging is QR-scan only with tag-once trust handshake |
| 0009 | `0009_photo_delivery/` | partial | | Google Drive integration for photo delivery |
| **0010** | `0010_mood_board/` | **drafted 2026-05-09** | | Mood Board V1 — palettes only (role + venue), Setnayan Guide rule engine with 7 categories, 20 pre-template themes, color name library, image extraction, master palette dedup. Stylist persona + inspirations + venue segments deferred until stylist exists |
| **0011** | `0011_live_stream/` | **drafted 2026-05-09 · re-revised 2026-05-09** | | Live Stream V1.5 — base + add-ons apparatus pricing (Base ₱2,500 / +1 Camera ₱1,000 / +1 Hour ₱1,000 / Custom Monogram ₱2,000 / Broadcast Style Pack ₱3,000 / AI Video Highlight ₱2,000 / AI Edited Highlight ₱5,000), YouTube as sole delivery, registers shared Custom Monogram Pack flag consumed by 0012 |
| **0012** | `0012_paparazzi/` | **drafted 2026-05-09** | ⚠ webapp slice | Paparazzi V1 — native iOS/Android, rear-only, gesture shutter, QR tagging, consumes monogram pack |
| **0013** | `0013_platform_stack_and_sync/` | **drafted 2026-05-09** | ⚠ partial | **Platform Stack & Sync Setup — Vercel + Supabase + Cloudflare R2 + GitHub. User Setup Checklist (Section A), Claude Code Implementation Guide (Section B), Integration Tests (Section C). MUST BUILD FIRST as Sprint 0 even though numbered 0013.** |
| 0014 | `0014_v1_1_polish/` | empty (queued · no folder on disk yet) | | V1.1 polish — Photo Center, profile photo auto-update, expanded filters, battery escalation, delivered indicator (renamed from 0013, displaced by Platform Stack iteration) |
| **0015** | `0015_main_website/` | **re-drafted 2026-05-11 · brand finalized 2026-05-12** | | **SETNAYAN public marketing site at setnayan.com (working) / setnayan.com (current). Two-sided split hero (couple ↔ vendor), free vendor registration during launch, feature catalog visible / prices hidden, EN-primary luxurious-Filipino-modern voice (TL · CEB toggles), uploaded symbol mark + SETNAYAN wordmark (spelled in full), "Set na 'yan." brand-origin. One product, three doorways (customer / vendor / admin role-router).** |
| **0016** | `0016_step_by_step_plan_builder/` | **simplified 2026-05-17 to single-SKU + 3-day trial + tiered abuse enforcement + wedding-anchored access (24-month cap)** | | **Couple-side Setnayan Concierge — optional paid assistant (DIY remains free default). **Single SKU**: Setnayan Concierge **₱4,999 · wedding-anchored access** — `concierge_expires_at = LEAST(wedding_date + 30 days, activation + 24 months)` with min `activation + 12 months`. Couple always gets ≥12 months and ≤24 months from activation; long engagements (wedding > 24mo out) trigger a one-time advisory recommending renewal closer to the wedding. Full 9-step roadmap · daily nudges · priority vendor matching · honeymoon planning. **Card-less 3-day free trial · one per account** (not per event). **Tiered abuse enforcement** on multi-account trial cycling: similarity detection on trial-start → admin review queue (new tab in 0023) → progressive penalties (warning → trial ban → full Concierge ban). Banned accounts route to 0029 help-center ticket for appeal. Couples activate from event-creation choice card (2 options · DIY + Concierge) OR Settings → Setnayan Concierge tab. Pre-paid; auto-renew is V1.5. Supersedes the 2026-05-16 2-tier (Essentials retired) and the 2026-05-14 3-tier ladder.** |
| 0017 | `0017_patiktok/` | drafted | | Patiktok templates — short-form vertical video templates for the post-event "personal reel" experience (V1 Sulyap roadmap; complements 0024 Save-the-Date). |
| 0018 | `0018_supplies_marketplace/` | drafted | | Supplies marketplace placeholder — third-vertical "Supplies" exploration (deferred; precursor to the second-vertical car-services concept). |
| 0019 | `0019_communications/` | drafted 2026-05-11 · vendor identity masking added 2026-05-12 · video meetings retired 2026-05-16 | | **In-app communications: text chat between couples ↔ vendors, ~~video meetings attached to those threads,~~ coordinator role gets per-thread join permission. Doc / sheet / pdf / image readers attached to threads with dedicated R2 storage. Vendor-side messages always display company logo (never personal photo) per § 3.10. Free use across the board. Video meetings retired 2026-05-16 — couples + vendors use external tools (Google Meet, Zoom, Messenger, WhatsApp).** |
| 0020 | `0020_interaction_prototype/` | drafted 2026-05 | | Cross-cutting 8-phase interaction prototype (vendor → customer → Papic → other features). Lives in iteration 0020 slot alongside the retired 0020_admin_console tombstone. |
| ~~0020~~ | `0020_admin_console/` | **SUPERSEDED 2026-05-12** | — | ~~Admin console early draft.~~ Superseded by iteration **0023** which has the active admin spec + interactive prototype. Folder kept as tombstone pointer; do not implement from this file. |
| **0021** | `0021_couple_dashboard_fully_purchased/` | **drafted 2026-05-10 · theme system + icon migration pilot 2026-05-12** | | **Fully-purchased couple dashboard — 9 surfaces (Overview/Guests/Vendors/Schedule/Services/Seat Plan/Landing/QR Hub/Gallery). Pilot for the 5-theme system (Setnayan Default · Victorian · Classy · iOS · Forest Theme) with runtime theme picker + Lucide icon framework.** |
| **0022** | `0022_vendor_dashboard/` | **drafted 2026-05-10 · mandatory logo + chat masking 2026-05-12** | | **Vendor dashboard — 6 surfaces (Home/Services/Calendar/Clients/Threads/Team & Setnayan). Mandatory company logo upload at registration per § 2.1b. Pro subscription · plan builder · custom service categories.** |
| **0023** | `0023_admin_console/` | **drafted 2026-05-12 · Team Pool + Payment Methods + § 9.1 scope 2026-05-12** | | **Setnayan internal admin surface — 7 surfaces. Vendor verification queues · payment reconciliation · disputes · pricing catalog · Team Pool widget (§ 10b) · 🟣 internal accounts (§ 10a) · Payment Methods upload (§ 3.5c) · two-admin approval queue gated to major decisions (§ 9.1).** |
| **0024** | `0024_save_the_date/` | **drafted 2026-05-11** | | **Save-the-Date Maker — 30 head-turning templates (iMessage / Spotify / VHS / Vogue / Heritage Filipiniana / etc.) · upload 3–8 video clips · render in 3 formats (16:9 + 1:1 + 9:16) · ₱49 per render · multi-purchase.** |
| **0025** | `0025_profile_settings/` | **drafted 2026-05-12** | | **Profile Settings surface lives inside 0021/0022/0023 dashboards. 6 tabs: Profile · Appearance (theme picker) · Notifications (preferences) · URL & Slug · Payment Methods · Privacy & Data (RA 10173 — data export + soft/hard account deletion + face data revocation + marketing consent).** |
| **0026** | `0026_bir_tax_compliance/` | **drafted 2026-05-12** | | **BIR / PH tax compliance — Official Receipt generation per in-app SKU payment, VAT vs Percentage Tax decision matrix (V1 launches non-VAT), Vendor payout EWT + quarterly Form 2307 PDF, eFPS report exports for Setnayan's tax accountant, customer/vendor tax-document download surface. Critical for PH legal compliance — Setnayan can't accept payment without this.** |
| **0028** | `0028_email_notifications/` | **drafted 2026-05-12** | | **Email-only notification fallback (SMS deferred to V1.5). 10 V1 templates: payment_instructions · payment_confirmed · refund_processed · new_vendor_message · vendor_status_change · vendor_unresponsive_48h · rsvp_received · wedding_day_reminder · save_the_date_sent · security_alert. Provider Resend (SendGrid fallback). Branded HTML + plaintext, RFC 8058 one-click unsubscribe, RA 10173 + CAN-SPAM compliant.** |
| **0029** | `0029_help_center/` | **drafted 2026-05-12** | | **Help Center / FAQ at `setnayan.com/help` · 4 role tiles (customer/vendor/guest/admin) · ~90 V1 articles · full-text search · structured contact-form routing to admin roles · support ticket queue with 24-hr SLA. SEO via FAQPage schema.org. EN-only in V1; TL/CEB deferred.** |
| **0030** | `0030_guided_tour/` | **drafted 2026-05-12** | | **First-time guided tour on initial login per account type. 8-step customer · 7-step vendor · 4-step guest · 6-step admin scripts. Driver.js library. Per-surface mini-tours (11 of them). Replayable from Settings. Tour analytics in 0023.** |
| **0031** | `0031_day_of_guest/` | **drafted 2026-05-12** | | **Day-of guest experience — live-event mode auto-activates T-1hr to T+8hr on the personal landing page. 6 cards (what's-happening · your-table · live-photo-wall · video-guestbook · live-schedule · coordinator-broadcast). Offline-first PWA shell for venues with weak signal. 5-mode lifecycle (coming-soon → pre-event → live → recap → archive).** |
| **0032** | `0032_contract_intelligence/` | **drafted 2026-05-12** | | **Contract Intelligence + Builder — AI-powered contract analysis (Claude API), 14-element detection, ~50-clause Setnayan template library, both-party e-signature flow (RA 8792 compliant), compliance checklist. Paid upgrade SKU at ₱199/contract OR free unlimited with Vendor Pro Weekly. External PH counsel review gate before launch.** |
| **0033** | `0033_public_api_foundation/` | **drafted 2026-05-12** | | **Public API foundation — Cloudflare Workers gateway · OAuth2 PKCE · scoped tokens (16 scopes) · path-based versioning · rate-limit tiers (free 100/min · Pro 1K/min · Enterprise 10K/min) · webhook delivery infra · developers.setnayan.com portal. NO public endpoints in V1; plumbing for V1.5 phased rollout.** |
| **0034** | `0034_payments_and_cart/` | **drafted 2026-05-12 · reconciliation module added 2026-05-12** | | **Payments & Cart spine — 8-table canonical schema + `payment_inbox_messages` reconciliation table. Customer add-to-cart → checkout → BDO + GCash QR codes → external pay → screenshot upload → admin reconciles (Approve / Reject-needs-more-proof / Reject permanently). Resubmission supported (same order_id). § 10a internal accounts skip payment-pending entirely; § 10b team-pool members get partial / full comp atomically. Setnayan Pay 3% fee transparent line item on vendor-booking orders. Replaces retired 0003 token wallet. Reference codes 8-char Crockford base32. 7-day expiry on pending_payment. 4-tier fuzzy SQL matcher (`match_inbox_to_order`) auto-pairs bank/GCash inbox notifications to orders — exact code → amount+sender fuzzy → amount-only → unmatched. Admin reviews matcher suggestions but final approve/reject stays single-admin.** |
| **0035** | `0035_observability/` | **drafted 2026-05-12** | | **Observability stack — Sentry (errors · ~₱1.5K/mo) + PostHog (product analytics · ~₱1K/mo) + Better Stack (uptime + status page + on-call · ~₱1K/mo). `/api/health` + `/api/health/deep` endpoints. Vercel Log Drains → Better Stack. Alert rules (critical paging Ops Lead · warning Slack · info digest). RA 10173 compliant — no PII in logs · session recordings disabled · PostHog opt-out toggle. Status page at `status.setnayan.com`. Total ~₱3.5K/month. Engineering effort ~1 week for one engineer.** |
| **0036** | `0036_pakanta/` | **drafted 2026-05-14 · 3-tier locked** | | **Pakanta · Your Wedding's Own Song — 3-tier custom songwriter service powered by Suno Premier. Basic ₱1,999 (1 song · 24-hr turnaround · no lyric approval) · Premium ₱3,999 (1 song · 2 versions · 3 remakes · 8-section intake · lyric approval gate · 2–5 day) · Wedding Suite ₱9,999 (3 matching songs · same Personas · same key family · lyric through-line · mastering pass · 5–7 day). Library-save mechanic makes the couple's Pakanta song(s) the backing track for every Setnayan-rendered video at their wedding. Canonical ID prefix S89K-. 85–90% margins.** |
| **0037** | `0037_bespoke_monogram/` | **drafted 2026-05-14 · prototype shipped** | | **Bespoke Monogram (DALL-E) at ₱2,999 — fully in-app AI-driven monogram with 30-refinement loop. Couple fills brief (initials + 3 personality words + optional motif + reference uploads) → pays → brief LOCKS → DALL-E 3 HD generates 4 candidates within 5 sec → refine loop with text feedback + suggested chips (4 new variations per refinement; 30 free included; +₱199 for 10 more) → accept final → vectorizer.ai produces SVG → replaces event-wide monogram across QR center, hero, save-the-date, AI Highlight, SDE, LED, signage, gallery chrome. Customer-facing brand "Setnayan AI"; DALL-E/OpenAI never named. Retires Custom Monogram Pack ₱1,999 SKU. ~95% margin. Canonical ID prefix S89B-.** |
| **0038** | `0038_editorial_and_affiliates/` | **drafted 2026-05-19** | | **Editorial & Affiliates · V1.1 traffic-monetization expansion. `setnayan.com/blog` (long-form articles, ~1/week cadence post-launch) + `setnayan.com/recommendations/[category]` (curated picks with disclosed affiliate links — Involve Asia primary network) + Sponsored Content (paid-for editorial features w/ unambiguous "Sponsored" badge, two-admin gate ≥₱100K). Git-tracked MD pattern (same as 0029 Help Center) — content lives in `apps/web/content/editorial/`. New tables: `editorial_articles` + `recommendation_pages` + `affiliate_links` + `affiliate_conversions` + `sponsored_slot_bookings`. PostHog `affiliate_link_clicked` event w/ no PII. Newsletter sponsorship slot extends 0028. Cross-coordinates with 0022 Boosted Ads + 0039 AdSense (sponsored articles + sponsored newsletter slots are AdSense-excluded).** |
| ~~**0039**~~ | `0039_display_ads/` | **🚫 RETIRED 2026-05-19** | — | ~~Third-party display ads (Google AdSense) · V1.1 traffic-monetization expansion · activation gated. Public, pre-purchase pages only — marketing site + help articles + 0038 editorial + marketplace discovery + vendor landing pages. Excludes: logged-in dashboards, guest landing pages (0002 Phases 1-4 incl. Public Summary), day-of guest (0031), sponsored articles, sponsored newsletter slots, checkout, contact form, cookie-preferences page, error pages, vendor verification flows. **Site-wide RA 10173 cookie-consent banner** (new system surface; 3 categories — essential/analytics/advertising; 12-month persistence; first-party cookie + `users.consent_state` JSONB). Hard guardrails: max 1 unit per page, AdSense topic-exclusion of wedding/event categories on vendor profiles + editorial + recommendations + marketplace, Auto Ads disabled, no interstitials. Vendor opt-out toggle on `/vendors/[slug]` (Boosted Ads / Sponsored Boost vendors default OFF — sales-objection neutralizer). Two-admin activation kill-switch in 0023 § 5.1. New tables: `cookie_consent_events` + `adsense_activation_log` + `adsense_daily_revenue`; ALTERs on `users` + `vendors`. CSP updated. **Yield is ~₱5-20K/mo at 100K pageviews — two orders of magnitude below Boosted Ads. Owner picked "all public pages" with brand-cost trade-off acknowledged.**~~ |

### Implementation log

| Date | What landed | Iterations |
|---|---|---|
| 2026-05-09 | Initial schema + couple dashboard for guest list, QR invitation system, plus-one model, +1 onboarding, palette/monogram | 0001, 0002, 0002 v2 |
| 2026-05-09 | Paparazzi V1 schema (seats / captures / tags / reels / templates) + couple gallery review dashboard + guest gallery + reel builder + seat-claim entry | 0012 (webapp slice) |
| 2026-05-09 | Multi-event account model (`users` / `event_join_tokens` / `event_members`), URL refactor to `/dashboard/[event_id]/...`, event picker, 4-tab event-scoped chrome | 0000 (Phase 1) |
| 2026-05-09 | `events.event_type` column + picker enum; full 0003 wallet schema (`token_wallets` / `token_packs` / `token_purchases` / `token_transactions` / `service_catalog`) + `wallet_spend()` RPC; V1 SKU + pack-ladder seeds; retired the 0012 `paparazzi_wallet_skus` stub; `apps/web/.env.example` | 0000 update, 0003 (schema), 0013 (partial — Section B B1 .env / B2 schemas / B9 catalog) |
| 2026-05-10 | Iteration specs revised for **Pro Camera Bridge** (Canon/Nikon/Sony/Fujifilm WiFi-SDK pairing, 1 phone : 1 DSLR), **face-detection auto-tag** with layered enrollment (RSVP profile + guest portal upload + check-in kiosk), **EXIF + geolocation metadata** on every capture, **adaptive compression** (strong/medium/weak), and **offline queue** with 7-day TTL. New `pro_camera_bridge_addon` SKU at ₱1,500/seat, multi-purchase, shared between 0011 and 0012. New schema additions: `dslr_pairings`, `face_enrollments`, plus columns on `photos` (`captured_at`, `geo_*`, `device_model`, `paired_camera_brand/model`, `auto_face_attempted`). Specs only — code does not exist yet. | 0011 (md/html/docx), 0012 (md/html/docx), CLAUDE.md SKU table + data model + decision log |

## Decision log

> **Moved to [`DECISION_LOG.md`](DECISION_LOG.md)** (corpus root) — split out 2026-06-03 to keep this primer light in auto-loaded context. The full append-only log (457 rows, ~2.2 MB) is **not** auto-loaded; search it on demand, e.g. `grep -n "2026-06" DECISION_LOG.md`. **Append new rows there** in date order, format `| Date | Decision | Why-or-affected-files |` — not in this file.
