<!-- Owner, 2026-08-29, after a full position analysis against the running product and two volumes of
competitor research: "what will be build then?" → this is the answer, ordered, with nothing in it
awaiting a decision. Registered in WHATS_NEXT_INDEX.md and in the corpus CLAUDE.md ACTIVE block. -->

# Papic — THE BUILD ORDER (2026-08-29)

> **Nothing on this list needs an owner decision.** Every item is either already ruled, or a
> straight repair of something measurably wrong. The order is by value per unit of engineering,
> not by how impressive it looks.
>
> 🔑 **THE FINDING THAT SHAPES THE WHOLE LIST: Papic does not have a feature problem.** Five
> separate times this week something the market calls *"nobody has this"* turned out to be already
> built here and simply **not connected to anything, or never said out loud.** Items 2–5 are
> mostly wiring and sentences. Only item 7 is construction.

---

## The order

| # | What | Size | State |
|---|---|---|---|
| **1** | The browser stops enforcing a limit that does not exist | days | ✅ **DONE** — PR [#5002](https://github.com/iscasasola/setnayan-platform/pull/5002) |
| **2** | Say what is already true, on the promotion page | days | ✅ **DONE** — page shipped 2026-08-29, guard PR #TBD |
| **3** | Shots per guest (+ sponsors default to a bigger share) | several sessions | ruled, spec written |
| **4** | Timed challenges reach the wall | 1 session | ruled |
| **5** | Challenges hang on the ceremony sequence | small | — |
| **6** | The guest chooses per audience | small | — |
| **7** | The year | project | ruled in July, unbuilt |

⏭ **Deliberately NOT started, and why:** Messenger/Viber (ask for push first — § 8) · Tagalog and
Bisaya · civil weddings · the coordinator partner offer (**owner territory, not engineering** —
§ 9).

---

## 1 · The browser stops enforcing a limit that does not exist — ✅ **BUILT 2026-08-29**

> ✅ **DONE — PR [#5002](https://github.com/iscasasola/setnayan-platform/pull/5002). Do NOT rebuild
> it.** ⚠ Verify with `gh pr view 5002 --json state,mergedAt` before trusting this line; this corpus
> has been wrong about a PR's state five times. **No migration.** The rule now lives once, in
> `lib/papic-guest-cap.ts`, with **one entry per write to `v_unlimited`** — and the guard
> `lib/papic-guest-quota-mirrors-sql.test.ts` DERIVES the count from the migration (both
> `v_unlimited :=` **and** `SELECT … INTO v_unlimited`) rather than restating it, so a third
> condition added in SQL fails there until the TypeScript learns it too.
> 🔑 **The pool refusal got its own sentence.** `res.status === 409 || json.status ===
> 'quota_exhausted'` collapsed POOL-EMPTY into the per-guest congratulation in **both** handlers, so
> a guest three photos in was congratulated for a shot that was thrown away while the buy panel
> opened to sell shots that also could not be taken.
> 🪤 **A SABOTAGE THAT APPENDS CANNOT BE MEASURED BY ITS OWN NEEDLE COUNT** — the third-SQL-write
> mutation read 1 → 1 and proved nothing until it was re-measured on the string it actually adds
> (`v_unlimited :=` 1 → 2). *An occurrence count only measures a sabotage that REPLACES.*
> 🪤 **Two concurrent typechecks abort at `TSC_EXIT=144` with an EMPTY log, and a killed one reports
> 143 while the harness announces the wrapper's exit as 0.** Both were hit in this session.
> ⛔ `app/papic/decorate` looks like the same bug and is NOT — it keys on the refusal's STATUS rather
> than the bare 409, which is the rule the camera broke. Left alone, deliberately.


**Full spec: [`WHATS_NEXT_Shots_Per_Guest_2026-08-28.md`](WHATS_NEXT_Shots_Per_Guest_2026-08-28.md) § 1.
Session detail: [`WHATS_NEXT_Shots_Per_Guest_SESSIONS_2026-08-28.md`](WHATS_NEXT_Shots_Per_Guest_SESSIONS_2026-08-28.md) S1.**

A guest's camera counts down from a hardcoded 150 and, at zero, **hides its own shutter** and says
*"That's all 150 photos!"* — on every celebration, where the database applies **no per-guest limit
at all**. One rule written twice; only the SQL copy learned the one-pool model. **A guest at a
large wedding is locked out of a celebration still holding thousands of shots, by a number nobody
chose, and the couple never learns it happened.**

⚠ **THIS WAS BUILT, PROVED AND LOST.** The worktree was in `/tmp` and went with the session; zero
commits were ever made. It is a re-run of known work — the spec carries what it did and how it was
proved. **Build beside the repo, and push the moment it typechecks.**

**Why first:** it is the only item on this list that is actively harming somebody today.

---

## 2 · Say what is already true

> ✅ **DONE 2026-08-29 — do NOT rebuild any of it, and do not re-run the item-2 prompt as written.**
> 🔑 **THE PAGE HALF WAS ALREADY SHIPPED WHEN THIS ROW WAS WRITTEN.** This file said *"drawn,
> waiting"* at 15:59; measured against `origin/main`, the whole page half had merged hours
> earlier (`3fc9f54d9` → `b782d91e7`, last commit 15:13). **The sixteen-row price wall is
> already a `+`/`−` dial showing ONE rung · the cost block already has a heading · "Two ways to
> run it" already sits above it · and all nine facts below are already on the page**, including
> the free floor in three places and the free live wall. *A planning doc written the same
> afternoon is not evidence — grep the object.*
> ✅ **WHAT WAS ACTUALLY MISSING WAS THE GUARD, AND IT IS BUILT:**
> `apps/web/lib/papic-page-says-only-what-is-true.test.ts` — 13 assertions, 16 mutations, all
> RED. Nine prohibitions from one list (a ninth is one line), each carrying the claim as
> somebody actually wrote it, so **a pattern that rots fails instead of going quiet**, and each
> carrying the true near-miss sentences it must NOT fire on. Plus the three structural repairs
> pinned: the wall cannot come back, the cost heading stays, and the headline keeps no eyebrow
> and no explaining line.
> 🛑 **ONE PROHIBITION IN THE BRIEF WAS TOO WIDE AND IS CORRECTED: "chapters" SHIPS.**
> `lib/papic-chapters.ts` derives a chapter from `captured_at`, stores nothing, and is rendered
> by the guest gallery and the pool grid. **The year — linking two celebrations — is what is
> unbuilt.** The chapters line is pinned as still-sayable so nobody deletes a true claim.
> ⏭ **STILL OWED, and it is the owner's:** nobody has looked at the new page on a real phone.


**Drawn and waiting: [`prototypes/papic_promotion_page_2026-08-28.html`](prototypes/papic_promotion_page_2026-08-28.html).**
**Brief for whoever writes it: [`PAPIC_PAGE_BRIEF_FOR_CHAT_2026-08-29.md`](PAPIC_PAGE_BRIEF_FOR_CHAT_2026-08-29.md).**

Two halves, both cheap:

**The repairs, already drawn** — the sixteen-row price wall cut to three examples plus the link
that is already there; that block finally given a heading (it is a fifth of the page and has none);
and "Two ways to run it" moved above it so somebody knows what they would be buying before the
cost.

**The facts we have never said.** Every rival's cheapest way in is ₱499–₱999. **Ours is free** —
50 shots on every celebration — **and the live wall is free too.** Any face can vanish and we blur
the photograph itself. Face data is really deleted. Nothing unscreened is ever shown. Nothing is
ever deleted.

🔑 **Highest value on the entire list**, because everything else is worth nothing until somebody
knows. ⛔ **Read § 3 of the brief before writing a word** — two previous drafts were made without
seeing the product and both promised things we cannot do.

---

## 3 · Shots per guest

**Full spec + session register: the two `WHATS_NEXT_Shots_Per_Guest_*` files.** All three owner
decisions are made (the release, the buyer's choice, protected allotments) — **do not re-ask any
of them.**

Named guests get a specific number · everyone else splits the remainder equally · the leftover is
anyone's · a button and an automatic release late in the night.

➕ **ONE ADDITION, made here:** **sponsors default to a bigger share.** `lib/event-sponsors.ts`
already models principal sponsors (ninong/ninang by side, paired), plus cord, veil, coin and
candle. Nothing acts on it. Defaulting an allotment by role is a small addition **inside work
already being paid for**, and it collects the "genuinely first, nobody has it" Filipino-roles win
for free.

---

## 4 · Timed challenges reach the wall

Owner ruled 2026-08-28: *"we can add a timed challenge."*

**Measured — more exists than expected.** A library of **500+ prompts** ships
(`lib/papic-challenge-pool.ts`, `CHALLENGE_POOL_FLOOR = 500`), categorised and filtered by event
type; a challenge can already be **armed on a guest's camera** — the viewfinder renders *"Next
shot: {prompt}"* today.

**Missing, and it is only these two:**
1. **A challenge has no concept of time at all** — no window, no countdown, no expiry.
2. **The wall renders no challenge** — measured: zero references in the projection component.

⇒ Add a clock, and put it on the wall with a live count of who has answered.

---

## 5 · Challenges hang on the ceremony sequence

`lib/kwento-moments.ts` already carries the sequence in order — bridal march · vows · **veil &
cord** · first kiss · leaving the church · cocktail hour · newlywed entrance · first dance · cake
cutting · **money dance**. The challenge library exists. **Nothing joins them.**

Joining them means a coordinator sets up in two minutes instead of writing prompts from scratch.

---

## 6 · The guest chooses per audience

**The market's single clearest gap, and smaller than anyone assumes.** Nothing in the scanned
competitive field lets a guest decline facial recognition; we already do. The finish is letting
them choose **per audience** — *"keep me off the big screen but leave me in their album"* is a
sentence real people say and no product can express.

🔑 **The four audiences are ALREADY separate in our read paths**, each with its own gate: the live
wall (with a baked blurred derivative, fail-closed), the shared gallery (its own control, which
bakes the blur rule and the consent veto), the couple's archive (always delivered — the
untagged-still-delivered guarantee), and personal delivery. **Two independent guest flags already
exist and the wall filter reads both.**

⇒ **We are not retrofitting consent into a single face collection.** The surfaces exist; only the
guest's choice is missing. External advice calls this *"a schema migration, not a sprint"* — **for
us that is not true**, and it is the single biggest correction in
[`research/STRATEGY_DOC_CHECKED_AGAINST_THE_CODE_2026-08-29.md`](research/STRATEGY_DOC_CHECKED_AGAINST_THE_CODE_2026-08-29.md).

Ship a plain consent receipt with it — what was collected, why, for how long, how to undo it.

---

## 7 · The year

**Ruled 2026-07-15 and unbuilt.** A separate *occasion* becomes its own celebration shown as a
**linked cluster**; a multi-day celebration stays ONE celebration with days; somewhere to sleep is
never an event.

**Measured:** nothing links two celebrations in code — no parent, no cluster, no relation. And the
shot pot is **strictly per-celebration by construction**, which is the primitive people pay for.

⇒ **A project, not an adjustment.** It is also the only play on the board nobody can copy in a
quarter, because it needs a planning platform underneath — a guest list and dates months ahead.

✅ **AND WE ALREADY PROTECTED IT BY ACCIDENT.** Item 3's share is **derived at spend time, never
stamped** — decided because the pot and the guest list both move. That is exactly what makes the
year survivable later: a stamped share would have to be torn out; a derived one just asks a
different question. **Do not "optimise" it into a stored value.**

---

## 8 · Why Messenger is NOT next

External advice calls Messenger/Viber delivery the highest-return item available, on the grounds
that email is where guest photo sets quietly die. **Probably right about the problem. Wrong about
the first move.**

🔑 **WEB PUSH IS BUILT, MOUNTED, WIRED TO 108 EMIT SITES — AND HAS NEVER HAD A SINGLE SUBSCRIBER
IN PRODUCTION.**

⇒ **Ask for push at the moment a guest scans the QR at the venue, before building anything with
Meta.** That is the best permission moment this product will ever get — the guest is holding their
phone, standing at the celebration, with the page already open — **and we never ask.** Zero policy
risk, zero new integration, already built. It is also the honest test of whether the delivery
problem is the CHANNEL or the ASKING.

⚠ And note the product already holds a **defensive** stance toward these apps: `chat-contact-filter`
**blocks** guests and vendors naming Viber/Messenger/WhatsApp in chat so the relationship does not
walk off Setnayan. Different context, compatible — but make it a knowing decision.
⏭ If Messenger is still wanted after push: **verify Meta's business-initiated messaging rules and
the 24-hour window first.**

---

## 9 · The one thing that is not engineering

**We have no partner offer for coordinators, and that is how the strongest local rival actually
wins.** Kuha sells coordinators a business system — white-label page, client dashboard, booking
funnel, resale margin, a monthly fee. A better album does not dislodge that.

🔑 **The asymmetry we are not using:** Setnayan already runs vendor subscriptions and portfolio
hosting. We are not offering a coordinator a subdomain on a photo app — we are offering presence
on a planning platform where couples are already searching for vendors. **Kuha would have to build
a marketplace from zero to answer it.**

⇒ **OWNER TERRITORY.** It is a business decision about pricing and channel, not a build.

---

## The standing rules for every session on this list

1. **Branch, then `git worktree add` beside the repo** (`~/Documents/Claude/Projects/wt-<name>`) —
   **never `/tmp`**, and **push the moment it typechecks.** Item 1 was built, proved and lost
   exactly this way.
2. `pnpm install` in the worktree first — a run in an uninstalled worktree means nothing.
3. Print `TSC_EXIT` beside the error count. An empty `tsc` log is not a clean one — it exits
   **144** on abort, and two concurrent typechecks cause exactly that.
4. Require `# tests` to be **non-zero** before believing any pass.
5. Mutation-test every guard and print the occurrence count **before → after**.
6. `git fetch` and read the new tip before building — `origin/main` moved three times during the
   planning session alone, and other sessions work this repo concurrently.
7. Changelog fragment in `changelog.d/`, never `CHANGELOG.md` or `STATUS.md` directly.
