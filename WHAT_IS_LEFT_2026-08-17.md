# WHAT IS LEFT — re-verified 2026-08-17

> Read-only page for the owner: <https://claude.ai/code/artifact/95ce3296-bdb9-419b-9bc3-75145296cf14>

> Supersedes [`WHAT_IS_ACTUALLY_LEFT_2026-08-12.md`](WHAT_IS_ACTUALLY_LEFT_2026-08-12.md).
> That file said of itself: *"it will rot at the same rate — re-verify before acting on any line."*
> **288 commits landed in the five days since it was written.** This is that re-verification.

**Method:** checked against the live site, the shipped code at `origin/main` (`f68389cb7`), and the
live production database — in that order. Not against the documents that made the claims.
⚠ I re-checked **about half** of the 41 open items by hand and the rest by commit history. Where I
did not measure something directly, this file says so.

---

## 1 · The one-line answer

**Nothing is broken and nothing is half-built.** What is left is three separate piles:

| | |
|---|---|
| ~~The big unbuilt thing~~ | 🛑 **RETRACTED — the Event Hub IS BUILT.** See §4. The one ordering fix it needed is now **DONE AND LIVE** (#4483), as is the booking-attribution gap (#4488). |
| **The finishing work** | ~40 items from the last register, almost all still open. Mostly small. |
| **Waiting on you** | 15 things no engineer can close — a signature, a price, a ruling, a switch. |

🔑 **THE RETRACTION IS THE MOST IMPORTANT LINE IN THIS FILE.** I reported an existing, shipped
product as unbuilt because I took a scope document's framing instead of grepping for the thing —
which is the one failure this project has paid for more than any other. **A scope document is not
evidence. Neither is this file.**

---

## 2 · Where the product actually stands today (measured, not remembered)

| | |
|---|---|
| events | 6 · guests 39 |
| suppliers | 2, of which **1** is published |
| photos taken | 14 |
| **orders ever placed** | **0** |
| accounts | 9 |
| booked suppliers who are Setnayan accounts | **0 of 45** |

🔑 **Nothing has met a real customer yet.** Every claim below about what a person would experience
is a claim about code, not about something that has happened.

---

## 3 · ✅ CLOSED SINCE 2026-08-12 — do not rebuild

- **Your six service pages now have a way in.** The 3D plan, event-website, Patiktok, Live Studio,
  animated-monogram and memories pages are each linked once from the live homepage. Verified by
  fetching the homepage itself today, not by reading a note. **This was the register's biggest
  marketing gap and it is gone.**
- **The shared working copy is clean again.** For over a week it held 96 uncommitted files from
  another session and nobody could safely pull. It is now empty — that hazard is closed.
- **Everything in the 2026-08-12 "already done" list stays done** — 17 items, unchanged.

---

## 4 · 🛑 THE EVENT HUB IS BUILT — I GOT THIS WRONG, CORRECTED 2026-08-17

> **Owner, on reading the first version of this file:** *"we already have an event website before.
> that is the event hub. it was already built."* **He is right. I called it "the big unbuilt
> thing" and it is not.** RULE 0 exists to stop exactly this and I did not run it on the one
> section that most needed it — I inherited the framing from a scope document instead of grepping.

**Re-measured against shipped code, not the scope doc:**

| | |
|---|---|
| The event website (`/{slug}`) | **BUILT** — 15 routes: RSVP · seat · find-my-table · venue · welcome · print · redeem · invite · live wall · Live hub · recap · rewards |
| The supplier strip *"You are booked here"* | **BUILT** — component, gate and link-read all ship; last touched 2026-08-03 |
| The link that powers it | **WRITTEN AUTOMATICALLY** when a couple locks a marketplace supplier — the lock payload stamps it, and its own comment records that gap being closed on **2026-06-19** |
| The host ribbon on their own page | **BUILT** (read-only) |

🔑 **SO WHY HAS THE SUPPLIER STRIP NEVER APPEARED? NOT A MISSING BUILD — A MISSING BOOKING.**
44 of the 45 booked suppliers are **names a couple typed into a list**; they were never Setnayan
businesses, so there is no account to link and nothing is broken. The 45th is a marketplace
business — and it is a **test row seeded straight into the database** (its own name ends
*"(SONGDESK TEST)"*), never booked through the screen that does the stamping. **The feature works
the first time a real couple locks a real marketplace supplier.**

⚠ **My step 1 — "a booked supplier becomes a real account" — was a proposal to build something
that already exists.** That is the paid-twice mistake, in the register whose job is to prevent it.

### What is genuinely left — CLOSED 2026-08-17

- ✅ ~~On a private event the page refuses a booked supplier before it ever asks whether they are
  booked.~~ **FIXED AND LIVE — PR #4483.** Proved on the live site in the risky direction (private
  weddings still turn strangers away); the supplier getting IN is test-proved only, because prod
  has no booked marketplace supplier to look at. **Do not upgrade that to "seen working".**
