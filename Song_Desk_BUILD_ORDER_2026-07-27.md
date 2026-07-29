# Song desk — BUILD ORDER (owner said "fix all", 2026-07-27)

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

## PR 1 · 🔴 SECURITY — gate the requests toggle server-side

**The defect.** `song_requests_open` lives on `vendor_dayof_configs`, whose RLS asks only
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

## PR 2 · 🟢 Band sees the host's playlist  ← *the next real feature*

The smallest possible answer to the owner's *"make this helpful for the host and the band first."*
**Pure read. No migration. No new policy** (the music-vendor read already exists).

Inside the song desk, render per moment: what the host asked for, and `banned_songs`
("Don't play these"). Reuse `PLAYLIST_SLOT_TYPES` / `PLAYLIST_SLOT_LABELS` /
`groupPicksBySlot` from `lib/playlist.ts` — do not restate the slot list.

⚠ Scope reads to the handed-in `eventId` + `vendorProfileId`; the frame mounting you is not
authorisation.

---

## PR 3 · 🟡 Join the two song-pick systems

**A couple can pick songs in two places that do not talk.** `event_song_picks` (flat,
onboarding, feeds the match score) vs `event_playlist_picks` (per-moment, playlist studio).
Consequence: pick songs at onboarding → open the playlist studio → **it is empty** → pick again.
And songs assigned to `first_dance` never improve the vendor match.

**Recommended:** pre-fill one way (onboarding → an "unsorted" tray in the studio) and let the
matcher read BOTH. ⚠ Do NOT merge the tables — different shapes (flat vs slotted), different
RLS audiences.

⏭ Owner sign-off needed on the pre-fill direction before building.

---

## PR 4 · Vibes — pick songs **or** set a vibe per slot

⚠ **The artwork ships; the concept does not.** Six tiles exist only as images
(`public/onboarding/prefs/music_{acoustic,classical,jazz,opm,pop,showband}.webp`). A grep across
`lib` + `app` returns **no enum, no column, no reader**.

Model as a **nullable vibe alongside the existing picks, not two competing tables** — a slot must
be able to carry both ("jazz for dinner, but you must play Through the Years" is normal).

⏭ **Owner must confirm the six names before they are frozen into an enum** (changing them later
is a migration).

---

## PR 5 · Sets

`vendor_event_sets` (event × vendor × position 1–6 × name) + a join carrying (set, song,
position). Songs are **placed manually by the band** from their repertoire — no auto-fill, no
recommender (owner: *"they can place songs per set. they can choose."*).

🚨 **Sets MUST key to the existing `PlaylistSlotType` values — never a second vocabulary.**
If the band's sets say "After Party" while the host's picks say `open_floor`, the two lists can
never be compared, which destroys the entire point.

⏭ **Blocked on two owner answers** (both tappable in
`06_Prototypes/Song_Desk_Sets_2026-07-27.html`):
1. "Allow requests **(anytime)**" — a MODE beside "only during the sets I choose", or always-on?
   (Always-on would retire the open/close control the owner locked earlier — do not assume it.)
2. Does an ACCEPTED request land in a set the band picks, or just get accepted?

---

## PR 6 · Extend the slot list

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

Proposed additions: `prelude` (guest arrival), `grand_entrance` (couple into reception — a major
PH moment, distinct from guest arrival), `recessional` (post-ceremony walk out).

⏭ Owner confirms the list. **Extend the enum, never fork it.** Verify every downstream reader
handles new slots gracefully before adding.

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
- **Pricing untouched** — owner: "free for now, decide later." Sets living inside the song desk
  makes them Solo-tier-and-up **by construction**; flag that as a pricing consequence rather than
  letting it land silently.
