> ⏩ **SUPERSEDED 2026-08-28 FOR THE EVENT HUB BLOCKS ONLY (S13–S15 shipped) — the S9 grants block is a separate stream and still stands — read [`EVENT_HUB_UNISON_2026-08-28.md`](EVENT_HUB_UNISON_2026-08-28.md) instead.**

# S9 · batch 3 and the Event Hub remainder — ready to paste, 17 August 2026 (late evening)

> 📄 **COPY-PASTE PAGE:** <https://claude.ai/code/artifact/2a02d520-3e13-4cfe-b27f-ff36d8dffcab>

> Paste the **shared header** AND the **coordination block** from
> [`WHATS_NEXT_SESSION_PROMPTS_2026-08-17.md`](WHATS_NEXT_SESSION_PROMPTS_2026-08-17.md) on top of
> each block. The coordination block is not optional — **four cross-session failures today were
> invisible to the file-overlap matrix.**
>
> 🛑 **S9 and the Event Hub blocks may run together** — one is migrations, the other is the guest
> tree. **Two Event Hub blocks may NEVER run together:** S13, S14 and S15 all edit
> `site-body.tsx` and `page.tsx`.

---

# S9 · The second lock, batch 3
**routine now — the method is proved, this is repetition · pairs with any Event Hub block**

```
WHAT THIS PREVENTS: nothing visible. It means one future mistake in one rule is a near-miss
instead of a leak.

STATE, READ FROM PRODUCTION THIS EVENING — not from a document:
  273 of 384 public tables still hand a stranger a read permission.
  306 → 290 (batch 1) → 273 (batch 2). Thirty-three closed so far, in two batches.
The guard's own note records ~180 remaining candidates, "dominated by gate-4 failures — tables
the app reads through a path that does not need the grant". CONFIRM that number yourself; it was
written before batch 2 landed.

ALREADY SHIPS — DO NOT REBUILD:
- tests/db/anon-table-grants-closed.db.test.ts — the guard, with CLOSED_IN_BATCH_1 and
  CLOSED_IN_BATCH_2 already registered and a length assertion that fails if somebody trims the
  list to go green. ADD a batch 3 list; do not restructure it.
- THE SIX GATES, including the SIXTH one batch 2 learned the hard way.

🚨 THE SIXTH GATE IS THE WHOLE REASON THIS GOES IN SMALL BATCHES. A `security_invoker` view reads
its base tables WITH THE CALLER'S OWN PRIVILEGES. So a table nothing in the app names can still be
load-bearing for a public page, and revoking it empties that page for every signed-out visitor.
Batch 2 nearly did exactly that to the public supplier listing. The automated check named ONE
table; tracing the whole chain found a SECOND that nothing tests at all.
🔑 TRACE THE CHAIN, NOT THE TABLE THE FAILURE NAMES. Obeying the failure alone would have shipped
a second, untested break in silence.

THE TRAPS, ALL PAID FOR ALREADY:
- READ THE COLUMN DEFAULT BEFORE YOU REVOKE. One revoke would have shipped SILENT UNIVERSAL
  AUTO-APPROVAL because the column defaulted to 'approved'. The obvious fix was worse than the bug.
- A TABLE-LEVEL REVOKE DROPS COLUMN GRANTS.
- DROP + CREATE IS A RESET, NOT AN EDIT — and this database's default privileges hand back
  INSERT/UPDATE/DELETE on anything newly created. ⚠ AND WHEN YOU FIX THAT SHAPE, SWEEP EVERY
  INSTANCE IN THE SAME FILE: today one migration rebuilt THREE views and only one got its revoke;
  the other two were left publicly writable and a guard added hours later caught it.
- THE REPLAY RUNS AS SUPERUSER and the test database is more permissive than production.
  DRY-RUN EVERY MIGRATION AGAINST PROD IN A ROLLED-BACK TRANSACTION.
- RE-READ THE LIVE GRANTS IMMEDIATELY BEFORE MERGING. Two sessions collided on exactly this today:
  one revoked, the other re-granted hours later, both correct in isolation, and neither pull
  request could show it.

SIZE: keep it to ~15-20 tables. The point of small batches is that a wrong one is caught while it
is cheap — which has now happened twice.

⛔ NOT IN SCOPE: do not enforce the wide browser-protection policy. It is deliberately still
watching rather than blocking, and its record is EMPTY (0 rows, read this evening). It should stay
that way until there are weeks of evidence. That switch is the owner's.
```

---

# S13 · The rest of the Event Hub's words
**the highest-value Event Hub block · ⛔ never beside S14 or S15**

