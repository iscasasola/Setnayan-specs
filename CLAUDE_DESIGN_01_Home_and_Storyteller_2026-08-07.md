# Setnayan — signed-in home + storyteller lane
### Design brief for Claude Design · desktop and mobile · 2026-08-07

---

## 1 · What you are designing for

**Setnayan** is a Philippines-first life-events platform. Couples and families plan real
celebrations on it — weddings, debuts (18th birthdays), christenings, anniversaries,
graduations, reunions — end to end: guest list, seating chart, budget, schedule, vendors,
invitations, photos.

Three kinds of people sign in:

- **Customers** — the couple or family planning the event. The main audience for this brief.
- **Vendors** — photographers, caterers, coordinators, hair-and-makeup artists, florists,
  venues, hosts. Each has a public shop page at a clean address like
  `setnayan.com/theirshopname`.
- **Storytellers** — any user who publishes their real events publicly. See §4; this is the
  part that most needs your thinking.

The brand name is spoken **SET-na-yan**, from the Filipino phrase *"Set na 'yan"* — "that's
all set." Always written in full: **SETNAYAN**.

---

## 2 · Who is holding the phone

Design for a Filipino in their late twenties to early forties, planning the biggest and most
expensive event of their life, usually stressed, usually on a **mid-range Android phone on
mobile data**, often in a place with weak signal.

**Mobile is the primary surface, not the small version.** Desktop matters — vendors and
serious planning sessions happen on a laptop — but every decision should be made on the phone
first and then widened.

They already use **Facebook** and **TikTok** every day. They have not read any documentation
and never will.

---

## 3 · The governing principle

> **Familiarity is the goal, not imitation.**

Every navigation decision must survive this test: *a Filipino who already uses Facebook and
TikTok should know how to do this without being told.*

That does **not** mean cloning either app. It means borrowing the **habits** people already
have and spending our originality on the things that are genuinely ours.

Two reference apps, two different jobs:

| App | What we borrow | Where it applies |
|---|---|---|
| **Facebook** | the row of icons along the bottom · a box at the top that asks you something · your own things stacked down the page · a business page per vendor · a saved list that behaves like "pages you like" | the signed-in **home** |
| **TikTok** | full-bleed vertical video · swipe for the next one · the creator's handle and the links stacked on the video itself · a shop link that goes somewhere real | the **storyteller lane** |

In your deliverable, include a short table saying — one line each — **which Facebook or TikTok
habit each part of your design borrows.** That list is itself a deliverable; it is how the
owner will judge whether the app feels familiar.

---

## 4 · What "storytelling" means here — read this twice

The owner's own definition, verbatim:

> *"story telling just means, the vendors get direct link from the video of their service."*

So a **Chapter** is:

**A video the person already posted on YouTube, Instagram or TikTok — and underneath it,
direct links to the actual vendors whose work appears in that video.**

That is the entire idea. It is not a blog post, not an album, not a status update.

**Why this is the strongest thing in the product:** on Facebook, a vendor posts on their own
page and pays for reach. Here it is inverted — **a real person posts the video of their own
wedding, and the vendors who actually did that work are linked one tap away.** The
recommendation comes from someone who was there. That is already how Filipinos choose a
caterer: you see a friend's wedding and you ask who did it. The Chapter is that conversation,
made tappable.

So the storyteller lane is **not a social feed**. It is a **discovery lane where every video
carries the people behind it.**

### A hard technical constraint you must design around

**Setnayan does not host video, and must not start.** A Chapter points at the creator's own
YouTube / Instagram / TikTok post and displays it in an embedded window. That is what keeps
this costing the business nothing per view.

The consequence: **a borrowed video window cannot silently autoplay the way TikTok's own
player does**, it cannot be cheaply preloaded, and a stack of several of them is heavy on a
mid-range Android phone on mobile data.

**Do not design a feed that quietly assumes we can behave like TikTok's own player.** Choose
an approach and justify it. Reasonable directions:

- A poster-frame card that fills the screen; the real video only loads on tap. TikTok's
  *rhythm* without TikTok's player.
- A vertical snap-scroll where only the card in view holds a live player and its neighbours
  are still frames.
- Accept one tap to play as the honest price of not hosting video — and make **the vendor
  links the thing that is instant.**

Whichever you choose, state plainly what the person experiences and exactly where it differs
from real TikTok.

---

## 5 · What already exists — extend it, do not redraw it

