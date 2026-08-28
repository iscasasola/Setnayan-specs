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
| **C2** | **One trade, many names.** An alias list — *sorbetes · sorbetero · ice cream cart* all find the same trade. Written once by Claude **offline**, checked by a person, then free forever. | Sonnet · medium | none — supplier text never leaves the server | one migration · the ranker · an admin review screen |
| **C3** | **It remembers what suppliers confirm.** Only for phrases the alias list missed. | Sonnet · medium | **⚠ read the poisoning risk first** | one migration · `canvas-maker.tsx` |
| **C4** | **A trade we do not have arrives ready to press.** Claude drafts the proposal with its near-matches above the button. | **Opus · high** | **ships dark; owner flips** | `proposeCategory` · `/admin/taxonomy` |
| **C5** | **Their website fills it in at sign-up.** | Sonnet · medium | 🔴 **owner + DPO: lawful basis, not just tone** | vendor onboarding |
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

## 🔴 ONE OPEN ACTION — C2 MERGES INERT UNTIL SOMEBODY RUNS THIS

**C2 ships the machinery and an EMPTY word list.** Nothing a supplier types behaves differently
until the list is filled and reviewed. That takes two steps, in order:

**1 · Propose the words** — from the code repo:

```
pnpm -F @setnayan/web exec tsx scripts/seed-trade-aliases.ts
```

It asks Claude for Filipino / English / Taglish words for each trade and files them for review.
Needs `ANTHROPIC_API_KEY`. Nothing it proposes can answer anybody yet.

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
