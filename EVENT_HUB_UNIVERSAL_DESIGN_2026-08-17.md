# The Event Hub, for every kind of event — design plan

**Date:** 2026-08-17 · **Status:** DESIGN ONLY — nothing here is built; a separate session builds it.
**Owner's ask, verbatim:** *"The goal of the event hub will be a universal design that can apply to all types of event from wedding to any event. It should be able to easily access all the different parts of the event hub."*
**Ground rule obeyed throughout:** RULE 0. Every recommendation below is an extension of something that already ships and was read in the shipped code before being proposed. Nothing is redrawn. File-and-line evidence for every claim is in **Appendix A**; the recommendations themselves are written for the owner and name no code.

---

## 0 · The one idea

The Event Hub already has a design language good enough to be universal — the "Pahina" editorial look: a magazine issue commissioned about *these people*, with a typographic masthead, numbered chapters, a reply card, and the host's own colours. **Nothing about that language is inherently a wedding.** What is wedding-shaped is a thin layer of *words and assumptions* sitting on top of it: the hero assumes two names joined by an ampersand, a chapter is titled "Our love story", a guest is on the "Bride's side", and about seventy small phrases say "wedding" or "couple" to people at a birthday.

The database already knows the right words for all sixteen event types — who the honoree is called, what the occasion is called, whether a seat is a "table" or a "seat" — and the page never asks. So the universal design is not a new design. **It is teaching the page that already exists to ask the questions its own database already answers**, plus one genuinely new piece: a contents page, so a guest can reach every part of the event from one place.

Five work packages fall out of this plan, in order of value:

| # | Package | Size |
|---|---|---|
| 1 | The masthead learns the three identity grammars (§A) | small |
| 2 | The vocabulary sweep — chapter titles + guest copy follow the event type (§B) | medium, mechanical |
| 3 | "In this celebration" — the contents page (§C) | medium, the one new object |
| 4 | Per-type defaults for art direction — settings only, no new skins (§D) | tiny |
| 5 | Guardrails — the shipped decisions that must survive (§E) | zero build, pure discipline |

---

## A · The universal masthead

### What ships today (verified)

One masthead component serves all four hero situations (stranger with a photo, stranger without, invited guest with a photo, without). It renders: an eyebrow line ("№ 01 · You are invited"), an optional monogram, **stacked names with an italic gold joiner**, a hairline rule, the date in large gold numerals, the venue line, and the photo demoted below the type as a framed "cover plate" with a caption. When the event's name has no "&" or "and" in it, the names collapse to a single line — that fallback exists and works.

### The defect that blocks universality (found while verifying, not in the brief)

The split into two stacked lines is triggered by **sniffing the name for the characters "&" or "and"** — not by asking whether this kind of event has two principals. So a corporate night called "Design & Build Summit" or a reunion called "Mila and Friends" would be torn into two stacked lines with a wedding's italic gold ampersand between them. A title is not two people. The trigger has to move from the spelling of the name to the *kind* of event.

### The design: one block, three identity grammars

The masthead stays **one component with six invariants** and exactly **one variable**: how the name block is set. The variable is decided by the event type's profile (which already records whether the type has two principals), never by the text of the name.

**Invariant for every event type** — this is what makes it one product:

1. The eyebrow line: chapter № + a short phrase.
2. The name block is the largest type on the page, in the display face, light weight.
3. The hairline rule under the name.
4. The date in oversized gold numerals. (For a multi-day trip, the range: "March 12 – 19, 2027". The database already knows an end date.)
5. The venue line in quiet ink.
6. The cover plate below the type — the photo never fights the name.
7. The mark slot: filled for weddings (monogram), simply absent for types that have no mark. The masthead already tolerates an empty mark slot; nothing collapses.

**The one variable — the name-block grammar:**

| Grammar | Event types | How the name is set |
|---|---|---|
| **Two names joined** | wedding · anniversary | Stacked lines, small italic gold joiner between — exactly today's treatment. Allowed **only** because the type declares two principals; then the "&"/"and" split applies. |
| **One person honored** | birthday · debut · graduation · christening · gender reveal | One name line, set exactly as the host typed it ("Remedios 'Lola Remy' Cruz at 80"). No joiner, no second line. This is the shipped single-line fallback, now *chosen by the type* instead of stumbled into by the absence of an ampersand. |
| **A titled occasion** | corporate · tournament · reunion · travel · celebration · the rest | The title set as typed, wrapping naturally by width — **never** split on "&"/"and", never given the italic joiner. |

