# Event Website Generalization — the 3-Phase Strategy Beyond Weddings (Design)

> **Created 2026-06-13** with the owner, in-session. Companion to the canonical
> [`Wedding_Website_Lifecycle_Spec_2026-06-07.md`](Wedding_Website_Lifecycle_Spec_2026-06-07.md)
> (one site · one URL · three time-driven phases: **RSVP before · Event during · Editorial after**).
> This doc answers: *can the same 3-part concept serve the other event types, and what are the limits?*
>
> **✅ OWNER-RATIFIED 2026-06-13:** *"everything else can be added. but V1 will still be wedding.
> next year, we will strategically announce the other events unlocking."* — All event types in this
> doc are approved for future addition. **V1 surface stays weddings.** The other events unlock via
> **strategic announcements starting 2027** (staged marketing moments, not a silent flag-flip).
> Nothing here is a build directive yet; this is the groundwork so each 2027 unlock is cheap.

## 0. Owner rulings captured this session (2026-06-13)

| # | Ruling | Effect |
|---|---|---|
| R1 | **Travel = digital-services-only.** "There will be no vendors, just digital services that can be used for their travel." Papic is the **travel device**. | Travel drops the entire vendor layer (marketplace · reviews · showcase · M1/M2). Pure digital-services event. |
| R2 | **Tournament = multiple dates, services bind per date.** "Multiple services for different dates" — confirmed. | Services attach to an **event day**, not the event. Needs the in-season interstitial state (§4). |
| R3 | **All other event types are single-date — fine as-is.** | Debut · christening · birthday · anniversary · graduation · reunion ride the wedding chassis unchanged. |
| R4 | **Awards night = GALA, Emmy's style — the wanted flavor.** Corporate splits into two content packs: *conference* vs *gala/awards*. | Gala pack is the priority corporate flavor; conference pack is later. See §6. |

## 1. Verdict

The 3-part strategy generalizes because nothing in its **architecture** is wedding-specific:
the phase machine is date math (`getDayOfPhase(event_date)`), the page is a **widget × phase
matrix stored as data**, and the editorial is LLM-composed from structured inputs.
What IS wedding-specific is the **content layer**: the storyline interview (how-we-met ·
proposal), the couple-centric data model (`love_story`, `together_since`, monogram-as-couple-initials,
headline tense "Are Married"), Pakanta-as-love-song framing, and the faith branch (already
hard-guarded wedding-only in the taxonomy design).

**≈80% chassis reuse · ≈20% per-event content packs** + four structural changes (§7).

## 2. What carries over untouched

- **Phase machine** — every event type has a before/during/after.
- **Most of the §2 widget matrix** (lifecycle spec) — countdown · venue · schedule · what-to-wear ·
  guest QR card · RSVP form · Find My Table · Happening Now · coordinator broadcast · Live Photo
  Wall · Watch Live (Panood) · Papic gallery · thank-you · highlight reel. None know they're at a wedding.
- **Review system + vendor showcase + favorite-from-review flywheel** — event-bound, not
  wedding-bound. Cross-event-type it gets *stronger*: a debut guest favorites the caterer for
  her own future wedding. (Except travel — R1 removes the layer entirely there.)
- **Auto-editorial engine** — composition from facts + interview + reviews works for any
  celebration; rich/lean fallback and the T+3 launch rule carry over (T anchored to event END for
  multi-day types, §7).
- **The scoping mechanism already exists.** `applicable_event_types TEXT[] NULL = universal`
  (taxonomy design, [`Taxonomy_Event_Faith_Scoping_Design_2026-06-10.md`](Taxonomy_Event_Faith_Scoping_Design_2026-06-10.md)).
  The same column on the **widget catalog** yields per-event-type widget matrices — one column,
  no new architecture.

## 3. Travel — digital-services-only (R1)

Dropping vendors makes travel *cleaner*: it deletes exactly the layers that didn't fit
(marketplace, review flywheel, vendor showcase, M1/M2 impact metrics) and keeps the strongest part.

