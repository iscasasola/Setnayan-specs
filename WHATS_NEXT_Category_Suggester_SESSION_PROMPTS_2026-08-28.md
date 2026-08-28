# The category suggester — paste-ready session prompts · 2026-08-28

> One prompt per session. **Paste the SHARED HEADER first, then one session block.**
> Register: [`WHATS_NEXT_Category_Suggester_SESSIONS_2026-08-28.md`](WHATS_NEXT_Category_Suggester_SESSIONS_2026-08-28.md).
> 🛑 **Never more than two at once. Never C1 with C2 (same file). Never C3 with C4 (same path).**

---

## SHARED HEADER — paste this at the top of every session

```
You are working on the Setnayan platform.

CODE: github.com/iscasasola/setnayan-platform · SPECS: ~/Documents/Claude/Projects/Setnayan/

READ FIRST, in this order:
  1. ~/Documents/Claude/Projects/Setnayan/WHATS_NEXT_The_Category_Suggester_2026-08-28.md
     — the plan. Read its § R research section too: it REVERSED the order of two slices, so a
     session that skips it will build the wrong instrument.
  2. ~/Documents/Claude/Projects/Setnayan/WHATS_NEXT_Category_Suggester_SESSIONS_2026-08-28.md
     — the register, including the RULE 0 table of what ALREADY SHIPS.
  3. ~/Documents/Claude/Projects/Setnayan/SERVICE_CARD_VOCABULARY_MEASURED_2026-08-28.md
     — the measurement everything rests on (262 leaves vs 52 kinds; 51 trades with no word).
  4. prototypes/category_suggester_2026-08-28.html — the approved drawing. BINDING: port it,
     never redraw it. A delta between a built screen and the drawing is a defect in the PORT,
     not a fresh design decision.

RULE 0 — FIND IT BEFORE YOU BUILD IT. Almost nothing you are asked for is new. Before writing
any code, grep for the feature noun in apps/web and say in one line each: what exists · what is
missing · the delta you will build. If you cannot name the existing component, you have not
searched enough. The register's RULE 0 table is pre-answered — do not re-derive it, but DO
verify any row you are about to depend on.

HOW TO WORK:
  · git worktree add IMMEDIATELY. Never work in the main checkout. NEVER read code from ~ —
    that tree is ~750 commits stale and has produced confident wrong answers.
  · Install in the worktree before running anything. A run in an uninstalled tree proves nothing.
  · One PR, auto-merge armed after opening: gh pr merge <n> --auto --merge
  · A changelog fragment in changelog.d/<branch-slug>.md, never CHANGELOG.md or STATUS.md.
  · Spec-impacting decisions get a row at the BOTTOM of DECISION_LOG.md.
  · Prune the worktree the moment the PR merges.

HOW TO PROVE ANYTHING:
  · Print TSC_EXIT beside the error count — tsc aborts at 134 while printing errors=0.
  · Require a NON-ZERO "# tests" count; a run that matched no files prints 0 and exits green.
  · Every guard gets a MEASURED mutation: print the occurrence count before → after and show it
    going red. On 2026-08-28 THREE of one session's own assertions were decoration and only the
    mutation found them. Assume yours is decoration until it has gone red.
  · A source-matching guard cannot see a missing import. Run tsc beside it.
  · Read production BY THE OBJECT, never from a migration comment or a doc.

THE RULE THAT SHAPES EVERY STATE YOU BUILD:
  Miscellaneous must stay reachable, always. The card is universal — owner, 2026-08-28:
  "the card is universal fit for any service." Nothing you build may become a gate. It
  suggests; the supplier decides; a low-confidence guess shows NOTHING rather than a wrong
  answer, because a supplier who trusts a wrong suggestion files their card under someone
  else's trade.

HOW TO TALK TO THE OWNER: plain English, what a PERSON experiences. No file paths, function
names, table names or flag names in the reply — those belong in the PR body. Decide and act on
reversible pre-launch work; escalate only real owner territory (prices, scope, risk, a new data
processor, reversing a lock). Stop at every gate your session names.
```

---

## C1 · TYPING FINDS THE REAL TRADE

**Sonnet · medium · no model, no new schema · 🛑 NEVER with C2**

