# ⭐ FINAL BUILD SEQUENCE — 2026-09-29 (supersedes every table below; kept for history)

Rules this sequence obeys: Details is the one fill-in area; stages = look & motion; tap is a shortcut · no link-outs · ◆ not padlocks, "Unlock Pro and Apply" · free themes = Classic, Modern, Cyber Neon · the Maker never slow (≤100 ms per tap) · only Papic + Patiktok keep custom names · the event menu = Home · Guest list · Your Team · Event Hub Maker · Our Services · every Details piece is MOVED, not re-invented · nothing leaves a menu before its new home ships. Blueprint: `prototypes/event_hub_maker_blueprint_2026-09-29.html` (in progress) · Details prototype: `prototypes/details_themes_page_2026-09-28.html` · sequence: `prototypes/event_hub_sequence_2026-09-29.html`.

## Stage A — finish, merge as one train, deploy (Tue 29 → Wed 30 Sep)
| PR | Build | State |
|---|---|---|
| #6091 | Try Pro, pay at Apply · ◆ no padlocks · "Unlock Pro and Apply" · + Add only on stages · free-version bar | final checks |
| #6088 | Hero link + Date + photo caption editable | ready |
| #6089 | Rows arrive one by one (+ pinned scenes) | finishing |
| #6087 | Scene Upload media + parallax + video (reuses Main background) | final checks |
| — | Circle QR fills the circle (L) | final checks |
| — | Logo centred by ink · all stage fonts · snap to centre (N) | building |
| — | Preview "Back to the Maker" (M) | building |
| — | Modern + Cyber Neon free (O) | building |
| — | Maker speed: audit → fix worst → guards (P) | measuring |
| — | Renames: Pakanta→Music Maker · Samahan→Group · Alaala→Memories · Alaga→Loved ones (Q) | building |
→ one train, one CI, deploy, check cards.

## Stage B — Thu 1 Oct: THE APPLE CHECK FIRST (owner-locked)
Simulator + in-app webview run of the guest path and the Maker on the new account; fixes it finds go first.

