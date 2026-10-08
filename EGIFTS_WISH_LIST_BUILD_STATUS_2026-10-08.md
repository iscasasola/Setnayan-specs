# E-Gifts › Wish list — build status (Builder E1, 2026-10-08)

Contract: `EGIFTS_WISH_LIST_2026-10-08_fable.md` · prototype `prototypes/egifts_wish_list_2026-10-08_fable.html` · owner: "ok wish list" · "1. per item 2. live".
Worktree: `~/Documents/Claude/Projects/wt-wish` (on `rd/wish-list-studio`).
Built-vs-prototype at 375 px: `prototypes/wish-list-built-2026-10-08/` (8 side-by-sides + 8 built frames; the maker lab on fixtures).

## DONE (pushed · both DRAFT · `do-not-auto-merge` · auto-merge off)

| Step | Branch | PR | Head |
|---|---|---|---|
| **E-PR1 · the two tables** | `rd/wish-list-tables` (from `origin/main` `560e6d0f0`) | **#6432** | `7cf5e2e93` |
| **E-PR2 · Studio › Wish list** | `rd/wish-list-studio` (from `origin/rd/studio-reply-by-editable` `83c336a26` + the tables branch) | **#6435** | `40f7d4a21` |

**E-PR1 carries ONE migration: `supabase/migrations/20271266228704_the_wish_list_two_tables.sql`.** The pipeline applies it. Never apply it by hand. E-PR2 adds none.

## TODO
- **E-PR3** · guest list + send sheet (`/[slug]/pabuya`, the Welcome door's line) — not started.
- **E-PR4** · the gift record ("I sent it" → Show the couple) — not started.
- **E-PR5** · Gifts sent to you (the screen, one gift open, the screenshot route) — not started.

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

## Traps for whoever builds E-PR3–5
- **A record's `wish_item_id` is a single-column FK** — nothing ties it to the same event. Every read filters on `event_id` too.
- **Sums:** always `sumSent` / `sentByWish` (removed records never count). A guest page may read only `GIFT_SUM_FIELDS`; ask `wishListShownToGuests` whether to draw the list at all.
- **Got it:** call `gotAfterGifts(wish, sentPhp)` in the action that adds / corrects / moves / removes a record; `'host'` is never touched by a sum. After a host flips OFF an auto-marked wish, the next record marks it again (the design's rule) — say so on the screen or raise it.
- **The honest-words guard** (`app/[slug]/_lib/the-guest-text-is-honest.test.ts`, `GIFT_SURFACES`): add every new gift surface to the list. It reads identifiers too — a state called `confirm` trips it.
- **Data-subject register (E-PR4):** `event_gift_records.giver_name`, the message and the screenshot are a GUEST's personal data. The register's scan does not match `giver_name`; anchor it in the `guest` category in the PR that first writes a record. It changes the privacy register — surface it to the owner.
- **Erasure (E-PR4):** a gift record has no account column, so the erasure detector cannot see it.
- **Event media sweep (E-PR4):** register `event_gift_records.screenshot_r2_key` in `lib/event-media-sweep-core.ts` in the PR that first uploads one (wish photos are already there).
- **Storage:** a replaced or removed wish photo is not deleted until the event is (no displaced-object cleanup yet).
- **`every-maker-edit-shows-before-it-saves`:** every `makerSave` in the Maker must follow a state write in the same handler — draw first, save behind it, put it back on refusal.
- **The dup-rule guard** reads a hand-typed select that reproduces ≥ ~30 % of `WISH_ITEM_SELECT` as a dropped column. Use the constant, or a named `*_FIELDS` projection.
- `formatPhp` (`lib/php.ts`) is the only money formatter.
- DB tests: `event_moderators.permissions_json` is NOT NULL (`'{}'::jsonb`). `tests/db/the-wish-list-writes-keep-their-rules.db.test.ts` has a small supabase-shaped client that runs as the signed-in person with RLS on — reuse it for `recordGift`.
- **After changing `lib/ugat/graph.ts` or any screen's reads, run `pnpm -s ugat:screens`** — CI's one red test on E-PR1's first run was the stale screens map.
- Regenerating `ugat-both-ends.baseline.txt` (`UPDATE_BOTH_ENDS_BASELINE=1`) wipes the dated notes in its header — put them back by hand.
- `node apps/web/scripts/lint-migrations-never-deleted.mjs --write` adds 406 unrelated lines — do not run `--write` in a feature PR.
- The session scratchpad is SHARED by every builder of one controller: keep files in a folder of your own (another builder's `tsc.log` / `dev.log` / `shots/` overwrote or mixed with mine).