- **Papic as the travel device — the metadata spine already exists.** Every capture already
  stamps `captured_at` + `geo_*` + `device_model` (mandatory per the locked capture-metadata
  constraint). For weddings that's compliance plumbing; for travel it's **the product** — the trip
  journal organizes itself by day and place with zero manual input. Papic seats = travel companions.
- **Digital catalog that applies:** Papic (capture) · Patiktok / Guest Stories (short clips per
  stop) · highlight-reel compilation (SDE engine pointed at a trip) · Pakanta (trip song — fun,
  low-stakes upsell) · photo wall for group trips · **Editorial = the trip journal/magazine**.
  This is the **Kwento Magazine** shape (auto-composed page/PDF from captures + captions) —
  travel may be the vertical where that concept earns its keep first.
- **Phase reinterpretation:** RSVP phase → itinerary + "join the trip" via the existing QR
  join flow (companions, not guests — no RSVP form). Event phase → day-by-day live.
  Editorial → the journal.
- **⚠ Privacy default flips: travel sites are PRIVATE/UNLISTED by default, and arguably never
  public while the trip is live.** A public page broadcasting "this family is away from home
  until the 24th" is a burglary advertisement. Weddings default public; travel must not.
- Travel is the purest multi-day case → most needs the `event_start/event_end` range (§7).

## 4. Tournament — multi-date, per-day service binding (R2)

- **Model:** one tournament event with multiple **event days** (match days / legs / finals).
  Each day carries its own service activation — Panood on day 1 and day 3, Papic seats on finals
  day, photo wall each match day. **Services bind to an event day, not the event.**
- **The pricing primitive already supports it:** Panood is already priced **per day**.
- **One new phase state:** between match days the site is neither "before" nor "live" — it's
  **in-season** (standings · results so far · next-match countdown).
  Tournament lifecycle = `RSVP → [Live ⇄ In-season]× → Editorial` (season recap after the final).
- **Net-new widgets:** brackets/standings/results — the largest genuinely new build of any
  event type, which is why tournament sequences last (§8).
- **Per-day service binding quietly benefits others:** separate church/reception wedding days,
  3-day corporate summits, multi-day fiestas.

## 5. Single-date family/social types (R3) — debut · christening · birthday · anniversary · graduation · reunion

Ride the wedding chassis as-is. Per-type notes:

| Type | Notes |
|---|---|
| **Debut** | Near-perfect fit — single date, formal program, large guest list, same vendor pool, tradition-rich narrative (18 roses/candles/treasures feed the interview script + editorial). **Natural second vertical.** |
| **Christening** | Celebrant is a **minor** → guardian consent, default-unlisted editorial (§7.4). Godparents roster = a small RSVP-phase widget. |
| **Birthday / anniversary** | Recurring → accept **instance-per-year** (one site per event instance; slug per instance). No evolving-celebrant-page redesign for V1.x. Kids' birthdays share the minor-consent posture. |
| **Graduation / reunion** | "The journey" / "the years between" editorials — reunion recap is a standout artifact. Straight reuse otherwise. |

## 6. Corporate — TWO content packs · GALA is the wanted one (R4)

Corporate is not one shape. Split into:

- **Gala / Awards (Emmy's style) — OWNER-PICKED priority flavor.** Structurally closer to a
  wedding/debut than to a conference, and the model's best non-wedding fit:
  - **RSVP phase** → formal invitations · **nominees list** · dress code (What to Wear exists) ·
    **seating chart** — galas are table-seated, so the seat-plan editor + Find My Table transfer directly.
  - **Event phase** → **red carpet = Papic's single best non-wedding use case** (candid capture +
    face-tag + live photo wall) · winner announcements → coordinator broadcast or a small
    **winners ticker** widget · Panood livestreams the program.
  - **Editorial phase** → the newspaper front page was *made* for this: "BEST ACTRESS — …" lead
    headline, **winners roll**, red-carpet photo essay. Least editorial adaptation of any type.
  - **Only net-new widgets (all small):** nominees list (before) · winners ticker (during) ·
    winners roll (after).
  - Whether "awards" becomes its own `event_type` enum value or a flavor of `corporate` =
    **owner call at build time** (lean: flavor of corporate; enum stays stable).
