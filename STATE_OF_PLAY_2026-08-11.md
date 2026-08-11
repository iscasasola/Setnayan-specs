# Setnayan — state of play, 11 August 2026

> **Written for a cold start on a different Claude account.** Memory does not travel
> between accounts. Everything needed is in this file or in the repo it points at.
>
> **Read the ⚠ lines.** Each one records something that already cost real time or money.

---

## 0 · The one rule that saves the most money

**FIND IT BEFORE YOU BUILD IT.** This project is ~2 years old. Almost nothing asked for is
new. **Today alone, seven things reported as "missing" turned out to already ship** — the
vendor invite flow, the wedding-website manager, the storyteller layer, the coordinator
channel, the four home areas, samahan, and the render engine.

The corpus records the owner **paying twice for one page**. Before writing anything: search
the code for the feature's noun, and check the live site. **A document is not evidence.**

---

## 1 · What is live right now — verified 2026-08-11

| | |
|---|---|
| Site | `www.setnayan.com` — Vercel, auto-deploys from `main` |
| Database | Supabase, **Singapore** (free plan) |
| Storage | Cloudflare R2, Asia-Pacific — 5 buckets |
| Events | **5** |
| Vendor shops | **2** — only **1** publicly visible |
| Photos captured | **0** |
| Storyteller videos | **0** |
| Published articles | **32 live** (82 written) |
| Booking-fee charges | **0** |
| Livestream channels | **0** |

**Nothing is live to a stranger yet.** That is the single most useful fact in this file:
almost every change is still free. After the first real customer, several become a migration
and an apology.

### Switches, read from production today

**ON:** connections + family tree (owner/DPO ruling — see §5) · the host's shots-remaining
meter · the shared photo gallery · guest buying shots · photo missions · camera helpers
without signing in · vendors listing packages · per-service detail sheets · booking-fee
switch **1 of 2** · anonymous onboarding.

**OFF:** the second booking-fee switch (**so nobody has ever been charged**) · the e-gift
route · the assisted planner's paywall (it is free) · bot protection (no key set) · Google
and Bing site verification (no keys) · child-safety image matching.

⚠ **Nine things our notes called "off" were actually ON.** The notes were wrong, not the
site. **Read the hosting dashboard, never a document.**
⚠ **Environment variables inline at BUILD time.** Changing one does nothing until a rebuild.
⚠ **Feature switches must be added `--no-sensitive`**, or they cannot be read back and
nobody can ever audit them.

---

## 2 · BEFORE LAUNCH

> The test is **not** "everything is built." It is: **nothing is on sale that we cannot
> deliver · nobody is misled · nobody is locked out · nothing about a real person is
> exposed.**
>
> 🔑 **Every unbuilt product on sale has a minutes-long de-list fallback.** Taking a thing
> off sale passes the test exactly as well as building it.

### Step 1 · The owner, one sitting *(not engineering)*

- **Look at the app on a real phone, signed in.** Last time: three real defects in ten
  minutes, all green in every automated check.
- **Answer:** should the add-ons rail sit on the event overview or behind a tab · does the
  wedding-page restyle exclusion still stand (see §6) · require a payment reference on the
  four pay-Setnayan forms?
- **Start these clocks the same week — they run without you:** the lawyer (privacy filings +
  twelve unsigned data agreements) · Google sign-in resubmission (**both pages it waited on
  have shipped**) · the child-safety image provider · Meta business setup (~30 min) ·
  **paid hosting — there are NO automated database backups today**, on a database holding
  every couple's guest list, payments and photos.

### Step 2 · Nothing on sale that does not exist *(2–3 sessions)*

