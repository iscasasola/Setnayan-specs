# The service card maker — session register · 2026-08-28

> **What already shipped is in PR [#4930](https://github.com/iscasasola/setnayan-platform/pull/4930)
> and the plan it was measured against is
> [`WHATS_NEXT_Service_Card_Maker_2026-08-28.md`](WHATS_NEXT_Service_Card_Maker_2026-08-28.md).**
> Read that file before opening any session below — **19 promises, 19 built.** Everything here is
> what is LEFT, and every row names what already exists so nothing gets rebuilt.
>
> **Paste-ready prompts:**
> [`WHATS_NEXT_Service_Card_SESSION_PROMPTS_2026-08-28.md`](WHATS_NEXT_Service_Card_SESSION_PROMPTS_2026-08-28.md)

---

## The sessions

| # | What a person gets | Model · effort | Gate | Touches |
|---|---|---|---|---|
| **S1** | **It is live, and it works on a real shop.** #4930 lands, production is confirmed to be serving it BY ANCESTRY, and the owner's own shop is walked end to end. | Sonnet · low | none — but it must not start before #4930 is MERGED | nothing (verification) |
| **S2** | ✅ **DONE.** One vocabulary instead of two — measured (262 leaves vs 52 kinds: 16 exact · 195 family-only · **51 leaves with no word that means their trade** — they could always make a card under *Miscellaneous*), the owner ruled ***"yes their own words"***, and it is built: a card's kind may be the shop's own coverage leaf, the legacy 52 stay one tap below, nothing migrated (**0 supplier-authored cards have ever existed**). Fixed on the way: `parentsOfCategory` **threw** on any stored kind outside the 52 — which both prod cards already are. | Opus · high | closed | `lib/service-card-kind.ts` · the save · the chooser |
| **S3** | ✅ **DONE.** A locked kind has somewhere to go — owner picked the "tell us what you do" intake over the pricing page (2026-08-28). The pill stays disabled; the one reason sentence links to `proposeCategory` on My Shop's Tools tab; an explicit "Back to your card" link and the intent survive the redirect; the maker's existing draft-keep is what actually restores the card. Guard: `a-locked-kind-leads-somewhere.test.ts`, 8 assertions, mutation-tested. ⚠ Built on top of PR #4930's branch (its code didn't exist on `main` yet) — its own PR retargets to `main` once #4930 merges. | Sonnet · medium | closed | `canvas-maker.tsx` |
| **S4** | **The laptop gets its two columns.** The card pinned left at full size, the question beside it. | Sonnet · medium | none | `canvas-maker.tsx` · `globals.css` |
| **S5** | **A published card looks right where couples meet it.** Walk one card from the maker to the public shop page and fix what does not survive the trip. | Sonnet · medium | none | `app/v/[slug]` · marketplace card |

### 🛑 Never run together

- **S3 and S4 both edit `canvas-maker.tsx`.** Two sessions in that file is how a rebase conflict
  deletes a feature — both sides *append*, and either choice loses one. **Never together.**
- Everything else pairs safely. **S1 and S2 are read-only and pair with anything.**
- **Never more than two at once** (ten parallel builds once shipped 44 defects).

### Suggested order

**S1 first** (it is minutes, and it tells the rest of them whether the ground is real) → then
**S2 + S5** as a safe pair → then **S4** → **S3** last, because it cannot start until the owner has
answered.

---

## ⛔ What must NOT be rebuilt — RULE 0, pre-answered

| Somebody will want to build… | It already ships |
|---|---|
| A "tell us what you do" intake for a missing category | **`proposeCategory`** — a vendor form on My Shop writing `taxonomy_category_requests`, with an admin queue at `/admin/taxonomy` |
| A draft/autosave for a half-finished card | **`lib/canvas-draft-keep.ts`** — kept in the browser, offered back, cleared on save |
| A second "create a card" entrance | **There is exactly one:** `SERVICE_MAKER_HREF`. Six call sites, all pointed at it |
| A category chooser on the `[category]` route | **Deliberately absent.** That route takes its kind from the URL and a guard fails if it grows one |
| A card-quality meter | **`lib/card-health.ts`** ships and mirrors the publish gate |

---

## ⚖ Owner decisions these sessions wait on

1. ✅ **CLOSED 2026-08-28 — where a plan-blocked kind leads (gated S3).** Owner picked the
   *"tell us what you do"* form over the pricing page. Built; see the S3 row above. Do not re-ask.
2. ✅ **CLOSED 2026-08-28 — one vocabulary replaces two, and it is the shop's own words.** Owner,
   asked twice: ***"1. yes 2. yes their own words."*** A card's kind may now be a **coverage leaf**
   (*Pabati*), which is what the chooser's leading band offers; the 52 legacy kinds stay one tap
   below and nothing was migrated. **Do not re-ask.**
   ⚠ **The premise of this row was FALSE and the measurement corrected it: a couple never searches
   the card-kinds list.** Every supplier-discovery path filters the COVERAGE words, and every
   `?category=` link the app emits carries a canonical leaf key. Measurement + the 262-row table:
   [`SERVICE_CARD_VOCABULARY_MEASURED_2026-08-28.md`](SERVICE_CARD_VOCABULARY_MEASURED_2026-08-28.md).
   PR [#4942](https://github.com/iscasasola/setnayan-platform/pull/4942) (auto-merge armed) — ⚠ verify with `gh pr view 4942 --json state,mergedAt` before trusting this line.
   ⏭ **Two small things it deliberately did NOT do, each named rather than half-done:** the public
   shop page's exact leaf naming (S5's file — two PRs landed in it the same day), and the three
   kinds in no picker group at all (`funeral_home` · `cremation` · `memorial_park`), **so no
   funeral-shaped word renders in the legacy list.**
   🛑 **OWNER'S CORRECTION 2026-08-28 — do NOT repeat the stronger claim:** *"the card is universal
   fit for any service."* Right, and measured: `misc` is offered to every shop and is exempt from
   the family cap, so **every shop could always MAKE a card.** The gap is the WORD, never the
   ability. *An absent option is not a closed door when a catch-all is on the same screen.*
3. **Whether a half-finished card should survive on our side, not just in that browser.** Today it
   is browser-only on purpose — a server draft mints a real card row per abandoned attempt.

---

## 🛡 Global rules for every session here

- **Build up to a gate, stop at it, and say so.** Never flip a production flag, never answer an
  OWNER_DECISION, never `db push` a gated migration.
- **`git worktree add` immediately** — this repo has had its main checkout switched under a session
  three times. Prune the worktree the moment the PR merges; each is 1–2 GB and a full disk deadlocks
  every command, including the `rm` that would fix it.
- **Verify any PR state with `gh pr view <n> --json state,mergedAt`.** This corpus has been wrong
  about a PR's state five times.
- **A test run that prints `# tests 0` is a PASS THAT PROVED NOTHING** — require a non-zero count.
  `--test` on a `[slug]` path silently matches nothing.
- **Print `TSC_EXIT` beside the error count** — `tsc` aborts at 134 while printing `errors=0`.
- **Every guard gets a measured mutation**: print the occurrence count before → after. A sabotage
  that did not land reports a clean pass. **29 mutations across this stream; assume the next guard
  is decoration until it has gone red.**
- **Never read code from `~`** — that checkout is ~750 commits stale. `git worktree add --detach
  /tmp/wt-read origin/main`.
