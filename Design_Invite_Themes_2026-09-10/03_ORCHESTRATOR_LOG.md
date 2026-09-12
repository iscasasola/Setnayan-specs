# 03 · ORCHESTRATOR LOG — the Invite group

## 2026-09-11 · "cinematic reveal did not show" — DIAGNOSED, NOT A DEFECT (but it exposed one)

Owner opened https://www.setnayan.com/cale-ice/invite and saw no reveal.

MEASURED (live prod, not documents):
- `events.invite_theme` is NULL for cale-ice -> resolves to House -> House `opening: 'none'` ->
  no reveal. Correct shipped behaviour. The look was never saved.
- Pro is NOT the cause: `event_host_is_internal` = true AND `event_host_holds_founder_seat` = true
  for that event, and `eventSkuActive` ORs both in. The spine's "internal so Pro is on" is TRUE,
  but by that OR - not by an order (only order on the event is SETNAYAN_AI/paid) and not by a
  comp grant (none).
- Join token valid (not revoked, no expiry). Live page 200, zero `capiz` markup. event_date
  2026-12-18 (future), wedding, std_background present -> the stage fence would pass once saved.
- service_role holds UPDATE on `events.invite_theme`; no BEFORE UPDATE trigger on `events`
  swallows the write. The picker IS mounted unconditionally on the page.
- `anon` has NO SELECT on `events.invite_theme` - harmless here ONLY because every invite page
  reads through the admin client. If any invite read ever moves to the session client, the whole
  events query starts failing. Noted, not acted on.

UNRESOLVED: whether the owner pressed Save and it failed, or never pressed Save.

DEFECT THIS EXPOSED - QUEUED FOR THE SESSION THAT OWNS guests/invite/ (session 5's follow-up;
SendMessage was unavailable mid-flight, so it could not be added to the running session):
`setInviteTheme` runs an UPDATE with no `.select()`. A PostgREST UPDATE matching ZERO rows returns
NO error, so it redirects to `?theme=saved` and the picker prints "Saved - your invite link now
opens in this look." while nothing was written. The sibling action `regenerateInviteQr` in the SAME
FILE already does this correctly (`if (!data || data.length === 0)`) - copy that shape.
ALSO: the picker renders a banner for `?theme=saved` and appears to render NOTHING for
`?theme=error` - a save that failed must say so on screen.
Both need a mutation-checked guard.

RULE THIS CONFIRMS: never two sessions on one file. This item waits for session 5 to merge.

## 2026-09-11 · "stuck at /cale-ice/invite/reply" — FOUND, and it BLOCKS session 1's proof

CAUSE (origin/main, `app/join/[eventId]/_components/join-flow.tsx`):
    const session = await readGuestSession();
    if (session && session.event_id === eventId) redirect(inviteReplyPath(slug));
A browser that already holds a guest seat on the event NEVER sees door 01 again — opening
/{slug}/invite forwards straight to door 02 (Reply). The owner's browser holds a seat on cale-ice
(event_members = 1), so the link lands him on Reply every time.

CONSEQUENCE — THIS IS THE PART THAT MATTERS: door 01 is where the reveal plays. So the cinematic
reveal and the whole first-door design are INVISIBLE to anyone who has been through the arrival
once. The owner cannot verify Capiz in his normal browser at all; S1a must be done in a PRIVATE
window (no cookie) or from a device that has never opened the link.

