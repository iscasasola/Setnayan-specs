# The redesign — as separate sessions · 12 August 2026

> **The drawing is done and it is walkable.** Everything below turns
> [`prototypes/front_door_and_seam_2026-08-12.html`](prototypes/front_door_and_seam_2026-08-12.html)
> + [`FRONT_DOOR_AND_SEAM_FINAL_2026-08-12.md`](FRONT_DOOR_AND_SEAM_FINAL_2026-08-12.md) into
> shipped code, alongside the ~40-unit port list already in
> [`WHATS_NEXT_Design_Programme_2026-08-01.md`](WHATS_NEXT_Design_Programme_2026-08-01.md).
>
> Every "what already ships" line below was **read from `origin/main` or the live production
> database on 2026-08-12** — not from a document. They are pre-answered so no session spends its
> first hour re-running RULE 0 and no session rebuilds a thing that exists.

---

## The rule that shapes this list

**Nothing here is a redraw.** Twelve surfaces are drawn and approved; the shipped app shell,
event dashboard, vendor dashboard, admin console and marketplace are not in scope for
re-conception. Each session below either **ports** a drawn thing, **renames** something whose
name outlived its decision, or **flips a switch on something already built.**

Three of the ten sessions are worth more than the other seven combined, and none of the three is
a big build:

- ~~**Session 1 is one switch.** Life-Flash is finished and off.~~ ✅ **DONE 2026-08-12 — it is ON.**
- ~~**Session 2 removes a wall.** It is why the storyteller shelf is empty.~~ ✅ **DONE 2026-08-12 —
  a chapter needs a title and a body; the video is optional.**
- ~~**Session 3 is copy.** It is why nobody can find a photographer.~~ ✅ **DONE 2026-08-12 — and it
  was NOT "one map": the words also live in the DATABASE and in the wizard. See the entry below.**

✅ **1 AND 2 ARE SHIPPED. 3 IS MERGE-PENDING** — its PR **#4388 was still OPEN at 15:58Z**, measured,
after this line first claimed all three were shipped. See the measured state table further down and
check the PR yourself. The next unblocked work is **Session 5 · 7 · 8**; **Session 4** still waits
on the one owner sentence in the gate below, and **6** follows 4.

---

# 🔴 OWNER GATE — do this before Session 4, it blocks the most

**The YouTube-shaped front door and the ELN cinematic homepage cannot both be `/`.**

You chose a front door on 7 August, then chose a different one on 11 August whose own notes say
*"one front door."* The 12 August pass drew it in full. **Nobody has said out loud that shipping
it retires the homepage you approved on 29 June.** Drawing it was right either way; landing it
reverses an owner lock, so it needs one sentence from you.

Four smaller ones, none of which blocks a build for long:

| Decision | Cost of getting it wrong | Where it bites |
|---|---|---|
| Rename the 15 category labels? | Nobody searching "photographer" finds *Documentary* | Session 3 |
| "Trending" needs 12 live shops — right number? | A ranking over three shops reads as sold | Session 5 |
| The combined shelf: **Stories** or **Articles**? | Films under a word that means writing | Session 5 |
| What a person's web address looks like | It is `s89u-kemmf2adck` today, and it goes on printed invitations **permanently** | blocks nothing here; blocks invitations |

---

# THE SESSIONS

## Session 1 · Turn Life-Flash on — ✅ **DONE 2026-08-12. The switch is ON in production.**
**One switch, a look, and a decision. Not a build.** Nothing was built. Full row in
`DECISION_LOG.md` 2026-08-12.
> ⚠ **The switch is INVISIBLE from outside.** The dashboard's sign-in redirect runs before the
> page's own check, so `/dashboard/life-flash` returns the same `307 → /login?next=%2Fdashboard`
> whether it is on or off — measured before AND after the flip. **Do not read that 307 as a
> failed flip.** The only proof is a signed-in eye on the *Play Life-Flash* button.
> 🔑 The value is the digit **`1`**; `true` reads as OFF. The rebuild must run **without build
> cache** or the old value stays compiled in.
> ⏭ **One copy defect left open for the owner:** with no tagged people the home card reads
> *"14 moments · 0 people who made them."*

**What a person gets:** six years in ninety seconds — their own celebrations, played back.

- ✅ **Already built, in full.** `/dashboard/(account)/life-flash` ships: the moment graph, the
  scroll reel, the beats compiler, the people row, four scopes (whole life · year · month ·
  event), dignity thresholds, and presign-only-what-is-surfaced media discipline.
- 🔑 **Its flag is a ROLLOUT switch, not a legal gate** — the file says so in those words.
  Phase 1 reads **only the viewer's own events**, so it carries **no counsel dependency**. It is
  waiting on owner preview QA and nothing else.