- ✅ ~~The agree step books a supplier without recording which business they are.~~ **FIXED AND
  VERIFIED IN PROD BY THE OBJECT — PR #4488.** Without it, the moment the ask-and-agree switch
  went on, every booking it made would have been a supplier who is booked and invisible: no
  doorway, no photo credit, no run-of-show notes. Done while it was inert, which was the whole
  point. **The switch itself is still yours and nothing is on until you flip it.**
- **There is no way to invite an off-platform supplier onto Setnayan** — which is how 44 of the 45
  would ever become accounts. That is **your call (§6), not an engineering task.**

### Still true, and smaller than I said

- **The host opening their own event page gets the visitor's version of the body** with a
  read-only ribbon on top — so the page can still say "scan your invitation QR" to the couple who
  own it. Real, worth fixing, **not architectural.**
- **"Who is in this event" is five separate screens.** A convenience, not a gap.
- **The coordinator is two products** depending on which identity they hold.
- **A supplier-shaped view of the event** — still needs your ruling first (§6). This is the only
  genuinely large one, and it is the *last* thing, not the first.

**Wrong today regardless — and two of these three did NOT survive checking, so read carefully:**
- ⚠ **UNVERIFIED:** "every supplier sees a *start the next item* button only a coordinator may press, and the refusal is silent." The control's own note says **the booked supplier IS allowed**. Measure it before building anything.
- ⚠ **CORRECTED:** the shot list does **not** claim to sync. Keeping it on the phone is a deliberate choice for venues with bad signal, and the synced version is already named as a follow-up. **A feature request, not a broken promise.** Same for the coordinator's issues log.
- The day-of console opens only on the exact booked date. No rehearsal, no morning-after.

⚠ **The scope document
[`WHATS_NEXT_Event_Hub_Multirole_2026-08-15.md`](WHATS_NEXT_Event_Hub_Multirole_2026-08-15.md)
carries the six-slice framing and its slices 1 and 2 are the wrong shape.** Corrected in place on
2026-08-17 — read it after this section, never instead of it.

---

## 5 · 🛠 STILL NEEDS BUILDING — verified still open today

