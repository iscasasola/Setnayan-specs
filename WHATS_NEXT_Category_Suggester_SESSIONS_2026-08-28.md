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
| **C0** | **A category can be undone.** Combine two trades into one, and make an old name still land on its replacement. **Build this BEFORE anything proposes new trades.** | **Opus · high** | none | `admin/taxonomy/actions.ts` · one migration |
| **C1** | **Typing finds the real trade.** All live trades searchable in the maker, properly ranked — *"sorbetes"*, *"generator"*, *"tent"*, *"photobooth"* as one word. No model, no new schema. | Sonnet · medium | none | `canvas-maker.tsx` · `services/new/page.tsx` |
| **C2** | **One trade, many names.** An alias list — *sorbetes · sorbetero · ice cream cart* all find the same trade. Written once by Claude **offline**, checked by a person, then free forever. | Sonnet · medium | none — supplier text never leaves the server | one migration · the ranker · an admin review screen |
| **C3** | **It remembers what suppliers confirm.** Only for phrases the alias list missed. | Sonnet · medium | **⚠ read the poisoning risk first** | one migration · `canvas-maker.tsx` |
| **C4** | **A trade we do not have arrives ready to press.** Claude drafts the proposal with its near-matches above the button. | **Opus · high** | **ships dark; owner flips** | `proposeCategory` · `/admin/taxonomy` |
| **C5** | **Their website fills it in at sign-up.** | Sonnet · medium | 🔴 **owner + DPO: lawful basis, not just tone** | vendor onboarding |
| ~~Cx~~ | ~~Match by meaning (embeddings)~~ | — | 🛑 **DEMOTED — do not build it yet** | — |

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

**C0 first, and this is the owner's own question answered:** we can rename a category freely and
safely today, we can combine two *branches*, and we **cannot combine or reroute a TRADE at all** —
the column for it has existed since 2026-08-03 with zero writers and zero readers. Building the undo
before anything starts proposing new trades is the difference between a mistake that costs a click
and one that is permanent.

**C1 + C2 are the whole feature for most suppliers**, need no supplier text to leave the server, and
close the naming gap on their own. **If nothing after C2 is ever built, the gap is still closed.**

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

🔴 **AND THE TWO THINGS THAT DO NOT EXIST — this is C0's whole scope.** There is **no leaf-level
merge and no leaf-level delete** anywhere in the admin, and `service_categories.merged_into_category_id`
has existed since 2026-08-03 with **0 writers · 0 readers · 0 values**. Meanwhile
`vendor_coverages.canonical_service`, `vendor_services.category` and `vendor_profiles.services[]`
carry **no foreign key at all**, so nothing would stop a trade being deleted out from under the
shops that listed under it.

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
