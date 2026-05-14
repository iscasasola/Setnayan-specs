# Analysis — Ceremony Shift to 15:30 (Mariel & Joaquin)

## The change

Santuario de San Antonio Parish reassigned the ceremony slot. **`ceremony.start_time` moves from `16:00` to `15:30` — a 30-minute earlier shift.** Everything else on the canonical event (reception start/end, venues, guest count, vendors, entourage, dietary, palette) is unchanged.

## Sync-matrix lookup

The sync-matrix entry for `ceremony.start_time` lists these affected service types:

> `photographer, videographer, florist, hmua, host`

Running `scripts/compute_sync_diffs.py` against `event_before.json` and `event_after.json` returned exactly those five vendor IDs:

| # | Vendor | Service | Notify? | Why |
|---|---|---|---|---|
| 1 | Kanlaon Studios | photographer | **Yes** | Call time tied to ceremony; pre-ceremony sponsor photos shift; family portraits after mass shift. |
| 2 | Ikot Films | videographer | **Yes** | Call time tied to ceremony; mass coverage block shifts; SDE screening at 21:00 unaffected (gains edit runway). |
| 3 | Dahon Florals | florist | **Yes** | Ceremony setup window compresses by 30 min — needs to be dressed by 15:00 instead of 15:30. Reception setup unaffected. |
| 4 | Aliw Glam Studio | HMUA | **Yes** | Bride-prep call time pulls back 30 min (10:30 → 10:00); pre-ceremony touch-up moves to 14:45. |
| 5 | Tito Henry Hosts | host | **Yes (light touch)** | Reception call time stays 17:30 because reception start (18:30) didn't move. Notified anyway because the host's script and acknowledgments reference the ceremony, and the couple's reception arrival timing improves. |

## Vendors NOT affected (and why)

| Vendor | Service | Reason |
|---|---|---|
| Lutong Hapag Catering | caterer | Caterer reads from `reception.start_time`, `reception.end_time`, `reception.access_time`, `guest_count`, `dietary_aggregated`. None of these moved. Per the sync matrix, a ceremony-only time change is silent for the caterer. |
| Bagong Himig Band | band_dj | Same as caterer — band's window is anchored to reception, not ceremony. Catholic ceremonies in PH use the church choir, not the reception band. |
| Lakad Wedding Coordination | coordinator | The coordinator is the one making the change and routing the messages — they don't get notified about their own update; they get a digest at most. |

## Vendors NOT in sync matrix that we should still flag

The sync matrix has bridal car / transportation as a "sketched" entry without an explicit `ceremony.start_time` trigger. **Practically, the bridal car must move 30 min earlier** — pickup at Crowne Plaza, transit to Santuario, and the run-of-show transit blocks at 13:00, 13:30, 15:00 (transit), 17:45 (transit to Tagaytay) all shift their start anchors. The current `sample_event.json` doesn't list a bridal car vendor — if there is one, they need a parallel message; this is a gap to add to the matrix permanently.

The parish officiant (Fr. Marco Diaz) and church choir are also affected but are typically the parties initiating the change rather than being notified by the planner. They were the ones who told the couple about the slot move.

## Run-of-show implications

If we re-derive the run-of-show with `ceremony.start_time = 15:30`, the church-side blocks shift –30 min:

- 12:30 (was 13:00) — bride prep continues, photographer arrives
- 13:00 (was 13:30) — videographer arrives groom prep
- 14:30 (was 15:00) — travel to church
- 15:00 (was 15:30) — pre-ceremony sponsor photos
- **15:30 (was 16:00) — Catholic ceremony**
- 16:45 (was 17:15) — family + entourage portraits
- 17:15 (was 17:45) — travel to Tagaytay
- **18:30 — cocktail hour and arrival (UNCHANGED)**
- Everything from 18:30 onward is unchanged.

The slack between "travel to Tagaytay ends" and "cocktail hour" widens from ~45 min buffer to ~75 min — a healthier buffer, especially for traffic on Aguinaldo Highway. Worth flagging to the couple as an upside.

## Privacy / sync rule check

- No guest PII is in any of the vendor messages.
- No dietary or contact info leaked outside the caterer (and the caterer wasn't messaged).
- All five messages reference only fields each vendor is permitted to read per the matrix.

## What to do next

1. Send the five Viber messages in `vendor_messages.md`.
2. Wait for confirmed call-time replies from photographer, videographer, and HMUA — these are `service.confirmed_call_time` writes that flow back into the canonical event.
3. After confirmations, regenerate the run-of-show via `scripts/generate_timeline.py` so the master timeline reflects the new ceremony anchor.
4. Add a `change_log` entry on the event JSON documenting the parish-driven shift and who initiated it.
5. Add a sync-matrix entry for `bridal_car` so the next ceremony-time change automatically includes them.
