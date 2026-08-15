# Stories × Editorial — one day, two tellings

**Decision + design record · 2026-08-15**
Companion prototype (open in a browser): `prototypes/stories_editorial_integration_2026-08-15.html`

Everything below was measured against the live product and the live database on
2026-08-15, on top of the RULE 0 search already run for this stream. This
document designs the deep integration — **one real day, told twice — Setnayan's
editorial and the host's own chapter — each pointing at the other, both
standing on the same real event underneath** — plus two same-day owner
directions: **when your own celebration is still coming up, the stories shelf
leads with days like yours** (D7–D13), and **every kind of celebration gets
its own editorial, not just weddings** (Gap 4 · D14).

> **One line on the reference picture:** the mockup the owner shared is a dark
> pitch-deck aesthetic. The product palette is locked terracotta-on-cream, so
> every screen here is drawn in cream; the dark look was deliberately not
> carried over.

---

## 1 · What already ships — do NOT rebuild any of it

- **The Real Stories shelf is already one shelf with three voices** (owner's
  "option B", 2026-08-13). Setnayan's editorials render as newspaper front
  pages ("The Ana & Marco Chronicle"), a storyteller's chapter renders as a
  byline-first video tile, and Journal articles keep their own article look.
  Every card says what kind of thing it is. One search box and one chip row
  cover all three. A standing council rule protects this: **the three voices
  never blur into one uniform card.** Nothing in this design proposes one.
- **The front door is also one shelf**, with working filter chips
  (All · Articles · Their stories · With video) and a kind tag on every card.
- **The chapter page already is the owner's picture**: the creator's film on
  top (embedded from their own platform, so they keep their views and
  earnings), a note about the candid gallery behind it, vendor cards that are
  only tappable when the vendor really was part of it (an unrelated name
  renders as plain text with no link), the vendor's viewer promo, view and
  follower counts, the Storyteller badge, share and report.
- **Curation ships on both sides**: editorials are curated by the team; a
  chapter is self-published and then featured by the team (publishing and
  being listed are two different things — that stays).
- **The cross-links already exist as rendered chips**: an editorial card can
  carry *"Watch the storyteller's cut"* and a chapter tile can carry *"Read
  the editorial"*. They are built, tested — and today can never appear,
  because of Gap 1 below.
- **A shop introduced from an editorial is already credited as such.**
- **The shelf already speaks in every kind of celebration** — its own public
  description names weddings, debuts, anniversaries, graduations, travels and
  reunions; every card carries a kind label built for that mix; and the
  curated samples it falls back to already show a debut, an anniversary, a
  graduation and a reunion beside the weddings. What refuses the mix is the
  machinery behind it — Gap 4 below.

---

## 2 · The three gaps, as a person experiences them

**Gap 1 — the bridge is built and no one can step onto it.** A couple whose
wedding has both a Setnayan editorial and their own chapter would see two
pages that never mention each other. The chips that connect them are already
drawn and already tested — but the product never learns that the two pages
are about the same day, because nothing ever records it. So the connection,
the one thing this whole feature is *for*, has never once appeared.

**Gap 2 — the product remembers the same day in two places that don't know
about each other.** The chapter's "shop this event" cards run off one memory
of which day it is; the cross-links run off a different one. Whichever a
person fills, the other stays empty. One day, two memories, and no screen
ever tells you the other exists.

**Gap 3 — the real day underneath is a fake door.** For a chapter to show its
day — gallery, vendors, the shop cards — the author must today paste a raw
machine code into a box, and a comma-separated list of more codes into a
second box. Nobody will ever do this, and the one real published chapter
proves it: both boxes empty. The product's entire differentiator — *this
film stands on a real, bookable day* — is unreachable by a normal person.

**Gap 4 — the shelf promises every kind of celebration and the machinery
refuses all but one.** The page's own description names debuts,
anniversaries, graduations, travels and reunions; every card carries a kind
label built for that mix; the samples already show them side by side. But the
real path refuses every non-wedding celebration outright, in six places,
before consent is even considered — fifteen of the sixteen kinds can never be
written up, and two real celebrations with public addresses sit in the
product today that the editorial team could not feature if they wanted to.
**The promise shipped; the gate never opened.** The owner has now said the
intent twice — *"not all stories will be wedding… each event can create a
similar editorial"* — so opening it is decided (D14), not a question.

