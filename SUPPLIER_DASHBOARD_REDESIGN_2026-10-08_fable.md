# Supplier dashboard — the same rules as the event dashboard

**2026-10-08 · Fable (designer) · design + prototype only. No app code, no PRs, no database writes.**
Owner, verbatim: *"with the same rules as our event dashboard. are there any improvement that we can do for the supplier dashboard?"* · *"once you have spotted them, you can use fable to redesign the supplier dashboard"* · on the More sheet: *"including these"* · *"or maybe a better way to plot them neatly on our supplier dashboard?"*
Build order (locked 2026-10-08): Event Hub → couple's Suppliers page → **supplier dashboard (this)** → Admin. Nothing is built until the owner approves the prototype.

✅ **Owner, 2026-10-08, on round 1 (verbatim): "1. B 2. Money 3. Hide them in a fold 4. Remove the Old One 5. Open from porfile Picture"** — B is the layout, the page is Money, Pro Insights sit in a fold, the old customer-card shell is retired, Settings opens from the profile picture. Logged in DECISION_LOG. Round 2 (same day) closed the two coverage checks (plans · routes/map) — §7–§10 below; owner: *"fix all gaps and make sure all maps are connected properly. and everything is easier and functional and efficient for a businessman to handle his business."*

Prototype: `prototypes/supplier_dashboard_2026-10-08_fable.html` (gallery of 35 live phone frames + 3 dark; `?s=<frame>` opens one alone, `&dark=1`, `&open=<row>`, `&v=launch|ending|store|free|full|datechange|locked`).
Screenshots (375 px): `prototypes/supplier_dashboard_2026-10-08_fable/00-contact-sheet.jpg` + `01…40-*.jpg` (10 = QR codes; the round-1 "More A" frame is history only — the sheet now draws B alone).
Read: `SUPPLIER_DASHBOARD_AUDIT_2026-10-08.md` (R1–R12) · `PAGE_DESIGN_PROMPT_TEMPLATE_2026-10-08.md` · `BUTTON_RULE_2026-10-07_fable.md` · `supplier_app_simple_2026-10-01_fable.html` (approved) · `SUPPLIER_SIDE_REPORT_2026-10-03.md` · the couple-side redesigns of 10-07/08 · DECISION_LOG rows 2026-09-20 → 10-08 (L3983, L4040, L4260, L4575, L4685–4701, L4711, L4720, L4804, L4857). Code read from `origin/main` in a detached worktree only, by three Sonnet readers (Today/Customers · Shop/Settings · On-the-day/Insights).

---

## Verdict

**The approved shape is right; the pages behind it were never redrawn.** Today's first screen, the four-tab bar and the Customers roster already follow the 2026-10-01 prototype. Everything one tap deeper is still the old dashboard: 4,104-line customer card with six tabs, a 2,240-line My Shop with 14 Save buttons, a 16-card Insights page, a 1,207-line On-the-day console of bordered boxes, two customer lists, two calendars, two QR pages, verification shown in three places, and a More sheet of seven sentence-rows that are mostly redirects into the Customers page anyway.

**Nothing new is needed. Every row in the prototype reads data that already exists.** The work is: one row shape, one segmented control on Customers and on Shop, fold the six More rows into the pages they describe, delete the duplicates, and replace every per-field Save with autosave-on-close (which `editable-row.tsx` already does) or one Apply.

**Words: Today's below-the-fold went from ~250 to ~60; the More sheet from 7 sentences to 3 rows of 1–3 words; the customer card from six tabs of prose to five rows.**

---

## 1 · Where the six More rows go (the owner's "plot them neatly")

Today `lib/vendor-more-rows.ts` lists **Calendar · Money in · Messages · Insights · Event Hub · Notifications · Plan** (no Settings row — the code comment says there is no settings page). Three of those are redirect stubs into Customers already (`customers/anchors.ts`).

| Row today | Where it IS in code | Where it goes (B, recommended) | Why |
|---|---|---|---|
| Calendar | `customers-calendar.tsx` on the Customers hub (+ `calendar/surface.tsx`, a second renderer) | **Customers › Dates** (segment 2) | It is the same bookings as the list, drawn as a month. One calendar, not two. |
| Money in / Earnings & payday | `payday/surface.tsx` at `#payday` on Customers; `earnings/surface.tsx` in Shop | **Customers › Money** (segment 3) | Money is the customers' payments. Earnings + payday + booking-fee bills become one page: Received · To come in · Next due · Setnayan fees. |
| Messages | `messages/surface.tsx`, a fold on Customers | **The envelope on every page** (top-right, with the unread badge) + every customer row opens its chat | One tap from anywhere; the row shape the couple side already uses (`.door`). |
| Insights | `/performance`, 16 cards | **Shop › Insights** (segment 3) | My Shop already has six "How you're doing" stat tiles — Insights is those, plus the Pro cards folded under one ⌄. |
| Event Hub | `/on-the-day` | **Three doors, one page:** Today's Next card on an event day ("Run the day", approved), a row inside each booked customer card, and **More › Event Hub** (kept — DECISION_LOG 2026-10-03 L4691: *scan lives at More → Event Hub → the console*) | The console is per event; it belongs on the event. More keeps the door the scan ruling names. |
| Settings (Notifications · Plan · Team · sign out) | three pages + the account menu | **The avatar, top-right** → one Settings page of folds: Account · Notifications · Plan · Getting paid · Team · More tools · Sign out. Also a More row. | Settings behind the profile picture is what every phone app does; "Getting paid" (payment options) and Team leave My Shop, where they are not shop content. |

**More (B) = Event Hub · Settings · More tools.** Three rows (owner: *"B"*). "More tools" is the shelf a small phone supplier should not see by default — all 15 of today's `shop-tool-shelves.ts` rows, grouped What couples see · With others · Protection, one row each, no sentences (frame 33). Option A (the six rows tidied) was drawn in round 1 and is not in the prototype any more.

The bar stays **Today · Customers · Shop · More** (approved 2026-10-01). Customers' badge = waiting + unread.

---

## 2 · Today's blocks per page — keep · move · merge · remove

