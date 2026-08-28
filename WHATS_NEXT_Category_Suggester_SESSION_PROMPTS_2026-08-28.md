# The category suggester — paste-ready session prompts · 2026-08-28

> One prompt per session. **Paste the SHARED HEADER first, then one session block.**
> Register: [`WHATS_NEXT_Category_Suggester_SESSIONS_2026-08-28.md`](WHATS_NEXT_Category_Suggester_SESSIONS_2026-08-28.md).
> 🛑 **Never more than two at once. Never C1 with C3 (same file). Never C2 with C3 (same answer path). Never C0 with C4 (same file).**

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

## C0 · A CATEGORY CAN BE UNDONE

**Opus · high · build this BEFORE anything proposes new trades · 🛑 NEVER with C4**

```
Make a category mistake reversible. This is the owner's own question (2026-08-28): "if ever a
category added a new one, are we capable of rerouting them, combining them to an existing, or
renaming the category in the future?"

MEASURED ANSWER — verify it, then build the gap:
  ✅ RENAME IS ALREADY SAFE. renameTaxonomyNode writes label_en ONLY, never the key. Everything
     stored keeps working. Do not touch it.
  ✅ MOVING a trade between branches ships (remapCanonical), as does moving a whole branch
     (moveTileToFolder).
  ✅ COMBINING TWO BRANCHES ships and is well built: deleteTileWithDestination refuses to delete
     a non-empty branch without a destination, then re-points every trade and refinement. Its own
     rule is "never strand a canonical". COPY THIS PATTERN — do not invent a second one.
  🔴 COMBINING TWO TRADES does not exist. No leaf-level merge, no leaf-level delete, anywhere.
  🔴 service_categories.merged_into_category_id has existed since 2026-08-03 (FK to itself) with
     ZERO writers, ZERO readers and ZERO values in production. A gate with no handle.

BUILD:
  1. A leaf-level MERGE: fold trade A into trade B. It must move every shop that listed under A —
     vendor_coverages.canonical_service, vendor_services.category, and vendor_profiles.services[]
     (a TEXT ARRAY: the update is array surgery, not a scalar swap, and a shop may end up holding
     B twice — dedupe).
     🚨 NONE of those three has a foreign key to the taxonomy, so the DATABASE WILL NOT STOP YOU
     and will not tell you what you missed. Enumerate the holders BY GREPPING THE COLUMN, never
     from a remembered list. Three other tables DO hold RESTRICT FKs
     (event_vendor_preferences, vendor_service_attributes, event_vendors.category_key) and will
     block a delete — handle them explicitly rather than being surprised.
  2. WIRE merged_into_category_id so an old key still resolves to its replacement.
     ⚠ THE PRECEDENT CARRIES ITS OWN WARNING: slug forwarding in this repo was WRITTEN and then
     HAD NO READER FOR MONTHS — two screens promised it and nothing read the ledger. SHIP THE
     READER IN THE SAME PR, and prove it with a test that resolves an old key end to end.
  3. A guard that FAILS when a shop-held key points at no live trade. No foreign key will do it.

Dry-run the merge against PRODUCTION inside BEGIN…ROLLBACK, count the rows moved on every one of
the three shop-side holders, and put the transcript in the PR body. Prod is tiny (2 shops, 2
coverage rows, 2 cards) so seed a realistic case rather than proving it on nothing.

Guard it and mutate the guard: the merge moves all three holders · an old key resolves to its
replacement THROUGH A REAL READER · the dangling-key guard actually fires.
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
  · 🚨 THE OBVIOUS VERSION RESURRECTS THE DEFECT THIS SHEET WAS BUILT TO KILL. rankTaxonomyOptions
    returns bare {key,label}; standing (covered / open / locked + the greyed reason) is computed
    only for the legacy pills. Render ranked results WITHOUT standing and a capped supplier picks
    a trade, writes the whole card, and is refused at SAVE — which is exactly the "refusal used to
    arrive after the card was written" defect canvas-maker's own docblock records repairing. Every
    result must pass through standingForCategory and render as a KindPill.
  · Payload. ~262 options reach the client. The couple-side explore already ships ~192 the same
    way — cite that precedent, and check the bundle-size CI job does not move.
  · A leaf whose label the taxonomy read could not resolve must never render as a raw key.

Guard it and mutate the guard: the ranker is imported (not reimplemented) · leaves are search-
only · a covered trade is not duplicated · Miscellaneous is still reachable. Print each count
before → after.
```

---

## C2 · ONE TRADE, MANY NAMES — the alias list

**Sonnet · medium · offline, no supplier text leaves the server · 🛑 NEVER with C3**

```
Make "sorbetes", "sorbetero" and "ice cream cart" all find the same trade — the semantic step,
done the cheap way.

⚖ WHY NOT EMBEDDINGS. A Fable adversarial pass killed that slice: its evidence was a SUPERVISED
classifier trained on labelled history (we have none — 0 authored cards); the already-chosen
model is bge-small-en-v1.5, ENGLISH, for a feature about sorbetes/pabati/ninong/abuloy; and the
PGlite replay rewrites extensions.vector(N) -> text, so every db test about it would be vacuous.
Do not build embeddings in this session. If somebody argues for them, read § R of the plan.

BUILD:
  · A table of aliases: phrase -> canonical_service, plus who wrote it and whether a person has
    reviewed it. UNIQUE on the normalised phrase.
  · SEED IT OFFLINE, ONCE: ask Claude (the processor we ALREADY declare, with a working key) for
    Filipino / English / Taglish synonyms per trade. This runs as a script an admin triggers —
    NOT in the supplier's request path. Supplier text never leaves the server, which is why this
    slice needs no new processor and no privacy-notice change.
  · A PERSON REVIEWS BEFORE IT COUNTS. An unreviewed alias must not answer anybody. The 51
    orphan trades in the measurement doc are the natural first review batch and double as the
    eval set — if the aliases do not find those, the approach has failed and you should say so
    rather than ship it.
  · Extend the ranker to match label OR alias. ⛔ Do not fork rankTaxonomyOptions — pass aliases
    in as searchable text on the option and keep ONE matcher.
  · An alias must resolve to a LIVE trade at READ time. A trade can be retired or merged after
    the row is written; a stale alias must fall through to search silently, never render.

Guard it and mutate the guard: an unreviewed alias answers nobody · an alias pointing at a dead
trade renders nothing · there is still exactly ONE matcher.
```

