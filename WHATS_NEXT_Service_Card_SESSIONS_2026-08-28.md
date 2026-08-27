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
| **S2** | **One vocabulary instead of two.** Coverage says *Pabati*; the card kinds have no such word. Measure the real overlap and put ONE proposal in front of the owner. | Opus · high | **ends at an OWNER_DECISION. Build nothing.** | nothing (measurement) |
| **S3** | **A locked kind has somewhere to go.** Today the greyed pill explains and stops. It should lead somewhere. | Sonnet · medium | **owner picks the destination first** (see below) | `canvas-maker.tsx` |
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

1. **Where a plan-blocked kind leads** (gates S3). Drawn: the sentence names the plan. The two real
   options are the pricing page, or the *"tell us what you do"* form that **already exists**.
2. **Whether one vocabulary replaces two** (S2's whole output). A migration touches what couples
   search by, so it is his call, not an engineering tidy-up.
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