| Item | State |
|---|---|
| **Thank-You Video ₱2,499** | ✅ **BUILT TODAY** — pending merge (§4) |
| **Custom web address ₱999/yr** | ✅ **Taken off sale today** — no address ever resolved |
| **LED backdrop** | ❌ **Still open.** Saves a design, never makes a file. The table that records a finished file exists with **zero writers**. Build the worker, or remove the claim from the monogram's description |
| **Supplies shop** | ❌ Placeholder products; checkout deliberately disabled. Copy now says so. Real build is **gated on the owner signing supplier agreements** |
| **Livestream ₱2,999** | ❌ Never run. Needs: the printable camera hand-out ported to the current screen → a host "we are live" switch → camera-pass dates stop dropping the time of day → **one real rehearsal**. Only then delete the old code |

### Step 3 · Flip what is finished *(half a session, one redeploy)*

Blocking stolen passwords (one switch in the database console) · **bot protection** —
⚠ **strict order: set the key and redeploy FIRST, then add the widget to the two photo
screens, then enforce.** Any other order and real people get rejected.

### Step 4 · Who says yes before a booking *(2 sessions)*

**The supplier is never asked to agree.** The database half shipped and **has zero app
consumers** — this is screens only: the couple's ask, the supplier's agree/decline, the
reminder, the seven-day expiry. Merge the two coordinator access paths onto *the host
approves* in the same change. Plus one integrity fix: **a couple can post a message on their
own event dressed up as coming from a supplier.**

### Step 5 · Names, addresses, gallery defaults *(1–2 sessions)*

One shared name list across weddings, shops and people (**7 names in use, zero collisions —
nearly free now, a migration later**) · **which gallery chapters strangers see** (nothing
stores this today — free only while there are no photos) · **the phone photo wall ignores the
wedding's own setting and cannot be switched off**.

### Step 6 · The ops floor *(owner errands, but on the path)*

Backups off the free plan · an uptime monitor · **press the button that proves a production
error reaches an inbox — it has never been pressed** · confirm upload permissions on all five
storage buckets · **money currently lands in a personal account** (mayor's permit + trade-name
amendment sit behind this).

### 🚩 LAUNCH AFTER STEP 6

~~**Also pull above the line — four small REVOKEs:** four internal summary views and two
database views are readable by anyone. Six small changes, not a project.~~

✅ **DONE 2026-08-11 — and the count above was wrong in both directions.** Checked against
the live database instead of this file. **The tool used for the first check could not see
half of what it was checking** — one kind of database view is invisible to it — so it
reported four things when there were eight. What was genuinely wrong was smaller and more
specific than "six views are readable":

- **One number a stranger should never have seen.** Each shop has two versions of its
  "weddings completed" figure: the public one, and an internal one that still counts
  bookings we filtered out as self-dealt or fraudulent. **Both were public.** Subtract one
  from the other and a stranger reads our own fraud findings about that shop. Now private.
  Nothing on any screen changes — the internal figure had no reader at all.
- **A shop banned for fraud kept its list of past jobs on show.** Voiding those jobs
  correctly removed them from the *count*, but not from the dated *list* sitting right
  beside it on the same page. Not reachable today (a banned shop is hidden in the same
  step), so this was fixed as a latent fault, not a live one.

🛑 **Two things that LOOK like serious leaks and must NOT be "fixed".** One view exposes
every private field of every event — birth dates, budgets, addresses, love stories — and is
**correct**: it does its own permission check internally. Changing it breaks every couple's
dashboard. The other must keep its current setting or the public shop page goes blank.
🔑 **Reading how each one actually works, before reporting it, is the only reason the first
was not raised as an emergency.**

---

## 3 · AFTER LAUNCH

