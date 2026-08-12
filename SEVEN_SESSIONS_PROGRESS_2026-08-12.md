# The seven sessions — progress · 12 August 2026

> 15-agent completion audit against **current main and live production**, each auditor followed
> by an adversarial pass that tried to break every "done" claim by hunting the **sibling
> screen** — this wave's signature defect.

---

## Progress

| # | Session | Verdict | What remains |
|---|---|---|---|
| **1** | Honest wording on what we sell | **8 of 12 done** | A green *confirmed* badge beside a booking nobody agreed to · a *notify me* button promising an email nothing sends · two livestream tiles on the suppliers tab, one marked Free · **three wizard cards showing ₱0, one of which costs money** |
| **2** | Nobody can fake who said what | **Done for chat + announcements — the sweep missed the neighbours** | A couple can **accept an inquiry in the supplier's place**, permanently unmasking that supplier's real name · a booked supplier can self-clear their own photo's safety check · a couple can make a supplier's phone ring outside the paid gate |
| **3** | Removing the LED Background Maker | **Product gone, traces not** | A leftover page on the live site still advertises it · marketplace search still suggests it · **suppliers can still tick it, which silently hides their shop** · the old decks are still readable via the public code repository |
| **4** | Live Studio, the honest path | **NOT STARTED** *(2 PRs opened just now)* | All of it. On sale at ₱2,999 while the price list calls it unfinished; nothing can go on air; a hand-streaming host is told they are off air all day |
| **5** | Bot protection | **Built and proven — deliberately off** | One fix first: the forgotten-password page says a reset email is coming even when the check refused |
| **6** | Addresses and renames | **Half done** | Any signed-in account can take an address directly, including one mid-forwarding · **after a rename, every guest page except the front page dies** |
| **7** | Photo wall free for everyone | **Mostly — one gap written but unmerged** | On an event with no Papic, guests see a wall that never fills and the couple has no switch · the published recap and our public sample gallery ignore the switch |

---

## The five that matter most

**1 · A couple can unmask a supplier's real name — and it cannot be undone.**
From their own account, a couple can mark a supplier's inquiry accepted without the supplier
ever replying. That permanently reveals the supplier's real personal name across the whole
marketplace. *Half a day.* This is Session 2's sibling: the messages were locked, the
conversation record beside them was not.

**2 · Live Studio is on sale and four screens disagree about whether it exists.**
The wizard sells it at ₱2,999 with a "save versus a crew" discount and no warning. The price
list next door says *In build*. The marketing page has no caveat. Search engines are told it is
in stock. **Nothing can put a buyer on air** — no channel is connected.

**3 · Anyone signed in can take a web address that is in use or still forwarding.**
The rules live only inside the screens. Taking an address that is mid-forwarding makes every
printed invitation holding it fail. *Half a day, and free right now* — there are 4 event
addresses, 2 shops and 1 handle in total, so there is nothing to migrate.

**4 · After a rename, twelve guest pages die.** The screen promises two years of forwarding.
Only the front page keeps it. The day-of hub, the recap, the welcome page, seat-finding and
seven more stop working — **including the recap link we publish to Facebook as permanent** and
the invitation QR the couple prints. *Half a day: twelve call sites, one shared shape.*

**5 · A paid Papic camera reads ₱0 in the wizard** — the first card a couple lands on, with a
−20% promo applied to nothing. Two other ₱0 cards are accidentally correct.

---

## Before you flip anything

- **Bot protection** — the forgotten-password page must be fixed first. It tells a locked-out
  person a reset email is on the way even when the check refused them. It is the one page
  people only reach *because* they are stuck. 🪤 The guard written to prove this work is done
  **never confirms the puzzle sits inside the form** — move it one line out and every check
  stays green while every person on that screen is silently refused.
- **The switch-on order** — create the widget listing **both** live addresses, paste the key,
  redeploy, *then* enable. Out of order, sign-in breaks. Listing both addresses is **not
  optional**; the runbook wrongly says it is.
- **"Setnayan channels only"** must not be turned on before a Setnayan channel can broadcast, or
  nobody can go live at all. Today's order is correct.
- **Re-activating the retired LED price row** would put it back on sale with every check green —
  the guard everyone believes protects it is only a sentence in a note.

---

## Owner decisions

1. **Register and phone-verify one Setnayan YouTube channel** and connect it — **24-hour hold**
   before the first stream. Everything on our side is built and waiting.
2. **Is Live Studio finished or unfinished?** Whichever way, four screens must then agree.
3. **Does "keep the wall off guests' phones" also cover the recap couples publish afterwards,
   and our public sample gallery?** Today it covers only the celebration.
4. **Should the three ₱0 wizard cards carry a real price or be free on purpose?**
5. **Do the old pitch decks stay readable in the public code repository?** They quote dead
   prices, list the removed LED backdrop at ₱6,000, and offer partners resale rights.
6. **Send one real message as a couple and one as a supplier, plus one announcement.** Nobody
   has ever sent one in production, so the anti-forgery fix is reasoned, not observed.
7. May a supplier request an address correction from their own screen?
8. May a couple overrule the wording check on a guest's letter before publishing it?

---

## Closed — do not re-check

- **Nobody can put words in a supplier's mouth.** Sender decided by the database on both chat
  and day-of announcements; ordinary sending still works both ways.
- The photo wall really is free — photos reach it, the badge agrees, the machine-readable
  catalogue says free. **The couple's off-phones switch works and fails safe** on all three
  guest surfaces including phones already holding the page open.
- The LED Background Maker is gone from the app, database, price list and both languages of the
  marketing site. **Hiring an LED wall supplier was correctly left alone.**
- Sign-in security headers allow the verification window on **both** policies; all ten sign-in
  paths wired; nothing live because the key is unset.
- The two-year forwarding promise is live and correctly backdated; the personal-code invitation
  link forwards after a rename.
- The reserved-word list is **generated from the real pages** and matches the database exactly.
- The gift page, the reel wording, the failed-camera warning and the onboarding livestream price
  are all now honest.