⚠ OWNER DECISION, NOT ENGINEERING'S: is "a returning guest never sees the reveal again" the
intended behaviour? It is defensible (don't make someone re-type their name), but it means the
thing the couple pays Event Hub Pro for is a one-time sight per browser. SURFACED, not resolved.
Note it is the SAME shape as Q6 (no second reveal right after arriving) — which session 5 is
building now — but the opposite direction: Q6 suppresses a second reveal deliberately; this
suppresses the FIRST one for a returning guest.

VERIFIED HEALTHY (so these are not the cause): /cale-ice/invite/reply with no cookies returns 307
-> /cale-ice/invite, so the gate works; guest_count_locked_at and guest_list_edit_deadline are both
NULL, so the reply is not locked; 4 guests on the event.

STILL TRUE AT THIS WRITING: `events.invite_theme` is NULL — the look has not been saved yet, so
even in a private window the invite renders House with no reveal.

## 2026-09-11 · RESOLVED — Capiz is live on door 01, confirmed two ways

Owner saved the look and reports the cinematic reveal working. Measured, not taken on trust:
- `events.invite_theme` = 'capiz' (was NULL through three earlier checks today).
- https://www.setnayan.com/cale-ice/invite returns 200 and now CONTAINS capiz markup; the page
  grew 84,817 -> 107,866 bytes across the save. Before the save the same probe found ZERO capiz
  markup, so this is a before/after pair, not a single green.
- Doors 02 and 03 return 307 to door 01 for a cookieless probe (the guest-session gate), so they
  are NOT verifiable from here. Only the owner, holding a seat, can confirm those two.

CONSEQUENCE FOR THE QUEUED DEFECT: the save worked, so `setInviteTheme`'s missing row-count check
is HARDENING, not an active outage. It stays queued for the session that owns guests/invite/ — the
reason to fix it is unchanged (a save that writes nothing would still print "Saved"), but it does
not jump the queue.

NOT DIAGNOSED, and it did not need to be: whether the earlier NULLs were "Save not pressed" or a
failed save. The owner's own report plus the byte/markup delta settle the outcome either way.

## 2026-09-11 · OWNER REVIEW OF DOOR 02 (Reply) — four items, RULE 0 applied to each

1 · THE SIGN-IN LINE IS CONFUSING. `[slug]/invite/reply/page.tsx` prints "Fills this in for you,
and becomes how you sign in later." above Google/Apple. Owner: "if they do not have an account
yet, how is that?" He is right that it READS as if an account already exists. The behaviour is
fine (Google/Apple create the account AND supply name+email); the words are wrong. COPY ONLY.

2 · A DECLINE SHOULD NOT ASK FOR THE REST. PARTLY BUILT ALREADY — do not rebuild the mechanism.
`rsvp-widget.tsx` already ships a `:has(input[name="rsvp_status"][value="attending"]:checked)`
rule driving `.selfie-reveal` and `.attending-reveal`, so the selfie and the plus-one block
already hide unless attending. What is NOT wrapped: Meal preference, Dietary notes (and the
contact/name/note boxes, which are arguably right to keep). DELTA = extend the EXISTING class to
the meal/dietary grid. Which boxes survive a decline is an OWNER call — asked, not assumed.

3 · "SIGNING IN SAVES YOUR PHOTOS." Checkable and TRUE ENOUGH TO SAY: `photos-of-you-gallery.tsx`
and `your-photos-widget.tsx` both ship, so a guest really does get photos of themselves on the
event site. Word it around THAT, not around a cross-event "collection" that has not been verified
to exist. ⚠ This is the /features false-claim trap; the copy must not outrun the feature.

4 · 🔑 FACE TAGGING DOES NOT BELONG ON THE INVITE (owner, verbatim: "face tagging does not happen
on the invite. it happens on their first view on the day of the event? or on the day papic becomes
available to use for them.")
   RULE 0 PAYS OFF: the day-of enrolment ALREADY SHIPS as `[slug]/_components/day-of-face-enroll.tsx`,
   whose own comment calls itself "the day-of catch for a guest who skipped the optional RSVP
   selfie". It is mounted in THREE live places — the day-of landing page (`site-body.tsx`), the hub
   (`needsFaceEnroll`), and inside the Papic guest camera — and self-hides once enrolled.
   ⇒ THE DELTA IS A REMOVAL, NOT A BUILD: take the selfie + consent block off the invite arrival.
   The catch the owner describes is already there. `rsvp-widget.tsx` is SHARED with the Event Hub's
   own RSVP card, so this needs a prop, not a deletion, or the Event Hub card loses it too.
   ⚠ SURFACED: `site-body.tsx` mounts it as `context={isLive ? 'day_of' : 'pre_event'}` — i.e. it
   also prompts BEFORE the day. The owner's rule says day-of / Papic-availability. Whether the
   pre-event prompt survives is his call, not engineering's.
   ⚠ CONSEQUENCE, stated once: fewer guests enrol early, so more arrive unenrolled on the day. That
   is the owner's stated intent, not an oversight.

SEQUENCING: all four sit on the Reply door / the shared RSVP widget. Sessions 2 (Velvet) and 5
(Event Hub Pro) are in flight and touch NEITHER file — so a session for these four is disjoint,
provided it is fenced OFF DoorShell, load-invite-look.ts, lib/invite-themes.ts and themes/.

## 2026-09-11 · "it went back to save the date" / "it needs to go to event hub?" — DESTINATION IS
## RIGHT, THE WORDS ARE WRONG (item 5 for the arrival batch)

Door 03 links to `/${home}` — `/cale-ice` — and `/[slug]` IS the Event Hub (lib/invite-arrival.ts
says so in as many words). So the hand-off is working; nothing is misrouted. `/[slug]/hub` is a
DIFFERENT thing — the fullscreen event-DAY hub, only meaningful in the live window — and is NOT
where an arrival 98 days out should land. Do not "fix" this by repointing the link.

WHY IT LOOKED WRONG: the Event Hub wears a face chosen by how far off the wedding is.
`getLifecyclePhase` (lib/invitation-widgets.ts) returns
  daysUntil > STD_THRESHOLD_DAYS ? 'save_the_date' : 'rsvp'
and `STD_THRESHOLD_DAYS = 90`. cale-ice is 2026-12-18 — measured 98 days out from 2026-09-11 — so
it is over the line and correctly renders its Save-the-Date face. It crosses into the invitation
phase on its own around 2026-09-19. No switch to flip, no defect.

THE ACTUAL DEFECT — A PROMISE THE DESTINATION DOES NOT KEEP. Door 03
(`[slug]/invite/enter/page.tsx`) says "Your invitation is ready — your seat, your QR and everything
shared with guests are waiting on it." over a button reading "Open your invitation". At 98 days out
what opens is the SAVE THE DATE. The words must follow the phase the guest is actually being sent
into, or say something true in both.
🔑 SAME FAMILY AS THE OTHER FOUR: every one of these is the arrival describing something the next
screen does not deliver. Worth building as ONE batch, not five patches.

⚠ AND IT SELF-HEALS IN 8 DAYS, WHICH IS THE TRAP: from ~2026-09-19 the copy becomes true for this
event and the bug becomes invisible here — while staying wrong for every couple more than 90 days
out, which is most of them at the moment they share the link.

## 2026-09-13 · LANDING ORDER IS NOW FORCED — my own three branches overlap each other

Surfaced by a peer session's collision check, then measured here. The three Invite branches are
NOT disjoint, and the fences I wrote only covered what I anticipated:

  velvet  ∩ ehpro    : lib/invite-themes.ts AND lib/invite-themes.test.ts
                       (velvet's copy of the test is UNCOMMITTED, so a branch diff cannot see it —
                        the peer's trial-merge missed it for exactly that reason)
  ehpro   ∩ arrival  : app/[slug]/invite/reply/page.tsx
  velvet  ∩ arrival  : none

🔑 THE FENCE I WROTE FOR THE ARRIVAL SESSION LISTED reply/page.tsx AS ALLOWED, because I did not
foresee that the Event Hub Pro session would edit it too (it does — carrying the couple's button
colour to the door). A fence is only as good as the file list you predicted; it held perfectly for
every file I named and said nothing about the one I did not. Trial-merge, do not reason — and
remember an uncommitted edit is invisible to any diff a peer can run.

ORDER: arrival-truth (in flight) -> velvet -> ehpro. EH-Pro lands LAST because it collides with
BOTH of the others; it must `git merge origin/main` and re-run `lib/invite-themes.test.ts` and the
reply-door tests before it pushes.

Peer session (setnayan-platform-f4) is landing a hydration fix on layout/theme-provider/supplier
files — measured, no intersection with any of my three. Told them to land it. Asked them to warn me
if they touch apps/web/app/globals.css (wt-ehpro-finish edits it) or anything in
app/[slug]/_components/ for Story 14+15.

## 2026-09-12 · VELVET — PR #5471 open, auto-merge armed. Two findings I verified myself.

1 · ⚠ THE COUPLE'S LEGIBILITY SETTING CANNOT REACH AN INVITE DOOR. Flagged by the build session;
I confirmed it independently rather than repeating it: `git grep legib` over
apps/web/app/[slug]/invite/**, lib/invite-ground.ts and lib/invite-themes.ts returns ZERO, while
the same word appears in 12+ files on the couple's own site (invitation-shell, save-the-date-film,
story-lens, arrival-greeting, supplier-desk, measures.ts, name-search…). `resolveInviteGround`
hands a skin `{ photo, color }` and nothing else, so auto · lighten · darken change nothing on the
three doors — the theme's own veil is the entire legibility mechanism there. CAPIZ BEHAVES THE SAME
WAY, so this is not a Velvet defect and was not introduced by #5471.
🔑 WHY IT MATTERS ANYWAY: it is a control that governs text-over-photo readability EVERYWHERE ELSE
and silently governs nothing on the one surface built entirely out of text over a photo. The picker
copy does not promise it, so this is an inconsistency rather than a false claim — OWNER'S CALL, not
engineering's. Not fixed here: the file that would carry it (invite/_lib/load-invite-look.ts) is
fenced to the parked Event Hub Pro session.
⚠ AND THE BRIEF ASKED FOR SOMETHING UNVERIFIABLE: session 2's prompt says "check text over the photo
under all three legibility settings". There are no three settings to check on that surface. A brief
can ask for a measurement that cannot exist; the session was right to say so instead of inventing
three screenshots.

2 · THE BUNDLE BUDGET IN THE SPINE IS STALE. Session 2's brief says "the main bundle is at 199.8 of
200 KB". Measured by two back-to-back production builds: 201.5 KB before AND after, budget 202 KB.
Velvet reaches no shared chunk (every shared chunk byte-identical; only the webpack runtime
manifest's hash differs, same 3.9 KB). Fix the spine's number when the design folder is next
touched — an anchor that is a NUMBER rots, exactly as CLAUDE.md rule 7 says.

3 · FENCE STATUS FOR THE PARKED EH-PRO SESSION: velvet kept lib/invite-themes.ts to the single
`ready` line as instructed, but lib/invite-themes.test.ts carries 3 hunks (flipping ready forces its
assertions). That test file is where an EH-Pro conflict will appear. EH-Pro must merge origin/main
and re-run it before pushing.

NOT YET VERIFIED: nothing was rendered in a browser by this session. The y-coordinates and contrast
ratios in the PR are the FIRST session's browser measurements carried forward — code verified,
pixels not. The served check on setnayan.com is owed and is mine.
