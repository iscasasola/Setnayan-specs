# Onboarding — Canonical Fields Build Plan (2026-06-05)

Closes the gaps between the **owner-locked 19 onboarding outputs** (`Onboarding_Blueprint_2026-05-30.md` §3.0a) and what the live `apps/web` flow persists today. Grounded in `app/onboarding/wedding/{types.ts,actions.ts}` + the `events` schema (migrations `20260719000000_onboarding_v2_event_columns` · `20260724000000_event_style_preferences` · `20260525010000_vendor_hq_geocode_and_event_venue_anchor` · `20260519100000_iteration_0048_event_moderators_foundation` · `20260731000000_master_song_list_foundation`).

> **Key reconciliation finding:** the shipped commit (`commitOnboardingWedding`) is **ahead of Blueprint §3.0** — `region`, the find-vendor shortlist→anchor, `mood_feel_key`, and `music_playlist_seed` already persist. So most of the 19 are done; the real work is **5 gaps**, the largest of which (role) is also the smallest fix.

---

## Already shipped — no work (10 of 19)

| Field | Persisted to |
|---|---|
| Bride / Groom name | `events.bride_name` · `events.groom_name` (+ seeded as the first two `guests` rows) |
| Monogram | `events.monogram_frame_key` + `events.monogram_font_key` (keys, not an SVG blob) |
| Type of wedding | `events.ceremony_type` + `events.is_mixed_ceremony` |
| Religion | `events.ceremony_type` (+ `events.secondary_ceremony_type` for Mixed) |
| Target dates | `events.date_mode` + `events.date_candidates[]` / `events.date_window_start`·`end` |
| Pax | `events.estimated_pax` |
| Budget | `events.budget_band` + `events.estimated_budget_centavos` |
| Song list | `events.music_playlist_seed[]` + `event_song_picks` (via `syncEventSongPicks`) |
| First reception venue | find-vendor shortlist → `event_vendors` (status `considering`) → `recomputeReceptionAnchor` → `events.venue_latitude/longitude` |
| Reception venue type | `events.venue_setting` (derived from first reception "setting" pick) + `style_preferences.reception` |

---

## Gaps to build (5)

### G1 · Role (#3) — bride/groom/helper is dropped at commit  · _highest value, smallest change_
- **Today:** `OnboardingCommitPayload` has **no `role`** field; `commitOnboardingWedding` inserts `event_members{ member_type:'couple' }` and never records bride/groom/helper; `event_moderators` is untouched. The signing user's Google identity *is* captured (`event_members.user_id` → `users`), but **which person they are is lost.**
- **Build:**
  - `types.ts` already has `state.role` (`'bride' | 'groom' | 'helper'`). Add `role` to `OnboardingCommitPayload` and thread it from `onboarding-shell.tsx`.
  - After the `event_members` insert, upsert one `event_moderators` row for `user.id`:
    - `role_subtype` = `bride` / `groom` directly; **helper → a 0048 subtype** (`family_helper` default; the richer parent/planner mapping can come from a later sub-question).
    - `permissions_json` from the 0048 role template (NOT NULL) · `accepted_at = now` · `UNIQUE(event_id,user_id)` already guards dups.
  - **Verify first:** the 0048 migration has a backfill function (`SELECT role_subtype INTO v_role …`) — confirm it doesn't already create a couple moderator row on event insert, to avoid a double-write.
- **Migration:** none (table exists).
- **Done when:** a helper-created event records the host as a helper; a bride/groom self-identification persists for multi-host (0048) + tailored framing.

### G2 · Location (#8) — persist the area picks + seed coords  · _reverses the 2026-06-04 lock_
- **Today:** a single `events.region` key persists; `events.venue_latitude/longitude` only populate **after** a reception venue is shortlisted. Pre-venue, there is no event-level coordinate to filter distance on.
- **Build:**
  - Capture the up-to-2 area picks in onboarding state (the prototype screen-7 model: `{ key, label, region, lat, lon }`).
  - Persist them — **minimal/zero-migration:** `events.style_preferences.search_areas` (array) for display + keep `events.region` = the primary area's region. **Typed alternative:** a `events.search_areas JSONB` column.
  - **Seed `events.venue_latitude/longitude` from the PRIMARY area centroid at commit when no shortlist venue exists** — this is the Blueprint's "Phase-1 working anchor." `recomputeReceptionAnchor` still overwrites it once a real venue locks (unchanged).
- **Migration:** optional (`search_areas JSONB`); zero-migration path via `style_preferences`.
- **Done when:** distance filtering works from the area centroid before any venue is chosen, and the chosen areas survive to the dashboard.

