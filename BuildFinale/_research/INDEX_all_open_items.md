# Index of every open item outside the build plan (auto-built from `_research/corpus_sweep.md`)

One line per item: **state** · the item · what a person would get. The full evidence, what it takes to finish and the owner question for each row are in `_research/corpus_sweep.md`, in the workstream of the same name.


## Owner register (NEEDS_THE_OWNER_2026-09-09) — routing, plus stranded work in the `~` checkout

- **NOT STARTED** · "One bill for a shop's add-ons" pricing rule — exists only as a local commit in the stale `~` checkout — A shop's add-ons folded into one bill with an annual multiplier derived from the stored plan prices (foundation only, no callers)

## Desktop encoder (the S-series: couples go live from the Setnayan desktop app instead of OBS)

- **PARTLY BUILT** · Own-channel (the DEFAULT tier) has no ingest address, so the desktop app cannot start a broadcast — A couple streaming to their own YouTube channel pastes their key into the desktop app, presses go live, and the encoder refuses ("no_stream_key"). Only the paid hosted-channel add-on can reach YouTub…
- **PARTLY BUILT** · Hosted channel publishes to the plain-RTMP address, and there is never a backup ingest — The hosted-channel couple's stream goes out on port 1935 (plain RTMP), which venue and hotel firewalls often block, not TLS on 443. If the primary YouTube ingest drops, the app retries the primary on…
- **BUILT-NOT-LIVE** · S12 auto-updater — A couple would get Rust-encoder fixes without reinstalling, and never mid-broadcast (the check runs at launch and again after a broadcast stops).
- **BLOCKED ON OWNER** · S15: the first real publish, so `/download` stops saying "no build" — Anyone could download and install the Mac app from setnayan.com. Today nobody can: both download routes answer 503.
- **BLOCKED ON OWNER** · S16: the real 20-minute YouTube publish, and the measured grace window — Proof that a broadcast from the app actually appears on YouTube over TLS and survives a network drop. Until then, no frame has reached YouTube.
- **BLOCKED ON DEVICE** · S13: the physical end-to-end rehearsal (the acceptance run) — Someone runs a whole wedding the way a couple would, on real machines with phones as cameras, and writes down what happens. This produces the couples' rehearsal script.
- **BLOCKED ON OWNER** · S17: visible-window 60-minute thermal and throughput run — Evidence that a Mac can encode a long wedding with the window on screen without overheating or dropping frames.
- **BLOCKED ON OWNER** · S17: the Windows leg (IPC plus encode on WebView2) — Evidence that the Windows app works at all. Every encode and transport measurement so far is macOS-only.
- **NOT STARTED** · WebContent memory growth 439→910 MB is unattributed — Knowing whether a six-hour wedding will run the laptop out of memory.
- **UNVERIFIED** · Minimised or hidden window degrades the broadcast — If a couple minimises the app, their stream may drop to about 12 fps or be suspended.
- **BLOCKED ON DEVICE** · OS matrix cells beyond the one Mac — The /download floor ("macOS 14 or later, Safari 26 … Windows 10/11") would be tested, not assumed.
- **UNVERIFIED** · S4 average-bitrate figure — Confirmation that the stream runs at the planned 2.5 Mbps.

## Encoder owner and infrastructure checklist (X0) — Apple notarization, Windows code-signing, R2 release secrets, prod flags

- **BLOCKED ON OWNER** · X0 #6: R2 release secrets (5 values in 2 stores) — The desktop app becomes downloadable and auto-updatable. This is the single blocker for S15, S12-live and S13.
- **BLOCKED ON OWNER** · X0 #3: Windows OV code-signing certificate plus cloud signer — Windows couples install without "Windows protected your PC" (SmartScreen) in their wedding week. The Windows auto-update is signed too.
- **BLOCKED ON OWNER** · X0 #4: prod value of `NEXT_PUBLIC_LIVE_STUDIO_POOL_ONLY` (PANOOD_STREAMING is recorded) — Certainty about whether couples can still connect their own YouTube channel, or broadcasts run only on Setnayan's channel

## Live Studio owner decisions outside the encoder

- **BLOCKED ON OWNER** · Pool channel: reuse it, or retire it after one wedding? — A couple on a Setnayan-supplied channel cannot lose their archived film to another couple's copyright strike.

## Story & Story Maker — steps 1–8 ("the editorial, by the minute")

