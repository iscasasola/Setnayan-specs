# Studio round 3 — build status (2026-10-08, builder S3, wrapped on the owner's call)

PR **#6414** (draft, `do-not-auto-merge`) · `rd/studio-round-3` → `rd/studio-followups` · head `4e4a2047f` — **bundle size check GREEN in CI: 506.9 KB, 0.1 KB headroom, budget not raised.**
PR **#6417** (draft, `do-not-auto-merge`) · `rd/studio-draft-fields` → `rd/studio-round-3` · head `e1951b758` — "draft 1-3".

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
`pnpm typecheck`: clean (after fixing the maker-logo shipped row twice — CI caught a negative tuple index). ⚠ CORRECTION: an earlier line here claimed a green full unit suite (22,828 tests) — that reading was from a log file whose run I could not attribute; RETRACTED. A clean full run on the #6417 tree was started 19:02Z (log: S3 scratchpad `unit2.log`); the first partial run (killed) showed exactly 1 failure, `maker-tools-are-all-preloaded`, fixed in 33463fad7. All 39 non-build `ci.yml` node guards green on the same tree.
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

## ✅ RESOLVED — Maker first-load budget (#6414)
Base (#6406) 506.9 KB → 509.4 (02d5a3ab0) → 508.9 → 507.4 → 507.2 → 507.1 → **507.2 KB at ef04b9e20 — 0.2 KB over 507**. Never raised. Done so far: Studio Love Story sheet split into its own lazy file (`moment-sheet-studio.tsx`, cards chunk); OpenInPlace + the film switch ride the lazy `StudioTool` door; the colour picker rides its lazy callers (no preload entry); the glass-foot constant inlined. Next: find the last ~0.2 KB of first-load delta vs base (candidates: `maker-details.tsx`'s two new server wrappers' StudioTool props, `lib/studio-details.ts` CSS if any client reads it, `maker-tools.tsx`); a local `next build` + `node scripts/check-maker-js-budget.mjs` under the heavy lock gives the chunk list.

## Full unit suite (#6417 tree, 19:02Z run)
22,841 tests · 22,830 pass · **4 fail** · 4 todo → all 4 were guards pinning the pre-"draft 1-3" shapes / one unread audit error; fixed in a7a3afb20 and the 5 files re-run green (65/65). Not re-run in full after the fix.

## Budget push (in progress, 20:18Z)
Local `next build` of #6414 head `ef04b9e20` started under the heavy lock (`s3 build budget`) to list the first-load chunks; static diff vs base shows no first-load client file grew on purpose (maker-tools/details-lazy net 0, studio-skin smaller), so the build list decides. If this line is the last word, the build did not finish: re-run `next build` + `node scripts/check-maker-js-budget.mjs` in apps/web and diff against #6406.

**Budget resolved (4e4a2047f).** Local `next build` reproduced 507.3 KB and showed the culprit: `SiteChromePanel` (website/editor/_components/media-panels.tsx) is in the Maker's FIRST LOAD, and round 3's Music switch Tailwind classes grew it. The switch look now lives in the Studio's server-drawn CSS (`studioFullScreenCss` → `STUDIO_MUSIC_SWITCH_CSS`); the shipped Maker keeps the plain checkbox. CI: 506.9 KB ✅. Headroom is only 0.1 KB — the next first-load addition must be lazy. #6417 rebased onto it.

## 2026-10-08 (later) — builder S3b: owner preview faults 2 + 3, and #6417's red bundle check
`rd/studio-draft-fields` (#6417) head **d947aacc5** (was 3f6072200). Draft, `do-not-auto-merge`, not merged, main not merged in.

**Fault 2 — Studio › E-Gifts › Thank-you message** (`pabuya/_components/pabuya-message-editor.tsx`, Studio branch = `StudioThanks`): "Your own words ⓘ" + Start from ▾ on one row · the words on a full-width row · the character count. No tile, no helper paragraph (15 words behind ⓘ), no Save / Saved, no "Guests see this right away". Typed words go to the DRAFT (`savePabuyaMessage` + the draft field, one write per pause via `makerLatestWrite`; ✓ Apply flushes a write still waiting), then ONE Maker render so the ✓ Apply count moves. A refused write is said in both doors ("These words are not in your draft yet. … Try again") and the words stay in the box. The E-Gifts page and the shipped Maker keep their editor.
- Same-screen sweep, LEFT as they are: "What guests see" (the guest's own card, `PabuyaCardList` — a picture of the guest page) · the dashed "Add your QR" drop zone (shared `FileUpload`) · the centred "Guests see this right away" under Registry link (true: ways to give + registry still save live — but it sits directly above the "Thank-you message" heading and can read as belonging to it; owner call whether it moves up under "Ways to give"). No other tile, helper paragraph or Save on the screen.
- DROPPED in the Studio only: "Clear it" (not in the owner's list of what stays; select-all + delete does it).
- NOT verified: the accepted path (words in the draft → the ✓ Apply badge moves → Apply publishes) needs a signed-in preview. Lab (no session) verified the rest end to end: typing → ONE server action per pause → refusal said in both doors → words kept; a starting point picked in one door is typed into the other, one write.

**Fault 3 — Studio › Love Story, empty** (`our-story/_components/moment-order-cards.tsx`): the prototype draws no empty state, so the shipped card (band · 64 px photo box · year · title · first line · grip — one set of classes shared with the real card) is drawn in grey sample shapes, one under each anchored chapter (How we met · Together · The yes, the real labels). `aria-hidden`, not tappable, gone with the first real moment. "No moments yet." and "+ Add a moment" unchanged. Seen in the lab at 375.
- ⚠ The Studio's REAL list is flat (the couple's own order, no chapter headings — owner 2026-10-06 "one card per moment"), so the three chapter labels exist only in the sample. If that reads as a promise of headings, the alternative is the label in the sample card's title slot.
- **Add a moment sheet (Studio):** Photos · When · This one is… helper lines → ⓘ beside the label. The dashed drop zone is the shared `FileUpload` (left). The foot (✕ Not now · ✓ Keep this moment) is in the form's flow: at the end of the scroll it sits 20 px UNDER the last line (measured in the lab), and a field scrolled into view from below stops clear of it (`scroll-mb-24`). Mid-scroll the form still passes under it with NO backing on this branch — the frosted fill is `.sn-glass-row` from main (#6410), not merged here.

**Budget (#6417 was 507.4 KB, red).** Found two causes, both from "draft 1-3":
1. `lib/hub-draft.ts` (in the Maker's first load) imported `PABUYA_MESSAGE_MAX` from `lib/pabuya-message` → the five templates rode into the first load (chunk 48778: 19.0 → 19.4 KB gz in CI). Now the draft lib's own number, held equal by a guard that forbids the import.
2. the thank-you editor (also the E-Gifts PAGE's) imported `HUB_DRAFT_FIELD` from `lib/hub-draft.ts` → the draft library's chunk landed on the E-Gifts page's list and the Maker's first-load chunks re-split. The editor now spells `'draft'` (guarded equal, import forbidden).
Plus margin: the venues' entry of `HUB_DRAFT_FACT_GROUP` written out, not computed (a kept `Object.fromEntries` statement, −77 B gz simulated on the built chunk).
- ONE local `next build` (CI's env), taken after fix 1 only: **507.09 KB = 519,259 B, 91 B over**. Fix 2 and the margin were NOT rebuilt locally — **CI's "bundle size check" on d947aacc5 is the judge** (run 37697799867). If it is still red, the next suspects are in this file's note: the 24 `n(id)` requires `lib/hub-draft.ts` keeps in the first load for three constants (move `HUB_DRAFT_FIELD` · `HUB_RESET_NEVER_TOUCHES` · `hubDraftOutcome` to a leaf module the toolbar and shell import).
- How the first load grows without a first-load edit (worth knowing at 0.1 KB headroom): (a) a lazy file that imports a NEW export of a first-load module adds it to that module's export map; (b) a file shared with another PAGE that imports a first-load lib re-splits the Maker's chunks; (c) `details-lazy` has 73 doors, each listing every chunk the lazy editors need.

**Found, NOT fixed (outside this brief):** Reply by (draft 1-3 item 3, `maker-rsvp-ask.tsx` `LiveReplyByField`) drafts `held` with no Apply bar in its answer and no render asked — read from the code, the ✓ Apply count does not move after a Reply-by pick until something else renders; it also still says "Saved." under the field. One line (`makerNeedsRender()` on ok) fixes the count; check on the preview first.

Checks on d947aacc5: full `tsc` 0 errors (202 s) · `pnpm lint` 0 errors · 34 guard files 291 tests (287 pass · 0 fail · 4 todo, pre-existing) · 19 `ci.yml` node guards green. Full unit suite + build-dependent guards: CI.

**Bundle verdict (CI, d947aacc5, run 37697799867):** ✅ "bundle size check" GREEN — Maker first load **506.9 KB**, 0.1 KB headroom, budget not raised (was 507.4 red at 3f6072200). Headroom is still only ~0.1 KB: the next first-load addition must be lazy, and see "How the first load grows without a first-load edit" above.

**07:22 PHT, S3b — first-load moves for the combined train (509.5 of 507):** #6417 head **11583a187** = d947aacc5 + `c9d7deb0d` (the Studio tiles' words leave the shell's first load) + `11583a187` (the Studio forms' group headings drawn by the server). No behaviour or visual change; static estimate ≈ −0.4 to −0.55 KB gz, NOT built — Builder T re-measures on the train. Notes for T in `controller-2026-10-08/first-load-moves.md`.

## 2026-10-08 (11:45 PHT) — builder A1: the four attire boards are BUILT — Bridesmaids · Groomsmen · Flower girl · Ring bearer
PR **#6436** (DRAFT, `do-not-auto-merge`, auto-merge off) · `rd/attire-boards-four-more` → `main` · head **daea5939a** · worked on top of `rd/studio-reply-by-editable` @ `83c336a26` (the Event Hub train). Closes the "IN PROGRESS / STOPPED" line above (the four boards) on the owner's *"go"* (DECISION_LOG 2026-10-08, "EIGHT OWNER ANSWERS", item 6).

**⚠ Carries ONE migration — `20271266380994_attire_boards_four_more_slots.sql` — NOT applied anywhere by this builder.** The controller announces it to the owner before the deploy; the pipeline applies it. It re-lists TWO CHECKs, each with every value kept and four added (`bridesmaids` · `groomsmen` · `flower_girl` · `ring_bearer`): the board's `event_inspiration_assets_slot_key_check_v3` and the supplier gallery's `moodboard_library_assets_supplier_gallery_shape`. Idempotent, additive, no data rewrite; a closing `DO` block refuses to finish if either gate lost a value. Two CHECKs, not the one the brief named: a board's "Search ideas ›" reads suppliers' photos BY SHELF (`asset_subtype` = the slot), and the app derives a supplier's upload shelves from the one slot vocabulary — widening only the board's gate would offer a tailor a shelf the database refuses and leave that board's search empty for ever (step 4c's migration made the same two-gate change for the bouquet).

**Built**
- Studio › Mood Board & Dress Code › Attire holds seven boards: Bridal gown · Groom's suit · Bridesmaids · Groomsmen · Flower girl · Ring bearer · Entourage (kept, last). Each is the shipped board — the couple's own photos (＋) and Search ideas › — on a slot of its own. A board sits under its role's row when the guest list has that role (the bearers' ONE row holds Flower girl and Ring bearer); otherwise after the rows, so no board is lost before the couple names their bridesmaids.
- Trades (`MOODBOARD_SLOT_TRADES`, each one of the entourage's own tiles): Bridesmaids → Women's Attire · Filipiniana & Barongs; Groomsmen → Men's Attire · Filipiniana & Barongs; Flower girl → Women's Attire · Filipiniana & Barongs; Ring bearer → Men's Attire · Filipiniana & Barongs. **No children's-attire tile exists in the taxonomy** — `flower_girl_dress` is a service under Women's Attire, `ring_bearer_suit` one under Men's Attire.
- ⚠ CORRECTION to the line above ("Supplier photos are tagged by TRADE tile … not by attire item"): a supplier's photo is tagged with the SHELF it was filed under (`moodboard_library_assets.asset_subtype` = the slot key); the trades decide which shops MAY file there and what the credit says. So the four boards are four NEW shelves — empty until a tailor files a photo — and each board's search reads only its own shelf. An empty shelf says the shipped picker's sentence: "No supplier has added photos for this yet. Nothing is wrong — the shelf is new." Suppliers see the four shelves in their upload picker (only shops whose services reach them).
- **Found and fixed: the ＋ opened nothing in Attire.** The one hidden file input was mounted inside the Inspiration tab, so the three shipped attire boards' ＋ did nothing from Attire (no words). It is now mounted on every tab. Seen in the lab: ＋ on Bridesmaids · Ring bearer · Bridal gown each open the file picker.
- "Use for the bridesmaids" / "Use for the groomsmen" write those roles' own colours. Flower girl · Ring bearer show their palette with no such button (they share ONE palette, `bearers_flower_girl`).
- The four are inspiration boards, NOT render parts (`SLOT_ROLE` → `not_a_part`, as the bouquet): paid "Make it real" renders and supplier sign-off read exactly what they read before.
- `AWAITING_A_SLOT` is empty. The shipped Mood Board page's "Dress codes" group gains the same four tiles.

**Stored shape — for R2's dress-code scene "Figures ▾ Photos" (unchanged; keep stable):** a board = up to three rows of `event_inspiration_assets` with `removed_at IS NULL`, one per `(event_id, slot_key, slot_position 1–3)`; each row carries `image_url`, `sampled_hex_1…6`, `source_kind` (`file_upload` = the couple's own · `gallery_pick` = a supplier's, with `library_asset_id`). The attire boards' `slot_key`s: `bride` · `groom` · `bridesmaids` · `groomsmen` · `flower_girl` · `ring_bearer` · `entourage`. The board list, order and labels are `STUDIO_INSPIRATION_SLOTS.filter((s) => s.attire)` in `apps/web/lib/inspiration-slots.ts`.

**Checks (head daea5939a):** full `tsc` 0 errors (221 s, under the heavy lock) · `pnpm lint` 0 errors · new `lib/four-more-attire-boards.test.ts` 9/9 (the real component drawn on the Attire tab) · new `tests/db/the-four-attire-boards-have-a-slot.db.test.ts` 6/6 · 13 other DB files that touch these tables or the whole schema, 122/122 (`the-gallery-chain-keeps-its-credit` now 24 slots, Ugat schema-claims · concept-coverage · both-ends, exposure-freeze, schema-drift) · the 30 unit files that read a file this branch changed: 370 tests, 369 pass, 0 fail, 1 todo (pre-existing) · all 39 non-build `ci.yml` node guards green · `lint:dup-rule` green. 20 sabotages, each red, each restored (lists in the two test headers). CI on the PR: production build ✅ · bundle size check ✅ (shared 201.7 of 202 KB, unchanged; Maker first load within 507 KB, 7.1 KB headroom) · "typecheck + lint" (the full unit + DB suites) still running when this was written.

**Side-by-side:** `prototypes/attire-boards-2026-10-08/` — ten captures of `/dev/maker-lab?studio=1` at 375 × 812 (built only: the prototype draws no attire boards to set beside them). ⚠ Opened directly at 375, NOT through an iframe wrapper: the Maker refuses to draw inside any frame ("Preview unavailable — the Event Hub Maker can't open inside a preview"), so a wrapper shows only that sentence.

**NOT verified (needs a signed-in preview with the migration applied):** a photo uploaded to one of the four lands and stays · Search ideas › answers (in the lab, with no session, it sits on "Finding photos…") · a supplier files a photo under a new shelf and a couple saves it · "Use for the bridesmaids" moves the ✓ Apply count.

**Open — owner / controller calls, nothing decided here**
1. **Entourage now overlaps Bridesmaids + Groomsmen.** Kept and untouched: couples' photos already live on it, and it is still the slot that conditions the wedding party's paid render. Recommendation: keep it as "the whole party together"; if it should go, hide it only when empty — never move anyone's photos.
2. **Mood Board › Attire has no event-type rule.** The shipped three boards use none, and `studioAttireRows` always draws "The bride" and "The groom" whatever the event type — so a birthday's or a corporate event's Mood Board shows the wedding boards today, and now four more. Not invented here. Recommendation: ONE rule for the rows and the boards together, read from the event's profile (`lib/wedding-only-parts.ts` already answers "does this event have two named people").
3. A supplier's free back-catalogue allowance is counted PER SHELF — four new shelves are four more allowances for an attire shop.
4. Shipped, not changed: the picker's From ▾ (Everyone · Florists · Stylists · Tables · Venues) and its placeholder ("peonies, rustic, white roses…") are the same on every board, attire included; on an attire board those From choices can only return nothing, and the empty sentence then says "the shelf is new".
5. Under the Bridesmaids and Groomsmen rows the board's title repeats the row's ("Bridesmaids" / "Bridesmaids") — the owner's words, left as said; "The bride" / "Bridal gown" reads better.

**Trap for the next builder:** the lock is by label and survives a killed shell — a background `tsc` that hit the harness's 30-minute cap while it held the lock left `A1 attire tsc` orphaned for about seven minutes (02:10–02:17Z) before it was noticed and released. Wrap heavy jobs in a script with a `trap` that releases on TERM, and give the background call the longest timeout.
