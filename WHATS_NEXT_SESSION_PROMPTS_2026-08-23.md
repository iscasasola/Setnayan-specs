# SESSION PROMPTS — 2026-08-23

Ready to paste. One block per session, in wave order, from
[`WHATS_NEXT_EXECUTION_PLAN_2026-08-23.md`](WHATS_NEXT_EXECUTION_PLAN_2026-08-23.md).

**How to use it:** paste **§ 0 (the shared header) first**, then the session's own prompt under it.
The header is what stops a session rebuilding shipped work, reading a stale tree, or clobbering
another session — it is not boilerplate.

🔴 **Never run more than three at once, and only ever sessions from the SAME wave.** The
no-collision guarantee is per wave; two sessions from different waves may own the same files.

▶ **Every prompt is written to RUN TO THE END.** The header carries a standing continuity clause —
the session finishes its whole list, decides its own way past blocked checks and conflicts, and
reports once at the end. It stops only at an item explicitly marked OWNER DECISION. **You should
not have to answer anything mid-session.**

| session | model | effort | wave |
|---|---|---|---|
| W0 · PR triage and land | Opus 5 | high | 0 — alone |
| W1-A · A finished event tells the truth | Opus 5 | medium | 1 |
| W1-B · Retire Pabati, let the buy pages sell | Opus 5 | **xhigh** | 1 |
| W1-C · Make the paperwork true | Sonnet 5 | medium | 1 |
| W2-A · A guest can keep their code | Opus 5 | high | 2 |
| W2-B · Delete what we said we would delete | Opus 5 | **xhigh** | 2 |
| W2-C1 · The gold nobody can read | Sonnet 5 | medium | 2 |
| W2-C2 · Ninety-five admin routes, one shape | Opus 5 | high | 2 (after C1) |
| W3-A · "You have none" must mean none | Opus 5 | high | 3 |
| W3-B · A supplier's card earns its keep | Opus 5 | high | 3 |
| W3-C · A wake is not a celebration | Opus 5 (+ Fable for the words) | high | 3 |
| W4-A · The four screens a couple lives in | Opus 5 → Sonnet 5 | medium | 4 |
| W4-B · Sixty-three supplier screens | Opus 5 → Sonnet 5 | medium | 4 |
| W4-C · Shut the doors nobody uses | Opus 5 | **xhigh** | 4 |
| W5-A · A supplier's record survives a delete | Opus 5 | **max** | 5 |
| W5-B · The surfaces nobody drew | Fable → Opus 5 | medium | 5 |
| W5-C · Who is in my event? | Opus 5 | medium | 5 |
| W6 · The grab-bag, verified first | Fable → Sonnet 5 | medium | 6 — alone |

---

## § 0b · THE APPLE-INVITES ITEMS — twelve, and where each one landed

**Where they came from.** The owner said **Apple Invites** looks similar to Setnayan. A session
compared the two products, then measured our **live signed-in UI** at phone and laptop widths
against `origin/main` @ `09697145d` — the same tip wave 0 finished on. Its deliverable was an
artifact, not code; nothing was committed. **It is not "Apple Live"** — that phrase was never used
in it.

⛔ **THREE THINGS IT FIRST REPORTED AND THEN DISPROVED ITSELF. DO NOT BUILD ANY OF THEM.**
- **The photo event card with fallbacks ALREADY SHIPS** — `(launcher)/_components/event-scene.tsx`,
  precedence: the couple's own hero → a per-type stock photo → a deterministic branded gradient.
  ✅ **I re-checked: the file is there and `grep -c "sm:\|md:\|lg:"` returns 0**, so it does not
  branch on viewport. The first-pass finding "mobile has no photo card, build one" is FALSE.
- **The phone/laptop split is DELIBERATE and comes from an approved prototype** — `MobileEventHero`
  + `MobileEventChip` under `sm:hidden`, the desktop grid under `hidden sm:grid`, with the
  prototype's own class names cited in the comment. **Changing it is a design reversal, not a fix.**
- **`#8C6932` is NOT off-palette.** ✅ Re-checked: `app/globals.css:154` defines it as
  `--color-terracotta-700`, documented at 5.02:1 AA. The "front door breaks the colour lock"
  finding is FALSE.
- Co-hosting ships (`app/host/accept` exists); Apple only added theirs in June 2026.

🛑 **AP-2 AND AP-5 ARE WITHDRAWN. BOTH WOULD HAVE REVERSED AN OWNER LOCK — AND MY OWN FIRST
CORRECTION OF AP-2 WAS ALSO WRONG.**

I first wrote that the app *does* set a typeface and that some surface must be losing the variable.
Closer, still not the cause. **Read it yourself:**
```bash
git show origin/main:apps/web/app/_components/frontdoor/front-door.css | sed -n '18,36p'
```
That docblock is headed **"WHAT IS LOCKED HERE (owner 2026-08-11, this page only)"** and lists,
verbatim: **gold `#8C6932` action buttons with cream labels — measured 4.86:1** · **the SYSTEM
typeface, not the app's serif** · cream `#FDFBF7` page, ink `#2C2A29`. Line ~73 authors it
explicitly: `--fd-sys: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, …`.

So the front door is **not** losing a variable and is **not** missing a typeface. It wears a
deliberately authored system stack **because the owner chose it**, and its gold buttons are the
locked treatment. *"Settle on one strength of the action colour, front door included"* is a
reversal of an owner decision wearing the clothes of a consistency fix.

🔑 **THE LESSON IS WORTH MORE THAN BOTH ITEMS: THAT SESSION MEASURED THE FRONT DOOR AND SAID "THE
APP".** The front door is **the single page in this product with its own owner-locked visual
identity** — the worst possible sample to generalise from. Its "5 on-brand vs 133 fallback" tally
was the lock working correctly, read as a defect. **Anything sourced from a front-door reading must
be re-scoped to say "front door", or re-measured on a real app surface.**

🔒 **AND CARRY THIS, FROM THE SAME DOCBLOCK:** under `[data-chrome='app']` the front door's
page-level declarations — background, colour, typeface — are **UNSET on purpose**, so it lends
CHROME and never page styling. **"Which typeface does shared chrome wear" is an OPEN OWNER
DECISION** (`ONE_SHELL_PLAN_2026-08-13.md` §5.3). The file says letting an inherited `font-family`
leak onto ~15 pages *"would have decided it silently, which is how this project has twice ended up
with a lock nobody remembers agreeing to."* **Do not decide it by accident.**

⏭ **WHAT SURVIVES IS A MEASUREMENT, NOT A BUILD.** Nobody has ever tallied the computed
`font-family` on an **app** surface. That measurement now opens W4-A (see its prompt); a build is
opened only if the app itself is falling back. AP-5 leaves nothing behind on the front door; whether
the app's own primary buttons are internally inconsistent is a **separate, unmeasured** claim — two
were observed and both were terracotta.

### Where the twelve landed

| id | what a person gets | goes to | why there |
|---|---|---|---|
| AP-1 | the bottom bar stops vanishing when you tap People or Spaces | **W1-A** | `HomePillNav` is rendered in exactly ONE place — `(launcher)/page.tsx:1455` — which is W1-A's file. The fix lifts it to a layout. |
| AP-6 | no name is cut to "Y…" on a phone | **W1-A** | same file |
| AP-7 | Home and the event page report the same "planned" figure | **W1-A** | `(launcher)/page.tsx` + `lib/progress-stages.ts`, both already W1-A's — and W1-A is already inside `progress-stages.ts` for the After stub |
| ~~AP-8~~ | ~~section names that don't need a help button~~ | 🛑 **WITHDRAWN WHOLE** | both halves reverse the owner's own 2026-08-21 decisions; one re-does something he reverted the next day. |
| AP-4 | the couple's photo appears on the card shared in Messenger | **W1-A** | `app/api/og/realstory-slug/[slug]/` — owned by nobody; small, and W1-A is the light session |
| ~~AP-2~~ | ~~the app stops falling back to the phone's default typeface~~ | 🛑 **WITHDRAWN** | reverses the owner's 2026-08-11 front-door lock. What survives is a measurement, opening **W4-A**. |
| ~~AP-5~~ | ~~one strength of the action colour everywhere~~ | 🛑 **WITHDRAWN** | the gold front-door buttons ARE the locked treatment. Nothing left on the front door. |
| AP-3 | the invitation reads like an invitation, not a receipt | **W2-A** | `app/[slug]/**` is W2-A's territory |
| AP-9 | guests see the weather for the day | **W2-A** | same territory ⚠ needs a forecast provider chosen — that is a cost/dependency call, flag it |
| AP-10 | guests get a map instead of a line of text | **W2-A** | same territory ⚠ **the CSP change in `next.config.ts` MUST be in the same PR** — our own CSP has already blocked our own map once, and the only symptom was an empty grey panel |
| AP-11 | the couple gets a first draft of their invitation words | **W5-C** | touches `dashboard/[eventId]/website/**` and the AI surface — both collide with wave 1 and wave 3 territory, so it waits |
| AP-12 | empty screens look deliberate, not unfinished | **W6** | deliberately broad; W6 runs ALONE and may claim any file. Pattern source: `(account)/samahan`, which that session called the best-designed screen it saw |

⚠ **AP-1 MUST BE VERIFIED BY SCREENSHOT, NOT BY QUERYING THE PAGE.** That session nearly filed a
false "empty nav bar" finding off a DOM probe whose selector matched the wrong element and returned
**the same result on a page where the bar is plainly visible**. Only the control test caught it.

### 🛑 AP-8 IS WITHDRAWN WHOLE — nothing survives it, not even a measurement