**The eyebrow follows the *moment*, and borrows one word from the *type*.** The per-phase eyebrows already designed for weddings generalize cleanly — before: "You are invited" (universal, honest for every type, already the shipped default); on the day: "Happening today"; after: the record line, which today would read "Married · Jan 12" and becomes "*{the type's own word}* · Jan 12" — "Graduation · Jun 4", "The trip · Mar 12–19". One template, one word swapped, and the word already sits in the database for all sixteen types.

**What does NOT vary:** the typefaces, the scale, the gold, the rule, the cover-plate framing, the Candlelight/Daylight behaviour, the palette pipeline. A graduation masthead and a wedding masthead should be recognisably the same magazine — different issue, same publisher. That is the whole point: the design does not "look like a wedding template with words swapped" precisely because the *structure* never pretended to be about weddings; only the split-and-joiner did, and that is now earned by the type instead of assumed.

### Sketches (words only — the builder ports, does not redraw)

```
WEDDING                      60TH BIRTHDAY                CORPORATE GALA
№ 01 · YOU ARE INVITED       № 01 · YOU ARE INVITED       № 01 · YOU ARE INVITED
       [monogram]
       Maria                 Remedios "Lola Remy"         The Hilaria Group
        &                    Cruz at 80                   Founders' Gala 2027
       Jose
   ──────────                ──────────                   ──────────
 JANUARY 12, 2027            MARCH 3, 2027                NOVEMBER 8, 2027
 Santuario de San Antonio    Casa Milagros, Tagaytay      Shangri-La The Fort
 [cover plate + caption]     [cover plate + caption]      [cover plate + caption]
```

---

## B · The chapter grammar for a non-wedding

### What the page is made of (verified counts — a small correction to the brief)

The brief said "16 host-toggled blocks." Measured: there are **16 block types** in the registry, of which **4 are always-on** (hero, greeting, QR card, RSVP) and **12 are host-toggled**. Around them sit roughly two dozen **automatic blocks** the page adds itself when facts warrant (the seat block, the live wall, the photos-of-you strip, the face-enrol ask, the camera, the video-greeting recorder, the vendor credits, the keepsake ticket, and so on). Nothing new is invented below — every "replacement" is an existing block wearing the right words.

### The chapter verdict, type by type

**Universal — these chapters work for all sixteen types today, needing only wording:**

| Chapter | Verdict |
|---|---|
| **№ 01 The masthead** | Universal (§A). |
| **№ 03 Details / the venues** | Universal. Plates saying where and when are the same job everywhere. |
| **№ 04 The programme** | Universal — a run-of-show is a run-of-show. For a **trip** this chapter *is* the itinerary (the travel schedule machinery already exists and is day-aware); the rail simply gains day headings for multi-day types. Retitle per type: "Programme" → "Itinerary" (travel) → "Match schedule" (tournament). |
| **№ 06 The gallery** | Universal. Photos of a christening are as precious as of a wedding. All gallery privacy rules carry over unchanged. |
| **№ 07 The reply card** | Universal. RSVP is enabled for every type; the reply-card treatment (deckled stock, letterpress, the keepsake ticket after answering) is an occasion-neutral delight. The word "RSVP" itself is universal in PH usage. The keepsake's stamp wording is caught by the two *already-pending* owner decisions on RSVP wording — fold this in there, don't decide twice. |
| Countdown · venue map · dress code · what to bring · special message · our photos | Universal as-is. Dress code earns its keep at galas and debuts; "What to bring" is the pack list of a trip — same block, host already writes the content. |

**Wedding-only, and what stands in their place — never a new feature:**

