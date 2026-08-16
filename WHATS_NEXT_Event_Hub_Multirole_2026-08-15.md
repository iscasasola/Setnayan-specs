# WHATS NEXT — The Event Hub for all four roles (scoped 2026-08-15)

> Owner, verbatim: *"all events will have an event hub where each assigned vendors, host,
> guest, coordinator will have their specific features."*
> Read-only page for the owner: <https://claude.ai/code/artifact/1409a5d0-c9d2-4bf0-9df7-2159080bb054>
> Naming context: [`DECISION_LOG.md`](DECISION_LOG.md) 2026-08-15 (PR #4444, the rename).

⚠ **NOTHING HERE IS BUILT.** This is a scope, not a handoff of work in progress.

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

1. **A booked supplier becomes a linked account, not a name in a list.** Populate the vendor
   link on booking + a couple-side invite for off-platform suppliers.
   **FIRST — everything else has nobody to serve.** medium · no owner ruling needed.
2. **"You are booked here" appears and opens their tools.** The strip already exists and has
   **never once rendered** (reads the empty link). Must also work on a PRIVATE event — most
   prod events are private, where a booked supplier currently hits the lock screen.
   small · needs 1.
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
