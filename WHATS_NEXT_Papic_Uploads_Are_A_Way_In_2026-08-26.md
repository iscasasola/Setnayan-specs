# WHATS_NEXT — PAPIC: AN UPLOAD IS A WAY IN, AND IT COSTS A CREDIT

**Written 2026-08-26 so the seam below is never re-derived.** Everything here is
measured against `origin/main` (`7c02d2da5` at the time of writing) and the live
production database. ⚠ **A HANDOFF IS NOT EVIDENCE — including this one.** Every
claim carries the command that produced it. Re-run before acting.

---

## § 0 · THE PURPOSE LOCK THIS SITS UNDER

Owner, 2026-08-26, verbatim:

> *"papic is the source where they collect media files for that event. that will
> be our purpose. so the only exceptions will be the save the date video, or
> event video."*

And on uploads:

> *"in addition to papic service, we will allow them to upload a photo to replace
> a papic credit as well. so they can start collecting older memories on the app.
> or allow photo and video vendor to upload their own works."*

> *"yes. it will take up the same spot as 1 papic photo."*

⇒ **An uploaded photo costs ONE credit, identical to a captured photo.** A clip
costs what a clip costs (2–8 by length). Origin is irrelevant to price. Full row:
`DECISION_LOG.md` 2026-08-26.

**Why charge, given it is not storage:** measured from the 14 real production
photos, the kept copy averages **111 KB**, so keeping one photo costs about a
tenth of a centavo per year (~₱0.06 for fifty years) against a credit worth
₱0.25–0.33 — a whole 1,000-photo wedding is about **₱1/year** to keep forever.
Storage is not the reason. **A free upload lane is a free door around the entire
product**: shoot on the ordinary phone camera, upload the lot, never buy a
credit. One unit, one price, no loophole.

---

## § 1 · ✅ ALREADY SHIPPED — DO NOT REBUILD (four PRs, 2026-08-26)

