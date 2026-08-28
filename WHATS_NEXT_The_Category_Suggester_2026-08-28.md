# The category suggester — the plan

> **Owner, 2026-08-28:** *"can we have an AI detect and recommend where they should be located?
> like how shopee does when we try to add products on their app?"* then *"create the plan. and can
> AI also generate a new category for the taxonomy?"*
>
> **Short answers:**
> 1. **Yes — and three of the four pieces already ship.** What is missing is wiring, in
>    cheapest-first order. See § 2.
> 2. **Yes, AI can propose a new category — and it must never publish one.** The whole
>    approve-and-mint path *already exists* (`promoteCategoryRequest`), with a person in the middle
>    on purpose. AI writes the proposal; the owner presses once. See § 4.
>
> Measured against `origin/main` = `61715e8c3` and live production, 2026-08-28. Nothing below is
> built yet.

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
| 1 | Rank the real 262 trades against what they typed | ₱0, instant | **Written and tested — not wired into the maker** |
| 2 | Remember a wording somebody used before | ₱0, one indexed read | **Shipping on the admin side** |
| 3 | Ask Claude, then **save the answer** so it is free next time | pennies, once per new wording | **Shipping on the admin side** |
| 4 | Read their website and pre-fill it at sign-up | one call per shop | **Half-built** — Claude already reads shop websites, for the approval screen only |

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

### Slice 3 · Claude suggests when nobody has ever used those words

Only reached when slices 1 and 2 both come back empty.

- The model is handed the 262 trades and **must choose from them**; its answer is validated against
  the live tree before it is shown or stored, exactly as `ask-the-admin.ts` validates against the
  route map. **It cannot invent a trade.**
- It **suggests**; the supplier confirms. Nothing is stored under a kind the supplier did not press.
- The answer is written back to slice 2, so that wording never reaches a model twice.
- 🔒 **Fails silent.** No key, no network, a refusal, a bad shape → the search box behaves exactly as
  in slice 1. A supplier must never see an error about an assistant they did not ask for.

### Slice 4 · Pre-fill from what we already read about them

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

1. **Should the AI step be on at launch, or after the first suppliers arrive?** It costs pennies and
   fails silent, but it is a model in a supplier-facing screen. *Recommendation: slices 1–2 now,
   slice 3 on when a real supplier first hits an empty search.*
2. **Who may teach the box a wording** — only an admin, or does a supplier's own pick teach it for
   everybody? *Recommendation: a supplier's pick teaches it, because the alternative is a queue
   nobody works; but only on a saved card.*
3. **Slice 4's tone.** *"Your website says you do X"* is useful and is also us telling a shop we read
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

| # | Slice | Depends on | New schema | AI |
|---|---|---|---|---|
| 1 | Ranked search over all 262 | #4942 merged | none | no |
| 2 | Remember a wording | 1 | one table | no |
| 3 | Claude suggests, then it is free | 2 | none | yes |
| 4 | Pre-fill from their website | 3 | none | yes (per shop) |
| 4b | The proposal arrives ready to press | 3 | none | yes |

**Slices 1 and 2 are unblocked, cheap, and useful without any AI at all.** That is deliberate: if
the model is never switched on, a supplier can still type *"sorbetes"* and find their trade.
