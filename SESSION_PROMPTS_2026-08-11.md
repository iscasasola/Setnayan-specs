# Ready-to-paste session prompts · 11 August 2026

> **Copy one block at a time into a new session.** Each is self-contained — it carries the
> verified evidence, the do-not-rebuild warnings and the traps, so a cold session does not
> repeat the 15-agent investigation that produced it.
>
> 🛑 **DO NOT START MORE THAN TWO AT ONCE.** This project has a recorded case of ten parallel
> builds shipping **44 defects**, and the shared checkout has been clobbered three times.
> Sessions 1 and 2 touch different areas and can overlap. Everything else: one at a time.
>
> ⚠ **Order:** 2 → 1 → 3 → 6 → 5 → 7 → 4, then the after-launch ones. Session 2 first because
> it is the only item with no fallback.

---

## SHARED HEADER — paste this at the top of EVERY block below

```
Read /Users/icecasasola/CLAUDE.md and ~/Documents/Claude/Projects/Setnayan/CLAUDE.md first.

RULES THAT OVERRIDE YOUR DEFAULTS:
- RULE 0 — FIND IT BEFORE YOU BUILD IT. This project is ~2 years old. Assume what you are
  asked for already exists and your job is to locate and extend it. Twenty features were
  confirmed shipped on 2026-08-11 that had been reported missing.
- A DOCUMENT IS NOT EVIDENCE — including this prompt. Verify against shipped code and the
  live production database (Supabase project njrupjnvkjkitfctetvi) before acting. The
  file:line references below were verified on 2026-08-11 but the tree moves.
- A rejected query is not a thrown error. A phantom column, enum value, function argument,
  a blocked iframe or a missing grant all fail the same way: the only symptom is an absence.
- Branch FIRST, then `git worktree add`. Never work in the shared main checkout — it holds
  another session's uncommitted files.
- Prune your worktree the moment your PR merges.
- Add a changelog fragment in changelog.d/. Do NOT edit CHANGELOG.md or STATUS.md.
- `gh pr merge <PR#> --auto --merge` immediately after creating the PR. This is the standing
  default; do not ask.
- After the PR merges, VERIFY THE CHANGE REACHED PRODUCTION BY QUERYING THE OBJECT. Prod
  deploys have silently stopped migrating before.
- Reply to the owner in plain English: what a PERSON experiences. No file paths, function
  names, table names, SQL or flag names in your answer to him.
```

---

# SESSION 2 · Nobody can forge a message *(do this first)*

```
TASK: A couple signed into their own account can post a message into their conversation with
a supplier and stamp it as coming FROM THE SUPPLIER, or from Setnayan itself. The supplier
sees words they never wrote and cannot delete them. Faking one supplier reply also unmasks
that supplier's real personal name to the couple before they have ever replied.

WHY IT IS URGENT AND CHEAP: there is no de-list fallback — messaging cannot be switched off.
Production has zero messages today, so fixing it now costs nothing and later costs a
migration over real conversations.

VERIFIED 2026-08-11 (re-verify before acting):
- public.chat_messages: the only INSERT policies are chat_messages_member_insert (which does
  NOT constrain sender_role or sender_user_id in its WITH CHECK) and chat_messages_block_guard.
- `authenticated` holds column-level INSERT/UPDATE on sender_role and sender_user_id.
- There is no BEFORE INSERT trigger, no CHECK, and no column default enforcing the sender.
- Correct stamping exists ONLY in the app layer: lib/chat-send.ts:140-163.
- A browser client ships at lib/supabase/client.ts, so the app layer can be bypassed entirely.
- THREE AFTER INSERT triggers branch on the attacker-supplied role:
  reveal_vendor_name_on_first_reply, tg_chat_messages_unlock_vendor_name,
  stamp_vendor_first_reply. That is how forging a reply leaks the vendor's real name.
- There is no UPDATE or DELETE policy, so a planted message cannot be removed by anyone.

WHAT TO BUILD: make the database itself decide who the sender is, rather than trusting what
the browser sends. Revoke the column-level write on the sender fields and derive the sender
server-side from the authenticated identity and that person's role in the thread.

MUST DO: prove the hole exists BEFORE you fix it (insert a forged row as the authenticated
role in a test), then prove the same insert is refused after. A fix you never saw fail is not
a verified fix. Add a db test in apps/web/tests/db/ following the shape of
bottleneck-signals-internal-only.db.test.ts — anti-vacuity META tests, a behavioural test,
and a neutralisation test that proves the guard can actually fire.

