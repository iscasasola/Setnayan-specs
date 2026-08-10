# The sessions — numbered, in order, against the owner's four launch criteria

**Date:** 2026-08-11. Companion to `THE_PLAN_2026-08-11.md`. The owner set the launch bar:

1. **A couple can already start collecting their memories.**
2. **Vendors can start importing their customers.**
3. **Our in-app services are well running.**
4. **The public website is easy to navigate around.**

Every session below is tagged with which criterion it serves. **Launch is S1–S8.**
Everything from S9 down is post-launch.

---

## 🚨 FIRST — a live blocker found while checking criterion 2

**A vendor's invite QR sends the couple to a "page not found" today. Every vendor. Including
the owner's own approved shop.**

Two different columns both mean "this shop is live," and they are set by different things:

| | Set by | Used by |
|---|---|---|
| the **visibility** column | ✅ the admin approval screen | the public Explore listing — **works** |
| the **published** column | ❌ **only a tick-box buried on a deep admin edit page.** Approving a shop does **not** set it | the vendor's own invite page (`notFound()` if false) **and** the public read rule on vendor records |

So approving a shop makes it appear in Explore, and leaves its invite QR dead. The vendor
dashboard's own code says it plainly: *"the owner's own fully-verified shop sits at
published = false today."*

**This is criterion 2. A vendor cannot import a single customer until it is fixed** — and it is
the same illness as the outage on 9 August, where two definitions of "is a vendor" made a
signed-in account unloadable.

⚠ It also means the public read rule on vendor records is keyed to a column nothing in the
approval flow sets — so anything reading vendors as a stranger sees nothing.

---

## LAUNCH · S1–S8

### S1 · The owner, one sitting — **not an engineering session**
*(serves all four)*

Read the live switch values in the hosting dashboard. Almost every "built but switched off"
claim is what the code falls back to, not a reading of production — **ten minutes settles about
forty-five items.** Then open the app on a real phone, signed in.

**Decide, in the same sitting:** payment gateway yes/no (it disposes of two large builds) · does
a booking need a payment before it locks · six tabs or five in the planning phase · what a
person's public handle looks like · do wedding addresses become permanent the way shop addresses
did · which photo switches go on.

**Start these clocks the same week — they run while we build:**
the Google sign-in resubmission (**the two pages it was waiting on have both shipped**) · counsel
for the fifteen filings and twelve unsigned data agreements · the child-safety provider and its
regulator agreement · the Meta business setup (~30 min) · the paid-hosting
decision (**there are no automated database backups on the free plan**).

