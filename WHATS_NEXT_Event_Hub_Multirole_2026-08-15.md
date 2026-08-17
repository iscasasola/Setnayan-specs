# WHATS NEXT — The Event Hub for all four roles (scoped 2026-08-15)

> Owner, verbatim: *"all events will have an event hub where each assigned vendors, host,
> guest, coordinator will have their specific features."*
> Read-only page for the owner: <https://claude.ai/code/artifact/1409a5d0-c9d2-4bf0-9df7-2159080bb054>
> Naming context: [`DECISION_LOG.md`](DECISION_LOG.md) 2026-08-15 (PR #4444, the rename).

🛑 **"NOTHING HERE IS BUILT" WAS WRONG — CORRECTED 2026-08-17 BY THE OWNER.**
He read a register built on this document and said: *"we already have an event website before.
that is the event hub. it was already built."* **He is right.** Re-measured against shipped code:
the event website is **15 routes**, the *"You are booked here"* strip **ships** (last touched
2026-08-03), and the link it reads is **stamped automatically at lock** — the lock payload writes
it and its own comment records that gap being closed on **2026-06-19**.

🔑 **THE STRIP HAS NEVER RENDERED BECAUSE NOBODY HAS BOOKED A MARKETPLACE SUPPLIER — NOT BECAUSE
A WRITER IS MISSING.** 44 of 45 rows are names typed into a list; the 45th is a **test row seeded
straight into the database** (*"(SONGDESK TEST)"*), never booked through the screen that stamps.
**Slices 1 and 2 below are therefore the wrong shape and must not be built as written.**

⚠ **This is the trap this file already warned about, one level up.** It closes with *"a demo will
look fine and prove nothing"* and *"every behavioural claim is a claim about code" — then made a
claim about code it had not checked.* An empty column was read as a missing mechanism.
**ZERO ROWS MEANS NOBODY HAS DONE IT YET; IT NEVER MEANS THE CODE IS ABSENT.** Grep for the
writer before scoping a build around its absence.

---

## 📖 SETTLED VOCABULARY (owner-locked 2026-08-16) — do NOT reopen

| Word | What it is |
|---|---|
| **Event Hub** | The event's ONE public address, **for the whole life of the event** (`/{slug}`). Four stages: save-the-date → invitation + RSVP → **the day itself** → the story and album after. |
| **Live hub** | A **fullscreen page INSIDE the Event Hub** (`/{slug}/hub`). Its entry chip exists **only** while `dayOfPhase` is `live` or `post`. A separate route you open from the page and close back out of — never a second product, never a "mode" of the website. |
| **Event Hub Pro** | The paid upgrade (`COUPLE_WEBSITE_PRO`, ₱3,500) — premium touches on the Event Hub. |

🔑 **WHAT IT IS FOR — owner, verbatim (2026-08-16):** *"where the event proper runs. not the
preparation. this is where we share information to the guests, vendors, etc. where we collect
photos, and use different services, this is where we have the papic and live studio."*

**Measured against shipped code: 3 of those 4 are already true.** Guests ✅ · photo collection
via Papic ✅ (capture + the guest's own photos render on `/{slug}` itself) · Live Studio ✅
(`WatchLiveBlock` on `site-body.tsx`) · **vendors ❌.** The one vendor element on `/{slug}` is a
*"you are booked here"* strip that links them **away** to `/vendor-dashboard`, and it reads
`linked_vendor_profile_id` — **0 of 45 prod rows** — so it has never rendered for anybody.
**That gap is this document.**

⛔ **CONSIDERED AND REJECTED: "Event Hub = only the day."** It matches the owner's *"not the
preparation"* instinct, and was still rejected: **the guest keeps ONE link across all four
stages** — it arrives on the save-the-date, takes their RSVP, opens at the venue, and holds the
photos afterwards. Splitting the name at the day turns one link into two products in the
guest's head and leaves save-the-date + RSVP unnamed. **"Where the event proper runs" is the
Event Hub's most important STAGE, not a separate thing.**

⚠ **"Controller" is wrong TODAY, right for the FUTURE.** The Event Hub is a **place people
visit**, not a control panel — the host's presence on it is a **read-only** ribbon, and every
real control lives in `/dashboard/[eventId]`. It only becomes controller-shaped after the
slices below.

---

## 🔴 THE MEASUREMENT THAT REORDERS THE WHOLE BUILD

Read from **live prod** on 2026-08-15 (not from a doc, not from a migration):

| | |
|---|---|
| events | **6** · guests **39** |
| `event_members` | **6 rows, ALL `member_type='couple'`** — no guest, vendor or coordinator is an event member as DATA |
| `event_moderators` | 3 total, **2 accepted** — one `groom`, one `wedding_planner_external` |
| `event_vendors` | **45** rows → 32 `considering` · 10 `contracted` · 3 `deposit_paid` = **13 booked** |
| `event_vendors.linked_vendor_profile_id` | **0 of 45** |
| `event_vendors.marketplace_vendor_id` | **1 of 45** (that one is `contracted`) |
| `vendor_profiles` | 2, of which **1** published |
| `chat_threads` with an `event_id` | **0** |

🔑 **TWELVE OF THIRTEEN BOOKED SUPPLIERS ARE NOT SETNAYAN ACCOUNTS AT ALL.** They are names a
couple typed into their own vendor list. **You cannot give features to somebody who is not
there.** Any plan that starts by building the shared space builds a room with one occupant.

⚠ **CORRECTS AN EARLIER AGENT CLAIM** that said *"only `marketplace_vendor_id` is populated"* —
it is populated on exactly **one** row. 44 of 45 carry neither link.

---

## WHAT ACTUALLY SHIPS PER ROLE

| Role | One shared space? | Reality |
|---|---|---|
| **Guest** | ✅ **YES** | `/{slug}` + its sub-routes genuinely is one per-event space — RSVP, seat, walk-to-table, programme, livestream, their tagged photos, keepsake reel, day-of hub. |
| **Host** | ⚠ **A RIBBON** | Every tool is at `/dashboard/[eventId]/*`. On `/{slug}` the owner gets a **read-only** 5-link ribbon — and with no guest cookie the BODY is the anonymous one, so the host's own page tells them to *"scan your personal QR."* |
| **Vendor** | ❌ **NO** | A genuinely good per-event workspace exists — brief · headcount · meal splits · timeline · quotes · payments · contracts · hand-overs · mood board · seat COUNTS · production sheet · day-of console — but it lives under `/vendor-dashboard/*`. `/dashboard/[eventId]` hard-404s any non-`couple`. |
| **Coordinator** | ❌ **SPLIT IN TWO** | *Delegate* (accepted moderator) gets the couple's whole planning shell. *Booked supplier* gets the vendor console. The halves do not connect, and which you get depends on which of two unrelated identities you hold. |

---

## 🔑 THE ARCHITECTURE ALREADY SUPPORTS THIS — DO NOT REBUILD THE PAGE

`app/[slug]/_lib/site-identity.ts` declares `SiteIdentity = AnonymousSiteIdentity |
GuestSiteIdentity` — **exactly two tiers** — and its own docblock states that **owner-ness is
ORTHOGONAL to the identity tier, a SEPARATE, ADDITIVE `OwnerCapability`.** A vendor grant is
already resolved the same way (`resolveVendorCapability`).

**So the extension path is capability LAYERS on the existing page, not a new identity tier and
not a new surface.** The owner ribbon is the proof the pattern works. **A plan that redraws
`/{slug}` per role is the paid-twice mistake at its largest scale.**

---

## THE SLICES (order is real — each needs the one before)

1. ~~**A booked supplier becomes a linked account, not a name in a list.** Populate the vendor
   link on booking…~~ 🛑 **STRUCK 2026-08-17 — HALF OF THIS ALREADY SHIPS. DO NOT BUILD IT.**
   Locking a **marketplace** supplier already stamps the link (fixed 2026-06-19). Nothing to
   populate. The only real half left is **inviting an OFF-PLATFORM supplier onto Setnayan**,
   which is **OWNER_DECISION 4 below, not an engineering task.**
2. 🚨 **THE ONE REAL DEFECT, AND IT IS AN ORDERING FIX, NOT A SLICE.** On a private event the
   page refuses a booked supplier **before it ever asks whether they are booked** — the lock
   screen admits a redeemed guest, a host, a seat-holder and an invited account, and a supplier
   is none of the four; the supplier check runs ~200 lines later and is never reached.
   **4 of 6 prod events are private.** small · **needs nothing before it.**
   ⚠ The strip itself is BUILT and correct — do not redraw it.
3. **The host sees their own event page as themselves.** Add an owner body variant; today they
   fall through to `renderAnonymous()`. medium.
4. **One "who is in this event" view.** Today guests · hosts · access-requests · vendors ·
   manpower are five separate routes. medium.
5. **The coordinator stops being two products.** Fix the ribbon's *"Edit this site"* dead end
   (it lights up for coordinator + moderator; the editor gates `couple`-only) and let a BOOKED
   coordinator announce without promotion. medium · **needs OWNER_DECISION 2.**
6. **A vendor-skinned view of the event itself.** The real shared space. large ·
   **BLOCKED on OWNER_DECISION 1.**

---

## FIX REGARDLESS (independent of all six)

- 🚨 **The run-of-show "start next" control lies.** Shown to every booked vendor; only a
  coordinator is authorised, and **the refusal is swallowed with no message.** Embarrassing on
  the day.
- 🚨 **The shot list is advertised as *"syncs to the couple"* and is browser-local only.** So is
  the coordinator's issues log. Neither ever reaches the couple or survives a device change.
- The day-of live console opens **only on the exact booked date** — no rehearsal, no wrap-up.
- Per-category specialisations (song desk · script & cues · floor command) sit behind a **paid
  tier every prod vendor lacks**.

---

## ⚖ OWNER DECISIONS — do not decide these in engineering

1. **How much of the couple's private plan may a booked supplier see?** Today it is COUNTS,
   never guest names — deliberate and currently absolute. Blocks slice 6.
2. **May a booked-but-never-promoted coordinator broadcast to guests?**
3. **Should the day-of specialisations be free during launch?** No real supplier can reach them.
4. **Should couples be able to invite off-platform suppliers onto Setnayan?**

---

## 🪤 TRAPS

- ~~**"Event Hub" now names THREE things** … needs one meaning to win BEFORE the build.~~
  ✅ **CLOSED 2026-08-15 — PR [#4480](https://github.com/iscasasola/setnayan-platform/pull/4480).
  I OVERSTATED THIS AND IT WAS NOT AN OWNER DECISION.** Measured: the paid SKU is unambiguous
  (*Event Hub PRO* reads clearly against *Event Hub*), and `/{slug}/hub` said "Event Hub" only
  in a **fallback** state — in every state a guest meets it (*Almost here* · *Happening now* ·
  *Just wrapped*) it said something else. Two strings and four aria-labels, not a competing
  product name. 🔑 **And that screen already had its own visible name — the chip says
  "Live hub"** and always did; only the tab title and the accessible labels had drifted, so the
  fix APPLIED the visible name rather than inventing one.
  **Settled vocabulary: Event Hub = the event's space · Event Hub PRO = the paid upgrade ·
  Live hub = the fullscreen day-of view inside it.**
  ⚠ **The lesson is the flag, not the fix:** I raised a "decide this before building" trap
  without first measuring how wide it was, which would have cost the owner a decision he never
  needed to make. **Measure the collision before escalating it.**
- **A demo will look fine and prove nothing** — exactly one supplier account is linked to
  exactly one event.
- **Nothing here has ever met a real person.** No guest, vendor or coordinator is an event
  member in prod. Every behavioural claim is a claim about code.
- **Guest names have never crossed to a vendor.** A shared space is precisely the change that
  erodes that by accident.

See [[project_setnayan_event_hub_rename]] · [[project_setnayan_guest_doors_are_not_dashboards]].
