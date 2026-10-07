# Stages panel — owner fixes · build status (2026-10-08, wrap-up for the new account — RESUMED, updated per item)

Branch `rd/stages-panel-owner-fixes` · **draft PR #6413** ("WIP — Stages panel owner fixes", `do-not-auto-merge`, auto-merge null) · head **4e22cd36b** (resumed; see the newest DONE rows).
Built on #6398 (merged cd6d471b5) and FU's #6401 (`rd/stages-panel-styles-and-looks`, merged in at e0e05df4a — one style registry `lib/scene-styles-parts.ts`).
Worktree: `~/Documents/Claude/Projects/wt-redraw` (kept, `.next` removed).

> A handoff is not evidence. Re-measure every line below against the branch before acting on it.

## DONE (SHA · what · guard)

| SHA | What | Guard (each seen red by sabotage) |
|---|---|---|
| 19beabb0c | 14-fault batch: a canvas tap only picks; typing on the second tap; five How it moves + Custom; Duration/Delay sliders 0–2 s; Does line; ◆ Into the next scene; Style bar opens the exact Studio field (`MAKER_PART_FOCUS`, `makerPartStudioDoor`) + "✓ Done · back to <Part>"; ＋ on the frame edge | `lib/the-stages-panel-is-the-prototypes.test.ts`, `lib/every-look-draws-a-picture.test.ts` |
| ecce63f2a | **Blank look pictures on Vercel — root cause:** the guest route STREAMS (`$RS`/`$RC` inline scripts move hidden `S:n` segments); the miniature frame is `sandbox="allow-same-origin"` (no scripts) so every section stayed hidden. The parent now applies those moves (`stage-panel/streamed-swap.ts`); cards say "Drawing…" / "Couldn't draw this look" | `every-look-draws-a-picture.test.ts` (streamed finish) |
| 1afb8346f | Page tabs move the canvas again (my regression: `scrollPreviewTo` skipped under Stages); ▶ plays Build in · Action · Build out · rest (`app/[slug]/_components/play-sequence.ts`, bridge `playSeq`) with a status line naming any phase that is none; Reveal labels per prototype; Countdown + Line, Circle | stages-panel test §8 |
| 415798ff4 | **Pass regression fixed:** the pass is picked IN PLACE (ticket overlay hidden under Stages), Style only; ticket-style carousel (3 shipped styles, `PassCardDesignPicker cards`); frame clipped to the canvas band; no-door Look row = part name + ⓘ (sentence once); look cards sized by picture aspect (`spCardWidth`); ▶ status + CameraPartTools lazy (budget) | stages-panel test "Digital pass … in place", lone-ⓘ for every part |
| c04ce3e1b | Countdown = prototype five **Big number · Boxes · Offset · Line · Circle** (owner "allow offset" — ONE narrow exception in `lib/layouts-are-the-shipped-scene-styles.test.ts`); The calendar unregistered (not the default; a stored value falls back to Boxes, measured); Arrange: Order row removed, ⓘ on On this stage / Alignment / Spacing | `every-scene-style-draws.test.ts` (Offset/Line/Circle), stages-panel Arrange test |
| 5bf5fdb67 | **Each tab its own page** (owner "yes pages"): `hubTabsOn` `stagesCanvas` exception via `?tabs=1`; bridge `hubTab` switches in place like `hub-shell.tsx` `showTab`; ready → tab re-sent; `drawnMakerOrder` measures every tab | `lib/every-scene-is-in-the-navigator.test.ts` 1b (amended with owner words, not weakened), `each-tab-is-its-own-page.test.ts` |
| 58f2835de | port-control baseline regenerated | — |
| 4e22cd36b | **Item 1 (resume):** frame chips ↑ upper-left · ↓ lower-left · ✕ lower-right (32 px, name tab right of ↑); ↑/↓ keys, Esc, a tap on the page's ground (`tapOutside`) let go; the SHIPPED swipe step (`makerStepPart`) now walks the page's DRAWN order (`partsInPageOrder`, measured tops), on into the next/previous tab; the frame + ＋ stop in the MIDDLE of the gap to the neighbour (`partFrameEdges`, `lib/maker-stage-room.ts`) and ＋'s tap is only as tall as the gap — fixes the Logo frame on "TOGETHER WITH THEIR FAMILIES". Not seen at runtime yet. | stages-panel test §9 (3 tests, 4 sabotages red) |

Checks: tsc ✓ · `pnpm -s lint` ✓ · every CI `node …mjs` guard + `lint:dup-rule` ✓ (at 5bf5fdb67) · full unit suite 22,825 pass / 0 fail (at 415798ff4) · Maker budget **506.7 / 507 KB** at 415798ff4; CameraPartTools moved lazy afterwards but the final build was STOPPED at wrap-up — **re-measure** (`node apps/web/scripts/check-maker-js-budget.mjs` after `pnpm build`).

Owner rulings recorded tonight: "allow offset" (done) · "keep pro" (every reveal stays ◆ Pro — no change) · Arrange "yes" (done) · "yes pages" (done, unverified at runtime).

## IN PROGRESS (exactly what is left)