---

## 3 · The decisions

*(Pre-launch and reversible, so these are made, not proposed — except the two
items in § 7, which are genuinely the owner's.)*

**D1 · One home for the day, not two.** A chapter remembers which celebration
it is about in exactly one place, and everything — the gallery teaser, the
vendor cards, the date and venue, the cross-links — reads from that one
memory. The old second memory is folded in: anything already typed there is
carried over automatically (today that is zero chapters, so this costs
nothing and never will be cheaper), and the box that fed it is removed.
*Why:* two memories of one fact is how the two halves of this feature shipped
working-but-never-connected in the first place.

**D2 · You pick your day from a list; you never type a code.** When someone
writes a chapter, the composer asks *"Which celebration is this about?"* and
shows only days that person was actually part of — the celebrations they
host, the ones they were a guest at, the ones their shop worked. No search of
strangers' weddings, nothing to paste.

- **The couple (the host):** the link is theirs to make — it takes effect
  immediately.
- **A guest or a booked vendor:** picking the day sends the couple a one-tap
  request — *"Marco wants to link his film to your wedding."* The chapter can
  publish right away, but plain: the day appears on it only after the couple
  says yes. Until then the author privately sees "waiting for Ana & Marco."
- **Someone with no tie to the day:** the day simply isn't in their list.
  There is nothing to ask for and nothing to type.
- The couple can also **unlink at any time**, and the day leaves the chapter
  the same moment. The film and the author's own words stay — only the
  borrowed layer leaves.

*Why:* the day's date, venue, team and gallery are the couple's, not the
author's. A link that surfaces them needs the couple's yes — once, in one
tap, phrased as what it actually shows (see § 5).

**D3 · The day brings its own team; nobody types vendor codes.** Once a
chapter is linked to its day, the day's booked vendors appear in the composer
as a ready-made list, all on. The author can switch any of them off of their
own page; they cannot hand-add a shoppable card for a shop that wasn't part
of the day — a name written in prose stays plain text, exactly as the shipped
rule already works. A shop that has a real collaboration with the author
still counts on its own, as it already does. The comma-separated box is
removed.

**D4 · The cross-link is a chip on cards and one quiet line on pages — and
absence is silent.** When one day has both tellings: the editorial card
carries *"Watch the storyteller's cut"*, the chapter tile carries *"Read the
editorial"* (both already built), the chapter page gains one line inside its
day section — *"Setnayan also told this day → Read the editorial"* — and the
editorial page gains the mirror line — *"Ana & Marco tell this day in their
own words → Watch their chapter."* When a day has only one telling, nothing
appears: no empty slot, no "no editorial yet." A missing thing is never
advertised.

**D5 · Three publications, three permissions — never merged.** Detailed in
§ 5. The one-line version: a guest's photo consent decides which *photos and
faces* may appear anywhere; the couple's showcase approval decides whether
*Setnayan's editorial* exists; and the couple's link approval (new, D2)
decides whether *someone else's chapter* may wear their day. Linking two
pages never shows anything that one of them wasn't already showing.

**D6 · Launch day is the design's home state.** With one chapter and zero
editorials, the shelf is the Journal carrying the page, plus one storyteller
tile once the owner features the existing chapter (one tap he can do today —
until then the shelf is Journal-only, which is correct: publishing and being
listed are different things). No cross-chips appear anywhere, because no pair
exists yet — and the page must look finished that way. One small, honest line
may invite the next story ("The first chronicles are being written — your day
could be one of them") because the composer it points to really ships. The
busy shelf is the upgrade, not the baseline.

*The owner added, the same day: "also, if they have on going events, we will
prioritize showing similar stories as well" — and corrected a premise: "not
all stories will be wedding… each event can create a similar editorial."
D7–D13 design the first; D14 carries the second, and D8 and D12 are written
against the mixed shelf it creates.*

**D7 · Your nearest day coming up is the one that drives it.** The shelf
leads with stories like yours only when you are signed in and one of your own
celebrations hasn't happened yet. "Hasn't happened yet" reuses the product's
one existing definition of finished — put away, or the date already passed,
Manila time — the same test the events board splits on, fed the same clock;
two clocks on one card is how a wedding once read "Tomorrow" on its own
morning. If several days are coming up, the nearest dated one drives: the day
actually approaching is the one being planned hardest. A celebration with no
date yet is genuinely undated, not "far away" — it just can't claim
"nearest," so it drives only when no dated one exists (then the one most
recently started). Someone with only finished celebrations, or none, sees the
ordinary shelf, unchanged.

**D8 · Start with the kind of celebration, refine by the suppliers, then by
the place — and never claim a likeness it can't back.**

> **Owner-set order, 2026-08-15, verbatim:** *"1. start with similar events.
> 2. then refine it with similar vendors. 3. then refine it with similar
> location."* ⚠ This **supersedes** an earlier draft of this decision that put
> the place second and the suppliers third. The owner's order stands; the
> reasoning below is why it is also the better one.

The shelf is a mixed shelf now (D14): every kind of celebration can be written
up, so the kind of day is the strongest signal there is — someone planning a
debut leads with debuts, never with weddings under a heading that implies
likeness. Then, in the owner's order:

1. **The kind of celebration.** A debut is like a debut.
2. **The suppliers** — the categories of the shops credited on the story, and
   the services it used. Two celebrations that hired the same *kinds* of people
   were planned the same way, whatever the postcode. **This is also the signal
   most likely to be worth money to the reader**: it is the one that ends in
   *"and here is who did it."*
3. **The place** — a day near their venue (real distance when the venue is
   pinned, the same city when it isn't).

Then, quietly, **the time of year**; and **wedding-shape signals refine only
weddings** — the ceremony's shape and setting (garden, church, beach, civil)
exist only for weddings and are empty for every other kind by design, so they
sharpen wedding-to-wedding matches and are silent everywhere else. The
platform's one scorer treats a missing signal as neutral, never a penalty — no
other kind is punished for that emptiness — but neutral also means those
dimensions cannot help a debut find a debut, which is exactly why kind,
suppliers and place carry the weight.

⚠ **One honest consequence of putting suppliers second.** A story's suppliers
are only known once shops are credited on it. Early on, many stories will carry
few credits or none, so the supplier signal will often be silent and the
ordering will fall through to place — which is fine and invisible, but it means
this ranking gets *better* as the marketplace fills, rather than working fully
on day one. It is not a reason to reorder; it is a reason the row must state
its real basis (D12).

This ranking ships as a **named lens on the platform's single similarity
scorer**. A written platform lock says there is exactly one scorer and that a
lens is a named set of weights handed to it — never a second scorer, never a
bespoke comparator. Stated here so no future session re-invents one.

**D9 · It shows as one labelled lead row — the shelf below it never moves.**
Signed in, with a day coming up and enough true matches (D12), the shelf
opens with a row called **"Days like yours."** The cards inside it are the
existing cards in their existing grammars — a chronicle stays a chronicle, a
chapter tile stays a chapter tile; no fourth card, the three-voices rule
stands. Everything below the row is the ordinary shelf, identical for
everyone — the editors' cover and ranking are shared judgment and are never
silently reshuffled per viewer. *Why a row and not a reorder:* a reorder
hides the personalisation and quietly overrides curation; a labelled row is
visible, explainable, and disappears cleanly.

**D10 · It says why in the person's own words, and the way back is the page
itself.** The row's heading states what actually fills it — *"Debuts like
yours,"* *"Garden weddings near Tagaytay,"* or, on the place fallback (D12),
*"Celebrations near Quezon City"* — and its subtitle says why: *"Because
Amara's debut is coming up on Mar 21."* All of it is facts they typed
themselves, never "people like you," never anything inferred from what they
clicked. A "See everything" link sits in the row's header (the marketplace's
escape, same manners), and because the row is additive, everything is already
right below it.

**D11 · Strangers and shared links see the shared page, always.** The stories
page is public. Signed out it is identical for everyone, with no hole where
the row would be — the row is additive, so its absence isn't visible. A
shared link never carries the sharer's personal order: the address is the
same for everybody, and the row exists only in the signed-in viewer's own
session.

**D12 · Three real matches or no row — and the heading always states the
real basis of what's in it.** The row renders only when at least three
stories genuinely score as good matches. One tile under a heading about
*your* day is a fake door; two reads as an error; three reads as a shelf.
With sixteen kinds of celebration, a debut planner may wait a while for three
debuts — so the row fills in two honest steps: if three stories of **their
kind** match, the heading names the kind (*"Debuts like yours"*); if not, the
row may fill on **place** across kinds — and then the heading says place
(*"Celebrations near Quezon City"*), never a kind it doesn't contain. A
heading must never imply a likeness the cards don't have. If neither basis
can fill three, there is no row, no heading, no apology: just the ordinary
shelf, exactly as the house relevance-gating pattern already works elsewhere.
Honest on day one, better with volume — never the reverse.

**D13 · Stories page only — not the front door.** The front door is the
shared public doorway with its own composition and its own volume gates, and
it already leads to the stories shelf in one tap. Keeping "like yours" in one
labelled place keeps it explainable and keeps the front door identical for
everyone. Because "similar" is one named lens, extending it to the front door
later is a small step — a later choice, not this build.

**D14 · Every kind of celebration can be written up — the wedding-only door
opens.** The owner has said it twice: *"not all stories will be wedding…
each event can create a similar editorial."* Today the machinery refuses
fifteen of the sixteen kinds outright, before consent is even asked, while
the page's own words, the cards' kind labels and the mixed samples already
promise the mix (Gap 4). Opening it is smaller than it sounds and creates
**no new consent machinery**: the permission the editorial already asks for
reads a slot every celebration has — a debut, a graduation, even a simple
date carries the same host slot, verified live. What actually changes: six
refusals stop refusing, and three fallback lines that say "A Setnayan
wedding" learn to name the kind of day they describe. The one real judgement
inside this — whether the most intimate kinds should be publicly written up
at all — is the owner's, § 7-3.

---

## 4 · The design, surface by surface

**The Real Stories shelf** — its structure is done and stays. Three deltas:
the two cross-chips begin to actually appear under paired cards (zero new
drawing — only D1/D2 making pairs possible); the shelf becomes genuinely
mixed (D14) — a debut chronicle beside the wedding ones is no longer only a
sample, and the shipped kind filter finally has real things to find; and a
signed-in person with a day coming up gets the additive **"Days like yours"**
lead row, below. Launch-day and busy states are both drawn in the prototype.

**The "Days like yours" row** (D7–D12) — at the top of the shelf, only for a
signed-in person, only while one of their celebrations is still ahead, and
only when at least three stories truly match. Its heading states the real
basis of the row — the kind when it is filled with their kind, the place when
it fell back to place — its subtitle names their day in their own words, and
it carries "See everything"; the cards inside are the ordinary cards in their
ordinary grammars; everything beneath it is the shared shelf, unmoved. For
everyone else the row simply isn't there, and nothing looks missing.

**The chapter page** — the film stays on top, untouched. The section beneath
it becomes **"The day beneath"**: the date, the venue and city, a small strip
of photos from the day's public gallery with "see the gallery", then "Shop
this event" with the day's vendor cards (tied = tappable card with the viewer
promo and a Book action; untied = plain text), then — only when the pair
exists — the one-line cross-link to the editorial. If the chapter has no
linked day, none of this renders and the page looks exactly as it does today.

**The editorial page** — one added line near the credits when the pair
exists: *"[The couple] tell this day in their own words → Watch their
chapter."* Nothing else moves.

**The composer** — the two code boxes are replaced by the day picker (D2) and
the team list (D3). Everything else in the composer stays.

**The couple's side** — a one-tap approval card where their notifications
already live: who is asking, which chapter, and exactly what linking will
show (date · venue · team · public gallery). Approve / Not this one. A
standing "Linked chapters" line on their event's settings lists what they've
approved, each with an Unlink.

---

## 5 · Consent and privacy (RA 10173)

Three publications of the same day, three separate legal bases — kept
separate on purpose. (A reading note now that every kind of celebration can
be written up: wherever this document says "the couple," read the
celebration's host — every kind has the same host slot, the permissions below
read that slot, and it is verified type-neutral in the live product.)

1. **A guest's photo consent** (given at RSVP, revocable) governs photos and
   faces. It is per-person and neither the couple nor Setnayan can override
   it. The chapter's gallery strip draws **only** photos the couple's own
   public gallery already shows — so it can never show a photo the guest's
   consent hasn't already cleared.
2. **The couple's showcase approval** governs Setnayan's editorial. Already
   ships; untouched.
3. **The couple's link approval** (new) governs someone else's chapter
   wearing their day. The approval card names exactly what it discloses —
   the date, the venue, the team, the public gallery — so the yes means what
   it shows. The couple's own chapter needs no separate approval: publishing
   it *is* the approval.

Standing rules that fall out of these:

- **A link is a pointer, never a permission.** The day appears on a chapter
  only as publicly as the day already appears on its own. A private
  celebration lends nothing — even to an approved chapter — beyond what its
  own locked page shows a stranger: the section simply doesn't render until
  the day itself is public.
- **Every consent unwinds by itself.** Showcase approval revoked → the
  editorial comes down and both cross-chips vanish in the same act (the
  shipped hide-unfeatures spine already works this way). Link approval
  revoked → the day leaves the chapter instantly; film and prose stay. A
  guest's photo consent revoked → their photos leave every surface at once,
  chapter strip included, because the strip only ever mirrors the public
  gallery.
- **The pair never out-discloses its parts.** Nothing becomes visible because
  two pages point at each other that wasn't visible on one of them alone —
  the same intersection principle already locked for mutual stories.
- **"Days like yours" reads nothing new and tells no one anything.** The lead
  row is computed from the viewer's own celebration — facts they entered
  themselves — never from browsing behaviour. Every story it shows is already
  public. It renders only in that person's own signed-in session, never on a
  shared link and never to a stranger, and its existence reveals nothing
  about the viewer or their day to anyone else.

---

## 6 · Launch day (today's real numbers)

9 accounts · 1 published chapter (not yet featured, no linked day) · 0
editorials · 5 events · 2 shops (1 verified). Concretely:

- The shelf: Journal articles carry it. The moment the owner features the one
  chapter, "Their stories" appears with one tile. No editorial section, no
  placeholder for one.
- The chapter page: today it renders plain (no day linked) — after this
  build, its author can link their day from a list in one tap, and the page
  grows its day section without republishing anything.
- Cross-chips: appear nowhere until the first day has both tellings. The
  first pair is the natural milestone this build makes possible.
- The "Days like yours" row: cannot appear on day one — it needs three
  genuinely matching stories and the shelf holds one. It stays absent, with
  no heading over nothing, until the story pool earns it (D12).
- Once the door opens (D14), an editorial can start from **any** of the five
  real celebrations — two of the non-wedding ones already have public
  addresses — and until real ones arrive, the mixed sample set (a debut, an
  anniversary, a graduation and a reunion beside the weddings) is the honest
  cold-start face of the shelf.

---

## 7 · Genuinely the owner's calls

1. **Scope at launch: who may ask to link.** Recommended: ship the full
   handshake (host links instantly; guests and booked vendors may ask, couple
   approves). The cautious cut is host-only at first — one switch of scope,
   no rework later, but it delays the most likely real author (the
   videographer-guest, the content-creator friend). **Owner picks the scope.**
2. **Vendors authoring chapters about client celebrations.** The same handshake
   protects it (the couple must say yes), but a shop publishing content built
   on a client's day is a positioning/risk trade-off, not an engineering one.
   Recommended: allow, behind the same couple approval, and watch the first
   few. **Owner may veto vendors as authors entirely.**
3. **Should the most intimate kinds be publicly written up at all?** Opening
   editorials to every kind is decided (the owner said it twice, D14). But a
   *date* or a *hangout* is intimate in a way a wedding is not — a public
   write-up of somebody's date, even a consented one, is a judgement about
   what the brand celebrates, not an engineering question. Recommended: open
   the door for all sixteen kinds, and simply never *solicit* the most
   intimate ones editorially — they can still be featured when the people
   involved ask for it themselves. **Owner rules on which kinds, if any,
   stay unsolicited or closed.**

Nothing here touches a price, and the similar-stories addition (D7–D13)
creates **no new owner call**: the one judgment in it — a labelled lead row
on the stories page rather than the front door — is reversible, and if the
owner ever wants it on the front door too, that is a small later extension of
the same lens, not a redesign. The two-tellings wording and the "Days like
yours" wording are recommended copy; the owner may re-voice either without
anything else changing.

---

## 8 · Build order — engineering appendix

*(Identifiers live in this section only.)*

**Phase 1 — give the join its writer (smallest delta, closes Gap 1 + 2 + most
of 3 in one PR).**
- Composer: replace the `papic_gallery_id` + `vendor_ids` text inputs in
  `app/dashboard/(account)/creator/page.tsx` with an event picker listing the
  author's memberships (host events + guest memberships + vendor bookings —
  the same joins `resolveShoppableVendors` already trusts).