| Block | Size | Notes |
|---|---|---|
| **The porting backlog** | **6–10 sessions — the biggest block** | ~40 screens got the new palette and **never the new layout**. 112 screens also hand-draw their own page heading — measured as **76 couple · 27 admin · 9 vendor**, the *same files* each redesign opens. **One pass, not four.** This is what the owner sees when he says a screen "doesn't look clean" |
| Database read-key narrowing | 2–3 | 314 of 396 areas hand a stranger a key nothing needs. **A few at a time, never in bulk.** ⚠ Browser-injection enforcement needs an origin audit first — switching it on today silently kills the video shrinker |
| Vendor growth tools | 3–4 | Market intelligence, copying a service card, two more team roles, the emcee's questionnaire |
| Guest side | 2 | Their own 3D character, guest reviews, song requests (**the whole data layer ships — only the button is missing**) |
| **Discovery holes** *(new, verified today)* | small | **No public account search exists anywhere**, and **person pages are missing from the sitemap** so Google cannot see them. Vendors and weddings both have one — copy it |
| The internal console | large | ~107 screens. The enumeration itself says "genuinely last" |
| Genuine singles | 4–6 | Splitting one payment, asking key people which dates suit, the photographer's bulk hand-over, per-view image re-processing (**bills per view; grows with real galleries**), translation (⚠ **the machinery EXISTS** — 59 phrases, 3 screens — extend, do not build) |

### Do not schedule — decide or confirm dead first

The reservation layer and the souvenir template library (**both premises retired**) · the
bank-inbox matcher and automatic vendor billing (**both gateway-blocked; PayMongo is next
year**) · the ads screen · Market Scan · managing another person's account (**a lawyer before
a line**) · bridal-fair pages, public supplies browse, text messages.

---

## 4 · What shipped today

| PR | What |
|---|---|
| **#4340** ✅ | **One definition of "this shop is live."** A vendor's invite QR **404'd for every vendor** — including the owner's approved shop — because seven code paths gated on a column the approval flow never sets. Fraud detection and ghost-listing detection were scanning an **empty set** and reporting "nothing found" |
| **#4341** ✅ | **Stop selling what we cannot deliver.** Subdomain off sale; the monogram stopped promising an LED file that cannot be made; the supplies page stopped telling couples to tap a checkout that does not exist. ⚠ **Deactivating a SKU alone would have been a no-op** — the machine-readable file AI assistants read would have kept advertising it |
| **#4347** ✅ | **The People page stopped hiding samahan** behind a coming-soon preview. It told users with samahans "there's nothing to do on this page yet" |
| **#4342** ✅ | **The Thank-You Video is real** — ₱2,499 with nothing producing it. Renders in the couple's browser. *Merged 2026-08-11 after a second font flake was re-run* |
| **#4348** ✅ | **The home board is reachable.** A couple with one event was bounced out of it and Home bounced them back — **permanently, including after the wedding.** So Alaala, People, Samahan and the Creator's Lab did not exist for the core persona |
| **#4343–#4346** ✅ | **Papic became ONE product** — one credit ladder, dedicated shots are a floor not a ceiling, a clip costs what its length costs, and the retired product left the building |
| **#4349** ⏳ | **A number no stranger should have seen** — see the corrected launch-line note in §2 |

⚠ **Three CI failures today, three different causes — two flakes and one real.** #4342 first
failed on a **real** miss (a new Studio card with no peak-month classification — the drift
guard caught it), then failed again on a **font download**, which is an outage on Google's
side and not a defect. #4348 was the same font flake. **Read the failure before fixing
anything — two of these three needed no fix at all.**
🔑 **The font flake is worth watching, not yet worth fixing:** the build fetches its typeface
from Google at build time, so an outage there fails our build. It has now cost three runs in
one day. It would also fail a **production deploy** the same way.

---

## 5 · Compliance — one thing genuinely owed

**The owner, who is the registered DPO, switched the connection tree and the family tree ON
in production today**, reversing his own decision of a few hours earlier. It was put to him
in writing with four options; he chose *"turn both on now — my call."*

🔴 **What is now owed, and is still cheap:** his own compliance file has a task saying *"if
these are on, add the minors and sensitive-data processing to the record."* **The answer is
now yes.** All three tables held **zero rows** at the moment of the flip, so updating the
filing costs a paragraph today. **After the first real family record it is a filing, an
assessment and an apology.**

