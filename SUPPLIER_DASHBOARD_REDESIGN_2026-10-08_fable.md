# Supplier dashboard — the same rules as the event dashboard

**2026-10-08 · Fable (designer) · design + prototype only. No app code, no PRs, no database writes.**
Owner, verbatim: *"with the same rules as our event dashboard. are there any improvement that we can do for the supplier dashboard?"* · *"once you have spotted them, you can use fable to redesign the supplier dashboard"* · on the More sheet: *"including these"* · *"or maybe a better way to plot them neatly on our supplier dashboard?"*
Build order (locked 2026-10-08): Event Hub → couple's Suppliers page → **supplier dashboard (this)** → Admin. Nothing is built until the owner approves the prototype.

Prototype: `prototypes/supplier_dashboard_2026-10-08_fable.html` (gallery of 15 live phone frames + 3 dark; `?s=<frame>` opens one alone, `&dark=1`, `&open=<row>`).
Screenshots (375 px): `prototypes/supplier_dashboard_2026-10-08_fable/00-contact-sheet.jpg` + `01…21-*.jpg`.
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

**More (B) = Event Hub · Settings · More tools.** Three rows. "More tools" is the shelf a small phone supplier should not see by default: Recommend · Partnerships · Creators · Theft Watch · Disputes · Deep Search · Recaps · Stories (today's `shop-tool-shelves.ts`, kept, one row each, no sentences).
**More (A)** = the same six rows the owner's screenshot shows, tidied: subs cut to 1–3 words, Notifications + Plan folded into Settings. Both are in the prototype (frames 10 and 11) and the sheet has an A/B switch.

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

| # | Question | Recommend | Why |
|---|---|---|---|
| 1 | **Re-plot?** A (keep the six-row More, tidied) or B (Calendar/Money → Customers, Insights → Shop, Messages → envelope, Settings → avatar; More = Event Hub · Settings · More tools) | **B** | Three of the six rows are already redirects into Customers; B removes a hop from every one of them and keeps the bar the owner approved. More › Event Hub stays, so the 2026-10-03 scan ruling holds. |
| 2 | **Name?** the money segment: "Money" or "Earnings & payday" / "Money in" | **Money** | One word; it holds both what came in and what is due, plus Setnayan fees. |
| 3 | **Pro?** Insights for a free shop shows three rows + health; the 13 Pro cards fold under "More · Pro ⌄" | **Fold** | A phone supplier sees what a couple sees (reply time, rating) and never a wall of charts. |
| 4 | **Flag?** retire `NEXT_PUBLIC_RELATIONSHIP_WORKSPACE_ENABLED` (the 7-tab shell) and ship the one row-card | **Retire** | Two cards for one customer is the same fact in two places; the flag has been OFF in prod. |
| 5 | **Settings?** the avatar opens Settings (and More lists it too) | **Avatar** | Every phone app; the More row stays for the first week so nobody loses it. |

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
| **S-PR9** | **Settings** route (Account · Notifications · Plan · Getting paid · Team · More tools · Sign out) composed from `notifications/`, `subscription/`, `payment-options/`, `team/`, `shop-tool-shelves.ts`; the avatar door; route registries. | new `settings/page.tsx` + the four surfaces | none |
| **S-PR10** | **More** sheet = B (or A if the owner says so): `vendor-more-rows.ts` rewritten; `VENDOR_MORE_MATCH`; tour slide. | `lib/vendor-more-rows.ts`, `more/` | none |
| **S-PR11** | **Event Hub** as rows: `on-the-day/page.tsx` + `live/[eventId]` → one page; setup/preview views removed; specialization sets as My tools; thumb Scan · Papic · Tell; fee row. The Scan row's mode/upload = S2's build (its own prototype, approved 2026-10-03). | `on-the-day/` (shrinks) | none here (S2 owns its migration) |
| **S-PR12** | Extras sweep: the 15 small pages to rows + one dropdown + honest empty; words (celebration/wedding/website/store/vendor); `track-record` duplicate; `manpower` stays on the supplier side. | `recommendations/ … reviews/` | none |

Each PR: typecheck · lint · unit from `apps/web` · the repo guards · one sabotage seen red; draft PR, `do-not-auto-merge`, owner ok on the side-by-side first. If a step needs a migration or a protected guard the plan does not name: stop and report.
