# Map — the couple's HOME (event dashboard) at 375 px

Source: archive of origin/main under `apps/web/app` (paths below are relative to `apps/web/app/dashboard/`), `apps/web/lib` read with `git show origin/main:`. Symbols only, no line numbers. "NOT FOUND" where I could not confirm.

## 0. Which "Home" is which

There are TWO things called Home. They are different pages.

| Where the couple taps | Label | Opens | Component |
|---|---|---|---|
| Phone bottom bar INSIDE an event (the Home tab) | "Home" (SetnayanMark icon) | **The event Home** `/dashboard/[eventId]` | `[eventId]/_components/customer-bottom-nav.tsx:CustomerBottomNav`, rows from `lib/customer-menu.ts:buildCustomerMenuTree` (key `home`, `activeMatch` = base + `/checklist`, `activeMatchExact`) |
| Phone bottom bar on the account launcher | "Home" (LayoutGrid icon) | The account home `/dashboard` (events board) | `(launcher)/_components/home-pill-nav.tsx:HomePillNav` |
| Inside an event, the account menu row | "Home · all your events" | `/dashboard` | layout `homeLabel` → `_components/account-switcher/account-switcher.tsx:AccountSwitcher` |
| Inside an event on laptop (rail) | "Events" | `/dashboard` | `[eventId]/layout.tsx` `focus={{ href:'/dashboard', label:'Events' }}` |

So: **the bottom-nav "Home" tab inside an event opens the EVENT Home** (`[eventId]/page.tsx:EventHomePage`). The account-level `/dashboard` (`(launcher)/page.tsx:LauncherPage`) is a separate page, mapped in section 8.

The event Home has THREE bodies chosen by the lifecycle phase (`lib/day-of-mode.ts:getMenuLifecyclePhase`, resolved in `EventHomePage` as `lifecyclePhase`, `dayOfActive`, `afterActive`):
- **plan (normal)**: `HomeFirstScreen` and nothing else. (The old full dashboard is NOT mounted here.)
- **day-of** (T-12h..T+36h): live grid + live desk link + receded full dashboard in a `<details>`.
- **after**: `FinishedEventSummary` + receded full dashboard in a `<details>`.

Phone chrome around every event page (same on all three bodies): top bar = messages badge, bell badge, account switcher (`[eventId]/layout.tsx:topBar`: `UnreadMessagesBadge`, `UnreadBellBadge`, `AccountSwitcher`); bottom dock = `BottomDock` > `CustomerBottomNav` (five pillars, see 2b). No floating button. Page padding clears the dock (`data-shell-main`).

---

## 1. Top-to-bottom outline — PLAN phase (what 99% of visits see)

Wrapper: `[eventId]/page.tsx:EventHomePage` wraps everything in `app/_components/last-seen/last-seen-capture.tsx:LastSeenCapture page="home" fresh={guestsMeasured}` (kept on the phone and shown at once, then refreshed; peso figures carry `data-money` and are masked in the kept copy; a refused guest read is not kept).

Always above the body, each self-hiding:
1. `MiniTour tourKey="customer_event_menu_v1" after="couple_welcome_v1"` (`app/_components/mini-tour.tsx`). **Renders nothing today**: `lib/tip-popups.ts:TIP_POPUPS_ON = false` (constant, owner 2026-10-03).
2. `app/_components/event-day-prep-cta.tsx:EventDayPrepCta` — only T-3d..T+1d and not finished: banner "Prepare for event day" (button), states Pre-loading… / "Ready for event day — works offline" / "Pre-load failed" + "Try again".
3. `_components/access-requests-doorway.tsx:AccessRequestsDoorway` — card link, only when a coordinator request is pending ("Your coordinator is asking for access" / "N access requests are waiting"); on a failed read it shows "We couldn't check for access requests" (honest).
4. `_components/date-change-doorway.tsx:DateChangeDoorway` — only when the couple asked booked suppliers to move the date. Failed read prints "We couldn't check whether a date change is waiting. Reload to try again." (honest).
5. `app/_components/auto-preload-on-event-day.tsx:AutoPreloadOnEventDay` — invisible.
6. layout-level: `CohostWelcome` ("You are now a co-host…" + Confirm button) and `PromoFreeWindowBanner` sit above `{children}` in `[eventId]/layout.tsx`.

