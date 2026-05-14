# Transcript — Eval 2: Ceremony Shift (with_skill)

## Task
Coordinator reports parish moved Mariel & Joaquin's ceremony 30 min earlier (16:00 → 15:30). Walk through which vendors need to know, what each must do, and produce per-vendor Viber messages in Setnayan voice.

## Steps taken

1. **Loaded skill context.** Read `SKILL.md`, `references/sync-matrix.md`, `references/setnayan-brand-voice.md`, and `assets/sample_event.json`. The skill's Rule 3 ("Explicit change events with diffs") and its `compute_sync_diffs.py` script are designed for exactly this case.

2. **Built the before/after canonical event.**
   - Copied `assets/sample_event.json` to `event_before.json` (unchanged baseline).
   - Wrote `event_after.json` with `ceremony.start_time = "15:30"`. Everything else identical.

3. **Ran the diff script.**
   ```
   python3 scripts/compute_sync_diffs.py event_before.json event_after.json --out diffs.json
   ```
   Output: 5 affected vendor IDs — `v_kanlaon_studios` (photographer), `v_ikot_films` (videographer), `v_dahon_florals` (florist), `v_aliw_glam` (HMUA), `v_tito_henry` (host). This matches the `ceremony.start_time` row in the sync-matrix exactly.

4. **Cross-checked vendors NOT flagged.**
   - Caterer (Lutong Hapag): not affected — reads only reception times, which didn't move.
   - Band (Bagong Himig): not affected — reception-anchored.
   - Coordinator (Lakad): originator of the change, no self-notification.

5. **Computed per-vendor concrete impact.** The script emits a generic "call time may shift" template; for the coordinator's actual send, I derived specific new call times by applying the –30 min delta to each vendor's `call_time_confirmed` from the event JSON:
   - Kanlaon Studios: 13:00 → 12:30
   - Ikot Films: 13:30 → 13:00
   - Dahon Florals: 12:00 (setup window unchanged, but dress-by deadline tightens 15:30 → 15:00)
   - Aliw Glam: 10:30 → 10:00
   - Tito Henry: 17:30 (UNCHANGED — host is reception-anchored; light-touch FYI only)

6. **Drafted Viber messages in Setnayan voice.** Warm, practical, mixed Filipino-English where natural ("Salamat po", "Heads up po"). Each message: opens with the change in plain numbers, lists the vendor-specific impact, confirms what's unchanged, asks for the action (confirm new call time). No emoji decoration, no apologies, no aspirational copy.

7. **Wrote outputs.**
   - `vendor_messages.md` — 5 vendor-ready Viber messages plus an explicit "not messaged" section.
   - `analysis.md` — sync-matrix lookup, affected/not-affected reasoning, run-of-show implications, gap notes (bridal_car not in matrix), next steps.
   - `transcript.md` — this file.
   - Plus working artifacts: `event_before.json`, `event_after.json`, `diffs.json`.

## Notable observations

- The script's TRIGGERS map matched the sync-matrix textual entries exactly, which is reassuring for keeping the matrix as the single source of truth.
- Reception start time (18:30) absorbing the upstream shift means the band, caterer, and host are silent — nice demonstration of the "blast radius" concept in the skill.
- Buffer between "travel to Tagaytay ends" and "cocktail hour" widens from ~45 min to ~75 min — an upside worth flagging to the couple.
- The bridal car vendor isn't in the matrix's full triggers and isn't in this event's vendor list, but a real ceremony-time change would require notifying them. Logged as a follow-up to extend the matrix.
