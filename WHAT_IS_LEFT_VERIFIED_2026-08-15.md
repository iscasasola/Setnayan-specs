# What is left on setnayan.com — verified 15 August 2026

> Owner: *"we have unfinished tasks that did not complete on the website of setnayan.com"*
>
> **Supersedes the status lines in [`WEBSITE_ADJUSTMENTS_2026-08-14.md`](WEBSITE_ADJUSTMENTS_2026-08-14.md)**
> (verified against `3ca1af296`; **17 PRs merged after it was written**) and the counts in
> [`WHAT_IS_ACTUALLY_LEFT_2026-08-12.md`](WHAT_IS_ACTUALLY_LEFT_2026-08-12.md).
>
> Method: seven readers over seven areas, each attacked by a skeptic told to hunt BOTH failure
> modes — shipped work reported open, and broken work reported done. **Nine verdicts were
> overturned**, including three "live bugs" that were measurement artifacts and two "already
> done" items that were not. Checked against the live site, the code prod actually serves
> (`784c411`, self-reported by `/api/health`), the live prod DB, and `gh`.
>
> ⚠ **This file will rot at the same rate as the ones it supersedes. Re-verify before acting.**

---

## 0 · The three most serious, re-confirmed by hand before publishing

| Claim | Confirmed how |
|---|---|
| Lock books the supplier outright, with no way for them to agree | `20271107090000_vendor_agrees_to_lock.sql` is applied; `vendor_agree_to_lock` · `vendor_decline_lock` · `cancel_vendor_lock_request` · `lock_request_state` return **0 app files** each; `actions.ts:625` `LOCKED_STATUS = 'contracted'` written at `:1430` |
| 22 public pages print the brand twice | `curl` of `<title>`: `Pricing · Setnayan · Setnayan`, `Privacy policy · Setnayan · Setnayan`, `Sign in · Setnayan · Setnayan`. `/help` is correct ⇒ the template is fine, the pages hardcode it |
| Soft-404s tell Google a page exists | `/receipts/zzz-not-real` → **HTTP 200**, 77,893 bytes, no not-found wording in the body. Same for `/explore/compare` and `/maria-and-jose/welcome` |

---

## 1 · Live defects a person hits today

1. **The supplier is booked without being asked.** `finalizeVendor` writes `'contracted'` directly.
   The promise text sits at `lib/explore-info-copy.ts:55`. **The database half is LIVE with zero
   callers** — nine `lock_*` columns, three functions EXECUTE-granted to `authenticated`, trigger
   `event_vendors_guard_lock_handshake` attached and enabled. 45 rows, all `lock_request_state`
   NULL. **Sixth gate-with-no-handle.**
2. **A supplier cannot withdraw their verification application.** The only UPDATE policy's
   WITH CHECK admits `draft`/`pending_review`; `verify/actions.ts:467` writes `'withdrawn'`.
   Button at `verify/page.tsx:613`; the success banner at `:188` has never been seen.
3. **A free feature sits on the paid shelf at ₱0** and opens a checkout.
   `platform_retail_catalog_v2.CUSTOM_QR_GUEST` = 0.00, active; `add-ons-catalog.ts` has no
   `tier:'free'`. 🪤 **`suite-doorway-guardrails.test.ts:258-266` asserts `customQr.tier !== 'free'`
   — the guard is holding the defect in place. Change it in the same commit.**
4. **The money-gift page has no doorway.** `pabuya/page.tsx` is ungated and complete; the only
   non-self link is `studio/page.tsx:523`, and `studio/page.tsx:96` redirects to `/suite` in prod.
5. **13 soft-404s** — `loading.tsx` forces streaming so 200 commits first. `/explore/compare` is a
   `<loc>` in `sitemap-static.xml`. **Sweep by `loading.tsx`, not by the list.** Third recurrence;
   `first-byte.test.ts` never covered the siblings.
6. **The rail lights nothing on 8 tool pages + pricing/help/legal/alaala.**
   `frontdoor/rail-active.ts`'s docblock says those "can never be the current page" — a premise
   PR #4440 killed. 🪤 **`rail-active.test.ts:124-135` baselines the bug.**