```
Make the card maker's kind search find any of the 262 live trades, ranked.

TODAY: the maker searches ~46 legacy department pills with `o.label.toLowerCase().includes(q)`.
The 262 real trades are not searchable there at all — only the shop's own coverage leaves
appear, in the band PR #4942 added. Measured: 51 live trades have NO word that means them
(generator and tent hire, mobile restrooms, sorbetes and ice-cream carts, bridesmaid dresses,
ninong/ninang sets) and three funeral kinds render in no group at all.

⛔ DO NOT WRITE A MATCHER. `lib/taxonomy-search-rank.ts` already exists, is pure, is tested,
and has four tiers — it exists BECAUSE the single word "photobooth" used to return zero
results. Import it. A second matcher is the two-hand-typed-things failure this repo keeps
paying for.

BUILD:
  · The server passes every visible coverage leaf (the same visibility rule getCoverageTaxonomy
    already applies) with its branch, so two similar trades are told apart on screen.
  · Standing (covered / open / locked) comes from the SAME functions the save enforces —
    lib/vendor-category-parents.ts — never a second copy of the permission rule.
  · ⚖ SEARCH RESULTS ONLY, NEVER A RENDERED LIST. The owner's lock on this screen is
    coverage-first with the rest one tap away; 262 pills on screen is the wall coming back one
    section lower. They exist only once somebody types.
  · Dedupe against the coverage band — a trade the shop already covers must not appear twice.
  · The "nothing matches" line must account for trade matches too, or it will claim nothing
    matched while results sit above it.

WATCH FOR:
  · Payload. ~262 options reach the client. The couple-side explore already ships ~192 the same
    way — cite that precedent, and check the bundle-size CI job does not move.
  · A leaf whose label the taxonomy read could not resolve must never render as a raw key.

Guard it and mutate the guard: the ranker is imported (not reimplemented) · leaves are search-
only · a covered trade is not duplicated · Miscellaneous is still reachable. Print each count
before → after.
```

---

## C2 · IT REMEMBERS WHAT SUPPLIERS CALL THINGS

**Sonnet · medium · one migration, no model · 🛑 NEVER with C1**

```
When a supplier types words we have no exact match for and then PICKS a trade and SAVES the
card, remember that pairing. The next supplier who types the same words gets the answer with no
search and no model.

⛔ RULE 0: mirror `admin_search_phrases` — do not invent a shape. Read
20271169224135_the_box_remembers_the_words_you_use.sql and lib/admin-map/ask-the-admin.ts
first; that pattern already works in production (1 row, learned_from='ai').

BUILD:
  · One table: phrase (normalised, UNIQUE), the trade key, learned_from ∈ ('vendor','admin'),
    times_used, timestamps. Same normalisation on the way IN and the way OUT, or a lookup never
    hits.
  · 🔒 VALIDATE THE STORED TARGET ON READ, not just on write. A leaf can be retired after the
    row is stored; a remembered answer pointing at a dead trade must fall through to search
    silently, never render. ask-the-admin.ts validates its stored href on read for this reason.
  · ⚠ ONLY WRITE ON A SAVED CARD. Not on hover, not on first tap. A wrong pairing learned once
    is served to everybody.
  · RLS: a supplier may not read another shop's raw phrases as a list. Decide what is actually
    exposed and say so in the PR — this is a cross-supplier cache and that is the whole risk.

Guard it and mutate the guard: the pairing is written only on save · a stored target is
re-validated on read · normalisation matches on both sides.
```

---

## C3 · IT MATCHES BY MEANING

**Opus · high · FIRST EMBEDDING BUILD IN THIS REPO · 🛑 NEVER with C4 · ⚖ OWNER-GATED**

```
Make "sound hire" find Lights & Sound, and "sorbetes cart" find Ice Cream Cart. Letters never
match those; meaning does. Reached only when C1 and C2 both come back empty.

⚖ STOP AT THE GATE FIRST. This sends a supplier's typed words to Cloudflare Workers AI, which
is plausibly a NEW DATA PROCESSOR under RA 10173, and this project maintains a declared-
processor list. Get the owner's ruling in writing before shipping. ⚠ We are already a
Cloudflare customer for R2 — storing files with a vendor is NOT the same as sending them text
to process, and this corpus has already been burned once by treating those as the same thing.
Build up to the gate; do not flip anything.

WHAT IS ALREADY DECIDED FOR YOU (do not re-litigate):
  · pgvector is INSTALLED IN PRODUCTION, v0.8.0 — verified by the object.
  · The model was chosen in May and written down: bge-small-en-v1.5 via Cloudflare Workers AI,
    384 dims (20260518500000_iteration_0016_wizard_architecture_schema.sql).

🔴 AND WHAT IS NOT: NOTHING IN THIS REPO HAS EVER GENERATED AN EMBEDDING. Zero writers, zero
rows (concierge_brain_chunks = 0). The columns exist and the wiring never happened — the eighth
"gate with no handle" in this corpus. Scope this as a FIRST BUILD, not a reuse.

BUILD:
  · Embed the 262 trades ONCE — name + branch + folder as the text — onto the taxonomy row,
    with a cosine index. Re-embed only when an admin adds or renames one. That is the whole
    cost story: 262 ever, then one tiny embedding per new phrase.
  · At runtime embed the typed phrase with the SAME instruction. A different instruction on the
    two sides silently degrades every match and looks fine.
  · 🔑 USE THE TREE. The literature treats this as hierarchical; a match whose branch is far
    from anything the shop covers should rank below one that is close.
  · 🔒 A SIMILARITY SCORE IS NOT A DECISION. Below a floor, show NOTHING and fall through. Say
    in the PR how you chose the floor and what you tested it against — an unjustified floor is
    the whole feature's accuracy in one unmeasured constant.
  · An admin renaming a trade must not leave a stale embedding answering for the old name.
    Say what happens; a re-embed with no trigger is a backfill, and a backfill is a
    point-in-time act, not ongoing coverage.
  · 🔒 FAILS SILENT. No key, no network, a bad shape → the box behaves exactly as after C1.

Dry-run the migration against production inside BEGIN…ROLLBACK and put the transcript in the PR
body — the PGlite replay runs as superuser and can agree with a database prod does not have.
```

