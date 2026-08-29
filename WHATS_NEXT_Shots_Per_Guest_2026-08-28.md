<!-- Owner session 2026-08-28. Ruling: "this is a good idea to help them decide how many shots
per guest they can have. the excess can always be used by anyone or dedicated to someone."
Then: "plan it properly. use fable to assist us with this / then this should also fix on the papic
promotion page, papic control center, and papic inside the event hub."
Research: three parallel Fable passes over origin/main (= prod, /api/health → e058700), read-only,
plus direct reads of the SQL and the live database. Every claim below carries its evidence. -->

# Shots per guest — BUILD SPEC (2026-08-28)

> **The one-page version.** The couple picks how many shots any ONE guest may spend — 6 / 12 /
> 24 / 50 or a number of their own. It is a **ceiling, not a reservation**: nothing is carved out,
> and whatever a guest does not spend stays in the shared pot for anyone else or gets set aside
> for a trusted camera. **Almost all of this machinery already exists** — the counting, the
> per-guest lock and the refusal all ship today. What is missing is a number the couple owns, a
> currency that matches what people pay, and a screen that tells the truth about it.
>
> ⚠ **AND THE RESEARCH FOUND A LIVE DEFECT ON THE WAY.** A per-guest cap of 150 is drawn in the
> browser and enforced nowhere. The same change fixes it — see § 1.

---

## § 0 · What already exists — RULE 0, answered before anything is designed

| Piece | State | Evidence |
|---|---|---|
| A per-guest ceiling | **WRITTEN, INERT** — hardcoded `150`, disarmed on every pool event | `20270920602517_guest_capture_restore_ugc_gates.sql:37,111-135` |
| A per-guest counter | **SHIPS** — `COUNT(*) … WHERE guest_id`, under a per-guest advisory lock | same migration, :118-126 |
| A refusal for it | **SHIPS** — returns `quota_exhausted` with `total/used/remaining` | same migration, :126-134 |
| The route's unwind for that refusal | **SHIPS** — releases both halves of the booking | `app/api/papic/guest-capture/route.ts:529-549` |
| A remaining-count on the guest's screen | **SHIPS** — header pill `` `${remaining} left` `` | `app/papic/guest/_components/papic-guest-capture.tsx:1319` |
| That count on the Event Hub | **SHIPS** — the inline camera is mounted on `/[slug]` and fed the quota | `app/[slug]/_components/site-body.tsx:1386-1400` · `app/[slug]/_lib/loaders.ts:1127` |
| A place for the couple to choose the number | **DOES NOT EXIST** | census of every `ADD COLUMN … papic` in `supabase/migrations/` — no per-guest column |
| A per-capture cost, stored | **DOES NOT EXIST** | `papic_guest_captures` has `media_type`, `duration_ms`, no cost; the pool tables hold running totals only |

🔑 **So this is not a new mechanic.** It is: give the number an owner, change the unit from
pictures to shots, and stop the two halves of one rule disagreeing.

⛔ **DO NOT reuse `papic_tier_config.points_per_day`.** It is per-CAMERA-per-DAY, keyed by tier,
global rather than per event, NULL on every active tier, and **the authoritative reserve
(`papic_reserve_capture_split`) never consults it at all.** It is a retired meter.

⛔ **DO NOT implement this with dedicated credits.** *Dedicated is a FLOOR, not a ceiling*
(owner-locked 2026-08-11; `tests/db/papic-dedicated-is-a-floor.db.test.ts`). Carving shots out
per guest is the opposite semantic and contradicts the owner's own sentence.

---

## § 1 · 🔴 THE LIVE DEFECT THIS FIXES — a cap that exists only in the browser

**Read out of the objects, not inferred.**

The database says: *if the celebration has a shared pot, do not apply a per-guest limit at all.*

```sql
-- 20270920602517_guest_capture_restore_ugc_gates.sql:111-114
v_unlimited := v_unlimited OR COALESCE(v_pool_applies, FALSE);
```

Every event arms the free 50-shot pool grant on render (`lib/papic-free-grant.ts`, called from
`studio/papic/page.tsx:473-482`), so **`v_pool_applies` is true everywhere and the 150 never
binds.**

