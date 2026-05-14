# Data Model

A suggested JSON schema for the canonical event object. This is what Setnayan's backend stores and what every artifact derives from. The shape is intentionally flat-ish for readability; in production, fields like `entourage` would be normalized into separate tables, but the projection back to this shape is what every artifact reads.

This is the schema the scripts in `scripts/` parse. If you change the schema, change the scripts (or vice versa) — they have to stay in lockstep.

## Top-level shape

```json
{
  "event_id": "evt_2026_dela_cruz_santos",
  "version": 17,
  "version_updated_at": "2026-04-12T08:30:00+08:00",

  "couple": {
    "partner_a": { "name": "Mariel Dela Cruz", "phone": "+63...", "email": "..." },
    "partner_b": { "name": "Joaquin Santos", "phone": "+63...", "email": "..." },
    "preferred_couple_name": "Mariel & Joaquin",
    "names_pronunciation": { "Mariel": "mah-ree-EL", "Joaquin": "wah-KEEN" }
  },

  "event": {
    "date": "2026-11-14",
    "religion": "catholic",
    "ceremony_type": "catholic_mass",
    "estimated_guest_count": 280,
    "final_guest_count": null,
    "target_budget_php": 1800000,
    "theme": {
      "color_palette": ["sage green", "ivory", "blush"],
      "flower_preferences": { "love": ["eucalyptus", "garden roses"], "avoid": ["lilies"] },
      "vibe": "garden-romantic, Filipino-modern"
    }
  },

  "venues": {
    "ceremony": {
      "name": "Santuario de San Antonio Parish",
      "address": "Forbes Park, Makati",
      "type": "church",
      "rain_plan": "indoor (covered church)",
      "access_window": { "start": "12:00", "end": "16:30" },
      "manager": { "name": "Sis. Marisol", "contact": "+63..." }
    },
    "reception": {
      "name": "Antonio's Garden, Tagaytay",
      "address": "Aguinaldo Highway, Tagaytay",
      "type": "garden_outdoor",
      "rain_plan": "tented + indoor function room as backup",
      "access_window": { "start": "13:00", "end": "23:00" },
      "manager": { "name": "Mr. Ben Reyes", "contact": "+63..." },
      "av_setup": { "screen": "12ft front projection", "power": "venue-provided + 1 generator", "allowed_db": 95 }
    },
    "prep": {
      "bride": { "name": "Crowne Plaza Manila Galleria, Suite 1809", "address": "..." },
      "groom": { "name": "Crowne Plaza Manila Galleria, Suite 2104", "address": "..." }
    }
  },

  "ceremony": {
    "start_time": "16:00",
    "estimated_duration_min": 75,
    "officiant": { "name": "Fr. Marco Diaz", "contact": "..." },
    "unity_rites": ["coin", "veil", "cord"],
    "processional_order": ["coordinator", "grandparents", "parents_groom", "parents_bride", "principal_sponsors", "secondary_sponsors", "bridesmaids_groomsmen", "moh_bm", "bearers", "groom", "bride"]
  },

  "reception": {
    "start_time": "18:30",
    "end_time": "23:00",
    "service_format": "buffet",
    "table_count": 28,
    "table_type": "round_10",
    "av_setup": { "screen": "12ft", "power": "covered" },
    "traditions": {
      "money_dance": true,
      "garter_bouquet": true,
      "prosperity_dance": false,
      "first_dance": true,
      "parents_dance": true,
      "sde_screening": true
    }
  },

  "run_of_show": [
    { "time": "13:00", "duration_min": 120, "segment": "Bride prep at hotel", "location": "prep.bride", "lead": ["hmua"], "supporting": ["photographer"] },
    { "time": "13:30", "duration_min": 90, "segment": "Groom prep at hotel", "location": "prep.groom", "lead": ["photographer"], "supporting": [] },
    { "time": "15:30", "duration_min": 30, "segment": "Travel to church", "location": "transit", "lead": ["bridal_car"], "supporting": [] },
    { "time": "16:00", "duration_min": 75, "segment": "Catholic ceremony", "location": "venues.ceremony", "lead": ["officiant"], "supporting": ["photographer", "videographer", "florist", "choir"] }
  ],

  "vendors": [
    {
      "vendor_id": "v_kanlaon_studios",
      "business_name": "Kanlaon Studios",
      "service_type": "photographer",
      "primary_contact": { "name": "Aira Mendoza", "phone": "+63...", "email": "..." },
      "service": {
        "package": "8h ceremony+reception, 1 second shooter, 1 album",
        "deliverables": "raw + 800 edited + 1 album + 12-min film",
        "call_time_requested": "13:00",
        "call_time_confirmed": "13:00",
        "on_site_duration_hr": 9,
        "delivery_date_promised": "2026-12-15"
      },
      "payment": {
        "total_php": 180000,
        "reservation_paid": true, "reservation_amount_php": 50000, "reservation_paid_date": "2026-01-12",
        "down_paid": false, "down_amount_php": 70000, "down_due_date": "2026-08-14",
        "balance_paid": false, "balance_amount_php": 60000, "balance_due_date": "2026-11-13"
      }
    }
  ],

  "guests": {
    "estimated_count": 280,
    "rsvp_count": 234,
    "confirmed_attending": 218,
    "declined": 16,
    "breakdown": { "adults": 198, "children": 12, "vendor_allowance": 24 },
    "dietary_aggregated": { "vegetarian": 12, "halal": 3, "gluten_free": 2, "nut_allergy_severe": 1 }
  },

  "entourage": {
    "principal_sponsors": [
      { "name": "Atty. Ramon Lim", "role": "Ninong", "title": "Atty.", "side": "groom" },
      { "name": "Dr. Aurora Lim", "role": "Ninang", "title": "Dr.", "side": "groom" }
    ],
    "secondary_sponsors": {
      "candle": [ { "name": "Marco Reyes" }, { "name": "Lara Reyes" } ],
      "veil": [ { "name": "Karl Tan" }, { "name": "Issa Tan" } ],
      "cord": [ { "name": "Joaquin Lopez" }, { "name": "Pia Lopez" } ]
    },
    "moh": { "name": "Trina Dela Cruz" },
    "best_man": { "name": "Paolo Santos" },
    "bridesmaids": [ { "name": "..." }, { "name": "..." } ],
    "groomsmen": [ { "name": "..." }, { "name": "..." } ],
    "flower_girl": { "name": "Liana Santos", "age": 6 },
    "ring_bearer": { "name": "Rafa Reyes", "age": 7 },
    "coin_bearer": { "name": "Migo Tan", "age": 8 },
    "bible_bearer": { "name": "Inigo Lim", "age": 9 }
  },

  "family": {
    "parents_bride": [ { "name": "...", "role": "father" }, { "name": "...", "role": "mother" } ],
    "parents_groom": [ { "name": "...", "role": "father" }, { "name": "...", "role": "mother" } ],
    "siblings_bride": [],
    "siblings_groom": [],
    "grandparents": []
  },

  "milestones": [
    { "milestone_id": "m_pre_cana", "title": "Pre-Cana / Discovery Weekend", "due_date": "2026-08-01", "status": "scheduled", "owner": "couple", "category": "parish" },
    { "milestone_id": "m_cenomar_a", "title": "CENOMAR for Partner A", "due_date": "2026-09-01", "status": "in_progress", "owner": "partner_a", "category": "parish" },
    { "milestone_id": "m_marriage_license", "title": "Apply for marriage license", "due_date": "2026-10-15", "status": "pending", "owner": "couple", "category": "civil" },
    { "milestone_id": "m_headcount_lock", "title": "Lock final headcount with caterer", "due_date": "2026-11-04", "status": "pending", "owner": "coordinator", "category": "vendor" }
  ],

  "shot_list": [
    "Bride alone with parents",
    "Groom alone with parents",
    "Both sets of parents together",
    "Principal sponsors group photo",
    "Each Principal Sponsor pair with couple",
    "Coin/arras handover close-up",
    "Veil drape moment",
    "Cord drape moment",
    "First kiss",
    "Recessional walk",
    "Reception entrance",
    "Cake cut",
    "First dance",
    "Sendoff"
  ],

  "playlist": {
    "do_play": ["Sa Ngalan ng Pag-ibig — December Avenue (first dance)"],
    "do_not_play": ["Despacito"]
  },

  "acknowledgments": {
    "deceased": [],
    "absent": [],
    "special_thanks": []
  },

  "change_log": [
    { "ts": "2026-04-10T..", "field": "ceremony.start_time", "from": "16:30", "to": "16:00", "by": "coordinator" }
  ]
}
```