| PR | what a person gets |
|---|---|
| [#4851](https://github.com/iscasasola/setnayan-platform/pull/4851) | Papic stops asking about photo quality and "where your photos go"; Drive becomes an offer to sync |
| [#4856](https://github.com/iscasasola/setnayan-platform/pull/4856) | the camera dates show in **whichever room** the couple lands in |
| [#4857](https://github.com/iscasasola/setnayan-platform/pull/4857) | **four facts** above every room: library · ways in · still coming · credits |
| [#4854](https://github.com/iscasasola/setnayan-platform/pull/4854) | "Papic Pool" / "Papic One" leave everything a customer reads |

⚠ #4856 and #4857 merged **into #4851's branch**, not `main` — their auto-merge
fired against the stacked base. #4851 therefore carries all three. **Verify with
`gh pr view <n> --json state,mergedAt` before trusting any of this.**

The design they implement: **[`prototypes/papic_control_center_2026-08-25.html`](prototypes/papic_control_center_2026-08-25.html)**
— three states, phone + desktop, and an inventory table proving no control was
lost. Read it before designing anything Papic-shaped.

---

## § 2 · 🔑 THE SEAM — THIS IS THE WHOLE POINT OF THIS FILE

**Do NOT write a second capture path.** The pattern for *"a person holds a
camera and shoots into the library, spending credits"* is **already
generalised**, and the module that generalises it says so in its own docblock.

### The primitives that already exist

```bash
# read this file FIRST — its docblock is the design
sed -n '1,60p' apps/web/lib/papic-guest-own-camera.ts
```

| primitive | what it does |
|---|---|
| `ensureGuestOwnCameraAdmin()` | mints a camera for a person. **No new schema** — `paparazzi_seats.guest_id` already exists (migration `20270305788856`) with a unique index enforcing one active camera per person, and roll seats already run with `claimer_user_id` NULL |
| `reserveGuestOwnCameraCapture()` | the metering. `papic_reserve_capture_split` spends what that camera holds FIRST and asks the host's pot only for the remainder |
| `/api/upload` | the bytes. **Already whitelists video** (`video/mp4`, `video/webm`, `video/quicktime`, 200 MB ceiling) — verified, so collecting clips from a laptop needs no new plumbing |
| `recordSeatCapture()` (`app/papic/actions.ts`) | writes the `papic_photos` row once the bytes are in R2, with the per-camera burst limiter and the server-side 10-second clip cap |

🔑 **DEDICATED CREDITS ARE A FLOOR, NOT A CEILING.** The split reserve is what
makes that true, and it was shipped wrong once (the pool "stood down" for any
camera holding dedicated points — owner caught it 2026-08-11). **Do not
reintroduce a two-call sequence**: the first call mutates and the second then
cannot tell "spent its last credit" from "never had any".

### So the delta is

1. **Resolve a camera for the uploader** — mirror `ensureGuestOwnCameraAdmin`
   for the couple. Everything downstream then works untouched: point grants,
   `papic_event_pool_status` (it sums only `seat_id IS NULL`, so a bought
   balance never inflates the host's visible pool), and the split reserve.
2. **A file picker** in the Papic studio that PUTs to `/api/upload`, then calls
   the record path. The drawing already shows this sheet — *"Add to your
   library"*, *"older memories are welcome — the engagement shoot, childhood
   photos, the proposal clip"*.
3. **The safety screen is not optional and is not yours to skip.** Every capture
   route screens; a posterless clip stays `unscreened` forever, and unscreened
   media is structurally excluded from guest surfaces. Mirror
   `app/api/papic/guest-capture/route.ts` — read its NSFW section before writing
   a line.

⚠ **THE REAL RISK IS THE UNWIND.** The guest route reserves credits, and if the
record then fails it must give them back. Two reserve call sites, one unwind.
Getting this wrong charges a couple for a photo they do not have.

---

## § 3 · ⏭ MOVE THE OTHER PILE IN — AND IT IS FREE TODAY

The couple's own uploads **already exist** and land somewhere else:
`events.our_photos` (a JSONB array of `r2://` refs), authored in
`app/dashboard/[eventId]/website/our-photos/`, NSFW-screened since 2026-07-30,
rendered on the invitation. **It costs nothing and is a separate pile.**

```sql
-- measured 2026-08-26: NOTHING TO MIGRATE
select count(*) from events where our_photos is not null and jsonb_array_length(our_photos) > 0;  -- 0
```

🔢 **Every alternate media home in production is EMPTY** — couple's own uploads
0 · invitation hero film 0 · photographer handover 0 · Patiktok clips 0 ·
supplier captures 0 · venue walkthrough 0. Only Papic has anything (**14
photos**), plus the live wall (8, derived from Papic) and the mood board (7,
which is planning inspiration, not memories).

⇒ **Consolidating costs nothing.** There is no real data to move, and the moment
somebody fills the wrong pile that stops being true.

⛔ **The two named exceptions stay out**: the save-the-date film and the event
film. Those are produced, not collected.

---

## § 4 · 🔴 WHAT NEEDS THE OWNER, NOT ENGINEERING

1. **The photographer cannot put photos in.** Today a booked photographer hands
   over a **link** to their own gallery (`booking_handovers`,
   `kind='gallery_link'`). Nothing they shot ever enters the couple's library.
   **This is the only genuinely new build on the list** — and it is gated on:
2. **The supplier capture lane is BUILT and SWITCHED OFF**, pending the DPO
   ruling about a supplier collecting guest photos
   (`isVendorPapicCaptureEnabled`, default off; the route 403s). Flipping it is
   a privacy decision, not an engineering one.
3. **Nothing records who took a photo.** `papic_photos.captured_by_person_id`
   has **zero writers** — verified by grepping every non-test file under `app/`
   and `lib/`. So *"each person's own folder"* is not reading something we
   already store; the uploader's identity has to be written down as part of the
   upload build. Small, but real, and it must land WITH the upload or the folder
   idea has nothing to key on.

---

## § 5 · 🪤 TRAPS THIS STREAM PAID FOR — assume a sixth

- 🚨 **NOT EVERYTHING IN `scripts/` IS A CHECK.** `swap-status-color-tokens.mjs`
  is a **codemod**. Run in a loop with two real lints "to see if they pass", it
  printed nothing, **exited 0, read as PASS, and rewrote 60 files.** Caught only
  by `git status` showing sixty modified files instead of four — every guard
  still passed, because the codemod's output is what those guards want. **A zero
  exit code means "it ran", not "it changed nothing".** `lint-*` inspects;
  `swap-*` / `gen-*` writes.
- 🚨 **A CLAIM TO MIRROR SOMETHING IS NOT A MIRROR — twice in one change.**
  `papic-tier-copy.ts` said it mirrored the live DB title and had never read it;
  its guard then hand-applied `'Papic One'` under a comment saying the same
  thing. Three different values for one row: seed `Papic Mini`, code `Papic
  One`, **production `Dedicated camera (legacy)`**.
- 🚨 **A SENTENCE IS NOT A MECHANISM.** `rooms.ts` said *"Unset means Set up,
  where the attention row is"*. There was no attention row, and all five
  production events are window-unset — so every couple who ever opened Papic
  landed in a room that could not tell them what to do.
- 🪤 **A COMMENT IS NOT EVIDENCE.** `rooms.ts` also claimed nine outcomes *"save
  in silence"*. Stale — all nine are wired. It was read as current and repeated
  to the owner as fact, costing a round trip.
- 🪤 **A SEARCH THAT CANNOT MATCH IS NOT A NEGATIVE RESULT.** A sweep for a
  Drive copy path grepped `drive_transferred_at`, found zero writers, and nearly
  became a finding that *"nothing copies to Drive."* False — the mechanism is
  `drive_copy_artifacts` / `drive_file_id`. It had a different name.
- 🪤 **`node --test 'app/dashboard/[eventId]/…'` prints `# tests 0` and exits
  GREEN** — the brackets are a glob character class. Escape as `[[]eventId[]]`.
- 🪤 **"The sabotage landed" is itself a claim that needs measuring.** A mutation
  that moved a component *before* the first room instead of *inside* one
  reported a pass that meant nothing. Print the occurrence count **and** the
  positions.
- 🪤 **A comparison keyed on a field that does not exist always agrees with
  you.** A baseline check compared `destinations`, `actions` and `components`;
  the file has no `components` field (it is `blocks`), so that third check
  silently compared nothing and reported clean while the guard reported losses.
- 🎨 **`mulberry-700` is 5.86:1 in light and 3.05:1 in DARK** — it flips to the
  light theme's `#C24E25` on a dark panel. Use `mulberry-600` (4.92 / 5.78). A
  light-only contrast check waves the bad one straight through.
- ⚠ **In this repo the Tailwind slot named `terracotta` is the GOLD**; the action
  colour lives in the slot named `mulberry`. Inherited, and backwards.

---

## § 6 · ✅ FACE TAGGING IS LIVE — do not scope a build for it

A session claimed on 2026-08-26 that face recognition "is not running today,
for anybody", reading **0 enrolments** in production as *not built*. **That was
wrong**, and it is [[feedback_empty_is_the_plan_not_a_finding]] again: zero
means nobody has used it yet.

**Measured, not read:** the model and `face-api.js` serve **HTTP 200** from
`https://pub-37d64fe618584c2981a88610a55dd439.r2.dev/face-models` right now.
Activated **2026-06-19** (`OWNER_ACTIONS.md` line 1234) and verified then with a
real-face test — same person 0.40–0.47, different people 0.79–0.90, zero false
tags.

- **Registration already lives on the Event Hub** — the RSVP widget and a day-of
  enrol card, both using `selfie-capture.tsx`. The owner was right about this.
- The descriptor is computed **on the guest's own phone**; the image never
  leaves the device, only a 128-d vector. ₱0 per photo.
- 🔑 **THE QR SAYS WHO HOLDS THE CAMERA; THE FACE SAYS WHO IS IN THE PICTURE.**
  Different axes. **One shared QR does not trap anyone in anonymity** — identity
  is claimed by registering a face, not by which link was scanned. So the real
  split is **registered vs not**, never *custom QR vs generic QR*.
- ⛔ **Off-switch** (instantly reversible, no data touched):
  `vercel env rm NEXT_PUBLIC_FACE_MODEL_URL production` then redeploy.

---

## § 7 · HOW TO VERIFY ANY OF THIS

```bash
# never read code from ~ — that checkout is 1434+ commits stale
git -C ~ fetch origin main && git -C ~ worktree add --detach /tmp/wt-read origin/main

# the four PRs
gh pr view 4851 4854 4856 4857 -R iscasasola/setnayan-platform --json number,state,mergedAt

# production is serving what you think it is
curl -s https://www.setnayan.com/api/health
```
