# The builds left — as separate sessions · 11 August 2026

> Produced by a 15-agent verification pass: seven investigators against **shipped code and the
> live production database**, each followed by an adversarial pass whose only job was to prove
> the "missing" verdicts wrong. **The adversarial pass overturned findings in five of seven
> areas.** Nothing here is taken from a document.
>
> **28 real build items · 9 owner errands · 20 things that already ship and must not be rebuilt.**

---

## The rule that shapes this whole list

**Every undeliverable thing on sale has a minutes-long de-list fallback, and taking it off sale
passes the launch test exactly as well as building it.** The launch test is not "everything is
finished." It is: nothing on sale we cannot deliver · nobody misled · nobody locked out ·
nothing about a real person exposed.

That is why **Session 1 is by far the highest value in the list**: it is one sweep of small
truthful edits that clears twelve separate ways the product currently misleads someone.

---

# BEFORE LAUNCH

## Session 1 · Stop saying things that are not true
**~1 session · clears 12 items · the single highest-value session on this list**

Every one of these is minutes. They are grouped because they are the same kind of edit and
several touch the same screens.

| What a person is told | What is actually true |
|---|---|
| A ₱2,000 guest "Stories" add-on is for sale | Buying it changes nothing — the story maker is already free to every guest. **Take off sale** |
| "You have a new confirmed booking" | The supplier has not agreed yet — the couple merely marked them |
| "Rendered on our servers, emailed within the hour" | It renders in the couple's own browser on the very next screen, which says "keep this tab open" |
| "This is what guests see on your event page" (gifts) | Guests get a not-found page |
| "We'll email you when these vendors are live" | Nothing can send it and no list exists |
| "Your stream is not running" — mid-broadcast | It is running. Pressing Go live again can never help |
| A livestream card priced ₱0 in onboarding | The real product is ₱2,999 |
| Two livestream tiles side by side, one marked Free | Same product twice; both open the paid page |
| Photo wall marked "In build" on the price list | It works end to end. This costs sales, not trust |
| Guest event hub shows our marketing title in the browser tab | Should show the couple's names |
| Two dead vendor price rows beside near-identical live ones | An admin can reprice the wrong one and see no effect |
| The ₱2,500 photo wall is described as a venue projection only | It also mirrors to every guest's phone all day |

⚠ **The Stories add-on is a restoration, not a new decision** — it was deliberately taken off
sale once, with the reason recorded, then switched back on by a later blanket
"activate everything" sweep that caught it by accident. **Owner should confirm**, because that
sweep was also an owner instruction.

---

## Session 2 · Nobody can put words in someone else's mouth
**~half a session · BLOCKS LAUNCH · no fallback exists**

A couple signed into their own account can post a message into their conversation with a
supplier and mark it as coming **from the supplier** — or from **Setnayan itself**. The
supplier opens the thread, sees words they never wrote, and **cannot delete them**. Faking one
supplier reply also unmasks that supplier's real personal name to the couple before they have
ever answered. In a dispute, our own record would be the forged one.

**There is no de-list fallback — messaging cannot be switched off.** Nothing is compromised
today only because no messages exist in production yet. That makes this free to fix now and
expensive later.

---

## Session 3 · LED stage backdrop — decide, then de-list or build
**Owner decision first · de-list is minutes · building it is 2+ sessions AND new paid infrastructure**

A couple pays ₱1,000 for the animated monogram, is told the LED backdrop is included, spends
an evening designing a loop, presses a button saying it is queued for render — **and nothing is
ever made.** Ten screens plus the public features page, in both languages, promise an 8K video
file and a posted USB stick. No file is produced, nothing is mailed, and nobody at Setnayan is
ever shown that a couple is waiting.

- **Saving the design genuinely works** and is properly private. Only the render is absent.
- This is **the only thing in the product needing a real server render farm.** Everything else
  that makes a file does it in the customer's browser.
- The posting-a-USB half is an **operations process**, not code.

**De-list = minutes:** drop the LED line from the monogram card, remove two bullets from the
public features page, stop the purchase unlocking the maker. **Nobody is refunded — nothing has
ever been bought.**

✅ Already done today, do not redo: the price-list blurb had its LED promise removed, with a
test that fails if any live price row mentions LED again.

---

## Session 4 · Live Studio — make the honest path whole
**~1 session · partly waits on an owner errand**

