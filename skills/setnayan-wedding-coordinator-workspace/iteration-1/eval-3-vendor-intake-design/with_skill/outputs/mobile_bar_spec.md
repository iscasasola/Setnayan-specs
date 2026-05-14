# Mobile Bar / Bartender — Setnayan V2 Vendor Spec

A new vendor type for the Setnayan sync matrix. This spec follows the same Reads / Writes / Sync triggers / Blocked fields structure used for photographer, caterer, florist, etc. in `references/sync-matrix.md`, and proposes the corresponding additions to `references/vendor-types.md`, `references/data-model.md`, and `assets/sample_event.json`.

The vendor type is sketched in the existing matrix (line 230 of `sync-matrix.md`): *"Mobile bar / Bartender — guest count, drink preferences, allergens, venue, setup access."* This document is the full expansion of that one-liner.

---

## Why this vendor sits between caterer and band/DJ

Mobile bar is a hybrid. It eats from two existing patterns:

1. **Caterer-like fields:** guest count, allergens, vendor allowance count, reception venue access, headcount lock, kitchen/water access. The bar is a food-and-beverage vendor; it inherits the caterer's privacy posture (allergens yes, individual guest names no).
2. **Band/DJ-like fields:** reception start/end, run-of-show segments where alcohol is being served vs. paused (e.g., during ceremony, during the SDE screening many couples want a low-noise bar), setup window at reception, power requirements. The bar lives inside the reception-floor coordination layer with the band.

It does **not** read photo/video deliverables, the entourage list, the shot list, or the processional order. Those have no bearing on what gets poured.

The PH-specific wrinkle: Filipino weddings often have a distinct *salu-salo* / VIP-table treatment — the same upsell pattern the caterer matrix already flags. For the bar, this typically means a separate Ninong/Ninang welcome cocktail or a curated whisky/wine table for principal sponsors. The bar needs to know this exists, but it gets a **count and a treatment description**, never the names of the sponsors getting the special pour.

---

## Reads

Fields the mobile bar sees in their packet, derived from the canonical event:

