# Event coverage matrix — what each event type needs, and where we stop

**Designer EC (Fable) · 2026-10-08 · research + design only, nothing built.**
Measured against `origin/main` @ `65eb71944` (read from a detached worktree, never from `~`).
Prototype: [`prototypes/event_needs_onboarding_2026-10-08_fable.html`](prototypes/event_needs_onboarding_2026-10-08_fable.html) · screenshots in `prototypes/event-needs-2026-10-08/`.

Answers the two 2026-10-08 rulings in `DECISION_LOG.md` ("THE EVENT TYPE SHAPES THE MAKER" · "ONBOARDING FOLLOWS WHAT THE EVENT NEEDS") and the owner's follow-ups relayed today: *Simple Event = event name + location + Papic, nothing else* · *a wedding expo needs a venue, suppliers as exhibitors, unlimited Papic, live streaming* · *no minimum shots per guest, but there can be a maximum.*

---

## 0. What already ships per type (Rule 0 — found before designed)

Re-measure every line with the command beside it. **None of these is a new build.**

| Fact | Where it lives on `main` | Re-measure |
|---|---|---|
| **20 live event types** | `public.event_type_vocab` (admin-managed; no CHECK on `events.event_type`) | `select event_type from event_type_vocab where enabled order by sort_order` |
| Date model per type (anchor kind, repeat cadences) | `apps/web/lib/event-anchor.ts` → `ANCHOR_BY_TYPE`, `CADENCES_BY_TYPE` | `grep -n "ANCHOR_BY_TYPE" apps/web/lib/event-anchor.ts` |
| Which surfaces a type has (website · seating · schedule · day_of · gallery · livestream · song · monogram · rsvp) | `event_type_profiles.enabled_surfaces` + fallbacks in `apps/web/lib/event-type-profile.ts` (`surfaceEnabled`) | `select event_type, enabled_surfaces, marketplace_enabled from event_type_profiles` |
| Suppliers tab hides for vendor-free types | `apps/web/app/dashboard/[eventId]/layout.tsx` → `navHideKeys` when `!profile.marketplaceEnabled` | `grep -n marketplaceEnabled apps/web/app/dashboard/\[eventId\]/layout.tsx` |
| Hub tab hides when the type has no `website` surface | same file → `websiteEnabled` | `grep -n websiteEnabled …/layout.tsx` |
| Supplier tiles scoped per type | `service_categories.applicable_event_types` (NULL = universal) → `tileEventTypes` in `apps/web/lib/taxonomy-snapshot.ts` | `select id, applicable_event_types from service_categories where tier = 2` |
| Maker items already filtered per type | `DETAILS_ITEM_APPLIES` in `apps/web/lib/maker-details-items.ts`: Love Story only with two named people; Wedding March only where the role set prints an entourage; Seat plan only with the `seating` surface | `grep -n "DETAILS_ITEM_APPLIES" apps/web/lib/maker-details-items.ts` |
| Studio tiles (11) follow the same filter | `apps/web/lib/studio-tiles.ts` → `studioTiles()` via `offered(item)` | `grep -n "STUDIO_TILE_KEYS" apps/web/lib/studio-tiles.ts` |
| Setup steps narrow per type | `apps/web/lib/hub-setup-steps.ts` (`HUB_SETUP_STEPS`, `guestListOnly` on `ask` + `guests`) through `hubSetupRound` | `grep -n guestListOnly apps/web/lib/hub-setup-steps.ts` |
| How guests get in — five choices + Open · Anyone with the link (one QR) | `whoCanRsvp` + entry mode (DECISION_LOG 2026-09-30 · 2026-10-07 "Guests › Setup") | `grep -n "whoCanRsvp" apps/web/lib/*.ts` |
| Papic on every type (compliance ladder waived 2026-08-01, supersedes the 2026-07-20 `simple_event` exclusion) | `apps/web/lib/papic-event-access.ts`; Simple onboarding already has the Papic picker (`app/onboarding/simple/_components/papic-step-fields.tsx`) | `grep -n PapicStepFields apps/web/app/onboarding/simple/page.tsx` |
| **Max shots per guest, no minimum** | `papic_guest_spend_ceilings` (`guest_spend_ceiling` points; 0 = may not spend) — migration `20271184624871` | `grep -ln papic_guest_spend_ceilings supabase/migrations/*.sql` |
| Live Studio: all types except date · hangout · travel; ₱2,500 once per event | migration `20271188752170`; `20271194920190` | read `platform_retail_catalog_v2`, never a comment |
| Music (Pakanta): all except date · hangout · travel · simple_event | surface `song` | same |
| Monogram: wedding only | surface `monogram`, migration `20271188752170` | same |
| Mood Board "colours only" already encodable | `PALETTE_STYLES.simple` ("Our colours only") in `palette-section.tsx` + dress-code `show_figure` off | `grep -n "Our colours only" apps/web/app/dashboard/\[eventId\]/studio/mood-board/_components/palette-section.tsx` |
| Onboarding routes | wedding → `/onboarding/wedding` (17 screens); simple_event → `/onboarding/simple` (ONE form: name · date · Papic picks); 18 others → `/onboarding/[type]` (`genericFlowScreens`) | `select event_type, onboarding_href from event_type_vocab` |

