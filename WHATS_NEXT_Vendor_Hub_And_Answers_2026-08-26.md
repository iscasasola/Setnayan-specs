# WHAT'S NEXT — THE SUPPLIER'S ROOM IN THE EVENT HUB

> **Owner, 2026-08-26: _"do not start building. we will do this on what's next. just plan for now."_**
> **NOTHING IN § 3 IS BUILT.** Everything is measured against `origin/main` (`de0c557e3`).
> The room is DRAWN: [`prototypes/vendor_room_in_the_hub_2026-08-26.html`](prototypes/vendor_room_in_the_hub_2026-08-26.html)
> and its design is BINDING: [`Vendor_Room_Design_2026-08-26.md`](Vendor_Room_Design_2026-08-26.md) —
> **port it, do not redraw it.**
> ⚠ **This file was rewritten as ONE plan on 2026-08-26.** The earlier version recorded its
> corrections BESIDE the steps they corrected, which is the read-from-the-middle failure this
> project keeps paying for. **Every correction is now inside the step it affects.**

---

## THE SHORT VERSION — read this and stop, unless you are the one building it

**What we are doing.** On the day of a wedding, a supplier opens the couple's own link and lands in
their own workroom — the venue, how to get there, the running order, and the tools they already
have. Everyone else who opens that link sees the couple's page and never knows the room is there.

**Nothing needs you to start.** Seven of the nine steps are ours. Two need a word from you, and both
come late.

**The order, one line each:**

| | | Needs you? |
|---|---|---|
| 1 | Stop telling a booked supplier they have no event when they do | no |
| 2 | ✅ **DONE 2026-08-27 — PR #4891, merged.** Stop calling every host "the couple" | — |
| 3 | Make the check that catches that actually able to see new pages | no |
| 4 | ✅ **DONE 2026-08-27 — PR #4890, merged.** Stop treating a guest who scanned a QR as a host | — |
| 5 | Agree on one answer to "is this shop booked?" — there are two today | no |
| 6 | Stop bouncing booked suppliers off pages the app drew for them | no |
| 7 | ✅ **DONE 2026-08-27 — PR #4919.** The supplier's tools, integrated INTO the event hub on the day (not a new page — owner 2026-08-27) | — |
| 8 | A booking made by locked QR reserves its date like every other | no |
| 9 | The night before, email the supplier that tomorrow is the day | one question first |

✅ **STEPS 2 AND 4 ARE DONE — merged 2026-08-27, verified by `gh pr view`. Do NOT rebuild them.**
They were the two live problems and neither was about suppliers. Steps 1, 3, 5, 6, 7, 8 and 9 remain.

⚖ **AND THE OWNER RULED FURTHER ON STEP 2 THE SAME DAY:** a **host** and a **celebrant** are two
different people — *"there can be multiple hosts for every event, but the one celebratiing is the
celebrant that can be single, couple, or multiple people."* Built in PR #4896; it supersedes the
2026-08-18 "keep one noun, drop the person" compromise. See `DECISION_LOG.md` 2026-08-27.

**The two questions, when we get to them:**
- Before step 7 — **may a supplier read the couple's private run-of-show notes at the couple's own
  public web address?** They already read them inside their own dashboard. This changes *where*.
- Before step 9 — **may we email a supplier automatically at an address they never gave us?** Today
  a person pressing send is what makes it allowed.

**Everything below is the working detail.** It is written for whoever builds this, not for you.

---

## 0 · THE OWNER'S RULINGS — do not re-ask any of these

| Date | Verbatim | What it settles |
|---|---|---|
| 2026-07-02 | *"transfer the whole content of my service under the how you're doing row … make it more manageable"* | **My Services is NOT a menu.** He chose *"fully retire everywhere"* over keeping it for staff, knowingly. |
| 2026-07-12 | *"overview, my shop, my customers, my performance, BEO are all 1-page each with the different features integrated on that page"* | **Five rooms, one page each.** |
| 2026-08-16 | *"where the event proper runs… this is where we share information to the guests, **vendors**, etc."* | The Event Hub's audience **names vendors** — it always did. |
| 2026-08-26 | *"we also want to rearrange the vendor dashboard…"* → on the drawing, *"yes i agree."* | The re-sort. **SHIPPED — § 2.** |
| 2026-08-26 | *"event hub is the same on the day for vendors plus their special features. since everything will be communicated there."* | **A supplier's On the Day IS the Event Hub, plus their own tools.** This is § 3. |
| 2026-08-26 | *"the ones they were given."* | **A teammate reaches ONLY the events they were specifically granted.** An admin runs the shop and reaches all of it. |
| 2026-08-26 | *"do not start building… just plan for now"* | This document. |

🔑 **THE HUB RULING IS NOT A REVERSAL — it is the half never finished.** His own 2026-08-16 lock
already names vendors as an audience. What ships gives a booked supplier a one-line strip pointing
them **away**, and it **has never rendered for anybody** (0 marketplace bookings).

---

## 1 · WHAT SHIPS TODAY — measured, not inherited

**The shop dashboard:** 63 routes · 17 pure forwards · **46 real surfaces** behind **five**
destinations, identical on laptop and phone. The five keys `overview · customers · shop ·
performance · on-the-day` are read by **four** systems — the staff role filter, the
`vendor.sidebar.<key>` rename registry, the per-section localStorage, and the badge map — and
**three of the four fail silently.** ⚠ **The registry LABEL wins over the code's**, so a rename
lands in both files or it does not happen.

**"Event Hub" appears ZERO times** anywhere under `app/vendor-dashboard`. The ruling creates a
name where there was none.