- **Tabs-as-pages runtime check** on the Vercel preview (the lab canvas is a stand-in page, not `site-body`; nothing proves the tabs swap yet). Screens wanted: Invitation Welcome vs Details vs Me; all five The Day tabs.
- **Stage → page → parts map table** — started: prototype TABS (line ~1226) vs `MAKER_STAGE_PAGES` (`lib/maker-parts.ts`). Known gaps: Save the Date has `story`/`me` pages the prototype lacks; Post Event is keyed `editorial` with pages home/film/suppliers/gallery vs prototype Thank you · Gallery · Gifts (no `gifts` page, no "Thank you for coming" ename check); RSVP stage matches. Pin test not written.
- **Gutter at the ~800 px pane width** (rows at x=0): not reproduced; needs a run at 800×1111.

## TODO (owner items from the coordinator tonight, verbatim where given)

1. RSVP stage: "RSVP cannot select anything" · "it is the actual RSVP not an editing way" — render in editor mode on the parts system (logo, ename, names, date, place, rsvp, greeting · yesnote, pass · nonote), never interactive; test that the editor RSVP canvas mounts no live submit. Measured: `submitInviteReply` already refuses `SIMULATED_GUEST_ID`. The stage is its own renderer (`maker-rsvp-stage.tsx` + `rsvp-canvas-bridge`), no part registry.
2. RSVP "no way to access yes and no response" / "yes and no page for the rsvp is to show what the rsvp looks like after the reply yes or no" — tabs Form · When yes · When no (icons i-reply / i-check / i-x), each the guest's screen after replying, editor mode, pickable.
3. Pickable sweep — "every visible piece of the page must be a pickable part": `p[data-el="line"]`, `div[data-el="link"]` (link must never navigate in editor), `.pahina-eyebrow` titles ("Title" part), `.pahina-plate` (When/Where → Date/Place looks + "Change the date in Suppliers ›"), the "HAPPENING NOW · Watch the event live →" card; full sweep of every rendered `data-el`/class on all pages; test: every data-el on the editor canvas maps to a pickable part; elementFromPoint test that a frame never blocks another part's text.
4. Frame furniture: "upper left of the highlight is go to the element above · lower left of the highlight is to go to the next element under · lower right is deselect" — ↑ / ↓ / ✕ chips ≥ 32 px, name tab right of ↑; ↑/↓ arrow keys; Esc; tap on empty canvas deselects; swipe-the-row; at page edge ↓/↑ moves to next/previous tab; nothing picked → slim row. Test: chips on a middle part, ↓ picks i+1 keeping the tool, ✕ deselects.
5. ＋ / frame over neighbours: the Logo's frame + ＋ cover "TOGETHER WITH THEIR FAMILIES" (`PART_PAD = 22` draws OUTSIDE the part onto the neighbour). "the ＋ sits in the gap BETWEEN parts and never over another part's content". The "LOGO" name tab floated away from the logo.
6. Reveal FIRST on The Day › Live (it sits below the Happening-now card); add to a page-order test.
7. The Day tabs show the same cover: each tab must show that page's real content (Camera page, Gallery, Me, Live) — likely solved by 5bf5fdb67; verify.
8. Photos of you: "this needs to present different gallery styles" — The grid / The big one / Polaroids drawn with sample photos in cards AND canvas; frame must hug the plate.
9. Palette look: "palette should show the actual previews like the other styles" — replace `data-palette-look` dropdown with picture cards.
10. Dress code figures: "allow an option not to show this also or pick a style to show or upload a photo for each?" — Figures ▾ Drawn · (variant?) · Photos (Mood Board › Attire inspiration) · Hidden.
11. Do's & Don'ts: "the presentation of do's and don'ts doesn't look good with the rest of the website" — theme type/colours, no grey box, ✓/✕, 2–3 looks.
12. Colour: "we already have a design for the color palettes … apply that same concept on the background and on any other color rules parts" + "the mood board colors, then the complementing colors". Split agreed with S3 (a2c616c0ce2860b1f, `rd/studio-round-3`): S3 builds `palette?`/`onRemove?`/`pickerSuggestions` INSIDE `studio/mood-board/_components/colour-picker-sheet.tsx`; **this stream wires `ColourWell` (`website/editor/_components/colour-well.tsx`) → that sheet** after S3 merges. Text colour: rank AA-contrast suggestions first.
13. Reveal and Camera look cards: aspect-sized like the others (only style carousels + pass done).
14. Reveal "only show 1": NOT code — the kinds list is `REVEAL_LIBRARY` filtered by the admin map `reveal_studio_config.templates`; four openings appear switched off in prod → owner turns them on at /admin/reveal-studio (could not read the row: no service key).

## Traps found tonight

- **A sandboxed (script-less) frame never finishes a streamed Next page** — sections stay `hidden` in `S:n` segments; the dev lab does not stream, so it looked fine there.
- **`tsx --test "app/[slug]/…test.ts"` runs ZERO tests** (brackets are a glob class) and prints pass 0 / fail 0. Use `app/*/…` or the suite.
- Pinned guard anchors: putting `!stagesTap &&` at the FRONT of a condition broke four guards that pin `if (data.key === …`; put new conjuncts at the END or use `if (x) {} else if (<anchor>)`. A 300-char window guard (`scrollPreviewTo`) fails on a longer comment.
- `git checkout <file>` to undo a sabotage also wipes your UNCOMMITTED edits in that file — back up to scratchpad and copy back instead.
- GitHub returned 500 on push several times; retry loop + `git ls-remote` to confirm.
- A build started while the unit suite runs gets killed by the 30-min background limit — one heavy job at a time.
- The full-canvas ticket view (`data-maker-ticket-view`) predates this work; under Stages it is now `hidden` (kept mounted for its pinned guard).
