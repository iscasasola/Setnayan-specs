# Home + Storytelling Design Spec — 2026-08-07

> **The binding spec for the Facebook-and-TikTok home improvement.** Fable designed; Opus builds from this.
> Companion prototype: [`prototypes/home_facebook_shaped_2026-08-07.html`](prototypes/home_facebook_shaped_2026-08-07.html)
> — open it in a browser; it shows all three home states at phone + desktop width, the chapter page, and the seam.
>
> Owner brief, verbatim: *"if we will improve the overall look of the user home, how can we follow a similar way
> to navigate like facebook… instead of what's on your mind? what's your event?"* · *"we have story tellers"* ·
> *"story telling just means, the vendors get direct link from the video of their service"* · *"the main
> inspirational app/website that is popular for filipinos is facebook and tiktok. we want users to navigate
> easier since they are familiar with those apps already."*
>
> Governing principle: **familiarity as the goal, not imitation.** Every decision below is justifiable as
> "a Filipino who uses Facebook and TikTok already knows how to do this."

---

## 0 · RULE 0 — what exists · what is missing · the exact delta

Nothing in this spec redraws a shipped screen. Every item extends a named, existing component.

| Proposal | What EXISTS (shipped component) | What is MISSING | The exact DELTA |
|---|---|---|---|
| **Posture inversion** (home re-ranks by life stage) | The four-surface home — `apps/web/app/dashboard/(launcher)/page.tsx` (1,965 lines) + its section components. Renders one fixed order today. | The re-ranking. Specified by the 2026-07-14 council § 6, re-affirmed by the 2026-07-30 deep search (“the cheapest large win on the page”), **never built**. | Reorder the existing sections per § 2 below. No new component; `AlaalaTile` gains a compact “ribbon” variant and a full-width “hero” variant of what it already renders. |
| **The composer** (“What’s your event?”) | **SHIPPED** — PR #4219 (merged 2026-08-07): `EventComposer` in `(launcher)/page.tsx`, a navigation row to `/dashboard/create-event`. | State-aware sizing. | Two visual variants of the same row: `hero` (larger, at 0 events) and default (compact). Same door, same copy, no input. |
| **Storyteller lane on the home** | The follow system (`user_follows`, `app/u/_components/follow-button.tsx`), published chapters (`creator_chapters`, `lib/creator-public.ts fetchPublishedChapters`), the new-chapter notification (`lib/creator-notify.ts`), the People tile on the home, `/realstories` as the public hub. | **No home surface shows anything from the people you follow.** A follow today produces only a notification row. | A fourth labelled group inside the **existing People tile**: “Storytellers you follow” (rows), plus a horizontal poster **rail** of their recent chapters. New read, zero new tables. Empty state = a discovery card into `/realstories` (ships). |
| **Chapter poster-first player** | The public chapter page `app/u/[userSlug]/c/[chapterId]/page.tsx` + `ChapterEmbedFrame` (sandboxed iframe) + `youtubeThumbFromEmbedUrl` in `lib/creator-chapters.ts` (YouTube-only poster derivation, owner-ratified 2026-07-16 decision #6). | The iframe mounts immediately on page load today; there is no poster facade, no 9:16 grammar, no next-chapter rhythm. | Wrap `ChapterEmbedFrame` in a poster facade: poster renders instantly, the iframe mounts **only on tap**. YouTube chapters use the derived thumb; TikTok/Instagram chapters use a branded obsidian poster (no thumb is derivable without hosting — a locked constraint, not a gap). |
| **Vendor links under the video** | **SHIPPED AND GATED** — `resolveShoppableVendors` in `lib/creator-public.ts`: substrate `vendor_ids` resolve to cards ONLY when a real relationship exists (accepted collab or a booking on the chapter’s event); otherwise plain text. Viewer-promo line ships (`fetchAudienceRatesForCreatorVendors`). Vendor shop pages ship at bare-root `/[slug]` (~3,700 lines). | Nothing. This is the owner’s “vendors get direct link from the video” — **it already ships.** | Re-skin only, to the archetype obsidian card grammar shown in the prototype § 02. Do not touch the relationship gate. |
| **The seam** (“tell this story”) | The creator desk `app/dashboard/(account)/creator/page.tsx` creates chapters; a chapter can carry an event ref — but today it is **a raw text input asking for an event id** (line ~628). The event card on the home. | A door from the event to the desk; a human way to pick the event; any owner-side sign that a story exists for an event. | § 4: (a) an owner-only “Tell this story” row inside the finished event’s dashboard, deep-linking to the desk with the event preselected; (b) replace the desk’s raw event-id input with a picker of the person’s own events; (c) an owner-only “Story · published” chip on the home’s celebrated event card. |
| **Next-chapter rhythm** (vertical swipe) | Chapter pages exist individually; `fetchPublishedChapters` already returns the storyteller’s full ordered timeline. | Any way to move chapter-to-chapter without going back to the profile. | A “Next chapter” poster card at the bottom of the chapter page (snap-scroll). Only the in-view chapter may mount its embed; neighbours stay posters. |

**Already adjudicated — honored, not re-litigated:** the six-model council (`User_Home_Concepts_Deep_Search_2026-07-30.md`)
keeps the shipped chassis, rejects the endless-photo-scroll home and the context-picker home, and orders the § 6
posture inversion. This spec builds exactly that recommendation and adds only the storyteller lane the council
never considered. The family tree remains counsel-gated and is not touched here.

---

## 1 · The familiarity map — which habit each part borrows

*(This section is the owner’s checklist for judging whether the app “feels familiar.” Plain English.)*

| Part of the home | The habit it borrows | From |
|---|---|---|
| “What’s your event?” row at the top | “What’s on your mind?” — the question box that is always in the same place | Facebook composer |
| Events, newest at the top, scroll down for older | Scrolling the feed | Facebook News Feed |
| The five-slot bottom bar with the raised ➕ in the middle | The tab bar with create dead-centre | Facebook + TikTok app bars |
| A vendor’s shop at setnayan.com/theirshopname | A business Page with its own address | Facebook Pages |
| “Vendors you saved” shortlist | Liked / saved Pages · Favorites | Facebook likes · TikTok favorites |
| Following a storyteller (one tap, no permission needed) | Following a creator or a Page — public figures only | Facebook Page follow · TikTok follow |
| “Storytellers you follow” rows + new-chapter rail | The Following tab — new posts from people you chose | TikTok Following · Facebook feed |
| The chapter: full-height vertical poster, byline, links under the video | A TikTok video with TikTok Shop links on it | TikTok + TikTok Shop |
| Tap the poster to play | Tapping a shared video to watch it | Facebook’s own embedded videos |
| “5 things need you” | The red badge that tells you what’s waiting | Facebook notifications |
| The search pill up top | The search bar that is always there | Facebook search |

**The one place we deliberately do NOT copy:** private people. On Facebook you can follow a stranger and browse
their life. Here, private people connect only when both agree, and a private event never appears in anyone’s
feed. The storyteller is the single exception because a storyteller publishes deliberately, to strangers —
that lock (owner, 2026-07-15) is what makes the rest of this design safe to ship.

---

## 2 · The posture inversion — exact rules

One home, four postures, decided per render from data the page already fetches (events + dates + checklist).
The **composer never moves** — it is always the first thing under the greeting, in every posture (Facebook
taught everyone the question box lives in one place; consistency beats micro-optimisation).

**Posture is decided by this rule, evaluated in order:**

1. **DAY-OF** — any active event whose date is today (PH-local compare, the page’s existing `todayISO`).
2. **PLANNING** — any active event with a future (or unset) date.
3. **QUIET** — at least one finished event, none active.
4. **BRAND-NEW** — zero events ever.

### PLANNING — logistics leads, memory whispers

Order: greeting → **composer (compact)** → board → Events (hero card + chips + nudge + New-event ghost) →
**Alaala as a one-line ribbon** (“23 moments gathered so far”) → Yours-to-run (capability-gated) → People
(with the Storytellers group) → phone pill nav.

- The Alaala ribbon is one row, never a shelf; it links into the Alaala surface. It never nags.
- The storyteller rows stay visible here on purpose: **a chapter is vendor research disguised as a video** —
  mid-planning is when a couple most wants to see a real wedding’s vendors.

### DAY-OF — the home dissolves into presence

Order: greeting → **one full-width card: “Today is the day.”** → jump into the live event. Board, ribbon,
rail, ghost, prompts — all step back for the day. (One rule, not a layout; the card reuses the existing
mobile event hero at full width.)

### QUIET — the inversion

Order: greeting → **composer (compact)** → **Alaala rises to full-bleed hero** (anniversary-aware headline,
elapsed stamp in Space Mono at bottom-left — “MARIA & JUN · 1 YEAR MARRIED”, Play Life-Flash, face row,
mosaic strip) → **the storyteller rail rises** (“From storytellers you follow”) → Celebrated events (compact
chips, with the owner-only “Story · published” chip when one exists, and the one quiet-season prompt when
none does — § 5.7) → People → Yours-to-run.

- With zero photos, the Alaala hero is the monogram + elapsed stamp over the warm paper texture — never a
  fake mosaic, never an empty shelf.

### BRAND-NEW — the composer is the product

Order: greeting (“Let’s set up your first event.”) → **composer at HERO size** → one warm “Plan your first
event” door → Alaala as a promise line → the storyteller **discovery card** → People (Samahan create door).
No board (there is nothing to count). Production is pre-launch empty — **this is the state most users meet
first, so it carries the design.**

---

## 3 · The chapter — TikTok’s rhythm without TikTok’s player

*(The owner’s narrowing is the law here: a chapter is a video the storyteller already published elsewhere,
and underneath it, direct links to the actual vendors in that video. The video is the hook; the vendor links
are the product.)*

### The honest constraint, addressed head-on

Setnayan hosts no video. A chapter stores an allow-listed, normalized link to the storyteller’s own YouTube /
TikTok / Instagram post and renders it as a sandboxed third-party player. Third-party players cannot be
reliably autoplayed, cannot be cheaply preloaded, and a stack of live ones will stutter on a mid-range
Android phone on Philippine mobile data.

**Decision: poster-first, tap-to-play, vendors always instant.** (The first of the three directions offered,
combined with the second for chapter-to-chapter movement.)

- The **poster** fills the frame instantly — 9:16-leaning, obsidian, title + kind + storyteller byline over a
  soft scrim, a play ring centred. YouTube chapters use the video’s own thumbnail (already derivable — this
  is the same rule that gates Real-Stories featuring today). TikTok and Instagram chapters get the **branded
  obsidian poster** (no thumbnail is derivable without hosting; the branded poster is the honest version,
  not a placeholder for a fix that is coming).
- **One tap mounts the real player** in place. Under the player: “Plays from the storyteller’s YouTube.”
- **Moving between chapters is a vertical snap-scroll of posters.** Only the in-view chapter may mount its
  embed (after its own tap); neighbours are always posters. Swiping is instant because posters are light.
- **The vendor links never wait for the player.** They render with the page, above the fold on phone after
  the poster.

**What the person experiences, plainly, vs real TikTok:** they scroll a lane of beautiful stills, not
auto-playing videos. When they tap one, the video starts — one tap more than TikTok asks. Everything else —
the swipe rhythm, the byline, the shop links under the video — feels the same. The owner should expect that
one-tap difference and know it is the price of never hosting video (₱0 marginal cost, no copyright
exposure, storytellers keep their own monetization).

### The chapter page, top to bottom (prototype § 02)

1. Back-link to the storyteller + the gold Storyteller badge.
2. Kind · provider · date kicker, then the title.
3. **The poster / player** (above).
4. Views · followers · **Follow** button.
5. **“The vendors in this video”** — the product:
   - A **linked vendor** (real relationship: an accepted collab with this storyteller, or a genuine booking on
     this chapter’s event — the shipped gate) renders as a card: logo · name · city · service line · optional
     **“Viewer promo: …”** line (ships) · “View shop →”.
   - An **unlinked mention** renders as plain text — no link, no button. The page never manufactures a
     commercial affordance a vendor never agreed to. (Shipped behavior; keep it.)
   - Zero vendors → the section is omitted entirely. Never an empty heading.
6. **“Next chapter”** — the snap-scroll rhythm.

### From video to booking — the tap count, precisely

- **On the chapter page:** video → vendor’s shop page = **1 tap**. Shop page → start the inquiry = **1 more
  tap** (the shop’s existing inquiry door; a signed-out stranger signs in as part of that flow).
- **From the home rail:** rail card → chapter page (1) → vendor shop (2) → inquiry started (3).
- The vendor link goes to the vendor’s **existing public shop page** — the ~3,700-line surface that already
  ships. Nothing new is built on the vendor side.

---

## 4 · The seam — a private event and a public story, side by side

*(The question the owner keeps circling: where does a person see their own private event and their own
published story in relation to each other?)*

**Answer: in exactly two owner-only places, and nowhere else.**

**Door 1 — inside the event.** After the event date, the event’s own dashboard gains one row, visible only to
the event owner: **“Tell this story — publish a Chapter: your video, and the vendors who made this day.”**
Tapping it opens a chapter draft in the creator desk, already linked to this event, with the event’s
**booked vendors pre-suggested** as the shoppable list (each removable). Nothing publishes here: the person
still pastes their video link, still needs their public page switched on, and still presses Publish
themselves — the same gates that ship today.

**Door 2 — on the home’s event card.** Once a chapter linked to the event is published, the private
“Celebrated” card gains one owner-only chip: **“Story · published · 1.2k views”**, jumping to the public
chapter. This chip is how the two worlds sit side by side — on the private card, for the owner’s eyes only.
The public chapter never points back.

**What the seam does NOT do — the paranoid list:**

- **The guest list never crosses.** No name, no count, no RSVP state reaches the chapter.
- **The Papic gallery never crosses.** The public chapter page may say a gallery exists behind the chapter;
  it renders zero photos from it. (Shipped behavior; keep it.)
- **The event’s name, date and venue never cross.** The public chapter shows only the title the storyteller
  typed. (Verified against the shipped chapter page — it renders no event fields.)
- **The event’s visibility never changes.** Publishing a chapter does not make the event public, listed,
  sitemapped or findable. The link between them lives on the private side only.
- **No faces are added by Setnayan.** The video is whatever the storyteller already published on their own
  channel, under their own responsibility. If their edit shows guests, that happened on YouTube/TikTok’s
  side of the fence — Setnayan neither hosts nor amplifies it beyond the embed the storyteller chose to make.
- **Coordinators, vendors and guests of the event never see either door.** Owner-only, both.
- **Pre-suggested vendors still pass the relationship gate on the public page.** Pre-suggesting a booked
  vendor is safe by construction — a booking IS the relationship the gate checks.

---

## 5 · Empty states — real copy, every new block

1. **Storyteller rail, no follows (the production state today):**
   > **Real celebrations, told by the people who filmed them.**
   > Watch a wedding the way it really happened — then book the exact vendors behind it.
   > *Browse Real Stories →*
2. **Storyteller rail, follows but nothing new (30 days):**
   > Nothing new this week from the 3 storytellers you follow.
3. **Chapter poster, TikTok/Instagram source (no derivable thumbnail):** the branded obsidian poster — kind
   pill, title, byline, play ring. No grey box, no broken image, no “thumbnail unavailable”.
4. **Vendors under a chapter, none linked:** the section is absent. (An unlinked mention still prints as
   plain text: “Also in this video: **Chef Andoy Catering** — mentioned by the storyteller; not yet a
   Setnayan partner, so no shop link.”)
5. **Alaala, brand-new account:**
   > **Your Alaala begins with your first photo.**
   > Every event you plan gathers its own — and one day it plays back as a film.
6. **Alaala hero, quiet season, zero photos:** monogram + elapsed stamp (“CELEBRATED · 1 YEAR AGO”) over the
   warm paper texture. No mosaic, no empty shelf.
7. **Celebrated event with no story yet (quiet posture only — planning never nags):**
   > **Tell this story** — publish it as a Chapter, with the vendors who made it.
8. **Board at zero everything:** the board does not render. Empty tiles are not content.

---

## 6 · Ranked build list

`delta` = extends a named shipped component · `new` = new code over existing data. Order = build order.

| # | Item | Kind | Honesty note |
|---|---|---|---|
| 1 | **Posture inversion** — the four orderings of § 2, decided from data the page already fetches | `delta` (launcher page ordering + two AlaalaTile variants) | Council-ordered since 2026-07-14; zero new queries. Day-of needs only the existing date compare. |
| 2 | **Composer state sizing** — hero at 0 events, compact otherwise | `delta` (PR #4219’s `EventComposer`) | Pure CSS variant. |
| 3 | **“Storytellers you follow” group + rail in the People tile** | `new` read, existing tables (`user_follows` → published chapters of followed users) | **Prod has 0 follows and 0 storytellers** — until real rows exist this renders only the discovery card (§ 5.1) into `/realstories`, which itself shows labelled samples until the owner features a first chapter. Both layers are honest today. |
| 4 | **Chapter poster-first player** — poster facade; iframe mounts on tap | `delta` (`ChapterEmbedFrame` call sites on the chapter page) | YouTube posters derive from the existing thumb rule; TikTok/IG get the branded poster **permanently** (not a stopgap — no thumb is derivable without hosting). |
| 5 | **The seam** — “Tell this story” row in the finished event dashboard · desk event **picker** replacing the raw event-id input · owner-only “Story · published” chip on the celebrated card | `delta` (creator desk + event dashboard + event card) | The desk already stores the event ref; this replaces a raw id input with a human control and adds two owner-only doors. Booked-vendor pre-suggestion reads the event’s existing vendor registry. |
| 6 | **Next-chapter snap-scroll** on the chapter page | `new` UI, existing data (`fetchPublishedChapters` already returns the ordered timeline) | Same-storyteller only in V1. A cross-storyteller “For You” feed is deliberately NOT designed — it needs ranking signals we do not have and invites the lurking problem we locked out. |
| 7 | **Quiet-season “Tell this story” prompt** on story-less celebrated cards | `delta` (event card, quiet posture only) | Needs no new data; suppressed in planning/day-of postures by rule. |
| 8 | **Rail “N vendors in this video” chip** | `new` count on rail cards | Counts only relationship-gated vendors — never inflated by plain-text mentions. |

**Explicitly out of scope, with reasons:** a For-You/discovery feed of strangers’ chapters (no ranking data,
lurking-adjacent, and `/realstories` already is the curated discovery surface) · autoplay of any kind (not
achievable honestly with third-party embeds) · chapter comments/reactions (a new processing activity —
DPO line first, per the council’s D2) · any change to the vendor shop page, `/realstories`, or the follow
mechanics.

---

## 7 · What I deliberately did NOT change, and why

- **The four surfaces.** Events · Alaala · Yours-to-run · People stay exactly the four. The storyteller lane
  lives INSIDE People — a follow is a people-relation, and the owner-approved chassis is marked
  “RE-SKIN, never re-conceive.” No fifth surface exists in this design.
- **The bottom bar.** Five locked slots, raised centre ➕, capability-gated fifth slot — untouched. It already
  IS the Facebook/TikTok tab-bar habit.
- **The composer as a door, not an input.** Create-event needs a type, a subject and a date; a typed sentence
  would be discarded on the next screen. A box that eats your words is worse than a door that asks.
- **The no-lurking model.** No follower feed ever contains a private event; no private person is suggested;
  the follow graph stays invisible. The storyteller remains the only public follow.
- **The chapter’s red lines.** Setnayan never hosts the edit; the embed allowlist stays; the vendor
  relationship gate stays; unlinked mentions stay plain text; `creator_rate_terms` never renders publicly.
- **The vendor shop page.** ~3,700 shipped lines; the chapter links INTO it. Redesigning it here would be
  the exact defect Rule 0 exists to prevent.
- **`/realstories`.** It stays the public discovery hub; the home’s empty state points at it instead of
  duplicating it.
- **The palette and the archetype grammar.** Cream/ink/terracotta/gold-highlight/slate, light-only, obsidian
  only where photographs live, gold never a button, cards separated by border + shadow. Ported, not redrawn.
- **The event-card anatomy** (badge · monogram · place/date · gold ring · countdown) and the timeline
  ordering (newest on top). Owner-locked; the postures re-rank sections, never the cards’ insides.

---

## 8 · For Opus — technical grounding (not for the owner)

- **Home:** `apps/web/app/dashboard/(launcher)/page.tsx`. Posture = pure function of already-fetched data:
  `active`, `event_date`, `todayISO`. Suggested: `type HomePosture = 'brand_new'|'planning'|'day_of'|'quiet'`
  derived before render; sections render in posture order. Alaala ribbon/hero = variants of
  `_components/alaala-tile.tsx` (keep one component, prop-switched). Composer: `EventComposer` already in
  the page (PR #4219); add a `hero` prop.
- **Storyteller group data:** viewer’s follows via RLS-scoped `user_follows` (Pattern A read of own rows),
  then published chapters of those users via the existing public-read path (`fetchPublishedChapters` per
  followed user, or one batched admin-client query filtered to `public_profile_enabled` owners — mirror the
  gates in `lib/creator-public.ts`; never expose the follow graph itself). Cap: 3 rows + rail of ≤6 recent
  chapters (30 days). Graceful-degrade to the discovery card on any error — an RLS denial and an empty read
  are the same value; never render “0 storytellers”.
- **Poster facade:** wrap `ChapterEmbedFrame` (currently mounted eagerly in
  `app/u/[userSlug]/c/[chapterId]/page.tsx`) in a client island: poster `<button>` → on tap, mount the
  sandboxed iframe. Poster src: `youtubeThumbFromEmbedUrl(embed_url)`; null ⇒ branded obsidian poster
  (CSS only, no asset). Do not touch `normalizeEmbed` or the sandbox attributes.
- **Seam:** desk deep-link `/dashboard/creator?event=<eventId>` prefills the draft’s event ref (the desk
  already persists it); the picker lists the caller’s own events (owner-scoped fetch the launcher already
  performs). Pre-suggested vendors: the event’s vendor registry rows that carry a linked vendor profile —
  the same join `resolveLinkedVendorProfileIds` uses for its booking branch, so pre-suggestions are
  linked-by-construction. “Story · published” chip: count published `creator_chapters` rows where
  `event_id = <event>` and `user_id = viewer` — owner-scoped, RLS Pattern A, zero cost for non-creators.
- **Vendor count chip:** compute server-side with `resolveShoppableVendors(...).filter(v => v.linked).length`
  — never `substrate.vendor_ids.length`.
- **No new tables, no migrations, no flags required** except: if the storyteller rail should be dark-launched,
  gate it behind one `NEXT_PUBLIC_*` flag defaulting ON only after the owner sees it (owner-looking beats CI).
- **Tests that matter:** posture selection at the four boundaries (today/future/past/none — run under
  `Asia/Manila`, `America/New_York`, `Pacific/Kiritimati` per the wall-clock house rule); the rail’s
  graceful-degrade (error ⇒ discovery card, never a zero); poster facade renders no iframe before tap;
  seam chip absent for a non-owner viewer of the same event.

---

*Spec status: complete. The two owner decisions worth a look are flagged in the session summary — everything
else is buildable as written.*
