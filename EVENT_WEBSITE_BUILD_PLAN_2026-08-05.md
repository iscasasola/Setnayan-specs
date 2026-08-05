# EVENT WEBSITE — the plan to finish it
**Date:** 2026-08-05 · **Owner directive:** *"complete the full plan step by step to build it. we want this done."*

> ## 🔑 THE COMPLETION RULE — read before anything else
>
> **A step is DONE when a guest at a REAL wedding can see it. Not when it merges.**
>
> This is not a slogan; it is the specific cause of most of what follows. Today's sweep
> found the menu rules written and wired to nothing · the film's exit built and gated off ·
> the empty/not-allowed screens mounted on zero pages · the browsable site switched off for
> every real event. **All merged. All reported done. No guest could see any of them.**
>
> ### The two habits that caused it
>
> 1. **VERIFY AGAINST `cale-ice`, NEVER `maria-and-jose`.** The sample event has
>    `website_open_browse = TRUE`; the real wedding has it FALSE. Every check ran against the
>    one event configured to look good. That single fact produced the film wall, the
>    vanishing after-site, and both dead tabs.
> 2. **"Off for every real event" is NOT SHIPPED — it is STAGED.** If a change cannot be seen
>    by a guest at a real wedding, it is not finished. Half of today's list existed because
>    staged work was counted as delivered.
>
> ### Two things that make defects here invisible
> - **Prod is pre-launch-empty.** No guests, so nothing complains. Deliberate looking is the
>   only detector — the owner found three real defects in ten minutes that CI never saw.
> - **The dev machine is Asia/Manila; the server is UTC.** Timezone bugs pass locally and are
>   8 hours wrong in production. Any date test must compare TWO EXPLICIT zones.

---

## Where it stands: 9 of 60 closed, 51 open

Findings came from a 9-agent end-to-end sweep on 2026-08-05, attacked by 3 skeptics; **48 of
52 survived re-verification against `origin/main`.** Every item below carries its own
file:line evidence. This was the first time anyone walked the whole guest journey.

### ✅ Closed today
- **PR #4109 + #4110** — The "wedding day" ends at 4 PM at the venue. `getDayOfPhase` anchors on the event DATE at MIDNIGHT in the SERVER's timezone and gives `live` only for 
- **PR #4109** — On the ONE real (non-sample) live wedding site, two of the four bottom-bar buttons point at nothing. `resolveSiteNav` pushes the `details` slot uncond
- **PR #4108** — The guard built to stop the two nav modules drifting is watching a module nothing renders, and its stated premise is inverted. `site-nav-vocabulary.te
- **PR #4108** — For any wedding more than 90 days out (or with no date yet), the Save-the-Date film REPLACES the entire guest site and has no exit on a real event. `p
- **PR #4109** — The live bottom bar draws two tabs that lead nowhere. `resolveSiteNav` pushes the `details` slot unconditionally whenever phase is 'before' — it takes
- **PR #4109** — The "Camera" button shown to visitors with no invite lands on a page with no link and no button. `/papic/guest` requires the guest-session cookie; wit
- **PR #4112** — A guest's photos disappear from their invitation page 8 hours after the wedding — inside the grace window built to let them download. The loader delib
- **PR #4112** — The warning that tells an accountless guest their photos are about to close can never render. `accountlessPhotosClosed` is true only when the event is
- **PR #4112** — Five widget types are configured to appear after the wedding and none of them can. `WIDGET_PHASES` lists `editorial` for your_photos, our_photos, spec

---

## PROGRESS — 2026-08-05

| Step | State | PR |
|---|---|---|
| **1 · The phone bottom edge** | ✅ **MERGED** | #4120 |
| **2 · Guests who cannot get in** | ✅ built, in CI | #4121 |
| **3 · A QR-scanner treated as a host** | ✅ built, in CI (shipped with step 2) | #4121 |
| **4 · Couple told their site is live when it isn't** | ✅ built, in CI | #4123 |
| **5a · "Watch live" implying a running stream** | ✅ built, in CI (copy only) | #4125 |
| **5b · The coordinator's announcement needs a refresh** | ✅ built, in CI | #4136 |
| **5c · A host switch for the broadcast** | ✅ built, in CI | #4127 |
| 4b · Previewing the site AS AN INVITED GUEST | ⏭ open — a change to a security-reviewed gate | — |
| **6 · The wrong answer to the right question** | ✅ built, in CI | #4128 · #4130 · #4131 · #4134 |
| **5b · The coordinator's announcement needs a refresh** | ✅ built, in CI | #4136 |
| **6b · The seat pass still refuses non-weddings** | ✅ built, in CI | #4139 |
| **6c · "Photos of you" vanishes silently** (+ the live wall) | ✅ built, in CI | #4137 |
| 7 · The rest, and the honest close | ⏭ **all that remains** — LOW findings + the 3D venue RPC's wedding-only predicate | — |

### What step 1 turned out to be — read this before step 6

The stacking bug was the small half. **The five-tab menu was gated on
`isSample || flag === 'true'`, the flag was never set, and `is_sample` is TRUE
on exactly one row.** A month of navigation work rendered on the demo wedding
and nowhere else — and the demo is the event every verification pass runs
against. Real couples' guests got the legacy bar the whole time, which is also
why nobody ever saw the two bars stack.

The flag is now an opt-OUT. **Assume the same shape is hiding elsewhere:** when
a finding says "X is broken", check first whether X renders for a real event at
all.


### 🔴 What 5c turned out to be — the same disease as step 1

The switch did not need building. **`events.live_media_public` already existed**
— shipped 2026-09-20 as *"the couple's opt-in for anonymous live media"*, `NOT
NULL DEFAULT FALSE`, read on every render of the guest site — **and nothing
anywhere wrote it.** All five production events sit at `FALSE`, sample included.

The guest site computes `liveMediaVisible = viewer is a guest OR
live_media_public`, so **a visitor with no invitation never saw the livestream or
the live photo wall on any event.** That is the relative overseas who opened a
forwarded link — the person a wedding livestream exists for — looking at a page
with no broadcast on it, on the day, while it was running.

**This is the SECOND time.** `papic_face_mode` stored nothing for seven weeks the
same way, with every flag green. `apps/web/lib/gates-have-handles.test.ts` now
guards it — detecting an actual WRITE, not a mention, and self-checking that its
own detector still works.

🔑 **The through-line of steps 1 and 5c: BUILT IS NOT SHIPPED.** A flag never
flipped, a column never written — both look completely finished from the inside.
Before treating any finding as "X is broken", check whether X runs for a real
event at all.


### Wave 2 — a second sweep, adversarially checked

29 remaining findings were re-verified against `origin/main` after the first
wave landed, then attacked by three skeptics told to REFUTE. Result: **6 already
closed** by wave 1, **7 refuted** (true facts with untraced consequences), **13
confirmed**. Ten of the thirteen are now shipped.

Refuted claims worth remembering, so nobody re-opens them:
- *"There is no `loading.tsx`, add one"* — its ABSENCE is a deliberate fix
  (`04c03063d`). A route-level loading file commits HTTP 200 before the body,
  turning every junk URL into an indexable soft-404. The blank-screen fix is a
  `Suspense` **inside** `page.tsx`, after the routing decisions.
- *"The live wall's silent catch means there is no way to watch"* — a second,
  independent render site exists.
- *"The photo essay has no menu entry"* — it is the first section on the page.
- *"The guest session is unsigned"* — deliberate and self-documented.

🔑 **The one that mattered most was not in the findings at all.** Verifying on
`/cale-ice` rather than the sample proved the new navigation renders on a real
wedding, every tab resolves, and the date reads correctly — and disproved a
suspicion that the opening veil locks out keyboard users. It does not: all eight
controls are reachable by Tab. **A true fact (the veil is pointer-only) with a
false consequence, caught by checking instead of reporting.**

### Decisions made while building, not asked

- **The broadcast needs a HOST SWITCH, not detection.** Nothing can know whether
  a YouTube stream is running — the Google account is suspended (appeal
  `73857927`), so there is no API to ask. The switch mirrors the host's Papic
  switch, which the owner already ruled on (2026-08-03). Column + control.
- **The editor preview got honest captions, not the guest view.** Every tab now
  says whose view it is. Extending `?as=` to the Invitation and day-of phases is
  a change to a gate that was security-reviewed and deliberately narrowed to one
  phase — worth doing properly rather than widening in passing.
- **A failed read now THROWS rather than 404s.** `app/[slug]/error.tsx` is the
  guest half: *"Your link is fine — something on our end is having trouble."*

## THE PLAN — in build order

