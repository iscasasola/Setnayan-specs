---
name: setnayan-invite-themes-2026-09
description: "Invite link 2026-09-10 — 3 doors (#5403), themes + Capiz (#5409), reveal on door 01 (#5410) all MERGED; Velvet/Galeriya/Abaca left; owner answered Q1–Q7 on 2026-09-11 (1A 2A 3A 4B 5A 6B 7A); plan in corpus Design_Invite_Themes_2026-09-10/"
metadata:
  type: project
---

Owner decisions for the guest invite link (`/{slug}/invite`), 2026-09-10 (DECISION_LOG row e0fb5f8):
arrival not a form; three doors Name · Reply · Enter (Google/Apple at the TOP of Reply); five
themes — House free "nothing to edit", Capiz/Velvet/Galeriya/Abaca in Event Hub Pro
(`COUPLE_WEBSITE_PRO`, ₱3,500); ground = the couple's reveal background; the cinematic reveal
opens the invite ("one whole concept design").

**Built (all merged 2026-09-10):** #5403 three doors (verified live). #5409 `events.invite_theme`
(NULL = House, so nothing repaints at deploy) + picker on Guests → Invite link + Pro gate + Capiz —
column, grant (authenticated SELECT only), CHECK and pricing text verified IN PROD by the object;
0 events carry a theme. #5410: door 01 mounts `RevealOverlayServer` for a Pro theme, gated by the Event Hub's OWN rule —
`cinematicRevealPlays` (lib/site-body-plan.ts, extracted 2026-09-10) via `lib/invite-reveal.ts`.

**Why the rule had to be shared:** my first draft passed `enabled` unconditionally, which would
have put a veil over a WAKE's invite and over the day itself — both owner exclusions from
2026-08-29. Any new surface that mounts the reveal must ask `cinematicRevealPlays`.

**How to apply:** the what-is-left plan (5 sessions, model/effort/prompt each, Q1–Q7 for the owner)
and the design files are in `~/Documents/Claude/Projects/Setnayan/Design_Invite_Themes_2026-09-10/`.
Bodoni Moda is already in the repo (`apps/web/assets/cipher-fonts/bodoni-moda.ttf`); the other five
faces need the owner's download OK (Q1). `events.event_type` is NOT NULL — a `?? 'wedding'`
fallback is dead code AND trips the s13 wedding-word guard.

Trap: code comments quote stale reveal prices (₱999, ₱1,499); the standalone openings SKU is gone.
Related: [[setnayan-adding-an-events-column-costs-three-things]], [[setnayan-has-no-vercel-previews]].

Not yet seen rendered: Capiz itself and the reveal on door 01 — no event has saved a theme, and a
session cannot sign in to save one. That is session 1 of the plan (the owner picks Capiz).

**Owner answered all seven 2026-09-11 (DECISION_LOG row, corpus commit 05adbec) — do not re-ask:**
fonts downloaded (Jost, Schibsted Grotesk, Alfa Slab One, Bitter, Oswald — OFL); a Pro theme's
button takes `events.site_button_color` with a terracotta fallback when unreadable; the invite
theme is Event Hub Pro's EIGHTH item (code and the controller design say "seven" until session 5);
Galeriya's print shortened above the fold; feel → theme pre-selection kept (now a ruling); no
second reveal right after arriving (film must still start); Pro themes for weddings only.