WATCH OUT: check whether the three triggers should also stop trusting the stored role.
```

---

# SESSION 1 · Stop saying things that are not true

```
TASK: Twelve places the product currently misleads someone. Every one is a small truthful
edit or a catalog switch. Do them in ONE pass — several touch the same screens.

VERIFIED 2026-08-11 (re-verify each before editing):

1. ₱2,000 guest "Stories" add-on buys nothing. PAPIC_ADDON_STORIES is_active=true in prod,
   but nothing reads whether it was bought — the story maker is free by design
   (lib/guest-stories.ts:17). TAKE OFF SALE. Note: it was deliberately retired by migration
   20270328922621:36-41 and accidentally re-activated by a blanket sweep in 20270710619774:21.
   ⚠ ASK THE OWNER TO CONFIRM before switching it off — that sweep was also his instruction.

2. "You have a new confirmed booking" is sent before the supplier agrees.
   app/dashboard/[eventId]/vendors/actions.ts:625 sets 'contracted', :1550-1554 emits it.
   Reword to say the couple has marked them as booked.
   ⚠ DO NOT BUILD AN AGREE/DECLINE FLOW — it already ships, under the word DEPOSIT.

3. Booth-reel submission claims a server render + email within the hour.
   render-form.tsx:138-142. It actually renders in the browser on the next screen
   (reel-renderer.tsx:151-163), which correctly says "keep this tab open". Fix the three
   sentences. ⚠ DO NOT BUILD A RENDERER — the browser render and the ready-email both work.

4. Gift page: couple is told "This is what guests see" while guests get a 404.
   Misleading sentence at pabuya-manager.tsx:566-569 (branches only on private-vs-public);
   the gate is lib/egift.ts:54-56. Either the owner switches the page on, or change the
   sentence. Also: its only inbound link is studio/page.tsx:503, and studio redirects to
   /suite when the Suite is on — so the couple may have no way to reach the screen at all.

5. "We'll email you when these vendors are live" — nothing can send it.
   couple_event_type_notify_signups (app/explore/actions.ts:56) and
   couple_wedding_type_notify_signups (create-event/actions.ts:689) have no admin surface and
   no entry in lib/daily-email-jobs.ts. Both tables are EMPTY, so nobody is stranded yet.
   Reword to "Thanks — we've noted your interest".

6. "Your stream is not running" shown mid-broadcast.
   lib/live-studio-roam-provision.ts:549 and :551, returned at :642-651 and :666-673 AFTER
   the broadcast was saved and the watch URL written. Rendered by transport-row.tsx:130-141.

7. Onboarding shows a livestream card at ₱0. onboarding-pricing.ts:82 points at the retired
   PANOOD_SYSTEM; the missing-row branch at :288-300 zeroes it. Point it at the live product
   or drop the card. Same defect was fixed on two other keys on 2026-07-21 — copy that fix.

8. Two livestream tiles in the couple's Studio, one labelled Free, both opening the paid page.
   Retired entry survives at lib/add-ons-catalog.ts:660-694 with no surface flag.

9. Photo wall reads "In build" on the price list though it works end to end.
   Stale comment at lib/v2-catalog.ts:157-158.

10. Guest event hub has no page title — app/[slug]/hub/page.tsx:95-97 exports robots only,
    every sibling sets a title. A guest bookmarking it sees our marketing title.

11. Two dead vendor price rows sit beside near-identical live ones on the admin pricing
    screen: booth_studio (order 86) and vendor_custom_included_token, both active, neither
    used as a SKU code. The live one is vendor_3d_booth (order 85). Switch both dead ones off.

12. The ₱2,500 photo wall is described to the couple as a venue projection only
    (live-wall-card.tsx:130-137). It also mirrors to every guest's phone
    (site-body.tsx:1219). Add the missing sentence. The real on/off switch is SESSION 7 —
    do not build it here.

GATE: item 1 needs the owner's yes before you switch it off.
```

---

# SESSION 3 · LED backdrop — de-list *(build only if the owner says build)*

```
DECISION FIRST — ASK THE OWNER BEFORE WRITING CODE:
A couple pays ₱1,000 for the animated monogram, is told the LED backdrop is included, designs
a loop, presses a button saying it is queued for render — and nothing is ever made. Ten
screens plus the public features page (both languages) promise an 8K file and a posted USB.

