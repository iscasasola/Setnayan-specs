# Transcript — Mobile Bar vendor intake design

## Task
Design data model + intake form + JSON additions for a new "Mobile Bar / Bartender" vendor type for the Setnayan wedding planning platform (Philippines). Produce four files in the eval-3 outputs folder.

## What I did

1. **Read the source event JSON.**
   - Path: `/Users/icecasasola/Documents/Claude/Projects/Setnayan/skills/setnayan-wedding-coordinator/assets/sample_event.json`
   - Studied existing vendor object shape (8 vendors: photographer, videographer, caterer, florist, hmua, band_dj, host, coordinator).
   - Noted reusable patterns: `vendor_id`, `business_name`, `service_type`, `primary_contact`, `service`, `payment`. Each vendor's `service` block is type-specific (e.g. caterer has `headcount_lock_date`, videographer has `sde_target_screening_time`).
   - Studied `run_of_show[]` lead/supporting role vocabulary, `change_log[]` shape, `venues.reception.av_setup`, `guests.dietary_aggregated`.
   - Noted gaps for a mobile bar use case: no utilities/water/power capture on venues, no notification prefs per vendor, no packet delivery / acknowledgment tracking.

2. **Designed the `mobile_bar` data model.**
   - Mirrored existing vendor shape so renderers stay generic.
   - Added a `bar_details` sub-block with: bar style + footprint, alcohol source (vendor / BYOB / mixed), signature cocktails (first-class, since most PH weddings have 1–2), full menu (beer/wine/spirits/non-alc), corkage & permits, consumption caps for the 4 pricing models (open bar capped, consumption, package per head, BYOB service-only), utilities required (power, water, drainage, surface, shade, generator), glassware counts, staff meals, uniform, and legal attestations.
   - Added validation rules (e.g. `last_call_time` ≥ 30 min before `bar_window.end`; bartender ratio warning at 1:75).

3. **Designed the intake form.**
   - 5 sections (business+contact, package+pricing, bar details, ops, compliance+legal), each saving independently.
   - 70+ fields with explicit JSON path mappings, conditional rules, and validation.
   - Mobile-first with Tagalog/English toggle, smart defaults from existing event data, coordinator-assist mode (most PH small mobile bar businesses don't fill forms themselves — the coordinator fills, vendor approves via magic link).

4. **Designed the packet content.**
   - Slice of event JSON sent to vendor: couple basics, reception venue + utilities, guest count + alcohol-relevant dietary, filtered run-of-show, their own service contract echo, other vendors' contact-only info (caterer/coordinator/host/band).
   - Three formats: web view (token-gated), PDF mirror, Viber-friendly text. (Viber is a real PH constraint — many vendors actually consume info via Viber threads.)
   - Versioned with acknowledgment tracking; coordinator can mark ack'd manually for verbal confirmations.

5. **Designed notification triggers.**
   - HIGH (auto re-send + re-ack): event date, venue swap, ≥30min reception time shift, ≥10% guest count change, alcohol source change, corkage permit denial, coordinator swap.
   - MEDIUM (notify, no re-ack): run-of-show edits in bar window ± 30min, service format change, partner-vendor swaps, signature cocktail edits, theme changes.
   - LOW (digest): personal info, guest estimate, other vendor payments, shot list, entourage.
   - Quiet hours 22:00–07:00 PHT; HIGH overrides.

6. **Specified JSON integration.**
   - New vendor object (filled in for sample event with realistic numbers — Lakwatsa Mobile Bar Co., open bar capped at 1,100 drinks, 2 signature cocktails "The Mariel" + "Joaquin Spritz", PHP 95,000 total).
   - Run-of-show: add `mobile_bar` to vocabulary, add 5 segments (load-in, cocktail hour support, dinner support, last call, strike), update existing cocktail/dinner segments' supporting arrays.
   - `venues.reception.utilities` schema for power/water/drainage/generator/surface (benefits caterer too).
   - `guests.dietary_aggregated.no_alcohol` and `designated_drivers` counts.
   - `change_log[]` extension with `triggers_packet_resend`, `affected_vendors`, `severity`.

## Files written
- `mobile_bar_spec.md` — full spec (overview, data model, packet, notifications, integration, edge cases, success metrics)
- `intake_form.md` — section-by-section form with field mappings, validation, UX notes
- `event_json_additions.md` — concrete JSON shape additions with a fully populated sample vendor object
- `transcript.md` — this file

## Key design decisions and tradeoffs

- **Signature cocktails as first-class** (not free-text in `deliverables`). PH couples care about these and want them spelled correctly on the host's announcement. Worth the schema cost.
- **Four pricing models** (open bar capped, consumption, package per head, BYOB service-only) instead of forcing into one. PH mobile bar market is still fragmented — flexibility matters more than uniformity at V2.
- **Packet delivery + notification prefs as new top-level optional blocks** so they're vendor-type-agnostic and can backfill to other vendors in V2.1.
- **Viber as a default channel** alongside email/SMS — recognizing actual PH SMB communication patterns, not Western SaaS defaults.
- **Coordinator-assist mode** in the form — accepting that the vendor often won't fill it themselves. The form should not be the bottleneck.
- **HIGH-severity changes override quiet hours** — day-before-wedding reality. Vendor would rather be woken at 23:30 about a venue change than find out at load-in.

## Open questions flagged in the spec
- Multi-bar setups (2+ bars in one wedding) — V2 fallback is two vendor IDs sharing business_name; full support is V2.x.
- Shrinkage policy for couple-supplied alcohol — proposed enum, but needs legal review.
- Mocktail / dry weddings — `is_alcohol_free` flag added; hides corkage section.
- Late-add vendors (< 30 days out) — proposed `rush_onboarding: true` flag with daily nudge to coordinator.