---

## C3 · IT REMEMBERS WHAT SUPPLIERS CONFIRM

**Sonnet · medium · one migration, no model · 🛑 NEVER with C1 or C2 · ⚠ read the risk first**

```
When a supplier types words we have no exact match for and then PICKS a trade and SAVES the
card, remember that pairing. The next supplier who types the same words gets the answer with no
search and no model.

🚨 THE RISK THAT SHAPES THIS WHOLE SESSION, and it is why C2 exists first. Unlike
admin_search_phrases — whose writers are ADMINS and a validated model, CHECK learned_from IN
('ai','admin') — this cache is written by UNTRUSTED ACCOUNTS and served CROSS-TENANT. A supplier
can type "catering", deliberately pick Funeral Home, save a real card, and teach that pairing to
every future supplier. So:
  · ONLY learn a phrase that C1's search AND C2's aliases BOTH missed. A phrase search already
    answers must never enter the cache — that alone caps poisoning to obscure wordings.
  · NEVER rank a remembered answer above search. Beside it, labelled, or below it.
  · Ship the admin review/unteach screen IN THE SAME PR. A cache nobody can inspect is a cache
    nobody can fix.
  · State the retention story: a supplier can type a phone number into that box, and it would
    otherwise be stored globally forever.

🪤 AND THE SHAPE YOU ARE MIRRORING HAS A TRAP: admin_search_phrases has RLS ON with ZERO policies
and ZERO grants (service-role only, REVOKE ALL). A mirror read through a USER-SESSION client
returns SILENT EMPTY — which in this feature is indistinguishable from "no remembered phrase", so
the cache would ship dead and green. All reads and writes go through server actions on the admin
client, and a test must prove a remembered phrase round-trips through the maker's REAL path.

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

## ~~Cx · IT MATCHES BY MEANING (embeddings)~~ — 🛑 DEMOTED, DO NOT BUILD

**Removed 2026-08-28 after a Fable adversarial pass.** Three measured reasons, in full in § R and
§ 2 of the plan: the cited evidence is a **supervised classifier trained on labelled history** and
we have **zero** labelled examples; the already-chosen model is **English-only** for a feature whose
whole point is Filipino trade words; and the **PGlite replay rewrites `extensions.vector(N)` →
`text`**, so every db test about it would be **vacuous by construction**.

**C2's alias list does the same job at our size.** Revisit this only if the alias list *measurably*
misses real supplier phrases — a condition production cannot currently produce one data point for.
If it is ever revisited, the **Cloudflare Workers AI processor question comes back with it**: the
privacy notice declares Cloudflare for R2 storage and the call relay, **not** for AI inference on
typed text.

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
BLOCKED UNTIL THE OWNER ANSWERS — AND THIS IS BIGGER THAN THE "TONE" IT WAS FIRST SCOPED AS.

🔴 THE PREMISE WAS WRONG AND WAS CORRECTED 2026-08-28. This slice was written as "reuse the
reading we already take". MEASURED: vendor_web_dossiers holds ZERO ROWS, EVER. There is no
stored reading to reuse. So C5 means RUNNING Deep Search per shop at sign-up — a real per-shop
model cost, not a free reuse.

🔴 AND THE PRIVACY NOTICE BINDS IT. app/(shell)/privacy declares Deep Search as "a PAID tool"
that "the VENDOR initiates" about their own business, with rolling 180-day deletion. Running it
free, on OUR initiative, at sign-up, is a LAWFUL-BASIS AND PURPOSE CHANGE — not a wording
choice. It needs the owner as DPO, plus a notice edit shipped in the same PR.

⛔ RULE 0: lib/vendor-deep-search.ts ALREADY asks Claude what a shop advertises and stores
detected_services in vendor_web_dossiers. Do not build a second reader.

BUILD (once ruled):
  · Run the dossier's detected_services — free text — through C1–C3 to turn them into real
    trades, and offer them as suggested COVERAGE at sign-up.
  · ⚠ The 180-day deletion means a pre-fill can never lean on an old dossier even once they
    exist. Say what happens for a shop whose dossier has aged out.
  · ⚖ SUGGESTED, NEVER APPLIED. Coverage decides what couples find a shop under; writing it
    silently from a web guess changes a shop's own listing without them.
  · This is the only slice that costs a model call per SHOP rather than per new wording. Say so.
```

---

## ⏭ Not sessions — the owner's, whenever he wants them

1. **When C4 switches on.** Recommendation: the day a real supplier first hits an empty result.
2. **Does a supplier's own confirmed pick teach the box for everybody** (C3), or only an admin's?
   The poisoning risk in C3's own block is the reason this is a decision and not a default.
3. **C5's lawful basis and cost**, per its own gate above — not a tone question.
4. **Whether embeddings are ever wanted.** Demoted, not deleted. If they come back, so does the
   Cloudflare Workers AI processor question, which is a DPO decision.