7. **PR #4445 (20 public routes, one shell mount) is OPEN and CONFLICTING**, 95 files. #4444 merged
   15 min after it branched and edited 8 of the same files. It also carries the
   `gen-reserved-slugs.mjs` fix — **without it, moving routes into a group silently un-reserves 13
   route words including `/pricing`, `/privacy`, `/terms` as claimable addresses.**
8. **11 public pages + every blog article still wear the old nav/footer** — `/vendors` `/features`
   `/creators` `/blog` `/monogram` `/waitlist` `/how-it-works` `/our-story` `/why-setnayan`
   **`/tour` `/download`** (the last two were missed by the first count). Plus `/tl/about` old
   while `/about` is new, and `/explore/categories` unconverted inside a converted room.
9. **`/` is the only page with no search field.**
10. **22 pages print `· Setnayan · Setnayan`** — `layout.tsx:290-293` template plus 104 files that
    hardcode the suffix themselves.
11. **The homepage `<title>` + description promise photos "forever"**, contradicting `/privacy`
    (free 5 years, then paid). 38 non-admin "forever" occurrences app-wide.
12. **`/pricing` names the retired "Papic Pool"** (`_papic-estimator.tsx:235`) and ships 6 catalog
    rows with empty `description` (PAKANTA, PABATI, KWENTO, PAPIC_ADDON_THANK_YOU,
    PATIKTOK_COMPILER, SEATING_3D). **Pakanta ₱2,500 has no public page at all.**
13. **3 sitemapped dead ends** — `/waitlist` promises `theirname.setnayan.com` (DNS fails;
    `EVENT_SUBDOMAIN` `is_active=false`), `/open-shop` 307s to login, and `/alaala` is in **no**
    sitemap while its 7 siblings are.
14. **`/download` is Mac-only and reads version 0.0.1.** The `.msi` already publishes at
    `build-desktop.yml:162-206`. *(Intel Macs are correctly handled — that sub-claim was wrong.)*
15. **Copy/display faults:** category count 61 vs 192 · `/setnaprod` says "0 yrs" · `/help` lists 2
    vendor plans of 3 (Solo missing) · `/realstories` prints `Vol. I · No. –` · 404 bodies are 25
    visible chars and carry both `noindex` and `index, follow` · `/llms.txt:33` says Setnayan AI is
    ₱2,499 while `/pricing` says ₱1,499 (both are half the truth; non-wedding types see only the
    wedding price).
16. **Built but unreachable / unusable:** emcee-in-a-bundle empties the coordinator's recipient list
    (`stage-notes-recipients.ts:88` hardcodes `serviceCategories: null`) · suppliers get 6 presets
    and no free text (`day-requests.ts`) · the photographer's capture view closes at midnight
    (`on-the-day/live/[eventId]/papic/page.tsx:50`) · `photo_wall_photos` has **no writer** · the
    crew page shows "Claimed" with no names (`studio/papic/crew/page.tsx:347-383`) · every vendor is
    born with the 3-value venue default and there is no editor · `max_soft_holds_per_date` has one
    reader (`vendors/actions.ts:1325`) and **no writer** · `launch_mode`/`manual_phase` have
    **ZERO hits app-wide** — no reader either, so the phase logic must learn to consult it.

## 2 · Blocks other work

17. **Rebase and land #4445.** Blocks 6, 8, all doorway work; carries the reserved-slug fix.
18. **`budget-live-summary.tsx:39` → `getBudgetLiveSummary` → `budget/actions.ts:599` returns raw
    legacy math**, and refetches on `postgres_changes` + every socket reconnect. The join only holds
    for first paint. `budget-one-core.test.ts` lists two surfaces and cannot see this one.
    **Must land before the newer budget math is switched on.** Second half: with the new math on, a
    ₱2,250,000 budget with no committed suppliers renders "Set your budget".
19. **Re-plan PR-H before coding item 1.** 14 HIGH plan defects; #1 (the vendor cannot open the page
    the agree card was specced onto) confirmed against prod. **13 were not re-checked individually.**
    The re-plan must account for the schema already being live.