This app is roughly two years old. **Assume the thing you are about to draw already exists in
some form.** The owner has paid more than once to have a screen recreated that already
shipped. Recreating a working screen is a defect, not a deliverable.

Already built and working today:

- **The signed-in home** is organised into **four areas** — described in §6. This shape is
  owner-approved. **Re-skin it; do not re-conceive it.**
- **A five-slot bar along the bottom on phones:** Home · Alaala (memories) · a raised ➕ in the
  middle · People · Spaces. The fifth slot only appears for someone who actually runs a shop
  or the admin console.
- **A wide row under the greeting** reading *"What's your event?"* with the person's initial
  and a terracotta ➕, which starts a new event. (Just shipped — design around it, refine its
  treatment if you can justify a better one.)
- **Vendor shop pages** — the "business page" equivalent — already exist and are substantial.
  **Do not redesign them.** You may design how they are *linked to* from a Chapter.
- **Storyteller public pages** already exist: a person's public page, their published
  Chapters, follower counts, view counts, a Follow button, and shoppable vendor cards under a
  Chapter.
- **Saved vendors** — a private shortlist that behaves like "pages you've liked."
- **People** — connections between real people. Both sides must accept; there is no one-way
  following of a private person.

For everything you propose, state: **what exists · what is missing · the exact delta.**

---

## 6 · The four areas of the home — keep all four, rank them freely

1. **Events** — the celebrations being planned right now. Each shows a countdown, where and
   when, how far along the planning is, and what needs attention.
2. **Alaala** *(Filipino for "memories")* — photos, videos, past events as albums, and a
   montage feature. Completed events move here; an event is never in both places at once.
3. **Spaces / "Yours to run"** — only appears if you actually run something: your vendor shop,
   the admin console, your storyteller desk, your saved-vendor shortlist.
4. **People** — your connections, the children or dependants in your care, and your
   *Samahan* (groups: family, barkada, parish).

You may change how these look and **how they are ordered**. You may not invent a fifth area or
delete one.

### The un-built idea worth building — posture

The same four areas, **re-ranked by what stage of life the person is in**:

- **Planning** — logistics lead. What is due, what is unpaid, who has not replied. Memories
  shrink to a thin warm ribbon. Do not tax a stressed planner with nostalgia.
- **The day itself** — everything collapses to the live event. One screen, big type, readable
  at arm's length in a dim reception hall.
- **Quiet season** — no event in motion. Memories rise and take the page; the storyteller
  lane becomes the reason to open the app at all.

Design all three. This is the single most valuable thing in this brief after the Chapter card.

---

## 7 · Locked visual system — these values are enforced, not suggestions

### Colour

| Role | Value | Rule |
|---|---|---|
| Page **and** card | `#FDFBF7` soft cream | Deliberately the same. Cards separate by **border + shadow**, never a second background colour. |
| Text and structure | `#2C2A29` espresso | 13.82:1 on cream · AAA |
| **Primary action** | **`#C24E25` terracotta** | Hover `#B04722`. **Labels are cream `#FDFBF7`, not white** — 4.61:1 AA. |
| Highlight / accent | `#A9834B` gold | **UI and large text only. Gold is NEVER a button.** Active tabs, rules, pills, eyebrows, selected states. |
| Gold carrying real text | `#8A6B39` | Escalate to this when gold must be readable · 4.79:1 |
| Links and secondary buttons | `#3B4E67` slate indigo | 8.22:1 · AAA |
| Muted text ladder | `#6E6A62` → `#8A857B` → `#A09A8E` | Captions, metadata, placeholders |

**The point of this palette is structural, not decorative:** gold used to be both the button
colour and the highlight colour, so a primary button looked identical to a selected filter
chip. **Terracotta acts. Gold highlights.** Never blur that line.

**Light mode only.** There is no dark mode and there will not be one. Do not design one.

Check any terracotta button against **cream**, never against white — a value that passes on
white can fail on cream.

### Type

| Role | Family |
|---|---|
| All interface chrome, body, labels, buttons | **Hanken Grotesk** |
| Display headings, section titles, editorial moments | **Cormorant Garamond** (serif) |
| Numbers — counts, money, countdowns, percentages | **Space Mono** |

Money is Philippine pesos, written **₱18,000** — no decimals in the interface.

### Feel

Warm editorial archive. Generous whitespace. Soft shadows, real hierarchy, restraint. It
should feel like a well-made keepsake, not a productivity tool — but it must never make a
stressed planner hunt for what is due on Friday.

