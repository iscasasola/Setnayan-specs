# SESSION PROMPTS — `papic1` · `papic2` · `papic3` · `papic4`

**Written 2026-08-27.** Owner asked for four named sessions and a prompt for each.
Named `papic1–4` on his instruction; only `papic1` is actually Papic-shaped.

---

## 🛑 READ THIS BEFORE YOU PASTE ANY OF THEM

**Every one of these was re-measured against `origin/main` and the live production
database on 2026-08-27, and THREE OF THE FOUR had already moved since the register
described them.** What follows is what is *actually* left, not what the handoff
files say.

| I was about to commission | measured 2026-08-27 | verdict |
|---|---|---|
| "A photo can exist without a credit — reserve and insert are two steps" | `papic_record_seat_capture` **exists in production**; the app calls it; the unwind is deleted and the code says so. Migration `20271170528490`. | ✅ **ALREADY DONE — do not rebuild** |
| "A supplier can be asked to release a deleted event and cannot answer" | `vendorAgreeToDeletion` / `vendorDeclineDeletion` are exported AND passed into the vendor dashboard page. The supplier can answer. | ✅ **ALREADY DONE — do not rebuild** |
| "A review cannot outlive its event — NOT NULL + CASCADE" | `vendor_reviews.event_id` is **SET NULL** in production. Links to `events`: **141 cascade · 22 survive** (was 152/10). | ◐ **partly done — it became a CHECK, not a build** |
| "The create flow prints `1st_birthday` at a customer" | `specialtyOptionLabel('1st_birthday')` returns **"First birthday"**, with a test pinning it. | ✅ **that half is done** |

🔑 **THE LESSON, AND IT IS THE POINT OF THIS PAGE:** the register is the best
thing we have and it **decays in days**. Four claims, three stale, in under a
week. **Every prompt below therefore OPENS with its own measurement step, and no
session may start building until it has pasted what it measured.**

⚠ **NEVER MORE THAN TWO AT ONCE.** Ten parallel builds once shipped 44 defects.
⚠ **`papic1` and any other Papic-domain session must never run together** — they
share the Papic tables and the migration prefix space.

| Session | Model | Effort | Why that model |
|---|---|---|---|
| `papic1` | **Opus** | medium | A port with a binding drawing. Mechanical, but "reconcile never redraw" needs judgement. |
| `papic2` | **Opus** | high | Schema + an owner rule about somebody else's data. Getting it wrong destroys a supplier's record. |
| `papic3` | **Fable** to plan → **Opus** to build | high | Nine owner decisions sit inside it. Plan first, or you build past a ruling. |
| `papic4` | **Opus** | medium | Small, well-described defects the owner personally hit. |

---

## ✅ `papic1` — DONE 2026-08-27. PR [#4921](https://github.com/iscasasola/setnayan-platform/pull/4921), MERGED AND SERVED (`/api/health` → `14ce5b0`). **Do NOT run this prompt again.**

> 🔑 **Two things this prompt had wrong, both found by its own measurement step —
> which is the page's whole argument, working.** (1) `your-photos-widget.tsx` has
> **never rendered a photograph**; the guest's real gallery was an unnamed section
> inside `site-body.tsx`, now `photos-of-you-gallery.tsx`. *A three-item list built
> from filenames is a list of files, not of screens.* (2) The gold/mulberry advice
> is about `html.dark` and **does not apply to a dark island on a light-locked
> page** — measured there, `mulberry-600` is WORSE than the value the prompt
> rejects. 🚨 And the credit's column has a value on all 14 production photographs
> with **no name behind any of them**: 32 of 34 rows in the person spine are
> nameless. Full row: `DECISION_LOG.md` 2026-08-27 🖼.

## `papic1` — THE PHOTO SCREENS STILL WEAR THE OLD SKIN

