# What is live: the build as of 2026-09-11

Production served version at the time of the pack: **`25c6952`** (https://www.setnayan.com/api/health).

"✅ SERVED" means production's version contains the merge commit **by ancestry**, and for database work the
orchestrator read the live object read-only. "MERGED" means it's on main. The next deploy serves it, so
confirm with the ancestry check before relying on it.

## In plain words: what a person can do today that they couldn't a week ago

- A supplier can publish a service card without offering the Setnayan gift. Every card needs a name, a
  cover photo and at least one "what's included" line.
- A couple finds suppliers on the bench. Cards with no bookings left on their date are hidden. The couple
  inquires without ever being shown an email or phone number, and the chat can't be used to swap numbers.
- A deal struck in chat can't be locked until there's a quoted price. After accepting a quote, the couple is
  told the next step.
- A lock is a handshake. The locked supplier leads its group. After a lock, any price change shows
  "before · change · total now" everywhere, and the booking fee follows every change.
- A supplier can say "this payment never arrived", and a refused deposit keeps its history.
- The Setnayan gift (free Papic photos, sized to the booking) reaches the couple on the quote.
- The admin verification desk. Badge deadlines: six months for the two early shops, and a permit reminder.
- Shop pages are honest: no "0 yrs", songs only for musicians, no outside links, and share previews that
  never break.
- Every film of the day. The couple's payment ledger is in their personal data export.
- Today's fixes from the live test: Enter sends, a visible Tools button on phones, any guest count is
  accepted, and an open tool no longer buries the chat.
- Security closed in this build: cleanup deletes pinned, the chat back door, render keys, a couple can't
  rewrite their own conversation, shop contact details are shut in the database, private deposit
  receipts, a supplier can't open a thread on any event, grants hygiene, and lock-path capacity.

## The register (copied from WHATS_NEXT_Build_SEQUENCE_2026-09-10.md)

| Session | State | Proof |
|---|---|---|
| A1 gift optional | ✅ SERVED | #5373 · a2cc050 in prod |
| A2 lock needs a price | ✅ SERVED | #5408 · f302cd5 ancestor of prod 0d3a1e0 (15:42Z) |
| A3 no door out | ✅ SERVED | #5404 |
| A4 next step after accepting | ✅ SERVED | #5412 · ae08688 ancestor of prod a3996d5 |
| A5 locked shop leads | ✅ SERVED | #5406 |
| B3 deploy headroom + security | ✅ SERVED | #5407, #5397 |
| H1 meeting from Decisions | ✅ SERVED | #5411 · 55e2d4d |
| L1 · P1 · T1-script | ✅ done | corpus; P1 drawing re-checked: stock photo drawn as the owner's open question |
| T1 watcher | ✅ SERVED | #5413 · e4e55e0 ancestor of prod ba93a8f — also fixed two phantom vendor_services columns (b39d82c) |
| N0 cleanup-delete pin | ✅ SERVED | #5414 · ba93a8f in prod; read-only prod: 5 RESTRICTIVE policies live, authenticated UPDATE on papic key columns gone, migration 20271219262486 recorded |
| N1 chat door | ✅ SERVED | #5417 · prod bcd621f; orchestrator prod rehearsal passed; live: guard trigger on, attachment_url INSERT revoked, rules fn not exposed |
| N3 render keys | ✅ SERVED | #5415 · prod bcd621f; live: events site-media CHECK validated, render CHECKs present |
| P2 Free-vs-Solo drawing | ✅ DRAWN — waits on the owner's look | `4facf58` · prototypes/shop_page_free_vs_solo_2026-09-10.html · 2 proposals (plain strip on Free; shop-only Solo preview), stock photo drawn both ways |
| F0 six-door drawing | ✅ CORRECTED — waits on the owner's look | prototypes/shop_page_2026-09-10.html · 91-row "every shipped control → its door" table (`data-shipped`) for G1's guard; moodboard-library and permit-renewal claims corrected |
| H3 drag your own order | ✅ ALREADY LIVE — dropped | `ad2787fda5` (2026-09-09) on main = prod `0d3a1e0`; table `event_bench_arrangement`, long-press, "Your order" |
| LAND · B1 card names | ✅ SERVED | #5387 · a3996d5; trigger `trg_before_enforce_fill_service_card_title` live (orchestrator read prod) |
| LAND · C3 verification desk | ✅ SERVED | #5394 · c902d5f; Approve still WARNS |
| LAND · E3 ID-delete guard | ✅ SERVED | #5420 · reviewed by orchestrator (behaviour-preserving; 100/100; 9 sabotages RED) |
| LAND · D4 every film | ✅ SERVED | #5140 · 8947934; `event_films` live, RLS on, anon no SELECT (orchestrator read prod); #5012 CLOSED |
| HONEST · C2 marketplace photo + names | ✅ SERVED | #5421 · 5df29f4 |
| CLEANUPS · D3 old verify page → papers | ✅ SERVED | #5424 · 171e65e |
| CLEANUPS · E2 contact filter on About/tagline | ✅ SERVED | #5426 · baa88bf |
| CLEANUPS · N2-1 Hosts page coordinator email | ✅ SERVED | #5427 · d1d5a29 (a Setnayan coordinator gets "Message them"; the DB copy is kept — coordinator-broadcasts reads it) |
| B2 both numbers after a lock (+ total now everywhere, fee follows every change) | ✅ SERVED | #5390 · e2a07f6; live: is_change_delta column, 7 functions carry change lines, recorder not exposed, 2 triggers, both migrations recorded (orchestrator read prod) |
| H6 bench search hides full cards | ✅ SERVED (S2) — fcc2bc3; live: definer, service_role only (orchestrator read prod) | #5434 · server-only definer function (service_role), baseline unchanged; per-card daily limit joins via LOCK-PATH CAPACITY |
| H4 payment never arrived | ✅ SERVED (S2) | #5443 · 21ffe0a; orchestrator prod rehearsal + live check (migration recorded, anon cannot refuse) |
| FOLLOW-UP · data export gap | ✅ SERVED (S2) #5459 · b622db1 | Found by S2 (H4): the couple's payment ledger (event_vendor_payments) is event-tier and NOT included in the personal data export (RA 10173 right of access) — predates H4. Check what the export's roster says and add it, or record why not. |
| FOLLOW-UP · a re-sent deposit erases its refusal | ✅ SERVED (S2) #5453 · 324e071 | Found by S2 (H4): `guard_event_vendor_deposit_ack` lets a session clear deposit_declined_* / deposit_dispute_*, and `recordDeposit` (vendors/actions.ts ~4491) does so when a couple re-records — so a refused deposit leaves the admin queue with no trace. Existing, deliberate re-send design; the fix is to keep the earlier refusal as history (audit row) while still allowing the re-send. Installments can't do this (a re-send is a new row). |
| L3 badge deadlines | ✅ MERGED | #5433 · guard fn +2 lines vs live (orchestrator line-hash diff) |
| N4 part 1 conversation record | ✅ SERVED (ce858a1; guard trigger live, INVOKER as designed) | #5435 · orchestrator prod rehearsal passed |
| N4 part 3 generic signer public-only | ✅ SERVED (ce858a1) | #5432 |
| N4 part 4 render credits couple-only | ✅ SERVED (ce858a1; view fn live) | #5431 |
| N4 part 2 (E4) shop contact closed at the DB | ✅ SERVED | #5429 · 368859b; live: anon/authenticated cannot SELECT contact_email/contact_phone (orchestrator read prod) |
| N5-A deposit receipts private | ✅ SERVED | #5437 · 6848bfe |
| N5-B receipt reader pinned | ✅ MERGED | #5438 |
| N5-C supplier can't open a thread on any event | ✅ MERGED | #5439 · prod rehearsal by the session |
| N5-D grants hygiene (TRUNCATE, next_renewal_due_at) | ✅ MERGED | #5440 |
| N5-E LOCK-PATH CAPACITY | ✅ MERGED | #5441 · the per-card daily limit really refuses; bench search mirrors it; tripwire removed |
| LOCK-PATH 2 | ✅ MERGED | #5444 · 9b65f47 |
| H2 card needs cover + what's included (+ host_mc label) | ✅ MERGED | #5442 · 27373ab; prod line-diff: save_vendor_service + fill_blank_service_card_title keep every live line; publish gate keeps the price rule |
| C1 the Setnayan gift reaches the couple | ✅ SERVED | #5436 · 920c231; live: 3 gift columns, sizing trigger, 3 gift functions, migration recorded; booking_fee_charges has no write policy |
| FOLLOW-UP · gift snapshot at lock | ⬜ small | C1's two bounded gaps: a supplier could switch the gift off between the couple's lock and accepting payment; the booking's card sits on a couple-editable row — both close with a lock-time snapshot of the card + gift answer |
| FOLLOW-UP · plan cap counts month-only dates | ✅ SERVED (S2) #5452 · 5fc661c | Found by LP2: `enforce_vendor_whitelist_per_date`'s own count ignores date precision — a month-only couple being chased made a Free shop refuse a real 1-March couple (replay). Latent in prod (1 chased couple, day-precise). Make it day-precision-only like the other counts. |
| OWNER BUG · stuck "Go to my dashboard" | ✅ SERVED | #5446 · 2b680ab (wedding + generic onboarding) |
| OWNER BUG · greyed-out Wedding choice | ✅ SERVED | #5447 · 2394b5d (picker tile + /onboarding/wedding entrance); generic-onboarding entrance = small follow-up |
| OWNER BUG · "New to Setnayan" + letters-only monograms | ✅ SERVED | #5449 · 2556b9b |
| HONEST SHOP · D2 honest shop page | ✅ SERVED | #5423 (orchestrator curl: no '0 yrs', no songs block on a non-music shop, no 'Wedding'-only headings) |
| FOLLOW-UP · generic onboarding entrance check | ✅ SERVED #5455 · 2b800d2 (entrance notice for debut/christening/birthday/graduation/gender-reveal; tiles deliberately NOT greyed — the cap depends on who it's for, asked later) | GREY-OUT deferred it (same files as #5446, now merged): birthdays/debuts etc. should be greyed at the entrance like weddings |
| HONEST SHOP · E1 share card (+ logo fix) | ✅ SERVED | #5450 + #5458; orchestrator: /api/og/v/setnaprod 200 image/png, no redirect, no X-Amz |
| SMALL RULINGS · L4 free-tools dated end | ✅ MERGED | #5454 (one config value; unset = unchanged) |
| SMALL RULINGS · badge spots → hasVerifiedBadge | ✅ MERGED | #5456 |
| SMALL RULINGS · L2 no shop website/social links | ✅ SERVED | #5457 · 7710557; orchestrator curl of /setnaprod: no social/mailto/tel hrefs |
| TEST ROUND 1 · findings (owner live, 2026-09-11 ~08:20Z) | 📝 collecting — fix after the round | (1) bench "more" card shows the "SL" monogram although Saysay's live_band card has a cover (S2 investigating read-only) · (2) Inquire from the Live Band row filed the shop as event_vendors.category='band_dj' and both sides read "Inquiring about Band / DJ" (S2 investigating) · (3) the gift/"Exclusive unlocked" system messages render raw markdown ("**…**") and raw category keys ("live_band", "host_mc"), and still say "Exclusive" (retired wording); the supplier's "What's new" preview shows "🎁 Exclusive: live_band" · (4) the owner's own thread reads "Inquiring about Miscellaneous" → **(1)(2)(3)(4) fixed in DRAFT #5463 (S2), held until the round ends** · (5) chat box: Enter should send, Shift+Enter new line (phones keep Return = new line) → shipping now · (6) phone: the tools hide behind an unlabelled ⓘ → visible "Tools" button, shipping now · (7) quote builder refuses 200 guests (pax input min 1 step 10 ⇒ only 1,11,…,191,201 valid) → fix + a min/step guard, shipping now · (8) an open tool (Build a quote) buries the chat: the composer overlaps the All/Decisions/Files tabs, the page overruns its background, and on a phone the bottom bar covers the box → shipping now · (9) owner expected the Setnayan gift on the quote: correct not to show here (both Saysay cards gift=off; also first 5 bookings are free ⇒ no gift), BUT the supplier's builder never shows the gift line at all (giftQuoteLine "supplier" is unused) → queued after the round · (10) "quote" vs "proposal" are two doors to the same offer → recommended one "Send a quote" button with "from a template / from scratch" (owner to confirm) |
| TEST ROUND 1 · fix 5 Enter sends / Shift+Enter new line | ✅ SERVED | #5465 · prod 25c6952 (phones keep Return = new line; double-send guarded incl. photo compression) |
| TEST ROUND 1 · fix 6 visible "Tools" button on phones | ✅ SERVED | #5466 · prod 25c6952 |
| TEST ROUND 1 · fix 7 quote builder accepts 200 guests | ✅ SERVED | #5464 · prod 25c6952 (+ number-input min/step guard, whole app) |
| TEST ROUND 1 · fix 8 an open tool no longer buries the chat | ✅ SERVED | #5467 · prod 25c6952 (column scrolls, stream keeps a 20rem floor; row keeps its fixed height — min-h rejected, measured) + "20 % %" toggle |
| TEST ROUND 1 · fixes 1–4 (bench card, Band/DJ, perk wording, Miscellaneous) | 🔒 DRAFT #5463 (S2) — release when the round ends | head 8ec20b0+ ; merged with #5464–#5467 cleanly (S2 trial merge) |
| BuildFinale pack | 📦 2026-09-11 | BuildFinale/ + BuildFinale.zip — the full "still missing" register, owner decisions, prompts, test rounds, sources |
| running now | — nothing in flight | ALL non-gated work DONE (2026-09-11 ~08:00Z). Waiting on the owner: TEST ROUND 1 prep · look at the shop-page + Free-vs-Solo drawings (unblocks D1→F1→F2) · look at F0 (unblocks G1→G3). Small follow-ups: gift snapshot at lock; vendor-date-demand precision (product call). |
| H5 Lock after "not free" + unavailable not planned | ✅ SERVED (S2) | #5425 · c913c6e in prod (S2 + orchestrator ancestry) |
| H6 bench search hides a card with no bookings left on the date | 🔨 BUILDING (S2) · DO NOT LAUNCH A SECOND | hides on blocked day + full time slots (the two paths that really refuse); per-card daily limit waits for LOCK-PATH CAPACITY (tripwire test pins it); month = full every day |
| LOCK-PATH CAPACITY | ✅ MERGED as N5-E #5441 | see N5-E row |
