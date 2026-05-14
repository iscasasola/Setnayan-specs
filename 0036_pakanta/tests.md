# Iteration 0036 — Pakanta · Test Plan

**Status:** Drafted 2026-05-14
**Coverage targets:** State machine transitions · render-cap enforcement · RLS · SLA timers · library-save integration · renderer fallback · payment/order linkage

---

## Acceptance scenarios

### State machine

1. **Brief submission flow** — Customer pays ₱1,999 → service_order.status='paid' → `pakanta_orders` row created with `current_phase='brief_received_pending'` → customer fills brief form → row updates to `current_phase='brief_received'` AND `brief_submitted_at = NOW()` AND `sla_deadline_at = NOW() + 30 days`.

2. **Sample upload by owner** — Admin in Pakanta Queue uploads 2 MP3s + approach labels + Suno prompts → server action creates 2 `pakanta_renders` rows (render_index=1, render_index=2) with `delivered_to_couple=TRUE` AND `pakanta_orders.render_count=2` AND `pakanta_orders.current_phase='samples_ready'`.

3. **Couple picks sample** — Customer clicks "Pick this one" on render_index=1 → `pakanta_renders.is_chosen=TRUE` for render_index=1, FALSE for render_index=2 → `pakanta_orders.chosen_render_id` set → `current_phase='sample_chosen'`.

4. **Re-render request** — Customer submits diff notes → `current_phase='rerender_pending'` → admin queue shows the request → owner uploads new MP3 → `pakanta_renders` row with render_index=3 created → `current_phase='rerender_ready'` AND `render_count=3`.

5. **Lock-in flow** — Customer clicks "Lock it in" on render_index=3 → `pakanta_renders.is_chosen=TRUE` for render_index=3, FALSE for previous chosen → `pakanta_orders.current_phase='locked_in'` AND `locked_at=NOW()` AND `final_song_r2_key` populated from chosen render.

6. **Delivery transition** — On lock-in, automatic flip to `current_phase='delivered'` AND `delivered_at=NOW()` once R2 mirror confirms final song is accessible.

### Render-cap enforcement

7. **5-render hard cap** — Re-render request at `render_count=5` returns error `RENDER_CAP_REACHED` with message "You've used all 5 of your renders. Lock in your favorite to finalize." Admin queue does NOT receive the request.

8. **Initial samples count** — render_count=2 immediately after step 2 (both initial samples count toward the cap of 5).

9. **Render-count progression** — Subsequent re-renders increment render_count by 1 each: 3 → 4 → 5 (max).

### RLS policy

10. **Couple-A cannot read Couple-B's pakanta** — Couple-A's session tries `SELECT * FROM pakanta_orders WHERE event_id = '<couple-b's event>'` returns zero rows (not error — silently filtered per RLS pattern).

11. **Guest cannot read pakanta tables** — Guest session (member_type='guest') queries `pakanta_orders` returns zero rows even for their own event.

12. **Couple cannot read non-delivered renders** — Couple tries to read `pakanta_renders` where `delivered_to_couple=FALSE` (owner-side draft) returns zero rows.

13. **Admin sees all** — Admin session reads all `pakanta_orders` + `pakanta_renders` rows across all events.

### SLA timers

14. **30-day auto-lock** — Couple in `sample_chosen` for 30 days → cron job flips to `current_phase='locked_in'` AND `expired_auto_locked` marker AND `locked_at=NOW()` AND emits in-app + email notification "Your Pakanta has been auto-locked".

15. **SLA flag in admin queue** — `brief_submitted_at` > 24hr ago without samples uploaded → admin queue card shows orange SLA flag. > 48hr → red flag.

### Library-save integration

16. **Save to library** — Customer toggles "Save to event library" → `event_song_library` row created AND `pakanta_orders.saved_to_event_library=TRUE` → renderers in 0011/0012/0024 now query this song as default backing track.

17. **Library-save unique constraint** — Calling `save_to_event_library` twice for the same `(event_id, pakanta_id)` is idempotent — second call updates `song_name` if changed, does not create duplicate row.

18. **Toggle availability** — Customer toggles `available_for_renders=FALSE` → renderers stop using this song; row stays in library (still downloadable) but excluded from default-music selection in render forms.

### Renderer fallback

19. **Renderer prefers library song** — Save-the-Date render request for event with library song → renderer uses library song's r2_key as backing track; metadata logs `backing_track_source='pakanta_library'`.

20. **Renderer falls back to stock** — Save-the-Date render for event WITHOUT library song (or with `available_for_renders=FALSE`) → renderer picks from Setnayan stock catalog per template's feel category; metadata logs `backing_track_source='setnayan_catalog'`.

21. **Per-render override** — Couple toggles "Use Pakanta song" OFF on a specific Save-the-Date render UI → that render uses stock catalog even though library song exists; library song stays default for next render.

### Payment + order linkage

22. **Refund-and-cancel** — Customer at `brief_received_pending` for 14 days → admin can trigger refund per 0034 refund flow → `service_order.status='refunded'` AND `pakanta_orders` row marked `current_phase='cancelled'` (new enum value if needed) → customer cannot resubmit brief on this order.

23. **Re-buy after lock-in** — Couple wants entirely different song → cannot reuse same pakanta_id → must place new `service_order` at ₱1,999 → new `pakanta_orders` row created → both pakanta records live independently in event history.

---

## Performance + accessibility budgets

- Brief form interactive paint: < 600ms on throttled 4G
- Sample-picker audio player: < 1s to first playback after Tab Sample button
- Admin Pakanta Queue inbox: < 800ms TTFB even with 1,000 pending orders
- Audio player must be keyboard-accessible (play/pause = Space; seek = arrow keys)
- All admin and customer surfaces must pass axe-core a11y audit at "serious" level

## CI gates

- Tests 1–23 above mapped 1:1 to test cases in `apps/web/tests/integration/pakanta/*.test.ts`
- ESLint rule `setnayan/no-raw-mutation` applies to all pakanta server actions (per Caching & Offline Strategy lock)
- Migration `<timestamp>_pakanta.sql` must drop cleanly via `pnpm db:reset` for test runs
- Suno-prompt scratchpad textarea must enforce 2000-char limit (sanity for prompt length)
