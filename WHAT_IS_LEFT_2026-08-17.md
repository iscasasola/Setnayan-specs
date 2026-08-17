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
| ~~The big unbuilt thing~~ | 🛑 **RETRACTED 2026-08-17 — the Event Hub IS BUILT.** See §4. What is left there is **one ordering fix**, not six steps. |
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

### What is genuinely left — one defect and one gap, not six steps

- 🚨 **On a private event the page refuses a booked supplier before it ever asks whether they are
  booked.** The lock screen admits four kinds of person — a guest with a redeemed invitation, a
  host, someone bound to a seat, and an invited account — and a supplier is none of them. The
  supplier check runs 200-odd lines later and never gets reached. **4 of your 6 events are
  private**, so even after a real booking the strip would appear on 2 of 6. **This is an ordering
  fix, not a build.**
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

**Wrong today regardless — unchanged, and these are the real day-of risks:**
- On the day, every supplier sees a "start the next item" button. Only a coordinator is allowed to press it, **and the refusal is silent.** Embarrassing at a live wedding.
- The shot list says it syncs to the couple. **It never leaves the phone it was typed on** — and neither does the coordinator's issues log.
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
- Sign-in, sign-up, password reset, invite and join — **the first screens anyone ever sees, still undesigned.**
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
12. The public page selling the photo service still says photos are not matched by face. **Every event is in the mode where they are.**

**Money and words (3)**
13. **The photo service still has no "what this would otherwise cost you" figure.** Only you can give an honest one.
14. **Should suppliers still see the ~450-cell tier grid**, now that each plan says what it adds?
15. **The public category words are our internal ones** — *Look, Feast, Documentary, Booths*. Nobody types those.

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

| Wave | Together | |
|---|---|---|
| 1 | **S1** the supplier gets through the door · **S2** the first screens anyone sees | the two highest-value |
| 2 | **S4** six small things · **S9** under the floor | |
| 3 | **S3** "we couldn't load it" | 🛑 **alone** — touches screens app-wide |
| 4 | **S5** the couple's four screens · **S7** the five undrawn surfaces | |
| 5 | **S6** the supplier's screens · **S10** the compliance pack | S10 opens no PR |
| last | **S8** your own admin screens | internal-only, ships last |

⚠ **S6 must never run beside S4** — both touch the supplier's screens. The one pairing that looks
safe and is not.

## How to use this

Source-of-truth order is unchanged: **live site → shipped code → live database → this file →
anything older.** This file was true on 2026-08-17 and will rot exactly as fast as the last one.
**Re-verify before acting on any line.**