Option A (MINUTES): remove the promise. Option B (2+ SESSIONS + PAID INFRASTRUCTURE): build
a real server render farm — the ONLY thing in the product that needs one; everything else
renders in the customer's browser. Posting the USB is an operations process, not code.
Nobody is refunded either way: nothing has ever been bought.

VERIFIED 2026-08-11:
- led_background_renders has ZERO writers and ZERO readers in apps/, packages/ and scripts/.
- No worker directory, no wrangler config, no Remotion, no server ffmpeg. The generic
  render_jobs queue is also inert.
- Copy sites to edit for Option A: studio/led/page.tsx:102,106,133,147,265-267,279,284;
  led-background-maker.tsx:331,352,423-427,479-482,491-494; lib/add-ons-catalog.ts:504,816;
  lib/add-ons-detail.ts:317-331; lib/todays-one-thing.ts:146; lib/wedding-plan-groups.ts:448;
  lib/wizard.ts:500; app/features/_sections/_DayOfApparatus.tsx:73-74 and 120-121.
- Bundle alias that unlocks the maker on monogram purchase: lib/entitlements.ts:250.

✅ ALREADY DONE 2026-08-11 — DO NOT REDO: migration 20271128898031 stripped the LED clause
from the catalog blurb and added tests/db/sellable-promises.db.test.ts, which fails if any
live price row mentions LED again. The standalone ₱499 LED SKU is already inactive.

✅ DO NOT TOUCH THE DESIGN EDITOR — saving works, survives reopening, resolves the palette
from the couple's mood board, and is properly private. Only the render is absent.
```

---

# SESSION 6 · Addresses that survive being printed

```
TASK: three related defects in how public web addresses are minted and changed.

1. RENAMING A WEDDING PAGE KILLS EVERY PRINTED INVITATION.
   The field promises old links keep working for 90 days (slug-field.tsx:101). Forwarding rows
   ARE written (invitation/actions.ts:200-208) but the only reader
   (lib/public-event-url.ts:112-120) returns null unless NEXT_PUBLIC_U_NESTING_CUTOVER is on —
   measured OFF in prod. So forwarding has never once worked. Measured live: the one wedding
   that has been renamed 404s on its old address today.
   ⚠ Save-the-dates go out 6–12 months ahead, so 90 days is too short even once it works —
   raise the window with the owner.
   Renamed PERSON handles write the same rows and nothing reads those either.
   Minutes-long fallback: hide the rename field.

2. AUTO-INVENTED SHOP ADDRESSES CAN PERMANENTLY COLLIDE WITH OUR OWN PAGES.
   Prod function business_slug_is_reserved lists 61 words and is missing all 15 in the repo's
   own KNOWN_DB_MINT_GAP baseline (tests/db/vendor-business-slug-mint.db.test.ts:225-251),
   including `creators` and `open-shop`, which return 200/307 live. The mint probe
   (20271117527966:245-257) checks reserved + shops + events only — not people, not held
   addresses. Meanwhile the app-side answer (lib/slug-availability.ts) checks all five sources
   and feeds the wizard preview — so THE WIZARD PREVIEWS A SAFE NAME WHILE THE SYSTEM MINTS
   THE COLLIDING ONE. Fallback: stop auto-minting and require the owner to pick.

3. NO WAY TO CORRECT A SHOP ADDRESS, EVEN FOR THE SETNAYAN TEAM.
   Trigger vendor_profiles_business_slug_immutable is live and its own migration
   (20271124956492:52-56) states nobody can correct an address. lib/vendor-corrections.ts:56-66
   lists nine correctable fields; the address is not one. An escape hatch named
   'allow_slug_change' exists with zero callers. Permanent-by-design is CORRECT — build the
   admin correction path, do not weaken the trigger.

✅ DO NOT REBUILD THE SHARED NAME LIST — weddings, shops, people and retired-address holds are
already checked in one answer, and it fails closed if any check is unreadable.
```

---

# SESSION 5 · Bot protection — all three, or the switch stays off

```
TASK: three holes that each lock real people out SILENTLY the moment bot protection is
switched on. Nothing is wrong today because it is off. ALL THREE must ship before anyone
flips the switch.

