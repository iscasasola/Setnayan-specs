# The category suggester — session register · 2026-08-28

> **The plan:** [`WHATS_NEXT_The_Category_Suggester_2026-08-28.md`](WHATS_NEXT_The_Category_Suggester_2026-08-28.md)
> — read it fully before opening any session below, including its **§ R research section**, which
> reversed the order of two slices.
> **The drawing (BINDING — port it, never redraw it):**
> [`prototypes/category_suggester_2026-08-28.html`](prototypes/category_suggester_2026-08-28.html)
> **Paste-ready prompts:**
> [`WHATS_NEXT_Category_Suggester_SESSION_PROMPTS_2026-08-28.md`](WHATS_NEXT_Category_Suggester_SESSION_PROMPTS_2026-08-28.md)
>
> **What came before this, and must not be rebuilt:** PR
> [#4942](https://github.com/iscasasola/setnayan-platform/pull/4942) (merged) made a card's kind
> able to be the shop's own coverage leaf, and
> [`SERVICE_CARD_VOCABULARY_MEASURED_2026-08-28.md`](SERVICE_CARD_VOCABULARY_MEASURED_2026-08-28.md)
> is the measurement all of this rests on.

---

## The sessions

| # | What a person gets | Model · effort | Gate | Touches |
|---|---|---|---|---|
| ~~**C0**~~ ✅ **DONE — PR [#4946](https://github.com/iscasasola/setnayan-platform/pull/4946), MERGED 2026-08-28T04:24:55Z AND SERVED** (prod `/api/health` → `91b1fea`; merge `91b1feaba` verified an ancestor of `origin/main`). Migration `20271176753752` **verified applied in prod BY THE OBJECT**: the column, its FK and its no-self-merge CHECK; the function `SECURITY DEFINER` carrying **6** collision-deletes and the array de-dupe; it never deletes a trade row; EXECUTE held by `postgres`+`service_role` only. **0 of 288 trades merged — nothing moved.** Do NOT rebuild it.** Two trades can be combined and an old key still resolves. ⚠ Verify state with `gh pr view 4946 --json state,mergedAt` — this corpus has been wrong about a PR five times. | **Opus · high** | none | `admin/taxonomy/actions.ts` · migration `20271176753752` |
| **C1** | **Typing finds the real trade.** All live trades searchable in the maker, properly ranked — *"sorbetes"*, *"generator"*, *"tent"*, *"photobooth"* as one word. No model, no new schema. | Sonnet · medium | none | `canvas-maker.tsx` · `services/new/page.tsx` |
| **C2** | **One trade, many names.** An alias list. 🟢 **RE-POINTED: the words are MINED from the 1,248 already inside our own category definitions — not invented by a model.** Still review-gated. | Sonnet · medium | none — no model, no supplier text leaves the server | one migration · the ranker · an admin review screen |
| ~~**C3**~~ ✅ **DONE — PR [#4970](https://github.com/iscasasola/setnayan-platform/pull/4970), MERGED 2026-08-28T16:29Z AND SERVING** (prod reported `c70b2e5`, which contains it). Do NOT rebuild it. ⚠ Verify with `gh pr view 4970 --json state,mergedAt`. 🔑 **NO NEW MIGRATION — it reused C2's table**, whose `source` column already carried `'collected'` for exactly this and had never been written. A phrase is recorded only when the search GENUINELY missed it AND the supplier picked a real trade AND saved the card; both checks are server-side, never trusting the browser. **It answers nobody — including the supplier who typed it — until an admin approves it at `/admin/taxonomy/aliases`**, proved against a replayed schema: an ordinary account cannot read an unapproved row and cannot approve its own. 🔴 **THE FIRST ATTEMPT AT THIS SESSION LOST AN HOUR OF WORK** — it held everything uncommitted while waiting on background test runs and the process died. The rerun was told to commit and push continuously. *An unpushed branch is a rumour.* | Sonnet · medium | closed | `canvas-maker.tsx` · `service-wizard.tsx` · C2's table |
| ~~**C4**~~ ✅ **BUILT AND DARK — PR [#4959](https://github.com/iscasasola/setnayan-platform/pull/4959), **MERGED 2026-08-28T10:09:25Z** (merge `f67c24ad4`, verified an ancestor of `origin/main`). Do NOT rebuild it.** ⚠ Verify with `gh pr view 4959 --json state,mergedAt` — this corpus has been wrong about a PR's state five times. A request now arrives with a drafted proposal: a cleaner name, the branch it might belong under, and **the near-matches rejected WITH a reason each, rendered ABOVE the Promote button**. ⛔ **It mints nothing and has no path to the mint** — a census over every non-test source fails if any file gains a reference to `promoteCategoryRequest` outside a six-line bill with written reasons. 🔑 **The FREE arm runs first**: the shipped ranker (carrying C2's aliases) answers *"we think we already have this — Map it"* at ₱0; the model is reached only when the live list is empty. 🔒 An invented tile becomes NULL, an invented trade key is dropped, an `existing` verdict naming a trade we do not have kills the draft, and every near-match's LABEL is read from our own list. 🚨 **The exposure-freeze guard caught a real widening** — the default ACL gave `authenticated` 11 capabilities on the new table; both roles revoked, baseline grows by exactly **one** line, verified against prod in a rolled-back transaction. ⏭ **The flip is the OWNER'S: `CATEGORY_PROPOSAL_DRAFT_ENABLED=true` in Vercel, then redeploy — recommendation, the day a real supplier first hits an empty result. Never auto-flip it.** | **Opus · high** | **ships dark; owner flips** | `proposeCategory` · `/admin/taxonomy` · migration `20271177581703` |
| ~~**C5**~~ ✅ **BUILT AND DARK — PR [#4965](https://github.com/iscasasola/setnayan-platform/pull/4965), **MERGED 2026-08-28 AND SERVING** (prod `/api/health` reported `68b86ed`, which contains it; the new *"Free coverage suggestion at sign-up"* section was **fetched from the live `/privacy` page**, not read from source). 🟢 **AND THE OWNER FLIPPED IT ON — `VENDOR_SIGNUP_COVERAGE_SUGGEST_ENABLED=true`, redeployed 2026-08-28. IT IS LIVE.** Do NOT rebuild it.** ⚠ Verify with `gh pr view 4965 --json state,mergedAt` before trusting this line — this corpus has been wrong about a PR's state five times. All three ruling conditions ship in the one PR: the `/privacy` notice's new "Free coverage suggestion at sign-up" section (+ its own legitimate-interest lawful basis) lands with the first automatic run, not after; every suggestion is a tick the shop makes — held structurally by a guard test that fails red the moment the read/trigger side even mentions `vendor_profiles`; and the shop is told on the screen, not only in the notice. Fires once, the first time a shop's own website becomes known — on My Shop, since website is not collected in the 4-step `/open-shop` wizard (a 2026-07-05 lock this does not reopen). Ships behind `VENDOR_SIGNUP_COVERAGE_SUGGEST_ENABLED` (default OFF in code) — **the owner set it to `true` on 2026-08-28, so it is ON in production.** Reuses `lib/vendor-deep-search.ts`'s engine + `vendor_web_dossiers` store, C1's ranker and C2's reviewed aliases — no second reader, no second matcher. Migration `20271178345010` tags these dossiers `kind='signup_suggestion'`, separate from the vendor's own paid/free-cycle run (never charged against that allowance). |
| ~~Cx~~ | ~~Match by meaning (embeddings)~~ | — | 🛑 **DEMOTED — do not build it yet** | — |

🛑 **C0's GATE WAS REAL AND THIS FILE DID NOT CARRY IT.** This register's C0 row said gate =
**"none"**; the session prompts file says **"none — but open the PR as a DRAFT"**, because C0 moves
other people's data across tables with **no foreign key to catch a mistake**. A session reading only
this file would arm auto-merge and sail through a hold. **The gate is recorded here now.** PR #4946
was opened non-draft, converted to draft when the discrepancy was found, and then merged on the
owner's own instruction (*"complete it"*) — the hold did its job: a person decided. 🔑 *Two corpus docs described the same gate differently, and the one a
session was pointed at was the laxer one — the same shape as a rule written twice with the lax copy
deciding.*

🛑 **THE EMBEDDINGS SESSION WAS REMOVED AFTER A FABLE ADVERSARIAL PASS.** Its evidence turned out
to be a **supervised classifier trained on labelled history** (we have none — 0 authored cards); its
already-chosen model is **English-only** for a feature about *sorbetes · pabati · ninong · abuloy*;
and it is **untestable here** — the PGlite replay rewrites `extensions.vector(N)` → `text`, so every
db test about it would be vacuous. **C2 does the same job at our size for a fraction of the risk.**
Revisit only if the alias list measurably misses real supplier phrases.

### 🛑 Never run together

- **C1 and C3 both edit `canvas-maker.tsx`.** Two sessions in that file is how a rebase conflict
  deletes a feature — both sides *append*, and either choice loses one. **Never together.**
- **C2 and C3 both change what answers a typed phrase.** C3 only fires when C2 missed, so a session
  changing one changes when the other runs. **Never together.**
- **C0 and C4 both touch `admin/taxonomy/actions.ts`.** **Never together.**
- **C0 pairs safely with C1.** **Never more than two at once.**

### Suggested order

**C0 → C1 → C2 → C3 → C4 → C5.**

~~**C0 first…**~~ ✅ **C0 IS BUILT (PR [#4946](https://github.com/iscasasola/setnayan-platform/pull/4946)) — the undo exists, so C4 is no longer gated on it.**
Two trades can be combined, every stored key moves, and an old key still lands on its replacement.

🛑 **AND C0 DISPROVED THE SENTENCE THAT USED TO SIT HERE.** This register said the column for
rerouting "has existed since 2026-08-03 with zero writers and zero readers", implying it only needed
wiring. **It cannot do the job at all:** `service_categories.merged_into_category_id` sits on a table
holding **only tier-1 folders (16) and tier-2 tiles (78) — read out of prod, there is no tier 3.**
Trades live in `canonical_service_taxonomy`. That column can forward a **BRANCH** and never a
**TRADE**. The trade forwarder is a new `canonical_service_taxonomy.merged_into`; the tile column is
still unwired **and is now correctly described as out of scope**, not as the missing piece.

**Remaining order: C1 → C2 → C3 → C4 → C5.**

**C1 + C2 are the whole feature for most suppliers**, need no supplier text to leave the server, and
close the naming gap on their own. **If nothing after C2 is ever built, the gap is still closed.**

---

## 🟢 OWNER CORRECTION 2026-08-28 (SECOND) — WE ALREADY WROTE THE INITIAL DATA. MINE IT.

> **Owner, verbatim:** *"initially, we already have a target service for each category. that is our
> initial data. then we start collecting the information of service cards."*
>
> **He is right, and I had swung too far.** After the collect-first ruling below I said we had
> nothing to work from. **We do — we authored it ourselves.**

**MEASURED IN PRODUCTION, 2026-08-28:**

| | |
|---|---|
| Categories carrying a real definition, not just a name | **169 of 276** |
| Attribute fields defined across them | **829** |
| **Words already written inside those definitions** | **1,539 — 1,248 distinct** |
| Categories those words come from | **153** |

🔑 **AND THOSE WORDS ARE THE ONES A SUPPLIER TYPES.** `photo_booth`'s own definition already
contains *360 booth · gif booth · polaroid instax · selfie magic mirror · patiktok*.
`lights_sound`'s already contains *lighting design · sound engineer · rooms handled · equipment
brands*. A supplier typing **"360 booth"** should land on Photo booth — **and we wrote that
connection down ourselves.** It is used today only to FILTER a marketplace search; it has never
been used to FIND a trade.

### ⇒ The source order, corrected

1. **MINE OUR OWN DEFINITIONS** — 1,248 words, **zero model calls, zero invention.** This is the
   "initial data" the owner is naming. It needs no ruling and no new processor.
2. **COLLECT** what suppliers actually type and then pick, as cards get made.
3. **ONLY THEN** consider asking a model, for what 1 and 2 both still miss — and by then there is
   real data to check its answers against, which is the whole point of the collect-first ruling.

⚠ **THE HONEST GAP, because it is the opposite of flattering: 107 categories carry only a name.**
`sorbetes_cart` is one of them — its attributes are `{}` and its facets are `[]`. So mining covers
**153 of 276** well and leaves the rest thin, **and the thin ones are disproportionately the 51
trades that had no word to begin with.** Mining helps most where we are already strong and least
where we are weakest. Do not report "1,248 words" as if it solved the hard half.

---

## 🛑 OWNER RULING 2026-08-28 — COLLECT FIRST, THEN RECOMMEND. THIS REORDERS THE STREAM.

> **Owner, verbatim:** *"when we do not have data yet, do not recommend. collect first. and use
> the collected data for recommendation."*

**What it strikes:** the seeding step — asking Claude to INVENT Filipino/English/Taglish synonyms
for 262 trades with **zero real supplier usage to check them against**. Production has **0
supplier-authored cards and 0 category requests, ever**, so "an admin reviews it" would have been
reviewing fiction, and an approved guess is still a guess — but now it carries the authority of
being stored.

**What survives, and it is most of C2:** the alias table, its **review gate** (an unreviewed word
answers nobody), the matching, and the merge-forward that keeps a word pointing at the right trade.
**Those are the STORE.** Only the SOURCE of the words changes.

### ⇒ The order is now C3 → C2

| was | now | |
|---|---|---|
| C2 seed then C3 remember | **C3 first — COLLECT** | Record what suppliers actually type and what they then pick. Real evidence, no invention. |
| | **C2 second — RECOMMEND** | Once there is a body of real wordings, propose aliases FROM IT, into the same review queue. |

⛔ **DO NOT RUN `scripts/seed-trade-aliases.ts`.** It is the invention step. It stays in the tree
as the eventual mechanism, but it must be fed by collected wordings, not by a cold model. The
review screen's empty state should say *"nothing collected yet"*, not *"run the seeding script"*.

🔑 **AND THIS GENERALISES — it is not a category rule.** Any *"AI suggests X"* in this product must
first answer **what real data is this drawn from?** If the answer is *"none yet"*, build the
collection and stop. Pairs with the standing rule that **empty is the honest state**, not a hole to
fill with fiction.

⚠ **The honest consequence, said out loud:** with 0 suppliers there is nothing to collect either,
so the suggester genuinely cannot recommend anything until real suppliers use the product. That is
the ruling working as intended — it trades a feature that looks alive for one that is actually
true.

---

## 🔴 ONE OPEN ACTION — C2 MERGES INERT UNTIL SOMEBODY RUNS THIS

**C2 ships the machinery and an EMPTY word list.** Nothing a supplier types behaves differently
until the list is filled and reviewed. That takes two steps, in order:

**1 · ~~Propose the words with the seeding script~~ — 🛑 STRUCK by the owner ruling above.**
That script asks a cold model to invent synonyms with nothing to check them against. **Do not run
it.** The words must come from what suppliers actually type (C3), and only then be proposed from
that. The script stays in the tree as the eventual mechanism, re-pointed at collected data.

**2 · Approve them** at **`/admin/taxonomy/aliases`**. An unreviewed word answers nobody — by
design, because a wrong word is worse than no word: if *"catering"* were taught to mean *Funeral
Home*, every supplier typing it lands in the wrong trade, for everyone.

⚖ **A BUTTON FOR STEP 1 WAS BUILT AND THEN REVERSED — owner, 2026-08-28: _"then leave it as a
command."_ Do not re-propose it.** The reversal is recorded because the risk it was meant to cover
is real and now sits here instead: **a feature that ships correct and switched off is the shape this
repo keeps rediscovering weeks later.** The screen's own empty state names the exact command, which
is the whole mitigation.

🔑 **This is also why C3 is not urgent.** C3 remembers wordings the alias list MISSES — and until
step 1 runs, the list misses everything, so C3 would be learning around an empty cache.

---

## ⛔ RULE 0 — pre-answered. Do NOT rebuild any of this.

| Somebody will want to build… | It already ships |
|---|---|
| A ranked search over the service list | **`lib/taxonomy-search-rank.ts`** — four tiers, pure, tested. Written because one-word *"photobooth"* returned **zero**. Only the couple-side autocomplete imports it today |
| "AI answers a word nobody listed, then we remember it" | **`lib/admin-map/ask-the-admin.ts`** + `admin_search_phrases` — deterministic → remembered → model, answer written back, target validated against a live list |
| An Anthropic client + key + keyless fallback | All live; `ANTHROPIC_API_KEY` set in production |
| "AI reads a shop's website and says what they sell" | **`lib/vendor-deep-search.ts`** → `detected_services` |
| A "tell us what you do" intake | **`proposeCategory`** → `taxonomy_category_requests` |
| An admin queue + **four outcomes** + **a real mint** | **`promoteCategoryRequest` · `mapCategoryRequest` · `resolveCategoryRequest`** (`kept_private`/`rejected`) + `createTaxonomyNode` |
| **Renaming a category** | **`renameTaxonomyNode`** — writes `label_en` ONLY, never the key. Safe and audit-logged |
| **Moving a trade to another branch** | **`remapCanonical`** · **`moveTileToFolder`** |
| **Combining two BRANCHES** | **`deleteTileWithDestination`** — refuses to delete a non-empty branch without a destination, then re-points everything. Copy this pattern for C0 |
| **Combining two TRADES** | ✅ **`mergeCanonicalService` → `merge_canonical_service()`** (C0, PR #4946) — one transaction, moves all twelve holders, drops the colliding source row on the six that would throw |
| **An old trade key resolving to its replacement** | ✅ **`canonical_service_taxonomy.merged_into`** + **`lib/service-merge-forward.ts`**, read on `/explore`. Fails OPEN — an unknown key passes through unchanged |
| **Knowing WHO stores a trade key** | ✅ **`lib/taxonomy-merge-holders.ts`** — the registry, twelve columns, guard-enforced |
| **Finding a shop-held key that points at nothing** | ✅ **`lib/dangling-trade-keys.ts`** — no foreign key will ever tell you |

✅ **THE TWO THINGS THAT DID NOT EXIST NOW SHIP — C0, PR [#4946](https://github.com/iscasasola/setnayan-platform/pull/4946). Do NOT rebuild either.**
**`merge_canonical_service()`** folds trade A into trade B in ONE transaction, and
**`canonical_service_taxonomy.merged_into`** forwards an old key — with its reader wired into
`/explore` in the same change, because this repo has already shipped a forwarding ledger that
nothing read for months.

🚨 **AND C0 CORRECTED THREE THINGS THIS REGISTER ASSERTED. Any later session must work from these,
not from the rows above:**

1. **The holder list was THREE from memory. Enumerating the columns out of production found TWELVE** —
   add `vendor_packages.primary_canonical_service`, `vendor_package_items`, `vendor_service_links`,
   `vendor_service_attributes`, **`vendor_screen_name_sequences` (2052 live rows)**,
   `event_vendor_preferences`, `budget_allocation_decisions`, `thread_service_interests`,
   `vendor_schedule_pool_categories`. The list is declared once as data in
   **`lib/taxonomy-merge-holders.ts`** and a guard fails when a column appears in neither the
   move list nor the stated-reason list. **Read that file; never re-derive the list from memory.**
2. **SIX of the twelve sit under a UNIQUE constraint that includes the trade key**, so a plain
   `UPDATE … SET col = dest` throws `23505` the moment one shop holds both trades — the ordinary
   case for a merge, not an edge case.
3. ⚠ **`event_vendors.category_key` is a TILE id, not a trade key** (its own column comment says so),
   so it does **not** constrain a trade merge — contrary to what the brief for C0 assumed.

⚠ **Still true and still worth knowing:** `vendor_coverages.canonical_service`,
`vendor_services.category` and `vendor_profiles.services[]` carry **no foreign key at all**, so the
database will never report a stranded key. **`lib/dangling-trade-keys.ts`** is the report that asks.

---

## ⚖ Owner decisions these sessions wait on

1. **When C4 goes on.** It only fires when a supplier's words match nothing at all — and production
   has had **0 category requests, ever**. *Recommendation: build it dark, switch it on when a real
   supplier first hits an empty result.*
2. 🔴 **C5 is bigger than "tone", and its premise was wrong.** `vendor_web_dossiers` holds **0 rows,
   ever** — there is no stored reading to reuse, so C5 means *running* Deep Search per shop at
   sign-up. And the privacy notice declares Deep Search as **"a paid tool"** the **vendor initiates**
   about their own business, with rolling 180-day deletion. Auto-running it free, on our initiative,
   is a **lawful-basis and purpose change**, not a wording choice. Needs the owner as DPO.
3. **Does a supplier's own confirmed pick teach C3 for everybody, or only an admin?**
   ⚠ Unlike `admin_search_phrases` — whose writers are admins and a validated model — C3's writers
   would be **untrusted accounts writing a cross-tenant cache**. A supplier could type *"catering"*,
   deliberately pick **Funeral Home**, save a real card, and teach that to everyone.
   *Recommendation: only learn a phrase the alias list and search BOTH missed (which caps it to
   obscure wordings), never rank a remembered answer above search, and ship the review/unteach
   screen in the same PR.*
4. ⚖ **Embeddings are demoted, not deleted.** If the owner still wants them later, the Cloudflare
   Workers AI processor question comes back with them — **and it is a real one**: the privacy notice
   declares Cloudflare for **R2 storage and the call relay**, not for AI inference on typed text.
   *Storing files with a vendor is not sending them text to process* — this corpus has been burned
   by that exact conflation before.

---

## 🛡 Global rules for every session here

- **Build up to a gate, stop at it, and say so.** Never flip a production flag, never answer an
  OWNER_DECISION, never `db push` a gated migration.
- **`git worktree add` immediately** — this repo has had its main checkout switched under a session
  three times. **Never read code from `~`** (~750 commits stale; it has produced confident wrong
  answers). Prune the worktree the moment the PR merges; each is 1–2 GB.
- **Install in the worktree before running anything** — a test run in an uninstalled tree proves
  nothing.
- **Require a NON-ZERO `# tests` count.** A run that matched no files prints `0` and exits green.
- **Print `TSC_EXIT` beside the error count** — `tsc` aborts at **134** while printing `errors=0`.
  If you see that, re-run with a bigger heap.
- **Every guard gets a MEASURED mutation**: print the occurrence count before → after, and show it
  going red. ⚠ **On 2026-08-28 THREE of one session's own assertions were decoration and only the
  mutation found them** — a file-level match on a name with four call sites; a match on a bare
  identifier whose source had been emptied; and a deny-list of spellings that missed the third one.
  **Assume the next guard is decoration until it has gone red.**
- **A source-matching guard cannot see a missing import.** Run `tsc` beside it — that is exactly how
  four missing imports were caught in the same session.
- **Read production by the OBJECT**, never from a migration comment or a doc. Applied migrations are
  never edited and several in this repo are provably wrong.
- **Verify any PR state with `gh pr view <n> --json state,mergedAt`.** This corpus has been wrong
  about a PR's state five times.
- **`misc` (Miscellaneous) must stay reachable in every state you build.** The card is universal —
  owner, 2026-08-28: *"the card is universal fit for any service."* Nothing here may become a gate.
