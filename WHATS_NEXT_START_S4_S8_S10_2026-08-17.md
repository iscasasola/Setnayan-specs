# Start S4 · S8 · S10 — ready to paste, 17 August 2026 (evening)

> 📄 **COPY-PASTE PAGE (one button per prompt):**
> <https://claude.ai/code/artifact/32b8e301-6d2c-433d-976f-b3490d694d67>

> Every anchor below was **re-read from `origin/main` and the live production database after
> today's twenty merges** — not carried over from this morning's version of these prompts. Where a
> number changed, it is the new one.
>
> ✅ **Main is GREEN and production serves its build.** Safe to branch.
>
> 🛑 **These three are measured CLEAR of each other and of everything in flight**
> (#4500 sign-up · #4501 the account chip · #4492 the leak fix — all tiny).
> **S10 opens no pull request at all** — it is documents, so it cannot collide with anything and
> does not count against the two-at-a-time rule.
>
> ⛔ **NEVER pair S4 with S6** (55 shared files) and **never pair S5 with S11** (118). Neither is
> in this set; the rule is here so nobody adds one later.

Paste the **shared header** from
[`WHATS_NEXT_SESSION_PROMPTS_2026-08-17.md`](WHATS_NEXT_SESSION_PROMPTS_2026-08-17.md) on top of
each block. ⚠ **Update its production line to today's evening numbers:** 6 events (4 private) ·
39 guests · 2 shops, 1 published · 14 photos · **0 orders ever** · 290 of 384 tables still
readable by a stranger.

---

# S4 · Eight small things a person would notice
**start first · highest value per hour · pairs with S8**

```
Eight unrelated small fixes. EVERY ONE re-verified still open on origin/main and in the live
database on the EVENING of 2026-08-17, after today's twenty merges. Do them in one PR or eight.

1. THE HOST CANNOT SEE WHO IS HOLDING WHICH CAMERA.
   app/dashboard/[eventId]/studio/papic/crew/page.tsx renders only a "Claimed"/"Open" pill and the
   generic sentence "A friend has this seat and can shoot." (still present today). No name, no
   shots left. Every one of the ~18 non-test uses of the claimer column app-wide is an
   authorisation check or a count — nothing anywhere joins a seat to a person's name for display.
   GIVE THEM: the holder's name, and how many shots that camera has left.
   🔒 Scope the read to THIS event and show nothing else about that person.

2. A SUPPLIER CAN ONLY TAP SIX FIXED MESSAGES, NEVER A SENTENCE.
   lib/day-requests.ts still has exactly SIX preset entries: On site · Setup done · Ready to
   start · Packed up · Running late · Need help. They cannot type "the cake is melting near the
   lights".
   ALREADY SHIPS — THIS IS WIRING, NOT AUTHORING: the free-text server action submitDayRequest
   EXISTS at app/vendor-dashboard/on-the-day/actions.ts:470 and files correctly on the vendor lane.
   TRACE THE MOUNT — it is indirect and easy to get wrong:
     page.tsx:1081  <IssuesLog> rendered only when `kind === 'coordinator'`
       └─ issues-log.tsx:71  is the SWITCH — it renders <RequestsInbox>
            └─ requests-inbox.tsx:88  calls submitDayRequest
   A plain supplier instead gets <VendorStatusUpdates> at page.tsx:534, whose own docblock says
   "nothing here can post arbitrary text".

3. THE EMCEE VANISHES WHEN THEY WERE BOOKED INSIDE A BUNDLE.
   lib/stage-notes-recipients.ts still hardcodes `serviceCategories: null` (confirmed today), and
   its own comment admits "a miss here means the send box does not offer them". So if the band who
   also emcees was booked as one package, the coordinator's message box lists NOBODY and the whole
   section silently disappears — it reads as a wedding with no host.
   ALREADY SHIPS: the pure resolver pickEmceeRecipients ALREADY accepts serviceCategories and
   eventTilesForBooking already unions both sources. ONLY THE FETCHER IS SHORT.

4. SUPPLIERS ARE TOLD THEY CAN SET THEIR DATE-HOLD LIMIT, AND CANNOT.
   Re-counted today: ZERO writers of that column anywhere in app code. The limit is READ at
   app/dashboard/[eventId]/vendors/actions.ts:1394 and applied at :1406; the comment at :1155 says
   "vendors can configure max_soft_holds_per_date (default 3, range 1-20)"; and the column's own
   production comment names a settings route that DOES NOT EXIST. Live: BOTH shops sit on 3.
   EITHER build the control OR correct both comments to say it is fixed at 3. Do not leave the
   product claiming something untrue. If you build it, respect the 1-20 range.

5. THE OLD CAMERA SCREEN PROMISES 3 FREE CAMERAS ABOVE EIGHT SLOTS.
   app/dashboard/[eventId]/studio/panood/cameras/page.tsx still renders "You have 3 cameras free
   to test with" while listing eight. Cosmetic; only reachable by an old bookmark.
   ⛔ ALREADY FIXED, DO NOT TOUCH: the serious half — a paid Live Studio owner is no longer told
   they are on the free tier, pinned by live-studio-cast-retirement.test.ts.

6. EVERY NEW SHOP IS BORN SAYING IT ONLY SERVES BALLROOMS, GARDENS AND HERITAGE HOUSES.
   Live today: the column default is still ARRAY['banquet_hall','garden','heritage'] and BOTH
   shops hold exactly that. The marketplace filter is "is null OR contains {setting}", so the
   default actively NARROWS a shop — a couple with a beach, resort, tent, city-hall or restaurant
   reception sees fewer suppliers than exist.
   ALREADY SHIPS — DO NOT REBUILD: the vendor-facing card exists, saves, and a test fails the
   build if it stops being rendered.
   THE WORK: change where a shop STARTS (a null/unset default means "no claim", which the filter
   already handles correctly), and prompt existing shops to say.
   ⏭ SEPARATELY: there is still NOWHERE for a business to say what KIND of venue it is — every
   writer of that field belongs to the admin venue directory, and the only reader is the
   onboarding fit check. That half is a real build; scope it or say plainly that you did not.

7. A PHOTOGRAPHER CAN ONLY SEE THEIR OWN SHOTS DURING THE WEDDING DAY ITSELF.
   app/vendor-dashboard/on-the-day/live/[eventId]/papic/page.tsx mounts the "what you shot" strip
   and the SAME page redirects away at line 50 with
   `if (!booking || booking.bookedDate !== phToday()) redirect(back)`. The parent console carries
   the identical gate. At midnight the door shuts; the next morning — when the shooter actually
   wants to confirm a shot landed — it is closed.
   THIS IS PURELY A SCREEN LIMIT, NOT A PERMISSION ONE. Verified in production: the row policy on
   those captures is "the vendor owns this profile OR is an admin", with NO date condition at all.
   ⚠ The whole route also sits behind a separate feature flag. Do not confuse the two gates and do
   not flip the flag.

8. UNVERIFIED — MEASURE BEFORE YOU BUILD: an older scope document claims every booked supplier
   sees a "start the next item" control that only a coordinator may press, with the refusal
   swallowed. I could NOT confirm it: app/_components/run-of-show-header.tsx says in its own
   docblock that `canAdvance` gates the control to the host/coordinator "(and the booked vendor,
   who is also allowed by the RPC)". So the control may be correct as shipped.
   FIND OUT WHICH IS TRUE — read what passes canAdvance at every call site, and read the RPC. If a
   refusal path exists at all it must SAY something; a guard that refuses in silence is
   indistinguishable from one that passed. If the claim is false, say so plainly and CLOSE it —
   do not build a fix for a bug that is not there.
```

---

# S8 · Your own admin screens
**pairs with S4 · internal-only, so a mistake reaches your team, not a customer**

```
WHAT A PERSON GETS: the Setnayan team stops working in ninety-odd hand-built tables.

RE-COUNTED ON THE EVENING OF 2026-08-17: 108 admin routes · 34 files under app/admin still contain
a raw <table> (that is UP by one since this morning — the debt is still growing) ·
app/admin/_components holds 13 files and none of them is a shared console table.
~95 of the 108 routes collapse to ONE archetype.

BUILD THE ONE ARCHETYPE, THEN CONVERT. Do not restyle 34 tables individually — that produces 34
nicer one-offs and the same problem.

ALREADY SHIPS — DO NOT REBUILD. A previous session nearly did:
- /admin/work IS ALREADY the ranked work list, with a triage strip, lane chips, and drawers that
  settle payments · verify · approvals in ONE CLICK and reviews · payouts on a form.
- /admin/more IS ALREADY the all-surfaces map.
- /admin/website-media, /admin/booking-fees and /admin/corrections all ship.
- The shared top bar is mounted app-wide and SidebarShell was RETIRED on 2026-08-15 — do not
  reintroduce it.

🔒 JUDGEMENT QUEUES GET NO BUTTON AT ALL — disputes, fraud, user reports, erasure requests,
integrity watch, concierge abuse, force majeure. Each shows a SENTENCE where the buttons would be.
A fast button invites a wrong call at speed on exactly the queues where being wrong costs most.
DO NOT "improve" this by adding actions.

🔑 THE ACTION SHAPE IS DECIDED BY WHAT THE CODE REFUSES TO RUN WITHOUT, NOT BY TASTE. Read the
server action first: reviews look like a one-click queue until you find one throws without an
override reason, and payouts need the method AND the reference of a hand-made transfer.

🪤 `count === null` MEANS "NOT MEASURED", NOT "ZERO". Filing an unmeasured queue under "N queues
are clear" puts it in the one place a reader has been told they need not look, and it looks
completely fine.

⚠ admin has NO <main> element — do not copy another tree's shell placement into it.

🎨 TWO GOLDS, TWO RULES: the Tailwind slot named `terracotta` is the atelier GOLD #A9834B and the
CTA terracotta #C24E25 lives in the slot named `mulberry` — inherited, and BACKWARDS, so
`text-terracotta` LOOKS safe and is the unsafe one at 3.37:1 on cream. Use `text-mulberry`
(4.61:1) or `text-link` (8.22:1). Gold on an ICON is fine, never on text. CHECK BOTH THEMES.
```

---

# S10 · The compliance pack
**runs alongside anything · DOCUMENTS ONLY — opens no pull request against the app**

```
WHAT THIS PREVENTS: handing a lawyer or the National Privacy Commission a pack that describes a
product we no longer run, and that contradicts our own public privacy page.

FOUR THINGS, all re-verified on the evening of 2026-08-17:

1. THE PACK IS THREE WEEKS BEHIND THE PRODUCT. The shipped PDFs under apps/web/assets/npc-docs/
   have not changed since 2026-07-23 (confirmed today). They list FOURTEEN processing activities;
   we now run NINETEEN. Absent entirely: the guests' public write-ups, the shared photo pool, the
   same-date demand signal, the in-app video calls, the coordinator's day-of desk.
   PROVE IT BY READING THE SHIPPED PDF, NOT ITS DATE.

2. IT STATES WE DESTROY WEDDING PHOTOS AFTER FIVE YEARS. WE DO NOT AND NEVER WILL.
   The truth, and the live privacy page now says exactly this: the full-resolution original is held
   6 months from the event's FIRST capture, never less than 3 months after the event ENDS, then
   REPLACED BY A COMPRESSED COPY. THE PHOTO IS NEVER DELETED — only its resolution changes. The
   compressed gallery is free for 5 years, then a paid option at a price not yet set, and STILL
   nothing is deleted. Five years applies to MESSAGES.
   Two side rows still carry the retired "90 days hot then purge" rule.

3. FOUR ROWS STILL SAY THE PHOTOS SIT IN THE PHILIPPINES. They do not. The database is in
   SINGAPORE and object storage is Cloudflare R2 in ASIA-PACIFIC — confirmed in the dashboard
   2026-08-01. There is no Philippines region and we have never had PH residency. One of the four
   wrong rows is the wedding-photos row itself, so our own filing contradicts our own public
   notice.

4. ALL FIFTEEN FILING TASKS ARE STILL "not started" — 15 of 15, read from production today.

🔴 THREE THINGS ONLY THE OWNER CAN CLOSE — SURFACE THEM, DO NOT ANSWER THEM. He is the registered
data protection officer.
   - Two privacy sign-offs for guest photo-taking have never been signed, while it sells.
   - One of twenty live privacy capabilities has NOBODY'S NAME against it — the anti-fraud scoring
     that can hide a supplier's listing without a person deciding. Untouched since 22 July.
   - The corrected lawyer's brief about keeping a dead relative's memories: no record anywhere
     that it was ever sent, and no reply on file.

⚠ NEVER WRITE "COUNSEL CLEARED" FOR PHASE 2. No external Philippine counsel opinion exists. The
condition was discharged by the owner's own ruling as the registered DPO. A future reader will act
on the stronger claim.

✅ AND DO NOT RE-INVESTIGATE THESE — they were checked today and are NOT findings:
   - The two tables nothing creates (`event_service_deliveries`, `pioneer_incentive_logs`) are
     named in `20271011873973_reconcile_declared_schema_to_production.sql` as "the two prod-only
     TABLES", deliberately not back-filled because declaring them would widen the exposure surface
     and fail the freeze. Known, dated, reasoned.
   - The supplier radar is ON in production and is SOLD on /vendors; only an OFF switch is
     missing, which nobody needs. The homepage spotlight strip is off because /vendors lists it as
     "soon" — off is CORRECT.

🚨 A COMPLIANCE DRAFT GOES STALE INTO A MISSTATEMENT TO A REGULATOR. That is why this is a session
and not a chore.
```

---

## Not in this set, and why

- **S3** ("we couldn't load it") — its own scope is 7 files but its job is to adopt them app-wide,
  so its real footprint cannot be predicted from a file list. **Runs alone, whenever it runs.**
  Still 0 consumers today.
- **S5 · S6 · S7 · S11** — all clear of the in-flight work, but S4+S6 and S5+S11 are the two pairs
  that must never share a wave. Take them after these.
- **The camera-seat consent gate and the next grant batch** — both belong to S9's stream; the
  first needs the owner's ruling before any build.
- **The four changes from 2026-08-15** (#4471 · #4472 · #4473 · #4478) are still broken on their
  own merits now that main is green. One was hiding a real disclosure. They need reading, not
  re-arming.