1. OUR OWN SECURITY HEADER BLOCKS THE BOT CHECK ITSELF.
   The live header on /login lists only YouTube, Vimeo, Instagram, TikTok and OpenStreetMap
   under frame-src — challenges.cloudflare.com is absent (next.config.ts:205-208). The check
   draws in a window from that host, so every sign-in, sign-up and password change would be
   refused, including the owner's. The report-only policy at :165/:170 has the same omission.
   ⚠ THE EXISTING GUARD CANNOT CATCH THIS: lib/csp-embeds-are-allowed.test.ts:69/111 only
   matches a literal `<iframe` in .tsx files, so it skips every file involved. Fix the guard
   too — it must catch a window created by an outside script, not just markup we wrote.
   This is the SAME failure that made the supplier map a grey box for weeks.

2. FORGOT-MY-PASSWORD WAS NEVER WIRED, ON EITHER HALF.
   app/forgot-password/actions.ts:29 calls resetPasswordForEmail with no captcha option and no
   import; page.tsx:165 renders the form with no widget. It is the only reset call site in the
   repo and it is linked from the sign-in card — i.e. it is the visible way out of a lockout.
   ⚠ OWNER_ACTIONS.md claims every sign-in form is wired. That is false. Do not trust it.

3. THE TWO SCAN-A-POSTER CLAIM SCREENS EXPECT A STAMP THEY NEVER ASK FOR.
   The server actions already read a token (app/papic/actions.ts:120-122,
   app/panood/actions.ts:89-91) and their comments claim the form carries a widget — it does
   not; only signup, sign-in and profile import it. Live probe: /papic/claim/<junk> serves
   "Start shooting" (ON in production right now), /panood/cam/<junk> serves "Sign in to join
   this camera" (off). A third bare anonymous sign-in on the guest camera-pick path has a
   comment accepting that captcha will refuse it — decide what happens there.

⚠ DO NOT ADD THE ONBOARDING RATE LIMIT TO THE CLAIM SCREENS. It was considered and rejected:
a venue shares one connection, so it would cut off the sixth crew member at every wedding.
The per-address cap is wired into onboarding ONLY, deliberately.

ORDER WHEN GOING LIVE: key set + redeploy FIRST, then the widgets, then enforce. Any other
order rejects real people.
```

---

# SESSION 7 · The couple can turn the photo wall off

```
TASK: The ₱2,500 photo wall mirrors onto EVERY invited guest's phone for the whole day. The
couple is told it is a venue projection. A couple who revokes every venue screen code will
believe the wall is off — it is still running in every guest's hand.

VERIFIED 2026-08-11: a saved setting for exactly this already exists —
events.live_photo_wall_visibility — with ZERO app reads, ZERO app writes and ZERO database
consumers. Every event sits at its default 'tagged_only'. The guest mirror is gated only on
SKU ownership at site-body.tsx:1219 (isLive && liveWall). The couple's own card is venue-only
at live-wall-card.tsx:130-137. The one honest sentence about the phone mirror lives on a
different page entirely: website/privacy/page.tsx:283-290.

BUILD: make the existing setting real — give the couple the control, and make the guest
mirror READ it. Half a session for on/off. The 'tagged_only' option (only the photos a guest
appears in) is a further session — confirm with the owner whether he wants it now.

🔑 THIS IS THE "GATE WITH NO HANDLE" PATTERN, THE THIRD TIME IN THIS PROJECT: a column that
nothing writes, or nothing reads, silently disables a shipped feature. When you finish, grep
the column and confirm every hit is now either a real read or a real write.
```

---

# SESSION 4 · Live Studio — the honest path *(needs an owner errand first)*

```
OWNER ERRAND THIS DEPENDS ON: create a Setnayan YouTube channel, phone-verify it, enable live
streaming (YouTube imposes a 24-HOUR WAIT), then connect it on the admin screen that already
exists and set the Google credentials. Until that exists, the automatic one-tap route cannot
work at all and the honest option is to take Live Studio off sale (one catalog switch).

⚠ CORRECT THE RECORD BEFORE YOU START: THREE WAYS TO GO ON AIR ALREADY SHIP AND WORK —
paste your own YouTube broadcast link (setup/actions.ts:85-107), paste a Facebook Live link
(:124-146), and guest-picked phone viewing (lib/live-studio-guest-pick.ts). An earlier
investigation recommended removing the free single-camera path; that was WRONG and would have
deleted working code. DO NOT REMOVE ANY OF THE THREE.

