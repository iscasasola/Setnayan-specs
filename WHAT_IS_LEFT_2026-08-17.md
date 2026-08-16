# WHAT IS LEFT — re-verified 2026-08-17

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
| **The big unbuilt thing** | The Event Hub for suppliers, hosts and coordinators. **6 steps, none started.** |
| **The finishing work** | ~40 items from the last register, almost all still open. Mostly small. |
| **Waiting on you** | 15 things no engineer can close — a signature, a price, a ruling, a switch. |

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

## 4 · 🔴 THE BIG ONE — the Event Hub for all four roles. NOTHING IS BUILT.

Full scope: [`WHATS_NEXT_Event_Hub_Multirole_2026-08-15.md`](WHATS_NEXT_Event_Hub_Multirole_2026-08-15.md).

You said every event should have one hub where the host, guests, suppliers and coordinator each
get their own things. **Three of the four already work. Suppliers do not.**

The reason is one number and it has not moved: **not one of your 45 booked suppliers is a
Setnayan account.** They are names a couple typed into a list. You cannot give features to
somebody who is not there.

**The order is not negotiable — each step needs the one before it:**

1. **A booked supplier becomes a real account, not a typed name.** ← everything else is empty until this
2. **"You are booked here" appears on the event page and opens their tools.** That strip exists and has never once appeared for anybody.
3. **The host can see their own event page as themselves.** Today it tells them to scan their own invitation QR.
4. **One "who is in this event" list.** Today that is five separate screens.
5. **The coordinator stops being two different products.**
6. **A supplier-shaped view of the event.** ← needs your ruling first (see §6)

**Fix regardless of all six — these are wrong today:**
- On the day, every supplier sees a "start the next item" button. Only a coordinator is allowed to press it, **and the refusal is silent.** Embarrassing at a live wedding.
- The shot list says it syncs to the couple. **It never leaves the phone it was typed on** — and neither does the coordinator's issues log.
- The day-of console opens only on the exact booked date. No rehearsal, no morning-after.

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

## How to use this

Source-of-truth order is unchanged: **live site → shipped code → live database → this file →
anything older.** This file was true on 2026-08-17 and will rot exactly as fast as the last one.
**Re-verify before acting on any line.**
