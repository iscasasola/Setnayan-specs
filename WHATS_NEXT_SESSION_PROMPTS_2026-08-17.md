# Ready-to-paste session prompts · 17 August 2026

> **TEN sessions. Run TWO at a time — five waves.** Register:
> [`WHAT_IS_LEFT_2026-08-17.md`](WHAT_IS_LEFT_2026-08-17.md).
>
> 🛑 **NEVER MORE THAN TWO AT ONCE.** Ten parallel builds once shipped **44 defects** and the
> shared checkout has been clobbered three times. The waves below are chosen so the two running
> together **cannot touch the same files.**
>
> 🛑 **NEVER AUTO-MERGE A FAN-OUT.** Auto-merge is the standing default for a single PR. It is
> **not** the default when two sessions are in flight — read both diffs first.

## The waves

| Wave | Run together | Why they are safe together |
|---|---|---|
| **1** | **S1** supplier gets through the door · **S2** the first screens anyone sees | the event website vs the sign-in screens — no shared file |
| **2** | **S4** six small things · **S9** under the floor | product screens vs database grants and headers |
| **3** | **S3** "we couldn't load it" — **RUN THIS ONE ALONE** | it touches screens app-wide and will collide with anything |
| **4** | **S5** the couple's four screens · **S7** the five undrawn surfaces | different trees |
| **5** | **S6** the supplier's screens · **S10** the compliance pack | code vs documents — S10 opens no PR |
| **last** | **S8** your own admin screens | internal-only, so it ships last on purpose |

⚠ **S6 must not run beside S4** — both touch the supplier's screens. That is the one pairing that
looks fine and is not.

---

## ⚠ READ THIS BEFORE PASTING ANYTHING

Every "already ships" line in these blocks was **read from `origin/main` and the live production
database on 2026-08-17**, so a cold session does not have to re-derive it. Anything I did **not**
verify myself is marked **`UNVERIFIED — CHECK FIRST`** and must be measured before it is acted on.

🛑 **Three claims from the older scope documents did NOT survive checking today.** They are struck
in the blocks below. Do not reinstate them from an older file:

1. ~~"The vendor link is never written — build the writer."~~ **It is written automatically at
   lock, and has been since 2026-06-19.** The column is empty because nobody has booked a
   marketplace supplier, not because the code is missing.
2. ~~"Only a coordinator may press Start next, and the refusal is swallowed."~~ The control's own
   docblock says the **booked vendor is also allowed by the RPC**. The claim may still be true of
   some other path — **measure it before building anything.**
3. ~~"The shot list is advertised as syncing to the couple."~~ Its docblock says local-only is
   **deliberate** for offline venues and names the synced version as a follow-up. It is a
   **feature request, not a lie in the copy.**

🔑 **The lesson those three share: an empty column is not a missing mechanism, and a scope
document is not evidence.** Grep for the writer.

---

## SHARED HEADER — paste this at the top of EVERY block below

```
Read /Users/icecasasola/CLAUDE.md and ~/Documents/Claude/Projects/Setnayan/CLAUDE.md first.

RULES THAT OVERRIDE YOUR DEFAULTS:
- RULE 0 — FIND IT BEFORE YOU BUILD IT. This project is ~2 years old. Assume what you are
  asked for ALREADY EXISTS and your job is to locate and extend it. The "already ships"
  lines in this prompt were read from origin/main and the live DB on 2026-08-17 — but
  confirm anything you are about to change.
- AN EMPTY COLUMN IS NOT A MISSING MECHANISM. Zero rows means nobody has done it yet, never
  that the code is absent. Grep for the WRITER before scoping a build around an absence.
  On 2026-08-17 a whole six-step build was scoped around a column that already had a writer.
- A DOCUMENT IS NOT EVIDENCE — including this prompt. Verify against shipped code and the
  live production database (Supabase project njrupjnvkjkitfctetvi) before acting.
- A rejected query is not a thrown error. A phantom column, enum value, function argument,
  a blocked iframe or a missing grant all fail the same way: the only symptom is an absence.
- Branch FIRST, then `git worktree add`. Never work in the shared main checkout.
- Prune your worktree the moment your PR merges.
- Add a changelog fragment in changelog.d/. Do NOT edit CHANGELOG.md or STATUS.md.
- `gh pr merge <PR#> --auto --merge` after creating the PR — UNLESS another session is in
  flight, in which case both diffs get read first.