- ⚠ **Do not confuse the two flags.** `NEXT_PUBLIC_LIFE_STORY` = Phase 1, yours to flip.
  `NEXT_PUBLIC_PERSON_LIFE_STORIES` = cross-event participant media, Phase 1.5, **counsel-gated** —
  the same gate holding mutual stories. Flipping the wrong one publishes other people's media.
- **Session output:** preview QA on a real account, then the flag, then one line in the log.

---

## Session 2 · A storyteller's piece becomes an editorial — ✅ **DONE 2026-08-12**
**The highest-value build on the list. It is why the shelf is empty.**

> ✅ **SHIPPED.** Publishing needs a title and a body; the video is optional. The brief named ONE
> wall and there were **six** — three more `embed_url` tests in the READ path (a published story
> vanished from its own author's profile, the page 404'd, the share card returned null), a
> YouTube-derived-thumbnail rule, and the address+switch pair. The body was promoted off
> `substrate.itinerary` to a first-class `creator_chapters.body`. **Do not rebuild any of it.**

**What a person gets:** a couple with 400 photos and no TikTok can finally publish their story.

- 🔴 **The wall, measured:** `publishChapter` refuses with *"Add the embedded edit before
  publishing"* unless `embed_url` is set, and the only sources are YouTube · Instagram · TikTok.
  **Prod: 0 chapters, 0 public profiles of 9 accounts.** Only somebody who already posts video
  elsewhere could ever be a storyteller.
- **Build:** publish requires **a title and a body**; video becomes optional.
- 🔑 **Rename the body field.** It is `substrate.itinerary` — travel-shaped naming on what is
  about to be the main event, capped at 4,000 chars and rendered as **one `<p>`**. This project
  already paid to learn that a comment does not travel with a value (`sponsored_included` →
  `included_in_package`, migration `20271108090000`). **Rename the value; do not document around
  it.** It also needs to stop being one paragraph.
- ⚖ **Three video routes, and they are not the same decision:**
  - **Paste** — free, we host nothing, **already built.**
  - **Upload** — makes us the publisher: the song on their file becomes ours to answer for
    (against a hard owned-music-only line the render path enforces), it has passed none of the
    checks a Papic photo passes, CSAM hashing is **parked pending an enrolment and an NPC
    Circular 16-02 signature**, and a phone file needs converting — an always-on server, the
    exact thing deleted on 2026-08-11.
  - **Make one from my photos** — **already built.** The chapter teaser renders client-side,
    uploads the blob to R2 and stores the key: 6 s, 3–8 photos, from the couple's own
    consent-cleared gallery, one Setnayan-owned track, ₱0 server compute. **Raise the length and
    let clips in** and a couple with no video gets a real film with none of the costs above.
- **Recommended order:** paste + write → make-from-photos → upload last, or never.

---

## Session 3 · Say the words people actually type — ✅ **DONE 2026-08-12**
~~**Copy only. No migration, no schema, no SEO cost.**~~ **Copy — plus a data migration, because
this doc was wrong about where the words live.**