Then, in order, `_components/home-first-screen.tsx:HomeFirstScreen` (`<section data-home-first-screen aria-label="Home">`):

| # | Part (as rendered) | Component:symbol | Shows |
|---|---|---|---|
| ① | **Cover band** | `HomeFirstScreen` (`data-home-cover`) | Eyebrow `"{Type} · {date}"` (or type only), the event name (fallback "Your {Type}"); sr-only `<h1>`; wears the Event Hub's main background (`lib/home-cover.server.ts:homeCoverFor`, failed read keeps the plain mulberry colour). |
| ①a | **Event Details** pill (right end of the cover) | `HomeFirstScreen` `data-home-event-details` | link to `/details`. |
| ② | **Your next step** card — exactly one | `app/_components/next-card.tsx:NextCard` (marker `data-home-next`); the kind is chosen by `lib/home-first-screen.ts:pickHomeNext` over `HOME_NEXT_ORDER` = guide · date · guests · invite · papic · ai · plan | Eyebrow "Your next step", title, body, ONE filled button, and (only the Hub-setup offer) a "Later" underline button. |
| ③ | **Edit your Event Hub** | `HomeFirstScreen` `data-home-edit-hub` | outline pill link to `/launch` (the Maker). Always there. |
| ④ | **Three numbers** | `HomeFirstScreen` `data-home-numbers` | days to go · coming · no reply (see 4). |
| ⑤ | **Money line** — Paid / Still owing | `HomeFirstScreen` `data-home-money` | One link card to `/budget`. Absent entirely when the budget is not shared with the viewer. |
| ⑥ | **What's next** row | `HomeFirstScreen` `data-home-whats-next` | 48 px link row with chevron → `?sheet=next` (opens the sheet below). |
| ⑦ | **Your services** | `HomeFirstScreen` `data-home-services` (`<nav aria-label="Your services">`) | 2-column grid of link tiles: Papic · Setnayan AI · (Muslim wedding only) Nikah essentials, each with a one-line status. Never the one that is today's Next card. Empty in the store shell except Nikah. |

Opened on demand (only while `?sheet=next` is in the URL):
- `_components/whats-next-sheet.tsx:WhatsNextSheet` (portal to body, `Sheet wide rise`, title "What's next"; closing does `router.replace('/dashboard/[eventId]')`) holding `_components/event-dashboard.tsx:EventDashboard only="whatsnext"`, which draws ONLY:
  - **Decisions waiting on you** (`<section id="decisions">`): heading + gold "N open" chip; (Setnayan-AI-active only) "Ranked by what closes soonest."; `FreeVenueShortlistOffer` (card or inline) when eligible; groups via `renderDecisionGroup` — **Book a supplier**, **Pick an option**, **Settle a payment**, **Fill a role** (and, AI only, **Dates coming up**); each group is an `<article>` with a rank number (AI) or an item-count chip (free); each item row = `InspectorTrigger` link: label, date chip, sub-line, a pill-styled outline "CTA" (a styled span inside the row link; one filled "Today's one thing"). Empty state: "Nothing needs a decision right now — your plan keeps moving on its own."
  - text link "View your full checklist →" + chip "N% done".
  - **Coming up** (`<section id="coming-up">`): AI-active events only (`aiActive`); "N dates" chip; the dated group.
  - Without the inspector column (a row just opens its room).

