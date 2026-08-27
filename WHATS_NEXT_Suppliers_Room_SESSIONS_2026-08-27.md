# THE SUPPLIER'S ROOM — THE SESSIONS, THE MODEL, THE EFFORT

> **Owner 2026-08-27: _"start the other half"_**, then twice more, correcting the shape before a
> line was written: *"we are redesigning not placing a new page"* and *"on the day. is the
> integration of the vendors to the event's event hub. so we would still want to to be an event
> hub."*
>
> Plan of record: [`WHATS_NEXT_Vendor_Hub_And_Answers_2026-08-26.md`](WHATS_NEXT_Vendor_Hub_And_Answers_2026-08-26.md)
> — **§ 3 piece 7 is CORRECTED there**; read the correction, not the struck sentence.
> Drawing (binding): [`prototypes/vendor_room_in_the_hub_2026-08-26.html`](prototypes/vendor_room_in_the_hub_2026-08-26.html)
> · design: [`Vendor_Room_Design_2026-08-26.md`](Vendor_Room_Design_2026-08-26.md).

---

## THE SHORT VERSION

**Five sessions, plus one that is its own stream.** All five are built (S1 · S2 · S3 · S4 · S5) —
S5 ships flag-off pending the owner's gate. **Only S6, its own stream, is left.**