```
You are picking up the session named papic1 in the Setnayan project.

FIRST, MEASURE — paste the results before you write a line:
  1. Confirm the three screens below still lack the approved gallery look. Search
     each for the obsidian value 17160F and for any per-tile capture credit.
     Measured 2026-08-27 on origin/main: ZERO occurrences of either, in all three.
       apps/web/app/dashboard/[eventId]/studio/papic/_components/papic-gallery-grid.tsx
       apps/web/app/[slug]/_components/your-photos-widget.tsx
       apps/web/app/[slug]/_components/live-wall-block.tsx
  2. Open prototypes/archetype_gallery_*.html in the spec corpus. It is BINDING
     and was owner-approved 2026-08-04. Port it; never redraw it.

WHAT A PERSON GETS: the three places a couple and their guests actually look at
photographs — the couple's Papic gallery, the "your photos" box a guest sees on
the invitation, and the wall on the day — get the dark gallery treatment the
owner approved: obsidian panel, a lightbox, and each tile saying who took it.

RULES THAT ARE NOT NEGOTIABLE:
  · RECONCILE, NEVER REDRAW. A delta between a ported screen and its archetype is
    a defect in the PORT, not a fresh design decision.
  · The couple's Papic grid is CLIPS-ONLY today and has the only lightbox. Do not
    assume the three are the same component wearing different props — they are not.
  · Do NOT touch /dashboard/[eventId]/galleries. That is a hub of three links, not
    a gallery, and whether the archetype governs it at all is an OWNER decision.
  · Gold on a dark panel is the ONE place gold text is safe (5.2:1 on obsidian).
    In the light theme gold has almost no headroom — check BOTH themes and print
    the measured ratios.
  · mulberry-700 is 3.05:1 in dark. Use mulberry-600.

GUARD IT: whatever you assert, break it on purpose and print the occurrence count
before → after. An unmeasured mutation proves nothing. Assume one of your guards
is decoration until you have watched it go red.
```

---

## `papic2` — DOES A SUPPLIER REALLY KEEP WHAT THEY TOOK PART IN?

```
You are picking up the session named papic2 in the Setnayan project.

THIS IS A CHECK THAT MAY BECOME A BUILD. Do not assume it is a build.

FIRST, MEASURE — paste the results before deciding anything:
  1. Against PRODUCTION, list every foreign key pointing at public.events with its
     ON DELETE rule. Measured 2026-08-27: 141 CASCADE · 22 SET NULL.
  2. For each of the 22 that survive, name what a supplier would still have.
     For a sample of the 141 that cascade, name what a supplier LOSES.
  3. Read VENDOR_DATA_SURVIVES_DELETION_2026-08-21.md in the corpus. ⚠ Its own
     adversarial pass is INCOMPLETE (31 of 71 agents were cut off; the synthesis
     never ran). Treat every row in it as MAPPED BUT UNVERIFIED.

THE OWNER'S RULE, 2026-08-21, which is what you are measuring against:
  "On a shared record, the vendor keeps it" — contracts, payments, completed
  bookings. THE TEST IS WHETHER THE SUPPLIER TOOK PART IN IT.
  ⚠ SCOPED: it does NOT turn the couple's private planning — their budget, their
  shortlist, who they rejected — into vendor data. That stays the couple's.

WHAT IS ALREADY DONE — DO NOT REBUILD:
  · The couple can ask a paid supplier to release a deleted celebration, and can
    withdraw the ask.
  · THE SUPPLIER CAN NOW ANSWER. vendorAgreeToDeletion / vendorDeclineDeletion are
    wired into the vendor dashboard page. The register saying "no screen shows them
    the question" is STALE — verify, then delete that claim from the register.
  · vendor_reviews.event_id is SET NULL, so a review already outlives its event.

⚠ "STORED" DOES NOT MEAN "SURVIVES": vendor_activity_stats is RECOMPUTED by
unrelated events, so a saved snapshot silently drops to the smaller number.

OUTPUT: a table of what a supplier keeps and what they lose today, then either
"the rule is met" with the evidence, or the smallest change that meets it.
Changing an ON DELETE rule is a migration — allocate the prefix with
`pnpm migration:new`, and dry-run against production inside BEGIN…ROLLBACK,
because the local replay runs as superuser and will not refuse what prod refuses.
```

---

## `papic3` — THE ANSWERS DESK