- **Conference — later.** Agenda tracks · speakers · sponsors · registration-not-RSVP. Real
  net-new widget work; no current pull.

## 7. Structural changes the generalization needs (the limits)

1. **Single-date assumption → date range.** `getDayOfPhase()`, the T+48h interview window and the
   T+3 editorial launch all anchor to one `event_date`. Travel/tournament/multi-day corporate need
   `event_start/event_end`, with Editorial timing anchored to the **end**. The one genuine
   schema-level change — cheapest before more code couples to the scalar date.
2. **Celebrant/host abstraction.** `love_story {how_we_met, proposal, milestones}` ·
   `together_since` · monogram-as-couple-initials · byline · headline tense are couple-hardcoded.
   Generalize to 1..n honorees (debutante · child+parents · company · graduating class) + a
   per-event-type **interview script + headline pack**. Content authoring cost per type, not
   engineering cost — but real (the wedding onboarding redesign was a full design program).
3. **Editorial economics don't transfer.** The Editorial SKU is priced against a
   once-in-a-lifetime event with ~250 guests and 12+ vendors. A kids' birthday has 30 guests and
   2 vendors — M1/M2 "By the Numbers" collapses (the §9 hide-if-insufficient rule saves the render,
   not the value prop). **Per-event-type pricing = owner decision, batched into the holistic
   pricing pass — no numbers proposed here** (standing pricing-provisional rule).
4. **Minors + privacy (RA 10173).** Christening/kids-birthday celebrants can't consent for
   themselves. Family-event types default the Editorial to **unlisted/private** with explicit
   guardian consent to publish; face-tagging of child guests puts the **guardian** in the consent
   loop. **Gender reveal:** the secret is the point — the RSVP-phase site must be secret-safe.
5. **Recurring events** → instance-per-year (accepted, §5).
6. **Vendor-side thinness.** Non-wedding vendor coverage is thinner (marketplace is founder-only
   today) → early non-wedding editorials are media-and-story-led, not vendor-led; the Pro/Enterprise
   vendor upsell the Editorial creates arrives later for those verticals. (Travel: moot per R1.)

## 8. Sequencing recommendation (2027 staged unlock announcements — owner sign-off per step)

> Owner-ratified frame (2026-06-13): each unlock is a **strategic announcement** in 2027 — a
> marketing moment per vertical, not a quiet feature flag. The order below doubles as the
> announcement calendar candidate; owner picks the actual dates/cadence.

1. **Debut** — structurally a wedding; deep PH tradition; same vendor pool. Cheapest unlock.
2. **Gala / Awards (Emmy's style)** — leapfrogs conference; reuses seating + formal invites +
   Papic + editorial more than any other corporate shape. Three small new widgets.
3. **Christening + birthday** — as a "family events" pack sharing the minor-consent work.
4. **Travel** — digital-services-only; needs date-range + private-by-default; pairs with
   Kwento Magazine.
5. **Graduation / reunion / anniversary** — straight content packs.
6. **Tournament / conference** — last; largest net-new widget surface (brackets · agenda).

**Two cheap architectural moves worth making early** (additive now, expensive later):
- (a) `applicable_event_types TEXT[]` on the widget catalog **when the deferred per-phase
  `invitation_widgets` migration ships** (it's renderer-coupled and still pending — perfect timing).
- (b) `event_start/event_end` range instead of deepening scalar-date coupling.

## 9. Open items

- Awards: own enum value vs `corporate` flavor (lean: flavor) — decide at build time.
- Per-event-type pricing — **batched to the holistic pricing pass**; never invent interim numbers.
- Travel "never public while live" — hard rule or default-with-override? (lean: default-unlisted,
  public allowed only after trip end.)
- Tournament in-season state — extend `getDayOfPhase()` or a per-day derived sub-state once
  per-day service binding is designed.
