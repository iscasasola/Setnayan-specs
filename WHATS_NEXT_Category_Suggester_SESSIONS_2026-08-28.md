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
| **C1** | **Typing finds the real trade.** All 262 live trades become searchable in the maker, properly ranked — *"sorbetes"*, *"generator"*, *"tent"*, *"photobooth"* as one word. No model, no new schema. | Sonnet · medium | none | `canvas-maker.tsx` · `services/new/page.tsx` |
| **C2** | **It remembers what suppliers call things.** A wording somebody typed and confirmed answers instantly for the next shop, free. | Sonnet · medium | none | one migration · `canvas-maker.tsx` · a new action |
| **C3** | **It matches by meaning.** *"sound hire"* → **Lights & Sound**. The first embeddings ever generated in this repo. | **Opus · high** | **a new data processor — see § Owner** | migration + backfill + a Workers AI call |
| **C4** | **A trade we do not have arrives ready to press.** Claude drafts the proposal with its near-matches above the button. | **Opus · high** | **owner flips it on; ships dark** | `proposeCategory` · `/admin/taxonomy` |
| **C5** | **Their website fills it in at sign-up.** Reuses the dossier we already take. | Sonnet · medium | **owner rules on tone first** | vendor onboarding |

### 🛑 Never run together

- **C1 and C2 both edit `canvas-maker.tsx`.** Two sessions in that file is how a rebase conflict
  deletes a feature — both sides *append*, and either choice loses one. **Never together.**
- **C3 and C4 both edit the suggestion path.** C4 is only reached when C3 returns nothing, so a
  session that changes C3's confidence floor changes when C4 fires. **Never together.**
- **C1 pairs safely with C5**; C2 pairs safely with C5. **Never more than two at once.**

### Suggested order

**C1 → C2 → C3 → C4 → C5.** C1 and C2 need no model at all and are the whole feature for a
supplier who types a word we already have — which, on the measured taxonomy, is most of them.
**If nothing after C2 is ever built, the naming gap is still closed.**

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
| pgvector | **Installed in production, v0.8.0** |
| The embedding model decision | **Already made and written down:** `bge-small-en-v1.5` via Cloudflare Workers AI, 384 dims — `20260518500000_iteration_0016_wizard_architecture_schema.sql` |

🔴 **But do NOT read that last row as "embeddings are already built."** Measured 2026-08-28:
**zero code anywhere generates an embedding and zero rows hold one.** The columns exist, the model
was chosen, the wiring never happened. **C3 is a first build.**

---

## ⚖ Owner decisions these sessions wait on

1. **C3 sends a supplier's typed words to Cloudflare Workers AI.** That is plausibly a **new data
   processor** under RA 10173, and this project maintains a declared-processor list. *Needs a
   ruling before C3 ships, not after.* ⚠ Note we are already a Cloudflare customer for R2 —
   **storing files with a vendor is not the same as sending them text to process**, and this corpus
   has already been burned once by treating those as the same thing.
2. **When C4 goes on.** It only fires when a supplier's words match nothing at all — and production
   has had **0 category requests, ever**. *Recommendation: build it dark, switch it on when a real
   supplier first hits an empty result.*
3. **C5's tone.** *"Your website says you do X"* is useful and is also us telling a shop we read
   their website. It is already declared for verification; using it to pre-fill their public listing
   is a **different purpose** and may need its own line.
4. **Who may teach the box a wording** (C2) — only an admin, or does a supplier's own confirmed pick
   teach it for everybody? *Recommendation: a supplier's pick teaches it, but only on a SAVED card.*

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