**Correcting the record: three ways to go on air already ship and work** — paste your own
YouTube broadcast link, paste a Facebook Live link, or let a guest tap a camera and watch that
phone directly. The first investigator recommended taking the free single-camera link down;
that was wrong and would have deleted working paths.

What is genuinely dead is the **automatic, one-tap route**, because there is no Setnayan
broadcast channel. On the hand-run route a host most likely takes:

- the red on-air light never comes on
- the highlight button they paid for is never shown
- the printable camera hand-out sheet has no link from any reachable screen — and **it is not a
  one-hour job**: the sheet prints unlabelled cards under the old model, while the current
  controller mints one join code per channel, so linking it as-is hands out cards nobody can
  match to a camera

**Fallback if the owner does not want to do the channel errand:** switch Live Studio off sale —
minutes — and keep the three free paths.

---

## Session 5 · Bot protection — all three pieces, or none
**~1 session · must ship COMPLETE before the switch is flipped**

Nothing is wrong today because it is off. The moment it is switched on, three separate holes
each lock real people out **silently, with no error**:

1. **Our own security header blocks the bot check itself.** It draws in a small window from an
   outside provider that is not on our allowed-windows list, so every sign-in, sign-up and
   password change is refused — including the owner's. *This is the same failure that made the
   supplier map a grey box for weeks.*
2. **Forgot-my-password was never wired**, on either half. Someone locked out asks for a reset
   link and is refused, with no way through. Our own launch notes claim every sign-in form is
   wired; this one is not.
3. **The two scan-a-poster claim screens** expect a bot stamp they never ask for. A friend who
   scans the photo-crew poster — **the login-free path that is switched ON in production right
   now** — gets "This link isn't active".

🔑 **The strict order still holds** — key and redeploy first, then the widget, then enforce —
but all three of these must be closed before the final step. **Zero-minute fallback: leave bot
protection off**; everything works, the only cost is that the abuse hole stays open.

---

## Session 6 · Addresses that survive being printed
**~1 session**

- **Renaming a wedding page kills every printed invitation.** The screen promises old links keep
  working for 90 days. They stop immediately — measured live, the one wedding that has been
  renamed 404s on its old address today. Save-the-dates go out 6–12 months ahead, so 90 days
  would be too short even if it worked. *Minutes-long fallback: hide the rename field.*
- **Auto-invented shop addresses can permanently collide with our own pages.** The generator uses
  an older, shorter forbidden-word list — fifteen of our own live pages are missing from it,
  two of which already serve real pages. Worse, the sign-up wizard previews a safe alternative
  while the system quietly mints the colliding one. *Fallback: stop inventing addresses and make
  the owner pick, which is already the normal path.*
- **No way to correct a shop's address, even for the Setnayan team.** Permanent-by-design is
  right, but a typo or a trademark problem has no remedy short of a whole new shop. The team can
  already fix one by hand; nothing calls it.

✅ **Do not rebuild the shared name list** — weddings, shops, people and held-back addresses are
already checked in one answer, and it fails closed if any check is unreadable.

---

## Session 7 · The couple can turn the photo wall off
**~half a session for the switch · 1 session to also honour "only the photos I'm in"**

The ₱2,500 wall also mirrors onto **every invited guest's phone** for the whole day. A couple who
revokes all the venue screen codes will believe it is off — it is still running in every guest's
hand. **A saved setting for exactly this already exists, with an "off" option, and nothing
anywhere reads it.**

---

# AFTER LAUNCH — real, not blocking

## Session 8 · Consent and labels
**~half a session**

- Approving a supplier's request for the couple's guest list **records no privacy consent**. The
  invitation route shows the disclosure and files it; the ask route does not. *Smaller than first
  reported* — the per-area decision record IS filed and does appear in the couple's data export.
- A wedding-day announcement's **sender label is decoration** — it can say "coordinator" when the
  couple wrote it. *Guests see no sender at all*, so a forged label never reaches them; it lands
  only on the couple's own dashboard.

## Session 9 · Loose ends
**~half a session**

- A vendor add-on has **two independent on/off switches** with nothing keeping them in step, and
  the database half is on. A free-tier vendor calling the service directly would get a paid
  add-on without paying. Harmless today — no vendor pays for anything yet. *Fallback: seconds,
  turn the database half back off.*
