# Save-the-Date — Build Plan (PR4) · 2026-06-17

> Turns the locked design into a buildable sequence. Companion to `0024_Save_the_Date_Content_and_Customization_2026-06-17.md` (the what) and `0024_Veil_Reveal_Spec_2026-06-17.md` (the veil). This is the **how**.

## The finished experience (one line)

Couple picks an **opening** (1 of 5) → it plays/awaits → **lifts into** a continuous, **auto-playing + scrubbable content film** (the 7 beats) → **petals start on lift** → film plays **fullscreen** → **ends → add-to-calendar** (wedding + invitation-launch). Colours from the **Mood Board**. The opening is the premium "filter"; the film is the free base.

## Already built (reuse, don't rebuild)

- **The 5 openings** — Sheer veil (`veil-reveal.tsx`, shipped #1671), the 4 rigid (`rigid-reveal`/`rigid-stage`/`four-flap`), the chooser (`reveal-preview-card.tsx`), the admin Reveal Studio (#1677). `RevealOverlay` is already the transparent layer over page content.
- **Colours** — `site-palette.ts` derives veil/seal/petal tones from `events.role_palette` (the Mood Board).
- **Reuse sources** — monogram (Cipher/Monogram studio), names/date (`events`), **Pakanta** song, **Papic** photos, `events.love_story`.
- Crown removal in flight (#1682) → 5 openings.

## To build — phases

**P1 · The content film component** (`save-the-date-film.tsx`, the part that was missing)
- The 7-beat spine as a self-playing slide film: Monogram → announcement → date (+Add-to-calendar) → ceremony → reception → "invitation to follow" (+website link) → closing media (photo gallery OR video).
- **Scrub UI:** a stories-style **segmented progress bar** (one segment/slide, auto-fills), **hold-to-pause**, **tap-a-segment / tap-the-sides to jump**, **replay**. (Auto-play + scrubbable, spec §1.)
- **Fullscreen + gesture:** the reveal-lift tap unlocks fullscreen + audio (browser gesture rule); film auto-plays immersively (full-viewport stage on iOS Safari). Music plays throughout (Pakanta or upload), mute toggle.
- **Mounts UNDER the reveal:** `RevealOverlay` lifts → reveals this film (it's the page content beneath the opening). Petals are the veil's; the film starts when the reveal completes.

**P2 · The auto-fill resolver** (`lib/save-the-date-content.ts`)
- Resolve film props from existing event data (monogram · names · finalized date · ceremony/reception venue on booking-lock · colours from Mood Board · Pakanta · Papic). Falls back gracefully (missing → surfaced as a builder "touch").

**P3 · The end-of-film add-to-calendar** (`lib/std-ics.ts`)
- One `.ics` with TWO VEVENTs: **wedding date** (primary) + **invitation launch date** (secondary "remind me when the invite arrives"). End-of-film CTA sheet: [Add wedding] + [Remind me] + [see details/website].

**P4 · The couple builder** (the maker — `add-ons/save-the-date` extends the existing chooser)
- Template-first: pick an opening → **Ready** (auto-filled rows, confirm) + **Add your touches** (adaptive: media Photo-OR-Video upload · song Pakanta/Upload · invitation-launch date · plus any missing shared field, which writes back to the event). → Preview → Send + share link.
- New event columns: `std_media` (photo set or video), `std_music_choice`, `std_invitation_launch_date`, `std_reveal_template`. (Auto-compose video from photos+Pakanta is the no-manual-editor default; upload optional.)

**P5 · The journey trigger + gate**
- Surface a checklist task **"Send your Save-the-Date"** once the **date is finalized** (the trigger). 
- **Free/premium gate** — ✅ SETTLED (owner 2026-06-17): **FREE = the content film** · **PREMIUM = the cinematic openings at ₱1,499** (standalone à-la-carte SKU). Flips the live app's currently-*free* openings to a ₱1,499 entitlement gate (the chooser stays, the openings unlock on purchase; the bare film stays free). Price is **admin-managed** (catalog, never hardcoded) + provisional. Holistic-pass reconcile: how ₱1,499 sits vs the ₱3,999 PRO unlock (à-la-carte vs included).

## Open decisions (owner)
1. ✅ **Free vs premium openings — SETTLED 2026-06-17: free film + premium openings ₱1,499** (à-la-carte). Holistic-pass: reconcile vs the ₱3,999 PRO unlock.
2. **Does the new experience retire the old `/add-ons/save-the-date` ₱99 video SKU?** (de-surfaced already; library intact.)

## Status
Design **COMPLETE + LOCKED**. **BUILD COMPLETE 2026-06-17 — PR4 P1–P5 shipped** to the repo: #1698 film+scrub · #1699 auto-fill resolver · #1700 builder+`std_*` schema · #1701 dual-calendar · #1703 premium-gate. The **free experience** (film · scrub · auto-fill · dual calendar · couple builder · the `save_the_dates` checklist trigger, which already deep-links here) is **live-on-merge**, flag-gated `NEXT_PUBLIC_STD_FILM=1` / `?film=1`. The **premium-openings paywall is wired-but-dormant** (`lib/std-openings.ts` · `STD_PREMIUM_OPENINGS`) pending the owner's holistic-pass price seed.

**Build deviations (vs this plan) — flagged for owner:**
- **`std_media` / `std_music_choice` columns NOT added.** The film reuses the couple's *existing* site music (`events.site_bg_music_*`) + curated photos (`events.our_photos`); a dedicated STD-specific media/song override is **deferred for owner sign-off** (the auto-generate / single-source philosophy). Only `std_reveal_template` + `std_invitation_launch_date` were added (migration `20270113257561`, applied to prod).
- **Dual `.ics` lives in `lib/calendar-links.ts`** (`buildSaveTheDateIcs`), not a standalone `lib/std-ics.ts` — it reuses the existing module-private RFC-5545 helpers instead of duplicating them.
- **The gate is dormant additive plumbing**, not a live paywall. Openings unlock on `admin-global toggle OR ?reveal= OR premium-ownership`; **no price seeded, no buy-CTA**. Activation runbook (seed `STD_PREMIUM_OPENINGS` catalog price → add buy-CTA → flip the admin Reveal Studio global toggle OFF) is in `lib/std-openings.ts`. Open decision #1 (₱1,499 vs ₱3,999 PRO) stays a holistic-pass item; open decision #2 (retire the old ₱99 video SKU) still open.
