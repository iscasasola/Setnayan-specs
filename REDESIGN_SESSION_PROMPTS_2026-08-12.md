# Ready-to-paste redesign session prompts · 12 August 2026

> **Copy one block at a time into a new session.** Each is self-contained — it carries the
> verified evidence, the do-not-rebuild warnings and the traps, so a cold session does not
> repeat the pass that produced it. Plan: [`REDESIGN_SESSIONS_2026-08-12.md`](REDESIGN_SESSIONS_2026-08-12.md).
>
> 🛑 **DO NOT START MORE THAN TWO AT ONCE.** This project has a recorded case of ten parallel
> builds shipping **44 defects**, and the shared checkout has been clobbered three times.
> **1 · 2 · 3 touch different areas and may overlap. 4 and 6 share the rail — never together.**
>
> ⚠ **Order: 1 → 2 → 3, owner gate, then 4 → 6 → 5, then 7 → 8, then 9, then 10.**
>
> 🔴 **SESSION 4 IS BLOCKED until the owner answers one question:** the YouTube-shaped front door
> and the ELN cinematic homepage cannot both be `/`. Do not start it on an assumption.

---

## SHARED HEADER — paste this at the top of EVERY block below

```
Read /Users/icecasasola/CLAUDE.md and ~/Documents/Claude/Projects/Setnayan/CLAUDE.md first.

RULES THAT OVERRIDE YOUR DEFAULTS:
- RULE 0 — FIND IT BEFORE YOU BUILD IT. This project is ~2 years old. Assume what you are
  asked for already exists and your job is to locate and extend it. The "already ships"
  lines below were read from origin/main and the live DB on 2026-08-12 so you do not have
  to re-derive them — but confirm anything you are about to change.
- A DOCUMENT IS NOT EVIDENCE — including this prompt. Verify against shipped code and the
  live production database (Supabase project njrupjnvkjkitfctetvi) before acting.
- A rejected query is not a thrown error. A phantom column, enum value, function argument,
  a blocked iframe or a missing grant all fail the same way: the only symptom is an absence.
- Branch FIRST, then `git worktree add`. Never work in the shared main checkout.
- Prune your worktree the moment your PR merges.
- Add a changelog fragment in changelog.d/. Do NOT edit CHANGELOG.md or STATUS.md.
- `gh pr merge <PR#> --auto --merge` immediately after creating the PR. Standing default.
- "Auto-merge armed" is not "will merge" — read `gh pr checks <#>`, and confirm a landing
  with `git merge-base --is-ancestor`.
- After merge, VERIFY THE CHANGE REACHED PRODUCTION BY QUERYING THE OBJECT. Prod deploys
  have silently stopped migrating before.
- A guard must be able to FAIL. Sabotage it, and PRINT THE OCCURRENCE COUNT before and
  after — an unmeasured mutation proves nothing. Five guards in one week passed while the
  thing they guard was gone.
- A script that prints "ok" without measuring proves nothing. Assert your anchor, then
  count the result.
- Reply to the owner in plain English: what a PERSON experiences. No file paths, function
  names, table names, SQL or flag names in your answer to him.
```

---

# SESSION 1 · Turn Life-Flash on — ✅ DONE 2026-08-12 · DO NOT RE-RUN

> The switch is **ON in production** (cache-free rebuild `dpl_3ypALX…`, alias `www.setnayan.com`).
> Nothing was built. Full row in `DECISION_LOG.md` 2026-08-12.
> ⚠ **The switch is invisible from an anonymous request** — the sign-in gate runs before the
> page's own check, so the route `307`s to `/login` identically on and off. Do not read that as
> a failed flip.

```
GOAL: a person can watch their own celebrations played back. One switch, after a real look.

DO NOT BUILD ANYTHING. It is finished.

ALREADY SHIPS — verified 2026-08-12:
- apps/web/app/dashboard/(account)/life-flash/page.tsx — the moment graph, scroll reel,
  beats compiler, people row, four scopes (whole life / year / month / event), dignity
  thresholds, and presign-only-the-first-48-moments media discipline.
- lib/life-story-moment-graph.ts, lib/life-story-beats.ts, lib/life-story-fixtures.ts
- Product name is OWNER-LOCKED: "Life-Flash" (2026-07-08). Internal modules keep the
  life-story-* codename — do not "fix" that.
