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
