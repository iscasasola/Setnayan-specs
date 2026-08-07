# Setnayan — brief 02 · The event dashboard
### The couple's or family's workspace, inside one celebration. Desktop and mobile.

> Read **brief 00 · Foundation** first. Colour, type, voice and the shared rules all live
> there and are not repeated here.

---

## 1 · What this surface is

Once someone picks an event from their home, they land here and stay here for **six to
eighteen months.** This is the most-lived-in surface in the entire product.

It is where a couple runs a wedding: who is coming, who is sitting where, what is booked, what
is paid, what is due, what the invitation looks like, and — on the day itself — what is
happening right now.

**Emotionally this surface has two jobs that pull against each other:** it must reduce the
anxiety of an expensive, once-in-a-lifetime project, and it must still be the warm keepsake
they open to feel excited. Get the balance wrong toward "project tool" and it is joyless; get
it wrong toward "keepsake" and a stressed person cannot find what is due on Friday.

**When in doubt, clarity wins.** Warmth is the surface; getting things done is the job.

---

## 2 · What is already there — extend, do not redraw

Roughly **forty sections** exist and work today. You are not designing them from nothing. Your
job is the **organising layer** and the **shared components** — how a person moves between
these, what leads, what hides, and what one screen looks like when it is done well.

Grouped by what they are for:

**Guests and seating** — the guest list with roles and groups, RSVP replies, seating chart,
table assignments, printable seat cards, access requests from people asking to join.

**Money** — budget, expenses, payment milestones per vendor, orders and checkout for Setnayan's
own services, receipts, tax paperwork.

**Vendors** — who is booked, proposals and quotes, contracts, messages with each vendor, a
shared working folder per vendor, partnerships between vendors, crew meals and transport.

**The day** — schedule and run-of-show, manpower and call times, the live day-of screen,
hosts and emcee script, clearance and paperwork, contingency for bad weather.

**The public face** — the couple's event website, the invitation, the save-the-date film, the
QR hub, the monogram, sponsors and godparents.

**Memories** — galleries, photos and videos as they arrive, the shared album.

**Planning aids** — a checklist, progress, a date finder that polls guests, a mood board,
suggestions.

You do **not** need to design forty screens. You need to design the **pattern** that makes
forty screens feel like one product — plus the handful named in §6.

---

## 3 · The two hardest problems — solve these and the brief is a success

### A · Wayfinding across forty sections on a phone

Forty destinations cannot be a flat menu. They also must not become a deep tree where a
stressed person taps four times to reach the guest list.

Today the phone has a bottom bar of five destinations, and a strip of section links docked
under the header. **Design the honest answer** to: how does someone reach any of forty things
in at most two taps, on a phone, without memorising anything?

Consider — and justify your choice:
- Five hubs, everything else living as tabs inside them.
- A short list of "what you use weekly" that adapts, with everything else behind one door.
- Search-first, with the palette as the real navigation.

Name the trade-off you accepted.

### B · What leads, and when — posture

The same sections, re-ranked by where the person is in the journey:

- **Just started** — almost nothing exists. The screen's whole job is to get the first three
  things done. Do not show them forty empty sections.
- **Deep in planning** — logistics lead. What is due, what is unpaid, who has not replied,
  which vendor has gone quiet. Memories shrink to a thin ribbon.
- **The last week** — the schedule, the seating, the final headcount, the call times. Nothing
  else matters.
- **The day itself** — collapse to one screen. Big type, readable at arm's length in a dim
  reception hall, works on weak signal. What is happening now, what is next, who to call.
- **After** — the album leads. Planning tools recede but do not vanish; there are still final
  payments and thank-yous.

Design all five. **This is the most valuable thing in this brief.**

---

## 4 · Things that are true and will bite a design that ignores them

- **The event has more than one kind of person in it.** The couple, a coordinator, a host,
  family with a role, vendors. They see different things. A coordinator can propose but not
  spend; a vendor sees only their own corner. **Never design a screen that assumes the viewer
  owns everything on it** — and when someone is seeing a partial view, say so, rather than
  presenting a slice as the whole.
- **Money is never handled in-app between the couple and a vendor.** They agree a price here
  and pay each other directly, off-platform. Setnayan records, it does not hold. Payments *to
  Setnayan* for its own services are a separate, smaller flow with a reference code and a
  screenshot of proof.
- **A wedding has a real time zone.** Times shown are the venue's local clock. A relative
  reading on a foreign phone must not see a different day.
- **Photos arrive from many hands** — the couple, guests, vendors, designated shooters. Some
  guests opted out of appearing. A gallery is never simply "everything."
- **Weak signal is normal.** The day-of screen must be usable when the connection is poor.

---

## 5 · The pattern library this surface needs

These repeat across dozens of sections. Design each once, properly:

- **A roster row** — a person with a role, a status, and one action. Works for guests, for
  crew, for godparents.
- **A ledger row** — a line of money with what it is for, what is paid, what is due, and
  whether it is late.
- **A comparison** — three vendor quotes side by side, on a phone.
- **A gallery** — many photos, fast, on weak signal.
- **A timeline** — the run of the day, with things that are running late.
- **A thread** — a conversation with a vendor, with files attached.
- **A form that is long** — the sort with twenty fields, split so it never feels like twenty.
- **A confirm-this-matters dialog** — for the irreversible things.
- **An empty state** for each of the above, written as real copy.

---

## 6 · Deliverables — each at phone width and desktop width

1. **The event overview**, in three states: freshly created · deep in planning · the last week.
2. **The day-of screen** — the one that has to work in a dim hall on weak signal.
3. **The guest list** — the roster pattern at scale, with search, groups and RSVP status.
4. **The budget** — the ledger pattern, with what is overdue made obvious without shouting.
5. **The seating chart** — the hardest thing to do on a phone. Show your answer honestly; if
   it is "view on phone, edit on laptop," say that and design both.
6. **One vendor's page inside the event** — the quote, the contract, the payments, the
   conversation, in one place.
7. **The wayfinding** — how a person reaches any of forty sections, shown as a real screen.
8. **The gallery** after the event.
9. **The component set** from §5.

---

## 7 · Also include, in words

- Which **Facebook or TikTok habit** each navigation choice borrows.
- Every **empty state as real copy**.
- A **ranked build list** — each item *extends something that exists* or *new*.
- **"What I deliberately did not change, and why."**
- The **trade-off you accepted** on wayfinding, stated plainly.

---

## 8 · Do not

- Do not design forty separate screens. Design the pattern and the eight named surfaces.
- Do not make the day-of screen pretty at the cost of legible.
- Do not assume the viewer owns everything they can see.
- Do not use gold as a button colour.
- Do not design a dark mode.
- Do not put anything private on a public surface.
