# WHAT'S NEXT — the admin's search and assistant (2026-08-26)

> **Seven PRs shipped today and are LIVE** (#4859 · #4862 · #4866 · #4870 · #4873 · #4876 · #4880;
> production self-reports `1b4fada`). This file is what is **NOT** done.
>
> ⚠ **Verify any PR state here with `gh pr view <#> --json state,mergedAt` before acting** — this
> register has been wrong about a PR's state four separate times.
>
> ### 🛑 2026-08-27 — #4888 SHIPPED THE FORM-FILL, THE OWNER HIT § 1 IN PRODUCTION, AND #4892 DID **NOT** FIX IT
>
> He typed the flagship sentence — ***"add a new category on the taxonomy service"*** — into prod
> and landed on Taxonomy. No questions, no form. #4892 (**MERGED** 2026-08-27T01:52Z) tried to fix
> it and **an adversarial pass proved it does not** — 21 agents, every survivor confirmed BY
> EXECUTION and past two skeptics told to refute it. **Do not read #4892 as a fix.**
>
> 🚨 **THE OFFER IS UNREACHABLE BY THE GESTURE THAT PRODUCED THE BUG REPORT — FOURTH INSTANCE OF
> *A FIX NOBODY CAN REACH IS NO FIX*.** The Enter handler is **byte-identical** on both refs
> (`hits[sel]` → `router.push`); `sel` resets to 0 on every keystroke; arrows cycle
> `% hits.length`. Measured for that query: **16 hits · 15 group headers · hits[0] = Taxonomy ·
> ~966px of content above the offer inside a 430px scroll box = 2.2 screens.** The offer is in
> **neither** the selection ring **nor** the Enter path.
>
> 🪤 **AND ITS GUARDS COULD NOT HAVE CAUGHT ANY OF IT.** `display:none` on the whole offer →
> **111/111 admin tests green**. Threshold `3 → 6` or `→ 99` → **its own 4 tests green**, because
> the test file **declares its own copy** of the constant and greps source for the *identifier*,
> never the number. The flagship tokenises to exactly **5**, so only 3/4/5 work and nothing pins it.
>
> 🔴 **THE BIGGEST ONE, AND IT IS UPSTREAM OF THE WHOLE FEATURE: 82% OF JOBS CAN NEVER PRODUCE A
> FORM.** `ask-actions.ts` sends `choices.slice(0, 120)` and the palette feeds it
> `[...86 pages, ...185 jobs]` — **pages first**. Measured: **34 of 185 jobs survive (18%), 151
> never reach the model.** `createCanonicalLeaf` sits at **index 116 — a margin of three**;
> `createTaxonomyNode` is **already cut at 123**. Mutating the cap to `slice(0, 86)` — severing
> every job from the model — changes **nothing** in 200 tests. **An alphabetical cut is amputating
> the feature.** Rank by relevance, then slice.
>
> 🪤 **AND USING IT WHILE ALREADY ON THE DESTINATION PAGE DISCARDS EVERY ANSWER** — the prefill
> effect does not re-fire on a same-route navigation, so the page just sits there. #4892 is what
> made that dead end reachable, from the page he is most likely to start on.
>
> ### ⚖ 2026-08-27 — TWO OWNER RULINGS ON RECORD SEARCH — do not re-ask
>
> 1. **The admin search box stays DESKTOP-ONLY.** Owner: *"yes desktop only since it will be for
>    desktop use since mobile use is for answering requests and tasks that need decision making or
>    confirmation."* This **confirms and explains** the 2026-08-26 phone ruling — the phone admin
>    answers and confirms; it does not open editing doors. A record band will **not** reach the
>    phone's `/admin/more` grid, which is static and structurally cannot host a live query.
>    **Write that asymmetry down as a decision; do not ship it silently.**
> 2. **Guests and people MUST be findable, WITH the admin's actions attached.** Owner: *"yes. we
>    must be able to find them and have our actions as admin available when we find them."*
>    🔑 **That second half connects two things built separately** — the 284-job checklist already
>    records what every admin action needs, so a found record should offer the jobs that act on it,
>    not merely a link. Prod holds **40 guests · 34 people** no admin search can reach by name.
>
> ### ✅ RULE 0 PAID AGAIN — THE CROSS-RECORD SEARCH ALREADY SHIPS. DO NOT BUILD ONE.
>
> `ugatSearchInner` (`lib/ugat/data.ts`) already searches **vendor_profiles · events · users ·
> orders · canonical_service_taxonomy**, admin-gated through `fetchUgatSearch`
> (`app/admin/ugat/actions.ts`, `requireAdminAction()` on its first line), **mounted and
> reachable** at `/admin/ugat/map` — menu label **"Entity map"**, inside a collapsed *Set up*
> group. Its placeholder literally reads *"Search vendors · events · users · orders · taxonomy"*.
> **Typing `setnaprod` there finds the shop today.** The owner had never met it because of where
> it lives — the same reason he had never met the ⌘K palette.
>
> 🪤 **BUT `UgatSearchHit.href` HAS ZERO READERS — a SEVENTH gate with no handle.** The only
> consumer calls `onOpenRecord(h.typeNodeId)`, which highlights the **type node** — the generic
> word *"Vendors"* — not SetnaProd. All five hrefs are **unwritten, not half-working**: treat them
> as new and test each. Real per-record destinations that DO exist:
> `/admin/users/[userId]` · `/admin/vendors/[vendorProfileId]/edit`.
> ⇒ **The delta is ~30 lines** in the palette (debounce, call the existing admin-gated action,
> render a fourth band) **plus authoring the five links.** Nothing new is authorized or granted.
>
> 🔢 **The footer's "N of 155" is EXACT, not approximate:** 79 nav `href:` entries + 8 map-only
> pages + **68** live `platform_retail_catalog_v2` rows = 155. Jobs are **not** destinations —
> their words fold into the host page's haystack and `matchJobs` runs separately.
>
> ⛔ **There is no full-text or trigram search anywhere in this product** — `to_tsquery` ·
> `tsvector` · `pg_trgm` · `similarity(` all return **zero** across every migration. `ilike` is the
> only mechanism it has.