Also open: fifteen privacy filings (six blocking) · twelve unsigned data agreements ·
the minors assessment marked *"counsel-first, before any build."*

---

## 6 · Design — where it stands

**Three prompts are written and ready** in `CLAUDE_DESIGN_PROMPTS_2026-08-11.md`. Send each
as its **own conversation**:

1. **The public site and the app as one product** — the front door, and the **seam nobody has
   ever drawn** (the 8 Aug bundle drew the app; the front door was drawn 11 Aug by a separate
   pass; neither contains the other).
2. **The Papic control room** — 20 cards in one scroll. The only surface with no drawing.
3. **One person, many hats** — private collection → public presence, and being findable.

**Already drawn and approved — do NOT ask again:** app shell · invitation + wedding website ·
signed-in home + event dashboard (with a per-widget deep dive) · vendor shop · vendor
dashboard · admin console · marketplace · the booking flow · 12 archetypes + 7 overlays.
Committed in `design_handoff_setnayan_redesign/` and `design_handoff_frontdoor/`.

⚠ **A previous design bundle existed only in a chat window and was LOST.** That is exactly
why one screen shipped with menus and no layout. **Always ask for a downloadable bundle, and
commit it to the repo the day it arrives.**

### Rulings made today

Front door: **YouTube-shaped, sidebar on the LEFT** (overrides the bundle's own "never left"),
keeps **its own look** — gold `#8C6932` buttons and its own typeface, **this page only** ·
signed out, **"My Home" becomes the sign-in** · the home board is **the collection of events,
ongoing and completed** · the phone bar holds **max 6** tabs, each justifying its slot ·
**the Papic control room does not move** — it stays in the event's Studio.

### 🚩 Still unsettled

The 8 Aug bundle says the **wedding/guest pages are deliberately EXCLUDED** from the restyle.
The owner's complaint that the wedding page "still not proper to look at" contradicts it.
**Nobody should port that page until he says which stands.**

---

## 7 · Traps that have each cost real time

1. **A rejected query is not a thrown error.** A phantom column, a phantom enum value, a
   phantom function argument, a blocked iframe, an unresolved storage reference, **and a dead
   feature gate** all fail the same way: the read is refused, and **the only symptom is an
   absence.** Assume there is another one.
2. **A status code is not a page. Read the body.** A 200 was once the not-found page.
3. **`count === null` means "not measured", not "zero."**
4. **Environment changes need a rebuild.** They inline at build time.
5. **A guard needs three edits to be wired into CI** — the step, the env binding, and the
   check call. Miss one and it passes forever.
6. **Prove a guard can fail.** Break it on purpose. **Two of today's guards cried wolf on
   their first run** — one flagged the documentation of the rule it enforced.
7. **Never auto-merge a fanned-out build.** Ten parallel builds once shipped 44 defects.
8. **Branch, then `git worktree add`.** The shared checkout has been clobbered three times.
9. **Prune each worktree when its PR merges.** ~1–2 GB each; at zero free bytes every command
   fails, including the one needed to recover.
10. **The database is the authority — never the migration file, never a document.** Applied
    migrations are never edited, so their comments stay wrong forever.

---

## 8 · Where things actually are

- **Code:** `github.com/iscasasola/setnayan-platform` — this is canonical
- **Specs + decisions:** `~/Documents/Claude/Projects/Setnayan/` — `DECISION_LOG.md` is
  append-only and is the record of every ruling
- **Today's files:** `THE_PLAN_2026-08-11.md` (12 blocks) · `THE_SESSIONS_2026-08-11.md`
  (numbered sessions) · `CLAUDE_DESIGN_PROMPTS_2026-08-11.md` (the three prompts) ·
  `FRONT_DOOR_CORRECTNESS_PASS_2026-08-11.md` · `S1_READ_THIS_2026-08-11.md`

**Source-of-truth order: the live site → the shipped code → the production database → the
documents.** When they disagree, the documents are wrong. **They were wrong nine times
today.**