What the plan-phase Home does NOT mount (it was removed 2026-10-02): SetDateNudge, PapicReadyNudge, SetnayanAiComebackOffer, tea-ceremony tile, "Plan next year" form, the Big-Day focal, minis, Around-your-event. Those are only reachable in the receded views (section 6) — `overlays` in `EventHomePage` is passed only to the day-of and after branches. (`homeNext.kind` already hides the one that is today's Next.)

### Next-card variants (`pickHomeNext`, exact copy)
| kind | Title | Button | Door |
|---|---|---|---|
| guide (offer) | "Finish your Event Hub — N of M" | "Start" (+ "Later") | `/launch?tool=details&guide=1` |
| guide (slim) | same title; body "Next: {stage} — x of y in place" | "Pick a stage" | same |
| date | "Set your {wedding/event} date" | "Set your date" | `/date-selection` |
| guests | "Add your guests" | "Add guests" | `/guests` |
| invite | "Send N invitation(s)" | "Send invitations" | `/guests/send` |
| papic | "Your free camera is ready" | "Open {papic plain name}" | `/studio/papic` |
| ai | "{AI plain} · {brand}" | "See the {…}" | `/studio/setnayan-ai` |
| plan | "You are on track" / "Nothing is waiting on you right now. Your checklist has the rest of the plan." | "Open your checklist" | `/checklist` |

---

## 2. Doors — where each thing sends the couple

### 2a. Home body (plan phase)
| From | To | Component:symbol |
|---|---|---|
| "Event Details" pill | `/dashboard/[id]/details` | `HomeFirstScreen` |
| Next card button | per table above | `HomeFirstScreen:nextHref` |
| "Edit your Event Hub" | `/dashboard/[id]/launch` | `HomeFirstScreen` |
| Money line | `/dashboard/[id]/budget` | `HomeFirstScreen` |
| "What's next" row | `/dashboard/[id]?sheet=next` (sheet, same page) | `HomeFirstScreen` + `WhatsNextSheet` |
| Services tile Papic / Setnayan AI / Nikah essentials | `/studio/papic` · `/studio/setnayan-ai` · `/nikah` | `HomeFirstScreen:serviceHref` |
| Sheet decision row (any group) | the row's own room (`item.href`: vendors / orders / roles / meeting etc.) | `renderDecisionGroup` in `EventDashboard` |
| Sheet "View your full checklist →" | `/checklist` | `EventDashboard` |
| Sheet "Settle a payment" rows | order/payment room (`item.href`) | `EventDashboard` |
| Doorway cards | `routes.dashboard.accessRequests(id)` · `/launch?tool=details` (date change Apply) | doorway components |

### 2b. The five pillars (bottom dock, phone)
`lib/customer-menu.ts:buildEventMenuSections` → `buildCustomerMenuTree`:
| Tab | Label (default) | Door | Gating |
|---|---|---|---|
| Home | Home | `/dashboard/[id]` | always (hide-able by admin nav slot) |
| Guests | Guests (+ count badge via `lib/nav-badges.ts:customerGuestsBadge`, hidden at 0/unknown) | `/guests` (also lights for `/hosts`, `/event-qr`, `/people`) | always |
| Suppliers | Suppliers | `/vendors` (`?tab=build` after the event; also lights for `/budget`) | hidden when `profile.marketplaceEnabled` false (`navHideKeys` in layout) |
| Hub | Hub | `/launch` (lights for `/website`, `/story`, `/schedule`, `/seating`) | only when `websiteEnabled` (event-type profile) |
| More | "More Services" (label `More` when `SUITE_NAV_ON`), else "Studio" | `studioHubHref` = Home with `?more=services`; opens `more-services-sheet.tsx:MoreServicesSheet` | label/behaviour depends on `NEXT_PUBLIC_SUITE`; sheet opens only when `services` exist |
Admin can relabel/hide each via `navSlots` (`customer.bottom-nav.{key}`).

---

## 3. Actions — every control on the plan-phase Home

| Label | Kind today | What it does | Where |
|---|---|---|---|
| Event Details | text pill **link**, no icon | opens Event Details | `HomeFirstScreen` |
| {Next action} (Start / Pick a stage / Set your date / Add guests / Send invitations / Open … / See the … / Open your checklist) | filled pill **link**, no icon | goes to the Next door | `NextCard` |
| Later | **button** (underline text, no icon), form action `completeTour(HUB_SETUP_OFFER_TOUR)` | marks the Hub-setup offer answered | `NextCard` `data-next-later` |
| Edit your Event Hub | outline pill **link**, no icon | opens the Maker | `HomeFirstScreen` |
| Paid / Still owing card | **link card** | opens Budget | `HomeFirstScreen` |
| What's next › | **link row** (chevron icon) | opens the sheet | `HomeFirstScreen` |
| Papic / Setnayan AI / Nikah essentials tiles | **link cards** (no icon) | open that service | `HomeFirstScreen` |
| Sheet close (Sheet's own X / scrim / swipe) | `Sheet` chrome | `router.replace(closeHref)` | `WhatsNextSheet` |
| Sheet decision row + its CTA ("Open…", "Pay…", etc.) | whole row is a **link**; the CTA is a **span styled as a pill** (not a control) | goes to that room | `renderDecisionGroup` |
| Sheet "View your full checklist →" | **text link** with arrow | `/checklist` | `EventDashboard` |
| Prepare for event day / Try again | **button** (icon + word) | pre-loads offline bundle | `EventDayPrepCta` |
| Doorway buttons: Keep waiting · Drop {supplier} · Withdraw / Cancel the change — keep my date | **buttons** (`SubmitButton`; the last is an underline text button) | date-change answers | `DateChangeDoorway` |
| Every supplier answered — Apply {date} in your Event Hub | pill **link** | opens Hub Details | `DateChangeDoorway` |
| Bottom dock tabs | tab links (icon + word) | pillar doors | `CustomerBottomNav` |

Receded-view only (day-of / after): see section 6 actions.

---

## 4. Numbers, counts, percentages, meters

### Plan-phase Home (`HomeFirstScreen`; all STATIC — no count-up, no ring, no animation; only `sn-press` press state and the sheet "rise")
| Number | Source | Failure rendering |
|---|---|---|
| Days to go (or words "Today"/"Tomorrow", "N days ago"→ shown as days) | `lib/home-facts.ts:homeFacts` → `glanceDaysToGo`; month/year-precision dates give "—" | "—" |
| coming | `computeGuestStats().attending` via `lib/guests.ts:fetchGuestsByEventMeasured` | "—" when unmeasured (`glanceCount`) |
| no reply | `stats.pending`; terracotta when > 0 (`noReplyWaiting`) | "—" |
| Paid / Still owing | `lib/budget-live-read.ts:readBudgetLiveSummary` (the Budget page's own `budgetLiveSummaryMoney`) → `paid`, `remaining` | "—" each; `'hidden'` (budget not shared) → no card |
| Next-card counts ("N of M", "Send N invitations", "N of M guests not sent") | `readHomeGuide` / `homeGuestsRead` | see section 7 |
| Service statuses | `papicStatus` ("Open" · "Not added" · "Free camera ready" · "On · N photos" · "—"); `aiStatus` ("On" · "Try it" · "Comeback price · Nh left" · "—"); `nikahStatus` ("N of 4 in place" · "—") | "—" |
| Sheet: "N open" chip, group item counts / rank numbers, "N% done", "N dates" | `buildCockpitModel`, `fetchChecklistProgress`, upcoming items | chip hidden on failed checklist read; see section 7 |

### Receded dashboard (day-of / after) — has the animated ones
- `CountUp` (animates up): days to go (focal, 700 ms delay), "Needs you this week / Still open" open-decision count (300 ms), Guests mini attending, Papic mini, Messages mini unread (700 ms).
- `ProgressRing` (sweep animation, 600 ms): Budget mini "% committed" (`budgetPct`).
- Segmented RSVP bar in the Guests mini (`rsvpSegments`).
- Cards: Hosts "N accounts", Suppliers "x of 21 booked" (wedding) / "N vendors booked", Your services "N orders", Messages "N unread".

---

## 5. Choice-sets

On the plan-phase Home: **NONE.** No dropdown, no pill row, no tabs. (The five-pillar bottom bar is navigation, not a choice set.)
- Next card: ONE button (+ optional Later). Good.
- Services: a grid of 2–3 link tiles (navigation, not a set to pick from).
- Receded views: no choice sets either (ExpandCard accordions only).
- Account launcher (section 8): the "Why are you removing it?" reason is a real `<select>` dropdown (`event-card-menu.tsx`); the Planning pager `CollectionPager` is a row of page links (numbered pill row = a set of choices, but it is pagination); "Show the N I put away" is a toggle-styled link.

---

## 6. Receded views (day-of and after) — what else the Home can render

Both: a `<details className="sn-tile">` "Planning tools — still here if you need them" holding the WHOLE `EventDashboard` (hero, focal, minis, decisions, coming up, meanwhile, around-your-event) plus the `overlays` slot. Summary line is a native `<summary>` (text, no icon).

**Day-of** (`DayOfModeGrid`, `day-of-mode/grid.tsx`): `DayOfModeBanner` (dismiss-for-1-hour icon button), dashed link "When the day winds down, close it out" → `/clearance`, cards: What's happening now (`whats-happening-card`) · Your table (→ `/seating`) · Live photo wall (→ `/wall/[id]`, only if `LIVE_WALL` owned) · Live schedule (→ `/schedule`) · Coordinator broadcast (buttons; only if `isCoordinatorP3Enabled()`) · "Something not right?" help card (same-day suppliers, → `/help`). Then link card "Open the live desk" → `/live`.

**After** (`after/finished-event-summary.tsx:FinishedEventSummary`): "That's a wrap — {date}" with six link cards: Overview ("Open your page" → the Home itself), Guests, Suppliers (→ `/vendors?tab=build` or `/vendors`), More Services, Galleries ("Open the photos"), Story ("Open the editorial maker"). A figure that was not measured is simply omitted (`Figure` returns null).

**Overlays (only here)**: `set-date-nudge.tsx:SetDateNudge` (when no date; localStorage dismiss, X icon button + "Set your date" anchor) · `papic-ready-nudge.tsx:PapicReadyNudge` ("Your free camera is ready", dismiss X) · `setnayan-ai-comeback-offer.tsx:SetnayanAiComebackOffer` (purchase pitch; absent in store shell / paywall off / owned) · tea-ceremony tile (Chinese wedding; link to `/guests/tea-ceremony`) · "Make it an annual tradition" form with "Plan next year" `SubmitButton` (`planNextYearEvent`, recurring types only).

**Receded `EventDashboard` ordering** (`EventDashboard` with no `only`): header "Kumusta, {name} · welcome back" + `<h1>` "Your {wedding} is taking shape. Here's today." → section "The {wedding} day" (focal tile: `EventScene` photo, date, venue/lock status, big countdown, AI-only "Sai · your briefing" + "Setnayan AI · The Watch · N" rows) + right column ("Needs you this week" count tile with "Open the list ↗", "N guests haven't replied yet →" row, up to 4 mini tiles: Guests "Open the roster →", Budget "Open budget & payments →", Schedule "Full program →", Papic "Open Papic →", Messages "Open threads →"; max 4, Papic ranked above Messages) → "Today's one thing" tile (AI only, only when the board does not carry it) → overlays → Decisions (above) → Coming up → "Meanwhile" (a supplier delivered something; link "Look →/Open →/Read →") → **Around your event**: ExpandCards **Hosts** (fullLabel "Set access in People with access"), **Suppliers** ("Manage suppliers"), **Messages** (non-expand, "Open threads →"), **Your services** ("Open orders"), **Schedule** ("See full schedule"); footer "Suppliers always appear by company — never a personal profile." + "See all recent activity →" (`/activity`).
`ExpandCard` (`_components/expand-card.tsx`): the title is an accordion **button** (chevron), one open at a time (`useOneOpen`); `fullHref` is a trailing **text link** "…→".

Receded actions (label · kind · does):
- Planning tools summary · native `<summary>` · expands.
- Open the list ↗ · text anchor (`#decisions`) · scroll.
- N guests haven't replied yet → · link row · `/guests`.
- mini tiles' footers "Open the roster →" etc. · whole tile is a link; foot is a span.
- ExpandCard title buttons · button · expand; "Manage suppliers →", "Open orders →", "See full schedule →", "Set access in People with access →" · text links.
- Coordinator broadcast buttons, banner dismiss · buttons.

---

## 7. Feature flags / switches that change what renders

| Switch | Where read | Effect on the event Home |
|---|---|---|
| `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED` (`lib/explore-replan-flag.ts:isExploreReplanEnabled`) | read in `vendors/*` and `lib/budget-build.ts` | **No effect on the Home.** I found no read of it in `[eventId]/page.tsx`, `home-first-screen`, `EventDashboard` or the layout. It shapes the Suppliers page only. (Also grep'd: `nav/sidebar-item.tsx` matches `budget-build`, not this flag.) |
| `NEXT_PUBLIC_BUDGET_TRUTH_ENABLED` (`lib/budget-truth-flag.ts:isBudgetTruthEnabled`) | `lib/budget-live-read.ts:readBudgetLiveSummary` | Changes the SOURCE of Paid / Still owing on the Home (and the `guardMoney` handed to the Sai watch). Off = legacy `buildBudgetLiveSummary`. |
| `TIP_POPUPS_ON` (`lib/tip-popups.ts`, constant `false`) | `MiniTour` / `GuidedTour` | The first-visit tours on Home render NOTHING today (`customer_event_menu_v1`, `couple_welcome_v1`). Words stay in `lib/tours.ts`. |
| `NEXT_PUBLIC_SUITE` (`lib/studio-hub.ts:SUITE_NAV_ON`) | `lib/customer-menu.ts` | Fifth tab label "More Services"/"More" vs "Studio". |
| Setnayan AI paywall (`resolveSetnayanAiPaywallEnabled`, `lib/integration-config`) | `EventHomePage`, `EventDashboard` | Paywall off or unreadable → AI service tile "—" / hidden offer; AI-active gates "Coming up", ranking, briefing, watch. `aiStatus(null)` = "—". |
| `cockpitEnabled()` (owner kill switch) | `EventDashboard` | AI cockpit (ranked board, briefing, watch) off. |
| `isLockHandshakeEnabled()` | `EventDashboard` → `buildCockpitModel` | Decision rows for the lock handshake. |
| `isCoordinatorP3Enabled()` | `EventHomePage` (day-of) | Broadcast card present or not. |
| Store shell (`lib/request-platform.ts:isStoreShellRequest`) | `EventHomePage`, `homeServices`, menu | Hides Papic and Setnayan AI service tiles, the AI offer, and paid-feature gates in the app-store build. |
| Event-type profile (`lib/event-type-profile.ts`: `marketplaceEnabled`, `surfaceEnabled('website'/'seating'/'monogram')`) | layout, `EventDashboard` | Hides Suppliers tab, Hub tab, supplier cards; vendor-free types see no venue offer. |
| `PROMO_FREE_WINDOWS_ENABLED` | `PromoFreeWindowBanner` | Banner above the page. |
| Membership/role | `readHomeGuide` (couple only), `papicViewerRead`, budget visibility | Guide card for couples only; services "Open" for non-couples; no money line when budget not shared. |
| Event facts | `isMuslimWedding` → Nikah tile; `isChineseWedding` → tea tile; `canPlanNextYear` → annual form; no date → date Next | |

Launcher only: `NEXT_PUBLIC_DEPENDENT_PEOPLE`, `NEXT_PUBLIC_PEOPLE_CONNECTIONS`, `accountAutosurfaceEnabled()` (`lib/account-autosurface-flag.ts`).

---

## 8. The account-level Home `/dashboard` (`(launcher)/page.tsx:LauncherPage`)

Not what the event bottom-nav "Home" opens; opened by the launcher's own "Home" pill, "Home · all your events" in the account menu, and the rail's "Events" row. Layout `(launcher)/layout.tsx` = `AppRailShell` + bell + `AccountSwitcher` top bar + `HomePillNav` (phone, `sm:hidden`: Home · Memories · (+) Create an event · People · Spaces (only if the account has a shop/admin)).

Top to bottom (`<h1 sr-only>` "Your events"):
1. `IncomingRequests` — "Incoming requests N": cards "You are invited to {owner}'s {event}"; two **buttons** Yes / No; underline button "Don't show me invites from {first}"; flash for declined/muted/error.
2. **Now happening** (`#now`, sub "today") — dashed empty line when none; `CollectionGrid` of `GlassEventCard`.
3. **Planning** (`#events`, sub "yours to run") — right of the title: "N events" count, `PutAwaySwitch` ("Show the N I put away"/"Hide the ones I put away", a toggle-styled **link** `?putaway=1`), `NewEventButton` (+ icon, aria "New event"). Below: `ClashNotice` (two events on the same date), poster grid of `GlassEventCard` + `NewEventCard` tile ("New event"), `CollectionPager` ("Planning pages"), "Put away" shelf when toggled. Empty: `CollectionEmptyState` "Start a celebration" + button link "Create an event".
4. **Worth planning** (`#worth-planning`, sub "not events yet") — `YearMomentsStrip` (days that come around; not events).
5. **Untold / Ended** (`#finished`) — events whose day has passed, story not written; `storyHref` = `/story` when allowed.
6. **Told** (`#published`) — written events + link "read them in Memories" / "Open Memories" (text links).
7. `AutoSurfacedEvents` — only when `accountAutosurfaceEnabled()`.
Each `SectionLabel` has an "i" `ShelfInfo` `<details>` popover (text help).

`GlassEventCard` (card link to the event's `eventBoardHref`): poster/scene, monogram, badge + `StanceChip` (Host/Invited/Helper-style via `stanceLabel`), title, date·place, "attention" summary (`eventAttention`: count + top decision label; `{ count: null }` when unread), progress ring "planned" `%` + remainder (`progress.pct` is `null` — "unknown" — when `progressFailed`). `BoardCardWithMenu` adds `EventCardMenu` (⋮ icon button, `aria-label="Options for {name}"`): menu items **Add to calendar** (.ics), **Put this away / Bring it back**, **Remove for good** (confirm sheet with a "Why are you removing it?" `<select>` and an impact list).

Numbers there: "N events", per-card planned %, attention count, per-page range label; all static (no count-up in the launcher page itself).

---

## 9. Duplicates — what repeats another page, and what the Home owns

REPEATS (read-only echoes; the owner page keeps the data):
- **Coming / no reply** = Guests page stats (same `computeGuestStats`, `lib/guests.ts`); the Guests tab and the Next card's "Add guests"/"Send invitations" are the same doors.
- **Paid / Still owing** = the Budget page's Paid/Owed tiles (`budgetLiveSummaryMoney`), deliberately the same figures. Budget is a part of the Suppliers tab; the money card opens it.
- **Days to go** = the Event Details / Hub countdown and `/date-selection`.
- **Event Details pill** and **Edit your Event Hub** = the Hub tab (`/launch`) and the Details page; "Edit your Event Hub" duplicates the bottom-nav **Hub** tab's door.
- **Your services** tiles = the More Services sheet; the Next card can be the same service (deduped by `homeServices` "never twice").
- **Sheet decisions** = Suppliers (book / pick), Orders/Budget (pay), Checklist ("N% done", "View your full checklist →"); AI "Coming up" = Schedule / payments dates.
- Receded cards: Guests mini = Guests; Budget mini = Budget; Schedule = Schedule; Hosts card = Details › People with access; Suppliers card = Suppliers; Your services = Orders.
- After-day `FinishedEventSummary` "Overview — Open your page" = the same Home (self-link).
- Launcher: per-card planned % = the checklist's progress; attention count = the decisions count on that event's sheet.

THE HOME'S OWN (exists nowhere else): the one Next card and its ranking (`pickHomeNext`); the cover band with the event name and Hub background; the three-numbers strip as a glance; the "What's next" sheet as a container; the Setnayan AI / Papic status lines (status text is the home's own phrasing of other pages' reads); the day-of grid (live) and after-day summary; the access-request and date-change doorways; event-day offline pre-load.

---

## 10. Breaks the rules (file:symbol)

Terms: "supplier never vendor" · "event never celebration" · "any set of choices is ONE dropdown" · "no Edit-in-X ↗" · "every control is a button (icon + word)" · "a failure never renders like empty/success".

Failure rendered as empty/success:
1. `lib/home-first-screen.ts:pickHomeNext` — when the guest read fails (`homeGuestsRead` returns `null`) the guests/invite kinds are skipped and a date-set event with no Papic/AI falls through to **"You are on track — Nothing is waiting on you right now."** A refused read says "on track". Same for a failed `readHomeGuide` (`.catch(() => null)` in `EventHomePage`; internal `return null` paths in `_components/details-guide-home-card.tsx:readHomeGuide`): the Hub-setup card silently vanishes.
2. `[eventId]/page.tsx:EventHomePage` — the event read: `const event = eventRes.data; if (!event) notFound();` never reads `eventRes.error`, so a refused read renders a 404, not "couldn't load".
3. `[eventId]/page.tsx:moneyRead` — `resolveBudgetVisibility(...).catch(() => null)` then `!access?.mayRead` → `'hidden'`: a failed visibility read removes the Paid/Still-owing card, same as "not shared with you". (Fail-closed on privacy, but indistinguishable on screen.)
4. `_components/event-dashboard.tsx` (receded views and the sheet): the supplier and paid-orders reads are wrapped `try {…} catch { return { data: [], error: null } }`, so a THROW is reported as measured and empty (`vendorsMeasured = !eventVendorsRes.error`, `ordersMeasured`). The "Your services" card prints "Nothing ordered yet…" and "0 orders" when `ordersMeasured` is false (it only feeds the committed figure). The Hosts card prints "It's just you so far…" / "1 account" on a failed host read (`hostAccounts` catch returns `[]`). The decisions list and the focal tile print "Nothing needs a decision right now — your plan keeps moving on its own." even when the supplier read behind it failed. The Budget mini's ring shows "0%" while the text under it says "couldn't load" (`budgetPct` computed from `committedCentavos` = 0 on an unmeasured read).
5. `lib/nav-badges.ts:customerGuestsBadge` via `CustomerBottomNav` — an unmeasured guest count hides the badge exactly like zero.

Wording:
6. `_components/event-dashboard.tsx` Suppliers ExpandCard badge — non-wedding events print "N vendor(s) booked" ("supplier never vendor").
7. `[eventId]/page.tsx:EventHomePage` annual-tradition form — "Plan next year's celebration" (receded views).
8. `(launcher)/page.tsx:LauncherPage` — "Start a celebration", "Your celebration is running today", "your celebration moves up here", "Celebrations move here on their own…", "The celebrations you write up…"; `(launcher)/_components/event-card-menu.tsx:EventCardMenu` — "Just this celebration, on your phone.", "everything about this celebration are deleted…".

Controls that are not buttons with icon + word / go-edit-elsewhere:
9. `_components/home-first-screen.tsx:HomeFirstScreen` — the Next card action, "Edit your Event Hub", "Event Details", the Paid card, the service tiles are **links** (some pill-styled), none with an icon; `NextCard` "Later" is an icon-less underline button. `EventDashboard:renderDecisionGroup` draws the row CTA as a styled span inside a link, not a control.
10. `_components/expand-card.tsx:ExpandCard` `fullLabel` text links ("Manage suppliers →", "Open orders →", "See full schedule →"), `EventDashboard` "Open the list ↗", "View your full checklist →", "See all recent activity →", and the Hosts card's **"Set access in People with access →"** (`fullHref` `/details#people-with-access`) is a literal go-edit-elsewhere link. `_components/set-date-nudge.tsx:SetDateNudge` "Set your date" is a plain `<a>` text link.

Not breaking: no choice-set pills on the Home (the only set of choices is the `<select>` for removal reason in the launcher, correct); the Home first screen has no "Edit in X ↗" link.

NOT FOUND: any read of `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED` on the Home; any animation on the plan-phase Home numbers; a per-event first-visit tour that currently renders (all gated off by `TIP_POPUPS_ON`).
