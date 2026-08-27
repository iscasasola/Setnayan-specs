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

## § 3b · ✅ THE SUPPLIER LANE — RULED AND PART-BUILT (2026-08-26)

Owner ruled it in five parts. **Do not re-ask any of them.**

| # | ruling | state |
|---|---|---|
| 1 | free shots = **one per ₱5 of booking fee paid**, floor 50, ceiling 2,000 | ✅ built, [#4861](https://github.com/iscasasola/setnayan-platform/pull/4861) |
| 2 | **video unlocks at 800 credits** | ✅ built |
| 3 | suppliers **upload their work via papic credits, per event** | ⏭ unbuilt — § 2 is the seam |
| 4 | suppliers **buy shots**, collected in an album they have | ⏭ unbuilt |
| 5 | **the host allows access; only shots from the sponsored challenge** | ✅ built |

⚠ **RULING 4 REVERSES HIS OWN 2026-07-18 DECISION** (*"not allow upgrade +50 if it is difficult"*). Recorded as a reversal, and he stated it explicitly — do not treat it as inferred.

🚨 **THE 2026-07-22 RULING HAD BEEN WRITTEN, TESTED, AND CALLED BY NOTHING.** `vendorPapicPointsForBookingFee` carried ten passing assertions and **zero application callers** — so every supplier got the flat tier number whatever they paid, and **no test failed**, because a pure function tested in isolation passes whether or not anybody uses it. The reason was honest when written (the fee mechanism was unbuilt); it shipped since, and **nothing was watching for the reason to expire**. 🔑 **A decided rule needs a CALLER, and something that checks it has one.**

**Two rules that are the whole safety of the allowance wire** — keep them:
- **The fee can only RAISE, never lower.** A comped supplier on 70 would otherwise be handed the 50 floor and lose 20 points to a wire being connected.
- **An unproven fee grants nothing.** `null` is a failed read, never *"they paid nothing"* — the mirror of the spend read, which fails CLOSED. Neither invents generosity out of an outage.
- 🚨 **`waived_free5` means they paid ₱0** — reading the first-5-free rule as `paid` hands the free five a 200-point allowance.

**Ruling 5's chain already existed in the schema** and is now enforced in `lib/vendor-sponsored-shots.ts` — **eight gates**, each somebody's decision: this event · their own challenge · a vendor challenge · **the host approved it** (that clause IS the access grant; un-approving is the revoke) · still active · **the guest consented, per photograph** · not taken down · screened clean.
⚠ **The screen check is an ALLOWLIST.** Two of the five states in that column are filtered on elsewhere and **written by nothing** — a deny-list would pass every state nobody thought of, `unscreened` included.
⚠ **Service-role read ⇒ the app-side gate is the whole fence.** RLS is a floor, not a scope; there is no policy underneath to catch a dropped clause. `vendor-sponsored-shots-are-scoped.test.ts` is what stands in for one.

⛔ **The whole lane is still switched off** behind the DPO flag. Every line above is inert until the owner opens it.

---

## § 3c · ✅ WHAT SHIPPED 2026-08-26 (9 PRs) AND WHAT IS LEFT

⚠ **Verify every row with `gh pr view <n> --json state,mergedAt` before trusting it** — this
project's registers have been wrong about a PR's state five times.

| PR | what a person gets | state |
|---|---|---|
| [#4851](https://github.com/iscasasola/setnayan-platform/pull/4851) | the two questions deleted · the required act in the landing room · the four facts | ✅ merged, LIVE |
| [#4854](https://github.com/iscasasola/setnayan-platform/pull/4854) | "Papic Pool / Papic One" gone from customer copy | ✅ merged, LIVE |
| [#4864](https://github.com/iscasasola/setnayan-platform/pull/4864) | the look is one quiet row opening a sheet | ✅ merged |
| [#4861](https://github.com/iscasasola/setnayan-platform/pull/4861) | supplier free shots scale with the fee · video at 800 · challenge-scoped access | ✅ merged |
| [#4865](https://github.com/iscasasola/setnayan-platform/pull/4865) | 🔒 a couple could add photos without spending a credit | ✅ merged |
| [#4867](https://github.com/iscasasola/setnayan-platform/pull/4867) | 🔒 a supplier could reset their own meter / mark their own file screened | ✅ merged |
| [#4868](https://github.com/iscasasola/setnayan-platform/pull/4868) | three silent failures in the credit meter | ✅ merged |
| [#4872](https://github.com/iscasasola/setnayan-platform/pull/4872) | the couple's **Uploads camera** (index 150) | ⏳ open |

### ✅ BOTH ARE BUILT — 2026-08-26. Do NOT rebuild them.

**The file picker** (#4875, with the toggle folded in via #4877 + #4878) and the **switch** for who
may add photos by hand. The toggle was deliberately built SECOND: a switch with nothing behind it
is a gate with no handle, which is the shape this project keeps paying for.

⚖ **The switch defaults OPEN**, as a stated choice — Papic is the event's media library, a library
that refuses the most obvious way to put something into it is closed against its own point, and an
upload already costs a credit, so an open door is not a free one. ⚠ Its siblings default differently
and that is not an inconsistency: `papic_guest_capture_early` defaults FALSE because it hands a
capability to **other people**. 🔑 Today it governs the couple's own picker. **When guests or
suppliers gain an upload path they read the same column — and the SERVER must read it then, not just
the screen.** Hiding a control is not closing a door.

### ✅ AND THE SCREEN ITSELF IS THE DRAWING NOW — 2026-08-27. Do NOT re-port it.

🛑 **THIS ROW EXISTS BECAUSE THE REGISTER DID NOT HAVE ONE.** Owner, 2026-08-27:
*"the papic control center is still not fixed"* — then, asked what was wrong, he
picked **all four** offered readings at once: it still has the three tabs ·
something doesn't work · the numbers are wrong · it looks unfinished.

🔑 **THE PARTS WERE PORTED AND THE SHAPE NEVER WAS, and nothing was tracking the
shape.** Everything this file's § 1 and § 3c list as shipped is real — the four
facts, the two deleted questions, the upload sheet, the switch, the quiet setting
rows. But the drawing's **central move** is replacing the tab bar with the thing
itself, *four ways into the library*, and that was never built. Measured on
`origin/main` the morning after: the page still opened on **Photos · Cameras &
shots · Set up**. ⚠ **Every entry in this register was about the MONEY side**
(meter · ladder · upload lane · supplier lane); *"the screen looks like the
approved drawing"* was on no row anywhere, which is part of why it kept not
getting done. **When a stream is drawn and part-ported, the un-ported half needs
its own row or it is nobody's.**

**Shipped:** the four facts → exactly ONE next step (the dates while unset,
otherwise the QRs still in the couple's pocket) → **four ways in** → the library →
the credits → what is made from it → what the couple has a say over → the
set-once rows → the offers **LAST**. `_lib/rooms.ts` is DELETED, not disabled;
`?tab=` is accepted and ignored so printed links and bookmarks still land.

🔢 **NOTHING WAS LOST WITH THE TABS — measured, not asserted.** All **40**
controls the three-room page mounted are still mounted, and the guard's bill is
**DERIVED** from that page (every capitalised JSX tag minus the icons) rather
than hand-written. 🔑 *A hand-enumerated list is a list of the controls somebody
thought of.* The port lint agrees independently: across **406 routes exactly ONE
entry disappears** — the `?tab=` link, which is the tabs.

⚠ **THE SUPPLIERS ROW IS DELIBERATELY INERT** — visible, no sheet, no link, and
it says *"Not open yet"*. The lane is built and dark behind the DPO ruling in § 4,
so a door there would be a control that cannot do the thing it names.

🪤 **THREE EXISTING GUARDS BROKE AND TWO WERE KEYED ON THE WRONG THING — worth
more than the fix.** One reported the look picker missing because it matched *the
first* `SettingRow` rather than the one **labelled** *Your Papic look*: **a guard
keyed on position answers a question about position.** One compared against
`indexOf("room === '")`, which returns **−1** once the rooms are gone — so it
would pass or fail for reasons unrelated to its own rule. And my first
replacement **cried wolf**, flagging any `if (…) {` around a self-heal, which
caught the two that are *supposed* to be data-gated; narrowed to conditions
derived from the URL, which is what *"only in the Cameras room"* actually was.
🛡 **7 mutations, each measured by occurrence count or line position before →
after, all 7 RED.**

🚨 **AND ONE SUSPECTED DEFECT WAS DISPROVED BY QUERYING RATHER THAN READING.**
The credits fact looked certain to render *"—"* on every real event: it is null
unless `pool.status.applies`, and `lib/papic-event-pool.ts`'s own docblock says
the pool *"applies ONLY to events holding an ACTIVE flat pass"* — and nobody has
ever bought one. **Production says `applies = true` on all five events**, and the
number is right (50 free everywhere, 29 left on the one with photos). **A
docblock describing a fence is not the fence.** It was one query, and it stopped
a "fix" to something that works.

⏭ **STILL OPEN FROM HIS FOUR:** *"something doesn't work"* and *"the numbers are
wrong"* were not named, and the shape port does not automatically answer either.
**Ask which control and which number rather than guessing** — the guessing is
what produced this row.

### 🚨 THREE THINGS THAT NEARLY SHIPPED BROKEN, all caught before anyone met them

1. 🔒 **THE METER WAS ADVICE.** `recordSeatCapture` refuses a capture eight ways and every one was
   skippable: the row went in through the CLAIMER'S OWN SESSION while `authenticated` held INSERT
   on `papic_photos`, so a POST to PostgREST with the public anon key spent no credits, checked no
   length, ignored the window, the paid gate, the put-away gate and the geo control.
   🔑 **`has_table_privilege(…,'INSERT')` ANSWERS FALSE** — the grant was on all 39 COLUMNS, so a
   table-level audit reads the table as closed while it is open. ⚖ Until this week a claimer was a
   friend handed a camera; the Uploads camera made **every host** one.
   ⛔ Reserve and insert are STILL two steps — that leaks credits against **us**, not the meter.
   **Do not read "service role" as "atomic".** 🔑 The repair is not a new idea:
   `papic_record_guest_capture` already does gates + reserve + insert in ONE `SECURITY DEFINER`
   function. **Copy the guest function's shape.**
2. 🚨 **A NEW COLUMN ON `events` IS NOT DONE WHEN IT EXISTS.** That table revokes table-level SELECT
   and re-grants a **per-column allowlist**, so a column with no `GRANT SELECT (col)` makes
   PostgREST refuse the **WHOLE query** and every user-session read of `events` goes silently empty
   — while `events_host` has an explicit projection computed from those grants and
   `/dashboard/[eventId]/details` **THROWS** on a query error. Only `lint-events-column-grants`
   catches it: **the db coverage tests structurally cannot**, because their `before()` re-applies
   the lockdown and recomputes the allowlist over the new column.
3. 🪤 **THE SWITCH SHIPPED GOVERNING NOTHING, past six of my own guard's rules.** The page read
   `papic_uploads_open` off its **main event select, which never named the column** — always
   `undefined`, `?? true` reported OPEN, and the picker rendered for a couple who had switched it
   off. Column existed, control mounted, branch wired, save confirmed. **I guarded the branch and
   not the source.** ⚠ Its fix is its OWN round trip on purpose: naming an unknown column in the
   main select makes PostgREST refuse that query, and the page answers an unreadable event with
   `notFound()` — a live celebration would render as missing.

### 🪤 THREE THINGS THE BUILD PLAN GOT WRONG — all caught against the live system

1. 🚨 **`seat_index = 110` WOULD HAVE CREATED NOTHING AND REPORTED SUCCESS.** The plan specified
   110; production already holds the free dedicated camera there **on four events**, and the upsert
   uses `ignoreDuplicates: true`. Shipped at **150** (clear of the free block 100–102, of 110, and
   of the paid base 200). **Always read the live index space before reserving one.**
2. 🚨 **`claimPapicSeat` REDIRECTS TO `/papic/seat/${token}` ON SUCCESS.** The plan said to post the
   studio's claim button at it. That navigates the couple **out of their own studio onto the camera
   screen**. The picker needs a studio-scoped claim that returns to the studio — or the claim folded
   into the first upload.
3. ⛔ **NO SERVER ACTION MAY MINT THE CAMERA.** `provisionUploadsCameraAdmin` is a service-role
   write; an action taking a client-supplied `eventId` lets a signed-in stranger mint a live seat on
   somebody else's wedding and claim it, after which **every downstream gate passes them** — the
   upload presign and the record path check *claimer identity* and nothing else. It is called ONLY
   from the studio render, after that page's couple check. 🔑 **The rule is the CALL SITE, not the
   function**, and `lib/the-uploads-camera-has-no-back-door.test.ts` is what holds it.

### ✅ THE UNMETERED DOOR IS CLOSED — but read what that does and does not mean

**There are now ZERO browser-role doors into `papic_photos`.** INSERT is revoked from
`authenticated` and `anon` at TABLE level (that is what drops the column grants), the claimer's
`FOR ALL` policy is three verbs with no INSERT arm, and the capture row is written by the service
role after the eight gates run.

⛔ **It is still NOT atomic.** The reservation and the insert are two steps with an app-side unwind;
a process that dies in the gap leaks the reserved credits. That errs against us rather than against
the meter, which is the right direction to fail while it stands — but **do not claim "a photo
cannot exist without a credit" until the `SECURITY DEFINER` record function exists.**

~~#4865 closed the couple's unmetered insert door. `papic_photos_claimer_own` still admits any
insert from a live-seat claimer with no credit check — and #4872 makes every host a claimer by
design, so that door is now reachable by the couple again.~~

🔑 **The real fix is ATOMICITY, not permission:** a `SECURITY DEFINER` record RPC that reserves the
credit and inserts the row in ONE transaction, on the model of `papic_record_guest_capture`, with
direct INSERT revoked. **It also deletes the unwind problem outright** — there is nothing to give
back if the two cannot come apart. ⚠ **Do not claim "a photo cannot exist without a credit" until
that exists.**

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
3. ✅ **CLOSED 2026-08-26 — `captured_by_person_id` HAS A WRITER NOW.** It was worse than
   *"zero writers"*: measured in production, **14 photos · 14 carry a seat · 14 have a claimer whose
   person row resolves right now · 0 carry the value.** The column has **never held a value at all**
   — the 2026-05-23 backfill matched nothing because every photo postdates it. ⚠ **A BACKFILL IS A
   POINT-IN-TIME ACT; never cite an old one as ongoing coverage.** Fixed with a trigger (the value
   is a JOIN, not a decision, so it covers every capture path rather than the ones somebody
   remembered) plus an idempotent re-backfill. ⏭ Named, not hidden: the Uploads camera is claimed by
   ONE host, so a co-host is credited to the claimer — per-uploader credit is a different fact and
   needs its own column.

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
