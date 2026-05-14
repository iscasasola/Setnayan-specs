# Mobile Bar / Bartender Vendor Spec — Setnayan V2

**Vendor type ID:** `mobile_bar`
**Display label (EN):** Mobile Bar / Bartender
**Display label (TL):** Mobile Bar / Bartender (no translation; loanword in PH market)
**Category:** Reception service vendor
**Introduced:** Setnayan V2 onboarding flow
**Owner:** Vendor Platform team

---

## 1. Why this vendor type matters in PH weddings

Mobile bar is now near-default for PH receptions in the Php 800k+ tier. Common patterns we need to support:

- **Open bar with cap** — couple buys X drinks total, bar tracks pours, stops when cap is hit (or charges overage).
- **Consumption-based** — couple pays for what was poured at end of night, with a minimum.
- **All-you-can-drink package** — flat per-head, fixed bar window (e.g. 4 hours).
- **BYOB with bartending service** — couple supplies the alcohol (often duty-free or wholesale), vendor supplies bartenders, ice, mixers, glassware, cart.
- **Signature cocktail(s)** — almost always 1–2 named drinks for the couple ("The Mariel," "Joaquin Spritz"). Setnayan should treat these as first-class.

Operational facts that matter and that other vendor types don't have:
- Needs **water + power + drainage proximity**, or generator coordination if outdoor (Tagaytay-style garden venues).
- **Ice logistics** — block ice + cubed ice usually arrives ~2 hrs before service; degrades fast in PH heat.
- **Corkage rules at the venue** are a hard dependency. The bar contract is often signed before the couple knows the corkage. Onboarding must capture both sides.
- **Last-call timing** is always 30–45 min before reception end (so bar can break down before venue lockout). Coordinator needs this on the run-of-show.
- **LGU permits / sin tax** — for some venues (especially LGU-owned or hotel-affiliated), bringing in outside alcohol requires a permit. Vendor often handles this; Setnayan should track who owns it.
- **Bartender-to-guest ratio** — industry rule of thumb is 1:50 for cocktail hour, 1:75 for dinner. We should compute and warn.

---

## 2. Data model — `mobile_bar` service_type

Adds to the existing `vendors[]` array. Shape mirrors existing vendors (photographer, caterer, etc.) so render code stays generic, with a `mobile_bar`-specific `service` and `bar_details` block.

### 2.1 Top-level vendor fields (shared with all vendor types)

Same as existing: `vendor_id`, `business_name`, `service_type` (= `"mobile_bar"`), `primary_contact`, `service`, `payment`. Adds two new optional top-level fields useful across vendor types but introduced here:

- `packet_delivery` — packet versioning + acknowledgment (see §4)
- `notification_prefs` — per-vendor channel + quiet hours (see §5)

### 2.2 `service` block (mobile_bar variant)

```
service: {
  package: string,                       // human-readable, e.g. "4-hour open bar, 2 bartenders, 280 pax"
  pricing_model: "open_bar_capped" | "consumption" | "package_per_head" | "byob_service_only",
  guest_count_basis: int,                // headcount the package was priced against
  bar_window: { start: "HH:MM", end: "HH:MM" }, // service window, NOT call time
  last_call_time: "HH:MM",               // usually bar_window.end - 30min
  call_time_requested: "HH:MM",
  call_time_confirmed: "HH:MM",
  on_site_duration_hr: number,           // setup → strike
  setup_duration_min: int,               // typical 90–120
  strike_duration_min: int,              // typical 45–60
  bartender_count: int,
  bar_back_count: int,                   // 0..N; helpers, not full bartenders
  deliverables: string                   // free-form scope summary (matches existing convention)
}
```

### 2.3 `bar_details` block (new, mobile_bar only)

