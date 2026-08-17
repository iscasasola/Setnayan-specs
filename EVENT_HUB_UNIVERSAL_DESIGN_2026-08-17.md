# The Event Hub for every kind of event — the written half

**Date:** 2026-08-17 · **Status:** DESIGN DOCUMENT ONLY — the drawings are being produced separately (`prototypes/event_hub_universal_2026-08-17.html`, not by this document's author). No code changes.
**Owner's ask:** *"a universal design that can apply to all types of event… able to easily access all the different parts of the event hub."*
**Owner's ruling, applied throughout:** *"there are parts that is dedicated for weddings but there are parts that should also work for non wedding/other events."*
**Method:** every claim below was verified by opening the shipped file; paths and lines are in Appendix A. Where my measurements disagree with the briefing, I say so — including two places the briefing's numbers are too low.

---

## 1 · The three corrections, checked — and two counter-corrections

**Correction 1 — the sixteen types: CONFIRMED.** The roster in the code and its seed data is exactly: anniversary · birthday · celebration · christening · corporate · date · debut · gala_night · gender_reveal · graduation · hangout · reunion · simple_event · tournament · travel · wedding. There is **no funeral and no baptism** anywhere in the vocabulary, its migrations, or the app. So no page can today "call a grieving family a couple" — that scenario cannot occur. Worth adding: **christening already covers the baptism occasion in practice** (a family creating a baptism today would pick it); **funeral has no near neighbour at all**. Whether funeral (and a separately-named baptism) become types is an `OWNER_DECISION` — and an add-an-event-type checklist already exists in the project's notes, so the mechanical cost of saying yes is known and small.

**Correction 2 — the word count: CONFIRMED IN SHAPE, and the tail is slightly bigger than measured.** I re-enumerated every wedding word a guest can actually read (visible text and screen-reader labels; comments and code excluded). My count is **~79, not 68** — same conclusion, more concentrated evidence: roughly **7 in 10 sit on the event page**, and the whole job is words, not structure. The deltas, with lines in Appendix A, all in the direction of *more* words than the briefing found:

- **The Live hub is not 0 — it is 4.** "The couple will assign seats closer to the day" · "straight to the couple" · "The couple hasn't published the program yet" · "lands in the couple's gallery" — all guest-visible on the hub's panels.
- **Welcome is not 0 — it is 1** ("…in the couple's guest list…" on the +1's name-confirmation screen).
- Seat reads 3 (not 2), find-seat and find-my-table 2 each (not 1) — the extras are alternate empty-states a guest can reach.

None of this weakens the briefing's point; it strengthens it. The full word map is §B.

**Correction 3 — the "shared shell": CONFIRMED VERBATIM.** The layout file wrapping all the rooms is one `<div>` with `display: contents`; its own docblock says *"Purely a CSS-variable scope — zero behavior."* It swaps fonts to the editorial faces and provides no chrome, no navigation, no header. And the hand-copying is real: find-seat's chrome carries the comment *"mirrors find-my-table's"*. The rooms share typography and nothing else. No claim of a shared shell appears anywhere in this document, and no shell rebuild is scoped off it.

**The navigation finding — CONFIRMED, by an independent route.** The bottom bar is imported by exactly one file: the event page's body. None of the eleven sub-rooms mounts it. Every sub-room's outbound links, sampled room by room, either point only back to the event page (seat · find-seat · find-my-table · venue · gifts · recap) or don't exist (welcome · invite · print). It is a hub-and-spoke with no rim: a guest on their seat screen genuinely cannot reach directions or the gifts without going back and starting again. This is context for the drawings; no chrome is designed here.

---

## A · THE GRID — which rooms exist for which kind of event

**`OWNER_DECISION` — this whole table.** It is a filled-in proposal so the owner corrects a recommendation instead of facing a blank. ✓ = the room exists for that type by default (its own honesty gates still apply — a seat room with no published plan still shows its "not posted yet" state). — = the room does not exist for that type: not greyed out, simply absent, exactly as the owner ruled for wedding-dedicated parts.

The 13 rooms: the **event page** · **welcome** (a +1 confirms their name) · **invite** (join this event) · **redeem** (the QR door) · **seat** (your seat pass) · **find-seat** (type your name) · **find-my-table** (the table map) · **3D venue walk** · **gifts** (the digital money dance) · **Live hub** · **live wall feed** · **recap** · **print** (the keepsake sheet).

| | event page | welcome | invite | redeem | seat | find-seat | find-my-table | 3D venue | gifts | Live hub | live wall | recap | print |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **wedding** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **anniversary** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **birthday** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **debut** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **christening** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **gender_reveal** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **graduation** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **celebration** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **reunion** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **corporate** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| **gala_night** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* | ✓ | ✓ | ✓ | ✓ |
| **tournament** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| **travel** | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | ✓ | ✓ |
| **date** | ✓ | — | ✓ | ✓ | — | — | — | — | — | — | — | ✓ | ✓ |
| **hangout** | ✓ | — | ✓ | ✓ | — | — | — | — | — | — | — | ✓ | ✓ |
| **simple_event** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | — | — |

**Justifications, only where the row is not obvious:**

- **travel** — the four seat rooms and the 3D walk model a *banquet floor*; a trip's "seats" are on transport and its venues change daily, so those rooms would always show their apology state. The Live hub's clock is built around one venue day; a five-day roaming trip fits it badly. But the **recap and print keepsake are the trip's best rooms** — a trip is the type where "the photos are the product" is most true. (The type's own profile already says roaming + multi-day; this row follows it.)
- **date · hangout** — deliberately the lightest rows. These are small, casual kinds; a seat map, money dance or live command hub would be machinery around a dinner. The invite link and QR door stay (that *is* how the other person or the barkada joins); welcome (+1 confirmation) is off because there is no formal guest list to confirm into. Recap and print stay — a printed keepsake of a first date is exactly the kind of object this product is loved for.
- **tournament** — seating ✓ (awards dinners and spectator tables are real), gifts — (nobody pins cash on a bracket). The programme on its event page is the fixture list; no new feature needed.
- **corporate** — gifts off: a cash-gift room on a company event reads as a compliance problem, not a delight.
- **gala_night** — gifts **✓\*** with re-worded copy: a gala's money moment is donation-shaped ("support the cause"), not "pin your cash on the couple". Same room, different words — bucket 2 exactly.
- **simple_event** — its recorded purpose is a vendor-free container for the in-app services, and its profile already enables seating, day-of and gallery. Recap/print off keeps it the utility type it was designed to be.
- **redeem ✓ everywhere** — it is a door, not a room; wherever any invitation QR can exist, the door must answer.

---

## B · THE WORD MAP — every wedding word a guest reads, bucketed

Buckets, per the owner's ruling: **(1) wedding by nature** — keep the words exactly, hide the part for other types · **(2) universal job wearing wedding clothes** — the part stays everywhere, the words take the event type's own vocabulary · **(3) sample/demo content** — not real copy.

**Finding on bucket 3 first, said plainly: among the words a guest actually READS, bucket 3 is empty.** The sample-wedding material that inflates the raw source counts lives in database rows and comments, not in rendered strings. Every guest-read wedding word is a 1 or a 2. The distribution of my ~79: **10 are bucket 1 · 69 are bucket 2.** So the visible job is overwhelmingly a wording job — and the ten bucket-1 words are the ones that must NOT be re-worded, only correctly hidden elsewhere (today, several would leak onto non-wedding pages; see §C).

### Bucket 1 — wedding by nature (10 reads; keep verbatim; absent for other types)

| Where a guest meets it | The words | Note |
|---|---|---|
| The greeting's side line (event page) | "Bride's side" / "Groom's side" | 2 reads. Prints today for ANY type whose guest has a side value — needs the §C gate, not a rewrite. |
| The tea-ceremony card (event page) | "The couple kneels… the groom's side first, then the bride's…" | 3 reads. Already correctly gated to Chinese weddings — the model bucket-1 part. |
| The Save-the-Date film (event page, far out) | "are getting married" | 1 read. The film itself is wedding-dedicated and currently calendar-driven for every type — the §C leak. |
| The calendar entry the Save-the-Date mints | the event lands in the guest's phone calendar as a wedding | 1 read. Travels with the film. |
| The recap's song credit + the print sheet's | "· their wedding song" (text + its spoken label, and once on print) | 3 reads. The owner has already named the song credit wedding-dedicated. |

### Bucket 2 — universal jobs wearing wedding clothes (69 reads; the words take the type's own vocabulary)

Grouped by room. "couple" → the type's organizer noun (celebrant's family · graduate · organizers — already in the database for all 16); "wedding" → the type's event word (birthday · graduation · trip — likewise).

