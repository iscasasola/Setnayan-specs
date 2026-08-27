# The Event Hub — everything on it, by who is looking · 2026-08-28

> **The owner's ask, verbatim (2026-08-28):** *"event hub has the following: owner of the event
> (couple/host) / guest / vendors (coordinator and other suppliers) … they all go to one event hub
> but features will be different, depending on who logs in … create a unison documentation that
> explains all that can be found on the event hub."*
>
> **Status:** DOCUMENTATION ONLY. Nothing in the app changed. Every "ships" claim below was
> re-verified on 2026-08-28 against the shipped code at the current tip of `main` and against the
> live production database — not against the older documents, several of which this file corrects
> (§ 8). Production is serving that same tip, so "ships" here also means "live on the real site."
> Engineer evidence is in § 9; the body has no code in it.

---

## 1 · One page: what the Event Hub is

**One address for the whole life of the event.** The host sends one link (or one QR). That same
link is the save-the-date months out, the invitation and RSVP in the run-up, the live page on the
day itself, and the story and album afterwards. The guest never gets a second link.

**Everyone opens the same address; what it shows depends on who you are.**

- A **stranger** sees the public page, or a polite lock screen on a private event — and never a
  hint of anything they are not allowed to see.
- A **guest** who scanned their QR gets their seat, their photos, their camera, the programme.
- The **host** (and a co-host they appointed) sees their own page as themselves, with a slim
  control ribbon on top. The Hub itself stays a place, not a control panel — every real editing
  tool lives in their planning dashboard, one tap away through the ribbon.
- A **booked supplier** who signs in gets, in that same one place, a desk that changes with the
  calendar: a **call sheet** in the run-up (the date and how far off it is, the venue and its
  address once set, the running order once written, the headcount so far, and the conversation
  they already have with the organiser), their **live desk** on the day, a **look back** for the
  week after, and one quiet line long after that. Nobody else ever sees a trace of it.
  *(Updated 2026-08-28 — until then it was one strip pointing away, opening in place on the day
  alone. See § 6 gap 3.)*

**Settled vocabulary (owner-locked 2026-08-16, unchanged here):** *Event Hub* = the one public
address · *Live hub* = the fullscreen day-of view inside it, reachable only around the day itself ·
*Event Hub Pro* = the ₱3,500 paid upgrade.

**And it is no longer only for weddings.** The product now knows **seventeen kinds of event**
(the newest is the wake, added 2026-08-27), each with its own words. A birthday's page speaks to a
celebrant, a graduation's to a graduate, a wake's to the family — with no countdown, no
save-the-date, and money offered as "a gift of sympathy". A wedding reads byte-for-byte the way it
always has, and tests pin it that way.

---

## 2 · The three audiences — and the answer to "is there a fourth?"

The owner named three: **owner/host · guest · vendors (coordinator and other suppliers)**. An
older planning document (2026-08-15) worked with four, listing *coordinator* separately. Both are
right, and here is the reconciliation, measured from what ships:

**"Coordinator" is not a fourth audience. It is a person who arrives through one of the other two
doors:**

1. **A coordinator the host appointed** (a trusted person given a host key) is treated as a
   **host** by the page — the code's own definition of "host" is *couple or coordinator member*.
   They get the host ribbon; its edit button now honestly sends them to whatever they may actually
   open (the site editor if they may edit, the planning desk if not — a dead end fixed this month).
   Production has exactly one such coordinator member today.
2. **A coordinator the host hired as a supplier** (a wedding-planner shop booked through the
   marketplace) is a **vendor** — they get the supplier strip and, on the day, the supplier desk,
   like any other booked shop. Their extra powers (advancing the running order, the floor desk)
   live in their own tools; on the Hub, only the coordinator may advance the programme — a
   supplier's desk shows the running order live but deliberately cannot press "next".

This matches the owner's own 2026-08-27 ruling: *"they log in as guests or vendors. the only hosts
are the event owners."* So the matrix below has **three audience columns**, and the coordinator
appears inside two of them. There is nothing to collapse and no decision needed — the four-role
document was describing the same people before the door assignments were settled.

**Underneath, the page actually distinguishes six ways in** (stranger · QR-session guest ·
seat-holder · invited account · host member · booked supplier), but those are locksmithing — the
guest ones are all "guest" to a person.

