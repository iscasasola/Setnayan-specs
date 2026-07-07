# Papic — "Go Live on the Website" Build Plan

> **Date:** 2026-07-08 · **Status:** Plan agreed — decisions locked in the 2026-07-08 owner discussion.
> **Pricing:** prices are **admin-catalog dials**, never hardcoded. Source-of-truth order unchanged: live site → shipped code (`/Users/icecasasola/apps/web` @ `origin/main`) → live DB → this doc.
> **Repo boundary:** corpus (this repo) is edited directly; **all code lands via the code-repo worktree + PR workflow** — this plan is the PR map, not a licence to edit `main`.

This plan turns the 2026-07-08 discussion into a shippable, staged delta. Papic is **already largely built** (studio dashboard, guest capture, Kwento API, moderation, Alaala) — so each phase is an *additive delta*, not a rebuild.

---

## 1. Decisions locked (2026-07-08 discussion)

| # | Decision | Delta vs as-built |
|---|---|---|
| D1 | **Capture modes = two gestures.** Tap = photo · **hold = video**, button shows a **ring that fills as it records, up to 5 s** (release early = shorter clip; auto-stops at 5 s). The old four-gesture model (drag-up flash / chord flash-clip) is **retired**. | Already the specced/shipped model (v2 doc) — **verify only**, plus confirm release-early shorter clips. |
| D2 | **Camera themes = 5 fixed, Papic-specific looks — ALREADY BUILT** in `lib/papic-photo-styles.ts` as `PapicStyle`: **`ORIG` (Orig)** · **`RETRO` (Retro — warm film)** · **`MONO` (Mono — B&W)** · **`CINE` (Cine — teal/orange cinematic)** · **`LOMO` (Lomo — lo-fi toy)**, default `ORIG`. Full look engine ships (live CSS `cssPreviewFilter` + per-pixel `applyPapicStyle`). Reverses the v2 doc's "Mood-Board-palette-driven look & feel." | **Verify only** — themes + picker + look engine already shipped. (Note: V1 styles the photo + the clip *poster*; clip bodies stay un-styled — no video render pipeline yet.) |
| D3 | **Face tagging = strict opt-in (RA 10173).** A guest must **affirmatively approve** being tagged before the engine attaches their identity; only clear/face-detectable shots (confidence floor). **Same affirmative step for face blocking.** Untagged-still-delivered guarantee intact — declining tag = *not labelled/searchable*, not *excluded*; blocking = *blurred on public surfaces*. | Strengthens "consent-at-RSVP + opt-out blur" → explicit opt-in. **New consent gate + column.** |
| D4 | **Kwento stays ₱299** (whole-event flat). The 2026-06-26 v2-doc "₱500" figure is **NOT adopted** — ₱299 (live since 2026-06-29) is canonical. | **No price change.** |
| D5 | **Live Photo Wall build flow:** on setup, ask **(a) wall resolution** and **(b) how many photos to show**, then the couple **picks from several tile-layout options** (not one fixed/rotating mode). | **New setup flow + tile-layout templates** for `LIVE_WALL` / Salamisim. |
| D6 | **Gallery delivery:** host gallery + per-guest gallery (built) **+ direct download + ZIP export** (new). | **New download + zip route.** |
| D7 | **Patiktok is NOT a Papic add-on** — it is its own thing (iteration `0017_patiktok/`). Remove it from the Papic add-on list wherever it appears. | Doc correction (v2 doc §8). Patiktok build **deferred** — finish later. |

**Bundled, not new SKUs:** the 5 themes (D2), opt-in tagging/blocking (D3), ZIP/direct download (D6) are all **included in Papic** — they do **not** add price rows. Guest **Stories stays FREE** (client-rendered, owner-locked 2026-06-30).

**Resolved:** the 5 camera themes already exist in code — `ORIG · RETRO · MONO · CINE · LOMO` (the "5th" is **Mono**). No new theme assets needed.

---

## 2. The service, as agreed (reference map)