The app says the opposite. `fetchGuestQuota` mirrors **only the Unlock half** of that rule and
never learned about the pool yield:

```ts
// lib/papic-guest.ts:198-206 — the ONLY thing that sets `unlimited`
unlimited = await eventHasPapicUnlock(supabase, eventId);
```

and the camera hides its own shutter off that number:

```ts
// papic-guest-capture.tsx:321
const exhausted = !guestUnlimited && remaining <= 0;
```

**Measured consequence.** The route does **not** pre-check `remaining` (grep: `remaining` appears
in that file only in a docblock and a type). So on every celebration today the server will accept
a guest's 151st picture, while their screen has already counted down to zero, unmounted the
shutter, and told them **“That's all 150 photos, {name}!”**

⇒ **A guest at a large wedding can be shut out of a celebration that still has thousands of shots
in the pot, by a number nobody chose, and the couple never learns it happened.**

🔑 **The generalisable lesson: one rule written twice will drift, and the copy that drifts is the
one nobody re-read when the model changed.** The one-pool model landed in the SQL and never
reached the TypeScript mirror. **This build's first job is to make it one rule with one reader.**

---

## § 2 · The shape — THREE TIERS, refined by the owner 2026-08-28

> **Owner, second pass:** *"we can allot specific numbers for each guest. but also allow for the
> rest to share the other shots equally, and the excess can be used by anyone."*

This is richer than a single number and it is still a **ceiling model** — nothing is carved out.

| Tier | Who | How much |
|---|---|---|
| **1 · Allotted** | Guests the couple names | **A specific number, each.** Protected by arithmetic (see below). |
| **2 · The equal share** | Every other guest | **`(pot − allotted) ÷ how many of them`**, equally. |
| **3 · The excess** | Anybody | **Whatever is left after that division** — first come, first served. |

### 🔑 The insight that keeps this cheap: CAPPING EVERYONE *IS* THE GUARANTEE

Nobody's shots need to be locked away for their share to be safe. **If every other guest is
capped at their own share, none of them can reach yours** — the ceiling does the reserving by
arithmetic. So this stays exactly what the owner's first sentence described: no per-guest wallet,
no refunds, no new price, nothing carved out of the pot.

### The arithmetic, and where every input already lives

```
P   = total_points        ─┐
G   = guest_count          ├─ ALL THREE already returned by
U   = used_points         ─┘   papic_event_pool_status(event_id)
A   = SUM(specific allotments)          ← the one new stored fact
n   = number of allotted guests         ← the same new fact

share  = FLOOR( (P − A) / (G − n) )     -- tier 2, per guest
excess = (P − A) − share × (G − n)      -- tier 3, open to all

ceiling(guest) = allotment(guest)  OR  share
```

✅ **`papic_event_pool_status` already computes `total_points`, `used_points`,
`remaining_points` and `soft_stop_at` in one call** (`20271131476413_papic_host_hands_out_shots_to_a_camera.sql`).

🔴 **CORRECTED 2026-08-30, MEASURED AGAINST PRODUCTION — `G` IS NOT `guest_count`.** That
column is populated **only on the flat-pass branch**; on a grant-driven event it returns a
hard-coded `0`. Every celebration is grant-driven (a 50-credit free grant is armed at
creation), so `FLOOR((P − A) / (G − n))` as written above **divides by zero on every event
this feature would ever run on.** S2 therefore extracted the headcount into
`public.papic_event_guest_headcount(event_id)` — `GREATEST(final_pax, estimated_pax,
non-declined guests)`, lifted verbatim out of `papic_event_pool_status`, which now calls
it — so the pot's size and a guest's share divide by the same number rather than two copies
of one expression. **`G = papic_event_guest_headcount(event_id)`, never `guest_count`.**

⚖ **And the derived share is floored at 1.** A 200-guest celebration holding only the free
50 divides to a share of zero, and a ceiling of zero would refuse every guest their FIRST
photograph — with copy that says they have spent an allowance they never had. The pot is
the money gate; this is a fairness rule between guests and must never be the thing that
stops the party.

