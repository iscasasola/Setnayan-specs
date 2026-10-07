# Event Details — Event · Access · Settings (design, 2026-10-07, Fable)

**Owner, verbatim (2026-10-07):** *"this simply means we have to fix and arrange the Event Details."* · *"they are different"* (People with access under the last supplier row) · *"finding these different parts is to deep inside."* · *"why is there a check on this if it is not event hub maker. and just event details"* · *"redesign it following the concept of suppliers, and guests where there is a toggle. then accordion that opens and has toggles for toggle based, and data that is just derived from outside is just a direct link to jump there."* · *"make it simpler and easier to manage"* · *"Whatever is finalized should be grouped together as well."* · *"you decide how it should be run and make it simple and easy to manage"* · *"so event details should be easy to understand. also add the guest settings. And what other details are collected throughout the event."* · *"3 way toggle Edit - OFF - View"* · *"Coordinator Access is Same as User Host of the event. so toggle is just yes or no. Always auto YES"* · *"Booked Vendor Access? is defined depending on the category they provide"* · *"follow our Text, Rules, and other font, buttons, colors accordingly."*

**Verdict: the page was not wrong — it was folded too deep and it edited the wrong thing.** Four folds held sections that held rows and a card; People with access sat three levels down under a supplier; seventeen rows wrote the Event Hub draft, which is why the Maker's Undo · Apply sat on a page that is not the Maker. The decision, firm: **the Suppliers / Guests shape — one segmented control (Event · Access · Settings), one body, one row shape, one tap deep.** A row is a label, a one-line summary, and one thing on the right: **›** (lives elsewhere — jump), **⌄** (unfolds here), or a **switch**. Choices are one dropdown inside the unfold. Nothing on the page writes the Event Hub draft, so Undo · Apply go. Put this away is the last row of every segment.

Prototype: `prototypes/event_details_arranged_2026-10-07_fable.html` (375; `?seg=event|access|settings`, `&open=<row>`, `&dark=1`, `&shot=1`), drawn with the app's own tokens read from `apps/web/app/globals.css` on `origin/main` (white page, ink #2C2A29, mulberry CTA #C24E25, line #E1DCD1, gold accent #A9834B, Hanken Grotesk; dark twins #17160F / #FBFAF7 / #E5794E). Screenshots in `prototypes/event-details-2026-10-07/`: `0-before-vs-after-event.png` · `1-event.png` · `1b-event-area-open.png` · `2-access.png` · `3-access-helper-open.png` · `3b-access-supplier-open.png` · `4-settings.png` · `5-settings-guests-open.png` · `6-put-away-open.png` · `7-dark-access-open.png`.

This designs **around** the EA build: EA's groups, its **Edit · Off · View** toggle per area and the coordinator switch are drawn as ruled; only the frame changes (a segment; each person an accordion).

---

## (a) Every block on the page today — where its editing lives · depth today → proposed · decision

Measured on `origin/main` `apps/web/app/dashboard/[eventId]/details/page.tsx` + `_components/` (`record-fold.tsx` = one fold open at a time). **Depth** = fold › section › row levels today, plus the rows scrolled past inside the open fold; proposed is always **one tap from the segment**.

