# First-Timer Test — 2026-10-02

Measured on `origin/main` 60b949035 at 390 px, in a detached worktree (`wt-firsttimer`). Every quoted word is from a shipped `page.tsx` or its components — not from prototypes or handoffs. Phone page: `FIRST_TIMER_TEST_2026-10-02.html`.

Owner's question, verbatim: *"is this the simplest most functional plan for our app. Is it already designed for a simpleton. How does the leading apps plan their functions to be so easy that even without tour, people understand how to work around the app"*. One real user closed their account: *"i dont understand the website on how to use it"*.

## Verdict

**Not yet.** The plan is simple; the shipped screens are not. 9 tasks walked: 1 Easy · 5 OK · 3 Hard. Taps are fine (4 taps to a sent chat, 1 tap to confirm a payment). **The cost is words, not taps** — lock, bench, proposal, Your info, stages, scenes, Prints, Apply, deposit/downpayment, Payday, Papic — plus one flow (booking) that hops across four surfaces with no screen that says what booking is.

Leading apps need no tour because every screen has one main action, uses the word you would say to a friend, and shows your own result inside the first minute.

Correction to the brief: the phone bar is **Home · Guests · Suppliers · Hub · More** (owner 2026-10-01), not "Your Team" — d16 is already done in the bar; "Your Team"/"vendors" survive in tours, tiles and copy.

## Scores

| Task | Taps | Score | Main reason |
|---|---|---|---|
| H1 Sign up, create a wedding | ~28 | OK | 13 one-question cards (good). First thing that is theirs is a Home of numbers, not their invitation. QR-mode card asks before it matters. |
| H2 Make the invitation | 12–20 | **Hard** | 7 named bar items + Scenes + View + ⋯ before the first edit; 8-slide tour that sells Pro; "Your info" = "Event Details". |
| H3 Add 3 guests, send | ~16 | OK | Adding is instant. Sending is one share sheet per guest; Home never says "Send 3 invitations"; "Who can reply?" blocks the first visit. |
| H4 Find a photographer, chat | 4–6 | OK | 4 taps, first message auto-sent. "bench", no supplier page before asking, tour describes a hidden screen. |
| H5 Book and pay | ~12 | **Hard** | Accept → ask to lock → wait ≤48 h → pay off-app → record → wait. Four surfaces, two waits, "lock" never said as "book". |
| S1 Sign up, set up shop | ~20 | OK | Tight 4-step wizard; lands on My Shop (15 rows, no next step) instead of Today's First steps; first service needs a second builder. |
| S2 Answer a request | 2–4 | OK | Must "Accept inquiry" before typing; Accept from the Today card bounces back to Today. |
| S3 Send a quote | 3 + lines | **Hard** | One long form with every pricing idea at once; "quote" here, "proposal" in three other places. |
| S4 See they got paid | 1 | Easy | One green "Yes, it arrived". Then deposit · downpayment · payment · installment across Earnings and Payday. |

Flags not readable from code (both branches noted where they differ): `NEXT_PUBLIC_ONBOARDING_SERVICES_STEP`, `NEXT_PUBLIC_ANON_ONBOARDING_ENABLED`, lock handshake, replan, payment-gated lock, admin nav-slot overrides.

## Host walk-throughs

### H1 · Sign up and create a wedding — OK
1. setnayan.com → **Start your celebration — free** → `/onboarding/wedding` (`front-door-anchor.tsx`).
2. Who's getting married? → What kind of wedding? (Church · Civil · Nikah · Garden · Not sure) → Date → Where will it be?
3. **How do guests get in?** (Personal QR · One QR · Both) — a setting asked before anything exists.
4. About how many guests? → About how much is your budget?
5. **"Your plan is ready."** — account gate: Google / Apple / email.
6. Photo card ("For invites and the top of your Event Hub") → **Pick a look** (theme tiles, not their card) → Your colours → services step (flag): "Continue — Papic is on".
7. "You did the hard part / Set na 'yan." → **Your Wedding**.
8. Home: cover with names + date · **Event Details** pill · Next "Finish your Event Hub — 0 of 6" [Start · Later] · **Edit your Event Hub** · 3 numbers · Paid / Still owing · Your services (Papic · Setnayan AI).