### Today (`vendor-dashboard/page.tsx` + `supplier-today-first-screen.tsx` + `overview-sections.tsx`)
| Block today | Fate |
|---|---|
| Shop line (mulberry block, category · Live) | **Move** into the shell: logo · shop name; the Live/Verified line becomes the one "Shop" row at the bottom of Today. |
| NextCard (`pickSupplierNext`, 9 rules) | **Keep** — exactly. Add "1 of 3" counter and a second, grey button (Their brief / Chat). Buttons through `ActionButton` with tones (Reply = info, Agree = ok, Run the day = brand). |
| Three number tiles | **Keep**; through `Count`; "owed to you" → "to come in"; a failed read shows "— · couldn't load", never a zero (today: tile vanishes). |
| Coming up (3 rows) | **Keep**; "All dates ›" → Customers › Dates. |
| "See everything ⌄" + `#today-all`: todayLabel caption, milestone pill, Your money tiles, findability banner, credit banner, first-steps rail, award banner, payout nudge, BookingFeeBills, WhatsNewFeed, token note, NothingToAnswerFeed, OngoingTasks, UpcomingSchedules | **Merge** into one "Also waiting" list: one row per ask (`needsAnswer[1..]`), each `label · one line · "2 of 3" · ›`, opening the customer card where the shipped inline forms already live. Money tiles → Customers › Money. Findability/credit/fee/first-steps are already Next-card rules 4–7 — delete the banners. Award banner → Shop › Page › Reviews. Token note, NothingToAnswer, Ongoing, UpcomingSchedules → **remove** (all duplicates of the Next queue or of Customers). |
| Outcome notices (lock/date/deposit answers via query params) | **Keep** as a toast, not a tile. |
| MiniTour `vendor_today_v1` | **Keep**; slide 3 ("Everything else is in More") rewritten for B. |
| **Event day** | Next card goes ink/dark: title = the event, "Run the day" (brand) + Chat; the three numbers become waiting · next moment · checked in; "Also today" = Schedule · Shot list · Scan rows into the Event Hub. |