Ordered by what a guest hits first and hardest. Each step is one PR, one worktree, branched
from a freshly-fetched `origin/main`, verified on **`cale-ice`** before it is called done.

### STEP 1 · The phone bottom edge — three defects, one strip
*Everything a guest reaches for lives in the bottom 80px, and three separate fixed bars are fighting for it. This is what a guest hits FIRST and it is the most visible thing on the list.*

- Two fixed bottom bars stack for any guest who opened their own invitation — Home, Camera and Me cannot be tapped.
- “Open my invitation” — the ONLY doorway an anonymous visitor has — sits under the bar and cannot be tapped.
- Share and Report are drawn under the bar too; tapping Share opens Details instead.
- ⚠ Verify by RESIZING TO 375px AND SCROLLING TO THE BOTTOM, not by reading CSS. All three are overlap bugs that only exist at a real viewport.

### STEP 2 · Guests who cannot get in
*Two ways a legitimate guest is turned away at the door. Both fail closed in the wrong direction.*

- A failed guest lookup is reported as “we couldn’t find that invitation” — the code cannot tell “no such guest” from “the read failed”, so a database hiccup tells someone at the venue their invitation is not real.
- A failed EVENT read tells every guest the link is wrong, and offers a sign-in button for a site that is working fine.
- 🔑 This is the shipped six-state resolver's exact job — an RLS denial and an empty read are the same value. Mount it here; this is the surface it was built for and has never been used on.

### STEP 3 · A QR-scanner is treated as a host
*A privacy hole, not a cosmetic one.*

- `loadHostMembership` selects `member_type` and never compares it — so anyone who scanned a QR can open a couple's site while it is still PRIVATE and jump ahead to phases the couple has not launched.
- Fix at the read, not at the render: a membership check that does not check membership will be re-introduced by the next caller.

### STEP 4 · The couple is told their site is live when it is not
*Three findings, one broken promise. A couple puts this link on printed invitations.*

- The “Live” tick only checks a URL EXISTS — never that a visitor can open it.
- “Launched” and “Private” can both be true, and the screen keeps saying live while guests are locked out.
- The editor's preview renders the ANONYMOUS view, so a couple can never see the invitation their guests actually open — no personal hello, no RSVP, no seat.
- 🔑 The honest control is one derived answer: 'can a stranger open this right now, yes or no', computed the same way the guest page computes it.