~28 taps · 14 screens · own result at ~3 min (their names on Home). Jargon: Event Hub ×3, Papic, Setnayan AI, QR modes. Two names: Event Details (Home, `/details`) = Your info (`MAKER_DETAILS_LABEL`) = Details (menu); names editable in `details-form.tsx`, Maker Your info (`label="Names"`), editor part inspector. Dead end: two Home buttons to the same place, neither says "see your invitation"; the invitation is never shown during sign-up.
Files: `lib/onboarding/wedding-cards.ts` (WEDDING_FLOW_ORDER) · `onboarding-shell.tsx` · `home-first-screen.tsx` · `lib/home-first-screen.ts`.

### H2 · Make the invitation — Hard
1. Home → **Edit your Event Hub** (or bar **Hub**) → `/launch`, aria "Event Hub Maker".
2. First open: 8-slide tour incl. "What Event Hub Pro adds" and "Try it now, keep it with Event Hub Pro".
3. Toolbar: Exit · ▶ · + Add | **Save the Date · Invitation · On the Day · Post Event · RSVP · Your info · Prints** | Scenes · Phone/Desktop · ⋯ · **Restore · Undo · Apply**.
4. Names: **Your info** → **Names**. (Or Event Details on Home → Bride/Groom. Same fact, two doors.)
5. Photo: **Hero photo** inside the Maker — fine; `/website/hero-photo` still exists with **Save photo** + "Back to Event Hub" — a second save verb.
6. **Apply** (top right; "Apply N" when Pro items drafted).

12–20 taps · 4–5 screens · own result at tap 1 (preview is the editor). Jargon: Maker, stage ×4, scene, RSVP as a stage, Prints, Your info, Restore vs Undo, Apply, Pro, hero, veil. Two names: Hub = Edit your Event Hub = Event Hub Maker = Your Event Hub; Your info = Event Details; Save photo vs Apply. Approved design exists: `prototypes/maker_in_four_2026-09-30_fable.html`.
Files: `launch/_components/maker-shell.tsx` · `maker-bar.ts` · `lib/public-site-stage-labels.ts` · `website/_components/hub-draft-bar.tsx` · `lib/tours.ts customer_event_hub_maker_v1`.

### H3 · Add 3 guests and send — OK
1. Bar → **Guests**. First visit pop-up **"Who can reply?"** (Only people on my list · Anyone, I approve), then the Invite tour.
2. Frame 2: Guests + **+** + ⋯ · search · Filter ▾ · counts · rows. Empty: "No guests yet. Start by adding your first guest." — no button where the eye lands.
3. **+** → "Type a name…" (Enter adds) + People · Full form · Import CSV · Quick add list. 3 names = 3 × (type, Enter); row appears instantly.
4. Send: per row **Send invite** → share sheet (message + QR ticket) or Copy. Bulk: tick → **Invite selected** → "Send invites one by one".

~16 taps · 4 screens (+3 OS sheets) · own result on the first name. Gap vs approved frame 1: Next card "Send 58 invitations" is not shipped (`pickHomeNext` has no invite kind).
Files: `guests/page.tsx` · `add-guest-sheet.tsx` · `capture-bar.tsx AddDoors` · `send-invite.tsx` · `guests/send/page.tsx` · `lib/who-can-reply.ts`.

### H4 · Find a photographer and chat — OK
1. Home says nothing about suppliers above the fold (below: "Suppliers · 0 of 21 booked · No vendors booked yet… · Manage vendors"). Bar → **Suppliers**.
2. "No suppliers yet." + **Find a supplier**. A 3-slide tour describes the desktop page ("marketplace", "Build your team", "Save plans, compare").
3. **Find a supplier** — search + Popular for weddings: Photo & Video · Catering · Reception · Hair & make-up. No filters asked first. "Photographer" is not a visible word.
4. **Photo & Video** → rows with **Save to bench** and **Ask for a quote**. No link to the supplier's page.
5. **Ask for a quote** → first message auto-written and sent → chat. One follow-up, then "Waiting for X to accept…".

