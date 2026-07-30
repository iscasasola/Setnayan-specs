# User Home — Concepts Deep Search (2026-07-30)

> Triggered by the owner: *"Google AI said our user homepage is nearest the FamilyAlbum website. Can you do a deep search of possible concepts that can work best for our user homepage… the family tree, the flash life, links to their shop/HQ also."*
>
> **This is a research verdict, not a build order.** It extends — never redraws — the shipped home.
> Predecessor: [`User_Home_Redesign_Council_Verdict_2026-07-14.md`](User_Home_Redesign_Council_Verdict_2026-07-14.md) (BUILT as PR #3240).
> Verified against `origin/main` @ `d0b55c833` (2026-07-30), not against specs.

---

## 0 · RULE 0 — what exists, what is missing, the delta

**Exists.** The user homepage is `apps/web/app/dashboard/(launcher)/page.tsx` (1,584 lines) + 9 components +
`(launcher)/layout.tsx`. It is the FOUR-SURFACE home the 2026-07-14 council specified, shipped 2026-07-15:
**Events** (glass cards, date-descending, % ring, countdown, attention line, trailing "New event" card,
`?show=all` for completed) · **Alaala** (obsidian Life-Flash tile + 5 lenses + This-year strip + Memories Hub
Expandable) · **Spaces** (shops by name · admin HQ · Samahan · Storyteller) · **You** (top-bar
`AccountSwitcher`) — plus the deterministic ⌘K `HomeCommandBar`.

**Missing.** One thing the owner named is genuinely absent: **the family tree.** `/dashboard/people` exists but
is flag-off in production (`NEXT_PUBLIC_PEOPLE_CONNECTIONS`, counsel-gated) and renders a coming-soon preview;
there is no tree view anywhere in `apps/web`; and the home's only "People" affordance is a *lens over photos*
inside the Alaala tile — not a doorway to a graph. The 1°-only kinship model (spouse · parent · sibling · child
→ 3 edge types, extended relations derived by traversal) was **owner-locked 2026-07-04** and never built.

Also missing, and specified: the **life-stage posture** (§ 6 of the 2026-07-14 verdict — home whispers while
planning, sings when quiet). The shipped home renders an identical composition for a wedding in 3 days and for
an account with nothing due for 3 years.

**The delta this document proposes.** Keep the shipped chassis. Add one object (the person/tree spine as a third
bento tile), one behavior (posture inversion), and three borrowed mechanics from FamilyAlbum that we provably
lack. **Nothing on the home gets rebuilt.**

---

## 1 · Is Google right that we're "nearest FamilyAlbum"?

**Half right, and the half it got wrong is the expensive half.**

FamilyAlbum (Mitene, Mixi, 2015) is a *single-object* product: one private, invite-only, auto-organized
photo/video timeline bucketed by month, stamped with the child's age, with comments and reactions from up to
100 invited relatives, plus prints/photobooks/1-Second Movies on top. Its home works because there is exactly
one thing in it.

**Where the comparison holds — our Alaala half.** Both are private-by-invitation, both auto-organize (we tag by
QR/face at capture; they sort by date), both treat the family as the audience rather than the public, both make
the accumulation of a life the emotional payoff, and neither is a broadcast social network. If you look only at
the obsidian Alaala tile, Google's read is correct.

**Where it breaks — our other two-thirds.** FamilyAlbum has no planning, no vendors, no money, no roles, and no
second doorway. Our home carries three distinct object classes at once: **events in motion** (logistics, money,
deadlines), **memories** (the Alaala collection + its renders), and **doorways** (shop · HQ · samahan ·
storyteller). A FamilyAlbum-shaped home would bury the first and third.

**The strategic risk in accepting the comparison.** Our own strategy note already establishes that
multi-camera photo aggregation is *commoditized* — per-event guest-photo apps exist, and Apple/Google Memories
own the single-library case. The uncontested intersection is **multi-source × multi-event × one-person ×
auto-rendered**, defended by the cross-event identity+consent graph. Letting the home drift toward "a nicer
FamilyAlbum" walks us into the commodity and away from the moat. **The right conclusion is the inverse of the
compliment: we should look *less* like FamilyAlbum at the top of the page and *more* like it inside Alaala.**

---

## 2 · What FamilyAlbum actually does that we do not (transferable mechanics)

Three of these are cheap, on-model, and fill real holes. Two are deliberately rejected.

| Mechanic | What it is | Verdict |
|---|---|---|
| **Elapsed-time axis** | Every month bucket is stamped with the child's age ("3 mo", "1 y 2 mo"). The scroll axis is a *person's* life, not a calendar. | ✅ **Take it.** Our equivalent: stamp Alaala buckets with the relationship/person anchor we already store — "*2 years married*", "*Nina, 18*", "*8 months since the binyag*". Uses `YearMomentsStrip`'s existing date-anchor model; adds no schema. This is the single most transferable idea and it is the *bridge to the tree* — an age stamp is a person-axis in disguise. |
| **Conversation inside the album** | Named relatives ("Mom", "Lola") comment and react directly on a photo; the family talks *in* the memory. | ✅ **Take it.** We have zero of this — iteration 0019 chat is couple↔vendor only. This is FamilyAlbum's actual retention loop, and it is the missing reason to open Alaala on a Tuesday. Guarded: reactions/comments are container-scoped (event roster / samahan members), never graph-traversed — consistent with the 2026-07-17 *"surfaces show presence; only the graph shows relationships"* lock. |
| **Auto-compiled seasonal render** | "1-Second Movies" compile themselves every season and simply appear. | ✅ **Take it — as the Life-Flash trigger.** Life-Flash ships and its flag is ON in prod, but it is on-demand only: nothing ever *brings it to you*. A quarterly/anniversary auto-compile is the trigger the § 6 posture needs, and the render is client-side and free (2026-07-23 lock). |
| **"Who viewed" tracking** | Shows which relatives opened which photo. | ❌ **Reject.** Read-receipts across a family roster is an affiliation/behaviour signal on people who never consented to it — the same class we eliminated when we dropped `communities.kind` for RA 10173 minimisation. |
| **Free monthly prints as the habit hook** | 11 free prints/month/member, funded by the print margin. | ⚠️ **Park.** Physically compelling and a genuine retention engine, but it is a fulfilment business (logistics, PH shipping, per-unit COGS) and violates the ₱0-marginal-cost constraint. Revisit only as a partner-margin SKU, never as a free tier. |

---

## 2b · Their imagery, and the storyline navigation they do NOT have (added 2026-07-30)

> Owner ask: *"How do we match the imagery of family-album.com? We need to be graphically easy to understand and easy to navigate across the different story lines — their story line and their dependents'."*

**🚨 The headline, verified: FamilyAlbum has no storyline switcher.** All of a family's children live in **one
undivided timeline**; you cannot even assign photos to a specific child on upload. Per-child views ("Personal
Pages") are **Premium + face recognition**, and being an Album Admin is limited to **one album at a time**.
Reviewers name the weak multi-child support as the app's main gap — against 18M users and 4.8★. *(Sources:
[help — separate album per child](https://help.family-album.com/hc/en-us/articles/360038774293-Can-I-create-a-separate-album-for-each-of-my-children) ·
[help — second child](https://help.family-album.com/hc/en-us/articles/900006367566-How-do-I-add-a-second-child-to-my-album) ·
[help — multiple albums](https://help.family-album.com/hc/en-us/articles/360038117674-Can-I-join-multiple-family-albums-from-the-app) ·
[review](https://tinynestapp.com/blog/familyalbum-app-review))*

⇒ **Two separate jobs.** Their *imagery* is worth taking almost wholesale. Their *storyline navigation* does not
exist and must be invented. This corrects an earlier framing in this session that assumed they had a child
switcher — they don't.

### Their imagery, as mechanics

1. **Composition** — each month opens with one full-bleed hero photo; month name upper-left in large light type, year small beneath; the grid starts immediately, no divider.
2. **The strip** — a horizontal month strip pinned in the top chrome, **newest on the left**. Tapping a month and swiping the photos do the same thing. That tap/swipe parity is why it feels effortless.
3. **The age stamp** — white text overlaid on the **bottom-left of the hero photo**, not a header: `Emma, Newborn`. Current month ticks live; past months freeze at that month's last day; at zero it prints a **word**, never `0 days`.
4. **The grid** — variable-size mosaic where **tile size encodes capture order**, ~2px near-white gutters, square corners, a translucent play circle on video, a speech bubble on commented photos.
5. **Two-colour discipline** — near-total white, photo-first; exactly ONE action colour (a bright azure) for every button/tick/link, and exactly ONE accent (a rose) used for nothing but the active month + its underline. *(Hex values reported by research, not independently confirmed.)*

**The one thing that makes them legible:** *only ever one thing on screen — a photograph — and only ever one way
to move: sideways through time, with a name and an elapsed age written on the picture.*

### Take · invert · refuse

| Take (the chassis) | Invert (our skin is locked) | Refuse |
|---|---|---|
| Hero-with-stamp composition; label upper-left, elapsed stamp bottom-left | white photo ground → **warm paper + glass**, gold `#A9834B` as the single action colour | a **face/avatar rail** as the top-level switcher — they don't have one, and our faces are per-event-locked + minors are SPI |
| The elapsed-time **arithmetic** (live current bucket, frozen past buckets, a word at zero) | their child's **age** → our **event's elapsed time**: "2 years married", "8 months since the binyag", "in 214 days" | deriving the stamp from a **person's birthdate** — `people.birth_date` exists but is fenced + counsel-gated; the **event date is not** |
| horizontal strip, tap/swipe parity, one "you are here" colour + underline | azure/rose → gold text + 2px gold underline; no second accent | **month as the only axis** — their loudest complaint |
| variable mosaic, hairline gutters, order encoded in tile size | square corners → our 8px thumb / 20px tile radius; system sans → **Hanken Grotesk**, all numerals **Space Mono** | chrome tinted from the photo's dominant hue — gold is the only decorative colour |
| flat comment list: bold name, text beneath, no avatars, no timestamps | their 5 bottom tabs → our existing chrome; **we are not adding a tab** | the paywalled per-person view, emoji reactions, auto-playing "On this day" |

### The recommendation — a **Chapter Strip**, not a face rail

Steal their strip *mechanically* and point it at the axis they got wrong. Their buckets are months; **ours are
event chapters** — the only unit our DB can populate, and the only unit carrying the permission rules a
continuous timeline would dissolve.

- **`ChapterStrip` + `ChapterCard`, inside the Alaala tile** — not on the page ground (the home keeps one dark focal).
- **Strip:** ~44px, snap-scrolling, newest left, 32px pills; active = gold text + 2px gold underline; ~16px of the next pill peeks (a cut-off item beats dots as a "there's more" cue).
- **Card:** full-bleed 16:9 hero, radius 20. Upper-left: chapter name + date. Bottom-left over a soft scrim, in the exact slot FamilyAlbum puts the age: the **elapsed stamp** — Space Mono, uppercase, `.14em` — `MARIA & JUN · 2 YEARS MARRIED`. Beneath: 4-col mosaic, 8px radius, 6px gaps, capped at 8 tiles + a `+40` terminator.
- **By count:** 1 chapter → no strip chrome at all (a switcher with one item isn't a switcher). 3 → three pills, no scroll. 12 → scroll + peek + a trailing **"All 12"** pill opening a bottom sheet (search, alphabetical, 44px rows) which is *also* where the **person filter** lives.

**The storyline answer.** A person's storyline = **their chapters** — the events where they are the honoree.
Nina's storyline is her binyag and her birthdays. ✅ **The join is real and verified:**
`events.honoree_dependent_id UUID` + `events_honoree_dependent_idx`, migration
`20270821100000_life_event_gate_honoree.sql` (counsel-gated, per its own header comment). No new table, no face
matching, no cross-event identity. Filtering to a person drops a dismissable `NINA · 3 CHAPTERS` chip at the
strip's left edge — one control, one extra state, no second navigation layer.

Inside a chapter, "who's in it" renders as **name chips, not faces** — names are what we have consent to show
across people; faces are per-event-locked and a separate sign-off.

### The empty state — the make-or-break

FamilyAlbum's real trick: it registers a child's **name and birthdate before a single photo exists**, so the home
can always draw a name and an age. Do the same with a different noun — **we already register an event name and
date at signup, so we can always draw a name and a countdown. On day one the countdown IS the content.**

A brand-new user with zero photos and zero dependents sees **one card, no strip, no grid, no avatars** — the
hero slot filled by the warm paper-stripe texture band with the event's monogram over its edge (the treatment
already shipping on the event cards), and the elapsed stamp reading `IN 214 DAYS`. Never an empty shelf labelled
"Memories" (council failure mode § 10.4).

### Build list

| # | Item | Gate |
|---|---|---|
| 1 | Elapsed-stamp helper (live current / frozen past / word-at-zero) + apply to `YearMomentsStrip` | none |
| 2 | `ChapterCard` — hero + upper-left label + bottom-left elapsed stamp + capped mosaic | none |
| 3 | `ChapterStrip` — pills, peek, snap, tap/swipe parity, 1/3/12/empty states | none |
| 4 | "All N" bottom sheet + **person filter** (reads `events.honoree_dependent_id`) | 🟠 counsel — the column's own header marks it counsel-gated |
| 5 | Name chips for "who's in this chapter" | 🟠 DPO note |
| 6 | Reactions/comments on chapter media, container-scoped | 🟠 DPO note |

---

## 3 · The concept field

Six models for what a signed-in home *is*. Scored against our actual constraints, not in the abstract.

**① The Lane + Bento — what we ship today.** Events lane on top; a bento of Alaala · Watch · Spaces beneath.
*Strength:* every block has exactly one home, capability-gating genuinely works, and the ⌘K bar makes it fast.
*Weakness:* it is a **register** — it reports state identically regardless of life stage, and it has no person
axis at all.

**② The Album Spine — the FamilyAlbum model.** Home *is* one continuous month-bucketed scroll of your life;
events are chapters in it; planning is a pinned card. *Strength:* emotional, zero organising, daily return.
*Weakness:* buries logistics under nostalgia — exactly the failure the council's § 10.7 forbids ("don't tax the
stressed planner with nostalgia") — and on day one, with 0 photos, the home is a void (failure mode § 10.4).

**③ The Tree-as-Home — Ancestry / MyHeritage / FamilySearch.** The person graph is the primary object; events
hang off people. *Strength:* the only model in which binyag → debut → kasal is one continuous arc, and it sits
directly on the moat. *Weakness:* an empty tree on day one, it is counsel-gated, and a tree is a terrible place
to read "₱18,000 due Friday."

**④ The Next-Action Console — Sunsama / Todoist.** One hero: the single most urgent open loop across all
events. *Strength:* highest task completion; this is already the council's mobile direction and the mobile
nudge row is a partial implementation. *Weakness:* pure utility — when nothing is due, there is no product.

**⑤ The Foyer — Instagram / Shopify multi-persona.** Home is a context picker; you choose a doorway and the
whole app becomes that. *Strength:* cleanest for the multi-hyphenate (the bride who is also a florist).
*Weakness:* ~95% of accounts have one doorway, so it is an extra tap to nowhere. **Already adjudicated** —
fork #2 of the 2026-07-14 verdict rejected it as the home and kept it as the avatar switcher, which ships.

**⑥ The State-Inverting Home — council § 6.** Not a layout; a **rule**. The same components, re-ranked by life
stage: *planning* → logistics leads, Alaala is a thin warm ribbon; *day-of* → everything collapses to the live
event; *quiet* → Alaala rises full-bleed and anniversary-aware. **Specified 2026-07-14, never built.**

### Recommendation

**Keep ① as the chassis. Build ⑥ as the behaviour. Admit ③ as a third bento object — never as a new home.
Fold §2's three mechanics into Alaala. Do not build ② or ⑤.**

Concretely: ① is correct and shipped, so it does not get redrawn. ⑥ is the cheapest large win on the page —
it is a re-ranking of components that already exist, and it is the only thing that makes the home feel alive
between events. ③ enters as **one tile with one doorway**, so the tree earns its place next to Alaala without
becoming the page. ② and ⑤ are both already-rejected shapes and re-litigating them would cost us the
no-duplication property that the whole 2026-07-15 remodel bought.

---

## 4 · The inventory — what must be on the user home

✅ = ships today · ⚠️ = ships but gated/incomplete · ❌ = absent

| Element | State | Where it lives today | Gap |
|---|---|---|---|
| **Create an event** | ✅ | trailing "New event" ghost card in the Events row → `/dashboard/create-event`; 0-event console users are redirected straight there | none |
| Events in motion | ✅ | Events section — badge · monogram · place/date · gold % ring · countdown · attention line, date DESC | no posture inversion (see ⑥) |
| Completed events | ✅ | behind `?show=all`, read "Celebrated" | none |
| **Life-Flash ("flash life")** | ✅ flag **ON** in prod | obsidian `AlaalaTile` → "Play Life-Flash" → `/dashboard/life-flash` | **no trigger** — never surfaces itself on an anniversary; no auto-compiled seasonal render |
| Alaala lenses | ⚠️ | `AlaalaLenses`: Recent · Owned · Attended · People · **With me** | "With me" needs `NEXT_PUBLIC_PERSON_LIFE_STORIES` (off) |
| Memories Hub | ✅ | inline `Expandable` → `PhotosTab` | none |
| This year / date anchors | ✅ | `YearMomentsStrip` | the elapsed-time stamp (§2) belongs here |
| **Links to their shop** | ✅ | Spaces tile — **one row per shop, by name, with its logo**, "needs a reply" attention (new inquiries + unread chats), capped at 3 + "N more shops" | none — this is built exactly as asked |
| **Links to HQ (admin)** | ✅ | Spaces tile — admin HQ row with an awaiting-review count across actionable queues | none |
| Samahan / communities | ✅ | Spaces tile — rows + "+ Create a Samahan", renders for everyone | the post-event samahan-formation prompt is still unbuilt |
| Storyteller / creator | ✅ | Spaces tile — one doorway either way (promo row at 0 chapters) | none |
| Search & jump | ✅ | deterministic ⌘K `HomeCommandBar` (no LLM) | none |
| You / switch context | ✅ | top-bar `AccountSwitcher` — profile · settings · Setnayan AI · switch account/console · sign out | none |
| **Family tree** | ❌ | nothing. `/dashboard/people` is flag-off in prod (coming-soon preview); no tree view exists in `apps/web`; home has only a photo *lens* named "People" | **the one real hole** — see § 5 |
| Life-stage posture | ❌ | — | council § 6, specified and never built |
| Family conversation on memories | ❌ | chat is couple↔vendor only | FamilyAlbum's retention loop |

---

## 5 · The family tree — the one real hole, and its gate

What is **locked** (DECISION_LOG 2026-07-04 and 2026-07-17) and still unbuilt:

- **First degree only.** A person declares just spouse · parent · sibling · child. These collapse to three edge
  types (parent↔child directed, spouse symmetric, sibling symmetric). Grandparents, cousins, in-laws,
  ninong/ninang chains are **derived by traversal, never declared**.
- **Every edge is mutually confirmed.** Declare "X is my parent" → X confirms "you're my child". No one-sided
  edges, ever.
- **Branches vs leaves.** Family edges are branches the tree grows through; friend edges are leaves visible only
  to their two endpoints — never traversed, never "people you may know". The friend-of-friend query path must be
  **absent, not blocked**.
- **The graph stops at 2°.**

**The gate is real and I am not routing around it.** The 2026-07-04 lock puts the family tree in **Phase 2 —
PH counsel required** — and the *child* relation (the only one that can be a minor) is Phase 3 with guardianship.
`NEXT_PUBLIC_PEOPLE_CONNECTIONS` is the counsel flip. So the honest sequencing is:

1. **Now, ungated:** give the tree its **doorway and its empty state** on the home — a third bento tile that says
   what it will be and lets a user declare *their own* four slots as a private draft. No edges activate, nothing
   is disclosed to a second party, so no counsel exposure.
2. **On the counsel flip:** the mutual-confirm handshake activates and the draft slots become real edges.
3. **Phase 3:** minor children via the existing Alaga/dependent guardianship, which already ships behind the
   `dependent_minor_profiles` data-privacy control.

This is the same "ship the control, not the paragraph" posture the DPO work established — the tree gets a
surface before it gets its edges.

---

## 6 · Sequenced build list (nothing here redraws the home)

| # | Item | Touches | Gate |
|---|---|---|---|
| 1 | **Posture inversion** (§ ⑥) — rank the existing bento by life stage: planning / day-of / quiet | `(launcher)/page.tsx` ordering + `AlaalaTile` prominence | none |
| 2 | **Elapsed-time stamps** on Alaala + This-year ("2 years married", "Nina, 18") | `YearMomentsStrip`, `AlaalaTile` | none |
| 3 | **Family-tree tile + empty state** in the bento, private-draft only | new `_components/tree-tile.tsx` + `/dashboard/people` | none (edges stay dormant) |
| 4 | **Life-Flash trigger** — auto-compile on anniversary/season, surfaced as the hero when quiet | `life-flash/actions.ts`, home card | none (client-side render, ₱0) |
| 5 | **Reactions/comments on Alaala media**, container-scoped | new; extends 0019 chat storage | DPO note (new processing) |
| 6 | **Mutual-confirm kinship edges** | `/dashboard/people` | 🔴 **PH counsel** → `NEXT_PUBLIC_PEOPLE_CONNECTIONS` |
| 7 | Post-event samahan-formation prompt (the missing triangle doorway) | event settle flow | none |

---

## 7 · Owner decisions

- **D1 — Does the family tree get a home tile now, as a private draft with dormant edges (§ 5 step 1)?**
  Recommended yes: it is the only item the owner named that has no surface, and the draft form carries no
  counsel exposure.
- **D2 — Reactions/comments on memories (item 5).** This is a new processing activity on guest-visible media
  and needs a DPO line before build. Recommend yes, container-scoped only.
- **D3 — Prints (§ 2).** Recommend **no** for V1 — it breaks the ₱0-marginal-cost constraint. Flagging it
  because it is FamilyAlbum's strongest retention mechanic and rejecting it should be a decision, not a
  silence.
- **Still open from 2026-07-14 § 11 note B:** the desktop rail vs the chrome-less lock (#3224) was deferred
  "show me both" and never resolved. The home shipped chrome-less. Leaving it that way is the default unless
  the owner reopens it.

---

## Sources (external)

- [FamilyAlbum — official site](https://family-album.com/) · [App Store listing](https://apps.apple.com/us/app/familyalbum-photo-sharing/id935672069) · [Google Play listing](https://play.google.com/store/apps/details?id=us.mitene&hl=en_US) · [Wikipedia](https://simple.wikipedia.org/wiki/FamilyAlbum)
- [FamilyAlbum vs Tinybeans comparison](https://tinybeans.com/private-photo-sharing-app-familyalbum-tinybeans/) · [Best family album apps compared (2026)](https://nappi.app/blog/best-family-album-apps) · [23snaps](https://en.wikipedia.org/wiki/23snaps)
- [Ancestry iOS redesign — five-tab IA](https://www.ancestry.com.au/c/ancestry-blog/ancestry-ios-app-gets-a-whole-new-look-and-feel-with-some-great-new-features/) · [MyHeritage mobile tree](https://blog.myheritage.com/2025/03/new-improved-family-tree-on-the-myheritage-mobile-app/) · [FamilySearch Tree design](https://www.designrush.com/best-designs/apps/familysearch-tree)
- [Google Photos Collections redesign teardown](https://www.androidauthority.com/google-photos-collections-redesign-apk-teardown-3660010/) · [Google Photos 2026 design](https://www.droid-life.com/2026/02/13/google-photos-gets-a-fresh-new-design/) · [Google Photos Recap](https://blog.google/products-and-platforms/products/photos/google-photos-2025-recap/)
- [UX of account switching in web apps](https://medium.com/ux-power-tools/breaking-down-the-ux-of-switching-accounts-in-web-apps-501813a5908b)
