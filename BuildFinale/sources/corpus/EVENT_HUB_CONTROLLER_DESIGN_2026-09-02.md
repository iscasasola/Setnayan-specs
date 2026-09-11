# The Event Hub Controller — editorial and launch, integrated · 2026-09-02

**Status:** DESIGN — **BUILT.** All seven sessions in the register below merged 2026-09-02, last
one EH5 (PR #5130). ⚠ This line said *"PARTLY BUILT"* and then *"Nothing in the app changed"*
before that — re-measure the register before trusting this line either.
**Measured against:** the working tree at `claude/papic-challenge-reaches-the-wall` and the live
production database on 2026-09-02 (5 events · 6 event_members = 5 couple + 1 coordinator ·
40 guests · 6 orders). Re-measure before acting; do not trust these numbers as current.

**Supersedes nothing. Extends:** [`EVENT_HUB_UNISON_2026-08-28.md`](EVENT_HUB_UNISON_2026-08-28.md)
(the 41-feature matrix, three audiences) and
[`SERVICE_CONTROL_CENTERS_DESIGN_2026-08-28.md`](SERVICE_CONTROL_CENTERS_DESIGN_2026-08-28.md)
(the seven-slot control-room pattern, whose **third worked example is this page** and whose
**Owner decision 4 — "does the event page get a gathered control centre at all?" — this document
answers YES**).

---

## 0a · BUILD REGISTER — re-measure before trusting it

| Session | What it owns | State |
|---|---|---|
| **EH1** | the controller exists, and in all three phases | ✅ **MERGED 2026-09-02 · PR #5102** |
| **EH2** | View as — five roles on the stage (§ 3) | ✅ **MERGED 2026-09-02 · PR #5107** |
| **EH3** | one menu word in all three phases (§ 1) | ✅ **MERGED 2026-09-02 · PR #5108** |
| **EH4** | one unlock, offered per channel (§ 5) | ✅ **MERGED 2026-09-02 · PR #5106** |
| **EH5** | channel 4 opens a workroom (§ 2.4) | ✅ **MERGED 2026-09-02 · PR #5130** — the fence held: none of PR #5012's four owned files were touched (verified `git diff --stat` at merge time), so this shipped while #5012 was still OPEN |
| **EH4b** | the gate does three jobs (§ 5.1 rule 3) | ✅ **MERGED 2026-09-02 · PR #5111** — added the missing *unmeasured phase* render test and corrected EH4's changelog before collection |
| **EH6** | one door, not two (§ 7 decision 9) | ✅ **MERGED 2026-09-02 · PR #5116** |

**ALL SEVEN MERGED.** ⚠ PR #5012 (`stories-opt-in-is-reachable` — the Stories switch) is a
SEPARATE, still-OPEN change; it is not part of this stream's build list and never blocked anything
but EH5's own file-level fence. Re-measure with `gh pr view 5012 --json state`, never trust this
line as current.

✅ **Decision 9 is BUILT and verified against `origin/main`, not against a PR description.**
Exactly one surface now declares `metadata = { title: 'Event Hub' }` —
`app/dashboard/[eventId]/launch/page.tsx` — and `addOnHref('landing-page')` returns
`/dashboard/${eventId}/launch`. The `/website` hub page is gone (419 lines deleted, replaced by a
redirect) and its children keep their routes. Re-measure with
`git grep -n "title: 'Event Hub'" origin/main -- apps/web/app`, never this sentence.

🪤 **THE ONE COMMENT STRIPPER BIT FOR THE THIRD TIME IN THIS STREAM, AND THIS TIME FOR REAL.** EH6's
own fix commit: *"fix(catalog): a star-slash in prose swallowed 80% of the file"* — a `*/` inside
prose in `add-ons-catalog.ts` opened a comment that closed at the next real one, blanking most of
the file from whatever read it. EH1 hit this class from one side, EH3 was red-lit by the guard, and
EH6 met the live version. **Any code that reads SOURCE must import `stripComments` from
`apps/web/lib/strip-comments.ts`.**

⚖️ **And the sidebar/Suite disagreement resolved the non-destructive way.** EH6's
`fix(rail): de-duplicate MATCHING, not the rendered rows` kept `pawebsite` as a product row and
de-duplicated the match instead — so the owner-approved row counts (wedding 9 · ceremonial 8 ·
simple_event 7 · date/hangout/travel 5) are unchanged. The alternative would have moved an
approved ruling to make a test green.

⚠ **THIS TABLE HAS NOW BEEN WRONG IN BOTH DIRECTIONS.** It said the controller was "not built" after
EH1 shipped, and it said EH2/EH4 were "not started" after EH4 merged and EH2 opened a PR. **Do not
read a row here as current** — re-measure with
`gh pr list --state all --limit 30 --json number,headRefName,state | grep -i eh` before acting.

✅ **THE LIVE GAP EH1 LEFT IS CLOSED — PR #5108 (EH3), merged 2026-09-02.** It read, in EH1's own
words: *"the page is now correct in all three, but only the day-of roster still links to it."*
`lib/customer-menu.ts` held **exactly one** `${base}/launch` href, inside the `ctx.phase === 'dayof'`
branch, so the controller was correct for a couple months out and **unreachable by them**. It now
holds three — one per phase — all keyed `launch`, all labelled **"Event Hub"**, and the desktop
rail's GO LIVE row points at the same address in every phase. Re-measure with
`git grep -c 'base}/launch' origin/main -- apps/web/lib/customer-menu.ts`, never this sentence.

🔑 **EH3 WAS NOT ONE OF THREE INTERCHANGEABLE PARALLEL SESSIONS — IT WAS THE ONE THAT MADE EH1
COUNT**, and that is worth keeping written down: EH1 shipped a page nobody could reach for the
months when it mattered most, and every one of its own tests was green.

**What EH1 shipped, and what it deliberately did not** — the anchors every later session must reuse
rather than re-derive:

- `apps/web/lib/event-hub-control.ts` — `resolveHubStage` · `resolveHubPhase` · `resolveHubStanding`
  · `resolveHubFacts` · `resolveHubNextStep` · `hubOffersAllowed` · `NOT_SHARED`.
- `apps/web/app/dashboard/[eventId]/launch/_components/hub-stage.tsx` — `HubStage` + `OB` (the
  obsidian token object).
- Slots built: **S1 · S2 · S3 · S4 · S4b · S5 · S7**. ⛔ **S6, the money meter, is NOT built** —
  § 5.1 rule 5, a number that governs money must have a home.
- ✅ `hubOffersAllowed` is `phase === 'plan'` — which suppresses offers on the day, after the day,
  AND when the phase is unmeasured. **This was chosen and reasoned, not inherited**: its docblock
  states all three cases, and the after-the-day half is the owner's own 2026-08-21 ruling, shipped
  and guarded since. § 5.1 rule 3 was the thing that was too narrow, and is now corrected.
  **EH4 reuses this predicate as-is — there is nothing here to confirm.**
- The two-resolver trap of § 2.3 is now **held by a test rather than a comment** — swapping the
  resolvers in either selector turns `event-hub-control.test.ts` red.

---

## 0 · RULE 0 FIRST — what already exists

Before any of the six answers, the honest measurement. **The integration being asked for is
roughly 60% built, on a page nobody can reach in two of the three phases.**

| Thing | Where it already is | State |
|---|---|---|
| The Event Hub as a **place** | `app/[slug]` — 14 rooms, 41 features, three audiences | ✅ ships |
| **Launch** (the three day-of services) | `app/dashboard/[eventId]/launch/page.tsx` — Live Studio "Go live" · Live Wall "Open the wall" · Papic "Hand out cameras", each with an owned/upsell branch | ✅ ships |
| **Editorial** (as a stage of the one link) | the **same page** — `PUBLIC_SITE_PAGES` renders Save-the-Date · RSVP · Day-of · **Editorial** as four preview cards, with "Active now" on the live one | ✅ ships |
| The **editorial maker** | `app/dashboard/[eventId]/website/editorial` (+ guest columns, custom columns, consent/veto, admin review) | ✅ ships |
| The **controller idiom** to copy | `lib/live-studio-control.ts` — one chrome-less single-screen controller, pure resolvers shared by page/actions/tests | ✅ ships |
| The **gathered event-page control centre** | `launch/page.tsx` + `lib/event-hub-control.ts` + `_components/hub-stage.tsx` | ✅ **BUILT by EH1, 2026-09-02** — this row read "not built" until then |

🔑 **The finding that matters: `/dashboard/[eventId]/launch` ALREADY holds both halves the owner
asked to integrate.** It shows the three services *and* the four public pages including Editorial.
It is labelled **"Services"**, it appears **only in the day-of phase**, and it is therefore
invisible for the months before the day and the months after — the exact two stretches when the
save-the-date and the editorial are the whole product. **This is not a build-from-nothing. It is a
promotion, a rename, and a stage.**

⚠ **And "launch" means four different things in this codebase today** (§ 1.3). That collision is
the reason the menu question is a real question and not a cosmetic one.

---

## 1 · WHAT MENU SHOULD IT BE

### 1.1 · The measurement

`lib/customer-menu.ts` is the single source of truth for the phone's bottom nav and the docked
sub-nav; `app/dashboard/[eventId]/_components/customer-nav-config.ts` builds the desktop rail.
Both already carry **three phase rosters**, and the Event Hub wears a **different name in each**:

| Phase | The roster today | The slot that is really the Event Hub | Where it points |
|---|---|---|---|
| **plan** | Overview · Guests · Marketplace · Suite — plus a **GO LIVE** section holding one item | **"Launch"** | `/website/editor` |
| **dayof** | Now · Check-in · Seats · **Services** · Schedule | **"Services"** | `/launch` |
| **after** | Overview · Review · **Editorial** · Galleries | **"Editorial"** | `/website/editorial` |

**Three names, three destinations, one thing.** A couple who has learned the words "Event Hub"
from their own guests — the vocabulary is owner-locked (2026-08-16: *Event Hub* = the one public
address) — is offered "Launch", then "Services", then "Editorial", and none of them is the phrase
they were taught.

### 1.2 · The ruling

> **ONE slot, present in all three phases, labelled "Event Hub", pointing at the controller.**

It replaces the **Launch** row (plan), the **Services** tab (day-of) and the **Editorial** tab
(after). The four public stages and the three day-of services live **inside** it as its own strip —
never as rail children. That is forced by the owner's 2026-07-15 lock, *"solid menu with no
submenus"*, which `customer-nav-config.ts` records as the whole-rail plain-leaf rule.

**Placement.** Desktop: it stays in the existing **GO LIVE** section, which exists already and
holds exactly one item. Phone: it takes the slot the phase roster already spends on it — position 4
in day-of, position 3 in after, and a new position 5 in plan (where GO LIVE is the desktop
section's only member).

### 1.3 · 🔒 THE KEY DOES NOT CHANGE — and this is the part that fails silently

`vendor-nav-destinations.ts` records the lesson in its own words: renaming a nav **key** is not a
bigger version of renaming a label, it is a **different, invisible change**. The key is load-bearing
in four places and **three of the four fail silently** — the admin nav registry slots
(`customer.bottom-nav.<key>` / `customer.sidebar.<key>` in `lib/nav-registry-defaults.ts`), the
localStorage section-open state, and the badge map.

**So: keep `key: 'launch'`. Change only the `label` and the `href`.** The after-phase `editorial`
key and the day-of `services` key are retired *as slots*, and their registry defaults must be
updated in the same commit or `/admin/menus` will keep offering a rename for a row that no longer
renders.

### 1.4 · ⚠ FOUR MEANINGS OF "LAUNCH" — an owner decision, not an engineering one

Measured today:

1. `/dashboard/[eventId]/launch` — the day-of services hub, **labelled "Services"**
2. the nav label **"Launch"** → `/dashboard/[eventId]/website/editor`
3. `/dashboard/[eventId]/website/launch` — a **redirect stub** to the editor (retired 2026-07-25)
4. `lib/launch-save-the-date.ts` — "launch" meaning **go public** (visibility), read by nine surfaces

The recommendation is that **"Launch" as a menu word retires entirely** and becomes "Event Hub".
Meaning 4 is a different word in a different layer and stays. Meanings 2 and 3 both already collapse
into the editor, which becomes a **door inside** the controller.

---

## 2 · WHAT THE EVENT HUB CONTROLLER SHOULD DO

The shipped idiom is `live-studio-control`: **ONE controller**, chrome-less (no masthead above, no
bottom nav below — owner-locked 2026-07-25 *"scroll free controller"*), single-screen, with every
decision in **pure functions** the page, the server actions and the tests all share. Copy that
shape exactly.

### 2.1 · Five jobs. No sixth.

**1 · Show the one address as it is right now.**
A living miniature of `/[slug]` in whichever of its four stages is live, with **"Open as a guest"**
beside **"Edit"**. This is slot **S1 · the stage** of the control-centre pattern, and the market
research behind that pattern is unanimous: the content is the first paint, never a form.

**2 · Switch the stage — four channels, one link.**
Save-the-Date · RSVP · Day-of · **Editorial** are the controller's four channels. The live one wears
**"Active now"**. Previewing any of them is the `?phase=` override that already ships and is already
honoured for the event's own signed-in hosts. **No new route, no new engine** — `PUBLIC_SITE_PAGES`
says so of itself.

**3 · Arm and disarm what runs on the day.**
Live Studio **"Go live"** · Live Wall **"Open the wall"** · Papic **"Hand out cameras"**. The
controller does not reimplement one of them; it is the doorway carrying the day-of verb, and it
becomes the **only** place they are armed.

**4 · Say who is looking, and what they would see.**
The audience switcher — preview as **guest**, as a **specific guest**, as a **supplier**, as the
**coordinator**. This is the genuinely new capability, and it is what makes the § 3 matrix
something a host can *check* rather than something they must trust.

**5 · Allocate every upgrade, in place.** — § 5.

### 2.2 · What it must NOT do

- **Not a fifteenth address.** The Hub stays a place for guests; the controller is the couple's
  side of it. The owner already ruled this once on the supplier desk: *"we are redesigning, not
  placing a new page."*
- **Not a replacement for the ~15 editors.** Its rows are **doors**. Recreating a working screen
  is a defect, not a deliverable (RULE 0.1).
- **No confirmation dialog on a day-of verb.** L15's rule: friction at a ceremony is worse than the
  thing it prevents.
- **Never gate on the calendar where a live signal exists.** This is L15's whole lesson and it is
  the controller's single highest-risk surface — see § 2.3.

### 2.3 · 🚨 THE ONE TRAP THAT WILL BITE THIS BUILD

**Two lifecycle resolvers live one import apart and mean different things.** The launch page already
carries the warning in its own header:

- `getLifecyclePhase` (`lib/invitation-widgets`) → the **public-website** phase:
  `save_the_date → rsvp → event → editorial`. It reaches `editorial` **by a second path**, so it is
  **not** a has-it-happened test.
- `getMenuLifecyclePhase` (`lib/day-of-mode`) → `plan · dayof · after`. This one **is**.

The controller reads **both** — the first to choose which stage the miniature shows, the second to
choose which menu roster and which copy. Getting them backwards produces a page that is confidently
wrong in a way no type checker can see.

**And above both of them sits L15's rule:** a broadcast that is genuinely on air beats the calendar.
`endPanoodBroadcast` clears `panood_watch_url`, so a set watch URL already means *"on air right
now"* and clears itself. The controller's live indicator must follow that signal, not the date.

### 2.4 · SHOULD THE STORY BE A SEPARATE ENTITY? — owner question, 2026-09-02

**No. It stays the fourth channel — and the catalog says so twice.**

**The evidence against separating it:**

1. **It is the same URL.** `/[slug]` renders the editorial when the phase is `editorial`. There is
   no second address to control. The owner's own lock: *"The guest never gets a second link."*
2. **"Editorial editing" is item 5 of the seven Pro items** (§ 5.3) — the product already prices the
   story as a **feature of the Event Hub Pro unlock**, not as a product.
3. **`EDITORIAL_PRO` has NO catalog row at all.** Measured in `platform_retail_catalog_v2` on
   2026-09-02: the standalone a-la-carte Editorial Pro SKU was designed on 2026-07-04, its row was
   to *"land via a parallel PR"*, and **it never landed**. Separating the entity now means building
   the product that was already tried and never shipped.
4. **And since 2026-08-23 it is FREE.** `EDITORIAL_PRO` joined `FREE_FOR_ALL_SKUS`
   (`{'LIVE_WALL','KWENTO','EDITORIAL_PRO'}`), checked before any order lookup — **every couple
   passes**. Splitting the story into its own entity would give a **free** capability its own
   control surface while the **paid** unlock stayed on the other three stages. That is backwards.
5. Separating it recreates the exact three-doors problem § 1 exists to close.

**The evidence FOR separating it — real, and it is about depth, not identity:**

- **Three authors.** The host writes, **guests write columns**, and a **Setnayan admin reviews**
  (`/admin/editorial-review/[editorialId]`). It is the only stage with an approval queue.
- **It outlives the event.** The other three stages are consumed and gone. The editorial feeds the
  account library, the public profile and the recap social posts — it is the artefact the couple
  keeps.
- **Consent and veto** (`consent-veto.ts`) is a per-person, ongoing rights surface, not a stage
  setting.
- **A different ownership model** — `event_editorial` is composer-owned and read via the admin
  client, beside an event row read under RLS.

🔑 **THE RESOLUTION: same controller, different depth.** The other three channels are things the
couple **sets** — they open a sheet. The editorial is a thing the couple **works on**, for weeks,
with two other authors — so **channel 4 opens full-screen into the existing editorial editor**, not
into a sheet. That is the whole difference, and it is a rendering decision, not an architecture one.

⛔ **And do not sell Event Hub Pro on it while it is free.** `couple-website-pro.ts` states the
constraint in its own words: *"Event Hub PRO may NOT be SOLD on this inclusion while it is free."*
The free ruling is reversible and the owner's to reverse — until then, "Editorial editing" is a
thing the controller **opens**, never a reason it gives to buy.

---

---

## 3 · WHAT THE EVENT HUB PAGE SHOWS — the five-role matrix

### 3.1 · First, the reconciliation

The owner names five: **host (couple) · coordinator · vendor · guests · specific guest**. The
Unison doc argued for **three** audiences, with the coordinator living inside two of them. **Both
are right, and the five-column split is the more useful one** — but only two of the five splits are
real in code, and saying which is which is the honest answer:

| Owner's column | How the code actually resolves it | Real split? |
|---|---|---|
| **Host (couple)** | `event_members.member_type = 'couple'` | — |
| **Coordinator** | `member_type = 'coordinator'`. `HOST_MEMBER_TYPES = ['couple','coordinator']` — **the page treats them as a host** — but the site editor gates `couple`-only, and only an *appointed* coordinator advances the running order and writes announcements | ✅ **REAL** — host minus editing, plus two floor powers |
| **Vendor** | a **genuinely booked** shop (shortlisted is not booked — that leak was closed 2026-08-27) | ✅ real |
| **Guests** | a QR-session guest or an invited account, **no seat** | ✅ **REAL** vs. the next row |
| **Specific guest** | a **seat-holder** — a named guest with a bound personal QR | ✅ real |

⚠ **A coordinator hired through the marketplace is a VENDOR, not the coordinator column.** Owner,
2026-08-27: *"they log in as guests or vendors. the only hosts are the event owners."* The
coordinator column below means **the appointed co-host**, and production holds exactly **one** such
person today.

Underneath, the page distinguishes **six** ways in (stranger · QR-session guest · seat-holder ·
invited account · host member · booked supplier). The stranger is the seventh column nobody asked
for and it is the most important one: **a stranger must never see a hint of anything they are not
allowed to see** — a refused shop gets a stranger's page byte for byte.

### 3.2 · THE MATRIX

**Key:** ● full · ◐ partial or read-only · ○ nothing, on purpose · ✎ authors it · ▶ operates it

#### Stage 1 — Save the date (months out)

| # | What is on the Hub | Couple | Coordinator | Vendor | Guest | Specific guest |
|---|---|---|---|---|---|---|
| 1 | The save-the-date film *(weddings only)* | ✎ ● | ◐ preview | ○ | ● | ● |
| 2 | Cinematic reveal openings *(₱ premium)* | ✎ buys | ○ | ○ | ● | ● |
| 3 | Countdown *(never at a wake)* | ✎ sets date | ◐ | ○ | ● | ● |
| 4 | Add to calendar | ○ | ○ | ○ | ● | ● |

#### Stage 2 — Invitation and RSVP (the run-up)

| # | What is on the Hub | Couple | Coordinator | Vendor | Guest | Specific guest |
|---|---|---|---|---|---|---|
| 5 | The invitation page, in the event kind's own words | ✎ ● | ◐ | ○ | ● | ● |
| 6 | Personal QR → welcome; a +1 confirms their own name | ✎ issues | ◐ | ○ | ◐ generic | ● **bound to them** |
| 7 | RSVP | ● sees replies | ◐ sees replies | ○ | ● replies | ● replies |
| 8 | Details · schedule · dress code · what to bring · venue map | ✎ ● | ◐ | ◐ venue only | ● | ● |
| 9 | Our love story *(kinds with two named people)* | ✎ ● | ◐ | ○ | ● | ● |
| 10 | Photo moments *(run-up prompts)* | ✎ curates | ◐ | ○ | ● | ● |
| 11 | Our photos *(the host's own)* | ✎ uploads | ◐ | ○ | ● | ● |
| 12 | Face check-in + selfie consent *(18+ box always required)* | ✎ mode | ◐ | ○ | ● opts in | ● opts in |
| 13 | The lock screen on a private event | ○ | ○ | ● **passes it if booked** | ◐ asks in | ● opens with link |
| 14 | Tea ceremony card *(Chinese weddings)* | ✎ | ◐ | ○ | ● | ● |
| 15 | The monogram | ✎ sets | ◐ | ○ | ● | ● |

#### Stage 3 — The day itself

| # | What is on the Hub | Couple | Coordinator | Vendor | Guest | Specific guest |
|---|---|---|---|---|---|---|
| 16 | Day-of bar and banner | ● host copy | ● host copy | ◐ **desk replaces it** | ● | ● |
| 17 | The guest camera | ▶ always on | ◐ | ○ *(see 40)* | ● | ● |
| 18 | **Watch live** — the broadcast | ▶ runs it | ▶ **may run it** | ● | ● | ● |
| 19 | The live photo wall mirror | ▶ on/off | ◐ | ○ | ● | ● |
| 20 | The **Live hub** — fullscreen day-of view | ○ | ○ | ○ | ● around the day | ● around the day |
| 21 | Photos of you *(tagged, real time)* | ○ | ○ | ○ | ○ | ● **theirs** |
| 22 | Announcements | ◐ their screen | ▶ **writes them** | ● reads | ● | ● |
| 23 | Your seat / find my seat / walk me to my table | ✎ publishes | ◐ | ○ | ◐ finder only | ● **their seat** |
| 24 | The 3D venue walk | ✎ publishes | ◐ | ◐ | ● | ● |
| 25 | Getting there — venue + directions | ◐ | ◐ | ● **on the desk** | ● | ● |
| 26 | Gifts (pabuya / abuloy) | ✎ destinations | ◐ | ○ **refused** | ● | ● |
| 27 | The way between the rooms *(footer of doors)* | ● | ● | ◐ | ● | ● |
| 28 | The bottom bar — Home · Details · Story · Gallery · Me | ● | ● | ◐ | ● | ● |
| 29 | **THE SUPPLIER'S DESK** | ○ never | ○ never | ● **four states** | ○ never | ○ never |
| 30 | The running order, live | ● | ▶ **only they advance** | ◐ sees, cannot advance | ● | ● |

#### Stage 4 — Editorial: the story and album after

| # | What is on the Hub | Couple | Coordinator | Vendor | Guest | Specific guest |
|---|---|---|---|---|---|---|
| 31 | **The recap** — the page becomes the story of the day | ✎ approves + publishes | ◐ | ◐ look-back | ● | ● |
| 32 | **Guest columns** — guests write for the paper | ✎ **approves every one** | ◐ | ○ | ● writes | ● writes |
| 33 | The album doors | ◐ | ◐ | ○ | ● event's | ● **+ theirs** |
| 34 | The print keepsake sheet | ● prints | ○ | ○ | ○ | ○ |

#### The whole life of the address

| # | What is on the Hub | Couple | Coordinator | Vendor | Guest | Specific guest |
|---|---|---|---|---|---|---|
| 35 | The host sees their own page **as themselves** | ● | ● | ○ | ○ | ○ |
| 36 | The host ribbon — edit, preview each stage | ● **5 links** | ◐ **routes to the planning desk, not the editor** | ○ | ○ | ○ |
| 37 | The supplier strip before the day | ○ | ○ | ● **booked only** | ○ | ○ |
| 38 | A booked supplier passes the private gates | ○ | ○ | ● all seven rooms | ○ | ○ |
| 39 | A Locked-QR booking holds its date | ◐ | ◐ | ● | ○ | ○ |
| 40 | The supplier's own camera | ○ | ○ | 🌑 **dark — DPO ruling** | ○ | ○ |
| 41 | The night-before email | ○ | ○ | 🌑 **dark — owner switch** | ○ | ○ |

**Reading the columns:** the **coordinator** column is a host column with two cells promoted
(#22, #30) and one demoted (#36). The **specific guest** column is the guest column with four cells
promoted (#6, #21, #23, #33) — every one of them a thing that is *theirs by name*. Those six cells
are the entire justification for splitting five columns out of three; everything else in both pairs
is identical, and pretending otherwise would be decoration.

### 3.3 · What the CONTROLLER shows the couple (the other side of the same page)

Seven slots, in the pattern's own order:

| Slot | On the Event Hub controller |
|---|---|
| **S1 · The stage** | the living miniature of `/[slug]` in its live phase · "Open as a guest" · "Edit" |
| **S2 · The four facts** | the stage it is in · replies in of invited · who hasn't replied · days to go |
| **S3 · One next step** | the single terracotta-edged card naming the one thing to do now |
| **S4 · The parts** | **the four stages** (Save-the-Date · RSVP · Day-of · Editorial), each with its own state, then **the three services** with their day-of verb |
| **S5 · Set once** | visibility · slug · site chrome · privacy · colours — one sheet each |
| **S6 · The money card** | what this event owns, as a filling meter |
| **S7 · Offers last** | § 5 — and a dashed line naming what deliberately lives elsewhere (marketplace, budget) |

---

## 4 · EFFICIENT · SIMPLE · ANIMATED · CLEAN

Not adjectives — the repo has already turned each into a number, and every number below is
enforceable.

### 4.1 · Measures — FOUR, not three

`app/[slug]/_lib/measures.ts` is the Event Hub's own sanctioned-measures module. It corrects the
2026-08-17 study, which said three:

| Constant | Value | For |
|---|---|---|
| `STAGE` | `max-w-5xl` (64rem) | the widest anything may ever be — the wall, full-bleed editorial spreads, the 3D room |
| `PLATE` | `max-w-3xl` (48rem) | photos, galleries, and the default column of every room |
| `READING` | `max-w-prose` (**65ch**) | every sentence a guest reads — `ch`-based on purpose, **never** swap for a rem width |
| `PHONE` | `max-w-md` | surfaces phone-shaped by design — the bottom bar, the Live hub panels, the day-of bar, the lock screen |

The controller uses `STAGE` for the miniature and `PLATE` for everything under it. **Eight widths
became four; do not add a fifth.**

### 4.2 · Motion

- **One-shot, ≤260ms, and disabled under `prefers-reduced-motion`.** No loops, no ambient drift.
- Motion is only ever allowed to do **three** things here: the stage cross-fading between the four
  channels; a service row settling from armed → live; the next-step card arriving once.
- **Nothing animates on the event day.** The day-of state is the one state where the page must be
  instantly readable by someone holding a phone in one hand at a ceremony.

### 4.3 · Colour on the dark stage — the measured trap

The stage is the obsidian gallery panel `#17160F`. On it:

- ✅ ready-green `#46A46C` — **5.3:1**
- ✅ accent text `#E5794E` — **5.7:1**
- ⛔ **`--pos #4F6B4A` measures 2.7:1 on obsidian — never use it there.** It is a light-ground token.
- ⚠ `#C24E25` on obsidian is 3.5:1 — **button fill only**, never text.

🔑 **The slot-name trap, verified in `tailwind.config.ts`:** the Tailwind slot named `terracotta`
is **the gold** (Champagne Gold `#C5A059`); the **CTA is `mulberry`** (`#5C2542`). A CTA written
`bg-terracotta` is gold and wrong.

The whole stage tints from the **Mood Board palette** — it is the sole palette source, and the
guest-legibility floor is what keeps a host's palette choice from making their own page unreadable.

### 4.4 · Empty is a promise, not an apology

The single strongest finding of the market research: rivals make emptiness read as **anticipation**
— Lapse's darkroom, Dispo's develop clock, Kuha's countdown. So an Event Hub with nothing in it yet
shows **the frames it will fill**, a countdown, and **one lit frame** that starts it. It never shows
a sentence apologising for being empty, and it never shows a stranger's wedding as a sample.

---

## 5 · THE CONTROLLER ALLOCATES EVERY UPGRADE

**Yes — and the shape matters more than the fact.**

`lib/add-ons-catalog.ts` holds **22** entries today: `setnayan-ai · orders · save-the-date · rsvp ·
event · editorial · website-pro · landing-page · playlist · pakanta · animated-monogram ·
custom-qr-guest · papic · papic-guest · panood · photo-delivery · patiktok · thank-you ·
supplies-marketplace · indoor-blueprint · mood-board · seating`.

### 5.1 · The rules

1. **Every upgrade is offered at the point of absence.** An upgrade belongs to the stage or the
   service it completes — Editorial Pro on the Editorial channel, Website Pro on the RSVP channel,
   the multi-cam day on the Live Studio row. **Not a shop tab.** The Suite and the App Store
   shop-window pages stay exactly as they are for browsing; the controller sells only what the
   couple is *currently looking at and cannot have*.
2. **🔑 SHOW IT WORKING — DO NOT DIM AND LOCK.** This is the Live Studio Wave 3 correction,
   owner-locked 2026-07-25, and it applies verbatim: *"Seeing the cameras actually working IS the
   conversion mechanism; hiding or dimming them recreates the exact defect Wave 3 exists to fix —
   asking ₱3,000 for an experience the couple has never felt, for a day that cannot be redone."*
   So a locked stage renders **live and un-dimmed**, with its unlock beside it. No greyscale tile.
   No 🔒 badge over the content.
3. **Offers last — and never once the day is in reach.** S7 is the bottom of the page, and the
   upgrade rail collapses to nothing in **three** cases, not one:
   **(a)** on the event day — an offer never outranks the day;
   **(b)** after it — the row closes rather than sells, per the owner ruling of **2026-08-21**
   (*"stop selling the day itself once the day is over"*, guarded since then by
   `lib/stop-selling-the-day-after-the-day.test.ts`);
   **(c)** when the phase is **unmeasured** — we do not know whether it is their wedding day, and
   an unread state must never become a sale.
   ⚠ **This rule read "never on the day" alone until 2026-09-02 and that was too narrow.** EH1
   implemented all three and said so in `hubOffersAllowed`'s docblock; the predicate is
   `phase === 'plan'`, which is exactly (a) + (b) + (c).
4. **⛔ NEVER TYPE A PRICE.** Read `platform_retail_catalog_v2` — it is admin-managed and it is the
   only number a customer is ever charged. Do not derive a price from `CLAUDE.md`, from a code
   comment, from `Pricing.md`, or from this document. **Charm endings (-1) are no longer a rule**
   — the owner rounded three SKUs off them in a single day on 2026-08-27.
5. **A number that governs money must have a home.** Owner, 2026-08-31: *"don't guess."* Labelling
   an invented default as a guess in the code, the changelog and the PR body did **not** make it
   safe to ship. If the controller needs a figure it cannot cite, it stops.
6. **The boundary is drawn, not implied.** A dashed note at the foot names what deliberately lives
   elsewhere — marketplace bookings and the budget — so the couple never hunts the controller for
   something that was never there.

### 5.3 · THE PRO FEATURES ARE ALREADY ONE THING — and they are already named

Owner, 2026-09-02: *"the cinematic reveal, added features like background music, upload
photo/video, and other pro features should be managed on the controller as well."*

**They are one named set, and four of the seven were named from memory.** `WEBSITE_PRO_ITEMS` —
*"the seven Pro items, named the way the couple sees them"*. ⚠ **It moved on 2026-09-02:** EH4
(PR #5106) lifted it out of `website/editor/_components/pro-panels.tsx` into its own module
**`apps/web/lib/website-pro-items.ts`**, so the seven names live in exactly one file and a guard
asserts there is no second copy. Cite the module, not the panel:

| # | Pro item | Which channel it belongs to |
|---|---|---|
| 1 | **Cinematic Reveal** | Save-the-Date |
| 2 | **Save-the-Date video** | Save-the-Date |
| 3 | **Photo gallery** | RSVP + Editorial |
| 4 | **Background music** | all four |
| 5 | **Editorial editing** | Editorial — ⚠ **free today**, § 2.4 |
| 6 | **Background color** | all four |
| 7 | **Button color** | all four |

🔑 **ALL SEVEN ARE ONE UNLOCK, NOT SEVEN.** `COUPLE_WEBSITE_PRO`, titled **"Event Hub Pro"** in the
live catalog, **₱3,500**, active — measured in `platform_retail_catalog_v2` on 2026-09-02. The
`pro-panels.tsx` docblock says it plainly: *"the seven Pro items are ONE unlock ... no per-feature
buy button."*

**So the controller does NOT get seven upgrade slots. It gets one, offered seven times — on
whichever channel the couple is standing on when they hit the wall.** Cinematic Reveal is offered
on the Save-the-Date channel; Background music on whichever channel is open; Photo gallery on RSVP.
Same unlock, same price, bought in place. This is rule 1 of § 5.1 doing its job.

🔑 **BUT THE TABLE ABOVE DESCRIBES WHICH CHANNEL EACH ITEM BELONGS TO — NOT WHERE IT CAN BE SOLD,
AND THOSE ARE DIFFERENT.** Found by EH4, 2026-09-02, and it is a consequence of rule 3, not a bug:
because `hubOffersAllowed` is `phase === 'plan'`, and the stage only reaches the **Day-of** and
**Editorial** channels once the phase is already `dayof`/`after`, **those two channels can never
carry an offer at all.** In practice every offer lives on **Save-the-Date and RSVP** — the months
the couple is actually building the page. The Pro items that belong to Editorial are therefore sold
*before* the day or not at all.

⚠ **This is the correct behaviour and it should not be "fixed" by widening the gate** — selling an
editorial upgrade to a couple whose wedding has finished is exactly what the owner's 2026-08-21
ruling forbids. It is recorded here because the § 5.3 table reads, at a glance, as though Editorial
were a place a sale could happen. **It is not.**

⚠ **Grandfathering is decided SERVER-side** (`page.tsx` `lockedIf`) — a couple with existing content
keeps editing. The panels only render the decision. The controller must read that decision, never
re-derive it.

📌 **What the live catalog actually sells (2026-09-02).** Nine products plus the Papic credit
ladder: Event Hub Pro ₱3,500 · Pakanta ₱2,500 · Thank You (Papic) ₱2,500 · Setnayan AI ₱2,499 ·
Live Studio ₱1,500 · Patiktok ₱1,500 · 3D Plan ₱1,500 · Animated Monogram ₱1,000 · Custom QR per
Guest ₱0 — and 19 Papic credit tiers from ₱70 to ₱24,000. **`LIVE_WALL` and `EDITORIAL_PRO` have no
row because they are free for everyone**, so the Live Wall card on `/launch` is always on its
"Open the wall" branch and never on "Add". Re-measure with
`select service_code, title, retail_price_php from platform_retail_catalog_v2 where is_active`;
never quote these figures from this document.

### 5.2 · The one thing to check before building

`resolveAddOnState`, `eventSkuActive`, `eventPapicActive` and `eventActiveSkus` are the canonical
ownership predicates and the controller must reuse them. **Papic's card could never light up for a
year** because it was gated on `eventPapicSeatsActive()` — a retired SKU with zero orders ever —
so the one page that exists to say *"start this now, it's your wedding day"* was permanently stuck
on the upsell branch for every couple, including couples whose event already held a free camera.
**Twenty-two upgrade slots is twenty-two chances to repeat that.** Each one gets a test that
constructs an owning event and asserts the card is on the *launch* branch.

---

## 6 · WHAT INFORMATION THE EVENT HUB NEEDS

Framed the way the 3D Plan was framed (owner, 2026-07-23 — *"add 3D Plan — this integrates the
2D Seat Plan, Guest List, Indoor Blueprint, Mood Board"*): **an integrative product is defined by
the inputs it composes, plus the actor layer it hosts, plus the consequences of composing them.**

The 3D Plan composes **4 + 1**. **The Event Hub composes 12 + 1.**

### 6.1 · Data inputs — twelve features it reads

| # | Input | What the Hub gets from it | Notes |
|---|---|---|---|
| 1 | **Event record** | `event_type` (17 kinds), `event_date`, `event_end_date`, `timezone`, `slug`, `landing_page_visibility`, `cleared_at` | Drives **both** phase resolvers **and** the whole vocabulary — celebrant · graduate · family · organizer. ⚠ multi-day events must end on their **real last day** |
| 2 | **Guest list + RSVP** | who is coming · replies in of invited · who hasn't replied · +1 names | The facts strip, and the difference between the guest and specific-guest columns |
| 3 | **Seat plan (2D)** | the seat pass, the seat finder, the table map | Free |
| 4 | **Indoor Blueprint** | the entrance → table walk | **Free** since 2026-07-23 — not a SKU, never a buy drawer |
| 5 | **3D Plan** *(when owned)* | the venue walk, co-presence, vendor booths | Itself an integrative product of 4 + 1 — the Hub composes a composer |
| 6 | **Programme / schedule** | the running order, now/next, private lines **shown-but-marked** | Read under the reader's **own** permissions — the shortcut that would leak coordinator-only lines was named and refused |
| 7 | **Media** | photo moments · our photos · your photos · galleries · the wall feed · the Papic pool | ⚠ four features one word apart — a naming pass is open (Unison § 7.7) |
| 8 | **Broadcast state** | `panood_watch_url` · broadcasts · roam streams · manifest | 🔴 **A LIVE SIGNAL THAT BEATS THE CALENDAR.** Set = on air now; `endPanoodBroadcast` clears it |
| 9 | **Editorial** | `event_editorial` draft_json · sections · chapters · guest columns · custom columns · consent/veto | The fourth stage; the after-phase's whole reason to exist |
| 10 | **Mood board** | the palette everything tints from | **Sole palette source** — with the guest-legibility floor over it |
| 11 | **Monogram** | the mark, everywhere | Lettered fallback is **wedding-only** |
| 12 | **Entitlements + orders + catalog** | which of the 22 add-ons this event owns; the price | Price from `platform_retail_catalog_v2`, never from a document |

*(and the two the Hub reads only for the supplier and money columns:* **bookings** — genuinely
booked, not shortlisted, which is what opens the desk and passes the private gates — and
**gift destinations** for pabuya/abuloy.)*

### 6.2 · The actor layer it hosts

| # | Layer | What it resolves |
|---|---|---|
| 13 | **Membership + sessions** | `event_members` (`couple` · `coordinator` = `HOST_MEMBER_TYPES`) · QR guest sessions · seat-holder bindings · booked-supplier resolution · the stranger |

🔑 **This is the layer that makes § 3 computable at all.** Without it there is no matrix, only a
page. And it is the layer that has already produced this codebase's most expensive defect of its
kind: `loadHostMembership` selected `member_type` **and then never compared it**, returning
`Boolean(memberRow)` — so **any** row counted as a host, and a guest could open a PRIVATE site and
use `?phase=` to jump to phases the couple had not launched, including their own unsent
save-the-date. The controller ships a `?phase=` override to **five** roles instead of one. **Every
new preview path must go through `isHostMemberType`, and be tested with a `guest` row.**

### 6.3 · Consequences — the four that follow

1. **All thirteen are READ, never OWNED.** An edit to guests, seats, palette, programme or the
   story is immediately true in the Hub. No view owns data the others cannot see — the same rule
   the 3D Plan's four inputs follow.
2. **The controller adds NO new table and NO new route for guests.** Everything above already
   exists and already ships. If a migration appears in this build, something has been
   misunderstood — check whether an existing column already encodes it (RULE 0.3), the way
   `papic_guest_spend_ceilings` already expressed a `papic_excluded` that was one step from being
   written as a second, competing source of truth.
3. **One resolver per fact.** Two resolvers that can disagree is the defect this project has paid
   for most often — `getLifecyclePhase` and `getMenuLifecyclePhase` sit one import apart and mean
   different things, and the launch page already carries a warning comment about exactly that.
4. **The measurement must reach the RENDER.** A refused read that returns `[]` and a genuinely
   empty event are byte-identical, and a couple with 180 guests was once told *"No guests yet."*
   A log line never changed a pixel. Every one of the thirteen inputs needs an
   **unread ≠ empty** state on the stage. The shipped patterns to copy are
   `apps/web/lib/guests.ts` + `guests-read-is-honest.test.ts` (couple side) and
   `app/vendor-dashboard/reads-are-honest.test.ts` (supplier side).

---

## 7 · OWNER DECISIONS — flagged, not made

1. **The menu word.** "Event Hub" replaces Launch · Services · Editorial as a menu label in all
   three phases. Recommended; it is your own locked vocabulary. Refusing it keeps three names for
   one place.
2. ~~**Does "Launch" retire as a menu word entirely?**~~ ✅ **ANSWERED YES AND SHIPPED — PR #5108
   (EH3), 2026-09-02.** As a MENU WORD it is gone from both SSOTs in all three phases, and
   `one-menu-word-in-all-three-phases.test.ts` fails if it comes back. Meaning 4 of § 1.4
   (`lib/launch-save-the-date.ts` — "launch" meaning go public) is a different word in a different
   layer and was not touched.
3. **The stage-first order.** Carried unresolved from the control-centres design's decision 1: the
   controller opens on the **dark stage** with the facts fused to its lower edge, not on facts on
   white. Everything else in this document depends on it.
4. **The five-column matrix vs. three.** § 3.1 shows only **six cells** actually differ. Keep five
   columns for clarity, or three for honesty. Recommendation: **five in the document, three in the
   code** — the code already resolves three and should not grow two roles it does not have.
5. **The audience switcher's blast radius.** ⚠ **THIS QUESTION WAS FRAMED WRONG AND EH2 CORRECTED
   IT — read the new form before answering.**

   The old framing: *"may we render a real named guest's personal view to the host?"* **EH2 measured
   that this ALREADY SHIPS, one page over.** `app/dashboard/[eventId]/website/widgets/page.tsx`
   selects a real guest's `first_name` · `last_name` · `display_name` · `qr_token` and offers the
   host **"Preview as ⟨that person's name⟩"**, opening `/{slug}?invite=⟨their real token⟩`.

   **So the question is not "may we build this." It is: that already happens on the widgets page —
   is it intended, and should the Hub match it or should the widgets page be narrowed?**

   ✅ **Nothing was widened while you decide.** The Hub's seat-holder door renders the fabricated
   `lib/simulated-guest-preview.ts` — every value a literal — so **no real guest is read either
   way**, flag on or off. Rendering an actual named person from the Hub is deliberately unbuilt.
   The flag `NEXT_PUBLIC_HUB_NAMED_GUEST_PREVIEW_ENABLED` is **OFF in production, measured not
   assumed**: `vercel env ls production` lists 62 `NEXT_PUBLIC` vars and zero matching
   `HUB_NAMED_GUEST`, and absence is decisive for a `=== 'true'` reader.
   🔑 EH2's own words, and they are the right instinct: *"a neighbouring page doing it is not
   authority to widen it here."*
6. ~~**Retitle the catalog row** "Couple Website PRO" → "Event Hub Pro".~~ ✅ **ALREADY DONE — do
   not re-ask.** Measured 2026-09-02: the live `platform_retail_catalog_v2` row for
   `COUPLE_WEBSITE_PRO` is titled **"Event Hub Pro"**. The Unison doc still lists this as open
   (its § 7.6) and it is not. 🔑 **This document listed it as open in its own first draft** —
   a decision list decays exactly where it is copied forward.
7. **Is the free Editorial Pro ruling still what you want?** It went free on 2026-08-23 and the
   code calls the ruling reversible and yours. It decides whether the story is a **reason to buy**
   Event Hub Pro or just a room the controller opens (§ 2.4). Nothing else in this design changes
   either way.
9. ~~**Two rows on one rail now read "Event Hub"** — the nav slot and the Studio product card.~~
   ✅ **ANSWERED BY THE OWNER, 2026-09-02 — DO NOT RE-ASK.** Verbatim: *"do not use 2. i look at the
   roles of each. if it is the same then adjust. Like in papic — when they enter an event, the menu
   of papic description page becomes the control center of papic. i think that should be the same
   for events hub."*

   **Measured, and the roles ARE the same — this is not a near-miss:**
   · `app/dashboard/[eventId]/website/page.tsx` declares `export const metadata = { title: 'Event
     Hub' }` and its own docblock calls it *"the calm landing that introduces the couple's public
     site and hands them off to the editor."*
   · The catalog card `landing-page` is `label: 'Event Hub'`, `cta: 'Open your Event Hub'`, and its
     blurb is **"One link for your whole event — the run-up page, the day itself, and the story
     after"** — which is the controller's own thesis, word for word. It is the four channels,
     described.
   · The controller does that same job with a **living miniature** instead of prose, and carries the
     day-of services as well.
   **Same name, same promise, same role, two doors.**

   **THE RULING — one door, shaped like Papic.** `papic` is `opensDirect: true` onto
   `/studio/papic`, ONE page that is the shop window before the couple owns it and the control
   centre after. The Event Hub gets the same shape:
   · `addOnHref('landing-page')` resolves to the **controller**, not `/website`;
   · the `/website` **hub page** stops being a second Event Hub and redirects to the controller —
     the repo already has this exact move, `website/launch/page.tsx` redirecting to
     `website/editor` (2026-07-25);
   · **everything under `/website/*` keeps its route** — editor · editorial · our-story · privacy ·
     hero-photo · colors · widgets. They are the controller's S5 doors, unchanged.
   ⚠ **And check the two chips.** The 2026-08-14 verdict gave that card exactly two deep-link chips
   (Event page · Editorial) because *"the hub is the map, and the two chips are the shortcuts."*
   If the card now opens a controller whose channel strip already carries both, a chip that lands
   where the card lands is **a distinction a couple can see is fake** — which is the very defect
   that verdict existed to remove. Built as **EH6**.
8. **Enforce the room grid per kind of event?** Still open from 2026-08-17. Today every kind gets
   every room. It bears directly on what the controller's four channels show for a trip or a wake.
9. 🆕 **TWO ROWS ON ONE DESKTOP RAIL NOW READ "Event Hub" — surfaced by EH3, not resolved by it.**
   Measured 2026-09-02 with `railToolsSignedIn({ eventId, count: 1 })`: the Studio group that
   renders below the event menu (`front-door-shell.tsx` § 4, *"IT DOES NOT COLLAPSE"*) carries
   `pawebsite` — the App Store product card keyed `landing-page` in `lib/add-ons-catalog.ts` —
   **already labelled "Event Hub"** and pointing at the website hub `/dashboard/[eventId]/website`.
   The GO LIVE row is now the controller; that row is the product card for the same thing.
   🔑 **This is a PRODUCT decision, which is why EH3 stopped at flagging it.** Renaming or
   repointing `landing-page` moves a product's name and destination across the Studio hub, the App
   Store and the `/pawebsite` marketing page (whose own docblock records the earlier rename
   *"Pawebsite" → "Event Hub"*). Both rows open real pages, so nothing dead-ends; what a person
   meets is one word offered twice. The flag lives beside the row in `customer-nav-config.ts`.

---

## 8 · FOOTNOTES FOR ENGINEERS

- Measured in the working tree at `claude/papic-challenge-reaches-the-wall`. **Re-measure against
  `origin/main` with `git grep <string> origin/main -- <path>` before building.** Never anchor on a
  line number; every anchor above is a greppable string.
- ⛔ **Never read code from `/Users/icecasasola`** — it is a stale checkout of this repo, hundreds
  of commits behind, and it has produced coherent, fully-traced, completely wrong findings.
- `NEXT_PUBLIC_SUITE` is **`true` in production** — slot 4 of the rail reads **"Suite"**, not
  "Studio". Confirm with `vercel env ls`; a flag's default in code is not its value in production.
- The three ownership predicates to reuse, never re-derive: `resolveAddOnState().state === 'launch'`
  (Panood) · `eventOwnsSku('LIVE_WALL')` · `eventPapicActive()`.
- The controller is chrome-less. `lib/live-studio-control.ts` documents the escape it uses to
  render with no masthead above and no bottom nav below — copy that mechanism, do not invent a
  second one.
- Guards pinned to file paths exist in this repo. Moving a symbol to a new module turns
  `env-flag.test.ts` red. **Grep the bare module name before any split.**
- `pnpm lint` does **not** run the repo guards — ~27 are separate CI steps. A green local lint still
  fails "typecheck + lint".
- Run unit tests from `apps/web`, or every `@/…` import dies. A `--test` glob containing `[eventId]`
  **matches nothing** and prints `# tests 0`, which exits 0 and reads exactly like a pass.
