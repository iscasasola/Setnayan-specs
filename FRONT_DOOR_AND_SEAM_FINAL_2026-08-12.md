# The front door and the seam — finalized 2026-08-12

> **This is the answer to [`MASTER_DESIGN_PROMPT_2026-08-11.md`](MASTER_DESIGN_PROMPT_2026-08-11.md).**
> The drawing is [`prototypes/front_door_and_seam_2026-08-12.html`](prototypes/front_door_and_seam_2026-08-12.html)
> — one self-contained file, toggles for Desktop/Phone × Launch-day/Later × Signed-out/Couple/Vendor.
>
> Nothing already drawn was redrawn. The app shell, the invitation, the wedding website, the event
> dashboard, the vendor shop, the vendor dashboard, the admin console, the marketplace and the 19
> approved archetypes are untouched. This covers the two things nobody had drawn: **the front door's
> final layout, and the seam between signed-out and signed-in.**

---

## 0 · Everything below was measured, not assumed

Read from the **live production database** and **shipped code at `origin/main`** on 2026-08-12.
The prompt's figures were mostly right; three were not.

| Claim in the brief | Measured | Verdict |
|---|---|---|
| 0 storyteller videos | `creator_chapters` = **0 rows** | ✅ |
| 1 visible vendor | 2 shops exist; **1 is live** (a shop is live only at `public_visibility='verified'` **and** `verification_state='verified'`) | ✅ |
| 32 published articles | **33 live today**, 91 written, **58 scheduled ahead** | ⚠ moves daily — never hard-code it |
| Real Stories has content | **0 today.** All three weddings are future-dated or private, so the archive publishes nothing | 🔴 not in the brief — **four rails, not three, are empty** |
| Top folders: look 54 · booths 42 · venue 28 · design 26 · program 20 · prints 15 · planning 12 · documentary 12 · transport 11 · feast 7 | **Exact, every one.** Plus insurance 3 · experience 2 · logistics&safety 2 · **dining 1** · specialty 1 | ✅ (`dining` was missing from the brief's list — 15 folders, not 14) |
| `/contact` 404s, `/help` exists | Confirmed — there is no `contact` route | ✅ |
| Six tools have public doorways | **Eight do**, and they are code-enforced by a guard | 🔴 the brief under-counted |
| People is dormant | Confirmed — the page renders an honest "coming soon" with the flag off | ✅ |
| Spaces is capability-gated | Confirmed — the shipped nav takes `hasSpaces` and hides the slot | ✅ |

---

## 1 · The front door

### The sidebar moved left — and here is what it actually cost

**Not width.** The rail is 248 px on either side. What it cost is **reading order**: on the left the
rail is read *before* the feed, so its top rows became the first thing the page says.

Feed column and the Editorials shorts row:

| Viewport | Rail | Feed column | Shorts row |
|---|---|---|---|
| ≥ 1440 | 248 px | 1064 px | 6-up |
| 1280–1439 | 248 px | 960 px | 5-up |
| 1024–1279 | 72 px icon strip | ~880 px | 4-up |
| < 1024 | off-canvas behind the hamburger | full width | 3-up → 2-up on phone |

Scroll-spy sits on the left edge of the active row: a 3 px gold bar plus a warm fill. It is drawn on
the left because a right-edge marker on a left rail points away from the content it describes.

**Order and grouping are unchanged, as instructed. One form change:** My Home holds its position in
the list but is drawn as a **block, not a row** — bordered, with its own actions. It was "one plain
row among twenty and easy to miss"; keeping the order and changing the form fixes that without
re-shuffling anything else. If you would rather it were pinned to the very top of the rail, that is a
one-line change and it is your call, not a design one.

### The categories are real now — and the bigger problem is the labels

The five names in the concept are not folders. But the deeper finding is that **the folders' shipped
labels are the internal words.** The live marketplace says *Look* · *Feast* · *Documentary* ·
*Booths*. Nobody types those words.

Proposed customer-facing names. **This is a copy change only** — the web addresses, anchors and
`?folder=` links are untouched, so it costs nothing to make and nothing to migrate.

| Shows today | Proposed | Services | Slot |
|---|---|---|---|
| Venue | **Venues & churches** | 28 | visible 1 |
| Feast | **Catering & cake** | 7 | visible 2 |
| Documentary | **Photo & video** | 12 | visible 3 |
| Look | **Attire, hair & make-up** | 54 | visible 4 |
| Program | **Hosts, music & program** | 20 | visible 5 |
| Booths | **Booths, carts & bars** | 42 | show more |
| Design | **Styling, flowers & lights** | 26 | show more |
| Prints | **Invites, prints & souvenirs** | 15 | show more |
| Planning | **Coordinators & planners** | 12 | show more |
| Transport | **Cars & transport** | 11 | show more |
| Insurance & Protection | Insurance & protection | 3 | show more |
| Experience | Guest experiences | 2 | show more |
| Logistics & Safety | Logistics & safety | 2 | show more |
| Dining | Dining extras | 1 | show more |
| Specialty | Specialty | 1 | show more |

**Why those five, when they are not the five biggest.** The service count says how finely we chopped a
folder up, not how much anyone wants it. Booths has 42 entries because there are 42 kinds of cart;
catering has 7 because catering is one thing and everybody buys it. Ranking by count would put photo
booths above food and the church. So the visible five are ranked by **what a couple books first and
spends most on** — the place, the food, the photos, what everyone wears, and who runs the night.
Booths sitting immediately under "Show more" is correct: it is the fun, late, optional spend.

Worth noting, because it is a real asset nobody is showing: **Venue contains eleven faith-specific
ceremony venues** — Catholic, INC, Aglipayan, Born-again, Christian, SDA, LDS, Orthodox, mosque,
Hindu and Buddhist temple, gurdwara, synagogue. That is a genuinely Filipino thing no international
competitor has, and it is currently hidden behind the word "Venue".

### How search bridges the words — the real problem this page had to solve

Somebody types **photographer**. There is no folder by that name. The first result is not a shop and
not a spelling correction — it is **their word, with our folder shown beside it as a place**:

```
02 · VENDORS
  [Photo & video]   photography              in Photo & video      12 services
  [Photo & video]   pre-nup photographer     in Photo & video
  [Photo & video]   studio portrait photographer
  ── No shops in Photo & video yet.  Tell me when one opens →
```

We never ask anyone to learn our vocabulary; we show ours next to theirs, as a location. And when no
shop exists in that folder yet — which today is every folder — the panel says so plainly and offers
to tell them when one opens. **A real answer, not an apology.** The taxonomy is real even when the
shops are not, so search always has something true to return.

### Day one is the primary state, and it is emptier than the brief said

Four rails. **Three of them have nothing** — storytellers 0, real weddings 0 — and the fourth has one
shop. The Journal is carrying the entire page.

So the page re-composes rather than apologising four times:

| Rail | Today | Launch-day shape | Returns to its normal shape at |
|---|---|---|---|
| Trending storyteller | 0 | the slot is given to **the Journal's lead piece**, as a wide editorial card | 1 chapter |
| Editorials / Journal | 33 of 91 | **carries the page** — lead + 6 shorts + 3 cards | — |
| Real weddings | 0 | one written invitation | 2 published |
| Vendors | 1 | **"The first shops"** — the one real card beside an invitation to open one | 12 live shops |

**"Trending" over a field of one is a lie**, and this page's own rule is that trending is earned,
never sold. Below twelve live shops a ranking is noise wearing the clothes of merit, so the heading
is honest instead. Two of those thresholds already match what the homepage ships today (it swaps a
grid for an invitation below two). **Twelve is the one new number and it is yours to move.**

### Three things found while drawing

1. **"Contact us" has no page.** Drawn as **Help**, which exists, has search, and routes enquiries.
2. **Pakanta has no front door.** It is a paid product on the price list, reachable only from inside
   the app. It is therefore **not drawn** in the rail — a row that goes nowhere is the one thing this
   page forbids. Building it a doorway is a separate job; naming it here so it does not get lost.
3. **The tools list was short, not long.** The concept drew six; **eight** public doorways ship and a
   guard enforces the set — Papic · Live Studio · Pawebsite · Pa3D · Palogo · Alaala · Patiktok ·
   Setnayan AI. Pawebsite, Palogo and Patiktok were simply missing from the rail.

---

## 2 · My Home — three states, not four rows

| Area | State today | How it is drawn |
|---|---|---|
| Events | live | a door, with the real count |
| Alaala | live | a door, with the real count |
| People | deliberately off, pending legal review | **a notice, not a door** — no chevron, no hover, nothing to press |
| Spaces | only for accounts that run something | **names the thing** — "Studio Azul", "Setnayan console" — and does not render at all otherwise |

An ordinary couple therefore sees **two doors and one notice.** A greyed-out row invites a press that
fails; a sentence tells the truth and costs nothing. That is the shipped rule — *four honest targets
beat five with a dead one* — applied inside the sidebar rather than only in the feed.

**Signed out, the slot does not disappear — it becomes the sign-in.** One slot, two states: the way
in for a stranger, the way home for a member. It never greys out and it is never absent, which is
what makes it the page's single front-and-centre doorway.

**A fourth state is drawn that the brief did not ask for: the count that failed to load.** It reads
"couldn't load", never "0". An unknown is not a nought, and "0 photos" shown to someone with 148 is
how a person stops trusting a product.

---

## 3 · The seam — the round trip

**The rule that makes it one product: the rail never leaves.** It stays exactly where it is, the same
width on the same side, and its contents re-sort. Signing in is not a page you are thrown to — it is
the furniture rearranging around you.

**Going in**

1. On the public site — reading a shop page or an article. My Home sits in the rail as the sign-in
   block. Nothing nags.
2. They press Sign in — it opens **over** the page, not instead of it, so the page behind stays
   visible and it is obvious nobody is being taken anywhere.
3. **The rail re-sorts.** The block opens into Events · Alaala · People and rises to the top. The
   public groups stay, below it. Same rail, same width, same side.
4. **They land where they were going** — the shop they were reading, the half-written enquiry, intact.
   Only someone who signed in from the rail with no destination lands on the board.

**Coming back out**

5. Inside the app, the only thing that matters at this seam is the wordmark, top-left.
6. Pressing **SETNAYAN** returns them to the front door, **still signed in**, with My Home already
   open and a first row reading **"Back to your events."** You are a visitor to the public site, not
   an ex-member.
7. **Signing out lives in the account menu and nowhere else.** Visiting the public site never signs
   anyone out. The fear that it might is exactly what stops members from ever going back to read the
   Journal — which matters a lot when the Journal is the thing carrying the front page.
8. On a phone the index sheet closes and **the bottom pill rises.** Public site = top bar; signed-in
   app = bottom bar; the two never appear together, and the bar arriving is how a phone says you are
   inside without using a word.

---

## 4 · Recommendations on the already-drawn surfaces — not redraws

**a · Match the furniture across the seam.** The app's rail and the front door's rail should share
width and side (248 px, left) even though they carry different content and a different button colour.
The seam only reads as one product if nothing jumps.

**b · Let the sign-in panel wear the app's terracotta, not the front door's gold.** It is the first
room inside, not the last step outside. That turns the colour change from a mismatch into a threshold
you cross once, on purpose. This is the single place the two palettes meet, so it is worth deciding
rather than inheriting.

**c · The "usable without an account" dots are drawn but unpainted.** The grammar exists; which of
the eight tools earns one is a per-tool answer nobody has checked. Left blank on purpose.

**d · Reading time is real data.** The Journal already computes it, so the N-MIN badge on every
shorts card is honest — keep it, and let it be the one number on the card.

**e · The publishing schedule is now a front-page dependency.** 91 pieces written, 58 scheduled ahead,
33 live. The launch-day page leans on the Journal completely and it can carry that — but if the
schedule stalls, the front page visibly stalls with it. That is a business fact, not a design one.

---

## 5 · What needs you, not engineering

1. **Rename the fifteen category labels?** The proposed list is above. Copy-only, no migration. It
   affects the marketplace everywhere, not just this rail — which is why it is your call.
2. **Twelve live shops before the word "Trending" comes back.** Move the number if you disagree.
3. **Does Pakanta get a public page?** It is sold and has no front door. Building one is a job; not
   building one means it stays invisible to strangers.
4. **My Home stays in its list position, or gets pinned to the top of the rail?** Drawn in position.

Everything else in this pass is settled and drawn.
