# Claude Design brief — the Setnayan front door

Paste everything below the line into Claude Design.

---

You are designing the public front door of **Setnayan** — a Philippines-first
platform for life events (weddings first, then debut, christening, birthday,
reunion, graduation). Spoken *SET-na-yan*, from the Tagalog phrase **"Set na
'yan"** — *that's all set*.

Deliver **one self-contained HTML file** for the homepage archetype. All CSS
inlined, no external fonts, no CDN, no framework. It governs `/` and sets the
pattern for `/explore`, `/realstories`, `/blog`.

## The actual problem — read this before designing anything

The homepage today has **four outbound links in total**: start planning, real
stories, privacy, download. **There is no menu.** People cannot find things
because nothing points at them, not because the content is missing.

Almost everything is already built and already public — it is *unadvertised*.
So this is a **wayfinding** brief, not a content brief. **The navigation is the
hero.** Design it as the most considered thing on the page.

## The four doors

Each needs a home on the page and a place in the menu.

**1 · What it does.** Six services; four of them run **in the browser with no
account**: candid group photography (Papic), live broadcast of the ceremony
(Live Studio), a 3D floor plan of the reception, and the shared memory album
(Alaala). Plus a deterministic planner (Setnayan AI) and a custom wedding song
(Pakanta). *This already ships and works — it just sits below the fold.* Do not
redesign the demos. Give them prominence and a door.

**2 · Find vendors.** Show the **range of categories**, not featured shops —
photographer, videographer, venue, catering, hair & make-up, coordinator,
florist, host/emcee, lights & sounds, cake, gowns & barong, mobile bar. It must
answer *"will I find my photographer here?"* on day one. A featured-vendor strip
exists and is deliberately **not** what we want here: it shows award winners
("our best"), not the range, and it renders empty today.

**3 · Real stories.** Couples publish their day as numbered **chapters** with
video. Public, watchable without an account, told partly by the guests — not
only the couple. Today it gets one link below the fold.

**4 · Journal.** Long-form editorial about planning, traditions and vendors.
Live on the site and **linked from nowhere**.

## ⚠ THE LAW THAT DECIDES THIS DESIGN: it must survive an empty catalogue

Production today has **two vendor shops, both hidden**, **zero photos**, and
almost no chapters. Design every surface in **two states**, and show both:

- **An empty grid is worse than no grid.** It says *nobody is here*. A rail of
  one item reads as broken, not sparse.
- Below a real threshold, a section must **collapse to a written invitation** or
  **disappear entirely** — while its menu link keeps working.
- Counts render as **`—` until they are real**, never `0`.
- **A failed read and a genuine zero must never look the same.** When we do not
  know, the page says nothing rather than stating an unmeasured fact.

Show me each of the four sections in **both** states. This is the decision the
brief exists to make.

## Locked palette — Warm Editorial Archive (owner-locked, do not invent colour)

| role | value |
|---|---|
| page + card surface | cream `#FDFBF7` — **never pure white** |
| secondary surface | `#F4F2EC` |
| ink / primary text | `#2C2A29` |
| muted text | `#6E6A62` · faint `#8A857B` |
| rule / border | `#E1DCD1` · soft `#EDE8DE` |
| gold | `#A9834B` — **rules, dots, eyebrows, borders ONLY** |
| **action fill** | **deep gold `#8C6932`**, label cream `#FDFBF7` |
| text on a gold wash | **`#5C4726`** on `#F3ECDF` |
| links | slate `#3B4E67` |
| positive | `#4F6B4A` on `#E9EEE3` |

### 🚨 The contrast rules — these were measured, not guessed

- **Gold `#A9834B` cannot carry a word.** Cream on it is **3.37:1**, white
  **3.48:1**, against a **4.5:1** floor. Deep gold `#8C6932` is **4.86:1**. Any
  filled button uses the deep gold.
- **`#8A6B39` on the pale gold wash is 4.21:1 — also fails.** Text on a gold
  wash is `#5C4726` (**7.50:1**).
- **Never `#A09A8E` for small text** — 2.71:1 on the page. Use `#6E6A62`
  (5.22:1).
- Every label on a filled background must clear **4.5:1**. State the ratio in a
  comment beside any pairing you introduce.

**Light mode only.** Dark is dormant in the product by decision — commit to one
world and make it good.

## Type

Flat, editorial, calm. **Sans** for headings and body — tight tracking on
display sizes, generous line height in body. **Monospace** for eyebrows,
counts, money and dates: 11px, 700, uppercase, letter-spacing `.14em`.
Eyebrow gold is `#8C6932`.

**No CDN fonts** — the page is served under a strict policy that blocks them and
you will get a silent fallback. Use system stacks, or inline a face as a data
URI.

## Surface recipe

Cards: cream fill, **1px `#E1DCD1` border, 14px radius**, shadow
`0 1px 3px rgba(30,26,18,.06)`. **No blur, no glass, no gradient fills.**
Separation comes from the border, never a second surface tint. Pills are fully
round; minimum 44px touch target on anything tappable.

## Real copy — use these words, not placeholder

**Hero**
```
kick   Set na 'yan
title  Keep your memories.
       Plan your moments.
sub    The Filipino way to keep a celebration — remembered by everyone
       who came, not just the couple. Plan any event, free.
```

**Manifesto** *(already on the page; keep its voice)*
> A Filipino celebration was never one family's; it belongs to the whole
> **samahan** — the ninong and ninang, the titos and titas, the barkada,
> everyone who showed up. So the memory shouldn't belong to one camera either.
> Every one of them is holding a piece of your day. Setnayan is where those
> pieces come together, and everyone goes home with their own.

Non-sectarian at the top of the funnel. Faith-specific rites (binyag, kumpil,
kasal, aqiqah) belong on deeper pages, **never in the hero**.

## Do not

- **No prices anywhere.** They change and every copy becomes a dead number.
- No YouTube-style video wall. There is not enough content, and a sparse grid
  reads as abandoned.
- No lorem ipsum, no invented brand colours, no emoji as section markers.
- Do not redesign the six service demos — they ship and work.
- Do not add a second way to do something the site already does. If a mechanism
  exists, the design gives it a **door**, not a duplicate.

## Deliver

One HTML file. Inside it, show:

1. The **menu**, in its resting and active states, on desktop and on a phone.
2. The **hero**.
3. Each of the four doors, **in both the empty and the populated state**.
4. A short note naming which routes the archetype governs.

Make the navigation the thing I remember. Everything else on this page already
works — it simply cannot be found.