4–6 taps · 5 screens · own result at tap 4. Jargon: bench, four verbs for one action (Ask for a quote / Inquire / Contact vendor / Message), Nudge ›. Two names: Suppliers vs vendors; Chats vs Messages vs Bench.
Files: `vendors/_components/services-takeover.tsx` · `team-rows.tsx` · `vendors/categories/page.tsx` · `lib/supplier-inquiry-opening.ts` · `messages/[threadId]/page.tsx` · `lib/tours.ts customer_vendors_v1`.

### H5 · Book and pay — Hard
Setnayan never takes the couple's money for a supplier. Booked = supplier agrees to the lock. Paid = couple pays directly, records it, supplier confirms.
1. Quote card → **Review & accept** (beside **Counter-offer**) → proposal page.
2. **Accept proposal** → "To book X, ask them to lock…" — no lock button on this page. Back to chat.
3. Card: **🔒 Ask X to lock** (handshake on) / **🔒 Lock X** (off) / "Lock on your Vendors page". Modals: "This locks your date.", time slot, (flag) "Pay the deposit to lock".
4. Wait ≤48 h. Row: Waiting · "Next: they agree to your lock" · **Nudge ›**.
5. Supplier agrees → **Booked** · "Next: pay your deposit" · **Pay ›**.
6. **Amount to pay** · "First payment · locks the date" → **Pay X directly** (their GCash/BDO/QR; pay in another app) → "Record it here": amount · Method · Reference # · receipt (optional) · **Record payment**.
7. "Date held · awaiting vendor confirmation" → after the supplier's "Yes, it arrived": **Confirmed by vendor**.

~12 taps · 5 screens · two waits. Jargon: lock (never glossed; the gloss sits in a hidden ⓘ), proposal vs quote, deposit vs First payment vs downpayment, bench, Reservation terms, Change-Order Trail. Dead ends: accept page without the lock button; "Amount to pay" over a "Record payment" button; no payment method = a sentence and no way to pay.
Files: `chat-message-stream.tsx` · `lib/quote-card-state.ts` · `proposals/[publicId]/page.tsx` · `lib/lock-door.ts` · `accordion-lock.tsx` · `deposit-reservation.tsx` · `vendor-direct-pay.tsx`.

## Supplier walk-throughs

Phone bar: Today · Customers · Shop · More (More: Calendar · Earnings & payday · Messages · Insights · Event Hub · Notifications · Plan). First open: `vendor_welcome_v1` (5 slides), then `vendor_today_v1`.

### S1 · Sign up and set up the shop — OK
1. /for-suppliers → **List your business for free** → `/open-shop` (the real door). No title; a 4-segment bar.
2. Shop logo (optional) · **Shop name** → Continue.
3. **Primary service** drill-down (groups → branches → leaves) · Events you serve (Wedding pre-ticked) → Continue.
4. Google/Apple or name · position · number · company email · password → Continue.
5. **Where you are** — map pin, "Yes, that's right" · Terms · **Open my shop — free** + booking-fee paragraph.
6. Lands on **My Shop**: Finish profile · "No services yet… Add a service" (a second canvas builder) · shelves (Reviews · Track record · Stories · Recaps · Attributes · Disputes · Theft Watch · Manpower · More tools).
7. Own result: shop name on Today — "Photo & Video · Not live yet". Nothing public until approval.

~20 taps · 6 screens. Dead end: lands on 15 tool rows; the ordered First steps live on Today. Two names: service / service card / Your cards; Shop vs My Shop.
Files: `open-shop/_components/open-shop-wizard.tsx` · `open-shop/actions.ts` · `vendor-dashboard/shop/page.tsx` · `_components/first-steps.tsx`.

### S2 · Answer a new request — OK
1. Arrives as bell · Customers badge · Today Next "Reply to a new inquiry" → **Reply** · a card with **Accept · Decline**.
2. Path A: Reply → thread: "Accepting does not book it." · **Accept inquiry** · Decline. Composer only after Accept. 2 taps.
3. Path B: Accept on the Today card → back to Today; find the chat via Customers. 3+ taps.
4. Type → Send. Tool strip appears (Send a quote · Offer another service · Voice or video call · Deal or meeting · Log the outcome).

Two names: Messages = Conversations = Customers; Reply vs Accept inquiry.
Files: `vendor-dashboard/page.tsx` · `supplier-today-first-screen.tsx` · `messages/[threadId]/page.tsx` · `lib/chat-actions.ts`.

