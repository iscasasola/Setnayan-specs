# E-Gifts › Wish list — build status (Builder E1, then Builder EH, 2026-10-08)

Contract: `EGIFTS_WISH_LIST_2026-10-08_fable.md` · prototype `prototypes/egifts_wish_list_2026-10-08_fable.html` · owner: "ok wish list" · "1. per item 2. live".

> A handoff is not evidence. Re-read every head and check below before acting on it.

## STATE (Builder EH, 2026-10-08 evening) — all four DRAFT · `do-not-auto-merge` · auto-merge off

| Step | Branch | PR | Head | Mergeable when written |
|---|---|---|---|---|
| E-PR1 · the two tables | `rd/wish-list-tables` | #6432 | MERGED (tables live in production) | — |
| **E-PR2 · Studio › Wish list** | `rd/wish-list-studio` | **#6435** | `8a5883272` | MERGEABLE, checks running |
| **E-PR3 · the guest's list + send sheet** | `rd/wish-list-guest` | **#6440** | `2e22ecee8` | MERGEABLE, checks running |
| **E-PR4 · "I sent it"** | `rd/wish-list-record` | **#6444** | `1e6647f4b` | MERGEABLE, checks running |
| **E-PR5 · Gifts sent to you** | `rd/wish-list-gifts` | **#6463** | `7e0590940` | MERGEABLE, checks running |

Each branch carries `origin/main` `482a671b3` and everything below it (merged bottom-up; generated baselines regenerated on each merged tree, never hand-merged). No migration in any of the four. +0 exported server actions (1,199). +0 routes.

## THE MINIMUM-REQUEST CHANGES (owner rule 2026-10-08; controller's four named changes — all done, on the lowest branch that holds each file)

| # | Where | Before (read from the code) | After | Guard |
|---|---|---|---|---|
| 1 | #6435 `studio-wish-list.tsx`, `wish-items.server.ts`, `pabuya/actions.ts` | every add · edit · got it · remove · reorder = 1 action + 1 `router.refresh()`, and **2 whole-Maker server renders** (one inside the action's own response — `revalidatePath` in an action makes Next render the action's route — one from `requestMakerRefresh`); a reorder wrote each moved wish one after another | **1 request, 0 Maker renders.** The five saves are held; edit / got it / a run of moves fold into one write per wish (`makerLatestWrite`); a save answers with the row as kept; the door refreshes guests' pages after its answer (`after`); a reorder writes only the moved wishes, together | `lib/the-wish-list-costs-one-request.test.ts` (5) · DB test 8 |
| 2 | #6444 `gift-record-sheet.tsx`, `wish-list.tsx` | `router.refresh()` after a kept gift = the whole gift page rendered again | **0 page renders**: the list is redrawn from the write's answer (`withOwnGift`), pinned equal to the next read | `lib/a-kept-gift-is-drawn-not-refetched.test.ts` (5) |
| 3 | #6440 `loaders.ts` `loadDoorwayFacts` | +2 reads after the egift read, on every guest page view of an event with a way to give on | **+1** (`readOpenWishCount`: a head count; event-level — no guest id, no cookie; at most once per render via `askedOnce`); **0** when no way to give is on — skipped by `enabledEgiftCount`, a fact the loader already holds (it folds in the gift route switch and "Accept gifts? No") | `lib/the-gift-door-asks-one-count.test.ts` (5) |
| 4 | #6444 `gift-door.server.ts` | two `revalidatePath` by hand | the one door, `revalidateGuestSite(slug)` | same file as 2 |

Supabase requests per write, counted on the REAL functions over the replayed schema with RLS on (`counted()` in `tests/db/pglite-client.ts`): add a wish 2 · edit 3 · got it 1 · remove 1 · reorder 1 + one per wish that moved · "I sent it" toward a wish 4 together + insert + sum + (mark only when it reaches) · correct / remove / put back a gift 1 (+2 together and 0–1 mark when it counts toward a wish) · move a gift 2 together + 1 + 2 together + 0–2 marks · one opened screenshot 1. Each Studio action also costs the door's sign-in check and, after the answer, one read of the event's address.