```
bar_details: {
  bar_style: "rustic_wood" | "acrylic_modern" | "whiskey_barrel" | "tropical_tiki" | "custom",
  bar_footprint_m: { length: number, depth: number, height: number },
  signature_cocktails: [
    {
      name: string,                       // e.g. "The Mariel"
      base_spirit: "gin" | "rum" | "vodka" | "whiskey" | "tequila" | "non_alcoholic" | "other",
      description: string,                // "Calamansi, elderflower, gin"
      garnish: string,
      glassware: string,                  // "coupe" | "rocks" | etc.
      estimated_pours: int,               // for inventory planning
      photo_ref: string                   // optional URL to inspo
    }
  ],
  menu: {
    beer: [ { brand: string, type: string, qty_unit: "bottle"|"can"|"keg", qty: int } ],
    wine: [ { label: string, varietal: string, qty_bottles: int } ],
    spirits: [ { label: string, type: string, qty_bottles: int } ],
    non_alcoholic: [ { label: string, qty_units: int } ],
    mixers_included: bool,
    ice_included: bool
  },
  alcohol_source: "vendor_supplied" | "couple_supplied_byob" | "mixed",
  corkage: {
    venue_charges_corkage: bool,
    corkage_fee_php: number | null,
    corkage_paid_by: "couple" | "vendor" | "waived",
    permit_required: bool,
    permit_owner: "vendor" | "couple" | "coordinator",
    permit_status: "not_required" | "pending" | "filed" | "approved"
  },
  consumption_caps: {
    drink_cap_total: int | null,          // for open_bar_capped
    overage_rate_php_per_drink: number | null,
    minimum_spend_php: number | null      // for consumption model
  },
  utilities_required: {
    power_outlets: int,                   // count of 220V outlets needed
    power_kw_estimate: number,
    water_source_required: bool,
    water_source_distance_m_max: number,  // how far from bar to water tap
    drainage_required: bool,
    surface_type_ok: ["grass","concrete","wood","carpet"],
    shade_required: bool,                 // outdoor afternoon weddings
    backup_generator_needed: bool
  },
  glassware: {
    type: "real_glass" | "acrylic" | "mixed",
    counts: { highball: int, rocks: int, wine: int, coupe: int, beer: int },
    breakage_buffer_pct: int              // typical 10
  },
  staff_meal_required: bool,              // mirrors caterer.vendor_meals
  staff_meal_count: int,
  uniform: "all_black" | "barong" | "filipiniana" | "themed_custom" | "vendor_default",
  legal: {
    bartenders_of_legal_age: bool,        // attestation
    serves_minors_policy: "no_service_under_18",
    intoxication_policy: string           // free text, e.g. "Cut off + escort to coordinator"
  }
}
```

### 2.4 Validation rules

- If `pricing_model = "open_bar_capped"` then `consumption_caps.drink_cap_total` is required.
- If `pricing_model = "consumption"` then `consumption_caps.minimum_spend_php` is required.
- If `alcohol_source = "couple_supplied_byob"` then `corkage` must be filled and `bar_details.menu` totals must exist (the couple provides them, but the vendor confirms the count for inventory).
- `bartender_count >= ceil(guest_count_basis / 75)` — soft warning, not blocking.
- `last_call_time` must be ≥ 30 min before `bar_window.end` — blocking.
- `bar_window.end` must be ≤ `reception.end_time` — blocking.

---

## 3. Onboarding flow shape

Mobile bar onboarding is split into 5 sections. Each section saves independently so the vendor can complete the form across multiple sittings (common — owners are often bartending other gigs the same week).

| Section | Sections fields populate | Required to send packet? |
|---|---|---|
| 1. Business + contact | `business_name`, `primary_contact`, `notification_prefs` | Yes |
| 2. Package + pricing | `service.*`, `payment.*` | Yes |
| 3. Bar details | `bar_details.bar_style`, `menu`, `signature_cocktails` | Yes |
| 4. Operations | `utilities_required`, `glassware`, `setup/strike`, `staff_meal` | Yes |
| 5. Compliance + legal | `corkage`, `legal`, certifications uploads | Yes |

See `intake_form.md` for the actual field-by-field form spec.

---

## 4. Packet — what we send the vendor

Packet is a versioned, read-only snapshot of event info the vendor needs. Sent on confirm and re-sent on relevant change. Same packet primitive as other vendor types — the **content slice** differs.

### 4.1 Packet contents for mobile_bar

A mobile_bar packet contains:

**Couple + event basics**
- `couple.preferred_couple_name`
- `event.date`
- `event.theme.color_palette` and `event.theme.vibe` (so bar styling matches; e.g. ice, garnish, napkin colors)