- "Auto-merge armed" is not "will merge" — read `gh pr checks <#>`, and confirm a landing
  with `git merge-base --is-ancestor`.
- After merge, VERIFY THE CHANGE REACHED PRODUCTION BY QUERYING THE OBJECT. Prod deploys
  have silently stopped migrating before.
- A guard must be able to FAIL. Sabotage it, and PRINT THE OCCURRENCE COUNT before and
  after — an unmeasured mutation proves nothing.
- Reply to the owner in plain English: what a PERSON experiences. No file paths, function
  names, table names, SQL or flag names in your answer to him.

PRODUCTION AS OF 2026-08-17: 6 events (4 private, 2 public) · 39 guests · 9 accounts ·
2 shops, 1 published · 14 photos · 0 orders ever · 45 booked suppliers, 0 of them accounts.
Nothing has met a real customer. Every behavioural claim is a claim about code.
```

---

# SESSION 1 · The supplier finally gets through the door
**Wave 1 · pairs with S2 · small · no owner ruling needed**

```
WHAT A PERSON GETS: a supplier who has been booked for a wedding opens that wedding's web
address and sees "You are booked here — open your tools", instead of a locked door telling
them to scan an invitation QR they were never given.

ALREADY SHIPS — DO NOT REBUILD ANY OF IT (verified on origin/main 2026-08-17):
- The event website is 15 routes and is the Event Hub. The owner corrected a previous
  session that called it unbuilt. It is built.
- app/[slug]/_components/vendor-doorway.tsx — the "You are booked here" strip. Complete,
  accessible, last touched 2026-08-03. DO NOT REDRAW IT.
- resolveVendorCapability in app/[slug]/_lib/site-identity.ts — the gate. Correct.
- loadVendorBooking in app/[slug]/_lib/loaders.ts — the read. Correct.
- The link it reads, event_vendors.linked_vendor_profile_id, IS WRITTEN AUTOMATICALLY by
  the lock payload in app/dashboard/[eventId]/vendors/actions.ts (~line 1523), and that
  code's own comment records the gap being closed on 2026-06-19. THERE IS NO WRITER TO
  BUILD.

THE ONE DEFECT — AN ORDERING BUG, NOT A BUILD:
app/[slug]/page.tsx resolves visibility at ~line 414 and, for 'private' or
'invited_accounts', returns <PrivateLanding> at ~line 493 if the viewer is none of:
a matching guest cookie (Path A) · a signed-in host (Path B) · a seat-holder (Path C) ·
an invited account (Path D, 'invited_accounts' only).

A BOOKED SUPPLIER IS NONE OF THOSE FOUR. resolveVendorCapability is not called until
~line 652 — roughly 200 lines after the page has already refused them.

4 of the 6 production events are private, so even after the first real marketplace
booking the strip would appear on only 2 of 6.

BUILD: add the booked-supplier check as a fifth way past the private gate, using the SAME
server-verified booking read the doorway already uses — never a query param, cookie or
prop. Then make sure the body they land on actually carries the doorway.

🔒 SECURITY BOUNDARY, DO NOT CROSS: admitting a supplier to the PAGE must not hand them a
guest session, guest names, or any per-guest surface. The existing seat-holder path (Path C)
is your model — its comment states exactly this rule. Assert what the supplier's payload
does NOT contain, on an event seeded WITH guest names. A test that only checks the happy
path passes while leaking.

ALSO IN SCOPE — the host's own page:
A signed-in host with no guest cookie hits `if (!session) return renderAnonymous(...)` at
~line 778, so the couple opening their OWN event page gets the stranger's body with a
read-only ribbon on top — it can tell them to scan their own invitation QR. Give the owner
capability a body variant. Read-only stays read-only: every real control lives in
/dashboard/[eventId] and this is NOT the session that changes that.

HOW TO PROVE IT: you cannot prove this on the live site — prod has no linked supplier. Seed
one in a test, and separately verify by the object that the lock path really does stamp the
link. State plainly in your reply which half is test-proved and which is observed.

TRAP: the file's own comment warns that 'invited_accounts' must NEVER be folded into a
`!== 'public'` test — that exact spelling mistake once made a brand-new private setting read
as fully public across 31 callers. Add your branch; do not restructure theirs.
```

---

# SESSION 2 · The first screens anyone ever sees
**Wave 1 · pairs with S1 · medium · design port**

```
WHAT A PERSON GETS: signing in, signing up, resetting a password, claiming an invitation or
joining an event all look like the same considered product as the rest of Setnayan. Today
every couple, supplier and guest passes through undesigned screens BEFORE they see anything
good.