---

## 0 · THE ONE THING WAITING ON THE OWNER

**Set `ANTHROPIC_API_KEY` in Vercel.** Without it every deterministic half works and the box says
*"The assistant is not switched on here."* rather than failing. ⚠ **Its production value is not
readable from a session** — do not report it as set or unset from the code default; read it in the
hosting settings and say which you did.

---

## 1 · 🔴 THE SECOND HALF OF THE OWNER'S OWN EXAMPLE IS NOT BUILT

His two examples were:

> *"take me to the pricing for papic services"* — **DONE.**
> *"i want to add a new category on the taxonomy service" — **ask me what to add and where to
> place it.*** — **NOT DONE.**

Today the box **takes you to Taxonomy**. It does not ask the questions. The checklist that would
let it — which folder, which tile, the name, rental?, Filipino-only?, which faith, a follow-up
question and its options — **is generated and committed** (`lib/admin-map/admin-jobs.generated.ts`,
284 jobs, 185 form-driven) and **nothing reads it except the search haystack.**

🔑 **This is the piece with the most value left in it, and it is also the one that crosses the line
the owner drew.** Gathering answers is fine; **pressing the button is not** — the one-person admin
plan (2026-07-11) binds it: the machine may prepare and may hold back, it may never be the thing
that lets money, a price, an approval or a publish through. Build it as *fill the form, show the
finished thing, the person presses*.

---

## 2 · 🔴 THE ADVERSARIAL AUDIT OF TODAY'S SEVEN PRs — 33 CANDIDATES, REFUTATION IN FLIGHT

⚠ **Do not act on any line in this section until it has been through the skeptic pass** — this
project's own record is that roughly a third of audit candidates are a correct fact with an
invented consequence. Findings marked **RAN** were confirmed by executing something, which is the
stronger grade. The full journal is at
`~/.claude/projects/…/subagents/workflows/wf_867e7d84-c54/journal.jsonl`.
🔑 **READ THAT JOURNAL BEFORE CONCLUDING THE AUDIT FOUND NOTHING** — on 2026-08-20 and again on
2026-08-24 an audit returned an empty list because its agents died on a usage limit while ten real
findings sat in the journal the whole time.

**Repeated by four independent lenses, all RAN — treat as near-certain:**

- 🚨 **The phone's "All surfaces" filter requires EVERY word while the palette requires ANY**, so
  a sentence **hides all 79 cards** — including both of the owner's own sentences. **This is the
  exact bug that filter's own docblock says it fixes**, reintroduced by me in #4866
  (`keepByTokens` uses `tokens.every`). A phone is the device he reports from.
- 🚨 **The admin now has NO top-bar search opener on a phone at all.** The new box is
  `hidden … lg:flex` **and it replaced the shared one**, so below 1024 the admin bar lost the
  search it used to have. I intended "desktop only"; I delivered "gone on mobile".
- 🚨 **"No page has the word X" is printed above hits whose own names contain X.** The unknown-word
  notice is computed against a floor the ranked hits do not share.

**Also RAN, single-lens:**

- The learned-phrase counter **`times_used` is assigned the literal `1`, never incremented, and
  nothing reads it** — and the fire-and-forget UPDATE may never be sent at all.
- **A phrase the model gets wrong is learned permanently.** Nothing can re-ask, correct or delete
  it. *(See § 3 — this is the missing surface, not just a bug.)*
- The "every job puts its words on a destination — none are dropped" guard **exempts 252 of its
  284 jobs**, because the exception set is every menu-mentioned page rather than only flag-hidden
  ones. **A guard covering 32 of 284 is decoration.**
- The executed parity guard **cannot fail for the divergence it was written for** — its four
  queries are ones that pass either way.
- `isKnownAdminHref`'s `extra` list **makes the route-map validation a no-op for exactly the paths
  the caller supplies** — and the caller's own comment claims the opposite.
- `rendersJsx` **counts an ordinary TypeScript generic as JSX**, so a routine refactor can silently
  reclassify a redirect stub as a page.
