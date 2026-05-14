# Event JSON additions for Mobile Bar / Bartender

This document specifies exactly what changes to make to `sample_event.json` (and the schema generally) so a `mobile_bar` vendor integrates cleanly. Three areas of change.

---

## 1. New entry in `vendors[]`

Append the following to `vendors[]`. This is a complete sample populated for the existing Dela Cruz × Santos event.

```json
{
  "vendor_id": "v_lakwatsa_bar",
  "business_name": "Lakwatsa Mobile Bar Co.",
  "service_type": "mobile_bar",
  "primary_contact": {
    "name": "Rico Villaflor",
    "phone": "+639170000009",
    "email": "rico@lakwatsabar.ph"
  },
  "service": {
    "package": "4-hour open bar (capped), 2 bartenders + 1 bar back, 280 pax, 2 signature cocktails",
    "pricing_model": "open_bar_capped",
    "guest_count_basis": 280,
    "bar_window": { "start": "18:30", "end": "22:45" },
    "last_call_time": "22:15",
    "call_time_requested": "16:00",
    "call_time_confirmed": "16:00",
    "setup_duration_min": 120,
    "strike_duration_min": 60,
    "on_site_duration_hr": 8,
    "bartender_count": 2,
    "bar_back_count": 1,
    "deliverables": "Open bar w/ cap of 1100 drinks; signature cocktails 'The Mariel' + 'Joaquin Spritz'; mixers + ice + acrylic glassware included; overage at PHP 120/drink"
  },
  "bar_details": {
    "bar_style": "rustic_wood",
    "bar_footprint_m": { "length": 3.0, "depth": 0.8, "height": 1.1 },
    "is_alcohol_free": false,
    "alcohol_source": "vendor_supplied",
    "signature_cocktails": [
      {
        "name": "The Mariel",
        "base_spirit": "gin",
        "description": "Calamansi, elderflower, gin, tonic",
        "garnish": "calamansi twist + dehydrated rose",
        "glassware": "coupe",
        "estimated_pours": 220,
        "photo_ref": null
      },
      {
        "name": "Joaquin Spritz",
        "base_spirit": "other",
        "description": "Lambanog, pomelo, soda, basil",
        "garnish": "basil leaf",
        "glassware": "highball",
        "estimated_pours": 220,
        "photo_ref": null
      }
    ],
    "menu": {
      "beer": [
        { "brand": "San Miguel Pale Pilsen", "type": "lager", "qty_unit": "bottle", "qty": 240 },
        { "brand": "San Miguel Light", "type": "lager", "qty_unit": "bottle", "qty": 144 }
      ],
      "wine": [
        { "label": "House Red", "varietal": "cabernet sauvignon", "qty_bottles": 24 },
        { "label": "House White", "varietal": "sauvignon blanc", "qty_bottles": 18 }
      ],
      "spirits": [
        { "label": "Bombay Sapphire", "type": "gin", "qty_bottles": 6 },
        { "label": "Don Papa", "type": "rum", "qty_bottles": 4 },
        { "label": "Lambanog (Mt. Cristobal)", "type": "lambanog", "qty_bottles": 3 }
      ],
      "non_alcoholic": [
        { "label": "Calamansi cooler", "qty_units": 60 },
        { "label": "Sago't gulaman", "qty_units": 40 },
        { "label": "Bottled water", "qty_units": 120 }
      ],
      "mixers_included": true,
      "ice_included": true
    },
    "corkage": {
      "venue_charges_corkage": false,
      "corkage_fee_php": null,
      "corkage_paid_by": "waived",
      "permit_required": false,
      "permit_owner": "vendor",
      "permit_status": "not_required"
    },
    "consumption_caps": {
      "drink_cap_total": 1100,
      "overage_rate_php_per_drink": 120,
      "minimum_spend_php": null
    },
    "utilities_required": {
      "power_outlets": 2,
      "power_kw_estimate": 1.5,
      "water_source_required": true,
      "water_source_distance_m_max": 15,
      "drainage_required": true,
      "surface_type_ok": ["grass", "concrete", "wood"],
      "shade_required": true,
      "backup_generator_needed": false
    },
    "glassware": {
      "type": "acrylic",
      "counts": { "highball": 280, "rocks": 200, "wine": 120, "coupe": 220, "beer": 240 },
      "breakage_buffer_pct": 10
    },
    "staff_meal_required": true,
    "staff_meal_count": 3,
    "uniform": "all_black",
    "legal": {
      "bartenders_of_legal_age": true,
      "serves_minors_policy": "no_service_under_18",
      "intoxication_policy": "Polite cut-off; offer water + non-alc; escort to coordinator if guest is impaired"
    }
  },
  "payment": {
    "total_php": 95000,
    "reservation_paid": true,
    "reservation_amount_php": 25000,
    "reservation_paid_date": "2026-03-05",
    "down_paid": false,
    "down_amount_php": 40000,
    "down_due_date": "2026-09-14",
    "balance_paid": false,
    "balance_amount_php": 30000,
    "balance_due_date": "2026-11-13"
  },
  "packet_delivery": {
    "current_version": 1,
    "current_version_sent_at": "2026-04-15T10:00:00+08:00",
    "channels_sent": ["email", "viber"],
    "acknowledged": false,
    "acknowledged_at": null,
    "acknowledged_by": null,
    "acknowledged_via": null,
    "code_of_conduct_version_accepted": "2026.1",
    "history": [
      { "version": 1, "sent_at": "2026-04-15T10:00:00+08:00", "reason": "initial_onboarding", "ack": false, "ack_at": null }
    ]
  },
  "notification_prefs": {
    "channels_priority": ["viber", "email", "sms"],
    "viber_number": "+639170000009",
    "quiet_hours": { "start": "22:00", "end": "07:00" },
    "event_day_ok": true,
    "high_severity_overrides_quiet_hours": true
  }
}
```