Per render: Studio › E-Gifts' wish list = **2 reads** (one per table, together; nothing signed). The guest's E-Gifts page list = **2 reads** together (3 for a recognised reader — see "Open choices").

## What is in E-PR5 (Builder EH, on E1's uncommitted draft — saved first as `511eaed87`)

E1 left 13 uncommitted files: the list screen, the open-gift sheet, the three writes and their tests, mostly complete. What EH changed before calling it done:
- **No screenshot is signed in the list read.** The draft signed one address per record on every Maker render and drew a picture in every row. Now the list read signs nothing; ONE gift's screenshot is asked for when that gift is opened (`readGiftShotUrl`: host's own client, this event's private folder only, 10-minute address, reused 8 minutes; "Try again" on a refusal, nothing retries by itself). A row draws a mark.
- **A gift action is 1 request and 0 renders** (the draft: 2 Maker renders per action, a read before every write, a read per wish settled one after another). Drawn first (`settleDrawn` ⇄ `gotAfterGifts`), saved held, one-pass settle, a refusal puts back only that record; a late refusal (`kept`) leaves the record as drawn.
- "Counts toward" is the Maker's own dropdown (`PickMenu`), not a native select.
- "Gifts sent to you" is a screen of its own: one CSS rule (`globals.css`, keyed on `data-details-egifts`) hides the rest of E-Gifts while it is open.