- OWNER REFRAME, same day, and it matters more than the name: experienced while you are
  ALIVE, pointed forward. NEVER a death surface. Any copy you write must obey that.

THE SWITCH:
- lib/life-story-flag.ts — NEXT_PUBLIC_LIFE_STORY. Its own docblock: "a ROLLOUT switch, not
  a legal gate." Phase 1 reads ONLY the viewer's own events, so it carries NO counsel
  dependency.
- ⚠ DO NOT TOUCH NEXT_PUBLIC_PERSON_LIFE_STORIES. That is cross-event participant media
  (Phase 1.5), it IS counsel-gated, and flipping it publishes other people's media.

WHAT TO DO:
1. Run it in preview with ?fixtures=1 first (fixture mode skips signing entirely).
2. Then QA on a REAL account with real photos. ⚠ CORRECTED 2026-08-12 after this prompt was
   written: prod has 5 events and **14 clean Papic photos (13 photos + 1 clip)**, not 0 —
   all of them on the OWNER'S own "Movie Night" event, so his account is the only one with
   a non-empty Life-Flash. The test accounts (testnayan1..5@test.com / 12345) own events
   with 0 photos. Say plainly in your report what you were actually able to see.
   🔑 The flag value must be exactly `1` — `lifeStoryEnabled()` compares `=== '1'`, so
   `true` reads as OFF and the flip looks like it did nothing.
3. Report to the owner what a person experiences, with a screenshot.
4. Flip NEXT_PUBLIC_LIFE_STORY in Vercel ONLY after he says yes. It is NEXT_PUBLIC_*, so it
   inlines at BUILD time — the flag alone changes nothing until a redeploy.
5. Verify on the live site, then one DECISION_LOG row.

DONE = the owner has watched it, the flag is on, and a live URL renders it.
```

---

# SESSION 2 · A storyteller's piece becomes an editorial

```
GOAL: a couple with 400 photos and no TikTok can publish their story. This is the single
reason the storyteller shelf is empty.

THE WALL, measured 2026-08-12:
- apps/web/app/dashboard/(account)/creator/actions.ts — publishChapter():
  `if (!row.embed_url) fail('Add the embedded edit before publishing.')`
- lib/creator-chapters.ts — the only accepted providers are youtube | instagram | tiktok.
- Prod: creator_chapters = 0 rows. users with public_profile_enabled = 0 of 9.
- So only somebody who already posts video on another platform can ever be a storyteller.

OWNER DECISION 2026-08-12 (verbatim): "their storytelling doesn't need to be a video
anymore. it will be their editorial and they can also paste a video they can upload to the
editorial."

BUILD:
1. Publishing requires a TITLE and a BODY. The video becomes optional.
2. RENAME THE BODY FIELD. Today it is substrate.itinerary — travel-shaped naming on what is
   about to be the main event, capped at 4000 chars (actions.ts readSubstrate) and rendered
   as a single <p> (app/u/[userSlug]/c/[chapterId]/page.tsx). Rename the VALUE, do not
   document around it: this project already paid that lesson with sponsored_included →
   included_in_package (migration 20271108090000) after the word misled two independent
   readers. Give it paragraphs.
3. Video routes, in this order and NOT all at once:
   a. PASTE — already built. Free. We host nothing. Ship this first.
   b. MAKE ONE FROM MY PHOTOS — ALREADY BUILT, and this is the one that matters. See
      lib/creator-teaser.ts + creator-teaser-shared.ts (TEASER_TARGET_SEC=6, MIN 3 / MAX 8
      photos) and dashboard/(account)/creator/_components/teaser-generator.tsx: it renders
      CLIENT-SIDE (WebCodecs mp4 / MediaRecorder webm), uploads the blob to R2, and the
      server stores teaser_r2_key. ₱0 server compute. Sources are the couple's own
      consent-cleared Papic frames (fetchTeaserFrames) and ONE Setnayan-owned track
      (pickOwnedReelMusic — OWNED MUSIC ONLY is a hard line; there is no BYO audio path and
      you must not add one). lib/reel-render.ts already accepts kind:'clip' as well as
      'photo'. Raising the length past its documented 1–30s budget is the real work.
   c. UPLOAD — LAST, or never, and surface the cost to the owner before building it: the
      song on their file becomes ours to answer for; the file has passed none of the checks
      a Papic photo passes; CSAM hashing is PARKED pending an enrolment + an NPC Circular
      16-02 signature; and a phone file needs transcoding, i.e. an always-on server — the
      exact thing deleted 2026-08-11 with the LED backdrop.