🔴 **DERIVE AT SPEND TIME — NEVER STAMP A SHARE ON A GUEST.** Both inputs move: the couple tops
up (P grows) and guests keep accepting (G grows). A stamped share is stale the moment either
changes, and would need a re-stamp sweep on every top-up and every RSVP. The research already
recommended this on separate grounds (a stamped copy is a second copy of one fact); the moving
inputs make it mandatory.

### What stays from the single-number plan
Everything in §§ 3–6 is unchanged: enforced inside `papic_record_guest_capture`, counted in
**shots** via a stored `points_cost`, guest-camera door only, and **default = no allotments,
which reproduces today byte-for-byte.**

⚠ **Tier 2 with no tier-1 allotments is exactly the simple version** — every guest gets
`P ÷ G`. So the single-number build and this one are the same code with `A = 0`; the couple
naming a specific guest is the only addition. **Build it once, in this shape.**

## § 3 · Where it is enforced — and why nowhere else will do

**Inside `papic_record_guest_capture`.** That function is the single thing an anonymous
direct caller still reaches: `20271114597183_close_anon_camera_points_grant.sql:35` deliberately
keeps its EXECUTE for `anon` + `authenticated` — *"That is the anonymous guest-capture path and
must keep working."* Guests hold no table grant on `papic_guest_captures`; every insert goes
through this `SECURITY DEFINER` writer.

⇒ **A ceiling written in the route, in the reserve helper, or in a new advisory RPC is
bypassable by exactly that caller.** Only what is inside this function binds.

**Four rules the implementation must obey, each from a defect already paid for:**

1. **One function, one gate — and the count in this line was wrong.**
   🔴 **CORRECTED 2026-08-30, read out of production:** there are **TWO** live overloads
   (2-arg and 6-arg), not three. The 3-arg exists in the repo's migrations and is **not
   applied in prod**.

   The instinct behind this rule was right and the mechanism was worse than described.
   Storing what a capture cost needs the cost passed in, and in PostgreSQL a new parameter —
   **even a defaulted one** — is a NEW FUNCTION. **Probed in a rolled-back transaction
   against prod before a line was written:** with two candidates both matching, a named call
   fails **`42725 function … is not unique`** — and the route's fallback ladder is keyed on
   the regex `/function .*papic_record_guest_capture/`, which **matches that error**. So a
   fourth overload would not merely have been "ambiguous": every live guest capture would
   have failed, the ladder would have caught its own error, retried the 2-arg shape, and
   **recorded every clip as a photo with no duration and no poster.** Silent data loss.

   ⇒ **S2 DROPS all three signatures and CREATES one 7-argument function** (migration
   `20271184624871`). An old deploy still calling with six named arguments lands on it with
   `p_points_cost` defaulted, which is exactly the rollout behaviour wanted; the 2-arg shape
   had been unreachable for as long as the 6-arg existed, so nothing could depend on it.
   A migration assertion refuses to apply if more than one overload survives.
2. **Never take the ceiling from the caller.** `papic_reserve_camera_capture` was closed for
   exactly this — `p_limit IS NULL ⇒ unconditional TRUE` (`20271114597183:31-33`). The function
   **reads the couple's number from a table itself.**
3. **Decide it inside the existing lock.** The advisory lock → count → refuse → insert shape is
   already there and is already race-safe. Reuse it; do not add a second gate in sequence
   (*"THE SPLIT CANNOT BE DECIDED BY TWO GATES IN SEQUENCE"* — `20271131963489`).
4. **Keep returning `quota_exhausted`.** The route already handles that status and already
   releases the booking (`route.ts:529-549`). No new unwind is needed.

### The yield becomes conditional

```
-- today
v_unlimited := v_unlimited OR COALESCE(v_pool_applies, FALSE);

-- after
v_unlimited := v_unlimited OR (COALESCE(v_pool_applies, FALSE) AND v_guest_ceiling IS NULL);
```

Tightest gate wins: the pot still caps the celebration, the ceiling caps one guest inside it.
With no ceiling set, this line is **byte-equivalent to today.**