Files: `studio-wish-gifts.tsx` · `studio-wish-sheet.tsx` (new, lazy) · `studio-wish-list.tsx` · `pabuya/gift-records.server.ts` (new) · `pabuya/wish-items.server.ts` · `pabuya/actions.ts` · `lib/wish-list.server.ts` · `lib/wish-list-studio.ts` · `maker-details.tsx` (a comment) · `globals.css` (one rule) · `wish-list-fixture.ts` (the lab's stand-in screenshot).

Lab: `/dev/maker-lab?studio=1&tool=details&item=gifts&wish=five` → open the E-Gifts tile → "Gifts sent to you ›".

## Deviations in E-PR5 (each with a recommendation)
1. **A row shows a mark, not the screenshot's thumbnail.** A private picture per row is a request per row; there is no stored thumbnail. *Keep, or add a small stored thumbnail (a column → a migration) if the owner wants pictures in rows.*
2. **No `/api/gift-shot/[publicId]` route** (the plan's). A route counts against Vercel's 2,048. The picture rides the E-Gifts page's one door. *Keep.*
3. **`OpenInPlace` is not the component used** — its door is a fixed "＋ word" pill; the drawing's is a row with ›. Same ✓ Done skin. *Keep, or give `OpenInPlace` a `door` slot.*
4. **"E-Gifts" stays as the title above "Gifts sent to you"** (the drawing replaces it). *Owner call.*
5. **Put it back** on a removed record is added (the design says remove is soft so a record can be restored, and draws no control).
6. **No toast.**

## Open choices (not changed — owner / controller)
- **A recognised reader's gift page reads `event_gift_records` twice** (all sums, then their own records): 3 reads. One read is possible by taking `giver_guest_id` with the sum — at the cost of the stack's guarantee that the guest path's sum read names no person.
- **The wish photo's address** is built with `publicUrlForStoredAsset` (as E-PR2 shipped); COMMON rule 5 now prefers `displayUrlForStoredAsset`. The speed lane's door.
- **The Maker's canvas does not redraw after a wish write** (held saves). The Welcome door's "Wish list · N things they'd love" on the canvas is as of its last render. `makerRedrawSave` would redraw it at the cost of a guest-page render per wish action. *Recommendation: leave held.*
- **The approved E-Gifts rows above the wish list (ways to give, QR, registry) still save unheld** (`studio-tools.tsx`, on main) — the speed plan's step 14.

## NOT verified (be exact)
- **No browser was opened and no capture was made by EH**: the one dev-server slot was the owner's review server for the session. Frames 07 · 08 (built vs prototype at 375) are still owed — `prototypes/wish-list-built-2026-10-08/` has E1's frames 02–06 · 09–17 · 21–23 only.
- **`PickMenu` inside the gift sheet** (a dropdown opened above a `Sheet`: its list is z-95 over the sheet's z-90) — not seen.
- **The `:has()` rule** that makes the gifts list a screen of its own — pinned as text, not seen.
- A real signed address against the real bucket (the DB test signs with made-up credentials and checks the URL's parts).
- That `after()` + `revalidatePath` refreshes guest pages on Vercel as a direct call did; that Next skips the render when no path was revalidated (both read from next 15.5's code).
- Full `tsc`, the full unit suite, the DB replay step, the production build and both bundle budgets: CI's.

---

## E1's RECORD (as written 2026-10-08 ~13:00 — heads and CI lines below are SUPERSEDED by the table above)

| Step | Branch | PR | Head |
|---|---|---|---|
| **E-PR1 · the two tables** | `rd/wish-list-tables` (`main` `9b2065225` merged in) | **#6432** | `937358e65` |
| **E-PR2 · Studio › Wish list** | `rd/wish-list-studio` (on the tables branch) | **#6435** | `0e1719a38` |
| **E-PR3 · the guest's list + send sheet** | `rd/wish-list-guest` (on the Studio branch) | **#6440** | `a3eda2880` |

**E-PR1 carries ONE migration: `supabase/migrations/20271266228704_the_wish_list_two_tables.sql`.** The pipeline applies it. Never apply it by hand. E-PR2 and E-PR3 add none. Nothing is deployed.

Built-vs-prototype at 375 px: `prototypes/wish-list-built-2026-10-08/` (Studio, frames 02–06 · 09–11) and `…/guest/` (frames 12–17 · 21–23, plus 17b = the send sheet for a reader the event does not recognise).

## CI (read 2026-10-08 ~13:00 PHT — re-read before acting)
- #6432 @ `937358e65`: 14 pass, `typecheck + lint` still running (its first run's one red test — the stale Ugat screens map — is fixed).
- #6435 @ `0e1719a38` and #6440 @ `a3eda2880`: runs in progress — **not seen green yet**. The two bundle budgets are CI's to measure.

## Controller's three items (2026-10-08, after reading frames 02–11)
1. **`main` `9b2065225` merged** into the tables branch, and that into the Studio branch. Baselines regenerated on each: `ugat:screens` (changed on both) · `port:baseline` (changed on Studio and guest; on the tables branch only its ref stamp moved, so it was left) · `root-map`, `lint-no-card --update-baseline`, `exposure:baseline` (unchanged). Count headers rechecked: exposure 6646 facts · `ugat-both-ends` 45 on tables / 44 on Studio and guest.
2. **A wish with no photo draws ONE gift glyph** (lucide `Gift`) in its square — Studio rows and the guest's list. The prototype's fryer / cooker / luggage drawings are per-item stand-ins for the couple's own photos with no rule behind them. Inside the lazy Studio chunk; nothing added to the Maker's first load.
3. **Scratch:** everything of mine now lives under `<session scratchpad>/e1-wish/`. Before that I wrote to the SHARED top level: `capture.mjs`, `run-capture.sh`, `tsc.log`, `dev.log`, `capture.log`, `bak/` (two files), `shots/` (created, nothing written), and several `*.txt` / `*.log` lists. `capture.mjs`, `dev.log` and `capture.log` existed or were written by another builder at the same time — treat those three as possibly clobbered.

## TODO (as E1 left it — both are now built: E-PR4 = #6444, E-PR5 = #6463)

## What is in E-PR1
- `event_wish_items` + `event_gift_records` as § 3 of the design. RLS on at CREATE TABLE; one policy each, the exact `event_egift_methods_host_all` predicate; no anon policy, no anon grant.
- `apps/web/lib/wish-list.ts`: row types, `WISH_ITEM_SELECT` / `GIFT_RECORD_SELECT` (canonical), `GIFT_SUM_FIELDS` / `WISH_GUEST_FIELDS` (purpose projections), `sumSent`, `countSent`, `sentByWish`, `reachedPrice`, `leftToReach`, `meterPercent`, `gotAfterGifts`, `wishesInOrder`.
- Ugat joint **J52** (claims for both tables, incl. absences: no order / verified / received / status column); regenerated `screens.generated.json`.
- Regenerated: exposure baseline (+30 facts, all `authenticated`, anon `-`), FK-behaviour roster (+1 SET NULL).
- Classified: erasure `AUTHOR_UUID_NULLS`, export `DELIBERATE_EXCLUSIONS`, data-subject `NAME_COLUMNS_THAT_ARE_NOT_PEOPLE`.

## What is in E-PR2
- `launch/_components/studio-wish-list.tsx` — the section (rows · meter · Got it ✓ · grip · ＋ Add an item · a wish's sheet · the states), on the lazy `StudioTool` door.
- `pabuya/wish-items.server.ts` — `saveWishItem` · `deleteWishItem` · `moveWishItem` · `setWishItemGot`, reached through `saveEgiftMethod` when the form carries `wish_op`. **+0 exported server actions (1199 → 1199).**
- `lib/wish-list-studio.ts` (the words, the one-setting rule `wishListShownToGuests`, the rows → view) · `lib/wish-list.server.ts` (`readStudioWishList`, `{ read: false }` on a refused read).
- `maker-details.tsx`: the mount, "Accept gifts? No → nothing below", the thank-you row folded with it, the tour. `launch/page.tsx`: the read (only while the new Maker's Studio is on).
- `lib/tours.ts`: `customer_wish_list_v1`. `lib/r2-client-ref.ts`: `wishPhotoPolicy`. Event media sweep: wish photos are deleted with the event.
- `ugat-both-ends` baseline 45 → 44.
- Lab: `/dev/maker-lab?studio=1&tool=details&item=gifts&wish=five|empty|fail|noway|off` (open the E-Gifts tile).

## What is in E-PR3
- `app/[slug]/pabuya/_components/wish-list.tsx` — the guest's list (four shapes) and the send sheet. Takes the page's ready-drawn ways (`ways`) and, for 4/5, one prop `sent`.
- `app/[slug]/pabuya/page.tsx` — reads the list beside the ways to give, asks `wishListShownToGuests`, resolves the shape from the picked E-Gifts look, mounts the list above the ways.
- `lib/wish-list-guest.ts` (the guest's view and words, `wishListShape`, `wishDoorLine`) · `lib/wish-list.server.ts` `readGuestWishList` (service role; `WISH_GUEST_FIELDS` + `GIFT_SUM_FIELDS`).
- The Welcome door's line: `loaders.ts` (`openWishCount`) → `site-nav.ts` (`GuestDoorways.wishes`) → `site-body.tsx` → `guest-welcome.tsx` → `guest-doorway-strip.tsx`.
- `app/_components/pabuya/pabuya-card-list.tsx` — optional `idScope` (the second drawing's element ids).
- Lab: `/dev/maker-lab/guest?wish=five|got|long|noprice|door&look=rows|side|tiles|ruled&known=0` (no new route).

## Type letters used
**All 26 single letters are already passed to `generate_public_id` by some table** (`Y` by four, `C` by six), so none is free; the letter is a reading aid, never a key.
- `event_wish_items` → **`H`** (as designed; shared only with `chat_threads`).
- `event_gift_records` → **`Y`** (the E-Gifts letter, shared with `event_egift_methods`) — NOT the designed `G`, which is `guests`: a record sits beside its giver's guest id.
- Single-letter on purpose: `lib/csp-report.ts` masks only `S89[A-Z]-…`.
- Recorded in `02_Specifications/Account_ID_Format.md` (new dated note at the top).

## Deviations (each with a recommendation)
1. **Grants are narrower than `event_egift_methods`** (which still carries the stock `anon` + `authenticated` SIUD). New tables: `anon` nothing; `authenticated` SIUD on wishes, **SELECT + UPDATE only** on gift records. *Keep.* E-PR4 inserts with the admin client (as designed); E-PR5's remove/restore is an UPDATE of `removed_at`.
2. **`ugat-both-ends` baseline rows.** That required guard refuses a table with no writer, and the plan lands the tables a PR ahead of their writers. E-PR1 adds two rows (43 → 45), E-PR2 takes `event_wish_items` out (→ 44), **E-PR4 must take `event_gift_records` out (→ 43).** *Accept*, or merge 1/5 and 2/5 together.
3. `method_kind` on a record is length-capped, not tied to the five kinds (a second CHECK would refuse a guest's record the day a kind is added).
4. **Gift rows inside a wish's sheet are read-only**, show "shot" / "no shot" instead of the picture, and the line reads "Only you see these." (the drawing adds "Tap one to correct or remove it."). The picture needs E-PR5's host-gated route and the tap is E-PR5's screen. *Finish in E-PR5.*
5. **"Gifts sent to you" has no chevron and opens nothing** — a count only, as briefed; a chevron on a row that does nothing would be a dead control. *E-PR5 makes it a door.*
6. **The photo field is the shipped `FileUpload` as it ships** (its drop zone and "Drop a file or click to choose"), not the drawing's small "Add a photo" square. *Keep, or restyle `FileUpload` in a PR of its own.*
7. **The sheet is the shipped `Sheet`** (a ✕ in its corner, no grab handle), as Love Story's add sheet. *Keep.*
8. **No toasts.** The drawing shows "Added — guests see it right away" etc.; the Maker has no toast and its rule is no "Saved" chips. A refusal is said in place. *Keep.*
9. **"Guests see no E-Gifts." is drafted truth.** "Accept gifts?" is an answer in the hub draft, so after picking No guests still see E-Gifts until ✓ Apply — the same as every drafted answer on that screen. The words are the drawing's. *Owner call if it should say "after you apply".*
10. A way to give's label is the shipped one ("Bank transfer", the drawing says "Bank").
11. A wish's link accepts a paste without its scheme (`shop.example/x` is kept as `https://shop.example/x`).

12. **(E-PR3) No "✓ I sent it" yet.** The send sheet draws ✕ Close alone and only "Setnayan never touches your money." — the screenshot sentence, "Sent a gift? Show the couple ›" and "You sent ₱ ✓" arrive with E-PR4 through the list's `sent` prop. *A button for a step that is not built would be a dead control.*
13. **(E-PR3) No wish line on a solemn page's gift door.** "things they'd love" is a celebration's sentence and no quiet one is written; the list itself is still drawn on a wake's gift page. *Owner call: a quiet sentence, or no wish list at all for a wake.*
14. **(E-PR3) The list's styles are classes in the component**, not three blocks in `globals.css` as the plan's table says. Same drawing, no global rule to collide with the door's `[data-part-look="gifts.*"] a` rules.
15. **(E-PR3) A wish's shop link is not shown to guests** — the drawing shows none (the couple's note is shown).
16. **(E-PR3) The door's first line is the shipped one** ("The digital money dance — straight to the couple." on a wedding); the drawing shows the plain "Send E-Gifts straight to the couple."
17. **(E-PR3) The hub page's gift door has no wish line** (it builds its own doorway facts; not drawn in the prototype).
18. **(E-PR3) I edited five guest files other builders may be in** — `site-body.tsx` (6 added lines), `guest-welcome.tsx`, `guest-doorway-strip.tsx`, `site-nav.ts`, `loaders.ts` — all additive. Expect a textual merge with #6433 / #6437.

## Traps for whoever builds E-PR4–5
- **A record's `wish_item_id` is a single-column FK** — nothing ties it to the same event. Every read filters on `event_id` too.
- **Sums:** always `sumSent` / `sentByWish` (removed records never count). A guest page may read only `GIFT_SUM_FIELDS`; ask `wishListShownToGuests` whether to draw the list at all.
- **Got it:** call `gotAfterGifts(wish, sentPhp)` in the action that adds / corrects / moves / removes a record; `'host'` is never touched by a sum. After a host flips OFF an auto-marked wish, the next record marks it again (the design's rule) — say so on the screen or raise it.
- **E-PR4 hooks:** pass `sent={(wish) => <YourButton …/>}` to `WishList` (it also switches on the screenshot sentence); a guest's record names a wish by its PUBLIC id (`GuestWish.id`, `S89H-…`) — resolve it to the row with `event_id` in the same query. Two tests pin that the page hands in no `sent` — update them in that PR.
- **The no-card lint** cannot see that a class string in a table belongs to a `<button>` — mark such lines `// no-card-ok: <why>`.
- **The dup-rule guard** also refuses a LOCAL named like an imported module's export (`const openWishCount` beside `import … from wish-list-guest`).
- **The honest-words guard** (`app/[slug]/_lib/the-guest-text-is-honest.test.ts`, `GIFT_SURFACES`): add every new gift surface to the list. It reads identifiers too — a state called `confirm` trips it.
- **Data-subject register (E-PR4):** `event_gift_records.giver_name`, the message and the screenshot are a GUEST's personal data. The register's scan does not match `giver_name`; anchor it in the `guest` category in the PR that first writes a record. It changes the privacy register — surface it to the owner.
- **Erasure (E-PR4):** a gift record has no account column, so the erasure detector cannot see it.
- **Event media sweep (E-PR4):** register `event_gift_records.screenshot_r2_key` in `lib/event-media-sweep-core.ts` in the PR that first uploads one (wish photos are already there).
- **Storage:** a replaced or removed wish photo is not deleted until the event is (no displaced-object cleanup yet).
- **`every-maker-edit-shows-before-it-saves`:** every `makerSave` in the Maker must follow a state write in the same handler — draw first, save behind it, put it back on refusal.
- **`numbers-carry-commas`** reads a JSX `{count}` (any identifier that looks like a quantity) as a number printed without commas — name a sentence a sentence.
- **The dup-rule guard** reads a hand-typed select that reproduces ≥ ~30 % of `WISH_ITEM_SELECT` as a dropped column. Use the constant, or a named `*_FIELDS` projection.
- `formatPhp` (`lib/php.ts`) is the only money formatter.
- DB tests: `event_moderators.permissions_json` is NOT NULL (`'{}'::jsonb`). `tests/db/the-wish-list-writes-keep-their-rules.db.test.ts` has a small supabase-shaped client that runs as the signed-in person with RLS on — reuse it for `recordGift`.
- **After changing `lib/ugat/graph.ts` or any screen's reads, run `pnpm -s ugat:screens`** — CI's one red test on E-PR1's first run was the stale screens map.
- Regenerating `ugat-both-ends.baseline.txt` (`UPDATE_BOTH_ENDS_BASELINE=1`) wipes the dated notes in its header — put them back by hand.
- `node apps/web/scripts/lint-migrations-never-deleted.mjs --write` adds 406 unrelated lines — do not run `--write` in a feature PR.
- The session scratchpad is SHARED by every builder of one controller: keep files in a folder of your own (another builder's `tsc.log` / `dev.log` / `shots/` overwrote or mixed with mine).