## Schema notes

- **All times are 24-hour in the local timezone** (Asia/Manila, UTC+8). Don't convert to UTC in artifacts — vendors don't read UTC.
- **All money is in PHP** (Philippine pesos). Don't ever store amounts in another currency without explicit conversion fields.
- **`vendors` is an array of vendor objects** — each vendor object embeds the service it provides. A vendor providing two services has two entries (or one entry with multiple services, depending on how the V1 schema settles; the scripts handle either).
- **`entourage` mirrors PH-specific roles.** Don't collapse Principal/Secondary Sponsors into "godparents" — that flattens distinctions the host script and floral count both depend on.
- **`change_log` is append-only.** Never rewrite history. The diff script uses two snapshots, not the change log, but the change log is the audit trail the coordinator dashboard exposes.
- **`version` is monotonically increasing.** Bump it on every write. Artifacts include the version in their footer so a reader can tell if they have stale info.

## Field-level conventions

- IDs use a `prefix_` namespace: `evt_`, `v_`, `g_`, `m_` for events, vendors, guests, milestones
- Phone numbers stored in E.164 format (`+63...`)
- Dates in ISO 8601 (`YYYY-MM-DD`); times as `HH:MM` 24-hour
- Money as integer PHP (no decimals; PHP centavos round at the application layer)

## What this schema deliberately does NOT include

- **Couple-vendor payment processing.** Setnayan V1 explicitly does not process payments (V1 spec section 5.1.4). The `payment` block is for *tracking*, not transacting.
- **Vendor-vendor messaging.** Vendors message through the coordinator, not each other. The coordinator dashboard fans out messages.
- **Guest social graph.** No "who knows who" graph in V1. The seating planner uses tags (Family-Bride, Family-Groom, Ninongs/Ninangs, College Friends, Work) as a lightweight stand-in.
- **Real-time location.** V1 doesn't track vendor or guest location. (V1.5+ has check-in scanners.)