| # | Block today | Where its editing lives now | Depth today → proposed | Decision |
|---|---|---|---|---|
| 1 | Masthead + sticky bar (names · kind · date · region · **Undo / Apply**) | the dock is the Maker's; it exists because 17 rows write the Hub draft (see (e)) | top → top (couple's line + segments, pinned) | keep the line; **remove Undo / Apply** |
| 2 | "Finish your Event Hub · 9 of 18 · Pick a stage" card | Maker › Stages | top (a card) → the *Event Hub* jump row's summary | **merge**, no box |
| 3 | How it looks › Font · Colours · Buttons | Maker › Studio › Look | 2 → gone | **remove** (*Event Hub* › jumps there) |
| 4 | How it looks › Cover photo · Logo · Music (doors) | Studio › Look · Logo | 2 → gone | **remove** |
| 5 | How it works › How guests get in · What to ask · Reply by | Guests › Setup (4d, built) + Studio › RSVP | 2 → Settings › **Guest settings** ⌄ | **move**, same editor (see (b)) |
| 6 | How it works › Papic · Gifts · Logo · Cover answers | Maker (Stages switches, Studio › E-Gifts) | 2 → gone | **remove** |
| 7 | How it works › Event Hub address | Studio › Info | 2 → gone | **remove** |
| 8 | Your event › Names · Kind · Area | Names → Studio › Info (10-07 "yes"); Kind · Area save live | 2 → Event: *Event name* › · *Area* ⌄ · *Kind* (Settled) | **keep** Area; Event name → jump; Kind → Settled |
| 9 | Your event › Date · Ceremony time · Venues | Suppliers (10-06 *"suppliers"*) | 2 → Event › Settled: *Date* › · *Venue* › | **jump** rows |
| 10 | Your event › Guests arrive · Reception · Love Story · Special message · Dress code | Studio › Schedule · Love Story · Info · Mood Board | 2 → gone | **remove** |
| 11 | Your event › Supplier payments | Budget | 2 → inside *Money* | **merge** |
| 12 | Guests & money › Your estimate · On your list · Guest list closes · How you see costs | here (estimate · cost view) · Guests › Setup (closes = reply by) | 2 (1st section) → Event: *Guests* › · Settled: *Guest count* · Settings: *Costs shown* ⌄ | **split** by kind |
| 13 | Guests & money › budget (4 rows + "Open Budget ›") | Budget | 2 (2nd section, ~5 rows down) → Event: *Money* › | **merge** to one row |
| 14 | Guests & money › suppliers (locked rows + "Open Suppliers ›") | Suppliers | 2 (3rd section, ~10 rows down) → Event › Settled: *Suppliers* › | **merge** to one row |
| 15 | **People with access** (card after the last supplier row) | here (EA) | **3** (fold › 3 sections › card, ~14 rows down) → the **Access** segment | **move** — its own segment |
| 16 | Guests & money › services (Pro · AI · Plan it myself · Papic) | here | 2 (5th section, ~18 rows down) → Event: inside *Purchases* ›; Settings: *Plan it myself* · *Papic* ⌄ | **merge** + split by kind |
| 17 | Guests & money › purchases | Orders | 2 (last section, ~22 rows down) → Event: *Purchases* › | **merge** |
| 18 | Put this away (card, last) | here | top (a card) → the last row of every segment, ⌄ | **keep**, un-boxed |

## (b) The page, plain English — my decisions, one reason each

**Pinned under the shell:** *Maria & Jose · Wedding · Fri 18 Dec 2026 · Quezon City* and **Event · Access · Settings** (`ISegmented`, tone wine). No title row on the phone (the Suppliers / Guests rule).

