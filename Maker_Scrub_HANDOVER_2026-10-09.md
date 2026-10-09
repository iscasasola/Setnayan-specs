# Scrub — hand-over for the next session (from builder B1's last report, 2026-10-09)

Owner rulings: corpus `Maker_Animate_Preview_Scrub_LOCKED_2026-10-09.md` + `prototypes/maker_scrub_2026-10-09.html`.
STATE: built, proven in Chromium on a generated page and the lab, SHIPS DARK (`lib/scrub-out-offered.ts`
`SCRUB_OUT_OFFERED = false`). The lab keeps it on: /dev/maker-lab?studio=1&scrub=1 and /dev/maker-lab/guest/scrub (badge).

## What is built (branch rd/the-toolbar-is-four-rows, merged into the batch)
- The held hand-over: `app/[slug]/_components/hub-scenes.tsx` (the nest + `HubPageHold`), `hub-scrub-math.ts` (the owner's
  numbers), `hub-scrub-engine.ts` (measures and sets CSS variables only — never sets scroll, never prevents a default),
  `hub-scrub.tsx` (the island), `hub-scrub-place.ts` (Maker canvas only), the last block of `globals.css`.
- The WHOLE page stands still: site-body wraps both trees' article, one pair of boxes (cell › stage) per hand-over;
  a page with no Scrub scene is not wrapped at all.
- Off is never silent: `data-hub-scrub-off` on the scenes block carries the reason.
- While editing in the Maker nothing is held; ▶ held arms it.
- Proof harness: `node scripts/scrub-browser-check.mjs <playwright-dir> <scratch-dir> [pictures-dir]` — 205 checks at six
  sizes (890×1548, 940×1608, 1280×770, 375×812, 375×667, 441×882). Run after ANY change to the five files above.

## What is left, in order
1. THE CARD RULE. A scene with any motion setting is drawn inside a frame; the hub's card rule only matches a section that
   is the scene's direct child, so a framed scene is bare text on the page. Add the selector for a frame that paints
   nothing and is not "No background"; then the lab drops its own cards. Changes how existing motion-only scenes look in
   production (they get their card back): own commit, before/after render. (Controller approved; not built.)
2. THE COVER AS HAND-OVER ZERO (8e) — the owner's own example ("maria jose must build out and until we say i do should be
   where maria jose build out"). The cover is drawn by site-body's masthead, not the scenes renderer. Needs: a stored home
   for its Build out and Leaves (the hero's own widget row can hold a canvas; no migration), one more block in the nest,
   Animate on the cover in the toolbar. Not mapped: a cover taller than the screen; the Reveal opening over it.
3. iOS. Nothing has run on WebKit. Try in this order: nested sticky boxes; a sticky box taller than the screen with a
   negative top; the address bar hiding (window height changes, the engine re-measures mid-scroll); momentum scrolling.
   The owner tries on his iPhone over Wi-Fi: http://<mac-lan-ip>:3480/dev/maker-lab/guest/scrub (the dev server listens on
   the LAN; the IP is DHCP).
4. SWITCH ON: `SCRUB_OUT_OFFERED` → true, one line.

## Traps
- Six scene templates (Cinematic, Editorial …) and one theme pattern still store `transition: 'scrub'` for a Pro couple.
  Dark, they draw as scroll; switched on, they go live AT ONCE. COUNT stored Scrub scenes before flipping
  (site_widgets.config, event_site_drafts.draft_json / applied_snapshot — zero on 2026-10-09).
- The old Maker's "Into the next scene" menu and the old editor's transition chips also hide Scrub while dark (their
  stacked-run implementation was removed in this batch).
- Custom properties inherit and these boxes nest in their own kind: never leave a length unset while armed (it once cost
  2,148 px of blank page).
- A paused animation listed last does not hold another's opacity; the body's `opacity: 1 !important` does. Measure the
  EFFECTIVE opacity (scene × body), not the scene's alone (every hand-over was once drawn at half its number).
- The engine's "top of the room" is 76 px or 9 % in script; the stylesheet's line is 100 px under the invitation's pinned
  top bar → a long list's arrival can sit ~24 px high.
- The check's own selectors have gone stale twice after a rename: grep `scripts/scrub-browser-check.mjs` on any rename.
- A browser pane reporting `visibilityState = "hidden"` gives a page no animation frames; pictures taken there are stale
  (the engine's 250 ms pulse covers a starved tab).
- A page with one tab per scene has never been played with a Scrub scene.
- Dead references left: `lib/element-style.ts` writes a `.hub-scrub >` rule; `stage-autoplay.tsx` looks for `.hub-sp`.
- Known limits: a PART with its own motion inside a Scrub scene plays its own way; an anchor jump lands up to one hold off.
- Owner's numbers (tunable): Build out 55 % of a screen, the arrival enters at 80 % and runs 22 %, rest 30 % between two
  centred back-to-back hand-overs; Held = Centred.