---

## 3 · THE MATRIX — every feature findable on the Event Hub

**Status key:** ✅ SHIPS (verified in code and served in production today) · 🌑 BUILT-BUT-DARK
(built, switched off, waiting on a named gate) · ⬜ UNBUILT (designed or ruled, not built) ·
"—" = that audience gets nothing, on purpose.

**Headline counts:** **41 features.** **36 ship**, 2 are built-but-dark, 3 are unbuilt.
Per audience: the **guest** can meet 27 of the shipped features, the **host** all 36 (everything
the guest sees, previewable, plus 9 host-only), the **supplier** 7 shipped (+2 dark, +1 unbuilt).
Evidence for every ✅ is in § 9.

### Stage 1 · Save the date (months out)

| # | Feature | Host | Guest | Supplier | Status |
|---|---|---|---|---|---|
| 1 | **The save-the-date film** — the cinematic self-playing film, ending in add-to-calendar | previews every stage from the ribbon | watches it at the one link | — | ✅ Weddings only, by rule — a birthday or a wake no longer gets a wedding film (fixed this month; it used to leak) |
| 2 | **The cinematic reveal openings** (veil, church doors…) — the ₱999 premium on the film | buys and picks | sees the chosen opening | — | ✅ |
| 3 | **Countdown** | sets the date | counts down with them | — | ✅ Never at a wake — the solemn register removes it everywhere |
| 4 | **Add to calendar** (the event + the invitation launch) | — | one tap | — | ✅ |

### Stage 2 · Invitation and RSVP (the run-up)

| # | Feature | Host | Guest | Supplier | Status |
|---|---|---|---|---|---|
| 5 | **The invitation page** with the event's own words — 17 kinds of event, each speaking its own language | previews as a guest | reads a page about *their* kind of event | — | ✅ The words job is done; a wedding is pinned byte-identical |
| 6 | **Personal QR → welcome** — scanning turns into a guest session; a +1 confirms their own name | issues the QRs | one scan, no account | — | ✅ Works even after the host renames the event's address |
| 7 | **RSVP** | sees replies in their dashboard | replies at the page; at a wake the words are "Will be there / Unable to come" | — | ✅ |
| 8 | **Details, schedule, dress code, what to bring, venue map** | writes them once | reads them | — | ✅ |
| 9 | **Our love story** | writes it | reads it | — | ✅ Only for kinds with two named people — a child's birthday no longer shows a love story slot |
| 10 | **Photo moments** — the run-up photo prompts | curates | browses | — | ✅ Run-up only, by the phase rules |
| 11 | **Our photos** — the host's own photos | uploads | browses | — | ✅ Run-up and after, by the phase rules |
| 12 | **Face check-in and selfie consent** — so their candid photos can find them | switches the mode | opts in (18+ box always required); can blur themselves later | — | ✅ |
| 13 | **The lock screen** on a private event — polite, and reveals nothing | — | asks to be let in / opens their link | refused identically to a stranger unless booked | ✅ |
| 14 | **The tea ceremony card** | — | reads it | — | ✅ Chinese weddings only — the model wedding-by-nature part |
| 15 | **The monogram** | sets it | sees it everywhere | — | ✅ The lettered-medallion fallback is now wedding-only; other kinds no longer inherit couple initials |

### Stage 3 · The day itself