**Event** — what the event is. Two groups, plain headings:
- *Still yours to change:* **Event name** › (Studio › Info owns it; the Hub draws it) · **Area** ⌄ (one dropdown; saves at once) · **Event Hub** › *Classic · Cormorant · 9 of 18 in place* · **Guests** › *180 listed · 96 replied · 3 asking to join* · **Money** › *₱62,000 paid · ₱84,000 to go · target ₱180,000* · **Purchases** › *Pro · AI · Papic 40 of 50 · ₱2,499 paid*.
- *Settled* ⓘ ("Held by your bookings — a booked supplier counts on these. Contact support to change one."): **Date** › · **Venue** › (Suppliers) · **Suppliers** › *3 booked · names* · **Kind** · **Guest count**. Quiet type, no padlocks (`governed-fields.tsx` already carries the owner's *"no padlocks"*).
- Why: **Settled stays** — five locks become one note, and the first group is literally "what still needs me". **Purchases and Services merge** — both are what you bought from Setnayan. **Money is one line** — four numbers are the Budget page's job. **Event name is a jump** — it writes the Hub draft. A row moves to Settled by itself from its lock source ((f) names each).

**Access** — who may do what. Badge = people. Four eyebrows:
- *Hosts · every part* — owner (switch fixed on) · co-host (**Every part** switch; *Remove* = one dropdown of reasons).
- *Coordinator* ⓘ — **one switch, default on.** ⓘ: *"On — can change details and build the schedule. Off — sees only what you first shared."* (owner: same access as the host; yes/no; auto yes).
- *Helpers · some parts* — one accordion per person: **Area ⓘ** + **Edit · Off · View** (Off in the middle, EA's control) per area, and an *Access* switch (off ends it at once).
- *Booked suppliers · by what they provide* ⓘ — one accordion per supplier, **read-only** rows *Area · level* from the category matrix (`03_Strategy/Feature_Access_By_Vendor_Category_2026-06-12.md` § 7 + the 2026-10-03 additions): e.g. Documentary = Headcount Brief · Seat plan View · Schedule View, may suggest · Mood board View · Monogram View · Photos upload to the pool. ⓘ: *"Set by their category — the same for every supplier of that kind. Not changed here."* **Is the map in code?** Piecemeal, not as one table: `get_vendor_event_brief` (migration `20261128000000`, keyed on booked categories), `get_vendor_seat_plan` (`20261201003000`, floor-category gated), the booked-vendor live read on `event_schedule_blocks` (`20261130000000`), `lib/vendor-category-parents.ts` `parentsOfCategory`. There is **no single category → area → level table on `origin/main`** — PR-B adds one (`lib/supplier-access-by-category.ts`, mirroring § 7) and the rows read from it; EA is checking the same.
- *Add a person* = one dropdown of the guest list, last. Why a segment: it is what the owner came looking for and could not find; it never sits next to a supplier row again.

**Settings** — how it behaves. Four accordions and one switch, every choice inside a single dropdown:
- **Guest settings** ⌄ *Guests reply · asks 2 things · reply by 14 Jan* → How guests get in (the shipped five-choice `GUESTS_GET_IN_CHOICES`; "Guests reply" is inside it, so no separate switch) · Plus-ones · Ask meal choice · Ask dietary needs · Ask for a song · Reply by (date) · Headcount › (Guests › Setup finalize) · Requests to join › (Guests).
- **Event Hub** ⌄ *Live · up to Invitation · music on* → Live · Stages guests see ▾ · Music plays on open · Photos from guests.
- **Papic** ⌄ *On · 40 of 50 credits · shooting from 18 Dec* → Papic · Shoot before the day · Uploads open · Credits and window ›.
- **Costs shown** ⌄ (Realtime / Final only). **Plan it myself** (switch).
- Guest settings here: **one editor, two doors** — the same `GuestsGetIn` + asks + reply-by components and the same writer Guests › Setup uses (the pattern the owner approved for Studio › RSVP). Not a second store; cannot drift. Guests › Setup keeps its list jobs (invitations, share, finalize, requests). Passcodes: wait list (10-06), not drawn.

**Put this away** — last row of every segment, ⌄ to the shipped sentence and one button.

## (c) Recommendations — one word each

1. **Three segments.** Event · Access · Settings, pinned, one body.
2. **One row shape.** Label · one-line summary · › or ⌄ or switch; choices are one dropdown inside the unfold; help behind ⓘ.
3. **No Undo / Apply.** The 17 draft-writing rows leave; what stays saves at once.
4. **Settled.** One quiet group, one ⓘ note, membership computed from the lock source.
5. **Guest settings here, one editor** — the Guests › Setup components and writer, as a second door.
6. **Access is a segment** — Hosts · Coordinator (one switch, on) · Helpers (Edit · Off · View) · Booked suppliers (read-only by category); Put this away last everywhere.

## (d) Component map — reuse, never re-draw (every element → its shipped symbol; NEW where none ships)

| Element in the prototype | Shipped symbol on `origin/main` | Note |
|---|---|---|
| Shell bar (SETNAYAN · ? · ✉ · avatar) | the dashboard shell (as Guests / Suppliers) | unchanged |
| Couple's line + segmented control, pinned | `website/editor/_components/inspector-kit.tsx` `ISegmented` / `ISeg` (`iSegClass(on,'wine')`, `I_SEGMENTED_CLASS`) | the universal control (owner 10-07); pin like Suppliers; first tap = back to top (Button rule 6) |
| Jump row (label · summary · ›) | `details/_components/record-row-link.tsx` `RecordRowLink` (a `<Link>`, no `onClick`) | the › stays a link because it *navigates* (Button rule 1) |
| Accordion row (⌄, one open at a time) | `lib/one-open.ts` `useOneOpen` / `OneOpenScope` + the Guests `.fold` grid-rows unfold (4f `rd/guests-with-the-maker`) | `record-fold.tsx` retires; its header anatomy (title 15 px semibold · summary 13 px ink/55 · chevron) is kept |
| Dropdown inside an unfold | `website/editor/_components/pick-menu.tsx` `PickMenu` (`app/_components/link-pick-menu.tsx` when the pick navigates) | one PickMenu per choice; `guestsGetInOptions()` feeds the get-in one |
| Switch (on/off) | `launch/_components/plan-myself.tsx` `PlanMyselfSwitch` (`role="switch"`, saves at once) — the pattern; `app/_components/push-toggle.tsx` is the other shipped switch | **NEW** shared `Switch` extracted from `PlanMyselfSwitch`; tone ok (`--color-ok` as built #2B744A) |
| Edit · Off · View three-way toggle per area | **NEW** — EA builds it (`ISeg` three segments, Off in the middle, `setDelegateArea` behind it) | replaces the `AreaPicks` PickMenus in `people-with-access.tsx` |
| Coordinator yes/no | the Switch above over `removeHost` / the coordinator grant (`event_moderators` role `coordinator`) | default on; Off = "sees only what you first shared" (the brief) |
| ⓘ help | `app/_components/info-tip.tsx` `InfoTip` (+ `info-tip-state.ts`) | every helper line becomes one |
| Settled group | **NEW** `SettledGroup` (heading + one `InfoTip`); membership from `confirmedVendorCount > 0` (`governed-fields.tsx`), `events.date_status` / `date_forced_by_lock_of`, booked `event_vendors` | quiet ink/60 type, no padlock |
| Put this away | `details/_components/put-away-card.tsx` (copy, `setEventArchived`) | as the last accordion; the `rounded-2xl` box goes |
| Buttons (Put this away · Remove) | `ActionButton` — **in flight** on `rd/maker-button-rule` (`BUTTON_RULE_2026-10-07_fable.md`: pill, 40 px, icon + word, one colour per meaning); not on `origin/main` yet | reuse when merged; tone danger for Remove, neutral for Put this away |
| Counts in summaries (180 · 96 · ₱62,000) | `components/count.tsx` — **in flight** with the button rule (Rule 2: numbers count to their value) | plain text until it lands |
| First-visit tour | `app/_components/mini-tour.tsx` `MiniTour` + `lib/tours.ts` `TOURS` | three stops: the segments · a › · Access |
| Sheets (the date / venue stubs) | `app/_components/sheet.tsx`; `DateEditor` / `VenuesEditor` dialogs until Suppliers PR5 | never a new sheet |
| Copy | `brand.config.ts`; "Event Hub" · "supplier" · "event" · "book" | no "website", "vendor", "celebration", "lock" in UI copy |

## (e) Build plan — PR-sized, for a later Opus build (phone 375/390 first; guards from `apps/web`; changelog fragment + check card per PR; side-by-side + owner OK before merge)

**Sequence:** EA (Edit · Off · View, coordinator switch) → PR-A → PR-B → PR-C. Suppliers PR5 may land any time; until then the Date / Venue › rows open the shipped `DateEditor` / `VenuesEditor` dialogs. If `rd/maker-button-rule` has merged, use `ActionButton` and `Count`; if not, plain `<button>` + text, swept later.

**PR-A · `rd/event-details-three-segments`** — frame + Event.
- `details/page.tsx`: folds, sections, Finish card, slim bar → shell + couple's line + `ISegmented` (`?view=` like Guests' `?gview=`). Event body = the two groups; every › a `RecordRowLink` with its summary from the facts (`readHomeGuide` → Event Hub; the money formatter → Money; orders + entitlements → Purchases). *Area* keeps the live `settings` editor, unfolded in place. `HubDraftDock`, `overlayHubDraftEvent`, "Waiting for Apply", `RECORD_ROW_TOOL`, the Look / Works / Story / Schedule rows and `record-fold.tsx` retire. NEW `SettledGroup`.
- Guards: `the-record-is-four-folds-on-the-phone.test.ts` → `the-record-is-three-segments.test.ts` — the three words in order; no `<RecordFold`, `Section` or `sn-tile` in the body; every › is a `<Link>` outside `/details`; **no file under `details/` imports `hubDraftAction`, `HubDraftField` or `HubDraftDock`** (sabotage: re-import the dock → red); a Settled row mounts no editor (sabotage: give Kind a PickMenu → red). `every-fact-has-one-editor.test.ts` re-measured: editors = `settings` only.
- Check card: Event · Access · Settings under your names → *Money* › opens the Budget → back → *Area* ⌄ shows one dropdown → *Settled* ⓘ shows the one note.

**PR-B · `rd/event-details-access-segment`** — Access.
- EA's `people-with-access.tsx` as the Access body: four eyebrows; co-host and coordinator as switch rows; helpers as accordions with EA's toggle + `InfoTip` per area; suppliers as read-only accordions fed by NEW `lib/supplier-access-by-category.ts` (`accessForCategory(parent) → Array<{area, level, note}>`, a closed set mirroring § 7 + the 2026-10-03 rows; guard: every parent category in `vendor-category-taxonomy.ts` has a row, and every level is one of Brief · View · View + Suggest · Edit · Upload). Badge = people count.
- Guards: Access renders `<PeopleWithAccess` directly under the segment with no supplier booking row as a sibling; EA's tests untouched.
- Check card: *Access* → Kuya Ben → Seat plan → tap **Edit** → saves at once → the summary reads *Guests · Seat plan* → Lumen Studio → six read-only lines, no control.

**PR-C · `rd/event-details-settings-segment`** — Settings.
- Guest settings = the shipped `GuestsGetIn` PickMenu (`lib/who-can-reply.ts`) + the asks (`rsvp-ask.ts` → switches) + Reply by (`events.guest_list_edit_deadline`) + Headcount › + Requests › — **the same writer Guests › Setup calls, asserted by import**. Event Hub = Live (`launch_mode` / `manual_phase`), Stages guests see ▾ (`website_open_browse`), Music (`site_bg_music_enabled`), Photos from guests (`live_photo_wall_visibility`). Papic = `papic_on` · `papic_guest_capture_early` · `papic_uploads_open` · Credits ›. Costs shown ⌄ (`adaptive_pricing_mode`). Plan it myself (`PlanMyselfSwitch`). Put this away last in every segment. `MiniTour`.
- Guards: every switch maps to a boolean or two-value column (sabotage: render the five-choice get-in as switches → red); the tour key exists in `TOURS`.
- Check card: Settings → Guest settings → *Ask for a song* on → Guests › Setup shows it on → Put this away is last in all three segments.

**Not in scope:** EA's internals · Suppliers PR5 · the Maker · the button-rule sweep itself.

## (f) Every row that writes the Event Hub draft today → where it goes

`lib/event-details-record.ts` `RECORD_ROW_EDITOR` maps 22 rows to 14 editors; `every-fact-has-one-editor.test.ts` ("a saved row lands in the draft and counts in Apply") asserts **every editor except `settings` saves through `hubDraftAction` / `HubDraftField`** and that the page carries `<HubDraftDock>` for that reason — 17 of the 22 tappable rows write the draft.

| Rows (as shipped) | Editor | Writes | Goes to |
|---|---|---|---|
| Font · Colours · Buttons | `font` · `colours` · `buttons` | draft | Maker › Studio › Look (*Event Hub* ›) |
| How guests get in · What to ask · Guests reply by | `rsvp` | draft | Settings › Guest settings — **live**, the Guests › Setup writer |
| Papic · Gifts · Logo · Cover answers | `papic` · `gifts` · `logo-answer` · `cover-answer` | draft | Maker (Stages switches · Studio › E-Gifts · Logo) |
| Names | `names` | draft | Studio › Info (*Event name* ›) |
| Date · Ceremony time | `date` | draft | Suppliers (*Date* ›) |
| Ceremony venue · Reception venue | `venues` | draft | Suppliers (*Venue* ›) |
| Love Story · Special message | `love-story` · `special-message` | draft | Studio › Love Story · Info |
| Kind · Area · Estimate · List closes · Costs view | `settings` | **live** | stay (Area ⌄ · Costs shown ⌄ · Kind and Guest count in Settled) |
| Cover · Logo · Music · Guests arrive · Reception · Dress code (`RECORD_ROW_TOOL`) | none | nothing | leave |
| People with access · Plan it myself · Put this away | own actions | live | stay |

## (g) Every detail the platform collects about an event — and where the new page puts it

From `supabase/security/prod-schema.snapshot.txt` on `origin/main` (235 `events` columns + related tables; a Sonnet extraction, judged here; **column names measured, types inferred** — verify against a migration before relying on a type). One row per fact. **In Event Details as:** `setting` (editable here) · `settled` (shown, no editor, lock source named) · `jump` (summary + ›) · `summary` (inside another row's line) · `not shown` (reason). *Collected* = the surface that first writes it; *edited today* = the files that touch it.

| Detail (columns) | Collected | Edited today | In Event Details as |
|---|---|---|---|
| Event type · ceremony type / sub-type / mixed (`event_type`, `ceremony_type`, `secondary_ceremony_type`, `ceremony_sub_type`, `is_mixed_ceremony`) | onboarding `[type]` pickers / create-event | Maker `celebration-pick.tsx`, `nikah-actions.ts` | **settled** *Kind* — source: `ceremony_type_locked_at`; and `confirmedVendorCount > 0` (`governed-fields.tsx`) |
| Names (`bride_name`, `groom_name`, `display_name`, `celebrant_shape`, `honoree_*`) | onboarding | Maker `details-your-event.tsx`, `record-editor.tsx` (draft) | **jump** *Event name* › Studio › Info |
| Slug / Hub address (`slug`) | onboarding | Studio › Info | **summary** in *Event Hub* once live |
| Date (`event_date`, `event_end_date`, `event_date_precision`, `date_mode`, `date_window_*`, `date_candidates`, `date_status`, `date_forced_by_lock_of`, `auspicious_reasons`) | onboarding `date-calendar.tsx` | Maker date finder, `record-editor.tsx` (draft), supplier lock flow | **settled** *Date* › Suppliers — source: `date_status` / `date_forced_by_lock_of`; unlocked = same › row in the first group |
| Ceremony time (`event_schedule_blocks` first block) | Schedule | Schedule actions | **summary** in *Date* |
| Region / area (`region`) | onboarding `location-step.tsx` | Maker `details-city-pick.tsx`, settings, Suppliers, Budget | **setting** *Area* ⌄ (live) |
| Venues (`venue_name`, `venue_address`, `venue_latitude/longitude`, `venue_setting`, `ceremony_venue_*`) | onboarding `wedding-venues.tsx` | Maker, `record-editor.tsx` (draft) | **settled** *Venue* › Suppliers — source: a booked venue supplier (`event_vendors`) |
| Venue entrance on the blueprint (`venue_entrance_x/y`) | Seat plan | `seating/actions.ts` | **not shown** — a seat-plan coordinate |
| Guest estimate (`estimated_pax`, `headcount_basis`) | onboarding | `pax-settings-card.tsx`, `Dash/actions.ts` | **settled** *Guest count* — source: `confirmedVendorCount > 0`; unlocked = **setting** in the first group |
| Final headcount (`final_pax`, `guest_count_locked_at`) | Guests finalize | `finalize-guest-list-control.tsx` | **jump** *Headcount* › in Guest settings |
| Reply by / list closes (`guest_list_edit_deadline`) | Maker | `pax-settings-card.tsx`, `record-editor.tsx`, Guests › Setup | **setting** *Reply by* (same writer as Setup) |
| Costs view (`adaptive_pricing_mode`) | Maker | `pax-settings-card.tsx`, `details-settings-load.ts` | **setting** *Costs shown* ⌄ |
| How guests get in + asks (`rsvp_ask_config`) | onboarding default / Maker `maker-rsvp-ask.tsx` | Maker, Guests `invite-panel.tsx`, `record-editor.tsx`, `[slug]/actions.ts` | **setting** Guest settings (dropdown + switches) |
| Per-guest values (`guests.plus_one_*`, `meal_preference`, `dietary_restrictions`, `attire`, `side`, `role`, `rsvp_status`) | Guests add / import; the guest's reply | Guests card editors, `[slug]/actions.ts` | the values: **jump** *Guests* ›; the *asks*: switches in Guest settings |
| Requests to join (`event_access_requests`) | the public link | `guests/claims` | **jump** *Requests to join* › |
| Invitations / STD sent (`guests.invitation_sent_at`, `std_sent_at`) | sending | `sponsors/actions.ts`, Guests send | **not shown** — a list action, Guests owns it |
| Passcodes | — (wait list, 10-06) | — | **not shown** — wait list |
| Budget target / band / share (`estimated_budget_centavos`, `budget_band`, `share_budget_band`, `tracked_categories`) | onboarding pricing | Budget `budget-setter.tsx`, `share-budget-band-toggle.tsx` | **jump** *Money* › (target in the summary); the share switch stays in Budget (it is about suppliers seeing it) |
| Costs, payments, builds (`event_costs`, `event_vendor_payments`, `event_vendor_payment_plan`, `budget_builds`, `budget_allocation_*`) | Budget / Suppliers | Budget, Suppliers workspace | **summary** in *Money* |
| Planning mode (`planning_mode`) | onboarding | `Dash/actions.ts`, Suppliers build | **setting** *Plan it myself* |
| Booked suppliers and terms (`event_vendors`, `event_vendor_*`, `event_manual_vendors`, `event_category_decisions`) | Suppliers | Suppliers workspace | **settled** *Suppliers* › — source: booked / locked `event_vendors`; their access: Access › Booked suppliers (read-only by category) |
| Supplier date-change requests (`event_date_change_requests`) | Suppliers | Suppliers | **not shown** — a supplier flow |
| Look and theme (`style_preferences`, `mood_feel_key`, `invite_theme`, `site_*`, `moodboard_*`, `palette_finalized_at`, `dress_code_config`, `reception_design`, `cover_photo_wanted`, `logo_wanted`) | onboarding cards / Maker | Studio › Look, Mood Board, `hub-draft-actions.ts` | **summary** in *Event Hub* › (theme · font) |
| Monogram (`monogram_*`) | onboarding `mono-lockup.tsx` | Studio › Logo | **not shown** — the Maker's (via *Event Hub* ›) |
| Story and words (`love_story`, `special_message`, `signature_details`, `story_*`, `pabuya_message`, `what_to_bring`, `together_since`) | onboarding `weave-story.ts` | Studio › Love Story · Info | **not shown** — the Maker's |
| Hero / cover media (`landing_page_hero_*`, `our_photos`, `photo_wall_photos`, `couple_media_bytes`) | Maker / website hero | `hero-photo/actions.ts`, `living-hero/actions.ts` | **not shown** — the Maker's |
| Live / launch (`landing_page_visibility`, `launch_mode`, `scheduled_launch_at`, `manual_phase`, `website_open_browse`, `reveal_stages`) | website editor | `website/editor/actions.ts`, Studio › Info | **setting** Event Hub ⌄: *Live* · *Stages guests see* ▾ |
| Music (`site_bg_music_*`, `music_playlist_seed`, `pakanta_*`) | onboarding music step / Pakanta | Studio › Look, Pakanta | **setting** *Music plays on open*; the song itself: Maker |
| Save the Date film (`std_*`) | Studio › Save the Date | `save-the-date/actions.ts` | **not shown** — a Studio tool |
| E-gifts (`gifts_on`, `event_egift_methods`) | settings / gifts | `record-editor.tsx`, Studio › E-Gifts | **not shown** — Studio › E-Gifts owns on/off and the accounts (one home) |
| Prints (`print_details`) | Maker print menu | `print-menu-editor.tsx` | **not shown** — Studio › Prints |
| Papic (`papic_on`, `papic_window_*`, `papic_guest_capture_early`, `papic_uploads_open`, `papic_style/quality_tier/face_mode/storage_target`, `papic_*_cap_php`, `papic_guest_spend_*`, `pool_gallery_open`, `papic_guest_spend_ceilings`) | onboarding `papic-step-fields.tsx` / Papic | `studio/papic/actions.ts`, `app/papic/actions.ts` | **setting** Papic ⌄ (on · early · uploads); the rest **jump** *Credits and window* › |
| Papic consents (`face_tagging_declined_by_couple`, `recap_social_optout_at`) | Papic recap | Papic | **not shown** — live with the recap they govern |
| Photo delivery (`photo_delivery_*`, `photos_released_at`) | Studio › Photo delivery | `photo-delivery/actions.ts` | **not shown** — system / Studio |
| Live wall and Panood (`live_photo_wall_visibility`, `live_media_public`, `live_mode_override`, `wall_*`, `kwento_*`, `panood_*`, `live_studio_*`, `live_studio_overlay_settings`) | Live / Panood setup | `live/actions.ts`, `panood/setup/actions.ts`, `panood/control` | **setting** *Photos from guests*; the rest **not shown** — Live Studio's own setup |
| Seat plan (`seating_autoplace_enabled`, `seating_group_adjacency`, `gender_separation`, `event_floor_plan`, `event_tables`, assignments, constraints) | Seat plan / Nikah | `seating/actions.ts` | **not shown** — the Seat plan's; room size comes from the venue supplier (10-06) |
| Schedule and prep (`event_schedule_blocks`, `event_preparation_items`, `event_stage_notes`, `event_question_answers`, `event_activity_picks`, `event_meaningful_dates`, `event_appointments`, `event_checklist_items`) | Schedule | `schedule/actions.ts` | **not shown** — Studio › Schedule; ceremony time is a **summary** in *Date* |
| Entourage, sponsors, roles (`entourage_section_order`, `event_sponsors`, `role_names`, `role_palette`) | Guests / Sponsors | `march-actions.ts`, `sponsors`, `role-name-actions.ts` | **not shown** — Wedding March / Guest list |
| Access (`event_moderators`, `event_members`, `event_join_tokens`, `event_blocked_users`, `event_colour_grants*`) | People with access | `people-with-access.tsx`, `colour-access.ts` | **setting** — the Access segment (colour grants: not shown, Mood Board's) |
| Purchases and entitlements (`orders`, `event_software_activations_v2`, `setnayan_ai_*`, `concierge_*`, `event_render_credit_*`) | checkout | admin / billing | **jump** *Purchases* › |
| Put away (`archived`) | here | `put-away-card.tsx` | **setting** — the last row |
| Timezone, anchor / recurrence (`timezone`, `anchor_*`, `recurs`, `recur_cadence`, `previous_event_id`, `event_clusters`) | create-event / year-moments | `details-form.tsx`, `whats-next-actions.ts` | **not shown** — set at creation; revisit only if recurring events return to V1 |
| Birth data for bazi (`partner_*_birth_*`, `bazi_birthdata_consent_at`) | Maker details | Maker | **not shown** — sensitive; lives with the auspicious-date tool |
| Experience persona (`experience_*`) | onboarding only | nothing else writes it | **not shown** — never edited after onboarding |
| System / admin (`is_sample`, `is_surprise`, `showcase_*`, `cleared_*`, `wizard_state`, `roadmap_completed`, `master_qr_token`, `geolocation_enabled`, `event_feature_policy_override`, `event_deletion_requests`, `event_type_*`) | system / admin | admin, triggers | **not shown** — not the couple's |

Nine facts are editable in three or more places today (region, venue, date, estimate, budget target, planning mode, `rsvp_ask_config`, role palette, theme). After this design each has one editable home; Event Details shows a summary and a ›.

## Owner questions (recommendation first)

1. The Finish card's "9 of 18" becomes the *Event Hub* row's summary — changes the 10-04 ruling that it stays on top as a card. **Recommend: yes.**
2. Guest settings editable here as a second door to Guests › Setup (same components, same writer). **Recommend: yes** — it cannot drift; if you would rather one door, the accordion becomes one › row.
3. Supplier access rows need one category → area → level table in code (none exists). **Recommend: add it in PR-B** from § 7 of the 2026-06-12 doc + the 2026-10-03 rows; the RPCs keep enforcing, the table only *shows*.

## What was checked (re-measure before acting)

`git show origin/main:apps/web/app/dashboard/[eventId]/details/page.tsx` and `_components/{record-fold,people-with-access,put-away-card,governed-fields,record-editor,record-row-link}.tsx`; `the-record-is-four-folds-on-the-phone.test.ts`; `every-fact-has-one-editor.test.ts` (clause 5); `lib/event-details-record.ts`; `lib/who-can-reply.ts`; `lib/one-open.ts`; `lib/vendor-category-parents.ts`; `website/editor/_components/{inspector-kit,pick-menu}.tsx`; `app/_components/{info-tip,mini-tour,sheet,push-toggle}.tsx`; `launch/_components/plan-myself.tsx`; `apps/web/app/globals.css` tokens; `apps/web/components` (no `action-button.tsx` on main); migrations `20261128000000`, `20261130000000`, `20261201003000`; `supabase/security/prod-schema.snapshot.txt`; `BUTTON_RULE_2026-10-07_fable.md`; `03_Strategy/Feature_Access_By_Vendor_Category_2026-06-12.md` § 1 · § 3 · § 7 · § 10; memory `suppliers-one-screen-brief-2026-10-07.md`; `prototypes/home_and_guests_2026-10-07_fable.html`; `EVENT_DETAILS_STUDY_2026-10-04_fable.md` § 6; `DECISION_LOG.md` 2026-10-03 "SUPPLIER ACCESS MAP", 2026-10-04 "FOUR FIXES", PR #6341, 2026-10-06 "EVENT DETAILS IS REBUILT", "DATE AND VENUE LIVE IN SUPPLIERS", "PASSCODE … WAIT LIST", 2026-10-07 "STUDIO REDRAW ANSWERS", "EVENT NAME · MARIA & JOSE", "GUESTS › SETUP", "BUTTON-RULE TONES, AS BUILT"; `EVENT_HUB_MAKER_STAGES_STUDIO_BUILD_PLAN_2026-10-06.md`; `HOME_AND_GUESTS_CHECK_2026-10-07_fable.md` G24 · G31; `SUPPLIERS_HANDOFF_2026-10-07_fable.md`.
