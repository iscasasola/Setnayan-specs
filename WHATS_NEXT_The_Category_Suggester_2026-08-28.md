# The category suggester — the plan

> **Owner, 2026-08-28:** *"can we have an AI detect and recommend where they should be located?
> like how shopee does when we try to add products on their app?"* then *"create the plan. and can
> AI also generate a new category for the taxonomy?"*
>
> **Short answers:**
> 1. **Yes — and most of it is wiring, not invention.** The lexical search, the
>    ask-once-then-remember pattern and the website reader all already ship. ⚠ **The research
>    changed the middle of the plan** — see § R: the matching should be done by **embeddings**, not
>    by asking the model, and that is the one part nothing has ever done here.
> 2. **Yes, AI can propose a new category — and it must never publish one.** The whole
>    approve-and-mint path *already exists* (`promoteCategoryRequest`), with a person in the middle
>    on purpose. AI writes the proposal; the owner presses once. See § 4.
>
> Measured against `origin/main` = `61715e8c3` and live production, 2026-08-28. Nothing below is
> built yet.

---

## R · What the research says — and it CHANGED this plan

> Searched 2026-08-28, after the first draft. **The first draft put the LLM in the middle of the
> suggestion. The evidence says that is the wrong instrument for this job**, so the plan below is
> revised. Sources at the end of this section.

> 🛑 **CORRECTION, 2026-08-28, after a Fable adversarial pass — AND I HAD ALREADY TOLD THE OWNER
> THE WRONG NUMBER.** The claim below was the load-bearing evidence for putting embeddings in the
> middle of this plan. **It does not apply to what was proposed.**

**1 · ~~For picking a category from a fixed list, embeddings beat LLM prompting — 49.5% higher
accuracy.~~ STRUCK.** *Beyond the Hype* (arXiv 2504.04277) does measure that — for a **SUPERVISED
softmax classifier trained on Thumbtack's own labelled history**. Verified by fetching the
abstract: *"we build embeddings-based softmax models"*, and the paper conditions its own result on
problems *"that can leverage **proprietary datasets**"*.

🔴 **We have no such dataset and will not for months: production holds ZERO supplier-authored
service cards, so there are zero labelled examples to train on.** What this plan actually proposed
was **zero-shot cosine similarity against label text** — a different and much weaker method that
the paper never measured and never endorses. Citing its number for it was a category error.

⚖ **The domain match was real and is the only part that survives** — they predict professional
service categories from free text, which is our shape. That makes the *problem* comparable. It does
not make the *result* transferable.

**2 · The standard production recipe is "embed the taxonomy once, offline".** Each category is
embedded from its own name/description; at runtime the typed words are embedded with the same
instruction and matched by cosine similarity. The taxonomy side is computed **once**, not per query
— which is the whole cost story: **262 embeddings ever, then one tiny embedding per new phrase.**

**3 · LLM output cannot be controlled or interpreted precisely**, which the literature flags as
disqualifying where you need controllable accuracy and recall. A category that decides what couples
find a shop under is exactly that setting.

**4 · Category prediction is conventionally treated as HIERARCHICAL** (folder → branch → leaf), not
as 262 flat labels. Ours already is a tree; the match should use it rather than flatten it.

### 🔢 What we already have for this, measured — and the one thing we do not

| | |
|---|---|
| `pgvector` in production | ✅ **installed, v0.8.0** — read out of prod, not assumed |
| An embedding model already chosen and written down | ✅ **`bge-small-en-v1.5` via Cloudflare Workers AI, 384 dims** — `20260518500000_iteration_0016_wizard_architecture_schema.sql` |
| Vector columns already in prod | ✅ `concierge_brain_chunks.embedding` · `concierge_unanswered_questions.query_embedding` |
| We are already a Cloudflare customer | ✅ (R2) |
| **Anything that has ever GENERATED an embedding** | 🔴 **NO. Nothing, anywhere.** |

