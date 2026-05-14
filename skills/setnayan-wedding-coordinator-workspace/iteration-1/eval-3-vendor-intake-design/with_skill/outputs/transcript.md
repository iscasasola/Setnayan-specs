# Transcript — Mobile Bar Vendor Intake Design

## Context

Setnayan product designer asked for a V2 vendor onboarding spec for a NEW vendor type — Mobile Bar / Bartender — for Filipino weddings. Required outputs: data model, intake form, JSON shape additions, and reasoning grounded in the existing sync-matrix patterns.

## Steps taken

1. **Read SKILL.md** to ground in the three load-bearing opinions: PH home market, single canonical event with derived views, need-to-know packets driven by `references/sync-matrix.md`.

2. **Read `references/sync-matrix.md`** carefully. Noted the canonical Reads / Writes / Sync triggers / Blocked fields structure used for photographer, videographer, caterer, florist, HMUA, band/DJ, host, coordinator. Found mobile bar already sketched at line 230 as one of the "other vendor types" with the prompt: *"guest count, drink preferences, allergens, venue, setup access."* The task is to expand that one-liner into a full matrix entry.

3. **Read `references/vendor-types.md`** to understand the descriptive shape (typical package, pricing, deposit norms, Setnayan notes). Mobile bar is not yet in the catalog.

4. **Read `references/data-model.md`** to learn the schema conventions: PHP-only money, `HH:MM` 24-hour times Asia/Manila, vendor objects in `vendors[]` array embed the `service` block, change_log is append-only.

5. **Read `assets/sample_event.json`** (Mariel & Joaquin) to anchor the design against a real event with 218 confirmed adults, garden-outdoor reception in Tagaytay, Catholic ceremony at Santuario de San Antonio.

6. **Designed the sync matrix entry for `mobile_bar`** following the canonical structure exactly:
   - Reads: hybrid of caterer (guest count breakdowns, dietary slice, vendor allowance) and band/DJ (reception time/venue, run-of-show music-adjacent segments, power/dB)
   - Writes: standard service-confirmation pattern (call time, team size, deliverables) plus bar-specific (consumption estimate, glassware/ice responsibility, corkage status)
   - Sync triggers: reception time/venue, adult/child/vendor counts, drink-relevant allergen slice, bar_program changes, run-of-show edits
   - Blocked fields: entourage, family, individual guests, shot list, playlist, processional, prep, vendor payments, acknowledgments, couple bio. Bar gets aggregates only.

7. **Wrote `mobile_bar_spec.md`** — the full Reads/Writes/Triggers/Blocked spec with PH-specific notes (corkage, vendor non-alcoholic offering, last-call etiquette, salu-salo VIP pour). Included the structured-tail JSON addition for `scripts/generate_vendor_packet.py` to consume, plus proposed additions to `vendor-types.md` and `data-model.md`.

8. **Wrote `intake_form.md`** — a two-phase onboarding form in Setnayan voice (warm, Filipino-comfortable, "salamat po" used naturally). Phase 1 is a one-time vendor profile (~30 fields). Phase 2 is per-event intake with most fields pre-filled from the canonical event (~25 fields). Form deliberately omits individual guest data, entourage list, shot list, playlist, processional — surfacing the privacy-by-design choices to the vendor.

9. **Wrote `event_json_additions.md`** — the exact JSON shape changes against `sample_event.json`:
   - New top-level `bar_program` block (peer of `theme`, `playlist`)
   - Three new fields on `venues.reception` (water_access, ice_supply, corkage_model)
   - Two new opt-in fields on `guests.dietary_aggregated` (egg_allergy_severe, pregnant_count_flag)
   - New vendor object `v_alon_bar_co` with `service_type: "mobile_bar"` and full service/payment blocks
   - Run-of-show edits: add bar to lead/supporting on cocktail, dinner, toasts, money dance, etc.; add two new bar-only setup/breakdown rows
   - Proposed new V2 budget category: `Bar / Beverage`
   - Change-log entries the diff script would emit

10. **Wrote this transcript.**

## Key design decisions

- **Mobile bar sits between caterer and band/DJ in the matrix.** It inherits the caterer's privacy posture (allergens yes, individual names no) and the band/DJ's reception-floor coordination shape (run-of-show segments, power, dB).
- **The bar reads only the drink-relevant slice of dietary data** (nut, egg, halal-presentation, pregnant flag), not the full caterer aggregate. This honors cross-cutting privacy rule #2 ("dietary/medical only to food vendors") while not over-sharing.
- **VIP table treatment passes count + treatment description, never names.** Names of Ninongs/Ninangs stay with the host, where they belong.
- **`bar_program` lives at event-level, not vendor-level.** It's the couple's program; the vendor reads and refines it. Same pattern as `theme` and `playlist`.
- **Corkage status is a venue field, not a bar field.** Captured on `venues.reception.corkage_model` so it's resolved before the bar even reads the event.
- **`pregnant_count_flag` is opt-in at RSVP, integer count only.** Names never enter the system. This is a new precedent for the schema and worth flagging.
- **Bar gets a new budget category in V2.** Recommended `Bar / Beverage` to avoid distorting the Catering line; large enough range (₱40K–₱150K) to deserve its own row.
- **Coordinator stays the spine.** Bar messages coordinator, never couple or other vendors directly. Matches existing pattern.

## Files produced

All in `/Users/icecasasola/Documents/Claude/Projects/Setnayan/skills/setnayan-wedding-coordinator-workspace/iteration-1/eval-3-vendor-intake-design/with_skill/outputs/`:

- `mobile_bar_spec.md` — full sync-matrix-pattern spec (Reads/Writes/Triggers/Blocked + PH notes + structured-tail JSON)
- `intake_form.md` — vendor-facing onboarding form, two phases, Setnayan voice
- `event_json_additions.md` — exact JSON diff against `sample_event.json`
- `transcript.md` — this file

## What I did not do

- Did not write the actual `scripts/generate_vendor_packet.py` mobile_bar template (the spec proposes it; implementation is a follow-up)
- Did not modify the live `references/sync-matrix.md` or `references/vendor-types.md` files (the spec proposes additions; the user decides when to merge)
- Did not modify `assets/sample_event.json` directly (the additions are documented, not applied — the user decides when to merge)
- Did not produce a generated mobile-bar packet for Mariel & Joaquin (could be generated next from the worked-diff event JSON)
