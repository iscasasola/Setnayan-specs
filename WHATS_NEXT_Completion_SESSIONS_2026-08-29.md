# COMPLETING THE WEBSITE — THE SESSIONS, THE MODEL, THE EFFORT

> **Owner 2026-08-29: _"as we clean up the last few builds, set all the plans we need to complete
> and make sure what we expect for the website to be, be complete."_**
>
> Companion: [`SETNAYAN_WHAT_THE_APP_OFFERS_2026-08-29.md`](SETNAYAN_WHAT_THE_APP_OFFERS_2026-08-29.md)
> — what already ships. **Read it before starting any session here**; three items on earlier
> versions of this list turned out to already exist.
>
> **Basis:** the shipped code on `origin/main`, the live production database and the live site, read
> 2026-08-29 across 47 capability questions plus a sweep of the whole route tree.

---

## 0 · THE SHORT VERSION

**Ten build sessions, plus four things that are not builds at all.** Most of it is smaller than it
looks — the product is already substantially complete. Only **two** sessions are real construction.

| | What a person gets | Model | Effort | Runs after |
|---|---|---|---|---|
| **P0-a** | Live Studio can actually start | — | — | **NOT A BUILD.** Owner re-authorises YouTube, then streams for 5 minutes. |
| **P0-b** | We know which features are switched on | — | — | **NOT A BUILD.** Owner reads the hosting settings. **Do P0-b before C1 and C4.** |
| **C10** | Our own notes stop being wrong | **Sonnet 5** | **medium** | any time · do it early |
| **C1** | Your family tree, drawn | **Opus 5** | **high** | after P0-b |
| **C2** | A venue says what kind of venue it is | **Sonnet 5** | **medium** | any time |
| **C3** | Photos remember who took them | **Opus 5** | **medium** | any time |
| **C4** | A business has a record, a page and a timeline | **Opus 5** | **high** | after P0-b · after C1 |
| **C5** | People in the 3D room look like themselves | **Opus 5** | **high** | after C3 |
| **C6** | A Cebu shop stops looking like a Manila shop | **Sonnet 5** | **medium** | any time |
| **C7** | The public copy stops being wedding-only | **Opus 5** | **medium** | after C6 |
| **C8** | Notifications finally have a subscriber | **Sonnet 5** | **medium** | any time |
| **C9** | Four small promises we do not keep | **Sonnet 5** | **medium** | any time |
| **P3** | The supplier journey proven end to end | — | — | **NOT A BUILD.** Run one real celebration. **After C1–C3.** |

🛑 **NEVER MORE THAN TWO SESSIONS AT ONCE.** Ten parallel builds once shipped 44 defects.

🚨 **AND THE MACHINE IS THE HARDER CAP.** With four other sessions typechecking, `tsc` has exited
**134 / 143 / 144 while printing `errors=0`** — a session under contention reads its own typecheck
as a pass. **Count the worktrees before you start**, raise the heap
(`NODE_OPTIONS=--max-old-space-size=8192`), and always print the exit code beside the error count.
**An empty tsc log is not a clean tsc log.**

### Safe pairs

✅ **C1 + C2** · **C1 + C6** · **C3 + C6** · **C3 + C7** · **C2 + C8** · **C9 with anything** ·
**C10 with anything**

⛔ **Never C1 with C4** — both rewrite the People area.
⛔ **Never C6 with C7** — both edit the public search surface; C7 depends on C6 landing first.
⛔ **Never C3 with C5** — C5 reads guest photos that C3 changes the writing of.
⚠ **C2 with C6 is possible but avoid it** — different columns, same supplier-profile surfaces.

---

## 1 · WHY EACH MODEL AND EFFORT

**The rule behind every row:** this repo's failure mode is *subtly wrong and green*. A guard that is
decoration, a read that returns empty because it was refused, a gate that admits one person too
many. Those are not caught by the work being hard — they are caught by suspecting yourself. So
**anything touching who may see what, personal data, or money gets Opus at high effort.** Mechanical
work with a written-down trap list gets Sonnet.