20. **CSP enforcement would break face features.** `next.config.ts:187` `connect-src` omits
    `storage.googleapis.com`, `cdn.jsdelivr.net` and the r2.dev host — all three hardcoded at
    `lib/face-gate.ts:48-51` and `lib/face-embed.ts:42/73` — and names `media.setnayan.com`, which
    does not resolve. `api/csp-report/route.ts` ends at `console.warn`. **Work as one row.**
21. **Retire `nav/sidebar-shell.tsx`** — 281 lines, exactly **2** real imports, both passing
    `desktopRailExternal` so the sidebar branch is unreachable. **4 guards will go red on deletion**
    (`one-shell-event-rail.test.ts:98-131`, `one-main-per-page.test.ts:144-151`,
    `one-top-bar.test.ts:403-408`, `vendor-rail-context.test.ts:267`) — they exist to hold the
    deletion until `.sn-vt-page` is rehomed. Admin already did it; copy that.
22. **`_components/states` (built 13 days ago) has zero consumers** outside its own folder.
23. **Guards that cannot fire / stale notes:** the rail baseline (6) · the force-dynamic guard covers
    10 of 20 shelled routes (`/privacy`'s stale `revalidate = 3600` is **dead, not harmful** —
    settled from headers) · `gates-have-handles.test.ts` checks a hand-typed list of five, not the
    DB · a comment calling July-removed nav slots "untouched" · the shell claiming Real Stories is
    not mounted (it is) · `ONE_SHELL_PLAN` §5 still lists the button-colour question answered 08-14 ·
    no DECISION_LOG row for Plans/Payments as canon.

## 3 · Background

`anon` SELECT on 306 of 383 public tables, 212 with no policy admitting an anon reader ·
the compliance pack describes 14 processing activities where 19 run, says PH residency in 4 rows,
and states 5-year photo destruction · admin/vendor-interior/couple-dashboard got the frame only
(~90 hand-built tables in HQ, 22 one-off components in the shop) · 4 surfaces have no design
(guided tour, deep Papic, onboarding quiz, sign-up/claim/join) · no avatar maker · presigned URLs
re-transform per render (copy `lib/background-videos.ts`) · the 3+3 editorial cap is app-only ·
the PGlite `auth.role()` shim · **the compensating password rules promised on 2026-08-10 were never
built — grep returns zero files; the only check is an 8-char minimum from 5 July** · demo dead-ends
point at the replaced homepage (4 files) · 4 marketplace panels on the older card style + bare
"Find more" empty rows.

## 4 · Owner, not engineering — 26 questions

Marketing pages get the rail? · seat-plan double door (one ruling covers budget too) · rail
lettering + push-vs-swap · saved-plans below payments on phones · what a coordinator is called on
non-weddings · per-supplier visibility for the couple · turn on per-plan hold caps (bends the
"inbox is never locked" lock) · reference required on all four pay-Setnayan forms · which page
carries the approved hero copy · Features = comparison or editorial · the Papic "what this would
cost" number · may the Papic page say faces are matched (**do not write it before §6 settles**) ·
wipe recordings between weddings · private link vs the file · **sign the anti-fraud privacy
capability (19 of 20 carry your name, this one is blank)** · **sign the two guest-photography
records — it is already selling** · was the corrected counsel packet re-sent · who runs the first
fake livestream (new channels have a 24h wait) · what a person's public address looks like ·
switch the booking fee on · year-six gallery price · **pay for the DB upgrade — the "stay free"
call also accepted no automatic backups of guest lists, seating, payments or the photo index** ·
look at the event home page on a phone · look at the admin work list on a phone · may a supplier
cancel their own application (unblocks item 2) · are shop email + mobile meant to be public.

## 5 · Outside party

