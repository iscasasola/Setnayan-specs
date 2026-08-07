# The venue states its own size — build spec

**Owner, 2026-08-07:** *"what we can fix from here is allowing vendors to set the
sizes of their venues so customers can fillup the space."*

## What a person experiences

**Today.** A couple opens their seating plan and picks a room size from six
generic presets — Intimate 14×10 · Standard 20×30 · Grand 30×20 · Garden 60×40 ·
Estate 120×90 · Field 200×200 — defaulting to *Standard*. They have already
booked a real venue with real walls, and they are guessing at its dimensions.
Every table they place, every aisle they leave, and the whole 3D walk-through is
built on that guess.

**After.** The venue told us its size when it set up its shop. The couple's plan
opens at the actual room, and the tables they place are tables that will fit.

## What already exists — do NOT rebuild

| Piece | State |
|---|---|
| `event_floor_plan.venue_width_m` · `venue_length_m` | ✅ exist, numeric, drive the editor AND the public 3D walk (`public_venue_scene` reads them) |
| The couple's room-size control | ✅ ships — `seating-editor.tsx:187` `ROOM_PRESETS` |
| `vendor_profiles.capacity_min` · `capacity_max` | ⚠ **exist with NO WRITER** — no vendor-dashboard code sets either |
| `venue_directory.capacity_min` · `capacity_max` | ⚠ same |
| Venue dimensions on a vendor | ❌ **do not exist anywhere** |

## 🔴 THE ONE RULE FOR THIS BUILD: SHIP BOTH HALVES OR NEITHER

Adding the columns and the vendor's form without the couple-side read produces a
**column with a writer and nobody reading it** — the exact mirror of the defect
found FOUR times on 2026-08-05 (`live_media_public`, `papic_face_mode`, the admin
venue-type picker, `compatible_venue_settings`). A vendor would type their room
size and nothing anywhere would change.

`capacity_min`/`capacity_max` are already sitting in that state and should be
picked up in the same change — they are the same form and the same audience.

## The build

### 1 · Schema — one migration

Add to `vendor_profiles`, nullable (most vendors are not venues):

- `venue_width_m numeric` · `venue_length_m numeric`

⚠ **Timestamp ABOVE the applied head** — check `supabase_migrations.schema_migrations`
first, which on 2026-08-05 was already higher than the newest file in the repo.
A migration below the head merges green and creates nothing.

Sanity CHECK: both null, or both present and `> 0` and `<= 500`. A one-sided pair
is a half-answer the couple-side seeding cannot use.

### 2 · The vendor states it

The venue fields belong on **My Shop → Business Profile**, added to
`INLINE_PROFILE_FIELDS` in `app/vendor-dashboard/actions.ts` (currently 10
entries). Offer them **only when the vendor's category is a venue** — a florist
has no room size, and an irrelevant field on every shop is how a form gets
abandoned.

Ship `capacity_min`/`capacity_max` in the same group. They already exist,
already have readers, and have never had a way in.

⛔ **Do NOT route this through `saveVendorProfile`.** It is a FULL-FORM action
called by no component, and it nulls every column absent from the submission —
`parseCompatibilityArray` returns `null` for an empty post. Wiring a partial form
to it silently wipes whatever it does not carry.

### 3 · The couple's plan opens at the real room

When a couple's booked venue vendor has dimensions, `event_floor_plan` seeds
`venue_width_m`/`venue_length_m` from it instead of the *Standard 20×30* default.

**Seed, never overwrite.** Once a couple has moved a single table, the room is
theirs — a vendor editing their profile must never reshape a plan already being
worked on. Seed only when the couple's plan has no dimensions of its own yet.

Surface it plainly in the editor: *"Sized from Seda Vertis North — change it if
your room is different."* The couple must be able to override; the venue's number
is the best starting guess, not the law.

### 4 · Guard

One test, mutation-verified, asserting the pair moves end to end:
- the columns exist and the CHECK rejects a one-sided pair
- the vendor form can WRITE them (the key appears inside `.update`, not merely
  mentioned) — the detector shape from `gates-have-handles.test.ts`, whose own
  weakness is recorded: a narrow regex window misses keys inside a large payload
- the couple-side seeding READS them
- seeding does not fire when the couple already set a size

## ⏭ Open, and deliberately not decided here

- **Which vendor categories count as venues?** `venue` exists as a category, but a
  hotel with a ballroom may be filed under something else. Pick from the shipped
  category list rather than inventing a flag.
- **Shape.** Width × length assumes a rectangle. An L-shaped or round function
  room is not a rectangle, and the editor already models only rectangles — so
  this inherits that limit rather than adding one. Worth saying out loud to the
  vendor: *"the rectangle that best fits your room."*