🔴 **BE HONEST ABOUT THAT LAST ROW — it is the eighth "gate with no handle" in this corpus.** The
columns exist, the model was chosen, the extension is live, and **zero code writes an embedding and
zero rows hold one** (`concierge_brain_chunks` = 0 rows; a repo-wide grep for a writer finds only
false positives — bidi "embedding", face-vector comments, prose). So this is a **first build, not a
reuse.** The decision is made for us; the wiring has never existed. Do not scope it as "already
there".

**Sources:**
[Beyond the Hype: Embeddings vs. Prompting for Multiclass Classification Tasks](https://arxiv.org/abs/2504.04277) ·
[Deep Hierarchical Classification for Category Prediction in E-commerce](https://arxiv.org/pdf/2005.06692) ·
[Text Classification for Predicting Multi-level Product Categories](https://arxiv.org/pdf/2109.01084) ·
[Leveraging Taxonomy and LLMs for Improved Multimodal Hierarchical Classification](https://arxiv.org/abs/2501.06827) ·
[Taxonomy Completion with Embedding Quantization and an LLM-based Pipeline](https://huggingface.co/blog/dcarpintero/taxonomy-completion) ·
[What is pgvector? (Databricks)](https://www.databricks.com/blog/what-is-pgvector)

---

## 0 · The one-page version

When a supplier makes a service card they must say **what kind of service it is**. Today that means
recognising their trade in a list of words somebody else chose. We just fixed half of it — a shop's
own coverage words now lead the list (PR
[#4942](https://github.com/iscasasola/setnayan-platform/pull/4942)) — but a shop that has not
declared coverage yet still meets a list of ~46 departments and a crude word match.

**Shopee's trick is three cheap steps and one expensive one, in that order.** We already own all
three cheap ones; we are just not using them here.

| Step | What it does | Cost | Status |
|---|---|---|---|
| 1 | Rank the real trades against the words they typed | ₱0, instant | **Written and tested — not wired into the maker** |
| 2 | **An ALIAS list** — *sorbetes · ice cream cart · sorbetero* all point at the same trade, written once and checked by a person | one offline pass, then ₱0 forever | new, small, and needs no new supplier |
| 3 | Remember a wording a supplier confirmed | ₱0 | **Pattern ships on the admin side** — but see the poisoning risk in § 6 |
| 4 | Ask Claude — **only** to propose a trade we do not have | pennies, rare | **Pattern ships on the admin side** |
| — | ~~Match by meaning (embeddings)~~ | — | 🛑 **DEMOTED — see below** |
| 5 | Read their website and pre-fill it at sign-up | one call per shop | 🔴 **thinner than written — 0 dossiers exist, ever** |

🛑 **THE EMBEDDINGS SLICE IS DEMOTED, NOT DELETED — and this is the biggest change.** It was the
centre of the plan an hour ago. Three measured reasons killed its priority:

1. **Its evidence does not apply** (§ R, corrected above) — the cited win is a trained classifier;
   we have nothing to train on.
2. **The chosen model is ENGLISH.** `bge-small-en-v1.5` — and the whole point of this feature is
   *sorbetes · pabati · ninong sets · abuloy · Taglish spellings*, which is exactly where an
   English-only model degrades. ⚠ And that choice rests on **an inline comment in a 2026-05
   migration** on a column nothing has ever written — the evidence class this corpus explicitly
   says is never evidence.
3. **It cannot be tested here.** The PGlite replay rewrites `extensions.vector(N)` → `text` and
   no-ops `CREATE EXTENSION vector` (`tests/db/replay-migrations.ts:272-274`), so the `<=>` operator
   does not exist in the replay. **Every db test about it would be vacuous by construction** — the
   same shape as the `relrowsecurity` blind spot this corpus already pinned.

⇒ **An alias list does the same job for our size** — 288 trades, 2 shops, 0 authored cards. It is
written once by the model we already declare, **checked by a person**, stored beside the taxonomy,
and matched by the ranker we already have. Supplier text **never leaves the server**, so there is no
new processor, no new secret, and no privacy-notice change. It degrades to step 1 if empty.
**Revisit embeddings only if the alias list measurably misses real supplier phrases** — a condition
production cannot currently produce one data point for.

**The economics are already proved in this codebase:** the admin box asks the model only when the
first two steps have nothing, and writes the answer back, so *the feature gets cheaper the more it
is used.* Production has **1** learned phrase, `learned_from='ai'` — the mechanism works.

---

## 1 · ⛔ RULE 0 — what must NOT be rebuilt

Every row measured, not remembered.

| Somebody will want to build… | It already ships |
|---|---|
| A ranked search over the service list | **`lib/taxonomy-search-rank.ts`** — four tiers, pure, tested. Written *because* the single word "photobooth" used to return **zero** results. Today only `explore/_components/taxonomy-search.tsx` imports it |
| A "type what you mean, we find it" box on the marketplace | The couple-side taxonomy autocomplete — same module |
| "The AI answers a word nobody listed, then we remember it" | **`lib/admin-map/ask-the-admin.ts`** + **`admin_search_phrases`** — deterministic → remembered → AI, answer written back, model constrained to choose from a validated list |
| An Anthropic client, a key, a keyless fallback | All live. `ANTHROPIC_API_KEY` is set in production (proved by the object 2026-08-27) |
| "AI reads a shop's website and says what they sell" | **`lib/vendor-deep-search.ts`** — `detected_services`, via Claude + web search, stored in `vendor_web_dossiers` |
| A "tell us what you do" intake for a missing trade | **`proposeCategory`** → `taxonomy_category_requests`, a vendor form on My Shop |
| An admin queue to review those requests | **`/admin/taxonomy`** — the requests list is already on it, and on `/admin` |
| **Minting a real new leaf from a request** | **`promoteCategoryRequest`** — picks a tile, inserts the `canonical_service_schemas` + `canonical_service_taxonomy` rows, refuses an exact-slug duplicate, audit-logged |
| Mapping a request onto an existing trade instead | **`mapCategoryRequest`** |
| Rejecting / keeping-private a request | **`resolveCategoryRequest`** (`kept_private` · `rejected`) |
| An admin screen to create a category by hand | **`createTaxonomyNode`** + `/admin/taxonomy` studio — the ⌘K assistant already navigates to it and pre-fills it |

**So the taxonomy already has: an intake, a queue, four outcomes, and a mint. What it has never had
is anything that helps decide.** That is the whole gap.

---

## 2 · The plan — four slices, cheapest first

Each slice is complete on its own and useful if the next never happens.

### Slice 1 · The maker searches all 262 trades, ranked · **no AI, no new table**

Today the maker's kind search is `o.label.toLowerCase().includes(query)` over the **~46 legacy
pills**. The 262 real trades are not searchable there at all — only the shop's own coverage leaves
appear, in the band #4942 added.

- Type *"generator"*, *"sorbetes"*, *"funeral"*, *"tent"* → the real trade comes back.
- Uses the shipped `taxonomy-search-rank.ts`, so *"photobooth"* as one word works for the same
  reason it works for couples.
- **Leaves appear as SEARCH RESULTS ONLY, never as a rendered wall.** The owner's lock is
  *"coverage-first, the rest one tap away"* — 262 pills on screen would be the wall coming back.
- Storing a leaf is already legal end to end after #4942 (the gate, the plan caps, the
  `[category]` route and every label).

**This alone closes most of the naming gap**: the 51 trades with no word of their own, and the
three funeral kinds that render in no group.

⚠ **Depends on #4942 landing.** Verify with `gh pr view 4942 --json state,mergedAt`.

### Slice 2 · It remembers what suppliers call things · **no AI**

A supplier types *"sound system rental"*, picks **Lights & Sound**. We store that pairing. The next
supplier who types the same words gets the answer with no search and no model.

- Mirrors `admin_search_phrases` exactly — one table, `phrase` UNIQUE, the target **validated
  against the live tree at read time**, `learned_from ∈ ('ai','vendor','admin')`, `times_used`.
- 🔒 **The stored target must be checked on the way OUT, not just IN.** A leaf can be retired after
  the row is written; a remembered answer pointing at a dead leaf must silently fall through to
  search, never render.
- ⚠ **A wrong answer learned once is served to everybody.** Only write the pairing when the
  supplier actually *picked* it and *saved the card* — not on hover, not on first tap.

### Slice 3 · Match by MEANING — embeddings, not the model · **the evidence-backed core**

Only reached when slices 1 and 2 both come back empty. This is what makes *"sorbetes cart"* find
**Ice Cream Cart** and *"sound hire"* find **Lights & Sound** — matches no amount of letter-matching
will ever make.

- **Embed the 262 trades ONCE** (name + branch + folder as the text), store on the taxonomy row,
  cosine index. Re-embed only when an admin adds or renames one.
- At runtime embed the typed phrase with the **same instruction**, take the nearest few, show them
  with their branch so two similar trades are told apart.
- 🔑 **Use the tree, do not flatten it.** The literature treats this as hierarchical; a match whose
  branch is miles from anything the shop covers deserves to rank below one that is close.
- 🔒 **A similarity score is not a decision.** Below a floor, show nothing and fall through to
  slice 4 — a confidently wrong suggestion is worse than none, because a supplier who trusts it
  files their card under someone else's trade.
- 🔴 **This is a FIRST BUILD.** `pgvector` is live and the model is chosen, but **nothing in this
  repo has ever generated an embedding** (§ R). Budget it as new work.
- 🔒 **Fails silent.** No key, no network, a bad shape → the box behaves exactly as in slice 1. A
  supplier must never see an error about an assistant they did not ask for.

### Slice 4 · Claude — only for a trade that does not exist yet

Reached only when slices 1–3 have all come back empty, which by then genuinely means *"we have no
word for this"*.

- It does **not** pick from the list — embeddings already did that better (§ R). Its job is the one
  thing they cannot do: **write the proposal** (§ 5).
- It **suggests**; the supplier confirms. Nothing is stored under a kind the supplier did not press.
- Whatever the supplier picks is written back to slice 2, so that wording is free ever after.

### Slice 5 · Pre-fill from what we already read about them

`vendor_deep_search` already asks Claude what a shop advertises on its own website, and stores
`detected_services` — free text, admin-only, used on the approval screen.

- Run the same dossier's `detected_services` through slices 1–3 to produce **suggested coverage**
  at sign-up: *"Your website mentions sorbetes carts and mobile bars — shall we add those?"*
- ⚖ **Suggested, never applied.** Coverage decides what couples find them under; silently writing it
  from a web guess is the shop's own listing, changed by a machine.
- ⚠ **This is the only slice that costs a model call per shop rather than per new wording.** It is
  last for that reason.

---

## 3 · What a supplier actually experiences, end to end

> They press **Create service card**. The card opens.
> They tap *What kind of service?* — **their own words are already there** (*Pabati*), because they
> told us what they cover.
> If it is something else, they type it: *"sorbetes cart"*. It comes back instantly.
> If nobody has ever typed those words before, we ask once, show what we think, and they confirm.
> If it genuinely is not on our list, they say what they do — and that lands in a queue with a
> proper proposal already written, for one press.

**At no point does the card refuse them.** Miscellaneous is still on the same screen, always.

---

## 3b · 🔴 CAN WE UNDO ONE? — measured, because it decides everything else

> **Owner, 2026-08-28:** *"if ever a category added a new one, are we capable of rerouting them,
> combining them to an existing, or renaming the category in the future?"*
>
> **The right question, and the answer is mixed. Renaming is free. Rerouting and combining a TRADE
> are not built at all — and the column for it exists, unwired.**

| What you asked | Can we? | Measured |
|---|---|---|
| **Rename a category** | ✅ **Yes, safely, any time** | `renameTaxonomyNode` writes **`label_en` only — never the key.** Everything that stored the old key keeps working; only the words on screen change. Audit-logged. **Renaming is genuinely free and reversible.** |
| **Move a trade to a different branch** | ✅ Yes | `remapCanonical` re-points one leaf; `moveTileToFolder` moves a whole branch |
| **Combine two BRANCHES** | ✅ Yes, and it is well built | `deleteTileWithDestination` **refuses to delete a non-empty branch without a destination**, then re-points every trade and refinement to it. Its own rule: *"never strand a canonical"* |
| **Combine two TRADES into one** | ✅ **YES — built 2026-08-28** | **`mergeCanonicalService` → `merge_canonical_service()`** (PR [#4946](https://github.com/iscasasola/setnayan-platform/pull/4946)). ONE transaction, moves all **twelve** columns that hold a trade key, drops the colliding source row on the **six** that sit under a UNIQUE constraint including the key. The source is TOMBSTONED, never deleted |
| **Reroute an old trade to its replacement** | ✅ **YES — built 2026-08-28** | **`canonical_service_taxonomy.merged_into`**, read by `lib/service-merge-forward.ts` on `/explore`. 🛑 **NOT `service_categories.merged_into_category_id` — that column CANNOT do this.** It sits on a table holding only tier-1 folders (16) and tier-2 tiles (78); read out of prod, **there is no tier 3**, so it can forward a BRANCH and never a TRADE. It remains unwired, and that is now correct rather than a gap |

### 🚨 And the shop-side columns have no seatbelt

`vendor_coverages.canonical_service`, `vendor_services.category` and `vendor_profiles.services[]`
(a text array — it cannot have one) carry **NO foreign key** to the taxonomy. So the database would
not stop a trade being deleted out from under them; those shops would silently hold a key pointing
at nothing.

Three other tables *do* hold `RESTRICT` foreign keys — `event_vendor_preferences`,
`vendor_service_attributes`, `event_vendors.category_key` — so a delete is blocked **only if one of
those rows happens to exist.** Protection by coincidence, not by design.

### ⇒ ✅ ALL THREE ARE BUILT — PR [#4946](https://github.com/iscasasola/setnayan-platform/pull/4946), migration `20271176753752`. Do NOT rebuild any of it.

⚠ Verify with `gh pr view 4946 --json state,mergedAt` before trusting this line.

1. ✅ **A leaf-level merge** — `merge_canonical_service()`, on the `deleteTileWithDestination`
   never-strand pattern, but as **one SQL transaction rather than sequential writes**: twelve
   tables with compensating rollback leaves shops HALF-MOVED on any failure.
2. ✅ **The forward, with its reader in the same PR** — and on the **right object**: a new
   `canonical_service_taxonomy.merged_into`, not `merged_into_category_id` (see the corrected
   row above). `/explore?category=<old key>` resolves to the replacement.
3. ✅ **The dangling-key report** — `lib/dangling-trade-keys.ts`.

🚨 **THREE CORRECTIONS THIS BUILD MADE TO THE PLAN ABOVE — later sessions must use these:**

- **The holder list was THREE from memory; the columns say TWELVE.** Declared once as data in
  `lib/taxonomy-merge-holders.ts`, guard-enforced. One of them, `vendor_screen_name_sequences`,
  holds **2052 live production rows** and was not in the remembered list at all.
- **Six of the twelve throw `23505` on a plain UPDATE** the moment one shop holds both trades —
  the ordinary case for a merge, not an edge case.
- **`event_vendors.category_key` is a TILE id, not a trade key**, so it does not constrain a
  trade merge.

🔑 **THE "close to permanent" WARNING IN § 4 IS NOW GENUINELY SOFTER — a duplicate trade is
recoverable.** It is NOT free, and § 4 otherwise stands: a merge still moves other people's
listings and cannot be undone, which is why the control asks an admin to type the trade's name.
**AI still must not mint a category** — that reasoning is unchanged.

---

## 4 · 🔴 "Can AI also generate a new category?" — yes to the draft, no to the publish

**It can and should draft one. It must not be the thing that creates it.** Three measured reasons,
not taste:

1. **A leaf is close to permanent.** Removing one strands the shops that declared coverage on it —
   this corpus already refused to delete the `setnayan_pailaw` leaf for exactly that reason, and
   shop addresses are immutable. Every mint is a decision you mostly cannot take back.
2. **The duplicate check that exists is a SLUG match, not a meaning match.** `promoteCategoryRequest`
   refuses `"sorbetes_cart"` if that exact key exists — it would happily mint *Sorbetes Cart*
   alongside *Ice Cream Cart*. An AI minting freely produces exactly that kind of split, and a split
   trade means two half-empty category pages and suppliers who cannot find each other.
3. **The owner's own standing rule** (one-person admin plan, 2026-07-11): the assistant *may prepare
   and may hold back; it may never be the thing that lets money, a price, an approval or a publish
   through.* A public category is a publish.

### So what AI does instead — and it is most of the work

When a supplier says *"I do sorbetes carts"* and nothing matches:

1. **Check it against the 262 first.** Most "new" categories are an existing trade under another
   name. If it is, say so in their words — *"we call that Sorbetes Cart"* — and no request is filed
   at all. **This is the highest-value half and it needs no new schema.**
2. **If it is genuinely new, write the proposal properly**: a clean name, **which branch it belongs
   under** (the mint already requires a `tile_id` and today a person picks it blind), why it is not
   one of the near-matches, and the supplier's own words as evidence.
3. **It lands in the queue that already exists**, as a pending request — the same table, the same
   four outcomes. The only change is that the row arrives *ready to press* instead of as a bare
   label.

🔑 **The queue has never been used: production holds ZERO category requests, ever.** So this ships
into an empty queue and can be watched from the first one.

⚠ **And the first real request is worth reading by hand.** A queue with a suggestion attached is a
queue people stop reading — the risk is the owner pressing Promote on an AI's tile guess without
looking, which is precisely the failure the human-in-the-middle exists to prevent. The proposal
should show its near-matches **above** the Promote button, not below it.

---

## 5 · ⚖ Owner decisions — the only things I will not decide

1. **Which of the two instruments goes on, and when.** They are different decisions now:
   **slice 3 (embeddings)** is cheap, predictable and the measurement says it is the right tool —
   *recommendation: build it as soon as 1–2 are in.* **Slice 4 (the LLM)** only ever fires when a
   supplier's words match nothing at all — *recommendation: leave it off until a real supplier
   actually hits that, which prod says has never happened (**0 category requests, ever**).*
2. **Who may teach the box a wording** — only an admin, or does a supplier's own pick teach it for
   everybody? *Recommendation: a supplier's pick teaches it, because the alternative is a queue
   nobody works; but only on a saved card.*
3. **Slice 5's tone.** *"Your website says you do X"* is useful and is also us telling a shop we read
   their website. It is already in the privacy notice for verification; using it to pre-fill their
   listing is a different purpose.

---

## 6 · 🪤 Traps this will hit — assume a fifth

1. **`o.label.includes(query)` is not a search.** The reason `taxonomy-search-rank.ts` exists is
   that a one-word "photobooth" matched nothing. Do not write a second matcher — import that one.
2. **A remembered answer must be validated on READ.** A leaf can be retired after the pairing is
   stored. `ask-the-admin.ts` validates its stored href against the route map at read time for the
   same reason.
3. **A model that "chooses from a list" still has to be checked against the list.** It will return a
   plausible key that does not exist. Validate, then show — never show, then validate.
4. **`# tests 0` is a pass that proved nothing**, and a source-matching guard cannot see a missing
   import — both bit this stream on 2026-08-28. Print the count; run `tsc` beside it.
5. **Do not let the suggester become a gate.** Miscellaneous stays on the screen. A supplier who
   disagrees with the suggestion must be able to ignore it without a fight — the card is universal
   (owner, 2026-08-28: *"the card is universal fit for any service"*).

---

## 7 · Order, and what blocks what

| # | Slice | Depends on | New schema | Model |
|---|---|---|---|---|
| 1 | Ranked search over all 262 | ✅ #4942 merged | none | none |
| 2 | Remember a wording | 1 | one table | none |
| 3 | **Match by meaning (embeddings)** | 2 | a vector column + index on the taxonomy | embedding only, **262 once** + one per new phrase |
| 4 | Claude proposes a trade that does not exist | 3 | none | LLM, rare |
| 5 | Pre-fill from their website | 4 | none | LLM, once per shop |

**Slices 1 and 2 are unblocked, cheap, and useful without any model at all.** That is deliberate:
if nothing is ever switched on, a supplier can still type *"sorbetes"* and find their trade.

⚖ **And the ordering is now evidence-backed, not taste:** the cheap deterministic steps first, then
the instrument the measurement says is best at *choosing from a fixed list* (embeddings), and the
LLM last and narrowest — proposing something that is not on the list at all.