| # | Feature | Host | Guest | Supplier | Status |
|---|---|---|---|---|---|
| 16 | **The day-of bar and banner** — the page knows the day has arrived | same page, host copy | "It's happening" | the desk replaces their strip | ✅ Multi-day events now end on their real last day (a bug where day two read as over was fixed 2026-08-27) |
| 17 | **The guest camera** — shoot candids straight into the event's library | the host's own camera is always on; everyone else's is the host's switch | one tap from the page — locked shows *why* it is locked, never vanishes | — (see #40) | ✅ |
| 18 | **Watch live** — the Live Studio broadcast on the page | runs it from their side | watches without leaving | — | ✅ |
| 19 | **The live photo wall mirror** on phones | on/off switch (defaults on) | watches the whole event's photos arrive | — | ✅ Mechanism ships; no production event owns the wall yet, so nobody has seen it live — that is zero usage, not a defect |
| 20 | **The Live hub** — the fullscreen day-of view (programme, seat, photos, watch) | — | its chip appears only around the day | — | ✅ |
| 21 | **Photos of you** — the guest's own tagged photos, arriving in real time | — | their personal gallery, day and after | — | ✅ |
| 22 | **Announcements from the coordinator** ("phones down, ceremony starting") | the appointed coordinator writes them from the host's day-of screen | sees them where they are standing | — | ✅ |
| 23 | **Your seat / find my seat / walk me to my table** | publishes the plan | three rooms that answer honestly when nothing is posted yet | — | ✅ |
| 24 | **The 3D venue walk** | publishes the floor plan | walks it | — | ✅ |
| 25 | **Getting there** — the venue page and directions | — | one tap | on their desk, with the address | ✅ |
| 26 | **Gifts (pabuya)** — the digital money dance | sets up destinations | gives from their phone | refused (a supplier is not a guest) | ✅ At a wake the whole page speaks abuloy — "a gift of sympathy" |
| 27 | **The way between the rooms** — seat → directions → gifts → album without going back to the sent link | — | a footer of doors in every room, listing only what this event has | — | ✅ New since 2026-08-17 (the "hub and spoke with no rim" complaint is fixed) |
| 28 | **The bottom bar** — Home · Details · Story · Gallery · Me (camera and watch join on the day) | same bar | same bar, five slots always | — | ✅ On a laptop it stands up as a left rail; three sanctioned widths replaced eight |
| 29 | **THE SUPPLIER'S DESK** — on the day (until 6 the morning after), the booked supplier's strip opens in place: venue + address, the running order **live** with the host's private lines shown-but-marked, the live headcount, their own tools | never sees it | never sees it, or that it exists | their workroom, on the same link everyone else opens | ✅ Shipped 2026-08-27 — the owner's "event hub is the same on the day for vendors plus their special features," built |
| 30 | **The running order, live** — now/next updates within a second when the coordinator advances | runs it (coordinator only) | sees the programme | sees it move; cannot advance it | ✅ |

### Stage 4 · The story and album after

| # | Feature | Host | Guest | Supplier | Status |
|---|---|---|---|---|---|
| 31 | **The recap** — the page turns into the editorial story of the day | approves and publishes | reads and relives | — | ✅ |
| 32 | **Guest columns** — guests write for the paper; the host approves every column | reviews, returns, approves | writes; sees "with the host for review" | — | ✅ |
| 33 | **The album doors** — the photo galleries after the day | — | their photos + the event's | — | ✅ |
| 34 | **The print keepsake sheet** | prints it | — | — | ✅ No longer previews a draft to non-hosts (fixed 2026-08-27) |

### The whole life of the address

| # | Feature | Host | Guest | Supplier | Status |
|---|---|---|---|---|---|
| 35 | **The host sees their own page as themselves** — never "scan your personal QR" | their page greets them as the host | — | — | ✅ Ships, and since 2026-08 is pinned by a test (it worked for months with nothing guarding it) |
| 36 | **The host ribbon** — edit this site, preview each stage | 5 links, read-only page beneath | never rendered | never rendered | ✅ The coordinator's dead-end button is fixed |
| 37 | **The supplier strip (before the day)** — "you are booked here", one link to their tools | — | — | one line, one link out | ✅ It now shows only to genuinely *booked* shops — until 2026-08-27 a merely-shortlisted shop could be told "you are booked here" and be counted as one of the people of the day; that leak is closed |
| 38 | **A booked supplier passes the private-event gates** — all seven side rooms, both closed visibilities | — | — | walks in like the crew they are; a refused shop gets a stranger's page, byte for byte | ✅ Shipped 2026-08-27 |
| 39 | **A Locked-QR booking holds its date** — a booking where money already moved now blocks the shop's calendar like every other | — | — | calendar and capacity finally agree | ✅ Shipped 2026-08-27 |
| 40 | **The supplier's own camera** — documenting *their work* (owner: never the guests) | — | — | capture lane exists | 🌑 BUILT-BUT-DARK — the route refuses everyone until the data-privacy ruling (the owner, as DPO) opens it; it is also deliberately kept off the desk until its rules are re-read |
| 41 | **The night-before email** — "tomorrow is the day," call time, link to the desk | — | — | one email, once | 🌑 BUILT-BUT-DARK — merged 2026-08-27, ships switched off; the gate is the owner's (§ 7, decision 2) |

**Unbuilt but ruled or drawn (the ⬜ three):** the **teammate arm of the desk** (a shop's granted
staff member opening the desk — ruled yes by the owner, deliberately held because it widens "one of
the people of this celebration", § 7 decision 1) · the **pre-day call-sheet states of the desk**
(the drawn "your booking — Ana & Marco, Sat 14 Feb" ribbon months out, and the two-events-in-one-day
bridge — the binding design has them; what shipped is the day itself, and before the day the strip
stays the one-line link it always was) · the **gathered control centre for the event page** (the
2026-08-28 control-centres design's third worked example — design only, § 7 decision 5).

---

## 4 · The addresses — what one link actually contains

Fourteen rooms under the one address. All verified present today.

| Address | What a person does there | Who it is for |
|---|---|---|
| the page itself | the whole story above — film, invitation, the day, the recap | everyone |
| /welcome | a +1 confirms their own name | guest |
| /invite | asks to join | guest |
| /redeem | turns a scanned QR into a session *(a door, not a page)* | guest |
| /seat (+ /seat/claim) | their seat pass | guest |
| /find-seat | type your name | guest |
| /find-my-table | the walk to the table | guest |
| /venue | getting there + the 3D walk | guest, supplier |
| /hub | the **Live hub** — fullscreen day-of view | guest, around the day only |
| /live-wall | the photo-wall feed *(data for screens)* | screens |
| /pabuya | gifts | guest |
| /recap | the story and album after | everyone |
| /print | the keepsake sheet | host |
| /sign-out | leaves the event *(a door)* | guest |

Two structural facts that were true on 2026-08-17 and are **no longer true**: the rooms now link
to each other (a footer of doors in every main room), and the page carries the supplier's desk on
the day. The supplier's desk is deliberately **not** a fifteenth address — the owner ruled it is
the same page, opened by the same link ("we are redesigning, not placing a new page").

---

## 5 · Per kind of event — what exists for a birthday, a wake, a trip

**Seventeen kinds** are live (the wake since 2026-08-27; baptism deliberately not added —
christening covers it, owner 2026-08-17). What actually varies by kind, as shipped:

1. **The words — done everywhere.** Every universal sentence reads the kind's own vocabulary:
   celebrant, graduate, family, organizer, host. The old complaint — "a birthday opens a page that
   calls them a couple at a wedding" — is fixed and guarded; roughly 69 universal sentences were
   re-worded and the wedding's own words are pinned unchanged. The **host and the celebrant are
   two words now** (owner 2026-08-27): the person honoured and the person running it are named
   separately wherever they differ.
2. **The wedding-by-nature parts stay home — done.** Four parts exist *because* it is a wedding
   and now appear only where they belong: the save-the-date film (and its openings), the lettered
   monogram fallback, the love story, and the bride's/groom's side labels. The film and monogram
   follow an admin-changeable per-kind list; the love story and side labels follow "does this kind
   have two named people". The tea ceremony was already correctly gated. **Before this month, all
   of these leaked** — a non-wedding created far enough out rendered the wedding film.
3. **The solemn register — done.** A wake never counts down, never gets the film, never gets
   marketing upsells; RSVP and money change their words; every celebratory kind is pinned
   byte-identical so nothing solemn leaks back.
4. **⚠ The room grid is NOT built — and the older document reads as if it were decided into
   existence.** On 2026-08-17 the owner approved a drawn grid of which *rooms* exist per kind
   (no gift page at a corporate event or a tournament; no seat rooms on a trip, a date, a
   hangout). **Measured today: every kind except the wedding carries an identical all-on room
   list.** A trip and a dinner date get the same seat rooms as a wedding; a corporate event can
   have a gifts page. In practice the honesty gates soften this — a seat room says "nothing
   posted yet" until a plan is published, and the gifts page is empty until the host sets up
   destinations — so nothing *looks* broken. But the decided grid is enforced only for the four
   wedding parts and the wake's tone, not for rooms. Whether to enforce the rest is § 7,
   decision 4.

Production today: 5 events — 3 weddings, 1 date, 1 simple event. The non-wedding pages exist and
serve, but no real non-wedding guest has walked one; every behavioural claim about non-weddings is
a claim proven by tests, not by a person.

---

## 6 · What is genuinely not integrated — the honest gap list

Measured, not remembered. None of these is broken; each is a seam a person can feel.

1. **Four photo features with near-identical names.** *Photo moments* (run-up prompts), *Our
   photos* (the host's own), *Your photos* (the guest's tagged photos), and the *photos-of-you*
   gallery inside it. All ship, all are visible on all five production events, and the lifecycle
   phases keep them from colliding on screen — but the names are one word apart and a host
   configuring them cannot tell which is which without opening each. A naming pass is copy, not
   code (§ 7, decision 7).
2. **The live photo wall renders in two places** — on the page itself and inside the Live hub.
   Deliberate (a guest needs it in both), but the two mounts must forever agree with the host's
   one on/off switch; today they do because both ask the same single question. Watch that it
   stays one question.
3. ~~**The supplier's desk is day-of only.**~~ ✅ **CLOSED 2026-08-28 — PR
   [#4932](https://github.com/iscasasola/setnayan-platform/pull/4932).** The desk has four states
   now: the **call sheet** before (the date, *"43 days to go"*, the venue once set, the running
   order once written, the headcount marked *not settled*, the console's own setup view, and the
   conversation the supplier and the organiser already have), **today** unchanged, **look back**
   for the week after, and **one quiet line** long after — a supplier's past work is their
   portfolio, so the door goes quiet rather than shutting. Nothing about the read widened: the
   database was always willing to tell a booked supplier these facts, and only this surface was
   shut. ⏭ **The same-day bridge is still not built** and is now the only piece of the design's
   § E outstanding — it needs the shop's OTHER bookings, which today can only be read with the
   service role, so it wants a `SECURITY DEFINER` function scoped to the caller rather than an
   admin read inside this page. ⚠ Verify with `gh pr view 4932 --json state,mergedAt` before
   trusting this line.
4. **A shop's granted teammate cannot open the desk.** The owner ruled staff handle the event
   fully; the arm is held back because the same switch also counts that teammate as "one of the
   people of this celebration", which unlocks a keepsake the host kept private (§ 7, decision 1).
5. ~~**The two supplier surfaces after the day still point away.**~~ ✅ **CLOSED 2026-08-28 by the
   same PR.** The Hub's after-stage now offers a booked supplier a look-back for the week
   following: the day as it ran, with the lines the floor actually advanced marked — and, when
   nobody advanced anything, that said plainly rather than dressed up as history. Their published
   recaps and real stories still live in their own dashboard, which is where a portfolio belongs;
   what changed is that the celebration's own address stops going blank on them at 6 a.m.
6. **The catalog row is still titled "Couple Website PRO"** while every couple-facing screen now
   says "Event Hub PRO". One admin-side title, one word (§ 7, decision 6).
7. **A weak-signal venue defeats the desk.** The design names this honestly: the room assumes a
   connection; a basement reception with one bar is real. Its own project, unscoped.
8. **The Live hub's photo language still assumes the host publishes seats and programme** — at an
   event kind where those rooms will never be filled (a trip, a date), the Live hub's panels
   answer with polite apologies forever. Harmless today (no such event has reached its day), but
   it is the room-grid gap (§ 5.4) seen from the day itself.
9. **The empty-photos plate is unreachable** — one "photos will appear here" sentence can never
   render (nothing passes it its cue), and it still says "the couple". Known, recorded in the
   code, deliberately left; it belongs to whichever session next owns empty states.

**And two 2026-08-26 worries that are now closed, recorded so nobody re-raises them:** the
private-cues-at-a-public-address trap was handled the careful way (the desk reads the running
order under the supplier's own permissions, not the page's all-seeing ones — the one-line shortcut
that would have leaked coordinator-only lines was named and refused); and the Locked-QR booking
path now stamps both booking links and reserves its date (both halves fixed 2026-08-27).

---

## 7 · Owner decisions — flagged, not made

1. **Let a shop's granted teammate open the desk?** You already ruled the staff member handles
   the event fully. Building it also makes that teammate count as "one of the people of this
   celebration", which unlocks the keepsake story a host kept to the people of their day. Say
   "build it" and it ships with that fact named; nothing else waits on it.
2. **Switch on the night-before email?** It is built and off. Your question — *"email for
   what?"* — deserves its answer: the night before a celebration they are booked for, a shop
   gets one message saying tomorrow is the day, their call time, and a link straight into their
   desk. Once, only to shops with real accounts, never to addresses a couple typed in. It stays
   off until you say.
3. **"No paid booking fee, no connect" — which reading?** (a) *a fee owed and unpaid blocks the
   connection* — cuts nobody off today, matches your locked fee model; (b) *nobody who has not
   paid a fee connects* — would disconnect all 13 booked suppliers, your test shops included.
   Work proceeds on (a); it is your sentence, so it is put back to you rather than assumed.
4. **Enforce the room grid per kind of event?** You approved the grid on 2026-08-17 (no gifts at
   a corporate event, no seat rooms on a trip…), and only the wedding parts and the wake's tone
   were built. Today every kind gets every room, empty rooms answering honestly. Options: leave
   it (the honesty gates carry it), or enforce the grid as drawn. Recommendation: enforce it —
   an event kind that can never fill a room should not offer the room — but it is scope, so it
   is yours.
5. **Does the event page get a gathered control centre?** The 2026-08-28 control-centres design
   drew your ~15 editor screens gathered under one living miniature of the page. Building it is
   new scope; the editors all work today from the dashboard. (Carried from that design's own
   decision list.)
6. **Retitle the catalog row** from "Couple Website PRO" to "Event Hub Pro"? One word on an admin
   screen; every guest- and couple-facing surface already says Event Hub Pro. Price untouched.
7. **Name the four photo features apart?** e.g. *Engagement moments · Our album · Your photos ·
   (gallery stays "Gallery" per your rename)*. Pure copy; a proposal will be drawn before
   anything is renamed.
8. **May a booked-but-never-appointed coordinator speak to guests?** Announcements today are
   written from the host's own day-of screen by the coordinator the host *appointed*. A
   coordinator merely *booked* as a supplier cannot broadcast. Open since 2026-08-15; still open;
   nothing built either way.
9. **Open the supplier camera lane?** Built, dark, refused to everyone. Your ruling as DPO — that
   a supplier's camera documents their own products, never the guests — is recorded; the lane
   stays shut until you open it, and you also ruled no filter can enforce it, so it opens with
   the policy said aloud on the capture screen.

---

## 8 · What this document supersedes — and what it does not

**Supersedes (each gets a one-line pointer at its top; none is deleted):**

| Document (date) | Why it is superseded |
|---|---|
| `EVENT_HUB_COMPLETE_LISTING_2026-08-17.md` | Its two findings — "no way between the rooms" and the wedding word count — are both **fixed and shipped**. Its address list survives here (§ 4), corrected. |
| `EVENT_HUB_UNIVERSAL_DESIGN_2026-08-17.md` | Its word map was executed (S13 + the wake); its "no per-block gating exists" is no longer true (the wedding-parts gate ships); its § A grid was decided by the owner and is now tracked here (§ 5.4, § 7.4). Its § D what-not-to-change list still binds. |
| `WHATS_NEXT_Event_Hub_Multirole_2026-08-15.md` | Its role table is stale in all four rows: the host body variant ships, the supplier desk ships **in** the Hub, the coordinator dead-end is fixed, and its four-role framing is resolved (§ 2). Its owner-decision 2 survives as § 7.8 here. |
| `WHATS_NEXT_EVENT_HUB_BUILDS_2026-08-17.md` | S13 · S14 · S15 · S16 have **all shipped**, plus the wake (its S17). Nothing in it is left to run. |
| `WHATS_NEXT_EVENT_HUB_DESIGN_2026-08-17.md` | S12 was done then; its paste-block carries pre-correction numbers (15 types, 103 words, "there is already a shared shell") that must not be quoted. |
| `WHATS_NEXT_S9_AND_EVENT_HUB_2026-08-17_EVENING.md` | Its three Event Hub blocks (S13–S15) are shipped; superseded **for the Hub blocks only** — its S9 grants block is a separate stream and untouched. |

**NOT superseded — still the live documents beside this one:**
`Vendor_Room_Design_2026-08-26.md` (the desk's binding design — its unported states are § 3's ⬜
and § 6.3) · `WHATS_NEXT_Vendor_Hub_And_Answers_2026-08-26.md` (plan of record for the remaining
pieces and the Answers Desk) · `WHATS_NEXT_Suppliers_Room_SESSIONS_2026-08-27.md` (the live
session register) · `SERVICE_CONTROL_CENTERS_DESIGN_2026-08-28.md` (a different surface: the
host's control centre *for* the Hub, not the Hub).

**The three most important corrections this pass had to make to the record:**

1. **"The vendor has no place on the Hub" is dead.** The 2026-08-15 document's role table (vendor
   ❌, host ⚠ a ribbon, coordinator ❌ split) described a product that no longer exists: the
   supplier desk shipped *inside* the Hub on 2026-08-27, the host body variant ships and is
   guarded, and the coordinator question resolved into two existing doors.
2. **The 2026-08-17 defect list is a done list.** The words (S13), the way between the rooms
   (S14), the wedding-only parts (S15), and the three widths (S16) all shipped — plus the wake as
   the seventeenth kind. A session reading those documents today would re-scope four finished
   builds and one finished event type. Also: the solemn kind's live key is **wake**, not
   *funeral*, and the roster is 17, not 15 or 16.
3. **The owner's room grid was approved but only partially built** — the older documents read as
   if "yes to all four" settled the rooms per kind. Measured: every kind except the wedding
   carries an identical all-on room list; only the four wedding parts and the wake's tone enforce
   the ruling. That is now an explicit owner decision (§ 7.4) instead of an ambient assumption.
   (Smaller stale numbers corrected in passing: production is 5 events with 3 private — not 6
   with 4; 40 guests, not 39; the member roster is no longer "all couple" — it holds one
   coordinator member.)

---

## 9 · Footnotes for engineers — evidence per claim

All measured 2026-08-28 in a detached worktree of `origin/main` at `fc6cf9e11` (which
`/api/health` on production self-reports), and in the live prod DB. Never read from the stale `~`
checkout.

- **Audiences (§ 2, § 3):** `app/[slug]/page.tsx` resolves `guestSession` / `isSeatHolder` /
  invited-account / `ownerCapability` / `resolveVendorCapability` (10 refs). Host = member types
  in `app/[slug]/_lib/host-scope.ts` → `HOST_MEMBER_TYPES = ['couple','coordinator']`; the
  member-type compare bug (any member read as host) fixed in PR #4890. Host/celebrant split:
  `_lib/host-and-celebrant-are-two-words.test.ts`, PR #4896.
- **Host body + ribbon:** `_lib/the-host-sees-their-own-page.test.ts` (behaviour shipped in
  #4483, guarded 2026-08); ribbon model `lib/owner-ribbon.ts:136` (`editorHref` falls back to the
  planning desk — coordinator dead-end fixed).
- **Supplier desk (rows 29, 37–39):** `_components/supplier-desk.tsx` +
  `_lib/supplier-desk.server.ts` (model: venue name/address, attending/invited, categories,
  run-of-show blocks with private lines marked, tools) + `_components/vendor-doorway.tsx` (desk
  replaces the link-out from event start until 06:00 after end). PRs #4912 (booked = 3 arms,
  `lib/vendor-room-access.ts`), #4914 (`lib/closed-event-admission.ts` + `lib/booked-supplier.ts`
  — the shortlisted-shop leak: `reusable-bookings.server.ts` minted linked rows at
  `'shortlisted'`, two of three "booked?" copies tested only the link), #4919 (desk; run-of-show
  via `fetchRunOfShowBlocks` under the supplier's own session, NOT `get_vendor_event_brief`'s
  unfiltered `SECURITY DEFINER` timeline; guard: no `createAdminClient` in the desk loader),
  #4913 (locked-QR acquires schedule pools; degrades open), #4915 (night-before email; flag
  `SUPPLIER_NIGHT_BEFORE_EMAIL_ENABLED === 'true'`, default off, in
  `lib/supplier-night-before-email-flag.ts`). All six PRs verified MERGED via `gh pr view`;
  prod serves their tip. `vendor_claim_locked_qr` now stamps `linked_vendor_profile_id`
  (verified by `pg_get_functiondef` regex against prod).