| | What a person gets | Model | Effort | Runs after |
|---|---|---|---|---|
| ⚠ **S0** | A booked supplier stops being told "No event today" | — | — | **NOT on `main`** — no file, no PR, no branch (measured 2026-08-27). S1 created the module it was said to own. |
| ✅ **S1** | One honest answer to *"is this shop booked?"* | **Opus 5** | **high** | **MERGED 2026-08-27T11:24Z · PR [#4912](https://github.com/iscasasola/setnayan-platform/pull/4912)** |
| ✅ **S2** | A booked supplier gets through the door on a private celebration | **Opus 5** | **high** | **MERGED + SERVED** — PR [#4914](https://github.com/iscasasola/setnayan-platform/pull/4914) |
| ✅ **S3** | **The vendors are integrated into the Event Hub on the day** | **Opus 5** | **high** | **BUILT + PR'd** — PR [#4919](https://github.com/iscasasola/setnayan-platform/pull/4919), auto-merge armed |
| ✅ **S4** | A booking made by locked QR holds its date | **Opus 5** | **medium** | **MERGED + SERVED** — PR [#4913](https://github.com/iscasasola/setnayan-platform/pull/4913) |
| ✅ **S5** | The night-before email (ships switched OFF) | **Sonnet 5** | **medium** | **BUILT + PR'd** — PR [#4915](https://github.com/iscasasola/setnayan-platform/pull/4915), auto-merge armed |
| ✅ **S6** | The Answers Desk — every answer a shop owes, answered on the row | **Opus 5** | **high** | **MERGED + SERVED** — PR [#4917](https://github.com/iscasasola/setnayan-platform/pull/4917); `/api/health` self-reports `df74779`, the PR's own merge commit |

**Never more than two at once** (10 parallel builds once shipped 44 defects).
🚨 **AND THE MACHINE IS THE HARDER CAP, MEASURED 2026-08-27:** with **four** other sessions
typechecking at once this machine ran out of memory and killed mine **twice** — `tsc` exits **143**
(and **134**, and **144**) while printing `errors=0`, so a session under contention can read its own
typecheck as a pass. **Count the worktrees before you start**, and always print the exit code beside
the error count.
🔴 **CONFIRMED AGAIN IN S1, AND IT WAS A REAL FALSE GREEN, NOT A NEAR MISS.** A typecheck exited
**144 with a COMPLETELY EMPTY output file** — `grep -c 'error TS'` on it returns `0`, which reads
exactly like a clean run. Re-run alone it found **7 real errors**. ⇒ **An empty tsc log is not a
clean tsc log. Require `TSC_EXIT=0` printed beside `ERROR_LINES=0`; either one alone is a lie.**
🔴 **AND AGAIN IN S2, a second independent false green:** exit **134**, `ERROR_LINES=0`, an empty log
whose only content was a V8 *"heap out of memory"* trace — with **TEN** typechecks running on this
machine at once. Re-running with `NODE_OPTIONS=--max-old-space-size=8192` gave a real
`TSC_EXIT=0 ERROR_LINES=0`. ⇒ **raise the heap; the EXIT CODE is what tells you which run to believe.**
**Safe pairs: S1+S4 · S2+S5 · S6 with anything.** ⛔ **Never S1 with S2, never S2 with S3** — they
edit the same booking reads and the same gate.

---

## WHY EACH MODEL AND EFFORT

**The rule behind every row:** this repo's failure mode is *subtly wrong and green*. A guard that is
decoration, a read that returns empty because it was refused, a gate that admits one person too
many. Those are not caught by the work being hard — they are caught by suspecting yourself. So
**anything touching who may see what, or money, gets Opus at high effort.** Mechanical work with a
written-down trap list gets Sonnet.

- **S1 · S2 · S3 are authorization.** Getting S1 wrong either hides a real booking from the shop or
  publishes an agreed-but-unpaid booking to strangers on a public page. S2 decides who opens a
  private celebration. S3 puts the couple's private run-of-show on a page whose gate is then the
  whole fence. **Opus 5, high** on all three, no exceptions.
- **S4 is small but it touches money that already moved.** The whole risk is one line of judgement:
  a failed pool acquire must degrade **OPEN** and warn, never abort — aborting reads like
  correctness and refuses a couple who has already paid, on a single-use token. **Opus 5, medium.**
- **S5 is a job and a template**, and both its traps are already written down (the 20-hour drift, the
  timezone). **Sonnet 5, medium** is right; it ships dark either way.
- **S6 is wide rather than deep** — sixteen kinds of answer, six doors — but four of its rows must
  **not exist** until the answer works, and deciding which is judgement. **Opus 5, high.**

---

## THE SESSIONS

### ⚠ S0 — NOT ON `main`. This register's ✅ was wrong when S1 checked it (2026-08-27).
Measured, not read: no `lib/vendor-room-access.ts` on `origin/main`, no `explainNoRoom` anywhere,
no PR for it in `gh pr list --state all`, no branch on the remote. **S1 therefore CREATED that
file.** If S0 lands later its `explainNoRoom` is an additive edit to the same module — no conflict.
🔑 *A ✅ in a register is not evidence; grep for the object.*

### ✅ S0 — the claim as written. Do not rebuild if it does land.
A booked supplier waiting on a downpayment record is no longer told "No event today"; they are told
which of the two things is true. **Its guard found a SECOND rendered copy of the same false sentence
elsewhere on that screen** — count rendered sites, never trust that one branch is the branch.

### ✅ S1 — DONE. PR [#4912](https://github.com/iscasasola/setnayan-platform/pull/4912), **MERGED 2026-08-27T11:24Z** (verified by `gh pr view`). Do NOT rebuild it.
⚠ Verify with `gh pr view 4912 --json state,mergedAt` before trusting this line — this corpus has
been wrong about a PR's state five times.

**What a person gets:** a supplier who said yes and is waiting on the downpayment stops being told
*"No event today"*; and a supplier booked through a Locked QR — money already moved — stops being
invisible to every day-of screen.

**Shipped:** `fetchVendorRoomEvents(client, vendorProfileId)` in a NEW `lib/vendor-room-access.ts`
(the file this register called "existing" — **S0 has not merged, so it did not exist**), with the
pure decision in `lib/vendor-room-access-rule.ts`. **Ten call sites swapped in six files, twelve
readers left on the raw pool read with a stated reason each** (this register said thirteen; twelve
is the measured count).

🚨 **THE SPECIFIED ARM 2 WOULD HAVE MISSED HALF THE BUG, AND WOULD HAVE LOOKED GREEN.** The plan
prescribed `marketplace_vendor_id` + `lock_request_state = 'agreed'`. Read out of production,
**`vendor_claim_locked_qr` never writes `lock_request_state` at all** — so that arm cannot match a
Locked-QR booking, and the "money already moved" half of the promise would have shipped as a filter
that can never fire. ⇒ **arm 3: a CLAIMED Locked QR token issued by this shop.**
🔒 **A shop CAN write its own token rows**, so the token alone is not the proof — arm 3 also requires
the `event_vendors` row to name this shop. Two sides, one booking.

🔢 **Measured, not remembered:** `vendor_schedule_pool_bookings` has **one writer**
(`acquire_schedule_pools`) with **one caller** (`acquire_service_time_slot`). Neither
`vendor_agree_to_lock` nor `vendor_claim_locked_qr` reaches it. That is the whole bug.

🪤 **A PLACEHOLDER DATE IS NOT A BOOKING DAY.** An `event_vendors` row carries no date, so arms 2/3
take it from `events.event_date` — which holds a value even at `event_date_precision='year'`.
**Prod holds such a row today (4 at 'day', 1 at 'year').** Without the precision filter a supplier
gets a full day-of console on a date nobody has agreed to.

🔒 **`event_vendors` HAS NO VENDOR-SIDE POLICY — four policies, all couple or moderator.** A
supplier reading it through their own session gets **zero rows, silently, forever**. So arms 2/3 are
service-role reads scoped in SQL by the id the caller proved. **Authorization only; no event
content.** S2 and S3 inherit this rule.

⛔ **`app/v/[slug]` MUST NEVER ADOPT THE ROOM READ** (a test pins it) — it admits an
agreed-but-unpaid booking. Same reason `real-stories` and `shop` stay on the pool read: their event
ids become the shop's **public** "Featured editorials" picker.

🪤 **`server-only` IS NOT AN INSTALLED PACKAGE HERE.** Next aliases it at build time; plain node
throws `MODULE_NOT_FOUND`, so a `server-only` module **cannot be imported by a `node:test` file**.
Split the pure rule out, as `papic-uploads-open-rule.ts` and seven others already do.
⚠ `scripts/lint-server-only-boundary.mjs` claims the opposite in its own docblock. That sentence is
false; the lint itself is correct and passes.

⏭ **NAMED, NOT FIXED (do not re-report as oversights):** `lib/vendor-overview.ts` keys React ids on
`poolBookingId`, which an agreed booking has none of — widening it needs a stable id first.
`recaps` and `proposals` are the same room question one screen over, outside this piece's day-of
scope.

🔢 **Safe by arithmetic at merge:** 45 `event_vendors` rows · **1** with a `marketplace_vendor_id` ·
**0** at `'agreed'` · **0** claimed Locked QR tokens. Arms 2/3 match nothing today.

🛡 18 tests · **14 mutations, occurrence count printed before → after, all RED.** One reported RED
with its count unchanged at **0 → 0** — the pattern was case-wrong and the sabotage had never
landed. *A red result is not evidence the sabotage applied.*

### ✅ S2 — DONE. PR [#4914](https://github.com/iscasasola/setnayan-platform/pull/4914), **MERGED 2026-08-27T13:33Z AND SERVED**. Do NOT rebuild it.
✅ `/api/health` self-reports **`df63d11`** — the PR's own merge commit, verified an ancestor of
`origin/main`. **A merge is not a ship; this one is both.**
⚠ Still re-verify with `gh pr view 4914 --json state,mergedAt` before acting — this corpus has been
wrong about a PR's state five times.

**Shipped:** the rule lives ONCE, in a pure `lib/closed-event-admission.ts` that both
`app/[slug]/page.tsx` and `canViewSlugEvent` ask; and "did they book you?" is ONE read —
`lib/booked-supplier.ts` → `viewerIsBookedSupplier` — moved out of `app/[slug]/_lib/loaders.ts`,
whose own header forbids cross-route imports.

⛔ **THE GUARD THE PLAN PRESCRIBED CANNOT BE WRITTEN.** *"Feed one fixture to both gates and assert
they agree across all five identities"* is impossible here: `slug-access.ts` is `server-only`, which
in this repo cannot be imported by a `node:test` file at all, and the page's copy sits inside a
1,000-line server component. **Agreement is STRUCTURAL instead** — one rule — and the guard pins that
both sides still call it and still resolve **every fact it takes, derived from `NO_CLAIM`** rather
than hand-typed, so a sixth fact fails until both sides establish it.

🚨 **AND THE SAME SHAPE ONE LEVEL DOWN WAS A LIVE DISCLOSURE, NOT IN THE BRIEF.** "Is this viewer a
booked supplier?" had **three** copies and **two asked whether a LINK existed**.
`reusable-bookings.server.ts` mints a linked row at `'shortlisted'`, so a supplier the couple was
merely CONSIDERING was shown the doorway strip that says, in words, **"You are booked here"** — and
counted by `belongsToThisEvent`, **the single boolean gating a keepsake story the couple kept to the
people of their day**, on the screen AND at `/{slug}/print`. The strict copy sat one file away.
🔑 *A rule written three times had two copies laxer — and the lax ones were the two deciding a
disclosure.*

🪤 **THE DERIVED GUARD FOUND A FOURTH SURFACE THE HAND LIST HAD MISSED** —
`_components/site-body.tsx`, the one feeding the fact straight into `belongsToThisEvent`. It reads
every ASSIGNMENT of the fact under `app/` + `lib/` now and allows exactly two sources.

🔢 **Safe by arithmetic, measured in prod 2026-08-27 by query:** 45 `event_vendors` rows, **ZERO
carrying a `linked_vendor_profile_id`**; 5 events, **3 private**, none `'invited_accounts'`. So it
admits nobody new today. ⚠ **This register's "4 of 6 production events are private" is STALE** — it
is 3 of 5, and the figure was copied into four code comments before being corrected.

✅ `tsc` errors=0 **EXIT=0** · unit **10466/10466** · db **1644/1644** · 8 mutations, occurrence
count printed **1 → 0**, all RED.
🔴 **AND THE FIRST TYPECHECK WAS A FALSE GREEN AGAIN — exit 134, ERROR_LINES=0, an empty log**, with
**ten** typechecks on the machine at once. `NODE_OPTIONS=--max-old-space-size=8192` fixed it.
⏭ **NAMED, NOT FIXED:** `lib/the-venue-respects-privacy.test.ts` still uses the hand-rolled regex
comment stripper that `lib/strip-comments.ts` exists to replace (its assertions are presence checks,
so it fails RED rather than green — but it should be swapped).

<details><summary>The original S2 brief, kept for the record</summary>

**What a person gets:** a booked supplier can open the venue page, the recap, the seat finder and
the live hub of a private celebration they are working on — instead of being silently bounced by
doors the page itself drew for them.
**Shape:** the shared gate has three ways in and no supplier arm; the admission lives inline in ONE
page, so **all seven sub-routes bounce**. Move it into a `server-only` `lib/booked-supplier.ts` and
add the arm for **both** closed visibilities.
🔒 **Keep the return a plain boolean** so a refused supplier gets byte-identically what a stranger
gets. ⚠ Also fix the comment justifying a shortcut with *"the gate at the top has ALREADY proved the
answer is yes"* — a later path made that false, so the money-gift card is drawn for a supplier the
money-gift page refuses.

</details>

### ✅ S3 — DONE. PR [#4919](https://github.com/iscasasola/setnayan-platform/pull/4919), auto-merge armed. Do NOT rebuild it.
⚠ Verify with `gh pr view 4919 --json state,mergedAt` before trusting this line — this corpus has
been wrong about a PR's state five times. **A merge is not a ship:** check `/api/health` against the
merge commit afterwards.

**What a person gets:** on the day, a booked supplier opens the same link every guest opens and
finds their own desk on it — the venue and its address, the running order live, the whole running
order with the organiser's private lines **shown and marked**, the live headcount, and their tools.
Every other day of the year it is the one-line link-out it has always been. Nobody else sees a trace.

**Shipped:** the pure rules in `lib/supplier-desk-rule.ts`, the content read in
`app/[slug]/_lib/supplier-desk.server.ts`, the render in `_components/supplier-desk.tsx`, mounted
from the doorway's OWN already-guarded mount point (a second mount is a second gate). `moduleHref`
moved out of the floor console into `lib/vendor-dayof-module-href.ts` so the desk and the console
read ONE route map. The now/next line is the shared `RunOfShowHeader`, realtime included —
`canAdvance` left false, because only the coordinator runs the programme.

🔒 **THE RULE THAT DECIDED THE BUILD, and it is the one to carry forward:** *authorization may be
answered with the service role scoped by a session-proved id; **event content never is**.* The admin
client is in scope on the very line the desk is resolved on — the loader opens its own cookie-scoped
client instead, and a guard asserts by source that the file never gains a `createAdminClient`.

🚨 **AND THE OBVIOUS READ WAS THE LEAKY ONE. `get_vendor_event_brief` returns a `timeline`, it was
one fewer round trip, and it carries the COORDINATOR-ONLY lines** — the function is
`SECURITY DEFINER` and its timeline select has **no visibility filter at all**, while the
booked-supplier RLS policy excludes exactly those rows. Read out of production, not from a
migration. The running order comes from `fetchRunOfShowBlocks` under the supplier's own session,
which is narrower AND carries `run_state` besides.

🔴 **A LIVE DIVERGENCE, MEASURED, NAMED AND DELIBERATELY NOT FIXED — read this before touching the
doorway's audience.** Three readers answer "is this shop booked here?" off **two different
columns**: `get_vendor_event_brief` and the schedule policy use `marketplace_vendor_id`;
`resolveVendorCapability` (the doorway, and therefore this desk) uses `linked_vendor_profile_id`.
Production holds **45 rows · 1 with a marketplace id · 0 with a linked id**, and that one row is
**`contracted`** — so the only genuinely booked marketplace supplier in production gets the full
brief inside their own dashboard and **no doorway and no desk on the celebration's page.**
⛔ **Aligning them is NOT a port.** `resolveVendorCapability` also feeds `belongsToThisEvent`, the
single boolean gating a keepsake story the organiser kept to the people of their day — the thing S2
had to tighten three days ago. Widening it is a **disclosure decision and needs the owner.**

🔴 **IT ALSO FOUND A LATENT ONE, FIXED IN THE SAME PR: `events.event_end_date` and `cleared_at` were
being READ BEFORE THEY WERE SELECTED.** The page has cast for the end date since the day-of
lifecycle learned about ranges and the event shell's select named neither column, so the cast
resolved `undefined` on every render and **the multi-day arm of `getLifecyclePhase` has never once
run**. Both are selected and typed now. 🔑 *A cast is not a read — `as` silences the compiler about
a field the query never asked for.* ⚠ Safe here only because the shell reads with the **service
role**; the same two names in a user-session query must clear the `events` per-column allowlist
first, or PostgREST refuses the whole query.

⏭ **NAMED, NOT BUILT — do not re-report these as oversights:** the granted-teammate arm (above) ·
the **Papic capture tool** stays off the celebration's page (its own page is day-bound and would
bounce a supplier opening the desk the afternoon before, and § 6.4 holds that lane back until its
INSERT policy is read out of production) · **no pinned bar** (that edge already has five claimants,
which is what `lint-no-stacked-pinned-bars` exists to catch) · the pre-day call-sheet state and the
two-celebrations-in-one-day bridge.

✅ `tsc` **EXIT=0 ERROR_LINES=0** · unit **10541/10541** · db **1644/1644** · 11 lints exit 0 ·
**13 mutations, every one RED**. 🪤 One of them counted a needle the replacement kept as a
substring, so its **1 → 1** proved nothing even though the test went red — re-run with a real
counter (**0 → 1**). *A red result is not evidence the sabotage applied.*

<details><summary>The original S3 brief, kept for the record</summary>

**Opus 5 · high** · after S1+S2
🛑 **THIS IS A REDESIGN OF SOMETHING THAT SHIPS. THERE IS NO NEW PAGE AND NO NEW ROUTE.**
Owner, twice. The Event Hub stays the Event Hub; on the day a booked supplier opens the same
`/{slug}` everyone else opens and **their own tools are integrated into it**.
🔑 **Extend `app/[slug]/_components/vendor-doorway.tsx`.** Its own docblock is the specification of
what changes: it calls itself *"A DOOR, NOT A ROOM"* and says it *"carries NOTHING about the
event"*. On the day it stops being a door. **Before the day it stays exactly the link-out it is.**
🔒 **One line of that docblock must SURVIVE the redesign:** *"a supplier works many weddings; their
week, their invoices and their other clients do not belong inside one couple's page."* Bring THIS
event's tools. Bring nothing else.
⚠ **Its safety note stops being descriptive and becomes load-bearing.** It renders only from a
`VendorCapability` produced by `resolveVendorCapability`, with a compile-time assertion that no
visitor can smuggle one in. Today that guards a LINK. The moment it carries the run-of-show **it
guards event content, and the gate is the whole fence.**
✅ **OWNER ANSWERED 2026-08-27 — the private run-of-show notes DO show here.** Same notes, new
place; he turned down *schedule only* and *only during the event window*. Do not re-ask.
🔒 **Content comes from `get_vendor_event_brief` under the supplier's OWN session.** Authorization
reads may use the service role scoped by a session-proved id; **event content never does.**
🚨 **`/{slug}` reads with the service role**, so every RLS rule keeping a supplier out of the guest
list and the private schedule is **INERT there**. And the booked-supplier schedule policy has **no
public/private filter** — no-index the surface and add a test that fetches it anonymously.
**Port the drawing, do not redraw it** — only the typefaces change.

#### ⏩ WHAT LANDED AFTER THIS BRIEF WAS WRITTEN — build on it, do not re-derive it
This brief predates S1 and S2. Both shipped modules S3 must use, and re-deriving either is how the
third disagreeing answer to "is this shop booked?" gets written.

| Use | From | Why not your own |
|---|---|---|
| `viewerIsBookedSupplier(...)` · `loadVendorBooking(...)` | `lib/booked-supplier.ts` (S2) | The shared gate's supplier arm. It is already the thing that decides a supplier may be on `/{slug}` at all — the room's admission must agree with the door's, or a supplier gets through one and not the other. |
| `fetchVendorRoomEvents(client, vendorProfileId)` | `lib/vendor-room-access.ts` (S1) | **THREE** arms, not the two this plan specified. |

🚨 **AND S1 FOUND THE THING THIS PLAN GOT WRONG — the room's admission inherits it.** The plan said
filter on `lock_request_state = 'agreed'`. **`vendor_claim_locked_qr` never writes that column at
all** — verified by reading the live function body out of production, not the migration that created
it. So a supplier booked by locked QR, **money already moved**, fails that test. An admission written
from this plan's original two arms **locks the paid supplier out of the room.** Use S1's resolver.

🔑 **The strip still links away — 1 link-out site on `main`** — so nothing has pre-empted the
redesign, and the "before the day it stays a link" half is still exactly what ships.

⚠ **`loadVendorBooking` is `cache()`d per request**, so asking it again inside the room costs
nothing. Do not thread its result down through props to avoid a second call; that is how a prop
becomes the second definition.

</details>

### ✅ S4 — DONE. Do not rebuild. PR [#4913](https://github.com/iscasasola/setnayan-platform/pull/4913) · migration `20271174176372`
✅ **MERGED 2026-08-27T11:24:37Z AND SERVED** — `/api/health` self-reports `205a1ad`, the PR's own
merge commit, which is an ancestor of `origin/main`. **A merge is not a ship; this one is both.**
✅ **The migration is verified applied IN PROD BY THE OBJECT**, not by `schema_migrations`: the live
`vendor_claim_locked_qr` body calls `acquire_schedule_pools`, carries `EXCEPTION WHEN OTHERS`,
contains **no** `RAISE EXCEPTION`, and the `event_date_precision = 'day'` write still precedes the
acquire. 🔒 **The 2026-08-09 `COALESCE(source, 'vendor_locked_qr')` rule SURVIVED the rewrite** —
checked explicitly, because this change reproduced the whole function body.
⚠ Still re-verify with `gh pr view 4913 --json state,mergedAt` before acting — this corpus has been
wrong about a PR's state five times.
Built as the brief below specifies: the acquire is step (e), it resolves by category, and every
non-OK outcome degrades OPEN and warns. It additionally runs inside a plpgsql `EXCEPTION WHEN OTHERS`
subtransaction, because the brief's degrade-open rule covers the RPC's STATUSES and not a throw —
without it one bad calendar row takes the whole booking down.
🔑 **ORDERING TURNED OUT TO BE MORE LOAD-BEARING THAN THE DEGRADE.** The acquire must sit after the
block that narrows `event_date_precision` to `'day'`, because `acquire_schedule_pools` degrades open
without a day-precise date — hoisted above it, **every** claim returns `no_date` and reserves nothing
**while reporting success**. The guard asserts the ORDER, not the presence of the call; a
presence-only check passes against a function that reserves nothing.
🪤 **THE NEUTRALISATION CASE FAILED FIRST, AND WAS RIGHT TO.** Turning the degrade-open warning into
an abort did **not** refuse the claim — the `EXCEPTION WHEN OTHERS` handler swallowed the injected
abort. **A sabotage neutralised by the mechanism under test proves nothing**; reproducing the
regression took TWO changes, both counted. That failure is also what proved the handler is
load-bearing, so it is pinned now.
🔢 **Prod at build time: ZERO locked-QR tokens, ever** — none claimed, none pending, and zero
`event_vendors` rows sourced `vendor_locked_qr`. Defence-in-depth, exactly as the brief insists.
✅ Verified: new suite **7/7** · **whole db suite 1635/1635, exit 0** · `tsc` errors=0 **EXIT=0** ·
2 mutations printed **1 → 0**, both RED.
⏭ **FOUND HERE, NAMED NOT FIXED — belongs to whoever owns the vendor-acknowledge path:**
`vendorAcknowledgeDeposit` fires its schedule reservation with a **service-role** client, and
measured in prod with `auth.uid()` NULL all three arms of the acquire's authorization are false, so
it returns `not_authorized` and the call site swallows it. **The same silent no-op migration
`20271103100000` exists to prevent, reintroduced at the CALL SITE.** 🔑 *Widening a function's
authorization does not help a caller who arrives as nobody.* ⛔ Do not read prod's 3
reservation-less booked rows as evidence — all three lack a marketplace link and legitimately
resolve to `no_pools`.

<details><summary>The original S4 brief, kept for the record</summary>

**Opus 5 · medium**
**What a person gets:** a supplier booked by scanning the couple's locked QR — where money already
changed hands — gets a room like every other booked supplier, and their calendar and daily capacity
finally agree.
**Shape:** that claim writes the strongest status the enum has and **acquires no schedule pool — the
only booking path that does not.** Add the acquire **after** the upsert (the function finalises the
event date first, so a late refusal must roll the whole thing back). Resolve pools by **category**;
the row carries no service id.
⛔ **Every non-OK return must degrade OPEN and warn.** Aborting reads like correctness and refuses a
couple who has already paid, on a single-use token — one stale manual block is enough.
⛔ **Do not write "fixes a double-sell" in the PR body.** Defence-in-depth, not a live bug.

</details>

### S5 — The night-before email · **Sonnet 5 · medium** · ships OFF
✅ **BUILT 2026-08-27 — PR [#4915](https://github.com/iscasasola/setnayan-platform/pull/4915),
auto-merge armed. Do NOT rebuild it.** `SUPPLIER_NIGHT_BEFORE_EMAIL_ENABLED` ships OFF —
nothing sends until the owner gate below is answered and the flag is flipped. Reads only a
booked supplier's real registered-account email (`linked_vendor_profile_id`), never the
couple-typed `contact_email`. The two named traps are both handled: the call time is read off
its own stored wall-clock digits without re-zoning to Manila, and the job is wired into the
existing cron-free daily-email runner rather than the near-dead `after()` branch on `/{slug}`.

**What a person gets:** the night before, a booked supplier gets an email saying tomorrow is the
day, with the call time and a link straight into their tools.
🔴 **OWNER GATE, still open:** *may we email a supplier automatically at an address they never gave
us?* Today a person pressing send is what makes it allowed. **Build it switched off.**
🔑 **Email only** — 44 of the 45 supplier rows in production are names a couple typed, with no
account, and the vendor tree never writes a push subscription at all.
🔑 **THE NIGHT BEFORE, NOT THE MORNING OF.** The daily job gap is **20 hours**, so on a 24-hour day
the fire time walks backwards ~4h a day and settles at no particular hour — a day-of notice will
eventually land after the ceremony.
⛔ **Do not hang it on the `after()` already on that page** — it sits inside a scheduled-launch
branch and fires on approximately no page loads, so the job would ship dead with every test green.
⛔ **Do not force Manila time onto the stored call time** — that once emailed a 2 PM ceremony as
10 PM. **Take the idempotency lock BEFORE the send.** **No cron** — 16 jobs already run without one.

### ✅ S6 — DONE. PR [#4917](https://github.com/iscasasola/setnayan-platform/pull/4917), **MERGED 2026-08-27T14:21:44Z AND SERVED**. Do NOT rebuild it.
✅ **A merge is not a ship; this one is both** — production's `/api/health` self-reports `df74779`,
the PR's own merge commit, which is an ancestor of `origin/main`.
⚠ Verify with `gh pr view 4917 --json state,mergedAt` before trusting this line — this corpus has
been wrong about a PR's state five times. Merge commit `df74779` was checked with
`git merge-base --is-ancestor`, not read off the PR page.
🪤 **AND THE CI WATCH LIED ON THE WAY THERE.** `gh pr checks --watch --fail-fast` **exited 0** while
the one job that runs the whole suite was still pending — it had died on a GitHub **HTTP 503** and
reported completion. A session trusting that exit code would have called the run green with the
only meaningful job unfinished. ⇒ **poll the CHECK STATES, never a watcher's exit code**; the
replacement poller waits for `pending=0` and re-queries through a 503.

**RULE 0 paid a third time in this stream: the desk ALREADY SHIPS.** It is the "What's new" feed on
`/vendor-dashboard` — one list across all a shop's celebrations, oldest waiting first, assembled in
`lib/vendor-overview.ts`. **Nothing was redrawn.** The delta was what REACHES the list, and whether
the answer can be given ON it.

🚨 **THE ONE-STAR REVIEW IS FIXED, AND THE BRIEF UNDERSTATED IT — the desk could not TAKE the answer
either.** The card named an unanswered review and then linked away, which is the one thing a list of
answers you owe must not do with the answer it is asking for. Every unanswered review joins now at
any rating, with the reply box ON the row; the rating decides the words AND the colour through one
resolver, so a one-star can never wear a gold "praise" eyebrow, and an unreadable rating errs toward
care rather than congratulation.

🪤 **A LAPSED BOOKING ASK SAID "LAST DAY TO ANSWER" FOREVER — a live defect nobody had listed.**
Read out of the function body: `vendor_agree_to_lock` expires **LAZILY**, on the answer path, and
**no sweeper exists** — so a lapsed ask keeps `lock_request_state='pending'`, the query cannot tell
it from a live one, and the day count floors at 0. Pressing Agree returns `expired`. It is now its
own card kind: one grey line, in the same place, **no control at all**, gone after a week.
🔑 *A row that vanishes reads as one you answered; a button that refuses the person it is shown to is
worse than no button.*

**FOUR KINDS JOINED:** a reply owed in an **accepted** conversation (the commonest of all — the
enquiry lane is pre-accept only, and this is the exact thing we publish as that shop's reply speed;
asked of the last message's AUTHOR, never of an unread marker) · a **meeting time the couple
proposed** (deadlined by the meeting itself — a passed one becomes a closed line sorted by the time
that passed, so a tasting that already happened cannot claim the top of a waited-longest list) · a
**quote** and a **contract** written and never sent, which OPEN and never send (sending retires every
other live quote out with that couple; the contract MOVED off the separate open-task list rather than
being listed twice with two clocks).

🚨 **`--sn-warn` IS NOT A TOKEN AND NEVER WAS.** The booking-ask card named it for its accent bar and
its eyebrow; no stylesheet defines it, an undefined `var()` is **rejected, not thrown**, so the bar
drew nothing and the eyebrow inherited the body ink — a card whose own comment explains at length why
it is deliberately amber **has never once rendered amber**. Found by DERIVING the guard's token list
from the file rather than checking the colour I was editing. Same family as the undefined
`--font-serif`. Fixed to `--sn-warning` (fill) / `--sn-warning-deep` (text weight — the fill is
2.92:1 as text).

⛔ **THE FOUR STAY OUT, and are now recorded ONCE as data** (`ANSWERS_THAT_DO_NOT_JOIN`, which the
guard reads): the waitlist pick **does nothing and reports success** · a crew shift **cannot be
posted, seen or accepted by a non-admin** · **nobody can ask for a song** · a payment claim **has no
"no"** (that last one is an owner decision, not an engineering gap).

🔢 **Safe by arithmetic, measured in prod by query: 0 chat threads · 0 appointments · 0 proposals ·
0 draft contracts · 0 pending asks · 0 reviews.** Every new lane matches nothing today — and that
also means **none of it has been exercised by a real supplier**. ⚠ Zero rows is never the proof; the
pure rules and the guard carry the weight.
🔒 **Read out of PRODUCTION, not from migrations:** all three new reads' SELECT policies exist and
cover the vendor's own session, and `authenticated` holds SELECT at table level **and on every
column** (17/17 · 16/16 · 21/21) — a policy with no grant is dead, and `has_table_privilege` answers
*false* while column grants stand.

🛡 13 tests · **14 mutations, occurrence count printed before → after, ALL RED** — and **the mutation
run caught one of my own guards as decoration**: "every card kind is drawn" matched the kind name
anywhere in the file, which the card body's own `Extract<…{ kind: 'meeting' }>` signature satisfies,
so unmounting the branch left the count at 1 → 0 and the test GREEN. It asks about the DISPATCH now.
A 15th "mutation" reported nothing because its anchor matched three times. *Neither a red nor a green
result is evidence until you have counted.*
🔑 **The card kinds are DERIVED FROM THE UNION IN THE SOURCE, across BOTH files that declare one** —
the pre-accept enquiry card lives in its own module, so reading only the union block finds ten of
eleven kinds and reports a complete survey.
⏭ **NAMED, NOT FIXED:** the Upcoming list still keys React ids on `poolBookingId`, which an agreed
booking has none of (inherited from S1 — it needs a stable id first).

---

## THE RULES EVERY SESSION OBEYS

1. **RULE 0 first.** Grep for the noun before designing. In this stream it has already paid twice —
   the strip to redesign ships, and the console it ports is already phone-shaped.
2. **Build to a gate, stop at it, list it.** Never flip a production flag. Never make an owner
   decision.
3. **Mutate every guard and print the occurrence count before → after.** An unmeasured mutation
   proves nothing; five guards in this repo have shipped protecting nothing.
4. **Print the exit code beside the error count.** `tsc` has exited **134** and **143** in this
   repo while printing `errors=0`.
5. **Another session works this repo concurrently.** `git fetch` and read the tip before building;
   a generated file's merge conflict has no correct side — regenerate from the merged tree.
6. **Run the WHOLE db suite** for anything touching event types or policies, not one file.