- The Shop's **"+ Create service card" lands on a hidden tab for suppliers who have no cards yet.**
- The admin layout **runs a service-role read of the whole retail catalog before the sign-in
  check.**

---

## 3 · 🔴 THE LEARNED MEMORY HAS NO SURFACE — AND A COLUMN WITH NO WRITER

`admin_search_phrases` accumulates what the assistant learns. **Nothing can show it, correct it or
delete a row.** A wrong answer learned once is wrong forever, silently.

🪤 And the schema already carries the trap this project keeps paying for: `learned_from` admits
`'admin'` — *a person taught it* — and **nothing writes that value.** A stored value with no
writer is the "gate with no handle" shape, now on its sixth instance. Either build the teach-it
door or drop the value.

**Smallest honest build:** one admin screen listing phrases with what each resolves to, a delete,
and a "teach it this instead" that writes `learned_from='admin'`.

---

## 4 · ⏭ ROWS ARE ONLY PRICES

`admin-row-index.ts` indexes the retail catalog. Not indexed, and each is a thing the owner
searches for by name: **276 service categories · 69 tiles · 15 folders · 16 event types · faiths.**
Same shape as the SKU rows — a reader, an anchor from one shared helper, and a band below pages.

⚠ **The anchor is the part that goes wrong quietly**: a href built in one file and an `id` typed in
another opens the right page and never scrolls. Use the `sku-anchor.ts` pattern.

---

## 5 · ⏭ NAMED, NOT FIXED — `relrowsecurity` IS VACUOUS IN THE REPLAY

A brand-new table created inside the PGlite replay — no policy, no `ALTER` — **already reports
`relrowsecurity = true`**. So **15 db test files assert a flag that cannot fail there.** Production
is genuinely protected; this is a hole in the *checking*.

Second known shim deviation after `auth.role()`-is-never-NULL. **Assume a third: before asserting a
catalog flag in a db test, create a throwaway object and check the flag reports honestly for it.**
A live probe is pinned in `tests/db/admin-search-phrases.db.test.ts` so a future PGlite fix fails
loudly. Memory: `feedback_relrowsecurity_is_vacuous_in_the_replay`.

---

## 6 · ⏭ SMALLER, REAL

- **The words are the code's words.** *"add a category"* still finds Taxonomy only because
  "category" happens to appear; *"create canonical leaf"* is what the data says. The assistant is
  supposed to close that gap and write the answer down — it does, but only for phrasings that
  reach it, and § 2 says the notice above those hits may be wrong.
- **Nothing has ever been learned.** `admin_search_phrases` holds **0 rows**. Every claim about the
  memory path is test-proved, **not observed in use**. Do not upgrade that to "verified live".
- **The assistant is offered only when the box finds nothing.** A confident wrong hit never offers
  it. Whether that is right is a product call.

---

## 7 · ⛔ LOCKS THIS WORK RUNS UNDER — do not re-litigate

- **The assistant routes. It never acts.** No approval, no money, no price, no publish, no delete.
  A guard asserts the whole chain touches exactly one table.
- **The 2026-08-03 "Admin AI is removed as a concept" lock is SUPERSEDED** by the owner's own
  2026-08-26 request — recorded in `DECISION_LOG.md`. Do not re-raise it.
- **The brain remembers navigation only** — *"not our decisions. but how to navigate, where to go,
  what to open."* No rulings, no policy, no approvals.
- **The phone admin answers and does not edit** (2026-08-26). It has no menu on purpose.
- **The word CREATE stays in the top-bar button** (2026-08-15: a rename read as a deletion).
- **`.fd-btn-gold` is never re-styled per surface** (2026-08-14, one chrome one button colour).
- **Generated, never authored** — the route map and the job checklist are scanned, and a guard
  re-scans and refuses any difference. Never hand-edit either file.

---

## 8 · 🪤 TRAPS THIS STREAM PAID FOR

- **A fix nobody can reach is no fix** — the whole search shipped behind an unlabelled ⌘K. *Third
  instance.* The owner found it, not CI.
- **Back up by PATH, never by basename** — a mutation harness restored the admin layout over the
  vendor one; in Next.js `layout.tsx` / `page.tsx` / `actions.ts` repeat in every folder. **Re-run
  the tests after any restore.** Memory: `feedback_back_up_by_path_never_by_basename`.
- **A re-export does not bind the name inside the module** — `export … from` left
  `searchTokens is not defined` at runtime with typecheck clean.
- **A regex that cannot match is not a negative result** — a guard forbidding `useEffect(…ask())`
  used a pattern disallowing `)` between them, and every effect starts `useEffect(() => {`.
- **A guard on a COPY of the shipped scorer must pin every band**, or a band can be moved with no
  test able to see it.
- **Strip comments before matching** — a guard fired on the docblock explaining why the module does
  not do the thing.
- **An unmeasured mutation proves nothing** — three "results" this session were meaningless because
  the sabotage never landed. Print the occurrence count before → after, and for a REORDERING
  mutation assert the new index, because counting a string cannot see a move.
