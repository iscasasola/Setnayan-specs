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
| **1** | The browser stops enforcing a limit that does not exist | days | **live defect · start here** |
| **2** | Say what is already true, on the promotion page | days | drawn, waiting |
| **3** | Shots per guest (+ sponsors default to a bigger share) | several sessions | ruled, spec written |
| **4** | Timed challenges reach the wall | 1 session | ruled |
| **5** | Challenges hang on the ceremony sequence | small | — |
| **6** | The guest chooses per audience | small | — |
| **7** | The year | project | ruled in July, unbuilt |

⏭ **Deliberately NOT started, and why:** Messenger/Viber (ask for push first — § 8) · Tagalog and
Bisaya · civil weddings · the coordinator partner offer (**owner territory, not engineering** —
§ 9).

---

## 1 · The browser stops enforcing a limit that does not exist — **START HERE**

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