---

## 8 · Navigation

### Phone — the primary surface

- **Five slots along the bottom, thumb-reachable.** Today: Home · Alaala · raised ➕ · People ·
  Spaces (only for people who run something). You may re-label or re-rank these. **You may not
  add sub-menus that open out of the bar** — it is a shared, locked template.
- The ➕ in the middle is the raised action, dead centre, reachable by either thumb.
- The composer row — *"What's your event?"* — sits at the top of Home, full width.
- Anything wide (tables, comparisons) must scroll inside itself. The page body must never
  scroll sideways.

### Desktop

- A persistent left rail, a sticky top bar with search and notifications, and one main content
  column. Navigation repaints the content region, never the whole room.
- Do **not** simply stretch the phone layout. Use the width for genuine side-by-side value —
  the events list beside what needs attention, a Chapter beside its vendor links.
- Content should be capped at a comfortable reading measure, not run edge to edge on a 27-inch
  monitor.

---

## 9 · Absolute constraints

1. **A private event NEVER appears in any public or follower feed.** Not once, not
   accidentally, not as a preview. A wedding has guests who never agreed to be public. The
   only public thing is a Chapter someone deliberately published.
2. **No one-way following of a private person.** Connections between real people require both
   sides to accept. Following a **storyteller** one-way is fine — they publish on purpose.
   There is no "people you may know."
3. **No video hosting. No per-view cost.** See §4.
4. **Production is empty today** — a handful of events, no photos, no storytellers yet.
   **A design that only looks good when full is a failed design.** The empty state is the
   make-or-break, and it must be an invitation, not an apology.
5. **Never draw a fake door.** Every control must map to something real. No sample data
   presented as if it were the person's own.
6. **Accessibility is not optional.** Every colour pairing above is already contrast-checked;
   keep it that way. Tap targets at least 44×44. Never rely on colour alone to carry meaning.

---

## 10 · What to deliver

Design these, **each at phone width and desktop width**:

### A · Home — brand new user, nothing yet
No events, no photos, no connections. What makes them start? Real copy for every empty state.

### B · Home — one wedding, mid-planning
Countdown, progress, what needs attention, the vendors booked, the composer row. This is the
most-seen screen in the product.

### C · Home — the day of the event
Collapsed to the live event. Big type, glanceable, works in a dim hall.

### D · Home — quiet season, after the wedding
Memories lead. The storyteller lane becomes the reason to open the app.

### E · The Chapter card — the most important single component
A video with the vendors under it. Show it in the feed **and** opened full. Answer precisely:
**how many taps from watching a video to messaging that vendor?** Fewer is better; say the
number.

### F · The storyteller lane
The vertical, TikTok-shaped surface. Show what a person sees while scrolling, how the vendor
links behave, and **what it looks like when nobody they follow has posted anything** — which
is today's reality.

### G · The seam — private event ↔ public story
Where does someone see their own event and their own published story in relation to each
other? Is there a "tell this story" control inside an event? **Design it, and be paranoid:**
state exactly what it does and does not expose, and how the other people at that wedding are
protected.

### H · The component set
The reusable pieces underneath all of the above: event card, chapter card, vendor link,
composer row, bottom bar, section header, empty state, attention/alert row, avatar, badge,
progress ring, money and countdown numerals.

---

## 11 · Also include, in words

- The **familiarity table** from §3 — which Facebook or TikTok habit each part borrows.
- **Every empty state as real copy**, not `[empty state here]`.
- A **ranked build list**, each item marked *extends something that exists* or *new*, with an
  honest note on anything that needs data the product does not have yet.
- **"What I deliberately did not change, and why."**

---

## 12 · Do not

- Do not redesign the vendor shop pages.
- Do not invent a fifth home area or remove one of the four.
- Do not design a dark mode.
- Do not use gold as a button colour.
- Do not put a private event anywhere public.
- Do not design a feed that only works when it is full.
- Do not use placeholder Latin text. Write the real Filipino-English copy the product would
  actually say.

---

## 13 · Voice for any copy you write

Warm, plain, confident. English is the primary language, lightly Filipino where it is natural
— *Kumusta*, *Alaala*, *Samahan*, *Ninong at Ninang*. Never twee, never corporate.

Say what a person gets, not what the system does:

- ✅ *"Your cousin scans the poster, shoots twenty photos, and they land in your gallery."*
- ❌ *"Guest media is ingested via the QR-bound capture session."*
