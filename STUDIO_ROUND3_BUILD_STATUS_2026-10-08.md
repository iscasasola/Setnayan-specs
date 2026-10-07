# Studio round 3 — build status (2026-10-08, builder S3, wrapped on the owner's call)

PR **#6414** (draft, `do-not-auto-merge`, autoMergeRequest null) · branch `rd/studio-round-3` → base `rd/studio-followups` (#6406) · head `a6497e781` (typecheck fix + guards).
PR **#6417** (draft, `do-not-auto-merge`) · `rd/studio-draft-fields` → base `rd/studio-round-3` · head `bd1be5279` — "draft 1-3".

_Updated after the wrap was lifted (coordinator: keep building ~2.5 h)._
Side-by-sides: `prototypes/studio-round3-2026-10-08/` (prototype vs built, 375 px, maker-lab fixtures).

## DONE (in 2caf3c368 + 27d3133aa)
1. Love Story › + Add a moment — app tokens, Schedule's `Sheet` portalled above the sticky bar, When / This one is… / Added by = one PickMenu each, ✕ Not now · ✓ Keep this moment in a `sn-glass-row` foot. Verified in the lab at 375.
2. Look › Background — every still over a drawn swatch (`StillOverSwatch`, `loopSwatch`), eager, removed on error. Lab shows Modern gallery walls rendering. Root cause on the preview NOT reproduced (the posters answer 200 on r2.dev); the fix makes a broken glyph impossible either way.
3. Prints "Set up E-Gifts" → E-Gifts' own editor in place (`OpenInPlace`, ✓ Done · back to Prints). "Same as the Event Hub" → switch.
4. E-Gifts "Your own words" → one "Start from ▾" (Studio only).
5. Seat plan (Studio, phone) — compact head, Auto arrange · Rules ▾ · View ▾ glass row in the thumb zone, people pull-up sheet (peek "N guests · N unseated"), no 3D card, zoom at top, room fitted on open. ⚠ NOT visually verified: the maker-lab has no seat-plan editor (its Seat plan tile showed the march). Walk it on a real preview.
6. One setting, two doors — `lib/one-setting-two-doors.test.ts`; Guests half asserted by path (`todo` here), 6/6 green on `rd/guests-setup-with-the-maker`.
7. One colour picker — Mood Board `ColourPickerSheet` gains `palette` + `onRemove`; order Your palette → Goes with your palette (`pickerSuggestions` = Mood Board's own `candidatesFor`) → From your photos → Swatches → Custom. `StudioColourField` mounted in Look › Colours, Info › QR colour (scan check kept), Logo › Colour.
8. Mood Board tabs Palette · Attire · Inspiration · Do's & Don'ts; Bridal gown / Groom's suit / Entourage boards inside Attire (upload + Search ideas ›).
9. Look › Music — no Save in Studio (upload/switch posts the same `updateSiteChrome` draft form); Play music = switch.
Guards (each sabotaged red once): `studio-round-3-follows-the-owner` (7), `every-studio-colour-opens-the-one-picker` (3 + 1 todo), `one-setting-two-doors` (3 + 3 todo). Updated: `the-seat-plan-on-the-phone`, `the-guided-steps-share-one-layout`, `every-slot-maps-to-a-taxonomy-category`, `bouquet-and-centrepieces-have-a-slot`. Regenerated `screens.generated.json`. All 41 `ci.yml` node guards green except the build-dependent two (not run).

## RUN / NOT RUN
Full `pnpm typecheck` on the draft-fields tree (which contains round 3): 1 error (maker-logo shipped row) — fixed in a6497e781. Full unit suite: running at the time of this update (see below).
Not run:  full unit suite, production build + 507 KB Maker budget (`check-maker-js-budget.mjs`), `check-vercel-route-count.mjs`. New first-load imports: `Sheet` + `PickMenu` in moment-sheet (the picker sheet is lazy).

## IN PROGRESS / STOPPED
- Groomsmen · Bridesmaids · Flower girl · Ring bearer boards — STOPPED: need `event_inspiration_assets_slot_key_check` widened (migration). Recorded in `AWAITING_A_SLOT`.
- Supplier photos are tagged by TRADE tile (`MOODBOARD_SLOT_TRADES`: grooms_attire, mens_attire, womens_attire, filipiniana_barongs, brides_attire, hmua), not by attire item — no per-item (gown/suit/flower girl) tagging exists. Search ideas › on each attire board searches its slot's trades.
- `ColourWell` → `ColourPickerSheet` (Look › Colours › Background · Buttons, all Stages wells) — RD (afea631711599398c) agreed to own it.
- `rd/studio-draft-fields` — BUILT as #6417: opening line · thank-you words · Reply by draft, Apply writes them (Reply by via admin client). STOPPED on E-Gifts ways to give (`event_egift_methods` rows — draft-shape change). Registry link stays live.

## TODO — owner items from tonight (verbatim as relayed)
- "we already have a design for the color palettes and how to pick colors on the moodboard. apply that same concept on the background and on any other color rules parts" — remaining: ColourWell wells (RD), Prints colours (none found in Studio), Background colour (= ColourWell).
- "the color suggestions should rely on the moodboard as well. so the mood board colors, then the complementing colors for them" — done in the shared sheet.
- "Inspiration can go more. Bridal Gown, Groom's Suit, Groomsmen, Bridesmaid, Flowergirl, Ring Bearer" / "this simply means on attire, they can upload inspiration photos and also search from the photos uploaded by vendors" — 2 of 6 + Entourage done; 4 need a migration (owner call).
- Tabs "Palette · Attire · Inspiration · Do's & Don'ts" ("ok") — done.
- "and no save button" (Look › Music) — done.
- "draft 1-3": opening line, E-Gifts ways to give + Thank-you, RSVP Reply-by into the hub draft; slug stays live — #6417 (ways to give NOT drafted: owner call on drafting `event_egift_methods` rows).
- "apply this to all glass row" — rows touched here carry `sn-glass-row`; the class lands with builder GR (not on main at wrap; until then those rows are unfilled).

## Traps
- `.sn-glass-row` is not on main yet: the Love Story foot / seat tools / Add-a-moment bars render transparent until GR merges.
- A single-file `tsx --test` on a path with `[eventId]` matches nothing — use `app/dashboard/*/…`.
- `node:test` `todo` hides a failure — the Guests halves are separate `todo` tests so the Studio halves still fail loudly.
- maker-lab needs `R2_PUBLIC_URL` set to show the theme stills; its Seat plan tile is not the seat-plan editor.