- **C1 is personal data about other people.** A derived kinship graph publishes relationships — who
  is whose godparent, whose child, whose tita. Getting the visibility wrong discloses a family
  structure the person never chose to publish, and the derivation is *unbounded by design* (owner:
  "yes tita can be most"), so the volume question is the renderer's judgement. **Opus 5, high.**
- **C4 is schema plus a new public-ish object.** A business record that opens automatically, gets
  its own page, and can be an event's subject — three pieces, a migration, and a new read path.
  **Opus 5, high.**
- **C5 is media of people.** An avatar maker touches face data, consent and storage in one build.
  **Opus 5, high.**
- **C3 stamps a value on every capture path.** Small in code, but "every path, not the ones somebody
  remembered" is exactly the shape this project keeps getting wrong, and a backfill is a
  point-in-time act that must not be cited later as ongoing coverage. **Opus 5, medium.**
- **C7 is public claims.** The judgement is what may NOT be said — the do-not-claim list is the
  whole job. **Opus 5, medium.**
- **C2 · C6 · C8 · C9 · C10 are mechanical with the traps written down.** **Sonnet 5, medium.**

---

## 2 · SHARED HEADER — paste at the top of EVERY prompt

```
Read the repo's own CLAUDE.md and the corpus CLAUDE.md first, then follow RULE 0: assume what you
are about to build already exists, and locate it before writing anything. On this stream RULE 0 has
already paid three times — "invite an off-platform supplier", "a supplier can only tap six fixed
messages" and "the camera screen says 3 cameras free to test with" were all reported as missing and
all already ship.

Working rules for this session, all of which have cost this project real work before:

1. Branch, then `git worktree add` IMMEDIATELY — beside the repo, NEVER in /tmp. A finished,
   proved change was lost that way on 2026-08-28 with zero commits ever made.
2. `pnpm install` in the worktree BEFORE running anything. A run in an uninstalled worktree means
   nothing.
3. `git fetch` before branching. Other sessions work this repo; origin/main moved three times
   during one planning session alone.
4. PUSH THE MOMENT IT TYPECHECKS. Do not batch a session's work into one commit at the end.
5. Typecheck with the exit code printed beside the error count:
   NODE_OPTIONS=--max-old-space-size=8192 npx tsc --noEmit -p tsconfig.json > /tmp/tsc.log 2>&1; \
     echo "TSC_EXIT=$?"; grep -c 'error TS' /tmp/tsc.log
   An EMPTY log is NOT a clean one — tsc exits 134/143/144 on abort and that reads as zero errors.
   Require TSC_EXIT=0 printed beside ERROR_LINES=0; either one alone is a lie. Never run two.
6. Require `# tests` to be NON-ZERO before believing any pass. Zero-tests-zero-failures is
   byte-identical to success and exits 0. A --test glob that matches nothing behaves identically.
7. Mutation-test every assertion you add and PRINT THE OCCURRENCE COUNT before → after. An
   unmeasured sabotage proves nothing. If a well-formed sabotage reports GREEN, suspect the
   sabotage before the guard.
8. Read the live object, never a migration comment or a docblock. A migration comment is not
   evidence; neither is a decision log.
9. Add a changelog fragment in changelog.d/ — never edit CHANGELOG.md or STATUS.md directly.
10. Auto-merge is the standing default: `gh pr merge <n> --auto --merge` right after creating it.
```

---

## 3 · THE SESSION PROMPTS

### C10 — our own notes stop being wrong · Sonnet 5 · medium

```
Correct eight claims in this project's own documents that were measured FALSE on 2026-08-29. This
is not housekeeping: wrong notes are what send a session to rebuild something that already ships,
which is the most expensive recurring mistake in this project.

Fix each at EVERY site, not one. Grep the whole corpus and the repo for the old wording — a
correction that lands in one file has not landed. The auto-loaded CLAUDE.md files come FIRST,
because they are the ones that get read.

THE EIGHT:
1. "0 orders ever placed" — FALSE. Six bills exist, FOUR ARE PAID and receipted (₱2,499 GCash ·
   ₱2,899 GCash · ₱147 GCash · ₱49 BDO), each with proof uploaded, hand-matched and a receipt
   issued. The most recent completed 2026-08-29. Money moves today.