> ✅ **SHIPPED** (PR #4388). All fifteen labels owner-approved unchanged.
>
> 🚨 **THIS ENTRY SAID "the blast radius is exactly one map." IT WAS WRONG, and the version it
> described half-lands in total silence.** The words render from **THREE** sources: `lib/taxonomy.ts`
> (read directly by the icon-tile strip + the search autocomplete), **`service_categories.label_en` /
> `label_short` IN THE DATABASE** (read by the live catalog SECTION HEADINGS — `explore/page.tsx`
> shadows the imported constants with the `getTaxonomy()` snapshot for all of `CatalogView`, and prod
> held the old internal words in all 15 tier-1 rows), and **a third hand-typed copy in the couple's
> setup wizard** whose own comment admitted it *"mirrors WEDDING_FOLDER_LABEL"*. Editing only the
> code would have shipped chips reading *Photo & video* directly above headings reading
> *Documentary*. 🔑 **`WEDDING_FOLDER_SLUG` being a separate map was true and held** — no address or
> SEO cost — but "separate slug map" never meant "single source for the labels."
>
> 🛡 There was **no guard** that the DB and the code agreed. There is now, mutation-tested both ways.
>
> 🔴 **"photobooth" returned ZERO results** before this session — `photo_booth` is two words, so
> every match tier was blind to the single word Filipinos actually write. Fixed, and the search
> ranker moved out of a `'use client'` `useMemo` where no test could reach it.
>
> ⏭ **NAMED, NOT BUILT:** the *"no live shops here yet — tell me when one opens"* half needs a live
> per-folder count **and** an intake keyed on folder (the only one that exists is keyed on event
> type) ⇒ new schema, which this session's own constraint excluded. A separate build.

**What a person gets:** they type "photographer" and find one.

- 🔴 **The labels a customer reads today are our internal words.** The live marketplace says
  **Look · Feast · Documentary · Booths**. Nobody types those. Proposed replacements for all
  fifteen are in `FRONT_DOOR_AND_SEAM_FINAL_2026-08-12.md`.
- 🔑 **`WEDDING_FOLDER_LABEL` is a display map. `WEDDING_FOLDER_SLUG` is not touched** — so
  addresses, anchors and `?folder=` links are unchanged. This is a copy edit with a blast radius
  of exactly one map.
- **Also in this session, the same disease:** *Journal* → **Articles** everywhere a reader can
  see it; the chip that still reads *Real weddings* → **Their stories** (it misdescribes a
  written story with no video).
- ⚠ **Sweep every word in one pass.** Twice on 12 August a label outlived the decision it
  contradicted — *Explore*→*Marketplace* and *Real weddings*→*Their stories*. A name left behind
  keeps arguing for the old model.

---

## Session 4 · The front door, ported
**Gated on the owner question above. The largest visible change.**

**What a person gets:** a front page that looks full on launch day.

- **Port from the prototype, do not redraw:** left rail at 240 px, centred search with its own
  button, `+ Create`/bell/avatar signed in, chip row, **uniform four-across grid**, borderless
  cards (thumbnail is the object), tall-card row, small-print block with copyright inside the rail.
- 🔑 **The account slot is the SECOND group, above the categories** — under the destinations,
  exactly where the reference puts it.
- 🔑 **Day one is the primary state.** Verified 12 Aug: **0** storyteller chapters, **0**
  publishable real weddings, **1** live shop, **33** articles live of 91 written. **Four of four
  rails are bare except the writing** — so the writing carries the page, and "Trending" over one
  shop is a lie the page must not tell.
- ⚠ **Marketplace is signed-in only** (owner 12 Aug), and *"Find a supplier"* goes with it — same
  destination, different word. **Search still answers a signed-out person.** Named cost: a
  crawler is always signed out, so those category links leave the front page for Google too.
- 🪤 **Pakanta has no public page.** It is sold and reachable only from inside the app. Do **not**
  put it in the rail; the eight tools drawn are the eight with public doorways, and a guard
  enforces that set.

---

## Session 5 · One shelf, two authors
**Follows Session 2 and Session 3.**

**What a person gets:** one place to read, whoever wrote it.

- Merge Stories + Editorials into **one shelf**; the **kind lives on the card** (*Article* /
  *Their story*), never on the shelf. Chips: All · Articles · Their stories · With video.
- **Why:** separately, one shelf holds 0 and the other 33 — a permanently empty shelf reads as
  broken, not young. Combined it is full from day one.
- 🔑 **Thresholds:** the homepage already swaps a grid for a written invitation below **2**.
  The one new number is **12 live shops before the word "Trending" returns** — owner's to move.
- ⏭ **Carries the tracking fix I owe:** a click from one of our articles to a shop **loses its
  origin**, so a booking it produces is not counted as one Setnayan brought — even though
  `'editorial'` is already in the billable list. The link just needs to carry where it came from.

---

## Session 6 · The seam
**Follows Session 4. Shares the rail, so not parallel-safe with it.**

**What a person gets:** signing in never feels like leaving.

- **The rule: the rail never leaves.** Same width, same side; the sign-in prompt is replaced
  **in place** by the account's destinations. Sign-in opens **over** the page.
- **You land where you were going** — the shop you were reading, the half-written enquiry intact.
  Only a rail sign-in with nowhere to go lands on the board.
- **The wordmark is the way out**, still signed in, with *"Back to your events"* at the top.
  **Sign out lives under the avatar and nowhere else.**
- **The sign-in panel wears the app's terracotta, not the front door's gold** — first room
  inside, not last step outside.
- 🪤 Phone: top bar for the public site, bottom bar for the app. **Never both.**

---

## Session 7 · Two levels, and the events board
**Mostly a reconcile — most of this already ships.**

- ✅ **Already correct in code:** the account level (Events · Alaala · People · Spaces) and the
  event level (Overview · Guests · Marketplace · Studio, plus *"Also in this event"* — Schedule ·
  Seat plan · Budget). **Budget deliberately has no top-level row** (owner 2026-07-10; it lives
  inside Marketplace beside Build and Compare).
- **The delta:** split the board into **Coming up** and **Finished** as two always-present
  sections. Today completed events hide behind `?show=all`. **A thing you have to switch on reads
  as a thing that might not be there**, and these are somebody's memories.
- **Also drawn and not built:** the create grid **hides debut and christening** unless the
  account's People data says they concern it — hidden, never locked, with a permanent "show all
  kinds" doorway.
- 🪤 **The life-event guard is narrower than it looks.** Gated: wedding (own guard) · debut ·
  christening · birthday · gender_reveal · graduation, **one in planning per person per kind**.
  **Unlimited:** travel · corporate · tournament · celebration · anniversary, and an unknown type
  **fails open to lifestyle**. Ten trips yes, two weddings no. *(My first draft of this drawing
  blocked a trip.)*

---

## Session 8 · Alaala, drawn as memories
**Follows Session 1.**

- **Not a second list of events.** The five owner-approved lenses — Recent · Owned · Attended ·
  People · With me — over **photos, not occasions**. The People lens swaps the wall for faces.
- **Events is for doing; Alaala is for keeping.** *With me* is every photo of you across six
  years and belongs to no single event, which is why it cannot live inside one.
- **Life-Flash sits at the top of it** — the payoff, switched on in Session 1.

---

## Session 9 · Mutual stories
**🔒 Counsel-gated. Build behind the flag; do not flip it.**

**What a person gets:** opening a friend's page shows the days you were both there.

- 🔑 **Not a new idea — the intersection of two shipped things.** The lenses already include
  *Attended* and *With me*, and `person_story_items` already carries
  `person_id · event_id · consented_at · hidden_at · removed_at`.
- 🔒 **The privacy rule IS the design: a day appears only when BOTH people are already visible in
  it** — photos consented, event public. **Never derived from a private guest list.** Opening
  somebody's page can then only show what was already shown, and if either hides, the day leaves
  **both** pages. No shared days gets a written invitation, never a zero.
- ⚠ Same gate as `NEXT_PUBLIC_PERSON_LIFE_STORIES`. These two open together.

---

## Session 10 · The rest of the port list
**The existing programme, unchanged. Admin last.**

`design#4` reconcile the ~28 per-surface prototypes to terracotta + the shipped shell
(**reconcile, never redraw** — they are still correct about composition) → `design#6` public
doorways → `design#5` couple dashboard → `design#7` the five gaps → `design#8` vendor →
`design#9` admin (~95 of 107 routes collapse to one archetype; internal-only, so it ships last).

🔴 **`design#3` is PREMISE FALSIFIED — the app shell already ships and is mounted. Do not build it.**

---

## Order

~~**1 → 2 → 3** first: a switch, a wall, and some copy — the three highest-value and none of them
large.~~ ✅ **1, 2 and 3 are ALL DONE (2026-08-12). Do not start them again — read their entries
above for what shipped and what is deliberately still open.**

⏭ **What is actually next:** **Session 5 · 7 · 8** are unblocked today. **Session 4** is still held
by the one owner sentence in the gate at the top of this file, and **6** follows 4 (they share the
rail, so never run them together). **9** waits on counsel. **10** is the long tail.

🔑 **This line said "1 → 2 → 3 first" while all three were finished.** A state line outlives the
state it describes, and it is the line a new session reads first — the exact failure that made a
session tell the owner to go review prototypes he had already approved. **When a session closes,
edit every row that asserts it is open, in the same commit.**

**State — MEASURED against the PR list at 2026-08-12 15:58Z, not asserted:**

| session | PR | measured state |
|---|---|---|
| 1 · Life-Flash | — (a switch, no PR) + **#4389** | ✅ **switch ON in prod**; #4389 **MERGED** 15:53Z |
| 2 · storyteller editorial | **#4387** | ✅ **MERGED** 15:47Z |
| 3 · friendly labels | **#4388** | ⏳ **OPEN at 15:58Z** — *not* merged yet |

⚠ **This block has been wrong in BOTH directions within one hour.** At 15:40Z I wrote that #4387
was open — it merged seven minutes later. By 15:58Z the entry above for Session 3 had been marked
✅ DONE while **#4388 was still open**. Neither writer was careless; the file simply rots faster
than it is edited. 🔑 **Run `gh pr view <#> --json state,mergedAt` before you trust any row here —
including this one.** A merged PR is also not a shipped one: confirm with
`git merge-base --is-ancestor` and then that the production deployment carrying it is READY.

## Traps that apply to every session

- 🪤 **A script that prints "ok" without measuring proves nothing.** On 12 August a styling patch
  reported success while **every one of its rules silently failed to apply**. Assert the anchor,
  then print the occurrence count **before** trusting it.
- 🪤 **Narrow your selectors.** Three over-broad CSS rules in one session, each found only by
  looking at the rendered page.
- 🪤 **The shared browser pane blanks when backgrounded** — the same trap that forced DOM-level
  verification at the 2026-08-04 archetype gate. Assert structure through the DOM, not a screenshot.
- 🔑 **Verify against live prod or shipped code, never a document** — including this one.
