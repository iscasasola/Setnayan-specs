# WHAT'S NEXT — THE EVENT HUB IS A SUPPLIER'S ON THE DAY · AND THE ANSWERS DESK

> **Status: PLAN ONLY. NOTHING IN PART 3 IS BUILT.**
> Owner, 2026-08-26: *"do not start building. we will do this on what's next. just plan for now."*
> Everything in Part 1 is measured against `origin/main` (`de0c557e3`) this session.
> Part 3 is filled from a seven-reader mapping run whose every finding was handed to an
> independent reader told to disprove it.

---

## 0 · THE OWNER'S RULINGS — do not re-ask any of these

| Date | Verbatim | What it settles |
|---|---|---|
| 2026-07-02 | *"transfer the whole content of my service under the how you're doing row … make it more manageable"* | **My Services is NOT a menu.** He chose *"fully retire everywhere"* over keeping it for staff, knowingly. |
| 2026-07-12 | *"overview, my shop, my customers, my performance, BEO are all 1-page each with the different features integrated on that page"* | **Five rooms, one page each.** |
| 2026-08-16 | *"where the event proper runs. not the preparation. this is where we share information to the guests, **vendors**, etc. where we collect photos, and use different services, this is where we have the papic and live studio."* | The Event Hub's audience **names vendors** — it always did. |
| 2026-08-26 | *"we also want to rearrange the vendor dashboard to be easy to manage for the vendors. where they have customers, responses to requests, setting up their shop, setting up their services, performance analysis"* → on the drawing, *"yes i agree."* | The re-sort. **SHIPPED — see Part 2.** |
| 2026-08-26 | *"event hub is the same on the day for vendors plus their special features. since everything will be communicated there"* | **A supplier's On the Day IS the Event Hub, plus their own tools.** This is the build. |
| 2026-08-26 | *"do not start building. we will do this on what's next. just plan for now"* | This document. |

🔑 **THE SECOND-TO-LAST RULING IS NOT A REVERSAL — IT IS THE HALF THAT WAS NEVER FINISHED.**
His own 2026-08-16 lock named vendors as one of the hub's audiences. What shipped gives a
booked supplier a one-line strip that sends them **away** to their own dashboard, and that
strip has **never rendered for anybody**. There is nothing to unpick.

---

## 1 · WHAT SHIPS TODAY — measured this session, not inherited

### 1.1 The shop dashboard

| | |
|---|---|
| routes under `/vendor-dashboard` | **63** |
| …that are pure forwards into a hub | **17** |
| real surfaces | **46** |
| menu destinations, identical on laptop and phone | **5** |

**The five keys are `overview · customers · shop · performance · on-the-day`** and they are
read by **four** systems: the staff role filter, the `vendor.sidebar.<key>` rename registry,
the per-section localStorage, and the badge map. **Three of the four fail silently.**
⚠ **The registry LABEL wins over the code's** — the rail replaces its own word with the
registry's whenever a slot exists, so a half-rename shows one word on a fresh deploy and
another when the registry read fails.

### 1.2 "Event Hub" is not a word this dashboard uses

**Measured: the string "Event Hub" appears ZERO times anywhere under `app/vendor-dashboard`.**
So the ruling creates a name where there was none — it does not collide with one.

🔴 **THE LINK RUNS ONE WAY.** `app/[slug]/_components/vendor-doorway.tsx` — whose own docblock
calls itself *"a door, not a room"* — points a booked supplier **out** of the couple's page
and into their own dashboard. **Nothing in the shop dashboard points back at `/{slug}`.**
Grepped: the only vendor-side links carrying a slug are recaps, real-stories, creators, the
shop's own website and the shop's own address — never a client's event page.

### 1.3 On the Day is genuinely a day-of room

It renders **"No event today"** when there is not one. The per-event **preparation** already
lives somewhere else — under the customer, at `clients/[eventId]/{production-sheet, seat-plan,
mood-board, cocktail, challenge-photos, editorial-media}`.
⚠ This matters for Part 3: whatever "the hub is the On the Day" means, it must not strand the
preparation surfaces, which are used for months before the day.

### 1.4 The answers a supplier owes — fourteen kinds, six doors

**SIX card kinds sit on the landing page today** (`WhatsNewCard` in `lib/vendor-overview.ts`):
new inquiry · a couple wants to book you · a couple wants this celebration removed · a deposit
to confirm · a new review · a dispute. **Five of the six need an answer; a 5-star review does
not.** Five answer **inline** — the booking-request card renders a real *Agree to this booking*
button, a *Can't take this booking?* decline box with a reason field, and the fuse
(*"4 days left to answer"*).

🚨 **EIGHT MORE ANSWERS ARE NOT IN IT AT ALL**, each with a real action already shipped:

| The answer | Where it lives today |
|---|---|
| a paid crew gig | My Shop → Manpower |
| a partnership invite from another shop | My Shop → More tools → Partnerships |
| an extra-headcount surcharge | inside one individual message thread |
| confirming a payment a couple says they sent | inside one individual message thread |
| a proposal reply | My Shop → Proposals *(My Customers → Proposals after PR #4863)* |
| choosing who gets a waitlisted date | My Customers → Availability & capacity |
| a request on the day | On the Day → requests inbox |
| a song request at the reception | On the Day |

**Fourteen kinds of answer, six doors, two to four taps deep.**
⚖ **And we publish every shop's reply speed on their public marketplace card** while giving
them no one place to be fast in. That is the argument for the desk, in one line.

### 1.5 The block is a news name on a to-do list

It is called **"What's new"**. It mixes five things waiting on you with one that needs nothing
back. It carries **no count in the menu** and **has no page of its own**, so an answer scrolled
past yesterday has nowhere to fall back to.

---

## 2 · WHAT SHIPPED TODAY — do NOT rebuild it

**PR [#4863](https://github.com/iscasasola/setnayan-platform/pull/4863)** — the re-sort the
owner approved. ⚠ **Verify its state with `gh pr view 4863 --json state,mergedAt` before
trusting this line; this project's own register has been wrong about a PR's state four times.**

Overview → **Today** (all five places it is written, registry included) · **My Customers moves
ahead of My Shop** · **Contracts + Proposals move into My Customers** · **Your services opens
FIRST on My Shop**, above verification, with Packages moved to stay beneath it · **the 14 tools
sit on three named shelves** (What couples see · Working with others · Protection), every href
byte-identical · **"(BEO)" leaves the menu**.

🚨 **TWO SURFACES WERE ALREADY IN TWO PLACES AT ONCE.** The phone bar has lit **Customers** for
`/contracts` and `/proposals` all along while the laptop rendered them under **My Shop** — one
question, two answers, depending which screen you were holding. The same was true of "(BEO)",
which the rename registry never said. **This ended both rather than starting either.**

**New guard:** the code and the rename registry must NAME each row the same — derived from both
sides, with a floor of five so a renamed slot key cannot empty the loop and report a pass.

**Traps paid for, worth more than the change:**
- 🪤 `npx tsc` **aborts at exit 134 (OOM) while printing `errors=0`**. The repo's own script sets
  `--max-old-space-size=7168`. **Print the exit code beside the error count.**
- 🪤 Under `tsx --test`, an `@/lib/…` import of the nav registry hands back a module with **empty
  named exports**, so a new guard's loop ran zero times and reported a pass. The floor caught it;
  a relative import fixed it.
- 🪤 A single `deepEqual` pinned the owner-locked key SET and the re-cuttable rail ORDER together,
  so a legitimate re-order read as a lock being broken. **Split in two.** That is how a real guard
  gets weakened by somebody in a hurry.
- 🪤 `lint-port-no-lost-controls` caught the two moved surfaces. Its baseline was regenerated per
  its own instruction and **read line by line — 4 insertions, 3 deletions, zero real removals
  absorbed.** A baseline is a bill, not a decision.
- 🪤 **Another session works this repo concurrently.** `origin/main` moved three times in one hour
  and the branch went CONFLICTING on a generated file. `git fetch` and read the tip before building.

---

## 3 · HOW THIS PLAN WAS MADE, AND HOW MUCH TO TRUST IT

Seven readers mapped one slice each against `origin/main` (`de0c557e3`). **Every finding was
then handed to an independent reader told to REFUTE it**, defaulting to refuted when it could
not be confirmed from the code. **17 claims did not survive.** A build plan was written from
the survivors, then a completeness critic was set on the plan itself with one job: find what
everybody missed. **47 agents, 0 errors, 0 empty results.**

⚖ **EVIDENCE GRADE — read this before acting on any line.** The critic re-opened a sample of
the plan's citations and reported them accurate: *"The plan's citations are accurate — I
spot-checked six and all held. The failures are of COVERAGE, not accuracy."* So the file:line
references below are reliable; **the plan's completeness was not, and § 3.4 is the correction.**
Nothing here has been run, and nothing here is built.

---

## 3.1 · THE SHAPE — what the ruling means in this codebase

**The Event Hub grows a supplier's own ROOM inside it, and that room IS the day-of console —
at the event's address instead of the shop's.**

The product already does exactly this for guests: on the day, a guest opens the couple's one
address and a chip appears that takes them into a full-screen room, with its own chrome, which
simply is not there before the day or after it. **A supplier's room is the same idea for a
different person.** Today the strip a booked supplier sees says *"You are booked here"* and
points them back OUT to the shop dashboard. On the day, that strip stops pointing away and
becomes the door into their own room: the running order, the headcount, their cues, their kit.
**The couple's page itself does not change by one line.**

### Two shapes were considered and rejected — the reasons matter more than the verdict

⛔ **Move the console into the couple's page body.** That page is already two pages in one — a
stranger's version and an invited guest's — and a supplier is a third thing on top of *either*.
Folding a working surface (a clock, a running order, controls, a floor log) into the page body
makes it three pages: **the redraw-per-role mistake this project has already paid for.** Worse,
it drags a supplier's private working material into the same file that renders for strangers.

⛔ **A "supplier version" of the couple's page.** Same failure one level up, and it breaks the
rule the page is actually built on: **a person can be the couple's cousin AND their florist.**
The page handles this correctly today by adding a supplier LAYER on top of whichever version
they already get. Turning that layer into a third version throws away the one thing that works.

### What stays in the shop, deliberately

The list of a supplier's OTHER weddings is a list of **other couples** — it has no business on
one couple's page. And the months of preparation — the production sheet, the seat plan, the
mood board, the shot list built in advance — **is not the day.** Only the day moves.

---

## 3.2 · THE SLICES — ordered, smallest first

> ⚠ **Read § 3.4 before starting any of these.** Three of them are wrong as written.

| # | What a person can do after it | Order |
|---|---|---|
| **S1** | A supplier the couple only SHORTLISTED stops being told *"You are booked here"* and handed a link that then refuses them | must precede S3, S4 |
| **S2** | A second shooter on a booked shop stops meeting the *"scan your invitation QR"* lock screen | must precede S4 |
| **S3** | Opening a client's address tells a supplier whether today is their day, and where the door goes | — |
| **S4** | **THE ROOM.** On the day, a booked supplier opens the couple's address and lands in their own working room | must follow S1, S2 |
| **S5** | The Launch button and the shop's live console lead to the same room — one address to keep working | must not merge before S4 |
| **S6** | The tool pills on the shop's landing page agree with the room about which kit is on | — |
| **S7** | The clock says one thing instead of three | — |
| **S8** | **THE ANSWERS DESK.** One list of every answer a supplier owes anybody, oldest first | independent — can run in parallel |
| **S9** | Two answers that today do nothing are repaired BEFORE they are given a row | must precede those rows in S8 |

🛑 **THREE OF THESE NINE ARE WRONG AS WRITTEN, and the correction is inline so nobody reads the
table without it:**
- **S4 is incomplete twice over.** Its day gate re-implements the multi-day defect the same plan
  names as a trap (§ 3.4 · 10), and its copy guard cannot fire on the components it reuses
  (§ 3.4 · 3). **S4 does not ship until both are answered.**
- **S5 is unsafe as scoped.** It strands the hired night crew (§ 3.4 · 2), orphans the photo route
  (§ 3.4 · 8), and re-points **one** revalidation site when there are **seventeen**, one of them
  on the couple's own screen (§ 3.4 · 7).
- **S3 has no counterpart for the far-away booking** — it adds a date line and never says what the
  doorway link does on an event months away (§ 3.4 · 5).
- ⚠ **And no slice at all delivers the headline** (§ 3.4 · 1): **no screen in the product shows a
  supplier their client's event address.** The door is its own slice and it does not exist yet.

### 🚨 S1 IS A LIVE DEFECT TODAY, WITH NO FLAG IN FRONT OF IT

`resolveVendorCapability` (`app/[slug]/_lib/site-identity.ts:274-289`) denies only *"no account"*
and *"no row"*. **It never calls `vendorBookingIsCommitted`, which sits twelve lines above it**
(`:259-262`). `loadVendorBooking` (`_lib/loaders.ts:298-305`) prefers a committed row and then
falls back to `usable[0]`; its own docblock at `:242-251` names the gap and points at the private
gate as the ONE caller that asks. `page.tsx:553-554` is that caller. **`page.tsx:748-752` is the
second caller and does not ask.**

🔑 **THE MAPPER SCOPED THIS TO A FEATURE FLAG AND WAS WRONG.** There is a **fourth writer and it
is ungated**: `20270227551916_money_proposal_accept_pax_rebaseline.sql:102-120` inserts
`linked_vendor_profile_id` at `status = 'shortlisted'` inside `respond_vendor_proposal`, granted
to `authenticated`, called from `vendor-dashboard/proposals/actions.ts:249` with no flag check.
**A couple accepting a quote mints exactly the row this defect needs.**
🪤 **Why it survived:** `app/[slug]/_lib/vendor-private-admission.test.ts:86-160` only ever feeds
`'contracted'` or `null`. **A test that never supplies the dangerous value cannot fail on it.**

### 🚨 S2 — THREE OBJECTS ANSWER ONE QUESTION DIFFERENTLY

| Object | Who it admits |
|---|---|
| `app/[slug]/_lib/loaders.ts:276-279` | `vendor_profiles.user_id` **only** — while its own comment at `:275` says *"owns or administers"* |
| `20271144258091_lock_handshake_slice_b.sql:69-77` | owner **∪ `vendor_team_members`** |
| `on-the-day/live/[eventId]/page.tsx:130-170` | owner ∪ team ∪ **`vendor_event_access_grants` grantees** |

Grep for `vendor_team_members` under `app/[slug]/` returns **zero**. Team-seat inserts are real
and reachable (`vendor-dashboard/team/actions.ts:136`). ⚠ **The loss is wider than a lock screen:**
`page.tsx:863-866` gates the stories-about-this-day block on the same capability, so a team member
loses it on a **public** event too.

### S4 — the room's gate, in order

A new route `app/[slug]/desk/page.tsx`, sibling of `app/[slug]/hub/page.tsx`. **Copy the gate
ORDER, not the body:** load the event shell → `notFound()` · committed-only capability → **redirect,
never a message** (a stranger must not learn the room exists) · booked-today gate · `noindex,nofollow`.

**Reuse, do not copy:** the run-of-show header (it already subscribes to live schedule changes),
the module resolver, the specialization slot, and the headcount from the brief RPC. **One console,
two addresses.**

🔒 **Event data comes from `get_vendor_event_brief` or from RLS-bound reads under the supplier's
OWN session — never from an admin client.** See Trap 1; this is the single most important line
in the plan.

⛔ **Do not mount the vendor arm of `resolveSiteNav`.** `app/[slug]/_lib/site-nav.ts:56-65` already
models a `{kind:'vendor'}` case with an owner ruling behind it and **zero production callers** —
and as written its supplier slots resolve to in-page anchors that exist **only in the guest tree**.
**Wiring it as-is ships dead taps.** ⚠ And `site-nav-vocabulary.test.ts:8-10` claims that resolver
has *"zero production consumers"* — **it has two.** Correct that docblock or the next reader
deletes the module.

---

## 3.3 · THE ANSWERS DESK — which of them join the list

One list, across all of a supplier's weddings, **sorted by who has waited longest, with the age
on every row** — which is what the six-card feed already does.

### The six already there

| | What it is | Shape | Where it answers |
|---|---|---|---|
| 1 | A new enquiry | fact | on the row — already correct |
| 2 | A booking ask | fact to agree; turning it down asks why | already correct |
| 3 | A couple asking to remove a celebration you were paid for | **judgement** | keep both buttons (the owner ruled only the supplier can release it) — but **the row must say what disappears**, not just ask |
| 4 | Confirm a downpayment | fact | on the row — already correct |
| 5 | A five-star review with no reply | needs words | 🔴 **bring the reply box ONTO the row.** Today it only links away, so the list can say a review is unanswered **and cannot take the answer** |
| 6 | A delivery a couple flagged as late | judgement | a sentence and a way in — already right; give it the sentence |

### The ten elsewhere — and only four of them may join

| | The answer | Verdict |
|---|---|---|
| 7 | Another shop wants to name you their partner | ⛔ **Sentence and a way in, never a fast button.** Saying yes publishes a claim about **the other shop's prices** to the public, and the terms then freeze — changing your mind takes the badge down and needs them to agree again |
| 8 | Somebody says they paid you | ✅ **joins — after S9.** A fact: money either arrived or it did not. But only once the row carries the **receipt image** and there is a **second button**. Today the only possible answer is *"yes I got it"*, and it cannot be undone |
| 9 | The guest count moved, so your price may move | ⛔ **Stays in that couple's thread.** The number **is recomputed the instant you press**, not when the row was drawn — and **nothing records when it began waiting**, so it cannot honestly sit in a list ordered by who has waited longest |
| 10 | A quote you wrote and never sent | ✅ joins as a reminder that **opens the quote — never a Send button**: sending **retires any other live quote** you have out with that couple. ⚠ A quote can also be created-and-sent in one step from a chat thread, so a drafts list is **blind to that lane** — say so rather than implying the list is complete |
| 11 | A contract you drafted and never sent | ✅ same shape, same treatment; move it off the separate open-task list |
| 12 | A couple asking you to re-quote a past booking | ✅ a price ⇒ a small box; declining is a fact. **Only exists while that feature is on — and until then it must draw NOTHING**, not an empty section that reads as broken |
| 13 | Somebody waiting on a date you are booked out on | ⛔ **Neither answer joins.** *"Pick this couple"* **does nothing at all today and reports success**; *"a slot opened"* emails **every** queued couple at once, cannot be undone, and never checks whether the date is actually free |
| 14 | Something on the floor tonight | ⛔ belongs in the room at the event; only the booked coordinator can answer one |
| 15 | A song a guest asked for | ⛔ belongs in the room — and **nobody can ask yet.** The two ways a guest would submit one exist in the database and **nothing in the product calls them.** A row would be a promise the product cannot keep |
| 16 | A paid crew shift on an event you are already working | ⛔ **does not join at all.** It cannot be posted, cannot be seen and cannot be accepted by anyone who is not a Setnayan admin — **the database refuses all three, silently.** A row would be a door onto nothing |

### 🆕 The two nobody counted — found by the critic, absent from every map

| | The answer | Verdict |
|---|---|---|
| 17 | **A couple proposed a MEETING time** | ✅ **joins.** Real rows, inserted by the couple's own screen, which **already emits a notice saying *"confirm or propose a new time"***. ⚠ Its deadline is **the meeting itself passing** — a **fifth time-box shape** the four below have no slot for. A tasting that already happened must not sit in a list ordered by who waited longest |
| 18 | **An unanswered message in an ACCEPTED thread** | ✅ **joins — and it is probably the most common row of all.** The desk's enquiry lane is **pre-accept only**, so a reply owed to a couple you have already booked appears nowhere. 🔑 **This is the exact thing the product measures and publishes as that shop's reply speed.** A list called *every answer you owe* that omits it is not that list |

🚨 **AND ROW 5 IS NARROWER THAN IT LOOKS: a ONE-STAR review can never reach the desk at all.**
The filter is *five stars **and** no reply*. **The review that most needs an answer is excluded by
construction** — and repairing the row cap makes the desk *look* complete while that stays true.

### What the list does when a window closes

- **The booking ask — seven days.** When it lapses the row **must not vanish**; it is replaced
  *in the same place* by one line saying it lapsed and what happened, for about a week.
  🔑 **A row that simply disappears reads as one you answered.**
- **Tonight's floor items and song requests — one day.** They appear only while the room is open.
  After that: a closing line and **no button** — *a button to a screen that cannot open is worse
  than no row.*
- **The waitlist — soft.** Today as the floor; a date that has passed reads *"this date has
  passed"*, never an offer to email people about a day already gone. ⚠ One screen today hides past
  dates and another **still offers exactly that email**.
- **Everything else has no clock at all.** The age goes on the row; oldest first.

---

## 3.4 · 🛑 WHAT THE PLAN GOT WRONG — read this BEFORE § 3.2

A completeness critic was set on the plan above with one job: find what every mapper missed.
**It found twelve gaps. Three of them break the plan's headline outcome.** They are recorded
here, not silently folded in, because *how* a careful plan came out wrong is worth more than the
corrections.

### 🔴 1 · THE ROOM HAS NO DOOR — the plan's own headline is produced by no slice

The shape sentence is *"a booked supplier opens the couple's address and lands in their own
working room — **without ever going to the shop dashboard**."*

**Grepped: no supplier surface anywhere in the product reads or renders a couple's event slug.**
One hit in the whole vendor tree, and it is a comment about the shop's own address. **A supplier
cannot reach a client's event page from inside Setnayan at all.**

⇒ Between S4 and S5 the room is reachable only by typing an address the supplier has never been
shown. After S5 the **only** three doors are all on the shop dashboard — so the console is still
entered from the shop and only its final URL changed. **The stated outcome is not delivered.**
⚠ Also: `events.slug` is **NULLABLE** (the unique index is `WHERE slug IS NOT NULL`), and the plan
defines no behaviour for a booking on a slugless event — the redirect stub has nowhere to send them.

### 🔴 2 · S5 SILENTLY REVOKES THE CONSOLE FROM THE HIRED NIGHT CREW

The live console admits a **third** population the plan defers and then strands: a **grantee**,
resolved through the day-of access grants. S2 says the grantee path *"is worth nothing until the
room exists"*; S4 never adds it; S5 turns the old route into a stub. **Net effect: the hired night
crew is redirected to a room that refuses them and lands on the couple's page as a stranger.**

Three things make it worse than an ordering slip:
- **The grant is created from inside the console being moved.**
- **The grantee path structurally requires an admin read** — a grantee cannot read the granting
  shop's profile under their own permissions, *because the grant IS the authorization.* So
  **Trap 1's rule forbids a slice the same plan promises.** One of the two has to give.
- `get_vendor_event_brief` resolves its caller as owner ∪ team **only**, and raises otherwise —
  so **a grantee's brief is already null today**, and the plan's *"headcount from the brief"*
  assumes it answers for everyone it admits.

### 🔴 3 · THE GUARD THE PLAN BUDGETS FOR CANNOT FIRE — THE ROOM SHIPS "THE COUPLE" AT A FUNERAL

The plan budgets exemption lines for the guard that stops guest-facing copy saying *"the couple"*
at a wake, noting it *"recurses every subdirectory"*. **It recurses `app/[slug]` and nothing else.**

The couple-worded strings the room will render live **outside** that tree — *"the couple has not
built their timeline"*, *"Following the couple's program"*, *"The couple hasn't published their
seating plan yet."* And the plan's own instruction is **"reuse, do not copy"** those components.
**Imported files are not in the scanned set, so the guard cannot fire on them and cannot even be
exempted for them — there is no bill line to write.**

⇒ **The room renders "the couple" at a wake, a birthday and a graduation, and every check stays
green.** This is the exact failure that guard exists to prevent, in the one change that mounts
vendor copy inside the guest tree. **A guard the plan treats as a cost is actually a hole.**

### 🔴 4 · THE ASKED-BUT-NOT-AGREED ANSWER IS WRONG IN BOTH DIRECTIONS AT ONCE

The plan says an asked supplier *"sees what they see today — the strip pointing back to their
shop, where they can say yes or no"*, and that the asking path never stamps the link.
**Both halves are false, and they are false in opposite directions:**

- The ask writes only the three request columns and **deliberately does not stamp the link** the
  strip reads ⇒ an asked-only supplier gets **no strip at all**, and on a private event is refused
  outright. **4 of 6 prod events are private.**
- But the ordinary route to an ask is a money proposal the couple accepted — and that stamps the
  link at `'shortlisted'`. That supplier **does** have a strip today, **and S1 takes it away.**
- The strip has never been *"where they can say yes or no"* — it links out; the answer lives in
  the shop dashboard.

**The room's exclusion is right. The stated current state is wrong** — which means nobody checked
what an asked supplier actually meets on each surface S1 and S3 touch.

### 🔴 5 · A SUPPLIER BOOKED ON TWO EVENTS THE SAME DAY — answered nowhere

The shop's day-of screen picks **one arbitrary winner** (`bookings.find(b => b.bookedDate ===
today)`) and everything downstream speaks about that single event **without ever saying which**:
the banner, the brief, the tool pills, the countdown, the primary Launch link. **"One room, then
one door" is false the first time a caterer works a morning christening and an evening reception.**
⚠ The far-away booking is also unstated: the configure view opens for past and future alike with
**no date test**, and S3 never says what the doorway link does on an event months away.

### 🔴 6 · THE ANSWER TAXONOMY DOES NOT ADD UP, AND TWO REAL KINDS ARE MISSING

**Three totals for one taxonomy: the brief said fourteen, the table lists six, the "eight
elsewhere" enumerates ten.** A list claiming to be everything a supplier owes cannot be off by two
on its own heading. **The count is SIXTEEN.** And two more are absent from all sixteen:

- 🆕 **A couple-proposed MEETING.** Real rows, inserted live by the couple's own screen, which
  **emits a notification saying "confirm or propose a new time"**. It has a start time, and its
  deadline is the meeting itself passing — **a fifth time-box shape the plan's four have no slot
  for.** A tasting that has already happened must not sit in a list ordered by who waited longest.
- 🆕 **An unanswered message in an ACCEPTED thread.** The desk's enquiry lane is **pre-accept
  only**. The commonest answer any supplier owes is a reply to a booked couple — **the very thing
  the product already measures and publishes as their reply speed** — and it is nowhere on a list
  advertised as every answer they owe.

🚨 **And one lane is narrower than anyone noticed: a ONE-STAR review can never reach the desk at
all.** The filter is *five stars and no reply*. **The review that most needs an answer is excluded
by construction** — and repairing the row cap (S8) makes the desk *look* complete while that
stays true.

### 🔴 7 · SEVENTEEN REVALIDATE SITES, NOT ONE — and one is a COUPLE-SIDE action

The console's address is revalidated from **17 places across 5 files**, including
`dashboard/[eventId]/access-requests/actions.ts` — **the couple's own screen revalidating the
supplier console.** S6 names one of them and calls it a line of work. **Every one must be
re-pointed after S5, and none of those actions holds a slug** — each needs a new lookup.
⚠ There is also a cross-role path nobody opened: a couple-side stage-note action exists *because*
its supplier-side twin redirects into the console — **the aunt running the floor from the couple's
dashboard.** Moving the console's address moves the thing that file was written to avoid.

### 🔴 8 · THE PHOTO ROUTE IS ORPHANED — and its own comment already settles owner question 5

The console's Papic child route appears in **no slice**. Its Back button points at the exact route
S5 turns into a stub ⇒ after S5, **a photographer opening yesterday's captures and pressing Back
is bounced into a room whose gate refuses them and lands on the couple's guest page.**

Worse, that file's own header records the ruling the plan is asking the owner for:

> *"⚠ THE SHUTTER IS DAY-BOUND. LOOKING BACK IS NOT. This used to redirect away unless the booked
> date was today … at midnight the door shut on the photographer's own pictures — and the next
> morning, which is exactly when they want to confirm a shot landed, it was closed."*

**Owner question 5 is already decided inside this feature, against the room's gate.** The plan
re-asks a settled decision *and* writes the defect it settled into the new route.
⚠ Related: **"today" is redeclared four times** in this codebase. The room makes five.

### 🔴 9 · THE WHOLE CONSOLE CHANGES TYPEFACE AT THE NEW ADDRESS

The couple's tree remaps the display, body and mono faces to the editorial set, and the room also
sits **outside** the wrapper that re-pins the dashboard's own faces. **A working console — clock,
cue bar, floor log — rendered in the wedding display register is a design decision, not a port
detail.** It is not in the plan's owner list. It is in § 4 below.

### 🔴 10 · MULTI-DAY IS NAMED AS A TRAP AND WRITTEN INTO THE NEW ROUTE BY THE SAME PLAN

The plan states correctly that the booking machinery reads only the event's FIRST day while an
end-date column exists and is never consulted ⇒ *"on day two of a three-day celebration the hub is
live and the room is shut."* **Then S4 specifies exactly that gate, and no slice repairs it.**
🔑 **As written the plan knowingly re-implements a known bug at a new address, which converts it
from a defect into a shipped contract.**

### 🔴 11 · NOTHING EVER TELLS A SUPPLIER THE DAY HAS COME

Grepped: **no day-of, call-time or console notification type exists, and the day-of tree emits
none.** The plan's premise is that on the day a supplier opens the couple's address — **nothing
anywhere hands them that address or tells them it is the day.** This is the missing half of
correction 1.

### 🔴 12 · SMALLER, EACH A PLACE TWO SCREENS COULD ANSWER DIFFERENTLY

- **The room inherits the website-surface gate**, so **a supplier's day-of console becomes
  silently deletable by an event-type profile edit** — a coupling that does not exist today, where
  the console keys on a booking. Not a defect; an unnamed new dependency.
- **The `/u/` cutover:** the couple's page canonicalises its address and the room never would, so
  with that flag on the two disagree about the canonical URL — against S5's *"only one address."*
- **The Advance control is narrower than the room's audience:** the RPC admits any booked vendor
  while the enforcement narrows to the booked **coordinator**. The plan mounts that header in a
  room every booked supplier enters and **never says what the florist sees** — a refusal on a live
  day-of screen, or nothing at all. That is the plan's own two-screens-one-question test, unasked.

---

## 3.5 · THE TRAPS — ranked by what each costs

**1 · 🔒 THE FORBIDDEN WORKAROUND IS ALREADY IN YOUR HAND.** The couple's page reads with the
**service role**, and every loader takes an admin client. **Every permission rule that keeps a
supplier out of the guest list, the coordinator broadcasts and non-public schedule blocks is inert
on that page.** The 2026-07-29 owner ruling (*"yes. keep them private."*) forbids reaching for the
admin client to get around it — **and here you do not reach; it is already in scope.**
🔑 **RULE FOR THE ROOM: event data comes from the brief RPC or from permission-bound reads under
the supplier's own session. If you find yourself passing an admin client into anything new under
the room's directory, stop.**

**2 · 🔴 THE COUPLE'S PRIVATE CUES AT THE COUPLE'S PUBLIC ADDRESS.** The policy that lets a booked
supplier read schedule blocks has **no public/private filter** — it excludes only coordinator-only
lines — and the consumer renders private lines **marked, never hidden**. The anonymous policy on
the same table *does* filter on public. **So the room renders, at a public web address, content
deliberately withheld from anonymous readers.** Mitigation: `noindex,nofollow`, redirect anyone
without a committed booking, **and a test that fetches the room anonymously and asserts zero block
text.**

**3 · The doorway grants on a LINK, not a booking — live today.** See § 3.2. Today's consequence:
a shortlisted supplier on a public event is told *"You are booked here"*, is given event-scoped
stories, **and is then refused by the page the strip links to** — a control that refuses the person
it is shown to.

**4 · Two columns, one question.** The hub filters one link column, the brief filters another.
Benign today because three writers set both — but one migration sets the first from the second and
**never writes the second**, so divergence can run the other way: **the hub admits where the brief
refuses.**

**5 · Guards that will fire.** The whole-tree copy guard (exact-match bill in **both** directions)
· the closed four-file bottom-edge list · a nav guard pinning **exactly 2** call sites on equality,
whose failure message reads as a missing camera · the capability shape guard, asserted against a
poisoned fixture · the lost-controls baseline (**3 destinations / 54 blocks** on the live console)
· the five-slot nav cap. ⚠ **Not covered and worth extending: the first-byte guard names its two
directories BY HAND**, so a new room directory is unguarded against a loading file — and that is
how every unknown address becomes a soft-404.

**6 · Two surfaces, two answers — and the middle one is HALF the size the plan gives it.**
The tool pills on the shop's landing page pass `null` for the saved override while the launched
day-of app reads it — **same booking, two answers, today.**
⚠ **CORRECTED BY A SKEPTIC:** the plan says *"the toggles do not control the sections."* **They
do** — on the launched day-of app, which reads the saved override and gates on it. The defect is
confined to the **landing page's pill row**, not to the console. *A defect stated one size too
large gets fixed in the wrong place.*
And the rail badge derives its count **in SQL** while the feed derives the same number **in JS** —
they agree today, and the existing guard watches sidebar-vs-phone drift, **not feed-vs-badge
drift.** Adding a badge for the desk opens that seam.

**7 · The clock says three things.** Three screens say the window is "T-1h → T+8h"; the real gate
is the whole civil day. **The dead numbers survive in five places** — including a docblock sitting
120 lines below the block that records the widening. **Fix all five or the next reader takes the
wrong one.**

**8 · CSS scope collision.** The console's recipes are written as descendant selectors of the
editorial scope *because* they are unreachable from a dashboard, and one component recomposes them
from root tokens for the same reason. Inside the couple's tree **both start matching.**
⛔ **Do not unscope the recipes** — that makes them match on every marketing and dashboard page.

**9 · Claims a tempting plan would lean on that DID NOT SURVIVE the skeptics.** Do not build on
any of these:
- ⛔ *"The Event Hub is owner-locked read-only, a place not a control panel."* **REFUTED.** The
  actual ruling (2026-07-26) is that the event owner gets controls unlocked ON that page, and host
  editing already ships there behind a verified-host check. **The ⛔ in the register is an
  unsourced escalation of a dated description.** This plan does not depend on either reading —
  **but do not stall the build on a lock that is not there.**
- ⛔ *"The proposal reply is the supplier's answer."* **It is the couple's, enforced in SQL.** The
  supplier's item on that table is an unsent draft.
- ⛔ *"Guests submit song requests."* Both routines have **zero application callers.**
- ⛔ *"The couple can file a day-of request."* **Zero writers** for the couple and host lanes.
- ⛔ *"Manpower gigs are a pending queue."* **Inert end-to-end for non-admins.**
- ⛔ *"The Event Hub communicates nothing to a supplier."* **False** — a supplier is an enumerated
  audience for event-scoped stories.
- ⛔ *"That nav resolver has zero production consumers"* (**its own sibling docblock**) — it has two.
- ⛔ *"The coordinator requests inbox is off."* The migration seeds it inactive; **two in-repo
  sources say it is active in prod.** Read it, do not infer it — and **do not build the dark branch
  as the main case.**
- ⛔ *"The headcount card is reachable from one place."* **At least five.**
- ⛔ **Room counts:** one document says the hub is 13 addresses over a table of 15; another
  enumerates a **different** 13. **Reconcile before sizing anything by room count.**

**10 · Smaller, but real.** The proposal `sent_at` has **three** writers, not one, and a second
send lane exists from chat whose failure cleanup is best-effort — **a stranded draft will present
as work owed.** The `'expired'` proposal status **has no writer**, so its validity date is
decorative. And the song-desk switch **seeds the whole kit from current defaults on its no-row
path** — inserting the bare flag would **switch that act's entire kit off as a side effect.**

---

## 3.6 · WHAT THE SKEPTICS CORRECTED — carried here because the plan absorbed only some of it

**17 claims did not survive.** The plan's own trap list carried ten of them. **These are the ones
it did not**, and each changes something a builder would otherwise get wrong:

- 🔁 **A supplier IS already an audience on the couple's page — in TWO places, not zero.** The
  mapper's *"a supplier is in none of the five communication surfaces"* is wrong in the very file
  it cites: the editorial content is handed a viewer whose *belongs-to-event* flag is true for a
  supplier with a capability, and the event-scoped stories enumerate them. **The hub already
  speaks to suppliers; it just says very little.**
- 🔁 **The day-of landing's non-photo card switches DESTINATION on the booking, not on the trade.**
  With a booking today, a caterer is sent to the production sheet and a coordinator or band
  elsewhere — the *copy* switches on trade, the *link* does not. Anyone porting that card by
  reading its words will send people to the wrong place.
- 🔁 **When there is no event today the supplier does NOT get a degraded console** — a compact
  view renders instead, with its own picker of other bookings. **Do not design the empty state; it
  exists.**
- 🔁 **The open-task list is ~75% a second copy of the feed** — three of its four sources are the
  same rows. **And three card kinds have no open-task row at all**, of which the consequential one
  is the couple asking to remove a celebration. **Two lists, one population, different omissions.**
- 🔁 **Stage notes are an ADDRESSED channel and the shipped path is supplier→supplier**, not
  event-side→supplier as mapped. They display on **two** screens, not one. And the claim that a
  note *"waits for the emcee to reload"* is **struck** — the run-of-show header is mounted on that
  page and does receive live changes.
- 🔁 **The two partnership bundle kinds were RENAMED at the source** to say what they mean. Using
  the old names is how two independent readers previously concluded we sell paid placement.
  **Never re-introduce the old spelling.**
- 🔁 **The headcount card is reachable from at least four or five places, not one** — three of them
  the booked population the card exists for. Any "it is buried" claim about it is wrong.
- 🔁 **The "floor items are switched off in production" framing is contradicted in-repo, and the
  grep behind it could not match.** ⚠ **Read it out of production; do not build the dark branch as
  the main case.**
- 🔁 **The "how much of the couple's private plan may a supplier see" question is NOT an open owner
  decision** — through the supplier portal they already see counts and never guest identities. The
  live question is the narrow one in § 4 · 1: the same notes at a **public address**.

---

## 3.7 · 🔬 THE CRITIC WAS THEN ATTACKED TOO — two gaps shrank, two grew

Every mapper's finding was refuted by an independent reader. **The critic's twelve were not** — so
four of the load-bearing ones were each handed to a skeptic told to refute them or show they were
the wrong SIZE. **Two came back smaller. Two came back worse.**

### ✅ SMALLER — "THE ROOM HAS NO DOOR" was a search that could not match

**Two supplier screens already read a couple's event address and link straight to it** — the
Stories screen links to the Event Hub itself, the Recaps screen to the couple's recap page. **So
there is precedent to copy, not a mechanism to invent.**
🔑 **The real gap is narrower and truer: those two doors only open AFTER the wedding, only for
weddings, and only once the couple has published something.** The supplier's working screen
*during the job* has no door. ✅ And the slugless-event worry is near-empty — **no path a customer
can take creates one**, and both existing readers already skip them.
*`vendor-dashboard/real-stories/page.tsx:109` · `vendor-dashboard/recaps/page.tsx:103` ·
`lib/slugs.ts:29-69` returns a string on every branch.*

### ✅ SMALLER — "THE HIRED NIGHT CREW GETS STRANDED" is REFUTED, both halves

**Everybody the product can grant access to is already a member of that shop's team** — the grant
screen only lists teammates — so the slice that admits teammates already covers them. And the
supporting fears are refuted: a granted teammate **can** read their own shop's profile under
ordinary permissions, and the brief **does** answer for them. **The rule the plan called "the
single most important line" does not have to be argued after all.**
🔴 **BUT THE RISK RUNS THE OTHER WAY INSTEAD:** widening access to the whole team **throws away
the per-event scoping the grant exists for** — afterwards every teammate reaches every booked
event. **That is a new owner decision (§ 4 · 6), not a fix.**
*only writer `on-the-day/actions.ts:550-593` fed from `on-the-day/page.tsx:794-815` ·
`20260821000000_vendor_role_aware_rls.sql:160-164` · `20270810694086_vendor_event_access_grants.sql:43`.*

### 🚨 WORSE — THE WEDDING-WORDS LEAK IS NOT A FUTURE COST. IT IS LIVE, TODAY, ON THE PUBLIC PAGE

The plan priced this as something the room would have to pay. **It is already bleeding.**
*"The couple"* is hardcoded into the guest photo challenges and **rendered on the Event Hub right
now** — **74 seeded prompts** carry it, and the database repeats the same fallback for anybody with
no bride-or-groom side. **A birthday, graduation or funeral guest reads "the couple" this minute.**
Under the guard's own rule there are **182 more such lines** in the modules the guest page borrows
from, **none of which the guard can see** — and its exemption list waves through **sixteen files by
filename, including the very file rendering the live one.**
*`lib/papic-missions.ts:289,321-343` · `app/[slug]/_components/editorial/data.ts:24,2035` ·
`20271125220401_papic_story_challenges.sql:163-167,182` · guard scope
`app/[slug]/_lib/s13-is-finished.test.ts:31,77-85,96`.*

### 🚨 WORSE — A THIRD MISSING ANSWER, AND IT IS THE WORST-SERVED OF ALL

**A co-owner moving to demote or remove another owner of the same shop.** Fully built and votable.
**It notifies nobody at all, and it never expires** — the only way to learn somebody has moved to
strip you of your own shop is to open the team page.
⚖ Two corrections in the plan's favour: an unanswered message in an accepted booking **does** raise
the messages badge (**missing from the desk, not from the product**) and is **NOT** dragging the
shop's published reply time down. And a **one-star review does reach the shop and can be replied
to** — the desk simply filters it out, **a setting to reverse, not a feature to build**.
*`20270401574089_vendor_org_multi_admin.sql:148-163` · `team/actions.ts:293-315` mounted at
`team/page.tsx:198,208`, zero notification calls in either · median filter
`lib/vendor-activity.ts:413-427` · desk filter `lib/vendor-overview.ts:322`.*

---

## 3.8 · 🚨 SIXTEEN THINGS NOBODY KNEW — found by sweeping ground no mapper covered

Three sweeps went over what happens **before and after the event day**, **how a supplier is
actually reached**, and **what any of this does on a phone**. Ranked by whether a person feels it.

| # | What a person experiences | Mechanism |
|---|---|---|
| **1** | 🚨 **A supplier's phone can never be reached, and their screen says it can.** The console saves their phone into one store; the sender reads a different one — and the vendor sender is switched off and recorded as dormant. Their toggle reads *"On — you'll get an instant alert when a couple sends an inquiry."* | `lib/web-push.ts:52` reads `push_subscriptions`; `vendor-dashboard/actions/push-tokens.ts:71` writes `vendor_push_tokens` · copy at `notifications/push-toggle.tsx:66` |
| **2** | 🚨 **Nothing anywhere says "your event is today."** No such notice exists and the day-of screens send none. The only thing carrying a call time is a button a coordinator must press, behind a setting off by default, **sent to whatever email the couple typed — never the supplier's account** | `lib/notification-emit.ts:17-20` · zero emits across the day-of trees · `day-of-broadcast.ts:126,151` |
| **3** | **The only warning about an upcoming booking fires when the supplier opens the app.** The notice written for the supplier who is not paying attention is triggered by the supplier paying attention | `lib/vendor-email-triggers.ts:248` called only from `lib/ghosting.ts:171` |
| **4** | 🚨 **A new booking enquiry sends no email at all** — the most valuable moment in the product is a badge inside an app they are not in, on a channel that (see 1) cannot reach their phone | `notification-emit.ts:22` vs the 35-item email list at `:62-172`, enquiry absent |
| **5** | 🔴 **A supplier booked the NEW way gets no On the Day screen, ever.** Every day-of screen resolves from a schedule reservation the new booking handshake **states in its own definition that it never creates**. Between agreeing and the deposit there is no console, and **no screen says why.** ⚠ **This breaks the plan structurally — the room's gate inherits it** | `lib/vendor-schedule.ts:305-315` → `on-the-day/page.tsx:186-189` · `20271144258091_lock_handshake_slice_b.sql:749` |
| **6** | **At midnight the supplier running the room loses it, mid-reception.** The couple's own desk deliberately stays open until 6am for exactly the Filipino reception that runs past midnight; the supplier's shuts on the calendar rollover with no warning — clock, scanner, running order, floor log, gone | `live/[eventId]/page.tsx:72,181-185` vs `lib/day-of-mode.ts:47-83` |
| **7** | **A booked supplier is bounced off every sub-page of a private wedding.** They open the main page, then the floor plan, the recap, the seat finder and five more silently return them. **The rule that lets them in was written inside one page instead of the shared gate, so it does not travel** — and any new room copying the standard gate inherits the bounce | `lib/slug-access.ts:42-70` vs the inline admission at `app/[slug]/page.tsx:498-556`; 7 callers |
| **8** | **For every wedding more than three months away, "You are booked here" is painted UNDERNEATH a full-screen film** — in the page, invisible and untappable, during exactly the months a supplier is working on the job | `vendor-doorway.tsx:35-38` (no layer) under `save-the-date-film.tsx:1758` (`fixed inset-0 z-[50]`) |
| **9** | **A shop's staff are told nothing.** Almost every notice goes to the one owner account. The answers list is shop-wide, so a manager sees the work; the alert tray is person-wide, so their tray is permanently empty | 34 owner-only lookups; the single team fan-out is `delete-actions.ts:634` · tray scope `lib/notifications.ts:558` |
| **10** | **Money arriving, and a booking being cancelled, are both in-app only** — each reaches the supplier as a badge and nothing else, **and the cancellation code's own comment claims the opposite** | `notification-emit.ts:95` vs `:21-35` · `vendors/actions.ts:3965` vs `:3991` |
| **11** | **Two of the desk's own lanes can never fire.** The late-delivery card reads a state **nothing writes and the database has no permission to write**; the owner's ruled *"one reminder"* on a delete request **has no sender anywhere** | `vendor-overview.ts:736` · `deletion_request_nudge` declared 4×, emitted 0 |
| **12** | **A supplier's own photographs turn into broken tiles when the retention sweep runs** — on their screen and in the couple's gallery, because neither was taught about the compressed copy. And their screen promises that a photo the couple hides disappears for them too; **the couple's control writes something else entirely** | `lib/papic-fullres-drop.ts:630-634` · `own-captures-strip.tsx:42-47,152-157` vs `vendor-visibility-actions.ts:62` |
| **13** | **The morning after a wedding, the shop's screen reports zero work and a future launch** — clips and photos read 0 with dead links, the review card says *"not yet"*, and a wedding that already happened is labelled *"Launches on"* its own date | `on-the-day/page.tsx:255-308,563,571,595,838-842` |
| **14** | **The one genuinely dangerous control has no time limit on the screen that offers it.** A booked coordinator can press *"start next"* on the couple's real running order **four months early or a week late**, writing into the timeline every day-of screen treats as truth — while the screen designed for that action is shut every day but one | `clients/[eventId]/page.tsx:2804` (`canAdvance` literal, no date test) · no date term in the RPC either |
| **15** | **Two working channels are readable on exactly one calendar day** — the coordinator's notes to the emcee cannot be read before the wedding or ever again after it, and the photo-review page **built specifically to survive the day** has nothing linking to it off the day | `stage-script.tsx:133` inside the console that shuts at midnight · `live/[eventId]/papic/page.tsx:53-84` |
| **16** | 📱 **On a phone, a room at the couple's address starts with NO navigation at all.** The guest bar has exactly one owner and does not travel to sibling pages; five things already compete for that bottom edge after a month lost to two bars covering each other; and the guard policing it is **a hand-typed list of four files that can never see a new room** | sole importer `site-body.tsx:35` · 5 claimants · `lint-no-stacked-pinned-bars.mjs:196-207` · `bottom-edge.test.ts:44-49` |

✅ **TWO USEFUL FACTS FROM THE PHONE SWEEP:** the day-of console is **already phone-shaped** —
fluid, no fixed widths across twenty components — so **port it, do not rebuild it**. And **only
the LETTERING changes at the new address; the console's colours survive intact**, which narrows
owner decision 5 to a type call.

---

## 3.9 · 🛑 WHAT WOULD MAKE IT COMPLETE — six unknowns, none of them a build plan

1. **Decide what makes a supplier "booked" for the room.** Two different facts claim it today and
   **the newer booking path never produces the one every day-of screen reads.** Until that is one
   answer, the room's front gate is guessing.
2. **Decide how a supplier learns the day has come — and PROVE one channel arrives.** Fix the phone
   channel onto one store, or add an email; pick one and test that a message lands. ⚠ **This
   platform runs nothing on a schedule**, so *"tell them the morning of"* needs a trigger, not a
   cron. **This is the plan's headline and it currently has no delivery layer at all.**
3. **Move the booked-supplier admission into the SHARED gate.** It lives inside one page today.
   Until it moves, every new room repeats the silent bounce — **including the one being built.**
4. **Decide whether a teammate reaches every booked event, or only the ones they were granted.**
   The moment team access widens, **the per-event grant stops meaning anything.**
5. **Fix the wedding-words leak that is already live, and extend the rule to borrowed files** —
   before the room mounts, not as part of it. **It is a bug on the public page now.**
6. **Draw the room, including its phone chrome** — a room at the couple's address starts with no
   navigation and nothing guards its bottom edge, so the drawing has to answer that too.

⚖ **Everything else in this plan is buildable once those close.** ✅ **The answers desk can start
now** — it touches none of the six, and it is the thing the owner actually complained about.

---

## 3.10 · 🛑 WHAT IS STILL NOT COVERED — the honest edge, after two adversarial passes

1. ✅ **The critic HAS now been attacked** — see § 3.7. Two of its four load-bearing gaps shrank
   and two grew. **The other eight of its twelve remain unchallenged.**
2. **THE ROOM HAS NOT BEEN DRAWN.** There is no picture of it anywhere. Per this project's own
   rule, tests catch wrong code and never a wrong-*looking* screen. **Draw it before building it**
   — it is also what lets the owner answer decisions 1 and 5 without reading any of this.
3. **No slice is sized.** There are no estimates and no sequencing against anything else in flight.
4. **The desk's own sort order is unproven.** Oldest-first is asserted; nobody checked what a
   supplier with forty rows actually needs at the top, or whether *waiting longest* and *most
   urgent* are the same thing. Two of the sixteen kinds carry a hard deadline; the rest do not.
5. **Nothing was measured against production.** Every claim is read from source at one commit. The
   platform is pre-launch and nearly empty, so **no part of this plan has been exercised by a real
   supplier on a real event day.**

---

## 4 · 🔴 OWNER DECISIONS — the only things engineering cannot settle

> Five. The plan proposed five and **one of them was already answered inside the product**; the
> critic found a sixth nobody had asked. Corrected list:

1. **May a supplier read the couple's private run-of-show notes at the couple's own PUBLIC web
   address?** They already read them today inside their own dashboard, on purpose, marked *"don't
   read aloud"*. **This changes WHERE they are shown, not who sees them — and the where is a
   public address.** *(This is the one that most needs your answer; everything else in the room
   is safe without it.)*
2. **Should the three day-of kits — the floor desk, the song desk, the script desk — be free
   during launch?** They need a paid plan and **no real supplier has one**, so the room opens
   nearly empty for every shop on the platform today.
3. **When you say the Event Hub is a supplier's On the Day, does the list of their OTHER weddings
   and the months of preparation work move too — or only the day itself?** ⚖ **My call is only the
   day**, because the other list is a list of other couples and the preparation is not the day.
   Say so if you meant more.
4. **Should a supplier be able to say "I did not receive that money"?** Today the only possible
   answer to a couple's payment claim is **yes**, and **it cannot be taken back.**
5. 🆕 **A working console — a clock, a cue bar, a floor log — rendered in the WEDDING LETTERING.**
   ✅ **NARROWED BY MEASUREMENT:** only the typefaces change at the new address — **the console's
   colours survive intact.** So this is a type call, not a re-skin.
6. 🆕 **Should a teammate reach EVERY one of the shop's booked events, or only the ones they were
   specifically given?** Opening the room to teams — which the plan requires — **quietly retires
   per-event access.** Nobody asked for that; it would arrive as a side effect.
7. 🆕 **Who at a shop gets told?** Almost everything today reaches **one account**. A manager can
   see the work and is alerted to none of it — and **a move to remove a co-owner reaches nobody at
   all.**

⛔ **RETIRED BEFORE IT REACHED YOU — do not answer this one.** *"Does the room close at midnight,
or can a supplier come back and look at what happened?"* **You already decided it, inside the
feature:** the photo route's own header records *"THE SHUTTER IS DAY-BOUND. LOOKING BACK IS NOT …
at midnight the door shut on the photographer's own pictures — and the next morning, which is
exactly when they want to confirm a shot landed, it was closed."* **The room's gate must follow
that ruling rather than re-create the defect it settled.**

---

## 5 · ⚖ MY CALLS, MADE — so nobody re-asks them

- **The answers desk ships FIRST and separately.** It touches none of the hub work, it is the
  thing the owner actually complained about, and **four of its rows must not exist until the
  answers behind them work at all** (§ 3.3 rows 8 and 13). Everything else can wait.
- **A supplier working TWO weddings on one day sees BOTH**, named, and chooses. One arbitrary
  winner is not a product answer.
- **The room's day gate reads the event's END date**, not its first day. The plan named that
  defect and then specified it; **naming a bug and shipping it is worse than not noticing.**
- **The grantee crew is in scope for the room or S5 does not ship.** Redirecting the hired night
  crew into a room that refuses them is a regression dressed as a cleanup — and because that path
  structurally needs a privileged read, **it is the one place the admin-client rule has to be
  argued rather than obeyed.**
- **The copy guard gets extended to the components the room IMPORTS before the room mounts.**
  Otherwise the first funeral this touches says *"the couple"* with every check green.
- **Nothing ships that a supplier cannot reach.** Correction 1 is the whole outcome: today
  **no screen in the product shows a supplier their client's event address.** The door is built
  in the same change as the room, or the room does not exist.

---

## 6 · WHAT NOT TO DO — each of these has already cost this project

- ⛔ **Do not rebuild the shop dashboard.** Five rooms, owner-locked 2026-07-12; re-sorted and
  shipped 2026-08-26 (§ 2).
- ⛔ **Do not make My Services a menu again.** He retired it knowingly on 2026-07-02, and doing it
  would evict one of the five phone tabs.
- ⛔ **Do not rename the five keys.** Four systems read them, three fail silently.
- ⛔ **Do not redraw the couple's page per role.** It already carries a supplier LAYER on top of
  whichever version a person gets — because **a person can be the couple's cousin and their
  florist.**
- ⛔ **Do not put a fast button on a judgement.** A partnership publishes a claim about another
  shop's prices; a delete request erases a wedding; a payment confirmation cannot be undone.
- ⛔ **Do not show a row for an answer nobody can give.** Crew shifts, song requests and day-of
  requests all have machinery and **no reachable way in**. A row would be a door onto nothing.
- ⛔ **THE ROOM HAS NOT BEEN DRAWN.** Nothing in § 3 is a picture — it is a map of what exists and
  what it would take. **Draw it before building it**, per the standing rule that tests catch wrong
  code and never a wrong-looking screen. The drawing is also what lets the owner answer decisions
  1 and 5 without reading any of this.
- ⛔ **Do not resolve a GENERATED file's merge conflict by choosing a side.** It cost this stream a
  red CI run: the rebase conflicted on the lost-controls baseline, taking one side left it
  describing a tree that no longer existed, and the guard failed in CI having passed locally an
  hour earlier. **Regenerate it from the merged tree, then read the diff line by line.** The other
  session's own commit titles say they had already learned this.
- ⛔ **Do not trust a docblock in this tree.** In this one mapping run, four separate docblocks
  asserted mechanisms that measurement refuted — including one claiming a module had *"zero
  production consumers"* while two files imported it.
