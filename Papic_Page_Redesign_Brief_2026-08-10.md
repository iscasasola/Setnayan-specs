# Papic page — redesign brief for Claude Design (2026-08-10)

> Paste everything below the line into Claude Design. Written after the owner
> walked the live page on 2026-08-10 and said: *"THE PAPIC PAGE is not integrated
> and simplified. we want to avoid having to scroll to access this. we want a
> more efficient way to navigate. better grouping, better interconnection, better
> UI and UF."*

---

## The job

Redesign the information architecture and navigation of **one screen** in a
Philippines-first life-events platform: the couple's **Papic** page — the control
room for guest-and-crew photo capture at their wedding.

It is a real, shipped, working page. **Nothing here is broken.** Every feature
below is live and correct. The problem is that all of it lives in a single
vertical scroll, so nothing can be found and nothing feels related to anything
else.

**Who uses it:** an engaged couple, not a technical person. Filipino, English-
reading, planning a wedding over 6–18 months. They open this on a **phone** far
more often than a laptop.

**When they use it, they are in one of three completely different moods:**

1. **Setting up** — weeks or months before. Long, considered, one-time choices.
2. **Running the day** — at the venue, one-handed, in a hurry, possibly on bad
   signal. Handing out QR codes, watching shots arrive.
3. **Looking back** — after. Browsing photos, downloading, making keepsakes.
   This is the mode they return to for *years*.

Today all three are interleaved in one column, in no particular order.

---

## What is actually on the page — 20 cards, one scroll, 1,785 lines

Grouped by the job they serve (the page itself does **not** group them):

**Getting cameras into people's hands**
- Camera QR codes (claim links + QR per camera) + a printable card sheet
- A camera for every guest — everyone on the guest list gets one, their invite QR
  *is* the camera; choose Limited or Unlimited for the whole list
- Add a camera that isn't on the guest list — a videographer friend, a hired
  second shooter; quantity picker + tier
- One shared poster QR anyone at the party can scan

**Time**
- Capture window — start day + start time; ends on the event day

**Money (two different products, two near-identical purchase forms)**
- **Papic Pool** — one shared pot of shots for the whole event. Every camera
  draws from it. Buy more any time.
- **Papic One** — a single camera with its *own* shots that nobody else can
  spend. Buy shots for a new camera, or top up an existing one (QR unchanged).

**How photos come out**
- Your Papic look — one visual style applied to every camera at the event
  (5 options; guests cannot override)
- Photo quality — Optimal / Full resolution / High efficiency
- Where your photos go — Setnayan storage, or the couple's own Google Drive
- Keep Full-Res status banner

**The photos themselves**
- Your gallery — filters (All / Photos of us / Untagged / Videos), Download all,
  per-photo Save, tag-source legend, clip lightbox
- Finding people in photos — face matching, on/off for the whole event
- Moderation — hide, report, or block a camera

**Making people shoot**
- Papic Challenges — a photo-mission board; add your own, or pick from a library
- Ask your guests for a story — 10-second video prompts, library of ~15

**Afterwards**
- Kwento Magazine — the day as a keepsake PDF
- Your Recap — an auto-assembled shareable page
- Setup & help

---

## What specifically goes wrong today — observed, not hypothetical

1. **Everything is a scroll away.** ~20 cards deep. The gallery — the thing they
   come back for most — sits roughly two-thirds down, *below* every one-time
   setup choice.
2. **The same thing appears twice.** "Camera QR codes" is a card near the top
   *and* a link inside a different card further down.
3. **Two purchase forms that look identical and mean different things.** Papic
   Pool and Papic One both render "How many shots" + a dropdown + "Continue to
   payment", stacked one after the other. Nothing visually separates *shared* money
   from *this-one-camera* money.
4. **Papic One appears in two places** — once as a tier you add, once as its own
   buy section.
5. **Balances are far from the thing that spends them.** "29 shots left in the
   pool" sits in the money card; the cameras that drain it are several screens up.
6. **A validation error can be off-screen.** The capture window shows *"Pick a
   start date"* with a disabled button — easy to miss and easy to leave unset.
7. **Two different privacy/safety controls are in different neighbourhoods** —
   face matching sits under the gallery, moderation is a one-line link below it,
   and the storage choice is above it.

---

## Hard constraints — do not change these

- **The app shell already exists and ships.** Persistent sidebar on desktop,
  bottom nav on mobile, sub-nav, route transitions. **Do not redesign the shell.**
  Design *within* it.
- **A design system already exists and is owner-approved** (12 page archetypes +
  7 overlay types, approved 2026-08-04). Compose from it. Only propose a new
  pattern if none fits, and say why.
- **Palette is locked, light-only:** cream `#FDFBF7` · ink `#2C2A29` ·
  primary CTA terracotta `#C24E25` · gold `#A9834B` (UI accents only) ·
  link blue `#3B4E67`.
- **Mobile-first.** If it only works on a laptop, it does not work.
- **Plain English is a product value.** Copy says what a *person* experiences.
  Never a file name, table name, setting name or internal term. Keep the existing
  voice — warm, short, concrete ("Print this, put it on a table").
- **Apply-then-pay.** There is no card on file. Buying = get payment
  instructions, pay by bank or e-wallet, an admin confirms, then it activates.
  Never design a one-tap checkout.
