# Song desk — BUILD ORDER (owner said "fix all", 2026-07-27)

> # 🏁 2026-07-30 — THIS BUILD ORDER IS COMPLETE. Every PR is shipped.
>
> | PR | What | Shipped |
> |---|---|---|
> | 1 | requests window is a paid switch (column privilege) | [#3876](https://github.com/iscasasola/setnayan-platform/pull/3876) |
> | 2 | band reads the host's playlist | [#3885](https://github.com/iscasasola/setnayan-platform/pull/3885) |
> | 1b | requests always-on + paywall moves to the inbox | [#3891](https://github.com/iscasasola/setnayan-platform/pull/3891) |
> | 1c | read audience — crew + day-of grantees; `anon` revoked | [#3893](https://github.com/iscasasola/setnayan-platform/pull/3893) |
> | — | the requests INBOX UI + the mount-vs-read vocabulary fix | [#3896](https://github.com/iscasasola/setnayan-platform/pull/3896) |
> | 6+4 | eleven moments + six frozen vibes | [#3899](https://github.com/iscasasola/setnayan-platform/pull/3899) |
> | 3 | onboarding feeds the studio (Unsorted tray) + resolved `song_id` | [#3903](https://github.com/iscasasola/setnayan-platform/pull/3903) |
> | 5 | sets (1–6, anchored to the host's vocabulary) | [#3908](https://github.com/iscasasola/setnayan-platform/pull/3908) |
> | 7 | guest-facing request button + guest song search | owner-DEPRIORITISED, still not built |
>
> **⏭ WHAT IS LEFT IS NOT CODE.** Three owner decisions and one visual check:
> 1. **The playlist read is now open to ANY booked vendor**, not only music acts (#3896).
>    Reversible; the honest narrow route is a `category_key` gate once that column is populated.
> 2. **Should the HOST see a band's finished setlist?** PR 5 scoped sets to the vendor org
>    deliberately (a set is a working document) — widening it is a product call.
> 3. **PR 7** stays deprioritised until sets prove useful.
> 4. **Nobody has LOOKED at any of it.** A prod test fixture exists (see `DECISION_LOG.md`
>    2026-07-30 🧪 row) — vendor `testnayan2`, event `0ccc7aa3-3a81-43ee-b170-afb194e0b259`,
>    booked TODAY. ⚠ The console only opens on `booked_date`; bump that one row to reopen it.
>
> ⚠⚠ **THE APPLY PIPELINE SKIPPED ALL FOUR MIGRATIONS TODAY.** Every one needed
> `gh workflow run supabase-migrations.yml --ref main`, and `deploy-prod`'s apply job
> **reports success while applying nothing** (`VERCEL_DEPLOY_HOOK_URL` unset ⇒ dormant gate).
> Never read "merged" as "live" here — verify the OBJECT.
>
> ## ✅ 2026-07-30 — ALL SIX OWNER GATES ARE ANSWERED. Nothing here is blocked.
>
> The owner tapped all six in one sitting. Recorded in `DECISION_LOG.md` 2026-07-30 (🎼 row) and
> folded into each PR below — **read the PR, not this summary**, then build.
>
> | # | Question | Answer |
> |---|---|---|
> | PR 6 | missing moments | **add all three** — `prelude` · `grand_entrance` · `recessional` (11 slots) |
> | PR 4 | the six vibe names | **frozen as drawn** — Acoustic · Classical · Jazz · OPM · Pop · Showband |
> | PR 3 | double-picking | **onboarding feeds the studio** as an "Unsorted" tray; matcher reads BOTH |
> | PR 5 | accepted request → a set? | **no** — Accept means "we'll play it" |
> | PR 5 | the requests window | **always on** ⚠ reverses the 2026-07-27 open/close lock |
> | new | so where is the paywall? | **seeing the requests** is the paid part — plus a band-controlled PAUSE |
>
> ⚠ **The last two created a required PR that did not exist this morning — [PR 1b](#pr-1b--always-on-requests--the-paid-gate-moves-to-the-inbox).
> It must land BEFORE any requests UI and before the always-on flip.** Build order is now
> **2 ✅ → 1b → (6+4) → 3 → 5**.
>
> **Progress (all 2026-07-30): PR 1 ✅ #3876 · PR 2 ✅ #3885 · PR 1b ✅ #3891 · PR 1c ✅ #3893 ·
> the REQUESTS INBOX UI ✅ #3896** (owner: "fix the song desk" + "create the UI"), which also closed
> the **third** mount-vs-read defect: the playlist read gated on legacy `vendor_category` enum values
> while the desk mounts on canonical `MUSIC_CANONICALS` tiles, and nothing maps to `orchestra` or
> `wedding_singer` — so a booked orchestra mounted the desk and read zero. The list was **dropped**,
> not extended (a taxonomy in SQL drifts; this policy proved it). ⚠⚠ **That WIDENED the playlist read
> to ANY booked vendor** — owner-reversible; the honest narrow route is a `category_key` gate once
> that column is populated, never another hand-kept enum list.
>
> ⛔ **THE DESK IS STILL UNREACHABLE IN PROD — data, not code.** The only vendor profile is
> `SetnaProd` (`services:['pabati']`, free tier, unverified, **0 marketplace-linked bookings**). The
> desk needs a **music-tile vendor on Solo-or-up with a MARKETPLACE-LINKED booking dated TODAY**. Any
> "look at it on a phone" step needs that seeded first.
>
> ⚠ **OPEN, deliberately unfixed:** `vendor_services.category` is consumed as a **legacy enum** value
> in `unlock-category.ts` but as a **canonical key** in `inquiry-actions.ts`, where the same value is
> written into the **enum** column inside a `catch {}` that would swallow the violation. One column,
> two contradictory assumptions. `vendor_services` has **0 rows in prod**, so fixing it would be
> fixing a guess — needs one real vendor service row to settle.
> **Every security/gap item in this stream is CLOSED. Everything left is ungated feature work:**
> **(6+4) → 3 → 5.**
>
> ⚠ **Standing correction for every policy edit in this stream:** the exposure freeze fails on ANY
> policy-predicate change, narrowing included. Regenerate the baseline in the same PR and read the
> diff. The old "removals never fail that guard" line was wrong.
>
> **This file is the contract.** Execute top to bottom. Every item below was verified against
> live prod or shipped code on 2026-07-27 — the "already exists" claims are checked, not assumed.
> Full reasoning: the song-desk rows in `DECISION_LOG.md` — find them with `grep -in "song desk\|song request\|playlist-slot\|song-pick system\|set composition" DECISION_LOG.md` (15 rows, 2026-07-27).
>
> 🛑 **RULE 0 still applies to every item.** Twice today a thing the owner asked for turned out
> to already ship (the song matcher; the music-vendor read policy). Grep before you build.

## What already ships — do NOT rebuild

| Thing | Where | State |
|---|---|---|
| Song desk (repertoire × couple's requests) | `.../live/[eventId]/_components/song-desk/` | live, PR #3803 |
| Guest song requests, both lanes + caps + block lever | `event_song_requests`, 2 RPCs | live, PR #3813 |
| The act's open/close window | `vendor_dayof_configs.song_requests_open` | live, default FALSE |
| Host playlist UI, per moment + "don't play these" | `/dashboard/[eventId]/studio/playlist/` | live, 0 rows in prod |
| **Music-vendor read on the host's playlist** | `event_playlist_picks_music_vendor_read` | **already exists — no new policy needed** |
| Song matching → the "% match" on vendor cards | `songOverlapRatio`, `category-search.ts:915` | live |
| Master song catalogue + dedup | `songs.normalized_key`, 391 seeded | live |

---

## PR 1 · ✅ DONE 2026-07-30 — SECURITY, gate the requests toggle server-side

> **SHIPPED as PR [#3876](https://github.com/iscasasola/setnayan-platform/pull/3876)** (branch
> `claude/song-desk-pr1-requests-gate`, migration `20271020159662`). **Do not rebuild.**
> `authenticated` now holds **no INSERT/UPDATE column privilege** on `song_requests_open`
> (table-level INSERT/UPDATE revoked, computed all-minus-one allow-list granted back — the
> `20271005100000` events pattern, with catalog post-conditions). SELECT is untouched. The only
> write path is **`setSongRequestsOpen`** in `app/vendor-dashboard/on-the-day/actions.ts`:
> auth → booking → `holdsSpecialization(access, 'song_desk')` → service_role write.
> 5 new DB tests in §7 of `tests/db/song-requests.db.test.ts`.
>
> **⚠ TRAP for anyone touching this table next.** A fresh `vendor_dayof_configs` row defaults
> `enabled_modules` to `'[]'`, and `resolveModules` treats a PRESENT override as authoritative —
> so an empty array means **every day-of module OFF**. A naive upsert of any new column would
> silently darken the vendor's whole console. `setSongRequestsOpen` therefore UPDATEs when the
> row exists and seeds the vendor's current defaults when it does not. Copy that shape.
>
> **Scope boundary (deliberate):** owner path only — a crew member on a day-of access grant
> cannot flip the window. Extending it to grantees is a product call for the UI PR.
>
> ⏭ **Next is PR 2** (band sees the host's playlist) — still AUTO-OK, still no owner answer needed.

**The defect (as found).** `song_requests_open` lives on `vendor_dayof_configs`, whose RLS asks only
"is this your row" (`vendor_dayof_configs_vendor_update` → `current_vendor_profile_ids()`).
It never checks the specialization entitlement. **A free-tier band can flip it via the API and
collect requests they have not paid for.**

Verified: `resolveVendorSpecializationAccess` is imported ONLY by
`vendor-dayof-frame.ts` / `specialization-slot.tsx` / `live/[eventId]/page.tsx` — the RENDER
path. No write path checks it.

**Fix.** Check the entitlement in the write action (`on-the-day/actions.ts`) AND prefer an RLS
predicate so the API path is closed too, not just the UI. This is the frame's own warning:
*"the frame guarantees your component is only MOUNTED for an entitled vendor — it does not
authorise your queries."*

**Test:** a free-tier music vendor cannot set `song_requests_open = true` by any path.
Harm today is nil (no UI, flag off) — which is exactly why it must land BEFORE the UI.

---

## PR 1c · ✅ DONE 2026-07-30 — the READ AUDIENCE fixed (crew + grantees read zero)

> **SHIPPED as PR [#3893](https://github.com/iscasasola/setnayan-platform/pull/3893)** (branch
> `claude/song-desk-pr1c-read-audience`, migration `20271020710612`). **Do not rebuild.**
> All three fixed + the swallowed-error amplifier. 11 new DB tests in
> `tests/db/song-desk-read-audience.db.test.ts`; remove the migration and **6 of 11 fail**.
> Baseline 6217 → 6215 (`anon` loses both tables; two predicates widened, in the diff).
>
> **How ② was fixed, and how it was NOT:** in **SQL**, via a grantee leg on both policies —
> **not** by passing the page's admin client through `SpecializationSurfaceProps`. A service_role
> client in props is inherited by every future specialization surface, which makes the registry's
> "scope every read yourself" warning the only thing between a careless query and the whole table.
> ⚠ For the playlist the leg is an explicit `EXISTS` against `vendor_event_access_grants`, NOT
> `current_vendor_dayof_grant_event_ids()` — that helper returns event_ids and **drops the vendor
> binding**, which would let the florist's crew read the band's playlist.
> ⚠ `current_vendor_booked_event_ids()` was **not** widened (one line, but it is shared by
> `event_schedule_blocks` and others — blast radius). A test is the tripwire on that.
> ⚠ `fetchPlaylistPicks` now returns `{ rows, failed }` so a denied read stops rendering as a claim
> about the couple. One function, two call sites — no twin helper.
>
> **Found by the 2026-07-30 gap + security audit, after PR 2 shipped. All three items
> below were LATENT, not live** — verified against prod the same day: the only two booked
> music rows are host-manual (`marketplace_vendor_id IS NULL`), there were 0 live day-of
> grants, 0 requests, 0 playlist picks and 0 `vendor_dayof_configs` rows, so **no vendor could
> reach the desk in prod yet.** Pre-launch was exactly the moment to close them.

**① A vendor TEAM MEMBER cannot read the host's playlist.** `event_playlist_picks_music_vendor_read`
(`20260622000000`) hand-rolls its own audience:

```sql
JOIN public.vendor_profiles vp ON vp.vendor_profile_id = ev.marketplace_vendor_id
WHERE vp.user_id = auth.uid()          -- ← owner ONLY
```

while `current_vendor_booked_event_ids()` — the **one** definition of booked, used by
`event_song_picks` and `event_song_requests` — includes `vendor_team_members`. So a crew
member gets the flat requests but **zero playlist rows**, and PR 2's desk tells them
*"they haven't set out the night moment by moment yet."* **That is a false statement, not an
empty state.** Fix: align the audience with the shared helper. ⚠ Keep the category gate —
`band_dj` / `host_emcee` / `choir` / `string_quartet` are the **legacy `vendor_category` enum**,
which is the correct vocabulary for `event_vendors.category` and does match real bookings
(checked in prod). Do **not** "fix" it to `MUSIC_CANONICALS` keys — those belong to
`vendor_profiles.services[]` and to the dual-written `category_key` column that **nothing reads
yet**.

**② A day-of GRANTEE reads zero from BOTH song tables — the whole desk lies to crew.**
`live/[eventId]/page.tsx` resolves a grantee's vendor profile through the **admin client**
("the grant is the authorization"), but `SongDesk` reads with `createClient()` under the
grantee's own RLS. A grantee is neither `vp.user_id = auth.uid()` nor a `vendor_team_members`
row, and `current_vendor_booked_event_ids()` does not include grantees either — so **the song
desk has rendered "they haven't picked any songs yet" for every grantee since PR #3803**, and
PR 2 extended the same falsehood to the playlist. ⚠ Do **NOT** fix this by widening
`current_vendor_booked_event_ids()` — that helper is shared by schedule blocks, song picks and
requests, so widening it is a blast-radius decision, not a bug fix. Fix: `SpecializationSurfaceProps`
is documented **additive-only**, so pass the client the page already authorised (or an explicit
`isGrantee`) and read with it.

**③ `event_playlist_picks` and `event_song_picks` still ship OPEN.** Neither migration ever
emitted the `REVOKE ALL` every relation in `public` needs — the baseline shows
`tpriv public.event_playlist_picks|anon SIUD` and `event_song_picks|anon SIUD`, with every column
at `anon=SIU`. Not exploitable today (all policies are `TO authenticated`, so anon holds the grant
but no policy admits a row) — it is the shape that becomes a hole the day someone adds a
permissive policy, exactly as `vendor_dayof_configs` was before #3813. Fix: `REVOKE ALL … FROM
PUBLIC, anon, authenticated` then grant back only what the surfaces use.

**Also worth knowing (a swallowed error is what turns ① and ② into lies):** `fetchPlaylistPicks`
returns `[]` on RLS denial, by design, so a denied read is indistinguishable from an empty
playlist at the call site. That is why both defects render as confident false statements rather
than as errors. Any surface that asserts *"they haven't done X"* from an empty read needs the read
to be provably authorised — or needs to say less.

---

## PR 1b · ✅ DONE 2026-07-30 — Always-on requests + the paid gate moves to the inbox

> **SHIPPED as PR [#3891](https://github.com/iscasasola/setnayan-platform/pull/3891)** (branch
> `claude/song-desk-pr1b-requests-alwayson`, migration `20271020224218`). Both halves in one PR,
> because always-on removes the accidental safety that made the ungated read harmless.
>
> - **Always-on is not a DEFAULT flip.** `vendor_dayof_configs` is sparse, so most bookings have
>   no row for a default to apply to; `song_requests_open_for_event()` was inverted to *open unless
>   something says paused*. No backfill — 0 rows in prod, checked live.
> - **The paid gate moved.** Both request policies lost the `current_vendor_booked_event_ids()` leg
>   (host + admin remain); the act reads through `fetchActSongRequests` / `decideActSongRequest`,
>   entitlement-checked, service_role. **One path, no second door.**
> - **PR 1's column gate survives and still matters** — the pause is a paid control. Asserted by test.
> - **The two-act rule, decided:** a pause from ANY act pauses the room (over-pausing beats flooding
>   a band that asked for silence). A per-act pause needs the inbox split per-act first.
> - **The gate is one function now** (`requireSongDeskAct`) — three copies of a paywall is three
>   chances for one to drift open.
>
> **⚠ CORRECTION TO CARRY FORWARD — the exposure freeze does NOT pass on narrowings.** This file
> and the migration's first draft both said removals never fail that guard. Wrong: it fingerprints
> **policy predicates** and refuses to mechanically classify any predicate change as a narrowing, so
> dropping a leg from a `USING` clause fails it until a human reads the diff and regenerates the
> baseline **in the same PR**. Budget for that on every policy edit.
>
> Tests: §8, 10 new (33 in file · 627 db · 5428 unit, green). **Load-bearing, verified:** delete the
> migration and 6 fail. Two existing tests were rewritten because this reverses their premise.

> **Created by the owner's 2026-07-30 answers. Did not exist on 2026-07-27.**
> **Land this BEFORE any requests UI and before the always-on flip. One PR, both halves —
> shipping either alone opens a hole or breaks the promise.**

**Half 1 — always on.** `song_requests_open` flips `DEFAULT FALSE` → `DEFAULT TRUE` and its
meaning **inverts to "not paused"**. Guests may always ask; the band never has to open anything.
The column is NOT dropped — the owner kept a **pause** (for the night or a stretch), because real
bands get flooded and the only alternative is ignoring the screen. That keeps PR 1's
column-privilege withdrawal load-bearing rather than wasted: the pause is still a paid control, so
`setSongRequestsOpen` stays the sole write path, entitlement check unchanged.
⚠ Rename the *concept* in UI copy ("Pause requests"), not the column — a rename is a migration
across every reader for no user-visible gain. Say so in the migration comment so the next session
doesn't "fix" the name.

**Half 2 — the read becomes the paywall.** `event_song_requests_read` today gates on **booked**,
not on **specialization**:

```sql
USING ( event_id IN (SELECT public.current_vendor_booked_event_ids())
        OR event_id IN (SELECT public.current_event_ids())
        OR public.is_admin() )
```

That is **the same class of hole PR 1 just closed, one table over.** It is inert *today* only
because the window defaults FALSE so no request can exist. **Flip the default without re-gating
this read and every free-tier booked band gets a full inbox — the thing we just decided to sell.**

The host (`current_event_ids()`) and `is_admin()` legs stay. The vendor leg must additionally
require the `song_desk` specialization. ⚠ **Entitlement lives in TypeScript on purpose** (PR 1's
finding: `resolveVendorSpecializationAccessForVendor` folds in the admin free-window promotion and
the mid-event lapse; a SQL copy would drift) — so prefer the PR 1 shape: keep RLS as the coarse
booked-or-host fence, and make the inbox reader a **service-role action that checks
`holdsSpecialization(access, 'song_desk')`**, with the vendor's direct SELECT narrowed or removed.
Decide it explicitly and write down which you chose; do not leave both paths open.

**Tests:** a free-tier booked music vendor reads **zero** rows by any path · a `song_desk` holder
reads all of them · the host still reads their own room · a lapsed specialization mid-event loses
the inbox. Append to `tests/db/song-requests.db.test.ts` (§7 exists from PR 1).

🚨 **Any change to a read policy trips THE FREEZE** — regenerate
`supabase/security/exposure-surface.baseline.txt` in the same PR and read your own diff.

---

## PR 2 · ✅ DONE 2026-07-30 — Band sees the host's playlist

> **SHIPPED as PR [#3885](https://github.com/iscasasola/setnayan-platform/pull/3885)** (branch
> `claude/song-desk-pr2-host-playlist`). **Pure read — no migration, no new policy**, exactly as
> scoped: `event_playlist_picks_music_vendor_read` (`20260622000000`) was confirmed present before
> a line was written. `buildHostPlaylist()` in `lib/song-desk.ts` + the render in
> `song-desk/song-desk.tsx`; 19 new tests (33 in file, 5403 suite, green).
>
> **What it renders:** the night in wedding-day order with **empty moments dropped** (the couple's
> studio shows all slots because it is an authoring surface; a band on a venue floor does not need
> eight headings to learn six are blank) · each song carrying **the couple's note** · a flag on what
> they don't play · and **"Don't play these" crossed the OTHER way up** — the hazard there is a
> banned song the act DOES play.
>
> **The join is fuzzy and that is the substance.** `event_playlist_picks` is free text
> (`song_label` + nullable `artist`) that never resolved to a `songs` row. Rule: normalised title,
> artists must agree when both sides name one, **blank on either side lets the title decide**, and
> the matched artist is displayed so a wrong "Perfect" is spottable. Buckets sorted by artist so a
> same-title ambiguity resolves identically every render.
>
> **⚠⚠ THE TRAP THIS FOUND, AND PR 6 MUST NOT WALK INTO IT.** `groupPicksBySlot` indexes a
> **hardcoded Record literal** of all 8 slots. A row whose `slot_type` is outside that Record hits
> `out[row.slot_type].push(row)` on `undefined` → **TypeError**. So adding `prelude` /
> `grand_entrance` / `recessional` to the enum + the DB CHECK **without** adding them to that Record
> crashes BOTH the couple's playlist studio and the band's desk the first time a couple uses a new
> moment. `buildHostPlaylist` defends itself (unknown slots are dropped by `isPick`) — the couple's
> studio does NOT. **This is the concrete meaning of PR 6's "verify every downstream reader".**
>
> **Two edges left visible on purpose:** a song chosen in BOTH places renders twice (PR 3 owns the
> merge rule; papering over it now would pre-empt the owner's answered design), and the playlist read
> is scoped by `eventId` only because that table has no vendor column and its policy keys on
> `auth.uid()` rather than the handed-in `vendorProfileId` — documented at the call site.
>
> ⏭ **Next is [PR 1b](#pr-1b--always-on-requests--the-paid-gate-moves-to-the-inbox).**

**As originally scoped (kept for lineage):** the smallest possible answer to the owner's *"make this
helpful for the host and the band first."* Pure read; reuse `PLAYLIST_SLOT_TYPES` /
`PLAYLIST_SLOT_LABELS` / `groupPicksBySlot` from `lib/playlist.ts` — do not restate the slot list.
⚠ Scope reads to the handed-in `eventId` + `vendorProfileId`; the frame mounting you is not
authorisation.

---

## PR 3 · 🟢 Join the two song-pick systems — ANSWERED 2026-07-30

**A couple can pick songs in two places that do not talk.** `event_song_picks` (flat,
onboarding, feeds the match score) vs `event_playlist_picks` (per-moment, playlist studio).
Consequence: pick songs at onboarding → open the playlist studio → **it is empty** → pick again.
And songs assigned to `first_dance` never improve the vendor match.

**✅ OWNER CHOSE (2026-07-30): onboarding feeds the studio.** Pre-fill one way — onboarding picks
appear in the studio as an **"Unsorted" tray** the couple drags into moments — and the matcher
reads **BOTH** tables, so a song assigned to `first_dance` finally counts toward the "% match".
⚠ Do NOT merge the tables — different shapes (flat vs slotted), different RLS audiences.

Direction is one-way: **onboarding → studio.** Nothing writes back to `event_song_picks` from the
studio, so the matcher's existing source keeps its shape and the tray can never fight the picker.
⚠ The tray is a **view over unslotted picks, not a 9th slot** — do not add an `unsorted` value to
`PlaylistSlotType`, or every downstream reader inherits a pseudo-moment that isn't part of the day.

---

## PR 4 · Vibes — pick songs **or** set a vibe per slot — ANSWERED 2026-07-30

⚠ **The artwork ships; the concept does not.** Six tiles exist only as images
(`public/onboarding/prefs/music_{acoustic,classical,jazz,opm,pop,showband}.webp`). A grep across
`lib` + `app` returns **no enum, no column, no reader**.

Model as a **nullable vibe alongside the existing picks, not two competing tables** — a slot must
be able to carry both ("jazz for dinner, but you must play Through the Years" is normal).

**✅ THE SIX NAMES ARE FROZEN (owner, 2026-07-30) — exactly as the artwork already reads:**

| value | label | asset that already ships |
|---|---|---|
| `acoustic` | Acoustic | `public/onboarding/prefs/music_acoustic.webp` |
| `classical` | Classical | `music_classical.webp` |
| `jazz` | Jazz | `music_jazz.webp` |
| `opm` | OPM | `music_opm.webp` |
| `pop` | Pop | `music_pop.webp` |
| `showband` | Showband | `music_showband.webp` |

Owner declined both alternatives offered: **no seventh "Band's call" option** (absence of a vibe
already means that — keep it NULL, don't spend an enum value on it) and **"Showband" keeps its
name** (not "Party band"). Six values, no more — a later addition is a migration, so anything that
looks like a seventh is a question, not a commit.

---

## PR 5 · Sets — ANSWERED 2026-07-30 (both gates)

`vendor_event_sets` (event × vendor × position 1–6 × name) + a join carrying (set, song,
position). Songs are **placed manually by the band** from their repertoire — no auto-fill, no
recommender (owner: *"they can place songs per set. they can choose."*).

🚨 **Sets MUST key to the existing `PlaylistSlotType` values — never a second vocabulary.**
If the band's sets say "After Party" while the host's picks say `open_floor`, the two lists can
never be compared, which destroys the entire point. **As of PR 6 that vocabulary is 11 values** —
key to the extended enum, and take `grand_entrance` seriously: a PH band's Set 1 usually *is* the
entrance.

**✅ BOTH ANSWERS IN (owner, 2026-07-30):**

1. **Requests are ALWAYS ON.** Not a mode, not a picker — no "Anytime / Chosen sets / Off". The
   owner picked always-on over the prototype's three-mode recommendation. ⚠ This **reverses the
   2026-07-27 "the band will open or close accepting requests" lock**, and it retires the setup
   step — but **not** the control: the band keeps a **pause** (for the night or a stretch). The
   default flips and the paid gate moves to the inbox → **that is [PR 1b](#pr-1b--always-on-requests--the-paid-gate-moves-to-the-inbox),
   which must land first.** There is no "chosen sets" mode to build, so **`vendor_event_sets` no
   longer needs any request-window relationship at all** — sets are purely the band's setlist.
2. **An accepted request does NOT land in a set.** Accept means "we'll play it", full stop, into
   one list the band works from. A request arrives mid-song; making a musician answer "which set?"
   in that moment is a decision they don't need. ⚠ So do **not** build a set-picker into the accept
   flow, and do not auto-file into the set that happens to be playing (a request accepted during
   Set 2 is usually meant for later — it would file things wrong). The prototype's
   "from a request" chips are a **display** affordance on the accepted list, not membership in a set.

---

## PR 6 · Extend the slot list — ANSWERED 2026-07-30 (all three, confirmed)

Owner named *Entrance · Bridal Walk · Post Ceremony · Cocktail Hour · Dinner · After Party*,
plus *first dance and other parts*. Mapped against the shipped enum:

| Owner | Existing slot |
|---|---|
| Bridal Walk | `processional` |
| Cocktail Hour | `cocktail_hour` ✅ |
| Dinner | `dinner` ✅ |
| After Party | `open_floor` ✅ |
| First dance | `first_dance` ✅ |
| — | `parents_dance` (exists, unnamed by owner) |
| **Entrance** | **missing** |
| **Post Ceremony** | **missing / partial** |

**✅ OWNER CONFIRMED ALL THREE (2026-07-30)** — the full proposal, no trims:

| new value | label | where it sits in the day |
|---|---|---|
| `prelude` | Guest arrival | **first** — before `processional` |
| `grand_entrance` | Grand entrance | couple into the reception — after `recessional`, before `cocktail_hour` |
| `recessional` | Recessional | the walk out — straight after `ceremony` |

**11 slots. Chronological order is the contract** (`PLAYLIST_SLOT_TYPES` renders the day in order,
`banned_songs` stays last):
`prelude · processional · ceremony · recessional · grand_entrance · cocktail_hour · first_dance ·
parents_dance · dinner · open_floor · banned_songs`.

**Extend the enum, never fork it.** Every one of these needs handling in the same PR (they all live
in `lib/playlist.ts` except the last): `PlaylistSlotType` union · `PLAYLIST_SLOT_TYPES` ·
`PLAYLIST_SLOT_LABELS` · `PLAYLIST_SLOT_HINTS` (write real per-moment helper copy in the shipped
editorial voice — no engineering jargon) · `groupPicksBySlot` · any DB `CHECK` constraint on
`event_playlist_picks.slot_type`.

🚨 **THE ONE THAT BITES — found while building PR 2, verified in the shipped code.**
`groupPicksBySlot` builds a **hardcoded Record literal of all 8 slots** and then does
`out[row.slot_type].push(row)`. A row carrying a slot the Record does not name dereferences
`undefined` → **TypeError, not a missing section.** Add the three values to the enum and the DB CHECK
but forget that Record, and **the couple's playlist studio crashes the first time anyone picks a song
for the grand entrance** — the band's desk survives only because `buildHostPlaylist` filters unknown
slots itself. The `Record<PlaylistSlotType, …>` types (`LABELS`, `HINTS`, and the literal inside
`groupPicksBySlot`) DO fail to compile when the union grows, which is the good case — but only if the
union is extended in the same commit rather than the DB alone. **Extend the union FIRST and let tsc
walk you to every site.**

⚠ **The full reader list, as of 2026-07-30** (`git grep -n "PLAYLIST_SLOT\|groupPicksBySlot\|slot_type" origin/main`):
`app/dashboard/[eventId]/studio/playlist/page.tsx` (renders all slots + hints) ·
`app/dashboard/[eventId]/studio/playlist/actions.ts` (`VALID_SLOTS` — the write validator) ·
`lib/song-desk.ts` (`buildHostPlaylist`, PR 2). Three files, one of which is a write gate.

⚠ PR 4 (vibes) touches the same file — **land 6 and 4 together in one PR** as the register's order
says, or the second one rebases onto a conflict.

---

## PR 7 · Guest-facing pieces (owner-deprioritised)

The request button on `/[slug]`, and a guest-facing "who plays this song?" search.
⚠ The matcher itself already exists and is live — the only gap is that it is COUPLE-facing
(driven by `event_song_picks` inside the couple's vendor search). **Do not rebuild it.**

---

## Standing constraints

- **Prod is pre-launch-empty** — 1 vendor profile, 2 events, 0 playlist rows. Tests can prove
  correctness; nothing here can be exercised against real data yet. Never let a green suite read
  as "proven in the field."
- **Any new RLS read policy trips THE FREEZE.** Regenerate
  `supabase/security/exposure-surface.baseline.txt` **in the same PR** and read your own diff —
  `pnpm --filter @setnayan/web exposure:baseline`. It surfaces inside the `typecheck + lint`
  check, which does not sound like a security guard.
- **Every new table in `public` ships OPEN.** Emit `REVOKE ALL … FROM PUBLIC, anon, authenticated`
  before any GRANT.
- **Pricing: one decision, otherwise untouched.** Owner 2026-07-30: **seeing the guest requests is
  the paid part** — that re-sites the existing `song_desk` paywall (it used to be "may you open the
  window"), it does **not** widen what we bill. Everything else stays "free for now, decide later."
  Sets living inside the song desk makes them Solo-tier-and-up **by construction**; keep flagging
  that as a pricing consequence rather than letting it land silently.