### STEP 5 · The day itself
*The highest-stakes hour of the product. Timing is now correct (#4109, #4110); these two remain.*

- The coordinator's announcement reaches only guests who happen to refresh — “phones down, the ceremony is starting” never arrives on an idle phone. Resolved once, server-side, at render.
- “Watch live” turns on because a LINK WAS SAVED, not because a stream is running — a relative overseas opens it at 8 AM and gets “video unavailable”.
- ⚠ Venue wifi is the real environment. Whatever is built must degrade to a visible state, never to silent staleness.

### STEP 6 · The wrong answer to the right question
*Smaller, but each one tells a guest something untrue.*

- The guest's “Photos” button is hardcoded to the Papic page regardless of whether the event HAS Papic — on a wedding that never bought it, a guest is told the host has not turned on a camera.
- The 3D venue page blames a couple who does not exist for not posting a seating plan, to anyone who mistypes an address.
- Sweep the remaining MEDIUM findings in `empty-and-error` and `guest-journey` in this pass — they are the same class.

### STEP 7 · The rest, and the honest close
*Only after 1-6 are visible on cale-ice.*

- The remaining LOW findings from the sweep.
- Re-run the 9-agent sweep and confirm the closed items stay closed.
- 🔑 Do NOT mark this programme complete from a merged-PR list. Open cale-ice on a phone, walk the journey — arrive, RSVP, find a seat, the day, the recap — and only then call it done.

---

## ⛔ Owner decisions inside this plan
- **Is `12 hours before / after` literal?** Shipped as noon-before → noon-after (12h either side of the DAY). Literal ±12h from midnight is noon-to-noon and an evening reception falls outside again.
- **Should the five product pages have a way in?** Five are reachable only from `/alaala`, which is reachable from nowhere. Owner said delete `/alaala`; the five then have no inbound link until the homepage introduces them.

## Full evidence — every open finding

### [HIGH] A failed guest lookup is reported to the guest as "we couldn't find that invitation". `loadGuestContext` runs `const { data: guest } = await admin.from('guests')...` and discards the `error` entirely; any read failure produces the same `{ kind: 'not_found' }` as a genuinely deleted guest, which page.tsx converts into the anonymous landing with reason `invalid_invite`, whose copy is "We couldn't find that invitation / Double-check your link, or open your personal invite again." The guest is holding a verified session cookie for this exact event — the branch is only reachable AFTER the `!session` and wrong-event checks have passed.
- **A guest experiences:** A guest standing at the venue scans their QR and is told their invitation is not valid. Their name, their seat, their RSVP and their photos all vanish, and the page pushes them back to the invite door to try a link that was never wrong.
- **Evidence:** apps/web/app/[slug]/_lib/loaders.ts:820-830 (error discarded) → app/[slug]/page.tsx:622-623 (`if (guestContext.kind === 'not_found') return renderAnonymous('invalid_invite')`) → app/[slug]/_components/empty-states.tsx:76-83 (the copy). Live on maria-and-jose: `select slug, website_open_browse from events` returns website_open_browse=true, so FindModeCard is the rendered surface there.

### [HIGH] A failed event read tells every guest at the wedding that the link is wrong. `loadEventShell` selects roughly 60 named columns from `events` and discards the `error`; a null `data` is indistinguishable from "no such slug", so the page falls through to the vendor dispatcher, which calls notFound(), which renders "This invitation link can't be found." The route's own code names this exact hazard 460 lines later — it pulls `rsvp_backdrop` out into a separate tolerant read specifically because "an unknown column in the MAIN select would error the whole fetch and 404 every wedding page" — but the main select itself is left undefended.
- **A guest experiences:** If it ever fires, every guest at every wedding opening the invitation is told the link cannot be found and is offered a sign-in button — for a site that is working fine one query later.
- **Evidence:** apps/web/app/[slug]/_lib/loaders.ts:106-116 (error discarded); the acknowledged hazard at loaders.ts:573-578; app/[slug]/page.tsx:200,210 → app/v/[slug]/page.tsx:722 (`notFound()`) → app/[slug]/not-found.tsx:26. Verified against prod: every column named in the select exists today, so this is a latent failure mode and not a current break.

### [HIGH] The 3D venue page blames the couple for an event that does not exist. One plate — "The 3D venue isn't ready yet / The couple hasn't posted their seating plan" — is the single outcome for three unrelated causes: the RPC errored, the slug matches no event at all, or the plan is genuinely unpublished. I read the live function body: `public_venue_scene` returns `{"published": false}` (no error) when no event matches the slug, which I confirmed by executing it with a bogus slug. This is also the only guest sub-route with no existence check — seat, find-seat, find-my-table, hub, recap, pabuya and print all call notFound() when the event is missing.
- **A guest experiences:** Anyone who mistypes a wedding address, or follows an old link, is told a specific couple has not posted their seating plan — for a couple who does not exist. The "← Back to the wedding" button underneath then leads to a 404.
- **Evidence:** apps/web/app/[slug]/venue/page.tsx:149-163 (`if (error || !scene || !scene.published)`, no notFound() anywhere in the file); live `pg_get_functiondef(public_venue_scene)` — `IF v_event_id IS NULL THEN RETURN jsonb_build_object('published', false)`; executed `select public_venue_scene('this-slug-does-not-exist-xyz', null)` → `{"published": false}`.

### [HIGH] The website hub tells the couple their site is LIVE based only on whether a URL exists — it never checks whether a visitor can actually open the page. `publicLandingUrl` is computed from `event.slug` alone, and the green "Live — this link is yours." line + checkmark render on that condition. The real gate is `landing_page_visibility`, whose DB default is `'private'` NOT NULL, and a private event serves every non-guest a locked screen.
- **A guest experiences:** A couple opens the page named "Your wedding website", sees a green tick and the words "Live — this link is yours", copies the link into their group chat and their printed invites. Every guest who taps it gets a polite "this page is private" screen. Nothing on that hub tells them the site was never turned on.
- **Evidence:** apps/web/app/dashboard/[eventId]/website/page.tsx:116-118 (publicLandingUrl = event.slug ? buildEventLandingUrl(...)) and :152-157 (`{publicLandingUrl ? ... 'Live — this link is yours.'`); the actual gate is apps/web/app/[slug]/page.tsx:321-323 (`resolveEffectiveVisibility` → `if (visibility === 'private')` → `<PrivateLanding>`), resolver at apps/web/lib/launch-save-the-date.ts:45-51. Prod: `select column_default from information_schema.columns where table_name='events' and column_name='landing_page_visibility'` → `'private'::text`, NOT NULL; 3 of 5 events are private, 2 of those hold a slug.

### [HIGH] The editor's preview can never show the invitation an invited guest actually opens. A host has no guest-session cookie, so the page renders the ANONYMOUS tree; the RSVP form, the personal greeting, the guest's QR card and the event-details card all live only in the guest tree, and the anonymous firewall excludes them by design. The "Invitation" preview tab therefore shows a "Find your invite" screen with no RSVP form on it. The one simulated identity that exists is a guest who has ALREADY replied.
- **A guest experiences:** The couple spends an evening styling their invitation next to a live preview, then sends the link. What their guests open — the personal hello with their name, the RSVP form, their QR card — is a screen the couple has never seen. Any mistake in it (wrong role wording, a broken RSVP, an empty section) reaches 150 guests first and the couple last.
- **Evidence:** apps/web/app/[slug]/page.tsx:592-593 (`if (!session) return renderAnonymous(...)` — a host holds no guest cookie); apps/web/app/[slug]/_components/site-body.tsx:1634 (`identity.kind === 'anonymous' ? anonymousTree(identity) : guestTree(identity)`); the RSVP widget renders only inside the guest tree at site-body.tsx:1402-1451, the greeting only at :1031-1053; apps/web/lib/public-widget-allowlist.ts:22-32 deliberately omits `rsvp`, `greeting`, `qr_card`, `event_details`, `your_photos`; apps/web/lib/site-body-plan.ts:39-42 ("the HOST — renders the `anonymous` body") and :88 (rsvp phase + anonymous → `find_invite`); the only simulation is `?as=replied`, apps/web/lib/simulated-guest-preview.ts:59-68.

### [HIGH] "Launched" and "Private" can both be true at once, and two surfaces then insist the page is live while guests are locked out. `stdLaunched` is computed as `std_launched_at IS NOT NULL || visibility === 'public'`, but `updateLandingPageVisibility` never clears `std_launched_at`. The visibility radio sits in the same rail, one click below the go-live block.
- **A guest experiences:** A couple launches, then decides to hide the page for a week. They set it to Private. The same screen keeps telling them "your page is live — anyone with your link can now see it", with a Private badge sitting right underneath. When they flip it back later they have no way to know which of the two statements was ever true.
- **Evidence:** apps/web/app/dashboard/[eventId]/website/editor/page.tsx:126 (`const stdLaunched = Boolean(event.std_launched_at) || visibility === 'public'`) feeding the go-live control at :531-538; the control's live copy at apps/web/app/dashboard/[eventId]/studio/save-the-date/_components/launch-std-button.tsx:162-186 ("Your Save-the-Date is launched — your page is live. Anyone with your link can now see it."); the same formula and the same claim on apps/web/app/dashboard/[eventId]/website/privacy/page.tsx:77-78 and :161-173; the writer that never resets the stamp is apps/web/app/dashboard/[eventId]/website/privacy/actions.ts:113-116; the real gate ignores `std_launched_at` entirely — apps/web/lib/launch-save-the-date.ts:45-51.

### [HIGH] The coordinator's announcement cannot reach a guest who is already holding the page. `dayOfBroadcast` is resolved once, server-side, at render. There is no polling, no realtime channel, and no periodic refresh on `/[slug]`. `LiveRefresher`/`useDayOfLiveTick` is mounted on `/[slug]/seat`, `/[slug]/find-my-table`, `/[slug]/find-seat` and `/[slug]/hub` — but NOT on `/[slug]`, the page every guest actually opens from the QR. The only timers on that page are local: a 1-second countdown, a 30-second clock tick inside the schedule widget, and the live-wall photo poll. None of them re-reads the server.
- **A guest experiences:** The coordinator types "phones down, the ceremony is starting" and it reaches only the guests who happen to pull-to-refresh in the next few minutes. Everyone whose phone is already open on the invitation keeps looking at the page as it was when they opened it. The one message in the product that has to arrive within thirty seconds is the one that waits for a manual reload.
- **Evidence:** apps/web/app/[slug]/page.tsx:511 (one-shot server read) and :682-727 (no refresher mounted); apps/web/app/[slug]/_lib/loaders.ts:239-261. Refresher mounts that DO exist: apps/web/app/[slug]/seat/page.tsx:573, find-my-table/page.tsx:130, find-seat/_components/name-search.tsx:73, _components/hub/hub-shell.tsx:121. Timer grep over app/[slug]: only countdown.tsx:25, schedule-widget.tsx:52, live-wall-block.tsx:81 — all client-local.

### [HIGH] "Watch live" is on because a link was saved, never because a stream is running. `resolveWatchLinks` only checks that the stored URL parses as a YouTube/Facebook address; nothing queries YouTube for broadcast state. So the pulsing red "Watch live" header and the embedded player render for the whole 07:00–16:00 window whether the couple started early, started late, or already ended the stream. The bottom bar's Watch tab is driven by the same boolean and replaces the Details tab for that entire window.
- **A guest experiences:** A relative overseas opens the page at 8 AM because it says LIVE with a blinking red dot, and gets YouTube's "this video is unavailable" or an empty pre-stream card — hours before anything is broadcast. If the couple stops the stream after the ceremony, the same blinking LIVE banner stays up until 4 PM.
- **Evidence:** apps/web/lib/watch-live-links.ts:40-66 (shape validation only); apps/web/app/[slug]/_lib/loaders.ts:638; apps/web/app/[slug]/_components/watch-live-block.tsx:60-64 (animate-pulse "Watch live"); apps/web/app/[slug]/_lib/site-nav.ts:146-151 with `liveBroadcast` fed from site-body.tsx:811 / :1563 as `Boolean(plan.liveMediaVisible && watchLive)`.

### [HIGH] Any guest who joined by scanning a QR is treated as a host by the guest site. `loadHostMembership` selects `member_type` and then never compares it to anything — it returns `Boolean(memberRow) || Boolean(moderatorRow)`. The QR join path inserts `member_type:'guest'`. Recorded in DECISION_LOG.md 2026-08-03 (row: 'LIVE PRIVILEGE BUG'); I verified it is unchanged at HEAD ec6194121. That single boolean drives four gates: the private-event view (page.tsx:340), `?phase=` preview (:399), `?editor=1` (:422) and `resolveOwnerCapability` (:497), which now also unlocks the `?as=replied` simulated-guest preview (:573-585).
- **A guest experiences:** Someone who scanned a QR at an unrelated moment can open the couple's site while it is still private, jump ahead to phases the couple has not launched (including the Save-the-Date reveal they paid ₱999 for), and is shown an "Edit this site" doorway that fails if pressed. The couple's paid surprise is spoilable by anyone who ever scanned in.
- **Evidence:** apps/web/app/[slug]/_lib/loaders.ts:137-156 (`.select('member_type')` … `return Boolean(memberRow) || Boolean(moderatorRow);`); apps/web/app/[slug]/page.tsx:340, :399, :422, :497, :573-585. The write path is correctly strict — apps/web/lib/host-gate.ts requires `member_type === 'couple'` — so this is disclosure, not tampering.

### [HIGH] Two fixed bottom bars occupy the same strip for any guest who opened their own invitation. GuestHubBar renders unconditionally and is `fixed inset-x-0 bottom-0 z-40`; SiteMenuBar is `fixed inset-x-0 bottom-0 z-30`. There is no vertical offset between them, contrary to the owner-locked design ("floating ABOVE the tabs"). Replaying GuestHubBar's exact CSS over the live tab row at 375x812: My QR chip x20-72 / y748-800 sits on the Home tab (x4-77, y748-804); the round Camera x156-220 / y730-794 sits on the Camera tab (x151-224); Photos x303-355 sits on the Join/Me tab (x298-371). Three of five tabs are physically covered, and both bars offer a Camera.
- **A guest experiences:** A guest opens their invitation on a phone and sees two rows of buttons crammed into the bottom of the screen, one drawn on top of the other. Home, Camera and Me cannot be tapped at all — the old round buttons are sitting on them. Two different Camera buttons are visible at once.
- **Evidence:** /Users/icecasasola/Documents/Claude/Projects/setnayan-platform/apps/web/app/[slug]/_components/guest-hub-bar.tsx:153 (`fixed inset-x-0 bottom-0 z-40`) + page.tsx:709 (unconditional) vs _components/site-menu-bar.tsx:131 (`z-30`) + _components/site-body.tsx:1553-1554. Bar is live on real events, not just the sample: setnayan.com/cale-ice (`is_sample=false` per prod `events`) serves `aria-label="Site sections"`, so NEXT_PUBLIC_WEBSITE_MENU_ENABLED is 'true' in prod. Geometry measured in-browser at 375x812. Design intent: DECISION_LOG.md:2636.

### [HIGH] The "Open my invitation" button — the one doorway an anonymous visitor has — can never be tapped. At maximum scroll it occupies y739-779; the bottom bar starts at y747 and the Share pill covers y745-789. The page cannot scroll further (docH 2385, viewport 812, maxScroll 1573), so the button is never clear of the chrome. Hit-testing at its centre returns a nav icon; at its top edge returns the Share pill. The bar's own last tab ("Join") scrolls straight to this card. Root cause: nothing in the /[slug] tree reserves bottom space for the fixed bar — every `padding-bottom` in the tree belongs to a bar, never to content.
- **A guest experiences:** A guest scrolls to the bottom of the couple's page, sees "Have an invitation? — Open my invitation", taps it, and either nothing happens or the Details tab opens instead. There is no way to reach their own invitation from that page.
- **Evidence:** Live measurement on https://www.setnayan.com/maria-and-jose at 375x812: CTA rect top 739 bottom 779, nav top 747, `document.elementFromPoint` at CTA centre → nav <svg>. Source: /Users/icecasasola/Documents/Claude/Projects/setnayan-platform/apps/web/app/[slug]/_components/site-body.tsx:789 (#site-me card) and _components/invitation-shell.tsx:112-126,140-157 (no bottom padding). grep for `padding-bottom|pb-[` across apps/web/app/[slug] returns only bar-side hits.

### [HIGH] Share and Report are drawn underneath the bottom bar. PublicPageActions is `fixed inset-x-0 bottom-4 z-30` and appears EARLIER in the DOM than the bottom bar, which carries the same z-30 — so the bar paints over it. Measured live: pill y745-789 entirely inside the nav band y747-812; `elementFromPoint` at the Share button's centre returns the nav's "Details" anchor.
- **A guest experiences:** A guest who wants to send the couple's page to a friend taps Share and lands on the Details section instead. The abuse-report link is equally unreachable — there is no way to report a page from a phone.
- **Evidence:** /Users/icecasasola/Documents/Claude/Projects/setnayan-platform/apps/web/app/_components/public-page-actions.tsx:62 vs apps/web/app/[slug]/_components/site-menu-bar.tsx:131; DOM order site-body.tsx:1605 (pill) before :1634 (tree containing the bar) — confirmed in the served HTML (pill at byte 12160, nav at 34182).

### [MEDIUM] "Photos of you" disappears with no message when the read fails. `getGuestLiveGallery` returns `null` for zero photos (`if (photos.length === 0) return null`) and `null` from its catch block — the same value for "nothing yet" and "it broke". The consumer is a bare ternary with no else branch, so the entire section is omitted from the page.
- **A guest experiences:** A guest at the reception who has been photographed all evening sees no photo section at all — not an empty one, not an error. There is nothing on screen to tell her whether nobody has taken her picture yet or the site has failed, and nothing to retry.
- **Evidence:** apps/web/lib/guest-live-gallery.ts:169 and :171-172 (both return null); apps/web/app/[slug]/_components/site-body.tsx:1154 (`{(isLive || isPost) && guestLiveGallery ? (...) : null}`).

### [MEDIUM] On the wedding day, one failed read silently removes the livestream link and the photo wall at the same time. A single try/catch wraps the whole live-window block — the LIVE_WALL entitlement check, the watch-URL read, the wall snapshot and the Roam manifest — and its handler sets both `liveWall` and `watchLive` to null. Because `publicAlbumHref` is derived from `liveWall`, the album link goes null with them.
- **A guest experiences:** Relatives watching from abroad open the page during the ceremony and there is simply no "Watch live" anywhere — no error, no retry, no hint that a stream is running. They assume the couple never set one up.
- **Evidence:** apps/web/app/[slug]/_lib/loaders.ts:612-742, handler at :738-741 (`catch { liveWall = null; watchLive = null; }`); derived link at :767-771.

### [MEDIUM] The main invitation page has no loading state at all, and the entire guest tree contains zero Suspense boundaries. `app/[slug]/` has no loading.tsx (only the welcome and find-my-table sub-routes have one), so nothing streams — the browser receives nothing until the server has finished every read. `loadMedia` alone performs roughly eight sequential awaits including R2 presign round-trips. A stale comment in the loaders still justifies doing the slug lookup inside generateMetadata on the grounds that "this route has a loading.tsx", which is no longer true.
- **A guest experiences:** On venue WiFi the guest taps their invitation and gets a blank white screen — no monogram, no couple's name, no spinner — for as long as the server takes. Most people tap again or assume the link is dead.
- **Evidence:** apps/web/app/[slug]/ contains only welcome/loading.tsx and find-my-table/loading.tsx (no loading.tsx at the route root); `grep -rn Suspense apps/web/app/[slug]/**/*.tsx` returns 0 matches; sequential awaits at apps/web/app/[slug]/_lib/loaders.ts:315,331,375,389,399,413,435,487,521; stale rationale at loaders.ts:94-100.

### [MEDIUM] A failed widget read silently empties the couple's entire invitation body. `loadWidgets` discards the `error` and falls back to an empty array; `visibleHideableWidgets([])` then returns nothing, so every optional section is dropped at once while the always-on hero still renders.
- **A guest experiences:** The schedule, dress code, venue, what-to-bring, special message and story all disappear together. The page still looks intact, so the guest concludes the couple simply never filled anything in — and there is no way to tell the couple something is wrong.
- **Evidence:** apps/web/app/[slug]/_lib/loaders.ts:278-294 (error discarded, `widgetsRaw ?? []`); apps/web/lib/invitation-widgets.ts:288-294 (`visibleHideableWidgets` filters an empty array to empty).

### [MEDIUM] The live photo wall promises photos forever when polling has failed. The empty branch renders "The wall is warming up — photos appear here the moment they're taken" whenever the tile list is empty, and the poll's catch block swallows every network failure silently with no retry counter, no staleness marker and no state change. The server-side snapshot feeding it also catches errors into an empty result.
- **A guest experiences:** A guest on weak venue WiFi is told photos will appear the moment they are taken, and then watches an empty box for the rest of the night. Nothing ever indicates that the phone, not the wall, is the problem.
- **Evidence:** apps/web/app/[slug]/_components/live-wall-block.tsx:108-118 (the copy) and :73-75 (`catch { /* transient venue-WiFi failure */ }`); apps/web/app/[slug]/_lib/loaders.ts:738-741 leaves liveWall null on any snapshot failure.

### [MEDIUM] "Website address" is the one thing in the editor rail that cannot be edited there — the row has no inline panel and its link points back at the editor itself, so clicking it reloads the same screen. The only real slug editor lives on a different surface (`/dashboard/[eventId]/invitation`). Meanwhile the hub tells couples to set the URL in the editor, and the editor's empty-preview and topbar both say "Set your website address" with nothing to click.
- **A guest experiences:** A couple who wants setnayan.com/maria-and-jose instead of the name they were auto-given clicks the row labelled "Website address" and lands back where they started. An event with no URL at all can still be "launched" — the go-live button renders regardless of slug — producing a live setting that points at no page.
- **Evidence:** apps/web/app/dashboard/[eventId]/website/editor/page.tsx:239-246 (row key 'url', `href: `${w}/editor`` where `w = `${base}/website`` at :120 — i.e. the page itself; no `panel` key, so editor-shell.tsx:347-367 renders it as a plain Link); the only slug writer is apps/web/app/dashboard/[eventId]/invitation/actions.ts:131 (`updateEventSlug`), used only by invitation/page.tsx:349; the misdirection is apps/web/app/dashboard/[eventId]/website/page.tsx:189-192 ("Pick your wedding URL in the editor") and editor-shell.tsx:196 + :487-489. Prod has 1 of 5 events with a NULL slug.

### [MEDIUM] The first personal sentence every guest reads is hardcoded and the couple cannot change it, soften it, or turn it off. The greeting is `is_always_on: true` with `editor_subroute: null`, and the editor's Sections panel filters always-on rows out entirely, so it appears in no couple-facing control.
- **A guest experiences:** Every guest is greeted in the same borrowed voice, and told their assigned role and which side they are on in the opening line. A couple who wants Tagalog, or who does not want a guest reading "you're joining us as Ninang · Groom's side" the moment they open the link, has nowhere to change it.
- **Evidence:** Copy is fixed in apps/web/app/[slug]/_components/site-body.tsx:1031-1053 ("Hi, {first_name}. We'd love to celebrate with you on {date} — at {venue}. You're joining us as {role} · {side}."); catalog entry apps/web/lib/invitation-widgets.ts:89-95 (`is_always_on: true, editor_subroute: null`); the editor drops it at apps/web/app/dashboard/[eventId]/website/editor/page.tsx:181-183 (`.filter((r) => !r.is_always_on)`).

### [MEDIUM] On a phone the editor is taller than the space the dashboard gives it. The shell asks for `100vh − 3.5rem`, but the dashboard content wrapper already starts 1.5rem below the ~3.5rem sticky top bar and reserves 5rem at the bottom for the floating nav — so roughly 104px of the editor sits below the fold, under the bottom-nav pill, and the page gains an outer scrollbar that fights the rail's own inner scroll.
- **A guest experiences:** A couple editing on their phone loses the bottom of the preview pane and the bottom of the controls rail behind the floating nav, and gets two scroll areas that fight each other. This is the device most couples will actually build their site on.
- **Evidence:** apps/web/app/dashboard/[eventId]/website/editor/_components/editor-shell.tsx:189 (`h-[calc(100vh-3.5rem)]`) rendered inside apps/web/app/dashboard/[eventId]/layout.tsx:452 (`<div data-shell-main className="pb-20 lg:pb-0">`) and :457 (`px-4 py-6`), under the sticky bar at apps/web/app/_components/nav/sidebar-shell.tsx:215 with content at layout.tsx:339 (`py-3` + a `py-1.5 text-xs` control ≈ 3.5rem).

### [MEDIUM] The couple's only manual override — "force the wall live" — reaches the venue projector but not a single guest's phone. `events.live_mode_override` is honored by `resolveWallMode`, which `getWallSnapshot` applies for `/wall/[eventId]`. The guest page never reads it: `loadLiveLayer` gates the whole wall + watch block on `getDayOfPhase(...) === 'live'` and reads only `tiles/count/caption` off the snapshot, discarding `mode`.
- **A guest experiences:** At 5 PM the couple notices the guest pages have gone dark and presses the one control they have — "go live now." The projector on the wall obeys. Every phone in the room keeps saying the wedding wrapped up. There is no way for them to fix it from inside the product.
- **Evidence:** Override write: apps/web/app/dashboard/[eventId]/live/actions.ts:63. Honored: apps/web/lib/live-wall-logic.ts:91-107, apps/web/lib/live-wall.ts:266-269. Ignored on the guest side: apps/web/app/[slug]/_lib/loaders.ts:612 (hard `dayOfPhase === 'live'` gate) and :624 (snapshot consumed without `mode`).

### [MEDIUM] The "Photos" button in the event-day bar turns into a dead end at 4 PM. `publicAlbumHref` points at the in-page live wall while `liveWall` exists, and switches to `/[slug]/recap` once the phase is `post`. But `liveWall` is null in `post` (same live-only gate), and `/[slug]/recap` renders a "not ready yet" stand-in until the couple explicitly publishes a recap — which will not have happened during their own reception.
- **A guest experiences:** A guest taps Photos during dinner and lands on a page telling them the couple has not published their recap, with a button back to the page they just left. The photos are being taken in the room around them.
- **Evidence:** apps/web/app/[slug]/_lib/loaders.ts:767-771; apps/web/app/[slug]/recap/page.tsx:112-133 ("The recap isn't ready yet … hasn't published their wedding recap").

### [MEDIUM] The offline promise printed on the day-of banner is wider than the offline coverage. The banner tells the guest their schedule, QR and venue info "work offline if WiFi cuts out." The service worker intercepts navigations for exactly two paths — a bare `/[slug]` and `/[slug]/find-my-table`. `/[slug]/hub` (the Live hub the day-of bar's own chip links to), `/[slug]/seat`, `/[slug]/venue`, `/[slug]/find-seat` and `/papic/guest` are all two-segment paths that fall through to the plain network fallback → `/offline.html`. Cross-origin requests return early, so every R2-hosted photo, hero image and wall tile is uncached.
- **A guest experiences:** Signal drops at the venue. The guest taps the "Live hub" chip the page is advertising and gets the offline page. The invitation itself does reload from cache, but with blank rectangles where the photos were. The banner told them this would work.
- **Evidence:** Promise: apps/web/app/[slug]/_components/day-of-banner.tsx:20-21. Coverage: apps/web/public/sw.js:83-121 (`isDayOfGuestNavigation` — length 1, or length 2 only when segments[1]==='find-my-table'), :353-375 (network-first for those two), :377-398 (every other navigation left to the browser), :325-332 (cross-origin returns early). Live-hub link: apps/web/app/[slug]/_components/public-event-day-bar.tsx:42-53; apps/web/app/[slug]/page.tsx:718-722.

### [MEDIUM] The two day-of pages have no loading state at all. There is no `loading.tsx` for `/[slug]` or `/[slug]/hub`, and no `<Suspense>` anywhere under `app/[slug]`. Both pages read cookies, so they render fully dynamically on every request; `/[slug]/page.tsx` alone has 32 awaits before its loaders, which then run further serial database reads. (Sibling routes `welcome` and `find-my-table` do have `loading.tsx`, so the pattern exists — it just was not applied to the two that matter most on the day.)
- **A guest experiences:** On a congested venue network, a guest who scans the QR gets a plain white screen for as long as the server takes — no monogram, no spinner, nothing that says it is working. Most people tap again or assume the link is broken.
- **Evidence:** Directory listing of apps/web/app/[slug]/ and apps/web/app/[slug]/hub/ — only page.tsx/layout.tsx/not-found.tsx; `grep -rn Suspense apps/web/app/[slug]` returns nothing. Dynamic: apps/web/lib/guest-session.ts:72-75 (`cookies()`), apps/web/app/[slug]/page.tsx:391 etc. Existing loaders: apps/web/app/[slug]/welcome/loading.tsx, apps/web/app/[slug]/find-my-table/loading.tsx.

### [MEDIUM] The live photo wall goes stale silently. `LiveWallBlock` polls every 25 seconds and swallows every failure with an empty catch — no error state, no retry indicator, no timestamp. The header keeps rendering an animated "Live from the celebration" dot and the last successful "N moments and counting" count.
- **A guest experiences:** The wall freezes on the same twelve photos while the celebration keeps going, and it still says "live" with a blinking dot. The guest concludes nobody is taking pictures, when in fact their phone just stopped being able to fetch them.
- **Evidence:** apps/web/app/[slug]/_components/live-wall-block.tsx:73-75 (`catch { /* transient venue-WiFi failure */ }`), :173-188 (`animate-pulse` dot + count rendered unconditionally). Feed: apps/web/app/[slug]/live-wall/route.ts.

### [MEDIUM] After the wedding the Gallery tab is never drawn. `resolveSiteNav` takes a parameter named `anyChapterPublic` and is meant to answer "has the couple made at least one gallery chapter public?" Both call sites pass a LIVE-WALL boolean instead: `isLive && Boolean(liveWall)`. Since `isLive` is false in the `after` phase, `anyChapterPublic` is structurally always false then, so the Gallery slot is dropped for every non-couple viewer once the day-of window closes — permanently.
- **A guest experiences:** The morning after the wedding a guest opens the page to look for photos and there is no Gallery tab in the bottom bar — not greyed out, absent — no matter how much the couple has made public. Note this compounds with the phase bug above: because `post` starts at 4 PM, this actually begins mid-reception.
- **Evidence:** Rule: apps/web/app/[slug]/_lib/site-nav.ts:195-202 (Gallery drawn when `phase === 'day' || phase === 'after'` AND `isCouple || anyChapterPublic`). Wiring: apps/web/app/[slug]/_components/site-body.tsx:879 (guest: `gallery: isLive && Boolean(liveWall)`) and :575 (anonymous: `dayOfPhase === 'live' && plan.liveMediaVisible && Boolean(liveWall)`), both passed as `anyChapterPublic` at :810 and :1561.

### [MEDIUM] `/[slug]/invite` has no visibility gate at all. It uses the service-role client, looks the event up by slug, and never consults `landing_page_visibility` — while its sibling routes (`find-seat`, `hub`, `recap`) all call `canViewSlugEvent`. On a fully private event it renders the couple's display name, event date and venue name, and hands the caller a valid join token → a guest session. Slugs are derived from the couple's own first names, so they are guessable. Recorded in DECISION_LOG.md 2026-08-03 as an owner/DPO call, not an engineering one; verified unchanged at HEAD (the whole file is 60 lines and contains zero visibility checks). Note this compounds with the finding above: guess a slug → /invite → join → be treated as a host.
- **A guest experiences:** A stranger who guesses "first-and-first" can see whose wedding it is, when, and where — on an event the couple has kept private — and can walk in as a guest. The couple can rotate the token, but they have no reason to know they need to.
- **Evidence:** apps/web/app/[slug]/invite/page.tsx:1-60 — `createAdminClient()` at :23, `.eq('slug', slug)` at :27, selects `display_name, event_date, venue_name` at :26, returns `<JoinFlow event={event} token={token} …>` at :52-58. `grep -c canViewSlugEvent` on that file = 0.

### [MEDIUM] Guests' photos still never find them automatically. DECISION_LOG.md 2026-08-04 records the owner answering "on" for face auto-tagging and PR #4103 shipping the missing admin control, but it also records that no prod row was flipped by code — the DPO presses it per event. I queried prod today: all five events are `papic_face_mode = 'mode_b'`, and `faceVectorForMode` hard-nulls `face_vector` at the DB boundary on anything but an exact `mode_a`. So the feature is on at the app and off at the wall, exactly as recorded.
- **A guest experiences:** A guest ticks the consent box at RSVP expecting their photos to be delivered to them, then at the wedding nothing arrives unless a human tags them by QR. The promise the RSVP made is not kept, and there is no error anywhere — it just quietly does nothing.
- **Evidence:** Prod DB (read-only SELECT, 2026-08-05): `select slug, papic_face_mode from events` → all 5 rows `mode_b` (`maria-and-jose`, `cale-ice`, `movie-night`, `papic-pool-test-simple-event`, one slug-less wedding). DECISION_LOG.md 2026-08-04 row '👤 FACE AUTO-TAGGING IS ON'; apps/web/lib/papic-face-mode.ts (`faceVectorForMode`).

### [MEDIUM] A guest cannot request a song. The data layer is complete and live in prod — `guest_submit_song_request` and `open_submit_song_request` both exist as functions, `event_song_requests` is live, the band's inbox reads it — but the ONLY callers of either function anywhere in the repo are tests. There is no request surface under `app/[slug]/**` at all. This is WHATS_NEXT_INDEX.md's song-desk register entry, PR 7: 'Guest-facing request button + guest song search — owner-DEPRIORITISED'. Still exactly true.
- **A guest experiences:** At the reception a guest has no way to ask the band for a song from their phone. The band's request lane on their own screen will stay empty forever, which reads to them as "nobody wanted anything" rather than "the button was never built".
- **Evidence:** Prod DB: `pg_proc` lists `guest_submit_song_request(p_guest_id uuid, …)` and `open_submit_song_request(p_master_qr_token text, …)` in `public`. `grep -rn 'guest_submit_song_request\|open_submit_song_request' apps/web` returns only apps/web/tests/db/song-requests.db.test.ts. `grep -rni 'song_request' apps/web/app/[slug]/` returns nothing. `grep -rln event_song_requests apps/web` → vendor-dashboard/on-the-day/actions.ts, tests/db/song-requests.db.test.ts, lib/interconnect/probes.ts. WHATS_NEXT_INDEX.md:~430 (song-desk PR table, row 7).

### [MEDIUM] The whole open-browse program is invisible to every real guest, because the only event with `website_open_browse = true` is the sample. New events now default to true (the column default was flipped), but `cale-ice` — the only real public wedding site — is false and was never opted in. WHATS_NEXT_Open_Browse_Handoff_2026-07-23.md §3 PR11 says this is deliberate ('existing events opt in via the board — no backfill of in-flight weddings') and the couple-facing toggle does ship, so this is an un-pressed control rather than a bug. It is, however, the precondition for the dead-tab finding above.
- **A guest experiences:** On the real wedding site a guest sees only the Save-the-Date film and a bar; there is no browsable Details, Story or Me section behind the tabs. Everything the open-browse program built is only visible on the demo wedding.
- **Evidence:** Prod DB 2026-08-05: `website_open_browse` = true only for `maria-and-jose` (is_sample=true); false for `cale-ice`, `movie-night`, `papic-pool-test-simple-event`. Column default is now `true` (information_schema.columns). Couple's control ships at apps/web/app/dashboard/[eventId]/website/editor/page.tsx:265-270 and actions.ts:63-80. WHATS_NEXT_Open_Browse_Handoff_2026-07-23.md §3 PR11.

### [MEDIUM] The guest's "Photos" button answers a question about a camera. `galleryHref` is hardcoded to `/papic/me/{qrToken}` regardless of whether the event has a Papic camera, and that page's `camera.status === 'none'` branch leads with a camera-activation headline.
- **A guest experiences:** A guest taps "Photos" expecting pictures of themselves and is told the host hasn't turned on a camera. On a wedding that never bought Papic, that is the only answer they ever get from that button — every visit, from the day they redeem their invite.
- **Evidence:** apps/web/app/[slug]/_components/guest-hub-bar.tsx:103 (`const galleryHref = '/papic/me/' + qrToken`), :189-208 (Photos link, no gate); apps/web/app/papic/me/[token]/page.tsx:263-283 ("Your Papic camera isn't ready yet — The host hasn't turned on Papic for the guest list yet"). The gallery block inside it returns null when there are no tagged photos (:96).

### [MEDIUM] Two fixed bottom bars stack on the same screen for a signed-in guest. `GuestHubBar` is rendered unconditionally in the guest branch of the page, and `SiteMenuBar` renders whenever `siteMenuEnabled` is true — which is unconditional for the sample event and, judging by the live /cale-ice bar, also on in prod via the env flag.
- **A guest experiences:** A guest on the demo wedding — the one the owner shows people — sees two control bars piled on top of each other at the bottom of their phone, one partly hidden behind the other.
- **Evidence:** apps/web/app/[slug]/page.tsx:709-726 (`<GuestHubBar …/>`, no menu-flag gate) with `fixed inset-x-0 bottom-0 z-40` at _components/guest-hub-bar.tsx:150-153; apps/web/app/[slug]/_components/site-body.tsx:1553-1574 (`<SiteMenuBar …/>`) with `fixed inset-x-0 bottom-0 z-30` at _components/site-menu-bar.tsx:129-131; apps/web/app/[slug]/_lib/site-menu.ts:71-76 (`isSample || flag === 'true'`); site-body.tsx:1546 comment: "Coexists with the GuestHubBar … until PR11 retires the old bars."

### [MEDIUM] The seat pass 404s for every event type except weddings. `/[slug]/seat` hardcodes `event.event_type !== 'wedding'` while its siblings (/find-seat, /find-my-table, /recap, /hub, /print, /pabuya) are all profile-driven, and all 16 event types enable the `website` surface. The link that leads there is gated only on the paid SKU, which has no event-type check.
- **A guest experiences:** At a debut or a birthday that bought the branded QR pack, a guest taps "Your seat pass" — or scans the printed table QR — and gets "This invitation link can't be found." The free name-search finder on the same event works fine.
- **Evidence:** apps/web/app/[slug]/seat/page.tsx:99 `if (!event || event.event_type !== 'wedding') notFound();` vs apps/web/app/[slug]/find-seat/page.tsx:52 and find-my-table/page.tsx:63 (`surfaceEnabled(profile,'website')`); apps/web/lib/seat-pass.ts:44-49 (`eventOwnsCustomQrGuest` — no event-type gate); apps/web/app/[slug]/_components/site-body.tsx:1371-1379 ("Your seat pass" link, gated on `seatPassActive` only). Prod DB `event_type_profiles`: all 16 types include 'website'.

### [MEDIUM] Every "we don't recognise you" state tells the guest to go ask someone, and none of them offers the working recovery that exists on the same site. The stale/rotated-token message, the no-signal message, and the two "Open this from your invitation" prompts all dead-end; none links to `/[slug]/invite` (self-join) or `/[slug]/find-seat` (free name search).
- **A guest experiences:** A guest who cleared their cookies, switched phones, or whose QR was replaced opens their link and is told to ask the host for a new one — at the venue, at 6pm, with the host at the altar. The two pages that would rescue them (add yourself to the list; type your name to find your table) are one tap away and never offered.
- **Evidence:** apps/web/app/[slug]/_components/site-body.tsx:660-676 (invalid_invite / wrong_event / no-signal copy, no recovery link); apps/web/app/[slug]/seat/page.tsx:186-214 (prompt with no forward link — the only exit is the header logo); apps/web/app/[slug]/find-my-table/page.tsx:74-83 (same); the free finder at apps/web/app/[slug]/find-seat/page.tsx is linked from exactly one place, site-body.tsx:703, inside `normalBody`.

### [MEDIUM] During the save-the-date phase the whole browsable site renders with zero side margin. `fullBleed` skips InvitationShell's `px-4 max-w-3xl` column, and the body lifted in beneath the film inherits no padding of its own. Measured live: `#site-details` left 0 / right 375; `.pahina-plate` left 0 / right 375; the `#site-me` card's rounded border sits on both screen edges. Both live event sites are in this phase, and it is the phase of "nearly every newly-created wedding" (>90 days out).
- **A guest experiences:** Every card, heading and paragraph on the couple's page touches both edges of the phone screen with no breathing room. The rounded cards look cut off, and the page reads as unfinished rather than designed.
- **Evidence:** /Users/icecasasola/Documents/Claude/Projects/setnayan-platform/apps/web/lib/site-body-plan.ts:308 (`fullBleed: showSaveTheDate && stdFilm`) → apps/web/app/[slug]/_components/invitation-shell.tsx:70-80 (bare `<main class="min-h-dvh bg-cream text-ink">`, no column) vs :112-126 (the padded column that is skipped); body injected at _components/std-film-handoff.tsx:65. Served HTML of both /maria-and-jose and /cale-ice shows `max-w-3xl` count = 0.

### [MEDIUM] The locked Camera tab's reason is carried only in a `title` attribute on a non-focusable <span>, and a test pins it there. A phone has no hover, so the reason is unreadable. The same span is styled `text-ink/35` — roughly 2.1:1 contrast against cream, below the 3:1 floor for any text and far below 4.5:1 for its 12px label. Same for the locked Watch slot.
- **A guest experiences:** A guest sees a faint, barely visible Camera tab with a tiny padlock and no explanation. They never learn that the host simply hasn't opened the camera yet — it just looks like the app is broken.
- **Evidence:** /Users/icecasasola/Documents/Claude/Projects/setnayan-platform/apps/web/app/[slug]/_components/site-menu-bar.tsx:82 and :108 (`title={slot.lockedReason}`, `text-ink/35`); pinned by _components/site-menu-bar.test.ts:72. Reason strings at _lib/site-nav.ts:150,176,188. `grep -rn lockedReason apps/web` shows the title attribute is the only consumer. Contrast computed from the live palette vars (--color-ink 30 34 41, --color-cream 251 251 250).

### [MEDIUM] The "Details" tab is drawn before the wedding day whether or not the Details section exists on the page. `resolveSiteNav` pushes it unconditionally in the `before` phase; NavInput carries `hasStory` but has no `hasDetails`, and the caller computes `menuSections.details` and then never passes it. This is the dead-anchor class of bug that was recorded as fixed on 2026-08-03 — it returned through the new resolver.
- **A guest experiences:** A guest taps "Details" in the bottom bar and nothing happens. The bar teaches them it is unreliable, so they stop using it.
- **Evidence:** /Users/icecasasola/Documents/Claude/Projects/setnayan-platform/apps/web/app/[slug]/_lib/site-nav.ts:152-153 (unconditional push) and :88-104 (no `hasDetails` field); apps/web/app/[slug]/_components/site-body.tsx:571-575 computes `menuSections.details`, :810-811 and :1561-1562 pass only `.gallery`/`.story`. Verified live on https://www.setnayan.com/cale-ice: bar hrefs are #site-home (exists), #site-details (DOES NOT EXIST), /papic/guest, #site-me (exists). Prior record: DECISION_LOG.md row 2026-08-03 "DEAD TABS".

### [MEDIUM] On a real (non-sample) event the bottom bar is mounted but permanently unreachable. The env flag mounts it on every event, but the film's exit control is gated on open-browse, which is off for real events — so the full-screen film never lifts and the bar sits under it forever. Measured on cale-ice: docH === innerH === 812 (the page is only the film), and hit-testing the first tab returns the film's overlay div.
- **A guest experiences:** A guest opening a real couple's link watches the save-the-date and then has nowhere to go — the menu at the bottom of the screen is invisible and every tab is dead. They cannot reach the details, the story, or their seat.
- **Evidence:** /Users/icecasasola/Documents/Claude/Projects/setnayan-platform/apps/web/app/[slug]/_components/site-body.tsx:547 (`canExit={plan.openBrowse}`) and :467-470 (StdFilmHandoff mounted only under openBrowse); _components/save-the-date-film.tsx:739 (`{canExit && idx === closeIdx ?`). Prod row: events.slug='cale-ice' has is_sample=false, website_open_browse=false. Live: docH 812 at 375x812, elementFromPoint over tab 1 → the film's `absolute inset-x-0 top-0 bottom-0`.

### [LOW] No error boundary exists anywhere in the guest tree, so a crash ejects the guest out of the couple's site into Setnayan's own chrome. The only error.tsx files in the app are the root one plus admin, vendor-dashboard and one dashboard sub-route — nothing under app/[slug]. Any throw, including the deliberate one in find-seat, bubbles to app/error.tsx, which renders outside [slug]/layout.tsx (losing the couple's editorial typography and palette) and offers "Take me home" pointing at the Setnayan marketing homepage.
- **A guest experiences:** A guest at a wedding hits a failure and lands on a page branded Setnayan, in different fonts, whose only exit is a vendor marketplace homepage. There is no link back to the wedding they were trying to open.
- **Evidence:** `find apps/web/app -name error.tsx` → app/error.tsx, app/global-error.tsx, app/admin/error.tsx, app/vendor-dashboard/error.tsx, app/dashboard/[eventId]/seating/error.tsx — none under app/[slug]; the deliberate throw at apps/web/app/[slug]/find-seat/page.tsx:70-71; the recovery link at apps/web/app/error.tsx:48-53 (`href="/"`); the editorial font scope that is bypassed at apps/web/app/[slug]/layout.tsx:15-21.

### [LOW] The visibility status chip paints "Private" in success green. The chip only greys out for the literal strings 'Not set', 'Off' and 'Hidden', so 'Private' — the state where no guest can open the site — reads as a healthy, done-looking badge identical to 'Public'.
- **A guest experiences:** Scanning the rail, a couple sees a row of green ticks and reads their site as finished. The one badge that means "nobody can see this" looks exactly like the ones that mean "done".
- **Evidence:** apps/web/app/dashboard/[eventId]/website/editor/_components/editor-shell.tsx:299-310 (grey only when `row.status === 'Not set' || 'Off' || 'Hidden'`, otherwise `bg-success-100 text-success-800`); the status string is set at apps/web/app/dashboard/[eventId]/website/editor/page.tsx:251.

### [LOW] CONFIRMED, not new — the known home-tab gap. The nav resolver renames the home slot by phase (Home → Now on the day → Recap after), but the bar the guest actually sees reads its label from a fixed table and is always "Home". A test pins the fixed behaviour.
- **A guest experiences:** On the wedding day the first tab still says "Home" rather than "Now". Already recorded as a deliberate gap — listing it only to confirm it is still the live state.
- **Evidence:** apps/web/app/[slug]/_lib/site-nav.ts:138 (`label: phase === 'day' ? 'Now' : phase === 'after' ? 'Recap' : 'Home'`) vs apps/web/app/[slug]/_lib/site-menu.ts:32-38 (`TAB_LABELS.home = 'Home'`) consumed at :60; pinned by apps/web/app/[slug]/_lib/site-nav-vocabulary.test.ts:176-181.

### [LOW] "Happening now" can pin to the last schedule item forever. In the wall-clock path, a block's virtual end is its `end_at`, else the next block's start, else `null` — and `null` is treated as "still running": `if (start <= nowMs && (end === null || nowMs < end)) currentIndex = i`. The last block therefore never ends if the couple left its end time blank, and the couple's editor does not require one (the `end_at` input carries no `required`). LATENT today: all 17 schedule rows in prod have an `end_at`.
- **A guest experiences:** If a couple leaves the last item's end time blank, the wedding page says "Happening now · Send-off" with a pulsing dot for the rest of the site's life — weeks and months after the wedding.
- **Evidence:** apps/web/app/[slug]/_components/schedule-widget.tsx:78-83 (ends array), :107 (`end === null` keeps currentIndex), :220-227 (pulsing "Happening now" label). Editor: apps/web/app/dashboard/[eventId]/schedule/page.tsx:817 — `<input name="end_at" type="datetime-local" />`, not required. Prod check: `select count(*) filter (where end_at is null) from event_schedule_blocks` → 0 of 17.

### [LOW] The countdown disappears about seven hours before the ceremony. `CountdownWidget` is handed `event.event_date`, a bare `YYYY-MM-DD`, and does `new Date(targetIso)` — which parses as UTC midnight, i.e. 08:00 Manila on the wedding day. It returns `null` once past. It does not go negative; it vanishes.
- **A guest experiences:** On the morning of the wedding — the one day everybody opens the page — the "Until we say I do" countdown quietly disappears at 8 AM, hours before a 2 or 3 PM ceremony. Nothing replaces it until the day-of banner, so the top of the page just loses a block.
- **Evidence:** apps/web/app/[slug]/_components/hideable-widget-render.tsx:85 and public-hideable-widget.tsx:51 (`targetIso={event.event_date}`); apps/web/app/[slug]/_components/countdown.tsx:21 (`new Date(targetIso)`), :30 (`if (remaining.isPast) return null`). `events.event_date` is a DATE column (information_schema).

### [LOW] `events.timezone` is never read by the guest site. The schedule's venue clock is derived from venue coordinates, defaulting to `Asia/Manila` when coordinates are missing or unresolvable. The column exists and is populated ('Asia/Manila' on both live examples) but has no reader under `app/[slug]`.
- **A guest experiences:** Harmless for a Philippine wedding. For a couple marrying abroad who never pinned a venue on the map, every posted time is silently interpreted as Manila time, so "happening now" and "up next" point at the wrong item all day.
- **Evidence:** apps/web/app/[slug]/_components/site-body.tsx:1074 `eventTz={eventTimezoneFromCoords(event.venue_latitude, event.venue_longitude)}`; apps/web/lib/event-timezone.server.ts:17-24 (null coords → DEFAULT_EVENT_TZ); apps/web/lib/schedule.ts:718 `DEFAULT_EVENT_TZ = 'Asia/Manila'`. Grep for `timezone` under app/[slug]: no hits. Prod: `maria-and-jose` has NULL venue_latitude/longitude.

### [LOW] STALE CORPUS ITEM — DO NOT REBUILD. The guest-side receiver for coordinator announcements NOW SHIPS. DECISION_LOG.md 2026-08-03 ('THE ANNOUNCEMENT HALF PARTLY EXISTS … IT NEVER REACHES A GUEST') and WHATS_NEXT_Pahina_and_Role_Surfaces_2026-07-29.md §4A ('guest side confirmed not built') are both out of date. What genuinely remains from that brief: the phones-down banner broadcast kind and `broadcast_acknowledgments` were never built, and owner-queue item 8 (who may send, and fixed-list vs free typing) is still an open owner decision.
- **A guest experiences:** None negative — a guest on the day now does see the coordinator's latest announcement. Reporting it so the next session does not spend a PR rebuilding it, which §4A currently instructs.
- **Evidence:** apps/web/app/[slug]/_lib/loaders.ts:238-260 (`export const loadDayOfBroadcast`, live-window-only, latest-one-only); apps/web/app/[slug]/_components/site-body.tsx:84 (`import { DayOfAnnouncement }`) and :901 (`{dayOfBroadcast ? <DayOfAnnouncement body={dayOfBroadcast.body} /> : null}`); apps/web/app/[slug]/page.tsx:508-510. `grep -rn 'phones.down\|phonesDown' apps/web` → 0 hits; `broadcast_acknowledgments` appears only as a comment in supabase/migrations/20270825364600_coordinator_p3_broadcasts.sql:11. WHATS_NEXT_INDEX.md:36 (owner queue item 8). Prod: `data_privacy_controls.coordinator_day_of_broadcast` = active.

### [LOW] The couple's own wedding song is silent at the moment it was designed for. `eventOwnsPakanta` is a hardcoded `false` stub pinned by a test, so the seat-pass arrival bloom never plays a Pakanta track — while `PAKANTA` is ACTIVE and sellable in the live retail catalog at ₱2,500. The recap path does work (it reads `events.pakanta_song_r2_key` and presigns it), so only the seat-pass arrival is affected.
- **A guest experiences:** A couple who paid ₱2,500 for a song written for their wedding: a guest opens their seat pass at the door and the arrival flourish plays in silence. The song does appear later in the recap, so nothing is lost — it just misses the entrance moment it was built for.
- **Evidence:** apps/web/app/[slug]/seat/page.tsx:320 (`const hasPakanta = await eventOwnsPakanta(admin, event.event_id); // stub → false`); apps/web/app/[slug]/seat/_components/arrival-bloom.tsx:22 and :122; apps/web/lib/seat-pass.test.ts:102 ('eventOwnsPakanta: ALWAYS false (Pakanta is not_built · inert stub)'). Prod DB: `select service_code, retail_price_php, is_active from platform_retail_catalog_v2 where service_code='PAKANTA'` → PAKANTA, 2500.00, true. Working path: apps/web/app/[slug]/_components/editorial/data.ts:2099-2103.

### [LOW] Two live guest-facing processing activities run without a filing row, by an explicit owner decision that is worth re-confirming rather than re-discovering. `guest_columns` (guests write a column that publishes their text and roster-name byline to the open web) and `papic_pool_gallery` (every guest's captures visible to all session guests) have been `active` in prod since 2026-07-27 with `declaredIn: []`. The /privacy disclosures landed 2026-07-30; the ROPA rows are drafted (DPS-15, DPS-16) but the bundled PDF is not regenerated. Owner-locked to a January 2027 filing.
- **A guest experiences:** A guest writes a note for the couple and it is published under their real name to the open web; another guest's candid shots are visible to every guest at that event. Both are disclosed on the privacy page, so the guest is told — the gap is regulatory paperwork, not the guest's experience.
- **Evidence:** Prod DB 2026-08-05: `data_privacy_controls` — `guest_columns` status=active updated_at 2026-07-27, `papic_pool_gallery` status=active updated_at 2026-07-27. apps/web/lib/privacy-coverage.ts:113-121 (`guest_columns: { declaredIn: [], note: 'NOT IN THE FILING YET (honest drift…)' }`) and :122-126 (`papic_pool_gallery`). WHATS_NEXT_INDEX.md ROPA register row.

### [LOW] The guest-session cookie lasts 60 days and is only re-issued when the guest scans/redeems again. Ordinary page visits do not extend it.
- **A guest experiences:** Couples launch their Save-the-Date months ahead. A guest who opened their invitation in August for a December wedding is signed out again by October — so on the wedding day their bookmark shows the stranger's page, not their seat or their QR, and they have to dig up the original email.
- **Evidence:** apps/web/lib/guest-session.ts:7 `COOKIE_MAX_AGE_SECONDS = 60*60*24*60`; `setGuestSession` is called only from app/[slug]/redeem/route.ts:47 and app/[slug]/seat/claim/route.ts:65 — never on a plain page render.

### [LOW] Two guest routes match the slug case-sensitively while the other twelve don't. `/[slug]/invite` and `/[slug]/venue` use `.eq('slug', slug)`; everything else uses `.ilike`.
- **A guest experiences:** Someone types the invite address with a capital letter — which iPhone keyboards do by default — and is told the invite link is invalid, even though the same address in lowercase works.
- **Evidence:** apps/web/app/[slug]/invite/page.tsx:27 `.eq('slug', slug)` → `<InvalidTokenScreen/>` at :31; apps/web/app/[slug]/venue/page.tsx:32 `.eq('slug', slug)`. Compare `.ilike('slug', slug)` in _lib/loaders.ts:113, redeem/route.ts:26, seat/claim/route.ts:46, live-wall/route.ts:33, find-my-table:56, hub:112, pabuya:47, print:57, seat:96, welcome:32, find-seat:45, recap:47.

### [LOW] A failed RSVP save is silent. On a database error the action logs a fault and returns; there is no message, no retry prompt, and no redirect.
- **A guest experiences:** A guest taps "Save RSVP", the button stops spinning, the page comes back looking the same, and nothing was saved. They have no idea it failed and the couple's list never shows them.
- **Evidence:** apps/web/app/[slug]/actions.ts:139-150 (`insertFaultLog(...); return;` with the comment "Best-effort silent failure for guest-side surface … A toast UI lands with the polish pass"); :115-120 (invalid status/meal also `return` silently).

### [LOW] A handful of guest-facing controls sit under the 44px minimum: the "Sign in" link on the join page is 41x18; "Back to the invitation" on the seat finder is 28px tall; "Watch the walk to your table" on a seat result is ~32px tall. The two main CTAs measured 40 and 42px — just short.
- **A guest experiences:** A guest standing at the venue mistaps the small links a couple of times before they land. Annoying rather than blocking.
- **Evidence:** Live measurement at 375x812: /maria-and-jose/invite → A "Sign in" 41x18; /maria-and-jose/find-seat → A "Back to the invitation" 158x28; /maria-and-jose → A "Find your seat" h42, A "Open my invitation" h40. Source of the walk control: /Users/icecasasola/Documents/Claude/Projects/setnayan-platform/apps/web/app/[slug]/find-seat/_components/name-search.tsx:148-153 (`px-3 py-1.5 text-sm`).