Google appeal `73857927` (still unresolved; blocks Search Console data + a channel rehearsal) ·
known-hash provider enrolment + NPC Circular 16-02 processor agreement (paperwork; **do not flip
the switch before both**) · Google/Bing verification codes need pasting **then a rebuild** — neither
tag renders today · moving DNS off GoDaddy is the only route to `media.setnayan.com` · the YouTube
ToS question is moot (streaming is locked to the couple's own channel).

## 6 · Could not be verified — and what settles it

**One read of the hosting project's production env vars settles six of these:** the marketplace
redesign switch, the new budget-math switch, the two face-model addresses, the per-service details
sheet, the multi-camera controller. Three items above hang on them.

- **Is the face matcher running at all?** Every event is in that mode, but prod holds **zero**
  enrolments, zero vectors, zero auto-matched tags, and the matcher no-ops unless one address is
  set. The 1.3 MB face library on the temp public address may be a leftover — the app's detector
  comes from a normally-installed package. **Do not write face-matching copy until this is settled.**
- **Can a couple buy Live Studio today?** `/pricing` chips it "In build"; its catalog row is active
  at ₱2,999; the page selling it describes it as working. Settle by ordering it as a test couple.
- **Nothing behind a login was observed live.** The five signed-in trees, the marketplace, the
  Overview tiles and admin rest on code at prod's self-reported commit plus merge ancestry.
  **Do not upgrade any of those to "verified on the live site."**
- **`Documents/Claude/Projects/setnayan-platform` was never examined** (rules forbid touching it).
  One reader declared "the checkout is clean" after checking only the *other* protected path.
  **Someone who owns those directories should run `git status` in BOTH before assuming nothing is
  at risk.** The home checkout is 122+ commits behind with another session's uncommitted work.
- **13 of the 14 PR-H plan defects** were not re-checked individually.

## 7 · Already DONE — the documents still say open. Do not rebuild.

All eight product doorways are live rows in the front-door menu · the Papic/Live Studio/Pa3D demos
render and work (**the "unreachable" report was a browser tab that never painted** — a scheduled
frame callback never fired, `vis: hidden`) · the prototypes were repainted 13 August (23 reconciled,
5 retired, 326 colour slots) · the shop correction card is mounted with a reachability guard · the
Partnerships nudge ships · coordinator↔emcee ships both sides with four live policies · coordinator
photo access was ruled 6 August and the per-helper switch is honoured by the read rules · Live Photo
Wall is free, quoted nowhere · `/admin/verification-docs` exists with per-file delete that re-checks
at press time · the five website doorways are now one free Event Hub card with correct redirects ·
the rail highlights correctly on the main rooms · **`design#3` (the app shell) ships and is mounted
on all five signed-in trees** · #4235 merged 8 August, #4413 closed 13 August · both Setnayan AI
prices render on `/pricing` · the marketplace uses customer words ("Catering & cake", "Photo &
video") · **the "planners section renders empty" alarm was raised and disproved — do not
re-investigate** · redesign sessions 1–9 are all merged and live.

## 8 · Order

1. Rebase + land **#4445** (blocks 6 and 8; carries the slug protection; conflict worsens daily)
2. Fix the unlit rail **and the test that baselines it** (same files as #4445)
3. Sweep soft-404s **by `loading.tsx`** + extend `first-byte.test.ts` (third recurrence; Google is
   being invited to index a page that says it does not exist)
4. Make the free QR free (+ its guard) and reconnect the money-gift page
5. The withdraw policy line (a supplier hits a raw error today)
6. The copy pass — double brand, "Papic Pool", "forever", 6 blank descriptions, 61-vs-192, "0 yrs",
   the missing Solo tier, the dash, the two AI prices
7. Sitemap tidy (drop `/waitlist` + `/open-shop`, add `/alaala`) + publish the Windows build
8. The budget refetch + the "Set your budget" wording — **before** the newer math is switched on
9. Retire the old sidebar properly (rehome `.sn-vt-page` in two trees, rewrite 4 guards, delete)
10. Re-plan PR-H, then build the handshake (the one place the product says something untrue)
11. Rescue the CSP rollout (store the reports, fix the allowlist)
12. The small can't-do items (16)
13. Adopt `_components/states`, then the interiors
14. The compliance pack + the `anon` grant sweep

---

*Produced 2026-08-15 by a 15-agent verification fan-out (7 readers · 7 skeptics · 1 synthesis;
2.99M tokens, 946 tool calls). The three headline claims were re-measured by hand before this file
was written.*