---

## C4 · A TRADE WE DO NOT HAVE ARRIVES READY TO PRESS

**Opus · high · SHIPS DARK · 🛑 NEVER with C3**

```
When a supplier's words match nothing at all — after C1, C2 and C3 — Claude drafts the category
proposal. It does NOT pick from the list; embeddings already do that better. Its only job is the
one they cannot do: describing a trade we have no word for.

⛔ RULE 0 — THE ENTIRE APPROVE-AND-MINT PATH ALREADY SHIPS. Do not rebuild any of it:
  proposeCategory → taxonomy_category_requests → /admin/taxonomy, with FOUR outcomes already
  written: promoteCategoryRequest (mints a real leaf under a chosen tile, refuses an exact-slug
  duplicate, audit-logged) · mapCategoryRequest · resolveCategoryRequest (kept_private/rejected).
  The ONLY change is that a request arrives ready to press instead of as a bare label.

⛔ AND IT MAY NEVER MINT. A person presses. Three measured reasons, in the plan's § 4: removing
a leaf strands the shops that listed under it; the existing duplicate check is a SLUG match, so
an AI would happily mint "Sorbetes Cart" beside "Ice Cream Cart"; and the owner's own rule is
that the assistant may prepare and may hold back but may never be the thing that lets a publish
through.

BUILD:
  · The draft carries: a clean name, the BRANCH it belongs under (the mint requires a tile_id
    and today a person picks it blind), the near-matches it rejected AND WHY, and the
    supplier's own words as evidence.
  · ⚠ THE NEAR-MATCHES GO ABOVE THE PROMOTE BUTTON, NOT BELOW IT. A queue with a suggestion
    attached is a queue people stop reading; the whole point of the human in the middle is lost
    if the answer can be accepted without reading the alternatives.
  · The supplier is never blocked: they file under Miscellaneous and change it later. Say so on
    the screen.
  · SHIP DARK. Production has had 0 category requests ever, so this can be switched on the day
    a real supplier first hits an empty result. Never auto-flip a production flag.

Guard it and mutate the guard: the model cannot reach the mint · near-matches render above the
button · the supplier's path is never blocked.
```

---

## C5 · THEIR WEBSITE FILLS IT IN AT SIGN-UP

**Sonnet · medium · ⚖ OWNER RULES ON TONE FIRST · pairs with C1 or C2**

```
BLOCKED UNTIL THE OWNER ANSWERS. "Your website says you do X — shall we add these?" is useful,
and it is also us telling a shop we read their website. That reading is already declared for
VERIFICATION; using it to pre-fill their public listing is a different purpose and may need its
own line in the privacy notice. Ask, and stop.

⛔ RULE 0: lib/vendor-deep-search.ts ALREADY asks Claude what a shop advertises and stores
detected_services in vendor_web_dossiers. Do not build a second reader.

BUILD (once ruled):
  · Run the dossier's detected_services — free text — through C1–C3 to turn them into real
    trades, and offer them as suggested COVERAGE at sign-up.
  · ⚖ SUGGESTED, NEVER APPLIED. Coverage decides what couples find a shop under; writing it
    silently from a web guess changes a shop's own listing without them.
  · This is the only slice that costs a model call per SHOP rather than per new wording. Say so.
```

---

## ⏭ Not sessions — the owner's, whenever he wants them

1. **Is Cloudflare Workers AI a new declared processor?** Gates C3. Not an engineering call.
2. **When C4 switches on.** Recommendation: the day a real supplier first hits an empty result.
3. **Does a supplier's own pick teach the box for everybody** (C2), or only an admin's?
4. **C5's tone**, per its own gate above.
