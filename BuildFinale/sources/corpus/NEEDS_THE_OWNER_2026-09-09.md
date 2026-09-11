# WHAT NEEDS THE OWNER — 2026-09-09
**Everything else is being built without him. This is the residue: ten decisions, plus one
engineering item recorded here only because it touches a ruling he already made.**

> Compiled at the owner's instruction (*"finish all that you need to automate and then we handle
> the ones that need my intervention"*). Every item below was **measured today**, not carried
> forward from a register — three separate registers were found stale in the same session.
>
> ⚖ **None of these blocks a build.** The remaining sessions (S12 · S15 · Papic item 3) can all
> finish without any of them being answered.

---

## 1 · The cover prints a zero — and your own rule says it should not

**Live on the published story right now:** `14 captures · 0 live films · 0 voices · 19 days told`.

Your small-count ruling is that a small number is never stated, and **zero is the smallest there
is.** A cover that says *"0 voices"* tells a reader the celebration was quiet; what it actually
means is that nobody has written yet.

**Two ways, one line either way:** drop a fact when it is zero (the cover carries only what it
has), or keep it honest and let a zero show. S11 flagged it rather than change a shipped designed
element on its own judgement, which was right.

---

## 2 · Editing live rows to make a demo look right — rule on the practice, not the incident

S11 shifted **six of your production photographs** onto the event day so the dial would not render
flat, and restored them afterwards. It was honest about it and the restore is verified — **0 of 14
now sit on the day.**

⚠ **But its restore script was never in the PR.** It existed only inside that session, and you were
choosing which sessions to archive at that moment. **Archiving it would have left your data wrong
with no record of what it had been.**

**The decision:** may a session ever write to production to test its own work? The cheap answer is
a seeded demo celebration that nobody could mistake for real — **and the build needs one anyway**,
because your only published story has an empty day, so nobody can see the clock, the search or the
index doing anything.

---

## 3 · PR [#5140](https://github.com/iscasasola/setnayan-platform/pull/5140) — keep it or close it

*"Couples can attach every film of their day."* Opened **3 September, untouched since**, already
conflicting with main **before** today's work existed, and it carries a migration plus two
generated files.

It is not a duplicate of anything — it feeds films into the story where today's work only indexes
them. But it has to be **rebased by a person who understands it**, and generated-file conflicts
have no correct side. **Wanted, or closed?**

---

## 4 · The Featured supplier tier has no price

Listed is free and always will be. Featured is designed, and **not priced.** Nothing can be sold
until you say a number.

---

## 5 · What the edition number counts for a celebration that is not a wedding

`No. 1` counts **weddings** in the awards cycle. For a debut, is it the seventh wedding
(meaningless), the seventh **story** of any kind, or a count per kind? Left filtering weddings with
the reason recorded — **a filter not to flip quietly.**

---

## 6 · Does "Featured" need a different word

The product already uses *featured* three other ways (an admin pinning a story, a supplier's own
"featured in Stories", the admin feature rank). A fourth meaning — a paid supplier tier — is one
too many. Cosmetic, and cheapest to change before anything is sold.

---

## 7 · A Featured supplier's own link, live inside the story

A couple who finds a supplier through us and then books them off-platform is a fee-free import
under the booking-fee model. Today **Book stays on Setnayan and is primary; the outside link is
secondary.** That is a defensible default, not a decision.

---

## 8 · The supplier capture lane is OPEN in production, and whether it should be is yours

Read out of the live database: `vendor_papic_capture` is **active, approved 2026-07-16 by your own
account.** So a supplier's camera is collecting images that include guests, today.

🔑 **You already ruled the scope** — *"their papic service is only for documentation of their
products"* — and that **no filter can enforce it**: a photograph of a cake has guests in it. What
is not ruled is whether the lane should stay open now that it is, and what the retention and
consent wording beside it should say. **RA 10173 territory, and you are the registered DPO.**

---

## 9 · The Papic promotion page still says *"50 credits left"* to a stranger

Flagged when that page shipped and never resolved. A visitor who has bought nothing is told a
balance. **Copy, one line — but it is a claim about money.**

---

## 10 · Does next year's celebration inherit this year's guest list

**Two of your own documents disagree, and S7 could not settle it — so it followed the lock.**

* The story design (`02` §7) promises No. 2 inherits *"your guest list — as a starting point"*.
* Your **2026-07-12 recurrence lock** scopes a carry-forward to *"Details, not the guest list"*,
  and the shipped clone already keeps to that.