✅ ALSO ALREADY SHIPS, DO NOT REBUILD: the host's "we are live" switch (full-width button
under the programme monitor on the current controller), and camera passes do NOT lose the
time of day (they carry no dates at all).

WHAT TO BUILD:
1. A host who streams by hand loses the red on-air light and the paid highlight button.
   control/[eventId]/page.tsx:475 derives isLive purely from a broadcast row, and the manual
   route writes only the watch-link column (control/actions.ts:709-730). Broadcast rows have
   exactly one writer, inside the automatic go-live. The controller's own copy
   (page.tsx:1876-1879) pushes the host down the manual route — so this is the likely path a
   first real customer takes.
2. The printable camera hand-out sheet has no doorway. Only link is cameras/page.tsx:149, and
   the only links to that page sit on the retired control room which redirects away on its
   first line. ⚠ THIS IS NOT A ONE-HOUR LINK JOB: the sheet prints one unlabelled card per
   camera under the OLD model, while the current controller mints one join code PER CHANNEL.
   Linking it as-is hands out cards nobody can match to a camera. Rework the sheet first.
```

---

# AFTER LAUNCH

## SESSION 8 · Consent and labels

```
1. Approving a supplier's request for the couple's guest list records NO privacy consent.
   access-requests/actions.ts:44-135 upserts the grant plus a per-area decision map and the
   decider, but writes no coordinator_access_consents row. The invitation route
   (hosts/actions.ts:172-196) does. Copy that. The third door (auto-grant on downpayment)
   already refuses itself for exactly this reason at lib/coordinator-grant.ts:42-48.
   ⚠ SMALLER THAN IT SOUNDS: the per-area record IS filed and DOES reach the couple's data
   export, and the host answers each area separately. Only the disclosure and the formal
   consent record are missing. Quarter of a session.

2. A wedding-day announcement's sender label is decoration. Both INSERT policies on
   coordinator_broadcasts bind the account but never the role; the only CHECK is a two-value
   list; the column default is 'coordinator'; there is no BEFORE trigger. Correct stamping is
   app-layer only (lib/coordinator-broadcasts-server.ts:78-112).
   ⚠ GUESTS SEE NO SENDER AT ALL — the guest loader selects body and time only. The false
   label lands only on the couple's own dashboard (coordinator-broadcast-card.tsx:27-30).
   🔑 SEPARATE REAL ISSUE FOUND HERE: the guest-facing announcement read ignores the feature's
   privacy control entirely. Fix that too.
```

## SESSION 9 · Loose ends

```
1. A vendor add-on has two independent on/off switches with nothing keeping them in step.
   platform_settings.vendor_addon_tiered_pricing_enabled = true (default false). Migration
   20271001130000:28 says "flip together with the env flag" — PROSE ONLY, no lint, no test.
   papic_create_vendor_challenge has EXECUTE granted to authenticated and its SQL gate skips
   the paid-tier check when the DB flag is true; the env half is enforced only at
   photo-challenge-actions.ts:161-171. So a free-tier vendor calling the service directly
   gets a paid add-on without paying. Harmless today — no vendor pays for anything.
   Collapse to one switch. Fallback: seconds — turn the database half back off.
   🔑 A COMMENT IS NOT A MECHANISM. That is the whole lesson of this item.

2. No nudge or deadline for a supplier sitting on a recorded deposit. The deposit-handshake
   migrations contain no expire or interval logic. Reminder pattern to copy: lib/ghosting.ts,
   driven post-response from the three dashboard layouts — THIS PROJECT IS DELIBERATELY
   CRON-FREE, do not add a scheduler.
   ⚠ DO NOT REBUILD THE 48-HOUR ENQUIRY CHASE — it already ships.
```

## SESSION 10 · Show a chapter to guests but not to strangers

```
PRODUCT DECISION FIRST — ASK THE OWNER WHETHER HE WANTS THIS AT ALL.
The couple can already turn a section of the after-the-wedding page off for everybody, or set
the whole page to Public / Unlisted / Private (defaulting to Private). Unlisted already covers
most of the need.

If he wants it: the machinery half exists. A per-section public/guests-only dial EXISTS and is
enforced for invitation widgets, but NOTHING WRITES IT — the widgets page saves visibility,
mode and order and never audience. The recap renderer takes no viewer parameter and its
section map records only off-for-everyone. Strangers currently get a hardcoded reduced set.
```