WHY THIS IS FIRST AMONG THE DESIGN WORK: it is the highest-traffic, lowest-complexity gap on
the list, and it is the only one every single user meets.

SCOPE — 12 page files, verified present on origin/main 2026-08-17:
/login · /signup · /claim/[token] · /vendor/claim/[token] (+finalize) ·
/join/[eventId] (+check-email, set-password, success) · /papic/join · /papic/claim ·
/samahan/join

ALREADY SHIPS — DO NOT REBUILD:
- The shared top bar and app shell are mounted app-wide (PR #4438). SidebarShell was RETIRED
  on 2026-08-15 (PR #4451) — do not reintroduce it.
- The terracotta palette is locked and enforced by a derived-contrast guard.
- The 19 approved archetypes and overlays in prototypes/archetype_*.html are BINDING.
  PORT them. A difference between your screen and its archetype is a defect in YOUR PORT,
  not a fresh design decision.
- Recent commits on these routes are auth lockout + captcha FIXES, not design. Do not undo
  them.

🎨 TWO GOLDS, TWO RULES — this has bitten twice:
The TEXT gold is #8A6B39. The decorative gold #A9834B is 3.37:1 and must NEVER carry body
copy. Gold has ~0.29 of contrast headroom on cream, so ANY tint under it fails — hover must
move the border or the shadow, never add a fill. A hover tint shipped at 4.42:1 on a live
public page for exactly this reason.

GATE: none. Ship it.
```

---

# SESSION 3 · The screens that say "nothing here" when they mean "we could not load it"
**Wave 3 · 🛑 RUN THIS ONE ALONE — it touches screens app-wide**

```
WHAT A PERSON GETS: when something fails to load, the screen says so. Today a guest opening
an invitation that failed to load sees an abandoned-looking empty page, and a couple with
three real pending requests can be told they have none.

THE FINDING, VERIFIED 2026-08-17: app/_components/states/ exists on origin/main with SEVEN files —
denied-state.tsx, empty-state.tsx, error-state.tsx, loading-skeleton.tsx, locked-state.tsx,
surface-state.ts and its test — and has ZERO consumers. I grepped the whole of apps/web for the
folder path and for each exported name: no importer outside the folder itself. Created 2026-08-02 (commit e43651b40, "the six-state system as
shared primitives"); its only touch since is the blanket contrast sweep of 2026-08-08. Fifteen
days, no adopter.

DO NOT REBUILD THE KIT. It is written. This session ADOPTS it.

THE RULE THAT MAKES THIS WORTH DOING — a refused read and an empty result are the same
value in this codebase. Supabase does not throw; it resolves with an error. So `data ?? []`
turns "you are not allowed" and "the query failed" into "there is nothing here", which then
renders as a cheerful empty state with a tick. Three separate live defects have had this
exact shape.

BUILD, in this order:
1. Find the surfaces where a failed or refused read currently falls into an empty state.
   Start with the ones a stranger or a guest meets — the invitation page and the couple's
   request lists are the two named in the register.
2. Make each distinguish three outcomes: loaded-and-empty · refused · failed. Never collapse
   them.
3. Adopt the kit rather than hand-rolling a fourth spelling of the same card.

🛑 A COUNT OF null MEANS "NOT MEASURED", NOT "ZERO". Filing an unmeasured queue under
"N things are clear" puts it in the one place a person has been told they need not look —
and it looks completely fine.

GUARD: whatever you add must be able to FAIL. Sabotage it and PRINT THE OCCURRENCE COUNT
before and after. Five guards written in one week all passed while the thing they guarded
was gone. A file-level substring count cannot tell you which component still renders a
thing — anchor on the call site.
```

---

# SESSION 4 · Six small things a person would notice
**Wave 2 · pairs with S9 · ⚠ must NOT run beside S6**

```
Six unrelated small fixes, all verified still open on origin/main and in the live database on
2026-08-17. Do them in one PR or six — your call — but verify each one before you touch it.

1. THE HOST CANNOT SEE WHO IS HOLDING WHICH CAMERA.
   app/dashboard/[eventId]/studio/papic/crew/page.tsx renders only
   `Boolean(s.claimer_user_id)` → a "Claimed" or "Open" pill, then the generic sentence
   "A friend has this seat and can shoot." No name, no shots left. Every one of the 18
   non-test uses of that column app-wide is an authorization check or a count — nothing
   anywhere joins a seat to a person's name for display.
   GIVE THEM: the holder's name, and how many shots that camera has left.
   🔒 The names belong to people who claimed a seat for THIS event — scope the read to the
   event and show nothing else about them.

2. A SUPPLIER CAN ONLY TAP SIX FIXED MESSAGES, NEVER A SENTENCE.
   lib/day-requests.ts VENDOR_STATUS_PRESETS is exactly six: On site · Setup done · Ready to
   start · Packed up · Running late · Need help. They cannot type "the cake is melting near
   the lights".
   ALREADY SHIPS — DO NOT REBUILD: the free-text server action submitDayRequest EXISTS at
   app/vendor-dashboard/on-the-day/actions.ts (line 470) and files correctly on the vendor lane.
   TRACE THE MOUNT BEFORE YOU TOUCH IT — it is indirect and easy to get wrong:
     page.tsx:1081  <IssuesLog> rendered only when `kind === 'coordinator'`
       └─ issues-log.tsx:71  is the SWITCH — it renders <RequestsInbox>
            └─ requests-inbox.tsx:88  calls submitDayRequest
   A plain supplier instead gets <VendorStatusUpdates> at page.tsx:534, whose own docblock says
   "nothing here can post arbitrary text".
   THE WORK IS WIRING, NOT AUTHORING: give a plain supplier a free-text box that calls the
   action that already exists.

3. THE EMCEE VANISHES WHEN THEY WERE BOOKED INSIDE A BUNDLE.
   lib/stage-notes-recipients.ts fetchEmceeRecipients hardcodes `serviceCategories: null`,
   and its own in-file comment admits the per-service categories need a second read and that
   "a miss here means the send box does not offer them". So if the band who also emcees was
   booked as one package, the coordinator's message box lists NOBODY and the whole section
   silently disappears — it reads as a wedding with no host.
   ALREADY SHIPS: the pure resolver pickEmceeRecipients ALREADY accepts serviceCategories,
   and eventTilesForBooking already unions both sources. ONLY THE FETCHER IS SHORT.

4. SUPPLIERS ARE TOLD THEY CAN SET THEIR DATE-HOLD LIMIT, AND CANNOT.
   The limit is READ at app/dashboard/[eventId]/vendors/actions.ts:1394 and applied at :1406;
   the comment at :1155 says "vendors can configure max_soft_holds_per_date (default 3, 1-20)",
   and the column's own comment in production names a settings route that DOES NOT EXIST.
   Zero writers app-wide; both live shops sit on the default 3.
   EITHER build the control OR correct both comments to say it is fixed at 3. Do not leave
   the product claiming something untrue. If you build it, respect the 1-20 range.

5. THE OLD CAMERA SCREEN PROMISES 3 FREE CAMERAS ABOVE EIGHT SLOTS.
   app/dashboard/[eventId]/studio/panood/cameras/page.tsx line ~137 still renders
   "You have {PANOOD_FREE_CAMERA_COUNT} cameras free to test with" (=3) while listing eight.
   The number belongs to the old way of counting. Cosmetic; only reachable by an old
   bookmark. ALREADY FIXED and NOT to be touched: the serious half — a paid Live Studio owner
   is no longer told they are on the free tier, pinned by live-studio-cast-retirement.test.ts.

6. EVERY NEW SHOP IS BORN SAYING IT ONLY SERVES BALLROOMS, GARDENS AND HERITAGE HOUSES.
   Verified in production today: the column default is still
   ARRAY['banquet_hall','garden','heritage'] and BOTH live shops hold exactly that. The
   marketplace filter is "is null OR contains {setting}", so the default actively NARROWS a
   shop — a couple with a beach, resort, tent, city-hall or restaurant reception sees fewer
   suppliers than exist.
   ALREADY SHIPS — DO NOT REBUILD: the vendor-facing card exists, saves, and is guarded by a
   test that fails if it stops being rendered.
   THE WORK: change where a shop STARTS (a null/unset default means "no claim", which the
   filter already handles correctly), and prompt existing shops to say. Also verified: there
   is still NOWHERE for a business to say what KIND of venue it is — every writer of that
   field belongs to the separate admin venue directory, and the only reader is the onboarding
   fit check. That half is a real build; scope it or say plainly that you did not.
```

---

# SESSION 5 · The couple's four daily screens
**Wave 4 · pairs with S7 · design port**

```
WHAT A PERSON GETS: the four screens a couple actually opens every day look designed.

SCOPE: app/dashboard/[eventId]/ — guests · vendors · budget · alaala (gallery).

ALREADY DONE — DO NOT REDO: the couple's Overview WAS redesigned (8 commits, 2026-08-08):
frosted panels became flat cream cards, the headline card is solid ink, the digest gained
proper rows plus an RSVP line and a "Meanwhile" card. The four screens above got the card
edges and readable text from the app-wide sweep and NOTHING ELSE. That is this session.

VERIFIED 2026-08-17: commits on these four trees since 2026-08-12 are the shell mount, the
booking handshake, a coverage fix and a payments-lens fix — all functional. No design commit.
⚠ CORRECTED — the 2026-08-12 register said the two named offenders were "untouched since July".
THAT IS NO LONGER TRUE and I nearly pasted it here: build-compare.tsx moved 2026-08-14 and
plan-budget-accordion.tsx 2026-08-15, via the SidebarShell retirement and a marketplace design
unit (2688ce737, "a table that fits"). READ WHAT THAT UNIT ALREADY DID TO THE COMPARISON TABLE
BEFORE REDRAWING IT — some of your scope may already be done.

BINDING: the 19 approved archetypes in prototypes/archetype_*.html. PORT, never redraw — a
difference between your screen and its archetype is a defect in your port.
The ~28 per-surface prototypes were RECONCILED to terracotta on 2026-08-13 and are correct
about COMPOSITION. Reconcile, never redraw.

🎨 Two golds, two rules — text gold #8A6B39; decorative #A9834B never carries body copy;
no tint under gold, move the border or shadow on hover.

TRAP: the budget screen had a real receipt bug fixed on 2026-08-08 (a receipt attached to a
supplier payment was silently thrown away). Do not regress it while restyling.
```

---

# SESSION 6 · The supplier's screens
**Wave 5 · pairs with S10 · ⚠ must NOT run beside S4 · design port**

```
WHAT A PERSON GETS: the sixty-odd screens a supplier works in look designed.

VERIFIED 2026-08-17: the flat cream card treatment DID reach vendor-dashboard in the app-wide
sweep, and two real design units landed on 2026-08-08 — the calendar now says where each
booking came from, and there is one line under Publish. Everything else since is functional
(shop address, publish guards, tier caps, payouts). There are 63 vendor routes, 3 files with
raw tables, and vendor-dashboard/_components holds 23 one-off files — no shared kit.

BUILD THE SHARED KIT FIRST, then adopt it. 23 one-off components across 63 routes is the
actual problem; restyling them individually just makes 63 one-offs that look nicer.

ALREADY SHIPS — DO NOT REBUILD:
- The vendor rail and the shared top bar are mounted (PRs #4432, #4438).
- Per-service schedules, manual blocks, the 6-state day taxonomy, auto-close at deposit, and
  the booked-out waitlist ALL SHIP (PRs #4262-#4264). Do not redraw scheduling.
- The vendor's per-event workspace — brief, headcount, meal splits, timeline, quotes,
  payments, contracts, hand-overs, mood board, seat counts, production sheet — all ships.

GATE: none.
```

---

# SESSION 7 · The five undrawn surfaces
**Wave 4 · pairs with S5 · design**

```
Four places are built but were never drawn, and one of them is where people SHOP.

SCOPE, route counts verified at origin/main:
- /explore — the supplier marketplace (3 page files). THE MOST IMPORTANT ONE.
- /tour — the product walkthrough (5 page files). Its ONLY commit since 2026-08-07 is an
  accessibility contrast fix — no design work has ever touched it.
- /papic — the deeper photo-service pages (10 page files).
- /onboarding — the persona quiz questions, their order and the reveal.

ALREADY DONE ON /explore — DO NOT REDO: one design unit landed 2026-08-13, "sorting you can
see, and why a shop has no name". The marketplace also already has: search by occasion
(shipped complete, the filter was there and only the handle was missing), 15 category labels
in the words people actually type, and a public search across three nouns.

⚠ TWO LIVE GAPS ON THE MARKETPLACE, both worth folding in:
- The phone hides the search shortcut on the doorway pages.
- The real-stories search covers 6 of 34 stories. UNVERIFIED — CHECK FIRST.

BINDING: the approved archetypes. PORT, never redraw.

⚖ ONE OWNER DECISION SITS INSIDE THIS SESSION — DO NOT DECIDE IT YOURSELF: whether the
~450-cell supplier tier matrix stays behind its disclosure or goes entirely, now that each
plan says what it adds. He asked for a matrix on 2026-07-04. Build around it and flag it.
```

---

# SESSION 8 · Your own admin screens
**Runs LAST, alone · design**

```
WHAT A PERSON GETS: the Setnayan team stops working in ninety-odd hand-built tables.

WHY LAST: only your own team sees these. Every other session is customer-facing.

VERIFIED 2026-08-17: 108 admin routes; 33 of the app's 47 raw-table files are under app/admin.
app/admin/_components holds 13 files and none of them is a shared console table.
Commits since 2026-08-12 are all functional (address correction, queue ordering, compliance
sheet, verification screen). ~95 of the 108 admin routes collapse to ONE archetype.

BUILD THE ONE ARCHETYPE, then convert. Do not restyle 33 tables individually.

ALREADY SHIPS — DO NOT REBUILD, a previous session nearly did:
- /admin/work IS ALREADY the ranked work list, with a triage strip, lane chips, and drawers
  that settle payments · verify · approvals in ONE CLICK and reviews · payouts on a form.
- /admin/more IS ALREADY the all-surfaces map.
- /admin/website-media, /admin/booking-fees, /admin/corrections all ship.

🔒 JUDGEMENT QUEUES GET NO BUTTON AT ALL — disputes, fraud, user reports, erasure requests,
integrity watch, concierge abuse, force majeure. Each shows a SENTENCE where the buttons
would be. A fast button invites a wrong call at speed on exactly the queues where being wrong
costs most. DO NOT "improve" this by adding actions.

🔑 THE ACTION SHAPE IS DECIDED BY WHAT THE CODE REFUSES TO RUN WITHOUT, NOT BY TASTE. Read the
server action first: reviews look like a one-click queue until you find it throws without an
override reason.

⚠ admin has NO <main> element — do not copy another tree's shell placement into it.
```

---

# SESSION 9 · Under the floor
**Wave 2 · pairs with S4 · no visible change · 🛑 the riskiest session here**

```
Nothing a person sees. Two things that make one future mistake a near-miss instead of a leak.

1. MOST OF THE DATABASE HAS ONE LOCK WHERE IT SHOULD HAVE TWO.
   Measured in production 2026-08-17: 383 public tables, 306 of them grant the anonymous role
   SELECT. The register measured 216 of those as having no policy admitting an anonymous
   reader — and that number went UP, not down, between 2026-08-05 and 2026-08-12.
   Anyone can get an account with one tap, which is what makes the second lock worth having.
   NOTHING IS LEAKING TODAY. Row-level security is on for all 383.

🛑 THIS IS THE SESSION MOST LIKELY TO BREAK PRODUCTION. Read these before writing a line:
   - READ THE COLUMN DEFAULT BEFORE YOU REVOKE. A previous revoke would have shipped SILENT
     UNIVERSAL AUTO-APPROVAL because the column defaulted to 'approved'. The obvious fix was
     worse than the bug.
   - A TABLE-LEVEL REVOKE DROPS COLUMN GRANTS.
   - THE TEST DATABASE IS MORE PERMISSIVE THAN PRODUCTION, and the replay runs as superuser.
     DRY-RUN EVERY MIGRATION AGAINST PROD INSIDE A ROLLED-BACK TRANSACTION.
   - auth.role() CAN NEVER BE NULL IN THE REPLAY — the shim returns 'anon' where prod returns
     NULL, so every `auth.role() IS NULL` branch is dead code in every db test in this repo.
     Derive from `current_user NOT IN ('authenticated','anon')` instead.
   - AUDIT THROUGH pg_class.relacl, not a catalog view that answers a different question.
   GO IN SMALL BATCHES. Verify each batch by the OBJECT in prod before the next.

2. THE BROWSER PROTECTION WATCHES AND NEVER BLOCKS, AND NOBODY CAN SEE WHAT IT SAW.
   Verified from the live site's own headers 2026-08-17: the ENFORCED policy covers frames
   only; the wide policy is sent report-only. The report endpoint
   app/api/csp-report/route.ts ends at a single console.warn — no Sentry call, no write, and
   production has no table whose name contains "csp".
   SO THE MOMENT TO SWITCH REAL PROTECTION ON NEVER ARRIVES BY ITSELF.
   BUILD: somewhere the reports actually land and can be read. THEN, and only then, is
   tightening the policy a decision somebody can make on evidence.
   DO NOT ENFORCE THE WIDE POLICY IN THIS SESSION. Enforcing a policy learned from nothing
   breaks live pages. Our own frame policy already blocked our own map for weeks.

3. WHILE YOU ARE HERE — UNVERIFIED, CHECK FIRST: the security scanner flags two views as
   running with elevated rights (events_host, vendor_completed_events). This may be entirely
   deliberate. Establish which before touching either.
```

---

# SESSION 10 · The compliance pack
**Wave 5 · pairs with S6 · DOCUMENTS ONLY — opens no PR against the app**

```
WHAT THIS PREVENTS: handing a lawyer or the National Privacy Commission a pack that describes
a product we no longer run, and that contradicts our own public privacy page.

FOUR THINGS, all verified still wrong 2026-08-17:

1. THE PACK IS THREE WEEKS BEHIND THE PRODUCT. The shipped documents list FOURTEEN processing
   activities; we now run NINETEEN. Absent entirely: the guests' public write-ups, the shared
   photo pool, the same-date demand signal, the in-app video calls, the coordinator's day-of
   desk. Proved by reading the shipped PDF, not its date.

2. IT STATES WE DESTROY WEDDING PHOTOS AFTER FIVE YEARS. WE DO NOT AND NEVER WILL.
   The truth, and the public privacy page now says exactly this: the full-resolution original
   is held 6 months from the event's FIRST capture, never less than 3 months after the event
   ENDS, then REPLACED BY A COMPRESSED COPY. THE PHOTO IS NEVER DELETED — only its resolution
   changes. The compressed gallery is free for 5 years, then a paid option at a price not yet
   set, and STILL nothing is deleted. Five years applies to MESSAGES.
   Two side rows still carry the retired "90 days hot then purge" rule.

3. FOUR ROWS STILL SAY THE PHOTOS SIT IN THE PHILIPPINES. They do not. The database is in
   SINGAPORE and object storage is Cloudflare R2 in ASIA-PACIFIC — confirmed in the dashboard
   2026-08-01. There is no Philippines region and we have never had PH residency. One of the
   four wrong rows is the wedding-photos row itself. Our own filing would contradict our own
   public notice.

4. ALL FIFTEEN FILING TASKS ARE STILL "not started" IN PRODUCTION — 15 of 15, read today.

🔴 THREE THINGS ONLY THE OWNER CAN CLOSE — SURFACE THEM, DO NOT ANSWER THEM. He is the
registered data protection officer.
   - Two privacy sign-offs for guest photo-taking have never been signed, while it sells.
   - One of twenty live privacy capabilities has NOBODY'S NAME against it — the anti-fraud
     scoring that can hide a supplier's listing without a person deciding. Untouched since it
     was seeded on 22 July. If a supplier asks who authorised the machine that hid them,
     there is no answer on file.
   - The corrected lawyer's brief about keeping a dead relative's memories: no record
     anywhere that it was ever sent, and no reply on file.

⚠ NEVER WRITE "COUNSEL CLEARED" FOR PHASE 2. No external Philippine counsel opinion exists.
The condition was discharged by the owner's own ruling as the registered DPO. A future reader
will act on the stronger claim.

🚨 A COMPLIANCE DRAFT GOES STALE INTO A MISSTATEMENT TO A REGULATOR. That is why this is a
session and not a chore.
```

---

## What is deliberately NOT in these ten

- **The avatar maker** (nobody in the 3D room can look like themselves). A real feature build,
  not a fix — it deserves its own scoping pass, not a slot in a cleanup wave.
- **The photo-wall picker** on the couple's own website. Small, but the Live Photo Wall's product
  shape has an unresolved contradiction on file (`Pricing.md` says hide it while the SKU is
  active and publicly listed). Settle that first.
- **A supplier-shaped view of the event** — the last Event Hub step. **Blocked on the owner's
  ruling about how much of the couple's private plan a booked supplier may see.**
- **Anything requiring a flag flip, a price, a signature or a ruling.** Those are the 15 items in
  §6 of the register and no session can close them.
