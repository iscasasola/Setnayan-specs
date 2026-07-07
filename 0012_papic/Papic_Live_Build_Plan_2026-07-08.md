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
| D2 | **Camera themes = 5 fixed, Papic-specific looks:** Original · Film · Vintage · Cinematic · **[5th — TBD]**. Reverses the v2 doc's "Mood-Board-palette-driven look & feel." | **New build** — theme picker + capture-preview skin/LUT. |
| D3 | **Face tagging = strict opt-in (RA 10173).** A guest must **affirmatively approve** being tagged before the engine attaches their identity; only clear/face-detectable shots (confidence floor). **Same affirmative step for face blocking.** Untagged-still-delivered guarantee intact — declining tag = *not labelled/searchable*, not *excluded*; blocking = *blurred on public surfaces*. | Strengthens "consent-at-RSVP + opt-out blur" → explicit opt-in. **New consent gate + column.** |
| D4 | **Kwento stays ₱299** (whole-event flat). The 2026-06-26 v2-doc "₱500" figure is **NOT adopted** — ₱299 (live since 2026-06-29) is canonical. | **No price change.** |
| D5 | **Live Photo Wall build flow:** on setup, ask **(a) wall resolution** and **(b) how many photos to show**, then the couple **picks from several tile-layout options** (not one fixed/rotating mode). | **New setup flow + tile-layout templates** for `LIVE_WALL` / Salamisim. |
| D6 | **Gallery delivery:** host gallery + per-guest gallery (built) **+ direct download + ZIP export** (new). | **New download + zip route.** |
| D7 | **Patiktok is NOT a Papic add-on** — it is its own thing (iteration `0017_patiktok/`). Remove it from the Papic add-on list wherever it appears. | Doc correction (v2 doc §8). Patiktok build **deferred** — finish later. |

**Bundled, not new SKUs:** the 5 themes (D2), opt-in tagging/blocking (D3), ZIP/direct download (D6) are all **included in Papic** — they do **not** add price rows. Guest **Stories stays FREE** (client-rendered, owner-locked 2026-06-30).

**Open item:** the **5th camera theme name** (D2) — needed before the theme picker is specced final.

---

## 2. The service, as agreed (reference map)

- **Capture (paid, per camera·day):** Papic Ltd ₱30 (30 photos + 10×5 s) · Papic Unli ₱100 (unlimited → Drive archive) · both cap ₱15,000/day · 5-camera min (₱150) · free first-5-cameras funnel (5 photos + 1 video each).
- **Intelligence (free, always):** face tagging (opt-in) → per-guest galleries · face blocking (opt-in, RA 10173).
- **Deliverables:** host gallery (sees all) · per-guest custom gallery · auto Personal Reel · **direct download + ZIP export** · Google Drive sync (full-res → couple's Drive).
- **Words layer:** Kwento ₱299 whole-event → flows to the Alaala / "Our Story" page.
- **Add-ons (all gated on active Papic):** Thank You ₱2,499 · **Stories FREE** · Pabati ₱1,299/day · Camera Bridge ₱1,299/day · Live Photo Wall ₱2,499/day · Live Background · High Res Archive · Personal-Reel templates.
- **Lives on:** the event website + day-of guest page, forever. **Patiktok = separate (0017), not here.**

---

## 3. Phased PR plan (code root: `apps/web/`)

Each phase is one (or a small stack of) PR(s); schema/migrations land first, RLS at `CREATE TABLE` time, `changelog.d/` fragment per PR, auto-merge per repo default.

### Phase 0 — Pricing-surface truth (small, ship first)
- **Fix the Stories row.** `app/_components/home/pricing-data.ts:137,187` renders `PAPIC_ADDON_STORIES` at a paid `/guest·day` fallback (₱20) — contradicts canonical **Stories FREE**. Make Stories render **FREE** on both the popup and `app/pricing/page.tsx` (+ `_papic-estimator.tsx`), or drop the paid row. Confirm the `PAPIC_ADDON_STORIES` catalog row is deactivated in the live catalog.
- **Verify** Kwento (₱299), Ltd/Unli, caps, Camera Bridge, Pabati, Thank You, Live Photo Wall all read from catalog and match `Pricing.md § 2.1`.
- **No Kwento change.**

### Phase 1 — Capture UX (verify + themes)
- **Verify** D1: `app/papic/guest/_components/papic-guest-capture.tsx` — tap = photo, hold = video with fill-ring to 5 s, release-early shorter clip, 5 s hard cap. Fix if it still forces exactly-5 s.
- **Build D2:** 5 fixed camera themes (Original · Film · Vintage · Cinematic · [5th]) — theme picker in Papic onboarding + live-preview skin/LUT on the capture screen. "Originals always saved" regardless of theme (theme is a *look*, not a destructive edit). Store `papic_events.camera_theme`.

### Phase 2 — Consent gate (RA 10173, strict opt-in) — schema first
- Migration: guest-level consent columns (`face_tag_consent`, `face_block_optin` or equivalent), RLS at create time.
- Gate the auto-tagger + manual tagger on `face_tag_consent = true`; clear-face confidence floor already exists (≥0.85 auto / 0.65–0.85 suggest / else untagged).
- Face-block = affirmative guest action (extends shipped FaceBlock → `author_publicly_hidden`).
- Keep the **untagged-still-delivered** guarantee: never filter the host gallery by tag/consent presence.

### Phase 3 — Gallery + delivery
- Host + per-guest galleries (built) + **direct download** (single asset) + **ZIP export** (bulk) — new server route to presign + stream a zip of the guest's / host's selection.

### Phase 4 — Reels + add-ons (gated on active Papic)
- Personal Reel pipeline (in build) + add-on entitlement gating for Thank You / Stories (free) / Pabati / Camera Bridge / Live Background / High Res Archive. Lint with `scripts/lint-entitlement-gates.mjs`.

### Phase 5 — Live Photo Wall (D5)
- `LIVE_WALL` / Salamisim setup asks **wall resolution + photo count**, then a **tile-layout picker** (several options). Render N per the chosen layout, moderation- + FaceBlock-gated, safe derivatives only.
- Correct the stale "NOT in V1" label (Live Photo Wall is shipped) in `CLAUDE.md` + spec Part 6.

### Phase 6 — Website + day-of integration
- Auto-surface the Papic gallery on the couple's event website (`app/[slug]/…`) + the day-of guest page (0031). Gallery, per-guest "Photos of me", reel CTA. Partly live — finish the unbuilt gates.

---

## 4. Corpus doc-sync (this repo — done alongside this plan)
- `DECISION_LOG.md` — rows for D1–D7 (2026-07-08).
- `Papic_v2_Pricing_and_Funnel_Strategy_2026-06-26.md` — dated 2026-07-08 correction: Kwento ₱299 (not ₱500), 5 fixed themes, opt-in consent, photo-wall tile options, ZIP/download; **remove Patiktok from the §8 add-on list**.
- `10_Papic_Feature_Specification.md` — themes, opt-in consent, photo-wall flow as needed.
- `CLAUDE.md` / spec Part 6 — Live Photo Wall "shipped" (Phase 5).