### Inventory math sanity check (for the spec — not stored)
- 280 guests × ~4 hrs × ~1.5 drinks/hr = 1,680 expected pours; cap is 1,100 (couple chose under-the-curve cap with overage clause).
- Bartender ratio: ceil(280/75) = 4 → flagged warning since vendor proposed 2 bartenders + 1 bar back. Coordinator should review with vendor.

---

## 2. Run-of-show extensions

`run_of_show[].lead` and `.supporting` currently use a string vocabulary that includes `photographer`, `videographer`, `caterer`, `florist`, `band_dj`, `host`, `coordinator`, `bridal_car`, `hmua`, `officiant`, `choir`. Add `mobile_bar` to that vocabulary.

Add the following segments to `run_of_show[]` for the sample event (insert in time order):

```json
{ "time": "16:00", "duration_min": 120, "segment": "Mobile bar load-in + setup", "location": "venues.reception", "lead": ["mobile_bar"], "supporting": ["coordinator"] },
{ "time": "18:30", "duration_min": 60, "segment": "Cocktail hour + arrival", "location": "venues.reception", "lead": ["caterer"], "supporting": ["photographer", "videographer", "band_dj", "mobile_bar"] },
{ "time": "20:00", "duration_min": 60, "segment": "Buffet dinner", "location": "venues.reception", "lead": ["caterer"], "supporting": ["band_dj", "mobile_bar"] },
{ "time": "22:15", "duration_min": 5, "segment": "Last call announcement", "location": "venues.reception", "lead": ["host"], "supporting": ["mobile_bar", "band_dj"] },
{ "time": "22:45", "duration_min": 45, "segment": "Mobile bar strike", "location": "venues.reception", "lead": ["mobile_bar"], "supporting": ["coordinator"] }
```

Note: the existing "Cocktail hour + arrival" and "Buffet dinner" entries should be UPDATED to add `mobile_bar` to their `supporting` arrays (rather than duplicated). The two new segments are the bar-specific ones (load-in, last call, strike).

---

## 3. Schema additions to existing top-level objects

These extensions are needed to feed the `mobile_bar` packet correctly. They benefit other vendor types too.

### 3.1 `venues.reception` — add utilities sub-object

```json
"venues": {
  "reception": {
    "...existing fields...": "...",
    "utilities": {
      "power_circuits_available": 6,
      "power_total_kw": 25,
      "water_taps": [
        { "location": "kitchen entrance", "distance_to_main_floor_m": 12 }
      ],
      "drainage_points": [
        { "location": "kitchen entrance" }
      ],
      "generator_available": true,
      "generator_kw": 30,
      "outdoor_surface_type": ["grass", "concrete"],
      "shade_structures": ["pavilion", "tent_optional"]
    }
  }
}
```

### 3.2 `guests.dietary_aggregated` — add alcohol-relevant counts

```json
"dietary_aggregated": {
  "vegetarian": 12,
  "halal": 3,
  "gluten_free": 2,
  "nut_allergy_severe": 1,
  "no_pork": 8,
  "no_alcohol": 18,
  "designated_drivers": 4
}
```

### 3.3 `change_log[]` — add packet-resend metadata

Each existing entry stays as-is but new entries created automatically by HIGH/MEDIUM triggers gain optional fields:

```json
{
  "ts": "2026-04-15T11:00:00+08:00",
  "field": "reception.end_time",
  "from": "23:00",
  "to": "23:30",
  "by": "coordinator",
  "note": "Venue agreed to extend by 30 min",
  "triggers_packet_resend": true,
  "affected_vendors": ["v_lakwatsa_bar", "v_bagong_himig", "v_lutong_hapag", "v_tito_henry"],
  "severity": "high"
}
```

### 3.4 Top-level vocabulary registries

To keep `service_type` and run-of-show role strings consistent across vendors:

```json
"_vocabulary": {
  "service_types": [
    "photographer", "videographer", "caterer", "florist", "hmua",
    "band_dj", "host", "coordinator", "bridal_car", "mobile_bar"
  ],
  "run_of_show_roles": [
    "photographer", "videographer", "caterer", "florist", "hmua",
    "band_dj", "host", "coordinator", "bridal_car", "mobile_bar",
    "officiant", "choir"
  ]
}
```

This is optional in the JSON itself (it can live in the schema/registry) but is useful as a self-describing artifact when the JSON is exported.

---

## 4. Backwards compatibility

- **No existing vendor objects change shape.** `bar_details`, `packet_delivery`, and `notification_prefs` are new optional blocks; renderers that don't know about them ignore.
- **`mobile_bar` is purely additive** to `service_type`. Any consumer that filters by known service types should add `mobile_bar` to its allowlist.
- **`venues.reception.utilities`** is a new optional block. Existing events without it continue to work; the mobile bar onboarding will surface a warning ("venue utilities not captured — please confirm with venue manager") rather than block.
- **`packet_delivery` and `notification_prefs`** can be added to other vendor types in V2.1 — they're designed to be vendor-type-agnostic.

---

## 5. Migration script outline (for dev reference)

For each existing event in production:
1. No mutation required for events without a mobile bar vendor.
2. When a mobile bar vendor is added (via onboarding flow), the new vendor object is appended.
3. Run-of-show updates happen via the coordinator UI's segment editor; on save, the `mobile_bar` role is added to relevant `supporting` arrays automatically.
4. If `venues.reception.utilities` is missing, prompt coordinator to fill it as part of mobile bar onboarding (one-time).