2. "There is no way to invite an off-platform supplier onto Setnayan" — FALSE. createManualVendorInvite
   ships and is mounted in new-manual-vendor-modal.tsx, on the same screen where a couple adds a
   supplier by hand. What is true is that nobody has USED it.
3. "A supplier can only tap six fixed messages to the coordinator" — FALSE. stage-note-compose.tsx
   has a real textarea, placeholder "Hold the toast — the father is still parking."
4. "There is nowhere for a venue to say what kind of venue it is" — HALF FALSE. The venue_type
   column exists and is read by the public vendor profile API and Explore. Only the vendor-side
   WRITE screen is missing (that is session C2). Restate it correctly.
5. "The photo wall on the couple's page can never have photos in it — nothing picks them" —
   MISREADS THE DESIGN. ingestToWall is called from BOTH capture paths (app/papic/actions.ts and
   app/api/papic/guest-capture/route.ts). The wall fills automatically once screened. Nothing
   "picks" because nothing is meant to.
6. "The camera screen still says 3 cameras free to test with" — ALREADY FIXED. Only a comment
   describing the old fix survives.
7. "Real stories are wired to nothing" — FALSE. app/_components/frontdoor/data.ts calls
   loadPublishedShowcases(24); the home page is connected. Nothing real is PUBLISHED yet, which is
   a different statement.
8. THE PAPIC LADDER IN THE NOTES DOES NOT MATCH THE SHOP. CLAUDE.md records
   "100 ₱50 · 1,000 ₱500 · 3,000 ₱1,200 …". Production charges 100 = ₱70 (₱49 at sign-up),
   1,000 = ₱700 (₱490), 3,000 = ₱1,680 (₱1,176), up to 100,000 = ₱24,000 (₱16,800) — a rung the
   notes do not list at all. Replace the table with a pointer to platform_retail_catalog_v2 and
   the sign-up discount column; do NOT re-type figures that will go stale again.

DELIVERABLE: one PR editing documents only. No code. Add a line to DECISION_LOG.md recording that
these eight were measured and corrected on 2026-08-29.
```

---

### C1 — your family tree, drawn · Opus 5 · high

```
Build the screen that draws a person's family. The reasoning is ALREADY FINISHED — this session is
a renderer, not a system.

