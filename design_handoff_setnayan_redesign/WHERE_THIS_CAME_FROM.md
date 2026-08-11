# Where this came from, and why it lives in the repo now

**Received from the owner 2026-08-11** as `Foundation locked in.zip` (Desktop).
Produced 2026-08-08, reconciled against the live codebase at `main @ af8c84e`.

## ⚠ It is committed here for one reason: the LAST design bundle was lost

`Papic_Page_Redesign_Brief_2026-08-10.md` says *"The handoff bundle
(`design_handoff_papic_redesign/`) is accepted on structure … **Build that**"* —
and **that directory does not exist anywhere in the corpus.** Only its structural
summary survived, which is exactly why the Papic page shipped a tab strip (the
navigation, buildable from a summary) and none of the card grammar (the screens,
which were not). A design that lives only in a chat window is a design that will
be paid for twice.

## What was dropped from the zip, and why

`android-frame.jsx` · `image-slot.js` · `support.js` — the bundle's own README
calls them *"prototype runtime helpers; ignore for implementation."* Keeping them
would invite someone to copy a parallel styling system into the app, which the
README forbids in its next breath.

Kept: `README.md` (the rules), `Shell.dc.html` (the canvas — every frame),
`event-dashboard-handoff.html` (the per-widget deep dive).

## What it covers, against the owner's 2026-08-11 phone walk

| His complaint | Frames | Covered? |
|---|---|---|
| 2 · vendor shop page not clean | 4b · 4d | ✅ phone + desktop |
| 3 · wedding page not proper | 2a–2d | ✅ invitation + website, phone + desktop |
| 4 · Studio not clean | 3a–3f + `event-dashboard-handoff.html` | ✅ the deep dive is this exact surface |
| 7 · vendor side not fixed | 7a · 7c · 7d | ✅ calendar, desktop, phone |
| 1 · front door | — | ❌ separate: `prototypes/home_facebook_shaped_2026-08-07.html` |
| 5 · photo page presentation | 2f is the GUEST camera only | ❌ **the couple's 20-card control room is NOT here** — that is the missing Papic bundle |

## The three open questions its README asks the owner — two are already answered

1. **In-event bottom bar** — ✅ **ANSWERED 2026-08-11:** *"6 or 5 is fine. just make
   sure they are all necessary. max is 6."* The phase-swapping bar stays; six is
   the ceiling; every tab must justify its slot.
2. **Add-ons rail on the event Overview, or behind a SubNav tab?** — ⏭ still open.
3. **Does a "Find" type-to-jump palette already ship?** — ✅ **YES, and in more
   places than the question assumes.** Read out of `origin/main`:
   `app/admin/_components/admin-command-palette.tsx` (admin, with a search-parity
   test), `app/dashboard/(launcher)/_components/home-command-bar.tsx` (the
   signed-in home), and per-surface search on guests, seating, library and the
   Suite (`suite/_components/suite-search.tsx` — the box the owner photographed).
   **Do not build one; wire to these.**

## The rules that travel with it — from its own README

- Terracotta `#C24E25` is the ONLY action colour; labels cream, never pure white;
  **gold is never a button**.
- **Recreate in the existing app** using the shipped tokens and the canonical
  `<BottomNav>` / `<SubNav>` / sidebar primitives. **Never introduce a parallel
  styling system.** These files are references, not code to paste.
- ⚠ **`/[slug]` (the guest tree) is owner-EXCLUDED from the Atelier reskin** and
  keeps its Cormorant editorial faces. The owner's complaint 3 is about this
  surface, so **that exclusion needs his word before frames 2a–2d are ported.**
- `app/v/[slug]` — **reconcile, do not redraw**; a 175 KB page ships.
- Marketplace cards: no prices, rating reads "new" and never 0★.
- Zero ≠ failed-to-load; every empty state is a written invitation; no fake doors.
