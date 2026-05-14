# Event JSON Additions for Mobile Bar Vendor Type

This document specifies the exact JSON shape changes required to integrate Mobile Bar / Bartender into the canonical event object, and shows what `assets/sample_event.json` (Mariel & Joaquin) would look like with those additions applied.

The additions follow the existing schema conventions in `references/data-model.md`:
- Times are `HH:MM` 24-hour, Asia/Manila local
- Money is integer PHP
- IDs use the `v_` prefix for vendors
- The `vendors` array embeds the service object the vendor provides
- New top-level concerns (like `bar_program`) sit alongside `theme` and `playlist`, not nested inside vendors — because the program is the couple's, not the vendor's

---

## 1. New top-level block: `bar_program`

A peer of `theme`, `playlist`, `acknowledgments`. Insert after `playlist` for readability.

```json
"bar_program": {
  "service_style": "open_bar",
  "cocktail_hour_start": "18:30",
  "cocktail_hour_duration_min": 60,
  "last_call_time": "22:30",
  "signature_cocktails": [
    {
      "name": "Mariel's Mango Spritz",
      "base": "gin",
      "ingredients": ["gin", "ripe carabao mango", "calamansi", "soda water"],
      "notes": "low ABV, no nuts, no egg",
      "couple_attribution": "partner_a"
    },
    {
      "name": "Joaquin's Old Fashioned",
      "base": "whisky",
      "ingredients": ["Suntory Toki", "demerara syrup", "Angostura bitters", "smoked orange peel"],
      "notes": "stirred, smoked rind garnish",
      "couple_attribution": "partner_b"
    }
  ],
  "beer_brands": ["San Miguel Pale Pilsen", "San Mig Light", "Asahi Super Dry"],
  "wine_preferences": {
    "red": "Spanish tempranillo (mid-shelf)",
    "white": "Sauvignon Blanc (NZ or Chilean)",
    "sparkling_for_toast": "Cava (toast pour only)"
  },
  "spirits_list": ["whisky", "gin", "rum", "vodka"],
  "mocktail_options": ["Calamansi Cooler", "Dalandan Fizz", "Cucumber Tonic"],
  "do_not_serve": ["Jagermeister", "shots after 22:30", "any energy drink mixers"],
  "vip_table_treatment": {
    "enabled": true,
    "count": 12,
    "treatment": "Welcome whisky neat pour (Suntory Toki) for Ninongs and Ninangs; sparkling for the four parents. Served at the VIP table 18:30–18:45.",
    "names_disclosed_to_bar": false
  }
}
```

**Schema notes:**
- `signature_cocktails[].couple_attribution` — `"partner_a"`, `"partner_b"`, `"shared"`. Lets the host script say "Mariel's signature cocktail" without the bar needing the couple's bio.
- `vip_table_treatment.names_disclosed_to_bar` — defaults to `false`. The bar gets count + treatment, never names.
- `cocktail_hour_*` are derived from the run-of-show but pinned here so they survive run-of-show edits.

## 2. Additions to `venues.reception`

The bar reads three new venue fields. These belong on the venue, not the bar, because they describe the venue.

```json
"venues": {
  "reception": {
    "...existing fields...": "...",
    "water_access": {
      "available": true,
      "source": "kitchen tap",
      "distance_to_bar_zone_m": 8
    },
    "ice_supply": {
      "venue_provides_kg": 50,
      "bar_brings_overflow": true,
      "ice_run_plan": "vendor will pre-stage 30kg overflow at 13:00 setup; coordinator can call additional run if needed"
    },
    "corkage_model": {
      "outside_alcohol_allowed": true,
      "corkage_fee_php": 0,
      "notes": "Resort allows outside alcohol with no corkage; venue does not stock spirits"
    }
  }
}
```

## 3. Additions to `guests.dietary_aggregated`

Two new opt-in counts the bar reads. Names never stored.

```json
"guests": {
  "...existing fields...": "...",
  "dietary_aggregated": {
    "vegetarian": 12,
    "halal": 3,
    "gluten_free": 2,
    "nut_allergy_severe": 1,
    "no_pork": 8,
    "egg_allergy_severe": 0,
    "pregnant_count_flag": 4
  }
}
```

`pregnant_count_flag` is opt-in via the RSVP form; defaults to 0 (not surfaced in the intake) until at least one guest opts in. Used by the bar for mocktail prep volume estimation. Never names. Never disclosed beyond the bar and caterer.