```
You are picking up the session named papic3 in the Setnayan project.

⚠ PLAN BEFORE YOU BUILD. Nine owner decisions sit inside this one. Use Fable to
plan, surface the nine, and STOP. Build only what is already ruled on.

FIRST, MEASURE — RULE 0, and this project has paid twice for skipping it:
  1. Read WHATS_NEXT_Vendor_Hub_And_Answers_2026-08-26.md § 7 (the nine decisions)
     and the Answers Desk section. It claims SIXTEEN kinds of question and SIX
     doors. Verify that count against shipped code before repeating it.
  2. Grep for each "kind" before designing it. The register's own record is that
     roughly half of what looked unbuilt already ships.

WHAT A PERSON GETS: the sixteen kinds of question people ask a shop arrive in one
place, and we publish how fast each shop answers.

⛔ FOUR ROWS MUST NOT EXIST UNTIL THE ANSWER WORKS — these are live defects, not
future features, and shipping a desk row for any of them makes it worse:
  · the waitlist pick DOES NOTHING and reports success
  · a crew shift cannot be posted, seen or accepted by a non-admin
  · nobody can ask for a song
  · a payment claim has no "no"
🚨 AND A ONE-STAR REVIEW CAN NEVER REACH THE DESK — the filter is five-stars.

⚖ SCOPE THE OWNER SET: the desk PREPARES and may HOLD BACK. It may never be the
thing that lets money, a price, an approval or a publish through. That is the
one-person admin plan, locked 2026-07-11.

TRAPS ALREADY PAID FOR IN THIS STREAM:
  · A generated file's merge conflict has NO correct side — regenerate from the
    merged tree. Choosing a side cost a CI run.
  · `npx tsc` can abort at 134 while printing "errors=0". ALWAYS print the exit
    code beside the error count.
  · Under `tsx --test`, an `@/lib/…` import can return EMPTY named exports, so a
    guard ran zero checks and reported a pass.
  · Another session moved origin/main three times in one hour. Fetch before you
    branch, and check `git diff --diff-filter=D origin/main..HEAD` before you push.
```

---

## `papic4` — THE CREATE FLOW ASKS WHAT IT ALREADY KNOWS

```
You are picking up the session named papic4 in the Setnayan project.

Contract: WHATS_NEXT_Onboarding_Asks_What_It_Knows_2026-08-20.md
Five defects the owner found in ONE walk from Your Year to a birthday.

FIRST, MEASURE — the contract is a week old and part of it has since shipped:
  1. specialtyOptionLabel('1st_birthday') returns "First birthday" as of
     2026-08-27, with a test pinning it. THAT HALF IS DONE. Re-verify, then strike
     it from the contract rather than building it again.
  2. Re-check each remaining defect against origin/main before starting.

⛔ THE MONEY ONE IS CLOSED — DO NOT RE-OPEN IT. The unpaid ₱499 order was
cancelled at the owner's own instruction on 2026-08-20. Production holds exactly
one order, ever, and it is that one. There is nothing in any admin queue and
nothing for the owner to do. A session repeated this stale line to him on
2026-08-25 and sent him hunting for a bill he had personally cancelled.

🔑 RULE 0 ALREADY PAID HERE: the owner's exact sentence — "When are you
celebrating?" with three day chips — IS ALREADY CODED. It is gated on a value
only the anniversary-only screen ever writes. WIDEN THE TRIGGER, DRAW NOTHING.

🪤 DO NOT FIX IT BY POURING THE CARRIED DATE INTO anchorDate. anchorOrigin
defaults to the literal string 'wedding', so a birthday would render "Our wedding
falls on Wed 16 Dec 2026" — naming a wedding that does not exist. Verified still
true on origin/main 2026-08-27.

⛔ DO NOT DROP A SCREEN AT RUNTIME. Out of range is a render-time THROW, and
removal disarms the "you already have one of these" walk-back for exactly the
people it targets.

The question-drop filter SHIPS and works, and the answer already exists twice —
the Year page computes "turning 40" and throws it away. This is a missing
handover, not missing machinery. ⚠ Its seam is INERT BY DEFAULT, so a fix written
behind it ships switched off. Check that before you call it done.
```