**Venue (reception only)**
- `venues.reception.name`, `address`, `type`
- `venues.reception.access_window` — when they can load in
- `venues.reception.parking_notes`
- `venues.reception.manager` — venue contact
- `venues.reception.av_setup` — power and dB cap (sometimes bar has its own speaker)
- `venues.reception.rain_plan`
- New venue fields if available: water source location, drainage location, generator availability (the venue intake should capture these in V2)

**Reception logistics**
- `reception.start_time`, `end_time`
- `reception.service_format` (buffet vs plated changes bar pacing)
- `reception.table_count`, `reception.table_type`
- `guests.confirmed_attending` (replaces estimate once available — drives inventory)
- `guests.breakdown.adults` (drinks-eligible count)
- `guests.dietary_aggregated` only the alcohol-relevant fields (we add `no_alcohol` count in V2)

**Run-of-show — filtered**
- All segments where `lead == "mobile_bar"` or `mobile_bar` is in `supporting`
- Plus segments where bar should be operational: cocktail hour, dinner, dance set, last call, sendoff
- Plus the segments **immediately before and after** their service window for awareness

**Their own service contract**
- Echo of their `service` and `bar_details` block — so if anything got edited by coordinator they see the current source of truth
- Their `payment` schedule with paid/unpaid status

**Other vendors they need to coordinate with**
- Caterer (`v_lutong_hapag` in sample) — for ice/water sharing, bar-back coordination, vendor meals
- Coordinator (`v_lakad_coord`) — escalation contact for dB/fire/permit issues
- Host (`v_tito_henry`) — for last-call announcement, signature cocktail call-out
- Band/DJ (`v_bagong_himig`) — for "open bar" cue and last-call music
- Only `business_name` + `primary_contact.name` + `primary_contact.phone` per other vendor; no payment details

**Compliance docs**
- Corkage permit (if present)
- Sin tax / LGU clearance (if present)
- Venue load-in form (often venue-issued)

**House rules / agreements**
- Setnayan's vendor code of conduct (versioned)
- Couple's "do not serve" list — e.g. specific guests with sobriety needs (sensitive; opt-in only and password-protected)

### 4.2 Packet format

- **Web view** at `setnayan.com/packet/{vendor_id}/{packet_version}` (token-gated, no login required for vendor)
- **PDF mirror** auto-generated, downloadable from the web view
- **Plain-text + Viber-friendly version** — many PH vendors actually consume info via Viber threads. We render a minimal text version sized for a Viber message.

### 4.3 Versioning + acknowledgment

```
packet_delivery: {
  current_version: int,
  current_version_sent_at: "ISO-8601",
  channels_sent: ["email","viber","sms"],
  acknowledged: bool,
  acknowledged_at: "ISO-8601" | null,
  acknowledged_by: "primary_contact" | "secondary_contact" | null,
  acknowledged_via: "web" | "email_reply" | "viber" | "manual_coordinator" | null,
  history: [
    { version: int, sent_at: ISO, reason: string, ack: bool, ack_at: ISO|null }
  ]
}
```

Coordinator can mark packet acknowledged manually (Filipino vendors often confirm verbally over Viber call).

---

## 5. Notifications — what triggers a re-send or alert

Notifications are split into three classes by severity. Default channels are vendor's `notification_prefs` (default: email + Viber + SMS for high; email + Viber for medium; email only for low).

### 5.1 HIGH — auto re-send full packet, require new acknowledgment

| Change | Why bar cares |
|---|---|
| `event.date` | Replan everything |
| `venues.reception` swap | New utilities, load-in, parking |
| `venues.reception.access_window` shrink | Setup time at risk |
| `reception.start_time` shift ≥ 30 min | Bar window must shift |
| `reception.end_time` shift ≥ 30 min | Last call shifts |
| `guests.confirmed_attending` change ≥ 10% from packet | Inventory must adjust |
| `bar_details.alcohol_source` change | BYOB ↔ vendor-supplied is a contract change |
| `service.bar_window`, `service.last_call_time` | Direct ops impact |
| Corkage permit status: pending → not approved | Blocking |
| Coordinator change (`v_lakad_coord` swap) | Escalation contact changes |