S7 built to the **lock**, and the screen now promises no list it will not bring — the safe
direction, and reversible either way. **Which of the two is the rule is yours.**

---

## 11 · A wake can still be handed the JOYFUL recap — and it is one line of engineering, not a decision

⚠ **Listed here only because it touches your Q3 ruling; it needs no answer from you and I am
recording it as work.** S13 measured it and flagged rather than fixed, correctly — it sits in a
file another session was changing.

**What is true:** the solemn refusal you were told about lives in the PHASE a guest receives, which
governs `/{slug}`. The recap has its **own address**, and that address checks only whether the
event has a website and whether the host published — **there is no solemn gate on it at all**, and
the auto-composer contains no notion of a solemn register anywhere.

⇒ A grieving family that publishes their recap gets the cheerful auto-written one. **Nobody has hit
this** (a wake must be created and its recap published, and no wake exists), and your Q3 ruling —
a wake gets the quiet STORY, not the joyful RECAP — is exactly what the fix implements.

🔑 **The lesson is mine, not S13's: I recorded your Q3 ruling with the words *"this does not
reverse the shipped refusal of the joyful recap, which stays refused."* That refusal was narrower
than I said.** A sentence in a code comment is not a gate on every route.

---

## ADDED BY STEP 8 (2026-09-11) — found by driving the Story end to end on the live site

> ✅ **ALL RULED THE SAME DAY (DECISION_LOG 2026-09-11 ⚖️ row):** 12 → B + "with no guest list, anyone may use the credits" · 13 → A · 14 → A · 15 → B · 16 → A · and the snippet mute button → A (smaller visible button in the corner, same touch area). Kept below for the reasoning; do not re-ask.

> Measured on production with the test couple account (testnayan1), never the owner's. Each is a
> question, not a defect somebody forgot — engineering fixes found the same day are PRs, not rows here.

## 12 · A celebration made ON its own day gets one Papic photo, and cannot add a guest to earn more

**What a host sees:** the setup wizard for a wedding dated today says Papic is on with *"50 pts ·
Yours already · Included · Free"*. The host opens the camera, takes one photo, and the second is
refused: *"This camera has used today's shots — it refills tomorrow."* The free pool is sized by
the guest list (`base_points` from guests; here 0 guests → a pool of **1 point**), and the guest
list is already locked for a same-day celebration: *"Your guest list is finalized — the guest count
is locked and can no longer be changed."* So there is no way, short of buying credits, to take a
second photo on the day. (Same family as item 9 — a number shown that is not the number you get.)
**Decide:** should the free pool have a floor that does not depend on the guest list (the wizard's
50), and/or may a same-day host still add guests?

## 13 · A published story on an UNLISTED site shares with the generic Setnayan card

The story's own share card (the couple's names, the cover) is emitted only when the site is
**Public**; an Unlisted site deliberately shows only the brand card so names never reach search
snippets. So a host who presses **Published — everyone can read it** but keeps the site Unlisted
(the default after setup) sends a link whose preview says *"Setnayan"*, not their story. Nothing
leaks either way. **Decide:** should a Published story on an Unlisted site show its own card to
the people it is sent to (search engines already skip Unlisted pages), or is the brand card right?

## 14 · A guest asking for a photo to come down cannot see which photo they are choosing

On the story, *"Hide it, or ask to be unnamed"* offers a picker that reads **"Photograph 1,
Photograph 2 …"** — no picture. A guest with several photos of themselves cannot tell which one
they are asking about. Showing the photographs is a small build; it is a design change to a
consent control, so it is yours.

## 15 · A takedown request goes only to Setnayan, never to the host

The guest's request lands in Setnayan's moderation queue (you, as admin). The host is not told
and has no way to see or answer it from their dashboard, although the host can hide any photo
themselves. Step 8 fixed the queue so **Hide** actually hides a story photograph (it hid nothing
before — PR #5460). **Decide:** should the host also see, or be the one to answer, a guest's
request about their own celebration?

## 16 · The Story Maker forgets which step you were on

After any reload the Story Maker opens on **The desk**, not the step the host was working in
(*The story*). Everything they arranged is kept — only the place on the rail is lost. Remembering
the step is a small change to a designed flow; flagged rather than changed.

---

## ✅ AND WHAT IS **NOT** ON THIS LIST, because you already ruled it today

Q1 counts before publish · Q2 the naming opt-in extending to photo messages · Q3 the wake's quiet
arm · Q6 taken-back plus the printed version stamp · the PRO gate staying as shipped. **Five
rulings, all built or building. Do not let anyone re-ask them.**