- **Money facts, do not invent:** a photo costs 1 shot; a 10-second video clip
  costs 8. Free tier = a 50-shot shared pool + one free Papic One camera. Paid
  pool tops up in fixed rungs (e.g. ₱1,000 → 3,000 shots).
- **No capability may be lost.** All 20 cards above must still be reachable. This
  is a re-organisation, not a cull. If you believe something should be removed,
  say so separately as a recommendation — do not silently drop it.

---

## The questions to answer

1. **What is on the first screen?** A couple opens this on a phone. What do they
   see before scrolling — and does that answer change depending on whether their
   event is months away, happening today, or over? Should the page know?
2. **How do the three modes get separated** — set up / run the day / look back —
   without burying anything or inventing a fourth navigation layer?
3. **Where does money live?** Two products (shared pot vs one private camera) that
   are genuinely different but currently look the same. How does a couple
   understand the difference in three seconds?
4. **What is the relationship between cameras, shots and the pool**, and how is it
   shown so a balance never sits far from the thing that spends it?
5. **What belongs behind a tap?** Which of the 20 cards are set-once-and-forget
   and should collapse to a single summary line with the current value
   ("Look: Orig · Full resolution · Setnayan storage") that expands when tapped?
6. **How does a couple get from here to the guest list, the seating chart and the
   event website** — and back? Today the page mentions those but the connections
   are one-way links.
7. **What does the day-of view look like** when they are standing at the venue
   holding a phone?

---

## What to deliver

1. **An IA proposal** — the grouping, the hierarchy, what is top-level, what is
   nested, what collapses. One diagram or outline is enough.
2. **Mobile screens** for the resulting structure — at minimum: the default view,
   one expanded setup group, the money screen(s), and the day-of view.
3. **Desktop** for the same, since the shell differs.
4. **A mapping table**: every one of the 20 cards → where it now lives. This is
   how we verify nothing was lost.
5. **The reasoning** for any grouping that is not obvious.

## What not to do

- Do not redraw the app shell, the nav, or the palette.
- Do not invent new features, new prices, or new tiers.
- Do not replace the plain-English copy with marketing copy.
- Do not solve it with tabs alone if tabs just hide the same 20-item pile.
- Do not assume a big screen.

---

# ⛔ CORRECTIONS TO THE RETURNED DESIGN (owner, 10 Aug 2026)

The handoff bundle (`design_handoff_papic_redesign/`) is **accepted on structure**
— three rooms, date-aware landing tab, money beside the cameras that spend it,
the unset-window attention row, the de-duplicated QR entry, and a complete 20/20
mapping table. Build that.

**Four things in it are wrong and must NOT be built as written.**

## 1 · An invented price rung — corrected

The handoff's money model lists `₱2,500 → 8,000 shots`. **No such rung exists.**
The live pool ladder is:

| price | shots |
|---|---|
| ₱1,000 | 3,000 |
| ₱2,000 | 6,000 |
| ₱3,000 | 10,000 |

Only the first was right. Read the ladder from the catalogue at build time —
never from a design file, and never re-typed.

## 2 · Preservation is PAID, and nothing is "forever"

Handoff §6.3 says *"Preserved photos keep full resolution forever."* **Rejected.**
Owner, verbatim: *"no. not free. their purchase will initially keep 3 months
after the event ends. preservation will prevent those chosen photos and videos to
compress."*

The true model:

- **Included with a Papic purchase:** the full-resolution original is kept until
  **3 months after the event ends** (and 6 months from the event's first capture,
  whichever is later — the floor is the promise).
- **After that** the original is replaced by its compressed copy. **The photo is
  never deleted** — only its resolution changes. The compressed gallery is free
  for 5 years.
- **Paid preservation** exempts the couple's **chosen photos and videos** from
  that compression. It is a product with a price, not a free tap.

So the gallery's preserve flow keeps its shape — Choose → tap → an action bar —
but it is a **purchase**, and the count card must not promise perpetuity. Write
what is true: these stay at their original quality; the rest become a smaller
copy after the window.

⚠ "Forever" was retired by the owner on 2026-08-07. Do not reintroduce it in any
copy, anywhere.

## 3 · Photo quality is NOT removed — its default moves

Handoff §6.1 says quality is removed, always Optimal, no UI. **Overridden.**
Owner: *"photo quality starts at optimal and not full resolution."*

All three choices stay — **Optimal · Full resolution · High efficiency**. Only
the starting point changes: new events begin on **Optimal** instead of Full
resolution. Set up therefore keeps **6** choices, not 5, and the checklist counts
accordingly.

🔑 Keeping the choice is also what keeps §2 honest: preservation talks about
"original quality", so a couple must still be able to *choose* full resolution.
Deleting the setting while selling preservation was the contradiction in the
returned design.

Existing events are **not** migrated — all five in production sit on Full
resolution and stay there.

## 4 · The three-month floor must count from when the event ENDS

The owner said "3 months after the event **ends**." The shipped clock reads the
event's **start** date only, so a multi-day event — travel is the multi-day type
— would give its final day less than the promised three months. Use the end date
when there is one, falling back to the start date.

Latent today: no production event currently has a differing end date.

## Also carried forward

- Papic Challenges sits in **Set up**, but every mission spends shots from the
  shared pool while the balance lives in **Cameras**. Show the running cost on
  the board itself so nobody spends on a screen with no balance in sight.
- The handoff's three §5 recommendations (two-way cross-links · retire "Papic
  One" in couple-facing copy · low-pool tint) remain owner-optional and are not
  in scope.