## 4. New vendor object in `vendors[]`

Append to the `vendors` array. Mirrors the shape of the caterer and band/DJ entries.

```json
{
  "vendor_id": "v_alon_bar_co",
  "business_name": "Alon Mobile Bar Co.",
  "service_type": "mobile_bar",
  "primary_contact": {
    "name": "Iggy Bautista",
    "phone": "+639170000009",
    "email": "iggy@alonbar.ph"
  },
  "service": {
    "package": "Open bar, 4-hour service, 2 stations, 3 bartenders, 2 signature cocktails",
    "deliverables": "Spirits + beer + wine + mocktails + glassware + station hardware; signature cocktail recipe testing included",
    "service_style": "open_bar",
    "bar_count": 2,
    "bartender_count": 3,
    "call_time_requested": "16:30",
    "call_time_confirmed": "16:30",
    "on_site_duration_hr": 7,
    "setup_window": { "start": "16:30", "end": "18:00" },
    "breakdown_window": { "start": "23:00", "end": "23:45" },
    "last_call_time_confirmed": "22:30",
    "headcount_lock_date": "2026-11-04",
    "signature_cocktail_names_confirmed": ["Mariel's Mango Spritz", "Joaquin's Old Fashioned"],
    "estimated_consumption": {
      "beer_bottles": 240,
      "wine_bottles_red": 18,
      "wine_bottles_white": 24,
      "wine_bottles_sparkling_toast": 8,
      "spirits_l_whisky": 4.5,
      "spirits_l_gin": 3.0,
      "spirits_l_rum": 2.0,
      "spirits_l_vodka": 2.5,
      "mocktail_servings": 80
    },
    "glassware_responsibility": "bar_provides",
    "ice_responsibility": "split_venue_and_bar",
    "corkage_status": "no_corkage_resolved",
    "deliverables_summary": "2 portable bar stations, full glassware, ice transport, all mixers and garnishes, branded bar mats with couple's monogram"
  },
  "payment": {
    "total_php": 95000,
    "reservation_paid": true,
    "reservation_amount_php": 30000,
    "reservation_paid_date": "2026-04-05",
    "down_paid": false,
    "down_amount_php": 35000,
    "down_due_date": "2026-09-14",
    "balance_paid": false,
    "balance_amount_php": 30000,
    "balance_due_date": "2026-11-07"
  }
}
```

**Notes on the vendor object:**
- `service_type: "mobile_bar"` is the new enum value. The vendor-packet generator script keys off this string.
- `service.package` mirrors how caterer/band describe their package.
- `estimated_consumption` is the bar's *write*, not the couple's *read*. The couple sees the rolled-up number in the budget tracker, not the spirit-by-spirit breakdown.
- `headcount_lock_date` aligns with the caterer's headcount lock (`2026-11-04`) so the coordinator has one date to manage.
- `payment` block follows the standard reservation/down/balance pattern. Total ₱95,000 sits inside the typical PH mobile-bar mid-market range (₱40K–₱120K) per the proposed `vendor-types.md` entry.
- The bar comes *after* the caterer in budget terms but is the seventh-largest line item on this event. Total budget impact: 95,000 / 1,800,000 = ~5.3% of the target budget.

## 5. Additions to `run_of_show[]`

The existing run-of-show segments need `mobile_bar` added to their `lead`/`supporting` arrays where appropriate. Here's the diff against the current sample event:

| Time | Segment | Existing lead | Existing supporting | Add `mobile_bar` to |
|---|---|---|---|---|
| 18:30 | Cocktail hour + arrival | caterer | photographer, videographer, band_dj | **lead** (the bar IS the cocktail hour) — promote bar to co-lead with caterer |
| 19:30 | Couple's grand entrance | host | photographer, videographer, band_dj | (no change — bar is mid-pour, not on cue) |
| 19:45 | Welcome remarks + first dance | host | photographer, videographer, band_dj | supporting (champagne pour for parents' welcome toast) |
| 20:00 | Buffet dinner | caterer | band_dj | supporting (wine service at table or open-bar continued) |
| 21:00 | SDE screening | videographer | host | supporting (low-volume service during screening) |
| 21:10 | Toasts + parents' dance | host | band_dj, photographer, videographer | supporting (toast pour) |
| 21:40 | Money dance | host | band_dj, photographer | supporting (peak service) |
| 22:00 | Garter + bouquet toss | host | band_dj, photographer | supporting |
| 22:15 | Open dance + cake cut | band_dj | photographer, videographer | supporting (final hour, last call at 22:30) |
| 22:45 | Sendoff with sparklers | coordinator | photographer, videographer | (no change — bar is breaking down by 23:00) |

The `generate_vendor_packet.py` script filters run-of-show segments where the vendor type appears in `lead` or `supporting`. So the mobile bar packet would surface every row above where `mobile_bar` is listed.

Two new run-of-show entries should also be added explicitly to make the bar's lifecycle legible:

```json
{ "time": "16:30", "duration_min": 90, "segment": "Mobile bar setup", "location": "venues.reception", "lead": ["mobile_bar"], "supporting": [] },
{ "time": "23:00", "duration_min": 45, "segment": "Mobile bar breakdown + cleanup", "location": "venues.reception", "lead": ["mobile_bar"], "supporting": [] }
```

## 6. Budget tracker addition

Per the V1 spec, the budget categories are: Venue, Catering, Photography, Videography, Wedding Coordinator, Stylist, Hair & Makeup, Band/DJ, Host, Attire, Rings, Stationery, Souvenirs, Transportation, Miscellaneous.

The mobile bar fits cleanly under **Catering** as a sub-line, OR under **Miscellaneous**. Recommendation: introduce a new top-level category **Bar / Beverage** in V2. Rationale:
- Couples increasingly book a separate mobile bar from the food caterer, so rolling them up under Catering distorts the per-vendor budget view
- The line item is large enough to deserve its own category (₱40K–₱150K range)
- Tracking corkage as a venue-level cost vs. a bar-level cost is cleaner with a separate category

Add to the V2 budget categories list: `Bar / Beverage`. Mariel & Joaquin's bar at ₱95K becomes one line in this category.

## 7. Change-log entries the diff script would emit

When `bar_program.signature_cocktails` is added/changed, the change-log gets a row:

```json
{ "ts": "2026-04-12T14:00:00+08:00", "field": "bar_program.signature_cocktails", "from": "[]", "to": "[Mariel's Mango Spritz, Joaquin's Old Fashioned]", "by": "couple" }
```

When the bar is first added as a vendor:

```json
{ "ts": "2026-04-15T10:00:00+08:00", "field": "vendors", "from": "8 vendors", "to": "9 vendors (+ Alon Mobile Bar Co. as mobile_bar)", "by": "coordinator" }
```

These are append-only per the schema convention.

## 8. Migration / backwards compatibility

For existing events without a mobile bar:
- `bar_program` is optional. If absent, the run-of-show simply has no `mobile_bar` rows and no bar packet is generated.
- `venues.reception.water_access`, `ice_supply`, `corkage_model` are optional but recommended. If absent, the bar's onboarding form prompts the couple/coordinator to fill them at intake time.
- `guests.dietary_aggregated.pregnant_count_flag` and `egg_allergy_severe` default to absent (treated as 0 by consumers).

For events that retroactively add a bar:
- Adding the vendor object fires the standard "vendor added" sync trigger to the coordinator
- The first generated bar packet performs a one-time pull of pre-filled fields (reception time, venue, allergens) so the bar isn't filling them blind

## 9. Worked example: minimal vs. full diff against `sample_event.json`

**Minimal change (just to make the existing sample event bar-aware):**

1. Add `bar_program` block at top level
2. Add `water_access`, `ice_supply`, `corkage_model` to `venues.reception`
3. Add `egg_allergy_severe: 0` and `pregnant_count_flag: 4` to `guests.dietary_aggregated`
4. Append `v_alon_bar_co` to `vendors[]`
5. Add two new run-of-show rows (setup, breakdown)
6. Update existing run-of-show rows where `mobile_bar` should be in `lead` or `supporting`
7. Append change-log entries

**Files affected by this addition:**
- `references/sync-matrix.md` — new vendor entry + structured tail entry
- `references/vendor-types.md` — promote one-liner to full entry
- `references/data-model.md` — document `bar_program`, new venue fields, new dietary flags
- `assets/sample_event.json` — apply the worked diff
- `scripts/generate_vendor_packet.py` — add `mobile_bar` template (reuses caterer template scaffolding for the F&B section)
- `scripts/compute_sync_diffs.py` — register the new sync triggers
- V2 budget category list — add `Bar / Beverage`

No breaking changes to existing schema. Version bump only.