---

## § 4 · The count must be in shots — which needs one new stored fact

`papic_guest_captures` records `media_type` and `duration_ms` but **not what the capture cost.**
The metering functions deliberately never know the clip bands
(`20270903248590:6-7` — *"the metering RPCs never hardcode a clip cost"*); the cost arrives from
TypeScript.

⛔ **Do NOT derive the bands in SQL.** That is a second copy of a money rule, and this project has
a standing finding that two copies of a money rule always drift.

✅ **Add `papic_guest_captures.points_cost` (int, NOT NULL, default 1)**, written by the record
function from the cost it is already given. Then the guest's spend is
`SUM(points_cost) WHERE guest_id = …`, compared under the existing advisory lock:

```
IF v_ceiling IS NOT NULL AND (v_spent + p_cost) > v_ceiling THEN
  RETURN … 'quota_exhausted' …
```

⚠ **A NULL-length clip must count at the top band**, matching what it was charged
(`lib/papic-cameras-pure.ts:82-105` — *"AN UNKNOWN LENGTH COSTS THE MOST, NEVER THE LEAST"*).
Because the cost is now stored at write time this is automatic — do not re-derive it later.

⚠ **The count does NOT filter `hidden_at`.** Hiding a capture must never reset the meter — the
vendor-side twin of that reset attack was a live hole (#4867). The shipped 150-count already
gets this right; keep it.

⚠ **`mode=web_copy` follow-ups are not captures and must never be metered**
(`route.ts:58-68,178-183`). A naive counter over POSTs double-counts every clip.

---

## § 5 · Where the number is stored

**A new column on `public.events`** — every couple-set per-event Papic choice already lives there
(`papic_window_start/end`, `papic_style`, `papic_uploads_open`, `papic_guest_capture_early`,
`face_tagging_declined_by_couple`).

✅ **BUILT 2026-08-30 (migration `20271184624871`) — the names, so nothing else has to guess:**

| Object | What it holds |
|---|---|
| `events.papic_guest_spend_ceiling_on` | the switch · `BOOLEAN NOT NULL DEFAULT FALSE` |
| `events.papic_guest_spend_ceiling_points` | the "everyone else" number · NULL = derive the share · `CHECK (> 0)` |
| `events.papic_guest_spend_ceiling_released_at` | the couple's "open the rest to everyone" stamp |
| `papic_guest_spend_ceilings` | tier 1 — one row per NAMED guest (`guest_id` PK, `ceiling_points`) |
| `papic_guest_captures.points_cost` | what a capture was charged, written at write time |
| `papic_guest_spend_ceiling(guest)` | **the ONE resolver** — NULL means nothing binds |
| `papic_set_guest_spend_ceiling(...)` · `papic_set_guest_spend_ceiling_release(...)` | the two writes, both TARGET-not-delta |

⚠ **THE NAMES ARE LONG ON PURPOSE.** `papic_event_pool_config.points_per_guest` (default
150) is already shipped and means the opposite thing — credits the pot **GAINS** per head,
not credits a guest may **SPEND**. Naming this `points_per_guest` would have been one rule
written twice under one name, which is the disease this whole build exists to cure.

🚨 **A NEW COLUMN ON `events` IS NOT DONE WHEN IT EXISTS.** That table revokes table-level SELECT
and re-grants a per-column allowlist, so a column with no `GRANT SELECT (col)` makes PostgREST
refuse the **whole query** — every user-session read of `events` goes silently empty. The
migration must carry:

- `GRANT SELECT (col)` **and** `GRANT UPDATE (col)` to the roles the pattern names;
- the `events_host` view rebuilt (its projection is computed from those grants);
- `scripts/lint-events-column-grants.mjs` is **the only thing that catches this** — the db
  coverage tests structurally cannot, because their `before()` recomputes the allowlist over the
  new column. Precedent with both halves written out: `20271170068924_papic_uploads_open.sql:49-73`.

🪤 **Read the new column on its OWN round trip.** Naming an unknown column in the page's main
event select makes PostgREST refuse that query, and the page answers an unreadable event with
`notFound()` — turning a missing migration into **a live celebration rendering as missing**
(`studio/papic/page.tsx:284-303`, which records this happening).

---

## § 6 · The three surfaces

### 6a · The control centre — where the couple picks the number
`app/dashboard/[eventId]/studio/papic/`

- **Home: a `SettingRow` in “Set once, change any time”** (`page.tsx:1050-1108`). That section's
  own rule is that a choice made once becomes one quiet line opening a sheet
  (`_components/setting-row.tsx:7-30` — *"a row is a different DOOR to the same control, never a
  second copy of it"*).
- **The sheet**: presets **6 · 12 · 24 · 50 · a number of your own · No limit**. Shape it on
  `GuestCameraTierPicker`, whose docblock carries the rule *“CAPACITY COPY IS DERIVED, NEVER
  SPELLED”* — the shots-per-guest copy must render through the existing copy helpers, not a typed
  number.
- **Save path**: copy `setPapicUploadsOpen` (`actions.ts:407-431`) exactly — couple gate →
  **post the value, never flip what you last saw** (`actions.ts:414-416`) → admin-client update →
  `logQueryError` + `redirect(?x_error=…)` on failure → `revalidatePath` + `redirect(?x_set=…)` on
  success. Number validation copies `setCameraShots` (`actions.ts:1575-1582`) — **“a blank box is
  not zero.”**
- ⚠ **`shots_set` / `shots_error` are already taken** by `setCameraShots`. Pick new param names.
- ⚠ **Wire the outcome params THREE ways** — the searchParams type, the pass into
  `StatusBanners`, and the banner's bail-out. `_lib/outcomes-are-shown.test.ts` derives the list
  from the actions and fails CI on any one of the three; it exists because nine settings once
  saved into the void.
- ⚠ **The row must not render when it governs nothing** — an event whose guests cannot shoot grows
  no shots-per-guest row (`guest-cameras-choice.tsx:23-28` precedent).
- **Guards that will fire:** `outcomes-are-shown` · `a-row-is-a-door-not-a-copy` ·
  `nothing-was-lost-with-the-tabs` (a derived bill of 40 controls) · `the-required-act-is-first`.

### 6b · Papic inside the Event Hub — where the guest watches it run down
`app/[slug]/` and the guest camera

- The inline camera is **already mounted on the Event Hub** and already fed a quota
  (`site-body.tsx:1386-1400`, `_lib/loaders.ts:1105-1130`). It needs the new number, not a new
  component.
- 🚨 **There are TWO copies of the quota read** — the loader above and
  `app/papic/guest/page.tsx:182-227`. They have already drifted once (§ 1). **Resolve the
  allowance in ONE function and have both call it.** That single change is what stops § 1
  happening again.
- **The pill already exists** (`papic-guest-capture.tsx:1319`); it starts telling the truth as
  soon as the number is real.
- **Add the low state.** The guest camera has none — it goes straight from a number to
  exhausted. The seat camera's soft-stop is the precedent (*“Running low — about N shots left”*,
  `papic-seat-capture.tsx:673-675`).
- 🚨 **The refusal needs its OWN status.** Today `res.status === 409 || json.status ===
  'quota_exhausted'` collapses **pot-empty** into the per-guest congratulation
  (`papic-guest-capture.tsx:460-465`), so a guest who shot three photos can be told *“That's all
  150 photos”* — **and the buy panel opens, offering to sell shots that also cannot be taken.**
  The file's own docblock states the rule it breaks: *“A REFUSAL THAT REUSES ANOTHER REFUSAL'S
  STATUS CODE INHERITS ITS COPY”* (:443-455). The ceiling must answer with its own status,
  checked **before** the generic 409 branch, **in both the photo and the clip handlers** (:456-465
  and :725-770 are two copies).
- ⚠ **The offline queue re-spends later** (`enqueuePapicGuestCapture`, drain in
  `lib/offline/service-handlers/papic-drain.ts`) — a queued shot spends against the ceiling
  minutes after the counter moved. The counter is advisory; the function is the truth.

### 6c · The promotion page — what we are then allowed to say
`app/(shell)/papic/page.tsx`

- Only once 6a + 6b ship may the page make the claim. Until then it must not.
- The claim, in our own terms: *“Decide how many shots each guest gets — and whatever they don't
  use goes back to the room.”* The second half is the differentiator and it is the owner's own
  sentence.
- ⛔ Do **not** add an explaining line under the headline — the kicker/lede were removed by owner
  ruling 2026-08-19 (*“it just eats up space”*).
- Independent of this feature, and already drawn in
  `prototypes/papic_promotion_page_2026-08-28.html`: the 16-rung price wall cut to three, that
  block finally given a heading, and “Two ways to run it” moved above it.

---

## § 7 · ✅ THE DECISIONS ARE MADE — owner, 2026-08-28. Do not re-ask.

### 7a · Unused shares → **a button, plus an automatic release late in the night**

The couple can press **“open the rest to everyone”** at any time, and it also releases by itself
in the celebration's last stretch. So nobody is ever locked out of a pot that still holds shots,
and the couple keeps the early call for a room that is shooting hard at 9pm.

⛔ **The rejected option is worth recording:** sharing only among guests who have actually started
shooting was declined because **everyone's number shrinks as more people join** — someone shown 40
is later shown 12, possibly having already spent past it. **A number that gets worse on its own is
a broken promise.** Do not re-propose it.

**What the release opens:** the equal shares (tier 2) and the excess (tier 3). **Not tier 1** — see
7c.

### 7b · A guest's own bought shots → **BOTH, and the BUYER chooses**

> Owner, in his own words: *“both. they can claim it all or share it to everybody.”*

This is a third answer, not one of the two offered, and it is better than either. At the moment a
guest buys shots they pick:

| Choice | Where the shots land | Does the couple's limit cap them? |
|---|---|---|
| **Keep them for me** | That guest's own camera | **No.** Their money, their shots — they shoot past the limit. |
| **Add them to the celebration** | The shared pot | They go back to being an ordinary guest on the equal share. It is a gift to the room. |

✅ **BUILDABLE WITH A SHIPPED PRIMITIVE — nothing new.** `papic_dedicate_shots`
(`20271131476413`) takes a **TARGET, not a delta**, and its own header says why: *“lowering it IS
the inverse — there is no second function that could be forgotten, because giving and taking back
are the same call.”* So “add them to the celebration” is that same call in the pot direction, and
a buyer who changes their mind later can release the unspent part with it too.
⚠ **What can never come back is what the camera already SHOT** — the floor on any target is that
camera's own spend, and the refusal is explicit rather than a silent clamp. The buyer's screen
must say so.

### 7c · A named guest's unused shots → **hers stay hers**

Naming somebody means something: a specific allotment is **protected all night** and the release in
7a does not touch it. The person you named finds their shots waiting whenever they arrive.

⚠ **State the consequence honestly on screen:** if she never arrives, those shots go unused.
✅ **And there is already a way out** — the couple lowering her allotment returns the unspent part
to the pot, through the same target-not-delta call as 7b. **Nothing is ever permanently stranded.**

## § 7d · 🔴 THE OFFLINE RULE — added 2026-08-29 from the competitor research

The competitor deep-dive raises offline capture as an unanswered risk: *"If Controlled Shots
enforces its budget server-side, you will fail in exactly the provincial venues where you most
need to win."* Scene built offline-first deliberately; Philippine venue WiFi is unreliable.

✅ **WE ALREADY HAVE OFFLINE CAPTURE** — `enqueuePapicGuestCapture` +
`lib/offline/service-handlers/papic-drain.ts`. The research lists this as *not yet answered*; it
ships. **But the ceiling lands on top of it, and that is where the harm is.**

🚨 **A CEILING REFUSAL MUST NEVER BE A TERMINAL DRAIN ERROR, AND MUST NEVER BE UNREGISTERED
EITHER.** `PAPIC_TERMINAL_ERRORS` decides what happens to a shot already taken:

- **Unregistered** ⇒ it falls through to the queue branch and retries up to 50 times until the
  7-day TTL evicts it silently. The file's own docblock records the cost of exactly this, from
  2026-08-18: *"They finish the night believing they captured dozens of photos that do not
  exist."*
- **Registered as terminal** ⇒ the shot is thrown away. **The guest watched themselves take that
  photograph.**

⚖ **THE RULE: a shot already taken is honoured, even if it crosses the ceiling.** The ceiling
stops you TAKING more; it does not reach back and destroy one you already took. So a drained
offline capture is admitted above the ceiling, and the overshoot is bounded by what the phone
actually holds.

🔒 **The POT still binds** — that is the money gate and it is untouched. The ceiling is a
*fairness* rule between guests, and bending fairness for photographs that already exist is the
right direction to fail. ⚠ A crafted client could claim an ordinary capture is a drain; the
exposure is bounded by the pot, which is the only thing anyone pays for. Say this out loud in the
migration rather than discovering it later.

⇒ **S2 must decide the drain classification explicitly and test it.** A per-guest ceiling shipped
without touching `PAPIC_TERMINAL_ERRORS` is the 2026-08-18 defect with a new trigger.

---

## § 8 · Sequence — four PRs, in this order

| PR | What | Safe because |
|---|---|---|
| **1** | The number's home + `points_cost` + the function reading the ceiling + the conditional yield. **And § 1's fix: one resolver, so the screen and the server agree.** | **No celebration has a ceiling set**, so the gate is inert on merge — byte-identical to today except that the browser-only 150 stops lying. |
| **2** | The couple's control in the control centre. | Nothing is announced; the setting simply becomes choosable. |
| **3** | The guest's counter, the low state, and the honest refusal on the Event Hub + guest camera. | **Must land before anything is said publicly** — a limit a guest cannot see is the defect in § 1 wearing a new number. |
| **4** | The promotion page claim. | Only true after 1–3. |

⛔ **Do not merge 2 before 1** — *gate the write, not the button*
(`20271170068924:25-32`). A control that saves a number nothing enforces is the exact shape of
the `papic_uploads_open` defect this tree already paid for.

---

## § 9 · Proving it — and the four ways a test of this would lie

1. **The ceiling must be proved to BIND on a real pool event**, not merely to exist. Four limits
   on this exact surface have shipped governing nothing: the free tier was unmetered for weeks;
   `points_per_day` is NULL on every active tier; the per-guest 150 is yielded on every pool
   event; and `vendor_papic_capture_configs.photo_cap`/`clip_cap` have no reader at all.
   **A test that only asserts the column exists proves nothing.**
2. **`service_role` is `BYPASSRLS` in the PGlite replay** and tests largely run as superuser — a
   grant the migration forgot passes green. **Dry-run the migration against prod inside
   `BEGIN…ROLLBACK`** and put the transcript in the PR body.
3. **`relrowsecurity` is vacuous in the replay** — never pin this on an RLS-enabled assertion.
4. **The replay builds from repo files and prod can be stricter** — if any column is added with
   `IF NOT EXISTS` against a table that already differs in prod, a db test passes in the replay
   and proves nothing about production.
5. **Mutation-test every guard and PRINT THE OCCURRENCE COUNT before → after.** An unmeasured
   sabotage proves nothing, and this project has recorded three separate mutations that never
   landed and read as clean passes.

---

## § 10 · Traps, collected

1. A cap the browser enforces and the server does not (§ 1) — **the reason this build exists**.
2. Two copies of one rule; the drifted copy is the one nobody re-read when the model changed.
3. `409` reuse inherits another refusal's copy — **and opens a sales panel on a refusal**.
4. An `events` column is not done when it exists — grants, the host view, and the lint.
5. Never name a new column in the page's main event select.
6. Never take a ceiling from the caller.
7. Never add a fourth overload to a function with a signature-fallback ladder.
8. Rows are not shots — a clip costs up to eight.
9. `hidden_at` must never reset a meter.
10. `mode=web_copy` is not a capture.
11. The offline queue spends after the fact.
12. Dedicated credits are a floor; this is a ceiling. They are opposite semantics and must not
    share machinery.
