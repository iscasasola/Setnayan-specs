# Design ask — one person, many hats: private collection → public presence → being found

> Written 2026-08-11. **A third, separate conversation** — keep it apart from the master
> prompt (public site + app seam) and the Papic prompt. This one is about **identity**:
> the same human being as a couple, a storyteller, a vendor and sometimes an admin, and
> how their private things become public things.

## ⚠ What I verified before writing this — one real hole

| Claim | Verified |
|---|---|
| A person already has a public page at `/u/{their-name}` — and it **doubles as their account's public website** (owner-ruled 2026-07-04), listing their chapters and their public celebrations nested beneath it | ✅ ships |
| Vendor shops are public at their **own bare web address** `/{business-slug}`, and are **in the sitemap** | ✅ ships |
| Wedding guest sites are public at `/{event-slug}` and **in the sitemap** | ✅ ships |
| **You can search for a public ACCOUNT** | ❌ **NO.** No people/creator search exists anywhere in the code — not on the front door, not in the marketplace. The front door's search groups are tools · vendors · real stories · journal. **People is not one of them.** |
| **A person's public page is discoverable by Google** | ❌ **NO.** The sitemap index carries static, help, blog, **vendors** and **weddings** — there is **no creators/people sitemap at all**, so `/u/{name}` pages are invisible to search engines. |

⇒ **A person can BE public but cannot BE FOUND.** That is the gap this ask exists to close,
and it is a design question before it is a build.

---

## Paste everything below the line

---

I need the design for **one person wearing several hats** on a Philippines-first life-events
platform (weddings first). The same human being can be all of these at once, and today the
product treats them as separate worlds:

- **A person planning their own life events** — their private collection
- **A storyteller** — they publish video chapters about events, publicly
- **A vendor** — they run a shop that couples book
- **An admin** — a few of them also run the platform's internal console

### What each hat already has

**Private (signed in):** a home board that is their **collection of events, ongoing and
completed**, holding four areas — **Events · Alaala** (their memories, for life, across every
event *including ones they only attended*) **· People** (family, godparents, friends, and
their communities) **· Spaces** (the things they run — their shop, the admin console).

**Public:** a **person page** at `/u/{their-name}` that is also their public website — their
video chapters and their public celebrations nested under it. A **vendor shop** at its own
web address. Each **wedding's guest site** at its own address. A **Journal** of articles and
**Real Stories** — published wedding features.

### What I need designed

**1 · The private → public boundary, made visible.**
A person's collection is private. Their person page is public. **Right now nothing shows
them where that line is, or lets them move something across it.** Design how a person sees,
in one place: what of mine is private · what of mine is published · and what it would look
like to a stranger. A wedding they hosted, a chapter they made, a photo in their memories,
their shop — each has a different answer, and today the answer is scattered across four
surfaces.

**2 · The hat switcher.**
Show how one person moves between being a couple, a storyteller, a vendor and an admin —
and how they know which hat they are wearing right now. A menu that carries this exists,
but it was designed as a jump list, not as an identity. ⚠ **A hat a person does not have
must not appear as a disabled option** — most people have exactly one.

**3 · Finding people — this does not exist and is the point of the ask.**
There is **no way to search for a public account** anywhere in the product, and person
pages are **not in the sitemap**, so they cannot be found from outside either. Design:
- **Searching public accounts** from the front door — storytellers and vendors are both
  "accounts"; decide whether they are one result type or two, and say why.
- **What a person result looks like** in a list — enough to tell two people apart, and
  never more than a public page already shows.
- **The empty case, which is today's reality:** almost nobody is public yet. A search for
  people must not read as broken.

**4 · The follow / connection distinction.**
Two different relationships already exist and are easy to confuse: **connections** are
mutual and confirmed by both sides — family, godparents, friends. **Following a
storyteller** is one-way and public. Design so a person never confuses "I know this person"
with "I watch this person."

### Hard constraints

- **Do not redraw** the app shell, the home board, the event dashboard, the vendor
  dashboard, the admin console, the vendor shop page or the marketplace. They are drawn and
  approved. **Extend them; if your answer needs one redrawn, stop and tell me.**
- **Nothing becomes public by default, ever.** Every crossing of that line is an explicit
  act by the person, and reversible.
- A person's page must never expose what event they attended as someone else's guest unless
  they published it themselves.
- **Colours:** cream `#FDFBF7` page and cards separated by border and shadow (never a second
  surface) · ink `#2C2A29` · the only action colour is terracotta `#C24E25` with cream
  labels · **gold is never a button** · counts and dates in a monospace face · 44×44
  minimum tap targets · light mode only.
- **Assume a phone first.**
- **Never show a zero where something failed to load** — an unknown is not a nought. Every
  empty state is a written invitation. No fake doors.

### Deliver

1. **The private → public map** — one screen a person can look at to understand what of
   theirs is visible.
2. **The hat switcher**, phone and desktop, for someone with one hat and someone with three.
3. **People search** — the entry point, the results, a person result card, and the
   nearly-empty state.
4. **A person page** (`/u/{name}`) reconciled to the rest — it exists but has never been
   drawn.
5. A short note on where following and connecting should each appear.

**Deliver as a downloadable bundle I can save.** A previous design of this product existed
only in a chat window and was lost.

---

## After it comes back

The two findings above are **build work regardless of the design**: a people search does not
exist, and `/u/{name}` pages are missing from the sitemap so Google cannot see them. The
second is a small, high-value fix — the vendors and weddings sitemaps already exist to copy.
