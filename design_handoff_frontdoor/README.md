# Handoff: Setnayan public front door — YouTube-shaped concept

## Status
Concept prototype, structure agreed with the owner on 11 Aug 2026. **Known rough edges: desktop and mobile layout need a correctness pass** (the owner is sending this to Claude Code for that, then back to design for finalization). Treat `Homepage Interactive.dc.html` as the intended structure/behavior; `Homepage v2.dc.html` is the earlier static spec (search grouping rules, menu-state grammar, empty-catalogue rules still authoritative there).

## The agreed structure (11 Aug 2026 — overrides the v2 static frames)
**Desktop, YouTube-shaped:**
- Top nav: `SETNAYAN` wordmark · centered search bar (one search over everything, grouped results panel) · `Sign in` · `Start planning — free` (gold #8C6932 pill, cream label).
- **Right sidebar** (never left), top to bottom: **Stories · Editorials** → divider → **EXPLORE** (parent vendor categories: Photographers, Venues, Catering, Videographers, Hosts & bands, Show more) → divider → **My Home** (the signed-in user's home) → divider → **TOOLS** (Papic, Live Studio, 3D floor plan, Alaala, Setnayan AI, Pakanta; gold dot = usable without an account) → divider → **About · Pricing · Privacy · Terms · Contact us · Open your shop** + tagline "Set na 'yan — that's all set."
- Content feed, in order: tools chip row → **Trending storyteller** (one big hero video card: 16:9 cover, ▶ duration badge, avatar + title + plays) → **Editorials** as a Shorts-style row (tall 9:14 cards, title overlaid on a bottom gradient, N-MIN badge) → **More stories** (16:9 cards with avatar rows) → **Trending vendors** (16:9 cover with initials block, ✓ VERIFIED badge, saved-by count) → footer.

**Mobile:** same feed single-column; header = wordmark + hamburger opening a full-sheet index; search lives under the one-line intro ("Keep your memories. Plan your moments.") at the top of the feed. Editorials shorts row is 2-up. Tap targets ≥44px.

## Behaviors (all working in the interactive file)
- Search: grouped results under 01 TOOLS / 02 VENDORS / 03 REAL STORIES / 04 JOURNAL; match text highlighted (#F3ECDF/#5C4726); groups with no hits don't render; Esc clears. With an empty catalogue, vendor results are absent (real answers, not apologies).
- Scroll-spy: the sidebar's active row follows the section in view; clicks glide-scroll (rAF, ~380ms — note: `behavior:'smooth'` was a silent no-op in the preview, hence the manual animation).
- Empty-catalogue mode ("Today — nearly empty"): stories and vendors rails render written invitations, never seeded trends; editorials stay live day one. Trending is earned (plays/reads/saves over 7 days), never sold.
- The left control rail (Screen: Desktop/Phone · Catalogue: busy/empty) is prototype scaffolding, not page content.

## Locked facts
- Palette: cream #FDFBF7 page and cards (border+shadow separation), ink #2C2A29, homepage action gold #8C6932 (cream labels — this page deliberately breaks the terracotta rule per the approved v2 concept), highlight #A9834B, links #3B4E67, muted #6E6A62/#8A857B/#A09A8E, hairline #E1DCD1. Light mode only.
- This page uses system font + ui-monospace (approved v2 deviation from the app's Hanken/Cormorant/Space Mono).
- Counts in monospace. No fake doors; zero ≠ failed-to-load; a failed count says so, never "0".
- Sample content (Studio Azul, the Poblete series, etc.) is placeholder — production is nearly empty today.

## Files
- `Homepage Interactive.dc.html` — the working concept (source of truth for structure/behavior).
- `Homepage v2.dc.html` — static spec: search grouping, menu grammar, empty-state and trending rules.
- `support.js` — prototype runtime, reference only.