### Customers (`customers/page.tsx` + `_components`, `clients/surface.tsx`, `calendar/surface.tsx`, `payday/`, `earnings/`)
| Block today | Fate |
|---|---|
| Roster (lanes, Filter ▾, Show ▾, search, +, ⋯ "More customer tools" with 6 items) | **Keep** as **Customers › People**. Search + Add move to the frosted thumb row. The ⋯ menu goes: its six items are the two other segments and the card. Filter ▾ stays (one dropdown). Show ▾ goes — the right column shows the next step; money and days live in the other two segments. |
| Date-clash banner | **Keep**, as one warn row above the list. |
| `#calendar` (`customers-calendar.tsx`) + `calendar/surface.tsx` (second renderer, pools, waitlist, capacity, blocks) | **Merge** into **Customers › Dates**: one month grid (booked · holding · blocked), the day's rows under it, then three folds: Block days · Waitlist · Capacity (calendars + events-a-day). One dropdown for "All calendars". |
| Three summary tiles (Ongoing payments · Messages · Service coverage) | **Remove** (Money segment · envelope · Shop). |
| `#bookings` BookingsSurface · `#payday` PaydaySurface (4 KPI tiles + month groups) · `earnings/surface.tsx` (KPI tiles, 12 months, legacy payouts, BookingFeeBills) | **Merge** into **Customers › Money**: Received · To come in · one meter; "Next in ▾" rows (one per instalment, Pay/check pills); "Setnayan" group = booking-fee bills (Pay = ok) + "This year" fold (months). Legacy payouts → inside "This year" only if any exist. |
| `#customer-tools` FeatureAccordion: messages · clients (Booked via Setnayan · In conversation · Outside clients · Kept notes) · availability · proposals · contracts | **Remove the accordion.** Messages → envelope. Clients → the People list (outside clients are rows with an "Outside" pill; kept notes → the card's Notes fold). Availability → Dates folds. Proposals/Contracts → the card's Money fold (Quote button) and the Next queue (quote_draft / contract_draft rules exist). |
| `/invite` (Shortlist / Locked QR toggle) + `/locked-qr` ledger | **Merge**: one "QR codes" fold under Dates (Shortlist · Booked — one dropdown), ledger inside. Reachable from the Add sheet too. |
| MiniTour `vendor_customers_v1` | **Keep**, slides rewritten: People · Dates · Money / Waiting first / Add an outside client. |

### A customer (`clients/[eventId]/page.tsx`, 4,104 lines, 6 tabs; `RelationshipTabShell` behind a flag)
| Block today | Fate |
|---|---|
| Sticky header: ← Clients · h1 · payout nudge · fee bills · waived rows · stage pill · chips · Imported badge · action row (Open chat · New quote · Files · Schedule · Log payment) · PipelineStrip · CardTabs | **Keep** name · one fact line · the 5-step stage line with one caption. Fee bill → one warn row "Booking fee · Pay". Action row → the **frosted thumb row**: Chat (info, main) · Quote · Payment · Call. Tabs → **rows** (approved frame 3: "key facts + one stage button + closed rows. Same words as the tabs"). |
| Overview tab (snapshot, headcount, meals, style, budget, seat plan, payment card, deposit proof, completion card, cocktail, booth cards) | **Their brief** ⌄ — Package · Venue · Headcount · Meals (if any) · Mood board › · Seat plan › · Schedule ›. Access follows the category map (L4686/L4819) — rows simply do not render when not granted; no padlocks. Booth/challenge cards → More tools unless booked. |
| Quote & Payments tab (quotes list, payment plan, BookingMoneySummary, PaymentAsksPanel) | **Money** ⌄ — Paid · Due · one row per instalment with Received/due pill · Log a payment (ok) · Quote (grey). Same `logPayment` action. |
| Files tab | **Files** ⌄ — contract · shared files · "Share in chat" is the Chat button, not a link. |
| Schedule tab (timeline, .ics, suggest-a-change, handover, change orders, appointments) | **Event Hub** › row (ok pill with the date) — one door into the per-event console, where schedule, handover and requests already live. Pre-booking: the row reads "after booking". |
| Script tab (`holdsSpecialization`) | Inside Event Hub › My tools. |
| Activity tab + `customer-card-notes.tsx` "Save note" | **Notes** ⌄ — autosave as you type; reminders stay. |
| `EventLockedByFee` panel | The Event Hub row says "Pay the booking fee to open" (warn) — the row, never a blank page. |
| Flag `NEXT_PUBLIC_RELATIONSHIP_WORKSPACE_ENABLED` | Retire the flag-ON shell; the rows above are the one card. (Owner call — question 4.) |

### Shop (`shop/page.tsx`, `shop/_components/*`, `services/*`, `website/`, `subscription/`, `team/`, `payment-options/`)
| Block today | Fate |
|---|---|
| HeroCard (avatar, name, Verified pill, CompletenessRing, copy link, one CTA) | **Shop › Page** first row: name · url · rating · Live pill · View (grey). |
| Six StatTiles "How you're doing" | → **Shop › Insights** first three rows (Views · Inquiries · Booked) + bars. |
| ShopRail "On this page" (6 doors) | **Remove** — the segment is the rail. |
| ManageTiles (Profile % · Website · Team · Branch) + VerifySection (always visible) | **Page** folds: Verified (Documents · Contacts; the three verify states become one summary line — the one place it is shown) · Profile (the `editable-row` checklist, autosave on close) · Look · Photos · About · Reviews · Reach (HQ · radius · branches) · Auto-reply (switch). Team → Settings. |
| Profile panel: ProfileChecklistEditor · Business start date (Save) · VenueMatchCard (Save) · VenueTypeCard · PublicLineCard (Save) · SuggestedCoverageCard · VisibilityCard (Save) · RequestCorrectionCard | **Merge** into the Profile fold rows (EST · Venue fit · Line · Visibility switches · "Something wrong?" ›). Every Save → `editable-row` close-save. |
| WebsiteEditor (988 lines; "Open full website settings" → `/website`; gallery Save; About Save; Sections switches; accent swatches; Pro rows) + `/vendor-dashboard/website` | **Merge** into Look (theme picture cards · Accent dropdown · Hero photo) · Photos (Add · Instagram) · About (text · Sections). One **Apply** in the thumb row publishes the draft; `/website` retires into Shop › Page. |
| ServicesDisclosure → ManagerTabs (Coverage · Service cards · Tools) + `<details>` Edit per card (Save changes · Save links · Publish) + CanvasMaker / ServiceWizard | **Shop › Services**: one row per service/package: thumb · name · one line · price · Live/Draft switch (`is_active`). "What you sell ▾" = All · Services · Packages · Add-ons. Tap → the shipped editor as a sheet; its three Saves become close-save + the publish gate. Coverage → one row at the bottom ("Coverage · 3 event types ›"). Specialist tools → More tools. Add (brand) in the thumb row. |
| Packages link card (flag-dark) | A row type in Services when the flag is on. |
| AutoReplyCard (3 Saves, 2 switches) + VoiceMatchCard (Save voice) + `/lines` | **One row** "Auto-reply · On · 20 a day" with a switch; ⌄ opens cap · auto-accept · voice (autosave). `/lines` retires into it. |
| `#earnings` EarningsSurface | → Customers › Money. |
| `#shop-folds`: payments (PaymentOptionsSurface + AddPaymentMethod 3-tile picker) · manpower · tools (3 shelves, sentence subs) | Payments → **Settings › Getting paid** (rows with show/hide switches; "Add a way" → type is one dropdown). Manpower → More tools. Tools → More tools (1–3-word subs). |
| `/subscription` (masthead "Choose your plan.", cycle toggle, plan cards, 3 add-on cards, Deep Search card, custom plan) | **Settings › Plan**: Plan ▾ (Free · Solo · Pro · Enterprise · Custom) · Cycle ▾ · Add-ons › · Pay (ok). Prices read from `vendor_billing_catalog` (never a constant). Plan cards' six cap lines → behind ⓘ. Store shell: this fold is hidden (shipped `webOnly`). |
| `/team` (11 forms) | **Settings › Team**: one row per member (role is one dropdown on tap) · Invite (brand). Seat cap line. |
| `/notifications` (PushToggle 6 paragraphs, Mark all read, list) | **Settings › Notifications**: Push switch · Email switch. The list itself = the bell is not needed; Today's Next queue is the inbox of asks. |
| MiniTour: none on Shop | **Add** `vendor_shop_v1` (one slide: Services · Page · Insights). |

### Insights (`/performance`, 864 lines, 16 cards; `/demand` redirects here)
| Block today | Fate |
|---|---|
| Window toggle (Daily Pro · Monthly · Annual) + ServiceScopeSelector | **One dropdown** "Last 28 days ▾" (Last 28 days · This year · Daily · Pro) ; service scope inside the Pro fold. |
| HealthCompositeCard + GrowthRecs · ReplyClaimCard · VerifiedMedianCard | **Keep** as the "How you're doing" fold: one-line summary (Good · reply time · rating), rows Reply time · Your price · Where bookings come from. |
| Momentum · Funnel · ROI · 3× SourceBreakdown · InquiryHandling · ConversionDeals · Capacity · DemandRadar · FunnelBenchmark · PricePosition · Reputation · two VendorTierTeasers | **Fold** under "More · Pro ⌄": one row each (Funnel · Demand radar · Capacity · How you compare · Reputation ›), each opening its shipped card as a sheet. Free sees the three rows + the bars + the health fold. `partnershipErr ? 99 :` → "couldn't load". |
| MiniTour: none | Covered by `vendor_shop_v1`. |

### Event Hub (`/on-the-day/page.tsx` 1,207 lines + `live/[eventId]` console + `papic`)
| Block today | Fate |
|---|---|
| Status banner (3 states, T-1h → T+8h prose) · Preview banner · free-until line | **One fact line** under the title: "live 12:00 – 21:00". No preview mode — the page lists the next event's rows read-only until the window opens. |
| CompactDayOf (ShopEmpty · "Preview the console" · ModuleReadout · "Your event briefs" door) | **Remove**. Outside an event day the page shows the next booked event's rows, dimmed. |
| Dark event card + "Launch the app" | The title + fact line; the console is this page. |
| ModuleReadout / ModuleConfigurator / AccessGrants (`?event=` setup view) | **Remove the setup view**: modules render as rows only when granted (the category map). "Set up" was a go-elsewhere door. |
| Console body by kind (Delivery 3-stage tile · Guests tile · NonPhotoConsole tiles · IssuesLog) | **Rows**: Schedule (On time pill) · Headcount (Count) · Scan ⌄ (Mode = one dropdown of the five modes, L4691; last scan; upload-to-number switch) · Shot list · Papic (credits) · Tell the coordinator (status presets) · Hand over · My tools ⌄ (Song desk / Script & cues / Run the floor — the three specialization sets, by category). |
| "Capture for your website + their recap" 3 CaptureCards · GuestReviewQr | Hand over row (clips · photos · review link). "website" → "page" (R12). |
| `live/[eventId]` frame (Exit · FloorClock · jump-nav · RunOfShowHeader · headcount · quick-link tiles · LiveReviews) | Folded into the same rows; FloorClock = the "next moment" number on Today. |
| `SpecializationSlot` LockedUpsell / "Coming soon" plates | The My tools row reads "Solo and up ›" (grey) when below the floor; never a plate. |
| Thumb row | **Scan** (brand, main) · Papic (shutter) · Tell. |
| Fee gate (`EventLockedPage`) | One warn row at the top: "Booking fee · Pay to open" — the rest dimmed. Fails OPEN on an unreadable read (L4040). |
| MiniTour: none | **Add** `vendor_hub_v1` (one slide: Run the day). |

### Messages (`messages/surface.tsx` + thread)
Keep the inbox as is (it already is one list) — remove the h1 "Conversations" and the InquiryOutcomesRollup (→ Insights › How you're doing); add one dropdown All · Unread · New inquiries · Booked · Archived (replaces the archived accordion); search in the thumb row. Setnayan's own notices appear as one "Setnayan" thread so Notifications needs no list.

### Extras (`recommendations · track-record · recaps · creators · partnerships · deep-search · moodboard-library · manpower · activities · theft-watch · disputes · repertoire · real-stories · attributes · reviews`)
All **keep**, all reached from **Settings › More tools** (and Shop › Page › Reviews for reviews). Each page: title row with ‹, rows not cards, one dropdown per choice set, no intro paragraph, honest "Couldn't load". `track-record` page and `vendor-track-record-panel` → one. `manpower` stops crossing to the couple side. Theft Watch empty = "Clean".

---

## 3 · The design, plain English (375 first)

**Shell on every page:** SETNAYAN · shop name · envelope (unread badge) · avatar. Sub-pages: ‹ · page name · the same two doors. No h1 on the phone (the bar or the title row names the page).

**Today.** One Next card (shipped rules, "1 of 3"), three numbers, Coming up (3), Also waiting (the rest of the queue), one Shop row. On an event day the card is dark with **Run the day**. ~60 words.

**Customers = People · Dates · Money** (one segmented control, the Suppliers/Guests shape). People: one row per customer (avatar · name · event line · stage pill · one-line next step), Filter ▾, thumb row = search (≥60 %) + Add (brand). Dates: the month, the picked day's rows, Block days · Waitlist · Capacity folds, thumb row = Block a date · Add. Money: Received · To come in · meter, "Next in ▾" instalment rows, Setnayan fees, This year fold; thumb row = Log a payment (ok).

**A customer.** Name · one fact line · stage line. Five rows: Their brief ⌄ · Money ⌄ · Files ⌄ · **Event Hub ›** · Notes ⌄. Thumb row: Chat (info) · Quote · Payment · Call. Pre-booking the stage caption carries the one ask (Reply / Agree / Send quote) and the main thumb button is that verb.

**Shop = Services · Page · Insights.** Services: rows with price + Live switch, "What you sell ▾", thumb = search + Add. Page: Live row + folds (Verified · Profile · Look · Photos · About · Reviews · Reach · Auto-reply), thumb = View page · **Apply** (one publish for the draft). Insights: Views · Inquiries · Booked + bars, How you're doing ⌄, More · Pro ⌄.

**More (B):** Event Hub (with the next date) · Settings · More tools. **Settings** (avatar): Account › · Notifications ⌄ · Plan ⌄ · Getting paid ⌄ · Team ⌄ · More tools ⌄ · Sign out.

**Event Hub:** title · live window · rows (Schedule · Headcount · Scan ⌄ · Shot list · Papic · Tell the coordinator · Hand over · My tools ⌄); thumb = Scan · Papic · Tell.

**Every page:** rows are hairlines, no boxes; one open fold at a time (L4715); choices are one dropdown; buttons are `ActionButton` tones (brand = forward, ok = commit/money, info = chat, warn = waiting, danger = remove, grey = manage); numbers `Count`, meters `Fill`; thumb rows are `sn-glass-row` and slide away on leaving; failures say **Couldn't load · Retry** in the row's own place (frame 15: the Next card and the money number both say so). Dark mode = the shipped dark tokens (frames 16–18). First-visit tour = one `MiniTour` slide per page (Today · Customers · Shop · Event Hub).

**Desktop** (after): the same screens; segments become the left rail's sub-rows; folds open side by side; nothing different.

**Words:** supplier · event · Event Hub · book. "celebration" (clients/surface, recaps, real-stories) and "wedding"/"website"/"store"/"vendor" in supplier copy go in the same PRs that touch those files.

---

## 4 · Data — exists vs NEW

Everything drawn reads a shipped function or table:
`pickSupplierNext` · `fetchVendorOverviewData` · `fetchVendorEarningsSummary` · `readVendorPaydayInstallments` · `fetchVendorLedgerEarnings` · `fetchDueFeeBills` · roster lanes (`roster-view.ts`) · `customers-calendar` inputs (day states, waitlist, pools, blocks) · `fetchVendorThreadsDetailed` · the customer card's `OverviewTab`/`QuoteTab`/`FilesTab` data · `logPayment` · `vendor_services.is_active` + the publish gate · `editable-row` + `updateVendorProfileField` · verify-section state · `vendor_billing_catalog` (plan prices) · `resolveVendorTier` · `vendor-dayof-modules` + the three specialization sets · `fetchVendorFunnelTotals` etc. (Insights) · `vendor-team.ts` · push subscription · `shop-tool-shelves.ts`.

**NEW (named, all small, none schema):**
1. `vendor_shop_v1` and `vendor_hub_v1` tour keys in `lib/tours.ts`; rewritten slides for `vendor_today_v1` / `vendor_customers_v1`.
2. A `CustomersSegment` / `ShopSegment` URL param (`?seg=people|dates|money`, `?seg=services|page|insights`) — the anchors module (`customers/anchors.ts`) maps the old `#payday`/`?open=` landings onto it so every existing link still lands.
3. A supplier Settings page (`/vendor-dashboard/settings`) composed from the existing Notifications · Plan · Team · Payment-options surfaces — a new route, no new data; joins the route registries (memory: *a new top-level route joins three registries*).
4. The Scan row's mode dropdown and upload switch are the S2 scan build (SUPPLIER_SIDE_REPORT) — **that schema is S2's, not this plan's**; here the row renders with "not yet" until S2 lands.
5. Honest-read flags where the audit found none: Today money tiles, `partnershipErr ? 99`, lines/reviews/team/real-stories empty states — same shape as `reads-are-honest.test.ts`.

**Not drawn, deliberately:** the booking-fee rail flag (OFF, L3985) — the fee rows render when a bill exists, whatever the stage flag says; the launch offer (L4824) is an admin config, it only changes which fee rows appear.

---

## 5 · Owner questions (one word each) — with my recommendation

**All five answered by the owner on 2026-10-08 — do not re-ask.** Answers: 1 B · 2 Money · 3 "Hide them in a fold" · 4 "Remove the Old One" · 5 "Open from profile picture".

| # | Question | Recommend → **Owner** | Why |
|---|---|---|---|
| 1 | **Re-plot?** A (keep the six-row More, tidied) or B (Calendar/Money → Customers, Insights → Shop, Messages → envelope, Settings → avatar; More = Event Hub · Settings · More tools) | **B** → **B** | Three of the six rows are already redirects into Customers; B removes a hop from every one of them and keeps the bar the owner approved. More › Event Hub stays, so the 2026-10-03 scan ruling holds. |
| 2 | **Name?** the money segment: "Money" or "Earnings & payday" / "Money in" | **Money** → **Money** | One word; it holds both what came in and what is due, plus Setnayan fees. |
| 3 | **Pro?** Insights for a free shop shows three rows + health; the 13 Pro cards fold under "More · Pro ⌄" | **Fold** → **fold** | A phone supplier sees what a couple sees (reply time, rating) and never a wall of charts. |
| 4 | **Flag?** retire `NEXT_PUBLIC_RELATIONSHIP_WORKSPACE_ENABLED` (the 7-tab shell) and ship the one row-card | **Retire** → **remove the old one** | Two cards for one customer is the same fact in two places; the flag has been OFF in prod. |
| 5 | **Settings?** the avatar opens Settings (and More lists it too) | **Avatar** → **profile picture** | Every phone app; the More row stays for the first week so nobody loses it. |

Nothing above contradicts a locked row. Rows checked: L3983 (whole brief from first contact — the brief fold shows it), L4040/L3985 (fee gate — a row, fails open), L4260 (supplier), L4575 (the bar), L4686/L4819 (access by category — rows render by grant), L4691 (scan in More › Event Hub — kept), L4711 (event), L4715 (one open), L4720 (dropdowns), L4804 (button rule).

---

## 6 · Build plan — PR-sized, in order (Opus builds; each PR ends with a 375 side-by-side, prototype left · build right; no merge before the owner's ok)

| PR | Scope | Touches | Schema |
|---|---|---|---|
| **S-PR0** | Foundations: `ActionButton`/`Count`/`Fill` adopted in `vendor-dashboard/_components`; `sn-glass-row` thumb row component for the supplier side (`SupplierThumbRow`, slides in/out); the supplier shell (envelope + avatar); tour keys. Guard: no `<button>` without `ActionButton` in swept supplier files. | `_components/`, `lib/tours.ts`, `globals.css` (none new) | none |
| **S-PR1** | Today: Also-waiting list replaces `#today-all`; banners deleted (their rules already live in `pickSupplierNext`); event-day dark card; honest money number; toast for outcome notices. | `page.tsx`, `supplier-today-first-screen.tsx`, `overview-sections.tsx` (shrinks) | none |
| **S-PR2** | Customers segments: `?seg=` + anchors mapping; **People** (roster rows, Filter ▾, thumb search + Add; outside clients + kept notes folded in; `clients/surface.tsx` retired). | `customers/`, `clients/surface.tsx`, `anchors.ts`, redirect stubs | none |
| **S-PR3** | **Dates**: one calendar (`customers-calendar.tsx` kept, `calendar/surface.tsx` folded in as the three folds: Block · Waitlist · Capacity); QR codes fold (`/invite` + `/locked-qr` → one). | `customers/`, `calendar/`, `invite/`, `locked-qr/` | none |
| **S-PR4** | **Money**: payday + earnings + fee bills as one segment; Log a payment thumb; This-year fold; legacy payouts only when present. | `payday/`, `earnings/`, `customers/` | none |
| **S-PR5** | The customer card as rows (Brief · Money · Files · Event Hub · Notes), thumb row, fee row; notes autosave; flag-ON shell retired (if Q4 = Retire). | `clients/[eventId]/` (shrinks), `customer-card-nav.tsx` deleted | none |
| **S-PR6** | Shop segments: **Services** rows + switch + "What you sell ▾"; editors open as sheets; coverage row; ShopRail/ManageTiles removed. | `shop/`, `services/` | none |
| **S-PR7** | **Page**: folds (Verified · Profile · Look · Photos · About · Reviews · Reach · Auto-reply); every Save → close-save or the one Apply; `/website` and `/lines` retire into it. | `shop/_components/*`, `website/`, `lines/` | none |
| **S-PR8** | **Insights**: three rows + bars + two folds from `/performance`'s cards; one window dropdown; `/performance` and `/demand` redirect to `shop?seg=insights`. | `performance/`, `demand/` | none |
| **S-PR9** | **Settings** route (Account · Notifications (+Recent list) · Plan (launch-offer states, Add-ons sheet, Papic credits Buy, Boost line, Build Custom, API deferred, store-shell read-only) · Getting paid · Team · More tools (all 15, grant-gated) · Sign out) composed from `notifications/`, `subscription/`, `payment-options/`, `team/`, `shop-tool-shelves.ts`; the profile-picture sheet; **joins the three route registries** (memory: *a new top-level route joins three registries*) and `VENDOR_MORE_MATCH`; **staff scoping** via `filterVendorNavGroups` (an agent sees Today · Customers only — Settings shows Account · Notifications · Sign out); **admin-renamable slots** `vendor.sidebar.*` / `vendor.bottom-nav.*` keep working for the renamed rows (Insights · Event Hub slots move with them; a new `vendor.more.settings` slot). | new `settings/page.tsx` + the four surfaces, `vendor-nav-destinations.ts`, registries | none |
| **S-PR10** | **More** sheet = B (or A if the owner says so): `vendor-more-rows.ts` rewritten; `VENDOR_MORE_MATCH`; tour slide. | `lib/vendor-more-rows.ts`, `more/` | none |
| **S-PR11** | **Event Hub** as rows: `on-the-day/page.tsx` + `live/[eventId]` → one page; setup/preview views removed; specialization sets as My tools; thumb Scan · Papic · Tell; fee row. The Scan row's mode/upload = S2's build (its own prototype, approved 2026-10-03). | `on-the-day/` (shrinks) | none here (S2 owns its migration) |
| **S-PR12** | Extras sweep: the 15 small pages to rows + one dropdown + honest empty; words (celebration/wedding/website/store/vendor); `track-record` duplicate; `manpower` stays on the supplier side. | `recommendations/ … reviews/` | none |

Each PR: typecheck · lint · unit from `apps/web` · the repo guards · one sabotage seen red; draft PR, `do-not-auto-merge`, owner ok on the side-by-side first. If a step needs a migration or a protected guard the plan does not name: stop and report.


---

## 7 · Plans — every feature of every tier has a drawn home (closes the 13 plan gaps)

Overrides read first: DECISION_LOG 2026-10-08 launch offer **B** (first 2,000 platform bookings fee-free; every supplier on Pro free until the END of the week in which the 2,000th lands, on the 4-week cycle; one admin page: on/off · cap · live count · end date) · **50 Papic credits per fee-free booking** (admin-editable; the ₱500 pack stays; the 5 %-of-fee grant returns after) · prices from `vendor_billing_catalog` only · ceilings L3093 (live candidates per date Free 1 · Solo 3 · Pro 5 · Ent 10; waitlist 0/1/3/5) · Supplier Pro web-only (L4852). `lib/vendor-launch-free-window.ts` is the OLDER "free until Nov 30" window, not this offer — the offer has no code yet (NEW, below).

| # | Gap | Home · frame |
|---|---|---|
| 1 | Launch offer | **Plan fold state** "Pro · free · launch offer" with one row *1,240 of 2,000 bookings · Pro free till the week it ends* (23) · **one line on Today** under the Next card (22) · **fee row** reads *free · launch offer · ₱0* (30) · **ending state** "Offer ends Sun Nov 1 · Then: Keep Pro ₱— / 28 d ▾ Go Free" (24). Counts read the admin config (live count · cap · end date) — NEW read, no new table beyond the admin page the ruling names. |
| 2 | Plan status outside Settings | The **profile-picture sheet**: Ana Reyes · **Plan · Pro (free · launch offer)** › · Settings › · Switch shop · Sign out (27). One tap from every page. |
| 3 | One shared **Upgrade row** (reason + plan pill + ›) | `up(label, reason, plan)` in the prototype → one component. Used for: **Fully booked** (Free 3-booking cap, 28) · **Waitlist** (29) · **Seats** (38) · date-candidate ceiling ("Holding this date · 2 of 5 · Pro", 35) · categories (Shop › Services › Coverage row reads *1 of 1 on Free · Solo 2 ›*) · reach Ring-2 (Shop › Page › Reach reads *30 km free · farther on Solo ›*). Every one lands on Settings › Plan. |
| 4 | One grey **Locked row** ("Pro ›") | `lock(label, sub, plan)` — Team calendars on Free (29), API access (23), the Insights "More · Pro" fold when below Pro (09 reads it dimmed), Branch on Free (Reach). Opacity .6, plan pill, › to Plan. Never a plate, never a paragraph. |
| 5 | **Add-ons sheet** | Settings › Plan › Add-ons › (26): Vendor AI Basic · Vendor AI Advanced · Papic Challenge · 3D Booth · Branch · Deep Search — one row each: name · one line (first cycle free / free on first 5 / needs Verified) · **₱— read from the catalogue** · switch or Add/Run. "3D Booth" is now in the Add-ons label. |
| 6 | "Fully booked" on Free | Customers › People top row (28): *Fully booked · 3 of 3 bookings this cycle on Free · new asks wait* · Solo ›. Add stays visible (an outside client is free). |
| 7 | Agent / team calendars (Pro+) | Customers › Dates: the day header's dropdown **Everyone · Me · Marco · Jo** (04) + Capacity › *Calendars · Main team · Second team · one view for all*; on Free the row is the Locked row (29). The day sheet has *Who works it ▾* (35). In scope. |
| 8 | API access (Enterprise) | Settings › Plan: Locked row *API access · Enterprise · deferred* (23). Stated deferred; nothing to build. |
| 9 | Custom plan | Settings › Plan: **Build Custom ›** (Branches · reach · seats · listings) → the shipped `/subscription/custom` as a sheet (23). |
| 10 | First-5-sourced-bookings-free | Fee rows carry *2 of 5 free used* — Money (05), the quote maker's Booking fee line (39). |
| 11 | Papic credit pack | **Buy 100** (₱500, catalogue) on Settings › Plan › Papic credits (23) and on Event Hub › Papic › Buy credits (34). |
| 12 | Boost / Featured / lead priority | Settings › Plan: one status line *Boost · Featured · Makati photo · lead priority on* (23) — payers see what they get; Free reads *Boost · off · Pro ›* (Locked row). |
| 13 | App Store shell | `?v=store` (25): Plan fold is **read-only** — *Pro · 28 days · managed on the web* with a "web" pill, no Cycle, no Pay, no Buy; Add-ons rows show a "web" pill instead of a switch (26 with `&v=store`). Copy says only *"Plans are managed on setnayan.com."* — no steering wording. |

## 8 · Routes + map — every unclear item closed (the 14 route gaps)

| # | Gap | Decision |
|---|---|---|
| 1 | Notifications list | **Kept** as Settings › Notifications › **Recent** › (37) — the shipped `NotificationsList` + Mark all read, one row per item. The "Setnayan" chat thread (13) is in addition, for notices that want a reply. Both NEW-data-free. |
| 2 | Date change (J51) | **A Next-card kind** (31): title *Date change · Cruz wedding*, eyebrow pill *answer within 2 days* (the 3-day fuse), buttons **Move** (ok) · **Unlock** (grey) · Chat. Also a row in Also waiting. |
| 3 | Contracts (J26 · J27) | Customer card › **Files** (32): *Contract · Signed · e-signed by both* › · *Amendment 1 · waiting* › · *Quote · accepted* › · **Send contract** (brand; from a template or blank → the shipped `contracts/new`) · **Amend** (grey → `contracts/[id]` amendment). Templates live inside Send contract's first dropdown. The quote row shows amendments count. |
| 4 | WhatsNewFeed | **Removed as a component**; its cards become the Also-waiting rows + the Next card (the answer forms already live on the card / thread). Explicit. |
| 5 | Papic supplier (J20 · J49) | Event Hub › **Papic** fold (34): Credits (50 free with this booking) · Missions › · Album import › · Buy credits. Shop › Page › Photos keeps the portfolio (import lands there). |
| 6 | More tools — all 15 | Settings › More tools (33): Reviews · Track record · Stories · Recaps · Attributes · Your segments · Repertoire · Moodboard library (*1 declined: too dark* — J45 `rejection_reason`) · Recommend · Partnerships · Creators · Manpower · Disputes · Theft Watch · Deep Search. Rows not granted do not render (Repertoire for non-music, Moodboard without access, Your segments for non-hosts). |
| 7 | Card sub-pages (cocktail · editorial-media · production-sheet · challenge-photos) | Under the card's **Their brief** by category (Cocktail area for bar/caterer; Editorial media for stories-eligible) and under **Event Hub** (Production sheet · Challenge photos → Papic › Missions). Named in the Coverage table. |
| 8 | Thread page tools | **Kept** on the thread (36): the brief row, the chat, the **Quote** (brand) · **Book** (ok) thumb row; the stage pill in the header. `send-proposal-card`, `vendor-offer-service`, `vendor-payment-live` render as rows/sheets off those two buttons. |
| 9 | `/open-shop`, `/vendor/lock`, `/claim`, `/fit`, `/vendor-invite` | **Out of scope, unchanged** — public/token pages and the one-door sign-up (audit: 44 words, good). |
| 10 | Add sheets | Customers › Add (people/dates): *Outside client · free* · *New contract* · *New quote* · *Block a date*. Shop › Add: *New service* (the shipped `services/new` wizard / CanvasMaker) · *New package* (when the flag is on). |
| 11 | `calendar/[date]` | **Dates › day sheet** (35): the day's bookings, *Holding this date · 2 of 5*, each holder with Chat, Block this day switch, Who works it ▾. URL `?seg=dates&day=2026-10-03` (redirect from the old route). |
| 12 | Staff scoping · admin slots | In S-PR9/S-PR10 (plan rows): `filterVendorNavGroups` keeps agents to Today · Customers; renamable slots follow the rows that moved. |
| 13 | Settings route registries · account menu | S-PR9: joins the three registries; **Account ›** and **Sign out** live on the profile-picture sheet and at the top/bottom of Settings. |
| 14 | Packages when the flag is off | Shop › Services shows services and add-ons only; "What you sell ▾" has no Packages entry; Add has no New package. Package CRUD stays `/packages` (flag-gated) — nothing lost. |
| + | J47 sign-off reopen counter-handshake | Event Hub › **Hand over** row: *Delivered · couple reopened: "missing 3 files"* → Resend (ok) · Dispute (grey). |
| + | J37 suggest-a-change | Event Hub › **Schedule** › each block: *Suggest a change* (grey) → the shipped suggestion; coordinator/couple approve (L4685/L4699). |

## 9 · Map — connected (every tap lands; every screen has a way back; one thing is reached one way)

**Screen → screen** (prototype `data-go` targets; ‹ = back target):

```
Today ─ Next card ──► Thread (Reply) · Customer (brief) · Event Hub (Run the day) · Plan (date-change › Chat → Thread)
      ─ numbers ───► People · Dates · Money
      ─ Coming up ─► Customer        ─ Also waiting ► Customer        ─ Shop row ► Shop › Services
      ─ launch line► Settings › Plan
Envelope (every page) ──► Messages ──► Thread ‹ Messages
Picture  (every page) ──► Picture sheet ──► Settings · Settings › Plan · Today (switch / sign out)
Customers › People ──► Thread (asked rows) · Customer (others) · Settings › Plan (Fully booked)   thumb: search · Add
Customers › Dates  ──► Day ‹ Dates · Customer · QR codes ‹ Dates · Settings › Plan (locked/upgrade)   thumb: Block · Add
Customers › Money  ──► Customer (instalments) · Pay (fee)   thumb: Log a payment
Customer ‹ People ──► Brief rows (Mood board · Schedule → Event Hub) · Money (Log · Quote → Quote ‹ Customer) · Files (Contract · Amend · Quote) · Event Hub ‹ Customer · Notes   thumb: Chat → Thread · Quote · Payment · Call
Thread ‹ Messages ──► Customer (brief) · Quote ‹ Customer   thumb: Quote · Book
Event Hub ‹ Customer ──► Schedule · Headcount · Scan ⌄ · Shot list · Papic ⌄ (Missions · Import · Buy) · Tell · Hand over · My tools ⌄   thumb: Scan · Papic · Tell
Shop › Services ──► row = edit sheet · Coverage › · thumb: search · Add (New service)
Shop › Page ──► Verified · Profile · Look · Photos · About · Reviews · Reach · Auto-reply   thumb: View page · Apply
Shop › Insights ──► rows · How you're doing ⌄ · More · Pro ⌄ (Locked row below Pro → Plan)
More sheet ──► Event Hub · Settings · Settings › More tools
Settings ‹ Today ──► Account · Notifications ⌄ (Recent ›) · Plan ⌄ (Add-ons ‹ Settings · Buy · Build Custom) · Getting paid ⌄ · Team ⌄ · More tools ⌄ (15 ›) · Sign out
```
**One thing, one way:** a customer's chat is the same Thread from Today's Reply, the People row, the card's Chat, the envelope, and the day sheet's Chat. Plan is the same Settings › Plan fold from the picture sheet, Today's launch line, every Upgrade and Locked row, and Insights. The Event Hub is the same page from Today's Run the day, the card's row, and More.

**Supplier Ugat joints → where the supplier sees / acts on them** (`lib/ugat/graph.ts`, claims read from the tables each joint names):

| Joint | Tables | Screen |
|---|---|---|
| J4 team | `vendor_team_members` | Settings › Team (38); Dates day header "Everyone · Me · …"; day sheet *Who works it* |
| J5 threads | `chat_threads` (event × shop UNIQUE) | Messages (13) · Thread (36) — one per customer per event |
| J7 bookings | `event_vendors` | People stage pills · Money instalments · Customer card header |
| J8 attributes | `vendor_service_attributes` | Settings › More tools › Attributes; Shop › Services row edit |
| J10 subscriptions | `vendor_subscriptions.tier` | Settings › Plan (23–25) · picture sheet (27) · every Upgrade/Locked row |
| J24 packages | `vendor_package_items` / `_options` | Shop › Services (package rows, flag-gated) · Quote › Package ▾ |
| J25 proposal templates | `vendor_proposal_templates` | Quote maker › Package ▾ "from a template or blank" (39) |
| J26 amendments | `proposal_amendments` | Customer › Files › Amendment rows · Amend (32) |
| J27 contracts | `vendor_contracts` | Customer › Files › Contract · Send contract (32) |
| J28 reviews | `vendor_reviews` | Shop › Page › Reviews · Today Next kind *review* · Insights › How you're doing |
| J29 schedule pools | `vendor_schedule_pools` (capacity · is_active) | Dates › Capacity › Calendars · Events a day (04) |
| J30 pool bookings | `vendor_schedule_pool_bookings.booked_date` | Dates month grid · day sheet (35) |
| J32 verification | `vendor_verification_applications` · `verification_state` | Shop › Page › Verified fold (08) — the one place |
| J33 Instagram | `vendor_ig_connections` · `vendor_ig_media` | Shop › Page › Photos › Instagram (08) |
| J34 branches / coverages | `vendor_branches` · `vendor_coverages` · `vendor_services` | Shop › Page › Reach · Services › Coverage row · Add-ons › Branch |
| J37 schedule blocks + suggestions | `event_schedule_blocks` · `event_schedule_suggestions` | Event Hub › Schedule › Suggest a change · Customer › Brief › Schedule |
| J45 moodboard library | `moodboard_library_assets` (+ rejection reason) | Settings › More tools › Moodboard library *1 declined: too dark* (33) |
| J47 part finalizations / sign-off | `moodboard_part_finalizations` · sign-off | Event Hub › Hand over (reopen → Resend / Dispute) |
| J48 colour grants | `event_colour_grants*` | Customer › Brief › Mood board › (view / suggest by grant) |
| J49 Papic grants · captures | `vendor_papic_*` | Event Hub › Papic fold (34) · Plan › Papic credits |
| J51 date change | `event_date_change_requests` / `_answers` | Today Next card *Date change* Move / Unlock (31) · Also waiting |

## 10 · Efficient for a business owner — the ten jobs, taps from Today

Taps counted from the shipped code (origin/main, phone): a tap = one press that changes the screen or opens a control; typing is not counted. Redesign taps counted on the prototype.

| Job | Today (shipped) | Redesign | ≤3? |
|---|---|---|---|
| Reply to an inquiry | Next card › Reply → thread → type → Send = **2** (then the thread's accept-to-reply step on a new inquiry: **3**) | Next card › **Reply** → thread → Send = **2** | ✓ |
| Send a quote | Customers › row › card › Quote & Payments tab › New quote › builder › Send = **6** | Thread (or card) › **Quote** → Send = **2–3** (Today › Reply › Quote › Send = 3) | ✓ |
| Agree to a booking | Next card "Agree to this booking" › card (details tab) › Agree in the ask block = **2–3** | Next card › **Agree** = **1** (when it is next) · People › row › Book = 3 | ✓ |
| Log a payment | Customers › row › card › Log payment › form › Save = **5** | Money › row › **Log a payment** = **3** (card thumb row › Payment = 3) | ✓ |
| Block a date | More › Calendar › (scroll to hub #calendar) › Availability fold › block form › Save = **5–6** | Customers › Dates › **Block a date** = **3** (day sheet: Dates › day › switch = 3) | ✓ |
| Answer a date change | Next card › "#today-all" › scroll › date-change card › Move/Unlock = **3–4** | Next card › **Move** / **Unlock** = **1** | ✓ |
| Run the day / scan | More › Event Hub › "Launch the app" › console › (scanner only via desk tile / not built) = **4+** | Next card › **Run the day** › **Scan** = **2** | ✓ |
| Edit a price | Shop › Your services › Service cards tab › Edit details ‹details› › price field › Save changes = **5** | Shop › **Services** › row › price = **3** (autosave on close) | ✓ |
| Check money owed | Today "owed to you" tile › payday fold = **1** (tile) — but the figure vanishes silently on a failed read | Today number **₱48k to come in** = **0** (read) · tap = Money = **1**; failure says "couldn't load" | ✓ |
| Share the QR | Shop › first-steps "Get my QR codes" / Customers › ⋯ › … › /invite › mode toggle › share = **4–5** | Customers › Dates › **QR codes** › **Share** = **3** (Shortlist is the default) | ✓ |

Nothing is over three. The two that cost most today (quote: 6 → 2; block a date: 5–6 → 3) fall because the verb sits in the frosted thumb row of the page the owner is already on, instead of behind a tab, a fold and a form.

## 11 · Coverage — every route · plan feature · Ugat node → its home (zero blanks)

**Routes (`app/vendor-dashboard/*` on origin/main)**

| Route | Home in the redesign |
|---|---|
| `/` (Today) | Today (01 · 02 · 15 · 22 · 31) |
| `/customers` | Customers › People (03) |
| `/calendar`, `/calendar/[date]` | Customers › Dates (04) · day sheet (35) — redirects |
| `/bookings`, `/clients` (index), `/payday`, `/earnings`, `/messages` (index) | Customers › People · Money (05) · Messages (13) — redirects |
| `/messages/[threadId]` | Thread (36) |
| `/clients/[eventId]` (+ `calendar.ics`) | Customer card (06 · 19 · 32); .ics in Brief › Schedule |
| `/clients/[eventId]/cocktail`, `/editorial-media`, `/mood-board`, `/seat-plan` | Customer › Their brief rows (by category / grant) |
| `/clients/[eventId]/production-sheet`, `/challenge-photos` | Event Hub › Schedule · Papic › Missions |
| `/proposals`, `/contracts`, `/contracts/new`, `/contracts/[id]` | Quote maker (39) · Customer › Files (32) |
| `/invite`, `/locked-qr` | QR codes (10 · 40) |
| `/on-the-day`, `/on-the-day/live/[eventId]`, `…/papic` | Event Hub (12 · 20 · 34) |
| `/shop`, `/profile`, `/services`, `/services/new[/category]`, `/payment-options`, `/branches`, `/website`, `/lines`, `/verify` | Shop › Services (07) · Page (08) · Settings › Getting paid (14) — redirects |
| `/packages`, `/packages/[id]` | Shop › Services package rows (flag-gated) |
| `/performance`, `/demand` | Shop › Insights (09 · 18) — redirects |
| `/subscription`, `/subscription/custom` | Settings › Plan (23–25) · Add-ons (26) · Build Custom |
| `/team` | Settings › Team (38) |
| `/notifications` | Settings › Notifications › Recent (37) |
| `/more` | More sheet (11) |
| `/reviews`, `/track-record`, `/real-stories`, `/recaps`, `/attributes`, `/activities`, `/repertoire`, `/moodboard-library`, `/recommendations`, `/partnerships`, `/creators`, `/manpower`, `/disputes`, `/theft-watch`, `/deep-search` | Settings › More tools (33), grant-gated; Reviews also Shop › Page |
| `/booking-fees` | Customers › Money › Setnayan (05 · 30) |
| `/open-shop`, `/vendor/lock`, `/claim`, `/fit`, `/vendor-invite` | Out of scope — public/token pages and the one-door sign-up, unchanged |

**Plan features (`TIER_CAPS` / catalogue offerings)**

| Feature | Home |
|---|---|
| Plan picker · cycle · renewal · pay | Settings › Plan (23) |
| Launch offer (B) · 50 credits per fee-free booking | Plan (23 · 24) · Today line (22) · fee row (30) · Event Hub › Papic (34) |
| Booking fee · first-5 free · waived rows | Money › Setnayan (05) · quote fee line (39) · Customer card fee row |
| Categories cap · listings cap · photos cap | Services › Coverage row · Add (Upgrade row) · Page › Photos (Upgrade row) |
| Date-candidate ceiling · waitlist · Free 3-booking cap | Day sheet (35) · Dates (29) · People (28) |
| Reach Ring-2 · Branch · seats · agent calendars | Page › Reach · Add-ons › Branch · Team (38) · Dates header + Locked row (29) |
| Analytics tiers · market intel | Insights (09) · More · Pro fold (Locked below Pro) |
| Vendor AI Basic/Advanced · Auto-reply · Voice | Add-ons (26, bought) · Shop › Page › Auto-reply row (08, switched on) |
| Papic Challenge · 3D Booth · Deep Search · Papic credit pack | Add-ons (26) · Plan › Buy 100 (23) |
| Boost / Featured / lead priority | Plan status line (23) |
| Custom plan · API | Plan › Build Custom · Locked "deferred" (23) |
| Verified · reviews · stats | Page › Verified (08) · Reviews · Insights |
| App Store shell | Plan read-only (25) · Add-ons "web" pills |

**Ugat nodes**: TYPE-VENDORS → Shop › Page + Settings; TYPE-SERVICES → Shop › Services; TYPE-THREADS → Messages / Thread; TYPE-BILLING → Settings › Plan + Money › Setnayan; TYPE-PACKAGE → Services; TYPE-PROPOSAL → Quote maker; TYPE-CONTRACT → Customer › Files; TYPE-AVAILABILITY → Dates; TYPE-PAPIC → Event Hub › Papic; TYPE-RUNOFSHOW → Event Hub › Schedule; TYPE-SIGNOFF → Event Hub › Hand over; TYPE-COLOURGRANT → Customer › Brief › Mood board; TYPE-GALLERY → Shop › Page › Photos; TYPE-TAXONOMY → Services › Coverage; TYPE-EVENTS / TYPE-GUESTS → Customer › Brief (read by grant). Joints J4–J51 above.

**New owner questions from round 2 (one word · recommendation):** none that the corpus does not already answer. One flag, not a question: the launch-offer counter needs the admin config page the 2026-10-08 ruling names — it is NEW code (S-PR9 reads it; the admin page is the Admin build's).