- **PARTLY BUILT** · Step 8 — the whole story driven end to end — Proof that a real host can build, publish and share an arranged story on a phone and a computer, and that a guest sees it right
- **PARTLY BUILT** · Hydration error on the public story (React #418) — A published story sometimes throws its first render away and redraws in the browser (a flash, plus a console error)
- **UNVERIFIED** · Two contrast gaps in "Make it yours" — Coloured words while selected, and the small terracotta buttons on hover, may fall below readable contrast
- **UNVERIFIED** · Long names in the Undo message; fonts arriving mid-drag — A very long moment or set name, or a slow font, might break the "removed · Undo" message or the layout
- **UNVERIFIED** · One unexplained error pair in the Story Maker — Rare page error while tapping quickly on a phone
- **BLOCKED ON OWNER** · Stickers in "Make it yours" — Hosts decorate pages with stickers

## Story — data and build-order leftovers (`03_Data_Requirements` · `08_Build_Order` · `09_SESSIONS`)

- **PARTLY BUILT** · Live-viewer figure ("1,140 watching") — The story says how many people watched the live broadcast; the controller shows a 👁 count
- **PARTLY BUILT** · Every dial bar opens to that minute's photos — Tapping a quiet minute on the clock shows the photos taken then, not only a count
- **PARTLY BUILT** · Supplier reach ("how many people reached you from this story") — A credited supplier sees how many visitors came to them from a story
- **NOT STARTED** · Pre-publish gallery keeps the host's own photos — Before publishing, a stranger still sees the host's own uploaded photos; only the guests' are hidden
- **NOT STARTED** · The "We made" lane on the desk — The host accepts or rejects the story's own generated cards on the desk, like guest and supplier items
- **PARTLY BUILT** · Partly accepting a set of photos — A host can accept part of a photo set and hold back the rest
- **PARTLY BUILT** · Tapping a table in the index's room — In "The whole story" index, tapping a table goes to its moments/photos
- **BLOCKED ON OWNER** · Featured supplier tier on the story (note to the host, Follow, outside links, reach numbers) — Paying suppliers get a richer credit in the story

## Story — owner rulings of 2026-09-11 from step 8 (NEEDS items 12–17), ruled but not built

- **NOT STARTED** · 13 · A Published story on an Unlisted site shares its own card — A shared link previews the couple's story, not a generic "Setnayan" card; still kept out of search
- **NOT STARTED** · 14 · The takedown picker shows each photo — A guest asking for a photo to come down sees thumbnails, not "Photograph 1, 2…"
- **PARTLY BUILT** · 15 · The host is told about a guest's takedown request and can hide the photo — The host sees the request on their dashboard and can act; Setnayan's queue still gets every request
- **NOT STARTED** · 16 · The Story Maker remembers the step — After a reload the host lands on the step they were in (e.g. "The story"), not "The desk"
- **NOT STARTED** · 17 · Snippet mute button on a hand-arranged page, on a phone — A smaller visible sound button in the tile's corner, with the same finger-sized touch area

## Story — items held by the owner (NEEDS_THE_OWNER 1–10, `07` Q5/Q7/Q8, flagged build calls)

- **BLOCKED ON OWNER** · NEEDS 1 · The cover prints "0 voices" — The story's cover would stop stating a zero that reads as "nothing happened"
- **BLOCKED ON OWNER** · NEEDS 5 / `07` Q5 · What "No." counts for a non-wedding — A debut's edition number means something
- **BLOCKED ON OWNER** · NEEDS 10 · Does next year's celebration inherit the guest list — "Start it now" on the back cover brings the guest list along, or not
- **BLOCKED ON OWNER** · NEEDS 2 · Writing to production to test / a seeded demo celebration — A clearly-fake celebration with a busy day, so the clock, search and index can be seen working
- **BLOCKED ON OWNER** · Solemn keepsake print (step 2) — At a wake, the printed keepsake drops festive colour but keeps every word and photo
- **BLOCKED ON OWNER** · Moment naming/reordering in "Make it yours" is free (step 6) — Hosts name and reorder moments without PRO
- **BLOCKED ON OWNER** · Soft-deleting a guest lifts their photo veto — Deleting a guest would republish photos they had asked to keep private
- **BLOCKED ON OWNER** · The floor plan freezes only at publish — While a story is guests-only, its room still redraws if seating changes

## Invite link themes (Capiz · Velvet · Galeriya · Abaca · House) + the Event Hub Pro finishing touches

- **BLOCKED ON OWNER** · S1a · Show Capiz working on setnayan.com — The owner opens a Capiz invite on a phone and sees the whole thing: the reveal, then all three doors in Capiz over the couple's photo with their monogram as the seal
- **BLOCKED ON OWNER** · S1b · Show a couple without Pro still gets House — A couple without Event Hub Pro who saved Capiz somehow still shows guests the plain House door
- **NOT STARTED** · S2 · Velvet (Classy) — Couples with Pro can pick Velvet: an engraved card on velvet in their colour, opening with the four-flap reveal
- **NOT STARTED** · S3 · Galeriya (Sophisticated), print shortened — Couples with Pro can pick Galeriya: their photo hung as an artwork. Per Q4 = B the print is shortened so Continue sits on the first phone screen
- **NOT STARTED** · S4 · Abaca (Rugged) — Couples with Pro can pick Abaca: their photo on kraft, a stamped date, steps as tags on twine, with the four-flap reveal
- **NOT STARTED** · Q1 · Five theme fonts, committed with licences — Velvet, Galeriya and Abaca show in their designed typefaces instead of fallbacks
- **NOT STARTED** · Q2 · The invite button in the couple's colour — On a Pro theme, the one button on the invite doors takes the couple's own button colour. It falls back to Setnayan terracotta when their colour is unreadable. House stays terracotta
- **PARTLY BUILT** · Q3 · Invite theme counted as Event Hub Pro's EIGHTH item — Everywhere Event Hub Pro lists what it includes, the invite theme appears as one of eight (not "seven")
- **NOT STARTED** · Q6 · No second reveal right after arriving — A guest who just watched the reveal on invite door 01 is not shown it again when they land on the Event Hub in that visit. The Save-the-Date film still starts
- **NOT STARTED** · Q7 · Pro themes for weddings only — Only celebrations that carry the Save-the-Date film (weddings) can choose Capiz/Velvet/Galeriya/Abaca. Every other kind of event gets House
- **NOT STARTED** · S5-1 · Links to change the colour and background — The theme picker tells the couple where to change the invite's colour (monogram colour) and background (Save-the-Date studio)
- **NOT STARTED** · Corpus follow-through after S4/S5 — The design folder and memory stop saying three themes are "left"

## Papic — the seven-item build order and the promotion-page rulings

- **BLOCKED ON OWNER** · Hero badge "50 credits left" on the public /papic page (NEEDS_THE_OWNER #9) — A stranger who has bought nothing stops being told they hold a balance
- **NOT STARTED** · Wall replay (owner 2026-08-28: *"can replay"*) — After (or during) the day, the live wall can play back the photos in the order they arrived
- **BUILT-NOT-LIVE** · Home-tile credit estimate uses an invented guess (fix stranded) — The couple's event home says "enough / not enough credits" from the owner's own admin config, not a made-up "6 photos + 1 clip per guest + 150"
- **BLOCKED ON OWNER** · Run-of-show: every moment arms for 30 minutes — A coordinator arming "first dance" (4 min) vs "cocktail hour" (60 min) gets a sensible length, or relies on the next arming to close it
- **BLOCKED ON OWNER** · Ceremony sequence offered at every event type — A birthday/debut host is not shown a wedding's ten ceremony moments
- **BLOCKED ON OWNER** · Host hand-outs count against a guest's per-guest ceiling — A guest the couple both names at 20 and hands 200 credits can use the 200
- **BLOCKED ON OWNER** · Market-cost comparison on /papic uses three unconfirmed numbers — "A photographer would cost ~₱8,000 for ~400 photos" is either confirmed or corrected
- **NOT STARTED** · Guest-facing consent receipt (build order item 6 plan line) — A guest sees one plain page: what was collected, why, for how long, how to undo it
- **NOT STARTED** · Messenger / Viber photo delivery — Guests receive their photos in Messenger instead of email
- **BLOCKED ON OWNER** · Coordinator partner offer — Coordinators get a business offer (presence, client dashboard, margin) like the strongest rival sells

## Papic free credits — the same-day celebration (NEEDS_THE_OWNER #12, ruled 2026-09-11)

- **NOT STARTED** · A host may add guests on the celebration's own day — A host who creates a wedding dated today can still add guests after the list auto-finalizes
- **NOT STARTED** · With no guest list, anyone at it may use the free credits; free pool not sized to zero — A same-day host gets the promised free photos, not one photo then "refills tomorrow"
- **NOT STARTED** · Setup wizard promises "50 credits · Yours already · Free" on every event — The setup screen shows the free amount the account will actually get (1 on a repeat event)

## Supplier Papic — the on-the-day capture lane and portfolio credits

- **NOT STARTED** · Capture screen says the lane is for the supplier's own products, not guests (ruling 2026-08-27) — A supplier opening the camera is told "document your products"; the couple is told the same
- **BLOCKED ON OWNER** · Is the lane open at all, and its retention + consent wording (NEEDS_THE_OWNER #8, RA 10173) — Guests photographed by a supplier are covered by a stated retention period and lawful basis
- **NOT STARTED** · Stale docblocks that still call closed questions OPEN — Future sessions stop re-asking settled questions

## Gifts & Deals — /admin/gifts, cohort deals, couple free windows

- **BLOCKED ON OWNER** · Turn deals and free windows on (`PROMO_FREE_WINDOWS_ENABLED`) — Any deal or free window an admin creates actually frees something
- **PARTLY BUILT** · Couple free window cannot make Live Studio free — An admin can gift a couple Live Studio for an event/date range
- **NOT STARTED** · Couple free window cannot give Papic — "Free Papic for any event in May" actually puts credits in the pot
- **NOT STARTED** · Vendor cohort deals cannot cover add-ons — A deal can make Papic Challenges, the 3D Booth or the AI Chatbot free for verified shops

## Setnayan Exclusive — beyond C1 and the lock snapshot

- **—** · (none open beyond the orchestrator's two) — —

## Production flags

- **BLOCKED ON OWNER** · `[env] NEXT_PUBLIC_BOOKING_FEE_RAIL_LIVE` — The PayMongo card/e-wallet checkout that would block a sourced supplier's proposal until the fee is paid.
- **UNVERIFIED** · `[env] NEXT_PUBLIC_SERVICE_DETAILS_ENABLED` — Tapping a service card on a shop page opens its full details sheet, and "Inquire about this" asks about that card.
- **BLOCKED ON OWNER** · `[env] NEXT_PUBLIC_LIVE_STUDIO_POOL_ONLY` — Couples can no longer connect their own YouTube channel. Broadcasts run only on Setnayan's channel, which keeps the Google "Internal app" verification exemption.
- **BLOCKED ON OWNER** · `[env] VENDOR_FAVORITES_SUBSCRIPTION_GATE` — Couples' Library "Saved vendors" lists hide any supplier without an active paid plan (Solo+).
- **UNVERIFIED** · `[env] PROMO_FREE_WINDOWS_ENABLED` — Admin-scheduled "free this weekend" windows, cohort deals and couple windows unlock paid features for their audience.
- **UNVERIFIED** · `[env] NEXT_PUBLIC_EXPERIENCE_QUIZ_ENABLED` — The type-aware onboarding: a 5-question persona quiz that derives the plan.
- **UNVERIFIED** · `[env] SETNAYAN_AI_PAYWALL_ENABLED` + `[DB] platform_settings.setnayan_ai_paywall_enabled` — Whether couples pay for the assisted planner (Setnayan AI) or get it free through launch.
- **BLOCKED ON OWNER** · `[DB] platform_settings.setnayan_ai_per_event_pricing_enabled` — The ₱499 first-28-days, then ₱799 per 28-day renewal model for Setnayan AI.
- **BLOCKED ON OWNER** · `[env] NEXT_PUBLIC_VENDOR_DAYOF_FREE_UNTIL` — Suppliers see "Free until <date>" on the day-of tools, and the console stops opening after that date.
- **BUILT-NOT-LIVE** · `[env] NEXT_PUBLIC_LIFE_STORY` — Life Story Phase 1: a person's own events, as a story.
- **BLOCKED ON OWNER** · `[env] NEXT_PUBLIC_HUB_NAMED_GUEST_PREVIEW_ENABLED` — The Event Hub "View as" switcher gets a 6th chip, "As ⟨a real named guest⟩".
- **UNVERIFIED** · `[env] NEXT_PUBLIC_DEPENDENT_PEOPLE` + `[DB] dependent_minor_profiles` — The People area for dependants: children, pets, milestones, faith rites, godparents.
- **BLOCKED ON OWNER** · `[env] NEXT_PUBLIC_PEOPLE_CONNECTIONS` — The suggest→confirm family/relationship connections flow and trusted-circle vendor recommendations.
- **BLOCKED ON OWNER** · `[env] NEXT_PUBLIC_DEVICE_FINGERPRINT_ENABLED` + `[DB] device_fingerprint` — A coarse per-browser device id is recorded to catch sock-puppet farms.
- **BUILT-NOT-LIVE** · `[env] GUEST_COLUMNS_ENABLED` — Guests write a short "letter to the editor" for the couple's paper; the couple approves before it publishes.
- **BUILT-NOT-LIVE** · `[env] GUEST_SESSION_TOKEN_CHECK` — A guest session made from a leaked QR dies once the QR is rotated.
- **BUILT-NOT-LIVE** · `[env] GUEST_QR_SELF_ROTATE` — A guest can re-issue their own personal QR.
- **BUILT-NOT-LIVE** · `[env] NEXT_PUBLIC_GUEST_NOW_TRIGGER` — Guests' "What's happening now" follows the host-set live block instead of the clock.
- **BUILT-NOT-LIVE** · `[env] NEXT_PUBLIC_U_NESTING_CUTOVER` — Public event URLs move to `setnayan.com/u/{owner}/{slug}`, and renamed-address redirects start working.
- **BUILT-NOT-LIVE** · `[env] PABUYA_PUBLIC_ROUTE_ENABLED` — The public guest e-gift page (`/[slug]/pabuya`) with the couple's GCash/bank QR codes.
- **BUILT-NOT-LIVE** · `[env] PAPIC_CLIP_DROP_ENABLED` — Guest video clips get deleted after retention (photos already are).
- **BUILT-NOT-LIVE** · `[env] NEXT_PUBLIC_COORDINATOR_VENDOR_NOTES_ENABLED` — Coordinators keep per-supplier working notes, private or shared.
- **BUILT-NOT-LIVE** · `[DB] coordinator_requests_inbox` — The day-of requests inbox, plus one-tap supplier status updates ("On site", "Running late").
- **BUILT-NOT-LIVE** · `[env] NEXT_PUBLIC_REUSABLE_BOOKINGS_ENABLED` — A couple re-uses a locked booking with the same supplier for a new event; the supplier re-prices it.
- **BUILT-NOT-LIVE** · `[env] NEXT_PUBLIC_PACKAGE_CREDIT` — Packages with required and choice lines, per-option price deltas, and a spend-anywhere credit pool.
- **BUILT-NOT-LIVE** · `[env] NEXT_PUBLIC_VENDOR_ADDON_FIRST5_FREE` — 3D Plan Ads and Papic Challenge are free for a shop until its 6th booking.
- **BUILT-NOT-LIVE** · `[env] NEXT_PUBLIC_VENDOR_AI_LADDER` — Vendor AI gets two rungs (Basic / Advanced).
- **BUILT-NOT-LIVE** · `[env] NEXT_PUBLIC_VENDOR_AI_VOICE_MATCH` — The Advanced rung replies in the supplier's own voice.
- **BUILT-NOT-LIVE** · `[env] NEXT_PUBLIC_VENDOR_FREE_TRANSPORT_ENFORCED` — A quote for a venue inside the supplier's own declared inner ring gets its transport line forced to ₱0.
- **BUILT-NOT-LIVE** · `[env] NEXT_PUBLIC_PLAUSIBILITY_SCANNER_ENABLED` — Admin-only triage of locked bookings whose declared price looks implausibly low.
- **BLOCKED ON OWNER** · `[env] NEXT_PUBLIC_VERIFIED_MEDIAN_ENABLED` — A supplier's "typical price" (median of couple-confirmed locked bookings) on their dashboard and public page.
- **BLOCKED ON OWNER** · `[env] VENDOR_TIER_FEATURE_GATE` — Premium supplier features (Demand Radar, Theft Watch, funnel trends) and the 1:1 call become paid-tier only.
- **BLOCKED ON OWNER** · `[env] NEXT_PUBLIC_VENDOR_SEO_TIER_GATE` — Search-engine enrichment (SEO/GEO/AEO) is laddered by paid tier.
- **BLOCKED ON OWNER** · `[DB] platform_settings.vendor_tier_pipeline_caps_enabled` — Per-tier caps on how many live candidates a shop can hold per date.
- **BLOCKED ON OWNER** · `[env] NEXT_PUBLIC_ACCOUNT_FACE_PROFILE_ENABLED` — One opt-in face profile on the account, reused to tag the person across any event.
- **BLOCKED ON OWNER** · `[env] NEXT_PUBLIC_BAZI_BIRTHDATA_ENABLED` — Opt-in capture of each partner's birth date and time, for a Chinese date specialist.
- **BLOCKED ON OWNER** · `[env] FEATURE_ACCOUNT_AUTOSURFACE` — An event auto-attaches to a guest's existing Setnayan account ("only NO removes it").
- **BLOCKED ON OWNER** · `[env] CSAM_HASH_MATCH_ENABLED` — Uploads are checked against known child-abuse image hashes.
- **BLOCKED ON OWNER** · `[const] FACEBOOK_PROVIDER_CONFIGURED = false` — A "Continue with Facebook" button on login and signup.
- **BUILT-NOT-LIVE** · `[env] NEXT_PUBLIC_OFFLINE_DAEMON_ENABLED` — Actions taken with no signal replay in the background (Background Sync).
- **BUILT-NOT-LIVE** · `[env] NEXT_PUBLIC_PANOOD_CAM_ANON_ENABLED` — A livestream camera helper can join a camera seat without signing in (the Panood twin of the Papic flag, which is ON).
- **BUILT-NOT-LIVE** · `[env] NEXT_PUBLIC_BOOTH_STUDIO_ENABLED` — Suppliers compose a structured, palette-matched booth poster for a couple's 3D venue.
- **BUILT-NOT-LIVE** · `[env] NEXT_PUBLIC_PLAN3D_BOOTH_SHOWCASE` — A public "Walk into my booth" 3D page on each shop (`/v/[slug]/booth`).
- **UNVERIFIED** · `[env] NEXT_PUBLIC_PLAN3D_BOOTH_ADS` — Dashed "ghost booths" for unbooked categories in the couple's own 3D lab, linking to the marketplace.
- **PARTLY BUILT** · `[const] GUEST_HERO_VIDEO_PLAYBACK = false` — The couple's looping hero video plays on public guest pages (the still shows instead today).

## Launch checklist and the 08-17 owner rulings

- **NOT STARTED** · `/features` redesigned as editorial (WIL-08-17 §6.8 :200; ruled DECISION_LOG 2026-09-07 ④) — The features page gets the same editorial look as /papic and /why-setnayan
- **PARTLY BUILT** · Day-of specialist desks free during launch (WIL §6.5 :197; ruled 2026-09-07 ②) — Every booked supplier gets the song desk, script & cues and run-the-floor, whatever their plan
- **BLOCKED ON OWNER** · Guest-phone photo privacy gates 0d/0e (WIL §6.9 :203; ruled "proceed" 2026-09-07 ⑤) — The privacy filing names guest-phone capture, and the RSVP consent wording is confirmed
- **BLOCKED ON OWNER** · Legacy-memories counsel brief re-sent (WIL §6.11 :205; ruled 2026-09-08 ②) — A dated written legal reply on file before Phase 3 legacy work
- **UNVERIFIED** · `R2_PUBLIC_URL` in production (LAUNCH_CHECKLIST:39) — Shop logos and background videos load on the homepage
- **NOT STARTED** · `.dmg` notarization ticket stapled (LAUNCH_CHECKLIST:42) — A Mac install works offline, first time
- **BLOCKED ON OWNER** · Deploy-drift grace window (LAUNCH_CHECKLIST:71) — Drift alerts fire at the right time
- **UNVERIFIED** · 3D workstream "done" bar (LAUNCH_CHECKLIST:82) — Knowing when 3D is finished

## Marketplace / Explore

- **NOT STARTED** · Show empty categories instead of hiding them (DECIDED_NOT_YET_BUILT:10-46) — A couple sees every category. An empty one says "We do not have vendors for this at the moment" instead of vanishing
- **NOT STARTED** · "Report this shop" (DECIDED_NOT_YET_BUILT:54-81) — A signed-in person can report a shop. It lands in the fraud queue for a human to judge, and nobody is told the outcome
- **BLOCKED ON OWNER** · PR-G2 "Beyond reach" (Explore_Replan:131; Build_SEQUENCE:138 "can wait … Not a session yet") — Once the venue is locked, suppliers too far from it are dimmed and sink below a divider, but are never removed
- **NOT STARTED** · PR-J "found-you" on manual adds (Explore_Replan §10, §12.3, §12.7) — A couple who found a supplier on Setnayan, then adds them by hand, is nudged to link the real shop instead of getting the free own-client import
- **NOT STARTED** · Ranking Rule B: one "fresh-chance" slot (Explore_Replan §15.5) — A new supplier who fits gets one rotating slot per rail
- **NOT STARTED** · Ranking L5 per-category weights and L6 admin weight screen (Explore_Replan §15.7-15.8) — Distance counts more for caterers than for gowns, and the owner can tune the weights
- **NOT STARTED** · Budget: paperwork as estimated lines, BUD-6 (Explore_Replan §18.6) — Licence, CENOMAR and parish fees show as estimates in the budget
- **BLOCKED ON OWNER** · Budget: payment-due reminders for every couple, BUD-9 (Explore_Replan §18.6) — A reminder before each supplier payment is due, without AI
- **NOT STARTED** · Budget export, BUD-10 (Explore_Replan §18.6) — A couple downloads or prints the whole budget
- **PARTLY BUILT** · Supplies shop real checkout (BUILDS_REMAINING_08-08:18; ruled "wire a real checkout" 08-10, row ~3099) — A couple can actually buy favours and supplies
- **NOT STARTED** · Per-product listings, e.g. a coffee cart with oat milk (BUILDS_REMAINING_08-08:112) — Search for one product inside a supplier's offer
- **NOT STARTED** · Market Scan for suppliers (BUILDS_REMAINING_08-08:114) — A supplier researches the whole market
- **PARTLY BUILT** · Track record on marketplace cards (BUILDS_REMAINING_08-08:91) — Couples see a supplier's track record while browsing
- **NOT STARTED** · Payments empty-state sentence (MARKETPLACE_FOUR_TABS:232-236) — A couple who set a budget isn't told to "set your budget"
- **NOT STARTED** · Old budget accordion fallback (MARKETPLACE_FOUR_TABS:290-292) — Less code that can drift
- **NOT STARTED** · Stale nav-slot comment (MARKETPLACE_FOUR_TABS:339) — Nothing visible; stops misleading sessions

## Service cards, shop and supplier tools

- **NOT STARTED** · Guest "request a song" button (Three_Dead_Answers:284-361; INDEX:1120 PR 7; BUILDS_REMAINING:149) — A guest asks the band for a song from the event hub, and it lands in the band's inbox
- **PARTLY BUILT** · Answers Desk still withholds answers that now work (Three_Dead_Answers:363-376) — The supplier's desk shows waitlist and crew-shift answers
- **NOT STARTED** · Waitlist "notify everyone" skips the open-date check (Three_Dead_Answers:388-393) — Waitlist emails only go out for a genuinely free, future date
- **PARTLY BUILT** · "No event today" gives no reason (Vendor_Hub:117-124) — A supplier whose booking was released, or whose deposit is unrecorded, is told why
- **NOT STARTED** · Agents on a phone can't reach My Customers (Vendor_Hub:91-95) — A shop's agent on a phone can open My Customers
- **NOT STARTED** · Today page's "Upcoming" misses agreed and locked-QR bookings (Suppliers_Room_SESSIONS:468-469) — A supplier's upcoming list includes agreed-but-unpaid bookings
- **UNVERIFIED** · Deposit acknowledge may not reserve the date (Suppliers_Room_SESSIONS:348-355) — When a supplier accepts the deposit, their calendar holds that date
- **BLOCKED ON OWNER** · A shop can't set how many couples may hold one date (WIL-08-17:151; BUILDS_REMAINING:105) — A busy shop raises or lowers its 3-per-date hold limit
- **NOT STARTED** · Copy one of my service cards (BUILDS_REMAINING:87) — A supplier duplicates a card instead of retyping it
- **NOT STARTED** · Bookkeeper / secretary team roles (BUILDS_REMAINING:93) — A shop's bookkeeper or secretary gets a proper role and assignment alerts
- **BLOCKED ON OWNER** · Waitlist as a pipeline lane (Shop_Redesign_SESSIONS:372) — A shop sees its waitlisted couples as their own lane
- **NOT STARTED** · Lock-request expiry reminder depends on traffic (Shop_Redesign_SESSIONS:~352) — A shop is reliably warned 24 hours before a lock request expires
- **UNVERIFIED** · Walk a published card to the public shop page (Service_Card_SESSIONS:22, S5) — A new card looks right where couples meet it
- **UNVERIFIED** · Trade-word list mined and approved (Category_Suggester_SESSIONS, "ONE OPEN ACTION") — A supplier typing "360 booth" lands on Photo booth
- **NOT STARTED** · Shot list syncs across devices (WIL-08-17:117) — A photographer's must-get list follows them to another phone, and the couple can see it
- **NOT STARTED** · Coordinator's requests inbox inside the live console (INDEX:1032; THE_PLAN item 53) — The coordinator sorts day-of requests without leaving the live console
- **NOT STARTED** · Emcee questionnaire (INDEX:1032; ruled model 07-27, row ~2775) — The emcee writes questions and the couple answers (sponsor names and so on) without the emcee seeing the guest list
- **NOT STARTED** · Emergency message "seen" receipts (INDEX:1032) — The sender knows people saw the emergency notice
- **NOT STARTED** · "No fee paid, no connection" gate (Vendor_Hub:404-413; EVENT_HUB_UNISON:309; ruled 08-28 row 3591 ③) — Once billing is live, a supplier with a charged, unpaid booking fee loses the desk

## Event Hub

- **PARTLY BUILT** · Rooms per kind of event, after slice 1 (UNISON:218,313; SESSION_PROMPTS_HUB1_4:158-171) — A corporate day or tournament has no gifts page. A date or trip gets no Live hub, watch-live or print sheet. A tournament doesn't seat spectators
- **NOT STARTED** · Supplier's desk works on weak signal (UNISON:280; Vendor_Room_Design_2026-08-26.md:183-185) — A supplier in a basement reception still sees the running order, venue and headcount
- **NOT STARTED** · Live Studio control-room port (SERVICE_CONTROL_CENTERS:64,75) — The couple's Live Studio page opens on the broadcast monitor with cameras underneath, and the channel control moves to a "set once" row
- **NOT STARTED** · The other ~14 service pages on the stage pattern (SERVICE_CONTROL_CENTERS:76,86) — Every started service opens on its own content, not a form
- **PARTLY BUILT** · Failed vs empty on guest pages (EVENT_HUB_BUILDS:69; SESSION_PROMPTS_2026-08-17:329-366) — A guest whose invitation fails to load is told it failed
- **BLOCKED ON OWNER** · Couple pins the website to one phase (WIL-08-12:84-86; WIL-08-05:168) — A couple chooses "show the RSVP version" instead of the clock deciding (for evening receptions)
- **NOT STARTED** · Preview the site as an invited guest, step 4b (EVENT_WEBSITE_BUILD_PLAN:61,166-169) — A couple sees the invitation exactly as guests open it
- **NOT STARTED** · Countdown ends 8 hours early (EVENT_WEBSITE_BUILD_PLAN:404-406) — The countdown doesn't vanish on the wedding morning
- **NOT STARTED** · Couple's own song silent at the seat pass (EVENT_WEBSITE_BUILD_PLAN:416) — Their song plays when a guest reaches their seat
- **NOT STARTED** · A "Private" site shows a success-green chip (EVENT_WEBSITE_BUILD_PLAN:392) — A private site no longer looks healthy and done
- **NOT STARTED** · Guest login cookie never extended (EVENT_WEBSITE_BUILD_PLAN:424) — A returning guest stays signed in
- **UNVERIFIED** · Other low guest-site findings (EVENT_WEBSITE_BUILD_PLAN:304-320,324,396,436) — Small fixes: address row, greeting, force-live on phones, photos button, offline promise, home tab, 44px taps
- **UNVERIFIED** · A booked marketplace supplier getting into a private event, proven live (WIL-08-17:89-92) — A real booked supplier sees "You are booked here" and gets in

## Samahan

- **BLOCKED ON OWNER** · Hourly "post your story" nudge (Samahan:77-79) — A reminder to post today's 3-second clip
- **NOT STARTED** · "Somebody joined" notice (Samahan:79-80) — Members hear when someone new joins
- **PARTLY BUILT** · The day stitched into one film (Samahan:96-98) — The day's clips saved as one continuous film
- **BLOCKED ON OWNER** · A place where a samahan keeps things (Samahan:100-102) — A permanent shelf for a group's moments
- **NOT STARTED** · Photos in the group chat (Samahan:122) — Send photos in Usapan
- **NOT STARTED** · Sub-groups (Samahan:123) — A samahan inside a samahan
- **BLOCKED ON OWNER** · Findable samahans (Samahan:124) — Join a samahan without an invite link
- **NOT STARTED** · Memories tab (Samahan:125) — A tab of past group moments
- **NOT STARTED** · Hard delete (Samahan:126) — A samahan can truly be removed

## Pricing

- **NOT STARTED** · Admin subscriptions page says "activated" for a scheduled downgrade (Pricing_Session_Prompts:432) — An admin sees "scheduled", not "activated", for a downgrade still to come
- **BLOCKED ON OWNER** · Wake pricing (Pricing_Session_Prompts:446-447) — A family planning a wake gets a deliberately chosen price, or no planner offer at all
- **BLOCKED ON OWNER** · 13 "Specialized Pro Tools" still at the ₱888/wk placeholder (Pricing.md:414-430) — Suppliers could buy per-trade tools

## Security, schema and compliance

- **PARTLY BUILT** · Anonymous read grants on tables nothing uses (WIL-08-17:177; S9_EVENING:18-66) — Nothing visible; one wrong rule stops being a leak
- **PARTLY BUILT** · Browser protection (CSP) enforced (WIL-08-17:178; THE_PLAN item 106) — Injected scripts are blocked, not just reported
- **NOT STARTED** · Two prod-only tables have no `CREATE TABLE` (WIL-08-17:375-382) — The repo's schema matches prod
- **PARTLY BUILT** · Default-value drift is invisible to the guard (SCHEMA_DRIFT_AUDIT:134, §6.3) — Tests stop accepting inserts prod would refuse
- **NOT STARTED** · Abuse-flag insert error never read (SCHEMA_DRIFT_AUDIT:140) — A refused abuse flag gets logged instead of vanishing
- **NOT STARTED** · `manpower_gigs.handshake_tokens_consumed` defaults to 2 (SCHEMA_DRIFT_AUDIT:117) — Nothing visible
- **UNVERIFIED** · Full prod-vs-repo schema drift audit (Three_Dead_Answers:399-403) — Tests run against the schema prod really has
- **PARTLY BUILT** · "Download my data" covers everything (BUILDS_REMAINING:264) — A person's export includes all their records
- **NOT STARTED** · Two-person approval for dangerous admin actions (BUILDS_REMAINING:169; THE_PLAN:106) — A big refund, a large free grant or a change to the receiving bank account needs a second admin
- **BLOCKED ON OWNER** · Admin job scopes and spending caps (BUILDS_REMAINING:168) — Admin logins get scoped powers and money caps
- **NOT STARTED** · Bank-alert auto-matcher (BUILDS_REMAINING:172) — Payments match bank alerts automatically
- **BLOCKED ON OWNER** · Guardian / after-death account management (BUILDS_REMAINING:265) — A guardian or legacy contact can act for someone
- **BLOCKED ON OWNER** · Taste profile across events (BUILDS_REMAINING:55) — Opt-in memory of style and liked suppliers

## Other August registers (web, navigation, roadmap tail, owner ops)

- **PARTLY BUILT** · Public pages still outside the new shell (WIL-08-15:73-76) — Blog, features, creators, monogram, tour, download, our-story and waitlist wear the same chrome as the rest
- **NOT STARTED** · Sitemap tidy (WIL-08-15:85-87) — Google isn't sent to dead ends, and `/alaala` is indexed
- **PARTLY BUILT** · Soft-404s via `loading.tsx` (WIL-08-15:63-65) — Missing pages answer 404 instead of 200
- **NOT STARTED** · Daily SEO check still demands a Google token (INDEX:788) — The admin SEO audit stops warning about a verification already done by DNS
- **NOT STARTED** · App translation (BUILDS_REMAINING:195) — Tagalog/Cebuano UI beyond three marketing twins
- **NOT STARTED** · Two people split one payment (BUILDS_REMAINING:53) — A couple and a parent each pay part of one supplier payment
- **NOT STARTED** · Family availability before picking a date (BUILDS_REMAINING:54) — Key people's availability is gathered alongside suppliers'
- **PARTLY BUILT** · Couple's four daily screens: structural port (WIL-08-12:134-136) — Guest list, supplier comparison, budget and gallery get the new structure, not just colours
- **PARTLY BUILT** · Supplier daily screens: structural port (WIL-08-12:146-148) — The rest of the shop screens get the new structure
- **BLOCKED ON DEVICE** · Delete the old livestream code (INDEX:1056; THE_PLAN item 121) — One livestream path
- **BLOCKED ON OWNER** · Bing verification and Search Console data (INDEX:768-769, 979-980) — Search traffic is visible to the admin
- **BLOCKED ON OWNER** · Clear the retired hero-video folders (INDEX:780,922) — Frees the biggest chunk of storage
- **BLOCKED ON OWNER** · Business-side outside clocks (THE_PLAN:54-58,105; HANDOFF_08-20:163-171) — Legal and business readiness
- **BLOCKED ON DEVICE** · One real test purchase plus an hour on a phone (HANDOFF_08-20:171; EXEC_PLAN:260) — Proof the buying journey works end to end
- **UNVERIFIED** · Ops floor: uptime monitor, a test prod error reaching an inbox, bucket upload permissions (THE_PLAN:73-76) — Outages and errors reach someone
- **UNVERIFIED** · Images re-processed on every view (THE_PLAN item 108) — Lower image bill as galleries grow
- **UNVERIFIED** · A couple can post a message that looks like a supplier's (THE_PLAN:147, via BUILDS_CROSSCHECKED:147) — Messages can't be faked
- **UNVERIFIED** · Coordinator access: two paths → "host approves" (BUILDS_REMAINING:121; ruled 08-10 row ~3099 ⑤) — A coordinator gets access one way only
- **UNVERIFIED** · A wedding date that outlives a dropped supplier (BUILDS_REMAINING:30) — The date set by a lock is revisited when that supplier leaves
- **UNVERIFIED** · THE_PLAN items listed only by number (THE_PLAN:165-193: 25-33, 41-52, 55-77, 85-98, 107-119) — Post-launch backlog

## Supplier verification — what is left after the desk

- **NOT STARTED** · The paper reader + registry lookup behind "matched by Setnayan" — A shop uploads its DTI/SEC, BIR 2303 and permit; Setnayan reads them, checks the government registry and compares them to the profile; clean papers pass by themselves, only mismatches reach a person
- **PARTLY BUILT** · Bank account name matches the registered business — The admin sees whether the bank proof's account name is the business name or owner's name
- **BLOCKED ON OWNER** · Approve switches from WARN to REFUSE before the first outside shop — Once real outside suppliers apply, Approve can't grant the badge with checks missing (a vouch is the only way round)
- **NOT STARTED** · An already-verified shop with a profile gap submitting papers — The two early shops (badge until 12 Mar 2027) can send their papers even if one profile field is blank
- **NOT STARTED** · "On the marketplace since <date>" — A shop page says how long the shop has been on Setnayan
- **PARTLY BUILT** · Full permit-renewal clock — A shop is reminded to renew, uploads this year's permit, and its badge date moves forward

## Booking fee & money (outside the orchestrator's bundles)

- **NOT STARTED** · "Starts at" becomes the floor for earning the gift (BENCH-C5) — A quote below the card's "from ₱X" still sends, but doesn't earn the Setnayan gift
- **BLOCKED ON OWNER** · Service Card Boosting (Featured slots) — A shop pays a flat price for days on screen for ONE card in ONE coverage, once ≥20 cards compete

## Chat & bench — leftovers after S1–S12 and the H stream

- **NOT STARTED** · Suggest-then-send AI reply for suppliers (replaces the auto-poster) — A supplier sees a drafted reply above the box and chooses to send it; nothing posts in their name by itself
- **NOT STARTED** · Richer standing-sentence clauses on the bench — Under each supplier: "tasting confirmed · you paid ₱50,000 · 170 guests vs 150 quoted"
- **NOT STARTED** · The database refuses a forged "offered service" — A couple can't post a message pretending a rival supplier offered them a service
- **BLOCKED ON OWNER** · Put "changes" back into chat (or keep Deal as the one money card) — —
- **BLOCKED ON OWNER** · Couple's conversation column: "they owe you a reply" + the search box — Couple sees which suppliers are waiting on them; search box kept or removed
- **BLOCKED ON OWNER** · Couple-facing "N couples inquired for your date" — — (already shows on the bench, floored at 3)
- **NOT STARTED** · Supplier rail clipped labels — The supplier's six-item rail stops truncating "Performan…" and "Hub"

## Mood board (MB plans) & reception art

- **NOT STARTED** · Reception art — the welcome-signage zone — The welcome sign in the couple's reception preview is a real drawing tinted to their palette, not a flat shape
- **PARTLY BUILT** · Reception art — two uncovered cells — Tropical-heritage stage and modern-minimalist program also get drawings
- **NOT STARTED** · The 500 sunset for gallery back-catalogue — When a category has 500 approved event-linked photos, old back-catalogue intake closes (nothing deleted)
- **BLOCKED ON OWNER** · Community theme gallery (couple-to-couple) — —

## Store shell, desktop & app-store distribution

- **BLOCKED ON DEVICE** · Windows `.msi` actually run — —
- **BLOCKED ON DEVICE** · iPhone App Store resubmission — Setnayan on the App Store
- **BLOCKED ON OWNER** · Android on Google Play — Setnayan on Play Store
- **NOT STARTED** · Apple in-app purchase (durable answer to guideline 3.1.3(b)) — Buying inside the iPhone app

## Security, ops & repo hygiene

- **NOT STARTED** · Google keys stored encrypted — A couple's/the Setnayan YouTube + Drive + Photo Delivery keys are not readable text in backups
- **NOT STARTED** · Livestream channel health tells the truth — Admin sees "needs reconnect" when a channel's key never refreshed, not "connected"
- **NOT STARTED** · Close unused signed-out write grants on `vendor_services` — — (hygiene; inert today)
- **NOT STARTED** · Dependabot alerts triaged — —
- **NOT STARTED** · Sentry SDK upgrade — —
- **UNVERIFIED** · Seat-plan follow-ups (rigid-group linking rebuild, many-walker collision, fit-framing, RSVP→seat auto-rules, R6 radius sweep) — Smoother seat-plan editing
- **BLOCKED ON OWNER** · Deploy-drift alerts reach someone — A production outage is noticed without opening GitHub
- **BLOCKED ON OWNER** · Required checks on `main` — —
- **UNVERIFIED** · Two events flagged primary — —
- **NOT STARTED** · Category label stored humanised — Category names can be fixed later without rewriting rows
- **NOT STARTED** · `brand.config.ts` claim — — (doc)
- **PARTLY BUILT** · PROVE-THE-FLOW refresh — Engineering resume doc matches today's test (testnayan4 couple, B1/B2 live)
- **UNVERIFIED** · COWORK_INBOX historical backlog — —

## Marketplace hygiene & the owner's own shop data

- **BLOCKED ON OWNER** · Hide the FIXTURE shop from Google — Search engines don't index a test shop
- **BLOCKED ON OWNER** · Remove retired Pabati from SetnaProd's services — The owner's shop stops listing a retired product
- **UNVERIFIED** · "Schedule with the service card" — A booking picks a time on the card itself

## Event Hub controller (non-invite parts)

- **NOT STARTED** · S6 — the money card on the Event Hub — The couple sees what their event owns as a filling meter
- **BLOCKED ON OWNER** · Seat plan opens only once the guest list is final — —

## Legal & compliance documents (no code)

- **BLOCKED ON OWNER** · dpo@setnayan.com reaches a person — A data-protection email is actually read