- **Words / kinds (§ 5):** `_lib/event-words.ts` (+ `s13-is-finished.test.ts`,
  `the-wake-never-celebrates.test.ts`). Live vocab: `event_type_vocab` = **17 active rows**;
  solemn key is **`wake`** (label "Wake", created 2026-08-27) — earlier notes say `funeral`;
  the live key is what counts. `event_type_profiles`: only `wedding` enables `save_the_date` +
  `monogram`; **all 17 enable `seating`** (⇒ § 5.4: the room grid is not enforced per kind);
  `wake` carries `register:'solemn'`, organizer `family`.
- **Wedding-only parts:** `lib/wedding-only-parts.ts` (exhaustive `PART_RULE`: film + monogram by
  profile surface; love story + side labels by two-named-people), consumed by
  `lib/site-body-plan.ts` (`mayShowStdFilm`).
- **Phases / widgets (§ 3 stages):** `WIDGET_PHASES` in `lib/invitation-widgets.ts`
  (`photo_moments`→rsvp · `your_photos`→event+editorial · `our_photos`→rsvp+editorial). Engine
  enabled via `isWebsitePhasesEnabled() || surfaceEnabled(profile,'website')` at
  `app/[slug]/page.tsx:612` — **all live types enable `website`, so the engine is ON for every
  real event even though `WEBSITE_PHASES_ENABLED` defaults off.** Do not report it dark from the
  env var. `invitation_widgets` in prod: all six checked types `is_visible=true` on all 5 events.
