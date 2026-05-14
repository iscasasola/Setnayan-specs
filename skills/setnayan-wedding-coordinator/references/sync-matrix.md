# Sync Matrix

The canonical mapping of which event fields each vendor type needs to see, and which changes trigger a notification to that vendor.

This is the most important file in the skill. Every per-vendor packet, every change diff message, every vendor onboarding form derives from this matrix. If you find yourself producing a vendor packet without consulting this file, stop.

## Reading the matrix

Each vendor type has two sections:

- **Reads** — fields from the canonical event that this vendor sees in their packet. The packet should not include fields outside this list. (Privacy by design: a photographer should not see dietary restrictions.)
- **Writes** — fields this vendor *contributes* to the canonical event. When the vendor confirms a call time or a deliverable count, that's a write that flows back into the master event.
- **Sync triggers** — events on the canonical event that should send a change message to this vendor. Each trigger lists the field that changed and the message template.

The sync matrix is a JSON-friendly description; the human-readable form below is canonical for editing, but `scripts/generate_vendor_packet.py` parses the same data from the structured tail of this file.

---

## Photographer

**Reads:**
- Event date, venue (primary + reception if separate), call time, ceremony start, reception start
- Couple's names and contact info
- Coordinator's name and contact
- Run-of-show segments where photography is `lead` or `supporting`
- Entourage list with roles (Principal Sponsors, Secondary Sponsors, Best Man, Maid of Honor, Bridesmaids, Groomsmen, Flower Girl, Bearer) — names and roles only, no contact info
- Family list: parents, siblings, grandparents — names and roles only, for portrait shot list
- VIP list — names and a one-line note about why they're VIP (e.g., "godmother who flew in from US")
- Couple's shot list and must-have moments
- Other media vendors on the event (videographer, content creator) — name + scope so the photographer knows who else is shooting