🔴 **The link runs ONE WAY.** `app/[slug]/_components/vendor-doorway.tsx` — whose own docblock
calls it *"a door, not a room"* — points a booked supplier OUT. ✅ **But two supplier screens
already read a couple's event address and link straight to it** (`real-stories/page.tsx:109` ·
`recaps/page.tsx:103`), so there is **precedent to copy, not a mechanism to invent**. Both open
only AFTER the wedding, only for weddings, and only once the couple publishes.

**Roles** (`vendor_team_role`, `20260514010000:101`): **admin · agent · viewer**, plus a retired
`owner` that surfaces as *Admin*. 🚨 **An agent gets TWO rows on a laptop and ONE tab on a phone** —
`VENDOR_SCOPED_NAV_ITEM_KEYS` = `{overview, customers}` vs `VENDOR_SCOPED_BOTTOM_NAV_KEYS` =
`{profile}` (`lib/vendor-role.ts:126,141`). **My Customers, an agent's only operational surface, is
unreachable on the device suppliers actually work from.**

---

## 2 · WHAT SHIPPED 2026-08-26 — do NOT rebuild it

**PR [#4863](https://github.com/iscasasola/setnayan-platform/pull/4863) — MERGED 2026-08-25T21:22Z**,
verified by `gh pr view`. Overview → **Today** · My Customers ahead of My Shop · **Contracts +
Proposals into My Customers** · **services opens FIRST on My Shop** · the 14 tools on **three named
shelves** · "(BEO)" out of the menu. **Same five keys, nothing deleted, every href byte-identical.**

🚨 **Two surfaces were already in two places at once** — the phone bar lit *Customers* for
`/contracts` and `/proposals` while the laptop rendered them under *My Shop*. Ended, not started.

---

## 3 · THE PLAN — nine pieces, smallest first

> Each is independently mergeable and independently useful. **Corrections are folded in.**
> Three pieces are repairs that must land before the room mounts, and **one of those is a live
> disclosure that has nothing to do with suppliers at all.**

### PIECE 1 — The console stops telling a booked supplier they have no event
**After it:** a supplier who opens their day-of screen on the morning of a wedding they are booked
for is told the actual reason — the couple has not recorded the downpayment, or the booking was
released — instead of *"No event today."*
**Where:** `on-the-day/page.tsx:886-925`. When the booking list is empty, probe `event_vendors` for
this shop on an event dated today. Put the wording in a pure `explainNoRoom({hasRow, status,
wasReleased})` in a new `lib/vendor-room-access.ts` so it can be tested without rendering.
**Blocks nothing. Ship it first, alone.**

### PIECE 2 — The guest doors stop calling every host "the couple"
**After it:** a guest opening the invitation, the gift page or the photo check-in for a birthday,
a debut, a graduation or a **wake** reads the right word — and a funeral's gift page stops saying
*"a quiet way to help the family"* in one line and *"it goes directly to the couple's account"*
three lines below.
**Twelve rendered strings in four files, counted not estimated:**
- `app/join/[eventId]/_components/join-flow.tsx` — **NINE**, not six: `:15,17,19,20` (the role-error
  map) and `:107,135,229,248,274`. 🔑 **`:107` and `:135` are the SIGNED-OUT arm** — the branch a
  guest scanning a QR without an account actually lands in, **and the branch an earlier pass
  dropped.** The component is already an async server component holding the event id; one
  `await eventWordsForEvent(eventId)` covers all nine. **No prop, no default, no call-site change.**
- `app/_components/pabuya/pabuya-card-list.tsx:139` — give it a **required** `organizer` prop.
  **Required, not optional-with-a-default:** it has TWO guest-audience callers, the second being the
  couple's live preview of the guest view, whose whole point is that the two match byte for byte.
- `lib/face-gate.ts:190` — *"so the couple recognizes you."* **Return a reason CODE** and map it at
  the capture screen where resolved words already exist. That file must never grow event context.
- `app/[slug]/_components/editorial/data.ts:2035` — passes `{organizer}` and not `eventWord`, so
  four Papic prompts say "event" on the recap to a guest who answered them reading "birthday".

🔒 **The funeral noun is `family`, NOT `host`.** Any hardcoded fallback saying "host" is wrong for
the one event type this piece exists for.
**Blocks nothing. Independent of the room.**

### PIECE 3 — The wedding-word guard can see a new file · **BLOCKING**
**After it:** nothing directly — this is what stops the room shipping wedding words with nobody told.
**Where:** `app/[slug]/_lib/s13-is-finished.test.ts:99` matches its 26-key exemption list with
`rel.endsWith(k)` — **bare basenames**. `'page.tsx'` alone exempts **11 files**; `'actions.ts'`
exempts 4. **Measured: 36 of the 127 files in that tree — 28% — are exempt.** A room shipping a
`page.tsx` or an `actions.ts` under `app/[slug]/` is **born exempt and silently unguarded.**
Change to `rel === k` with tree-relative keys. ✅ **Re-running the detector over every currently-
exempt file produces ZERO new offenders** — a one-commit change with no behaviour delta.
**Add the second scan, sized honestly:** follow `.tsx` imports **three hops, prose only**. Measured
**11 hits in 3 files**; after Piece 2 the standing bill is the vendor shop page, correct for its
audience. ⛔ **Do NOT scan the transitive closure "for completeness"** — measured **1,189 hits,
~1,181 false.** *A guard that cries wolf teaches you to skim past the one time it is right.*

### PIECE 4 — "Host" means host · **BLOCKING, and it closes a LIVE leak**
🚨 **`lib/slug-access.ts:170-195` selects `member_type` and NEVER COMPARES IT**, returning
`Boolean(memberRow)`. **So any signed-in event member — including a guest who merely scanned the
event QR — is treated as a HOST.** They walk into the private sub-pages, and
`who-can-see-your-story.ts:110-113` returns true for a host **before** it tests the audience, so
**they can read the couple's unfinished keepsake story months before it is published.**
🔑 **This is the exact bug its twin `app/[slug]/_lib/host-scope.ts` was written to kill. The twin
was fixed and pinned; this clone never inherited it.** *A clone inherits the bug its twin fixed —
third instance in this repo.*
**Two things must ship in the SAME commit or the fix breaks people:**
1. `print/page.tsx:133` hardcodes `belongsToEvent: true`. ⛔ It **cannot be copied** from the guest
   tree — that route has no identity object at all. It has to be built.
2. Narrowing unmasks a divergence it was hiding: the shared gate **has no seat-holder arm for
   `private`** while the page does. **A seat-holder whose 60-day cookie expired would start being
   bounced off all seven sub-pages.** Add the seat-holder arm in the same PR.

### PIECE 5 — One answer to "is this shop booked?"
**After it:** a supplier who said yes and is waiting on the downpayment record stops being told they
have no event; and a supplier booked through a Locked QR — **money already moved** — stops being
invisible to every day-of screen.
**Where:** new `lib/vendor-room-access.ts` exporting `fetchVendorRoomEvents(client, vendorProfileId)`
— **id in, no session resolution inside.** 🔑 **Not a style choice:** a shipped path passes a
grant-derived id for a per-event GRANTEE who is not the vendor. A resolver that resolves the caller
from the session **breaks that role.**
· **Arm 1** = today's pool read, unchanged (`released_at IS NULL`).
· **Arm 2** = `marketplace_vendor_id` AND `lock_request_state = 'agreed'` AND status in the
**imported** `BOOKED_VENDOR_STATUSES` (never retype the four strings) AND `archived_at IS NULL`.
🔒 **`'agreed'` is unforgeable by the couple** — a trigger raises `42501` if `authenticated`/`anon`
writes it on INSERT **or** UPDATE, and only the agree RPC sets it.
**Swap ten call sites in six files. Leave thirteen readers on the raw pool read with a one-line
reason each** — they are about capacity, not the room. ⛔ **Especially the public shop page: arm 2
there would publish agreed-but-unpaid bookings to strangers.**

### PIECE 6 — A booked supplier passes the shared gate
**After it:** a booked supplier can open the venue page, the recap, the seat finder and the live hub
of a private celebration they are working on — instead of being silently bounced by doors **the page
itself was drawing for them.**
**Where:** the shared gate has three ways in and no supplier branch; the admission lives inline in
one page (PR #4483 corrected the ordering in exactly one file and touched no sub-route). **All seven
sub-routes bounce.** Move the booking read into a new `server-only` `lib/booked-supplier.ts` and add
Path D for **both** closed visibilities. 🔒 **Keep the return a plain boolean** so a refused supplier
gets byte-identically what a stranger gets.
⚠ Also fix the comment that justifies a shortcut with *"the gate at the top has ALREADY proved the
answer is yes"* — a later path made that false, so **the money-gift card is drawn for a supplier the
money-gift page refuses.**
**Must not merge before Piece 4.**

### ✅ PIECE 7 — THE ROOM · **BUILT 2026-08-27, PR [#4919](https://github.com/iscasasola/setnayan-platform/pull/4919)** (auto-merge armed). Do NOT rebuild it.
> **Built as the correction below specifies: no new page, no new route.** The doorway strip opens
> IN PLACE from the day the celebration begins until 06:00 the morning after it ends, carrying the
> venue and its address, the running order live, the whole running order with the organiser's
> private lines **shown and marked**, the live headcount and their own tools; byte-identical to
> before on every other day. Full write-up, with the two findings it produced, in
> [`WHATS_NEXT_Suppliers_Room_SESSIONS_2026-08-27.md`](WHATS_NEXT_Suppliers_Room_SESSIONS_2026-08-27.md) § S3.
> 🚨 **The shortcut in § 4 was real and was measured:** `get_vendor_event_brief`'s `timeline` is one
> fewer round trip and carries the **coordinator-only** lines the booked-supplier policy excludes,
> because the function is `SECURITY DEFINER` and that select has no visibility filter at all.
> 🔴 **TRAP #4 HAS A NAMED CULPRIT NOW, and it is not the one I first reported.** The single
> production row where the two columns are apart is a **seeded test fixture** (`SONGDESK TEST`), so
> nobody is affected — my first write-up called it a live victim and that is **withdrawn**. Read out
> of production: every real booking path stamps both columns **except `vendor_claim_locked_qr`**,
> which sets `marketplace_vendor_id` and never mentions the other — **the path where money has
> already moved**, and the same defect #4488 fixed in its twin. Fixed separately; **no owner
> decision needed**. What IS the owner's is the teammate-grant arm, because that one widens
> `belongsToThisEvent`.
> ⚠ The teammate-grant arm of the admission below is therefore **NOT built** — same reason.

🛑 **CORRECTED 2026-08-27 BY THE OWNER, TWICE, BEFORE A LINE WAS WRITTEN — THIS IS A REDESIGN, NOT A
NEW PAGE.** *"we are redesigning not placing a new page."* Then, plainly: *"on the day. is the
integration of the vendors to the event's event hub. so we would still want to to be an event hub."*
⛔ **So there is NO new route.** The Event Hub stays the Event Hub; on the day a booked supplier
opens the same `/{slug}` everyone else opens and their own tools are **integrated into it**. This
matches his original 2026-08-16 wording — *"event hub is the same on the day for vendors PLUS their
special features"* — which the sentence below had quietly turned into a second product.
🔑 **AND THE THING TO EXTEND ALREADY SHIPS:** `app/[slug]/_components/vendor-doorway.tsx`, the strip
a booked supplier already sees on the couple's page. Its own docblock calls it *"A DOOR, NOT A
ROOM"* and says it *"carries NOTHING about the event"*. **That docblock is the specification of what
changes** — on the day it stops being a door and becomes the room, in place. Before the day it stays
exactly the link-out it is now, and one of its stated reasons still holds and must survive the
redesign: *"a supplier works many weddings; their week, their invoices and their other clients do
not belong inside one couple's page."* Bring THIS event's tools; bring nothing else.
⚠ **Its safety note becomes load-bearing rather than descriptive.** It renders only from a
`VendorCapability` produced by `resolveVendorCapability`, and a compile-time assertion proves no
visitor can smuggle one in. Today that guards a link. **The moment it carries the run-of-show it
guards event CONTENT**, so the gate is the whole fence.

~~**Where:** new route under the event's address (a sub-path, so it cannot collide with reserved
words).~~ **Admission — do not invent one; mirror the shipped grant pattern:** the shop is booked
(Piece 5) **AND** the caller either manages the shop **or holds a live grant for THIS event**.
⛔ **A bare team-membership union looks equivalent, is shorter, and silently retires per-event
grants — which the owner has now ruled against. Do not write one.**
🔒 **Refusal is a redirect. Never a message, never a body that differs from a stranger's.**
🔒 **The three facts come from `get_vendor_event_brief` under the supplier's OWN session.** The
distinction to hold: *authorization* reads may use the service role scoped by an id resolved from
the session; **event content never does.**
**Port the console, do not rebuild it** — it is already phone-shaped, and only the typefaces change.
**Must not merge before Pieces 3, 5 and 6.**

### PIECE 8 — A Locked-QR booking reserves its date
**After it:** a supplier booked by scanning the couple's locked QR — **where money has already
changed hands** — gets a room like every other booked supplier, and their calendar and daily
capacity finally agree.
**Where:** that claim writes the strongest status the enum has and **acquires no schedule pool — the
only booking path that does.** Add the acquire **after** the upsert (the function finalises the
event date first, so a late refusal must roll the whole thing back). Resolve pools by **category**;
the row carries no service id.
⛔ **Every non-OK return must degrade OPEN and warn.** Aborting reads like correctness and **refuses
a couple who has already paid, on a single-use token** — and one stale manual block is enough.
⛔ **Do not write "fixes a double-sell" in the PR body.** It is defence-in-depth, not a live bug.

### PIECE 9 — The eve-of notice · **OWNER GATE**
**After it:** the night before, a booked supplier gets an email saying tomorrow is the day, with the
call time and a link straight into their room.
🔑 **Email only. Push cannot reach these people** — 44 of the 45 supplier rows in production are
names a couple typed into a list with no account, and **the vendor tree never writes a push
subscription at all.**
🔑 **THE LOAD-BEARING CORRECTION: send it the NIGHT BEFORE, not the morning of.** The daily job gap
is **20 hours**, so on a 24-hour day the fire time **walks backwards ~4h a day** and settles at no
particular hour — **a day-of notice will eventually land after the ceremony.** An eve-of notice is
correct whether it lands at 03:00 or 22:00.
⛔ **Do not hang it on the `after()` that already exists on that page** — it sits inside a
scheduled-launch branch and **fires on approximately no page loads**, so the job would ship
effectively dead with every test green.
⛔ **Do not force Manila time onto the stored call time** — that mistake once emailed a 2 PM
ceremony as 10 PM.
**Take the idempotency lock BEFORE the send** — the candidate is date-keyed and vanishes tomorrow,
so an unstamped failure is a lost send, not a retry.
**No cron.** This repo removed its last scheduler on purpose and 16 jobs already run without one.

---

## 4 · THE TEMPTING WRONG TURN, PER PIECE

Each of these is short, works immediately, and is wrong.

| Piece | The shortcut | Why it is wrong |
|---|---|---|
| 1 | A generic *"no booking found"* | The two reasons are different sentences and **telling them apart is the whole value.** And reading that table with the caller's own session "to be safe" returns empty — **the screen goes back to lying with a clean conscience.** |
| 2 | A prop with a `'host'` default | Wrong twice: **a default hides the second caller** (the couple's live preview would read *"the host's account"* while guests read *"the couple's"*), and **`'host'` is the wrong word for a funeral** — it says *"the family"*. |
| 2 | Push event context into the vision helper | That file is a pure helper. **Giving it an event is how the next leak gets written.** |
| 3 | Change `endsWith` to `===` and push | A third test in the same file looks the old bare names up as **exact keys** and goes red. |
| 4 | Narrow "host" and stop | **It starts bouncing seat-holders whose cookie expired off all seven sub-pages** — the over-wide host check was masking a missing arm. |
| 5 | Gate on status alone | `contracted` is the documented **soft hold**, and **three couples may hold one date** — that hands a shop three rooms for one day, for couples it never agreed to. |
| 5 | Add an `is_booked` column | The agreed state is already unforgeable and already clears on unlock. **A new column is a fifth answer to a question that already has four.** |
| 6 | Admit on the presence of the link column | A shortlist mints a linked row — **that lets an asked-but-not-agreed supplier into a private celebration.** |
| 6 | Return a reason object so sub-pages can explain the refusal | **Every one of those refusals is what a stranger sees. Changing its shape is how the room's existence leaks.** |
| 7 | Use the admin client already in scope | **One line, works immediately, and permanently removes the database's opinion about who may see the venue address.** The single worst mistake available in this stream. |
| 7 | Union the shop's team members | Looks equivalent, is shorter, **silently retires per-event grants** — which the owner ruled against on 2026-08-26. |
| 7 | Redraw the console because it looks wrong at the new typefaces | **A delta between the room and the shipped console is a defect in the port.** |
| 8 | Abort the claim when the date is blocked | Reads like correctness; **refuses a couple who has already paid, on a token they cannot re-scan.** |
| 9 | Send it on the morning of | The 20-hour job gap walks the fire time backwards — **it will eventually land after the ceremony.** |

---

## 5 · THE GUARDS — every new one with its sabotage and the count that must move

**Existing checks that will fire.** Any file under the event-address tree → the wedding-words guard,
the words-are-mounted guard, the first-byte guard (a new route must not commit a 200 before it
redirects), and the lost-controls baseline (**regenerate it and prove the regeneration absorbs no
real removal**). Any door drawn or refused → four door guards. Any new RPC call → the argument-name
guard and the has-callers guard. Any status literal in a query chain → the guards-can-fire test.
A new `lib/` module → the server-only boundary lint. A migration → four migration guards. The room's
phone layout → the stacked-pinned-bars lint plus three contrast guards. The email → the link lint.

⚠ **Wiring a new lint into CI takes THREE edits** — the step, the env binding, and the check line.
**Miss one and it runs and can never fail the job.**

| Piece | New guard | Sabotage | Count → expected |
|---|---|---|---|
| 1 | three distinct refusal sentences | make it always return the generic one | distinct returns **3 → 1** · RED |
| 2 | a **count** of resolved-noun sites in the join door ≥ 9 | revert one signed-out string | `the couple` in that file **0 → 1** · RED |
| 2 | the required `organizer` prop | drop it at the preview call site | **typecheck fails** — that IS the guard |
| 3 | the rewritten exemption match + the 3-hop scan | add a room page saying *"Ask the couple…"* | offenders **0 → 1** · RED. Then revert `===` to `endsWith` with the same file present → **1 → 0**, proving exactness is what catches it |
| 4 | pin **both** twins by source | delete the member-type filter | `member_type` inside an `.in(` across the two files **2 → 1** · RED |
| 4 | the print route does not preview a draft | make the belongs-to-event flag literal `true` again | literal occurrences **0 → 1** · RED |
| 5 | seeded both directions | delete the agreed filter from arm 2 | rows for the contracted-not-agreed fixture **0 → 1** · RED. Then delete the released filter from arm 1 → **0 → 1** · RED |
| 6 | **feed ONE fixture to both gates and assert they agree across all five identities** | delete Path D | supplier fixture: gate `true → false` while the page stays `true` · RED |
| 7 | the room never uses an admin client for event content | add one admin event read to the room body | matches **0 → 1** · RED. Then replace the grant check with a team read → an **ungranted teammate goes refused → admitted** · RED |
| 8 | a blocked date still completes the claim | make the acquire abort | claims completed on the blocked fixture **1 → 0** · RED |
| 9 | one send per supplier per event, lock before send, UTC formatter | force Manila time | printed hour shifts by **8** · RED. Then run twice in one window → sends **1 → 2** · RED |

🔑 **Two rules on every mutation above.** **Print the occurrence count before → after** — five guards
have shipped in this repo protecting nothing, and every one was found by counting, not by review.
**And when a well-formed sabotage reports GREEN, suspect the sabotage before the guard** — three
separate sabotages here have printed 0→0 and read as clean passes.

---

## 6 · WHAT IS FIXED FIRST, OR NOT AT ALL

1. **The wedding-word guard must become exact before the room mounts.** Under basename matching
   **28% of that tree is already exempt**, and a room shipping a `page.tsx` is born unguarded.
2. 🚨 **"Host" must be narrowed before the shared gate is widened — and it is the one genuinely
   urgent item in this stream.** Adding a supplier branch to a function whose host check admits any
   QR-scan guest is widening a door that is **already too wide**, and that same function is what
   lets that guest read the couple's unfinished keepsake **today**.
3. **The seat-holder arm ships in the same commit as the narrowing.** Not a follow-up — without it
   the fix bounces exactly the people the page was written to admit.
4. ⛔ **The camera does NOT move into the room yet.** Until somebody reads the capture INSERT policy
   out of production and writes down what its "booked event" predicate is: if it is booked-status-
   shaped, arm 2 hands an **unpaid supplier a live camera spending the couple's credits**; if it is
   pool-shaped, the shutter is refused with no error. **The lane is flag-dark, so waiting costs
   nothing.**
5. **Read three function bodies OUT OF PRODUCTION before writing Pieces 5 or 8** — not out of the
   migration files. All three are `CREATE OR REPLACE`, and an existing db test already runs that
   query shape; extend it rather than inventing one.

---

## 7 · WHAT NEEDS THE OWNER — sorted by when, not by importance

**Nothing blocks the start.** Steps 1–6 and 8 are ours.

### Before step 7 — the room opens

✅ **ANSWERED 2026-08-27 — YES: the same notes, in a new place. Do not re-ask.**
Owner chose it over *schedule only* and *only during the event window*, both of which are recorded
in `DECISION_LOG.md` as turned down so they are not re-proposed. The safety comes from the DOOR, not
from thinning the content: the room refuses everyone who is not a booked supplier (or a teammate
holding a live grant for THIS event) with a redirect byte-identical to a stranger's, and the page is
no-indexed. A guest, a stranger and a supplier who was only ASKED never learn it exists.

~~**May a supplier read the couple's private run-of-show notes at the couple's own public web
address?** They read them today inside their own dashboard, marked *don't read aloud*. This changes
*where* they are shown, not who sees them — and the where is a public address.~~

### Before step 9 — the eve-of email

**May we email a supplier automatically at an address the supplier never gave us?** Today a person
pressing send is what makes it allowed. Removing the press removes the basis. It ships switched off
until he says.

### ✅ ANSWERED 2026-08-27 — five of these are CLOSED. Do not re-ask them.

| His words | What it settles |
|---|---|
| *"no paid booking fee, no connect."* | **The vendor's booking fee to Setnayan is the entitlement to be connected at all** — not the couple's deposit, not a subscription tier. ⚠ **Two readings, and they differ by every booking we have — see below.** |
| *"no. their papic service is only for documentation of their products."* | **A supplier's camera documents their OWN WORK, never the guests.** A narrowing of a lane that has been LIVE since 2026-07-16. 🔑 **It is a policy and no filter can enforce it** — a photograph of a cake or a dressed room has guests in it. Say it on the capture screen, say it to the couple, keep those frames out of guest face-matching, review on that basis; never promise a guest they will not appear. |
| *"the staff who handles the event will handle the event fully but the vendor owner also has access to oversight all their business."* | **The granted teammate gets the same desk on that celebration; the owner gets it on all of their bookings.** 🔒 That gate also feeds *"one of the people of this celebration"*, which unlocks a keepsake story the organiser kept private — *"fully"* answers that yes, and it ships with the fact named. |
| *"yes this is free to use for as long as they pay the booking fee."* | **The day-of tools are FREE.** Same axis as the first row: the fee is the entitlement. Supersedes *"should the day-of kits be free during launch"*. |
| *"no."* | **A couple may NOT switch a supplier's desk off.** Struck, not deferred. |

🔴 **THE ONE THING STILL OPEN IN THIS BLOCK — *"no paid booking fee, no connect"* HAS TWO READINGS.**
The fee is **flag-dark** and production has **0 fee charges ever** against **13 booked suppliers**.
**(a)** *a fee that is OWED and UNPAID blocks the connection* — cuts nobody off, because his own
2026-07-25 model makes a verified shop's **first 5 sourced bookings free** and BYO / vendor-invited /
returning clients **free forever**, so nothing owes anything today. **(b)** *no fee has been paid, so
nobody connects* — **disconnects all 13**, his own test shops included.
⇒ **Proceeding on (a)**, the only non-destructive reading and the one consistent with the locked fee
model — but it is his sentence, so it is being put back to him rather than assumed. ⚠ **A gate on
money must fail OPEN on a read error**, never closed: a broken read that locks a supplier out of a
wedding they are working is worse than a fee going uncollected for a day.

🔴 **AND ONE QUESTION CAME BACK AS A QUESTION:** on the night-before email he asked **_"email for
what?"_** — so the S5 gate is **still shut**. The answer owed him: *the night before a celebration
they are booked for, a shop gets one message saying tomorrow is the day, with their call time and a
link straight into their tools* — nothing else, once, and only to a shop with a real account.

### Not urgent — answer whenever

- ⚖ **RE-ANSWERED ON A DIFFERENT AXIS 2026-08-27 — *"no paid booking fee, no connect"*. The money
  that decides access is what the SHOP owes US, not what the couple has paid them.** The original
  framing is kept below because the measurement in it is still true. ~~A
  soft-hold supplier **already** gets the run-of-show and the couple's song picks — including up to
  three competing shops on one date. Either that is the boundary you meant, or it is wider than the
  room. No measurement settles it.
- **Does "booked" mean the deposit, or the supplier's yes?** The plan answers *either*, which bends
  your 2026-06-12 deposit-fact wording for this one purpose. Defensible — the room is not capacity —
  but it is your word.
- ~~**Should the day-of kits be free during launch?**~~ ✅ **ANSWERED 2026-08-27: free, for as long
  as they pay the booking fee.** The entitlement is the fee, not a plan.
- ✅ **ANSWERED 2026-08-27 — "yes. they can declare it."** Do not re-ask. ⚠ And the question's own
  premise was wrong: the refusal existed and worked; it was **unreachable from the desk**, which is
  what shipped. 🔴 What IS still his: whether that refusal should keep **wiping the couple's own
  record of paying** (it clears their markers and proof and deletes their ledger row today).
- **The console in the wedding lettering.** Only the typefaces change at the new address; the
  colours survive. A type call, nothing more.
- **Should the eve-of email also reach the couple and the coordinator?** Scoped to suppliers here.
- ~~**Should the couple be able to switch the room off for one supplier?**~~ ✅ **ANSWERED
  2026-08-27: no.**

⛔ **RETIRED BEFORE IT REACHED HIM — do not ask it.** *"Does the room close at midnight?"* He already
decided it inside the feature: the photo route's own header reads *"THE SHUTTER IS DAY-BOUND.
LOOKING BACK IS NOT — at midnight the door shut on the photographer's own pictures, and the next
morning, which is exactly when they want to confirm a shot landed, it was closed."*

---

## 8 · HOW YOU WOULD KNOW IT WORKED

**What a person can do that they cannot today.** A shop the couple has actually booked opens the
couple's own event address on the day and lands in their own room — venue, how to get there, the
running order, their day-of tools — **on a phone, without an account switch.** The teammate that
shop granted access for *that one event* sees the same room; a teammate granted nothing sees the
front page. A shop that was only asked, a shop whose booking was released, and anybody else sees the
front page and **never learns a room exists.** And the night before, the booked shop gets an email
saying tomorrow is the day, with the link.

🔑 **Production holds no launched non-wedding event, no linked supplier and no orders. Zero rows is
never the proof.** So:

1. **Seed the five identities and assert BOTH gates agree** on each — guest cookie · host ·
   seat-holder · invited account · booked supplier. **This is the only test that can catch the
   failure this stream exists to close: a rule written twice, one copy laxer.**
2. **Seed four booking shapes and assert the room opens for exactly two.** Then mutate each filter
   and confirm the count moves.
3. **Seed a granted and an ungranted teammate on the same shop and event.** Granted → room.
   Ungranted → **the same redirect a stranger gets, byte for byte.**
4. **Assert by source scan that the room never uses an admin client for event content**, then
   sabotage it and confirm the scan goes red.
5. **On a preview deploy, create one birthday and one wake**, then open the invitation door, the
   gift page and the photo check-in on each **and read them.** Nothing should say *"the couple"*,
   and the wake should say *"the family"* in both places on the gift page. **This is the one item
   that cannot be settled from source, because the failure is a sentence a person reads.**
6. **Claim a Locked QR against a blocked date** and confirm the claim still completes, a reservation
   exists afterwards, and the warning is in the logs.
7. **Run the eve-of job twice in one window** against a seeded supplier with a real inbox and assert
   in order: the claim row is stamped · the idempotency row exists · **the message is in the
   inbox** — then that the second run sends nothing. 🔑 **A test that only asserts membership of a
   set proves nothing: eleven green tests once passed about notification types the database had
   never had.**
8. **After each merge, check `/api/health` against the merge commit.** A merge is not a ship.

---

## 9 · THE ANSWERS DESK — ✅ BUILT 2026-08-27, PR [#4917](https://github.com/iscasasola/setnayan-platform/pull/4917)

> ✅ **DO NOT REBUILD IT.** Rows 5 · 10 · 11 · 17 · 18 shipped, row 3 already said what disappears,
> row 6 got its sentence, and rows 8 · 13 · 15 · 16 are recorded as deliberately absent in
> `ANSWERS_THAT_DO_NOT_JOIN` (`apps/web/lib/answers-desk.ts`), which the guard reads. The full
> account is the S6 section of
> [`WHATS_NEXT_Suppliers_Room_SESSIONS_2026-08-27.md`](WHATS_NEXT_Suppliers_Room_SESSIONS_2026-08-27.md).
> ⚠ Verify with `gh pr view 4917 --json state,mergedAt` before trusting this line.
>
> 🔑 **RULE 0: the desk was never a new page** — it is the "What's new" feed that already ships on
> `/vendor-dashboard`. Nothing here was redrawn.
> 🪤 **THIS SECTION MISSED A LIVE DEFECT that the build found:** a booking ask that has LAPSED kept
> rendering as answerable and saying *"Last day to answer"* forever, because expiry in this product
> is **lazy** — flipped only on the answer path, no sweeper — so the query cannot tell a dead ask
> from a live one and the day count floors at 0. § 9's "what the list does when a window closes"
> described the remedy without knowing the window never actually closed.
> 🪤 **And a second:** `var(--sn-warn)`, the amber this desk's booking-ask card is painted with, is
> **not a token and never was** — so that accent bar drew nothing and its eyebrow inherited the body
> ink. Rejected, not thrown.

> It touches NONE of the nine pieces above and NONE of the six things fixed first. It is what the
> owner actually complained about. **Sixteen kinds of answer, six doors, two to four taps deep —
> while we publish every shop's reply speed on their public card.**

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
| 8 | Somebody says they paid you | ✅ **BUILT 2026-08-27** — owner: *"yes. they can declare it."* Both conditions shipped: the row carries the receipt (*"See what they sent"* — `proofUrl` had been fetched into that card since it was written and **never rendered once**, so the answer was made blind) and a second button behind a fold. 🔑 **THIS ROW'S PREMISE WAS WRONG: the "no" was ALREADY BUILT** — `vendorRejectDeposit` → the `reject_vendor_deposit` RPC, with an ownership gate, a single-winner UPDATE and a reason that reaches the couple, wired to a control on the supplier's customer card. **The DESK had no no**; the mechanism did. A 334-line duplicate migration was written and deleted on finding it. 🔴 **STILL THE OWNER'S:** that RPC **wipes the couple's own record of paying** — it clears the markers and the proof URL and DELETES their ledger row (matched on a `notes LIKE '%awaiting vendor confirmation%'` substring, unscoped by amount or date), so after a refusal their screen looks as though they never recorded anything and the only trace is the email |
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


---

## 10 · THE TRAPS — every one of these has already cost this project time

**1 · 🔒 THE FORBIDDEN WORKAROUND IS ALREADY IN YOUR HAND.** The couple's page reads with the
**service role**, and every loader takes an admin client. **Every permission rule keeping a supplier
out of the guest list, the coordinator broadcasts and non-public schedule blocks is inert there.**
The 2026-07-29 owner ruling forbids reaching for the admin client to get around it — **and here you
do not reach; it is already in scope.**

**2 · 🔴 THE COUPLE'S PRIVATE CUES AT A PUBLIC ADDRESS.** The policy letting a booked supplier read
schedule blocks has **no public/private filter** — it excludes only coordinator-only lines — and the
consumer renders private lines **marked, never hidden.** The anonymous policy on the same table
*does* filter. **So the room would render, at a public web address, content deliberately withheld
from anonymous readers.** Mitigation: no-index, redirect anyone without a committed booking, **and a
test that fetches the room anonymously and asserts zero block text.**

**3 · The doorway grants on a LINK, not a booking — live today.** A shortlisted supplier on a public
event is told *"You are booked here"* **and is then refused by the page the strip links to** — a
control that refuses the person it is shown to. 🪤 **Why it survived:** its test only ever feeds the
safe values. *A test that never supplies the dangerous value cannot fail on it.*

**4 · Two columns, one question.** The hub filters one link column, the brief filters another.
Benign today because three writers set both — but one migration sets the first from the second and
**never writes the second**, so divergence can run the other way: **the hub admits where the brief
refuses.**

**5 · The clock says three things.** Three screens say the day-of window is "T-1h → T+8h"; the real
gate is the whole civil day. **The dead numbers survive in five places** — including a docblock
sitting 120 lines below the block recording the widening.

**6 · Multi-day.** The booking machinery reads only the event's FIRST day while an end-date column
exists and **is never consulted** ⇒ *on day two of a three-day celebration the hub is live and the
room is shut.* **Do not specify the room's gate on the first day.**

**7 · CSS scope collision.** The console's recipes are descendant selectors of the editorial scope
*because* they are unreachable from a dashboard, and one component recomposes them from root tokens
for the same reason. Inside the couple's tree **both start matching.** ⛔ **Do not unscope them** —
that makes them match on every marketing and dashboard page.

**8 · 🪤 A GENERATED FILE'S MERGE CONFLICT HAS NO CORRECT SIDE.** This stream lost a CI run to it:
the lost-controls baseline conflicted on a rebase, taking one side left it describing a tree that no
longer existed, and the guard failed in CI having passed locally an hour earlier. **Regenerate from
the merged tree, then read the diff line by line.**

**9 · 🪤 `npx tsc` ABORTS AT EXIT 134 WHILE PRINTING `errors=0`.** The repo's own script sets a
larger heap. **Print the exit code beside the error count.**

**10 · 🪤 Under `tsx --test`, an `@/lib/…` import can hand back a module with EMPTY named exports**,
so a new guard's loop ran zero times and **reported a pass.** A floor caught it; a relative import
fixed it.

**11 · 🪤 A single `deepEqual` pinning an owner-locked SET and a re-cuttable ORDER together** makes a
legitimate re-order read as a lock being broken. **That is how a real guard gets weakened by somebody
in a hurry.** Split them.

**12 · ⚠ Another session works this repo concurrently.** `origin/main` moved three times in one hour
during this stream. **`git fetch` and read the tip before building.**

**13 · Claims that DID NOT SURVIVE the skeptics — do not build on any of them.**
⛔ *"The Event Hub is owner-locked read-only."* **REFUTED** — the actual 2026-07-26 ruling is the
reverse, and host editing already ships there. **Do not stall on a lock that is not there.**
⛔ *"The proposal reply is the supplier's answer."* **It is the couple's, enforced in SQL.**
⛔ *"Guests submit song requests."* Both routines have **zero application callers.**
⛔ *"The couple can file a day-of request."* **Zero writers** for the couple and host lanes.
⛔ *"Manpower gigs are a pending queue."* **Inert end-to-end for non-admins.**
⛔ *"The Event Hub communicates nothing to a supplier."* **False** — a supplier is an enumerated
audience for event-scoped stories.
⛔ *"That nav resolver has zero production consumers"* (**its own sibling docblock**) — it has two.
⛔ *"The floor items are switched off in production."* **Contradicted in-repo, and the grep behind it
could not match.** Read it out of production; **do not build the dark branch as the main case.**

---

## 11 · HOW THIS PLAN WAS MADE, AND HOW MUCH TO TRUST IT

**Four passes, 64 agents, 0 errors.**

1. **Seven readers** mapped one slice each. **Every finding was handed to an independent reader told
   to refute it. 17 claims died.**
2. **A completeness critic** was set on the resulting plan and **broke it three ways.**
3. **The critic was then attacked too** — its four load-bearing gaps each handed to a skeptic told to
   refute them or show they were the wrong size. **Two shrank. Two grew.** Three sweeps over ground
   nobody had covered — before and after the day, how a supplier is REACHED, and the phone — found
   **sixteen more things.**
4. **Four unknowns were closed by measurement**, each answer then attacked for whether the
   recommendation would actually work. **This document is the result.**

⚖ **EVIDENCE GRADE.** The critic re-opened a sample of citations and reported them accurate:
*"The plan's citations are accurate — I spot-checked six and all held. The failures are of COVERAGE,
not accuracy."* **So the file:line references are reliable. Completeness is what needed four passes.**

🛑 **WHAT IS STILL NOT COVERED, stated plainly:**
- **Eight of the critic's twelve gaps remain unchallenged.**
- **Nothing has been measured against production** — every claim is read from source at one commit.
  Prod is pre-launch, so **no part of this has been exercised by a real supplier on a real event day.**
- **No piece is sized**, and there is no sequencing against anything else in flight.
- **The desk's sort order is unproven** — oldest-first is asserted; nobody checked whether *waiting
  longest* and *most urgent* are the same thing. **Two of the sixteen kinds carry a hard deadline;
  the rest do not.**

🔑 **THE LESSON WORTH MORE THAN THE PLAN.** The first pass was accurate about every file it opened
and wrong about what it had not opened. **A search that can only match one spelling is not a survey**
— and *"no supplier screen reads a couple's event address"* rested on one grep that two shipped
screens would have failed. **Attack the auditor, not just the code.**