**Design — the redesign is four units from finished**
- The couple's four daily screens (guest list, supplier comparison, budget, gallery) — still only recoloured.
- The supplier's sixty-odd screens — same.
- Your own admin screens — still 33 files of hand-built tables. This ships last on purpose.
- ✅ ~~Sign-in, sign-up, password reset, invite and join — the first screens anyone ever sees.~~
  **THIRTEEN DOORS ARE DONE AND LIVE** (PRs #4484 · #4486 · +1). ⏭ What is left is **your call**,
  not a build: sign-up and the two password pages still wear the website's look rather than the
  door look, so five journeys carry three looks. Unifying them is taste, not a defect.
- Still undrawn: the supplier marketplace, the product tour, the deeper photo-service pages, the onboarding quiz.

**Things that are built but nobody can reach**
- **The avatar maker does not exist.** Everyone in the 3D room is a randomly-coloured stranger — 0 of 39 guests has a figure.
- **The photo wall on the couple's own website can never have photos in it** — nothing anywhere picks them. 0 of 6 events.
- **A supplier still cannot say how many couples may hold the same date.** Permanently stuck at three, no screen.
- **The "we couldn't load this" screens were built and no page uses them** — 0 consumers. A failed load still reads as "there is nothing here".

**Small but visible**
- **A supplier can still only tap six fixed messages** to the coordinator — never a sentence.
- **The host cannot see who is holding which camera.** Four say "Claimed", none say a name.
- **A photographer can only look at their own shots during the wedding day itself.** At midnight the door shuts.
- **If the band who also emcees was booked as one package, the coordinator's message box lists nobody** — the section silently disappears.
- The old camera screen still opens with "You have 3 cameras free to test with" above eight slots.
- **A brand-new shop is still born saying it only serves ballrooms, gardens and heritage houses** — both live shops still sit on that. There is still nowhere for a venue to say what kind of venue it is.

**Under the floor**
- **306 of 383 tables still hand out a read permission nothing uses** — unchanged. No leak today; it means most of the database has one lock instead of two.
- **The browser protection is still only watching, and nothing records what it sees**, so the moment to switch real protection on never arrives by itself.
- The safety net that catches settings-with-no-screen is still a hand-typed list of five.
- Two database views run with elevated rights and are flagged as errors by the security scanner. Probably deliberate — **not yet checked.**

**Paperwork that contradicts itself** (four items — the compliance pack is three weeks behind the
product, four rows still say the photos sit in the Philippines when they sit in Singapore, and two
rows still quote the retired 90-day rule).

---

## 6 · 🔴 NEEDS YOU — 15 things, no engineering left

**Press-a-switch (2)**
1. **Turn on the supplier handshake.** The whole thing is built, merged and dark. A couple pressing *Lock* would ask the supplier first, and the supplier's yes makes the booking. **Safe today by arithmetic: there are no asks in flight and no booking to re-open.** Nothing changes until you flip it in the hosting settings.
2. **Compromised-password checking is still off at sign-up.** Someone can register today with a password already known to be stolen. One switch in the database console.

**Rulings (6)**
3. **How much of the couple's private plan may a booked supplier see?** Today: counts only, never guest names. **This blocks the last Event Hub step.**
4. **May a coordinator who was booked but never promoted announce things to guests?**
5. **Should the day-of extras be free during launch?** No real supplier can reach them today.
6. **Should couples be able to invite off-platform suppliers onto Setnayan?**
7. **Do wedding recordings stay on a channel forever, or get wiped when it is reused?** Your own specs say both. Nothing is deleted while you decide.
8. **The features page is frozen** because two documents you approved describe it as two different shapes.

**Data-protection officer, i.e. you (4)**
9. Guest photo-taking is selling while two privacy sign-offs for it have never been signed.
10. One of your twenty live privacy capabilities has nobody's name against it — the anti-fraud scoring that can hide a supplier without a person deciding.
11. The corrected lawyer's brief on keeping a dead relative's memories: **no record it was ever sent.**
12. ~~The public page selling the photo service still says photos are not matched by face. **Every event is in the mode where they are.**~~ ✅ **CORRECTED 2026-08-19 — DO NOT ACTION AS WRITTEN. Both halves were measured and neither holds.** Production is **5 events `mode_a` · 3 events `mode_b`** — five of eight, not "every". And the live `/privacy` page is **honest and specific**: it states that facial-geometry is derived from a selfie you choose to provide, that the feature is optional, and that matching stays scoped to the one event you consented to. `/features` does not mention faces at all and `/papic` makes no such claim. 🔑 A register entry is a claim, not evidence — this one would have sent the owner to rewrite a page that was already correct. See [`WHATS_NEXT_Silent_Failures_2026-08-19.md`](WHATS_NEXT_Silent_Failures_2026-08-19.md) §3.3.

**Money and words (3)**
13. **The photo service still has no "what this would otherwise cost you" figure.** Only you can give an honest one.
14. **Should suppliers still see the ~450-cell tier grid**, now that each plan says what it adds?
15. **The public category words are our internal ones** — *Look, Feast, Documentary, Booths*. Nobody types those.

---

## 6b · 🔴 FOUR FINISHED-LOOKING PRs HAVE BEEN RED FOR TWO DAYS

Found 2026-08-17 while checking something else. **Four pull requests from 2026-08-15 sit open with
auto-merge ARMED and a required check FAILING**, so they will never merge and nothing says so:

| PR | what it was for | why it is red |
|---|---|---|
| [#4471](https://github.com/iscasasola/setnayan-platform/pull/4471) | suppliers may write about a day they worked | a new exposed column + a new anon-callable function, neither registered with a written reason |
| [#4472](https://github.com/iscasasola/setnayan-platform/pull/4472) | opening a shop no longer takes away your events | two access-check tests failing |
| ~~[#4475](https://github.com/iscasasola/setnayan-platform/pull/4475)~~ | a put-away celebration still counts on the supplier record | ✅ **FIXED — superseded by [#4492](https://github.com/iscasasola/setnayan-platform/pull/4492).** It was NOT staleness: it re-opened a leak. See below. |

✅ **SEPARATELY, S9's GRANT SWEEP LANDED AND IS VERIFIED IN PROD BY THE OBJECT** (#4489):
anonymous read access **306 → 290 tables of 384**. The two tables it nearly closed by mistake —
the ones feeding the public supplier listing — are **confirmed still open**, so the marketplace is
intact. Its near-miss is the argument for small batches: a wrong one gets caught while it is cheap.
| [#4478](https://github.com/iscasasola/setnayan-platform/pull/4478) | a put-away celebration stops taking new photos | its own fail-closed gate test |

⚠ A fifth, [#4473](https://github.com/iscasasola/setnayan-platform/pull/4473) (*a celebration can
finally be put away*), is **CONFLICTING** — and its checks are from a stale run, so it is not being
tested at all.

🔑 **"AUTO-MERGE ARMED" IS NOT "WILL MERGE."** Four sessions armed it, reported success and left.
The failures are all REAL and all DIFFERENT — this is not one shared cause anybody can sweep.

🚨 **AND THE FIRST ONE I OPENED WAS A REAL LEAK, NOT A STALE BASELINE.** #4475 rebuilds the
supplier finished-jobs count with DROP + CREATE and re-granted it to **everyone, signed in or
not** — a grant line copied from the view's FIRST creation rather than its CURRENT state, which
silently reversed a revoke made on purpose five days earlier. That matview is the deliberately
UNREDACTED twin of the public one, so a stranger could read both and **subtract to learn how many
of a supplier's finished jobs we wrote off as fake.** Harmless only because nothing has been
written off yet.
🔑 **DROP + CREATE IS NOT AN EDIT, IT IS A RESET** — every grant and every later narrowing of one
is discarded. Re-read the current permissions before re-granting; never copy the grant line out of
the original migration.
🚨 **AND THE OBVIOUS FIX WAS NOT THE FIX.** Narrowing the grant left the leak fully open, because
this database hands `anon` back **by itself** on any newly created object, before any grant in the
file runs. **The REVOKE is the load-bearing line** — learned only because the guard refused the
first answer.
⏭ **So "we just wait" was the wrong instinct on all four.** These are not queued, they are broken,
and one of the four was hiding a disclosure. The remaining three still need doing.

🛑 **I DELIBERATELY DID NOT BLANKET-BASELINE THESE.** #4471 and #4475 fail the guard that asks *"you are
newly exposing this — say why."* Silencing it would be **adding a line to a bill, not making a
decision**, on somebody else's work whose intent I do not hold. Each needs the session that wrote
it, or a fresh one told what it was for.

---

## 6c · ✅ DECIDED 2026-08-17 — the nine refusal screens, and the doubled tab title

**DO ALL NINE.** S2 asked, having first summarised them as *"camera screens where the card is only
an error state"* and then corrected itself after reading them properly. Measured, the card on all
nine says exactly one of two things — **"you can't come in, go and get your link"** or **"this
link is dead"**. That is a doorway by definition. The camera is a separate part of each page and
the card never appears there, **so porting them cannot change how a camera looks.**
🔑 **The reason to say yes is the reason the work exists:** a guest turned away from the photo page
and a guest turned away from an invitation currently meet two different products at the same
moment — the moment they have just been refused.

**THE DOUBLED TAB TITLE IS REAL — measured, not taken on trust.** The site template appends
` · Setnayan` to every page title, and **147 page titles under `app/` already contain the word**
(S2 counted 87 reaching the actual tab; the rest are social-card titles, which the template does
not touch). So a tab can read *"Setnayan · … · Setnayan"*.
⏭ **Mechanical, and its own small job — do it separately.** ⚠ **It lands in the same files as the
`"keep it forever"` wording in §7, which is an OWNER call.** Whoever takes the doubling should
carry the wording fix in the same pass rather than editing those titles twice.

---

## 6d · 🚨 TWO SESSIONS WERE EACH RIGHT AND STILL COLLIDED — caught before it merged

While verifying S9's finish I read the live grants and found **my own open fix would have undone
their work in the same hour they did it.**

S9's sweep revoked the last remaining access to the supplier written-off count. My fix — written
hours earlier against the state at the time — **re-granted it**, correctly mirroring the migration
that was current when I wrote it. Its file sorts *below* theirs, which reads as "harmless", but
the deploy applies everything regardless of order and on production mine would have run **after**.

**Both changes were correct in isolation. Together they re-opened a disclosure.**

🔑 **A MIGRATION IS JUDGED AGAINST THE STATE IT WILL LAND IN, NOT THE STATE IT WAS WRITTEN
AGAINST.** Re-read the live permissions immediately before merging, never only when you start.
✅ Corrected: it now takes the access away and grants nothing. Checked against production first —
the supplier's *advertised* number is untouched, only the unredacted twin is closed.
⚠ **This is the cost of running sessions in parallel, and it is not theoretical.** Nothing in
either pull request could have shown it; only reading the live database did.

---

## 6e · 🛑 "THE WEBSITE ALREADY ANSWERS IT" — and it did. S9's first owner question is VOID.

**Owner, one line:** *"check our website if that has an answer already."* **It does, in full, and
the code implements it.**

S9 raised as an owner decision: *"Guests' permission for public photos is never recorded anywhere.
So photos can never reach the public showcase — the feature cannot work as built. Fixing it means
ruling on whose permission counts: the person in the photo, or the person who took it."*

**Fetched from the LIVE privacy page today, verbatim:**

> *"Guest capture is consent-gated. If you take photos as a guest, a photo only becomes eligible
> for the couple's public showcase when **two gates** are met: **you opt in at capture time** (off
> by default, never pre-checked) **and the couple approves it.** You can leave the opt-in off and
> still have your photos delivered privately to the couple."*

**So the ruling was made and published. It is BOTH, in order: the person who took it, then the
host.** And every link of that chain exists in shipped code — traced end to end, not inferred:

| the promise | what ships |
|---|---|
| off by default, never pre-checked | the capture screen's toggle starts **off** |
| the guest opts in at capture time | a real checkbox — *"Let the host feature my clips on their event page"* |
| …which is recorded | posted to the capture route, which writes the guest's consent column |
| the couple approves it | the couple's approve action writes the second column |
| only then is it eligible | the public reader filters on that second column |

🔑 **BOTH GATES HAVE WRITERS AND A CONTROL — ON THE GUEST PATH.** Nothing there is an owner
decision, and the published promise (*"if you take photos as a guest…"*) describes exactly that
path.

🛑 **BUT I OVERSTATED IT, AND S9 WAS RIGHT ABOUT THE OTHER HALF. RETRACTED 2026-08-17.**
I said *"nothing is missing"*. There are **TWO capture paths**, and I checked the one with the
writer:

| path | consent writer | rows in prod |
|---|---|---|
| a **guest** shooting on their own phone | ✅ the capture screen's checkbox | **0** |
| a **camera seat** given to a friend | ❌ **nothing writes it** | **14 — every real photo** |

The consent column on the seat-photo table has **no writer anywhere** — no function, no route —
so a seat photo can never become eligible for the public showcase. **All fourteen photos in
production are on that path.** S9's guard flagged exactly this column and I dismissed it because I
verified the neighbouring table.
🔑 **TWO TABLES, ONE COLUMN NAME. Checking the one that works is not checking the feature** — the
same shape as reading a count instead of grepping the writer, one day later, by me.
⏭ **Whether the seat path SHOULD have a consent control is a real product question** — the website
promises the guest path only, so this is not a broken promise, but 14 of 14 photos sit behind a
gate nobody can open.

⚠ **AND THE OWNER FOUND IT WITH ONE SENTENCE, NOT A GREP.** When a question is about a PROMISE —
who consents, how long we keep something, what we charge — **the published site is a source of
truth we keep forgetting to read.** It is the top of our own source-of-truth order and it answered
this in less time than the investigation that raised it.

⏭ ~~S9's other two stand.~~ 🛑 **CHECKED AGAIN ON THE OWNER'S INSTRUCTION — ALL THREE DISSOLVE.
NONE OF THEM IS AN OWNER DECISION.**

**2 · The two "stuck" settings — the site already says what they should be, and one is backwards.**
- **The supplier radar is NOT "off and stuck off". It is ON in production** (`radar_enabled = true`,
  and the reader defaults to on when unset). And we **SELL it**: `/vendors` advertises
  *"Shortlist radar — see how many couples saved you; get a rival-in-your-area demand feed"* and,
  on Pro, *"Demand Radar — see where demand is building in your market."* So the paid feature works.
  What is missing is only an **off** switch, which nobody needs today. **Severity was inverted.**
- **The homepage spotlight strip is off, and off is CORRECT.** `/vendors` lists it as
  *"Reply-time stats & Spotlight awards **soon** — top performers earn a Spotlight badge plus a
  homepage feature."* **Our own marketing says it is not live yet.** Being off matches what we
  publish; switching it on would contradict the page.
⇒ Neither is a decision. One is a mislabelled severity, one is a feature correctly not launched.

**3 · The two tables nothing creates — OUR OWN MIGRATION NAMES THEM AND SAYS WHY.**
Computed rather than guessed: exactly **two** of the 384 live tables have no `CREATE TABLE` in any
of the 1,135 migrations — `event_service_deliveries` and `pioneer_incentive_logs`.
`20271011873973_reconcile_declared_schema_to_production.sql` calls them, verbatim, *"the two
prod-only TABLES"* and records that they were **deliberately not back-filled** because declaring
them "also widens the exposure surface, which would fail the freeze."
⇒ **Not a mystery and not unexplained — a known, dated, deliberately-deferred item with its reason
written down.** S9's *"nobody knows what made them"* is the only wrong part.

🔑 **THREE FOR THREE, ALL ANSWERED BY RECORDS WE ALREADY HAD** — twice by the live website, once by
our own migration. **"Check whether we already answered it" is cheaper than every investigation
that raised these**, and it is now the first step, not the last.

---

## 6f · 🛑 STOP — MAIN'S CI IS RED. START NOTHING NEW UNTIL IT IS GREEN.

Checked 2026-08-17 after the three finishers landed. **`ci` on `main` is `completed/failure`.**
Production is fine (`deploy-prod` succeeded and the site serves), but **every new branch starts
from a red main, inherits the failure, and cannot merge.** That is precisely how four changes from
2026-08-15 ended up armed for auto-merge and stuck for two days.

**Order, and nothing jumps it:**
1. [#4499](https://github.com/iscasasola/setnayan-platform/pull/4499) — *"my host-page guard cried
   wolf on a clean refactor"*. Open, 0 failing checks, just waiting. **This is what turns main
   green.**
2. [#4492](https://github.com/iscasasola/setnayan-platform/pull/4492) — the leak fix. Was blocked by
   a real typecheck error inherited from #4475 (`replay?.close?.()` — optional-chaining a method
   that does not exist, silent until the wrapper gained a real type). Fixed and pushed.
3. **Then** start new sessions.

🔑 **A GUARD THAT CRIES WOLF COSTS MORE THAN THE BUG IT WATCHES FOR** — it is holding the whole
board, and it was added by the session that proved the host page was already correct.

### ✅ And the three finishers are DONE — with one correction that is MINE

- **S1-FINISH was NOT NEEDED AND I WAS WRONG TO WRITE IT.** [#4496](https://github.com/iscasasola/setnayan-platform/pull/4496)
  is titled *"The host's own page already speaks to them — this is the test that says so"* and
  contains **a test file and a changelog — zero production code.** The host variant shipped in
  **#4483 all along**: its own changelog says *"the body now has a host variant (copy only) keyed
  on the same server-verified capability the ribbon already uses"*, and `site-body.tsx` carries
  `viewerIsHost`. I read the page's branch structure, saw `if (!session)` unchanged, and concluded
  the half had not shipped — **but the fix lives in the body component, keyed on the capability,
  not in a new branch.**
  🔑 **THE FOURTH TIME TODAY SOMETHING SHIPPED WAS REPORTED AS MISSING, AND THE SECOND BY ME.**
  The session did exactly the right thing: ran RULE 0, found it built, and shipped proof instead
  of a rebuild.
- **S2-FINISH landed both halves** ([#4498](https://github.com/iscasasola/setnayan-platform/pull/4498)) —
  sign-up and the tab titles.
  ⚠ **AND IT CHOSE THE WORDING THE OWNER WAS ASKED TO CHOOSE.** The homepage title now reads
  *"Setnayan · Plan your Filipino wedding free — and never lose a photo"*. **The new sentence is
  TRUE** — nothing is ever deleted, only compressed — so this is an improvement, not a defect.
  But the prompt said *do not invent the replacement wording, ask*. **It is live on the front door
  and in every share card. The owner should accept it or replace it.**
- **S9-FINISH corrected its own two overstated findings**
  ([#4497](https://github.com/iscasasola/setnayan-platform/pull/4497)).
  ⏭ **The camera-seat consent gate is NOT closed** — still no writer, still 14 of 14 photos behind
  it. It needs the owner's ruling first, exactly as scoped.

---

## 7 · 🆕 FOUND TODAY

🚨 **Your homepage still promises "forever" — in the browser tab, the Google result, and every
link preview.** *"Plan your Filipino wedding free — keep it forever"* and *"keep every photo,
video, and memory in one place, for life."* Your own ruling is **free for 5 years, then we ask
them to pay to keep storing it.** The privacy page was corrected and says the true thing; the
front door and the share cards were not.

🔑 **The last register recorded this and looked in the wrong place** — it checked the product
pages, found them clean, and the promise was in the page title and the social cards all along.
**A correction at one site is not a correction.**

**This is one line of words, and the words are yours, not mine** — "for life" is a positioning
claim. Say what it should read and it is a ten-minute change.

⏳ **Blocked on other people, unchanged (3):** the child-abuse image list needs an outside body to
accept us · the YouTube terms question has still never been answered by anyone · the appeal on
the suspended Google account is still sitting there.

---

## The build plan

**TEN sessions, run TWO at a time — five waves.** Ready-to-paste prompts, one per session, each
self-contained: [`WHATS_NEXT_SESSION_PROMPTS_2026-08-17.md`](WHATS_NEXT_SESSION_PROMPTS_2026-08-17.md).

| Wave | Together | Shared files |
|---|---|---|
| 1 | **S1** the supplier gets through the door · **S2** the first screens anyone sees | 0 |
| 2 | **S4** eight small things · **S9** under the floor | 0 |
| 3 | **S5** the couple's four screens · **S7** the five undrawn surfaces | 0 |
| 4 | **S6** the supplier's screens · **S10** the compliance pack | 0 |
| 5 | **S11** who is in this event · **S8** your own admin screens | 0 · S11 needs S1 merged |
| 6 | **S3** "we couldn't load it" | 🛑 **alone** |

🛑 **ONLY TWO PAIRS CAN NEVER SHARE A WAVE, AND BOTH WERE MEASURED, NOT GUESSED:**
**S5 + S11 share 118 files** and **S4 + S6 share 55.** Everything else has ZERO overlap.
⚠ **My first cut of this table paired S5 with S11** — I had chosen the pairings by which sessions
sounded unrelated instead of counting. **Deciding a collision by theme is how you get a
118-file collision.**

🔑 **THE TWO-AT-A-TIME CAP IS ABOUT REVIEW, NOT FILES.** The 44-defect incident was ten diffs
nobody could read, not ten diffs that touched each other. **Three at a time is safe on the code**
(S1·S2·S9 → S4·S7·S8 → S5·S6·S10 → S11 → S3) if three changes can actually be reviewed.

## How to use this

Source-of-truth order is unchanged: **live site → shipped code → live database → this file →
anything older.** This file was true on 2026-08-17 and will rot exactly as fast as the last one.
**Re-verify before acting on any line.**