**Writes:**
- Confirmed call time (may differ from coordinator's requested call time by ±30min)
- Final deliverable count (raw photos, edited photos, prints)
- Delivery date for edited gallery
- On-site duration confirmation

**Sync triggers:**
- `ceremony.start_time` changes → "Ceremony moved from {old} to {new}. Your call time was {old_call}, now {new_call}. Reception starts {new_reception}."
- `venue.primary` changes → "Ceremony venue changed to {new_venue}. New address: {address}. Parking notes: {notes}. Your access window: {access}."
- `entourage` changes (additions/removals of Principal Sponsors, Secondary Sponsors, Entourage) → "Entourage updated. Added: {added}. Removed: {removed}. Updated portrait shot list attached."
- `guest_count` changes by >10% → "Guest count is now {new}. Reception group shot logistics may change; coordinator will confirm."

**Does NOT see:** dietary restrictions, food allergies, table assignments, catering menu, plus-one details, guest contact info beyond entourage.

---

## Videographer

**Reads:**
- Same date/venue/call-time fields as photographer
- Run-of-show segments where videography is `lead` or `supporting`
- Couple's "must-capture" moments
- Whether a Same-Day-Edit (SDE) is contracted, and its target screening time during the reception
- AV setup at reception (screen size, projection method) — for SDE planning
- Coordinator contact, photographer contact (the two media vendors coordinate movement on the day)

**Writes:**
- Confirmed call time
- SDE delivery time (if contracted)
- Final video package deliverables and delivery date

**Sync triggers:**
- `ceremony.start_time` changes → as photographer
- `reception.av_setup` changes → "Reception AV is now {new_setup}. SDE screening at {new_time}. Projection method: {method}."
- `sde.contracted` toggles → confirm/cancel the SDE deliverable

**Does NOT see:** dietary restrictions, full guest list, individual seating, catering menu, vendor payment info.

---

## Caterer / Food Vendor

**Reads:**
- Event date, reception venue, reception start time, reception end time
- Final guest count (with Adult / Child / Sponsor breakdowns)
- Dietary restrictions and allergies aggregated by guest count (e.g., "12 vegetarian, 3 halal, 2 gluten-free, 1 severe peanut allergy")
- Meal service window (cocktail start, dinner start, dessert)
- Whether there's a buffet, plated, family-style, or hybrid format
- Vendor allowance count — number of vendors expected to be fed at the event (PH-specific norm; vendors are typically fed). Photographer team, videographer team, band, host, coordinator's team all need to be counted.
- Reception venue access time (kitchen access, prep area)
- Coordinator contact

**Writes:**
- Confirmed final headcount lock time (typically 7-10 days before)
- Menu confirmation
- On-site staff count
- Setup/breakdown windows

**Sync triggers:**
- `guest_count` changes → "Guest count updated to {new}. Headcount lock is {date}. Please confirm capacity."
- `dietary_restrictions` changes → "Updated dietary list: {summary}. Please flag any kitchen impact."
- `vendor_allowance.count` changes → "Vendor allowance count is now {new}. This affects the meal count, not the guest count."
- `reception.start_time` changes → "Reception now starts at {new}. Cocktail at {cocktail}. Dinner service at {dinner}."

**Does NOT see:** shot list, processional order, music playlist, photo deliverable details, individual guest contact info beyond what's needed for dietary follow-up.

**PH-specific note:** Filipino weddings often have *salu-salo* moments (a separate VIP table for parents/sponsors with a different menu). Capture this as a "VIP table treatment" field on the event and surface it to the caterer.

---

## Florist / Stylist

**Reads:**
- Event date, ceremony venue, reception venue (if different), call time for setup
- Theme, color palette, flower preferences (avoid list, must-have list)
- Number of bouquets and types: bridal bouquet, secondary bouquets (Principal Sponsors get corsages, Secondary Sponsors get smaller corsages, Maid of Honor and Bridesmaids get bouquets, Best Man and Groomsmen get boutonnieres, Flower Girl gets a basket, Bearer gets a pillow) — full count derived from the entourage list
- Aisle length, ceremony size (for arch/altar arrangements)
- Number of reception tables, table type (round/long), and centerpiece preferences
- Setup access window at both venues; teardown time at reception
- Coordinator contact, venue manager contact

**Writes:**
- Final stem count (per arrangement type)
- Confirmed setup start time
- On-site team size

**Sync triggers:**
- `entourage` changes → "Entourage size is now {new}. New floral count: {count_breakdown}. Stem estimate: {stems}."
- `venue` or `venue.layout` changes → "Venue/layout changed. Setup access window: {access}. Updated count of arrangements: {arrangements}."
- `theme.color_palette` changes → "Color palette updated. Old: {old}. New: {new}. Stems on order may need to swap."
- `reception.table_count` changes → "Reception tables now {new}. Centerpieces required: {centerpieces}."

**Does NOT see:** dietary restrictions, full guest list, music playlist, individual guest contact info.

---

## Hair & Makeup Artist (HMUA)

**Reads:**
- Event date, ceremony start time, prep location for bride and groom (often two separate locations; HMUA team usually goes to the bride's prep location)
- Number of heads to do: bride, mother of the bride, mother of the groom, Maid of Honor, Bridesmaids, Flower Girl, Principal Sponsor count (some Ninangs request HMUA), Secondary Sponsor (Veil/Cord/Coin) count
- Touch-up schedule (typically: pre-ceremony, pre-reception, before garter/bouquet)
- Skin/hair concerns from the bride (allergies, sensitivities, lash preferences) — confidential
- Coordinator contact, photographer contact (HMUA coordinates with photo on prep shots)

**Writes:**
- Confirmed call time at prep location
- HMUA team size
- On-site touch-up windows

**Sync triggers:**
- `ceremony.start_time` changes → "Ceremony now {new}. New call time at prep: {call}. Touch-up windows: {windows}."
- `entourage` (Maid of Honor, Bridesmaids, Flower Girl additions/removals) → "HMUA headcount updated. New count: {breakdown}. Time per head estimate: {time}. Confirm timeline?"
- `prep.location` changes → "Prep location changed to {new}. Address: {address}. Parking notes: {notes}."

**Does NOT see:** dietary restrictions, full guest list, ceremony processional details (HMUA is done before processional), reception flow, vendor allowance.

---

## Band / DJ / Live Musicians

**Reads:**
- Event date, reception venue, reception start time, reception end time
- Run-of-show segments during reception that involve music: entrance, first dance, money dance, garter, bouquet, prosperity dance / Pangalay, sendoff
- Couple's "do play" list and "do not play" list
- Whether a Host (emcee) is contracted, and the host's name + contact (band/DJ coordinates with the host)
- Power and AV setup at the reception venue (outlets, generator backup, allowed dB level, PA availability)
- Coordinator contact, host contact

**Writes:**
- Confirmed call time at reception venue
- Setup duration
- Final set list and timing
- Equipment requirements (mic count, monitor count, etc.)

**Sync triggers:**
- `reception.start_time` changes → "Reception now starts at {new}. Your call time: {call}. Setup window: {setup}."
- `host.contact` changes → "New host: {name}. Contact: {contact}. They'll coordinate cue points with you."
- `reception.venue` changes → "Reception venue is now {new}. Power setup: {power}. Allowed dB: {db}. Confirm equipment fits."
- `playlist.do_not_play` changes → "Do-not-play list updated. Removed: {removed}. Added: {added}."

**Does NOT see:** dietary restrictions, full guest list, ceremony details (band typically doesn't play during Catholic ceremony — that's the church choir), shot list.

---

## Host / Emcee

**Reads:**
- Event date, reception venue, full reception run-of-show with cue points
- Couple's names with proper pronunciation, how they want to be introduced
- Entourage list with full names, roles, and pronunciation notes
- Principal Sponsors with full names and titles (e.g., "Atty.", "Dr.") for proper introduction during the entourage processional
- Couple's love story / a 60-second bio for the welcome remarks
- Special acknowledgments (deceased parents, absent grandparents, special guests)
- Tradition specifics: which Catholic unity rites are happening (coin/arras, veil, cord), whether there's a bouquet/garter toss, money dance, prosperity dance, sendoff method
- Band/DJ contact

**Writes:**
- Confirmed call time
- Final script (can be drafted by host, reviewed by couple)
- Pronunciation confirmation for tricky names

**Sync triggers:**
- `reception.run_of_show` changes → "Run-of-show updated. Affected segments: {segments}. Updated script section: {section}."
- `entourage` changes → "Entourage updated. Added: {added}. Removed: {removed}. Pronunciation confirmation needed for: {names}."
- `couple.acknowledgments` changes → "Special acknowledgments updated. New list: {list}."

**Does NOT see:** dietary restrictions (unless announcing a kid-friendly buffet or similar), shot list, vendor payment info.

---

## Wedding Coordinator (Day-Of)

The wedding coordinator is special: they read **everything**. They are the human spine of the sync model — when the matrix doesn't cover a case, the coordinator is the fallback router. The Setnayan coordinator dashboard surfaces all of this.

**Reads:**
- The full canonical event
- All vendor confirmed call times, on-site durations, deliverable confirmations
- Every guest's RSVP status, dietary restrictions, plus-one status, accessibility needs
- Real-time guest arrival count (day-of, via Setnayan's check-in scanner)

**Writes:**
- Run-of-show edits (the coordinator is typically the one who finalizes the run-of-show with the couple's input)
- Day-of timeline shifts (broadcasts to all guests within 5 seconds per V1 spec section 8.4)
- Vendor instructions and clarifications

**Sync triggers:**
- All of them. The coordinator gets a digest version when other vendors fire change events.

---

## Other vendor types (sketched)

These are common PH wedding vendors that show up frequently enough to deserve matrix entries but with less depth above. When a task touches these, expand them inline using the same Reads / Writes / Sync triggers structure and offer to add the full entry to this file.

- **Souvenir vendor / Giveaway supplier** — needs final guest count, delivery address, whether QR souvenirs are integrated (Setnayan-specific feature)
- **Photo booth / 360-booth operator** — reception venue, reception time window, theme, branding
- **Live painter / Live calligrapher** — venue, start/end window, table assignment for setup
- **Mobile bar / Bartender** — guest count, drink preferences, allergens, venue, setup access
- **Lights and sounds** — venue, layout, power setup, run-of-show cue points
- **Officiant / Priest** — ceremony venue, ceremony time, parish requirements status (CENOMAR, banns, baptismal/confirmation certs), Pre-Cana completion status
- **Choir / Church musicians** — ceremony venue, ceremony time, song list, processional order
- **Bridal car / Transportation vendor** — pickup time and address, drop-off venue, route, contact people for prep and ceremony
- **Stylist (attire)** — fittings calendar, delivery date, alterations contact

---

## Cross-cutting privacy rules

These apply across all vendors and override per-vendor reads where they conflict:

1. **Guest contact info (phone, email, address) is never in a vendor packet** unless that vendor specifically needs it (e.g., transportation vendor doing pickup, but never the photographer).
2. **Dietary and medical info goes only to vendors who serve food.** Caterer yes. Mobile bar yes (allergen relevance). Florist no.
3. **Plus-one identities are not surfaced** until the plus-one has RSVP'd. Caterer sees a plus-one count, not a list of names, until names are confirmed.
4. **Guest financial info (money dance contributions) is never logged.** This is the one PH tradition where the data simply does not exist in the system.

---

## Structured tail (machine-readable)

The block below is parsed by `scripts/generate_vendor_packet.py`. Keep the schema stable.

```json
{
  "vendor_types": {
    "photographer": {
      "reads": ["event.date", "event.venue", "event.call_time", "ceremony.start_time", "reception.start_time", "couple.names", "couple.contact", "coordinator.name", "coordinator.contact", "run_of_show.where_lead_or_supporting", "entourage.names_and_roles", "family.names_and_roles", "vip.names_and_notes", "couple.shot_list", "other_media_vendors"],
      "writes": ["service.confirmed_call_time", "service.deliverable_count", "service.delivery_date", "service.on_site_duration"],
      "blocked_fields": ["dietary_restrictions", "food_allergies", "table_assignments", "catering_menu", "guest_contact_info"]
    },
    "videographer": {
      "reads": ["event.date", "event.venue", "event.call_time", "ceremony.start_time", "reception.start_time", "couple.names", "couple.contact", "coordinator.name", "coordinator.contact", "run_of_show.where_lead_or_supporting", "couple.must_capture_moments", "sde.contracted", "sde.target_screening_time", "reception.av_setup", "photographer.contact"],
      "writes": ["service.confirmed_call_time", "service.sde_delivery_time", "service.deliverables", "service.delivery_date"],
      "blocked_fields": ["dietary_restrictions", "full_guest_list", "table_assignments", "vendor_payment_info"]
    },
    "caterer": {
      "reads": ["event.date", "reception.venue", "reception.start_time", "reception.end_time", "guest_count.breakdown", "dietary_restrictions.aggregated", "meal_service_window", "service_format", "vendor_allowance.count", "reception.access_time", "coordinator.contact"],
      "writes": ["service.headcount_lock_date", "service.menu_confirmation", "service.on_site_staff_count", "service.setup_breakdown"],
      "blocked_fields": ["shot_list", "processional_order", "playlist", "photo_deliverables"]
    },
    "florist": {
      "reads": ["event.date", "ceremony.venue", "reception.venue", "setup.access_window", "theme.color_palette", "theme.flower_preferences", "entourage.derived_floral_count", "ceremony.aisle_length", "reception.table_count", "reception.table_type", "coordinator.contact", "venue_manager.contact"],
      "writes": ["service.final_stem_count", "service.confirmed_setup_start", "service.on_site_team_size"],
      "blocked_fields": ["dietary_restrictions", "full_guest_list", "playlist", "guest_contact_info"]
    },
    "hmua": {
      "reads": ["event.date", "ceremony.start_time", "prep.bride_location", "prep.groom_location", "hmua_headcount.breakdown", "touch_up_schedule", "bride.skin_hair_concerns", "coordinator.contact", "photographer.contact"],
      "writes": ["service.confirmed_call_time", "service.team_size", "service.touch_up_windows"],
      "blocked_fields": ["dietary_restrictions", "full_guest_list", "ceremony_processional_details", "reception_flow"]
    },
    "band_dj": {
      "reads": ["event.date", "reception.venue", "reception.start_time", "reception.end_time", "run_of_show.music_segments", "playlist.do_play", "playlist.do_not_play", "host.name", "host.contact", "reception.power_av_setup", "reception.allowed_db", "coordinator.contact"],
      "writes": ["service.confirmed_call_time", "service.setup_duration", "service.final_set_list", "service.equipment_requirements"],
      "blocked_fields": ["dietary_restrictions", "full_guest_list", "shot_list", "ceremony_details"]
    },
    "host": {
      "reads": ["event.date", "reception.venue", "reception.full_run_of_show", "couple.names_pronunciation", "couple.intro_preference", "entourage.full_names_roles_pronunciation", "principal_sponsors.full_names_titles", "couple.bio", "couple.special_acknowledgments", "tradition.unity_rites", "tradition.bouquet_garter", "tradition.money_dance", "tradition.prosperity_dance", "tradition.sendoff", "band_dj.contact"],
      "writes": ["service.confirmed_call_time", "service.final_script", "service.pronunciation_confirmation"],
      "blocked_fields": ["shot_list", "vendor_payment_info"]
    },
    "coordinator": {
      "reads": ["*"],
      "writes": ["run_of_show.*", "day_of_timeline_shifts", "vendor_instructions"],
      "blocked_fields": []
    }
  },
  "global_privacy_rules": [
    "guest_contact_info_only_to_vendors_with_specific_need",
    "dietary_medical_only_to_food_vendors",
    "plus_one_names_only_after_rsvp",
    "money_dance_contributions_never_logged"
  ]
}
```