> ### ✅ ANSWERED 2026-08-11 — three fewer things to decide, and one earlier call flipped
> - **PayMongo is next year; the manual rail with per-order QR is V1's model.** The
>   payment-gateway application is **struck from the list above** — there is no clock to
>   start. ⚠ **This FLIPS an earlier call:** the bank-inbox matcher (#86) was deferred
>   *because a gateway might make it unnecessary*. It will not land for a year, so its
>   deferral now rests on **order volume** instead — an admin pasting a bank alert into a
>   box is fine at zero orders and becomes the bottleneck at real ones. Automatic
>   subscription billing (#69) is deferred a year for the same reason.
> - **We do NOT own `setnayan.ph`** — struck from the list above too. It was never ours to
>   confirm; the code repo's auto-loaded instructions claimed it for months. Unregistered
>   means anyone can take it, so *buying* it is an open call, not an errand.
> - **The phone bar may hold six, and six is the ceiling.** The phase-swapping bar stays;
>   the handoff's fixed five-tab strip is not adopted. ⏭ The work is the instruction
>   attached to the number: **every tab must justify its slot**, and phone and laptop must
>   stop calling the same thing by two names (phone *Explore* = laptop *Marketplace*).
>
> ### ▶ S2 IS BUILT — PR #4340, auto-merge armed
> One definition of "this shop is live". The invite QR, its claim action, the couple's
> add-a-vendor-by-name search, ghost-listing detection, fraud detection, the admin
> population count and the admin Published tab all asked a **dead column** that the
> approval flow never sets. Nothing was loosened — an unapproved shop still 404s.
> Guarded by `one-definition-of-live.test.ts`, three mutations each verified applied
> before the red was trusted.

---

### S2 · **A vendor's invite actually works** ⬅ **START HERE — needs nothing from the owner**
*(criterion 2, and part of 4)*

- One definition of "this shop is live." Approving a shop sets everything approval means.
- The invite landing page stops 404-ing on a column approval never writes.
- The public read rule on vendor records re-keyed to the same one thing.
- Walk it end to end as a real couple: scan → sign up → the vendor lands on their shortlist.
- The greeting-video page — the last product page with no way in from anywhere.

**Why first:** it is the only thing standing between a vendor and their first customer, it needs
no decision, and it is one bug, not a feature.

---

### S3 · Nothing on sale that we cannot deliver
*(criterion 3)*

Per product, **build it or de-list it — both pass.** De-listing takes minutes.

- **Thank-You Video ₱2,499** — the render queue already exists and **its own note names this
  product as one of the things it was built for**; two products already ride it. Another film on
  a moving line, or off sale.
- **LED backdrop** — the table that records a finished file exists with nothing writing to it.
  Build the worker and the hand-over, or remove the "included" claim from the animated monogram.
- **Custom web address ₱999/yr** — owner ruled **off sale**. A deactivation.
- **Supplies shop** — hide the tile now; the products and pricing engine shipped in May and the
  real build is gated on supplier agreements you sign.

### S4 · Livestream — build, then rehearse once
*(criterion 3)*

The printable camera hand-out on the current control screen → the host's "we are actually live"
switch (today a relative overseas sees a pulsing WATCH LIVE over a dead player) → camera-pass
dates stop throwing away the time of day (**test under Manila time**) → **one real rehearsal**,
which also settles the seven leftover livestream notes. ⛔ Deleting the old code comes later and
only after a real broadcast — the old tree holds the only printable hand-out.

### S5 · The flip session — one redeploy
*(criteria 1 and 3)*

Vendors listing packages · the per-service detail sheet (ruled on) · whichever photo switches the
owner picked · a camera helper shooting without signing in · "you're fully booked — upgrade"
instead of a raw error · blocking known-stolen passwords.
⚠ **Bot protection is separate and its order is incompressible:** key + redeploy → widget on the
two photo screens → **only then** enforce.

### S6 · Memories, safely
*(criterion 1)*

- Which chapters of the gallery strangers see — **nothing anywhere stores that a chapter is held
  back**, so this is free only while there are no photos.
- The phone photo wall obeys the wedding's own setting and can be switched off.
- A guest's photo download stops silently at 500 — say so, or page through everything.
- Guests who paid for their own shots get warned before compression.
- "Delete a photo" means delete everywhere (the owner's ruling, still unbuilt).

### S7 · Who says yes before a booking
*(criteria 2 and 3)*

The supplier agrees or declines — **the database half shipped with nothing calling it**, so this
is screens only: the couple's ask, the agree/decline page, the reminder, the seven-day expiry.
The two coordinator access paths merge onto *the host approves*, and "coordinator proposes"
retires in the same change. Plus the integrity hole nobody scheduled: **a couple can post a
message on their own event dressed up as coming from a supplier.**

### S8 · Names, addresses, and the ops floor
*(criterion 4, plus safety)*

One shared name list across weddings, shops and people (**7 names, zero collisions — nearly free
now, a data migration later**) · our own page names stop being claimable · a retired address stops
returning to the pool · capitalisation and punctuation stop opening duplicate pages.
Plus four leaky internal summary views and two views that ignore the per-row rules — six small
changes, not a project.
**Owner's ops floor:** backups off the free tier · an uptime monitor · **press the button that
proves a production error reaches an inbox — it has never been pressed** · confirm upload
permissions on all five storage buckets · the money landing in a business account.

## 🚩 LAUNCH AFTER S8

---

## POST-LAUNCH · S9–S33

| Sessions | What | Notes |
|---|---|---|
| **S9–S18** | **The screen sweep** — 112 hand-drawn headings (**76 couple · 27 admin · 9 vendor**, the same files each redesign opens), the couple's daily screens, the vendor dashboard, the one unused "couldn't load this" screen, 115 duplicated rules, the sign-in family, the four undrawn surfaces | 🔒 Reconcile, never redraw. Walkthroughs last — tours of screens about to change are authored against dead layouts. |
| **S19–S21** | **Narrowing the database read keys** — 314 areas, **a few at a time, never in bulk** | ⚠ The session-secret extraction must NOT run under the sweep. ⚠ Browser-injection enforcement needs an origin audit first — switching it on today silently kills the video shrinker and probably the face-model files. |
| **S22–S25** | **Vendor growth** — market intelligence (all reusing the same pricing/demand maths and the same thin-sample privacy rule), copying a service card, two more team roles, the emcee's questionnaire, the keepsake byline, stale-conversation nudges | ✅ Founding-supplier marking shipped; the vendor's own-captures strip exists and only needs a door on other days. |
| **S26–S27** | **Guest side** — their own 3D character, guests reviewing a vendor, requesting a song from their phone (**the whole data layer ships — only the button is missing**), the guest site's empty-state words | |
| **S28–S32** | **The singles** — splitting one payment, asking key people which dates they can make, a taste profile across events, finishing the 3D venue, featuring a real wedding, the photographer's bulk hand-over, per-product listings, image sizing and per-view re-processing, the offline policy, seat-plan groups, translation (⚠ **the machinery exists** — extend, do not build) | Schedule individually by value. |
| **S33+** | **The internal console** — ~107 screens into one shape | The enumeration itself says "genuinely last." Invisible to customers. |

---

## Do not schedule — decide or confirm dead first

The reservation layer and the souvenir template library (**both premises retired** — tokens, and
a render path no longer used) · the bank-inbox matcher and automatic vendor billing (**both
gateway-blocked**) · the ads screen (unmade create-vs-report decision, no account access) ·
Market Scan (needs a price, a privacy control and a legal look) · real Filipino photography
(needs real weddings or a budget) · managing another person's account and the family layer (**a
lawyer before a line**) · free-trial abuse checks (waiting on an unsigned privacy approval) ·
**paid preservation — parked by the owner on 7 August, and a purchase card already exists** ·
bridal-fair pages, public supplies browse, text messages, the public developer interface, paid
promotion.

---

## The count

| | Sessions |
|---|---|
| Owner's own sitting | 1 (ten minutes) |
| **Engineering to launch** | **7 (S2–S8)** |
| Post-launch | ~25 |
| **Total if everything is built** | **~33** |

**Launch is seven working sessions away, not thirty** — provided each unsellable product is
either built or de-listed, which is a product call, not an engineering one.