- Event date and reception venue (name, address, type — tented vs. ballroom matters for ice and refrigeration logistics)
- Reception start time, reception end time
- Cocktail hour start time and duration (this is the bar's flagship segment)
- Last-call time (typically 30 min before reception end; coordinator-set)
- Final guest count broken down by **adults** and **children** — the bar only pours for adults; the child count is for non-alcoholic (mocktail) volume estimation
- Vendor allowance count — same PH norm as caterer; vendors are typically offered non-alcoholic drinks, sometimes a single beer at end-of-shift
- Aggregated **allergens and dietary flags relevant to drinks** — not the full caterer list, but the slice that matters at the bar:
  - Severe nut allergy (orgeat, almond syrups, frangelico)
  - Severe egg allergy (clarified cocktails, certain sours)
  - Halal count (avoid alcohol-forward service pattern, offer non-alcoholic alternative)
  - Pregnant guest count flag (for mocktail prep volume) — opt-in only, never names
  - "No pork" doesn't apply to the bar; the bar matrix should not even surface it
- Drink program preferences:
  - Service style: open bar, limited bar (beer + wine + 1 signature), or cash bar (rare in PH; flag it explicitly)
  - Signature cocktails (couple's "his/hers" drinks, with names)
  - Beer brands requested
  - Wine pairing preferences (with dinner) — coordinated with caterer's menu
  - Spirits list (whisky, rum, gin, vodka, tequila preferences)
  - Mocktail / non-alcoholic options
  - "Do not serve" list (e.g., no shots, no Jagermeister, no specific brand)
- VIP table treatment for principal sponsors / parents (count + treatment description, never names)
- Reception venue access window (setup start, breakdown end)
- Reception venue **power and water** specs (the bar needs both): outlets count, generator backup, water source proximity, ice supply (does the venue provide ice or does the bar bring it?)
- Allowed dB at reception (the bar may have a small portable speaker for cocktail-hour music in pre-band sets — coordinator decides)
- Run-of-show segments where the bar is `lead` or `supporting`:
  - Cocktail hour (lead)
  - Buffet dinner (supporting — wine service at table or open bar continued)
  - SDE screening (paused or low-key, per couple preference)
  - Toasts (champagne/wine pour for the toast — supporting)
  - Money dance / open dance (supporting, peak service)
  - Last call (lead — closes service)
- Coordinator contact, caterer contact (the two F&B vendors coordinate ice, glassware, and water access)

## Writes

Fields the mobile bar contributes back to the canonical event:

- `service.confirmed_call_time` — typically reception access window start (mobile bars need 90–120 min setup)
- `service.headcount_lock_date` — bar locks count separately from the caterer; usually the same date, but recorded distinctly because alcohol procurement has different lead times (some bars pre-order spirits 14 days out)
- `service.bar_count` — how many bar stations they're setting up (single vs. dual-bar for >200 guests)
- `service.bartender_count` — on-site team size (rule of thumb: 1 bartender per 75 guests for open bar, 1 per 50 for signature-cocktail-heavy)
- `service.signature_cocktail_names_confirmed` — final names + ingredients (after recipe-testing with couple)
- `service.estimated_consumption` — bottles of beer, bottles of wine, liters of spirits projected for the event (used for the budget tracker line item and for the venue's corkage calculation if applicable)
- `service.setup_breakdown_window` — confirmed setup start and breakdown end times
- `service.glassware_responsibility` — who provides glassware (bar / caterer / venue) — must be explicit because in PH this is often ambiguous and causes day-of friction
- `service.ice_responsibility` — who provides ice
- `service.corkage_status` — if the venue charges corkage on outside alcohol, has it been resolved
- `service.deliverables_summary` — the "what we're bringing" list: spirits, mixers, garnishes, glassware, bar station hardware
- `service.last_call_time_confirmed`

## Sync triggers

When these fields change on the canonical event, fire a diff message to the mobile bar:

- `reception.start_time` changes → "Reception now starts at {new}. Cocktail hour now {cocktail_start}-{cocktail_end}. Your call time: {call}. Last call: {last_call}."
- `reception.end_time` changes → "Reception ends at {new}. Last call moved to {last_call}. Breakdown window: {breakdown}."
- `reception.venue` changes → "Reception venue is now {new_venue}. Address: {address}. Power: {power}. Water access: {water}. Ice supply: {ice}. Setup access window: {access}. Confirm your station fits."
- `reception.av_setup` changes (specifically power/dB) → "Reception power setup is now {power}. Allowed dB: {db}. Confirm bar speaker plan."
- `guests.breakdown.adults` changes by >5% → "Adult guest count is now {new_adults}. Estimated consumption recalculated: {beer_bottles} beer, {wine_bottles} wine, {spirits_l}L spirits. Bartender count recommendation: {n}. Confirm before procurement deadline {date}."
- `guests.breakdown.children` changes by >5% → "Child guest count is now {new_children}. Mocktail volume estimate updated: {n} servings. Non-alcoholic offerings to confirm."
- `guests.breakdown.vendor_allowance` changes → "Vendor allowance is now {new}. Non-alcoholic vendor drinks projected: {n}. Confirm if any vendor end-of-shift beer is included."
- `guests.dietary_aggregated.nut_allergy_severe` or `egg_allergy_severe` changes → "Allergen count updated. Severe nut: {n}. Severe egg: {n}. Please confirm signature cocktails {names} are still safe; flag any swap needed."
- `guests.dietary_aggregated.halal` changes → "Halal guest count is now {n}. Non-alcoholic offerings to ensure parity at the bar; confirm presentation (separate jugs, labeled mocktails)."
- `bar_program.service_style` changes (e.g., open bar → limited) → "Bar service style changed to {new}. Updated pour plan: {plan}. Updated estimated consumption: {summary}."
- `bar_program.signature_cocktails` changes → "Signature cocktail list updated. Added: {added}. Removed: {removed}. Re-confirm recipe testing date {date}."
- `bar_program.do_not_serve` changes → "Do-not-serve list updated. Added: {added}. Removed: {removed}."
- `bar_program.vip_table_treatment` changes → "VIP table treatment updated. New treatment: {desc}. Count: {n}. No names shared."
- `caterer.menu_confirmation` changes → "Caterer menu confirmed: {summary}. Wine pairing recommendation to refresh; confirm with caterer contact {caterer.contact}."
- `run_of_show` segments touching cocktail / dinner / toast / SDE / dance change → "Run-of-show updated. Affected service points: {segments}. Updated pour plan: {plan}."
- `headcount_lock_date` (event-level, used by caterer) changes → "Bar headcount lock is also moving to {new_date} to align with caterer; confirm or push back."

## Does NOT see (blocked fields)

The bar does **not** receive any of the following, even if requested:

- `entourage.*` — the bar does not need names/roles of Principal Sponsors, Secondary Sponsors, MOH/Best Man, bridesmaids, groomsmen, bearers
- `family.*` — names of parents, siblings, grandparents are irrelevant to the bar
- `guests.individual_list` — the bar gets aggregates, never a per-guest list
- `guests.contact_info` — phone, email, addresses
- `dietary_aggregated` *fields irrelevant to the bar* — vegetarian, gluten-free, no-pork, halal-meat. The bar matrix only surfaces the slice that matters at the pour station (nut, egg, halal-presentation, pregnant flag).
- `shot_list` — the bar is not a media vendor
- `playlist.do_play` / `do_not_play` — bar music is a single line item (yes/no portable speaker, dB cap), not the full playlist
- `processional_order` — ceremony-only concern
- `ceremony.*` — except date/venue at the highest level for context. The bar does not operate during the Catholic ceremony.
- `prep.*` — bride/groom prep locations are private and irrelevant to the bar
- `vendor_payment_info` for other vendors
- `acknowledgments.deceased` / `absent` / `special_thanks` — host's domain
- `couple.bio` / `couple.intro_preference` — host's domain
- `unity_rites` details — officiant + photo/video domain

## PH-specific notes

- **Corkage is real.** PH hotel and resort venues frequently charge corkage on outside alcohol. The bar packet must surface the corkage status on the venue agreement so there are no day-of surprises. If the venue forbids outside alcohol, the bar shifts to a "service fee + venue stocks" model — capture this as a `corkage_model` field on the venue, not on the bar.
- **Vendor-to-vendor non-alcoholic offering.** PH norm: the bar offers vendors juice/soda/water during their shift, sometimes a single beer at end-of-shift (typically only after the couple sends off and the bar is breaking down). This is a known cultural detail and the bar should plan for it explicitly.
- **Last-call etiquette.** Filipino receptions often run past the contracted end-time. The bar's `last_call_time_confirmed` and the venue's hard-stop must be reconciled. The coordinator owns this conflict, but the bar needs the diff fired immediately when reception end-time slips.
- **Salu-salo / VIP welcome pour.** When `event.traditions.vip_pour = true`, the bar gets a treatment description and a count. Names of Ninongs/Ninangs stay with the host.
- **Parking and ice runs.** Tagaytay-class out-of-Manila venues often require a mid-event ice run. Surface the ice supply field as a hard requirement, not a nice-to-have.

---

## Proposed addition to the structured tail of `sync-matrix.md`

Add to the `vendor_types` object:

```json
"mobile_bar": {
  "reads": [
    "event.date",
    "reception.venue",
    "reception.start_time",
    "reception.end_time",
    "reception.cocktail_hour_start",
    "reception.cocktail_hour_duration_min",
    "reception.last_call_time",
    "reception.access_time",
    "reception.power_av_setup",
    "reception.allowed_db",
    "reception.water_access",
    "reception.ice_supply",
    "reception.corkage_model",
    "guests.breakdown.adults",
    "guests.breakdown.children",
    "guests.breakdown.vendor_allowance",
    "guests.dietary_aggregated.nut_allergy_severe",
    "guests.dietary_aggregated.egg_allergy_severe",
    "guests.dietary_aggregated.halal",
    "guests.dietary_aggregated.pregnant_count_flag",
    "bar_program.service_style",
    "bar_program.signature_cocktails",
    "bar_program.beer_brands",
    "bar_program.wine_preferences",
    "bar_program.spirits_list",
    "bar_program.mocktail_options",
    "bar_program.do_not_serve",
    "bar_program.vip_table_treatment",
    "run_of_show.bar_segments",
    "coordinator.contact",
    "caterer.contact"
  ],
  "writes": [
    "service.confirmed_call_time",
    "service.headcount_lock_date",
    "service.bar_count",
    "service.bartender_count",
    "service.signature_cocktail_names_confirmed",
    "service.estimated_consumption",
    "service.setup_breakdown_window",
    "service.glassware_responsibility",
    "service.ice_responsibility",
    "service.corkage_status",
    "service.deliverables_summary",
    "service.last_call_time_confirmed"
  ],
  "blocked_fields": [
    "entourage",
    "family",
    "guests.individual_list",
    "guests.contact_info",
    "dietary_restrictions.non_beverage",
    "shot_list",
    "playlist",
    "processional_order",
    "ceremony.unity_rites",
    "prep",
    "vendor_payment_info",
    "acknowledgments",
    "couple.bio"
  ]
}
```

## Proposed addition to `references/vendor-types.md`

Promote the existing one-liner to a full entry, parallel to Photo Booth / Live Painter:

> ## Mobile bar / Bartender
>
> A growing PH segment. Mid-market events with 150+ guests increasingly book a dedicated mobile bar separate from the venue's house bar.
>
> - **Typical package:** 4-hour open bar for 150–250 guests, including 1–2 bartenders, station setup, glassware, ice, basic spirits, beer, wine, and 1–2 signature cocktails. ₱40K–₱120K mid-market, ₱150K+ premium with custom cocktail program.
> - **Add-ons:** second bar station, branded napkins/coasters, custom ice, sommelier service, late-night espresso-martini push.
> - **Service styles:** open bar (most common), limited bar (beer/wine + signature), cash bar (rare; flag explicitly). Hybrid is normal — open beer/wine all night, signature cocktails for cocktail hour only.
> - **Deposit norms:** 50% reservation, balance 1–2 weeks before event. Some collect alcohol procurement budget separately because spirits are paid through the bar to the supplier.
> - **Lead times:** spirits and specialty wine procurement 10–14 days; signature-cocktail recipe testing 4–6 weeks out.
> - **Setnayan notes:**
>   - Coordinates with caterer on glassware, ice, and wine pairing — both are F&B vendors and need each other's contact
>   - Receives only the **slice of allergen data relevant to drinks** (nut, egg, halal-presentation, pregnant count). Never receives the full caterer dietary list.
>   - Receives only **counts** for VIP table pour, never names of sponsors
>   - Corkage status with the venue is a hard prerequisite — surface it on intake and on every packet
```

## Proposed addition to `references/data-model.md`

Two new top-level concerns:

1. A `bar_program` block on the event (parallel to `theme`, `playlist`):

```json
"bar_program": {
  "service_style": "open_bar",
  "signature_cocktails": [
    { "name": "Mariel's Mango Spritz", "base": "gin", "notes": "low ABV, no nuts" },
    { "name": "Joaquin's Old Fashioned", "base": "whisky", "notes": "smoked rind garnish" }
  ],
  "beer_brands": ["San Miguel Pale Pilsen", "San Mig Light", "Asahi"],
  "wine_preferences": { "red": "Spanish tempranillo", "white": "Sauvignon Blanc" },
  "spirits_list": ["whisky", "gin", "rum", "vodka"],
  "mocktail_options": ["calamansi cooler", "dalandan fizz"],
  "do_not_serve": ["Jagermeister", "shots after 22:30"],
  "vip_table_treatment": { "enabled": true, "count": 12, "treatment": "welcome whisky pour for Ninongs/Ninangs and parents" },
  "cocktail_hour_start": "18:30",
  "cocktail_hour_duration_min": 60,
  "last_call_time": "22:30"
}
```

2. New venue fields on `venues.reception` (these are venue-attributes, not bar-attributes — but the bar reads them):

```json
"water_access": "kitchen tap, 8m from bar station",
"ice_supply": "venue provides 50kg, bar brings overflow",
"corkage_model": "outside alcohol allowed, no corkage"
```

3. Add `pregnant_count_flag` (an integer count, opt-in) to `guests.dietary_aggregated`. Names never stored.

4. Run-of-show segments gain a `lead`/`supporting` for `mobile_bar`. The schema is unchanged; the script that derives the bar's packet filters on `mobile_bar` membership.

## Proposed addition to `assets/sample_event.json`

A new vendor object in the `vendors` array (full shape in `event_json_additions.md`). The Mariel & Joaquin event has 218 confirmed adults out of 280 — well into the size band where a dedicated mobile bar is normal.

---

## Reasoning grounded in existing patterns

- **Reads slice mirrors caterer + band/DJ.** The bar reads reception time/venue/access (from caterer pattern) and run-of-show music-adjacent segments (from band pattern). It deliberately does *not* read the full caterer dietary breakdown — only the drink-relevant slice — which is the same privacy-by-design move the photographer matrix makes (no dietary data) and the band matrix makes (no shot list).
- **Writes follow the standard service-confirmation pattern.** Confirmed call time, team size, deliverables — same shape as photographer/caterer/florist. New vendor-specific fields (consumption estimate, corkage status, glassware/ice responsibility) are additive; they don't change the schema's spine.
- **Sync triggers fire on the same axes existing vendors fire on.** Reception time, venue, guest-count breakdowns, dietary aggregates — these are already canonical sync axes. The bar adds *bar_program* as a new axis, which is internally-owned (the couple writes it via the intake form).
- **Blocked fields enforce the same need-to-know rule.** Cross-cutting privacy rule #2 ("dietary/medical only to food vendors") puts mobile bar in the same tier as caterer for the relevant slice, but rule #1 ("guest contact only when needed") still excludes individual guest data. The bar gets aggregates, never names.
- **PH-specific upsells (VIP pour, vendor-allowance non-alcoholic) follow the salu-salo and vendor-allowance precedents** the caterer matrix already encodes.
- **Coordinator stays the spine.** The bar messages the coordinator, never another vendor directly. The coordinator dashboard reads everything (per the matrix's coordinator entry: `"reads": ["*"]`).
