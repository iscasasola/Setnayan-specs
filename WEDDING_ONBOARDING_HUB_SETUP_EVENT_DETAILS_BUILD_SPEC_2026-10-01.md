# Wedding Onboarding → Event Hub Setup → Event Details — BUILD SPEC (2026-10-01)

**Status: OWNER-APPROVED 2026-10-01** — *"okay i am happy and just make sure everything is together and properly mapped and built and connected"*.
Source of every ruling: `DECISION_LOG.md` rows dated 2026-10-01 from "EVENT HUB SETUP IS DRAWN WEDDING-FIRST" to the end (grep `2026-10-01` and read the tail). This spec outranks any handoff. **Wedding first**; other event types after the wedding ships (same engine, EventWords, `DETAILS_ITEM_APPLIES`, `event_hub_per_type_2026-10-01_fable`).

## The three approved designs (open each before building — zero-JS HTML)
| # | Design | File (corpus `prototypes/`) |
|---|---|---|
| A | Wedding onboarding — clickable, design-your-Hub + services + one bill | `wedding_onboarding_interactive_2026-10-01_fable.html` (+ `.png` contact sheet) |
| B | Event Hub setup ("Finish your Event Hub") — only what A did not ask | `finish_your_event_hub_v2_2026-10-01_fable.html` (+ `.png`) |
| C | Event Details — one information-only sheet on Event Home | `event_details_one_page_2026-10-01_fable.html` (+ `.png`) |

## THE ONE RULE — ask every fact once, store it where its app already reads it
No setup-only table, no copy, no sync job. A → B → C and the Maker all read/write the SAME field. A fact answered in A (or on the account, or by a booked supplier) is never asked again in B and is shown in C.

## THE MAP — question → where it is stored → who reads it
Columns are the ones the shipped wedding commit writes (`app/onboarding/wedding/actions.ts`, the `events` upsert) unless marked ⚠ VERIFY (builder greps before writing; if no field exists, STOP and ask — never invent a column for a fact that already has a home).

