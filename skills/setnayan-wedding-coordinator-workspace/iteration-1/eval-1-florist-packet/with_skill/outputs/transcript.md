# Transcript — eval-1-florist-packet (with skill)

## Task
Add one more pair of Principal Sponsors to Mariel & Joaquin's wedding (`evt_2026_dela_cruz_santos`):
- Atty. Margarita Borja (Ninang, bride side)
- Mr. Felix Borja (Ninong, bride side)

Then regenerate the packet for Dahon Florals (`v_dahon_florals`), identify which other vendors are affected, and draft messages for each.

## Steps taken

1. **Read the skill** — `SKILL.md`, then `references/sync-matrix.md` (Florist + entourage triggers), then `assets/sample_event.json` to confirm the data shape. Also peeked at `scripts/generate_vendor_packet.py` and `scripts/compute_sync_diffs.py` to understand what fields the scripts read and write.

2. **Located the Florist's reads in the sync matrix:** entourage-derived floral count, theme, color palette, table count, venue access windows, coordinator contact. Confirmed Principal Sponsors map to corsages on the Ninangs and boutonnieres on the Ninongs.

3. **Identified the trigger fan-out** for `entourage.principal_sponsors` from `compute_sync_diffs.py` and the matrix: photographer, videographer, florist, host. Coordinator reads everything (no separate ping). HMUA, caterer, band, are not on this trigger.

4. **Built before/after event JSON** in the outputs folder:
   - `before_event.json` — copy of `assets/sample_event.json`
   - `after_event.json` — same event with two new Principal Sponsors appended to `entourage.principal_sponsors`, version bumped 17 → 18, new entry in `change_log`.

5. **Ran `scripts/generate_vendor_packet.py`** with `after_event.json` and `vendor_id=v_dahon_florals` to produce `florist_packet.md`. Verified the entourage-derived count line now reads "8 corsages/boutonnieres for Principal Sponsors" (was 6).

6. **Ran `scripts/compute_sync_diffs.py`** with before/after to produce `diffs.json`. Output confirmed exactly four affected vendors: Kanlaon Studios (photographer), Ikot Films (videographer), Dahon Florals (florist), Tito Henry Hosts (host).

7. **Wrote `change_messages.md`** — listed the four affected vendors with vendor-specific reasoning and drafted Setnayan-voice messages per vendor. The auto-generated diff messages were generic ("recompute floral/headcount as needed"), so I rewrote them to mention the actual concrete impact for each service type (florist: +2 corsages; photographer: extra portrait pair + extra processional bodies; etc.). Also noted explicitly which vendors are NOT affected and why.

## Key decisions

- **HMUA was not notified.** Aliw Glam's contracted package covers bride + 2 mothers + MOH + bridesmaids + flower girl. Ninangs are not in scope. Per the sync matrix the HMUA trigger fires on changes to bridesmaids / MOH / flower girl, not Principal Sponsors.
- **Caterer was not notified.** Principal Sponsors were already inside the existing 280-pax estimate. No headcount delta. (If the matrix says `entourage.principal_sponsors` should ping the caterer for the salu-salo VIP table, the matrix would need to add that explicitly.)
- **Coordinator (Lakad) was not separately messaged.** Per the matrix: coordinator reads everything via the dashboard.
- **Only Dahon Florals received a regenerated packet.** The other three vendors got a change message only — that's the spirit of "explicit change events with diffs" rule from the SKILL.md, rather than re-sending whole packets.
- **Bumped event version 17 → 18** and added a `change_log` entry, keeping the canonical-event invariant from Rule 1 (one canonical event, derived views).
- **Voice:** kept Filipino-comfortable ("salamat po", "heads up po") without overdoing it. Avoided American-wedding-blog phrasing.

## Files produced (in this folder)

| File | What it is |
|------|------------|
| `before_event.json` | Original sample event (v17) |
| `after_event.json` | Modified event with the two new sponsors (v18) |
| `florist_packet.md` | Regenerated packet for Dahon Florals |
| `diffs.json` | Raw output of `compute_sync_diffs.py` |
| `change_messages.md` | Human-written summary + four vendor messages |
| `transcript.md` | This file |

## Sanity checks

- Florist packet now reads "8 corsages/boutonnieres for Principal Sponsors" (line in "Floral count from entourage" section). All other counts unchanged.
- All four diffs in `diffs.json` correspond to the four vendor service_types listed in the `entourage.principal_sponsors` trigger row of `compute_sync_diffs.py` TRIGGERS table.
- No PII leaked: the florist packet does not contain dietary info, full guest list, or playlist (per the matrix's "Does NOT see" list for florist).
- No new fields invented in the packet that aren't in the canonical event.