- **No nudge or deadline for a supplier sitting on a recorded deposit.** (There IS a 48-hour
  chase for unanswered enquiries — that already ships.)

## Session 10 · Show a chapter to guests but not to strangers
**Product decision first, then ~1 session**

Half the machinery already exists and is enforced on the pre-wedding page; only the control is
missing. Nobody has decided whether the after-the-wedding page should have this at all, and
Unlisted already covers most of the need.

---

# NOT BUILDS — owner errands, some of which block a session above

1. **Create the Setnayan broadcast channel** — YouTube channel, phone-verify, enable live
   streaming (**YouTube imposes a 24-hour wait**), connect on the admin screen that already
   exists. *Blocks the automatic route in Session 4.*
2. **Check one camera-phone streaming setting in the hosting dashboard.** If it is off, a couple
   who paid ₱2,999 hands out QR codes and **every operator's phone shows only its own picture,
   with no error anywhere.** Cannot be read from outside a signed-in session.
3. **One end-to-end livestream rehearsal.** An afternoon, two phones, a laptop. The full chain
   has **never run once in production.**
4. **Turn on blocked-stolen-password checking** — one toggle, no code, no ordering trap.
5. **Decide whether the guest Stories add-on should be paid at all.**
6. **Confirm the paid planner's paywall and per-event pricing are meant to be selling** — both
   were switched on by hand and are live and charging.
7. **Switch the guests' gift page on, or accept the copy fix.** Our own launch notes record this
   as done; it is not.
8. **Paid full-resolution preservation stays off** — correct as-is. If ever switched on, one line
   of its copy still says three months where the real clock is six.

⚠ **Every app-side switch is baked in when the site is built.** Changing one needs a redeploy,
not just a save.

---

# ALREADY SHIPS — DO NOT BUILD ANY OF THIS

**This is the most valuable list here.** Rebuilding these is the mistake this project has paid
for more than once.

- **The supplier's Agree / Decline on a booking, with notifications both ways.** It is built
  under the word **DEPOSIT**, not "lock request" — which is exactly why searching the obvious
  words finds nothing and it keeps getting reported as missing.
- Chasing a supplier who sits on an enquiry — automatic after 48 hours.
- Booth-reel rendering **and** the "your reel is ready" email, with a real download link.
- Three working ways to go on air with no Setnayan channel.
- The host's "we are live" switch.
- The Live Venue Photo Wall, end to end.
- One shared web-address name list across weddings, shops and people.
- Thirteen on/off switches for the after-the-wedding page plus Public / Unlisted / Private,
  defaulting to Private.
- A coordinator only gets in when the host says yes — **all three** routes.
- The Papic credit ladder and unlock bundles.
- Custom song, thank-you video, photo messages, video greetings — all four sell **and** deliver.
- 3D plan, Website PRO, the animated monogram, the paid planner, custom QR.
- Vendor plans and every paid add-on, including admin approval.
- Retired products are genuinely unbuyable — one central refusal before the price is resolved.
- Livestream camera passes do **not** lose the time of day.
- Saving an LED design works and is properly private.
- The supplies marketplace is honestly labelled and cannot charge anyone.
- Login-free live-camera join — finished, switched off.

---

# WHERE THE FIRST PASS WAS WRONG

Recorded because the corrections are the most reusable part of this exercise.

1. **"Nobody who buys Live Studio can go on air."** False — three broadcast paths ship and work.
   Acting on it would have **deleted working code.**
2. **"The coordinator approve path files nothing and hands access over in one tap."** False on
   both halves — a per-area decision record with the decider is filed and reaches the couple's
   data export, and the host answers each area separately. Real gap is only the disclosure.
3. **"A forged wedding-day announcement reaches every guest's phone."** False — guests see no
   sender at all. A different, real issue surfaced instead: the guest-facing announcement is
   read without checking that feature's privacy control.
4. **"Add the onboarding rate limit to the photo-crew claim screens."** Would have **cut off the
   sixth crew member at every wedding**, because a venue shares one connection.
5. **"Linking the printable camera sheet is a one-hour job."** It prints cards for the old model.
6. **Our own launch notes are wrong in at least two places** — the gift-page switch is recorded
   as set and is not, and the bot check is claimed wired into every sign-in form when
   forgot-password is not wired at all. **Treat the notes as claims, not evidence.**