**The event page (~54 reads — the concentration is real):**

| Cluster | The phrases (reads) |
|---|---|
| Stranger & lock copy | "…open the link **the couple** sent you" · "This **wedding's** page is private" · "Only **the couple's** guests…" · "…the personal link **the couple** sent you" (4) |
| The QR card | "**Wedding-day** photographers will scan it…" (1) |
| Photos, faces, consent | "The **couple's** photos will appear here" · "face recognition at this **wedding**" · "**couple's** photographers can find your candid shots" · "So the **couple** recognizes you…" · "…after the **wedding**" · "so the **couple** and their team can recognise me" · "…so the **couple** and their…" (selfie ask) · "the **couple** is tagged for you automatically" · "photo guidance closer to the **wedding**" · "The **couple** has kept it off phones" (10) |
| The photo grace window | "These close about a day after the **wedding**" · "The guest view winds down about a day after the **wedding**" (2) |
| Day-of chrome | "The **wedding** is happening…" · "The **wedding** wrapped up… as the **couple**…" (2 words) · "these times are the **couple's** plan" · "The **couple** will assign seats closer to the date" (5) |
| Reply, notes, columns | "A note to the **couple**" · "for the **couple's** paper" ·  "the **couple** reads and approves every column" · "Your column is with the **couple** for review" · "The **couple** returned your column" · "Your words for the **couple's** paper…" · "…until the **couple** approves them" · "approved by the **couple**" (8) |
| Greetings & gifts doors | "Leave the **couple** a video greeting" · "The **couple** will…" · "on its way to the **couple**" · "straight to the **couple**" (4) |
| +1 & account | "…which the **couple** hasn't enabled for +1s on this **wedding**" (2 words) · "for this **wedding**, you're invited as their +1" · "shoot candids for the **couple**" (4) |
| Dress code | "…the **wedding**." (1) |
| The recap takeover (renders on this page after the day) | headline formula "…**Are Married**" · "From the **Couple**" · "This **wedding's** story isn't available yet" · "The **Wedding** Day (Live)" (×2) · picture labels "from the **wedding**" (×2) · "Captured by the **couple's** vendors" · "columns from the guests, approved by the **couple**" · sign-off "your **wedding**, handled" (10) |

