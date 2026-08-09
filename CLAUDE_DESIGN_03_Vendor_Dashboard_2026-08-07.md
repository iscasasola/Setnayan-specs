# Setnayan — brief 03 · The vendor dashboard
### The business side. Five pages, no more. Desktop and mobile.

> Read **brief 00 · Foundation** first. Colour, type, voice and the shared rules all live
> there and are not repeated here.

---

## 1 · Who this is for

A photographer, caterer, coordinator, hair-and-makeup artist, florist, venue, host, or band —
usually a small business, often one person with a few staff. **Half their working life happens
on a phone**, at a venue, between jobs, with their hands full.

They check inquiries the way other people check messages. If a couple asks a question and the
vendor sees it four hours later, they lose the booking. **Speed of reply is the product.**

---

## 2 · The single hardest constraint — read this before anything else

### There are FIVE pages. That is locked.

The owner locked this in July 2026, in his own words:

> *"overview, my shop, my customers, my performance, BEO are all 1-page each with the
> different features integrated on that page."*

So the entire vendor side is:

| Page | What lives on it |
|---|---|
| **Overview** | what needs you today |
| **My Shop** | services, packages, prices, the public profile, availability, subscription |
| **My Customers** | inquiries, conversations, bookings, proposals, contracts, clients |
| **My Performance** | earnings, payouts, demand, reviews, track record, where leads come from |
| **BEO** *(the event order)* | the operational detail for a confirmed job — crew, call times, deliverables, on-the-day |

**There are roughly forty-seven underlying surfaces.** Every one of them lives as a **tab or a
card inside one of those five pages**. Adding a sixth destination, or nesting children under a
menu item, is forbidden.

**This is the design problem.** Not "how do I lay out five pages" — but *how does a page hold
nine different jobs without becoming a wall?* Solve that and this brief is a success.

The desktop sidebar and the phone bottom bar show **exactly the same five destinations.** They
must not diverge.

---

## 3 · What actually lives inside each page

**Overview** — new inquiries, unread messages, jobs this week, anything overdue, subscription
state, verification state.

**My Shop** — services and what is included, packages and pricing, the public shop page,
photos and portfolio, calendar and availability, branches, team, repertoire, mood-board
library, the subscription and what tier unlocks, verification documents, the shop's web
address, the one line couples read under the shop name and the vendor's own website, and
where else Setnayan may surface the shop — the couple's day-of "get help" shortlist, and
whether to be featured on Setnayan's social pages when the shop is verified.

**My Customers** — inquiries coming in, message threads, proposals sent, contracts, confirmed
bookings, past clients, requests to lock a date, partnerships with other vendors, referrals.

**My Performance** — earnings and payouts, booking fees owed, demand in their area, price
position against similar vendors, reviews, track record, where their leads come from, tax
documents.

**BEO** — for one confirmed job: the couple, the date, the venue, what was agreed, crew and
call times, what to deliver, the on-the-day view, and anything the couple has shared with
them.

---

## 4 · Things that will bite a design that ignores them

- **A vendor sees only their own corner of a wedding.** They must never be shown the couple's
  private planning. When they are seeing a partial view, the screen should say so rather than
  presenting a slice as the whole.
- **Money between the vendor and the couple never passes through Setnayan.** They agree a
  price in-app and the couple pays the vendor directly, off-platform. Setnayan charges the
  *vendor* a small booking fee for introductions it sourced — never a cut of the couple's
  payment, and **never call it commission** anywhere in the interface. That fee is currently
  switched off; design it as a real but quiet part of Performance.
- **The public shop page already exists and is substantial. Do not redesign it.** You may
  design how a vendor *edits* it and how it is *linked to*.
- **Verification matters.** An unverified shop is not visible to the public. The path from
  "signed up" to "visible" must be obvious and short — this is the single biggest drop-off
  point in the product.
- **A storyteller's video can link directly to this vendor.** See brief 01. From the vendor's
  side that is free, high-quality demand, and it should be visible in Performance.
- **Notifications are the lifeline.** A missed inquiry is lost income. Badges must be honest —
  a failed load must never show a confident zero.

---

## 5 · The pattern library this surface needs

- **A page that holds many jobs** — your answer to §2. Tab strip? Stacked cards? Progressive
  sections? Show it working with nine things on it, on a phone.
- **An inquiry row** — who, for what date, how long it has been waiting, one action to reply.
- **A conversation** with files attached.
- **A service / package editor** — what is included, what it costs, what is optional.
- **A calendar** showing booked, held, and free — on a phone.
- **A money row** — earned, pending, paid out, owed.
- **A comparison** — this vendor's price against the band for their category.
- **A verification checklist** with a clear finish line.
- **An empty state** for each, as real copy — remember most vendors start with nothing.

---

## 6 · Deliverables — each at phone width and desktop width

1. **Overview**, in three states: brand new and unverified · quiet week · busy week with
   three unanswered inquiries.
2. **My Shop** — the full page holding all of §3, with your many-jobs pattern visible.
3. **My Customers** — the inquiry list and one conversation, showing how fast a reply is.
4. **My Performance** — earnings, demand, reviews, and the booking fee explained without the
   word commission.
5. **BEO** — one confirmed job, on a phone, at the venue.
6. **The verification path** — signed up to publicly visible, as a sequence.
7. **The five-slot bottom bar and the desktop sidebar**, proving they match.
8. **The component set** from §5.

---

## 7 · Also include, in words

- Your answer to §2 stated plainly: **how a single page holds nine jobs**, and the trade-off.
- Which **Facebook or TikTok habit** each navigation choice borrows.
- Every **empty state as real copy**.
- A **ranked build list** — each item *extends something that exists* or *new*.
- **"What I deliberately did not change, and why."**

---

## 8 · Do not

- **Do not add a sixth page.** Do not nest children under the five.
- Do not redesign the public shop page.
- Do not let the desktop sidebar and the phone bar disagree.
- Do not use the word commission anywhere.
- Do not show a vendor anything private belonging to the couple.
- Do not use gold as a button colour.
- Do not design a dark mode.