TRAPS:
- Publishing a chapter also needs users.public_profile_enabled = true, which defaults FALSE
  and has NEVER been turned on in prod. The publish flow must make that one press, and the
  copy must say what it means. Writer: dashboard/(account)/profile/actions.ts.
- The "creator = user" model is owner-locked (2026-07-16): NO apply/approve gate, no
  is_creator flag — both were dropped in migration 20270815042234. Do not reintroduce one.
- Do not break the existing embed path or the allowlist/sandbox.

DONE = a test account with photos and no external video can publish a readable story, it
appears on /realstories and on their /u/[slug], and prod shows the first non-zero
creator_chapters row.
```

---

# SESSION 3 · Say the words people actually type

```
GOAL: somebody types "photographer" and finds one. Copy only — no migration, no schema.

THE PROBLEM, verified 2026-08-12:
- apps/web/lib/taxonomy.ts — WEDDING_FOLDER_LABEL renders the INTERNAL words to customers:
  Look · Feast · Documentary · Booths · Prints · Program · Design. Nobody types those.
  "Photographer" and "videographer" both live inside `documentary`; catering is `feast`;
  hosts and bands are `program`.
- WEDDING_FOLDER_SLUG is a SEPARATE map. Do not touch it — addresses, anchors and
  ?folder= links stay exactly as they are, so this has no SEO or migration cost.
- Live counts (marketplace-visible, non-Setnayan): look 54 · booths 42 · venue 28 ·
  design 26 · program 20 · prints 15 · documentary 12 · planning 12 · transport 11 ·
  feast 7 · insurance 3 · experience 2 · logistics_safety 2 · dining 1 · specialty 1.
  FIFTEEN folders — read them live, never re-type this list into code.

BUILD:
1. Apply the 15 proposed labels from FRONT_DOOR_AND_SEAM_FINAL_2026-08-12.md §"The
   categories are real". OWNER MUST APPROVE THE LIST FIRST — it changes the whole
   marketplace, not one rail.
2. WEDDING_FOLDER_SHORT_LABEL needs the same pass; check every render site (explore page,
   icon-tile strip, autocomplete, wizard, plan groups).
3. Same session, same disease — words that outlived their decision:
   - "Journal" → "Articles" everywhere a reader can see it (blog index, cards, search
     grouping, article header). lib/blog.ts stays as the module name.
   - Any chip or heading still reading "Real weddings" → "Their stories": after Session 2 a
     storyteller's piece may have no video at all, so that phrase misdescribes it.
4. Search must bridge the gap: a query matching a SERVICE name returns the service with its
   FOLDER shown beside it as a place ("photography — in Photo & video — 12 services"),
   never as a correction. Where a folder has no live shops, say so and offer to notify.

TRAP: sweep every word in ONE pass. Twice on 2026-08-12 a label outlived the decision it
contradicted (Explore→Marketplace, Real weddings→Their stories). A name left behind keeps
arguing for the old model.

DONE = /explore, the wizard and the front-door rail all read the friendly labels; every
?folder= URL still resolves; and a search for "photographer", "caterer", "emcee" and
"photobooth" each surfaces the right folder.
```

---

# SESSION 4 · The front door, ported  🔴 OWNER-GATED

```
🔴 DO NOT START until the owner has answered: does the new front door REPLACE `/`, the ELN
cinematic homepage he approved 2026-06-29? They cannot both be `/`. If he has not answered,
stop and ask — do not assume.

GOAL: a front page that looks full on launch day.

PORT, DO NOT REDRAW:
prototypes/front_door_and_seam_2026-08-12.html (rev 3, interactive — open it and press it).
Written spec: FRONT_DOOR_AND_SEAM_FINAL_2026-08-12.md.