```
WHAT A PERSON GETS: a graduation, a birthday, a corporate day and a trip open an event page that
speaks to THEM, instead of one that calls everybody a couple at a wedding.

⚠ RE-MEASURE BEFORE YOU START — THE SCOPE DOC'S NUMBER IS ALREADY STALE.
WHATS_NEXT_EVENT_HUB_BUILDS_2026-08-17.md says "53 strings across 23 files". That was derived
carefully (comments stripped; imports, type unions, CSS names, DB literals and fallbacks excluded)
BUT IT WAS MEASURED BEFORE #4515 LANDED, which fixed the page's client surfaces. Redo the count
the same way and state your number. A crude case-insensitive count including comments gives 91
today and is NOT the right measure — do not use it.

ALREADY SHIPS — YOU ARE WIRING, NOT AUTHORING:
- app/[slug]/_lib/event-words.ts — five cased forms plus the event word, degrades to "the host",
  React-cached. IMPORT IT.
- ALL 16 EVENT TYPES ALREADY CARRY FULL WORDING IN PRODUCTION. The vocabulary exists.
- `resolveProfile` is ALREADY called on the page for its surface gate — REUSE that profile rather
  than resolving twice.

WHERE THEY ARE (verify, then work top-down): editorial-content.tsx · site-body.tsx ·
guest-column-form.tsx · print-sheet.tsx · private-landing.tsx · selfie-capture.tsx, then a tail of
files with one or two each — INCLUDING seat/page.tsx and find-my-table/page.tsx, which the first
pass MISSED.

⛔ LEAVE ALONE — these are correctly wedding words: the bride's and groom's sides, the tea
ceremony, the film. And the five sample weddings' editorial is CONTENT, not copy — 17 strings that
must not be touched.

🔑 THE TEST FOR EVERY STRING: would this sentence be wrong at a funeral? If yes, it is the job. If
it only appears on a wedding, it is not.
```

---

# S14 · The way between the rooms
**the gap the owner actually noticed · ⛔ never beside S13 or S15**

```
WHAT A PERSON GETS: a guest standing in the venue gets from their seat to the directions to the
gifts without going back to a link somebody sent them months ago.

THE DEFECT, MEASURED — CONFIRM, DO NOT RE-DERIVE: zero of the 11 sub-rooms mount the bottom bar
(its component has exactly ONE importer) · seat, find-seat, find-my-table, venue, gifts and recap
link ONLY back to the event page · welcome, invite, live-wall and print have NO outbound links at
all · no room links to any other room. A HUB AND SPOKE WITH NO RIM.

🛑 CORRECTION YOU MUST NOT UNDO: app/[slug]/layout.tsx IS NOT A SHELL. It is `display: contents`
and its own docblock says "purely a CSS-variable scope — zero behavior". I said earlier that a
shared shell exists and that was WRONG. Do not scope a shell rebuild off it, and do not repeat
the claim that one exists.

ALREADY SHIPS — READ ALL 540 LINES FIRST: _lib/site-nav.ts is the rules engine and ITS COMMENTS
ARE OWNER RULINGS. The bar and the index must both resolve through it, so they cannot disagree.

BUILD: the contents index from the prototypes — a printed list under the masthead, resolved by the
SAME rules engine as the bar, listing only what THIS event actually has. Plus the bar travelling
into the rooms.

🔒 FIVE SLOTS STAYS FIVE. No sixth destination, at any width, ever.
🔒 ANNOUNCE FEATURES, HIDE CONTENT. A part the host kept private is NOT drawn greyed out — that
discloses it exists. A part merely not open yet stays visible with its reason.

GATE: none for the phone. ⛔ DO NOT build its desktop form — that shipped as S16 (#4510, #4512).
```

---

# S15 · The wedding-only parts stay home
**the largest of the three · ⛔ never beside S13 or S14**

```
WHAT A PERSON GETS: a birthday stops being handed a wedding.

✅ UNBLOCKED — THE OWNER CLOSED THE GRID 2026-08-17: "yes to all four." All 16 rows decided. A
corporate day GETS the 3D room · a tournament lists fixtures and does NOT seat spectators · a wake
MAY accept money, with gentler wording · funeral and baptism are approved as new event types.
⚠ THEY WERE ANSWERED AS A BLOCK, NOT INDIVIDUALLY. If one reads wrong it is one word to correct —
do not treat any single cell as separately confirmed.
🔴 THE FUNERAL TYPE IS NOT PART OF THIS BLOCK and must not ride along.

THE LEAK, AND IT IS LIVE: the event-type profile RECORDS that Save-the-Date and monogram are
wedding-only — and the guest tree never reads those answers. It consults exactly TWO surfaces.
So a non-wedding created far enough ahead renders the WEDDING SAVE-THE-DATE FILM, and a typeless
event gets a WEDDING-STYLE LETTERED MONOGRAM.
🔑 CONFIRM BOTH BY THE OBJECT BEFORE BUILDING. A scope document is not evidence — four things
today were reported as missing while shipped.

WHY IT IS THE LARGEST: per-block, per-event-type gating DOES NOT EXIST. All 16 registry blocks are
seeded type-blind and the body-plan resolver never reads the event type. You are adding the
mechanism, not flipping a switch.

🔒 The rule is ANNOUNCE FEATURES, HIDE CONTENT — the same rule as S14, for the same reason.
```

---

## Why these four are separated this way

**S13 · S14 · S15 all edit `site-body.tsx` and `page.tsx`.** Never two at once — that is measured,
not cautious. **S9 is migrations and shares nothing with any of them**, so it can run alongside
whichever one you pick.

**S16 is done** (#4510 · #4512). **S12-B0 and #4515 already took the side rooms and the page's
client surfaces**, which is why S13's number needs re-measuring rather than reusing.