### S3 · Send a quote — Hard
1. Tool strip → **Send a quote** → **Build a quote**.
2. One long form: Their event · Your cards · Start from a package · Line items (Flat / Per pax / Per hour) · Crew meal & transportation · Subtotal · Total · Net payable · Setnayan gift · Payment schedule (First payment 20% on_lock) · Accepted payment methods · Title · Valid until · Note → **Send quote · ₱N**.
3. Warning: "Add BDO / GCash / Maya details in your dashboard settings" — a page that doesn't exist by that name.
4. Footer: "…their plan fills only when they Lock."

Jargon: Lock, pax, on_lock, Offset, Net payable, shortlists you. Two names: quote vs proposal (Send a proposal card · /proposals "Proposals" · Customers row) vs "Quote & Payments" tab.
Files: `app/_components/proposal-maker.tsx` · `lib/vendor-thread-tools.ts` · `send-proposal-card.tsx` · `proposals/surface.tsx`.

### S4 · See they got paid — Easy
1. Couple records → bell/push "Deposit recorded — please confirm" (not emailed, by design).
2. Today Next "Confirm X's deposit" → **Check the deposit**; card "They say they have paid your downpayment" · **Yes, it arrived** · View the payment · "It never arrived".
3. Tiles move: owed to you · Earned this year · Confirmed of booked; ledger at Customers#payday.

1 tap. Jargon: deposit · downpayment · payment · installment; Payday (reads as a date); Confirmed of booked. Two names: Earnings & payday = Earnings = Payday = owed to you.
Files: `lib/supplier-today.ts` · `payday/surface.tsx` · `earnings/surface.tsx` · `vendors/actions.ts` (`payment_logged`).

## The fix list (ordered by impact)

Tags: **NOW** = simplicity fixes now · **ROOT** = Root map waves · **APPLE** = after the Apple check.
Owner yes needed before shipping: the Book/lock word, bench → Saved, quote not proposal, the money word (d17 brand subtitles are already approved). Fixes 18 and 19 touch rulings from 2026-09-30 / 10-01 — flagged, not assumed.

