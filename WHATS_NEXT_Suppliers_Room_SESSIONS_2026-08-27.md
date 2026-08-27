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

**Five sessions, plus one that is its own stream.** One is already done.

| | What a person gets | Model | Effort | Runs after |
|---|---|---|---|---|
| ✅ **S0** | A booked supplier stops being told "No event today" | — | — | **DONE** |
| **S1** | One honest answer to *"is this shop booked?"* | **Opus 5** | **high** | — |
| **S2** | A booked supplier gets through the door on a private celebration | **Opus 5** | **high** | S1 |
| **S3** | **The vendors are integrated into the Event Hub on the day** | **Opus 5** | **high** | S1 · S2 |
| **S4** | A booking made by locked QR holds its date | **Opus 5** | **medium** | — |
| **S5** | The night-before email (ships switched OFF) | **Sonnet 5** | **medium** | — |
| **S6** | The Answers Desk — its own stream, can start today | **Opus 5** | **high** | — |

**Never more than two at once** (10 parallel builds once shipped 44 defects).
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

### ✅ S0 — DONE. Do not rebuild.
A booked supplier waiting on a downpayment record is no longer told "No event today"; they are told
which of the two things is true. **Its guard found a SECOND rendered copy of the same false sentence
elsewhere on that screen** — count rendered sites, never trust that one branch is the branch.

### S1 — One honest answer to "is this shop booked?" · **Opus 5 · high**
**What a person gets:** a supplier who said yes and is waiting on the downpayment stops being
invisible; a supplier booked through a locked QR — money already moved — stops being invisible to
every day-of screen.
**Shape:** `fetchVendorRoomEvents(client, vendorProfileId)` in the existing
`lib/vendor-room-access.ts`. **Id in, client in, no session resolution inside** — a shipped path
passes a grant-derived id for a per-event grantee who is not the shop, and a resolver that reads the
caller from the session breaks that role.
⛔ **Swap ten call sites; LEAVE THIRTEEN on the raw pool read with a one-line reason each** — they
are about capacity, not the room. **Especially the public shop page: the new arm there would publish
agreed-but-unpaid bookings to strangers.**
🪤 **`BOOKED_VENDOR_STATUSES` EXISTS TWICE** — `lib/vendors.ts` (typed) and `lib/event-deletion-gate.ts`.
Import the typed one; do not retype the four strings, and say in the PR which copy you took.

### S2 — A booked supplier gets through the door · **Opus 5 · high** · after S1
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

### S3 — The vendors are integrated into the Event Hub on the day · **Opus 5 · high** · after S1+S2
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

### S4 — A booking made by locked QR holds its date · **Opus 5 · medium**
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

### S5 — The night-before email · **Sonnet 5 · medium** · ships OFF
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

### S6 — The Answers Desk · **Opus 5 · high** · its own stream, no dependencies
**What a person gets:** a supplier answers everything people ask them from one place, and we can
publish every shop's reply speed honestly.
**Sixteen kinds, six doors.** ⛔ **Four rows must NOT exist until the answer works:** the waitlist
pick **does nothing and reports success** · a crew shift **cannot be posted, seen or accepted by a
non-admin** · **nobody can ask for a song** · a payment claim **has no "no"**.
🚨 **A ONE-STAR review can never reach the desk today** — the filter is five-stars.

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