Note on "…Are Married": the *formula* is bucket 2 (a graduation's headline is "…Graduates"), but the wedding's own instance keeps its exact words — re-wording it FOR WEDDINGS would violate the owner's ruling from the other side.

**The sub-rooms (~15 reads):**

| Room | The phrases (reads) |
|---|---|
| Live hub (4) | "The **couple** will assign seats closer to the day" · "straight to the **couple**" · "The **couple** hasn't published the program yet" · "lands in the **couple's** gallery" |
| Seat (3) | "Once the **couple** posts the seating…" · "The **couple** is still arranging the venue layout" · "Once the **couple** seats…" |
| Gifts (2–3) | "Pin your cash on the **couple**" · the fallback name "the **couple**" (used twice when the event has no display name) |
| Find-my-table (2) | "The **couple** is still arranging the venue layout" · "Once the **couple** seats…" |
| Find-seat (2) | "The **couple** hasn't published the seating plan" · "as the **couple** would have listed it" |
| Print (3 of its 4) | headline "…**Are Married**" · picture label "from the **wedding**" · "From the **Couple**" (the 4th is the bucket-1 song credit) |
| Recap page shell (1–2) | "hasn't published their **wedding** recap" (+ the page's browser-tab description) |
| Welcome (1) | "…on your invitation, in the **couple's** guest list…" |
| Venue 3D · invite | 0 — clean. |

**One encouraging discovery inside the recap:** it already contains a tiny hand-made version of this fix — one line that says *"if this event is not a wedding, say 'event' instead of 'wedding'"*. It proves the need was real enough that someone patched it locally — and it is a third, hand-typed vocabulary that §C's mechanism must absorb, because hand-typed word lists drifting from the managed one is a disease this project has already named.

---

## C · WHAT THE VOCABULARY MECHANISM CAN AND CANNOT DO

Both mechanisms named in the retask exist and are populated for all sixteen types. They are different organs, and neither can do the one thing this plan most needs.

**1 · The roster (`event_type_vocab`) — "which kinds of event exist."** Admin-managed, grows with zero deploys (16 kinds today, 9 before mid-June). Carries each kind's key, label, emoji, ordering and enabled flags. **This is the one the marketplace reads**: the browse page's kind-of-event filter validates against this live table and applies it to supplier profiles, and the search module's own docblock warns that any hardcoded second list would drift from it. It knows nothing about wording inside an event and nothing about blocks.

**2 · The wording spine (`event_type_profiles.terminology`) — "what this kind calls things."** Organizer noun, the two principals (or none), seat word, event word, VIP-tier label — populated for all sixteen. Its readers today are the dashboard and onboarding side: the create flow, Setnayan AI, Pakanta, the Papic studio, the admin profile editor. **Zero readers anywhere in the guest tree.** Every bucket-2 word in §B should come from here; the plumbing that loads the profile already reaches the guest page (it is consulted for two other questions), so threading the words is genuinely small.

**3 · What NEITHER can do — and it must be named: per-block gating does not exist.** Measured three ways:

- The profile can switch off nine **whole surfaces** (website, save-the-date, RSVP, seating, budget, schedule, monogram, day-of, gallery). The guest page consults exactly **two** of them: "may this event have a page at all" and "does this kind seat people". The other seven answers are recorded and never read.
- Every event of every type is seeded with **all 16 content blocks**, type-blind, and the resolver that decides what renders never reads the event type at all.
- The only per-block, per-kind gates in the entire guest tree are **hand-written specials**: the tea-ceremony card's Chinese-wedding check, and the recap's one-line wedding/event word patch.

**Two live consequences, one of them the plan's sharpest finding:** the profile deliberately locks the Save-the-Date and monogram surfaces OFF for non-weddings — and because the guest page never asks, **a non-wedding created more than ~3 months out would render the wedding Save-the-Date machinery anyway** (it is driven purely by the calendar), and a type with no monogram gets a wedding-style lettered medallion as the hero mark (the fallback derives initials from the event's name).

**So the largest single piece of engineering in this plan is the per-block gate**, and the owner should hear it named: one table — each block, and which facts about the event's kind it requires (has two principals · is a wedding · has the ceremony · seats people) — consulted at the one point both the stranger's and the guest's page already share. The repo already contains this exact table shape twice (the block-by-lifecycle-phase matrix and the block-spotlight matrix, both built so that forgetting an entry is a build error rather than a silent leak), so it is a known pattern, not an invention. Registering the Save-the-Date film, the monogram fallback, the side labels, the love story and the song credit in it closes today's leaks — and makes the *next* wedding-dedicated feature a one-row addition instead of a scattered conditional. The grid in §A is, mechanically, this table plus the room list.

---

## D · WHAT NOT TO CHANGE — with the reason each decision exists

0. **The wedding is never flattened.** Bucket-1 parts keep their wedding words and forms untouched; the sort hides them elsewhere, it never rewrites them. (Owner, 2026-08-17.)
1. **The five-slot bottom bar and its rules engine.** Owner-locked shape; the recorded reasoning calls a sixth tab "a redesign of an owner-locked shape," and every slot rule lives in one tested place so the next person changes a decision, not a layout.
2. **Announce features, hide content.** A locked camera is drawn with its reason (a camera is a promise of the invitation); a gallery with nothing public is not drawn at all (a greyed one would reveal that photos exist and are being withheld). The grid's "—" cells follow the same logic: absent, never greyed.
3. **The couple's camera is unconditional; everyone else's is the host's switch** — closed means visibly locked with a spoken reason, never missing.
4. **Watch never displaces the Gallery** — on the day a guest needs both.
5. **Doors are gated on what the destination itself demands** — the recorded rule that an invisible page beats a visible dead end; every grid ✓ still sits behind it.
6. **The streaming notice carries no link before the day** — a link saved weeks ahead cannot be known to be open; the only safe promise is about the page the reader already has.
7. **The Pahina editorial decisions** — the typographic masthead with the photo demoted to a cover plate; motion that fails visible; the functional-colour exile (re-verified clean this session); numbered chapters for the magazine, starred plates for the guest's personal layer.
8. **The guest tree stays excluded from the app-wide Atelier reskin** (owner exclusion, 2026-07-12) — and the type-scope wrapper that implements it is *all* the rooms share, so it must survive untouched.
9. **Chrome is a clone** — the bars reskin by palette-token substitution only; the icon-above-label bar is a later owner ruling than the older text-tab spec, so neither direction may be "corrected".
10. **Reskin, never drop** — the full element inventory is the acceptance checklist; the RSVPed keepsake keeps its "Need to change your reply?" disclosure until the owner rules.
11. **The two pending RSVP owner decisions stay pending** (option wording; whether the ask disappears after replying). The keepsake and "Are Married"-formula wording of §B fold into them — decide once.
12. **The Save-the-Date film, reveal and monogram stay wedding-dedicated** — the recorded deliberate lock. §C *enforces* it (closing the leak); nothing here reopens it.
13. **The Event Hub vocabulary lock** (Event Hub · Live hub · Event Hub Pro) — used, never reopened.
14. **The palette lock** — cream `#FDFBF7` · ink `#2C2A29` · action terracotta `#C24E25` · link `#3B4E67`; **gold `#A9834B` decorative only, never body copy or a link** (3.37:1 on cream); the repo's gold/terracotta slot-name swap is real, and any new tinted element is measured in both the light and Candlelight faces.
15. **One vocabulary, never three.** The admin-managed roster is the only list of kinds; the profile's terminology is the only source of words. The recap's hand-typed patch (§B) gets absorbed, and no new hand-typed word list may be born — a second vocabulary drifting from the managed one is a disease this project has already paid for.

---

## Appendix A — evidence (paths in the read-only worktree `/tmp/wt-hub/apps/web/`)

**§1 corrections:**
- 16 types, no funeral/baptism: `lib/papic-event-access.ts:36` ("All 16 rows of `public.event_type_vocab` are status='active'"); seeds `supabase/migrations/20261205000000_event_type_vocab_dynamic.sql` + `20261229000000_event_type_vocab_add_gala_night.sql` + `20270731100000_seed_remaining_event_type_profiles.sql`; grep for `funeral|baptism` across `lib/`, `app/`, and all vocab migrations: zero hits. gala_night/date/hangout existence: `lib/event-type-coverage.test.ts:10-14`, `lib/event-type-search.test.ts:43`.
- Layout not a shell: `app/[slug]/layout.tsx` (entire file — `display: contents`, docblock "Purely a CSS-variable scope — zero behavior"). Hand-copied chrome: `app/[slug]/find-seat/page.tsx:119` ("mirrors find-my-table's").
- Navigation: `SiteMenuBar` imported only by `app/[slug]/_components/site-body.tsx` (repo-wide grep, 2 hits incl. its own file). Sub-room links: `recap/page.tsx:124`, `venue/page.tsx:186,202,215`, `pabuya/page.tsx:107`, `find-seat/page.tsx:107,136`, `find-my-table/page.tsx:174,224` — all `/${slug}` only; `welcome/`, `invite/`, `print/page.tsx` — no outbound `href` hits.

**§B word map (guest-visible lines; the counter-corrected rooms first):**
- Live hub = 4: `app/[slug]/hub/page.tsx:602, 663, 691, 739`. Welcome = 1: `welcome/page.tsx:121`. Seat = 3: `seat/page.tsx:309, 346, 403`. Find-seat = 2: `find-seat/page.tsx:101` + `find-seat/_components/name-search.tsx:112`. Find-my-table = 2: `find-my-table/page.tsx:120, 167`. Gifts: `pabuya/page.tsx:101, 125, 134`. Print: `print/page.tsx:132`, `print/print-sheet.tsx:191, 357, 371`. Recap shell: `recap/page.tsx:120` (+ the `recapNoun` hand patch at `recap/page.tsx:65`).
- Event page, bucket 1: sides `site-body.tsx:1019-1020`; tea card `tea-ceremony-card.tsx:26` (gate `site-body.tsx:1261`); STD film `save-the-date-film.tsx:506`; calendar `save-the-date.tsx:123-127` (`buildWeddingIcs`, uid `wedding-…`); song credit `editorial/editorial-content.tsx:1064, 1074` + `print/print-sheet.tsx:371`.
- Event page, bucket 2 (sample of the 54): `site-body.tsx:819, 1367, 1447, 1548, 1699-1700`; `rsvp-widget.tsx:151`; `guest-column-card.tsx:134-135`; `guest-column-form.tsx:123, 159, 203, 217, 275`; `pabati-prompt.tsx:252, 294, 334`; `guest-doorway-strip.tsx:81`; `empty-states.tsx:25`; `face-data-notice.tsx:20-21`; `selfie-capture.tsx:412-413, 481`; `day-of-face-enroll.tsx:100`; `your-photos-widget.tsx:41`; `photo-moments-widget.tsx:59`; `live-wall-block.tsx:168`; `day-of-banner.tsx:20, 38`; `schedule-widget.tsx:193`; `guest-hub-card.tsx:331`; `dress-code-widget.tsx:124`; `tier-comparison-widget.tsx:17, 84`; `private-landing.tsx:76, 79, 85`; recap takeover `editorial/editorial-content.tsx:93, 402, 482, 516, 570, 635, 644, 909, 1125, 1490`.
- Methodology: grep of `wedding|couple|bride|groom|newlywed|married` (case-insensitive) across `app/[slug]/**/*.tsx`, comment lines excluded, then hand-filtered to rendered strings and aria/alt labels. Raw candidate lines 149; guest-read ~79. Bucket 3 empty among read words — the sample/demo material is DB rows and comments, not rendered strings.

**§C mechanism:**
- Roster: table + reader `lib/event-types-db.ts:5, 67-71` (`getEventTypeVocab`, public read / admin write); the marketplace consumes it — `lib/event-type-search.ts:1-50` docblock (filter `?event_type=` validated against live vocab, applied `event_types @> [key]` on vendor_profiles; "a hardcoded list here would be a SECOND vocabulary"). Admin writes `lib/event-types-mutations.ts`.
- Wording spine: `lib/event-type-profile.ts:36-43` (shape), seeds `supabase/migrations/20270221005058` + `20270731100000`. Readers (all dashboard/onboarding side): `app/onboarding/[type]/page.tsx:107-122`, `app/dashboard/[eventId]/studio/setnayan-ai/page.tsx:93-97`, `studio/pakanta/page.tsx:122`, `studio/papic/page.tsx:317`, `lib/setnayan-ai-notify.ts:165-166`, `lib/onboarding/services-step-server.ts:93`, `app/admin/event-types/[eventType]/profile/page.tsx:90`. Guest-tree readers of `.terminology`: none (repo grep).
- Surface gating consulted by the guest tree: `app/[slug]/page.tsx:139, 248-249` (`'website'`), `app/[slug]/_lib/loaders.ts:946-948` (`'seating'`); the nine-surface list `lib/event-type-profile.ts:25-34, 81-91`.
- Per-block gating absent: type-blind 16-block seed `supabase/migrations/20260607030000_invitation_widgets.sql:227-287` + `20270919679722`; `lib/site-body-plan.ts` — zero profile/event_type reads (grep count 0). Hand-written specials: `site-body.tsx:1261` (tea), `recap/page.tsx:65` (recapNoun ternary).
- The leak: `page.tsx:635` (`stdFilm = search.film !== '0'` — no type gate); STD body branch selected by the date-driven lifecycle (`lib/invitation-widgets.ts:428-454`) inside the type-blind plan; profile's OFF answers (`event-type-profile.ts:119-129`) read nowhere in the tree. Monogram fallback: `resolveMonogram` from event columns (`site-body.tsx:216-224`) mounted in every hero.
- The precedent table shape: `lib/invitation-widgets.ts:364-381` (`WIDGET_PHASES`) and `487-506` (`WIDGET_SPOTLIGHT`) — compile-time-exhaustive `Record<WidgetType, …>`.

**§D guardrails:** five-slot rulings `app/[slug]/_lib/site-nav.ts:1-52, 169-172`; announce/hide `site-nav.ts:31-35, 337-340`; camera rules `site-nav.ts:14-24, 211-239`; Watch slot `site-nav.ts:37-39, 189-196`; destination-gated doors `site-nav.ts:329-335`; no-link broadcast `site-nav.ts:438-524`; Pahina decisions `Design_Premium_Guest_Site_2026-07-25/BUILD_RESUME_2026-07-26.md:24-31, 66-73, 106-107` + `app/globals.css:2779-2809`; owner exclusion `app/globals.css:2595-2599` + `app/[slug]/layout.tsx`; pending RSVP decisions `BUILD_RESUME:40-48`; keepsake disclosure `site-body.tsx:1590-1660`; STD/monogram lock `lib/event-type-profile.ts:119-129`; palette + two-golds locks per the project's design memory (`project_setnayan_palette_lock_terracotta`, `project_setnayan_two_golds_two_rules`); Live-hub chip live/post only `site-body.tsx:838-844`.
