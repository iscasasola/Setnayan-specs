# Setnayan — design foundation
### Send this to Claude Design FIRST, once. Every surface brief builds on it.

---

## 1 · The product

**Setnayan** (spoken *SET-na-yan*, from the Filipino phrase *"Set na 'yan"* — "that's all
set") is a Philippines-first life-events platform. Real people plan real celebrations on it:
weddings, debuts (18th birthdays), christenings, anniversaries, graduations, reunions,
birthdays, corporate events.

**One app, four doorways.** Each has its own brief:

| # | Doorway | Who | Scale |
|---|---|---|---|
| 01 | **Home + storyteller lane** | any signed-in person, before they pick an event | 1 page + a video lane |
| 02 | **Event dashboard** | the couple or family, inside one celebration | ~40 sections |
| 03 | **Vendor dashboard** | the business — photographer, caterer, coordinator | 5 hub pages |
| 04 | **Admin console** | the Setnayan team, internal only | ~92 surfaces |

They must feel like **one product**. That is what this foundation is for.

---

## 2 · Who is holding the device

**Customers** — late twenties to early forties, planning the biggest and most expensive event
of their life. Usually stressed. Usually on a **mid-range Android phone on mobile data**, often
with weak signal. They use Facebook and TikTok daily. They have never read documentation and
never will.

**Vendors** — running a small business, often solo or with a few staff. Half their working
life happens on a phone, at a venue, between jobs. They check inquiries the way people check
messages.

**Admins** — the Setnayan team, at a laptop, doing repetitive judgement work with money and
people's private data in front of them.

**Mobile is the primary surface for customers and vendors, not the small version.** Desktop is
primary for admin.

---

## 3 · The governing principle

> **Familiarity is the goal, not imitation.**

Filipinos already live inside **Facebook** and **TikTok**. Borrow the habits they already have
and spend originality on what is genuinely ours.

Every navigation decision must pass: *would someone who already uses Facebook and TikTok know
how to do this without being told?*

---

## 4 · Colour — locked and enforced

| Role | Value | Rule |
|---|---|---|
| Page **and** card | `#FDFBF7` soft cream | Deliberately the same value. Cards separate by **border + shadow**, never a second background. |
| Text and structure | `#2C2A29` espresso | 13.82:1 on cream · AAA |
| **Primary action** | **`#C24E25` terracotta** | Hover `#B04722`. **Labels are cream `#FDFBF7`, never white** — 4.61:1 AA. |
| Highlight / accent | `#A9834B` gold | **UI and large text only. Gold is NEVER a button.** Active tabs, rules, pills, eyebrows, selected states. |
| Gold carrying real text | `#8A6B39` | Escalate to this when gold must be readable · 4.79:1 |
| Links, secondary buttons | `#3B4E67` slate indigo | 8.22:1 · AAA |
| Muted text ladder | `#6E6A62` → `#8A857B` → `#A09A8E` | Captions, metadata, placeholders |

**The point of this palette is structural, not decorative.** Gold used to serve as both the
button colour and the highlight colour, so a primary button looked identical to a selected
filter chip. **Terracotta acts. Gold highlights.** Never blur that line.

Always check a terracotta button against **cream**, never against white — a value that passes
on white can fail on cream.

**Light mode only.** There is no dark mode and there will not be one. Do not design one.

### Status colours

Success, warning and danger exist but are **quiet** — a tinted background with same-family
text, never a saturated block. Money that is overdue and a guest who has not replied are
different kinds of urgent; do not paint them the same red.

---

## 5 · Type

| Role | Family |
|---|---|
| All interface chrome, body, labels, buttons | **Hanken Grotesk** |
| Display headings, section titles, editorial moments | **Cormorant Garamond** (serif) |
| Numbers — counts, money, countdowns, percentages | **Space Mono** |

Money is Philippine pesos: **₱18,000**. No decimals in the interface.

Dates are read by relatives on foreign phones — always show the day explicitly
(*12 Dec 2026*), never a bare numeric format that flips by region.

---

## 6 · Feel

Warm editorial archive. Generous whitespace, soft shadows, real hierarchy, restraint. It
should feel like a well-made keepsake — but it must never make a stressed planner hunt for
what is due on Friday. **Warmth is the surface; clarity is the job.**

---

## 7 · Rules that apply to every surface

1. **Never draw a fake door.** Every control maps to something real. No sample data presented
   as the person's own.
2. **Production is nearly empty today** — a handful of events, no photos, no storytellers.
   **A design that only looks good when full is a failed design.** Every empty state must be
   written as real copy and must read as an invitation, not an apology.
3. **A count of zero and "we could not load this" are different things.** Never show a
   confident "0" or "all clear" for something that failed to load. Say you could not tell.
4. **Tap targets at least 44×44.** Colour alone never carries meaning.
5. **Anything wide — tables, comparisons — scrolls inside itself.** The page body never
   scrolls sideways.
6. **A refusal must be visible.** If the system declines to do something, the person must see
   why. A silent refusal is indistinguishable from success.
7. **Privacy is structural.** A private event never appears anywhere public. Connections
   between real people require both sides to accept. There is no "people you may know."

---

## 8 · Shared components — design these once, use them everywhere

- **Section header** — title, optional count, optional single action
- **Card** — cream, border + shadow, no second background
- **Attention row** — one line, one number, one destination
- **Empty state** — headline, one line, one action
- **Money** and **countdown** numerals (Space Mono)
- **Progress ring** and **progress bar**
- **Avatar** and **initial circle**
- **Badge** and **status pill** (gold family for selected, quiet tints for status)
- **Primary / secondary / ghost button**
- **Tab strip** (gold underline for active)
- **Bottom bar** (phone, five slots)
- **Sheet** (phone) and **dialog** (desktop)
- **Search field** and **command palette**
- **Table row** and **list row** — and the rule for when a table becomes cards on a phone

---

## 9 · Voice

Warm, plain, confident. English primary, lightly Filipino where natural — *Kumusta*, *Alaala*
(memories), *Samahan* (group), *Ninong at Ninang* (godparents). Never twee, never corporate.

Say what a person gets, not what the system does:

- ✅ *"Your cousin scans the poster, shoots twenty photos, and they land in your gallery."*
- ❌ *"Guest media is ingested via the QR-bound capture session."*

Never use Latin placeholder text. Write the real copy the product would say.
