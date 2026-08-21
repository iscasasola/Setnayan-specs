# WHATS_NEXT — A FINISHED EVENT READS AS FINISHED (2026-08-21 → 22)

> Written because the owner opened a **Movie Night** the morning after it happened and asked
> three things: *"when i click it, how do i see what the editorial maker?"* · *"why can i still
> plan and build and create guest list as if it hasn't ended."* · *"what we want is to show the
> summary of the overview, guest, marketplace, suite, and the editorial maker?"*
>
> Then, after a first fix shipped: **"nothing changed. i can still invite. prepare for event day, etc"** — which was correct, and is the most useful sentence in this file.

---

## ✅ SHIPPED — DO NOT REBUILD ANY OF IT

Nine PRs, all merged and confirmed live. Several were verified **by looking at the owner's own
signed-in dashboard**, not only by tests — he signed a session into the in-app browser.

| PR | what a person gets |
|---|---|
| **#4651** | A finished event's Overview leads with **"That's a wrap"** and six summary cards (Overview · Guests · Marketplace · Suite · Galleries · **the editorial maker**). The rail's first group renames to *Your event* and gains **Editorial** and **Galleries**. |
| **#4661** | **The boundary**: an event is over at **06:00 in the venue's clock on the day after its LAST day.** Plus: the "EVENT DAY SOON" banner stops greeting you after the day · the guest list stops offering to invite · the planning stack stops saying 0% planned / overdue / "needs you this week" · the marketplace stops printing "N days overdue" forever · the Suite and Studio stop saying "your last stretch" · the guests' own public page stops saying "Happening now". |
| **#4668** | The event names its **browser tab** (it read the marketing tagline). The frozen head count says what it is for — it read *"2 guests locked in"* above a list of nobody. |
| **#4673** | **The first ever visit to Schedule on a non-wedding event returned a 500.** |
| **#4674** | Three screens still in the present tense: Hosts asked a movie night who was planning *the wedding* · the seat plan said *"Live — guests are seeing this now"* the day after · a browser tab read *"Setnayan · Setnayan"*. |
| **#4680** | **Three queries the database refused on every load** — see the traps. |
| **#4689** | **Owner ruling:** the services that ARE the day stop being sold once it is over. |
| **#4693** | **Owner ruling:** a guest cannot buy Papic shots into a celebration that has finished — *"no. it needs to be in a new event."* |
| **#4698** | **Owner ruling: "kwento is free."** |