## Stage C — Details, in five parts (after Apple; each stacked on the previous)
| Part | Scope | Moved vs new |
|---|---|---|
| 1 (K, building) | Three columns · Theme first (sample-wedding gallery, full-screen preview + Exit preview) · Address/QR · Prints & Tickets folded in (old links land on the piece) · inline text fields · tap words on the printed card | moved + small new |
| 2 | Your event (Names · Date + "Help me choose" date finder · Venues · Parents & hosts · Wedding march incl. entourage role line on the invitation) · Words · Schedule · RSVP · Love Story words · account sync · tap a fact on a stage → same field | moved + shortcut new |
| 3 | Look: Mood Board · Logo · Hero · Reveal move into the navigator (same editors); place menu = 4 stages + Details | moved |
| 4 | Seat plan in three columns (place · plan · guests), door "Guests see this now" (+1 action to switch it off), faster seating; 3D free | moved + small new |
| 5 | The guided flow (3 rounds, 19 steps, any step any time, ✓/○, Used on, What's left), round-end actions, Home "Continue" line | new (thin, reads parts 1–4) |

## Stage D — the event menu (LAST, after C)
Home · Guest list (guests, hosts, check-in) · Your Team (suppliers, budget) · Event Hub Maker · Our Services (Papic · Live Studio · Gallery incl. Editorial · Patiktok · Music Maker · SAI; Suite becomes this page) · Refer a couple → account menu. Old routes redirect.

## Stage E — after that
Per-letter styling beyond the hero (styles adapt to text edits) · "Both" view · A3 Our Story poster · STD auto-play over widget scenes · palette's illustrated person · dashboard card wears the cover · STD film replay fix · Post Event scenes · 50 new themes in batches of 10 (event types TBD).

## Open owner answers
1. Panood's plain name (recommended "Watch Live").
2. Logo Maker menu row removal (recommended yes — Logo lives in Details).
3. The 50 themes: all event types or weddings first.
4. Seat plan: OK to add the one "switch the door off" action (+1 server action).

---

# Event Hub build plan — compiled 2026-09-28 (controller)

## The model (owner, 2026-09-28 — APPROVED: "1. yes")
- **Details = the one fill-in area.** Every FACT a couple types lives here once: names, date, venues, parents/hosts, schedule, Love Story text, special message, thank-you, opening line, reply-by; plus theme, address, QR, and every print (Prints & Tickets folded in).
- **Stages = look and motion only.** Which scenes, order, backgrounds, fonts, animation.
- **Tap is a shortcut.** Tapping a fact on a stage opens the SAME Details field on the right — never a copy.
- **Design words stay with the design.** Labels that are styling, not facts (the "and" joiner, the hero link "the day, the place, the story", scene headings like "The run of show") stay editable on the part/scene.
- Measured: the hero already reads names/date/time from the event (`pahina-masthead.tsx` `txt('names', names.first…)`); only the joiner word and the hub-link word are stored per part — consistent with this model.

## In progress
| Build | Fits the model? | Change needed |
|---|---|---|
| Try Pro, pay at Apply + "free version" bar (J) | Yes | None |
| Upload media + parallax + video background (H) | Yes — look | None |
| Rows arrive one by one (I) | Yes — motion | None |
| Hero link + Date editable (G) | Yes — the link is a design word; Date is style-only | None |
| Circle QR fills the circle (L) | Yes | None |
| Details: navigator · preview · editor + theme gallery + Prints fold (K) | Becomes the fill-in area | **Scope grows** — add the fact groups (Your event, Words, Love Story, Schedule); prototype first |

## Queue (smallest first), re-checked against the model
| # | Build | Fits? | Note |
|---|---|---|---|
| 1 | Dashboard card wears the cover | Yes | Reads the hub look |
| 2 | Account details win on sync | **Merges into Details** | This IS "one source for facts" — build inside K, not separately |
| 3 | Palette's illustrated person | Yes | Mood Board |
| 4 | A3 Our Story poster | Yes | Becomes a Details print item; reads Love Story from Details — after K |
| 5 | Seat plan (map) scene | Yes | Stage scene reading the seat plan |
| 6 | STD auto-play over widget scenes | Yes | Motion |
| 7 | Per-letter styling beyond the hero | **Needs a rule** | Letter styles are stored by character position; when the words change in Details the styled letters can shift. Decide: keep styles on a word match, or clear them when the text changes |
| 8 | "Both" view | Yes | After K (canvas) |
| 9 | Post Event scenes | Yes | Its thank-you / recap words read from Details |
| + | New: tap any fact on any stage → edits the Details field | **New build** | After K; one mechanism for every scene |
| + | STD stage: back from Find your seat replays the film | Small fix | Batch with #1 |

## Open owner answers
1. "Yes" to the model above.
2. Per-letter styling when the text changes (#7).
3. Hero-photo venue caption: drop it, or make it editable.
4. Theme gallery "Suggested for you" label (recommended) or none.

## RE-SEQUENCED after the owner's "1. yes" (2026-09-28)
Absorbed (removed as separate items): **#2 Account details win on sync** and **"tap any fact on a stage"** → both become part of **Details part 2**.

| Order | Build | Why here |
|---|---|---|
| running | J Try Pro / pay at Apply · H Upload media + parallax · I Rows one by one · G Hero link + Date + venue caption · L Circle QR · **K Details part 1** (three columns, theme gallery, Prints & Tickets fold, card tap-to-edit) | — |
| next (independent, small) | Dashboard card wears the cover + STD film replay fix · Palette's illustrated person | touch nothing K touches |
| next (independent) | Seat plan (map) scene · STD auto-play over widget scenes | stage/motion only |
| after K | **Details part 2** — the fact groups (Your event · Words · Love Story · Schedule) move into Details, account sync, the stage tap shortcut · A3 Our Story poster (a new print item) · "Both" view | need K's navigator/canvas |
| after Details part 2 | Per-letter styling beyond the hero (styles ADAPT to text edits) · Post Event scenes | read words from Details |

## OPTION B CHOSEN (owner 2026-09-28: "B. maximize this concept…") — Details build now in THREE parts
| Part | Scope | Builder |
|---|---|---|
| 1 (running) | Three-column Details · Theme gallery (sample) + full-screen preview with "Exit preview" · Address/QR · Prints & Tickets fold · inline text fields · card tap-to-edit | K |
| 2 (stacked on 1) | Your event · Words · Schedule · RSVP settings · Love Story words · account sync · stage tap-shortcut | new, after K's skeleton |
| 3 (stacked on 1) | Logo · Hero · Reveal · Love Story layout move into the navigator (same editors); place menu = 4 stages + Details; old page links redirect | new, after K's skeleton |
| 3b | "Easier to find everything": done / not-yet mark + "used on" per item, and what's left at a glance | with part 2 |
| 4 | **Seat plan in Details** — three columns (place elements · plan · guests), reusing the seating editor's logic whole; prototype first | after parts 2–3 |
| 5 | Mood Board moves into Details › Look (same editor, supplier side unchanged) · event menu drops Schedule, Mood Board, Seat plan rows (LAST, after their homes ship) · old routes → Details items | after parts 2–4 |