THE ANATOMY (matched to YouTube's real desktop, owner-supplied 2026-08-12):
- Hamburger + wordmark left · centred search WITH ITS OWN BUTTON + a mic · right cluster
  (+Create / bell / avatar signed in; ⋮ + Sign in signed out).
- Left rail 240px, five groups: destinations · THE ACCOUNT SLOT · Marketplace · Studio ·
  small print with a copyright line.
- 🔑 The account slot is the SECOND group, above the categories.
- Uniform FOUR-ACROSS grid. Cards have NO border and NO shadow — the thumbnail is the
  object and the text sits on the page. That is a stricter reading of the "cream page and
  cards, never a second surface" lock, not a looser one.
- Feed column 1064px at ≥1440 (shorts 6-up) · 960 at 1280 (5-up) · 72px icon rail below
  1280 (4-up) · off-canvas under 1024.

DAY ONE IS THE PRIMARY STATE — verified 2026-08-12:
0 creator_chapters · 0 publishable real weddings (all 3 prod weddings are future-dated or
private) · 1 live shop (public_visibility='verified' AND verification_state='verified') ·
33 blog articles live of 91 written, 58 scheduled ahead. So the WRITING carries the page.
"Trending" over one shop is a lie — the heading is "The first shops" below 12 live shops.

LOCKED FOR THIS PAGE ONLY (owner 2026-08-11): gold #8C6932 action buttons with cream labels
and the system typeface. Measured 4.86:1 — it passes, and it beats the app's terracotta. Do
NOT swap in terracotta or the app's fonts here. Everywhere else the app rule is unchanged.
Also locked: cream #FDFBF7 page and cards separated by border+shadow, ink #2C2A29, counts in
monospace, 44×44 tap targets, light mode only, no fake doors, and zero is NEVER shown where
a count failed to load.

OWNER RULINGS TO HONOUR:
- Marketplace is SIGNED-IN ONLY, and "Find a supplier" goes with it (same destination,
  different word). Search still answers a signed-out person. NAMED COST: a crawler is always
  signed out, so those category links leave the front page for Google too — the pages stay
  in the sitemap.
- "Contact us" does not exist (no /contact route). It is Help.
- 🪤 PAKANTA HAS NO PUBLIC PAGE. It is sold and reachable only from inside the app. Do NOT
  put it in the rail. The eight tools are the eight with doorways and
  app/_components/marketing/doorway-invariants.test.ts enforces that exact set: papic ·
  panood · pawebsite · pa3d · palogo · alaala · patiktok · setnayan-ai.

DONE = the page renders at all four breakpoints, signed in and out, and the launch-day state
is the default rather than a variant.
```

---

# SESSION 5 · One shelf, two authors

```
GOAL: one place to read, whoever wrote it. Follows Sessions 2 and 3.

BUILD:
1. Merge Stories + Editorials into ONE shelf. The KIND lives on the CARD ("Article" /
   "Their story"), never on the shelf. Chips: All · Articles · Their stories · With video.
2. WHY, so nobody undoes it: separately one shelf holds 0 and the other 33. A permanently
   empty shelf reads as broken, not young. Combined it is full from day one and gets richer
   as real weddings arrive.
3. THRESHOLDS — reuse what ships, do not invent. HomeReskin.tsx already swaps a grid for a
   written invitation below 2 (`showcases.length >= 2`, `articles.length >= 2`). The ONE new
   number is 12 live shops before the word "Trending" returns; it is the owner's to move.

⏭ CARRIES A TRACKING FIX THAT IS ALREADY OWED:
app/blog/[slug]/_components/journal-partner-credit.tsx renders the credited vendor as a bare
`/v/{business_slug}` link with NO source parameter. So a reader who goes from one of our
articles to a shop arrives untracked, and a booking they produce is NOT counted as one
Setnayan sourced — even though 'editorial' IS in SOURCED_INQUIRY_SOURCES
(lib/booking-fee-gate.ts, beside 'influencer'). The chapter path does this correctly:
app/v/[slug]/inquiry-actions.ts validates ?ref_chapter and stamps 'influencer' server-side.
Do the same for editorial. Two notes: /v/[slug] is the LEGACY route (the canonical shop
address is bare-root), and SOURCED_INQUIRY_SOURCES has a SQL mirror
(public.booking_fee_is_sourced_surface) that must not drift.

DONE = one shelf renders both kinds with the right tag; all four chips filter correctly; a
click from an article to a shop arrives carrying its origin; and the SQL mirror still matches.
```

---

# SESSION 6 · The seam

```
GOAL: signing in never feels like leaving. Follows Session 4 — SHARES THE RAIL, so never run
these two at the same time.

THE RULE: THE RAIL NEVER LEAVES. Same width, same side. The sign-in prompt is replaced IN
PLACE by the account's destinations — exactly the swap the reference makes with Subscriptions.

BUILD:
1. Sign-in opens OVER the page, not instead of it. What is behind stays visible.
2. You land WHERE YOU WERE GOING — the shop you were reading, the half-written enquiry
   intact. Only a rail sign-in with no destination lands on the board.
3. The WORDMARK is the way out of the app, still signed in, with "Back to your events" at the
   top of the rail. SIGN OUT LIVES UNDER THE AVATAR AND NOWHERE ELSE — visiting the public
   site must never sign anyone out.
4. The sign-in panel wears the APP'S TERRACOTTA #C24E25, not the front door's gold. It is the
   first room inside, not the last step outside — the one place the two palettes meet, so it
   is decided rather than inherited.

ALREADY SHIPS — do not rebuild:
app/_components/nav/sidebar-shell.tsx (SidebarShell, 20 consumers, mounted in admin/layout.tsx
AND dashboard/[eventId]/layout.tsx) · a template.tsx in all four dashboard trees ·
CustomerBottomNav / AdminBottomNav. design#3 in the programme is PREMISE FALSIFIED.

🪤 Phone: marketing = TOP nav, signed-in app = BOTTOM nav. NEVER both, never crossed. A UX win
that breaks that blueprint is a regression.

DONE = the round trip is walkable end to end on desktop and phone, and signing out is
reachable from exactly one place.
```

---

# SESSION 7 · Two levels, and the events board

```
GOAL: the menu says which level you are on, and finished events have their own place.
Mostly a reconcile — most of this already ships.

ALREADY CORRECT IN CODE — verified 2026-08-12, do not "fix":
- ACCOUNT level = the launcher's four areas (Events · Alaala · People · Spaces).
- EVENT level = app/dashboard/[eventId]/_components/customer-nav-config.ts —
  "5 destinations that match the mobile bottom-nav tabs": Overview · Guests · Marketplace
  (key 'explore', href {base}/vendors) · Studio · Launch, plus a group literally headed
  "Also in this event" holding Schedule · Seat plan · Budget.
- BUDGET HAS NO TOP-LEVEL ROW ON PURPOSE (owner 2026-07-10 — it lives inside Marketplace
  beside Build and Compare). Do not promote it.
- lib/nav-registry-defaults.ts — Studio becomes "Suite" when NEXT_PUBLIC_SUITE is on
  (surface name owner-locked 2026-07-19). Whatever the app says, the front door must say.

THE DELTA:
1. Split the board into COMING UP and FINISHED as two always-present sections. Today
   completed events hide behind ?show=all. A thing you have to switch on reads as a thing
   that might not be there, and these are somebody's memories. Undated events sit at the
   tail of Coming up — "Date to be set" is a real state.
2. A card must say whether you ORGANISE it or were INVITED to it, because that decides what
   you can press inside. A guest's event page shows their photos, their table, their RSVP —
   and the money/plan surfaces are ABSENT, not present-and-refused.
3. Create grid: HIDE debut and christening unless the account's People data says they
   concern it — hidden, NEVER locked, with a permanent "show all kinds" doorway (a debutante
   planning her own party and an aunt planning her niece's have no record to match).

🪤 THE LIFE-EVENT GUARD IS NARROWER THAN IT LOOKS — lib/life-event-gate.ts:
GATED, one in planning per (account × type × HONOREE): debut · christening · birthday ·
graduation · gender_reveal, plus wedding which keeps its OWN separate guard (wedding-guard.ts)
and is deliberately absent from that map.
UNLIMITED: travel · corporate · tournament · celebration · anniversary — and an unknown or
admin-created type FAILS OPEN to lifestyle, on purpose.
Ten trips yes. Two weddings no. (A first draft of the 12 Aug drawing blocked a trip.)

DONE = opening an event swaps the whole rail and names the event; a tab press never drops
which event you are in; the board shows both sections; and creating a trip is never refused.
```

---

# SESSION 8 · Alaala, drawn as memories

```
GOAL: Alaala stops looking like a second list of events. Follows Session 1.

THE MISTAKE TO AVOID — it was made in the first drawing: Alaala is NOT a list of events with
photo counts. That is the board.

WHAT IT IS: the memories, cut by the FIVE OWNER-APPROVED LENSES (2026-07-15) —
Recent · Owned · Attended · People · With me. See
dashboard/(launcher)/_components/alaala-lenses.tsx. Photos, not occasions. The People lens
swaps the wall for faces.

THE TEST THAT SEPARATES THEM: Events is for DOING (one card per celebration, plan it, run
it). Alaala is for KEEPING. "With me" is every photo of you across six years and belongs to
NO SINGLE EVENT — which is why it cannot live inside one. Any surface that survives changing
events belongs at the account level.

ALSO IN HERE: Life-Flash at the top (switched on in Session 1), and the "This year" strip
(YearMomentsStrip) which already ships on the launcher.

DONE = the five lenses each render a genuinely different answer, and nothing on the page is
a list of events.
```

---

# SESSION 9 · Mutual stories  🔒 COUNSEL-GATED

```
🔒 BUILD BEHIND THE FLAG. DO NOT FLIP IT. Same gate as
NEXT_PUBLIC_PERSON_LIFE_STORIES (cross-event participant media). The People connections layer
is deliberately switched OFF in production and the live page says "coming soon" — that is
correct and must stay until counsel clears.

GOAL: opening a friend's page shows the days you were both there.

NOT A NEW IDEA — the intersection of two shipped things:
- The lenses already include ATTENDED and WITH ME.
- person_story_items already carries: person_id, event_id, item_kind, source_table,
  source_id, origin, source_tag_id, consented_at, hidden_at, removed_at.
- event_members already carries user_id, event_id, member_type.

🔒 THE PRIVACY RULE IS THE DESIGN, NOT A FOOTNOTE:
A day appears ONLY when BOTH people are ALREADY VISIBLE IN IT — the photos consented, the
event public. NEVER derived from a private guest list. Then opening somebody's page can only
ever show what was already shown, and if EITHER person hides, the day leaves BOTH pages.
No shared days gets a written invitation, never a zero. Without this rule the feature is an
attendance-disclosure engine — the same failure family as the slug-forwarding leak, where a
307 disclosed what the target returned.

DONE = it works behind the flag, the flag is still off, a test proves the both-visible rule
in BOTH directions, and the DPO has what they need to review it.
```

---

# SESSION 10 · The rest of the port list

```
GOAL: the existing design programme, unchanged. Read
WHATS_NEXT_Design_Programme_2026-08-01.md fully before touching anything.

ORDER: design#4 → design#6 → design#5 → design#7 → design#8 → design#9.

design#4 — RECONCILE the ~28 per-surface prototypes to the terracotta palette + the shipped
shell. They are STILL CORRECT ABOUT COMPOSITION and carry only the old palette. RECONCILE,
NEVER REDRAW — the owner has paid twice for one page.
design#6 — public doorway pattern + the /pricing delta framing. The delta pattern already
ships in _components/home/vendor-benefits.ts; the job is PRESENTATION. The genuine gap is
CUSTOMER-side: Free → Setnayan AI is not framed as a delta.
design#5 — couple dashboard (Roster · Ledger · Comparison · Gallery). The four-surface home
(#3240) is owner-approved: RE-SKIN, never re-conceive.
design#7 — the five gaps: /explore · the Papic public sub-tree · auth screens · ONBOARDING
CONTENT (the wizard archetype is only the chassis) · guided tour.
design#8 — vendor dashboard: EXTEND the 4 existing prototypes.
design#9 — admin: ~95 of 107 routes collapse into ONE archetype. Internal-only, zero customer
impact, SHIPS LAST.

🔴 design#3 IS PREMISE FALSIFIED — the persistent app shell ALREADY SHIPS AND IS MOUNTED.
Rebuilding it is called "the paid-twice mistake at its largest scale" in that file.

EXCLUDED: guest event sites /[slug] (they run the couple's own mood-board theme) · seat plan
2D/3D (locked coordinate contract + 14-test parity suite, extend only) · Merkado internals ·
typography (Hanken Grotesk + Space Mono, locked through every palette turn).

DONE = each unit ships as its own PR, and any delta between a ported screen and its archetype
is treated as a DEFECT IN THE PORT, not a new design decision.
```