- **Capture (paid, per camera·day):** Papic Ltd ₱30 (30 photos + 10×5 s) · Papic Unli ₱100 (unlimited → Drive archive) · both cap ₱15,000/day · 5-camera min (₱150) · free first-5-cameras funnel (5 photos + 1 video each).
- **Intelligence (free, always):** face tagging (opt-in) → per-guest galleries · face blocking (opt-in, RA 10173).
- **Deliverables:** host gallery (sees all) · per-guest custom gallery · auto Personal Reel · **direct download + ZIP export** · Google Drive sync (full-res → couple's Drive).
- **Words layer:** Kwento ₱299 whole-event → flows to the Alaala / "Our Story" page.
- **Add-ons (all gated on active Papic):** Thank You ₱2,499 · **Stories FREE** · Pabati ₱1,299/day · Camera Bridge ₱1,299/day · Live Photo Wall ₱2,499/day · Live Background · High Res Archive · Personal-Reel templates.
- **Lives on:** the event website + day-of guest page, forever. **Patiktok = separate (0017), not here.**

---

## 2.5 What ALREADY ships (verify, don't rebuild)

Research on `origin/main` shows most of Papic is live. Re-planning built things wastes effort — these are **verify-only**:

| Feature | Status | Where |
|---|---|---|
| Two-gesture capture (tap/hold + ring) | ✅ shipped | `app/papic/guest/_components/papic-guest-capture.tsx` |
| 5 camera themes + look engine | ✅ shipped | `lib/papic-photo-styles.ts` |
| **Guest Stories (client-render, ₱0)** | ✅ **shipped + free** | `lib/patiktok-render.ts`, `guest-story-maker`, `lib/guest-stories.ts` |
| Camera Move ("filmed" effect for Stories) | ✅ integrated (#2406) | `lib/reel-render.ts`, `lib/stories-camera-move.ts` |
| Personal Reels (client-renderable ≤30s) | ✅ mostly | `lib/reel-render.ts` |
| Kwento ₱299 whole-event | ✅ live | `lib/kwento-access.ts`, catalog |
| Face blocking (FaceBlock) | ✅ partial | `author_publicly_hidden` |

**Guest Stories cost = ~₱0.** Client-side render (guest's own device: WebCodecs / `ffmpeg.wasm`), music is owned Suno tracks or the guest's own upload (never hits our servers) → **₱0 render, ₱0 music-license, ₱0 egress** (R2 free). Only marginal cost = trivial R2 storage *if* the output is saved (~a fraction of a centavo per 30 s story). This is exactly why FREE is correct — it's a ₱0-COGS funnel enricher, not a foregone margin. The **server render pipeline (Oracle/Hetzner box) is NOT needed for Stories** — it's only for **Auto-Recap** (whole-event, no device present) and is owner-input-blocked.

**Net: the genuinely NEW build work is small** — D3 (opt-in consent), D6 (ZIP export), D5 (photo-wall tile options), the Stories-FREE pricing-surface fix, and (optional/later) the Auto-Recap server box.

---

## 3. Phased PR plan (code root: `apps/web/`)

Each phase is one (or a small stack of) PR(s); schema/migrations land first, RLS at `CREATE TABLE` time, `changelog.d/` fragment per PR, auto-merge per repo default.

### Phase 0 — Pricing-surface truth (small, ship first)
- **Fix the Stories row.** `app/_components/home/pricing-data.ts:137,187` renders `PAPIC_ADDON_STORIES` at a paid `/guest·day` fallback (₱20) — contradicts canonical **Stories FREE**. Make Stories render **FREE** on both the popup and `app/pricing/page.tsx` (+ `_papic-estimator.tsx`), or drop the paid row. Confirm the `PAPIC_ADDON_STORIES` catalog row is deactivated in the live catalog.
- **Verify** Kwento (₱299), Ltd/Unli, caps, Camera Bridge, Pabati, Thank You, Live Photo Wall all read from catalog and match `Pricing.md § 2.1`.
- **No Kwento change.**

### Phase 1 — Capture UX (verify — mostly already shipped)
- **Verify** D1: `app/papic/guest/_components/papic-guest-capture.tsx` — tap = photo, hold = video with fill-ring to 5 s, release-early shorter clip, 5 s hard cap. Fix only if it still forces exactly-5 s.
- **Verify** D2: 5 camera themes already ship (`lib/papic-photo-styles.ts` — `ORIG · RETRO · MONO · CINE · LOMO`, default `ORIG`; picker + `cssPreviewFilter` live preview + `applyPapicStyle` per-pixel). Confirm the picker is surfaced in the capture chrome and (if desired) in Papic onboarding. Originals always saved — style is applied to a copy, after face-embed, so it never degrades auto-tag.

### Phase 2 — Consent gate (RA 10173, strict opt-in) — THE priority (schema first) 🔴
The one legally load-bearing new build. Reverses "consent-at-RSVP + opt-out blur" → **explicit opt-in before any identity is attached.**
- **Migration (RLS at create):** consent fields keyed to the guest/enrollment — `face_tag_consent boolean not null default false`, `face_tag_consent_at timestamptz`, `face_tag_consent_source text` (`rsvp | guest_portal | checkin_kiosk`), and a block flag reusing/mirroring FaceBlock. Consent is personal data → store minimal, keep an audit trail (RA 10173 needs *provable* consent).
- **Capture point:** an explicit checkbox at RSVP / guest portal / face-enrollment upload — *"I agree to be identified and tagged in this event's photos."* Unchecked = no tagging, ever.
- **Gate points:** auto-tagger attaches an identity tag **only if** `face_tag_consent = true` AND confidence ≥ 0.85; suggested tags (0.65–0.85) surface only with consent; manual tag by paparazzo/host is blocked (or stays couple-private) for non-consenting guests.
- **Face block = affirmative guest action** → blur on every public/shared surface + stop public tagging + hide Kwento authorship (existing `author_publicly_hidden` sync, mig `20261227000100`).
- **Guarantee intact:** decline-tag = *not labelled/searchable* (photo still delivered to the couple); block = *blurred on public surfaces* (couple's private gallery keeps the clear original). **Never** filter the host gallery by consent/tag presence.

### Phase 3 — Gallery delivery: direct download + ZIP export (D6)
- **Direct download (single asset):** presign the R2 object → download. ⚠ **Decide geo policy:** the hard constraint says *"geo stripped on outbound shares; original on R2 retains it."* Confirm whether a guest downloading their own photo counts as a "share" (strip geo) vs the couple/host downloading originals (keep geo). Default: strip for guest downloads, keep for host.
- **ZIP export (bulk):** `app/api/papic/zip/route.ts` — stream a ZIP of the selection (guest = "download all my photos"; host = "download the whole gallery"). Stream, don't buffer. For big host galleries, fall back to a **background job → ZIP on R2 → emailed link** (reuse the "gallery is live" email pattern; ties to 0028).
- Host + per-guest galleries themselves already ship.

### Phase 4 — Reels + add-ons (gated on active Papic)
- Personal Reel pipeline (in build) + add-on entitlement gating for Thank You / Stories (free) / Pabati / Camera Bridge / Live Background / High Res Archive. Lint with `scripts/lint-entitlement-gates.mjs`.

### Phase 5 — Live Photo Wall setup + tile options (D5)
- **Setup flow** (couple, on `LIVE_WALL` purchase/config): (1) **wall resolution** — presets (1920×1080 · 3840×2160) + custom W×H; (2) **photo count** N; (3) **tile-layout picker** — several templates (e.g. uniform grid · masonry/mosaic · hero + thumbnail strip · polaroid scatter · filmstrip).
- **Render:** N latest moderation-clean, FaceBlock-safe photos laid out per the chosen template, sized to the wall resolution, auto-refresh as new shots land. Served at the Salamisim venue-projection URL. Safe derivatives only.
- **Config store:** `wall_width_px`, `wall_height_px`, `photo_count`, `tile_layout` on the `LIVE_WALL` event config.
- Correct the stale "NOT in V1" label (Live Photo Wall is shipped) in `CLAUDE.md` + spec Part 6.

### Phase 7 (optional / later) — Auto-Recap server pipeline
- The **only** feature that needs the server render box (Oracle/Hetzner) — the couple's auto-highlight over the *whole* event, rendered with no device present. **Owner-input-blocked** (see `Render_Pipeline_Hetzner_Build_Plan_2026-06-28.md`). Reels + Stories stay client-side (₱0). Sequence after the client-side surfaces are locked.

### Phase 6 — Website + day-of integration
- Auto-surface the Papic gallery on the couple's event website (`app/[slug]/…`) + the day-of guest page (0031). Gallery, per-guest "Photos of me", reel CTA. Partly live — finish the unbuilt gates.

---

## 4. Corpus doc-sync (this repo — done alongside this plan)
- `DECISION_LOG.md` — rows for D1–D7 (2026-07-08). ✅ done
- `Papic_v2_Pricing_and_Funnel_Strategy_2026-06-26.md` — dated 2026-07-08 correction: Kwento ₱299 (not ₱500), 5 fixed themes (already built), opt-in consent, photo-wall tile options, ZIP/download; **remove Patiktok from the §8 add-on list**. ✅ correction added
- `10_Papic_Feature_Specification.md` — themes, opt-in consent, photo-wall flow as needed. ⏳ on finalize
- `CLAUDE.md` / spec Part 6 — Live Photo Wall "shipped" (Phase 5). ⏳ on finalize

## 5. Build sequence & status

**STATUS: PLAN ONLY. No code has started — owner said "plan everything now, finalize once all is ready."** Nothing below runs until you say go.

Recommended order (each is one PR / small stack in `apps/web`, off fresh `origin/main`, `changelog.d/` fragment, auto-merge):

1. **Phase 0** — Stories → FREE on page + popup (+ confirm catalog row). *Tiny, ships the pricing truth.*
2. **Phase 2** — Opt-in consent gate (RA 10173). 🔴 *Highest value — legal.* Schema first.
3. **Phase 3** — ZIP export + direct download. *Self-contained.*
4. **Phase 5** — Live Photo Wall setup + tile options.
5. **Phase 1 / 4 / 6** — Verify capture+themes; add-on gating; website + day-of finish (mostly verify).
6. **Phase 7** — Auto-Recap server box (owner-blocked, later).

**Effort shape:** Phase 2 is the real build (schema + gates + consent UI). Phase 3 + 5 are moderate. Everything else is verify/finish. Total ≪ a from-scratch Papic because ~70% already ships.

**Open owner inputs before finalize:** (a) geo policy on guest downloads (Phase 3); (b) Auto-Recap box inputs (Phase 7); (c) confirm the `PAPIC_ADDON_STORIES` live catalog row is deactivated.
