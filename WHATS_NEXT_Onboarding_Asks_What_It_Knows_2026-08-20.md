# WHAT'S NEXT — THE FLOW ASKS WHAT IT ALREADY KNOWS (2026-08-20, evening)

> **Written to survive an account change.** The session that found these hit its weekly usage
> limit mid-investigation and could not write them down. This file is the rescue: everything
> below was recovered from that session's workflow journals and its own tool trace, then
> **RE-VERIFIED against `origin/main` (`f5fd0fcc2`) and the live production database** by the
> session that wrote this file.
>
> ⚠ **A HANDOFF IS NOT EVIDENCE — including this one.** Each claim says how it was measured.
> Re-verify before acting.
>
> ✅ **UPDATED THE SAME DAY — DEFECT 5 (THE MONEY) IS BUILT.** PRs
> [#4604](https://github.com/iscasasola/setnayan-platform/pull/4604) (the onboarding bill goes
> to the page that can take the money · the bill stays visible afterwards · the shots card names
> a price before the press) and
> [#4606](https://github.com/iscasasola/setnayan-platform/pull/4606) (the studio buy banner stops
> promising an email that does not exist, and the guard that should have caught it is repaired).
> Both merged-on-green with auto-merge armed. **§ 1 and § 1b below are DONE — read them for the
> reasoning, do not rebuild them.**
>
> 🔴 **DEFECTS 1 · 2 · 3 · 4 ARE STILL UNBUILT. No branch, no PR.**
> The only code that shipped in the parent session is PR
> [#4599](https://github.com/iscasasola/setnayan-platform/pull/4599) (Your Year), which is
> merged and live and is **NOT** part of this work.

---

## 0 · WHAT THE OWNER DID, AND WHAT HE SAW

He tapped **"Your birthday — turning 40"** on `/dashboard/year` and walked the create flow to the
end. Five separate complaints came out of that one walk, in his own words:

| # | owner, verbatim | one-line diagnosis |
|---|---|---|
| 1 | *"i tried the birthday. it asked if its mine."* | the screen says *"This one's yours"* and still renders an empty text box under it |
| 2 | *"it should be when do you want to celebrate it?"* | that exact title EXISTS in the code and fires on the wrong trigger |
| 3 | *"it also knows my birthday to be 40th. why do i get asked for this?"* | the age-band question has a drop mechanism and no writer to trigger it |
| 4 | *"seems like these were repeated"* (+ raw keys on screen) | the details screen re-asks 1–3 and prints `1st_birthday` / `adult_regular` at a customer |
| 5 | *"i had a price to pay. but i there was no payment. it just created."* | 🔴 **the order EXISTS and is UNPAID — see § 5, this one is money** |

🔑 **ALL FIVE ARE ONE DISEASE: the flow asks a question whose answer it is already holding.**
Four of them are a missing HANDOVER between two screens that each work correctly on their own.

---

## 1 · 🔴 DEFECT 5 FIRST — THE MONEY. This is the serious one.

**MEASURED IN PRODUCTION, 2026-08-20. Not inferred from code:**

```
orders → public_id S89O-GCR6BDC4Z6 · event 17326f89… ("Ice turns 40")
         service_key ONBOARDING_SERVICES · ₱499.00 · status 'submitted'
         reference SNEYGV00WY · created 09:30:51Z (0.7s after the event row)
onboarding_order_items → SETNAYAN_AI ×1 @ ₱499.00
```

### ⛔ THE OBVIOUS HYPOTHESIS IS WRONG — DO NOT BUILD AGAINST IT

The parent session was tracing toward *"the charge was refused, so `paymentPath` came back null
and he landed on the ordinary dashboard"*. **That is FALSE and the database says so.** The charge
resolved, the order minted, `paymentPath` was **non-null**, and he was redirected. Building the
"why was it refused" fix would fix nothing.

🔑 **A CODE PATH THAT CAN FAIL SILENTLY IS NOT PROOF THAT IT DID.** `mintOnboardingServiceOrders`
is non-fatal by contract and returns `paymentPath: null` on every failure — an inviting story that
matches the symptom perfectly and did not happen. **One query settled it. Query prod before
writing a diagnosis from a plausible code path.**

### WHAT ACTUALLY HAPPENS

`lib/onboarding-services-orders.ts:274-285` sends an AI-only buyer to the **Papic photo studio**:

```js
const params = new URLSearchParams({
  papic_purchased: String(order.public_id),
  papic_ref: referenceCode,          // ← NO papic_amount
});
return { paymentPath: `/dashboard/${eventId}/studio/papic?${params}` };
```

The studio renders one banner (`app/dashboard/[eventId]/studio/papic/page.tsx:1243-1252`):

> *"Order received. Reference SNEYGV00WY. Payment instructions are on the way; **your cameras
> activate** once the Setnayan team confirms your transfer."*

**Four things are wrong at once, and together they are exactly his sentence:**

1. **NO AMOUNT.** The banner prints a figure only when `papic_amount` is in the URL, and this
   path never sets it. The ₱499 he had just agreed to **disappears at the moment of paying**.
2. **NO BANK DETAILS.** Nothing on that screen says where to send money. The services step
   promised the opposite, verbatim — `app/onboarding/_shared/services-step.tsx:599`:
   *"We'll show you where to send it right after this."*
3. **THE WRONG PRODUCT.** He bought the assisted planner. He was sent to the photo studio and
   told **his cameras** would activate. He bought no cameras.
4. **THE WRONG PAGE ENTIRELY** for an AI-only order. The destination was chosen when the only
   thing this step sold was Papic; Setnayan AI was added to the same mint later and inherited a
   destination written for a different product.

🔑 **THE PAYMENT SCREEN IS THE PRODUCT'S PROMISE, AND IT IS BEING KEPT BY A BANNER ON SOMEBODY
ELSE'S PAGE.** A person who is ready to pay and is shown no amount and no account number does not
conclude "I'll find it later" — he concludes **nothing was charged**, which is what the owner
concluded and wrote down.

### ⏭ WHAT TO BUILD (not started)

- Carry the amount into the redirect, and split the destination by what was actually bought:
  an AI-only order must not land on the Papic studio.
- The banner copy must name the product bought, not "cameras".
- ⚠ **UNVERIFIED, CHECK IT:** whether the *"payment instructions are on the way"* email actually
  sends. That needs `RESEND_API_KEY`, which **cannot be read from a session** (server-only). If it
  is unset, this order has no route to payment at all, on any surface. **Do not assume either way.**
- ⚠ **THE ₱499 IS ALSO A PRICE QUESTION.** Birthday is Tier C, whose *sign-up* price is ₱499 and
  regular is ₱899 (`platform_retail_catalog_v2`, read live). The flag
  `setnayan_ai_per_event_pricing_enabled` is **TRUE in prod** (read live). That is all correct —
  noted only so nobody "fixes" the amount.

🔴 **THERE IS A REAL UNPAID ₱499 ORDER SITTING IN PROD RIGHT NOW** (`SNEYGV00WY`, status
`submitted`). It is the owner's own test, so nobody is out of pocket — but it is the first order
this flow has ever minted, and it is stuck. Decide whether to cancel it before it confuses the
admin payment queue.

---

## 1b · THE OWNER'S TWO FOLLOW-UP OBSERVATIONS — BOTH CONFIRMED (2026-08-20, later)

> *"there was no paywall on the onboarding. and no way to add shots for papic"*

### (a) "No paywall on the onboarding" — CORRECT, and it is the whole of § 1

**There is no payment step in the create flow, by design.** The flow ends, the event is created,
and the only thing that ever mentions money is a banner on a page you are redirected to
afterwards — the Papic studio — which for an AI-only buyer names no amount and no bank details.
So the owner walked a flow that took a ₱499 decision and never once showed him a price to pay
against a place to pay it. **His sentence and § 1 are the same defect seen from the two ends.**

### (b) "No way to add shots for Papic" — the control EXISTS, and every word around it says free

**Measured on the exact build production is serving** (`/api/health` → `f5fd0fc`, = `origin/main`
`f5fd0fcc2`), and against the live catalog. The data is healthy: **four shot bundles are active
and priced** — ₱50/100 · ₱1,000/3,000 · ₱3,000/10,000 · ₱5,000/20,000 — so the ladder is not
empty and the stepper CAN increment. **The bug is not a dead control.**

Here is the entire Papic card in its default state, in order, as a person meets it:

| what is on screen | what it says |
|---|---|
| green banner | *"**Papic is live on this birthday.** Your free shots and guest QR are ready."* |
| heading | *"How many shots do you want for this birthday?"* |
| the control | **`−`  50 shots / "Yours already"  `+`** — bare glyphs, no words; `−` is disabled at 30% opacity |
| under it | *"Included — **Free**"* |
| card subtotal | *"Papic — **Free**"* |
| closing line | *"**Top up any time from your Papic studio.**"* |

🔑 **EVERY VISIBLE WORD SAYS THE THING IS ALREADY YOURS AND FREE, AND THE ONLY WAY TO BUY IS AN
UNLABELLED `+`.** No price appears until you press it. Nothing on the card uses the words *add*,
*buy*, *more* or a peso figure in its resting state — the plus button's only "add shots" wording
is its `aria-label`, which a sighted person never sees.

🔑 **AND THE CARD'S OWN LAST LINE SENDS YOU AWAY FROM ITS OWN CONTROL** — *"top up any time from
your Papic studio"* tells the reader the place to add shots is a different page. A person who
reads the card top to bottom is told: it's live, it's free, it's included, and buying happens
elsewhere. **Reading that as "there is no way to add shots here" is the correct reading of the
copy.** The control is not hidden — it is *contradicted*.

⚠ **HONEST LIMIT: I could not see his screen.** The stepper is proven present in the shipped code
and the ladder is proven non-empty in prod; I did NOT observe the rendered page (it is behind a
login and I do not sign in to accounts). So the finding above is *"the copy defeats the control"*,
which is provable from source. **A rendering failure that hid Card 1 entirely is not ruled out**
and would look identical from the owner's chair. **First act on the copy; if he still reports it
missing after that, the next step is to observe the page signed in as him, not to re-read code.**

⏭ **THE FIX IS COPY AND AFFORDANCE, NOT MACHINERY** — do not rebuild the picker. Name the action
on the control, show what the next press costs before it is pressed, and stop the closing line
pointing at another page while a live control sits above it.

---

## 2 · DEFECT 1 — "This one's yours" with an empty box under it

**The half-fix already shipped and the owner is right that it still asks.** The screen re-titles
itself and already suppresses autofocus for the self case
(`generic-onboarding.tsx:660` — `autoFocus={!(momentForSelf && !honoree)}`), but the text input
with placeholder *"e.g. Nina"* renders **unconditionally**. A box with a cursor in it is a
question, whatever the heading says.

✅ **ON THE YEAR → CREATE ROUTE THE BRANCH ALWAYS FIRES** — the honoree carry is guaranteed empty,
so `!honoree` always holds. Verified.

**BUILD IT LIKE THE SHIPPED PRECEDENT, NOT A NEW IDEA.** `create-event/_components/event-type-picker.tsx:311`
already ships the exact shape: a **"For <name> · Change"** chip that states the answer and reveals
the field when tapped. Its own comment records the project rule, which is locked in four separate
places: **"hiding is a default, never a wall."**

⛔ **DO NOT DROP THE SCREEN.** See § 6 — removal has three separate hazards here.

---

## 3 · DEFECT 2 — "When is it?" should be "When are you celebrating?"

🔑 **RULE 0 PAID: THE OWNER'S EXACT SENTENCE IS ALREADY CODED.** The date screen already flips its
title to *"When are you celebrating?"* and already renders the three day-choice chips
(*On the day · The Saturday after · Another day*). **Nothing needs drawing.**

**It fires on the wrong value.** Everything in that block (`generic-onboarding.tsx:761-840`) is
gated on `anchorOptions`, which is derived from `anchorDate` — and `anchorDate` is written by the
`'anchor'` screen, which is **in the sequence for `anniversary` only**. So for every birthday
`anchorOptions` is null and the plain *"When is it?"* renders. **Widen the trigger from "an anchor
was typed" to "the day is already known."**

🪤 **DO NOT FIX THIS BY POURING THE CARRIED DATE INTO `anchorDate`.** Two traps, both verified:

1. **A CARRIED DATE IS A CELEBRATION SUGGESTION, NOT AN ANCHOR.** The two columns mean different
   things and the carry's own doc says so.
2. **IT RENDERS A FALSE SENTENCE ABOUT A WEDDING.** `anchorOrigin` defaults to the literal string
   `'wedding'` and is never derived from the event type. Setting `anchorDate = '2026-12-16'` on a
   birthday renders, exactly: **"Our wedding falls on Wed 16 Dec 2026 — you can celebrate any
   day."** On a birthday screen, naming a wedding that does not exist.
3. The *"Your 40th"* ordinal is **unreachable for a birthday no matter what** — `anchorReturn` is
   hard-gated on `isAnniversary`, even though the helper would correctly return `{ n: 40 }`.

✅ Safe: the chips are a pure VIEW of the date field, `pickCelebrationDay` never touches
`anchorDate`, and the anchor-seeding effect will not clobber a carried date. All verified.
⚠ There is **no test** covering the date screen's rendered sentence. Write one.

---

## 4 · DEFECT 3 — it knows he is turning 40 and asks for the age band

**The drop mechanism already ships. What is missing is a WRITER.** A per-type question whose
answer the profile already supplies is filtered out of the screen list by
`questions.filter((q) => !(q.id in prefillDetails))` — shipped, working, and it keeps the answer's
contribution to the starter plan (verified: dropping `who` still adds `mobile_bar`).

**Two independent sources for the answer already exist and both are already on the route:**

1. The Year page **already computes "turning 40" server-side and prints it** — but `MomentCarry`
   carries only `celebrationISO` and `forSelf`, so the number is thrown away one screen before it
   is asked for.
2. `getSelfPersonalization()` — **already called by `/onboarding/[type]`** — returns the account
   holder's `birth_date` and pipes it through the prefill seam. The plumbing is one function body
   away: `deriveOnboardingPrefill` derives exactly one thing today (christening rite from
   religion) and has no birthday branch.

🪤 **THE SEAM IS INERT BY DEFAULT.** `onboardingV2BriefEnabled()` is fail-closed and defaults OFF,
so `deriveOnboardingPrefill` is **never called** today and `prefillDetails` is always `{}`. A fix
written behind that flag ships switched off. **Decide the flag deliberately.**

🪤 **THE OPTION LABELS DO NOT MATCH THE OWNER-LOCKED MILESTONE LADDER.** The ladder is 1 · 7 ·
18(F)/21(M) · 60. The screen offers *"A milestone (18 / 21)"* and *"A golden one (50+)"* — **there
is no 50 in the ladder.** A 40-year-old maps to `'adult'` by elimination. There is **no age-band
constant anywhere in the codebase**; any age→option mapping must be written from scratch, so
write it against the ladder, not against the labels.

⚠ **UNVERIFIED:** `event_type_onboarding.questions` can override these questions wholesale from an
admin DB row. Nobody checked whether a `birthday` override exists in prod. **Check before editing
the code defaults — you may be editing something the live site does not render.**

---

## 5 · DEFECT 4 — the details screen repeats itself and prints raw keys

**DEFINITIVE DIAGNOSIS: the labels do not exist in the data.** `lib/onboarding/specialty-catalog.ts:513-590`
gives the birthday spec's option-bearing fields (`milestone_type`, `program_highlights`) as bare
snake_case strings. **A field carries a key AND a label; an option carries only a string — the
TypeScript type has no slot for an option label at all.** So this is not a renderer ignoring
labels and not a DB row with nulls. The renderer prints the only thing it was given.

⇒ The fix is **adding a label slot to the option type and filling it**, everywhere, not patching
the birthday screen. `1st_birthday` · `7th_birthday` · `kids_regular` · `18th_debut` · `60th` ·
`75th` · `80th` · `90th` · `100th` · `adult_regular` · `this_is_your_life` ·
`apo_grandchildren_tribute` · `testimonials` · `candle_blowing` · `games` · `production_number`.

**The repetition half** is the same handover gap as § 4: celebrant, age and milestone are asked
again here because nothing seeded them. `partitionOnboardingPrefill` already routes a prefilled
answer to `specialty` when its key matches a catalog field key — ⚠ **and silently drops anything
matching neither.**

🔑 **PRIOR ART FOR THE RIGHT SHAPE:** a pre-answered specialty field already renders seeded,
editable, and labelled **"From your profile"**. Pre-answer, do not delete.

---

## 6 · ⛔ THE TRAP THAT WILL BITE WHOEVER BUILDS THIS

**Removing a screen from `screens` at RUNTIME is dangerous in this file. Skipping it in
navigation is safe.** All verified:

- `screens[step]` is read with a non-null assertion and immediately has a string method called on
  it. **An out-of-range `step` is a RENDER-TIME THROW, not a soft landing.**
- Removal **silently disarms the `life_event_exists` remedy for exactly the population it targets.**
  The walk-back uses `screens.indexOf('honoree')`, and the copy naming the blocking event renders
  **only** inside the honoree branch. Drop the screen and the user gets the generic dead-end
  message that screen exists to replace.
- `screens` sits in the hydrate effect's dependency array. It is stable today, but a drop driven
  by state set INSIDE that effect could re-trigger it — and **a re-run CLOBBERS carried state**,
  because the draft-restore setters are plain overwrites while the carry setters are single-read.
- ✅ The skip-during-navigation alternative preserves every index. Its only cost is the progress
  bar advancing two notches on one tap. **Skip for TRANSIT, never for OCCUPANCY** — the error path
  deliberately parks the user ON `honoree`.

🔑 **THE FILE'S OWN COMMENT JUSTIFYING "nothing is removed from the sequence" GIVES A REASON THAT
IS NOT TRUE** — it says `?resume=1` "navigates BY index"; it resolves `'congrats'` **by id**. The
conclusion is right, the stated reason is wrong, and the real hazards are the three above, none of
which is written down anywhere. **Do not trust the comment's reasoning; the hazards are real for
different reasons.**

⚠ **No guard, test or lint pins `'honoree'` into the screens array.** The only source-text guard
over this file asserts one thing: that `takeMoment()` is still called.

---

## 7 · WHERE THE RECOVERED EVIDENCE LIVES

The parent session's two surviving workflow runs (a third failed with **zero** lenses reporting —
its money conclusion below is MINE, not theirs, and contradicts where they were heading):

```
~/.claude/projects/-Users-icecasasola-Documents-Claude-Projects-Setnayan/
  9dd42b44-7bac-4ae0-a13a-3b126f8d057b/subagents/workflows/*/journal.jsonl
```

⚠ **That path is on ONE machine and does NOT travel with the account.** Everything load-bearing
from it has been copied into this file on purpose. Six lens reports, ~80 claims, almost all
`verified` against a read-only worktree of `origin/main`.

🔑 **THE WORKFLOWS DIED OF THE USAGE LIMIT, NOT OF AN ERROR.** Two returned `plan: null` and read
like empty results; the findings were in the journals the whole time. **Read `journal.jsonl` before
concluding a workflow returned nothing.**

---

## 8 · SUGGESTED ORDER

1. **§ 1 (money)** — a real unpaid order exists and the promise *"we'll show you where to send it"*
   is currently broken for every Setnayan AI buyer. Everything else is friction; this is revenue.
2. **§ 3 (date title)** — the smallest real win; the sentence is already written.
3. **§ 2 (this one's yours)** — copy the shipped chip.
4. **§ 5 + § 4 (labels, then the handover)** — the labels are mechanical and land value alone.