- `createChapter` / update action writes `creator_chapters.event_id`.
- Substrate becomes derived: the builder populates `papic_gallery_id` **from**
  `event_id` (one home; the teaser generator keeps working unchanged), and
  stops accepting it as input. One-time backfill copies any existing JSON
  value into the column — prod: 0 rows, verified 2026-08-15.
- No new drawing: `loadChapterCutsForEvents()` and both shipped chips begin
  firing on the first linked pair. `stories-one-shelf.test.ts` untouched.
- Guard: a writer-exists test for `creator_chapters.event_id` (this is the
  project's sixth gate-with-no-handle; the register test pattern in
  `gates-have-handles.test.ts` is the home for it).

**Phase 2 — the handshake.**
- One column on `creator_chapters`: `event_link_state ∈
  ('self','pending','approved','declined')` (+ decided-at). Host-authored
  writes `'self'`. RLS: only the event's couple may set
  approved/declined; only the author may set pending. The day
  section and cross-rails render only on `'self' | 'approved'`.
- Approval card rides the existing notify + audit spine; unlink = couple
  flips state back, revalidate does the rest.
- The verbs matter (house rule: a guard is only as wide as its verbs) — the
  state must be constrained on INSERT as well as UPDATE, or an author inserts
  a chapter born `'approved'`.