| Wedding piece | For other types |
|---|---|
| **№ 02 "Our love story"** | The chapter survives — it is host-written prose with a drop cap and a pull quote, which is universal. Only its **title** is wedding-branded. Per-type titles: "The story so far" (birthday/anniversary) · "The road to this day" (graduation) · "Welcome, little one" (christening) · "Why this trip" (travel) · corporate/tournament default the chapter to hidden (hosts can already hide any block). The prose the host writes needs no migration — the label is the whole delta. |
| **The Save-the-Date film + cinematic reveal** | Stay wedding-only, **on purpose** — this is an existing deliberate lock, recorded in the profile spine: the reveal is a wedding-signature product and the monogram is couple-initials-shaped. A non-wedding's earliest phase simply falls straight to the invitation phase. **Do not unlock these as part of the universal pass.** |
| **The monogram** | Same deliberate lock. The masthead's mark slot stays empty (§A invariant 7). |
| **"Bride's side / Groom's side"** | The greeting prints a side for every guest. When the type has no two principals, the side line must simply not print — the role line ("You're joining us as Ninang") stands alone. This is a degrade, not a new feature. |
| **The Tsinoy tea-ceremony card** | Already conditional on the ceremony — correctly gated today, nothing to do. |
| **~70 stray phrases** ("the couple sent you", "Wedding-day photographers will scan it", "a day after the wedding", "this wedding") | The mechanical sweep: each phrase takes the type's own words — organizer noun ("the couple" → "the celebrant's family" / "the organizers") and event word ("the wedding" → "the graduation" / "the trip"). Both words already exist in the database for all sixteen types; the guest page just never asks. This is the largest-surface, lowest-risk package in the plan. |

**What a graduation gets, end to end:** masthead with the graduate's name · details plates · "The road to this day" · programme rail · dress code if the host wants it · reply card → keepsake ticket ("Nº 042 · one seat, reserved") · on the day: camera, live wall, photos-of-you · after: the recap and "You were there". Every one of those is shipped today; it just says "wedding" in eleven places while doing it.

**What a trip gets:** masthead with the title grammar and a date *range* · the itinerary as the programme chapter with day headings · "What to bring" as the pack list · seats are called "seats" (the word is already in the type's profile) · the reply card is the "I'm coming" confirmation. The 3D venue room and money-gift door won't apply and — because every door is already gated on what its destination would actually show — they simply never draw. No work needed to hide them; the honesty rules do it.

---

## C · "Everything in this event" — the contents page

### The problem, sized honestly

Under one event live **fifteen distinct addresses** (counted in Appendix A: the page itself, the Live hub, the 3D room, the money gift, find-your-seat, find-my-table, the seat pass, the recap, the printable, the join page, the welcome page, plus the camera surfaces and three action doors). The bottom bar holds **at most five** of seven possible slots, and the five-slot cap is owner-locked with recorded reasoning. Two doors are cards at the page's foot. The rest are reachable only from context-specific moments or not at all from this page.

### The proposal on the table: a sheet behind the last slot — argued, then amended

**For a sheet:** it is the right *container*. It adds no sixth tab (the locked shape survives), it scales to fifteen entries where a bar never can, it is one tap, and the product already owns the precedent — the Live hub's own bottom menu shows five pills and folds the rest behind a "More" sheet. A guest who has seen the Live hub has already learned this gesture.

**Against hanging it behind the *last slot*:** the last slot is **Me** — the guest's own name, QR, seat and RSVP. That is the single highest-frequency personal object on the day (photographers scan it; the door staff read it) and the one personalization no competitor has. Burying a directory under it, or replacing it, demotes identity to make room for a menu. Worse: the last slot already changes meaning by who is holding the phone (Me / Manage / Join / a supplier's kit) — overloading it means the directory lives somewhere different for every viewer, which teaches people the bar is unreliable, the exact failure the navigation rules exist to prevent.

### The recommendation: the magazine already has the answer — a contents page

The Event Hub is styled as a commissioned magazine issue. **A magazine has a table of contents, and it sits right after the cover.** So:

**"In this celebration" — a quiet typographic index, mounted directly below the masthead's cover plate**, inside chapter № 01 (chapter numbers do not shift). Not a stack of cards — a *printed contents page* in the existing editorial grammar: a two-column list of short entries, mono labels, gold leaders, hairline rules. Visually it costs almost nothing; functionally it is the one place every part of the event can be reached. Tapping "Home" on the bar from anywhere returns to the top, where the contents is — so the whole event is always two taps away without touching the bar's shape.