### 5.2 MEDIUM — targeted notification, no re-ack required

| Change | Notes |
|---|---|
| Run-of-show edits to any segment within bar service window ± 30 min | Bar adjusts pacing |
| `reception.service_format` change (buffet ↔ plated) | Affects drink pacing |
| Caterer swap or caterer call_time change | Logistics partner |
| Host or Band/DJ swap | Cue-coordination partners |
| Signature cocktail edits by couple | Need to re-approve |
| `event.theme.color_palette` change | Garnish/napkin styling |
| New `playlist.do_not_play` entries | Edge case if bar runs ambient music |
| Venue rain plan invocation (≤ 24 hrs before event) | Tent/indoor bar swap |

### 5.3 LOW — digest only

| Change |
|---|
| Couple personal info edits (name pronunciation, etc.) |
| Guest count estimate edits when no confirmed count yet |
| Other vendor payment status changes |
| Shot list edits (irrelevant) |
| Entourage / family edits |
| Acknowledgments / playlist edits |

### 5.4 Quiet hours

Default quiet hours: 22:00–07:00 PHT. HIGH overrides quiet hours; MEDIUM and LOW queue until 07:00.

### 5.5 Notification payload shape

```
notification: {
  vendor_id: "v_...",
  event_id: "evt_...",
  severity: "high" | "medium" | "low",
  trigger_field: "reception.end_time",
  from: "23:00",
  to: "23:30",
  changed_by: "coordinator",
  changed_at: "ISO-8601",
  packet_version_at_change: 17,
  new_packet_version: 18,
  ack_required: bool,
  channels: ["email","viber","sms"],
  message_template_id: "mobile_bar.high.window_shift"
}
```

---

## 6. Integration with existing event JSON

Three integration points. Detailed JSON shapes are in `event_json_additions.md`.

1. **Add to `vendors[]`** — one new object with `service_type: "mobile_bar"`, `service`, `bar_details`, `packet_delivery`, `notification_prefs`.
2. **Extend `run_of_show[]` lead/supporting vocabulary** — `mobile_bar` becomes a valid value alongside `photographer`, `caterer`, etc. Add segments: cocktail hour bar open, signature cocktail toast, last call, bar strike.
3. **Extend `venues.reception`** with utilities fields the bar needs and the venue intake should now capture: `water_source`, `drainage`, `generator_available`, `outdoor_surface_type`. These are useful for caterer too, but mobile bar is what surfaces the need.

Optional but recommended:
- **`guests.dietary_aggregated.no_alcohol`** — new count, used by bar inventory.
- **`change_log` entries** automatically generated for any HIGH/MEDIUM trigger fields, with `triggers_packet_resend: true` flag — so the change log itself becomes the audit trail for what was sent to whom.

---

## 7. Edge cases + open questions

- **Multi-bar setups** — high-end weddings sometimes have 2 bars (cocktail bar at lawn, main bar at pavilion). V2: support array of bars under one vendor; V1 fallback: register as two `vendor_id`s with shared `business_name`.
- **Couple-supplied alcohol shrinkage** — who eats theft/spillage? Add `bar_details.shrinkage_policy` enum: `vendor_absorbs` | `couple_absorbs` | `documented_only`.
- **Mocktail / dry wedding** — `pricing_model` should support a non-alcoholic variant. Add `bar_details.is_alcohol_free: bool`; if true, skip corkage and legal sections.
- **Late additions** — if bar is added < 30 days before event, packet should flag `rush_onboarding: true` so coordinator gets a daily nudge until ack'd.
- **Vendor meals** — mobile bar staff usually eat with caterer's vendor meal allowance (`vendors[caterer].service.deliverables` mentions "24 vendor meals" in the sample). When a mobile_bar vendor is added, increment that count or surface a warning.

---

## 8. Success metrics

- % of mobile_bar vendors who acknowledge packet within 24h of send (target: 85%)
- Median time from packet HIGH-trigger to vendor ack (target: ≤ 6 hrs in business hours)
- # of day-of issues attributed to "bar didn't know" (target: trending to zero)
- % of mobile_bar onboarding flows completed in one sitting vs multi-session (informational)