**Phase 3 — the team list + the two page lines.**
- Composer renders the event's booked vendors as toggles; hidden ones persist
  as a small exclusion list in the substrate (author-owned, display-only —
  the shoppable *tie* stays computed by `resolveShoppableVendors`, never by
  the author's list).
- The "day beneath" band on the chapter page (date · venue · public-gallery
  strip) and the one-line cross-links on chapter + editorial pages.
- The gallery strip must read the couple's PUBLIC gallery through the same
  path a stranger reads it — never a wider internal read (RLS is a floor,
  not a scope).

**Phase 4 — open the editorial door to every kind (the owner's 2026-08-15
correction, Gap 4 · D14).**
- Remove the six `event_type === 'wedding'` refusals across the editorial
  candidate loader, the published loader and the `/admin/real-stories`
  eligibility check; replace the three "A Setnayan wedding" fallback strings
  with kind-aware copy. **No new consent machinery** — the principal-member
  slot the consent check reads already exists on non-wedding events (verified
  in prod on a date and a simple event); the public address, the grace
  window, the featuring columns and the audit/notify spine are already
  type-neutral.
- If the owner closes or de-solicits some kinds (§ 7-3), that is an allowlist
  in ONE place — never six scattered refusals again.
- Guards: a seeded non-wedding event with consent must appear as a candidate
  AND publish end-to-end (the mechanism proven reachable, not assumed); plus
  a copy check that no surface renders "wedding" for a non-wedding story.

**Phase 5 — the similar-stories lens (the owner's 2026-08-15 addition,
D7–D13; depends on Phase 4 for the mixed shelf).**
- A named lens on `lib/compat-score.ts` — THE one scorer. Its own docblock
  forbids a second scorer or bespoke comparator; this ships as a named weight
  vector passed to it, nothing else.
- **Weight order is OWNER-SET (2026-08-15) — do not re-rank it without him:**
  1. **`event_type` equality — highest.** 2. **Supplier similarity** — overlap
  of the credited shops' service categories, plus the services the story used.
  3. **Venue proximity** — real distance from lat/lng, city equality as the
  fallback. Then, lower: month-of-year proximity. ⚠ An earlier draft had
  proximity at 2 and suppliers at 3; the owner's order supersedes it and is
  recorded in D8.
- The wedding-only columns (ceremony type, secondary ceremony, venue setting)
  refine within weddings only — they are NULL for every other kind by design;
  absent signals resolve to the scorer's neutral (0.6), never a penalty.
- ⚠ **The supplier dimension is silent until stories carry credits**, so early
  on the ordering falls through to place. That is expected, not a bug — but it
  is why the row's heading must be derived from the basis that actually filled
  it (D12), never hardcoded.
- The driving event: filter the viewer's events through `isFinishedEvent()`
  **with the same today-value passed in by the caller** — that function's
  docblock records the Manila-vs-UTC "Tomorrow on the wedding morning" bug;
  never derive a second clock, and never resolve "the person's event" as
  their first event (the primary-vs-current trap). Pick the nearest dated
  upcoming; if none is dated, the most recently created.
- Row fill (D12): kind-basis first — ≥3 candidates of the viewer's kind at
  the scorer's existing "good" tier ⇒ the heading names the kind; else
  place-basis across kinds — ≥3 by proximity ⇒ the heading names the place;
  else no row. **The heading string is derived from the basis actually used,
  never hardcoded.** Reuse the tier names; no new thresholds.
- Rendering: the row is fetched per-viewer, outside any shared/static cache —
  the base shelf stays shared, and the personalised row must never enter
  cached HTML another person can receive. The signed-out render stays
  byte-identical to today's. The front door is untouched (D13).
- Guards, each mutation-verified by occurrence count: the row can actually
  fire (seeded: 3 debuts ⇒ a kind-labelled row — a mechanism never proven
  reachable is decoration) · label-basis honesty (knock out the same-kind
  matches so the row fills on place, and assert the heading switches to the
  place form — a kind heading over mixed contents must fail) · signed-out
  output identical · below-gate renders nothing.

Each phase is a separate, reversible PR; nothing is flag-gated except by the
owner's § 7-1 scope choice (host-only = simply not rendering the ask path).

---

## 9 · Where the brief's measurements were extended (for the record)

- The composer with the two code boxes lives in the creator studio
  (`/dashboard/(account)/creator`), not on the public profile pages.
- A teaser generator also consumes the gallery value — folding the two homes
  into one (D1) must derive its input from the event link, which Phase 1 does.
- The "no border / no shadow" card lock describes the thumbnail-led grammars;
  the shipped storyteller tile deliberately carries a hairline border as part
  of its own distinct grammar. Both are respected as shipped.
- The one published chapter is also **not yet featured**, so strictly the
  launch-day shelf shows zero chapters until the owner's one-tap feature —
  the launch-day screen in the prototype shows the moment after that tap.
- The owner's 2026-08-15 correction withdrew the wedding-dominance premise an
  earlier brief had supplied ("event type would be a no-op filter"). D8 and
  D12 were rewritten in place, not annotated, so no sentence asserting
  weddings-only or a no-op kind signal survives in either file.