1. **NOW · Say "book", never "lock", on the couple side.** "Ask X to lock" → "Ask X to confirm your booking"; "Lock ›" → "Book ›"; "This locks your date." → "This books your date."; the accept page's sentence becomes the button. `lib/lock-door.ts` · `chat-message-stream.tsx` · `team-rows.tsx` · `accordion-lock.tsx` · `proposals/[publicId]/page.tsx`. (H5)
2. **ROOT · One booking stepper, same four words everywhere.** Quote card, Suppliers row and Payments card say "Step 2 of 4 · Accepted → Confirm → Pay them → They confirm" with one next button. `lib/your-team-rows.ts` · `lib/accepted-quote-terms.ts` · `deposit-reservation.tsx`. (H5)
3. **NOW · Pay card heading says what the button does.** "Amount to pay" → "Pay ₱X to X"; "Pay X" then "I've paid — record it" with Method pre-set; one word "first payment" (retire deposit/downpayment). `deposit-reservation.tsx` · `vendor-direct-pay.tsx` · `accordion-lock.tsx`. (H5)
4. **ROOT · Build the approved Maker in 4.** Exit · Page ▾ · Look · Details · Undo · Phone/Desktop · Apply; everything else under ⋯ / Page ▾. `maker-shell.tsx` · `maker-bar.ts` per `maker_in_four_2026-09-30_fable.html`. (H2)
5. **NOW · "Your info" → "Event Details" (d15); one form for names.** `MAKER_DETAILS_LABEL` in `maker-bar.ts`; menu row "Details" in `lib/customer-menu.ts`; the Maker's Details opens the same `details-form.tsx`. (H1, H2)
6. **NOW · Maker: no 8-slide tour before the first tap; no Pro slide on first open.** `lib/tours.ts customer_event_hub_maker_v1` · `maker-tour.tsx`. (H2)
7. **NOW · Quote builder: Line items · Total · Send first; the rest behind "More ▾" with defaults.** `app/_components/proposal-maker.tsx`. (S3)
8. **NOW · "Quote" everywhere; "proposal" retires.** "Review & accept" → "See the quote"; "Accept proposal" → "Accept quote"; "Send a proposal" → "Send this quote"; /proposals "Proposals" → "Quotes". `lib/quote-card-state.ts` · `proposals/[publicId]/page.tsx` · `send-proposal-card.tsx` · `proposals/surface.tsx`. (H5, S3)
9. **NOW · Home Next card knows about guests.** Add `'guests'` ("Add your guests") and `'invite'` ("Send N invitations" → `/guests/send`) to `pickHomeNext` / `HOME_NEXT_ORDER` in `lib/home-first-screen.ts`; N from the real unsent count. (H3)
10. **NOW · Show their invitation at the end of sign-up.** The congrats card draws the real Invitation › Welcome scene with their names and date; "See your invitation" → Maker. `onboarding-shell.tsx` (`screen-congrats`) · `hub-stage.tsx`. (H1)
11. **NOW · Guest empty state carries the button.** "No guests yet." + **Add a guest** (same sheet as the header +). `guests/page.tsx`. (H3)
12. **NOW · New shop lands on Today, not My Shop.** `open-shop/actions.ts` redirect → `/vendor-dashboard`. (S1)
13. **NOW · Replying is accepting.** Composer open on a new inquiry; first Send accepts; the Today card's Accept returns to the thread. `messages/[threadId]/page.tsx` · incoming-request actions. (S2)
14. **NOW · Plain name first, brand small under (d17).** "Guest photos · Papic", "Planner · Setnayan AI", "Video booth · Patiktok", "Music · Music Maker", "Live stream · Live Watch"; onboarding "Continue — guest photos are on". `lib/home-first-screen.ts homeServices` · `lib/our-services.ts` · `lib/add-ons-catalog.ts`. (H1)
15. **NOW · "Supplier" never "vendor"; "Chats" never "Messages/Conversations".** `event-dashboard.tsx` (Manage vendors…) · `lock-door.ts` · `messages/*` · `lib/vendor-more-rows.ts` · `vendor-dashboard/messages/surface.tsx`. (H4, H5, S2)
16. **NOW · Find list: the name opens the supplier page; "bench" → "Saved".** `vendors/categories/page.tsx` (→ `/v/[slug]`) · `shortlist-categories.tsx` · `lib/budget-build.ts`. (H4)
17. **NOW · One money word for the supplier.** deposit/downpayment/installment → "payment"; "Earnings & payday" → "Money in"; Payday h1 → "Payments"; "Confirmed of booked" → "Received of booked". `lib/vendor-more-rows.ts` · `payday/surface.tsx` · `lib/supplier-today.ts`. (S4)
18. **NOW · "Who can reply?" gets its default, moves behind ⋯.** Pre-answer "Only people on my list"; frame 2 already draws "Guests reply? Yes ▾" behind ⋯. `lib/who-can-reply.ts` · `guests/page.tsx`. ⚠ owner yes (2026-09-30 ruling). (H3)
19. **NOW · QR-mode card leaves sign-up.** Default Personal QR; lives in Event Details; `WEDDING_FLOW_ORDER` drops `setup_entry`. ⚠ owner yes (flow approved 2026-10-01). (H1)
20. **NOW · Payment methods typed where they are missing** — the three fields replace the "dashboard settings" sentence in `proposal-maker.tsx`. (S3)
21. **NOW · Add-guest doors in plain words.** From your people · Add with details · Import a file · Paste many names. `capture-bar.tsx AddDoors`. (H3)
22. **ROOT · Hero photo has one save verb.** `/website/hero-photo` unlinked from the Maker or its button becomes Apply. (H2)
23. **NOW · Suppliers tour describes the phone, or waits.** Retire `customer_vendors_v1` until the spotlight tour. (H4)
24. **ROOT · Waiting has a number.** "Waiting for X" says the measured median reply time (or nothing); queue messages instead of locking the composer. `messages/[threadId]/page.tsx`. (H4, H5)
25. **APPLE · Sign-up upsells wait for the Apple check.** The services step and Pro tour slides mention prices in first-run flows; any re-wording that keeps a price waits; the plain-name change (14) does not. (H1, H2)

## Re-measure
`grep -rn "Your info\|bench\|proposal\|vendor" apps/web/app apps/web/lib --include=*.tsx` — counts are deliberately not written here.
