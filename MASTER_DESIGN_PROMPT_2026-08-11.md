# The full design prompt — the public website and the app as ONE product

> Written 2026-08-11. **This supersedes sending the front-door ask on its own.**
>
> **Why a master prompt exists at all:** the 8 August bundle
> (`design_handoff_setnayan_redesign/`) drew the signed-in app — shell, home, event
> dashboard, vendor dashboard, admin — and the YouTube-shaped front door was drawn on
> **11 August**, three days later, by a different pass. **Nobody has ever drawn the two
> together.** The seam between "a stranger on the public site" and "a member inside the
> app" is the one thing genuinely missing, and it is exactly what the owner is asking for.
>
> ⚠ **The value of this prompt is as much in what it FORBIDS as what it asks for.** Eight
> surfaces are already drawn and owner-approved. This project has paid twice for one page.

---

## Paste everything below the line

---

I need the **public website and the signed-in app finalized as one continuous product**, for a Philippines-first life-events platform (weddings first) called **Setnayan**. Most of it is already drawn and approved — I will say exactly what not to touch. **The job is the seam and the front door, not a redesign.**

### The product, in one paragraph

Couples plan an event end-to-end. Their guests get an invitation site, a seat, and a camera. Vendors run a free shop and get booked. A small team runs an admin console. **Photos are the spine**: a capture product called **Papic** is the couple's collection of memories and the main source that fills it — an account-level memories shelf reads directly from it, including weddings a person only *attended*. It is live in production but nearly empty: **1 visible vendor, 0 storyteller videos, 32 published articles, a handful of events.**

### The whole map — what connects to what

**Public (signed out):** a YouTube-shaped front door · a marketplace of vendors · vendor shop pages at their own web address · each couple's guest site at its own address · a Journal of articles · Real Stories (published wedding features) · storyteller pages · six product pages.

**Signed in, the home board is the person's collection of events — ongoing and completed** — and it holds **four areas**: **Events · Alaala (their memories, for life, across every event including ones they attended) · People (family, godparents, friends, and their communities) · Spaces (the things they run — their shop, the admin console)**.

**From the board:** Events → the event dashboard · Spaces → the vendor dashboard and the admin console.

**So the whole chain is: front door → My Home → the board → the three consoles.** That chain exists in code today. What has never been drawn is how it *feels* as one continuous thing.

### 1 · The front door — finalize it

The structure is agreed and should not change: centred search over everything with grouped results, a sidebar, and a feed in this order — Trending storyteller → Editorials shorts row → More stories → Trending vendors. Mobile is a single column with a hamburger index.

**Corrections, each measured against the live product:**

**a. The sidebar is on the LEFT.** This overrides the concept file, which says "right sidebar (never left)". The reference is YouTube and YouTube's rail is on the left. Everything keeps its order; only the side changes. Say what it costs the feed width and the shorts row at desktop sizes, and show the scroll-spy on the left.

**b. Replace the category list — the drawn names are not real.** The live top-level folders, largest first: **look (54 services) · booths (42) · venue (28) · design (26) · program (20) · prints (15) · planning (12) · documentary (12) · transport (11) · feast (7)**, plus insurance, experience, logistics & safety, specialty. Recommend which five earn the visible slots above "Show more", and why. ⚠ **Photographers and videographers both sit inside *documentary*; catering is *feast*; hosts and bands are *program*.** So the friendly words people search for are NOT the folder names — **show how search bridges that gap.** That is the real problem this page has to solve.

**c. "Contact us" must point at Help.** There is no contact page; there is a Help surface with search.

**d. Design the empty day-one page as the PRIMARY state, not a variant.** With 0 storyteller videos and 1 visible vendor against 32 live articles, **three of the four rails are empty on launch day and the Editorials rail carries the whole page.** Show me the real launch-day screen, desktop and mobile, and make it feel deliberate rather than unfinished. Give Editorials more of the page in that state, and say how it re-balances as stories and vendors arrive. The busy version is the future; the empty one ships first.

**e. Do not paint the "usable without an account" dots yet.** Draw the dot grammar; which tools carry it is unverified.

### 2 · The seam — this is the part nobody has drawn

**"My Home" in the sidebar is the hinge of the whole product.** Today it is one plain row among twenty and it is easy to miss. It must:

- **Expand into the four areas** — Events · Alaala · People · Spaces.
- **Show their REAL states, not four equal rows.** The shipped rule is *"four honest targets beat five with a dead one."* Today: **Events and Alaala are live · People has a part that is deliberately on hold pending legal review · Spaces exists only for people who actually run something** and is hidden otherwise. So an ordinary couple sees three, not four. **No fake doors:** an area with nothing in it gets a written invitation, never a disabled row.
- **Signed out, it does NOT disappear — it becomes the SIGN-IN.** One slot, two states: the way in for a stranger, the way home for a member. Draw both.
- **Reach the consoles.** A vendor should get from the public site to their shop, and an admin to their console, through this — both live under Spaces.

**Then show the transition itself:** what a person sees the moment they sign in from the front door, and how they get back out to the public site without feeling ejected. **That round trip is the deliverable I do not have.**

### 3 · What is ALREADY DRAWN — do not redraw any of it

Reconcile to it if you must reference it, but it is done and approved:

- **App shell**, phone bottom bar, desktop rail
- **Invitation and the wedding website** (phone + desktop)
- **The signed-in home and the event dashboard** — including a per-widget deep-dive
- **Vendor shop page** (phone + desktop) · **vendor dashboard** (calendar, desktop, phone)
- **Admin console** · **marketplace, compare, the inquiry→booking flow**
- **12 archetypes + 7 overlay types**, approved with no changes

**If your answer involves redrawing one of these, stop and tell me instead.**

### 4 · Locked — do not "correct" these

- **The front door keeps its OWN look:** gold `#8C6932` action buttons with cream labels, and its own system typeface. This deliberately differs from the app and is a deliberate ruling — do not swap in the app's terracotta or fonts **on this page**.
- **Everywhere else in the app:** the only action colour is terracotta `#C24E25` with cream labels, and **gold is never a button**.
- **Both:** cream `#FDFBF7` page and cards, separated by border and shadow — **never a second surface** · ink `#2C2A29` · counts, money and dates in a monospace face · dates as "12 Dec 2026" · **44×44 minimum tap targets** · light mode only.
- **Never show a zero where a count failed to load** — an unknown is not a nought. Every empty state is a written invitation. No fake doors.
- Marketplace cards show **no prices**, and a new vendor reads "new", never 0★.

### What to deliver

1. The finalized front door — **desktop and mobile**, in both the **day-one empty** and the future busy states.
2. **The My Home expansion**, signed in and signed out, with the real per-area states.
3. **The seam**: the sign-in transition, and the route back out to the public site.
4. A short note on anything you believe should change in the already-drawn surfaces — **as a recommendation, not a redraw.**

**Deliver it as a downloadable bundle I can save.** A previous design of this product existed only in a chat window and was lost, which is why one screen shipped with menus and no layout.

---

## After you send it

- **Keep the Papic prompt separate** (`ASK_CLAUDE_DESIGN_2026-08-11.md`). Different page, different palette rules — the front door gets gold buttons and Papic does not, and mixing the two conversations is how one bleeds into the other.
- **Do not ask where anything should live.** Location is settled: the Papic control room stays in the event's Studio, the memories shelf stays account-level, and the consoles stay behind Spaces.