It is mounted **once, above the identity fork** (like the existing doorway strip), so the invited cousin and the cookie-less relative abroad read the same index, differing only in personalization.

**It absorbs the existing foot-of-page doorway strip.** That strip (3D room · money gift · streaming notice) is already a proto-directory; keeping both means two lists that will drift. The streaming notice keeps its special no-link treatment inside the contents (see below). *Marked `OWNER_DECISION` (small): retire the foot strip into the contents page — recommended yes, one directory only.*

### What it lists, in what order

The entries are grouped by what a guest is *doing*, and the groups re-order by the event's moment — the same three moments the bar already knows:

**Before the day** —
1. *The invitation*: Details · The story · Reply (or "Your reply — sent ✓") · Dress code · What to bring
2. *Getting there*: Venue & map · Walk the room in 3D · Find your seat
3. *Yours*: My QR · My seat pass · Keep this on your phone
4. *Coming up*: Camera (listed locked: "opens on the day") · "This celebration will be streamed live — the player appears on this page" (a sentence, never a link)

**On the day** — *Happening now* leads: Live hub · Watch · Camera · Live wall · My table — then *Gifts & greetings* (Send a blessing · Leave a 5-second greeting), then the rest.

**After** — *The day, kept* leads: The recap · Gallery · Photos of you · Keep them forever — then thanks.

### The rules every row obeys (all existing rules, applied one layer out)

1. **A row is drawn only if the page behind it would let *this viewer* in.** The two shipped doorway cards already obey this ("a door must never be drawn by a rule laxer than the one at the other end of it"); the contents inherits it row by row.
2. **Features may be listed locked, with a spoken reason. Content is never listed when withheld.** The camera appears padlocked with "The host has not opened the camera" — because a camera is a promise of the invitation. A gallery with nothing public, an unset money-gift page, a fenced broadcast **do not appear at all** — a greyed row would announce that photographs exist and are being withheld, the exact disclosure the owner's rule forbids. The asymmetry is the shipped one: *announce features, hide content.*
3. **A closed-but-announced row says when it opens, in words** ("opens on the day" · "photos arrive here during the celebration") — the same reasons the bar's padlocks already speak aloud when tapped.
4. **One brain, two mouths.** The contents must be resolved by the *same* rules engine that resolves the bottom bar — the bar shows the five most important doors for this viewer at this moment; the contents page is the whole index from the same resolution. Built that way, the two can never disagree; built as a second list, they will.

---

## D · Per-type art direction

### What ships

Two art directions exist: **Daylight** (the default — every event today) and **Candlelight** (a warm-dark direction the host opts into; it is one switch that re-derives every colour through the same pipeline, and it sits on the Pro side of the flourish map). The host's mood-board palette already makes every site chromatically unique, wedding or not.

### The question: does a birthday or a corporate gala get its own direction?

**Recommendation: NO new art directions. The event type sets *defaults*; the host's mood board sets the *look*.** — marked `OWNER_DECISION`, with this recommendation:

1. **The product's pitch is "commissioned, not themed."** A per-type skin *is* a theme — sixteen of them would rebuild exactly the template feel the editorial design was created to kill. The right variation axes already exist and are per-*host*: their palette, their photos, their words, and one deliberate mood switch.
2. **Every direction is a bill.** Candlelight needed its own careful pass to keep text readable in the dark (and this project has learned repeatedly that a tinted surface must be measured in both directions). Sixteen type-skins means sixteen of those bills, forever.
3. **What the type may rightly do is suggest.** In the site editor, an evening-shaped type (gala · debut · anniversary dinner) pre-suggests Candlelight with one line of copy ("Evening event? Candlelight suits it"); the default remains Daylight for every type, and the choice remains the host's. Driven by the event type *only as a suggestion*, by the mood board for everything real.
4. **If a third direction is ever wanted** (say, a brighter festival direction for children's parties), add it as a *host choice available to all types*, keeping the set bounded (three at most) — never as a type-locked skin.

---

## E · What must NOT change — the shipped decisions this work lives inside

Each of these was found in the code or the design record with its reason attached. The build session must treat every one as a wall.

1. **The five-slot bottom bar, and its resolver.** Owner-locked shape; all slot rules live in one tested rules engine, and the recorded reasoning says a sixth tab "is not a small addition — it is a redesign of an owner-locked shape." The contents page (§C) exists precisely so this never has to move.
2. **Announce features, hide content.** A locked camera is drawn with its reason; a gallery with nothing public is *not drawn*, because a greyed one would reveal withheld photographs. This asymmetry is the subtlest owner ruling in the tree and §C deliberately extends it rather than touching it.
3. **The couple's camera is unconditional; everyone else's is the host's switch** — and when closed it locks visibly, never vanishes.
4. **Watch never displaces the Gallery** — on the day a guest needs both; the broadcast earns its own slot.
5. **The doorway cards never draw locked**, and every door is gated on what the destination itself demands — an invisible page is better than a visible dead end.
6. **The streaming notice carries no link** before the day — a saved URL cannot be known to be open, so the only promise made is about the page the reader already has.
7. **The Pahina reskin decisions**: the typographic masthead with the photo demoted to a cover plate; motion that fails *visible* (a broken script leaves a fully readable page); the functional-colour exile (no app-green/warn-yellow on an event page — verified still clean); numbered chapters for the magazine, starred plates for the guest's personal layer.
8. **The guest tree is owner-excluded from the app-wide Atelier reskin** and keeps its own editorial faces. Corollary: the five owner-approved archetype prototypes of 2026-08-01 are binding for the *app's* surfaces — porting them into the Event Hub would violate this exclusion. The Event Hub's binding design is the Pahina spec plus the owner's own 5-Tab prototype.
9. **Chrome is a clone.** The bottom bars are reskinned by palette-token substitution only — no invented camera notch, no geometry changes. (The shipped bar is icon-above-label by a *later* owner design round that superseded the text-only spec; do not regress it either way.)
10. **Reskin, never drop.** The full element inventory is the acceptance checklist; a port that loses a control is a defect. The RSVPed keepsake keeps its quiet "Need to change your reply?" disclosure until the owner rules otherwise.
11. **The two pending RSVP owner decisions stay pending** (the option wording; whether the ask disappears entirely after replying). §B folds the keepsake-stamp wording into them; nothing here pre-empts them.
12. **The Save-the-Date film, cinematic reveal and monogram stay wedding-only** — a recorded deliberate lock, not an oversight for this pass to "fix".
13. **The Event Hub vocabulary is owner-locked** (Event Hub = the one lifelong address · Live hub = the fullscreen page inside it, chip visible only while live/post · Event Hub Pro = the paid upgrade). This document uses those words and reopens nothing.
14. **The palette is locked** (cream `#FDFBF7` · ink `#2C2A29` · action terracotta `#C24E25` · link `#3B4E67`), **gold `#A9834B` is decorative only — never body copy or a text link** (3.37:1 on cream), and the gold/terracotta name-swap trap in the code is real: the builder must check any tinted block in both light and Candlelight.
15. **The sample event keeps the menu always-on; real events keep byte-stable pages under the off flags.** Any new mount (the contents page) must respect the same gating discipline so flag-off DOM stays untouched.

---

## F · Corrections to the brief (I verified rather than agreed)

1. **"16 host-toggled blocks"** → measured: 16 block *types*, of which 4 are always-on and **12 are host-toggled**. The "24 automatic blocks" figure is the right order of magnitude (I count ~24–28 depending on what counts as a block).
2. **"The guest page reads NONE of the vocabulary; it asks only 'may this event have a page at all?'"** → almost right, refined: terminology is indeed never read anywhere in the guest tree, but the page asks the type profile **two** questions, not one — the website question *and* the seating question (which gates the 3D-room door), and the website answer also switches the lifecycle-phase engine on. The design above relies on this: the plumbing to the profile already reaches the page; only the words don't.
3. **The single-line name fallback (brief claim 5) is true but fragile** — the two-line split is triggered by the characters "&"/"and" in the name, so a *titled* event containing them would be wrongly stacked with a wedding joiner. §A moves the trigger to the type. This is the one place the brief under-stated the work.
4. **"15 addresses"** → confirmed at 15 by my count (11 guest-reachable pages + 3 action doors + the seat-claim step); the exact roster is in Appendix A.
5. **"christening → 'godparents'"** → in the seeded vocabulary, "Godparents" is the *VIP-tier label* for christenings; the organizer noun is "host". Minor, but the builder should not look for a "godparents" organizer noun.
6. **The 16-type vocabulary "in the production database"** → verified in the seed migrations in the repo (all sixteen types carry full terminology). I did not query prod directly this session; migrations auto-apply on this project, but the builder should confirm by the object per house rule.
7. The block registry's own docblock still says "12 canonical widget types" above a 16-entry list — a stale comment worth one line in the build PR, not a design matter.

---

## Appendix A — evidence: files, lines, and the verified claims

*(Code paths are in the read-only worktree `/tmp/wt-hub/apps/web/`; corpus paths under `~/Documents/Claude/Projects/Setnayan/`.)*

**The masthead (§A):**
- `app/[slug]/_components/pahina-masthead.tsx:21-38` — `splitCoupleNames` splits on `&` / `and` regexes; single-line fallback at line 37. The sniffing defect.
- Same file, lines 79-99 — stacked names, italic gild joiner (0.42em), rule, gild date `formatEventDate`; lines 103-142 — the cover plate with the load-bearing aspect-ratio note. Lines 44, 54-56 — `eyebrow` defaults to "You are invited"; **none of the four call sites passes it** (`site-body.tsx:758, 781, 1167, 1184` — the brief's "four hero call-sites" claim verified at those lines).
- `lib/event-type-profile.ts:36-43` — `ProfileTerminology` (organizerNoun · personA/B · seatWord · eventWord · vipTierLabel); `WEDDING_PROFILE` 94-117; `GENERIC_PROFILE` 130-161 with the deliberate STD/monogram lock explained at 119-129; `TRAVEL_PROFILE` 219-233 (`seatWord:'seat'`, `eventWord:'trip'`, `multiDay:true`). `multiDay`/`event_end_date` note at 67-70.
- Seeded vocabulary: `supabase/migrations/20270221005058_seed_nonwedding_event_type_profiles.sql` + `20270731100000_seed_remaining_event_type_profiles.sql` (celebrant/graduate/organizer rows; christening `vip_tier_label:"Godparents"`).

**Profile reads by the guest tree (§F.2):** `app/[slug]/page.tsx:139, 248-249` (website surface → else vendor page), `page.tsx:552` (`phasesEnabled = isWebsitePhasesEnabled() || surfaceEnabled(profile,'website')`), `app/[slug]/_lib/loaders.ts:946-948` (seating surface → `public_venue_scene` doorway fact). `grep` of the tree finds no read of `profile.terminology` anywhere under `app/[slug]/`.

**The chapter grammar (§B):**
- `lib/invitation-widgets.ts:34-51` — the 16 `WIDGET_TYPES` (docblock at 26-33 stale, says 12); always-on = hero/greeting/qr_card/rsvp (catalog `is_always_on`, lines 84-197). Phase matrix `WIDGET_PHASES` 364-381; open-browse engine 456-660.
- Chapter numbering + ✦-vs-№ rule: `Design_Premium_Guest_Site_2026-07-25/BUILD_RESUME_2026-07-26.md:80-81`; spec §7 map in `Premium_Guest_Site_Design_Spec_2026-07-25.md:87-102`; the five-timeline matrix §11/§11a (the reskin-never-drop inventory, lines 163-201).
- Wedding copy printed to guests, sample: `site-body.tsx:818-820` ("the couple sent you"), `1015-1020` (Bride's/Groom's side — unconditional), `1548-1551` ("Wedding-day photographers"), `1367-1368` & `1447-1449` ("a day after the wedding"), `1699-1700` ("this wedding"). ~70-phrase figure from the brief; I verified the pattern, not the exact count.
- STD/monogram wedding-only lock: `lib/event-type-profile.ts:119-129`. Tea ceremony gate: `site-body.tsx:1261` (`isChineseWedding`).
- Travel itinerary machinery exists: `lib/event-type-profile.ts:211-218` (references `lib/schedule-travel.ts`).

**Navigation + the contents page (§C):**
- `app/[slug]/_lib/site-nav.ts:1-52` — the five-slot rulings (owner 2026-08-03), naming lock; `110` — the 7 `NavSlotKey`s; `169-172` — "at most five"; `31-35` — announce-features-hide-content; `295-341` — why the 3D room + money gift are cards, never tabs, and never locked; `438-524` — the no-link broadcast notice; `329-335` — the door-gated-on-destination rule.
- `app/[slug]/_components/site-menu-bar.tsx:63-117` — locked slots spoken aloud on tap; owner icon+label ruling in the docblock (10-35).
- `app/[slug]/_components/guest-doorway-strip.tsx` — the proto-directory this plan absorbs; mount + foot-of-page reasoning `site-body.tsx:1848-1881`.
- More-sheet precedent: `app/[slug]/_components/hub/hub-shell.tsx:82-92, 133-135` (`MAX_PRIMARY = 5` + overflow sheet).
- The 15 addresses: pages `app/[slug]/{,find-my-table,find-seat,hub,invite,pabuya,print,recap,seat,venue,welcome}/page.tsx` (11) + route handlers `live-wall/route.ts`, `redeem/route.ts`, `sign-out/route.ts` (3) + `seat/claim/` (1). Camera surfaces live outside the tree (`/papic/guest`, `/papic/me/[token]`) and are reached via resolver destinations (`site-body.tsx:982-986, 1772-1780`).
- One-brain-two-mouths precedent: both trees already call `resolveSiteNav` (`site-body.tsx:974, 1762`) — the contents page should be a second consumer of the same resolution.

**Art direction (§D):** `app/globals.css:2746-2778` — Candlelight is a var-block override through the one palette pipe, opt-in via `data-art`; `app/[slug]/_components/invitation-shell.tsx:34, 74, 84` — the `'daylight' | 'candlelight'` switch; host-facing control at `app/dashboard/[eventId]/website/colors/actions.ts:76-86` (Pro side per spec §8, `Premium_Guest_Site_Design_Spec_2026-07-25.md:104-118`).

**Guardrails (§E):** owner exclusion of the guest tree — `app/globals.css:2595-2599`; fail-visible motion — `globals.css:2779-2809` + `BUILD_RESUME:24-31`; functional-colour exile complete — `BUILD_RESUME:66-73` (re-ran the grep this session: still clean, one comment line); chrome-is-a-clone + reskin-never-drop — `BUILD_RESUME:106-107`, spec §11b-addendum; two pending RSVP decisions — `BUILD_RESUME:40-48`; gild-never-body-copy — `BUILD_RESUME:69-73` + the palette lock memory; keepsake fork keeps the disclosure — `site-body.tsx:1590-1660`; Live-hub chip live/post only — `site-body.tsx:838-844`.

## Appendix B — the build deltas, keyed to existing extension points

1. **Masthead grammar** — thread the resolved profile (already loaded by the page) into the masthead; split only when `personA`/`personB` exist; per-phase eyebrow template with `eventWord`; date range when `multiDay` + `event_end_date`. No schema change.
2. **Vocabulary sweep** — replace hard-coded "wedding/couple/bride/groom" strings in the guest tree with `terminology` reads; gate the side label on `personA != null`; per-type chapter-title map (the `templatePackKey` slot in the profile spine is the designed home for it — currently null for non-wedding). No schema change if titles ship as a code map keyed by `templatePackKey`/event type.
3. **Contents page** — new component in chapter № 01's tail, mounted beside the doorway strip's current mount (above the identity fork); rows resolved by extending the site-nav rules module (a `resolveEventContents()` beside `resolveSiteNav`, consuming the same inputs + `DoorwayFacts`); retire `GuestDoorwayStrip` into it (OWNER_DECISION); the broadcast sentence keeps `showBroadcastNotice` semantics.
4. **Art-direction suggestion** — one line of copy in the website colors editor for evening-shaped types. No new CSS.
5. **Tests** — the resolver extension lands under the existing site-nav test; flag-off byte-stability goldens must stay green; contrast checks in both Daylight and Candlelight for any new tinted row (mutation-check guard counts per house rules).