WHAT EXISTS: lib/kinship-derive.ts derives extended kin (lolo, lola, tito, tita, pinsan, pamangkin,
apo and the in-law terms) from the seven stored first-degree relations in person_connections. It
handles the Philippine courtesy model: a tito/tita arises TWO ways — BLOOD (sibling of a parent)
and COURTESY (parent of a friend) — and every derived relation carries a `basis` so the UI can tell
them apart even though the word is identical. It is unbounded by design (owner 2026-07-31: "yes
tita can be most").

THE DEFECT: measured 2026-08-29, kinship-derive.ts is imported by NOTHING except its own test. The
hardest thinking in the product reaches no screen. Today a person gets a LIST at
/dashboard/people, not a tree.

SCOPE:
- Render the derived graph on the People surface. Volume management is YOUR job, not the module's —
  it says so in its own docblock. Do not add a hop cap or closeness filter to the module.
- Blood and courtesy must be VISUALLY distinguishable. "My mother's sister" and "my mother's best
  friend" are both tita and are NOT the same fact.
- ONLY confirmed edges derive. A draft is private to its author; a pending claim is unanswered.
  Neither may appear.

⚠ GATES — CHECK BEFORE BUILDING, AND ASK IF UNSURE:
peopleConnectionsEnabled() defaults OFF and is COUNSEL-GATED (NEXT_PUBLIC_PEOPLE_CONNECTIONS). The
whole suggest→confirm flow is inert until the owner sets it. Production held ZERO person_connections
on 2026-08-29 — which may mean the switch is off, not that nobody wants it. Confirm the switch state
with the owner first (session P0-b); build behind the existing flag either way and do NOT widen it.

⚠ UGAT IS NOT THIS. lib/ugat/ and /admin/ugat are an admin map of the PLATFORM's data model. Do not
confuse them with a family tree.

PROVE IT: a person with blood and courtesy titas sees both, labelled differently. A draft edge and a
pending edge appear NOWHERE. Mutation-test each assertion with the occurrence count printed.
```

---

### C2 — a venue says what kind of venue it is · Sonnet 5 · medium

```
Give a supplier a way to set their own venue_type. Today only an admin can.

WHAT EXISTS: vendor_profiles.venue_type is populated by admins at app/admin/venues, and it is READ
publicly — by app/api/v1/vendor/profile/route.ts and by the Explore search. So a venue is described
to the public by a value it has no way to choose. Measured 2026-08-29: ZERO vendor-dashboard files
write it.

CONSEQUENCE TODAY: both live shops still claim they serve only ballrooms, gardens and heritage
houses, because that is the default nobody can change.

SCOPE: one write control in the supplier's own shop editor, using the same option vocabulary the
admin form uses — read it from there, do not re-type the list. Respect the existing locked-field
rules: check whether venue_type is in the immutable/locked set before assuming it is freely
writable, and if it is locked, route it through the existing correction-request path instead of
adding a second way to change it.

⚠ THE TRAP THIS FAMILY KEEPS SPRINGING: a Supabase select or update naming a column the table does
not have is REJECTED, NOT THROWN — PostgREST fails the WHOLE query and a `?? []` turns that into
"no rows". Verify the column name against supabase/migrations before writing the query, and assert
the error branch is handled.

PROVE IT: a supplier changes their venue kind and the public profile reflects it. A guard fails if
a second write path for the same column appears.
```

---

### C3 — photos remember who took them · Opus 5 · medium

```
Stamp captured_by_person_id on every Papic capture, then backfill.

THE DEFECT (from the 2026-08-26 audit — RE-MEASURE IT FIRST, this has not been re-checked since):
papic_photos.captured_by_person_id has a column, a partial index, and a reader that groups a
person's own-event frames by capturer — and reportedly has NEVER held a value in production. The
one-time backfill matched nothing because every photo postdated it. If that is still true, the
per-person folder feature has been grouping an empty set since May while looking exactly like a
feature nobody uses.

STEP 1 — MEASURE, DO NOT ASSUME. Count in prod: photos total, photos carrying a seat, seats whose
claimer resolves to a person right now, and photos carrying the value. Report the four numbers
before writing anything. If the value is now being written, STOP and say so.

SCOPE IF THE GAP IS REAL:
- Write it with a TRIGGER, not in application code. The value is a JOIN, not a decision — a trigger
  covers EVERY capture path, including ones nobody remembered. There are at least two
  (app/papic/actions.ts and app/api/papic/guest-capture/route.ts) and the supplier lane is a third.
- Then re-backfill.

⚠ A BACKFILL IS A POINT-IN-TIME ACT. Never describe it, in a comment or a doc, as ongoing coverage.
The trigger is the coverage; the backfill is one repair.

⚠ Dry-run the migration against prod inside BEGIN…ROLLBACK before shipping — the PGlite replay runs
as superuser and will not reproduce a grant or policy refusal.

PROVE IT: a new capture on each path carries the value. A db test asserts the trigger fires for a
path the application code does not touch.
```

---

### C4 — a business has a record, a page and a timeline · Opus 5 · high

```
Three connected pieces. Owner 2026-08-29 expects all three; measured 2026-08-29, none exist.

PIECE 1 — OPENING A SHOP CREATES ITS RECORD.
Today a business appears on the People page only if somebody types it in by hand: the only INSERT
into `dependents` is app/dashboard/(account)/people/dependent-actions.ts. Opening a shop
(app/open-shop) creates a vendor_profiles row and nothing else. Link them.

PIECE 2 — A DEPENDENT NEEDS A PAGE.
There is NO route for one anywhere — searched directly on 2026-08-29. A dependent is a row in a
list and nothing more. This is why a business has no timeline AND why a CHILD has none either.
Build the page once and both are solved. That is why this piece leads.
⚠ The "vendor timeline" that exists (lib/vendor-timeline.ts) is a DIFFERENT thing — a day-of lens
ranking which schedule blocks matter to a caterer vs a DJ. It is not a history. Do not reuse it.

PIECE 3 — A BUSINESS CAN BE AN EVENT'S SUBJECT.
events.honoree_dependent_id is only written for five personal types (debut, christening, birthday,
graduation, gender_reveal — lib/life-event-gate.ts). `corporate` and `gala_night` are live event
types with no way to name the business they belong to. Widen it, carefully.

⚠ THE ID IS CLIENT-SUPPLIED. lib/honoree-dependent-link.ts already documents this: the id arrives
from a hidden field / sessionStorage and can be forged, so it is re-read from `dependents` under an
explicit owner_user_id = caller predicate and anything that does not come back is DROPPED, never
refused. Keep that shape exactly — a cardinality refinement must never become a new way to fail at
creating an event.

⚠ GATE: dependentPeopleEnabled() defaults OFF and is COUNSEL-GATED (NEXT_PUBLIC_DEPENDENT_PEOPLE).
Only the PERSON kind can carry sensitive personal data (a child's birthdate, religion, sex); a
business and an item cannot. Build behind the existing flag. Confirm its production value with the
owner (session P0-b) before assuming the surface is dark.

PROVE IT: opening a shop creates exactly one business record and never a duplicate. A dependent page
renders for a business and for a child. A corporate event can name a business; a wedding still
cannot name one. Dry-run the migration against prod in BEGIN…ROLLBACK.
```

---

### C5 — people in the 3D room look like themselves · Opus 5 · high

```
Build the avatar maker. Measured 2026-08-29: it does not exist under any name — zero files, zero
routes.

WHY IT MATTERS: the 3D room is finished and good. Seated guests render as articulated figures at
their own seats, wearing outfits chosen deterministically per guest id (gown/filipiniana ·
suit/barong), tappable to see who they are, in a room whose colours, lighting and decor read the
couple's mood board. But every figure is a generic stranger, so the room reads as strangers at your
own wedding. This is the last piece.

WHAT ALREADY EXISTS AND MUST BE REUSED, NOT REBUILT:
- app/_components/plan3d/kit/ — the articulated figure kit, outfits.ts, instanced-seated-crowd.tsx.
- guest-avatar.ts already has preloadGuestPhotos and a GuestPhotoAvatar billboard.
- A stable per-guest hash (FNV-1a over the guest id) already keeps a guest's outfit consistent
  across renders. Any new choice must be stable the same way.
- NEXT_PUBLIC_FIGURE_CHIBI exists as a figure-style flag. Check what it does before adding another.

⚠ THIS IS MEDIA OF PEOPLE. Whatever a guest supplies, the consent posture must match the existing
face-enrolment rules: per-event scope, no cross-event reuse, revocable, and never required. Do not
invent a new consent surface — reuse the RSVP consent and the account face-profile flag
(NEXT_PUBLIC_ACCOUNT_FACE_PROFILE_ENABLED) rather than adding a third.

⚠ Do not couple this to C3. If C3 is in flight, wait — it changes how captures are written and this
session reads guest photos.

PROVE IT: a guest with an avatar renders as themselves in the room and on the invitation; a guest
without one renders exactly as today, byte-identical. Pin the fallback with a test.
```

---

### C6 — a Cebu shop stops looking like a Manila shop · Sonnet 5 · medium

```
Fix the location signal in the public vendor structured data. This is the single biggest weakness in
the SEO story.

THE DEFECT, measured 2026-08-29 at app/v/[slug]/page.tsx ~line 1719:

    areaServed: { '@type': 'Country', name: 'Philippines' }

EVERY shop declares the whole of the Philippines as its service area. A Cebu shop and a Manila shop
therefore send search engines an IDENTICAL location signal — for businesses whose entire value is
being findable locally.

SCOPE: publish the region each shop actually serves. The columns exist — location_city, hq_region,
and the tier reach radius. Emit a real service area from those, falling back to the country only
when a shop genuinely has none.

🔒 DO NOT TOUCH THE ADDRESS. It is city-level only, deliberately, for RA 10173 — the code comment
says so at ~line 1676. This session changes areaServed, not address.

⚠ Fail OPEN. A shop with no region must still render valid structured data with the country
fallback — never an empty or malformed areaServed, which is worse than a broad one.

PROVE IT: fetch two published shops in different regions from the live site and show the emitted
JSON-LD differs. A guard fails if areaServed is ever a bare hardcoded country for a shop that has a
region.
```

---

### C7 — the public copy stops being wedding-only · Opus 5 · medium

```
Rewrite the public positioning copy to cover the whole offer. RUNS AFTER C6 — both edit the public
search surface.

THE GAP: seventeen celebration types are live (wedding, debut, christening, birthday, graduation,
anniversary, gender reveal, reunion, wake, corporate, gala night, tournament, travel, date, hangout,
celebration, simple event) and the home page title still reads "Setnayan · Plan your Filipino
wedding free". lib/llms-txt.ts leads with weddings too. We rank for one thing while offering
seventeen.

SCOPE: app/page.tsx HOME_TITLE / HOME_DESCRIPTION and the hand-written PROSE in lib/llms-txt.ts.

🔒 DO NOT EDIT FIGURES IN llms-txt.ts. Every peso figure is RESOLVED FROM THE CATALOG at render
time, by construction, precisely so it cannot drift. Prose is hand-written; numbers are generated.
If a price looks wrong, the catalog is wrong, not the file.

⛔ THE DO-NOT-CLAIM LIST — this is the judgement that makes it an Opus session. None of these may
appear in any public copy:
  · a public feed or social channel (no code)
  · a business having its own page or timeline (no code)
  · an avatar maker (no code)
  · a drawn family tree (written, reaches no screen)
  · affiliate recommendation pages (no code)
  · any real published story — EVERY showcase is a labelled sample
  · multi-camera Live Studio — finished but cannot start until YouTube is reconnected (P0-a)
  · the word "commission" for the booking fee, ever
  · any latency or speed figure — nothing measures one
  · per-guest photo limits — unbuilt, and a rival has them

✅ llms-txt.ts ALREADY HAS the right discipline: an "Out of scope to advertise here" section that
deliberately withholds unshipped surfaces so AI assistants are not sent to dead links. KEEP AND
EXTEND IT with the list above.

PROVE IT: a test asserts none of the do-not-claim strings appear in the rendered output, and that
the generated figures still resolve from the catalog rows rather than literals.
```

---

### C8 — notifications finally have a subscriber · Sonnet 5 · medium

```
Ask for notification permission at the QR scan.

THE DEFECT: web push is BUILT AND MOUNTED — PushToggle on the profile page, emitNotification wired
into 108 call sites across 61 files, /api/notify sending via web-push and VAPID, push_subscriptions
in production with ZERO rows. Nothing ever asks at a moment anyone would say yes.

⛔ DO NOT SCOPE A PUSH BUILD. It exists. This session is the ASK, not the plumbing.

SCOPE: the guest QR-scan / seat-claim moment is the best permission prompt this product will ever
get — the person has just physically chosen to engage. Add the ask there, once, gracefully
declinable, never blocking the thing they came to do.

⚠ Confirm the VAPID keys are set in the hosting environment BEFORE claiming this works. The route
only WARNS and continues when they are missing, so a broken setup looks exactly like a working one
with no subscribers. If they are not set, say so and stop — that is an owner action.

⚠ A DECLINED PERMISSION IS PERMANENT in most browsers. Ask once, at the right moment, and never
re-prompt in a loop.

PROVE IT: one real subscription row exists in production afterwards. Zero rows means it did not
work, regardless of what the code says.
```

---

### C9 — four small promises we do not keep · Sonnet 5 · medium

```
Four unrelated small fixes, safe to run alongside anything.

1. THE HOST CANNOT SEE WHO HOLDS WHICH CAMERA. Four Papic seats say "Claimed"; none says a name.
   The claimer resolves to a person — show it. (Check paparazzi_seats.claimer_user_id and the
   person resolution the capture path already does.)

2. THE HOST STILL GETS THE STRANGER'S VERSION OF THEIR OWN EVENT PAGE in places, so /[slug] can
   tell the couple to "scan your invitation QR" — which they are the ones sending. The owner ribbon
   and an owner body-copy branch already ship (lib/owner-ribbon.ts, site-body.tsx); find the
   remaining stranger strings on the host path and branch them. VERIFY THE DEFECT STILL EXISTS
   FIRST — it was partly fixed in PR #4483 and this line has been stale before.

3. THE COMPLIANCE PACK SAYS THE PHOTOS SIT IN THE PHILIPPINES. They do not. The database is
   Supabase Singapore; object storage is Cloudflare R2 Asia-Pacific. NOTHING is hosted in the
   Philippines. Four rows in the NPC pack still say otherwise. Correct them — this is a regulator-
   facing document.

4. WHILE YOU ARE THERE: the live /privacy page was measured HONEST on 2026-08-19 and must stay
   that way. Do not "fix" it to match a stale note; read it first.

PROVE IT: each of the four separately, with the occurrence count before → after.
```

---

## 4 · THE FOUR THINGS THAT ARE NOT BUILDS

### P0-a · Reconnect Live Studio to YouTube — **owner, half a day**
The machinery is complete. The YouTube grant was **revoked 2026-07-26** and never restored, so the
one thing we sell that cannot start is this one. Re-authorise, then actually stream for five
minutes. **Until that happens, do not sell it and do not put it in public copy.**

### P0-b · Audit which switches are on — **owner, one hour**
**33 switches default to off in the code, and the code default tells you nothing about production.**
The live sign-in page shows Google and Apple sign-in and both default off — so things have been
turned on without the code recording it. The values are read on the server, so they never reach a
browser and no session can read them.

**Check and write down at minimum:** `NEXT_PUBLIC_DEPENDENT_PEOPLE` · `NEXT_PUBLIC_PEOPLE_CONNECTIONS`
· `NEXT_PUBLIC_LIFE_STORY` · `NEXT_PUBLIC_PANOOD_STREAMING_ENABLED` · `NEXT_PUBLIC_SMART_SORT_ENABLED`
· `NEXT_PUBLIC_BOOKING_FEE_ENABLED` · `SUPPLIER_NIGHT_BEFORE_EMAIL_ENABLED`.
**C1 and C4 both depend on this answer.**

### P3 · Run one real celebration, end to end — **after C1–C3**
> **This is the spine. Everything else serves it.**

Create the event, invite guests, take RSVPs, find a supplier in the marketplace, send the enquiry
**with the requirement sheet attached**, negotiate a price in the chat, build a written amendment,
lock the booking, let the supplier agree, record a deposit, run the day, take photos, produce the
recap, publish the story.

**That single run exercises seven things that have never been used once:** the chat (0 messages
ever), the negotiation tools, the 276 requirement sheets (0 filled), the supplier's day-of desk (0
real bookings), the booking fee (0 charges), the deposit record, and the release handshake. **Expect
bugs — untested paths always have them.** That is the point of running it before a stranger does.

### P4 · Four decisions only the owner can make
1. Do the public category words change? Today they are our internal ones — *Look, Feast,
   Documentary, Booths*. Nobody types those.
2. Do wedding recordings stay on a channel forever, or get wiped when it is reused? **Our own
   specs say both.**
3. The two privacy sign-offs for guest photo-taking, which is selling now.
4. Does the ~450-cell supplier tier grid stay, now that each plan states what it adds?

---

## 5 · WHAT IS DELIBERATELY NOT ON THIS LIST

**Under-the-floor debt.** Most of the database still grants a read permission nothing uses, and the
browser protection watches without recording. No harm today. Worth doing, never worth doing first.

**The desktop application.** A real Tauri shell at version 0.0.1 that nobody has touched in months.
Either a deliberate later bet or dead weight — decide, but not now.

**A public feed, and affiliate recommendation pages.** Both genuinely unbuilt, both **product
decisions rather than backlog**. A feed in particular is a different product with its own moderation
burden. Give each an explicit yes or no so they stop appearing as open gaps on every audit.

---

## 6 · HOW TO KNOW THIS IS FINISHED

The website is complete when **all four of these are true at once**:

1. A stranger can complete the whole journey — plan, book a real supplier, pay, run the day, get
   the photos, read the story — without hitting anything that does not work.
2. Nothing on the public site claims something that is not built.
3. Every switch's production value is written down where a session will find it.
4. Our own notes agree with the code. *They were wrong eight times on 2026-08-29 alone.*

⚠ **This file will rot at the same rate as every register before it. Re-verify before acting on any
line — and treat this sentence as applying to itself.**