**What does NOT exist (the real delta):**
1. A per-**event** "needs" switch. Today Guests/Suppliers/Hub hide per **type** only. A birthday that wants no guest list still gets the Guests tab; a corporate townhall that wants no suppliers still gets the Suppliers tab.
2. A needs picker screen in onboarding. The generic flow asks name · date · pax · region · five feel axes · services; nothing asks *what do you need*.
3. A Mood Board **level** (Colours only · Colours + attire · Full) as one visible setting. The pieces exist; the single switch does not.
4. A per-type default for **dress code**. `wear` (B4) is drawn for every type that reaches the Hub setup.
5. An **organiser / expo** event: a venue-required type whose suppliers are EXHIBITORS. No vocab row, no role, no ticket concept (`grep -rli exhibitor apps/web/lib` → only unrelated hits in `trade-alias-miner.ts`, `seating.ts`).

---

## 0b. The lead example — a hangout, BEFORE and AFTER

Owner, verbatim: *"i tried to do onboarding for a hang out. and looking at the created event made it feel too complex for a simple hangout."* Walked in code on `origin/main` (no owner event touched). The hangout profile: `marketplaceEnabled = true` (~11 supplier categories widened by `20271259024543`), surfaces = website · schedule · day_of · gallery · rsvp (seating removed by `20271175884168`; livestream + song removed by `20271188752170`), a 4-item one-week checklist (`HANGOUT_TEMPLATE` in `lib/checklist-event-type-defs.ts`).

**BEFORE — what a hangout gets today, right after `/onboarding/hangout`:**

| Surface | What shows | Belongs to a barkada movie night? |
|---|---|---|
| Onboarding (`genericFlowScreens`) | welcome · name · date · **pax · region · five "feel" axes (for whom / feel / energy / roots / effort) · plan · services** · congrats — 12 screens | No. Name, where, when, Papic. Four answers. |
| Bottom bar (`buildEventMenuSections`) | Home · **Guests** · **Suppliers** · Hub · More Services | Guests and Suppliers do not belong (one QR, no booking). |
| Home (`doorsFor`) | three doors — **Edit your Guest list · Edit your Suppliers** · Edit your Event Hub; "next" card can say **"Add your guests" / "Send N invitations"**; decisions board; access-requests doorway | Only Papic + the QR belong. |
| Event Details rail | Event Details with venues · parents · march switches (march hidden by role set) | Parents/entourage switch is wedding-shaped. |
| Maker stages (`SETUP_STAGES`) | **Save the Date · RSVP · Invitation · The Day · Post Event** — all five, for every type | A hangout has The Day. Maybe Post Event. |
| Hub setup steps (`HUB_SETUP_STEPS`) | **When should guests arrive · Parish and reception (venues) · What everyone wears · What to ask guests · Your guests' names** (Love Story hidden) | "What everyone wears" and "Parish" are wrong; ask/guests are `guestListOnly` so they hide ONLY if the event is already Open. |
| Studio tiles (`studioTiles()`) | Info · Look · Logo · **Mood Board & Dress Code · Schedule · E-Gifts · RSVP · Prints** (Story, March, Seats already hidden) | Logo, Mood figures, E-Gifts, RSVP, Prints set do not belong. |
| More Services | Setnayan AI (₱ tier C?) · Papic · Patiktok (Live and Music already hidden) | Papic belongs; the rest is noise for 8 friends. |
| Guests › Setup | How guests get in (5 choices) · Invitations · RSVP asks · Reply by · Headcount | Only "one QR for everyone" matters, and it should be the default, not a choice. |

Count: **9 of 12 onboarding screens, 2 of 5 tabs, 2 of 3 Home doors, 3 of 5 stages, 4 of 5 setup steps, 5 of 8 Studio tiles** show and do not belong. That is the "too complex".

**AFTER — preset 1 "Simple event" applied to a hangout:**
- Onboarding: ONE screen — Name · Where · When (optional) · "What do you need?" = *Simple event* (Papic ✓ · one QR ✓ · no list · no suppliers · minimal hub). Make the event.
- Home: the name, place and date line · **Papic row (credits · Buy more · Most shots per guest ▾ None)** · the one QR card · one "Switch on more" row.
- Bottom bar: **Home · Hub · More Services** (no Guests, no Suppliers).
- Maker: ONE stage — The Day: cover (name · place · date · the five colours) + Papic gallery. Studio: Info · Look (colours). Nothing else drawn.
- Guests › Setup is not reachable; "How guests get in" is fixed to *Open · Anyone with the link* until the person switches Guests on.

The first two screenshots in `prototypes/event-needs-2026-10-08/` are exactly this pair at 375 px.

---

## 1. The matrix

Legend — **Guests**: none · 1QR (Open · Anyone with the link) · list · list+reply. **Suppliers**: none · few · full. **Date**: one (fixed_date) · anchor (derived from a person/union date) · range · booked (date follows the venue lock; wedding). **Dress**: none · colours · full. **Stages** are the five the Maker ships: SD = Save the Date · R = RSVP · I = Invitation · D = The Day · P = Post Event. **Studio tiles** are the 11 in `studio-tiles.ts` (Info · Look · Logo · Mood · Schedule · Story · March · Seats · E-Gifts · RSVP · Prints). **Papic** is on for every row; the **max shots per guest** control (None · a number; never a minimum) applies to every row and is built on `papic_guest_spend_ceilings`.

