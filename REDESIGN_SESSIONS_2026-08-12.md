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

✅ **1, 2 AND 3 ARE ALL SHIPPED AND VERIFIED LIVE.** #4388 merged 16:38Z and #4391 (the rename's
16 missed surfaces) 17:06Z; both read back off `www.setnayan.com` — 15/15 labels, 0 retired words,
all 15 `?folder=` URLs resolving. ⚠ This line twice claimed a state it had not measured (first
"all three shipped" while #4388 was open, then "merge-pending" after it had merged). **Re-read
GitHub, not this line.** ✅ **Session 4's owner gate CLOSED 2026-08-13** — the new front door
becomes `/` and the June cinematic homepage is retired completely. **Session 4 is UNBLOCKED and is
the next major build**; **6** follows 4 and shares the rail, so never both at once.

---

## 📡 MEASURED STATE · re-read 2026-08-13 after the block below went stale in ~20 minutes

✅ **SESSIONS 1 · 2 · 3 ARE ALL LANDED.** #4388 merged 16:38Z, #4390 (the story-page 404) 16:45Z.

🎉 **AND SESSION 2 IS PROVEN BY THE OBJECT, not by its PR:** prod now holds
**1 published chapter with `embed_url IS NULL`** and **1 `public_profile_enabled` account** —
both were **0** yesterday. A story that could not have existed before now exists.

**Still open — but none of them has a session actively building, all three are auto-armed and
merely waiting on CI:**

| PR | What | Note |
|---|---|---|
| #4391 | finish the Stories rename across 16 more customer-facing screens | ⚠ touches the **nav registry** |
| #4392 | the admin *Feature* button never rendered for a written chapter | small |
| #4385 | the stray shopping-links stream | ✅ **now cleanly MERGEABLE** |

✅ **THE COLLISION RESOLVED ITSELF IN THE RIGHT ORDER.** #4388 landed first, so #4385 rebased
clean — which is exactly the "land one, rebase the other" call, arrived at without anyone
forcing it.

✅ **8 (Alaala) IS DONE — PR #4395 MERGED 18:10Z 2026-08-12, and production self-reports the
commit** (`/api/health` → `"version":"5893891"`, the merge SHA `589389162`; the deployment
aliased to `setnayan.com` is READY). Do NOT start it again.
🚫 **NOT 7** — #4391 edits `lib/nav-registry-defaults.ts`, which Session 7 would change; and 7
touches `dashboard/(launcher)/page.tsx`, the file 8 has just rewritten a section of. Rebase on
`origin/main` before starting it.
🚫 **NOT 5 YET** — it needs the article page, which #4385 still has open.
✅ **4's owner sentence ARRIVED 2026-08-13 — it is unblocked.**
📛 **Name it "Redesign 8"** — sessions literally titled *Session 4 · SESSION 5 · SESSION 6*
already exist from the 11 Aug list and are unrelated work.

🔑 **THE BLOCK BELOW WAS TRUE FOR ABOUT TWENTY MINUTES.** It is kept, struck through, as the
evidence for the rule: **a state table in a document is a claim with a timestamp, not a fact.**
Re-read GitHub before acting on any line of it.

## ~~📡 MEASURED STATE · 2026-08-13, read from GitHub + Vercel, not from this file~~ (SUPERSEDED)

**THREE PRs are open, not two — and two of them collide on the same file.**

| PR | Stream | State | Touches |
|---|---|---|---|
| **#4390** | Session 2 **follow-up** | OPEN | `middleware.ts` · `lib/u-nesting.ts` |
| **#4388** | Session 3 | OPEN | `blog/[slug]/page.tsx` + 7 more |
| **#4385** | *journal affiliate links* — **not on this list** | OPEN | `blog/[slug]/page.tsx` + 4 |

🚨 **#4385 and #4388 both edit `apps/web/app/blog/[slug]/page.tsx`.** Whichever merges second
rebases or conflicts — and this project has a recorded case of a **stale-tree merge deleting**
another branch's work. **Land one, rebase the other, then merge.** Do not arm both.

🔴 **SESSION 2 IS SHIPPED WITH A LIVE DEFECT, and #4390 is the fix.** A published, video-less
chapter renders a real share card while **its own page returns 404** — the middleware rewrote
`/u/{slug}/c/{id}` on segment count alone and ate it. So the very thing Session 2 unblocked
cannot be opened by anyone. **#4390 is the priority over #4388.**

✅ **SESSION 1 IS DONE, and the strongest proof is not a probe.** PR **#4389 exists because the
owner saw it** — its commit message records the Alaala tile reading *"14 moments · 0 people who
made them"* on his home screen, which is unreachable unless the flag is on. That copy defect is
now fixed and deployed. A cache-free production redeploy (`dpl_3ypALX…`, `action: redeploy`,
READY, production) is in Vercel's history at the claimed time.
⚠ **Two production deploys have landed SINCE** (#4387, #4389). They inherit the flag **only if
it was set as a project Production env var** rather than a one-off redeploy override — and the
value is not readable from the Vercel MCP tools, nor from any anonymous request, because every
caller of `lifeStoryEnabled()` is a **server** component so it never reaches the browser bundle.
**The only proof is a signed-in eye on the home screen.**

⏭ **NEXT SESSION TO OPEN: 4 (the front door) — its gate closed 2026-08-13.** 6 follows 4, and 5 needs 3
merged. 🪤 **7 and 8 may NEVER run together** — the events board and Alaala are both sections of
the same 2,136-line `dashboard/(launcher)/page.tsx`.

---

# ✅ OWNER GATE — CLOSED 2026-08-13. Session 4 is UNBLOCKED.

**The YouTube-shaped front door and the ELN cinematic homepage cannot both be `/`.**

✅ **ANSWERED.** Owner: *"yes we want the new website"* — and, asked directly what becomes of the
cinematic opening, **"Retire it completely."** So the new front door becomes `/` and the June
cinematic homepage (`HomeReskin` — the no-scroll gate + 5-pillar dock, owner-approved 2026-06-29)
is **deleted, not parked.** He was told in the question itself that this option discards finished
approved work while the alternative kept it reachable and reversible; he chose to discard it.
Full row: `DECISION_LOG.md` 2026-08-13.

🚨 **THE PAGE BEING DELETED IS NOT ONLY PIXELS — added 2026-08-13 and NOT in the ruling above.**
`app/page.tsx` runs three **cron-free** jobs on the back of the homepage's guaranteed public
traffic, via `after()`: **`runAdminDigestFlush`** · **`runDailyEmailJobs`** (anniversary digests ·
renewal reminders · the Papic full-res drop warning) · **`maybeRunInterconnectionProbes`**.
**These REPLACED retired crons — there is no scheduler behind them.** The page also carries
`revalidate = 300`, the WebSite + SoftwareApplication JSON-LD graph, and the GEO
title/description answer engines ground on.
**Delete the page without carrying those forward and the daily emails and the probes simply stop,
with no error anywhere** — the silent-absence failure this project keeps paying for.
Measured: `/explore` is the only other host of the probe pair — that holds.
⚠ **CORRECTED 2026-08-13 — "the digest flush lives on `/` alone" was FALSE.** `runAdminDigestFlush` is scheduled in **three** places (`/`, `/explore`, and the admin
layout), as `DECISION_LOG.md` 2026-06-28 already stated. Carry them onto the replacement and
PROVE it by the object, not by the diff. ✅ Done on `claude/front-door-session4`: all three
jobs, both JSON-LD nodes, `revalidate = 300` and the GEO metadata verified present.

🔑 **The surface was named back before the answer was filed.** *"Yes"* to a gate is not proof the
gate is what was answered — the 2026-08-12 lesson cost a build spec written from a misfiled
ruling. The homepage, the June design and the word *deleted* were all put in the question.

~~You chose a front door on 7 August, then chose a different one on 11 August whose own notes say
*"one front door."* The 12 August pass drew it in full. **Nobody has said out loud that shipping
it retires the homepage you approved on 29 June.** Drawing it was right either way; landing it
reverses an owner lock, so it needs one sentence from you.~~

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

## Session 3 · Say the words people actually type — ✅ **DONE & VERIFIED IN PRODUCTION**
~~**Copy only. No migration, no schema, no SEO cost.**~~ **Copy — plus a data migration, because
this doc was wrong about where the words live.**

> ✅ **VERIFIED ON THE LIVE SITE, not inferred** (PRs **#4388** + **#4391**, both merged
> 2026-08-12). Read back from `www.setnayan.com` after deploy: **15/15** new labels render ·
> **0** retired words in any reader-visible position · **all 15** `?folder=` URLs return 200 **and
> their bodies render the renamed folder** · the live search payload carries **276** options and
> *"Photographer → in Photo & video · 12 services"*, with **zero** retired words used as the place ·
> `/blog` says *Setnayan Articles* (0 × Journal) · `/realstories` says *Stories* (0 × Real stories) ·
> the public footer says *Their stories* · `llms.txt` says *[Stories]* and *[Articles]*.
>
> 🛑 **I MARKED THIS "DONE" ONCE WHILE ITS PR WAS STILL OPEN, and another session caught it.** The
> heading above is the *third* state this line has held — merge-pending, then corrected, then this.
> **Written is not merged, merged is not deployed, and deployed is not verified.** Those are three
> separate events and this change proved it: the migration reached prod **before** the site build,
> so for several minutes the page read NEW words from the database and OLD words from the
> not-yet-replaced bundle — one page, two vocabularies, exactly the defect the work existed to
> prevent. Nothing was wrong; the halves land at different times. **Never mark a state line from
> intention. Read it back out of the thing itself.**

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

## Session 4 · The front door, ported — ✅ **GATE CLOSED 2026-08-13 · IN BUILD**

> ### 📐 RE-MEASURED 2026-08-13 AGAINST PROD — one rail's shape has ALREADY changed
> The launch-day table further down was measured 2026-08-12. **Session 2 shipped since**, and it
> moved one of the four numbers:
>
> | Rail | Doc said (12 Aug) | **Measured 13 Aug** | Threshold | Shape NOW |
> |---|---|---|---|---|
> | Trending storyteller | 0 → *absent* | **1 published chapter** | returns at 1 | ⚠ **IT RETURNS — do not build the "absent" case as the primary state** |
> | Articles | 33 of 91 | **33** ✓ | — | fills the grid |
> | Real weddings / Stories | 0 | **0** ✓ (5 editorials, all `draft`, 0 `published_at`) | 2 | one written invitation |
> | Vendors | 1 live shop | **1** ✓ | 12 | "The first shops" |
>
> 🪤 **THE LIVE-SHOP PREDICATE IS NOT `is_published`.** That column is **legacy and no longer
> queried** — `explore/page.tsx` says so outright (*"the legacy `is_published` boolean is no longer
> queried here"*). The gate is `public_visibility = 'verified' AND verification_state = 'verified'`.
> Counting with `is_published` returns **0** and would have made the page apologise when it should
> say *"The first shops"*. Prod holds 2 shops: one `is_published=true` but **hidden**, one
> `public_visibility='verified'` but `is_published=false`. **Use the real predicate.**
>
> ### ⚠ TWO PLACES THE WRITTEN DOC DISAGREES WITH THE BINDING PROTOTYPE — prototype wins
> 1. **Rail width.** `FRONT_DOOR_AND_SEAM_FINAL` §1 prose says *"248 px on either side"*; the
>    prototype's own token is **`--rail:240px`**, and this register says 240. **Port 240.**
> 2. **Rail group 1.** The doc lists *Home · Stories · Journal · Find a supplier*. The prototype
>    renders **Home · Stories**, plus *Find a supplier* **only when signed in** — and no Journal
>    row at all, because Stories + Editorials are now ONE shelf. **Port the prototype.**
>    ✅ The prototype already carries the Session 3 vocabulary in its own comments (*"Journal is
>    retired (owner 2026-08-12). Our writing is ARTICLES"*), so the rename and the port agree.
>
> ### 🪤 A GUARD'S RATIONALE GOES STALE THE MOMENT THIS SHIPS
> `app/_components/marketing/doorway-invariants.test.ts` asserts `/` is **excluded** from the eight
> tool doorways, and its stated reason is *"`/` is the ELN cinematic reskin, owner-approved
> 2026-06-29 and explicitly excluded from this work."* **The assertion stays correct** (`/` is the
> front door, not a tool doorway) — **the reason becomes false.** Update the comment in the same PR
> or it joins the pile of comments arguing for a retired decision.
> ✅ The eight doorways, read from the guard: `papic · panood · pawebsite · pa3d · palogo · alaala ·
> patiktok · setnayan-ai`. (Live Studio's route is **`panood`**.) 🪤 **Pakanta is NOT among them and
> must not go in the rail** — sold, but reachable only inside the app.
>
> ### 🔒 HOW IT SHIPS
> **Flag-dark first (`NEXT_PUBLIC_NEW_FRONT_DOOR`), and `HomeReskin` is NOT deleted until the owner
> has seen the replacement live.** The owner approved retiring the June design — that approval is
> real and recorded — but *"the owner LOOKING beats every automated check"*, and deleting an
> approved page before its replacement has been looked at is the one ordering that cannot be undone.
> Retire it in the flip, not in the build.
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

## Session 8 · Alaala, drawn as memories — ✅ **DONE 2026-08-12 (PR #4395)**

> ✅ **MERGED 18:10Z and DEPLOYED.** `589389162` is an ancestor of `origin/main`; the production
> deployment carrying it is READY and aliased to `setnayan.com`; and `/api/health` self-reports
> `"version":"5893891"` — the merge SHA, read out of the running app rather than inferred.
> **Do NOT rebuild any of it.**
>
> 🔴 **ALL FIVE LENSES ANSWERED WITH EVENTS, AND IT RENDERED BEAUTIFULLY.** The home's Alaala
> panel rendered `PhotosTab` — **one card per event with a photo count**; the obsidian tile's
> *Owned* lens rendered a **bulleted list of event names with dates**; *Attended* rendered a
> **count of events**; and `/dashboard/library` answered three of the five with the same album
> grid and the other two with prose, because People and With me are not albums. **Five words,
> two answers, and one of them is the board's job.**
>
> ✅ **Now:** a wall of real photographs, cut five ways from ONE read — Recent (newest first,
> event boundaries erased) · Owned · Attended · **People (not a wall — faces, with how many
> events each kept showing up in)** · With me. Life-Flash keeps the tile; "This year" keeps its
> strip. The per-event album grid is **not deleted** — it is *"Albums by event"* under **Also
> kept**, where downloading one whole celebration is a real job.
>
> 📱 **THE LENSES DID NOT EXIST ON A PHONE.** They were a `sm:`-and-up affordance inside a 64px
> caption slot — which is *why* every body was a sentence: a wall does not fit in a caption. They
> now own the full width on every screen size.
>
> 🔑 **`unreadable` IS NOT `length === 0`.** A rejected query and an empty table are the same
> value out of PostgREST. Every read checks `.error`; `lensCounts` answers **`null` — NOT
> MEASURED, never `0`** — and the UI says *"could not be loaded — this is not an empty album"*.
> **"No photos yet" printed over a refused read is a lie told about somebody's memories.**
>
> 🔒 **Strict `moderation_state = 'clean'`**, not the couple's `!= 'nsfw_blocked'` manage-gallery
> filter — this wall AUTO-RENDERS on the home, so it takes the allowlist every other
> auto-rendering surface takes. Stricter than the grid it replaced. **No gate was widened:** every
> frame shown was already visible to that viewer through a shipped surface.
>
> 🚪 **FOUND, NOT INTRODUCED:** an *Attended* album card has always linked into
> `dashboard/[eventId]`, which admits `member_type='couple'` ONLY — so it was a **404 for the
> guest it was shown to**. Unreachable in prod today (0 guest memberships) and deliberately not
> propagated: owned frames open the album, attended frames open the picture.
>
> 🛡 **`lint-port-no-lost-controls.mjs` EARNED ITS KEEP.** The People lens's *"Open People"* door
> hung off the prose placeholder — so replacing that placeholder with real faces **silently
> deleted the only route from Alaala to `/dashboard/people`**. 🔑 **A control that disappears the
> moment the feature starts WORKING is the worst kind to lose.**
>
> 🪤 **AND THE MUTATION RUN CAUGHT A HOLE IN MY OWN GUARD.** The "With me is offered at the
> account level" check matched `/'with_me'/` **anywhere in the file**, and the page names it
> twice — deleting it from the key list left the chip label, and the guard still passed. **A guard
> matching a STRING instead of the ACT**, found only because the sabotage was actually run.
> Re-anchored to the `LENS_KEYS` declaration. 12 sabotages, each occurrence-counted before → after,
> all 12 now caught.
>
> ### 🔬 THEN AN ADVERSARIAL PASS OVER IT FOUND FIVE MORE — one of them the SAME HARM
> **PR #4397, merged 18:59Z the same day.** Six review lenses over my own just-merged
> diff, two skeptics per finding each told to refute it. Five survived; **one had
> reintroduced, through a display cap, the exact defect #4395 existed to end.**
>
> 🚨 **A GLOBAL CAP OVER A FILTERED VIEW IS A SILENT FILTER OF ITS OWN.** The wall took
> the **48 newest of the MERGED list** and only then split it into lenses. Measured
> against the shipped core — 60 frames from the viewer's own wedding last month, 24 they
> are tagged in from a friend's wedding two years ago:
>
>     recent 48   owned 48   attended 0   with_me 0        (truth 84 / 60 / 24 / 24)
>
> **Attended and With me rendered EMPTY over twenty-four photographs that had been
> fetched successfully and thrown away** — and the page then printed *"No events attended
> yet"* with a **measured `0`** on the chip, defeating its own "null = not measured"
> contract. 🔑 **Raising 48 does not fix it; it only moves the wedding size at which it
> bites** — and it bites hardest on the busiest, most real accounts, the ones you never
> have while building. Each lens now has its OWN budget; totals come from the **uncapped**
> read; a saturated source renders **`N+`**, never a ceiling printed as a total.
>
> 🗣 **AND THE EMPTY SENTENCE WAS A CLAIM ABOUT THE WRONG THING.** *"No events attended
> yet"* is a statement about MEMBERSHIPS made from an absence of PHOTOS — the normal state
> of every guest until the photographers finish tagging. Somebody who joined a friend's
> wedding by QR yesterday was told they had attended nothing. Now branches on a measured
> `hasAttendedEvents`, and **moved into the pure core** so it can be asserted at all: a
> sentence inside an async JSX file cannot be imported by the unit runner, so it cannot be
> checked. (Same reason `lifeFlashSummaryLine` lives in `lib/`.)
>
> 🪤 **THE HAND-TYPED LENS MAP WAS DECORATION, AND THE MUTATION PROVED IT.** Rewriting one
> entry to `owned: <AlaalaLensBody lens="recent" …>` left **17/17 tests green** — the
> guard matched the record KEY, which that mutation preserves, and `Record<K, ReactNode>`
> gives no key↔prop link. The Owned chip would have shown the Recent wall. The map is now
> **DERIVED** from the one declared list, which makes the bug **unexpressible** — strictly
> better than any guard over hand-typed pairs.
>
> 🪤 **AND ONE SABOTAGE ESCAPED THE FIRST RE-RUN.** Swapping `surfaceBudget(ordered, …)`
> for `ordered.slice(0, …)` **in the data layer** left everything green: the new tests
> exercise the pure core directly, and **nothing watched the file where the bug actually
> lived.** 🔑 **TESTING THE PRIMITIVE IS NOT TESTING THE CALLER** — when you extract a
> helper to make it testable, assert the CALL SITE in the same commit and mutate THAT.
> ⚠ Two further mutations had gone stale against a refactor and reported **ANCHOR NOT
> FOUND**, which is neither a pass nor a fail: **an unrun mutation proves nothing either.**
> Repaired: **16 sabotages, occurrence-counted before → after, all 16 caught.**
>
> ⏭ **NAMED, NOT BUILT (deliberately):** `getGuestLiveGallery` returns `null` for a FAILED
> read **and** for the ordinary "no tags yet", while its own docblock claims *"null means,
> and only means, that the read failed."* **That comment is false — verified in the
> source.** Mapping it to `unreadable` would raise *"could not be loaded"* at the entire
> guest population, so the wall deliberately does not. Fixing it means changing that
> function's return contract and checking every caller. **A separate build.**
>
> ⏭ **OPEN, and honest rather than faked:** on the owner's own account **Recent and Owned show the
> same 14 frames** (all his media sits in one owned event) and **Attended · People · With me are
> empty** — he has never been a guest anywhere, and prod holds **0 guest rows linked to a person**,
> so nothing can be tagged as him yet. Five different QUESTIONS; three have no answer on his data.
> Each says so in a plain sentence rather than showing a broken-looking grid. **Nothing was seeded
> to make it look fuller.**

**What a person gets:** their photographs, not a second list of their events.

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

⏭ **What is actually next:** **Session 5 · 7** are unblocked today — **8 is DONE (#4395, merged
and deployed 2026-08-12)**. ⚠ **7 must rebase first:** it edits `dashboard/(launcher)/page.tsx`,
whose Alaala section 8 has just rewritten. **Session 4** is still held
✅ (gate CLOSED 2026-08-13 — unblocked), and **6** follows 4 (they share the
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
| 3 · friendly labels | **#4388** (+ **#4391**) | ✅ **MERGED** — and verified on the live site |
| 8 · Alaala as memories | **#4395** + **#4397** | ✅ both **MERGED** (18:10Z · 18:59Z) · `/api/health` reports the merge SHA |

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