**Verified in `DECISION_LOG.md`, row 2026-08-21 (PR #4678), by reading it — both halves reverse a
decision the owner made himself.**

- **"Rename Untold and Told."** That row is headed **"Two naming calls he made in session, do NOT
  re-open"** and records, verbatim, that *Finished/Completed* → **Untold/Told** *"because those two
  are near-synonyms sitting side by side and neither should ever describe the CELEBRATION"*, with
  the key line: **the two words are about the STORY, not the day.** The complaint was that they
  need explaining. **That is the point of them**, and he chose them over the obvious alternative
  deliberately.
- **"Delete the five circled (i) buttons."** Same row, verbatim: **"⚠ THE (i) IS BACK ONE DAY AFTER
  IT WAS RETIRED, per shelf, at the owner's request."** They were removed once; he asked for them
  back the next day. **This item proposes removing them again.** The objection raised against them
  is also already answered by construction — the label renders a circle only where a sentence was
  passed, so the empty-circle case that killed the previous attempt cannot occur.

⛔ **DO NOT REINSTATE THIS ITEM.** If it looks like a fresh idea to you, it is because it looked
like one to the last two people as well. The row is `DECISION_LOG.md` 2026-08-21.

### 🔑 THE STANDING CHECK THIS STREAM EARNED — run it before scheduling ANY item from a UI observation

**Six findings from that comparison were wrong, and all six failed in the same direction: proposing
to undo something somebody had already chosen.** The mobile photo card · the palette "break" · the
front-door typeface · the front-door colour · and both halves of AP-8. **The tell never varied — it
found something that looked obviously wrong and did not ask whether it had been decided.**

```bash
grep -n "<the noun on the screen>" ~/Documents/Claude/Projects/Setnayan/DECISION_LOG.md
```

**Five of the six would have died at that grep, in seconds.** Run it before you write a brief from
anything you saw on a screen. It is cheaper than every other verification in this file, and it
catches the one class no amount of code-reading will: *the thing that looks like a defect and is a
decision.*

### 🔴 FIVE MORE FROM THE DASHBOARD + HUB STUDIES (2026-08-23) — do not schedule, do not decide

⚠ **THE OWNER SAID "look good" TO THOSE STUDIES. THAT IS APPROVAL OF THE WORK, NOT A RULING ON
THESE.** He was asked nothing and decided nothing. Do not read it as a yes to any row below.

5. **A photograph on the event focal card.** It would reuse the shipped `event-scene.tsx`, but the
   approved 15 July prototype draws that card with NO photo — so it deviates from an approved
   composition.
6. **Were the solid gold buttons a deliberate premium signature?** If yes, D-4 (one button per
   screen that means "do this now") needs his nod. The written palette lock supports D-4 as drawn.
7. **The film's label typeface** — this is **H-2**, now fully scoped (§ 0d). `lib/std-themes.ts:64`,
   one word in one class string; size, tracking, uppercase and tone all stay and ONLY the face
   changes; the watermark and the gild eyebrows are explicitly protected. But the cinematic look is
   paid and owner-approved, so it is his call.
8. **Weather at all, and from which source** — this is **H-6 = AP-9, ONE item described twice**. An
   outside dependency, a recurring cost, licensing, and a source we would have to name on a
   guest-facing page. ✅ Scoped and ready the moment he rules; **no CSP risk**, because the fetch is
   server-side and so cannot fail into a silent grey panel the way the map did.
9. **How many times our own wordmark appears on a shared card** — three today, one proposed.

### 🔴 FOUR NEW OWNER DECISIONS — do not schedule, do not decide

0. **Which "% planned" is THE number — checklist progress, or vendor teams locked?** Today they are
   two measures sharing one word, and both are correct for what they count (see AP-7). The rename
   makes them stop contradicting each other WITHOUT answering this. Answering it is what would let
   one number be computed once and shown everywhere — and that is a product ruling about what
   "planned" means on your own dashboard, not an engineering choice.
   🔑 This one is a different species from the three below: **not a decision recorded in the log,
   but a decision NOBODY HAS EVER MADE, hiding inside something that looked like an inconsistency.**
   The screen was not lying — two screens were answering different questions.
1. **Collapse the phone's dark hero + chip into one photo card shared with desktop.** It would
   reverse an approved prototype.
2. **May guests see the full guest list?** Apple shipped it in June 2026. Touches our RA 10173
   posture and the standing lock that *surfaces show presence, the graph never talks*.
3. **Should the invitation carry an always-visible facts bar over the veil film?** It softens a
   locked cinematic opening.

### ❓ What that session could not check, and neither can the next one

Anything on a real device, on cellular, or on Android — every reading was a desktop browser at a
phone frame. **And it was signed in as the OWNER throughout, so the GUEST view was never seen** —
which is the view that decides AP-3, AP-9 and AP-10. Whether the two "planned" figures are one bug
or two different measures was observed but never traced. **AP-7 starts by tracing it.**

---

## § 0c · 🔴 THE CURRENT SEQUENCE — THIS SUPERSEDES THE WAVE NUMBER IN EVERY SESSION HEADING

**Re-balanced 2026-08-23, after wave 0 finished and 23 new items arrived.** The headings below still
say "wave 1", "wave 3" and so on because renaming eighteen of them invites a transcription error.
**THIS TABLE IS THE ORDER. The headings are names, not positions.**

**Why it needed redoing:** new items were placed by TERRITORY, which kept collisions out but let
load pile up unevenly. Measured before rewriting: **W2-A had grown to 14 items and 12KB** — three
bodies of work wearing one name — and **two separate sessions were building the same machinery**
(the wake's per-type wording, and the birthday page calling the family "the couple"; both are the
event-words provider).

| wave | sessions running together | migration writer |
|---|---|---|
| ~~0~~ | ~~PR triage~~ ✅ **DONE 2026-08-22** | — |
| **1** | **W1-A** finished event + launcher + dashboard polish · **W1-B** Pabati + buy pages + story-editing goes free · **W1-C** paperwork | W1-B |
| **2** | **W2-A** guest activation + the cookie banner + honest reads in the hub · **W2-B** the two deletion jobs · **W2-C1** the admin gold | — |
| **3** | **W3-A** honest reads in the couple tree · **W3-B** supplier cards · **W3-D** ⭑NEW the guest page's design set | W3-B |
| **4** | **W4-WORDS** ⭑NEW the words follow the occasion · **W4-B** supplier screens · **W2-C2** admin archetype | W4-WORDS |
| **5** | **W4-A** the couple's four daily screens · **W5-C** who is in my event + drafted invitation words · **W4-C** grant hardening | W4-C |
| **6** | **W5-A** a supplier's record survives a delete · **W5-B** the undrawn surfaces | W5-A |
| **7** | **W6** the grab-bag, ALONE | per finding |
| **8** | ⭑**W8** guests can see who else is coming, ALONE — owner-ruled 2026-08-23 | W8 |

### The two structural changes, and why

**⭑ W2-A IS SPLIT IN TWO, SEQUENTIALLY — both own `app/[slug]/**`, so they can never run together.**
- **W2-A keeps BEHAVIOUR** (wave 2): the seven guest-activation gaps · the cookie banner · the three
  hub files where a refused read renders as blank. These are defects. Ship them first.
- **W3-D ⭑NEW takes the guest page's DESIGN SET** (wave 3): **AP-3** the invitation reading like a
  receipt · **H-1** the veil instruction (⚠ open it in a signed-out browser first — its evidence is
  client-rendered and a fetch cannot see it) · **H-3** the photo on a shared link (⚠ build to a
  fixture: prod has 5 story pages, 0 published, 0 with a photo) · **H-4/AP-10** the venue map (⚠ do
  NOT edit the CSP, it already allows the map, and the map component already ships — reuse it) ·
  **H-5** "Add to calendar" in the same place at every stage (⚠ measured: it appears exactly ONCE,
  at the film's closing beat).
  ⛔ **AP-9 (weather) is NOT in it** — it needs a provider chosen, which is an owner decision.

**⭑ W4-WORDS ⭑NEW MERGES TWO SESSIONS THAT WERE BUILDING ONE MECHANISM.** The old W3-C ("a wake is
not a celebration") and **H-7** ("a birthday page stops calling the family the couple", 69
guest-read instances across 16 event types) are the SAME machinery — the per-event-type vocabulary.
Run separately, the second would have rebuilt what the first threaded.
🔑 **AND IT IS THREADING, NOT BUILDING:** the words provider is ALREADY MOUNTED in the guest tree
(`event-words-provider.tsx`, proven by `countdown.tsx` consuming it) and the per-type terminology is
already seeded. 🔒 **Weddings must read byte-identically afterwards — ASSERT it, never assume it.**
Order inside the session: thread H-7 first (it proves the seam on 16 existing types), then add the
wake as a new type on the seam H-7 just proved.

### What did NOT change, and why that matters
**W1-A stays as one session at 13 items** — every one of them lives in the couple's dashboard tree,
so splitting it would put two sessions in one file, which is the failure this plan exists to
prevent. It runs **four PRs, defects first, polish last**; if it needs to go faster, a second
session can take the polish PRs **after** its first PR lands and the file is free — never before.

---

## § 0d · EVERY ITEM FROM THE APPLE-INVITES STREAM, AND WHERE IT WENT

**Three deliveries from that session: the twelve AP items (product comparison), the D items (event
dashboard study) and the H items (event hub study).** This is the complete ledger. If an id is not
in this table, it does not exist in the plan — say so rather than inventing a home for it.

| id | what a person gets | home | state |
|---|---|---|---|
| AP-1 | the bottom bar stops vanishing on People / Spaces | **W1-A** | scheduled |
| AP-2 | ~~the app's own typeface~~ | — | 🛑 withdrawn — reverses the front-door lock |
| AP-3 | the invitation reads like an invitation, not a receipt | **W3-D** | scheduled |
| AP-4 | the couple's photo on a shared card | **W3-D** (merged into H-3) | scheduled |
| AP-5 | ~~one strength of the action colour~~ | — | 🛑 withdrawn — the gold buttons ARE the lock |
| AP-6 | no name cut to "Y…" on a phone | **W1-A** | scheduled |
| AP-7 | Home and the event page stop disagreeing | **W1-A** (= D-1) | scheduled, re-scoped to a rename |
| AP-8 | ~~rename Untold/Told, drop the (i) buttons~~ | — | 🛑 withdrawn whole — both halves reverse owner decisions |
| AP-9 | guests see the weather | — | 🔴 owner — **AP-9 and H-6 ARE ONE ITEM**, see H-6 |
| AP-10 | guests get a map | **W3-D** (= H-4) | scheduled |
| AP-11 | a first draft of the invitation words | **W5-C** | scheduled |
| AP-12 | empty screens look deliberate | **W6** | scheduled |
| D-1 | the caption stops saying "planned" for two different things | **W1-A** | scheduled (= AP-7) |
| D-2 | the greeting stops stranding "today." | **W1-A** | scheduled |
| D-3 | appointment names stop being cut | **W1-A** | scheduled |
| D-4 | one button per screen means "do this now" | — | 🔴 owner: were the gold buttons a deliberate signature? |
| D-5 | the chip stops saying "pick one" when it is picked | **W1-A** | scheduled |
| D-6 | the card stops printing 117 twice | **W1-A** | scheduled |
| D-7 | the words-provider seam | **W4-WORDS** | already mounted — threading, not building |
| D-8 | mono keeps digits, loses words | **W1-A** | scheduled |
| H-1 | the veil instruction reads like an invitation | **W3-D** | scheduled ⚠ open it in a browser first |
| H-2 | the film's small announcements read as engraved small caps, not terminal type | **W3-D** | 🔴 owner-gated — scoped, do not build until he rules |
| H-3 | a shared link shows the couple's photo | **W3-D** | scheduled ⚠ build to a fixture |
| H-4 | the venue shows real streets | **W3-D** | scheduled ⚠ do NOT touch the CSP |
| H-5 | "Add to calendar" in the same place at every stage | **W3-D** | scheduled — measured |
| H-6 | one quiet line of weather under the date, and nothing when there is no reliable forecast | **W3-D** | 🔴 owner-gated — **= AP-9**; whether at all, AND which source |
| H-7 | a birthday page stops calling the family "the couple" | **W4-WORDS** | scheduled — the largest, most visible one |

### ✅ THE TWO GAPS ARE CLOSED — both exist, both are OWNER-GATED, neither is lost work

They had no table row **because they were written as prose in the decisions list while the
schedulable items got numbers in a table.** 🔑 **A NUMBERING SCHEME WITH HOLES READS AS LOST WORK.**
The fix for next time is one line: **number every item, then mark the gated ones — never number
only the ones you can schedule.**

**H-2 · the film's small announcements.** "Save the Date" · "Together with their families" · "Mark
your calendars" currently read as terminal type directly above the couple's names; engraved small
caps is the proposal. `lib/std-themes.ts:64` (`labelCls`) + tone overrides in
`[slug]/_components/save-the-date-film.tsx` ~:218, ~:227 + the "Press and hold to pause" pill
(~:1550). **S.** 🔒 **SCOPE, and it is tight: the size, tracking, uppercase and tone all stay —
ONLY THE FACE CHANGES.** It must NOT touch the 9px "Created at Setnayan" watermark or the 0.66rem
gild eyebrows; both are protected.
🔴 **OWNER-GATED** — one word in one class string, but the cinematic look is approved and paid for.

**H-6 · one quiet line of weather** under the date — "Mostly clear, around 27° that evening" — and
**nothing at all** when no reliable forecast exists. `[slug]/_components/empty-states.tsx`, one more
row on the details plate. Server-side fetch. **M.**
✅ **NO CSP IMPACT, and that is load-bearing rather than incidental:** because the fetch is
server-side, this one CANNOT fail into a silent grey panel the way the map did.
🔴 **OWNER-GATED TWICE OVER** — whether we show weather at all, and which source (cost, licensing,
and who we name as the source on a guest-facing page).
🔀 **AP-9 AND H-6 ARE THE SAME ITEM** described twice. One row, not two.

### 🛑 AND MY INFERENCE ABOUT H-2 WAS WRONG — verified, because acting on it would have merged two unrelated changes

I guessed H-2 was the guest-side twin of D-8 and would therefore collide with it in `globals.css`.
**It is not, and it does not.** They share the Tailwind utility NAME `font-mono` and nothing else:

| | D-8 | H-2 |
|---|---|---|
| file | `app/globals.css` (the `.sn-` grammar) + dashboard call sites | `lib/std-themes.ts:64` + the film |
| scope | the dashboard | `.sn-editorial`, remapped by `app/[slug]/layout.tsx` |
| face | **Space Mono** | **DM Mono** |

✅ **I TRACED THE BINDING THE STUDY FLAGGED AS UNVERIFIED**, because if it resolved to Space Mono
after all, the collision would have been real: `app/layout.tsx:140` declares `--font-editorial-mono`
on a `localFont` loading `./_fonts/dm-mono/dm-mono-400.woff2`, and `globals.css:2978` remaps
`--font-mono` to it inside `.sn-editorial`. **It is DM Mono. No collision. H-2 stays in W3-D.**
🔑 **THE SAME UTILITY NAME IN TWO SCOPES IS NOT THE SAME TYPEFACE** — the tell that a "collision" is
imaginary is that the two hits resolve through different variables.

---

## § 0e · 🟠 NINE DESIGN CALLS MADE UNDER DELEGATION — read the provenance BEFORE you treat any of them as settled

🛑 **THE OWNER SAID "do as you recommend". HE DID NOT RULE ON THESE INDIVIDUALLY.** He was not shown
them one by one and gave no reasoning of his own. The delegation is genuine and the calls stand —
**but they are REVERSIBLE calls made by a session under a general instruction, and they must never
be written into a brief as owner rulings.**

🔑 **WHY THIS MATTERS MORE THAN IT SOUNDS.** A future session reading a flat *"decided: yes"* will
treat these exactly as it treats the 11 August front-door lock — as immovable, and as something to
protect other work from. That is how this project acquires "a lock nobody remembers agreeing to",
which its own code comments name as a recurring failure. **If one of these looks wrong to you
later, it is fair game to reopen. The front-door lock is not.**

✅ **THE DECIDING SESSION RAN THE § 0b DECISION-LOG CHECK ON ALL NINE FIRST, AND I RE-VERIFIED THE
TWO THAT CHANGED OUTCOMES:**
- **"Gold as the premium signature" IS NOT A THING.** The only "premium signature" in the log is the
  **six monogram effects** (2026-07-17) — Drawn, Foil and the rest. **Nothing about buttons
  anywhere.** ⇒ D-4 was gated on a rule that does not exist, and is UNBLOCKED with no conflict.
- **Nothing in the log protects the photoless focal card.** The 15 July prototype simply draws it
  that way, with no recorded reason — and *"one obsidian per view"* is NOT violated, because the
  photo band sits INSIDE the existing dark card rather than adding a second dark surface.

### What each one does to the plan

| # | call | effect |
|---|---|---|
| 1 | **Photograph on the event focal card — yes.** Reuse `event-scene.tsx`, this page only, `.sn-tile-dark` untouched | **W1-A**, as its LAST PR — see #8 |
| 2 | **D-4 one terracotta action per screen — proceeds**, no gate | **W1-A**, ungated |
| 3 | **"% planned" — DO NOT UNIFY.** The checklist keeps "% planned"; the focal adopts the already-shipping **"% locked in"** | 🟢 **DISSOLVES WORK** — closes owner decision 0. Nothing to compute once, nothing to migrate. It is the rename already scheduled, and no more |
| 4 | **The button stays "Add guest"** — drop the PROVISIONAL comment in `customer-nav-fab.tsx` | trivial, fold into any **W1-A** PR |
| 5 | **H-2, the film's label face — yes.** Only the face; watermark and gild eyebrows protected | **W3-D**, ungated |
| 6 | **H-6 weather — yes, scoped:** inside ~10 days only · coordinates required · **silent on any failure, no placeholder and no apology** · server-side | **W3-D** ⛔ **with a STOP CONDITION, see below** |
| 7 | **Our wordmark on a shared card → ONCE** (three today) | 🟢 **DISSOLVES INTO H-3** — same file, no new slice |
| 8 | **One event card on phone and laptop — yes, but SEQUENCED LAST**, after the small dashboard items land | **W1-A**, final PR, on its own |
| 9 | **Guests can see the guest list** — default off, host chooses per event, accepted-only | ✅ **OWNER RULED IT HIMSELF, 2026-08-23 — "Yes, as scoped". NOW W8, its own wave.** |

⛔ **#6 CARRIES A HARD STOP, NOT A PREFERENCE. FREE-TIER SOURCE ONLY.** If the only workable
forecast provider charges anything, **that session STOPS and asks.** The deciding session has not
committed spend and cannot. Do not sign us up to a paid tier, a trial that converts, or a
"free for now" plan.

### ✅ #9 WAS HELD, PUT TO THE OWNER, AND HE RULED IT HIMSELF — 2026-08-23

**It was deliberately NOT scheduled on the delegation.** The deciding session's own words: *"the one
of the nine most worth overruling"* and *"the only one touching RA 10173 posture"*. It is also the
only one of the nine that is genuinely NEW SCOPE rather than a call about something already being
built. **A general "do as you recommend" is not consent to a new guest-visible disclosure under a
privacy law where the owner is the registered data officer**, so it was put to him directly.

🔒 **HIS ANSWER, IN HIS OWN WORDS: "Yes — as scoped."** So unlike the other eight, **this one IS an
owner ruling** and carries the weight of one. The shape he approved:
- **OFF by default.**
- **The host chooses, per event** — not a global setting.
- **ONLY people who have ACCEPTED.** ⛔ **NEVER invited-but-unanswered.** The reasoning is the part
  to protect: **being invited is the host's choice about you; accepting is your own.** Publishing
  non-responses imposes a social cost on GUESTS, not on the host. That distinction is the ruling.

📋 **The grounds, recorded so nobody re-derives them:** the locked position says *"surfaces show
presence… only the graph shows relationships, and the graph never talks"* — and that lock **names an
event guest list as container membership, the explicitly permitted case**, not graph traversal.

### ⭑ W8 · Guests can see who else is coming · **Opus 5 · high** — its own wave, ALONE

**Why its own wave rather than folded into a session:** it needs the guest tree (`app/[slug]/**`),
the host's guest screen, **and a migration touching `events` and the RLS on `guests`**. Every wave
that has the guest tree free has a migration writer whose tables could overlap, and every wave with
a free migration slot has the guest tree taken. **Jamming it in would break the one rule the plan
rests on.** It is new scope that arrived after the plan was balanced; a wave of its own is the
honest answer.
⏭ **It may swap with W6 (the grab-bag) if the owner wants it sooner — both run alone.**

```
Guests can see who else is coming. The owner ruled this himself on 2026-08-23: "Yes, as scoped."

THE SHAPE HE APPROVED, and none of it is yours to adjust:
- OFF by default.
- The HOST chooses, PER EVENT. Not global, not ours.
- ONLY people who have ACCEPTED. NEVER invited-but-unanswered.
  🔒 THE REASONING IS THE RULING, so protect it in code and in copy: being invited is the HOST's
  choice about you; accepting is YOUR OWN. Publishing non-responses imposes a social cost on
  GUESTS rather than on the host. If your implementation makes a non-response inferable — a count
  that differs from the list, a gap in numbering, a "12 invited" anywhere near "8 coming" — YOU
  HAVE BROKEN THE RULING even though the list itself is correct.

THE GROUNDS, so you do not re-derive them: the locked position is "surfaces show presence… only the
graph shows relationships, and the graph never talks", and that lock NAMES an event guest list as
container membership — the explicitly permitted case, not graph traversal. You are inside the lock,
not bending it.

BEFORE YOU BUILD — RULE 0, and this product has burned a session on exactly this shape before:
grep for who already reads the guest list on a guest surface. A seat-finder, a table view, a
check-in screen or the "find my table" page may already show guest names to guests in some phase,
in which case your job is a CONTROL over something that exists, not a new disclosure. Report what
you find before writing a migration.

THE DATABASE IS THE CONTROL, NEVER THE COMPONENT. Hiding the list in the UI while the rows remain
readable is not a privacy feature — the anon key is public by construction and every public table
is served over the REST API. The RLS policy is what decides this. Assert the refusal from an
anonymous client, not from the screen.
⚠ AND RLS ENABLED WITH NO POLICY READS EMPTY, SILENTLY — 22 prod tables are already in that state.
A guest list that renders blank because you closed it too far looks identical to one that is
switched off. Distinguish them.

MIGRATION: yes — a per-event setting plus the read policy. You are the only session running.
2 PRs: the setting and the policy, then the guest-facing surface.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

---

## § 0a · WHAT A SECOND VERIFICATION PASS FOUND — read this before any session

Every prompt below was re-checked against `origin/main` @ `c984e0caf` and the live production
database on **2026-08-23, after the prompts were first written**. Six briefs were wrong, and each
one would have produced exactly the loop this project keeps paying for: rebuilding something that
already ships.

| brief said | actually true on main today |
|---|---|
| W3-A: ~30 files, and the couple's supplier page has **45** unbound reads | **19** unbound reads across **14** files; that page has **3**, and **12** already bind their error. Most of it was fixed already. |
| W5-A: **152** foreign keys cascade, **10** survive | **145** cascade, **19** survive. Nine more already survive than the brief claims. |
| W4-C: **~290** anonymous read grants | **235**, across 384 public tables. Batches have landed. |
| W2-C1: **106** gold-as-text occurrences | 106 by the guard's regex, **207** by a plain grep. Both real, different methods — say which you used. |
| W1-C: the compliance pack still claims Philippine hosting and a 90-day retention rule | The **adopted** manual already carries the corrected retention row and no PH-hosting claim was found in it. The remaining "90 days" is about marketing samples — a different, correct rule. |
| C1: the per-guest QR download "refuses anyone without a full account" | It requires the event to own a **paid ₱1,499 SKU** — it is the BRANDED variant. Opening it to every guest gives away a sold product. |

🛑 **AND ONE OF MY OWN CLAIMS WAS WRONG — CORRECTED BY THE SESSION THAT RAN W0.** I wrote, in the
plan and in W0's prompt, that the six open PRs were *"none failing a check — all stuck on
conflicts."* **THREE OF THEM WERE FAILING**, and it changed the work:
- **#4711 was failing typecheck+lint** on a guard that says no NEW route word may be left uncovered
  by the database mint. It shipped a public `/pakanta` page and **never reserved the word** —
  confirmed in prod, `business_slug_is_reserved('pakanta')` returned NO, so a business named
  "Pakanta" could have been minted our own product page **permanently**, since shop addresses are
  immutable. Fixed with a migration, mutation-measured 1 → 0 RED, 15/15 restored.
- **#4563 was failing the exposure freeze** — its surface widened by a new column.
- **#4567's run was CANCELLED at 15m18s** — not an assertion failure at all, a third distinct cause.
🔑 **"BLOCKED", "DIRTY", "FAILING" AND "CANCELLED" ARE FOUR DIFFERENT STATES AND I COLLAPSED THEM
INTO ONE.** Read each PR's actual check run before deciding what kind of work it is. A summary of
several PRs' health is exactly the kind of claim that is cheap to write and expensive to believe.

🪤 **AND EVERY LINE NUMBER IN THESE PROMPTS HAS ALREADY DRIFTED.** Cited positions were re-checked
and several point at unrelated code — one brief's "unconditional email write at ~:233 and ~:453"
lands on neither. **GREP THE STRING. NEVER TRUST THE LINE.** The line numbers are kept only as a
hint about which region of the file to search.

🔑 **THE RULE THIS PASS PROVES.** Six of about twenty briefs were stale within hours of being
written by people looking at the same tree. So: **the first thing every session does is re-measure
its own premise and print the number.** If the number has moved, ship the smaller fix and say so —
that is a result, not a failure. If the premise is gone entirely, close the item and move to the
next one. Do not build to a brief. Build to a measurement.

---

## § 0 · THE SHARED HEADER — paste this above every session prompt

```
You are working on Setnayan, a pre-launch Philippines-first life-events platform.
Code: github.com/iscasasola/setnayan-platform · Specs corpus: ~/Documents/Claude/Projects/Setnayan

BEFORE ANY CODE — non-negotiable:
0. MEASURE YOUR OWN PREMISE FIRST AND PRINT THE NUMBER. Every count, file path and line number in
   your prompt was true when written and several have already been proved stale — six of about
   twenty briefs were wrong within hours. Re-run the grep or the query your prompt is built on
   BEFORE you scope anything. If the number moved, ship the smaller fix and say so. If the premise
   is gone, close the item in one line and go to the next. Build to a measurement, never a brief.
   GREP THE STRING, NEVER TRUST THE LINE — cited line numbers have already drifted.
0b. AND IF YOUR ITEM CAME FROM LOOKING AT A SCREEN, GREP THE DECISION LOG FIRST:
       grep -n "<the noun on the screen>" ~/Documents/Claude/Projects/Setnayan/DECISION_LOG.md
   In one comparison stream, SIX findings were wrong and ALL SIX were proposals to undo something
   the owner had already chosen — including two that re-did a change he had personally reverted the
   day after it shipped. Five of the six would have died at that grep in seconds. It is the
   cheapest check in this file and it catches the one class code-reading never will: THE THING THAT
   LOOKS LIKE A DEFECT AND IS A DECISION. If the log names it, STOP — it is not yours to change.
1. RULE 0. Assume what you are asked for ALREADY EXISTS. This product is ~2 years of code and the
   owner has paid more than once to have a screen rebuilt that already shipped. grep for the
   feature noun in apps/web BEFORE designing anything, then state in one line each:
   what exists · what is missing · the delta you will build.
   If you cannot name the existing component, you have not searched enough. Do not start.
2. Read a FRESH tree, never the home directory (~ is a checkout ~1100 commits behind and returns
   confidently wrong answers):
     git -C ~ fetch origin main
     git worktree add --detach /private/tmp/wt-read-$$ origin/main
     git -C /private/tmp/wt-read-$$ rev-parse HEAD    # PRINT IT, compare to origin/main
   `git worktree add` on an EXISTING path fails while the next command in the chain happily prints
   the OLD tree's hash. Three agents read a 187-commit-stale tree that way on 2026-08-23.
3. Read WHATS_NEXT_EXECUTION_PLAN_2026-08-23.md § 2 and find YOUR session's territory.
   DO NOT EDIT A FILE OUTSIDE IT — another session may be in it right now.

WORKING RULES
- Branch FIRST, then `git worktree add <path> <branch>`. Never work in ~.
- NEVER `git reset --soft origin/main`. Rebase. Before every push, check what YOUR BRANCH deleted:
      git diff --diff-filter=D --name-only origin/main...HEAD    # THREE DOTS. MUST be empty.
  🛑 THREE DOTS, NOT TWO — AND THIS FILE HAD IT WRONG UNTIL 2026-08-24, WHICH COST A SESSION A
  POINTLESS REBASE. `origin/main..HEAD` (two dots) compares the two TIPS, so every file main GAINED
  after you branched reads as a file YOU DELETED. In a repo where sibling sessions merge while you
  work, that fires on EVERY branch. Measured: one branch reported FOUR deletions two-dot and ZERO
  three-dot, and the four were files two other sessions had added after it branched.
  `origin/main...HEAD` (three dots) diffs from the MERGE BASE, which is the actual question:
  what did my branch remove?
  If you want it decisive rather than merely correct, ask the merge itself:
      git merge-tree --write-tree origin/main HEAD          # then, for a file you care about:
      git cat-file -e "<tree>:<path>" && echo survives
  🔑 A GUARD THAT CRIES WOLF TEACHES YOU TO SKIM PAST THE ONE TIME IT IS RIGHT — and this one would
  have fired on every branch in a busy repo, which is exactly when a real clobber is easiest to
  wave through. A deletion you did not author still means you are about to clobber merged work, and
  CI still cannot see it: a repo missing a whole feature is internally consistent. It has already
  stopped production deploying once. The rule is right; the command was wrong.
- apps/web/scripts/port-control-baseline.json is GENERATED. Regenerate on every rebase, never
  hand-merge. Diff routes before/after and confirm you removed only what you meant to.
- Add changelog.d/<branch-slug>.md with a `SPEC IMPACT:` line. Never edit CHANGELOG.md or
  STATUS.md in a feature PR.
- `gh pr create` then `gh pr merge <n> --auto --merge`. A force-push DISARMS auto-merge — re-arm
  after every rebase. Check `mergeStateStatus`, not just that the checks are green.
- Prune your worktree the moment the PR merges.

PROOF RULES — this product's entire defect history is bugs that were green in CI
- Every guard you write must be MUTATION-TESTED and the mutation MEASURED: print the occurrence
  count BEFORE → AFTER. An unmeasured mutation proves nothing in either direction. Assume your
  guard is decorative until you have broken the guarded thing and watched it go red.
- A SEARCH FOR THE RENDERED FORM OF CSS-TRANSFORMED TEXT CAN NEVER MATCH THE SOURCE. Proved again
  2026-08-23: a guest-page sweep grepped for "TOGETHER WITH THEIR FAMILIES" and "LIFT THE VEIL",
  got 0/0, and nearly reported that the film does not render for guests at all. The capitals come
  from CSS `text-transform`; the markup carries sentence case. Third instance of one rule this
  week — A SEARCH THAT CANNOT MATCH IS NOT A NEGATIVE RESULT.
- A STATUS LINE THAT IS PRINTED RATHER THAN DERIVED IS NOT A STATUS LINE. Never write
  `cmd; echo "clean"` or `cmd && echo "pushed"` — the label asserts a conclusion it never
  evaluated, and it lands directly under output that contradicts it. Proved three times in this
  project: `&& echo "pushed"` after a FAILED push; a deletion check that printed
  "(empty above = nothing deleted)" underneath two real filenames — MINE, on 2026-08-24, in the
  same hour I was auditing somebody else's check; and a session that nearly shipped the same
  pattern and caught it only because the paths looked unfamiliar. DERIVE the label from the result
  (`test -z "$out" && echo clean || echo "DELETIONS: $out"`), or print the raw output and read it.
- A rejected query is NOT a thrown error. A phantom column, a phantom enum value, a phantom RPC
  argument name, a blocked iframe, an unresolved r2:// reference — all get REFUSED, and the only
  symptom is an absence. If a screen is empty, suspect refusal before emptiness.
- Supabase does not throw; it resolves with { error }. A try/catch around a read is decoration.
  An unread count is not zero.
- A GUARD THAT EXEMPTS BY *FILE* EXEMPTS THE CODE IT POLICES. Proved 2026-08-24: a guard against
  markup leaking into visible words exempted any file containing `dangerouslySetInnerHTML`
  anywhere — and BOTH files carrying real defects contained one, so it exempted exactly what it
  existed to catch. Reintroducing the defect left it GREEN. The fix was to exempt by SHAPE, per
  PROPERTY: which names does this file feed to `__html`? There it was `hint`, never `label`, and
  the defect lived in `label`. **Ask what is exempt, not which file is exempt** — and check the
  false-positive direction too, that legitimate uses still pass.
- A WORKAROUND AT THE RENDER SITE IS EVIDENCE OF A DEFECT IN THE DATA. Same stream: one screen
  carried `.replace(/&apos;/g, "'")` AND a `dangerouslySetInnerHTML` added *so an apostrophe would
  display* — **a permanent injection surface bought for a punctuation mark.** Fixing the data
  DELETED a `dangerouslySetInnerHTML` rather than adding one. When you find a render-site patch,
  look upstream before you copy it.
- A HAND-ENUMERATED GUARD LIST IS A LIST OF THE THINGS YOU THOUGHT OF. Proved again on 2026-08-22:
  one guard listed 7 buy paths while 9 files called the function it was guarding, and a ₱400
  purchase reached a page naming NEITHER bank account. DERIVE the subject list from the code, and
  FLOOR it so an empty sweep cannot pass silently.
- A GUARD THAT PROTECTS NOTHING IS WORSE THAN NO GUARD, and shipping one is worse than deleting it.
  Also proved 2026-08-22: a column-level REVOKE applied without error and changed nothing, because
  a column-level REVOKE CANNOT CARVE A HOLE IN A TABLE-LEVEL GRANT. The measured surface was
  identical afterwards. The right move was to DELETE the migration and record the finding — not to
  ship a protection that reads as if it were in place.
- After any migration merges, verify it applied IN PROD BY THE OBJECT (pg_get_functiondef,
  information_schema) — never by schema_migrations, never by the migration's own comment — and
  run `curl -s https://www.setnayan.com/api/health` to confirm the served version is your merge or
  later. THE MERGE IS NOT THE SHIP.
- Production is pre-launch: 5 events · 40 guests · 2 shops · 1 order, cancelled. ZERO ROWS IS THE
  PLAN, never a defect to report.

WRITING TO THE OWNER
Plain English. Say what a PERSON experiences — never file names, function names, table names or
flag names. Decide and act; escalate only locked prices, scope, risk, or reversing an owner lock.

RUN TO THE END — DO NOT STOP TO ASK WHETHER TO PROCEED
Owner, 2026-08-04, verbatim: "can you keep going instead of telling me what you recommend doing
next. can you do it. and decide". This is a standing instruction and it governs this whole session.
- You have ALREADY been authorised to do everything in your prompt. Do not ask permission to start
  an item, to open the next PR, to continue after a merge, or to move to the next item on your
  list. Just do it and say what you did.
- Finish your ENTIRE list before you report. A session that does item 1 and asks "shall I do item
  2?" has failed the instruction. Work item by item to the end.
- WHEN A CHECK FAILS OR A PR IS BLOCKED, that is work, not a stopping point. Investigate, fix,
  rebase, re-arm auto-merge, and carry on. Only a genuinely failing REQUIRED check that you cannot
  fix after real investigation is worth raising — and even then, park that item and finish the
  others first.
- WHEN ONE ITEM TURNS OUT TO BE BLOCKED OR ALREADY DONE, do not stop the session. Say so in one
  line, move to the next item, and finish everything that is not blocked. Scaling the work down is
  the owner's call, not yours.
- THE ONLY LEGITIMATE STOPS are: (a) an item your prompt explicitly marks as an OWNER DECISION —
  skip it, do not decide it, do not build it; (b) a locked price, SKU, or scope change; (c) an
  action that would destroy real customer data you cannot restore. Everything else, decide it
  yourself, state the assumption you made, and keep moving.
- Pre-launch means reversible. Production holds 5 events, 40 guests, 2 shops and a single cancelled
  order. Nothing you are asked to do here can hurt a real customer today, so hesitation costs more
  than a mistake does.
- Report ONCE, at the end: what shipped, what you skipped and why, what is waiting on the owner.
  No mid-session check-ins, no "let me know if you'd like me to continue".
```

---

## WAVE 0 — runs ALONE

### W0 · PR triage and land · **Opus 5 · high**

> ## ✅ W0 IS COMPLETE — 2026-08-22 21:57Z. DO NOT RUN IT AGAIN.
> **Independently verified, not taken on the session's word:** `gh pr list --state open` returns
> **ZERO open PRs** · #4535 CLOSED with a written reason · #4699 · #4708 · #4711 · #4567 · #4563 ·
> #4723 all MERGED · main tip `09697145d` · **production serving `0969714`, which IS that tip.**
> Migrations verified in prod **by the object** (my own query, not schema_migrations):
> `business_slug_is_reserved('pakanta')` = **true**, with `pay` and `creators` still reserved and an
> ordinary shop name still free — so the CREATE OR REPLACE neither reverted nor over-reserved; and
> `ensure_papic_board` now carries `10 - v_vendor_used` with the old `20 - v_vendor_used` **gone**.
> 🔓 **ALL THREE PABATI GATES ARE IN. WAVE 1 IS UNBLOCKED.**
>
> 🪤 **TWO THINGS THAT SESSION PAID FOR — carry them:**
> 1. **`$T:apps/...` in zsh triggers the `:a` history modifier and SILENTLY MANGLES THE PATH**, so
>    `git show` errors and the grep count comes back 0. **A verification that cannot match reads
>    exactly like a clean result.** Use `${T}:path`. Same family as every other "search that could
>    not match is not a negative result" in this repo.
> 2. **THE ANTI-REVERT RE-READ IS NOT OPTIONAL WHEN MERGES LAND AFTER YOURS.** Five merges landed
>    after #4699, so the final tip was re-read for every piece of the session's own work before
>    calling it done. Nothing had been reverted — but that is a measurement, not an assumption.
>
> ⏭ **NAMED, NOT FIXED — deliberately, and correctly:** `vendor-dashboard/subscription/actions.ts`
> hand-builds a payment path instead of calling the shared helper, so it lacks the helper's
> `.trim()`. Measured INERT (the reference is a database-generated Crockford code that cannot carry
> whitespace) and the guard documents the exception. **Do not "fix" it in a later session without
> re-measuring — it is a recorded decision, not an oversight.**
>
> ---
>
> <details><summary>Its mid-run state, kept for the reasoning</summary>
>
> ⏱ **STATE AT 2026-08-22 19:45Z, measured with `gh` and `curl` — a running session is already on
> this.** #4535 **CLOSED** · #4699 **MERGED** (19:36Z, main tip `0deceeb95`) · #4708 · #4711 ·
> #4567 · #4563 all **OPEN and BLOCKED** (they were DIRTY; the rebases landed).
> ⏱ **DEPLOY LATENCY IS ~10 MINUTES, AND THAT IS NORMAL — DO NOT CALL IT A DEAD DEPLOY TOO EARLY.**
> Production served the pre-merge build `c984e0c` for nine minutes after #4699 merged, then caught
> up to `0deceeb` at 19:46Z (`deploy-prod.yml` run: completed success). ⚠ **I raised it as a
> possible dead deploy at nine minutes and had to retract it one minute later.** The rule that
> survives: **a verification run against a build that predates your merge is a FALSE PASS, not a
> check** — wait for `/api/health` to report your merge or later before verifying anything. Give it
> ~15 minutes before treating a stall as the dead-deploy pattern, and confirm by reading the
> workflow run, not by the health endpoint alone.
> ⚠ **BLOCKED is not DIRTY.** Read why before acting: a required check still running is not a
> conflict, and re-pushing to "unstick" it wastes a cycle. A force-push disarms auto-merge.
>
> </details>

```
Six pull requests are open on setnayan-platform and none is failing a check — they are all stuck
on conflicts. Land five and close one. Nothing else runs while you do this; every later session
depends on these merges.

FIRST, AND WITHOUT REBASING IT: close #4535.
It is 507 files carrying SIXTEEN migrations that are already applied on main. That is the exact
shape of the merge that deleted 24 files, reverted 42, and stopped production deploying for a day
on 2026-08-21. Read enough of it to say in one line what it was genuinely carrying that main does
not have, write that down for a future session, then `gh pr close 4535` with that reason. Do not
rebase it. Do not cherry-pick from it without checking each file against main first.

THEN LAND, IN THIS ORDER, rebasing and regenerating the port baseline between each:
1. #4699 (the last three payment doors) — DIRTY on the baseline only.
   AFTER IT DEPLOYS: verify the six shop redirects are actually back BY READING THE DEPLOYED
   BUILD, not by trusting the merge. That is exactly how a silent revert was found last week.
2. #4708 (papic challenges, 3 migrations) — gates the Pabati retirement.
3. #4711 (Pakanta joins the Studio) — BLOCKED; diagnose WHY before rebasing. Second gate on Pabati.
4. #4567 (admin work-list counts) — 3 files.
5. #4563 (a band can show you them playing it, 1 migration).

THEN FINISH THE UNFINISHED AUDIT. The adversarial review of the payment conversion ran on
2026-08-21 and 17 of its 57 agents died on a usage limit — including the whole completeness pass
and the verification for two of six lenses: `redirect-mechanics` and `notify-and-admin`. Those
findings were never confirmed or refuted. A partial pass is not a clean bill of health. Re-run
those two lenses only, and act on what survives.

Read first: WHATS_NEXT_One_Payment_Page_2026-08-22.md (its §3 carries the per-file verification
procedure for a suspected revert — the conflicts git reports are NOT the dangerous part; the
files that merge cleanly by keeping a deletion are).

Done when: #4535 is closed with a written reason, the other five are MERGED, production's health
endpoint reports a version at or after the last of them, and the six shop redirects are confirmed
in the deployed build.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

---

## WAVE 1 — three at once

### W1-A · A finished event tells the truth · **Opus 5 · medium**

```
Four defects on a celebration that has already happened. Read
WHATS_NEXT_A_Finished_Event_2026-08-22.md first — nine PRs already shipped for this stream, do not
rebuild any of them. These are the four it left open, re-verified 2026-08-23.

1. THE SCHEDULE SHOWS NOTHING ON THE FIRST OPEN.
   `fetchScheduleBlocks(supabase, eventId)` is called TWICE in
   apps/web/app/dashboard/[eventId]/schedule/page.tsx (~:130 and ~:180). The second is the
   deliberate re-read after the non-wedding seed; the first serves a stale "0 blocks". Deleting the
   duplicate is right whichever cache is at fault — but RUN THE DISCRIMINATOR before you write a
   cause into a commit message. Do not assert a caching diagnosis you have not tested.
2. THE CHECKLIST DOES NOT KNOW THE DAY HAPPENED.
   apps/web/lib/checklist.ts (week buckets ~:292) + the checklist page read `event_date` only and
   carry ZERO lifecycle references, so a finished event shows "This week" over dates that have
   passed, at 0%. The nearby "compressed runway" comment is about an event created CLOSE to its
   date — NOT a past event. Do not read it as a fix.
3. "REVIEW" HAS NO DESTINATION — AND THE MACHINERY TO GIVE IT ONE ALREADY SHIPS.
   apps/web/lib/customer-menu.ts (~:177) and
   app/dashboard/[eventId]/_components/after/finished-event-summary.tsx (~:141) both open the plain
   marketplace.
   ⚠ RE-CHECKED AT TIP 09697145d — RULE 0 PAYS HERE, DO NOT BUILD A SCREEN:
     · The vendors page ALREADY ACCEPTS A DEEP LINK: `searchParams` takes `{ status, tab, open,
       inspect }` and its own comment documents the shipped pattern `?tab=shortlist&open=catering`
       ("jumps right to that category", 2026-06-12).
     · The per-supplier "Leave a review" affordance ALREADY SHIPS inside that page.
     · "Your team" ALREADY EXISTS as a merged section — team-controls.tsx, team-summary-chip.tsx,
       and build-compare.tsx's comments record capabilities MOVING into it.
     · What is genuinely missing is only a VALUE to aim at: `BUDGET_BUILD_TABS` is
       shortlist·build·budget·compare, with no team member.
   So the whole job is: give the existing deep link something that lands on the team — a tab value
   or an anchor — and point the two Review links at it. A NEW SCREEN IS THE WRONG ANSWER and a new
   tab may be too; check whether an anchor on the merged section is enough first.
4. THE "AFTER" STAGE IS A STUB — and its promise is fiction.
   lib/progress-stages.ts has `afterPct = 0` (~:301) and a "7-day review window" sentence (~:298,
   ~:371) describing a mechanism that EXISTS NOWHERE IN THE PRODUCT. Delete the sentence rather
   than build to it. This is the least valuable of the four and the stream's own file says so —
   on the events where that stage is current the rail sits inside a COLLAPSED disclosure, so you
   cannot demonstrate it by loading the page. Do it last, or say you skipped it.

ALSO IN YOUR TERRITORY — three doorway rows that are defined and rendered nowhere.
🪤 MEASURE THIS ONE CAREFULLY: a naive `grep -rn '<OpenShopRow' app` returns ONE hit, and it is
inside open-shop/has-a-doorway.test.ts's own REGEX — the guard's assertion contains the component
name it is looking for. That is the guard proving the point about itself. Exclude the test files
before you count, or you will read "it is rendered once" off the guard that says it is not:
`BecomeStorytellerRow`, `OpenShopRow`, `CreateSamahanRow` in app/dashboard/(launcher)/page.tsx
(~:2436/:2483/:2517, ZERO call sites app-wide). Two guards — open-shop/has-a-doorway.test.ts and
lib/the-controls-have-a-home.test.ts — assert the board carries those doors and are satisfied by
strings inside components nothing mounts. Nobody is stranded (the account menu still carries
"Your Story"), so the honest fix is either mounting a row or rewriting the assertion to check a
MOUNTED one. A guard satisfied by dead code is worse than no guard.

⚠ A DESIGN DELTA FOR YOUR FILES IS BEING DRAWN RIGHT NOW — KEEP YOUR DIFFS SURGICAL.
A study is in flight proposing Apple-Invites-informed improvements to this same dashboard, under
the owner's explicit constraint "do not create a design on top but only use the existing shell's
design and improve it". It is READ-ONLY — no branches, no PRs — and the owner has not ruled on it.
YOU ARE NOT BLOCKED BY IT: your items are defects, not design, and blocking a defect on an unruled
proposal is how work stalls here. But change the smallest thing that fixes each one, do not
restructure or re-lay-out anything you are not fixing, and do not "tidy" adjacent markup — a later
design port has to apply cleanly on top of you.

ALSO YOURS — FIVE ITEMS FROM THE APPLE-INVITES COMPARISON (see § 0b). They land here because they
are in files you already own, so they cost you almost nothing and would cost anyone else a
collision:
 AP-1 THE BOTTOM BAR VANISHES when you tap People or Spaces. `HomePillNav` is rendered in exactly
   ONE place — (launcher)/page.tsx:1455 — so every sibling route loses it. Lift it to the layout
   that covers those routes.
   ⚠ VERIFY BY SCREENSHOT, NOT BY QUERYING THE PAGE. The session that found this nearly filed a
   false "empty nav bar" off a DOM probe whose selector matched the wrong element and returned the
   SAME answer on a page where the bar is plainly visible. Only its control test caught it.
 AP-6 NAMES ARE CUT TO "Y…" ON A PHONE — several blocks in that same file.
 AP-7 RE-SCOPED 2026-08-23 — IT IS A RENAME, NOT A UNIFICATION, AND I TRACED IT MYSELF.
   Home and the event page show different "% planned" figures. NEITHER IS BROKEN: they are two
   different measures wearing one word.
     · Home  — `(launcher)/page.tsx:1977` renders `${pct}% planned`, and pct is the event
       CHECKLIST's real done/total (the comment at :372 says so).
     · Focal — `[eventId]/_components/event-dashboard.tsx:1224` assigns
       `const plannedPct = cockpitModel.briefing.lockedPct`, i.e. VENDOR CATEGORIES LOCKED
       (`lib/setnayan-ai-cockpit.ts` ~:281). The line above it already admits this in writing:
       "The focal's '% planned' gold bar = vendor-categories-locked share".
   ⇒ THE WHOLE FIX IS THE FOCAL'S CAPTION. Home is untouched. Once the two stop sharing a word they
   cannot contradict. Size S, presentation only.
   🔑 RULE 0 — THE HONEST CAPTION ALREADY SHIPS TWICE. The SAME value is captioned "% locked in" in
   `setnayan-ai-value.tsx:114` and `lib/setnayan-ai-activity.ts:226`. USE THAT WORDING. Do not
   invent a third phrase for a number the product already knows how to name.
   ⛔ DO NOT "COMPUTE IT ONCE AND SHOW IT EVERYWHERE". That requires deciding WHICH measure is the
   real answer to "how planned is this wedding" — a product ruling, now on the owner list below.
   Making it inside a defect fix is exactly how this project acquires a lock nobody remembers
   agreeing to.
 🛑 AP-8 WAS HERE AND IS WITHDRAWN WHOLE — do not build it, do not build a smaller version of it,
   and do not re-derive it. Both halves reverse the owner's own decisions of 2026-08-21: he NAMED
   "Untold/Told" in session over the obvious alternative and the row says do NOT re-open, and the
   circled (i) buttons were removed once and restored the next day AT HIS REQUEST. See § 0b.
 🔀 AP-4 HAS MOVED TO W2-A AND IS NOT YOURS. It is the same work as H-3 — both touch
   app/api/og/realstory-slug/[slug]/route.ts, so leaving it here would have put two sessions in one
   file. Do not touch that route.

ALSO YOURS — SEVEN MEASURED ITEMS FROM THE EVENT-DASHBOARD STUDY. The owner has SEEN the
before/after and said "look good". ⚠ READ THAT PRECISELY: it approves the WORK, not the owner-gated
items below it. Nothing here needs a ruling except D-4.
 D-1 = AP-7, already described above — the caption. Same file as the rest of these.
 D-3 APPOINTMENT NAMES ARE CUT to "Hair & mak…" (event-dashboard.tsx ~:2103, the minis grid).
 D-5 A CHIP SAYS "PICK ONE" THREE TIMES when options are already saved (~:941, byKind()).
 D-6 THE CARD PRINTS THE SAME NUMBER TWICE (~:1750, the chip row).
 D-2 THE GREETING STRANDS "today." ON ITS OWN LINE (globals.css `.sn-h1` / `.sn-h1-tail` ~:3285).
 D-8 MONO SHOULD KEEP DIGITS AND LOSE WORDS (globals.css + those call sites).
 ✅ D-4 (one terracotta action per screen that means "do this now") IS NOW UNBLOCKED — BUILD IT.
   It was gated on whether solid gold buttons were a deliberate premium signature. MEASURED IN THE
   DECISION LOG, and re-verified by me: THERE IS NO SUCH RULE. The only "premium signature" on
   record is the six monogram effects (2026-07-17) — nothing about buttons anywhere. It was gated
   on a rule that does not exist.
 ⚠ ONE UNSETTLED OBSERVATION ON D-2: the live tail colour was seen as terracotta while the source
   says ink-400 #8A857B. Either the deploy differs or it was misread. D-2 holds either way — but
   settle it and say which, rather than inheriting the ambiguity.

ALSO YOURS — THREE MORE FROM THE NINE DELEGATED DESIGN CALLS (§ 0e).
🟠 READ THE PROVENANCE FIRST: the owner said "do as you recommend" and a session made these. He did
NOT rule on them individually. They stand and you should build them — but they are REVERSIBLE calls,
not owner locks, so if one looks wrong when you open the file, SAY SO rather than protecting it.
 · THE BUTTON STAYS "Add guest" — just drop the PROVISIONAL comment in `customer-nav-fab.tsx`.
   Trivial; fold it into any PR.
 · A PHOTOGRAPH ON THE EVENT FOCAL CARD — yes. Reuse `event-scene.tsx` (it already ships, with the
   couple's own hero → a per-type stock photo → a branded gradient). THIS PAGE ONLY, and
   `.sn-tile-dark` is untouched: the photo band sits INSIDE the existing dark card, so "one obsidian
   per view" still holds.
 · ONE EVENT CARD ON PHONE AND LAPTOP — yes, and ⚠ SEQUENCE IT LAST, AS ITS OWN FINAL PR. It is the
   most visible change to an approved composition and must be judged on its own rather than buried
   in a pile of other diffs. ⛔ Do not fold it into the polish PR.

TERRITORY (do not edit outside it): dashboard/[eventId]/schedule/page.tsx · lib/checklist.ts +
checklist page · lib/customer-menu.ts · after/finished-event-summary.tsx ·
dashboard/[eventId]/vendors/page.tsx · dashboard/[eventId]/page.tsx · lib/budget-build.ts ·
lib/progress-stages.ts · dashboard/(launcher)/page.tsx + its _components/home-pill-nav.tsx ·
the dashboard layout that must host the pill · dashboard/[eventId]/_components/event-dashboard.tsx ·
app/globals.css (ONLY the `.sn-h1` / mono rules named in D-2 and D-8 — the palette and typeface
tokens in that file are owner-locked and are NOT yours) · those two guard tests.
⛔ NOT yours: app/api/og/realstory-slug/** (moved to W2-A).

ALSO YOURS: `app/dashboard/[eventId]/_components/customer-nav-fab.tsx` (the one-line comment above).

Aim for 5 PRs, defects first and the most visible change LAST:
 (1) the four finished-event items
 (2) the launcher items AP-1 + AP-6 + D3's dead rows + the FAB comment
 (3) the caption D-1/AP-7
 (4) the event-dashboard polish D-3 · D-5 · D-6 · D-4 + the two CSS items D-2 · D-8
 (5) ON ITS OWN: the photograph on the focal card + one event card on phone and laptop.
No migration.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W1-B · Retire Pabati, and let the buy pages sell · **Opus 5 · xhigh**

```
🔓 **GATE SATISFIED 2026-08-22 21:57Z — #4708, #4711 AND #4723 ARE ALL MERGED, and production is
serving the last of them. YOU MAY START.** (Re-confirm with `gh pr view <n> --json state,mergedAt`
anyway — that costs seconds and this file rots.)
📋 WHY THOSE THREE WERE THE GATE, since you no longer have to wait on them: all three edited the
exact files this retirement deletes — the papic buy action, the vendor-side photo-challenge path
and the challenge libraries. Landing an ~80-file DELETION into that window would have made a
deliberate retirement indistinguishable from the accident that was being repaired at the time.

Read WHATS_NEXT_Studio_Is_One_Concept_2026-08-22.md in full. It carries the owner's rulings, the
enumerated scope and the traps. Four pieces, in this order, as separate PRs:

PR1 — RETIRE PABATI. Owner, 2026-08-21: "we do not need pabati. retire it because it is part of
papic." This SUPERSEDES PR #4704, which made it FREE hours earlier on an earlier instruction.
Safe by measurement: 0 greetings ever recorded, 0 sales ever, 1 challenge row of 631 — against 284
clip challenges that already do the job. The scope doc estimates ~50 files; the real count measured
2026-08-23 is ~80 EDITABLE files (92 matches, minus 8 test files and ~10 APPLIED migrations, which
are never edited).
  🔑 THE CAPABILITY DOES NOT DIE WITH THE PRODUCT. Convert the one library row (slug `pabati`,
     "Leave the newlyweds a video greeting") to capture_kind='clip' so a guest can still leave a
     greeting — recorded the way they record everything else.
  🚨 MAKING A SKU DISAPPEAR TAKES TWO HALVES OR YOU DO THE OPPOSITE. Free and retired are the same
     row in the catalog and opposite in the product. Deactivate the row AND remove it from
     FREE_FOR_ALL_SKUS in lib/entitlements.ts (and lib/v2/sku-catalog-v2.ts, lib/v2-catalog.ts,
     (shell)/pricing/page.tsx, onboarding-pricing.ts, persona-packs.ts, experience-personas.ts,
     api/v1/billing/initialize-maya/route.ts).
  🚨 lib/llms-txt.ts: drop PABATI from REQUIRED_RETAIL **and** its prose line, and update the
     hand-written test fixture IN THE SAME PR. Retiring a row that file still advertises THROWS and
     drops the whole AI/GEO document to its 603-byte stub. That has already happened in production
     once, with PAPIC_ADDON_STORIES.
  Also: delete app/pabati/, app/api/pabati/, lib/pabati.ts,
  lib/offline/service-handlers/pabati-handler.ts (+ its registration in sync-daemon.ts and
  offline/types.ts), app/[slug]/_components/pabati-prompt.tsx and its mount in site-body.tsx; drop
  the third member of CaptureKind in lib/papic-missions.ts and the `pabatiActive` threading behind
  it; drop the empty pabati_clips table (0 rows, follows the LED-backdrop precedent).
  ⛔ MUST NOT TOUCH: the Papic shot ladder (PAPIC_GUEST_100/PAPIC_GUEST/PAPIC_GUEST_10K/
     PAPIC_GUEST_20K) — owner-locked, features are free and SHOTS are the product;
     PAPIC_ADDON_THANK_YOU (₱2,499) stays paid; the `greeting` category and its 47 clip challenges,
     which are the replacement.
  ⚠ A CATALOG ROW IN PROD IS NOT WHAT THE MERGED MIGRATION SAYS — query the object; #4704's
     migration had not applied because nothing was deploying.

PR2 — NINE BUY PAGES HAVE NO HEADLINE. This is the complaint that started the stream: "i tried
unlocking setnayan AI ... it does not look appealing." Nine in-app pages take money and render no
visible headline: dashboard/[eventId]/studio/{papic, custom-qr-guest, editorial-pro,
indoor-blueprint, save-the-date, patiktok, setnayan-ai, website-pro, supplies-marketplace}. The
sell lines are authored and invisible ("Stop guessing who to hire").
  ⚖ THE FIX IS NOT PUTTING THE PAGE HEADER BACK. PageMasthead was deliberately reduced on
    2026-08-21 and is owner-locked and CORRECT for the ~380 pages a person lives in. A buy page is
    the opposite case — the person has not decided anything yet. Give those nine a hero of their
    own: product name, one-line promise, price, above the fold.
  🔑 RULE 0: app/_components/marketing/_doorway.tsx already solves this for the eight public
    product pages. PORT IT. Do not draw a new one.

PR3 — the Setnayan AI page: eight cards in a 3-column grid leaves an orphan last row and reads as
unfinished (setnayan-ai/_components/setnayan-ai-value.tsx ~:130); the price sits in a plain
sentence at the bottom of a tile (~:266). Same file as PR2 touches — do them together if simpler.

PR4 — the Studio rail rows are UNLIT (named debt, not an oversight). Lighting them needs ONE match
list spanning app/_components/frontdoor/front-door-shell.tsx (~:642 documents the hazard) and
dashboard/[eventId]/_components/event-rail-context.tsx: run separately, "3D Plan" (/seating/lab)
and the event menu's "Seat plan" (/seating) BOTH light, and two lit rows read as broken.

ALSO YOURS — OWNER RULED 2026-08-23 THAT CORRECTING THE STORY WE WROTE FOR HER IS FREE.
Owner, verbatim: "keep it free if this costs us nothing." MEASURED: it costs nothing. Every perk
behind the PRO chip in website/editorial/_components/editorial-editor.tsx is a PRESENTATION CONTROL
over data the couple already owns — reordering rows and sections, naming moments, choosing featured
wishes. They are `disabled` attributes on buttons: no render, no storage, no external call, zero
marginal cost. By his own rule they go free.
🚨 BUT MAKING A SKU FREE TAKES TWO HALVES OR YOU DO THE OPPOSITE — you already know this from the
Pabati work in this same session. Off sale ALONE means nobody owns it and the feature goes DARK for
everyone. Free means: the controls ungate AND the SKU joins FREE_FOR_ALL_SKUS in lib/entitlements.ts
AND lib/llms-txt.ts is updated in REQUIRED_RETAIL and its prose line and its hand-typed fixture, or
the whole AI/GEO document drops to its 603-byte stub — which has already happened in production once.
🛑 AND STOP BEFORE YOU RETIRE ANYTHING. If every perk on this editor goes free, DOES EDITORIAL PRO
STILL MEAN ANYTHING? A sold SKU with nothing behind it is the worst of both states. That question
has NOT been put to the owner. Ungate the controls, ship that, and SURFACE THE SKU QUESTION IN YOUR
REPORT. Do not answer it, and do not retire the SKU on your own.
⚠ And name the cost honestly when you report: he meant RUNNING cost. Forgoing a sold upgrade is a
revenue decision — his to make, effectively made, but say it plainly rather than letting it read as
a no-op.

ALSO YOURS: the story page's gold eyebrows fail AA. app/[slug]/_components/editorial/
editorial-content.tsx has 10 `text-terracotta` hits (~7 eyebrow sites) plus 1 in living-moments.tsx.
In this repo the slot named `terracotta` is the GOLD #A9834B — measured 3.48:1 on the now-white
ground, below the 4.5:1 floor for 12px text. The component's own docblock names champagne-gold as
a deliberate editorial accent, so fixing one makes it the odd one out: treat it as a
whole-component call, not a rider. text-mulberry (4.61:1) or text-link (8.22:1) are the passing
slots. Check BOTH themes — a light-only contrast check waves through a token that flips on dark.

Migration: YES (deactivate the SKU + drop the empty table). Allocate forward with
`pnpm migration:new`. Dry-run against prod in a ROLLED-BACK transaction first — the PGlite replay
runs as superuser and will not catch a permissions problem.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W1-C · Make the paperwork true · **Sonnet 5 · medium**
*(It briefly gained two app-wide CSS items from the Apple-Invites comparison and was raised to
Opus. **Both were withdrawn on 2026-08-23 — they would have reversed an owner lock (§ 0b).** It is
documents only again, and Sonnet again.)*

```
Documents only. You will not touch app code, and no test can catch a mistake here — read carefully.

🛑 TWO APP-WIDE CSS ITEMS WERE BRIEFLY ADDED HERE AND ARE NOW WITHDRAWN — an app-wide typeface
change and a single strength of the action colour. BOTH WOULD HAVE REVERSED AN OWNER LOCK. The
front door's own stylesheet is headed "WHAT IS LOCKED HERE (owner 2026-08-11, this page only)" and
lists gold #8C6932 action buttons at 4.86:1 and "the SYSTEM typeface, not the app's serif", with
that stack authored explicitly as --fd-sys. See § 0b.
⛔ DO NOT REINSTATE THEM. Do not touch globals.css, front-door.css, home-reskin.css or
front-door-opening.tsx in this session. This session is DOCUMENTS ONLY.

1. RECONCILE THE ~28 PER-SURFACE PROTOTYPES to the shipped palette and the shipped app shell
   (corpus prototypes/*.html). RECONCILE, NEVER REDRAW: they are still correct about composition
   and carry only the old palette. A delta between a ported screen and its archetype is a defect in
   the PORT, not a fresh design decision.
   The palette, owner-locked: page ground is WHITE #FFFFFF since 2026-08-20 (the token is still
   NAMED `cream` — do not "fix" the name) · ink #2C2A29 · action #C24E25 · gold #A9834B is
   DECORATIVE AND UI-ONLY, never body copy · link #3B4E67. In this repo the Tailwind slot named
   `terracotta` is the GOLD and the action colour lives in the slot named `mulberry` — inherited,
   backwards, and the single most common colour mistake made here.
   ⛔ The 19 approved archetypes/overlays are BINDING (owner approved all 19 on 2026-08-04, no
   changes). Do not ask for them to be reviewed again.
2. ⚠ MEASURE BEFORE YOU EDIT — MOST OF THIS IS ALREADY DONE. Checked 2026-08-23: the ADOPTED
   privacy manual already carries the corrected retention row ("for life", no scheduled deletion,
   nothing ever deleted) and no claim of Philippine hosting was found in it. The one remaining
   "90 days" in that file is about MARKETING SAMPLES being removed within 90 days of revocation —
   a different, correct rule. DO NOT "fix" it. DO NOT edit the superseded DRAFT files; a DRAFT
   corrected to match today's ruling is worse than one that reads as history.
   Grep the whole pack yourself, list what genuinely still misstates something, and if the answer
   is "nothing", SAY SO AND STOP THAT ITEM — that is a result. The claim you may have inherited is:
   four rows say the data is in the Philippines —
   it is not: the database and the face vectors are in SINGAPORE, media is in APAC object storage,
   and NOTHING is hosted in the Philippines. Two rows still quote the retired 90-day rule; the
   ruling is: the full-resolution original is replaced by its compressed copy six months from the
   event's FIRST capture, never sooner than three months after the event ENDS, and the compressed
   gallery is kept free FOR LIFE. NO PHOTO IS EVER DELETED — only its resolution changes.
   ⚠ Wording that a regulator reads is the DPO's call, and the DPO is the owner. Apply the factual
   corrections; FLAG any sentence where the change is a matter of positioning rather than fact.

DONE WHEN: every prototype states the current palette · the pack makes no claim of Philippine
hosting · every retention sentence matches the current ruling · and you have listed for the owner
exactly which sentences you changed and which you flagged instead.
⚠ NOTE THE CARE IN THAT SECOND-TO-LAST CLAUSE. It is NOT "no 90 days appears anywhere" — the
marketing-samples rule legitimately says 90 days and must survive. A blanket sweep for the number
would delete a correct rule. Match the MEANING, never the digits.
✅ AND "NOTHING NEEDED CHANGING" IS A VALID ENDING. If the pack is already true, say so and stop.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

---

## WAVE 2 — three at once

### W2-A · A guest can keep their code · **Opus 5 · high**

```
🔒 Needs W1-B merged — you share app/[slug]/_components/site-body.tsx.

Read WHATS_NEXT_Guest_Activation_2026-08-22.md IN FULL FIRST. This chain was mapped TWICE in one
session (74 agents, ~11M tokens) and the answer barely moved. DO NOT RE-RUN THE MAP. Its Section 1
lists 13 links that ALREADY SHIP — the personal QR exists the instant the guest's row is written,
the shared door works, Papic is free and on for every event, the day-only rule is enforced at the
upload, and the "confirm who you are, then you're in" screen the owner describes ALREADY EXISTS
fully written at /{slug}/welcome (fenced to plus-ones today). Rebuilding any of it is the
paid-twice mistake.

BUILD THESE SEVEN. Extend the named thing; never draw a new one.
1. A GUEST CANNOT KEEP THEIR QR. No save, download, print or copy — it is inline SVG, so a
   long-press offers nothing and a screenshot is the only way. And one of the three surfaces
   literally says "Save this to your phone" — a promise the page gives them no way to keep.
   🔴 RE-READ 2026-08-23 — THE OBVIOUS EXTENSION WOULD GIVE AWAY A PAID PRODUCT. The per-guest PNG
   at app/api/website/qr/guest/[guestId]/route.ts is NOT merely "account-gated": its own docblock
   says it requires the event to OWN a paid CUSTOM_QR_GUEST order (₱1,499), because that PNG is the
   BRANDED variant carrying the couple's Mood Board palette. Opening it to every guest hands out a
   sold SKU for free, which is a pricing decision and NOT yours.
   BUILD THE PLAIN ONE INSTEAD: an unbranded PNG of the guest's own QR, which is the thing the copy
   promises. Keep the branded, paid route exactly as it is. If you cannot separate them cleanly,
   STOP THAT ITEM, do the other six, and say the branded/plain split needs an owner ruling.
   ⚠ A dead "Download PNG" label already ships into every page's HTML from a menu registry,
   pointing at a route that does not exist and rendered by nothing. A grep of the live site will
   "find" a guest QR download that has never existed. Do not take it as evidence.
2. The web address under the QR is dead text — not copyable, not sendable (same QR block in
   app/[slug]/_components/site-body.tsx).
3. ⚠ RE-READ 2026-08-23 — THE PREMISE IS RIGHT AND THE DESCRIPTION IS WRONG. The screen
   (app/join/[eventId]/check-email/page.tsx, 47 lines) has NO button and NO link at all; the only
   way out is the shared wordmark in the door shell, which goes to the marketing site. It ALSO
   already says "You're already on the guest list — the link just lets you sign in later. You can
   close this tab."
   So: add a way INTO the celebration without contradicting that copy — it must not imply they must
   act. And check what they actually hold at that moment: they have no account yet, so confirm a
   guest session exists before offering a door that will refuse them. EXTEND the "Open your
   invitation" affordance its sibling app/join/[eventId]/success/page.tsx already has.
4. Nobody who joins is told they are ON THE LIST. The one visible status word is "pending", which
   reads as NOT FINISHED (rsvp-widget.tsx ~:375-382).
5. Nothing points a guest at the reply card, so the mobile / email / preferred-name boxes sit on a
   screen they never find. EXTEND the quick-link chips already on their summary card
   (guest-hub-bar.tsx).
6. 🔴 A GUEST CAN OVERWRITE — OR BY SAVING BLANK, ERASE — CONTACT DETAILS THE COUPLE TYPED.
   The front door refuses this (`.is('email', null)`, fill-a-blank); one screen later the
   protection is gone (app/[slug]/actions.ts ~:233 and ~:453 write unconditionally). That address
   is a SIGN-IN KEY, not a note. This is the one with real consequences — do it first.
9. A guest cannot say who they are bringing, though the couple is promised in writing that the
   name will arrive. No name ⇒ no row ⇒ no QR ⇒ no camera for that person.

🛑 7 AND 8 — THE OWNER RULED ON 2026-08-23 AND THE ANSWER IS NOT THE ONE THE BRIEF EXPECTED.
Owner, verbatim: "camera is free the pool shots is the one limited." ✅ THAT IS ALREADY THE SHIPPED
BEHAVIOUR AND HAS BEEN SINCE 2026-08-02 — `eventPapicGuestActive` (lib/papic-guest.ts) opens the
camera on a live pool PAID OR FREE, testing `applies` and deliberately NOT `remaining > 0`, and its
own comment carries his earlier words: "free guests can shoot. Paying buys MORE SHOTS, not more
PEOPLE." Verified in prod the same day: the pool applies on ALL FIVE events.
⇒ SO THE BRIEF'S DIAGNOSIS IS FALSE. It says these two are "kept alive purely by the guest-camera
pack still being paid". That pack was freed THREE WEEKS EARLIER. Do not build against that story.
⏭ THEY ARE RE-OPENED FOR DIAGNOSIS, and the two surfaces fail for DIFFERENT reasons:
  · /papic/decorate reads `eventPapicGuestActive` — TRUE on every prod event, so its "the host
    hasn't turned on guest cameras" message should never render. If it does, the gate is not the
    one the page appears to read. REPRODUCE IT BEFORE YOU FIX IT.
  · /papic/me/[token] blames the host for `resolveGuestCamera(...).status === 'none'` — a PER-GUEST
    camera that failed to materialise. That is not the host's doing and not a SKU. The copy is a
    lie about the host either way, and the copy is the cheap half of the fix.
🔑 START BY REPRODUCING EACH MESSAGE AGAINST A PROD EVENT WHOSE POOL APPLIES. A refusal you cannot
reproduce is a refusal you cannot fix.

ALSO YOURS — three files in the same guest tree where a refused read renders as blank:
app/[slug]/seat/page.tsx (7 unbound reads, 0 error bindings), find-my-table/, and the unreachable
`photos` plate in _components/empty-states.tsx. Extend the existing _lib/silent-absence.test.ts.

ALSO YOURS — THE COOKIE BANNER. OWNER RULED 2026-08-23: "fix the bug." It re-asks people who have
already answered.
 · The choice lives in localStorage under `setnayan-cookie-consent-v1` (lib/cookie-consent.ts) —
   per-browser, per-ORIGIN, and the banner already hides once `hasDecidedConsent()` is true.
 · ✅ ONE THEORY IS ALREADY ELIMINATED — an origin split is NOT the cause: setnayan.com 307s to
   www.setnayan.com and setnayan.ph does not resolve. Do not spend time there.
 · 🔑 THE LIVE CANDIDATE IS SAFARI'S SEVEN-DAY CAP ON SCRIPT-WRITTEN localStorage, which re-asks a
   returning visitor on the owner's own devices while every automated check passes. Confirm before
   fixing — and if it is something else, say what.
 ⚖ THE FIX MUST STAY PER-DEVICE. A long-lived first-party cookie is still anonymous and is
   engineering. MOVING CONSENT SERVER-SIDE, KEYED TO AN ACCOUNT, IS NOT YOURS — that creates an
   RA 10173 proof-of-consent record and is a DPO decision the owner has NOT made. Do not cross that
   line while fixing a bug.

🔀 THE GUEST PAGE'S DESIGN SET HAS MOVED OUT OF THIS SESSION — see § 0c. AP-3, H-1, H-3, H-4/AP-10
and H-5 now belong to **W3-D**, one wave later, because this session had grown to 14 items and three
different bodies of work under one name. YOU OWN app/[slug]/** THIS WAVE AND W3-D OWNS IT THE NEXT;
the two can never run at the same time. Do the DEFECTS. Leave the design set alone — including the
map and the share card.
⛔ AP-9 (weather) is nobody's yet: it needs a provider chosen, which is an owner decision.

The one design-adjacent thing that IS yours, because it is a lie rather than a look:
 ✅ THE GUEST VIEW IS NOW PARTLY MEASURED — 2026-08-23, and I REPRODUCED IT INDEPENDENTLY. An
   anonymous GET of https://www.setnayan.com/cale-ice with no cookies and an iPhone user agent
   returns 200 and 271,675 bytes — a stranger gets the real page, not a lock screen. Both runs
   agreed exactly:
     · "AS A GUEST SEES IT" 0 · "Edit this site" 0  ⇒ NO OWNER CHROME LEAKS. The earlier worry that
       the preview bar distorted those readings is ANSWERED: it is simply not there for a guest.
     · The whole 7-beat film IS server-rendered for a stranger ⇒ H-4 targets a surface guests reach.
     · "Add to calendar" appears EXACTLY ONCE, at the film's closing beat ⇒ H-5's premise is now a
       MEASURED FACT, not an inference: a guest who leaves the film early never gets it.
     · font-mono appears 12 times ⇒ the mono chrome really is guest-facing.
   ⚠ THIS COVERS THE SERVER RENDER ONLY. A fetch is not a browser; anything client-rendered is
   still unmeasured.
 🛑 SO H-1 IS THE ONE ITEM STILL UNCONFIRMED, AND IT IS SUBTLE. "lift the veil" and "double-tap"
   are ZERO occurrences in the anonymous HTML — DO NOT READ THAT AS "guests never see the veil".
   The overlay is CLIENT-rendered, so a fetch cannot see it. The honest state is UNMEASURED, not
   absent. OPEN H-1 BY LOADING THE PAGE IN A SIGNED-OUT BROWSER AND LOOKING, before you change
   that pill.
 📊 AND H-3's DEPENDENCY IS NOW SETTLED — I QUERIED PRODUCTION. `event_editorial` holds 5 rows:
   ZERO published, ZERO with a hero photo. So the photo card cannot render for anybody today, and
   shipping H-3 changes nothing visible on the live site.
   ⇒ BUILD IT AGAINST A FIXTURE AND ASSERT IT THERE. Do NOT expect to see it live, do NOT go
   looking for the missing photos, and DO NOT report the emptiness as a defect — prod is
   pre-launch and zero rows is the plan.

🪤 TWO SURFACES FOR ONE THING, TWICE in this stream already — the seat-finder vs the join door, and
the big QR CARD (phase-gated) vs the My QR BUTTON (not gated at all). ENUMERATE EVERY SURFACE
before reporting an affordance absent.

2–3 PRs. No migration.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W2-B · Delete what we said we would delete · **Opus 5 · xhigh**

```
Two retention promises are written, signed off by the owner as DPO, and NOTHING RUNS THEM. Read
WHATS_NEXT_NPC_Pack_Findings_2026-08-17.md first.

1. FACE DATA IS NOT ACTUALLY DELETED. The privacy pack says face data is deleted three months
   after the event ends; the pack's own text admits "ENFORCEMENT NOT YET BUILT" and there is no
   job in the lib/ job registry that does it. ⚠ CHECKED 2026-08-23: lib/retention-sweep.ts EXISTS
   but purges CHAT ONLY (5-year default, via purge_expired_chat) — it is not this. Copy ITS SHAPE:
   `claimPeriodicJob(<name>, WEEKLY_GAP_MS)` from lib/periodic-jobs, driven cron-free from request
   traffic, best-effort, never throws. lib/vendor-dossier-retention.ts is the other precedent.
2. A SUPPLIER'S ID IMAGE AND LIVENESS VIDEO ARE NOT DELETED 90 days after their decision. No job
   exists — the dossier-retention job covers Deep Search data, not identity files. These live in
   the vendor-verification object-storage bucket, which is separate from the media bucket and is
   NOT covered by the admin media screen.

THIS IS THE ONE PLACE IN THE PLAN WHERE OVER-DELETING IS WORSE THAN THE GAP. Both are irreversible
and both are legally load-bearing under RA 10173. Requirements:
- Compute "the event ended" from the ONE resolver the product already has — an event is over at
  06:00 in the venue's clock on the day AFTER its LAST day (event_end_date where a celebration
  spans days, else event_date). Do not invent a second definition; the product having two answers
  to that question is a defect this codebase has already paid for.
- The sweep must be idempotent, must log what it deleted, and must be provable on a seeded fixture
  BEFORE it can touch anything real.
- Ask "what un-does this?" at write time. A forward primitive with no inverse has bitten this repo
  before. There is no inverse here — which is exactly why the dry-run and the fixture matter.
- Prod holds 14 Papic photos and 2 shops. Test the boundary, not the volume: an event that ended
  yesterday, one that ended 89 days ago, one that ended 91 days ago.

⛔ NOT IN SCOPE: the compressed gallery, which is kept FOR LIFE, and the full-resolution
compression sweep, which already ships and is default-on. NO PHOTO IS EVER DELETED — only its
resolution changes. Face VECTORS are a different thing from photos; do not conflate them.

ALSO YOURS, READ-ONLY THIS WAVE: 15 privacy-pack findings were never verified because the
verification fan-out died on a usage limit. Verify them, write down what survives, and QUEUE any
fix that falls outside your territory rather than applying it.

2 PRs. No migration.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W2-C1 · The gold nobody can read · **Sonnet 5 · medium**

```
Mechanical sweep, one colour, admin only.

app/admin/** uses the gold as TEXT in **106 places across 51 files by the existing guard's own node
regex**, and **207 across 82 files by a plain `grep -rho "text-terracotta" app/admin`**.
⚠ BOTH NUMBERS ARE REAL AND MEASURE DIFFERENT THINGS. Say which method you used, and move THE
GUARD'S number to zero — the guard is what fails CI; the raw grep also counts icon uses and
comments, which are legitimately allowed to stay. On this product's white ground that measures 3.37:1, below
the 4.5:1 floor. In this repo the Tailwind slot NAMED `terracotta` IS that gold, and the real
action colour lives in the slot named `mulberry` — inherited and backwards, which is why this
mistake keeps being made. Reach for `text-mulberry` (4.61:1) or `text-link` (8.22:1).

RULES:
- Gold on an ICON stays — 3.37:1 clears the 3:1 non-text bar. Only TEXT moves.
- Check BOTH themes on any tinted block. `mulberry-700` measures 5.86:1 light and 3.05:1 DARK,
  because that slot flips on a dark panel; `mulberry-600` measures 4.92 / 5.78. A light-only check
  waves the dark failure straight through.
- BEFORE you sweep, an Opus session or your own first PR must land the guard, and the guard must
  be MUTATION-TESTED BY OCCURRENCE COUNT (print before → after). Two contrast guards have already
  missed a real AA failure in this repo — one checks token DEFINITIONS, the other only judges
  pairings where both sides are opaque, and the failure lived in the seam between them.
- Territory is app/admin/** and nothing else.

One PR. Report the occurrence count before and after; "106 → 0" is the deliverable.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W2-C2 · Ninety-five admin routes, one shape · **Opus 5 · high**

```
✅ W2-C1's SWEEP HAS MERGED (PR #4738, 2026-08-23) — you are clear. Same territory:
app/admin/** exclusively.
📏 RE-MEASURED 2026-08-24: gold-as-text in `app/admin` is now **150 occurrences across 67 files by
raw grep**, down from 207 across 82. The remainder is the legitimate kind — icons and comments,
which the guard's own regex excludes. ⛔ DO NOT "FINISH" THE SWEEP by driving the raw number to
zero: you would be recolouring icons that pass contrast at the 3:1 non-text bar. The guard is the
authority on what still counts.

The admin console is ~95 routes and 33 raw tables, each screen effectively its own invention.
Converge them on ONE archetype. The 19 archetypes were approved by the owner on 2026-08-04 and are
BINDING — port them, never redraw. A delta between a ported screen and its archetype is a defect in
the port, not a fresh design decision.

RULE 0 APPLIES HARDEST HERE — the persistent app shell ALREADY SHIPS AND IS MOUNTED, and a session
was once told the opposite for six days. Before drawing anything, name the shell component, the
mounted navs, and the primitives that already exist. Rebuilding them is described in this project's
own docs as "the paid-twice mistake at its largest scale."

Also true and easy to miss: /admin/work is ALREADY the ranked work list and /admin/more is ALREADY
the all-surfaces map. Extend them.

3–5 PRs, one coherent group of routes each. No migration. Internal-only, so it ships last in its
wave and nothing customer-facing depends on it.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

---

## WAVE 3 — three at once

### W3-A · "You have none" must mean none · **Opus 5 · high**

```
🔒 Needs W1-A merged — you share dashboard/[eventId]/vendors/page.tsx.

⚠ THE ORIGINAL BRIEF SAID "~30 files, and the vendors page has 45 unbound reads". THAT IS WRONG.
MEASURED ON MAIN 2026-08-23 AND RE-MEASURED 2026-08-24 AFTER WAVES 1 AND 2 LANDED — unchanged both
times:
    grep -rn "const { data } = await" "app/dashboard/[eventId]"   →  19 hits across 14 files
    app/dashboard/[eventId]/vendors/page.tsx                      →  3 unbound, 12 already binding
Most of that page was fixed long ago. RE-RUN THE COUNT YOURSELF before scoping; if it shrank again,
ship the smaller fix and say so. ⛔ DO NOT rewrite reads that already bind their error — that is the
rebuild this project keeps paying for.

The remaining unbound reads render a REFUSED read as an EMPTY FACT: a couple reads "you have no
suppliers" and it is not true. The same class was already closed in two other trees — copy
those, do not invent a third pattern:
  apps/web/app/vendor-dashboard/reads-are-honest.test.ts (lane B, 31 reads / 16 files)
  and the explore/tour/papic/panood sweep (lane C, 20 reads) which shipped WITHOUT a per-tree
  guard — that omission is why this lane must ship one.

REQUIREMENTS
- Supabase DOES NOT THROW. It resolves with { error }. A try/catch around a read is decoration,
  and `?? []` turns a refusal into "nothing here".
- Distinguish the three states honestly: empty · could not be read · refused by permission. A
  failed count returns 0, and 0 looks exactly like "you have none".
- SHIP THE PER-TREE GUARD (app/dashboard/reads-are-honest.test.ts) and MUTATION-TEST IT BY
  OCCURRENCE COUNT. This repo has shipped at least six guards that passed while the thing they
  guarded was gone: one proved a card was imported not MOUNTED, one matched a file-level substring
  so a comment exempted the file, one could not fail at all. Assume yours is decorative until you
  have watched it go red.
- Fail toward the caveat. A partially-refused list must say so rather than present itself as
  complete — a coordinator once read only the vendor documentation shots under a card headed
  "Your gallery".

TERRITORY: apps/web/app/dashboard/[eventId]/** plus the new guard. 2–3 PRs. No migration.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W3-B · A supplier's card earns its keep · **Opus 5 · high**

```
🔒 Needs #4563 and #4699 merged (wave 0) — they hold vendor-dashboard files.
Read WHATS_NEXT_Card_Family_Handoff_2026-07-29.md first: 11 PRs already shipped in this stream and
its locked principles govern. Do not rebuild the maker, the card or the details sheet.

FOUR THINGS, smallest first:
1. MID-EDIT SAVE NAVIGATES AWAY and the clip pill shows a placeholder instead of the real duration
   (coverage-actions.ts, ShowcaseMediaFields). Small, no schema, do it first.
2. START FROM ONE OF YOUR CARDS. A vendor creating a new listing cannot copy an existing one —
   services/new/[category]/page.tsx takes only { claim? }. Owner asked for this on 2026-07-28.
3. "WHAT COUPLES ACTUALLY PICKED" on the Card Record. Verified absent: zero references to
   event_vendor_item_options anywhere. Needs a new table plus a write at lock time.
   🔒 THIS PUBLISHES AN AGGREGATE ABOUT OTHER PEOPLE'S MONEY. Apply the K-floor from the stream's
   own doc: below the floor, show NOTHING — not a rounded number, not "fewer than K". And the
   floor must be enforced in the QUERY, not in the component; a component-level floor ships the
   raw number to the browser.
4. REPLY-TIME BADGE + the count of celebrations this supplier documented. Same rule: a minimum-N
   floor, enforced server-side. A supplier with two replies must not get a badge implying a record.

⚠ PRICING AND CLAIMS ABOUT SOMEBODY ELSE: moving a partnership INTO a pricing claim re-asks the
partner and drops their acceptance — the same principle applies to anything you publish on a
supplier's behalf. If a number could be read as a claim the supplier did not make, do not publish
it.

Migration: YES (one new table). Allocate forward with `pnpm migration:new`. RLS at CREATE TABLE
time, using one of the 8 canonical patterns — no invented patterns. Another session is writing a
migration this wave; yours must touch only your new table and read chat_threads. Do not touch
event-type tables.

3 PRs.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### 🛑 W3-C · A wake is not a celebration — **SUPERSEDED 2026-08-23. DO NOT RUN THIS SECTION.**

**It merged into W4-WORDS** (see § 0c), because the wake's per-type wording and H-7 ("a birthday
page stops calling the family the couple") are the SAME mechanism — the per-event-type vocabulary.
Run apart, the second rebuilds what the first threaded. **Use W4-WORDS. The block below is kept only
so a reader who was pointed here finds the redirection instead of a missing section.**

<details><summary>The superseded block</summary>

```
The owner already said yes to this (2026-08-17, "yes to all four"). Verified absent 2026-08-23: no
`funeral` anywhere in lib/event-type-profile.ts, lib/event-words.ts, or any migration.

A family arranging a wake or a funeral gets an event that never says "celebrate", never says
"party", never counts down to a happy day, and never offers a save-the-date.

THE WORDS ARE THE PRODUCT HERE. Draft every user-visible string with Fable before wiring anything —
a wake screen reading "Let's get this celebration started!" is not a copy bug, it is the entire
defect. Then wire them with Opus.

WHERE IT LANDS: lib/event-type-profile.ts · lib/event-words.ts · lib/checklist-event-type-defs.ts ·
a migration for the event type · and the guest-facing tone strings under app/[slug]/**.
🔒 You share app/[slug]/** with wave 2 — do not start until W2-A has merged.

THINGS THIS PRODUCT HAS ALREADY LEARNED, which apply directly:
- The onboarding flow ASKS WHAT IT ALREADY KNOWS. Do not add a screen that re-asks something the
  previous screen carried.
- Raw option keys have leaked to customers before (`1st_birthday`, `adult_regular` on screen).
  Every option needs a label, and the option type may not have a label slot — check before
  assuming the renderer can fix it.
- Removing a screen at runtime is NOT the way to drop a question: out of range is a render-time
  THROW, and removal disarms the "you already have one of these" walk-back.
- There is a settled checklist for adding an event type in the corpus. Follow it; do not derive
  a new one.

Migration: YES (event-type tables only — another session is writing a migration this wave against
a different table set). 2 PRs: schema first, then tone.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

</details>

---

## WAVE 4 — three at once

### W4-A · The four screens a couple lives in · **Opus 5 (first screen) → Sonnet 5 (the rest) · medium**

```
🔒 Needs W3-A merged — same tree.
MEASURE FIRST, DO NOT BUILD FIRST — AND YOU CARRY ONE MEASUREMENT THAT IS NOT YOURS TO BUILD FROM.

📏 THE FONT TALLY (inherited from the withdrawn AP-2, see § 0b). NOBODY HAS EVER MEASURED THE
COMPUTED TYPEFACE ON AN APP SURFACE. A session tallied it on the FRONT DOOR — the one page in this
product with its own owner-locked visual identity, which authors a system stack ON PURPOSE — and
reported the result as "the app". While you have these four screens open at 375pt, tally the
computed font-family across /dashboard and /dashboard/[eventId] and REPORT THE NUMBER.
⛔ DO NOT OPEN A BUILD FROM IT UNLESS THE APP ITSELF IS FALLING BACK, and if it is, say so and STOP
— "which typeface does shared chrome wear" is an OPEN OWNER DECISION (ONE_SHELL_PLAN_2026-08-13.md
§5.3), and this project has twice ended up with a lock nobody remembers agreeing to by answering a
question like that silently.

This brief is ERODED TWICE OVER NOW: the guests screen was reworked on 2026-08-22, the app-wide
header retirement touched all four, AND ⚠ **W1-A shipped SEVEN PRs into this tree on 2026-08-23** —
the event card gained a photograph, phone and laptop now show one card, the progress caption was
renamed, and several small defects were fixed. **Part of what this brief calls "undesigned" may now
be designed.** Re-diff each of the four against its archetype and report the REAL delta before
writing code. If a screen already matches, say so and skip it — that is a result. Re-diff each screen against its
approved archetype and report the REAL delta before writing code. If a screen already matches, say
so and skip it — that is a result, not a failure.

Guests · suppliers · budget · photos (app/dashboard/[eventId]/{guests,vendors,budget,alaala}/**).
The 19 archetypes are BINDING (owner approved 2026-08-04, no changes requested). RECONCILE, NEVER
REDRAW — a delta between a ported screen and its archetype is a defect in the PORT, not a fresh
design decision. Do not ask the owner to review them again.

Opus does the FIRST screen and establishes the pattern plus the guard. Sonnet repeats it for the
other three. If a screen needs a judgement call the pattern does not answer, it goes back to Opus —
it is not a repeat.

Palette, owner-locked: ground WHITE #FFFFFF (token still NAMED `cream`) · ink #2C2A29 · action
#C24E25 · gold #A9834B decorative only, never body copy · link #3B4E67. The slot named `terracotta`
is the GOLD; the action colour lives in the slot named `mulberry`. Check contrast in BOTH themes.

2–4 PRs after the re-measure. No migration. Do not edit vendors/actions.ts.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W4-B · Sixty-three supplier screens · **Opus 5 (the kit) → Sonnet 5 (the sweep) · medium**

```
🔒 Needs W3-B merged — same tree.

app/vendor-dashboard/** is ~63 screens built from 23 one-off components. Converge them on the
shared kit and the approved archetypes. Opus builds the kit and the first two screens; Sonnet
sweeps the rest behind a guard that has been mutation-tested by occurrence count.

RULE 0: the shell, the rails and the primitives ALREADY SHIP AND ARE MOUNTED. Name them before you
draw. Rebuilding a mounted shell is the largest-scale version of the paid-twice mistake in this
project's history.

Same palette rules as W4-A, both themes. The supplier is the person we are asking to trust us with
their business — treat the port as a trust surface, not a repaint.

4–6 PRs. No migration.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W4-C · Shut the doors nobody uses · **Opus 5 · xhigh**

```
You are the ONLY migration writer in this wave.

⚠ RE-MEASURED IN PRODUCTION 2026-08-23: **235** anon SELECT grants across 384 public tables — not
the ~290 the older brief says; batches have landed since. Re-run the count before scoping.
Anonymous read grants exist that nothing needs, plus two views flagged as carrying elevated
rights (events_host, vendor_completed_events) that have never been checked. Continue the existing
batch pattern: apps/web/tests/db/anon-table-grants-closed.db.test.ts records which batches have
landed, and its own note says the EASY category is now EMPTY. What remains is delicate — tables
whose policies merely exclude anon, several reached by the service role, where the damage is felt
only at runtime.

RULES THAT MAKE THIS SURVIVABLE:
- Small batches, one PR each, each proved before the next.
- READ THE COLUMN DEFAULT BEFORE YOU REVOKE. A revoke on a column whose default is the privileged
  value ships silent universal auto-approval — that exact trap was caught once here, and it would
  have been worse than the bug.
- A COLUMN-LEVEL REVOKE CANNOT CARVE A HOLE IN A TABLE-LEVEL GRANT — and it applies WITHOUT ERROR,
  so the only way to know is to MEASURE THE SURFACE BEFORE AND AFTER. This happened again on
  2026-08-22: the revoke ran clean and the freeze still reported the same anon privileges. The
  session DELETED its own migration rather than ship it, and checked at the POLICY instead — the
  table had no write policy admitting anon at all, so the grants were inert. DO THE SAME: if your
  revoke does not move the measured number, it is not a fix, and shipping it reads as a protection
  that is in place. Pick the tool by what the LEGITIMATE code must NAME: revoke the column when no client
  writes it; use a trigger when the value must exist but the browser must not choose it; tighten
  the policy when the caller legitimately names it with some legal values.
- RLS ENABLED WITH NO POLICY READS EMPTY, SILENTLY — 22 prod tables are already in that state and
  one product warning is dead because of it. Closing a door must not close a working feature.
- `auth.role()` CAN NEVER BE NULL IN THE PGLITE REPLAY (the shim returns 'anon' where prod returns
  NULL), so every `auth.role() IS NULL` privileged branch is dead code in every db test here.
  Derive from `current_user NOT IN ('authenticated','anon')` instead.
- Prove each revoke by BREAKING it: an insert or select that should now fail, that did pass before.
  Print the before → after.

3–5 small PRs. Verify each applied IN PROD BY THE OBJECT after merge.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

---

## WAVE 5 — two to three at once

### W5-A · A supplier's record survives a delete · **Opus 5 · max**

```
You are the ONLY migration writer in this wave. This is the most careful piece of work in the plan.

Read VENDOR_DATA_SURVIVES_DELETION_2026-08-21.md and the owner's rules in the project CLAUDE.md
(2026-08-21) before anything else.

WHAT ALREADY SHIPPED — do not rebuild: the sever-connections trigger, and the migrations that make
a review, the money and a quote outlive the event. A supplier can now answer a deletion request
(PR #4646, merged).

WHAT IS LEFT, AND WHY IT NEEDS MAX CARE:
- ⚠ RE-MEASURED IN PRODUCTION: **145 foreign keys to `events` CASCADE and 19 SURVIVE.** The older
  brief says 152 / 10 — NINE MORE ALREADY SURVIVE than it claims, because work landed after it was
  written. RUN THE COUNT YOURSELF FIRST (`pg_constraint`, `confdeltype`) and scope against the real
  number. Do not re-do a key that already survives.
- The 65-table classification is written up — and ITS ADVERSARIAL CHECK IS INCOMPLETE: 31 of 71 agents were cut off by a usage
  limit and the synthesis never ran. TREAT EVERY ROW AS MAPPED-BUT-UNVERIFIED. Verify before you
  migrate; that verification IS the first half of this session.
- "STORED" DOES NOT MEAN "SURVIVES". vendor_activity_stats is RECOMPUTED by unrelated events, so a
  saved snapshot silently drops to the smaller number. Pin it or the guarantee is cosmetic.
- `ON DELETE` SAYS NOTHING ABOUT `ON UPDATE`, and preserving a parent is an UPDATE.

THE OWNER'S RULE, VERBATIM IN EFFECT: on a SHARED record the vendor keeps it — contracts, payments,
completed bookings. Scoped: it does NOT convert the couple's private planning (budget, shortlist,
who they rejected) into vendor data. THE TEST IS WHETHER THE SUPPLIER TOOK PART IN IT. When a row
is ambiguous, do not decide — list it for the owner.

THE GATE IS IN THE DATABASE, NOT THE ACTION. DELETE on events is REVOKED from authenticated/anon
because there were six app delete paths and a seventh with none. Keep it that way; do not add an
app-layer guarantee the database does not keep.

Getting this wrong destroys a business's history permanently and there is no inverse. Every
migration dry-run against prod in a ROLLED-BACK transaction first — the PGlite replay runs as
superuser and will not catch a permissions failure.

2–3 PRs. Verify each applied IN PROD BY THE OBJECT.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W5-B · The surfaces nobody drew · **Fable (re-scope) → Opus 5 (build) · medium**

```
MEASURE FIRST. Part of this brief is now WRONG: the marketplace moved INSIDE the event on
2026-08-22 (owner: "marketplace is best shown inside an event, not when they just logged in"),
which reverses the 2026-08-12 rule this brief was written under. Re-scope with Fable before drawing
anything, and say plainly which parts of the old brief you are discarding.

ALSO ALREADY DONE, do not redraw: the sign-in and joining doors were ported to one shared shell
(13 of them). The auth half of this brief is finished.

WHAT IS GENUINELY UNDRAWN: the browsing surface, the guided tour, the deeper Papic pages (~11
public routes), and the onboarding questions' content. The 19 archetypes are BINDING — port, never
redraw.

⛔ THE TIER MATRIX IS NOT YOURS. Whether the ~450-cell supplier tier grid stays or goes is an owner
decision. Leave it exactly as it is and flag it.

🪤 A brief that says it was measured was wrong FOUR times in this stream's history — it drew six
public doorways where there are eight, missed that a sold product had no public page at all, and
got the folder count wrong. Re-measure every count you are about to design around.

2–3 PRs. No migration.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W5-C · Who is in my event? · **Opus 5 · medium**

```
🔒 Needs W4-A merged — same tree.
Three small things, all verified still true on 2026-08-23.

1. ONE SCREEN THAT ANSWERS "WHO IS IN MY EVENT". Today the answer is spread across five separate
   routes, all still separate. Build one screen above them; do not replace them.
   ⛔ THE BROADCAST HALF IS NOT YOURS — whether a coordinator nobody promoted may message all the
   guests is an owner decision. Roster only.
2. THE COORDINATOR'S "EDIT THIS SITE" IS A DEAD END. lib/owner-ribbon.ts (~:118) links
   unconditionally to an editor that gates on member_type='couple' (website/editor/page.tsx
   ~:118). They press it and are refused. Either don't show it or make it work — a control that
   refuses the person it is shown to reads as a broken product.
3. DURING A BROADCAST THE HOST CANNOT SEE WHO HOLDS EACH CAMERA — the control page says "Phone
   joined" with no name (panood/control/[eventId]/page.tsx ~:2276). The camera claim knows who
   claimed it.

ALSO YOURS — AP-11 FROM THE APPLE-INVITES COMPARISON (see § 0b): THE COUPLE FACES A BLANK BOX
WHERE THEIR INVITATION WORDS GO. Apple drafts them; we ask the couple to write from nothing. It
lands in this session because it touches dashboard/[eventId]/website/** and the Setnayan AI
surface, both of which collide with wave 1 and wave 3 territory — by now they are clear.
🔑 RULE 0 HARD ON THIS ONE. Setnayan AI is DETERMINISTIC, not a language model — check what it
already generates before assuming anything must be built, and check whether the story page's
auto-draft (which already writes a whole day up from the schedule and the photos) is the mechanism
to extend rather than a second one to invent.

🔑 A GRANTED CAPABILITY NOTHING CALLS IS A GATE WITH NO HANDLE — this repo has found five. Before
building any of the three, grep for a WRITER, not just a column or a function: the mechanism may
already exist with nothing calling it, in which case your job is the handle, not the gate.

2 PRs. A migration only if the camera claim genuinely lacks the name — check first.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

---

## WAVE 6 — runs ALONE

### W6 · The grab-bag, verified first · **Fable (verify) → Sonnet 5 (fix) · medium**

```
NOTHING IN THIS LIST HAS BEEN RE-VERIFIED SINCE 2026-08-06. Expect several to be fixed already —
in a comparable pass, 17 of 58 register items turned out to be done. VERIFY EACH ONE BEFORE
TOUCHING IT, and report the closures as results.

1. SHIPPED FEATURES WITH NO DOORWAY. The peer-comparison numbers page (no mount of
   funnel-benchmark.ts was found), the lucky-date card, the supplier's day-preload button. For
   each: does a person have any way to reach it? If not, add the doorway — do not rebuild the
   feature.
2. The remaining cleanliness items 4–14 from WHATS_NEXT_Cleanliness_Findings_2026-08-06.md —
   saving an event type disabling the website, two queues ordered opposite ways, a dead marketplace
   switch, duplicate converters and readers.
3. Three on-the-day gaps: a supplier can only send the coordinator one of six fixed messages; a
   photographer cannot see their own shots after the day; the band-as-emcee package does not reach
   the coordinator's message box.
4. Anything queued for you by W2-B's privacy verification.
4b. 🔴 BUILD THE ANALYTICS OPT-OUT WE ADVERTISE. The live `/privacy` page tells people analytics
   tracking has an "opt-out available in your profile" — and there is NO such control: no setting,
   no column storing the choice, nothing that could read one. Owner ruled 2026-08-24: the sentence
   comes off the page now (done ahead of you) and the real control is built HERE.
   ⚠ IT NEEDS THREE PARTS OR IT IS THEATRE: a control a person can find · somewhere durable to store
   the answer · and analytics that actually HONOUR it. A control storing a preference nothing reads
   is this project's "gate with no handle", of which five have been found.
   ⚖ KEEP IT PER-DEVICE unless the owner says otherwise. A browser-level choice is anonymous and is
   engineering; moving consent server-side keyed to an ACCOUNT creates an RA 10173 proof-of-consent
   record, which is a DPO decision he has not made.
5. AP-12 FROM THE APPLE-INVITES COMPARISON (see § 0b): EMPTY SCREENS READ AS UNFINISHED RATHER THAN
   DELIBERATE. This is deliberately broad, which is why it is here — you run ALONE and may claim
   any file. 🔑 DO NOT DESIGN A NEW EMPTY STATE: the pattern already exists and that session called
   it the best-designed screen it saw — app/dashboard/(account)/samahan. PORT IT.
   ⚠ Prod is pre-launch, so MOST OF THESE SCREENS ARE EMPTY BECAUSE THAT IS THE PLAN. You are
   improving how emptiness READS, never removing it, and never reporting it as a defect.

⛔ THE "NOT-WORK" LIST IN THAT FILE IS LOAD-BEARING. 18 files are parked ON PURPOSE, 3 are reached
by CI rather than by imports, and a 4,100-line "dead" wizard is LIVE — an audit once recommended
deleting it, which would have broken a working screen for couples. Do not tidy anything that list
names.

Fable verifies; Sonnet fixes what survives; anything touching a migration, a permission, a deletion
or money goes to Opus instead. 3–6 tiny PRs. Nothing else runs while you do this, so you may claim
any file — one at a time.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

---

## ⭑ NEW SESSIONS FROM THE 2026-08-23 RE-BALANCE (see § 0c)

### W3-D · The guest page's design set · **Opus 5 · medium** — wave 3

```
You own app/[slug]/** this wave. W2-A owned it the wave before and its defects have landed; do not
redo them, and do not touch app/[slug]/actions.ts, the RSVP widget or the join screens — those were
its territory and its work is done.

⚠ W2-A WENT WIDER THAN ITS BRIEF AND YOU WILL MEET ITS DIFFS. It swept HTML entities that were
leaking into visible words (a couple was being shown `Jehovah&apos;s Witnesses` as a ceremony
option), and it worked in `date-selection` and `account-switcher` as well as the guest tree. READ
ITS REPORT BEFORE YOU START. Two consequences for you:
  · Strings you were briefed on may already read differently — re-measure before you "fix" one.
  · An entity in JSX children or a JSX attribute is CORRECT and renders fine; an entity in a plain
    JS string used as data is the bug. And ~10 `.ts` files build or ESCAPE html on purpose — the
    seating print routes, the email template, the monogram markup. Those entities are XSS
    protection. DO NOT TOUCH THEM.

Five items, all measured on a real anonymous guest render (see below).

 AP-3 THE INVITATION READS LIKE A RECEIPT, NOT AN INVITATION — a monospaced data face where the
   editorial serif belongs. The guest-facing editorial stack (Cormorant/Manrope) deliberately lives
   outside the dashboard font scope; use it rather than inventing a third register.
 🛑 AP-9 / H-6 — WEATHER IS DEFERRED BY THE OWNER, 2026-08-24: "okay we defer the weather."
   DO NOT BUILD IT AND DO NOT SCOPE IT. It is the only item in the plan that would add a permanent
   outside dependency — a supplier, a recurring cost, a licence, and a third party's name printed
   on a guest's page — for one line of text. The scoping survives in § 0d for whenever a real
   couple asks. This session has FOUR items, not five.
 AP-10 / H-4 — GUESTS GET A LINE OF TEXT WHERE A MAP BELONGS. (Same item; H-4 is its measured form.)
   🛑 I TOLD YOU THE CSP MUST CHANGE IN THIS PR. THAT WAS WRONG AND I CHECKED IT MYSELF —
   `https://www.openstreetmap.org` IS ALREADY IN the enforced frame-src (next.config.ts ~:203), and
   a guard (`csp-embeds-are-allowed.test.ts`) already anchors the draft list to the enforced one.
   THE HISTORY IS REAL AND THE FIX ALREADY LANDED: the vendor map was an empty grey panel on every
   shop page with coordinates because OSM was missing from that list. It is not missing now.
   ⇒ DO NOT EDIT THE CSP. Your only obligation is to ASSERT the host with the existing iframe-host
   test so it cannot silently regress.
   🔑 RULE 0 — THE MAP COMPONENT ALSO ALREADY SHIPS: `app/_components/vendor-location-map.tsx`.
   REUSE IT in `app/[slug]/_components/venue-widget.tsx`. Do not draw a second map.
 H-1 THE VEIL INSTRUCTION READS LIKE A SYSTEM MESSAGE, and "YOU" is stranded on its own line
   (app/[slug]/_components/reveal/reveal-overlay.tsx ~:253–265).
 H-3 (= the former AP-4, MOVED HERE so two sessions are not in one file) A SHARED LINK SHOWS OUR
   BRAND WHERE THE COUPLE'S PHOTO SHOULD BE — three places.
   🔑 RULE 0, CHECKED MYSELF: THE PHOTO RENDERER ALREADY SHIPS. lib/social/realstory-card.tsx has
   `photoOverlayTree`, used when a published editorial carries a hero photo; the branded photoless
   `cardTree` is the FALLBACK. So the job is REACHING the shipped renderer, not building one — and
   note its own line "Reserved for the real-editorial photo-background variant. Null today", which
   is the thing to trace.
   🚨 USE THE STABLE URL, NEVER A PRESIGNED ONE. A presigned URL baked into a crawler's cache
   EXPIRES and the card silently breaks later with nothing to blame. This repo has already paid for
   exactly that on prerendered blog pages.
   ⚠ ITS WHOLE BENEFIT IS CONDITIONAL on the event actually having a hero photo — unverified.
   Check before you promise it.
 H-5 "ADD TO CALENDAR" APPEARS ONLY AT THE END OF THE FILM — it should sit in the same place at
   every stage. ⚠ RE-MEASURED 2026-08-24, AND THE FILE IN THE ORIGINAL BRIEF IS WRONG: it is NOT in
   `empty-states.tsx` (zero occurrences there now). It lives at
   `app/[slug]/_components/save-the-date-film.tsx:726`, inside the film component itself — which is
   exactly WHY a guest who leaves early never sees it. The premise holds; the address changed.
   🔑 GREP THE STRING, NEVER THE LINE, AND NEVER THE FILE A BRIEF NAMES.
 H-7 A BIRTHDAY PAGE CALLS THE FAMILY "THE COUPLE" — 69 guest-read instances across 16 event types.
   THE LARGEST ITEM HERE AND THE ONE WITH THE MOST GUEST-VISIBLE PAYOFF.
   🔑 IT IS THREADING, NOT BUILDING: the words provider is ALREADY MOUNTED in the guest tree
   (event-words-provider.tsx, proven by countdown.tsx consuming it) and the per-type terminology is
   already seeded. 🔒 WEDDINGS MUST READ BYTE-IDENTICALLY AFTERWARDS — assert it, do not assume it.


📏 WHAT IS ALREADY MEASURED FOR YOU — an anonymous GET of a real invitation page (no cookies,
iPhone UA) returned 200 and 271,675 bytes, reproduced twice:
  · NO owner chrome leaks to a guest — the preview bar and the edit link are 0 occurrences.
  · The whole 7-beat film IS server-rendered for a stranger, so H-4's surface is genuinely reached.
  · "Add to calendar" appears EXACTLY ONCE, at the film's closing beat — H-5's justification is a
    measured fact, not an inference.
  · font-mono appears 12 times, so the mono chrome is genuinely guest-facing.
  ⚠ THIS IS THE SERVER RENDER ONLY. A fetch is not a browser.

🛑 OPEN H-1 IN A SIGNED-OUT BROWSER BEFORE YOU CHANGE ITS WORDING. Its strings are ZERO occurrences
in that HTML — and that is NOT evidence they are absent. The overlay is CLIENT-rendered, so a fetch
cannot see it. Unmeasured, not missing.

🪤 AND WHEN YOU GREP THAT PAGE: a search for the RENDERED form of CSS-transformed text can never
match the source. A sweep looking for "TOGETHER WITH THEIR FAMILIES" got 0 and nearly reported that
the film does not render for guests at all — the capitals come from `text-transform` and the markup
carries sentence case. BEFORE TRUSTING A ZERO, PROVE THE SEARCH CAN FIND A KNOWN POSITIVE.

⛔ TWO MORE ITEMS LIVE IN YOUR TERRITORY AND ARE **OWNER-GATED** — H-2 and H-6 (= AP-9). Both are
fully scoped in § 0d. DO NOT BUILD EITHER, and do not treat them as yours to start if he rules
while you are running — a ruling reopens them as their own slice, on files you will have left.
 · H-2 · the film's small announcements as engraved small caps. ONE WORD IN ONE CLASS STRING —
   `lib/std-themes.ts:64` — but the cinematic look is approved and paid for.
 · H-6 · one quiet line of weather (= AP-9). Needs a source chosen: cost, licensing, and who we
   name on a guest-facing page.
And the wording per event type is W4-WORDS, one wave later. Do not start it here.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```

### W4-WORDS · The words follow the occasion · **Opus 5 · high · the wording drafted by Fable** — wave 4

```
This session MERGES two that were building one mechanism: "a birthday page stops calling the family
the couple" (69 guest-read instances across 16 event types) and "a wake is not a celebration" (a new
event type with its own voice). Both are the per-event-type vocabulary. Run apart, the second would
have rebuilt what the first threaded.

DO THEM IN THIS ORDER — it is the whole reason they are one session:
1. THREAD THE EXISTING TYPES FIRST. 🔑 IT IS THREADING, NOT BUILDING: the words provider is ALREADY
   MOUNTED in the guest tree (`app/[slug]/_components/event-words-provider.tsx`, proven by
   countdown.tsx consuming it) and the per-type terminology is already seeded. 69 guest-read
   instances still say "the couple" at people whose event has no couple in it.
   🔒 WEDDINGS MUST READ BYTE-IDENTICALLY AFTERWARDS. Assert it — do not assume it. That assertion
   is the deliverable that makes step 2 safe.
2. THEN ADD THE WAKE, on the seam step 1 just proved. A family arranging a funeral gets an event
   that never says "celebrate", never says "party", never counts down to a happy day, and never
   offers a save-the-date. The owner already said yes to this (2026-08-17, "yes to all four").
   THE WORDS ARE THE PRODUCT HERE — draft every user-visible string with Fable before wiring
   anything. A wake screen reading "Let's get this celebration started!" is not a copy bug, it is
   the entire defect.

WHERE IT LANDS: lib/event-type-profile.ts · lib/event-words.ts · lib/checklist-event-type-defs.ts ·
app/[slug]/_components/event-words-provider.tsx and the guest-tree strings that still hardcode
couple wording · a migration for the new type.

THINGS THIS PRODUCT HAS ALREADY LEARNED, and they apply directly:
- The onboarding flow ASKS WHAT IT ALREADY KNOWS. Do not add a screen that re-asks something the
  previous screen carried.
- Raw option keys have leaked to customers before (`1st_birthday`, `adult_regular` on screen). Every
  option needs a label, and the option type may have no label slot — check before assuming the
  renderer can fix it.
- Removing a screen at runtime is NOT how to drop a question: out of range is a render-time THROW,
  and removal disarms the "you already have one of these" walk-back.
- There is a settled checklist for adding an event type in the corpus. Follow it; do not derive one.

MIGRATION: yes, event-type tables only. You are the ONLY migration writer in your wave.
2 PRs: the threading, then the wake.

RUN TO THE END. Everything above is one session's work. Do not stop between items, do not ask whether to proceed, and do not report until the last one is done or explicitly skipped.
```