- **Rooms / navigation:** route dirs under `app/[slug]/` (14 incl. `seat/claim`);
  `_lib/room-links.ts` (+ `room-footer.tsx`) mounted by seat · find-seat · find-my-table · venue
  · pabuya · recap; welcome/invite deliberately excluded (door register). Bottom bar
  `_lib/site-menu.ts` (five tabs, dead-anchor rule); day slots + camera/watch rules
  `_lib/site-nav.ts`. Widths: `_lib/measures.ts` (S16, PRs #4510/#4512).
- **Photo blocks (§ 6.1–6.2):** `our-photos-widget.tsx` · `your-photos-widget.tsx` (mounts
  `photos-of-you-gallery.tsx`) · `photo-moments-widget.tsx`; `LiveWallBlock` mounted by
  `site-body.tsx` AND `hub/page.tsx`, both through `guestWallMirrorActive()` (one gate — keep it
  one). Unreachable plate: `_components/empty-states.tsx:25`.
- **Guest camera:** `public-event-day-bar.tsx:77` → `/papic/guest`; in-context capture
  `site-body.tsx` imports `PapicGuestCapture`; camera slot rules in `site-nav.ts` (host's own
  camera unconditional).
- **Multi-day fix (row 16):** `event_end_date` + `cleared_at` were cast-but-never-selected —
  fixed in #4919 (the multi-day arm of `getLifecyclePhase` had never run).
- **Prod counts (§ 5, § 8):** events 5 (wedding×3 — one date-undecided at year precision with no
  address; date×1; simple_event×1), 3 private; guests 40; papic_photos 14; `event_members` =
  5 couple + 1 coordinator; `event_moderators` = groom + external planner accepted, bride
  pending; `event_vendors` 45 = 32 considering · 10 contracted · 3 deposit_paid (13 booked);
  `linked_vendor_profile_id` 0/45; `marketplace_vendor_id` 1/45 (the seeded SONGDESK fixture).
  Catalog: `COUPLE_WEBSITE_PRO` titled "Couple Website PRO", ₱3,500, active (§ 6.6/§ 7.6);
  `LIVE_WALL` ₱2,500 inactive — row 19's "no event owns the wall".
- **Service-role rule (carried forward, load-bearing):** `/{slug}` loaders read with the service
  role, so RLS is inert there — *authorization* may use a service-role read scoped by a
  session-proved id; **event content never may.** The desk obeys it and a source guard pins it.
