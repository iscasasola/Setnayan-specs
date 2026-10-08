# E-Gifts › Wish list — build status (Builder E1, 2026-10-08)

Contract: `EGIFTS_WISH_LIST_2026-10-08_fable.md` · prototype `prototypes/egifts_wish_list_2026-10-08_fable.html` · owner: "ok wish list" · "1. per item 2. live".
Worktree: `~/Documents/Claude/Projects/wt-wish`.

## Where it stands (written 09:15, machine on battery — WIP pushed so nothing is lost)

| Step | Branch | PR | State |
|---|---|---|---|
| E-PR1 · the two tables | `rd/wish-list-tables` (from `origin/main` `560e6d0f0`) | **#6432** (DRAFT · `do-not-auto-merge` · auto-merge off) | **WIP pushed** at `9edaa1eb7`. Everything is written and its own tests are green; the full `tsc` and the wider DB sweep had not finished when this was written. |
| E-PR2 · Studio › Wish list | `rd/wish-list-studio` (to be cut from `origin/rd/studio-reply-by-editable` `83c336a26` + merge of the tables branch) | — | **NOT STARTED** (frames 01–11 read; code on the base branch read). |
| E-PR3 · guest list + send sheet | — | — | TODO (another builder may take it) |
| E-PR4 · the gift record | — | — | TODO |
| E-PR5 · Gifts sent to you | — | — | TODO |

## E-PR1 — what is in it
- **ONE migration: `supabase/migrations/20271266228704_the_wish_list_two_tables.sql`** (allocated with `pnpm migration:new`). The pipeline applies it. **Never apply it by hand.**
- `event_wish_items` + `event_gift_records` as § 3 of the design. RLS on at CREATE TABLE; one policy each, the exact `event_egift_methods_host_all` predicate; no anon policy.
- `apps/web/lib/wish-list.ts` (+ test, 12): row types, `WISH_ITEM_SELECT` / `GIFT_RECORD_SELECT` (canonical), `GIFT_SUM_FIELDS` / `WISH_GUEST_FIELDS` (purpose projections), `sumSent`, `countSent`, `sentByWish`, `reachedPrice`, `leftToReach`, `meterPercent`, `gotAfterGifts`, `wishesInOrder`.
- `apps/web/tests/db/the-wish-list-is-the-hosts-alone.db.test.ts` (18).
- Ugat joint **J52** (claims for both tables, incl. absences: no order / verified / received / status column).
- Regenerated: `supabase/security/exposure-surface.baseline.txt` (+30 facts, all `authenticated`, anon `-`), `tests/db/user-fk-behaviour.generated.txt` (+1 SET NULL).
- Classified: erasure `AUTHOR_UUID_NULLS` (`event_wish_items.created_by_user_id`), export `DELIBERATE_EXCLUSIONS`, data-subject `NAME_COLUMNS_THAT_ARE_NOT_PEOPLE` (a wish's `name` is a thing).

## Type letters used
**All 26 single letters are already passed to `generate_public_id` by some table** (measured: `Y` by four tables, `C` by six), so no letter is free; the letter is a reading aid, never a key.
- `event_wish_items` → **`H`** (as designed; shared only with `chat_threads`).
- `event_gift_records` → **`Y`** (the E-Gifts letter, shared with `event_egift_methods`). The design said `G`, which is `guests` — a record sits beside its giver's guest id.
- Two-letter codes were not used: `lib/csp-report.ts` normalises only `S89[A-Z]-…`.
- Registry: `02_Specifications/Account_ID_Format.md` lists 4 letters and is long stale — a dated note is still TO ADD.

## Deviations (each with a recommendation)
1. **Grants are narrower than `event_egift_methods`.** That table still carries the stock `anon` + `authenticated` SIUD. The new tables give `anon` nothing; `authenticated` gets SIUD on wishes and **SELECT + UPDATE only** on gift records (the server inserts a guest's record; Remove is soft). Recommend keeping it: narrowing is free under the exposure freeze. E-PR4 must insert with the admin client (as designed); E-PR5's remove/restore is an UPDATE of `removed_at`.
2. **`ugat-both-ends` baseline 43 → 45.** That required guard refuses a table with no writer, and the approved plan lands the tables a PR ahead of their writers. Two rows were added, each naming its payer: `event_wish_items` → E-PR2 (take the row out there, 45 → 44); `event_gift_records` → E-PR4 (44 → 43). Recommend accepting; the alternative is one PR carrying tables + Studio + the guest record.
3. `method_kind` on a record is length-capped (≤ 20), not tied to the five kinds — a second CHECK would refuse a guest's record the day a new kind is added to the ways to give.
4. `got_at` and `got_by` are held together by a CHECK (both set or neither).

## Traps for whoever builds E-PR3–5
- **A record's `wish_item_id` is a single-column FK** — nothing ties it to the same event. Every read filters on `event_id` too.
- **Sums:** always through `sumSent` / `sentByWish` (removed records never count). A guest page may read only `GIFT_SUM_FIELDS`.
- **Got it:** `gotAfterGifts(wish, sentPhp)` is the automatic half — call it in the action that adds / corrects / moves / removes a record. `'host'` is never touched by a sum. After a host flips OFF an auto-marked wish, the next record will mark it again (the design's rule) — say so on the screen or raise it.
- **Data-subject register (E-PR4):** `event_gift_records.giver_name`, the message and the screenshot are a GUEST's personal data. The register's scan does not match `giver_name`; anchor it in the `guest` category in the PR that first writes a record. It changes the privacy register — surface it to the owner.
- **Erasure (E-PR4):** a gift record has no account column, so the erasure detector cannot see it. Decide what an erased guest-with-an-account leaves on the couple's list.
- `formatPhp` (`lib/php.ts`) is the only money formatter — a second one fails `money-formatter-scan`.
- DB-test fixture: `event_moderators.permissions_json` is NOT NULL — pass `'{}'::jsonb`.
- Regenerating `ugat-both-ends.baseline.txt` (`UPDATE_BOTH_ENDS_BASELINE=1`) wipes the dated notes in its header — put them back by hand.
- `node apps/web/scripts/lint-migrations-never-deleted.mjs --write` adds 406 unrelated lines (the manifest on main is 1169 of 1575) — do not run `--write` in a feature PR.

## Checks so far (E-PR1)
- wish-list DB test 18/18 · lib test 12/12 · the ten schema-wide DB guards (exposure-freeze, ugat ×3, erasure-completeness, user-delete-fk-surface, user-fk-behaviour, gates/handles, schema-drift) 84/84 after the baseline rows · 74 unit files that read migrations / exposure / Ugat / erasure 845/845 · erasure + export + data-subject 82/82 · `lint-exposure-baseline`, `check-migration-timestamps` (1575 unique), `lint-migrations-dir`, `lint-migrations-never-deleted`, `lint:dup-rule` green.
- Sabotages seen red: policy USING → true (7 red) · anon granted SELECT (1) · INSERT/DELETE on records granted (2) · bare `REFERENCES auth.users` (1) · `counts()` ignoring `removed_at` (1) · `reachedPrice` true with no price (2) · `gotAfterGifts` without the host guard (1).
- **Still to run:** full `tsc --noEmit` (heavy lock), `pnpm -s lint`, the wider DB sweep (≈ 150 files, in progress).