| Asked in | Question | Stored in | Maker / app place | Event Details row |
|---|---|---|---|---|
| A1 | Who's getting married? | `events.bride_name` · `groom_name` | Details › Your event › Names | The basics |
| A2 | What kind of wedding? ▾ | `ceremony_type` · `ceremony_sub_type` · `is_mixed_ceremony` · `secondary_ceremony_type` | (faith/rite) | The basics |
| A3 | When is it? — shipped `app/onboarding/_shared/date-calendar.tsx` (hot dates, 1–4 dates or ≤30-day range) | `date_mode` · `date_candidates` · `date_window_start/end` · `event_date` once settled | Date picker on the event dashboard (`find-date`, `date-selection`) settles; Details › Date | Key dates |
| A4 | Where will it be? Area ▾ (`wedding-cities`) | `region` · `venue_latitude/longitude` (area centroid until a reception pin) | supplier search | The basics |
| A4b | We already have our venue → Parish ▾ / Reception ▾ (free on candidate dates, nearest first, chained, ~15 min, ceremony ≈1 h) · Add it yourself (locks) · Find one (lock request) · I'll pick later | locked supplier (Bench lock / manual supplier `new-manual-vendor-modal.tsx` + `AddressPinField`) — ⚠ VERIFY which table the Lock writes | Details › Venues reads **LOCKED ONLY** | Venues |
| A5 | How do guests get in? ▾ Guest list · Guest list + requests · Open event | ⚠ VERIFY the Guest-list mode setting (first-visit pop-up "Only my list / Anyone, I approve") + the one-QR entry (2026-09-30 "HOW RSVP OR NOT IS SET") | Guest list mode · RSVP "who can reply" · event QR | Guests |
| A6 | About how many guests? − [n] + (10–500, step 10) | `estimated_pax` | Papic sizing · Budget | Guests (estimate vs listed) |
| A7 | About how much is your budget? ▾ (`budget_band_config` per-head × estimate) | `budget_band` · `estimated_budget_centavos` | Budget page | Budget |
| A-Hub | Cover photo (= main background) | hero photo + `saveMain` (hub draft `main`) | Hero + Behind every scene | Your Event Hub look |
| A-Hub | Theme ▾ (free pre-picked) | `invite_theme` | Theme | look |
| A-Hub | Colours ▾ / "My supplier will fill this in" | `role_palette` / Mood Board | Mood Board | look |
| A-Hub | Fonts: Header ▾ · Text ▾ · Accent ▾ | ⚠ VERIFY — the font-dropdown work (#6160) owns the field; roles must be WIRED (today only heading + 5 themes' labels are; body/script are not — CURRENT-STATE §1 "THEME FONTS ARE ONLY HALF WIRED") | Theme / fonts | look |
| A-Hub | Music ▾ (admin tracks per type) | ⚠ VERIFY hub music field (Main › music) | Main › music | look |
| A-C | Event Hub Pro · Setnayan AI · Papic (− [pack] + , nearest pack, ties up, ≤100,000) | ONE order — `lib/onboarding-services-orders.ts`; price = `lib/onboarding-discount.ts`; sizing = `lib/papic-pool-sizing.ts` | More / services | Services · Purchases |
| B1 | When should guests arrive? | Schedule ceremony block (`blockTime`) — ⚠ VERIFY | Schedule | Key dates |
| B2 | Parish / Reception (only if not locked) — Add it yourself · From your shortlist · Find more · I'll pick later | same as A4b | Venues (locked only) | Venues |
| B3 | Love Story — 4 chapters (first meet · became together · memorable moments (+ events together) · engagement unless on account), each Date · Story · Media | `love-story-moments` (`lib/love-story-moments.ts`; add a `together` chapter between `met` and `falling`) | Details › Love Story | Love Story |
| B4 | What everyone wears — from the Mood Board | `dress_code_config` (`DressCodeListsForm`) | Mood Board | What everyone wears |
| B5–6 | What to ask guests ▾ · Reply-by (guest-list paths only) | RSVP stage settings · `guest_list_edit_deadline` | RSVP stage | RSVP · Key dates |
| B7 | Guest names (template) | `guests` | Guest list | Guests |

## Behaviour (all approved)
- **Music** on every onboarding: the shipped `OnboardingMusic` in the one engine, admin track list per type, wake starts off.
- **Prefill:** opening the Maker after A/B shows everything filled (same fields). A guard test asserts each A/B step writes the Maker's own field.
- **Unlocks:** each B step names what it turns on; the Hub/Maker show "Locked — finish ___" until then (filled-in, never a paywall).
- **Only LOCKED venues appear on the Event Hub**; a pending pick reads "Waiting for the venue to confirm".
- **Where B lives:** offered once right after A (Start / Later) · slim Home card "Finish your Event Hub — n of m · Continue" · the Maker's What's left. All three open the same steps. *(Owner-approved default 2026-10-01.)*
- **C — AMENDED 2026-10-04 (DECISION_LOG "YES TO ALL" + "EVENT DETAILS / MAKER: FOUR FIXES BEFORE BUILD"; study `EVENT_DETAILS_STUDY_2026-10-04_fable.md` § 7 PR-1): the rows are EDITED IN PLACE.** Every row opens the SAME field the Maker opens for that fact (phone: the half sheet over the record; desktop: in place under the row), drafted, published at Apply (the record carries Undo · Apply). On the phone the record is FOUR folded groups — How it looks · How it works · Your event · Guests & money — one line + summary each, one open at a time, the Finish-your-Event-Hub card on top; desktop keeps the groups open. Only the guest names, Budget, Suppliers, Services and Purchases keep their one quiet "Open … ›". Studio-sized facts (background, logo, music, the schedule's times, what everyone wears) open their studio from the row until their own PR. The line below is the 2026-10-01 original, kept for the record — superseded where it says "information only".
- ~~**C = information only.**~~ Every collected fact; one quiet "Open … ›" link per section to the page that handles it (deliberate exception to no-link-out); no suggestions; empty = "Not set yet"; locked rows 🔒. Button **Event Details** beside the event name on Event Home. Replaces the shipped `/dashboard/[eventId]/details` ("Personalization") — fix its live bugs: Ceremony venue "Not set" while booked, Reception shows the setting type, "vendors".
- **Prices** only from `platform_retail_catalog_v2` (set-up price via `onboarding-discount`); the set-up price ends when onboarding ends.

## Owner actions (not code)
- Admin › Pricing › Papic shot prices › "Credits recommended, by kind of celebration" › **wedding · At most = 100000** › Save. (Measured 2026-10-01 after the owner's look: still 30000. NOT the shot-price ladder above it — that ladder already reaches 100,000 and is what the − / + steps through.)
- The − / + stepper steps through EVERY active `PAPIC_GUEST_*` pack (100 · 200 · 300 · 400 · 500 · 1,000 · 2,000 · 3,000 · 4,000 · 5,000 · 6,000 · 7,000 · 10,000 · 20,000 · 30,000 · 50,000 · 100,000), read live — the prototype drew only 5,000+.

## Small calls — OWNER-APPROVED as the controller's defaults (2026-10-01: *"approved, use your defaults"*)
- Name clash: Event Details vs the Maker's "Details" tab [rename the Maker tab "Your info"].
- Event Details: how many supplier payments in Key dates [next 2] · refused coordinator sees "Hidden by the couple" under Budget [yes] · lock sheet keeps "Contact support" [yes] · "Open Services ›" / "Open Purchases ›" targets [the More sheet's services rows / the orders list].

## Build lanes (builders = Opus; one heavy job at a time on this Mac; each lane its own PR off origin/main; phone 375/390 first)
1. **Onboarding engine (A)** — rebuild the wedding flow on the approved cards; reuse DateCalendar, wedding-cities, budget_band_config, OnboardingMusic, onboarding-services-orders. Depends: guests-mode field (A5).
2. **Venues & locks (A4b/B2)** — date-filtered, chained, nearest-first lists on `searchOnboardingReceptionVenues` (+ parishes via the `church_fees` supplier type); Add-it-yourself = locked manual supplier; Venues read locked only.
3. **Event Hub setup (B)** — extends the Maker's What's left (`lib/details-guided-flow.ts`); the Home card; Unlocks; Love Story `together` chapter.
4. **Event Details (C)** — replace `/details` with the one sheet; Home button.
5. **Fonts wiring** — with #6160: Header · Text · Accent wired on every theme.
Each lane: changelog fragment, the prefill guard, a check card for the owner, timed phone walk-through on a TEST event (never cale-ice).