### G3 · Services to look for (#11) — persist the picks + the recommendation fan-out  · _owner-refined 2026-06-05_
- **What it is:** the screen-10 **taxonomy** picker — whatever leaves the couple picks IS "services to look for."
- **Today:** `payload.picks` only drives the auto-inquire loop (`PICK_TO_GROUP` → 1 best-fit per **PLAN_GROUP** → `event_vendors 'considering'` + chat threads). The picked set is never stored; the grain is group (not leaf); there's no location anchoring and no per-leaf cap.
- **Build:**
  1. **Persist the picks** → `events.style_preferences.interested_categories[]` (zero-migration) so the "looking for" set is durable + re-renderable on Home (feeds the behavioral-data moat).
  2. **Recommendation engine (owner rule):** for each picked **leaf**, surface **up to 3 vendors per leaf, per location**, ranked by the 6-dim leaf-match score (`[[project_setnayan_leaf_match_contract]]`).
     - **Anchor priority:** (a) the **reception venue** coords (`events.venue_latitude/longitude`, from #18) when present → 1 location → ≤3/leaf; (b) **fallback** = the up-to-2 picked **areas** (#8 / G2) → ≤3/leaf **per area** = ≤6/leaf.
     - Feeds the find-vendor screen, the Services tab, and Your Plan.
- **Depends on:** G2 (area centroids) + #18 (reception-venue coords) for the location anchor.
- **OPEN — reconcile auto-inquiry (confirm before building; vendor token-burn sensitivity):** today the commit auto-inquires 1/group **always-on**; §3.2 Your Plan adds an **opt-in** 1–5 per-category stepper (default 3). Proposed alignment: recommendations + opt-in inquiries share the **3/leaf/location** ceiling, and the always-on 1/group loop is **retired** in favor of the opt-in.
- **Migration:** none.
- **Done when:** picks persist; each picked leaf shows ≤3 location-anchored, leaf-matched recommendations (reception-venue-first, else the 2 areas).

### G4 · Basic Moodboard (#17) — derive a palette from the feel
- **Today:** only `events.mood_feel_key` (the feel string: `timeless` / `modern` / …) persists.
- **Build:** add a **deterministic** FEEL→palette map (no AI) and persist the basic palette as the iteration-0010 baseline moodboard — either `events.style_preferences.basic_moodboard` (zero-migration) or a real 0010 mood-board row. Surfaces on Home + seeds the mood-board editor; `feel = others` → no preset (built later in 0010).
- **Migration:** none if stored in `style_preferences`; else the 0010 row.
- **Done when:** picking a feel yields a saved basic palette the couple sees post-onboarding.

### G5 · In-app services (#19) — verify / port the Your Plan persistence
- **Today:** spec §3.2 says screen 16 persists `events.style_preferences.interested_services`; the commit runs at screen 11 (before the plan screen), so this is a **separate post-commit update**. The live `#screen-plan` is flagged pre-§3.2-redesign (DECISION_LOG 2026-06-05).
- **Build:** confirm the Your-Plan action writes `interested_services` to the already-created event; port the §3.2 three-screen redesign (Your Plan → Boost & enhance → Interested) if still on the retired bundle layout.
- **Migration:** none (column exists).
- **Done when:** saved / "hearted" services persist to `style_preferences.interested_services` and drive the Services tab.

---

## Corpus drift fixed alongside (spec only, no code)
- `monogram_svg` → `monogram_frame_key` + `monogram_font_key` (§3.0a + §3.1a screen-5 row).
- §3.0 "area transient / not stored" lock → **reversed** (see §3.0a).
- Song-list format: code stores `music_playlist_seed` as `"Title|Artist"`; the Song Bank model wants Apple track IDs — reconcile as a separate follow-on (`[[project_setnayan_song_bank_model]]`).

## Out of scope (unchanged)
- `event_vendor_preferences` vendor-**matching** writes for ceremony / catering / photo-video prefs (#13/#14/#15) — these persist as a **display-only** `style_preferences` blob today; the matching write stays **Phase-A2 BLOCKED** on the `canonical_service` FK + vendor facet-tagging.

## Suggested order
**G1** (tiny, high value) → **G3** (zero-migration) → **G2** (lock reversal + coords) → **G4** (moodboard) → **G5** (verify/port). G1–G3 are commit-path-only and can ship in one PR; G2 also adds the area-capture UI; G4/G5 are follow-ons. All commit-path writes stay **best-effort** (a sub-write must never fail the event/membership commit — the existing pattern).
