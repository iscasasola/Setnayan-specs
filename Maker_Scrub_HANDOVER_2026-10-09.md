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

---
# UPDATE 2026-10-09 evening (17:55 UTC) — what the Scrub builder did today, and what is left
Branches (LOCAL ONLY, worktree wt-scrub-fix): `rd/scrub-heading-and-card-rule` (ae5d655a05 · e5466a8342) → `rd/scrub-cover-hand-over-zero` on top (eb0dcf639 · f3f0c17d8 · d934d5ed0). All merged into the review copy. Harness 289 green at five/six sizes, Chromium only. `SCRUB_OUT_OFFERED` still false.

DONE
- One number for "the top of the room": `--hub-pin` in globals.css (moved out of the @supports gate); the engine reads it back. (The iPhone recording's heading going off the top was NOT this — it is the approved "a long list scrolls through" rule.)
- The card rule: `:is(.sn-hub-cards,.hub-scene) > .hub-canvas.hub-no-media:not(.hub-bg-none):not(.hub-has-tpl) > .hub-canvas-body > section` — every arranged, frame-drawn scene with no ground of its own gets the hub card back (wider than motion-only; templates excluded). CHANGES SOME LIVE SCENES when it ships — tell the owner at the batch.
- THE COVER AS HAND-OVER ZERO, in the lab and on generated pages only: held where it stands when the page opens (0 % at scroll 0), builds out in place (default Fade), whatever comes next arrives on the centred line at ~80 %, the block after stays below until the cover is gone. Engine: a stage cannot stick before the hand-over before it has let go. Reveal mark `data-reveal-up` on <html>: hand-over zero arms only once the opening is gone (checked by setting the mark by hand; no real Reveal played). A cover whose last child has a bottom margin: fixed (was 40 px low). Lab badge names hand-over zero.
- Controller's decisions (owner has NOT yet looked): hold = where it stands; arrival = whatever comes next (B); the cover leaves through its parts' sheet ("Scene leaves ◆" on the hero row) — no toolbar cover part yet.

LEFT, IN ORDER
1. A WAY TO RENDER THE REAL GUEST TREE. `SiteBody` is an async server component (~55 props) calling createAdminClient() loaders (`loadEventRoleNames`, `loadEventNameStyle`, `loadEditorialData`; also `resolveHubTheme`, `eventWordsFor`, `resolveProfile`, `mainGroundLayerFor`). Only `app/[slug]/page.tsx` imports it; no test renders it; the lab's guest route is a stand-in. Build a fixture render (stub the loaders) — or use a session with database access. NOTHING below can be proven without it.
2. Byte-for-byte guard on the PAGE (not only the component): a page whose cover does not leave renders identically before/after; sabotage by wrapping anyway.
3. Wire the invitation's GUEST tree only: the two `PahinaMasthead` branches of `plan.body === 'normal' && plan.heroShouldRender` inside `<article data-pahina-chapters className="space-y-12">`. Leave the stranger tree's two call sites and `SaveTheDateView`.
4. Measure chapters + spacing before/after on a page with a leaving cover.
5. Stranger tree → Save the Date (its cover is drawn by SaveTheDateView with the film; that stage has its own Auto walker).
6. iOS Safari — nothing has run on WebKit for the cover. 7. A toolbar part for the cover with its own Animate (after the RSVP builder's files are free). 8. COUNT stored scrub scenes, then flip `SCRUB_OUT_OFFERED` on the owner's go.

TRAPS (new today)
- The cover is NOT a sibling of the rest of the page: it sits inside `group(leadTab, <>…</>, { chapters: true, className: 'space-y-12' })` with the reply card / arrival row; the rest is in later group() calls. HubCoverHold can only wrap the cover and the rest of that one group.
- The engine looks for followers only inside `.hub-cover-after` → later groups would not be held under the cover; the `followers` walk in hub-scrub-engine.ts must continue up to the page's stage (provable on a generated page first).
- The group wrapper carries `data-pahina-chapters`; the scroll reveal styles `[data-pahina-chapters] > *` → once wrapped, the cover's cell is the one chapter child and the reply card stops revealing on its own.
- `space-y-12` sits on the group → once wrapped, the 3rem between cover and next block is lost; the rest-of-page box needs it.
- Tabbed page: the cover's hand-over only on the first tab.
- `hubScrubHoldsAtMost(widgets, …)` already counts the hero row → a page already wraps itself one pair more once a cover is set to Scrub, even before the cover is wired.
- Many guards regex site-body's JSX, incl. the two `<HubPageHold holds={pageHolds}>\s*<article data-pahina-chapters` matches in guard (8).
- Unit tests run with `tsx --test`; a path with `[slug]` must be written `[[]slug[]]` or zero tests run and it prints green.

---
# UPDATE 2026-10-10 — THE BLOCKER IS GONE: the real guest page can be rendered on a Mac with no database
Commit `7ae4c46d8`, branch `rd/site-body-fixture-render` (worktree wt-sitebody), merged into the review copy (`56e81e506`). NOT on GitHub / not live — test tooling only; rides the next batch. `site-body.tsx` is NOT edited.
- Helper: `apps/web/lib/site-body-fixture-render.ts` → `renderSiteBodyFixture(overrides?)` / `renderSiteBodyFixtureFull(...)` (returns `{ html, mounts }`). It replaces only the two modules that build a database client (`lib/supabase/admin.ts`, `lib/supabase/server.ts`) through the `Module._load` door the repo's render tests already use; behind it is an empty database (reads recorded, writes throw). Clock, time zone and locale are pinned for the render. A test must import the helper BEFORE anything that draws the guest page.
- Guards: `apps/web/lib/site-body-fixture-render.test.ts` + `site-body-fixture.golden.html`: (1) the real tree is drawn, (2) BYTE FOR BYTE against the golden, (3) no Scrub boxes and no island on a page with no Scrub, (4) a stored Scrub scene while dark = the plain page; switched on = one page pair + the island, (5) nothing in the app imports the fixture. 5/5 on the review tree.
- COVERS: the invitation's GUEST tree, ordinary state (Maria & Jose, 12 Dec 2026, a listed guest who has not replied, Invitation stage, `plan.body === 'normal'`, monogram masthead, free event, House theme, tabbed page). NOT COVERED: the stranger's tree, Save the Date, The Day, Post Event, the Maker's canvas, hero photo/film, Pro themes, a replied/declined guest.
- NEXT STEP (item 3 of "LEFT, IN ORDER" above): wire `HubCoverHold` into the two `PahinaMasthead` branches of the guest tree, run guard (2) WITHOUT `UPDATE_GOLDEN` (green = a page whose cover does not leave is unchanged), then add:
  ```ts
  const today  = await renderSiteBodyFixture({ proWatermarkHidden: true });
  const stored = await renderSiteBodyFixtureFull({ proWatermarkHidden: true, widgets: fixtureWidgets({ hero: LAB_SCRUB_COVER }) });
  assert.ok(stored.html === today, 'a cover stored to leave by Scrub, while dark, is today’s page');
  assert.equal(stored.mounts.HubScrub, 0);
  ```
  and for the switched-on arm branch on `SCRUB_OUT_OFFERED` and assert `class="hub-cover-cell"` once and `stored.mounts.HubScrub > 0`.
- FOUND, not changed: a Countdown stored to Scrub on the tabbed Invitation draws no cell (it is alone in its scenes block on Welcome) yet the page still wraps one pair for it; schedule times follow the SERVER's locale (`formatBlockTimeRange` uses `toLocaleString(undefined, …)` — a German process prints "14:30").
- LIMITS: this is React's HTML renderer calling the components — not the HTML Vercel serves (no document shell, no client scripts), nothing ran in a browser, CI has not seen the golden (made on Node 22.18).