| Type | Size | Guests | Suppliers | Date | Venue | Dress | Stages | Studio tiles | Services that fit | Filipino specifics | LIMITATIONS — cannot do yet / wrong to show |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **wedding** | 100–300 | list+reply | full | booked | parish + reception | full | SD·R·I·D·P | all 11 | Papic · Live · Video booth · Music · AI (tier A) · Prints · Monogram | Ninong/ninang (principal sponsors), entourage, parents on the invite, veil reveal RSVP, Wedding March; cord/coins/arrhae NOT modelled as items | Cord · veil · coins roles are not in the 24-role set (only the veil RSVP reveal exists); civil-only weddings still see "Parish" unless the kind is civil |
| **debut** | 80–200 | list+reply | full | anchor (18th) | reception | full | SD·R·I·D·P | all but March? — March only if the role set prints an entourage: **18 Roses · 18 Candles · 18 Treasures · Escort** (ruled 2026-10-01) | Papic · Live · Video booth · Music · AI (B) · Prints | The 18s; "cotillion" has no part | The 18 Roses/Candles/Treasures are role NAMES only — no dance-order or candle-speech part exists; Love Story is wrong here (one named person) and is already hidden |
| **birthday** | 20–100 | 1QR default (host's choice, 2026-10-01) | few | anchor (yearly, forced) | home / venue | colours | I·D·P (SD only if asked) | Info · Look · Logo · Mood(colours) · Schedule · E-Gifts · RSVP · Prints | Papic · Video booth · Music · AI (C) · Prints | Milestone ages 1 · 7 · 18/21 · 60 (`milestoneAges`) | Wrong to show: Love Story, March, Seat plan (already hidden), full attire figures. 1st/7th birthday for a minor: face tagging default ON is flagged load-bearing (2026-10-01 item 8) |
| **christening** | 30–80 | list (no reply default) | few | anchor (child's birthdate → output) | parish + lunch | colours | I·D·P | Info · Look · Logo · Mood(colours) · Schedule · E-Gifts · RSVP · Prints | Papic (quiet) · Prints · AI (C) | **Ninong · Ninang** (godparents) ruled 2026-10-01; inaanak kinship rows exist | "Baptism" is a label question only (2026-08-17) — not a second type. No godparent-count limit, no sponsor letter |
| **anniversary** | 10–100 | list | few | anchor (union date, yearly, forced) | restaurant / venue | colours | I·D·P | Info · Look · Logo · Mood(colours) · Schedule · Story · E-Gifts · RSVP · Prints | Papic · Live · Music · AI (C) | Silver/gold (25/50) via `nextAnniversary` | Community-owned anniversary (Samahan) sorts with a couple's — same type; origin picker has NO "memorial" by design (do not add) |
| **gender_reveal** | 10–40 | list | none/few | anchor (due date) | home | none | I·D | Info · Look · Mood(colours) · Schedule · RSVP · Prints | Papic · Video booth · AI (D) | — | Nothing ties the reveal to a Papic moment; Live is on but rarely wanted |
| **graduation** | 10–60 | 1QR | none/few | one | school / home | none | I·D·P | Info · Look · Mood(colours) · Schedule · E-Gifts · Prints | Papic · Prints | Honoree gate (one in planning per honoree) | No "class of" group model; a batch party is a reunion, not this |
| **reunion** | 30–200 | 1QR or list | few | one (semestral/annual) | venue | colours | I·D·P | Info · Look · Logo · Mood(colours) · Schedule · E-Gifts · RSVP · Prints | Papic · Live · Music · AI (C) | Samahan-ownable | No batch/family-tree import; headcount only by replies |
| **celebration** (generic party) | 20–150 | 1QR or list | few | one (monthly…annual) | venue | colours | I·D·P | Info · Look · Logo · Mood(colours) · Schedule · E-Gifts · RSVP · Prints | Papic · Live · Music · AI (C) | — | The catch-all; shows every generic category. Wrong to show: March, Story (hidden), full attire |
| **gala_night** | 100–500 | list+reply | full | one (annual) | ballroom | full | SD·R·I·D·P | Info · Look · Logo · Mood(full) · Schedule · Seats · RSVP · Prints | Papic · Live · Music · AI (C) · Prints | Awards programme as Schedule | No awards/winners part; no table-sponsor sale; no ticketing |
| **corporate** | 50–1,000 | list+reply ("Will you join us?") | full | one (any cadence) | venue | none | I·D·P | Info · Look · Logo · Schedule · Seats · RSVP · Prints | Papic · Live · Music · AI (B) · Prints · 3D room | — | No badges/check-in desk beyond the QR; NPC Circular 16-02 processor agreement for crowd Papic was WAIVED, not built (2026-08-01) — say so if a client asks |
| **tournament** | 50–500 | 1QR | few | range | grounds | none | D·P | Info · Look · Logo · Schedule · Prints | Papic · Live · Prints | Fixtures listed, no spectator seating (2026-08-17) | No brackets, scores or teams; "fixtures" = schedule rows only |
| **travel** | 2–20 | list | few (tour, insurance) | range (multi-day, roaming) | — | none | D·P | Info · Look · Schedule · Prints | Papic · Prints | — | No Live, Music, seating (dropped by `TRAVEL_PROFILE`); no itinerary beyond Schedule; Papic "per event-day" is structurally awkward (2026-07-20) |
| **concert** | 200–5,000 | 1QR | full | one | venue | none | D·P | Info · Look · Logo · Schedule · Prints | Papic · Live · Prints | — | Type exists since `20271255436935` with corporate/gala reach only; **no ticketing, no gates, no capacity** — a free, open crowd only |
| **open_house** | 20–300 | 1QR | few | one | the property | none | I·D | Info · Look · Logo · Schedule · Prints | Papic · Prints | — | No seating; no lead capture; one QR is the only door |
| **grand_opening** | 50–500 | 1QR | few | one | the shop | none | I·D·P | Info · Look · Logo · Schedule · Prints | Papic · Live · Prints | — | No promo/coupon mechanic; same limits as open_house |
| **simple_event** | 2–50 | **1QR** (no list) | **none** (vendor-free, `marketplaceEnabled=false`) | one | one line of text | none | D (cover + Papic gallery) | Info · Look (colours) · Prints(QR) | **Papic** · Live (surface on) | — | The owner's definition today: *name · location · Papic — nothing else.* Wrong to show: Suppliers, Budget, Mood Board figures, Schedule, RSVP, E-Gifts, AI (₱0 tier, hidden). Live stays optional. |
| **date** | 2 | none | none | one (weekly/monthly) | restaurant | none | D | Info · Look (colours) | Papic | — | No Live, Music, seating; a guest list is nonsense here — never draw Guests |
| **hangout** | 3–15 | 1QR | none/few (~11 categories) | one (weekly/monthly) | somewhere | none | D (·P) | Info · Look (colours) · Schedule | Papic · Video booth | Barkada | No Live, Music, seating; no Love Story, March, Seats, E-Gifts, RSVP, Mood figures, Prints set — **all wrong to show** |
| **wake** | 50–300 | **1QR, list optional** (2026-10-01) | few (`farewell` folder + chairs/tents) | one (service date entered directly) | parish / chapel / home | none (quiet) | I·D (no countdown, never SD or P-editorial) | Info · Look · Schedule · E-Gifts ("A gift of sympathy") · Prints | Papic (quiet camera) · AI · Prints | Pasiyam rosary rows, abuloy/pabuya, "Will be there / Unable to come" | No confetti, no challenges, no countdown — enforced. Babang-luksa must be a NEW event, never this one repeating |
| **🆕 expo / organiser event** (wedding expo, bridal fair) | 500–10,000 | 1QR (**ticketed? — flag**) | **EXHIBITORS** — a different role from a couple's booked suppliers | one or range | **venue REQUIRED** | none | D·P + a photo wall | Info · Look · Logo · Schedule · Prints (badges/QR) | Papic at scale · Live · photo wall · Prints | — | **NOT SUPPORTED.** No vocab row, no exhibitor role (`vendor_event_assignments` only knows a supplier booked BY the host), no booth map, no ticket. "Unlimited Papic" is a PRICING question — see §4. |

### 1b. The Philippine events list — ships today vs NEW, the limit line, service fit, and the ranking

Owner (2026-10-08): *"we want to have all of those events: Fun Run · Concert · Party · Theater · Exhibit · Simple Event · Dinner · Hangout · Wake · Celebration · What else."* Every row below is grouped under one of the five presets so onboarding stays ONE first question. **Ships** = a vocab row exists on `main` (20 live types). **NEW** = needs a vocab row (admin can add it at runtime via `/admin/event-types`; no migration for the name) — the hard part is only when the row also needs a NEW mechanism, marked ⚠.

**The limit line** is one plain sentence shown under the type tile at onboarding — honest, never apologetic. **Fit** = which of Papic · Live · Video booth · Hub · Guests · Suppliers the type maximises (● strong · ○ some · – none).

| Type (user-facing) | Vocab | Preset | Limit line at onboarding | Papic | Live | Booth | Hub | Guests | Suppliers | ⚠ NEW mechanism |
|---|---|---|---|---|---|---|---|---|---|---|
| **Wedding** | ships | 4 Fully planned | "Everything is here. Cord, coins and arrhae are not tracked as items yet." | ● | ● | ● | ● | ● | ● | — |
| **Debut** | ships | 4 | "18 Roses · Candles · Treasures are guest roles; the dance order is not timed." | ● | ● | ● | ● | ● | ● | — |
| **Birthday** (incl. 1st · 7th · 60th) | ships | 2 Open · one QR | "One QR for everyone by default. Face tagging is on — turn it off for a child's party if you prefer." | ● | ○ | ● | ○ | ○ | ○ | — |
| **Christening / Baptism** | ships (alias label) | 3 Guest list | "Ninong and Ninang are on the list. No sponsor letters or counts yet." | ● | ○ | – | ○ | ● | ○ | — |
| **Anniversary** | ships | 3 | "Yearly by itself. A memorial anniversary is a different event — make a Memorial." | ● | ○ | ○ | ○ | ○ | ○ | — |
| **Corporate** (townhall · kickoff · awards) | ships | 3 | "Replies and seats work. No name badges or check-in desk beyond the QR." | ● | ● | ○ | ○ | ● | ● | — |
| **Conference · seminar · workshop** | NEW (label on corporate) | 3 | "Sessions are schedule rows. No speaker pages, no CPD certificates, no paid registration." | ○ | ● | – | ○ | ● | ○ | ⚠ paid registration |
| **Product launch** | NEW (label on corporate / grand_opening) | 2 | "Live and photos shine. No lead capture, no press kit." | ● | ● | ○ | ○ | ○ | ● | — |
| **Year-end / company party · Christmas party** | NEW (label on celebration) | 2 or 3 | "Raffle and games are not in the app. Photos, Live and the Hub are." | ● | ● | ● | ○ | ○ | ● | — |
| **Party / Celebration** (generic) | ships (`celebration`) | 2 | "A party with one QR. Switch on a guest list or suppliers any time." | ● | ○ | ● | ○ | ○ | ○ | copy rule — see §4 |
| **Dinner** (restaurant night) | NEW → reuse `date` (2 people) or `hangout` (a table) | 1 Simple | "Photos only. No bookings — call the restaurant." | ● | – | – | – | – | – | — |
| **Hangout** (barkada) | ships | 1 Simple | "Name, place, Papic. That's it — switch more on if the night grows." | ● | – | ○ | – | – | – | — |
| **Simple Event** | ships | 1 Simple | "Name, place, Papic. No suppliers, no list." | ● | ○ | – | – | – | – | — |
| **Proposal / engagement** | NEW (label on `date`) | 1 Simple | "A quiet Papic camera for the moment. The wedding is a new event after the yes." | ● | ○ | – | – | – | – | — |
| **Bridal shower · Baby shower** | NEW (label on celebration) | 2 | "One QR, photos, gifts. No registry links yet." | ● | – | ● | ○ | ○ | ○ | — |
| **Gender reveal** | ships | 3 | "Photos and a short list. The reveal is not tied to a camera moment yet." | ● | ○ | ● | ○ | ○ | – | — |
| **Housewarming / house blessing** | NEW (label on celebration) | 2 | "One QR for the whole barangay. Priest and caterer are suppliers if you want them." | ● | – | ○ | – | ○ | ○ | — |
| **Despedida · Welcome home / Balikbayan** | NEW (label on celebration / reunion) | 2 | "Photos and a Live stream for those abroad. No gift pooling for a plane ticket yet." | ● | ● | ○ | ○ | ○ | – | — |
| **Thanksgiving** | NEW (label on celebration) | 2 | "A photo wall and a Live stream. Nothing else needed." | ● | ● | – | ○ | – | – | — |
| **Reunion** (family · class · alumni) | ships | 2 | "One QR; a list if you want a headcount. No batch import." | ● | ● | ● | ○ | ○ | ○ | — |
| **Graduation** | ships | 2 | "Photos and a Hub. The ceremony itself is the school's." | ● | – | – | ○ | – | – | — |
| **Prom / JS Prom** | NEW (label on gala_night) | 4 (school as host) | "Seats, dress code and a photo wall. No ticket sales — collect at school." | ● | ○ | ● | ● | ● | ● | ⚠ ticketing |
| **Pageant** | NEW | 2 | "Audience photos and Live. No scoring, no judges' tally." | ○ | ● | – | ○ | – | ○ | ⚠ scoring (V2, 2026-05-20) |
| **Fiesta** (town · barangay) | NEW | 2 | "One QR for the whole town. Photos everywhere. Vendors are not booths." | ● | ● | ○ | ○ | – | ○ | ⚠ exhibitor role |
| **Church event · retreat · recollection** | NEW | 3 | "A list and a schedule. Papic is quiet. No donations beyond E-Gifts." | ○ | ● | – | ○ | ● | – | — |
| **Sports league · tournament** | ships (`tournament`) | 2 | "Fixtures are schedule rows. No brackets, scores or teams." | ● | ● | – | ○ | – | ○ | ⚠ brackets (V2) |
| **Fun Run** | NEW | 2 | "No seat plan; timing chips are not tracked. Photos at the finish line are." | ● | ○ | – | ○ | – | ○ | ⚠ registration + bibs |
| **Concert** | ships | 2 | "Open crowd, one free QR. No tickets, no gates, no capacity." | ● | ● | – | ○ | – | ● | ⚠ ticketing |
| **Theater** (play · recital) | NEW | 2 | "Programme as the schedule. No tickets, no seat sales." | ○ | ● | – | ○ | – | ○ | ⚠ ticketing + seat sales |
| **Exhibit · Expo · Bazaar / market** | NEW | 5 Organiser | "Venue first. Booths are not booked suppliers — that part is coming." | ● | ● | – | ○ | – | ● | ⚠ exhibitor role · booth map · ticketing |
| **Open house · Grand opening** | ships | 2 | "One QR is the door. No lead capture, no promos." | ● | ● | – | ○ | – | ○ | — |
| **Wake** | ships | 2 (one QR, list optional) | "Quiet camera, no countdown. Pasiyam rows and a gift of sympathy are here." | ○ | ● | – | ○ | ○ | ○ | — |
| **Memorial** (pasiyam · 40th day · death anniversary) | NEW (tone build on wake) | 2 | "A quiet page for the family. It does not repeat — make each one when it comes." | ○ | ○ | – | ○ | – | – | — (2026-05-16 forbids a tracker; each is a new event) |
| **Travel** | ships | 3 | "Days, not a date. No Live, no seats, no itinerary beyond the schedule." | ● | – | – | – | ○ | ○ | — |

Rows marked "label on X" are the cheapest NEW: an `event_type_vocab` row (or just a tile label) that **inherits** an existing profile — no mechanism. That is Rule 3 (a flag flip beats new schema) applied to types.

**Seasons & trips (owner 2026-10-08: *"how about new year, halloween, outing, travel. we want to show that they are just thinking of an event, we have it covered"*):**

| Type (user-facing) | Vocab | Preset | Limit line at onboarding | Papic | Live | Booth | Hub | Guests | Suppliers | ⚠ NEW mechanism |
|---|---|---|---|---|---|---|---|---|---|---|
| **New Year / New Year's Eve party** | NEW (label on celebration; `calendar_holiday` anchor exists in `AnchorKind`) | 2 | "Countdown to midnight is the only countdown. Fireworks are yours, not ours." | ● | ● | ● | ○ | ○ | ○ | — |
| **Christmas party** (family · company — cross-listed under Work) | NEW (label on celebration) | 2 | "Exchange gifts and raffles are not in the app. Photos, Live and the Hub are." | ● | ● | ● | ○ | ○ | ● | — |
| **Halloween** | NEW (label on celebration) | 2 | "One QR, a photo wall, a costume colour. No contest voting." | ● | – | ● | ○ | – | – | — |
| **Valentine's** | NEW (label on `date`) | 1 Simple | "Two people, one camera. Nothing to plan." | ● | – | – | – | – | – | — |
| **Outing / beach outing / company outing** | NEW (label on travel, single day → `fixed_date`) | 1 or 2 | "One day, one place, everyone's photos in one wall. No bus or resort booking." | ● | – | ○ | ○ | ○ | ○ | — |
| **Travel / group trip** (multi-day, several places) | ships (`travel`) | 3 | "Days, not a date; places, not a venue. The itinerary is the schedule. Papic runs per day. No Live, no seats, no bookings." | ● (per day) | – | – | ○ | ○ | ○ (tour · insurance) | — |

Travel, honestly: `TRAVEL_PROFILE` drops seating · livestream · song; `layer_mode='roaming'`, `multi_day=TRUE`; the anchor is a `date_range`. There is **no venue** (nothing to lock), **no booking** of flights/resorts (suppliers are tour guides and insurance only), and Papic's unit is the **event-day** — a 5-day trip is five Papic days, which is a cost the person must see before they buy (the 2026-07-20 council called this "structurally the wrong unit"; the 2026-08-01 waiver opened it anyway). The Hub for a trip is a photo wall with the itinerary; nothing else is drawn.

**Big public events — three more (owner 2026-10-08: "Olympics / Tournament" · "Carshow (has more than a day) · Carmeet (has a day)"):**

| Type (user-facing) | Vocab | Preset | Duration default | Limit line at onboarding | Papic | Live | Booth | Hub | Guests | Suppliers | ⚠ NEW mechanism |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Olympics / Sports fest / Tournament** (intramurals · company sports fest · barangay league) | ships (`tournament`) | 2 | **several days** | "Teams and match days are your schedule. Results and standings are not kept yet." | ● | ● | – | ○ | – | ○ | ⚠ teams · fixtures · standings (NEW — nothing on `main`: `grep -rli "standings\|bracket" apps/web/lib` → no hit) |
| **Car show** | NEW (expo shape) | 5 Organiser | **several days** | "Clubs, dealers and sponsors are exhibitors — that role is coming. One QR or tickets. Photos and Live are ready." | ● | ● | – | ○ | – | ● | ⚠ exhibitor role · booth map · ticketing (same gap as Expo) |
| **Car meet** | NEW (label on celebration / hangout) | 2 | one day | "One QR, a meet-up point, everyone's photos. No route tracking." | ● | ○ | – | ○ | – | – | — |
| **Cosplay / Con** (conventions, cosplay events) | NEW (expo shape) | 5 Organiser | one day or several (ask Duration) | "Photos are the whole point — set a max per guest so the pool lasts. Artist and merch booths are coming; the contest is not judged in the app." | ● (heaviest of all — the per-guest maximum matters most here) | ● (stage) | – | ○ (photo wall) | – | ● (booths) | ⚠ exhibitor role · booth map · **contest entries + judging (NEW — no scoring model on `main`, same gap as Pageant)** |

Car show vs car meet is the proof the owner asked for: **the same subject, two defaults** — one is an organiser event over days, the other an open single-day event. Duration is not the type; it is a dimension.

### 1d. Duration — a dimension on any type, not a type

Owner: *"Single-day events · Multi-day events."* Any type can span days (an expo, a tournament, a trip, a wedding with a pre-day, a fiesta novena). Onboarding asks **Duration ▾ · One day · Several days** only where the type's default is not obvious; the type sets the default.

| Defaults to several days | Defaults to one day (may switch) |
|---|---|
| Travel / group trip · Exhibit / Expo / Bazaar · Car show · Olympics / Sports fest / Tournament · Conference · Fiesta (novena + the day) · Wedding weekend (profile `multiDay: true` for the rehearsal dinner / brunch) | everything else |

What SHIPS for several days today, and what is NEW:

| Several days changes… | Today on `main` | NEW |
|---|---|---|
| The date | `events.event_date` + `events.event_end_date` (migration `20270807254184`); `AnchorKind 'date_range'` for travel/tournament; `multiDay` on the type profile (`lib/event-type-profile.ts`) | the **Duration ▾** question itself, and letting a one-day type opt into an end date |
| The schedule | one list of times (`schedule` item) | **day headings** — schedule rows grouped by day (a `day` on each row; derive from the row's time if it already carries a date — check before adding a column) |
| The Day stage | ONE "The Day" page | **per-day The Day** (one page per day, "Day 1 · Day 2" dropdown) — NEW in `STAGE_SCENES`/`stage-setup.ts` |
| Papic | the pool is per EVENT; the capture window is per event-day (`lib/papic-guest-window.ts`, `papic-event-access.ts`) — a 3-day event already costs three Papic days | **the gallery grouped by day** — NEW (galleries are one wall) |
| Live | one Live Studio channel per event (`lib/live-studio-channel-grants.ts`) | **Live per session** (a match, a day) — NEW; not found on `main` |
| Guests | one QR for the whole event | nothing — the pass is good for every day |
| Retention / deletion | counts from `event_end_date` (`20271126998711`) | nothing |

Rule: never ask Duration on a Simple event, a hangout, a date, a birthday — the answer is one day. Ask it on Big public events, Work and Seasons & trips; pre-answer it from the type.

### 1c. The seven groups — the picker's first screen (owner-approved 2026-10-08)

Positioning: *whatever event someone is thinking of, we have it covered.* The picker shows seven picture cards; each opens its types; a catch-all **Something else** maps to the Simple preset with a name field.

| Group (card) | Types inside | Default preset |
|---|---|---|
| **Life events** | Wedding · Debut · Birthday (1st · 7th · 18th/21st · 60th) · Christening / Baptism · Anniversary · Graduation · Prom / JS Prom · Proposal / engagement · Gender reveal · Baby shower · Bridal shower | 4 for wedding · debut · prom; 3 for christening · anniversary · showers · gender reveal; 2 for birthday · graduation; 1 for proposal |
| **Family & community** | Reunion (family · class · alumni) · Fiesta · Housewarming / house blessing · Despedida · Welcome home / Balikbayan · Thanksgiving · Church event / retreat / recollection · Party / Celebration | 2 (church event: 3) |
| **Memorial** | Wake · Pasiyam · 40th day · Death anniversary | 2 (one QR, list optional, quiet camera) |
| **Big public events** | Concert · Fun Run · Olympics / Sports fest / Tournament · Theater · Pageant · Exhibit / Expo / Bazaar · Car show · Car meet · Cosplay / Con · Open house · Grand opening | 2; Exhibit/Expo/Bazaar · Car show · Cosplay/Con → 5 Organiser |
| **Work** | Corporate (townhall · kickoff · awards) · Conference / seminar / workshop · Product launch · Year-end / company party · Christmas party | 3 (launch · year-end: 2) |
| **Simple** | Simple Event · Hangout · Dinner · **Something else** | 1 |
| **Seasons & trips** | New Year · Christmas · Halloween · Valentine's · Outing · Travel / group trip | 2 (Valentine's: 1; Travel: 3) |

The card is the first question; the preset is the second (and is pre-answered by the type). Nothing else is asked before "Make the event".

**Ranking — which types best maximise our service in the Philippines (reach × fit × revenue):**

| # | Type | Why |
|---|---|---|
| 1 | **Wedding** | the only row that uses all six; the revenue engine (owner 2026-07-11) |
| 2 | **Debut** | the "second hero"; full suppliers, Live for relatives abroad, a court of 18 |
| 3 | **Birthday incl. 1st / 7th / 60th** | highest frequency; Papic + booth + a caterer; one QR keeps it light |
| 4 | **Christening / Baptism** | every family, every year; godparents are a list; prints + Papic |
| 5 | **Corporate · year-end / Christmas party · conference** | budgets exist; Live + Papic + suppliers; replies matter |
| 6 | **Reunion (family / class / alumni) · Balikbayan** | Live for the ones abroad is the hook; Papic wall |
| 7 | **Fiesta · bazaar · expo** | biggest crowds in the country — but needs the exhibitor role before it is honest |
| 8 | **Graduation · Prom** | seasonal spikes; prom is a mini-gala |
| 9 | **Wake · Memorial** | universal, quiet; a gift of sympathy; Live for family abroad |
| 10 | **Concert · Fun Run · Theater · Pageant** | reach is huge, fit is thin without ticketing/scoring — Papic only |
| 11 | **Hangout · Dinner · Proposal · Simple Event** | daily, free, Papic-only; the on-ramp, not the revenue |

Reading the Studio-tiles column: "Mood(colours)" = the Mood Board at level **Colours only** (no figures, no attire-by-role, no Do's & Don'ts). The five main colours are shared with Look › Colours, so a colours-only Mood Board IS the Look palette with a name.

---

## 2. "Needs" presets — five patterns cover all twenty types

A preset is a starting answer to four yes/no needs, each switchable later from Home's quick setup. The type sets the default; the person can flip any need.

| Preset | Papic | Guests | Suppliers | Event Hub | Mood Board level | Default for |
|---|---|---|---|---|---|---|
| **1 · Simple event** — *name · location · Papic* | ON | **1QR, no list** | OFF | minimal (cover + Papic gallery + QR) | Colours only | simple_event · date · hangout |
| **2 · Open event, one QR** | ON | 1QR, no list (list optional) | few | I · D · P | Colours only | birthday · graduation · reunion · celebration · tournament · open_house · grand_opening · concert · wake |
| **3 · Guest list + replies** | ON | list + reply | few | I · D · P | Colours only (attire on if a dress code is set) | christening · anniversary · gender_reveal · corporate · travel |
| **4 · Fully planned** | ON | list + reply | full | SD · R · I · D · P | Full (figures, attire by role, Do's & Don'ts) | wedding · debut · gala_night |
| **5 · 🆕 Organiser / expo** | ON, at scale, **per-guest max** set by the organiser | 1QR (ticketed — owner) | **exhibitors** (NEW role) | D · P + photo wall | none | expo (NEW type) — not until the owner says yes |

Rules the presets obey:
- **No minimum shots per guest, ever.** A maximum is optional ("Most shots per guest ▾ · None · 5 · 10 · 20 · custom"), set by the host or organiser, stored in `papic_guest_spend_ceilings` — no new column.
- A need that is OFF is not greyed out; it is **absent** (bottom bar, Home rows, Maker stages, Studio tiles). Home keeps one "Switch on more" row so nothing is lost.
- A need switched ON later gets the shipped setup card for it (guests → "How guests get in"; suppliers → Find; hub → "Finish your Event Hub").
- Preset 1 never asks a date question beyond "When? (optional)". Owner: *"Event Name, location, papic service, no suppliers, etc."*

---

## 3. What onboarding asks first — one screen at 375 px

**Screen: "What does this event need?"** (after the type tile is tapped, before anything else). Shown in the prototype.

```
Event name            [ Tita Baby's 60th            ]
Where                 [ Our house, Antipolo         ]   ← one line; wedding: parish + reception appear later
When (optional)       [ 12 Oct 2026 ▾               ]   ← absent for simple_event; "Follows the venue" for wedding
Duration              [ One day ▾                   ]   ← only on Big public · Work · Seasons & trips; pre-answered by the type (§1d)

What do you need?     [ Open event · one QR ▾       ]   ← ONE dropdown, defaulted by type; the 5 presets
  ✓ Photos with Papic         (always on; "Most shots per guest ▾ None")
  ✓ One QR for everyone       (no guest list)
  · Guest list & replies      off
  · Suppliers                 off
  ✓ Event Hub · Invitation · The Day · Post Event

[ Make the event ]            "You can switch anything on later from Home."
```

Picking a preset switches the four needs; tapping a need flips it alone. Each need maps 1:1 to what appears afterwards:

| Need | Bottom bar | Home rows | Maker stages | Studio tiles |
|---|---|---|---|---|
| Papic (always) | — | Papic row (credits · Buy more) + QR | The Day: `your_photos` | — |
| Guests: 1QR | — (no Guests tab) | QR row | RSVP stage absent | RSVP tile absent |
| Guests: list / list+reply | Guests | Guest list row · Invitations | RSVP stage | RSVP tile |
| Suppliers | Suppliers | Suppliers row · Budget | — | — |
| Event Hub | Hub | Finish your Event Hub | per preset | per type filter (already shipped) |

Wedding keeps its own 17-screen wizard; this screen is NOT inserted there (a wedding is always preset 4). Simple keeps its one form, gaining only the preset line and the per-guest max.

---

## 4. Owner decisions (one word each) and the build plan

| # | Decision | Answer wanted |
|---|---|---|
| 1 | **EXPO** — add an organiser/expo type with exhibitors as a role? | yes / no |
| 2 | **PRICING** — "unlimited" Papic for organisers: a flat organiser **package** or **credits** at scale? *Never assume unlimited is free.* | package / credits |
| 3 | **TICKETS** — is expo entry ticketed in V1, or one free QR only? | ticketed / free |
| 4 | **CEILING** — default "Most shots per guest" on open-QR events: none, or a number? | none / *n* |
| 5 | **DRESS** — does a birthday default to colours-only (figures off)? | colours / full |
| 6 | **CELEBRATION** — keep "Celebration" as the user-facing type name, or rename the type tile "Party"? (The copy rule stands either way: UI says *event*, never *celebration*, owner 2026-10-04 — the type NAME is the only place the word may survive.) | keep / party |

Not a decision, just a note: "Baptism" rides on christening as an alias label (2026-08-17 already said it is a naming question). The 20 "label on X" rows in §1b need no owner call each — one yes to "add the labels" covers them.

**Build plan — PR-sized, data first (what exists vs NEW):**

| PR | What | Data |
|---|---|---|
| **A · needs on the event** | One column `events.needs jsonb` `{guests:'none'\|'1qr'\|'list'\|'list_reply', suppliers:bool, hub:bool}`, defaulted at insert from a per-type map in `lib/event-type-profile.ts` (`DEFAULT_NEEDS_BY_TYPE`, beside `ANCHOR_BY_TYPE`'s shape). Papic has no flag (always on). | **NEW** column; the guests value is a VIEW over the shipped `whoCanRsvp` + entry mode — do not store it twice: `needs.guests` is derived, only `suppliers` and `hub` are stored. Ugat map node required (`ugat-concept-coverage` will fire). |
| **B · the picker screen** | `app/onboarding/_shared/needs-step.tsx`, first card in `/onboarding/[type]` and the top of `/onboarding/simple`; one PickMenu dropdown + four rows. Writes `needs` through `commit-event.ts`. | exists: `setup-card.tsx`, `services-step.tsx`, PickMenu |
| **C · the bar and Home follow needs** | `layout.tsx` `navHideKeys` reads `needs.suppliers`/`needs.hub` in addition to the type profile; Home `doorsFor` + `pickHomeNext` skip absent needs; one "Switch on more" row. | exists: `navHideKeys`, `doorsFor`, `pickHomeNext` |
| **D · Maker scope** | `SETUP_STAGES` filtered: RSVP stage absent when `needs.guests` is `1qr`/`none`; SD absent outside preset 4; Studio tiles already filter — add `mood` level and hide `gifts`/`prints`/`schedule` for preset 1. | exists: `DETAILS_ITEM_APPLIES`, `studioTiles()`; NEW: a `moodLevel` read of `PALETTE_STYLES` + `show_figure` |
| **E · Mood Board level** | One PickMenu on the Mood Board: Colours only · Colours + attire · Full. Colours-only = `palette_style='simple'` + `show_figure=false` + the Inspiration/Do's & Don'ts sections hidden. | exists: both fields. NEW: none |
| **F · per-guest max** | "Most shots per guest ▾" on the Papic row (Home) and in the organiser view; writes `papic_guest_spend_ceilings`. No minimum control anywhere. | exists: table + gate (S2); the couple's control S3 was planned, check `WHATS_NEXT_Shots_Per_Guest_2026-08-28.md` before building |
| **G · expo (owner-gated)** | vocab row `expo` (surfaces: website · schedule · day_of · gallery · livestream), `vendor_event_assignments.role='exhibitor'` (CHECK extension) + booth number, venue required at create. | **NEW** type, NEW role value, NEW pricing SKU — blocked on decisions 1–3 |

Order: A → B → C → D → E → F; G only after the owner answers. Each PR carries a side-by-side at 375 px and a check card.

---

## 5. Limits we must say out loud (not hide)

- **No ticketing anywhere.** Every open event is one free QR. Concert, expo, gala: a paid door does not exist.
- **No exhibitor role.** A supplier in the app is someone the host booked. A booth is not that.
- **Crowd Papic has waived compliance**, not built compliance (2026-08-01). Corporate/concert/expo crowds get the live NSFW filter and nothing else — no CSAM hash matcher, no NPC 16-02 instrument.
- **Debut court, christening godparents are role names only** — no 18-roses dance order, no candle-speech part.
- **Wedding cord · coins · arrhae** are not modelled; only the veil appears (as the RSVP reveal).
- **Prices come from `platform_retail_catalog_v2`.** Every ₱ figure in this file is a migration comment, quoted for orientation; the table is the only price a customer is charged.
- **A per-type default is not a per-event fact.** The matrix gives starting points; the needs switch is what the person chose. Never render a tab from the type alone once `needs` exists.