⚠ **#4704 (Pabati is free) IS SUPERSEDED — do not defend it.** A later instruction in another
session retires Pabati outright (*"we do not need pabati. retire it because it is part of
papic"*). See `WHATS_NEXT_Studio_Is_One_Concept_2026-08-22.md` § 2. The free change was correct
for the instruction it had and is simply overtaken; the **retirement** is the live plan.

---

## ⏭ STILL OPEN — 4 items, measured against `origin/main` @ `931a44f66`, not remembered

Ordered by what a person would notice. **Every one re-verified by grep at the time of writing;
re-verify before starting, this file will rot like every other.**

1. **Schedule reads its blocks twice in one render.** `fetchScheduleBlocks(supabase, eventId)`
   appears **2×** in `schedule/page.tsx` — once in the parallel batch, once after the seed. The
   first open of a non-wedding event writes N blocks and still renders *"0 blocks"*; a reload
   shows them. Diagnosis is inference at its last step (identical GET, one render ⇒ served from
   memory) — **the fix is deleting the duplicate read, which is right whichever cache is at
   fault, but run the discriminator before writing the cause into a commit message.**
2. **The checklist has no idea the event happened.** It reads `event_date` only to compute
   deadlines; zero references to the lifecycle. A finished event still shows *"This week"* over
   dates that have passed, at 0%. ⚠ The nearby "compressed runway" comment is about an event
   created CLOSE to its date — **not** a past event; do not read it as a fix.
3. **"Review" has no destination.** The phone's After tab and the summary card both open the
   plain marketplace. `/vendors` has no tab parameter that lands on the team list. The
   per-supplier *"Leave a review"* affordance already ships inside that page — **this is a
   landing change, not a new screen.**
4. **The After stage on the progress rail is a stub** — `const afterPct = 0` with two hardcoded
   to-dos. ⚖ **Lowest value of the four and say so**: on exactly the events where that stage is
   current, the rail sits inside a **collapsed** disclosure, so it cannot be demonstrated by
   loading the page. Its "7-day review window" promise is also a **fiction with no mechanism
   anywhere in the product** — delete the sentence rather than build to it.

---

## 🪤 THE TRAPS — the part worth more than the code

**MAKING A SKU FREE TAKES TWO HALVES, OR YOU DO THE OPPOSITE.** Every gate asks whether the event
*owns* the SKU. Deactivating the catalog row alone ⇒ nobody can buy ⇒ nobody owns ⇒ **the feature
goes dark for everyone.** *Free and retired are identical in `platform_retail_catalog_v2` and
opposite in the product.* The row comes off sale **and** the code joins `FREE_FOR_ALL_SKUS`.
Also mandatory in the same PR: `llms-txt.ts` (drop from `REQUIRED_RETAIL` **and** rewrite the
prose price — either alone drops the whole AI document to its stub) · its hand-typed test fixture
· any buy drawer **and its hardcoded price fallback**, which now has nothing to read.

**THE OBVIOUS GATE IS THE HARM.** Threading the lifecycle phase into `addOnOfferedForEvent` is the
natural way to stop selling a day-of service — and that predicate's result is the **sole parent of
the couple's OWNED list**, so it would delete a service they PAID FOR from their own shelf. The
gate is a separate narrow predicate read only by the buy path.

**CLOSE WHERE A POST LANDS, NOT WHERE A BUTTON IS.** `submitOrderAction` is POST-able with any
service key — its action id ships in every drawer's client bundle. One refusal there covers
fourteen surfaces. **But four Papic purchases mint orders without ever touching it**, and the
account-less guest path is a fifth. A grid-only fix is a button-not-a-door fix.

**NEVER SUBSTITUTE THE PAPIC CAPTURE WINDOW FOR "HAS THIS HAPPENED".** It FAILS OPEN when a couple
never set bounds — most events — so a gate built on it would not exist for them.

**A MERGE FROM A STALE BRANCH DELETES WHAT LANDED WHILE IT WAS OPEN, AND CI CANNOT SEE IT.**
Covered at the top of the index; met again here from the other end — it is what stopped production
deploying while this stream's own migrations were applying, leaving the rows deactivated and the
code half undeployed for hours. **The half-state my own migration warned about, caused by
something outside it.**

**THE PORT BASELINE IS A TREADMILL.** `port-control-baseline.json` is one generated file every PR
regenerates, so concurrent PRs conflict on it constantly — twice in one hour here. **And a
force-push disarms auto-merge**: re-arm after every rebase, and check `mergeable` rather than
assuming a green CI means it will land.

**I DROPPED A COMMIT WITH `git rebase --onto <base> <its own tip>`** — replaying "everything after
the tip" is nothing. Recovered from the reflog. **After any rebase, assert the change is still
there** (grep for a string only that commit introduces), never just that the rebase "succeeded".

**GUARDS THAT PASS ON THEIR OWN COMMENTS.** Three times in this stream a fresh assertion matched
the string inside the comment explaining its own fix, and once a mutation proved a guard was
reading a **migration's prose** instead of its statement. **Strip comments before matching, and
print the occurrence count before → after.**

**A VACUOUS ASSERTION DOES NOT FAIL.** `REQUIRED_RETAIL` is module-private; importing it returned
`undefined` and every assertion on it passed — it only surfaced because it threw. **Read
module-private lists out of the source rather than exporting one to test it.**

**AND TESTS PINNED TO A SKU BREAK WHEN IT GOES FREE — CORRECTLY.** Three did in one day, including
one re-pointed at PABATI hours before Pabati itself went free. **Pick anchor codes that are not
part of the change.**
